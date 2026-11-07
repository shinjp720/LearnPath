---
title: Rust
layout: default
---

# Rust <a id="top" data-name="TOP"></a>

### コメント

```rust
// 行末までコメント
/* 複数行コメント可能 */
```

---

## 導入 <a id="introduction" data-name="導入"></a>

### インストール

#### ビルドツールの準備

C 言語のコンパイラやビルドツール群をあらかじめインストールする。これがないと、多くの Rust 用ライブラリがビルドエラーとなる。

```bash
sudo apt update
sudo apt install -y build-essential curl gcc
```

#### rustup スクリプトの実行

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

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

---

## rustup <a id="runsup" data-name="rustup"></a>

Rust という言語・開発環境そのものを管理するツール。

| コマンド | 説明 |
| --- | --- |
| `rustup update` | Rust のツールチェーンを最新バージョンに更新する<br>定期的に更新した方がよい |
| `rustup show` | インストールされている Rust のバージョンや、アクティブなツールチェーン、<br>追加コンポーネントの状態を確認する |
| `rustup component add rustfmt`<br>`rustup component add clippy`<br>`rustup component add rust-analyzer` | 必須級のツール (コード整形、静的解析、言語サーバー) を導入する |
| `rustup target add wasm32-unknown-unknown`<br>`rustup target list --installed` | クロスコンパイル (他の OS/環境向けビルド) 用のターゲットの追加と、導入済みターゲットの確認 |
| `rustup self update` | rustup 自体のアップデート |

---

## cargo <a id="cargo" data-name="cargo"></a>

個別のプロジェクトやコードを管理するツール。

| コマンド | 説明 |
| --- | --- |
| `cargo new プロジェクト名` | プロジェクト名で新たにプロジェクトディレクトリを作る |
| `cargo init` | カレントディレクトリをプロジェクトディレクトリとする |
| `cargo run` | プロジェクトのビルドと実行を1ステップで行う |
| `cargo build` | プロジェクトをビルドする |
| `cargo build --release` | 最適化を有効にしたリリースビルドを行う |
| `cargo check` | バイナリを生成せずにビルドして、エラーチェックができる |
| `cargo test` | テストを実行する |
| `cargo add クレート名` | 依存クレートを Cargo.toml に追加する |

### 自作ツールをインストールする

<code class="code-like">cargo install</code> は、バイナリ crate をリリースビルドして、PATH の通った場所にインストールする。これにより、その時点の実行ファイルをターミナルから使用できるようになる。

- Cargo.toml にバイナリの設定がある必要がある
    - プロジェクトがライブラリではなく実行ファイルとして構成されている
    - または `[[bin]]` セクションが定義されている
- デフォルトで `~/.cargo/bin` に実行ファイルが配置される

Rust アプリケーション (バイナリ crate) を cargo install でインストールする方法は大別して2つある。

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

#### GitHub からインストール

```bash
cargo install --git https://github.com/username/repository_name.git
```

<div class="subtitle2">特定のコミットやブランチやタグを指定するオプション</div>

| 指定したい対象 | オプション | コマンド例 |
| --- | --- | --- |
| 特定のコミット | --rev | `cargo install --git <URL> --rev 1a2b3c4d` |
| 特定のブランチ | --branch | `cargo install --git <URL> --branch develop` |
| 特定のタグ | --tag | `cargo install --git <URL> --tag v1.0.0` |

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

- package：Cargoプロジェクト全体
- crate：コンパイル単位
- module：crateの中を整理する名前空間

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

### crate root

crate には必ず根 (root) があり、library crate であれば lib.rs が、binary crate であれば main.rs が root となる。

### mod モジュール名 により 子module を宣言する

例えば lib.rs における `mod search;` は、この module の中に search という module がある、という宣言になる。

```rust
// lib.rs
mod search;
```

```text
crate
└─ search
```

### 同名の .rs とディレクトリを作って 子module を定義する

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

### バイナリクレートとライブラリクレート

