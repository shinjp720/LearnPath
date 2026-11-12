---
title: Rust
layout: default
---

# Rust <a id="top" data-name="TOP"></a>

## コメント <a id="comment" data-name="コメント"></a>

```rust
// 行末までコメント
/* 複数行コメント可能 (入れ子にもできる) */
```

### ドキュメントコメント

| 記法 | 対象 |
| --- | --- |
| `///` | 直後の要素 (関数・構造体など) のドキュメント |
| `//!` | 書いたモジュールやクレート全体のドキュメント (ファイルの先頭に書く) |

Markdown で書け、`cargo doc --open` で HTML のドキュメントとして確認できる。

```rust
/// 2つの数を足す。
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

---

## 導入 <a id="introduction" data-name="導入"></a>

### インストール

#### ビルドツールの準備

Rust のビルドにはリンカとして C コンパイラ (`cc`) が必要で、C のコードを含むクレートのビルドにも使われる。あらかじめインストールしておかないとビルドエラーになることがある (以下は Ubuntu / Debian 系の例)。

```bash
sudo apt update
sudo apt install -y build-essential curl gcc
```

#### rustup スクリプトの実行

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

対話なしで既定の設定のままインストールするには、末尾を `sh -s -- -y` にする。

#### 環境変数の反映

```bash
source "$HOME/.cargo/env"
```

#### 動作確認

```bash
rustc --version
cargo --version
```

### 追加コンポーネント

必須級の公式コンポーネント。

```bash
# コード自動整形ツール (rustfmt)
rustup component add rustfmt

# 静的解析・リンター (clippy)
rustup component add clippy

# IDE・エディタ向け言語サーバー (rust-analyzer)
rustup component add rust-analyzer
```

<pre><code class="tips">既定のプロファイルには rustfmt と clippy が含まれているため、通常は追加不要 (rustup show で確認できる)。
rust-analyzer は VS Code 拡張機能などにも同梱されている。標準ライブラリのソースへジャンプしたい場合は、rust-src コンポーネントも追加する。</code></pre>

---

## rustup <a id="rustup" data-name="rustup"></a>

Rust という言語・開発環境そのものを管理するツール。

| コマンド | 説明 |
| --- | --- |
| `rustup update` | Rust のツールチェーンを最新バージョンに更新する<br>定期的に更新した方がよい |
| `rustup show` | インストールされている Rust のバージョンや、アクティブなツールチェーン、<br>追加コンポーネントの状態を確認する |
| `rustup component add rustfmt`<br>`rustup component add clippy`<br>`rustup component add rust-analyzer` | 必須級のツール (コード整形、静的解析、言語サーバー) を導入する |
| `rustup target add wasm32-unknown-unknown`<br>`rustup target list --installed` | クロスコンパイル (他の OS/環境向けビルド) 用のターゲットの追加と、導入済みターゲットの確認 |
| `rustup self update` | rustup 自体のアップデート |
| `rustup toolchain install nightly`<br>`rustup toolchain list` | stable 以外のツールチェーン (nightly / beta / 特定バージョン) の導入と、導入済みツールチェーンの確認 |
| `rustup default stable` | 既定で使うツールチェーンを切り替える |
| `rustup override set nightly` | カレントディレクトリ (プロジェクト) でだけ別のツールチェーンを使う |
| `rustup doc`<br>`rustup doc --std` | ローカルにインストール済みのドキュメント (標準ライブラリ、The Book など) をブラウザで開く。オフラインでも読める |

---

## cargo <a id="cargo" data-name="cargo"></a>

個別のプロジェクトやコードを管理するツール。

| コマンド | 説明 |
| --- | --- |
| `cargo new プロジェクト名` | プロジェクト名で新たにプロジェクトディレクトリを作る |
| `cargo init` | カレントディレクトリをプロジェクトディレクトリとする |
| `cargo run` | プロジェクトのビルドと実行を1ステップで行う<br>プログラムへの引数は `cargo run -- 引数` のように `--` の後ろに書く |
| `cargo build` | プロジェクトをビルドする |
| `cargo build --release` | 最適化を有効にしたリリースビルドを行う |
| `cargo check` | バイナリを生成せずにビルドして、エラーチェックができる |
| `cargo test` | テストを実行する |
| `cargo add クレート名` | 依存クレートを Cargo.toml に追加する |
| `cargo fmt` | rustfmt でコードを整形する |
| `cargo clippy` | clippy で静的解析 (リント) を行う |
| `cargo doc --open` | ドキュメントを生成してブラウザで開く (依存クレートの分も含まれる) |
| `cargo update` | Cargo.lock の依存クレートを、Cargo.toml が許す範囲で最新にする |
| `cargo tree` | 依存関係をツリーで表示する |
| `cargo clean` | `target` ディレクトリ (ビルド成果物) を削除する |

### 自作ツールをインストールする

<span class="code-like">cargo install</span> は、バイナリ crate をリリースビルドして、PATH の通った場所にインストールする。これにより、その時点の実行ファイルをターミナルから使用できるようになる。

- バイナリターゲット (実行ファイル) がある必要がある
    - `src/main.rs` がある (または `src/bin/` 配下にファイルがある)
    - または Cargo.toml に `[[bin]]` セクションが定義されている
- デフォルトで `~/.cargo/bin` に実行ファイルが配置される

Rust アプリケーション (バイナリ crate) を `cargo install` でインストールする方法は大別して3つある (ローカルディレクトリ、GitHub、crates.io)。

#### ローカルディレクトリからインストール

プロジェクトのルートディレクトリで以下を実行。

```bash
cargo install --path .
```

<div class="subtitle2">インストールするディレクトリを指定する</div>

`--root` でディレクトリを指定。

```bash
# ホームディレクトリ直下の bin/ にインストールする
cargo install --path . --root ~
```

<div class="subtitle2">既に同じ名前でインストールされているものを上書き</div>

`--force` オプションで上書き。

```bash
cargo install --path . --root ~ --force
```

<div class="subtitle2">アンインストール</div>

Cargo.toml に記載してあるパッケージ名を指定する。

```bash
cargo uninstall <パッケージ名>
```

`--root` を指定してインストールした場合は、アンインストール時にも同じ `--root` を指定する (`cargo uninstall --root ~ <パッケージ名>`)。

#### GitHub からインストール

```bash
cargo install --git https://github.com/username/repository_name.git
```

<div class="subtitle2">特定のコミットやブランチやタグを指定するオプション</div>

| 指定したい対象 | オプション | コマンド例 |
| --- | --- | --- |
| 特定のコミット | `--rev` | `cargo install --git <URL> --rev 1a2b3c4d` |
| 特定のブランチ | `--branch` | `cargo install --git <URL> --branch develop` |
| 特定のタグ | `--tag` | `cargo install --git <URL> --tag v1.0.0` |

#### crates.io からインストール

crates.io に公開されているバイナリ crate は、クレート名を指定するだけでインストールできる。

```bash
cargo install ripgrep
```

| 指定したい対象 | オプション | コマンド例 |
| --- | --- | --- |
| 特定のバージョン | `--version` | `cargo install ripgrep --version 14.1.0` |
| Cargo.lock の通りに依存を解決する | `--locked` | `cargo install ripgrep --locked` |

`cargo install --list` で、インストール済みのツールを確認できる。

---

## パッケージ <a id="package" data-name="パッケージ"></a>

Rust のコードは 3階層 (package, crate, module) で管理する。

```text
Cargo package
│
├─ library crate
│   └─ modules...
│
└─ binary crate
     └─ modules...
```

- package: Cargo プロジェクト全体
- crate: コンパイル単位
- module: crate の中を整理する名前空間

```text
my_app/
├─ Cargo.toml
└─ src/
     ├─ lib.rs
     └─ main.rs
```

であれば

```text
package: my_app
├─ library crate → lib.rs
└─ binary crate  → main.rs
```

となる。

1つの package には、library crate を最大1つ、binary crate をいくつでも含められる。

### crate root

crate には必ず根 (root) があり、library crate であれば lib.rs が、binary crate であれば main.rs が root となる。<br>
`src/bin/` 配下の各 `.rs` ファイルも、それぞれ独立した binary crate の root になる。

### mod モジュール名 により 子 module を宣言する

例えば lib.rs における `mod search;` は、この module の中に search という module がある、という宣言になる。

```rust
// lib.rs
mod search;
```

```text
crate
└─ search
```

### 同名の .rs とディレクトリを作って 子 module を定義する

子 module を定義するには、このようにファイルとディレクトリを作って、

```text
src/
├─ lib.rs
├─ search.rs
└─ search/
    └─ file.rs
```

```rust
// lib.rs
mod search;
```

```text
crate
└─ search
```

さらに

```rust
// search.rs
mod file;
```

```text
crate
└─ search
     └─ file
```

となる。

### mod.rs を使う旧来の書き方

```text
src/
├─ lib.rs
└─ search/
    ├─ mod.rs   ← search module の本体 (search.rs の代わり)
    └─ file.rs
```

どちらの書き方でも同じ module 構造になる。現在は `search.rs` と `search/` を並べる形が主流で、ファイル名だけでどの module か分かりやすい。

### 可視性 pub と use

module の中の要素は、既定では非公開で、定義された module とその子 module の中でしか使えない。外から使わせたいものには `pub` を付ける。

```rust
// lib.rs
mod search;           // 非公開の module (クレートの外からは見えない)
pub mod util;         // 公開する module

pub use search::find; // search::find (search 内で pub fn として宣言されている前提) を crate 直下に再公開する
```

`pub(crate)` を付けると、同じクレートの中だけに公開できる。<br>
使う側では `use` でパスを短縮できる。

```rust
use my_app::util::helper; // main.rs などから、自作の lib.rs の要素を使う
use crate::search::find;  // 自分のクレートの root から数えたパス
use super::config;        // 1つ上の module から数えたパス
```

### バイナリクレートとライブラリクレート

バイナリクレートとライブラリクレートを分割する設計にすることで、エントリーポイントの変更が容易になり、結合テストが書きやすくなる。<br>
また、ビルド・コンパイルの高速化が期待でき、汎用的で拡張性の高い設計となる。

---

## 制御フロー <a id="control-flow" data-name="制御フロー"></a>

### 式と文

Rust は **式指向** の言語で、`if` や `match`、`loop`、ブロック `{ }` は、文ではなく **式** であり、値を返す。<br>
他言語の三項演算子 (`条件 ? A : B`) に相当する構文はなく、代わりに `if` 式を使う。

| 種類 | 説明 | 例 |
| --- | --- | --- |
| 式 (expression) | 評価されて値になる | `1 + 2`、`foo()`、`if ... { } else { }`、`match ...`、`{ ... }` |
| 文 (statement) | 値を返さない。末尾に `;` が付く | `let x = 5;`、式の末尾に `;` を付けたもの |

```rust
let n = 7;

// 三項演算子の代わりに if 式を使う
let kind = if n % 2 == 0 { "偶数" } else { "奇数" };

// match も式なので、値を束縛できる
let label = match n {
    0 => "ゼロ",
    1..=9 => "1桁",
    _ => "2桁以上",
};

// ブロックも式で、最後の式 (; なし) がブロックの値になる
let y = {
    let a = 3;
    a * a // ; を付けない
};

// loop も式で、break で値を返せる
let found = loop {
    break 42;
};
```

- **セミコロンの有無で値が変わる**: ブロックの最後の式に `;` を付けると文になり、ブロックの値は `()` (ユニット型) になる。関数の戻り値が意図せず `()` になるエラーの原因として多い。
- **値を使うなら、すべての分岐の型を揃える**: `if` や `match` の結果を変数に束縛する場合は、各ブランチの型が同じで、`if` には `else` が必要になる。
- **値を使わないなら文として書いてよい**: `println!` だけを呼ぶ `if` や `match` は、値が `()` になるだけで問題ない。
- `return`、`break`、`continue`、`panic!` は、型が `!` (never 型) で、どの型にも合わせられる。そのため、分岐の一部で処理を抜けても型の不一致にならない。
- `for` と `while` も式だが、値は常に `()`。値を持って抜けられるのは `loop` の `break 値;` だけ。

```rust
let n: i32 = match s.parse() {
    Ok(v) => v,
    Err(_) => return, // never 型なので、i32 の分岐と並べられる
};
```

<pre><code class="tips">Rust に三項演算子がないのは、if が式であれば同じことを書けるため。
複雑な条件は、一行にまとめずに match や let else に分けた方が読みやすい。</code></pre>

### match

match は、値のパターンで識別して、中身を取り出しながら分岐し、しかも漏れがないか確認できる仕組み。<br>
上から順に評価されて、最初にマッチしたアームが選ばれるため、より具体的なものを先、より包括的なものを後に書く。

if let は match の糖衣構文であり、構造は等価である。

```rust
let age = 15;

match age {
    0 => println!("新生児です"),
    1 | 2 => println!("乳幼児です"),   // 1 または 2
    3..=12 => println!("子供です"),    // 3から12(12を含む)
    13..=19 => println!("ティーンエイジャーです"),
    _ => println!("大人です"),         // その他すべて
}
```

アームのコードが短い場合、波括弧 {} は使用しない。<br>
複数行のコードがある場合は波括弧で囲い、カンマ(,)は省略する。

```rust
fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        }
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

#### match は式

match 全体が値になるため、`let` の右辺に書いたり、関数の最後に書いて戻り値にしたりできる (上の `value_in_cents` も、最後の式として値を返している)。<br>
すべてのアームの型は同じにそろえる。

```rust
let n = 5;

let size = match n {
    0 => "なし",
    1..=3 => "少ない",
    _ => "多い",
}; // ここは let 文なので ; が必要

println!("{size}");
```

アームが値を返さない場合 (`println!` など) は、全体の値が `()` になる。上の `age` の例は、値を使わず文として書いた match になる。

#### 変数束縛

値を束縛して取り出す。ワイルドカード(_) と同様、すべての値にマッチする。

```rust
match x {
    n => println!("{n}"),
}
```

#### ワイルドカード

すべての値にマッチするが、値を使わない。

```rust
if let _ = value {
    println!("必ず実行");
}
```

`if let _ = value` は常にマッチするため、コンパイラに警告される (説明用の例)。通常は `match` の最後の `_ =>` として使う。

#### リテラル

値そのものを比較する。

```rust
// 整数
match n {
    0 => {}
    1 => {}
    100 => {}
    _ => {}
}

// bool
match flag {
    true => {}
    false => {}
}

// 文字
match c {
    'a' => {}
    _ => {}
}
```

#### OR 条件

```rust
match x {
    1 | 2 | 3 => println!("small"),
    _ => {}
}

// 文字もOK
match c {
    'a' | 'e' | 'i' | 'o' | 'u' => {}
    _ => {}
}
```

#### AND 条件

```rust
match (a, b) {
    (Some(x), Ok(y))  => println!("両方成功: {x}, {y}"),
    (Some(x), Err(e)) => println!("bだけ失敗: {e}"),
    (None, _)         => println!("aが失敗"),
}
```

#### 範囲

```rust
match x {
    1..=5 => {}
    _ => {}
}

// 文字もOK
match c {
    'a'..='z' => {}
    _ => {}
}
```

#### タプル

```rust
match point {
    (0, 0) => {}
    (x, y) => {}
}

// 一部無視
match point {
    (0, _) => {}
    (_, 0) => {}
    _ => {}
}
```

#### 構造体

```rust
struct Point {
    x: i32,
    y: i32,
}

match p {
    Point { x, y } => {}
}
```

```rust
// 名前を変更
match p {
    Point { x: a, y: b } => {}
}

// 一部を取得
match p {
    Point { x, .. } => {}
}
```

#### タプル構造体

```rust
struct Color(u8, u8, u8);

match c {
    Color(r, g, b) => {}
}
```

#### enum

```rust
enum Message {
    Quit,
    Move(i32, i32),
    Write(String),
}

match msg {
    Message::Quit => {}
    Message::Move(x, y) => {}
    Message::Write(s) => {}
}
```

#### ネスト

```rust
match value {
    Some((0, _)) => {}
    Some((x, y)) => {}
    None => {}
}
// Some(Ok(x)) なども可能
```

#### Some

```rust
match value {
    Some(x) => {
        println!("{x}");
    }
    None => {
        println!("None.");
    }
}
```

#### Ok / Err

```rust
match result {
    Ok(v) => {}
    Err(e) => {}
}
```

#### @バインディング

値を束縛しつつ、中身を判定。

```rust
match x {
    n @ 1..=5 => println!("{n}"),
    _ => {}
}

// enum
match msg {
    Message::Move(x @ 0..=100, y) => {}
    _ => {}
}
```

```rust
match slice {
    [head, tail @ ..] => {
        // head : 先頭の1要素
        // tail : 残りの要素全体 (スライス)
    }
    _ => {} // 空のスライス (要素数 0) の場合
}
```

#### ref

所有権を奪わない。

こちらが一般的な書き方。

```rust
match &option {
    Some(s) => {}
    None => {}
}
```

この書き方もある。

```rust
match option {
    Some(ref s) => {
        println!("{s}");
    }
    None => {}
}
```

#### ref mut

可変借用。

こちらが一般的な書き方。

```rust
match &mut option {
    Some(s) => {}
    None => {}
}
```

この書き方もある。

```rust
match option {
    Some(ref mut s) => {
        s.push_str("!");
    }
    None => {}
}
```

<pre><code class="tips">ref / ref mut は、参照に対してマッチする書き方 (match &option) で代用できるため、現在はほとんど使われない。</code></pre>

#### &

参照はがし。

```rust
let x = &5;

match x {
    &n => println!("{n}")
}
```

#### &mut

```rust
match x {
    &mut n => {}
}
```

#### スライス

```rust
match slice {
    [] => {} // 要素数が0
    [x] => {} // 要素数が1
    [x, y] => {} // 要素数が2
    _ => {} // それ以外 (要素数が3以上)
}
```

#### 可変長スライス

```rust
// 先頭の要素を取り出す
match slice {
    [first, ..] => {}
    [] => {}
}

// 先頭と末尾の要素を取り出す (要素が2つ以上の場合)
match slice {
    [first, .., last] => {}
    _ => {}
}
```

#### 配列

```rust
match arr {
    [1, 2, 3] => {}
    [a, b, c] => {}
}

if let [1, .., 5] = numbers {
    println!("1で始まって5で終わる配列です");
}
```

#### ガード if

追加条件を書ける。

```rust
match x {
    n if n > 10 => {}
    _ => {}
}

// enum
match msg {
    Message::Move(x, y) if x == y => {}
    _ => {}
}
```

---

### if

```rust
for i in 1..16 {
    if (i % 3 == 0) && (i % 5 == 0) {
        println!("FizzBuzz");
    } else if i % 3 == 0 { // 条件式を () で囲む必要はない
        println!("Fizz");
    } else if i % 5 == 0 {
        println!("Buzz");
    } else {
        println!("{}", i);
    }
}
```

#### 戻り値を持つ if

if は式なので、let の右辺に持ってきて、値を返して束縛することができる。<br>
Rust には三項演算子 (`条件 ? A : B`) がないので、これが同じ役割になる。

```rust
let number = if condition { 5 } else { 6 };
// 他言語の  number = condition ? 5 : 6;  に相当
```

各ブランチの最後の式 (`;` なし) が値になり、型は同じにそろえる必要がある。値を使う場合は `else` も必須。

```rust
// let a = if flag { 1 } else { "one" }; // error: ブランチの型が違う
// let b = if flag { 1 };                // error: else がなく、値が () になる

let c = if flag {
    let base = 10;   // ブランチの中で文を書いてもよい
    base * 2         // 最後の式が値になる
} else {
    0
};
```

引数や戻り値の位置にも、そのまま書ける。

```rust
println!("{}", if n > 0 { "正" } else { "0以下" });

fn abs(n: i32) -> i32 {
    if n < 0 { -n } else { n } // 関数の最後の式として値を返す
}
```

`if let` も式なので、同様に値を返せる (次節)。

### if let

<span class="code-like">if let</span> は <span class="code-like">match</span> の糖衣構文で、<span class="code-like">match</span> と同じパターンが使える。

特定のパターンだった場合にのみ処理する時に有効。

```rust
// Noneの場合は何もしない
if let Some(i) = some_value {
    println!("値は {} です", i);
}
```

else で包括的な処理も書けるが、アームが増えたら match が自然。

```rust
if let Some(i) = some_value {
    println!("値は {} です", i);
} else {
    println!("Noneでした");
}
```

if let も式なので、値を返して束縛できる (`else` が必要)。

```rust
let n = if let Some(i) = some_value { i } else { 0 };
```

### let チェーン

複数のパターンや条件がすべて成立した場合にだけ処理する (Rust 2024 エディション、Rust 1.88 以降で使用可能)。

```rust
if let Some(x) = a
    && let Ok(y) = b
{
    println!("{x}, {y}");
}
```

### while let

パターンにマッチし続ける限りループする。

```rust
let mut stack = vec![1, 2, 3];

// pop()はOptionを返す。Someである限りループを回す
while let Some(top) = stack.pop() {
    println!("取り出した値: {}", top);
}
```

### let else(ガード構文)

Rust 1.65 で追加された機能で、パターンに一致すれば変数を取り出し、一致しなければ else ブロックを実行する。<br>
else ブロックでは、return、break、continue、panic! などで必ずスコープを抜ける必要がある (後続の処理に進んではいけない)。

```rust
fn get_user_id(id_str: &str) -> i32 {
    // Okなら id を取り出す。Errなら関数の外に抜ける(panicさせる例)
    let Ok(id) = id_str.parse::<i32>() else {
        panic!("IDは数字である必要があります: {}", id_str);
    };
    // ここで id (i32型) が直接使える
    id * 10
}
```

条件を満たさないものを次々と弾いていくガード節を使うことで、過度なネストを防げる。

```rust
fn process_input(input: Option<&str>) {
    // 1. 文字列が入っていなければ終了
    let Some(s) = input else { return; };

    // 2. 数値として解析できなければ終了
    let Ok(n) = s.parse::<i32>() else { return; };

    // 3. 0以下なら終了
    if n <= 0 { return; }

    // ネストがなく、変数 s や n がこのスコープで直接使える
    println!("有効な数値です: {}", n);
}
```

### for

```rust
for _i in 0..10 { // 0から9まで
    println!("hello");
}
```

```rust
for _i in 0..=10 { // 0から10まで
    println!("hello");
}
```

#### 逆順

```rust
for num in (1..4).rev() {
    println!("{num}"); // 3 2 1
}
```

#### イテレータの要素を順番に取り出す

```rust
let a = [10, 20, 30, 40, 50];

for elm in a {
    println!("the value is: {elm}");
}
```

| メソッド | 動作 |
| --- | --- |
| `iter()` | 要素を借用する |
| `into_iter()` | 要素をムーブする |
| `iter_mut()` | 要素を可変借用する |

<pre><code class="tips">for 文は IntoIterator の into_iter() を呼ぶため、コレクションをそのまま渡すと所有権がムーブされる。
参照 (&amp;v や &amp;mut v) を渡せば借用になる。</code></pre>

#### 使用例

```rust
fn main() {
    let mut names = vec!["Bob", "Frank", "Ferris"];

    for name in names.iter_mut() {
        *name = match name {
            &mut "Ferris" => "There is a rustacean among us!",
            _ => "Hello",
        }
    }

    println!("names: {:?}", names);
}
```

### while

条件が true の間ブロック内を繰り返す。

