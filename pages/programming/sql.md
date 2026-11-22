---
title: SQL
layout: default
---

# SQL <a id="top" data-name="TOP"></a>

SQL は、データベースを操作するための言語。データの検索、追加、更新、削除と、テーブルの定義を、同じ書き方で行える。

SQL の文は、役割によって、次のように分けられる。このドキュメントでは、MySQL と SQLite を中心に扱う。

| 分類 | 内容 | 主な文 |
| --- | --- | --- |
| DQL (データ問い合わせ) | データを検索する | `SELECT` |
| DML (データ操作) | データを追加、更新、削除する | `INSERT`、`UPDATE`、`DELETE` |
| DDL (データ定義) | テーブルなどの構造を定義する | `CREATE`、`ALTER`、`DROP` |
| TCL (トランザクション制御) | 処理のまとまりを確定、取り消しする | `COMMIT`、`ROLLBACK` |

<pre><code class="caution">SQL は標準化されているが、データベースごとに、関数や構文が異なる。
このドキュメントの例は、特に断りがない限り、MySQL を前提にしている。SQLite では、動かない関数や構文がある。</code></pre>

---

## SELECT文 <a id="select-sentence" data-name="SELECT文"></a>

SQL の `SELECT` 文は、データベースからデータを抽出 (検索) するための、最も基本的な構文。

### 記述順と実行順

`SELECT` 文は、記述する順番と、実行される順番が違う。この違いを意識すると、処理の流れが見えてくる。

#### 記述順

| 順 | 句 |
| --- | --- |
| 1 | `SELECT` |
| 2 | `FROM` |
| 3 | `WHERE` |
| 4 | `GROUP BY` |
| 5 | `HAVING` |
| 6 | `ORDER BY` |
| 7 | `LIMIT` |

#### 実行順

| 順 | 句 | 内容 |
| --- | --- | --- |
| 1 | `FROM` | どのテーブルを使うかを決定。`JOIN` もここで処理される |
| 2 | `WHERE` | 行を絞り込む (グループ化前のフィルタ) |
| 3 | `GROUP BY` | 指定した列でグループ化 |
| 4 | `HAVING` | グループ化後の条件 (集計結果に対して絞り込む) |
| 5 | `SELECT` | どの列、計算結果を取り出すかを決定 |
| 6 | `ORDER BY` | 並び替えを行う |
| 7 | `LIMIT` | 取得する件数を制限 |

<pre><code class="tips">WHERE は SELECT より先に実行されるため、SELECT で付けた別名 (AS) を、WHERE の中では使えない。
別名を使えるのは、SELECT より後に実行される ORDER BY などである。</code></pre>

### データ抽出の最小構成

```sql
-- 基本構文
SELECT カラム名1 [, カラム名2, ...]
FROM テーブル名;
```

---

### SELECT句 <a id="select" data-name="SELECT句"></a>

#### 全列取得

`*` で、全列を取得する。

<pre><code class="example">SELECT *
FROM country;</code></pre>

<pre><code class="tips">アプリケーションのコードでは、必要な列だけを書く方が、列が増えたときにも安全で、通信量も少ない。</code></pre>

#### AS

`AS` は、エイリアス (別名) を指定するためのキーワード。テーブル名や列名に、わかりやすい名前を付けることで、クエリの可読性や、結果の見やすさを向上させる。

**クエリ結果にエイリアス**

<pre><code class="example">SELECT continent, SUM(population) AS TotalPop</code></pre>

**テーブルにエイリアス**<br>
長いテーブル名を短縮したり、複数のテーブルを `JOIN` する際にエイリアスを使ったりすることで、クエリを簡潔に記述できる。

<pre><code class="example">SELECT u.name, o.order_id
FROM users AS u
INNER JOIN orders AS o
ON u.id = o.user_id;</code></pre>

**サブクエリのエイリアス**<br>
サブクエリで取得した結果にエイリアスを付けることで、そのデータセットを、一時的なテーブルとして扱える。

<pre><code class="example">SELECT sub.department, sub.avg_salary
FROM (
    SELECT department, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department
) AS sub
WHERE sub.avg_salary &gt; 50000;</code></pre>

<pre><code class="caution">FROM の中のサブクエリ (派生テーブル) には、必ずエイリアスが必要になる。付けないと、MySQL ではエラーになる。</code></pre>

#### 集計関数

| 関数 | 説明 |
| --- | --- |
| `AVG()` | 平均値 |
| `COUNT()` | レコード数 |
| `MAX()` | 最大値 |
| `MIN()` | 最小値 |
| `SUM()` | 合計値 |

<pre><code class="caution">NULL 値を含むレコードは、集計の対象外になるので、AVG() と COUNT(列名) には注意が必要。
COUNT(*) とすると、NULL も含めてカウントする。</code></pre>

#### 日付関数

以下は MySQL の関数。SQLite には、`NOW()` などがなく、`datetime('now')` のような別の関数を使う。

