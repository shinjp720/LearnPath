---
title: MySQL-Connector
layout: default
---

# MySQL-Connector <a id="top" data-name="TOP"></a>

MySQL-Connector (`mysql-connector-python`) は、Python から MySQL に接続して、SQL を実行するためのドライバ。Oracle が提供する公式のライブラリで、接続、クエリの実行、トランザクション、コネクションプールなどを扱える。

```bash
pip install mysql-connector-python
```

```python
import mysql.connector
```

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 公式のドライバ | MySQL を提供する Oracle が、メンテナンスしている |
| DB-API 2.0 | `connect()`、`cursor()`、`execute()` など、Python の標準的な DB の API に沿っている |
| 純 Python 実装 | C のライブラリへの依存がなく、`pip` だけで導入できる。C 拡張も、選択できる |
| コネクションプール | 接続を使い回す仕組みが、標準で付いている |

### 他の選択肢との比較

| | `mysql-connector-python` | `PyMySQL` | `mysqlclient` |
| --- | --- | --- | --- |
| 提供元 | Oracle (公式) | コミュニティ | コミュニティ |
| 実装 | 純 Python (C 拡張も可) | 純 Python | C 拡張 |
| 導入のしやすさ | ○ | ○ | 環境によって、ビルドが必要 |

<pre><code class="tips">Django などの ORM を使う場合は、ORM が対応するドライバを選ぶ。
SQL を直接書いて使うなら、この MySQL-Connector で足りる。</code></pre>

<pre><code class="caution">MySQL-Connector のバージョンの番号は、9.7.0 (2026年4月) の次から、26.x 系に変わった。26.7.0 (2026年7月) と 26.10.0 (2026年10月) が、公式のリリースノートに載っている。
9.6.0 と 9.7.0 は、MySQL Server のバージョンに合わせただけで、機能の変更はない。
古い記事の、8.0.x のバージョンの指定は、そのまま使わず、最新のバージョンを確認する。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

```bash
pip install mysql-connector-python
```

```python
import mysql.connector

print(mysql.connector.__version__)
```

```text
26.10.0
```

出力は、インストールしたバージョンによって変わる。

<pre><code class="tips">パッケージ名は mysql-connector-python で、import するモジュール名は mysql.connector である。名前が異なるため、混同しない。</code></pre>

---

## 接続 <a id="connect" data-name="接続"></a>

### 引数として設定を渡す

```python
connection = mysql.connector.connect(
    user="username",          # データベースにアクセスするユーザー
    password="password",      # MySQL のパスワード
    host="hostname",          # mysqld が実行されているホスト名
    database="database_name"  # 使用するデータベース名
)
```

### 辞書として config を定義

```python
config = {
    'user': 'your_username',      # データベースにアクセスするユーザー
    'password': 'your_password',  # MySQL のパスワード
    'host': 'your_host',          # mysqld が実行されているホスト名
    'database': 'your_database'   # 使用するデータベース名
}
# この記述で接続の情報と実行を切り分けられる
connection = mysql.connector.connect(**config)
```

### 主な接続のオプション

| オプション | 内容 |
| --- | --- |
| `user` | ユーザー名 |
| `password` | パスワード |
| `host` | ホスト名 (既定は `127.0.0.1`) |
| `port` | ポート番号 (既定は `3306`) |
| `database` | 使用するデータベース名 |
| `charset` | 文字コード (`utf8mb4` など) |
| `autocommit` | `True` なら、実行のたびに自動でコミットする (既定は `False`) |
| `connection_timeout` | 接続のタイムアウトの秒数 |
| `use_pure` | `True` なら、純 Python の実装を使う |
| `pool_name` / `pool_size` | コネクションプールの名前と、接続の数 |

### パスワードの扱い

パスワードを、コードに直接書くと、Git などで公開されるおそれがある。環境変数から、読み込む。

```python
import os

import mysql.connector

config = {
    "user": os.environ["DB_USER"],
    "password": os.environ["DB_PASSWORD"],
    "host": os.environ.get("DB_HOST", "127.0.0.1"),
    "database": os.environ["DB_NAME"],
}

connection = mysql.connector.connect(**config)
```

