---
title: C言語
layout: default
---

# C言語 <a id="top" data-name="TOP"></a>

---

## コンパイルと実行 <a id="compile" data-name="コンパイルと実行"></a>

```
gcc main.c -o main                          # コンパイルして実行ファイルmainを作る
./main                                      # 実行
gcc -Wall -Wextra -std=c11 -g main.c -o main # 警告を有効にしてC11でコンパイル、デバッグ情報付き
```

| オプション | 説明 |
| --- | --- |
| `-o ファイル名` | 出力ファイル名を指定する。 |
| `-Wall -Wextra` | 多くの警告を有効にする。基本的に常に付ける。 |
| `-std=c11` | 使用するC言語の規格を指定する(c99, c11, c17, c23など)。 |
| `-g` | デバッグ情報を付加する(gdbやvalgrindで行番号が分かる)。 |
| `-O2` | 最適化レベルを指定する。 |
| `-c` | リンクせずオブジェクトファイル(.o)を作る。 |
| `-l ライブラリ` | ライブラリをリンクする(例: `-lm`)。 |
| `-fsanitize=address,undefined` | 実行時にメモリ破壊や未定義動作を検出する。 |

コンパイルは次の4段階で行われる。それぞれ途中で止めて結果を確認できる。

| 段階 | 処理 | 確認するオプション |
| --- | --- | --- |
| プリプロセス | `#include`や`#define`の展開 | `gcc -E main.c` |
| コンパイル | Cのコードをアセンブリへ変換 | `gcc -S main.c` |
| アセンブル | アセンブリをオブジェクトファイルへ変換 | `gcc -c main.c` |
| リンク | オブジェクトファイルとライブラリを結合 | `gcc main.o -o main` |

---

## 演算子 <a id="operator" data-name="演算子"></a>

### 演算子の優先順位

| 優先順位 | 演算子 | 意味 | 結合規則 | 項数 |
| --- | --- | --- | --- | --- |
| 1 | () | 関数呼び出し | → | 可変 |
| 1 | [] | 配列 | → | 2 |
| 1 | -> | 構造体メンバ参照 | → | 2 |
| 1 | . | 構造体メンバ参照 | → | 2 |
| 1 | ++ | 後置増分 | → | 1 |
| 1 | `--` | 後置減分 | → | 1 |
| 2 | ++ | 前置増分 | ← | 1 |
| 2 | `--` | 前置減分 | ← | 1 |
| 2 | sizeof | 記憶量 | ← | 1 |
| 2 | & | アドレス | ← | 1 |
| 2 | * | 間接参照 | ← | 1 |
| 2 | + | 正符号。charやshortはintに変換。ほぼ使われない | ← | 1 |
| 2 | `-` | 負符号。オペランドの符号を反転 | ← | 1 |
| 2 | ~ | 1の補数。ビット反転 | ← | 1 |
| 2 | ! | 否定 | ← | 1 |
| 3 | () | キャスト | ← | 1 |
| 4 | * | 乗算 | → | 2 |
| 4 | / | 除算 | → | 2 |
| 4 | % | 剰余 | → | 2 |
| 5 | + | 加算 | → | 2 |
| 5 | `-` | 減算 | → | 2 |
| 6 | << | ビット左シフト | → | 2 |
| 6 | >> | ビット右シフト | → | 2 |
| 7 | < | 左不等号(より小さい) | → | 2 |
| 7 | <= | 等価左不等号(以下) | → | 2 |
| 7 | > | 右不等号(より大きい) | → | 2 |
| 7 | >= | 等価右不等号(以上) | → | 2 |
| 8 | == | 等価 | → | 2 |
| 8 | != | 非等価 | → | 2 |
| 9 | & | ビット積 共に1なら1、どちらかが0なら0 | → | 2 |
| 10 | ^ | ビット差 異なれば1、同じであれば0 | → | 2 |
| 11 | \| | ビット和 どちらかが1なら1 | → | 2 |
| 12 | && | 論理積 | → | 2 |
| 13 | \|\| | 論理和 | → | 2 |
| 14 | ?: | 三項演算子。条件式 ? 真のとき : 偽のとき | ← | 3 |
| 15 | = | 代入 | ← | 2 |
| 15 | += | 加算代入 | ← | 2 |
| 15 | -= | 減算代入 | ← | 2 |
| 15 | *= | 乗算代入 | ← | 2 |
| 15 | /= | 除算代入 | ← | 2 |
| 15 | %= | 剰余代入 | ← | 2 |
| 15 | <<= | 左シフト代入 | ← | 2 |
| 15 | >>= | 右シフト代入 | ← | 2 |
| 15 | &= | ビット積代入 | ← | 2 |
| 15 | ^= | ビット差代入 | ← | 2 |
| 15 | \|= | ビット和代入 | ← | 2 |
| 16 | , | カンマ演算子 | → | 2 |

<div class="subtitle">注意事項</div>

- 優先順位の数字が小さいほど、優先度が高い
- 結合規則：→ = 左結合、← = 右結合
- 同じ優先順位の演算子は結合規則に従って評価される

### ビット演算子によるフラグ制御
- ビットシフトや論理演算の際に符号ビットが影響しないように`unsigned int`を使う。
- 32ビット変数なら`1U << 31`が最大。それを越えた場合は未定義動作。さらに大きなフラグが必要なら`uint64_t`などを使う。

<table>
    <tr><th>演算子</th><th>呼び方</th><th>意味</th><th>使い方</th></tr>
    <tr><td>|</td><td>ビット和(OR)</td><td>2つのビット列を比較して、どちらかが1なら1、共に0なら0。<br>
        フラグを立てる。
        <pre><code class="example">unsigned int flags = 0;

// FLAG_A と FLAG_C を立てる
flags |= FLAG_A;
flags |= FLAG_C;

// またはまとめて
flags |= (FLAG_A | FLAG_C);

// 初期化の場合は↓でもOK
unsigned int flag = (FLAG_A | FLAG_C); // = か |= の違い</code></pre>
        </td><td>x | y</td></tr>
    <tr><td>&</td><td>ビット積(AND)</td><td>2つのビット列を比較して、どちらかが0なら0、共に1なら1。<br>
        立っているビットの確認や反転したビットを倒す。
        <pre><code class="example">// FLAG_A が立っているか？
if (flags & FLAG_A) {
    // FLAG_A が 1 のとき真
}

// 複数ビットをまとめてチェック
if ((flags & (FLAG_A | FLAG_C)) == (FLAG_A | FLAG_C)) {
    // FLAG_A と FLAG_C が両方とも立っている
}</code></pre>
        <pre><code class="example">// FLAG_C を倒す
flags &= ~FLAG_C;</code></pre>
        <pre><code class="example">// あるビットが 0 である
if ((flags & FLAG_A) == 0) {
    // FLAG_Aが 0 のとき真
}</code></pre>
        <pre><code class="example">// 上位3ビットが 0b110xxxxx である
// 確認したいビットを1にして&する
if ((flags & 0b11100000) == 0b11000000) {}</code></pre>
        </td><td>x & y</td></tr>
    <tr><td>~</td><td>ビット反転(NOT)</td><td>xの0と1を反転</td><td>~x</td></tr>
    <tr><td><<</td><td>左シフト</td><td>xをn左にシフト。</td><td>x << n</td></tr>
    <tr><td>>></td><td>右シフト</td><td>xをn右にシフト。</td><td>x >> n</td></tr>
    <tr><td>^</td><td>ビット差(XOR)</td><td>2つのビット列を比較して、異なれば1、同じであれば0。 <br>
        ビットをトグルする。
        <pre><code class="example">// flagsのFLAG_Bをトグルする
flags ^= FLAG_B;</code></pre>
        </td><td>x ^ y</td></tr>
</table>

#### フラグの定義

```c
// それぞれのビット位置に対応する定数を定義
#define FLAG_A  (1U << 0)   // 0b0001
#define FLAG_B  (1U << 1)   // 0b0010
#define FLAG_C  (1U << 2)   // 0b0100
#define FLAG_D  (1U << 3)   // 0b1000

// 列挙体を使って定義することも可能
typedef enum {
    FLAG_A = 1U << 0,
    FLAG_B = 1U << 1,
    FLAG_C = 1U << 2,
    FLAG_D = 1U << 3
} Flags;
```

<pre><code class="caution">フラグをビットシフトによって定義する場合、演算子の優先順位の問題で意図しない結果となる場合があるので必ず()で囲む必要がある(この場合、単項演算子の~など)。</code></pre>

<pre><code class="caution">比較演算子の <span class="code-like">==</span> や <span class="code-like">!=</span> は、ビット演算子の <span class="code-like">&amp;</span> や <span class="code-like">|</span> より優先順位が高い。<span class="code-like">flags &amp; FLAG_A == 0</span> は <span class="code-like">flags &amp; (FLAG_A == 0)</span> と解釈されてしまうので、<span class="code-like">(flags &amp; FLAG_A) == 0</span> のように必ず括弧で囲む。</code></pre>

<pre><code class="caution">2進数リテラル(<span class="code-like">0b1010</span>)は、C23で標準化されるまではGCCやClangの拡張機能。古い規格に厳密に従う場合は16進数(<span class="code-like">0xA</span>)を使う。</code></pre>

#### マクロによるラッピング
<pre><code class="example">// ビットを立てる(1にする)
#define SET_BIT(var, pos)     ((var) |=  (1U << (pos)))

// ビットをクリアする(0にする)
#define CLEAR_BIT(var, pos)   ((var) &= ~(1U << (pos)))

// ビットをトグルする(反転させる)
#define TOGGLE_BIT(var, pos)  ((var) ^=  (1U << (pos)))

// ビットが立っているかテストする(非0なら立っている)
#define TEST_BIT(var, pos)    (((var) &   (1U << (pos))) != 0)

// マスクのクリア(マスクで指定したビットをまとめて0にする)
// mask: 1のビットがすべてクリアされる
#define CLEAR_MASK(var, mask) ((var) &= ~(mask))

// マスクのセット(マスクで指定したビットをまとめて1にする)
#define SET_MASK(var, mask)   ((var) |=  (mask))</code></pre>

#### 定番のテクニック

| 式 | 意味 |
| --- | --- |
| `x & 1` | 最下位ビット。奇数なら1、偶数なら0。 |
| `x & (x - 1)` | 最も下の1のビットを0にする。 |
| `(x & (x - 1)) == 0` | xが2の冪(または0)かどうか。 |
| `x & -x` | 最も下の1のビットだけを取り出す(xは`unsigned`)。 |
| `x << n` | xを2のn乗倍する(オーバーフローしない範囲で)。 |
| `x >> n` | xを2のn乗で割る(`unsigned`の場合)。 |
| `(x >> n) & 1` | xのnビット目(0始まり)を取り出す。 |

<pre><code class="caution">シフト量が型のビット幅以上、または負の場合は未定義動作。また、符号付き整数の左シフトで符号ビットに影響する場合や、負の値の右シフト(算術シフトか論理シフトか)も処理系依存・未定義となるので、ビット操作には<span class="code-like">unsigned</span>を使う。</code></pre>

---

## 制御構文 <a id="control-syntax" data-name="制御構文"></a>

### switch文の注意

- 各`case`の末尾に`break`が無いと、次の`case`の処理に続けて実行される(フォールスルー)。意図的な場合はコメントなどで明示する。
- `switch`の式と`case`の値は整数型(`enum`や`char`を含む)でなければならない。文字列や浮動小数点数は使えない。
- `case`の値は定数式で、重複できない。
- `default`は省略できるが、`enum`を`switch`する場合は付けないと、値が追加された時にコンパイラが警告(`-Wswitch`)してくれる。

```c
switch (c) {
case 'a':
case 'A':      // aとAは同じ処理
    puts("A");
    break;
case 'b':
    puts("B");
    // fallthrough (意図的なフォールスルー)
case 'c':
    puts("B or C");
    break;
default:
    break;
}
```

### gotoによる後始末

`goto`は多用すべきではないが、複数のリソースを確保する関数のエラー処理をまとめて書く用途では、ネストを深くせずに済む定番の使い方がある。

```c
int process(const char *path) {
    int ret = -1;

    FILE *fp = fopen(path, "r");
    if (fp == NULL) goto out;

    char *buf = malloc(1024);
    if (buf == NULL) goto close_fp;

    // 処理
    ret = 0;

    free(buf);
close_fp:
    fclose(fp);
out:
    return ret;
}
```

### 繰り返しと制御

| 文 | 説明 |
| --- | --- |
| `break` | 最も内側の`for`/`while`/`do-while`/`switch`を抜ける。 |
| `continue` | 最も内側のループの残りをスキップして、次の繰り返しへ。`for`では更新式が実行される。 |
| `do { } while (cond);` | 条件判定が後ろにあるので、必ず1回は実行される。 |

<span class="label">C99以降</span> では`for (int i = 0; i < n; i++)`のように、`for`の初期化部で変数を宣言できる(変数のスコープは`for`の中だけ)。

### 使えるテクニック

<pre><code class="tips">// いずれかの文を交互に実行する
if (flag)
    // 実行するコード
    flag = 0;
else
    // 実行するコード
    flag = 1;</code></pre>


<pre><code class="tips">// 常に3つのパターンを順番に繰り返す
while (1) {
    switch (count %= 3) {
    case 0:
        // 実行するコード
        break;
    case 1:
        // 実行するコード
        break;
    case 2:
        // 実行するコード
        break;
    }
    count++;
}</code></pre>

<pre><code class="tips">// 複雑な判定を関数に委譲して見通しをよくする
#define TEMP_HIGH   (1 << 0)
#define TEMP_LOW    (1 << 1)
#define HUMID_HIGH  (1 << 2)
#define HUMID_LOW   (1 << 3)

int evaluate_conditions(float temperature, float humidity) {
    int flags = 0;

    if (temperature > 30.0f)
        flags |= TEMP_HIGH;
    else if (temperature < 10.0f)
        flags |= TEMP_LOW;

    if (humidity > 70.0f)
        flags |= HUMID_HIGH;
    else if (humidity < 30.0f)
        flags |= HUMID_LOW;

    return flags;
}

void process_environment(float temperature, float humidity) {
    int flags = evaluate_conditions(temperature, humidity);

    switch (flags) {
        case TEMP_HIGH | HUMID_HIGH:
            printf("⚠️ 暑くて湿度が高いです。熱中症に注意！\n");
            break;
        case TEMP_LOW | HUMID_LOW:
            printf("🥶 寒くて乾燥しています。風邪に注意！\n");
            break;
        case TEMP_HIGH:
            printf("🌡 暑いですが湿度は問題ありません。\n");
            break;
        case TEMP_LOW:
            printf("❄ 寒いですが湿度は普通です。\n");
            break;
        case HUMID_HIGH:
            printf("💧 湿度が高いですが温度は快適です。\n");
            break;
        case HUMID_LOW:
            printf("💨 乾燥していますが温度は快適です。\n");
            break;
        default:
            printf("🙂 快適な環境です。\n");
            break;
    }
}

int main(void) {
    process_environment(35.0f, 75.0f); // 暑くて湿度が高い
    process_environment(5.0f, 25.0f);  // 寒くて乾燥
    process_environment(28.0f, 50.0f); // 快適
    process_environment(33.0f, 40.0f); // 暑い
}</code></pre>

---

## 型 <a id="type" data-name="型"></a>

### 基本型のサイズ

| 型 | 規格上の最小保証 | 一般的なサイズ |
| --- | --- | --- |
| `char` | 8ビット以上(`sizeof(char)`は常に1) | 1バイト |
| `short` | 16ビット以上 | 2バイト |
| `int` | 16ビット以上 | 4バイト |
| `long` | 32ビット以上 | 8バイト(Linux, macOS)、4バイト(Windows) |
| `long long` | 64ビット以上(C99) | 8バイト |
| `float` | - | 4バイト |
| `double` | - | 8バイト |
| `long double` | - | 8～16バイト |

