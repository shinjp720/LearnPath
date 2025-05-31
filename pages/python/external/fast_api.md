<div data-title="FastAPI"></div>
<a id="top" data-name="TOP"></a>

# FastAPI

- FastAPIはPythonのWebAPIフレームワークで、非常に高速で少ないコードでAPIを実装できる。

```python
pip install fastapi uvicorn
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

## 実行コマンド

```python
uvicorn main:app --reload
```

| コマンド | 意味                       |
| -------- | -------------------------- |
| main     | ファイル名                 |
| app      | FastAPIインスタンス名      |
| --reload | コード変更時に自動リロード |

## パスパラメータとクエリパラメータ

### パスパラメータ

```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}
# /items/123 → item_id = 123
```

### クエリパラメータ

```python
@app.get("/items/")
def read_item(q: str = None):
    return {"q": q}
# /items/?q=hello → q = "hello"
```

## ローカルファイルを返す
: FastAPIでファイルをクライアントに返すには、`FileResponse`を使う。
<pre><code class="example">from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI()

@app.get("/download")
def download_file():
    file_path = "example.txt"
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename="downloaded_example.txt", media_type="application/octet-stream")
    return {"error": "File not found"}</code></pre>

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

### Swagger UI (操作可能なドキュメント)
` http://localhost:8000/docs`

### ReDoc (読みやすいドキュメント)
`http://localhost:8000/redoc`


## PydanticのBaseModelによるバリデーションとJavaScriptによるPOST

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


## 次に学ぶべきこと
- 非同期処理 (async/await)
- ルーター分割（APIRouter）
- ミドルウェアの追加
- SQL（ORMなし or SQLAlchemyとの連携）