```rust
let mut number = 3;

while number != 0 {
    println!("{number}!");

    number -= 1;
}

// 発射！
println!("LIFTOFF!!!");
```

### loop

無限ループをする場合は while true ではなく loop を使用する。

```rust
fn main() {
    loop {
        println!("again!");
    }
}
```

#### break

ループを抜けるには break を使う。<br>
break は値を返すこともできる (loop は式で、`break` に渡した値がループ全体の値になる。<a href="#control-flow">式と文</a> も参照)。

```rust
let mut counter = 0;

let result = loop {
    counter += 1;

    if counter == 10 {
        break counter * 2;
    }
};

println!("The result is {result}");
```

#### continue

continue は、以降の処理を飛ばして、ループの次の反復に進む。

#### ネストとラベル

ネストしたループを回している時に外側のループを `break`、または `continue` したい場合は `'label` を用いてラベルを付け、break/continue にそのラベルを渡す。

```rust
fn main() {
    'outer: loop {
        println!("Entered the outer loop");
        loop {
            println!("Entered the inner loop");
            // これは内側のループのみを中断
            // break;
            // こちらは外側を中断
            break 'outer;
        }
        println!("This point will never be reached");
    }
    println!("Exited the outer loop");
}
```

#### ラベル付きブロック

Rust 1.65 以降は、ループ以外のブロックにもラベルを付けて、`break` で値を返しながら途中で抜けられる。

```rust
let found = 'search: {
    for x in [1, 2, 3] {
        if x == 2 {
            break 'search Some(x); // ブロックを抜けて、その値がブロックの値になる
        }
    }
    None
};
```

---

## range <a id="range" data-name="range"></a>

range は範囲を表す式で、イテレータとして使える (Python の range() に近い)。

| 書き方 | 意味 |
| --- | --- |
| `1..5` | 1以上、5未満 |
| `1..=5` | 1以上、5以下 |
| `..5` | 5未満 |
| `..=5` | 5以下 |
| `1..` | 1以上 |
| `..` | 全範囲 |
| `'a'..='z'` | 小文字のアルファベット |
| `'A'..='Z'` | 大文字のアルファベット |
| `'0'..='9'` | 数字 (char) |

### if 文で範囲チェック

```rust
let score = 85;

// score が 80 から 100 の間 (100を含む) にあるか判定
if (80..=100).contains(&score) {
    println!("優秀な成績です！");
}

// または matches! マクロを使うパターン
if matches!(score, 80..=100) {
    println!("優秀な成績です！");
}
```

### match 文での条件分岐

```rust
let age: u32 = 18;

match age {
    0..=12 => println!("子供料金です"),
    13..=19 => println!("中人・学生料金です"),
    20..=64 => println!("大人料金です"),
    65.. => println!("シニア料金です"), // 65以上すべて
}
```

### range はイテレータ

イテレータであるためこういった操作もできる。

```rust
// 0から始まる無限のループから、最初の5つだけ取り出す (0, 1, 2, 3, 4)
for i in (0..).take(5) {
    println!("{}", i);
}

// 3, 2, 1, 0 とカウントダウンする
for i in (0..=3).rev() {
    println!("{}!", i);
}

// 0から始まる偶数だけを列挙 (0, 2, 4, 6, 8)
for i in (0..10).step_by(2) {
    println!("{}", i);
}
```

---

## 関数 / メソッド <a id="function" data-name="関数 / メソッド"></a>

### 構文

```rust
fn func([argument...]) -> return_value {
    // 処理内容
    return_value // セミコロンを付けなければ戻り値となる
}
```

### メソッド

メソッドは impl ブロックの中に定義する。

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 { // インスタンスに関連づくため、第1引数に &self を取る
        self.width * self.height
    }
}
```

メソッドを呼び出す場合は、`インスタンス.関数名()`と記述する。

```rust
let rect = Rectangle {
    width: 25,
    height: 10,
};
println!("{}", rect.area()); // 250
```

<pre><code class="tips">// 明示的に所有権を表す書き方
impl MyStruct {
    fn by_ref(&self) { }
    fn by_mut(&mut self) { }
}

let mut obj = MyStruct;

// ドット演算子の場合
obj.by_ref();
obj.by_mut();

// 型名::メソッド名 の形式では、インスタンスを第1引数として渡す
MyStruct::by_ref(&obj);       // & を明示的に付ける必要がある
MyStruct::by_mut(&mut obj);   // &mut を明示的に付ける必要がある</code></pre>

### 関連関数

self を第1引数に持たない関数は、メソッドではなく関連関数と呼ぶ (他言語の静的メソッドに相当)。<br>
関連関数は、構造体の新規インスタンスを返すコンストラクタとしてよく使われる (`new` や `with_*` などの命名は <a href="#naming">関数の命名</a> を参照)。

```rust
impl Rectangle {
    fn square(size: u32) -> Self { // selfを取らない
        Self {
            width: size,
            height: size,
        }
    }
}
```

この関数を呼び出すには、`構造体名::関数名()`と記述する。

```rust
Rectangle::square(3);
```

### 高階関数

関数やクロージャを引数として受け取る関数。<br>
以下はイテレータ (後述) の主なメソッド。<br>
`map` や `filter` のようにクロージャを受け取るものが高階関数にあたる (`enumerate` や `collect` など、クロージャを取らないものも併せて載せている)。

| メソッド | 役割 |
| --- | --- |
| `map` | 各要素を変換 |
| `filter` | 条件に合う要素だけ残す |
| `filter_map` | 変換 + 不要なものを除外 |
| `fold` | 全要素を1つにまとめる |
| `flat_map` | 変換して平坦化 |
| `reduce` | 要素同士をまとめる |
| `for_each` | 各要素に処理を行う |
| `find` | 条件に合う最初の要素を探す |
| `any` | 1つでも条件を満たすか |
| `all` | すべての要素が条件を満たすか |
| `position` | 条件に合う要素の位置を探す |
| `enumerate` | `(index, value)` にする |
| `zip` | 2つの Iterator を組み合わせる |
| `take` | 先頭から N 個だけ |
| `skip` | 先頭 N 個を飛ばす |
| `collect` | Iterator をコレクションにする |

#### map

すべての要素を変換する。

```rust
let nums = vec![1, 2, 3, 4];

let result: Vec<_> = nums
    .iter()
    .map(|x| x * 2)
    .collect();
    // [2, 4, 6, 8]
```

#### filter

条件で絞り込む。クロージャが bool を返すのがポイント。

```rust
let nums = vec![1, 2, 3, 4, 5, 6];

let result: Vec<_> = nums
    .iter()
    .filter(|x| **x % 2 == 0)
    .collect();
    // [2, 4, 6]
```

#### filter_map

要素の変換 (map) と不要な要素の除外 (filter) を同時に行う。<br>
クロージャが Some(value) を返した要素を残して None を返した要素を無視する。<br>
クロージャのほか、`FnMut(Self::Item) -> Option<B>` として呼び出せるものであれば、通常の関数も渡せる。

```rust
fn main() {
    let data = vec!["1", "apple", "3", "orange", "5"];

    let numbers: Vec<i32> = data
        .into_iter()
        .filter_map(|s| s.parse::<i32>().ok()) // ok() で Result から Option に変換
        .collect();
        // [1, 3, 5]
}
```

#### fold

集約する (JavaScript の reduce と同じ)。

```rust
let nums = vec![1, 2, 3, 4];

let sum = nums
    .iter()
    .fold(0, |acc, x| acc + x);

println!("{}", sum);
// 10
```

```text
acc = 0

0 + 1 → 1
1 + 2 → 3
3 + 3 → 6
6 + 4 → 10
```

#### for_each

各要素に処理を行う。<br>
値を変換するのではなく、副作用を起こすのが目的であるため map とは役割が違う。

```rust
let nums = vec![1, 2, 3];

nums.iter().for_each(|x| {
    println!("{}", x);
});
```

#### find

条件を満たす最初の要素を `Option` で返す。

```rust
let nums = vec![1, 3, 5, 8, 10];

let result = nums.iter().find(|x| **x % 2 == 0);

println!("{:?}", result);
// Some(8)
```

#### any / all

##### any

ひとつでも条件を満たすか。

```rust
let nums = vec![1, 3, 5, 8];

let result = nums.iter().any(|x| *x % 2 == 0);
// true
```

##### all

すべて条件を満たすか。

```rust
let nums = vec![2, 4, 6, 8];

let result = nums.iter().all(|x| *x % 2 == 0);
// true
```

#### enumerate

要素にインデックスを付ける。

```rust
let names = vec!["Alice", "Bob", "Carol"];

for (i, name) in names.iter().enumerate() {
    println!("{}: {}", i, name);
}
// 0: Alice
// 1: Bob
// 2: Carol
```

#### zip

2つの Iterator を組み合わせる。

```rust
let names = vec!["Alice", "Bob", "Carol"];
let ages = vec![20, 30, 40];

let result: Vec<_> = names
    .iter()
    .zip(ages.iter())
    .collect();
```

この場合、各要素は参照のタプル `(&&str, &i32)` になる。

#### flat_map

map した結果 (イテレータ) を平坦化する。

```rust
let nums = vec![1, 2, 3];

let result: Vec<_> = nums
    .iter()
    .flat_map(|x| 0..*x)
    .collect();
    // [0, 0, 1, 0, 1, 2]
```

```text
// 普通の map だとこうなる (イテレータのイテレータになる)
[[0], [0, 1], [0, 1, 2]]
```

### アダプタと消費メソッド

イテレータアダプタは、新しいイテレータを返すメソッド。<br>
遅延評価 (lazy) のため、`collect()` などで消費するまで処理は行われず、要素が1つずつチェーンを通って評価される。

```rust
v.iter()
    .filter(|x| *x % 2 == 0)
    .map(|x| x * 2)
    .collect::<Vec<_>>(); // ここで消費されて初めて処理が走る
```

| 種類 | 主なメソッド |
| --- | --- |
| アダプタ (新しいイテレータを返す。遅延評価) | `map`, `filter`, `filter_map`, `flat_map`, `flatten`, `enumerate`, `zip`, `chain`, `take`, `skip`, `take_while`, `skip_while`, `step_by`, `rev`, `cloned`, `copied`, `peekable`, `inspect` |
| 消費メソッド (イテレータを使い切って値を返す) | `collect`, `sum`, `product`, `count`, `fold`, `for_each`, `min`, `max`, `last`, `find`, `position`, `any`, `all`, `partition`, `unzip` |

```rust
// 条件を満たす間だけ / 満たさない間は読み飛ばす
let v: Vec<_> = (1..=10).skip_while(|n| *n < 3).take_while(|n| *n <= 6).collect(); // [3, 4, 5, 6]

// 条件で2つのコレクションに振り分ける
let (even, odd): (Vec<i32>, Vec<i32>) = (1..=6).partition(|n| n % 2 == 0);
// even = [2, 4, 6], odd = [1, 3, 5]
```

<pre><code class="tips">min() / max() は空のイテレータだと None を返すため Option になる。
f64 は Ord を実装しないので min() / max() が使えない。
max_by(|a, b| a.total_cmp(b)) などを使う。</code></pre>

#### filter

値を選別する。

```rust
.filter(|x| 条件)
// FnMut(&T) -> bool
```

#### map

値を変換する。

```rust
.map(|x| 新しい値)
// FnMut(T) -> U
```

#### for_each

イテレータを消費して、各要素に処理を行う (アダプタではない)。

```rust
iter.for_each(|x| println!("{}", x));
```

#### sum

要素の合計を返す (イテレータを消費する)。型注釈が必要。

```rust
let sum: i32 = v.iter().sum();
```

#### collect

collect で Iterator をコレクションに変換する (collect はアダプタではなく、イテレータを消費する)。

```rust
let v: Vec<_> = iter.collect();
```

---

## 関数の命名 <a id="naming" data-name="関数の命名"></a>

Rust の標準ライブラリは、名前の接頭辞・接尾辞に意味を持たせている。<br>
自作の関数も同じ規則に揃えると、名前を見ただけで「所有権を奪うか」「失敗するか」「コストは重いか」が伝わる。<br>
基になっているのは公式の [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/naming.html) で、`clippy` が一部を自動で検査してくれる。

`to_*` / `into_*` / `as_*` と所有権の関係は、<a href="#ownership">所有権</a> の「所有権を軸にしたメソッドの命名規則」を参照。

### 大文字・小文字

| 対象 | 規則 | 例 |
| --- | --- | --- |
| 関数・メソッド・変数・モジュール・クレート | `snake_case` | `read_to_string` |
| 型・トレイト・enum のバリアント | `UpperCamelCase` | `HashMap`, `Iterator` |
| 定数・static | `SCREAMING_SNAKE_CASE` | `MAX_SIZE` |
| 型パラメータ | 大文字1文字、または短い CamelCase | `T`, `E`, `K`, `V` |

略語は1語として扱う (`Uuid`, `Stdin`。`UUID` や `StdIn` にはしない)。

### コンストラクタ

| 名前 | 意味 | 例 |
| --- | --- | --- |
| `new` | 主たるコンストラクタ。`Self` を返す | `Vec::new`, `String::new` |
| `with_*` | 特定の設定や値を指定して構築する | `Vec::with_capacity`, `HashMap::with_hasher` |
| `from_*` | 別の表現から変換して構築する (`self` を取らない関連関数) | `String::from_utf8`, `u32::from_str_radix` |
| `default` | `Default` トレイトによる既定値 | `Config::default()` |
| `open` / `create` / `connect` | I/O を伴い、失敗しうる取得は `new` ではなく動詞にする | `File::open`, `TcpStream::connect` |
| `parse` | 文字列から解析する (`FromStr` と対) | `Url::parse`, `"5".parse::<i32>()` |

- `new` は「初期化するだけで、重い処理や副作用を持たない」ことが期待される。
- 引数なしの `new()` を作ったら `Default` も実装する (clippy の `new_without_default` が指摘する)。
- 検証に失敗しうるときは `Option` や `Result` を返す (`NonZeroU32::new(0)` は `None`)。
- 検査を省く `unsafe` 版は `*_unchecked` (`String::from_utf8_unchecked`)。

### ビルダー (builder / build)

設定項目が多いときのパターン。`Foo::builder()` が `FooBuilder` を返し、`build()` で `Foo` を組み立てる。

```rust
struct Server { host: String, port: u16 }
struct ServerBuilder { host: String, port: u16 }

impl Server {
    fn builder() -> ServerBuilder {
        ServerBuilder { host: "localhost".into(), port: 8080 }
    }
}

impl ServerBuilder {
    // 設定メソッドは接頭辞を付けず、項目名だけにするのが標準ライブラリの流儀
    fn host(mut self, host: &str) -> Self { self.host = host.into(); self }
    fn port(mut self, port: u16) -> Self { self.port = port; self }
    fn build(self) -> Server { Server { host: self.host, port: self.port } }
}

let server = Server::builder().host("0.0.0.0").port(3000).build();
```

| 名前 | 役割 |
| --- | --- |
| `builder()` | ビルダーを返す関連関数 |
| 項目名 (`host`, `port`) | 設定して `Self` (または `&mut Self`) を返す。`with_host` と書くクレートもある |
| `build()` | 目的の型を組み立てる。検証が必要なら `Result<Foo, E>` を返す |
| `spawn` / `open` / `output` | 組み立てと実行を兼ねる終端メソッドは、操作の名前にする (`OpenOptions::open`, `Command::spawn`) |
| `finish()` | 状態を持つ処理を締めくくる (`Hasher::finish`, `DebugStruct::finish`) |

<pre><code class="tips">設定メソッドの形は2通りある。
- self を消費して Self を返す (consuming): チェーンの途中で所有権が移る。build(self) で中身をムーブしたいときに向く。
- &amp;mut self を取って &amp;mut Self を返す (non-consuming): 変数に持ち回って条件付きで設定を足せる (Command::arg など)。
API Guidelines では、終端メソッドが &amp;self で済むなら non-consuming が推奨される。</code></pre>

### 取り出し・置換 (take / replace / swap)

| 名前 | 動作 | 例 |
| --- | --- | --- |
| `take` | 値を取り出し、元の場所に「空」を残す | `Option::take` (`None` を残す), `Cell::take` |
| `mem::take` | `Default` の値を残して取り出す | `mem::take(&mut vec)` |
| `replace` | 新しい値を入れて、古い値を返す | `mem::replace`, `Option::replace` |
| `swap` | 2つの値を入れ替える | `mem::swap`, `slice::swap` |
| `insert` | 値を入れて、その可変参照を返す (コレクションでは要素の挿入) | `Option::insert`, `Vec::insert` |
| `get_or_insert_with` | なければクロージャで作って、その参照を返す | `Option::get_or_insert_with` |
| `take_if` | 条件を満たすときだけ `take` する (Rust 1.80 以降) | `Option::take_if` |

`Iterator::take(n)` と `Read::take(limit)` は同名だが別物で、「先頭 n 個 (n バイト) までに制限する」アダプタ。`take_while` も同系統。<br>
`std::mem` の詳細は <a href="#std">std</a> を参照。

### getter / setter

getter には `get_` を付けない (API Guidelines の C-GETTER)。フィールド名をそのままメソッド名にする。

```rust
impl User {
    fn name(&self) -> &str { &self.name }                    // getter (get_name にしない)
    fn name_mut(&mut self) -> &mut String { &mut self.name } // 可変版は _mut
    fn set_name(&mut self, name: String) { self.name = name } // setter は set_*
}
```

`get` が使われるのは、添字などで **失敗しうる取得** (`Vec::get(i)` → `Option`) や、`Cell::get` のように取得するものが1つに決まるとき。

### 接尾辞・接頭辞のパターン

| 名前 | 意味 | 例 |
| --- | --- | --- |
| `_mut` | 可変参照版 | `iter_mut`, `get_mut`, `last_mut` |
| `_by` / `_by_key` | 比較関数・キー関数を渡す版 | `sort_by`, `max_by_key`, `dedup_by_key` |
| `_with` | 値をクロージャで遅延生成する | `get_or_insert_with`, `or_insert_with` |
| `_or` / `_or_else` / `_or_default` | 代替値 / 遅延評価 / `Default` | `unwrap_or`, `unwrap_or_else`, `unwrap_or_default` |
| `_all` | 全部やりきる | `write_all` |
| `_exact` | 指定サイズちょうど | `read_exact`, `chunks_exact` |
| `_to_end` / `_to_string` | 終端や文字列まで読む | `read_to_end`, `read_to_string` |
| `_lossy` | 不正なデータを置換して続行する | `String::from_utf8_lossy` |
| `_ascii` | ASCII 限定 | `to_ascii_uppercase` |
| `r` で始まる | 逆方向 | `rfind`, `rsplit` |
| `_start` / `_end` | 文字列の先頭側・末尾側 | `trim_start`, `trim_end` (`trim_left` は非推奨) |
| `_at` / `_first` / `_last` | 位置・端での分割 | `split_at`, `split_first` |

### 失敗の表現 (try_ / checked_ / unwrap / expect)

| 名前 | 失敗したとき | 例 |
| --- | --- | --- |
| `checked_*` | `None` を返す (主に算術のオーバーフロー) | `checked_add` |
| `wrapping_*` / `saturating_*` / `overflowing_*` | 折り返す / 上限・下限で止まる / 折り返しと発生の有無を返す | `wrapping_add`, `saturating_sub` |
| `try_*` | `Result` を返す | `try_from`, `try_into`, `try_reserve` |
| `try_*` (ブロックしない版) | 待たずに、取れなければ `Err` を返す | `Mutex::try_lock`, `mpsc::try_recv` |
| `unwrap` / `expect` | パニックする | `opt.expect("...")` |
| `*_unchecked` | 検査を省く。違反すると未定義動作になる `unsafe` 関数 | `get_unchecked`, `unwrap_unchecked` |

- `try_` には「失敗しうる」と「ブロックしない」の2つの意味がある。型 (`Result` が返るか) と文脈で見分ける。
- `expect` のメッセージには、失敗の内容ではなく **期待していたこと** を書く (`"環境変数 HOME が設定されているはず"` のように)。
- 値を取り出す系の `unwrap_or*` や `ok_or*` は <a href="#option-result">Option と Result</a> を参照。

### 変更するか、新しい値を返すか

名前が「その場で変更する」のか「新しい値を返す」のかを表す。

| 変更する (`&mut self`) | 新しい値を返す | 違い |
| --- | --- | --- |
| `sort` | itertools の `sorted` など | std の `sort` は破壊的 |
| `reverse` | `rev` | `reverse` はその場で並べ替え、`rev` は逆順のイテレータを返す |
| `make_ascii_uppercase` | `to_ascii_uppercase` | `make_*` は「その場で」、`to_*` は新しい値 |
| `Rc::make_mut` | - | 共有されていればクローンして、可変参照を返す |

- 状態を変える操作は **動詞** (`push`, `sort`, `clear`)。
- 状態を観察するだけの操作は **名詞・形容詞** (`len`, `capacity`, `is_empty`)。
- `bool` を返すものは `is_*` / `has_*` (`is_empty`, `has_root`)。

### clippy による検査

`clippy::wrong_self_convention` は、接頭辞と `self` の型の対応を検査する。

| 接頭辞 | 期待される `self` |
| --- | --- |
| `as_` | `&self` / `&mut self` |
| `to_` | `&self` (`Copy` 型なら `self`) |
| `into_` | `self` |
| `is_` | `&self` (`self` も可) |
| `from_` | なし (関連関数) |

<pre><code class="tips">cargo clippy を通しておくと、to_ で self を消費していたり、new() に Default がなかったりといった命名の不整合に気付ける。</code></pre>

---

## クロージャ <a id="closure" data-name="クロージャ"></a>

### 基本構文

```rust
|引数| 式
```

以下はすべて同じ意味で、下に行くほど表記が省略されている。

```rust
fn add_one_v1(x: u32) -> u32 { x + 1 }
let add_one_v2 = |x: u32| -> u32 { x + 1 };
let add_one_v3 = |x| { x + 1 };
let add_one_v4 = |x| x + 1;
```

`v3` / `v4` のように型注釈を省略した場合は、最初に使われた箇所から引数と戻り値の型が推論される (一度も使わないと推論できずエラーになる)。

### キャプチャ

クロージャの大きな特徴として、スコープの変数をキャプチャして使える。

```rust
let x = 10;

let f = |y| x + y; // xをキャプチャ

println!("{}", f(5)); // 15
```

### クロージャのトレイト

クロージャには3つのトレイト (`Fn` / `FnMut` / `FnOnce`) があり、クロージャの本体がキャプチャした値をどう扱うかによって、どのトレイトを実装するかが決まる。

1. キャプチャなし、または不変借用
    ```rust
    let x = 10;
    let f = |y| x + y; // &x を借用
    f(5);              // 呼び出すことで y の型も決まる
    println!("{}", x); // OK
    ```
    - `Fn + FnMut + FnOnce` を実装。
2. 可変借用
    ```rust
    let mut x = 10;
    let mut f = |y| {
        x += y;
    };
    f(5);
    println!("{}", x); // 15
    ```
    - `FnMut + FnOnce` を実装。
3. 所有権を消費
    ```rust
    let x = String::from("hello");
    let f = move || {
        let y = x; // x の所有権をクロージャの外へ渡す (消費する)
        println!("{}", y);
    };
    f();
    // f(); // ❌ 2回目は呼べない
    // println!("{}", x); // ❌ x はムーブ済みで使えない
    ```
    - `FnOnce` のみを実装。

<pre><code class="tips">move はキャプチャの方法 (所有権をクロージャに移す) を指定するもので、実装するトレイトは本体の処理で決まる。
例えば move || println!("{}", x) は、x を読むだけなので Fn も実装する。</code></pre>

### クロージャを引数・戻り値にする

```rust
// 引数: ジェネリクスとトレイト境界で受け取る
fn apply<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(x)
}

