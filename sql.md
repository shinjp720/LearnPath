---
title: SQL
layout: default
---

# SQL <a id="top" data-name="TOP"></a>

- SQLはデータベースを操作するための言語。

---

## SELECT文 <a id="select-sentence" data-name="SELECT文"></a>
SQLのSELECT文はデータベースからデータを抽出(検索)するための最も基本的な構文。

### 記述順と実行順
SELECT文は記述する順番と実行される順番が違うので、意識すると処理の流れが見えてくる。

#### 記述順

1. SELECT
2. FROM
3. WHERE
4. GROUP BY
5. HAVING
6. ORDER BY
7. LIMIT

#### 実行順

1. FROM どのテーブルを使うかを決定。JOINもここで処理される。
2. WHERE 行を絞り込む(グループ化前のフィルタ)。
3. GROUP BY 指定した列でグループ化。
4. HAVING グループ化後の条件(集計結果に対して絞り込む)。
5. SELECT どの列、計算結果を取り出すかを決定。
6. ORDER BY 並び替えを行う。
7. LIMIT 取得する件数を制限。

### データ抽出の最小構成

```sql
-- 基本構文
SELECT カラム名1 [, カラム名2, ...]
FROM テーブル名;
```

---

### SELECT句 <a id="select" data-name="SELECT句"></a>

#### 全列取得
- *で全列取得。
  <pre><code class="example">SELECT *
FROM country;</code></pre>

#### AS
ASはエイリアス(別名)を指定するためのキーワードで、テーブル名や列名にわかりやすい名前を付けることでクエリの可読性や結果の見やすさを向上させる。

- クエリ結果にエイリアス
  <pre><code class="example">SELECT continent, SUM(population) AS TotalPop</code></pre>

- テーブルにエイリアス<br>
  長いテーブル名を短縮したり、複数のテーブルをJOINする際にエイリアスを使うことで、クエリを簡潔に記述できる。
  <pre><code class="example">SELECT u.name, o.order_id
FROM users AS u
INNER JOIN orders AS o
ON u.id = o.user_id;</code></pre>

- サブクエリのエイリアス<br>
  サブクエリで取得した結果にエイリアスを付けることで、そのデータセットを一時的なテーブルとして扱える。
  <pre><code class="example">SELECT sub.department, sub.avg_salary
FROM (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) AS sub
WHERE sub.avg_salary > 50000;</code></pre>

#### 集計関数

| 関数 | 説明 |
| --- | --- |
| AVG() | 平均値 |
| COUNT() | レコード数 |
| MAX() | 最大値 |
| MIN() | 最小値 |
| SUM() | 合計値 |

<pre><code class="caution">NULL値を含むレコードは無視されるので、AVG()とCOUNT()には注意が必要。
COUNT(*)とするとNULLも含めてカウントする。</code></pre>

#### 日付関数

<table>
    <tr><th>関数</th><th>説明</th></tr>
    <tr><td>NOW()またはCURRENT_TIMESTAMP()</td><td>現在の日時を取得</td></tr>
    <tr><td>CURDATE()またはCURRENT_DATE()</td><td>現在の日付けを取得</td></tr>
    <tr><td>CURTIME()またはCURRENT_TIME()</td><td>現在の時刻を取得</td></tr>
    <tr><td>YEAR(date)</td><td>dateから年を抽出</td></tr>
    <tr><td>MONTH(date)</td><td>dateから月を抽出</td></tr>
    <tr><td>DAY(date)</td><td>dateから日を抽出</td></tr>
    <tr><td>DATEDIFF(date1, date2)</td><td>日数の差を計算</td></tr>
    <tr><td>DATE_FORMAT(date, format)</td>
    <td>
        <table width="400px">
            <caption>日付を指定内容に基づいてフォーマットする</caption>
            <tr><td>%Y</td><td>年(4桁の数字)</td></tr>
            <tr><td>%y</td><td>年(2桁の数字)</td></tr>
            <tr><td>%b</td><td>月(jan...dac)</td></tr>
            <tr><td>%c</td><td>月(1...12)</td></tr>
            <tr><td>%m</td><td>月(01...12)</td></tr>
            <tr><td>%a</td><td>週(San..Sat)</td></tr>
            <tr><td>%d</td><td>日(01...31)</td></tr>
            <tr><td>%H</td><td>時(00...23)</td></tr>
            <tr><td>%h</td><td>時(91...12)</td></tr>
        </table>
        <pre><code class="example">SELECT DATE_FORMAT(now(), ‘%Y/%m/%d’)