バイナリクレートとライブラリクレートを分割する設計にすることで、エントリーポイントの変更が容易になり、結合テストが書きやすくなる。<br>
また、ビルド・コンパイルの高速化が期待でき、汎用的で拡張性の高い設計となる。

---

## 制御フロー <a id="control-flow" data-name="制御フロー"></a>

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

#### リテラル

値そのものを比較する。

```rust
match x {
    0 => {}
    1 => {}
    100 => {}
    true => {}
    'a' => {}
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
        println!("None.")
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

if は式なので、let の右辺に持ってきて、値を返して束縛することができる。

```rust
let number = if condition { 5 } else { 6 };
```

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
break は値を返すこともできる。

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
        'inner: loop {
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
関連関数は、構造体の新規インスタンスを返すコンストラクタとしてよく使われる。

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

関数やクロージャを引数として受け取る関数。

| 関数 | 役割 |
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
| `zip` | 2つのIteratorを組み合わせる |
| `take` | 先頭からN個だけ |
| `skip` | 先頭N個を飛ばす |
| `collect` | Iteratorをコレクションにする |

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
`FnMut(Self::Item) -> Option<B>` というトレイトを実装したものであれば関数も渡せる。

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

```rust
// 普通のmapだとこうなる
[[0], [0, 1], [0, 1, 2]]
```

### アダプタ

イテレータアダプタは、新しいイテレータを返すメソッド。<br>
遅延評価 (lazy) のため、`collect()` などで消費するまで処理は行われず、要素が1つずつチェーンを通って評価される。

```rust
v.iter()
    .filter(|x| *x % 2 == 0)
    .map(|x| x * 2)
    .collect::<Vec<_>>(); // ここで消費されて初めて処理が走る
```

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

## クロージャ <a id="closure" data-name="クロージャ"></a>

### 基本構文

```rust
|引数| 式;
```

以下はすべて同じ意味で、下に行くほど表記が省略されている。

```rust
fn add_one_v1(x: u32) -> u32 { x + 1 }
let add_one_v2 = |x: u32| -> u32 { x + 1 };
let add_one_v3 = |x| { x + 1 };
let add_one_v4 = |x| x + 1;
```

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

1. iter()
    - 借用
    - 型：`&T`
    - 不変参照
2. iter_mut()
    - 可変借用
    - 型：`&mut T`
    - 値が変更可能
3. into_iter()
    - ムーブ
    - 型：`T`
    - 元のコレクションは使えなくなる

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

- 通常の借用 `(&T)` は、所有者が借りる側よりも長く生きることをコンパイラに証明する必要があるが、
グラフ構造や木構造で、親ノードが消えても子ノードが別の場所から参照されて生き残る必要がある場合や、
イベント駆動・コールバックのイベントなど、いつ実行されるか分からない関数にデータを渡す場合。
- 一部のライブラリや関数が、引数として参照 `(&T)` ではなく所有権 `(T)` を要求する場合、
 `Rc<T>` であれば `clone()` で増えるのは参照カウントだけでコストが少ない。
- `Rc<T>` は一度作ったら中身が変わらないという特性を持つため、低コストで配れる。

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
CPUのキャッシュ同期などを行うため、 `Rc<T>` と比べて実行コストがある。<br>
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
実行時に借用規則に違反すると、パニックが発生する。

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
            // ロックを取得。他のスレッドがロック保持中にパニックした場合は Err が返るため unwrap() で取り出す
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
文字列としての使い方は、「文字列」の Cow (コピーオンライト) も参照。</code></pre>

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
命名する名前は UpperCamelCase である必要がある。唯一の例外は基本型 (usize, f32 など)。<br>
あくまでエイリアスであり新たな型を定義しているわけではないことに注意。

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
浮動小数点数から整数へのキャストでは、小数部が切り捨てられ、範囲外の値は最小値・最大値に丸められる。</code></pre>

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

##### From の実装

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

##### TryFrom の実装

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

#### 生ポインタのキャスト

C言語のようなメモリアドレスの型変換。<br>
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

Rustには2種類の定数があり、いずれもグローバルスコープを含む任意のスコープで宣言が可能。<br>
またいずれも型を明示する必要がある。

### const

通常の定数はこちらを使う。<br>
`const` はコンパイル時に評価され、使用箇所に値がインライン展開されるため、変更できない。<br>
実質的にリテラルと `const` は同等。

### static

`static` はプログラムの実行中は必ず存在する一意の値で、参照(&)を取ることができ、 `'static` なライフタイムを持つ。<br>
`Mutex` や `Atomic*` などの内部可変性を使うか、`static mut` を `unsafe` で扱うことで変更できる (`static mut` は避けるのが望ましい)。

