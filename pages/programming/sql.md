---
title: SQL
layout: default
---

# SQL <a id="top" data-name="TOP"></a>

SQL は、データベースを操作するための言語。データの検索、追加、更新、削除と、テーブルの定義を、同じ書き方で行える。

SQL の文は、役割によって、次のように分けられる。このドキュメントでは、標準 SQL を基準に説明し、MySQL と SQLite は、標準と違いのある部分を中心に補足する。

| 分類 | 内容 | 主な文 |
| --- | --- | --- |
| DQL (データ問い合わせ) | データを検索する | `SELECT` |
| DML (データ操作) | データを追加、更新、削除する | `INSERT`、`UPDATE`、`DELETE` |
| DDL (データ定義) | テーブルなどの構造を定義する | `CREATE`、`ALTER`、`DROP` |
| TCL (トランザクション制御) | 処理のまとまりを確定、取り消しする | `START TRANSACTION`、`COMMIT`、`ROLLBACK` |

<pre><code class="caution">SQL は標準化されている (ISO/IEC 9075) が、データベースごとに、対応している範囲や、独自の関数、構文が異なる。
このドキュメントの例は、特に断りがない限り、標準 SQL の書き方にしている。MySQL や SQLite では、そのままでは動かない書き方もあるため、違いは、各所の補足と、下の表で確認する。</code></pre>

---

## 標準 SQL と主な DBMS の違い <a id="dialects" data-name="標準SQLとの違い"></a>

標準 SQL に沿った書き方と、MySQL、SQLite の書き方の、主な違いをまとめる。詳しくは、各項目で説明する。

| 項目 | 標準 SQL | MySQL | SQLite |
| --- | --- | --- | --- |
| 件数の制限 | `FETCH FIRST n ROWS ONLY` | `LIMIT n` | `LIMIT n` |
| 連番の列 | `GENERATED ALWAYS AS IDENTITY` | `AUTO_INCREMENT` | `INTEGER PRIMARY KEY` |
| 文字列の連結 | <code>&#124;&#124;</code> | `CONCAT()` | <code>&#124;&#124;</code> |
| 文字数 | `CHAR_LENGTH()` | `CHAR_LENGTH()` | `LENGTH()` |
| 現在の日時 | `CURRENT_TIMESTAMP` | `NOW()` (`CURRENT_TIMESTAMP` も可) | `CURRENT_TIMESTAMP` (`datetime('now')` も可) |
| 年の取り出し | `EXTRACT(YEAR FROM d)` | `EXTRACT(YEAR FROM d)`、`YEAR(d)` | `strftime('%Y', d)` |
| `FULL JOIN` | 対応 | 非対応 | 3.39.0 以降は対応 |
| 識別子の引用符 | `"名前"` (二重引用符) | `` `名前` `` (バッククォート) | `"名前"` (バッククォートも可) |
| 型の扱い | 宣言した型に従う | 宣言した型に従う | 型親和性 (宣言と違う型も保存できる) |

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
| 7 | `OFFSET` / `FETCH FIRST` (多くの DBMS では `LIMIT`) |

#### 実行順

| 順 | 句 | 内容 |
| --- | --- | --- |
| 1 | `FROM` | どのテーブルを使うかを決定。`JOIN` もここで処理される |
| 2 | `WHERE` | 行を絞り込む (グループ化前のフィルタ) |
| 3 | `GROUP BY` | 指定した列でグループ化 |
| 4 | `HAVING` | グループ化後の条件 (集計結果に対して絞り込む) |
| 5 | `SELECT` | どの列、計算結果を取り出すかを決定 |
| 6 | `ORDER BY` | 並び替えを行う |
| 7 | `OFFSET` / `FETCH FIRST` | 取得する件数を制限 (多くの DBMS では `LIMIT`) |

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

<pre><code class="caution">FROM の中のサブクエリ (派生テーブル) には、標準 SQL では、必ずエイリアスが必要になる。付けないと、MySQL などではエラーになる。</code></pre>

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

標準 SQL の、日付と時刻に関する書き方。

| 書き方 | 説明 |
| --- | --- |
| `CURRENT_TIMESTAMP` | 現在の日時を取得 (括弧を付けない) |
| `CURRENT_DATE` | 現在の日付を取得 |
| `CURRENT_TIME` | 現在の時刻を取得 |
| `EXTRACT(YEAR FROM date)` | date から年を抽出。`YEAR` の代わりに、`MONTH`、`DAY`、`HOUR`、`MINUTE`、`SECOND` も指定できる |
| `date + INTERVAL '10' DAY` | date に期間を加える。引くときは `-` を使う |
| `CAST(文字列 AS DATE)` | 文字列を日付に変換する |

<pre><code class="example">SELECT EXTRACT(YEAR FROM rental_date) AS rental_year
FROM rental;</code></pre>

<pre><code class="caution">日数の差を求める方法や、日付を書式付きの文字列にする方法は、DBMS ごとの関数に頼ることになる (標準 SQL には、書式変換の関数がない)。
SQLite には、EXTRACT がなく、INTERVAL も使えない。</code></pre>

**MySQL と SQLite の関数**

| 内容 | MySQL | SQLite |
| --- | --- | --- |
| 現在の日時 | `NOW()` | `datetime('now')` (UTC) |
| 現在の日付 | `CURDATE()` | `date('now')` |
| 現在の時刻 | `CURTIME()` | `time('now')` |
| 年、月、日 | `YEAR(d)`、`MONTH(d)`、`DAY(d)` | `strftime('%Y', d)`、`strftime('%m', d)`、`strftime('%d', d)` |
| 日数の差 | `DATEDIFF(d1, d2)` | `julianday(d1) - julianday(d2)` |
| 書式変換 | `DATE_FORMAT(d, 書式)` | `strftime(書式, d)` |
| 期間を加える | `DATE_ADD(d, INTERVAL 10 DAY)` | `date(d, '+10 days')` |

MySQL の `DATE_ADD` の INTERVAL には、`YEAR`、`MONTH`、`DAY`、`HOUR`、`MINUTE`、`SECOND` がある。

**MySQL の `DATE_FORMAT` の書式**

次の指定子を使う。

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

<pre><code class="tips">SQLite の strftime の指定子は、MySQL と一部違う (分は %M、秒は %S)。</code></pre>

#### 数値関数

