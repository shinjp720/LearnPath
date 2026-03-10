---
title: CSS
layout: default
---

# CSS <a id="top" data-name="TOP"></a>

---

## 基本 <a id="basic" data-name="基本"></a>

- CSS(CascadingStyleSheet)は、ウェブサイト、ウェブアプリの見た目を整えるための言語で、
HTMLが骨組みや内容を作るのに対し、CSSは色、レイアウト、フォントなどのデザインを作る。

#### 基本構文

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

#### ボックスモデル

全ての要素は箱(ボックス)として扱われる。

```
┌ margin ───────────────┐ -> 枠線の外側の余白
│ ┌ border ───────────┐ │ -> 枠線そのもの
│ │ ┌ padding ──────┐ │ │ -> 枠線の内側の余白
│ │ │   content     │ │ │ -> テキスト画像そのもの
│ │ └───────────────┘ │ │
│ └───────────────────┘ │
└───────────────────────┘
```

#### margin, paddingの複数指定

```css
/* 四辺すべてに適用 */
margin: -3px;
/* 上下 | 左右 */
margin: 5% auto;
/* 上 | 左右 | 下 */
margin: 1em auto 2em;
/* 上 | 右 | 下 | 左 */
margin: 2px 1em 0 auto;
```

#### HTMLへの適用

1. **外部ファイル**: .cssファイルを作成し、HTMLの&lt;head&gt;タグ内で読み込む。<br>
`<link rel="stylesheet" href="style.css">`
2. **内部埋め込み**: HTMLの&lt;style&gt;タグ内に書く。
3. **インライン**: タグに直接書く。<br>
`<p style="color: red;">`

#### コメント

```css
/* コメント */
```

---

## セレクター <a id="selector" data-name="セレクター"></a>

#### タイプセレクター

指定した要素名(タグ)にスタイルを適用する。<br>
**要素名 {}**

#### クラスセレクター(ドット)

指定したクラスを持つ要をにスタイルを適用する。<br>
**.クラス名 {}**

#### 子孫セレクター(スペース)
親要素である要素Aに含まれる全ての要素Bにスタイルを適用する。<br>
**要素A 要素B {}**

#### 複数指定(カンマ)

同じスタイルを複数の要素に適用したい場合は、カンマで区切って指定する。<br>
**要素A, 要素B {}**

#### 子セレクター(大なり)
親要素である要素A直下の(子のみで孫には反映されない)要素Bにスタイルを適用する。<br>
**要素A > 要素B {}**

#### 隣接セレクター(プラス)
同じ親要素内の隣接する要素の、要素Aの直後にあるひとつの要素Bにスタイルを適用する。<br>
**要素A + 要素B {}**

#### 間接セレクター(チルダ)
同じ親要素内にある要素Aより後ろに記述された要素Bすべてにスタイルを適用する。<br>
**要素A ~ 要素B {}**

#### 属性セレクター(角括弧)
- 指定した属性を持つ要素。<br>
  **要素名[属性]**
  <pre><code class="example">[disabled] {
    /* 無効なボタンに適用 */
}</code></pre>

- 指定した属性と値に一致する要素。<br>
  **要素名[属性="属性値"]**
  <pre><code class="example">[type="text"] {
    /* textの入力欄に適用 */
}</code></pre>

- 指定した文字列で始まる属性値を持つ要素。<br>
  **要素名[属性^="文字列"]**
  <pre><code class="example">a[href^="https"] {
    /* httpsで始まるリンクに適用 */
}</code></pre>

- 指定した文字列で終わる属性値を持つ要素。<br>
  **要素名[属性$="文字列"]**
  <pre><code class="example">a[href$=".pdf"] {
    /* .pdfの拡張子を持つリンクに適用 */
}</code></pre>

- 属性値が含まれている要素。独立して属性値が存在する必要がある。<br>
  **要素名[属性~="属性値"]**
  <pre><code class="example">a[rel~="nofollow"] {
    /* nofollowを含むrelがあるリンクに適用 */
}</code></pre>

- 文字列を含む要素(部分一致)。<br>
  **要素名[属性*="文字列"]**
  <pre><code class="example">a[href*="example"] {
    /* "example"を含むリンクに適用 */
}</code></pre>

- 指定した属性と指定した文字列と一致、または「指定した文字列-」で始まる属性値を持つ要素。<br>
  **要素名[属性|="文字列"] {}**
  <pre><code class="example">[lang|="en"] {
    /* "en"または"en-"で始まる要素に適用 */
}</code></pre>

#### ユニバーサルセレクター(アスタリスク)

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

isの軽量版。

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

widthの計算方法を指定する。デフォルトでcontent-box。

#### content-box

要素にwidthを指定すると、ボックスモデルのcontentに対してwidthが反映されるため、
width + padding + borderがボーダーまでの幅となる。

#### border-box

要素にwidthをを指定すると、width = content + padding + borderとなる。

<pre><code class="example">*,
*::before,
*::after {
  box-sizing: border-box;
}</code></pre>

### border-collapse

tableの枠線の重なりを指定する。

#### collapse

隣接するセルで境界線を共有する。

#### separate

隣接するセルが個別に境界線を持つ。

---

### display: flex;

1次元方向に子要素を並べる、Flexレイアウトが有効になる。<br>
デフォルトで横方向。

#### flex-direction

要素の方向を決める。

- `flex-direction: row;`<br>
  横方向(デフォルト)。
- `flex-direction: column;`<br>
  縦方向。

#### justify-content

メイン方向の配置を決める。

- `justify-content: center;`<br>
  中央に寄せる。

- `justify-content: flex-start;`<br>
  左寄せ。

- `justify-content: flex-end;`<br>
  右寄せ。

- `justify-content: space-between;`<br>
  両端揃え。

- `justify-content: space-around;`<br>
  均等。

#### align-items

交差軸の配置。

- `align-items: center;`<br>
  中央。

- `align-items: stretch;`<br>
  引き伸ばす。

- `align-items: flex-start;`<br>
  上。

- `align-items: flex-end;`<br>
  下。

#### flex

余ったスペースを埋める。

- `flex: 1;`<br>
  他の要素で指定された幅(高さ)の余った分を埋める。<br>
  割合で指定することもできる。

#### gap

要素同士の間隔。

- `gap: 10px`<br>
  隙間を空ける。

#### flex-wrap

折り返し。

- `flex-wrap: wrap`<br>
  折り返す。

- `flex-wrap: nowrap`<br>
  折り返さない。



### display: grid;














