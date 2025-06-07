<div data-title="C言語"></div>
<a id="top" data-name="TOP"></a>

# C言語

- `/* コメント */`<br>複数行も可能
- `// コメント`<br>行末までコメント
<pre><code class="tips">古いC(C89)では//は文法エラーになるので、移植性を強く意識する場合は/* */を使うのが安全。
組み込みや古いC規格を使っている場合は/* */のみを使う。
個人の学習やモダンな環境(GCC, Clang, MSVC)では//をどんどん使ってOK。</code></pre>

---

<div class="subtitle">未分類</div>

puts  
gets          // 非推奨だが古いコードに出る  
putchar  
getchar  
fopen  
fclose  
fread  
fwrite  
fseek  
ftell  
feof  
fscanf  

malloc  
calloc  
realloc  
free  

strlen  
strcpy  
strncpy  
strcat  
strcmp  
strncmp  
strchr  
strstr  
memcpy  
memset  
memcmp  

atoi  
atof  
strtol  
strtod  
rand  
srand  
abs  
labs  
pow  
sqrt  
fabs  
floor  
ceil  

isalpha  
isdigit  
isalnum  
isspace  
toupper  
tolower  

time  
clock  
difftime  
localtime  
strftime  

exit  
system  
qsort  
bsearch  


---

<a id="dengerous-functions" data-name="危険な関数"></a>

## 危険とされるCの標準関数

| 関数名     | 問題点                                                       | 代替                         |
| ---------- | ------------------------------------------------------------ | ---------------------------- |
| gets()     | 入力サイズを制限できない(バッファーオーバーフロー)。         | 使用禁止                     |
| scanf()    | バッファサイズを指定しないと危険。                           | fgets()+sscanf()など         |
| strcpy()   | サイズチェックなしでコピー。                                 | strncpy(), strlcpy()(非標準) |
| strcat()   | サイズチェックなしで連結。                                   | strncat(), strlcat()(非標準) |
| sprintf()  | サイズ制限なしで文字列生成。                                 | snprintf()                   |
| vsprintf() | 上記と同じ。                                                 | vsnprintf()                  |
| strlen()   | NULL終端まで探索するため、不正なポインタでクラッシュの恐れ。 | 使い方に注意                 |
| tmpnam()   | 同名ファイルと競合の危険。                                   | mkstemp()                    |

---

<a id="stdio-h" data-name="標準入出力"></a>

## 標準入出力<br>`<stdio.h>`


### `int printf(const char *format, ...);`
引数の内容を、formatで指定する書式文字列に従った変換をしてから標準出力に書き込む。formatの中身の文字(マルチバイト文字も)はそのまま出力さるが、%で始まる変換指定は、それに対応する引数の書式変換に使用される。formatに指定した変換指定の型と引数の型が一致していなかったり、引数の数が不足している場合の動作は処理系依存。引数の数が変換指定の数より多い場合は、余った引数は評価されるが出力されない。

<div class="subtitle">変換指定の書式</div>