// 戻り値: 1種類のクロージャなら impl Fn
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n // n を所有してクロージャに持たせる
}

// 戻り値: 条件によって異なるクロージャを返すなら Box<dyn Fn>
fn make_op(add: bool) -> Box<dyn Fn(i32) -> i32> {
    if add { Box::new(|x| x + 1) } else { Box::new(|x| x - 1) }
}
```

| 受け取りたいもの | 使うトレイト |
| --- | --- |
| 何度でも呼べて、状態を変更しない | `Fn` |
| 何度でも呼べて、状態を変更する | `FnMut` |
| 1回だけ呼べればよい (所有権を消費してもよい) | `FnOnce` |

引数で受け取る側は、できるだけ要求の緩い `FnOnce` → `FnMut` → `Fn` の順に、必要最小限のものを選ぶと、呼び出し側が渡せるクロージャの範囲が広がる。

---

## イテレータ <a id="Iterator" data-name="イテレータ"></a>

イテレータは要素をひとつずつ取り出す仕組みで、`Iterator` トレイトを実装する。<br>
イテレータは遅延評価 (lazy) で、消費されて初めて処理が走る。

```rust
trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;
}
```

### 3種類のイテレータ

所有権に応じて3種類のイテレータがある。

1. `iter()`
    - 借用
    - 型: `&T`
    - 不変参照
2. `iter_mut()`
    - 可変借用
    - 型: `&mut T`
    - 値が変更可能
3. `into_iter()`
    - ムーブ
    - 型: `T`
    - 元のコレクションは使えなくなる

### 自作のイテレータ

`next()` だけを実装すれば、`map` や `filter` などのアダプタはデフォルト実装がそのまま使える。

```rust
struct Counter {
    count: u32,
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None // None を返すとイテレーションが終わる
        }
    }
}

let v: Vec<u32> = Counter { count: 0 }.map(|x| x * 10).collect(); // [10, 20, 30, 40, 50]
```

---

## スマートポインタ <a id="smart-pointer" data-name="スマートポインタ"></a>

| 型 | 説明 |
| --- | --- |
| <a href="#box">Box&lt;T&gt;</a> | ヒープにデータを置くためのポインタ |
| <a href="#rc">Rc&lt;T&gt;</a> | ひとつのデータに複数の所有権を許可する (シングルスレッド用) |
| <a href="#weak">Weak&lt;T&gt;</a> | 所有権を持たない参照で、循環参照を防ぐ |
| <a href="#arc">Arc&lt;T&gt;</a> | `Rc<T>` のマルチスレッド版 |
| <a href="#refcell">RefCell&lt;T&gt;</a> | 不変な値の中身を変更できる内部可変性を与える |
| <a href="#cell">Cell&lt;T&gt;</a> | `Copy` な値を、参照を貸さずに入れ替える内部可変性を与える |
| <a href="#mutex">Mutex&lt;T&gt;</a> | `RefCell<T>` のスレッド安全版 |
| <a href="#rwlock">RwLock&lt;T&gt;</a> | `Mutex<T>` の亜種で、読み取りが多く書き込みが少ない場合に向く (複数の読み取りを同時に許可する) |
| <a href="#pin">Pin&lt;P&gt;</a> | データのアドレスを固定する |
| <a href="#cow">Cow&lt;'a, T&gt;</a> | 借用とクローンを使い分ける |

### 選び方

| やりたいこと | 使うもの |
| --- | --- |
| ヒープに置く、再帰的な型、トレイトオブジェクト | `Box<T>` |
| 複数の所有者を持つ (シングルスレッド) | `Rc<T>` |
| 複数の所有者を持つ (マルチスレッド) | `Arc<T>` |
| 共有したデータを変更する (シングルスレッド) | `Rc<RefCell<T>>` |
| 共有したデータを変更する (マルチスレッド) | `Arc<Mutex<T>>` |
| 読み取りが多い共有データを変更する (マルチスレッド) | `Arc<RwLock<T>>` |
| `Copy` な小さな値を、不変参照のまま変更する | `Cell<T>` |
| 循環参照を避ける (子から親への参照など) | `Weak<T>` |
| 変更が必要な時だけクローンする | `Cow<'a, T>` |

---

### `Box<T>` <a id="box"></a>

`Box<T>` は、データを明示的にヒープに確保する。<br>
また、明示的に所有権を奪う目的でも使う。<br>
以下は Box の主な利用法。

- コンパイル時にサイズが決まらない型 (再帰的なデータ構造など) を扱うとき
- 大きなデータの所有権を移すときに、コピーされないようにするとき
- 値を所有する必要があり、特定の型ではなく特定のトレイトの実装の有無のみを気にかける場合 (トレイトオブジェクト)

#### 使い方

##### 生成と参照

```rust
let b = Box::new(5); // 整数5をヒープに配置

println!("b = {}", *b); // 参照外し(*)で値を取り出せる
// println! は * が無くても中身を表示できる (Box は Display を実装している)
```

##### 再帰的なデータ構造

```rust
enum List {
    Cons(i32, Box<List>), // Boxを使わないとコンパイルエラー
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Nil))));
}
```

##### トレイトオブジェクトの利用

```rust
trait Speak {
    fn say(&self);
}

struct Dog;
impl Speak for Dog {
    fn say(&self) { println!("わんわん"); }
}

struct Cat;
impl Speak for Cat {
    fn say(&self) { println!("にゃー"); }
}

fn main() {
    // 異なる型を同じベクタに格納できる
    let animals: Vec<Box<dyn Speak>> = vec![
        Box::new(Dog),
        Box::new(Cat),
    ];

    for animal in animals {
        animal.say();
    }
}
```

### `Rc<T>` <a id="rc"></a>

`Rc<T>` は参照カウント方式のスマートポインタで、複数の所有者を持つことができ、すべての所有者がなくなってから解放される。<br>
`Rc<T>` は不変であり、シングルスレッドで使用するためだけのものであることに注意。<br>
可変で使用する場合は <a href="#rc-refcell">RefCell&lt;T&gt;</a> と組み合わせる。また、マルチスレッド環境で使用する場合は `Arc<T>` を使用する。

#### 使い方

```rust
use std::rc::Rc;

fn main() {
    let data = Rc::new(String::from("共有データ"));

    {
        // cloneしても中身のコピーは発生せず、ポインタとカウントが増えるだけ
        let consumer_a = Rc::clone(&data);
        println!("Aが使用中: {}, 参照数: {}", consumer_a, Rc::strong_count(&data));
    } // consumer_aがスコープを抜け、カウントが1に戻る

    println!("メインで使用中: {}, 参照数: {}", data, Rc::strong_count(&data));
}
```

#### `Rc<T>` を単独で使用するケース

- 通常の借用 (`&T`) は、所有者が借り手よりも長く生きていることをコンパイラに証明できる必要がある。そうできない場合に使う。
    - グラフ構造や木構造で、親ノードが消えても子ノードが別の場所から参照されて生き残る必要がある場合
    - イベント駆動のコールバックなど、いつ実行されるか分からない関数にデータを渡す場合
- 参照 (`&T`) ではなく所有権 (`T`) を要求するライブラリや関数に渡したい場合。`clone()` で増えるのは参照カウントだけなので、コストが小さい。
- `Rc<T>` の中身は共有参照としてしか触れず変更できないため、読み取り専用のデータを多くの場所に配る用途に向く。

### `Weak<T>` <a id="weak"></a>

`Rc<T>` 同士が互いに参照し合う (循環参照) と、参照カウントが 0 にならず、メモリが解放されない (リークする)。<br>
`Weak<T>` は所有権を持たない参照で、強い参照のカウント (`strong_count`) に含まれないため、循環を断ち切れる。

| メソッド | 説明 |
| --- | --- |
| `Rc::downgrade(&rc)` | `Rc<T>` から `Weak<T>` を作る |
| `weak.upgrade()` | `Option<Rc<T>>` を返す。中身が既に解放されていれば `None` |
| `Rc::strong_count(&rc)` / `Rc::weak_count(&rc)` | 強い参照 / 弱い参照の数 |

木構造で、親は子を所有し (`Rc`)、子は親を所有しない (`Weak`) ようにする例。

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,      // 親は Weak (所有しない) で持つ
    children: RefCell<Vec<Rc<Node>>>, // 子は Rc (所有する) で持つ
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    });
    println!("親: {:?}", leaf.parent.borrow().upgrade().map(|p| p.value)); // None

    let branch = Rc::new(Node {
        value: 5,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![Rc::clone(&leaf)]),
    });
    *leaf.parent.borrow_mut() = Rc::downgrade(&branch);

    println!("親: {:?}", leaf.parent.borrow().upgrade().map(|p| p.value)); // Some(5)
    println!(
        "branch: strong = {}, weak = {}",
        Rc::strong_count(&branch), // 1
        Rc::weak_count(&branch)    // 1
    );
}
```

<pre><code class="tips">マルチスレッド版には std::sync::Weak がある (Arc&lt;T&gt; と組み合わせる)。</code></pre>

### `Arc<T>` <a id="arc"></a>

`Arc<T>` はマルチスレッド用の `Rc<T>` で、参照カウントの増減がアトミックに行われるため、スレッド間で安全に共有できる。<br>
参照カウントの増減にアトミック操作 (CPU 間のキャッシュ同期など) を使うため、`Rc<T>` と比べて実行コストがある。<br>
可変で扱う場合は、`Mutex<T>` と併せて使う。

#### 使い方

```rust
use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![1, 2, 3]);

    let handles: Vec<_> = (0..3)
        .map(|i| {
            let data = Arc::clone(&data); // 参照カウントが増えるだけで、中身はコピーされない
            thread::spawn(move || {
                println!("thread {i}: {:?}", data);
            })
        })
        .collect();

    for handle in handles {
        handle.join().unwrap();
    }
    println!("参照数: {}", Arc::strong_count(&data)); // 1 (スレッドが終了したので元の1つだけ)
}
```

<pre><code class="tips">Arc&lt;T&gt; の中身は不変。共有したデータを変更する場合は Arc&lt;Mutex&lt;T&gt;&gt; にする。</code></pre>

### `RefCell<T>` <a id="refcell"></a>

`RefCell<T>` は、借用規則のチェックをコンパイル時から実行時に移す仕組み (内部可変性)。<br>
コードが借用規則に則っているとプログラマが確証を得ているが、コンパイラがそれを理解し保証できない場合に有用。<br>
`RefCell<T>` はシングルスレッド用で、スレッド間で共有する場合は `Mutex` を使う。<br>
実行時に借用規則に違反すると、パニックが発生する。<br>
パニックさせたくない場合は、`try_borrow()` / `try_borrow_mut()` で `Result` として受け取れる。

#### `RefCell` を使うべきケース

- グラフ構造、オブザーバーパターン、モックオブジェクトの作成など

#### 使い方

```rust
use std::cell::RefCell;

fn main() {
    let data = RefCell::new(10);

    {
        // 不変参照として借りる
        let r1 = data.borrow();
        println!("値は: {}", r1);
        // let r2 = data.borrow_mut(); // ここでこれを呼ぶと実行時にパニック
    } // r1 がここでスコープを抜けるので、次は可変で借りられる

    // 可変参照として借りて値を書き換える
    *data.borrow_mut() += 10;

    println!("更新後の値: {:?}", data.borrow()); // 20
}
```

#### `Rc<T>` と `RefCell<T>` の組み合わせ <a id="rc-refcell"></a>

```rust
use std::rc::Rc;
use std::cell::RefCell;

struct GameConfig {
    difficulty: String,
}

fn main() {
    // 1. 共有したいデータを RefCell で包み、さらに Rc で包む
    let shared_config = Rc::new(RefCell::new(GameConfig {
        difficulty: "Normal".to_string(),
    }));

    // 2. 参照をコピーして別々の場所に持っていく(中身は同じ実体)
    let player1_config = Rc::clone(&shared_config);
    let player2_config = Rc::clone(&shared_config);

    // 3. 片方が値を書き換える
    {
        let mut config = player1_config.borrow_mut();
        config.difficulty = "Hard".to_string();
    } // ここでロック(借用)が解除される

    // 4. もう片方でも変更が反映されている
    println!("Player 2 sees difficulty: {}", player2_config.borrow().difficulty);
}
```

<pre><code class="caution">この組み合わせはシングルスレッド限定。</code></pre>

### `Cell<T>` <a id="cell"></a>

`Cell<T>` は、不変参照 (`&Cell<T>`) 経由でも値を入れ替えられる内部可変性を与える。<br>
`RefCell<T>` と違って中身への参照を貸し出さず、値のコピーや入れ替えだけを行うため、実行時の借用チェックがなく、パニックしない。

```rust
use std::cell::Cell;

let c = Cell::new(5);

c.set(10);               // 不変の c でも値を置き換えられる
let v = c.get();         // 10 (Copy な値をコピーして取り出す)
let old = c.replace(20); // 10 (置き換えて、古い値を返す)
```

| | `Cell<T>` | `RefCell<T>` |
| --- | --- | --- |
| 値の扱い | コピー・入れ替え (`get` は `T: Copy` が必要) | 参照 (`Ref` / `RefMut`) を借りる |
| 向く型 | 数値やフラグなどの小さな `Copy` 型 | 任意の型 |
| 実行時の借用チェック | なし (参照を貸さないため) | あり (違反するとパニック) |

### `Mutex<T>` <a id="mutex"></a>

`Mutex<T>` は `Mutual Exclusion` (相互排他)の略で、複数のスレッドが同時に同じデータにアクセスしてデータが壊れるのを防ぐ。

#### 使い方

1. `lock()` を呼ぶ<br>
    データにアクセスしたいスレッドは `.lock()` を呼ぶ。他のスレッドが使用中であれば、そのスレッドが使い終わるまで待機 (ブロック) する。
2. `MutexGuard` を受け取る<br>
    ロックに成功すると `MutexGuard` という特別な型が返され、これがある間だけ中のデータ `T` を `&mut T` として自由に読み書きできる。
3. `MutexGuard` がスコープを抜けると自動的にロックが解除される。

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0)); // Arc で共有、Mutex で可変に
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            // ロックを取得。他のスレッドがロック保持中にパニックした場合 (ポイズニング) は Err が返るため unwrap() で取り出す
            let mut num = counter.lock().unwrap();
            *num += 1;
        }); // ここで num (MutexGuard) がスコープを抜け、自動でロック解除
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap(); // すべてのスレッドの終了を待つ
    }
    println!("結果: {}", *counter.lock().unwrap()); // 10
}
```

<pre><code class="caution">同じスレッドで lock() を二重に呼ぶと、デッドロック (またはパニック) になる。
MutexGuard は必要な範囲だけで保持し、不要になったら早めにスコープを抜けさせる。</code></pre>

### `RwLock<T>` <a id="rwlock"></a>

`RwLock<T>` は、読み取り (`read()`) のロックを複数のスレッドが同時に取得でき、書き込み (`write()`) のロックは1つのスレッドだけが取得できる。<br>
読み取りが多く、書き込みが少ない場合に `Mutex<T>` より有利になる。

```rust
use std::sync::{Arc, RwLock};
use std::thread;

fn main() {
    let config = Arc::new(RwLock::new(String::from("v1")));

    // 読み取り: 複数同時に取得できる
    {
        let r1 = config.read().unwrap();
        let r2 = config.read().unwrap();
        println!("{r1} {r2}");
    } // 読み取りロックはここで解除される

    // 書き込み: 1つだけ取得でき、その間は読み取りも待たされる
    {
        let mut w = config.write().unwrap();
        *w = String::from("v2");
    }

    let c = Arc::clone(&config);
    thread::spawn(move || println!("{}", c.read().unwrap())).join().unwrap(); // v2
}
```

<pre><code class="caution">読み取りのガードを保持したまま、同じスレッドで write() を呼ぶとデッドロックする。</code></pre>

### `Pin<P>` <a id="pin"></a>

`Pin<P>` はデータをメモリ上で移動 (move) されないように固定する。これにより、自己参照構造が移動して内部のポインタが無効になることを防ぐ。<br>
主に非同期処理 (`Future`) の内部で使われる。<br>
`async` ブロックは、自分自身の内部を指す参照 (自己参照) を持つことがあるため、`Future` の `poll` は `Pin<&mut Self>` を要求する。

ほとんどの型は、移動しても安全な `Unpin` を実装しているため、`Pin` を意識する必要はない。実際には、次のように `Box::pin` で固定して使うことが多い。

```rust
use std::future::Future;
use std::pin::Pin;

// 異なる Future を同じ型として扱う
fn make_future() -> Pin<Box<dyn Future<Output = i32>>> {
    Box::pin(async { 42 }) // Box に入れて固定する
}
```

<pre><code class="tips">スタック上で固定したい場合は、std::pin::pin! マクロが使える。</code></pre>

### `Cow<'a, T>` <a id="cow"></a>

`Cow` は Clone-on-Write (書き込み時にクローン) の略で、基本的には参照 (借用) で済ませ、書き換える必要がある時だけクローンして自分のものとする。<br>
用途としては、文字列の加工で変更がない場合は `&str` として扱い、変更が必要な時だけ `String` に変換して返すような効率的な処理ができる。

```rust
use std::borrow::Cow;

// スペースを含む場合だけ新しい String を作り、含まなければ借用のまま返す
fn remove_spaces(input: &str) -> Cow<'_, str> {
    if input.contains(' ') {
        Cow::Owned(input.replace(' ', ""))
    } else {
        Cow::Borrowed(input)
    }
}

fn main() {
    let a = remove_spaces("hello");       // Borrowed (新しい割り当てなし)
    let b = remove_spaces("hello world"); // Owned (新しい String)
    println!("{a} {b}");                  // hello helloworld

    let s: String = b.into_owned();       // 所有権が必要な場合は String に変換する
}
```

<pre><code class="tips">Cow&lt;str&gt; は &amp;str と同じように使える (Deref を実装している)。
文字列としての使い方は、「文字列」の Cow (Clone-on-Write) も参照。</code></pre>

---

## 型 <a id="type" data-name="型"></a>

Rust は静的型付き言語であり、コンパイル時に型が決まっている必要がある。

### use

`use` 宣言を使用すると、名前にアクセスするために完全なモジュールパスを入力する必要がなくなる。

#### ライブラリ

Rust には、利用可能な機能が3つの層に分かれている。

| 層 | 説明 |
| --- | --- |
| prelude | `use` せずに使える (`Vec`, `String`, `Option`, `Result`, `panic!` など) |
| 標準ライブラリ (std) | フルパスで書くか、`use` する必要がある (`std::io`, `std::collections::HashMap` など) |
| 外部ライブラリ (Crates) | `Cargo.toml` の `[dependencies]` に追加したうえで、フルパスで書くか `use` する必要がある (`rand`, `regex` など) |

標準ライブラリでよく使うものは <a href="#std">std</a> を参照。

### type

型エイリアス (type) を用いると型の名前があまりに長かったり、あまりに一般的だったりで改名したい場合に役立つ。<br>
命名は UpperCamelCase にするのが慣例 (従わないとコンパイラに警告される)。例外は基本型の名前 (usize, f32 など)。<br>
あくまでエイリアスであり新たな型を定義しているわけではないことに注意。

```rust
type Meters = u32;                                // 意味が分かる別名を付ける
type Callback = Box<dyn Fn(i32) -> i32>;          // 長い型に短い名前を付ける
type Result<T> = std::result::Result<T, MyError>; // エラー型を固定した Result (ライブラリでよく使う)
```

### 型キャスト

Rust は暗黙的に型変換を行うことはほとんどない (Deref による強制変換はある)。

#### as による明示的キャスト

プリミティブ型同士の変換に使う。

```rust
let decimal = 65.4321_f32;

// 明示的な型変換
let integer = decimal as u8;
let character = integer as char;

println!("Casting: {} -> {} -> {}", decimal, integer, character);
// Casting: 65.4321 -> 65 -> A
```

<pre><code class="caution">大きい型から小さい型へのキャストでは、上位ビットが切り捨てられる。
浮動小数点数から整数へのキャストでは、小数部が切り捨てられ、範囲外の値は最小値・最大値に丸められる (NaN は 0 になる)。</code></pre>

#### トレイトを使った安全な型変換

##### `From` と `Into`

確実に変換できる場合に実装する。<br>
`From` を実装すると `Into` も使えるようになる。

```rust
let my_str = "hello";
let my_string = String::from(my_str); // From を使用

let another_string: String = "world".into(); // Into を使用
```

##### `TryFrom` と `TryInto`

失敗する可能性がある場合に実装して、 `Result` を返す。

```rust
use std::convert::TryInto; // Rust 2021 エディション以降は prelude に含まれるため不要

let big_number: i32 = 300;
let small_number: Result<u8, _> = big_number.try_into();

if let Ok(value) = small_number {
    println!("変換成功: {}", value);
} else {
    println!("エラー: u8の範囲(0-255)を超えています");
}
```

##### `From` の実装

`From` を実装すると対になる `Into` はコンパイラが自動で実装してくれる。

```rust
struct Number {
    value: i32,
}

// i32 から Number への変換を定義
impl From<i32> for Number {
    fn from(item: i32) -> Self {
        Number { value: item }
    }
}

fn main() {
    // From を使った呼び出し
    let num = Number::from(30);

    // Into が自動的に実装されるためこう書ける
    let num2: Number = 50.into();

    println!("Value: {}", num.value);
}
```

##### `TryFrom` の実装

`TryFrom` を実装すると、対になる `TryInto` も自動で使えるようになる。

```rust
use std::convert::TryFrom; // Rust 2021 エディション以降は prelude に含まれるため不要

#[derive(Debug, PartialEq)]
struct EvenNumber(i32);

#[derive(Debug)]
enum Error {
    NotEven,
}

// i32 から EvenNumber への「失敗するかもしれない」変換
impl TryFrom<i32> for EvenNumber {
    type Error = Error; // 失敗した時の型を指定

    fn try_from(value: i32) -> Result<Self, Self::Error> {
        if value % 2 == 0 {
            Ok(EvenNumber(value))
        } else {
            Err(Error::NotEven)
        }
    }
}

fn main() {
    // 成功するケース
    let ok_num = EvenNumber::try_from(8);
    assert_eq!(ok_num.unwrap(), EvenNumber(8));

    // 失敗するケース
    let err_num = EvenNumber::try_from(5);
    println!("{:?}", err_num); // Err(NotEven)
}
```

#### `unsafe` を使った危険な変換

##### `std::mem::transmute`

ビット列をそのまま別型として解釈する。<br>
型のサイズが一致している必要がある。

```rust
use std::mem;

fn main() {
    let raw_bits: u32 = 0x3f800000; // 浮動小数点数 1.0 のビット表現

    // u32 と f32 はどちらも 4 バイトなので、ビット列をそのまま f32 として解釈できる
    let f: f32 = unsafe { mem::transmute(raw_bits) };
    println!("The value is: {:?}", f); // 1.0
}
```

<pre><code class="tips">この例は、安全な f32::from_bits(raw_bits) で書き換えられる。transmute は最後の手段として考える。</code></pre>

##### 生ポインタのキャスト

C 言語のようなメモリアドレスの型変換。<br>
中身を参照(デリファレンス)する際に `unsafe` が必要。

