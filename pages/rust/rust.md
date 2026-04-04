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

## cargo <a id="cargo" data-name="cargo"></a>

| --- | --- |
| cargo new プロジェクト名 | プロジェクト名で新たにプロジェクトディレクトリを作る |
| cargo init | カレントディレクトリをプロジェクトディレクトリとする |
| cargo run | プロジェクトのビルドと実行を1ステップで行う |
| cargo build | プロジェクトをビルドする |
| cargo check | バイナリを生成せずにビルドしてエラーチェックができる |

---

## 関数 <a id="function" data-name="関数"></a>

#### 構文

```rust
fn func([argument...]) -> return_value {
    // 処理内容
    return_value // セミコロンを付けなければ戻り値となる
}
```


---

## クロージャ <a id="closure" data-name="クロージャ"></a>

### 基本構文

```rust
|引数| 式;
```

以下は全て同じ意味で、下に行くほど表記が省略されている。

```rust
fn  add_one_v1(x: u32) -> u32 { x + 1 }
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

クロージャには3つのトレイトがあり、このキャプチャにおけるの所有権の扱いによって、そのクロージャがどのトレイトを実装するかが決まる。

1. キャプチャなし、または不変借用
    ```rust
let x = 10;
let f = |y| x + y; // &x を借用
println!("{}", x); // OK
    ```
    - `Fn + FnMut + FnOnce`を実装。
2. 可変借用
    ```rust
let mut x = 10;
let mut f = |y| {
    x += y;
};
f(5);
println!("{}", x); // 15
    ```
    - `FnMut + FnOnce`を実装。
3. 所有権を消費
    ```rust
let x = String::from("hello");
let f = move || {
    println!("{}", x);
};
f();
// println!("{}", x); // ❌ 使えない
    ```
    - `FnOnce`を実装。

---

## イテレータ <a id="Iterator" data-name="イテレータ"></a>

イテレータは要素をひとつずつ取り出す仕組みで、`Iterator`トレイトを実装する。<br>
イテレータは怠惰なので呼ばれて初めて処理が走る。

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
    - 元のイテレータは使えなくなる

### アダプタ

アダプタはイテレータを返す。

```rust
v.iter()
    .filter(|x| *x % 2 == 0)
    .map(|x| x * 2)
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

#### collect

collect でコレクションに変換する。

```rust
let v: Vec<_> = iter.collect();
```

#### for_each

```rust
iter.for_each(|x| println!("{}", x));
```

#### sum

```rust
let sum: i32 = v.iter().sum();
```

---

## スマートポインタ <a id="smart-pointer" data-name="スマートポインタ"></a>

| --- | --- |
| <a href="#box">Box&lt;T&gt;</a> | ヒープにデータを置くためのポインタ |
| <a href="#rc">Rc&lt;T&gt;</a> | ひとつのデータに複数の所有権を許可する(シングルスレッド用) |
| <a href="#arc">Arc&lt;T&gt;</a> | `Rc<T>` のマルチスレッド版 |
| <a href="#refcell">RefCell&lt;T&gt;</a> | 不変な値を変更する内部可変性を当たれる |
| <a href="#mutex">Mutex&lt;T&gt;</a> | `RefCell<T>` のスレッド安全版 |
| `RwLock<T>` | `Mutex<T>` の読み取りが多く、書き込みが少ない場合 |
| <a href="#pin">Pin&lt;P&gt;</a> | データのアドレスを固定する |
| <a href="#cow">Cow&lt;'a, T&gt;</a> | 借用とクローンを使い分ける |

---

### `Box<T>` <a id="box"></a>

`Box<T>` は、データを明示的にヒープに確保する。<br>
また、明示的に所有権を奪う目的でも使う。<br>
以下は Box の主な利用法。

- コンパイル時にサイズを知ることができない型に対して
- 多くのデータの所有権を移すときにコピーされないように
- 値を所有する必要があり、特定の型ではなく特定のトレイトの実装の有無のみを気にかける場合(トレイトオブジェクト)

#### 使い方

##### 生成と参照

