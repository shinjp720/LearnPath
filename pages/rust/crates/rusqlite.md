---
title: rusqlite
layout: default
---

# rusqlite <a id="top" data-name="TOP"></a>

rusqlite は、組み込みデータベースの SQLite を、Rust から使うための crate。SQLite の C ライブラリの、薄く使いやすいラッパー (Rust らしい API) になっている。

SQLite は、サーバーを立てずに、**1つのファイル (または メモリ) をデータベースとして使える**。設定ツール、デスクトップアプリ、CLI ツール、小さな Web アプリ、テストなどで広く使われる。

---

## 概要 <a id="overview" data-name="概要"></a>

### SQLite の特徴

| 特徴 | 内容 |
| --- | --- |
| サーバー不要 | プロセスの中に、ライブラリとして組み込まれる。別のサーバーの起動や設定が、不要 |
| 1ファイル | データベース全体が、1つのファイル (`app.db` など)。コピーするだけで、バックアップできる |
| トランザクション | ACID に対応している (途中でクラッシュしても、データが壊れにくい) |
| 書き込みは、1つずつ | 同時に書き込めるのは、1つの接続だけ (読み取りは、複数可) |
| 動的な型付け | 列の型は、ヒントであり、厳密ではない (`STRICT` テーブルで、厳密にできる) |

### Rust で SQLite を使う選択肢

| crate | 特徴 |
| --- | --- |
| `rusqlite` | SQLite 専用の、同期 (ブロッキング) API。SQL を直接書く。SQLite の機能を、細かく使える |
| `sqlx` | 非同期。複数の DB に対応。SQL をコンパイル時に検査できる |
| `diesel` | ORM (クエリビルダー)。型安全に、クエリを組み立てる |
| `sea-orm` | 非同期の ORM |

<pre><code class="tips">rusqlite は、同期 (ブロッキング) の API。非同期のコード (Tokio など) から使う場合は、spawn_blocking で呼ぶか、tokio-rusqlite などを使う (後述の「並行処理」を参照)。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

```bash
cargo add rusqlite --features bundled
```

```toml
[dependencies]
rusqlite = { version = "...", features = ["bundled"] }  # cargo add が、バージョンを入れる
```

### bundled フィーチャー

| 指定 | 動作 |
| --- | --- |
| `bundled` | SQLite の C のソースコードを、同梱して、一緒にビルドする (C コンパイラが必要)。環境にかかわらず、同じバージョンの SQLite が使える |
| (なし) | OS にインストールされている SQLite のライブラリ (libsqlite3) を使う。バージョンが古いと、新しい SQL の機能が使えないことがある |

特別な理由がなければ、`bundled` を付けるのが、手軽で確実。

### 主なフィーチャー

| フィーチャー | 用途 |
| --- | --- |
| `bundled` | SQLite を同梱してビルドする |
| `bundled-sqlcipher` | 暗号化に対応した SQLCipher を、同梱してビルドする |
| `chrono` / `time` / `jiff` | 日時の型を、そのまま保存・取得する |
| `uuid` | `Uuid` を、そのまま保存・取得する |
| `serde_json` | `serde_json::Value` を、そのまま保存・取得する (JSON のテキスト) |
| `url` | `Url` を、そのまま保存・取得する |
| `backup` | データベースのバックアップ |
| `blob` | 大きな BLOB の、段階的な読み書き |
| `functions` | SQL から呼べる、独自の関数 |
| `hooks` | 更新やコミットのフック |
| `serialize` | データベースを、バイト列として、取り出す・読み込む |
| `load_extension` | SQLite の拡張機能の読み込み |
| `vtab` | 仮想テーブル |

<pre><code class="caution">rusqlite は、バージョンごとに、破壊的変更が入る (0.x のため)。古い記事のコードが、そのまま動かないことがある。
このドキュメントは、0.39 以降 (調べた時点では、0.40 のリリースも確認できた) を想定している。
特に、0.38 では、次の変更があった。
- u64 と usize の、ToSql / FromSql の実装が、既定では無効になった (i64 で扱う)
- ステートメントのキャッシュ (prepare_cached) が、オプション機能になった
- 必要な SQLite のバージョンが、3.34.1 以降になった</code></pre>

---

## 基本 <a id="basic" data-name="基本"></a>

### 接続を開く

```rust
use rusqlite::Connection;

fn main() -> rusqlite::Result<()> {
    // ファイルのデータベースを開く (なければ、作られる)
    let conn = Connection::open("app.db")?;

    // メモリ上のデータベース (プログラムを終了すると消える。テストなどに便利)
    let mem = Connection::open_in_memory()?;

    Ok(())
}
```

| 関数 | 用途 |
| --- | --- |
| `Connection::open(path)` | ファイルのデータベースを、読み書きで開く (なければ作る) |
| `Connection::open_in_memory()` | メモリ上のデータベースを作る |
| `Connection::open_with_flags(path, flags)` | 開き方を指定する (読み取り専用など) |

```rust
use rusqlite::{Connection, OpenFlags};

// 読み取り専用で開く (ファイルがなければ、エラー)
let conn = Connection::open_with_flags("app.db", OpenFlags::SQLITE_OPEN_READ_ONLY)?;
```

### テーブルを作る

```rust
conn.execute_batch(
    "CREATE TABLE IF NOT EXISTS users (
        id    INTEGER PRIMARY KEY,
        name  TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        age   INTEGER
     );
     CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);",
)?;
```

`execute_batch` は、`;` で区切った、**複数の SQL を、まとめて実行**する (パラメータは、渡せない)。スキーマの作成や、PRAGMA の設定に使う。

### 最初のプログラム

