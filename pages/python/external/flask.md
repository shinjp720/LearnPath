---
title: Flask
layout: default
---

# Flask <a id="top" data-name="TOP"></a>

Flask は、Python 製の軽量・柔軟な Web アプリケーション・マイクロフレームワーク。最小限の機能 (ルーティング・リクエスト処理・テンプレート) だけを備え、必要に応じて拡張を追加して使う。<br>
内部では、WSGI のユーティリティである Werkzeug と、テンプレートエンジンの Jinja2 が使われている。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| ルーティング | `@app.route` で、URL と関数を結び付ける |
| テンプレート | Jinja2 を、組み込みで使える |
| 開発用サーバー | `flask run` で起動でき、デバッグモードでは自動で再読み込みされる |
| 拡張 | DB、フォーム、認証などは、拡張 (`Flask-*`) で足す |

### 他のフレームワークとの比較

| | Flask | FastAPI | Django |
| --- | --- | --- | --- |
| 位置づけ | マイクロフレームワーク | API 向けのフレームワーク | フルスタックのフレームワーク |
| ベース | WSGI | ASGI | WSGI / ASGI |
| テンプレート | Jinja2 (組み込み) | 標準では無い | Django テンプレート |
| バリデーション | 拡張や自前の処理 | 型ヒントと Pydantic | フォームとモデル |
| 自動ドキュメント | 標準では無い | OpenAPI (Swagger UI) | 標準では無い |
| DB (ORM) | 標準では無い | 標準では無い | 組み込み |

- 向いている場面: 小〜中規模の Web アプリ、プロトタイプ、小さな API、学習用。
- 向いていない場面: 型ヒントによる自動バリデーションと自動ドキュメントが欲しい場合は FastAPI、管理画面・ORM・認証が一式欲しい場合は Django が向いている。

<pre><code class="caution">このドキュメントは、Flask 3.1 系を前提にしている。確認できた範囲での最新は 3.1.3 (2026年2月公開) である。
Flask 3.1 は、Python 3.9 以降が必要。起動は、flask --app モジュール名 run の書き方が、公式のドキュメントで案内されている。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

仮想環境を作って、その中に入れる (venv と pip については、それぞれのドキュメントを参照)。

```bash
python -m venv .venv
source .venv/bin/activate   # Windows では .venv\Scripts\activate
pip install flask
```

uv を使う場合は、プロジェクトに追加する。

```bash
uv add flask
```

```python
from flask import Flask
```

---

## 基本 <a id="basic" data-name="基本"></a>

最小のアプリケーション。

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, Flask!"
```

```bash
flask --app app run
```

次のような出力になる。

```text
 * Serving Flask app 'app'
 * Debug mode: off
 * Running on http://127.0.0.1:5000