```rust
    let b = Box::new(5); // 整数5をヒープに配置
    
    println!("b = {}", *b); // 参照外し(*)で値を取り出せる
    // print!に関しては*が無くても取り出せる
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
可変で使用する場合は <a href="#rc-refcell">RefCell&lt;T&gt; と組み合わせる。</a>また、マルチスレッド環境で使用する場合は `Arc<T>` を使用する。

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
 `Rc<T>` であれば `Clone()` で増えるのは参照カウントだけでコストが少ない。
- `Rc<T>` は一度作ったら中身が変わらないという特性を持つため、低コストで配れる。

### `Arc<T>` <a id="arc"></a>

`Arc<T>` はマルチスレッド専用の `Rc<T>` で、参照カウントを操作する際の安全性がある。<br>
CPUのキャッシュ同期などを行うため、 `Rc<T>` と比べて実行コストがある。<br>
可変で扱う場合は、`Mutex<T>` と併せて使う。


### `RefCell<T>` <a id="refcell"></a>

`RefCell<T>` は、コンパイル時のルールを回避して、実行時に借用規則をチェックする仕組み。<br>
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

<pre><code class="caution">この組み合わせはシングルスレッド限定</code></pre>




### `Mutex<T>` <a id="mutex"></a>

`Mutex<T>` は `Mutual Exclusion` (相互排他)の略で、複数のスレッドが同時に同じデータにアクセスしてデータが壊れるのを防ぐ。

#### 使い方

1. lock()を呼ぶ
    データにアクセスしたいスレッドは `.lock()` 呼ぶ。他のスレッドが使用中であれば、そのスレッドが使い終わるまで待機(プロック)する。
2. `MutexGuard` を受け取る
    ロックに成功すると `MutexGuard` という特別な型が返され、これがある間だけ中のデータ `T` を `&mut T` として自由に読み書きできる。
3. `MutexGuard` がスコープを抜けると自動的にロックが解除される。

```rust
use std::sync::{Arc, Mutex};
use std::thread;

let counter = Arc::new(Mutex::new(0)); // Arc で共有、Mutex で可変に
let mut handles = vec![];

for _ in 0..10 {
    let counter = Arc::clone(&counter);
    let handle = thread::spawn(move || {
        // ロックを取得。unwrap() は他のスレッドがパニックしてロックが壊れていないか確認するため
        let mut num = counter.lock().unwrap();
        *num += 1;
    }); // ここで num(MutexGuard)がスコープを抜け、自動でロック解除
    handles.push(handle);
}
```

### `Pin<P>` <a id="pin"></a>

`Pin<TP` はデータをメモリ上で移動(Move)されないように固定することにより、自己参照構造がメモリ上を移動して、
内部のポインタが壊れてしまうことを防止する。

### `Cow<'a, T>` <a id="cow"></a>

`Clone-on-Write` の略で、基本的には参照(借用)で済ませたいけど、書き換える必要がある時だけクローンして自分のものとする。<br>
用途としては、文字列の加工で変更がない場合は `&str` として扱い、変更が必要な時だけ `String` に変換して返すような効率的な処理ができる。

---

## 型 <a id="type" data-name="型"></a>

Rustは静的型付き言語であり、コンパイル時に型が決まっている必要がある。

### use

use宣言を使用すると、名前にアクセスするために完全なモジュールパスを入力する必要がなくなる。

#### ライブラリ
Rustには、利用可能な機能が3つの層に分かれている。

| --- | --- |
| prelude | useせずに使える(Vec, String, Option, Result, panic!など) |
| 標準ライブラリ(std) | フルパスで書くか、useする必要がある(std::io, std::Collections::HashMapなど) |
| 外部ライブラリ(Crates) | Dependenciesに加えて、かつフルパスで書くか、useが必要(rand, regexなど) |

### type

型エイリアス(type)を用いると型の名前があまりに長かったり、あまりに一般的だったりで改名したい場合に役立つ。<br>
命名する名前はUpperCamelCaseである必要がある。唯一の例外は基本型(usize, f32など)。<br>
あくまでエイリアスであり新たな型を定義しているわけではないことに注意。



### 数値型

