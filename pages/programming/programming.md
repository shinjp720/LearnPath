---
title: プログラミング全般
layout: default
---

# プログラミング全般 <a id="top" data-name="TOP"></a>

プログラミングにおける共通の知識まとめ。

特定のプログラミング言語に依存しない、命名規則、比較演算子の書き方、基本的な用語を扱う。

設計原則 (SOLID、GRASP、コマンド・クエリ分離など) は「設計原則」のドキュメント、デザインパターン (GoF の 23 パターン) は「デザインパターン」のドキュメントに、まとめている。

---

## 命名規則 <a id="nameing-convention" data-name="命名規則"></a>

複数の単語を、1つの名前にまとめる書き方には、いくつかの形式がある。名前の付け方の考え方 (意図が伝わる命名) は、「設計原則」のドキュメントを参照。

### 形式の一覧

| 名前 | 形式 | 例 | 主な用途 |
| --- | --- | --- | --- |
| スネークケース (snake_case) | 単語をアンダースコア (`_`) で区切る | `my_variable_name` | 主に Python や SQL で使われる |
| キャメルケース (camelCase) | 最初の単語を小文字で始め、以降の単語の先頭を大文字にする | `myVariableName` | 主に JavaScript や Java のローカル変数や関数で使われる |
| パスカルケース (PascalCase) | 各単語の先頭を大文字にする | `MyVariableName` | 主にクラス名や型名で使われる (C# や Java や Python) |
| ケバブケース (kebab-case) | 単語をハイフン (`-`) で区切る | `my-variable-name` | 主に URL や HTML や CSS クラス名で使われる |
| アッパースネークケース (UPPER_SNAKE_CASE) | 全てを大文字にして、アンダースコアで区切る | `MY_VARIABLE_NAME` | 主に定数の命名に使われる (C 言語や Python) |
| スクリーミングスネークケース (SCREAMING_SNAKE_CASE) | アッパースネークケースの別名で、強調の意味も込められる | `ERROR_MESSAGE` | アッパースネークケースと同じ |
| タイトルケース (Title Case) | 各単語の最初を大文字にし、スペースで区切る | `My Variable Name` | 文書やデザイン要素のタイトルに使われる |
| ハンガリアン記法 (Hungarian Notation) | 変数の型や用途を、プレフィックスで示す | `strName` (文字列)、`iCount` (整数) | レガシーシステムや古いコードで見られる |
| ドットケース (dot.case) | 単語をドット (`.`) で区切る | `my.variable.name` | 一部の設定ファイル (`.properties` など) のキーや、パッケージ名で使われる |
| トレインケース (Train-Case) | ケバブケースの変種で、各単語の先頭を大文字にする | `My-Variable-Name` | デザインやドキュメントで見かけることがある。HTTP ヘッダー名 (`Content-Type`) も、この形 |

キャメルケースは、lowerCamelCase とも呼ぶ。パスカルケースは、UpperCamelCase とも呼ぶ。

<pre><code class="caution">ケバブケースは、多くのプログラミング言語で、変数名や関数名に使えない。ハイフンが、引き算の記号と、区別できなくなるためである。
ハンガリアン記法は、型を名前に埋め込む書き方で、型を持つ現代の言語では、あまり使われない。</code></pre>

### 言語ごとの慣習

同じ形式でも、何に使うかは、言語によって違う。基本は、使う言語と、プロジェクトの規約に従う。

| 言語、場面 | 変数、関数 | 型、クラス | 定数 |
| --- | --- | --- | --- |
| Python (PEP 8) | `snake_case` | `PascalCase` (CapWords) | `UPPER_SNAKE_CASE` |
| JavaScript | `camelCase` | `PascalCase` | `UPPER_SNAKE_CASE` |
| Java | `camelCase` | `PascalCase` | `UPPER_SNAKE_CASE` |
| Rust | `snake_case` | `PascalCase` | `SCREAMING_SNAKE_CASE` |
| SQL (テーブル、列) | `snake_case` | なし | なし |
| CSS (クラス名) | `kebab-case` | なし | なし |

```python
MAX_RETRY_COUNT = 3  # 定数: UPPER_SNAKE_CASE


class UserAccount:  # クラス: PascalCase
    def get_user_name(self):  # 関数、メソッド: snake_case
        user_name = "alice"  # 変数: snake_case
        return user_name


print(MAX_RETRY_COUNT, UserAccount().get_user_name())  # 3 alice
```

<pre><code class="tips">1つのプロジェクトの中では、同じ種類の名前に、同じ形式を使う。userId と userID のように、略語の大文字と小文字を混ぜると、検索しにくくなる。略語の扱いも、規約で決めておく。</code></pre>

---

## 英語形式の比較演算子 <a id="english-like" data-name="英語形式の比較演算子"></a>

比較を、記号ではなく、英語の略語で書く形式。

| 演算子 | 説明 | C言語 |
| --- | --- | --- |
| `eq` | 等しい (equal) | `x == y` |
| `ne` | 等しくない (not equal) | `x != y` |
| `lt` | より小さい (less than) | `x < y` |
| `le` | 以下 (less than or equal) | `x <= y` |
| `gt` | より大きい (greater than) | `x > y` |
| `ge` | 以上 (greater than or equal) | `x >= y` |

### 使われる場所

| 場所 | 書き方 | 備考 |
| --- | --- | --- |
| Bash (`[ ]`、`test`) | `-eq`、`-ne`、`-lt`、`-le`、`-gt`、`-ge` | 整数の比較。先頭にハイフンが付く。文字列の比較は、`=` と `!=` |
| PowerShell | `-eq`、`-ne`、`-lt`、`-le`、`-gt`、`-ge` | Bash と同じ形 |
| Perl | `eq`、`ne`、`lt`、`le`、`gt`、`ge` | 文字列の比較。数値の比較は、`==`、`<` など |
| Fortran | `.eq.`、`.ne.`、`.lt.`、`.le.`、`.gt.`、`.ge.` | 古い書き方。現在は、`==` なども使える |
| Python | `operator.eq`、`operator.lt` など | 演算子を、関数として呼ぶ。`sorted` の引数などに渡せる |
| Rust | `eq`、`ne`、`lt`、`le`、`gt`、`ge` | `PartialEq` と `PartialOrd` のメソッド |

```bash
x=3; y=5
if [ "$x" -lt "$y" ]; then
    echo "x < y"   # x < y
fi
```

```bash
# Perl: 文字列は eq、数値は ==
perl -e 'print "10" == "10.0" ? "num-eq\n" : "num-ne\n"'  # num-eq
perl -e 'print "10" eq "10.0" ? "str-eq\n" : "str-ne\n"'  # str-ne
```

```python
import operator

print(operator.lt(1, 2))       # True
print(operator.eq("a", "a"))   # True
```

<pre><code class="caution">Perl では、eq は文字列の比較で、== は数値の比較である。"10" と "10.0" は、数値としては等しいが、文字列としては等しくない。比較する種類に合わせて、使い分ける。
Bash の -eq は、整数だけを比較する。文字列に使うと、エラーになる。</code></pre>

---

## 用語 <a id="term" data-name="用語"></a>

### 宣言 (declaration)

名前 (識別子) とその型・属性をコンパイラに知らせること。定義を伴う場合と伴わない場合がある。

```c
extern int x;     // 宣言: x はどこかで定義される (ここでは定義していない)
int y;            // 宣言 + 定義 (ストレージ領域も割り当て)
int foo(int);     // 関数の宣言
```

### 定義 (definition)

実体 (ストレージ領域) や内容を与えること。つまり、値を保持できるようにすること。

```c
int x = 0;       // 定義: x という変数を定義し初期化
int foo(void) {  // 定義: foo という関数の本体
    return 1;
}
```

`int x;` も定義とみなされる (初期化してなくてもストレージが割り当てられる)。<br>
`extern int x;` は「宣言」のみで「定義」ではない。

| 項目 | 宣言 | 定義 |
| --- | --- | --- |
| 役割 | 名前と型を、コンパイラに知らせる | 実体を与える |
| ストレージ | 割り当てない (`extern` の場合) | 割り当てる |
| 書ける回数 | 何度でも | 1回だけ |

<pre><code class="tips">定義を、ヘッダファイルに書いて、複数のファイルから読み込むと、定義が重複して、リンクでエラーになる。ヘッダには宣言だけを書き、定義は、1つの .c ファイルに書く。</code></pre>

### 式 (expression)

値を生成する構文。評価されると「値」または「副作用 (変数への代入や関数呼び出しなど)」をもたらす。

```c
x + 1        // 式: x に 1 を足した結果の値を生成
a = 3        // 式: 代入も式。代入の結果 (値) は 3
foo(x)       // 関数呼び出しも式
```

### 文 (statement)

何かの処理を行う命令的な構文。式の評価・制御構造・定義などが含まれる。

```c
a = b + 1;    // 式文 (expression statement)
if (a > 0) {  // if 文 (制御文)
    printf("OK");
}
int x = 3;    // 宣言 (C では、宣言と文は区別される。C++ では「宣言文」と呼ぶ)
```

C では、式文や return 文などは、セミコロンで終わる。`{ }` で囲んだ複合文 (ブロック) の末尾には、セミコロンを付けない。<br>
関数の本体は、宣言と文を並べたもの。

| 項目 | 式 | 文 |
| --- | --- | --- |
| 値 | 持つ | 持たない |
| 例 | `x + 1`、`a = 3`、`foo(x)` | `a = b + 1;`、`if (...) { }` |
| 関係 | 式の末尾に `;` を付けると、式文になる | 文の中に、式が含まれる |

### 評価 (evaluation)

式を処理して、値や副作用を生じさせる行為。

```c
int a = 2;
int b = a + 3;  // 式 a + 3 を評価 → 5
```

### 値 (value)

式を評価した結果のデータそのもの。整数・浮動小数点・アドレスなど。

### 副作用 (side effect)

式の評価によって、値を得ること以外に、状態を変化させる作用。変数への代入や、関数呼び出しによる入出力など。設計への影響は、「設計原則」のドキュメントの、コマンド・クエリ分離を参照。

```c
a = 3;   // 値は 3 (主たる作用)。同時に、a の値が変わる (副作用)
```

### 初期化 (initialization) と代入 (assignment)

変数の宣言と同時に、最初の値を与えるのが初期化。あとから、値を書き換えるのが代入。

```c
int c = 5;  // 初期化
c = 6;      // 代入
```

### 仮引数 (parameter) と実引数 (argument)

関数の定義に書く、受け取る側の変数が、仮引数。関数を呼び出すときに渡す、実際の値が、実引数。

```c
int add(int a, int b) {  // a, b は仮引数
    return a + b;
}

int r = add(1, 2);       // 1, 2 は実引数
```

### スコープ (scope)

名前が、有効になる範囲。`{ }` で囲んだ内側で宣言した名前は、その外では使えない。

```c
int g = 10;      // ファイルスコープ: 同じファイルのどこからでも使える

int main(void) {
    {
        int inner = 5;   // この内側だけで有効
    }
    // ここでは、inner は使えない
    return 0;
}
```

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| 同じ種類の名前に、複数の形式が混ざる | 規約を決めていない。または、言語の慣習に従っていない | 言語の慣習と、プロジェクトの規約に、そろえる |
| 変数名に、ハイフンを使ったら、エラーになった | ケバブケースは、引き算として解釈される | スネークケースか、キャメルケースにする。ケバブケースは、URL や CSS で使う |
| Perl で、数値を `eq` で比較したら、期待と違った | `eq` は、文字列の比較 | 数値は、`==` を使う |
| Bash で、文字列を `-eq` で比較したら、エラーになった | `-eq` は、整数の比較 | 文字列は、`=` を使う |
| 同じ名前を、複数のファイルで定義して、リンクエラーになった | ヘッダに、定義を書いている | ヘッダは宣言だけにして、定義は、1つの .c ファイルに書く |
| `if (a = 3)` が、常に真になる | `=` (代入) と `==` (比較) を、書き間違えている | 比較は `==`。代入も式であり、値が 3 になるため、エラーにならない |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| 「設計原則」のドキュメント | SOLID、GRASP、コマンド・クエリ分離などの設計原則 |
| 「デザインパターン」のドキュメント | GoF の 23 のデザインパターン |
| [PEP 8](https://peps.python.org/pep-0008/) | Python のスタイルガイド。命名規則を含む |
| Python のドキュメント | 演算子の章を参照 |
