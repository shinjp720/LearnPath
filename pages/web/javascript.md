---
title: JavaScript
layout: default
---

# JavaScript <a id="top" data-name="TOP"></a>

- 拡張子は、JavaScript が **.js**、TypeScript が **.ts** である。
- **命名規則**
    - 変数名、関数名は、最初の単語を小文字で始め、2単語目以降の先頭を大文字にする**キャメルケース**。
    - クラス名、コンストラクタ名は、各単語の先頭を大文字にする**パスカルケース**。
    - 定数名は、すべて大文字にして、アンダースコア(_)で単語をつなぐ**アッパースネークケース**。
    - 真偽値の変数名は、is、has、can などで始めて、何を意味するかを理解しやすくする。
    - 関数名などアクションを表す名前は、動詞で始めて、どのようなアクションを実行するのかを明示的にする。
- 最近では、文末にセミコロン(;)を付けないルールも多い。
- `//` から行末まではコメントになる。
- `/* ... */` で囲んだ範囲は、複数行にまたがるコメントになる。

---

## 制御構文 <a id="control-syntax" data-name="制御構文"></a>

### if文

```javascript
if (条件式) {
    // ifブロック
}
```

```javascript
if (条件式) {
    // ifブロック
} else {
    // elseブロック
}
```

```javascript
if (条件式) {
    // ifブロック
} else if (条件式) {
    // else ifブロック
}
```

### for文

#### カウンタ式

```javascript
for (let i = 0; i < 5; i++) {
    // 処理
}
```

#### for...in文

オブジェクトのキーを1つずつ取り出して処理する。

```javascript
for (const key in object) {
    // オブジェクトの各プロパティに対する処理
}
```

<pre><code class="caution">配列に対して for...in を使うと、index が数値ではなく文字列で取得される、プロトタイプから継承された列挙可能なプロパティも対象になるなど、意図しない挙動になることがあるため使わない。
index が欲しい場合は entries() を使う。</code></pre>

#### for...of文

反復可能オブジェクト (配列、文字列、Map、Set など) の要素を1つずつ取り出して処理する。

```javascript
for (const value of iterable) {
    // 反復可能オブジェクトの各要素に対する処理
}
```

index や key も一緒に必要な場合は entries() を使う。配列とオブジェクトで書き方が異なる。

<pre><code class="example">const fruits = ['apple', 'banana', 'orange'];

// 分割代入で [index, value] を同時に受け取る
for (const [index, value] of fruits.entries()) {
  console.log(`${index}番目は${value}`);
}
// 0番目はapple
// 1番目はbanana
// 2番目はorange</code></pre>

<pre><code class="example">const user = { name: 'Taro', age: 25 };

// 分割代入で [key, value] を同時に受け取る
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}
// name: Taro
// age: 25</code></pre>

### while文

```javascript
while (条件式) {
    // whileブロック
}
```

### switch文

```javascript
switch (条件式) {
    case 値1:
        // 条件式が値1の場合の処理
        break;
    case 値2:
        // 条件式が値2の場合の処理
        break;
    default:
        // どの case にも一致しない場合の処理
}
```

<pre><code class="caution">case の末尾に break を書かないと、次の case の処理が続けて実行される (フォールスルー)。</code></pre>

---

## 変数 <a id="variable" data-name="変数"></a>

```
キーワード 変数名 = 初期値
```

| キーワード | 意味 |
| --- | --- |
| `let` | 値の再代入ができる変数の宣言。 |
| `const` | 再代入ができない変数の宣言。宣言時に必ず初期値を代入する。<br>プリミティブ型は値を変更できない。<br>オブジェクトは、参照先の再代入はできないが、プロパティの値は変更できる。 |
| `var` | JavaScript で古くから使われる宣言。<br>スコープが関数単位であることや、ホイスティングにより宣言前でも参照できてしまうことなどから、現在は使わない。 |

変数を初期化せずに宣言のみを行った場合 (`let`)、その変数は `undefined` となる。

### 分割代入

#### 配列の分割代入

先頭から順番に代入される。

```javascript
const colors = ['red', 'blue', 'green'];

// 配列なので [] を使う
const [first, second] = colors;

console.log(first);  // 'red'
console.log(second); // 'blue'
```

#### オブジェクトの分割代入

指定したキーに一致する値を取り出す。

```javascript
const user = { id: 101, name: 'Taro', age: 25 };

// オブジェクトなので {} を使う（プロパティ名と同じ変数名にする）
const { name, age } = user;

console.log(name); // 'Taro'
console.log(age);  // 25
```

```javascript
const users = [
  { id: 1, name: "太郎" },
  { id: 2, name: "花子" }
];

for (const { id, name } of users) {
  console.log(`ID: ${id}, 名前: ${name}`);
}
```

---

## 演算子 <a id="operator" data-name="演算子"></a>

### 算術演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `+` | 加算 | `6 + 9` | `15` |
| `-` | 減算 | `20 - 15` | `5` |
| `*` | 乗算 | `3 * 7` | `21` |
| `/` | 除算 | `10 / 5`| `2` |
| `%` | 剰余 | `7 % 3` | `1`(余り1) |
| `**` | べき乗 | `3 ** 2` | `9`(3の2乗) |
| `++` | インクリメント | `let a = 5;`<br>`a++;` | `a` は `6` |
| `--` | デクリメント | `let a = 5;`<br>`a--;` | `a` は `4` |

### 代入演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `=` | 代入 | `a = 10` | `10` |
| `+=` | 加算の自己代入 | `let a = 10;`<br>`a += 2;` | `12` |
| `-=` | 減算の自己代入 | `let a = 10;`<br>`a -= 2;` | `8` |
| `/=` | 除算の自己代入 | `let a = 10;`<br>`a /= 2;` | `5` |
| `*=` | 乗算の自己代入 | `let a = 10;`<br>`a *= 2;` | `20` |
| `%=` | 剰余の自己代入 | `let a = 10;`<br>`a %= 3;` | `1` |
| `**=` | べき乗の自己代入 | `let a = 10;`<br>`a **= 2;` | `100` |
| `&&=` | 論理積の自己代入 | `let a = true;`<br>`a &&= false;` | `false` |
| <code>&#124;&#124;=</code> | 論理和の自己代入 | `let a = true;`<br><code>a &#124;&#124;= false;</code> | `true` |
| `??=` | Null合体の自己代入 | `let a = null;`<br>`a ??= "初期値";` | `"初期値"` |

### 比較演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `==`     | 型変換を行ったうえで値が等しいことを確認         | `1 == "1"`<br>`1 == 1`   | `true`<br>`true`  |
| `===`    | 値と型が等しいことを確認     | `1 === "1"`<br>`1 === 1` | `false`<br>`true` |
| `!=`     | 型変換を行ったうえで値が等しくないことを確認     | `1 != "1"`<br>`1 != 2`   | `false`<br>`true` |
| `!==`    | 値と型が等しくないことを確認 | `1 !== "1"`<br>`1 !== 1` | `true`<br>`false` |
| `A < B`  | AがBより小さいことの確認     | `1 < 2`<br>`1 < 1`       | `true`<br>`false` |
| `A > B`  | AがBより大きいことの確認     | `2 > 1`<br>`1 > 1`       | `true`<br>`false` |
| `A <= B` | AがB以下であることの確認     | `1 <= 2`<br>`2 <= 2`     | `true`<br>`true`  |
| `A >= B` | AがB以上であることの確認     | `2 >= 1`<br>`2 >= 2`     | `true`<br>`true`  |

<pre><code class="tips">== と != は、型が異なる場合に自動で型変換を行ってから比較するため、意図しない結果になりやすい。基本は === と !== を使う。</code></pre>

### 論理演算子