---

## 文字列 <a id="string" data-name="文字列"></a>

Rust における文字列 (および文字) の表現は3種類ある。

| 型 | 説明 |
| --- | --- |
| `String` | サイズ変更可能な文字列バッファであり、ヒープ領域にデータの実体を持ち、UTF-8 でエンコードされている |
| `&str` | 文字列データへの参照で、データの開始ポインタと長さを持つ |
| `char` | 1つの文字そのもの。Unicode で常に4バイト |

#### 生成

```rust
let mut s = String::new(); // 空の文字列

// 以下の例は等価
let data = "initial contents"; // リテラルは&str(不変参照)
let s = data.to_string(); // &strからStringを生成(ヒープに確保)

let s = String::from("initial contents"); // fromで生成
```

#### 文字列スライス

文字列スライスとは、Stringの一部への参照で、開始地点へのポインタと長さ(len)の情報を持つ。

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

#### charに変換

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

collect()すると、ひとつの要素がchar型(4バイト)となる。

#### byteに変換

```rust
for b in "Зд".bytes() {
    println!("{b}");
}
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
    let mut v = vec![104, 101, 108, 108, 111];
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
    `r#"..."#` で囲む。
    ```rust
    let s = r#"{"key": "value"}"#;
    ```

#### OS依存文字列

OS のネイティブな文字列表現 (`OsStr` / `OsString`) で、UTF-8 とは限らない。ファイルパス (`Path`) や環境変数などで使われる。

```rust
use std::ffi::OsStr;
```

#### C互換文字列

C言語とやり取りするためのNULL終端文字列。

```rust
use std::ffi::CString;
```

#### Cow(コピーオンライト)

無駄なコピーを避けるためのenumで、ライブラリ設計で重要になる。

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

#### Box&lt;str&gt;

Stringは再アロケートを少なくするために、余分なキャパシティーを持っているので、`Box<str>`に変換することで、所有権を持ちながら余分なキャパシティーを削減する。大量データ向け。<br>
ただし不変なデータとなるので、文字列を変更する場合はStringに戻す必要がある。

```rust
let mut s = String::from("hello");
s.push_str(" world");
// もうsを変更しない
let b = s.into_boxed_str();
```

---

## 文字列のフォーマット <a id="string-formatting" data-name="文字列のフォーマット"></a>

### 出力・フォーマット

出力、フォーマット用に以下のようなマクロが提供されている。

| マクロ | 説明 |
| --- | --- |
| format! | フォーマットしたテキストを String にして返す |
| write! | すでにある場所にフォーマットしたテキストを書き込む |
| print! | format! と同様だが、標準出力 (io::stdout) にそのテキストを出力する |
| println! | print! と同様だが、改行が付け加えられる |
| eprint! | format! と同様だが、標準エラー出力 (io::stderr) にそのテキストを出力する |
| eprintln! | eprint! と同様だが、改行が付け加えられる |
| dbg! | 所有権を奪ってデバッグ情報を出力し、所有権を返す |

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

ループなどで毎回 String を生成するとアロケートに時間がかかる場合があるが、ひとつの String を使いまわせば、処理速度が向上する可能性がある。<br>
また書き込み先がファイルでも String でもネットワークでも、同じマクロで扱える。

#### dbg!

標準エラー出力 (stderr) に、ファイル名、行番号、式そのものを出力する。<br>
Debugトレイトを実装している必要がある。<br>
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

