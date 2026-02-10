---
title: Rust
layout: default
---

# Rust <a id="top" data-name="TOP"></a>

---

## cargo











---

## 関数 <a id="function" data-name="関数"></a>

### 構文

```rust
fn func([argument...]) -> return_value {}
```

### 文と式

- 文は何らかの動作をして値を返さない命令。
- 式は結果値に評価され、値を返す。

```rust
{
    let x = 3; // 文
    x + 1      // 式
}
```
ブロックの最後にセミコロン(;)を付けない場合は式となり結果をreturnする。


---

## 型 <a id="type" data-name="型"></a>


Rustは静的型付き言語であり、コンパイル時に型が決まっている必要がある。


### 数値型

| 型 | 説明 |
| --- | --- |
| i8 | 8ビット整数 |
| i16 | 16ビット整数 |
| i32 | 32ビット整数 |
| i64 | 64ビット整数 |
| i128 | 128ビット整数 |
| isize | 符号付整数で、サイズはアーキテクチャで最速の型となる |
| u8 | 8ビット符号なし整数 |
| u16 | 16ビット符号なし整数 |
| u32 | 32ビット符号なし整数 |
| u64 | 64ビット符号なし整数 |
| u128 | 128ビット符号なし整数 |
| usize | 符号なし整数で、サイズはアーキテクチャで最速の型となる |
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


### 配列

配列はヒープよりもスタックにメモリを確保したい場合、常に固定長の要素がある場合に同じ型の要素を格納することができる。

```rust
let a = [1, 2, 3, 4, 5];
```

<br>

配列の型は角括弧の中に要素の型とセミコロン(;)と配列の要素数を書く。

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
```

<br>

角括弧の中に初期値とセミコロン(;)と配列の要素数を書いて同じ値で初期化することもできる。

```rust
let a = [3; 5];
```

### タプル

タプルは様々な型の複数の値を1つの複合型にまとめる手段であり、サイズの変更はできない。

```rust
let tup: (i32, f64, u8) = (500, 6.4, 1);
```

<br>

```rust
let tup = (500, 6.4, 1);

let (x, y, z) = tup;

println!("The value of y is: {y}"); // 6.4
```

上記のプログラムでは、まずタプルを生成しtupに束縛して、tupの中身を3つの変数(x, y, z)に束縛している。これを分配と呼ぶ。

<br>

アクセスしたい値の番号をピリオド(.)に続けて書くことでもアクセスできる。

```rust
let x: (i32, f64, u8) = (500, 6.4, 1);

let five_hundred = x.0;
let six_point_four = x.1;
let one = x.2;
```

<br>

#### ユニット

値をひとつも持たないタプルはユニットという特別な名前を持ち、()と書き表され、空の値や空の戻り値を表現する。<br>
式が値を返さなければ暗黙的にユニット値を返す。

---

## 構造体 <a id="struct" data-name="構造体"></a>

- 定義
```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```
- 生成
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
- アクセス
```rust
user1.email = String::from("anotheremail@example.com");
```

<br>


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

## メソッド <a id="method" data-name="メソッド"></a>

#### 関連関数

メソッドを定義するにはimplブロックで始める。<br>
implブロック内で定義されたすべての関数は、implの後に書かれた型に関連付けられているので、<strong>関連関数</strong>と呼ばれる。

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}
```

対象とするインスタンスを必要としないためにselfを第1引数として持たない(つまりメソッドではない)関連関数を定義することもできる。<br>
メソッドではない関連関数は、構造体の新規インスタンスを返すコンストラクタによく使用される。

```rust
impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}
```

この関数を呼び出すために構造体名と::を使用する。

```rust
Rectangle::square(3);
```

---

## enum <a id="enum" data-name="enum"></a>

IPアドレスのように、2つの規格(IPv4とIPv6)のいずれかの値(複数の値)を持つものを表現するにはenumが適している。

- 宣言
```rust
enum IpAddrKind {
    V4,
    V6,
}
```
- 生成
```rust
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;
```

そしてenumはタグ(列挙子)に加えて直接データを持てる。

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
## Option <a id="option" data-name="Option"></a>