- サイズの大小関係は `short <= int <= long <= long long`。
- 環境に依存しないサイズが必要な場合は、`<stdint.h>`の`int32_t`などを使う。
- `char`、`signed char`、`unsigned char`はそれぞれ別の型。単なる`char`が符号付きか符号なしかは処理系依存。

### 整数拡張と型変換

- 式の中で`int`より小さい整数型(`char`や`short`)は、まず`int`に変換されて計算される(整数拡張)。
- 異なる型どうしの演算では、大きい方の型に揃えられる(通常の算術型変換)。
- 符号付きと符号なしが混ざると、符号付きが符号なしに変換される。

```c
int a = -1;
unsigned int b = 1;
if (a < b) {
    // 偽。aがunsigned intに変換されて非常に大きな値になる
}

5 / 2;    // 2   整数どうしの除算は小数部が切り捨てられる
5 / 2.0;  // 2.5
```

<pre><code class="caution">符号付き整数のオーバーフローは未定義動作。符号なし整数は2のn乗を法として循環する(例: <span class="code-like">UINT_MAX + 1</span> は0)。浮動小数点数を整数に変換すると小数部が切り捨てられ、範囲外の場合は未定義動作となる。</code></pre>

### リテラルの接尾語

| リテラル | 型 |
| --- | --- |
| `10` | `int`(10進数) |
| `012` | `int`(8進数。先頭が0) |
| `0x1F` | `int`(16進数) |
| `10U` | `unsigned int` |
| `10L` | `long` |
| `10LL` | `long long` |
| `1.5` | `double` |
| `1.5f` | `float` |
| `1.5L` | `long double` |
| `'a'` | `int`(C++では`char`) |
| `"abc"` | `char`の配列(書き換え不可) |

### sizeof演算子

型または式のサイズをバイト数(`size_t`型)で返す。配列に対しては配列全体のサイズとなるので、要素数は次のように求める。

```c
int arr[10];
size_t n = sizeof arr / sizeof arr[0]; // 10
```

<pre><code class="caution">関数の引数として受け取った配列はポインタに退化しているため、関数内で<span class="code-like">sizeof</span>しても配列全体のサイズにはならない(ポインタのサイズになる)。</code></pre>

### typedef

既存の型に別名を付ける。構造体や関数ポインタの型を短く書くのによく使われる。

```c
typedef unsigned char byte;
typedef struct { int x; int y; } Point;
typedef int (*BinaryOp)(int, int); // 関数ポインタ型
```

### 型修飾子

| 修飾子 | 説明 |
| --- | --- |
| `const` | 読み取り専用。書き換えようとするとコンパイルエラーになる。 |
| `volatile` | 変数が外部要因(ハードウェアレジスタ、シグナルハンドラなど)で変わる可能性があり、最適化で読み書きを省略してはいけないことを示す。 |
| `restrict` | ポインタが指す領域に、他のポインタからアクセスしないことを約束する(C99)。最適化のヒントとなる。 |

### 記憶域クラス指定子

| 指定子 | 説明 |
| --- | --- |
| `auto` | ローカル変数の既定。通常は書かない。 |
| `static`(ローカル変数) | 関数を抜けても値が保持される。初期化は1回だけで、指定が無ければ0になる。 |
| `static`(グローバル変数・関数) | そのファイルの中だけで見える(内部リンケージ)。 |
| `extern` | 他のファイルで定義された変数や関数を参照する宣言。 |
| `register` | レジスタに置くヒント(現代のコンパイラでは無視される)。`&`でアドレスを取れなくなる。 |

---

## 構造体 <a id="struct" data-name="構造体"></a>

### 定義と使い方

```c
struct Point {
    int x;
    int y;
};

struct Point p = {1, 2};  // 定義順に初期化
p.x = 10;                 // メンバへのアクセス

struct Point *pp = &p;
pp->y = 20;               // ポインタ経由は -> を使う((*pp).y と同じ)
```

`typedef`を使うと`struct`を毎回書かずに済む。

```c
typedef struct {
    int x;
    int y;
} Point;

Point p = {1, 2};
```

<div class="subtitle">指定初期化子 <span class="label">C99</span></div>

メンバ名を指定して初期化できる。指定しないメンバは0になる。

```c
Point p = { .y = 5 }; // xは0
Point q = {0};        // 全メンバを0で初期化する定番の書き方
```

### 代入・比較・関数への受け渡し

- 構造体どうしは`=`で代入(メンバ全体のコピー)できる。関数に値渡しすることもできるが、サイズが大きい場合はポインタで渡す方が効率的。
- `==`で構造体を比較することはできない。メンバごとに比較する。

<pre><code class="caution">パディングバイトの内容は不定なので、構造体を<span class="code-like">memcmp</span>で比較すると、メンバが全て同じでも一致しないことがある。</code></pre>

### 自己参照構造体

自分自身へのポインタをメンバに持つことで、連結リストなどを作れる。

```c
typedef struct Node {
    int value;
    struct Node *next; // typedef名はまだ使えないので struct Node と書く
} Node;
```

### パディングとアラインメント

メンバは、型ごとのアラインメント(配置できるアドレスの制約)に合わせて配置されるため、メンバの間や末尾にパディングが入る。メンバの並び順でサイズが変わる。

```c
struct A { char c; int i; char d; }; // sizeof は 12(4バイトアラインメントの環境)
struct B { int i; char c; char d; }; // sizeof は 8

#include <stddef.h>
offsetof(struct A, i); // 4 メンバの先頭からのオフセット
```

### 柔軟な配列メンバ <span class="label">C99</span>

構造体の最後のメンバとして、要素数を指定しない配列を宣言できる。可変長のデータを1回の`malloc`で確保するのに使う。

```c
struct Buffer {
    size_t len;
    char data[]; // 柔軟な配列メンバ
};

struct Buffer *b = malloc(sizeof *b + n); // 構造体 + n バイト
b->len = n;
```

### ビットフィールド

メンバのビット幅を指定して、複数の値を1つの整数にまとめられる。

```c
struct Flags {
    unsigned int enabled : 1; // 1ビット
    unsigned int mode    : 3; // 3ビット(0～7)
    unsigned int level   : 4; // 4ビット(0～15)
};

struct Flags f = {0};
f.mode = 5;
```

<pre><code class="caution">ビットフィールドのメモリ上の並び順、パディング、符号の扱いは処理系依存。また、メンバのアドレスは取れない。ハードウェアレジスタや通信プロトコルのように、ビット配置が厳密に決まっているものには、ビット演算子でフラグを制御する方が移植性が高い。</code></pre>

---

## 共用体 <a id="union" data-name="共用体"></a>

全てのメンバが同じメモリ領域を共有する型。サイズは最大のメンバのサイズになり、同時に有効なのは最後に書き込んだ1つのメンバだけ。

```c
union Value {
    int i;
    float f;
    char bytes[4];
};

union Value v;
v.i = 1;       // iを書き込んだので、iが有効
v.f = 3.14f;   // 同じ領域をfで上書きする
```

<div class="subtitle">タグ付き共用体</div>

どのメンバが有効かを別の変数(タグ)で管理するのが定番の使い方。

```c
typedef enum { TYPE_INT, TYPE_DOUBLE } Type;

typedef struct {
    Type type;
    union {
        int i;
        double d;
    } u;
} Variant;

Variant x = { .type = TYPE_INT, .u.i = 42 };

if (x.type == TYPE_INT) {
    printf("%d\n", x.u.i);
}
```

<div class="subtitle">エンディアンの確認</div>

```c
union {
    uint32_t u;
    uint8_t b[4];
} x = { .u = 1 };

printf("%s\n", x.b[0] == 1 ? "リトルエンディアン" : "ビッグエンディアン");
```

CではUnionを使った別の型での読み出し(型パンニング)は認められているが、C++では未定義動作となる。

---

---

## 列挙体 <a id="enumeration" data-name="列挙体"></a>

名前付きの整数定数をまとめて定義する。

```c
enum Color { RED, GREEN, BLUE };            // 0, 1, 2
enum Level { LOW = 10, MID = 20, HIGH };    // HIGHは21(直前の値+1)

enum Color c = GREEN;

typedef enum { OFF, ON } Switch;            // typedefで型名を付ける
```

- 列挙定数の型は`int`(C23より前)。
- 列挙定数は、そのスコープ内で他の識別子と衝突するので、`COLOR_RED`のように接頭辞を付けるのが一般的。
- Cでは、`enum`型の変数に範囲外の整数を代入してもエラーにならない(C++では不可)。
- 配列の要素数など、整数定数が必要な箇所に`#define`の代わりとして使える。

```c
enum { BUF_SIZE = 256 };
char buf[BUF_SIZE];
```

<div class="subtitle">列挙値から文字列への変換</div>

指定初期化子を使った配列で、対応表を作れる。

```c
static const char *color_names[] = {
    [RED]   = "red",
    [GREEN] = "green",
    [BLUE]  = "blue",
};

printf("%s\n", color_names[GREEN]); // green
```

---

---

## ポインタ <a id="pointer" data-name="ポインタ"></a>

### ポインタの基本

```c
int x = 10;
int *p = &x;   // pはxのアドレスを保持する
*p = 20;       // 間接参照でxを書き換える(xは20になる)

int *q = NULL; // 何も指していないことを表す
if (q != NULL) { /* 間接参照する前に確認 */ }
```

<pre><code class="caution"><span class="code-like">int* a, b;</span> は、aだけがポインタでbはただの<span class="code-like">int</span>になる。ポインタ変数は1行に1つずつ宣言する。</code></pre>

<div class="subtitle">ポインタ演算と配列</div>

ポインタに整数を加えると、指している型のサイズ分だけ進む。配列名は式の中で先頭要素へのポインタに変換される。

```c
int a[3] = {1, 2, 3};
int *p = a;

*(p + 1); // a[1] と同じ
p[2];     // *(p + 2) と同じ。つまり a[2]
p++;      // 次の要素(int 1つ分、通常4バイト)に進む
```

- 同じ配列を指すポインタどうしの引き算は、要素数の差(`ptrdiff_t`型)になる。
- 配列の範囲外を指すポインタを作ることは、配列の末尾の1つ先を除いて未定義動作。
- 配列とポインタは別物。`sizeof a`は配列全体のサイズ、`sizeof p`はポインタのサイズになる。

<div class="subtitle">voidポインタ</div>

`void *`は任意のオブジェクトへのポインタを保持できる汎用ポインタ。Cではキャスト無しで相互に代入できるが、間接参照やポインタ演算はできない。`malloc`の戻り値や`qsort`の比較関数の引数などに使われる。

<div class="subtitle">ポインタのポインタ</div>

関数の中で、呼び出し側のポインタ変数そのものを変更したい場合に使う。

```c
void alloc_int(int **pp) {
    *pp = malloc(sizeof **pp);
}

int *p = NULL;
alloc_int(&p); // pにmallocした領域のアドレスが入る
```

<div class="subtitle">文字列とポインタ</div>

```c
char a[] = "abc";  // 配列。内容をコピーするので書き換え可能
char *b = "abc";   // 文字列リテラルを指すポインタ。書き換えは未定義動作

a[0] = 'X';        // OK
b[0] = 'X';        // 未定義動作(多くの環境で異常終了)
```

文字列リテラルを指すポインタは`const char *`で受けるのが安全。

### 関数に配列を渡す
C言語では、関数の引数に「配列」を書いても、実際にはポインタとして渡される。これを「配列がポインタに退化する」と言う。<br>
配列がポインタに退化するということは、関数に配列を渡す際は、配列のサイズ(個数)も一緒に渡す必要がある。

<pre><code class="example">void func(char *arr[], size_t size) {
    // 実は → void func(char **arr) と同じ意味
}</code></pre>

### ポインタを使うメリット・デメリット
- C言語の関数は値渡し(変数の値をコピーして渡す)であるため、関数側では渡された変数の値を変更することができない。アドレスを渡すことにより関数側で直接渡された変数の値を書き換えることができるようになる。

- また、値渡しされる場合は値をコピーするという処理があるため、ポインタ渡しに比べて多くのリソースを要する。

- 配列は必ず連続してメモリが確保されるため、関数にポインタを渡すことにより複数の変数を渡すことができる。

- 適切に扱わないとメモリを破壊する恐れがある。

- ポインタを宣言した段階ではポインタがどこを指しているか分らないので必ず初期化する。

### const

| 宣言 | 意味 |
| --- | --- |
| int *p | ポインタ自体も参照先の値も変更可能。 |
| const int *p | ポインタ自体は変更可能。参照先の値は変更不可。 |
| int const *p | ポインタ自体は変更可能。参照先の値は変更不可。 |
| int *const p | ポインタ自体は固定。参照先の値は変更可能(ポインタの初期化が必要)。 |
| const int *const p | ポインタも参照先も固定(共に初期化が必要)。 |

<pre><code class="tips">基本的にconstは左側の値を修飾して、左に値がない場合は右側の値を修飾する。</code></pre>

### 関数ポインタ

関数のアドレスを保持するポインタ。コールバックや処理の切り替えに使う(`qsort`の比較関数が代表例)。

```c
int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }

int (*fp)(int, int) = add; // 戻り値int、引数(int, int)の関数へのポインタ
fp(3, 1);                  // 4(add(3, 1))
fp = sub;
fp(3, 1);                  // 2

// typedefで読みやすくする
typedef int (*BinaryOp)(int, int);
BinaryOp ops[] = { add, sub };
ops[1](10, 4);             // 6
```

---

## プリプロセッサ <a id="preprocessor" data-name="プリプロセッサ"></a>
プリプロセッサディレクティブは、コンパイルの前段階でソースコードに対して特定の処理を行う仕組み。

### `#include`
他のファイルを読み込んで挿入する。

- システム標準のディレクトリから探す<br><span class="code-like">#include &lt;stdio.h&gt;</span>
- カレントディレクトリを優先的に探す<br><span class="code-like">#include "my_header.h"</span>

---

### `#define`
マクロ定義(定数や簡単な関数のようなもの)。

```c
#define PI 3.14159
#define SQUARE(x) ((x)*(x))  // マクロ関数
```

単なる文字列置換なので、副作用に注意が必要。

```c
SQUARE(1 + 2);  // ((1 + 2)*(1 + 2)) = 9 引数を()で囲まないと 1 + 2*1 + 2 = 5 になる
int i = 3;
SQUARE(i++);    // ((i++)*(i++)) iが2回評価され、未定義動作
```

```c
#define DEBUG
```

このようにフラグのように扱うこともできる。

---

### `#undef`
マクロ定義を解除する。

```c
#undef PI
```

---

### 条件付きコンパイル

```c
#ifdef DEBUG // 定義されていれば
    printf("Debug mode\n");
#endif

#ifndef RELEASE // 定義されていなければ
    printf("Not release mode\n");
#endif

#if VERSION == 2
    printf("Version 2\n");
#else
    printf("Other version\n");
#endif
```

複雑な条件式

```c
#define VERSION 2

#if VERSION == 1
    printf("v1\n");
#elif VERSION == 2
    printf("v2\n");
#else
    printf("other\n");
#endif
```

<pre><code class="tips">// 実行するコードを真にして有効化する
#if 0
    // 実行するコード
#elif 1
    // 実行するコード
#else
    // 実行するコード
#endif</code></pre>

---

### defined()
以下の2つは意味的に同じだが、`defined()`は式として評価されるので、`&&`や`||`が使える。

```c
#ifdef DEBUG
    printf("debug mode.\n");
#endif

#if defined(DEBUG)
    printf("debug mode.\n");
#endif
```