```rust
use rusqlite::{Connection, Result};

#[derive(Debug)]
struct User {
    id: i64,
    name: String,
    age: Option<i32>,
}

fn main() -> Result<()> {
    let conn = Connection::open_in_memory()?;

    conn.execute(
        "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, age INTEGER)",
        (), // パラメータなし
    )?;

    // 追加 (パラメータは、?1, ?2 に、順番に入る)
    conn.execute("INSERT INTO users (name, age) VALUES (?1, ?2)", ("Alice", 30))?;
    conn.execute("INSERT INTO users (name, age) VALUES (?1, ?2)", ("Bob", None::<i32>))?;

    // 複数行の取得
    let mut stmt = conn.prepare("SELECT id, name, age FROM users")?;
    let users = stmt.query_map([], |row| {
        Ok(User {
            id: row.get(0)?,
            name: row.get(1)?,
            age: row.get(2)?,
        })
    })?;

    for user in users {
        println!("{:?}", user?);
    }

    Ok(())
}
```

```text
User { id: 1, name: "Alice", age: Some(30) }
User { id: 2, name: "Bob", age: None }
```

### 主な API

| 関数 | 用途 | 戻り値 |
| --- | --- | --- |
| `execute(sql, params)` | INSERT / UPDATE / DELETE などを、1つ実行する | 変更された行数 (`usize`) |
| `execute_batch(sql)` | 複数の SQL を、まとめて実行する | `()` |
| `query_row(sql, params, f)` | 1行だけ取得する | クロージャの戻り値 |
| `prepare(sql)` | 準備済みステートメントを作る | `Statement` |
| `Statement::query_map(params, f)` | 複数行を、クロージャで変換しながら取得する | イテレータ |
| `Statement::query(params)` | 行を、1つずつ手動で取り出す | `Rows` |
| `last_insert_rowid()` | 直前の INSERT で、割り当てられた rowid | `i64` |

---

## パラメータ <a id="params" data-name="パラメータ"></a>

SQL に値を渡すときは、**文字列に埋め込まずに、パラメータ (プレースホルダー)** で渡す。

<pre><code class="caution">format! で SQL に値を埋め込んではいけない (SQL インジェクションの危険がある)。
値は、必ず ?1 や :name のプレースホルダーで渡す。(テーブル名や列名は、プレースホルダーにできないため、固定の文字列にするか、許可リストで検証する。)</code></pre>

### プレースホルダーの書き方

| 書き方 | 例 | 説明 |
| --- | --- | --- |
| `?1`、`?2` | `WHERE id = ?1 AND age > ?2` | 番号付き。同じ番号を、複数回使える |
| `?` | `VALUES (?, ?)` | 番号なし。出てくる順番に割り当てられる |
| `:名前`、`@名前`、`$名前` | `WHERE name = :name` | 名前付き |

### 値の渡し方

| 渡し方 | 例 | 説明 |
| --- | --- | --- |
| `()` | `conn.execute("...", ())` | パラメータなし |
| タプル | `("Alice", 30)` | 型が異なる値を、まとめて渡す。もっとも簡潔 |
| 配列 | `["Alice", "Bob"]` | 同じ型の値を、渡す |
| `params![]` | `params!["Alice", 30]` | マクロ。型が異なる値を、渡す |
| `named_params!{}` | `named_params!{":name": "Alice"}` | 名前付きのパラメータ |
| `params_from_iter` | `params_from_iter(ids.iter())` | 数が決まっていない値 (IN 句など) |

```rust
use rusqlite::{named_params, params};

// タプル
conn.execute("INSERT INTO users (name, age) VALUES (?1, ?2)", ("Alice", 30))?;

// params! マクロ
conn.execute("INSERT INTO users (name, age) VALUES (?1, ?2)", params!["Bob", 25])?;

// 名前付き
conn.execute(
    "INSERT INTO users (name, age) VALUES (:name, :age)",
    named_params! { ":name": "Carol", ":age": 28 },
)?;

// 参照を渡すこともできる
let name = String::from("Dave");
conn.execute("INSERT INTO users (name, age) VALUES (?1, ?2)", (&name, 40))?;
```

### 数が決まっていない値 (IN 句)

```rust
use rusqlite::params_from_iter;

let ids = vec![1, 2, 3];

// ?,?,? を、個数に合わせて作る
let placeholders = vec!["?"; ids.len()].join(",");
let sql = format!("SELECT name FROM users WHERE id IN ({})", placeholders);

let mut stmt = conn.prepare(&sql)?;
let names = stmt.query_map(params_from_iter(ids.iter()), |row| row.get::<_, String>(0))?;
for name in names {
    println!("{}", name?);
}
```

プレースホルダーの文字列 (`?,?,?`) だけを、`format!` で作っている。値は、`params_from_iter` で、パラメータとして渡している。

---

## データの取得 <a id="query" data-name="データの取得"></a>

### 1行だけ取得する (query_row)

```rust
let name: String = conn.query_row(
    "SELECT name FROM users WHERE id = ?1",
    [1],
    |row| row.get(0),
)?;
```

行がないと、`Error::QueryReturnedNoRows` のエラーになる。「ないかもしれない」場合は、`.optional()` を使う。

```rust
use rusqlite::OptionalExtension; // optional() を使うために必要

let name: Option<String> = conn
    .query_row("SELECT name FROM users WHERE id = ?1", [999], |row| row.get(0))
    .optional()?;

match name {
    Some(n) => println!("見つかった: {}", n),
    None => println!("見つからなかった"),
}
```

### 複数行を取得する (query_map)

