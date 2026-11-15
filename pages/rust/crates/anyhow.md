---
title: anyhow
layout: default
---

# anyhow <a id="top" data-name="TOP"></a>

anyhow は、Rust の**アプリケーション向けの、エラー処理の crate**。どんな種類のエラーも、1つの型 (`anyhow::Error`) で受け取れて、`?` 演算子で、簡単に伝播できる。エラーに、説明 (コンテキスト) を、付け足せることも特徴。

エラーの型を、いちいち定義せずに済むため、「エラーが起きたら、原因を表示して終了する」ような、CLI ツールやアプリケーションで、広く使われている。

---

## 概要 <a id="overview" data-name="概要"></a>

### 解決する問題

関数ごとに、異なるエラーの型 (`io::Error`、`ParseIntError`、`serde_json::Error` など) が返ってくる。標準の方法では、これらをまとめて返すために、`Box<dyn Error>` を使うか、自作の enum を、定義する必要がある。

```rust
// 標準の方法: Box<dyn Error>
fn read_number(path: &str) -> Result<i32, Box<dyn std::error::Error>> {
    let text = std::fs::read_to_string(path)?;
    Ok(text.trim().parse()?)
}
```

anyhow を使うと、同じことを、より簡潔に書けて、さらに便利な機能が付く。

```rust
use anyhow::Result;

fn read_number(path: &str) -> Result<i32> {
    let text = std::fs::read_to_string(path)?;
    Ok(text.trim().parse()?)
}
```

### anyhow が提供するもの

| 機能 | 内容 |
| --- | --- |
| `anyhow::Error` | あらゆるエラーを包める、1つのエラー型 |
| `anyhow::Result<T>` | `Result<T, anyhow::Error>` の別名 |
| `?` での自動変換 | `std::error::Error` を実装した、あらゆるエラーが、自動で `anyhow::Error` に変換される |
| `Context` | エラーに、「何をしようとして失敗したか」の説明を、追加できる |
| `anyhow!` / `bail!` / `ensure!` | 文字列などから、エラーを作る、またはすぐに返すマクロ |
| 原因の連鎖 | エラーの原因を、たどれる (`chain()`、`root_cause()`) |
| ダウンキャスト | 元のエラーの型を、取り出して、判定できる |
| バックトレース | エラーが発生した場所の、呼び出し履歴を記録できる |

### 使い分け

| | `Box<dyn Error>` | `anyhow::Error` | 自作の enum (thiserror) |
| --- | --- | --- | --- |
| `?` での変換 | 自動 | 自動 | `#[from]` で、1つずつ定義する |
| コンテキストの追加 | 手動 | `.context()` で簡単 | バリアントとして表す |
| バックトレース | なし | 自動 (条件あり) | 自分で用意する |
| `Send` と `Sync` | 付けないと、スレッドをまたげない | 常に `Send + Sync` | 型による |
| 呼び出し側の判定 | ダウンキャスト | ダウンキャスト | `match` で、バリアントごとに |
| 向いている場面 | 簡易的なコード | **アプリケーション** | **ライブラリ** |

<pre><code class="tips">目安: エラーを「表示して終わり」にするコード (アプリケーション、CLI、バッチ処理) は anyhow。
呼び出し側が、エラーの種類ごとに処理を分ける必要があるコード (ライブラリ) は thiserror で、エラーの enum を定義する。
両方を、組み合わせることもできる (後述)。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

```bash
cargo add anyhow
```

```toml
[dependencies]
anyhow = "1"   # cargo add が、最新のバージョンを入れる
```

### フィーチャー

| フィーチャー | 内容 |
| --- | --- |
| `std` | 標準ライブラリを使う (既定で有効) |
| `backtrace` | 古い Rust でバックトレースを取る機能 |

<pre><code class="tips">Rust 1.65 以降は、標準ライブラリのバックトレースが使われるため、backtrace フィーチャーを指定する必要はない。
2026年2月の 1.0.102 で、外部の backtrace crate への依存が、取り除かれた。</code></pre>