```c
#if defined(DEBUG) && !defined(NDEBUG)
    printf("Debug mode without NDEBUG\n");
#endif
```

---

### 複数の文を持つマクロ

複数の文を持つマクロは、`do { ... } while (0)`で囲むのが定番。単に`{ }`で囲むと、`if`文の後ろで使った時に`;`が余ってしまい`else`と対応しなくなる。

```c
#define SWAP(a, b) do { int tmp = (a); (a) = (b); (b) = tmp; } while (0)

if (x > y)
    SWAP(x, y);  // do-whileなら、通常の文と同じように使える
else
    puts("ok");
```

---

### `#error`
条件付きコンパイルと組み合わせて、条件を満たさない場合にコンパイルを止める。

```c
#if !defined(__STDC_VERSION__) || __STDC_VERSION__ < 199901L
#error "C99以降のコンパイラが必要です"
#endif
```

---

### 可変引数マクロ
引数に`...`を指定すると、可変個の引数を受け取れる。可変部は`__VA_ARGS__`で参照する。

```c
#define LOG(fmt, ...) printf("[LOG] " fmt "\n", __VA_ARGS__)

LOG("x = %d, y = %d", x, y);
LOG("hello"); // 可変部が空だと printf("[LOG] hello\n", ) となり、エラー(C23より前)
```

可変部が空の場合にも対応するには、次のような方法がある。

```c
// GCC/Clangの拡張: ##で、可変部が空のときに直前のカンマを消す
#define LOG(fmt, ...) printf("[LOG] " fmt "\n", ##__VA_ARGS__)

// C23(とC++20): __VA_OPT__ は可変部がある時だけ中身を展開する
#define LOG(fmt, ...) printf("[LOG] " fmt "\n" __VA_OPT__(,) __VA_ARGS__)
```

---

### 可変引数関数<br>`<stdarg.h>`
関数でも、`...`で可変個の引数を受け取れる。`printf`がその例。

| 名前 | 説明 |
| --- | --- |
| `va_list` | 可変引数を扱うための型。 |
| `va_start(ap, last)` | 可変引数の読み取りを開始する。lastは`...`の直前の引数。 |
| `va_arg(ap, type)` | 次の引数を、型typeとして取り出す。 |
| `va_end(ap)` | 読み取りを終了する。 |

```c
#include <stdarg.h>

// 先頭のcount個のint引数の合計を返す
int sum(int count, ...) {
    va_list ap;
    va_start(ap, count);

    int total = 0;
    for (int i = 0; i < count; i++) {
        total += va_arg(ap, int);
    }

    va_end(ap);
    return total;
}

sum(3, 10, 20, 30); // 60
```

<pre><code class="caution">可変引数は型情報や個数が失われるので、呼び出し側と呼び出される側で型と個数を一致させる責任がある。<span class="code-like">va_arg</span> の型が実際の引数と一致しないと未定義動作になる。また、<span class="code-like">char</span> や <span class="code-like">float</span> は<span class="code-like">int</span> や <span class="code-like">double</span> に昇格して渡されるので、<span class="code-like">va_arg(ap, char)</span> とは書けない。</code></pre>

---

### 特殊マクロ
特殊マクロは、プリプロセッサが自動的に展開してくれる定義済みマクロで自分で <span class="code-like">#define</span> しなくても最初から使える。

|マクロ|説明|
|---|---|
|`__FILE__`|現在コンパイル中のソースファイル名(文字列リテラル)<br>パス付きになることが多い|
|`__LINE__`|現在のソースコードの行番号(整数リテラル)|
|`__DATE__`|コンパイルした日付(文字列 "Mmm dd yyyy" の形式)|
|`__TIME__`|コンパイルした時刻(文字列 "hh:mm:ss" の形式)|
|`__func__`|関数の名前を表す文字列<br>C99/C++11以降で標準化|

