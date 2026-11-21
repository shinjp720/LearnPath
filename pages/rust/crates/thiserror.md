---
title: thiserror
layout: default
---

# thiserror <a id="top" data-name="TOP"></a>

thiserror は、Rust で、独自のエラー型を、簡単に定義するための crate である。`#[derive(Error)]` を付けて、`#[error("...")]` で、メッセージを書くだけで、標準ライブラリの `std::error::Error` トレイトと、`Display` トレイトの実装を、自動で生成する。`#[from]` を付けると、`From` トレイトの実装も生成され、`?` 演算子で、下位のエラーを、自分のエラー型に、自動で変換できる。

生成されるコードは、手で書いた実装と、同じものである。thiserror は、公開 API に現れないため、手書きの実装から、thiserror に切り替えても、逆に切り替えても、利用側にとって破壊的変更にならない。そのため、ライブラリが、エラー型の定義に使うのに、向いている。

アプリケーションで、エラーの種類を区別せずに、手軽に扱いたい場合は、`anyhow` を使う (「anyhow」のドキュメントを参照)。ライブラリの作者が、呼び出し側に、エラーの内容を、正確に伝えたい場合は、thiserror を使う。この2つは、組み合わせて使われることも、多い。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| derive マクロ | `#[derive(Error)]` だけで、`Error` トレイトの実装を生成する。マクロの crate なので、実行時のコストは、手書きと同等 |
| 生成するもの | `Error` (`source()` を含む)、`Display` (`#[error]` がある場合)、`From` (`#[from]` がある場合) |
| 公開 API に現れない | 利用側のコードは、`std::error::Error` だけを見る。thiserror に依存しない |
| 型の種類 | 列挙型 (enum)、名前つきフィールドの構造体、タプル構造体、ユニット構造体 |
| メッセージ | `#[error("...")]` に、`{0}` や `{field}` の形で、フィールドを埋め込める |
| 原因の連鎖 | `#[source]` や `#[from]` で、原因のエラーを持たせて、`source()` で、たどれるようにする |
| 透過 | `#[error(transparent)]` で、`Display` と `source()` を、内側のエラーに任せる |
| `no_std` | `default-features = false` で、標準ライブラリなしでも使える (新しめの Rust が必要) |

### 他の方法との比較

| | 手書き | thiserror | anyhow | snafu |
| --- | --- | --- | --- | --- |
| 主な用途 | 何でも | **ライブラリ**の、エラー型の定義 | **アプリケーション**の、手軽なエラー処理 | ライブラリ、アプリケーション |
| エラー型 | 自分で定義 | 自分で定義 (enum や struct) | 1つの型 (`anyhow::Error`) | 自分で定義 |
| 呼び出し側での、種類の判別 | `match` で可能 | `match` で可能 | `downcast_ref` が必要 | `match` で可能 |
| コンテキストの追加 | 自分で書く | `#[from]` や、フィールドで表す | `.context()` | コンテキストセレクタ |
| 記述量 | 多い | 少ない | 最も少ない | 中くらい |

<pre><code class="tips">迷ったときの目安は、「そのエラーを、呼び出し側が、種類によって、処理を分けるか」である。分ける (ライブラリ) なら、thiserror。分けず、ログや表示に回すだけ (アプリケーション) なら、anyhow。
アプリケーションの中でも、アプリ内の各モジュールの境界で、エラーを、きちんと型で表したいなら、thiserror を使うことは、多い。</code></pre>

### 向いている場面と向いていない場面

| 向いている | 向いていない |
| --- | --- |
| ライブラリが、公開するエラー型を、定義する | エラーの種類を、区別せずに、まとめて扱いたい (anyhow が向く) |
| エラーの種類ごとに、呼び出し側が、処理を変える | プロトタイプや、小さなスクリプト (anyhow の方が、手軽) |
| 下位のエラー (`io::Error` など) を、`?` で、自分のエラー型に変換する | エラーに、豊かな診断情報 (ソースコードの位置の表示など) を持たせたい (miette などが向く) |
| `Display` と `source()` を、自動で実装して、記述を減らす | 実行時に、エラーの型を、動的に組み立てたい |

<pre><code class="caution">このドキュメントは、thiserror 2.0.21 (2026年9月) を前提にしている。最小の Rust のバージョンは、このバージョンで 1.77 だが、バージョンによって、変わってきた。
古い記事 (1.x) の書き方の一部は、2.0 で、コンパイルエラーになる (raw identifier の指定、位置引数の混在など)。詳しくは、「古いコードからの変更」の章を参照。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

```bash
cargo add thiserror
```

```toml
[dependencies]
thiserror = "2"   # cargo add が、最新の 2.x を入れる
```

### フィーチャーと環境

| 項目 | 内容 |
| --- | --- |
| `std` | 既定で有効。標準ライブラリを使う |
| `default-features = false` | `std` を無効にして、`no_std` で使う。このとき、`core::error::Error` が必要で、Rust 1.81 以降が、必要になる |
| 最小の Rust のバージョン | 1.77 (thiserror 2.0.21) |
| 直接の依存 | `derive(Error)` を使う crate は、`Cargo.toml` に、`thiserror` を、**直接**書く必要がある |

```toml
# no_std で使う場合
[dependencies]
thiserror = { version = "2", default-features = false }
```

<pre><code class="caution">2.0 から、derive(Error) を使うコードを含む crate は、エラー型の中身に関係なく、thiserror を、直接の依存として、Cargo.toml に書く必要がある。
他の crate が、再エクスポートしている derive を、経由して使う場合は、この点に注意する。</code></pre>

<pre><code class="tips">thiserror は、マクロの crate であり、実行時には、何も追加されない。そのため、依存として加えても、バイナリのサイズや、実行速度への影響は、ほとんどない。
ただし、マクロの展開 (コンパイル) の時間は、かかるため、エラー型が非常に多い crate では、ビルド時間に、わずかに影響する。</code></pre>

### use の書き方

```rust
use thiserror::Error;
```

`thiserror::Error` は、derive マクロである。`std::error::Error` (トレイト) と同じ名前だが、マクロとトレイトは、別の名前空間に属するため、同じファイルで、両方を `use` できる。

```rust
use std::error::Error;
use thiserror::Error;

#[derive(Error, Debug)]
#[error("設定が不正である")]
struct ConfigError;

// std::error::Error トレイトを、そのまま使える
fn describe(e: &dyn Error) -> String {
    e.to_string()
}

fn main() {
    println!("{}", describe(&ConfigError)); // 設定が不正である
}
```

