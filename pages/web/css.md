---
title: CSS
layout: default
---

# CSS <a id="top" data-name="TOP"></a>

---

## 基本 <a id="basic" data-name="基本"></a>

- CSS (Cascading Style Sheets) は、ウェブサイト、ウェブアプリの見た目を整えるための言語で、
HTML が骨組みや内容を作るのに対し、CSS は色、レイアウト、フォントなどのデザインを作る。

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

### ボックスモデル

全ての要素は箱 (ボックス) として扱われる。

```text
┌ margin ───────────────┐ -> 枠線の外側の余白
│ ┌ border ───────────┐ │ -> 枠線そのもの
│ │ ┌ padding ──────┐ │ │ -> 枠線の内側の余白
│ │ │   content     │ │ │ -> テキストや画像そのもの
│ │ └───────────────┘ │ │
│ └───────────────────┘ │
└───────────────────────┘
```

#### マージンの相殺

縦方向に隣り合うブロック要素の `margin` は、足し算にならず、**大きい方だけ**になる (相殺)。

```css
/* 上の要素の margin-bottom: 30px と、下の要素の margin-top: 20px の間隔は、50px ではなく 30px */
.a { margin-bottom: 30px; }
.b { margin-top: 20px; }
```

- 相殺されるのは、縦方向 (上下) だけで、横方向は相殺されない。
- Flex や Grid の子要素の間では、相殺されない。

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

### HTML への適用

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

```css
/* grid に対応しているブラウザだけに適用 */
@supports (display: grid) {
    .layout {
        display: grid;
    }
}
```

---

## CSS が効かない <a id="css-invalid" data-name="CSSが効かない"></a>

- DevTools で確認して、指定した項目はあるか
    - CSS のパスは合っている？
    - セレクタは合っている？
- DevTools で <s>打ち消し線</s>
    - 他の CSS に優先順位で負けている
- エクスクラメーションマークがある
    - 無効なプロパティ
    - 値が間違っている
    - ブラウザ非対応

### 原因のチェックリスト

| 確認すること | 内容 |
| --- | --- |
| 読み込めているか | DevTools の Network タブで、CSS ファイルが 200 で読み込まれているか。パスが合っているか |
| キャッシュ | 古い CSS が残っていないか。強制リロード (Ctrl + Shift + R / Cmd + Shift + R) で確認する |
| 書き間違い | プロパティ名のスペル、`;` の抜け、`}` の閉じ忘れ (1箇所のミスで、後ろのルールも効かなくなることがある) |
| 詳細度 | 他のルールに負けていないか (後述の「詳細度とカスケード」) |
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

## セレクター <a id="selector" data-name="セレクター"></a>

#### タイプセレクター

指定した要素名 (タグ) にスタイルを適用する。<br>
**要素名 {}**

#### クラスセレクター (ドット)

指定したクラスを持つ要素にスタイルを適用する。<br>
**.クラス名 {}**

#### IDセレクター (シャープ)

指定した id を持つ要素にスタイルを適用する。<br>
**#id名 {}**

<pre><code class="caution">id はページ内で1つしか使えず、詳細度が高いため、上書きしにくい。
スタイルの指定には、クラスセレクターを使う方がよい (id は、ページ内リンクや JavaScript からの参照に使う)。</code></pre>

#### 子孫セレクター (スペース)

親要素である要素Aに含まれる全ての要素Bにスタイルを適用する。<br>
**要素A 要素B {}**

#### 複数指定 (カンマ)

同じスタイルを複数の要素に適用したい場合は、カンマで区切って指定する。<br>
**要素A, 要素B {}**

#### 子セレクター (大なり)

親要素である要素A直下の (子のみで孫には反映されない) 要素Bにスタイルを適用する。<br>
**要素A > 要素B {}**

#### 隣接セレクター (プラス)

同じ親要素内で、要素Aの直後にある、ひとつだけの要素Bにスタイルを適用する。<br>
**要素A + 要素B {}**

#### 間接セレクター (チルダ)

同じ親要素内にある要素Aより後ろに記述された要素Bすべてにスタイルを適用する。<br>
**要素A ~ 要素B {}**

#### 属性セレクター (角括弧)

- 指定した属性を持つ要素。<br>
  `要素名[属性]`
  <pre><code class="example">[disabled] {
    /* disabled 属性を持つ要素 (無効なボタンなど) に適用 */
}</code></pre>

