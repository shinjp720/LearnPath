<div data-title="Markdown(python)"></div>
<a id="top" data-name="TOP">

# Markdown(Python)

- pythonのMarkdownモジュールは、Markdown形式のテキストをHTMLに変換するためのライブラリ。

```
pip install markdown
from markdown import markdown
```

---

## 基本的な使い方

```python
from markdown import markdown
md_text = "# 見出し<br>これはMarkdownのテストです。"
html = markdown(md_text)
print(html)
```

---

## 拡張機能

次のように拡張機能を指定してHTMLに変換できる。

```
html = markdown(md_text, extensions=['ex1', 'ex2'[, ...]])
```

よく使われる拡張機能。

| 拡張機能名       | 説明                                               |
| ---------------- | -------------------------------------------------- |
| abbr             | 略語`*[HTML]: HyperText Markup Language`をサポート |
| attr_list        | 要素に属性(class や id)を追加できる                |
| def_list         | 定義リスト(用語とその説明)を使える                 |
| fenced_code      | ``` で囲むコードブロックをサポート                 |
| footnotes        | 脚注をサポート                                     |
| tables           | Markdown形式のテーブルをサポート                   |
| smart_strong     | **と__の両方を強調として扱う                       |
| admonition(追加) | 注意ブロックなどが使える(テーマに依存)             |

```python
markdown(md_text, extensions=["extra"])
```
とすることで上記の拡張機能をまとめて読み込んでくれる。