---

## 基本 <a id="basic" data-name="基本"></a>

### 最小の例

```rust
use std::fs;
use std::io;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ConfigError {
    // #[from]: io::Error から ConfigError への From を生成する
    #[error("設定ファイルを読み込めない")]
    Io(#[from] io::Error),

    // 名前つきフィールドを、メッセージに埋め込む
    #[error("{key} の値が不正である: {value}")]
    InvalidValue { key: String, value: String },

    // タプルのフィールドは {0} で参照する
    #[error("必須の項目がない: {0}")]
    Missing(&'static str),
}

fn load(path: &str) -> Result<String, ConfigError> {
    // ? で、io::Error が、自動で ConfigError::Io に変換される
    let text = fs::read_to_string(path)?;
    if text.trim().is_empty() {
        return Err(ConfigError::Missing("name"));
    }
    Ok(text)
}

fn main() {
    match load("/this/file/does/not/exist") {
        Ok(text) => println!("{text}"),
        Err(e) => println!("エラー: {e}"), // エラー: 設定ファイルを読み込めない
    }
}
```

`#[derive(Error, Debug)]` の、`Debug` は、自分で付ける必要がある。`Error` トレイトは、`Debug` と `Display` を、スーパートレイトとして要求するため、`Debug` がないと、コンパイルエラーになる。

### derive が生成するもの

| 生成されるもの | 条件 |
| --- | --- |
| `impl std::error::Error` | 常に生成される。`source()` は、`#[source]`、`#[from]`、または `source` という名前のフィールドから、生成される |
| `impl std::fmt::Display` | 構造体、または、すべての列挙型のバリアントに、`#[error("...")]` がある場合 |
| `impl From<T>` | `#[from]` が付いたフィールドごとに生成される |
| `Error::provide()` | `Backtrace` 型のフィールドがある場合 (nightly の Rust が必要) |

### 属性の一覧

| 属性 | 付ける場所 | 内容 |
| --- | --- | --- |
| `#[error("...")]` | 構造体、バリアント | `Display` のメッセージを指定する |
| `#[error(transparent)]` | 構造体、バリアント | `Display` と `source()` を、内側のエラーに任せる (フィールドが 1 つだけのとき) |
| `#[error(fmt = 関数)]` | 構造体、バリアント | `Display` を、自分で書いた関数で行う (公式ドキュメントには、記載がない) |
| `#[from]` | フィールド | `From` を生成する。`#[source]` を、含む |
| `#[source]` | フィールド | `source()` で、返す原因のエラーを指定する (フィールド名が `source` なら、省略できる) |
| `#[backtrace]` | フィールド | バックトレースを、原因から引き継ぐ (nightly が必要) |

<pre><code class="caution">enum のバリアントの一部にだけ #[error("...")] を付けると、「missing #[error("...")] display attribute」というエラーになる。
Display を自分で実装する場合は、すべてのバリアントから、#[error] を外す。</code></pre>

### 型の種類

```rust
use thiserror::Error;

// 列挙型: エラーの種類が、複数あるとき (最も一般的)
#[derive(Error, Debug)]
enum ParseError {
    #[error("入力が空である")]
    Empty,
    #[error("{0} 文字目が不正である")]
    BadChar(usize),
    #[error("行 {line} の形式が不正である: {reason}")]
    BadLine { line: usize, reason: String },
}

// 名前つきフィールドの構造体
#[derive(Error, Debug)]
#[error("{name} は、すでに存在する")]
struct AlreadyExists {
    name: String,
}

// タプル構造体
#[derive(Error, Debug)]
#[error("タイムアウト ({0} 秒)")]
struct Timeout(u64);

// ユニット構造体
#[derive(Error, Debug)]
#[error("キャンセルされた")]
struct Cancelled;

fn main() {
    println!("{}", ParseError::Empty);
    println!("{}", ParseError::BadChar(3));
    println!("{}", ParseError::BadLine { line: 2, reason: "区切りがない".into() });
    println!("{}", AlreadyExists { name: "a.txt".into() });
    println!("{}", Timeout(30));
    println!("{}", Cancelled);
}
```

```text
入力が空である
3 文字目が不正である
行 2 の形式が不正である: 区切りがない
a.txt は、すでに存在する
タイムアウト (30 秒)
キャンセルされた
```

<pre><code class="tips">エラーの種類を、呼び出し側が match で区別する場合は、列挙型にする。種類が 1 つだけで、情報を持たせたい場合は、構造体にする。
エラー型を作る前に、「呼び出し側は、このエラーを受け取って、何をするか」を考えると、種類の分け方が、決めやすい。</code></pre>

---

## エラーメッセージ <a id="message" data-name="エラーメッセージ"></a>

### フィールドの埋め込み

`#[error("...")]` の中で、フィールドを、`{}` で、埋め込める。書き方は、標準の `format!` に似ている。

| 書き方 | 展開されるコード |
| --- | --- |
| `#[error("{var}")]` | `write!("{}", self.var)` |
| `#[error("{0}")]` | `write!("{}", self.0)` |
| `#[error("{var:?}")]` | `write!("{:?}", self.var)` |
| `#[error("{0:?}")]` | `write!("{:?}", self.0)` |

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum Error {
    #[error("キー `{0}` のデータがない")]
    NotFound(String),

    #[error("ヘッダーが不正である (期待: {expected:?}, 実際: {found:?})")]
    InvalidHeader { expected: String, found: String },

    // 書式指定も使える
    #[error("温度が高すぎる: {celsius:.1} 度 (上限 {limit:>5})")]
    TooHot { celsius: f64, limit: u32 },
}

fn main() {
    println!("{}", Error::NotFound("user".into()));
    println!(
        "{}",
        Error::InvalidHeader { expected: "PNG".into(), found: "JPG".into() }
    );
    println!("{}", Error::TooHot { celsius: 91.234, limit: 80 });
}
```

```text
キー `user` のデータがない
ヘッダーが不正である (期待: "PNG", 実際: "JPG")
温度が高すぎる: 91.2 度 (上限    80)
```

### 追加の引数

標準の `format!` と同じように、追加の引数に、任意の式を渡せる。引数の式の中から、フィールドを参照するときは、名前つきフィールドは **`.名前`**、タプルのフィールドは **`.0`** と書く。

```rust
use thiserror::Error;

#[derive(Debug)]
struct Limits {
    lo: usize,
    hi: usize,
}

