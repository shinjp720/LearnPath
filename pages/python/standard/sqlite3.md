---
title: SQLite3
layout: default
---

# SQLite3 <a id="top" data-name="TOP"></a>

`sqlite3` モジュールは、組み込みの SQLite データベースを、簡単に操作できる、Python の標準ライブラリ。インストールは不要で、標準ライブラリとして入っている。

SQLite は、サーバーを必要とせず、1つのファイル (またはメモリ上) にデータを保存する、軽量なデータベース。`sqlite3` は、Python のデータベース API の標準仕様 (DB-API 2.0、PEP 249) に沿っているため、他のデータベース用のモジュールと、似た書き方で使える。

```python
import sqlite3
```

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| サーバー不要 | 別のプロセスを立てずに、アプリの中でデータベースを動かす |
| 標準ライブラリ | インストール不要。`import sqlite3` だけで使える |
| 単一ファイル | データベース全体が、1つのファイルに収まる (`:memory:` ならメモリ上) |
| DB-API 2.0 準拠 | `connect`、`cursor`、`execute`、`fetchone` など、共通の形で書ける |
| 柔軟な型付け | 列の型は、ヒントとして扱われる。型の違う値が、そのまま入ることがある |

### 他の選択肢との比較

| 観点 | sqlite3 | PostgreSQL / MySQL | JSON ファイル |
| --- | --- | --- | --- |
| 構成 | アプリに組み込む | 別のサーバーが必要 | ファイルを読み書きする |
| 導入 | 不要 (標準ライブラリ) | サーバーの構築と接続設定が必要 | 不要 |
| 検索 | SQL で、条件を指定して取り出す | SQL で、条件を指定して取り出す | 全体を読み込んでから、Python で絞り込む |
| 同時書き込み | 書き込みは、1つずつ順番に行う | 多数の接続が、同時に書き込める | 自分で排他制御を作る必要がある |
| 向いている用途 | 小〜中規模のアプリ、ツール、テスト、学習 | 多人数が使う、大規模なサービス | 少量の設定、単純なデータ |

### 向き不向き

- 向いている場面: 1つのアプリが使うデータの保存、デスクトップアプリ、スクリプトの結果の蓄積、テスト用のデータベース、学習。
- 向いていない場面: 多数のクライアントが、同時に書き込む Web サービス、ネットワーク越しに共有するデータベース。

<pre><code class="caution">このドキュメントは、Python 3.12 以降 (2026年11月時点) を前提にしている。3.12 で connect() に autocommit 引数が追加され、標準の日時の変換機能 (デフォルトのアダプターとコンバーター) が非推奨になった。
古い記事のコードは、そのままでは、警告が出たり、トランザクションの挙動が違ったりすることがある。</code></pre>

---

## 基本 <a id="basic" data-name="基本"></a>

### データベースに接続

```python
import sqlite3

conn = sqlite3.connect('example.db')  # ファイルに保存する (メモリ内 DB なら ':memory:')
```

<pre><code class="tips">SQLite のメモリ内データベース (in-memory database) は、データをファイルではなく、メモリ上に保存する。
conn = sqlite3.connect(':memory:')
- ファイル IO が無いため、非常に高速。
- アプリが終了、または接続が閉じられると、すべてのデータが消える。
- テスト用、一時的なキャッシュ、セッション的な使い捨てデータ、学習目的などに使う。</code></pre>

### カーソルを作成

```python
cur = conn.cursor()
```

### テーブルを作成

```python
cur.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
    )
''')
```

### データを挿入

```python
cur.execute("INSERT INTO users (name, age) VALUES (?, ?)", ('Alice', 30))
cur.execute("INSERT INTO users (name, age) VALUES (?, ?)", ('Bob', 25))
```

### データを取得

```python
cur.execute("SELECT * FROM users")
rows = cur.fetchall()
for row in rows:
    print(row)
```

```text
(1, 'Alice', 30)
(2, 'Bob', 25)
```

### データの更新・削除

```python
# 年齢を更新する
cur.execute("UPDATE users SET age = ? WHERE name = ?", (31, 'Alice'))

# ユーザーを削除する
cur.execute("DELETE FROM users WHERE name = ?", ('Bob',))
```

### コミット＆接続を閉じる

```python
conn.commit()  # 保存する (忘れるとデータが反映されない)
conn.close()
```

