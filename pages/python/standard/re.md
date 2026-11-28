---
title: re
layout: default
---

# re <a id="top" data-name="TOP"></a>

`re` モジュールは、正規表現 (regular expression) を使って、文字列の検索、一致の判定、置換、分割を行うためのモジュール。パターンに一致する部分を取り出したり、複雑な条件で、文字列を書き換えたりできる。

標準ライブラリに含まれるため、インストールは不要である。パターンには、`str` と `bytes` の、どちらも使える (ただし、パターンと検索対象の型は、そろえる)。正規表現そのものの一般的な考え方は、「正規表現」のドキュメントを参照。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 標準ライブラリ | インストール不要。`import re` で使える |
| 2通りの使い方 | 関数にパターンを直接渡す方法と、`compile()` で作った正規表現オブジェクトを使う方法がある |
| 豊富な構文 | グループ、名前付きグループ、先読み、後読み、非貪欲なマッチなどが使える |
| マッチオブジェクト | 一致した位置や、グループごとの文字列を、オブジェクトから取り出せる |
| Unicode 対応 | `str` のパターンでは、`\w` や `\d` が、Unicode の文字に対応する |

### 主な関数

| 関数 | 内容 | 戻り値 |
| --- | --- | --- |
| `re.compile(pattern, flags=0)` | パターンをコンパイルして、正規表現オブジェクトを作る | 正規表現オブジェクト |
| `re.search(pattern, string, flags=0)` | 文字列の中から、最初に一致する部分を探す | マッチオブジェクト、または `None` |
| `re.match(pattern, string, flags=0)` | 文字列の**先頭**が、パターンに一致するか調べる | マッチオブジェクト、または `None` |
| `re.fullmatch(pattern, string, flags=0)` | 文字列**全体**が、パターンに一致するか調べる | マッチオブジェクト、または `None` |
| `re.findall(pattern, string, flags=0)` | 一致するすべての部分を探す | リスト |
| `re.finditer(pattern, string, flags=0)` | 一致するすべての部分を、マッチオブジェクトで返す | イテレータ |
| `re.sub(pattern, repl, string, count=0, flags=0)` | 一致する部分を置換する | 置換後の文字列 |
| `re.subn(pattern, repl, string, count=0, flags=0)` | `sub()` と同じだが、置換した回数も返す | `(文字列, 回数)` のタプル |
| `re.split(pattern, string, maxsplit=0, flags=0)` | 一致する部分で、文字列を分割する | リスト |
| `re.escape(pattern)` | 正規表現の特殊文字を、エスケープする | 文字列 |

### バージョンごとの追加

| Python | 追加、変更された機能 |
| --- | --- |
| 3.8 | `\N{name}` (Unicode 文字名による指定) |
| 3.11 | 所有的量指定子 (`*+`、`++`、`?+`、`{m,n}+`)、アトミックグループ `(?>...)`、`re.NOFLAG` |
| 3.13 | `re.PatternError` (`re.error` の別名)。`re.split()`、`re.sub()`、`re.subn()` で、`maxsplit`、`count`、`flags` を位置引数で渡すことが非推奨になった |
| 3.14 | 文字列の末尾だけにマッチする `\z` |

<pre><code class="caution">このドキュメントは、Python 3.11 以降を前提にしている。
Python 3.13 以降では、re.sub(p, r, s, re.I) のように、flags を位置引数で渡すと、DeprecationWarning になる。flags=re.I のように、キーワード引数で渡す。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

```python
import re
```

---

## 基本 <a id="basic" data-name="基本"></a>

- 正規表現のパターンにはよくバックスラッシュ(\)が含まれるので、常にraw文字列リテラル形式r'...'で指定するのが得策。
- 正規表現で検索を行うには、主にふたつのアプローチがある。

<div class="subtitle">直接関数にパターンを渡して検索</div>

コンパイルを行わずにパターンを文字列で直接指定する。この方法は単発での検索に便利。

  <pre><code class="example">import re
# パターンを文字列で直接指定
text = "There are 123 apples and 456 oranges."
# 直接パターンを渡して検索
m = re.findall(r"\d+", text)
print(m)  # ['123', '456']</code></pre>

<div class="subtitle">コンパイルしてから検索</div>

最初に正規表現のパターンをコンパイルして、返ってきた正規表現オブジェクトを使って複数回検索を行う。<br>
同じパターンで繰り返し検索を行う場合に効率的。

  <pre><code class="example">import re
