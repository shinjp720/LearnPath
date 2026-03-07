---
title: CSS
layout: default
---

# CSS <a id="top" data-name="TOP"></a>

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

#### 疑似クラス(コロン)
- 最初の子要素
<pre><code class="example">&lt;div&gt;
    &lt;p&gt;これは p タグの1つ目&lt;/p&gt;
    &lt;span&gt;これは span タグ&lt;/span&gt;
    &lt;p&gt;これは p タグの2つ目&lt;/p&gt;
&lt;/div&gt;</code></pre>

<pre><code class="example">div p:first-child {
    color: red;
}</code></pre>

同じ親要素内で、指定した要素が最初の子要素である時にスタイルを適用する。<br>
上記の場合、一つ目の&lt;p&gt;の文字色が赤になるが、仮に&lt;span&gt;が先にあった場合はマッチしない。


## プロパティ <a id="property" data-name="プロパティ"></a>

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