#### {} による置き換え

`{}` には、`Display` を実装した値が展開される。

```rust
println!("{} days", 31);
```

#### 位置引数

{} で整数を指定することで、どの位置引数で置換されるか決まる。

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

:(コロン) の後にフォーマット文字を指定して、異なるフォーマットにする。

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

このように <code class="code-like">..user1</code> で、残りのフィールドを別のインスタンスから引き継げる。

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

### enumにデータを持たせる

enum はタグ (列挙子) に加えて直接データを持てる。

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

### 値を包んだまま操作する

| 関数 | 例 | 説明 |
| --- | --- | --- |
| `map()` | `opt.map(\|x\| x * 2)` (`None` なら `None` のまま) | 中身が `Some` や `Ok` の時だけ関数を適用し、結果を箱に戻す |
| `and_then()` | `res.and_then(check_condition)` | 処理の結果がさらに `Option` や `Result` を返す場合に使う (ネストを防ぐ) |

### ?演算子による伝播

| 場所 | 動作 |
| --- | --- |
| `Option` を返す関数内 | `None` だったら `return None;` |
| `Result` を返す関数内 | `Err` だったら `return Err(e);` (必要なら `From` で型変換される) |

<pre><code class="tips">for entry in fs::read_dir(".")? {
    let entry = entry?; // ここで Result をはがす (Err なら return Err(e))
    println!("{:?}", entry.path());
}</code></pre>

### 相互に変換

#### Result から Option へ

<code class="code-like">ok()</code>: エラーの内容は破棄される。

```rust
let success: Result<i32, &str> = Ok(42);
let failure: Result<i32, &str> = Err("エラー発生");

assert_eq!(success.ok(), Some(42));
assert_eq!(failure.ok(), None); // 破棄される
```

#### Option から Result へ

None だった場合にはエラー (err) を指定する必要がある。

<code class="code-like">ok_or()</code>: エラー値を直接渡す。`&str` (リテラル) などの安価な値でよい。

```rust
let empty_num: Option<i32> = None;

let res: Result<i32, &str> = empty_num.ok_or("値が空です");

assert_eq!(res, Err("値が空です"));
```

<code class="code-like">ok_or_else()</code>: エラー値の生成にコストがかかる場合 (`String` の生成など) に、`None` のときだけクロージャで生成する。

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
| Vec&lt;T&gt; | 可変長配列 | std::vector&lt;T&gt; |
| VecDeque&lt;T&gt; | 両端キュー | std::deque&lt;T&gt; |
| LinkedList&lt;T&gt; | 双方向リスト | std::list&lt;T&gt; |
| HashMap&lt;K, V&gt; | ハッシュマップ | std::unordered_map&lt;K, V&gt; |
| BTreeMap&lt;K, V&gt; | 木構造マップ | std::map&lt;K, V&gt; |
| HashSet&lt;T&gt; | ハッシュ集合 | std::unordered_set&lt;T&gt; |
| BTreeSet&lt;T&gt; | 木構造集合 | std::set&lt;T&gt; |
| BinaryHeap&lt;T&gt; | 優先度付きキュー | std::priority_queue&lt;T&gt; |

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

#### アクセス

- インデックスでアクセス
```rust
let v = vec![1, 2, 3, 4, 5];
let third: &i32 = &v[2]; // 範囲外アクセスはパニックとなる
println!("The third element is {third}");
```
- getメソッドでアクセス
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
let scores: HashMap<_, _> = teams.into_iter().zip(points.into_iter()).collect();
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

## 所有権 <a id="ownership" data-name="所有権"></a>

- ヒープに確保された変数は他の変数への代入、関数の呼び出しによって所有権がムーブされる。
```rust
let s1 = String::from("hello");
let s2 = s1; // helloの所有権がムーブ
// println!("{s1}") // error!
```

### 引数の渡し方

Rustは大別して3パターンの引数の渡し方がある。

