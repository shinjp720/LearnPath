---
title: CSS
layout: default
---

# CSS <a id="top" data-name="TOP"></a>

CSS (Cascading Style Sheets) は、ウェブサイトやウェブアプリの見た目を整えるための言語である。HTML が骨組みと内容を作るのに対し、CSS は色、レイアウト、フォントなどのデザインを作る。

このノートは、基本の考え方、セレクターと優先順位、レイアウト、見た目の指定、動きと画面サイズへの対応、モダンな機能、レシピと落とし穴の順に並べている。

| 区分 | 章 |
| --- | --- |
| 基本の考え方 | <a href="#basic">基本</a>、<a href="#box-model">ボックスモデル</a> |
| 対象の選び方と優先順位 | <a href="#selector">セレクター</a>、<a href="#pseudo-class">疑似クラス</a>、<a href="#pseudo-element">疑似要素</a>、<a href="#cascade">詳細度とカスケード</a>、<a href="#css-invalid">CSS が効かない</a> |
| レイアウト | <a href="#display">表示とオーバーフロー</a>、<a href="#position">位置指定</a>、<a href="#flex">Flexbox</a>、<a href="#grid">Grid</a> |
| 見た目 | <a href="#text">文字とフォント</a>、<a href="#color">色・背景・枠線・影</a>、<a href="#image">画像とメディア</a>、<a href="#list-table">リストとテーブル</a> |
| 値の書き方 | <a href="#units">単位と関数</a>、<a href="#variables">カスタムプロパティ</a> |
| 動きと適応 | <a href="#animation">トランジションとアニメーション</a>、<a href="#media-queries">メディアクエリ</a> |
| 発展と実践 | <a href="#modern">モダンな CSS</a>、<a href="#recipe">よく使うレシピ</a>、<a href="#pitfalls">よくある落とし穴</a>、<a href="#tools">関連ツール</a> |

---

## 基本 <a id="basic" data-name="基本"></a>

### 基本構文

```css
selector {
  property1: value1;
  property2: value2;
}
```

| 項目 | 説明 |
| --- | --- |
| selector (セレクター) | どの要素に対してスタイルを適用するのかを指定する |
| property (プロパティ) | 何を変えるかを指定する。値と組み合わせることで、要素にさまざまなスタイルを定義する |
| value (値) | スタイルの具体的な内容を、数値やキーワードで指定する |

プロパティと値の組を「宣言」、`{ }` の中の宣言のまとまりを「宣言ブロック」と呼ぶ。

```css
h1, h2 {
    color: red;
}
```

### HTML への適用

CSS を HTML に適用する方法は、3 種類ある。

1. **外部ファイル**: .css ファイルを作成し、HTML の `<head>` タグ内で読み込む。

```html
<link rel="stylesheet" href="style.css">
```

2. **内部埋め込み**: HTML の `<style>` タグ内に書く。

```html
<style>
  p { color: red; }
</style>
```

3. **インライン**: タグに直接書く。

```html
<p style="color: red;">
```

| 方法 | 向いている場面 |
| --- | --- |
| 外部ファイル | 基本。複数のページで共有でき、ブラウザにキャッシュされる |
| 内部埋め込み | 1ページだけの小さなスタイル、サンプルコード |
| インライン | 動的に変わる値 (JavaScript で設定するなど)。詳細度が高く、上書きしにくいので、通常は避ける |

### コメント

```css
/* コメント */
```

CSS のコメントは `/* */` だけで、`//` は使えない。

### @ルール

`@` で始まる構文を、@ルールと呼ぶ。

| @ルール | 用途 |
| --- | --- |
| `@media` | 画面サイズなどの条件で、スタイルを切り替える |
| `@import` | 別の CSS ファイルを読み込む (読み込みが直列になって遅くなるので、`<link>` を優先する) |
| `@font-face` | Web フォントを定義する |
| `@keyframes` | アニメーションの途中の状態を定義する |
| `@layer` | カスケードレイヤー (優先順位のグループ) を定義する |
| `@container` | 親のコンテナのサイズで、スタイルを切り替える |
| `@supports` | ブラウザがその機能に対応しているときだけ、スタイルを適用する |
| `@property` | カスタムプロパティに、型と初期値を登録する |

```css
/* grid に対応しているブラウザだけに適用 */
@supports (display: grid) {
    .layout {
        display: grid;
    }
}
```

---

## ボックスモデル <a id="box-model" data-name="ボックスモデル"></a>

全ての要素は箱 (ボックス) として扱われる。レイアウトの計算は、すべてこの箱が基準になる。

```text
┌ margin ───────────────┐ -> 枠線の外側の余白
│ ┌ border ───────────┐ │ -> 枠線そのもの
│ │ ┌ padding ──────┐ │ │ -> 枠線の内側の余白
│ │ │   content     │ │ │ -> テキストや画像そのもの
│ │ └───────────────┘ │ │
│ └───────────────────┘ │
└───────────────────────┘
```

### box-sizing

`width` の計算方法を指定する。既定は `content-box`。

| 値 | `width` が指す範囲 | ボックス全体の幅 |
| --- | --- | --- |
| `content-box` (既定) | `content` だけ | `width` + `padding` + `border` |
| `border-box` | `content` + `padding` + `border` | `width` そのもの |

<pre><code class="example">*,
*::before,
*::after {
    box-sizing: border-box;
}</code></pre>

<pre><code class="tips">border-box にすると、padding や border を足しても、指定した width からはみ出さない。
そのため、実務では、上のように全体に指定することが多い。</code></pre>

### margin, padding の複数指定

```css
/* 四辺すべてに適用 */
margin: 10px;
/* 上下 左右 */
margin: 5% auto;
/* 上 左右 下 */
margin: 1em auto 2em;
/* 上 右 下 左 */
margin: 2px 1em 0 auto;
```

- 4つの値は、**上から時計回り** (上 → 右 → 下 → 左) の順に指定する。
- `margin` には `auto` や負の値 (`-3px` など) を指定できる。`padding` には指定できない。
- `margin: 0 auto;` は、幅 (`width`) を持つブロック要素を、左右中央に寄せる定番の書き方。

### マージンの相殺

縦方向に隣り合うブロック要素の `margin` は、足し算にならず、**大きい方だけ**になる (相殺)。

```css
/* 上の要素の margin-bottom: 30px と、下の要素の margin-top: 20px の間隔は、50px ではなく 30px */
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }
```

- 相殺されるのは、縦方向 (上下) だけで、横方向は相殺されない。
- Flex や Grid の子要素の間では、相殺されない。

### 幅と高さ

```css
.box {
    width: 300px;
    max-width: 100%;   /* 親より大きくならない */
    min-height: 100px; /* 最低限の高さ */
}
```

- `max-width` と `min-width` は、レスポンシブ対応でよく使う。
- `height` を固定すると、内容があふれやすい。可能なら `min-height` を使う。

### 論理プロパティ

`left` や `top` のような物理的な方向ではなく、文章の流れる方向 (横書きなら、行の方向が横、段落の方向が縦) を基準にして書くプロパティ。縦書きや、右から左に書く言語でも、そのままレイアウトが追従する。

| 物理的な書き方 | 論理的な書き方 | 意味 |
| --- | --- | --- |
| `width` | `inline-size` | 文字の流れる方向の大きさ |
| `height` | `block-size` | 段落の積まれる方向の大きさ |
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` | 行頭側 / 行末側の余白 |
| `margin-top` / `margin-bottom` | `margin-block-start` / `margin-block-end` | 段落の前 / 後の余白 |
| `margin: 0 auto` | `margin-inline: auto` | 行方向の左右中央寄せ |
| `padding-left` + `padding-right` | `padding-inline` | 行方向の余白をまとめて指定する |
| `top: 0; right: 0; bottom: 0; left: 0` | `inset: 0` | 4辺の位置 (物理的だが、省略形として便利) |

```css
.card {
    padding-block: 1rem;   /* 上下 (横書きの場合) */
    padding-inline: 1.5rem; /* 左右 (横書きの場合) */
}
```

<pre><code class="tips">横書きだけのサイトなら、物理的な書き方でも困らない。
多言語対応や縦書きを予定している場合は、論理プロパティを選んでおくと、後から直す箇所が少なくなる。</code></pre>

---

## セレクター <a id="selector" data-name="セレクター"></a>

スタイルを適用する要素を選ぶ書き方。

### 基本のセレクター

| 種類 | 書き方 | 対象 |
| --- | --- | --- |
| タイプセレクター | `要素名 {}` | 指定した要素名 (タグ) の要素 |
| クラスセレクター (ドット) | `.クラス名 {}` | 指定したクラスを持つ要素 |
| ID セレクター (シャープ) | `#id名 {}` | 指定した id を持つ要素 |
| ユニバーサルセレクター (アスタリスク) | `* {}` | 全ての要素 |
| 複数指定 (カンマ) | `要素A, 要素B {}` | 同じスタイルを、複数の要素に適用する |

