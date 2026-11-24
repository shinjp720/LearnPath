---
title: FastAPI
layout: default
---

# FastAPI <a id="top" data-name="TOP"></a>

- FastAPIはPythonのWebAPIフレームワークで、非常に高速で少ないコードでAPIを実装できる。
- 型ヒントをもとに、リクエストのバリデーションと自動ドキュメント生成を行ってくれる。

```bash
pip install fastapi uvicorn
```

```python
from fastapi import FastAPI
```

---

## 基本的な構成

<div class="subtitle">main.py</div>

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}
```

辞書を返すと、FastAPIが自動でJSONに変換してレスポンスにする。

## 実行コマンド

```bash
uvicorn main:app --reload
```

| コマンド | 意味                       |
| -------- | -------------------------- |
| main     | ファイル名                 |
| app      | FastAPIインスタンス名      |
| --reload | コード変更時に自動リロード |

<pre><code class="tips">--reloadは開発用のオプション。本番では付けない。
Dockerなどコンテナ内で起動してホストからアクセスしたい場合は、
uvicorn main:app --host 0.0.0.0 のようにホストを指定する。</code></pre>

最近のバージョンでは、`pip install "fastapi[standard]"`で入れて`fastapi dev main.py`と書いても開発用サーバーを起動できる。

## パスパラメータとクエリパラメータ

### パスパラメータ

```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}
# /items/123 → item_id = 123
```

型ヒントの`int`により、`/items/abc`のように数値でない値が来た場合は自動で422エラー(バリデーションエラー)になる。

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

## ローカルファイルを返す
FastAPIでファイルをクライアントに返すには、`FileResponse`を使う。

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

エラーの場合に`return {"error": ...}`と書くとステータスコードが200のままになってしまうため、`HTTPException`を`raise`して適切なステータスコードを返す。

<div class="subtitle">各引数</div>

| 引数       | 意味                                 |
| ---------- | ------------------------------------ |
| path       | ファイルのパス                       |
| filename   | ダウンロード時のファイル名(省略可能) |
| media_type | MIMEタイプ                           |

<div class="subtitle">media_type例</div>

| ファイルタイプ | MIMEタイプ      |
| -------------- | --------------- |
| テキスト       | text/plain      |
| PDF            | application/pdf |
| 画像(PNG)      | image/png       |
| ZIP            | application/zip |


## 自動ドキュメント
FastAPIは型ヒントからOpenAPIの仕様を自動で生成し、それをもとにしたドキュメントを提供する。コードを書き換えるとドキュメントにも反映される。

### Swagger UI (操作可能なドキュメント)
`http://localhost:8000/docs`<br>
ブラウザ上から各エンドポイントにリクエストを送って動作確認ができる。

### ReDoc (読みやすいドキュメント)
`http://localhost:8000/redoc`


## PydanticのBaseModelによるバリデーションとJavaScriptによるPOST
リクエストボディ(JSON)は、PydanticのBaseModelを継承したクラスを引数の型として指定すると受け取れる。型に合わないデータが送られた場合は、自動で422エラーが返る。

<div class="subtitle">FastAPI側(バックエンド)</div>
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

`item.name`のように属性としてアクセスできる。辞書に変換したい場合は`item.model_dump()`を使う(Pydantic v2。v1では`item.dict()`)。

<div class="subtitle">JavaScript側(フロントエンド)</div>
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

### CORSの設定
フロントエンドとバックエンドでオリジン(スキーム・ホスト・ポート)が異なると、ブラウザのCORS制限によりリクエストがブロックされる。例えば、`http://localhost:3000`のページから`http://localhost:8000`のAPIを呼ぶ場合が該当する。<br>
FastAPI側で`CORSMiddleware`を追加して、許可するオリジンを指定する。

<pre><code class="example">from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)</code></pre>

<pre><code class="tips">allow_origins=["*"] はすべてのオリジンを許可するため、
開発中以外は使わず、必要なオリジンだけを指定する。</code></pre>


## 次に学ぶべきこと
- 非同期処理 (async/await)
- ルーター分割（APIRouter）
- ミドルウェアの追加
- SQL（ORMなし or SQLAlchemyとの連携）
