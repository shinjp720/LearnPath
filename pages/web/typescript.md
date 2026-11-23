---
title: TypeScript
layout: default
---

# TypeScript <a id="top" data-name="TOP"></a>

TypeScript は、JavaScript に静的な型を加えた言語。型の検査は、実行前 (コンパイル時、またはエディタ上) に行われ、型の情報は、出力される JavaScript から取り除かれる。実行されるのは、通常の JavaScript である。

JavaScript のスーパーセットであり、既存の JavaScript のコードは、そのまま TypeScript として扱える。型は、少しずつ足していける。型推論が強力で、すべてに型を書く必要はない。

型の検査とは別に、エディタの補完、定義へのジャンプ、リネームなどの、言語サービスを提供する点も、重要な役割である。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 静的型付け | 型の誤りを、実行前に検出する |
| 型推論 | 変数や戻り値の型を、初期値や処理から推論する |
| 構造的型付け | 型の名前ではなく、形 (プロパティ) が合えば、代入できる |
| 型消去 | 型は、実行時に存在しない。`typeof` や `instanceof` で、実行時に判別する |
| 段階的な導入 | JavaScript から、ファイル単位、厳しさ単位で、移行できる |
| 言語サービス | 補完、リネーム、参照の検索、自動インポートを、エディタに提供する |

### JavaScript との比較

| | JavaScript | TypeScript |
| --- | --- | --- |
| 型の検査 | なし (実行時に、初めて失敗する) | コンパイル時に検査する |
| 実行 | そのまま実行する | 型を取り除いて、実行する |
| ビルド | 不要 | 型の検査 (`tsc`) が必要。実行は、別のツールでもよい |
| エディタの補完 | 推測が中心 | 型に基づいて、正確に行われる |
| 学習の量 | 少ない | 型の仕組みの分だけ、増える |

### 向いている場面と向いていない場面

| 向いている | 向いていない |
| --- | --- |
| 複数人で、長く保守するコード | 数十行の、使い捨てのスクリプト |
| ライブラリの公開 (型定義を同梱できる) | 型の恩恵が小さい、ごく小さなページ |
| 大きなコードベースのリファクタリング | 型の検査を行う手間を、かけられない場面 |

### 型検査と実行は、別である

TypeScript の型は、**コンパイル時の約束**であり、実行時の値を保証しない。外部から来るデータ (API のレスポンス、`JSON.parse` の結果、フォームの入力) は、型を書いても、実際の形が合うとは限らない。実行時の検証 (バリデーション) は、別に必要になる。

```text
ソースコード (.ts) ──▶ 型検査 (tsc) ──▶ エラーの報告
        │
        └──▶ 型の除去 (tsc / 他のツール) ──▶ JavaScript (.js) ──▶ 実行
```

### バージョンの注意

| バージョン | 時期 | 内容 |
| --- | --- | --- |
| 5.9 | 2025年8月 | JavaScript で書かれた、従来のコンパイラの最後から2番目の版 |
| 6.0 | 2026年3月 | JavaScript 版の最後のリリース。7.0 への橋渡しで、新しい既定値と、非推奨の整理を行った |
| 7.0 | 2026年7月 | Go で書かれた、ネイティブ実装。フルビルドで、おおむね 8〜12 倍高速 (公式の計測) |
| 7.1 | beta (2026年10月) | 新しい API の提供が、予告されている |

<pre><code class="caution">このドキュメントは、TypeScript 7.0 (2026年7月) を前提にしている。7.0 は、6.0 で非推奨になった設定を、エラーにする。古い記事の tsconfig.json は、そのままでは動かないことがある。
7.0 は、プログラムから呼び出す API を、同梱しない。Vue、Svelte、Astro、MDX などの、言語サービスのプラグインを使う環境は、当面 6.0 を使う必要がある。詳細は、ツールチェーンの章を参照。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

### インストール

Node.js と、パッケージマネージャーを準備して、プロジェクトに入れる。

```bash
mkdir my-app && cd my-app
npm init -y
npm install -D typescript
npx tsc --version
```

```text
Version 7.0.x
```

| 手順 | 内容 |
| --- | --- |
| 1 | `npm install -D typescript` で、プロジェクトの開発用に入れる (グローバルには、入れない) |
| 2 | `npx tsc --init` で、`tsconfig.json` を作る |
| 3 | `.ts` ファイルを書く |
| 4 | `npx tsc` で、型の検査と、出力を行う |

### 最初のプログラム

`src/hello.ts` を作る。

```ts
// 引数と戻り値に、型を付ける
function greet(name: string): string {
  return `Hello, ${name}`;
}

console.log(greet("TypeScript"));
// console.log(greet(42)); // ❌ number は string に代入できない
```

```bash
npx tsc
node dist/hello.js
```

```text
Hello, TypeScript
```

### 実行の方法

| 方法 | 内容 |
| --- | --- |
| `tsc` で出力して、`node` で実行 | もっとも基本的な方法。型の検査と、出力が、同時に行われる |
| `tsx` などの、実行ツール | 型を取り除いて、すぐに実行する。型の検査は、行わない |
| Node.js の、型の除去による実行 | 新しい Node.js は、型注釈を取り除いて、`.ts` を直接実行できる。対応するバージョンと制約は、公式のドキュメントで確認する |
| バンドラー (Vite など) | 型を取り除いて、バンドルする。型の検査は、別に行う |

<pre><code class="tips">実行ツールやバンドラーは、型を検査しない。型の検査は、tsc --noEmit で、別に実行する。エディタと、CI の両方で、型の検査を行う構成が、一般的である。</code></pre>

### 6.0 と 7.0 を併用する

7.0 は、プログラム用の API を持たない。typescript-eslint などが、`typescript` を直接読み込む場合は、npm の別名で、両方を入れる。

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.2",
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

この構成では、`tsc` が 7.0 を指し、6.0 は `tsc6` として使える。設定の詳細は、公式のブログを確認する。

---

## 設定 (tsconfig.json) <a id="tsconfig" data-name="設定"></a>

`tsconfig.json` は、コンパイラの設定ファイルで、プロジェクトのルートに置く。`tsc` は、引数にファイルを指定しないとき、このファイルを読む。

