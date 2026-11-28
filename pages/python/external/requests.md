---
title: requests
layout: default
---

# requests <a id="top" data-name="TOP"></a>

requests は、HTTP リクエストを簡単に送信できるライブラリ。<br>
GET や POST の送信、ヘッダーやクエリパラメータの指定、JSON の送受信、セッションの管理などを、短いコードで書ける。

```bash
pip install requests
```

```python
import requests
```

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 簡潔な API | `requests.get()`、`requests.post()` など、HTTP メソッドと同じ名前の関数で送信できる |
| JSON の送受信 | `json=` で送信し、`response.json()` で受信する |
| セッション | Cookie や共通のヘッダーを引き継ぎ、接続を使い回せる |
| 同期処理 | リクエストの完了まで、処理が止まる。非同期には対応していない |

### 他の選択肢との比較

| | `requests` | `urllib.request` | `httpx` | `aiohttp` |
| --- | --- | --- | --- | --- |
| インストール | 必要 | 不要 (標準) | 必要 | 必要 |
| コードの量 | 少ない | 多い | 少ない | やや多い |
| 非同期 | ✕ | ✕ | ○ | ○ |
| 同期 | ○ | ○ | ○ | ✕ |

<pre><code class="tips">標準ライブラリだけで済ませたいときは urllib.request を使う。
非同期で大量のリクエストを送りたいときは、httpx や aiohttp を使う。</code></pre>

<pre><code class="caution">requests には、タイムアウトの既定値がない。timeout を指定しないと、相手が応答しない場合に、無限に待ち続けることがある。
このドキュメントのコードも、実際に使うときは、timeout を付ける。</code></pre>

<pre><code class="tips">このドキュメントは、requests 2.34 系 (2026年) を前提にしている。
2.34 系では、型の注釈の追加と、Python 3.14t、3.15 への対応が行われた。Python 3.8 のサポートは終了している。
2.33.1 には、requests.utils.extract_zipped_paths のセキュリティ修正 (CVE-2026-25645) が含まれる。通常の使い方では影響しないが、最新のパッチにそろえておく。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

```bash
pip install requests
```

```python
import requests

response = requests.get("https://httpbin.org/get", timeout=5)
print(response.status_code)
```

```text
200
```

仮想環境を使っている場合は、仮想環境を有効にしてから、インストールする。

---

## GETリクエスト <a id="get" data-name="GETリクエスト"></a>

```python
response = requests.get("https://jsonplaceholder.typicode.com/todos/1")
print(response.status_code)  # ステータスコードを取得
print(response.json())  # JSONレスポンスを取得
```

```text
200
{'userId': 1, 'id': 1, 'title': 'delectus aut autem', 'completed': False}
```

出力は、API のデータによって変わる。

---

## レスポンスの扱い <a id="response" data-name="レスポンスの扱い"></a>

`requests.get()` などは、`Response` オブジェクトを返す。

| 属性・メソッド | 内容 |
| --- | --- |
| `status_code` | ステータスコード (200 など) |
| `ok` | ステータスコードが 400 未満なら `True` |
| `text` | ボディを、文字列として取得する |
| `content` | ボディを、バイト列として取得する |
| `json()` | ボディを JSON として解析し、辞書やリストにする |
| `headers` | レスポンスヘッダー (大文字小文字を区別しない辞書) |
| `url` | 実際にアクセスした URL (リダイレクト後の URL) |
| `cookies` | レスポンスの Cookie |
| `elapsed` | リクエストから、レスポンスが届くまでの時間 |
| `history` | リダイレクトの途中のレスポンスのリスト |
| `raise_for_status()` | ステータスコードが 4xx か 5xx なら、`HTTPError` を `raise` する |

```python
import requests

response = requests.get("https://httpbin.org/get", timeout=5)

print(response.status_code)
print(response.headers["Content-Type"])
print(response.elapsed.total_seconds())
```

### エラー処理

4xx や 5xx のステータスコードでも、requests は、例外を出さない。`raise_for_status()` を呼ぶと、例外になる。

```python
import requests

try:
    response = requests.get("https://httpbin.org/status/404", timeout=5)
    response.raise_for_status()  # 4xx と 5xx を、例外にする
except requests.exceptions.HTTPError as e:
    print("HTTP エラー:", e)
except requests.exceptions.Timeout:
    print("タイムアウト")
except requests.exceptions.RequestException as e:
    print("通信エラー:", e)
```

```text
HTTP エラー: 404 Client Error: NOT FOUND for url: https://httpbin.org/status/404
```

