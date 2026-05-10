---
title: COBOL
layout: default
---

# COBOL <a id="top" data-name="TOP"></a>

---

## 基本 <a id="basic" data-name="基本"></a>

### 1. プログラムの構成要素（4つの部）

- 見出し部（IDENTIFICATION DIVISION）
見出し部はCOBOLプログラムを識別するための部で、見出し部のみ節はありません。PROGRAM-IDには作成するプログラム名などの情報を記述します。見出し部は省略できず、唯一節を持ちません。
- 環境部（ENVIRONMENT DIVISION）
環境部はプログラムを適用するコンピュータ名や、環境変数などの情報の定義を行う構成節（CONFIGURATION SECTION）と、プログラムファイルを使用する場合に記述する入出力節（INPUT-OUTPUT SECTION）があります。
- データ部（DATA DIVISION）
データ部はファイル節（FILE SECTION）、作業場所節（WORKNG-STORAGE SECTION）、連絡節（LINKAGE SECTION）、通信節（COMMUNICATION SECTION）などから構成されます。主にプログラムで使用するデータ項目やファイルのレコードの宣言を行います。
- 手続き部（PROCEDURE DIVISION）
手続き部では主に各種処理を宣言したり、実行される手続きやエラーになった場合の処理内容を記述します。
また、STOP文を記述すれば、プログラムを終了することができます。

COBOLプログラムは、4つの「部（DIVISION）」を頂点とした階層構造で構成されています。
結論から言うと、標準的に使われる「部（DIVISION）」と「節（SECTION）」は、すべて列挙できるほど限られた数です。
以下のリストに主要なものをまとめました。

---

### 2. 各部（DIVISION）に含まれる主要な節（SECTION）
部はさらに「節（SECTION）」に分かれます。よく使われるものは以下の通りです。

#### 環境部 (ENVIRONMENT DIVISION)

- CONFIGURATION SECTION（構成節）：翻訳・実行するコンピュータ名を指定。
- INPUT-OUTPUT SECTION（入出力節）：プログラムで使う外部ファイル（SELECT文など）を定義。

#### データ部 (DATA DIVISION) 

- FILE SECTION（ファイル節）：ファイル内のデータ構造を定義。
- WORKING-STORAGE SECTION（作業場所節）：プログラム内部で使う一時変数を定義。
- LINKAGE SECTION（連絡節）：別のプログラムから渡されるデータを受け取る領域。
- REPORT SECTION（レポート節）：帳票作成機能（Report Writer）を使う際に使用。
- COMMUNICATION SECTION（通信節）：オンライン通信処理で使用。

#### 手続き部 (PROCEDURE DIVISION)

- 任意の節名（プログラマが定義）：手続き部では、一連の処理をまとめるためにプログラマが自由に MAIN-SECTION SECTION. のように節名を付けることができます。
- DECLARATIVE（宣言部分）：エラー処理など、特定の条件下で実行される特殊な節。

---

COBOLは最初とっつきにくいけど、**「どこを見るかの順番」さえ決めればかなり機械的に読める**ようになります。
今のケース（ファイル→SQL化）にも直結する手順でまとめます。

## COBOLコードを読むときの基本ルート <a id="how-to-read" data-name="コードの読み方"></a>

結論から言うとこの順番👇

> **① 入出力（ファイル/DB） → ② データ構造 → ③ メイン処理 → ④ 条件分岐 → ⑤ ループの流れ**

この順で追うと迷子にならないです。

---

### ① まず「どこからデータ来てるか」を特定

最優先でここ👇

```cobol
SELECT ～ ASSIGN TO ～
```

見るポイント：

- ファイル名（論理名）
- 実体（ASSIGN先）
- ORGANIZATION

  - INDEXED → インデックスファイル
  - SEQUENTIAL → ベタ読み
- ACCESS MODE

  - SEQUENTIAL / RANDOM

👉 ここで「これはDB的に扱うのか、ただのファイルか」を判断

---

### ② 次に「データ構造（＝テーブル定義）」を見る

```cobol
FD ～ 
COPY ～.
```

やること：

- COPY句の中身を開く

中はだいたいこう👇

```cobol
01 REC.
  05 USER-ID PIC X(10).
  05 AMOUNT  PIC 9(5).
```

👉 これがそのまま：

- カラム
- 型

になる

---

### ③ メイン処理を探す（入口）

COBOLは関数じゃなくて**ラベル（段落）単位**で動く

よくある入口：