### 最小の構成

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "nodenext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "types": ["node"]
  },
  "include": ["src"]
}
```

### 主なオプション

| オプション | 内容 |
| --- | --- |
| `target` | 出力する JavaScript の、ECMAScript のバージョン |
| `module` | 出力するモジュール形式 (`esnext`、`nodenext`、`preserve` など) |
| `moduleResolution` | インポートの解決方法 (`nodenext`、`bundler`) |
| `rootDir` / `outDir` | 入力の基準ディレクトリと、出力先 |
| `strict` | 厳密な検査の、一括の指定 |
| `noEmit` | 出力せず、型の検査だけ行う |
| `lib` | 使える、標準ライブラリの型 (`dom` など) |
| `types` | 自動で読み込む、`@types` のパッケージ |
| `jsx` | JSX の変換方法 (`react-jsx`、`preserve` など) |
| `skipLibCheck` | `.d.ts` の検査を、省略する |
| `verbatimModuleSyntax` | `import type` と、通常のインポートを、書いたとおりに扱う |
| `noUncheckedIndexedAccess` | 配列やインデックスシグネチャの読み取りに、`undefined` を加える |
| `allowJs` / `checkJs` | JavaScript を含める / JavaScript も型検査する |
| `declaration` | `.d.ts` を出力する |
| `erasableSyntaxOnly` | 型の除去だけで動かせない構文 (`enum` など) を、エラーにする |

### 7.0 の既定値

6.0 と 7.0 では、既定値が変わった。

| オプション | 既定値 |
| --- | --- |
| `strict` | `true` |
| `module` | `esnext` |
| `target` | `esnext` の直前の、現在の安定した ECMAScript |
| `noUncheckedSideEffectImports` | `true` |
| `libReplacement` | `false` |
| `rootDir` | `./` (`src` などを使う場合は、明示する) |
| `types` | `[]` (従来の挙動は、`["*"]` で戻せる) |

<pre><code class="caution">types の既定値が空になったため、node、jest、mocha などの、グローバルな型を使うプロジェクトは、types に明示する必要がある。
rootDir の既定値が変わったため、tsconfig.json が src の外にあるプロジェクトは、rootDir を指定しないと、出力のディレクトリ構造が変わる。</code></pre>

### 推奨の構成

Node.js で動かす場合。

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "nodenext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["src"]
}
```

バンドラー (Vite など) を使う場合は、型の検査だけを行う。

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "lib": ["es2023", "dom", "dom.iterable"],
    "noEmit": true,
    "strict": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "types": []
  },
  "include": ["src"]
}
```

### moduleResolution の使い分け

| 値 | 場面 |
| --- | --- |
| `nodenext` | Node.js で、直接実行するコードやライブラリ。ESM / CommonJS の規則に従う |
| `bundler` | Vite、webpack などの、バンドラーを通すコード。拡張子の省略を、許す |

<pre><code class="tips">Node.js で ESM を直接実行する場合は、相対インポートに拡張子が必要になる。import { x } from "./util.js" のように、出力後の拡張子 (.js) で書く。</code></pre>

---

## 基本の型 <a id="basic-types" data-name="基本の型"></a>

### 型注釈と型推論

変数の後ろに `: 型` を書く。初期値から推論できるときは、省略できる。

```ts
const name: string = "shin";
const count = 10;          // number と推論する
let flag = true;           // boolean と推論する

// count = "ten";          // ❌ number に string は代入できない
```

<pre><code class="tips">型推論で分かる箇所には、型注釈を書かない。関数の引数、エクスポートする関数の戻り値、初期値のない変数には、型注釈を書く。</code></pre>

### プリミティブ型

| 型 | 内容 |
| --- | --- |
| `string` | 文字列 |
| `number` | 数値 (整数と小数) |
| `bigint` | 任意精度の整数 (`10n`) |
| `boolean` | 真偽値 |
| `symbol` | 一意な値 |
| `null` / `undefined` | 値がないことを表す |

<pre><code class="caution">型名は、小文字の string、number、boolean を使う。大文字の String、Number、Boolean は、ラッパーオブジェクトの型で、通常は使わない。</code></pre>

### 配列とタプル

```ts
const nums: number[] = [1, 2, 3];
const names: Array<string> = ["a", "b"];     // 同じ意味
const ro: readonly number[] = [1, 2, 3];     // 変更できない配列

// タプル: 要素の数と、位置ごとの型が決まる配列
const pair: [string, number] = ["age", 20];
const named: [name: string, age: number] = ["shin", 20];
```

### any、unknown、never、void

| 型 | 内容 | 使いどころ |
| --- | --- | --- |
| `any` | 型の検査を、無効にする | 避ける。移行の途中の、一時的な措置 |
| `unknown` | 何でも入るが、使う前に絞り込みが必要 | 外部から来る値、`catch` の値 |
| `never` | 値が存在しない型 | 到達しない分岐、網羅性の検査 |
| `void` | 戻り値を使わない関数 | 戻り値のない関数 |

```ts
function parse(input: unknown): number {
  if (typeof input === "number") {
    return input;       // ここでは number に絞り込まれている
  }
  throw new Error("number ではない");
}
```

<pre><code class="tips">型が分からない値は、any ではなく、unknown で受ける。unknown は、絞り込みを強制するため、誤りを実行前に見つけられる。</code></pre>

### リテラル型と as const

```ts
type Direction = "up" | "down" | "left" | "right";

let d: Direction = "up";
// d = "forward";        // ❌ Direction にない値

// as const: 値を、リテラル型と readonly に固定する
const config = {
  mode: "dark",
  size: 10,
} as const;
// config.mode の型は "dark"、config は変更できない
```

### satisfies

`satisfies` は、値が型に合うかを検査しつつ、推論された具体的な型を保つ。

```ts
type Colors = Record<string, string | number[]>;

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
} satisfies Colors;

palette.red.map((n) => n / 255);   // ✅ red は number[] のまま
palette.green.toUpperCase();       // ✅ green は string のまま
```

### 型アサーション

```ts
const el = document.getElementById("app") as HTMLDivElement;
const n = <number>someValue;      // .tsx では使えない。as を使う
```

<pre><code class="caution">as は、型の検査を黙らせるだけで、実行時に何も確認しない。値の形が違っても、エラーにならない。使う前に、絞り込みや検証で済まないかを、考える。</code></pre>

---

## オブジェクトの型 <a id="object-types" data-name="オブジェクトの型"></a>

### interface と type

```ts
interface User {
  id: number;
  name: string;
  email?: string;            // 省略できる
  readonly createdAt: Date;  // 代入できない
}