```rust
let mut stmt = conn.prepare("SELECT id, name FROM users WHERE age >= ?1 ORDER BY id")?;

let rows = stmt.query_map([20], |row| {
    Ok((row.get::<_, i64>(0)?, row.get::<_, String>(1)?))
})?;

// すべて集める (1つでもエラーがあれば、全体がエラーになる)
let users: Vec<(i64, String)> = rows.collect::<rusqlite::Result<_>>()?;
```

`query_map` が返すのは、`Result<T>` のイテレータ。`collect::<Result<Vec<_>>>()` で、`Vec<T>` にまとめられる。

### 行を 1つずつ取り出す (query)

```rust
let mut stmt = conn.prepare("SELECT id, name FROM users")?;
let mut rows = stmt.query([])?;

while let Some(row) = rows.next()? {
    let id: i64 = row.get(0)?;
    let name: String = row.get(1)?;
    println!("{id}: {name}");
}
```

`query_map` は、イテレータとして扱えて、簡潔。`query` + `next()` は、ループの中で、柔軟な処理 (途中で抜ける、複雑な条件) をしたいときに使う。

### 列の取り出し方 (row.get)

```rust
let id: i64 = row.get(0)?;          // 列の番号 (0 から)
let name: String = row.get("name")?; // 列の名前
let age: Option<i32> = row.get("age")?; // NULL を許す列は、Option
```

| 書き方 | 説明 |
| --- | --- |
| `row.get(0)?` | 番号で取り出す (型は、変数の型注釈や、戻り値から決まる) |
| `row.get("name")?` | 列の名前で取り出す |
| `row.get::<_, String>(0)?` | 型を、turbofish で指定する |

<pre><code class="tips">列の番号で取り出すと、SELECT の列の順序を変えたときに、壊れやすい。名前で取り出す方が、安全で読みやすい。
ただし、名前での検索は、わずかにコストがかかるため、大量の行を扱うときは、番号を使う選択肢もある。</code></pre>

### 構造体に変換する

行を構造体に変換する関数を、1か所にまとめておくと、再利用できる。

```rust
use rusqlite::{Row, Result};

#[derive(Debug)]
struct User {
    id: i64,
    name: String,
    email: String,
    age: Option<i32>,
}

impl User {
    fn from_row(row: &Row<'_>) -> Result<Self> {
        Ok(User {
            id: row.get("id")?,
            name: row.get("name")?,
            email: row.get("email")?,
            age: row.get("age")?,
        })
    }
}

fn find_all(conn: &Connection) -> Result<Vec<User>> {
    let mut stmt = conn.prepare("SELECT id, name, email, age FROM users")?;
    let rows = stmt.query_map([], User::from_row)?; // 関数を、そのまま渡せる
    rows.collect()
}

fn find_one(conn: &Connection, id: i64) -> Result<Option<User>> {
    conn.query_row(
        "SELECT id, name, email, age FROM users WHERE id = ?1",
        [id],
        User::from_row,
    )
    .optional()
}
```

### 存在を確認する

```rust
let mut stmt = conn.prepare("SELECT 1 FROM users WHERE email = ?1")?;
let exists = stmt.exists(["alice@example.com"])?;
```

---

## データ型 <a id="types" data-name="データ型"></a>

### SQLite と Rust の型の対応

| SQLite の型 | Rust の型 |
| --- | --- |
| `INTEGER` | `i64` (`i8`、`i16`、`i32`、`u8`、`u16`、`u32` も可)、`bool` (0 / 1) |
| `REAL` | `f64` (`f32` も可) |
| `TEXT` | `String`、`&str` |
| `BLOB` | `Vec<u8>`、`&[u8]` |
| `NULL` | `Option<T>` の `None` |

```rust
let age: Option<i32> = row.get("age")?;      // NULL なら None
let data: Vec<u8> = row.get("data")?;        // BLOB
let active: bool = row.get("active")?;       // 0 なら false、それ以外は true
```

<pre><code class="caution">u64 と usize は、既定では使えない (SQLite の整数は、符号付きの 64 ビットで、u64 の大きな値は、収まらないため)。
i64 で受け取って、必要なら as や try_from で変換する。COUNT(*) も、i64 で受け取る。</code></pre>

```rust
let count: i64 = conn.query_row("SELECT COUNT(*) FROM users", [], |row| row.get(0))?;
let count = count as usize;
```

### 型が合わないとき

列の値の型が、取り出す型と合わないと、`Error::InvalidColumnType` になる。SQLite は動的な型付けなので、`INTEGER` の列に、文字列が入っていることもありうる。

| 状況 | 結果 |
| --- | --- |
| `NULL` を、`Option` でない型で取り出す | `InvalidColumnType` のエラー |
| `TEXT` を、`i64` で取り出す | `InvalidColumnType` のエラー |
| 列の番号や名前が、存在しない | `InvalidColumnIndex` / `InvalidColumnName` のエラー |

### 日時、UUID、JSON

対応するフィールドを有効にすると、型をそのまま渡せる。

```toml
rusqlite = { version = "...", features = ["bundled", "chrono", "uuid", "serde_json"] }
```

```rust
use chrono::{DateTime, Utc};
use uuid::Uuid;

conn.execute(
    "INSERT INTO events (id, created_at, payload) VALUES (?1, ?2, ?3)",
    (Uuid::new_v4(), Utc::now(), serde_json::json!({ "kind": "login" })),
)?;

let (id, created_at): (Uuid, DateTime<Utc>) = conn.query_row(
    "SELECT id, created_at FROM events LIMIT 1",
    [],
    |row| Ok((row.get(0)?, row.get(1)?)),
)?;
```

| 型 | 保存される形式 |
| --- | --- |
| `chrono::DateTime<Utc>` | TEXT (RFC 3339 形式の文字列) |
| `uuid::Uuid` | BLOB (16バイト) |
| `serde_json::Value` | TEXT (JSON の文字列) |

