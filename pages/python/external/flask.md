<div data-title="Flask"></div>
<a id="top" data-name="TOP"></a>

# Flask

- Flaskは、Python製の軽量・柔軟なWebアプリケーション・マイクロフレームワーク。

```python
pip install flask
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
<pre><code class="tips">name = request.args.get('name', 'Gest')
のように書くと'Gest'がデフォルト値となり、
?name=が無かった場合には'Gest'が返る。</code></pre>

#### パスパラメータ
リクエストは`/search/123`のように`/123`と書いて、パスの一部として含める。リソースを一意に識別する情報に適している。<br>
データの取得は`@app.route('/search/<int:id)`のようにルーティングで定義する。

<div class="subtitle">静的ルーティング</div>
固定されたURLパスに対して特定の関数を紐づけるもので、静的ルーティングは同じパスに対して常に同じ動作を行う。

<pre><code class="example">@app.route("/")
def index():
    return render_template("index.html", title="Top")</code></pre>

<div class="subtitle">動的ルーティング</div>
URLパスの一部を変数として定義し、その値を関数に渡すことができる。これにより、動的にURLを処理できる。<br>GETのパスパラメータの処理は、この動的ルーティングで定義する。

### POST














<a id="jinja2" data-name="Jinja2">








<a id="development_server" data-name="開発用サーバー">

## 開発用サーバーの起動

### flask funで起動
カレントディレクトリに`app.py`内で`app = Flask(__name__)`という形でインスタンスを生成している場合は`flask run`で起動できる。

### 環境変数を設定して起動
デフォルトでは、モジュール名が`app.py`、Flaskオブジェクトが`app`となっているので、変更する場合は環境変数を設定して起動する。<br>
`export FLASK_APP=app.py` もしくは`export FLASK_APP=モジュール名:オブジェクト名`として<br>`flask run`で起動。

### --appオプションで起動
`flask --app モジュール名:オブジェクト名`と指定する。Flaskオブジェクト名がappの場合はオブジェクト名を省略可能。 flask --app app run

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

### Dockerでサーバーをホストに公開
<pre><code class="tips">flask run --host=0.0.0.0 # この指定でホストからアクセスできる</code></pre>