<pre><code class="example">/********** デバッグ出力 **********/
#define DEBUG_PRINT(fmt, ...) \
    fprintf(stderr, "[%s:%d in %s] " fmt "\n", \
            __FILE__, __LINE__, __func__, ##__VA_ARGS__)

void test() {
    DEBUG_PRINT("value = %d", 42);
}</code></pre>

<pre><code class="caution"><span class="code-like">##__VA_ARGS__</span> は可変部が空の時に直前のカンマを消すGCC/Clangの拡張機能。標準C(C23)では <span class="code-like">__VA_OPT__(,)</span> を使う。</code></pre>

---

### #演算子
マクロの引数を文字列に変換する演算子。

```c
#define tostring(value) "value" // 引数を文字列に変換することを意図したが
tostring(hoge); // "value"に置き換わる
```

```c
#define tostring(value) #value
tostring(hoge); // "hoge"に置き換わる
```

<pre><code class="caution">printf("%s\n", tostring("hello")); // 文字列を引数として渡すと
// "\"hello\"" ダブルクォート込みの文字列に変換される</code></pre>

`#`演算子はマクロ定義の中でのみ有効。

マクロの引数がさらにマクロの場合、`#`を直接使うと展開される前の名前が文字列になる。展開した結果を文字列にしたい場合は、マクロを2段階にする。

```c
#define STR(x)  #x
#define XSTR(x) STR(x)  // 先に引数が展開されてからSTRが呼ばれる
#define VERSION 2

STR(VERSION);  // "VERSION"
XSTR(VERSION); // "2"
```

---

### ##演算子
引数を連結することを意図して

```c
#define concat(left, right) leftright
concat(foo, bar); // leftrightに置き換わる
```

このように書くと、引数の`foo, bar`は無視され`leftright`という識別子に置き換わる。

```c
#define concat(left, right) left##right
concat(foo, bar); // foobarに置き換わる
```

`##`を使うと`foobar`という識別子に置き換わる。文字列連結ではなく、識別子や数値といったトークンを作る。

`##`演算子はマクロ定義の中でのみ有効。

---

### `#pragma`
コンパイラに特定の指示を与える(実装依存)

```c
#pragma once  // 多重インクルード防止(標準規格外だが主要なコンパイラが対応している)
```

---

### 多重インクルード防止

```c
#ifndef MY_HEADER_H
#define MY_HEADER_H

// ヘッダーの内容

#endif
```

---

<pre><code class="tips"><span class="code-like">gcc -E ファイル名.c</span> でプリプロセスを展開したものを出力する。</code></pre>

---

## 危険とされるCの標準関数 <a id="dengerous-functions" data-name="危険な関数"></a>

| 関数名     | 問題点                                                       | 代替                                                 |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| gets()     | 入力サイズを制限できない(バッファーオーバーフロー)。         | 使用禁止                                             |
| scanf()    | バッファサイズを指定しないと危険。                           | fgets()+sscanf()など                                 |
| strcpy()   | サイズチェックなしでコピー。                                 | strncpy()('\0'に注意), snprintf(), strlcpy()(非標準) |
| strcat()   | サイズチェックなしで連結。                                   | strncat(), strlcat()(非標準)                         |
| sprintf()  | サイズ制限なしで文字列生成。                                 | snprintf()                                           |
| vsprintf() | 上記と同じ。                                                 | vsnprintf()                                          |
| strlen()   | NULL終端まで探索するため、不正なポインタでクラッシュの恐れ。 | 使い方に注意                                         |
| tmpnam()   | 同名ファイルと競合の危険。                                   | mkstemp()                                            |
| atoi()     | 変換エラーを検出できない("abc"も0になる)。範囲外は未定義。  | strtol()                                             |
| strtok()   | 内部の静的な状態を使うので再入不可。元の文字列を書き換える。 | strtok_r()(POSIX)                                    |
| rand()     | 乱数の品質が低く、規格上の保証も弱い。                       | 用途に応じて別の乱数生成器を使う                     |

---

## 標準入出力<br>`<stdio.h>` <a id="stdio-h" data-name="標準入出力"></a>

### 標準出力への書式付出力<br>`int printf(const char *format, ...);`
引数の内容を、formatで指定する書式文字列に従った変換をしてから標準出力に書き込む。formatの中身の文字(マルチバイト文字も)はそのまま出力されるが、%で始まる変換指定は、それに対応する引数の書式変換に使用される。formatに指定した変換指定の型と引数の型が一致していなかったり、引数の数が不足している場合の動作は未定義。引数の数が変換指定の数より多い場合は、余った引数は評価されるが出力されない。

<div class="subtitle">変換指定の書式</div>

```c
%[フラグ][フィールド幅][.精度][長さ修飾子]型指定子
```

<div class="subtitle">フラグ</div>
<table>
    <tr>
        <th>フラグ</th>
        <th>説明</th>
    </tr>
    <tr>
        <td>-</td>
        <td>フィールド内に左詰めで出力。-を指定しない場合は右詰め。</td>
    </tr>
    <tr>
        <td>+</td>
        <td>数値の前に符号(+/-)を付ける。+を指定しない場合は負値の場合だけ符号がつく。</td>
    </tr>
    <tr>
        <td>空白</td>
        <td>符号付きの変換で、負数には-を、正数には空白を付ける。空白フラグと+フラグの両方指定した場合は空白フラグを無視する。</td>
    </tr>
    <tr>
        <td>#</td>
        <td>数値データに対して指定する。型指定子ごとに意味が異なる。
            <table>
                <tr>
                    <td>o</td>
                    <td style="width: 600px">出力データの前部に0を付ける。</td>
                </tr>
                <tr>
                    <td>x, X</td>
                    <td>出力データの前部に0x, 0Xを付ける。</td>
                </tr>
                <tr>
                    <td>a, A, e, E, f, F, g, G</td>
                    <td>常に小数点を付ける。g, Gでは後続する0も付ける。</td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>0(ゼロ)</td>
        <td>d, i, o, u, x, X, a, A, e, E, f, F, g, Gの場合に出力データの桁がフィールド幅より小さければ0を埋める。0を指定しなければ空白を埋める。符号、基数表示はこの埋められる0に先行して付けられる。0フラグと-フラグを同時に指定した場合は0フラグを無視する。d, i, o ,u, x, Xにおいて精度が指定された場合は0フラグを無視する。</td>
    </tr>
</table>

<div class="subtitle">フィールド幅</div>
フィールド幅には出力するデータの全体の桁数を文字数(バイト数)で指定する。出力データの桁がフィールド幅より小さければ左に空白が埋められる。出力データの桁がフィールド幅より大きければフィールド幅指定は無視され、出力データの桁で出力される。フィールド幅には小数点を示す(.)、指数を示す(e)または(E)、符号を示す(+)または(-)を含める。

<div class="subtitle">.精度</div>
精度を示す整数値。型指定子ごとに意味が異なる。ピリオド(.)のみ指定した場合は.0として扱う。
<table>
    <tr>
        <th>型指定子</th>
        <th style="width: 600px">説明</th>
    </tr>
    <tr>
        <td>d, i, o, u, x, X</td>
        <td>出力する最小桁数。デフォルトで1。指定した最小桁数に満たない数値の前に0が補われる。</td>
    </tr>
    <tr>
        <td>e, E, f, F</td>
        <td>小数点部の桁数。精度を省略すると小数部は6桁で表示。精度を0にすると(#フラグが無ければ)小数点以下(.も含めて)を表示しない。指定した桁数よりデータの桁数が多いときは指定した桁数の次の桁をまるめて表示。</td>
    </tr>
    <tr>
        <td>g, G</td>
        <td>指数表示に切り替える最大有効桁数。デフォルトで6。</td>
    </tr>
    <tr>
        <td>s</td>
        <td>出力する最大文字数。これを超える文字は捨てられる。</td>
    </tr>
</table>

<div class="subtitle">長さ修飾子</div>
型指定子が示す型の長さを指定する。
<table>
    <tr>
        <th>修飾子</th>
        <th style="width: 600px">説明</th>
    </tr>
    <tr>
        <td>h</td>
        <td>d, i, o, u, x, Xに対しshort intまたはunsigned short intであることを明示する。実引数は整数拡張して渡されているので、このデータを表示前にshort intまたはunsigned short intに変換してから表示する。nに対してshort intデータへのポインタであることを明示する。</td>
    </tr>
    <tr>
        <td>hh</td>
        <td>上のhのshort int, unsigned short intをsigned char, unsigned charと読み替えたもの。</td>
    </tr>
    <tr>
        <td>l</td>
        <td>d, i, o, u, x, Xに対しlong intまたはunsigned long intであることを明示する。nに対してlong intデータへのポインタであることを明示する。ISO C99ではcに対しwchar_tへのポインタであることを明示する。</td>
    </tr>
    <tr>
        <td>ll</td>
        <td>d, i, o, u, x, Xに対しlong long intまたはunsigned long long intであることを明示する。nに対してlong long intデータへのポインタであることを明示する。</td>
    </tr>
    <tr>
        <td>L</td>
        <td>a, A, e, E, f, F, g, Gに対しlong doubleであることを明示する。</td>
    </tr>
    <tr>
        <td>j</td>
        <td>d, i, o, u, x, Xに対しintmax_tまたはuintmax_tであることを明示する。nに対してintmax_tへのポインタであることを明示する。ISO C99で追加。</td>
    </tr>
    <tr>
        <td>z</td>
        <td>d, i, o, u, x, Xに対しsize_tであることを明示する。nに対してsize_tへのポインタであることを明示する。ISO C99で追加。</td>
    </tr>
    <tr>
        <td>t</td>
        <td>d, i, o, u, x, Xに対しptrdiff_tであることを明示する。nに対してptrdiff_tへのポインタであることを明示する。ISO C99で追加。</td>
    </tr>
</table>

<div class="subtitle">型指定子</div>
<table>
    <tr>
        <th>指定子</th>
        <th style="width: 600px">説明</th>
    </tr>
    <tr>
        <td>c</td>
        <td>1文字。int値をunsigned charに変換しその結果が表す文字。l(エル)指定があればワイド文字として出力。</td>
    </tr>
    <tr>
        <td>d</td>
        <td>int型の符号付き10進数。</td>
    </tr>
    <tr>
        <td>i</td>
        <td>dと同じ。</td>
    </tr>
    <tr>
        <td>o</td>
        <td>unsigned int型の符号なし8進整数。</td>
    </tr>
    <tr>
        <td>u</td>
        <td>unsigned int型の符号なし10進整数。</td>
    </tr>
    <tr>
        <td>x</td>
        <td>unsigned int型の符号なし16進整数。(小文字で表示: 1f0a)</td>
    </tr>
    <tr>
        <td>X</td>
        <td>unsigned int型の符号なし16進整数。(大文字で表示: 1F0A)</td>
    </tr>
    <tr>
        <td>f, F</td>
        <td>double型の小数点形式の実数(d.dddddd)。精度を省略すると6とみなす。精度が0で#フラグが指定されていない場合は小数点文字を出力しない。小数点文字の前に必ず1桁以上の数字を出力する。精度に合わせて値はまるめられる。無限大、NANを示す値の表示形式は処理系依存。</td>
    </tr>
    <tr>
        <td>e, E</td>
        <td>double型の指数形式の実数(d.dddddde+dd)。Eの場合は指数表記が大文字のEとなる。指数部は最低2桁。値が0の時の指数は00。その他の規則はf, Fと同じ。</td>
    </tr>
    <tr>
        <td>g, G</td>
        <td>精度を超すか指数部が-4より小さい値はe形式で、越さなければf形式で出力。Gの場合はE形式またはF形式で出力。</td>
    </tr>
    <tr>
        <td>a, A</td>
        <td>16進実数(0xh.hhhp+d)。ISO C99で追加。</td>
    </tr>
    <tr>
        <td>s</td>
        <td>文字列。精度を指定しない場合は、文字列の長さが指定したフィールド幅より長い場合でも全文字を出力する。精度を指定するとそれ以上の文字は捨てられる。l(エル)指定があればワイド文字として出力する。</td>
    </tr>
    <tr>
        <td>p</td>
        <td>ポインタデータ。表示形式(例えば16進数形式)は処理系依存。</td>
    </tr>
    <tr>
        <td>n</td>
        <td>%nが来るまでにprintfが出力した文字数を対応する引数に格納する。引数は整数型へのポインタでなければならない。</td>
    </tr>
    <tr>
        <td>zu</td>
        <td>size_t型を表示する際に使う。C99で追加。<br>
            size_tの実装が環境依存なので、%luや%uで代用すると環境によっては型が一致せず未定義動作となる。必ず<code>%zu</code>を使う。<br>
            <code>uint64_t</code>などの固定長整数型は、<code>&lt;inttypes.h&gt;</code>の<code>PRIu64</code>などのマクロを使う(例: <code>"%" PRIu64</code>)。</td>
    </tr>
    <tr>
        <td>%</td>
        <td>書式文字列中で%を出力したいときに%%とする。対応する実引数はない。`\%`と書いても%は出力できない(未定義)。</td>
    </tr>
</table>

<div class="subtitle">*指定</div>
フィールド幅または精度に、整数値ではなくアスタリスク(*)を指定した場合は対応する実引数の値をフィールド幅または精度に使用して出力する。

<pre><code class="example">printf("%*d\n", 5, 123);          // "  123" 幅5
printf("%*.*f\n", 7, 2, 3.14159); // "   3.14" 幅7、精度2</code></pre>

<div class="subtitle2">戻り値</div>
成功なら出力した文字数、失敗なら負値。

---

### ファイルへの書式付出力<br>`int fprintf(FILE *stream, const char *format, ...);`
streamにデータをformatで示す書式で出力する。formatに指定する書式文字列や引数の取り扱いはprintfと同じ。
<div class="subtitle2">戻り値</div>
成功なら出力した文字数、失敗なら負値。

---

### 文字配列への書式付出力<br>`int sprintf(char *s, const char *format, ...);` <span class="warning">非推奨</span>
formatで指定した書式で引数を文字列に変換し、文字配列sに出力する。文字列の最後に'\0'が付加される。文字配列に出力する以外はprintfと同じ。文字列処理を行うのに有用な関数である。sと実引数に指定する領域に重なりがある場合の動作は処理系依存。

<div class="subtitle2">戻り値</div>
成功なら出力した文字数('\0'は含まない)、失敗なら負値。

---

### 文字配列への書式付出力<br>`int snprintf(char *s, size_t size, const char *format, ...);`
sizeにnull文字を含めたバッファサイズを指定する以外はsprintfと同じ。出力がsizeに収まらない場合は、size-1文字で切り詰めて最後に'\0'を付加する(sizeが0なら何も書き込まない)。
<div class="subtitle2">戻り値</div>
成功なら出力した文字数('\0'は含まない)、失敗なら負値。切り詰められなかった場合に出力されたはずの文字数を返すので、戻り値がsize以上なら切り詰められている。

---

### ファイルへの1文字出力<br>`int fputc(int c, FILE *stream);`
streamに文字cをunsigned char型に変換して書き込む。ファイル位置指示子を次の書き込み位置に進める。streamが追加モードでオープンされている場合は常にファイルの終わりに書き込む。
<div class="subtitle2">戻り値</div>
成功なら書き込んだ文字、書き込みエラーならエラー指示子をセットしてEOFを返す。

---

### ファイルへの1文字出力<br>`int putc(int c, FILE *stream);`
fputcと同じ。fputcは関数で実現することを要求されているのに対し、putcはマクロでも関数でもよい。処理スピードを上げたいならputc(ただし関数なら同じ)、マクロの副作用の危険を避けるならfputcを使う。
<div class="subtitle2">戻り値</div>
fputcと同じ。

---

### 標準出力への1文字出力<br>`int putchar(int c);`
標準出力に1文字書き込むこと以外は、fputcと同じ。putchar(c)は、putc(c, stdout)と等価。
<div class="subtitle2">戻り値</div>
fputcと同じ。

---

### 標準出力への文字列の出力<br>`int puts(const char *s);`
標準出力に文字列sを書き込み、さらに改行文字を書き込む。'\0'は書き込まない。fputs(s, stdout)の場合は改行文字を書き込まない。
<div class="subtitle2">戻り値</div>
成功なら正値、書き込みエラーならEOF。

---

### ファイルへの文字列出力<br>`int fputs(const char *s, FILE *stream);`
streamにsで示す文字列を書き込む。文字列の終了を示す'\0'は書き込まない。自動的に改行文字を書き込むことはしない。
<div class="subtitle2">戻り値</div>
成功なら正値、書き込みエラーならEOF。

---

### エラーメッセージの出力<br>`void perror(const char *s);`
errnoに設定されているエラー番号の内容を標準エラー出力に出力する。出力形式は
「sで示すメッセージ、:(コロン)、1つの空白、処理系定義のエラーメッセージ、改行」。

---

### 標準入力からの書式付入力<br>`int scanf(const char *format, ...);` <span class="warning">非推奨</span>
標準入力から、formatで指定する書式文字列に従った変換を行い、引数にデータを読み取る。引数はポインタでなければならない(一般変数には&を付け、配列は配列名を書く)。書式に対し実引数が不足しているときの動作は未定義。余分にある時は余分な実引数の評価は行うがデータ入力は行わない。<br>書式文字列は、変換指定と一般文字で構成される。scanfは書式の先頭から遂次変換指定を解釈し、書式に合わないデータが入力されたり、書式文字が正しくないなどの照合誤りが発生した時点で以後の書式変換は行わずにscanfから戻る。この書式に合わないデータは入力バッファに残る。scanfはfscanfの第1引数にstdinを指定したものと等価である。
<div class="subtitle">変換指定の書式</div>

```c
%[*][フィールド幅][長さ修飾子]型指定子
```

<div class="subtitle">*</div>
代入禁止。*がある変換指定に対応する入力フィールドは読み飛ばされる。
<div class="subtitle">フィールド幅</div>
フィールド幅には入力できる最大文字数(バイト数)を指定する。つまり空白が来なくてもこのフィールド幅でデータを区切って入力を行う。
<div class="subtitle">長さ修飾子</div>
型指定子が示す型の長さを指定する。

<table>
    <tr>
        <th>修飾子</th>
        <th style="width: 600px">説明</th>
    </tr>
    <tr>
        <td>h</td>
        <td>d, i, o, u, x, X, nに対しshort intまたはunsigned short intへのポインタであることを明示する。</td>
    </tr>
    <tr>
        <td>hh</td>
        <td>d, i, o, u, x, X, nに対しsigned charまたはunsigned charへのポインタであることを明示する。</td>
    </tr>
    <tr>
        <td>l</td>
        <td>d, i, o, u, x, X, nに対しlong intまたはunsigned long intへのポインタであることを明示する。a, A, e, E, f, F, g, Gに対しdoubleへのポインタであることを明示する。ISO C99ではc, s, []に対しwchar_tへのポインタであることを明示する。</td>
    </tr>
    <tr>
        <td>ll</td>
        <td>d, i, o, u, x, X, nに対しlong long intまたはunsigned long long intへのポインタであることを明示する。</td>
    </tr>
    <tr>
        <td>L</td>
        <td>a, A, e, E, f, F, g, Gに対しlong doubleへのポインタであることを明示する。</td>
    </tr>
    <tr>
        <td>j</td>
        <td>d, i, o, u, x, X, nに対しintmax_tまたはuintmax_tへのポインタであることを明示する。ISO C99で追加。</td>
    </tr>
    <tr>
        <td>z</td>
        <td>d, i, o, u, x, X, nに対しsize_tへのポインタであることを明示する。ISO C99で追加。</td>
    </tr>
    <tr>
        <td>t</td>
        <td>d, i, o, u, x, X, nに対しptrdiff_tへのポインタであることを明示する。ISO C99で追加。</td>
    </tr>
</table>

<div class="subtitle">型指定子</div>

<table>
    <tr>
        <th>指定子</th>
        <th style="width: 600px">説明</th>
    </tr>
    <tr>
        <td>c</td>
        <td>空白文字を含む文字。フィールド幅を指定すればその数だけ読み、'\0'は付加しない。フィールド幅を指定しなければ1とみなす。対応する引数はchar(unsigned char)へのポインタでなければならない。int型を使用した場合上位バイトに入るデータは未定となる。<br>l修飾されている場合はワイド文字に変換してwchar_t型配列に格納。</td>
    </tr>
    <tr>
        <td>d</td>
        <td>符号付き10進整数。</td>
    </tr>
    <tr>
        <td>i</td>
        <td>符号付き8進、10進、16進整数。先頭が0なら8進数、先頭が0x, 0Xなら16進数、それ以外は10進数とみなして入力。</td>
    </tr>
    <tr>
        <td>o</td>
        <td>符号なし8進整数。先頭に0があっても無くても8進数とみなして入力</td>
    </tr>
    <tr>
        <td>u</td>
        <td>符号なし10進整数。</td>
    </tr>
    <tr>
        <td>x, X</td>
        <td>符号なし16進整数。先頭に0x, 0Xがあっても無くても16進数とみなして入力。</td>
    </tr>
    <tr>
        <td>e, E, f, F, g, G, a, A</td>
        <td>実数(d.dddddd)、(d.dddddde+dd)、(d.ddddddE+dd)。小数部の指定はできないので%8.2fのような指定はできない。規定ではe, f, g, aは同じ扱いと規定されているが、処理系依存する場合がある。aはISO C99対応。</td>
    </tr>
    <tr>
        <td>s</td>
        <td>空白類文字を含まない文字列。'\0'が最後に付加される。空白類文字は入力できず、区切りとして扱われる。l修飾がされている場合はワイド文字に変換してwchar_t型配列に格納。</td>
    </tr>
    <tr>
        <td>n</td>
        <td>%nが来るまでにscanfが入力した文字数を、対応する引数に格納する。引数は整数型へのポインタでなければならない。%nの項はscanfが返す項目数には加算されない。</td>
    </tr>
    <tr>
        <td>p</td>
        <td>ポインタデータ。printfの%p書式で出力される形式(16進数型など)で、処理系依存。</td>
    </tr>
    <tr>
        <td>[]</td>
        <td>文字集合による文字列の入力。'\0'が最後に付加される。文字列として入力できる文字を[]内に指定する。[]内の先頭が^(キャレット)なら[]内に指定した文字以外を指定したことになる。これにより空白も文字列の中に含めて入力することができる。^が先頭でない場合は、それは反転フラグとしてではなく^そのものとして扱われる。
        [と]を文字列に含める場合[はどこに置いてもよいが、]は[の直後か[^の直後にしか置けない。例えば[][()0123456789]は、[, ], (, )と数字文字。
        -(ハイフン)が[]内の文字列の先頭または最後にない場合の解釈は処理系依存。例えば[0-9]をそのまま解釈するか[0123456789]と解釈するか。[-0-9a-f]のような表現が可能な処理系もある。l修飾されている場合はワイド文字に変換してwchar_t型配列に格納。</td>
    </tr>
</table>

<div class="subtitle2">戻り値</div>
変換が1つも行われないまま入力誤りが発生した場合(CTRL+Zなどによる入力終わりの通知があった場合)はEOF、その他の場合は正常に入力できた項目数。先頭データで書式に合わないデータが入力された時は0。

<div class="subtitle">scanfを安全に使うには</div>

- `%s`や`%[]`には、必ずバッファサイズ-1の最大文字数(フィールド幅)を指定する。指定しないと`gets()`と同じバッファオーバーフローが起こる。
- 戻り値を確認して、期待した個数の項目が読み込めたかをチェックする。
- 失敗した入力は入力バッファに残り続けるので、そのままループすると無限ループになりやすい。

```c
char name[32];
int age;

if (scanf("%31s %d", &name[0], &age) != 2) {
    // 読み込み失敗
}
```

行単位で読んでから解析する方が安全。

```c
char line[128];
int age;

if (fgets(line, sizeof line, stdin) != NULL && sscanf(line, "%d", &age) == 1) {
    printf("age = %d\n", age);
}
```

<pre><code class="caution">printfでは`%f`は`double`を受け取り`%lf`でも同じ意味だが、scanfでは`%f`が`float`へのポインタ、`%lf`が`double`へのポインタとなる。`double`に読み込む時に`%f`と書くと誤動作する。</code></pre>

---

### ファイルからの書式付入力<br>`int fscanf(FILE *stream, const char *format, ...);`
streamからformatに従った書式で、データを読み込む。formatに指定する書式文字列や引数の取り扱いはscanfと同じ。
<div class="subtitle2">戻り値</div>
変換が１つも行われないまま入力誤りが発生した場合(CTRL+Zなどによる入力終わりの通知があった場合)はEOF、その他の場合は正常に入力できた項目数。先頭データで書式に合わないデータが入力された時は0。

---

### 文字配列からの書式付入力<br>`int sscanf(const char *s, const char *format, ...);`
文字列sからformatに従った書式でデータを入力する。文字列から入力する以外はscanfと同じ。sと実引数に指定する領域に重なりがある場合の動作は処理系依存。
<div class="subtitle2">戻り値</div>
変換が1つも行われないまま入力誤りが発生した場合(文字列の終わり)はEOF、その他の場合は正常に入力できた項目数。先頭データで書式に合わないデータが入力された時は0。

---

### 標準入力から文字列の入力<br>`char *gets(char *s);` <span class="warning">使用禁止</span>
バッファーオーバーフローの脆弱性があるため使用禁止。C11で規格から削除された。<br>
代わりにfgetsを使う。

---

### ファイルからの文字列入力<br>`char *fgets(char *s, int n, FILE *stream);`
streamから文字列を読み取りsに格納する。読み取りは改行文字に出会ったか、n-1個の文字を読み取るまで行われる。改行文字に出会った場合は、改行文字を含めてsに格納される。長さ制限を超えた場合はそこまでの文字がsに格納され、改行文字は付加されない。文字列の最後に`'\0'`が付加される。
<div class="subtitle2">戻り値</div>
成功ならsへのポインタ、ファイルの終わりあるいはエラーならNULL。ファイルの終わりの場合はsの内容は前の読み取り内容が残るが、エラーの場合sの内容は不定。

<div class="subtitle">改行文字の削除</div>

fgetsは改行文字も読み込むので、不要な場合は取り除く。

```c
buf[strcspn(buf, "\n")] = '\0'; // 改行があればそこを終端にする(<string.h>)
```

---

### ファイルから1文字入力<br>`int fgetc(FILE *stream);`
streamから1文字読み取る。文字はunsigned char型の1バイトとして読み、そのあとint型に変換して返す。ファイル現在位置を次の文字に進める。
<div class="subtitle2">戻り値</div>
成功なら読み取った文字、読み取りエラーまたはファイルの終わりならEOF。読み取りエラーならエラー指示子を、ファイルの終わりならファイル終了指示子をセットしてEOFをセットする。結果がEOFの場合にそれがエラーなのか、ファイルの終わりなのかは各指示子を調べる。

---

### ファイルから1文字入力<br>`int getc(FILE *stream);`
fgetcと同じ。fgetcは関数で実現することを要求されているのに対しgetcはマクロでも関数でもよい。処理スピードを上げたいならgetc(ただし関数なら同じ)、マクロの副作用の危険を避けるならfgetcを使う。
<div class="subtitle2">戻り値</div>
fgetcと同じ。

---

### 標準入力から1文字の入力<br>`int getchar(void);`
標準入力から1文字を読み込むこと以外はfgetcと同じ。getchar()はgetc(stdin)と等価。
<div class="subtitle2">戻り値</div>
標準入力から1文字を読み込むこと以外はfgetcと同じ。

---

### ファイルオープン<br>`FILE *fopen(const char *filename, const char *mode);`
filenameで示すファイル名のファイルをmodeで示すオープンモードで開き、ストリームを結合する。オープンモードを示す文字列には、"a"、"r"、"w"、"+"、"b"の文字を単独あるいは組み合わせて指定する。bを指定するとバイナリストリームとなり、bを指定しないとテキストストリームとなる。r+bとrb+は同じ意味となる。指定文字以外がある場合の動作は処理系依存。

| mode | 読み書きモード | オープン時のファイル位置 | ファイルが存在した場合のファイル作成 | ファイルが存在しなかった場合のファイル作成 |
| ---- | -------------- | ------------------------ | ------------------------------------ | ------------------------------------------ |
| r    | read           | 先頭                     | 何もしない                           | エラーを返す                               |
| w    | write          | 先頭                     | 空ファイルにする                     | 空で作成する                               |
| a    | write          | 終末                     | 何もしない                           | 空で作成する                               |
| r+   | read/write     | 先頭                     | 何もしない                           | エラーを返す                               |
| w+   | read/write     | 先頭                     | 空ファイルにする                     | 空で作成する                               |
| a+   | read/write     | 終末                     | 何もしない                           | 空で作成する                               |

存在しないファイルを読み取りモードでオープンするとエラーとなる。<br>
追加モードでオープンされたファイルに対する書き込みは、fseekなどでファイル現在位置を移動してもその位置ではなく、常にファイル終末に対して行われる。a+でオープンした場合も書き込みは常にファイル終末に行われるが、読み取りはfseekで指定した位置から行える。<br>
バイナリファイルにおいてファイル終末に本データ以外の'\0'のパディングをする処理系では、追加モードでオープンした場合のファイル位置をファイルの終わりを超えた位置に設定する場合がある。<br>
更新モードでは読み書きが行えるが、以下の注意が必要
- 出力の後に入力を行う場合、2つの処理の間にfflushまたはファイル位置付け関数(fseek, fsetpos, rewind)を呼び出さなければならない。
- 入力の後に出力を行う場合、2つの処理の間にファイル位置付け関数(fseek, fsetpos, rewind)を呼び出さなければならない。

オープンしたストリームがコンソール以外の場合はストリームをバッファリングモードで行う。ファイルオープン時に、エラー指示子、ファイル終了指示子はリセットされる。
<div class="subtitle2">戻り値</div>
成功ならFILE構造体へのポインタ(ストリームへのポインタ)、失敗ならNULL。

<span class="label">C11</span> では、モード文字列の末尾に`x`を付けた`"wx"`のように指定すると、既にファイルが存在する場合に失敗する(排他的な作成)。

<div class="subtitle">使用例</div>

```c
FILE *fp = fopen("data.txt", "r");
if (fp == NULL) {
    perror("fopen"); // 失敗したら必ずチェックする
    return 1;
}

char line[256];
while (fgets(line, sizeof line, fp) != NULL) {
    fputs(line, stdout);
}

fclose(fp);
```

---

### ファイルクローズ<br>`int fclose(FILE *stream);`
streamが指すストリームをフラッシュし、ストリームに結合したファイルをクローズする。fcloseにより、出力バッファに残っているデータは書き出され、入力バッファに残っているデータは捨てられる。setbuf、setvbufで割り当てられているバッファをストリームから切り離し、自動的に生成されたバッファを解放する。
オープンしたファイルはユーザの責任でファイルクローズしなければならない。特にライトモードでオープンしてある場合はfcloseしなければ結果は保証されない。
<div class="subtitle2">戻り値</div>
成功なら0、失敗ならEOF。

---

### ファイルへのブロックライト<br>`size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);`
sizeバイトのデータブロックを、nmemb個分格納したptrのデータをstreamに書き込む。ファイル現在位置は書き込みに成功した文字数分進む。エラーの場合のファイルの現在位置は不定。
<div class="subtitle2">戻り値</div>
書き込んだブロックの個数。これがnmembに等しくなければエラーがあったことになる。sizeまたはnmembが0なら書き込みは行わずに0を返す。

---

### ファイルからのブロックリード<br>`size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream);`
streamからsizeバイトのデータブロックをnmemb個、ptrに読み取る。ファイル現在位置を読み取った文字数分進める。エラーの場合のファイル現在位置は不定。
<div class="subtitle2">戻り値</div>
読み取ったブロックの個数。戻り値がnmembではない場合はファイルの終わりになったか、エラーの時である。sizeまたはnmembが0なら読み取りを行わずに0を返す。

---

### ファイル現在位置の移動<br>`int fseek(FILE *stream, long int offset, int whence);`
streamがバイナリストリームの場合、現在位置をwhence位置からoffsetで示すバイト数だけ移動する。offsetが正ならファイルの終末方向へ移動。負ならファイルの先頭方向への移動となる。移動の起点となるwhenceには次の値を指定できる。

| whence   | 意味                 |
| -------- | -------------------- |
| SEEK_CUR | ファイル現在位置から |
| SEEK_END | ファイルの終末から   |
| SEEK_SET | ファイルの先頭から   |

ファイルの終末を越えて後ろへ移動することはできるが、ファイル先頭より前に移動することはできない。バイナリストリームでSEEK_ENDを指定した場合の動作は処理系依存。<br>
streamがテキストストリームの場合は、次の移動のみを規定している。つまりテキストストリームではoffsetに直接の数値を指定できるのは0Lのみで、SEEK_SETの場合だけoffsetにftell(fp)で取得した値のみ指定でき、直接の整数値は指定できない。

<table>
    <tr>
        <th>書き方</th>
        <th>意味</th>
    </tr>
    <tr>
        <td><code>fseek(fp, 0L, SEEK_SET)</code></td>
        <td>ファイル先頭へ移動</td>
    </tr>
    <tr>
        <td>fseek(fp, 0L, SEEK_CUR)</td>
        <td>移動しない</td>
    </tr>
    <tr>
        <td>fseek(fp, ftell(fp), SEEK_SET)</td>
        <td>前に指定した位置に移動</td>
    </tr>
    <tr>
        <td>fseek(fp, 0L, SEEK_END)</td>
        <td>ファイル終末へ移動</td>
    </tr>
</table>

fseekが成功すると、もし直前にungetcが行われていればその動作を解除する。ファイル現在位置は新しい位置に設定される。更新モードのファイルにおいてはfseekの後の入出力動作はどちらも行える。
<div class="subtitle2">戻り値</div>
失敗した場合はエラー指示子をセットし非0を返す。成功した場合の規定はなく処理系依存(通常0)。

---

### ファイル現在位置の取得<br>`long int ftell(FILE *stream);`
streamのファイル現在位置を取得する。バイナリストリームの場合は先頭からファイル現在位置の直前までの文字数となる。テキストストリームの場合は処理系依存。
<div class="subtitle2">戻り値</div>
成功ならファイル現在位置、失敗ならerrnoにエラー番号を設定し、-1Lを返す。ファイルを追加モードで開いた場合のファイル位置は直前読み書き位置であるが、1度も読み書きを行わない状態ならftellは0Lを返す。

---

### ファイルの終わりの検知<br>`int feof(FILE *stream);`
streamがファイルの終わりにあるか調べる。
<div class="subtitle2">戻り値</div>
ファイル終了指示子がセットされていれば非0。規格ではその他の場合は規定されていないが通常0。

<pre><code class="caution">feofは「読み取りに失敗してファイルの終わりに達した後」で初めて真になる。<span class="code-like">while (!feof(fp))</span> でループすると、最後に余計な1回が回ってしまう。ループの条件は読み取り関数の戻り値で判定し、feof/ferrorは終了後に原因を区別するために使う。</code></pre>

```c
while (fgets(line, sizeof line, fp) != NULL) {
    // 処理
}
if (ferror(fp)) {
    perror("read error"); // 読み取りエラーで終了した
}
```

---

### 出力バッファのフラッシュ<br>`int fflush(FILE *stream);`
出力ストリームのバッファに溜まっているデータを書き出す。streamにNULLを指定すると、全ての出力ストリームが対象となる。入力ストリームに対する動作は規格では未定義(`fflush(stdin)`で入力バッファを捨てる方法は標準ではない)。
<div class="subtitle2">戻り値</div>
成功なら0、失敗ならEOF。

---

### ファイル位置の先頭への移動<br>`void rewind(FILE *stream);`
`fseek(stream, 0L, SEEK_SET)`と同じだが、エラー指示子もクリアする。

---

### ファイルの削除<br>`int remove(const char *filename);`
filenameで示すファイルを削除する。オープン中のファイルを削除した場合の動作は処理系依存。
<div class="subtitle2">戻り値</div>
成功なら0、失敗なら非0。

---

### ファイル名の変更<br>`int rename(const char *old, const char *new);`
ファイル名をoldからnewに変更する。newが既に存在する場合の動作は処理系依存(POSIXでは上書きされる)。
<div class="subtitle2">戻り値</div>
成功なら0、失敗なら非0。

---

### 標準入出力とパイプを通じて通信<br>`FILE *popen(const char *command, const char *type);` <span class="label">POSIX</span>
他のプロセスを起動して、その標準入出力と通信する。内部的には`/bin/sh -c`が使われる。commandに実行したいコマンドを指定する。

| type | 意味                         |
| ---- | ---------------------------- |
| "r"  | コマンドの標準出力を読み取る |
| "w"  | コマンドの標準入力に書き込む |

<div class="subtitle2">戻り値</div>
成功した場合は接続されたパイプとのFILE構造体。失敗した場合はNULLが返る。
<div class="subtitle">type = "r"</div>

<pre><code class="example">#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    FILE *fp;
    char buffer[128];

    // "ls -l" を実行してその出力を読み取る
    fp = popen("ls -l", "r");
    if (fp == NULL) {
        perror("popen failed");
        exit(EXIT_FAILURE);
    }

    // 出力を1行ずつ読み込んで表示
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        printf("%s", buffer);
    }

    // パイプを閉じる
    pclose(fp);

    return 0;
}</code></pre>

<div class="subtitle">type = "w"</div>

<pre><code class="example">#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    FILE *fp;

    // "sort"コマンドにデータを送ってソートしてもらう
    fp = popen("sort", "w");
    if (fp == NULL) {
        perror("popen failed");
        exit(EXIT_FAILURE);
    }

    // データを送る
    fprintf(fp, "banana\n");
    fprintf(fp, "apple\n");
    fprintf(fp, "cherry\n");

    // 終了(これで sort の結果が標準出力に表示される)
    pclose(fp);

    return 0;
}</code></pre>

---

### 開かれたパイプを閉じる<br>`int pclose(FILE *fp);` <span class="label">POSIX</span>
popenにより開かれたパイプを閉じる。
<div class="subtitle2">戻り値</div>
子プロセスの終了ステータス。

---

## 一般ユーティリティー <a id="stdlib" data-name="一般ユーティリティー"></a> <br>`<stdlib.h>` 

### メモリ領域の取得<br>`void *malloc(size_t size);`
sizeバイトの要素を動的メモリに割り付ける。callocでは領域を0クリアするが、mallocは領域を0クリアしない。sizeに0を指定した時の動作は処理系依存(失敗としてNULLをかえすのか、0の領域を作ってそのポインタを返すのか)。<br>
取得したメモリへのポインタは、取得したメモリの先頭アドレス(下位アドレス)を指す。取得したメモリはどのようなデータ型でも扱えるように境界調整(アラインメント)されている。取得したメモリの生存期間は、生成されてから解放されるまで。動的メモリ取得関数(malloc, calloc, realloc)を連続して呼び出した時に取得されるメモリの順序と、各ブロックが連続しているかは処理系依存。<br>
動的メモリ取得関数で取得したメモリは不要になったらfreeで解放する。
<div class="subtitle2">戻り値</div>
成功なら取得したメモリへのポインタ、失敗ならNULL。

<div class="subtitle">使用例</div>

```c
int *p = malloc(n * sizeof *p); // sizeof(int)ではなくsizeof *pとすると、型を変えても書き換え不要
if (p == NULL) {
    perror("malloc");           // 失敗したら必ずチェックする
    return 1;
}

// pを使う

free(p);
p = NULL;
```

- CではvoidポインタからのキャストはC++と違い不要(書いても動くが、`#include <stdlib.h>`を忘れた時のエラーを隠してしまう)。
- `n * sizeof *p`の乗算がオーバーフローする可能性がある場合は、チェックされる`calloc`を使う。

---

### 配列領域の取得<br>`void *calloc(size_t nmemb, size_t size);`
sizeバイトの要素をnmemb個、動的メモリに割り付ける。calloc(nmemb, size)はmalloc(nmemb*size)と同じだが取得領域の全てのビットを0で初期化する。<br>
nmembまたはsizeに0を指定した時の、動作及びその他の扱いはmallocと同じ。<br>
nmemb * sizeのオーバーフローを検出して失敗(NULL)を返すので、`malloc(nmemb * size)`より安全。
<div class="subtitle2">戻り値</div>
成功なら取得したメモリへのポインタ、失敗ならNULL。

---

### メモリ領域の再割り付け<br>`void *realloc(void *ptr, size_t size);`
ptrで示す動的メモリを解放し、sizeバイトの新しい動的メモリを割り付ける。前のメモリの内容は、新しいメモリにコピーされる。前のメモリの方が大きい場合は、残った部分はコピーされない。新しいメモリほうが大きい場合は、拡張された部分の内容は不定。<br>
ptrにNULLを指定するとmallocと同じ働きをする。ptrが動的メモリ割り付け関数で取得されたポインタでなかったり、ptrで示す領域がすでに解放されている場合の動作は処理系依存。再割り付けに失敗した場合は前のメモリは解放せずにそのまま残る。再割り付けで新しい領域を割り付けるのか前の領域を拡大・縮小するのかは処理系依存。その他の扱いはmallocに準ずる。
<div class="subtitle2">戻り値</div>
成功なら新しいメモリへのポインタ、失敗ならNULL。

<pre><code class="caution"><span class="code-like">p = realloc(p, size);</span> と書くと、失敗(NULL)した時に元のポインタを見失ってメモリリークになる。一時変数で受けて、成功を確認してから代入する。</code></pre>

```c
int *tmp = realloc(p, new_size * sizeof *p);
if (tmp == NULL) {
    free(p); // pは有効なままなので解放する
    return 1;
}
p = tmp;
```

---

### メモリブロックの解放<br>`void free(void *ptr);`
ptrで示す動的メモリ(malloc, calloc, reallocで取得した)を解放する。ptrが動的メモリ割り付け関数で取得されたポインタでなかったり、ptrで示す領域がすでに解放されている場合の動作は処理系依存。<br>
ptrがNULLの場合は何もしない。

<pre><code class="tips">メモリを解放したらポインタにNULLを代入すると二重解放を防止できる。</code></pre>

---

### 乱数系列の初期化<br>`void srand(unsigned int seed);`
randで得る乱数系列の初期値(種)をseedで設定する。srand((unsigned)time(NULL));とすると、種にシステム時間を使って自動的に与えることができる。srandを呼び出さずにrandを使用した場合、種は1として扱われる。つまりsrand(1)を呼び出したのと同じ。

---

### 整数乱数の発生<br>`int rand(void);`
0～RAND_MAXの範囲の整数乱数を1つ得る。RAND_MAXは32767以上の値と規定されている。randはsrandで種(seed)を与えないと同じ乱数系列(srand(1)と同じ系列)を取る。
<div class="subtitle2">戻り値</div>
0～RAND_MAXの整数乱数。

<div class="subtitle">指定範囲の乱数</div>

```c
srand((unsigned)time(NULL)); // 最初に1回だけ呼ぶ
int dice = rand() % 6 + 1;   // 1～6
```

`rand() % n`は剰余に偏りが出るので、厳密な一様性が必要な用途には向かない。また`rand()`は暗号用途には使えない。

---

### 環境変数の取得<br>`char *getenv(const char *name);`
環境変数リストの中から、nameで示す環境変数の定義値を取得する。得られたポインタが指し示す内容を変更してはいけない。<br>
環境変数は、OSが管理する環境テーブルの中に環境変数リストとして構成されている。<br>
環境変数名の英大小文字が区別されるかは処理系依存。
<div class="subtitle2">戻り値</div>
nameで示す環境変数が見つかれば、それを定義している文字列へのポインタ。見つからなければNULL。

---

### 整数型の絶対値<br>`int abs(int n);`
整数nの絶対値を返す。nに実数を与えた場合、小数点部は捨てられる。絶対値を求める関数は型に応じてabs(int型)、labs(long型)、fabs(double型: math.h)がある。<br>
型に依存しないマクロabsを次のように定義することもできる。

```c
#undef abs
#define abs(x) ((x) >= 0? (x): -(x))
```

このマクロは`x`を2回評価するので、`abs(i++)`のように副作用のある式を渡してはいけない。また、`INT_MIN`の絶対値はintで表現できないので未定義動作となる。

<div class="subtitle2">戻り値</div>
整数値nの絶対値を返す。

---

### プロセスの終了<br>`void exit(int status);`
atexitで登録した関数があれば、それを登録の順序と逆の順序で実行する。次いで出力ストリームをフラッシュし、オープンされているすべてのストリームを閉じ、一時ファイルを削除する。取得している動的メモリを解放するかは処理系依存。その後プログラムを終了し、OSにstatusで示す値を返して戻る。<br>
statusの値が、0またはEXIT_SUCCESSの時はプログラムが正常終了したことを示す。exitがどこに置かれていても(main以外でも)exitが実行されるとプログラムを終了しOSに戻る。<br> 
atexitで設定されている関数でさらにexitを呼び出した場合に、longjmpの動作は処理系依存。

---

### 終了時に呼ぶ関数の登録<br>`int atexit(void (*func)(void));`
exitによる終了時(またはmainからのreturn時)に呼び出される関数を登録する。登録した関数は登録と逆の順序で呼ばれる。少なくとも32個まで登録できる。
<div class="subtitle2">戻り値</div>
成功なら0、失敗なら非0。

---

### プログラムの異常終了<br>`void abort(void);`
プログラムを異常終了させる(`SIGABRT`が発生する)。atexitで登録した関数は呼ばれず、バッファのフラッシュも保証されない。`assert`が失敗した時に呼ばれる。

---

### プログラムの実行<br>`int system(const char *string);`
この関数を呼び出したプロセスを一時停止し、stringで示す別の実行可能プログラムを実行する。実際にはstringはコマンドプロセッサに渡されその上で動作することになる。実行プログラムの終了で元のプロセスに戻り、systemは実行したプログラムが返す値を返す(処理系依存)。
<div class="subtitle2">戻り値</div>
stringにNULLを指定した場合はコマンドプロセッサの存在を調べ、あれば0、なければ非0。その他の場合は処理系依存で例えば、stringで示すプログラムが実行できなかった場合は1、実行できたときはそのプログラムが返す値。

<pre><code class="caution">systemに外部からの入力を含む文字列を渡すと、コマンドインジェクションの脆弱性になる。可能なら避ける。</code></pre>

---

### クイックソート<br><code>void qsort(void *base, size_t nmemb, size_t size, <br>int (*compar)(const void *arg1, const void *arg2));</code>
配列baseのnmemb個のデータをクイックソートアルゴリズムでソートする。ソート結果は配列baseに重ね書きされる。配列のデータ型サイズをsizeに与える。comparは2つのデータを比較するためのユーザが提供する関数へのポインタ。arg1, arg2はbaseの任意の2つのデータへのポインタとする。baseのデータを昇順にソートする場合には、comparの返す値を次のようにする。降順にソートするなら以下と逆な条件にする。

```c
*arg1 < *arg2;  // の場合に負
*arg1 == *arg2; // の場合に0
*arg1 > *arg2;  // の場合に正
```

数値配列を昇順にソートするには、`(a > b) - (a < b)`のように比較する。<br>
文字列へのポインタ配列を昇順にソートするには`return strcmp(*(char **)arg1, *(char **)arg2);`とし、降順にソートするには`return strcmp(*(char **)arg2, *(char **)arg1);`とする。

<pre><code class="caution"><span class="code-like">return a - b;</span> のように引き算で比較関数を書く例がよくあるが、<span class="code-like">int</span> の場合はオーバーフローして誤った結果になる可能性がある。大小比較の結果を返す書き方にする。</code></pre>

<div class="subtitle">使用例</div>

```c
#include <stdlib.h>

int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y); // 昇順
}

int main(void) {
    int arr[] = {5, 2, 9, 1, 7};
    size_t n = sizeof arr / sizeof arr[0];

    qsort(arr, n, sizeof arr[0], cmp_int); // {1, 2, 5, 7, 9}
}
```

---

### 2分探索<br><code>void *bsearch(const void *key, const void *base, size_t nmemb, size_t size, <br>int (*compar)(const void *arg1, const void *arg2));</code>
配列baseのnmemb個のデータの中から、keyで示されるデータを2分探索によりサーチする。配列のデータ型サイズをsizeに与える。comparは2つのデータを比較するためのユーザが提供する関数へのポインタ。arg1はkeyへのポインタ、arg2はbaseの任意のデータへのポインタとする。baseのデータが昇順にソートされていた場合にはcomparの返す値を次のようにする。

```c
*arg1 < *arg2;  // の場合に負
*arg1 == *arg2; // の場合に0
*arg1 > *arg2;  // の場合に正
```

baseのデータが降順ソートされているなら、comparの返す正と負の条件を逆にする。<br>
具体的な作り方はqsortを参照。
<div class="subtitle2">戻り値</div>
見つかればそのデータへのポインタ、一致するものが無ければNULL、2つ以上一致するものがある場合にその中のどのデータへのポインタを返すかは処理系依存。

<div class="subtitle">使用例</div>

```c
int key = 7;
int *found = bsearch(&key, arr, n, sizeof arr[0], cmp_int); // arrはソート済みであること
if (found != NULL) {
    printf("index = %td\n", found - arr);
}
```

---

### 文字列からint値への変換<br>`int atoi(const char *nptr);`
nptrで示す10進数文字列をint値に変換する。(int)strtol(nptr, (char **)NULL, 10)と等価とする。違いはerrnoの設定は行わないこと、変換結果が範囲を超える場合の動作は処理系依存。atolは古いC処理系との互換のために残されている。atolはstrtolで代用できる。
<div class="subtitle2">戻り値</div>
成功なら変換されたint値、失敗なら0(処理系依存)。

---

### 文字列をlong値に変換<br>`long int strtol(const char *nptr, char **endptr, int base);`
nptrで示される整数文字列をlong int値に変換する。文字列中に符号(+, -)、8進数接頭語(0)、16進接頭語(0x, 0X)を含めることができる。U、Lなどの接尾語は認められない。先頭の空白類文字は無視される。整数文字列として認められない文字(baseの値で異なる)が出現した時点で検索をやめ、そこへのポインタをendptrに返し、そこまでの文字でlong int値にする。<br>
endptrが文字列の終わりを示す'\0'であれば文字列を正常に変換できたことを示す。endptrにNULLを指定した場合は変換のみを行う。<br>
baseは文字列を変換するときの基数で、`0`と`2～36`が指定できる(1は指定できない)。baseを0にすると、文字列nptrの先頭が0なら8進、0x、0Xなら16進、それ以外の数字なら10進とみなす。<br>
数字文字は`0～9`と、`10～35`を示す文字のa(A)～z(Z)である。数字文字として認められない文字はbaseで示す進数以上の文字である。例えばbaseが8なら、8以上の文字。
<div class="subtitle2">戻り値</div>
成功なら変換したlong int値、失敗なら0L。変換結果がlong int値で表現できる範囲を超えていれば、LONG_MINまたはLONG_MAX(limits.h)を返し、errnoにERANGEをセットする。

<div class="subtitle">エラーチェックを含めた使用例</div>

```c
#include <errno.h>
#include <stdlib.h>

char *end;
errno = 0;
long v = strtol(str, &end, 10);

if (end == str) {
    // 数字が1つも無かった
} else if (*end != '\0') {
    // 数字の後ろに余計な文字がある
} else if (errno == ERANGE) {
    // long で表現できる範囲を超えた
}
```

---

### 文字列をdouble値に変換<br>`double strtod(const char *nptr, char **endptr);`
nptrで示される浮動小数点数文字列をdouble値に変換する。先頭の空白類文字は無視される。文字列中に符号(+, -)、数値文字(0～9)、小数点(.)、指数(e, E)が数値文字列として認められる。数値文字列として認められない文字が出現した時点で検索をやめ、そこへのポインタをendptrに返し、そこまでの文字でdouble値にする。<br>
endptrが文字列の終わりを示す'\0'であれば文字列を正常に変換できたことを示す。endptrにNULLを指定した場合は変換のみを行う。<br>
符号は仮数、指数部の前に1つ、小数点は仮数部に1つ、指数文字は指数部に1つまでとする。<br>
小数点をどの文字で示すかはロケールに依存する。ISO C99では0x、0Xで始まる16進実数値文字列や"INF"、"NAN"などの文字も扱える。
<div class="subtitle2">戻り値</div>
成功なら変換したdouble値、失敗なら0.0。変換結果がdouble値で表現できる範囲を超えていれば±HUGE_VAL(math.h)を返しerrnoにERANGEをセットする。変換結果がアンダーフローした場合は表現できる最も小さな正の値(通常0.0)を返すが、errnoにERANGEをセットするかどうかは処理系依存。

---

## 文字列・メモリ操作<br>`<string.h>` <a id="string-h" data-name="文字列・メモリ操作"></a>

### 文字列のコピー<br>`char *strcpy(char *d, const char *s);` <span class="warning">非推奨</span>
文字列dに文字列sをコピーする。配列dにはコピーする文字列の長さ+1('\0'の分)の領域が必要。もしsの方が長いと、dの範囲を超えてコピーしてしまうので、周辺領域を破壊してしまう。このような危険を避けるためにはstrncpyを使用する。２つの領域に重なりがある場合の動作は処理系依存。
<div class="subtitle2">戻り値</div>
dへのポインタ。

---

### 長さを指定した文字列のコピー<br>`char *strncpy(char *d, const char *s, size_t n);`
文字配列dに文字列sをコピーする。sの長さがn未満の場合は、sをコピーした後ろに'\0'を全体でnになるまで補う。sの長さがn以上の場合は、sの先頭からn文字目までをコピーし、'\0'を補わない。nに送り先のdの長さ-1を指定すれば、dの領域を超えてコピーすることはないので、strcpyより安全である。<br>
ただし、sの長さがn以上の場合(つまりsの部分文字列をコピーする場合)に、最後に'\0'が付加されないという重大な欠陥があるので、この場合はユーザが補わなければならない。dとsの領域に重なりがある場合の動作は処理系依存。
<div class="subtitle2">戻り値</div>
dへのポインタ。

<div class="subtitle">使用例</div>

```c
char dst[16];
strncpy(dst, src, sizeof dst - 1);
dst[sizeof dst - 1] = '\0'; // 切り詰められた場合に備えて自分で終端する
```

---

### 文字列の連結<br>`char *strcat(char *d, const char *s);` <span class="warning">非推奨</span>
文字列dの文字列の終わりに文字列sを連結する。2つの領域に重なりがある場合の動作は処理系依存。dは文字列として初期化されていなければいけない。
<div class="subtitle2">戻り値</div>
dへのポインタ。

---

### 長さを指定した文字列の連結<br>`char *strncat(char *d, const char *s, size_t n);`
文字配列dの文字列の終末に、文字列sを連結する。sの長さがn未満の場合はsの終わりまで連結する。sの長さがn以上の場合はsのn文字目までを連結する。いずれの場合も最後に１つの'\0'を補う。strncpyの'\0'を補う動作とは異なる。nは連結する文字数の上限であり、dのバッファサイズではない(dの残り容量-1を指定する)。2つの領域に重なりがある場合の動作は処理系依存。dは文字列として初期化されていなければならない。
<div class="subtitle2">戻り値</div>
dへのポインタ。

---

### 文字列の長さの取得<br>`size_t strlen(const char *s);`
文字列sの長さ('\0'は含まない)を符号なし整数値で返す。
<div class="subtitle2">戻り値</div>
文字列の長さ。

---

### 文字列の検索<br>`char *strstr(const char *s, const char *key);`
文字列sの中から文字列keyを探す。
<div class="subtitle2">戻り値</div>
見つかれば最初に見つかった位置へのポインタ、見つからなければNULL。keyが空文字列ならsへのポインタを返す。

---

### 文字列の比較<br>`int strcmp(const char *s1, const char *s2);`
文字列s1とs2の内容を文字コード順で比較する。
<div class="subtitle2">戻り値</div>
s1 < s2なら負の値、s1 == s2なら0、s1 > s2なら正の値。規格では最初に異なる文字の対の値(unsigned charとみなした)の差の符号となっている。strcmp("a", "aa")は'\0'と'a'を比較して負になる。差の値そのもの(-97など)は処理系依存なので、符号だけを判定に使う。

---

### 長さを指定した文字列の比較<br>`int strncmp(const char *s1, const char *s2, size_t n);`
文字列s1とs2の先頭からn文字の内容を文字コード順で比較する。
<div class="subtitle2">戻り値</div>
s1 < s2なら負の値、s1 == s2なら0、s1 > s2なら正の値。

---

### 指定文字の検索<br>`char *strchr(const char *s, int c);`
文字列sの中から文字cを探す。'\0'も文字列の一部として扱う。つまり'\0'をcに指定して検索できる。
<div class="subtitle2">戻り値</div>
見つかれば最初に見つかった文字へのポインタ。見つからなければNULL。

---

### 最後に出現する文字の検索<br>`char *strrchr(const char *s, int c);`
文字列sの中から、最後に出現する文字cを探す。拡張子やパスの区切りを探すのに便利。
<div class="subtitle2">戻り値</div>
見つかれば最後に見つかった文字へのポインタ。見つからなければNULL。

---

### 文字列の分割<br>`char *strtok(char *s, const char *delim);`
文字列sをdelimに含まれる文字を区切りとしてトークンに分割する。最初の呼び出しでsを渡し、続きを取り出すにはsにNULLを渡して呼び出す。
<div class="subtitle2">戻り値</div>
次のトークンへのポインタ。もう無ければNULL。

```c
char str[] = "a,b,c";
for (char *tok = strtok(str, ","); tok != NULL; tok = strtok(NULL, ",")) {
    printf("%s\n", tok);
}
```

<pre><code class="caution">strtokは元の文字列の区切り文字を'\0'に書き換えるので、文字列リテラルには使えない。内部に静的な状態を持つため、複数スレッドや入れ子での使用もできない(スレッドセーフな<span class="code-like">strtok_r</span>はPOSIX)。</code></pre>

---

### メモリブロックの初期化<br>`void *memset(void *s, int c, size_t n);`
sのnバイトを文字cで初期化する。cはunsigned charに変換されて各バイトに設定されるので、`int`配列を`memset(a, 1, sizeof a)`としても各要素が1にはならない(各バイトが0x01になる)。0クリアや-1(0xFF)への初期化に使う。
<div class="subtitle2">戻り値</div>
sへのポインタ。

---

### メモリブロックのコピー<br>`void *memcpy(void *d, const void *s, size_t n);`
sのnバイトの内容をdにコピーする。2つの領域に重なりがある場合の動作は処理系依存。その場合はmemmoveを使う。nには配列の要素数ではなくバイト数を指定する。
<div class="subtitle2">戻り値</div>
dへのポインタ。

---

### メモリブロックの移動<br>`void *memmove(void *d, const void *s, size_t n);`
sのnバイトの内容をdにコピーする。2つの領域が重なっていても正常にコピーできる。memmoveよりmemcpyの方が処理時間は早いが、memcpyは2つの領域が重なっている場合は使えない。2つの領域が重ならないことがはっきりしていればmemcpyを使い、重なる場合はmemmoveを使う。
<div class="subtitle2">戻り値</div>
dへのポインタ。

---

### メモリブロックの比較<br>`int memcmp(const void *s1, const void *s2, size_t n);`
s1とs2のバイト内容を、文字コード順で比較する。
<div class="subtitle2">戻り値</div>
s1 < s2なら負の値、s1 == s2なら0、s1 > s2なら正の値。

---

## 文字の分類と変換<br>`<ctype.h>` <a id="ctype-h" data-name="文字の分類と変換"></a>

### 大文字に変換<br>`int toupper(int c);`
引数が小文字なら大文字に変換し、小文字でなければ変換しない。
<div class="subtitle2">戻り値</div>
変換後の文字。

---

### 小文字に変換<br>`int tolower(int c);`
引数が大文字なら小文字に変換し、大文字でなければ変換しない。
<div class="subtitle2">戻り値</div>
変換後の文字。

---

###  文字種分類関数<br>`int isXXX(int c);`

| 関数     | 機能                                                                                     |
| -------- | ---------------------------------------------------------------------------------------- |
| isalnum  | 数字または英字。                                                                         |
| isalpha  | 英字。                                                                                   |
| islower  | 英小文字。a～z。                                                                         |
| isupper  | 英大文字。A～Z                                                                           |
| isdigit  | 数字。0～9。                                                                             |
| isprint  | 表示文字(空白含む)。0x20～0x7e。                                                         |
| isgraph  | 空白を含まない表示文字。0x21～0x7e。                                                     |
| isspace  | 標準空白類文字(' ', '\t', '\n', '\v', '\f', '\r')。改行含む空白に使う。                  |
| isblank  | 標準ブランク(' ', '\t')。ISO C99で追加。行内の空白に使う。                               |
| iscntrl  | 制御文字(isprintではない文字)。0x00～0x1f, 0x7f。                                        |
| ispunct  | 区切り文字。isspaceまたはisalnumのいずれにも該当しない表示文字。空白文字以外の記号文字。 |
| isxdigit | 16進数字文字。0～9、a～f、A～F。                                                         |

<pre><code class="caution">isXXXやtoupper/tolowerの引数は、<span class="code-like">unsigned char</span>で表現できる値かEOFでなければならない。<span class="code-like">char</span>が負の値を取る環境で、そのまま渡すと未定義動作になるので <span class="code-like">isalpha((unsigned char)c)</span> のようにキャストする。</code></pre>

---

## 数学関数<br>`<math.h>` <a id="math-h" data-name="数学関数"></a>

<pre><code class="tips">GCCでは数学ライブラリがlibmとして分離されているので、リンク時に <span class="code-like">-lm</span> が必要。<br>例: <span class="code-like">gcc main.c -o main -lm</span></code></pre>

### 累乗<br>`double pow(double x, double y);`
<div class="subtitle2">戻り値</div>
xのy乗を返す。xが負でyが小数部のある実数(整数にならない実数)の場合、xが0でy <= 0の場合は定義域エラーとなる。引数の値によって値域エラーとなる場合がある。

---

### 平方根<br>`double sqrt(double x);`
<div class="subtitle2">戻り値</div>
xの平方根(ルート)を返す。xが負なら定義域エラーとなる。

---

### 実数の絶対値<br>`double fabs(double x);`
<div class="subtitle2">戻り値</div>
double値xの絶対値を返す。

---

### 引数を上回らない最大整数<br>`double floor(double x);`
<div class="subtitle2">戻り値</div>
xの小数点部を数直線上で左方向へ切り下げる。ceilは右方向へ切り上げになる。

---

### 引数を下回らない最小整数<br>`double ceil(double x);`
<div class="subtitle2">戻り値</div>
xの小数点部を数直線上で右方向へ切り上げる。floorは左方向へ切り下げになる。

### その他の数学関数

| 関数 | 説明 |
| --- | --- |
| `double round(double x)` | 四捨五入(0から遠い方へ丸める)。C99 |
| `double trunc(double x)` | 小数部の切り捨て(0に近い方へ丸める)。C99 |
| `double fmod(double x, double y)` | x / y の剰余(浮動小数点数版の%)。 |
| `double exp(double x)` | eのx乗。 |
| `double log(double x)` | 自然対数。 |
| `double log10(double x)` | 常用対数。 |
| `double sin(double x)`<br>`double cos(double x)`<br>`double tan(double x)` | 三角関数(引数はラジアン)。 |
| `double atan2(double y, double x)` | y/xの逆正接(ラジアン)。 |
| `double hypot(double x, double y)` | 直角三角形の斜辺(√(x²+y²))。C99 |

---

## 時間操作<br>`<time.h>` <a id="time-h" data-name="時間操作"></a>

### tm構造体

```c
struct tm {
    int tm_sec;   // 秒(0-60) 60は閏秒用
    int tm_min;   // 分(0-59)
    int tm_hour;  // 時(0-23)
    int tm_mday;  // 日(1-31)
    int tm_mon;   // 月(0-11)
    int tm_year;  // 年(年-1900)
    int tm_wday;  // 曜日(0-6)
    int tm_yday;  // 1月1日よりの通し日付け
    int tm_isdst; // 夏時間調整フラグ
    // 夏時間フラグは採用していれば正値、採用していなければ0、この情報が不明の時は負値。
};
```

---

### clock_t型
<div class="subtitle">処理系での定義例</div>

```c
typedef long clock_t;
```

---

### CLOCKS_PER_SEC マクロ
clockの返すプロセッサ時間を秒に変換するためのマクロで、例えば次のように定義されている。CLK_TCKは古い処理系でのマクロ。

```c
#define CLOCKS_PER_SEC 1000000 // Linux
#define CLOCKS_PER_SEC 1000.0  // Windows
#define CLK_TCK 1000.0         // 古い処理系
```

---

### time_t型
<div class="subtitle">処理系での定義例</div>

```c
typedef long time_t;
```

---


### 暦時刻の取得<br>`time_t time(time_t *t);`
暦時刻を取得する。tがNULLでない場合はtにも暦時刻が得られる。
<div class="subtitle2">戻り値</div>
成功ならtime_t暦時刻。失敗なら(time_t)-1。

---

### プロセッサ時間の取得<br>`clock_t clock(void);`
プログラムが使用したプロセッサ時間(CPU時間)を取得する。待機(sleepなど)の時間は含まないので、実時間(経過時間)とは異なる。この値をCLOCKS_PER_SECで割ると秒単位の値に変換できる。例えばCLOCKS_PER_SECが1000.0に定義されている処理系ならclockが返す時間の単位はミリ秒。
<div class="subtitle2">戻り値</div>
プログラムが使用したプロセッサ時間を返す。失敗なら(clock_t)-1を返す。プロセスの開始の時点があいまいなので、プログラムの最初でclockを呼び出し、その差で経過時間を出す方が移植性が高い。

---

### 暦時刻の時間差の計算<br>`double difftime(time_t t1, time_t t0);`
<div class="subtitle2">戻り値</div>
暦時刻の時間差(t1 - t0)を秒で返す。

---

### 地方時間としてtm構造体に変換<br>`struct tm *localtime(const time_t *t);`
time_t時間tを地方時間としてtm構造体型に変換する。localtimeが返す構造体領域は、次のlocaltimeあるいはgmtimeの呼び出しで変更されるので、後で使用したい場合は別領域に保存しておく。スレッドセーフな`localtime_r`(POSIX)や`localtime_s`(Windows)もある。
<div class="subtitle2">戻り値</div>
成功ならtm構造体へのポインタ、失敗ならNULL。

---

### tm構造体からtime_tへの変換<br>`time_t mktime(struct tm *t);`
地方時間のtm構造体をtime_t時間に変換する。tm_wdayとtm_ydayは無視され、変換後に再計算される。tm_monやtm_mdayが範囲外でも正規化されるので、日付の加減算にも使える。
<div class="subtitle2">戻り値</div>
成功ならtime_t時間、表現できなければ(time_t)-1。

---

### 時間文字列の生成<br>`size_t strftime(char *s, size_t maxsize, const char *format, const struct tm *t);`
tm構造体tの時間を、formatで示す書式に従って文字列に変換し、sに格納する。maxsizeは文字列の最大文字数。formatに指定できるのは、%で始まる変換指定と通常のマルチバイト文字である。変換指定は以下の通り。

<div class="subtitle">時間文字列指定時に指定できるフォーマット</div>

| 変換指定子 | 説明                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| %a         | 略称の曜日(Sun: 日)。ロケールに依存。                                                                                          |
| %A         | 曜日(Sunday: 日曜日)。ロケールに依存。                                                                                         |
| %b         | 略称の月(Jan: 1)。ロケールに依存。                                                                                             |
| %B         | 月(January: 1月)。ロケールに依存。                                                                                             |
| %c         | 日付と時刻(07/27/08 13:10:05: 2008/07/27 13:10:05)。ロケールに依存。                                                           |
| %d         | 10進数表記の日(01～31)。                                                                                                       |
| %H         | 24時間制の時間(00～23)。                                                                                                       |
| %I         | 12時間制の時間(01～12)。                                                                                                       |
| %j         | 10進表記の1月1日からの日数(001～366)。                                                                                         |
| %m         | 10進表記の月(01～12)。                                                                                                         |
| %M         | 10進表記の分(00～59)。                                                                                                         |
| %p         | 12時間制の午前/午後(AM/PM: 午前/午後)。ロケールに依存。                                                                        |
| %S         | 10進表記の秒(00～60)。60は閏秒用。                                                                                             |
| %U         | 日曜日を先頭とする週単位で1月の完全に7日ある最初の週をその年の01週、その前の未完の週を00とした10進表記の週の通し番号(00～53)。 |
| %w         | 日曜日を0とした10進数表記の曜日(0～6)。                                                                                        |
| %W         | 月曜日を先頭とする週単位で1月の完全に7日ある最初の週をその年の01週、その前の未完の週を00とした10進表記の週の通し番号(00～53)。 |
| %x         | 日付(07/27/08: 2008/07/27)。ロケールに依存。                                                                                   |
| %X         | 時刻(13:10:05)。ロケールに依存。                                                                                               |
| %y         | 10進表記の西暦の下2桁(00～99)。                                                                                                |
| %Y         | 10進表記の西暦の4桁。                                                                                                          |
| %Z         | タイムゾーン名または略号。                                                                                                     |
| %%         | パーセント記号。                                                                                                               |

<div class="subtitle">以下はISO C99で追加された指定子</div>

| 変換指定子 | 説明                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| %C         | 10進表記の西暦を100で除算し整数に切り捨てた値。つまり上2桁(00～99)。                                       |
| %D         | %m/%d/%yと同じ。                                                                                           |
| %e         | 10進表記の日(1～31)。1桁の場合は前に空白。                                                                 |
| %F         | %Y-%m-%dと同じ。                                                                                           |
| %g         | 暦週に基づく西暦の下2桁(00～99)。                                                                          |
| %G         | 暦週に基づく西暦。                                                                                         |
| %h         | %bと同じ                                                                                                   |
| %n         | 改行                                                                                                       |
| %r         | ロケール依存の12時間制の時刻。                                                                             |
| %R         | %H:%Mと同じ。                                                                                              |
| %t         | 水平タブ。                                                                                                 |
| %T         | %H:%M:%Sと同じ。                                                                                           |
| %u         | JIS X 0301で規定する月曜日を1とする10進表記の曜日(1～7)。                                                      |
| %V         | JIS X 0301で規定する暦週の通し番号(01～53)。                                                               |
| %z         | UTCからの時差をJIS X 0301で規定する文字列にする。例えば"-0430"はUTCとり4時間30分遅れていることを意味する。 |

<div class="subtitle2">戻り値</div>
変換した文字列の長さがmaxsize以下ならその文字数、そうでないなら0を返し配列の内容は不定。

---

## 整数型の制限値<br>`<limits.h>` <a id="limits-h" data-name="整数型の制限値"></a>
整数型が表現できる最小値・最大値を表すマクロ。

| マクロ | 意味 | 規格上の保証 | 一般的な値 |
| --- | --- | --- | --- |
| `CHAR_BIT` | 1バイトのビット数 | 8以上 | 8 |
| `SCHAR_MIN` / `SCHAR_MAX` | `signed char`の範囲 | -127 / 127 | -128 / 127 |
| `UCHAR_MAX` | `unsigned char`の最大値 | 255以上 | 255 |
| `CHAR_MIN` / `CHAR_MAX` | `char`の範囲(符号は処理系依存) | - | -128 / 127(符号付きの場合) |
| `SHRT_MIN` / `SHRT_MAX` | `short`の範囲 | -32767 / 32767 | -32768 / 32767 |
| `USHRT_MAX` | `unsigned short`の最大値 | 65535以上 | 65535 |
| `INT_MIN` / `INT_MAX` | `int`の範囲 | -32767 / 32767 | -2147483648 / 2147483647 |
| `UINT_MAX` | `unsigned int`の最大値 | 65535以上 | 4294967295 |
| `LONG_MIN` / `LONG_MAX` | `long`の範囲 | -2147483647 / 2147483647 | 64ビット環境(LP64)では±9.22×10¹⁸ |
| `ULONG_MAX` | `unsigned long`の最大値 | 4294967295以上 | LP64では1.84×10¹⁹ |
| `LLONG_MIN` / `LLONG_MAX` | `long long`の範囲(C99) | -9223372036854775807 / 9223372036854775807 | 同左(最小値は-9223372036854775808) |
| `ULLONG_MAX` | `unsigned long long`の最大値(C99) | 18446744073709551615以上 | 同左 |

```c
#include <limits.h>

// a + b がオーバーフローするかを、加算する前に判定する
if (b > 0 && a > INT_MAX - b) {
    // オーバーフローする
}
```

---

## 浮動小数点型の制限値<br>`<float.h>` <a id="float-h" data-name="浮動小数点型の制限値"></a>
浮動小数点型の精度や範囲を表すマクロ。`FLT_`が`float`、`DBL_`が`double`、`LDBL_`が`long double`。

| マクロ | 意味 | 一般的な値(IEEE 754) |
| --- | --- | --- |
| `FLT_MAX` / `DBL_MAX` | 表現できる最大の有限値 | 約3.4×10³⁸ / 約1.8×10³⁰⁸ |
| `FLT_MIN` / `DBL_MIN` | 正規化数で表現できる最小の正の値 | 約1.2×10⁻³⁸ / 約2.2×10⁻³⁰⁸ |
| `FLT_EPSILON` / `DBL_EPSILON` | 1.0と、1.0より大きい次の値との差 | 約1.19×10⁻⁷ / 約2.22×10⁻¹⁶ |
| `FLT_DIG` / `DBL_DIG` | 誤差なく保持できる10進の有効桁数 | 6 / 15 |
| `FLT_MANT_DIG` / `DBL_MANT_DIG` | 仮数部のビット数 | 24 / 53 |

浮動小数点数は誤差を持つので、`==`で比較せずに許容誤差を使う。

```c
#include <float.h>
#include <math.h>

// 値の大きさに応じた誤差で比較する
if (fabs(a - b) <= DBL_EPSILON * fmax(fabs(a), fabs(b))) {
    // ほぼ等しい
}
```

<pre><code class="caution">0に近い値どうしの比較や、計算を繰り返して誤差が累積した値の比較には、<span class="code-like">DBL_EPSILON</span> では小さすぎる。用途に応じた絶対誤差・相対誤差を別に決める。</code></pre>

---

## プログラム診断<br>`<assert.h>` <a id="assert-h" data-name="プログラム診断"></a>

### assert
式が偽の場合に、診断メッセージ(式、ファイル名、行番号)を標準エラー出力に出力して`abort()`する。プログラマのバグ(あり得ない状態)の検出に使う。

```c
#include <assert.h>

void process(int *p) {
    assert(p != NULL); // pがNULLならここで異常終了する
}
```

`#include <assert.h>`の前に`#define NDEBUG`を定義する(またはコンパイル時に`-DNDEBUG`を指定する)と、`assert`は何もしなくなる。

<pre><code class="caution">NDEBUGが定義されると式は評価されなくなるので、<span class="code-like">assert(fclose(fp) == 0);</span> のように副作用のある処理を書いてはいけない。また、ユーザー入力やファイルの内容など、実行時に起こり得るエラーの処理に<span class="code-like">assert</span>を使ってはいけない。</code></pre>

### static_assert <span class="label">C11</span>
コンパイル時に条件を検証する。偽ならコンパイルエラーになる。

```c
static_assert(sizeof(int) == 4, "intは4バイトを想定している");
```

---

## 論理型マクロ<br>`<stdbool.h>` <a id="stdbool-h" data-name="論理型マクロ"></a>
C99で追加された論理型`_Bool`を、`bool`、`true`、`false`という名前で使えるようにする。

| 名前 | 内容 |
| --- | --- |
| `bool` | `_Bool`のマクロ |
| `true` | 1 |
| `false` | 0 |

```c
#include <stdbool.h>

bool ok = true;
bool b = 5;   // 0以外は1になる(bの値は1)
```

C23では`bool`、`true`、`false`がキーワードとなり、ヘッダは不要になる。

---

## 汎用マクロ<br>`<stddef.h>` <a id="stddef-h" data-name="汎用マクロ"></a>

| 名前 | 説明 |
| --- | --- |
| `size_t` | `sizeof`の結果やサイズを表す符号なし整数型。 |
| `ptrdiff_t` | ポインタどうしの差を表す符号付き整数型。 |
| `NULL` | ヌルポインタ定数。 |
| `offsetof(type, member)` | 構造体の先頭からメンバまでのオフセット(バイト)。 |
| `wchar_t` | ワイド文字を表す整数型。 |
| `max_align_t` | 最大のアラインメントを持つ型(C11)。 |

```c
#include <stddef.h>

struct S { char c; int i; };
size_t off = offsetof(struct S, i); // 4(多くの環境)
```

---

## 標準整数型<br>`<stdint.h>` <a id="stdint-h" data-name="標準整数型"></a>
サイズが決まった整数型を定義する(C99)。

| 型 | 説明 |
| --- | --- |
| `int8_t`, `int16_t`, `int32_t`, `int64_t` | ちょうどNビットの符号付き整数。 |
| `uint8_t`, `uint16_t`, `uint32_t`, `uint64_t` | ちょうどNビットの符号なし整数。 |
| `int_least32_t`など | N ビット以上で最小の整数型。 |
| `int_fast32_t`など | N ビット以上で最も高速な整数型。 |
| `intptr_t`, `uintptr_t` | ポインタを保持できる整数型。 |
| `intmax_t`, `uintmax_t` | 最大の整数型。 |

最小値・最大値は`INT32_MIN`、`INT32_MAX`、`UINT8_MAX`、`SIZE_MAX`のようなマクロで取得できる。

```c
#include <stdint.h>
#include <inttypes.h>

uint64_t big = 1ULL << 40;
printf("%" PRIu64 "\n", big); // PRIu64はuint64_t用の変換指定(<inttypes.h>)
```

<pre><code class="tips">固定長の整数型(<span class="code-like">int32_t</span>など)は、バイナリファイル形式や通信プロトコル、ハードウェアレジスタのように、サイズが決まっているデータを扱う時に使う。そうでない場合は<span class="code-like">int</span>や<span class="code-like">size_t</span>で十分。</code></pre>

---

## エラーの識別<br>`<errno.h>` <a id="errno-h" data-name="エラーの識別"></a>

| 名前 | 説明 |
| --- | --- |
| `errno` | 直前に失敗した関数が設定するエラー番号(スレッドごとに保持される)。 |
| `EDOM` | 数学関数の定義域エラー。 |
| `ERANGE` | 結果が範囲外(値域エラー)。 |
| `EILSEQ` | 不正なマルチバイト文字列。 |

```c
#include <errno.h>
#include <string.h>

errno = 0;                         // 呼び出す前に0にしておく
long v = strtol(str, &end, 10);
if (errno == ERANGE) {
    fprintf(stderr, "error: %s\n", strerror(errno)); // 番号から文字列を得る
}
```

<pre><code class="caution"><span class="code-like">errno</span> は成功した時に0に戻されない。関数が失敗を示した場合(戻り値がNULLや-1など)にだけ参照する。また、他の関数を呼ぶと値が書き換わるので、必要なら先に保存する。</code></pre>

---

## シグナル操作<br>`<signal.h>` <a id="signal-h" data-name="シグナル操作"></a>

### signal<br>`void (*signal(int sig, void (*handler)(int)))(int);`
シグナルを受け取った時に呼ばれるハンドラ関数を登録する。handlerには関数、`SIG_IGN`(無視)、`SIG_DFL`(既定の動作)を指定できる。

| シグナル | 説明 |
| --- | --- |
| `SIGINT` | 割り込み(Ctrl+C)。 |
| `SIGTERM` | 終了要求。 |
| `SIGSEGV` | 不正なメモリアクセス。 |
| `SIGABRT` | 異常終了(`abort()`)。 |
| `SIGFPE` | 算術エラー(0による整数除算など)。 |
| `SIGILL` | 不正な命令。 |

```c
#include <signal.h>
#include <stdio.h>
#include <unistd.h> // sleep (POSIX)

static volatile sig_atomic_t g_stop = 0;

static void on_sigint(int sig) {
    (void)sig;
    g_stop = 1; // ハンドラ内ではフラグを立てるだけにする
}

int main(void) {
    signal(SIGINT, on_sigint);

    while (!g_stop) {
        sleep(1);
    }
    puts("終了します");
}
```

### raise<br>`int raise(int sig);`
自分自身にシグナルを送る。

<pre><code class="caution">シグナルハンドラの中では、<span class="code-like">printf</span> や <span class="code-like">malloc</span> などの多くの関数が使えない(非同期シグナル安全な関数のみ)。ハンドラとメインの間で共有する変数は <span class="code-like">volatile sig_atomic_t</span> にする。また、<span class="code-like">signal</span> の挙動は処理系依存の部分があるため、POSIX環境では <span class="code-like">sigaction</span> の使用が推奨される。</code></pre>

---

## ジャンプ処理<br>`<setjmp.h>` <a id="setjmp-h" data-name="ジャンプ処理"></a>
`setjmp`で保存した位置へ、`longjmp`で関数をまたいで一気に戻る。深い呼び出しからのエラー脱出などに使われる。

| 名前 | 説明 |
| --- | --- |
| `jmp_buf` | 戻り先の情報を保存する型。 |
| `int setjmp(jmp_buf env)` | 現在位置を保存する。最初の呼び出しでは0を返し、`longjmp`で戻ってきた時はその値(非0)を返す。 |
| `void longjmp(jmp_buf env, int val)` | `setjmp`の位置へ戻り、`setjmp`の戻り値をvalにする(0を渡すと1になる)。 |

```c
#include <setjmp.h>
#include <stdio.h>

static jmp_buf env;

static void fail(void) {
    longjmp(env, 1); // setjmpの位置に戻る
}

int main(void) {
    if (setjmp(env) == 0) {
        fail();
        puts("ここには到達しない");
    } else {
        puts("longjmpで戻ってきた");
    }
}
```

<pre><code class="caution"><span class="code-like">setjmp</span> を呼んだ関数が既に終了(return)している場合に<span class="code-like">longjmp</span>を呼ぶと未定義動作。また、<span class="code-like">setjmp</span> の後で値を変更したローカル変数は、<span class="code-like">volatile</span> でないと<span class="code-like">longjmp</span>後の値が不定となる。<span class="code-like">free</span> されないメモリリークの原因にもなるため、通常は戻り値によるエラー処理を使う。</code></pre>

---

## ロケール<br>`<locale.h>` <a id="locale-h" data-name="ロケール"></a>
国や言語ごとの文字の分類、日付や数値の書式などを切り替える。プログラムの開始時は、最小限の`"C"`ロケールになっている。

```c
#include <locale.h>

setlocale(LC_ALL, "");  // 環境変数(LANGなど)で指定されたロケールを使う
setlocale(LC_ALL, "C"); // 既定のCロケールに戻す
```

| カテゴリ | 影響する範囲 |
| --- | --- |
| `LC_ALL` | 以下の全て。 |
| `LC_COLLATE` | 文字列の照合(`strcoll`)。 |
| `LC_CTYPE` | 文字の分類・変換(`isalpha`など)、マルチバイト文字。 |
| `LC_MONETARY` | 通貨の書式(`localeconv`)。 |
| `LC_NUMERIC` | 小数点文字(`printf`や`strtod`など)。 |
| `LC_TIME` | 日時の書式(`strftime`)。 |

<pre><code class="caution"><span class="code-like">LC_NUMERIC</span> がドイツ語などのロケールだと、小数点がカンマになり、<span class="code-like">printf</span> や <span class="code-like">strtod</span> の結果が変わる。ファイルに書き出す数値などには注意する。</code></pre>

---

## コマンドライン引数 <a id="command-line-arguments" data-name="コマンドライン引数"></a>

<pre><code class="example">#include &lt;stdio.h&gt;

int main(int argc, char *argv[])
{
    printf("引数の数: %d\n", argc);
    for (int i = 0; i < argc; i++)
    {
        printf("argv[%d]: %s\n", i, argv[i]);
    }
    return 0;
}</code></pre>

- `argc`: 引数の数。プログラム名が含まれるため、最低でも1となる。
- `argv`: 引数の文字列配列。
    - `argv[0]`: プログラム名または実行パス。
    - `argv[1]`: 以降はコマンドラインから渡された引数。

<pre><code class="tips">// 引数をintに変換する場合
#include &lt;stdlib.h&gt;

int num = atoi(argv[1]);
printf("入力された数値: %d\n", num);</code></pre>

<pre><code class="caution">atoiは変換エラーを検出できないうえ、<span class="code-like">argv[1]</span> は引数が無い場合に存在しない(<span class="code-like">argv[argc]</span> は NULL)ので、<span class="code-like">argc</span> を確認してから <span class="code-like">strtol</span> で変換してエラーチェックをする。</code></pre>

```c
if (argc < 2) {
    fprintf(stderr, "usage: %s NUMBER\n", argv[0]);
    return 1;
}

char *end;
long num = strtol(argv[1], &end, 10);
if (*end != '\0') {
    fprintf(stderr, "数値ではありません: %s\n", argv[1]);
    return 1;
}
```

<pre><code class="tips">argcはargument count
argvはargument vector(1次元配列)の意味</code></pre>

---

## コメント <a id="comment" data-name="コメント"></a>
- `/* コメント */`<br>複数行も可能
- `// コメント`<br>行末までコメント

<pre><code class="tips">古いC(C89)では//は文法エラーになるので、移植性を強く意識する場合は/* */を使うのが安全。
組み込みや古いC規格を使っている場合は/* */のみを使う。
個人の学習やモダンな環境(GCC, Clang, MSVC)では//をどんどん使ってOK。</code></pre>

---

## メモリ関連のバグ <a id="bug" data-name="メモリ関連のバグ"></a>

- メモリリーク(Memory Leak)<br>
  動的に確保したメモリを解放し忘れることで、使用していないメモリが無駄に残り続ける現象。これは長時間動作するプログラムや、リソース制約のある環境で特に問題となる。

- バッファオーバーフロー(Buffer Overflow)<br>
  確保されたメモリ領域を超えてデータを書き込むことで隣接するメモリ領域が破壊され、予期しない動作やセキュリティの脆弱性を引き起こすことがある。

- ダングリングポインタ(Dangling Pointer)<br>
  解放されたメモリへのポインタを保持したまま使用しようとすることで発生する問題。メモリがすでに他の目的で再利用されている場合、予測できない動作を引き起こす。

- 二重解放(Double Free)<br>
  一度解放したメモリを再び解放しようとすると、メモリ管理システムが不正な状態になり、クラッシュや予期しない動作が発生する可能性がある。

- スタックオーバーフロー(Stack Overflow)<br>
  再帰関数や巨大なローカル変数などによってスタック領域が使い果たされると、スタック領域がオーバーフローしプログラムの異常終了やメモリ破壊が発生する。

- ヒープ破壊(Heap Corruption)<br>
  ヒープ領域内のメモリ管理情報が破壊されることで、メモリの確保や解放が不正な動作を引き起こす問題。ヒープの破壊は非常にデバッグが難しい問題の一つ。

- 未初期化メモリの使用 (Uninitialized Memory)<br>
  メモリを確保した直後にそのまま使用すると、初期化されていないゴミデータが入っている場合がある。これに依存すると不定な挙動を引き起こす。

- 解放後の使用(Use After Free)<br>
  `free`したメモリを読み書きするバグ。ダングリングポインタ経由で起こることが多く、脆弱性の原因として最も多いものの一つ。

- 配列の範囲外アクセス(Out of Bounds)<br>
  配列の添字が範囲を超えて読み書きしてしまうバグ。バッファオーバーフローの原因になる。Cは範囲チェックをしない。

- 戻り値のチェック漏れ<br>
  `malloc`や`fopen`などの失敗(NULL)をチェックせずに使うと、NULLポインタの間接参照で異常終了する。

- 書式文字列の脆弱性(Format String)<br>
  `printf(str)`のようにユーザー入力をそのまま書式文字列にすると、`%s`や`%n`によって任意のメモリを読み書きされる。必ず`printf("%s", str)`と書く。

- 整数オーバーフロー<br>
  `malloc(n * size)`の乗算がオーバーフローして小さな領域が確保され、その後の書き込みでバッファオーバーフローになる。

- メモリの断片化(Memory Fragmentation)<br>
  確保と解放を繰り返すうちにメモリ領域が断片化し、使用可能なメモリが十分にあるにもかかわらず連続した大きなメモリブロックが確保できなくなる現象。

---

## メモリリークのチェック <a id="memory-leaks" data-name="メモリリークのチェック"></a>

このように実行ファイルを実行することでメモリリークをチェックできる。
<pre><code class="example">valgrind --leak-check=full ./program</code></pre>

コンパイル時に`-g`を付けておくと、リークした場所を行番号付きで表示してくれる。

<div class="subtitle">AddressSanitizer</div>

コンパイル時にオプションを付けるだけで、実行時にメモリ破壊(範囲外アクセス、解放後の使用、二重解放など)とメモリリークを検出できる。valgrindより高速。

<pre><code class="example">gcc -g -fsanitize=address -fno-omit-frame-pointer main.c -o main
./main</code></pre>

未定義動作(符号付き整数のオーバーフローなど)を検出するには、`-fsanitize=undefined`を使う。

<pre><code class="example">gcc -g -fsanitize=address,undefined main.c -o main</code></pre>
