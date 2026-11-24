---
title: FastAPI
layout: default
---

# FastAPI <a id="top" data-name="TOP"></a>

FastAPI は Python の Web API フレームワークで、非常に高速で、少ないコードで API を実装できる。<br>
型ヒントをもとに、リクエストのバリデーションと自動ドキュメント生成を行ってくれる。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 型ヒントによるバリデーション | パスやクエリ、リクエストボディの型を、関数の引数の型ヒントで宣言する |
| 自動ドキュメント | OpenAPI の仕様を自動で生成し、Swagger UI と ReDoc で表示する |
| 非同期に対応 | ASGI ベースで、`async def` と `def` の両方を書ける |
| データモデル | Pydantic の `BaseModel` で、リクエストとレスポンスの形を定義する |

- 向いている場面: JSON を返す API、フロントエンド (JavaScript) から呼ばれるバックエンド。
- 向いていない場面: テンプレートで HTML を返す小さなアプリや、管理画面・ORM・認証が一式欲しい場合は、Flask や Django のほうが手軽なことがある。

<pre><code class="caution">FastAPI は、バージョンが 0.x のため、バージョンごとに挙動が変わることがある。
0.127.0 (2025年12月ごろ) で Pydantic v1 のサポートが終了したため、このドキュメントは Pydantic v2 を前提にしている。
新しいバージョンでは、Python 3.10 以降が必要になっている (0.135.3 で確認)。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

仮想環境を作って、その中にインストールする (venv と pip については、それぞれのドキュメントを参照)。

```bash
pip install fastapi uvicorn
```

最近のドキュメントでは、開発に必要なものをまとめて入れる、次の書き方が案内されている。`fastapi` コマンド (FastAPI CLI) や uvicorn なども一緒に入る。

```bash
pip install "fastapi[standard]"
```

```python
from fastapi import FastAPI
```

<pre><code class="tips">fastapi[standard] の [ ] は、シェルによっては特別な意味を持つため、必ず引用符で囲む。
uv を使う場合は、uv add "fastapi[standard]" で追加できる。</code></pre>

---

## 基本的な構成 <a id="basic" data-name="基本的な構成"></a>

<div class="subtitle">main.py</div>

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}
```

辞書を返すと、FastAPI が自動で JSON に変換してレスポンスにする。

---

## 実行コマンド <a id="run" data-name="実行コマンド"></a>

```bash
uvicorn main:app --reload
```

| 部分 | 意味 |
| --- | --- |
| main | ファイル名 |
| app | FastAPI インスタンス名 |
| --reload | コード変更時に自動リロード |

<pre><code class="tips">--reloadは開発用のオプション。本番では付けない。
Dockerなどコンテナ内で起動してホストからアクセスしたい場合は、
uvicorn main:app --host 0.0.0.0 のようにホストを指定する。</code></pre>

最近のバージョンでは、`pip install "fastapi[standard]"` で入れて `fastapi dev main.py` と書いても、開発用サーバーを起動できる。

| コマンド | 内容 |
| --- | --- |
| `fastapi dev` | 開発用。自動リロードが有効で、`127.0.0.1` で待ち受ける |
| `fastapi run` | 本番用。自動リロードは、デフォルトで無効 |

`main.py` 内の `app` を、自動で探して起動する。ファイルを指定する場合は、`fastapi dev main.py` と書く。

<pre><code class="tips">fastapi dev は、127.0.0.1 でしか待ち受けない。
コンテナ内で起動する場合は、fastapi run を使い、--host 0.0.0.0 を明示しておく。</code></pre>

---

## パスパラメータとクエリパラメータ <a id="parameters" data-name="パスパラメータとクエリパラメータ"></a>

### パスパラメータ

```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}
# /items/123 → item_id = 123
```

型ヒントの `int` により、`/items/abc` のように数値でない値が来た場合は、自動で 422 エラー (バリデーションエラー) になる。

<pre><code class="caution">パスは、上から順に照合される。/users/me と /users/{user_id} を両方定義する場合は、
固定のパスである /users/me を、先に書く。
後に書くと、me が user_id として扱われてしまう。</code></pre>

### クエリパラメータ

```python
@app.get("/search/")
def search_items(q: str | None = None):
    return {"q": q}