type Point = {
  x: number;
  y: number;
};

const u: User = { id: 1, name: "shin", createdAt: new Date() };
```

### interface と type の比較

| | `interface` | `type` |
| --- | --- | --- |
| オブジェクトの形 | ○ | ○ |
| ユニオン型、タプル、プリミティブの別名 | ✕ | ○ |
| 拡張 | `extends` | 交差型 (`&`) |
| 同名の宣言の統合 | ○ (宣言のマージ) | ✕ |
| クラスへの `implements` | ○ | ○ (オブジェクト型の場合) |

<pre><code class="tips">オブジェクトの形は interface、それ以外 (ユニオン、タプル、関数型、マップ型) は type、という使い分けが一般的である。チームで、どちらかに統一する方法もある。</code></pre>

### 拡張と交差

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}

type Timestamped = { createdAt: Date };
type Post = { title: string } & Timestamped;   // 交差型
```

### インデックスシグネチャ

キーが決まっていないオブジェクトは、インデックスシグネチャか、`Record` で表す。

```ts
interface Scores {
  [name: string]: number;
}

const scores: Scores = { alice: 90, bob: 80 };
const s: Record<string, number> = scores;   // 同じ意味
```

<pre><code class="tips">noUncheckedIndexedAccess を有効にすると、scores["carol"] の型が number | undefined になり、存在しないキーの読み取りに気付ける。</code></pre>

### 余剰プロパティの検査

オブジェクトリテラルを直接代入するとき、型にないプロパティは、エラーになる。

```ts
type Options = { width: number };

// const a: Options = { width: 1, height: 2 }; // ❌ 余剰プロパティ

const raw = { width: 1, height: 2 };
const b: Options = raw;   // ✅ 変数経由では、余剰プロパティを検査しない
```

### 構造的型付け

```ts
interface Named {
  name: string;
}

class Person {
  constructor(public name: string, public age: number) {}
}

const n: Named = new Person("shin", 20);   // ✅ name を持つので、代入できる
```

---

## ユニオン型と絞り込み <a id="union-narrowing" data-name="ユニオン型と絞り込み"></a>

### ユニオン型

「AまたはB」を表す型。`|` で並べる。

```ts
type Id = string | number;

function show(id: Id) {
  // id は string または number。共通のメソッドしか呼べない
  console.log(id.toString());
}
```

### 絞り込み (narrowing)

条件分岐によって、ユニオン型の範囲を狭める。

| 方法 | 例 | 対象 |
| --- | --- | --- |
| `typeof` | `typeof x === "string"` | プリミティブ型 |
| `instanceof` | `x instanceof Date` | クラスのインスタンス |
| `in` | `"bark" in x` | プロパティの有無 |
| 等価の比較 | `x === null`、`x !== undefined` | `null` や `undefined`、リテラル |
| 真偽値の判定 | `if (x)` | 真偽値、`null`、`undefined` |
| 型述語 | `isUser(x)` | 独自の判定関数 |

```ts
function format(value: string | number | Date): string {
  if (typeof value === "string") {
    return value.trim();           // string
  }
  if (value instanceof Date) {
    return value.toISOString();    // Date
  }
  return value.toFixed(2);         // number
}
```

### 判別可能なユニオン (discriminated union)

共通のプロパティ (判別子) の値で、型を区別するユニオン。状態の表現に向いている。

```ts
type Result =
  | { status: "ok"; value: number }
  | { status: "error"; message: string };

function handle(r: Result): string {
  switch (r.status) {
    case "ok":
      return `値: ${r.value}`;       // ok のプロパティが使える
    case "error":
      return `失敗: ${r.message}`;   // error のプロパティが使える
  }
}
```

### 網羅性の検査

`never` を使うと、ユニオンに分岐の漏れがあるとき、コンパイルエラーにできる。

```ts
function assertNever(x: never): never {
  throw new Error(`未処理の値: ${String(x)}`);
}

type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; size: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.r ** 2;
    case "square":
      return s.size ** 2;
    default:
      return assertNever(s);   // Shape に種類を足すと、ここでエラーになる
  }
}
```

### 型述語とアサーション関数

```ts
interface User {
  id: number;
  name: string;
}

// 型述語: true を返したとき、引数が User だと、コンパイラに伝える
function isUser(x: unknown): x is User {
  return (
    typeof x === "object" &&
    x !== null &&
    "id" in x &&
    "name" in x
  );
}

// アサーション関数: 返ってきたら、条件が成り立つと、コンパイラに伝える
function assertString(x: unknown): asserts x is string {
  if (typeof x !== "string") throw new TypeError("string ではない");
}
```

<pre><code class="caution">型述語の中身は、コンパイラが検証しない。判定が間違っていても、型の上では、正しいとして扱われる。外部のデータは、判定の内容を十分に確認するか、バリデーション用のライブラリを使う。</code></pre>

---

## 関数 <a id="functions" data-name="関数"></a>

### 型の書き方

```ts
// 宣言
function add(a: number, b: number): number {
  return a + b;
}

// アロー関数
const mul = (a: number, b: number): number => a * b;

// 関数型
type BinaryOp = (a: number, b: number) => number;
const sub: BinaryOp = (a, b) => a - b;   // 引数の型は、推論される
```

### 引数の種類

| 種類 | 書き方 | 内容 |
| --- | --- | --- |
| 省略できる引数 | `name?: string` | 型は、`string` または `undefined` |
| 既定値つきの引数 | `n: number = 10` | 省略すると、既定値になる |
| 残余引数 | `...rest: number[]` | 残りの引数を、配列で受ける |

```ts
function join(sep: string, ...parts: string[]): string {
  return parts.join(sep);
}

function greet(name: string, greeting = "Hello", suffix?: string): string {
  return `${greeting}, ${name}${suffix ?? ""}`;
}
```

### void と undefined

| 型 | 内容 |
| --- | --- |
| `void` | 戻り値を、使わない関数の戻り値の型 |
| `undefined` | `undefined` という値 |

<pre><code class="tips">コールバックの型が () =&gt; void のとき、戻り値のある関数も、渡せる。戻り値は、無視される。</code></pre>

### オーバーロード

引数の組み合わせによって、戻り値の型が変わる関数は、オーバーロードで表す。