# パターンをコンパイル
r = re.compile(r"\d+")
text = "There are 123 apples and 456 oranges."
# コンパイルされたパターンで探索
m = r.findall(text)
print(m)  # ['123', '456']</code></pre>

<pre><code class="tips">最近使ったパターンは、内部でキャッシュされるため、関数に直接パターンを渡しても、極端に遅くはならない。
ただし、コンパイル済みの正規表現オブジェクトには、pos と endpos のような、関数にはない引数がある。</code></pre>

<pre><code class="caution">r'...' を付けずに、'\d' のように書くと、Python の文字列として、バックスラッシュが解釈される。
'\b' は、単語境界ではなく、バックスペースになる。意味のないエスケープは、SyntaxWarning になる。</code></pre>

### match、search、fullmatch の違い

| 関数 | 一致を調べる範囲 | `'abc'` に対する例 |
| --- | --- | --- |
| `match` | 文字列の先頭から | `re.match('b', 'abc')` → `None` |
| `search` | 文字列の中のどこか (最も左) | `re.search('b', 'abc')` → 一致する |
| `fullmatch` | 文字列全体 | `re.fullmatch('ab', 'abc')` → `None` |

```python
import re

print(re.match('b', 'abc'))
print(re.search('b', 'abc'))
print(re.fullmatch('abc', 'abc'))
print(re.fullmatch('ab', 'abc'))
```

```text
None
<re.Match object; span=(1, 2), match='b'>
<re.Match object; span=(0, 3), match='abc'>
None
```

---

## 正規表現オブジェクトのメソッド <a id="pattern-methods" data-name="正規表現オブジェクトのメソッド"></a>

`r` は、`re.compile()` が返した、正規表現オブジェクト。

| 書式 | 説明 |
| --- | --- |
| `r.findall(s[, pos[, endpos]])` | 文字列内で正規表現に一致するすべての部分文字列をリストとして返す。パターンにグループがあるときは、グループに一致した文字列のリスト (グループが複数のときは、タプルのリスト) になる |
| `r.finditer(s[, pos[, endpos]])` | `findall` と同様だが、文字列またはタプルのリストではなく、マッチオブジェクトのイテレータを返す。ほとんどの場合は `finditer` の方が柔軟であり、通常はパフォーマンスもいい |
| `r.fullmatch(s[, pos[, endpos]])` | 完全な部分文字列 `s` (インデックス `pos` で始まり、インデックス `endpos` の1つ前で終わる) が `r` とマッチする場合にマッチオブジェクトを返す。それ以外は `None` を返す |
| `r.match(s[, pos[, endpos]])` | `s` の部分文字列 (インデックス `pos` で始まり、インデックス `endpos` の1つ前で終わる) が `r` とマッチする場合に適切なマッチオブジェクトを返す。それ以外は `None` を返す。`match` は `s` において `pos` が始まる位置に暗黙的に固定される。`s` において `pos` から `endpos` に向かう途中のどこかで `r` とマッチするものを検索したい場合は `r.search` を使う |
| `r.search(s[, pos[, endpos]])` | `r` とマッチする部分文字列 (インデックス `pos` で始まり、インデックス `endpos` の1つ前で終わる) のうち、最も左にある物に対する適切なマッチオブジェクトを返す。そのような部分文字列が無い場合は `None` を返す |
| `r.split(s, maxsplit=0)` | `s` を `r` で分割したリスト `L` (`r` との重複なしの空ではないマッチによって分割された `s` の部分文字列のリスト) を返す。例は、表の下を参照 |
| `r.sub(repl, s, count=0)` | `s` をコピーし、`r` と重複なしでマッチする部分文字列を `repl` に書き換えたものを返す。`repl` は文字列か、関数などの呼び出し可能オブジェクトである。`count>0` の場合は、`r` との最初の `count` 個のマッチだけが置き換えられる。`count==0` の場合は、`r` とのすべてのマッチが置き換えられる |
| `r.subn(repl, s, count=0)` | `sub()` と同じだが、`(置換後の文字列, 置換回数)` のタプルを返す |

<pre><code class="example">import re
pattern = re.compile(r"\d+")
result = pattern.split("abc123def456ghi789")
print(result)  # ['abc', 'def', 'ghi', '']</code></pre>

