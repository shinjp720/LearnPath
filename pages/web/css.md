---
title: CSS
layout: default
---

# CSS <a id="top" data-name="TOP"></a>

---

## 基本 <a id="basic" data-name="基本"></a>

- CSS (CascadingStyleSheet) は、ウェブサイト、ウェブアプリの見た目を整えるための言語で、
HTML が骨組みや内容を作るのに対し、CSS は色、レイアウト、フォントなどのデザインを作る。

### 基本構文

```css
selector {
  property1: value1;
  property2: value2;
}
```

<table>
    <tr><td>selector</td><td>セレクターにはどの要素に対してスタイルを適用するのかを指定する</td></tr>
    <tr><td>property</td><td>プロパティはプロパティ値と組み合わせることで要素にさまざまなスタイルを定義する</td></tr>
    <tr><td>value</td><td>バリューには、スタイルの具体的な内容を数値やキーワードで指定する</td></tr>
</table>

```css
h1, h2 {
    color: red;
}
```

### ボックスモデル

全ての要素は箱 (ボックス) として扱われる。

```
┌ margin ───────────────┐ -> 枠線の外側の余白
│ ┌ border ───────────┐ │ -> 枠線そのもの
│ │ ┌ padding ──────┐ │ │ -> 枠線の内側の余白
│ │ │   content     │ │ │ -> テキスト画像そのもの
│ │ └───────────────┘ │ │
│ └───────────────────┘ │
└───────────────────────┘
```

### margin, padding の複数指定

```css
/* 四辺すべてに適用 */
margin: -3px;
/* 上下 左右 */
margin: 5% auto;
/* 上 左右 下 */
margin: 1em auto 2em;
/* 上 右 下 左 */
margin: 2px 1em 0 auto;
```

### HTML への適用

1. **外部ファイル**: .css ファイルを作成し、HTML の &lt;head&gt; タグ内で読み込む。<br>
`<link rel="stylesheet" href="style.css">`
2. **内部埋め込み**: HTML の &lt;style&gt; タグ内に書く。
3. **インライン**: タグに直接書く。<br>
`<p style="color: red;">`

### コメント

```css
/* コメント */
```

---

### CSS が効かない <a id="css-invalid" data-name="CSSが効かない"></a>

- DevTools で確認して、指定した項目はあるか
    - CSS のパスは合っている？
    - セレクタは合っている？
- DevTools で <s>打ち消し線</s>
    - 他の CSS に優先順位で負けている
- エクスクラメーションマークがある
    - 無効なプロパティ
    - 値が間違っている
    - ブラウザ非対応


## セレクター <a id="selector" data-name="セレクター"></a>

#### タイプセレクター

指定した要素名 (タグ) にスタイルを適用する。<br>
**要素名 {}**

#### クラスセレクター (ドット)

指定したクラスを持つ要素にスタイルを適用する。<br>
**.クラス名 {}**

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

同じ親要素内の隣接する要素の、要素Aの直後にあるひとつの要素Bにスタイルを適用する。<br>
**要素A + 要素B {}**

#### 間接セレクター (チルダ)

同じ親要素内にある要素Aより後ろに記述された要素Bすべてにスタイルを適用する。<br>
**要素A ~ 要素B {}**

#### 属性セレクター (角括弧)

- 指定した属性を持つ要素。<br>
  `要素名[属性]`
  <pre><code class="example">[disabled] {
    /* 無効なボタンに適用 */
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

- 属性値が含まれている要素。独立して属性値が存在する必要がある。<br>
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

#### ユニバーサルセレクター (アスタリスク)

全ての要素にスタイルを適用する。<br>
*** {}**
<pre><code class="example">/* body要素の子要素の全てのp要素に適用。 */
body * p {
    color: red;
}</code></pre>

---

## 疑似クラス <a id="pseudo-class" data-name="疑似クラス"></a>

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

#### :first-child

最初の子要素。

#### :last-child

最後の子要素。

#### nth-child()

n番目の要素。

#### nth-of-type()

同じタグのn番目。

#### only-child

子が1要素。

<pre><code class="example">li:first-child {
    font-weight: bold;
}

li:nth-child(2) {
    color: red;
}</code></pre>

#### :not()

条件否定。

#### :is()

複数条件。

#### :where()

is の軽量版。

<pre><code class="example">button:not(.primary) {
    background: gray;
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


---

## 疑似要素 <a id="pseudo-element" data-name="疑似要素"></a>

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

隣接するセルが個別に境界線を持つ。

---

### display: flex; <a id="flex" data-name="flex"></a>

1次元方向に子要素を並べる、Flex レイアウトが有効になる。<br>
デフォルトで横方向。

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

左寄せ。

##### flex-end

右寄せ。

##### space-between

両端揃え。

##### space-around

均等。

#### align-items

交差軸の配置。

##### center

中央。

##### stretch

引き伸ばす。

##### flex-start

上。

##### flex-end;

下。

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

---

### display: grid; <a id="grid" data-name="grid"></a>

子要素を格子状に配置する。

#### grid-template-columns
#### grid-template-rows

実質必須。列と行の数とサイズを指定する。

| --- | --- |
| px | 固定サイズ |
| fr | 残りスペース |
| % | 親基準 |
| auto | 内容サイズ |

#### grid-column
#### grid-row

子要素で指定して、グリッドの何マス分使うかを指定する。

```css
grid-row: 1 / 3;
```

```css
grid-column: span 2;
```

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

要素をなにも置かない場合は (ドット) を使う。

```
grid-template-areas:
    "header header header"
    ".      main   ."
    "footer footer footer";
```

---

## 単位と関数 <a id="units" data-name="単位と関数"></a>

CSS で使用される主な単位と関数について。

- `px` : ピクセル。絶対単位で画面の解像度に依存する。
- `rem` : ルート (根要素の `<html>`) のフォントサイズに対する相対単位。レイアウト設計の基本としてよく使われる。
- `em` : 親要素のフォントサイズに対する相対単位。
- `%` : 親要素のサイズに対する割合。
- `vw` / `vh` : ビューポート (画面領域) の幅 (`vw`) と高さ (`vh`) に対する割合 (1 `vw` は画面幅の 1%)。

#### `calc()` 関数

計算式を使ってプロパティ値を指定できる。

```css
width: calc(100% - 80px);
```

---

## 位置指定 <a id="position" data-name="位置指定"></a>

要素の配置方法を指定する。

- `static` : 通常の配置 (デフォルト)。
- `relative` : 相対配置。通常の配置位置を基準に移動する。
- `absolute` : 絶対配置。親要素のうち `position` が `static` 以外の要素を基準に配置する。
- `fixed` : 固定配置。ビューポート (画面) を基準に固定され、スクロールしても動かない。
- `sticky` : スティッキー配置。スクロール位置に応じて `relative` と `fixed` が切り替わる。

#### `z-index`

重なり順を指定する。数値が大きいほど手前に表示される (`position` が `static` 以外の要素で有効)。

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





