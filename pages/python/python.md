<div data-title="Python"></div>

<a id="top" data-name="TOP"></a>

# Python

---

<a id="basic" data-name="基本"></a>

## 基本

### コメント
: コメントは **#** で行末まで。<br>
**'''** または **"""**で囲むことにより複数行に渡ってコメントを書けるが、**docstring**で使われるのでなるべく使わない。

### shebang(シェバン)
: UNIX系のシステムでは、ファイルのパーミッションビット**x**と**r**を設定し、次のような**shebang行**でスクリプトを開始すると、スクリプトを直接実行できるようになる。<br>
`#!/usr/bin/env/python`

### 内包表記

<div class="subtitle">
    リスト内包表記
</div>

<div class="subtitle">
    辞書内包表記
</div>

<div class="subtitle">
    ジェネレータ式
</div>

---

<a id="type" data-name="型"></a>

## 型

### リスト


### タプル


### 辞書


### 集合


### String型

<div class="subtitle">
    文字列操作関連メソッド
</div>

| メソッド     | 説明                                                                        | 使用例                              |
| ------------ | --------------------------------------------------------------------------- | ----------------------------------- |
| capitalize() | 1文字目が英字の場合は大文字で表し、他に英字がある場合はすべて小文字になる。 | 'hello'.capitalize() → 'Hello'      |
| casefold()   | 大文字小文字を区別せず比較できる形に変換。Unicodeのみ。                     | 'HELLO'.casefold() → 'hello'        |
| title()      | 各単語の先頭を大文字に                                                      | 'helloworld'.title() → 'HelloWorld' |
| lower()      | 小文字に変換                                                                | 'HELLO'.lower() → 'hello'           |
| upper()      | 大文字に変換                                                                | 'hello'.upper() → 'HELLO'           |
| swapcase()   | 大文字⇔小文字を入れ替え                                                     | 'Hello'.swapcase() → 'hELLO'        |

<div class="subtitle">
    検索関連メソッド
</div>

| メソッド     | 説明                                     | 使用例                          |
| ------------ | ---------------------------------------- | ------------------------------- |
| startswith() | 指定文字列で始まるか判定                 | 'hello'.startswith('he') → True |
| endswith()   | 指定文字列で終わるか判定                 | 'hello'.endswith('lo') → True   |
| find()       | 部分文字列の最初の位置を返す             | 'hello'.find('l') → 2           |
| rfind()      | 部分文字列の最後の位置を返す             | 'hello'.rfind('l') → 3          |
| index()      | 見つけたら位置を返す(見つからないと例外) | 'hello'.index('l') → 2          |
| rindex()     | 右から検索して位置を返す                 | 'hello'.rindex('l') → 3         |
| count()      | 部分文字列の出現回数                     | 'hello'.count('l') → 2          |

<div class="subtitle">
    判定関連メソッド
</div>

| メソッド       | 説明                           | 使用例                         |
| -------------- | ------------------------------ | ------------------------------ |
| isalnum()      | 英数字のみか判定               | 'abc123'.isalnum() → True      |
| isalpha()      | アルファベットのみか判定       | 'abc'.isalpha() → True         |
| isdigit()      | 数字のみか判定                 | '123'.isdigit() → True         |
| isdecimal()    | 10進数か判定                   | '123'.isdecimal() → True       |
| isnumeric()    | 数字または記号が含まれるか判定 | 'Ⅳ'.isnumeric() → True         |
| isspace()      | 空白文字のみか判定             | ' '.isspace() → True           |
| isidentifier() | 識別子として有効か判定         | 'var_1'.isidentifier() → True  |
| islower()      | すべて小文字か判定             | 'hello'.islower() → True       |
| isupper()      | すべて大文字か判定             | 'HELLO'.isupper() → True       |
| istitle()      | タイトルケースか判定           | 'Hello World'.istitle() → True |

<div class="subtitle">
    文字列の整形メソッド
</div>

| メソッド     | 説明                       | 使用例                                                  |
| ------------ | -------------------------- | ------------------------------------------------------- |
| strip()      | 前後の空白や指定文字を除去 | ' hello '.strip() → 'hello'                             |
| lstrip()     | 左側の空白や指定文字を除去 | ' hello'.lstrip() → 'hello'                             |
| rstrip()     | 右側の空白や指定文字を除去 | 'hello '.rstrip() → 'hello'                             |
| replace()    | 部分文字列を置換           | 'hello'.replace('l', 'w') → 'hewwo'                     |
| split()      | 指定の区切り文字で分割     | 'a,b,c'.split(',') → ['a', 'b', 'c']                    |
| rsplit()     | 右から分割                 | 'a,b,c'.rsplit(',', 1) → ['a,b', 'c']                   |
| partition()  | 最初の区切り文字で分割     | 'hello world'.partition(' ') → ('hello', ' ', 'world')  |
| rpartition() | 右から区切り文字で分割     | 'hello world'.rpartition(' ') → ('hello', ' ', 'world') |
| join()       | 文字列を指定の区切りで結合 | ','.join(['a', 'b', 'c']) → 'a,b,c'                     |

<div class="caution">
    strip系のメソッドは、<b>"指定文字列"</b>に含まれる<b>'文字'</b>が全て除去されるので注意。 
</div>

<div class="subtitle">
    フォーマット関連メソッド
</div>

| メソッド     | 説明                     | 使用例                                |
| ------------ | ------------------------ | ------------------------------------- |
| format()     | 文字列フォーマット       | '{} {}'.format('Hello', 'World')      |
| format_map() | 辞書を使ったフォーマット | '{name}'.format_map({'name': 'John'}) |
| zfill()      | 0埋めで文字列を指定幅に  | '42'.zfill(5) → '00042'               |

##### その他

| メソッド     | 説明                         | 使用例                         |
| ------------ | ---------------------------- | ------------------------------ |
| encode()     | 文字列をバイト列にエンコード | 'hello'.encode('utf-8')        |
| decode()     | バイト列を文字列にデコード   | b'hello'.decode('utf-8')       |
| expandtabs() | タブをスペースに変換         | 'a\tb'.expandtabs(4)           |
| center()     | 文字列を中央寄せ             | 'hi'.center(6, '-') → '--hi--' |
| ljust()      | 左寄せ                       | 'hi'.ljust(5, '-') → 'hi---'   |
| rjust()      | 右寄せ                       | 'hi'.rjust(5, '-') → '---hi'   |

---

<a id="function" data-name="関数"></a>

## 関数

### 位置専用引数
: `スラッシュ(/)`は前の引数を位置専用引数とする。

<pre><code class="example">def func(a, b, /): # a, bは位置専用</code></pre>

### キーワード専用引数
: `アスタリスク(*)`は後の引数をキーワード専用引数とする。

<pre><code class="example">def func(*, a, b): # a, bはキーワード専用</code></pre>

### 可変長引数
: `*args`は位置引数をタプルとして受け取る。<br>`**kwargs`はキーワード引数を辞書として受け取る。

<pre><code class="example">def func(*args, **kwargs):</code></pre>

### デフォルト値
: 引数が渡されなかった場合のデフォルト値を`イコール(=)`で記述できる。

<pre><code class="example">def greet(name: str = "unknown"):
    print(f"Hi {name}!")</code></pre>

### 型ヒント付きシグネチャ
: 引数や戻り値の型を、型ヒントとして明示的に記述できる。<br>型ヒントは静的解析ツール(mypyなど)に使われ、実行時に型の強制はされない。

<pre><code class="example">def greet(name: str, age: int) -> str:
    return f"Hi {name}, you're {age} years old!"</code></pre>

### デコレーター

: デコレーターは関数やクラスの振る舞いを変更するためのものであり、関数を引数として受け取り、別の関数やオブジェクトを返す関数。

### ラムダ式

---

<a id="functions" data-name="組み込み関数"></a>

## 組み込み関数
### open(file, mode='r', buffering=-1, encoding=None, errors='strict', newline=None, closefd=True,open=os.open)

: ファイルのパスを指定してファイルをオープンする。ファイルオブジェクトを返す。<br>オープンしたファイルオブジェクトは`f.close()`でクローズする必要がある。<br>通常は`f.close()`の呼び忘れを防ぐために**with句**を使用することで、コンテキストマネージャーによって自動的にクローズされる。

<pre><code class="example">with open(file_path, encoding="utf-8") as f:
    content = f.read()</code></pre>

**mode**はファイルをどのように開くか(または作成するか)を示すオプション。<br>デフォルトでは'a'は'at'であり、テキストモードで開かれることを示す。モードの種類は以下の通り。

| モード | 意味                                                                                                                         |
| ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `'r'`  | ファイルは読み取りモードで開かれる。<br>ファイルが存在していなければならない。デフォルト。                                   |
| `'r+'` | 読み取り/書き込みモードで開かれる。<br>ファイルが存在していなければならない。                                                |
| `'a'`  | ファイルは書き込み専用モードで開かれる。<br>ファイルが存在しない場合は作成され、書き込むデータはファイルの末尾に追記される。 |
| `'a+'` | ファイルは読み取り/書き込みモードで開かれる。<br>ファイルが存在しない場合は作成される。                                      |
| `'w'`  | ファイルは書き込み専用モードで開かれる。<br>ファイルが存在しない場合は作成され、書き込むデータは上書きされる。               |
| `'w+'` | 読み取り/書き込みモードで開かれる。<br>ファイルが存在しない場合は作成され、書き込むデータは上書きされる。                    |

`'ab'`とするとバイナリモードで開かれる(作成される)ことを示し、bytes型の文字列の読み取りおよび書き込みができる。<br>


### ファイルオブジェクトのメソッド

<div class="subtitle">
    読み取りのメソッド
</div>

#### f.read(size=-1)
: 指定したsizeバイトを読み込んで返す。<br>sizeを省略、または-1とすると、ファイル全体を読み込む。

#### f.readline(size=-1)
: 1行読み込む。sizeを指定すると、そのバイト数までを読み込む。

#### f.readlines(hint=-1)
: ファイルの全行をリストで返す。hintを指定すると、指定バイト数を超えないように調整される。

<div class="subtitle">
    書き込みのメソッド
</div>

#### f.write(string)
: 文字列を書き込む。バイナリモードの場合はbytesを渡す必要がある。

#### f.writelines(lines)
: 文字列のリストを書き込む(改行(\n)は手動で含める必要がある)。
<div class="example">
    <code>f.writelines(["line1\n", "line2\n"])</code>
</div>

<div class="subtitle">ファイル位置関連のメソッド</div>

#### f.tell()
: 現在のファイル位置を取得する。

#### f.seek(offset, whence=0)
: ファイルの位置を変更する。<br>whenceの値で基準を指定する。値は以下の通り。

| 値  | 説明                                             |
| --- | ------------------------------------------------ |
| 0   | デフォルト。ファイルの先頭からoffsetバイト移動。 |
| 1   | 現在位置からoffsetバイト移動。                   |
| 2   | ファイルの末尾からoffsetバイト移動               |


<div class="subtitle">状態管理関連のメソッド</div>

#### f.flush()
: 書き込みデータをすぐにディスクへ反映させる。

#### f.close()
: ファイルを閉じる。閉じたファイルオブジェクトは使用できなくなる。

<div class="subtitle">判定メソッド</div>

#### f.closed
: ファイルが閉じているかをboolで返す。

#### f.writable()
: ファイルが書き込み可能ならTrueを返す

#### f.readable()
: ファイルが読み取り可能ならTrueを返す。

#### f.seekable()
: seek()が使用可能ならTrueを返す。

---

### abs(x, /)
: 数値xの絶対値を返す。

### all(seq, /)
: seqはイテラブル。seqのいずれかの要素がfalsyの場合、allは`False`を返す。つまり全ての要素がtruthyである場合のみ`True`を返す。<br>演算子`and`および`or`と同様にallは答えが分かった時点で評価をやめ、結果を返す。

```python
if all(x>0 for x in the_numbers):
    print('all of the numbers are positive')
else:
    print('some of the numbers are not positive')
```
: 関数を使う場合もイテラブルとして渡す。
```python
def is_positive(x):
    return x > 0

numbers = [1, 2, 3, 4]

result = all(map(is_positive, numbers))
# または内包表記で
result = all(is_positive(x) for x in numbers)
```

### any(seq, /)
: seqはイテラブル。seqのいずれかの要素がtruthyの場合、anyは`True`を返す。つまり全ての要素がfalsyである場合のみ`False`を返す。<br>演算子`and`および`or`と同様にallは答えが分かった時点で評価をやめ、結果を返す。<br>引数の渡し方は`all()`と同じ

### bin(x, /)
: 整数xのバイナリ文字列表現を返す。

### dir([obj, ]/)
: `dir()`(引数なし)の呼び出しは、現在のスコープでバインドされているすべての変数名をソート済みのリストとして返す。<br>`dir(obj)`の呼び出しは、objの型から、または継承によって取得したものを含め、objの属性の名前をソート済みのリストとして返す。

### enumerate(iterable, start=0)
: 要素がペアである新しいイテレータを返す。<br>1つ目の要素は整数であり、`start`、`start+1`、`start+2`といった具合になる。<br>2つ目の要素は渡されたイテレータの要素となる。

### filter(func, seq, /)
: funcがtruthyであるseqの要素からなるイテレータを返す。<br>funcは引数を1つだけ受け取る任意の呼び出し可能オブジェクトか、または`None`。seqは任意のイテラブル。<br>funcが呼び出し可能オブジェクトである場合は、次のジェネレータ式のように、filterはseqの要素ごとにfuncを呼びだす。
```python
(item for item in seq if func(item))
```

### input(prompt='', /)
: promptを標準出力に書き出し、標準入力から行を読み取り、その行を(\nを含めずに)strとして返す。<br>inputはEOF(End-of-File)でEOFErrorを生成する。

### isinstance(obj, cls, /)
: 

### iter(obj, /), <br>iter(func, sentinel, /)
: 








---

<a id="error-handling" data-name="エラーハンドリング"></a>

## エラーハンドリング

### 基本構文

```python
try:
    # 例外が発生する可能性があるコード
    result = 10 / 0
except ZeroDivisionError:
    # 例外が発生した場合の処理
    print("0で割ることはできません")
else:
    # 例外が発生しなかった場合の処理
    print("成功:", result)
finally:
    # 例外の有無にかかわらず実行される処理
    print("処理終了")
```

<pre><code class="caution">try:の後にはexcept:かfinally:のいずれかを書く必要がある。</code></pre>


#### try:
: このブロックに例外が発生する可能性があるコードを記述する。<br>
例外が発生した場合、exceptブロックへ処理が移り、発生しなければelseブロックが実行される。

#### except:
: tryブロックで例外が発生した際の処理を記述する。<br>
例外の種類を指定することで、特定のエラーをキャッチする。<br>
複数の例外をキャッチする場合は、exceptを複数並べるか、タプルで記述する。<br>
指定していない例外が発生すると、プログラムがクラッシュする。

例外の種類を指定しつつ、全ての例外をキャッチするには、この様に記述する。

```python
try:
    x = int(input("整数を入力してください: "))
    print(10 / x)
except (ZeroDivisionError, ValueError) as e:
    print(f"エラーが発生しました: {e}")
except Exception as e:
    print(f"予期しないエラー: {e}")
```
    
<pre><code class="tips">Exceptionが一般的なエラーの基底クラスで、通常のtry/exceptではこのクラス以下を補足する(BaseExceptionが全ての例外の基底クラス)。</code></pre>

#### else:
: 例外が発生しなかった場合に実行される。

#### finally:
: 例外の有無に関わらず、必ず実行されるブロック。<br>
ファイルのクローズ処理や、リソースの解放などに使う。

<pre><code class="tips">try:を使うことにより、ファイルのクローズやリソースの解放の様な後片付けを確実に実行することができる。</code></pre>

#### raise
: 意図的に例外を発生させる。

<pre><code class="example">raise ValueError('Sequence arguments must be non-empty')</code></pre>