-- 2014/10/30</code></pre>
        <pre><code class="example">SELECT DATE_FORMAT(rental_date, ‘%Y年%d月%d日’)
-- 2005年05月24日</code></pre>
    </td></tr>
    <tr><td>DATE_ADD(date, INTERVAL 期間)</td><td>dateに対して期間を加える<br>
        INTERVALにはYEAR, MONTH, DAY, HOUR, MINUTE, SECONDがある
        <pre><code class="example">SELECT DATE_ADD(now(), INTERVAL -10 DAY)</code></pre>
    </td></tr>
</table>

#### 数値関数

| 関数 | 説明 |
| --- | --- |
| ROUND(x) | xを四捨五入する |
| ROUND(x, n) | xを四捨五入して、nで表示する小数点以下の桁数を指定 |
| CEIL(x) | xを切り上げる |
| FLOOR(x) | xを切り捨てる |
| ABS(x) | xの絶対値 |

#### 文字列操作関数

| 関数 | 説明 |
| --- | --- |
| CONCAT(a, b) | 文字列を結合 |
| UPPER(str) | 小文字を大文字に変換 |
| LOWER(STR) | 大文字を小文字に変換 |
| SUBSTRING(str, start, len) | strのstartからlen文字取り出す(1オリジン) |
| SUBSTRING(str, start) | startから後ろを取り出す(1オリジン) |
| LENGTH(str) | 文字数 |

#### DISTINCT
重複を取り除いて取得

<pre><code class="example">SELECT DISTINCT continent</code></pre>

#### 列同士の演算
四則演算子などを用いて列同士の計算が可能。

<pre><code class="example">SELECT price, quantity, price * quantity AS total_price
FROM sales;</code></pre>



#### サブクエリ


#### CASE式


---

### FROM句 <a id="from" data-name="FROM句"></a>

#### JOIN
JOINは複数のテーブルからデータを結合して取得するための操作。

```sql
-- 基本構文
SELECT 列名
FROM テーブルA
JOIN テーブルB
    ON テーブルA.列名 = テーブルB.列名;
```

<table>
    <caption>JOINの種類</caption>
    <tr><th>種類</th><th>説明</th></tr>
    <tr><td>INNER JOIN(内部結合)</td><td>両方のテーブルで一致するデータのみを取得。JOINのみの場合は、デフォルトでINNER JOINとなる。</td></tr>
    <tr><td>LEFT JOIN(左外部結合)</td><td>左側のテーブルのデータはすべて取得し、一致するデータが右側になければNULLが入る。</td></tr>
    <tr><td>RIGHT JOIN(右外部結合)</td><td>右側のテーブルのデータはすべて取得し、一致するデータが左側になければNULLが入る。</td></tr>
    <tr><td>FULL JOIN(完全外部結合)</td><td>両方のテーブルのすべてのデータを取得し、一致しない部分にはNULLが入る。</td></tr>
    <tr><td>CROSS JOIN(直積)</td><td>テーブルのすべての組み合わせを取得します。条件がないと全件×全件の結果が返される。</td></tr>
</table>

  <pre><code class="example">SELECT u.name, o.order_id
FROM users AS u
INNER JOIN orders AS o
    ON u.id = o.user_id
LEFT JOIN payments AS p
    ON o.id = p.order_id</code></pre>
 
- JOINのポイント
  - ONで結合条件を指定する。
  - エイリアス(別名)を使うとコードが読みやすくなる。
  - JOINが多くなるとパフォーマンスに影響するため、必要最小限の結合を意識する。

---

### WHERE句 <a id="WHERE" data-name="WHERE句"></a>
WHERE句で条件を指定してデータを抽出する。

