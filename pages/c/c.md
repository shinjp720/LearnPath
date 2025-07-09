<div data-title="C言語"></div>
<a id="top" data-name="TOP"></a>

# C言語

- `/* コメント */`<br>複数行も可能
- `// コメント`<br>行末までコメント
<pre><code class="tips">古いC(C89)では//は文法エラーになるので、移植性を強く意識する場合は/* */を使うのが安全。
組み込みや古いC規格を使っている場合は/* */のみを使う。
個人の学習やモダンな環境(GCC, Clang, MSVC)では//をどんどん使ってOK。</code></pre>

---

<a id="struct" data-name="構造体"></a>

## 構造体

---

<a id="union" data-name="共有体"></a>

## 共有体

---

<a id="enumeration" data-name="列挙体"></a>


## 列挙体

---

<a id="pointer" data-name="ポインタ"></a>

## ポインタ

### 関数に配列を渡す

C言語では、関数の引数に「配列」を書いても、実際にはポインタとして渡される。これを「配列がポインタに退化する」と言う。

<pre><code class="example">void func(char *arr[]) {
    // 実は → void func(char **arr) と同じ意味
}</code></pre>

### ポインタを使うメリット・デメリット

- C言語の関数は値渡し(変数の値をコピーして渡す)であるために関数側では渡された変数の値を変更することができない。アドレスを渡すことにより関数側で直接渡された変数の値を書き換えることができるようになる。

- また、値渡しされる場合は値をコピーするという処理があるため、ポインタ渡しに比べて多くのリソースを要する。

- 配列は必ず連続してメモリが確保されるため、関数にポインタを渡すことにより複数の変数を渡すことができる。

- 適切に扱わないとメモリを破壊する恐れがある。

- ポインタを宣言した段階ではポインタがどこを指しているか分らないので必ず初期化する。

---

<div class="subtitle">未分類</div>

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



---

<a id="dengerous-functions" data-name="危険な関数"></a>

## 危険とされるCの標準関数

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

<a id="stdio-h" data-name="標準入出力"></a>

## 標準入出力<br>`<stdio.h>`

### 標準出力への書式付出力<br>`int printf(const char *format, ...);`
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

### ファイルへの書式付出力<br>`int fprintf(FILE *stream, const char *format, ...);`
streamにデータをformatで示す書式で出力する。formatに指定する書式文字列や引数の取り扱いはprintfと同じ。

<div class="return-value">戻り値</div>
成功なら出力した文字数、失敗なら負値。

### 文字配列への書式付出力<br>`int sprintf(char *s, const char *format, ...);`
formatで指定した書式で引数を文字列に変換し、文字配列sに出力する。文字列の最後に'\0'が付加される。文字配列に出力する以外はprintfと同じ。文字列処理を行うのに有用な関数である。sと実引数に指定する領域に重なりがある場合の動作は処理系依存。

<div class="return-value">戻り値</div>
成功なら出力した文字数('\0'は含まない)、失敗なら負値。

### 標準入力からの書式付入力<br>`int scanf(const char *format, ...);` <span class="warning">非推奨</span>
標準入力から、formatで指定する書式文字列に従った変換を行い、引数にデータを読み取る。引数はポインタでなければならない(一般変数には&を付け、配列は配列名を書く)。書式に対し実引数が不足しているときの動作は処理系依存。余分にある時は余分な実引数の評価は行うがデータ入力は行わない。<br>書式文字列は、変換指定と一般文字で構成される。scanfは書式の先頭から遂次変換指定を解釈し、書式に合わないデータが入力されたり、書式文字が正しくないなどの照合誤りが発生した時点で以後の書式変換は行わずにscanfから戻る。この書式に合わないデータは入力バッファに残る。scanfはfscanfの第1引数にstdinを指定したものと等価である。

<div class="subtitle">変換指定の書式</div>