| 関数 | 説明 |
| --- | --- |
| `ROUND(x)` | x を四捨五入する |
| `ROUND(x, n)` | x を四捨五入して、n で表示する小数点以下の桁数を指定 |
| `CEIL(x)` または `CEILING(x)` | x を切り上げる |
| `FLOOR(x)` | x を切り捨てる |
| `ABS(x)` | x の絶対値 |
| `MOD(x, y)` | x を y で割った余り |
| `POWER(x, y)` | x の y 乗 |
| `SQRT(x)` | x の平方根 |

<pre><code class="caution">ROUND() は、標準 SQL の定義にはないが、ほとんどの DBMS で使える。
SQLite では、CEIL や FLOOR、MOD などの数学関数が、ビルドの設定によっては、使えないことがある。</code></pre>

#### 文字列操作関数

| 関数 | 説明 |
| --- | --- |
| <code>a &#124;&#124; b</code> | 文字列を結合 |
| `UPPER(str)` | 小文字を大文字に変換 |
| `LOWER(str)` | 大文字を小文字に変換 |
| `SUBSTRING(str FROM start FOR len)` | str の start から len 文字取り出す (1オリジン) |
| `SUBSTRING(str FROM start)` | start から後ろを取り出す (1オリジン) |
| `CHAR_LENGTH(str)` | 文字数 |
| `OCTET_LENGTH(str)` | バイト数 |
| `TRIM(str)` | 前後の空白を取り除く |
| `POSITION(部分文字列 IN str)` | 部分文字列の位置 (1オリジン)。見つからなければ 0 |

<pre><code class="caution">LENGTH() は、標準 SQL にない関数で、DBMS によって結果が違う。MySQL の LENGTH() は、文字数ではなく、バイト数を返す (UTF-8 の日本語は、1文字が3バイト)。SQLite の LENGTH() は、文字列に対して、文字数を返す。
MySQL では、文字列の連結に、CONCAT(a, b) を使う (標準の || は、MySQL では OR の意味になる)。
SQLite には、CHAR_LENGTH()、OCTET_LENGTH()、POSITION() がなく、SUBSTRING(str FROM start FOR len) の形も使えない。LENGTH()、instr(str, 部分文字列)、substr(str, start, len) を使う。</code></pre>

#### NULL を扱う関数

| 関数 | 説明 |
| --- | --- |
| `COALESCE(a, b, ...)` | 左から順に見て、最初の `NULL` でない値を返す |
| `NULLIF(a, b)` | a と b が等しければ `NULL`、違えば a を返す |

<pre><code class="example">-- NULL を、別の値に置き換えて表示
SELECT name, COALESCE(phone, '未登録') AS phone
FROM users;

-- 0 で割るエラーを避ける (NULLIF で、0 を NULL に変える)
SELECT total / NULLIF(item_count, 0) AS average
FROM stats;

-- NULL を 0 として、平均を求める
SELECT AVG(COALESCE(score, 0)) AS avg_score
FROM exams;</code></pre>

<pre><code class="tips">COALESCE は標準 SQL の関数で、MySQL と SQLite でも使える。IFNULL(a, b) は、MySQL と SQLite の独自の関数 (引数は2つだけ) なので、COALESCE を使う方が移植しやすい。
AVG(score) は NULL の行を除いて平均するが、AVG(COALESCE(score, 0)) は、NULL を 0 点として含めて平均する。どちらが目的に合うかを、考えて選ぶ。</code></pre>

#### 型の変換 (CAST)

```sql
CAST(式 AS データ型)
```

<pre><code class="example">-- 整数同士の割り算を、小数で行う
SELECT CAST(5 AS DECIMAL(10, 2)) / 2;
-- 2.50

-- 文字列を、日付に変換
SELECT CAST('2026-11-26' AS DATE);</code></pre>

<pre><code class="caution">MySQL の CAST では、整数への変換を SIGNED (または UNSIGNED)、文字列への変換を CHAR と書く (CAST(x AS INTEGER) や CAST(x AS VARCHAR) は使えない)。
SQLite は、型親和性により、CAST の結果の型が、標準 SQL とは違うことがある。</code></pre>

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

**EXISTS**

`EXISTS (サブクエリ)` は、サブクエリが1行でも返せば真になる。外側の行の値を使うサブクエリ (相関サブクエリ) と組み合わせて、「関連する行があるか」を調べるときに使う。

```sql
-- 注文のある社員だけ
SELECT e.name
FROM employees AS e
WHERE EXISTS (
    SELECT 1
    FROM orders AS o
    WHERE o.employee_id = e.id
);

-- 注文のない社員だけ
SELECT e.name
FROM employees AS e
WHERE NOT EXISTS (
    SELECT 1
    FROM orders AS o
    WHERE o.employee_id = e.id
);
```

<pre><code class="caution">NOT IN (サブクエリ) は、サブクエリの結果に NULL が1件でも含まれると、1行も返らなくなる (比較の結果が UNKNOWN になるため)。
「ないものを探す」ときは、NOT EXISTS を使うと、NULL の影響を受けない。</code></pre>

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

#### 集合演算

複数の `SELECT` の結果を、1つにまとめたり、比べたりする。

| 演算 | 内容 |
| --- | --- |
| `UNION` | 和集合。重複した行を取り除く |
| `UNION ALL` | 和集合。重複した行も残す (重複を調べない分、速い) |
| `INTERSECT` | 積集合。両方の結果にある行 |
| `EXCEPT` | 差集合。前の結果にあって、後ろの結果にない行 |

```sql
SELECT name FROM customers
UNION
SELECT name FROM suppliers
ORDER BY name;
```

<pre><code class="caution">それぞれの SELECT で、列の数と、対応する列の型を合わせる。列名は、最初の SELECT のものが使われる。
ORDER BY は、全体の最後に1回だけ書く。
MySQL は、INTERSECT と EXCEPT に 8.0.31 から対応した。それより前のバージョンでは、JOIN や NOT EXISTS で書き換える。</code></pre>

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
| `LEFT JOIN` (左外部結合。`LEFT OUTER JOIN` と同じ) | 左側のテーブルのデータはすべて取得し、一致するデータが右側になければ `NULL` が入る |
| `RIGHT JOIN` (右外部結合。`RIGHT OUTER JOIN` と同じ) | 右側のテーブルのデータはすべて取得し、一致するデータが左側になければ `NULL` が入る |
| `FULL JOIN` (完全外部結合。`FULL OUTER JOIN` と同じ) | 両方のテーブルのすべてのデータを取得し、一致しない部分には `NULL` が入る |
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
| `<>` | 等しくない (標準)。`!=` も、多くの DBMS で使える |
| `>` | 左辺は右辺より大きい |
| `>=` | 左辺は右辺以上 |
| `<` | 左辺は右辺より小さい |
| `<=` | 左辺は右辺以下 |

