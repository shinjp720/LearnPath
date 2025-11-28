---
title: C言語
layout: default
---

# C言語 <a id="top" data-name="TOP"></a>

---

## 演算子 <a id="operator" data-name="演算子"></a>

### 演算子の優先順位

# C言語演算子優先順位表

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
| 2 | + | 正符号。charやshortはintに変換 | ← | 1 |
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
| 12 | \|\| | 論理和 | → | 2 |
| 13 | ?: | 三項演算子 | ← | 3 |
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
    // FLAG_A が 1 のとき@真
}

// 複数ビットをまとめてチェック
if ((flags & (FLAG_A | FLAG_C)) == (FLAG_A | FLAG_C)) {
    // FLAG_A と FLAG_C が両方とも立っている
}</code></pre>
        <pre><code class="example">// FLAG_C を倒す
flags &= ~FLAG_C;</code></pre>
        <pre><code class="example">// あるビットが 0 である
if ((flag & FLAG_A) == 0) {
    FLAG_Aが 0 のとき真
}</code></pre>
        <pre><code class="example">// 上位3ビットが 0b110xxxxx である
if ((flag & 0b00100000) == 0 && (flag & 0b11000000) == 0b11000000) {}
// または
if ((flag & 0b11100000) == 0b11000000) {}
// つまり確認したいビットを1にして&する</code></pre>
        </td><td>x & y</td></tr>
    <tr><td>~</td><td>ビット反転(NOT)</td><td>xの0と1を反転</td><td>~x</td></tr>
    <tr><td><<</td><td>左シフト</td><td>xをn左にシフト。</td><td>x << n</td></tr>
    <tr><td>>></td><td>右シフト</td><td>xをn右にシフト。</td><td>x >> n</td></tr>
    <tr><td>^</td><td>ビット差(XOR)</td><td>2つのビット列を比較して、異なれば1、同じであれば0。 <br>
        ビットをトグルする。
        <pre><code class="example">// flagsのFLAG_Bをトグルする
flags ^= FLAG_B;</code></pre>
        </td><td>x & y</td></tr>
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

#### 応用
<pre><code class="example">#include &lt;stdio.h&gt;

int main(void) {
    unsigned int flags = 0;

    // ビット0, ビット3 を立てる
    SET_BIT(flags, 0);
    SET_BIT(flags, 3);
    // flags == 0b0000_1001 == 9

    // ビット1 をトグル
    TOGGLE_BIT(flags, 1);
    // flags == 0b0000_1011 == 11

    // ビット3 をクリア
    CLEAR_BIT(flags, 3);
    // flags == 0b0000_0011 == 3

    // ビット2 が立っているかチェック
    if (TEST_BIT(flags, 2)) {
        puts("bit 2 is ON");
    } else {
        puts("bit 2 is OFF");  // こちらが出力される
    }

    // 任意のマスクでまとめて操作
    unsigned int mask = (1U << 0) | (1U << 2); // 0,2 ビットのマスク
    SET_MASK(flags, mask);   // 0,2 ビットをまとめて立てる
    // flags == 0b0000_0111 == 7

    CLEAR_MASK(flags, mask); // 0,2 ビットをまとめてクリア
    // flags == 0b0000_0010 == 2

    printf("flags = 0x%X\n", flags);
    return 0;
}</code></pre>

---

## 制御構文 <a id="control-syntax" data-name="制御構文"></a>

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

---

## 構造体 <a id="struct" data-name="構造体"></a>

### ビットフィールド
---

## 共有体 <a id="union" data-name="共有体"></a>

---

## 列挙体 <a id="enumeration" data-name="列挙体"></a>

---

## ポインタ <a id="pointer" data-name="ポインタ"></a>

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

|宣言|意味|
|---|---|
|int *p|ポインタ自体も参照先の値も変更可能。|
|const int *p|ポインタ自体は変更可能。参照先の値は変更不可。|
|int *const p|ポインタ自体は固定。参照先の値は変更可能(ポインタの初期化が必要)。|
|const int *const p|ポインタも参照先も固定(共に初期化が必要)。|

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
以下の2つは

```c
#ifdef DEBUG
    printf("debug mode.\n");
#endif

#if defined(DEBUG)
    printf("debug mode.\n");
#endif
```

意味的に同じだが、`defined()`は式として評価されるので、`&&`や`||`が使える。

```c
#if defined(DEBUG) && !defined(NDEBUG)
    printf("Debug mode without NDEBUG\n");
#endif
```

---

### 可変引数マクロ



---

### 特殊マクロ
特殊マクロは、プリプロセッサが自動的に展開してくれる定義済みマクロで自分で <span class="code-like">#define</span> しなくても最初から使える。

|マクロ|説明|
|---|---|
|`__FILE__`|現在コンパイル中のソースファイル名(文字列リテラル)<br>パス付きになることが多い|
|`__LINE__`|現在のソースコードの行番号(整数リテラル)|
|`__DATA__`|コンパイルした日付(文字列 "Mmm dd yyy" の形式)|
|`__TIME__`|コンパイルした時刻(文字列 "hh:mm:ss" の形式)|
|`__func__`|関数の名前を表す文字列<br>C99/C++11以降で標準化|