`pos` と `endpos` は、検索する範囲を、インデックスで指定する。`pos` を指定しても、`^` は、`pos` の位置にはマッチしない (文字列の先頭にだけマッチする)。

<pre><code class="tips">sub() の repl に文字列を渡すとき、\1 や \g&lt;name&gt; で、グループにマッチした文字列を参照できる。
repl に関数を渡すと、マッチオブジェクトを受け取って、置換後の文字列を返せる。</code></pre>

---

## 正規表現オブジェクトの属性 <a id="pattern-attributes" data-name="正規表現オブジェクトの属性"></a>

| 属性名 | 説明 |
| --- | --- |
| `flags` | `compile` 関数に渡された `flags` 引数。`str` のパターンでは、`re.UNICODE` が自動的に加わる |
| `groupindex` | 要素 `(?P<name>...)` によって定義されたグループ名をキーに持つ辞書。対応する値は指定された名前のグループ番号 |
| `pattern` | `r` のコンパイル元のパターン文字列 |
| `groups` | パターンに含まれる、捕捉グループの数 |

---

## マッチオブジェクト <a id="match-object" data-name="マッチオブジェクト"></a>

`search`、`match`、`fullmatch`、`finditer` が返す、一致の情報を持つオブジェクト。一致しなかったときは、マッチオブジェクトではなく、`None` が返る。

### マッチオブジェクトの属性

| 属性名 | 説明 |
| --- | --- |
| `pos` | `search` または `match` に渡された `pos` 引数 (つまり、`s` においてマッチングが開始されたインデックス) |
| `endpos` | `search` または `match` に渡された `endpos` 引数 (つまり、`s` においてマッチングが終了したインデックス) |
| `lastgroup` | 最後にマッチしたグループの名前 (最後にマッチしたグループに名前が無い場合、またはマッチに参加したグループが無かった場合は `None`) |
| `lastindex` | 最後にマッチしたグループの整数のインデックス (マッチに参加したグループが無かった場合は `None`) |
| `re` | そのメソッドで `m` を作成した正規表現オブジェクト `r` |
| `string` | `finditer`、`fullmatch`、`match`、`search`、`sub`、`subn` に渡された文字列 `s` |

### マッチオブジェクトのメソッド

| メソッド | 説明 |
| --- | --- |
| `m.end(groupid=0)`、`m.span(groupid=0)`、`m.start(groupid=0)` | `m.string` において `groupid` (グループ番号またはグループ名。デフォルト値 0 は正規表現全体を意味する) によって識別されるグループとマッチする部分文字列のインデックスを返す。マッチしている部分文字列が `m.string[i:j]` である場合、`m.start` は `i` を返し、`m.end` は `j` を返し、`m.span` は `(i, j)` を返す |
| `m.expand(s)` | `s` をコピーし、エスケープシーケンスと後方参照をメソッド `r.sub` と同じ方法で置き換えたものを返す |
| `m.group(groupid=0, *groupids)` | `groupid` 引数 (グループ名またはグループ番号) だけで呼び出した場合は、`groupid` によって識別されるグループとマッチする部分文字列を返す。そのグループがマッチに参加しなかった場合は `None` を返す。複数のグループを渡すと、タプルで返す |
| `m.groupdict(default=None)` | `r` のすべての名前付きグループの名前をキーとして使う辞書を返す |
| `m.groups(default=None)` | `r` のグループごとに要素が1つ含まれたタプルを返す |
| `m[groupid]` | `m.group(groupid)` と同じ |

マッチに参加しなかったグループの値は、`None` になる。`default` を指定すると、`None` の代わりに、その値になる。

```python
import re

m = re.search(r'(?P<area>\d+)-(?P<number>\d+)', 'tel 03-1234')
print(m.group())
print(m.group(1, 2))
print(m['number'])
print(m.span(), m.start('area'), m.end('number'))
print(m.groups())
print(m.groupdict())
```

```text
03-1234
('03', '1234')
1234
(4, 11) 4 11
('03', '1234')
{'area': '03', 'number': '1234'}
```

<pre><code class="caution">一致しなかった search() や match() は None を返す。None に対して m.group() を呼ぶと、AttributeError になる。
if m: のように、None でないことを確認してから、呼び出す。</code></pre>

---

## 正規表現パターン構文 <a id="syntax" data-name="正規表現パターン構文"></a>