<pre><code class="tips">with sqlite3.connect('example.db') as conn: のように with 文を使うと、ブロックを抜けるときに、自動的に commit される (例外が起きたときは rollback される)。
ただし、with 文は接続を閉じない。接続を閉じるには、conn.close() を呼ぶか、contextlib.closing を使う。</code></pre>

---

## 使用例 <a id="example" data-name="使用例"></a>

```python
import sqlite3

# データベースファイルに接続する (ファイルが存在しない場合は新規作成)
conn = sqlite3.connect('example.db')
try:
    # カーソルオブジェクトを取得する
    cursor = conn.cursor()
    # テーブルを作成する
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER
        )
    ''')
    # データを挿入する
    cursor.execute('INSERT INTO users (name, age) VALUES (?, ?)', ("Alice", 30))
    # 変更を保存する (忘れると、接続を閉じたときに破棄される)
    conn.commit()
    # データを取得する
    cursor.execute('SELECT * FROM users')
    for row in cursor.fetchall():
        print(row)
    # カーソルを閉じる
    cursor.close()
finally:
    # 接続を閉じる
    conn.close()
```

```text
(1, 'Alice', 30)
```

<pre><code class="caution">VALUES (?, ?) は sqlite3 のプレースホルダーで、SQL インジェクションを避けるために、必ずプレースホルダーを利用する。
f 文字列や + で、値を SQL に埋め込んではいけない。
このコードは、実行のたびに、行が増える。</code></pre>

---

## 接続 <a id="connection" data-name="接続"></a>

### 接続先の指定

| 接続先 | 書き方 | 補足 |
| --- | --- | --- |
| ファイル | `sqlite3.connect('example.db')` | 存在しなければ、新規に作る |
| パス | `sqlite3.connect(Path('data') / 'app.db')` | `pathlib.Path` も渡せる。親のディレクトリは、自動では作られない |
| メモリ | `sqlite3.connect(':memory:')` | 接続ごとに、別のデータベースになる |
| 一時ファイル | `sqlite3.connect('')` | 接続を閉じると消える、ディスク上の一時データベース |
| URI | `sqlite3.connect('file:example.db?mode=ro', uri=True)` | 読み取り専用などの、オプションを付けられる |

読み取り専用で開く例。

```python
import sqlite3

# 先にデータベースを用意する
setup = sqlite3.connect('example.db')
setup.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)')
setup.commit()
setup.close()

# 読み取り専用で開く (ファイルが存在しないと、エラーになる)
conn = sqlite3.connect('file:example.db?mode=ro', uri=True)
try:
    conn.execute("INSERT INTO users (name) VALUES ('Alice')")
except sqlite3.OperationalError as e:
    print(e)
conn.close()
```

```text
attempt to write a readonly database
```

### connect の主な引数

| 引数 | 内容 | 既定値 |
| --- | --- | --- |
| `timeout` | テーブルがロックされているとき、`OperationalError` にするまで待つ秒数 | `5.0` |
| `detect_types` | 型の変換 (コンバーター) を有効にする指定 | `0` (無効) |
| `isolation_level` | 従来方式のトランザクションの開始方法 | `"DEFERRED"` |
| `check_same_thread` | 接続を作ったスレッド以外からの使用を、エラーにするか | `True` |
| `cached_statements` | 内部にキャッシュする SQL 文の数 | `128` |
| `uri` | 接続先を URI として扱うか | `False` |
| `autocommit` | トランザクションの制御方式 (3.12 で追加) | `sqlite3.LEGACY_TRANSACTION_CONTROL` |

<pre><code class="caution">Python 3.13 から、timeout や isolation_level などを、位置引数で渡すことが非推奨になった。Python 3.15 で、キーワード専用の引数になる予定。
connect('a.db', timeout=10) のように、キーワードで渡す。</code></pre>

### Connection の主なメンバー

| メンバー | 内容 |
| --- | --- |
| `cursor()` | カーソルを作る |
| `execute()` | カーソルを作って、SQL を実行する (ショートカット) |
| `commit()` / `rollback()` | トランザクションを、確定する / 取り消す |
| `close()` | 接続を閉じる。未コミットの変更は、破棄される |
| `in_transaction` | トランザクションが開いているか (読み取り専用) |
| `row_factory` | 行の形式を決める。<a href="#row-factory">行の形式</a>を参照 |
| `iterdump()` | データベースの内容を、SQL 文として取り出す |
| `backup()` | データベースを、別の接続へコピーする |
| `create_function()` | Python の関数を、SQL の関数として登録する |

---

## トランザクション <a id="transaction" data-name="トランザクション"></a>