<pre><code class="example">/********** デバッグ出力 **********/
#define DEBUG_PRINT(fmt, ...) \
    fprintf(stderr, "[%s:%d in %s] " fmt "\n", \
            __FILE__, __LINE__, __func__, ##__VA_ARGS__)

void test() {
    DEBUG_PRINT("value = %d", 42);
}</code></pre>

---

### #演算子
マクロの引数を文字列に変換する演算子。

```cpp
#define tostring(value) "value" // 引数を文字列に変換することを意図したが
tostring(hoge) // "value"に置き換わる
```

```cpp
#define tostring(value) #value
tostring(hoge) // "hoge"に置き換わる
```

<pre><code class="caution">printf("%s\n", tostring("hello")) // 文字列を引数として渡すと
// "\"hello\"" バッククォート込みの文字列に変換される</code></pre>

`#`演算子はマクロ定義の中でのみ有効。

---

### ##演算子
引数を連結することを意図して

```cpp
#define concat(left, right) leftright
concat(foo, bar) // leftrightに置き換わる
```

このように書くと、引数の`foo, bar`は無視され`leftright`という識別子に置き換わる。

```cpp
#define concat(left, right) left##right
concat(foo, bar) // foobarに置き換わる
```

`##`を使うと`foobar`という識別子に置き換わる。文字列連結ではなく、識別子や数値をといったトークンを作る。

`##`演算子はマクロ定義の中でのみ有効。

---

### `#pragma`
コンパイラに特定の指示を与える(実装依存)

```c
#pragma once  // 多重インクルード防止（モダンな方法）
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

---

## 標準入出力<br>`<stdio.h>` <a id="stdio-h" data-name="標準入出力"></a>

### 標準出力への書式付出力<br>`int printf(const char *format, ...);`
引数の内容を、formatで指定する書式文字列に従った変換をしてから標準出力に書き込む。formatの中身の文字(マルチバイト文字も)はそのまま出力さるが、%で始まる変換指定は、それに対応する引数の書式変換に使用される。formatに指定した変換指定の型と引数の型が一致していなかったり、引数の数が不足している場合の動作は処理系依存。引数の数が変換指定の数より多い場合は、余った引数は評価されるが出力されない。

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
        <td>負数には-を、整数には空白を付ける。空白フラグと+フラグの両方指定した場合は空白フラグを無視する。</td>
    </tr>
    <tr>
        <td>#</td>
        <td>数値データに対して指定する。型指定子ごとに意味が異なる。
            <table>
                <tr>
                    <td>o</td>
                    <td style="width: 600px">出力データの前部に0を付ける。</td>
                </tr>
                    <td>x, X</td>
                    <td>出力データの前部に0x, 0Xを付ける。</td>
                <tr>
                    <td>a, A, e, E, f, F, g, G</td>
                    <td>常に小数点を付ける。g, Gでは後続する0も付ける。</td>
                </tr>
                <tr>
                    <td>0(ゼロ)</td>
                    <td>d, i, o, u, x, X, a, A, e, E, f, F, g, Gの場合に出力データの桁がフィールド幅より小さければ0を埋める。0を指定しなければ空白を埋める。符号、基数表示はこの埋められる0に先行して付けられる。0フラグと-フラグを同時に指定した場合は0フラグを無視する。d, i, o ,u, x, Xにおいて精度が指定された場合は0フラグを無視する。</td>
                </tr>
            </table>
        </td>
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
        <td>e, E, f</td>
        <td>小数点部の桁数。精度を指定しなければ小数部は6桁で表示。精度が0か省略すると小数点以下(.も含めて)を表示しない。指定した桁数よりデータの桁数が多いときは指定した桁数の次の桁をまるめて表示。</td>
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
型指定子が示す方の長さを指定する。
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
        <td>a, A, e, E, f, F, Gに対しlong doubleであることを明示する。</td>
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
            size_tの実装が環境依存なので、%luや%uによる代用は安全ではないのでその場合は<code>uint64_t</code>などを使う。</td>
    </tr>
    <tr>
        <td>%</td>
        <td>書式文字列中で%を出力したいときに%%とする。対応する実引数はない。\%でも同様の結果となる。</td>
    </tr>
</table>

<div class="subtitle">*指定</div>
フィールド幅または精度に、整数値ではなくアスタリスク(*)を指定した場合は対応する実引数の値をフィールド幅または精度に使用して出力する。

<pre><code class="example">printf("%*d\n", 5, 123); // 123
printf("%*.*f\n"7, 2, 3.14159); // 3.14</code></pre>

<div class="return-value">戻り値</div>
成功なら出力した文字数、失敗なら負値。

---

### ファイルへの書式付出力<br>`int fprintf(FILE *stream, const char *format, ...);`
streamにデータをformatで示す書式で出力する。formatに指定する書式文字列や引数の取り扱いはprintfと同じ。
<div class="return-value">戻り値</div>
成功なら出力した文字数、失敗なら負値。

---

### 文字配列への書式付出力<br>`int sprintf(char *s, const char *format, ...);` <span class="warning">非推奨</span>
formatで指定した書式で引数を文字列に変換し、文字配列sに出力する。文字列の最後に'\0'が付加される。文字配列に出力する以外はprintfと同じ。文字列処理を行うのに有用な関数である。sと実引数に指定する領域に重なりがある場合の動作は処理系依存。

<div class="return-value">戻り値</div>
成功なら出力した文字数('\0'は含まない)、失敗なら負値。

---

### 文字配列への書式付出力<br>`int snprintf(char *s, size_t size, const char *format, ...);`
sizeにnull文字を含めたバッファサイズを指定する以外はsprintfと同じ。
<div class="return-value">戻り値</div>
成功なら出力した文字数('\0'は含まない)、失敗なら負値。

---

### ファイルへの1文字出力<br>`int fputc(int c, FILE *stream);`
streamに文字cをunsigned char型に変換して書き込む。ファイル位置指示子を次の書き込み位置に進める。streamが追加モードでオープンされている場合は常にファイルの終わりに書き込む。
<div class="return-value">戻り値</div>
成功なら書き込んだ文字、書き込みエラーならエラー指示子をセットしてEOFを返す。

---

### ファイルへの1文字出力<br>`int putc(int c, FILE *stream);`
fputcと同じ。fputcは関数で実現することを要求されているのに対し、putcはマクロでも関数でもよい。処理スピードを上げたいならputc(ただし関数なら同じ)、マクロの副作用の危険を避けるならfputcを使う。
<div class="return-value">戻り値</div>
fputcと同じ。

---

### 標準出力への1文字出力<br>`int putchar(int c);`
標準出力に1文字書き込むこと以外は、fputcと同じ。putchar(c)は、putc(c, stdout)と等価。
<div class="return-value">戻り値</div>
fputcと同じ。

---

### 標準出力への文字列の出力<br>`int puts(const char *s);`
標準出力に文字列sを書き込み、さらに改行文字を書き込む。'\0'は書き込まない。fputs(s, stdout)の場合は改行文字を書き込まない。
<div class="return-value">戻り値</div>
成功なら正値、書き込みエラーならEOF。

---

### ファイルへの文字列出力<br>`int fputs(char *s, FILE *stream);`
streamにsで示す文字列を書き込む。文字列の終了を示す'\0'は書き込まない。自動的に改行文字を書き込むことはしない。
<div class="return-value">戻り値</div>
成功なら正値、書き込みエラーならEOF。

---

### エラーメッセージの出力<br>`void perror(const char *s);`
errnoに設定されているエラー番号の内容を標準エラー出力に出力する。出力形式は
「sで示すメッセージ、:(コロン)、1つの空白、処理系定義のエラーメッセージ、改行」。

---

### 標準入力からの書式付入力<br>`int scanf(const char *format, ...);` <span class="warning">非推奨</span>
標準入力から、formatで指定する書式文字列に従った変換を行い、引数にデータを読み取る。引数はポインタでなければならない(一般変数には&を付け、配列は配列名を書く)。書式に対し実引数が不足しているときの動作は処理系依存。余分にある時は余分な実引数の評価は行うがデータ入力は行わない。<br>書式文字列は、変換指定と一般文字で構成される。scanfは書式の先頭から遂次変換指定を解釈し、書式に合わないデータが入力されたり、書式文字が正しくないなどの照合誤りが発生した時点で以後の書式変換は行わずにscanfから戻る。この書式に合わないデータは入力バッファに残る。scanfはfscanfの第1引数にstdinを指定したものと等価である。
<div class="subtitle">変換指定の書式</div>

```c
%[*][フィールド幅][長さ修飾子]型指定子
```

<div class="subtitle">*</div>
代入禁止。*がある変換指定に対応する入力フィールドは読み飛ばされる。
<div class="subtitle">フィールド幅</div>
フィールド幅には入力できる最大文字数(バイト数)を指定する。つまり空白が来なくてもこのフィールド幅でデータを区切って入力を行う。
<div class="subtitle">長さ修飾子</div>
型指定子が示す方の長さを指定する。

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
        <td>d, i, o, u, x, X, nに対しlong intまたはunsigned long intへのポインタであることを明示する。a, A, e, E, f, F, Gに対しdoubleへのポインタであることを明示する。ISO C99ではc, s, []に対しwchar_tへのポインタであることを明示する。</td>
    </tr>
    <tr>
        <td>ll</td>
        <td>d, i, o, u, x, X, nに対しlong long intまたはunsigned long long intへのポインタであることを明示する。</td>
    </tr>
    <tr>
        <td>L</td>
        <td>a, A, e, E, f, F, Gに対しlong doubleへのポインタであることを明示する。</td>
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
        <td>p</td>
        <td>ポインタデータ。printfの%p書式で出力される形式(16進数型など)で、処理系依存。</td>
    </tr>
    <tr>
        <td>[]</td>
        <td>文字の入力。'\0'が最後に付加される。文字列として入力できる文字を[]内に指定する。[]内の先頭が^(キャレット)なら[]内に指定した文字以外を指定したことになる。これにより空白も文字列の中に含めて入力することができる。^が先頭出ない場合は、それは反転フラグとしてではなく^そのものとして扱われる。
        [と]を文字列に含める場合[はどこに置いてもよいが、]は[の直後か[^の直後にしか置けない。例えば[][()0123456789]は、[, ], (, )と数字文字。
        -(ハイフン)が[]内の文字列の先頭または最後にない場合の解釈は処理系依存。例えば[0-9]をそのまま解釈するか[0123456789]と解釈するか。[-0-9a-f]のような表現が可能な処理系もある。l修飾されている場合はワイド文字に変換してwchar_t型配列に格納。</td>
    </tr>
</table>

<div class="return-value">戻り値</div>
変換が1つも行われないまま入力誤りが発生した場合(CTRL+Zなどによる入力終わりの通知があった場合)はEOF、その他の場合は正常に入力できた項目数。先頭データで書式に合わないデータが入力された時は0。

---

### ファイルからの書式付入力<br>`int fscanf(FILE *stream, const char *format, ...);`
streamからformatに従った書式で、データを読み込む。formatに指定する書式文字列や引数の取り扱いはscanfと同じ。
<div class="return-value">戻り値</div>
変換が１つも行われないまま入力誤りが発生した場合(CTRL+Zなどによる入力終わりの通知があった場合)はEOF、その他の場合は正常に入力できた項目数。先頭データで書式に合わないデータが入力された時は0。

---

### 文字配列からの書式付入力<br>`int sscanf(const char *s, const char *format, ...);`
文字列sからformatに従った書式でデータを入力する。文字列から入力する以外はscanfと同じ。sと実引数に指定する領域に重なりがある場合の動作は処理系依存。
<div class="return-value">戻り値</div>
変換が1つも行われないまま入力誤りが発生した場合(文字列の終わり)はEOF、その他の場合は正常に入力できた項目数。先頭データで書式に合わないデータが入力された時は0。

---

### 標準入力から文字列の入力<br>`char *gets(char *s);` <span class="warning">使用禁止</span>
バッファーオーバーフローの脆弱性があるため使用禁止。<br>
代わりにfgetsを使う。

---

### ファイルからの文字列入力<br>`char *fgets(char *s, int n, FILE *stream);`
streamから文字列を読み取りsに格納する。読み取りは改行文字に出会ったか、n-1個の文字を読み取るまで行われる。改行文字に出会った場合は、改行文字を含めてsに格納される。長さ制限を超えた場合はそこまでの文字がsに格納され、改行文字は付加されない。文字列の最後に`'\0'`が付加される。
<div class="return-value">戻り値</div>
成功ならsへのポインタ、ファイルの終わりあるいはエラーならNULL。ファイルの終わりの場合はsの内容は前の読み取り内容が残るが、エラーの場合sの内容は不定。

---

### ファイルから1文字入力<br>`int fgetc(FILE *stream);`
streamから1文字読み取る。文字はunsigned char型の1バイトとして読み、そのあとint型に変換して返す。ファイル現在位置を次の文字に進める。
<div class="return-value">戻り値</div>
成功なら読み取った文字、読み取りエラーまたはファイルの終わりならEOF。読み取りエラーならエラー指示子を、ファイルの終わりならファイル終了指示子をセットしてEOFをセットする。結果がEOFの場合にそれがエラーなのか、ファイルの終わりなのかは各指示子を調べる。

---

### ファイルから1文字入力<br>`int getc(FILE *stream);`
fgetcと同じ。fgetcは関数で実現することを要求されているのに対しgetcはマクロでも関数でもよい。処理スピードを上げたいならgetc(ただし関数なら同じ)、マクロの副作用の危険を避けるならfgetcを使う。
<div class="return-value">戻り値</div>
fgetcと同じ。

---

### 標準入力から1文字の入力<br>`int getchar();`
標準入力から1文字を読み込むこと以外はfgetcと同じ。getchar()はgetc(stdin)と等価。
<div class="return-value">戻り値</div>
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
追加モードでオープンされたファイルに対する書き込みは、fseekなどでファイル現在位置を移動してもその位置ではなく、常にファイル終末に対して行われる。a+でオープンした場合はfseekで指定した位置のデータに対して行われる。<br>
バイナリファイルにおいてファイル終末に本データ以外の'\0'のパッティングをする処理系では、追加モードでオープンした場合のファイル位置をファイルの終わりを超えた位置に設定する場合がある。<br>
更新モードでは読み書きが行えるが、以下の注意が必要
- 出力の後に入力を行う場合、2つの処理の間にfflushまたはファイル位置付け関数(fseek, fsetpos, rewind)を呼び出さなければならない。
- 入力の後に出力を行う場合、2つの処理の間にファイル位置付け関数(fseek, fsetpos, rewind)を呼び出さなければならない。

オープンしたストリームがコンソール以外の場合はストリームをバッファリングモードで行う。ファイルオープン時に、エラー指示子、ファイル終了指示子はリセットされる。
<div class="return-value">戻り値</div>
成功ならFILE構造体へのポインタ(ストリームへのポインタ)、失敗ならNULL。

---

### ファイルクローズ<br>`int fclose(FILE *stream);`
streamが指すストリームをフラッシュし、ストリームに結合したファイルをクローズする。fcloseにより、出力バッファに残っているデータは書き出され、入力バッファに残っているデータは捨てられる。setbuf、setvbufで割り当てられているバッファをストリームから切り離し、自動的に生成されたバッファを解放する。
オープンしたファイルはユーザの責任でファイルクローズしなければならない。特にライトモードでオープンしてある場合はfcloseしなければ結果は保証されない。
<div class="return-value">戻り値</div>
成功なら0、失敗ならEOF。

---

### ファイルへのブロックライト<br>`size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);`
sizeバイトのデータブロックを、nmemb個文格納したPtrのデータをstreamに書き込む。ファイル現在位置は書き込みに成功した文字数分進む。エラーの場合のファイルの現在位置は不定。
<div class="return-value">戻り値</div>
書き込んだブロックの個数。これがnmembに等しくなければエラーがあったことになる。sizeまたはnmembが0なら書き込みは行わずに0を返す。

---

### ファイルからのブロックリード<br>`size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream);`
streamからsizeバイトのデータブロックをnmemb個、ptrに読み取る。ファイル現在位置を読み取った文字数文進める。エラーの場合のファイル現在位置は不定。
<div class="return-value">戻り値</div>
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
        <th>a</th>
        <th>b</th>
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
<div class="return-value">戻り値</div>
失敗した場合はエラー指示子をセットし非0を返す。成功した場合の規定はなく処理系依存(通常0)。

---

### ファイル現在位置の取得<br>`long int ftell(FILE *stream);`
streamのファイル現在位置を所得する。バイナリストリームの場合は先頭からファイル現在位置の直前までの文字数となる。テキストストリームの場合は処理系依存。
<div class="return-value">戻り値</div>
成功ならファイル現在位置、失敗ならerrnoにエラー番号を設定し、-1Lを返す。ファイルを追加モードで開いた場合のファイル位置は直前読み書き位置であるが、1度も読み書きを行わない状態ならftellは0Lを返す。

---

### ファイルの終わりの検知<br>`int feof(FILE *stream);`
streamがファイルの終わりにあるか調べる。
<div class="return-value">戻り値</div>
ファイル終了指示子がセットされていれば非0。規格ではその他の場1合は規定されていないが通常0。

---

### 標準入出力とパイプを通じて通信<br>`FILE *popen(const char *command, const char *type);` <span class="label">POSIX</span>
他のプロセスを起動して、その標準入出力と通信する。内部的には`/bin/sh -c`が使われる。commandに実行したいコマンドを指定する。

| type | 意味                         |
| ---- | ---------------------------- |
| "r"  | コマンドの標準出力を読み取る |
| "w"  | コマンドの標準入力に書き込む |

<div class="return-value">戻り値</div>
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
<div class="return-value">戻り値</div>
子プロセスの終了ステータス。

---

## 一般ユーティリティー <a id="stdlib" data-name="一般ユーティリティー"></a> <br>`<stdlib.h>` 

### メモリ領域の取得<br>`void *malloc(size_t size);`
sizeバイトの要素を動的メモリに割り付ける。callocでは領域を0クリアするが、mallocは領域を0クリアしない。sizeに0を指定した時の動作は処理系依存(失敗としてNULLをかえすのか、0の領域を作ってそのポインタを返すのか)。<br>
取得したメモリへのポインタは、取得したメモリの先頭アドレス(下位アドレス)を指す。取得したメモリはどのようなデータ型でも扱えるように境界調整(アラインメント)されている。取得したメモリの生存期間は、生成されてから解放されるまで。動的メモリ取得関数(malloc, calloc, realloc)を連続して呼び出した時に取得されるメモリの順序と、各ブロックが連続しているかは処理系依存。<br>
動的メモリ取得関数で取得したメモリは不要になったらfreeで解放する。
<div class="return-value">戻り値</div>
成功なら取得したメモリへのポインタ、失敗ならNULL。

---

### 配列領域の取得<br>`void *calloc(size_t nmemb, size_t size);`
sizeバイトの要素をnmemb個、動的メモリに割り付ける。calloc(nmemb, size)はmalloc(nmemb*size)と同じだが取得領域の全てのビットを0で初期化する。<br>
nmembまたはsizeに0を指定した時の、動作及びその他の扱いはmallocと同じ。
<div class="return-value">戻り値</div>
成功なら取得したメモリへのポインタ、失敗ならNULL。

---

### メモリ領域の再割り付け<br>`void *realloc(void *ptr, size_t size);`
ptrで示す動的メモリを解放し、sizeバイトの新しい動的メモリを割り付ける。前のメモリの内容は、新しいメモリにコピーされる。前のメモリの方が大木場合は、残った部分はコピーされない。新しいメモリほうが大きい場合は、拡張された部分の内容は不定。<br>
ptrにNULLを指定するとmallocと同じ働きをする。ptrが動的メモリ割り付け関数で取得されたポインタでなかったり、ptrで示す領域がすでに解放されている場合の動作は処理系依存。再割り付けに失敗した場合は前のメモリは解放せずにそのまま残る。再割り付けで新しい領域を割り付けるのか前の領域を拡大・縮小するのかは処理系依存。その他の扱いはmallocに準ずる。
<div class="return-value">戻り値</div>
成功なら新しいメモリへのポインタ、失敗ならNULL。

---

### メモリブロックの開放<br>`void free(void *ptr);`
ptrで示す動的メモリ(malloc, calloc, reallocで取得した)を解放する。ptrが動的メモリ割り付け関数で取得されたポインタでなかったり、ptrで示す領域がすでに解放されている場合の動作は処理系依存。<br>
ptrがNULLの場合は何もしない。

---

### 乱数系列の初期化<br>`void srand(unsigned int seed);`
randで得る乱数系列の初期値(種)をseedで設定する。srand((unsigned)time(NULL));とすると。種にシステム時間を使って自動的に与えることができる。srandを呼び出さずにrandを使用した場合、種は1として扱われる。つまりsrand(1)を呼び出したのと同じ。

---

### 整数乱数の発生<br>`int rand(void);`
0～RAND_MAXの範囲の整数乱数を1つ得る。RAND_MAXは32767以上の値と規定されている。randはsrandで種(seed)を与えないと同じ乱数系列(srand(1)と同じ系列)を取る。
<div class="return-value">戻り値</div>
0～RAND_MAXの整数乱数。

---

### 環境変数の取得<br>`char *getenv(const char *name);`
環境変数リストの中から、nameで示す環境変数の定義値を取得する。得られたポインタが指し示す内容を変更してはいけない。<br>
環境変数は、OSが管理する環境テーブルの中に環境変数リストとして構成されている。<br>
環境変数名の英大小文字が区別されるかは処理系依存。
<div class="return-value">戻り値</div>
nameで示す環境変数が見つかれば、それを定義している文字列へのポインタ。見つからなければNULL。

---

### 整数型の絶対値<br>`int abs(int n);`
整数nの絶対値を返す。nに実数を与えた場合、小数点部は捨てられる。絶対値を求める関数は型に応じてabs(int型)、labs(long型)、fabs(double型: math.h)がある。<br>
型に依存しないマクロabsを次のように定義することもできる。

```c
#undef abs
#define abs(x) ((x) >= 0? (x): -(x))
```

<div class="return-value">戻り値</div>
整数値nの絶対値を返す。

---

### プロセスの終了<br>`void exit(int status);`
atexitで登録した関数があれば、それを登録の順序と逆の順序で実行する。次いで出力ストリームをフラッシュし、オープンされているすべてのストリームを閉じ、一時ファイルを削除する。取得している動的メモリを解放するかは処理系依存。その後プログラムを終了し、OSにstatusで示す値を返して戻る。<br>
statusの値が、0またはEXIT_SUCCESSの時はプログラムが正常終了したことを示す。exitがどこに置かれていても(main以外でも)exitが実行されるとプログラムを終了しOSに戻る。<br> 
atexitで設定されている関数でさらにexitを呼び出した場合に、longjmpの動作は処理系依存。

---

### プログラムの実行<br>`int system(const char *string);`
この関数を呼び出したプロセスを一時停止し、stringで示す別の実行可能プログラムを実行する。実際にはstringはコマンドプロセッサに渡されその上で動作することになる。実行プログラムの終了で元のプロセスに戻り、systemは実行したプログラムが返す値を返す(処理系依存)。
<div class="return-value">戻り値</div>
stringにNULLを指定した場合はコマンドプロセッサの存在を調べ、あれば0、なければ非0。その他の場合は処理系依存で例えば、stringで示すプログラムが実行できなかった場合は1、実行できたときはそのプログラムが返す値。

---

### クイックソート<br><code>void qsort(void *base, size_t nmemb, size_t, <br>int (*compar)(const void *arg1, const void *arg2));</code>
配列baseのnmemb個のデータをクイックソートアルゴリズムでソートする。ソート結果は配列baseに重ね書きされる。配列のデータ型サイズをsizesに与える。comparは2つのデータを比較するためのユーザが提供する関数へのポインタ。arg1はkeyへのポインタ。arg2はbaseの任意データへのポインタとする。baseのデータを昇順にソートする場合には、comparの返す値を次のようにする。降順にソートするなら以下と逆な条件にする。

```c
*arg1 < *arg2;  // の場合に負
*arg1 == *arg2; // の場合に0
*arg1 > *arg2;  // の場合に正
```

例えば、数値配列を昇順にソートするには、`return *(型 *)arg1 - *(型 *)arg2;`とし、降順にソートするには`return *(型 *)arg2 - *(型 *)arg1;`とする。<br>
文字列へのポインタ配列を昇順にソートするには`return strcmp(*(char **))arg1, *(char **))arg2)`とし、降順にソートするには`return strcmp(*(char **))arg2, *(char **))arg1)`とする。

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
<div class="return-value">戻り値</div>
見つかればそのデータへのポインタ、一致するものが無ければNULL、2つ以上一致するものがある場合にその中のどのデータへのポインタを返すかは処理系依存。

---

### 文字列からint値への変換<br>`int atoi(const char *nptr);`
nptrで示す10進数文字列をint値に変換する。(int)strtol(nptr, (char **)NULL, 10)と等価とする。違いはerrnoの設定は行わないこと、変換結果が範囲を超える場合の動作は処理系依存。atolは古いC処理系との互換のために残されている。atolはstrtolで代用できる。
<div class="return-value">戻り値</div>
成功なら変換されたint値、失敗なら0(処理系依存)。

---

### 文字列をlong値に変換<br>`long int strtol(const char *nptr, char **endptr, int base);`
nptrで示される整数文字列をlong int値に変換する。文字列中に符号(+, -)、8進数接頭語(0)、16進接頭語(0x, 0X)を含めることができる。U、Lなどの接尾語は認められない。先頭の空白類文字は無視される。整数文字列として認められない文字(baseの値で異なる)が出現した時点で検索をやめ、そこへのポインタをendptrに返し、そこまでの文字でlong int値にする。<br>
変換結果がオーバーフローすればオーバーフローした分が捨てられる。endptrが文字列の終わりを示す'\0'であれば文字列を正常に変換できたことを示す。endptrにNULLを指定した場合は変換のみを行う。<br>
baseは文字列を変換するときの基数で、`0～36`が指定できる。baseを0にすると、文字列nptrの先頭が0なら8進、0x、0Xなら16進、それ以外の数字なら10進とみなす。baseが1のときは数字文字は0だけを認める(事実上意味を持たない)。<br>
数字文字は`0～9`と、`10～35`を示す文字のa(A)～z(Z)である。数字文字として認められない文字はbaseで示す進数以上の文字である。例えばbaseが8なら、8以上の文字。
<div class="return-value">戻り値</div>
成功なら変換したlong int値、失敗なら0L。変換結果がlong int値で表現できる範囲を超えていれば、LONG_MIN_MAX(limits.h)を返し、errnoにERANGEをセットする。

---

### 文字列をdouble値に変換<br>`double strtod(const char *nptr, char **endptr);`
nptrで示される浮動小数点数文字列をdouble値に変換する。先頭の空白類文字は無視される。文字列中に符号(+, -)、数値文字(0～9)、小数点(.)、指数(e, E)が数値文字列として認められる。数値文字列として認められない文字が出現した時点で検索をやめ、そこへのポインタをendptrに返し、そこまでの文字でdouble値にする。<br>
endptrが文字列の終わりを示す'\0'であれば文字列を正常に変換できたことを示す。endptrにNULLを指定した場合は変換のみを行う。<br>
符号は仮数、指数部の前に1つ、小数点は仮数部に1つ、指数文字は指数部に1つまでとする。<br>
小数点をどの文字で示すかはロケールに依存する。ISO C99では0x、0Xで始まる16進実数値文字列や"INF"、"NANなどの文字も扱える。
<div class="return-value">戻り値</div>
成功なら変換したdouble値、失敗なら0.0。変換結果がdouble値で表現できる範囲を超えていれば±HUGE_VAL(math.h)を返しerrnoにERANGEをセットする。変換結果がアンダーフローした場合は表現できる最も小さな正の値(通常0.0)を返すが、errnoにERANGEをセットするかどうかは処理系依存。

---

## 文字列・メモリ操作<br>`<string.h>` <a id="string-h" data-name="文字列・メモリ操作"></a>

### 文字列のコピー<br>`char *strcpy(char *d, const *s);` <span class="warning">非推奨</span>
文字列dに文字列sをコピーする。配列dにはコピーする文字列の長さ+1('\0'の分)の領域が必要。もしsの方が長いと、dの範囲を超えてコピーしてしまうので、周辺領域を破壊してしまう。このような危険を避けるためにはstrncpyを使用する。２つの領域に重なりがある場合の動作は処理系依存。
<div class="return-value">戻り値</div>
dへのポインタ。

---

### 長さを指定した文字列のコピー<br>`char *strncpy(char *d, const char *s, size_t n);`
文字配列dに文字列sをコピーする。sの長さがn未満の場合は、sをコピーした後ろに'\0'を全体でnになるまで補う。sの長さがn以上の場合は、sの先頭からn文字目までをコピーし、'\0'を補わない。nに送り先のdの長さ-1を指定すれば、dの領域を超えてコピーすることはないので、strcpyより安全である。<br>
ただし、sの長さがn以上の場合(つまりsの部分文字列をコピーする場合)に、最後に'\0'が付加されないという重大な欠陥があるので、この場合はユーザが補わなければならない。dとsの領域に重なりがある場合の動作は処理系依存。
<div class="return-value">戻り値</div>
dへのポインタ。

---

### 文字列の連結<br>`char *strcat(char *d, const char *s);` <span class="warning">非推奨</span>
文字列dの文字列の終わりに文字列sを連結する。2つの領域に重なりがある場合の動作は処理系依存。dは文字列として初期化されていなければいけない。
<div class="return-value">戻り値</div>
dへのポインタ。

---

### 長さを指定した文字列の連結<br>`char *strncat(char *d, const char *s, size_t n);`
文字配列dの文字列の終末に、文字列sを連結する。sの長さがn未満の場合はsの終わりまで連結する。sの長さがn以上の場合はsのn文字目までを連結する。いずれの場合も最後に１つの'/0'を補う。strncpyの'/0'を補う動作とは異なる。2つの領域に重なりがある場合の動作は処理系依存。dは文字列として初期化されていなければならない。
<div class="return-value">戻り値</div>
dへのポインタ。

---

### 文字列の長さの取得<br>`size_t strlen(const char *s);`
文字列sの長さ('\0'は含まない)を符号なし整数値で返す。
<div class="return-value">戻り値</div>
文字列の長さ。

---

### 文字列の検索<br>`char *strstr(const char *s, const char *key);`
文字列sの中から文字列keyを探す。
<div class="return-value">戻り値</div>
見つかれば最初に見つかった位置へのポインタ、見つからなければNULL。keyが空文字列ならsへのポインタを返す。

---

### 文字列の比較<br>`int strcmp(const char *s1, const char *ch2);`
文字列s1とs2のな要を文字コード順で比較する。
<div class="return-value">戻り値</div>
s1 < s2なら負の値、s1 == s2なら0、s1 > s2なら正の値。規格では最初に異なる文字の対の値(unsigned charとみなした)の差の符号となっている。strcmp("a", "aa")
は'/0'-'a'の-97で判定する。

---

### 長さを指定した文字列の比較<br>`int strncmp(const char *s1, const char *s2, size_t n);`
文字列s1とs2の先頭からn文字の内容を文字コード順で比較する。
<div class="return-value">戻り値</div>
s1 < s2なら負の値、s1 == s2なら0、s1 > s2なら正の値。

---

### 指定文字の検索<br>`char *strchr(const char *s, int c);`
文字列sの中から文字cを探す。'\0'も文字列の一部として扱う。つまり'\0'をcに指定して検索できる。
<div class="return-value">戻り値</div>
見つかれば最初に見つかった文字へのポインタ。見つからなければNULL。

---

### メモリブロックの初期化<br>`void *memset(void *s, int c, size_t n);`
sのnバイトを文字cで初期化する。
<div class="return-value">戻り値</div>
sへのポインタ。

---

### メモリブロックのコピー<br>`void *memcpy(void *d, const void *s, size_t n);`
sのnバイトの内容をdにコピーする。2つの領域に重なりがある場合の動作は処理系依存。その場合はmemmoveを使う。nには配列の要素数ではなくバイト数を指定する。
<div class="return-value">戻り値</div>

dへのポインタ。

---

### メモリブロックの移動<br>`void *memmove(void *d, const void *s, size_t n);`
sのnバイトの内容をdにコピーする。2つの領域が重なっていても正常にコピーできる。memmoveよりmemcpyの方が処理時間は早いが、memcpyは2つの領域が重なっている場合は使えない。2つの領域が重ならないことがはっきりしていればmemcpyを使い、重なる場合はmemmoveを使う。
<div class="return-value">戻り値</div>
dへのポインタ。

---

### メモリブロックの比較<br>`int memcmp(const void *s1, const void *s2, size_t n);`
s1とs2のバイト内容を、文字コード順で比較する。
<div class="return-value">戻り値</div>
s1 < s2なら負の値、s1 == s2なら0、s1 > s2なら正の値。

---

## 文字の分類と変換<br>`<ctype.h>` <a id="ctype-h" data-name="文字の分類と変換"></a>

### 大文字に変換<br>`int toupper(int c);`
引数が小文字なら大文字に変換し、小文字でなければ変換しない。
<div class="return-value">戻り値</div>
変換後の文字。

---

### 小文字に変換<br>`int tolower(int c);`
引数が大文字なら小文字に変換し、大文字でなければ変換しない。
<div class="return-value">戻り値</div>
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
| isgraph  | 空白を含まない表示文字。0x20～0x7e。                                                     |
| isspace  | 標準空白類文字(' ', '\t', '\n', '\v', '\f', '\r')。改行含む空白に使う。                  |
| isblank  | 標準ブランク(' ', '\t')。ISO C99で追加。行内の空白に使う。                               |
| iscntrl  | 制御文字(isprintではない文字)。0x00～0x1f, 0x7f。                                        |
| ispunct  | 区切り文字。isspaceまたはisalnumのいずれにも該当しない表示文字。空白文字以外の記号文字。 |
| isxdigit | 16進数字文字。0～9、a～f、A～F。                                                         |

---

## 数学関数<br>`<math.h>` <a id="math-h" data-name="数学関数"></a>

### 累乗<br>`double pow(double x, double y);`
<div class="return-value">戻り値</div>
xのy乗を返す。xが負でyが小数部のある実数(整数にならない実数)の場合、xが0でy <= 0の場合は定義域エラーとなる。引数の値によって値域エラーとなる場合がある。

---

### 平方根<br>`double sqrt(double x);`
<div class="return-value">戻り値</div>
xの平方根(ルート)を返す。xが負なら定義域エラーとなる。

---

### 実数の絶対値<br>`double fabs(double x);`
<div class="return-value">戻り値</div>
double値xの絶対値を返す。

### 引数を上回らない最大整数<br>`double floor(double x);`
<div class="return-value">戻り値</div>
xの小数点部を数直線上で左方向へ切り下げる。ceilは右方向へ切り上げになる。

---

### 引数を下回らない最小整数<br>`double ceil(double x);`
<div class="return-value">戻り値</div>
xの小数点部を数直線上で右方向へ切り上げる。floorは左方向へ切り下げになる。

---

## 時間操作<br>`<time.h>` <a id="time-h" data-name="時間操作"></a>

### tm構造体

```c
struct tm {
    int tm_sec;   // 秒(0-60) 60は閏秒用
    int tm_min;   // 秒(0-59)
    int tm_hour;  // 時(0-23)
    int tm_mday;  // 日(1-31)
    int tm_mon;   // 月(0-11)
    int tm_year;  // 年(年-1900)
    int tm_wday;  // 曜日(0-6)
    int tm_yday;  // 1月1日よりの通し日付け
    int tm_isdst; // 夏時間調整フラグ
    // 夏時間フラグは採用していれば正値、採用していなければ0、この情報が不明の時は負値。
}
```

---

### clock_t型
<div class="subtitle">処理系での定義例</div>

```c
typedef long clock_t
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
typedef long time_t
```

---


### 歴時刻の取得<br>`time_t time(time_t *t);`
歴時刻を取得する。tがNULLでない場合はtにも歴時刻が得られる。
<div class="return-value">戻り値</div>
成功ならtime_t歴時刻。失敗なら(time_t)-1。

---

### プリプロセッサ時間の取得<br>`clock_t clock(void);`
clockを呼んだプロセスが開始されてからの経過時間を取得する。この値をCLOCK_PER_SECで割ると秒単位の値に変換できる。例えばCLOCK_PER_SECが1000.0に定義されている処理系ならclockが返す時間の単位はミリ秒。
<div class="return-value">戻り値</div>
プロセスが開始されてからの経過時間を返す。失敗なら(clock_t)-1を返す。プロセスの開始の時点があいまいなので、プログラムの最初でclockを呼び出し、その差で経過時間を出す方が移植性が高い。

---

### 歴時刻の時間差の計算<br>`double difftime(time_t t1, time_t t0);`
<div class="return-value">戻り値</div>
歴時刻の時間差(t1 - t0)を秒で返す。

---

### 地方時間としてtm構造体に変換<br>`struct tm *localtime(const time_t *t);`
time_t時間tを地方時間としてtm構造体型に変換する。localtimeが返す構造体領域は、次のlocaltimeあるいはgmtimeの呼び出しで変更されるので、後で使用したい場合は別領域に保存しておく。
<div class="return-value">戻り値</div>
成功ならtm構造体へのポインタ、失敗ならNULL。

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
| %H         | 24時間制の時間(00～24)。                                                                                                       |
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
| %h         | %dと同じ                                                                                                   |
| %n         | 改行                                                                                                       |
| %r         | ロケール依存の12時間制の時刻。                                                                             |
| %R         | %H:%Mと同じ。                                                                                              |
| %t         | 水平タブ。                                                                                                 |
| %T         | %H:%M:%Sと同じ。                                                                                           |
| %u         | JIS X 0301で規定する月を1とする10進表記の曜日(1～7)。                                                      |
| %V         | JIS X 0301で規定する暦週の通し番号(01～53)。                                                               |
| %z         | UTCからの時差をJIS X 0301で規定する文字列にする。例えば"-0430"はUTCとり4時間30分遅れていることを意味する。 |

<div class="return-value">戻り値</div>
変換した文字列の長さがmaxsize以下ならその文字数、そうでないなら0を返し配列の内容は不定。

---

## 整数型の制限値<br>`<limits.h>` <a id="limits-h" data-name="整数型の制限値"></a>

---

## 浮動小数点型の制限値<br>`<float.h>` <a id="float-h" data-name="浮動小数点型の制限値"></a>

---

## プログラム診断<br>`<assert.h>` <a id="assert-h" data-name="プログラム診断"></a>

---

## 論理型マクロ<br>`<stdbool.h>` <a id="stdbool-h" data-name="論理型マクロ"></a>

---

## 汎用マクロ<br>`<stddef.h>` <a id="stddef-h" data-name="汎用マクロ"></a>

---

## 標準整数型<br>`<stdint.h>` <a id="stdint-h" data-name="標準整数型"></a>

---

## エラーの識別<br>`<errno.h>` <a id="errno-h" data-name="エラーの識別"></a>

---

## シグナル操作<br>`<signal.h>` <a id="signal-h" data-name="シグナル操作"></a>

---

## ジャンプ処理<br>`<setjmp.h>` <a id="setjmp-h" data-name="ジャンプ処理"></a>

---

## ロケール<br>`<locale.h>` <a id="locale-h" data-name="ロケール"></a>

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

<pre><code class="tips">argcはargument count
argvはargument vector(1次元配列)の意味</code></pre>

---

## コメント <a id="comment" data-name="コメント"></a>
- `/* コメント */`<br>複数行も可能
- `// コメント`<br>行末までコメント