| 記号   | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `&&` | 論理積(AND)を表す<br>A && Bの場合、AかつBの条件 | `true && true`<br>`true && false`<br>`false && false` | `true`<br>`false`<br>`false` |
| <code>&#124;&#124;</code> | 論理和(OR)を表す<br>A <code>&#124;&#124;</code> Bの場合、AまたはBの条件 | <code>true &#124;&#124; true</code><br><code>true &#124;&#124; false</code><br><code>false &#124;&#124; false</code> | `true`<br>`true`<br>`false` |
| `!` | 論理否定(NOT)を表す<br>真偽値を反転する | `!true`<br>`!false` | `false`<br>`true` |
| `??` | Null合体演算子<br>左辺が `null` または `undefined` の場合に右辺を採用する<br>(<code>&#124;&#124;</code> と異なり、`0` や空文字は左辺の値がそのまま採用される) | `let a = null;`<br>`result = a ?? 10;` | `10` |

### ビット演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `&` | ビット単位の論理積(AND)を表す<br>両方のビットが1の時に1 | `5 & 3 (0b101 & 0b011)` | `1` |
| <code>&#124;</code> | ビット単位の論理和(OR)を表す<br>どちらかのビットが1の時に1 | <code>5 &#124; 3 (0b101 &#124; 0b011)</code> | `7` |
| `^` | 排他的論理和(XOR)を表す<br>どちらか一方だけが1の時に1 | `5 ^ 3 (0b101 ^ 0b011)` | `6` |
| `~` | ビット反転(NOT)を表す<br>各ビットを反転する | `~5` | `-6` |
| `<<` | 左シフト<br>指定回数だけ左にビットをずらす(0埋めされる) | `5 << 1` | `10` |
| `>>` | 符号あり右シフト<br>指定回数だけ右にビットをずらす(符号ビットは維持) | `-5 >> 1` | `-3` |
| `>>>` | 符号なし右シフト<br>指定回数だけ右にビットをずらす(符号ビットは無視されるので常に正の整数となる) | `-5 >>> 1` | `2147483645` |

### 型関連・その他演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `typeof` <span class="label">JS</span> | 型を返す<br>実行時に評価され、返る値は以下の8種類のみ<br>object, number, string, boolean, <br>undefined, bigint, symbol, function<br>(`typeof null` は歴史的経緯により `"object"` を返す) | `typeof 1` | `number` |
| `typeof` <span class="label">TS</span> | 型を返す<br>TS では型の位置で使い、変数の型を型として取り出す<br>(型チェック時のみ動作し、実行時には残らない) | `typeof bob` | type User = {<br>name: string;<br>age: number;<br>} |
| `keyof` <span class="label">TS</span> | 型のキー名を文字列のユニオン型で返す | `keyof User` | <code>"name" &#124; "age"</code> |
| `instanceof` | オブジェクトが特定のクラスやコンストラクタの<br>インスタンスかどうかを判定する<br>プリミティブ型はオブジェクトではないため `false` となる点に注意 | `let arr = [1, 2, 3];`<br>`arr instanceof Array;` | `true` |
| `in` | オブジェクトや配列に、特定のプロパティやインデックスが<br>存在するかどうかを判定する | `"val" in {val: 1}`<br>`"noVal" in {val: 1}`| `true`<br>`false` |
| `delete` | オブジェクトのプロパティや配列の要素を削除する<br>`delete` は、配列の要素を削除しても長さ(length)は変わらない | `let obj = {a: 1, b: 2};`<br>`delete obj.a;` | `obj` は `{b: 2}` |

<pre><code class="tips">オブジェクトからキー名を導く <span class="label">TS</span>
keyof typeof bob; // "name" | "age"</code></pre>

### 条件(三項)演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `condition ? expr1 : expr2` | 条件式 ? 真の時 : 偽の時 | `(1 === 1) ? true : false` | `true` |

### 展開・結合・スプレッド系 (ES2015 以降)

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `...` | スプレッド構文(展開)<br>配列に使う例 | `const arr1 = [1,2];`<br>`const arr2 = [3,4];`<br>`const merged = [...arr1, ...arr2];` | `[1,2,3,4]` |
| `...` | スプレッド構文(展開)<br>オブジェクトに使う例 | `const user = {name:"Alice", age:25};`<br>`const updated = {...user, age:30};` | `{name:"Alice", age:30}` |
| `...` | レスト構文(まとめる)<br>関数の引数で使う例 | `function f(...args) {return args;}`<br>`f(1, 2, 3, 4);` | `[1, 2, 3, 4]` |
| `...` | レスト構文(まとめる)<br>分割代入で使う例 | `const [first, ...rest] = [10, 20, 30, 40];`<br>`rest;` | `[20, 30, 40]` |
| `+` | 文字列結合 | `"a" + "b"` | `"ab"` |

<pre><code class="tips">スプレッド構文・レスト構文は、配列では ES2015、オブジェクトでは ES2018 から使える。</code></pre>

### オプショナルチェイニング

`左側の値?.` と書くと、左側の値が `null` または `undefined` だった場合、続きを評価せずに `undefined` を返す。

```javascript
user?.profile?.name

const name = response.data?.user?.name // 無ければ undefined が入る

arr?.[0] // 配列でも使える

callback?.() // 関数でも使える (あれば実行する)
```

### Null合体演算子

`左側の値 ?? '値がない'` と書くと、左側の値が `null` または `undefined` だった場合に、右側の値を採用する。<br>
`||` と異なり、`0` や `''` (空文字)、`false` は左側の値がそのまま採用される。

```javascript
props.dataList?.[i]?.clientCode ?? ''
```

---

## データ型 <a id="data-types" data-name="データ型"></a>

### プリミティブ型

JavaScript における型は大別して、プリミティブ型の7種類とオブジェクト型に分けられる。<br>
プリミティブ型か否かによって挙動が変わることがあるので理解しておく必要がある。

1. **文字列 (`string`)**
2. **数値 (`number`)**
3. **真偽値 (`boolean`)**
4. **`null`**
5. **`undefined`**
6. **BigInt (巨大な整数)**
7. **Symbol (一意な識別子)**

### 型一覧

| データ型 | 値 | 説明 |
| --- | --- | --- |
| String | 文字列 | シングルクォート(')、ダブルクォート(")、バッククォート(`)で囲んだ文字列 |
| Number | 数値 | 整数または浮動小数点数 |
| Boolean | 真偽値 | true/false |
| null | ヌル | 意図的に値が存在しないことを表す |
| undefined | 未定義 | 値がまだ代入されていない (未定義である) ことを表す |
| BigInt | 巨大な整数 | 任意の大きさの整数値。数値の末尾に `n` を付けることで BigInt として定義できる |
| Symbol | シンボル | 一意で不変な値 |
| object | オブジェクト | キーと値を対で格納する入れ物。配列や関数などもオブジェクトの一種 |

### 数値(Number)

| 名称 | 表現形式 | JavaScriptでの表記例 |
| --- | --- | --- |
| 10進数 | 0~9の10種類の数字で数値を表現 | 1234, 0.5, .5 |
| 2進数 | 0, 1の2種類の数字で数値を表現 | 0b11, 0B11 |
| 8進数 | 0~7の8種類の数字で数値を表現 | 0o111, 0O111 (先頭が 0 のみの `0111` は旧記法で、strict モードではエラー) |
| 16進数 | 0~9の10種類の数字とA~Fの6種類のアルファベットで数値を表現 | 0xF2, 0XF2 |

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
const person = {
    hello: function() { console.log("こんにちは"); }
};
// または、ES2015 以降で使える省略記法
const person2 = {
    hello() { console.log("こんにちは"); }
};
```

- オブジェクトの静的メソッド

| メソッド | 説明 |
| --- | --- |
| `Object.keys(object)` | objectのキーを配列で返す |
| `Object.values(object)` | objectの値を配列で返す |
| `Object.entries(object)` | objectのキーと値を`[[キー1, 値1], [キー2, 値2],...]`の形で返す |

- プロパティへのアクセス

<pre><code class="tips">// オブジェクトやクラスのプロパティ、メソッドへのアクセスは、ドット記法またはブラケット記法を使う。
person.name; // ドット記法の場合、プロパティ名を直接指定する必要がある
person["name"]; // ブラケット記法はプロパティ名を文字列で指定する

const key = "name";
person[key]; // 変数による動的なアクセスもできる
person["phone-no"]; // プロパティ名に記号など識別子として使えない文字を含む場合は、ブラケット記法で記述する</code></pre>

### extends

クラス継承 <span class="label">JS</span>

```javascript
class Animal {}
class Dog extends Animal {}
```

interface 拡張 <span class="label">TS</span>

```typescript
interface Animal {
  name: string
}

interface Dog extends Animal {
  bark(): void
}
```

---

### 明示的型変換

| 関数 | 用途 | 例 | 結果 |
| --- | --- | --- | --- |
| `Number(値)` | 数値へ変換する | `Number("1")`<br>`Number("hello")`<br>`Number(true)`<br>`Number(false)` | `1`<br>`NaN`<br>`1`<br>`0` |
| `Boolean(値)` | 真偽値へ変換する | `Boolean(1)`<br>`Boolean(0)` | `true`<br>`false` |
| `String(値)` | 文字列へ変換する | `String(1)`<br>`String(true)` | `"1"`<br>`"true"` |
| `BigInt(値)` | BigInt型へ変換する | `BigInt("20")`<br>`BigInt(true)` | `20n`<br>`1n` |

### as <span class="label">TS</span>

TS の型アサーション (型の上書き)。コンパイル時にのみ働き、実行時の値は変換されない。

```typescript
const el = document.querySelector('#app') as HTMLDivElement
```

### type <span class="label">TS</span>

型に名前を付ける定義で、Union 型やタプルなど何でも表現できる。実体はなく、実行時には残らない。interface はオブジェクト向き。

```typescript
interface User {
    name: string
}

type ID = string | number
type State = "success" | "error" | "loading"
type Point = [number, number]
```

### interface <span class="label">TS</span>

「こういう形のオブジェクトである」という型定義。実体はなく、実行時には残らない。

```typescript
interface User {
    name: string
    age: number
}
```

基本は interface で定義する (外部から拡張できるため)。<br>
Union 型や複雑な型ユーティリティを使うときだけ type で定義する。

<pre><code class="tips">同名で宣言した場合、
interface はプロパティが統合 (マージ) される。
type はエラーとなる。</code></pre>

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

ただし最近は、`as const` を付けた定数オブジェクトで代用することが好まれる。

```typescript
const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down'
} as const
```

### declare <span class="label">TS</span>

コンパイラに「その変数や関数がどこかに存在する」と伝える宣言。実体は生成されず、型情報のみを与える。

```typescript
declare const VERSION: string
```

---

## 文字列(String) <a id="string" data-name="文字列"></a>

文字列はダブルクォート(")またはシングルクォート(')で囲んで表す。

### テンプレートリテラル

ES2015 から、文字列の中に変数や式を埋め込めるテンプレートリテラルが使えるようになった。<br>
バッククォート(\`)で文字列を囲み、`${...}` の中に変数や JavaScript の式を記述できる。また、改行がそのまま文字列に含まれるため、複数行の文字列も書ける。

```javascript
const name = "Yamada";
console.log(`ようこそ ${name} さん`);
```

#### String.raw

テンプレートリテラルに String.raw を付けると、&#92;n 等のエスケープシーケンスが解釈されず、そのまま文字として扱われるので、Windows のパスや正規表現のようにバックスラッシュ(&#92;)を多用する場合に便利。

```javascript
// 通常の文字列では、バックスラッシュを \\ と二重に書く必要がある
const path1 = "C:\\Users\\Desktop\\Project";

// エクスプローラーからコピペしたまま書ける
const path2 = String.raw`C:\Users\Desktop\Project`;
```

埋め込み変数は展開される。

```javascript
const name = "太郎";

// 変数は展開され \n はそのまま文字になる
const message = String.raw`こんにちは、${name}さん！\nいらっしゃいませ。`;
```

文字列の末尾にバックスラッシュ(&#92;)を置くと、閉じのバッククォートがエスケープされて構文エラーになる。<br>
かといって &#92;&#92; と書くと 2 文字のまま残るため、末尾のバックスラッシュだけ通常の文字列で連結する。

```javascript
const dir = String.raw`C:\Users\Desktop\Project` + "\\";
```

---

### マルチライン

"..." や '...' の行末にバックスラッシュ(&#92;)を付けると、ソースコード上で文字列を複数行に分けて書ける。<br>
この場合、文字列に改行は含まれないので、改行したい場合は &#92;n を書く。

```javascript
const str = "ERROR: 404\n\
File not found.";   // "ERROR: 404\nFile not found."
```

バッククォートで囲んだテンプレートリテラルなら、ソースコード上の改行がそのまま文字列に含まれる。

```javascript
const str = `ERROR: 404
File not found.`;   // "ERROR: 404\nFile not found."
```

---

### 文字列に変換

#### String(value)

value を文字列に変換する。

```javascript
const str = String(123);
```

---

### 文字列の長さ

#### str.length

UTF-16 のコードユニット数を返す。そのため、日本語を含む通常の文字は1文字を 1 と数えるが、サロゲートペア領域の文字 (絵文字や一部の漢字など) は1文字を 2 と数える。

```javascript
const str = "あいうえお";
console.log(str.length);  // 5
console.log("😀".length); // 2 (サロゲートペア)
```

---

### 文字列の部分取り出し

#### string.charAt(n)

string の n 番目の文字を返す。

```javascript
const str = "あいうえお";
str.charAt(2) // 'う'
```

#### string.at(n)

charAt() とほぼ同様だが、次の2点が異なる。

- 負数を指定すると、末尾からのインデックスになる。
- 範囲外のインデックスを指定した場合、charAt() は空文字を返すのに対して、at() は undefined を返す。

```javascript
const str = "あいうえお";
console.log(str.at(-1));     // 'お'
console.log(str.at(10));     // undefined
console.log(str.charAt(10)); // ''
```

#### `string.substring(from [, to])`

string の from 文字目から to-1 文字目の文字列を返す。<br>
to を省略すると残りすべて。<br>
負数や NaN は 0 として扱われる。from が to より大きい場合は、2つの値が入れ替えられる。

```javascript
console.log("ABCDEFG".substring(2, 4));  // "CD"
console.log("ABCDEFG".substring(2));     // "CDEFG"
```

#### `string.slice(from [, to])`

string の from 文字目から to-1 文字目の文字列を返す。<br>
負数を指定すると、後ろから数える点が substring と異なる。<br>
to を省略すると残りすべて。

```javascript
console.log("ABCDEFG".substring(-3, 6));  // "ABCDEF" (-3 は 0 として扱われる)
console.log("ABCDEFG".slice(-3, 6));      // "EF" (-3 は後ろから3文字目 = 4 として扱われる)
```

---

### 文字列の加工

#### `string.split([sep [, limit]])`

sep を区切り文字として string を分割し、その配列を返す。<br>
limit は配列の要素数を制限して、sep を省略すると string 全体をひとつの要素とする配列を返す。

```javascript
const t = "23:59:59".split(":");
console.log(`${t[0]}時${t[1]}分${t[2]}秒`); // "23時59分59秒"
```

```javascript
const str = 'Hello';

str.split()   // ['Hello']
str.split('') // ['H', 'e', 'l', 'l', 'o']
```

#### string.concat(str2, str3, ...)

string に str2, str3, ... を連結した文字列を返す。

```javascript
console.log("ABC".concat("DEF", "GHI"));  // "ABCDEFGHI"
```

#### string.repeat(n)

string を n 回繰り返した文字列を返す。

```javascript
console.log("ABC".repeat(3));  // "ABCABCABC"
```

#### string.trim()

string の前後のホワイトスペースを取り除いた文字列を返す。

#### string.trimStart()<br>string.trimEnd()

trimStart() は文字列の前方の、trimEnd() は後方のホワイトスペースを取り除いた文字列を返す。

#### string.toUpperCase()<br>string.toLowerCase()

toUpperCase() は大文字に、toLowerCase() は小文字に変換した文字列を返す。

```javascript
console.log("Japan".toUpperCase());   // "JAPAN"
console.log("Japan".toLowerCase());   // "japan"
```

#### `string.padStart(length[, str])`<br>`string.padEnd(length[, str])`

padStart() は文字列の前方に、padEnd() は文字列の後方に詰め物を入れる。<br>
length にはパディング後の全体の長さ、str にはパディングする文字を指定する。<br>
str を省略すると半角スペースでパディングする。string が length よりも長い場合は何も行わない。

```javascript
const str = "123";
console.log(str.padStart(5, "0"));      // => "00123"
console.log(str.padEnd(5, "_"));        // => "123__"
```

---

### 文字列の置換

#### string.replace(regexp, newString)

string の regexp で指定した正規表現 (または文字列) にマッチする部分文字列を newString に置き換えたものを返す。<br>
regexp に文字列を指定した場合はマッチした最初の1件のみ置換する。<br>
regexp に正規表現を指定した場合は<a href="#regex">フラグ</a>によって置換範囲を制御できる。

```javascript
console.log("This is a pen.".replace("pen", "book")); // "This is a book."
```

newString には $ で始まる特殊文字を使用することができる。

- $& はマッチした文字列全体
- $1〜$99 は正規表現中の (グループ) に対応する部分文字列
- $&#96; はマッチ部分より前の文字列 (string.slice(0, offset) と同じ)
- $' はマッチ部分より後ろの文字列 (string.slice(offset + match.length) と同じ)
- $$ は 記号としての $

```javascript
console.log("[23:59:59]".replace(/(\d+):(\d+):(\d+)/, "$1時$2分$3秒")); // "[23時59分59秒]"
// $&="23:59:59"  $1="23"  $2="59"  $3="59"
// $`="["  $'="]"  $$="$"
```

#### string.replace(regexp, function)

replace() の第2引数に関数を渡すこともでき、その際の関数に渡る引数は以下の通り。

- match: マッチした文字列の全体
- p1: 1つ目の (グループ) にマッチした文字列
- p2: 2つ目の (グループ) にマッチした文字列
- (グループ) が増えれば、p3, p4, ... と後ろに追加される
- offset: マッチした場所が全体の何文字目かのインデックス
- string: 検索をかけた文字列全体
- 名前付きキャプチャグループを使っている場合は、最後の引数に groups オブジェクトが追加される

```javascript
const date = "2026-05-25";

// カッコが2つなので引数は5つになる (後ろの引数が不要な場合は省略可能)
date.replace(/(\d{2})-(\d{2})$/, (match, p1, p2, offset, string) => {
  console.log(`全体: ${match}`);  // "05-25"
  console.log(`p1: ${p1}`);      // "05" （1つ目のカッコ）
  console.log(`p2: ${p2}`);      // "25" （2つ目のカッコ）
  console.log(`位置: ${offset}`); // 5  （"05-25" が始まる位置）
  return `${p1}月${p2}日`;
});
```

#### string.replaceAll(regexp, newString)

regexp に文字列を指定した場合、replaceAll() はすべて置換する。<br>
regexp に正規表現を指定した場合、グローバルオプション (/.../g) の指定が必須となる。

```javascript
console.log("AAA".replace(/A/g, "X"))      // XXX(全置換)
console.log("AAA".replace(/A/, "X"));      // XAA(1件置換)
console.log("AAA".replaceAll(/A/g, "X"))   // XXX(全置換)
console.log("AAA".replaceAll(/A/, "X"));   // TypeError (g フラグが必須)
```

---

### 文字列の検索

文字列の検索には正規表現の <a href="#matching">マッチング</a>もある。

#### `string.indexOf(key [, from])`

string の from 番目から後方に検索し、最初に key が現れた index を返す。<br>
見つからなかった場合は -1 を返す。

```javascript
console.log("ABCABC".indexOf("C"));    // 2
console.log("ABCABC".indexOf("C", 3)); // 5
```

#### `string.lastIndexOf(key [, from])`

string の from 番目から前方に検索し、最初に key が現れた index を返す。<br>
見つからなかった場合は -1 を返す。

```javascript
const filename = "www.example.com.png";
const n = filename.lastIndexOf(".");
console.log(filename.substring(n)); // .png
```

#### string.startsWith(str)<br>string.endsWith(str)<br>string.includes(str)

string と str の位置関係を判定する。<br>
includes() は str を含んでいるか、startsWith() は str で始まっているか、endsWith() は str で終わっているかを判定して、真偽値を返す。

```javascript
console.log("ABCDEFG".startsWith("ABC")); // true
console.log("ABCDEFG".endsWith("EFG"));   // true
console.log("ABCDEFG".includes("DEF"));   // true
```

---

### JSON との変換

#### JSON.parse(str)<br>JSON.stringify(obj)

parse() は JSON 文字列をオブジェクトに変換する。<br>
stringify() はオブジェクトを JSON 文字列に変換する。メソッド (関数) のプロパティは無視される。

```javascript
const str1 = '{"width":160, "height":120}';
const obj = JSON.parse(str1);
console.log(obj);  // {width: 160, height: 120}
const str2 = JSON.stringify(obj);
console.log(str2); // {"width":160,"height":120}
```

### 文字列のタグ付け (非推奨)

#### string.bold()<br>string.italics()<br>string.fixed()<br>string.big()<br>string.small()<br>string.blink()<br>string.strike()<br>string.sup()<br>string.sub()<br>string.fontcolor(color)<br>string.fontsize(size)<br>string.anchor(name)<br>string.link(url)

それぞれのタグで囲んだ文字列を返す。

<pre><code class="caution">これらのメソッドは非推奨 (Web 互換性のためだけに残されている機能) なので使わない。</code></pre>

```javascript
console.log("ABC".bold());             // <b>ABC</b>
console.log("ABC".italics());          // <i>ABC</i>
console.log("ABC".fixed());            // <tt>ABC</tt>
console.log("ABC".big());              // <big>ABC</big>
console.log("ABC".small());            // <small>ABC</small>
console.log("ABC".blink());            // <blink>ABC</blink>
console.log("ABC".strike());           // <strike>ABC</strike>
console.log("ABC".sup());              // <sup>ABC</sup>
console.log("ABC".sub());              // <sub>ABC</sub>
console.log("ABC".fontcolor("red"));   // <font color="red">ABC</font>
console.log("ABC".fontsize(7));        // <font size="7">ABC</font>
console.log("ABC".anchor("xxx"));      // <a name="xxx">ABC</a>
console.log("ABC".link("index.html")); // <a href="index.html">ABC</a>
```

---

### エスケープ文字

| エスケープシーケンス | 意味 |
| --- | --- |
| &#92;b | バックスペース |
| &#92;t | 水平タブ |
| &#92;v | 垂直タブ |
| &#92;n | 改行(LF) |
| &#92;r | 復帰(CR) |
| &#92;f | 改ページ  |
| &#92;" | ダブルクォート |
| &#92;' | シングルクォート |
| &#92;&#92; | バックスラッシュ |
| &#92;0 | NULL文字 |
| &#92;xXX | 2桁の16進数が表すLatin-1文字  |
| &#92;uXXXX | 4桁の16進数が表すUnicode文字  |
| &#92;u{XXXXXX} | 16進数のコードポイントが表すUnicode文字 |

---

## 正規表現 <a id="regex" data-name="正規表現"></a>

### 正規表現オブジェクト

#### `regexp = new RegExp(pattern[, flags])`

正規表現オブジェクトを生成する。flags の詳細は<a href="#flags">flags</a>を参照。

```javascript
const str = "This is Japan.";
const re = new RegExp("Japan", "ig");
console.log(re.test(str)); // true
```

#### regexp = /pattern/flags

new RegExp() の代わりに、次のように生成することもできる。

```javascript
const str = "This is Japan.";
const re = /Japan/ig; // ignoreCase + global (順序は関係ない)
console.log(re.test(str)); // true
```

### マッチング <a id="matching"></a>

#### string.match(regexp)

string から正規表現 regexp にマッチした文字列に関する情報を返す。<br>
グローバルフラグ (/.../g) がない場合は、最初にマッチした文字列の詳細を含む特殊な配列を返す。<br>
グローバルフラグ (/.../g) を付けた場合は単純な配列として返す。<br>
見つからなかった場合は null を返す。

```javascript
const res1 = "23:59:59".match(/\d+/g);
console.log(res1);                      // ['23', '59', '59']
const res2 = "23:59:59".match(/(?<h>\d+):(?<m>\d+):(?<s>\d+)/);
console.log(res2[0]);                   // '23:59:59' (マッチした全体文字列)
console.log(res2[1], res2[2], res2[3]); // '23' '59' '59' (括弧に対応する部分文字列)
console.log(res2.index);                // 0 (マッチした位置)
console.log(res2.input);                // '23:59:59' (入力文字列)
console.log(res2.groups);               // {h:'23', m:'59', s:'59'} (名前付きキャプチャの結果)
```

#### string.matchAll(regexp)

matchAll() はグローバルフラグ (/.../g) が必須で、マッチした文字列に関する情報のイテレータを返す。<br>
ES2020 で追加。

```javascript
const str = "Date: 2026-12-31";
for (const e of str.matchAll(/(?<y>\d+)-(?<m>\d+)-(?<d>\d+)/g)) {
  console.log(e[0]);                       // '2026-12-31'
  console.log(`${e[1]}/${e[2]}/${e[3]}`);  // '2026/12/31'
  console.log(e.index);                    // 6
  console.log(e.input);                    // 'Date: 2026-12-31'
  console.log(e.groups);                   // {y:'2026', m:'12', d:'31'}
}
```

#### regexp.exec(str)

str に対して正規表現 regexp でマッチングを行い結果を返す。マッチしなければ null を返す。<br>
グローバルフラグ (/.../g) がない場合は match() と同じ挙動。<br>
グローバルフラグ (/.../g) がある場合は、呼び出すたびに lastIndex の位置から検索して、次にマッチした結果を1件ずつ返す。結果は文字列の詳細な情報を含む特殊な配列 (match() と同じ) で、マッチしなくなると null を返す。<br>
繰り返し exec() を呼ぶことで str 全体を走査することができる。

```javascript
const str = "りんご: 100円, みかん: 200円";
const regexp = /(\S+): (\d+)円/g; // カッコでグループ化

let match;
while ((match = regexp.exec(str)) !== null) {
  console.log(`果物: ${match[1]}, 価格: ${match[2]}`);
}
// "果物: りんご, 価格: 100"
// "果物: みかん, 価格: 200"
```

ES2020 以降であれば、matchAll() を使うとより簡潔に書ける。

```javascript
// for...of で簡潔にループできる
for (const match of str.matchAll(regexp)) {
  console.log(`果物: ${match[1]}, 価格: ${match[2]}`);
}
```

#### string.search(regexp)

string から 正規表現 regexp にマッチした部分のインデックスを返す。<br>
マッチしなかった場合は -1 を返す。

```javascript
console.log("ABCDEFG".search(/def/i)); // 3
```

#### regexp.test(str)

str にマッチングを行い、結果を真偽値で返す。

```javascript
const re = /[0-9]+/;
console.log(re.test("abc123")); // true
```

### 名前付きキャプチャグループ

正規表現で (?<name>pattern) のように記述して名前を付けると、マッチングした戻り値の groups.name でアクセスできる。<br>
ES2018 で追加。

```javascript
const str = "2019年12月31日";
const result = str.match(/(?<year>\d+)年(?<month>\d+)月(?<day>\d+)日/);
console.log(result.groups.year);  // 2019
console.log(result.groups.month); // 12
console.log(result.groups.day);   // 31
```

### flags <a id="flags"></a>

| フラグ | フラグ名 | 意味 |
| --- | --- | --- |
| g | global | すべてのマッチを対象にする (2番目、3番目... にマッチする部分も検索する) |
| i | ignoreCase | 大文字・小文字を区別しない |
| m | multiline | `^` と `$` が各行の先頭・末尾にマッチする |
| s | dotAll | ピリオド(.)が、CR, LF, U+2028, U+2029 を含むすべての文字にマッチする (ES2018～) |
| y | sticky | lastIndex で指定した位置からのみ検索する |
| d | hasIndices | マッチした部分文字列の開始・終了インデックスを結果に含める (ES2022～) |
| u | unicode | Unicode のサロゲートペア領域の文字も1文字として扱う (ES2015～) |
| v | unicodeSets | u の拡張モード。集合演算 (差集合 `--`、積集合 `&&`) などが使える (ES2024～) |

---

## 配列 <a id="array" data-name="配列"></a>

### 生成

#### `Array.from(arrayLike[, mapFunc[, thisArg]])`

文字列、Set、Map などの反復可能オブジェクトや、配列ライクなオブジェクトから新しい配列を生成する。

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

##### 要素数を指定して配列を生成する

```javascript
// [0, 1, 2, 3, 4] を作る
const zeroToFour = Array.from({ length: 5 }, (_, i) => i);

// [1, 2, 3, 4, 5] を作る（1から始めたい場合）
const oneToFive = Array.from({ length: 5 }, (_, i) => i + 1);
```

または、fill() で値を詰めて初期化する。

```javascript
const list1 = Array.from({ length: 100 }).fill(0);
const list2 = new Array(100).fill(0);
```

<pre><code class="caution">fill で初期化する場合に参照オブジェクト (配列やオブジェクト) を指定すると、すべての要素で同じ参照が共有されるので注意。
プリミティブ型は共有されない。</code></pre>

##### マップ関数を渡して生成する

mapFunc には、配列を作成する際に各要素に対して実行されるマップ関数を渡す。<br>
マップ関数の引数には、要素値 (value)、インデックス (index) の順で渡される。後ろの引数は省略可能。<br>
thisArg にはマップ関数内で this として参照される値を指定する (アロー関数なら不要)。

```javascript
const arr = Array.from([1, 2, 3], (x) => x * 2);
console.log(arr); // [2, 4, 6]
```

#### new

new は古い書き方で、今ではあまり使われない。

```javascript
const arr1 = new Array();     // 要素が0個の配列を作成
const arr2 = new Array("Red", "Green", "Blue"); // ["Red", "Green", "Blue"] と等価
```

<pre><code class="caution">const arr = new Array(3);
引数が数値1つだけの場合は「要素数3の空の配列」が作られ、map() などのコールバックが呼ばれないなど、意図しない挙動となることがあるため注意。
const arr = Array.from({ length: 3 });
こう書くと undefined が入るため安全。
const arr = new Array(3).fill(undefined);
こういう手もある。</code></pre>

#### Array.fromAsync()

ES2026 で追加された、非同期反復可能オブジェクトを配列に変換するメソッド。結果は Promise で返る。

```javascript
async function* myRange(n) {
  for (let i = 0; i < n; i++) {
    yield i * 2;
  }
}
const arr = await Array.fromAsync(myRange(4));
console.log(arr); // [0, 2, 4, 6]
```

---

### 要素の取り出しと追加と削除

#### array.at(n)

配列の n 番目の要素を取り出す。ES2022 で追加され、負数を指定すると最後から数えた要素を取り出せる。<br>
array は変化しない。

```javascript
const arr = ["Red", "Blue", "Green"];
console.log(arr.at(0));  // "Red"
console.log(arr.at(1));  // "Blue"
console.log(arr.at(-1)); // "Green"
```

#### array.unshift(e1, e2, ...),<br>array.push(e1, e2, ...)

unshift は array の先頭に e1, e2, ... の要素を追加する。<br>
push は array の末尾に要素を追加する。<br>
戻り値は、要素を追加した後の配列の長さ。

```javascript
const arr = ["Green"];
arr.unshift("Red");  // ["Red", "Green"]
arr.push("Blue");    // ["Red", "Green", "Blue"]
```

#### array.shift(), <br>array.pop()

shift は最初の値を削除して戻り値として返す。<br>
pop は最後の値を削除して戻り値として返す。

```javascript
const arr = ["Red", "Green", "Blue"];
arr.shift(); // ["Green", "Blue"]
arr.pop();   // ["Green"]
```

#### array.splice(start, n, e1, e2, ...)

0 から数えて、start から n 個の要素を削除して、その位置に e1, e2, ... を要素として埋め込み、削除した要素を配列で返す。<br>
array 自体を書き換える。

```javascript
const arr1 = ["A", "B", "C", "D", "E", "F", "G"];
const arr2 = arr1.splice(2, 3, "X", "Y");
console.log(arr1);   // ['A', 'B', 'X', 'Y', 'F', 'G']
console.log(arr2);   // ['C', 'D', 'E']
```

#### array.toSpliced(start, n, e1, e2, ...)

0 から数えて、start から n 個の要素を削除して、その位置に e1, e2, ... を要素として埋め込んだものを返す。ES2023 で追加。<br>
array は変化しない。

```javascript
const arr1 = ["A", "B", "C", "D", "E", "F", "G"];
const arr2 = arr1.toSpliced(2, 3, "X", "Y", "Z");
console.log(arr1);  // ['A', 'B', 'C', 'D', 'E', 'F', 'G']
console.log(arr2);  // ['A', 'B', 'X', 'Y', 'Z', 'F', 'G']
```

#### `array.slice(start [, end])`

0 から数えて、start から end-1 番目までの要素を配列で返す。<br>
end を省略した場合は start から最後までの要素を返す。<br>
array は変化しない。

```javascript
const arr = ["A", "B", "C", "D", "E", "F", "G"];
console.log(arr.slice(2, 4));  // ["C", "D"]
```

#### `delete array[n]`

要素を削除するが、配列の長さは変わらず、そのインデックスは空要素 (empty) になる (参照すると undefined)。要素を詰めて削除したい場合は splice() を使うのが一般的。

```javascript
const arr = ["Red", "Green", "Blue"];
delete arr[1];
console.log(arr);      // ["Red", empty, "Blue"]
console.log(arr[0]);   // "Red"
console.log(arr[1]);   // undefined
console.log(arr[2]);   // "Blue"
```

---

### 多次元配列

```javascript
const arr = [];
for (let i = 0; i < 3; i++) {
  arr[i] = [];
  for (let j = 0; j < 4; j++) {
    arr[i][j] = i * 1000 + j;
  }
}
console.log(arr[2][3]); // 2003
```

```javascript
// 3行×4列の2次元配列を 0 で初期化する
const arr1 = Array.from({ length: 3 }, () => Array.from({ length: 4 }).fill(0));

// 上と同じ結果
const arr2 = Array.from({ length: 3 }, () => new Array(4).fill(0));
```

<pre><code class="caution">new Array(3).fill(new Array(4).fill(0)) のように書くと、すべての行が同じ配列を参照してしまうため、必ずコールバック内で行ごとに配列を生成する。</code></pre>

---

### 配列の長さ

```javascript
const arr = ["Red", "Green", "Blue"];
console.log(arr.length); // 3
```

---

### 配列のループ

for...of を使うと、要素を取り出せる。

```javascript
const colors = ["Red", "Green", "Blue"];
for (const color of colors) {
  console.log(color); // "Red", "Green", "Blue"
}
```

<pre><code class="caution">配列に for...in を使うと index を取得できるが、index は数値ではなく文字列で取得され、バグの元になるため配列には使わない。</code></pre>


#### `array.forEach(callback[, this])`

配列の各要素を引数にして callback を実行する。<br>
callback の引数には、要素値 (value)、インデックス (index)、配列自体 (array) の順で渡される。後ろの引数は省略可能。

```javascript
const arr = ["Red", "Green", "Blue"];
arr.forEach((value, index, array) => {
  console.log(value);
});
```

#### array.entries(), array.keys(), array.values()

entries() は `[index, value]` の組からなるイテレータ、keys() は index のみからなるイテレータ、values() は value のみからなるイテレータを返す。

```javascript
const arr = ["Red", "Green", "Blue"];

for (const [index, value] of arr.entries()) {
  console.log(index + ":" + value);     // "0:Red", "1:Green", "2:Blue"
}

for (const elem of arr.entries()) {
  console.log(elem[0] + ":" + elem[1]); // "0:Red", "1:Green", "2:Blue"
}

for (const key of arr.keys()) {
  console.log(key); // 0, 1, 2
}

for (const value of arr.values()) {
  console.log(value); // "Red", "Green", "Blue"
}
```

---

### 配列の走査

#### `array.map(callback[, this])`

配列の各要素に対して callback を実行し、callback の戻り値からなる配列を返す。<br>
callback の引数には、要素値 (value)、インデックス (index)、配列自体 (array) が渡される。

```javascript
const arr1 = [2, 4, 6]
const arr2 = arr1.map((value, index, array) => value * 2);
console.log(arr2) // [4, 8, 12]
```

#### `array.filter(callback[, this])`

配列の各要素に対して callback を実行し、callback の戻り値が真となる要素からなる配列を返す。<br>
callback の引数には、要素値 (value)、インデックス (index)、配列自体 (array) が渡される。

```javascript
const arr1 = [89, 87, 93, 65, 88];
const arr2 = arr1.filter(function(value, index, array) {
  return (value >= 80);
});
console.log(arr2); // [89, 87, 93, 88]
```

#### array.includes(elm)

elm と等しい要素があるかどうかを真偽値で返す。ES2016 で追加。<br>
indexOf() と異なり、NaN も検出できる。

```javascript
const arr = ["Red", "Green", "Blue"];

if (arr.includes("Green")) { ... }     // ES2016 以降の書き方
```

#### array.indexOf(elm)

配列の中に elm とマッチする要素が出現するインデックスを返す。見つからない場合は -1 を返す。

```javascript
const arr = ["Red", "Green", "Blue"];
console.log(arr.indexOf("Red"));       // 0
console.log(arr.indexOf("Green"));     // 1
console.log(arr.indexOf("Blue"));      // 2
console.log(arr.indexOf("Yellow"));    // -1
```

#### array.lastIndexOf(elm)

配列の中に elm とマッチする要素が最後に出現するインデックスを返す。見つからない場合は -1 を返す。

```javascript
const arr = [3, 5, 8, 5, 1];
console.log(arr.lastIndexOf(5));  // 3
```

#### Array.isArray(value)

value が配列かどうかを真偽値で返す。ES5 で追加。

```javascript
console.log(Array.isArray("ABC"));            // false
console.log(Array.isArray(["A", "B", "C"]));  // true
```

#### index in array

指定した index に該当する要素があるかどうかを真偽値で返す。

```javascript
const arr = ["Red", "Green", "Blue"];
console.log(2 in arr); // true
console.log(3 in arr); // false
```

#### `array.every(callback[, this])`<br>`array.some(callback[, this])`

配列の各要素に対して callback を実行して、every() は callback の戻り値がすべて真なら真を返し、some() は callback の戻り値が1つでも真なら真を返す。<br>
callback の引数には、要素値 (value)、インデックス (index)、配列自体 (array) が渡される。

```javascript
const arr = [89, 87, 93, 65, 88];
const allPassed = arr.every(function(value, index, array) {
  return (value >= 80);
});
console.log(allPassed);  // false

const hasExcellent = arr.some(function(value, index, array) {
  return (value >= 90);
});
console.log(hasExcellent);  // true
```

#### `array.find(callback[, this])`<br>`array.findLast(callback[, this])`<br>`array.findIndex(callback[, this])`<br>`array.findLastIndex(callback[, this])`

find() は、配列の各要素に対して callback を実行して、callback の戻り値が最初に真となった要素の値を返す。見つからない場合は undefined を返す。<br>
callback の引数には、要素値 (value)、インデックス (index)、配列自体 (array) が渡される。

```javascript
const arr = [89, 87, 93, 92, 88];
const value = arr.find((value, index, array) => {
  return value >= 90;
});
console.log(value);  // 93
```

findIndex() は、見つかった要素のインデックスを返す。見つからない場合は -1 を返す。

```javascript
const arr = [89, 87, 93, 92, 88];
const index = arr.findIndex((value, index, array) => {
  return value >= 90;
});
console.log(index);  // 2
```

findLast() と findLastIndex() は配列を末尾から検索する。

---

### 配列の連結

#### array.concat(array2, ...)

array と array2 を連結した配列を返す。array は変更されない。引数は複数指定可能。

```javascript
const arr1 = ["Red", "Green"];
const arr2 = ["Blue", "Yellow"];
const arr3 = arr1.concat(arr2);
console.log(arr3);  // ["Red", "Green", "Blue", "Yellow"]
```

#### `array.join([separator])`

array の各要素の値を separator で連結した文字列を返す。<br>
separator を省略した場合はカンマ(,)で連結されるが、意図を明確にするため省略せず指定する。

```javascript
const arr = ["2000", "12", "31"];
const str = arr.join("/");
console.log(str);  // "2000/12/31"
```

---

### 配列の並べ替え

#### `array.sort([func])`

array を並べ替えて、結果の配列を返す。<br>
array 自体も書き換えられる。

```javascript
const arr = [3, 7, 8, 1];
arr.sort();
console.log(arr);  // [1, 3, 7, 8]
```

<pre><code class="caution">sort() は引数を省略すると、要素を文字列に変換して辞書順で比較する (例: [10, 9, 1].sort() は [1, 10, 9] になる)。数値を昇順に並べるには (a, b) => a - b を指定する。</code></pre>

ソート関数を指定することもでき、ソート関数は a を b より前に並べるなら負の値を、後ろに並べるなら正の値を、等しければ 0 を返す。

```javascript
function comparison(a, b) {
  const str1 = a.toUpperCase();
  const str2 = b.toUpperCase();
  if (str1 === str2) { return 0; }
  if (str1 > str2) { return 1; }
  if (str1 < str2) { return -1; }
}

const arr = ["a", "x", "B", "y", "c", "Z"];
arr.sort(comparison);
console.log(arr);  // ["a", "B", "c", "x", "y", "Z"]
```

#### `array.toSorted([func])`

array をソートして、結果の配列を返す。ES2023 で追加。<br>
array は変化しない。<br>
他の機能は sort() と同じ。

#### array.reverse()

array を逆順で並べ替えて、結果の配列を返す。<br>
array 自体も書き換えられる。

#### array.toReversed()

array を逆順に並べ替えた新しい配列を返す。ES2023 で追加。<br>
array は変化しない。

---

### 配列から文字列への変換

#### array.toString()

配列を文字列に変換する。

```javascript
const arr = [1, 2, 3, "A", "B", "C"];
arr.toString(); // "1,2,3,A,B,C"
```

#### `array.toLocaleString([locales[, options]])`

配列をロケールに応じた文字列に変換する。

```javascript
const arr = [1, 'A', new Date('31 Dec 1999 14:59:59 UTC')];
const str = arr.toLocaleString('ja', {timeZone: "Asia/Tokyo"});
console.log(str);   // "1,A,1999/12/31 23:59:59"
```

---

### 配列要素の変更

#### `array.fill(value[, start[, end]])`

0 から数えて、start から end-1 番目までの要素の値を value で置き換える。<br>
array 自体を書き換える。<br>
start が省略された場合は最初から、end が省略された場合は最後までを置換する。

```javascript
const arr = ["0", "1", "2", "3", "4", "5"];
arr.fill("A", 2, 5);
console.log(arr);  // ["0", "1", "A", "A", "A", "5"]
```

<pre><code class="caution">value に参照オブジェクトを指定すると、すべての要素で同じ参照が共有されるので注意。
プリミティブ型は共有されない。</code></pre>

#### array.with(index, value)

0 から数えて index 番目の要素を value に置換したものを返す。ES2023 で追加。<br>
array は変化しない。

```javascript
const arr1 = ["0", "1", "2", "3", "4", "5"];
const arr2 = arr1.with(3, "X");
console.log(arr1);   // ['0', '1', '2', '3', '4', '5']
console.log(arr2);   // ['0', '1', '2', 'X', '4', '5']
```

#### `array.copyWithin(target[, start[, end]])`

0 から数えて、start から end-1 番目の要素をコピーして target 番目から上書きする。<br>
array 自体を書き換える。<br>
end が省略された場合は最後までをコピーする。

```javascript
const arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
arr.copyWithin(2, 8, 10);
console.log(arr); // ["0", "1", "8", "9", "4", "5", "6", "7", "8", "9"]
```

#### `array.flat([depth])`

多次元配列を低次元の配列にフラット化する。depth にはフラット化する階層の深さを指定する (省略時は 1)。

```javascript
const arr = [[[1, 2], [3, 4]], [5, 6]];
console.log(arr.flat(2)); // [1, 2, 3, 4, 5, 6]
```

#### array.flatMap(callback)

配列の各要素に対して map() を行い、結果を深さ 1 でフラット化した配列を返す。

```javascript
const arr = ["Blue Green", "Red Yellow"];
console.log(arr.flatMap(x => x.split(" "))); // ["Blue", "Green", "Red", "Yellow"]
```

---

## Map <a id="map" data-name="Map"></a>

ES2015 で追加されたオブジェクトで、キーと値のペアを保持する。<br>
Object と似ているが、Map には次のような利点がある。

- 文字列や Symbol 以外 (オブジェクトや数値など) の値もキーとして使える。
- 要素数を size で取得できる。
- for...of で簡単にループできる (要素は追加した順に取り出される)。
- 要素の追加や削除が頻繁に発生するような、大量のデータを扱うケースに最適化されている。

### `map = new Map([iterable])`

コンストラクタには、キーと値のペアの配列 (二次元配列) を指定できる。

```javascript
const map = new Map([["width", 160], ["height", 120]]);
```

### map.set(key, value)<br>map.get(key)

set() で要素を追加・更新し、get() で取得する。存在しないキーを指定すると undefined を返す。

```javascript
const map = new Map();
map.set("width", 160);
map.set("height", 120);
map.get("width");   // 160
map.get("height");  // 120
```

### map.size

要素数を返す。

```javascript
const map = new Map();
map.set("width", 160);
map.set("height", 120);
map.size;   // 2
```

### map.keys()<br>map.values()<br>map.entries()

keys() はキー、values() は値、entries() は `[キー, 値]` のペアのイテレータを返す。Map をそのまま for...of に渡すと、entries() と同じ結果になる。

```javascript
for (const [key, value] of map) {
   console.log(key, ":", value);
}
for (const [key, value] of map.entries()) {
   console.log(key, ":", value);
}
for (const key of map.keys()) {
   console.log(key, ":", map.get(key));
}
for (const value of map.values()) {
   console.log(value);
}
```

### `map.forEach(callback[, this])`

Map の各要素に対して callback を実行する。<br>
callback の引数には、値 (value)、キー (key)、Map 自体 (map) の順で渡される。配列の forEach() と同様に、先頭が値である点に注意。

```javascript
const map = new Map([["width", 160], ["height", 120]]);
map.forEach((value, key) => {
  console.log(key, ":", value);  // "width : 160", "height : 120"
});
```

### map.has(key)

key が Map に存在するかどうかを真偽値で返す。

```javascript
const map = new Map();
map.set("width", 160);
map.has("width"); // true
```

### map.delete(key)

key の要素を削除する。削除できた場合は true、key が存在しなかった場合は false を返す。

```javascript
const map = new Map();
map.set("width", 160);
map.delete("width");
```

### map.clear()

Map の要素をすべて削除する。

### map.getOrInsert(key, value)

Map に key が存在すればその値を返し、存在しなければ key と value を追加してから value を返す。<br>
2026 年に主要ブラウザで使えるようになった比較的新しいメソッドなので、対応状況を確認してから使う。

```javascript
const counts = new Map();
counts.set("a", counts.getOrInsert("a", 0) + 1);  // "a" が無ければ 0 を追加してから +1 する
```

### map.getOrInsertComputed(key, callback)

key が存在すればその値を返し、存在しなければ callback(key) の戻り値を追加してから返す。<br>
getOrInsert() は既定値を毎回生成するが、こちらは key が存在しない場合にのみ callback を呼ぶ。既定値の生成にコストがかかる場合に使う。

```javascript
const groups = new Map();
groups.getOrInsertComputed("a", () => []).push(1);  // "a" が無い場合のみ空配列を生成する
```

### Map.groupBy(items, callback)

反復可能オブジェクト (配列など) の各要素に callback を実行し、戻り値をキーとしてグループ分けした Map を返す (ES2024)。<br>
callback の引数には、要素 (element)、インデックス (index) が渡される。

```javascript
const nums = [1, 2, 3, 4, 5];
const groups = Map.groupBy(nums, (n) => (n % 2 === 0 ? "偶数" : "奇数"));
console.log(groups.get("偶数")); // [2, 4]
console.log(groups.get("奇数")); // [1, 3, 5]
```

---

## クラス <a id="class" data-name="クラス"></a>

class はオブジェクトを作るためのひな型のようなもので、コードの重複が減るため保守性が上がったり、簡単にオブジェクトを生成できるなどのメリットがある。

<span class="code-like">constructor</span> によりコンストラクタを定義できる。

### クラスの定義

```javascript
class クラス名 {
  constructor([引数, ...]) {
    this.プロパティ = 値;
  }

  メソッド名([引数, ...]) {
    // 処理
  }
}
```

### インスタンスの生成

```javascript
// 引数あり
const オブジェクト = new クラス名([引数, ...]);

// 引数なし
const オブジェクト = new クラス名; // () は省略可能
```

### 静的メソッド・静的プロパティ

static キーワードを付けると静的メソッド・静的プロパティとなり、インスタンスではなく class 自体に紐づけられる。<br>
呼び出しは <span class="code-like">クラス名.メソッド名()</span>、<span class="code-like">クラス名.プロパティ名</span> のように、クラス名を通して行う。

```javascript
class Test {
    static count = 0;
    static showCount() {
        console.log(Test.count);
    }

    constructor() { Test.count++ }
}
```

### ゲッター・セッター

get, set キーワードでゲッターとセッターを定義できる。同じプロパティ名に対して、ゲッターとセッターを組で定義する。

```javascript
class クラス名 {
  get プロパティ名() {
    return 取得される値;
  }

  set プロパティ名(値) {
    値を設定する処理;
  }
}
```

呼び出す時は () を付けず、通常のプロパティと同じように読み書きする。

```javascript
const obj = new クラス名();
obj.プロパティ名 = 値;          // セッターが呼ばれる
console.log(obj.プロパティ名);  // ゲッターが呼ばれる
```

---

## import <a id="import" data-name="import"></a>

import は外部からオブジェクトなどを取り込む仕組み。

### import

```javascript
// 名前付き export を import する場合は {} が必要
import { name, hello } from './file'

// default export は {} が不要 (任意の名前を付けられる)
import App from './App'
```

<pre><code class="caution">ブラウザで直接読み込む場合は、script タグに type="module" を指定し、import のパスに拡張子まで記述する (./file.js)。</code></pre>

### export

モジュールの中の変数や関数、クラスやオブジェクトなどを外部のファイルからでも使えるように公開する仕組み。

```javascript
// 名前付き export
export const pi = 3.14;
export function add(a, b) {
  return a + b;
}

// default export (メインとなる部品を1つだけ公開)
export default class User {
  constructor(name) {
    this.name = name;
  }
}
```

### type <span class="label">TS</span>

型だけを読み込む仕組み。実行時には含まれない。

```typescript
import type { User } from './types'
```

---

## 関数 <a id="function" data-name="関数"></a>

### 関数の定義

#### 関数宣言

```javascript
function 関数名 (引数) {
  // 処理
}
```

最も基本的な書き方で、ホイスティングされるため定義より前でも呼び出すことができる。

#### アロー関数

```javascript
(引数) => {
  // 処理
}
```

ES2015 で追加された比較的モダンな書き方で、this の扱いが function と異なる。

- function は誰が呼んだか (呼び出し方) で this が決まる (動的)
- アロー関数はどこに書いたか (定義場所) で this が決まる (静的)

また、アロー関数は記述が短い、ホイスティングされない、コンストラクタとして使えない (new できない) などの特徴がある。

```javascript
// 一般的な書き方 (return が必要)
(arg1, arg2) => { return arg1 + arg2; }

// { } を省略すると、式の結果が戻り値になる (return は不要)
(arg1, arg2) => arg1 + arg2

// { } 省略でオブジェクトを返却する場合は () でくくる
(arg1, arg2) => ({"x": arg1, "y": arg2})

// 引数が1個の場合は ( ) を省略可能
arg1 => { return arg1 * 2; }

// 引数が0個の場合は ( ) が必要
() => { return 10; }

// レスト引数 (可変長引数) をサポート
(x, y, z, ...rest) => { ... }

// デフォルト引数をサポート
(file, mode = "r") => { ... }
```

#### 関数式

```javascript
const 関数名 = function(引数) {
  // 処理
}
```

条件によって関数を切り替えたい場合などに使う。ホイスティングはされない。

#### 無名関数

```javascript
// 単体では文として書けず、式として (引数に渡すなど) 使う
function(引数) {
  // 処理
}
```

名前を持たない関数で、1度しか呼び出されないような処理 (コールバック関数やイベント処理など) を記述するために使う。

#### メソッド記法

```javascript
const オブジェクト名 = {
  関数名() {
    // 処理
  }
}
```

オブジェクト内専用の省略記法で、実質的には次と同じ。

```javascript
const オブジェクト名 = {
  関数名: function() {
    // 処理
  }
}
```

### デフォルト引数

関数の実行時に引数が渡されなかった (または undefined が渡された) 場合の初期値を指定できる。

```javascript
function 関数名(arg1 = 初期値1, arg2 = 初期値2) {
  // 処理
}
```

### オブジェクトを引数として渡す

引数が多い場合にはオブジェクトを引数として渡せる。

```javascript
function fn(obj) {
  obj.arg1 ??= "初期値1";
  obj.arg2 ??= "初期値2";
  console.log(obj.arg1, obj.arg2);
}

fn({ arg2: "引数2" }); // 初期値1 引数2
```

または

```javascript
// 引数の段階で展開し、デフォルト値を割り当て
function fn({ arg1 = "初期値1", arg2 = "初期値2" } = {}) {
  console.log(arg1, arg2); 
}

const params = { arg2: "引数2" };
fn(params); // 初期値1 引数2
```

ただし、オブジェクトは参照が渡されるため、1つ目の方法のように引数のオブジェクトを書き換えると、呼び出し元のオブジェクトにも影響する点に注意。

---

## クロージャ <a id="closure" data-name="クロージャ"></a>

クロージャ (関数閉包) は、関数が定義された時の周囲の環境 (レキシカルスコープ) を一緒に持ち運ぶ仕組み。

### 前提となる考え方

#### レキシカルスコープ

変数がどこから参照できるかは、関数を**どこに書いたか** (コードの構造) で決まる。関数の中から変数を探すとき、まず自分のスコープを探し、なければ外側のスコープへ、さらに外側へと順にたどる (スコープチェーン)。

```javascript
const globalValue = "global";

function outer() {
  const outerValue = "outer";

  function inner() {
    const innerValue = "inner";
    // inner → outer → グローバル の順に変数を探す
    console.log(innerValue, outerValue, globalValue);
  }

  inner();
}

outer(); // inner outer global
```

#### 関数は環境への参照を持つ

関数は「処理内容」だけでなく、「定義された場所の変数への参照」も一緒に保持している。通常、関数の実行が終わるとその中の変数は破棄されるが、内側の関数が外に持ち出されて参照され続けている場合は、その関数が使う変数も残り続ける。これがクロージャの正体。

<pre><code class="tips">アロー関数の this が「どこに書いたか」で決まる (静的) のも、同じレキシカルスコープの考え方に基づく。JavaScript では関数はすべてクロージャとして動作しており、特別な構文があるわけではない。</code></pre>

### 基本の例

```javascript
function createCounter() {
  let count = 0; // レキシカルスコープ内の変数

  // 内部で関数を定義して、外に返す
  return function() { 
    count++; // 親の変数を覚えている
    return count;
  };
}

const counter = createCounter(); // createCounter の実行はここで終了している

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

- やり取りするインターフェースのみを返すことで、状態をカプセル化し、不正に書き換えられることを防げる。
- `createCounter` を呼ぶたびに、独立した `count` を持つカウンタを生成できる。
- 返された関数が参照され続ける間は、その関数が参照する変数 (`count`) がメモリ上に残り続ける。

### 環境は呼び出しごとに独立する

関数を呼び出すたびに新しい環境が作られるため、生成したクロージャ同士は状態を共有しない。

```javascript
const counterA = createCounter();
const counterB = createCounter();

console.log(counterA()); // 1
console.log(counterA()); // 2
console.log(counterB()); // 1 (counterA の count とは別)
```

一方、同じ環境から作られた複数の関数は、同じ変数を共有する。

```javascript
function createAccount(initialBalance) {
  let balance = initialBalance; // 外からは直接触れない

  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createAccount(1000);
account.deposit(500);

console.log(account.getBalance()); // 1500
console.log(account.balance);      // undefined (直接アクセスできない)
```

<pre><code class="tips">クロージャが捕捉するのは変数の「値のコピー」ではなく「変数そのもの」。そのため、後から変数の値が変わると、クロージャ側からも変わった値が見える。</code></pre>

### 主な使い道

| 用途 | 説明 |
| --- | --- |
| 状態の保持とカプセル化 | グローバル変数を使わずに、関数に紐づく状態を持たせる。外部からは返したメソッド経由でしか操作できない。 |
| 関数ファクトリ | 引数で設定を受け取り、その設定を覚えた関数を生成する。 |
| コールバックでの状態保持 | イベントハンドラやタイマーなど、後から呼ばれる関数が、定義時の変数を参照できる。 |
| メモ化 (キャッシュ) | 計算結果を関数の外から見えない場所に保存し、同じ引数での再計算を避ける。 |
| 処理の制御 | 一度だけ実行する (once)、連続呼び出しを間引く (debounce) など、呼び出し状態を覚えて動作を変える。 |

#### 関数ファクトリ

```javascript
function createMultiplier(factor) {
  // factor を覚えた関数を返す
  return (value) => value * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

#### イベントハンドラでの状態保持

```javascript
function setupClickCounter(button) {
  let clickCount = 0;

  button.addEventListener("click", () => {
    clickCount++; // ハンドラが呼ばれるたびに、同じ変数を更新する
    button.textContent = `${clickCount}回クリックされました`;
  });
}

setupClickCounter(document.getElementById("test-button"));
```

#### メモ化

```javascript
function memoize(fn) {
  const cache = new Map(); // 外からは見えないキャッシュ

  return function(arg) {
    if (cache.has(arg)) {
      return cache.get(arg); // 計算済みならキャッシュを返す
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const slowSquare = (n) => {
  console.log("計算中...");
  return n * n;
};

const fastSquare = memoize(slowSquare);

console.log(fastSquare(4)); // 計算中... → 16
console.log(fastSquare(4)); // 16 (計算せずキャッシュから返す)
```

#### debounce

連続して呼ばれた場合に、最後の呼び出しから一定時間が経ってから1回だけ実行する。入力欄の検索などで使われる。

```javascript
function debounce(fn, delay) {
  let timerId; // 呼び出しをまたいで保持される

  return function(...args) {
    clearTimeout(timerId);                     // 前回の予約を取り消す
    timerId = setTimeout(() => fn(...args), delay); // 新しく予約する
  };
}

const onInput = debounce((text) => console.log("検索:", text), 300);
```

### ループとクロージャ

ループ内で作った関数が、ループ変数を後から参照する場合、`var` と `let` で結果が変わる。

```javascript
// var: ループ変数がループ全体で1つだけ共有される
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3 (関数が実行される時点で、i はすでに 3)

// let: ループの1回ごとに新しい変数が作られる
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 0, 1, 2 (各回の関数が、それぞれの i を覚えている)
```

<pre><code class="caution">var はスコープが関数単位なので、ループ内で作った関数はすべて同じ変数を共有してしまう。ループ変数には let を使う。</code></pre>

### 注意点

- **メモリ**: クロージャが参照している変数は、その関数が参照され続ける限り解放されない。大きなデータを捕捉したままの関数をイベントリスナーなどに登録し続けると、メモリを消費し続ける。不要になったら `removeEventListener` で解除したり、参照を `null` にしたりする。
- **意図しない共有**: 同じ環境から作った関数は同じ変数を共有する。独立した状態が必要な場合は、呼び出しごとに関数を生成して、環境を分ける。
- **可読性**: 状態の流れが関数の外から見えにくくなる。状態が複雑になる場合は、クラスの使用も検討する。

### クラスの private との比較

クラスの `#` で始まるプライベートフィールドでも、状態のカプセル化ができる。

| | クロージャ | クラスの `#private` |
| --- | --- | --- |
| 状態の隠し方 | 関数スコープの変数に閉じ込める | `#名前` のフィールドとして宣言する |
| インスタンスの生成 | 関数を呼び出す (`new` 不要) | `new` を使う |
| メソッドの共有 | 呼び出しごとに関数が作られる | プロトタイプで共有される |
| 向いている場面 | 小さな状態や、1つの関数に設定を持たせたい場合 | 状態とメソッドが多く、型として扱いたい場合 |

---

## 非同期 <a id="async" data-name="非同期"></a>

JavaScript は基本的に1つのスレッドで、コードを上から1行ずつ実行する (同期処理)。通信やタイマーのように完了まで時間がかかる処理をその場で待ってしまうと、待っている間は画面の描画やクリックへの反応も止まってしまう。

そこで、時間のかかる処理は実行環境 (ブラウザや Node.js) に任せて、完了したら続きの処理を呼び出してもらう仕組みが使われる。これが**非同期処理**で、Promise や async/await は、この「続きの処理」を書きやすくするための仕組み。

### 非同期の概念

#### 同期と非同期

| | 説明 |
| --- | --- |
| 同期 | 処理が完了するまで次に進まず、結果をその場で受け取る。 |
| 非同期 | 処理の完了を待たずに次へ進み、結果は完了した後に受け取る。 |

身近な例で言うと、次のようなイメージ。

- **同期**: 注文したあと、カウンターの前で料理ができるまで立って待つ。その間は他に何もできない。
- **非同期**: 注文して番号札を受け取り、席で別のことをしながら待つ。できあがったら呼ばれて、料理を受け取る。

この「番号札」にあたるものが **Promise**。「今は結果がないが、後で結果と交換できる引換券」と考えると分かりやすい。`await` は「呼ばれるまで席で待つ」、`then` は「呼ばれたらこれをする」と決めておくことに当たる。

```
同期:
  |--処理A--|====== 待ち (何もできない) ======|--処理B--|

非同期:
  |--処理A--|--依頼を出す--|--処理B--|--処理C--| ... |--完了後の処理--|
                  └─ 待ち時間は実行環境 (ブラウザ / OS) が担当 ─┘
```

#### ブロッキングとノンブロッキング

同期/非同期とは別の軸として、「待っている間、スレッドが他の仕事をできるか」という見方がある。

| | 説明 |
| --- | --- |
| ブロッキング | 待っている間、スレッドが止まって他の処理ができない。 |
| ノンブロッキング | 待っている間も、スレッドが他の処理を実行できる。 |

- 同期/非同期は、**結果をいつ・どう受け取るか** (呼び出し側から見た書き方) の話。
- ブロッキング/ノンブロッキングは、**待っている間にスレッドが空くか** (スレッドの状態) の話。

`await` は、コードの見た目は同期処理のように上から下へ進むが、実際には**ノンブロッキング**。待っている間、スレッドはイベントループに戻って他の処理を実行している。逆に、重い計算のループは見た目の書き方に関係なく、完了までスレッドを占有する (ブロッキング)。

#### 並行と並列

| | 説明 |
| --- | --- |
| 並行 (concurrency) | 複数の処理を**切り替えながら**進める。1つのスレッドでも実現できる。 |
| 並列 (parallelism) | 複数の処理を**物理的に同時に**実行する。複数のスレッド (CPU コア) が必要。 |

JavaScript のメインスレッドは、**並行ではあるが並列ではない**。「待ち」の間に別の処理へ切り替えることで、複数の処理が同時に進んでいるように見えるが、JavaScript のコード自体が同時に2か所で実行されることはない。

本当に並列で実行したい場合は、別スレッドで動く **Web Worker** (Node.js では Worker Threads) を使う。メインスレッドとはメッセージで通信し、変数は共有しない。

#### 待っているのは誰か

通信やタイマーの「待ち」は、JavaScript エンジンではなく**実行環境 (ブラウザや OS) が担当**する。JavaScript 側は依頼を出しておくだけで、完了すると、その通知 (コールバックや Promise の決着) がキューに積まれる。イベントループが、現在の処理が終わったタイミングでそれを取り出して実行する。

このため、`fetch` で通信している間にも、画面の描画やクリックの処理は止まらない。

#### 結果の受け取り方の変遷

「後で届く結果をどう受け取るか」という問題への答えが、書き方の違いになっている。

| 方式 | 受け取り方 |
| --- | --- |
| コールバック | 「終わったらこの関数を呼んで」と関数を渡しておく。 |
| Promise | 「後で結果と交換できる引換券」を受け取り、`then` / `catch` で受け取り方を登録する。 |
| async/await | Promise を `await` で待つ形にして、同期処理のように書く。 |

どの方式でも、**非同期で動く仕組み (イベントループ) は同じ**で、違うのは結果の受け取り方の書きやすさだけ。

### 非同期処理のしくみ (イベントループ)

非同期処理は、次の4つの要素で成り立っている。

| 要素 | 説明 |
| --- | --- |
| コールスタック | 実行中の関数を積み上げる場所。同期処理はここで順番に実行される。 |
| タスクキュー (マクロタスク) | `setTimeout` のコールバックや、クリックなどのイベントハンドラが、準備できた時点で積まれる待ち行列。 |
| マイクロタスクキュー | Promise の `then` / `catch` / `finally` のコールバックや、`await` より後の処理が積まれる待ち行列。 |
| イベントループ | コールスタックが空になるのを監視して、キューから次の処理を取り出して実行する。**マイクロタスクは、次のマクロタスクより先にすべて実行される。** |

```javascript
console.log("1: 同期処理");

setTimeout(() => {
    console.log("4: setTimeout (マクロタスク)");
}, 0);

Promise.resolve().then(() => {
    console.log("3: Promise.then (マイクロタスク)");
});

console.log("2: 同期処理");

// 1 → 2 → 3 → 4 の順に出力される
```

`setTimeout` の待ち時間が `0` でも、コールバックは現在の同期処理がすべて終わるまで実行されない。

<pre><code class="tips">非同期は「並列」ではない。JavaScript のコードが同時に2か所で実行されることはなく、通信やタイマーなどの「待ち時間」が重なっているだけ。
そのため、重い計算 (CPU を使い続ける処理) を非同期にしても、その間は他の処理が止まる。</code></pre>

<pre><code class="example">// Rustで言うと
// JS の Promise  : 生成した時点で処理が動き始める (tokio::spawn に近い)
// Rust の Future : .await (poll) されるまで何も進まない
// イベントループ : 単一スレッドの executor (Tokio の current_thread ランタイム) のイメージ</code></pre>

#### イベントループの1周

イベントループは、大まかに次の手順を繰り返している (実際の仕様や実装はもう少し複雑だが、動きを理解するための単純化したモデル)。

```javascript
while (true) {
    const task = macrotaskQueue.shift();   // 1. マクロタスクを1つ取り出す
    run(task);                             // 2. 最後まで実行する (途中で割り込まれない)

    while (microtaskQueue.length > 0) {    // 3. マイクロタスクを、空になるまですべて実行する
        run(microtaskQueue.shift());       //    (実行中に追加されたものも含む)
    }

    if (shouldRender) render();            // 4. ブラウザは、必要なら画面を描画する
}                                          // 5. 次のマクロタスクへ
```

- 最初に実行されるスクリプト全体も、1つのマクロタスクとして扱われる。
- マクロタスクは**1回のループで1つだけ**実行される。一方、マイクロタスクは**キューが空になるまで**すべて実行される。
- 画面の描画は、マクロタスクとマクロタスクの間に、ブラウザが必要と判断した時にだけ行われる。マイクロタスクの実行中には描画されない。

#### 何がどのキューに積まれるか

| 種類 | 代表的なもの |
| --- | --- |
| マクロタスク | `setTimeout` / `setInterval` のコールバック、クリックなどの UI イベント、`postMessage` / `MessageChannel` |
| マイクロタスク | Promise の `then` / `catch` / `finally`、`await` より後の処理、`queueMicrotask()`、`MutationObserver` |
| 描画の直前 (ブラウザ) | `requestAnimationFrame` のコールバック (タスクキューとは別枠で、描画の直前に実行される) |

`queueMicrotask()` を使うと、Promise を使わずに、マイクロタスクとして処理を積める。

```javascript
queueMicrotask(() => {
    console.log("マイクロタスクとして実行される");
});
```

#### 実行順序をトレースする

次のコードの出力順を、キューの動きから追ってみる。

```javascript
console.log("1: script start");

setTimeout(() => console.log("7: setTimeout"), 0);

async function main() {
    console.log("2: main start");
    await null;
    console.log("4: main after await");
}

main();

Promise.resolve()
    .then(() => console.log("5: then 1"))
    .then(() => console.log("6: then 2"));

console.log("3: script end");
```

| 手順 | 起きること | マイクロタスクキュー | マクロタスクキュー |
| --- | --- | --- | --- |
| 1 | `1: script start` を出力する。 | (空) | (空) |
| 2 | `setTimeout` により、コールバックがマクロタスクとして登録される。 | (空) | setTimeout |
| 3 | `main()` を呼ぶ。`2: main start` を出力して、`await` で中断する。続きがマイクロタスクとして積まれる。 | main の続き | setTimeout |
| 4 | `Promise.resolve().then(...)` により、`then 1` が積まれる (`then 2` は、`then 1` の完了後に積まれる)。 | main の続き、then 1 | setTimeout |
| 5 | `3: script end` を出力する。これでスクリプト (最初のマクロタスク) が終了する。 | main の続き、then 1 | setTimeout |
| 6 | マイクロタスクを順に実行する。`4: main after await`、`5: then 1` を出力する。`then 1` の完了で、`then 2` が積まれる。 | then 2 | setTimeout |
| 7 | 追加された `then 2` も、同じマイクロタスクの処理の中で実行する。`6: then 2` を出力する。 | (空) | setTimeout |
| 8 | マイクロタスクが空になったので、次のマクロタスクを実行する。`7: setTimeout` を出力する。 | (空) | (空) |

ポイントは次の3つ。

- async 関数は、**最初の `await` までは同期的に実行される**。`2: main start` が `3: script end` より先に出力されるのは、このため。
- `await` より後の処理は、マイクロタスクとして再開される。
- `setTimeout(…, 0)` は、積まれたマイクロタスクがすべて終わってから実行される。

#### 実行中の処理は割り込まれない

マクロタスク (とマイクロタスク) は、**一度実行を始めたら最後まで実行される** (run-to-completion)。別の処理が途中で割り込むことはないため、変数の書き換えの途中に他のコードが実行されることはない。

一方で、同期的に長く動き続ける処理があると、イベントループが進まなくなり、その間は描画、クリックの処理、タイマーなどがすべて待たされる。

```javascript
setTimeout(() => console.log("タイマー"), 100);

const start = Date.now();
while (Date.now() - start < 3000) {
    // 3秒間、メインスレッドを占有する
}

// タイマーは 100ms 後ではなく、3秒経過後に実行される
```

`setTimeout` の待ち時間は、「この時間が経過したら実行する」という保証ではなく、**「この時間が経過する前には実行しない」という最低限の時間**でしかない。実際には、キューに積まれた後、イベントループが取り出せるようになるまで待たされる。

<pre><code class="tips">ブラウザでは、setTimeout / setInterval を入れ子で何度も呼ぶと、最小の待ち時間が約4ms に制限される。
また、非アクティブなタブでは、タイマーの実行が間引かれることがある。</code></pre>

重い処理をする場合は、次のような方法でイベントループを空ける。

- 処理を小さく分割して、`setTimeout` や `await` の間に挟みながら実行する (他のタスクが割り込める隙間ができる)。
- Web Worker (Node.js では Worker Threads) に任せて、別スレッドで実行する。

#### マイクロタスクの詰まり (starvation)

マイクロタスクは**空になるまで**実行されるため、マイクロタスクが新しいマイクロタスクを積み続けると、マクロタスクや描画に処理が移らず、画面が固まる。

```javascript
function loop() {
    Promise.resolve().then(loop);   // 次のマイクロタスクを積み続ける
}

loop();   // setTimeout や描画が、永遠に実行されない
```

<pre><code class="caution">マイクロタスクは、マクロタスクより優先して実行される。
再帰的に Promise や queueMicrotask を呼び続ける処理は、無限ループと同じように画面を固めてしまう。
待ち時間を挟みたい場合は、マクロタスク (setTimeout など) を使う。</code></pre>

#### Node.js のイベントループ

Node.js では、イベントループがいくつかの**フェーズ**に分かれていて、フェーズごとに専用のキューがある。

| フェーズ | 主に処理するもの |
| --- | --- |
| timers | `setTimeout` / `setInterval` のコールバック |
| pending callbacks | 一部のシステムレベルのコールバック |
| poll | I/O (ファイル、ネットワーク) の完了コールバック。必要に応じて、ここで待機する。 |
| check | `setImmediate` のコールバック |
| close callbacks | `close` イベントなどのコールバック |

- マイクロタスクは、ブラウザと同様に、各コールバックの実行後に空になるまで実行される。
- `process.nextTick()` のコールバックは、Promise のマイクロタスクよりも先に実行される。
- `setTimeout(fn, 0)` と `setImmediate(fn)` の実行順は、メインモジュールから呼んだ場合は保証されない (I/O コールバックの中から呼んだ場合は、`setImmediate` が先)。

```javascript
process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promise"));

// nextTick → promise の順に出力される
```

<pre><code class="example">// Rustで言うと
// 実行環境が完了を検知して、続きの処理をキューに積む
//   ≒ Waker が、準備できたタスクを executor に再スケジュールする
// イベントループがキューから取り出して実行する
//   ≒ executor が、タスクを poll する
// JS ではこの仕組みが言語と実行環境に組み込まれていて、
// executor を自分で用意したり選んだりする必要はない</code></pre>

---

### Promise

Promise は、将来得られる結果を表すオブジェクト。JavaScript は元々非同期処理 (ネットワーク通信、ファイル読み込み、タイマーなど) が多く、コールバックを入れ子にしていくと読みにくくなる (コールバック地獄) ため、その結果を扱いやすくするために導入された。

Promise は3つの状態を持ち、Pending から Fulfilled または Rejected へ1度だけ移行できる。成功か失敗のどちらかになった状態を、**決着 (settled)** したという。<br>
状態を移行した後に <span class="code-like">resolve()</span> や <span class="code-like">reject()</span> を呼んでも無視される。

| 状態 | 説明 |
| --- | --- |
| Pending | 処理中 (待機中) |
| Fulfilled | 成功 |
| Rejected | 失敗 |

#### Promise の生成

<span class="code-like">new Promise()</span> に渡すコールバック関数 (executor) は、次の2つの引数を受け取る。

- 第1引数 (resolve): 成功として呼び出す。Fulfilled になり、値がセットされる。
- 第2引数 (reject): 失敗として呼び出す。Rejected になり、エラーがセットされる。

```javascript
const promise = new Promise((resolve, reject) => {
    const ok = true;

    if (ok) {
        resolve("成功");
    } else {
        reject(new Error("失敗"));
    }
});
```

- executor は `new Promise()` を呼んだ時点で**すぐに同期的に実行される**。`then` や `await` を書いた時に動き始めるわけではない。
- `reject` には、`throw` と同様に Error オブジェクトを渡すのが一般的。
- executor の中で例外が発生した場合は、自動的に `reject` が呼ばれたことになる。

<pre><code class="example">// Rustで言うと
enum PromiseState&lt;T, E&gt; {
    Pending,
    Fulfilled(T),
    Rejected(E),
}</code></pre>

すでに結果が分かっている値を Promise にしたい場合は、次のショートカットを使う。

| メソッド | 説明 |
| --- | --- |
| `Promise.resolve(value)` | Fulfilled な Promise を返す。 |
| `Promise.reject(error)` | Rejected な Promise を返す。 |

#### 結果を取り出す

Promise から結果を取り出すときには、<span class="code-like">.then()</span> か <span class="code-like">await</span> で Fulfilled の値を取り出し、<span class="code-like">.catch()</span> で Rejected の値を取り出す。<span class="code-like">.finally()</span> は、成功・失敗を問わず最後に実行される (後片付けなどに使う)。

<pre><code class="caution">try/catch で Rejected を捕捉できるのは、await と組み合わせた場合のみ。.then() を使う場合は .catch() で受け取る。</code></pre>

##### 成功した時

```javascript
promise.then(value => {
    console.log(value);
});
```

##### 失敗した時

```javascript
promise.catch(error => {
    console.error(error);
});
```

##### まとめて記述

```javascript
const promise = new Promise((resolve, reject) => {
    const ok = false;
    if (ok) {
        resolve("成功");
    } else {
        reject(new Error("失敗"));
    }
}).then((value) => {
    console.log(value);
}).catch((error) => {
    console.error(error);
}).finally(() => {
    console.log("成功・失敗を問わず実行");
})
```

##### then をつなぐ (チェーン)

`then()` は、コールバックの戻り値を結果とする**新しい Promise** を返す。そのため、`.then().then()` と続けて、処理を順番につなげられる。

- コールバックが**値**を返すと、その値がそのまま次の `then` に渡る。
- コールバックが **Promise** を返すと、その決着を待ってから、結果が次の `then` に渡る。
- チェーンのどこかで失敗 (Rejected や例外) すると、以降の `then` は飛ばされて、最も近い `catch` に処理が移る。

```javascript
fetch("/api/user")
    .then((response) => response.json())    // Promise を返す → 完了を待って次へ
    .then((user) => user.name)              // 値を返す → そのまま次へ
    .then((name) => console.log(name))
    .catch((error) => console.error(error)) // どこで失敗してもここに来る
    .finally(() => console.log("終了"));
```

<pre><code class="caution">Rejected の Promise を catch (または try/catch) で受け取らずに放置すると、未処理のエラーになる。
ブラウザではコンソールにエラーが出力され (unhandledrejection イベントが発生する)、Node.js ではプロセスが異常終了することがある。</code></pre>

#### 複数の Promise を扱う

複数の Promise をまとめて待つメソッド。どれも、渡した Promise はすでに動き始めていて、その決着をどう扱うかが違うだけ。

| メソッド | 結果 | 失敗となる条件 |
| --- | --- | --- |
| `Promise.all` | すべて成功した時に、値の配列 (渡した順) を返す。 | 1つでも失敗した時点で、すぐに Rejected になる。 |
| `Promise.allSettled` | すべてが決着してから、各結果の配列を返す。 | 失敗しない (常に Fulfilled)。 |
| `Promise.race` | 最初に決着したものの結果を採用する (成功・失敗を問わない)。 | 最初に決着したものが失敗なら Rejected。 |
| `Promise.any` | 最初に成功したものの値を採用する。 | すべて失敗した時に、AggregateError で Rejected になる。 |

##### Promise.all

すべての Promise を同時に待ち、すべての完了を待ってから処理を行う。<br>
1つでも失敗 (Rejected) した場合は、その時点で全体が Rejected になる。成功・失敗を問わずすべての結果が必要な場合は Promise.allSettled() を使う。

```javascript
const [a, b] = await Promise.all([
    fetch("/a"),
    fetch("/b")
]);
```

##### Promise.allSettled

結果は、成功なら `{ status: "fulfilled", value }`、失敗なら `{ status: "rejected", reason }` というオブジェクトの配列になる。

```javascript
const results = await Promise.allSettled([
    fetch("/a"),
    fetch("/b")
]);

for (const result of results) {
    if (result.status === "fulfilled") {
        console.log(result.value);
    } else {
        console.error(result.reason);
    }
}
```

##### Promise.race

最初に完了したもの (成功・失敗を問わない) の結果を採用する。処理にタイムアウトを付けたい場合によく使われる。

```javascript
const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("タイムアウト")), 5000);
});

try {
    const response = await Promise.race([fetch("/slow"), timeout]);
} catch (error) {
    console.error(error);
}
```

<pre><code class="caution">Promise.race で負けた側の処理は、中止されずに動き続ける。fetch を中止したい場合は AbortController を使う。</code></pre>

##### Promise.any

最初に**成功した**ものの値を採用する。複数のサーバーのうち、最初に応答したものを使いたい場合などに使う。

```javascript
try {
    const response = await Promise.any([
        fetch("/server1/data"),
        fetch("/server2/data")
    ]);
} catch (error) {
    // すべて失敗した場合のみここに来る (error は AggregateError)
    console.error(error.errors);
}
```

---

### async

async/await は Promise をより使いやすくする仕組みで、Promise を前提として作られており、新しい非同期の仕組みが登場したわけではない。<br>
async が付いた関数の役割は次の2つ。

- 戻り値が必ず Promise になる。
- 関数内で await を使えるようにする (async が無いと await が使えない)。

<pre><code class="tips">await は async が付いた関数の中でしか使えない (モジュールのトップレベルでは例外的に使える)。
await の位置で Promise の結果が返ってくるまで、その関数の実行を中断する。
await は成功 (Fulfilled) を受け、Promise を剥がして値そのものにする。
失敗 (Rejected) は、try/catch で受ける。</code></pre>

async 関数は、次のどの形でも書ける。

```javascript
async function fn() {}              // 関数宣言
const fn2 = async function () {};   // 関数式
const fn3 = async () => {};         // アロー関数
const obj = { async method() {} };  // メソッド
```

#### 戻り値は Promise

async が付いた関数の戻り値は自動的に Promise でラップされる (Promise を返す関数となる)。<br>
async 関数は直接 Promise を返すこともでき、その際は二重にラップされず平坦化される。

戻り値が Promise であることを明示的にするために async を付けてもいい。ただし、呼び出し側は非同期関数として扱う必要がある (戻り値は Promise)。

```javascript
async function hello() {
    return "Hello";
}
```

上記の関数は一見すると文字列を返すだけに見えるが、内部的には次のようなイメージで Promise を返す。

```javascript
function hello() {
    return Promise.resolve("Hello");
}
```

また、async 関数の中で例外を投げた場合は、

```javascript
async function test() {
    throw new Error("Oops");
}
```

次と同じイメージ (Rejected な Promise を返す)。

```javascript
function test() {
    return Promise.reject(new Error("Oops"));
}
```

呼び出し側で `await` (または `.then()`) を付けずに呼ぶと、値ではなく Promise が手に入る。

```javascript
const value = hello();
console.log(value);         // Promise { <pending> } などが出力される

const value2 = await hello();
console.log(value2);        // "Hello"
```

#### await の動き

`await` は、スレッドを止めて待つのではなく、**その async 関数だけを中断して、制御を呼び出し元 (イベントループ) に返す**。待っている Promise が決着すると、`await` より後の処理がマイクロタスクとして再開される。

```javascript
async function main() {
    console.log("A");
    await Promise.resolve();   // ここで main は中断され、呼び出し元に制御が戻る
    console.log("C");          // 後でマイクロタスクとして再開される
}

main();
console.log("B");

// A → B → C の順に出力される
```

<pre><code class="example">// Rustで言うと
// JS の await   : その関数だけを中断して、スレッドは他の処理に使われる (Rust の .await と同じ)
// スレッドを止めて待つ処理 (std::thread::sleep のようなもの) とは別物</code></pre>

`await` の右側は Promise でなくてもよい。Promise 以外の値の場合は、そのまま値として扱われる (ただし、`await` の位置で一度中断されて、後から再開される)。

#### エラー処理

`await` した Promise が Rejected になると、その位置で例外が `throw` されるため、同期処理と同じ `try/catch/finally` で受け取れる。

```javascript
async function run() {
    try {
        const value = await riskyTask();   // Rejected なら、ここで例外になる
        console.log(value);
    } catch (error) {
        console.error(error);
    } finally {
        console.log("成功・失敗を問わず実行");
    }
}
```

<pre><code class="caution">try の中で Promise を await せずに return すると、その Promise が Rejected になっても catch されない。
catch で受けたい場合は return await と書く。

async function a() {
    try {
        return riskyTask();         // 失敗しても catch されない
    } catch (error) { /* 実行されない */ }
}

async function b() {
    try {
        return await riskyTask();   // ここで待つので、失敗すれば catch される
    } catch (error) { /* 実行される */ }
}</code></pre>

#### 直列と並列

`await` を順番に書くと、前の処理が終わってから次の処理が始まる (直列)。互いに依存しない処理は、`Promise.all` でまとめて待つと待ち時間が重なる (並列)。

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 直列: 合計 約2秒
async function serial() {
    await sleep(1000);
    await sleep(1000);
}

// 並列: 合計 約1秒
async function parallel() {
    await Promise.all([sleep(1000), sleep(1000)]);
}
```

Promise は生成した時点で動き始める。`await` は「結果をどこで待つか」を決めているだけなので、先に両方を生成してから `await` しても並列になる。

```javascript
const p1 = sleep(1000);   // 生成した時点でタイマーが開始される
const p2 = sleep(1000);

await p1;
await p2;                 // 合計 約1秒
```

ループで非同期処理を行う場合も同様。

```javascript
// for...of + await: 1件ずつ順番に処理する (直列)
for (const id of ids) {
    await processItem(id);
}

// map + Promise.all: すべて同時に開始する (並列)
await Promise.all(ids.map((id) => processItem(id)));
```

<pre><code class="caution">forEach に async 関数を渡しても、forEach は Promise の完了を待たない。
すべての完了を待ちたい場合は、for...of + await か、map + Promise.all を使う。

ids.forEach(async (id) => {
    await processItem(id);
});
console.log("ここは processItem の完了前に実行される");</code></pre>

#### よくある間違い

| 間違い | 結果 |
| --- | --- |
| `await` を付け忘れる | 値ではなく Promise が返り、`Promise { <pending> }` などが出力される。エラーも捕捉されない。 |
| async が無い関数の中で `await` を使う | SyntaxError になる (モジュールのトップレベルを除く)。 |
| 依存しない処理を `await` で1つずつ待つ | 動作はするが、待ち時間が足し算になって遅くなる。 |
| `forEach` に async 関数を渡す | 完了を待たずに次の処理に進む。 |
| try の中で `await` せずに return する | Rejected になっても catch されない。 |

#### トップレベル await

ES モジュール (`<script type="module">` や `.mjs`) では、async 関数の外 (モジュールの最上位) でも `await` を使える。

```javascript
// module として読み込まれたファイル
const response = await fetch("/data.json");
const data = await response.json();
```

#### TypeScript <span class="label">TS</span>

async 関数の戻り値の型は、`Promise<値の型>` と書く。

```typescript
async function getName(): Promise<string> {
    return "Taro";   // return する値は string だが、関数の戻り値の型は Promise<string>
}
```

---

### コールバック、Promise、async/await の違い

同じ処理 (1秒ごとに 3, 2, 1 を出力する) を、3通りの書き方で比較する。

#### コールバック関数

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

#### Promise

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

#### async/await

```javascript
const log = (num) => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(num);
            resolve();
        }, 1000);
    });
};