- 指定した属性と値に一致する要素。<br>
  `要素名[属性="属性値"]`
  <pre><code class="example">[type="text"] {
    /* textの入力欄に適用 */
}</code></pre>

- 指定した文字列で始まる属性値を持つ要素。<br>
  `要素名[属性^="文字列"]`
  <pre><code class="example">a[href^="https"] {
    /* httpsで始まるリンクに適用 */
}</code></pre>

- 指定した文字列で終わる属性値を持つ要素。<br>
  `要素名[属性$="文字列"]`
  <pre><code class="example">a[href$=".pdf"] {
    /* .pdfの拡張子を持つリンクに適用 */
}</code></pre>

- 空白で区切られた属性値の中に、その値を含む要素。独立した単語として存在する必要がある。<br>
  `要素名[属性~="属性値"]`
  <pre><code class="example">a[rel~="nofollow"] {
    /* nofollowを含むrelがあるリンクに適用 */
}</code></pre>

- 文字列を含む要素 (部分一致)。<br>
  `要素名[属性*="文字列"]`
  <pre><code class="example">a[href*="example"] {
    /* "example"を含むリンクに適用 */
}</code></pre>

- 指定した属性と指定した文字列と一致、または「指定した文字列-」で始まる属性値を持つ要素。<br>
  `要素名[属性|="文字列"]`
  <pre><code class="example">[lang|="en"] {
    /* "en"または"en-"で始まる要素に適用 */
}</code></pre>

- 大文字小文字を区別せずに比較する場合は、閉じ括弧の前に ` i` を付ける。<br>
  `要素名[属性="属性値" i]`
  <pre><code class="example">a[href$=".pdf" i] {
    /* .PDF や .Pdf にも適用 */
}</code></pre>

#### ユニバーサルセレクター (アスタリスク)