比較演算子は、数値と文字列に対して利用でき、比較結果として `TRUE`、`FALSE`、`UNKNOWN` (`NULL` が絡む比較) のいずれかを返す。<br>
MySQL と SQLite では、真偽値は実際には整数で、`TRUE`、`FALSE` は、それぞれ 1 と 0 になる。

#### 四則演算

| 演算子 | 意味 |
| --- | --- |
| `+` | 加算 |
| `-` | 減算 |
| `*` | 乗算 |
| `/` | 除算 |
| `MOD(x, y)` | 剰余 (標準) |
| `%` | 剰余 (多くの DBMS で使えるが、標準ではない) |
| `DIV` | 除算 (整数)。MySQL のみ |

<pre><code class="caution">整数同士の / の結果は、DBMS によって違う。5 / 2 は、MySQL では 2.5 になり、SQLite では 2 になる (標準 SQL では、処理系によって決まる)。小数の結果がほしいときは、CAST で型を変えるか、小数で書く。</code></pre>

#### 複数の条件で検索する

| 演算子 | 意味 |
| --- | --- |
| `AND` | いずれも真 |
| `OR` | いずれかが真 |
| `NOT` | 否定 |

<pre><code class="example">SELECT * 
FROM city
WHERE CountryCode = 'JPN'
AND Population &gt; 2000000;</code></pre>

CountryCode が 'JPN' かつ Population が 200万より大きい。

<pre><code class="caution">AND は OR より先に評価される。両方を混ぜるときは、丸括弧で、評価の順序を明示する。
&&、||、!、XOR は、MySQL の独自の書き方で、標準 SQL にはない。特に || は、MySQL では OR の意味になるが、標準 SQL と SQLite では、文字列の連結になる。AND、OR、NOT を使う方が安全である。</code></pre>

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

<pre><code class="caution">GROUP BY を使う際は、SELECT 句には GROUP BY に含まれる列か、集計関数しか書けない (標準 SQL の規則)。
MySQL 5.7 以降の既定では、この規則に違反すると、エラーになる (sql_mode の ONLY_FULL_GROUP_BY が有効なため)。SQLite は、違反してもエラーにならず、どの行の値が返るかが決まっていないので、注意する。</code></pre>

#### 複数列のグループ化

<pre><code class="example">SELECT EXTRACT(YEAR FROM order_date) AS order_year,
       EXTRACT(MONTH FROM order_date) AS order_month,
       SUM(amount) AS total
FROM sales
GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date);</code></pre>

〇年〇月ごとに合計を抽出。

<pre><code class="tips">SQLite には EXTRACT がないので、strftime('%Y', order_date) のように書く。MySQL では、YEAR(order_date) も使える。</code></pre>

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

<pre><code class="tips">標準 SQL では、NULL を先頭と末尾のどちらに並べるかは、DBMS によって決まる。MySQL と SQLite では、NULL は最小の値として扱われ、昇順では、先頭に並ぶ。
NULLS FIRST / NULLS LAST で指定できる DBMS もある (SQLite は 3.30.0 以降)。MySQL は対応していないので、ORDER BY 列名 IS NULL, 列名 のように書いて、NULL を末尾に回す。</code></pre>

---

### FETCH FIRST句とLIMIT句 <a id="limit" data-name="FETCH FIRST句・LIMIT句"></a>

取得する件数を制限する。標準 SQL (SQL:2008 以降) では、`OFFSET` と `FETCH FIRST` を使う。

```sql
-- 基本構文
OFFSET 開始位置 ROWS
FETCH FIRST 件数 ROWS ONLY;
```

| 書き方 | 内容 |
| --- | --- |
| `FETCH FIRST 5 ROWS ONLY` | 先頭から 5件を取得 |
| `OFFSET 10 ROWS FETCH FIRST 5 ROWS ONLY` | 先頭の 10件を飛ばして、5件を取得 |

<pre><code class="example">SELECT name, salary
FROM employees
ORDER BY salary DESC
FETCH FIRST 5 ROWS ONLY;</code></pre>

給料の高い順に、上位 5件を取得する。

**LIMIT句**

MySQL と SQLite (ほかに PostgreSQL など) では、標準ではない `LIMIT` で、同じことを書く。

```sql
LIMIT [開始位置,] 件数;
```

| 書き方 | 内容 |
| --- | --- |
| `LIMIT 5` | 先頭から 5件を取得 |
| `LIMIT 10, 5` | 開始位置 10 (0 から数える) から 5件を取得 |
| `LIMIT 5 OFFSET 10` | 上と同じ。件数と開始位置を、名前付きで書く |

<pre><code class="caution">MySQL と SQLite は、FETCH FIRST に対応していないので、LIMIT を使う。
OFFSET、FETCH FIRST、LIMIT は、ORDER BY とセットで使う。並び順を指定しないと、どの行が先頭になるかは、保証されない。</code></pre>

---

## テーブルの作成とデータの操作 <a id="table-data" data-name="テーブルとデータ操作"></a>

この章では、テーブルの定義 (DDL) と、テーブルの中のデータの操作 (DML)、そして、操作をひとまとまりにするトランザクションを扱う。次の順に進める。

| 順 | 内容 | 主な文 |
| --- | --- | --- |
| 1 | テーブルを作る | `CREATE TABLE` |
| 2 | 構造を変える、削除する | `ALTER TABLE`、`DROP TABLE` |
| 3 | データを入れる、変える、消す | `INSERT`、`UPDATE`、`DELETE` |
| 4 | 操作をひとまとまりにする | `START TRANSACTION`、`COMMIT`、`ROLLBACK` |
| 5 | 検索を速くする、検索に名前を付ける | `CREATE INDEX`、`CREATE VIEW` |

### テーブルの作成

#### 基本構文

```sql
CREATE TABLE テーブル名 (
    列名1 データ型 [列制約],
    列名2 データ型 [列制約],
    ...
    [テーブル制約]
);
```