---

## 基本 <a id="basic" data-name="基本"></a>

### Result を返す

fallible な関数 (失敗しうる関数) の戻り値に、`anyhow::Result<T>` を使う。関数の中では、`?` で、あらゆるエラーを、そのまま伝播できる。

```rust
use anyhow::Result;
use std::fs;

fn read_number(path: &str) -> Result<i32> {
    let text = fs::read_to_string(path)?;   // io::Error が、anyhow::Error に変換される
    let n: i32 = text.trim().parse()?;       // ParseIntError も、同じ戻り値で返せる
    Ok(n)
}

fn main() -> Result<()> {
    let n = read_number("number.txt")?;
    println!("{}", n);
    Ok(())
}
```

`?` は、`std::error::Error` を実装していて、`Send + Sync + 'static` な、あらゆるエラーを、`anyhow::Error` に変換する。

### anyhow::Result の定義

```rust
// anyhow の中の定義 (おおよそ)
pub type Result<T, E = anyhow::Error> = core::result::Result<T, E>;
```

エラーの型が、既定で `anyhow::Error` になる。別のエラー型を指定したいときは、第2引数で、指定できる。

```rust
use anyhow::Result;

fn a() -> Result<i32> { Ok(1) }                           // anyhow::Error
fn b() -> Result<i32, std::num::ParseIntError> { Ok(1) }   // 別のエラー型も、書ける
```

### main から返す

`main` の戻り値が `Result` のとき、`Err` が返ると、エラーが標準エラーに表示されて、**終了コード 1** で、プログラムが終了する。

```rust
fn main() -> anyhow::Result<()> {
    let n = read_number("missing.txt")?;
    println!("{}", n);
    Ok(())
}
```

```text
Error: No such file or directory (os error 2)
```

---

## エラーを作る <a id="create" data-name="エラーを作る"></a>

既存のエラーではなく、**自分でエラーを作りたい**ときは、マクロを使う。

| マクロ・関数 | 動作 |
| --- | --- |
| `anyhow!(...)` | エラー (`anyhow::Error`) を作る。`format!` と同じ書き方ができる |
| `bail!(...)` | エラーを作って、すぐに `return Err(...)` する |
| `ensure!(条件, ...)` | 条件が `false` なら、エラーを返す |
| `Error::msg(...)` | `Display` と `Debug` を実装した値から、エラーを作る |
| `Error::new(e)` | 既存のエラー `e` を、包む |

### anyhow!

```rust
use anyhow::{anyhow, Result};

fn find_user(id: u32) -> Result<String> {
    if id == 1 {
        Ok("Alice".to_string())
    } else {
        Err(anyhow!("ユーザーが見つかりません: id={}", id))
    }
}
```

### bail!

`return Err(anyhow!(...))` の、省略形。

```rust
use anyhow::{bail, Result};

fn divide(a: i32, b: i32) -> Result<i32> {
    if b == 0 {
        bail!("0 で割ることはできません");
    }
    Ok(a / b)
}
```

### ensure!

条件を満たさないときに、エラーを返す。`if !条件 { bail!(...) }` の、省略形。

```rust
use anyhow::{ensure, Result};

fn set_age(age: i32) -> Result<()> {
    ensure!(age >= 0, "年齢は 0 以上にしてください: {}", age);
    ensure!(age <= 150, "年齢が大きすぎます: {}", age);
    // ...
    Ok(())
}
```

| 書き方 | エラーメッセージ |
| --- | --- |
| `ensure!(cond, "...")` | 指定したメッセージ |
| `ensure!(cond)` | 条件の式を含む、メッセージが自動で作られる |
| `ensure!(a == b)` | 条件の式と、左右の値を含む、メッセージが自動で作られる (`Condition failed: ...` のような形) |

### Option からエラーにする

`Option` が `None` のときに、エラーにしたい場合は、`ok_or_else` か、後述の `context` を使う。