全ての要素にスタイルを適用する。<br>
**\* {}**
<pre><code class="example">/* body 内の要素の、さらに内側にある p 要素に適用。 (body の直下の p には適用されない) */
body * p {
    color: red;
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

#### :hover

要素にマウスを乗せた時。

#### :active

クリックしている間。

#### :focus

要素にフォーカスがある時。

#### :visited

訪問済みリンク。

#### :link

未訪問リンク。

<pre><code class="example">a:hover {
  text-decoration: underline;
}

button:active {
  transform: scale(0.98);
}

input:focus {
  outline: 2px solid blue;
}</code></pre>

<pre><code class="caution">リンクの疑似クラスは、:link → :visited → :hover → :active の順に書くと、意図どおりに動く (LVHA の順)。
同じ詳細度のルールは、後に書いたものが勝つため。</code></pre>

#### :checked

チェックされている。

#### :enabled

有効。

#### :disabled

無効。

#### :required

必須。

#### :valid

バリデーションOK。

#### :invalid

バリデーションNG。

<pre><code class="example">input:invalid {
    border: 2px solid red;
}

input:valid {
    border: 2px solid green;
}</code></pre>

<pre><code class="tips">:invalid は、ユーザーが何も入力していない最初の状態から適用されてしまう (必須項目が、最初から赤くなる)。
ユーザーが操作した後だけ適用したい場合は、:user-invalid と :user-valid が使える。</code></pre>

#### :first-child

最初の子要素。

#### :last-child

最後の子要素。

#### :nth-child()

n番目の要素。

#### :nth-of-type()

同じタグのn番目。

#### :only-child

子が1要素。

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

#### :not()

条件否定。

#### :is()

複数のセレクターのうち、いずれかに一致する。

#### :where()

`:is()` と同じ働きだが、詳細度が 0 になる。

<pre><code class="example">button:not(.primary) {
    background: gray;
}

/* :is() で、まとめて書く */
:is(h1, h2, h3):hover {
    color: red;
}</code></pre>

#### :has()

子孫や後続の要素の条件で、親や前の要素を選ぶ (「親セレクター」とも呼ばれる)。

<pre><code class="example">/* 画像を含むカードだけに適用 */
.card:has(img) {
    padding: 0;
}

/* チェックされた input を含む label に適用 */
label:has(input:checked) {
    background: lightyellow;
}</code></pre>

#### :focus-visible

キーボードフォーカス。

#### :focus-within

子要素にフォーカス。

#### :empty

中身なし。

<pre><code class="example">.form:focus-within {
    border-color: blue;
}</code></pre>

#### その他の疑似クラス

| 疑似クラス | 対象 |
| --- | --- |
| `:root` | 文書のルート要素 (HTML では `html`)。カスタムプロパティの定義によく使う |
| `:target` | URL のハッシュ (`#section` など) が指す要素 |
| `:placeholder-shown` | プレースホルダーが表示されている入力欄 |
| `:read-only` | 読み取り専用の要素 |
| `:default` | 既定で選択されている項目 |
| `:any-link` | リンク (`:link` と `:visited` の両方) |

<pre><code class="tips">:focus は、マウスでクリックしたときにも適用される。
キーボードで操作したときだけフォーカスの枠を出したい場合は、:focus-visible を使う。</code></pre>

---

## 疑似要素 <a id="pseudo-element" data-name="疑似要素"></a>

要素の一部分や、CSS で作る仮の要素を指定する。`::` (コロン2つ) で付ける。

| | 書き方 | 対象 |
| --- | --- | --- |
| 疑似クラス | `:hover` (コロン1つ) | 要素の状態や位置 |
| 疑似要素 | `::before` (コロン2つ) | 要素の一部分、または仮の要素 |

#### ::before

要素の前に内容を追加。

#### ::after

要素の後に内容を追加。

<pre><code class="example">.button::before {
    content: "★ ";
}

.button::after {
    content: " →";
}</code></pre>

<pre><code class="caution">::before と ::after は、content プロパティがないと表示されない。
文字を出さずに、装飾だけに使う場合は、content: ""; (空の文字列) を指定する。</code></pre>

#### ::first-letter

最初の文字。

#### ::first-line

最初の行。

#### ::selection

選択された文字。

<pre><code class="example">p::first-letter {
    font-size: 200%;
}</code></pre>

<pre><code class="example">::selection {
    background: yellow;
}</code></pre>

#### ::placeholder

inputのプレースホルダ。

<pre><code class="example">input::placeholder {
    color: gray;
}</code></pre>

#### ::marker

リストの記号。

<pre><code class="example">li::marker {
    color: red;
}</code></pre>

#### ::backdrop

`<dialog>` をモーダルとして開いたときの、背面の層。

<pre><code class="example">dialog::backdrop {
    background: rgb(0 0 0 / 50%);
}</code></pre>

#### ::file-selector-button

`<input type="file">` の、ファイルを選ぶボタン部分。

<pre><code class="example">input[type="file"]::file-selector-button {
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

## プロパティ <a id="property" data-name="プロパティ"></a>

### box-sizing

width の計算方法を指定する。デフォルトで content-box。

#### content-box

要素に width を指定すると、ボックスモデルの content に対して width が反映されるため、
width + padding + border がボーダーまでの幅となる。

#### border-box

要素に width を指定すると、width = content + padding + border となる。

<pre><code class="example">*,
*::before,
*::after {
    box-sizing: border-box;
}</code></pre>

---

### border-collapse

table の枠線の重なりを指定する。

#### collapse

隣接するセルで境界線を共有する。

#### separate

隣接するセルが個別に境界線を持つ (デフォルト)。<br>
`separate` のときは、`border-spacing` でセルの間隔を指定できる。

---

### display: flex; <a id="flex" data-name="flex"></a>

1次元方向に子要素を並べる、Flex レイアウトが有効になる。<br>
デフォルトで横方向。

```css
.container {
    display: flex;
}
```

親要素 (フレックスコンテナ) に `display: flex;` を指定すると、その直接の子要素 (フレックスアイテム) が並ぶ。

#### flex-direction

要素の方向を決める。

##### row

横方向 (デフォルト)。

##### column

縦方向。

#### justify-content

メイン方向の配置を決める。

##### center

中央に寄せる。

##### flex-start

開始側に寄せる (`row` なら左)。

##### flex-end

終了側に寄せる (`row` なら右)。

##### space-between

両端揃え。

##### space-around

均等 (両端には、間隔の半分の余白)。

##### space-evenly

均等 (両端も、間隔と同じ余白)。

#### align-items

交差軸の配置。

##### center

中央。

##### stretch

引き伸ばす。

##### flex-start

開始側 (`row` なら上)。

##### flex-end

終了側 (`row` なら下)。

##### baseline

文字のベースラインを揃える。

#### flex

`flex-grow` (伸びる割合) 、 `flex-shrink` (縮む割合) 、 `flex-basis` (基準の大きさ) の一括指定 (ショートハンド) プロパティ。子要素に指定する。

- `flex: 1` (`1 1 0%`) : 伸縮し、空きスペースを均等に埋める。
- `flex: initial` (`0 1 auto`) : 初期値。縮むことはできるが伸びない。
- `flex: auto` (`1 1 auto`) : 伸縮し、コンテンツのサイズを基準にする。
- `flex: none` (`0 0 auto`) : 伸縮しない。

```css
/* 成長係数 | 縮小係数 | 基準サイズ */
flex: 1 1 200px;
```

#### gap

要素同士の隙間。

#### flex-wrap

折り返し。

##### wrap

折り返す。

##### nowrap

折り返さない。

#### 子要素に指定するプロパティ

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

### display: grid; <a id="grid" data-name="grid"></a>

子要素を格子状に配置する。

#### grid-template-columns
#### grid-template-rows

実質必須。列と行の数とサイズを指定する。

| 単位 | 意味 |
| --- | --- |
| px | 固定サイズ |
| fr | 残りスペースの割合 |
| % | 親基準 |
| auto | 内容サイズ |

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr 1fr; /* 固定 + 残りを 1:1 */
    gap: 16px;
}
```

#### repeat() と minmax()

```css
/* 1fr の列を 3 つ */
grid-template-columns: repeat(3, 1fr);

/* 最小 200px、最大 1fr */
grid-template-columns: minmax(200px, 1fr) 1fr;
```

#### grid-column
#### grid-row

子要素で指定して、グリッドの何マス分使うかを指定する。

```css
grid-row: 1 / 3;
```

`1 / 3` は、グリッド線の番号で、「1本目の線から、3本目の線まで」(= 2行分) を意味する。

```css
grid-column: span 2;
```

`span 2` は、「2マス分」を意味する。

#### gap

要素同士の隙間。

#### grid-template-areas

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

子要素側では grid-area を書く。

```css
.left   { grid-area: left; }
.header { grid-area: header; }
.main   { grid-area: main; }
.right  { grid-area: right; }
.footer { grid-area: footer; }
```

HTML

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

#### 画面幅に合わせて列数が変わるグリッド

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

#### 配置のプロパティ

| プロパティ | 説明 |
| --- | --- |
| `justify-items` | 各セル内の、横方向の配置 |
| `align-items` | 各セル内の、縦方向の配置 |
| `place-items` | `align-items` と `justify-items` の一括指定 (`place-items: center;` で、セルの中央に寄せる) |
| `grid-auto-rows` | 暗黙的に作られた行の高さ |

#### Flex と Grid の使い分け

| | Flex | Grid |
| --- | --- | --- |
| 次元 | 1次元 (横 または 縦) | 2次元 (行と列) |
| 向いている場面 | ナビゲーション、ボタンの並び、要素の中央寄せ | ページ全体のレイアウト、カードの一覧 |
| 考え方 | コンテンツに合わせて、並べる | レイアウトを先に決めて、コンテンツを置く |

---

## 表示とオーバーフロー <a id="display" data-name="表示とオーバーフロー"></a>

### display

| 値 | 説明 |
| --- | --- |
| `block` | 前後で改行され、親の幅いっぱいに広がる。`width` と `height` が効く (`div`、`p`、`h1` など) |
| `inline` | 文字のように、横に並ぶ。`width`、`height`、上下の `margin` は効かない (`span`、`a` など) |
| `inline-block` | 横に並び、かつ `width` と `height` が効く |
| `none` | 非表示にする (レイアウトの場所も、なくなる) |
| `flex` / `grid` | Flex / Grid レイアウト |

### 要素を隠す方法

| 方法 | レイアウトの場所 | クリックなど |
| --- | --- | --- |
| `display: none` | なくなる | できない |
| `visibility: hidden` | 残る (空白になる) | できない |
| `opacity: 0` | 残る | **できる** (透明なだけ) |

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

### overflow

内容が要素の枠からはみ出したときの表示を指定する。

| 値 | 動作 |
| --- | --- |
| `visible` | はみ出して表示する (既定) |
| `hidden` | はみ出た部分を隠す |
| `scroll` | 常にスクロールバーを表示する |
| `auto` | はみ出したときだけ、スクロールバーを表示する |

`overflow-x` と `overflow-y` で、横と縦を別々に指定できる。

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

## 単位と関数 <a id="units" data-name="単位と関数"></a>

CSS で使用される主な単位と関数について。

- `px` : ピクセル。絶対単位で画面の解像度に依存する。
- `rem` : ルート (根要素の `<html>`) のフォントサイズに対する相対単位。レイアウト設計の基本としてよく使われる。
- `em` : 親要素のフォントサイズに対する相対単位。(`font-size` 以外のプロパティでは、その要素自身のフォントサイズが基準になる。)
- `%` : 親要素のサイズに対する割合。
- `vw` / `vh` : ビューポート (画面領域) の幅 (`vw`) と高さ (`vh`) に対する割合 (1 `vw` は画面幅の 1%)。
- `dvh` / `svh` / `lvh` : スマートフォンのブラウザで、アドレスバーの表示・非表示によって高さが変わる場合の `vh`。`dvh` は現在の高さ、`svh` は最小 (バーが出ている) 、`lvh` は最大の高さ。
- `ch` : 数字の「0」の幅。文章の幅を指定するときに使う (`max-width: 60ch;` など)。
- `fr` : Grid で、残りのスペースの割合。

<pre><code class="tips">フォントサイズを rem で指定すると、ユーザーがブラウザの文字サイズ設定を変えたときに、それに追従する。px で指定すると、追従しない。</code></pre>

#### `calc()` 関数

計算式を使ってプロパティ値を指定できる。

```css
width: calc(100% - 80px);
```

演算子の前後には、空白が必要 (`100%-80px` はエラー)。

#### `min()` / `max()` / `clamp()` 関数

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

## 位置指定 <a id="position" data-name="位置指定"></a>

要素の配置方法を指定する。

- `static` : 通常の配置 (デフォルト)。
- `relative` : 相対配置。通常の配置位置を基準に移動する。
- `absolute` : 絶対配置。祖先要素のうち `position` が `static` 以外の要素を基準に配置する。
- `fixed` : 固定配置。ビューポート (画面) を基準に固定され、スクロールしても動かない。
- `sticky` : スティッキー配置。スクロール位置に応じて `relative` と `fixed` が切り替わる。

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

#### `z-index`

重なり順を指定する。数値が大きいほど手前に表示される (`position` が `static` 以外の要素で有効)。

<pre><code class="tips">z-index を大きくしても手前に出ないときは、スタッキングコンテキストが原因のことがある。
親の要素に position と z-index の組み合わせ、opacity (1 未満)、transform などがあると、その親の中だけで重なり順が決まり、外の要素とは比較されない。</code></pre>

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

#### フォールバック値

`var()` の第2引数に、変数が未定義のときの値を指定できる。

```css
.button {
    color: var(--text-color, #333);
}
```

#### スコープ

変数は、定義した要素と、その子孫で使える。子で再定義すると、その範囲だけ上書きされる。

```css
:root {
    --main-color: #3498db;
}

.danger {
    --main-color: #e74c3c; /* .danger の中だけ、赤になる */
}
```

#### ダークモードの切り替え

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

---

## モダンな CSS <a id="modern" data-name="モダンなCSS"></a>

Sass などのツールや JavaScript で行っていたことが、CSS だけで書けるようになった機能。

<pre><code class="caution">対応状況は変わるため、使う前に MDN や Can I use で確認する。
下の表は、2026年9月ごろの Baseline の情報に基づく (Widely available は、主要ブラウザで30か月以上使える状態)。</code></pre>

| 機能 | Baseline の状況 |
| --- | --- |
| ネスト (`&`) | Widely available |
| `:has()` | Widely available |
| コンテナクエリ (`@container`、サイズ) | Widely available |
| `@layer` | Widely available |
| `oklch()` / `color-mix()` | Widely available |
| `light-dark()` | Newly available |
| `text-wrap: balance` | Newly available |
| `@scope` | Newly available (2026年3月ごろ) |

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

<pre><code class="caution">ネストの中で、タグ名のセレクターを、& なしで書く (h2 { } のような書き方) のは、新しいブラウザでは動くが、古いバージョンでは無視される。
Chrome 120、Safari 17.2、Firefox 117 より前のブラウザは、& を前に付ける必要がある。古いブラウザへの対応が必要なら、& h2 と書くと安全。

また、Sass のように、&-primary で、クラス名を後ろにつなげる書き方はできない。</code></pre>

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
| 画像の下に、隙間ができる | 画像が `inline` で、文字のベースラインに揃っている | `display: block;` にする |
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