# /search/?q=hello → q = "hello"
# /search/         → q = None
```

関数の引数のうち、パスに含まれないものがクエリパラメータとして扱われる。デフォルト値を指定すると省略可能になり、デフォルト値が無い場合は必須になる。

<pre><code class="tips">Python 3.9以前では str | None が使えないため、
Optional[str] = None (from typing import Optional) と書く。</code></pre>

<pre><code class="tips">同じURLパスに対して同じメソッドの関数を2つ定義すると、
先に書いた方が優先される。関数名やパスの重複に注意する。</code></pre>

<pre><code class="caution">/search/ と定義したパスに /search でアクセスすると、/search/ に転送される (307)。
パスの末尾のスラッシュは、定義とクライアントで揃える。</code></pre>

---

## ローカルファイルを返す <a id="file-response" data-name="ローカルファイルを返す"></a>
FastAPI でファイルをクライアントに返すには、`FileResponse` を使う。

<pre><code class="example">from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
import os

app = FastAPI()

@app.get("/download")
def download_file():
    file_path = "example.txt"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path=file_path, filename="downloaded_example.txt", media_type="application/octet-stream")</code></pre>

エラーの場合に `return {"error": ...}` と書くとステータスコードが 200 のままになってしまうため、`HTTPException` を `raise` して適切なステータスコードを返す。

<div class="subtitle">各引数</div>

| 引数 | 意味 |
| --- | --- |
| path | ファイルのパス |
| filename | ダウンロード時のファイル名 (省略可能) |
| media_type | MIME タイプ (省略した場合は、ファイル名から推測される) |

<div class="subtitle">media_type 例</div>

| ファイルタイプ | MIME タイプ |
| --- | --- |
| テキスト | text/plain |
| PDF | application/pdf |
| 画像 (PNG) | image/png |
| ZIP | application/zip |

<pre><code class="caution">ファイル名をクエリやパスパラメータで受け取り、そのままファイルのパスに使ってはいけない。
../ を含む値で、意図しないファイルが返されてしまう。
許可するファイルを、決まったディレクトリに限定して確認する。</code></pre>

---

## 自動ドキュメント <a id="auto-docs" data-name="自動ドキュメント"></a>
FastAPI は型ヒントから OpenAPI の仕様を自動で生成し、それをもとにしたドキュメントを提供する。コードを書き換えるとドキュメントにも反映される。

### Swagger UI (操作可能なドキュメント)
`http://localhost:8000/docs`<br>
ブラウザ上から各エンドポイントにリクエストを送って動作確認ができる。

### ReDoc (読みやすいドキュメント)
`http://localhost:8000/redoc`

### OpenAPI のスキーマ
`http://localhost:8000/openapi.json`<br>
上の 2 つのドキュメントの元になる、JSON 形式の仕様。クライアントコードの自動生成などに使える。

<pre><code class="tips">公開しない API では、FastAPI(docs_url=None, redoc_url=None) のように指定すると、
/docs と /redoc を無効にできる。</code></pre>

---

## Pydantic の BaseModel によるバリデーションと JavaScript による POST <a id="request-body" data-name="リクエストボディとPOST"></a>
リクエストボディ (JSON) は、Pydantic の BaseModel を継承したクラスを引数の型として指定すると受け取れる。型に合わないデータが送られた場合は、自動で 422 エラーが返る。

<div class="subtitle">FastAPI 側 (バックエンド)</div>
<pre><code class="example"># main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.post("/items/")
def create_item(item: Item):
    return {"message": "Item received", "item": item}</code></pre>