トランザクションは、複数の変更を、ひとまとまりとして扱う仕組み。すべて成功したときだけ確定 (commit) し、失敗したら取り消す (rollback)。

既定の動作 (従来方式) では、`INSERT`、`UPDATE`、`DELETE`、`REPLACE` の前に、sqlite3 が自動的にトランザクションを開く。`SELECT` では開かない。変更は、`commit()` するまで、データベースに反映されない。

### rollback

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL)')

conn.execute("INSERT INTO users (name) VALUES (?)", ('Alice',))
conn.rollback()  # 挿入を取り消す

print(conn.execute('SELECT COUNT(*) FROM users').fetchone())
conn.close()
```

```text
(0,)
```

### with 文で、commit と rollback を任せる

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL)')

try:
    with conn:  # 成功したら commit、例外が起きたら rollback する
        conn.execute("INSERT INTO users (name) VALUES (?)", ('Alice',))
        conn.execute("INSERT INTO users (name) VALUES (?)", (None,))  # NOT NULL 違反
except sqlite3.IntegrityError as e:
    print('rollback:', e)

print(conn.execute('SELECT COUNT(*) FROM users').fetchone())
conn.close()
```

```text
rollback: NOT NULL constraint failed: users.name
(0,)
```

with ブロックの途中で例外が起きたため、1行目の挿入も、取り消されている。

<pre><code class="caution">with 文は、commit と rollback だけを行い、接続を閉じない。接続を閉じるには、close() を呼ぶ。
トランザクションが開いていないとき、または autocommit が True のとき、with 文は何もしない。</code></pre>

### 接続を閉じる (contextlib.closing)

```python
import sqlite3
from contextlib import closing

with closing(sqlite3.connect('example.db')) as conn:  # ブロックを抜けると close する
    with conn:  # トランザクションを、commit / rollback する
        conn.execute('CREATE TABLE IF NOT EXISTS memo (id INTEGER PRIMARY KEY, body TEXT)')
        conn.execute("INSERT INTO memo (body) VALUES (?)", ('hello',))
```

### autocommit によるトランザクション制御 (Python 3.12 以降)

`connect()` の `autocommit` 引数 (または `Connection.autocommit` 属性) で、トランザクションの制御方式を選ぶ。

| 値 | 動作 |
| --- | --- |
| `sqlite3.LEGACY_TRANSACTION_CONTROL` (既定) | 従来方式。`isolation_level` に従って、暗黙にトランザクションを開く |
| `False` | PEP 249 に準拠。常にトランザクションが開いていて、`commit()` や `rollback()` の直後に、次のトランザクションが開く |
| `True` | 暗黙のトランザクションを使わない。各 SQL 文が、すぐに反映される |

```python
import sqlite3

conn = sqlite3.connect(':memory:', autocommit=False)  # 3.12 以降
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')
conn.execute("INSERT INTO users (name) VALUES (?)", ('Alice',))
conn.commit()  # 確定すると、次のトランザクションが自動的に始まる
print(conn.in_transaction)
conn.close()
```

```text
True
```

<pre><code class="tips">Python 3.12 以降の新しいコードでは、autocommit による制御が推奨されている。
isolation_level は、autocommit が LEGACY_TRANSACTION_CONTROL のときだけ効く。</code></pre>

### isolation_level (従来方式)

| 値 | 動作 |
| --- | --- |
| `"DEFERRED"` (既定) | 最初に読み書きしたときに、ロックを取る |
| `"IMMEDIATE"` | トランザクションの開始時に、書き込みロックを取る |
| `"EXCLUSIVE"` | 他の接続からの読み取りも、ブロックする (WAL モードでは `IMMEDIATE` と同じ) |
| `None` | 暗黙のトランザクションを開かない (自分で `BEGIN` を実行する) |

---

## SQL の実行 <a id="execute" data-name="SQLの実行"></a>

### プレースホルダー

値は、SQL 文に直接埋め込まず、プレースホルダーで渡す。

| 形式 | SQL の書き方 | 値の渡し方 |
| --- | --- | --- |
| 位置 (qmark) | `WHERE name = ? AND age >= ?` | タプルまたはリスト `('Alice', 20)` |
| 名前 (named) | `WHERE name = :name AND age >= :age` | 辞書 `{'name': 'Alice', 'age': 20}` |

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')
conn.execute("INSERT INTO users (name, age) VALUES (?, ?)", ('Alice', 30))

