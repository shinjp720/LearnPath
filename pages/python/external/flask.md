---
title: Flask
layout: default
---

# Flask <a id="top" data-name="TOP"></a>

- Flaskは、Python製の軽量・柔軟なWebアプリケーション・マイクロフレームワーク。
- 最小限の機能（ルーティング・リクエスト処理・テンプレート）だけを備え、必要に応じて拡張を追加して使う。

```bash
pip install flask
```

```python
from flask import Flask
```

---

<a id="request-processing" data-name="リクエスト処理"></a>

## リクエスト処理

### GET
メソッドの指定が無ければリクエストはGETとして処理される。

#### クエリパラメータ
リクエストは`/search?id=123&q=test`のように、`?クエリ名=値`と書いて、複数クエリがある場合は`アンパサンド(&)`で続けて書く。<br>検索条件やフィルタリングなどのオプション的な情報に適している。<br>
データの取得は`id = request.args.get('id')`のように書く。`?id=`が無かった場合は`None`が返る。
<pre><code class="tips">name = request.args.get('name', 'Guest')
のように書くと'Guest'がデフォルト値となり、
?name=が無かった場合には'Guest'が返る。</code></pre>

<pre><code class="example">from flask import Flask, request

app = Flask(__name__)

@app.route("/search")
def search():
    q = request.args.get("q", "")
    return f"検索ワード: {q}"</code></pre>

#### パスパラメータ
リクエストは`/search/123`のように`/123`と書いて、パスの一部として含める。リソースを一意に識別する情報に適している。<br>
データの取得は`@app.route('/search/<int:id>')`のようにルーティングで定義する。

<pre><code class="example">@app.route("/search/&lt;int:id&gt;")
def show(id):
    return f"ID: {id}"</code></pre>

`<型:変数名>`の型には`string`（デフォルト）、`int`、`float`、`path`、`uuid`が使える。型が合わないURLは自動的に404になる。

<div class="subtitle">静的ルーティング</div>
固定されたURLパスに対して特定の関数を紐づけるもので、静的ルーティングは同じパスに対して常に同じ動作を行う。

<pre><code class="example">@app.route("/")
def index():
    return render_template("index.html", title="Top")</code></pre>

<div class="subtitle">動的ルーティング</div>
URLパスの一部を変数として定義し、その値を関数に渡すことができる。これにより、動的にURLを処理できる。<br>GETのパスパラメータの処理は、この動的ルーティングで定義する。

### POST
フォームの送信やJSONの受け渡しなど、サーバー側にデータを送って処理させるときに使う。データはURLではなくリクエストボディに入るため、パスワードなど他人に見られたくない情報や、大きなデータの送信に適している。<br>
`@app.route`はデフォルトでGETしか受け付けないので、`methods`引数で明示する。

#### フォームデータ
HTMLの`<form method="post">`から送られた値は`request.form`で取得する。キーが無い場合に`request.form['name']`と書くと400エラーになるため、`get`を使うと安全。

<pre><code class="example">from flask import Flask, request

app = Flask(__name__)

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        name = request.form.get("name", "")
        return f"こんにちは、{name}さん"
    return render_template("login.html")</code></pre>

#### JSONデータ
`Content-Type: application/json`で送られたデータは`request.get_json()`で辞書として取得できる。レスポンスに辞書を返すと、Flaskが自動でJSONに変換する。

<pre><code class="example">@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.get_json()
    return {"name": data["name"], "status": "created"}, 201</code></pre>

<pre><code class="tips">GETとPOSTは同じURLに対して両方定義できる。
request.methodで分岐するか、
@app.get("/login") と @app.post("/login") のように
ショートカットデコレータで別々の関数に分けてもよい。</code></pre>

---

<a id="jinja2" data-name="Jinja2"></a>

## Jinja2

FlaskにはテンプレートエンジンのJinja2が組み込まれており、HTMLの中にPythonの値や制御構文を埋め込める。<br>
テンプレートファイルはプロジェクト直下の`templates`ディレクトリに置き、`render_template`で呼び出す。

```
project/
├── app.py
└── templates/
    └── index.html
```

### 基本の構文
{% raw %}
- `{{ 変数 }}`：値の出力
- `{% 文 %}`：`if`や`for`などの制御構文
- `{# コメント #}`：コメント（出力されない）

<pre><code class="example">&lt;h1&gt;{{ title }}&lt;/h1&gt;

{% if items %}
&lt;ul&gt;
  {% for item in items %}
  &lt;li&gt;{{ item }}&lt;/li&gt;
  {% endfor %}
&lt;/ul&gt;
{% else %}
&lt;p&gt;アイテムがありません&lt;/p&gt;
{% endif %}</code></pre>

`render_template`のキーワード引数がテンプレート内の変数になる。

<pre><code class="example">@app.route("/")
def index():
    return render_template("index.html", title="Top", items=["a", "b", "c"])</code></pre>

### 自動エスケープ
`.html`のテンプレートでは、`{{ }}`で出力した値のHTML特殊文字（`<`、`>`、`&`など）が自動でエスケープされる。XSS対策として有効なので、信頼できるHTMLを出力したい場合を除き、`|safe`フィルタは使わない。

### テンプレートの継承
共通のレイアウトを`base.html`にまとめ、各ページで差分だけを書ける。

<pre><code class="example">&lt;!-- templates/base.html --&gt;
&lt;html&gt;
  &lt;body&gt;
    {% block content %}{% endblock %}
  &lt;/body&gt;
&lt;/html&gt;

&lt;!-- templates/index.html --&gt;
{% extends "base.html" %}
{% block content %}
  &lt;h1&gt;{{ title }}&lt;/h1&gt;
{% endblock %}</code></pre>
{% endraw %}

---

<a id="development_server" data-name="開発用サーバー"></a>

## 開発用サーバーの起動

### flask runで起動
カレントディレクトリの`app.py`内で`app = Flask(__name__)`という形でインスタンスを生成している場合は`flask run`で起動できる。

### 環境変数を設定して起動
デフォルトでは、モジュール名が`app.py`（または`wsgi.py`）、Flaskオブジェクトが`app`となっているので、変更する場合は環境変数を設定して起動する。<br>
`export FLASK_APP=app.py` もしくは`export FLASK_APP=モジュール名:オブジェクト名`として<br>`flask run`で起動。

### --appオプションで起動
`flask --app モジュール名:オブジェクト名 run`と指定する。Flaskオブジェクト名がappの場合はオブジェクト名を省略可能。
<pre><code class="example">flask --app app run</code></pre>
`--app`は`run`の前に書く。

### デバッグモードで起動
`--debug`オプションを付けると、コードの変更時に自動で再読み込みされ、エラー時にはブラウザ上でトレースバックが表示される。

<pre><code class="example">flask --app app run --debug</code></pre>

<pre><code class="tips">デバッグモードは任意のコードをブラウザから実行できてしまうため、
本番環境では絶対に有効にしない。</code></pre>

### pythonスクリプト内で直接起動

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, Flask!"

if __name__ == "__main__":
    app.run(debug=True)
```

`python app.py`で起動できる。

### Dockerでサーバーをホストに公開
デフォルトでは`127.0.0.1`でしか待ち受けないため、コンテナ内で起動してもホストからはアクセスできない。`--host=0.0.0.0`を指定するとコンテナ外からアクセスできる。
<pre><code class="tips">flask run --host=0.0.0.0 # この指定でホストからアクセスできる</code></pre>

<pre><code class="tips">flask runやapp.run()の開発用サーバーは本番用ではない。
本番ではGunicornなどのWSGIサーバーを使う。</code></pre>