### 接続の確認と終了

```python
print(connection.is_connected())  # 接続が生きているか確認する

connection.close()  # 使い終わったら、接続を閉じる
```

<pre><code class="caution">接続は、使い終わったら、必ず close() で閉じる。閉じ忘れると、サーバーの接続の上限に達して、新しい接続ができなくなる。
エラーが起きても閉じられるように、try と finally で囲む。</code></pre>

---

## クエリの実行 <a id="query" data-name="クエリの実行"></a>

cursor はクエリを実行するためのオブジェクトで、クエリの実行が終わった後には使用を終了したカーソルを閉じることが推奨される。

```python
import mysql.connector

connection = mysql.connector.connect(**config)
cursor = connection.cursor()

try:
    cursor.execute("SELECT id, name FROM users")
    rows = cursor.fetchall()  # すべての行を、リストで取得する
    for row in rows:
        print(row)
finally:
    cursor.close()      # カーソルを閉じる
    connection.close()  # 接続を閉じる
```

```text
(1, 'taro')
(2, 'hanako')
```

出力は、テーブルの内容によって変わる。

### 結果の取得

| メソッド | 内容 |
| --- | --- |
| `fetchone()` | 次の 1 行を、タプルで返す。もう行がなければ `None` |
| `fetchmany(size)` | 次の `size` 行を、リストで返す |
| `fetchall()` | 残りのすべての行を、リストで返す |

| 属性 | 内容 |
| --- | --- |
| `cursor.rowcount` | 取得した行数や、変更した行数 |
| `cursor.lastrowid` | 直前の `INSERT` で採番された ID |
| `cursor.description` | 列の情報 (列名など) |

### プレースホルダー

値は、SQL の文字列に直接埋め込まず、`%s` のプレースホルダーを使って、別に渡す。

```python
# ✅ プレースホルダーを使う (SQL インジェクションを防げる)
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# ❌ 文字列に直接埋め込む (SQL インジェクションの危険がある)
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
```

| 渡し方 | 書き方 |
| --- | --- |
| タプル | `execute("... WHERE id = %s AND name = %s", (1, "taro"))` |
| 辞書 | `execute("... WHERE id = %(id)s", {"id": 1})` |

<pre><code class="caution">プレースホルダーは、型にかかわらず %s を使う (? ではない)。%s を、引用符で囲まない。
値が 1 つのときも、タプルにする。(user_id,) のように、末尾にカンマが必要である。
テーブル名や列名には、プレースホルダーを使えない。名前を変数にするときは、許可する名前のリストと照合する。</code></pre>

### 結果を辞書で受け取る <a id="dictionary-cursor"></a>

`dictionary=True` を指定すると、各行が、列名をキーにした辞書になる。

```python
cursor = connection.cursor(dictionary=True)
cursor.execute("SELECT id, name FROM users")

for row in cursor.fetchall():
    print(row["id"], row["name"])
```

---

## データの変更 <a id="modify" data-name="データの変更"></a>

`INSERT`、`UPDATE`、`DELETE` は、実行しただけでは確定しない。`commit()` が必要になる。

```python
cursor.execute(
    "INSERT INTO users (name, email) VALUES (%s, %s)",
    ("taro", "taro@example.com"),
)
connection.commit()  # 変更を確定する

print(cursor.lastrowid)  # 採番された ID
```

```python
cursor.execute("UPDATE users SET name = %s WHERE id = %s", ("jiro", 1))
connection.commit()
print(cursor.rowcount)  # 更新された行数
```

```python
cursor.execute("DELETE FROM users WHERE id = %s", (1,))
connection.commit()
```

### 複数行の挿入 (executemany)

```python
data = [
    ("taro", "taro@example.com"),
    ("hanako", "hanako@example.com"),
    ("jiro", "jiro@example.com"),
]

cursor.executemany("INSERT INTO users (name, email) VALUES (%s, %s)", data)
connection.commit()
print(cursor.rowcount)  # 挿入された行数
```

### トランザクション

既定では、`autocommit` が `False` で、`commit()` を呼ぶまで、変更は確定しない。エラーが起きたときは、`rollback()` で取り消す。

