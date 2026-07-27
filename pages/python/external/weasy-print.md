---
title: WeasyPrint
layout: default
---

# WeasyPrint <a id="top" data-name="top"></a>

## 導入 <a id="introduction" data-name="導入"></a>

---

実際に帳票を作る前に、**WeasyPrintの「基本的な書き方」を知識として整理しておく**のがよさそうです。

WeasyPrintはかなりシンプルで、

> **HTMLを書く → CSSで紙面を設計する → PythonからPDF化する**

という3段構成で考えると分かりやすいです。

## 1. 基本形

一番基本はこれです。

```python
from weasyprint import HTML

HTML(
    string="""
    <html>
        <body>
            <h1>帳票</h1>
            <p>これは帳票です。</p>
        </body>
    </html>
    """
).write_pdf("output.pdf")
```

つまり、

```text
HTML(string=HTML文字列)
        ↓
    WeasyPrint
        ↓
    write_pdf()
        ↓
      PDF
```

です。

---

# 2. HTMLとCSSが本体

WeasyPrint自体に「帳票を書くための独自言語」があるわけではありません。

基本的には、

```html
<h1>請求書</h1>

<table>
    <tr>
        <th>商品</th>
        <th>数量</th>
        <th>金額</th>
    </tr>
    <tr>
        <td>商品A</td>
        <td>2</td>
        <td>10,000円</td>
    </tr>
</table>
```

のようなHTMLを書きます。

そして、

```css
h1 {
    text-align: center;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid black;
    padding: 5px;
}
```

で見た目を決めます。

つまり、**HTML/CSSの知識がそのまま帳票作成の知識になる**わけですね。

---

# 3. PDF特有のCSS

Webページと違って、帳票では「紙」が重要です。

そこでWeasyPrintでは `@page` を使います。

```css
@page {
    size: A4;
    margin: 20mm;
}
```

これは、

```text
用紙：A4
余白：上下左右20mm
```

という指定です。

横向きなら、

```css
@page {
    size: A4 landscape;
}
```

です。

---

# 4. 改ページ

帳票ではかなり重要です。

例えば、

{% raw %}
```html
<div>
    1ページ目
</div>

<div class="page-break">
    2ページ目
</div>
```
{% endraw %}

CSSで、

```css
.page-break {
    break-before: page;
}
```

とすると、そこで改ページできます。

逆に「この要素の途中では改ページしない」という指定もできます。

```css
table {
    break-inside: avoid;
}
```

帳票ではこの辺りが非常によく使われます。

---

# 5. 複数ページの帳票

例えば、

```html
{% for item in items %}
<div class="item">
    {{ item.name }}
</div>
{% endfor %}
```

のようなHTMLを生成すれば、WeasyPrint側が**内容がA4に収まらなくなったら自動的に次ページへ送ってくれます**。

つまり、

```text
HTML
│
├─ 商品A
├─ 商品B
├─ 商品C
├─ 商品D
├─ 商品E
│
↓
WeasyPrint
│
├─ Page 1
├─ Page 2
└─ Page 3
```

という感じです。

「ページごとにPDFを作る」という考え方ではなく、**1つのHTML文書を渡して、紙面に合わせてページ分割してもらう**という考え方です。

---

# 6. ページ番号

帳票では、

```text
1 / 10
2 / 10
...
```

みたいなページ番号も欲しくなります。

WeasyPrintではCSSのページカウンターを利用できます。

```css
@page {
    @bottom-right {
        content: counter(page) " / " counter(pages);
    }
}
```

これで、

```text
1 / 5
```

のようなページ番号を付けられます。

ここは普通のHTML/CSSにはあまり出てこない、**WeasyPrintを使う上で覚えておきたいCSS**です。

---

# 7. ヘッダー・フッター

帳票なら例えば、

```text
┌─────────────────────────┐
│ 株式会社○○       売上報告書 │
├─────────────────────────┤
│                         │
│       本文              │
│                         │
├─────────────────────────┤
│ 2026/07/27        1 / 5 │
└─────────────────────────┘
```

