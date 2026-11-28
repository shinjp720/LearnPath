---
title: HTML
layout: default
---

# HTML <a id="top" data-name="TOP"></a>

- **HTML(HyperText Markup Language)**はウェブページの構造を作るためのマークアップ言語。
- 拡張子は.html。
- `<>`で囲まれたマークをHTMLにおけるタグ(Tag)と呼び、タグで囲んでマークアップされ意味付けされたものを要素(Element)と呼ぶ。
- 空要素を除き、基本的に`<body>`と`</body>`のように開始タグと終了タグがある。
- 要素に対する付加情報のような形で属性(Attribute)を付けられる。
- 属性には要素固有のものと、全要素で共通して使用できるグローバル属性がある。
- `<!-- コメント -->`

---

## 基本構造 <a id="basic-structure" data-name="基本構造"></a>

HTML 文書の基本の形。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ページのタイトル</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
  <script src="app.js" defer></script>
</body>
</html>
```

| 部分 | 役割 |
| --- | --- |
| `<!DOCTYPE html>` | HTML5 の文書であることを示す宣言。必ず先頭に書く (ないと、ブラウザが古い互換モードで表示する) |
| `<html lang="ja">` | ルート要素。`lang` で、文書の言語を指定する |
| `<meta charset="UTF-8">` | 文字コードの指定。文書の先頭近く (`<head>` の最初) に書く |
| `<meta name="viewport">` | スマートフォンで、画面幅に合わせて表示するために必要 |
| `<title>` | ページのタイトル (タブや検索結果に表示される) |
| `<body>` | 画面に表示される内容を書く |

### 要素と属性の書き方

| 項目 | 内容 |
| --- | --- |
| 開始タグと終了タグ | `<p>本文</p>` のように、内容を囲む |
| 空要素 | 内容を持たず、終了タグがない要素 (`<br>`、`<hr>`、`<img>`、`<input>`、`<meta>`、`<link>` など)。`<br />` と書いてもよいが、HTML5 では不要 |
| 属性 | 開始タグの中に `名前="値"` の形で書く。値は、引用符 (`"`) で囲む |
| 真偽値属性 | `disabled`、`checked`、`required` など。**書いてあれば有効**で、値は不要 (`disabled` または `disabled=""`) |
| 大文字と小文字 | タグ名と属性名は区別されないが、小文字で書くのが慣習 |

<pre><code class="caution">真偽値属性は、値が "false" でも、書いてあれば有効になる。
無効にしたいときは、disabled="false" と書くのではなく、属性ごと取り除く。</code></pre>

### 入れ子の規則

- 要素は、開始と終了が交差しないように、入れ子にする (`<b><i>text</b></i>` はNG)。
- `<p>` の中には、`<div>`、`<ul>`、`<p>` などのブロック要素を入れられない (入れると、`<p>` が自動で閉じられる)。
- `<a>` の中に `<a>` や `<button>` を入れてはいけない。
- `<li>` は、`<ul>`、`<ol>`、`<menu>` の直接の子にする。
- `<table>` の中の `<tr>` は、ブラウザが `<tbody>` を自動で補う。

### コメント

```html
<!-- コメント (画面には表示されない) -->
```

<pre><code class="tips">書いた HTML が正しいかは、W3C の Nu Html Checker (validator.w3.org/nu) で検証できる。
閉じタグの抜けや、入れ子の間違いを指摘してくれる。</code></pre>

---

## メインルート <a id="main-root" data-name="メインルート"></a>

### `<html>`
HTML文書におけるルート要素(最上位の要素)を表す。他の全ての要素は、この要素の子孫要素として配置しなければならない。

```html
<html lang="ja">
```

`lang` 属性で、文書の言語を指定する。スクリーンリーダーの読み上げ、翻訳の提案、ハイフネーション、フォントの選択 (中国語・日本語・韓国語で、字形が異なる漢字) などに使われる。

`<html>` と `</html>`、`<head>`、`<body>` は、HTML では省略できることがあるが、省略せずに書く。`lang` は、`en`、`ja`、`zh-CN` のように、言語タグで指定する。文書の一部だけ言語が違うときは、その要素に `lang` を付ける (`<span lang="en">...</span>`)。

---

## 文書メタデータ <a id="meta-data" data-name="文書メタデータ"></a>

### `<base>`
文書内における全ての相対URLの起点となるURLを指定する。文書内に1つだけ置くことができる。

```html
<base href="https://example.com/app/" target="_blank">
```