<pre><code class="caution">id はページ内で1つしか使えず、詳細度が高いため、上書きしにくい。
スタイルの指定には、クラスセレクターを使う方がよい (id は、ページ内リンクや JavaScript からの参照に使う)。</code></pre>

### 結合子

要素どうしの関係で、対象を選ぶ。

| 種類 | 書き方 | 対象 |
| --- | --- | --- |
| 子孫セレクター (スペース) | `要素A 要素B {}` | 親要素である要素 A に含まれる全ての要素 B |
| 子セレクター (大なり) | `要素A > 要素B {}` | 要素 A 直下の (子のみで孫には反映されない) 要素 B |
| 隣接セレクター (プラス) | `要素A + 要素B {}` | 同じ親要素内で、要素 A の直後にある、ひとつだけの要素 B |
| 間接セレクター (チルダ) | `要素A ~ 要素B {}` | 同じ親要素内にある要素 A より後ろに記述された要素 B すべて |

<pre><code class="example">/* body 内の要素の、さらに内側にある p 要素に適用。 (body の直下の p には適用されない) */
body * p {
    color: red;
}</code></pre>

### 属性セレクター

要素の属性や、その値で選ぶ。角括弧 `[ ]` で書く。

| 書き方 | 対象 |
| --- | --- |
| `要素名[属性]` | 指定した属性を持つ要素 |
| `要素名[属性="属性値"]` | 指定した属性と値に一致する要素 |
| `要素名[属性^="文字列"]` | 指定した文字列で**始まる**属性値を持つ要素 |
| `要素名[属性$="文字列"]` | 指定した文字列で**終わる**属性値を持つ要素 |
| `要素名[属性*="文字列"]` | 文字列を含む要素 (部分一致) |
| `要素名[属性~="属性値"]` | 空白で区切られた属性値の中に、その値を含む要素。独立した単語として存在する必要がある |
| <code>要素名[属性&#124;="文字列"]</code> | 指定した文字列と一致、または「指定した文字列-」で始まる属性値を持つ要素 |
| `要素名[属性="属性値" i]` | 大文字小文字を区別せずに比較する (閉じ括弧の前に ` i` を付ける) |

<pre><code class="example">[disabled] {
    /* disabled 属性を持つ要素 (無効なボタンなど) に適用 */
}

[type="text"] {
    /* text の入力欄に適用 */
}

a[href^="https"] {
    /* https で始まるリンクに適用 */
}

a[href$=".pdf"] {
    /* .pdf の拡張子を持つリンクに適用 */
}

a[rel~="nofollow"] {
    /* nofollow を含む rel があるリンクに適用 */
}

a[href*="example"] {
    /* "example"を含むリンクに適用 */
}

[lang|="en"] {
    /* "en"または"en-"で始まる要素に適用 */
}

a[href$=".pdf" i] {
    /* .PDF や .Pdf にも適用 */
}</code></pre>

### セレクターの組み合わせ

| 書き方 | 意味 |
| --- | --- |
| `a.button` | **スペースなし**: `a` 要素で、かつ `button` クラスを持つ (同じ要素の条件を重ねる) |
| `.a.b` | `a` クラスと `b` クラスの**両方**を持つ要素 |
| `a .button` | **スペースあり**: `a` 要素の内側にある、`button` クラスの要素 (子孫) |
| `.a, .b` | `a` クラスの要素と、`b` クラスの要素 (どちらにも適用) |
| `ul > li` | `ul` の直接の子の `li` |
| `h2 + p` | `h2` の直後の `p` |
| `h2 ~ p` | `h2` より後ろの、同じ親の `p` すべて |

<pre><code class="tips">スペースの有無で、意味が大きく変わる。
.card.active は「card と active の両方を持つ要素」、.card .active は「card の内側にある active」。</code></pre>

---

## 疑似クラス <a id="pseudo-class" data-name="疑似クラス"></a>

要素の「状態」や「位置」を指定する。セレクターの後ろに `:` (コロン1つ) で付ける。

### リンクと操作の状態

| 疑似クラス | 対象 |
| --- | --- |
| `:hover` | 要素にマウスを乗せた時 |
| `:active` | クリックしている間 |
| `:focus` | 要素にフォーカスがある時 |
| `:focus-visible` | キーボードフォーカス |
| `:focus-within` | 子要素にフォーカス |
| `:visited` | 訪問済みリンク |
| `:link` | 未訪問リンク |

<pre><code class="example">a:hover {
  text-decoration: underline;
}

button:active {
  transform: scale(0.98);
}

input:focus {
  outline: 2px solid blue;
}</code></pre>

<pre><code class="example">.form:focus-within {
    border-color: blue;
}</code></pre>

<pre><code class="caution">リンクの疑似クラスは、:link → :visited → :hover → :active の順に書くと、意図どおりに動く (LVHA の順)。
同じ詳細度のルールは、後に書いたものが勝つため。</code></pre>

<pre><code class="tips">:focus は、マウスでクリックしたときにも適用される。
キーボードで操作したときだけフォーカスの枠を出したい場合は、:focus-visible を使う。</code></pre>

### フォームの状態

| 疑似クラス | 対象 |
| --- | --- |
| `:checked` | チェックされている |
| `:enabled` | 有効 |
| `:disabled` | 無効 |
| `:required` | 必須 |
| `:valid` | バリデーション OK |
| `:invalid` | バリデーション NG |

<pre><code class="example">input:invalid {
    border: 2px solid red;
}

input:valid {
    border: 2px solid green;
}</code></pre>

<pre><code class="tips">:invalid は、ユーザーが何も入力していない最初の状態から適用されてしまう (必須項目が、最初から赤くなる)。
ユーザーが操作した後だけ適用したい場合は、:user-invalid と :user-valid が使える。</code></pre>

### 位置と順序

| 疑似クラス | 対象 |
| --- | --- |
| `:first-child` | 最初の子要素 |
| `:last-child` | 最後の子要素 |
| `:nth-child()` | n 番目の要素 |
| `:nth-of-type()` | 同じタグの n 番目 |
| `:only-child` | 子が1要素 |

<pre><code class="example">li:first-child {
    font-weight: bold;
}

li:nth-child(2) {
    color: red;
}</code></pre>

`:nth-child()` には、数字のほか、`An+B` の式が書ける (n は 0, 1, 2, ... と増える)。

| 指定 | 対象 |
| --- | --- |
| `:nth-child(2)` | 2番目 |
| `:nth-child(odd)` | 奇数番目 (1, 3, 5, ...) |
| `:nth-child(even)` | 偶数番目 (2, 4, 6, ...) |
| `:nth-child(3n)` | 3の倍数番目 (3, 6, 9, ...) |
| `:nth-child(n+3)` | 3番目以降 |
| `:nth-child(-n+3)` | 最初の3つ |

他に `:first-of-type`、`:last-of-type`、`:nth-last-child()` (後ろから数える) などがある。

<pre><code class="example">/* テーブルの縞模様 */
tr:nth-child(even) {
    background: #f5f5f5;
}</code></pre>

### 条件で選ぶ

| 疑似クラス | 対象 |
| --- | --- |
| `:not()` | 条件否定 |
| `:is()` | 複数のセレクターのうち、いずれかに一致する |
| `:where()` | `:is()` と同じ働きだが、詳細度が 0 になる |
| `:has()` | 子孫や後続の要素の条件で、親や前の要素を選ぶ (「親セレクター」とも呼ばれる) |

<pre><code class="example">button:not(.primary) {
    background: gray;
}

/* :is() で、まとめて書く */
:is(h1, h2, h3):hover {
    color: red;
}</code></pre>

<pre><code class="example">/* 画像を含むカードだけに適用 */
.card:has(img) {
    padding: 0;
}

/* チェックされた input を含む label に適用 */
label:has(input:checked) {
    background: lightyellow;
}</code></pre>

### その他の疑似クラス

| 疑似クラス | 対象 |
| --- | --- |
| `:empty` | 中身なし |
| `:root` | 文書のルート要素 (HTML では `html`)。カスタムプロパティの定義によく使う |
| `:target` | URL のハッシュ (`#section` など) が指す要素 |
| `:placeholder-shown` | プレースホルダーが表示されている入力欄 |
| `:read-only` | 読み取り専用の要素 |
| `:default` | 既定で選択されている項目 |
| `:any-link` | リンク (`:link` と `:visited` の両方) |

---

## 疑似要素 <a id="pseudo-element" data-name="疑似要素"></a>

要素の一部分や、CSS で作る仮の要素を指定する。`::` (コロン2つ) で付ける。

| | 書き方 | 対象 |
| --- | --- | --- |
| 疑似クラス | `:hover` (コロン1つ) | 要素の状態や位置 |
| 疑似要素 | `::before` (コロン2つ) | 要素の一部分、または仮の要素 |

### 内容を追加する

| 疑似要素 | 対象 |
| --- | --- |
| `::before` | 要素の前に内容を追加 |
| `::after` | 要素の後に内容を追加 |

<pre><code class="example">.button::before {
    content: "★ ";
}

.button::after {
    content: " →";
}</code></pre>

<pre><code class="caution">::before と ::after は、content プロパティがないと表示されない。
文字を出さずに、装飾だけに使う場合は、content: ""; (空の文字列) を指定する。</code></pre>

### 文字の一部

| 疑似要素 | 対象 |
| --- | --- |
| `::first-letter` | 最初の文字 |
| `::first-line` | 最初の行 |
| `::selection` | 選択された文字 |

<pre><code class="example">p::first-letter {
    font-size: 200%;
}</code></pre>

<pre><code class="example">::selection {
    background: yellow;
}</code></pre>

### 部品の一部

| 疑似要素 | 対象 |
| --- | --- |
| `::placeholder` | input のプレースホルダ |
| `::marker` | リストの記号 |
| `::backdrop` | `<dialog>` をモーダルとして開いたときの、背面の層 |
| `::file-selector-button` | `<input type="file">` の、ファイルを選ぶボタン部分 |

<pre><code class="example">input::placeholder {
    color: gray;
}

li::marker {
    color: red;
}

dialog::backdrop {
    background: rgb(0 0 0 / 50%);
}

input[type="file"]::file-selector-button {
    padding: 0.5em 1em;
}</code></pre>

---

## 詳細度とカスケード <a id="cascade" data-name="詳細度とカスケード"></a>

同じ要素の同じプロパティに、複数のルールが指定されたとき、どれを使うかを決める仕組みを「カスケード」と呼ぶ。

### 優先順位の決まり方

次の順に比べて、上にあるものほど優先される。

1. `!important` が付いた宣言
2. インラインスタイル (`style` 属性)
3. カスケードレイヤー (`@layer`) の順序
4. **詳細度** (セレクターの強さ)
5. **記述順** (同じ強さなら、後に書いたもの)

<pre><code class="tips">上の順序は、よく出会う場面の目安である。
厳密には、!important が付いた宣言どうしでは、レイヤーの順序が逆になり、先に宣言したレイヤーの方が勝つ。</code></pre>

### 詳細度

セレクターの種類ごとに、強さを数える。左の桁の方が、強い。

| 種類 | 例 | 強さ (ID, クラス, タグ) |
| --- | --- | --- |
| ID セレクター | `#header` | (1, 0, 0) |
| クラス、属性、疑似クラス | `.card`、`[type="text"]`、`:hover` | (0, 1, 0) |
| タイプ、疑似要素 | `p`、`::before` | (0, 0, 1) |
| ユニバーサル、結合子 | `*`、`>`、`+` | (0, 0, 0) |

```css
p            { color: black; }  /* (0, 0, 1) */
.text        { color: blue;  }  /* (0, 1, 0) → p に勝つ */
p.text       { color: green; }  /* (0, 1, 1) → .text に勝つ */
#main .text  { color: red;   }  /* (1, 1, 0) → さらに勝つ */
```

- 桁は繰り上がらない。タグセレクターを何個書いても、クラス1つ (0, 1, 0) には勝てない。
- `:is()`、`:not()`、`:has()` は、引数の中で一番強いセレクターの強さになる。`:where()` は常に 0。

### 継承

親要素に指定した値が、子要素にも引き継がれることがある。

| 継承される | 継承されない |
| --- | --- |
| `color`、`font-*`、`line-height`、`text-align`、`visibility`、`cursor`、`list-style` | `margin`、`padding`、`border`、`background`、`width`、`height`、`display`、`position` |

継承の動作は、次のキーワードで制御できる。

| 値 | 動作 |
| --- | --- |
| `inherit` | 親の値を、強制的に引き継ぐ |
| `initial` | そのプロパティの、初期値に戻す |
| `unset` | 継承されるプロパティは `inherit`、されないものは `initial` になる |
| `revert` | ブラウザの標準のスタイルに戻す |

### !important

```css
.text {
    color: red !important; /* 詳細度に関係なく優先される */
}
```

<pre><code class="caution">!important は、上書きするには、別の !important と、さらに高い詳細度が必要になるため、使うほど管理が難しくなる。
やむを得ない場合 (外部のスタイルを上書きするなど) を除いて、使わない。
詳細度を揃えるか、@layer で順序を管理する方が、保守しやすい。</code></pre>

### カスケードレイヤー (@layer)

レイヤーを使うと、詳細度に関係なく、**宣言したレイヤーの順序**で優先順位を決められる。

```css
/* 先にレイヤーの順序を宣言する (後ろのレイヤーほど優先される) */
@layer reset, base, components, utilities;

@layer reset {
    * { margin: 0; }
}

@layer components {
    .card { padding: 1rem; }
}

@layer utilities {
    .p-0 { padding: 0; }  /* components の .card より、詳細度が低くても勝つ */
}
```

<pre><code class="caution">レイヤーに入れていないスタイルは、すべてのレイヤーより優先される。
プロジェクトの一部だけをレイヤーに入れて、残りを入れないと、意図しない優先順位になることがある。</code></pre>

---

## CSS が効かない <a id="css-invalid" data-name="CSSが効かない"></a>

スタイルが反映されないときは、まず DevTools で、指定した宣言が表示されているかを確認する。

| DevTools の表示 | 考えられる原因 |
| --- | --- |
| 指定した宣言が、Styles パネルにない | CSS のパスが違う、セレクターが対象の要素に合っていない |
| 宣言に <s>打ち消し線</s> がある | 他の CSS に優先順位で負けている |
| 宣言の横に、エクスクラメーションマーク (!) がある | 無効なプロパティ、値の間違い、ブラウザ非対応 |

### 原因のチェックリスト

| 確認すること | 内容 |
| --- | --- |
| 読み込めているか | DevTools の Network タブで、CSS ファイルが 200 で読み込まれているか。パスが合っているか |
| キャッシュ | 古い CSS が残っていないか。強制リロード (Ctrl + Shift + R / Cmd + Shift + R) で確認する |
| 書き間違い | プロパティ名のスペル、`;` の抜け、`}` の閉じ忘れ (1箇所のミスで、後ろのルールも効かなくなることがある) |
| 詳細度 | 他のルールに負けていないか (<a href="#cascade">詳細度とカスケード</a>を参照) |
| 記述順 | 同じ詳細度なら、後に書いたものが勝つ |
| 継承 | 継承されないプロパティ (`margin`、`border` など) を、親に指定していないか |
| @media の条件 | 画面幅などの条件に、合っているか |
| プロパティが効く条件 | 下の表を参照 |

### プロパティが効かない条件

プロパティには、効く条件があるものが多い。

| プロパティ | 効かない例 |
| --- | --- |
| `width` / `height` | `display: inline` の要素には効かない |
| 上下の `margin` | `display: inline` の要素には効かない |
| `margin: 0 auto` | `width` がない (または `display: inline`) ブロックでは、中央寄せにならない |
| `top` / `left` など | `position: static` (既定) では効かない |
| `z-index` | `position` が `static` の要素では効かない (Flex / Grid の子要素では効く) |
| `vertical-align` | ブロック要素には効かない (インライン要素とテーブルセルが対象) |
| `justify-content` / `align-items` | 親が `display: flex` (または `grid`) でないと効かない |
| `flex` / `grid-column` | 親が Flex / Grid でないと効かない |

### DevTools の使い方

- **Styles パネル**: 適用されているルールが、優先順位の高い順に表示される。打ち消し線は、他のルールに負けたか、無効な値。
- **Computed パネル**: 最終的に適用された値を確認できる。値をクリックすると、どのルールから来たか分かる。
- **状態の強制**: `:hov` のボタンから、`:hover` や `:focus` の状態を強制して、スタイルを確認できる。
- **ボックスモデル**: Computed パネルの図で、`margin`、`border`、`padding`、`content` のサイズを確認できる。

---

## 表示とオーバーフロー <a id="display" data-name="表示とオーバーフロー"></a>

### display

| 値 | 説明 |
| --- | --- |
| `block` | 前後で改行され、親の幅いっぱいに広がる。`width` と `height` が効く (`div`、`p`、`h1` など) |
| `inline` | 文字のように、横に並ぶ。`width`、`height`、上下の `margin` は効かない (`span`、`a` など) |
| `inline-block` | 横に並び、かつ `width` と `height` が効く |
| `none` | 非表示にする (レイアウトの場所も、なくなる) |
| `flex` / `grid` | Flex / Grid レイアウト (<a href="#flex">Flexbox</a>、<a href="#grid">Grid</a> の章を参照) |

### 要素を隠す方法

| 方法 | レイアウトの場所 | クリックなど |
| --- | --- | --- |
| `display: none` | なくなる | できない |
| `visibility: hidden` | 残る (空白になる) | できない |
| `opacity: 0` | 残る | **できる** (透明なだけ) |

### overflow

内容が要素の枠からはみ出したときの表示を指定する。

| 値 | 動作 |
| --- | --- |
| `visible` | はみ出して表示する (既定) |
| `hidden` | はみ出た部分を隠す |
| `scroll` | 常にスクロールバーを表示する |
| `auto` | はみ出したときだけ、スクロールバーを表示する |

`overflow-x` と `overflow-y` で、横と縦を別々に指定できる。

### 操作とスクロールに関するプロパティ

| プロパティ | 説明 |
| --- | --- |
| `cursor` | マウスカーソルの形 (`pointer` で、クリックできることを示す) |
| `pointer-events: none` | マウスやタッチの操作を、受け付けない (下の要素にも伝わる) |
| `user-select: none` | 文字の選択を禁止する (ボタンの文字など、選択される必要がないものに使う) |
| `scroll-behavior: smooth` | ページ内リンクなどの、スクロールを滑らかにする |
| `scroll-snap-type` / `scroll-snap-align` | スクロールの停止位置を、決めた位置に吸着させる |
| `overscroll-behavior` | スクロールの端に達したときの、親へのスクロールの連鎖を制御する (`contain` で、連鎖を止める) |
| `scrollbar-gutter: stable` | スクロールバーの分の幅を、常に確保する (バーの出入りによる、レイアウトのずれを防ぐ) |

```css
/* 横スクロールで、1枚ずつ止まるスライダー */
.slider {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
}

.slider > * {
    flex: 0 0 80%;
    scroll-snap-align: start;
}
```

<pre><code class="tips">cursor: pointer; は、クリックできる要素であることを示す目印になる。
一方、pointer-events: none; で操作を無効にしても、キーボードでは操作できてしまう。入力欄などは、disabled 属性で無効にする。</code></pre>

---

## 位置指定 <a id="position" data-name="位置指定"></a>

要素の配置方法を、`position` で指定する。

| 値 | 動作 |
| --- | --- |
| `static` | 通常の配置 (デフォルト) |
| `relative` | 相対配置。通常の配置位置を基準に移動する |
| `absolute` | 絶対配置。祖先要素のうち `position` が `static` 以外の要素を基準に配置する |
| `fixed` | 固定配置。ビューポート (画面) を基準に固定され、スクロールしても動かない |
| `sticky` | スティッキー配置。スクロール位置に応じて `relative` と `fixed` が切り替わる |

`top`、`right`、`bottom`、`left` で、基準からの距離を指定する。4辺を一括で指定する `inset` もある。

```css
/* 親 (relative) の右上に、バッジを置く */
.parent {
    position: relative;
}
.badge {
    position: absolute;
    top: 0;
    right: 0;
}

/* 親全体を覆う */
.overlay {
    position: absolute;
    inset: 0; /* top, right, bottom, left がすべて 0 */
}

/* スクロールしても、画面の上に残るヘッダー */
.header {
    position: sticky;
    top: 0;
}
```

<pre><code class="caution">absolute は、position が static でない祖先を探して、その要素を基準にする。
基準にしたい親に position: relative; を指定し忘れると、画面全体 (ページ) が基準になり、意図しない位置になる。
sticky は、top などの位置の指定がないと、動作しない。</code></pre>

### z-index

重なり順を指定する。数値が大きいほど手前に表示される (`position` が `static` 以外の要素で有効)。

<pre><code class="tips">z-index を大きくしても手前に出ないときは、スタッキングコンテキストが原因のことがある。
親の要素に position と z-index の組み合わせ、opacity (1 未満)、transform などがあると、その親の中だけで重なり順が決まり、外の要素とは比較されない。</code></pre>

---

## Flexbox (display: flex) <a id="flex" data-name="Flexbox"></a>

1次元方向に子要素を並べる、Flex レイアウトが有効になる。デフォルトで横方向。

```css
.container {
    display: flex;
}
```

親要素 (フレックスコンテナ) に `display: flex;` を指定すると、その直接の子要素 (フレックスアイテム) が並ぶ。

### 2つの軸

Flex の配置は、**メイン軸** (並ぶ方向) と**交差軸** (それと直角の方向) の2つで考える。

| `flex-direction` | メイン軸 | 交差軸 | メイン軸を扱うプロパティ | 交差軸を扱うプロパティ |
| --- | --- | --- | --- | --- |
| `row` (既定) | 横 | 縦 | `justify-content` | `align-items` |
| `column` | 縦 | 横 | `justify-content` | `align-items` |

<pre><code class="tips">justify-content は常にメイン軸、align-items は常に交差軸を扱う。
flex-direction を column にすると、軸の向きが入れ替わるため、justify-content が縦方向になる。</code></pre>

### 親要素に指定するプロパティ

#### flex-direction

要素の方向を決める。

| 値 | 動作 |
| --- | --- |
| `row` | 横方向 (デフォルト) |
| `column` | 縦方向 |
| `row-reverse` / `column-reverse` | 逆向きに並べる |

#### justify-content

メイン方向の配置を決める。

| 値 | 動作 |
| --- | --- |
| `center` | 中央に寄せる |
| `flex-start` | 開始側に寄せる (`row` なら左) |
| `flex-end` | 終了側に寄せる (`row` なら右) |
| `space-between` | 両端揃え |
| `space-around` | 均等 (両端には、間隔の半分の余白) |
| `space-evenly` | 均等 (両端も、間隔と同じ余白) |

#### align-items

交差軸の配置を決める。

| 値 | 動作 |
| --- | --- |
| `center` | 中央 |
| `stretch` | 引き伸ばす (既定) |
| `flex-start` | 開始側 (`row` なら上) |
| `flex-end` | 終了側 (`row` なら下) |
| `baseline` | 文字のベースラインを揃える |

#### flex-wrap

折り返しを決める。

| 値 | 動作 |
| --- | --- |
| `wrap` | 折り返す |
| `nowrap` | 折り返さない (既定) |

#### gap

要素同士の隙間。行と列を別々に指定する場合は、`row-gap` と `column-gap` を使う。Grid でも、同じ書き方で使える。

### 子要素に指定するプロパティ

#### flex

`flex-grow` (伸びる割合)、`flex-shrink` (縮む割合)、`flex-basis` (基準の大きさ) の一括指定 (ショートハンド) プロパティ。子要素に指定する。

| 指定 | 内容 | 動作 |
| --- | --- | --- |
| `flex: 1` | `1 1 0%` | 伸縮し、空きスペースを均等に埋める |
| `flex: initial` | `0 1 auto` | 初期値。縮むことはできるが伸びない |
| `flex: auto` | `1 1 auto` | 伸縮し、コンテンツのサイズを基準にする |
| `flex: none` | `0 0 auto` | 伸縮しない |

```css
/* 成長係数 | 縮小係数 | 基準サイズ */
flex: 1 1 200px;
```

#### その他

| プロパティ | 説明 |
| --- | --- |
| `align-self` | その子要素だけ、交差軸の配置を変える |
| `order` | 並び順を変える (小さい値が先。既定は 0) |
| `margin-left: auto` | その要素以降を、右端に寄せる (ヘッダーのナビゲーションなどで定番) |

```css
/* ロゴを左、メニューを右に寄せる */
.header {
    display: flex;
    align-items: center;
}
.header .menu {
    margin-left: auto;
}
```

---

## Grid (display: grid) <a id="grid" data-name="Grid"></a>

子要素を格子状に配置する。行と列の、2次元で指定できる。

### 列と行の定義

`grid-template-columns` と `grid-template-rows` で、列と行の数とサイズを指定する。実質、必須のプロパティ。

| 単位 | 意味 |
| --- | --- |
| `px` | 固定サイズ |
| `fr` | 残りスペースの割合 |
| `%` | 親基準 |
| `auto` | 内容サイズ |

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr 1fr; /* 固定 + 残りを 1:1 */
    gap: 16px;
}
```

`gap` は、要素同士の隙間 (Flex と同じ書き方)。

### repeat() と minmax()

```css
/* 1fr の列を 3 つ */
grid-template-columns: repeat(3, 1fr);