const func = async () => {
    await log(3);
    await log(2);
    await log(1);
};

func();
```

コールバック形式の `setTimeout` を、Promise を返す関数に包むことを **Promise 化** という。待つだけの関数 (`sleep`) にしておくと、ループとも組み合わせやすい。

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const countdown = async () => {
    for (const num of [3, 2, 1]) {
        await sleep(1000);
        console.log(num);
    }
};

countdown();
```

#### 比較

| | コールバック | Promise | async/await |
| --- | --- | --- | --- |
| 書き方 | 完了時に呼ばれる関数を渡す | `then` をつなげる | 同期処理のように上から下へ書く |
| 順番に処理 | ネストが深くなる (コールバック地獄) | チェーンでフラットに書ける | `for` などのループもそのまま使える |
| エラー処理 | コールバックごとに個別に書く | `catch` でまとめて受ける | `try/catch` でまとめて受ける |
| 並列処理 | 完了数を数えるなど自前で管理する | `Promise.all` など | `Promise.all` + `await` |

async/await は、Promise を同期処理に近い見た目で書ける構文。内部では Promise と同じ仕組みで動くため、`then` / `catch` と混在させても問題ない。新しく書く場合は、基本的に async/await を使い、並列処理が必要な場面で `Promise.all` などを組み合わせる。

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
    throw new Error(メッセージ);
} catch (例外識別子) {
    例外が発生したときの処理;
}
```

throw には、Error オブジェクトを渡すのが一般的。

---

## 組み込み関数・メソッド <a id="methods" data-name="組み込み関数・メソッド"></a>

### fetch

サーバーからデータやファイルを取得する非同期関数。

```javascript
fetch("URL"[, options])
```

- 第1引数: リクエストを送信する URL を文字列で渡す。
- 第2引数 (省略可): リクエスト送信時のオプションをオブジェクトで指定する。代表的なプロパティは以下の通り。

  | プロパティ | 説明 |
  | --- | --- |
  | method | <code>POST &#124; GET &#124; PUT &#124; DELETE</code> などのリクエストメソッドを文字列で指定する<br>デフォルトは `GET` |
  | headers | リクエストの header を変更するときに指定する<br>`headers: {"Content-Type": "application/json"}` |
  | body | リクエストの body を挿入したいときに指定する。<br>`body: JSON.stringify(obj)` |

- 戻り値は、Response オブジェクトを Promise でラップしたもの。代表的なプロパティやメソッドは以下の通り。

  | プロパティ | 説明 |
  | --- | --- |
  | Response.ok | 200~299 の HTTP ステータスが返された場合は `true`、それ以外は `false` が格納される。 |
  | Response.status | HTTP ステータスコードが格納される。 |
  | Response.headers | レスポンスのヘッダー情報が Headers オブジェクトとして格納される。 |

  | メソッド | 説明 |
  | --- | --- |
  | Response.json() | レスポンスボディの JSON 文字列を処理する時に使う。オブジェクトに変換した値を Promise でラップして返す。 |
  | Response.blob() | バイナリデータを含むレスポンスを処理する時に使う。Blob オブジェクトを Promise でラップして返す。 |
  | Response.text() | レスポンスボディを文字列として取得する時に使う。文字列を Promise でラップして返す。 |

  <pre><code class="caution">fetch() の Promise は、ネットワークエラーなどで通信自体に失敗した場合のみ Rejected になる。サーバーから 404 や 500 などのエラーが返ってきた場合は Fulfilled として返ってくるため、response.ok を確認する二段構えにする。</code></pre>
  ```javascript
  try {
    const response = await fetch('/dummyData.json');

    if (!response.ok) {
      throw new Error(`サーバーエラー: ${response.status}`);
    }

    const data = await response.json();
  } catch (error) {
    // 通信失敗 (Rejected) と HTTP エラー (上で throw) の両方をここで処理する
    console.error(error);
  }
  ```

### 配列系

#### sort

元の配列を書き換えて並べ替える (書き換えたくない場合は toSorted() を使う)。文字列の比較には localeCompare() を使う。

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

一部を切り出す。指定した範囲 (start 以上 end 未満) をコピーして返す。元の配列は変化しない。

```javascript
const first3 = items.slice(0, 3)
```

#### flatMap

map した結果をフラット化する。

```javascript
const result = users.flatMap(
  user => user.tags
)
```

#### map

各要素を変換した新しい配列を返す。

```javascript
const nums = [1, 2, 3]