```rust
fn main() {
    let my_num: i32 = 42;

    // 参照を「生ポインタ」に変換 (これは安全)
    let ptr: *const i32 = &my_num as *const i32;

    // ポインタを別の型のポインタにキャスト (これも安全)
    let char_ptr: *const u8 = ptr as *const u8;

    unsafe {
        // ポインタを辿って値を読み出す (ここが unsafe)
        println!("最初のバイト: {}", *char_ptr);
    }
}
```

### 数値型

| 型 | 説明 |
| --- | --- |
| `i8` | 8ビット整数 |
| `i16` | 16ビット整数 |
| `i32` | 32ビット整数 |
| `i64` | 64ビット整数 |
| `i128` | 128ビット整数 |
| `isize` | ポインタと同じサイズの符号付整数<br>32ビット環境なら32ビット、64ビット環境なら64ビット |
| `u8` | 8ビット符号なし整数 |
| `u16` | 16ビット符号なし整数 |
| `u32` | 32ビット符号なし整数 |
| `u64` | 64ビット符号なし整数 |
| `u128` | 128ビット符号なし整数 |
| `usize` | ポインタと同じサイズの符号なし整数 (インデックスやサイズに使う)<br>32ビット環境なら32ビット、64ビット環境なら64ビット |
| `f32` | 32ビット浮動小数点数 |
| `f64` | 64ビット浮動小数点数 |

#### 整数リテラル

| 数値リテラル | 例 |
| --- | --- |
| 10進数 | `98_222` |
| 16進数 | `0xff` |
| 8進数 | `0o77` |
| 2進数 | `0b1111_0000` |
| バイト (u8 のみ) | `b'A'` |
| 型サフィックス | `42u8`, `1_000_i64`, `2.5_f32` |

型を指定しない場合、整数は `i32`、浮動小数点数は `f64` になる。

#### オーバーフロー

整数が型の範囲を超えると、デバッグビルドではパニックし、リリースビルドでは (既定では) 折り返される。意図を明示するには専用のメソッドを使う。

| メソッド | 動作 | `250u8` に 10 を足した結果 |
| --- | --- | --- |
| `wrapping_add` | 折り返す | `4` |
| `checked_add` | オーバーフローしたら `None` を返す | `None` |
| `saturating_add` | 最大値・最小値で止める | `255` |
| `overflowing_add` | 折り返した値とオーバーフローしたかを返す | `(4, true)` |

`sub` / `mul` など他の演算にも同じ接頭辞のメソッドがある。

### 文字型

| 型 | 説明 |
| --- | --- |
| `char` | `'a'`, `'α'`, `'∞'` などの Unicode のスカラー値 (それぞれ4バイト) |

### 真偽値

| 型 | 説明 |
| --- | --- |
| `bool` | `true` または `false` |

### 配列

配列は、同じ型の要素を固定長で格納するデータ構造。

#### 配列の定義

```rust
let a = [1, 2, 3, 4, 5];
```

#### 注釈をつけて定義

配列の型は角括弧の中に要素の型とセミコロン(;)と配列の要素数を書く。

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
```

#### 初期化

角括弧の中に初期値とセミコロン(;)と配列の要素数を書いて同じ値で初期化することもできる。

```rust
let a = [3; 5]; // 5つの要素をすべて3で初期化
```

#### 長さとアクセス

配列は固定長で、長さも型の一部 (`[i32; 3]` と `[i32; 5]` は別の型)。要素数を変えたい場合は `Vec` を使う。

```rust
let a = [10, 20, 30];

println!("{}", a.len()); // 3
println!("{}", a[1]);    // 20
// a[3];                 // 範囲外: インデックスが定数ならコンパイルエラー、変数なら実行時にパニック
```

### タプル

タプルは様々な型の複数の値を1つの複合型にまとめる手段であり、サイズの変更はできない。

#### 型注釈付きで生成する

```rust
let tup: (i32, f64, u8) = (500, 6.4, 1);
```

#### 分配

```rust
let tup = (500, 6.4, 1);

let (x, y, z) = tup;

println!("The value of y is: {y}"); // 6.4
```

タプル `tup` の中身を3つの変数 (x, y, z) に束縛している。これを分配 (デストラクチャリング) と呼ぶ。

#### インデックスアクセス

アクセスしたい値の番号をピリオド(.)に続けて書くことでもアクセスできる。

```rust
let x: (i32, f64, u8) = (500, 6.4, 1);

let five_hundred = x.0;
let six_point_four = x.1;
let one = x.2;
```

### ユニット型

値をひとつも持たないタプルはユニットという特別な名前を持ち、`()` と書き表され、空の値や空の戻り値を表現する。<br>
式が値を返さなければ暗黙的にユニット値を返す。

```rust
// 値を返さない場合、実際はこうなっている
fn main() -> () {}
```

---

## 定数 <a id="constant" data-name="定数"></a>

Rust には2種類の定数があり、いずれもグローバルスコープを含む任意のスコープで宣言が可能。<br>
またいずれも型を明示する必要がある。

### const

通常の定数はこちらを使う。<br>
`const` はコンパイル時に評価され、使用箇所に値がインライン展開される (メモリ上の固定アドレスを持たない)。実質的にリテラルと同等。<br>
常に不変で `mut` は付けられない。名前は `SCREAMING_SNAKE_CASE` にするのが慣例。

```rust
const MAX_POINTS: u32 = 100_000;
const SECONDS_PER_DAY: u32 = 60 * 60 * 24; // コンパイル時に計算できる式が書ける
```

### static

`static` はプログラムの実行中は必ず存在する一意の値で、参照 (`&`) を取ることができ、`'static` なライフタイムを持つ。<br>
`Mutex` や `Atomic*` などの内部可変性を使うか、`static mut` を `unsafe` で扱うことで変更できる (`static mut` は避けるのが望ましい)。

```rust
use std::sync::atomic::{AtomicU32, Ordering};

static GREETING: &str = "hello";
static COUNTER: AtomicU32 = AtomicU32::new(0);

COUNTER.fetch_add(1, Ordering::Relaxed); // static のまま値を変更できる
```

<pre><code class="caution">Rust 2024 エディションでは、static mut への参照を作ること自体が既定でエラーになる。
実行時に初期化したい値は、OnceLock や LazyLock を使う (std::sync を参照)。</code></pre>

---

## 文字列 <a id="string" data-name="文字列"></a>

Rust における文字列 (および文字) の表現は3種類ある。

| 型 | 説明 |
| --- | --- |
| `String` | サイズ変更可能な文字列バッファであり、ヒープ領域にデータの実体を持ち、UTF-8 でエンコードされている |
| `&str` | 文字列データへの参照で、データの開始ポインタと長さを持つ |
| `char` | 1つの文字そのもの。Unicode で常に4バイト |

### 基本操作

#### 生成

```rust
let mut s = String::new(); // 空の文字列

// 以下の例は等価
let data = "initial contents"; // リテラルは &str (不変参照)
let s = data.to_string(); // &strからStringを生成(ヒープに確保)

let s = String::from("initial contents"); // fromで生成
```

#### 文字列スライス

文字列スライスとは、String の一部への参照で、開始地点へのポインタと長さ(len)の情報を持つ。

```rust
let s = String::from("hello world");

let hello = &s[0..5];  // "hello"
let world = &s[6..11]; // "world"
```

#### 文字列の追加

```rust
s.push_str("bar");
```

#### +演算子で文字列の連結

```rust
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // s1はムーブされもう使用できない
```

`+` の左辺は `String` (所有権がムーブされる)、右辺は `&str`。`&String` は自動で `&str` に変換されるため、`&s2` と書ける。

#### format!マクロでの文字列の連結

```rust
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");
// format!は参照を使用するため所有権を奪わない
let s = format!("{s1}-{s2}-{s3}");
```

### 文字へのアクセス

`String` は内部的に `Vec<u8>` で UTF-8 のバイト列を保持している (`&str` はその一部への参照)。そのため、`s[0]` のような整数インデックスでのアクセスはできない。また、スライス `&s[a..b]` で文字の境界以外を指定するとパニックする。

文字列の部分に対して操作を行う場合は、文字に対して操作したいのかバイトに対して操作したいのかを明示する。

#### char に変換

```rust
for c in "Зд".chars() {
    println!("{c}");
}
```

#### インデックスでアクセス

```rust
let chars: Vec<char> = s.chars().collect();
println!("{}", chars[3]);
```

collect()すると、ひとつの要素が char 型(4バイト)となる。

#### byte に変換

```rust
// "Зд" は2文字だが、UTF-8 では4バイト (208, 151, 208, 180)
for b in "Зд".bytes() {
    println!("{b}");
}
```

### よく使うメソッド

| メソッド | 説明 |
| --- | --- |
| `len()` | バイト数 (文字数ではない。文字数は `chars().count()`) |
| `is_empty()` | 空かどうか |
| `contains("x")` / `starts_with("x")` / `ends_with("x")` | 部分文字列を含むか / 前方一致 / 後方一致 |
| `find("x")` | 最初に見つかったバイト位置を `Option<usize>` で返す |
| `replace("a", "b")` | 置換した新しい `String` を返す |
| `trim()` / `trim_start()` / `trim_end()` | 前後の空白を取り除いた `&str` を返す |
| `split(',')` / `split_whitespace()` / `lines()` | 区切って、要素を順に返すイテレータにする |
| `to_uppercase()` / `to_lowercase()` | 大文字 / 小文字にした新しい `String` を返す |
| `char_indices()` | `(バイト位置, char)` を順に返すイテレータ |
| `parse::<T>()` | 数値などに変換する (`Result` を返す) |
| `repeat(n)` | n 回繰り返した新しい `String` を返す |

```rust
let s = "  Hello, 世界  ";
let t = s.trim(); // "Hello, 世界"

println!("{}", t.len());           // 13 (バイト数: 世界 は1文字3バイト)
println!("{}", t.chars().count()); // 9 (文字数)
```

### 文字列の表現

#### バイト列として扱う

- バイトスライス<br>
    パーサーやネットワーク・ファイル処理で重要。UTF-8 の保証はない。
    ```rust
    let bytes: &[u8] = b"hello";
    ```
    UTF-8 エンコードされた文字列を、バイト列として扱う場合は、
    ```rust
    let bytes = "あいう".as_bytes();
    ```

- 可変バイト列<br>
    `String` の中身と同じ構造だが、UTF-8 の保証はない。
    ```rust
    let mut v: Vec<u8> = vec![104, 101, 108, 108, 111]; // "hello"
    ```

- バイト文字列リテラル<br>
    ASCII のみを表せるバイト列のリテラルで、型は `&[u8; N]` になる。
    ```rust
    let b = b"hello";
    ```

#### 生文字列

- エスケープなし文字列<br>
    `\n` や `\"` を解釈しない。
    ```rust
    let s = r"C:\Users\name";
    ```

- ダブルクォートを含めたい場合<br>
    `r#"..."#` で囲む。`"#` を含む場合は `#` の数を増やす (`r##"..."##`)。
    ```rust
    let s = r#"{"key": "value"}"#;
    ```

#### OS 依存文字列

OS のネイティブな文字列表現 (`OsStr` / `OsString`) で、UTF-8 とは限らない。ファイルパス (`Path`) や環境変数などで使われる。

```rust
use std::ffi::OsStr;
```

#### C 互換文字列

C 言語とやり取りするための NUL 終端文字列 (`CString` / `CStr`)。

```rust
use std::ffi::CString;
```

#### Cow (Clone-on-Write)

無駄なコピーを避けるための enum で、ライブラリ設計で重要になる。詳しくは <a href="#cow">スマートポインタの Cow</a> を参照。

```rust
enum Cow<'a, B: ?Sized> {
    Borrowed(&'a B),
    Owned(<B as ToOwned>::Owned),
}
```

必要になったら所有権を持つ。

```rust
use std::borrow::Cow;

let mut cow: Cow<str> = Cow::Borrowed("hello");
cow.to_mut().push_str(" world");
```

#### `Box<str>`

String は再アロケートを少なくするために、余分なキャパシティーを持っているので、`Box<str>`に変換することで、所有権を持ちながら余分なキャパシティーを削減する。大量データ向け。<br>
ただし不変なデータとなるので、文字列を変更する場合は String に戻す必要がある。

```rust
let mut s = String::from("hello");
s.push_str(" world");
// もうsを変更しない
let b = s.into_boxed_str();
```

複数の場所で共有する不変の文字列は、`Rc<str>` / `Arc<str>` にすると、`clone()` が参照カウントの増加だけで済む。

```rust
use std::rc::Rc;

let shared: Rc<str> = Rc::from("hello");
let another = Rc::clone(&shared); // 文字列自体はコピーされない
```

---

## 文字列のフォーマット <a id="string-formatting" data-name="文字列のフォーマット"></a>

### 出力・フォーマット

出力、フォーマット用に以下のようなマクロが提供されている。

| マクロ | 説明 |
| --- | --- |
| `format!` | フォーマットしたテキストを String にして返す |
| `write!` | すでにある場所にフォーマットしたテキストを書き込む |
| `writeln!` | `write!` と同様だが、改行が付け加えられる |
| `print!` | `format!` と同様だが、標準出力 (`io::stdout`) にそのテキストを出力する |
| `println!` | `print!` と同様だが、改行が付け加えられる |
| `eprint!` | `format!` と同様だが、標準エラー出力 (`io::stderr`) にそのテキストを出力する |
| `eprintln!` | `eprint!` と同様だが、改行が付け加えられる |
| `dbg!` | 所有権を奪ってデバッグ情報を出力し、所有権を返す |

#### format!

文字列をフォーマットしてヒープに確保して String として返す。

```rust
fn main() {
    let name = "Rust";
    let version = 1.75;
    let s = format!("Hello, {} {}!", name, version);

    println!("{}", s); // "Hello, Rust 1.75!"
}
```

#### write!

既にある場所 (`String` や I/O) に、文字列をフォーマットして書き込む。フォーマット指定子は、後述の「: によるフォーマット」を参照。<br>
書き込みに失敗する可能性があるため、戻り値は `Result` (文字列なら `fmt::Result`、I/O なら `io::Result<()>`)。<br>
書き込み先に応じて `use` する。

| 書き込み先 | use |
| --- | --- |
| 文字列 | `use std::fmt::Write` |
| 入出力 | `use std::io::Write` |

```rust
use std::io::{self, Write};

fn main() -> io::Result<()> {
    let mut stdout = io::stdout();

    // 標準出力に直接書き込む(println!に近いが、より低レイヤー)
    write!(&mut stdout, "Direct output to stdout\n")?;

    Ok(())
}
```

ループなどで毎回 String を生成するとアロケートに時間がかかる場合があるが、ひとつの String を使い回せば、処理速度が向上する可能性がある。<br>
また書き込み先がファイルでも String でもネットワークでも、同じマクロで扱える。

#### dbg!

標準エラー出力 (stderr) に、ファイル名、行番号、式そのものを出力する。<br>
Debug トレイトを実装している必要がある。<br>
所有権を奪ってそのまま返すので処理の流れを壊さない。ヒープの値は参照 (&) を渡すのが一般的。

```rust
// 1+2 の結果と 3+4 の結果がそれぞれ表示されつつ、合計は正しく計算される
let total = dbg!(1 + 2) + dbg!(3 + 4);
```

<pre><code class="tips">引数なしで dbg!() とだけ書くと、「ここを通過した」というマーカーになる。</code></pre>

#### 変数を引数に取る

Rust 1.58 以降では、周囲の変数をフォーマット文字列の中に直接書ける。

```rust
let number: f64 = 1.0;
println!("number is {number}");
```

書けるのは変数名だけ。`{p.x}` のようなフィールドアクセスや式は書けないので、`println!("{}", p.x)` のように引数で渡す。

#### {} による置き換え

`{}` には、`Display` を実装した値が展開される。

```rust
println!("{} days", 31);
```

#### 位置引数

`{}` の中に整数を指定することで、どの位置引数で置換されるかが決まる。

```rust
println!("{0}, this is {1}. {1}, this is {0}", "Alice", "Bob");
```

#### 名前で指定

名前での指定も可能。

```rust
println!("{subject} {verb} {object}",
    object="the lazy dog",
    subject="the quick brown fox",
    verb="jumps over");
```

#### : によるフォーマット

`:` (コロン) の後にフォーマット指定を書くと、異なるフォーマットにできる。

```rust
println!("Base 10:               {}",   69420); // 69420
println!("Base 2 (binary):       {:b}", 69420); // 10000111100101100
println!("Base 8 (octal):        {:o}", 69420); // 207454
println!("Base 16 (hexadecimal): {:x}", 69420); // 10f2c
```

<div class="subtitle2">右寄せ</div>

```rust
println!("{number:>5}", number=1); // 右寄せ5文字幅
```

<div class="subtitle2">0 埋め</div>

```rust
// 右寄せで0埋め
println!("{number:0>5}", number=1); // 00001
// 左寄せで0埋め
println!("{number:0<5}", number=1); // 10000
```

<div class="subtitle2">幅を引数で指定する</div>

```rust
// width$ のように $ を付けると、幅を引数で指定できる
println!("{number:0>width$}", number=1, width=5);
```

<div class="subtitle2">中央寄せ・埋める文字の指定</div>

```rust
println!("[{:^7}]", "ab");  // [  ab   ] 中央寄せ
println!("[{:*^9}]", "ab"); // [***ab****] * で埋めて中央寄せ
println!("[{:<5}]", "ab");  // [ab   ] 左寄せ
```

<div class="subtitle2">0 埋めの簡易形</div>

```rust
println!("{:05}", 42);  // 00042 (数値は 0 埋めを簡単に書ける)
println!("{:05}", -42); // -0042 (符号を含めて5桁)
```

<div class="subtitle2">小数点以下の桁数</div>

```rust
println!("{:.2}", 3.14159);  // 3.14
println!("{:8.3}", 3.14159); // "   3.142" (全体で8桁、小数点以下3桁)
```

<div class="subtitle2">進数のプレフィックス・符号・指数表記</div>

```rust
println!("{:#x}", 255);    // 0xff
println!("{:#010b}", 5);   // 0b00000101 (プレフィックスを含めて10桁)
println!("{:+}", 5);       // +5
println!("{:e}", 1234.5);  // 1.2345e3
```

<div class="subtitle2">デバッグ出力</div>

`Debug` を実装した型は `{:?}` で、`{:#?}` なら整形して出力できる (<a href="#macro">マクロ</a> の `fmt::Debug` を参照)。

```rust
println!("{:?}", "a\nb");     // "a\nb" (文字列は引用符付きで、エスケープされる)
println!("{:?}", vec![1, 2]); // [1, 2]
println!("{:?}", Some(3));    // Some(3)
```

<div class="subtitle2">波括弧そのものを出力する</div>

```rust
println!("{{}}"); // {}
```

---

## 構造体 <a id="struct" data-name="構造体"></a>

構造体は複数の値に名前を付けて(フィールド)保持するための型で、定義とインスタンスの生成を別々に行う。

インスタンスが可変になるかどうかは `mut` キーワードで決まり、インスタンス全体が可変となる。一部のフィールドのみを可変にすることはできない。

### 定義

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```

`#[derive(Debug)]` を付けると `{:?}` で内容を出力できる (<a href="#macro">マクロ</a> を参照)。

### 生成

```rust
fn main() {
    let mut user1 = User {
        active: true,
        username: String::from("some_username123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };
}
```

### アクセス

```rust
user1.email = String::from("anotheremail@example.com");
```

### フィールド初期化省略記法

仮引数とフィールド名が同じ場合はフィールド初期化省略ができる。

```rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,
        email,
        sign_in_count: 1,
    }
}
```

### 構造体更新記法

このように <span class="code-like">..user1</span> で、残りのフィールドを別のインスタンスから引き継げる。

```rust
let user2 = User {
    email: String::from("another@example.com"),
    ..user1
};
```

<pre><code class="tips">..user1 で String などヒープ上のフィールドを引き継ぐとムーブされるため、user1 は部分的にムーブされた状態になり、全体としては使えなくなる。
Copy 型のフィールドだけを引き継ぐ場合は、user1 を引き続き使える。</code></pre>

### タプル構造体

タプル構造体は、タプル全体に名前を付け、そのタプルを他のタプルとは異なる型にしたいが、各フィールドに名前を与えるのは冗長な場合などに有効。

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
// このblackとoriginは型が異なる
```

### ユニット様構造体

一切フィールドを持たない構造体も定義でき、ある型にトレイトを実装するが、型自体に保持させるデータがない場合に有用。

```rust
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
}
```

### メソッド

メソッドの呼び出し方や関連関数については、<a href="#function">関数 / メソッド</a> も参照。

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 { // インスタンスに関連づいているため &self と書く
        self.width * self.height
    }
}
```

---

## enum <a id="enum-tag" data-name="enum"></a>

IP アドレスのように、複数の種類 (IPv4 と IPv6) のうちのいずれか1つの値を持つものを表現するには、enum が適している。

### 宣言

```rust
enum IpAddrKind {
    V4,
    V6,
}
```

### 生成

```rust
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;
```

### enum にデータを持たせる

enum はバリアント (列挙子) に加えて直接データを持てる。

```rust
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

let home = IpAddr::V4(127, 0, 0, 1);

let loopback = IpAddr::V6(String::from("::1"));
```

enum のバリアントには、構造体のような名前付きフィールドや、タプル形式のデータも持たせられる。

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

### 値を持たない enum と整数

データを持たないバリアントだけの enum は、`as` で整数に変換できる。`==` で比較したい場合は `PartialEq` が必要。

```rust
#[derive(Debug, Clone, Copy, PartialEq)]
enum Color {
    Red = 1, // 値を明示できる (省略すると、直前の値 + 1。最初は 0)
    Green = 2,
    Blue = 4,
}

let n = Color::Green as i32;         // 2
let same = Color::Red == Color::Red; // true
```

### メソッド

enum は構造体と同様にメソッドを定義できる。

```rust
impl Message {
    fn call(&self) {
        // メソッド本体はここで定義
    }
}

let m = Message::Write(String::from("hello"));
m.call();
```

---

## Option と Result <a id="option-result" data-name="Option と Result"></a>

### Option

Option は、何らかの値を持つ、または何もない状態を表現する enum。<br>
prelude に含まれているため、明示的に Option:: と書かなくても Some と None を使える。

```rust
enum Option<T> {
    Some(T),
    None,
}
```

### Result

Result は、結果の値を持つ、または失敗して error を持つ状態を表現する enum。<br>
prelude に含まれているため、明示的に Result:: と書かなくても Ok と Err を使える。

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

### 中身を取り出す

| 手法 | Option | Result | 備考 |
| --- | --- | --- | --- |
| パターンマッチ | `match opt { Some(v) => ..., None => ... }` | `match res { Ok(v) => ..., Err(e) => ... }` | すべてのケースを網羅する最も安全な方法 |
| 簡易マッチ | `if let Some(v) = opt { ... }` | `if let Ok(v) = res { ... }` | 片方のケースだけ必要な場合 |
| デフォルト値 | `opt.unwrap_or(default)` | `res.unwrap_or(default)` | 失敗時に代わりの値を使う |
| 強制取り出し | `opt.unwrap()` | `res.unwrap()` | `None` / `Err` の場合はパニックする。テストやプロトタイプ以外は非推奨 |
| メッセージ付きの強制取り出し | `opt.expect("msg")` | `res.expect("msg")` | パニック時のメッセージを指定できる |
| デフォルト値 (遅延評価) | `opt.unwrap_or_else(\|\| compute())` | `res.unwrap_or_else(\|e\| handle(e))` | 値の生成にコストがかかるときに、必要な場合だけクロージャで作る (`Result` では `Err` の中身 `e` を受け取れる) |
| 型の `Default` 値 | `opt.unwrap_or_default()` | `res.unwrap_or_default()` | `0` や空文字列など、その型の既定値を使う |