```sql
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

<pre><code class="caution">標準の GENERATED ALWAYS AS IDENTITY は、MySQL と SQLite では使えない。MySQL では id INT AUTO_INCREMENT PRIMARY KEY、SQLite では id INTEGER PRIMARY KEY と書く。</code></pre>

| 制約 | 内容 |
| --- | --- |
| `PRIMARY KEY` | 行を一意に識別する列。重複と `NULL` を許さない |
| `NOT NULL` | `NULL` を許さない |
| `UNIQUE` | 値の重複を許さない |
| `DEFAULT` | 値を省略したときの、既定値 |
| `GENERATED ALWAYS AS IDENTITY` | 値を省略すると、連番を自動で入れる (標準)。MySQL では `AUTO_INCREMENT`、SQLite では `INTEGER PRIMARY KEY` |
| `CHECK` | 値が満たすべき条件を指定する |
| `FOREIGN KEY` | 別のテーブルの列を参照する (<a href="#foreign-key">外部キー制約</a>) |

#### 列制約とテーブル制約

制約の書き方は、2つある。

| 書き方 | 内容 |
| --- | --- |
| 列制約 | 列の定義の後ろに書く。その列だけに対する制約 |
| テーブル制約 | 列の定義とは別に、1行として書く。複数の列にまたがる制約は、こちらでしか書けない |

`CONSTRAINT 名前` を付けると、制約に名前を付けられる。

<pre><code class="example">CREATE TABLE categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_products PRIMARY KEY (id),
    CONSTRAINT ck_products_price CHECK (price &gt;= 0),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id)
);</code></pre>

外部キーで参照される側の `categories` を、先に作る。名前を付けておくと、制約に違反したときのエラーで、どの制約かがわかり、`ALTER TABLE` で削除するときにも指定できる。

#### 複合主キー

複数の列の組み合わせで、行を一意に識別するときは、テーブル制約で書く。

<pre><code class="example">CREATE TABLE order_items (
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity &gt; 0),
    PRIMARY KEY (order_id, product_id)
);</code></pre>

同じ `order_id` と `product_id` の組み合わせは、2回入れられない。

#### NULL と DEFAULT

`NULL` は、値がない (または、不明) ことを表す特別な値で、0 や空文字とは違う。

- `NOT NULL` を付けない列は、`NULL` を入れられる。
- `INSERT` で列を省略すると、`DEFAULT` があればその値が、なければ `NULL` が入る。`NOT NULL` で `DEFAULT` もない列を省略すると、エラーになる。
- `DEFAULT` には、固定の値のほか、`CURRENT_TIMESTAMP` のような、日時の関数も指定できる。
- `UNIQUE` を付けた列には、`NULL` を複数入れられる DBMS が多い (`NULL` 同士は、等しいとは見なされないため)。

#### IF NOT EXISTS

```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
```

テーブルがすでにあれば、作成せず、エラーにもしない。

<pre><code class="caution">IF NOT EXISTS は、標準 SQL にはないが、MySQL、SQLite、PostgreSQL などで使える。すでにあるテーブルの定義が、書いた内容と違っていても、何も起きない (定義は更新されない)。</code></pre>

#### テーブルの確認

標準 SQL では、`information_schema` というビューで、テーブルや列の情報を調べられる。

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products';
```

| DBMS | テーブルの一覧 | 列の定義 |
| --- | --- | --- |
| 標準 SQL | `SELECT table_name FROM information_schema.tables;` | `information_schema.columns` |
| MySQL | `SHOW TABLES;` | `DESCRIBE テーブル名;` |
| SQLite | `.tables` | `.schema テーブル名` |

<pre><code class="tips">MySQL の information_schema には、すべてのデータベースの情報が入っている。table_schema でデータベース名も絞り込む。SQLite には、information_schema がなく、.tables や .schema は、メタコマンド (SQL ではない) である。</code></pre>

### 主なデータ型

#### 数値

| 型 | 内容 |
| --- | --- |
| `SMALLINT` / `INTEGER` / `BIGINT` | 整数 (扱える範囲が、小さい順)。`INTEGER` は `INT` とも書ける |
| `DECIMAL(p, s)` / `NUMERIC(p, s)` | 固定小数点。全体で p 桁、そのうち小数部が s 桁。金額など、誤差を出したくない値 |
| `REAL` / `DOUBLE PRECISION` | 浮動小数点。扱える範囲は広いが、誤差が出る |

`DECIMAL(10, 2)` なら、整数部が 8桁、小数部が 2桁で、99999999.99 まで入る。

<pre><code class="caution">金額に、REAL や DOUBLE PRECISION を使わない。浮動小数点は、0.1 + 0.2 が 0.3 にならないような、誤差を含む。金額には、DECIMAL を使う。</code></pre>

#### 文字列

| 型 | 内容 |
| --- | --- |
| `CHAR(n)` | n 文字の固定長。短い値は、空白で埋められる |
| `VARCHAR(n)` | 最大 n 文字の可変長 |
| `CLOB` | 非常に長い文字列。MySQL と SQLite では `TEXT` と書く |

<pre><code class="tips">郵便番号のように、長さが決まっている値は CHAR、名前やメールアドレスのように、長さが変わる値は VARCHAR が向いている。</code></pre>

#### 日付と時刻

| 型 | 内容 |
| --- | --- |
| `DATE` | 日付 (例: `'2026-11-26'`) |
| `TIME` | 時刻 (例: `'09:30:00'`) |
| `TIMESTAMP` | 日付と時刻 (例: `'2026-11-26 09:30:00'`) |
| `INTERVAL` | 期間。MySQL と SQLite には、この型がない |

値は、`'年-月-日'` の形 (ISO 8601 の形式) の文字列で書く。

#### その他

| 型 | 内容 |
| --- | --- |
| `BOOLEAN` | 真偽値 (`TRUE`、`FALSE`、`UNKNOWN`) |
| `BLOB` | 画像などの、バイナリデータ |

<pre><code class="tips">TEXT (長い文字列) と DATETIME は、標準 SQL にない型だが、MySQL と SQLite で使える。</code></pre>

<pre><code class="tips">SQLite は、型の指定が緩く、列に宣言した型と違う型の値も、そのまま保存できる (型親和性)。VARCHAR(n) の n も、強制されない。MySQL と同じ感覚で、型の違反が、エラーになると期待しない。</code></pre>

### テーブルの変更と削除

#### ALTER TABLE

作成済みのテーブルの構造を、変更する。

