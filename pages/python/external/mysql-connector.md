---
title: FastAPI
layout: default
---

# MySQL-Connector <a id="top" data-name="TOP">

```python
pip install mysql-connector-python import mysql.connector
```

### 接続

- 引数として設定を渡す

```python
connection = mysql.connector.connect(
user="username", # データベースにアクセスするユーザー
password="password", # mysqlのパスワード
host="hostname", # mysqldが実行されているホスト名
database="database_name" # 使用するデータベース名
)
```

- 辞書としてconfigを定義

```python
config = {
'user': 'your_username', # データベースにアクセスするユーザー
'password': 'your_password', # mysqlのパスワード
'host': 'your_host', # mysqldが実行されているホスト名
'database': 'your_database' # 使用するデータベース名
}
# この記述で接続の情報と実行を切り分けられる
connection = mysql.connector.connect(**config)
```

### クエリの実行

- cursorはクエリを実行するためのオブジェクトで、クエリの実行が終わった後には使用を終了したカーソルを閉じることが推奨される。