- 値渡し(move)
```rust
fn func(s: String) {
    // sの所有権はここ
}
```
所有権が関数側に移動して、呼び出し元ではこの変数はもう使えない。<br>
Copy型(i32, boolなど)だけは実質コピー。
- 参照渡し(不変参照)
```rust
fn func(s: &String) {
    // ReadOnly
}
```
所有権は移動せずに、変数の値は書き換えできないが、同時に複数渡せる。
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

- 2連ピリオド(..)の前に添え字を書かなければこれらは等価。
```rust
let slice = &s[0..2];
let slice = &s[..2];
```

- 同様に末尾を書かなければこれらは等価。
```rust
let len = s.len();
let slice = &s[3..len];
let slice = &s[3..];
```

- 両方の添え字を省略すれば全体を表す。よってこれらは等価。
```rust
let len = s.len();
let slice = &s[0..len];
let slice = &s[..];
```

<pre><code class="tips">文字列のスライスの型は &amp;str になる。</code></pre>

### 所有権を軸にしたメソッドの命名規則

#### `to_*`

借用して、新しい型を作って返す。

```rust
let s = "Hello";
let lower = s.to_lowercase();
```

- 引数：&self(借用)
- 戻り値：新しい所有権

#### `into_*`

所有権をムーブして変換。

```rust
let s = String::from("Hello");
let bytes = s.into_bytes();
```

- 引数：self(ムーブ)
- 元の型は使えなくなる

#### `as_*`

参照で別の型として見るだけ。

```rust
let s = String::from("Hello");
let slice = s.as_str();
```

- 引数：&self(借用)
- 戻り値：&selfなど(参照)

#### `get_*`

安全に取り出す(失敗あり)。

```rust
let v = vec![1,2,3];
let x = v.get(0);
```

- 戻り値：`Option<T>`や`Option<&T>`

#### `from`

別の型から生成する (`From` トレイトの `from()`)。

#### `push`/`insert`

内部を変更。

- 引数：&mut self(可変借用)

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

let mutで可変な変数となる。

```rust
let mut i: i32 = 15;
i = 30; // ok
```

### const

不変である点は `let` と同じだが、`const` はコンパイル時に値が決まっている必要があり、型注釈も必須。<br>
`let` はコンパイル時に値が決まっている必要がなく、1度代入したら変更できない。

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
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
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

AsRef が .as_ref() による手動変換なら、Deref は *x または自動変換。

通常、参照の前に *(アスタリスク) を付けると、その参照の実体にアクセスできるが (参照外し)、<br>
自作の構造体に Deref を実装すると、 *my_struct と書いたときに、構造体そのものではなく、<br>
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

明示的に * を書かなくても、Deref型強制により自動的に変換してくれる。

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
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
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

`AsRef<U>` を実装している型であれば、&U (Uの参照) として扱うことができるという意味。

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

コレクションやジェネリックAPIなどで、「この型は別の型を借用する形で扱えます」という関係を表す。

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

Send は値を別スレッドに送れることを表す。

Sync はある型への参照を複数スレッドから共有できることを表す。

例えば `Rc<T>` は `Send` でも `Sync` でもないため、スレッド間で共有する場合は `Arc<T>` を使う。

#### Fn / FnMut / FnOnce

`Fn` は不変借用だけで何度でも呼べるクロージャ (関数)。

`FnMut` は内部で状態を変更するため、可変借用が必要なクロージャ (関数)。何度でも呼べる。

`FnOnce` は所有権を消費するため、1度だけ呼べるクロージャ (関数)。

#### PartialEq / Eq

PartialEq は == と != を使えるようにする。

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