SQLite には、日時専用の型がなく、TEXT、INTEGER (Unix 時間)、REAL のいずれかで保存する。形式をそろえておくと、並び替えや比較が、正しく動く。

### 自作の型 (enum など) を保存する

`ToSql` と `FromSql` を実装すると、自作の型を、そのまま渡せる。

```rust
use rusqlite::types::{FromSql, FromSqlError, FromSqlResult, ToSql, ToSqlOutput, ValueRef};

#[derive(Debug, PartialEq)]
enum Status {
    Active,
    Inactive,
}

impl ToSql for Status {
    fn to_sql(&self) -> rusqlite::Result<ToSqlOutput<'_>> {
        let s = match self {
            Status::Active => "active",
            Status::Inactive => "inactive",
        };
        Ok(s.into())
    }
}

impl FromSql for Status {
    fn column_result(value: ValueRef<'_>) -> FromSqlResult<Self> {
        match value.as_str()? {
            "active" => Ok(Status::Active),
            "inactive" => Ok(Status::Inactive),
            other => Err(FromSqlError::Other(format!("不明な状態: {}", other).into())),
        }
    }
}

// 使う
conn.execute("INSERT INTO accounts (status) VALUES (?1)", (Status::Active,))?;
let status: Status = conn.query_row("SELECT status FROM accounts LIMIT 1", [], |r| r.get(0))?;
```

---

## 更新と削除 <a id="update-delete" data-name="更新と削除"></a>

### UPDATE と DELETE

`execute` は、**変更された行数**を返す。「対象の行があったか」の確認に使える。

```rust
let changed = conn.execute(
    "UPDATE users SET email = ?1 WHERE id = ?2",
    ("new@example.com", 1),
)?;

if changed == 0 {
    println!("対象の行がなかった");
}

let deleted = conn.execute("DELETE FROM users WHERE id = ?1", [1])?;
println!("{} 行を削除した", deleted);
```

### INSERT の後に ID を取得する

```rust
conn.execute("INSERT INTO users (name, email) VALUES (?1, ?2)", ("Alice", "a@example.com"))?;
let id = conn.last_insert_rowid(); // 直前の INSERT の rowid
```

`RETURNING` を使うと、INSERT と ID の取得を、1つの SQL にできる (SQLite 3.35 以降)。

```rust
let id: i64 = conn.query_row(
    "INSERT INTO users (name, email) VALUES (?1, ?2) RETURNING id",
    ("Bob", "b@example.com"),
    |row| row.get(0),
)?;
```

### UPSERT (なければ追加、あれば更新)

```rust
conn.execute(
    "INSERT INTO users (email, name) VALUES (?1, ?2)
     ON CONFLICT(email) DO UPDATE SET name = excluded.name",
    ("alice@example.com", "Alice"),
)?;
```

`excluded` は、追加しようとした行の値を指す。競合の対象 (`ON CONFLICT(email)`) の列には、`UNIQUE` 制約か、主キーが必要。

---

## トランザクション <a id="transaction" data-name="トランザクション"></a>

複数の操作を、「すべて成功するか、すべて取り消されるか」にまとめる。

```rust
use rusqlite::{Connection, Result};

fn transfer(conn: &mut Connection, from: i64, to: i64, amount: i64) -> Result<()> {
    let tx = conn.transaction()?; // トランザクションを開始

    tx.execute(
        "UPDATE accounts SET balance = balance - ?1 WHERE id = ?2",
        (amount, from),
    )?;
    tx.execute(
        "UPDATE accounts SET balance = balance + ?1 WHERE id = ?2",
        (amount, to),
    )?;

    tx.commit() // 確定
}
```

| 動作 | 説明 |
| --- | --- |
| `conn.transaction()` | トランザクションを開始する (`&mut Connection` が必要) |
| `tx.commit()` | 確定する |
| `tx.rollback()` | 取り消す |
| `Transaction` が、commit されずに drop される | **既定では、自動でロールバック**される |

<pre><code class="tips">途中の ? でエラーが返ると、tx は commit されずに drop されるため、ロールバックされる。エラー処理を、明示的に書かなくても、中途半端な状態が、残らない。
drop 時の動作は、tx.set_drop_behavior(DropBehavior::Commit) などで、変えられる (DropBehavior::Panic にすると、commit か rollback を、書き忘れたときに、パニックで気付ける)。</code></pre>

### 一括の追加 (速度)

SQLite は、トランザクションの外で、1回ずつ INSERT すると、毎回ディスクに書き込むため、非常に遅い。**1つのトランザクションにまとめる**と、桁違いに速くなる。

```rust
fn bulk_insert(conn: &mut Connection) -> rusqlite::Result<()> {
    let tx = conn.transaction()?;
    {
        // 準備済みのステートメントを、1回だけ作って、使い回す
        let mut stmt = tx.prepare("INSERT INTO items (name) VALUES (?1)")?;
        for i in 0..10_000 {
            stmt.execute([format!("item{}", i)])?;
        }
    } // stmt が、ここで破棄される (commit の前に、手放す必要がある)
    tx.commit()
}
```

### 開始のタイミング (TransactionBehavior)

```rust
use rusqlite::TransactionBehavior;

let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
```

| 種類 | 動作 |
| --- | --- |
| `Deferred` (既定) | 最初に、読み書きするまで、ロックを取らない |
| `Immediate` | 開始時に、書き込みロックを取る |
| `Exclusive` | 開始時に、他の接続の読み取りも、止める (WAL では、`Immediate` とほぼ同じ) |

読んだ後で書き込む処理は、`Deferred` だと、書き込みの時点で、他の接続にロックを取られていて、失敗する (`SQLITE_BUSY`) ことがある。書き込みを伴うトランザクションは、`Immediate` で始めると、安全。

