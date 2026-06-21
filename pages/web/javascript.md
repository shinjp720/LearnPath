---
title: JavaScript
layout: default
---

# JavaScript <a id="top" data-name="TOP"></a>

- 拡張子は JavaScript は **.js**。TypeScript は **.ts**。
- **命名規則**
    - 変数名、関数名は、最初の単語は小文字で始まり、2単語目以降は大文字始まりの**キャメルケース**。
    - class、コンストラクタは単語の1文字目が大文字の**パスカルケース**。
    - 定数名は、すべて大文字で アンダースコア(_) で単語をつなぐ**スネークケース**。
    - ブーリアン値はis, has, canで始めることにより何を意味するかを理解しやすくする。
    - 関数名などアクションを表す変数は動詞で始まることにより、どのようなアクションを実行するのかが明示的にする。
- 最近では文の最後には セミコロン(;) を付けないルールも多い。
- // 行末までコメント
- /* 行をまたげるコメント */

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
    ifブロック;
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
for (let i=0; i<5; i++) {
    // 処理
}
```

#### for...in文

オブジェクトのキーを1つずつ取り出して処理。

```javascript
for (const key in object) {
    // オブジェクトの各プロパティに対する処理
}
```

<pre><code class="caution">配列に対して for in を使うと意図しない挙動になることがあるため、使わない。
index が欲しい場合は entries を使う。</code></pre>

#### for...of文

中身を1つずつ取り出して処理。

```javascript
for (const value of iterable) {
    // 反復可能オブジェクトの各要素に対する処理
}
```

entries で取り出す。オブジェクトか配列かで書き方が違う。

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
        // 条件式が一致しない場合の処理
}
```

---

## 変数 <a id="variable" data-name="変数"></a>

```
キーワード 変数名 = 初期値
```

| キーワード | 意味 |
| --- | --- |
| `let` | 値の再代入ができる変数の宣言。 |
| `const` | 一度値を代入したら変更できない変数の宣言。<br>プリミティブ型に関しては値を変更できないが、その他 Object に関しては指し示している先を変更できない。 |
| `var` | JavaScript で古くから使われる宣言で現在は使わない。 |

変数を初期化せずに宣言のみを行った場合、その変数は undefined となる。

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

####  オブジェクトの分割代入

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
| `%` | 剰余 | `7 * 3` | `1`(余り1) |
| `**` | べき乗 | `3 ** 2` | `9`(3の2乗) |
| `++` | インクリメント | `5++` | `6` |
| `--` | デクリメント | `5--` | `4` |

### 代入演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `=` | 代入 | `a = 10` | `10` |
| `+=` | 加算の自己代入 | `let a = 10;`<br>`a += 2;` | `12` |
| `-=` | 減算の自己代入 | `let a = 10;`<br>`a -= 2;` | `8` |
| `/=` | 除算の自己代入 | `let a = 10;`<br>`a /= 2;` | `5` |
| `*=` | 乗算の自己代入 | `let a = 10;`<br>`a *= 2;` | `20` |
| `%=` | 余算の自己代入 | `let a = 10;`<br>`a %= 3;` | `1` |
| `**=` | べき乗の自己代入 | `let a = 10;`<br>`a **= 2;` | `100` |
| `&&=` | 論理積の自己代入 | `let a = true;`<br>`a && false;` | `false` |
| <code>&#124;&#124;=</code> | 論理和の自己代入 | `let a = true;`<br><code>a &#124;&#124;= false;</code> | `true` |
| `??=` | Null合体の自己代入 | `let a = null;`<br>`a ??= "初期値";` | 初期値 |

### 比較演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `==`     | 値が等しいことを確認         | `1 == "1"`<br>`1 == 1`   | `true`<br>`true`  |
| `===`    | 値と型が等しいことを確認     | `1 === "1"`<br>`1 === 1` | `false`<br>`true` |
| `!=`     | 値が等しくないことを確認     | `1 != "1"`<br>`1 != 2`   | `false`<br>`true` |
| `!==`    | 値と型が等しくないことを確認 | `1 !== "1"`<br>`1 !== 1` | `true`<br>`false` |
| `A < B`  | AがBより小さいことの確認     | `1 < 2`<br>`1 < 1`       | `true`<br>`false` |
| `A > B`  | AがBより大きいことの確認     | `2 > 1`<br>`1 > 1`       | `true`<br>`false` |
| `A <= B` | AがB以下であることの確認     | `1 <= 2`<br>`2 <= 2`     | `true`<br>`true`  |
| `A >= B` | AがB以上であることの確認     | `2 >= 1`<br>`2 >= 2`     | `true`<br>`true`  |

### 論理演算子

