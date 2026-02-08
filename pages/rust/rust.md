---
title: Rust
layout: default
---

# Rust <a id="top" data-name="TOP"></a>

---

## cargo









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

### 整数リテラル

| 数値リテラル | 例 |
| --- | --- |
| 10進数 | 98_222 |
| 16進数 | 0xff |
| 8進数 | 0o77 |
| 2進数 | 0b1111_0000 |
| バイト(u8のみ) | b'A' |

### 複合型

複合型により複数の値を1つの型にまとめることができる。

> 配列

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

> タプル

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

<pre><code class="tips">値をひとつも持たないタプルはユニットという特別な名前を持ち、()と書き表され、空の値や空の戻り値を表現する。<br>
式が値を返さなければ暗黙的にユニット値を返す。</code></pre>

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
    let x = 3;
    x + 1
}
```
ブロックの最後にセミコロン(;)を付けない場合は式となり結果をreturnする。


### 引数の渡し方

Rustは大別して3パターンの引数の渡し方がある。

> 値渡し(move)

```rust
fn func(s: String) {
    // sの所有権はここ
}
```

所有権が関数側に移動して、呼び出し元ではこの変数はもう使えない。<br>
Copy型(i32, boolなど)だけは実質コピー。

> 参照渡し(不変参照)

```rust
fn func(S: &String) {
    // ReadOnly
}
```

所有権は移動せずに、変数の値は書き換えできないが、同時に複数渡せる。


> 可変参照渡し

```rust
fn f(s: &mut String) {
    s.push_str("!");
}
```


所有権は移動せずに、変数の値を書き換えできるが、同時に渡せるのはひとつだけで、不変参照も同時にはできない。

---

## 所有権 <a id="ownership" data-name="所有権"></a>

- ヒープに確保された変数は他の変数への代入、関数の呼び出しによって所有権がムーブされる。
    ```rust
    let s1 = String::from("hello");
    let s2 = s1; // helloの所有権がムーブ

    // println!("{s1}") // error!
    ```
















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

---


#### println!

<pre><code class="tips">println!は第1引数に文字列を指定する必要がある。</code></pre>