```rust
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

<pre><code class="tips">Option<T> には同様のメソッド take() / replace() がある。
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

詳しくは <a href="#ecosystem">CLIでよく使うエコシステム</a> を参照。

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

---

## マクロ <a id="macro" data-name="マクロ"></a>

文字列のフォーマット系マクロは <a href="#string-formatting">こちら</a> を参照。

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
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
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

## CLIでよく使うエコシステム <a id="ecosystem" data-name="CLIでよく使うエコシステム"></a>

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

実際のCLIでは、「IOエラー」「パースエラー」「独自の検証エラー」など複数の失敗要因があるため、1つの enum にまとめるのが定番。

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

`Display` / `Error` / `From` の実装は、`thiserror` を使うとほぼ属性だけで書ける。

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
|---|---|
| ライブラリ。呼び出し側がエラーの種類で分岐する | 自作 enum (`thiserror` または手書き)  |
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

`main` から `Err` が返ると、プロセスは終了コード 1 で終了し、エラーチェーンが stderr に出力される。<br>
`process::exit` を直接呼ばなくて済むため、デストラクタも正しく実行される。<br>
終了コードを細かく制御したい場合は `std::process::ExitCode` を返す形が便利。

### シリアライズ・設定ファイル

- **serde**: シリアライズ／デシリアライズのフレームワーク。ほぼすべてのフォーマット系クレートの土台。
- **serde_json / toml / serde_yaml**: JSON・TOML・YAML の読み書き。<br>CLIの出力を `--json` で機械可読にする用途でも多用される。
- **directories** (または `dirs`): OSごとの設定・キャッシュディレクトリ (`~/.config` や `%APPDATA%` など) を取得する。

### ターミナル出力・対話

- **owo-colors / colored**: 文字色・装飾。
- **indicatif**: プログレスバーやスピナー。
- **dialoguer / inquire**: 確認プロンプト、選択式メニュー、パスワード入力などの対話UI。
- **comfy-table**: 表形式の整形出力。

色付き出力は、パイプやリダイレクト時には無効にするのがマナー。<br>
標準ライブラリの `std::io::IsTerminal` (Rust 1.70 以降) で、出力先が端末かどうかを判定できる。

```rust
use std::io::{self, IsTerminal};

let use_color = io::stdout().is_terminal();
```

### 補足: ファイル読み込み手法の使い分け

ファイルを読む方法は大きく3つあり、「何をどの単位で処理したいか」で選び分ける。

| 手法 | 内部動作・仕組み | メリット | デメリット・注意点 |
|---|---|---|---|
| `fs::read_to_string` / `fs::read` | ファイルを開いてメタデータからサイズを取得し、その分の容量を `String` / `Vec<u8>` に事前確保して、全データを読み切る。 | ・コードが最も簡潔 (1行) <br>・サイズを事前に把握するため再アロケーションが起きにくい | ・ファイルサイズに比例してメモリを消費する<br>・全体を読み終えるまで処理を始められない<br>・`read_to_string` は UTF-8 でないと `InvalidData` エラーになる |
| `File::open` + `Read` | 呼び出し側が用意したバッファ (配列など) に対し、`read` のたびに OS のシステムコールを発行する。`File` 自体にはバッファがない。 | ・一度に読むサイズを細かく制御できる<br>・バイナリ形式のヘッダ解析など、読む範囲が決まっている用途に向く | ・数B〜数KBの小さな読み込みをループで繰り返すと、システムコールのオーバーヘッドで極端に遅くなる<br>・`read` は要求より少ないバイト数しか返さないことがあるため、`read_exact` や `read_to_end` の使い分けが必要 |
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
- **tokio**: 非同期ランタイム。ネットワークを多用するCLIで利用する。
- **reqwest**: HTTP クライアント (`blocking` 機能なら非同期ランタイム不要)。
- **ctrlc**: `Ctrl+C` (SIGINT) を捕捉して、後始末をしてから終了できる。

### テスト

- **assert_cmd**: ビルドしたバイナリを実際に起動し、終了コードや出力を検証する。
- **predicates**: `assert_cmd` と組み合わせる出力の判定条件 (部分一致・正規表現など)。
- **assert_fs / tempfile**: テスト用の一時ファイル・ディレクトリを安全に用意する。

```rust
use assert_cmd::Command;