```ts
function toArray(x: string): string[];
function toArray(x: number): number[];
function toArray(x: string | number): (string | number)[] {
  return [x];
}

const a = toArray("a");   // string[]
const b = toArray(1);     // number[]
```

<pre><code class="tips">オーバーロードより、ユニオン型やジェネリクスで書けないかを、先に考える。オーバーロードのシグネチャは、実装のシグネチャからは、外部に見えない。</code></pre>

### this の型

```ts
function say(this: { name: string }) {
  console.log(this.name);
}
```

アロー関数は、`this` を持たず、外側の `this` を使う。

### 戻り値の型の推論

戻り値の型は、`return` の式から推論される。ライブラリの公開 API では、戻り値の型を、明示する方が、意図しない型の変化を防げる。

```ts
// 推論: Promise<number>
async function fetchCount() {
  return 1;
}
```

---

## クラス <a id="classes" data-name="クラス"></a>

### 基本

```ts
class Counter {
  private count = 0;   // 初期値があるので、型は推論される

  increment(): number {
    this.count += 1;
    return this.count;
  }
}

const c = new Counter();
c.increment();
```

### アクセス修飾子

| 修飾子 | 内容 |
| --- | --- |
| `public` | どこからでも、アクセスできる (既定) |
| `protected` | クラスと、サブクラスから、アクセスできる |
| `private` | クラスの中だけ (型の上の制限。実行時には、アクセスできる) |
| `#name` | JavaScript の、本物のプライベートフィールド |
| `readonly` | コンストラクタ以外では、代入できない |

<pre><code class="caution">TypeScript の private は、型の検査だけの制限で、実行時には通常のプロパティである。実行時にも隠したいときは、#name を使う。</code></pre>

### パラメータプロパティ

コンストラクタの引数に修飾子を付けると、プロパティの宣言と、代入を、省略できる。

```ts
class User {
  constructor(
    public readonly id: number,
    public name: string,
  ) {}
}

const u = new User(1, "shin");
console.log(u.name);
```

<pre><code class="caution">パラメータプロパティと、enum は、型を取り除くだけでは動かない構文である。型の除去だけで実行する環境 (Node.js の直接実行など) では、erasableSyntaxOnly を有効にして、使わない設計にそろえる方法がある。</code></pre>

### 継承、抽象クラス、implements

```ts
abstract class Shape {
  abstract area(): number;

  describe(): string {
    return `面積: ${this.area()}`;
  }
}

class Square extends Shape {
  constructor(private size: number) {
    super();
  }

  override area(): number {   // override: 親にないメソッドなら、エラーになる
    return this.size ** 2;
  }
}

interface Printable {
  print(): void;
}

class Doc implements Printable {   // 形を満たすことを、検査する
  print() {
    console.log("print");
  }
}
```

### アクセサ

```ts
class Temperature {
  private _celsius = 0;

  get fahrenheit(): number {
    return this._celsius * 1.8 + 32;
  }

  set celsius(value: number) {
    this._celsius = value;
  }
}
```

---

## ジェネリクス <a id="generics" data-name="ジェネリクス"></a>

### 基本

型を引数として受け取る仕組み。同じ処理を、さまざまな型に対して、型安全に書ける。

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const a = first([1, 2, 3]);      // number | undefined (推論)
const b = first<string>([]);     // 明示することもできる
```

### 制約

`extends` で、型引数が満たすべき条件を指定する。

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("abc", "de");       // ✅ string は length を持つ
longest([1, 2], [3]);       // ✅ 配列も length を持つ
// longest(1, 2);           // ❌ number は length を持たない
```

### keyof との組み合わせ

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "shin" };
const name = pick(user, "name");   // string
// pick(user, "age");              // ❌ "age" は user のキーではない
```

### ジェネリックな型とクラス

```ts
interface Box<T> {
  value: T;
}

type ApiResponse<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };      // E には、既定の型を指定できる

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }
}

const s = new Stack<number>();
s.push(1);
```

### const 型パラメータ

`const` を付けると、渡されたリテラルを、狭い型として推論する。

```ts
function tuple<const T extends readonly unknown[]>(x: T): T {
  return x;
}

const t = tuple(["a", 1]);   // readonly ["a", 1]
```

<pre><code class="tips">型引数の名前は、T、U、K、V のように、1 文字で書くことが多い。意味が複雑な場合は、TItem、TKey のように、名前を付ける。</code></pre>

---

## ユーティリティ型 <a id="utility-types" data-name="ユーティリティ型"></a>

標準で用意されている、型を変換するための型。

### オブジェクト型の変換

| 型 | 内容 |
| --- | --- |
| `Partial<T>` | すべてのプロパティを、省略可能にする |
| `Required<T>` | すべてのプロパティを、必須にする |
| `Readonly<T>` | すべてのプロパティを、読み取り専用にする |
| `Pick<T, K>` | 指定したキーだけを、取り出す |
| `Omit<T, K>` | 指定したキーを、取り除く |
| `Record<K, V>` | キーが `K`、値が `V` の、オブジェクト型を作る |

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserPatch = Partial<User>;                 // 更新用: すべて省略可能
type UserPreview = Pick<User, "id" | "name">;   // 一部だけ
type NewUser = Omit<User, "id">;                // id を除く
type Roles = Record<"admin" | "guest", boolean>;
```

### ユニオン型の変換

| 型 | 内容 |
| --- | --- |
| `Exclude<T, U>` | `T` から、`U` に代入できる型を除く |
| `Extract<T, U>` | `T` から、`U` に代入できる型だけを取り出す |
| `NonNullable<T>` | `null` と `undefined` を除く |

```ts
type A = Exclude<"a" | "b" | "c", "a">;     // "b" | "c"
type B = Extract<string | number, number>;  // number
type C = NonNullable<string | null>;        // string
```

### 関数とクラスの型

| 型 | 内容 |
| --- | --- |
| `ReturnType<F>` | 関数の戻り値の型 |
| `Parameters<F>` | 関数の引数の型 (タプル) |
| `Awaited<T>` | `Promise` を、再帰的に、展開した型 |
| `InstanceType<C>` | クラスの、インスタンスの型 |
| `ConstructorParameters<C>` | コンストラクタの、引数の型 |
| `NoInfer<T>` | その位置から、型引数を推論しない |