```python
try:
    cursor.execute("UPDATE accounts SET balance = balance - %s WHERE id = %s", (1000, 1))
    cursor.execute("UPDATE accounts SET balance = balance + %s WHERE id = %s", (1000, 2))
    connection.commit()    # 2 つの更新を、まとめて確定する
except mysql.connector.Error:
    connection.rollback()  # どちらも取り消す
    raise
```

| メソッド | 内容 |
| --- | --- |
| `commit()` | トランザクションの変更を確定する |
| `rollback()` | トランザクションの変更を取り消す |
| `start_transaction()` | トランザクションを、明示的に開始する |

<pre><code class="caution">commit() を忘れると、プログラムの中では結果が見えても、接続を閉じたときに変更が破棄される。
INSERT や UPDATE の後で、データが反映されないときは、まず commit() を確認する。</code></pre>

---

## エラー処理 <a id="error" data-name="エラー処理"></a>

MySQL-Connector の例外は、`mysql.connector.Error` を継承している。

```python
import mysql.connector
from mysql.connector import errorcode

try:
    connection = mysql.connector.connect(**config)
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("ユーザー名かパスワードが違う")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("データベースが存在しない")
    else:
        print("接続に失敗した:", err)
```

| 例外 | 内容 |
| --- | --- |
| `mysql.connector.Error` | すべての例外の基底クラス |
| `mysql.connector.IntegrityError` | 一意制約や外部キー制約の違反 |
| `mysql.connector.ProgrammingError` | SQL の構文の誤り、存在しないテーブル、認証の失敗など |
| `mysql.connector.OperationalError` | 接続の切断など、運用上の問題 |
| `mysql.connector.DatabaseError` | データベースに関する、その他のエラー |

例外には、次の属性がある。

| 属性 | 内容 |
| --- | --- |
| `errno` | MySQL のエラー番号 |
| `sqlstate` | SQLSTATE の値 |
| `msg` | エラーメッセージ |

---

## コネクションプール <a id="pool" data-name="コネクションプール"></a>

リクエストのたびに接続を作ると、時間がかかる。コネクションプールを使うと、作った接続を、使い回せる。

```python
from mysql.connector import pooling

pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,  # プールに用意する接続の数
    **config,
)

connection = pool.get_connection()  # プールから、接続を借りる
try:
    cursor = connection.cursor()
    cursor.execute("SELECT 1")
    print(cursor.fetchone())
    cursor.close()
finally:
    connection.close()  # 接続は閉じられず、プールに戻る
```

```text
(1,)
```

<pre><code class="tips">プールから借りた接続の close() は、接続を切断せず、プールに返す。
pool_size を超えて get_connection() を呼ぶと、エラーになる。同時に使う数に合わせて、pool_size を決める。</code></pre>

---

## 実践例 <a id="practice" data-name="実践例"></a>

環境変数から設定を読み込み、プレースホルダー、トランザクション、エラー処理を備えた例。

```python
import os

import mysql.connector

config = {
    "user": os.environ["DB_USER"],
    "password": os.environ["DB_PASSWORD"],
    "host": os.environ.get("DB_HOST", "127.0.0.1"),
    "database": os.environ["DB_NAME"],
    "charset": "utf8mb4",
}


def add_user(name, email):
    connection = mysql.connector.connect(**config)
    try:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO users (name, email) VALUES (%s, %s)",
            (name, email),
        )
        connection.commit()
        return cursor.lastrowid
    except mysql.connector.Error:
        connection.rollback()  # 失敗したら、変更を取り消す
        raise
    finally:
        connection.close()


def find_user(user_id):
    connection = mysql.connector.connect(**config)
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email FROM users WHERE id = %s", (user_id,))
        return cursor.fetchone()  # 見つからなければ None
    finally:
        connection.close()


if __name__ == "__main__":
    new_id = add_user("taro", "taro@example.com")
    print(find_user(new_id))
```

```text
{'id': 1, 'name': 'taro', 'email': 'taro@example.com'}
```

出力は、テーブルの内容によって変わる。

<pre><code class="tips">接続を閉じると、その接続のカーソルは使えなくなる。
上の例では、カーソルを個別に閉じていない。カーソルを多数作る処理では、cursor.close() も呼ぶ。</code></pre>