| 記号   | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `&&` | 論理積(AND)を表す<br>A && Bの場合、AかつBの条件 | `true && true`<br>`true && false`<br>`false && false` | `true`<br>`false`<br>`false` |
| <code>&#124;&#124;</code> | 論理和(OR)を表す<br>A <code>&#124;&#124;</code> Bの場合、AまたはBの条件 | `true `<code>&#124;&#124;</code>` true`<br>`true `<code>&#124;&#124;</code>` false`<br>`false `<code>&#124;&#124;` false`</code> | `true`<br>`true`<br>`false` |
| `!` | (NOT条件を表す) | `!a` | `true` |
| `??` | Null合体演算子<br>代入の際に使われる演算子で、左辺が`null/undefined`なら右辺が代入される | `let a = null;`<br>`result = a ?? 10;` | `10` |

### ビット演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `&` | 論理積(AND)を表す<br>両方のビットが1の時に1 | `5 & 3 (0b101 & 0b011)` | `1` |
| <code>&#124;</code> | 論理和(OR)を表す<br>どちらかのビットが1の時に1 | <code>5 &#124; 3 (0b101 &#124; 0b011)</code> | `7` |
| `^` | 排他的論理和(XOR)を表す<br>片方が1の時に1 | `5 ^ 3 (0b101 ^ 0b011)` | `6` |
| `~` | ビット反転(NOT)を表す<br>各ビットを反転する | `~5` | `-6` |
| `<<` | 左シフト<br>指定回数だけ左にビットをずらす(0埋めされる) | `5 << 1` | `10` |
| `>>` | 符号あり右シフト<br>指定回数だけ右にビットをずらす(符号ビットは維持) | `-5 >> 1` | `-3` |
| `>>>` | 符号なし右シフト<br>指定回数だけ右にビットをずらす(符号ビットは無視されるので常に正の整数となる) | `-5 >>> 1` | `2147483645` |

### 型関連・その他演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `typeof` | 型を返す | `typeof 1` | `number` |
| `instanceof` | オブジェクトが特定のクラスやコンストラクタのインスタンスかどうかを判定する<br>プリミティブ型はオブジェクトと異なるため`false`となる点に注意 | `let arr = [1, 2, 3];`<br>`arr instanceof Array;` | `true` |
| `in` | オブジェクトや配列に、特定のプロパティやインデックスが存在するかどうかを判定する | `"val" in {val: 1}`<br>`"noVal" in {val: 1}`| `true`<br>`false` |
| `delete` | オブジェクトのプロパティや配列の要素を削除する<br>`delete`は、配列の要素を削除しても長さ(length)は変わらない | `let obj = {a: 1, b: 2};`<br>`delete obj.a;` | `{b: 2}` |

### 条件(三項)演算子

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `condition ? expr1 : expr2` | 条件式 ? 真の時 : 偽の時 | `(1 === 1) ? true : false` | `true` |

### 展開・結合・スプレッド系(ES6以降)

| 記号 | 説明 | 例 | 結果 |
| --- | --- | --- | --- |
| `...` | スプレッド構文(展開)<br>配列に使う例 | `const arr1 = [1,2];`<br>`const arr2 = [3,4];`<br>`const merged = [...arr1, ...arr2];` | `[1,2,3,4]` |
| `...` | スプレッド構文(展開)<br>オブジェクトに使う例 | `const user = {name:"Alice", age:25};`<br>`const updated = {...user, age:30};` | `{name:"Alice", age:30}` |
| `...` | レスト構文(まとめる)<br>関数の引数で使う例 | `function f(...args) {return args;}`<br>`f(1, 2, 3 ,4);` | `[1, 2, 3, 4]` |
| `...` | レスト構文(まとめる)<br>分割代入で使う例 | `const [first, ...rest] = [10, 20, 30, 40];`<br>`rest;` | `[20, 30, 40]` |
| `+` | 文字列結合 | `"a" + "b"` | 'ab' |

### オプショナルチェイニング

`左側の値?.` と書くと、左側の値が null または undefined だった場合、続きを読まずに undefined を返す。

```javascript
user?.profile?.name

const name = response.data?.user?.name // 無ければ undefined が入る

arr?.[0] // 配列でも

callback?.() // 関数でも使える。あれば実行
```

### Null合体演算子

`左側の値 ?? '値がない'` と書くと、左側の値が null または undefined だった場合 右側の値を採用する。

```javascript
props.dataList?.[i]?.clientCode ?? ''
```

---

## データ型 <a id="data-types" data-name="データ型"></a>