| 例外 | 内容 |
| --- | --- |
| `requests.exceptions.RequestException` | requests のすべての例外の基底クラス |
| `requests.exceptions.ConnectionError` | 接続できない (DNS の失敗、接続の拒否など) |
| `requests.exceptions.Timeout` | タイムアウト (接続と読み取りの、どちらも含む) |
| `requests.exceptions.HTTPError` | `raise_for_status()` が出す、4xx や 5xx のエラー |
| `requests.exceptions.TooManyRedirects` | リダイレクトの回数が多すぎる |
| `requests.exceptions.JSONDecodeError` | `json()` で、JSON として解析できない |

<pre><code class="caution">response.json() は、ボディが JSON でないと JSONDecodeError になる。エラーページの HTML が返ってきた場合などに起きる。
先に status_code を確認するか、raise_for_status() を呼んでから、json() を使う。</code></pre>

---

## POSTリクエスト <a id="post" data-name="POSTリクエスト"></a>

```python
data = {"title": "foo", "body": "bar", "userId": 1}
response = requests.post("https://jsonplaceholder.typicode.com/posts", json=data)
print(response.status_code)
print(response.json())
```

`json=` と `data=` では、送られる形式が異なる。

| 引数 | 送られる形式 | `Content-Type` |
| --- | --- | --- |
| `json=` | JSON | `application/json` |
| `data=` (辞書) | フォームの形式 (`key=value&...`) | `application/x-www-form-urlencoded` |
| `data=` (文字列・バイト列) | そのままのボディ | 自分でヘッダーに指定する |
| `files=` | ファイルのアップロード | `multipart/form-data` |

```python
# フォームの形式で送る
response = requests.post("https://httpbin.org/post", data={"name": "taro"}, timeout=5)
print(response.json()["form"])
```

```text
{'name': 'taro'}
```

PUT や PATCH も、同じ引数で送れる。

```python
response = requests.put(
    "https://jsonplaceholder.typicode.com/posts/1",
    json={"title": "updated"},
    timeout=5,
)
response = requests.patch(
    "https://jsonplaceholder.typicode.com/posts/1",
    json={"title": "patched"},
    timeout=5,
)
```

<pre><code class="caution">JSON を送りたいのに data= に辞書を渡すと、フォームの形式で送られて、サーバーが受け取れないことがある。
JSON は、json= で送る。</code></pre>

---

## ヘッダーの書き方 <a id="headers" data-name="ヘッダーの書き方"></a>

```python
headers = {"User-Agent": "MyApp"}
response = requests.get("https://httpbin.org/get", headers=headers)
print(response.json())
```

よく使うヘッダーは、次のとおり。

| ヘッダー | 内容 |
| --- | --- |
| `User-Agent` | クライアントの名前 (既定は `python-requests/バージョン`) |
| `Accept` | 受け取りたい形式 (`application/json` など) |
| `Authorization` | 認証の情報 (トークンなど) |
| `Content-Type` | 送るボディの形式 |

```python
headers = {"Authorization": "Bearer <トークン>"}
response = requests.get("https://httpbin.org/bearer", headers=headers, timeout=5)
```

<pre><code class="tips">Basic 認証は、auth=("ユーザー名", "パスワード") と書ける。
Authorization ヘッダーを自分で作る必要はない。</code></pre>

---

## クエリパラメータの書き方 <a id="params" data-name="クエリパラメータの書き方"></a>

```python
params = {"q": "python", "page": 1}
response = requests.get("https://www.example.com/search", params=params)
print(response.url)  # 実際のURLを確認
```

```text
https://www.example.com/search?q=python&page=1
```

値にリストを渡すと、同じキーが繰り返される。値が `None` のキーは、送られない。

```python
params = {"tag": ["python", "web"], "page": None}
response = requests.get("https://httpbin.org/get", params=params, timeout=5)
print(response.url)
```

```text
https://httpbin.org/get?tag=python&tag=web
```

<pre><code class="tips">URL に、クエリを手書きで連結せず、params= を使う。日本語や記号は、自動でエンコードされる。</code></pre>

---

## タイムアウトの指定 <a id="timeout" data-name="タイムアウトの指定"></a>

```python
response = requests.get("https://httpbin.org/delay/5", timeout=3)  # 3秒でタイムアウト
```

この例は、3 秒以内に応答がないため、`requests.exceptions.Timeout` が発生する。

| 指定 | 内容 |
| --- | --- |
| `timeout=3` | 接続と、読み取りの待ち時間を、どちらも 3 秒にする |
| `timeout=(3, 10)` | 接続は 3 秒、読み取りは 10 秒にする |
| `timeout=None` | 無期限に待つ (既定) |

<pre><code class="caution">timeout の値は、レスポンス全体を取得する時間の上限ではない。接続の確立と、データが届くまでの待ち時間の上限である。
大きなファイルをゆっくり受信している場合は、timeout を超えても、エラーにならない。</code></pre>