### セーブポイント (入れ子)

```rust
let mut tx = conn.transaction()?;
tx.execute("INSERT INTO logs (msg) VALUES ('開始')", ())?;

{
    let sp = tx.savepoint()?; // 部分的に、取り消せる地点
    sp.execute("INSERT INTO logs (msg) VALUES ('失敗するかもしれない処理')", ())?;
    // sp.commit()? で確定。drop されると、この部分だけロールバックされる。
}

tx.commit()?;
```

### &mut が使えないとき

`transaction()` は `&mut Connection` を要求する。`&Connection` しか持っていない場合は、`unchecked_transaction()` が使える。

```rust
fn work(conn: &Connection) -> rusqlite::Result<()> {
    let tx = conn.unchecked_transaction()?; // 入れ子の誤りは、実行時に検出される
    tx.execute("...", ())?;
    tx.commit()
}
```

---

## 準備済みステートメント <a id="statement" data-name="準備済みステートメント"></a>

`execute` や `query_row` は、SQL を、毎回解析 (コンパイル) する。同じ SQL を、繰り返し実行するときは、`prepare` で、1回だけ解析して、使い回す。

```rust
let mut stmt = conn.prepare("INSERT INTO users (name, email) VALUES (?1, ?2)")?;

stmt.execute(("Alice", "a@example.com"))?;
stmt.execute(("Bob", "b@example.com"))?;
```

| 項目 | 説明 |
| --- | --- |
| `prepare(sql)` | ステートメントを作る。`Statement` は、接続を借用する |
| `stmt.execute(params)` | INSERT などを実行する |
| `stmt.query_map(params, f)` / `query(params)` | SELECT を実行する |
| `stmt.exists(params)` | 結果が、1行以上あるかを返す |

### prepare_cached

`prepare_cached` を使うと、接続の内部で、解析済みのステートメントが、キャッシュされる (同じ SQL なら、再利用される)。

```rust
let mut stmt = conn.prepare_cached("SELECT name FROM users WHERE id = ?1")?;
let name: String = stmt.query_row([1], |row| row.get(0))?;
```

<pre><code class="caution">rusqlite 0.38 から、ステートメントのキャッシュは、オプションの機能になった。
prepare_cached を使うときは、使っているバージョンのドキュメントで、有効にするフィーチャーを確認する。</code></pre>

---

## エラー処理 <a id="error" data-name="エラー処理"></a>

rusqlite の関数は、`rusqlite::Result<T>` (= `Result<T, rusqlite::Error>`) を返す。

### 主なエラー

| エラー | 発生する場面 |
| --- | --- |
| `QueryReturnedNoRows` | `query_row` で、結果が 0 行だった |
| `SqliteFailure(ffi::Error, Option<String>)` | SQLite 自体のエラー (制約違反、ロック、構文エラーなど) |
| `InvalidColumnType` | 列の値の型が、取り出す型と合わない |
| `InvalidColumnIndex` / `InvalidColumnName` | 存在しない列を、取り出した |
| `InvalidParameterCount` | SQL のプレースホルダーの数と、渡した値の数が違う |
| `FromSqlConversionFailure` / `ToSqlConversionFailure` | 型の変換に失敗した |

### 制約違反を判定する

`UNIQUE` や `NOT NULL` などの制約に違反したときは、`SqliteFailure` で、`ErrorCode::ConstraintViolation` になる。

```rust
use rusqlite::{Connection, ErrorCode};

fn insert_user(conn: &Connection, name: &str, email: &str) -> Result<i64, DbError> {
    match conn.execute("INSERT INTO users (name, email) VALUES (?1, ?2)", (name, email)) {
        Ok(_) => Ok(conn.last_insert_rowid()),
        Err(rusqlite::Error::SqliteFailure(e, _)) if e.code == ErrorCode::ConstraintViolation => {
            Err(DbError::Duplicate)
        }
        Err(e) => Err(DbError::Sqlite(e)),
    }
}
```

制約の種類まで、区別したい場合は、`e.extended_code` を、`rusqlite::ffi::SQLITE_CONSTRAINT_UNIQUE` などと比べる。

### アプリケーションのエラー型

```rust
use thiserror::Error;

#[derive(Debug, Error)]
enum DbError {
    #[error("見つかりません: id={0}")]
    NotFound(i64),

    #[error("すでに登録されています")]
    Duplicate,

    #[error(transparent)]
    Sqlite(#[from] rusqlite::Error), // ? で、自動で変換される
}
```

簡単なアプリでは、`anyhow::Result` を使うと、エラー型を定義しなくて済む。

---

## 設定 (PRAGMA) <a id="pragma" data-name="設定(PRAGMA)"></a>

SQLite の動作は、`PRAGMA` で設定する。**接続ごとの設定**が多いため、接続を開いたら、毎回設定する。

```rust
use std::time::Duration;

fn open(path: &str) -> rusqlite::Result<Connection> {
    let conn = Connection::open(path)?;

    conn.busy_timeout(Duration::from_secs(5))?; // ロック待ちの、最大時間
    conn.execute_batch(
        "PRAGMA foreign_keys = ON;
         PRAGMA journal_mode = WAL;
         PRAGMA synchronous = NORMAL;",
    )?;

    Ok(conn)
}
```