/* 最小 200px、最大 1fr */
grid-template-columns: minmax(200px, 1fr) 1fr;
```

### 子要素の配置 (grid-column / grid-row)

子要素で指定して、グリッドの何マス分使うかを指定する。

```css
grid-row: 1 / 3;
```

`1 / 3` は、グリッド線の番号で、「1本目の線から、3本目の線まで」(= 2行分) を意味する。

```css
grid-column: span 2;
```

`span 2` は、「2マス分」を意味する。

<pre><code class="tips">grid-column: 1 / -1; と書くと、最後の線まで (= 全列分) を使う。
-1 は、最後のグリッド線を指す。</code></pre>

### grid-template-areas

要素の配置を文字で書くことができる。

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;

    grid-template-areas:
        "left header right"
        "left main   right"
        "left footer right";
}
```

子要素側では `grid-area` を書く。

```css
.left   { grid-area: left; }
.header { grid-area: header; }
.main   { grid-area: main; }
.right  { grid-area: right; }
.footer { grid-area: footer; }
```

対応する HTML。

```html
<div class="container">
    <div class="left">left</div>
    <div class="header">header</div>
    <div class="main">main</div>
    <div class="right">right</div>
    <div class="footer">footer</div>
</div>
```

セルを空にする場合は `.` (ドット) を使う。