const doubled = nums.map(n => n * 2)

console.log(doubled) // [2, 4, 6]
```

#### filter

条件を満たす要素だけを集めた新しい配列を返す。<br>
Vue の検索 UI での使用例。

```javascript
const filtered = users.value.filter(
  u => u.name.includes(keyword.value)
)
```

#### find

条件を満たす最初の1件だけを取得する (見つからなければ undefined)。

```javascript
const user = users.find(u => u.id === 10)
```

#### some

1件でも条件を満たすかどうかを真偽値で返す。

```javascript
const hasAdmin = users.some(u => u.role === "admin")
```

#### every

すべての要素が条件を満たすかどうかを真偽値で返す。

```javascript
const allChecked = items.every(i => i.checked)
```

#### reduce

配列を1つの値にまとめる (合計など)。第2引数は初期値。

```javascript
const total = prices.reduce(
  (sum, price) => sum + price,
  0
)
```

### 文字列系

#### includes

含まれているかどうかを真偽値で返す。

```javascript
"hello".includes("ell")
```

#### startsWith, endsWith

特定の文字列で始まるか、終わるかを真偽値で返す。

```javascript
const str = "Hello World";
console.log(str.startsWith("Hello")); // true
console.log(str.startsWith("World")); // false

console.log(str.endsWith("World")); // true
console.log(str.endsWith("Hello")); // false
```

#### trim

前後の空白を除去する。

```javascript
input.trim()
```

#### join

指定した区切り文字で配列の要素を連結し、文字列として返す。<br>
引数を省略するとカンマ(,)で区切られる。

```javascript
const fruits = ['りんご', 'みかん', 'バナナ'];
console.log(fruits.join()); // 出力: "りんご,みかん,バナナ"