| 要素 | 意味 |
| --- | --- |
| `.` | `\n` を除く任意の1文字とマッチする (`DOTALL` フラグが指定されている場合は `\n` ともマッチする) |
| `^` | 文字列の先頭とマッチする (`MULTILINE` モードでは、`\n` の直後ともマッチする) |
| `$` | 文字列の末尾とマッチする。文字列の末尾が改行のときは、その直前にもマッチする (`MULTILINE` モードでは、`\n` の直前ともマッチする) |
| `*` | 直前の正規表現の0回以上の繰り返しとマッチする |
| `+` | 直前の正規表現の1回以上の繰り返しとマッチする |
| `?` | 直前の正規表現の0回または1回の繰り返しとマッチする |
| `*?`、`+?`、`??` | `*`、`+`、`?` の貪欲ではないマッチング (できるだけ少ない繰り返しとマッチする) |
| `{m}` | 直前の正規表現の `m` 回の繰り返しとマッチする |
| `{m,n}` | 直前の正規表現の `m` 回から `n` 回の繰り返しとマッチする。`m` または `n` (またはその両方) を省略してもよい。デフォルト値は `m=0` および `n=infinity` (貪欲なマッチング) |
| `{m,n}?` | 直前の正規表現の `m` 回から `n` 回の繰り返しとマッチする (貪欲ではないマッチング) |
| `[...]` | 角括弧で囲まれた文字の集合のいずれかの文字とマッチする |
| `[^...]` | キャレット (`^`) の後にある文字の集合に含まれていない1文字とマッチする |
| <code>&#124;</code> | 直前にある正規表現、または直後にある正規表現のいずれかとマッチする |
| `(...)` | 丸括弧で囲まれた正規表現とマッチし、グループの始まりと終わりを表す |
| `(?:...)` | `(...)` と同様だが、グループがマッチした文字列を捕捉しない |
| `(?P<name>...)` | `(...)` と同様だが、グループがマッチした文字列に `name` という名前でアクセスできる |
| `(?P=name)` | `name` という名前のグループが以前にマッチしたものとマッチする |
| `\number` | `number` と同じ番号のグループが以前にマッチしたものとマッチする (グループには左から順に 1〜99 の番号が自動的に振られる) |
| `\A` | 空の文字列とマッチするが、文字列全体の先頭でのマッチに限られる |
| `\Z` | 空の文字列とマッチするが、文字列全体の末尾でのマッチに限られる |
| `\b` | 空の文字列とマッチするが、単語の先頭または末尾でのマッチに限られる (単語は英数字の最大シーケンス、`\w` も参照) |
| `\d` | 数字1文字とマッチする。`str` のパターンでは、全角数字などの、Unicode の数字にもマッチする。`ASCII` フラグを指定すると、セット `[0-9]` と同じになる |
| `\D` | `\d` に一致しない1文字とマッチする。`ASCII` フラグを指定すると、セット `[^0-9]` と同じになる |
| `\N{name}` | `name` に対応する Unicode 文字とマッチする |
| `\s` | ホワイトスペース文字とマッチする。`ASCII` フラグを指定すると、セット `[\t\n\r\f\v]` と同じになる |
| `\S` | ホワイトスペースではない文字とマッチする。`ASCII` フラグを指定すると、セット `[^\t\n\r\f\v]` と同じになる |
| `\w` | 英数字とアンダースコア1文字とマッチする。`str` のパターンでは、日本語の文字など、Unicode の英数字にもマッチする。`ASCII` フラグを指定すると、セット `[a-zA-Z0-9_]` と同じになる |
| `\W` | `\w` に一致しない文字とマッチする。`ASCII` フラグを指定すると、セット `[^a-zA-Z0-9_]` と同じになる |
| `(?aiLmsux)` | オプションフラグを設定するもう一つの方法で、常にパターンの先頭に配置する必要がある |
| `(?#...)` | 丸括弧で囲まれている内容はコメントとなる |

### 先読み、後読みなど (追加)

元の表にない、よく使う構文。