<pre><code class="tips">古いC(C89)では//は文法エラーになるので、移植性を強く意識する場合は/* */を使うのが安全。
組み込みや古いC規格を使っている場合は/* */のみを使う。
個人の学習やモダンな環境(GCC, Clang, MSVC)では//をどんどん使ってOK。</code></pre>

## gcc <a id="gcc" data-name="gcc"></a>

- `-o`で実行ファイル名を指定しなければデフォルトで`a.out`というファイル名になる。

<div class="subtitle">オプション</div>

| オプション        | 説明                                                      |
| ----------------- | --------------------------------------------------------- |
| -c                | コンパイルのみ(リンクしない、.oを出力)                    |
| -o &lt;file&gt;   | 出力ファイル名の指定                                      |
| -I&lt;dir&gt;     | ヘッダーファイル探索パスの追加                            |
| -L&lt;dir&gt;     | ライブラリ探索パスの追加                                  |
| -l&lt;name&gt;    | ライブラリのリンク(例：-lm = libm)                        |
| -static           | 静的リンクを行う(すべて含めたバイナリに)                  |
| -shared           | 共有ライブラリを作る(.so)                                 |
| -g                | デバッグ情報を付加(gdbやlldbで使える)                     |
| -std=c99          | C99標準でコンパイル(他：c89, gnu99, c11, c17, gnu11, etc) |
| -ansi             | -std=c89 相当＋GNU拡張を無効化                            |
| -fstrict-aliasing | 型による最適化を有効化(-O2以上で有効)                     |
| -fno-inline       | 関数のインライン化を抑制(デバッグしやすく)                |
| -Wall             | 代表的な警告を全て表示(必須級)                            |
| -Wextra           | -Wall に含まれない追加の警告も出す                        |
| -Wpedantic        | 標準C規格に厳密でないコードにも警告                       |
| -Werror           | 警告をエラーとして扱う(品質重視・CI向け)                  |
| -Wshadow          | 同じ名前の変数が別スコープで影を落とすと警告              |
| -Wconversion      | 型変換に関する警告を有効化                                |
| -Wuninitialized   | 未初期化の変数使用を警告(-O1以上で有効)                   |
| -O0               | 最適化なし(デフォルト、デバッグ向け)                      |
| -O1               | 軽い最適化                                                |
| -O2               | 中程度の最適化(実用性高、標準的)                          |
| -O3               | 積極的な最適化(高速だがコード肥大の傾向)                  |
| -Os               | サイズ最適化(コードを小さく)                              |
| -Ofast            | -O3に加えて規格無視の最適化(安全性注意)                   |