```cobol
PERFORM MAIN-RTN
```

または

```cobol
MAIN-RTN.
```

👉 ここからスタートして追う

---

### ④ I/O処理（READ / WRITE）を追う

今回の核心👇

```cobol
READ ファイル名
```

チェックポイント：

- AT END → 終了条件
- KEY指定 → 検索条件
- どの項目を使ってるか

👉 SQLに直すときの核になる

---

### ⑤ 条件分岐（WHERE句になるところ）

```cobol
IF 条件
```

見るポイント：

- どの項目を比較してるか
- 範囲条件か（<, >, =）

今回の例👇

```cobol
IF W-SCD1 < GM-STR → スキップ
IF W-SCD1 > GM-END → 終了
```

👉 SQLでいう

```sql
WHERE scd1 BETWEEN gm_str AND gm_end
```

---

### ⑥ ループ構造を把握（超重要）

COBOLはこう👇

```cobol
READ-010.
    READ ...
    IF 条件 GO TO READ-010.
```

👉 **GO TOでループしてる**

つまり：

- どこに戻るか
- どこで終わるか

を見る

---

## 読み方のコツ <a id="tips" data-name="読み方のコツ"></a>

### 1. 「全部読もう」としない

→ **流れを追うだけでOK**

---

### 2. 名前で意味を推測する

COBOLは命名がヒント：

- `SCD` → コード
- `AMT` → 金額
- `FLG` → フラグ
- `STS` → ステータス

---

### 3. MOVE文は「代入」として流す

```cobol
MOVE A TO B
```

👉 `B = A`

---

### 4. COPY句を最優先で理解

ここ分からないと全部分からない

---

### 5. 「これはSQLで言うと？」で考える

めちゃ効きます👇

| COBOL  | SQL    |
| ------ | ------- |
| READ   | SELECT  |
| IF    | WHERE   |
| MOVE   | SELECT列 |
| GO TO  | LOOP    |
| AT END | EOF    |

---

### 🚀 実践テンプレ

実際に読むときこうやるといい👇

#### Step 1

👉 SELECT句確認
（データソース）

#### Step 2

👉 COPY句開く
（構造理解）

#### Step 3

👉 READ探す
（データ取得）

#### Step 4

👉 IF条件拾う
（フィルタ）

#### Step 5

👉 GO TO追う
（ループ）

---

### 🔥 今回のコードに当てはめると

あなたのコードはこう読める👇

1. INDEXEDファイル読む
2. 1件ずつREAD
3. 範囲外はスキップ
4. 範囲超えたら終了

👉 完全に

```sql
SELECT - 
FROM table
WHERE key BETWEEN A AND B
```

---

## キー項目の見つけ方（最重要）<a id="how-find-key" data-name="キーの見つけ方"></a>

インデックスファイルは**必ずキーを持ってます**。
でもCOBOLでは「ぱっと見で分かりにくい」ことが多い。

### 🔍 探す場所はこの3つ

---

### ① `SELECT` 句（最優先）

```cobol
SELECT QJN010LS ASSIGN TO ...
      ORGANIZATION IS INDEXED
      ACCESS MODE IS ...
      RECORD KEY IS SSCD
```

👉 これが出てきたら勝ち

- `SSCD` = 主キー（SQLでいう `PRIMARY KEY`）

---

### ② `ALTERNATE RECORD KEY`

```cobol
ALTERNATE RECORD KEY IS USER-ID
```

👉 これは

- 副キー（セカンダリインデックス）

---

### ③ `READ ... KEY IS`

```cobol
READ QJN010LS KEY IS SSCD
```

👉 SELECT句が見えない場合のヒント

- ここで使われてる項目 = キーの可能性大

---

### 💡 今回のあなたのコードから推測

```cobol
MOVE SSCD TO W-SCD
IF W-SCD1 < GM-STR
```

👉 かなり高確率で

👉 **`SSCD` がキー（もしくはキーの一部）**

さらに👇

- 範囲チェックしてる
- SEQUENTIALで読んでる

👉 **キー順に並んでる前提**

---

## 🧠 SQLとの対応

もしこうなら👇

```cobol
RECORD KEY IS SSCD
```

👉 SQLは

```sql
PRIMARY KEY (sscd)
```

---

## 🚀 ② INDEXEDのキー定義はどこ？

これがちょっとクセある👇

---

### パターン①：COBOL内（理想）

```cobol
SELECT ...
    RECORD KEY IS SSCD
```

👉 一番分かりやすい

---