| PRAGMA | 説明 |
| --- | --- |
| `foreign_keys = ON` | 外部キー制約を、有効にする。**既定では無効**で、接続ごとに設定が必要 |
| `journal_mode = WAL` | WAL (先行書き込みログ) モード。読み取りと書き込みが、互いを待たなくなる。ファイルに記録され、一度設定すれば、以降も続く |
| `synchronous = NORMAL` | ディスクへの同期の頻度を下げる (WAL と組み合わせると、安全性を保ちつつ、高速になる) |
| `busy_timeout` | ロックされているときに、すぐエラーにせず、指定した時間、待つ。`conn.busy_timeout(...)` でも設定できる |
| `user_version` | アプリ側で自由に使える、整数。スキーマのバージョン管理に使う |

単一の PRAGMA を設定・取得するメソッドもある。

```rust
conn.pragma_update(None, "foreign_keys", true)?;

let version: i32 = conn.pragma_query_value(None, "user_version", |row| row.get(0))?;
```

<pre><code class="caution">foreign_keys は、既定で OFF。設定しないと、外部キー制約が、まったく働かない。
接続を作る場所 (接続プールを含む) で、必ず ON にする。</code></pre>

### sqlite3 コマンドで中身を確認する

```bash
sqlite3 app.db
```

| コマンド | 説明 |
| --- | --- |
| `.tables` | テーブルの一覧 |
| `.schema users` | テーブルの定義 |
| `.headers on` / `.mode column` | 結果を、見やすく表示する |
| `SELECT * FROM users;` | SQL を実行する |
| `.quit` | 終了する |

---

## マイグレーション <a id="migration" data-name="マイグレーション"></a>

スキーマを変更する (テーブルや列を追加する) 履歴を、管理する仕組み。

### user_version で自作する

`PRAGMA user_version` に、現在のスキーマのバージョンを記録して、足りない分だけ、順に適用する。

```rust
fn migrate(conn: &mut Connection) -> rusqlite::Result<()> {
    let version: i32 = conn.pragma_query_value(None, "user_version", |row| row.get(0))?;

    if version < 1 {
        let tx = conn.transaction()?;
        tx.execute_batch(
            "CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
             );",
        )?;
        tx.pragma_update(None, "user_version", 1)?;
        tx.commit()?;
    }

    if version < 2 {
        let tx = conn.transaction()?;
        tx.execute_batch("ALTER TABLE users ADD COLUMN email TEXT;")?;
        tx.pragma_update(None, "user_version", 2)?;
        tx.commit()?;
    }

    Ok(())
}
```

### rusqlite_migration

マイグレーションを、まとめて管理する crate。

```bash
cargo add rusqlite_migration
```

```rust
use rusqlite_migration::{Migrations, M};

let migrations = Migrations::new(vec![
    M::up("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);"),
    M::up("ALTER TABLE users ADD COLUMN email TEXT;"),
]);

let mut conn = Connection::open("app.db")?;
migrations.to_latest(&mut conn)?; // 未適用のマイグレーションを、順に適用する
```

<pre><code class="caution">rusqlite_migration は、特定のバージョンの rusqlite に対応している。
rusqlite のバージョンを上げるときは、rusqlite_migration の、対応するバージョンも合わせる。</code></pre>

---

## 並行処理 <a id="concurrency" data-name="並行処理"></a>

### Connection のスレッド安全性

| 性質 | 意味 |
| --- | --- |
| `Send` | 別のスレッドへ、**移動**できる |
| `!Sync` | 複数のスレッドから、**同時に参照**できない (`&Connection` を、スレッド間で共有できない) |

複数のスレッドで使う方法は、3つある。

| 方法 | 内容 |
| --- | --- |
| スレッドごとに、接続を開く | 最も単純。SQLite は、複数の接続からの、同時アクセスを、ファイルのロックで調整する |
| `Arc<Mutex<Connection>>` | 1つの接続を、ロックで共有する。単純だが、処理が直列になる |
| 接続プール (`r2d2_sqlite` など) | 複数の接続を、プールして、借りて使う |

```rust
use std::sync::{Arc, Mutex};

let conn = Arc::new(Mutex::new(Connection::open("app.db")?));

let conn2 = Arc::clone(&conn);
std::thread::spawn(move || {
    let conn = conn2.lock().unwrap();
    conn.execute("INSERT INTO logs (msg) VALUES (?1)", ["from thread"]).unwrap();
})
.join()
.unwrap();
```

### SQLITE_BUSY (database is locked)

SQLite は、**同時に書き込めるのは、1つの接続だけ**。他の接続が書き込み中だと、`SqliteFailure` (`DatabaseBusy` / `DatabaseLocked`) のエラーになる。

| 対処 | 内容 |
| --- | --- |
| `busy_timeout` | すぐエラーにせず、指定した時間、待つ |
| WAL モード | 読み取りと書き込みが、互いをブロックしなくなる (書き込み同士は、直列のまま) |
| トランザクションを短くする | ロックを持つ時間を、短くする |
| `Immediate` で開始する | 書き込みを伴う処理は、最初に書き込みロックを取る |

### 接続プール (r2d2_sqlite)

```bash
cargo add r2d2 r2d2_sqlite
```

```rust
use r2d2_sqlite::SqliteConnectionManager;

let manager = SqliteConnectionManager::file("app.db")
    .with_init(|conn| conn.execute_batch("PRAGMA foreign_keys = ON;")); // 接続ごとの初期化
let pool = r2d2::Pool::new(manager)?;

let conn = pool.get()?; // プールから、接続を借りる (drop されると、返却される)
let count: i64 = conn.query_row("SELECT COUNT(*) FROM users", [], |row| row.get(0))?;
```

<pre><code class="caution">r2d2_sqlite は、対応する rusqlite のバージョンが決まっている。自分で rusqlite を別のバージョンで依存に入れると、型が一致せずに、エラーになる。
r2d2_sqlite が再エクスポートしている rusqlite を、使うのが確実。</code></pre>

### 非同期のコードから使う

