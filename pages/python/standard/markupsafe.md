---
title: FastAPI
layout: default
---

# markupsafe <a id="top" data-name="TOP">

- pythonのmarkupsafeモジュールは、HTMLやXMLの文字列を安全扱うためのライブラリ。

### Markupオブジェクト
jinja2などのライブラリでは、自動的にエスケープ処理がなされるので、エスケープ処理を行わずにhtmlコンテンツとしてレンダリングさせたい場合などは以下の様にする。

<pre><code class="example">from flask import Flask, render_template_string
from markupsafe import Markup

app = Flask(__name__)

@app.route("/")
def index():
html_content = Markup("<b>これは太字です</b>")  # Markup クラスを使う
return render_template_string("{{ html_content }}", html_content=html_content)

if __name__ == "__main__": 
app.run(debug=True)</code></pre>

### エスケープ処理
markupsafe.escape()を使うと、HTMLで特殊な意味を持つ(<, >, &, ")などを安全に変換する。