| --- | --- |
| i8 | 8ビット整数 |
| i16 | 16ビット整数 |
| i32 | 32ビット整数 |
| i64 | 64ビット整数 |
| i128 | 128ビット整数 |
| isize | 符号付整数で、サイズはアーキテクチャで最速の型となる<br>32ビット環境なら32ビット、64ビット環境なら64ビット |
| u8 | 8ビット符号なし整数 |
| u16 | 16ビット符号なし整数 |
| u32 | 32ビット符号なし整数 |
| u64 | 64ビット符号なし整数 |
| u128 | 128ビット符号なし整数 |
| usize | 符号なし整数で、サイズはアーキテクチャで最速の型となる<br>32ビット環境なら32ビット、64ビット環境なら64ビット |
| f32 | 32ビット浮動小数点数 |
| f64 | 64ビット浮動小数点数 |

#### 整数リテラル

| 数値リテラル | 例 |
| --- | --- |
| 10進数 | 98_222 |
| 16進数 | 0xff |
| 8進数 | 0o77 |
| 2進数 | 0b1111_0000 |
| バイト(u8のみ) | b'A' |

### 文字型

| --- | -- |
| char | 'a', 'α', '∞'などのUnicodeのスカラー値(それぞれ4バイト) |

### 真偽値

| --- | --- | 
| bool | true または false |

### 配列

配列は、常に固定長の要素がある場合に、同じ型の要素を格納することができる。

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

まずタプルを生成しtupに束縛して、tupの中身を3つの変数(x, y, z)に束縛している。これを分配と呼ぶ。

#### インデックスアクセス

アクセスしたい値の番号をピリオド(.)に続けて書くことでもアクセスできる。

```rust
let x: (i32, f64, u8) = (500, 6.4, 1);

let five_hundred = x.0;
let six_point_four = x.1;
let one = x.2;
```

### ユニット型

値をひとつも持たないタプルはユニットという特別な名前を持ち、()と書き表され、空の値や空の戻り値を表現する。<br>
式が値を返さなければ暗黙的にユニット値を返す。

---

## 定数 <a id="constant" data-name="定数"></a>

Rustには2種類の定数があり、いずれもグローバルスコープを含む任意のスコープで宣言が可能。<br>
またいずれも型を明示する必要がある。

| --- | --- |
| const | 不変の値(通常はこちらを使う) |
| static | `'static`ライフタイムを持つ変更可能な値<br>可変なスタティック値へのアクセスや変更は安全ではない |

---

## 文字列 <a id="string" data-name="文字列"></a>

Rustにおける文字列(および文字)の表現は３種類ある。

| --- | --- |
| String | サイズ変更可能な文字列バッファであり、ヒープ領域にデータの実態を持ち、UTF-8でエンコードされている |
| &str | 文字列データへの参照で、データの開始ポインタと文字長を持つ |
| char | 1つの文字そのもの。Unicodeで常に4バイト |

#### 生成

```rust
let mut s = String::new() // 空の文字列

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

Stringおよび&strは、Vec&lt;u8&gt;のラップであり、内部的にUTF-8でデータを保持しているため、インデックスでアクセスした際、複数バイトの境界にアクセスするとパニックする。

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
    パーサーやネットワーク・ファイル処理で重要。ASCIIのみ。
    ```rust
let bytes: &[u8] = b"hello";
    ```
    UTF-8エンコード文字列を、UTF-8保証なしのバイト列にする場合は、
    ```rust
let bytes = "あいう".as_bytes();
    ```

- 可変バイト列<br>
    Stringの中身と同じ構造だが、UTF-8保証なし。
    ```rust
let mut v = vec![104, 101, 108, 108, 111];
    ```

- バイト文字列リテラル<br>
    ASCII前提の高速処理で、コンパイル時にバイト列になる。
    ```rust
let b = b"hello";
    ```

#### 生文字列

- エスケープなし文字列<br>
    `\n`や`\"`を解釈しない。
    ```rust
let s = r"C:\Users\name";
    ```

- ダブルクォートを含めたい場合<br>
    `r#"..."#`で囲む。
    ```rust
let s = r#"{"key": "value"}"#;
    ```

#### OS依存文字列

OSのネイティブな表現で、UTF-8とは限らない。特にWindows、ファイルパスで必須。

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
let mut cow = Cow::Borrowed("hello");
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

## 構造体 <a id="struct" data-name="構造体"></a>

構造体は複数の値に名前を付けて(フィールド)保持するための型で、定義とインスタンスの生成を別々に行う。