### 値を包んだまま操作する

| 関数 | 例 | 説明 |
| --- | --- | --- |
| `map()` | `opt.map(\|x\| x * 2)` (`None` なら `None` のまま) | 中身が `Some` や `Ok` の時だけ関数を適用し、結果を箱に戻す |
| `and_then()` | `res.and_then(check_condition)` | 処理の結果がさらに `Option` や `Result` を返す場合に使う (ネストを防ぐ) |
| `map_err()` | `res.map_err(MyError::from)` | `Result` の `Err` の中身だけを変換する (`Ok` はそのまま) |
| `is_some_and()` / `is_ok_and()` | `opt.is_some_and(\|x\| x > 0)` | 中身が条件を満たすかを `bool` で返す (Rust 1.70 以降) |
| `as_ref()` / `as_mut()` | `opt.as_ref()` | `Option<T>` を `Option<&T>` (`Option<&mut T>`) にして、所有権を奪わずに中身を見る |
| `take()` | `opt.take()` | 中身を取り出して、元は `None` にする |

### ?演算子による伝播

| 場所 | 動作 |
| --- | --- |
| `Option` を返す関数内 | `None` だったら `return None;` |
| `Result` を返す関数内 | `Err` だったら `return Err(e);` (必要なら `From` で型変換される) |

`Option` を返す関数の中で `Result` に `?` は使えない (逆も同様)。`ok_or()` や `ok()` で型をそろえる (後述の「相互に変換」を参照)。

<pre><code class="tips">for entry in fs::read_dir(".")? {
    let entry = entry?; // ここで Result をはがす (Err なら return Err(e))
    println!("{:?}", entry.path());
}</code></pre>

### 相互に変換

#### Result から Option へ

<span class="code-like">ok()</span>: エラーの内容は破棄される。

```rust
let success: Result<i32, &str> = Ok(42);
let failure: Result<i32, &str> = Err("エラー発生");

assert_eq!(success.ok(), Some(42));
assert_eq!(failure.ok(), None); // 破棄される
```

#### Option から Result へ

None だった場合にはエラー (err) を指定する必要がある。

<span class="code-like">ok_or()</span>: エラー値を直接渡す。`&str` (リテラル) などの安価な値でよい。

```rust
let empty_num: Option<i32> = None;

let res: Result<i32, &str> = empty_num.ok_or("値が空です");

assert_eq!(res, Err("値が空です"));
```

<span class="code-like">ok_or_else()</span>: エラー値の生成にコストがかかる場合 (`String` の生成など) に、`None` のときだけクロージャで生成する。

```rust
let empty_num: Option<i32> = None;

// None のときだけ String が生成される (無駄なメモリ確保を防ぐ)
let res = empty_num.ok_or_else(|| format!("エラーが発生しました: {}", 404));

assert_eq!(res, Err("エラーが発生しました: 404".to_string()));
```

---

## collections <a id="collections" data-name="collections"></a>

Rust の標準コレクション。

| Rust | 用途 | C++ |
| --- | --- | --- |
| `Vec<T>` | 可変長配列 | `std::vector<T>` |
| `VecDeque<T>` | 両端キュー | `std::deque<T>` |
| `LinkedList<T>` | 双方向リスト | `std::list<T>` |
| `HashMap<K, V>` | ハッシュマップ | `std::unordered_map<K, V>` |
| `BTreeMap<K, V>` | 木構造マップ | `std::map<K, V>` |
| `HashSet<T>` | ハッシュ集合 | `std::unordered_set<T>` |
| `BTreeSet<T>` | 木構造集合 | `std::set<T>` |
| `BinaryHeap<T>` | 優先度付きキュー | `std::priority_queue<T>` |

迷ったらまず `Vec` と `HashMap` を使う。`LinkedList` はほとんどの場合 `Vec` や `VecDeque` で足りるため、出番は少ない。

---

### Vec

ベクタは同じ型の値を動的にかつメモリ上で隣り合った形で保持できるコレクション。

#### 生成

- 空のベクタを生成
    ```rust
    let mut v: Vec<i32> = Vec::new();
    ```
- 初期値を与える
    ```rust
    let v = vec![1, 2, 3]; // 要素の値から型が推論される
    ```
- 型推論
    ```rust
    let v: Vec<_> = (1..3).collect();
    ```
- ターボフィッシュ + 型推論
    ```rust
    fn process_data(data: Vec<i32>) {
        // データを受け取って何かする関数
    }
    fn main() {
        // 変数に入れれば推論できるが、行数が増える
        // let v: Vec<_> = (1..5).collect();
        // process_data(v);
        // メソッドチェーンでターボフィッシュを使えば1行で書ける
        process_data((1..5).collect::<Vec<_>>());
    }
    ```

ターボフィッシュ (`::<>`) の構文については <a href="#turbofish">ジェネリクス</a> を参照。

#### アクセス

- インデックスでアクセス
    ```rust
    let v = vec![1, 2, 3, 4, 5];
    let third: &i32 = &v[2]; // 範囲外アクセスはパニックとなる
    println!("The third element is {third}");
    ```
- get メソッドでアクセス
    ```rust
    let third: Option<&i32> = v.get(2); // Optionで返される
    match third {
        Some(third) => println!("The third element is {third}"),
        None => println!("There is no third element."),
    }
    ```

#### 値の追加

```rust
let mut v = Vec::new();

v.push(5);
v.push(6);
v.push(7);
```

#### 値の削除・更新

```rust
let mut v = vec![1, 2, 3, 4, 5];

let last = v.pop();        // Some(5) (末尾を取り出す。空なら None)
let second = v.remove(1);  // 2 (指定位置の要素を削除して返す。後ろの要素は前に詰まる)
v.insert(1, 10);           // [1, 10, 3, 4]
v[0] = 100;                // [100, 10, 3, 4] (インデックスで代入。範囲外はパニック)
v.retain(|&x| x > 3);      // [100, 10, 4] (条件を満たす要素だけ残す)
v.clear();                 // []
```

#### 走査

```rust
let mut v = vec![1, 2, 3];

for x in &v {
    println!("{x}");      // 借用して読む
}

for x in &mut v {
    *x *= 2;              // 可変借用して書き換える
}

for (i, x) in v.iter().enumerate() {
    println!("{i}: {x}"); // インデックス付き
}
```

#### よく使うメソッド

| メソッド | 説明 |
| --- | --- |
| `len()` / `is_empty()` | 要素数 / 空かどうか |
| `contains(&x)` | 要素を含むか |
| `first()` / `last()` | 先頭 / 末尾の要素 (`Option<&T>`) |
| `extend(iter)` | イテレータの要素をすべて追加する |
| `sort()` / `sort_by_key(f)` | 並べ替える (`f64` の並べ替えは「std::cmp」を参照) |
| `dedup()` | 連続する重複を取り除く (先に `sort()` しておく) |
| `windows(n)` / `chunks(n)` | 長さ n のスライスを、1つずつずらしながら / n 個ずつ区切って返す |
| `drain(range)` | 範囲の要素を取り除きながら取り出す |
| `Vec::with_capacity(n)` | n 要素分の容量を先に確保して作る (再アロケーションを減らせる) |

---

### HashMap

型 `HashMap<K, V>` は、K 型のキーと V 型の値の対応関係を、ハッシュ関数を使用して保持する。

#### 生成

```rust
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);
```

配列やイテレータからも作れる。

```rust
use std::collections::HashMap;

// 配列から作る
let scores = HashMap::from([("Blue", 10), ("Yellow", 50)]);

// イテレータから作る (キーと値のペアを collect する)
let teams = vec!["Blue", "Yellow"];
let points = vec![10, 50];
let scores: HashMap<_, _> = teams.into_iter().zip(points).collect();
```

#### アクセス

```rust
use std::collections::HashMap;

let scores = HashMap::from([("Blue", 10), ("Yellow", 50)]);

let blue = scores.get("Blue"); // Option<&i32>: Some(&10)
let red = scores.get("Red");   // None (キーがなければ None)

// 値がなければデフォルト値を使う
let n = scores.get("Red").copied().unwrap_or(0); // 0

// インデックスでもアクセスできるが、キーがなければパニックする
println!("{}", scores["Blue"]); // 10

println!("{}", scores.contains_key("Blue")); // true
println!("{}", scores.len());                // 2
```

<pre><code class="tips">Vec と同様に、存在しないかもしれない値には get() を使う。
キーの型が String でも、get("Blue") のように &str で検索できる。</code></pre>

#### 値の追加・更新

`insert()` は、キーがなければ追加し、あれば値を上書きする。上書きした場合は古い値が返る。

```rust
let mut scores = HashMap::new();

scores.insert("Blue", 10);               // None (新規追加)
let old = scores.insert("Blue", 25);     // Some(10) (上書きされ、古い値が返る)
```

#### entry

`entry()` を使うと、「キーがなければ追加、あれば何もしない (または更新する)」という処理を、キーの検索1回で書ける。

| メソッド | 説明 |
| --- | --- |
| `or_insert(v)` | キーがなければ `v` を挿入する。どちらの場合も、値への `&mut V` を返す |
| `or_insert_with(f)` | キーがなければ `f()` の結果を挿入する (値の生成コストが高い場合) |
| `or_default()` | キーがなければ `V::default()` を挿入する |
| `and_modify(f)` | キーがあれば `f` で値を更新する (`or_insert` と組み合わせる) |

```rust
let mut scores = HashMap::new();
scores.insert("Blue", 10);

scores.entry("Blue").or_insert(50);   // 既にあるので何もしない (10 のまま)
scores.entry("Yellow").or_insert(50); // なければ挿入する

// 値を更新する (or_insert が返す &mut V を使う)
let count = scores.entry("Red").or_insert(0);
*count += 1;

// 「あれば更新、なければ挿入」を1行で書く
scores.entry("Blue").and_modify(|v| *v += 10).or_insert(10); // Blue は 20
```

単語の出現回数を数える定番の書き方。

```rust
use std::collections::HashMap;

let text = "hello world hello";
let mut count: HashMap<&str, i32> = HashMap::new();

for word in text.split_whitespace() {
    *count.entry(word).or_insert(0) += 1;
}
// {"hello": 2, "world": 1} (順序は不定)
```

`or_default()` を使うと、値が `Vec` のグループ分けも簡潔に書ける。

```rust
use std::collections::HashMap;

let words = ["apple", "avocado", "banana", "blueberry", "cherry"];
let mut groups: HashMap<char, Vec<&str>> = HashMap::new();

for word in words {
    let initial = word.chars().next().unwrap();
    groups.entry(initial).or_default().push(word);
}
// {'a': ["apple", "avocado"], 'b': ["banana", "blueberry"], 'c': ["cherry"]}
```

#### 削除

`remove()` は、削除した値を `Option` で返す。キーがなければ `None` を返す。

```rust
let mut scores = HashMap::from([("Blue", 10), ("Yellow", 50)]);

let removed = scores.remove("Blue"); // Some(10)
let none = scores.remove("Red");     // None
```

#### 走査

```rust
let mut scores = HashMap::from([("Blue", 10), ("Yellow", 50)]);

// キーと値を借用して走査する
for (key, value) in &scores {
    println!("{key}: {value}");
}

// 値を書き換えながら走査する
for value in scores.values_mut() {
    *value += 1;
}

let keys: Vec<_> = scores.keys().collect();     // キーだけ
let values: Vec<_> = scores.values().collect(); // 値だけ
```

| 書き方 | 説明 |
| --- | --- |
| `for (k, v) in &map` | キーと値を借用する (`map` はその後も使える) |
| `for (k, v) in &mut map` | キーは借用、値は可変借用する |
| `for (k, v) in map` | キーと値をムーブする (`map` はその後使えない) |

<pre><code class="caution">HashMap の走査順は不定で、実行のたびに変わることがある。
順序が必要な場合は、BTreeMap を使うか、キーを collect して sort() してから走査する。</code></pre>

#### 所有権とキーの条件

`String` のように所有権を持つ値は、`insert()` でマップにムーブされる。

```rust
let key = String::from("Blue");
let mut map = HashMap::new();
map.insert(key, 10);
// println!("{key}"); // ❌ key は map にムーブされたため使えない
```

参照 (`&str` など) をキーや値にすることもできるが、その場合は参照先がマップより長く生きている必要がある。

キーの型は `Eq` と `Hash` を実装している必要がある。`f64` は `Eq` を実装しないため、そのままではキーにできない。自作の型は `#[derive(PartialEq, Eq, Hash)]` で実装できる。

---

### その他のコレクション

| 型 | 特徴 |
| --- | --- |
| `HashSet<T>` | 重複のない集合。`contains` が高速。`union` / `intersection` / `difference` で集合演算ができる |
| `BTreeMap<K, V>` | キーの順に並んだマップ。走査するとキー順になる。範囲検索 (`range`) もできる |
| `VecDeque<T>` | 両端への追加・削除が高速 (`push_back` / `pop_front` など)。キューとして使う |
| `BinaryHeap<T>` | 最大の要素を効率よく取り出せる。最小値を取り出したい場合は `Reverse` で包む |

```rust
use std::collections::{BTreeMap, HashSet, VecDeque};

let mut set = HashSet::new();
println!("{}", set.insert(1)); // true (新しく追加された)
println!("{}", set.insert(1)); // false (既にあるので追加されない)

let mut tree = BTreeMap::new();
tree.insert("b", 2);
tree.insert("a", 1);
for (k, v) in &tree {
    println!("{k}: {v}"); // a: 1 → b: 2 の順 (キー順)
}

let mut queue = VecDeque::new();
queue.push_back(1);
queue.push_back(2);
println!("{:?}", queue.pop_front()); // Some(1) (先に入れたものから出る)
```

---

## 所有権 <a id="ownership" data-name="所有権"></a>

Rust の所有権には3つのルールがある。

1. すべての値には、所有者となる変数がある
2. 所有者は同時に1つだけ
3. 所有者がスコープを抜けると、値は破棄される

`Copy` を実装していない型 (`String` や `Vec` など) は、他の変数への代入や関数の呼び出しによって所有権がムーブされる。

```rust
let s1 = String::from("hello");
let s2 = s1; // helloの所有権がムーブ
// println!("{s1}"); // error: ムーブ済みのため使えない
```

ムーブではなく複製したい場合は、`clone()` で明示的に複製する (<a href="#trait">トレイト</a> の Clone を参照)。

### 引数の渡し方

Rust は大別して3パターンの引数の渡し方がある。

- 値渡し (move)
    ```rust
    fn func(s: String) {
        // s の所有権はここ
    }
    ```
    所有権が関数側に移動して、呼び出し元ではこの変数はもう使えない。<br>
    `Copy` 型 (`i32`, `bool` など) は所有権が移動せず、コピーが渡される。
- 参照渡し (不変参照)
    ```rust
    fn func(s: &str) {
        // ReadOnly
    }
    ```
    所有権は移動せずに、変数の値は書き換えできないが、同時に複数渡せる。<br>
    文字列を読むだけの引数は、`&String` ではなく `&str` で受け取るのが慣例。`&String` を渡しても自動で `&str` に変換される。
- 可変参照渡し
    ```rust
    fn f(s: &mut String) {
        s.push_str("!");
    }
    ```
    所有権は移動せずに、変数の値を書き換えできるが、同時に渡せるのはひとつだけで、不変参照も同時にはできない。

### スライス

スライスにより、コレクション全体ではなく、連続した要素の一部を参照できる。<br>
スライスは参照の一種であり、所有権を持たない。

```rust
let s = String::from("hello world");

let hello = &s[0..5];  // スライス
let world = &s[6..11]; // スライス
```

- 2連ピリオド (`..`) の前に添え字を書かなければ、これらは等価。
    ```rust
    let slice = &s[0..2];
    let slice = &s[..2];
    ```

- 同様に末尾を書かなければ、これらは等価。
    ```rust
    let len = s.len();
    let slice = &s[3..len];
    let slice = &s[3..];
    ```

- 両方の添え字を省略すれば全体を表す。よって、これらは等価。
    ```rust
    let len = s.len();
    let slice = &s[0..len];
    let slice = &s[..];
    ```

配列や `Vec` もスライスにできる。型は `&[T]` になる。

```rust
let v = vec![1, 2, 3, 4, 5];
let part: &[i32] = &v[1..3]; // [2, 3]
```

<pre><code class="tips">文字列のスライスの型は &amp;str になる。
関数の引数は、&amp;Vec&lt;T&gt; ではなく &amp;[T] で受け取るのが慣例 (Vec も配列も渡せる)。</code></pre>

### 所有権を軸にしたメソッドの命名規則

#### `to_*`

借用して、新しい型を作って返す。

```rust
let s = "Hello";
let lower = s.to_lowercase();
```

- 引数: `&self` (借用)
- 戻り値: 新しい所有権

#### `into_*`

所有権をムーブして変換。

```rust
let s = String::from("Hello");
let bytes = s.into_bytes();
```

- 引数: `self` (ムーブ)
- 元の型は使えなくなる

#### `as_*`

参照で別の型として見るだけ。

```rust
let s = String::from("Hello");
let slice = s.as_str();
```

- 引数: `&self` (借用)
- 戻り値: `&self` の一部などの参照

#### `get_*`

安全に取り出す(失敗あり)。

```rust
let v = vec![1, 2, 3];
let x = v.get(1); // Some(&2)
```

- 戻り値: `Option<T>` や `Option<&T>`
- フィールドを返すだけの getter には `get_` を付けない (<a href="#naming">関数の命名</a> の「getter / setter」を参照)

#### `from`

別の型から生成する (`From` トレイトの `from()`)。

#### `push` / `insert`

内部を変更。

- 引数: `&mut self` (可変借用)

#### `is_*` / `try_*`

`is_*` は `bool` を返す (`is_empty()`, `is_some()` など)。<br>
`try_*` は失敗しうる操作で、`Result` を返す (`try_from()`, `try_borrow()` など)。

このほかの命名パターン (`new` / `with_*` / `build` / `take` / `_mut` / `_by` など) は <a href="#naming">関数の命名</a> にまとめている。

---

## 変数 <a id="variable" data-name="変数"></a>

### let

`let` で宣言した変数は不変となり、再代入できない。<br>
宣言と初期化を分けることもできるが、初期化は1度だけ行える。

```rust
let i: i32 = 15;
// i = 30 // error
```

### let mut

`let mut` で可変な変数となる。

```rust
let mut i: i32 = 15;
i = 30; // ok
```

### const

不変である点は `let` と同じだが、`const` はコンパイル時に値が決まっている必要があり、型注釈も必須。<br>
`let` はコンパイル時に値が決まっている必要がなく、1度代入したら変更できない。<br>
詳しくは <a href="#constant">定数</a> を参照。

### シャドーイング

シャドーイングとは、前に定義した変数と同じ名前で変数を宣言することで、前に宣言された変数は新しい変数に覆い隠され、そのスコープ内では参照できなくなる (値自体は、スコープを抜けるまで破棄されない)。

#### メリット

- `mut` を付けて可変にせずに、値を加工して束縛し直せる。
    ```rust
    let x = 5;
    let x = x + 1; // シャドーイング
    ```
- 変換の流れを同じ名前で表現できる。
    ```rust
    let input = read_line();
    let input = input.trim();
    let input = input.parse::<i32>()?;
    ```
- 文脈的に変数名を変える必要がない場合などに型を変えられる。
    ```rust
    let x = "123";
    let x = x.parse::<i32>().unwrap();
    ```
- スコープを抜けると自動で以前の意味に戻る。
    ```rust
    let x = 10;
    // 一時的な計算
    {
        let x = x + 5;
        println!("{}", x); // 15
    }
    println!("{}", x); // 10
    ```

### 型変換 (キャスト)

`as` で型を変換する (詳細は <a href="#type">型</a> の「型キャスト」を参照)。

```rust
let ch = 'A';
let code = ch as u32; // 65
```

---

## ジェネリクス <a id="generics" data-name="ジェネリクス"></a>

ジェネリクスは、型などを「パラメータ」として受け取ることで、同じコードを複数の型に使い回せるようにする仕組み。<br>
パラメータは山括弧 `<>` の中に書く。`<>` に入るのは主に次の3種類。

| 種類 | 宣言 | 使う側 |
| --- | --- | --- |
| 型 | `<T>` | `Vec<i32>` |
| ライフタイム | `<'a>` | `&'a str` |
| 定数 | `<const N: usize>` | `[T; N]` / `Buffer<i32, 3>` |

これに加えて、トレイト境界 (`T: Clone`) や関連型の指定 (`Iterator<Item = i32>`) も `<>` の周辺に現れる。

<pre><code class="tips">&lt;&gt; には「宣言」と「使用」の2つの場面がある。
宣言: struct Point&lt;T&gt; / fn identity&lt;T&gt; / impl&lt;T&gt; のように、パラメータを導入する。
使用: Point&lt;i32&gt; / Vec&lt;String&gt; のように、パラメータに具体的なものを当てはめる。</code></pre>

### 型パラメータ

最も基本的なパターン。`T` は型を表すプレースホルダー。

```rust
struct Point<T> {
    x: T,
    y: T,
}

let p1: Point<i32> = Point { x: 10, y: 20 };
let p2: Point<f64> = Point { x: 1.0, y: 2.0 };
```

`T` という名前に特別な意味はなく、`U` や `V` でもよい (慣習として大文字1文字がよく使われる)。

メソッドを定義する `impl` ブロックでも、パラメータを使うには `impl` の直後で宣言する必要がある。

```rust
impl<T> Point<T> {   // impl<T> が宣言、Point<T> が使用
    fn x(&self) -> &T {
        &self.x
    }
}
```

関数の場合は、関数名の直後に宣言する。

```rust
fn identity<T>(value: T) -> T {
    value
}
```

カンマ区切りで複数のパラメータを指定できる。

```rust
struct Pair<T, U> {
    first: T,
    second: U,
}
```

### ターボフィッシュ <a id="turbofish"></a>

関数やメソッドを呼び出すときに、型パラメータを明示する構文。<br>
型の位置では `Vec<i32>` と書けるが、式の中では `<` が比較演算子と区別できないため、`::<>` のように `::` を付けて書く必要がある。

```rust
let a = identity::<i32>(10);
let b = identity(10);                       // 推論できる場合は省略できる (T = i32)

let n = "42".parse::<i32>();                // 変換先の型を明示する
let v = (0..3).collect::<Vec<i32>>();       // collect の結果の型を明示する
```

`collect` や `parse` のように、戻り値の型だけが決まらない関数でよく使う。<br>
具体的な使い方は <a href="#collections">collections</a> の Vec の生成も参照。

### ライフタイムパラメータ

ライフタイムは `'a` のように、**シングルクォート付きの名前**で表す。参照が有効である期間の関係をコンパイラに伝えるためのもので、実行時に何かが渡されるわけではない。

```rust
struct Text<'a> {
    value: &'a str, // 文字列を所有せず、参照を保持する
}

fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

`longest` の `'a` は4か所に登場する。