```ts
function createUser(name: string, age: number) {
  return { name, age };
}

type Created = ReturnType<typeof createUser>;   // { name: string; age: number }
type Args = Parameters<typeof createUser>;      // [name: string, age: number]
type Value = Awaited<Promise<Promise<number>>>; // number
```

### 文字列の型

| 型 | 内容 |
| --- | --- |
| `Uppercase<S>` | 大文字にする |
| `Lowercase<S>` | 小文字にする |
| `Capitalize<S>` | 先頭を、大文字にする |
| `Uncapitalize<S>` | 先頭を、小文字にする |

<pre><code class="tips">Partial、Pick、Omit は、元の型から、派生した型を作る用途に向く。元の型を変更したとき、派生した型にも、反映される。</code></pre>

---

## 型の演算 <a id="type-operations" data-name="型の演算"></a>

### keyof と typeof

```ts
const user = { id: 1, name: "shin" };

type User = typeof user;           // { id: number; name: string }
type UserKey = keyof User;         // "id" | "name"
```

### インデックスアクセス型

```ts
type User = { id: number; tags: string[] };

type Id = User["id"];              // number
type Tag = User["tags"][number];   // string

const roles = ["admin", "guest"] as const;
type Role = (typeof roles)[number];   // "admin" | "guest"
```

### 条件型と infer

`T extends U ? X : Y` で、型に応じて、別の型を選ぶ。`infer` で、一致した部分の型を、取り出す。

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<"a">;   // true
type B = IsString<1>;     // false

// 配列の要素の型を、取り出す
type ElementOf<T> = T extends (infer E)[] ? E : never;
type E = ElementOf<number[]>;   // number
```

<pre><code class="caution">条件型に、ユニオン型を渡すと、各要素に対して、分配されて評価される。分配させたくないときは、[T] extends [U] のように、タプルで包む。</code></pre>

### マップ型

```ts
type Flags<T> = {
  [K in keyof T]: boolean;
};

// 修飾子の付け外し: -readonly と -? で、取り除く
type Mutable<T> = {
  -readonly [K in keyof T]-?: T[K];
};

// キーの名前の変換 (as)
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type G = Getters<{ name: string }>;   // { getName: () => string }
```

### テンプレートリテラル型

```ts
type EventName = `on${"Click" | "Hover"}`;   // "onClick" | "onHover"

type Path = `/${string}`;
const p: Path = "/users";
// const q: Path = "users";    // ❌ 先頭が / ではない
```

<pre><code class="caution">TypeScript 7.0 から、テンプレートリテラル型の推論は、Unicode のコードポイント単位になった。絵文字などは、1 つの単位として扱われる。UTF-16 のコード単位で文字数を数える型は、結果が変わる。</code></pre>

---

## 列挙型と代替 <a id="enums" data-name="列挙型と代替"></a>

### enum

```ts
enum Color {
  Red,      // 0
  Green,    // 1
  Blue,     // 2
}

enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

const c: Color = Color.Red;
```

`enum` は、型だけでなく、実行時のオブジェクトも生成する。

### as const のオブジェクトによる代替

```ts
const Status = {
  Active: "ACTIVE",
  Inactive: "INACTIVE",
} as const;

type Status = (typeof Status)[keyof typeof Status];   // "ACTIVE" | "INACTIVE"

function show(s: Status) {
  console.log(s);
}

show(Status.Active);
show("INACTIVE");   // ✅ 文字列リテラルも、渡せる
```

### 比較

| | `enum` | `as const` のオブジェクト | リテラルのユニオン |
| --- | --- | --- | --- |
| 実行時の値 | あり | あり | なし |
| 型の除去だけで動く | ✕ | ○ | ○ |
| 値の一覧を、列挙できる | ○ | ○ | ✕ |
| 文字列リテラルを、直接渡せる | ✕ (文字列 enum) | ○ | ○ |

<pre><code class="tips">新規のコードでは、リテラルのユニオン、または、as const のオブジェクトが、扱いやすい。型の除去だけで実行する環境では、erasableSyntaxOnly を有効にすると、enum の使用をエラーにできる。</code></pre>

<pre><code class="caution">const enum は、ビルドツールによっては、正しく扱われない。ライブラリで公開する型には、使わない方がよい。</code></pre>

---

## モジュール <a id="modules" data-name="モジュール"></a>

### import と export

トップレベルに、`import` または `export` を持つファイルは、モジュールとして扱われる。

```ts
// math.ts
export const PI = 3.14;
export function add(a: number, b: number): number {
  return a + b;
}
export default function main() {}

// app.ts
import main, { PI, add } from "./math.js";
import * as math from "./math.js";
```

### 型だけのインポート

型だけを使うインポートには、`import type` を付ける。出力されるコードから、完全に消える。

```ts
import type { User } from "./user.js";
import { type Role, getRole } from "./role.js";   // 型と値を、まとめて

export type { User };
```

<pre><code class="tips">verbatimModuleSyntax を有効にすると、型だけのインポートに、import type を付けていない場合が、エラーになる。インポートが、出力にどう反映されるかが、書いたとおりに決まる。</code></pre>

### インポート属性

JSON などの、モジュールの種類を指定するときは、`with` を使う。

```ts
import data from "./data.json" with { type: "json" };
```

<pre><code class="caution">旧来の assert キーワード (import ... assert) は、TypeScript 6.0 で非推奨になり、7.0 ではエラーになる。with に書き換える。</code></pre>

### 拡張子とパスの解決

| 設定 | 相対インポートの拡張子 |
| --- | --- |
| `moduleResolution: nodenext` | 必要 (`./util.js`) |
| `moduleResolution: bundler` | 省略できる (`./util`) |

TypeScript 6.0 から、`package.json` の `imports` に、`#/` で始まるサブパスを定義できる (`nodenext` と `bundler` で対応)。

```json
{
  "imports": {
    "#/*": "./dist/*"
  }
}
```

### CommonJS との相互運用

`esModuleInterop` と `allowSyntheticDefaultImports` は、7.0 では `false` にできない。CommonJS のモジュールを、既定インポートで読み込める前提で、書ける。

```ts
import fs from "node:fs";
import path from "node:path";
```

### 名前空間と declare module

<pre><code class="caution">namespace の宣言に、module キーワードは使えない (7.0)。namespace を使う。新規のコードでは、ES モジュールを使い、namespace は避ける。</code></pre>

---

## 宣言ファイルと型定義 <a id="declarations" data-name="宣言ファイル"></a>