---

## ファイルのアップロード <a id="upload" data-name="ファイルのアップロード"></a>

```python
files = {"file": open("example.txt", "rb")}
response = requests.post("https://httpbin.org/post", files=files)
print(response.json())
```

この書き方は、ファイルを閉じていない。`with` を使うと、確実に閉じられる。

```python
with open("example.txt", "rb") as f:
    files = {"file": f}
    response = requests.post("https://httpbin.org/post", files=files, timeout=10)

print(response.json()["files"])
```

ファイル名や `Content-Type` を指定するときは、タプルで渡す。

```python
with open("example.txt", "rb") as f:
    files = {"file": ("report.txt", f, "text/plain")}  # (ファイル名, ファイル, Content-Type)
    response = requests.post("https://httpbin.org/post", files=files, timeout=10)
```

### ファイルのダウンロード <a id="download"></a>

大きなファイルは、`stream=True` で、少しずつ受信する。

```python
import requests

url = "https://httpbin.org/bytes/1024"

with requests.get(url, stream=True, timeout=10) as response:
    response.raise_for_status()
    with open("data.bin", "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
```

<pre><code class="tips">stream=True を付けないと、ボディ全体が、メモリに読み込まれる。
stream=True を付けたときは、with で囲むか、response.close() を呼んで、接続を解放する。</code></pre>

---

## セッションの利用 <a id="session" data-name="セッションの利用"></a>

```python
session = requests.Session()
session.get("https://httpbin.org/cookies/set/sessioncookie/123456")
response = session.get("https://httpbin.org/cookies")
print(response.json())  # {"cookies": {"sessioncookie": "123456"}}
```

`Session` は、Cookie を引き継ぎ、同じホストへの接続を使い回す。

| 機能 | 内容 |
| --- | --- |
| Cookie の保持 | 受け取った Cookie を、以降のリクエストに自動で付ける |
| 共通のヘッダー | `session.headers.update({...})` で、すべてのリクエストに付けるヘッダーを設定する |
| 共通の認証 | `session.auth = ("user", "pass")` で、すべてのリクエストに認証を付ける |
| 接続の再利用 | 同じホストへの、連続したリクエストが速くなる |

```python
import requests

with requests.Session() as session:  # 終了時に、接続が閉じられる
    session.headers.update({"User-Agent": "MyApp"})
    response = session.get("https://httpbin.org/headers", timeout=5)
    print(response.json()["headers"]["User-Agent"])
```

```text
MyApp
```

<pre><code class="caution">Session には、timeout を、まとめて設定する方法がない。リクエストごとに、timeout を指定する。
同じホストに、何度もリクエストを送るなら、requests.get() を繰り返すより、Session を使う方がよい。</code></pre>

### リトライの設定 <a id="retry"></a>

一時的なエラーに備えて、自動でリトライするには、`HTTPAdapter` に `Retry` を渡す。

```python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

retry = Retry(
    total=3,                                     # 最大 3 回、やり直す
    backoff_factor=0.5,                          # 待ち時間を、少しずつ延ばす
    status_forcelist=[429, 500, 502, 503, 504],  # このステータスコードで、やり直す
)

session = requests.Session()
session.mount("https://", HTTPAdapter(max_retries=retry))

response = session.get("https://httpbin.org/get", timeout=5)
```

<pre><code class="tips">Retry の既定では、POST などの、副作用のあるメソッドはリトライされない。リトライするメソッドは、allowed_methods で指定する。</code></pre>

---

## DELETEリクエスト <a id="delete" data-name="DELETEリクエスト"></a>

```python
url = "https://jsonplaceholder.typicode.com/todos/1"  # 削除したいリソースのURL
response = requests.delete(url)

print(response.status_code)  # ステータスコードを確認
print(response.text)  # レスポンスボディを表示（削除後に特別なメッセージが返ってくる場合もある）
```

<pre><code class="tips">API によって、削除の成功は、200 や 204 (ボディなし) で返る。ボディがないときに response.json() を呼ぶと、エラーになる。
JSONPlaceholder は、テスト用の API で、実際にはデータを変更しない。</code></pre>

---

## 認証とその他のオプション <a id="options" data-name="認証とその他のオプション"></a>

| 引数 | 内容 |
| --- | --- |
| `auth=("user", "pass")` | Basic 認証 |
| `allow_redirects=False` | リダイレクトに従わない (`get()` の既定は `True`) |
| `verify=False` | SSL 証明書を検証しない (開発用のみ) |
| `verify="/path/to/ca.pem"` | 指定した CA の証明書で検証する |
| `proxies={...}` | プロキシを指定する (`{"https": "http://proxy:8080"}` の形) |
| `cookies={...}` | リクエストに Cookie を付ける |
| `stream=True` | ボディを、すぐには読み込まない |