fn first_char(s: &String) -> char {
    s.chars().next().unwrap()
}

#[derive(Error, Debug)]
enum Error {
    // 定数の式を、名前つきの引数として渡す
    #[error("先読みフレーム数 {0} が不正である (期待: {max} 未満)", max = i32::MAX)]
    InvalidLookahead(u32),

    // 引数の中で、タプルのフィールドを .0 で参照する
    #[error("最初の文字は小文字でなければならないが、{:?} だった", first_char(.0))]
    WrongCase(String),

    // 引数の中で、名前つきフィールドを .名前 で参照する
    #[error("添字 {idx} が不正である (範囲: {} から {})", .limits.lo, .limits.hi)]
    OutOfBounds { idx: usize, limits: Limits },
}

fn main() {
    println!("{}", Error::InvalidLookahead(9));
    println!("{}", Error::WrongCase("Hello".into()));
    println!("{}", Error::OutOfBounds { idx: 12, limits: Limits { lo: 0, hi: 9 } });
}
```

<pre><code class="caution">タプル構造体やタプルのバリアントで、{0} のような、番号による参照と、追加の位置引数を、同時に使うと、2.0 以降は、コンパイルエラーになる (どの引数を指すのかが、曖昧になるため)。
追加の引数は、名前つき (max = ...) にするか、フィールドの参照 (.0) を使う。</code></pre>

### 自分で書いた関数で、整形する

`#[error(fmt = 関数)]` で、`Display` の中身を、自分の関数で書ける。関数は、フィールドの参照と、`&mut Formatter` を受け取って、`fmt::Result` を返す。

```rust
use std::fmt;
use thiserror::Error;

// フィールドの参照と Formatter を受け取る
fn show_hex(code: &u32, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "エラーコード 0x{code:04X}")
}

#[derive(Error, Debug)]
enum DeviceError {
    #[error(fmt = show_hex)]
    Code(u32),

    #[error("接続が切れた")]
    Disconnected,
}

fn main() {
    println!("{}", DeviceError::Code(0xBEEF)); // エラーコード 0xBEEF
    println!("{}", DeviceError::Disconnected);
}
```

<pre><code class="caution">#[error(fmt = ...)] は、公式ドキュメント (docs.rs のトップページ) には記載がなく、テストコードで、使い方を確認できる機能である。今後、仕様が変わる可能性があるため、使う場合は、バージョンを固定して、テストを書く。
通常は、#[error("...")] と、追加の引数で足りることが多い。</code></pre>

### メッセージの書き方

| 指針 | 理由 |
| --- | --- |
| 短く、1行で書く | ログや、エラーの連鎖の表示で、読みやすい |
| 文の最後に、句点を付けない (英語なら、小文字で始めて、ピリオドなしにする) | 他のエラーと連結して表示しても、不自然にならない (Rust API ガイドラインの推奨) |
| 「何が起きたか」を書く。原因は、`source()` に任せる | メッセージに、原因の内容を重ねて書くと、連鎖を表示したときに、重複する |
| 利用者の入力や、パスなど、状況を特定できる値を含める | 原因の調査が、早くなる |
| 秘密情報 (パスワード、トークン) を含めない | ログに残るため |

<pre><code class="tips">日本語のメッセージは、そのまま書ける。ただし、ライブラリで、多言語の利用者に使われる可能性があるなら、メッセージは、英語で書き、翻訳は、利用側 (アプリケーション) で、エラーの種類 (バリアント) に応じて行う方が、柔軟である。</code></pre>

---

## エラーの原因 (source) <a id="source" data-name="エラーの原因"></a>

エラーは、多くの場合、下位のエラー (原因) によって、引き起こされる。`Error` トレイトの `source()` メソッドは、原因のエラーを返す。thiserror は、次のいずれかのフィールドを、原因として、`source()` に実装する。

| 条件 | 例 |
| --- | --- |
| `#[source]` が付いたフィールド | `#[source] cause: io::Error` |
| `source` という名前のフィールド | `source: io::Error` |
| `#[from]` が付いたフィールド | `Io(#[from] io::Error)` (`#[from]` は、`#[source]` を含む) |

原因になれる型は、`std::error::Error` を実装した型、または、`dyn std::error::Error` に、参照を外せる型 (`Box<dyn Error + Send + Sync>`、`anyhow::Error` など) である。`Option` で包んだ型も使える。

```rust
use std::error::Error;
use std::io;
use thiserror::Error;

#[derive(Error, Debug)]
enum RepoError {
    #[error("ファイルを開けない: {path}")]
    Open {
        path: String,
        #[source] // フィールド名が source なら、省略できる
        source: io::Error,
    },
}

#[derive(Error, Debug)]
#[error("ユーザーを取得できない")]
struct ServiceError(#[from] RepoError);

#[derive(Error, Debug)]
#[error("原因が、あるかもしれない")]
struct MaybeCaused {
    #[source]
    source: Option<io::Error>,
}

fn main() {
    let repo = RepoError::Open {
        path: "users.json".into(),
        source: io::Error::new(io::ErrorKind::NotFound, "見つからない"),
    };
    let service = ServiceError::from(repo);

    // source() で、1 段下の原因を取り出す
    println!("{}", service.source().is_some()); // true

    println!("{}", MaybeCaused { source: None }.source().is_none()); // true
}
```

### エラーの連鎖をたどる

`source()` を、くり返し呼ぶと、最も下位の原因まで、たどれる。

```rust
use std::error::Error;
use std::io;
use thiserror::Error;

#[derive(Error, Debug)]
#[error("ファイルを開けない")]
struct OpenError(#[from] io::Error);

#[derive(Error, Debug)]
#[error("ユーザーを取得できない")]
struct UserError(#[from] OpenError);

/// エラーと、その原因を、「: 」でつなげて、1 つの文字列にする
fn report(e: &dyn Error) -> String {
    let mut text = e.to_string();
    let mut current = e.source();
    while let Some(inner) = current {
        text.push_str(&format!(": {inner}"));
        current = inner.source();
    }
    text
}

fn main() {
    let io_err = io::Error::new(io::ErrorKind::PermissionDenied, "権限がない");
    let err = UserError::from(OpenError::from(io_err));
    println!("{}", report(&err));
}
```

```text
ユーザーを取得できない: ファイルを開けない: 権限がない
```