```css
grid-template-areas:
    "header header header"
    ".      main   ."
    "footer footer footer";
```

### 画面幅に合わせて列数が変わるグリッド

```css
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}
```

幅が 200px 以上になる範囲で、できるだけ多くの列を並べ、余った幅は均等に分ける。メディアクエリなしでレスポンシブになる。

| キーワード | 動作 |
| --- | --- |
| `auto-fit` | 空いた列を潰して、要素を引き伸ばす |
| `auto-fill` | 空いた列も残す (要素は引き伸ばされない) |

### 配置のプロパティ

| プロパティ | 説明 |
| --- | --- |
| `justify-items` | 各セル内の、横方向の配置 |
| `align-items` | 各セル内の、縦方向の配置 |
| `place-items` | `align-items` と `justify-items` の一括指定 (`place-items: center;` で、セルの中央に寄せる) |
| `grid-auto-rows` | 暗黙的に作られた行の高さ |

### Flex と Grid の使い分け

| | Flex | Grid |
| --- | --- | --- |
| 次元 | 1次元 (横 または 縦) | 2次元 (行と列) |
| 向いている場面 | ナビゲーション、ボタンの並び、要素の中央寄せ | ページ全体のレイアウト、カードの一覧 |
| 考え方 | コンテンツに合わせて、並べる | レイアウトを先に決めて、コンテンツを置く |