| 操作 | 標準 SQL の書き方 | MySQL、SQLite の違い |
| --- | --- | --- |
| 列の追加 | `ALTER TABLE t ADD COLUMN 列 型;` | 同じ |
| 列の削除 | `ALTER TABLE t DROP COLUMN 列;` | SQLite は 3.35.0 以降 |
| 既定値の設定 | `ALTER TABLE t ALTER COLUMN 列 SET DEFAULT 値;` | SQLite は非対応 |
| 型の変更 | `ALTER TABLE t ALTER COLUMN 列 SET DATA TYPE 型;` | MySQL は `MODIFY COLUMN 列 型`。SQLite は非対応 |
| 制約の追加 | `ALTER TABLE t ADD CONSTRAINT 名前 制約;` | SQLite は非対応 |
| 制約の削除 | `ALTER TABLE t DROP CONSTRAINT 名前;` | MySQL は 8.0.19 以降で対応。それ以前の外部キーは `DROP FOREIGN KEY` (<a href="#foreign-key">外部キー制約</a>)。SQLite は非対応 |
| 列名の変更 | `ALTER TABLE t RENAME COLUMN 旧 TO 新;` | 標準の文ではないが、多くの DBMS で使える。MySQL は 8.0 以降、SQLite は 3.25.0 以降 |
| テーブル名の変更 | `ALTER TABLE t RENAME TO 新;` | 標準の文ではないが、多くの DBMS で使える |

<pre><code class="example">-- 列の追加
ALTER TABLE products ADD COLUMN description VARCHAR(255);

-- 既定値の設定
ALTER TABLE products ALTER COLUMN stock SET DEFAULT 1;

-- 列の削除
ALTER TABLE products DROP COLUMN description;</code></pre>

<pre><code class="caution">データの入っているテーブルに、NOT NULL の列を追加するときは、既存の行に入れる値が必要になるので、DEFAULT も指定する。
列の削除は、その列のデータごと消えて、元に戻せない。実行する前に、バックアップを取る。</code></pre>

<pre><code class="tips">SQLite は、ALTER TABLE でできることが少ない。型や制約を変えたいときは、新しい定義でテーブルを作り直して、データを INSERT ... SELECT で移し、元のテーブルを DROP して、名前を変更する。</code></pre>

#### DROP TABLE

テーブルを、データごと削除する。

```sql
DROP TABLE products;

-- なくてもエラーにしない
DROP TABLE IF EXISTS products;
```

<pre><code class="caution">DROP TABLE は、元に戻せない。外部キーで参照されているテーブルは、削除できない (先に、参照している子テーブルを削除する)。
IF EXISTS は、IF NOT EXISTS と同じく、標準 SQL にはないが、MySQL、SQLite、PostgreSQL などで使える。</code></pre>

### データの挿入 (INSERT)

#### 基本構文

```sql
INSERT INTO テーブル名 (列名1, 列名2, ...) VALUES (値1, 値2, ...);
```

<pre><code class="example">INSERT INTO categories (name) VALUES ('Book');

INSERT INTO products (name, price, stock, category_id)
VALUES ('SQL入門', 2800.00, 10, 1);</code></pre>

列名の並びと、値の並びは、順番と数を合わせる。書かなかった列には、`DEFAULT` の値 (なければ `NULL`) が入る。

<pre><code class="caution">列名のリストを省略した INSERT INTO products VALUES (...) は、全列の値を、テーブルの定義順に書く必要がある。後から列を追加すると、壊れる。列名は、必ず書く。</code></pre>

<pre><code class="tips">GENERATED ALWAYS AS IDENTITY の列には、INSERT で値を指定できない (標準 SQL では、OVERRIDING SYSTEM VALUE を付ければ指定できる)。値を指定したいときは、GENERATED BY DEFAULT AS IDENTITY で定義する。
すべての列を既定値にするときは、INSERT INTO テーブル名 DEFAULT VALUES; と書ける。MySQL は非対応で、INSERT INTO テーブル名 () VALUES (); と書く。</code></pre>

#### 値の書き方

| 値 | 書き方 |
| --- | --- |
| 数値 | そのまま書く (例: `2800`、`19.5`) |
| 文字列 | 単引用符 `'` で囲む。文字列の中の単引用符は、2つ重ねる (例: `'O''Brien'`) |
| 日付、日時 | 文字列の形で書く (例: `'2026-11-26'`) |
| `NULL` | 引用符を付けずに、`NULL` と書く |

<pre><code class="caution">標準 SQL では、二重引用符 " で囲んだものは、文字列ではなく、列名やテーブル名 (識別子) になる。文字列は、必ず単引用符で囲む。MySQL は、既定では、二重引用符でも文字列として扱うが、移植性がなくなる。</code></pre>

#### 複数行をまとめて挿入

`VALUES` に、丸括弧のリストを、カンマで区切って並べる。

<pre><code class="example">INSERT INTO products (name, price, stock, category_id)
VALUES
    ('データベース設計', 3200.00, 5, 1),
    ('ネットワーク入門', 2600.00, 8, 1),
    ('USBケーブル', 800.00, 50, NULL);</code></pre>

1文でまとめて挿入する方が、1行ずつ挿入するより、速いことが多い。

#### SELECT の結果を挿入

`VALUES` の代わりに、`SELECT` を書くと、検索した結果を、そのまま挿入できる。

<pre><code class="example">-- 同じ構造の discontinued_products テーブルが、すでにある場合
INSERT INTO discontinued_products (name, price)
SELECT name, price
FROM products
WHERE stock = 0;</code></pre>

### データの更新 (UPDATE)

#### 基本構文

```sql
UPDATE テーブル名
SET 列名1 = 値1, 列名2 = 値2
WHERE 条件;
```

<pre><code class="example">-- 複数の列を、同時に更新
UPDATE users SET name = 'Alice Smith', email = 'alice.smith@example.com' WHERE id = 1;

-- 現在の値を使った計算
UPDATE products SET stock = stock - 1 WHERE id = 10;

-- 条件に、サブクエリを使う
UPDATE products
SET price = price * 0.9
WHERE category_id IN (SELECT id FROM categories WHERE name = 'Book');</code></pre>

`SET` の右辺には、定数のほか、その行の現在の値を使った式も書ける。

#### 別のテーブルの値で更新

標準 SQL では、`SET` の右辺に、サブクエリを書く。

<pre><code class="example">-- 価格の更新表 price_updates (product_id, new_price) の値で、価格を更新
UPDATE products
SET price = (
    SELECT new_price
    FROM price_updates
    WHERE price_updates.product_id = products.id
)
WHERE id IN (SELECT product_id FROM price_updates);</code></pre>

<pre><code class="caution">この例の WHERE がないと、更新表にない商品の price が、NULL になってしまう。
UPDATE ... JOIN (MySQL) や UPDATE ... FROM (PostgreSQL、SQLite) の書き方は、標準 SQL にはない。</code></pre>