| 箇所 | 意味 |
| --- | --- |
| `<'a>` | ライフタイムパラメータ `'a` を**宣言** |
| `x: &'a str` | 引数 `x` の参照に `'a` を**使用** |
| `y: &'a str` | 引数 `y` の参照に `'a` を**使用** |
| `-> &'a str` | 戻り値の参照にも `'a` を**使用** |

「戻り値の参照は、`x` と `y` の両方が有効な間だけ有効」という関係を表している。

#### 型と一緒に使う

```rust
struct Container<'a, T> {
    value: &'a T,
}

let number = 100;
let container: Container<'_, i32> = Container { value: &number };
```

`'_` は、ライフタイムをコンパイラの推論に任せる記法。<a href="#cow">`Cow<'_, str>`</a> のような戻り値の型でもよく見る。

<pre><code class="tips">引数が参照1つだけの関数など、関係が明らかな場合はライフタイムを省略できる (ライフタイム省略規則)。
fn first_word(s: &amp;str) -&gt; &amp;str  // fn first_word&lt;'a&gt;(s: &amp;'a str) -&gt; &amp;'a str と同じ意味</code></pre>

`'static` については <a href="#constant">定数</a> の static も参照。

### 定数ジェネリクス

型やライフタイムのほかに、**コンパイル時に決まる定数値**もパラメータにできる。配列の長さが代表的な用途。<br>
`const 名前: 型` の形で宣言し、`N` には整数型・`bool`・`char` が使える。

```rust
struct Buffer<T, const N: usize> {
    data: [T; N],
}

let a: Buffer<i32, 3> = Buffer { data: [10, 20, 30] };
let b: Buffer<i32, 5> = Buffer { data: [10, 20, 30, 40, 50] };
```

`Buffer<i32, 3>` と `Buffer<i32, 5>` は、長さが異なる別の型として扱われる。

### 宣言の順序

パラメータを宣言するときは、**ライフタイムを最初**に書く。型と定数はその後に、どちらが先でもよい (慣習としては型 → 定数の順で書くことが多い)。

```rust
struct Example<'a, T, const N: usize> {
    value: &'a [T; N],
}

// NG: 型パラメータをライフタイムより前に置くことはできない
// struct Example<T, 'a> { value: &'a T }
```

### トレイト境界

`<>` の中では、型パラメータの後ろに `:` でトレイト境界を指定できる。

```rust
use std::fmt::Display;

fn print_value<T: Display>(value: T) {
    println!("{value}");
}
```

シグネチャの各部分は次のように対応する。

```rust
fn print_value<T: Display>(value: T)
//             ^  ^
//             |  └─ トレイト境界
//             └──── 型パラメータ
```

`T` は型パラメータで、`Display` は `T` に課す制約であり、両者は別物。<br>
境界を複数指定するときは `T: Display + Debug` のように `+` でつなぐ。`where` 句での書き方も含め、詳しくは <a href="#trait">トレイト</a> のトレイト境界を参照。

<pre><code class="tips">&amp;dyn Display や Box&lt;dyn Display&gt; のような dyn Trait はジェネリクスではなく、トレイトオブジェクトという別の仕組み。
T: Display は型ごとにコードが生成される (静的ディスパッチ) のに対し、dyn は実行時に呼び出し先を決める (動的ディスパッチ)。</code></pre>

`Box<dyn Trait>` の使用例は <a href="#box">Box</a> を参照。

### 関連型の指定

トレイトが持つ関連型 (`type Item;` など) は、`<>` の中に `名前 = 型` の形で指定する。

```rust
fn process(iter: impl Iterator<Item = i32>) {
    for value in iter {
        println!("{value}");
    }
}
```

`Iterator<Item = i32>` は「要素の型が `i32` であるイテレータ」を表す。<br>
関連型の定義側については <a href="#trait">トレイト</a> のトレイトの定義も参照。

### `<>` を読み解く順番

コードの `<>` を見たら、次の順で中身を判別すると読みやすい。

1. `'a` のようなライフタイムか？
2. `T` や `i32` のような型か？
3. `const N: usize` のような定数か？
4. `T: Clone` のようなトレイト境界が付いているか？
5. `Item = i32` のような関連型の指定か？

あわせて、**宣言** (`fn foo<T>` / `impl<T>`) なのか**使用** (`Vec<i32>`) なのかも見分けると、どこで何が導入されているかが追いやすくなる。

---

## トレイト <a id="trait" data-name="トレイト"></a>

Rust における Trait は他の言語で言うところのインターフェースのようなもので、特定の型が共通して持つべき振る舞いを定義する。

### トレイトの定義

代表的な定義パターン。

- シグネチャのみ

    実装側は必ずこのメソッドを実装する必要がある。

    ```rust
    trait Greet {
        fn greet(&self) -> String;
    }
    ```

- デフォルト実装付きのパターン

    ```rust
    trait Greet {
        // 必須で実装してもらうメソッド
        fn name(&self) -> &str;

        // デフォルト実装 (name() を利用して自動的に動く)
        fn greet(&self) -> String {
            format!("こんにちは、{}さん！", self.name())
        }
    }
    ```

- 関連型 (type) を使うパターン

    Iterator のように取り出す要素の型が1つに決まる場合。

    ```rust
    trait Container {
        type Item; // 使う側が具体的な型 (i32 や String など) を指定する

        fn add(&mut self, item: Self::Item);
        fn get(&self) -> Option<&Self::Item>;
    }
    ```

- ジェネリクス `<T>` を使うパターン

    異なる型に対して同じトレイトを何パターンも実装できるようにしたい場合。

    ```rust
    // T という任意の型を受け取る能力
    trait Converter<T> {
        fn convert(&self) -> T;
    }
    ```

    1つの構造体に対して `Converter<String>` と `Converter<i32>` の両方を同時実装できる。

- スーパートレイト (依存関係) パターン

    このトレイトを実装するには、別のトレイトも実装していないとダメという場合。

    ```rust
    use std::fmt::Display;

    // Loggable を実装するには、先に Display を実装していないとエラーになる
    trait Loggable: Display {
        fn log(&self) {
            println!("[LOG]: {}", self); // Display があるから {} で出せると保証されている
        }
    }
    ```

### トレイトの実装

定義したトレイトを特定の構造体や enum に実装する。ここでは次のトレイトを例にする。

```rust
trait Greet {
    fn say_hello(&self) -> String; // 必須メソッド

    fn say_goodbye(&self) { // デフォルト実装
        println!("さようなら！");
    }
}
```

```rust
struct Person {
    name: String,
}

struct Robot;

// Person 型に Greet を実装
impl Greet for Person {
    fn say_hello(&self) -> String {
        format!("こんにちは、私は{}です。", self.name)
    }
}

// Robot 型に Greet を実装
impl Greet for Robot {
    fn say_hello(&self) -> String {
        String::from("ピポパ。私はロボットです。")
    }
}
```

### メソッドの呼び出し

```rust
fn main() {
    let p = Person { name: String::from("太郎") };
    let r = Robot;

    println!("{}", p.say_hello()); // こんにちは、私は太郎です。
    println!("{}", r.say_hello()); // ピポパ。私はロボットです。

    p.say_goodbye(); // デフォルト実装が呼ばれる：さようなら！
}
```

### トレイト境界

トレイト境界とは、ジェネリック型に対する制約のこと。<br>
トレイト境界を指定すると、ジェネリック型パラメータに特定の Trait が実装されていることを保証できる。

書き方は3パターンある。

- ジェネリクス + トレイト境界 (基本形)
    ```rust
    fn print<T: std::fmt::Display>(x: T) {
        println!("{}", x);
    }
    ```

- `impl Trait` (省略形)
    ```rust
    fn print(x: impl std::fmt::Display) {
        println!("{}", x);
    }
    ```

- where 句 (境界が増えた時に使う)
    ```rust
    fn print<T>(x: T)
    where
        T: std::fmt::Display,
    {
        println!("{}", x);
    }
    ```

境界を複数指定する場合は `+` でつなぐ (`T: Display + Debug`)。<br>
`<>` の中身全般 (型・ライフタイム・定数) については <a href="#generics">ジェネリクス</a> を参照。

### 様々なトレイト

#### Debug

開発者向けの表示で通常 `#[derive(Debug)]` で実装する。

```rust
#[derive(Debug)]
struct User {
    name: String,
    age: u32,
}

println!("{:?}", user);
```

#### Display

人間向けの表示。

```rust
impl std::fmt::Display for User {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "User: {}", self.name)
    }
}
```

`fmt` の中では `format!` で `String` を作らず、`write!` で直接 `Formatter` に書き込む (余計なアロケーションを避けられる)。

#### Clone

値を明示的に複製する。

```rust
trait Clone {
    fn clone(&self) -> Self;
}
```

Rust ではコピー (`Copy`) と複製 (`Clone`) が区別されるため、複製は明示的に `clone()` を呼ぶ必要がある。

```rust
let a = String::from("hello");
let b = a.clone();
```

#### Copy

ビット単位でコピーできる型に付けるマーカートレイトで、代入や関数呼び出しで所有権がムーブされず、コピーされる (`Clone` も必要)。

```rust
#[derive(Copy, Clone)]
struct Point {
    x: i32,
    y: i32,
}
```

Copy になれる型には厳格なルールがある。

- i32, u64, bool, char などのプリミティブ型
- 不変な参照 &T (共有参照はいくつあっても安全)
- 関数のポインタ
- すべての要素が Copy である構造体、タプル、列挙型

ただし、`String` や `Vec` のようにヒープを所有する型は `Copy` になれない。

#### Default

デフォルト値を作る。

```rust
#[derive(Default)]
struct Config {
    port: u16,
    debug: bool,
}

let config = Config::default();
```

数値や `bool` などのプリミティブ型は、デフォルト値が決まっている (数値は `0`、`bool` は `false` など)。

独自に定義する場合。

```rust
struct Config {
    port: u16,
    debug: bool,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            port: 8080,   // 独自のデフォルト値
            debug: false, // 通常通り false
        }
    }
}
```

#### Iterator / IntoIterator

for 文やイテレータアダプタの土台となる、Rust で重要なトレイト。

`Iterator` は次の要素を取り出せる。

`IntoIterator` はイテレータに変換できる (`into_iter()` を呼べる)。

```rust
// 範囲オブジェクトはすでにIterator
let mut iter = 1..=3;

assert_eq!(iter.next(), Some(1));
assert_eq!(iter.next(), Some(2));
assert_eq!(iter.next(), Some(3));
assert_eq!(iter.next(), None); // 空っぽ
```

`Iterator` は自動的に `IntoIterator` を実装する。

```rust
let v = vec![1, 2, 3]; // v自体はIntoIteratorを実装している

// forループに渡すと裏で自動的に v.into_iter() が呼ばれる
for x in v {
    println!("{}", x);
}
```

#### FromIterator

`FromIterator` を実装している型は、`collect()` で作れるようになる。

```rust
let v: Vec<_> = iterator.collect();
```

#### Extend

既存のコレクションにイテレータの要素を追加する。

```rust
collection.extend(iterator);
```

#### Deref

`AsRef` が `.as_ref()` による手動変換なら、`Deref` は `*x` または自動変換。

通常、参照の前に `*` (アスタリスク) を付けると、その参照の実体にアクセスできる (参照外し) が、<br>
自作の構造体に `Deref` を実装すると、`*my_struct` と書いたときに、構造体そのものではなく、<br>
内部にある別のデータにアクセスできるようになる。

```rust
use std::ops::Deref;

struct BoxedString {
    inner: String,
}

// BoxedString を参照外しした時、内部の String (さらにその先の str) を指すようにする
impl Deref for BoxedString {
    type Target = str; // 変換先の型を指定

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}
```

明示的に `*` を書かなくても、Deref 型強制 (deref coercion) により自動的に変換してくれる。

```rust
fn print_msg(msg: &str) { // 引数は &str を要求している
    println!("{}", msg);
}

fn main() {
    let s = String::from("hello");

    // &String を渡しているが、String は Deref<Target = str> を実装しているため
    // コンパイラが自動的に &s から &s[..] (&str) へと型を強制 (変換) してくれる
    print_msg(&s);
}
```

混乱を招くため、`Deref` はスマートポインタに対してのみ実装するのが原則。

#### DerefMut

Deref の可変参照版。

#### Drop

値がスコープから消えて破棄されるときに呼ばれる。

```rust
impl Drop for MyType {
    fn drop(&mut self) {
        println!("destroy");
    }
}
```

`drop()` メソッドを直接呼ぶことはできない。早く破棄したい場合は `drop(x)` 関数 (prelude に含まれる) に渡す。<br>
変数は、宣言した順と逆の順で破棄される。

#### Future

非同期関数が返すものを表す。

```rust
Future<Output = T>
```

#### From / Into

From はある型から別の型をつくる。

```rust
impl From<String> for MyType {
    fn from(value: String) -> Self {
        // ...
    }
}

let x = MyType::from(string);
```

`Into` は `From` を逆方向から見たトレイトで、`From` を実装すると `Into` も自動で実装される。

```rust
let x: MyType = string.into();
```

#### ToString / FromStr

`Display` を実装した型は、自動で `to_string()` が使える (`ToString` が自動で実装される)。<br>
逆に、`FromStr` を実装すると、`parse()` で文字列からその型を作れる。

```rust
use std::str::FromStr;

struct Point {
    x: i32,
    y: i32,
}

impl FromStr for Point {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let (x, y) = s.split_once(',').ok_or("カンマがありません")?;
        Ok(Point {
            x: x.trim().parse().map_err(|_| "x が数値ではありません")?,
            y: y.trim().parse().map_err(|_| "y が数値ではありません")?,
        })
    }
}

let p: Point = "3, 4".parse().unwrap(); // x = 3, y = 4
```

#### Error

`Error` トレイトは、「この型はエラーを表すオブジェクトである」ということをコンパイラや他のライブラリに伝えるための標準インターフェース。

`Error` トレイトを実装するには `Debug` と `Display` を実装する必要がある。<br>
`Error` トレイトの中身はデフォルト実装が用意されているため、`impl` するだけで実装できる。

```rust
use std::fmt;
use std::error::Error;

#[derive(Debug)] // Debugを導出
enum MyError {
    NetworkFailed,
    InvalidInput(String),
}

// Displayを実装 (ユーザー向けメッセージ)
impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MyError::NetworkFailed => write!(f, "ネットワーク接続に失敗しました"),
            MyError::InvalidInput(msg) => write!(f, "不正な入力です: {}", msg),
        }
    }
}

impl Error for MyError {
    // 中身は空っぽでOK (標準の挙動が自動で適用される)
}
```

#### AsRef / AsMut

`AsRef<U>` を実装している型であれば、&U (U の参照) として扱うことができるという意味。

```rust
fn foo<T: AsRef<str>>(value: T) {
    println!("{}", value.as_ref());
}
```

```rust
// どちらでも呼べる
foo("hello");
foo(String::from("hello"));
```

`AsMut<T>` は `AsRef<T>` の可変参照版。

#### Borrow

コレクションやジェネリック API などで、「この型は別の型を借用する形で扱えます」という関係を表す。

```rust
Borrow<T>
```

例えば `HashMap<String, V>` を `&str` で検索できる (`get("key")`) のは、`String` が `Borrow<str>` を実装しているため。

#### Hash

ハッシュ値を生成できることを表す。

例えば HashMap のキーには Hash が必要。

```rust
#[derive(Hash)]
struct User {
    id: u32,
}
```

#### Sized

コンパイル時にサイズが分かっている型で、普通の型は基本的に `Sized`。一方、

```rust
str
[T]
dyn Trait
```

などはサイズがコンパイル時に決まらない (動的サイズ型)。そのため `&str` や `Box<dyn Trait>` のように、参照やポインタ経由で扱う。

#### Send / Sync

`Send` は値を別スレッドに送れることを表す。

`Sync` はある型への参照を複数スレッドから共有できることを表す。

例えば `Rc<T>` は `Send` でも `Sync` でもないため、スレッド間で共有する場合は `Arc<T>` を使う。

#### Fn / FnMut / FnOnce

`Fn` は不変借用だけで何度でも呼べるクロージャ (関数)。

`FnMut` は内部で状態を変更するため、可変借用が必要なクロージャ (関数)。何度でも呼べる。

`FnOnce` は所有権を消費するため、1度だけ呼べるクロージャ (関数)。

#### PartialEq / Eq

`PartialEq` は `==` と `!=` を使えるようにする。

```rust
#[derive(PartialEq)]
struct User {
    id: u32,
}
```

`Eq` は `PartialEq` よりも厳格な、完全な同値関係。

```rust
#[derive(PartialEq, Eq)]
struct User {
    id: u32,
}
```

`f32` / `f64` は `NaN != NaN` のため `PartialEq` のみで、`Eq` は実装できない。

#### PartialOrd / Ord

`PartialOrd` は大小の比較 (`<` や `>` など) を可能にする。

`Ord` は全順序 (どの2つの値も必ず比較できる)。

`sort()` には `Ord` が必要で、`f64` のように `NaN` を含む型は `PartialOrd` のみを実装する。

#### Add / Sub / Mul / Div / Rem / Neg / Not / BitAnd

演算子をオーバーロードするためのトレイト。

```text
a + b // Add
a - b // Sub
a * b // Mul
a / b // Div
a % b // Rem
-a // Neg
!a // Not
a & b // BitAnd
```

`BitOr`、`BitXor`、`Shl`、`Shr` なども同様に用意されている。

---

## 非同期 (async/await) <a id="async" data-name="非同期"></a>

`async fn` は、呼び出しただけでは実行されず、`Future` を返す。`.await` すると、その `Future` が完了するまで待つ。待っている間、スレッドは他のタスクの実行に使われる。<br>
標準ライブラリには非同期ランタイムが含まれないため、`tokio` などの外部クレートを使う (`cargo add tokio --features full`)。<br>
`Future` と `Pin` の仕組みは、<a href="#pin">Pin</a> と <a href="#trait">トレイト</a> の Future を参照。

```rust
use std::time::Duration;

#[tokio::main]
async fn main() {
    let value = fetch().await;
    println!("{value}");
}

async fn fetch() -> u32 {
    tokio::time::sleep(Duration::from_millis(100)).await; // 待つ間、他のタスクに実行を譲る
    42
}
```

### 主な道具

| 道具 | 説明 |
| --- | --- |
| `.await` | その `Future` の完了を待つ。同じタスクの中では、次の行には進まない |
| `tokio::spawn(fut)` | `Future` を新しいタスクとしてランタイムに登録する。並行に実行され (マルチスレッドランタイムなら並列にも)、`JoinHandle` を返す |
| `tokio::join!(a, b)` | 同じタスクの中で複数の `Future` を並行に進め、すべての完了を待つ |
| `tokio::select!` | 最初に完了した `Future` の結果を採用し、残りは破棄する |
| `tokio::time::timeout(d, fut)` | 時間制限を付ける。超過すると `Err` になる |

### 逐次実行と並行実行

`.await` を並べると、1つ終わってから次が始まる (逐次実行)。並行に進めたい場合は `join!` か `spawn` を使う。

```rust
// 逐次: 合計で約 200ms (各 100ms の場合)
let a = task_a().await;
let b = task_b().await;

// 並行: 約 100ms
let (a, b) = tokio::join!(task_a(), task_b());
```

`spawn` したタスクは、`'static` かつ `Send` である必要がある。所有権を `move` で渡し、結果は `JoinHandle` を `.await` して受け取る。

```rust
let handle = tokio::spawn(async move {
    42 // 別タスクで実行される
});
let value = handle.await.unwrap(); // タスクがパニックした場合は Err (JoinError)
```

<pre><code class="caution">spawn するタスクの中で、.await をまたいで Rc や std::sync::MutexGuard を保持すると、Send ではないためコンパイルエラーになる。</code></pre>

### ブロッキングに注意

`async` の中で `std::thread::sleep` や重い計算、同期的なファイル I/O を行うと、そのスレッドごと止まり、同じスレッドで動く他のタスクも進めなくなる。

```rust
async fn bad() {
    std::thread::sleep(Duration::from_secs(1)); // ❌ スレッドをブロックする
}

async fn good() {
    tokio::time::sleep(Duration::from_secs(1)).await; // ✅ タスクを中断して実行を譲る
}

// 避けられない重い処理は、専用のスレッドに逃がす
let result = tokio::task::spawn_blocking(|| heavy_computation()).await.unwrap();
```

<pre><code class="tips">#[tokio::main] は既定でマルチスレッドランタイムを使う。
シングルスレッドで動かしたい場合は #[tokio::main(flavor = "current_thread")] を指定する。
非同期用の Mutex / mpsc は tokio::sync にあり、std のものとは別。</code></pre>

---

## std <a id="std" data-name="std"></a>

標準ライブラリでよく使うもの。<br>
prelude に含まれないものは、`use` するか、フルパスで書く必要がある。

<pre><code class="tips">std は core (OS に依存しない基本機能) と alloc (ヒープを使う型) を再公開している。
組み込み開発などでは #![no_std] を指定して、core と alloc だけを使う。</code></pre>

### 主なモジュール

| モジュール | 用途 | 代表的な型・関数 |
| --- | --- | --- |
| `std::fs` | ファイルの読み書き、ディレクトリ操作 | `read_to_string`, `write`, `create_dir_all`, `read_dir`, `remove_file` |
| `std::path` | パスの操作 | `Path`, `PathBuf` |
| `std::io` | 入出力 | `stdin`, `stdout`, `Read`, `Write`, `BufRead`, `BufReader` |
| `std::env` | コマンドライン引数・環境変数 | `args`, `var`, `current_dir` |
| `std::process` | 外部コマンドの実行、プロセスの終了 | `Command`, `ExitCode`, `exit` |
| `std::time` | 時間の計測・表現 | `Instant`, `Duration`, `SystemTime` |
| `std::thread` | スレッド | `spawn`, `sleep`, `scope`, `JoinHandle` |
| `std::sync` | スレッド間の同期・通信 | `Arc`, `Mutex`, `RwLock`, `mpsc`, `atomic` |
| `std::mem` | メモリ上の値の入れ替え・取り出し | `swap`, `replace`, `take` |
| `std::cmp` | 比較 | `min`, `max`, `Ordering`, `Reverse` |
| `std::iter` | イテレータを作る関数 | `repeat`, `successors`, `from_fn` |
| `std::collections` | コレクション | <a href="#collections">collections</a> を参照 |
| `std::rc` / `std::cell` | 参照カウント、内部可変性 | <a href="#smart-pointer">スマートポインタ</a> を参照 |
| `std::fmt` | フォーマットの実装 | `Display`, `Debug`, `Formatter` (<a href="#string-formatting">文字列のフォーマット</a> を参照) |
| `std::error` | エラー型の共通インターフェース | `Error` (<a href="#trait">トレイト</a> を参照) |

### std::fs

ファイル・ディレクトリを操作する。ほとんどの関数が `io::Result` を返す。

| 関数 | 説明 |
| --- | --- |
| `fs::read_to_string(path)` | ファイル全体を `String` として読む (UTF-8 である必要がある) |
| `fs::read(path)` | ファイル全体を `Vec<u8>` として読む |
| `fs::write(path, contents)` | ファイルに書き込む (なければ作成、あれば上書き) |
| `fs::create_dir_all(path)` | ディレクトリを親ごと作成する (既にあってもエラーにならない) |
| `fs::read_dir(path)` | ディレクトリ内のエントリを列挙する |
| `fs::copy(from, to)` / `fs::rename(from, to)` | コピー / 移動 (名前変更) |
| `fs::remove_file(path)` / `fs::remove_dir_all(path)` | ファイル / ディレクトリを中身ごと削除する |
| `fs::metadata(path)` | サイズや種別などのメタデータを取得する |