```rust
use anyhow::{anyhow, Result};

fn first_word(text: &str) -> Result<&str> {
    text.split_whitespace()
        .next()
        .ok_or_else(|| anyhow!("単語が、見つかりません"))
}
```

<pre><code class="caution">Option のまま ? を使っても、anyhow::Result を返す関数の中では、コンパイルエラーになる (None は、エラー型に変換できないため)。
ok_or_else(...) か、.context(...) で、エラーに変換してから、? を付ける。</code></pre>

---

## コンテキスト <a id="context" data-name="コンテキスト"></a>

エラーが起きたときに、「**何をしようとして**失敗したのか」を、付け足せる。元のエラーは、原因として、残る。

```rust
use anyhow::{Context, Result};

fn load_config(path: &str) -> Result<String> {
    let text = std::fs::read_to_string(path)
        .with_context(|| format!("設定ファイル '{}' を、読み込めません", path))?;
    Ok(text)
}

fn main() -> Result<()> {
    let config = load_config("config.toml")?;
    println!("{}", config);
    Ok(())
}
```

```text
Error: 設定ファイル 'config.toml' を、読み込めません

Caused by:
    No such file or directory (os error 2)
```

`Context` トレイトを `use` すると、`Result` と `Option` に、次のメソッドが追加される。

| メソッド | 内容 |
| --- | --- |
| `.context(説明)` | エラーに、説明を付ける。説明は、すぐに評価される |
| `.with_context(クロージャ)` | 説明を、クロージャで作る。**エラーのときだけ**評価される |

```rust
use anyhow::Context;

// 固定の文字列なら、context
let n: i32 = text.parse().context("数値に変換できません")?;

// format! などで、説明を作るなら、with_context (成功のときは、format! が実行されない)
let n: i32 = text
    .parse()
    .with_context(|| format!("'{}' を数値に変換できません", text))?;
```

<pre><code class="caution">use anyhow::Context; を書き忘れると、「no method named context found」のエラーになる。
.context(format!(...)) は、成功のときにも format! が実行されるため、メッセージを作るコストがかかるときは、with_context を使う。</code></pre>

### Option にも使える

`Option` が `None` のときに、エラーにできる。

```rust
use anyhow::{Context, Result};

fn first_char(text: &str) -> Result<char> {
    text.chars().next().context("文字列が、空です")
}

fn parse_pair(text: &str) -> Result<(String, String)> {
    let (key, value) = text
        .split_once('=')
        .with_context(|| format!("'=' がありません: {}", text))?;
    Ok((key.to_string(), value.to_string()))
}
```

### コンテキストを重ねる

呼び出しの階層ごとに、コンテキストを重ねると、**どの処理の、どの部分で失敗したか**が、分かるエラーになる。

```rust
use anyhow::{Context, Result};

fn read_file(path: &str) -> Result<String> {
    std::fs::read_to_string(path).with_context(|| format!("'{}' を読み込めません", path))
}

fn load_user(path: &str) -> Result<String> {
    let text = read_file(path).context("ユーザー情報の読み込みに失敗しました")?;
    Ok(text)
}

fn main() -> Result<()> {
    load_user("user.json")?;
    Ok(())
}
```

```text
Error: ユーザー情報の読み込みに失敗しました

Caused by:
    0: 'user.json' を読み込めません
    1: No such file or directory (os error 2)
```

### メッセージの書き方

| 指針 | 例 |
| --- | --- |
| 「何をしようとして、失敗したか」を書く | `設定ファイルを、読み込めません` |
| 失敗した対象 (パスや ID) を含める | `'config.toml' を読み込めません` |
| 原因そのものは書かない (原因は、元のエラーに含まれる) | `No such file or directory` は、書かない |
| 1つの文を、簡潔に | 末尾の句点は、付けないことが多い |