```sql
-- 基本構文
SELECT カラム名
FROM テーブル名
WHERE 条件式
```

#### 比較演算子

| 演算子 | 意味 |
| --- | --- |
| `=` | 等しい |
| `!=` または `<>` | 等しくない |
| `>` | 左辺は右辺より大きい |
| `>=` | 左辺は右辺以上 |
| `<` | 左辺は右辺より小さい |
| `<=` | 左辺は右辺以上 |

比較演算子は数値と文字列に対して利用でき、比較結果としてTRUE, FALSE, NULLの値を返す。<br> 
TRUE, FALSEにはそれぞれ定数1と0が割り当てられている。

#### 四則演算

| 演算子 | 意味 |
| --- | --- |
| `+` | 加算 |
| `-` | 減算 |
| `*` | 乗算 |
| `/` | 除算 |
| `DIV` | 除算(整数) |
| `%`または`MOD` | 剰余 |

#### 複数の条件で検索する

| 演算子 | 意味 |
| --- | --- |
| `&&`または`AND` | いずれも真 |
| `||`または`OR` | いずれかが真 |
| `!`または`NOT` | 否定 |
| 条件1`XOR`条件2 | 条件の一方のみが真の場合真 |

<pre><code class="example">SELECT * 
FROM city
WHERE CountryCode = 'JPN'
AND Population > 2000000;</code></pre>
CountryCodeが’JPN’かつPopulationが200万より大きい

#### あいまい検索
文字列の一部を任意の文字で検索する。

| 記号 | 意味 |
| --- | --- |
| `%` | 任意の文字列(0文字以上) |
| `_` | 任意の1文字(1文字のみ) |

```sql
WHERE カラム名 LIKE '文字列'
```

<pre><code class="example">SELECT *
FROM city
WHERE Name LIKE 'Tok%'</code></pre>

#### ある範囲の値を検索する

```sql
WHERE カラム名 BETWEEN 値1 AND 値2;
```

#### 値がリストに一致するレコードを検索する

```sql
WHERE カラム名 IN (値1, 値2, ...);
```

#### NULLのレコード

```sql
-- 値が空のレコード
WHERE カラム名 IS NULL;

-- 値が空ではないレコード
WHERE カラム名 IS NOT NULL;
```

---

### GROUP BY句 <a id="GROUP BY" data-name="GROUP BY句"></a>
GROUP BYは、同じ値を持つ行をまとめてグループ化し、集計関数などで集計を行うために用いる。

```sql
GROUP BY カラム名;
```

<pre><code class="example">SELECT continent, AVG(population)
FROM country
GROUP BY continent</code></pre>
大陸ごとの人口の平均。

<pre><code class="caution">GROUP BYを使う際は、SELECT句にはGROUP BYに含まれる列か、集計関数しか書けない</code></pre>

#### 複数列のグループ化

<pre><code class="example">SELECT YEAR(order_date) AS year, MONTH(order_date) AS month, SUM(amount) AS total
FROM sales
GROUP BY YEAR(order_date), MONTH(order_date);</code></pre>
〇年〇月ごとに合計を抽出。

---

### HAVING句 <a id="HAVING" data-name="HAVING句"></a>




---

### ORDER BY句 <a id="ORDERY BY" data-name="ORDER BY句"></a>
SELECT文の結果を並び替える。

```sql
-- 基本構文
ORDER BY カラム名 [ASC | DESC];
```
デフォルトでASC(昇順)となっているので、降順にしたい場合はDESCを指定する。

#### 複数の条件で並び替え

<pre><code class="example">SELECT name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;</code></pre>

1. 部署ごとに昇順で並び替え。
2. 同じ部署で給料(salary)が高い順に並び替え。

---

### LIMIT句 <a id="LIMIT" data-name="LIMIT句"></a>
取得上限数を指定する。

```cpp
LIMIT [開始位置,] 件数;
```

---

## 外部キー制約 <a id="foreign-key" data-name="外部キー制約"></a>

### 外部キー制約の設定

- テーブルの作成時に外部キーを設定する