```
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

### ファイルからの書式付入力<br>`int fscanf(FILE *stream, const char *format, ...);`
streamからformatに従った書式で、データを読み込む。formatに指定する書式文字列や引数の取り扱いはscanfと同じ。

<div class="return-value">戻り値</div>
変換が１つも行われないまま入力誤りが発生した場合(CTRL+Zなどによる入力終わりの通知があった場合)はEOF、その他の場合は正常に入力できた項目数。先頭データで書式に合わないデータが入力された時は0。

### 文字配列からの書式付入力<br>`int sscanf(const char *s, const char *format, ...);`
文字列sからformatに従った書式でデータを入力する。文字列から入力する以外はscanfと同じ。sと実引数に指定する領域に重なりがある場合の動作は処理系依存。
<div class="return-value">戻り値</div>
変換が1つも行われないまま入力誤りが発生した場合(文字列の終わり)はEOF、その他の場合は正常に入力できた項目数。先頭データで書式に合わないデータが入力された時は0。

### 標準入力から文字列の入力<br>`char *gets(char *s);` <span class="warning">使用禁止</span>
バッファーオーバーフローの脆弱性があるため使用禁止。<br>
代わりにfgetsを使う。

### ファイルからの文字列入力<br>`char *fgets(char *s, int n, FILE *stream);`
streamから文字列を読み取りsに格納する。読み取りは改行文字に出会ったか、n-1個の文字を読み取るまで行われる。改行文字に出会った場合は、改行文字を含めてsに格納される。長さ制限を超えた場合はそこまでの文字がsに格納され、改行文字は付加されない。文字列の最後に`'\0'`が付加される。

<div class="return-value">戻り値</div>
成功ならsへのポインタ、ファイルの終わりあるいはエラーならNULL。ファイルの終わりの場合はsの内容は前の読み取り内容が残るが、エラーの場合sの内容は不定。

### ファイルから1文字入力<br>`int fgetc(FILE *stream);`
streamから1文字読み取る。文字はunsigned char型の1バイトとして読み、そのあとint型に変換して返す。ファイル現在位置を次の文字に進める。
<div class="return-value">戻り値</div>
成功なら読み取った文字、読み取りエラーまたはファイルの終わりならEOF。読み取りエラーならエラー指示子を、ファイルの終わりならファイル終了指示子をセットしてEOFをセットする。結果がEOFの場合にそれがエラーなのか、ファイルの終わりなのかは各指示子を調べる。

### ファイルから1文字入力<br>`int getc(FILE *stream);`
fgetcと同じ。fgetcは関数で実現することを要求されているのに対しgetcはマクロでも関数でもよい。処理スピードを上げたいならgetc(ただし関数なら同じ)、マクロの副作用の危険を避けるならfgetcを使う。

<div class="return-value">戻り値</div>
fgetcと同じ。

### 標準入力から1文字の入力<br>`int getchar();`
標準入力から1文字を読み込むこと以外はfgetcと同じ。getchar()はgetc(stdin)と等価。

<div class="return-value">戻り値</div>
標準入力から1文字を読み込むこと以外はfgetcと同じ。

### ファイルへの1文字出力<br>`int fputc(int c, FILE *stream);`
streamに文字cをunsigned char型に変換して書き込む。ファイル位置指示子を次の書き込み位置に進める。streamが追加モードでオープンされている場合は常にファイルの終わりに書き込む。

<div class="return-value">戻り値</div>
成功なら書き込んだ文字、書き込みエラーならエラー指示子をセットしてEOFを返す。

### ファイルへの1文字出力<br>`int putc(int c, FILE *stream);`
fputcと同じ。fputcは関数で実現することを要求されているのに対し、putcはマクロでも関数でもよい。処理スピードを上げたいならputc(ただし関数なら同じ)、マクロの副作用の危険を避けるならfputcを使う。

<div class="return-value">戻り値</div>
fputcと同じ。

### 標準出力への1文字出力<br>`int putchar(int c);`
標準出力に1文字書き込むこと以外は、fputcと同じ。putchar(c)は、putc(c, stdout)と等価。

<div class="return-value">戻り値</div>
fputcと同じ。

### 標準出力への文字列の出力<br>`int puts(const char *s);`
標準出力に文字列sを書き込み、さらに改行文字を書き込む。'\0'は書き込まない。fputs(s, stdout)の場合は改行文字を書き込まない。

<div class="return-value">戻り値</div>
成功なら正値、書き込みエラーならEOF。

### ファイルへの文字列出力<br>`int fputs(char *s, FILE *stream);`
streamにsで示す文字列を書き込む。文字列の終了を示す'\0'は書き込まない。自動的に改行文字を書き込むことはしない。

<div class="return-value">戻り値</div>
成功なら正値、書き込みエラーならEOF。








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

### ファイルクローズ<br>`int fclose(FILE *stream);`
streamが指すストリームをフラッシュし、ストリームに結合したファイルをクローズする。fcloseにより、出力バッファに残っているデータは書き出され、入力バッファに残っているデータは捨てられる。setbuf、setvbufで割り当てられているバッファをストリームから切り離し、自動的に生成されたバッファを解放する。
オープンしたファイルはユーザの責任でファイルクローズしなければならない。特にライトモードでオープンしてある場合はfcloseしなければ結果は保証されない。

<div class="return-value">戻り値</div>
成功なら0、失敗ならEOF。

### ファイルへのブロックライト<br>`size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *stream);`
sizeバイトのデータブロックを、nmemb個文格納したPtrのデータをstreamに書き込む。ファイル現在位置は書き込みに成功した文字数分進む。エラーの場合のファイルの現在位置は不定。

<div class="return-value">戻り値</div>
書き込んだブロックの個数。これがnmembに等しくなければエラーがあったことになる。sizeまたはnmembが0なら書き込みは行わずに0を返す。

### ファイルからのブロックリード<br>`size_t fread(void *ptr, size_t size, size_t nmemb, FILE *stream);`
streamからsizeバイトのデータブロックをnmemb個、ptrに読み取る。ファイル現在位置を読み取った文字数文進める。エラーの場合のファイル現在位置は不定。

<div class="return-value">戻り値</div>
読み取ったブロックの個数。戻り値がnmembではない場合はファイルの終わりになったか、エラーの時である。sizeまたはnmembが0なら読み取りを行わずに0を返す。

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
        <td><code>fseek(fp, 0L, SEEK_SET)<code></td>
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

### ファイル現在位置の取得<br>`long int ftell(FILE *stream);`
streamのファイル現在位置を所得する。バイナリストリームの場合は先頭からファイル現在位置の直前までの文字数となる。テキストストリームの場合は処理系依存。

<div class="return-value">戻り値</div>
成功ならファイル現在位置、失敗ならerrnoにエラー番号を設定し、-1Lを返す。ファイルを追加モードで開いた場合のファイル位置は直前読み書き位置であるが、1度も読み書きを行わない状態ならftellは0Lを返す。

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

<a id="gcc" data-name="gcc"></a>

## gcc

<div class="subtitle">オプション</div>
 
<div class="subtitle">gccによる簡単なコンパイル</div>

<pre><code class="tips">gcc test.c -o test</code></pre>
このコマンドで`test`という実行ファイルが生成される。<br>`-o`は実行ファイルに名前を付けるオプションで、指定しなければデフォルトで`a.out`という実行ファイルが生成される。

---

<a id="bug" data-name="メモリ関連のバグ"></a>

## メモリ関連のバグ

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

<a id="memory-leaks" data-name="メモリリークのチェック"></a>

## メモリリークのチェック

このように実行ファイルを実行することでメモリリークをチェックできる。
<pre><code class="example">valgrind --leak-check=full ./program</code></pre>