### パターン②：外部定義（よくある）

あなたのコードのこれ👇

```cobol
COPY QJN010S1 OF XFDLIB
```

👉 この中にあることがある

---

### パターン③：環境依存（これが厄介）

昔のシステムだと👇

- JCL
- VSAM定義
- ファイル定義書

👉 **COBOLの外でキー決まってる**

---

## 🔥 実務での見抜き方（超重要）

もしキー定義が見えないとき👇

### ✔ ヒント①：範囲条件

```cobol
IF W-SCD1 < GM-STR
IF W-SCD1 > GM-END
```

👉 これは

👉 **キーじゃないと成立しない処理**

---

### ✔ ヒント②：スキップ処理

```cobol
GO TO READ-010
```

👉 順番に読んでる

👉 ソート済み = キー順

---

### ✔ ヒント③：MOVE元

```cobol
MOVE SSCD TO W-SCD
```

👉 よく使われる項目 = キー候補

---

## 🧩 まとめ（ここが本質）

COBOLでキーを見つけるとき👇

1. SELECT句探す
2. READ KEY探す
3. IF条件を見る
4. 使用頻度で推測

---

## 🧠 SQL化のゴール

ここまで分かると👇

```sql
CREATE TABLE qjn010ls (
  sscd VARCHAR(10),
  ...
  PRIMARY KEY (sscd)
);
```

＋

```sql
SELECT *
FROM qjn010ls
WHERE sscd BETWEEN :gm_str AND :gm_end;
```

---

## 👍 一言でいうと

👉 **「キーを見つける＝このファイルの“並びのルール”を見抜くこと」**

---

## 基本的な考え方 <a id="basic-concept" data-name="基本的な考え方"></a>

👉 COBOLは

> **「データを MOVE して、READ/WRITE で入出力して、IFで分岐する」**

ほぼこれだけです。

---

## 📦 データ操作系（超重要）

### 🔹 MOVE（代入）

```cobol
MOVE A TO B
```

👉 **B = A**

---

#### ポイント

* 右 → 左じゃなくて **左に入る**
* 型が違っても強引に変換される（これがクセ強い）

---

### 🔹 INITIALIZE

```cobol
INITIALIZE W-AREA
```

👉 **変数を初期化（スペースや0）**

---

### 🔹 ADD / SUBTRACT / MULTIPLY / DIVIDE

```cobol
ADD A TO B
```

👉 **B += A**

---

## 📂 ファイル操作系（今回の主役）

### 🔹 OPEN

```cobol
OPEN INPUT  FILE-A
OPEN OUTPUT FILE-B
OPEN I-O    FILE-C
```

👉 ファイルを開く

* INPUT → 読み込み
* OUTPUT → 新規作成（上書き）
* I-O → 読み書き

---

### 🔹 READ

```cobol
READ FILE-A AT END ...
```

👉 **1レコード読む**

---

#### ポイント

* 読んだデータは自動で変数に入る
* EOFは `AT END`

---

### 🔹 WRITE

```cobol
WRITE REC-A
```

👉 **今のレコード内容をファイルに書く**

---

#### ポイント

* 事前に `MOVE` しておく必要あり
* SQLでいう `INSERT`

---

### 🔹 REWRITE

```cobol
REWRITE REC-A
```

👉 **既存レコードの更新**

（SQLのUPDATE）

---

### 🔹 CLOSE

```cobol
CLOSE FILE-A
```

👉 ファイル閉じる

---

## 🔀 制御系

### 🔹 IF

```cobol
IF A = B
```

👉 条件分岐

---

### 🔹 GO TO（クセ強）

```cobol
GO TO READ-010
```

👉 **ジャンプ（ループの代わり）**

---

### 🔹 PERFORM

```cobol
PERFORM READ-RTN
```

👉 **サブルーチン呼び出し（関数っぽい）**

---

### 🔹 EXIT

```cobol
EXIT
```

👉 処理終了（段落抜ける）

---

## 🧠 よく出る組み合わせ（実務パターン）

### 🔁 ループ

```cobol
READ-010.
    READ FILE-A AT END ...
    IF 条件
       GO TO READ-010
```

👉 whileループ

---

### 📥 入力処理

```cobol
OPEN INPUT FILE-A
READ FILE-A
```

---

### 📤 出力処理

```cobol
MOVE A TO B
WRITE REC-B
```

---

## 🔥 SQLとの対応（これ覚えると強い）