const words = ['J', 'A', 'V', 'A'];
console.log(words.join('')); // 空文字指定でくっつく
// 出力: "JAVA"

const array = ['A', null, 'B', undefined, 'C'];
console.log(array.join('-')); // null, undefined は空文字として扱われる
// 出力: "A--B--C"

const lines = ['一行目', '二行目'];
console.log(lines.join('\n')); // 改行で区切る
```

#### split

指定した区切り文字で文字列を分割して、配列として返す。<br>
引数を省略すると、文字列全体を1要素とする配列が返る。

```javascript
const text = 'こんにちは';
console.log(text.split()); 
// 出力: ["こんにちは"]

const word = 'HTML';
console.log(word.split('')); // 空文字指定で1文字ずつ
// 出力: ["H", "T", "M", "L"]

const date = '2026/05/14';
console.log(date.split('/')); 
// 出力: ["2026", "05", "14"]
```

第2引数に整数を渡すと受け取る配列の最大要素数を制限できる。

```javascript
const text = 'りんご,みかん,バナナ,ぶどう';
console.log(text.split(',', 2)); 
// 出力: ["りんご", "みかん"] (3つ目以降は無視される)
```

### オブジェクト系

#### Object.keys

キーの一覧を配列で返す。

```javascript
const obj = {
  a: 1,
  b: 2
}