# 位置のプレースホルダー
print(conn.execute("SELECT * FROM users WHERE name = ?", ('Alice',)).fetchall())

# 名前のプレースホルダー
sql = "SELECT * FROM users WHERE name = :name AND age >= :age"
print(conn.execute(sql, {'name': 'Alice', 'age': 20}).fetchall())
conn.close()
```

```text
[(1, 'Alice', 30)]
[(1, 'Alice', 30)]
```

<pre><code class="caution">値が1つのときも、タプルにする。('Alice',) の末尾のカンマを忘れて ('Alice') と書くと、ただの文字列になり、エラーになる。
プレースホルダーで渡せるのは、値だけ。テーブル名や列名は、渡せない。</code></pre>

### executemany (複数行をまとめて実行)

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')

users = [('Alice', 30), ('Bob', 25), ('Carol', 28)]
conn.executemany("INSERT INTO users (name, age) VALUES (?, ?)", users)
conn.commit()

print(conn.execute('SELECT COUNT(*) FROM users').fetchone())
conn.close()
```

```text
(3,)
```

### executescript (複数の SQL 文を実行)

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.executescript('''
    CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
    CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT);
    INSERT INTO users (name) VALUES ('Alice');
''')
print(conn.execute('SELECT * FROM users').fetchall())
conn.close()
```

```text
[(1, 'Alice')]
```

<pre><code class="caution">executescript にはプレースホルダーを渡せない。値を含む SQL には、使わない。
従来方式 (既定) では、executescript は、開いているトランザクションを、先に commit する。</code></pre>

### IN 句の、可変個の値

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')
conn.executemany("INSERT INTO users (name) VALUES (?)", [('Alice',), ('Bob',), ('Carol',)])

ids = [1, 3]
placeholders = ','.join('?' * len(ids))  # '?,?' を作る (値ではなく、プレースホルダーだけを組み立てる)
rows = conn.execute(f"SELECT * FROM users WHERE id IN ({placeholders})", ids).fetchall()
print(rows)
conn.close()
```

```text
[(1, 'Alice'), (3, 'Carol')]
```

### 実行結果の情報

| メンバー | 内容 |
| --- | --- |
| `cursor.lastrowid` | 直近の `INSERT` で、採番された行の ID |
| `cursor.rowcount` | `INSERT`、`UPDATE`、`DELETE` で、影響を受けた行数 (`SELECT` では `-1`) |
| `cursor.description` | `SELECT` の、列の情報 (各要素の先頭が、列名) |

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')

cur = conn.execute("INSERT INTO users (name, age) VALUES (?, ?)", ('Alice', 30))
print(cur.lastrowid, cur.rowcount)

cur = conn.execute("UPDATE users SET age = age + 1")
print(cur.rowcount)

cur = conn.execute("SELECT name, age FROM users")
print([col[0] for col in cur.description])
conn.close()
```

```text
1 1
1
['name', 'age']
```

<pre><code class="tips">conn.execute(...) は、内部でカーソルを作って返す、ショートカット。短いスクリプトでは、cursor() を省いて、conn.execute() で書くと簡潔になる。</code></pre>

---

## データの取得 <a id="fetch" data-name="データの取得"></a>

| メソッド | 内容 | 戻り値 |
| --- | --- | --- |
| `fetchone()` | 次の1行を取得する | タプル。行がなければ `None` |
| `fetchmany(n)` | 次の n 行を取得する | リスト (既定は `cursor.arraysize` 件) |
| `fetchall()` | 残りのすべての行を取得する | リスト |
| カーソルの反復 | `for row in cur:` で、1行ずつ取り出す | 行 (タプル) |

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')
conn.executemany(
    "INSERT INTO users (name, age) VALUES (?, ?)",
    [('Alice', 30), ('Bob', 25), ('Carol', 28)],
)

cur = conn.execute("SELECT name, age FROM users ORDER BY age")

print(cur.fetchone())      # 1行
print(cur.fetchmany(1))    # 次の1行
for row in cur:            # 残りを、1行ずつ
    print(row)

# 1件だけの値は、タプルを展開して受け取る
(count,) = conn.execute("SELECT COUNT(*) FROM users").fetchone()
print(count)
conn.close()
```

```text
('Bob', 25)
[('Carol', 28)]
('Alice', 30)
3
```

<pre><code class="tips">行数が多いときは、fetchall() で一度にすべてをメモリに読み込まず、カーソルを for 文で反復するか、fetchmany() で少しずつ処理する。
該当する行が無い可能性があるときは、fetchone() の戻り値が None かどうかを、先に確認する。</code></pre>