インスタンスが可変かどうかはmutキーワードで可変となるが、そのインスタンス全体が可変となり、一部のフィールドのみを可変にすることはできない。 

#### 定義

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```

#### 生成

```rust
fn main() {
    let mut user1 = User {
        active: true,
        username: String::from("someusername123"),
        email: String::from("someone@example.com"),
        sign_in_count: 1,
    };
}
```

#### アクセス

```rust
user1.email = String::from("anotheremail@example.com");
```

#### フィールド初期化省略記法

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

仮引数とフィールド名が同じなのでフィールド初期化省略ができる。

#### 構造体更新記法

```rust
let user2 = User {
    email: String::from("another@example.com"),
    ..user1
};
```

このように同じ値の代入を簡単に書ける。

#### タプル構造体

タプル構造体は、タプル全体に名前を付け、そのタプルを他のタプルとは異なる型にしたいが、各フィールドに名前を与えるのは冗長である場合などに有効。

```rust 
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
// このblackとoriginは型が異なる
```

#### ユニット様構造体

一切フィールドを持たない構造体も定義でき、ある型にトレイトを実装するが、型自体に保持させるデータがない場合に有用。

```rust
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
}
```

---

## enum <a id="enum" data-name="enum"></a>

IPアドレスのように、2つの規格(IPv4とIPv6)のいずれかの値(複数の中のいずれか)を持つものを表現するにはenumが適している。

#### 宣言

```rust
enum IpAddrKind {
    V4,
    V6,
}
```

#### 生成

```rust
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;
```

#### enumにデータを持たせる

enumはタグ(列挙子)に加えて直接データを持てる。

```rust
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

let home = IpAddr::V4(127, 0, 0, 1);

let loopback = IpAddr::V6(String::from("::1"));
```

enumを利用してこのような表現もできる

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

### メソッド

enumは構造体と同様にメソッドを定義できる。

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

## OptionとResult <a id="option-result" data-name="OptionとResult"></a>

### Option

Optionは、何らかの値を持つ、または何もない状態を表現するenum。<br>
preludeに含まれているため、明示的にOption::と書かなくてもSomeとNoneを使える。

```rust
enum Option<T> {
    Some(T),
    None,
}
```

### Result

Resultは、結果の値を持つ、または失敗してerrorを持つ状態を表現するenum。<br>
preludeに含まれているため、明示的にRsult::と書かなくてもOkとErrを使える。

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

#### 中身を取り出す

| 手法 | Option | Result | 備考 |
| --- | --- | --- | --- |
| パターンマッチ | match opt { Some(v) => ..., None => ... } | match res { Ok(v) => ..., Err(e) => ... } | すべてのケースを網羅する最も安全な方法 |
| 簡易マッチ | if let Some(v) = opt { ... } | if let Ok(v) = res { ... } | 片方のケースだけ必要な場合 |
| デフォルト値 | opt.unwrap_or(default) | res.unwrap_or(dafault) | 失敗時に変わりの値を使う |
| 強制取り出し | opt.unwrap() | res.unwrap() | パニック。テスト以外は非推奨 |

#### 値を包んだまま操作する

| 関数 | 例 | 説明 |
| --- | --- | --- |
| map() | opt.map(\|x\| x*2), NoneならNoneのまま | 中身がSomeやOkの時だけ関数を適用し、結果を箱に戻す |
| and_then() | res.and_then(check_condition) | 処理の結果がさらにOptionやResultを返す場合に使う(ネストを防ぐ) |

#### ?演算子による伝播

| --- | --- |
| Optionを返す関数内 | Noneだったら return None; |
| Resultを返す関数内 | Errだったら return Err(e); |

<pre><code class="tips">for entry in fs::read_dir(".")? {
    let entry = entry?; // ここでResultをはがす(Errならreturn (Err(e)))
    println!("{:?}", entry.path()); 
}</code></pre>

---

## メソッド <a id="method" data-name="メソッド"></a>

メソッドを定義するにはimplブロックで始める。

### メソッド

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 { // インスタンスに関連づいているため&selfと書く
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

### 関連関数

対象とするインスタンスを必要としないためにselfを第1引数として持たない(つまりメソッドではない)関連関数を定義することもできる。<br>
関連関数は、構造体の新規インスタンスを返すコンストラクタによく使用される。

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

---

## collections <a id="collections" data-name="collections"></a>

Rustの標準コレクション

| Rust | 用途 | C++ |
| --- | --- | --- |
| Vec&lt;T&gt; | 可変長配列 | std::vector&lt;T&gt; |
| VecDeque&lt;T&gt; | 両端キュー | std::deque&lt;T&gt; |
| LinkedList&lt;T&gt; | 双方向リスト | std::list&lt;T&gt; |
| HashMap&lt;K, V&gt; | ハッシュマップ | std::unorderd_map&lt;K, V&gt; |
| BTreeMap&lt;T, V&gt; | 木構造マップ | std::map&lt;T, V&gt; |
| HashSet&lt;T&gt; | ハッシュ集合 | std::unorderd_set&lt;T&gt; |
| BTreeSet&lt;T&gt; | 木構造集合 | std::set&lt;T&gt; |
| BinaryHeap&lt;T&gt; | 優先度付きキュー | std::priority_queue&lt;T&gt; |

---

### ベクタ

ベクタは同じ型の値を動的にかつメモリ上で隣り合った形で保持できるコレクション。

#### 生成

- 空のベクタを生成
```rust
let mut v: Vec<i32> = Vec::new();
```
- 初期値を与える
```rust
let v = vec![1, 2, 3]; // マクロによる型推論
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