`item.name` のように属性としてアクセスできる。辞書に変換したい場合は `item.model_dump()` を使う (Pydantic v2。v1 では `item.dict()` だが、FastAPI は 0.127.0 以降 Pydantic v1 をサポートしていない)。

### Field による制約
`Field` を使うと、値の範囲や文字数などの制約を付けられる。制約に反するデータは、422 エラーになる。

```python
from pydantic import BaseModel, Field

class Item(BaseModel):
    name: str = Field(min_length=1, max_length=50)  # 1〜50 文字
    price: float = Field(gt=0)                      # 0 より大きい
```

| 引数 | 内容 |
| --- | --- |
| `gt` / `ge` | より大きい / 以上 |
| `lt` / `le` | より小さい / 以下 |
| `min_length` / `max_length` | 文字列の最小 / 最大の長さ |

型に合わないデータを送ると、次のような JSON のエラーが返る。`loc` が問題のある項目を示す。

```text
{"detail": [{"type": "float_parsing", "loc": ["body", "price"], "msg": "...", "input": "abc"}]}
```

<div class="subtitle">JavaScript 側 (フロントエンド)</div>
<pre><code class="example">fetch("http://localhost:8000/items/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "Apple",
    price: 1.99
  })
})
.then(response => response.json())
.then(data => {
  console.log("Response from API:", data);
})
.catch(error => {
  console.error("Error:", error);
});</code></pre>

<pre><code class="caution">fetch は、422 や 500 などのエラーのステータスコードでも、catch に入らない。
エラーを判定する場合は、response.ok を確認する。</code></pre>

### CORS の設定
フロントエンドとバックエンドでオリジン (スキーム・ホスト・ポート) が異なると、ブラウザの CORS 制限によりリクエストがブロックされる。例えば、`http://localhost:3000` のページから `http://localhost:8000` の API を呼ぶ場合が該当する。<br>
FastAPI 側で `CORSMiddleware` を追加して、許可するオリジンを指定する。

<pre><code class="example">from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)</code></pre>

<pre><code class="tips">allow_origins=["*"] はすべてのオリジンを許可するため、
開発中以外は使わず、必要なオリジンだけを指定する。</code></pre>

<pre><code class="caution">Cookie などの認証情報を送る場合 (allow_credentials=True) は、
allow_origins に ["*"] を指定しても機能しない。オリジンを、1 つずつ明示する。</code></pre>

---

## レスポンスモデルとステータスコード <a id="response-model" data-name="レスポンスモデル"></a>
`response_model` を指定すると、レスポンスの形を宣言できる。モデルに無い項目は、レスポンスから取り除かれるため、パスワードなど返したくない項目を、誤って返さずに済む。<br>
`status_code` で、成功時のステータスコードを指定できる。

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()