---

## 行の形式 <a id="row-factory" data-name="行の形式"></a>

既定では、行はタプルで返る。`row_factory` を設定すると、列名で値を取り出せる。

| 設定 | 行の形式 | 補足 |
| --- | --- | --- |
| (既定) | タプル | 位置 (インデックス) で取り出す |
| `sqlite3.Row` | `Row` オブジェクト | 位置と列名の、どちらでも取り出せる。列名の大文字小文字は、区別されない |
| 自作の関数 | 辞書など | 関数で、好きな形式に変換する |

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.row_factory = sqlite3.Row  # 列名でアクセスできるようにする
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')
conn.execute("INSERT INTO users (name, age) VALUES (?, ?)", ('Alice', 30))

row = conn.execute("SELECT * FROM users").fetchone()
print(row['name'], row[2])
print(row.keys())
print(dict(row))  # 辞書に変換する
conn.close()
```

```text
Alice 30
['id', 'name', 'age']
{'id': 1, 'name': 'Alice', 'age': 30}
```

辞書で返したいときは、自作の関数を設定する。

```python
import sqlite3


def dict_factory(cursor, row):
    # 列名をキーにした辞書を作る
    columns = [col[0] for col in cursor.description]
    return dict(zip(columns, row))


conn = sqlite3.connect(':memory:')
conn.row_factory = dict_factory
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')
conn.execute("INSERT INTO users (name) VALUES ('Alice')")
print(conn.execute("SELECT * FROM users").fetchall())
conn.close()
```

```text
[{'id': 1, 'name': 'Alice'}]
```

---

## データ型 <a id="data-type" data-name="データ型"></a>

### Python と SQLite の型の対応

| Python | SQLite |
| --- | --- |
| `None` | `NULL` |
| `int` | `INTEGER` |
| `float` | `REAL` |
| `str` | `TEXT` |
| `bytes` | `BLOB` |

`bool` は `int` として、`True` は `1`、`False` は `0` で保存され、取り出すと `int` で返る。`datetime` や `Decimal` などは、そのままでは保存できない (次の「アダプターとコンバーター」を参照)。

### 柔軟な型付け

SQLite では、列に書いた型は、値の型を厳密に縛らない (型親和性)。`INTEGER` の列に、数値に変換できない文字列を入れても、エラーにならず、文字列のまま保存される。

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE t (n INTEGER)')
conn.execute("INSERT INTO t VALUES (?)", ('123',))    # 数値に変換して保存する
conn.execute("INSERT INTO t VALUES (?)", ('abc',))    # 変換できないので、文字列のまま保存する

print(conn.execute("SELECT n, typeof(n) FROM t").fetchall())
conn.close()
```

```text
[(123, 'integer'), ('abc', 'text')]
```

<pre><code class="tips">型を厳密にしたいときは、テーブルを STRICT 付きで作る (CREATE TABLE ... STRICT)。SQLite 3.37 以降で使える。
使えるかどうかは、sqlite3.sqlite_version で、SQLite のバージョンを確認する。</code></pre>

### アダプターとコンバーター

Python の型を、SQLite に保存できる値へ変換するのが**アダプター**。逆に、取り出した値を、Python の型へ戻すのが**コンバーター**。

| 関数 | 内容 |
| --- | --- |
| `sqlite3.register_adapter(型, 関数)` | Python の型を、保存できる値に変換する関数を登録する |
| `sqlite3.register_converter(型名, 関数)` | 取り出した値 (`bytes`) を、Python の型に変換する関数を登録する |
| `detect_types=sqlite3.PARSE_DECLTYPES` | 列の宣言の型名で、コンバーターを選ぶ |
| `detect_types=sqlite3.PARSE_COLNAMES` | SQL 中の `AS "name [型名]"` の型名で、コンバーターを選ぶ |

```python
import sqlite3
from datetime import datetime


def adapt_datetime(dt):
    # datetime を、ISO 8601 形式の文字列にする
    return dt.isoformat(' ')


def convert_datetime(value):
    # 取り出した bytes を、datetime に戻す
    return datetime.fromisoformat(value.decode())


sqlite3.register_adapter(datetime, adapt_datetime)
sqlite3.register_converter('timestamp', convert_datetime)

conn = sqlite3.connect(':memory:', detect_types=sqlite3.PARSE_DECLTYPES)
conn.execute('CREATE TABLE logs (created_at timestamp)')
conn.execute("INSERT INTO logs VALUES (?)", (datetime(2026, 11, 24, 9, 30),))

row = conn.execute("SELECT created_at FROM logs").fetchone()
print(type(row[0]), row[0])
conn.close()
```