```

| 要素 | 内容 |
| --- | --- |
| `Flask(__name__)` | アプリケーションを作る。`__name__` を基準に、`templates` と `static` の場所が決まる |
| `@app.route(パス)` | URL と関数 (ビュー関数) を結び付ける |
| `request` | 現在のリクエスト (クエリ、フォーム、JSON など) |
| `render_template` | テンプレートを描画して返す |
| `url_for` | ビュー関数の名前から、URL を作る |

<pre><code class="tips">GET を受け付けるルートは、HEAD と OPTIONS にも自動で応答する。
URL の末尾の / は、ルートの定義に合わせる。/about/ と定義すると /about は /about/ に転送され、
/about と定義すると /about/ は 404 になる。</code></pre>

---

## リクエスト処理 <a id="request-processing" data-name="リクエスト処理"></a>

### GET
メソッドの指定が無ければ、リクエストは GET として処理される。

#### クエリパラメータ
リクエストは `/search?id=123&q=test` のように、`?クエリ名=値` と書いて、複数のクエリがある場合は `アンパサンド (&)` で続けて書く。<br>検索条件やフィルタリングなどのオプション的な情報に適している。<br>
データの取得は `id = request.args.get('id')` のように書く。`id` が指定されなかった場合は `None` が返り、`?id=` のように値が空の場合は空文字列 `''` になる。<br>
値は、常に文字列で返る。数値にしたい場合は `request.args.get('id', type=int)` と書く (変換できない場合は、`None` かデフォルト値になる)。
<pre><code class="tips">name = request.args.get('name', 'Guest')
のように書くと'Guest'がデフォルト値となり、
name パラメータ自体が無かった場合には'Guest'が返る。
(?name= のように値が空の場合は、空文字列が返る)</code></pre>

<pre><code class="example">from flask import Flask, request

app = Flask(__name__)

@app.route("/search")
def search():
    q = request.args.get("q", "")
    return f"検索ワード: {q}"</code></pre>

#### パスパラメータ
リクエストは `/search/123` のように `/123` と書いて、パスの一部として含める。リソースを一意に識別する情報に適している。<br>
データの取得は `@app.route('/search/<int:id>')` のように、ルーティングで定義する。

<pre><code class="example">@app.route("/search/&lt;int:id&gt;")
def show(id):
    return f"ID: {id}"</code></pre>

`<型:変数名>` の型には `string` (デフォルト)、`int`、`float`、`path`、`uuid` が使える。型が合わない URL は、自動的に 404 になる。

| 型 | 内容 |
| --- | --- |
| `string` | スラッシュを含まない文字列 (デフォルト) |
| `int` | 正の整数 |
| `float` | 正の小数 |
| `path` | スラッシュを含む文字列 |
| `uuid` | UUID 形式の文字列 |

<div class="subtitle">静的ルーティング</div>
固定された URL パスに対して特定の関数を紐づけるもので、静的ルーティングは同じパスに対して常に同じ動作を行う。

<pre><code class="example">from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html", title="Top")</code></pre>

<div class="subtitle">動的ルーティング</div>
URL パスの一部を変数として定義し、その値を関数に渡すことができる。これにより、動的に URL を処理できる。<br>GET のパスパラメータの処理は、この動的ルーティングで定義する。

### POST
フォームの送信や JSON の受け渡しなど、サーバー側にデータを送って処理させるときに使う。データは URL ではなくリクエストボディに入るため、パスワードなど他人に見られたくない情報や、大きなデータの送信に適している。<br>
`@app.route` はデフォルトで GET しか受け付けないので、`methods` 引数で明示する。

#### フォームデータ
HTML の `<form method="post">` から送られた値は、`request.form` で取得する。キーが無い場合に `request.form['name']` と書くと 400 エラーになるため、`get` を使うと安全。

<pre><code class="example">from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        name = request.form.get("name", "")
        return f"こんにちは、{name}さん"
    return render_template("login.html")</code></pre>

#### JSON データ
`Content-Type: application/json` で送られたデータは、`request.get_json()` で辞書として取得できる。レスポンスに辞書を返すと、Flask が自動で JSON に変換する。

<pre><code class="example">from flask import Flask, request

app = Flask(__name__)

@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.get_json()
    return {"name": data["name"], "status": "created"}, 201</code></pre>

`Content-Type` が JSON でない場合は 415 エラー、本文が不正な JSON の場合は 400 エラーになる。

<pre><code class="tips">GETとPOSTは同じURLに対して両方定義できる。
request.methodで分岐するか、
@app.get("/login") と @app.post("/login") のように
ショートカットデコレータで別々の関数に分けてもよい。</code></pre>

---

## レスポンス <a id="response" data-name="レスポンス"></a>

### 戻り値の種類

ビュー関数の戻り値は、型に応じて、レスポンスに変換される。

| 戻り値 | 結果 |
| --- | --- |
| `str` | HTML として、ステータスコード 200 で返す |
| `dict` / `list` | JSON に変換して返す |
| `(本文, ステータスコード)` | ステータスコードを指定する |
| `(本文, ステータスコード, ヘッダー)` | ヘッダーも指定する |
| `Response` オブジェクト | そのまま返す |

### リダイレクトとエラー

`redirect` で別の URL に転送し、`abort` でエラーを返す。`@app.errorhandler` を使うと、エラー時のレスポンスを変更できる。

```python
from flask import Flask, abort, redirect, url_for

app = Flask(__name__)