<pre><code class="caution">UPDATE で WHERE を書き忘れると、全行が対象になる。実行する前に、同じ WHERE で SELECT して、対象の行を確認する。</code></pre>

### データの削除 (DELETE)

#### 基本構文

```sql
DELETE FROM テーブル名
WHERE 条件;
```

<pre><code class="example">-- 1行を削除
DELETE FROM users WHERE id = 1;

-- 条件に合う行を、まとめて削除
DELETE FROM products WHERE stock = 0 AND created_at &lt; '2025-01-01';</code></pre>

<pre><code class="caution">DELETE で WHERE を書き忘れると、全行が削除される。UPDATE と同じく、先に SELECT で確認する。
他のテーブルの外部キーから参照されている行は、そのままでは削除できない (<a href="#foreign-key">外部キー制約</a>)。</code></pre>

#### DELETE、TRUNCATE、DROP の違い

データを消す方法は、3つある。

| 文 | 消すもの | WHERE | 取り消し |
| --- | --- | --- | --- |
| `DELETE FROM t` | 行 (条件で選べる) | 使える | トランザクションの中なら、`ROLLBACK` で戻せる |
| `TRUNCATE TABLE t` | 全行 | 使えない | DBMS による。MySQL では、暗黙的に確定されるため、戻せない |
| `DROP TABLE t` | テーブルごと (定義も消える) | なし | DBMS による。MySQL では、戻せない |

<pre><code class="tips">TRUNCATE は、全行を、まとめて高速に消せる。連番の列の扱いも、DBMS によって違う。SQLite には、TRUNCATE がないので、DELETE FROM テーブル名 を使う。</code></pre>

### トランザクション

複数の操作を、ひとまとまりとして扱う仕組み。まとまりの中の操作は、すべて成功するか、すべて取り消されるかのどちらかになる。

```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;

COMMIT;
```

口座 1 から 1000 を引き、口座 2 に 1000 を足す。途中で失敗したときに、片方だけが反映された状態を残さないために、トランザクションにする。

| 文 | 内容 |
| --- | --- |
| `START TRANSACTION` | トランザクションを開始する。SQLite では `BEGIN` を使う (MySQL でも `BEGIN` が使える) |
| `COMMIT` | これまでの操作を確定する |
| `ROLLBACK` | これまでの操作を取り消して、開始前に戻す |

トランザクションが満たすべき性質は、頭文字をとって **ACID** と呼ばれる。

| 性質 | 内容 |
| --- | --- |
| 原子性 (Atomicity) | まとまりの中の操作は、すべて成功するか、すべて取り消される |
| 一貫性 (Consistency) | 制約を満たす状態から、制約を満たす状態へ移る |
| 独立性 (Isolation) | 同時に実行しても、互いの途中経過が見えない (どこまで隠すかは、分離レベルで決まる) |
| 永続性 (Durability) | 確定した結果は、障害が起きても失われない |

<pre><code class="tips">まとめて変更するときは、トランザクションを開始して、UPDATE や DELETE を実行し、対象の件数や内容を確認してから、COMMIT する。想定と違っていたら、ROLLBACK する。</code></pre>

<pre><code class="caution">多くの DBMS では、トランザクションを開始しないと、1文ごとに自動で確定される (自動コミット)。
MySQL では、CREATE、ALTER、DROP、TRUNCATE などのテーブル定義の文が、暗黙的に COMMIT されるため、トランザクションの途中で実行すると、それまでの操作も確定される。</code></pre>

### 存在すれば更新、なければ挿入 (UPSERT)

主キーなどが重複したときに、エラーにせず、更新に切り替える書き方。標準 SQL では `MERGE` だが、MySQL と SQLite は、それぞれ独自の構文を持つ。

| DBMS | 書き方 |
| --- | --- |
| 標準 SQL | `MERGE INTO ... USING ... ON ... WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ...` |
| MySQL | `INSERT ... ON DUPLICATE KEY UPDATE ...` (`MERGE` は非対応) |
| SQLite | `INSERT ... ON CONFLICT (列) DO UPDATE SET ...` (3.24.0 以降。`MERGE` は非対応) |

<pre><code class="tips">UPSERT の書き方は、DBMS ごとの違いが大きい。MERGE の細かい仕様も、DBMS によって異なるので、使う DBMS のドキュメントで確認する。</code></pre>

`users` の `email` に `UNIQUE` が付いているとき、同じ `email` があれば `name` を更新し、なければ挿入する例。

**標準 SQL (MERGE)**

```sql
MERGE INTO users AS u
USING (VALUES ('alice@example.com', 'Alice')) AS s (email, name)
    ON u.email = s.email
WHEN MATCHED THEN
    UPDATE SET name = s.name
WHEN NOT MATCHED THEN
    INSERT (email, name) VALUES (s.email, s.name);
```

**MySQL**

```sql
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice') AS new
ON DUPLICATE KEY UPDATE name = new.name;
```

**SQLite**

```sql
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice')
ON CONFLICT (email) DO UPDATE SET name = excluded.name;

-- 重複したときは、何もしない
INSERT INTO users (email, name)
VALUES ('alice@example.com', 'Alice')
ON CONFLICT (email) DO NOTHING;
```

<pre><code class="tips">MySQL の VALUES AS new の形 (行のエイリアス) は、8.0.19 以降で使える。古い書き方の name = VALUES(name) は、8.0.20 以降では、非推奨になっている。</code></pre>

### インデックス (索引)

検索を速くするための、別の構造。本の索引のように、値から行の場所を、すぐに見つけられる。

```sql
-- 作成
CREATE INDEX idx_products_category ON products (category_id);

-- 重複を許さないインデックス
CREATE UNIQUE INDEX uq_users_email ON users (email);

-- 削除
DROP INDEX idx_products_category;
```

<pre><code class="caution">CREATE INDEX は標準 SQL にはないが、ほとんどの DBMS で同じ書き方ができる。
MySQL の DROP INDEX は、テーブル名も必要になる (DROP INDEX idx_products_category ON products;)。</code></pre>

- `PRIMARY KEY` と `UNIQUE` を付けた列には、インデックスが自動で作られる。MySQL (InnoDB) では、外部キーの列にも作られる。
- `WHERE`、`JOIN`、`ORDER BY` でよく使う列に作ると、効果が出やすい。
- インデックスは、`INSERT`、`UPDATE`、`DELETE` のたびに更新されるため、作りすぎると、書き込みが遅くなり、容量も増える。
- 複数の列のインデックス (`(a, b)`) は、先頭の列 (`a`) から順に使われる。`b` だけの条件では、効きにくい。