### .d.ts

`.d.ts` は、型だけを書くファイルで、実装を持たない。JavaScript のライブラリに、型を与えるときに使う。

```ts
// greet.d.ts
export declare function greet(name: string): string;
export declare const VERSION: string;
```

### @types と同梱の型

| 方法 | 内容 |
| --- | --- |
| ライブラリが、型を同梱 | `package.json` の `types` から、自動で読み込まれる |
| `@types/パッケージ名` | DefinitelyTyped の型定義を、`npm install -D @types/node` のように入れる |
| 自分で書く | プロジェクト内に `.d.ts` を置く |

<pre><code class="caution">7.0 では、types の既定値が空になった。@types のパッケージは、自動では読み込まれない。グローバルに効くもの (@types/node など) は、tsconfig.json の types に書く。インポートされるモジュールの型は、types に書かなくても、読み込まれる。</code></pre>

### グローバルとモジュールの拡張

```ts
// グローバルの拡張
declare global {
  interface Window {
    appVersion: string;
  }
}

// モジュールの拡張
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export {};   // ファイルを、モジュールとして扱わせる
```

### 型定義が無いライブラリ

```ts
// types.d.ts: 型が無いモジュールを、any として受け入れる (最終手段)
declare module "legacy-lib";

// 最低限の型を、書く方がよい
declare module "legacy-lib" {
  export function run(arg: string): void;
}
```

---

## 非同期処理 <a id="async" data-name="非同期処理"></a>

### Promise と async/await

```ts
async function fetchUser(id: number): Promise<{ id: number; name: string }> {
  const res = await fetch(`https://example.com/api/users/${id}`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as { id: number; name: string };
}
```

<pre><code class="caution">res.json() の戻り値は、実行時には、検証されない。as による型の指定は、サーバーが、期待どおりの形を返す前提である。外部のデータは、バリデーション用のライブラリで、検証してから使う。</code></pre>

### 複数の Promise

```ts
const [a, b] = await Promise.all([
  Promise.resolve(1),
  Promise.resolve("two"),
]);   // a: number、b: string (タプルとして推論される)

const results = await Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(new Error("失敗")),
]);

for (const r of results) {
  if (r.status === "fulfilled") {
    console.log(r.value);
  } else {
    console.error(r.reason);
  }
}
```

| メソッド | 内容 |
| --- | --- |
| `Promise.all` | すべて成功したら、結果の配列を返す。1つでも失敗したら、失敗する |
| `Promise.allSettled` | すべての完了を、待つ。成功と失敗の、両方を返す |
| `Promise.race` | 最初に完了したものの結果を返す |
| `Promise.any` | 最初に成功したものの結果を返す |

### 非同期関数の型

```ts
type Loader<T> = (id: number) => Promise<T>;

async function load<T>(loader: Loader<T>, id: number): Promise<T> {
  return loader(id);
}

type Result = Awaited<ReturnType<typeof fetchUser>>;   // 解決後の型
```

### catch の値

`strict` では、`catch` の値は `unknown` になる。使う前に、絞り込む。

```ts
try {
  await fetchUser(1);
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error(String(e));
  }
}
```

---

## null の扱いとエラー処理 <a id="null-safety" data-name="nullの扱い"></a>

### strictNullChecks

`strict` を有効にすると、`null` と `undefined` は、他の型に代入できなくなる。

```ts
function length(s: string | null): number {
  // return s.length;       // ❌ s は null かもしれない
  return s?.length ?? 0;    // ✅
}
```

### 演算子

| 演算子 | 内容 | 例 |
| --- | --- | --- |
| `?.` | オプショナルチェーン。`null` / `undefined` なら、`undefined` を返す | `user?.address?.city` |
| `??` | `null` / `undefined` のときだけ、右辺を使う | `count ?? 0` |
| `!` | 非 null アサーション。コンパイラに、null でないと伝える | `el!.value` |
| `?.()` | 関数が存在すれば、呼び出す | `callback?.()` |

<pre><code class="caution">! は、実行時に何も確認しない。null だった場合は、実行時にエラーになる。絞り込みや、?? で、代替できないかを、先に考える。</code></pre>

<pre><code class="tips">|| は、0、空文字、false も、右辺に置き換える。値がないことだけを判定したいときは、?? を使う。</code></pre>

### Result 型

例外の代わりに、成功と失敗を、型で表す方法。

```ts
type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseAge(input: string): Result<number> {
  const n = Number(input);
  if (!Number.isInteger(n) || n < 0) {
    return { ok: false, error: "不正な年齢" };
  }
  return { ok: true, value: n };
}

const r = parseAge("20");
if (r.ok) {
  console.log(r.value);   // number
} else {
  console.error(r.error); // string
}
```

---

## 比較的新しい機能 <a id="modern-features" data-name="新しい機能"></a>

| 機能 | バージョン | 内容 |
| --- | --- | --- |
| `satisfies` | 4.9 | 型に合うかを検査しつつ、推論された型を保つ |
| 標準のデコレータ | 5.0 | ECMAScript 標準のデコレータ |
| `const` 型パラメータ | 5.0 | ジェネリクスで、リテラルを狭く推論する |
| `using` | 5.2 | 明示的なリソース管理 (スコープを抜けたときに、破棄する) |
| インポート属性 `with` | 5.3 | `import ... with { type: "json" }` |
| `NoInfer` | 5.4 | 特定の位置からの、型の推論を止める |
| 型述語の推論 | 5.5 | `filter` などで、型述語が、自動で推論される |
| `erasableSyntaxOnly` | 5.8 | 型の除去だけで動かない構文を、エラーにする |

<pre><code class="caution">この表のバージョンは、記憶に基づく。使う前に、公式のリリースノートで、確認する。using は、実行環境が、対応している必要がある。</code></pre>

### using

```ts
class Connection {
  [Symbol.dispose]() {
    console.log("接続を閉じる");
  }
}

function run() {
  using conn = new Connection();   // スコープを抜けると、自動で破棄される
  console.log("処理する");
}
```

### 型述語の推論

```ts
const values = [1, null, 2, undefined];
const nums = values.filter((v) => v != null);   // number[] (新しいバージョン)
```

---

## JavaScript との共存 <a id="javascript" data-name="JavaScriptとの共存"></a>

### allowJs と checkJs

| オプション | 内容 |
| --- | --- |
| `allowJs` | `.js` ファイルを、プロジェクトに含める |
| `checkJs` | `.js` ファイルにも、型検査を行う |
| `maxNodeModuleJsDepth` | `node_modules` 内の JavaScript を、どこまで解析するか |

```js
// @ts-check
/**
 * @param {string} name
 * @returns {string}
 */
