---
title: SQLite
layout: default
---

# SQLite <a id="top" data-name="TOP"></a>

- SQLiteは単なるライブラリであり、データベースの操作はアプリケーションプロセス内で直接行われるため、MySQLやPostgreSQLのように専用のサーバーを立ち上げる必要がない。
- データベース全体が単一のファイル(例: example.db)に格納されるため、ファイルをコピーするだけでバックアップができ、ファイルを他のマシンに移動すればそのまま使える。
- インストールが簡単で、初期設定も不要であるため、開発や小規模なアプリケーションに適している。
- SQLiteは単一プロセスまたは少数のクライアントによるアクセスを想定しているため、大規模な並行処理や分散環境には不向き。

---

## 導入 <a id="introduction" data-name="導入"></a>

```bash
sudo apt update
sudo apt install sqlite3 libsqlite3-dev build-essential
```

#### gcc

```c
gcc test_sqlite.c -o test_sqlite -lsqlite3
```

`-lsqlite3`を付けてコンパイル

#### CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.10)
project(MySQLiteApp C)
set(CMAKE_C_STANDARD 11)

add_executable(my_sqlite_app main.c)
target_link_libraries(my_sqlite_app PRIVATE sqlite3)
```


---

## Cサンプルコード <a id="c-sample" data-name="Cサンプルコード"></a>

<pre><code class="example">#include &lt;stdio.h&gt;
#include &lt;sqlite3.h&gt;

int main() {
    sqlite3 *db;
    char *err_msg = NULL;

    // test.db を開く（なければ自動作成）
    int rc = sqlite3_open("test.db", &db);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Cannot open db: %s\n", sqlite3_errmsg(db));
        return 1;
    }

    const char *sql = "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT);"
                      "INSERT INTO users(name) VALUES('Alice');";

    rc = sqlite3_exec(db, sql, 0, 0, &err_msg);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", err_msg);
        sqlite3_free(err_msg);
        sqlite3_close(db);
        return 1;
    }

    printf("Database setup complete.\n");

    sqlite3_close(db);
    return 0;
}</code></pre>

---

## メタコマンド <a id="meta" data-name="メタコマンド"></a>

SQLiteのインタラクティブシェルで使用する.〇〇形式のコマンドを**メタコマンド**と呼ぶ。

<table>
    <caption>接続と終了</caption>
    <tr><td>.open [ファイル名]</td><td>dbファイルを開く(ファイルが無い場合は新規作成)。</td></tr>
    <tr><td>.quitまたは.exit</td><td>SQLiteシェルを終了する。</td></tr>
</table>

<table>
    <caption>情報の表示</caption>
    <tr><td>.tables</td><td>データベース内のすべてのテーブル名を一覧表示する。</td></tr>
    <tr><td>.schema [テーブル名]</td><td>テーブルのスキーマを表示する。テーブル名を省略するとすべてのスキーマが表示される。</td></tr>
    <tr><td>.databases</td><td>現在接続しているdbを一覧表示する。</td></tr>
    <tr><td>.indexes [テーブル名]</td><td>特定のテーブルに関連付けられているインデックスを表示する。</td></tr>
</table>

<table>
    <caption>クエリ結果のフォーマット</caption>
    <tr><td>.mode [フォーマット]</td><td>column 列形式(見やすい形式)。<br>csv CSV形式。<br>json JSON形式。</td></tr>
    <tr><td>.headers on/off</td><td>クエリ結果に列名を表示(on)または非表示(off)にする。</td></tr>
</table>

<table>
    <caption>ファイル操作</caption>
    <tr><td>.read [ファイル名]</td><td>ファイルに保存されたSQLスクリプトを実行する。</td></tr>
    <tr><td>.output [ファイル名]</td><td>クエリの結果の出力先を指定したファイルに変更する(デフォルトで標準出力)。<br>終了する際は.output stdout</td></tr>
</table>

<table>
    <caption>デバッグ・管理</caption>
    <tr><td>.help</td><td>全てのメタコマンドの一覧と簡単な説明を表示する。</td></tr>
    <tr><td>.timer on/off</td><td>各コマンドの実行時間を表示(on)または非表示(off)にする。</td></tr>
    <tr><td>.dump [テーブル名]</td><td>指定したテーブルの内容をエクスポートする。テーブル名を省略するとdb全体をエクスポートする。</td></tr>
</table>