```
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
        <td>d, i, o, u, x, X</dd>
        <td>出力する最小桁数。デフォルトで1。指定した最小桁数に満たない数値の前に0が補われる。</td>
    </tr>
    <tr>
        <td>e, E, f</dd>
        <td>小数点部の桁数。精度を指定しなければ小数部は6桁で表示。精度が0か省略すると小数点以下(.も含めて)を表示しない。指定した桁数よりデータの桁数が多いときは指定した桁数の次の桁をまるめて表示。</td>
    </tr>
    <tr>
        <td>g, G</dd>
        <td>指数表示に切り替える最大有効桁数。デフォルトで6。</td>
    </tr>
    <tr>
        <td>s</dd>
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
        <td>精度を超すか指数部が-4より小さい値はe形式で、越さなければf形式で出力。G場合はE形式またはF形式で出力。</td>
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

### `int scanf(const char *format, ...);` <span class="deprecated">非推奨</span>
標準入力から、formatで指定する書式文字列に従った変換を行い、引数にデータを読み取る。引数はポインタでなければならない(一般変数には&を付け、配列は配列名を書く)。書式に対し実引数が不足しているときの動作は処理系依存。余分にある時は余分な実引数の評価は行うがデータ入力は行わない。<br>書式文字列は、変換指定と一般文字で構成される。scanfは書式の先頭から遂次変換指定を解釈し、書式に合わないデータが入力されたり、書式文字が正しくないなどの照合誤りが発生した時点で以後の書式変換は行わずにscanfから戻る。この書式に合わないデータは入力バッファに残る。scanfはfscanfの第1引数にstdinを指定したものと等価である。

<div class="return-value">戻り値</div>
変換が1つも行われないまま入力誤りが発生した場合(CTRL+Zなどによる入力終わりの通知があった場合)はEOF、その他の場合は正常に入力できた項目数。先頭データで書式に合わないデータが入力された時は0。

### ファイルへの書式付出力<br>`int fprintf(FILE *stream, const char *format, ...);`
streamにデータをformatで示す書式で出力する。formatに指定する書式文字列や引数の取り扱いはprintfと同じ。

<div class="return-value">戻り値</div>
成功なら出力した文字数、失敗なら負値。

### ファイルへの1文字出力<br>`int fputc(int c, FILE *stream);`
streamに文字cをunsigned char型に変換して書き込む。ファイル位置指示子を次の書き込み位置に進める。streamが追加モードでオープンされている場合は常にファイルの終わりに書き込む。

<div class="return-value">戻り値</div>
成功なら書き込んだ文字、書き込みエラーならエラー指示子をセットしてEOFを返す。


### `fscanf();`

### `putchar();`

### `getchar();`

### `puts();`

### `gets();`

### `char *fgets(char *s, int n, FILE *stream);`
streamから文字列を読み取りsに格納する。読み取りは改行文字に出会うか、n-1個の文字を読み取るまで行われる。改行文字に出会った場合は、改行文字を含めてsに格納される。長さ制限を超えた場合はそこまでの文字がsに格納され、改行文字は付加されない。文字列の最後に`'\0'`が付加される。

<div class="return-value">戻り値</div>
成功ならsへのポインタ、ファイルの終わりあるいはエラーならNULL。ファイルの終わりの場合はsの内容は前の読み取り内容が残るが、エラーの場合sの内容は不定。

### `fopen();`

### `fclose();`

### `fread();`

### `fwrite();`

### `fseek();`

### `ftell();`

### `feof();`

### `popen();`

### `pclose();`







---

<a id="stdlib-h" data-name="一般ユーティリティー"></a>

## 一般ユーティリティー<br>`<stdlib.h>`

### `exit();`

### `system();`

### `qsort();`

### `bsearch();`

### `atoi();`


---

<a id="string-h" data-name="文字列・メモリ操作"></a>

## 文字列・メモリ操作<br>`<string.h>`



---

<a id="ctype-h" data-name="文字の分類と変換"></a>

## 文字の分類と変換<br>`<ctype.h>`




---

<a id="math-h" data-name="数学関数"></a>

## 数学関数<br>`<math.h>`



---

<a id="time-h" data-name="時間操作"></a>

## 時間操作<br>`<time.h>`



---

<a id="limits-h" data-name="整数型の制限値"></a>

## 整数型の制限値<br>`<limits.h>`



---

<a id="float-h" data-name="浮動小数点型の制限値"></a>

## 浮動小数点型の制限値<br>`<float.h>`



---

<a id="assert-h" data-name="プログラム診断"></a>

## プログラム診断<br>`<assert.h>`



---

<a id="stdbool-h" data-name="論理型マクロ"></a>

## 論理型マクロ<br>`<stdbool.h>`



---

<a id="stddef-h" data-name="汎用マクロ"></a>

## 汎用マクロ<br>`<stddef.h>`



---

<a id="stdint-h" data-name="標準整数型"></a>

## 標準整数型<br>`<stdint.h>`



---

<a id="errno-h" data-name="エラーの識別"></a>

## エラーの識別<br>`<errno.h>`


---

<a id="signal-h" data-name="シグナル操作"></a>

## シグナル操作<br>`<signal.h>`



---

<a id="setjmp-h" data-name="ジャンプ処理"></a>

## ジャンプ処理<br>`<setjmp.h>`



---

<a id="locale-h" data-name="ロケール"></a>

## ロケール<br>`<locale.h>`






---

<a id="simple-compilation" data-name="gccによる簡単なコンパイル"></a>

## gccによる簡単なコンパイル

<pre><code class="tips">gcc test.c -o test</code></pre>
このコマンドで`test`という実行ファイルが生成される。<br>`-o`は実行ファイルに名前を付けるオプションで、指定しなければデフォルトで`a.out`という実行ファイルが生成される。

---

<a id="command-line-arguments" data-name="コマンドライン引数"></a>

## コマンドライン引数

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

<a id="memory-leaks" data-name="メモリリークのチェック"></a>


## メモリリークのチェック

<div class="subtitle">このように実行ファイルを実行することでメモリリークをチェックできる</div>
<pre><code class="example">valgrind --leak-check=full ./program</code></pre>