```rust
use std::fs;
use std::io;

fn main() -> io::Result<()> {
    fs::create_dir_all("out")?;                      // ディレクトリを作成
    fs::write("out/hello.txt", "こんにちは\n")?;     // 書き込み (既存なら上書き)

    let text = fs::read_to_string("out/hello.txt")?; // 全体を読み込む
    print!("{text}");

    for entry in fs::read_dir("out")? {
        let entry = entry?; // 各エントリも Result
        println!("{}", entry.path().display());
    }

    fs::remove_file("out/hello.txt")?;
    Ok(())
}
```

`fs::write` は既存のファイルを上書きする。追記したい場合は `OpenOptions` を使う。

```rust
use std::fs::OpenOptions;
use std::io::Write;

let mut file = OpenOptions::new()
    .create(true) // なければ作成
    .append(true) // 末尾に追記
    .open("log.txt")?;
writeln!(file, "追記する行")?;
```

大きなファイルの読み方の使い分けは、後述の「補足: ファイル読み込み手法の使い分け」を参照。

### std::path

`PathBuf` は所有するパス (`String` に相当)、`Path` は借用するパス (`&str` に相当) で、関係は `String` と `&str` と同じ。

| メソッド | 説明 |
| --- | --- |
| `Path::new("a/b.txt")` | `&str` などから `&Path` を作る (所有権は持たない) |
| `PathBuf::from("a/b.txt")` | 所有する `PathBuf` を作る |
| `join(p)` | パスを連結した新しい `PathBuf` を返す |
| `push(p)` | `PathBuf` に連結する (自身を変更する) |
| `file_name()` | 末尾の名前を返す (`Option<&OsStr>`) |
| `file_stem()` / `extension()` | 拡張子を除いた名前 / 拡張子 |
| `parent()` | 親ディレクトリを返す (`Option<&Path>`) |
| `exists()` / `is_file()` / `is_dir()` | 存在するか / ファイルか / ディレクトリか |
| `display()` | 表示用のラッパーを返す |

```rust
use std::path::{Path, PathBuf};

let mut dir = PathBuf::from("data");
dir.push("sub");                       // data/sub
let file = dir.join("archive.tar.gz"); // data/sub/archive.tar.gz

println!("{:?}", file.file_name());    // Some("archive.tar.gz")
println!("{:?}", file.file_stem());    // Some("archive.tar")
println!("{:?}", file.extension());    // Some("gz")
println!("{:?}", file.parent());       // Some("data/sub")
println!("{}", file.display());        // Path は Display を実装しないため display() を使う

let config = Path::new("config.toml"); // &str から &Path を作る
println!("{}", config.exists());
```

<pre><code class="caution">join に絶対パスを渡すと、元のパスは破棄されて置き換わる。
例: Path::new("data").join("/etc") は /etc になる。</code></pre>

### std::io

| 型・トレイト | 説明 |
| --- | --- |
| `Read` | バイト列を読む (`read`, `read_to_string`, `read_to_end`) |
| `Write` | バイト列を書く (`write`, `write_all`, `flush`) |
| `BufRead` | バッファ付きで行単位などに読む (`read_line`, `lines`) |
| `io::Result<T>` | `Result<T, io::Error>` の別名 |

標準入力から1行読む。

```rust
use std::io;

fn main() -> io::Result<()> {
    let mut input = String::new();
    io::stdin().read_line(&mut input)?; // 末尾の改行も含まれる

    let n: i32 = input.trim().parse().expect("数値を入力してください");
    println!("{}", n * 2);
    Ok(())
}
```

すべての行を順に処理する場合は `lines()` を使う。

```rust
use std::io;

fn main() -> io::Result<()> {
    for line in io::stdin().lines() {
        let line = line?;
        println!("{line}");
    }
    Ok(())
}
```

`print!` は改行が来るまで出力されない (行バッファ) ため、改行なしのプロンプトを出す場合は `flush()` が必要。

```rust
use std::io::{self, Write};

print!("名前: ");
io::stdout().flush()?;
```

エラーの種類は `kind()` で判定できる。

```rust
use std::fs;
use std::io::ErrorKind;

match fs::read_to_string("config.txt") {
    Ok(text) => println!("{text}"),
    Err(e) if e.kind() == ErrorKind::NotFound => println!("ファイルがありません"),
    Err(e) => println!("読み込みに失敗: {e}"),
}
```

### std::env

| 関数 | 説明 |
| --- | --- |
| `env::args()` | コマンドライン引数のイテレータ (最初の要素は実行ファイル自身) |
| `env::var(key)` | 環境変数を取得する (未設定または Unicode でない場合は `Err`) |
| `env::vars()` | すべての環境変数のイテレータ |
| `env::current_dir()` | カレントディレクトリ |
| `env::current_exe()` | 実行中のファイルのパス |

```rust
use std::env;

fn main() {
    // コマンドライン引数 (args[0] は実行ファイル自身)
    let args: Vec<String> = env::args().collect();

    // 環境変数 (未設定なら Err)
    let home = env::var("HOME").unwrap_or_else(|_| String::from("(未設定)"));
    println!("{args:?} {home}");

    let cwd = env::current_dir().unwrap();
    println!("{}", cwd.display());
}
```

<pre><code class="tips">env::args() は、引数が Unicode でないとパニックする。その場合は env::args_os() を使う。
引数が複雑になる場合は、外部クレートの clap を使う (CLIでよく使うエコシステムを参照)。</code></pre>

### std::process

`Command` で外部コマンドを実行する。

| メソッド | 説明 |
| --- | --- |
| `output()` | 終了を待ち、標準出力・標準エラー・終了ステータスをまとめて取得する |
| `status()` | 終了を待ち、終了ステータスだけを取得する (出力は親プロセスの端末にそのまま出る) |
| `spawn()` | 起動だけして `Child` を返す (待たずに他の処理ができる) |

```rust
use std::process::Command;

fn main() -> std::io::Result<()> {
    let output = Command::new("echo").arg("hello").output()?;
    println!("status: {}", output.status);
    print!("{}", String::from_utf8_lossy(&output.stdout));

    let status = Command::new("ls").args(["-l", "-a"]).status()?;
    if !status.success() {
        eprintln!("ls が失敗しました");
    }
    Ok(())
}
```

<pre><code class="caution">Command::new はシェルを介さない。パイプ (|) やワイルドカード (*) は展開されない。
process::exit(code) は即座にプロセスを終了し、デストラクタが実行されない。終了コードを制御したい場合は main から ExitCode を返す。</code></pre>

### std::time

| 型 | 説明 |
| --- | --- |
| `Instant` | 経過時間の計測用。単調に増加し、システム時刻の変更の影響を受けない |
| `SystemTime` | 現在の日時 (壁時計)。`UNIX_EPOCH` からの経過時間などを取得できる |
| `Duration` | 時間の長さ。`Duration::from_secs(1)`、`Duration::from_millis(500)` など |

```rust
use std::thread;
use std::time::{Duration, Instant};

let start = Instant::now();
thread::sleep(Duration::from_millis(100)); // 計測したい処理の代わり
println!("{:?} かかった", start.elapsed()); // 例: 100.3ms
```

```rust
use std::time::{SystemTime, UNIX_EPOCH};

let secs = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
```

<pre><code class="tips">日付・タイムゾーンの扱いは標準ライブラリにない。chrono や time などの外部クレートを使う。
経過時間の計測には、SystemTime ではなく Instant を使う。</code></pre>

### std::thread

`thread::spawn` でスレッドを起動し、`join()` で終了を待つ。スレッドの戻り値は `join()` で受け取れる。

```rust
use std::thread;

let handle = thread::spawn(|| {
    println!("別スレッド");
    42
});
let result = handle.join().unwrap(); // 42 (スレッドの終了を待つ)
```

`thread::scope` を使うと、スコープ内のスレッドがスコープ終了時に自動で `join` されるため、ローカル変数を借用できる (`spawn` は `'static` を要求するため、通常は `move` が必要)。

```rust
use std::thread;

let v = vec![1, 2, 3];
thread::scope(|s| {
    s.spawn(|| println!("{:?}", v));   // ローカル変数 v を借用できる
    s.spawn(|| println!("{}", v.len()));
});
```

共有データを可変にするには `Arc<Mutex<T>>` を使う (<a href="#mutex">Mutex&lt;T&gt;</a> を参照)。

#### チャネル (mpsc)

`mpsc` は複数の送信側 (multiple producer) と1つの受信側 (single consumer) を持つチャネルで、スレッド間でメッセージを送る。

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    for id in 0..3 {
        let tx = tx.clone(); // 送信側は clone して各スレッドに渡す
        thread::spawn(move || {
            tx.send(format!("worker {id}")).unwrap();
        });
    }
    drop(tx); // 元の送信側を閉じる (忘れると受信側のループが終わらない)

    for msg in rx { // すべての送信側が drop されるとループが終わる
        println!("{msg}");
    }
}
```

### std::sync

`Arc` / `Mutex` / `mpsc` 以外にも、次の型がある。

| 型 | 説明 |
| --- | --- |
| `atomic::AtomicUsize` など | ロックなしでスレッド間から読み書きできる整数・bool |
| `OnceLock<T>` | 一度だけ初期化できる値 (Rust 1.70 以降) |
| `LazyLock<T>` | 最初にアクセスされたときに初期化される値 (Rust 1.80 以降) |
| `Condvar` / `Barrier` | 条件が整うまでの待機 / 複数スレッドの待ち合わせ |

```rust
use std::collections::HashMap;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{LazyLock, OnceLock};

static COUNTER: AtomicUsize = AtomicUsize::new(0);

// 初回アクセス時に一度だけ初期化される (グローバルなテーブルなどに)
static TABLE: LazyLock<HashMap<&str, i32>> = LazyLock::new(|| HashMap::from([("a", 1), ("b", 2)]));

static CONFIG: OnceLock<String> = OnceLock::new();

fn main() {
    COUNTER.fetch_add(1, Ordering::Relaxed);
    println!("{}", COUNTER.load(Ordering::Relaxed)); // 1

    println!("{:?}", TABLE.get("a")); // Some(1)

    CONFIG.set("production".to_string()).unwrap(); // 2回目の set は Err になる
    println!("{}", CONFIG.get().unwrap());
}
```

<pre><code class="tips">アトミック操作の Ordering (メモリ順序) は、単純なカウンタなら Relaxed で足りる。
迷ったら、最も厳しい SeqCst を選べば安全。</code></pre>

### std::mem

`&mut` 参照の先の値は、そのままムーブして取り出せない。代わりに、別の値と入れ替えることで取り出す。

| 関数 | 説明 |
| --- | --- |
| `mem::swap(&mut a, &mut b)` | 2つの値を入れ替える |
| `mem::replace(&mut a, new)` | 新しい値を入れて、古い値を返す |
| `mem::take(&mut a)` | `Default` の値を入れて、古い値を返す |

```rust
use std::mem;

let mut a = 1;
let mut b = 2;
mem::swap(&mut a, &mut b); // a = 2, b = 1

let mut name = String::from("old");
let old = mem::replace(&mut name, String::from("new")); // old = "old", name = "new"

let mut v = vec![1, 2, 3];
let taken = mem::take(&mut v); // taken = [1, 2, 3], v = []
```

<pre><code class="tips">Option&lt;T&gt; には同様のメソッド take() / replace() がある。
例: let x = opt.take(); // opt は None になり、元の値が x に入る</code></pre>

### std::cmp

```rust
use std::cmp::{max, min, Ordering, Reverse};

let a = max(3, 5); // 5
let b = min(3, 5); // 3

let x: i32 = 3;
match x.cmp(&5) {
    Ordering::Less => println!("小さい"),
    Ordering::Equal => println!("等しい"),
    Ordering::Greater => println!("大きい"),
}

let mut v = vec![3, 1, 2];
v.sort_by_key(|&n| Reverse(n)); // 降順: [3, 2, 1]
```

`f64` は `Ord` を実装しないため `sort()` は使えない。`total_cmp` を使う。

```rust
let mut f: Vec<f64> = vec![2.5, 1.0, 3.7];
f.sort_by(|a, b| a.total_cmp(b)); // [1.0, 2.5, 3.7]
```

### std::iter

イテレータを作る関数が用意されている。

| 関数 | 説明 |
| --- | --- |
| `iter::repeat(x)` | `x` を無限に繰り返す (`take(n)` で個数を絞る) |
| `iter::once(x)` | `x` を1回だけ返す |
| `iter::successors(first, f)` | 前の値から次の値を作り続ける (`None` を返すと終わる) |
| `iter::from_fn(f)` | クロージャが返す値を順に取り出す (`None` を返すと終わる) |

```rust
use std::iter;

let ab: Vec<_> = iter::repeat("ab").take(3).collect(); // ["ab", "ab", "ab"]

// 1, 2, 4, 8, 16
let powers: Vec<u32> = iter::successors(Some(1u32), |&x| x.checked_mul(2))
    .take(5)
    .collect();

let mut n = 0;
let counter: Vec<i32> = iter::from_fn(|| {
    n += 1;
    if n <= 3 { Some(n) } else { None }
})
.collect(); // [1, 2, 3]
```

### 標準ライブラリにないもの

次のような機能は標準ライブラリに含まれないため、外部クレートを使う。

| 用途 | 代表的なクレート |
| --- | --- |
| 乱数 | `rand` |
| 正規表現 | `regex` |
| 日付・タイムゾーン | `chrono`, `time` |
| JSON・TOML などの読み書き | `serde`, `serde_json`, `toml` |
| 非同期処理 | `tokio` |
| HTTP クライアント | `reqwest` |
| コマンドライン引数のパース | `clap` |

詳しくは <a href="#ecosystem">CLI でよく使うエコシステム</a> を参照。

---

## アトリビュート <a id="attribute" data-name="アトリビュート"></a>

アトリビュートはモジュール、クレート、要素に対するメタデータで、

- コンパイル時の条件分岐
- クレート名、バージョン、種類 (バイナリか、ライブラリか) の設定
- リントの無効化
- コンパイラ付属の機能(マクロ、グロブ、インポートなど)の使用
- 外部ライブラリへのリンク
- ユニットテスト用の関数を明示
- ベンチマーク用の関数を明示

の用途がある。

アトリビュートがクレート全体に適用される場合は<br>
`#![crate_attribute]`<br>
と書き、モジュールや要素に適用される場合は<br>
`#[item_attribute]`<br>
と書く。

### よく使うアトリビュート

| アトリビュート | 説明 |
| --- | --- |
| `#[derive(Debug, Clone, PartialEq)]` | トレイトの実装を自動生成する |
| `#[allow(...)]` / `#[warn(...)]` / `#[deny(...)]` | リント (警告) のレベルを変える |
| `#[expect(...)]` | 警告が出ることを想定する。出なくなったら教えてくれる (Rust 1.81 以降) |
| `#[cfg(test)]` / `#[cfg(target_os = "windows")]` | 条件付きコンパイル |
| `#[test]` | テスト関数であることを示す |
| `#[inline]` | インライン展開のヒント |
| `#[must_use]` | 戻り値を使わないと警告する |

---

## マクロ <a id="macro" data-name="マクロ"></a>

文字列のフォーマット系マクロは <a href="#string-formatting">こちら</a> を参照。

### よく使うマクロ

| マクロ | 説明 |
| --- | --- |
| `vec![]` | `Vec` を作る |
| `assert!` / `assert_eq!` / `assert_ne!` | 条件を検査する (<a href="#test">テスト</a> を参照) |
| `panic!` | パニックを起こす |
| `todo!()` / `unimplemented!()` | 未実装の目印。到達するとパニックするが、どんな型としてもコンパイルが通る |
| `unreachable!()` | 到達しないはずの分岐に書く |
| `matches!(x, pat)` | 値がパターンに一致するかを `bool` で返す |
| `include_str!("file")` | コンパイル時にファイルを文字列として埋め込む |
| `env!("NAME")` | コンパイル時に環境変数を読む |

自作のマクロは `macro_rules!` で定義できる。

```rust
macro_rules! square {
    ($x:expr) => {
        $x * $x
    };
}

println!("{}", square!(3)); // 9
```

`#[derive(...)]` のような手続きマクロは、これとは別の仕組みで実装される。

### fmt::Debug