### ハッシュマップ

型HashMap<K, V>は、 K型のキーとV型の値の対応関係をハッシュ関数を使用して保持する。

#### 生成

```rust
    use std::collections::HashMap;

    let mut scores = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
```







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
fn func(S: &String) {
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
let slice = &s[3..len];
let slice = &s[3..];
```

- 両方の添え字を省略すれば全体を表す。よってこれらは等価。
```rust
let slice = &s[0..len];
let slice = &s[..];
```

<pre><code class="tips">Stringにおいてはスライスと&strは同等。</code></pre>

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

別の型から生成。

#### `push`/`insert`

内部を変更。

- &mut self

---

## 変数 <a id="variable" data-name="変数"></a>

#### let

letで不変の変数となる。<br>
値の再代入ができないという意味で、宣言時に値が決まればいい。

```rust
let i : i32 = 15;
// i = 30 // error
```

#### let mut

let mutで可変な変数となる。

```rust
let mut i: i32 = 15;
i = 30; // ok
```

#### const

constで定数となりる。<br>
constの場合はコンパイル時に値が決まっている必要がある。

### シャドーイング

シャドーイングとは、前に定義した変数と同じ名前で変数を宣言することを言い、前に宣言された変数は破棄され、新たな変数で覆い隠す。

#### メリット

- mutを付けて可変にせずに一時的に値を書き換えることができる。
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

### 型変換(キャスト)

asで型を変換する。

```rust
let mut code = ch as i8;
```

---

## 制御フロー <a id="control-flow" data-name="制御フロー"></a>

### match

matchは、値のパターンで識別して、中身を取り出しながら分岐し、しかも漏れがないか確認できる仕組み。<br>
上から順に評価されて、最初にマッチしたアームが選ばれるので、より具体的なものを先、より包括的なものを後に書く。

```rust
let age = 15;

match age {
    0 => println!("新生児です"),
    1 | 2 => println!("乳幼児です"), // 1 または 2
    3..=12 => println!("子供です"),   // 3から12(12を含む)
    13..=19 => println!("ティーンエイジャーです"),
    _ => println!("大人です"),         // その他すべて
}
```

アームのコードが短い場合、波括弧{}は使用しない。<br>
複数行のコードがある場合は波括弧で囲い、カンマ( , )は省略する。

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

### if

```rust
for i in 1..16 {
    if (i % 3 == 0) && (i % 5 == 0) {
        println!("FizzBuzz");
    } else if i % 3 == 0 { // 基本は()括弧なし
        println!("Fizz");
    } else if i % 5 == 0 {
        println!("Buzz");
    } else {
        println!("{}", i);
    }
}
```

#### 戻り値を持つif

ifは式なので、letの右辺に持ってきて、値を返して束縛することができる。

```rust
let number = if condition { 5 } else { 6 };
```

### if let

特定のパターンだった場合にのみ処理する時に有効。

```rust
// Noneの場合は何もしない
if let Some(i) = some_value {
    println!("値は {} です", i);
}
```

else で包括的な処理も書けるが、アームが増えてらmatchが自然。

```rust
if let Some(i) = some_value {
    println!("値は {} です", i);
} else {
    println!("Noneでした");
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

Rust1.65で追加された機能で、パターンに一致すれば変数を取り出し、一致しなければ早期returnする。<br>
elseにreturn、brake/continue、panic!等で、後続のマッチした場合の処理を行わないようにする必要がある。

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

ダメな条件で次々と弾いていくガード節を使うことにより、過度なネストを防ぐことができる。

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
for _i: i32 in 0..10 { // 0から9まで
    println!("hello");
}
```

```rust
for _i: i32 in 0..=10 { // 0から10まで
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

| --- | ---|
| iter() | 要素を借用する |
| into_iter() | 要素をムーブする |
| iter_mut() | 要素を可変借用する |

<pre><code class="tips">デフォルトでinto_iterが適用されるため、for文は所有権を奪う。</code></pre>


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

条件がtrueの間ブロック内を繰り返す。

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

無限ループをする場合はwhile trueではなくloopを使用する。

```rust
fn main() {
    loop {
        println!("again!");
    }
}
```

#### break

ブロックを抜けるにはbreakを使う。<br>
breakは値を返すこともできる。

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

continueは、以降の処理を飛ばしてブロックの先頭にジャンプする。

#### ネストとラベル

ネストしたループを回している時に外側のループを`break`、または`continue`したい場合は`'label`を用いてラベルを貼り、break/continueにそのラベルを渡す。

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

## トレイト <a id="trait" data-name="トレイト"></a>





### トレイト境界

トレイト境界とは、ジェネリック型に対する制約の事を言う。<br>
トレイト境界を指定すると、ジェネリック型パラメータに特定のTraitが実装されていることを保証できる。

書き方は3パターンある。

- ジェネリクス + トレイト境界(基本形)
    ```rust
fn print<T: std::fmt::Display>(x: T)
    ```

- impl Trait(省略形)
    ```rust
fn print(x: impl std::fmt::Display)
    ```

- where句(増えた時に使う)
    ```rust
fn print<T>(x: T)
where
    T: std::fmt::Display
{
    println!("{}", x);
}
    ```

### fmt::Debug

主に開発用の機能で、構造体やenum定義の前に以下のようにアトリビュート追加するだけで

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}
```

`"{:?}"`により、デバッグ用の出力を得られる。

```rust
println!("{:?}", rect);
// Rectangle { width: 30, height: 50 }
```

または`"{:#?}"`により、整形され読みやすい形で出力される。

```rust
println!("{:#?}", rect);
// Rectangle {
//     width: 30,
//     height: 50 
// }
```


### fmt::Display

エンドユーザー(アプリ利用者)のための機能で、自由に表示形式を定義できる。

```rust
use std::fmt;

struct User {
    id: u32,
    name: String,
}

// Displayトレイトを手動で実装する
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

文字列のフォーマットは <a href="#string-formatting">こちら </a>を参照。

---

## マクロ <a id="macro" data-name="マクロ"></a>

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

<a href="#string-formatting">文字列をフォーマット </a>してヒープに確保して String として返す。

```rust
fn main() {
    let name = "Rust";
    let version = 1.75;
    let s = format!("Hello, {} {}!", name, version);

    println!("{}", s); // "Hello, Rust 1.75!"
}
```

#### write!

文字列のフォーマットは を参照。
既にある場所(StringかI/O)に <a href="#string-formatting">文字列をフォーマット</a> して書き込む。<br>
書き込みに失敗する可能性があるので、戻り値は io::Result<()>。
書き込み先に応じて use する。

| --- | --- |
| 文字列 | use std::fmt::Write |
| 入出力 | use std::io::Write |

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

## 文字列のフォーマット <a id="string-formatting" data-name="文字列のフォーマット"></a>

#### 変数を引数に取る

Rust 1.58以降では周囲の変数から直接引数に取ることができる。

```rust
let number: f64 = 1.0;
println!("number is {number}");
```

#### {} による置き換え

{} は様々な引数を自動的に置き換える。

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

(コロン): の後にフォーマット文字を指定して、異なるフォーマットにする。

```rust
println!("Base 10:               {}",   69420); // 69420
println!("Base 2 (binary):       {:b}", 69420); // 10000111100101100
println!("Base 8 (octal):        {:o}", 69420); // 207454
println!("Base 16 (hexadecimal): {:x}", 69420); // 10f2c
```

右寄せ

```rust
println!("{number:>5}", number=1); // 右寄せ5文字幅
```

0埋め

```rust
// 右寄せで0埋め
println!("{number:0>5}", number=1); // 00001
// 左寄せで0埋め
println!("{number:0<5}", number=1); // 10000
```

名前付き引数

```rust
// $をつけることで名前付き引数を利用できる
println!("{number:0>width$}", number=1, width=5);
```

---

## アトリビュート <a id="attribute" data-name="アトリビュート"></a>

アトリビュートはモジュール、クレート、要素に対すメタデータで、

- コンパイル時の条件分岐
- クレート名、バージョン、種類(バイナリか、ライブラリか)の設定
- リントの無効化
- コンパイラ付属の機能(マクロ、グロブ、インポートなど)の使用
- 外部ライブラリへのリンク
- ユニットテスト用の関数を明示
- ベンチマーク用の関数を明示

の用途がある。

アトリビュートがクレート全体に適用される場合は `#![crate_attribute]` という書き方になり<br>
モジュールや要素に適用される場合は `#[item_attribute]` となる。

---

## テスト <a id="test" data-name="テスト"></a>

### テストの書き方

`#[cfg(test)]`アトリビュートによってコンパイラに、test時のみモジュールを有効にするように指定する。

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

trueならOk。falseならpanic。

```rust
assert!(x > 0);
```

#### assert_eq!

左辺と右辺が等しいならOk。等しくなければpanic。

```rust
assert_eq!(add(2, 3), 5);
```

#### assert_ne!

左辺と右辺が等しくないならOk。等しければpanic。

```rust
assert_ne!(add(2, 2), 5);
```

#### should_panic

panicすることが正しいケース。

```rust
#[test]
#[should_panic]
fn test_panic() {
    panic!("error");
}
```

#### Resultを使うパターン

エラーならテスト失敗。

```rust
#[test]
fn test_result() -> Result<(), String> {
    let result = some_func()?;
    assert_eq!(result, 42);
    Ok(())
}
```

#### カスタムメッセージ

assertはメッセージを付けられる。

```rust
assert_eq!(a, b, "計算結果がおかしい");
```

#### debug_assert!

デバッグビルドでは動いて、リリースビルドでは無視。

```rust
debug_assert!(x > 0);
```


---

## 用語 <a id="term" data-name="用語"></a>

| 用語 | 意味 |
| --- | --- |
| トレイト(Trait) | 型が持つべき振る舞いの定義。多言語のinterfaceに近い |
| ジェネリクス(Generics) | 型を抽象化すること |
| ライフタイム(Lifetime) | 参照が有効である期間 |
| パッケージ(Package) | Cargoで管理されるプロジェクト単位 |
| クレート(Crate) | Rustのコンパイル単位で、バイナリクレートとライブラリクレートの2種類がある |
| バイナリクレート | 実行可能ファイルとなる |
| ライブラリクレート | 再利用されるコード |
| モジュール(Module) | コードの整理・名前空間管理 |
| アトリビュート | `#[...]`という記述でコンパイラに情報を与える |

---

## 開発 <a id="development" data-name="開発"></a>

### 複数のバイナリクレートを切り替える

同じプロジェクト内でバイナリクレート(実行ファイル)のコンパイルを切り替えるには、
通常 `src/bin/` ディレクトリに複数の `.rs` ファイルを作成して、

```
my_project/
├── Cargo.toml
├── src/
│   ├── main.rs      (デフォルトのバイナリ: cargo run)
│   └── bin/
│       ├── tool_a.rs (別のバイナリ: cargo run --bin tool_a)
│       └── tool_b.rs (別のバイナリ: cargo run --bin tool_b)
```

コンパイル時に、

```bash
cargo run --bin tool_a
```

ファイル名を指定する。

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