| COBOL   | SQL    |
| ------- | ------ |
| READ    | SELECT |
| WRITE   | INSERT |
| REWRITE | UPDATE |
| IF     | WHERE  |
| MOVE    | カラム代入  |
| GO TO   | ループ    |

---

## 🧩 今回のあなたのコードに当てはめると

```cobol
READ QJN010LS
MOVE SSCD TO W-SCD
IF 条件
WRITE QJNG0020
```

1. データ取得（SELECT）
2. 値コピー
3. 条件チェック
4. 書き込み（INSERT）

---

## ファイルの探し方 <a id="find-file" data-name="ファイルの探し方"></a>

いいところ来ましたね 👍
ここ、COBOL→DBマイグレーションで一番ハマるポイントです。

---

## 🧭 結論

👉 **COBOLコード単体から“実際のテーブル”は分からないことが多い**
👉 探すときは

> **JCL / 環境定義 / 運用資料 / 命名規則 を組み合わせて特定する**

---

🔧 探し方（実務ルート）

#### 🔹 ① `ASSIGN TO` を起点にする

```cobol
SELECT QJN010LS ASSIGN TO DA-VI-QJN010LS
```

👉 まずこれを拾う

---

#### 🔹 ② JCLを見る（最重要）

👉 ここに答えがあることが多い

例（イメージ）👇

```jcl
//STEP1 EXEC PGM=QJN010
//QJN010LS DD DSN=PROD.DB.QJN010,DISP=SHR
```

👉 これで👇

* `QJN010LS` → `PROD.DB.QJN010`

👉 **実体が分かる**

---

### 🧠 パターン別

#### ✔ メインフレーム系

👉 DSN（データセット名）

```text
PROD.DB.QJN010
```

👉 DB or ファイルの可能性

---

#### ✔ オープン系

👉 ファイルパス

```text
/data/qjn010.dat
```

---

#### ✔ DBの場合

👉 さらにマッピングがある

* VSAM → DBロード
* バッチ → DB INSERT

---

### 🔥 ③ 命名規則を疑う

👉 よくある👇

| COBOL    | DB      |
| -------- | -------- |
| QJN010LS | QJN010   |
| CUSTMST  | CUSTOMER |

---

👉 **LS, FS, FILE などは削る**

---

### 🔹 ④ COPYブックを見る

```cobol
COPY QJN010S1
```

👉 中身👇

```cobol
05 SSCD PIC X(10)
05 AMT  PIC 9(5)
```

👉 これが

👉 **テーブルのカラム候補**

---

### 🔹 ⑤ 他プログラムを探す

👉 同じファイルを使ってる処理

* INSERTしてるやつ
* DBアクセスしてるやつ

👉 そこにヒントがある

---

### 🔹 ⑥ ドキュメント（あれば神）

* 設計書
* I/O仕様書
* データ定義書

---

### 🧩 最終的な対応づけ

```text
COBOL
  QJN010LS
    ↓
JCL
  PROD.DB.QJN010
    ↓
DB
  table: QJN010
    ↓
COPY
  SSCD, AMT → カラム
```

---

### 💡 判断のコツ

#### ❗ これ大事

👉 **「ファイルかDBか」をまず見極める**

---

#### ✔ ファイルなら

👉 CSV / 固定長

---

#### ✔ DBなら

👉 テーブル

---

### 👍 一言でいうと

👉 **「COBOLだけじゃ無理、周辺（JCLなど）を見て特定する」**

---

## キーワード <a id="keyword" data-name="キーワード"></a>

##### ACCESS MODE
プログラムがファイルのレコードをどのような方法で読み書きするかを指定する。<br>
以下は主要な3つのアクセスモード。
- SEQUENTIAL：先頭から順番に1件ずつ処理する。
- RANDOM：主キーや相対キーを指定して、特定のレコードに直接アクセスする。
- DYNAMIC：プログラム内で順次処理と直接アクセスを切り替えられる。

##### ADD
加算

##### ACCEPT
プログラムの外部(OSやファイル、キーボードなど)からデータを受け取る。
- ACCEPT PARAM-DATA FROM SYSIN.
- ACCEPT W-SYOYMD FROM DATE.

##### AFTER
改行を表し、 WRITE ... AFTER の場合、改行をしてから書き込みを行う。<br>
AFTER のみで改行、 AFTER n で n だけ改行、 AFTER PAGE で改ページ。<br>
正しくは AFTER ADVANCING と書くが、省略可能。

##### AT END
読み込むデータが空になり、データがなかった場合の処理を書く。