<pre><code class="tips">Flex と Grid は、排他的ではない。
ページ全体の骨組みを Grid で作り、その中のナビゲーションやボタンの並びを Flex で作る、という組み合わせが多い。</code></pre>

---

## 文字とフォント <a id="text" data-name="文字とフォント"></a>

### 基本のプロパティ

| プロパティ | 説明 | 例 |
| --- | --- | --- |
| `font-family` | フォントの種類 (複数指定して、最後に総称ファミリーを置く) | `"Noto Sans JP", system-ui, sans-serif` |
| `font-size` | 文字の大きさ | `1rem` |
| `font-weight` | 太さ | `400` (標準)、`700` (太字)、`bold` |
| `line-height` | 行の高さ | `1.6` (単位なしで、文字サイズの倍率) |
| `color` | 文字の色 | `#333` |
| `text-align` | 文字の揃え | `left`、`center`、`right` |
| `text-decoration` | 下線などの装飾 | `none`、`underline` |
| `letter-spacing` | 文字の間隔 | `0.05em` |
| `text-indent` | 1行目の字下げ | `1em` |

```css
body {
    font-family: "Noto Sans JP", system-ui, sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    color: #333;
}
```

<pre><code class="tips">line-height は、単位なしの数値 (1.6 など) にすると、子要素でも、その要素のフォントサイズに対する倍率になり、サイズが変わっても崩れにくい。
font-family の最後には、sans-serif や serif、monospace などの総称ファミリーを置いて、指定のフォントがないときに備える。</code></pre>

### Web フォント

```css
@font-face {
    font-family: "MyFont";
    src: url("fonts/myfont.woff2") format("woff2");
    font-display: swap; /* フォントの読み込み中は、代替のフォントで表示する */
}

body {
    font-family: "MyFont", sans-serif;
}
```

<pre><code class="tips">日本語のフォントは、ファイルが大きい。
使う文字だけに絞る (サブセット化する) か、分割して配信するサービスを使うと、読み込みが速くなる。</code></pre>

### 長い文字列の処理

```css
/* 1行で、はみ出たら「…」で省略する */
.ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* 3行で省略する */
.clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}

/* 長い URL などを折り返す */
.wrap {
    overflow-wrap: anywhere;
}
```

| プロパティ | 説明 |
| --- | --- |
| `white-space: nowrap` | 折り返さない |
| `overflow-wrap: anywhere` | はみ出す場合は、単語の途中でも折り返す |
| `word-break: break-all` | 常に文字単位で折り返す |
| `text-wrap: balance` | 見出しなどで、各行の長さをそろえて折り返す |

### 日本語の組版

日本語を扱うときに、よく使うプロパティ。

| プロパティ | 説明 |
| --- | --- |
| `writing-mode: vertical-rl` | 縦書きにする (行は、右から左へ進む)。既定は `horizontal-tb` (横書き) |
| `text-orientation: upright` | 縦書きのとき、欧文や数字を、立てた向きで並べる (既定の `mixed` は、横に倒す) |
| `text-combine-upright: all` | 縦書きの中の、数字などを横に並べて、1文字分に収める (縦中横) |
| `line-break: strict` | 禁則処理を厳しくする (小さい仮名や長音を、行頭に置かない) |
| `font-feature-settings: "palt"` | 文字の幅を詰めて、字間を整える (フォントが対応している必要がある。見出しに向く) |

```css
/* 縦書きの文章 */
.vertical {
    writing-mode: vertical-rl;
}

/* 見出しの字間を詰める */
h1 {
    font-feature-settings: "palt";
}
```