<pre><code class="tips">英語のメッセージでは、小文字で始めて、末尾にピリオドを付けない (failed to read config) のが慣習。
{:#} で、メッセージを「: 」でつないで、1行に表示するため、文として、読みやすくなる。</code></pre>

---

## エラーの表示 <a id="display" data-name="エラーの表示"></a>

`anyhow::Error` は、書式によって、表示される内容が違う。

| 書式 | 内容 |
| --- | --- |
| `{}` | 一番外側の、メッセージだけ |
| `{:#}` | すべての原因を、`: ` でつないで、1行に |
| `{:?}` | メッセージと、原因の一覧 (`Caused by:`)。バックトレースが有効なら、それも含む |
| `{:#?}` | デバッグ用の、詳細な構造 |

```rust
let err = load_user("user.json").unwrap_err();

println!("{}", err);
println!("{:#}", err);
println!("{:?}", err);
```

```text
ユーザー情報の読み込みに失敗しました

ユーザー情報の読み込みに失敗しました: 'user.json' を読み込めません: No such file or directory (os error 2)

ユーザー情報の読み込みに失敗しました

Caused by:
    0: 'user.json' を読み込めません
    1: No such file or directory (os error 2)
```

<pre><code class="caution">{} で表示すると、一番外側のメッセージだけで、原因が表示されない。
ログやコンソールに出すときは、{:#} (1行) か {:?} (複数行) を使う。</code></pre>

### 自分で表示する

`main` が返す `Err` の既定の表示 (`Error: ...`) ではなく、自分の形式で表示して終了する書き方。

```rust
fn main() {
    if let Err(err) = run() {
        eprintln!("エラー: {:#}", err);
        std::process::exit(1);
    }
}

fn run() -> anyhow::Result<()> {
    // ...
    Ok(())
}
```

---

## 原因をたどる <a id="chain" data-name="原因をたどる"></a>

### chain

エラーと、その原因を、外側から順に、たどれる。

```rust
fn print_chain(err: &anyhow::Error) {
    for (i, cause) in err.chain().enumerate() {
        if i == 0 {
            eprintln!("エラー: {}", cause);
        } else {
            eprintln!("  原因 {}: {}", i, cause);
        }
    }
}
```

`chain()` は、最初の要素として、**エラー自身**を返す。

### root_cause

連鎖の、一番奥にある、根本の原因を取り出す。

```rust
let root = err.root_cause();
eprintln!("根本の原因: {}", root);
```

| メソッド | 内容 |
| --- | --- |
| `err.chain()` | エラー自身と、すべての原因を、外側から順に返すイテレータ |
| `err.root_cause()` | 一番奥の、根本の原因 |
| `err.source()` 相当 | `chain().nth(1)` で、1つ内側の原因を取り出せる |

---

## ダウンキャスト <a id="downcast" data-name="ダウンキャスト"></a>

`anyhow::Error` は、元のエラーの型を、隠している。必要なときは、**元の型を取り出して**、種類によって処理を分けられる。

```rust
use std::io;

fn handle(err: &anyhow::Error) {
    if let Some(io_err) = err.downcast_ref::<io::Error>() {
        if io_err.kind() == io::ErrorKind::NotFound {
            eprintln!("ファイルが見つかりません");
            return;
        }
    }
    eprintln!("エラー: {:#}", err);
}
```

| メソッド | 内容 |
| --- | --- |
| `err.downcast_ref::<T>()` | 型 `T` への参照を、`Option` で返す |
| `err.downcast_mut::<T>()` | 型 `T` への、可変参照を返す |
| `err.downcast::<T>()` | 型 `T` を、取り出す (`Result<T, anyhow::Error>`。失敗すると、元のエラーが返る) |
| `err.is::<T>()` | 型 `T` かどうかを、`bool` で返す |

<pre><code class="tips">.context() で説明を付けた後でも、元のエラーの型 (上の例では io::Error) と、説明の型の、どちらにもダウンキャストできる。
コンテキストを付けたことで、元のエラーを、判定できなくなる心配は、ない。</code></pre>

---

## thiserror との組み合わせ <a id="thiserror" data-name="thiserror"></a>

anyhow は、`derive(Error)` のようなマクロを含まない。**エラーの型を、自分で定義したい**ときは、`thiserror` crate を使う。

```bash
cargo add thiserror
```

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("設定ファイルが見つかりません: {0}")]
    NotFound(String),

    #[error("設定の値が不正です: {key}")]
    InvalidValue { key: String },

    #[error(transparent)]
    Io(#[from] std::io::Error),
}
```

### ライブラリは thiserror、アプリは anyhow

ライブラリが、thiserror で定義した、エラーの enum を返し、それを使うアプリケーションが、anyhow で受け取る、という組み合わせが、典型的。

```rust
// ライブラリ側: 呼び出し側が match できるように、enum で返す
pub fn load(path: &str) -> Result<String, ConfigError> {
    if path.is_empty() {
        return Err(ConfigError::NotFound(path.to_string()));
    }
    Ok(std::fs::read_to_string(path)?)   // io::Error は、#[from] で ConfigError::Io に
}
```

```rust
// アプリ側: anyhow で、受け取って、コンテキストを付ける
use anyhow::{Context, Result};

fn run() -> Result<()> {
    let text = load("config.toml").context("設定の読み込みに失敗しました")?;
    println!("{}", text);
    Ok(())
}

fn main() {
    if let Err(err) = run() {
        // 必要なら、元の型を取り出して、分岐する
        match err.downcast_ref::<ConfigError>() {
            Some(ConfigError::NotFound(path)) => eprintln!("見つかりません: {}", path),
            _ => eprintln!("エラー: {:#}", err),
        }
        std::process::exit(1);
    }
}
```

### anyhow::Error を、自作のエラーに入れる

`anyhow::Error` は、`std::error::Error` を、実装していない。自作のエラー型の中に、含めたいときは、`#[error(transparent)]` と `#[from]` を、組み合わせる。

```rust
#[derive(Debug, Error)]
pub enum AppError {
    #[error("入力が不正です: {0}")]
    InvalidInput(String),

    // 想定外のエラーを、まとめて受ける
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}
```

### 判断の目安

| 状況 | 使うもの |
| --- | --- |
| アプリケーションの、内部のエラー処理 | anyhow |
| ライブラリの、公開 API のエラー | thiserror |
| 呼び出し側が、エラーの種類で処理を分ける | thiserror |
| 呼び出し側が、表示するだけ | anyhow |
| アプリの境界 (HTTP のレスポンスなど) で、エラーの種類に応じて、ステータスを変えたい | thiserror の enum を、境界に近い部分で使う |

---

## バックトレース <a id="backtrace" data-name="バックトレース"></a>

Rust 1.65 以降では、エラーを作った時点の、バックトレース (呼び出し履歴) が、記録される (元のエラーが、すでにバックトレースを持っている場合は、それが使われる)。表示するには、環境変数での有効化が必要。

| 環境変数 | 動作 |
| --- | --- |
| `RUST_BACKTRACE=1` | パニックと、エラーの、両方でバックトレースを有効にする |
| `RUST_LIB_BACKTRACE=1` | **エラーだけ**でバックトレースを有効にする |
| `RUST_BACKTRACE=1` と `RUST_LIB_BACKTRACE=0` | パニックだけで、有効にする |

```bash
RUST_BACKTRACE=1 cargo run
```

`{:?}` で表示すると、原因の一覧の後に、バックトレースが続く。

```rust
fn main() -> anyhow::Result<()> {
    run()?; // Err を返すと、Error: ... と、Caused by: ... と、Stack backtrace: ... が表示される
    Ok(())
}
```

```rust
// バックトレースを、取り出す
let bt = err.backtrace();
eprintln!("{}", bt);
```

<pre><code class="tips">バックトレースの記録には、コストがかかる。環境変数で有効にしていないときは、ほとんど、コストがかからない。
本番では無効のまま、不具合の調査のときだけ、RUST_LIB_BACKTRACE=1 で有効にする、という使い方ができる。</code></pre>

---

## 非同期とスレッド <a id="async" data-name="非同期とスレッド"></a>

`anyhow::Error` は、`Send + Sync + 'static` なので、スレッドや非同期のタスクをまたいで、返せる。

### spawn したタスクから返す

```rust
use anyhow::Result;

async fn do_work() -> Result<i32> {
    Ok(42)
}

#[tokio::main]
async fn main() -> Result<()> {
    let handle = tokio::spawn(async {
        let n = do_work().await?;
        anyhow::Ok(n) // 型を指定した Ok::<i32, anyhow::Error>(n) の、省略形
    });

    // 1つ目の ? は、タスクの失敗 (JoinError)、2つ目の ? は、中の anyhow のエラー
    let n = handle.await??;
    println!("{}", n);
    Ok(())
}
```

| 書き方 | 内容 |
| --- | --- |
| `Ok::<i32, anyhow::Error>(n)` | エラー型を、turbofish で明示する |
| `anyhow::Ok(n)` | エラー型が `anyhow::Error` の `Ok` を作る。クロージャや async ブロックの、末尾でよく使う |

async ブロックやクロージャの中では、`?` を使うと、エラー型が、推論できないことがある。そのときに、`anyhow::Ok(...)` で、末尾を書くと、推論が通る。

### スレッドから返す

```rust
let handle = std::thread::spawn(|| -> anyhow::Result<i32> {
    let n: i32 = "42".parse()?;
    Ok(n)
});

let n = handle.join().expect("スレッドがパニックしました")?;
```

---

## 実践例 <a id="example" data-name="実践例"></a>

「キー=値」の形式の設定を読み込んで、コンテキストつきのエラーを返す例。

```rust
use anyhow::{bail, ensure, Context, Result};
use std::collections::HashMap;

/// "key=value" の1行を解析する
fn parse_line(line: &str) -> Result<(String, i32)> {
    let (key, value) = line
        .split_once('=')
        .with_context(|| format!("'=' がありません: {}", line))?;

    let key = key.trim();
    ensure!(!key.is_empty(), "キーが、空です: {}", line);

    let value: i32 = value
        .trim()
        .parse()
        .with_context(|| format!("値が整数ではありません: {}", value.trim()))?;

    if value < 0 {
        bail!("値は 0 以上にしてください: {}", value);
    }

    Ok((key.to_string(), value))
}

/// 複数行を解析する。エラーには、行番号を付ける
fn parse_all(text: &str) -> Result<HashMap<String, i32>> {
    let mut map = HashMap::new();

    for (i, line) in text.lines().enumerate() {
        if line.trim().is_empty() {
            continue;
        }
        let (key, value) = parse_line(line).with_context(|| format!("{} 行目", i + 1))?;
        map.insert(key, value);
    }

    Ok(map)
}

fn main() {
    let text = "width=100\nheight=abc\n";

    match parse_all(text) {
        Ok(map) => println!("{:?}", map),
        Err(err) => {
            eprintln!("エラー: {:#}", err);
            std::process::exit(1);
        }
    }
}
```

```text
エラー: 2 行目: 値が整数ではありません: abc: invalid digit found in string
```

### テスト

エラーのメッセージや、連鎖の内容は、`to_string()` や `{:#}` で、文字列にして、確認できる。

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_valid_line() -> Result<()> {
        let (key, value) = parse_line("width = 100")?;
        assert_eq!(key, "width");
        assert_eq!(value, 100);
        Ok(())
    }

    #[test]
    fn rejects_negative_value() {
        let err = parse_line("width=-1").unwrap_err();
        assert!(err.to_string().contains("0 以上"));
    }

    #[test]
    fn error_includes_line_number() {
        let err = parse_all("a=1\nb=x\n").unwrap_err();
        // {:#} で、すべての原因を、1行にして確認する
        assert!(format!("{:#}", err).contains("2 行目"));
    }
}
```

<pre><code class="tips">テスト関数も、anyhow::Result を返せる。Err が返ると、テストが失敗して、原因の一覧が表示されるため、? で、簡潔に書ける。
エラーの種類を確認したいときは、err.downcast_ref::&lt;T&gt;() が使える。</code></pre>

---

## Error 型の性質 <a id="error-type" data-name="Error型の性質"></a>

| 性質 | 内容 |
| --- | --- |
| サイズ | ポインタ1つ分。`Result<T, anyhow::Error>` が、小さく保たれる |
| `Send + Sync + 'static` | スレッドをまたいで、返せる |
| `std::error::Error` | **実装していない** (そのため、`?` で、自分自身に変換する実装が、重ならずに済む) |
| `Box<dyn Error + Send + Sync>` への変換 | `.into()` で、変換できる |
| `Clone` | 実装していない (複製が必要なら、メッセージを、文字列にして保持する) |
| `From<E>` | `E: std::error::Error + Send + Sync + 'static` なら、`?` で自動変換される |