<pre><code class="caution">原因のエラーを、source() に返しつつ、自分の Display にも、同じ原因のメッセージを含めると、連鎖を表示したときに、同じ内容が、二重に出る。
どちらか一方に、決める。標準的なのは、「Display には、自分の層で起きたことだけを書き、原因は、source() で返す」方法である。</code></pre>

<pre><code class="tips">エラーの連鎖を表示する処理は、自分で書かなくても、anyhow::Error を使うと、{:#} (1 行で連結) や {:?} (複数行で、原因の一覧) で、表示できる。
アプリケーションの最上位 (main など) で、エラーを表示する部分に、anyhow を使う構成が、よく使われる。</code></pre>

---

## From と ? 演算子 <a id="from" data-name="Fromと?演算子"></a>

### #[from] による自動変換

`#[from]` を付けたフィールドを持つバリアントには、`From<そのフィールドの型>` が生成される。`?` 演算子は、エラーを、関数の戻り値のエラー型に、`From` で変換するため、`?` だけで、変換される。

```rust
use std::fs;
use std::io;
use std::num::ParseIntError;
use thiserror::Error;

#[derive(Error, Debug)]
enum Error {
    #[error("入出力のエラー")]
    Io(#[from] io::Error),
    #[error("数値を解析できない")]
    Parse(#[from] ParseIntError),
}

fn read_number(path: &str) -> Result<i32, Error> {
    let text = fs::read_to_string(path)?; // io::Error → Error::Io
    let n = text.trim().parse::<i32>()?;  // ParseIntError → Error::Parse
    Ok(n)
}

fn main() {
    let r = read_number("/this/file/does/not/exist");
    println!("{}", matches!(r, Err(Error::Io(_)))); // true
}
```

### #[from] の制約

| 制約 | 内容 | コンパイラのメッセージ |
| --- | --- | --- |
| 同じ型の `#[from]` は、1 つだけ | 同じ原因の型を、複数のバリアントで、`#[from]` にできない (`From` の実装が、重複する) | `conflicting implementations of trait From<...>` |
| 他のフィールドを持てない | `#[from]` のバリアントは、原因 (と、`Backtrace`) 以外の、フィールドを持てない | `deriving From requires no fields other than source and backtrace` |

どちらの場合も、`#[from]` を使わず、`#[source]` を付けて、`map_err` で、自分で変換する。

<pre><code class="tips">? 演算子の変換は、From の実装だけで決まる。? で変換できないときは、「the trait From&lt;X&gt; is not implemented」という趣旨のエラーが出る。#[from] を付け忘れていないかを、確認する。</code></pre>

### コンテキストを付けて変換する (map_err)

同じ種類の原因 (`io::Error`) でも、「どのファイルか」のような、状況を、エラーに含めたいときがある。`#[from]` では、他のフィールドを持てないため、`#[source]` と、`map_err` を使う。

```rust
use std::fs;
use std::io;
use std::num::ParseIntError;
use std::path::{Path, PathBuf};
use thiserror::Error;

#[derive(Error, Debug)]
enum LoadError {
    // Path と PathBuf は、そのまま {path} と書ける
    #[error("{path} を読み込めない")]
    Read {
        path: PathBuf,
        #[source]
        source: io::Error,
    },
    #[error("{path} の値を解析できない")]
    Parse {
        path: PathBuf,
        #[source]
        source: ParseIntError,
    },
}

fn read_number(path: &Path) -> Result<i32, LoadError> {
    let text = fs::read_to_string(path).map_err(|source| LoadError::Read {
        path: path.to_path_buf(),
        source,
    })?;
    text.trim().parse().map_err(|source| LoadError::Parse {
        path: path.to_path_buf(),
        source,
    })
}

fn main() {
    let err = read_number(Path::new("/this/file/does/not/exist")).unwrap_err();
    println!("{}", matches!(err, LoadError::Read { .. })); // true
    println!("{err}"); // /this/file/does/not/exist を読み込めない
}
```

<pre><code class="tips">Path と PathBuf は、標準では Display を実装していないが、thiserror が、メッセージの中で、内部的に display() を使うため、{path} と書くだけで、表示できる (std フィーチャーが有効なとき)。
それ以外の、Display を実装しない型 (Vec など) は、{0:?} のように、Debug 形式で、埋め込む。</code></pre>

---

## transparent (透過) <a id="transparent" data-name="transparent"></a>

`#[error(transparent)]` を付けると、`Display` と `source()` を、内側のエラーに、そのまま任せる。メッセージを、足さない。フィールドは、1つだけ持つ。

### 「その他」のバリアント

列挙型に、「ここまでに挙げた以外のエラー」を、そのまま包むバリアントが、必要なときに使う。

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum AppError {
    #[error("ユーザーが、見つからない: {0}")]
    UserNotFound(u32),

    // 想定していないエラーは、そのまま包む (メッセージと原因は、anyhow::Error に任せる)
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}

fn find_user(id: u32) -> Result<String, AppError> {
    if id == 0 {
        return Err(AppError::UserNotFound(id));
    }
    // anyhow::Error を返す処理を、? で包む
    let name = lookup(id)?;
    Ok(name)
}

fn lookup(id: u32) -> anyhow::Result<String> {
    anyhow::ensure!(id < 100, "ID が大きすぎる: {id}");
    Ok(format!("user{id}"))
}

fn main() {
    println!("{}", find_user(0).unwrap_err()); // ユーザーが、見つからない: 0
    println!("{}", find_user(500).unwrap_err()); // ID が大きすぎる: 500
}
```

### 実装の詳細を隠す (不透明なエラー型)

公開するエラー型を、不透明な構造体にして、内部の表現 (列挙型) を、非公開にすることで、内部の表現を、後から、自由に変更できる。

```rust
use thiserror::Error;

// 公開される、不透明なエラー型。内側の ErrorRepr に、すべて任せる
#[derive(Error, Debug)]
#[error(transparent)]
pub struct PublicError(#[from] ErrorRepr);

impl PublicError {
    // 公開したい情報だけを、メソッドとして出す
    pub fn is_not_found(&self) -> bool {
        matches!(self.0, ErrorRepr::NotFound(_))
    }
}

// 非公開。バージョンアップで、自由に変更できる
#[derive(Error, Debug)]
enum ErrorRepr {
    #[error("{0} が見つからない")]
    NotFound(String),
    #[error("内部のエラー")]
    Internal,
}

pub fn get(key: &str) -> Result<String, PublicError> {
    if key.is_empty() {
        return Err(ErrorRepr::Internal.into());
    }
    Err(ErrorRepr::NotFound(key.to_string()).into())
}

fn main() {
    let err = get("name").unwrap_err();
    println!("{err}"); // name が見つからない
    println!("{}", err.is_not_found()); // true
}
```

<pre><code class="tips">公開する列挙型のバリアントは、そのまま公開 API になるため、バリアントの追加や、フィールドの変更が、破壊的変更になる。変更する可能性が高いライブラリでは、不透明な構造体にするか、列挙型に #[non_exhaustive] を付ける。</code></pre>

---

## 型の設計 <a id="design" data-name="型の設計"></a>

### 列挙型を、将来の変更に備える

```rust
use thiserror::Error;

// #[non_exhaustive]: バリアントを、後から追加しても、破壊的変更にならない
#[derive(Error, Debug)]
#[non_exhaustive]
pub enum ParseError {
    #[error("入力が空である")]
    Empty,
    #[error("不正な文字: {0}")]
    BadChar(char),
}

fn main() {
    let e = ParseError::BadChar('x');
    // 他の crate から使う側では、_ の腕が必要になる。同じ crate の中では、不要で、警告が出る
    match e {
        ParseError::Empty => println!("空"),
        ParseError::BadChar(c) => println!("不正な文字: {c}"),
    }
}
```

### ジェネリクスを持つエラー型

型パラメータを持つ構造体や列挙型にも、derive を使える。メッセージで使う型パラメータには、必要なトレイトの境界 (`Debug` など) が、自動で、推論される。

```rust
use thiserror::Error;

#[derive(Error, Debug)]
#[error("{0:?} は、範囲外である")]
struct OutOfRange<T>(T);

fn main() {
    println!("{}", OutOfRange(300u16)); // 300 は、範囲外である
    println!("{}", OutOfRange("abc")); // "abc" は、範囲外である
}
```

### エラー型のサイズ

| 状況 | 内容 |
| --- | --- |
| `Result<T, E>` の `E` が大きい | `Result` 全体が、大きくなり、成功時にも、そのサイズを、コピーする。clippy の `result_large_err` が警告することがある |
| 対処 | 大きいフィールドを持つバリアントは、`Box` に入れる (`Box<LargeError>`) |

<pre><code class="tips">エラー型が、大きな String や、複数のフィールドを持つと、Result が、大きくなる。通常のプログラムでは、気にしなくてよいが、頻繁に呼ばれる関数が返す型では、Box に入れる方法を考える。</code></pre>

---

## バックトレース <a id="backtrace" data-name="バックトレース"></a>

thiserror は、`std::backtrace::Backtrace` 型のフィールドを、自動で検出して、`Error::provide()` で、提供する。ただし、この機能は、**nightly の Rust** (1.73 以降) が必要である。

| 状況 | 結果 |
| --- | --- |
| nightly の Rust で、`Backtrace` 型のフィールドがある | `provide()` で、バックトレースが提供される |
| 安定版の Rust で、`Backtrace` 型のフィールドがある | コンパイルエラー (`use of unstable library feature error_generic_member_access`)。Rust 1.84 の安定版で確認 |
| `#[backtrace]` を、原因のフィールドに付ける | 原因の `provide()` を、引き継ぐ (nightly が必要) |

<pre><code class="caution">安定版の Rust では、thiserror のエラー型に、Backtrace 型のフィールドを持たせられない (型の名前で検出されるため)。
将来、安定版で使えるようになる可能性があるため、使う前に、最新の公式ドキュメントで確認する。</code></pre>

安定版で、バックトレースが必要な場合は、アプリケーションの側で、`anyhow` を使う。`anyhow::Error` は、環境変数 `RUST_BACKTRACE` (または `RUST_LIB_BACKTRACE`) が、設定されていれば、エラーの作成時に、バックトレースを記録する。

---

## anyhow との組み合わせ <a id="anyhow" data-name="anyhowとの組み合わせ"></a>

ライブラリでは thiserror、アプリケーションでは anyhow、という使い分けが、一般的である。ライブラリが返す、thiserror のエラーは、`?` で、そのまま `anyhow::Error` に変換できる。

```rust
use anyhow::{Context, Result};
use thiserror::Error;

// ライブラリ側: thiserror で、エラー型を定義する
#[derive(Error, Debug)]
pub enum ConfigError {
    #[error("必須の項目がない: {0}")]
    Missing(&'static str),
}

fn load_config() -> Result<(), ConfigError> {
    Err(ConfigError::Missing("name"))
}

// アプリケーション側: anyhow::Result を返して、? で包む
fn run() -> Result<()> {
    load_config().context("起動時の設定の読み込みに失敗した")?;
    Ok(())
}

fn main() {
    let err = run().unwrap_err();
    println!("{err}");   // 起動時の設定の読み込みに失敗した
    println!("{err:#}"); // 起動時の設定の読み込みに失敗した: 必須の項目がない: name

    // 元の型に、戻して、種類で判別する
    if let Some(ConfigError::Missing(key)) = err.downcast_ref::<ConfigError>() {
        println!("足りない項目: {key}");
    }
}
```

```text
起動時の設定の読み込みに失敗した
起動時の設定の読み込みに失敗した: 必須の項目がない: name
足りない項目: name
```

| 方向 | 方法 |
| --- | --- |
| thiserror の型 → `anyhow::Error` | `?`、または `.into()`。`Send + Sync + 'static` の型なら、そのまま変換できる |
| `anyhow::Error` → thiserror の型 | `#[error(transparent)] Other(#[from] anyhow::Error)` の、バリアントを作る |
| `anyhow::Error` から、元の型を取り出す | `downcast_ref::<T>()` / `downcast::<T>()` |
| 原因に、メッセージを足す | `.context("...")`、または、メッセージを遅延して作る `.with_context(クロージャ)` |

<pre><code class="tips">anyhow::Error は、中身のエラーの型を、隠す。ライブラリが公開する関数の戻り値には、anyhow::Result ではなく、thiserror で定義した型を使う。利用側が、エラーの種類で、処理を分けられなくなるため。</code></pre>

<pre><code class="caution">#[error(transparent)] Other(#[from] anyhow::Error) のような、anyhow を包むバリアントを、公開するエラー型に入れると、anyhow が、公開 API に現れる。
anyhow のバージョンを上げると、利用側に影響するため、ライブラリの公開型には、向かない。アプリケーション内の型に、使う。</code></pre>

### `Box<dyn Error>` との組み合わせ

`main` の戻り値を `Result<(), Box<dyn std::error::Error>>` にすると、thiserror の型を、そのまま返せる。エラーで終了したときは、`Debug` 形式で、標準エラー出力に、表示される。

```rust
use thiserror::Error;

#[derive(Error, Debug)]
#[error("設定が不正である")]
struct ConfigError;

fn check() -> Result<(), ConfigError> {
    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    check()?; // ConfigError が、Box<dyn Error> に変換される
    println!("OK");
    Ok(())
}
```

anyhow の使い方は、「anyhow」のドキュメントを参照。

---

## 設計の指針 <a id="guidelines" data-name="設計の指針"></a>

| 指針 | 理由 |
| --- | --- |
| モジュールや層ごとに、エラー型を分ける | 1つの巨大な列挙型に、すべてを入れると、利用側が、起こり得ないバリアントまで、`match` で扱うことになる |
| 呼び出し側が、`match` で、処理を分ける種類だけを、バリアントにする | 分けない種類は、1つにまとめるか、`transparent` や `anyhow` に、任せる |
| `Display` には、自分の層で起きたことを書き、原因は `source()` で返す | 連鎖を表示したときに、同じ内容が、二重に出ない |
| `#[from]` を、むやみに増やさない | どこで、なぜ失敗したのかが、分からなくなる。状況が必要な箇所は、フィールドを持たせて、`map_err` で、変換する |
| ライブラリでは、公開する型を、慎重に決める | 公開するバリアントとフィールドは、API になる。`#[non_exhaustive]` や、不透明な構造体で、変更に備える |
| `Send + Sync + 'static` を、保つ | `anyhow::Error` への変換や、スレッド間の受け渡しが、できなくなる (`Rc` や `RefCell` を、フィールドに持たせない) |
| `Result` の別名を、定義する | `pub type Result<T> = std::result::Result<T, Error>;` で、関数のシグネチャが、短くなる |
| エラーの種類で、振る舞いを決めるメソッドを、型に持たせる | HTTP のステータスや、再試行できるかどうかを、1か所にまとめられる |

<pre><code class="tips">エラー型に PartialEq を derive しようとしても、io::Error は PartialEq を実装していないため、io::Error を含む型では、derive できない。
テストでは、matches! マクロや、to_string() の比較を使う (「テスト」の章を参照)。</code></pre>

### エラーの種類で、振る舞いを決める

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("リソースが見つからない: {0}")]
    NotFound(String),
    #[error("入力が不正である: {0}")]
    BadRequest(String),
    #[error("一時的に利用できない")]
    Unavailable,
    #[error("内部のエラー")]
    Internal(#[source] Box<dyn std::error::Error + Send + Sync>),
}

impl ApiError {
    /// HTTP のステータスコードに対応させる
    pub fn status_code(&self) -> u16 {
        match self {
            ApiError::NotFound(_) => 404,
            ApiError::BadRequest(_) => 400,
            ApiError::Unavailable => 503,
            ApiError::Internal(_) => 500,
        }
    }

    /// 再試行して、成功する可能性があるか
    pub fn is_retryable(&self) -> bool {
        matches!(self, ApiError::Unavailable)
    }
}

fn main() {
    let e = ApiError::NotFound("user:42".into());
    println!("{} {} {}", e, e.status_code(), e.is_retryable()); // リソースが見つからない: user:42 404 false
    println!("{}", ApiError::Unavailable.is_retryable()); // true
}
```

<pre><code class="tips">Web フレームワーク (axum など) では、このようなメソッドを使って、エラー型に IntoResponse を実装し、ハンドラーの中で、? だけを使えるようにする方法が、よく使われる。Axum の書き方は、「Axum」のドキュメントを参照。</code></pre>

### Result の別名

```rust
mod store {
    use thiserror::Error;

    #[derive(Error, Debug)]
    pub enum Error {
        #[error("キー {0} が見つからない")]
        NotFound(String),
    }

    // このモジュールの Result は、エラー型を省略できる
    pub type Result<T> = std::result::Result<T, Error>;

    pub fn get(key: &str) -> Result<i32> {
        Err(Error::NotFound(key.to_string()))
    }
}

fn main() {
    match store::get("a") {
        Ok(v) => println!("{v}"),
        Err(e) => println!("{e}"), // キー a が見つからない
    }
}
```

---

## 実践例 <a id="practice" data-name="実践例"></a>

### 設定ファイルの読み込み

`key = value` 形式の設定ファイルを、読み込む、小さなライブラリ。入出力、構文、値の変換、必須項目の4種類のエラーを、1つの型で、表す。

```rust
mod config {
    use std::collections::HashMap;
    use std::fs;
    use std::io;
    use std::num::ParseIntError;
    use std::path::{Path, PathBuf};
    use thiserror::Error;

    #[derive(Error, Debug)]
    pub enum Error {
        #[error("{path} を読み込めない")]
        Read {
            path: PathBuf,
            #[source]
            source: io::Error,
        },
        #[error("{line} 行目の形式が不正である: `{text}`")]
        Syntax { line: usize, text: String },
        #[error("{key} の値を、数値として解釈できない")]
        Number {
            key: String,
            #[source]
            source: ParseIntError,
        },
        #[error("必須の項目 {0} がない")]
        Missing(&'static str),
    }

    pub type Result<T> = std::result::Result<T, Error>;

    #[derive(Debug, PartialEq)]
    pub struct Config {
        pub name: String,
        pub port: u16,
    }

    /// 文字列から、設定を読み取る
    pub fn parse(text: &str) -> Result<Config> {
        let mut map = HashMap::new();
        for (i, line) in text.lines().enumerate() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            let (key, value) = line.split_once('=').ok_or_else(|| Error::Syntax {
                line: i + 1,
                text: line.to_string(),
            })?;
            map.insert(key.trim().to_string(), value.trim().to_string());
        }

        let name = map.remove("name").ok_or(Error::Missing("name"))?;
        let port_text = map.remove("port").ok_or(Error::Missing("port"))?;
        let port = port_text.parse().map_err(|source| Error::Number {
            key: "port".to_string(),
            source,
        })?;
        Ok(Config { name, port })
    }

    /// ファイルから、設定を読み込む
    pub fn load(path: &Path) -> Result<Config> {
        let text = fs::read_to_string(path).map_err(|source| Error::Read {
            path: path.to_path_buf(),
            source,
        })?;
        parse(&text)
    }
}

use std::error::Error;
use std::path::Path;

/// エラーと、その原因を、「: 」でつなげる
fn report(e: &dyn Error) -> String {
    let mut text = e.to_string();
    let mut current = e.source();
    while let Some(inner) = current {
        text.push_str(&format!(": {inner}"));
        current = inner.source();
    }
    text
}

fn main() {
    let ok = config::parse("# 設定\nname = demo\nport = 8080\n").unwrap();
    println!("{ok:?}"); // Config { name: "demo", port: 8080 }

    let bad = config::parse("name = demo\nport = http\n").unwrap_err();
    println!("{}", report(&bad)); // port の値を、数値として解釈できない: invalid digit found in string

    let missing = config::parse("port = 80\n").unwrap_err();
    println!("{}", report(&missing)); // 必須の項目 name がない

    let syntax = config::parse("name demo\n").unwrap_err();
    println!("{}", report(&syntax)); // 1 行目の形式が不正である: `name demo`

    let io = config::load(Path::new("/this/file/does/not/exist")).unwrap_err();
    println!("{}", io.to_string()); // /this/file/does/not/exist を読み込めない
}
```

<pre><code class="tips">この例のように、エラー型を、モジュールの中に置いて、名前を Error にして、Result の別名を一緒に定義すると、呼び出し側は、config::Error や config::Result と書けて、読みやすい。
Result を、ほかのエラー型 (std の Result など) と、混同しないよう、別名は、モジュールの中に閉じる。</code></pre>

### 層ごとにエラーを分ける

下位の層 (リポジトリ) のエラーを、上位の層 (サービス) が、自分のエラー型に、包んで返す。それぞれの層の `Display` は、その層で起きたことだけを書く。

```rust
use std::error::Error;
use thiserror::Error;

// 下位の層
#[derive(Error, Debug)]
#[error("データベースに接続できない")]
struct DbError;

// 中間の層
#[derive(Error, Debug)]
enum RepoError {
    #[error("ユーザー {id} を取得できない")]
    User {
        id: u32,
        #[source]
        source: DbError,
    },
}

// 上位の層
#[derive(Error, Debug)]
enum ServiceError {
    #[error("プロフィールを表示できない")]
    Profile(#[from] RepoError),
}

fn get_user(id: u32) -> Result<String, RepoError> {
    Err(RepoError::User { id, source: DbError })
}

fn profile(id: u32) -> Result<String, ServiceError> {
    let user = get_user(id)?; // RepoError → ServiceError::Profile
    Ok(user)
}

fn main() {
    let err = profile(7).unwrap_err();

    // 連鎖を、上から順に、表示する
    let mut current: Option<&dyn Error> = Some(&err);
    while let Some(e) = current {
        println!("- {e}");
        current = e.source();
    }
}
```

```text
- プロフィールを表示できない
- ユーザー 7 を取得できない
- データベースに接続できない
```

---

## テスト <a id="test" data-name="テスト"></a>

エラー型のテストでは、「正しい種類のエラーが返るか」と、「メッセージと原因が、期待どおりか」を確認する。

### 種類の確認

`io::Error` のように、`PartialEq` を実装していない型を含むエラーは、`assert_eq!` で、比較できない。`matches!` で、バリアントの種類を確認する。

```rust
use std::io;
use thiserror::Error;

#[derive(Error, Debug)]
enum Error {
    #[error("入出力のエラー")]
    Io(#[from] io::Error),
    #[error("値が不正である: {0}")]
    Invalid(i32),
}

fn check(n: i32) -> Result<i32, Error> {
    if n < 0 {
        return Err(Error::Invalid(n));
    }
    Ok(n)
}

fn main() {
    println!("{:?}", check(1).is_ok()); // true
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::error::Error as _;

    #[test]
    fn 負の値は不正() {
        let err = check(-1).unwrap_err();

        // バリアントと、中の値を確認する
        assert!(matches!(err, Error::Invalid(-1)));
    }

    #[test]
    fn メッセージの確認() {
        let err = check(-5).unwrap_err();
        assert_eq!(err.to_string(), "値が不正である: -5");
    }

    #[test]
    fn from_で変換される() {
        let io_err = io::Error::new(io::ErrorKind::NotFound, "なし");
        let err: Error = io_err.into();
        assert!(matches!(err, Error::Io(_)));
    }

    #[test]
    fn 原因が連鎖している() {
        let err = Error::from(io::Error::new(io::ErrorKind::Other, "元のエラー"));

        // #[from] のフィールドは、source() で取り出せる
        let source = err.source().expect("原因があるはず");
        assert_eq!(source.to_string(), "元のエラー");

        // 原因のない種類は、source() が None
        assert!(Error::Invalid(1).source().is_none());
    }
}
```

### テストの観点

| 観点 | 内容 |
| --- | --- |
| 種類 | `matches!` で、返ってきたバリアントが、期待どおりか |
| メッセージ | `to_string()` が、期待した文字列か。メッセージは、利用者に見えるため、変更を検知したい箇所は、テストする |
| 原因 | `source()` が、期待した原因を、返すか (`#[from]` や `#[source]` の付け忘れを検知する) |
| 変換 | `From` による変換と、`?` による、変換が動くか |
| 境界 | 空の入力、最大値、不正な値など、エラーになる条件の、境界 |
| `Send + Sync` | エラー型が、`anyhow` やスレッド間で使えるかを、コンパイル時に確認する |

### Send と Sync を、コンパイル時に確認する

```rust
use thiserror::Error;

#[derive(Error, Debug)]
#[error("失敗した")]
struct MyError;

// Send + Sync + 'static を満たさない型だと、コンパイルエラーになる
fn assert_send_sync<T: Send + Sync + 'static>() {}

fn main() {
    assert_send_sync::<MyError>();
    println!("OK");
}
```

<pre><code class="tips">エラー型に、Rc や RefCell、ロックを外した生のポインタなどを入れると、Send や Sync を満たさなくなり、anyhow への変換などで、コンパイルエラーになる。
assert_send_sync のような関数を、テストの中に置くと、あとから、フィールドを追加したときに、すぐ気付ける。</code></pre>

テストの書き方全般は、「Rustのテスト」のドキュメントを参照。

---

## 古いコードからの変更 <a id="migration" data-name="古いコードからの変更"></a>

### 1.x から 2.0 への変更

| 変更 | 1.x | 2.0 |
| --- | --- | --- |
| raw identifier の参照 | `#[error("{r#type}")]` | `#[error("{type}")]` (raw identifier を使うと、`raw identifiers are not supported` というエラーになる) |
| 位置引数の混在 | タプルで `{0}` と、追加の位置引数を、混在できた | エラーになる (`ambiguous reference to positional arguments`) |
| 名前つき引数で、隠れたフィールド | その型パラメータに、トレイト境界が、推論された | 推論されなくなった |
| 直接の依存 | 必須ではなかった | `derive(Error)` を使う crate は、thiserror を、`Cargo.toml` に書く必要がある |
| `no_std` | 使えない | `default-features = false` で使える (`core::error::Error` を使うため、Rust 1.81 以降が必要) |

```rust
use thiserror::Error;

#[derive(Error, Debug)]
// 1.x: #[error("型は {r#type}")]
#[error("型は {type}")]
struct Mismatch {
    r#type: String,
}

fn main() {
    println!("{}", Mismatch { r#type: "i32".into() }); // 型は i32
}
```

<pre><code class="tips">1.x から 2.0 に上げるときは、Cargo.toml の thiserror を "2" にして、コンパイルする。上の変更に当たる箇所は、コンパイルエラーになるため、見落とさない。
他の crate が、依存として、thiserror 1.x を使っていても、同じプロジェクトに、1.x と 2.x が、同時に入るだけで、問題は起きない (利用側の公開 API に、thiserror が、現れないため)。</code></pre>

### 手書きの実装から、derive への置き換え

```rust
use std::fmt;
use std::io;

// 手書きの実装: Display、Error、From を、すべて自分で書く
#[derive(Debug)]
enum Error {
    Io(io::Error),
    Invalid(i32),
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::Io(_) => write!(f, "入出力のエラー"),
            Error::Invalid(n) => write!(f, "値が不正である: {n}"),
        }
    }
}

impl std::error::Error for Error {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            Error::Io(e) => Some(e),
            Error::Invalid(_) => None,
        }
    }
}

impl From<io::Error> for Error {
    fn from(e: io::Error) -> Self {
        Error::Io(e)
    }
}

fn main() {
    println!("{}", Error::Invalid(3));
}
```

```rust
use std::io;
use thiserror::Error;

// thiserror: 同じ内容を、属性だけで表す
#[derive(Error, Debug)]
enum Error {
    #[error("入出力のエラー")]
    Io(#[from] io::Error),
    #[error("値が不正である: {0}")]
    Invalid(i32),
}

fn main() {
    println!("{}", Error::Invalid(3));
}
```

| 古い crate | 現在 |
| --- | --- |
| `failure` (`Fail` トレイト) | 標準の `Error` トレイトを実装する、thiserror (ライブラリ) や anyhow (アプリケーション) に置き換える。新規には、使わない |
| `error-chain` | 同上 |
| `quick-error` など、マクロで `Error` を実装する crate | thiserror に置き換えられる (メッセージの書き方を、`#[error("...")]` に直す) |

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `` missing #[error("...")] display attribute `` | 一部のバリアントに、`#[error]` がない | すべてのバリアントに付ける。または、`Display` を、自分で実装して、`#[error]` をすべて外す |
| `` `E` doesn't implement `Debug` `` | `#[derive(Debug)]` を付けていない | `#[derive(Error, Debug)]` と書く |
| `conflicting implementations of trait From<...>` | 同じ型を、複数のバリアントで、`#[from]` にしている | 一方を、`#[source]` と `map_err` に変えて、コンテキストを区別する |
| `deriving From requires no fields other than source and backtrace` | `#[from]` のバリアントが、他のフィールドも持っている | `#[from]` を外し、`#[source]` と、`map_err` で変換する |
| `ambiguous reference to positional arguments by number in a tuple struct` | 2.0 で、`{0}` と、追加の位置引数を、混在させている | 追加の引数を、名前つきにするか、`.0` で、フィールドを参照する |
| `invalid format string: raw identifiers are not supported` | 2.0 で、`{r#type}` と書いている | `{type}` と書く |
| `the method as_dyn_error exists for struct String` | `#[source]` や `#[from]` のフィールドが、`Error` を実装していない型 (`String` など) | `Error` を実装した型にする。または、`#[source]` を外して、普通のフィールドにする |
| `use of unstable library feature error_generic_member_access` | 安定版の Rust で、`Backtrace` 型のフィールドを持っている | `Backtrace` のフィールドを、外す。バックトレースは、`anyhow` で扱う |
| `` the method `as_display` exists for reference `&Vec<i32>`, but its trait bounds were not satisfied `` | `Display` を実装していない型 (`Vec`、`Option` など) を、`{0}` で埋め込んでいる | `{0:?}` で、`Debug` 形式にする。または、追加の引数で、文字列に整形する (`Path` と `PathBuf` は、`{path}` のまま使える) |
| `?` で、`the trait From<X> is not implemented for Error` となる | 変換したいエラーの型に、`#[from]` が付いていない | バリアントに `#[from]` を付ける。または、`map_err` で変換する |
| エラーの連鎖を表示すると、同じメッセージが、二重に出る | `Display` に、原因のメッセージも、含めている | `Display` には、自分の層のことだけを書く。原因は、`source()` で返す |
| `anyhow::Error` に、変換できない | エラー型が `Send` か `Sync` を満たさない (`Rc` や `RefCell` を持っている) | `Arc` や `Mutex` に置き換える。または、フィールドを持たせない |
| ライブラリで、バリアントを追加したら、利用側が、コンパイルできなくなった | 公開した列挙型に、`#[non_exhaustive]` が、付いていない | 最初から、`#[non_exhaustive]` を付ける。または、不透明な構造体にする |

---

## 関連 crate <a id="related" data-name="関連crate"></a>

| crate | 用途 |
| --- | --- |
| `anyhow` | アプリケーション向けの、手軽なエラー型。thiserror と、組み合わせて使う |
| `snafu` | エラー型を、コンテキストセレクタで、組み立てる。thiserror とは、別の考え方のエラー処理の crate |
| `eyre` / `color-eyre` | `anyhow` に似た、エラー型 (報告のカスタマイズができる) |
| `miette` | ソースコードの位置を示すような、診断情報つきの、エラー表示 |
| `displaydoc` | doc コメントから、`Display` を生成する derive |
| `derive_more` | `Display`、`From`、`Error` など、多数のトレイトの derive をまとめた crate |
| `tracing-error` | エラーに、`tracing` のスパンの情報を、付ける |
| `thiserror-no-std` | `no_std` 向けの、別の crate (thiserror 2.0 は、`default-features = false` で、`no_std` に対応する) |