#[test]
fn prints_greeting() {
    Command::cargo_bin("mytool")
        .unwrap()
        .arg("しん")
        .assert()
        .success()
        .stdout(predicates::str::contains("こんにちは、しんさん"));
}
```

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

panic することが期待されるケース。

```rust
#[test]
#[should_panic]
fn test_panic() {
    panic!("error");
}
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

---

## 用語 <a id="term" data-name="用語"></a>

| 用語 | 意味 |
| --- | --- |
| トレイト (Trait) | 型が持つべき振る舞いの定義。他言語の interface に近い |
| プレリュード (Prelude) | インポートせずに使える Rust の機能 |
| ジェネリクス (Generics) | 型を抽象化すること |
| ライフタイム (Lifetime) | 参照が有効である期間 |
| パッケージ (Package) | Cargo で管理されるプロジェクト単位 |
| クレート (Crate) | Rust のコンパイル単位で、バイナリクレートとライブラリクレートの2種類がある |
| バイナリクレート | 実行可能ファイルとなる |
| ライブラリクレート | 再利用されるコード |
| モジュール (Module) | コードの整理・名前空間管理 |
| アトリビュート | `#[...]`という記述でコンパイラに情報を与える |

---

## 外部クレート <a id="external-crates" data-name="外部クレート"></a>

### 標準のリポジトリ

#### cargo addコマンド

2022年(Rust 1.62) から標準搭載された cargo の機能で、最新バージョンの検索、Cargo.toml への追記、依存関係の解決まで行ってくれる。<br>
基本的に add コマンドを使い、細かい調整が必要な時は Cargo.toml を編集するのが一般的。

#### Cargo.toml に直接書く

微調整向きで、GitHub のこのブランチの、このディレクトリにあるクレートなど、複雑な指定をする場合は直接編集した方が早い。

### Gitリポジトリ

GitHub や GitLab リポジトリ上のソースを直接参照できる。特定のブランチやコミットハッシュを指定することもできる。

<pre><code class="example">[dependencies]
# リポジトリURLを指定
regex = { git = "https://github.com/rust-lang/regex" }

# 特定のブランチやタグを指定する場合
rand = { git = "https://github.com/rust-lang-nursery/rand", branch = "master" }</code></pre>

### ローカルのパス

同じPC内の別のディレクトリにあるクレートを参照する。巨大なプロジェクトを複数のパッケージに分割して開発する場合などにも用いられる。

<pre><code class="example">[dependencies]
my_library = { path = "../my_library" }</code></pre>

### クレートの登録

crates.io にパブリッシュして、自分のコードをクレートとして登録して誰でも cargo add できるようにする。

1. `cargo login` でトークンを設定する。
2. Cargo.toml に `description` や `license` などの必須項目を記入する。
3. `cargo publish` コマンドを実行する。

### ワークスペース

複数の関連するクレートをひとつのプロジェクト(ディレクトリ)内で管理する方法。

- ルートの Cargo.toml の `[workspace]` セクションで `members` を指定し、メンバーのクレート同士は path でつなぐ。
- コンパイル結果 (targetディレクトリ) を共有できるため、ビルド時間の短縮につながる。

---

## 開発 <a id="development" data-name="開発"></a>

### 複数のバイナリクレートを切り替える

同じプロジェクト内で複数のバイナリクレート (実行ファイル) を作るには、通常 `src/bin/` ディレクトリに複数の `.rs` ファイルを作成する。

```text
my_project/
├── Cargo.toml
├── src/
│   ├── main.rs      (デフォルトのバイナリ: cargo run)
│   └── bin/
│       ├── tool_a.rs (別のバイナリ: cargo run --bin tool_a)
│       └── tool_b.rs (別のバイナリ: cargo run --bin tool_b)
```

実行・ビルド時に、`--bin` でファイル名 (拡張子なし) を指定して切り替える。

```bash
cargo run --bin tool_a
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
| unused_imports | useしたけれど使っていない | `#![allow(unused_imports)]` |
| 全部まとめて | 上記すべて | `#![allow(unused)]` |

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

ビルドして実行すると、Windows 側で実行される。