##### ASSIGN
SELECT で名前と物理を紐づける。

##### CALL
別のプログラムとしてコンパイルされているものを実行する。引数も渡せる。<br>
PERFORM は同じプログラム内の別の段落やセクションを実行する。
- CALL "PROG".

##### COMPUTE
算術式計算。

##### COPY
COPY 句により外部のファイルなどを挿入する。

##### DISPLAY
標準出力への出力。

##### DIVIDE
除算。

##### EVALUATE
EVALUATE 評価式 として、 switch文のように値を評価する。

##### FILLER
変数名を持たず、詰め物として使う値。

##### GIVING
計算結果を変数に代入するときに使う。
- ADD A TO B GIVING C.

##### HIGH-VALUE
データのバイト列を全て1にする。

##### INVALID
INVALID句はデータの妥当性を検査する。<br>
READ で読み込めなかった、 WRITE で書き込めなかった等。
- INVALID KEY

##### INITIALIZE
変数の初期化を行い、数字項目には0文字列項目にはスペースが代入される。
- INITIALIZE TOP-LEVEL.

##### JOINING
PREFIX または SUFFIX によって、接頭辞または接尾辞を-(ハイフン)を区切り文字として付加する。
- JOINING HAI AS PREFIX.

##### KEY
SELECT句で定義してある RECORD KEY IS 項目名. と紐づけられる。

##### MOVE
代入。

##### USING
PROCEDURE DIVISION の冒頭で、 USING 構造体名として、 LINKAGESECTION で宣言された構造体へのポインタを呼出元から引数として受け取る。
- PROCEDURE DIVISION USING LNK-AREA.

##### LOW-VALUE
データのバイト列を全て0にする。

##### LINAGE
FD句の中に記述し、印刷時の論理的なページ構成をシステムに伝える。
- LINAGE WK-LINES LINES.

##### LINKAGE SECTION
呼ばれる側のプログラムでCALLを通じて引数を渡すために記述する。<br>
このセクションにどんなデータが届くのかを定義して、 PROCEDURE DIVISION USING... に記述した順番で紐づけられる。<br>
データの参照になるので呼出元のデータを直接書き換える。

##### MULTIPLY
乗算。

##### OPEN
ファイルをオープンする。使用後は必ずクローズする。
- INPUT：入力用にオープン。データを読み込む (READ) ときに使う。
- OUTPUT：出力用にオープン。新しくファイルを作ってデータを書き込む (WRITE) ときに使う。上書き保存される。
- I-O：入出力用にオープン。必要に応じて読込、更新、削除を行う。
- EXTENDED：拡張用にオープン。既存ファイルの末尾にデータを追加する。

##### ON SIZE ERROR
桁あふれが発生した時のエラー処理を記述する。

##### ORGANIZATION
データがファイルの中でどのように構成・記録されるかを指定する。<br>
FILE-CONTROL 段落で記述して、一度ファイルを作成すると後から変更できない。<br>
以下は主な4つのファイル編成。
- SEQUENTIAL：レコードが書き込まれた順に並ぶ、基本的な形式
- LINE SEQUENTIAL：テキスト形式のファイルとして扱われ、エディタ等でも閲覧が可能。
- RELATIVE：各レコードに番号(相対レコードキー)が割り当てられ、番号を指定して直接アクセス可能。
- INDEXED：レコード内の特定の項目(レコードキー)を索引としてもち、高速な検索・更新が可能。

##### OCCURS
配列を宣言する。
- 03  UK1-SCD  PIC X(2)  OCCURS 8 TIMES.

##### PERFORM
サブルーチンを呼び出したり、 UNTIL(while) 、 VARYING(for) 、 TIMES で繰り返し処理を行う。

##### PIC
変数のデータ型を指定する。

##### ROUNDED
計算結果を四捨五入する。

##### REMAINDER
DIVIDE文で余りを取得する。

##### SPACE
スペースを表す予約語。

##### SPECIAL-NAMES
システムのデバイスに独自の呼び名をつける。
- CONSOLE IS CSL.

##### SUBTRACT
減算。

##### UNTIL
UNTIL 条件式でまでずっと（while）。

##### UPON
主に DISPLAY 文と一緒に使われ、データの出力先を指定するキーワード。

##### VALUE
変数に初期値を割り当てるために使う。

##### VARYING
他の言語で言うところのfor文。
- PERFORM VARYING  カウンタ  FROM  初期値  BY  変動値

##### ZERO
0を表す予約語。