---

<div class="subtitle">実用的な組み合わせ</div>

```c
// 開発中(デバッグ重視)
gcc -Wall -Wextra -g -O0 main.c -o main
```

```c
// 実行速度重視(リリース用)
gcc -Wall -Wextra -O2 main.c -o main
```

```c
// 品質厳格チェック(CIなど)
gcc -Wall -Wextra -Wpedantic -Werror -O2 main.c -o main
```

---

## メモリ関連のバグ <a id="bug" data-name="メモリ関連のバグ"></a>

- メモリリーク(Memory Leak)
動的に確保したメモリを解放し忘れることで、使用していないメモリが無駄に残り続ける現象。これは長時間動作するプログラムや、リソース制約のある環境で特に問題となる。

- バッファオーバーフロー(Buffer Overflow)
確保されたメモリ領域を超えてデータを書き込むことで隣接するメモリ領域が破壊され、予期しない動作やセキュリティの脆弱性を引き起こすことがある。

- ダングリングポインタ(Dangling Pointer)
解放されたメモリへのポインタを保持したまま使用しようとすることで発生する問題。メモリがすでに他の目的で再利用されている場合、予測できない動作を引き起こす。

- 二重解放(Double Free)
一度解放したメモリを再び解放しようとすると、メモリ管理システムが不正な状態になり、クラッシュや予期しない動作が発生する可能性がある。

- スタックオーバーフロー(Stack Overflow)
再帰関数や巨大なローカル変数などによってスタック領域が使い果たされると、スタック領域がオーバーフローしプログラムの異常終了やメモリ破壊が発生する。

- ヒープ破壊(Heap Corruption)
ヒープ領域内のメモリ管理情報が破壊されることで、メモリの確保や解放が不正な動作を引き起こす問題。ヒープの破壊は非常にデバッグが難しい問題の一つ。

- 未初期化メモリの使用 (Uninitialized Memory)
メモリを確保した直後にそのまま使用すると、初期化されていないゴミデータが入っている場合がある。これに依存すると不定な挙動を引き起こす。

- メモリの断片化(Memory Fragmentation)
確保と解放を繰り返すうちにメモリ領域が断片化し、使用可能なメモリが十分にあるにもかかわらず連続した大きなメモリブロックが確保できなくなる現象。

---

## メモリリークのチェック <a id="memory-leaks" data-name="メモリリークのチェック"></a>

このように実行ファイルを実行することでメモリリークをチェックできる。
<pre><code class="example">valgrind --leak-check=full ./program</code></pre>