<pre><code class="tips">インデックスが使われているかは、MySQL では EXPLAIN SELECT ...、SQLite では EXPLAIN QUERY PLAN SELECT ... で確認できる。</code></pre>

### ビュー

保存した `SELECT` に、名前を付けたもの。テーブルのように `SELECT` できるが、データそのものは持たず、参照するたびに、元の `SELECT` が実行される。

```sql
CREATE VIEW in_stock_products AS
SELECT id, name, price
FROM products
WHERE stock > 0;

SELECT * FROM in_stock_products;

DROP VIEW in_stock_products;
```

複雑な `JOIN` を使い回したいときや、見せたくない列を隠したいときに使う。

<pre><code class="caution">CREATE OR REPLACE VIEW は、標準 SQL にはない (MySQL は対応、SQLite は非対応)。SQLite では、DROP VIEW してから、作り直す。
ビューの元になっているテーブルや列を変更、削除すると、ビューが使えなくなることがある。</code></pre>

---

## 外部キー制約 <a id="foreign-key" data-name="外部キー制約"></a>

外部キー制約は、あるテーブルの列が、別のテーブルの列の値だけを持つように、制限する仕組み。参照される側を親テーブル、参照する側を子テーブルと呼ぶ。

<pre><code class="caution">MySQL で外部キー制約を使うには、InnoDB のテーブルにする必要がある。MyISAM では、書いても無視される。
SQLite では、外部キー制約が、既定で無効になっている (SQLite の章を参照)。</code></pre>

### 外部キー制約の設定

**テーブルの作成時に外部キーを設定する**