```text
<class 'datetime.datetime'> 2026-11-24 09:30:00
```

<pre><code class="caution">Python 3.12 から、標準で用意されていた日付と日時のアダプター・コンバーター (datetime.date、datetime.datetime 用) は、非推奨になった。
上の例のように、自分でアダプターとコンバーターを登録する。登録は、プログラム全体に効く。</code></pre>

<pre><code class="tips">アダプターを使わずに、日時を ISO 8601 形式の文字列 (datetime.isoformat()) で保存し、取り出したときに datetime.fromisoformat() で戻す方法でもよい。登録が不要で、動作が分かりやすい。</code></pre>

---

## 制約と外部キー <a id="constraint" data-name="制約と外部キー"></a>

### 主な制約

| 制約 | 内容 |
| --- | --- |
| `PRIMARY KEY` | 行を一意に決めるキー。`INTEGER PRIMARY KEY` の列は、行の ID (`rowid`) の別名になり、自動で採番される |
| `AUTOINCREMENT` | 削除された ID を、再利用しない。ID の再利用を避けたいときだけ付ける |
| `NOT NULL` | `NULL` を許さない |
| `UNIQUE` | 同じ値を、重複して入れられない |
| `DEFAULT` | 値を省略したときの、既定値 |
| `CHECK` | 値が満たすべき条件 |
| `FOREIGN KEY` | 別のテーブルの行を参照する |

制約に違反すると、`sqlite3.IntegrityError` が起きる。

### 外部キーを有効にする

<pre><code class="caution">SQLite の外部キー制約は、既定では無効になっている。接続のたびに、PRAGMA foreign_keys = ON を実行する必要がある。
有効にしないと、存在しない行を参照するデータも、エラーにならずに入ってしまう。</code></pre>

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('PRAGMA foreign_keys = ON')  # 接続ごとに実行する
conn.executescript('''
    CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE posts (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        title TEXT
    );
''')

try:
    conn.execute("INSERT INTO posts (user_id, title) VALUES (?, ?)", (999, 'hello'))
except sqlite3.IntegrityError as e:
    print(e)
conn.close()
```

```text
FOREIGN KEY constraint failed
```

---

## 例外 <a id="exception" data-name="例外"></a>

`sqlite3` の例外は、`sqlite3.Error` を頂点とした階層になっている。

| 例外 | 主な原因 |
| --- | --- |
| `sqlite3.Error` | すべての `sqlite3` の例外の、基底クラス |
| `sqlite3.DatabaseError` | データベースに関するエラー全般 |
| `sqlite3.IntegrityError` | 制約違反 (`NOT NULL`、`UNIQUE`、`FOREIGN KEY` など) |
| `sqlite3.OperationalError` | テーブルが無い、SQL の文法の誤り、データベースがロックされている、など |
| `sqlite3.ProgrammingError` | プレースホルダーの数の不一致、閉じた接続の使用、別のスレッドからの使用、など |
| `sqlite3.DataError` | 数値の範囲外など、処理するデータの問題 |

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE)')
conn.execute("INSERT INTO users (email) VALUES (?)", ('a@example.com',))

try:
    conn.execute("INSERT INTO users (email) VALUES (?)", ('a@example.com',))
except sqlite3.IntegrityError as e:
    print('IntegrityError:', e)

try:
    conn.execute("SELECT * FROM no_such_table")
except sqlite3.OperationalError as e:
    print('OperationalError:', e)
conn.close()
```

```text
IntegrityError: UNIQUE constraint failed: users.email
OperationalError: no such table: no_such_table
```

<pre><code class="tips">個別の例外を先に書き、最後に sqlite3.Error でまとめて受ける。IntegrityError と OperationalError は、どちらも sqlite3.Error の仲間なので、except の順序に注意する。</code></pre>

---

## 便利な機能 <a id="utility" data-name="便利な機能"></a>

### スキーマの確認

```python
import sqlite3

conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, age INTEGER)')

# テーブルの一覧
print(conn.execute("SELECT name FROM sqlite_master WHERE type = 'table'").fetchall())

# 列の情報 (列番号、列名、型、NOT NULL、既定値、主キー)
for col in conn.execute("PRAGMA table_info(users)"):
    print(col)
conn.close()
```