こういう構成にしたいですよね。

WeasyPrintではページのマージン領域に、

```css
@page {
    @top-center {
        content: "売上報告書";
    }

    @bottom-center {
        content: "株式会社○○";
    }
}
```

のような指定ができます。

さらに複雑なヘッダー・フッターなら、HTML要素を `position: running()` でページ領域に流し込む方法があります。

これはWeasyPrintを使うなら覚えておくと強い機能です。

---

# 8. Python側の書き方

PDF化する方法は大きく考えると3種類あります。

### HTML文字列から

```python
HTML(string=html).write_pdf("output.pdf")
```

### HTMLファイルから

```python
HTML(filename="report.html").write_pdf("output.pdf")
```

### URLから

```python
HTML(url="https://example.com").write_pdf("output.pdf")
```

帳票では基本的に、

```python
HTML(string=html)
```

か

```python
HTML(filename="report.html")
```

を使うことになるでしょう。

---

# 9. CSSを別ファイルにする

実際の帳票ではCSSをHTMLにベタ書きせず、

```text
reports/
├── report.html
└── report.css
```

のように分けるのが普通です。

Pythonから、

```python
from weasyprint import HTML, CSS

HTML(
    filename="report.html"
).write_pdf(
    "output.pdf",
    stylesheets=[
        CSS(filename="report.css")
    ]
)
```

という形にできます。

ただし、Djangoを使うならもう少し自然な構成になります。

---

# 10. Djangoならこうなる

Django Templateを使えば、

```html
<!-- report.html -->

<h1>{{ title }}</h1>

<p>顧客：{{ customer.name }}</p>

<table>
    {% for item in items %}
    <tr>
        <td>{{ item.name }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.price }}</td>
    </tr>
    {% endfor %}
</table>
```

Python側で、

```python
html = render_to_string(
    "reports/report.html",
    {
        "title": "売上報告書",
        "customer": customer,
        "items": items,
    }
)

HTML(string=html).write_pdf("report.pdf")
```

となります。

なのでDjangoでは、

```text
Django Template
     │
     │ データを埋め込む
     ↓
   HTML
     │
     │ CSSで紙面を整える
     ↓
 WeasyPrint
     │
     ↓
    PDF
```

という理解でほぼOKです。

---

# 11. WeasyPrintで特に覚えるべきもの

帳票用途なら、まずこの辺を知識として持っておけば十分です。

| 分野      | 覚えるもの                                         |
| ------- | --------------------------------------------- |
| 基本      | `HTML(...).write_pdf()`                       |
| HTML    | `table`, `div`, `h1`など                        |
| CSS     | `width`, `height`, `margin`, `padding`        |
| 紙面      | `@page`                                       |
| 用紙      | `A4`, `landscape`                             |
| 改ページ    | `break-before`, `break-after`, `break-inside` |
| ページ番号   | `counter(page)`, `counter(pages)`             |
| ヘッダー    | `@top-*`                                      |
| フッター    | `@bottom-*`                                   |
| 複数ページ   | 自動ページ分割                                       |
| Django  | `render_to_string()`                          |
| CSS読み込み | `CSS(filename=...)`                           |

---

## そして重要なのが「CSSをどこまで使えるか」

WeasyPrintを勉強するとき、**PythonのWeasyPrint APIを大量に覚える必要はない**です。

むしろ、

> **HTML/CSSのうち、印刷・ページレイアウト関係の部分を覚える**

というのが本質です。

特に帳票なら、

```text
HTML
 ↓
通常のCSS
 ↓
@page
 ↓
ページ分割
 ↓
ヘッダー・フッター
 ↓
ページ番号
```

という順番で理解するとかなり綺麗に整理できます。

次に進むなら、**「WeasyPrintで使うCSSを、帳票向けにチートシート化」**するとかなり実用的です。`@page`、改ページ、表、余白、ヘッダー・フッター、ページ番号あたりをまとめると、実際の帳票作成時にそのまま使える知識になります。