export function greet(name) {
  return `Hello, ${name}`;
}
```

### 7.0 での JavaScript の扱いの変更

7.0 では、JavaScript の解析が、TypeScript の解析に、近づけられた。

| 7.0 より前の書き方 | 7.0 |
| --- | --- |
| 型の位置に、値を書く | `typeof someValue` と書く |
| `@enum` | 特別扱いされない。`@typedef` で、型を作る |
| 単独の `?` を、型として使う | `any` を使う |
| `@class` で、関数をコンストラクタにする | `class` 宣言を使う |
| 後置の `!` | 使えない。型を、そのまま書く |
| Closure 形式の関数型 (`function(string): void`) | `(s: string) => void` と書く |

<pre><code class="tips">差異の詳細は、typescript-go リポジトリの CHANGES.md に、まとめられている。JavaScript から移行する場合は、ファイル単位で、.ts に変えていく方法が、確実である。</code></pre>

---

## ツールチェーン <a id="toolchain" data-name="ツールチェーン"></a>

### tsc のコマンド

| コマンド | 内容 |
| --- | --- |
| `tsc` | `tsconfig.json` に従って、検査と出力を行う |
| `tsc --noEmit` | 出力せず、型の検査だけ行う |
| `tsc --watch` | ファイルの変更を監視して、再検査する |
| `tsc --build` | プロジェクト参照に従って、複数のプロジェクトをビルドする |
| `tsc --init` | `tsconfig.json` を作る |
| `tsc --showConfig` | 解決後の設定を、表示する |

<pre><code class="caution">7.0 では、カレントディレクトリに tsconfig.json があるとき、コマンドラインでファイルのパスを渡すと、エラーになる。パスを渡したいときは、--ignoreConfig を付ける。</code></pre>

### 7.0 の並列化のフラグ

| フラグ | 内容 |
| --- | --- |
| `--checkers` | 型検査のワーカー数 (既定は 4。実験的) |
| `--builders` | `--build` で、同時にビルドするプロジェクト数 (実験的) |
| `--singleThreaded` | 並列化を、すべて無効にする |

<pre><code class="tips">--checkers を増やすと、大きなコードベースで、速くなる場合があるが、メモリの使用量も増える。CI などの小さなマシンでは、減らす方がよい場合がある。--checkers の値によって、まれに、結果の順序が変わることがある。チームで、値を固定する方法もある。</code></pre>

### プロジェクト参照

```json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [{ "path": "../shared" }]
}
```

### エディタと周辺ツール

| ツール | 内容 |
| --- | --- |
| VS Code | 7.0 用の拡張機能で、新しい言語サーバーを使える。無効にすると、6.0 に戻せる |
| typescript-eslint | ESLint で、型の情報を使った検査を行う。7.0 では、6.0 の API を、別名で使う |
| Vite、esbuild、swc | 型を取り除いて、高速にビルドする。型の検査は、行わない |
| tsx | `.ts` を、すぐに実行する |
| Vitest、Jest | テストの実行 |

<pre><code class="caution">Vue、Svelte、Astro、MDX、Angular の、テンプレート内の型検査は、7.0 の API が無いため、当面 6.0 を使う。Angular は、CLI での検査に 7.0、エディタに 6.0、という使い分けが、公式のブログで紹介されている。Vue のドキュメントも、参照。</code></pre>

---

## フレームワークとの組み合わせ <a id="frameworks" data-name="フレームワーク"></a>

### Node.js

```bash
npm install -D typescript @types/node
```

```json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

### React

```tsx
import { useState } from "react";

type Props = {
  label: string;
  onSelect?: (value: number) => void;
};

export function Counter({ label, onSelect }: Props) {
  const [count, setCount] = useState<number>(0);

  return (
    <button
      onClick={() => {
        setCount(count + 1);
        onSelect?.(count + 1);
      }}
    >
      {label}: {count}
    </button>
  );
}
```

| 型 | 内容 |
| --- | --- |
| `ReactNode` | 描画できる、すべての値 |
| `ComponentProps<"button">` | HTML 要素の、props の型 |
| `PropsWithChildren<P>` | `children` を加えた、props の型 |

### Vue

Vue のドキュメントを参照。`<script setup lang="ts">` で、TypeScript を使う。テンプレート内の型検査には、language service のプラグインが必要で、7.0 では、まだ使えない (6.0 を使う)。

---

## 実践例 <a id="practice" data-name="実践例"></a>

### 型安全なイベントエミッター

```ts
type Events = {
  login: { userId: number };
  logout: undefined;
  message: { from: string; text: string };
};

class Emitter<E extends Record<string, unknown>> {
  private handlers: { [K in keyof E]?: Array<(payload: E[K]) => void> } = {};

  on<K extends keyof E>(event: K, handler: (payload: E[K]) => void): void {
    (this.handlers[event] ??= []).push(handler);
  }

  emit<K extends keyof E>(event: K, payload: E[K]): void {
    this.handlers[event]?.forEach((h) => h(payload));
  }
}

const emitter = new Emitter<Events>();

emitter.on("message", (p) => {
  console.log(`${p.from}: ${p.text}`);   // p は { from; text } と推論される
});

emitter.emit("message", { from: "shin", text: "hello" });
// emitter.emit("message", { from: "shin" });   // ❌ text が無い
```

### 状態遷移の型

```ts
type State =
  | { name: "idle" }
  | { name: "loading"; startedAt: number }
  | { name: "success"; data: string[] }
  | { name: "failure"; error: Error };

type Action =
  | { type: "fetch" }
  | { type: "resolve"; data: string[] }
  | { type: "reject"; error: Error };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "fetch":
      return { name: "loading", startedAt: Date.now() };
    case "resolve":
      return { name: "success", data: action.data };
    case "reject":
      return { name: "failure", error: action.error };
  }
}
```

### 外部データの検証

型は、実行時に消える。外部のデータは、検証関数を通して、型を付ける。