| 関数 | 説明 |
| --- | --- |
| `NOW()` または `CURRENT_TIMESTAMP()` | 現在の日時を取得 |
| `CURDATE()` または `CURRENT_DATE()` | 現在の日付を取得 |
| `CURTIME()` または `CURRENT_TIME()` | 現在の時刻を取得 |
| `YEAR(date)` | date から年を抽出 |
| `MONTH(date)` | date から月を抽出 |
| `DAY(date)` | date から日を抽出 |
| `DATEDIFF(date1, date2)` | 日数の差を計算 |
| `DATE_FORMAT(date, format)` | 日付を、指定した書式の文字列に変換する |
| `DATE_ADD(date, INTERVAL 期間)` | date に対して期間を加える。INTERVAL には、`YEAR`、`MONTH`、`DAY`、`HOUR`、`MINUTE`、`SECOND` がある |

`DATE_FORMAT` の書式には、次の指定子を使う。

| 指定子 | 内容 |
| --- | --- |
| `%Y` | 年 (4桁の数字) |
| `%y` | 年 (2桁の数字) |
| `%b` | 月の略称 (Jan〜Dec) |
| `%c` | 月 (1〜12) |
| `%m` | 月 (01〜12) |
| `%a` | 曜日の略称 (Sun〜Sat) |
| `%d` | 日 (01〜31) |
| `%H` | 時 (00〜23) |
| `%h` | 時 (01〜12) |
| `%i` | 分 (00〜59) |
| `%s` | 秒 (00〜59) |

<pre><code class="example">SELECT DATE_FORMAT(now(), '%Y/%m/%d')
-- 2014/10/30</code></pre>

<pre><code class="example">SELECT DATE_FORMAT(rental_date, '%Y年%m月%d日')
-- 2005年05月24日</code></pre>

<pre><code class="example">SELECT DATE_ADD(now(), INTERVAL -10 DAY)</code></pre>

#### 数値関数

| 関数 | 説明 |
| --- | --- |
| `ROUND(x)` | x を四捨五入する |
| `ROUND(x, n)` | x を四捨五入して、n で表示する小数点以下の桁数を指定 |
| `CEIL(x)` | x を切り上げる |
| `FLOOR(x)` | x を切り捨てる |
| `ABS(x)` | x の絶対値 |

#### 文字列操作関数

| 関数 | 説明 |
| --- | --- |
| `CONCAT(a, b)` | 文字列を結合 |
| `UPPER(str)` | 小文字を大文字に変換 |
| `LOWER(str)` | 大文字を小文字に変換 |
| `SUBSTRING(str, start, len)` | str の start から len 文字取り出す (1オリジン) |
| `SUBSTRING(str, start)` | start から後ろを取り出す (1オリジン) |
| `CHAR_LENGTH(str)` | 文字数 |
| `LENGTH(str)` | バイト数 (MySQL では、UTF-8 の日本語は、1文字が3バイトになる) |

<pre><code class="caution">MySQL の LENGTH() は、文字数ではなく、バイト数を返す。日本語の文字数を数えるときは、CHAR_LENGTH() を使う。
SQLite の LENGTH() は、文字列に対して、文字数を返す。</code></pre>

#### DISTINCT

重複を取り除いて取得する。

<pre><code class="example">SELECT DISTINCT continent</code></pre>

#### 列同士の演算

四則演算子などを用いて、列同士の計算ができる。

<pre><code class="example">SELECT price, quantity, price * quantity AS total_price
FROM sales;</code></pre>

#### サブクエリ

`SELECT` 文の中に書く、もう1つの `SELECT` 文。丸括弧で囲んで、書く場所に応じて、値や、一時的なテーブルとして使う。

| 書く場所 | 内容 |
| --- | --- |
| `SELECT` 句 | 1つの値を返すサブクエリを、列として使う |
| `FROM` 句 | 結果を、一時的なテーブルとして使う (エイリアスが必要) |
| `WHERE` 句 | 条件の値や、`IN` の候補を、サブクエリで求める |

```sql
-- 平均給与より高い社員
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- 注文のある社員だけ
SELECT name
FROM employees
WHERE id IN (SELECT employee_id FROM orders);
```

#### CASE式

条件に応じて、返す値を切り替える。

```sql
SELECT name,
       salary,
       CASE
           WHEN salary >= 500000 THEN '高'
           WHEN salary >= 300000 THEN '中'
           ELSE '低'
       END AS salary_level
FROM employees;
```

<pre><code class="tips">CASE は、上の WHEN から順に評価されて、最初に当てはまった値が返る。どれにも当てはまらず、ELSE もないときは、NULL になる。</code></pre>

---

### FROM句 <a id="from" data-name="FROM句"></a>

#### JOIN

`JOIN` は、複数のテーブルからデータを結合して、取得するための操作。

```sql
-- 基本構文
SELECT 列名
FROM テーブルA
JOIN テーブルB
    ON テーブルA.列名 = テーブルB.列名;
```

JOIN の種類

| 種類 | 説明 |
| --- | --- |
| `INNER JOIN` (内部結合) | 両方のテーブルで一致するデータのみを取得。`JOIN` のみの場合は、デフォルトで `INNER JOIN` となる |
| `LEFT JOIN` (左外部結合) | 左側のテーブルのデータはすべて取得し、一致するデータが右側になければ `NULL` が入る |
| `RIGHT JOIN` (右外部結合) | 右側のテーブルのデータはすべて取得し、一致するデータが左側になければ `NULL` が入る |
| `FULL JOIN` (完全外部結合) | 両方のテーブルのすべてのデータを取得し、一致しない部分には `NULL` が入る |
| `CROSS JOIN` (直積) | テーブルのすべての組み合わせを取得する。条件がないと、全件 × 全件の結果が返される |