<pre><code class="example">CREATE TABLE parent_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE child_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    description VARCHAR(100),
    FOREIGN KEY (parent_id) REFERENCES parent_table(id)
);</code></pre>

子テーブルのparent_idが親テーブルのidに関連付けられる。

- 既存のテーブルに外部キーを追加する

<pre><code class="example">ALTER TABLE child_table
ADD CONSTRAINT fk_parent
FOREIGN KEY (parent_id) REFERENCES parent_table(id);</code></pre>

- fk_parentは外部キー制約の名前(任意)。省略すると自動で名前が付けられる。<br>
名前を付けるとこにより、
  - エラーが発生した時にfk_parentが違反しています。という形でどの外部キー制約で問題が発生しているか特定できる。
  - ALTER TABLEやDROPで外部キー制約を削除したりする際、自動で付けられた名前を調べる必要がある。
<pre><code class="example">ALTER TABLE child_table DROP CONSTRAINT fk_parent;</code></pre>

複数の外部キーがある場合に管理しやすくなる。
### データの操作方法
- データの挿入
  - 親テーブルにデータが存在しないと、外部キー制約により子テーブルにデータを挿入できない。

<pre><code class="example">-- 親テーブルにデータを挿入
INSERT INTO parent_table (name) VALUES ('Parent 1');

-- 子テーブルに親テーブルのIDを参照してデータを挿入
INSERT INTO child_table (parent_id, description) VALUES (1, 'Child of Parent 1');</code></pre>

### データの取得(JOINを使用)
- テーブル間の関連データを取得するにはJOINを使う。
<pre><code class="example">SELECT child_table.id AS child_id, child_table.description, parent_table.name AS parent_name
FROM
    child_table
JOIN
    parent_table ON child_table.parent_id = parent_table.id;</code></pre>

### 外部キー制約の制御

- 外部キー制約で、親テーブルの変更が子テーブルにどのように影響するかを定義できる。

<pre><code class="example">ON DELETE CASCADE:親テーブルの行が削除されると、関連する子テーブルの行も削除される。
ON DELETE SET NULL:親テーブルの行が削除されると、子テーブルの外部キーがNULLになる。
ON UPDATE CASCADE:親テーブルのデータが更新された時に、それを参照している子テーブルのデータが自動的に更新される。
                
CREATE TABLE child_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    description VARCHAR(100),
    FOREIGN KEY (parent_id) REFERENCES parent_table(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);</code></pre>

### 中間テーブルを使った多対多の設定

- ユーザーとグループのテーブルの作成

<pre><code class="example">CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL
);

CREATE TABLE groups (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50) NOT NULL
);</code></pre>

- 中間テーブルの作成

<pre><code class="example">CREATE TABLE user_group (
user_id INT NOT NULL,
group_id INT NOT NULL,
PRIMARY KEY (user_id, group_id),
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);</code></pre>

### データの挿入

<pre><code class="example">-- ユーザーを挿入
INSERT INTO users (name) VALUES ('Alice');
INSERT INTO users (name) VALUES ('Bob');
-- グループを挿入
INSERT INTO groups (name) VALUES ('Admins');
INSERT INTO groups (name) VALUES ('Editors');
-- ユーザーとグループの関係を挿入
INSERT INTO user_group (user_id, group_id) VALUES (1, 1); -- Alice -> Admins
INSERT INTO user_group (user_id, group_id) VALUES (1, 2); -- Alice -> Editors
INSERT INTO user_group (user_id, group_id) VALUES (2, 2); -- Bob -> Editors</code></pre>

### データの取得

- 特定ユーザーが属するグループを取得

<pre><code class="example">SELECT
    users.name AS user_name,
    groups.name AS group_name
FROM
    user_group
JOIN
    users ON user_group.user_id = users.id
JOIN
    groups ON user_group.group_id = groups.id
WHERE
    users.name = 'Alice';</code></pre>

- 特定グループに属するユーザーを取得

<pre><code class="example">SELECT
    groups.name AS group_name,
    users.name AS user_name
FROM
    user_group
JOIN
    groups ON user_group.group_id = groups.id