---

## テスト <a id="testing" data-name="テスト"></a>

データベースを使うコードのテストには、2 つの方法がある。

| 方法 | 内容 | 向く場面 |
| --- | --- | --- |
| モック | `mysql.connector.connect` を置き換え、データベースなしで動かす | 関数の分岐や、結果の加工を確認する |
| テスト用の DB | 専用のデータベースを用意し、実際に SQL を実行する | SQL そのものの正しさを確認する |

モックの例。

```python
from unittest.mock import MagicMock, patch

import mysql.connector


def get_user_name(user_id):
    connection = mysql.connector.connect(user="u", password="p", database="d")
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT name FROM users WHERE id = %s", (user_id,))
        row = cursor.fetchone()
        return row[0] if row else None
    finally:
        connection.close()


def test_get_user_name():
    mock_connection = MagicMock()
    mock_cursor = mock_connection.cursor.return_value
    mock_cursor.fetchone.return_value = ("taro",)

    with patch("mysql.connector.connect", return_value=mock_connection):
        assert get_user_name(1) == "taro"

    mock_connection.close.assert_called_once()
```

<pre><code class="tips">モックでは、SQL の構文の誤りや、制約の違反を見つけられない。SQL の正しさは、テスト用のデータベースで確認する。
テスト用のデータベースは、Docker などで、使い捨てにすると扱いやすい。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `Access denied for user` (1045) | ユーザー名、パスワード、接続元のホストの権限が違う | 認証情報と、`GRANT` による権限を確認する |
| `Can't connect to MySQL server` (2003) | ホスト名、ポートが違う。またはサーバーが起動していない | `host` と `port` を確認し、サーバーの起動を確認する |
| `Unknown database` (1049) | `database` に指定した名前が存在しない | データベース名を確認する。または先に作成する |
| `Unread result found` | 結果を最後まで読まずに、次の `execute()` を呼んだ | `fetchall()` で読み切る。または `buffered=True` のカーソルを使う |
| `INSERT` や `UPDATE` が、反映されない | `commit()` を呼んでいない (`autocommit` は既定で `False`) | `commit()` を呼ぶ。または `autocommit=True` にする |
| `You have an error in your SQL syntax` (1064) | SQL の構文の誤り。プレースホルダーを引用符で囲んでいる | SQL を確認する。`%s` は、引用符で囲まない |
| `Not all parameters were used in the SQL statement` | プレースホルダーの数と、渡した値の数が合わない。値が 1 つのときに、タプルにしていない | 数を合わせる。`(value,)` のようにタプルにする |
| `LIKE` の検索で、エラーになる | SQL の中の `%` が、プレースホルダーと混同されている | 検索の文字列を値として渡す (`("%taro%",)`)。SQL の中に `%` を書くときは `%%` にする |
| 日本語が文字化けする | 文字コードが、データベースと合っていない | `charset="utf8mb4"` を指定する |
| `MySQL Connection not available.` | 閉じた接続や、切断された接続を使っている | 接続を作り直す。`connection.ping(reconnect=True)` で再接続する |
| 長時間の待機の後に、接続が切れる | サーバー側のタイムアウトで、接続が切断された | 使うたびに接続する。またはコネクションプールを使う |
| `Too many connections` (1040) | 接続を閉じていない。または接続が多すぎる | `close()` を確実に呼ぶ。コネクションプールを使う |
| `ModuleNotFoundError: No module named 'mysql'` | 別の Python 環境にインストールされている。または名前の違うパッケージを入れた | 使っている環境で、`pip install mysql-connector-python` を実行する |

---

## 関連 <a id="ecosystem" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| `PyMySQL` | 純 Python の MySQL ドライバ |
| `mysqlclient` | C 拡張の MySQL ドライバ。Django の標準的な選択肢 |
| `SQLAlchemy` | ORM と、SQL を組み立てるツールキット |
| `sqlite3` | 標準ライブラリの SQLite のモジュール (sqlite3 のドキュメントを参照) |
| `python-dotenv` | `.env` から、環境変数を読み込む |