<pre><code class="caution">MySQL は、FULL JOIN に対応していない。LEFT JOIN と RIGHT JOIN を UNION でつないで、同じ結果を得る。
SQLite は、RIGHT JOIN と FULL JOIN に、バージョン 3.39.0 (2022年6月) から対応している。</code></pre>

```sql
-- MySQL で FULL JOIN の結果を得る例
SELECT *
FROM テーブルA
LEFT JOIN テーブルB ON テーブルA.列名 = テーブルB.列名
UNION
SELECT *
FROM テーブルA
RIGHT JOIN テーブルB ON テーブルA.列名 = テーブルB.列名;
```

<pre><code class="example">SELECT u.name, o.order_id
FROM users AS u
INNER JOIN orders AS o
    ON u.id = o.user_id
LEFT JOIN payments AS p
    ON o.id = p.order_id</code></pre>

**JOINのポイント**

- `ON` で結合条件を指定する。
- エイリアス (別名) を使うと、コードが読みやすくなる。
- `JOIN` が多くなると、パフォーマンスに影響するため、必要最小限の結合を意識する。

---

### WHERE句 <a id="where" data-name="WHERE句"></a>

`WHERE` 句で条件を指定して、データを抽出する。

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
| `<=` | 左辺は右辺以下 |

比較演算子は、数値と文字列に対して利用でき、比較結果として `TRUE`、`FALSE`、`NULL` の値を返す。<br>
`TRUE`、`FALSE` には、それぞれ定数 1 と 0 が割り当てられている。

#### 四則演算

| 演算子 | 意味 |
| --- | --- |
| `+` | 加算 |
| `-` | 減算 |
| `*` | 乗算 |
| `/` | 除算 |
| `DIV` | 除算 (整数) |
| `%` または `MOD` | 剰余 |

#### 複数の条件で検索する

| 演算子 | 意味 |
| --- | --- |
| `&&` または `AND` | いずれも真 |
| <code>&#124;&#124;</code> または `OR` | いずれかが真 |
| `!` または `NOT` | 否定 |
| `条件1 XOR 条件2` | 条件の一方のみが真の場合真 |

<pre><code class="example">SELECT * 
FROM city
WHERE CountryCode = 'JPN'
AND Population &gt; 2000000;</code></pre>

CountryCode が 'JPN' かつ Population が 200万より大きい。

<pre><code class="caution">AND は OR より先に評価される。両方を混ぜるときは、丸括弧で、評価の順序を明示する。
|| は、MySQL では OR の意味になるが、標準 SQL と SQLite では、文字列の連結になる。移植性のために、AND、OR、NOT を使う方が安全である。</code></pre>

#### あいまい検索

文字列の一部を任意の文字で検索する。

| 記号 | 意味 |
| --- | --- |
| `%` | 任意の文字列 (0文字以上) |
| `_` | 任意の1文字 (1文字のみ) |

```sql
WHERE カラム名 LIKE '文字列'
```

<pre><code class="example">SELECT *
FROM city
WHERE Name LIKE 'Tok%'</code></pre>

<pre><code class="tips">前方一致 (Tok%) は、インデックスを使えることが多い。先頭に % が付く検索 (%kyo) は、インデックスが使われにくく、遅くなりやすい。</code></pre>

#### ある範囲の値を検索する

```sql
WHERE カラム名 BETWEEN 値1 AND 値2;
```

値1 以上、値2 以下の範囲になる (両端を含む)。

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

<pre><code class="caution">NULL は、= や != では比較できない。WHERE カラム名 = NULL は、常に偽 (正確には、NULL) になり、何も返らない。必ず IS NULL か IS NOT NULL を使う。</code></pre>

---

### GROUP BY句 <a id="group-by" data-name="GROUP BY句"></a>

`GROUP BY` は、同じ値を持つ行をまとめてグループ化し、集計関数などで集計を行うために用いる。

```sql
GROUP BY カラム名;
```

<pre><code class="example">SELECT continent, AVG(population)
FROM country
GROUP BY continent</code></pre>

大陸ごとの人口の平均。

<pre><code class="caution">GROUP BY を使う際は、SELECT 句には GROUP BY に含まれる列か、集計関数しか書けない。
MySQL 5.7 以降の既定では、この規則に違反すると、エラーになる (sql_mode の ONLY_FULL_GROUP_BY が有効なため)。</code></pre>

#### 複数列のグループ化

<pre><code class="example">SELECT YEAR(order_date) AS year, MONTH(order_date) AS month, SUM(amount) AS total
FROM sales
GROUP BY YEAR(order_date), MONTH(order_date);</code></pre>

〇年〇月ごとに合計を抽出。

---

### HAVING句 <a id="having" data-name="HAVING句"></a>

`HAVING` は、`GROUP BY` でグループ化した後の、集計結果に対して、条件を指定する。

| 句 | 絞り込む対象 | 集計関数 |
| --- | --- | --- |
| `WHERE` | グループ化する前の、行 | 使えない |
| `HAVING` | グループ化した後の、グループ | 使える |

```sql
-- 基本構文
SELECT カラム名, 集計関数
FROM テーブル名
GROUP BY カラム名
HAVING 集計結果の条件;
```