<pre><code class="caution">base を指定すると、ページ内リンク (#section) も、base の URL を基準に解決され、意図しない移動になることがある。
使うときは、すべての相対 URL への影響に注意する。</code></pre>

### `<head>`
文書に関する機械可読な情報(メタデータ)、例えば`<title>`, `<script>`, `<style>`などを含む。

`<head>` の中身は、画面には表示されない。`<head>` 内に書けるのは、`<title>`、`<meta>`、`<link>`、`<style>`、`<script>`、`<base>`、`<noscript>`、`<template>` など。

<pre><code class="caution">&lt;head&gt; の中に、&lt;div&gt; や &lt;p&gt; などの、画面に表示される要素を書くと、ブラウザは、そこで &lt;head&gt; が終わって &lt;body&gt; が始まったと解釈する。
その後ろに書いた &lt;meta&gt; や &lt;link&gt; が、&lt;head&gt; として扱われなくなるので注意する。</code></pre>

### `<link>`
現在の文書と外部リソースとの関係を指定する。この要素はCSSをリンクするために最もよく使用されるが、他にもサイトアイコン(ファビコンスタイルのアイコンやモバイル端末でのホーム画面やアプリのアイコンの両方)を設定するために使用される。

`rel` 属性で、関係の種類を指定する。

| rel の値 | 用途 |
| --- | --- |
| `stylesheet` | CSS を読み込む |
| `icon` | ファビコン (タブに表示されるアイコン) |
| `apple-touch-icon` | iOS のホーム画面のアイコン |
| `manifest` | Web アプリのマニフェスト (PWA) |
| `canonical` | 同じ内容のページが複数あるときの、正規の URL (検索エンジン向け) |
| `alternate` | 別の言語版や、RSS フィードなど、別の表現 |
| `preload` | 現在のページで、すぐに必要なリソースを、先に読み込む |
| `preconnect` | 別のドメインへの接続を、先に済ませておく |
| `dns-prefetch` | 別のドメインの名前解決を、先に済ませておく |
| `modulepreload` | JavaScript のモジュールを、先に読み込む |

その他の主な属性:

| 属性 | 説明 |
| --- | --- |
| `href` | リンク先の URL |
| `type` | リソースの MIME タイプ (`text/css` など。省略できることが多い) |
| `media` | 適用する条件 (`media="print"` など) |
| `as` | `preload` で、リソースの種類 (`font`、`style`、`script`、`image`) |
| `sizes` | アイコンの大きさ (`icon`、`apple-touch-icon`) |
| `crossorigin` | CORS の設定 (フォントの `preload` では必須) |
| `integrity` | 改ざんされていないかの確認 (SRI) |
| `hreflang` | リンク先の言語 (`alternate` と合わせて使う) |

```html
<link rel="stylesheet" href="style.css">
<link rel="icon" href="/favicon.ico">
<link rel="canonical" href="https://example.com/page">
<link rel="preconnect" href="https://fonts.googleapis.com">
<!-- フォントの preload は、crossorigin が必要 -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
```

### `<meta>`
メタデータを表す。これは、他のメタ関連要素`<base>`, `<link>`, `<script>`, `<style>`, `<title>`で表すことができないものを表す。

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="検索結果に表示される、ページの説明文">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#3498db">
```

| 種類 | 書き方 | 用途 |
| --- | --- | --- |
| 文字コード | `charset="UTF-8"` | 文字コードの宣言 |
| `name` と `content` | `name="description"` など | ページの情報 (説明、検索エンジンへの指示、テーマカラー) |
| `http-equiv` | `http-equiv="refresh"` など | HTTP ヘッダーの代わりになる指示 |
| `property` と `content` | `property="og:title"` など | OGP (SNS で共有されたときの表示) |

`http-equiv="refresh"` は、一定時間後にページを移動させるが、利用者の操作を待たずに画面が変わるため、使わない (リダイレクトは、サーバーの 301 や 302 などで行う)。`http-equiv="content-security-policy"` で、読み込める外部リソースを制限することもできる。ダークモードに対応したページは、`<meta name="color-scheme" content="light dark">` で、ブラウザに伝えられる。

SNS で共有されたときの表示は、OGP (Open Graph Protocol) で指定する。

```html
<meta property="og:title" content="ページのタイトル">
<meta property="og:description" content="ページの説明">
<meta property="og:image" content="https://example.com/ogp.png">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

### `<style>`
文書あるいは文書の一部分のスタイル情報を含む。`<style>`要素を含んでいる文書のコンテンツに適用されるCSSを含む。

```html
<style>
  body { margin: 0; }
</style>
```

`media` 属性で、適用する条件を指定できる (`<style media="print">`)。複数のページで共有するスタイルは、`<link>` で外部ファイルに分ける方が、キャッシュされて効率がよい。

### `<title>`
ブラウザのタイトルバーやページのタブに表示される文書のタイトルを定義する。テキストのみを含めることができる。要素内のHTMLタグは存在しても、プレーンテキストとして扱われる。

<pre><code class="tips">title は、ページごとに固有の内容にする。ブラウザのタブ、ブックマーク、検索結果、スクリーンリーダーで、ページを区別する手がかりになる。
「ページ名 | サイト名」のように、内容を先に書くと、タブが狭くても、見分けやすい。</code></pre>

---

## 区分化ルート <a id="sectioning-root" data-name="区分化ルート"></a>

### `<body>`
HTML文書のコンテンツを示す要素で、文書中に1つだけ配置できる。

画面に表示される内容は、すべて `<body>` の中に書く。

`onload` や `onbeforeunload` など、ウィンドウ全体に関わるイベントハンドラーも書けるが、JavaScript のファイル側で登録する方がよい。`bgcolor`、`text`、`link` など、見た目を指定する属性は廃止されているので、CSS を使う。

---

## コンテンツ区分 <a id="content-category" data-name="コンテンツ区分"></a>

### `<address>`
これを含んでいるHTMLが個人、団体、組織の連絡先を提供していることを示す。

```html
<article>
  <h2>記事のタイトル</h2>
  <p>本文...</p>
  <address>
    著者: <a href="mailto:author@example.com">山田 太郎</a>
  </address>
</article>
```

<pre><code class="caution">address は、住所を書くための要素ではなく、「直近の article や body の、著者や管理者の連絡先」を示す要素。
店舗の所在地など、連絡先以外の住所は、p などで書く。</code></pre>

### `<article>`
文書、ページ、アプリケーション、サイトなどの中で自己完結しており、(集合したものの中で)個別に配信や再利用を行うことを意図した構成物を表す。例えば、フォーラムの投稿、雑誌や新聞の記事、ブログの記事、商品カード、ユーザーが投稿したコメント、対話型のウィジェットやガジェット、その他の独立したコンテンツの項目が含まれる。

```html
<article>
  <header>
    <h2>記事のタイトル</h2>
    <p><time datetime="2024-11-04">2024年11月4日</time></p>
  </header>
  <p>本文...</p>
</article>
```

`<article>` は、入れ子にできる (記事の中のコメントなど)。基本的に、見出しを持つ。ページから切り出して、別の場所に置いても意味が通るなら `<article>`、そうでなければ `<section>` や `<div>` を使う。

### `<aside>`
文書のメインコンテンツと間接的な関係しか持っていない文書の部分を表現する。サイドバーやコールアウトボックスなどを表現するためによく使用される。

```html
<aside>
  <h2>関連記事</h2>
  <ul>
    <li><a href="/a">記事A</a></li>
  </ul>
</aside>
```

本文を読むうえで必須ではない補足 (サイドバー、関連記事、用語の解説、広告) に使う。ページ全体のサイドバーだけでなく、`<article>` の中の補足にも使える。支援技術には、補足的な内容 (complementary) として伝わる。

### `<footer>`
直近の区分コンテンツまたは区分化ルート要素のフッターを表す。フッターには通常、そのセクションの著作者に関する情報、関連文書へのリンク、著作権情報等を含める。

`<footer>` と `<header>` は、ページ全体だけでなく、`<article>` や `<section>` の中にも置ける。

```html
<footer>
  <p><small>&copy; 2024 Example</small></p>
  <nav>...</nav>
</footer>
```

`<footer>` の中に、`<header>` や `<footer>` を入れてはいけない。`<body>` 直下の `<footer>` は、ページ全体のフッター (contentinfo) として扱われる。著者名や公開日などは、`<article>` の中の `<footer>` に書く。

### `<header>`
導入的なコンテンツ、普通は導入部やナビゲーション等のグループを表す。見出し要素だけでなく、ロゴ、検索フォーム、作者名、その他の要素を含むこともできる。

```html
<header>
  <a href="/"><img src="logo.svg" alt="サイト名"></a>
  <nav>...</nav>
</header>
```

`<body>` 直下の `<header>` は、ページ全体のヘッダー (banner) として扱われる。`<article>` や `<section>` の中に置くと、その区分だけのヘッダーになる。`<header>` や `<footer>` の中に、`<header>`、`<footer>`、`<main>` を入れてはいけない。

### `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`
セクションの見出しを6段階で表す。`<h1>`が最上位で、`<h6>`が最下位。

```html
<h1>ページのタイトル</h1>
  <h2>大きな見出し</h2>
    <h3>小さな見出し</h3>
  <h2>別の大きな見出し</h2>
```

- 見出しレベルは、**文書の構造**で選ぶ。文字の大きさは、CSS で調整する。
- レベルを飛ばさない (`<h2>` の次に `<h4>` を置かない)。
- `<h1>` は、ページに1つにするのが、慣習として推奨される。
- スクリーンリーダーの利用者は、見出しの一覧から、目的の箇所に移動するため、構造が正しいことが重要。

### `<hgroup>`
小見出し、代替タイトル、キャッチフレーズなどの副次的コンテンツとグループ化された見出しを表す。

```html
<hgroup>
  <h1>HTML 入門</h1>
  <p>要素と属性をひとつずつ学ぶ</p>
</hgroup>
```

見出し (`<h1>`〜`<h6>`) と、それを補足する `<p>` をグループ化する。

### `<main>` {#main-section}
文書の本体の主要な内容を表す。主要な内容とは、文書の中心的な主題、またはアプリケーションの中心的な機能に直接関連または拡張した内容の範囲の事。

<pre><code class="tips">main は、ページに1つだけ置く (hidden 属性を付けたものを除く)。
article、aside、header、footer、nav の中には置けない。スキップリンク (本文へ移動するリンク) の移動先にもなる。</code></pre>

### `<nav>`
現在の文書内の他の部分や他の文書へのナビゲーションリンクを提供するためのセクションを表す。ナビゲーションセクションの一般的な例としてメニュー、目次、索引などがある。

```html
<nav aria-label="メインメニュー">
  <ul>
    <li><a href="/">ホーム</a></li>
    <li><a href="/about">概要</a></li>
  </ul>
</nav>
```

ページに複数の `<nav>` があるときは、`aria-label` で区別できるようにする。フッターの小さなリンクなどは、`<nav>` にしなくてもよい (主要なナビゲーションに使う)。

### `<section>`
文書の自立した一般的なセクション(区間)を表す。そのセクションを表現するより意味的に具体的な要素がない場合に使用する。少数の例外を除いて、セクションには見出しを置く。

```html
<section>
  <h2>特徴</h2>
  <p>...</p>
</section>
```

見出しを付けられないまとまりや、スタイル付けのためだけのまとまりには、`<section>` ではなく `<div>` を使う。`<section>` は、見出しや `aria-labelledby` で名前を持つと、支援技術に、ページの区画 (region) として伝わる。

### `<search>`
検索または絞り込み処理を実行することに関連する一連のフォームコントロールまたは他のコンテンツを含む部分を表す。

```html
<search>
  <form action="/search">
    <label for="q">検索</label>
    <input type="search" id="q" name="q">
    <button>検索</button>
  </form>
</search>
```

比較的新しい要素で、これまでは `<div role="search">` で表していた。

### 区分要素の使い分け

| 要素 | 使いどころ |
| --- | --- |
| `<header>` | ページや区分の、導入部 (ロゴ、タイトル、ナビゲーションなど) |
| `<nav>` | 主要なナビゲーションリンクのまとまり |
| `<main>` | ページの主要な内容 (1つだけ) |
| `<article>` | 単独で意味が通る内容 (記事、投稿、コメント、商品カード) |
| `<section>` | 見出しを持つ、内容のまとまり |
| `<aside>` | 本文と間接的に関係する内容 (サイドバー、関連記事、広告) |
| `<footer>` | ページや区分の、末尾 (著作権、関連リンク) |
| `<div>` | 上のどれにも当てはまらず、スタイル付けやまとめるためだけのとき |

```html
<body>
  <header>
    <h1>サイト名</h1>
    <nav>...</nav>
  </header>

  <main>
    <article>
      <h2>記事のタイトル</h2>
      <section>
        <h3>見出し</h3>
        <p>本文...</p>
      </section>
    </article>
    <aside>関連記事...</aside>
  </main>

  <footer>
    <p><small>&copy; 2024 Example</small></p>
  </footer>
</body>
```

---

## テキストコンテンツ <a id="text-contents" data-name="テキストコンテンツ"></a>

### `<blockquote>`
内包するテキストが引用文であることを示す。通常、字下げを伴ってレンダリングされる。`cite`属性により引用元の文書のURLを、`<cite>` 要素により引用元の文書のタイトルなどを明示可能。

```html
<blockquote cite="https://example.com/source">
  <p>引用する文章。</p>
</blockquote>
<p>出典: <cite>書籍のタイトル</cite></p>
```

`cite` 属性の URL は、画面には表示されない。出典を見せたいときは、`<figure>` と `<figcaption>` と組み合わせる。

```html
<figure>
  <blockquote>
    <p>引用する文章。</p>
  </blockquote>
  <figcaption>―― <cite>書籍のタイトル</cite></figcaption>
</figure>
```

### `<div>`
フローコンテンツの汎用コンテナー。CSSを用いて何らかのスタイル付け(例えば、スタイルが直接適用されたり、親要素にフレックスボックスなどの何らかのレイアウトモデルが適用されるなど)がされない限り、コンテンツやレイアウトには影響を与えない。

<pre><code class="tips">div は、意味を持たない最後の手段。ヘッダー、ナビゲーション、記事などに当てはまる場合は、header、nav、article などの、意味のある要素を使う。
スタイル付けやレイアウトのために、まとめるだけのときに、div を使う。</code></pre>

### `<dl>`
説明リストを表す。この要素は、一連の用語(`<dt>`要素を使用して指定)と説明(`<dd>`要素によって提供)をリスト化したものである。一般的な使用例として、用語集の作成やメタデータ(キーと値のペアのリスト)の表示が挙げられる。

```html
<dl>
  <dt>HTML</dt>
  <dd>ウェブページの構造を作るマークアップ言語。</dd>

  <dt>CSS</dt>
  <dd>見た目を整えるスタイルシート言語。</dd>
</dl>
```

`<dl>` の直接の子は、`<dt>`、`<dd>`、それらをまとめる `<div>` (スタイル付けのために、用語と説明のグループを囲む) に限られる。用語と説明の対応が、見た目ではなく構造で伝わる。

### `<dt>`
説明または定義リストの中で用語を表す部分であり、`<dl>`の子要素としてのみ用いることができる。普通は`<dd>`要素が続く。しかし、複数の`<dt>`要素が続くと、複数の用語がすぐ後に続く`<dd>`要素で定義されていることを表す。

```html
<dl>
  <dt>HTML</dt>
  <dt>HyperText Markup Language</dt>
  <dd>ウェブページの構造を作るマークアップ言語。</dd>
</dl>
```

### `<dd>`
説明リスト要素`<dl>`内で、その前の用語`<dt>`の説明、定義、値などを示す。

1つの用語に、複数の `<dd>` を続けて、複数の説明を付けることもできる。

### `<figure>`
自己完結型のコンテンツを表し、任意で`<figcaption>`要素を使用して表されるキャプションを付けることができる。図、すなわちキャプションとその中身は一つの単位として参照される。

```html
<figure>
  <img src="chart.png" alt="2024年の売上の推移を示す折れ線グラフ">
  <figcaption>図1: 2024年の売上の推移</figcaption>
</figure>
```

画像のほか、コードやグラフ、引用などにも使える。

### `<figcaption>`
親の`<figure>`要素内にあるその他のコンテンツを説明するキャプションや凡例を表す。

`<figure>` の最初か最後の子として、1つだけ置く。`<figure>` は、本文から切り離しても意味が通る図・コード・引用などをまとめる要素。`<figcaption>` は、全員に向けた説明で、画像が見えない人向けの代替テキスト (`alt`) とは別物。

### `<ul>`
項目の順序なしリストを表す。一般的に、行頭記号を伴うリストとして描画される。

```html
<ul>
  <li>りんご</li>
  <li>みかん</li>
</ul>
```

`<ul>` の直接の子は、`<li>` だけにする (`<div>` などを直接入れない)。行頭記号は、CSS の `list-style` で変えたり、消したりできる。ナビゲーションメニューも、リンクを入れた `<li>` を並べた `<ul>` で書くのが定番 (項目の数が、支援技術に伝わる)。順序に意味があるときは `<ol>` を使う。

### `<ol>`
項目の順序付きリストを表す。普通は番号付きのリストとして表示される。

| 属性 | 説明 |
| --- | --- |
| `start` | 開始する番号 (`<ol start="3">` は 3 から始まる) |
| `reversed` | 番号を、降順にする |
| `type` | 番号の種類 (`1`、`a`、`A`、`i`、`I`) |

```html
<ol start="3" reversed>
  <li>第3位</li>
  <li>第2位</li>
  <li>第1位</li>
</ol>
```

手順やランキングなど、**順序に意味がある**ときに使う。番号の見た目は、`type` 属性よりも、CSS の `list-style-type` で変える。`<ol>` の直接の子も、`<li>` だけにする。

### `<li>`
リストの項目を表すために用いられる。この要素は、その項目が属する順序付きリスト`<ol>`、順序なしリスト`<ul>`、メニュー`<menu>`のいずれかの子要素として配置する必要がある。メニュー要素および順序なしリスト内においては、リストの項目は通常、行頭文字伴って表示され、順序付きリスト内では、数字や文字による連番のリストマーカーを伴って表示される。

`<ol>` の中の `<li>` には、`value` 属性で、その項目の番号を指定できる。

リストは入れ子にできる。入れ子のリストは、`<li>` の中に置く。

```html
<ul>
  <li>果物
    <ul>
      <li>りんご</li>
      <li>みかん</li>
    </ul>
  </li>
  <li>野菜</li>
</ul>
```

### `<menu>`
`<li>`要素で表現される項目の順不同リストを表す。`<ul>`とは異なる意味づけで、ツールバーのような操作の一覧を表すための要素だが、ブラウザーでは`<ul>`と同じものとして扱われる (アクセシビリティツリーでも、`<ul>` と同じリストとして公開される)。

```html
<menu>
  <li><button type="button">コピー</button></li>
  <li><button type="button">貼り付け</button></li>
</menu>
```

実際には、ほとんど使われない。通常のリストやナビゲーションには、`<ul>` を使う。

### `<p>`
テキストの段落を表す。視覚メディアにおいて、段落は普通隣接するブロックと上下の空白や最初の行の字下げによって隔てられたテキストのブロックとして表現され、HTMLの段落は画像やフォーム欄などの関連するコンテンツを構造的にまとめることができる。

HTML では、ソースコードの中の改行や連続する空白は、画面では1つの半角スペースにまとめられる。改行を表示したいときは、`<br>` を使うか、別の `<p>` にする (整形をそのまま見せたいときは `<pre>`)。

<pre><code class="caution">段落の間隔や余白を作るために、空の p や br を並べない。余白は、CSS の margin や padding で調整する。</code></pre>

### `<pre>`
整形済みテキスト(preformatted text)を表す。この要素内のテキストは一般的に、ファイル内でのレイアウトをそのまま反映して等幅フォントで表示される。この要素内のホワイトスペース文字はそのまま表示する。

コードを表示するときは、`<pre>` の中に `<code>` を入れる。`<` や `&` は、文字参照 (`&lt;`、`&amp;`) にする。

```html
<pre><code>function hello() {
  console.log("hello");
}</code></pre>

`<pre>` の開始タグの直後の改行は、無視される。長い行は、折り返されずに横にはみ出す (`white-space: pre-wrap` で折り返せる)。言語ごとの色分けは、`<code class="language-js">` のように `class` を付けて、シンタックスハイライトのライブラリに任せる (`language-` は慣習で、HTML の仕様ではない)。
```

### `<hr>`
段落レベルの要素間において、テーマの意味的な区切りを表す。例えば、話の場面の切り替えや、節内での話題の転換など。以前はこれは水平の区切り線として定義されていた。現在でもブラウザーでは水平線として表示されるが、この要素は表示論的な用語ではなく意味論的な用語で定義されたので、水平線を引きたいのであれば、適切な CSS を使用する。

```html
<p>第1章の終わり。</p>
<hr>
<p>第2章の始まり。</p>
```

飾りの線は、CSS の `border` で引く。`<hr>` は、話題の切れ目を示すときに使う。

---

## インラインテキスト意味付け <a id="inline-text" data-name="インラインテキスト意味付け"></a>

### `<a>`
`href`属性を用いて、ウェブページ、ファイル、メールアドレス、現在のページ内の場所、または他の`URL`へのハイパーリンクを作成する。

```html
<a href="https://example.com">外部サイト</a>
<a href="/about">サイト内のページ</a>
<a href="#section2">ページ内の移動</a>
<a href="mailto:info@example.com">メールを送る</a>
<a href="tel:0312345678">電話をかける</a>
<a href="/doc.pdf" download>ダウンロード</a>
<a href="https://example.com" target="_blank" rel="noopener noreferrer">新しいタブで開く</a>
```

| 属性 | 説明 |
| --- | --- |
| `href` | リンク先の URL。ない `<a>` は、リンクとして機能しない |
| `target` | 開く場所 (`_self`: 同じタブ (既定)、`_blank`: 新しいタブ) |
| `rel` | リンク先との関係 (`noopener`、`noreferrer`、`nofollow`、`external` など) |
| `download` | クリックしたときに、ファイルとして保存する |
| `hreflang` | リンク先の言語 |

`rel` の主な値:

| 値 | 意味 |
| --- | --- |
| `noopener` | 新しく開いたページから、元のページ (`window.opener`) を操作させない |
| `noreferrer` | `Referer` ヘッダーを送らない (`noopener` の効果も含む) |
| `nofollow` | 検索エンジンに、このリンクを評価の対象にしないよう伝える |
| `sponsored` | 広告やスポンサーのリンク |
| `ugc` | 利用者が投稿したコンテンツ (コメントなど) の中のリンク |
| `external` | 別のサイトへのリンク |

`target` には、`_self`、`_blank` のほか、親のフレームを指す `_parent`、最上位のウィンドウを指す `_top` もある。`download` は、同じオリジンのファイルでのみ有効に働く。`href="#"` は、ページの先頭に移動する (ボタンの代わりには使わない)。

<pre><code class="tips">target="_blank" のときは、rel="noopener" を付ける習慣がある (現在のブラウザは、暗黙で noopener を適用する)。
リンクの文言は、「こちら」ではなく、リンク先の内容が分かる言葉にする。
ボタンの動作 (送信や開閉) には、a ではなく button を使う。</code></pre>

### `<abbr>`
略語や頭字語を表す。

```html
<abbr title="HyperText Markup Language">HTML</abbr>
```

略語や頭字語の**正式名称**を、`title` 属性で示す (マウスを乗せると表示され、既定では点線の下線が付く)。スマートフォンなどでは `title` が表示されにくいので、重要な略語は、最初に出てきたときに、本文で正式名称を書くとよい。

```html
<p><abbr title="World Wide Web Consortium">W3C</abbr> は、Web の標準を策定している。</p>
```

### `<b>`
要素の内容に読み手の注意を惹きたい場合で、他の特別な重要性が与えられないものに使用する。これは以前は太字要素と呼ばれており、ほとんどのブラウザーでは文字列を太字で描画していた。しかし、`<b>`を文字列の装飾に使うべきではない。太字の文字列を作成するには、CSSの`font-weight`プロパティを使用し、特別な重要性を持つテキストを示すには`<strong>`要素を使用する。

```html
<p>この製品は <b>防水</b> で、<b>軽量</b> です。</p>
```

### 見た目が同じでも、意味が違う要素

| 要素 | 意味 | 既定の見た目 | 使いどころ |
| --- | --- | --- | --- |
| `<b>` | 注意を引く (特別な重要性はない) | 太字 | キーワード、製品名 |
| `<strong>` | 重要、重大、緊急 | 太字 | 警告、注意書き |
| `<i>` | 他と区別される文字列 | 斜体 | 専門用語、外国語、思考 |
| `<em>` | 強調 (読むときの抑揚が変わる) | 斜体 | 文の意味を変える強調 |
| `<u>` | 非言語的な注釈 | 下線 | 誤字の指摘、固有名詞の表記 (中国語) |
| `<s>` | すでに有効でない内容 | 取り消し線 | 値引き前の価格 |
| `<mark>` | 関連性のために目立たせる | 黄色の背景 | 検索結果の一致箇所 |
| `<small>` | 注釈、法的表記 | 小さい文字 | 著作権表示 |

見た目だけが目的なら、要素ではなく、CSS の `font-weight` や `font-style` を使う。

### `<bdi>`
ブラウザーの書字方向アルゴリズムにこのテキストが周囲のテキストから独立していると扱うよう指示する。これは特に、ウェブサイトがテキストを動的に挿入し、挿入されるテキストの書字方向が不明な場合に便利。

```html
<ul>
  <li>ユーザー <bdi>أحمد</bdi>: 90 点</li>
  <li>ユーザー <bdi>Taro</bdi>: 85 点</li>
</ul>
```

右から左に書く言語 (アラビア語など) が混ざる可能性があるときに、前後の文字の並びが崩れるのを防ぐ。`dir` は、既定で `auto` (自動で判定) になる。

### `<bdo>`
現在のテキストの書字方向を上書きし、中のテキストが異なる書字方向で描画されるようにする。

```html
<bdo dir="rtl">Hello</bdo>
```

`dir` 属性が必須で、`ltr` (左から右) か `rtl` (右から左) を指定する。上の例は、右から左に並んで、「olleH」のように表示される。

### `<br>`
文中に改行(キャリッジリターン)を生成する。詩や住所など、行の分割が重要な場合に有用。

```html
<p>
  〒100-0001<br>
  東京都千代田区千代田1-1
</p>
```

<pre><code class="caution">br は、詩や住所のように、改行そのものに意味があるときに使う。
段落を分けたいときは p、余白を作りたいときは CSS を使う。</code></pre>

### `<cite>`
創作物のタイトルをマークアップするために使用する。参照は、引用メタデータに関する利用場面に合わせた慣習に応じて省略形が用いられることがある。

```html
<p>詳細は <cite>プログラミング言語 Rust</cite> を参照。</p>
```

作品のタイトルを示すもので、人名には使わない。

### `<code>`
コンピューターコードの短い断片の文字列であると識別できるような外見のコンテンツを表示する。既定では、中の文字列がユーザーエージェントの既定の等幅フォントを使用して表示される。

```html
<p>変数の値は <code>console.log(x)</code> で確認できる。</p>
```

1行の短いコードに使う。複数行のコードは、`<pre>` の中に `<code>` を入れる。

### コンピューター関連のマークアップ

| 要素 | 意味 | 例 |
| --- | --- | --- |
| `<code>` | コードの断片 | `<code>console.log()</code>` |
| `<kbd>` | キーボードなどからの入力 | `<kbd>Ctrl</kbd> + <kbd>C</kbd>` |
| `<samp>` | プログラムの出力例 | `<samp>Hello, World!</samp>` |
| `<var>` | 変数の名前 | `<var>x</var> + <var>y</var>` |
| `<pre>` | 整形済みテキスト (複数行のコード) | 前述 |

### `<data>`
与えられたコンテンツの断片を機械可読な翻訳にリンクする。コンテンツが時刻または日付に関連するものであれば、`<time>`要素を使用する必要がある。

```html
<data value="1280">1,280円</data>
```

### `<dfn>`
定義句や文の文脈の中で定義している用語を示すために用いられる。`<dfn>`の直近の祖先である`<p>`要素、`<dt>`/`<dd>`の組み合わせ、`<section>`要素が用語の定義とみなされる。

```html
<p><dfn>HTML</dfn> は、ウェブページの構造を作るためのマークアップ言語である。</p>
```

`<dfn>` の中に `<abbr>` を入れて、略語の定義を表すこともできる (`<dfn><abbr title="...">...</abbr></dfn>`)。

### `<em>`
強調されたテキストを示す。`<em>`要素は入れ子にすることができ、入れ子の階層に応じてより強い程度の強調を表すことができる。

```html
<p>私は<em>本当に</em>行きたい。</p>
```

### `<i>`
何らかの理由で他のテキストと区別されるテキストの範囲を表す。例えば、慣用句、技術用語、分類学上の呼称、など。英文においてはよくイタリック体で表現されてきたものであり、それがこの要素の`<i>`という名前の元になっている。

```html
<p>ラテン語の格言 <i lang="la">carpe diem</i> は「今を生きよ」の意味。</p>
```

意味のない装飾の斜体には使わず、CSS の `font-style: italic` を使う。文の意味が変わる強調は、`<em>` にする。

### `<kbd>`
キーボード、音声入力、その他の入力端末からのユーザーによる文字入力を表すインラインの文字列の区間を表す。慣習的に、ユーザーエージェントは既定で`<kbd>`要素の中身を等幅フォントで表示するが、HTML標準で規定されているものではない。

```html
<p>保存するには、<kbd><kbd>Ctrl</kbd> + <kbd>S</kbd></kbd> を押す。</p>
```

`<kbd>` を入れ子にすると、複数のキーを同時に押す操作を表せる。

### `<mark>`
周囲の文脈の中でマークを付けた部分の関連性や重要性のために、参照や記述の目的で目立たせたり強調したりする文字列を表す。

```html
<p>検索結果: ...<mark>HTML</mark> の基本を学ぶ...</p>
```

「いま見ている文脈で、関連が深い」ことを示す (検索語の一致箇所、引用の中で注目してほしい部分など)。文章そのものの重要性を示す `<strong>` や、強調を示す `<em>` とは意味が違う。蛍光ペンのような見た目だけが目的なら、CSS を使う。

### `<q>`
その内容がインラインの引用であることを表す。最近の多くのブラウザーでは、文字列を引用符で囲むように実装している。この要素は、段落区切りをまたがない短い引用のためのもの。長文の引用には、`<blockquote>`要素を使用する。

```html
<p>彼は <q cite="https://example.com/source">明日また来る</q> と言った。</p>
```

### `<ruby>`
ベーステキストの上、下、隣に描画される小さな注釈で、よく東アジアの文字の発音を表すのに使われる。他の種類の注釈にも使われることがあるが、この使い方はあまり一般的ではない。

```html
<ruby>
  漢<rp>(</rp><rt>かん</rt><rp>)</rp>
  字<rp>(</rp><rt>じ</rt><rp>)</rp>
</ruby>
```

### `<rp>`
`<ruby>`要素によるルビの表示に対応していないブラウザー向けの代替表示用括弧を提供するために使用する。`<rp>`要素は、注釈の文字列を表す`<rt>`要素の前後に置き、それぞれ開き括弧と閉じ括弧を指定する。

ルビに対応しているブラウザでは、`<rp>` の中身は表示されない。対応していないブラウザでは、`漢(かん)字(じ)` のように、括弧付きで表示される。

### `<rt>`
ルビによる注釈(振り仮名)のルビ文字列の部分を定義し、東アジアの組版において発音、翻訳、音写などの情報を提供するために使用する。`<rt>`要素は常に`<ruby>`要素の中で使用される。

```html
<ruby>東京<rp>(</rp><rt>とうきょう</rt><rp>)</rp></ruby>
```

上のように、熟語全体に、ひとまとまりのルビを付けることもできる。

### `<s>`
取り消し線を引いた文字列を表示する。`<s>`要素はすでに適切または正確ではなくなった事柄を表現する。しかし、文書の修正を示す場合、`<s>`要素は適切ではない。この場合は`<del>`と`<ins>`の方が適しているので、こちらを使用する。

```html
<p><s>通常価格 1,000円</s> → 今だけ 800円</p>
```

### `<samp>`
コンピュータープログラムからのサンプル出力を表すインライン文字列を含めるために使用される。内容は普通、ブラウザーの既定の等幅フォント(`Courier`や`Lucida Console`など)を使用して表示される。

```html
<p>実行すると、<samp>Hello, World!</samp> と表示される。</p>
```

### `<small>`
表示上のスタイルとは関係なく、著作権表示や法的表記のような、注釈や小さく表示される文を表す。既定では、`small`から`x-small`のように、一段階小さいフォントでテキストが表示される。

```html
<p><small>※ 価格は税込みです。</small></p>
```

短い注釈に使う。長い文章全体を小さくするためには使わず、見た目だけが目的なら、CSS の `font-size` を使う。

### `<span>`
記述コンテンツの汎用的なインラインコンテナーであり、何かを表すものではない。スタイル付けのため(`class`または`id`属性を使用して)、または`lang`のような属性値を共有したりするために要素をグループ化する用途で使用することができる。他に適切な意味的要素がない時にのみ使用する。`<span>`は`<div>`要素ととても似ているが`<div>`がブロックレベル要素であるのに対し、`<span>`はインラインレベル要素。

```html
<p>価格は <span class="price">1,280円</span> です。</p>
```

### `<strong>`
内容の重要性、重大性、または緊急性が高いテキストを表す。ブラウザーは一般的に太字で描画する。

```html
<p><strong>警告:</strong> この操作は、元に戻せません。</p>
```

`<strong>` は、入れ子にすると、重要度がさらに高くなる。文の意味が変わる強調 (声の抑揚) は `<em>` で、重要性は `<strong>` で表す。

### `<sub>`
表記上の理由で下付き文字として表示するべきインライン文字列を指定する。下付き文字は普通、小さめのテキストを使用してベースラインよりも低く表示される。

```html
<p>水は H<sub>2</sub>O、面積は 5m<sup>2</sup>。</p>
```

### `<sup>`
表記上の理由で上付き文字として表示するべきインライン文字列を指定する。上付き文字は普通、小さめのテキストを使用して高いベースラインで表示される。

```html
<p>この仕様は広く使われている<sup><a href="#note1">1</a></sup>。</p>
```

脚注の番号、べき乗 (`m<sup>2</sup>`)、序数 (`1<sup>st</sup>`) などに使う。見た目を上げ下げするだけの目的には使わない。

### `<time>`
特定の時の区間を表す。`datetime`属性を使用して、機械可読な形式の日付を記述することができ、検索エンジンの結果を改善したりリマインダーなどの独自機能に使用したりすることができる。

```html
<time datetime="2024-11-04">2024年11月4日</time>
<time datetime="2024-11-04T08:30:00+09:00">午前8時30分</time>
<time datetime="PT15M">15分</time>
```

`datetime` の書式は、後述の「時刻と経過時間」を参照。

### `<u>`
非言語的に注釈があることを示す方法で表示するインラインテキストの区間を示す。これは既定で単一の実線の下線として表示されるが、CSSを使用して変更することもできる。

```html
<p>I <u>recieve</u> your mail.</p>
```

上のようなスペルミスの指摘などに使う。リンクと間違えやすいので、ただの下線の装飾には使わず、CSS の `text-decoration` を使う。

### `<var>`
数式やプログラムコード内の変数の名前を表す。挙動はブラウザーに依存するが、通常は現在のフォントのイタリック体を使って表示される。

```html
<p>長方形の面積は <var>w</var> × <var>h</var> で求まる。</p>
```

### `<wbr>`
改行可能位置 (Word Break Opportunity)。テキスト内で、ブラウザーが改行してもよい位置を示す。必要がなければ改行されない。長い URL や単語の途中に置くと、狭い画面で、その位置で折り返せる。

```html
<p>https://example.com/<wbr>very-long-path<wbr>/that-is-too-long</p>
```

---

## 画像とマルチメディア <a id="image-multimedia" data-name="画像とマルチメディア"></a>

### `<img>`
文書に画像を埋め込む。

```html
<img src="photo.jpg" alt="海辺で夕日を眺める人" width="800" height="600" loading="lazy">
```

| 属性 | 説明 |
| --- | --- |
| `src` | 画像の URL |
| `alt` | 画像が表示できないときや、スクリーンリーダーが読み上げる代替テキスト。**必ず指定する** |
| `width` / `height` | 画像の幅と高さ (px)。指定しておくと、読み込み前に場所が確保され、レイアウトのずれ (CLS) を防げる |
| `loading` | `lazy` にすると、画面に近づいたときに読み込む (画面の外にある画像向け) |
| `decoding` | 画像のデコード方法 (`async` など) |
| `srcset` / `sizes` | 画面の幅や解像度に合わせて、複数の画像から選ばせる |
| `fetchpriority` | 読み込みの優先度 (`high`、`low`、`auto`)。ファーストビューの主要な画像に `high` を指定する |
| `usemap` | イメージマップ (`<map>`) に関連付ける |

```html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1600.jpg 1600w"
  sizes="(min-width: 768px) 50vw, 100vw"
  alt="海辺で夕日を眺める人">
```

### alt の書き方

| 画像の種類 | alt の書き方 |
| --- | --- |
| 内容を伝える画像 | 内容を、簡潔に説明する (「2024年の売上の推移を示すグラフ」) |
| 装飾の画像 | 空にする (`alt=""`)。スクリーンリーダーが、読み飛ばす |
| リンクの中の画像 | リンク先や、動作を説明する (「ホームへ戻る」) |
| 文字を含む画像 | 画像の中の文字を、そのまま書く |

<pre><code class="caution">alt 属性そのものがないと、スクリーンリーダーは、画像のファイル名を読み上げることがある。
装飾の画像は、alt を省略せずに、alt="" と、空にして書く。
また、ページを開いてすぐ見える大きな画像 (ファーストビュー) に loading="lazy" を付けると、表示が遅くなる。</code></pre>

### `<video>`
文書中に動画再生に対応するメディアプレイヤーを埋め込む。`<video>`を音声コンテンツのために使用することもできるが、`audio`要素の方がユーザーにとって使い勝手が良い。

```html
<video controls width="640" poster="thumbnail.jpg">
  <source src="movie.webm" type="video/webm">
  <source src="movie.mp4" type="video/mp4">
  <track kind="subtitles" src="ja.vtt" srclang="ja" label="日本語" default>
  <p>お使いのブラウザは、動画の再生に対応していません。</p>
</video>
```

| 属性 | 説明 |
| --- | --- |
| `controls` | 再生ボタンなどの操作部品を表示する |
| `autoplay` | 自動で再生する (多くのブラウザは、`muted` がないと自動再生をブロックする) |
| `muted` | 消音にする |
| `loop` | 繰り返し再生する |
| `poster` | 再生前に表示する画像 |
| `preload` | 事前の読み込み方 (`none`、`metadata`、`auto`) |
| `playsinline` | iPhone で、全画面にせず、その場で再生する |

### `<audio>`
文書内に音声コンテンツを埋め込むために使用する。この要素は、1つまたは複数の音源を含むことができる。音源は`src`属性または`<source>`要素を使用して表し、ブラウザーがもっとも適切な音源を選択する。また、`MediaStream`を使用してストリーミングメディアを指し示すこともできる。

```html
<audio controls>
  <source src="sound.ogg" type="audio/ogg">
  <source src="sound.mp3" type="audio/mpeg">
  お使いのブラウザは、音声の再生に対応していません。
</audio>
```

`<video>` と同じく、`controls`、`autoplay`、`loop`、`muted`、`preload` を指定できる (`poster`、`width`、`height` は `<audio>` にはない)。`controls` も `autoplay` もないと、何も表示されない。

### `<track>`
メディア要素(`<audio>`と`<video>`)の子として使用する。この要素は自動的に処理される字幕など、時間指定されたテキストトラック(または時系列データ)を指定することができる。トラックはWebVTT形式(.vtt ファイル)を用いる。

| 属性 | 説明 |
| --- | --- |
| `kind` | トラックの種類 (`subtitles`、`captions`、`descriptions`、`chapters`、`metadata`) |
| `src` | WebVTT ファイルの URL |
| `srclang` | トラックの言語 |
| `label` | ユーザーに表示する名前 |
| `default` | 既定で有効にする |

### `<area>`
イメージマップの中でクリック可能な領域をあらかじめ定義する。イメージマップでは、画像上の幾何学的な領域をハイパーテキストリンクと関連付けすることができる。

| 属性 | 説明 |
| --- | --- |
| `shape` | 領域の形 (`rect`、`circle`、`poly`、`default`) |
| `coords` | 座標 (px)。`rect` は `x1,y1,x2,y2` (左上と右下)、`circle` は `x,y,r` (中心と半径)、`poly` は `x1,y1,x2,y2,...` |
| `href` | リンク先 |
| `alt` | 領域の説明。`href` があるときは必須 |
| `target` | 開く場所 (`<a>` と同じ) |

### `<map>`
`<area>`要素とともに、イメージマップ(クリック可能なリンク領域)を定義するために使用する。

```html
<img src="map.png" alt="日本の地図" usemap="#japan">

<map name="japan">
  <area shape="rect" coords="0,0,100,100" href="/tokyo" alt="東京">
  <area shape="circle" coords="150,50,30" href="/osaka" alt="大阪">
</map>
```

`<img>` の `usemap` に、`#` 付きで `<map>` の `name` を指定して関連付ける。座標は画像のピクセル数で決まるため、画像が拡大縮小される (レスポンシブな) ページには向かない。

---

## 埋め込みコンテンツ <a id="embedded-content" data-name="埋め込みコンテンツ"></a>

### `<iframe>`
入れ子になった閲覧コンテキストを表現し、現在の HTML ページに他のページを埋め込むことができる。

```html
<iframe
  src="https://www.youtube.com/embed/xxxxxxxx"
  title="動画のタイトル"
  width="560" height="315"
  loading="lazy"
  allow="fullscreen"
  referrerpolicy="strict-origin-when-cross-origin"></iframe>
```

| 属性 | 説明 |
| --- | --- |
| `src` | 埋め込むページの URL |
| `title` | 内容を説明する名前。**スクリーンリーダーのために必要** |
| `loading` | `lazy` で、画面に近づいたときに読み込む |
| `sandbox` | 埋め込んだページの権限を制限する (スクリプトの実行、フォーム送信など) |
| `allow` | 使えるブラウザの機能を許可する (`fullscreen`、`camera` など) |
| `referrerpolicy` | Referer ヘッダーの送り方 |

`sandbox` は、値を空にすると、スクリプトの実行、フォーム送信、ポップアップなどを、すべて禁止する。必要な権限だけを、`sandbox="allow-scripts allow-forms"` のように、空白区切りで許可する。同じオリジンの内容に `allow-scripts` と `allow-same-origin` を同時に与えると、埋め込まれた側が sandbox を自分で外せてしまうので、組み合わせない。

`srcdoc` 属性を使うと、URL ではなく、HTML を直接書いて埋め込める。

<pre><code class="caution">信頼できない外部のページを埋め込む場合は、sandbox を指定して、権限を制限する。
また、埋め込み先のサイトが、X-Frame-Options や CSP の frame-ancestors で、埋め込みを禁止している場合は、表示されない。</code></pre>

### `<fencedframe>`
入れ子になった閲覧コンテキストを表す。`<iframe>`と同様だが、より多くのネイティブのプライバシー機能が組み込まれている。

<pre><code class="caution">fencedframe は、プライバシー保護の仕組み (Privacy Sandbox) の中で、主に広告のために設計された実験的な要素。
対応しているブラウザが限られているため、一般的なページの埋め込みには、iframe を使う。</code></pre>

### `<picture>`
0個以上の`<source>`要素と一つの`<img>`要素を含み、様々な画面や端末の条件に応じた画像を提供する。

```html
<picture>
  <!-- 上から順に、条件 (media と type) に合う最初の source が使われる -->
  <!-- 画面幅によって、別の画像を出す (アートディレクション) -->
  <source media="(min-width: 768px)" srcset="photo-wide.avif" type="image/avif">
  <source media="(min-width: 768px)" srcset="photo-wide.webp" type="image/webp">
  <!-- 形式だけで選ぶ -->
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <!-- フォールバック (必須) -->
  <img src="photo.jpg" alt="説明">
</picture>
```

`<source>` は、上から順に調べられ、最初に条件に合ったものが使われる。そのため、条件の厳しいもの (`media` 付き) を、上に書く。形式だけの `<source>` を先に書くと、`media` 付きの `<source>` には、たどり着かない。どれにも合わなければ、`<img>` が使われる。`alt`、`width`、`height`、`loading` は、`<img>` に書く。

### `<source>`
picture 要素、`<audio>`要素、`<video>`要素に対し、複数のメディアリソースを指定する。この要素は空要素であり、つまり中身も閉じタグもない。画像ファイル形式やメディアファイル形式の対応状況が様々であるブラウザーの幅広い互換性を確保するために、同じメディアコンテンツを複数のファイル形式で提供することはよくある。

| 属性 | 説明 |
| --- | --- |
| `src` | メディアの URL (`<audio>`、`<video>` 内) |
| `srcset` | 画像の URL (`<picture>` 内) |
| `type` | ファイルの形式 (MIME タイプ)。ブラウザが、対応していない形式の読み込みを省略できる |
| `media` | 適用する条件 (メディアクエリ) |

### `<embed>`
外部のコンテンツを文書中の指定された場所に埋め込む。コンテンツは外部アプリケーションや、対話型コンテンツの他の出所(ブラウザーのプラグインなど)によって提供される。

```html
<embed src="document.pdf" type="application/pdf" width="600" height="400">
```

空要素で、中に代替コンテンツを書けない。

<pre><code class="tips">embed と object は、ブラウザのプラグイン (Flash など) のための要素だった。プラグインが廃止された現在は、ほとんど使われない。
画像は img、動画は video、音声は audio、他のページは iframe を使う。</code></pre>

### `<object>`
画像、内部の閲覧コンテキスト、プラグインによって扱われるリソースなどのように扱われる外部リソースを表す。

```html
<object data="document.pdf" type="application/pdf" width="600" height="400">
  <a href="document.pdf">PDF をダウンロードする</a>
</object>
```

`data` に URL、`type` に MIME タイプを指定する。埋め込めなかったときは、中に書いた内容が代わりに表示される (フォールバック)。

---

## SVGとMathML <a id="svg-mathml" data-name="SVGとMathML"></a>


### `<svg>`
新しい座標系とビューポートを定義するコンテナー。これはSVG文書の最も外側の要素として使用されるが、SVGまたはHTML文書の中にSVGフラグメントを埋め込むためにも使用できる。

```html
<svg width="100" height="100" viewBox="0 0 100 100" role="img" aria-label="赤い円">
  <circle cx="50" cy="50" r="40" fill="red" />
</svg>
```

HTML の中に直接書くと、CSS や JavaScript で操作できる。単に表示するだけなら、`<img src="icon.svg" alt="...">` でもよい。

HTML に直接書くときは、`xmlns` 属性は不要。`viewBox` を指定すると、表示の大きさに合わせて拡大縮小できる (大きさは、CSS の `width` と `height` で指定する)。意味のある図には、`role="img"` と `aria-label` (または、子の `<title>`) で名前を付け、装飾なら `aria-hidden="true"` にする。

### `<math>`
MathMLにおける最上位の要素。すべての有効なMathMLのインスタンスを囲む。加えて、`<math>`要素を入れ子状に配置してはならないが、中にその他の子要素をいくつでも持つことができる。

```html
<math>
  <mfrac>
    <mn>1</mn>
    <mn>2</mn>
  </mfrac>
</math>
```

---

## スクリプト <a id="script" data-name="スクリプト"></a>

### `<script>`
実行できるコードやデータを埋め込むために使用する。ふつうは JavaScript のコードの埋め込みや参照に使用される。`<script>`要素はWebGLのGLSL shaderプログラミング言語、JSON等の他の言語にも使用することができる。

```html
<!-- 外部ファイル (HTMLの解析後に実行) -->
<script src="app.js" defer></script>

<!-- ES モジュール (defer と同じく、解析後に実行される) -->
<script type="module" src="main.js"></script>

<!-- インライン -->
<script>
  console.log('hello');
</script>
```

| 属性 | 動作 |
| --- | --- |
| (なし) | 読み込みと実行の間、HTML の解析が止まる |
| `defer` | 解析と並行して読み込み、**解析の完了後に、書いた順に**実行する |
| `async` | 並行して読み込み、**読み込みが終わった順に**、すぐ実行する (実行順は不定) |
| `type="module"` | ES モジュールとして扱う。`defer` と同様に、遅れて実行される |
| `integrity` | ファイルが改ざんされていないか確認するためのハッシュ (SRI)。`crossorigin` と一緒に使う |

<pre><code class="tips">通常のスクリプトは、defer を付けて、&lt;head&gt; に書くか、&lt;/body&gt; の直前に置く。
他のスクリプトに依存しない、計測タグなどには async を使う。</code></pre>

### `<noscript>`
このページ上のスクリプトの種類に対応していない場合や、スクリプトの実行がブラウザーで無効にされている場合に表示するHTMLの部分を定義する。

```html
<noscript>
  <p>このページを使うには、JavaScript を有効にしてください。</p>
</noscript>
```

`<head>` の中に置くときは、`<link>`、`<style>`、`<meta>` だけを入れられる。

### `<canvas>`
CanvasスクリプティングAPIやWebGLAPIを使用して、グラフィックやアニメーションを描画することができるコンテナー要素。

```html
<canvas id="c" width="200" height="100">
  canvas に対応していない場合の、代替コンテンツ
</canvas>

<script>
  const ctx = document.getElementById('c').getContext('2d');
  ctx.fillStyle = 'tomato';
  ctx.fillRect(10, 10, 100, 50);
</script>
```

<pre><code class="caution">canvas に描いた内容は、画像のようなもので、DOM の要素ではないため、スクリーンリーダーや検索エンジンには伝わらない。
大事な内容は、canvas の中身 (代替コンテンツ) や aria-label で、文章でも用意する。
また、width と height 属性は描画領域の大きさで、CSS だけで拡大縮小すると、ぼやける。</code></pre>

---

## 編集範囲の特定 <a id="edited" data-name="編集範囲の特定"></a>

### `<del>`
文書から削除された文字列の範囲を表す。これは例えば、変更の追跡や、ソースコードの差分情報を描画するときに使用することができる。`<ins>`要素は逆の目的に、文書に追加された文字列を示すために用いることができる。

```html
<p>価格は <del datetime="2024-11-01">1,000円</del> <ins datetime="2024-11-01">800円</ins> です。</p>
```

`cite` 属性で変更の理由の URL を、`datetime` 属性で変更日時を指定できる。

### `<ins>`
文書に追加されたテキストの範囲を表す。同様に、`<del>`要素を使用して文書から削除されたテキストの範囲を表すことができる。

`<del>` と同様に、`cite` 属性で変更の理由の URL を、`datetime` 属性で変更日時を指定できる。`<del>` と `<ins>` は、段落などのブロック全体を囲むこともできる。

---

## テーブル <a id="table-section" data-name="テーブル"></a>

### `<table>` 
表形式のデータ、つまり、行と列の組み合わせによるセルに含まれたデータによる二次元の表で表現される情報。

```html
<table>
  <caption>2024年の売上</caption>
  <thead>
    <tr>
      <th scope="col">月</th>
      <th scope="col">売上</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1月</th>
      <td>100</td>
    </tr>
    <tr>
      <th scope="row">2月</th>
      <td>120</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">合計</th>
      <td>220</td>
    </tr>
  </tfoot>
</table>
```

| 属性 | 要素 | 説明 |
| --- | --- | --- |
| `colspan` | `<td>`、`<th>` | 横に、何列分のセルにするか |
| `rowspan` | `<td>`、`<th>` | 縦に、何行分のセルにするか |
| `scope` | `<th>` | 見出しが、列 (`col`) と行 (`row`) のどちらの見出しか |
| `headers` | `<td>` | 複雑な表で、関連する見出しの `id` を指定する |

```html
<tr>
  <td colspan="2">2列分のセル</td>
</tr>
```

<pre><code class="caution">table は、表形式のデータを表すための要素で、ページのレイアウトには使わない。
レイアウトは、CSS の Flexbox や Grid で行う。</code></pre>

### `<caption>`
表のキャプション(またはタイトル)を指定する。

`<table>` の最初の子として置く。既定では、表の上に表示される (`caption-side` で下にもできる)。スクリーンリーダーが、表の名前として読み上げる。表のすぐ前に見出しを書くより、`<caption>` を使う方が、表と名前が結びつく。

### `<th>`
`<tr>`要素の子要素であり、表セルのグループの見出しとしてセルを定義する。このグループの性質は、`scope`および`headers`属性によって明示的に定義することができる。

`scope` には、`col` (列の見出し)、`row` (行の見出し)、`colgroup`、`rowgroup` を指定する。見出しが長いときは、`abbr` 属性に、短い名前を指定できる。太字にした `<td>` で、見出しを代用しない。

### `<tr>`
表内でセルの行を定義する。行のセルには`<td>`(データセル)および`<th>`(見出しセル)要素を混在させることができる。

`<tr>` の直接の子は、`<td>` と `<th>` だけ。`<table>`、`<thead>`、`<tbody>`、`<tfoot>` の子として置く。

### `<td>`
`<tr>`要素の子要素であり、表のデータを含むセルを定義する。

`colspan`、`rowspan`、`headers` 属性を指定できる。数値の列は、CSS の `text-align: right` で右寄せにすると、読みやすい。

### `<colgroup>`
表内の列のグループを定義する。

```html
<table>
  <caption>2024年の売上</caption>
  <colgroup>
    <col>
    <col span="2" class="highlight">
  </colgroup>
  <tr>...</tr>
</table>
```

列ごとにスタイルを付けるために使う (セルごとに `class` を付けなくてよい)。`<caption>` の後、`<thead>` の前に書く。

### `<col>`
暗黙的または明示的な親`<colgroup>`要素によって表される列グループ内の1つ以上の列を定義する。`<col>`要素は、`<span>`属性が定義されていない`<colgroup>`要素の子としてのみ有効。

`span` 属性で、複数の列に、同じ指定ができる。`<col>` に指定して効果がある CSS は、`border`、`background`、`width`、`visibility` に限られる。

### `<thead>` {#thead-section}
表の一連の行(`<tr>`要素)をまとめ、表の列に関する情報を含む表の見出しであることを示す。これは通常、列見出し(`<th>`要素)という形で形成される。

中には `<tr>` を置き、各セルは `<th>` で書く。印刷するときに、表がページをまたぐと、各ページに繰り返される場合がある。

### `<tbody>`
表の一連の行(`<tr>`要素)をまとめ、表の(メイン)データの本体部分を構成することを表す。

1つの `<table>` に、複数の `<tbody>` を置いて、データをグループに分けられる。省略しても、ブラウザが自動で補う。

### `<tfoot>`
表の一連の行(`<tr>`要素)をまとめ、表の列に関する情報を含む表の脚部であることを示す。これは通常、列の集計行、例えば、列に指定された数値の合計など。

`<tbody>` の後に書く。1つの `<table>` に、1つまで。

---

## フォーム <a id="form" data-name="フォーム"></a>

### `<form>`
ウェブサーバーに情報を送信するための対話型コントロールを含む文書の区間を表す。

```html
<form action="/submit" method="post">
  <label for="name">名前</label>
  <input type="text" id="name" name="name" required>

  <label for="email">メールアドレス</label>
  <input type="email" id="email" name="email" required>

  <button type="submit">送信</button>
</form>
```

| メソッド | 動作 | 用途 |
| --- | --- | --- |
| GET | データを URL (クエリ文字列) に付けて送る。URL に残る | 検索、絞り込み (何度送っても、結果が変わらないもの) |
| POST | データをリクエストの本体に入れて送る | 登録、ログイン、更新 (データが変わるもの) |

#### フォームで重要な属性

| 属性 | 付ける要素 | 役割 |
| --- | --- | --- |
| action | form | 送信先のURL (省略すると、現在のページ) |
| method | form | GET/POST (`dialog` は、`<dialog>` を閉じるときに使う) |
| enctype | form | データの送信形式。ファイルを送るときは `multipart/form-data` |
| novalidate | form | ブラウザの入力チェックを無効にする |
| autocomplete | form、input など | ブラウザの自動入力を、オン・オフする |
| id | 全部 | label/JS/CSS用 |
| name | input など | サーバーに送るデータのキー(key)。**name がないと、送信されない** |
| value | input など | サーバーに送るデータ(value) |

フォーム部品 (`<input>`、`<button>` など) は、`form` 属性に `<form>` の `id` を指定すると、`<form>` の外に置いても、そのフォームの一部として送信される。

### `<input>`
ユーザーからデータを受け取るための、ウェブベースのフォーム用の操作可能なコントロールを作成するために使用する。端末とユーザーエージェントによるが、広範に渡る種類のデータ入力やコントロールウィジェットが利用できる。`<input>`要素は入力型と属性の組み合わせの数が非常に多いため、HTMLの中で最も強力かつ最も複雑な要素の一つ。

### type の種類

| type | 用途 |
| --- | --- |
| `text` | 1行のテキスト (既定) |
| `password` | パスワード (入力が伏せ字になる) |
| `email` | メールアドレス (形式のチェックと、メール用のキーボード) |
| `url` | URL |
| `tel` | 電話番号 (チェックはされないが、数字用のキーボード) |
| `search` | 検索キーワード |
| `number` | 数値 (`min`、`max`、`step` を指定できる) |
| `range` | スライダー |
| `date` / `time` / `datetime-local` / `month` / `week` | 日付や時刻 |
| `color` | 色の選択 |
| `checkbox` | チェックボックス (複数選択) |
| `radio` | ラジオボタン (同じ `name` の中から1つ選択) |
| `file` | ファイルの選択 |
| `hidden` | 画面に表示しない値 |
| `submit` / `reset` / `button` | ボタン (`<button>` が推奨) |

### 共通の属性

| 属性 | 説明 |
| --- | --- |
| `name` | 送信するデータの名前 |
| `value` | 値 (初期値) |
| `placeholder` | 入力例などの、薄く表示されるヒント (ラベルの代わりにはならない) |
| `required` | 必須にする |
| `disabled` | 無効にする (送信もされない) |
| `readonly` | 読み取り専用にする (送信はされる) |
| `min` / `max` / `step` | 数値や日付の、範囲と刻み |
| `minlength` / `maxlength` | 文字数の範囲 |
| `pattern` | 正規表現による形式のチェック |
| `multiple` | 複数の値を許可する (`file`、`email`) |
| `accept` | 選べるファイルの種類 (`accept="image/*"`) |
| `autocomplete` | 自動入力のヒント |
| `autofocus` | ページを開いたときに、フォーカスを当てる |
| `inputmode` | ソフトウェアキーボードの種類 |

```html
<input type="number" name="age" min="0" max="120" required>
<input type="text" name="zip" pattern="[0-9]{3}-[0-9]{4}" placeholder="123-4567">
<input type="file" name="photo" accept="image/*">
```

### checkbox と radio

```html
<!-- チェックボックス: 同じ name で、複数を選べる -->
<label><input type="checkbox" name="fruit" value="apple"> りんご</label>
<label><input type="checkbox" name="fruit" value="orange" checked> みかん</label>

<!-- ラジオボタン: 同じ name の中から、1つだけ選べる -->
<label><input type="radio" name="size" value="s"> S</label>
<label><input type="radio" name="size" value="m" checked> M</label>
```

### autocomplete の値

自動入力のヒントを正しく指定すると、ブラウザが適切な情報を入力してくれる。

| 値 | 内容 |
| --- | --- |
| `name` / `given-name` / `family-name` | 氏名 / 名 / 姓 |
| `email` | メールアドレス |
| `tel` | 電話番号 |
| `username` | ユーザー名 |
| `current-password` | 今のパスワード (ログイン) |
| `new-password` | 新しいパスワード (登録) |
| `one-time-code` | ワンタイムコード (SMS の認証コードなど) |
| `postal-code` | 郵便番号 |
| `street-address` | 住所 |

<pre><code class="tips">type="number" は、数値を計算するための入力で、郵便番号や電話番号には向かない (先頭の 0 が消える、矢印で値が変わる)。
そのような入力は、type="text" に、inputmode="numeric" を組み合わせる。</code></pre>

### 入力チェック (バリデーション)

ブラウザには、送信するときに、入力を確認する機能がある。エラーがあると、送信は止まり、メッセージが表示される。

| 方法 | 例 |
| --- | --- |
| 必須にする | `required` |
| 形式を決める | `type="email"`、`type="url"`、`pattern="[0-9]{3}-[0-9]{4}"` |
| 範囲を決める | `min`、`max`、`minlength`、`maxlength` |
| チェックを無効にする | `<form novalidate>`、`<button formnovalidate>` |

CSS の `:invalid` と `:valid` で、見た目を変えられる。入力の途中から赤くなるのが気になるときは、操作した後だけに適用される `:user-invalid` を使う。

<pre><code class="caution">ブラウザの入力チェックは、利用者の入力ミスを減らすための補助で、安全のための仕組みではない。
開発者ツールなどで簡単に回避できるので、サーバー側でも、必ず検証する。</code></pre>

### `<textarea>`
複数行のプレーンテキスト編集コントロールを表し、レビューのコメントやお問い合わせフォーム等のように、ユーザーが大量の自由記述テキストを入力できるようにするときに便利。

```html
<textarea name="message" rows="5" cols="40" maxlength="500" placeholder="内容を入力"></textarea>
```

`rows` と `cols` で大きさを指定する (CSS の `width` と `height` でも指定できる)。

初期値は、開始タグと終了タグの間に書く (`<textarea name="message">初期値</textarea>`)。`value` 属性は使えない。`readonly`、`disabled`、`required`、`maxlength` などは、`<input>` と同じように使える。

### `<button>`
ユーザーがマウス、キーボード、指、音声コマンド、または他にも支援技術を使って起動するインタラクティブ要素。アクティブになると、フォームを送信したり、ダイアログを開いたりするなどのアクションを実行できる。

| type | 動作 |
| --- | --- |
| `submit` | フォームを送信する (**`<form>` 内では、これが既定**) |
| `button` | 何もしない (JavaScript で動作を付ける) |
| `reset` | フォームの入力を、初期値に戻す |

<pre><code class="caution">form の中の button は、type を書かないと、submit になる。
送信以外の動作 (開閉など) のボタンには、type="button" を指定する。</code></pre>

`<button>` は、中に画像や `<strong>` などを入れられる (`<input type="button">` は、文字だけ)。`name` と `value` を指定すると、押したボタンが、送信データに含まれる。`formaction` や `formmethod` で、ボタンごとに、送信先や方法を変えられる。`disabled` にすると、押せなくなり、送信データにも含まれない。

### `<option>`
`<select>`要素、`<optgroup>`要素、`<datalist>`要素内で項目を定義するために使われる。したがって、`<option>`はHTML文書でポップアップメニューのメニュー項目や、その他の項目の一覧を表すことができる。

| 属性 | 説明 |
| --- | --- |
| `value` | 送信される値 (省略すると、表示される文字) |
| `selected` | 最初から、選ばれた状態にする |
| `disabled` | 選べなくする |
| `label` | 表示する文字 (省略すると、`<option>` の中の文字) |

### `<select>`
選択式のメニューを提供するコントロールを表す。

```html
<label for="pref">都道府県</label>
<select id="pref" name="pref">
  <option value="">選択してください</option>
  <optgroup label="関東">
    <option value="tokyo">東京</option>
    <option value="kanagawa" selected>神奈川</option>
  </optgroup>
  <optgroup label="関西">
    <option value="osaka">大阪</option>
  </optgroup>
</select>
```

`<select multiple>` で、複数選択になる。`<option>` の `value` が、送信される値になる (省略すると、表示されている文字が送信される)。 `size` で表示する行数を指定すると、プルダウンではなく、リストボックスの形になる。

### `<optgroup>`
`<select>`要素内の選択肢(`<option>`)のグループを作成する。

`label` 属性が必須で、グループの名前になる。`disabled` を付けると、グループ内の選択肢が、すべて選べなくなる。入れ子にはできない。

### `<datalist>`
他のコントロールで利用可能な値を表現する一連の`<option>`要素を含む。

```html
<label for="browser">ブラウザ</label>
<input list="browsers" id="browser" name="browser">

<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
</datalist>
```

候補から選ぶこともでき、自由に入力することもできる。

### `<fieldset>`
ウェブフォーム内の、複数のコントロールやラベル(`<label>`)をグループ化するために使用する。

```html
<fieldset>
  <legend>配送方法</legend>
  <label><input type="radio" name="delivery" value="normal"> 通常便</label>
  <label><input type="radio" name="delivery" value="express"> お急ぎ便</label>
</fieldset>
```

`<fieldset disabled>` にすると、中のすべてのコントロールが、無効になる。

### `<legend>`
その親要素である`<fieldset>`の内容のキャプションを表す。

`<fieldset>` の最初の子として置く。ラジオボタンやチェックボックスのグループでは、スクリーンリーダーが、各項目の前に `<legend>` の内容 (質問文など) を読み上げるため、特に重要。

### `<label>`
ユーザーインターフェイスの項目のキャプションを表す。

```html
<!-- for と id で関連付ける -->
<label for="email">メールアドレス</label>
<input type="email" id="email" name="email">

<!-- label の中に入れる (for と id は不要) -->
<label>
  メールアドレス
  <input type="email" name="email">
</label>
```

`<label>` をクリックすると、関連付けられたコントロールにフォーカスが移る (チェックボックスなら、切り替わる)。<br>
スクリーンリーダーが、入力欄の内容を読み上げるためにも、必要。

<pre><code class="caution">placeholder は、入力を始めると消えるため、label の代わりにはならない。
すべての入力欄に、label を付ける。</code></pre>

### `<meter>`
既知の範囲内のスカラー値、または小数値を表す。

```html
<label for="disk">ディスク使用量</label>
<meter id="disk" min="0" max="100" low="50" high="80" optimum="20" value="70">70%</meter>
```

`low`、`high`、`optimum` で、値の良し悪しの範囲を指定すると、値に応じて色が変わる。

### `<output>`
サイトやアプリが計算結果やユーザー操作の結果を挿入することができるコンテナー要素。

```html
<form oninput="total.value = Number(a.value) + Number(b.value)">
  <input type="number" id="a" value="1"> +
  <input type="number" id="b" value="2"> =
  <output name="total" for="a b">3</output>
</form>
```

### `<progress>`
タスクの進捗状況を表示する。プログレスバーとしてよく表示される。

```html
<label for="file">アップロード</label>
<progress id="file" max="100" value="70">70%</progress>
```

`value` を省略すると、完了時間が分からない処理中の状態 (インジケーター) として表示される。

---

## インタラクティブ <a id="interactive" data-name="インタラクティブ"></a>

### `<details>`
ウィジェットが「開いた」状態になった時のみ情報が表示される折りたたみウィジェットを作成する。概要やラベルは`<summary>`要素を使用して提供する必要がある。

```html
<details>
  <summary>詳細を見る</summary>
  <p>折りたたまれていた内容。</p>
</details>

<!-- 最初から開いておく -->
<details open>
  <summary>最初から開いている</summary>
  <p>内容</p>
</details>
```

同じ `name` 属性を付けた `<details>` は、同時に1つだけ開く (アコーディオン)。

```html
<details name="faq">
  <summary>質問1</summary>
  <p>回答1</p>
</details>
<details name="faq">
  <summary>質問2</summary>
  <p>回答2</p>
</details>
```

### `<summary>`
`<details>`要素の折り畳みボックスの要約、キャプション、説明、凡例を表す。`<summary>`要素をクリックすると、親の`<details>`要素の開閉状態を切り替えることができる。

`<details>` の最初の子として置く。キーボードの Enter キーや Space キーでも開閉できる。三角形のマーカーは、CSS の `list-style` や `::marker` で変えられる。

### `<dialog>`
ダイアログボックスや、消すことができるアラート、インスペクター、サブウィンドウ等のような対話的コンポーネントを表す。

```html
<dialog id="dlg">
  <p>ダイアログの内容</p>
  <form method="dialog">
    <button>閉じる</button>
  </form>
</dialog>

<button id="open">開く</button>

<script>
  const dlg = document.getElementById('dlg');
  document.getElementById('open').addEventListener('click', () => {
    dlg.showModal(); // モーダルで開く (背景は操作できなくなる)
  });
</script>
```

| メソッド | 動作 |
| --- | --- |
| `showModal()` | モーダルとして開く。背景に、`::backdrop` が表示され、Esc キーで閉じられる |
| `show()` | モーダルではなく、通常のダイアログとして開く |
| `close()` | 閉じる |

`<form method="dialog">` の中のボタンを押すと、JavaScript なしで、ダイアログを閉じられる。

`open` 属性を直接付けると、ダイアログは開くが、モーダルにはならない (背景を操作でき、Esc キーでも閉じない)。モーダルにしたいときは、`showModal()` を使う。閉じるときには、`close` イベントが発生する。

### popover 属性

`popover` 属性を付けた要素を、ボタンで開閉できる (ポップアップ、メニュー、ツールチップなど)。

```html
<button popovertarget="menu">メニュー</button>

<div id="menu" popover>
  <p>ポップオーバーの内容</p>
</div>
```

| 値 | 動作 |
| --- | --- |
| `popover` (または `auto`) | 外側をクリックしたり、Esc キーを押したりすると、閉じる |
| `popover="manual"` | 自分で閉じるまで、開いたまま |

---

## ウェブコンポーネント <a id="web-components" data-name="ウェブコンポーネント"></a>

### `<slot>`
ウェブコンポーネント 技術群の一部であるこの要素は、ウェブコンポーネント内のプレースホルダーで、自分自身でマークアップを埋めることができ、別個のDOMツリーを作成して一緒に表示することができる。

`name` 属性で、スロットに名前を付ける。名前のないスロットは、デフォルトのスロットで、`slot` 属性のない子要素が入る。スロットの中身は、差し込まれる要素がないときの、代替コンテンツになる。

```html
<!-- シャドウツリーの中 -->
<slot name="title">タイトル (代替)</slot>
<slot>本文 (代替)</slot>

<!-- 使う側 -->
<my-card>
  <span slot="title">こんにちは</span>
  <p>本文</p>
</my-card>
```

### `<template>`
ページが読み込まれたときにすぐにレンダリングされるのではなく、実行時にJavaScriptを使って後からインスタンス化することができるHTMLを保持するためのメカニズム。

中身は、画面に表示されず、画像も読み込まれず、スクリプトも実行されない。JavaScript で `template.content` を `cloneNode(true)` で複製して、文書に挿入したときに、はじめて有効になる。繰り返し使う HTML (一覧の行、カードなど) の雛形に使える。

```html
<template id="my-card">
  <style>p { color: blue; }</style>
  <p><slot name="title">タイトル</slot></p>
</template>

<my-card><span slot="title">こんにちは</span></my-card>

<script>
  customElements.define('my-card', class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.append(document.getElementById('my-card').content.cloneNode(true));
    }
  });
</script>
```

---

## グローバル属性 <a id="global-attributes" data-name="グローバル属性"></a>

<table>
    <tr><th>属性名</th><th>値</th></tr>
    <tr><td>accesskey</td><td>キーボード操作によって要素にフォーカスを当てたり、アクティブにするためのショートカットを指定する。<br>
値はUnicode1文字で指定して、ショートカットを使用するときは<b>指定したキーと修飾キー</b>を押す (修飾キーはブラウザやOSで異なり、WindowsのChromeではAlt、FirefoxではAlt + Shift、MacではControl + Optionなど)<br>

<span class="code-like">&lt;label&gt;Search: &lt;input type="search" name="q" accesskey="s"&gt;&lt;/label&gt;</span>

</td></tr>
    <tr><td>autocapitalize</td><td>ユーザーによってテキストが入力、編集された時に、入力文字列の先頭文字を大文字化するか、またどのように実行されるかを指定できる</td></tr>
    <tr><td>autofocus</td><td>文書が読み込まれた時やダイアログが表示された時に、指定した要素がフォーカスを持つべきであることを表す<br>
    文書内(ダイアログの中では、ダイアログ内)に1つだけ指定できる</td></tr>
    <tr><td>class</td><td>要素にクラス名を付与する。空白文字によって複数指定可能<br>
    またHTMLの仕様において注意書きを赤い文字にするために"red"とするよりも、"attention"のように意味を表すほうが妥当とされている</td></tr>
    <tr><td>id</td><td>要素に一意な識別子を指定する。付与した識別子は、CSSセレクターや、リンクのフラグメント識別子として利用できる<br>また一意な識別子であるため、同一文書内に同じid識別子を持つ要素が存在してはならない</td></tr>
    <tr><td>contenteditable</td><td>要素内の編集の可否を指定する。指定できる値は以下の通り (属性がない場合や、不正な値の場合は、親要素の設定を継承する)
        <table>
            <tr>
                <td>true</td>
                <td>編集可能</td>
            </tr>
            <tr>
                <td>false</td>
                <td>編集不可</td>
            </tr>
            <tr>
                <td>空文字列</td>
                <td>trueと同じ (編集可能)</td>
            </tr>
            <tr>
                <td>plaintext-only</td>
                <td>プレーンテキストとしてのみ編集できる (書式の変更はできない)</td>
            </tr>
        </table></td></tr>
    <tr><td>dir</td><td>要素内のテキストの書字方向を指定する</td></tr>
    <tr><td>draggable</td><td>要素がドラッグ可能かどうかを指定する。指定できる値は以下の通り
        <table>
            <tr>
                <td>true</td>
                <td>ドラッグ可能</td>
            </tr>
            <tr>
                <td>false</td>
                <td>ドラッグ不可</td>
            </tr>
            <tr>
                <td>空白文字</td>
                <td>autoとして扱われ、ブラウザの設定が反映される</td>
            </tr>
        </table></td></tr>
    <tr><td>enterkeyhint</td><td>ソフトウェアキーボードのEnterキーに表示するアクションラベル、またはアイコンを指定する。指定できる値は以下の通り
        <table>
            <tr>
                <td>enter</td>
                <td>改行する</td>
            </tr>
            <tr>
                <td>done</td>
                <td>入力完了する</td>
            </tr>
            <tr>
                <td>go</td>
                <td>進む</td>
            </tr>
            <tr>
                <td>next</td>
                <td>入力していたフィールドの次のフィールドに移動する</td>
            </tr>
            <tr>
                <td>previous</td>
                <td>入力していたフィールドの前のフィールドに移動する</td>
            </tr>
            <tr>
                <td>search</td>
                <td>検索結果を表示する</td>
            </tr>
            <tr>
                <td>send</td>
                <td>入力内容を送信する</td>
            </tr>
        </table></td></tr>
    <tr><td>hidden</td><td>要素の表示状態、また要素の操作の可否を指定する。指定できる値は以下の通り
        <table>
            <tr>
                <td>hidden</td>
                <td>要素が非表示となり操作や検索ができない状態。ただし、DOMには存在していることには注意が必要</td>
            </tr>
            <tr>
                <td>until-found</td>
                <td>ページ内検索やフラグメント識別子付きのURLなどでアクセスがあるまでは非表示で操作ができない<br>実験的な機能であり、全てのブラウザでサポートされているわけではない
                </td>
            </tr>
        </table></td></tr>
    <tr><td>inert</td><td>この属性が指定された要素、および子孫要素をブラウザが不活性化することを指定する論理属性<br>
    不活性化とは、ボタンで言えばクリック、入力コントロールであれば入力などの操作ができないことを表す</td></tr>
    <tr><td>inputmode</td><td>ソフトウェアキーボードの挙動を制御する。指定できる値は以下の通り
        <table>
            <tr>
                <td>none</td>
                <td>ソフトウェアキーボードを非表示にする</td>
            </tr>
            <tr>
                <td>text</td>
                <td>ユーザーの国や地域に合わせたソフトウェアキーボードを表示する</td>
            </tr>
            <tr>
                <td>tel</td>
                <td>電話番号の入力に適した、テンキー形式のソフトウェアキーボードを表示する</td>
            </tr>
            <tr>
                <td>url</td>
                <td>URLの入力に適した(「/」や「.」が入力しやすい)ソフトウェアキーボードを表示する</td>
            </tr>
            <tr>
                <td>email</td>
                <td>ユーザーの国や地域に合わせたテキスト入力が可能、かつemailアドレスの入力を補助するソフトウェアキーボードを表示する</td>
            </tr>
            <tr>
                <td>numeric</td>
                <td>数字入力が可能なソフトウェアキーボードを表示する</td>
            </tr>
            <tr>
                <td>decimal</td>
                <td>ユーザーの国や地域に合わせた数値や区切り文字とともに、小数入力が可能なソフトウェアキーボードを表示する</td>
            </tr>
            <tr>
                <td>search</td>
                <td>検索に最適化されたソフトウェアキーボードを表示する</td>
            </tr>
        </table></td></tr>
    <tr><td>is</td><td>カスタマイズされた組み込み要素を定義し、そのカスタム要素名を関連付けて利用できる</td></tr>
    <tr><td>itemscope</td><td>関連付けられたメタデータのスコープを定義する<br>
    itemtype、itemid、itemref属性は、itemscope属性を持つ要素にだけ指定できる</td></tr>
    <tr><td>itemtype</td><td>使用されるプロパティの語彙を定義するURLを指定する</td></tr>
    <tr><td>itemref</td><td>何らかの理由でitemscope属性を持つ要素の子孫以外と関連付けたい場合、関連付けたい要素が持つidをitemrefに指定することで関連付けられる<br>
    itemrefはitemscopeが付与された要素に対してのみ使用可能</td></tr>
    <tr><td>itemid</td><td>itemscope属性、およびitemtype属性を持つ要素に対してグローバル識別子を付与する</td></tr>
    <tr><td>itemprop</td><td>要素にプロパティを追加することにより、データをより構造化することができる<br>
    プロパティとは名前と値を組み合わせたもので、itemprop属性を追加した要素は、属性名が名前、要素の内容が値としてプロパティとなる</td></tr>
    <tr><td>lang</td><td>要素の内容がどのような言語で記述されているかを表す</td></tr>
    <tr><td>nonce</td><td>文書内に読み込まれたscript要素やstyle要素を実行するかを決定するために利用されるワンタイムトークンを指定する</td></tr>
    <tr><td>slot</td><td>shadowツリー内のスロットをこの属性が付与された要素に割り当てる</td></tr>
    <tr><td>spellcheck</td><td>スペルチェックの有無を指定する。指定できる値は以下の通り
        <table>
            <tr>
                <td>true</td>
                <td>スペルチェックを行う</td>
            </tr>
            <tr>
                <td>false</td>
                <td>スペルチェックを行わない</td>
            </tr>
            <tr>
                <td>空文字列</td>
                <td>trueとして扱われる</td>
            </tr>
        </table>
        ただし、スペルチェック後の挙動については定義されていないため、ブラウザがどのような挙動をするかは規定がない</td></tr>
    <tr><td>style</td><td>要素に対して直接スタイルを指定する</td></tr>
    <tr><td>tabindex</td><td>tabキーなどのキーボード操作によるフォーカス移動の相対的な順序を指定する。指定する値は整数である必要がある
        <table>
            <tr>
                <td>-1</td>
                <td>クリックによるフォーカスは可能。キーボード操作によるフォーカスの移動の対象から除外される</td>
            </tr>
            <tr>
                <td>0</td>
                <td>キーボード操作によるフォーカス移動の対象となり、その移動順序は、文書内における要素の出現順により決定される</td>
            </tr>
            <tr>
                <td>1以上の正の整数</td>
                <td>キーボード操作によるフォーカス移動の対象となり、その移動順序は、数値の小さい順となる</td>
            </tr>
        </table>
        ただし、文書内における要素の順序が変わった場合のフォーカスの移動が不適当となるため、正の整数値の使用は避けるべきであるといえる</td></tr>
    <tr><td>title</td><td>ツールチップとして適切となるような補足情報を付与する</td></tr>
    <tr><td>translate</td><td>要素の翻訳の可否を指定する<br>
    特定のサービス名やソースコードなど、機械翻訳された場合に意味が通らなくなるような部分に指定する。指定できる値は以下の通り
        <table>
            <tr>
                <td>yes</td>
                <td>機械翻訳の対象となる</td>
            </tr>
            <tr>
                <td>no</td>
                <td>機械翻訳の対象外となる</td>
            </tr>
            <tr>
                <td>空文字列</td>
                <td>yesとして扱われる</td>
            </tr>
        </table></td></tr>
    <tr><td>popover</td><td>要素を、ボタンなどで開閉できるポップオーバー(ポップアップ、メニュー、ツールチップなど)にする。<br>
    値は、空(または<span class="code-like">auto</span>)で、外側のクリックやEscキーで閉じる。<span class="code-like">manual</span>は、自分で閉じるまで開いたまま<br>
    開閉するボタンには、<span class="code-like">popovertarget</span>属性で、対象の要素のidを指定する
        <pre><code class="example">&lt;button popovertarget="menu"&gt;メニュー&lt;/button&gt;
&lt;div id="menu" popover&gt;ポップオーバーの内容&lt;/div&gt;</code></pre></td></tr>
    <tr><td>role</td><td>要素の役割を、支援技術(スクリーンリーダーなど)に伝える(WAI-ARIA)。<br>
    適切なHTML要素があれば、<span class="code-like">role</span>を付けるよりも、その要素を使う方がよい(<span class="code-like">&lt;button&gt;</span>があるのに<span class="code-like">&lt;div role="button"&gt;</span>としない)</td></tr>
    <tr><td>aria-*</td><td>要素の状態や、名前、関係を、支援技術に伝える属性(WAI-ARIA)<br>
    例えば、<span class="code-like">aria-label</span>(名前)、<span class="code-like">aria-expanded</span>(開閉の状態)、<span class="code-like">aria-hidden</span>(支援技術から隠す)など</td></tr>
    <tr><td>part</td><td>シャドウツリー内の要素に名前を付けて、外側のCSSから、<span class="code-like">::part()</span>で、スタイルを指定できるようにする</td></tr>
    <tr><td>カスタムデータ</td><td>data-で始まる属性で、独自に定義することができ、それをJavaScriptなどで使用できる。<br>
    属性名にはASCII大文字を含んではならない。
        <pre><code class="example">&lt;!-- HTML --&gt;
&lt;div id ="sample" data-name="apple" data-price="280"&gt;&lt;/div&gt;</code></pre>
            <b>dataset</b>からアクセスする場合は、data-を除いて記述する。
        <pre><code class="example">// JavaScript
const elm = document.getElementById("sample");
elm.dataset.name;   // apple
elm.dataset.price;  // 280</code></pre>
            <b>getAttribute</b>や<b>setAttribute</b>を使う場合は、data-も含めて記述する。
        <pre><code class="example">// JavaScript
elm.getAttribute("data-name");
elm.getAttribute("data-price");</code></pre>
            <b>注意</b>
            <ul>
                <li><span class="code-like">dataset</span>の値は、常に<b>文字列</b>(<span class="code-like">elm.dataset.price</span>は、数値の280ではなく、文字列の"280")</li>
                <li>ハイフンで区切った名前は、<span class="code-like">dataset</span>ではキャメルケースになる(<span class="code-like">data-user-name</span>は<span class="code-like">dataset.userName</span>)</li>
                <li>CSSの属性セレクターからも使える(<span class="code-like">[data-name="apple"]</span>)</li>
            </ul></td></tr>
    <tr><td>イベントハンドラーコンテンツ属性</td><td>特定のイベントハンドラーに対するコンテンツ属性で、ユーザーが要素に対象の操作を行ったときにJavaScriptを実行する<br>
    ただし、コードが長くなるとHTMLの可読性が下がる。HTMLとJavaScriptが混在して保守性が下がる。場合によってはセキュリティリスク(XSS攻撃の可能性)が増す。などの理由から、DOM操作はJavaScriptファイル側で完結させることが推奨される
        <pre><code class="example">&lt;!-- 属性に書く方法(非推奨) --&gt;
&lt;button onclick="alert('clicked')"&gt;押す&lt;/button&gt;</code></pre>
        <pre><code class="example">// JavaScript側で登録する方法(推奨)
document.querySelector("button").addEventListener("click", () => {
    alert("clicked");
});</code></pre></td></tr>
</table>

---

## ステータスコード <a id="status-code" data-name="ステータスコード"></a>

HTTP のレスポンスに付く、3桁の数字。先頭の桁で、大きく分類される。

| 範囲 | 分類 | 意味 |
| --- | --- | --- |
| 1xx | 情報 | リクエストを受け取って、処理を続けている |
| 2xx | 成功 | リクエストが成功した |
| 3xx | リダイレクト | 別の場所へ移動する必要がある |
| 4xx | クライアントエラー | リクエストに問題がある (クライアント側の原因) |
| 5xx | サーバーエラー | サーバー側で、問題が起きた |

### 1xx 情報

| ステータスコード | 説明 |
| --- | --- |
| 100 Continue | リクエスト継続可能 |
| 101 Switching Protocols | プロトコルの切り替え (WebSocket への切り替えなど) |
| 102 Processing | 処理中 (WebDAV の拡張。現在はほとんど使われない) |
| 103 Early Hints | 本来のレスポンスの前に、先読みさせたいリソース (CSS など) のヒントを伝える |

### 2xx 成功

| ステータスコード | 説明 |
| --- | --- |
| 200 OK | リクエストが正常に処理できた |
| 201 Created | リクエストが成功してリソースの作成が完了 |
| 202 Accepted | リクエストを受け取ったが処理はされていない |
| 203 Non-Authoritative Information | リクエストが成功したものの、変換プロキシによって<br>元のサーバーの200(OK)レスポンスから内容が変更された |
| 204 No Content | リクエストに対して送信するコンテンツは無いがヘッダは有用である |
| 205 Reset Content | クライアントにドキュメントビューをリセットするように指示 |
| 206 Partial Content | 要求された範囲のデータやリソースの一部分だけのリクエストが成功 |

### 3xx リダイレクト

| ステータスコード | 説明 |
| --- | --- |
| 300 Multiple Choices | リクエストに対して複数のレスポンスがあることを示す |
| 301 Moved Permanently | 恒久的に移動する |
| 302 Found | 一時的に移動する<br>※Google検索エンジンの検索リストでは旧URLを示すため<br>将来的に元のURLに戻すなどの時に利用する |
| 303 See Other | 別のURLの結果を、GET で取得するよう指示する (POST の後に、結果のページへ移動させるときなど) |
| 304 Not Modified | 更新されていない<br>※正常に処理されているがブラウザキャッシュの内容を表示している為<br>サーバからダウンロードをしていない |
| 307 Temporary Redirect | 一時的に移動する (**リクエストのメソッドを、変えずに**再送する) |
| 308 Permanent Redirect | 恒久的に移動する (**リクエストのメソッドを、変えずに**再送する) |

#### リダイレクトの使い分け

| | 恒久的 | 一時的 |
| --- | --- | --- |
| メソッドを変えてよい (POST が GET に変わることがある) | 301 | 302 |
| メソッドを保つ | 308 | 307 |
| POST の後に、GET で別のページを表示する | - | 303 |

### 4xx クライアントエラー

| ステータスコード | 説明 |
| --- | --- |
| 400 Bad Request | 一般的なクライアントエラー (リクエストの形式が不正など) |
| 401 Unauthorized | 認証が必要、または認証に失敗 (名前に反して、「未認証」の意味) |
| 402 Payment Required | 料金の支払いをするまでリクエストを処理できない状態 |
| 403 Forbidden | 認証されていても、アクセスする権限が無い |
| 404 Not Found | Webページが見つからない |
| 405 Method Not Allowed | 送信するクライアント側のメソッドが許可されていない |
| 406 Not Acceptable | クライアントが指定した形式 (Accept ヘッダー) では、サーバが応答できない |
| 407 Proxy Authentication Required | プロキシサーバ経由で通信を行う際にプロキシサーバの認証情報が不足している |
| 408 Request Timeout | リクエスト送信後のやり取りに時間が長すぎるため時間切れ |
| 409 Conflict | サーバに既に存在しているデータが競合しているためリクエストを完了できない |
| 410 Gone | ファイルが削除されたため、ほぼ永久的にWebページが存在しない |
| 411 Length Required | Content-Length ヘッダー (送るデータの容量) が無いため、サーバがアクセスを拒否した |
| 412 Precondition Failed | ヘッダで定義された前提条件が満たされていない場合にアクセス拒否される |
| 413 Content Too Large (旧 Payload Too Large) | ファイルをアップロードする際に<br>サーバで定めたファイル容量の上限を超えてしまった為アクセス拒否された |
| 414 URI Too Long | 指定したURLが長すぎる |
| 415 Unsupported Media Type | サーバが対応していない形式 (Content-Type) のデータが送られたため、アクセス拒否された |
| 416 Range Not Satisfiable | サーバーがリクエストされた範囲（容量）を提供できない |
| 417 Expectation Failed | Expect ヘッダーの期待に、サーバが応えられない |
| 418 I'm a teapot | ジョークの RFC (RFC 2324) に由来するコード。実際の用途はなく、予約されている |
| 421 Misdirected Request | リクエストが、そのレスポンスを返せないサーバーに送られた (HTTP/2 で、接続を使い回したときなど) |
| 422 Unprocessable Content (旧 Unprocessable Entity) | リクエストの形式は正しいが、<br>内容の意味が正しくないためサーバが処理できない (入力値の検証エラーなど。もとは WebDAV の拡張) |
| 423 Locked | WebDAVの拡張ステータスコード<br>リクエスト対象のリソースがロックされているためサーバが処理できない |
| 424 Failed Dependency | WebDAV の拡張。別のリクエストが失敗したため、このリクエストも失敗した |
| 425 Too Early | TLS 1.3 の Early Data (0-RTT) で送られた、再送攻撃 (リプレイ) の恐れがあるリクエストを、サーバが処理しない |
| 426 Upgrade Required | 現在のプロトコルでは処理できず、Upgrade ヘッダーで示すプロトコルへの切り替えが必要 |
| 428 Precondition Required | サーバーが、条件付きリクエスト (`If-Match` など) を必須としている (更新の衝突を防ぐため) |
| 429 Too Many Requests | 一定時間内にリクエスト数が多すぎるためアクセスを拒否した<br>※ DDoS攻撃によるサーバダウンのリスクを回避する為 |
| 431 Request Header Fields Too Large | リクエストヘッダーが長すぎるためサーバ処理が拒否した |
| 451 Unavailable For Legal Reasons | 法的な理由により、リソースを提供できない |

### 5xx サーバーエラー

| ステータスコード | 説明 |
| --- | --- |
| 500 Internal Server Error | サーバー内部で、予期しないエラーが起きた (プログラムの例外など) |
| 501 Not Implemented | リクエストされた機能を、サーバーが実装していない |
| 502 Bad Gateway | ゲートウェイやプロキシが、上流のサーバーから、不正な応答を受け取った |
| 503 Service Unavailable | サーバーが、メンテナンスや過負荷のため、一時的にリクエストを処理できない |
| 504 Gateway Timeout | ゲートウェイやプロキシが、上流のサーバーからの応答を、待ちきれなかった |
| 505 HTTP Version Not Supported | リクエストの HTTP バージョンに、サーバーが対応していない |
| 506 Variant Also Negotiates | コンテンツネゴシエーションの設定ミスで、循環参照が起きている (ほとんど見ない) |
| 507 Insufficient Storage | WebDAV の拡張。サーバーの保存容量が足りず、リクエストを完了できない |
| 508 Loop Detected | WebDAV の拡張。処理の途中で、無限ループを検出した |
| 510 Not Extended | リクエストに必要な拡張が足りない (現在はほとんど使われない) |
| 511 Network Authentication Required | ネットワークへの認証が必要 (公衆 Wi-Fi のログインページなど) |

### API でよく使うステータスコード

| 操作 | 成功 | 失敗 |
| --- | --- | --- |
| 取得 | 200 OK | 404 Not Found |
| 作成 | 201 Created | 400 Bad Request、409 Conflict、422 Unprocessable Content |
| 更新 | 200 OK、204 No Content | 400、404、409 |
| 削除 | 204 No Content | 404 |
| 認証 | - | 401 Unauthorized (未認証)、403 Forbidden (権限なし) |
| 制限 | - | 429 Too Many Requests |
| サーバーの障害 | - | 500、502、503、504 |

---

## よく使われる特殊文字 <a id="special-symbols" data-name="よく使われる特殊文字"></a>

### 文字参照の書き方

HTML では、`<`、`>`、`&` などの文字が特別な意味を持つため、そのまま表示するには、**文字参照**を使う。

| 書き方 | 例 | 説明 |
| --- | --- | --- |
| `&名前;` | `&lt;` | 名前付き文字参照 |
| `&#10進数;` | `&#60;` | 数値文字参照 (10進数のコードポイント) |
| `&#x16進数;` | `&#x3C;` | 数値文字参照 (16進数のコードポイント) |

最低限、エスケープが必要な文字は次のとおり。

| 文字 | 文字参照 | 必要な場面 |
| --- | --- | --- |
| `&` | `&amp;` | 常に (文字参照の開始と区別するため) |
| `<` | `&lt;` | 本文の中 (タグの開始と区別するため) |
| `>` | `&gt;` | 習慣として、`<` と合わせて |
| `"` | `&quot;` | `"` で囲んだ属性値の中 |

<pre><code class="tips">&lt;meta charset="UTF-8"&gt; を指定して、UTF-8 で保存していれば、★ や ✓ や絵文字は、文字参照にせず、そのまま書ける。
&amp;nbsp; は、改行されない空白だが、余白を作る目的で、何個も並べない。余白は CSS で調整する。
&amp;apos; は HTML5 以降の文字参照で、古い HTML4 では使えない。</code></pre>

### 頻出記号

| 記号 | 特殊文字 | 読み |
| --- | --- | --- |
| & | `&amp;` | アンパサンド |
| “ | `&quot;` | ダブルクォーテーション |
| ‘ | `&apos;` | シングルクォーテーション |
| '&nbsp;' | `&nbsp;` | 半角スペース |
| < | `&lt;` | 小なり |
| > | `&gt;` | 大なり |
| ˜ | `&tilde;` | チルダ |
| ¥ | `&yen;` | 円 |
| © | `&copy;` | 著作権（コピーライト） |
| ® | `&reg;` | 登録商標 |
| ™ | `&trade;` | 商標 |
| « | `&laquo;` | 二重山括弧(開始) |
| » | `&raquo;` | 二重山括弧(終了) |
| ½ | `&frac12;` | 分数1/2 |
| ² | `&sup2;` | 上付き数字の2 |
| , | `&comma;` | カンマ |
| . | `&period;` | ピリオド |
| : | `&colon;` | コロン |
| ; | `&semi;` | セミコロン |
| ′ | `&prime;` | プライム |
| ″ | `&Prime;` | ダブルプライム |
| ‴ | `&tprime;` | トリプルプライム |
| ⁗ | `&qprime;` | クワトロプライム |
| ¨ | `&uml;` | 分音記号 (ダイエレシス) |
| … | `&hellip;` | 三連ドット |
| / | `&sol;` | スラッシュ |
| &#92; | `&bsol;` または `&#92;` | バックスラッシュ |
| &#124; | `&verbar;` | バーティカルバー |

### 矢印記号

| 記号 | 特殊文字 | 読み |
| --- | --- | --- |
| ← | `&larr;` | 左向き矢印 |
| ↑ | `&uarr;` | 上向き矢印 |
| → | `&rarr;` | 右向き矢印 |
| ↓ | `&darr;` | 下向き矢印 |
| ↔ | `&harr;` | 水平矢印 |
| ↕ | `&varr;` | 垂直矢印 |
| ↖ | `&nwarr;` | 左斜め上向き矢印 |
| ↗ | `&nearr;` | 右斜め上向き矢印 |
| ↘ | `&searr;` | 右斜め下向き矢印 |
| ↙ | `&swarr;` | 左斜め下向き矢印 |
| ↚ | `&nlarr;` | 打ち消し左向き矢印 |
| ↛ | `&nrarr;` | 打ち消し右向き矢印 |
| ↝ | `&rarrw;` | 右向き波矢印 |
| ↞ | `&Larr;` | 左向き二重矢印 |
| ↟ | `&Uarr;` | 上向き二重矢印 |
| ↠ | `&Rarr;` | 右向き二重矢印 |
| ↡ | `&Darr;` | 下向き二重矢印 |
| ↢ | `&larrtl;` | 左向き尾付き矢印 |
| ↣ | `&rarrtl;` | 右向き尾付き矢印 |
| ↤ | `&LeftTeeArrow;` | 基準付き左向き矢印 |
| ↥ | `&UpTeeArrow;` | 基準付き上向き矢印 |
| ↦ | `&RightTeeArrow;` | 基準付き右向き矢印 |
| ↧ | `&DownTeeArrow;` | 基準付き下向き矢印 |
| ↩ | `&larrhk;` | 引き返し左向き矢印 |
| ↪ | `&rarrhk;` | 引き返し右向き矢印 |
| ↫ | `&larrlp;` | ループ左向き矢印 |
| ↬ | `&rarrlp;` | ループ右向き矢印 |
| ↭ | `&harrw;` | 左右波矢印 |
| ↮ | `&nharr;` | 打ち消し左右矢印 |
| ↰ | `&lsh;` | 上向き左折矢印 |
| ↱ | `&rsh;` | 上向き右折矢印 |
| ↲ | `&ldsh;` | 下向き左折矢印 |
| ↳ | `&rdsh;` | 下向き右折矢印 |
| ↵ | `&crarr;` | コーナー付き矢印 |
| ↶ | `&cularr;` | 上カーブ左向き矢印 |
| ↷ | `&curarr;` | 上カーブ右向き矢印 |
| ↺ | `&olarr;` | 左巻き矢印 |
| ↻ | `&orarr;` | 右巻き矢印 |
| ↼ | `&lharu;` | 左方向上向き銛型矢印 |
| ↽ | `&lhard;` | 左方向下向き銛型矢印 |
| ↾ | `&uharr;` | 上方向右向き銛型矢印 |
| ↿ | `&uharl;` | 上方向左向き銛型矢印 |
| ⇀ | `&rharu;` | 右方向上向き銛型矢印 |
| ⇁ | `&rhard;` | 右方向下向き銛型矢印 |
| ⇂ | `&dharr;` | 下方向右向き銛型矢印 |
| ⇃ | `&dharl;` | 下方向左向き銛型矢印 |
| ⇄ | `&rlarr;` | 右左二重矢印 |
| ⇅ | `&udarr;` | 上下二重矢印 |
| ⇆ | `&lrarr;` | 左右二重矢印 |
| ⇇ | `&llarr;` | 左左二重矢印 |
| ⇈ | `&uuarr;` | 上上二重矢印 |
| ⇉ | `&rrarr;` | 右右二重矢印 |
| ⇊ | `&ddarr;` | 下下二重矢印 |
| ⇋ | `&lrhar;` | 左右銛型二重矢印 |
| ⇌ | `&rlhar;` | 右左銛型二重矢印 |
| ⇍ | `&nlArr;` | 打ち消し左向き二重線矢印 |
| ⇎ | `&nhArr;` | 打ち消し左右二重線矢印 |
| ⇏ | `&nrArr;` | 打ち消し右向き二重線矢印 |
| ⇐ | `&lArr;` | 左向き二重線矢印 |
| ⇑ | `&uArr;` | 上向き二重線矢印 |
| ⇒ | `&rArr;` | 右向き二重線矢印 |
| ⇓ | `&dArr;` | 下向き二重線矢印 |
| ⇔ | `&hArr;` | 左右二重線矢印 |
| ⇕ | `&vArr;` | 上下二重線矢印 |
| ⇖ | `&nwArr;` | 左斜め上向き二重線矢印 |
| ⇗ | `&neArr;` | 右斜め上向き二重線矢印 |
| ⇘ | `&seArr;` | 右斜め下向き二重線矢印 |
| ⇙ | `&swArr;` | 左斜め下向き二重線矢印 |
| ⇚ | `&lAarr;` | 左向き三重線矢印 |
| ⇛ | `&rAarr;` | 右向き三重線矢印 |
| ⇝ | `&zigrarr;` | ジグザグ右向き矢印 |
| ⇤ | `&larrb;` | 行き止まり左向き矢印 |
| ⇥ | `&rarrb;` | 行き止まり右向き矢印 |
| ⇵ | `&duarr;` | 下上二重矢印 |
| ⇽ | `&loarr;` | 白抜き左向き矢印 |
| ⇾ | `&roarr;` | 白抜き右向き矢印 |
| ⇿ | `&hoarr;` | 白抜き左右矢印 |

### スペースのバリエーション

| 記号 | 特殊文字 | 読み |
| --- | --- | --- |
| '&nbsp;' | `&nbsp;` | 改行しない半角スペース |
| '&ensp;' | `&ensp;` | nと同じ幅のスペース |
| '&emsp;' | `&emsp;` | mと同じ幅のスペース |
| '&thinsp;' | `&thinsp;` | 細い空白 |
| '&#8203;' | `&#8203;` | ゼロ幅スペース |

### ポップな特殊文字

| 記号 | 特殊文字 | 読み |
| --- | --- | --- |
| ★ | `&starf;` | 黒星 |
| ☆ | `&star;` | 白星 |
| ♪ | `&sung;` | 8分音符 |
| ♭ | `&flat;` | フラット |
| ♮ | `&natur;` | ナチュラル |
| ♯ | `&sharp;` | シャープ |
| ☎ | `&phone;` | 電話 |

### 算術記号・分数記号

| 記号 | 特殊文字 | 読み |
| --- | --- | --- |
| + | `&plus;` | 加算記号 |
| − | `&minus;` | 減算記号 |
| × | `&times;` | 乗算記号 |
| ÷ | `&divide;` | 除算記号 |
| ± | `&plusmn;` | プラスマイナス |
| = | `&equals;` | 等しい |
| ≠ | `&ne;` | 等しくない |
| ≈ | `&asymp;` | ほぼ等しい |
| ≅ | `&cong;` | 合同 |
| ≡ | `&equiv;` | 恒等 (合同) |
| < | `&lt;` | 不等号（より小さい） |
| > | `&gt;` | 不等号（より大きい） |
| ∧ | `&and;` | 論理積 |
| ∨ | `&or;` | 論理和 |
| ≤ | `&le;` | 小さいか等しい |
| ≥ | `&ge;` | 大きいか等しい |
| ≪ | `&Lt;` | はるかに小さい |
| ≫ | `&Gt;` | はるかに大きい |
| * | `&ast;` | アスタリスク |
| ∗ | `&lowast;` | アスタリスク（下段） |
| ƒ | `&fnof;` | 関数記号 |
| ¬ | `&not;` | 否定記号 |
| ² | `&sup2;` | 上付き2 |
| ³ | `&sup3;` | 上付き3 |
| ¹ | `&sup1;` | 上付き1 |
| º | `&ordm;` | 男性序数標識 (上付きの o) |
| ∀ | `&forall;` | 全てについて |
| ∂ | `&part;` | 偏微分 |
| ∃ | `&exist;` | 存在する |
| ∇ | `&nabla;` | ナブラ |
| ∏ | `&prod;` | 総乗 |
| ∑ | `&sum;` | 総和 |
| √ | `&radic;` | 平方根 |
| ∝ | `&prop;` | 比例記号 |
| ∞ | `&infin;` | 無限 |
| ∠ | `&ang;` | 角度 |
| ∫ | `&int;` | 積分記号 |
| ∬ | `&Int;` | 二重積分 |
| ∮ | `&oint;` | 回転積分 |
| ∴ | `&therefore;` | したがって |
| ∵ | `&because;` | なぜなら |
| ∼ | `&sim;` | チルダ演算子 |
| ∽ | `&bsim;` | 逆チルダ (相似) |
| ∅ | `&empty;` | 空集合 |
| ∩ | `&cap;` | 集合の積 |
| ∪ | `&cup;` | 集合の和 |
| ⊂ | `&sub;` | 左辺は右辺の部分集合 |
| ⊃ | `&sup;` | 左辺は右辺を含む |
| ⊄ | `&nsub;` | 左辺は右辺の部分集合でない |
| ⊆ | `&sube;` | 左辺は右辺の部分集合または等しい |
| ⊇ | `&supe;` | 左辺は右辺を含むか等しい |
| ∈ | `&isin;` | 右辺の要素である |
| ∉ | `&notin;` | 右辺の要素でない |
| ∋ | `&ni;` | 要素として含む |
| ⊕ | `&oplus;` | 直和 |
| ⊖ | `&ominus;` | 丸囲みマイナス |
| ⊗ | `&otimes;` | 丸囲み乗算 (テンソル積など) |
| ⊘ | `&osol;` | 丸囲みスラッシュ |
| ⊙ | `&odot;` | 丸囲みドット |
| ⊚ | `&ocir;` | 丸囲みサークル |
| ⊛ | `&oast;` | 丸囲みアスタリスク |
| ⊝ | `&odash;` | 丸囲みダッシュ |
| ⊥ | `&perp;` | 直交 |
| ⋅ | `&sdot;` | ドット演算子 |
| ½ | `&frac12;` | 2分の1 |
| ⅓ | `&frac13;` | 3分の1 |
| ¼ | `&frac14;` | 4分の1 |
| ⅕ | `&frac15;` | 5分の1 |
| ⅔ | `&frac23;` | 3分の2 |
| ⅖ | `&frac25;` | 5分の2 |
| ¾ | `&frac34;` | 4分の3 |

---

## 時刻と経過時間 <a id="time-and-elapsed-time" data-name="時刻と経過時間"></a>

<table>
    <caption>時刻の書式</caption>
    <tr>
        <th>書式</th>
        <th>説明</th>
    </tr>
    <tr>
        <td>YYYY-MM-DDTHH:MM:SSZ</td>
        <td>Tで日付と時刻を分け、最後にZを付けることでUTC(協定世界時)であることを示す (例)2024-11-04T08:30:00Z
            <br>UTC以外のタイムゾーンも指定可能で、日本の場合は+09:00 (例)2024-11-04T08:30:00+09:00は日本標準時の8:30
        </td>
    </tr>
    <tr>
        <td>YYYY-MM-DD</td>
        <td>日付のみ (例)2024-07-20</td>
    </tr>
    <tr>
        <td>HH:MM:SS</td>
        <td>時刻のみ (例)07:45:00 タイムゾーンも指定可能</td>
    </tr>
</table>


<table>
    <caption>経過時間の書式</caption>
    <tr>
        <th>書式</th>
        <th>説明</th>
    </tr>
    <tr>
        <td>P[n]Y[n]M[n]DT[n]H[n]M[n]S</td>
        <td>Pから始まり、日時の要素ごとに値を指定する (例)P2Y3M5DT7H10M30Sは2年3か月5日7時間10分30秒を表す</td>
    </tr>
    <tr>
        <td>PT[n]H[n]M[n]S</td>
        <td>時間のみの表記 (例)PT15Mは15分を表す</td>
    </tr>
</table>

`<time>` 要素の `datetime` 属性に、この書式を使う。

```html
<time datetime="2024-11-04T08:30:00+09:00">2024年11月4日 午前8時30分</time>
<time datetime="PT1H30M">1時間30分</time>
```

---

## ブラウザで扱えるメディアのファイル形式 <a id="available-formats" data-name="ファイル形式"></a>

### 動画ファイル

| 拡張子 | 説明                                                                     |
| ------ | ------------------------------------------------------------------------ |
| `mp4`  | 最も広くサポートされている動画形式で、ほとんどのブラウザで再生可能。     |
| `webm` | 主要なブラウザで再生できる、オープンなフォーマット。                     |
| `ogv`  | オープンなフォーマットだが、対応していないブラウザもあり、現在はほとんど使われない。 |

### 音声ファイル

| 拡張子 | 説明                                                                         |
| ------ | ---------------------------------------------------------------------------- |
| `mp3`  | 最も広くサポートされている音声フォーマットで、ほとんどのブラウザで再生可能。 |
| `m4a` (AAC) | mp3 と並んで広く対応している、圧縮音声のフォーマット。                  |
| `ogg`  | オープンなフォーマット。ブラウザによって、対応状況が異なる。                 |
| `wav`  | 高音質な音声フォーマットで、ほとんどのブラウザでサポートされている。         |
| `webm` | 音声だけでなく動画もサポートしているが、音声ファイルとしても使用できる。     |

### 画像ファイル

| 拡張子       | 説明                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jpg` `jpeg` | 高い圧縮率を誇り、写真や画像に広く使用されており、ほとんどのブラウザでサポートされている。                                                                    |
| `png`        | 可逆圧縮で、透明な背景をサポートするため、ロゴやアイコンなどでよく使われる。こちらも広くサポートされている。                                                  |
| `gif`        | 動画のようなアニメーションを表示するために使用されることが多い形式。こちらも広くサポートされている。                                                          |
| `webp`       | 高圧縮率を持ちながらも高画質を維持するフォーマット。現在は、主要なブラウザのほとんどで対応している (Internet Explorer は非対応)。                             |
| `avif`       | webp よりも、さらに高い圧縮率を持つ新しいフォーマット。現在は主要なブラウザのほとんどで対応しているが、古い環境のために、`<picture>` で、対応していないブラウザ向けのフォールバックを用意する。 |
| `svg`        | ベクター画像フォーマットで、スケーラブルなグラフィックに使用される。Webでの使用が増えており、ほとんどのモダンブラウザでサポートされている。                   |
| `ico`        | ファビコン (タブに表示されるアイコン) に使われる。                                                                                                            |

### 複数の形式を用意する

ブラウザによって、対応している形式が違う場合は、`<source>` で複数の形式を用意して、ブラウザに選ばせる。

```html
<video controls>
  <source src="movie.webm" type="video/webm">
  <source src="movie.mp4" type="video/mp4">
</video>

<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="説明">
</picture>
```

---

## 非推奨・廃止された要素 <a id="obsolete" data-name="非推奨・廃止された要素"></a>

次の要素は、古い HTML で使われていたが、現在は使ってはいけない (多くは、ブラウザが対応を続けているだけ)。

| 要素 | 代わりに使うもの |
| --- | --- |
| `<font>` | CSS の `font-family`、`font-size`、`color` |
| `<center>` | CSS の `text-align: center`、`margin: 0 auto` |
| `<big>` | CSS の `font-size` |
| `<strike>` | `<s>` または `<del>` |
| `<tt>` | `<code>`、`<kbd>`、`<samp>` |
| `<marquee>` | CSS アニメーション |
| `<blink>` | (廃止。CSS アニメーションなど) |
| `<frame>` `<frameset>` `<noframes>` | `<iframe>`、CSS のレイアウト |
| `<acronym>` | `<abbr>` |
| `<dir>` | `<ul>` |
| `<nobr>` | CSS の `white-space: nowrap` |
| `<xmp>` `<plaintext>` `<listing>` | `<pre>` と `<code>` (特殊文字はエスケープする) |
| `<bgsound>` | `<audio>` |
| `<applet>` | (廃止。`<video>`、`<canvas>` など) |

### 廃止された属性の例

見た目に関する属性は、CSS に置き換えられている。

| 属性 | 代わりに使うもの |
| --- | --- |
| `align` | CSS の `text-align`、`float`、Flexbox |
| `bgcolor` | CSS の `background-color` |
| `border` (`<table>` など) | CSS の `border` |
| `cellpadding` / `cellspacing` | CSS の `padding`、`border-spacing` |
| `width` / `height` (`<table>` など) | CSS の `width`、`height` |

---

## よくある間違い <a id="common-mistakes" data-name="よくある間違い"></a>

| 間違い | 問題 | 正しい書き方 |
| --- | --- | --- |
| `<img>` に `alt` がない | 画像が読み込めないときや、スクリーンリーダーで、内容が伝わらない | 内容を説明する `alt` を書く (装飾なら `alt=""`) |
| 入力欄に `<label>` がない | スクリーンリーダーで、何の入力か分からない。クリックできる範囲も狭い | `<label for="id">` で関連付ける |
| `id` の重複 | CSS、JavaScript、ページ内リンクが、意図しない要素を指す | `id` は、ページ内で一意にする (共通のスタイルは `class`) |
| `<p>` の中に `<div>` や `<ul>` を入れる | `<p>` が自動で閉じられて、構造が崩れる | ブロック要素は、`<p>` の外に置く |
| `<br>` を並べて余白を作る | 構造と見た目が混ざる | CSS の `margin` や `padding` |
| `<div>` や `<span>` にクリックの動作を付けて、ボタンにする | キーボードで操作できず、スクリーンリーダーにも、ボタンと伝わらない | `<button>` を使う |
| `<button>` に `type` を書かない | フォームの中で、意図せず送信される | `type="button"` を明示する |
| `disabled="false"` と書く | 属性があるだけで、有効 (無効化) のまま | 属性ごと取り除く |
| 見た目のために、見出しレベルを選ぶ | 文書の構造が、崩れる | 構造で選び、見た目は CSS で調整する |
| リンクの文言が「こちら」 | 何のリンクか、リンクの一覧で分からない | リンク先の内容が分かる言葉にする |
| `<table>` をレイアウトに使う | 構造として、不適切 | CSS の Flexbox や Grid を使う |
| `<meta name="viewport">` がない | スマートフォンで、縮小された PC 向けの表示になる | `<head>` に viewport を指定する |
| 画像に `width` と `height` がない | 読み込み後に、レイアウトがずれる | 幅と高さを指定する (または CSS で、`aspect-ratio` を指定する) |
| 終了タグの付け忘れ | 以降の構造が崩れ、原因を見つけにくい | validator で確認する |
| `<head>` の中に、表示される要素を書く | `<head>` がそこで終わり、以降が `<body>` として扱われる | `<head>` には、メタデータだけを書く |