Optionは、何らかの値を持つ、何も持たないを表現するenumであり、標準ライブラリで定義されている。<br>
Optionはpreludeに含まれているため、明示的にOption::と書かなくてもSomeとNoneを使える。

```rust
enum Option<T> {
    None,
    Some(T),
}
```

Some値であるとき、値があるとわかりその値はSomeに保持されている。<br>
None値であるとき、値がないことがわかる。

<br>

```rust
let x: i8 = 5;
let y: Option<i8> = Some(5);

// let sum = x + y; // error!
```

このような書き方は言語仕様上禁止されていて、Optionは、SomeとNoneの場合の処理を記述することをプログラマに強制していると言える。<br>
enumの処理は[match](#match)が適している。

---

## Result <a id="result" data-name="Result"></a>










## ベクタ <a id="vector" data-name="ベクタ"></a>

ベクタは同じ型の値を動的にかつメモリ上で隣り合った形で保持できるコレクション。

#### 生成

- 空のベクタを生成
```rust
let mut v: Vec<i32> = Vec::new();
```
- 初期値を与える
```rust
let v = vec![1, 2, 3];
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
v.push(8);
```
---

## ハッシュマップ <a id="hashmap" data-name="ハッシュマップ"></a>

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



---

## 変数 <a id="variable" data-name="変数"></a>

> let

letで不変の変数となる。<br>
値の再代入ができないという意味で、宣言時に値が決まればいい。

```rust
let i : i32 = 15;
// i = 30 // error
```

> let mut

let mutで可変な変数となる。

```rust
let mut i: i32 = 15;
i = 30; // ok
```

> const

constで定数となりる。<br>
constの場合はコンパイル時に値が決まっている必要がある。

### シャドーイング

シャドーイングとは、前に定義した変数と同じ名前で変数を宣言することを言い、前に宣言された変数は破棄され、新たな変数で覆い隠す。

> メリット

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

#### 型変換

asで型を変換する。

```rust
let mut code = ch as i8;
```

---

## 制御フロー <a id="control-flow" data-name="制御フロー"></a>

### if

```rust
for _i in 1..16 {
    if (_i % 3 == 0) && (_i % 5 == 0) {
        println!("FizzBuzz");
    } else if _i % 3 == 0 { // 基本は括弧なし
        println!("Fizz");
    } else if _i % 5 == 0 {
        println!("Buzz");
    } else {
        println!("{}", _i);
    }
}
```

<br>

ifは式なので、letの右辺に持ってきて結果を代入することができる。

```rust
let number = if condition { 5 } else { 6 };
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

<br>

逆順で取り出す。
```rust
for num in (1..4).rev() {
    println!("{num}"); // 3 2 1
}
```

<br>

コレクションを順番に取り出す

```rust
let a = [10, 20, 30, 40, 50];

for elm in a {
    println!("the value is: {elm}");
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

<br>

loopの中にloopがある場合、ループラベルを使用することでbreakやcontinueが適用されるループを指定することができる。<br>
ループラベルはシングルクォートで始める。

```rust
let mut count = 0;
'counting_up: loop {
    println!("count = {count}");
    let mut remaining = 10;

    loop {
        println!("remaining = {remaining}");
        if remaining == 9 {
            break;
        }
        if count == 2 {
            break 'counting_up;
        }
        remaining -= 1;
    }

    count += 1;
}
println!("End count = {count}");
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

continueは、continue以降の処理を飛ばしてブロックの先頭にジャンプする。

---

### match

matchは、一連のパターンに対して値を比較し、マッチしたパターンに応じて処理を実行する。<br>
また、matchは包括的であり、すべての可能性を網羅しないとコンパイルが通らないという特徴がある。

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```



```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

アームのコードが短い場合、波括弧({})は使用しない。<br>
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





---


### println!

#### デバッグ用出力

構造体定義の前に以下のように外部属性を追加すると
```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

int main() {
    let rect = Rectangle {
        width: 30,
        height: 50, 
    };
}
```

printでデバッグ用の出力を得られる

```rust
println!("{:?}", rect);
// { width: 30, height: 50 }
```