<pre><code class="example">SELECT continent, AVG(population) AS avg_pop
FROM country
GROUP BY continent
HAVING AVG(population) &gt; 10000000;</code></pre>

平均人口が 1,000万を超える大陸だけを取得する。

<pre><code class="tips">行そのものに対する条件は、WHERE に書く方が、グループ化する行が減るため、効率がよい。HAVING には、集計結果に対する条件だけを書く。</code></pre>

---

### ORDER BY句 <a id="order-by" data-name="ORDER BY句"></a>

`SELECT` 文の結果を並び替える。

```sql
-- 基本構文
ORDER BY カラム名 [ASC | DESC];
```

デフォルトで `ASC` (昇順) となっているので、降順にしたい場合は `DESC` を指定する。

#### 複数の条件で並び替え

<pre><code class="example">SELECT name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;</code></pre>

1. 部署ごとに昇順で並び替え。
2. 同じ部署で、給料 (salary) が高い順に並び替え。

<pre><code class="tips">MySQL と SQLite では、NULL は最小の値として扱われる。昇順では、NULL が先頭に並ぶ。</code></pre>

---

### LIMIT句 <a id="limit" data-name="LIMIT句"></a>

取得上限数を指定する。

```sql
LIMIT [開始位置,] 件数;
```

| 書き方 | 内容 |
| --- | --- |
| `LIMIT 5` | 先頭から 5件を取得 |
| `LIMIT 10, 5` | 開始位置 10 (0 から数える) から 5件を取得 |
| `LIMIT 5 OFFSET 10` | 上と同じ。件数と開始位置を、名前付きで書く |

<pre><code class="caution">LIMIT は、ORDER BY とセットで使う。並び順を指定しないと、どの行が先頭になるかは、保証されない。</code></pre>

---

## テーブルの作成とデータの操作 <a id="table-data" data-name="テーブルとデータ操作"></a>

### テーブルの作成

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| 制約 | 内容 |
| --- | --- |
| `PRIMARY KEY` | 行を一意に識別する列。重複と `NULL` を許さない |
| `NOT NULL` | `NULL` を許さない |
| `UNIQUE` | 値の重複を許さない |
| `DEFAULT` | 値を省略したときの、既定値 |
| `AUTO_INCREMENT` | 値を省略すると、連番を自動で入れる (MySQL。SQLite では `AUTOINCREMENT`) |
| `FOREIGN KEY` | 別のテーブルの列を参照する (<a href="#foreign-key">外部キー制約</a>) |

### 主なデータ型

| 型 | 内容 |
| --- | --- |
| `INT` | 整数 |
| `DECIMAL(p, s)` | 小数 (金額など、誤差を出したくない値) |
| `VARCHAR(n)` | 最大 n 文字の可変長の文字列 |
| `TEXT` | 長い文字列 |
| `DATE` / `DATETIME` / `TIMESTAMP` | 日付、日時 |

<pre><code class="tips">SQLite は、型の指定が緩く、列に宣言した型と違う型の値も、そのまま保存できる (型親和性)。MySQL と同じ感覚で、型の違反が、エラーになると期待しない。</code></pre>

### データの挿入、更新、削除

```sql
-- 挿入
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');

-- 更新
UPDATE users SET name = 'Alice Smith' WHERE id = 1;

-- 削除
DELETE FROM users WHERE id = 1;
```

<pre><code class="caution">UPDATE と DELETE で WHERE を書き忘れると、全行が対象になる。実行する前に、同じ WHERE で SELECT して、対象の行を確認する。
まとめて変更するときは、トランザクション (START TRANSACTION と COMMIT / ROLLBACK) の中で実行すると、取り消せる。</code></pre>

---

## 外部キー制約 <a id="foreign-key" data-name="外部キー制約"></a>

外部キー制約は、あるテーブルの列が、別のテーブルの列の値だけを持つように、制限する仕組み。参照される側を親テーブル、参照する側を子テーブルと呼ぶ。

<pre><code class="caution">MySQL で外部キー制約を使うには、InnoDB のテーブルにする必要がある。MyISAM では、書いても無視される。
SQLite では、外部キー制約が、既定で無効になっている (SQLite の章を参照)。</code></pre>

### 外部キー制約の設定

**テーブルの作成時に外部キーを設定する**

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

子テーブルの `parent_id` が、親テーブルの `id` に関連付けられる。

**既存のテーブルに外部キーを追加する**

<pre><code class="example">ALTER TABLE child_table
ADD CONSTRAINT fk_parent
FOREIGN KEY (parent_id) REFERENCES parent_table(id);</code></pre>

`fk_parent` は、外部キー制約の名前 (任意)。省略すると、自動で名前が付けられる。<br>
名前を付けることにより、次の利点がある。

- エラーが発生したときに、「`fk_parent` が違反しています」という形で、どの外部キー制約で問題が発生しているかを特定できる。
- `ALTER TABLE` や `DROP` で外部キー制約を削除する際に、自動で付けられた名前を調べる必要がない。

<pre><code class="example">ALTER TABLE child_table DROP FOREIGN KEY fk_parent;</code></pre>

複数の外部キーがある場合に、管理しやすくなる。

<pre><code class="tips">MySQL 8.0.19 以降では、DROP CONSTRAINT fk_parent の形でも削除できると考えられる (記憶に基づくため、公式のドキュメントで確認する)。
MySQL で外部キーを削除するときは、古いバージョンでも使える DROP FOREIGN KEY が、確実である。</code></pre>