### no_std での使用

標準ライブラリがない環境 (`no_std`) でも、ほとんどの機能が、同じように使える。グローバルアロケータが、必要。

```toml
[dependencies]
anyhow = { version = "1", default-features = false }
```

<pre><code class="caution">Rust 1.81 より古い環境の no_std では、anyhow のエラー型以外のエラーを ? で変換するときに、.map_err(anyhow::Error::msg) の追記が、必要になることがある。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| ライブラリの利用者が、エラーの種類で処理を分けられない | 公開 API で、`anyhow::Error` を返している | ライブラリは、`thiserror` で、enum を定義する |
| `no method named context found` | `Context` トレイトを、`use` していない | `use anyhow::Context;` |
| `Option` に `?` を付けて、コンパイルエラー | `None` を、エラー型に変換できない | `.context("...")?` か、`.ok_or_else(...)?` |
| エラーの原因が、表示されない | `{}` は、外側のメッセージだけを表示する | `{:#}` または `{:?}` で表示する |
| バックトレースが、表示されない | 環境変数が、設定されていない | `RUST_BACKTRACE=1` または `RUST_LIB_BACKTRACE=1` |
| async ブロックの中の、`?` でエラー型が推論できない | `Ok(...)` の、エラー型が決まらない | `anyhow::Ok(...)` で終える。または `Ok::<_, anyhow::Error>(...)` |
| `anyhow::Error` を、`#[from]` や `source` にできない | `std::error::Error` を、実装していない | `#[error(transparent)] Other(#[from] anyhow::Error)` の形にする |
| 成功のときにも、メッセージのコストがかかる | `.context(format!(...))` は、毎回 `format!` を実行する | `.with_context(...)` を使う |
| エラーが、`clone` できない | `anyhow::Error` は `Clone` ではない | `to_string()` した文字列を、保持する。または `Arc` で包む |
| 元のエラーを判定できない | 型が、隠れている | `downcast_ref::<T>()`。コンテキストの後でも、使える |
| メッセージが、重複して読みにくい | 各層で、原因を繰り返し書いている | 「何をしようとしたか」だけを書き、原因は、元のエラーに任せる |
| `unwrap()` や `expect()` を、多用してしまう | エラーを、処理せずに、パニックしている | `?` で、呼び出し元に返す。`main` で、まとめて表示する |

---

## 関連 crate <a id="ecosystem" data-name="関連crate"></a>

| crate | 用途 |
| --- | --- |
| `thiserror` | エラーの enum を、derive で定義する (ライブラリ向け) |
| `eyre` / `color-eyre` | anyhow に近い API で、エラーの表示を、カスタマイズできる。`color-eyre` は、色付きで、見やすいレポートを出す |
| `miette` | ソースコードの位置を指す、見やすいエラー表示 (コンパイラやパーサー向け) |
| `snafu` | エラーのコンテキストと enum を、まとめて扱う |
| `error-stack` | 型付けされたコンテキストを重ねる、エラー処理 |
| `tracing-error` | `tracing` のスパンの情報を、エラーに付ける |