<pre><code class="tips">HTML の lang 属性 (例: html lang="ja") を正しく指定すると、中国語や韓国語と共通の漢字が、日本語の字形で表示されやすくなる。
和文と欧文の間隔を自動で空ける text-autospace や、約物の間隔を詰める text-spacing-trim は、ブラウザの対応が揃っていない。使う前に MDN で確認する。</code></pre>

---

## 色・背景・枠線・影 <a id="color" data-name="色・背景・枠線・影"></a>

### 色の指定方法

| 書き方 | 例 |
| --- | --- |
| 名前 | `red`、`transparent` |
| 16進数 | `#ff0000`、`#f00` (短縮)、`#ff000080` (透明度つき) |
| `rgb()` | `rgb(255 0 0)`、`rgb(255 0 0 / 50%)` (透明度つき) |
| `hsl()` | `hsl(210 50% 40%)` (色相、彩度、明度) |
| `oklch()` | `oklch(60% 0.15 250)` (人の見え方に近い色空間) |
| `currentColor` | その要素の `color` と同じ色 |

```css
.icon {
    border: 1px solid currentColor; /* 文字色と同じ色の枠線 */
}
```

`color-mix()` で、2つの色を混ぜられる。

```css
.button:hover {
    background: color-mix(in oklch, var(--main-color), white 15%);
}
```

<pre><code class="tips">文字色と背景色の差 (コントラスト比) が小さいと、読みにくくなる。
WCAG の基準 (AA) では、通常の大きさの文字で、4.5:1 以上が目安になる。DevTools の色の選択画面で、比率を確認できる。</code></pre>

### 背景

```css
.hero {
    background-color: #f5f5f5;
    background-image: url("hero.jpg");
    background-size: cover;       /* 要素を覆うように拡大 */
    background-position: center;
    background-repeat: no-repeat;
}

/* 一括指定 (位置 / サイズ の順に書く) */
.hero {
    background: url("hero.jpg") center / cover no-repeat;
}

/* グラデーション */
.gradient {
    background: linear-gradient(to right, #3498db, #8e44ad);
}
```

| `background-size` | 動作 |
| --- | --- |
| `cover` | 要素全体を覆う (はみ出た部分は切れる) |
| `contain` | 画像全体が収まる (余白ができる) |

### 枠線・角丸・アウトライン

```css
.card {
    border: 1px solid #ccc;   /* 太さ 種類 色 */
    border-radius: 8px;       /* 角丸 */
}

.avatar {
    border-radius: 50%;       /* 正方形なら、円になる */
}
```

| プロパティ | 説明 |
| --- | --- |
| `border` | 枠線 (幅、種類、色) |
| `border-radius` | 角丸 |
| `outline` | 外側の線。`border` と違い、レイアウトに影響しない (フォーカスの枠でよく使う) |
| `outline-offset` | `outline` と要素の間隔 |

<pre><code class="caution">キーボードで操作する人にとって、フォーカスの枠は目印になる。
outline: none; で消す場合は、:focus-visible に、代わりの目立つスタイルを必ず指定する。</code></pre>

### 影

```css
.card {
    /* 横 縦 ぼかし 色 */
    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
}

.text {
    text-shadow: 1px 1px 2px rgb(0 0 0 / 30%);
}
```

### フィルター

| プロパティ | 対象 |
| --- | --- |
| `filter` | 要素そのもの (`blur()`、`grayscale()`、`brightness()` など) |
| `backdrop-filter` | 要素の**背後**に見えているもの (すりガラスのような表現) |

```css
.photo:hover {
    filter: grayscale(100%);
}

/* すりガラス風 (背景が半透明のときに効果が見える) */
.glass {
    background: rgb(255 255 255 / 30%);
    backdrop-filter: blur(8px);
}
```

### フォーム部品の色

```css
input[type="checkbox"],
input[type="radio"] {
    accent-color: #3498db; /* チェックボックスなどの色 */
}

input,
textarea {
    caret-color: #e74c3c; /* 入力位置のカーソルの色 */
}
```

---

## 画像とメディア <a id="image" data-name="画像とメディア"></a>

```css
img {
    max-width: 100%;  /* 親の幅を超えない */
    height: auto;     /* 縦横比を保つ */
    display: block;   /* 下に出る、わずかな隙間を消す */
}
```

### object-fit

`width` と `height` を指定した画像や動画を、どう収めるかを指定する。

| 値 | 動作 |
| --- | --- |
| `fill` | 枠に合わせて引き伸ばす (既定。縦横比が崩れる) |
| `cover` | 縦横比を保ち、枠全体を覆う (はみ出た部分は切れる) |
| `contain` | 縦横比を保ち、枠に収める (余白ができる) |

### aspect-ratio

縦横比を指定する。

```css
.thumbnail {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
}

.avatar {
    width: 48px;
    aspect-ratio: 1; /* 正方形 */
}
```

---

## リストとテーブル <a id="list-table" data-name="リストとテーブル"></a>

### リスト

| プロパティ | 説明 |
| --- | --- |
| `list-style-type` | 記号の種類 (`disc`、`decimal`、`none` など) |
| `list-style-position` | 記号の位置 (`outside` は箇条書きの外側、`inside` は内側) |
| `list-style` | 上記の一括指定 |

```css
/* ナビゲーションなど、記号のないリスト */
.nav {
    list-style: none;
    margin: 0;
    padding: 0;
}
```

記号の色や大きさは、疑似要素の `::marker` で変えられる (<a href="#pseudo-element">疑似要素</a>の章を参照)。

### テーブル

#### border-collapse

table の枠線の重なりを指定する。

| 値 | 動作 |
| --- | --- |
| `collapse` | 隣接するセルで境界線を共有する |
| `separate` | 隣接するセルが個別に境界線を持つ (デフォルト)。`border-spacing` でセルの間隔を指定できる |

```css
table {
    border-collapse: collapse;
}

th, td {
    border: 1px solid #ccc;
    padding: 0.5em 1em;
}
```

#### その他のプロパティ

| プロパティ | 説明 |
| --- | --- |
| `table-layout: fixed` | 列の幅を、1行目と `width` の指定だけで決める (内容による再計算がなく、安定する) |
| `border-spacing` | `separate` のときの、セルの間隔 |
| `text-align` / `vertical-align` | セル内の、横と縦の揃え (`vertical-align` はセルに効く) |

<pre><code class="tips">幅の広いテーブルが、スマートフォンで画面からはみ出す場合は、テーブルを overflow-x: auto; を付けた要素で包むと、テーブルだけが横にスクロールする。</code></pre>

---

## 単位と関数 <a id="units" data-name="単位と関数"></a>

CSS で使用される主な単位と関数について。

| 単位 | 説明 |
| --- | --- |
| `px` | ピクセル。絶対単位で画面の解像度に依存する |
| `rem` | ルート (根要素の `<html>`) のフォントサイズに対する相対単位。レイアウト設計の基本としてよく使われる |
| `em` | 親要素のフォントサイズに対する相対単位 (`font-size` 以外のプロパティでは、その要素自身のフォントサイズが基準になる) |
| `%` | 親要素のサイズに対する割合 |
| `vw` / `vh` | ビューポート (画面領域) の幅 (`vw`) と高さ (`vh`) に対する割合 (1 `vw` は画面幅の 1%) |
| `dvh` / `svh` / `lvh` | スマートフォンのブラウザで、アドレスバーの表示・非表示によって高さが変わる場合の `vh`。`dvh` は現在の高さ、`svh` は最小 (バーが出ている)、`lvh` は最大の高さ |
| `ch` | 数字の「0」の幅。文章の幅を指定するときに使う (`max-width: 60ch;` など) |
| `fr` | Grid で、残りのスペースの割合 |

<pre><code class="tips">フォントサイズを rem で指定すると、ユーザーがブラウザの文字サイズ設定を変えたときに、それに追従する。px で指定すると、追従しない。</code></pre>

### calc() 関数

計算式を使ってプロパティ値を指定できる。

```css
width: calc(100% - 80px);
```

演算子の前後には、空白が必要 (`100%-80px` はエラー)。

### min() / max() / clamp() 関数

