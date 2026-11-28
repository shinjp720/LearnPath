---
title: markupsafe
layout: default
---

# markupsafe <a id="top" data-name="TOP"></a>

Python の MarkupSafe (`markupsafe`) は、HTML や XML の文字列を安全に扱うためのライブラリ。HTML で特殊な意味を持つ文字をエスケープする `escape()` と、「安全な文字列」を表す `Markup` クラスを提供する。

Jinja2 や Flask の、テンプレートの自動エスケープは、このライブラリで実現されている。標準ライブラリではなく、サードパーティのライブラリである (Flask や Jinja2 をインストールすると、依存として入る)。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| エスケープ | `escape()` で、HTML の特殊文字を、安全な文字に変換する |
| 安全な文字列 | `Markup` は、エスケープ済み (または安全) だと、宣言された文字列である。`str` のサブクラスである |
| 二重エスケープの防止 | `Markup` の文字列は、`escape()` に渡しても、再びエスケープされない |
| 自動エスケープ | `Markup` を使った文字列の結合や、書式化では、`Markup` でない値が、自動的にエスケープされる |
| テンプレートエンジンの土台 | Jinja2 や Flask が、内部で使っている |

### 主な API

| 項目 | 内容 |
| --- | --- |
| `escape(s)` | `s` をエスケープして、`Markup` で返す |
| `escape_silent(s)` | `escape()` と同じだが、`None` を空文字列にする |
| `soft_str(s)` | `str` に変換する。`Markup` は、そのまま返す |
| `Markup(s)` | `s` を、エスケープせずに、安全な文字列として扱う |
| `Markup.escape(s)` | `s` をエスケープして、`Markup` で返す (クラスメソッド) |
| `__html__()` | HTML として安全な文字列を返す、メソッド。このメソッドを持つオブジェクトは、エスケープされない |

### 変換される文字

| 文字 | 変換後 |
| --- | --- |
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `'` | `&#39;` |
| `"` | `&#34;` |

<pre><code class="caution">このドキュメントは、MarkupSafe 3.0 系 (Python 3.9 以降) を前提にしている。
3.0 では、Markup の strip()、partition() などのメソッドが、引数をエスケープしなくなった。replace() は、new 引数だけをエスケープする。
古い記事の soft_unicode は、2.1 で削除されている。soft_str を使う。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

PyPI では `MarkupSafe` という名前だが、`import` するときは、小文字の `markupsafe` になる。

```bash
pip install MarkupSafe
```

`uv` を使うプロジェクトでは、次のようにする。

```bash
uv add markupsafe
```

```python
from markupsafe import Markup, escape
```

---

## エスケープ処理 <a id="escape" data-name="エスケープ処理"></a>

markupsafe.escape() を使うと、HTML で特殊な意味を持つ (`<`、`>`、`&`、`'`、`"`) などを安全に変換する。

```python
from markupsafe import escape

s = escape('<script>alert("hi")</script> & \'x\'')
print(s)
print(type(s))
```

```text
&lt;script&gt;alert(&#34;hi&#34;)&lt;/script&gt; &amp; &#39;x&#39;
<class 'markupsafe.Markup'>
```

`escape()` は、`str` ではなく、`Markup` を返す。そのため、結果を、もう一度 `escape()` に渡しても、二重にエスケープされない。

```python
from markupsafe import Markup, escape

print(escape('<b>'))
print(escape(escape('<b>')))  # 二重にエスケープされない
print(escape(Markup('<b>')))  # Markup は、そのまま返る
```

```text
&lt;b&gt;
&lt;b&gt;
<b>
```

### 文字列以外の値

`escape()` は、文字列以外の値を、文字列にしてから、エスケープする。`None` も、`'None'` という文字列になる。`None` を、空文字列にしたいときは、`escape_silent()` を使う。

```python
from markupsafe import escape, escape_silent

print(repr(escape(123)))
print(repr(escape(None)))
print(repr(escape_silent(None)))
```

```text
Markup('123')
Markup('None')
Markup('')
```

<pre><code class="tips">escape() が返す Markup は、str のサブクラスである。str として扱いたいだけなら、そのまま使える。
テンプレートエンジンを使うなら、自動エスケープが働くため、escape() を自分で呼ぶ場面は、多くない。</code></pre>

---

## Markup オブジェクト <a id="markup" data-name="Markupオブジェクト"></a>

jinja2などのライブラリでは、自動的にエスケープ処理がなされるので、エスケープ処理を行わずにhtmlコンテンツとしてレンダリングさせたい場合などは以下の様にする。

{% raw %}
<pre><code class="example">from flask import Flask, render_template_string
from markupsafe import Markup