```ts
type Config = { host: string; port: number };

function isConfig(x: unknown): x is Config {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return typeof o.host === "string" && typeof o.port === "number";
}

function loadConfig(text: string): Config {
  const parsed: unknown = JSON.parse(text);
  if (!isConfig(parsed)) {
    throw new Error("設定の形式が不正");
  }
  return parsed;
}
```

<pre><code class="tips">検査する項目が多い場合は、スキーマから型と検証を、同時に作る、バリデーション用のライブラリが便利である。ライブラリの選択は、プロジェクトの要件に合わせる。</code></pre>

---

## 古いコードからの変更 <a id="migration" data-name="古いコードからの変更"></a>

6.0 で非推奨になり、7.0 でエラーになった設定と構文。

| 古い書き方 | 現在 | バージョン |
| --- | --- | --- |
| `target: es5` | `es2015` 以降を指定する | 7.0 でエラー |
| `downlevelIteration` | 不要 (`es2015` 以降で、反復は、ネイティブに動く) | 7.0 でエラー |
| `moduleResolution: node` / `node10` | `nodenext` または `bundler` | 7.0 でエラー |
| `moduleResolution: classic` | `nodenext` または `bundler` | 7.0 でエラー |
| `module: amd` / `umd` / `systemjs` / `none` | `esnext` または `preserve` (バンドラーと併用) | 7.0 でエラー |
| `baseUrl` | `paths` を、プロジェクトのルートからの、相対パスにする | 7.0 でエラー |
| `esModuleInterop: false` | 設定しない (常に有効) | 7.0 でエラー |
| `allowSyntheticDefaultImports: false` | 設定しない (常に有効) | 7.0 でエラー |
| `alwaysStrict: false` | 設定しない (常に有効) | 7.0 でエラー |
| `import x from "./a" assert { ... }` | `with { ... }` | 7.0 でエラー |
| `module Foo {}` (名前空間) | `namespace Foo {}` | 7.0 でエラー |
| `types` を省略して、`@types` を自動で読み込む | `types` に、必要なものを明示する | 7.0 で既定値が変更 |
| `rootDir` を省略 | `rootDir` を明示する | 7.0 で既定値が変更 |

<pre><code class="tips">6.0 に上げて、非推奨の警告を、先に解消しておくと、7.0 への移行が、容易になる。7.0 は、6.0 の型検査の結果と、同じ結果になることを、目指している。</code></pre>

### 移行の手順

| 手順 | 内容 |
| --- | --- |
| 1 | 6.0 に上げて、`tsc` を実行し、警告とエラーを、解消する |
| 2 | `tsconfig.json` に、`rootDir` と `types` を、明示する |
| 3 | `typescript` を 7.0 に上げて、`tsc` の結果を、比較する |
| 4 | `typescript-eslint` などが、6.0 の API を要求する場合は、別名で併用する |
| 5 | エディタの、7.0 の言語サーバーを、有効にする |

---

## テスト <a id="testing" data-name="テスト"></a>

### 実行時のテスト

Vitest や Jest などの、テストフレームワークを使う。TypeScript のテストファイルは、型を取り除いて、実行される。

```ts
import { describe, expect, it } from "vitest";
import { add } from "./math.js";

describe("add", () => {
  it("2 つの数を足す", () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

### 型のテスト

型が期待どおりであることを、コンパイルで確認する。`@ts-expect-error` は、次の行が、エラーにならないとき、エラーになる。

```ts
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

const ok: Equal<ReturnType<typeof parseInt>, number> = true;

// @ts-expect-error 文字列は、数値の引数に渡せない
parseInt(123);
```

<pre><code class="tips">型のテストは、tsc --noEmit で、検査する。テストの実行ツールは、型を検査しないため、型の検査を、CI に組み込む。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `Type 'string' is not assignable to type 'number'` | 型が、一致していない | 値か型を、直す。`as` で黙らせない |
| `Parameter 'x' implicitly has an 'any' type` | 引数の型を、推論できない | 型注釈を、書く |
| `'x' is possibly 'undefined'` | `strict` で、`undefined` の可能性がある | `?.`、`??`、条件分岐で、絞り込む |
| `Cannot find module './util' or its corresponding type declarations` | `nodenext` で、拡張子が無い、または型定義が無い | `./util.js` と書く。型定義を入れる |
| `Cannot find name 'process'` / `'describe'` | `types` が空で、`@types` が読み込まれない (7.0) | `types` に、`node` などを、書く |
| `Property 'x' does not exist on type` | 型に、プロパティが定義されていない | 型を直す。絞り込む。`in` で、確認する |
| `Property 'x' has no initializer` | クラスのプロパティが、初期化されていない | 初期値を、書く。または、コンストラクタで代入する |
| 出力のパスが、意図と違う (`dist/src/...`) | `rootDir` を指定していない (7.0 の既定は `./`) | `rootDir` を、`./src` などに指定する |
| `moduleResolution` や `target` の設定に関するエラー | 6.0 で非推奨の設定が、7.0 でエラーになった | `nodenext` または `bundler` に変更する |
| 実行時に、型の通りの値ではない | 外部データを、`as` や型注釈で扱っている | 実行時に検証して、型を付ける |
| `enum` や パラメータプロパティが、直接実行で動かない | 型の除去だけでは、変換できない構文 | `erasableSyntaxOnly` を有効にして、使わない |
| `@ts-ignore` が増えて、型が信用できない | エラーを黙らせている | `@ts-expect-error` に変えて、理由を書く |
| 配列の要素が、`undefined` を含まない型になる | `noUncheckedIndexedAccess` が、無効 | 有効にして、読み取りを、確認する |
| Vue のテンプレートで、型の検査が効かない | 7.0 は、言語サービス用の API が無い | 6.0 を使う。7.1 以降の対応を、待つ |

---

## 関連ツール <a id="ecosystem" data-name="関連ツール"></a>

| ツール | 用途 |
| --- | --- |
| `typescript-eslint` | 型情報を使った、静的解析 |
| `tsx` | `.ts` の、直接実行 |
| `Vite` | 開発サーバーと、バンドル |
| `Vitest` | テストの実行 |
| `zod` などのバリデーション用ライブラリ | 実行時の検証と、型の生成 |
| `@types/node` | Node.js の型定義 |
| `Prettier` | コードの整形 |

関連するドキュメント: Vue、Git と GitHub、データフォーマット (JSON)、Docker のドキュメントを参照。