```css
/* 小さい方の値を使う (最大でも 600px) */
width: min(100%, 600px);

/* 大きい方の値を使う (最低でも 16px) */
font-size: max(1rem, 16px);

/* 最小値 理想値 最大値 */
font-size: clamp(1rem, 2.5vw, 2rem);
```

`clamp()` は、画面幅に応じて滑らかに変わる、フォントサイズや余白の指定に使える。

---

## カスタムプロパティ (変数) <a id="variables" data-name="カスタムプロパティ"></a>

値を再利用するための変数定義。 `--` で始めて定義し、 `var()` 関数で呼び出す。

```css
:root {
    --main-color: #3498db;
    --main-padding: 16px;
}

.button {
    background-color: var(--main-color);
    padding: var(--main-padding);
}
```

### フォールバック値

`var()` の第2引数に、変数が未定義のときの値を指定できる。

```css
.button {
    color: var(--text-color, #333);
}
```

### スコープ

変数は、定義した要素と、その子孫で使える。子で再定義すると、その範囲だけ上書きされる。

```css
:root {
    --main-color: #3498db;
}

.danger {
    --main-color: #e74c3c; /* .danger の中だけ、赤になる */
}
```

### ダークモードの切り替え

変数の値を切り替えるだけで、色のテーマを変えられる。

```css
:root {
    --bg: #ffffff;
    --text: #222222;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg: #1e1e1e;
        --text: #eeeeee;
    }
}

body {
    background: var(--bg);
    color: var(--text);
}
```

### @property (型つきの変数)

通常のカスタムプロパティは、値を単なる文字列として扱うため、`transition` で滑らかに変化させられない。`@property` で型と初期値を登録すると、値が補間されて、アニメーションできる。

```css
@property --main-color {
    syntax: "<color>";       /* 値の型 */
    inherits: true;          /* 子孫に継承するか */
    initial-value: #3498db;  /* 初期値 */
}

.button {
    background: var(--main-color);
    transition: --main-color 0.3s;
}

.button:hover {
    --main-color: #2980b9; /* 色が滑らかに変わる */
}
```

<pre><code class="caution">@property は、2024年7月から、主要なブラウザで使える状態 (Newly available) になっている。
古いブラウザでは、登録が無視されて、通常の変数として動く (アニメーションはしない)。</code></pre>

---

## トランジションとアニメーション <a id="animation" data-name="トランジションとアニメーション"></a>

### transition

プロパティの値が変わるときに、滑らかに変化させる。

```css
.button {
    background-color: #3498db;
    transition: background-color 0.2s ease; /* プロパティ 時間 変化のカーブ */
}

.button:hover {
    background-color: #2980b9;
}
```

| 指定 | 説明 |
| --- | --- |
| `transition-property` | 変化させるプロパティ |
| `transition-duration` | かかる時間 (`0.2s`、`200ms`) |
| `transition-timing-function` | 変化のカーブ (`ease`、`linear`、`ease-in-out` など) |
| `transition-delay` | 開始までの待ち時間 |

### transform

要素を、変形・移動する。レイアウトには影響せず、周りの要素は動かない。

```css
.box {
    transform: translate(20px, 10px); /* 移動 */
    transform: scale(1.2);            /* 拡大 */
    transform: rotate(45deg);         /* 回転 */
    transform: translateX(10px) rotate(10deg); /* 組み合わせ */
}
```

<pre><code class="tips">アニメーションさせるなら、レイアウトの再計算が必要な left、width、margin などよりも、transform と opacity の方が滑らかに動きやすい。</code></pre>

### @keyframes と animation

```css
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal {
    animation: fade-in 0.3s ease; /* 名前 時間 カーブ */
}

/* 繰り返す */
.spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
```

### 表示されるときのアニメーション (@starting-style)

`transition` は、値が「変わる」ときに動く。要素が最初に表示されるとき (DOM に追加された直後や、`display: none` から表示に変わるとき) には、変化前の値がないため、動かない。`@starting-style` で、表示された瞬間の開始状態を指定すると、`@keyframes` なしで、フェードインなどができる。

```css
.popup {
    opacity: 1;
    transition: opacity 0.3s;
}

/* 表示された瞬間は、透明から始める */
@starting-style {
    .popup {
        opacity: 0;
    }
}
```

`display` の切り替えもアニメーションの対象に含めたいときは、`transition-behavior: allow-discrete` (または `transition` の値に `allow-discrete` を書く) が必要になる。

<pre><code class="caution">@starting-style は、2024年8月から、主要なブラウザで使える状態 (Newly available) になっている。
使う前に、MDN で対応状況を確認する。</code></pre>

### 動きを減らす設定への対応

OS の設定で「視差効果を減らす」にしているユーザーには、動きを止める。

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}
```

---

## メディアクエリ (レスポンシブデザイン) <a id="media-queries" data-name="メディアクエリ"></a>

画面サイズやデバイスの特性に応じて異なるスタイルを適用する。

```css
/* 画面幅が 768px 以上の場合に適用 */
@media (min-width: 768px) {
    .container {
        display: flex;
    }
}
```

### viewport の設定

スマートフォンで、画面幅に合わせて表示するには、HTML の `<head>` に必要。

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

これがないと、スマートフォンのブラウザが、PC 用の広い画面幅で表示して、メディアクエリが期待どおりに動かない。

### モバイルファースト

小さい画面向けのスタイルを基本に書いて、画面が大きくなるときの変更を、`min-width` で足していく書き方。

```css
/* 基本: スマートフォン (縦に並べる) */
.container {
    display: flex;
    flex-direction: column;
}

/* 768px 以上: 横に並べる */
@media (min-width: 768px) {
    .container {
        flex-direction: row;
    }
}
```

### 範囲構文

比較演算子で、条件を書ける。

```css
@media (width >= 768px) { }                 /* min-width: 768px と同じ */
@media (width < 600px) { }                  /* max-width: 599.98px に近い */
@media (600px <= width <= 1024px) { }       /* 範囲を指定 */
```

### 画面サイズ以外の条件

| 条件 | 説明 |
| --- | --- |
| `(prefers-color-scheme: dark)` | OS がダークモードのとき |
| `(prefers-reduced-motion: reduce)` | OS で「動きを減らす」設定のとき |
| `(orientation: landscape)` | 横向きのとき |
| `(hover: hover)` | マウスなど、ホバーできる入力のとき (タッチ端末では、当てはまらない) |
| `print` | 印刷のとき |

```css
/* タッチ端末では、ホバーのスタイルを使わない */
@media (hover: hover) {
    .button:hover {
        background: #2980b9;
    }
}
```

### メディアクエリとコンテナクエリの使い分け

| | メディアクエリ | コンテナクエリ |
| --- | --- | --- |
| 基準 | 画面全体 (ビューポート) の幅や、デバイスの特性 | 親のコンテナの幅 |
| 向いている場面 | ページ全体のレイアウトの切り替え、ダークモードなど、OS の設定への対応 | 部品 (カードなど) を、置く場所の幅に合わせて変える |

コンテナクエリの書き方は、<a href="#modern">モダンな CSS</a>の章を参照。

---

## モダンな CSS <a id="modern" data-name="モダンなCSS"></a>

Sass などのツールや JavaScript で行っていたことが、CSS だけで書けるようになった機能。

<pre><code class="caution">対応状況は変わるため、使う前に MDN や Can I use で確認する。
下の表は、2026年11月中旬ごろの Baseline の情報に基づく (Widely available は、主要ブラウザで30か月以上使える状態)。</code></pre>

| 機能 | Baseline の状況 |
| --- | --- |
| ネスト (`&`) | Widely available (2026年6月〜) |
| `:has()` | Widely available (2026年6月〜) |
| サブグリッド (`subgrid`) | Widely available (2026年3月〜) |
| コンテナクエリ (`@container`、サイズ) | Widely available (2025年8月〜) |
| `oklch()` / `color-mix()` | Widely available (2025年11月〜) |
| `@layer` | Widely available (2024年9月〜) |
| 論理プロパティ | Widely available (2024年3月〜) |
| `light-dark()` | Newly available (2024年5月〜) |
| `text-wrap: balance` | Newly available (2024年5月〜) |
| `@property` | Newly available (2024年7月〜) |
| `@starting-style` | Newly available (2024年8月〜) |
| ビュー遷移 (同一ページ内) | Newly available (2025年10月〜) |
| `@scope` | Newly available (2026年3月〜) |
| スクロールに連動するアニメーション | Newly available (2026年10月〜) |
| アンカー位置指定 (`anchor()`) | Baseline には未達 (主要ブラウザの対応が、揃っていない) |

`light-dark()` と `text-wrap: balance` は、2026年11月中旬に、30か月が経つ。Baseline のデータには、まだ Widely available と反映されていない場合がある。

### ネスト

セレクターを、入れ子にして書ける。`&` は、親のセレクターを表す。

```css
.card {
    padding: 1rem;
    border: 1px solid #ccc;

    /* .card h2 */
    & h2 {
        font-size: 1.25rem;
    }

    /* .card:hover */
    &:hover {
        box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
    }

    /* .card.active (同じ要素が両方のクラスを持つ) */
    &.active {
        border-color: blue;
    }

    /* .dark .card (親の前に条件を付ける) */
    .dark & {
        background: #222;
    }

    /* メディアクエリも入れ子にできる */
    @media (min-width: 768px) {
        padding: 2rem;
    }
}
```

<pre><code class="caution">ネストの中で、タグ名のセレクターを、&amp; なしで書く (h2 { } のような書き方) のは、新しいブラウザでは動くが、古いバージョンでは無視される。
Chrome 120、Safari 17.2、Firefox 117 より前のブラウザは、&amp; を前に付ける必要がある。古いブラウザへの対応が必要なら、&amp; h2 と書くと安全。

また、Sass のように、&amp;-primary で、クラス名を後ろにつなげる書き方はできない。</code></pre>

### :has() の活用

```css
/* 入力にエラーがあるフォームの、送信ボタンを無効に見せる */
form:has(:invalid) button[type="submit"] {
    opacity: 0.5;
}