Object.keys(obj) // ["a", "b"]
```

#### Object.values

値の一覧を配列で返す。

```javascript
Object.values(obj) // [1, 2]
```

#### Object.entries

キーと値のペア `([key, value] の配列)` を返す。for...of と分割代入を組み合わせると、キーと値を同時に扱える。Vue でも便利。

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

オブジェクトを JSON 文字列に変換する。

```javascript
const json = JSON.stringify(user)
```

#### JSON.parse

JSON 文字列をオブジェクトに変換する。

```javascript
const obj = JSON.parse(json)
```

#### response.json

<span class="code-like">fetch()</span> の戻り値である Response オブジェクトのレスポンスボディを JSON としてパースし、オブジェクトを Promise で返す。

```javascript
const response = await fetch(url);
const data = await response.json();
```

---

## DOM <a id="dom" data-name="DOM"></a>

### window

<pre><code class="tips">window のプロパティやメソッドは、window. を省略して記述できる。(例) window.alert("hello!") は alert("hello!") と書ける。</code></pre>

#### メソッド

| メソッド | 説明 | 例 |
| --- | --- | --- |
| `window.alert(message)` | アラートダイアログを表示して、スクリプトの実行を一時停止する。 | `window.alert("hello!");` |
| `window.confirm(message)` | **OK** と **キャンセル** ボタンを持つダイアログを表示する。<br>それぞれ `true` と `false` を返す。 | `const ok = window.confirm("削除しますか?");` |
| `window.console.log(message)` | コンソールに文字列を出力する。 | `console.log("hello");` |
| `window.console.error(message)` | コンソールにエラーメッセージを出力する。 | `console.error("error");` |

---

### window.location

location インターフェイスは、関連付けられたオブジェクトの場所 (URL) を表す。変更を行うと、関連するオブジェクトに反映される。

<pre><code class="tips">window.location および document.location でアクセスできる。基本は window.location を使う。</code></pre>

#### プロパティ

<span class="code-like">(例) https://example.org:8080/foo/bar?q=baz#bang</span>

| プロパティ | 説明 | 例の値 |
| --- | --- | --- |
| `href` | URL全体を含めた文字列。この値を変更すると新しいページへ移動する。 | `https://example.org:8080/foo/bar?q=baz#bang` |
| `host` | URLのホスト(ホスト名:ポート番号)。 | `example.org:8080` |
| `protocol` | 末尾の `:` を含むURLのプロトコルスキーム。 | `https:` |
| `hostname` | URLのドメイン(ポート番号は含まない)。 | `example.org` |
| `port` | URLのポート番号。 | `8080` |
| `pathname` | 先頭の `/` に続くパス部分。クエリやフラグメントは含まない。 | `/foo/bar` |
| `search` | `?` とそれに続くクエリ文字列。 | `?q=baz` |
| `hash` | `#` とそれに続くフラグメント識別子。 | `#bang` |
| `origin` | 特定の位置のオリジンの正規形(読み取り専用)。 | `https://example.org:8080` |

