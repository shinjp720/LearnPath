<div data-title="requests"></div>
<a id="top" data-name="TOP">

# requests

- requestsは、HTTPリクエストを簡単に送信できるライブラリ。

```python
pip install requests
import requests
```

---

## GETリクエスト

```python
response = requests.get("https://jsonplaceholder.typicode.com/todos/1")
print(response.status_code)  # ステータスコードを取得
print(response.json())  # JSONレスポンスを取得
```

---

## POSTリクエスト

```python
data = {"title": "foo", "body": "bar", "userId": 1}
response = requests.post("https://jsonplaceholder.typicode.com/posts", json=data)
print(response.status_code)
print(response.json())
```

---

## ヘッダーの書き方

```python
headers = {"User-Agent": "MyApp"}
response = requests.get("https://httpbin.org/get", headers=headers)
print(response.json())
```

---

## クエリパラメータの書き方

```python
params = {"q": "python", "page": 1}
response = requests.get("https://www.example.com/search", params=params)
print(response.url)  # 実際のURLを確認
```

---

## タイムアウトの指定

```python
response = requests.get("https://httpbin.org/delay/5", timeout=3)  # 3秒でタイムアウト
```

## ファイルのアップロード

```python
files = {"file": open("example.txt", "rb")}
response = requests.post("https://httpbin.org/post", files=files)
print(response.json())
```

---

## セッションの利用

```python
session = requests.Session()
session.get("https://httpbin.org/cookies/set/sessioncookie/123456")
response = session.get("https://httpbin.org/cookies")
print(response.json())  # {"cookies": {"sessioncookie": "123456"}}
```

---

## DELETEリクエスト

```python
url = "https://jsonplaceholder.typicode.com/todos/1"  # 削除したいリソースのURL
response = requests.delete(url)

print(response.status_code)  # ステータスコードを確認
print(response.text)  # レスポンスボディを表示（削除後に特別なメッセージが返ってくる場合もあります）
```