### データの操作方法

**データの挿入**

親テーブルにデータが存在しないと、外部キー制約により、子テーブルにデータを挿入できない。

<pre><code class="example">-- 親テーブルにデータを挿入
INSERT INTO parent_table (name) VALUES ('Parent 1');

-- 子テーブルに親テーブルのIDを参照してデータを挿入
INSERT INTO child_table (parent_id, description) VALUES (1, 'Child of Parent 1');</code></pre>

### データの取得 (JOINを使用)

テーブル間の関連データを取得するには、`JOIN` を使う。

<pre><code class="example">SELECT child_table.id AS child_id, child_table.description, parent_table.name AS parent_name
FROM
    child_table
JOIN
    parent_table ON child_table.parent_id = parent_table.id;</code></pre>

### 外部キー制約の制御

外部キー制約で、親テーブルの変更が、子テーブルにどのように影響するかを定義できる。

| 指定 | 内容 |
| --- | --- |
| `ON DELETE CASCADE` | 親テーブルの行が削除されると、関連する子テーブルの行も削除される |
| `ON DELETE SET NULL` | 親テーブルの行が削除されると、子テーブルの外部キーが `NULL` になる |
| `ON UPDATE CASCADE` | 親テーブルのデータが更新されたときに、それを参照している子テーブルのデータが、自動的に更新される |
| `RESTRICT` | 子テーブルに参照する行があるとき、親テーブルの削除や更新を拒否する |

```sql
CREATE TABLE child_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    description VARCHAR(100),
    FOREIGN KEY (parent_id) REFERENCES parent_table(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```

<pre><code class="caution">ON DELETE CASCADE は、親の行を消すだけで、子の行も連鎖して消える。意図しない削除を避けるため、削除してよい関係にだけ使う。</code></pre>

### 中間テーブルを使った多対多の設定