rusqlite は同期の API なので、async の中で直接呼ぶと、ワーカースレッドを、ブロックしてしまう。`spawn_blocking` で、ブロッキング用のスレッドに移す。

```rust
use std::sync::{Arc, Mutex};

async fn count_users(conn: Arc<Mutex<Connection>>) -> Result<i64, Box<dyn std::error::Error>> {
    let count = tokio::task::spawn_blocking(move || {
        let conn = conn.lock().unwrap();
        conn.query_row("SELECT COUNT(*) FROM users", [], |row| row.get::<_, i64>(0))
    })
    .await??; // 1つ目の ? は、タスクの失敗 (JoinError)、2つ目の ? は、rusqlite のエラー

    Ok(count)
}
```

`tokio-rusqlite` crate は、専用のスレッドで接続を動かして、非同期の API として使えるようにする。

<pre><code class="tips">std::sync::Mutex のロックを持ったまま .await してはいけない。
上の例のように、ロックを取る処理を、spawn_blocking の中 (同期のコード) に、閉じ込める。</code></pre>

---

## アプリケーションの構成例 <a id="structure" data-name="アプリケーションの構成例"></a>

接続と SQL を、1つの構造体にまとめて、アプリの他の部分に、SQL を見せない構成の例。

```rust
use rusqlite::{Connection, OptionalExtension, Result, Row};

#[derive(Debug, Clone)]
pub struct User {
    pub id: i64,
    pub name: String,
    pub email: String,
    pub age: Option<i32>,
}

impl User {
    fn from_row(row: &Row<'_>) -> Result<Self> {
        Ok(User {
            id: row.get("id")?,
            name: row.get("name")?,
            email: row.get("email")?,
            age: row.get("age")?,
        })
    }
}

pub struct UserRepo {
    conn: Connection,
}

impl UserRepo {
    /// データベースを開いて、スキーマを用意する
    pub fn open(path: &str) -> Result<Self> {
        let conn = Connection::open(path)?;
        Self::init(conn)
    }

    /// テスト用に、メモリ上のデータベースを作る
    pub fn open_in_memory() -> Result<Self> {
        Self::init(Connection::open_in_memory()?)
    }

    fn init(conn: Connection) -> Result<Self> {
        conn.execute_batch(
            "PRAGMA foreign_keys = ON;
             CREATE TABLE IF NOT EXISTS users (
                 id    INTEGER PRIMARY KEY,
                 name  TEXT NOT NULL,
                 email TEXT NOT NULL UNIQUE,
                 age   INTEGER
             );",
        )?;
        Ok(UserRepo { conn })
    }

    pub fn add(&self, name: &str, email: &str, age: Option<i32>) -> Result<i64> {
        self.conn.execute(
            "INSERT INTO users (name, email, age) VALUES (?1, ?2, ?3)",
            (name, email, age),
        )?;
        Ok(self.conn.last_insert_rowid())
    }

    pub fn find(&self, id: i64) -> Result<Option<User>> {
        self.conn
            .query_row(
                "SELECT id, name, email, age FROM users WHERE id = ?1",
                [id],
                User::from_row,
            )
            .optional()
    }

    pub fn list(&self) -> Result<Vec<User>> {
        let mut stmt = self
            .conn
            .prepare("SELECT id, name, email, age FROM users ORDER BY id")?;
        let rows = stmt.query_map([], User::from_row)?;
        rows.collect()
    }

    /// 更新できたら true、対象がなければ false
    pub fn update_email(&self, id: i64, email: &str) -> Result<bool> {
        let changed = self
            .conn
            .execute("UPDATE users SET email = ?1 WHERE id = ?2", (email, id))?;
        Ok(changed > 0)
    }

    pub fn delete(&self, id: i64) -> Result<bool> {
        let changed = self.conn.execute("DELETE FROM users WHERE id = ?1", [id])?;
        Ok(changed > 0)
    }
}

fn main() -> Result<()> {
    let repo = UserRepo::open("app.db")?;

    let id = repo.add("Alice", "alice@example.com", Some(30))?;
    println!("{:?}", repo.find(id)?);

    repo.update_email(id, "alice@new.example.com")?;

    for user in repo.list()? {
        println!("{:?}", user);
    }

    repo.delete(id)?;
    Ok(())
}
```

---

## テスト <a id="test" data-name="テスト"></a>

`Connection::open_in_memory()` は、呼ぶたびに、**独立した、空のデータベース**を作る。テストごとに作れば、テスト同士が、影響し合わず、並列に実行しても安全。

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_and_find() -> rusqlite::Result<()> {
        let repo = UserRepo::open_in_memory()?;

        let id = repo.add("Alice", "alice@example.com", Some(30))?;
        let user = repo.find(id)?.expect("追加したユーザーが見つかるはず");

        assert_eq!(user.name, "Alice");
        assert_eq!(user.age, Some(30));
        Ok(())
    }

    #[test]
    fn find_missing_returns_none() -> rusqlite::Result<()> {
        let repo = UserRepo::open_in_memory()?;
        assert!(repo.find(999)?.is_none());
        Ok(())
    }

    #[test]
    fn duplicate_email_is_error() -> rusqlite::Result<()> {
        let repo = UserRepo::open_in_memory()?;
        repo.add("Alice", "same@example.com", None)?;

        // UNIQUE 制約に違反する
        assert!(repo.add("Bob", "same@example.com", None).is_err());
        Ok(())
    }
}
```

<pre><code class="tips">テストでファイルのデータベースを使うときは、tempfile crate で、テストごとに別の一時ディレクトリを作る。固定のパスを共有すると、並列実行のテストが、衝突する。
テストについての詳細は、「Rustのテスト」のドキュメントを参照。</code></pre>

---

## 発展的な機能 <a id="advanced" data-name="発展的な機能"></a>

| 機能 | フィーチャー | 概要 |
| --- | --- | --- |
| バックアップ | `backup` | 稼働中のデータベースを、別のファイルへコピーする |
| BLOB の段階的な読み書き | `blob` | 大きな BLOB を、メモリに全部載せず、一部ずつ読み書きする |
| 独自の SQL 関数 | `functions` | Rust で書いた関数を、SQL から呼べるようにする |
| フック | `hooks` | 更新、コミット、ロールバックのときに、コードを呼ぶ |
| シリアライズ | `serialize` | データベース全体を、バイト列として取り出す・読み込む |
| 拡張機能 | `load_extension` | SQLite の拡張機能 (全文検索など) を、読み込む |
| 仮想テーブル | `vtab` | Rust のコードを、テーブルのように、SQL で検索できるようにする |

### 独自の SQL 関数 (functions)

```rust
use rusqlite::functions::FunctionFlags;