主に開発用の機能で、構造体や enum の定義の前に、以下のようにアトリビュート `#[derive(Debug)]` を追加するだけで、

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}
```

`{:?}` により、デバッグ用の出力を得られる。

```rust
println!("{:?}", rect);
// Rectangle { width: 30, height: 50 }
```

または `{:#?}` により、整形された読みやすい形で出力される。

```rust
println!("{:#?}", rect);
// Rectangle {
//     width: 30,
//     height: 50,
// }
```

### fmt::Display

エンドユーザー (アプリ利用者) のための機能で、自由に表示形式を定義できる。

```rust
use std::fmt;

struct User {
    id: u32,
    name: String,
}

// Display トレイトを手動で実装する
impl fmt::Display for User {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // ユーザーに id は見せず、名前だけを表示したい
        write!(f, "User: {}", self.name)
    }
}
```

```rust
let u = User {
    id: 32,
    name: String::from("Alice"),
};
println!("{u}"); // User: Alice
```

---

## CLI でよく使うエコシステム <a id="ecosystem" data-name="CLI でよく使うエコシステム"></a>

### 引数パース

`std::env::args()` は生の文字列しか返さないため、`--help` の生成、サブコマンド、型変換、バリデーションを自前で書くことになる。

- **clap**: 事実上の標準。`derive` 機能を使うと、構造体を定義するだけでパーサー・ヘルプ・補完スクリプトまで得られる。
- **lexopt / pico-args**: 依存を極力増やしたい小規模ツール向けの軽量な選択肢。

```rust
use clap::Parser;

/// 簡単な挨拶ツール
#[derive(Parser, Debug)]
#[command(version, about)]
struct Cli {
    /// 挨拶する相手の名前
    name: String,

    /// 繰り返す回数
    #[arg(short, long, default_value_t = 1)]
    count: u8,

    /// 詳細ログを出す (環境変数 VERBOSE でも指定可)
    #[arg(short, long, env = "VERBOSE")]
    verbose: bool,
}

fn main() {
    let cli = Cli::parse();
    for _ in 0..cli.count {
        println!("こんにちは、{}さん！", cli.name);
    }
}
```

`env = "..."` を指定すると、`std::env::var` で行っていた環境変数のフォールバックも宣言的に書ける (`Cargo.toml` では `clap = { version = "4", features = ["derive", "env"] }`)。

### エラーハンドリング

`main` が `Result` を返せるようになっても、エラー型の定義や文脈の付与には手間がかかる。<br>
まずは `std` だけで自作エラーを書く方法を押さえ、そのあとに手間を減らすクレートを見ていく。

#### `std::error::Error` トレイトの基本

自作のエラー型を「エラーとして扱える」ようにするには、次の3点を満たす必要がある。

- `Debug` を実装する (通常は `#[derive(Debug)]`)
- `Display` を実装する (ユーザーに見せるメッセージ)
- `std::error::Error` を実装する (中身が空でもよい)

`Error` トレイトの `source()` は、原因となった下位のエラーを返すメソッドである。<br>
これを実装しておくと、エラーの連鎖 (チェーン) をたどれる。<br>
なお、旧来の `description()` は非推奨なので実装しない。

最小の例は次のとおり。

```rust
use std::error::Error;
use std::fmt;

#[derive(Debug)]
struct EmptyInputError;

impl fmt::Display for EmptyInputError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "入力が空です")
    }
}

impl Error for EmptyInputError {} // source() は既定で None
```

#### 実用的なパターン: `enum` + `From` + `source()`

実際の CLI では、「IO エラー」「パースエラー」「独自の検証エラー」など複数の失敗要因があるため、1つの enum にまとめるのが定番。

```rust
use std::error::Error;
use std::fmt;
use std::fs;
use std::io;
use std::num::ParseIntError;

#[derive(Debug)]
enum ConfigError {
    // どのファイルかを持たせたいので、フィールド付きにする
    Io { path: String, source: io::Error },
    InvalidPort(ParseIntError),
    MissingKey(&'static str),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ConfigError::Io { path, .. } => write!(f, "{path} を読み込めませんでした"),
            ConfigError::InvalidPort(_) => write!(f, "ポート番号が不正です"),
            ConfigError::MissingKey(key) => write!(f, "設定キー `{key}` がありません"),
        }
    }
}

impl Error for ConfigError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            ConfigError::Io { source, .. } => Some(source),
            ConfigError::InvalidPort(e) => Some(e),
            ConfigError::MissingKey(_) => None,
        }
    }
}

// `?` で ParseIntError を自動変換するための実装
impl From<ParseIntError> for ConfigError {
    fn from(e: ParseIntError) -> Self {
        ConfigError::InvalidPort(e)
    }
}

fn load_port(path: &str) -> Result<u16, ConfigError> {
    // パス情報を足したいので、From ではなく map_err で包む
    let text = fs::read_to_string(path).map_err(|source| ConfigError::Io {
        path: path.to_string(),
        source,
    })?;

    let value = text
        .lines()
        .find_map(|line| line.strip_prefix("port="))
        .ok_or(ConfigError::MissingKey("port"))?;

    Ok(value.trim().parse::<u16>()?) // ここで From<ParseIntError> が使われる
}
```

ポイントは次のとおり。

- **`?` の仕組み**: `?` はエラー時に `From::from(e)` を呼んで型を変換する。<br>
つまり `impl From<X> for MyError` を書くと、`?` だけで `X` を `MyError` に変換できる。
- **`From` を実装するか `map_err` を使うか**: 追加情報 (ファイルパスなど) を載せたいときは `map_err` で包む。<br>同じ `io::Error` でも「どのファイルか」を区別できるようになる。
- **`Display` と `source()` の役割分担**: `Display` には「この層で何が失敗したか」だけを書く。原因のメッセージは `source()` 側に任せる。<br>両方に同じ内容を入れると、チェーンを表示したときに二重になる。
- **メッセージの書式**: 慣例として、英語なら小文字始まり・末尾にピリオドなしにする。<br>上位層が `: ` でつなぐ前提だから。

エラーチェーンを自分で表示するには、`source()` をたどる。終了コードも制御したいので、`ExitCode` を返す形にする。

```rust
use std::error::Error;
use std::process::ExitCode;

fn run() -> Result<(), ConfigError> {
    let port = load_port("config.txt")?;
    println!("port = {port}");
    Ok(())
}

fn main() -> ExitCode {
    if let Err(e) = run() {
        eprintln!("error: {e}");
        let mut cause = e.source();
        while let Some(c) = cause {
            eprintln!("  caused by: {c}");
            cause = c.source();
        }
        return ExitCode::from(2);
    }
    ExitCode::SUCCESS
}
```

#### `Box<dyn Error>`: 型を定義せずに済ませる

小さなツールなら、エラー型を定義せず `Box<dyn Error>` で受ける方法もある。<br>
`Error` を実装した型なら何でも `?` で変換され、`&str` や `String` も `.into()` でエラーにできる。

```rust
use std::error::Error;

fn run() -> Result<(), Box<dyn Error>> {
    let n: i32 = "abc".parse()?; // ParseIntError が自動で Box 化される
    if n < 0 {
        return Err("負の値は指定できません".into()); // &str から変換
    }
    Ok(())
}
```

注意点は次のとおり。

- **`main` が `Err` を返した場合の表示は `Debug` 形式**。<br>自作エラーを `Box<dyn Error>` で返すと、`Display` ではなく `Debug` の出力 (`MissingKey("port")` のような形) が出る。<br>見せ方を整えたいなら、上の `main` のように自前で表示する。
- **マルチスレッドで渡すなら `Box<dyn Error + Send + Sync>`** にする。
- 呼び出し側で種類を判定したいときは、`downcast_ref` で元の型に戻せる。<br>ただし多用するなら、素直に enum にしたほうが網羅性チェックが効く。

```rust
if let Some(ConfigError::MissingKey(key)) = e.downcast_ref::<ConfigError>() {
    eprintln!("`{key}` を設定してください");
}
```

#### `thiserror` で定型コードを減らす

`Display` / `Error` / `From` の実装は、`thiserror` (`cargo add thiserror`) を使うとほぼ属性だけで書ける。

```rust
use std::io;
use std::num::ParseIntError;

#[derive(Debug, thiserror::Error)]
enum ConfigError {
    #[error("{path} を読み込めませんでした")]
    Io {
        path: String,
        #[source]
        source: io::Error,
    },

    #[error("ポート番号が不正です")]
    InvalidPort(#[from] ParseIntError), // From と source() を同時に生成

    #[error("設定キー `{0}` がありません")]
    MissingKey(&'static str),
}
```

- `#[error("...")]` が `Display` を生成する。`{0}` やフィールド名で値を埋め込める。
- `#[from]` は `From` の実装と `source()` の両方を生成する。
- `#[source]` は `source()` だけを生成する (`source` という名前のフィールドは自動で認識される)。

生成されるのは通常の `std::error::Error` の実装なので、先ほどの `main` のチェーン表示や `downcast_ref` はそのまま使える。

#### `anyhow` との使い分け

| 状況 | 向いているもの |
| --- | --- |
| ライブラリ。呼び出し側がエラーの種類で分岐する | 自作 enum (`thiserror` または手書き) |
| アプリのトップレベル。ユーザーに表示して終了するだけ | `anyhow::Result` + `.context(...)` |
| 外部依存を増やしたくない小さなツール | `Box<dyn Error>` |

実際には、**下位のモジュールは `thiserror` で型を定義し、`main` 付近では `anyhow` で束ねる**組み合わせがよく使われる。<br>
`thiserror` のエラーは `Error` を実装しているため、そのまま `?` で `anyhow::Error` に変換される。

```rust
use anyhow::{Context, Result};

fn main() -> Result<()> {
    let port = load_port("config.txt")
        .context("設定の読み込みに失敗しました")?; // ConfigError を anyhow で包む
    println!("port = {port}");
    Ok(())
}
```

`bail!` / `anyhow!` を使うと、エラー型を定義せずにその場でエラーを作れる。

```rust
use anyhow::{bail, Result};

fn check(n: i32) -> Result<()> {
    if n < 0 {
        bail!("負の値は指定できません: {n}"); // return Err(anyhow!(...)) の短縮形
    }
    Ok(())
}
```

`main` から `Err` が返ると、プロセスは終了コード 1 で終了し、エラーチェーンが stderr に出力される。<br>
`process::exit` を直接呼ばなくて済むため、デストラクタも正しく実行される。<br>
終了コードを細かく制御したい場合は `std::process::ExitCode` を返す形が便利。

### シリアライズ・設定ファイル

- **serde**: シリアライズ／デシリアライズのフレームワーク。ほぼすべてのフォーマット系クレートの土台。
- **serde_json / toml**: JSON・TOML の読み書き。<br>CLI の出力を `--json` で機械可読にする用途でも多用される。
- **YAML**: かつて標準的だった `serde_yaml` は 2024 年に開発が終了しており (`serde_yml` も非推奨)、新規で使う場合は、現在メンテナンスされているクレート (`serde-saphyr` など) を crates.io で確認する (2026 年 11 月時点)。
- **directories** (または `dirs`): OS ごとの設定・キャッシュディレクトリ (`~/.config` や `%APPDATA%` など) を取得する。

### ターミナル出力・対話

- **owo-colors / colored**: 文字色・装飾。
- **indicatif**: プログレスバーやスピナー。
- **dialoguer / inquire**: 確認プロンプト、選択式メニュー、パスワード入力などの対話 UI。
- **comfy-table**: 表形式の整形出力。

色付き出力は、パイプやリダイレクト時には無効にするのがマナー。環境変数 `NO_COLOR` が設定されている場合も無効にするのが慣例。<br>
標準ライブラリの `std::io::IsTerminal` (Rust 1.70 以降) で、出力先が端末かどうかを判定できる。

```rust
use std::io::{self, IsTerminal};

let use_color = io::stdout().is_terminal();
```

### 補足: ファイル読み込み手法の使い分け

ファイルを読む方法は大きく3つあり、「何をどの単位で処理したいか」で選び分ける。

| 手法 | 内部動作・仕組み | メリット | デメリット・注意点 |
| --- | --- | --- | --- |
| `fs::read_to_string` / `fs::read` | ファイルを開いてメタデータからサイズを取得し、その分の容量を `String` / `Vec<u8>` に事前確保して、全データを読み切る。 | ・コードが最も簡潔 (1行) <br>・サイズを事前に把握するため再アロケーションが起きにくい | ・ファイルサイズに比例してメモリを消費する<br>・全体を読み終えるまで処理を始められない<br>・`read_to_string` は UTF-8 でないと `InvalidData` エラーになる |
| `File::open` + `Read` | 呼び出し側が用意したバッファ (配列など) に対し、`read` のたびに OS のシステムコールを発行する。`File` 自体にはバッファがない。 | ・一度に読むサイズを細かく制御できる<br>・バイナリ形式のヘッダ解析など、読む範囲が決まっている用途に向く | ・数 B〜数 KB の小さな読み込みをループで繰り返すと、システムコールのオーバーヘッドで極端に遅くなる<br>・`read` は要求より少ないバイト数しか返さないことがあるため、`read_exact` や `read_to_end` の使い分けが必要 |
| `BufReader` | 内部に固定サイズのバッファ (標準8KiB) を持ち、まとめて読み込んでメモリ上から少しずつ切り出して返す。 | ・1行単位や小さな塊での繰り返し読み込みが圧倒的に速い<br>・巨大ファイルでもメモリ使用量が一定 (バッファサイズ分) <br>・`lines()` や `read_line()` など `BufRead` の便利なメソッドが使える | ・全体を一括で読むだけなら、`fs::read_to_string` のほうが簡潔で、バッファ分のコピーも発生しない<br>・`lines()` は1行ごとに新しい `String` を確保する |

#### 選び方の目安

- **設定ファイルなど小さなファイルを丸ごと読む** → `fs::read_to_string`
- **ログのような大きなファイルを1行ずつ処理する** → `BufReader` + `lines()`
- **バイナリを決まったサイズで読む** → `File` + `read_exact`
- **途中で処理を打ち切りたい (先頭だけ見たい、`grep` 的な検索など)** → `BufReader` (全体を読み込まずに済む)

```rust
use std::fs::File;
use std::io::{self, BufRead, BufReader};

fn count_matching_lines(path: &str, keyword: &str) -> io::Result<usize> {
    let file = File::open(path)?;
    let reader = BufReader::new(file);

    let mut count = 0;
    for line in reader.lines() {
        // 行ごとに io::Result<String> が返る (UTF-8 でない行はここでエラーになる)
        if line?.contains(keyword) {
            count += 1;
        }
    }
    Ok(count)
}
```

行ごとの `String` 確保が気になる大量データの処理では、1つの `String` を使い回す `read_line` のほうが効率的である。ただし、使い回す場合は毎回 `clear()` が必要 (呼ばないと前の行に追記される)。

```rust
let mut reader = BufReader::new(File::open(path)?);
let mut line = String::new();
while reader.read_line(&mut line)? > 0 {
    // line を処理する (末尾に改行が含まれる点に注意)
    line.clear();
}
```

#### 知っておくと役立つ点

- **標準入力はすでにバッファ付き**: `io::stdin()` は内部でバッファリングされており、`stdin().lock()` は `BufRead` を実装している。そのため、標準入力に `BufReader` をかぶせる必要はない。
- **書き込み側も同じ発想**: `File` への書き込みも、小さな `write!` を繰り返すとシステムコールが増える。大量に書く場合は `BufWriter` で包み、最後に `flush()` するか、スコープを抜けて `drop` させる。`stdout` は行バッファのため、1行ごとに出力が走る点も同様に意識しておくと安心。
- **`BufReader` は大きな読み込みをバイパスする**: バッファより大きなサイズを一度に要求した場合、内部バッファを経由せず直接読み込まれる。そのため、「`BufReader` を使うと必ず余分なコピーが入る」というわけではなく、小さな読み込みを多数行うケースで効果が出る仕組み。
- **エラー文脈の付与**: ファイル読み込みのエラーは `No such file or directory` だけでは、どのファイルか分からない。先ほどの **anyhow** の `.context(format!("{path} を読み込めませんでした"))` を併用すると、原因の特定が格段に楽になる。

### ログ・トレーシング

- **log + env_logger**: `RUST_LOG=debug` のように環境変数でレベルを切り替える、最もシンプルな構成。
- **tracing + tracing-subscriber**: 構造化ログや非同期処理の追跡が必要な場合に。

### ファイル探索・テキスト処理

- **walkdir**: ディレクトリの再帰走査。
- **ignore**: `.gitignore` を尊重した走査 (ripgrep と同じ実装)。
- **glob / globset**: ワイルドカードによるパスのマッチング。
- **regex**: 正規表現。線形時間で動作する安全な実装。

### 並列・非同期・シグナル

- **rayon**: `iter()` を `par_iter()` に変えるだけでデータ並列化できる。
- **tokio**: 非同期ランタイム。ネットワークを多用する CLI で利用する。
- **reqwest**: HTTP クライアント (`blocking` 機能なら非同期ランタイム不要)。
- **ctrlc**: `Ctrl+C` (SIGINT) を捕捉して、後始末をしてから終了できる。

### テスト

- **assert_cmd**: ビルドしたバイナリを実際に起動し、終了コードや出力を検証する。
- **predicates**: `assert_cmd` と組み合わせる出力の判定条件 (部分一致・正規表現など)。
- **assert_fs / tempfile**: テスト用の一時ファイル・ディレクトリを安全に用意する。

```rust
use assert_cmd::cargo::cargo_bin_cmd;

#[test]
fn prints_greeting() {
    cargo_bin_cmd!("mytool")
        .arg("しん")
        .assert()
        .success()
        .stdout(predicates::str::contains("こんにちは、しんさん"));
}
```

`cargo add --dev assert_cmd predicates` で追加する。assert_cmd 2.1 以降では、従来の `Command::cargo_bin("...")` は非推奨で、`cargo_bin_cmd!` マクロに置き換えられている。

### 補足: 依存を選ぶときの目安

- 1ファイルで済む小さなツールなら、まず `std` だけで書き、引数が複雑になった時点で **clap** を足す。
- バイナリ配布を意識するなら、依存の多さはビルド時間とバイナリサイズに直結するため、`clap` の `default-features = false` や軽量クレートの選択も検討する。
- Rust 2024 エディションでは `std::env::set_var` / `remove_var` が `unsafe` になる (マルチスレッド環境でのデータ競合を避けるため)。環境変数の変更は、他スレッドを起動する前の `main` 冒頭で行うか、そもそも子プロセスに渡す形 (`Command::env`) で済ませるのが安全。

---

## テスト <a id="test" data-name="テスト"></a>

### テストの書き方

`#[cfg(test)]` アトリビュートによってコンパイラに、テスト時のみモジュールを有効にするように指定する。

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test] // テスト時ここが実行される
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
```

### アサート関数

#### assert!

式が `true` なら何も起きず、`false` なら panic する。

```rust
assert!(x > 0);
```

#### assert_eq!

左辺と右辺が等しければ何も起きず、等しくなければ panic する。

```rust
assert_eq!(add(2, 3), 5);
```

#### assert_ne!

左辺と右辺が等しくなければ何も起きず、等しければ panic する。

```rust
assert_ne!(add(2, 2), 5);
```

#### should_panic

panic することが期待されるケース。`expected` を付けると、panic メッセージの一部も検証できる。

```rust
#[test]
#[should_panic]
fn test_panic() {
    panic!("error");
}

#[test]
#[should_panic(expected = "divide by zero")]
fn test_divide() {
    divide(1, 0);
}
```

#### ignore

時間のかかるテストなどを、通常の実行から外す。

```rust
#[test]
#[ignore]
fn slow_test() {}
```

#### Result を返すパターン

`Err` を返したらテスト失敗。

```rust
#[test]
fn test_result() -> Result<(), String> {
    let result = some_func()?;
    assert_eq!(result, 42);
    Ok(())
}
```

#### カスタムメッセージ

assert 系のマクロには、最後の引数でメッセージを付けられる。

```rust
assert_eq!(a, b, "計算結果がおかしい");
```

#### debug_assert!

デバッグビルドでは有効で、リリースビルドでは無視される。

```rust
debug_assert!(x > 0);
```

### テストの実行

| コマンド | 説明 |
| --- | --- |
| `cargo test` | すべてのテストを実行する |
| `cargo test 名前` | 名前に部分一致するテストだけ実行する |
| `cargo test -- --nocapture` | 成功したテストの `println!` 出力も表示する |
| `cargo test -- --test-threads=1` | テストを1つずつ順に実行する |
| `cargo test -- --ignored` | `#[ignore]` 付きのテストだけ実行する |

`--` より前は cargo への、後ろはテストプログラムへのオプション。

### テストの置き場所

| 種類 | 場所 | 特徴 |
| --- | --- | --- |
| ユニットテスト | 各ファイルの `#[cfg(test)] mod tests` | 同じ module の非公開の関数もテストできる |
| 結合テスト | `tests/` ディレクトリ (1ファイルが1つの独立したクレート) | 公開 API だけをテストする |
| ドキュメントテスト | `///` のコメント内のコードブロック | `cargo test` で実行され、使用例が古くなるのを防げる |

~~~rust
/// 2つの数を足す。
///
/// ```
/// assert_eq!(my_crate::add(2, 3), 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
~~~

---

## 用語 <a id="term" data-name="用語"></a>

| 用語 | 意味 |
| --- | --- |
| トレイト (Trait) | 型が持つべき振る舞いの定義。他言語の interface に近い |
| プレリュード (Prelude) | インポートせずに使える Rust の機能 |
| ジェネリクス (Generics) | 型を抽象化すること。パラメータは `<>` の中に書く |
| ライフタイム (Lifetime) | 参照が有効である期間 |
| ターボフィッシュ (Turbofish) | `::<>` の形で、関数やメソッドの型パラメータを明示する構文 |
| 定数ジェネリクス (Const generics) | `<const N: usize>` のように、コンパイル時に決まる定数値をパラメータにすること |
| トレイト境界 (Trait bound) | ジェネリック型に課す制約。`T: Display` のように書く |
| 関連型 (Associated type) | トレイトの中で定義する型。`Iterator<Item = i32>` のように `<>` の中で指定できる |
| パッケージ (Package) | Cargo で管理されるプロジェクト単位 |
| クレート (Crate) | Rust のコンパイル単位で、バイナリクレートとライブラリクレートの2種類がある |
| バイナリクレート | 実行可能ファイルとなる |
| ライブラリクレート | 再利用されるコード |
| モジュール (Module) | コードの整理・名前空間管理 |
| アトリビュート | `#[...]` という記述でコンパイラに情報を与える |
| 所有権 (Ownership) | 値の持ち主となる変数は常に1つだけで、持ち主がスコープを抜けると値が破棄されるというルール |
| ムーブ (Move) | 所有権を別の変数や関数に移すこと。ムーブ後の元の変数は使えない |
| 借用 (Borrow) | 所有権を移さず、参照 (`&T` / `&mut T`) を通して値を使うこと |
| バリアント (Variant) | enum の各選択肢 (列挙子) |
| 内部可変性 (Interior mutability) | 不変な参照からでも中身を変更できる仕組み。`Cell`、`RefCell`、`Mutex` など |
| 糖衣構文 (Syntactic sugar) | 読みやすさのために用意された短い書き方。`if let` や `?` など |
| エディション (Edition) | 後方互換性を壊す変更を取り込むための、言語の区切り (2015 / 2018 / 2021 / 2024) |
| ワークスペース (Workspace) | 複数のパッケージを1つのプロジェクトとして管理する仕組み |

---

## 外部クレート <a id="external-crates" data-name="外部クレート"></a>

### 標準のリポジトリ

#### cargo add コマンド

2022年(Rust 1.62) から標準搭載された cargo の機能で、最新バージョンの検索、Cargo.toml への追記、依存関係の解決まで行ってくれる。<br>
基本的に add コマンドを使い、細かい調整が必要な時は Cargo.toml を編集するのが一般的。

```bash
cargo add serde --features derive  # フィーチャを有効にして追加
cargo add assert_cmd --dev         # [dev-dependencies] に追加
```

#### Cargo.toml に直接書く

微調整向きで、GitHub のこのブランチの、このディレクトリにあるクレートなど、複雑な指定をする場合は直接編集した方が早い。

### Git リポジトリ

GitHub や GitLab リポジトリ上のソースを直接参照できる。特定のブランチやコミットハッシュを指定することもできる。

<pre><code class="example">[dependencies]
# リポジトリURLを指定
regex = { git = "https://github.com/rust-lang/regex" }

# 特定のブランチやタグを指定する場合
rand = { git = "https://github.com/rust-lang-nursery/rand", branch = "master" }</code></pre>

### バージョン指定とフィーチャ

| 書き方 | 意味 |
| --- | --- |
| `"1.2.3"` (= `"^1.2.3"`) | 1.2.3 以上、2.0.0 未満 (互換性のある更新を許可。既定)。`0.x` の場合は `"0.2.3"` なら 0.3.0 未満 |
| `"~1.2.3"` | 1.2.3 以上、1.3.0 未満 |
| `"=1.2.3"` | 1.2.3 に固定する |

```toml
[dependencies]
serde = { version = "1", features = ["derive"] } # フィーチャ (任意の機能) を有効にする

[dev-dependencies]   # テストなど、開発中だけ使う依存
assert_cmd = "2"
```

実際に使われたバージョンは Cargo.lock に記録される。アプリケーションでは、再現性のあるビルドのために Cargo.lock もコミットする。

### ローカルのパス

同じ PC 内の別のディレクトリにあるクレートを参照する。巨大なプロジェクトを複数のパッケージに分割して開発する場合などにも用いられる。

<pre><code class="example">[dependencies]
my_library = { path = "../my_library" }</code></pre>

### クレートの登録

crates.io にパブリッシュして、自分のコードをクレートとして登録して誰でも cargo add できるようにする。

1. `cargo login` でトークンを設定する。
2. Cargo.toml に `description` や `license` などの必須項目を記入する。
3. `cargo publish --dry-run` で事前確認してから、`cargo publish` を実行する。公開したバージョンは削除できず、`cargo yank` で新規の利用を止められるだけ。

### ワークスペース

複数の関連するクレートをひとつのプロジェクト(ディレクトリ)内で管理する方法。

- ルートの Cargo.toml の `[workspace]` セクションで `members` を指定し、メンバーのクレート同士は path でつなぐ。
- コンパイル結果 (target ディレクトリ) を共有できるため、ビルド時間の短縮につながる。
- 共通の依存のバージョンは、ルートの `[workspace.dependencies]` でまとめて管理できる。

```toml
# ルートの Cargo.toml
[workspace]
members = ["app", "core"]
resolver = "2"

[workspace.dependencies]
serde = "1"

# app/Cargo.toml (メンバー側)
[dependencies]
serde = { workspace = true }
core = { path = "../core" }
```

---

## 開発 <a id="development" data-name="開発"></a>

### 複数のバイナリクレートを切り替える

同じプロジェクト内で複数のバイナリクレート (実行ファイル) を作るには、通常 `src/bin/` ディレクトリに複数の `.rs` ファイルを作成する。

```text
my_project/
├── Cargo.toml
├── src/
│   ├── main.rs      (パッケージ名のバイナリ: cargo run --bin my_project)
│   └── bin/
│       ├── tool_a.rs (別のバイナリ: cargo run --bin tool_a)
│       └── tool_b.rs (別のバイナリ: cargo run --bin tool_b)
```

実行・ビルド時に、`--bin` でファイル名 (拡張子なし) を指定して切り替える。

```bash
cargo run --bin tool_a
```

バイナリが複数あると、`cargo run` だけではどれを実行するか決まらずエラーになる。`default-run` を指定すると、引数なしの `cargo run` の対象を決められる。

```toml
[package]
name = "my_project"
default-run = "tool_a"
```

### 警告を消す

使っていない変数や、呼び出されていない関数に対する警告を消すには主に2つの方法がある。

#### アンダースコアを付ける

名前の先頭に `_` を付けることであえて使っていないことを明示する。

#### アトリビュート `#![allow(unused)]` を使う

ファイルの先頭に以下を記述する。

| 警告メッセージ | 意味 | 対策アトリビュート |
| --- | --- | --- |
| unused_variables | 定義した変数が一度も使われていない | `#![allow(unused_variables)]` |
| dead_code | 関数や構造体がどこからも呼び出されていない | `#![allow(dead_code)]` |
| unused_imports | use したけれど使っていない | `#![allow(unused_imports)]` |
| 全部まとめて | 上記すべて | `#![allow(unused)]` |

`#![allow(...)]` はファイル (クレート) 全体に効く。特定の関数や構造体だけなら、その直前に `#[allow(...)]` を書く。

```rust
#[allow(dead_code)] // この関数だけ警告を消す
fn helper() {}
```

`#[expect(dead_code)]` にすると、警告が出なくなったとき (不要になったとき) に知らせてくれる (Rust 1.81 以降)。警告を消す前に、`cargo clippy` の指摘で直せないかも確認するとよい。

---

## WSL2 で Windows 開発 <a id="WSL2-for-windows" data-name="WSL2でWindows開発"></a>

### 初期セットアップ (初回のみ)

Rust のターゲットとリンカをインストールする。

```bash
# RustにWindows用ターゲットを追加
rustup target add x86_64-pc-windows-gnu

# C/C++リンカ (MinGW) をWSL2にインストール
sudo apt update
sudo apt install -y mingw-w64
```

ターゲットを指定してビルドする。

```bash
cargo build --target x86_64-pc-windows-gnu --release
```

または、設定ファイルでデフォルトのターゲットを固定すれば、通常の `cargo build` / `cargo run` のままビルドできる。

```bash
mkdir -p .cargo
touch .cargo/config.toml
```

<span class="code-like">.cargo/config.toml</span> に以下を設定。

```toml
[build]
# cargo build や cargo run のデフォルトターゲットをWindows(MinGW)に固定
target = "x86_64-pc-windows-gnu"

[target.x86_64-pc-windows-gnu]
# リンカに x86_64-w64-mingw32-gcc を指定
linker = "x86_64-w64-mingw32-gcc"
```

<pre><code class="tips">プロジェクトごとではなく、WSL2 上のすべての Rust プロジェクトで有効化したい場合は
<span class="code-like">~/.cargo/config.toml</span> で上記の内容を記述する。</code></pre>

ビルドして実行すると、Windows 側で実行される。<br>
成果物は `target/x86_64-pc-windows-gnu/release/アプリ名.exe` に出力される (ターゲットを指定すると、`target/release/` ではなく、ターゲット名のディレクトリの下になる)。