<pre><code class="example">CREATE TABLE parent_table (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE child_table (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parent_id INTEGER,
    description VARCHAR(100),
    FOREIGN KEY (parent_id) REFERENCES parent_table(id)
);</code></pre>

子テーブルの `parent_id` が、親テーブルの `id` に関連付けられる。

**既存のテーブルに外部キーを追加する**

<pre><code class="example">ALTER TABLE child_table
ADD CONSTRAINT fk_parent
FOREIGN KEY (parent_id) REFERENCES parent_table(id);</code></pre>

<pre><code class="caution">SQLite は、ALTER TABLE で、外部キー制約を追加できない。テーブルを作成するときに、書いておく。</code></pre>

`fk_parent` は、外部キー制約の名前 (任意)。省略すると、自動で名前が付けられる。<br>
名前を付けることにより、次の利点がある。

- エラーが発生したときに、「`fk_parent` が違反しています」という形で、どの外部キー制約で問題が発生しているかを特定できる。
- `ALTER TABLE` や `DROP` で外部キー制約を削除する際に、自動で付けられた名前を調べる必要がない。

<pre><code class="example">ALTER TABLE child_table DROP CONSTRAINT fk_parent;</code></pre>

複数の外部キーがある場合に、管理しやすくなる。

<pre><code class="tips">MySQL では、8.0.19 以降なら、標準の DROP CONSTRAINT fk_parent で、外部キー制約も削除できる (制約の種類は、名前から判断される)。それより前のバージョンでは、DROP FOREIGN KEY fk_parent と書く。
SQLite は、ALTER TABLE で、制約を削除できない。</code></pre>

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
| `ON DELETE SET DEFAULT` | 親テーブルの行が削除されると、子テーブルの外部キーが、列の既定値 (`DEFAULT`) になる。MySQL (InnoDB) は対応していない |
| `RESTRICT` | 子テーブルに参照する行があるとき、親テーブルの削除や更新を拒否する |
| `NO ACTION` | 何も指定しないときの既定。制約に違反する削除や更新を拒否する。`RESTRICT` との違いは、検査のタイミング (標準 SQL では、`NO ACTION` は文の終わりに検査する)。MySQL (InnoDB) では、同じ動作になる |

```sql
CREATE TABLE child_table (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parent_id INTEGER,
    description VARCHAR(100),
    FOREIGN KEY (parent_id) REFERENCES parent_table(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
```

<pre><code class="caution">ON DELETE CASCADE は、親の行を消すだけで、子の行も連鎖して消える。意図しない削除を避けるため、削除してよい関係にだけ使う。</code></pre>

### 中間テーブルを使った多対多の設定

<pre><code class="caution">GROUPS は、標準 SQL でも、MySQL 8.0.2 以降でも、予約語である。groups という名前のテーブルは、そのままでは、構文エラーになる。
以下の例では、user_groups という名前にしている。どうしても予約語を使うときは、引用符で囲む (標準 SQL は二重引用符、MySQL はバッククォート)。</code></pre>

**ユーザーとグループのテーブルの作成**

<pre><code class="example">CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE user_groups (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);</code></pre>

**中間テーブルの作成**

<pre><code class="example">CREATE TABLE user_group_members (
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES user_groups(id) ON DELETE CASCADE
);</code></pre>

### 中間テーブルへのデータの挿入

<pre><code class="example">-- ユーザーを挿入
INSERT INTO users (name) VALUES ('Alice');
INSERT INTO users (name) VALUES ('Bob');
-- グループを挿入
INSERT INTO user_groups (name) VALUES ('Admins');
INSERT INTO user_groups (name) VALUES ('Editors');
-- ユーザーとグループの関係を挿入
INSERT INTO user_group_members (user_id, group_id) VALUES (1, 1); -- Alice -&gt; Admins
INSERT INTO user_group_members (user_id, group_id) VALUES (1, 2); -- Alice -&gt; Editors
INSERT INTO user_group_members (user_id, group_id) VALUES (2, 2); -- Bob -&gt; Editors</code></pre>

### 中間テーブルからのデータの取得

**特定ユーザーが属するグループを取得**

<pre><code class="example">SELECT
    users.name AS user_name,
    user_groups.name AS group_name
FROM
    user_group_members
JOIN
    users ON user_group_members.user_id = users.id
JOIN
    user_groups ON user_group_members.group_id = user_groups.id
WHERE
    users.name = 'Alice';</code></pre>

**特定グループに属するユーザーを取得**

<pre><code class="example">SELECT
    user_groups.name AS group_name,
    users.name AS user_name
FROM
    user_group_members
JOIN
    user_groups ON user_group_members.group_id = user_groups.id
JOIN
    users ON user_group_members.user_id = users.id
WHERE
    user_groups.name = 'Editors';</code></pre>

**全てのユーザーとその所属グループを取得**

<pre><code class="example">SELECT users.name AS user_name, user_groups.name AS group_name
FROM
    user_group_members
JOIN
    users ON user_group_members.user_id = users.id
JOIN
    user_groups ON user_group_members.group_id = user_groups.id;</code></pre>

**中間テーブルに追加情報を保存**

上の `user_group_members` の代わりに、次の定義で作成する。

<pre><code class="example">CREATE TABLE user_group_members (
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES user_groups(id) ON DELETE CASCADE
);</code></pre>

---

## データのエクスポート・インポート <a id="export-inport" data-name="エクスポート・インポート"></a>

データを出力したり、取り込んだりする方法は、標準 SQL では決められておらず、DBMS ごとのツールを使う。

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

<pre><code class="tips">InnoDB のテーブルを、書き込みを止めずにバックアップするときは、mysqldump に --single-transaction を付ける。トランザクションを開始した時点の、一貫した状態をダンプできる。
一貫性が保たれるのは InnoDB のテーブルだけで、MyISAM などには効かない。ダンプ中に、他の接続から ALTER TABLE や DROP TABLE、TRUNCATE TABLE を実行すると、正しいダンプにならないことがある。</code></pre>

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

### 基本の操作 <a id="mysql-basics" data-name="基本の操作"></a>

#### 接続

```bash
# 管理者として接続 (Ubuntu では、sudo で接続できる)
sudo mysql

# ユーザーを指定して、データベースを選んで接続
mysql -u [ユーザー名] -p [データベース名]
```

#### データベースとユーザーの作成

```sql
CREATE DATABASE mydb CHARACTER SET utf8mb4;

CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'パスワード';
GRANT ALL PRIVILEGES ON mydb.* TO 'appuser'@'localhost';
```

#### よく使う命令

| 命令 | 内容 |
| --- | --- |
| `SHOW DATABASES;` | データベースの一覧を表示する |
| `USE データベース名;` | 操作するデータベースを選ぶ |
| `SHOW TABLES;` | テーブルの一覧を表示する |
| `DESCRIBE テーブル名;` | 列の定義を表示する |
| `SHOW CREATE TABLE テーブル名;` | テーブルを作る `CREATE TABLE` 文を表示する |
| `exit` | 終了する |

<pre><code class="tips">MySQL の CREATE DATABASE は、標準 SQL の CREATE SCHEMA にあたる。MySQL では、データベースとスキーマは、同じ意味で使われる。
アプリケーションには、管理者ではなく、必要な権限だけを与えた、専用のユーザーを使う。</code></pre>

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
sudo apt install sqlite3
```

```bash
# バージョンの確認
sqlite3 --version

# example.db を開く (ファイルがなければ、新規作成される)
sqlite3 example.db
```

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
| `You have an error in your SQL syntax ... near 'groups'` | `groups` が、予約語 (標準 SQL と、MySQL 8.0.2 以降) | 別の名前にする。または、引用符で囲む (標準は二重引用符、MySQL はバッククォート) |
| `Cannot add or update a child row: a foreign key constraint fails` | 親テーブルに、参照先の行がない | 親テーブルに、先にデータを挿入する |
| `Cannot delete or update a parent row: a foreign key constraint fails` | 子テーブルに、その行を参照する行がある | 子テーブルの行を先に削除する。または、`ON DELETE` を指定する |
| `LENGTH()` が、日本語で文字数と合わない | MySQL の `LENGTH()` は、バイト数を返す | `CHAR_LENGTH()` を使う |
| `FULL JOIN` で構文エラーになる | MySQL は `FULL JOIN` に対応していない | `LEFT JOIN` と `RIGHT JOIN` を `UNION` でつなぐ |
| `FETCH FIRST ... ROWS ONLY` で構文エラーになる | MySQL と SQLite は、`FETCH FIRST` に対応していない | `LIMIT` を使う |
| `GENERATED ... AS IDENTITY` で構文エラーになる | MySQL と SQLite は、標準の連番の書き方に対応していない | MySQL は `AUTO_INCREMENT`、SQLite は `INTEGER PRIMARY KEY` にする |
| <code>&#124;&#124;</code> で文字列を連結すると、想定外の結果になる | MySQL では、<code>&#124;&#124;</code> が `OR` の意味になる | `CONCAT()` を使う |
| `AVG()` の結果が、思った値と違う | `NULL` の行が、平均の対象から外れている | `COALESCE()` で値を置き換える。または、集計の対象を見直す |
| `UPDATE` や `DELETE` で、全行が変わった | `WHERE` を書き忘れた | 先に `SELECT` で確認する。トランザクションの中で実行する |
| SQLite で、外部キー制約が効かない | 既定で無効になっている | 接続のたびに `PRAGMA foreign_keys = ON;` を実行する |
| SQLAlchemy で、`execute()` がエラーになる | 2.0 では、文字列を直接渡せない | `text()` で包む |
| SQLAlchemy で、`MySQLdb` が見つからない | `mysql://` は、mysqlclient を使う書き方 | `mysql+mysqlconnector://` にする。または、mysqlclient を入れる |
| `NOT IN (サブクエリ)` で、1行も返らない | サブクエリの結果に `NULL` が含まれると、比較が `UNKNOWN` になる | `NOT EXISTS` を使う。または、サブクエリに `IS NOT NULL` を付ける |
| `Every derived table must have its own alias` | `FROM` の中のサブクエリに、エイリアスがない | サブクエリの後ろに、`AS 名前` を付ける |
| インデックスを作ったのに、検索が速くならない | `LIKE '%文字'` や、列に関数を使った条件では、インデックスが使われにくい | 前方一致にする。または、列そのものを比較する条件に書き換える |
| `ALTER TABLE ... DROP CONSTRAINT` で構文エラーになる (MySQL) | 8.0.19 より前のバージョンは、非対応 | 外部キーは `DROP FOREIGN KEY` を使う |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| `mysqldump` | MySQL のデータベースを、SQL 文として、エクスポートする |
| mysql2sqlite | MySQL のダンプを、SQLite 用の SQL に変換する |
| mysql-connector-python | Python から MySQL に接続する、公式のドライバー |
| SQLAlchemy | Python の、データベースのツールキット (接続と ORM) |
| PostgreSQL | MySQL、SQLite と並ぶ、代表的なデータベース (このドキュメントでは扱わない) |
