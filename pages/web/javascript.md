---
title: JavaScript
layout: default
---

# JavaScript <a id="top" data-name="TOP"></a>

- 拡張子は**.js**
- **命名規則**
    - 変数名、関数名は、最初の単語は小文字で始まり、2単語目以降は大文字始まりの**キャメルケース**。
    - class、コンストラクタは単語の1文字目が大文字の**パスカルケース**。
    - 定数名は、すべて大文字で**アンダースコア(_)**で単語をつなぐ**スネークケース**。
    - ブーリアン値はis, has, canで始めることにより何を意味するかを理解しやすくする。
    - 関数名などアクションを表す変数は動詞で始まることにより、どのようなアクションを実行するのかが明示的にする。
- 文の最後には**セミコロン(;)**を付ける。
- **// コメント**
- **/* コメント * /**

---

## 変数 <a id="variable" data-name="変数"></a>

変数の宣言は`キーワード 変数名 = 初期値;`キーワードは以下の通り

| キーワード | 意味                                               |
| ---------- | -------------------------------------------------- |
| `let`      | 値の再代入ができる変数の宣言。                     |
| `const`    | 一度値を代入したら返納できな変数の宣言。           |
| `var`      | JavaScriptで古くから使われる宣言で現在は使わない。 |

- 変数を初期化せずに宣言のみを行った場合、その変数は`undefined`となる。

---

## 演算子 <a id="operator" data-name="演算子"></a>

### 算術演算子

| 記号 | 説明           | 例        | 結果        |
| ---- | -------------- | --------- | ----------- |
| `+`  | 加算           | `6 + 9`   | `15`        |
| `-`  | 減算           | `20 - 15` | `5`         |
| `*`  | 乗算           | `3 * 7`   | `21`        |
| `/`  | 除算           | `10 / 5`  | `2`         |
| `%`  | 剰余           | `7 * 3`   | `1`(余り1)  |
| `**` | べき乗         | `3 ** 2`  | `9`(3の2乗) |
| `++` | インクリメント | `5++`     | `6`         |
| `--` | デクリメント   | `5--`     | `4`         |

### 代入演算子

| 記号                       | 説明               | 例                                                         | 結果    |
| -------------------------- | ------------------ | ---------------------------------------------------------- | ------- |
| `=`                        | 代入               | `a = 10`                                                   | `10`    |
| `+=`                       | 加算の自己代入     | `let a = 10;`<br>`a += 2;`                                 | `12`    |
| `-=`                       | 減算の自己代入     | `let a = 10;`<br>`a -= 2;`                                 | `8`     |
| `/=`                       | 除算の自己代入     | `let a = 10;`<br>`a /= 2;`                                 | `5`     |
| `*=`                       | 乗算の自己代入     | `let a = 10;`<br>`a *= 2;`                                 | `20`    |
| `%=`                       | 余算の自己代入     | `let a = 10;`<br>`a %= 3;`                                 | `1`     |
| `**=`                      | べき乗の自己代入   | `let a = 10;`<br>`a **= 2;`                                | `100`   |
| `&&=`                      | 論理積の自己代入   | `let a = true;`<br>`a && false;`                           | `false` |
| <code>&#124;&#124;=</code> | 論理和の自己代入   | `let a = true;`<br>`a `<code>&#124;&#124;=</code>` false;` | `true`  |
| `??=`                      | Null合体の自己代入 | `let a = null;`<br>`a ??= "初期値";`                       | 初期値  |

### 比較演算子

| 記号     | 説明                         | 例                       | 結果              |
| -------- | ---------------------------- | ------------------------ | ----------------- |
| `==`     | 値が等しいことを確認         | `1 == "1"`<br>`1 == 1`   | `true`<br>`true`  |
| `===`    | 値と型が等しいことを確認     | `1 === "1"`<br>`1 === 1` | `false`<br>`true` |
| `!=`     | 値が等しくないことを確認     | `1 != "1"`<br>`1 != 2`   | `false`<br>`true` |
| `!==`    | 値と型が等しくないことを確認 | `1 !== "1"`<br>`1 !== 1` | `true`<br>`false` |
| `A < B`  | AがBより小さいことの確認     | `1 < 2`<br>`1 < 1`       | `true`<br>`false` |
| `A > B`  | AがBより大きいことの確認     | `2 > 1`<br>`1 > 1`       | `true`<br>`false` |
| `A <= B` | AがB以下であることの確認     | `1 <= 2`<br>`2 <= 2`     | `true`<br>`true`  |
| `A >= B` | AがB以上であることの確認     | `2 >= 1`<br>`2 >= 2`     | `true`<br>`true`  |

### 論理演算子

| 記号                      | 説明                                                                                     | 例                                                                                                                               | 結果                         |
| ------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `&&`                      | 論理積(AND)を表す<br>A && Bの場合、AかつBの条件                                          | `true && true`<br>`true && false`<br>`false && false`                                                                            | `true`<br>`false`<br>`false` |
| <code>&#124;&#124;</code> | 論理和(OR)を表す<br>A <code>&#124;&#124;</code> Bの場合、AまたはBの条件                  | `true `<code>&#124;&#124;</code>` true`<br>`true `<code>&#124;&#124;</code>` false`<br>`false `<code>&#124;&#124;` false`</code> | `true`<br>`true`<br>`false`  |
| `!`                       | (NOT条件を表す)                                                                          | `!a`                                                                                                                             | `true`                       |
| `??`                      | Null合体演算子<br>代入の際に使われる演算子で、左辺が`null/undefined`なら右辺が代入される | `let a = null;`<br>`result = a ?? 10;`                                                                                           | `10`                         |

### ビット演算子

| 記号                | 説明                                                                                             | 例                                           | 結果         |
| ------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------- | ------------ |
| `&`                 | 論理積(AND)を表す<br>両方のビットが1の時に1                                                      | `5 & 3 (0b101 & 0b011)`                      | `1`          |
| <code>&#124;</code> | 論理和(OR)を表す<br>どちらかのビットが1の時に1                                                   | <code>5 &#124; 3 (0b101 &#124; 0b011)</code> | `7`          |
| `^`                 | 排他的論理和(XOR)を表す<br>片方が1の時に1                                                        | `5 ^ 3 (0b101 ^ 0b011)`                      | `6`          |
| `~`                 | ビット反転(NOT)を表す<br>各ビットを反転する                                                      | `~5`                                         | `-6`         |
| `<<`                | 左シフト<br>指定回数だけ左にビットをずらす(0埋めされる)                                          | `5 << 1`                                     | `10`         |
| `>>`                | 符号あり右シフト<br>指定回数だけ右にビットをずらす(符号ビットは維持)                             | `-5 >> 1`                                    | `-3`         |
| `>>>`               | 符号なし右シフト<br>指定回数だけ右にビットをずらす(符号ビットは無視されるので常に正の整数となる) | `-5 >>> 1`                                   | `2147483645` |

### 型関連・その他演算子

| 記号         | 説明                                                                                                                                        | 例                                                | 結果              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------- |
| `typeof`     | 型を返す                                                                                                                                    | `typeof 1`                                        | `number`          |
| `instanceof` | オブジェクトが特定のクラスやコンストラクタのインスタンスかどうかを判定する<br>プリミティブ型はオブジェクトと異なるため`false`となる点に注意 | `let arr = [1, 2, 3];`<br>`arr instanceof Array;` | `true`            |
| `in`         | オブジェクトや配列に、特定のプロパティやインデックスが存在するかどうかを判定する                                                            | `"val" in {val: 1}`<br>`"noVal" in {val: 1}`      | `true`<br>`false` |
| `delete`     | オブジェクトのプロパティや配列の要素を削除する<br>`delete`は、配列の要素を削除しても長さ(length)は変わらない                                | `let obj = {a: 1, b: 2};`<br>`delete obj.a;`      | `{b: 2}`          |

### 条件(三項)演算子

| 記号                        | 説明   | 例                                           | 結果   |
| --------------------------- | ------ | -------------------------------------------- | ------ |
| `condition ? expr1 : expr2` | 条件式 | `(1 === 1) ? result = true : result = false` | `true` |


### 展開・結合・スプレッド系(ES6以降)

| 記号  | 説明                                         | 例                                                                                     | 結果                     |
| ----- | -------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------ |
| `...` | スプレッド構文(展開)<br>配列に使う例         | `const arr1 = [1,2];`<br>`const arr2 = [3,4];`<br>`const merged = [...arr1, ...arr2];` | `[1,2,3,4]`              |
| `...` | スプレッド構文(展開)<br>オブジェクトに使う例 | `const user = {name:"Alice", age:25};`<br>`const updated = {...user, age:30};`         | `{name:"Alice", age:30}` |
| `...` | レスト構文(まとめる)<br>関数の引数で使う例   | `function f(...args) {return args;}`<br>`f(1, 2, 3 ,4);`                               | `[1, 2, 3, 4]`           |
| `...` | レスト構文(まとめる)<br>分割代入で使う例     | `const [first, ...rest] = [10, 20, 30, 40];`<br>`rest;`                                | `[20, 30, 40]`           |
| `+`   | 文字列結合                                   | `"a" + "b"`または<br><code>\`a${b}\`</code>                                            |                          |

### オプショナルチェイニング

`左側の値?.` と書くと、左側の値が null または undefined だった場合、続きを読まずに undefined を返す。

```javascript
user?.profile?.name

const name = response.data?.user?.name // 無ければ undefined が入る

arr?.[0] // 配列でも

callback?.() // 関数でも使える。あれば実行
```

### null 合体演算子

`左側の値 ?? '値がない'` と書くと、左側の値が null または undefined だった場合 右側の値を採用する。

```javascript
props.dataList?.[i]?.clientCode ?? ''
```

---

## エスケープシーケンス <a id="escape-sequences" data-name="エスケープシーケンス"></a>

| エスケープシーケンス | 意味                                    |
| -------------------- | --------------------------------------- |
| `\b`                 | バックスペース                          |
| `\t`                 | 水平タブ                                |
| `\v`                 | 垂直タブ                                |
| `\n`                 | 改行                                    |
| `\r`                 | 復帰                                    |
| `\f`                 | 改ページ                                |
| `\"`                 | ダブルクォート                          |
| `\'`                 | シングルクォート                        |
| `\\`                 | バックスラッシュ                        |
| `\0`                 | NULL文字                                |
| `\xXX`               | 2桁の16進数が表すLatin-1文字            |
| `\uXXXX`             | 4桁の16進数が表すUnicode文字            |
| `\u{XXXXXX}`         | 16進数のコードポイントが表すUnicode文字 |

---

## データ型 <a id="data-types" data-name="データ型"></a>

| データ型  | 値           | 説明                                                                    |
| --------- | ------------ | ----------------------------------------------------------------------- |
| String    | 文字列       | シングルクォート(')、ダブルクォート(")、バッククォート(`)で囲んだ文字列 |
| Number    | 数値         | 整数または浮動小数点数                                                  |
| BigInt    | 巨大な整数   | 任意の大きさの整数値。数値の末尾にnを付けることでBigIntとして定義できる |
| Boolean   | 真偽値       | true/false                                                              |
| null      | ヌル         | 値が空(存在しない)ことを表す                                            |
| undefined | 未定義       | 値が未定義であることを表す                                              |
| Symbol    | シンボル     | 一意で不変な値                                                          |
| object    | オブジェクト | キーと値を対で格納する入れ物                                            |
| class     | クラス       | インスタンス化して使用するための設計図                                  |

### 明示的型変換

| 関数          | 用途               | 例                                                                      | 結果                       |
| ------------- | ------------------ | ----------------------------------------------------------------------- | -------------------------- |
| `Number(値)`  | 数値へ変換する     | `Number("1")`<br>`Number("hello")`<br>`Number(true)`<br>`Number(false)` | `1`<br>`NoN`<br>`1`<br>`0` |
| `Boolean(値)` | 真偽値へ変換する   | `Boolean(1)`<br>`Boolean(0)`                                            | `true`<br>`false`          |
| `String(値)`  | 文字列へ変換する   | `String(1)`<br>`String(true)`                                           | `"1"`<br>`"true"`          |
| `BigInt(値)`  | BigInt型へ変換する | `BigInt("20)`<br>`BitInt(true)`                                         | `20n`<br>`1n`              |

### as <span class="label">TS</span>

これも TS の型変換。

```javascript
const el = document.querySelector('#app') as HTMLDivElement
```

### type <span class="label">TS</span>

型定義で何でも表現できる。実態はない。interface はオブジェクト向き。

```javascript
interface User {
  name: string
}

type ID = string | number

type Point = [number, number]
```

### interface <span class="label">TS</span>

こういう形のオブジェクトだという型定義。実態はない。

```javascript
interface User {
  name: string
  age: number
}
```

### enum <span class="label">TS</span>

列挙型。

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

ただし最近は定数が好まれがち。

```typescript
const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down'
} as const
```

### declare <span class="label">TS</span>

存在することにする定義で、実際はどこかにある前提。

```typescript
declare const VERSION: string
```

### 文字列(String) <a id="string" data-name="文字列"></a>


### 配列 <a id="array" data-name="配列"></a>

#### 生成

##### Array.from(arrayLike[, mapFunc, [thisArg]])

String, Set, Mapなどの配列ライクなオブジェクトや反復可能オブジェクトから新しい配列を生成する。

```javascript
const str = "ABC";
const arr1 = Array.from(str);
console.log(arr1);                  // ['A', 'B', 'C']

const set = new Set([123, "ABC"]);
const arr2 = Array.from(set);
console.log(arr2);                  // [123, 'ABC']

const map = new Map([[1, 2], [2, 4], [4, 8]]);
const arr3 = Array.from(map);
console.log(arr3);                  // [[1, 2], [2, 4], [4, 8]]
```

mapFunc は、配列を作成する際に各要素に対して実行されるマップ関数。<br>
thisArg にはマップ関数で this で参照される値を指定する。

```javascript
const arr = Array.from([1, 2, 3], (x) => x * 2);
console.log(arr); // [2, 4, 6]
```

##### new

new は古い書き方で、今ではあまり使われない。

```javascript
const arr1 = new Array();     // 要素が0個の配列を作成
const arr2 = new Array(3);    // 要素が3個の空配列を作成
const arr3 = new Array("Red", "Green", "Blue"); // const arr3 = ["Red", "Green", "Blue"]と等価
```

##### Array.fromAsync()

ES2026 で追加された、非同期反復可能オブジェクトを配列に変化するメソッド。

```javascript
 async function* myRange(n) {
  for (let i = 0; i < n; i++) {
    yield i * 2;
  }
}
const arr = await Array.fromAsync(myRange(4));
console.log(arr); // [0, 2, 4, 6]
```

#### 配列の長さ

```javascript
const arr = ["Red", "Green", "Blue"];
console.log(arr.length); // 3
```

#### 配列のループ

配列に対して for in とすると、添え字 (index) が取得できる。

```javascript
const colors = ["Red", "Green", "Blue"];
for (let i = 0; i < arr.length; i++) { // i は index
  console.log(colors[i]); // => "Red", "Green", "Blue"
}
```

for ob とすると、要素を取得できる。

```javascript
const colors = ["Red", "Green", "Blue"];
for (let color of colors) {
  console.log(color); // => "Red", "Green", "Blue"
}
```

#### array.forEach(callback[, this])

配列の各要素を引数にして callback を実行する。<br>
callback の引数には、要素値 (value) 、 インデックス (index) 、 配列自体 (array) が渡される。引数は順不同だが省略は可能。

```javascript
const arr = ["Red", "Green", "Blue"];
arr.forEach((value, index, array) => {
  console.log(value);
});
```

#### entries(), keys(), values()

配列に対して、entries() は key と value からなるイテレータ、keys() は key のみからなるイテレータ、values() は value のみからなるイテレータを返す。

```javascript
const arr = ["Red", "Green", "Blue"];
for (let elem of arr.entries()) {
  console.log(elem[0] + ":" + elem[1]); // "0:Red", "1:Green", "2:Blue"
}
for (let key of arr.keys()) {
  console.log(key); // 0, 1, 2
}
for (let value of arr.values()) {
  console.log(value); // "Red", "Green", "Blue"
```

#### array.map(callback[, this])

配列の各要素に対して callback を実行し、callback の戻り値からなる配列を返す。

```javascript
const arr1 = [2, 4, 6]
const arr2 = arr1.map((value, index, key) => value * 2);
console.log(arr2) // [4, 8, 12]
```




















### 数値(Number)

| 名称   | 表現形式                                                  | JavaScriptでの表記例 |
| ------ | --------------------------------------------------------- | -------------------- |
| 10進数 | 0~9の10種類の数字で数値を表現                             | 1234, 0.5, .5        |
| 2進数  | 0, 1の2種類の数字で数値を表現                             | 0b11, 0B11           |
| 8進数  | 0~7の8種類の数字で数値を表現                              | 0o111, 0O11, 011     |
| 16進数 | 0~9の10種類の数字とA~Fの6種類のアルファベットで数値を表現 | 0xF2, 0XF2           |

### オブジェクト(Object)

```javascript
const obj = {
    strProp: "文字列", // キーと値はコロン(:)で区切る
    intProp: 123, // キーと値のペア同士はカンマ(,)で区切る
    objectProp: {
        subProp1: "値", // オブジェクトはオブジェクトやメソッドを内包できる
        subProp2: "値"
    },
    intProp: 456, // キーが重複した場合はあとに定義したもので上書きされる
    boolProp: false, // 最後のカンマは省略可能
};
```

- オブジェクトのメソッド定義

```javascript
let person = {
    hello: function() { console.log("こんにちは"); }
};
// または、ES6より記述できる記法
let person = {
    hello() { console.log("こんにちは"); }
};
```

- オブジェクトの静的メソッド

| メソッド                 | 説明                                                           |
| ------------------------ | -------------------------------------------------------------- |
| `Object.keys(object)`    | objectのキーを配列で返す                                       |
| `Object.values(object)`  | objectの値を配列で返す                                         |
| `Object.entries(object)` | objectのキーと値を`[[キー1, 値1], [キー2, 値2],...]`の形で返す |


### クラス(class)
<pre><code class="tips">// オブジェクトやクラスのプロパティ、メソッドなどへのアクセスは、ドット記法またはブラケット記法を使う。
person.name; // ドット記法の場合、プロパティ名を直接指定する必要がある
person["name"]; // ブラケット記法はプロパティ名を文字列で指定する

Name = "name";
person[Name]; // 変数による動的なアクセスもできる
person["phone-no"] // 記号などプロパティ名で指定できないものを含む場合はブラケット記法で記述する</code></pre>

### extends

クラス継承 (JS)

```javascript
class Animal {}
class Dog extends Animal {}
```

interface 拡張 (TS)

```typescript
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}
```


---

## import <a id="import" data-name="import"></a>

import は外部からオブジェクトなどを取り込む仕組み。

### import

```javascript
// 特定のオブジェクトを import する場合は {} が必要
import { name, hello } from './file'

// default export だったり、単独の要素は {} は不要
import App from './App'
```

### export

モジュールの中の変数や関数、クラスやオブジェクトなどを外部のファイルからでも使えるように公開する仕組み。

```javascript
// 名前付き export
export const pi = 3.14;
export function add(a, b) {
  return a + b;
}

// デフォルトエクスポート (メインとなる部品を1つだけ公開)
export default class User {
  constructor(name) {
    this.name = name;
  }
}
```

### type <span class="label">TS</span>

型だけを読み込む仕組み。実行時には含まれない。

```javascript
import type { User } from './types'
```

---

## 関数 <a id="function" data-name="関数"></a>

### 関数の定義

- アロー式

```javascript
() => {}
```

ES6でサポートされた比較的モダンな書き方で this の扱いが function と異なり、

- function は誰が読んだか (呼び出し方) で this が決まる (動的)
- アロー関数はどこに書いたか (定義場所) で this が決まる (静的)

```javascript
// 一般的な書き方
(arg1, arg2) => { return arg1 + arg2; }

// { } を省略すると return 文とみなす
(arg1, arg2) => arg1 + arg2

// { } 省略でオブジェクトを返却する場合は () でくくる
(arg1, arg2) => ({"x": arg1, "y": arg2})

// 引数が1個の場合は ( ) を省略可能
arg1 => { return arg1 * 2; }

// 引数が0個の場合は ( ) が必要
() => { return 10; }

// 可変引数をサポート
(x, y, z, ...rest) => { ... }

// デフォルト引数をサポート
(file, mode = "r") => { ... }
```

- 関数宣言

```javascript
function 関数名 () {}
```

- 関数式

```javascript
const 関数名 = function() {}
```

---

<a id="async" data-name="非同期"></a>

## 非同期

- コールバック関数

```javascript
setTimeout(() => {
    console.log(3);
    setTimeout(() => {
        console.log(2);
        setTimeout(() => {
            console.log(1);
        }, 1000);
    }, 1000);
}, 1000);
```

- Promise

```javascript
new Promise(resolve => {
    setTimeout(() => {
        console.log(3);
        resolve();
    }, 1000)
}).then(() => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(2);
            resolve();
        }, 1000);
    });
}).then(() => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(1);
            resolve();
        }, 1000);
    });
});
```

- async/await

```javascript
func = async () => {
    await log(3);
    await log(2);
    await log(1);
};

log = (num) => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(num);
            resolve();
        }, 1000);
    });
}

func();
```








---



## 制御構文 <a id="control-syntax" data-name="制御構文"></a>

### if文

```javascript
if (条件式) {
    ifブロック;
}
```

```javascript
if (条件式) {
    ifブロック;
} else {
    elseブロック;
}
```

```javascript
if (条件式) {
    ifブロック;
} else if (条件式) {
    elseifブロック;
}
```

### for文

```javascript
for (let i=0; i<5; i++) {
    処理;
}
```

- for...in文

```javascript
for (const key in object) {
    オブジェクトの各プロパティに対する処理;
}
```

- for...of文

```javascript
for (const value of iterable) {
    反復可能オブジェクトの各要素に対する処理;
}
```

### while文

```javascript
while (条件式) {
    whileブロック;
}
```

### switch文

```javascript
switch (条件式) {
    case 値1:
        条件式が値1の場合の処理;
        break;
    case 値2:
        条件式が値2の場合の処理;
        break;
    default:
        条件式が一致しない場合の処理;        
}
```






---

## 例外処理 <a id="error-handling" data-name="例外処理"></a>

- 基本構文

```javascript
try {
    例外が発生する可能性のある処理;
} catch (例外識別子) {
    例外が発生したときの処理;
} finally {
    例外の発生の有無にかかわらず必ず実行される処理;
}
```

- 明示的な例外のスロー

```javascript
try {
    throw 例外識別子;
} catch (例外識別子) {
    例外が発生したときの処理;
}
```

---

## メソッド <a id="methods" data-name="メソッド"></a>

### 配列系

#### sort

```javascript
const users = [
  { name: "B" },
  { name: "A" }
]

users.sort((a, b) => {
  return a.name.localeCompare(b.name)
})
```

#### slice

一部切り出し。指定した範囲 (start, end) をコピーして返す。

```javascript
const first3 = items.slice(0, 3)
```

#### flatMap

map + flatten。

```javascript
const result = users.flatMap(
  user => user.tags
)
```

#### map

配列を変換する。

```javascript
const nums = [1, 2, 3]

const doubled = nums.map(n => n * 2)

console.log(doubled) // [2, 4, 6]
```

Vue の検索 UI での使用例。

```javascript
const filtered = users.value.filter(
  u => u.name.includes(keyword.value)
)
```

#### find

最初の1件だけ取得。

```javascript
const user = users.find(u => u.id === 10)
```

#### some

1件でも条件を満たすか。

```javascript
const hasAdmin = users.some(u => u.role === "admin")
```

#### every

全部条件を満たすか。

```javascript
const allChecked = items.every(i => i.checked)
```

#### reduce

集計。

```javascript
const total = prices.reduce(
  (sum, price) => sum + price,
  0
)
```

### 文字列系

#### includes

含まれているか。

```javascript
"hello".includes("ell")
```

#### startsWith, endsWith

特定の文字か文字列で始まるか、終わるか。

```javascript
const str = "Hello World";
console.log(str.startsWith("Hello")); // true
console.log(str.startsWith("World")); // false

console.log(str.endsWith("World")); // true
console.log(str.endsWith("Hello")); // false
```

#### trim

前後の空白を除去。

 ```javascript
 input.trim()
 ```

#### join

指定したデリミタ(区切り文字)で要素を連結して返す Arrayインスタンスのメソッド。<br>
引数を省略するとカンマ(,)で区切られる。

```javascript
const fruits = ['りんご', 'みかん', 'バナナ'];
console.log(fruits.join()); // 出力: "りんご,みかん,バナナ"

const words = ['J', 'A', 'V', 'A'];
console.log(words.join('')); // 空文字指定でくっつく
// 出力: "JAVA"

const array = ['A', null, 'B', undefined, 'C'];
console.log(array.join('-')); // null, undefinedは無視される
// 出力: "A--B--C"

const lines = ['一行目', '二行目'];
console.log(lines.join('\n')); // 改行で区切る
```

#### split

指定したデリミタ(区切り文字)で文字列を分割して、配列として返す。<br>
引数を省略すると分割されずに返る。

```javascript
const text = 'こんにちは';
console.log(text.split()); 
// 出力: ["こんにちは"]

const text = 'HTML';
console.log(text.split('')); // 空文字指定で1文字ずつ
// 出力: ["H", "T", "M", "L"]

const date = '2026/05/14';
console.log(date.split('/')); 
// 出力: ["2026", "05", "14"]
```

第2引数に整数を渡すと受け取る配列の最大要素数を制限できる。

```javascript
const text = 'りんご,みかん,バナナ,ぶどう';
console.log(text.split(',', 2)); 
// 出力: ["りんご", "みかん"] （3つ目以降は無視される）
```

### オブジェクト系

#### Object.keys

key一覧。

```javascript
const obj = {
  a: 1,
  b: 2
}

Object.keys(obj) // ["a", "b"]
```

#### Object.values

value一覧。

```javascript
Object.values(obj) // [1, 2]
```

#### Object.entries

Vue で便利。

```javascript
const object = {
  a: "some string",
  b: 42,
};

for (const [key, value] of Object.entries(object)) {
  console.log(`${key}: ${value}`);
}
// "a: some string"
// "b: 42"
```

### JSON系

#### JSON.stringify

オブジェクト -> JSON文字列へ。

```javascript
const json = JSON.stringify(user)
```

#### JSON.parse

JSON文字列 -> オブジェクトへ。

```javascript
const obj = JSON.parse(json)
```

---

## DOM <a id="dom" data-name="DOM"></a>

### window

<pre><code class="tips">windowに限り省略可能</code></pre>

---

### window.location

locationインターフェイスは、関連付けられたオブジェクトの場所(URL)を表す。変更が行われると、関連するオブジェクトに反映される。

<pre><code class="tips">window.locationおよびdocument.locationでアクセスできる。基本はwindowでアクセスする。</code></pre>

#### プロパティ

<span class="code-like">(例)https://example.org:8080/foo/bar?q=baz#bang</span>

| プロパティ | 説明                                                                    | 例の値                     |
| ---------- | ----------------------------------------------------------------------- | -------------------------- |
| href       | URL全体を含めた文字列。この値を変更すると新しいページへ移動する。       | 全体                       |
| host       | URLのホスト(ホスト名:ポート番号)。                                      | `example.org:8080`         |
| protocol   | 末尾の:を含むURLのプロトコルスキーム。                                  | `https:`                   |
| hostname   | URLのドメイン。                                                         | `example.org`              |
| port       | URLのポート番号。                                                       | `8080`                     |
| pathname   | 先頭の/に続いてパス部分が入ったもので、クエリやフラグメントを含めない。 | `/foo/bar`                 |
| search     | ?とそれに続く引数などのクエリ文字列。                                   | `?q=baz`                   |
| hash       | #とそれに続くフラグメント識別子。                                       | `#bang`                    |
| origin     | 特定の位置のオリジンの正規形(読み取り専用)。                            | `https://example.org:8080` |

#### メソッド

| メソッド              | 説明                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| location.assign(url)  | 引数で指定したURLのリソースを読み込む。                                                                                |
| location.reload()     | 再読み込みボタンのように現在のURLを再読み込みする。                                                                    |
| location.replace(url) | 現在のリソースを指定したURLのリソースで置き換える。assignとの違いはhistoryに保存されないことで、戻るボタンで戻れない。 |
| location.toString()   | URL全体を文字列で返す。location.href同様だが、値を変更するために使用できない。                                         |

---

### window.history

historyオブジェクトはブラウザのセッション履歴を操作するためのインターフェイス。

#### プロパティ

| プロパティ | 説明                                                           |
| ---------- | -------------------------------------------------------------- |
| length     | 現在読み込まれているページを含むセッション履歴の要素数を表す。 |


#### メソッド

<table>
    <tr>
        <th>メソッド</th>
        <th style="width: 600px;">説明</th>
    </tr>
    <tr>
        <td>history.pushState(stateObj, title, url)</td>
        <td>stateObj: 任意のJavaScriptオブジェクトで、後に<a href="#popstate">popstate</a>イベントで取り出せる。<br>nullかオブジェクトである必要がある。
        title: 無視される。<br>
        url: 相対または絶対パス(同一オリジンの必要あり)。<br>
        現在のページ履歴の次に新しい履歴エントリが追加される。戻るボタンで元のページに戻れる。ページの読み込みは行われない。
        </td>
    </tr>
    <tr>
        <td>history.replaceState(stateObj, title, url)</td>
        <td>引数はpushStateと同じ。現在の履歴エントリを上書きする。戻るボタンで上書き前の状態には戻れない。ページの読み込みは行われない。初期化やURLの修正(例:ハッシュやクエリ)などで履歴を汚さずに更新したい時や、何らかのユーザーのアクションを受け現在の履歴項目を更新したい場合に使う。</td>
    </tr>
    <tr>
        <td>history.back()</td>
        <td>ブラウザの戻るボタンを押したときの動作。</td>
    </tr>
    <tr>
        <td>history.forward()</td>
        <td>ブラウザの進むボタンを押したときの動作。</td>
    </tr>
    <tr>
        <td>history.go(n)</td>
        <td>現在のページから相対的な位置を指定して特定のページを読み込む。</td>
    </tr>
</table>


| メソッド                        | 説明                                                                                                        | 例  |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------- | --- |
| `window.alert(message)`         | アラートダイアログを表示して、スクリプトの実行を一時停止する。                                              |     |
| `window.confirm(message)`       | **"OK"**と **"キャンセル"**ボタンを持つダイアログを表示する。<br>それぞれ **"true"**と **"false"** を返す。 |     |
| `window.console.log(message)`   | コンソールに文字列を出力する。                                                                              |     |
| `window.console.error(message)` | コンソールにエラーメッセージを出力する。                                                                    |     |

---

### document

| メソッド                                | 説明                                                                                       | 例                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `document.getElementBuId("id")`         | idで要素を取得する。                                                                       |                                           |
| `document.getElementByName("name")`     | name属性で要素を取得する。                                                                 |                                           |
| `document.querySelector("selector")`    | **#id**、**.class**、**タグ名**などのCSSセレクターで検索して、最初に見つかった要素を返す。 |                                           |
| `document.querySelectorAll("selector")` | CSSセレクターで検索して、複数の要素を配列で返す。                                          |                                           |
| `document.createElement("element")`     | 新たに要素を作成する。                                                                     | `newDiv = document.createElement("div");` |

#### addEventListener

<table>
    <tr>
        <th>メソッド</th><th>説明</th>
    </tr>
    <tr>
        <td>element.addEventListener("イベント", 関数)</td><td>イベントの発生を検知して処理を呼び出す。</td>
    </tr>
</table>

- よく使用されるイベントは以下の通り。

| イベント名         | 説明                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `DOMContentLoaded` | `document.addEventListener("DOMContentLoaded", () => {})`<br>とするとDOMがすべて読み込まれてから関数が実行される。 |

<a id="popstate">

| イベント名 | 説明                                                                                                                                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popstate` | `window.addEventListener("popstate", (event) => {event.state;})`<br>とすることでpushStateまたはreplaceStateで指定したstateObjにアクセスできる。<br>コールバック関数にページを読み込む処理を記述する。 |

| イベント名    | 説明                                                       |
| ------------- | ---------------------------------------------------------- |
| `change`      | 変化があった                                               |
| `click`       | クリックされた(押して離す)                                 |
| `dblclick`    | ダブルクリックされた                                       |
| `mousedown`   | マウスのボタンが押された                                   |
| `mouseup`     | マウスのボタンが離された                                   |
| `mousemove`   | 要素上でマウスが動いた                                     |
| `mouseover`   | 要素にマウスが乗った                                       |
| `mouseout`    | 要素からマウスが離れた                                     |
| `contextmenu` | 右クリックが押された                                       |
| `keydown`     | キーが押された                                             |
| `keyup`       | キーが離れた                                               |
| `focus`       | 要素にフォーカスされた                                     |
| `blur`        | 要素のフォーカスが外れた                                   |
| `submit`      | フォームが送信された                                       |
| `change`      | 変化があった                                               |
| `load`        | スタイルシートや画像など全てのリソースの読み込みが完了した |
| `scroll`      | 画面がスクロールされた                                     |
| `reset`       | フォームがリセットされた                                   |
| `resize`      | 画面のサイズが変わった                                     |
| `select`      | テキストを選択した                                         |
| `input`       | 入力された                                                 |
| `copy`        | コピーされた                                               |
| `paste`       | ペーストされた                                             |

<pre><code class="tips">element.addEventListener("イベント", (event) => {}) // とすると関数の引数として発生したイベントを受け取ることができる。</code></pre>

#### preventDefault

| メソッド                 | 説明                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `event.preventDefault()` | デフォルトでイベントに割り当てられている動作(例えば右クリックでコンテキストメニューを開くなど)を防ぐことができる。 |

```javascript
const testButton = document.getElementById("test-button");
testButton.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});
```

#### ドキュメントの書き換え

| メソッド/プロパティ                                  | 説明                                                                                                                                                                                                                                     | 例                                                             |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `element.appendChild(element)`                       | 子要素として要素を追加する。                                                                                                                                                                                                             | `parentElm.appendChild(newDiv)`                                |
| `element.innerHTML`                                  | 要素の内容を書き換える。<br>ただし、HTMLタグを解釈して適用されるので、XSS攻撃のリスクがあるのでユーザーの入力などには使用しない。                                                                                                        | `element.innerHTML = "変更後の文字列"`                         |
| `element.textContent`                                | 要素の内容を書き換える。<br>HTMLタグを解釈せずに、すべてテキストとして扱われるのでXSSのリスクがない。                                                                                                                                    | `element.textContent = "変更後の文字列"`                       |
| `element.insertAdjacentHTML("挿入位置", "挿入内容")` | 指定した挿入位置に内容を挿入する。挿入位置の指定は以下の通り。<br>`beforebegin`: 要素の直前に挿入<br>`afterbegin`: 要素内部の、最初の子要素の前に挿入<br>`beforeend`: 要素内部の、最初の子要素の後に挿入<br>`afterend`: 要素の直後に挿入 | `	element.insertAdjacentHTML("beforeend", "<li>newItem</li>")` |

#### カスタムデータと属性へのアクセス

| メソッド/プロパティ                                  | 例                                                                                                                     | 説明                                      |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `element.dataset.データ名`                           | カスタムデータへのアクセス。<br>`data-user-name`と書いた場合、`element.dataset.userName`とキャメルケースに変換される。 | `value = element.dataset.name`            |
| `element.getAttribute("属性名")`                     | 指定した属性の値を取得する。                                                                                           | `value = element.getAttribute("data-id")` |
| `element.setAttribute("属性名", "値")`               | 値を変更する。                                                                                                         | `element.setAttribute("data-id", "456")`  |
| `element.classList.add("クラス名"[, クラス名, ...])` | 指定したクラスを要素に追加する。 複数指定可能。                                                                        | `element.classList.add("blue")`           |
| `element.removeAttribute("属性名")`                  | 属性を削除する。                                                                                                       | `element.removeAttribute("data-id")`      |
| `element.style.スタイル名`                           | CSSを変更する。                                                                                                        | `element.style.color = "red"`             |



---

## 実行方法 <a id="how-to-do-it" data-name="実行方法"></a>

- 外部ファイル: 拡張子を.jsとして別のファイルにコードを記述して、html側でscriptタグのsrc属性にパスを記述する。

```html
<script src="test.js"></script>
```

- **script**タグに直接記述する。

```html
<script>
    window.alert("hello!");
</script>
```

<pre><code class="caution">スクリプトファイルを読み込む位置によってはhtml文書が全て読み込まれる前にコードが実行されてしまい、<br>要素の取得ができないなどの理由でエラーとなる可能性があるため、以下のいずれかの対策をする必要がある。
<ul><li>&lt;script&gt;タグの属性にdeferを指定する。</li>
    <li>&lt;body&gt;タグの一番最後にスクリプトファイルを読み込む指定をする。</li>
    <li>document.addEventListener("DOMContentLoaded", () => {})</li></ul></code></pre>


## example <a id="example" data-name="example"></a>

#### よくあるformの例

<pre><code class="example">&lt;form id="login-form"&gt;
  &lt;input name="user"&gt;
  &lt;input name="password"&gt;
  &lt;button type="submit"&gt;ログイン&lt;/button&gt;
&lt;/form&gt;

const form = document.querySelector("#login-form");

form.addEventListener("submit", async (e) =&gt; {
  e.preventDefault();  // 通常送信を止める

  const formData = new FormData(form);

  await fetch("/login", {
    method: "POST",
    body: formData
  });
});</code></pre>