/* 画像を含む記事を、2列にする */
.article:has(img) {
    display: grid;
    grid-template-columns: 1fr 2fr;
}
```

### コンテナクエリ

画面全体 (ビューポート) ではなく、**親のコンテナの幅**で、スタイルを切り替える。部品 (コンポーネント) を、置く場所に応じて変えるときに便利。

```css
/* 親を、コンテナとして登録する */
.card-wrapper {
    container-type: inline-size;
}

/* コンテナの幅が 400px 以上のとき */
@container (min-width: 400px) {
    .card {
        display: grid;
        grid-template-columns: 1fr 2fr;
    }
}
```

<pre><code class="tips">@container は、祖先にある container-type を指定した要素を基準にする。
そのため、カードのような部品の「外側」に、コンテナ用のラッパー要素が必要になる。</code></pre>

### サブグリッド

子のグリッドが、親のグリッドの行や列の線を、そのまま引き継ぐ。カードごとに、見出し・本文・フッターの高さを揃えたいときに便利。

```css
.cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

/* 各カードが、親の 3 行分を使い、行の高さを共有する */
.card {
    display: grid;
    grid-row: span 3;
    grid-template-rows: subgrid;
}
```

### light-dark() と color-scheme

ライトモードとダークモードの色を、1つの宣言で書ける。

```css
:root {
    color-scheme: light dark; /* 両方に対応していることを宣言する */
}

body {
    background: light-dark(#ffffff, #1e1e1e);
    color: light-dark(#222222, #eeeeee);
}
```

### @scope

スタイルを適用する範囲を、DOM の範囲で限定する。

```css
/* .card の内側だけに適用する (.card-footer の内側は除く) */
@scope (.card) to (.card-footer) {
    p {
        color: gray;
    }
}
```

---

## よく使うレシピ <a id="recipe" data-name="よく使うレシピ"></a>

### 基本のリセット

```css
*,
*::before,
*::after {
    box-sizing: border-box;
}

body {
    margin: 0;
    line-height: 1.6;
}

img,
video {
    max-width: 100%;
    height: auto;
    display: block;
}
```

### 中央寄せ

```css
/* 横方向: 幅を持つブロックを、左右中央に */
.container {
    max-width: 960px;
    margin: 0 auto;
}

/* 縦横: Flex */
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 縦横: Grid (最短) */
.center {
    display: grid;
    place-items: center;
}

/* 文字: 横方向 */
.text-center {
    text-align: center;
}
```

### フッターを、画面の下に固定する

内容が少ないページでも、フッターが画面の一番下に来る。

```css
body {
    min-height: 100dvh;
    display: grid;
    grid-template-rows: auto 1fr auto; /* ヘッダー / メイン / フッター */
}
```

### 2カラムレイアウト

```css
.layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 24px;
}

/* 狭い画面では 1 列にする */
@media (max-width: 768px) {
    .layout {
        grid-template-columns: 1fr;
    }
}
```

### ボタン

```css
.button {
    display: inline-block;
    padding: 0.5em 1.5em;
    border: none;
    border-radius: 6px;
    background: var(--main-color, #3498db);
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s;
}

.button:hover {
    background: #2980b9;
}

.button:focus-visible {
    outline: 2px solid #2980b9;
    outline-offset: 2px;
}

.button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

### スクロール

```css
html {
    scroll-behavior: smooth; /* ページ内リンクを、滑らかにスクロール */
}

/* ヘッダーが固定のとき、ページ内リンクの位置を調整する */
:target {
    scroll-margin-top: 80px;
}
```

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| 幅を 100% にしたら、はみ出す | `padding` や `border` が、`width` に加わる (`content-box`) | `box-sizing: border-box;` を指定する |
| 縦の `margin` が、足し算にならない | 隣り合うブロックの `margin` は、相殺される | `padding` や `gap` を使う |
| `margin: 0 auto` で中央にならない | `width` がない、または `inline` 要素 | `width` (または `max-width`) を指定して、`display: block` にする |
| 子要素に `margin-top` を付けたら、親ごと下がる | 親と子の `margin` が、相殺されている | 親に `padding` や `overflow: hidden` を指定する (または Flex / Grid にする) |
| `height: 100%` が効かない | 親に、高さが指定されていない | 親にも高さを指定する (または `min-height: 100dvh`) |
| `z-index` が効かない | `position` が `static`、またはスタッキングコンテキストの外にある | `position` を指定する。親の `transform` や `opacity` を確認する |
| `absolute` の位置がずれる | 基準にしたい親に、`position: relative` がない | 親に `position: relative;` を指定する |
| `sticky` が効かない | `top` などの指定がない、または祖先に `overflow` (`hidden`、`auto` など) がある | `top` を指定する。祖先の `overflow` を見直す |
| 画像の下に、隙間ができる | 画像が `inline` で、文字のベースラインに揃っている | `display: block;` にする |
| Flex の子要素が、縮まずにはみ出す | 子要素の最小幅が、内容の幅になっている (`min-width: auto`) | 子要素に `min-width: 0;` を指定する |
| スマートフォンで、`100vh` の要素が画面からはみ出す | `vh` が、アドレスバーを除いた高さを基準にしている | `100dvh` を使う |
| `:hover` がスマートフォンで残る | タッチ操作では、ホバーの状態が残る | `@media (hover: hover)` の中に書く |
| 後から書いたスタイルが効かない | 先のルールの詳細度が高い | 詳細度を揃える。`!important` は避ける |

---

## 関連ツール <a id="tools" data-name="関連ツール"></a>

| ツール | 用途 |
| --- | --- |
| Sass (SCSS) | 変数、ネスト、ミックスインなどを使えるようにする、CSS の拡張言語 (ネストや変数は、現在は CSS だけでも書ける) |
| PostCSS / Autoprefixer | CSS を変換するツール。Autoprefixer は、ベンダープレフィックス (`-webkit-` など) を自動で付ける |
| Tailwind CSS | クラス名を組み合わせて、スタイルを指定する、ユーティリティファーストの CSS フレームワーク |
| Stylelint | CSS の書き間違いや、書き方のルールをチェックする |
| MDN Web Docs | CSS のリファレンス。各プロパティの対応ブラウザも分かる |
| Can I use | ブラウザの対応状況を調べる |