```text
[('users',)]
(0, 'id', 'INTEGER', 0, None, 1)
(1, 'name', 'TEXT', 1, None, 0)
(2, 'age', 'INTEGER', 0, None, 0)
```

### Python の関数を SQL から呼ぶ

```python
import sqlite3

conn = sqlite3.connect(':memory:')
# 引数が 1 つの関数 UPPER2 を登録する
conn.create_function('UPPER2', 1, lambda s: s.upper() * 2)

print(conn.execute("SELECT UPPER2('ab')").fetchone())
conn.close()
```

```text
('ABAB',)
```

### バックアップとダンプ

```python
import sqlite3

src = sqlite3.connect(':memory:')
src.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')
src.execute("INSERT INTO users (name) VALUES ('Alice')")
src.commit()

# 別のデータベースへ、丸ごとコピーする
dst = sqlite3.connect('backup.db')
src.backup(dst)
dst.close()

# SQL 文として書き出す
for line in src.iterdump():
    print(line)
src.close()
```

```text
BEGIN TRANSACTION;
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO "users" VALUES(1,'Alice');
COMMIT;
```

### コマンドラインの SQLite シェル (Python 3.12 以降)

```bash
python -m sqlite3 example.db
```

`sqlite3` モジュールを、スクリプトとして起動すると、対話的な SQLite シェルが開く。簡単な確認に便利。

---

## 並行アクセス <a id="concurrency" data-name="並行アクセス"></a>

SQLite は、同時に書き込めるのが1つの接続だけ。他の接続が書き込み中のとき、`timeout` の秒数だけ待って、それでもロックが解けなければ、`sqlite3.OperationalError: database is locked` になる。

| 対処 | 内容 |
| --- | --- |
| `timeout` を延ばす | `sqlite3.connect('app.db', timeout=30)` のように、待つ時間を延ばす |
| トランザクションを短くする | 書き込みの途中で、時間のかかる処理 (通信、重い計算) を挟まない |
| WAL モードにする | `PRAGMA journal_mode = WAL` で、読み取りと書き込みを、同時に行いやすくする |
| 接続をスレッドごとに作る | 1つの接続を、複数のスレッドで共有しない |

```python
import sqlite3

conn = sqlite3.connect('app.db', timeout=30)
conn.execute('PRAGMA journal_mode = WAL')  # 設定は、データベースファイルに残る
conn.close()
```

<pre><code class="caution">check_same_thread は、既定で True。接続を作ったスレッド以外から使うと、ProgrammingError になる。
False にすると、エラーは出なくなるが、安全になるわけではない。同時に使わないように、自分で排他制御をする。</code></pre>

---

## 実践例 <a id="practice" data-name="実践例"></a>

ユーザーを管理する、小さなモジュール。接続の設定 (外部キー、行の形式) を、1か所にまとめる。

```python
import sqlite3
from contextlib import closing

DB_PATH = 'app.db'


def get_connection():
    # 接続を作り、共通の設定を行う
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON')
    return conn


def init_db():
    # with closing: 接続を閉じる。with conn: commit / rollback する
    with closing(get_connection()) as conn, conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                age INTEGER CHECK (age >= 0)
            )
        ''')


def add_user(name, age):
    with closing(get_connection()) as conn, conn:
        cur = conn.execute("INSERT INTO users (name, age) VALUES (?, ?)", (name, age))
        return cur.lastrowid


def find_users(min_age=0):
    with closing(get_connection()) as conn:
        rows = conn.execute(
            "SELECT * FROM users WHERE age >= ? ORDER BY age", (min_age,)
        ).fetchall()
        return [dict(row) for row in rows]


def update_age(name, age):
    with closing(get_connection()) as conn, conn:
        cur = conn.execute("UPDATE users SET age = ? WHERE name = ?", (age, name))
        return cur.rowcount  # 更新した行数


def delete_user(name):
    with closing(get_connection()) as conn, conn:
        cur = conn.execute("DELETE FROM users WHERE name = ?", (name,))
        return cur.rowcount


if __name__ == '__main__':
    init_db()
    try:
        add_user('Alice', 30)
        add_user('Bob', 25)
        add_user('Alice', 40)  # UNIQUE 違反
    except sqlite3.IntegrityError as e:
        print('登録できない:', e)

    print(find_users(min_age=26))
    print(update_age('Alice', 31))
    print(delete_user('Bob'))
```