@app.route("/")
def index():
    # ビュー関数の名前から URL を作って転送する
    return redirect(url_for("show", id=1))

@app.route("/items/<int:id>")
def show(id):
    if id > 100:
        abort(404)  # 存在しない ID は 404 にする
    return f"ID: {id}"

@app.errorhandler(404)
def not_found(e):
    return {"error": "not found"}, 404
```

<pre><code class="tips">url_for にビュー関数の名前を渡して URL を作ると、
ルートのパスを変更しても、リンクを書き換えずに済む。</code></pre>

---

## Jinja2 <a id="jinja2" data-name="Jinja2"></a>

Flask にはテンプレートエンジンの Jinja2 が組み込まれており、HTML の中に Python の値や制御構文を埋め込める。<br>
テンプレートファイルはプロジェクト直下の `templates` ディレクトリに置き、`render_template` で呼び出す。

```text
project/
├── app.py
└── templates/
    └── index.html
```

### 基本の構文
{% raw %}
- `{{ 変数 }}`：値の出力
- `{% 文 %}`：`if` や `for` などの制御構文
- `{# コメント #}`：コメント（出力されない）

`{{ user.name }}` や `{{ items[0] }}` のように、属性や添字でも値を取り出せる。`{{ name|upper }}` のように `|` でフィルタを付けると、値を加工して出力できる。

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

`render_template` のキーワード引数が、テンプレート内の変数になる。

<pre><code class="example">@app.route("/")
def index():
    return render_template("index.html", title="Top", items=["a", "b", "c"])</code></pre>

### 自動エスケープ
`.html`、`.htm`、`.xml`、`.xhtml`、`.svg` のテンプレートでは、`{{ }}` で出力した値の HTML 特殊文字（`<`、`>`、`&` など）が自動でエスケープされる。XSS 対策として有効なので、信頼できる HTML を出力したい場合を除き、`|safe` フィルタは使わない。

### テンプレートの継承
共通のレイアウトを `base.html` にまとめ、各ページで差分だけを書ける。

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

## 静的ファイル <a id="static-files" data-name="静的ファイル"></a>

CSS、JavaScript、画像などの静的ファイルは、プロジェクト直下の `static` ディレクトリに置く。`/static/ファイル名` の URL で配信される。

```text
project/
├── app.py
├── static/
│   └── style.css
└── templates/
    └── index.html
```

テンプレートからは、`url_for` で URL を作る。

{% raw %}
```html
<link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
```
{% endraw %}

---

## 開発用サーバーの起動 <a id="development-server" data-name="開発用サーバー"></a>

### flask run で起動
カレントディレクトリの `app.py` 内で `app = Flask(__name__)` という形でインスタンスを生成している場合は、`flask run` で起動できる。

### 環境変数を設定して起動
デフォルトでは、モジュール名が `app.py` (または `wsgi.py`)、Flask オブジェクトが `app` となっているので、変更する場合は環境変数を設定して起動する。<br>
`export FLASK_APP=app.py` もしくは `export FLASK_APP=モジュール名:オブジェクト名` として<br>`flask run` で起動。

<pre><code class="tips">python-dotenv をインストールしておくと、flask コマンドは .env や .flaskenv を自動で読み込む。
FLASK_APP などの環境変数を、ファイルにまとめて書いておける。</code></pre>

### --app オプションで起動
`flask --app モジュール名:オブジェクト名 run` と指定する。Flask オブジェクト名が app の場合は、オブジェクト名を省略可能。
<pre><code class="example">flask --app app run</code></pre>
`--app` は `run` の前に書く。

### デバッグモードで起動
`--debug` オプションを付けると、コードの変更時に自動で再読み込みされ、エラー時にはブラウザ上でトレースバックが表示される。

<pre><code class="example">flask --app app run --debug</code></pre>

<pre><code class="caution">デバッグモードは任意のコードをブラウザから実行できてしまうため、
本番環境では絶対に有効にしない。</code></pre>

### Python スクリプト内で直接起動

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, Flask!"

if __name__ == "__main__":
    app.run(debug=True)
```

`python app.py` で起動できる。

### Docker でサーバーをホストに公開
デフォルトでは `127.0.0.1` でしか待ち受けないため、コンテナ内で起動してもホストからはアクセスできない。`--host=0.0.0.0` を指定すると、コンテナ外からアクセスできる。
<pre><code class="tips">flask run --host=0.0.0.0 # この指定でホストからアクセスできる</code></pre>

あわせて、コンテナのポートをホストに公開する必要がある (Flask の既定のポートは 5000)。

```dockerfile
CMD ["flask", "--app", "app", "run", "--host=0.0.0.0"]
```

```bash
docker run -p 5000:5000 my-flask-app
```

<pre><code class="caution">flask runやapp.run()の開発用サーバーは本番用ではない。
本番ではGunicornなどのWSGIサーバーを使う。</code></pre>

---

## テスト <a id="testing" data-name="テスト"></a>

`app.test_client()` を使うと、サーバーを起動せずに、リクエストを送ってレスポンスを確認できる。pytest と組み合わせて使う。

```python
import pytest

from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    return app.test_client()

def test_search(client):
    res = client.get("/search?q=test")
    assert res.status_code == 200
    assert "test" in res.get_data(as_text=True)

def test_create_user(client):
    # json 引数で、JSON のリクエストボディを送る
    res = client.post("/api/users", json={"name": "taro"})
    assert res.status_code == 201
    assert res.get_json()["status"] == "created"
```

```bash
pytest
```

| 要素 | 内容 |
| --- | --- |
| `client.get(パス)` | GET リクエストを送る |
| `client.post(パス, data=...)` | フォームデータを送る |
| `client.post(パス, json=...)` | JSON を送る |
| `res.status_code` | ステータスコード |
| `res.get_json()` | レスポンスを JSON として読む |
| `res.get_data(as_text=True)` | レスポンスの本文を文字列で読む |

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `405 Method Not Allowed` | `methods` を指定せずに、POST を受けようとしている (デフォルトは GET のみ) | `methods=["GET", "POST"]` を指定するか、`@app.post` を使う |
| `400 Bad Request` | `request.form['name']` などで、存在しないキーを読んだ | `request.form.get('name')` を使う |
| `415 Unsupported Media Type` | `Content-Type: application/json` が無いのに、`request.get_json()` を呼んだ | クライアント側でヘッダーを付ける |
| `TemplateNotFound` | `templates` ディレクトリの場所や名前が違う | `app.py` と同じ階層に、`templates` を置く |
| `Could not locate a Flask application` | `--app` を指定しておらず、`app.py` も見つからない | `flask --app モジュール名 run` と指定する |
| `Working outside of request context` | リクエスト処理の外で、`request` を使った | ビュー関数の中で使う。テストでは `test_request_context()` を使う |
| `/search/abc` が 404 になる | `<int:id>` の型に、値が合っていない | 型を `string` にするか、URL を修正する |
| コンテナ内で起動したのに、ホストから開けない | `127.0.0.1` でしか待ち受けていない | `--host=0.0.0.0` を指定して、`-p` でポートも公開する |
| ポート 5000 で起動できない | 他のプロセスが使っている (macOS では、AirPlay レシーバーが使うことがある) | `--port 5001` のように、別のポートを指定する |
| テンプレートに渡した HTML が、タグのまま表示される | 自動エスケープが働いている | 信頼できる値に限って、safe フィルタを使う |
| 本番で、デバッグ画面が見える | `--debug` や `debug=True` を、本番でも有効にしている | 本番では無効にして、Gunicorn などの WSGI サーバーで動かす |

---

## 関連 <a id="ecosystem" data-name="関連"></a>

| パッケージ | 用途 |
| --- | --- |
| Werkzeug | WSGI のユーティリティ。Flask の土台 |
| Jinja2 | テンプレートエンジン |
| Gunicorn | 本番用の WSGI サーバー |
| pytest | テスト |
| python-dotenv | `.env` と `.flaskenv` の読み込み |
| Flask-SQLAlchemy | SQLAlchemy との連携 |
| Flask-WTF | フォームと CSRF 対策 |
| Flask-Login | ログインとセッションの管理 |
| Flask-CORS | CORS の設定 |