| 要素 | 意味 |
| --- | --- |
| `(?=...)` | 先読み。直後に `...` が続く位置とマッチする (`...` の部分は、消費しない) |
| `(?!...)` | 否定の先読み。直後に `...` が続かない位置とマッチする |
| `(?<=...)` | 後読み。直前に `...` がある位置とマッチする (`...` は、固定の長さにする) |
| `(?<!...)` | 否定の後読み。直前に `...` がない位置とマッチする |
| `\B` | 空の文字列とマッチするが、`\b` とマッチしない位置に限られる |
| `*+`、`++`、`?+`、`{m,n}+` | 所有的量指定子。繰り返しを、後戻りしない (Python 3.11 以降) |
| `(?>...)` | アトミックグループ。一度マッチしたら、後戻りしない (Python 3.11 以降) |
| `(?aiLmsux-imsx:...)` | 一部分だけに、フラグを適用する |
| <code>(?(id/name)yes-pattern&#124;no-pattern)</code> | 指定したグループがマッチしていれば `yes-pattern`、そうでなければ `no-pattern` とマッチする |
| `\z` | 文字列全体の末尾でのマッチに限られる (Python 3.14 以降) |

```python
import re

print(re.findall(r'\d+(?=円)', '100円 200ドル'))
print(re.findall(r'(?<=\$)\d+', '$30 40'))
print(re.findall(r'\d+(?!\d|円)', '100円 200ドル'))
print(re.findall(r'<.*>', '<a> b <c>'))
print(re.findall(r'<.*?>', '<a> b <c>'))
```

```text
['100']
['30']
['200']
['<a> b <c>']
['<a>', '<c>']
```

<pre><code class="caution">{m,n} は、カンマの後ろに空白を入れてはいけない。{1, 3} と書くと、繰り返しではなく、その文字列そのものにマッチする。
(?P=name) の name には、山括弧を付けない。</code></pre>

<pre><code class="tips">.* は貪欲で、できるだけ長くマッチする。HTML のタグのように、短い範囲で区切りたいときは、.*? を使う。</code></pre>

---

## オプションフラグ <a id="flags" data-name="オプションフラグ"></a>

- 関数compileに対するオプション引数flagsはハードコーディングされた整数であり、ビット論理和で指定する。

```python
import re
re.compile(pattern, flags=re.IGNORECASE | re.MULTILINE)
```

| 指定子 | 意味 |
| --- | --- |
| `I` または `IGNORECASE` | マッチングで大文字と小文字を区別しない |
| `M` または `MULTILINE` | 特殊文字 `^` と `$` を、各行の先頭及び末尾 (改行の直前と直後) と、文字列全体の先頭および末尾とマッチさせる (`\A` と `\Z` は常に文字列全体の先頭と末尾とのみマッチする) |
| `S` または `DOTALL` | 特殊文字 `.` を (改行を含む) 任意の文字とマッチさせる |
| `X` または `VERBOSE` | パターンに含まれているホワイトスペースが無視されるようになるが、エスケープされているものと文字の集合に含まれているものを除く |
| `U` または `UNICODE` | `\w`、`\W`、`\b`、`\B`、`\d`、`\D` に対する文字を決定するために Unicode 全体を使う。ただし、後方互換性を維持するために、このフラグは現在デフォルトとなっている |
| `A` または `ASCII` | `\w`、`\W`、`\b`、`\B`、`\d`、`\D` に対して ASCII 文字だけを使う。デフォルトの `UNICODE` フラグを上書きする |
| `L` または `LOCALE` | `\w`、`\W`、`\b`、`\B`、`\d`、`\D` に対する文字を決定するために Python の LOCALE 設定を使う。このオプションは `bytes` のパターンでのみ使うことができる |
| `NOFLAG` | フラグを指定しない (値は 0)。Python 3.11 以降 |

`ASCII`、`LOCALE`、`UNICODE` は、同時に指定できない。同時に指定すると、`ValueError` になる。

- compile関数を使って同等の正規表現を定義する方法として次の3つがあるが、読みやすさという点においてはflags引数で明示的に渡す方がよい。

<pre><code class="example">import re

r1 = re.compile(r'(?i)hello')
r2 = re.compile(r'hello', re.I)
r3 = re.compile(r'hello', re.IGNORECASE)</code></pre>

### VERBOSE で読みやすく書く

`VERBOSE` を指定すると、パターンの中に、空白と、`#` から始まるコメントを書ける。

```python
import re

pattern = re.compile(
    r"""
    (?P<year>\d{4})   # 年
    -(?P<month>\d{2}) # 月
    """,
    re.VERBOSE,
)
print(pattern.search('on 2026-11').groupdict())
```

```text
{'year': '2026', 'month': '11'}
```

### MULTILINE と DOTALL

```python
import re

print(re.findall(r'^\d+$', '12\n34', re.MULTILINE))
print(re.findall(r'a.b', 'a\nb'))
print(re.findall(r'a.b', 'a\nb', re.DOTALL))
```

```text
['12', '34']
[]
['a\nb']
```

---

## エスケープ文字 <a id="escape" data-name="エスケープ文字"></a>

`re` は、Python の文字列リテラルと同じ、エスケープシーケンスを、パターンの中で解釈する。`r'...'` で書いたときは、Python ではなく、`re` が解釈する。

### 制御文字

| エスケープ文字 | 意味 |
| --- | --- |
| `\n` | 改行 |
| `\t` | タブ |
| `\r` | キャリッジリターン |
| `\b` | バックスペース (文字の集合 `[\b]` の中だけ。それ以外では、単語境界) |
| `\f` | 改ページ |
| `\v` | 垂直タブ |

### 特殊文字

| エスケープ文字 | 意味 |
| --- | --- |
| `\'` | シングルクォート |
| `\"` | ダブルクォート |
| `\\` | バックスラッシュ |

### 数値、Unicode 関連

| エスケープ文字 | 意味 |
| --- | --- |
| `\uXXXX` | 16ビットの Unicode 文字 (4桁) |
| `\UXXXXXXXX` | 32ビットの Unicode 文字 (8桁) |
| `\N{name}` | Unicode 文字名で指定 |
| `\xXX` | 16進数で表記 (2桁) |
| `\ooo` | 8進数で表記 (3桁) |

### 正規表現でのエスケープ

特殊文字を、普通の文字として扱うときは、バックスラッシュを付ける。

| エスケープ文字 | 意味 |
| --- | --- |
| `\.` | ピリオド |
| `\^` | キャレット |
| `\$` | ドル |
| `\*` | アスタリスク |
| `\+` | プラス |
| `\?` | クエスチョン |
| <code>\&#124;</code> | or を無効化 |
| `\(`、`\)` | 丸括弧 |
| `\[`、`\]` | 角括弧 |
| `\{`、`\}` | 波括弧 |

ユーザーの入力などを、そのままパターンに埋め込むときは、`re.escape()` で、特殊文字をエスケープする。

```python
import re

print(re.escape('a.b*c'))
print(re.findall(re.escape('a.b'), 'a.b axb'))
```

```text
a\.b\*c
['a.b']
```

---

## 使い方の例 <a id="usage" data-name="使い方の例"></a>

### グループと findall

`findall()` は、パターンにグループがあると、一致した全体ではなく、グループの内容を返す。

```python
import re

print(re.findall(r'\w\d', 'a1 b2'))
print(re.findall(r'(\w)\d', 'a1 b2'))
print(re.findall(r'(\w)(\d)', 'a1 b2'))
print(re.findall(r'(?:\w)\d', 'a1 b2'))
```

```text
['a1', 'b2']
['a', 'b']
[('a', '1'), ('b', '2')]
['a1', 'b2']
```

### 置換 (sub)

```python
import re

print(re.sub(r'(\w+) (\w+)', r'\2 \1', 'hello world'))
print(re.sub(r'(\d{4})-(\d{2})-(\d{2})', r'\3/\2/\1', '2026-11-28'))
print(re.sub(r'(?P<w>\w+)!', r'<\g<w>>', 'hi!'))
print(re.sub(r'\d+', lambda m: str(int(m.group()) * 2), 'a1 b22'))
print(re.subn(r'\d', '#', 'a1b22'))
```

```text
world hello
28/11/2026
<hi>
a2 b44
('a#b##', 3)
```

### 分割 (split)

パターンにグループがあると、区切りの文字列も、結果に含まれる。

```python
import re

print(re.split(r'\d', 'a1b2c'))
print(re.split(r'(\d)', 'a1b2c'))
print(re.split(r'\d', 'a1b2c', maxsplit=1))
```

```text
['a', 'b', 'c']
['a', '1', 'b', '2', 'c']
['a', 'b2c']
```

### 繰り返しの検索 (finditer)

位置の情報も必要なときは、`finditer()` を使う。

```python
import re

for m in re.finditer(r'\d+', 'a12 b345'):
    print(m.group(), m.span())
```

```text
12 (1, 3)
345 (5, 8)
```

---

## 実践例 <a id="examples" data-name="実践例"></a>

### ログの行を解析する

名前付きグループで、行の各部分を取り出す。形式に合わない行は、`fullmatch()` が `None` を返すので、読み飛ばせる。

```python
import re

LOG = re.compile(
    r'(?P<time>\d{2}:\d{2}:\d{2}) '
    r'\[(?P<level>[A-Z]+)\] '
    r'(?P<message>.*)'
)

lines = [
    '10:00:01 [INFO] server started',
    '10:00:05 [ERROR] connection failed: timeout',
    'invalid line',
]

for line in lines:
    m = LOG.fullmatch(line)
    if m is None:
        print('skip:', line)
        continue
    d = m.groupdict()
    print(d['time'], d['level'], d['message'])
```

```text
10:00:01 INFO server started
10:00:05 ERROR connection failed: timeout
skip: invalid line
```

### 数字に桁区切りを入れる

後読みと先読みを使って、3桁ごとの位置に、`,` を挿入する。

```python
import re


def add_commas(digits):
    """数字の文字列に、3桁ごとの区切りを入れる"""
    return re.sub(r'(?<=\d)(?=(?:\d{3})+\Z)', ',', digits)


print(add_commas('1234567'))
print(add_commas('999'))
```

```text
1,234,567
999
```

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `re.match()` で、文字列の途中にある語が見つからない | `match()` は、文字列の先頭だけを調べる | `re.search()` を使う |
| `findall()` が、一致した全体ではなく、一部だけを返す | パターンにグループがあると、グループの内容だけが返る | 不要なグループは `(?:...)` にする。または `finditer()` を使う |
| `findall()` の結果に、空文字列が混ざる | マッチに参加しなかったグループは、空文字列になる | パターンを見直す。または `finditer()` で、グループごとに確認する |
| `.*` が、意図より長くマッチする | `*` は貪欲で、できるだけ長くマッチする | `.*?` にする。または、`[^>]*` のように、範囲を絞る |
| `re.sub('a', 'b', s, re.I)` で、大文字小文字が無視されない | 4番目の引数は、`flags` ではなく `count` である | `flags=re.I` と、キーワード引数で渡す (Python 3.13 以降は、位置引数で `DeprecationWarning`) |
| `'\b'` や `'\d'` が、意図通りに動かない | `r'...'` を付けておらず、Python が先にバックスラッシュを解釈した | `r'\b'` のように、raw 文字列にする |
| `$` が、末尾の改行の手前にもマッチする | `$` は、文字列の末尾の改行の直前にもマッチする | 文字列全体の一致なら `fullmatch()`。末尾だけなら `\Z` を使う |
| `.` が、改行にマッチしない | `.` は、既定では `\n` を含まない | `re.DOTALL` を指定する。または `(?s:.)` を使う |
| `\d` や `\w` が、全角の数字や日本語にもマッチする | `str` のパターンでは、Unicode が既定である | `re.ASCII` を指定する。または `[0-9]` のように、文字の集合で書く |
| `{1, 3}` が、繰り返しにならない | 波括弧の中に、空白を入れている | `{1,3}` と書く |
| `AttributeError` (`'NoneType' object has no attribute 'group'`) | 一致せず、`None` に対して `group()` を呼んだ | `if m:` で、`None` でないことを確認する |
| `re.error` (`bad escape`、`unterminated subpattern`) | パターンの構文が、不正である | 括弧の対応と、意味のないエスケープ (`\q` など) を確認する |
| `TypeError` (`cannot use a bytes pattern on a string-like object`) | `bytes` のパターンと、`str` の文字列を、混ぜている | パターンと文字列の型を、そろえる |
| 特定の入力で、処理が終わらない | `(a+)+` のような、入れ子の繰り返しで、後戻りが爆発的に増える | パターンを単純にする。外部の入力に使うときは、入力の長さを制限する。所有的量指定子 (Python 3.11 以降) も使える |

---

## 関連 <a id="related" data-name="関連"></a>

| モジュール、ドキュメント | 用途 |
| --- | --- |
| `str` のメソッド | `find()`、`startswith()`、`replace()`、`split()` など。単純な検索や置換は、こちらで足りる |
| `fnmatch`、`glob` | ファイル名の、ワイルドカード形式のパターンマッチ |
| `regex` | PyPI の、サードパーティのモジュール。`re` と互換性のある API で、追加の機能を持つ |
| 「正規表現」のドキュメント | 言語を問わない、正規表現の一般的なノート |
