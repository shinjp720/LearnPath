<div data-title="SQLite3"></div>
<a id="top" data-name="TOP">

# SQLite3

- sqlite3モジュールは組み込みのSQLiteデータベースを簡単に操作できる。
- インストールは不要で、標準ライブラリとして入っている。

```python
import sqlite3
```

---

## 基本

### データベースに接続

```python
import sqlite3

conn = sqlite3.connect('example.db')  # ファイルに保存（メモリ内DBなら ':memory:'）
```

<div class="tips">
    SQLite の メモリ内データベース（in-memory database）は、データを ファイルではなくメモリ上に保存する。<br>
    <code>conn = sqlite3.connect(':memory:')</code>
    <ul>
        <li>ファイルIOが無いため非常に高速。</li>
        <li>アプリが終了、または接続が閉じられるとすべてのデータが消える。</li>
        <li>テスト用、一時的なキャッシュ、セッション的な使い捨てデータ、学習目的など。</li>
    </ul>
</div>

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

### データの更新・削除

```python
# 年齢を更新
cur.execute("UPDATE users SET age = ? WHERE name = ?", (31, 'Alice'))

# ユーザー削除
cur.execute("DELETE FROM users WHERE name = ?", ('Bob',))
```

### コミット＆接続を閉じる

```python
conn.commit()  # 保存（忘れるとデータが反映されない）
conn.close()
```

<div class="tips">
    <code>with sqlite3.connect('example.db') as conn:</code><br>
    のように<b>with</b>文を使うと自動的に<b>commit</b>と<b>close</b>されるので便利。
</div>

## 使用例

```python
# データベースファイルに接続（ファイルが存在しない場合は新規作成）
conn = sqlite3.connect('example.db')
try:
    # カーソルオブジェクトを取得
    cursor = conn.cursor()
    # テーブル作成
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER
        )
    ''')
    # データの挿入
    cursor.execute('INSERT INTO users (name, age) VALUES (?, ?)', ("Alice", 30))
    # データの取得
    cursor.execute('SELECT * FROM users')
    for row in cursor.fetchall():
        print(row)
finally:
    # カーソルを閉じる
    cursor.close()
    # 接続を閉じる
    conn.close()
```

<div class="caution">
    VALUES (?, ?)はsqliteのプレースホルダーで、SQLインジェクションを避けるために必ずプレースホルダーを利用する。
</div>