<pre><code class="caution">verify=False は、通信相手を確認しないため、安全ではない。本番のコードでは使わない。
証明書のエラーは、CA の証明書を指定して、解決する。</code></pre>

---

## 実践例 <a id="practice" data-name="実践例"></a>

エラー処理、タイムアウト、リトライを備えた、JSON の取得用の関数。

```python
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


def create_session():
    # リトライとヘッダーを設定した Session を作る
    retry = Retry(total=3, backoff_factor=0.5, status_forcelist=[429, 500, 502, 503, 504])
    session = requests.Session()
    session.mount("https://", HTTPAdapter(max_retries=retry))
    session.headers.update({"User-Agent": "MyApp/1.0"})
    return session


def fetch_todo(session, todo_id):
    url = f"https://jsonplaceholder.typicode.com/todos/{todo_id}"
    try:
        response = session.get(url, timeout=(3, 10))
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print("取得に失敗した:", e)
        return None


if __name__ == "__main__":
    with create_session() as session:
        todo = fetch_todo(session, 1)
        if todo:
            print(todo["title"])
```

---

## テスト <a id="testing" data-name="テスト"></a>

外部の API にアクセスするテストは、通信の失敗や、データの変化で、不安定になる。`unittest.mock` で、`requests` を置き換える。

```python
from unittest.mock import Mock, patch

import requests


def fetch_title(todo_id):
    response = requests.get(
        f"https://jsonplaceholder.typicode.com/todos/{todo_id}", timeout=5
    )
    response.raise_for_status()
    return response.json()["title"]


def test_fetch_title():
    mock_response = Mock()
    mock_response.json.return_value = {"title": "foo"}
    mock_response.raise_for_status.return_value = None

    with patch("requests.get", return_value=mock_response) as mock_get:
        assert fetch_title(1) == "foo"

    mock_get.assert_called_once()
```

<pre><code class="tips">patch の対象は、requests.get のように、関数を使う側から見える名前にする。
from requests import get と書いているコードは、patch("モジュール名.get") で置き換える。
リクエストの内容まで検証したい場合は、responses や requests-mock などの、専用のライブラリがある。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| 処理が、いつまでも終わらない | `timeout` がない (既定は無期限) | すべてのリクエストに、`timeout` を指定する |
| 404 や 500 でも、例外が出ない | requests は、ステータスコードでは、例外を出さない | `raise_for_status()` を呼ぶ |
| `requests.exceptions.JSONDecodeError` | ボディが JSON ではない (エラーページの HTML など) | ステータスコードと、`Content-Type` を確認してから、`json()` を呼ぶ |
| JSON を送ったのに、サーバーが受け取れない | `data=` に辞書を渡して、フォームの形式で送っている | `json=` を使う |
| `response.text` が文字化けする | 文字コードの推定が、合っていない | `response.encoding = "utf-8"` のように指定する。または `response.content` を自分でデコードする |
| `SSLError` や `CERTIFICATE_VERIFY_FAILED` | 証明書を検証できない (社内のプロキシ、古い CA の情報など) | CA の証明書を `verify=` で指定する。`verify=False` は、開発用に限る |
| `ConnectionError` | DNS の失敗、接続の拒否、ネットワークの断絶など | URL、ネットワーク、プロキシの設定を確認する |
| POST が、リダイレクトの後に、GET になる | 301、302、303 のリダイレクトでは、メソッドが GET に変わる | リダイレクト先の URL に、直接 POST する |
| `Session` の設定が、反映されない | `requests.get()` で送っていて、`session.get()` を使っていない | `session` のメソッドで送る |
| ファイルを送った後も、ファイルが開いたまま | `open()` の結果を、`with` なしで渡している | `with open(...)` で渡す |
| `stream=True` の後に、接続が解放されない | ボディを最後まで読んでいない。または `close()` を呼んでいない | `with` で囲むか、`response.close()` を呼ぶ |
| `ModuleNotFoundError: No module named 'requests'` | 別の Python 環境に、インストールされている | 使っている仮想環境で、`pip install requests` を実行する |

---

## 関連 <a id="ecosystem" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| `urllib.request` | 標準ライブラリの HTTP クライアント |
| `httpx` | 同期と非同期の両方に対応した、HTTP クライアント |
| `aiohttp` | 非同期の HTTP クライアントとサーバー |
| `responses` / `requests-mock` | `requests` を使うコードのテスト用のモック |
| `urllib3` | requests の内部で使われている、低レベルの HTTP ライブラリ |