conn.create_scalar_function(
    "double",
    1,
    FunctionFlags::SQLITE_UTF8 | FunctionFlags::SQLITE_DETERMINISTIC,
    |ctx| {
        let n: i64 = ctx.get(0)?;
        Ok(n * 2)
    },
)?;

let v: i64 = conn.query_row("SELECT double(21)", [], |row| row.get(0))?;
assert_eq!(v, 42);
```

---

## SQLite のスキーマ設計の注意 <a id="schema" data-name="スキーマ設計の注意"></a>

| 項目 | 内容 |
| --- | --- |
| 主キー | `INTEGER PRIMARY KEY` の列は、rowid の別名になり、自動で採番される (`AUTOINCREMENT` は、通常は不要) |
| 型の厳密さ | 列の型は、ヒントとして扱われる。厳密にしたいときは、`CREATE TABLE ... STRICT` (SQLite 3.37 以降) |
| 真偽値 | 専用の型はなく、`INTEGER` の 0 / 1 で表す |
| 日時 | 専用の型はなく、`TEXT` (ISO 8601 / RFC 3339)、`INTEGER` (Unix 時間)、`REAL` のいずれかで保存する |
| 外部キー | 既定では無効。`PRAGMA foreign_keys = ON` が必要 |
| インデックス | 検索や結合に使う列には、`CREATE INDEX` を作る。`EXPLAIN QUERY PLAN` で、使われているかを確認できる |
| 列の変更 | `ALTER TABLE` でできる変更は限られる (列の追加、名前の変更、削除など)。複雑な変更は、新しいテーブルを作って、データを移す |

```sql
-- 型を厳密にしたテーブル
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER
) STRICT;
```

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| 古い記事のコードが、そのままではコンパイルできない | rusqlite の API が、バージョンごとに変わっている | 使っているバージョンのドキュメント (docs.rs) を確認する |
| `u64` や `usize` で、コンパイルエラー | 0.38 から、既定では実装されていない | `i64` で受け取って、変換する |
| `QueryReturnedNoRows` のエラー | `query_row` で、結果が 0 行だった | `.optional()` で `Option` にする |
| `InvalidColumnType` のエラー | NULL を `Option` でない型で受けた、または型が違う | NULL を許す列は `Option<T>`。`NOT NULL` 制約を付ける |
| 外部キー制約が、効かない | `foreign_keys` が、既定では OFF | 接続のたびに `PRAGMA foreign_keys = ON` |
| `database is locked` | 別の接続が、書き込み中 | `busy_timeout`、WAL モード、短いトランザクション、`Immediate` |
| 大量の INSERT が、とても遅い | 1行ごとに、ディスクへ書き込んでいる | 1つのトランザクションにまとめて、`prepare` を使い回す |
| `Statement` を使い続けて、borrow のエラー | `Statement` は、`Connection` (または `Transaction`) を借用している | スコープ `{ }` で、`Statement` を先に手放す |
| `transaction()` で `&mut` のエラー | `transaction()` は `&mut Connection` が必要 | `&mut` で受け取る。または `unchecked_transaction()` |
| 別のスレッドへ、接続を渡せない (`Sync`) | `Connection` は `Send` だが、`Sync` ではない | スレッドごとに接続を作る、`Mutex` で包む、プールを使う |
| 非同期の処理が、止まる | async の中で、ブロッキングの API を呼んでいる | `spawn_blocking`、または `tokio-rusqlite` |
| 文字列で、SQL を組み立てて、危険 | SQL インジェクション | パラメータ (`?1` や `:name`) で値を渡す |
| ファイルが、ロックされたまま残る | WAL モードでは、`-wal` と `-shm` のファイルも作られる | 3つのファイルを、セットで扱う (コピーするときは、`backup` を使う) |
| ビルドに失敗する (`bundled`) | C コンパイラがない | コンパイラ (gcc や clang、Windows では MSVC) を入れる |

---

## 関連 crate <a id="ecosystem" data-name="関連crate"></a>

| crate | 用途 |
| --- | --- |
| `rusqlite_migration` | マイグレーションの管理 |
| `r2d2` + `r2d2_sqlite` | 接続プール |
| `deadpool-sqlite` | 非同期のコードに向いた、接続プール |
| `tokio-rusqlite` | 非同期の API で、rusqlite を使う |
| `thiserror` / `anyhow` | エラー型の定義と、簡易的なエラー処理 |
| `serde` / `serde_json` | 構造体や JSON との変換 |
| `chrono` / `time` / `jiff` | 日時の型 |
| `uuid` | UUID の生成と保存 |
| `tempfile` | テスト用の、一時的なデータベースファイル |
| `sqlx` / `diesel` / `sea-orm` | rusqlite 以外の、DB アクセスの選択肢 |