app = Flask(__name__)

@app.route("/")
def index():
    html_content = Markup("&lt;b&gt;これは太字です&lt;/b&gt;")  # Markup クラスを使う
    return render_template_string("{{ html_content }}", html_content=html_content)

if __name__ == "__main__":
    app.run(debug=True)</code></pre>
{% endraw %}

`html_content` を、`Markup` ではなく、普通の文字列で渡すと、`<b>` は、タグとしてではなく、文字としてそのまま表示される。

<pre><code class="caution">Markup(s) は、s をエスケープしない。安全だと、宣言するだけである。
ユーザーの入力のような、信頼できない文字列を、Markup() に直接渡すと、クロスサイトスクリプティング (XSS) の脆弱性になる。</code></pre>

### Markup の演算

`Markup` は、他の文字列と、結合したり、書式化したりするとき、`Markup` でない側の値を、自動的にエスケープする。

| 操作 | 結果 |
| --- | --- |
| `Markup('<em>%s</em>') % '<b>'` | `Markup('<em>&lt;b&gt;</em>')` |
| `Markup('<p>{}</p>').format('<b>')` | `Markup('<p>&lt;b&gt;</p>')` |
| `Markup('<b>') + '<i>'` | `Markup('<b>&lt;i&gt;')` |
| `'<i>' + Markup('<b>')` | `Markup('&lt;i&gt;<b>')` |
| `Markup('<br>').join(['<a>', Markup('<b>')])` | `Markup('&lt;a&gt;<br><b>')` |

```python
from markupsafe import Markup

user = '<script>alert(1)</script>'
print(Markup('<em>%s</em>') % user)
print(Markup('<p>{}</p>').format(user))
print(Markup('<b>') + user)
print(Markup('<br>').join(['<a>', Markup('<b>')]))
```

```text
<em>&lt;script&gt;alert(1)&lt;/script&gt;</em>
<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>
<b>&lt;script&gt;alert(1)&lt;/script&gt;
&lt;a&gt;<br><b>
```

`format()` の名前付きの引数も、同様にエスケープされる。

```python
from markupsafe import Markup

print(Markup('<li>{name}</li>').format(name='<x>'))
```

```text
<li>&lt;x&gt;</li>
```

### Markup のメソッド

| メソッド | 内容 |
| --- | --- |
| `Markup.escape(s)` | `s` をエスケープして、`Markup` で返す (クラスメソッド) |
| `m.unescape()` | エスケープされた文字を、元に戻して、`str` で返す |
| `m.striptags()` | タグを取り除き、連続する空白を1つにして、文字参照を元に戻す。`str` で返す |
| `m.format(*args, **kwargs)` | 引数をエスケープして、書式化する |
| `m.join(iterable)` | 要素をエスケープして、`m` で連結する |
| `m.__html__()` | `m` 自身を返す |

```python
from markupsafe import Markup

print(Markup.escape('<x>'))
print(Markup('&lt;x&gt;').unescape())
print(Markup('Main &raquo; <em>About</em>').striptags())
```

```text
&lt;x&gt;
<x>
Main » About
```

### `__html__` メソッド

`__html__()` を持つオブジェクトは、「自分で、HTML として安全な文字列を返せる」オブジェクトとして扱われ、`escape()` や `Markup` の書式化で、エスケープされない。自作のクラスを、テンプレートに渡すときに使う。

```python
from markupsafe import Markup, escape


class Button:
    def __init__(self, label):
        self.label = label

    def __html__(self):
        # 内部の値は、自分でエスケープする
        return Markup('<button>{}</button>').format(self.label)


print(escape(Button('<ok>')))
print(Markup('<div>{}</div>').format(Button('<ok>')))
```

```text
<button>&lt;ok&gt;</button>
<div><button>&lt;ok&gt;</button></div>
```

---

## テンプレートエンジンでの自動エスケープ <a id="template" data-name="テンプレートエンジン"></a>

Jinja2 は、`autoescape=True` のとき、`Markup` でない値を、出力するときにエスケープする。Flask は、`.html` などのテンプレートと、`render_template_string()` で、自動エスケープを有効にしている。

{% raw %}
```python
from jinja2 import Environment

env = Environment(autoescape=True)
t = env.from_string('<p>{{ name }}</p>')
print(t.render(name='<script>alert(1)</script>'))
print(env.from_string('<p>{{ name|safe }}</p>').render(name='<b>x</b>'))
```
{% endraw %}

```text
<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>
<p><b>x</b></p>
```

テンプレートの中で、エスケープをしないで出力するには、`safe` フィルターを使う。Python 側で、`Markup` にして渡す方法と、同じ効果になる。