#### メソッド

| メソッド              | 説明                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `location.assign(url)`  | 引数で指定したURLのリソースを読み込む。 |
| `location.reload()`     | 再読み込みボタンのように現在のURLを再読み込みする。 |
| `location.replace(url)` | 現在のリソースを指定したURLのリソースで置き換える。assign との違いは履歴に残らないことで、戻るボタンで戻れない。 |
| `location.toString()`   | URL全体を文字列で返す。`location.href` と同様だが、値を変更するために使用できない。 |

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
        <td>stateObj: 後に popstate イベントで取り出せる値 (シリアライズ可能なオブジェクトまたは null)。<br>
        title: ほとんどのブラウザで無視される (空文字 "" でよい)。<br>
        url: 相対または絶対パス (同一オリジンの必要あり)。<br>
        現在のページ履歴の次に新しい履歴エントリが追加される。戻るボタンで元のページに戻れる。ページの読み込みは行われない。
        </td>
    </tr>
    <tr>
        <td>history.replaceState(stateObj, title, url)</td>
        <td>引数は pushState と同じ。現在の履歴エントリを上書きする。戻るボタンで上書き前の状態には戻れない。ページの読み込みは行われない。<br>
        初期化や URL の修正 (例: ハッシュやクエリ) などで履歴を汚さずに更新したい時や、何らかのユーザーのアクションを受けて現在の履歴項目を更新したい場合に使う。</td>
    </tr>
    <tr>
        <td>history.back()</td>
        <td>ブラウザの戻るボタンを押したときと同じ動作 (1つ前のページへ戻る)。</td>
    </tr>
    <tr>
        <td>history.forward()</td>
        <td>ブラウザの進むボタンを押したときと同じ動作 (1つ先のページへ進む)。</td>
    </tr>
    <tr>
        <td>history.go(n)</td>
        <td>現在のページからの相対位置 n の履歴へ移動する。負数で戻り、正数で進む。0 を指定すると再読み込みされる。</td>
    </tr>
</table>


---

### document

| メソッド                                | 説明                                                                                       | 例                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| `document.getElementById("id")`         | idで要素を取得する。 | `document.getElementById("test-button");` |
| `document.getElementsByName("name")`    | name属性で要素を取得する。複数の要素を NodeList で返す。 | `document.getElementsByName("user");` |
| `document.querySelector("selector")`    | **#id**、**.class**、**タグ名**などのCSSセレクターで検索して、最初に見つかった要素を返す。見つからなければ `null` を返す。 | `document.querySelector("#login-form");` |
| `document.querySelectorAll("selector")` | CSSセレクターで検索して、見つかった要素すべてを NodeList で返す。配列ではないので、`map` などを使いたい場合は `Array.from()` で変換する。 | `document.querySelectorAll(".item");` |
| `document.createElement("element")`     | 新たに要素を作成する。 | `const newDiv = document.createElement("div");` |

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

<a id="popstate"></a>

| イベント名 | 説明 |
| --- | --- |
| `DOMContentLoaded` | `document.addEventListener("DOMContentLoaded", () => {})`<br>とすると、DOMの構築が完了した時点で関数が実行される(画像などの読み込み完了は待たない)。 |
| `popstate` | `window.addEventListener("popstate", (event) => {event.state;})`<br>とすると、戻る・進むなどで履歴が移動したときに関数が実行される。<br>`event.state` で、pushState または replaceState で指定した stateObj にアクセスできる。<br>コールバック関数に、その状態に応じたページを表示する処理を記述する。 |
| `change` | 値の変更が確定した(フォーカスが外れた、選択が変わったなど) |
| `input` | 入力された(入力のたびに発生する) |
| `click` | クリックされた(押して離す) |
| `dblclick` | ダブルクリックされた |
| `mousedown` | マウスのボタンが押された |
| `mouseup` | マウスのボタンが離された |
| `mousemove` | 要素上でマウスが動いた |
| `mouseover` | 要素にマウスが乗った |
| `mouseout` | 要素からマウスが離れた |
| `contextmenu` | 右クリックが押された |
| `keydown` | キーが押された |
| `keyup` | キーが離れた |
| `focus` | 要素にフォーカスされた |
| `blur` | 要素のフォーカスが外れた |
| `submit` | フォームが送信された |
| `load` | スタイルシートや画像などすべてのリソースの読み込みが完了した |
| `scroll` | 画面がスクロールされた |
| `reset` | フォームがリセットされた |
| `resize` | 画面のサイズが変わった |
| `select` | テキストを選択した |
| `copy` | コピーされた |
| `paste` | ペーストされた |

<pre><code class="tips">element.addEventListener("イベント", (event) => {}); // 関数の引数 event で、発生したイベントの情報を受け取れる。</code></pre>

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
| `element.appendChild(element)` | 子要素として、末尾に要素を追加する。 | `parentElm.appendChild(newDiv)` |
| `element.innerHTML` | 要素の内容を書き換える。<br>HTMLタグが解釈されて適用されるため、XSS(クロスサイトスクリプティング)のリスクがある。ユーザーの入力などには使用しない。 | `element.innerHTML = "変更後の文字列"` |
| `element.textContent` | 要素の内容を書き換える。<br>HTMLタグを解釈せず、すべてテキストとして扱うので、XSSのリスクがない。 | `element.textContent = "変更後の文字列"` |
| `element.insertAdjacentHTML("挿入位置", "挿入内容")` | 指定した挿入位置に内容を挿入する。innerHTML と同様に HTML として解釈されるので、XSSに注意する。挿入位置の指定は以下の通り。<br>`beforebegin`: 要素の直前に挿入<br>`afterbegin`: 要素内部の、最初の子要素の前に挿入<br>`beforeend`: 要素内部の、最後の子要素の後に挿入<br>`afterend`: 要素の直後に挿入 | `element.insertAdjacentHTML("beforeend", "<li>newItem</li>")` |

#### カスタムデータと属性へのアクセス

| メソッド/プロパティ | 説明 | 例 |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `element.dataset.データ名`                           | カスタムデータへのアクセス。<br>`data-user-name`と書いた場合、`element.dataset.userName`とキャメルケースに変換される。 | `value = element.dataset.name`            |
| `element.getAttribute("属性名")`                     | 指定した属性の値を取得する。                                                                                           | `value = element.getAttribute("data-id")` |
| `element.setAttribute("属性名", "値")`               | 属性の値を設定(変更)する。                                                                                                         | `element.setAttribute("data-id", "456")`  |
| `element.classList.add("クラス名"[, クラス名, ...])` | 指定したクラスを要素に追加する。複数指定可能。 | `element.classList.add("blue")` |
| `element.classList.remove("クラス名")` | 指定したクラスを要素から削除する。 | `element.classList.remove("blue")` |
| `element.classList.toggle("クラス名")` | 指定したクラスがあれば削除し、なければ追加する。 | `element.classList.toggle("blue")` |
| `element.removeAttribute("属性名")`                  | 属性を削除する。                                                                                                       | `element.removeAttribute("data-id")`      |
| `element.style.スタイル名`                           | インラインスタイルを変更する。<br>ハイフン区切りのプロパティ名はキャメルケースで指定する(例: `backgroundColor`)。                                                                                                        | `element.style.color = "red"`             |



---

## 実行方法 <a id="how-to-do-it" data-name="実行方法"></a>

- 外部ファイル: 拡張子を .js とした別ファイルにコードを記述して、HTML 側で script タグの src 属性にパスを指定する。

```html
<script src="test.js"></script>
```

- **script** タグに直接記述する。

```html
<script>
    window.alert("hello!");
</script>
```

<pre><code class="caution">スクリプトファイルを読み込む位置によっては、HTML 文書がすべて読み込まれる前にコードが実行されてしまい、<br>要素の取得ができないなどの理由でエラーとなる可能性があるため、以下のいずれかの対策をする必要がある。
<ul><li>&lt;script&gt;タグの属性に defer を指定する。</li>
    <li>&lt;body&gt;タグの一番最後にスクリプトファイルを読み込む指定をする。</li>
    <li>DOMContentLoaded イベントの中に処理を記述する。<br>document.addEventListener("DOMContentLoaded", () => {})</li></ul></code></pre>

---

## 例 <a id="example" data-name="例"></a>

### よくある form の例