<pre><code class="caution">GROUPS は、MySQL 8.0.2 以降の予約語である。groups という名前のテーブルは、そのままでは、構文エラーになる。
以下の例では、バッククォート (`) で囲んでいる。実際の開発では、user_groups のように、別の名前にする方が安全である。</code></pre>

**ユーザーとグループのテーブルの作成**

<pre><code class="example">CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE `groups` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);</code></pre>

**中間テーブルの作成**

<pre><code class="example">CREATE TABLE user_group (
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE
);</code></pre>

### 中間テーブルへのデータの挿入

<pre><code class="example">-- ユーザーを挿入
INSERT INTO users (name) VALUES ('Alice');
INSERT INTO users (name) VALUES ('Bob');
-- グループを挿入
INSERT INTO `groups` (name) VALUES ('Admins');
INSERT INTO `groups` (name) VALUES ('Editors');
-- ユーザーとグループの関係を挿入
INSERT INTO user_group (user_id, group_id) VALUES (1, 1); -- Alice -&gt; Admins
INSERT INTO user_group (user_id, group_id) VALUES (1, 2); -- Alice -&gt; Editors
INSERT INTO user_group (user_id, group_id) VALUES (2, 2); -- Bob -&gt; Editors</code></pre>

### 中間テーブルからのデータの取得

**特定ユーザーが属するグループを取得**

<pre><code class="example">SELECT
    users.name AS user_name,
    `groups`.name AS group_name
FROM
    user_group
JOIN
    users ON user_group.user_id = users.id
JOIN
    `groups` ON user_group.group_id = `groups`.id
WHERE
    users.name = 'Alice';</code></pre>

**特定グループに属するユーザーを取得**

<pre><code class="example">SELECT
    `groups`.name AS group_name,
    users.name AS user_name
FROM
    user_group
JOIN
    `groups` ON user_group.group_id = `groups`.id
JOIN
    users ON user_group.user_id = users.id
WHERE
    `groups`.name = 'Editors';</code></pre>

**全てのユーザーとその所属グループを取得**

<pre><code class="example">SELECT users.name AS user_name, `groups`.name AS group_name
FROM
    user_group
JOIN
    users ON user_group.user_id = users.id
JOIN
    `groups` ON user_group.group_id = `groups`.id;</code></pre>

**中間テーブルに追加情報を保存**

上の `user_group` の代わりに、次の定義で作成する。

<pre><code class="example">CREATE TABLE user_group (
    user_id INT NOT NULL,
    group_id INT NOT NULL,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE
);</code></pre>

---

## データのエクスポート・インポート <a id="export-inport" data-name="エクスポート・インポート"></a>

<div class="subtitle">MySQL</div>

- データのエクスポート (バックアップ)

```bash
# 全データベースをエクスポート
mysqldump -u [ユーザー名] -p --all-databases > backup.sql

# 特定のデータベースをエクスポート
mysqldump -u [ユーザー名] -p [データベース名] > backup.sql

# 特定のテーブルをエクスポート
mysqldump -u [ユーザー名] -p [データベース名] [テーブル名] > table_backup.sql
```

- データのインポート (リストア)

```bash
# データベース作成
mysql -u [ユーザー名] -p -e "CREATE DATABASE [データベース名];"

# エクスポートファイルからインポート
mysql -u [ユーザー名] -p [データベース名] < backup.sql
```

<pre><code class="tips">InnoDB のテーブルを、書き込みを止めずにバックアップするときは、mysqldump に --single-transaction を付ける (記憶に基づくため、公式のドキュメントで確認する)。</code></pre>

<div class="subtitle">SQLite</div>

- データのエクスポート (バックアップ)

```bash
# データベース全体をSQL形式でエクスポート
sqlite3 [データベースファイル名].db .dump > backup.sql
```

- データのインポート (リストア)

```bash
# 新規データベースを作成してSQLファイルをインポート
sqlite3 [新データベースファイル名].db < backup.sql
```

SQLite は、直接ファイルをコピーするだけでも、バックアップとして機能する。

```bash
cp [データベースファイル名].db backup.db
```

<pre><code class="caution">ファイルのコピーは、他のプロセスが書き込んでいる最中に行うと、壊れたバックアップになることがある。書き込みが止まっていることを確認してから行う。</code></pre>

<div class="subtitle">MySQL &gt; SQLiteへ変換</div>

変換には、mysql2sqlite を使う。

**1. mysql2sqlite を GitHub から取得**

```bash
git clone https://github.com/dumblob/mysql2sqlite.git
cd mysql2sqlite
chmod +x mysql2sqlite # 不要な場合あり
```

**2. MySQL のデータを SQL としてダンプ**<br>
MySQL 特有の構文を含まないよう、変換に適したオプションを付ける。

```bash
# mydb がデータベース名
mysqldump -u root -p \
  --skip-triggers \
  --compact \
  --compatible=ansi \
  --skip-extended-insert \
  --skip-lock-tables \
  --no-create-db \
  --complete-insert \
  mydb > dump.sql
```

**3. MySQL の SQL を SQLite 形式へ変換**

```bash
./mysql2sqlite dump.sql > sqlite.sql
```

**4. SQLite データベースへ取り込む**

```bash
sqlite3 output.db < sqlite.sql
```

**5. 動作確認**

```text
sqlite3 output.db
sqlite> .tables
sqlite> SELECT * FROM table_name LIMIT 5;
```

<pre><code class="tips">スクリプトの名前は、mysql2sqlite である (拡張子の .sh は付かない)。README では、ダンプのオプションに --skip-extended-insert と --compact が挙げられている。
変換後は、型や制約が、MySQL と同じとは限らない。重要なデータは、件数や内容を、元のデータベースと照らし合わせて確認する。</code></pre>

---

## データベースの接続文字列 <a id="connection" data-name="接続"></a>

**MySQL**

接続情報は、URL の形で、`.env` ファイルなどに書いておく。

```text
DATABASE_URL=mysql://username:password@localhost:3306/mydb
```

**mysql-connector-python で接続する場合**

```python
from dotenv import load_dotenv
import os
import mysql.connector
from urllib.parse import urlparse

# .env ファイルをロード
load_dotenv()

# 環境変数から接続情報を取得
database_url = os.getenv("DATABASE_URL")

# 接続情報を分解
parsed_url = urlparse(database_url)

conn = mysql.connector.connect(
    host=parsed_url.hostname,
    user=parsed_url.username,
    password=parsed_url.password,
    database=parsed_url.path.lstrip('/'),
    port=parsed_url.port
)

print("データベースに接続しました")
conn.close()
```

**SQLAlchemy で接続する場合**

接続文字列を、直接利用できる。ただし、使うドライバーを `+` の後ろに書く。mysql-connector-python を使うときは、`mysql+mysqlconnector://` にする。

```text
DATABASE_URL=mysql+mysqlconnector://username:password@localhost:3306/mydb
```

```python
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, text

# .env ファイルをロード
load_dotenv()

# 環境変数から接続URLを取得
database_url = os.getenv("DATABASE_URL")

# エンジンを作成
engine = create_engine(database_url)

# データベースに接続
with engine.connect() as connection:
    result = connection.execute(text("SELECT DATABASE()"))
    for row in result:
        print(f"Connected to: {row[0]}")
```

| 項目 | 内容 |
| --- | --- |
| `mysql://` | ドライバーに mysqlclient (MySQLdb) を使う書き方 |
| `mysql+mysqlconnector://` | ドライバーに mysql-connector-python を使う書き方 |
| `text()` | SQLAlchemy 2.0 では、SQL の文字列を、`text()` で包んでから `execute()` に渡す |

<pre><code class="caution">パスワードに @ や / などの記号を含む場合は、URL の中で、パーセントエンコードする必要がある。Python では、urllib.parse.quote() を使う。
SQLAlchemy 2.0 では、execute() に文字列を直接渡すと、エラーになる。必ず text() で包む。</code></pre>

---

## MySQL <a id="mysql" data-name="MySQL"></a>

- データをテーブル形式で保存・管理する、オープンソースのリレーショナルデータベース管理システム (RDBMS)。
- Windows、macOS、Linux など、さまざまな OS 環境で動作する。
- 小規模なデータから、テラバイト級の大規模なデータまで対応でき、必要に応じてカスタマイズが可能。

### 導入 <a id="introduction1" data-name="導入"></a>

#### インストール

```bash
sudo apt update
sudo apt install mysql-server
```

#### 起動

MySQL を起動する。

```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### 動作確認

```bash
mysql --version
sudo mysql -e "SELECT VERSION()"
```

### 開発用パッケージのインストール

C 言語などから MySQL を使うときに、必要になる。

```bash
sudo apt install libmysqlclient-dev
```

これらが使えるようになる。

| ファイル | 用途 |
| --- | --- |
| `/usr/include/mysql/mysql.h` | MySQL C API のヘッダ |
| `/usr/lib/x86_64-linux-gnu/libmysqlclient.so` | MySQL クライアントライブラリ |

<pre><code class="tips">ライブラリのパスは、ディストリビューションとバージョンで異なることがある。手元の環境では、mysql_config --libs などで確認する。</code></pre>

#### コンパイル

```bash
gcc main.c -o main $(mysql_config --cflags --libs)
```

`mysqlclient` をリンクする。`mysql_config` が、必要なオプションを出力する。

#### CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyMySQLApp C)
set(CMAKE_C_STANDARD 11)

find_package(PkgConfig REQUIRED)
pkg_check_modules(MYSQLCLIENT REQUIRED mysqlclient)

add_executable(my_mysql_app main.c)
target_include_directories(my_mysql_app PRIVATE ${MYSQLCLIENT_INCLUDE_DIRS})
target_link_libraries(my_mysql_app PRIVATE ${MYSQLCLIENT_LIBRARIES})
```

---

### Cサンプルコード

MySQL に接続して、バージョンを表示する最小の例。ユーザー名、パスワード、データベース名は、環境に合わせて書き換える。

```c
#include <stdio.h>
#include <mysql/mysql.h>

int main(void) {
    MYSQL *conn = mysql_init(NULL);
    if (conn == NULL) {
        fprintf(stderr, "mysql_init failed\n");
        return 1;
    }

    // 接続 (失敗すると NULL が返る)
    if (mysql_real_connect(conn, "localhost", "user", "password",
                           "mydb", 3306, NULL, 0) == NULL) {
        fprintf(stderr, "Connection error: %s\n", mysql_error(conn));
        mysql_close(conn);
        return 1;
    }

    // クエリを実行して、結果を取得
    if (mysql_query(conn, "SELECT VERSION()") != 0) {
        fprintf(stderr, "Query error: %s\n", mysql_error(conn));
        mysql_close(conn);
        return 1;
    }

    MYSQL_RES *res = mysql_store_result(conn);
    if (res == NULL) {
        fprintf(stderr, "Result error: %s\n", mysql_error(conn));
        mysql_close(conn);
        return 1;
    }

    MYSQL_ROW row = mysql_fetch_row(res);
    if (row != NULL) {
        printf("MySQL version: %s\n", row[0]);
    }

    mysql_free_result(res);
    mysql_close(conn);
    return 0;
}
```

```text
MySQL version: 8.0.xx
```

<pre><code class="caution">このサンプルは、実際にはコンパイルしていない。接続先の情報や、ライブラリの場所は、環境に合わせて確認する。</code></pre>

---

## SQLite <a id="sqlite" data-name="SQLite"></a>

- SQLite は単なるライブラリであり、データベースの操作はアプリケーションプロセス内で直接行われるため、MySQL や PostgreSQL のように専用のサーバーを立ち上げる必要がない。
- データベース全体が単一のファイル (例: example.db) に格納されるため、ファイルをコピーするだけでバックアップができ、ファイルを他のマシンに移動すれば、そのまま使える。
- インストールが簡単で、初期設定も不要であるため、開発や小規模なアプリケーションに適している。
- SQLite は単一プロセスまたは少数のクライアントによるアクセスを想定しているため、大規模な並行処理や分散環境には不向き。

Rust から SQLite を使うときは、rusqlite のドキュメントを参照。

### MySQLとの違い

| 項目 | MySQL | SQLite |
| --- | --- | --- |
| 構成 | サーバーに接続する | ライブラリ。ファイルを直接開く |
| 連番の列 | `AUTO_INCREMENT` | `INTEGER PRIMARY KEY` (`AUTOINCREMENT` も可) |
| 現在の日時 | `NOW()` | `datetime('now')` |
| 外部キー制約 | 既定で有効 (InnoDB) | 既定で無効 |
| 型 | 宣言した型に従う | 型親和性。宣言と違う型の値も保存できる |

### 外部キー制約の有効化

SQLite では、接続ごとに、次の命令を実行して、外部キー制約を有効にする。

```sql
PRAGMA foreign_keys = ON;
```

<pre><code class="caution">この命令を実行しないと、外部キー制約を書いていても、違反するデータを、そのまま挿入できてしまう。接続を開き直すたびに、必要になる。</code></pre>

---

### 導入 <a id="introduction2" data-name="導入"></a>

```bash
sudo apt update
sudo apt install sqlite3 libsqlite3-dev build-essential
```

#### コンパイル

```bash
gcc test_sqlite.c -o test_sqlite -lsqlite3
```

`-lsqlite3` を付けてコンパイルする。

#### CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.10)
project(MySQLiteApp C)
set(CMAKE_C_STANDARD 11)

add_executable(my_sqlite_app main.c)
target_link_libraries(my_sqlite_app PRIVATE sqlite3)
```

---

### Cサンプルコード

<pre><code class="example">#include &lt;stdio.h&gt;
#include &lt;sqlite3.h&gt;

int main() {
    sqlite3 *db;
    char *err_msg = NULL;

    // test.db を開く (なければ自動作成)
    int rc = sqlite3_open("test.db", &amp;db);
    if (rc != SQLITE_OK) {
        fprintf(stderr, "Cannot open db: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 1;
    }

    const char *sql = "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT);"
                      "INSERT INTO users(name) VALUES('Alice');";

    rc = sqlite3_exec(db, sql, 0, 0, &amp;err_msg);
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

<pre><code class="tips">このプログラムは、実行するたびに、users テーブルへ Alice を1行追加する。テーブルは IF NOT EXISTS で、2回目以降は作られない。</code></pre>

---

### メタコマンド <a id="meta" data-name="メタコマンド"></a>

SQLite のインタラクティブシェルで使用する、`.〇〇` 形式のコマンドを、**メタコマンド**と呼ぶ。

#### 接続と終了

| コマンド | 内容 |
| --- | --- |
| `.open [ファイル名]` | db ファイルを開く (ファイルが無い場合は新規作成) |
| `.quit` または `.exit` | SQLite シェルを終了する |

#### 情報の表示

| コマンド | 内容 |
| --- | --- |
| `.tables` | データベース内のすべてのテーブル名を一覧表示する |
| `.schema [テーブル名]` | テーブルのスキーマを表示する。テーブル名を省略すると、すべてのスキーマが表示される |
| `.databases` | 現在接続している db を一覧表示する |
| `.indexes [テーブル名]` | 特定のテーブルに関連付けられているインデックスを表示する |

#### クエリ結果のフォーマット

| コマンド | 内容 |
| --- | --- |
| `.mode [フォーマット]` | `column`: 列形式 (見やすい形式)<br>`csv`: CSV 形式<br>`json`: JSON 形式 |
| `.headers on/off` | クエリ結果に列名を表示 (on) または非表示 (off) にする |

#### ファイル操作

| コマンド | 内容 |
| --- | --- |
| `.read [ファイル名]` | ファイルに保存された SQL スクリプトを実行する |
| `.output [ファイル名]` | クエリの結果の出力先を、指定したファイルに変更する (デフォルトで標準出力)。終了する際は `.output stdout` |
| `.import [ファイル名] [テーブル名]` | CSV などのファイルを、テーブルに取り込む |

#### デバッグ・管理

| コマンド | 内容 |
| --- | --- |
| `.help` | 全てのメタコマンドの一覧と、簡単な説明を表示する |
| `.timer on/off` | 各コマンドの実行時間を表示 (on) または非表示 (off) にする |
| `.dump [テーブル名]` | 指定したテーブルの内容を、SQL 文として出力する (エクスポート)。テーブル名を省略すると、db 全体をエクスポートする |

<pre><code class="tips">メタコマンドは、SQL ではないので、末尾に ; を付けない。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `WHERE カラム名 = NULL` で、何も返らない | `NULL` は、`=` で比較できない | `IS NULL` を使う |
| `Unknown column '別名' in 'where clause'` | `WHERE` は `SELECT` より先に実行されるため、別名が、まだ存在しない | 元の式を書く。または、サブクエリで包む |
| `... incompatible with sql_mode=only_full_group_by` | `SELECT` に、`GROUP BY` にも集計関数にもない列がある | その列を `GROUP BY` に加える。または、集計関数で包む |
| `You have an error in your SQL syntax ... near 'groups'` | `groups` が、MySQL 8.0.2 以降の予約語 | バッククォートで囲む。または、別の名前にする |
| `Cannot add or update a child row: a foreign key constraint fails` | 親テーブルに、参照先の行がない | 親テーブルに、先にデータを挿入する |
| `Cannot delete or update a parent row: a foreign key constraint fails` | 子テーブルに、その行を参照する行がある | 子テーブルの行を先に削除する。または、`ON DELETE` を指定する |
| `LENGTH()` が、日本語で文字数と合わない | MySQL の `LENGTH()` は、バイト数を返す | `CHAR_LENGTH()` を使う |
| `FULL JOIN` で構文エラーになる | MySQL は `FULL JOIN` に対応していない | `LEFT JOIN` と `RIGHT JOIN` を `UNION` でつなぐ |
| `AVG()` の結果が、思った値と違う | `NULL` の行が、平均の対象から外れている | `COALESCE()` で値を置き換える。または、集計の対象を見直す |
| `UPDATE` や `DELETE` で、全行が変わった | `WHERE` を書き忘れた | 先に `SELECT` で確認する。トランザクションの中で実行する |
| SQLite で、外部キー制約が効かない | 既定で無効になっている | 接続のたびに `PRAGMA foreign_keys = ON;` を実行する |
| SQLAlchemy で、`execute()` がエラーになる | 2.0 では、文字列を直接渡せない | `text()` で包む |
| SQLAlchemy で、`MySQLdb` が見つからない | `mysql://` は、mysqlclient を使う書き方 | `mysql+mysqlconnector://` にする。または、mysqlclient を入れる |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| `mysqldump` | MySQL のデータベースを、SQL 文として、エクスポートする |
| mysql2sqlite | MySQL のダンプを、SQLite 用の SQL に変換する |
| mysql-connector-python | Python から MySQL に接続する、公式のドライバー |
| SQLAlchemy | Python の、データベースのツールキット (接続と ORM) |
| PostgreSQL | MySQL、SQLite と並ぶ、代表的なデータベース (このドキュメントでは扱わない) |