<pre><code class="caution">Jinja2 の Environment は、autoescape の既定値が False である。Environment を直接使うときは、autoescape=True を指定する。
safe フィルターと Markup は、どちらも、中身が安全であると、宣言する。信頼できない文字列には、使わない。</code></pre>

---

## 実践例 <a id="examples" data-name="実践例"></a>

### 安全な HTML の断片を組み立てる

`Markup` のテンプレートに、`format()` で値を入れると、値だけがエスケープされる。

```python
from markupsafe import Markup


def render_comment(author, body):
    """コメントを、HTML の断片にする。値は、自動的にエスケープされる"""
    return Markup('<p><strong>{}</strong>: {}</p>').format(author, body)


def render_list(items):
    """リストを、HTML の ul にする"""
    li = Markup('').join(Markup('<li>{}</li>').format(i) for i in items)
    return Markup('<ul>{}</ul>').format(li)


print(render_comment('<Alice>', 'hello & welcome'))
print(render_list(['a', '<b>']))
```

```text
<p><strong>&lt;Alice&gt;</strong>: hello &amp; welcome</p>
<ul><li>a</li><li>&lt;b&gt;</li></ul>
```

`render_list()` の中で、`li` は `Markup` なので、`format()` に渡しても、二重にはエスケープされない。

### f-string を使わない

f-string は、`Markup` の書式化の仕組みを通らず、普通の文字列として、先に連結される。

```python
from markupsafe import Markup

name = '<script>'
unsafe = Markup(f'<b>{name}</b>')        # ❌ f-string で先に連結されて、エスケープされない
safe = Markup('<b>{}</b>').format(name)  # ✅ format() で、値だけがエスケープされる
print(unsafe)
print(safe)
```

```text
<b><script></b>
<b>&lt;script&gt;</b>
```

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| 入力した `<script>` が、そのまま実行される (XSS) | `Markup(user_input)` は、エスケープせず、安全だと宣言するだけである | 信頼できない文字列は、`escape()` を通すか、`Markup('...').format(value)` に入れる |
| `Markup(f'<b>{name}</b>')` で、エスケープされない | f-string が、先に文字列を連結している | `Markup('<b>{}</b>').format(name)` を使う |
| `ImportError: cannot import name 'Markup' from 'jinja2'` | Jinja2 3.1 で、`jinja2.Markup` と `jinja2.escape` が削除された | `from markupsafe import Markup, escape` にする |
| `ImportError: cannot import name 'escape' from 'flask'` | Flask の新しいバージョンでは、`flask.escape` と `flask.Markup` が使えない | `from markupsafe import Markup, escape` にする |
| `ImportError: cannot import name 'soft_unicode'` | `soft_unicode` は、MarkupSafe 2.1 で削除された | `soft_str` を使う |
| `escape(None)` が、`'None'` という文字になる | `escape()` は、`None` を文字列にしてから、エスケープする | `escape_silent()` を使う |
| `&amp;lt;` のように、二重にエスケープされる | エスケープ済みの文字列を、`str` のまま、`escape()` や `Markup` の書式化に渡した | エスケープ前の値を渡す。エスケープ済みで、信頼できるなら、`Markup(...)` で包む |
| `Markup(...).replace(...)` で渡した HTML が、エスケープされる | `Markup` のメソッドは、引数を、エスケープする (`replace()` は、`new` のみ) | 置換後の値を、`Markup(...)` にして渡す |
| `escape()` を通したのに、`href="javascript:..."` で攻撃される | `escape()` は、HTML の本文と、引用符で囲んだ属性値を、保護するためのものである | URL のスキームを、別に検証する。`<script>` や `<style>` の中身には、使わない |
| 属性値が、引用符なしの場合に、攻撃される | `escape()` は、空白を、エスケープしない | 属性値は、必ず、`"` で囲む (`title="{}"`) |
| `markupsafe.__version__` で、`DeprecationWarning` | MarkupSafe 3.0 で、非推奨になった | `importlib.metadata.version("markupsafe")` を使う |

---

## 関連 <a id="related" data-name="関連"></a>

| モジュール、ドキュメント | 用途 |
| --- | --- |
| `jinja2` | テンプレートエンジン。MarkupSafe を使って、自動エスケープする |
| `flask` | Web フレームワーク。テンプレートに、Jinja2 を使う。「Flask」のドキュメントを参照 |
| `html` | 標準ライブラリの `html.escape()`、`html.unescape()`。`Markup` を返さず、`'` を `&#x27;` に変換する |
| `xml.sax.saxutils` | 標準ライブラリの、XML 向けの `escape()` |