JOIN
    users ON user_group.user_id = users.id
WHERE
    groups.name = 'Editors';</code></pre>

- 全てのユーザーとその所属グループを取得

<pre><code class="example">SELECT users.name AS user_name, groups.name AS group_name
FROM
    user_group
JOIN
    users ON user_group.user_id = users.id
JOIN
    groups ON user_group.group_id = groups.id;</code></pre>


- 中間テーブルに追加情報を保存

<pre><code class="example">CREATE TABLE user_group (
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);</code></pre>

## データのエクスポート・インポート <a id="export-inport" data-name="エクスポート・インポート"></a>

### MySQL

- データのエクスポート(バックアップ)

```bash
# 全データベースをエクスポート
mysqldump -u [ユーザー名] -p --all-databases > backup.sql

# 特定のデータベースをエクスポート
mysqldump -u [ユーザー名] -p [データベース名] > backup.sql

# 特定のテーブルをエクスポート
mysqldump -u [ユーザー名] -p [データベース名] [テーブル名] > table_backup.sql
```

- データのインポート(リストア)

```bash
# データベース作成
mysql -u [ユーザー名] -p -e "CREATE DATABASE [データベース名];"

# エクスポートファイルからインポート
mysql -u [ユーザー名] -p [データベース名] < backup.sql
```

### SQLite

- データのエクスポート(バックアップ)

```bash
# データベース全体をSQL形式でエクスポート
sqlite3 [データベースファイル名].db .dump > backup.sql
```

- データのインポート(リストア)

```bash
# 新規データベースを作成してSQLファイルをインポート
sqlite3 [新データベースファイル名].db < backup.sql
```

  - SQLiteは直接ファイルをコピーするだけでもバックアップとして機能する。

```bash
cp [データベースファイル名].db backup.db
```

### MySQL > SQLiteへ変換

1. mysql2sqliteをGitHubから取得
```bash
git clone https://github.com/dumblob/mysql2sqlite.git
cd mysql2sqlite
chmod +x mysql2sqlite # 不要な場合あり
```
2. MySQLのデータをSQLとしてダンプ<br>
  MySQL 特有の構文を含まないよう、変換に適したオプションを付ける。
```bash
mysqldump -u root -p \
  --skip-triggers \
  --compact \
  --compatible=ansi \
  --skip-lock-tables \
  --no-create-db \
  --complete-insert \
  # mydbがデータベース名
  mydb > dump.sql 
```
3. MySQLのSQLのSQLをSQLite形式へ変換
```bash
./mysql2sqlite.sh dump.sql > sqlite.sql
```
4. SQLiteデータベースへ取り込む
```bash
sqlite3 output.db < sqlite.sql
```
5. 動作確認
```bash
sqlite3 output.db
sqlite> .tables
sqlite> SELECT * FROM table_name LIMIT 5;
```

## データベースの接続文字列 <a id="connection" data-name="接続"></a>
- MySQL

  DATABASE_URL=mysql://username:password@localhost:3306/mydb

- mysql-connector-pythonで接続する場合

```python
from dotenv import load_dotenv
import os
import mysql.connector
from urllib.parse import urlparse

# .envファイルをロード
load_dotenv()

# 環境変数から接続情報を取得
database_url = os.getenv("DATABASE_URL")

# 接続情報を分解
parsed_url = urlparse(database_url)

db_config = mysql.connector.connect(
    host=parsed_url.hostname,
    user=parsed_url.username,
    password=parsed_url.password,
    database=parsed_url.path.lstrip('/'),
    port=parsed_url.port
)

print("データベースに接続しました")
db_config.close()
```

        
SQLAlchemyで接続する場合は接続文字列を直接利用できる

```python
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine

# .envファイルをロード
load_dotenv()

# 環境変数から接続URLを取得
database_url = os.getenv("DATABASE_URL")

# エンジンを作成
engine = create_engine(database_url)

# データベースに接続
with engine.connect() as connection:
    result = connection.execute("SELECT DATABASE()")
    for row in result:
        print(f"Connected to: {row[0]}")
```