class ItemIn(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    price: float = Field(gt=0)

class ItemOut(BaseModel):
    id: int
    name: str

@app.post("/items/", response_model=ItemOut, status_code=201)
def create_item(item: ItemIn):
    # price は ItemOut に無いため、レスポンスから除かれる
    return {"id": 1, "name": item.name, "price": item.price}
```

| ステータスコード | 使いどころ |
| --- | --- |
| 200 | 取得や更新の成功 (デフォルト) |
| 201 | 作成の成功 (`status_code=201`) |
| 404 | 対象が無い (`HTTPException` を `raise` する) |
| 422 | 型や制約に合わないデータ (FastAPI が自動で返す) |

---

## 非同期処理 (async/await) <a id="async" data-name="非同期処理"></a>
エンドポイントの関数は、`def` でも `async def` でも書ける。

```python
import asyncio

from fastapi import FastAPI

app = FastAPI()

@app.get("/sync")
def read_sync():
    # 通常の関数。スレッドプールで実行される
    return {"type": "sync"}

@app.get("/async")
async def read_async():
    await asyncio.sleep(1)  # 待っている間も、他のリクエストを処理できる
    return {"type": "async"}
```

| 書き方 | 実行のされ方 | 向いている処理 |
| --- | --- | --- |
| `def` | スレッドプールで実行される | 同期のライブラリを使う処理 |
| `async def` | イベントループ上で実行される | `await` できる非同期のライブラリを使う処理 |

<pre><code class="caution">async def の中で time.sleep() や同期の DB・HTTP ライブラリを呼ぶと、
その間イベントループが止まり、すべてのリクエストが待たされる。
同期の処理を使う場合は、async を付けずに def で書く。</code></pre>

---

## テスト <a id="testing" data-name="テスト"></a>
`TestClient` を使うと、サーバーを起動せずに、リクエストを送ってレスポンスを確認できる。pytest と組み合わせて使う。

```python
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

def test_read_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json() == {"message": "Hello, FastAPI!"}

def test_invalid_item_id():
    # 数値でない値は、422 になる
    res = client.get("/items/abc")
    assert res.status_code == 422
```

```bash
pytest
```

<pre><code class="tips">TestClient は、内部で httpx を使う。fastapi[standard] には含まれているが、
fastapi だけをインストールした場合は、pip install httpx で追加する。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `422 Unprocessable Entity` | 型や制約に合わない値、または必須項目が無い | レスポンスの `detail` にある `loc` で、問題のある項目を確認する |
| <code>unsupported operand type(s) for &#124;</code> | Python 3.9 以前で、<code>str &#124; None</code> を使っている | Python 3.10 以降にするか、`Optional[str]` と書く |
| `Error loading ASGI app` | `main:app` の `main` が、実際のファイル名やカレントディレクトリと合っていない | ファイル名と、コマンドを実行している場所を確認する |
| ブラウザで `blocked by CORS policy` | 呼び出し元のオリジンが、許可されていない | `CORSMiddleware` で、オリジンを許可する |
| エラーなのに、ステータスコードが 200 | `return {"error": ...}` と書いている | `HTTPException` を `raise` する |
| `/search` へのアクセスが、307 で転送される | パスを `/search/` と定義している | 定義とクライアントで、末尾のスラッシュを揃える |
| `/users/me` が、`/users/{user_id}` として処理される | 固定のパスを、後に書いている | 固定のパスを、先に定義する |
| コンテナ内で起動したのに、ホストから開けない | `127.0.0.1` でしか待ち受けていない | `--host 0.0.0.0` を指定して、ポートも公開する |
| `PydanticDeprecatedSince20` の警告 | Pydantic v1 の書き方 (`dict()`、`class Config` など) を使っている | `model_dump()`、`model_config` など、v2 の書き方にする |
| 重い処理で、全体が遅くなる | `async def` の中で、同期の処理を呼んでいる | `def` で書くか、非同期のライブラリを使う |
| フォームやファイルのアップロードでエラーになる | `python-multipart` が入っていない | `pip install python-multipart` で追加する |
| `No module named 'httpx'` | `TestClient` に必要な httpx が入っていない | `pip install httpx` で追加する |

---

## 次に学ぶべきこと <a id="next-steps" data-name="次に学ぶべきこと"></a>

| 項目 | 内容 |
| --- | --- |
| 非同期処理 (async/await) | 基本は、<a href="#async">非同期処理</a>の章を参照。非同期の DB やライブラリとの組み合わせを学ぶ |
| ルーター分割 (APIRouter) | ファイルを分けて、`APIRouter` でエンドポイントをまとめる |
| ミドルウェアの追加 | 全リクエストに共通の処理を足す。CORS の設定も、ミドルウェアの 1 つ |
| SQL (ORM なし or SQLAlchemy との連携) | DB へ接続して、データを保存・取得する |

### 関連パッケージ

| パッケージ | 用途 |
| --- | --- |
| uvicorn | ASGI サーバー |
| Starlette | FastAPI の土台。ルーティングやミドルウェアを提供する |
| Pydantic | バリデーションとデータモデル |
| pytest / httpx | テスト |
| SQLAlchemy | DB との連携 |
| python-multipart | フォームやファイルのアップロード |