<pre><code class="example">&lt;form id="login-form"&gt;
  &lt;input name="user"&gt;
  &lt;input name="password" type="password"&gt;
  &lt;button type="submit"&gt;ログイン&lt;/button&gt;
&lt;/form&gt;</code></pre>

<pre><code class="example">const form = document.querySelector("#login-form");

form.addEventListener("submit", async (e) =&gt; {
  e.preventDefault();  // 通常送信を止める

  const formData = new FormData(form);

  await fetch("/login", {
    method: "POST",
    body: formData
  });
});</code></pre>

---

## 落とし穴 <a id="pitfalls" data-name="落とし穴"></a>

エラーにならずに動いてしまうため、知らないと原因に気づきにくい挙動をまとめる。

### return の直後で改行する

`return` の直後で改行すると、セミコロンが自動挿入されて `return;` と解釈される。

```javascript
function getUser() {
  return
  {
    name: "Taro"
  }
}
console.log(getUser()); // undefined
```

<pre><code class="caution">戻り値は return と同じ行から書き始める。複数行にしたい場合は return &#40; や return &#123; のように、開き括弧を return と同じ行に置く。
throw、break、continue も、直後で改行すると同様に扱われる。</code></pre>

### セミコロンを省略して行頭が &#40; &#91; ` で始まる

セミコロンを付けない書き方では、次の行が `(`、`[`、`` ` ``、`+`、`-`、`/` で始まると、前の行の続きとして解釈される。

```javascript
const x = 1
const y = x
(function () { console.log("IIFE") })()
// TypeError: x is not a function
// x(function () {...})() と解釈されてしまう
```

<pre><code class="caution">セミコロンなしで書く場合は、&#40; や &#91; で始まる行の先頭に ; を付ける
(例) ;[1, 2].forEach(...)</code></pre>

### for...in で配列を回す

`for...in` で取り出される index は、数値ではなく**文字列**になる。

```javascript
const arr = [10, 20, 30];
for (const i in arr) {
  console.log(i + 1); // "01", "11", "21" (数値の足し算にならない)
}
```

さらに、配列に追加されたプロパティやプロトタイプの列挙可能なプロパティも対象になる。配列は `for...of` を使い、index が必要なら `entries()` を使う。

```javascript
for (const [i, value] of arr.entries()) {
  console.log(i + 1, value); // 1 10 / 2 20 / 3 30
}
```

### 小数の計算に誤差が出る

数値は2進数の浮動小数点数で保持されるため、10進数の小数は正確に表せないことがある。

```javascript
console.log(0.1 + 0.2);              // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);      // false
console.log((0.1 + 0.2).toFixed(2)); // "0.30" (toFixed は数値ではなく文字列を返す)
```

<pre><code class="caution">金額などは、円やセントなどの最小単位の整数で計算する。
小数の比較は、差が十分小さいかどうかで判定する (例: Math.abs(a - b) &lt; 0.000001)。
整数でも Number.MAX_SAFE_INTEGER (9007199254740991) を超えると正確に扱えないため、大きな整数は BigInt を使う。</code></pre>

### + は文字列結合になる

片方が文字列だと、`+` は足し算ではなく文字列の結合になる。`-` `*` `/` は数値に変換して計算する。

```javascript
console.log("1" + 2);      // "12"
console.log("3" - 1);      // 2
console.log(1 + 2 + "3");  // "33" (左から順に評価)
console.log("1" + 2 + 3);  // "123"
```

<pre><code class="caution">input 要素の value は常に文字列。計算する前に Number() で数値に変換する。</code></pre>

### 文字列から数値への変換

```javascript
["1", "2", "3"].map(parseInt); // [1, NaN, NaN]
```

`map` は callback に (要素, index, 配列) を渡すため、`parseInt` の第2引数 (基数) に index が渡されてしまう。

```javascript
["1", "2", "3"].map(Number);                // [1, 2, 3]
["1", "2", "3"].map((s) => parseInt(s, 10)); // [1, 2, 3]
```

| 式 | 結果 | 備考 |
| --- | --- | --- |
| `Number("")` | `0` | 空文字や空白だけの文字列は 0 になる |
| `Number(null)` | `0` | |
| `Number(undefined)` | `NaN` | |
| `Number("12px")` | `NaN` | 文字列全体が数値でないと NaN |
| `parseInt("12px", 10)` | `12` | 先頭から読めるところまで変換する |
| `NaN === NaN` | `false` | NaN の判定は `Number.isNaN(value)` を使う |

### 真偽値としての扱い (falsy / truthy)

条件式で `false` として扱われる値 (falsy) は次の8つだけで、それ以外はすべて `true` (truthy) として扱われる。

`false`、`0`、`-0`、`0n`、`""` (空文字)、`null`、`undefined`、`NaN`

```javascript
if ([]) { console.log("実行される"); }   // 空配列は truthy
if ({}) { console.log("実行される"); }   // 空オブジェクトも truthy
if ("0") { console.log("実行される"); }  // 文字列 "0" も truthy

const count = 0;
console.log(count || 10); // 10 (0 が falsy のため、デフォルト値が使われる)
console.log(count ?? 10); // 0  (null と undefined のときだけデフォルト値が使われる)
```

<pre><code class="caution">0 や空文字が有効な値の場合に || でデフォルト値を指定すると、意図せず置き換わる。その場合は ?? を使う。</code></pre>

### オブジェクトや配列は参照で比較される

オブジェクトや配列は、中身ではなく参照 (同じものかどうか) で比較される。

```javascript
console.log([1, 2] === [1, 2]); // false
console.log({} === {});         // false

const a = [1, 2];
const b = a;        // コピーではなく、同じ配列への参照
b.push(3);
console.log(a);     // [1, 2, 3]

console.log([{ id: 1 }].includes({ id: 1 })); // false
```

<pre><code class="caution">オブジェクトを探すときは、includes や indexOf ではなく、find や some で条件を指定する。</code></pre>

### スプレッド構文のコピーは浅い

スプレッド構文 (`...`) や `Object.assign()`、`slice()` によるコピーは、1階層目だけのコピー (浅いコピー) になる。ネストしたオブジェクトや配列は参照が共有される。

```javascript
const user = { name: "Taro", address: { city: "Osaka" } };
const copy = { ...user };

copy.address.city = "Tokyo";
console.log(user.address.city); // "Tokyo" (元のオブジェクトも変わる)
```

ネストも含めてコピーする (深いコピー) には `structuredClone()` を使う。

```javascript
const deepCopy = structuredClone(user);
deepCopy.address.city = "Kyoto";
console.log(user.address.city); // "Tokyo" (元は変わらない)
```

<pre><code class="caution">structuredClone() は、関数を含むオブジェクトをコピーしようとするとエラーになる。
JSON.parse(JSON.stringify(obj)) でも深いコピーはできるが、Date が文字列になる、undefined が消えるなど、値が変わってしまう。</code></pre>

### JSON.stringify で値が消えたり変わったりする

```javascript
const obj = {
  a: undefined,
  b: () => {},
  c: NaN,
  d: new Date(0),
  e: new Map([[1, 2]])
};
console.log(JSON.stringify(obj));
// {"c":null,"d":"1970-01-01T00:00:00.000Z","e":{}}
```

| 値 | stringify の結果 |
| --- | --- |
| `undefined`、関数、Symbol | プロパティごと消える (配列の要素の場合は `null` になる) |
| `NaN`、`Infinity` | `null` になる |
| `Date` | ISO 形式の文字列になる (`JSON.parse` しても Date には戻らない) |
| `Map`、`Set` | 中身が失われて `{}` になる |

### this が変わる

メソッドを変数に代入したり、コールバックとして渡したりすると、`this` が元のオブジェクトではなくなる。

```javascript
const user = {
  name: "Taro",
  hello() {
    console.log(this.name);
  }
};

user.hello();              // "Taro"

const fn = user.hello;
fn();                      // this が user ではなくなるため "Taro" にならない

setTimeout(user.hello, 0); // 同様に "Taro" にならない
```

`this` を固定するには、`bind()` を使うか、アロー関数で呼び出しを包む。

```javascript
setTimeout(user.hello.bind(user), 0);   // "Taro"
setTimeout(() => user.hello(), 0);      // "Taro"
```

<pre><code class="caution">アロー関数は this を持たず、外側の this をそのまま使う。そのため、オブジェクトのメソッドをアロー関数で書くと、this はオブジェクトにならない。
イベントリスナーをアロー関数で書いた場合も this は要素にならないので、要素は event.currentTarget で取得する。</code></pre>

### Date の月は 0 始まり

```javascript
const d = new Date(2026, 0, 15);  // 2026年1月15日 (月は 0〜11 で指定する)
console.log(d.getMonth());        // 0 (1月)
console.log(d.getDay());          // 曜日 (0 が日曜日)。日にちは getDate()
```

文字列から Date を作る場合、形式によって UTC として扱われるかローカル時刻として扱われるかが変わる。

```javascript
new Date("2026-01-15");           // UTC の 0 時として扱われる (日本時間では 9 時)
new Date("2026-01-15T00:00:00");  // ローカル時刻の 0 時として扱われる
```

<pre><code class="caution">日付だけの ISO 形式 (2026-01-15) は UTC として扱われるため、日本より西のタイムゾーンでは、ローカル時刻で表示すると前日になることがある。</code></pre>

### オブジェクトのキーの順序

整数として扱えるキーは、書いた順番に関係なく小さい順に先頭に並び、それ以外の文字列キーは追加した順に並ぶ。

```javascript
const obj = { b: 1, 2: "x", a: 2, 1: "y" };
console.log(Object.keys(obj)); // ["1", "2", "b", "a"]
```

<pre><code class="caution">キーの追加順を保ちたい場合は Map を使う。</code></pre>

### forEach は途中で止められない

`forEach` の中の `return` は、その回のコールバックを抜けるだけで、ループ全体は止まらない (`for` 文の `continue` と同じ動きになる)。`break` は書けない。

```javascript
[1, 2, 3].forEach((n) => {
  if (n === 2) return;
  console.log(n);
});
// 1, 3 (2 だけ飛ばされて、3 まで実行される)
```

途中で止めたい場合は、`for...of` に `break` を書くか、`some`、`every`、`find` を使う。

### g フラグ付きの正規表現で test() を繰り返す

`g` フラグ付きの正規表現は、前回のマッチ位置 (`lastIndex`) を覚えている。同じ正規表現オブジェクトで `test()` や `exec()` を繰り返すと、結果が変わってしまう。

```javascript
const re = /a/g;
console.log(re.test("a")); // true
console.log(re.test("a")); // false (前回の続きから検索して、見つからずに lastIndex が 0 に戻る)
console.log(re.test("a")); // true
```

<pre><code class="caution">test() で判定するだけなら g フラグは付けない。
g フラグ付きの正規表現オブジェクトを変数に保持して使い回すと、状態が残るため特に注意する。</code></pre>

### 宣言より前に let / const を参照する (TDZ)

`let` と `const` は、宣言の行に到達するまで参照できない (一時的デッドゾーン)。`var` は `undefined` になるのでエラーにならず、挙動が異なる。

```javascript
console.log(a); // undefined (var は宣言前でも参照できる)
var a = 1;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 1;
```

<pre><code class="caution">関数の中で後ろに宣言した let / const の変数は、同名の外側の変数があっても、宣言前に参照するとエラーになる (外側の変数は参照されない)。</code></pre>

### then チェーンで return を忘れる

`then` の中で値を `return` しないと、次の `then` には `undefined` が渡される。Promise を返し忘れると、その完了も待たれない。

```javascript
fetch("/api/user")
  .then((res) => {
    res.json(); // return がない
  })
  .then((user) => {
    console.log(user); // undefined
  });
```

<pre><code class="caution">波括弧 { } を付けたアロー関数は、return を書かないと undefined を返す。値を返すなら return を書くか、波括弧を省略して式だけにする (res => res.json())。</code></pre>

### removeEventListener で解除できない

`removeEventListener` は、登録したときと**同じ関数**を渡さないと解除できない。無名関数やアロー関数は、書くたびに別の関数になる。

```javascript
// 解除できない (別々の関数になっている)
button.addEventListener("click", () => console.log("click"));
button.removeEventListener("click", () => console.log("click"));

// 解除できる (同じ関数を渡している)
const onClick = () => console.log("click");
button.addEventListener("click", onClick);
button.removeEventListener("click", onClick);
```

<pre><code class="caution">解除が必要なリスナーは、関数を変数に入れてから登録する。
addEventListener の第3引数に AbortController の signal を渡して、abort() でまとめて解除する方法もある。</code></pre>

### 文字列は書き換えられない

文字列は不変 (イミュータブル) で、インデックスを指定して代入しても変更されない。

```javascript
let str = "abc";
str[0] = "x";
console.log(str); // "abc" (エラーにならず、何も起きない)
```

<pre><code class="caution">strict モード (モジュールやクラスの中) では TypeError になる。
文字を置き換えたい場合は、replace() や slice() などで新しい文字列を作って再代入する。</code></pre>

### Math.round の丸め方

ちょうど `.5` のとき、`Math.round()` は正の無限大の方向に丸める。負の数では、四捨五入のイメージと逆になる。

```javascript
console.log(Math.round(2.5));  // 3
console.log(Math.round(-2.5)); // -2 (-3 ではない)
console.log(Math.round(-2.6)); // -3
```

<pre><code class="caution">銀行丸め (偶数丸め) ではなく、.5 のときは常に大きいほうに丸められる。
さらに、小数の誤差 (0.1 + 0.2 など) があるため、1.005 のように .5 に見えても期待通りに丸められないことがある。</code></pre>

### setMonth や setDate で日付があふれる

存在しない日付になる場合、エラーにならずに翌月以降の日付に繰り上がる。

```javascript
const d = new Date(2026, 0, 31); // 2026年1月31日
d.setMonth(1);                   // 2月に変更 → 2月31日は存在しない
console.log(d.getMonth() + 1, d.getDate()); // 3 3 (3月3日になる)
```

<pre><code class="caution">月末の日付で月を足し引きするときは注意する。
日付だけを扱う場合は、1日などの月初に揃えてから月を変更する。</code></pre>

### parseInt に数値を渡す

`parseInt()` は引数を文字列に変換してから読み取る。数値を渡すと、文字列化した表記によって結果が変わる。

```javascript
console.log(parseInt(0.5));       // 0
console.log(parseInt(0.0000005)); // 5 ("5e-7" と文字列化されて、先頭の 5 だけ読まれる)
console.log(parseInt(1e21));      // 1 ("1e+21" と文字列化される)
```

<pre><code class="caution">数値の小数部を切り捨てるなら Math.trunc() や Math.floor() を使う。parseInt は文字列を整数に変換するときに使う。</code></pre>

### その他の罠

| 書き方 | 起きること | 対策 |
| --- | --- | --- |
| `for (const i = 0; i < 3; i++)` | 2周目の `i++` で TypeError (const は再代入できない) | カウンタ式では `let` を使う |
| `new Array(3).map((_, i) => i)` | 空要素はスキップされるため `[empty × 3]` のままになる | `Array.from({ length: 3 }, (_, i) => i)` を使う |
| `arr[-1]` | 末尾ではなく `undefined` になる | `arr.at(-1)` を使う |
| `"a-b-c".replace("-", "+")` | 最初の1つだけ置換される (`"a+b-c"`) | すべて置換するなら `replaceAll()` を使う |

### 他の章にも載っている罠

| 罠 | 章 |
| --- | --- |
| `==` は型変換してから比較する | 演算子 > 比較演算子 |
| `typeof null` は `"object"` になる | 演算子 > 型関連・その他演算子 |
| `switch` の `break` を忘れるとフォールスルーする | 制御構文 > switch文 |
| `sort()` は引数なしだと文字列として比較する | 配列 > array.sort |
| `fill()` に参照型を渡すと全要素で共有される | 配列 > 生成 |
| `delete array[n]` は要素が詰まらず空要素になる | 配列 > 要素の取り出しと追加と削除 |
| `var` のループ変数がクロージャで共有される | クロージャ > ループとクロージャ |
| `forEach` に async 関数を渡すと待たない、`await` の付け忘れ | 非同期 > async > よくある間違い |
| `str.length` は絵文字を 2 と数える | 文字列 > 文字列の長さ |