| データ型 | 値 | 説明 |
| --- | --- | --- |
| String | 文字列 | シングルクォート(')、ダブルクォート(")、バッククォート(`)で囲んだ文字列 |
| Number | 数値 | 整数または浮動小数点数 |
| BigInt | 巨大な整数 | 任意の大きさの整数値。数値の末尾にnを付けることでBigIntとして定義できる |
| Boolean | 真偽値 | true/false |
| null | ヌル | 値が空(存在しない)ことを表す |
| undefined | 未定義 | 値が未定義であることを表す |
| Symbol | シンボル | 一意で不変な値 |
| object | オブジェクト | キーと値を対で格納する入れ物 |
| class  | クラス  | インスタンス化して使用するための設計図 |

### 数値(Number)

| 名称 | 表現形式 | JavaScriptでの表記例 |
| --- | --- | --- |
| 10進数 | 0~9の10種類の数字で数値を表現 | 1234, 0.5, .5 |
| 2進数 | 0, 1の2種類の数字で数値を表現 | 0b11, 0B11 |
| 8進数 | 0~7の8種類の数字で数値を表現 | 0o111, 0O11, 011 |
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
let person = {
    hello: function() { console.log("こんにちは"); }
};
// または、ES6より記述できる記法
let person = {
    hello() { console.log("こんにちは"); }
};
```

- オブジェクトの静的メソッド

| メソッド | 説明 |
| --- | --- |
| `Object.keys(object)` | objectのキーを配列で返す |
| `Object.values(object)` | objectの値を配列で返す |
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

### 明示的型変換

| 関数 | 用途 | 例 | 結果 |
| --- | --- | --- | --- |
| `Number(値)` | 数値へ変換する | `Number("1")`<br>`Number("hello")`<br>`Number(true)`<br>`Number(false)` | `1`<br>`NoN`<br>`1`<br>`0` |
| `Boolean(値)` | 真偽値へ変換する | `Boolean(1)`<br>`Boolean(0)` | `true`<br>`false` |
| `String(値)` | 文字列へ変換する | `String(1)`<br>`String(true)` | `"1"`<br>`"true"` |
| `BigInt(値)` | BigInt型へ変換する | `BigInt("20)`<br>`BitInt(true)` | `20n`<br>`1n` |

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

## 文字列(String) <a id="string" data-name="文字列"></a>

文字列はダブルクォーテーション (") 、または シングルクォーテーション (') で囲んで表す。

### テンプレートリテラル

ES6 から文字列の中で変数を展開可能なテンプレートリテラルがサポートされた。<br>
バッククォート(\`) で文字列を囲み、`${...}` の中には変数や JavaScript 構文を記述可能。

```javascript
const name = "Yamada";
console.log(`ようこそ ${name} さん`);
```

#### String.raw

テンプレートリテラルに String.raw を付けると、&#92;n 等のエスケープ文字がエスケープされなくなるので、Windows のパスや正規表現のようにバックスラッシュ(&#92;) を多用する場合に便利。

```javascript
// 普通に書くと \\ と書かないとエラーや意図しない挙動になる
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

文字列の最後をバックスラッシュ(&#92;) にすると、後ろの文字をエスケープしてしまうので &#92;&#92; と書く必要がある。

---

### マルチライン

"..." や '...' や <code>`...`</code> の行末にバックスラッシュ(&#92;) を付けると、マルチライン文字列を記述できる。

```javascript
const str = "ERROR: 404\n\
File not found.";       
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

現在のブラウザでは、言語にかかわらず1文字を 1 と数えるが、サロゲートペア領域の文字は1文字を 2 と数える。

```javascript
str = "あいうえお";
console.log(str.length); // 5
```

---

### 文字列の部分取り出し

#### string.charAt(n)

string の n 番目の文字を返す。

```javascript
str = "あいうえお"
str.charAt(2) // 'う'
```

#### string.at(n)

charAt() とほぼ同様だが、負数を指定すると末尾からのインデックスになる点と、範囲外のインデックスを指定した場合に charAt() は空文字を返すのに対して at() は undefined を返す。

#### string.slice(from [, to])

string の from 文字目から to - 1 文字目の文字列を返す。<br>
不の値を指定すると後ろから数える点が substring と異なる。<br>
to を省略すると残り全て。

```javascript
console.log("ABCDEFG".substring(-3, 6));  // "ABCDEF"
console.log("ABCDEFG".slice(-3, 6));      // "EF"
```

#### string.substring(from [, to])

string の from 文字目から to-1 文字目の文字列を返す。<br>
to を省略すると残り全て。

```javascript
console.log("ABCDEFG".substring(2, 4));  // "CD"
console.log("ABCDEFG".substring(2));     // "CDEFG"
```

---

### 文字列の加工

#### string.split([sep [, limit]])

sep を区切り文字として string を分割し、その配列を返す。<br>
limit は配列の要素数を制限して、sep を省略すると string 全体をひとつの要素とする配列を返す。

```javascript
const t = "23:59:59".split(":");
console.log(`${t[0]}時${t[1]}分${t[2]}秒`); // "23時59分59秒"
```

```javascript
str = 'Hello'

str.split()   // ['Hello']
str.split('') // ['H', 'e', 'l', 'l', 'o']
```

#### string.concat(str2, str3, ...)

string に str2, str3, ... を連結した文字列を返す。

```javascript
console.log("ABC".concat("DEF", "GHI"));  // "ABCDEFGHI"
```

#### string.repeat(n)

string を n 回繰り返した文字列をかえす。

```javascript
console.log("ABC".repeat(3));  // "ABCABCABC"
```

#### string.trim()

string の前後のホワイトスペースを取り除いた文字列を返す。

#### string.trimStart()<br>string.trimEnd()

trimStart() は文字列の前方の、trimEnd() は後方のホワイトスペースを取り除いた文字列を返す。

#### string.toUpperCase()<br>string.toLowerCase()

string を大文字・小文字に変換したものを返す。

```javascript
console.log("Japan".toUpperCase());   // "JAPAN"
console.log("Japan".toLowerCase());   // "japan"
```

#### string.padStart(length[, str])<br>string.padEnd(length[, str])

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

newString には $ で始まる特殊文字を使用することがでる。

- $& はマッチした文字列全体
- $1~$100 は正規表現中の (グループ) に対応する部分文字列
- $&#96; はマッチ部分より前の文字列 (アロー関数内で string.slice(0, offset) と同じ)
- $' はマッチ部分より後ろの文字列 (アロー関数内で string.slice(offset + match.length) と同じ)
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
- (グループ) が増えれば後ろに追加される
- offset: マッチした場所が全体の何文字目かのインデックス
- string: 検索をかけた文字列全対

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

regexp に文字列を指定した場合、replaceAll() は全て置換する。<br>
regexp に正規表現を指定した場合、グローバルオプション (/.../g) の指定が必須となる。

```javascript
console.log("AAA".replace(/A/g, "X"))      // XXX(全置換)
console.log("AAA".replace(/A/, "X"));      // XAA(1件置換)
console.log("AAA".replaceAll(/A/g, "X"))   // XXX(全置換)
console.log("AAA".replaceAll(/A/, "X"));   // Error
```

---

### 文字列の検索

文字列の検索には正規表現の <a href="#matching">マッチング</a>もある。

#### string.indexOf(key [, from])


string の from 番目から後方に検索し、最初に key が現れた index を返す。<br>
見つからなかった場合は -1 を返す。

```javascript
console.log("ABCABC".indexOf("C"));    // 2
console.log("ABCABC".indexOf("C", 3)); // 5
```

#### string.lastIndexOf(key [, from])

string の from 番目から前方に検索し、最初に key が現れた index を返す。<br>
見つからなかった場合は -1 を返す。

```javascript
const filename = "www.example.com.png";
const n = filename.lastIndexOf(".");
console.log(filename.substring(n)); // .png
```

#### string.startsWith(str)<br>string.endsWith(str)<br>string.includes(str)

string の中に str を含んでいるかを判定する。<br>
includes() は含んでいるか、startWith() は str で始まっているか、endWith() は str で終わっているかを判定して、真偽値を返す。

```javascript
console.log("ABCDEFG".startsWith("ABC")); // true
console.log("ABCDEFG".endsWith("EFG"));   // true
console.log("ABCDEFG".includes("DEF"));   // true
```

---

#### JSON.parse(str)<br>JSON.stringify(obj)

parse() は JSON文字列をオブジェクトに変化する。<br>
stringify() はオブジェクトを JSON文字列に変化する。メソッドは無視される。

```javascript
const str1 = '{"width":160, "height":120}';
const obj = JSON.parse(str1);
console.log(obj);  // {width: 160, height: 120}
const str2 = JSON.stringify(obj);
console.log(str2); // {"width":160,"height":120}
```

### 文字列のタグ付け

#### string.bold()<br>string.italics()<br>string.fixed()<br>string.big()<br>string.small()<br>string.blink()<br>string.strike()<br>string.sup()<br>string.sub()<br>string.fontcolor(color)<br>string.fontsize(size)<br>string.anchor(name)<br>string.link(name)

それぞれのタグで囲んだ文字列を返す。

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
| &#92;n | 改行 |
| &#92;r | 復帰 |
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

#### regexp = new RegExp(pattern[, flags])

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

### 文字列のマッチング

#### string.match(regexp)

string から正規表現 regexp にマッチした文字列に関する情報を返す。<br>
グローバルフラグ (/.../g) がない場合は、最初にマッチした文字列の詳細を含む特殊な配列を返す。<br>
グローバルフラグ (/.../g) を付けた場合は単純な配列として返す。<br>
見つからなかった場合は null を返す。

```javascript
const res1 = "23:59:59".match(/[\d+]+/g);
console.log(res1);                      // ['23', '59', '59']
const res2 = "23:59:59".match(/(?<y>\d+):(?<m>\d+):(?<d>\d+)/);
console.log(res2[0]);                   // '23:59:59' (マッチした全体文字列)
console.log(res2[1], res2[2], res2[3]); // '23' '59' '59' (括弧に対応する部分文字列)
console.log(res2.index);                // 0 (マッチした位置)
console.log(res2.input);                // '23:59:59' (入力文字列)
console.log(res2.groups);               // {y:'23', m:'59', d:'59'} (名前付きキャプチャの結果)
```

#### string.matchAll(regexp)

matchAll() はグローバルフラグ (/.../g) が必須で、マッチした文字列に関する情報のイテレータを返す。<br>
ES2020 以降。

```javascript
"Date: 2026-12-31".matchAll(/(?<y>\d+)-(?<m>\d+)-(?<d>\d+)/g).forEach((e) => {
  console.log(e[0]);                       // '2026-12-31'
  console.log(`${e[1]}/${e[2]}/${e[3]}`);  // '2026/12/31'
  console.log(e.index);                    // 6
  console.log(e.input);                    // 'Date: 2026-12-31'
  console.log(e.groups);                   // {y:'2026', m:'12', d:'31'}
});
```

#### regexp.exec(str)

srt に対して正規表現 regexp でマッチングを行い結果を返す。マッチしなければ null を返す。<br>
グローバルフラグ (/.../g) がない場合は match() と同じ挙動。<br>
グローバルフラグ (/.../g) がある場合は 結果をひとつずつ返すが、文字列の詳細な情報を含む特殊な配列 (match() と同じ) を返す。
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

ES2020 以降なら matchAll() が優秀。

```javascript
// for...of で綺麗に回せる
for (const match of str.matchAll(regexp)) {
  console.log(`果物: ${match[1]}, 価格: ${match[2]}`);
}
```

#### string.search(regexp)

string から 正規表現 regexp にマッチした部分のインデックスうを返す。<br>
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

正規表現で (?<name>pattern) のように記述して名前を付けると、マッチングした戻り値の groups.name でアクセスできる。
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
| g | global | 2番目、3番目... にマッチする部分も検索する |
| i | ignoreCase | 大文字・小文字を区別しない |
| m | multiline | 複数行に対して検索する |
| s | dotAll | ピリオド(.) が CR, LF, U+2028, U+2029 を含め、すべての文字にマッチする (ES2018～) |
| y | sticky | lastIndex で指定した位置からのみ検索する |
| d | hasIndices | マッチ文字列の先頭・終了インデックスを返却する (ES2022～) |
| u | unicode | Unicode のサロゲートペア領域の文字も1文字として扱う (ES2015～) |
| v | unicode | Unicodeの結合文字も1文字として扱う (ES2024～) |

---

## 配列 <a id="array" data-name="配列"></a>

### 生成

#### Array.from(arrayLike[, mapFunc, [thisArg]])

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

##### 要素数を指定して配列を生成する

```javascript
// [0, 1, 2, 3, 4] を作る
const zeroToFour = Array.from({ length: 5 }, (_, i) => i);

// [1, 2, 3, 4, 5] を作る（1から始めたい場合）
const oneToFive = Array.from({ length: 5 }, (_, i) => i + 1);
```

または詰め物を入れて初期化。

```javascript
const list = Array.from({length: 100}).fill(0);
const list = new Array(100).fill(0);
```

<pre><code class="caution">fill で初期化する場合に参照オブジェクトを指定すると、値への参照が共有されるので注意。
プリミティブ型は共有されない。</code></pre>

##### マップ関数を渡して生成する

mapFunc には、配列を作成する際に各要素に対して実行されるマップ関数を渡す。<br>
マップ関数の引数には、要素値 (value) 、インデックス (index) が渡される。引数は順不同だが省略は可能。<br>
thisArg にはマップ関数で this で参照される値を指定する (アロー関数なら不要)。

```javascript
const arr = Array.from([1, 2, 3], (x) => x * 2);
console.log(arr); // [2, 4, 6]
```

#### new

new は古い書き方で、今ではあまり使われない。

```javascript
const arr1 = new Array();     // 要素が0個の配列を作成
const arr2 = new Array("Red", "Green", "Blue"); // const arr3 = ["Red", "Green", "Blue"]と等価
```

<pre><code class="caution">const arr = new Array(3);
このような初期化をした場合は意図しない挙動となることがあるため注意。
const arr = Array.from({ length: 3 });
こう書くと undefined が入るため安全。
const arr = new Array(3).fill(undefined);
こういう手もある。</code></pre>

#### Array.fromAsync()

ES2026 で追加された、非同期反復可能オブジェクトを配列に変換するメソッド。

```javascript
async function myRange(n) {
  for (let i = 0; i < n; i++) {
    yield i * 2;
  }
}
const arr = await Array.fromAsync(myRange(4));
console.log(arr); // [0, 2, 4, 6]
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
const arr = Array.from({ length: 3 }, () => Array.from({ length: 4}).fill(0))

const arr = Array.from({ length: 3 }, () => new Array(4).fill(0));
```

---

### 配列の長さ

```javascript
const arr = ["Red", "Green", "Blue"];
console.log(arr.length); // 3
```

---

### 配列のループ

for of とすると、要素を取得できる。

```javascript
const colors = ["Red", "Green", "Blue"];
for (let color of colors) {
  console.log(color); // "Red", "Green", "Blue"
}
```
<pre><code class="caution">配列に対して for if を使うと index が取れるが、中身は文字列でありバグの元なので配列には for in は使わない。</code></pre>


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

配列に対してentries() は key と value からなるイテレータ、keys() は key のみからなるイテレータ、values() は value のみからなるイテレータを返す。

```javascript
const arr = ["Red", "Green", "Blue"];

for (let [index, value] of arr.entries()) {
  console.log(index + ":" + value);     // "0:Red", "1:Green", "2:Blue"
}

for (let elem of arr.entries()) {
  console.log(elem[0] + ":" + elem[1]); // "0:Red", "1:Green", "2:Blue"
}

for (let key of arr.keys()) {
  console.log(key); // 0, 1, 2
}

for (let value of arr.values()) {
  console.log(value); // "Red", "Green", "Blue"
}
```

---

### 配列の走査

#### array.map(callback[, this])

配列の各要素に対して callback を実行し、callback の戻り値からなる配列を返す。<br>
callback の引数には、要素値 (value) 、インデックス (index) 、配列自体 (array) が渡される。

```javascript
const arr1 = [2, 4, 6]
const arr2 = arr1.map((value, index, key) => value * 2);
console.log(arr2) // [4, 8, 12]
```

#### array.filter(callback[, this])

配列の各要素に対して callback を実行し、callback の戻り値が真となる要素からなる配列を返す。<br>
callback の引数には、要素値 (value) 、インデックス (index) 、配列自体 (array) が渡される。

```javascript
const arr1 = [89, 87, 93, 65, 88];
const arr2 = arr1.filter(function(value, index, array) {
  return (value >= 80);
});
console.log(arr2); // [89, 87, 93, 88]
```

#### array.includes(elm)

elm がマッチする要素の有無を 真偽値で返す。ES2016(ES7) で追加。

```javascript
const arr = ["Red", "Green", "Blue"];

if (arr.includes("Green")) { ... }     // ES2016以降の新しい書き方
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

value が配列かどうかを 真偽値で返す。ES5.1 で追加。

```javascript
console.log(Array.isArray("ABC"));            // false
console.log(Array.isArray(["A", "B", "C"]));  // true
```

#### index in array

指定した index に該当する要素があるかどうかを 真偽値で返す。

```javascript
const arr = ["Red", "Green", "Blue"];
console.log(2 in arr); // true
console.log(3 in arr); // false
```

#### array.every(callback[, this]),<br>array.some(callback[, this])

配列の各要素に対して callback を実行して、every() は callback の戻り値がすべて真なら真を返し、some() は callback の戻り値が1つでも真なら真を返す。<br>
callback の引数には、要素値 (value) 、インデックス (index) 、配列自体 (array) が渡される。

```javascript
const arr = [89, 87, 93, 65, 88];
const bool = arr.every(function(value, index, array) {
  return (value >= 80);
});
console.log(bool);  // false

const bool = arr.some(function(value, index, array) {
  return (value >= 90);
});
console.log(bool);  // true
```

#### array.find(callback[, this]),<br>array.findLast(callback[, this]),<br>array.findIndex(callback[, this]),<br>array.findLastIndex(callback[, this])

find() は、配列の各要素に対して callback を実行して、callback の戻り値が最初に真となった要素の値を返す。<br>
callback の引数には、要素値 (value) 、インデックス (index) 、配列自体 (array) が渡される。

```javascript
const arr = [89, 87, 93, 92, 88];
const value = arr.find((value, index, array) => {
  return value >= 90;
});
console.log(value);  // 93
```

findIndex() は、見つかった要素のインデックスを返す。

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

#### array.join([separator])

array の各要素の値を separator で連結した文字列を返す。<br>
separator を省略した場合はカンマ(,)で連結されるが、バージョンによって動作が異なる恐れがあるので省略しない。

```javascript
const arr = ["2000", "12", "31"];
const str = arr.join("/");
console.log(str);  // "2000/12/31"
```

---

### 配列要素の取り出しと追加と削除

#### array.at(n)

配列の n 番目の要素を取り出す。ES2022 以降では負数を指定すると最後からかぞえて n 番目の要素を取り出す。<br>
array は変化しない。

```javascript
const arr = ["Red", "Blue", "Green"];
console.log(arr.at(0));  // "red"
console.log(arr.at(1));  // "Blue"
console.log(arr.at(-1)); // "Green"
```

#### array.unshift(e1, e2, ...),<br>array.push(e1, e2, ...)

unshift は array の先頭に e1, e2, ... の要素を追加する。<br>
push は array の末尾に要素を追加する。<br>
戻り値は JavaScript のバージョンによって異なる。

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

0 から数えて、start から n 個の要素を削除して、その位置に e1, e2, ... を要素として埋め込んだものを返す。<br>
array は変化しない。

```javascript
const arr1 = ["A", "B", "C", "D", "E", "F", "G"];
const arr2 = arr1.toSpliced(2, 3, "X", "Y", "Z");
console.log(arr1);  // ['A', 'B', 'C', 'D', 'E', 'F', 'G']
console.log(arr2);  // ['A', 'B', 'X', 'Y', 'Z', 'F', 'G']
```

#### array.slice(start [, end])

0 から数えて、start からend-1 番目までの要素を配列で返す。<br>
end を省略した場合は start から最後までの要素を返す。<br>
array は変化しない。

```javascript
const arr = ["A", "B", "C", "D", "E", "F", "G"];
console.log(arr.slice(2, 4));  // ["C", "D"]
```

#### delete array[n]

要素を削除する。削除したインデックスの値が undefined となるため、配列要素削除するには splice() を用いるのが一般的。

```javascript
const arr = ["Red", "Green", "Blue"];
delete arr[1];
console.log(arr);      // ["Red", empty, "Blue"]
console.log(arr[0]);   // "Red"
console.log(arr[1]);   // undefined
console.log(arr[2]);   // "Blue"
```

---

### 配列の並べ替え

#### array.sort([func])

array を並べ替えて、結果の配列を返す。<br>
array 自体も書き換えられる。

```javascript
const arr = [3, 7, 8, 1];
arr.sort();
console.log(arr);  // [1, 3, 7, 8]
```

ソート関数を指定することもでき、ソート関数は等しければ 0 を、小さければ負の値を、大きければ正の値を返す。

```javascript
function comparison(a, b) {
  const str1 = a.toUpperCase();
  const str2 = b.toUpperCase();
  if (str1 == str2) { return 0; }
  if (str1 > str2) { return -1; }
  if (str1 < str2) { return 1; }
}

const arr = ["a", "x", "B", "y", "c", "Z"];
arr.sort(comparison);
console.log(arr);  // ["a", "B", "c", "x", "y", "Z"]
```

#### array.toSorted([func])

array をソートして、結果の配列を返す。<br>
array は変化しない。<br>
他の機能は sort() と同じ。

#### array.reverse()

array を逆順で並べ替えて、結果の配列を返す。<br>
array 自体も書き換えられる。

#### array.toReverse()

array を逆順で並べ替えて、結果の配列を返す。<br>
array は変化しない。

---

### 配列から文字列への変換

#### array.toString()

配列を文字列に変換する。

```javascript
const arr = [1, 2, 3, "A", "B", "C"];
arr.toString(); // "1,2,3,A,B,C"
```

#### array.toLocaleString([locales[, options]])

配列をロケールに応じた文字列に変換する。

```javascript
const arr = [1, 'A', new Date('31 Dec 1999 14:59:59 UTC')];
const str = arr.toLocaleString('ja', {timeZone: "Asia/Tokyo"});
console.log(str);   // "1,A,1999/12/31 23:59:59"
arr.toString();
```

---

### 配列要素の変更

#### array.fill(value[, start[, end]])

0 から数えて、start からend-1 番目までの要素の値を value に変換する。<br>
array 自体を書き換える。<br>
start が省略された場合は最初から、end が省略された場合は最後までを置換する。

```javascript
const arr = ["0", "1", "2", "3", "4", "5"];
arr.fill("A", 2, 5);
console.log(arr);  // ["0", "1", "A", "A", "A", "5"]
```

<pre><code class="caution">value に参照オブジェクトを指定すると、値への参照が共有されるので注意。
プリミティブ型は共有されない。</code></pre>

#### array.with(index, value)

0 から数えて index 番目の要素を value に置換したものを返す。<br>
array は変化しない。

```javascript
const arr1 = ["0", "1", "2", "3", "4", "5"];
const arr2 = arr1.with(3, "X");
console.log(arr1);   // ['0', '1', '2', '3', '4', '5']
console.log(arr2);   // ['0', '1', '2', 'X', '4', '5']
```

#### array.copyWithin(target[, start[, end]])

0 から数えて、start からend-1 番目の要素をコピーして target 番目から上書きする。<br>
array 自体を書き換える。<br>
end が省略された場合は最後までをコピーする。

```javascript
const arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
arr.copyWithin(2, 8, 10);
console.log(arr); // ["0", "1", "8", "9", "4", "5", "6", "7", "8", "9"]
```

#### array.flat(depth)

多次元配列を低次元の配列にフラット化する。depth には何次元までの配列をフラット化するかを指定する。

```javascript
const arr = [[[1, 2], [3, 4]], [5, 6]];
console.log(arr.flat(2)); // [1, 2, 3, 4, 5, 6]
```

#### array.flatMap(callback)

配列に対して map() を行い、結果の多次元配列をフラット化する。

```javascript
const arr = ["Blue Green", "Red Yellow"];
console.log(arr.flatMap(x => x.split(" "))); // ["Blue", "Green", "Red", "Yellow"]
```

---

## map <a id="map" data-name="Map"></a>

ES2015
でサポートされたオブジェクトで、キーとバリューのリストを保持する。<br>
Object と似ているが、Map は、文字列や Symbol 以外の値もキーとして使える、
リストの個数を size で取得できる、for of で簡単にループできる、
頻繁な要素の追加や削除があるような大量のデータを扱うケースに最適化されているなどの利点がある。

### map = new Map([iterable])

コンストラクタにはキーとバリューの二次元配列を指定できる。

```javascript
const map = new Map([["width", 160], ["height", 120]]);
```

### map.set(key, value)<br>map.get(key)

```javascript
const map = new Map();
map.set("width", 160);
map.set("height", 120);
map.get("width");   // 160
map.get("height");  // 120
```

### map.size

リストの個数を返す。

```javascript
const map = new Map();
map.set("width", 160);
map.set("height", 120);
map.size;   // 2
```

### map.keys()<br>map.values()<br>map.entries()

for of でキーとバリューを扱える。

```javascript
for (let [key, value] of map) {
   console.log(key, ":", value);
}
for (let [key, value] of map.entries()) {
   console.log(key, ":", value);
}
for (let key of map.keys()) {
   console.log(key, ":", map.get(key));
}
for (let value of map.values()) {
   console.log(value);
}
```

### map.forEach(function[, this])






### map.has(key)

key で指定したマップが存在するかどうかを真偽値で返す。

```javascript
const map = new Map();
map.set("width", 160);
map.has("width"); // true
```

### map.delete(key)

key で指定したマップを削除する。

```javascript
const map = new Map();
map.set("width", 160);
map.delete("width");
```

### map.clear()

Map の中身をすべて削除する。

### map.getOrInsert(key, value)

マップに key が存在すればその値を返し、なければ key=value を追加してから
value を返す。<br>

### map.getOrInsertComputed(key, callback)





### Map.groupBy(array, function)






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

#### 関数宣言

```javascript
function 関数名 (引数) {
  // 処理
}
```

最も基本的な書き方で、ホイスティングされるため定義より前でも呼び出すことができる。

#### アロー式

```javascript
(引数) => {
  // 処理
}
```

ES6でサポートされた比較的モダンな書き方で this の扱いが function と異なり、

- function は誰が読んだか (呼び出し方) で this が決まる (動的)
- アロー関数はどこに書いたか (定義場所) で this が決まる (静的)

またアロー関数は記述が短い、ホイスティングされないなどの特徴がある。

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

#### 関数式

```javascript
const 関数名 = function(引数) {
  // 処理
}
```

条件によって関数を切り替えたい場合などに使う。

ホイスティングはされない。

#### 無名関数

```javascript
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

オブジェクト内専用の省略記法。実質的には

```javascript
const オブジェクト名 = {
  関数名: function() {
    // 処理
  }
}
```

### デフォルト引数

関数の実行時に引数が渡されなかった場合の引数を指定できる。

```javascript
function (arg1 = 初期値1, arg2 = 初期値2) {
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

fn ({arg2: "引数2"}); // 初期値1 引数2
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

ただし、インスタンスを渡した場合参照が渡るので、値を書き換えた場合の挙動に注意

---

## 非同期関数 <a id="async-func" data-name="非同期関数"></a>

### async

asyncが付いた関数は自動的に Promise でラップされる (Promise を返す関数となる) ため、 await で待つことができる。

もちろん自分で明示的に Promise を返すこともでき、その際は <span class="code-like">Promise&lt;Promise &lt;string&gt;&gt;</span> とはならずに平坦化される。

```javascript
async function hello() {
    return "Hello";
}
```

この関数は一見すると文字列を返すだけに見えるが内部的には次のようなイメージ。

```javascript
function hello() {
    return Promise.resolve("Hello");
}
```

また、例外を投げた場合は、

```javascript
async function test() {
    throw new Error("Oops");
}
```

次とほぼ同じ。

```javascript
function test() {
    return Promise.reject(new Error("Oops"));
}
```

### コールバック, Promise, async/await の違い

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

| プロパティ | 説明 | 例の値 |
| --- | --- | --- |
| href | URL全体を含めた文字列。この値を変更すると新しいページへ移動する。 | 全体 |
| host | URLのホスト(ホスト名:ポート番号)。 | `example.org:8080` |
| protocol | 末尾の:を含むURLのプロトコルスキーム。 | `https:` |
| hostname | URLのドメイン。 | `example.org` |
| port | URLのポート番号。 | `8080` |
| pathname 先頭の/に続いてパス部分が入ったもので、クエリやフラグメントを含めない。 | `/foo/bar` |
| search | ?とそれに続く引数などのクエリ文字列。 | `?q=baz` |
| hash | #とそれに続くフラグメント識別子。 | `#bang` |
| origin | 特定の位置のオリジンの正規形(読み取り専用)。 | `https://example.org:8080` |

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