```text
登録できない: UNIQUE constraint failed: users.name
[{'id': 1, 'name': 'Alice', 'age': 30}]
1
1
```

<pre><code class="tips">with closing(...) as conn, conn: は、2つのコンテキストマネージャを、1行で書く形。右側の conn が先に終了して commit / rollback し、その後で、closing が接続を閉じる。
読み取りだけの関数では、commit が不要なので、closing だけでよい。</code></pre>

---

## テスト <a id="test" data-name="テスト"></a>

メモリ内データベース (`:memory:`) を使うと、ファイルを作らずに、テストごとに、新しいデータベースで試せる。

```python
import sqlite3
import unittest


class TestUsers(unittest.TestCase):
    def setUp(self):
        # テストごとに、空のデータベースを作る
        self.conn = sqlite3.connect(':memory:')
        self.conn.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL)')

    def tearDown(self):
        self.conn.close()

    def test_insert(self):
        self.conn.execute("INSERT INTO users (name) VALUES (?)", ('Alice',))
        count = self.conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        self.assertEqual(count, 1)

    def test_not_null(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.conn.execute("INSERT INTO users (name) VALUES (?)", (None,))


if __name__ == '__main__':
    unittest.main()
```

<pre><code class="tips">:memory: のデータベースは、接続ごとに別のものになる。複数の接続から、同じメモリ内データベースを見たいときは、URI の file::memory:?cache=shared を、uri=True で使う方法がある。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| 挿入したデータが、次の実行で消えている | `commit()` を呼んでいない。接続を閉じると、未コミットの変更は破棄される | `commit()` を呼ぶか、`with conn:` を使う |
| `with sqlite3.connect(...)` を抜けても、ファイルが開いたまま | with 文は、commit / rollback だけで、接続を閉じない | `conn.close()` か、`contextlib.closing` を使う |
| `Incorrect number of bindings supplied` | プレースホルダーの数と、渡した値の数が違う | 数をそろえる。値が1つのときは、`(value,)` とタプルにする |
| `execute("... ?", "Alice")` で、`ProgrammingError` | 文字列を渡すと、1文字ずつの値として扱われる | `("Alice",)` とタプルにする |
| `near "?": syntax error` | テーブル名や列名に、プレースホルダーを使った | 名前は、許可する値の一覧と照合してから、文字列として組み立てる |
| SQL インジェクションの危険 | f 文字列や `+` で、値を SQL に埋め込んでいる | 値は、必ずプレースホルダーで渡す |
| `sqlite3.OperationalError: database is locked` | 他の接続が、書き込み中でロックを持っている | `timeout` を延ばす、トランザクションを短くする、WAL モードにする |
| `ProgrammingError: SQLite objects created in a thread can only be used in that same thread` | 接続を、作ったスレッドとは別のスレッドで使った | スレッドごとに、接続を作る |
| `Cannot operate on a closed database` | `close()` した接続を、使っている | 接続の寿命を見直す。使い終わるまで、閉じない |
| 外部キー制約が、効かない | `PRAGMA foreign_keys` は、既定で無効 | 接続のたびに、`PRAGMA foreign_keys = ON` を実行する |
| `INTEGER` の列に、文字列が入る | 型が、ヒントとして扱われるため | `CHECK` 制約か、`STRICT` テーブルで、型を縛る |
| `datetime` を渡したら、非推奨の警告が出る | 標準のアダプターが、3.12 で非推奨になった | 自分で、アダプターとコンバーターを登録するか、ISO 8601 の文字列で保存する |
| `:memory:` のデータが、別の接続から見えない | メモリ内データベースは、接続ごとに別 | 同じ接続を使い回す。または、共有キャッシュの URI を使う |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| `contextlib` | `closing` で、接続を with 文で閉じる |
| `pathlib` | データベースファイルのパスを、組み立てる |
| `unittest` / `pytest` | `:memory:` を使った、データベースのテスト |
| `aiosqlite` | `asyncio` で、SQLite を扱うためのサードパーティのライブラリ |
| `SQLAlchemy` | SQL を直接書かずに、Python のオブジェクトとして、データベースを扱う ORM。SQLite にも使える |
| `sqlite-utils` | SQLite の操作を、簡単にするサードパーティのライブラリとコマンド |

- Rust から、SQLite を扱うときは、「rusqlite」のドキュメントを参照。
- SQL の文法そのものは、「SQL」のドキュメントを参照。
- Web フレームワークと組み合わせる例は、「Flask」「FastAPI」「Django」のドキュメントを参照。
