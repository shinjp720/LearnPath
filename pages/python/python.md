---
title: Python
layout: default
---

# Python <a id="top" data-name="TOP"></a>

---

## 基本 <a id="basic" data-name="基本"></a>

### コメント

コメントは **#** で行末まで。

```python
x = 10  # 行末コメント
```

`'''` または `"""` で囲んだものは、本来は **複数行の文字列リテラル** であり、コメントではない。<br>
式文として置くと結果的に無視されるので複数行コメントのように使えるが、モジュール・クラス・関数の先頭に置くと **docstring** として扱われるため、コメント用途にはなるべく使わない。

### 変数と基本の型

```python
x = 10          # int
y = 3.14        # float
z = 1 + 2j      # complex
s = "hello"     # str
b = True        # bool
n = None        # NoneType
```

Python の変数は「値を入れる箱」ではなく、**オブジェクトに付けた名前(ラベル)**。<br>
代入 `a = b` は、b が指しているオブジェクトに a という名前を付け足すだけで、値のコピーは行われない。

| 型 | 例 | ミュータブル |
| --- | --- | --- |
| `int` | `42` | ✕ |
| `float` | `3.14` | ✕ |
| `bool` | `True` | ✕ |
| `str` | `"abc"` | ✕ |
| `tuple` | `(1, 2)` | ✕ |
| `frozenset` | `frozenset({1})` | ✕ |
| `bytes` | `b"abc"` | ✕ |
| `list` | `[1, 2]` | ○ |
| `dict` | `{"a": 1}` | ○ |
| `set` | `{1, 2}` | ○ |

```python
type(10)                 # <class 'int'>
isinstance(10, int)      # True
isinstance(True, int)    # True ← bool は int のサブクラス
```

#### 数値リテラル

```python
1_000_000   # 桁区切りの _ が使える (3.6+)
0b1010      # 2進数 → 10
0o17        # 8進数 → 15
0xFF        # 16進数 → 255
1e3         # 1000.0 (float)
```

- `int` は桁数に上限がない (メモリの許す限り大きくなる)
- `True` は `1`、`False` は `0` として計算できる (`True + True` は `2`)

#### 型変換

```python
int("42")        # 42
int("ff", 16)    # 255 (基数を指定)
int(3.9)         # 3   (0 方向への切り捨て。四捨五入ではない)
int("3.5")       # ValueError (文字列の小数は直接 int にできない)
float("1.5")     # 1.5
str(10)          # '10'
list("abc")      # ['a', 'b', 'c']
tuple([1, 2])    # (1, 2)
set([1, 1, 2])   # {1, 2}
```

### truthy と falsy

`if` や `while`、`and` / `or` / `not` では、値は真偽値として評価される。<br>
**falsy** (偽として扱われる) 値は次のもので、**それ以外はすべて truthy**。

```python
None
False
0, 0.0, 0j
"", [], (), {}, set(), range(0)   # 空のもの
```

```python
bool("False")   # True  ← 空でない文字列は truthy
bool([0])       # True  ← 要素があれば中身が 0 でも truthy
bool(" ")       # True  ← 空白 1 文字も truthy
```

<pre><code class="tips">自作クラスは __bool__ (なければ __len__) を定義すると、truthy / falsy を制御できる。</code></pre>

### 制御構文

```python
# if
if x > 0:
    print("正")
elif x == 0:
    print("ゼロ")
else:
    print("負")
```

```python
# for / while
for i in range(3):          # 0, 1, 2
    print(i)

for i, v in enumerate(["a", "b"], start=1):
    print(i, v)             # 1 a / 2 b

n = 3
while n > 0:
    n -= 1
```

```python
# break / continue / pass
for i in range(10):
    if i == 3:
        continue    # 次の周回へ
    if i == 6:
        break       # ループを抜ける
    pass            # 何もしない (構文上、文が必要な場所に置く)
```

`for` / `while` には `else` を付けられる。**break されずにループが終了したとき**に実行される。

```python
for x in [1, 3, 5]:
    if x % 2 == 0:
        print("偶数あり")
        break
else:
    print("偶数なし")   # break されなかったので実行される
```

#### match 文 (3.10+)

```python
def handle(cmd):
    match cmd:
        case "start":
            return "開始"
        case "stop" | "quit":          # 複数パターン (OR)
            return "停止"
        case [x, y]:                   # 2要素のシーケンス
            return f"座標 {x}, {y}"
        case {"type": "user", "name": name}:   # 辞書
            return f"user: {name}"
        case int(n) if n > 0:          # 型 + ガード条件
            return f"正の整数 {n}"
        case _:                        # どれにもマッチしない場合
            return "不明"
```

<pre><code class="caution">case の直後に書いた単独の名前 (case x:) は「比較」ではなく「キャプチャ(代入)」になる。
定数と比較したいときは Color.RED のようにドット付きで書く。</code></pre>


### shebang(シェバン)

UNIX系のシステムでは、ファイルのパーミッションビット **x** と **r** を設定し、次のような **shebang行** でスクリプトを開始すると、スクリプトを直接実行できるようになる。<br>

<pre><code>#!/usr/bin/env python3</code></pre>

`env` が PATH から python を探して起動するので、インタプリタの絶対パスに依存しない。<br>
`chmod +x script.py` で実行権限を付けると、`./script.py` で実行できる。

---

## 演算子 <a id="operator" data-name="演算子"></a>

### 演算子の一覧

- **算術**: `+` `-` `*` `/` `//` `%` `**` `@`
- **代入**: `=` `+=` `-=` `*=` `/=` `//=` `%=` `**=` `@=` ほか、`:=` (代入式)
- **比較**: `==` `!=` `<` `>` `<=` `>=`
- **論理**: `and` `or` `not`
- **ビット**: `&` `|` `^` `~` `<<` `>>`
- **メンバーシップ**: `in` `not in`
- **同一性**: `is` `is not`
- **条件式 (三項演算子)**: `A if 条件 else B`
- **アンパック**: `*` `**`

### 算術演算子

| 演算子 | 名前 | 例 | 結果 |
| --- | --- | --- | --- |
| `+` | 加算 | `7 + 2` | `9` |
| `-` | 減算 | `7 - 2` | `5` |
| `*` | 乗算 | `7 * 2` | `14` |
| `/` | 除算 (真の除算) | `7 / 2` | `3.5` |
| `//` | 切り捨て除算 | `7 // 2` | `3` |
| `%` | 剰余 | `7 % 2` | `1` |
| `**` | べき乗 | `2 ** 10` | `1024` |
| `@` | 行列積 | (後述) | |

#### `/` `//` `%` の違い

- `/` は割り切れる場合でも **常に float** を返す。`6 / 3` は `2.0`
- `//` は **負の無限大方向への切り捨て (floor)**。0 方向への切り捨てではない
- `%` の結果の符号は **右辺と同じ**。常に `a == (a // b) * b + a % b` が成り立つ

```python
7 // 2      # 3
-7 // 2     # -4  ← -3 ではない
7 // -2     # -4
-7 // -2    # 3

7 % 3       # 1
-7 % 3      # 2   (-7 == (-3) * 3 + 2)
7 % -3      # -2

divmod(7, 2)    # (3, 1)   商と余りを同時に求める
divmod(-7, 2)   # (-4, 1)
```

<pre><code class="caution">C や Java の % は 0 方向への切り捨てを前提にしているため、負数では結果が異なる。
C と同じ符号の剰余が欲しい場合は math.fmod() を使う。</code></pre>

0 での除算は、整数でも浮動小数点数でも `ZeroDivisionError` になる。

```python
1 / 0      # ZeroDivisionError
1 // 0    # ZeroDivisionError
1 % 0     # ZeroDivisionError
1.0 / 0   # ZeroDivisionError (C のように inf にはならない)
```

#### `**` べき乗

```python
2 ** 3        # 8
2 ** -1       # 0.5   (負の指数は float になる)
2 ** 0.5      # 1.4142135623730951
(-8) ** 0.5   # 複素数になる
pow(2, 10, 1000)   # 24 (2 ** 10 % 1000 と同じ。ただし高速)
```

`**` は **右結合** で、**左側の単項演算子よりも強く結合** する。

```python
2 ** 3 ** 2    # 512  ← 2 ** (3 ** 2)
-2 ** 2        # -4   ← -(2 ** 2)
(-2) ** 2      # 4
2 ** -2        # 0.25 ← 右側の単項マイナスは先に評価される
```

#### 整数と浮動小数点数

```python
2 ** 100    # 1267650600228229401496703205376 (int は桁あふれしない)

0.1 + 0.2             # 0.30000000000000004
0.1 + 0.2 == 0.3      # False
```

float は 2 進数の近似値なので誤差が出る。比較には `math.isclose()`、正確な 10 進数計算には `decimal` を使う。

```python
import math
from decimal import Decimal

math.isclose(0.1 + 0.2, 0.3)                       # True
Decimal("0.1") + Decimal("0.2") == Decimal("0.3")  # True (文字列から作る)
```

```python
round(0.5)    # 0   ← 四捨五入ではなく「偶数丸め(銀行丸め)」
round(1.5)    # 2
round(2.5)    # 2
round(2.675, 2)   # 2.67 (float の誤差のため 2.68 にならない)

int(-3.9)         # -3  (0 方向)
math.floor(-3.9)  # -4  (負の無限大方向)
math.ceil(-3.9)   # -3  (正の無限大方向)
```

#### 文字列・シーケンスに対する `+` と `*`

```python
"ab" + "cd"     # 'abcd'
"ab" * 3        # 'ababab'
[1, 2] + [3]    # [1, 2, 3]
[0] * 3         # [0, 0, 0]
(1,) * 3        # (1, 1, 1)

"a" + 1         # TypeError (暗黙の型変換はしない)
"a" + str(1)    # 'a1'
```

<pre><code class="caution">grid = [[0] * 3] * 3      # 内側のリストが 3 つとも同じオブジェクトになる
grid[0][0] = 1
print(grid)               # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]

grid = [[0] * 3 for _ in range(3)]   # 正しい作り方 (内包表記)</code></pre>

ループの中で `s += "..."` を繰り返すと遅くなりやすいので、大量に連結する場合は `"".join(parts)` を使う。

#### `@` 行列積 (3.5+)

組み込み型には実装されていない。NumPy の配列などが `__matmul__` を定義している。

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
a @ b      # [[19, 22], [43, 50]]
```

### 代入演算子

#### 複合代入 (増分代入)

| 演算子 | 同じ意味 |
| --- | --- |
| `x += 1` | `x = x + 1` |
| `x -= 1` | `x = x - 1` |
| `x *= 2` | `x = x * 2` |
| `x /= 2` | `x = x / 2` |
| `x //= 2` | `x = x // 2` |
| `x %= 2` | `x = x % 2` |
| `x **= 2` | `x = x ** 2` |
| `x @= m` | `x = x @ m` |

ビット演算にも同じ形がある。

```text
x &= m    x |= m    x ^= m    x <<= n    x >>= n
```

<pre><code class="tips">Python には ++ と -- はない。 x++ は SyntaxError。 ++x は +(+x) と解釈され、何も起きない。 x += 1 と書く。</code></pre>

#### 連続代入とアンパック代入

```python
a = b = 0                       # 同じオブジェクトに a と b の2つの名前を付ける
a, b = 1, 2                     # タプルのアンパック
a, b = b, a                     # 値の入れ替え (一時変数は不要)

first, *rest = [1, 2, 3, 4]     # first=1, rest=[2, 3, 4]
*init, last = [1, 2, 3]         # init=[1, 2], last=3
head, *mid, tail = range(5)     # head=0, mid=[1, 2, 3], tail=4
(a, b), c = (1, 2), 3           # ネストも可能
_, y = (10, 20)                 # 使わない値は _ で受ける

a, b = 1, 2, 3                  # ValueError (要素数が合わない)
```

<pre><code class="caution">a = b = []     # a と b は同じリスト
a.append(1)
print(b)       # [1] ← b も変わる</code></pre>

#### 複合代入とミュータブルオブジェクト

リストなどのミュータブルなオブジェクトに対する `+=` は、**新しいオブジェクトを作らず、元のオブジェクトを書き換える** (in-place)。<br>
`x = x + y` は新しいオブジェクトを作って名前を付け替える。

```python
a = [1, 2]
b = a

b += [3]       # 元のリストを書き換える (extend と同じ)
print(a)       # [1, 2, 3] ← a も変わる

b = b + [4]    # 新しいリストを作って b に付け替える
print(a)       # [1, 2, 3] ← a は変わらない
```

イミュータブルなオブジェクトでは、`+=` は常に新しいオブジェクトを作る。

```python
s = "ab"
t = s
t += "c"
print(s)   # 'ab'  (s は変わらない)
```

<pre><code class="caution">t = ([1], 2)
t[0] += [9]    # TypeError: 'tuple' object does not support item assignment
print(t)       # ([1, 9], 2) ← エラーなのにリストの中身は変更されている</code></pre>

#### 代入式 (ウォルラス演算子 `:=`) 3.8+

式の中で代入を行い、その値を返す。

```python
# 値を2回計算しないで済む
if (n := len(data)) > 10:
    print(f"{n} 件は多すぎる")

# 読み込みループ
while (line := f.readline()):
    print(line)

# 内包表記の中で変換結果を再利用
results = [y for x in data if (y := f(x)) is not None]
```

`x := 1` を単独の文として書くことはできない。必要に応じて括弧で囲む。

### 比較演算子

```python
1 == 1     # True   等しい
1 != 2     # True   等しくない
1 < 2      # True
1 <= 1     # True
2 > 1      # True
2 >= 3     # False
```

結果は常に `bool`。

#### 連鎖比較

比較演算子は **つなげて書ける**。`a < b < c` は `a < b and b < c` と同じ意味で、`b` は **一度しか評価されない**。

```python
x = 5
1 < x < 10          # True  (1 < x and x < 10)
0 <= i < len(lst)   # インデックス範囲のチェックに便利
a == b == c         # 3つとも等しいか
1 < 2 > 1.5         # True  (1 < 2 and 2 > 1.5)
```

#### 型をまたぐ比較

```python
1 == 1.0           # True
1 == True          # True  (bool は int のサブクラス)
"1" == 1           # False (等値比較は False になるだけ)
[1, 2] == (1, 2)   # False (list と tuple は等しくならない)

1 < "a"            # TypeError (大小比較は型が違うとエラー)
```

#### 辞書式比較

文字列・リスト・タプルは **先頭から順に** 比較される。

```python
"apple" < "banana"       # True  (文字コード順)
"a" < "B"                # False ('a'=97, 'B'=66)
[1, 2, 3] < [1, 3]       # True  (2 < 3 で決まる)
(1, 2) < (1, 2, 0)       # True  (先頭が同じなら短い方が小さい)
```

<pre><code class="tips">タプルの辞書式比較は、sorted() の key で「複数条件でのソート」に使える。
sorted(people, key=lambda p: (p.age, p.name))   # 年齢順、同じなら名前順</code></pre>

#### その他の注意点

```python
nan = float("nan")
nan == nan             # False ← NaN は自分自身とも等しくない
math.isnan(nan)        # True  ← 判定は isnan() を使う

x == None              # 動くが非推奨
x is None              # None との比較は is を使う
```

### 論理演算子

```python
A and B
A or B
not A
```

論理演算子は **True / False ではなく、オペランドそのもの** を返す。

| 式 | 返す値 |
| --- | --- |
| `A and B` | A が falsy なら **A**、そうでなければ **B** |
| `A or B` | A が truthy なら **A**、そうでなければ **B** |
| `not A` | 常に `bool` (`True` / `False`) |

```python
0 and 5            # 0
3 and 5            # 5
"" or "default"    # 'default'
"x" or "default"   # 'x'
not 0              # True
not "a"            # False
```

#### 短絡評価

結果が決まった時点で、**右側は評価されない**。

```python
def f():
    print("called")
    return True

False and f()   # f は呼ばれない
True or f()     # f は呼ばれない
```

#### `or` (デフォルト値)

A が truthy であれば A を返し、さもなければ B を返す。

```python
result = A or B
```

```python
name = input_name or "unknown"
```

<pre><code class="caution">count = 0
n = count or 10                          # 10 ← 0 は falsy なので置き換わってしまう
n = 10 if count is None else count       # 0   ← None のときだけ置き換えたい場合</code></pre>

#### `and` (ガード)

左側が成り立つときだけ右側を評価したい場面で使う。

```python
if lst and lst[0] == 1:    # 空リストなら lst[0] は評価されない
    ...

name = user and user.name  # user が None なら None のまま
```

<pre><code class="caution">x = cond and A or B   # 「A if cond else B」の代わりに使われることがあるが、A が falsy だと B になってしまう。
                      # 三項演算子を使うこと。</code></pre>

#### 優先順位: `not` > `and` > `or`

```python
True or False and False      # True   ← True or (False and False)
(True or False) and False    # False
not True == False            # True   ← not (True == False)。比較の方が not より強い
```

#### `all()` / `any()` との対応

`all()` は `and` の連続、`any()` は `or` の連続にあたる。

```python
all([a, b, c])   # a and b and c (ただし bool を返す)
any([a, b, c])   # a or b or c   (ただし bool を返す)
```

### ビット演算子

整数を **2 進数のビット列** として演算する。

```text
a & b    AND  両方が 1 なら 1
a | b    OR   どちらかが 1 なら 1
a ^ b    XOR  異なれば 1
~a       NOT  全ビット反転 (= -a - 1)
a << n   左シフト (= a * 2 ** n)
a >> n   右シフト (= a // 2 ** n)
```

```python
a = 0b1100   # 12
b = 0b1010   # 10

bin(a & b)   # '0b1000'
bin(a | b)   # '0b1110'
bin(a ^ b)   # '0b110'
~a           # -13
a << 2       # 48
a >> 2       # 3
```

Python の `int` は **無限桁の 2 の補数** として扱われる。

```python
-1 & 0xFF     # 255  (下位 8 ビットを取り出す)
-5 & 0xFF     # 251
-8 >> 1       # -4   (算術シフト: 符号が保たれる)
-1 >> 10      # -1
1 << -1       # ValueError (負のシフト数は不可)
```

#### フラグ管理

```python
READ, WRITE, EXEC = 1, 2, 4     # 0b001, 0b010, 0b100

perm = READ | WRITE             # 3  フラグをまとめる
perm & WRITE                    # 2  (truthy → 持っている)
perm |= EXEC                    # 7  フラグを追加
perm &= ~WRITE                  # 5  フラグを削除
perm ^= READ                    # 4  フラグを反転
```

#### よく使うイディオム

```python
n & 1                  # 1 なら奇数、0 なら偶数
(n & (n - 1)) == 0     # n が 2 の冪か (n > 0 のとき)
n << 3                 # n * 8
(5).bit_count()        # 2  (1 のビットの数。3.10+)
(255).bit_length()     # 8  (必要なビット数)
```

#### `&` `|` `^` が使えるその他の型

```python
{1, 2} | {3}           # {1, 2, 3}  集合の和集合
{1, 2} & {2, 3}        # {2}
{"a": 1} | {"b": 2}    # {'a': 1, 'b': 2}  辞書のマージ (3.9+)
True & False           # False (bool 同士は bool を返す)
True | 2               # 3     (bool と int は int になる)
```

<pre><code class="caution">&amp; と | は and / or と違い短絡評価されず、比較演算子よりも優先順位が高い。
a == 1 &amp; b == 2        → a == (1 &amp; b) == 2 と解釈される
(a == 1) &amp; (b == 2)    → 括弧が必要 (NumPy / pandas で条件を組み合わせるときは特に注意)</code></pre>

### メンバーシップ演算子

```python
2 in [1, 2, 3]        # True
4 not in (1, 2, 3)    # True
"a" in "banana"       # True  (文字列では部分文字列かどうか)
"k" in {"k": 1}       # True  (辞書ではキーを調べる)
1 in {"k": 1}         # False (値は調べない)
1 in {"k": 1}.values()   # True (値を調べるなら values())
3 in range(5)         # True
"" in "abc"           # True  (空文字列は常に含まれる)
```

`not x in y` よりも `x not in y` を使う。

| 型 | `in` の計算量 |
| --- | --- |
| `list` / `tuple` / `str` | O(n) (先頭から順に探す) |
| `set` / `dict` | O(1) (平均。ハッシュで探す) |

大量のデータに対して何度も `in` を使う場合は、先に `set` に変換する。

```python
allowed = {"a", "b", "c"}
if x in allowed:       # list より高速
    ...
```

<pre><code class="caution">if x == 1 or 2:        # ❌ (x == 1) or 2 と解釈され、常に truthy
if x == 1 or x == 2:   # ○
if x in (1, 2):        # ○ こちらが簡潔</code></pre>

### 同一性演算子

`is` は **2つの名前が同じオブジェクトを指しているか** (`id()` が等しいか) を調べる。

```python
a = [1, 2]
b = a
c = [1, 2]

a is b     # True   (同じオブジェクト)
a is c     # False  (中身は同じだが別のオブジェクト)
a == c     # True   (値が等しい)
a is not c # True
```

| 演算子 | 比較するもの | オーバーロード |
| --- | --- | --- |
| `==` | 値が等しいか (`__eq__`) | できる |
| `is` | 同じオブジェクトか (`id`) | できない |

- `None` `True` `False` との比較には `is` を使う (`if x is None:`)
- 数値や文字列の比較に `is` を使ってはいけない

```python
a = 256; b = 256
a is b     # True  (小さい整数 -5〜256 はキャッシュされる)

a = 1000; b = 1000
a is b     # 実装やコードの書き方によって True にも False にもなる

x is 1     # SyntaxWarning: "is" with a literal (3.8+)
```

### 三項演算子 (条件式)

条件が真のとき A となり、それ以外は B となる。

```python
A if 条件 else B
```

```python
label = "adult" if age >= 20 else "minor"
print("yes" if ok else "no")
```

- 先に **条件** が評価され、選ばれた側だけが評価される
- `else` は省略できない (内包表記の末尾の `if` は別物 → [内包表記](#comprehension))
- 優先順位が低いので、`1 + 2 if c else 3` は `(1 + 2) if c else 3` になる
- ネストできるが、読みにくくなるなら `if` 文に書き直す

```python
grade = "A" if score >= 90 else "B" if score >= 80 else "C"
# 「A if score >= 90 else ("B" if score >= 80 else "C")」と同じ
```

### アンパック演算子 `*` `**`

リスト・タプル・集合・辞書の **リテラルの中** でも使える (3.5+)。

```python
a = [1, 2]
b = [3, 4]

[*a, *b]        # [1, 2, 3, 4]
[0, *a, 9]      # [0, 1, 2, 9]
(*a, 5)         # (1, 2, 5)
{*a, *b}        # {1, 2, 3, 4}
print(*a)       # 1 2   (関数呼び出しの展開)

d1 = {"x": 1, "y": 2}
d2 = {"y": 99, "z": 3}

{**d1, **d2}    # {'x': 1, 'y': 99, 'z': 3}  ← 後ろが優先
{**d1, "x": 0}  # {'x': 0, 'y': 2}
```

関数の引数での `*args` / `**kwargs` については [可変長引数](#args) を参照。

### その他の演算子

- `.` (属性アクセス)、`[]` (添字)、`()` (呼び出し) は **最も優先順位が高い** 演算子
- `lambda` は最も優先順位が低い演算子の1つ
- `%` は文字列にも使える (旧式のフォーマット。現在は f-string が推奨)

```python
"%s は %d 歳" % ("Alice", 25)   # 'Alice は 25 歳'
"%.2f" % 3.14159               # '3.14'
```

### 演算子の優先順位

上にあるものほど先に評価される。

```text
 1. (expr) [expr] {k: v}                          括弧・リテラル
 2. x[i] x[i:j] x(args) x.attr                    添字・スライス・呼び出し・属性
 3. await x
 4. **                                            べき乗 (右結合)
 5. +x -x ~x                                      単項演算子
 6. * @ / // %
 7. + -
 8. << >>
 9. &
10. ^
11. |
12. in, not in, is, is not, <, <=, >, >=, !=, ==  比較 (連鎖できる)
13. not x
14. and
15. or
16. A if 条件 else B
17. lambda
18. :=
```

- 同じ優先順位は **左から右** に評価される (`8 / 4 / 2` は `(8 / 4) / 2` で `1.0`)。例外は `**` (右結合)
- C 言語とは異なり、**比較より `&` `|` `^` の方が優先順位が高い**
- `not` は比較より低いので `not a == b` は `not (a == b)`
- 迷ったら **括弧を付ける**

```python
x & 1 == 0         # (x & 1) == 0  (C では x & (1 == 0) になる)
-2 ** 2            # -(2 ** 2) = -4
not 1 == 2         # True
1 + 2 * 3 ** 2     # 1 + (2 * (3 ** 2)) = 19
```

### 演算子オーバーロード

演算子は、対応する **特殊メソッド** を呼び出す構文になっている。自作クラスに定義すれば、演算子が使えるようになる。

```text
a + b     a.__add__(b)      (NotImplemented なら b.__radd__(a))
a - b     __sub__
a * b     __mul__
a / b     __truediv__
a // b    __floordiv__
a % b     __mod__
a ** b    __pow__
a @ b     __matmul__
a & b     __and__
a | b     __or__
a ^ b     __xor__
a << b    __lshift__
a >> b    __rshift__
-a        __neg__
+a        __pos__
~a        __invert__
a == b    __eq__
a != b    __ne__            (未定義なら __eq__ の否定)
a < b     __lt__
a <= b    __le__
a > b     __gt__
a >= b    __ge__
a += b    __iadd__          (未定義なら a = a + b)
x in a    __contains__
a[i]      __getitem__
len(a)    __len__
bool(a)   __bool__          (未定義なら __len__)
abs(a)    __abs__
```

`and` `or` `not` `is` はオーバーロードできない。

```python
class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        if not isinstance(other, Vec):
            return NotImplemented
        return Vec(self.x + other.x, self.y + other.y)

    def __mul__(self, k):
        return Vec(self.x * k, self.y * k)

    def __rmul__(self, k):          # 2 * v のとき (左辺が int で処理できない場合)
        return self * k

    def __eq__(self, other):
        if not isinstance(other, Vec):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __repr__(self):
        return f"Vec({self.x}, {self.y})"

v = Vec(1, 2) + Vec(3, 4)   # Vec(4, 6)
v * 2                       # Vec(8, 12)
2 * v                       # Vec(8, 12)
v == Vec(4, 6)              # True
```

- `NotImplemented` を返すと、Python は右辺側の反射メソッド (`__radd__` など) を試し、それも無ければ `TypeError` にする (`NotImplementedError` とは別物)
- `__eq__` を定義すると `__hash__` が `None` になり、そのままでは辞書のキーや集合の要素に使えない
- 大小比較は `functools.total_ordering` を使うと、`__eq__` と `__lt__` だけで残りを補ってくれる

### 演算子のよくある落とし穴

- `-7 // 2` は `-4`、`-7 % 3` は `2` (負数の除算は floor)
- `-2 ** 2` は `-4` (単項マイナスより `**` が強い)
- `0.1 + 0.2 == 0.3` は `False` (浮動小数点の誤差)
- `x == 1 or 2` は常に truthy (`x in (1, 2)` と書く)
- `a = b = []` や `[[0] * 3] * 3` は同じオブジェクトを共有する
- `lst += [x]` は元のリストを書き換えるが、`lst = lst + [x]` は書き換えない
- `x or default` は `0` や `""` も置き換えてしまう (`is None` で判定する)
- `a == 1 & b == 2` は意図通りに動かない (括弧が必要)
- 値の比較に `is` を使わない (`None` との比較のみ `is`)
- Python に `++` `--` はない

---

## リスト <a id="list" data-name="リスト"></a>

- 複数の値を順序付きで保持する
- ミュータブル
- 異なる型も格納できる

### 生成

```python
nums = [1, 2, 3]
mixed = [1, "hello", 3.14]
```

### アクセス

```python
nums[0]     # 1
nums[-1]    # 3（後ろから）

nums[0:2]   # [1, 2]
nums[:2]    # 先頭から
nums[1:]    # 途中から最後まで
nums[::-1]  # 逆順
```

### スライス

```python
sequence[start:stop:step]
```

以下の表では `a = [0, 1, 2, 3, 4, 5]` とする。

| 構文 | 意味 | 結果 |
| --- | --- | --- |
| `a[:]` | 全体 | `[0,1,2,3,4,5]` |
| `a[1:]` | 1番目以降 | `[1,2,3,4,5]` |
| `a[:3]` | 3番目の手前まで | `[0,1,2]` |
| `a[1:4]` | 1～3番目 | `[1,2,3]` |
| `a[-1]` | 最後の要素 | 5 |
| `a[:-1]` | 最後以外 | `[0,1,2,3,4]` |
| `a[-2:]` | 最後の2要素 | `[4,5]` |
| `a[::2]` | 2つおき | `[0,2,4]` |
| `a[1::2]` | 1番目から2つおき | `[1,3,5]` |
| `a[::-1]` | 逆順 | `[5,4,3,2,1,0]` |
| `a[::-2]` | 逆順で2つおき | `[5,3,1]` |
| `a[5:1:-1]` | 5→2まで逆方向 | `[5,4,3,2]` |

1. start は含まれる
2. stop は含まれない
3. step の符号で進む方向が決まる
    - step > 0 : 左から右
    - step < 0 : 右から左

### 値の再代入

```python
nums[0] = 10
```

### スライスへの代入と削除

スライスに代入すると、**範囲をまとめて置き換え** られる。要素数は変わってもよい。

```python
nums = [0, 1, 2, 3, 4, 5]
nums[1:3] = [10, 20, 30]   # [0, 10, 20, 30, 3, 4, 5]

nums = [0, 1, 2, 3, 4, 5]
nums[1:3] = []             # [0, 3, 4, 5] ← 削除と同じ

nums = [0, 1, 2, 3, 4, 5]
nums[:0] = [-1]            # [-1, 0, 1, 2, 3, 4, 5] ← 先頭に挿入

nums = [0, 1, 2, 3, 4, 5]
del nums[::2]              # [1, 3, 5] ← 1つおきに削除
```

拡張スライス (`step` を指定)への代入は、**要素数が一致している必要がある**。

```python
nums = [0, 1, 2, 3]
nums[::2] = [9, 9]     # [9, 1, 9, 3]
nums[::2] = [1, 2, 3]  # ValueError
```

### 操作

#### 追加系

```python
lst = [1, 2]

lst.append(3)        # 末尾に追加 → [1,2,3]
lst.extend([4, 5])   # 複数追加 → [1,2,3,4,5]
lst.insert(1, 99)    # 指定位置に挿入 → [1,99,2,3,4,5]
```

#### 削除系

```python
lst = [1, 2, 3, 2]

lst.remove(2)   # 値を削除（最初の1つ） → [1,3,2]
lst.pop()       # 末尾削除 → 2（値も返す）
lst.pop(0)      # 指定位置削除 → 1
del lst[0]      # インデックス削除
lst.clear()     # 全削除 → []
```

#### 検索・カウント

```python
lst = [1, 2, 2, 3]

lst.index(2)   # 1（最初の位置）
lst.count(2)   # 2（個数）
```

#### 並び替え

```python
lst = [3, 1, 2]

lst.sort()              # 破壊的（元を書き換え）
lst.sort(reverse=True)  # 降順

new_lst = sorted(lst)   # 非破壊（新しいリスト）

words = ["apple", "banana", "kiwi"]
words.sort(key=len)     # 文字数でソート
```

<pre><code class="caution">lst = [3, 1, 2]
lst = lst.sort()   # ❌ sort() は None を返す (破壊的メソッドは None を返すのが Python の慣習)
print(lst)         # None</code></pre>

`sort()` と `sorted()` は `key=` で比較の基準を指定でき、**安定ソート** (同じキーの要素は元の順序を保つ) なので、複数条件のソートは段階的に行える。

```python
people = [("Bob", 20), ("Alice", 20), ("Carol", 18)]

sorted(people, key=lambda p: p[1])                 # 年齢順 (同じ年齢は元の順)
sorted(people, key=lambda p: (p[1], p[0]))         # 年齢順、同じなら名前順
sorted(people, key=lambda p: p[1], reverse=True)   # 年齢の降順
```

#### 反転

```python
lst.reverse()   # 破壊的
lst[::-1]       # 非破壊（スライス）
```

#### コピー

```python
a = [1, 2]
b = a           # 参照（危険）

c = a.copy()    # 安全
d = a[:]        # 同じ
```

`copy()` や `[:]` は **浅いコピー** で、外側のリストだけが複製される。ネストした要素は共有されたままなので、完全に複製するには `copy.deepcopy()` を使う。

```python
import copy

a = [[1, 2], [3]]
b = a.copy()
b[0].append(9)
print(a)               # [[1, 2, 9], [3]] ← 内側のリストは共有されている

c = copy.deepcopy(a)   # 深いコピー
c[0].append(0)
print(a)               # [[1, 2, 9], [3]] ← 影響しない
```

#### 含まれているか

```python
2 in nums      # True
5 not in nums  # True
```

#### 結合・繰り返し・その他

```python
[1, 2] + [3]          # [1, 2, 3]   (新しいリスト)
[0] * 3               # [0, 0, 0]

len(lst)              # 要素数
sum(lst), min(lst), max(lst)

a, b, *rest = [1, 2, 3, 4]   # アンパック
```

#### 例外が発生する操作

```python
[].pop()          # IndexError (空のリストから取り出し)
[1].remove(9)     # ValueError (存在しない値)
[1].index(9)      # ValueError (存在しない値)
[1, 2][5]         # IndexError
[1, 2][5:]        # []  ← スライスは範囲外でもエラーにならない
```

<pre><code class="tips">リストの先頭への挿入・削除(insert(0, x) / pop(0))は O(n) で遅い。両端を頻繁に操作するなら collections.deque を使う。</code></pre>

### 重要

<pre><code class="caution">a = [1, 2]
b = a      # a への参照をコピーしている
b[0] = 99

print(a)   # [99, 2] ← 一緒に変わる</code></pre>

---

## タプル <a id="tuple" data-name="タプル"></a>

- 変更できないリスト
- 順序を持つ
- イミュータブル

### 生成

```python
t1 = (1, 2, 3)
t2 = 1, 2, 3  # これでもOK（実はこっちが本質）

t = (1)     # intになる
t = (1,)    # タプルになる ← カンマが本体
```

### アクセス

```python
t = (10, 20, 30)

t[0]   # 10
t[-1]  # 30

t[0:2]  # (10, 20)
```

### 操作

```python
t = (1, 2, 2, 3)

t.count(2)   # 2が何個含まれているか
t.index(2)   # 2の最初のインデックスを返す
```

### 特徴と使いどころ

```python
# アンパック・入れ替え
x, y = (1, 2)
x, y = y, x

# 複数の戻り値
def f():
    return 1, 2

# 辞書のキーにできる (ハッシュ可能)
d = {(0, 0): "origin", (1, 2): "A"}

# リストとの変換
tuple([1, 2, 3])    # (1, 2, 3)
list((1, 2, 3))     # [1, 2, 3]
```

<pre><code class="caution">t = ([1, 2], 3)
t[0].append(9)
print(t)             # ([1, 2, 9], 3) ← タプルが保持する「参照」が変わらないだけで、中身のリストは変更できる
hash(t)              # TypeError: 要素にハッシュ不可能なものがあるタプルはキーにできない</code></pre>

### namedtuple

要素に名前を付けられるタプル。

```python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(1, 2)

p.x        # 1
p[1]       # 2 (通常のタプルとしても使える)
x, y = p   # アンパックもできる
p._asdict()   # {'x': 1, 'y': 2}
```

型ヒント付きで書くなら `typing.NamedTuple` を使う。

```python
from typing import NamedTuple

class Point(NamedTuple):
    x: int
    y: int = 0
```

---

## 辞書 <a id="dict" data-name="辞書"></a>

- キーと値をペアで持つ
- 順序あり(Python3.7以降)
- ミュータブル

### 生成

```python
user = {
    "name": "jon",
    "age": 20
}
```

### アクセス

```python
user["name"]   # "jon"

user["email"]  # KeyError（存在しない）

user.get("email")        # None
user.get("email", "なし") # デフォルト値

user.keys()    # キー一覧
user.values()  # 値一覧
user.items()   # (キー, 値)
```

### 追加・更新・削除

```python
user["email"] = "a@example.com"  # 追加
user["age"] = 21                 # 更新
del user["age"]
user.pop("name")   # 値を返す (削除される)

# まとめて更新
user.update({"age": 30, "city": "Osaka"})

# キーが存在しない場合のみ追加 (存在すれば何もしない)
user.setdefault("age", 18)
```

### その他の操作

```python
user = {"name": "jon", "age": 20}

"name" in user          # True (キーの存在確認)
len(user)               # 2
user.pop("zzz", None)   # None (存在しなくても default を指定すればエラーにならない)
user.popitem()          # ('age', 20) 最後に追加した要素を取り出す (3.7+)
user.copy()             # 浅いコピー
user.clear()            # 全削除
```

#### ループ

```python
for key in user:                  # キーを回す
    ...
for value in user.values():
    ...
for key, value in user.items():   # キーと値を同時に回す
    ...
```

<pre><code class="caution">for k in d:
    del d[k]       # ❌ RuntimeError: dictionary changed size during iteration

for k in list(d):  # ○ キーのコピーを回す
    del d[k]</code></pre>

#### 生成とマージ

```python
dict(name="jon", age=20)                 # キーワード引数から
dict(zip(["a", "b"], [1, 2]))            # {'a': 1, 'b': 2}
dict.fromkeys(["a", "b"], 0)             # {'a': 0, 'b': 0}
{k: v for k, v in [("a", 1), ("b", 2)]}  # 内包表記

a = {"x": 1, "y": 2}
b = {"y": 99, "z": 3}

a | b            # {'x': 1, 'y': 99, 'z': 3} (3.9+。後ろが優先)
{**a, **b}       # 同じ結果 (3.5+)
a |= b           # a を更新 (update() と同じ)
```

<pre><code class="caution">dict.fromkeys(["a", "b"], [])   # ❌ すべてのキーが同じリストを共有する</code></pre>

#### キーにできるもの

キーは **ハッシュ可能** (`hash()` できる) なものだけ。`int` `str` `tuple` (中身もハッシュ可能なもの) などは使えるが、`list` `dict` `set` は使えない。

```python
{(1, 2): "ok"}
{[1, 2]: "ng"}    # TypeError: unhashable type: 'list'
```

#### defaultdict と Counter

```python
from collections import defaultdict, Counter

# 存在しないキーにアクセスしたとき、自動で初期値を作る
groups = defaultdict(list)
for word in ["apple", "avocado", "banana"]:
    groups[word[0]].append(word)
# {'a': ['apple', 'avocado'], 'b': ['banana']}

# 出現回数を数える
c = Counter("abracadabra")
c["a"]              # 5
c.most_common(2)    # [('a', 5), ('b', 2)]
```

#### get / setdefault の使い分け

```python
d = {}

d.get("k")                # None (辞書は変更されない)
d.setdefault("k", [])     # [] を返し、さらに辞書に d["k"] = [] を追加する
d.setdefault("k", [9])    # 既にあれば何もせず、既存の値 [] を返す
```

---

## 集合 <a id="set" data-name="集合"></a>

- 重複を持たない
- 順序がない
- 要素は **ハッシュ可能** なもの(`int` `str` `tuple` など)のみ。`list` や `dict` は入れられない

### 生成

```python
s = {1, 2, 3}
s = set() # 空集合
```

### 追加

```python
s.add(4)
```

### 存在確認

```python
2 in s   # True
```

### 削除

```python
s.remove(2)   # なければ KeyError
s.discard(2)  # なければ何もしない（安全）
s.pop()       # 任意の要素を削除して返す（順序がないので、どれが選ばれるかは不定）
s.clear()
```

### 集合演算

```python
# 和集合(OR)
a = {1, 2, 3}
b = {3, 4, 5}

a | b   # {1,2,3,4,5}
# または
a.union(b)

# 積集合(AND)
a & b   # {3}
# または
a.intersection(b)

# 差集合
a - b   # {1,2}
# または
a.difference(b)

# 対称差
a ^ b   # {1,2,4,5}
# または
a.symmetric_difference(b)
```

### その他

```python
# イミュータブルな集合
fs = frozenset([1,2,3])
fs.add(4)  # ❌ AttributeError
```

### 更新・集合の関係

```python
a = {1, 2, 3}

a.update({3, 4})      # a |= {3, 4} と同じ → {1, 2, 3, 4}
a.intersection_update({2, 3, 4})   # a &= {2, 3, 4} → {2, 3, 4}
a.difference_update({2})           # a -= {2} → {3, 4}
```

```python
{1, 2} <= {1, 2, 3}        # True  部分集合 (issubset)
{1, 2} < {1, 2, 3}         # True  真部分集合
{1, 2, 3} >= {1, 2}        # True  上位集合 (issuperset)
{1, 2}.isdisjoint({3, 4})  # True  共通要素がない
```

### 使いどころ

```python
# 重複の除去 (順序は失われる)
list(set([3, 1, 3, 2]))             # 例: [1, 2, 3]

# 重複を除去しつつ順序を保つ
list(dict.fromkeys([3, 1, 3, 2]))   # [3, 1, 2]

# 高速な存在確認
allowed = {"a", "b", "c"}
"a" in allowed                      # O(1)
```

<pre><code class="caution">{}          # これは空の「辞書」。空の集合は set()
{1, 2}      # 集合
{[1, 2]}    # TypeError: unhashable type: 'list'
{(1, 2)}    # OK (タプルはハッシュ可能)</code></pre>

---

<a id="string" data-name="String型"></a>

## String型

### 基本

- 文字の **シーケンス** (添字・スライスが使える)
- **イミュータブル** (一部を書き換えられない。メソッドは新しい文字列を返す)
- シングルクォート `'...'` でもダブルクォート `"..."` でも同じ。`'''...'''` / `"""..."""` で複数行の文字列になる

```python
s = "hello"

s[0]       # 'h'
s[-1]      # 'o'
s[1:3]     # 'el'
s[::-1]    # 'olleh'

s[0] = "H"      # TypeError (イミュータブル)
s = "H" + s[1:] # 新しい文字列を作って付け替える

len("日本語")    # 3 (文字数。バイト数ではない)
"a" "b"          # 'ab' (隣り合うリテラルは自動的に連結される)
```

```python
text = """1行目
2行目"""

text.splitlines()   # ['1行目', '2行目']
```

### エスケープシーケンスと raw 文字列

| 記法 | 意味 |
| --- | --- |
| `\n` | 改行 |
| `\t` | タブ |
| `\\` | バックスラッシュ |
| `\'` `\"` | クォート |
| `\uXXXX` | Unicode 文字 (`'\u3042'` → `'あ'`) |

`r"..."` を付けると、**エスケープを解釈しない raw 文字列** になる。正規表現や Windows のパスで便利。

```python
print("C:\new\table")    # \n と \t が解釈されて崩れる
print(r"C:\new\table")   # C:\new\table
```

<pre><code class="caution">raw 文字列は、末尾を奇数個のバックスラッシュで終えられない。
r"C:\dir\"    → SyntaxError
r"C:\dir" "\\" のように書くか、通常の文字列にする。</code></pre>

### f-string

`f"..."` の中の `{}` に、**式** を直接書ける (3.6+)。

```python
{% raw %}
name, age = "Alice", 25

f"{name} は {age} 歳"       # 'Alice は 25 歳'
f"来年は {age + 1} 歳"       # '来年は 26 歳'
f"{name!r}"                 # "'Alice'" (repr を使う)
f"{name=}"                  # "name='Alice'" (3.8+ デバッグ用)
f"{{}}"                     # '{}' ({ } 自体を出力したいときは二重にする)
{% endraw %}
```

`{値:書式}` で書式を指定できる。

```python
pi = 3.14159265

f"{pi:.2f}"        # '3.14'       小数点以下 2 桁
f"{42:05d}"        # '00042'      0 埋めで幅 5
f"{1234567:,}"     # '1,234,567'  桁区切り
f"{0.256:.1%}"     # '25.6%'      パーセント表示
f"{255:x}"         # 'ff'         16 進数
f"{255:#x}"        # '0xff'
f"{255:08b}"       # '11111111'   2 進数 (0 埋めで幅 8)
f"{1234.5:e}"      # '1.234500e+03'

f"{'hi':>5}"       # '   hi'      右寄せ
f"{'hi':<5}|"      # 'hi   |'     左寄せ
f"{'hi':^6}"       # '  hi  '     中央寄せ
f"{'hi':*^6}"      # '**hi**'     埋め文字を指定
f"{3:+d}"          # '+3'         符号を常に表示
```

書式指定の構造は次の通り。

```text
{値:[[埋め文字]寄せ][符号][#][0][幅][,][.精度][型]}
```

寄せは `<` (左) `>` (右) `^` (中央)、型は `d` (整数) `f` (小数) `e` (指数) `%` (パーセント) `x` (16進) `b` (2進) `s` (文字列) など。

<pre><code class="tips">幅や精度も {} で動的に指定できる。
width = 8; prec = 2
f"{3.14159:{width}.{prec}f}"   # '    3.14'</code></pre>

`str.format()` や `%` による古い書式も存在するが、新しく書く場合は f-string を使う。

```python
"{} は {} 歳".format("Alice", 25)
"{0} は {1} 歳 ({0})".format("Alice", 25)       # 位置を指定
"{name} は {age} 歳".format(name="Alice", age=25)
"%s は %d 歳" % ("Alice", 25)
```

### 文字列の連結・比較・変換

```python
"a" + "b"                  # 'ab'
"-" * 10                   # '----------'
",".join(["a", "b", "c"])  # 'a,b,c' (大量に連結するときは + より join)

"abc" == "abc"             # True
"abc" < "abd"              # True (文字コード順)
"ell" in "hello"           # True (部分文字列)

ord("a")                   # 97
chr(97)                    # 'a'
list("abc")                # ['a', 'b', 'c']
"".join(reversed("abc"))   # 'cba'
```

### 文字列操作関連メソッド

| メソッド     | 説明                                                                        | 使用例                              |
| ------------ | --------------------------------------------------------------------------- | ----------------------------------- |
| capitalize() | 1文字目が英字の場合は大文字で表し、<br>他に英字がある場合はすべて小文字になる。 | 'hello'.capitalize() → 'Hello'      |
| casefold()   | 大文字小文字を区別せずに比較するための変換。`lower()` より強力 | `'ß'.casefold() → 'ss'` |
| title()      | 各単語の先頭を大文字に、残りを小文字に | `'hello world'.title() → 'Hello World'` |
| lower()      | 小文字に変換                                                                | 'HELLO'.lower() → 'hello'           |
| upper()      | 大文字に変換                                                                | 'hello'.upper() → 'HELLO'           |
| swapcase()   | 大文字⇔小文字を入れ替え                                                     | 'Hello'.swapcase() → 'hELLO'        |

### 検索関連メソッド

| メソッド     | 説明                                     | 使用例                          |
| ------------ | ---------------------------------------- | ------------------------------- |
| startswith() | 指定文字列で始まるか判定                 | 'hello'.startswith('he') → True |
| endswith()   | 指定文字列で終わるか判定                 | 'hello'.endswith('lo') → True   |
| find()       | 部分文字列の最初の位置を返す             | 'hello'.find('l') → 2           |
| rfind()      | 部分文字列の最後の位置を返す             | 'hello'.rfind('l') → 3          |
| index()      | 見つけたら位置を返す(見つからないと例外) | 'hello'.index('l') → 2          |
| rindex()     | 右から検索して位置を返す                 | 'hello'.rindex('l') → 3         |
| count()      | 部分文字列の出現回数                     | 'hello'.count('l') → 2          |

### 判定関連メソッド

| メソッド       | 説明                           | 使用例                         |
| -------------- | ------------------------------ | ------------------------------ |
| isalnum()      | 文字または数字のみか判定 (日本語なども True) | `'abc123'.isalnum() → True` |
| isalpha()      | 文字のみか判定 (英字以外の文字も True) | `'abc'.isalpha() → True` |
| isdigit()      | 数字のみか判定 (`'²'` のような上付き数字も True) | `'123'.isdigit() → True` |
| isdecimal()    | 10進数の数字 (0〜9 など) のみか判定 | `'123'.isdecimal() → True` |
| isnumeric()    | 数を表す文字のみか判定 (漢数字・分数・ローマ数字なども True) | `'Ⅳ'.isnumeric() → True` |
| isspace()      | 空白文字のみか判定             | ' '.isspace() → True           |
| isidentifier() | 識別子として有効か判定         | 'var_1'.isidentifier() → True  |
| islower()      | すべて小文字か判定             | 'hello'.islower() → True       |
| isupper()      | すべて大文字か判定             | 'HELLO'.isupper() → True       |
| istitle()      | タイトルケースか判定           | 'Hello World'.istitle() → True |
| isascii()      | すべて ASCII 文字か判定 (3.7+) | `'abc'.isascii() → True` |

### 文字列の整形メソッド

| メソッド     | 説明                       | 使用例                                                  |
| ------------ | -------------------------- | ------------------------------------------------------- |
| strip()      | 前後の空白や指定文字を除去 | `' hello '.strip() → 'hello'`                             |
| lstrip()     | 左側の空白や指定文字を除去 | ' hello'.lstrip() → 'hello'                             |
| rstrip()     | 右側の空白や指定文字を除去 | 'hello '.rstrip() → 'hello'                             |
| replace()    | 部分文字列を置換           | 'hello'.replace('l', 'w') → 'hewwo'                     |
| split()      | 指定の区切り文字で分割     | `'a,b,c'.split(',') → ['a', 'b', 'c']`                    |
| rsplit()     | 右から分割                 | `'a,b,c'.rsplit(',', 1) → ['a,b', 'c']`                   |
| partition()  | 最初の区切り文字で分割     | `'hello world'.partition(' ') → ('hello', ' ', 'world')`  |
| rpartition() | 右から区切り文字で分割     | `'hello world'.rpartition(' ') → ('hello', ' ', 'world')` |
| join()       | 文字列を指定の区切りで結合 | `','.join(['a', 'b', 'c']) → 'a,b,c'` |
| removeprefix() | 先頭の指定文字列を除去 (3.9+) | `'test_a'.removeprefix('test_') → 'a'` |
| removesuffix() | 末尾の指定文字列を除去 (3.9+) | `'a.txt'.removesuffix('.txt') → 'a'` |
| splitlines() | 改行で分割 | `'a\nb'.splitlines() → ['a', 'b']` |

<div class="caution">
    strip系のメソッドは、<b>"指定文字列"</b>に含まれる<b>'文字'</b>が全て除去されるので注意。<br>
    例: <code>'abcba'.strip('ab')</code> は <code>'c'</code> になる。接頭辞・接尾辞を除去したい場合は <b>removeprefix()</b> / <b>removesuffix()</b> を使う。
</div>

`split()` を **引数なし** で呼ぶと、連続する空白をひとまとめにして分割し、先頭・末尾の空白は無視される。

```python
'  a   b '.split()      # ['a', 'b']
'  a   b '.split(' ')   # ['', '', 'a', '', '', 'b', '']
```

### フォーマット関連メソッド

| メソッド     | 説明                     | 使用例                                |
| ------------ | ------------------------ | ------------------------------------- |
| format()     | 文字列フォーマット       | '{} {}'.format('Hello', 'World')      |
| format_map() | 辞書を使ったフォーマット | '{name}'.format_map({'name': 'John'}) |
| zfill()      | 0埋めで文字列を指定幅に  | '42'.zfill(5) → '00042'               |

### その他

| メソッド     | 説明                         | 使用例                         |
| ------------ | ---------------------------- | ------------------------------ |
| encode()     | 文字列をバイト列にエンコード | 'hello'.encode('utf-8')        |
| decode()     | バイト列を文字列にデコード   | b'hello'.decode('utf-8')       |
| expandtabs() | タブをスペースに変換         | 'a\tb'.expandtabs(4)           |
| center()     | 文字列を中央寄せ             | 'hi'.center(6, '-') → '--hi--' |
| ljust()      | 左寄せ                       | 'hi'.ljust(5, '-') → 'hi---'   |
| rjust()      | 右寄せ                       | 'hi'.rjust(5, '-') → '---hi'   |

---

<a id="args" data-name="可変長引数"></a>

## 可変長引数

Python の `*args` `**kwargs` はどこで使うかによって意味が異なる。

### 関数の定義 (梱包)

```python
def my_function(*args, **kwargs):
    print(args)    # タプルにまとめられている
    print(kwargs)  # 辞書にまとめられている

# 呼び出すときはバラバラに渡す
my_function(1, 2, 3, a="apple", b="banana")
```

### 関数の呼び出し (展開)

```python
def greet(name, age, country):
    print(f"{name} ({age}) from {country}")

# 1. リストやタプルを「展開」して渡す (*)
user_info = ["Alice", 25, "Japan"]
greet(*user_info)  # greet("Alice", 25, "Japan") と書いたのと同じ

# 2. 辞書を「展開」して渡す (**)
user_dict = {"name": "Bob", "age": 30, "country": "USA"}
greet(**user_dict) # greet(name="Bob", age=30, country="USA") と同じ
```


---

## 内包表記 <a id="comprehension" data-name="内包表記"></a>

### リスト内包表記

```python
# 書式
[式 for 変数 in イテラブル]
# 条件がある場合
[式 for 変数 in イテラブル if 条件]
```

<pre><code class="example">squares = [x * x for x in range(5)]
# [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]</code></pre>

<div class="subtitle">条件式の書き方</div>

1. フィルタとしての if
    ```python
    [x for x in range(10) if x % 2 == 0]
    ```

2. 式の中の if-else (三項演算子)
    ```python
    ["even" if x % 2 == 0 else "odd" for x in range(5)]
    # ['even', 'odd', 'even', 'odd', 'even']
    ```

<pre><code class="tips">左の if文は全要素が対象でデータを変えたい時、
右の if文はフィルタリングをかけたい時。</code></pre>

### 辞書内包表記

```python
# 書式
{キー式: 値式 for 変数 in イテラブル}
# 条件がある場合
even_squares = {x: x * x for x in range(10) if x % 2 == 0}
```

<pre><code class="example">names = ["alice", "bob", "charlie"]
lengths = {name: len(name) for name in names}
# {'alice': 5, 'bob': 3, 'charlie': 7}</code></pre>

### 集合内包表記

```python
# 書式
{式 for 変数 in イテラブル}
```

<pre><code class="example">unique_lengths = {len(name) for name in ["alice", "bob", "anna"]}
# {3, 4, 5}</code></pre>

集合なので、順序は保証されないが重複が消える。

### ジェネレータ式

```python
# 書式
(式 for 変数 in イテラブル)
```

<pre><code class="example">gen = (x * x for x in range(5))</code></pre>

リストではなく必要な時に生成するジェネレータなので、メモリ効率がいい。<br>
大量データ向き。<br>
一度しか使えない (イテレータ) 点に注意。関数の唯一の引数として渡す場合は、括弧を省略できる。

```python
gen = (x * x for x in range(3))
next(gen)            # 0
list(gen)            # [1, 4]
list(gen)            # [] ← 使い切っている

sum(x * x for x in range(10))   # 285 (リストを作らずに合計)
```

### 複数のループ・ネスト

`for` を複数並べると、**書いた順に外側から内側** のループになる。

```python
[(x, y) for x in range(2) for y in "ab"]
# [(0, 'a'), (0, 'b'), (1, 'a'), (1, 'b')]

# 2次元リストの平坦化
matrix = [[1, 2], [3, 4], [5]]
[v for row in matrix for v in row]     # [1, 2, 3, 4, 5]

# 内包表記のネスト (各行を変換して2次元のまま)
[[v * 2 for v in row] for row in matrix]   # [[2, 4], [6, 8], [10]]
```

<pre><code class="tips">for の順序は、通常のループを上から書いた順番と同じ。
for row in matrix:
    for v in row:        # ← 内包表記では「for row in matrix for v in row」と書く</code></pre>

### そのほかの書き方

```python
# zip / enumerate との組み合わせ
[a + b for a, b in zip([1, 2], [10, 20])]            # [11, 22]
[f"{i}:{c}" for i, c in enumerate("ab")]             # ['0:a', '1:b']

# if を複数並べると AND になる
[x for x in range(20) if x % 2 == 0 if x % 3 == 0]   # [0, 6, 12, 18]

# 代入式 (:=) で変換結果を再利用 (3.8+)
[y for x in data if (y := f(x)) > 0]
```

- 内包表記の中のループ変数は、**外側のスコープに漏れない**
- 複雑になってきたら、通常の `for` 文や関数に分けた方が読みやすい

---

## 関数 <a id="function" data-name="関数"></a>

### 戻り値のない関数

戻り値のない関数は、暗黙的に None が返る。

### 位置専用引数

`スラッシュ(/)`は前の引数を位置専用引数とする。

<pre><code class="example">def func(a, b, /): # a, bは位置専用</code></pre>

### キーワード専用引数

`アスタリスク(*)`は後の引数をキーワード専用引数とする。

<pre><code class="example">def func(*, a, b): # a, bはキーワード専用</code></pre>

### 可変長引数

`*args`は位置引数をタプルとして受け取る。<br>`**kwargs`はキーワード引数を辞書として受け取る。

<pre><code class="example">def func(*args, **kwargs):</code></pre>

### デフォルト値

引数が渡されなかった場合のデフォルト値を`イコール(=)`で記述できる。

<pre><code class="example">def greet(name: str = "unknown"):
    print(f"Hi {name}!")</code></pre>

### 型ヒント付きシグネチャ

引数や戻り値の型を、型ヒントとして明示的に記述できる。<br>型ヒントは静的解析ツール(mypyなど)に使われ、実行時に型の強制はされない。

<pre><code class="example">def greet(name: str, age: int) -> str:
    return f"Hi {name}, you're {age} years old!"</code></pre>

### 引数の順序

定義するときの引数は、次の順序で書く。

```python
def f(pos_only, /, normal, default=1, *args, kw_only, kw_default=2, **kwargs):
    ...
```

```text
位置専用 → 通常 → デフォルト付き → *args → キーワード専用 → **kwargs
```

デフォルト付きの引数の後ろに、デフォルトなしの通常の引数は置けない。

### ミュータブルなデフォルト値の罠

デフォルト値は **関数を定義した時に1回だけ** 評価される。

```python
def add(x, lst=[]):          # ❌
    lst.append(x)
    return lst

add(1)    # [1]
add(2)    # [1, 2] ← 前回のリストが使い回されている
```

```python
def add(x, lst=None):        # ○ None を使い、中で新しく作る
    if lst is None:
        lst = []
    lst.append(x)
    return lst
```

### 引数の渡され方

引数は **オブジェクトへの参照** として渡される。ミュータブルなオブジェクトを関数内で変更すると、呼び出し元にも影響する。<br>
一方、**関数内での再代入は呼び出し元に影響しない**。

```python
def f(lst, n):
    lst.append(1)    # 呼び出し元のリストが変更される
    n += 1           # ローカルの n を付け替えるだけ
    lst = [99]       # ローカルの lst を付け替えるだけ

a, k = [], 0
f(a, k)
print(a, k)    # [1] 0
```

### 複数の戻り値

`return a, b` は **タプル** を返している。受け取り側でアンパックできる。

```python
def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3, 1, 2])   # lo=1, hi=3
result = min_max([3, 1, 2])   # (1, 3)
```

### docstring

関数の先頭に書いた文字列リテラルは docstring として `__doc__` に保存され、`help()` で表示される。

```python
def area(w, h):
    """長方形の面積を返す。

    Args:
        w: 幅
        h: 高さ
    """
    return w * h

help(area)
area.__doc__
```

### スコープ (LEGB)

変数名は、次の順序で探される。

```text
L: Local      関数の内側
E: Enclosing  外側の関数の内側
G: Global     モジュール (ファイル) のトップレベル
B: Built-in   組み込み (len, print など)
```

```python
x = 10

def f():
    x = 20            # ローカル変数 x を新しく作る (グローバルの x は変わらない)

def g():
    global x          # グローバルの x を書き換える
    x = 30
```

<pre><code class="caution">x = 1

def h():
    print(x)    # UnboundLocalError
    x = 2       # 関数内のどこかで代入があると、その名前は関数全体で「ローカル」になる</code></pre>

### クロージャと nonlocal

内側の関数が、**外側の関数の変数を覚えたまま** 使えるものをクロージャという。外側の変数を書き換えるときは `nonlocal` を宣言する。

```python
def counter():
    count = 0

    def inc():
        nonlocal count     # 外側の count を書き換える
        count += 1
        return count

    return inc

c = counter()
c()   # 1
c()   # 2
```

### 再帰

```python
def fact(n):
    return 1 if n <= 1 else n * fact(n - 1)

fact(5)    # 120
```

再帰の深さには上限がある (デフォルトは約 1000。`sys.getrecursionlimit()` で確認でき、超えると `RecursionError`)。深くなる処理はループで書き直す。

### デコレーター

デコレーターは関数やクラスの振る舞いを変更するためのものであり、関数を引数として受け取り、別の関数やオブジェクトを返す関数。

```python
@deco(option)
def func(*args, **kwargs):
    pass
```

```python
def deco(option):
    def decorator(func):
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)

        return wrapper
    return decorator
```

そしてデコレーターへの引数がなくなると、

```python
@deco
def func(*args, **kwargs):
    pass
```

となり、

```python
def deco(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return wrapper
```

こうなる。

`@deco` は **`func = deco(func)`** の糖衣構文、`@deco(option)` は **`func = deco(option)(func)`** にあたる。

#### functools.wraps

そのままだと、デコレートされた関数の名前や docstring が `wrapper` のものに置き換わってしまう。`functools.wraps` を付けて元の情報を引き継ぐ。

```python
import functools
import time

def timer(func):
    @functools.wraps(func)          # func.__name__ や __doc__ を wrapper に引き継ぐ
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            print(f"{func.__name__}: {time.perf_counter() - start:.3f} 秒")
    return wrapper

@timer
def slow():
    """遅い関数"""
    time.sleep(0.1)

slow.__name__   # 'slow' (wraps がないと 'wrapper')
```

### ラムダ式

ラムダ式とは、短い関数をその場で作るための機能で、主に高階関数と組み合わせて使う。<br>
ラムダ式は式だけを1行で書く必要がある。

```python
lambda 引数: 式
```

```python
# 以下の2つは同じ意味
f = lambda x: x * 2

def f(x):
    return x * 2
```

#### 使い方

##### sorted

```python
nums = [(1, 3), (2, 1), (3, 2)]

sorted(nums, key=lambda x: x[1])
```

##### map

```python
nums = [1, 2, 3]

list(map(lambda x: x * 2, nums))
# [2, 4, 6]
```

##### filter

```python
nums = [1, 2, 3, 4]

list(filter(lambda x: x % 2 == 0, nums))
# [2, 4]
```

##### 条件式

```python
lambda x: "even" if x % 2 == 0 else "odd"
```

##### ラムダ式の落とし穴 (遅延束縛)

ラムダ式の中の変数は、**定義時ではなく呼び出し時** に評価される。

```python
funcs = [lambda: i for i in range(3)]
[f() for f in funcs]     # [2, 2, 2] ← すべて最後の i が使われる

funcs = [lambda i=i: i for i in range(3)]   # デフォルト引数で定義時の値を固定する
[f() for f in funcs]     # [0, 1, 2]
```

<pre><code class="tips">名前を付けて使い回すなら、lambda を変数に代入せず def で書く(PEP 8)。トレースバックにも名前が出る。</code></pre>

---

## 組み込み関数 <a id="functions" data-name="組み込み関数"></a>

### print(*objects, sep=' ', end='\n', file=None, flush=False)

objects を sep で区切りながらテキストストリーム file に表示し、最後に end を表示する。<br>
sep 、 end 、 file 、 flush を与える場合、キーワード引数として与える必要がある。

キーワードなしの引数はすべて、 str() がするように文字列に変換され、 sep で区切られながらストリームに書き出され、最後に end が続く。<br>
sep と end の両方とも、文字列でなければなりません。これらを None にすると、デフォルトの値が使われます。 objects が与えられなければ、 print() は end だけを書き出す。

file 引数は、 write(string) メソッドを持つオブジェクトでなければならない。<br>
指定されないか、 None である場合、 sys.stdout が使われる。<br>
表示される引数は全てテキスト文字列に変換されるため、 print() はバイナリモードファイルオブジェクトには使用できない。代わりに file.write(...) を使う。<br>
出力がバッファ化されるかどうかは通常 file で決まるが、flush キーワード引数が真ならストリームは強制的にフラッシュされる。

---

### open(file, mode='r', buffering=-1, encoding=None, errors=None, newline=None, closefd=True, opener=None)

ファイルのパスを指定してファイルをオープンする。ファイルオブジェクトを返す。<br>
オープンしたファイルオブジェクトは `f.close()` でクローズする必要がある。<br>
通常は `f.close()` の呼び忘れを防ぐために **with句** を使用することで、コンテキストマネージャーによって自動的にクローズされる。

<pre><code class="example">with open(file_path, encoding="utf-8") as f:
    content = f.read()</code></pre>

`mode` はファイルをどのように開くか(または作成するか)を示すオプション。<br>
デフォルトでは `'r'` は `'rt'` であり、テキストモードで開かれることを示す。モードの種類は以下の通り。

| モード | 意味 |
| --- | --- |
| `'r'`  | ファイルは読み取りモードで開かれる。<br>ファイルが存在していなければならない。デフォルト。 |
| `'r+'` | 読み取り/書き込みモードで開かれる。<br>ファイルが存在していなければならない。 |
| `'a'`  | ファイルは書き込み専用モードで開かれる。<br>ファイルが存在しない場合は作成され、書き込むデータはファイルの末尾に追記される。 |
| `'a+'` | ファイルは読み取り/書き込みモードで開かれる。<br>ファイルが存在しない場合は作成される。 |
| `'w'`  | ファイルは書き込み専用モードで開かれる。<br>ファイルが存在しない場合は作成される。既存のファイルは **内容が空になり** (切り詰められ)、その後に書き込まれる。 |
| `'w+'` | 読み取り/書き込みモードで開かれる。<br>ファイルが存在しない場合は作成される。既存のファイルは内容が空になる。 |
| `'x'`  | 排他的な作成モード。<br>ファイルが既に存在する場合は `FileExistsError` になる。 |

`'b'` を付ける (`'rb'` `'wb'` `'ab'` など) とバイナリモードで開かれ、 bytes 型のデータの読み取りおよび書き込みができる。`'t'` はテキストモード (デフォルト)。

<pre><code class="caution">encoding を省略したときの文字コードは実行環境に依存する(Windows では cp932 になることがある)。
テキストファイルを扱うときは encoding="utf-8" を明示する。</code></pre>

### ファイルオブジェクトのメソッド

#### 読み取りのメソッド

##### f.read(size=-1)

指定した size 分を読み込んで返す (テキストモードでは文字数、バイナリモードではバイト数)。<br>
size を省略、または-1とすると、ファイル全体を読み込む。

##### f.readline(size=-1)

1行読み込む。 size を指定すると、そのバイト数までを読み込む。

##### f.readlines(hint=-1)

ファイルの全行をリストで返す。 hint を指定すると、指定バイト数を超えないように調整される。

#### 書き込みのメソッド

##### f.write(string)

文字列を書き込み、書き込んだ文字数を返す。バイナリモードの場合は bytes を渡す必要がある。

##### f.writelines(lines)

文字列のリストを書き込む(改行(\n)は手動で含める必要がある)。

<pre><code class="example">f.writelines(["line1\n", "line2\n"])</code></pre>

#### ファイル位置関連のメソッド

##### f.tell()

現在のファイル位置を取得する。

##### f.seek(offset, whence=0)

ファイルの位置を変更する。<br>
whence の値で基準を指定する。値は以下の通り。

| 値  | 説明 |
| --- | --- |
| 0   | デフォルト。ファイルの先頭からoffsetバイト移動。 |
| 1   | 現在位置からoffsetバイト移動。 |
| 2   | ファイルの末尾からoffsetバイト移動 |

テキストモードでは、先頭からの移動 (`seek(0)` や `tell()` で得た値) と `seek(0, 2)` (末尾へ移動) 以外はできない。末尾からの相対移動などはバイナリモードで行う。

#### 状態管理関連のメソッド

##### f.flush()

書き込みデータをすぐにディスクへ反映させる。

##### f.close()

ファイルを閉じる。閉じたファイルオブジェクトは使用できなくなる。

#### 判定メソッド

##### f.closed

ファイルが閉じているかを bool で返す。

##### f.writable()

ファイルが書き込み可能なら True を返す

##### f.readable()

ファイルが読み取り可能なら True を返す。

##### f.seekable()

seek() が使用可能なら True を返す。

---

### len(object, /)

オブジェクトの長さ (要素の数) を返す。<br>
引数はシーケンス (文字列、バイト列、タプル、リスト、range 等) かコレクション (辞書、集合、凍結集合等) 。

---

### abs(x, /)

数値x の絶対値を返す。

```python
abs(-3)         # 3
abs(-2.5)       # 2.5
abs(3 + 4j)     # 5.0 (複素数では大きさ)
```

---

### all(seq, /)

seqは イテラブル。 seq のいずれかの要素が falsy の場合、 all は `False` を返す。つまり全ての要素が truthy である場合のみ `True` を返す。**空のイテラブルでは `True`** になる。<br>
演算子 `and` および `or` と同様に all は答えが分かった時点で評価をやめ、結果を返す。

```python
if all(x>0 for x in the_numbers):
    print('all of the numbers are positive')
else:
    print('some of the numbers are not positive')
```

関数を使う場合もイテラブルとして渡す。

```python
def is_positive(x):
    return x > 0

numbers = [1, 2, 3, 4]

result = all(map(is_positive, numbers))
# または内包表記で
result = all(is_positive(x) for x in numbers)
```

---

### any(seq, /)

seq はイテラブル。 seq のいずれかの要素が truthy の場合、 any は `True` を返す。つまり全ての要素が falsy である場合のみ `False` を返す。<br>
演算子 `and` および `or` と同様に any は答えが分かった時点で評価をやめ、結果を返す。**空のイテラブルでは `False`** になる。<br>
引数の渡し方は `all()` と同じ。

---

### enumerate(iterable, start=0)

要素がペアである新しいイテレータを返す。<br>
1つ目の要素は整数であり、 `start` 、 `start+1` 、 `start+2` といった具合になる。<br>
2つ目の要素は渡されたイテレータの要素となる。

```python
for i, name in enumerate(["a", "b", "c"]):
    print(i, name)       # 0 a / 1 b / 2 c

for i, name in enumerate(["a", "b", "c"], start=1):
    print(i, name)       # 1 a / 2 b / 3 c

list(enumerate("ab"))    # [(0, 'a'), (1, 'b')]
```

---

### filter(func, seq, /)

func(要素) が truthy である seq の要素からなるイテレータを返す。<br>
func は引数を1つだけ受け取る任意の呼び出し可能オブジェクトか、または `None` 。 seq は任意のイテラブル。<br>
func が呼び出し可能オブジェクトである場合は、次のジェネレータ式のように、 filter は seq の要素ごとに func を呼びだす。

```python
(item for item in seq if func(item))
```

`func` が `None` の場合は、要素そのものが truthy かどうかで判定される。

```python
list(filter(None, [0, 1, "", "a", None]))   # [1, 'a']
list(filter(str.isdigit, ["1", "a", "2"]))  # ['1', '2']
```

---

### bin(x, /)

整数xのバイナリ文字列表現を返す。接頭辞 `0b` が付く。

```python
bin(5)     # '0b101'
bin(-5)    # '-0b101'
int("101", 2)   # 5 (2進数の文字列から整数へ)
```

---

### `dir([obj, ]/)`

`dir()`(引数なし)の呼び出しは、現在のスコープでバインドされているすべての変数名をソート済みのリストとして返す。<br>`dir(obj)`の呼び出しは、objの型から、または継承によって取得したものを含め、objの属性の名前をソート済みのリストとして返す。

---

### input(prompt='', /)

promptを標準出力に書き出し、標準入力から行を読み取り、その行を(\nを含めずに)strとして返す。<br>inputはEOF(End-of-File)でEOFErrorを生成する。

---

### isinstance(obj, cls, /)

objがclsで指定した型かどうかを判定する。

```python
isinstance(10, int)           # True
isinstance("a", str)          # True
isinstance(10, (int, float))  # True（複数OK）
```

---

### iter(obj, /), <br>iter(func, sentinel, /)

引数が1つの場合は、イテレータを返す。

```python
lst = [1, 2, 3]
it = iter(lst)

next(it)  # 1
next(it)  # 2
```

引数が2つの場合は、特定の値が出るまで繰り返す。

```python
def f():
    return input()

for x in iter(f, "exit"):
    print("入力:", x)
```

```python
# EOF(空文字)で終了
with open("file.txt") as f:
    for line in iter(f.readline, ""):
        print(line)
```

---

### range(stop, /), <br>range(start, stop, step=1, /)

整数の等差数列を表すオブジェクトを返す。値は必要になったときに生成されるので、巨大な範囲でもメモリを消費しない。<br>
`stop` は含まれない。

```python
list(range(5))          # [0, 1, 2, 3, 4]
list(range(2, 5))       # [2, 3, 4]
list(range(10, 0, -3))  # [10, 7, 4, 1]

len(range(1000000))     # 1000000
500 in range(1000000)   # True (O(1) で判定できる)
```

---

### type(obj, /)

オブジェクトの型 (クラス) を返す。<br>
型の判定には、継承も考慮される `isinstance()` を使うのが基本。

```python
type(10)               # <class 'int'>
type(True) is int      # False
isinstance(True, int)  # True ← bool は int のサブクラス
```

---

### sum(iterable, /, start=0)

要素の合計を返す。

```python
sum([1, 2, 3])                  # 6
sum([1, 2, 3], 10)              # 16 (start からの合計)
sum(x * x for x in range(4))    # 14
sum(["a", "b"])                 # TypeError (文字列の連結は "".join() を使う)
```

浮動小数点数を、誤差を抑えて正確に合計したい場合は `math.fsum()` を使う。

---

### min(iterable, /, *, key=None, default), <br>max(iterable, /, *, key=None, default)

最小値 / 最大値を返す。複数の引数を直接渡すこともできる。

```python
max([3, 1, 2])             # 3
max(1, 5, 3)               # 5
max(["a", "ccc", "bb"], key=len)   # 'ccc' (key で比較基準を指定)
max([], default=0)         # 0
max([])                    # ValueError (空のとき default がなければエラー)
```

---

### sorted(iterable, /, *, key=None, reverse=False)

ソート済みの **新しいリスト** を返す。元のオブジェクトは変更されない。<br>
ソートは **安定** (同じキーの要素は元の順序が保たれる)。

```python
sorted([3, 1, 2])                       # [1, 2, 3]
sorted("banana")                        # ['a', 'a', 'a', 'b', 'n', 'n']
sorted([3, 1, 2], reverse=True)         # [3, 2, 1]
sorted(["bb", "a", "ccc"], key=len)     # ['a', 'bb', 'ccc']

d = {"b": 2, "a": 1}
sorted(d.items(), key=lambda kv: kv[1])   # [('a', 1), ('b', 2)]
```

---

### reversed(seq, /)

逆順のイテレータを返す。リストそのものは変更しない。

```python
list(reversed([1, 2, 3]))   # [3, 2, 1]

for ch in reversed("abc"):
    print(ch)               # c b a
```

---

### zip(*iterables, strict=False)

複数のイテラブルの要素を、**同じ位置ごとにタプルにまとめた** イテレータを返す。最も短いものに合わせて終了する。

```python
names = ["a", "b", "c"]
ages = [10, 20, 30]

list(zip(names, ages))      # [('a', 10), ('b', 20), ('c', 30)]
dict(zip(names, ages))      # {'a': 10, 'b': 20, 'c': 30}

list(zip([1, 2, 3], ["x", "y"]))   # [(1, 'x'), (2, 'y')] ← 短い方に合わせる

zip([1, 2, 3], ["x", "y"], strict=True)   # 長さが違うと ValueError (3.10+)

pairs = [(1, "a"), (2, "b")]
nums, chars = zip(*pairs)   # 転置 (アンジップ) → (1, 2), ('a', 'b')
```

---

### map(func, iterable, /, *iterables)

イテラブルの各要素に func を適用した結果のイテレータを返す。

```python
list(map(str, [1, 2, 3]))                 # ['1', '2', '3']
list(map(lambda x: x * 2, [1, 2, 3]))     # [2, 4, 6]
list(map(int, input().split()))           # "1 2 3" → [1, 2, 3]
list(map(pow, [2, 3], [3, 2]))            # [8, 9] (複数のイテラブル)
```

内包表記 `[x * 2 for x in nums]` の方が読みやすいことが多い。

---

### round(number, ndigits=None)

数値を丸める。`ndigits` を省略すると `int` を返す。<br>
ちょうど中間の値は **偶数側に丸められる** (銀行丸め)。

```python
round(3.14159, 2)   # 3.14
round(1234, -2)     # 1200
round(0.5)          # 0
round(1.5)          # 2
round(2.5)          # 2
```

---

### divmod(a, b, /)

商と余りを `(a // b, a % b)` のタプルで返す。

```python
divmod(17, 5)    # (3, 2)

minutes, seconds = divmod(135, 60)   # 2分15秒
```

---

### pow(base, exp, mod=None)

`base ** exp` を返す。`mod` を指定すると `base ** exp % mod` を効率よく計算する。

```python
pow(2, 10)         # 1024
pow(2, 10, 1000)   # 24
```

---

### id(obj, /)

オブジェクトの識別値 (同じ時点で存在するオブジェクトの間で一意な整数) を返す。CPython ではメモリ上のアドレス。<br>
`is` は `id()` が等しいかどうかの比較にあたる。

---

### ord(c, /), <br>chr(i, /)

文字と Unicode コードポイントを相互に変換する。

```python
ord("a")      # 97
ord("あ")     # 12354
chr(97)       # 'a'
chr(0x3042)   # 'あ'
```

---

### hex(x, /), <br>oct(x, /)

整数を 16 進数 / 8 進数の文字列にする (接頭辞 `0x` / `0o` が付く)。

```python
hex(255)    # '0xff'
oct(8)      # '0o10'
bin(5)      # '0b101'
```

接頭辞なしや桁揃えが必要な場合は、f-string の書式指定を使う。

```python
f"{255:x}"     # 'ff'
f"{255:08b}"   # '11111111'
f"{5:08b}"     # '00000101'
```

---

### repr(obj, /)

オブジェクトを **開発者向けの文字列** にして返す。<br>
`str()` は読みやすさ重視、`repr()` は曖昧さのない表現 (できれば `eval()` で再現できる形) を目指す。`print()` は `str()`、REPL の表示は `repr()` を使う。

```python
str("a\nb")     # 'a\nb' (実際の改行を含む文字列)
repr("a\nb")    # "'a\\nb'" (引用符とエスケープを含む)
```

---

### int, float, str, bool, list, tuple, dict, set

型名そのものが **変換関数 (コンストラクタ)** として使える。

```python
int("10")             # 10
float("3.5")          # 3.5
str(123)              # '123'
bool(0)               # False
list("abc")           # ['a', 'b', 'c']
tuple([1, 2])         # (1, 2)
dict([("a", 1)])      # {'a': 1}
dict(a=1, b=2)        # {'a': 1, 'b': 2}
set([1, 1, 2])        # {1, 2}
```

---

### hasattr(obj, name, /), <br>getattr(obj, name[, default], /), <br>setattr(obj, name, value, /), <br>delattr(obj, name, /)

属性名を **文字列で** 指定して、存在確認・取得・設定・削除をする。

```python
class A:
    x = 1

a = A()
hasattr(a, "x")           # True
getattr(a, "x")           # 1
getattr(a, "y", 0)        # 0 (存在しなければ default。省略すると AttributeError)
setattr(a, "y", 10)       # a.y = 10 と同じ
delattr(a, "y")           # del a.y と同じ
```

---

### callable(obj, /)

オブジェクトが呼び出せる (関数、クラス、`__call__` を持つインスタンスなど) なら `True` を返す。

---

### next(iterator[, default], /)

イテレータから次の要素を取り出す。要素がなくなると `StopIteration`、`default` を渡していればその値を返す。

```python
it = iter([1, 2])
next(it)         # 1
next(it)         # 2
next(it, None)   # None
next(it)         # StopIteration

# 条件に合う最初の要素を探す
first_even = next((x for x in [1, 3, 4, 5] if x % 2 == 0), None)   # 4
```

---

## クラス <a id="class" data-name="クラス"></a>

### 基本

```python
class Dog:
    def __init__(self, name, age):   # 初期化メソッド (コンストラクタ相当)
        self.name = name             # インスタンス変数
        self.age = age

    def bark(self):                  # メソッド
        return f"{self.name}: ワン!"

d = Dog("Pochi", 3)
d.name       # 'Pochi'
d.bark()     # 'Pochi: ワン!'
```

- `self` はインスタンス自身。メソッドの **第1引数に明示的に書く** (名前は慣習)
- `d.bark()` は `Dog.bark(d)` と同じ意味
- `__init__` は **インスタンスを生成した後** に呼ばれる初期化処理 (インスタンスの生成自体は `__new__`)
- インスタンスの属性は、`__init__` 以外からでも後から追加できる

### クラス変数とインスタンス変数

```python
class Counter:
    count = 0               # クラス変数 (全インスタンスで共有)

    def __init__(self):
        Counter.count += 1
        self.id = Counter.count   # インスタンス変数 (インスタンスごと)

a = Counter()
b = Counter()
Counter.count   # 2
b.id            # 2
```

<pre><code class="caution">class A:
    items = []          # ❌ ミュータブルなクラス変数は全インスタンスで共有される

a1, a2 = A(), A()
a1.items.append(1)
print(a2.items)         # [1]

# 正しくは __init__ の中で self.items = [] とする</code></pre>

<pre><code class="caution">a.count = 10    # インスタンスに同名の変数が「新しく」作られるだけで、クラス変数は変わらない</code></pre>

### 継承

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Cat(Animal):
    def __init__(self, name, color):
        super().__init__(name)        # 親クラスの __init__ を呼ぶ
        self.color = color

    def speak(self):                  # オーバーライド
        return "ニャー"

c = Cat("Tama", "white")
c.speak()                 # 'ニャー'
isinstance(c, Animal)     # True
issubclass(Cat, Animal)   # True
```

- 多重継承もできる (`class C(A, B):`)。メソッドの探索順は **MRO** で決まり、`C.__mro__` で確認できる
- 親クラスのメソッドを呼ぶ `super()` は、単に「親」ではなく **MRO 上で次のクラス** を指す

### `__str__` と `__repr__`

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):            # 開発者向け。デバッグや REPL での表示
        return f"Point({self.x}, {self.y})"

    def __str__(self):             # 利用者向け。print() や str() で使われる
        return f"({self.x}, {self.y})"

p = Point(1, 2)
print(p)        # (1, 2)
repr(p)         # 'Point(1, 2)'
[p]             # [Point(1, 2)] ← コンテナの中では repr が使われる
```

`__str__` が未定義の場合は `__repr__` が使われるので、まず `__repr__` を定義する。

### property

メソッドを **属性のように** 使えるようにする。値の検証や計算プロパティに使う。

```python
class Circle:
    def __init__(self, r):
        self._r = r

    @property
    def r(self):                  # c.r で取得
        return self._r

    @r.setter
    def r(self, value):           # c.r = 5 で設定
        if value < 0:
            raise ValueError("半径は 0 以上")
        self._r = value

    @property
    def area(self):               # 読み取り専用の計算プロパティ
        return 3.14159 * self._r ** 2

c = Circle(2)
c.r = 3
c.area      # 28.27431
c.area = 1  # AttributeError (setter がない)
```

### classmethod と staticmethod

```python
class User:
    def __init__(self, name):
        self.name = name

    @classmethod
    def from_dict(cls, d):        # 第1引数はクラス (cls)。別のコンストラクタとして使う
        return cls(d["name"])

    @staticmethod
    def is_valid_name(name):      # self も cls も受け取らない。クラスに属する普通の関数
        return 0 < len(name) <= 20

u = User.from_dict({"name": "Bob"})
User.is_valid_name("Bob")     # True
```

### dataclass

`__init__` `__repr__` `__eq__` を自動生成してくれる (3.7+)。データを持つだけのクラスに便利。

```python
from dataclasses import dataclass, field

@dataclass
class Item:
    name: str
    price: int = 0
    tags: list[str] = field(default_factory=list)   # ミュータブルなデフォルト値は field で

i = Item("pen", 100)
i                     # Item(name='pen', price=100, tags=[])
i == Item("pen", 100) # True
```

- `@dataclass(frozen=True)` にすると変更不可 (ハッシュ可能) になる
- `@dataclass(order=True)` にすると、フィールド順での大小比較が使える

### 名前の慣習

| 書き方 | 意味 |
| --- | --- |
| `_name` | 内部用 (慣習。アクセス自体は可能) |
| `__name` | 名前修飾 (`_ClassName__name` に変換され、継承先との衝突を避ける) |
| `__name__` | 特殊メソッド・特殊属性 (自分で新しく作らない) |
| `name_` | 予約語などとの衝突回避 (`class_` など) |

---

## イテレータとジェネレータ <a id="iterator" data-name="イテレータ・ジェネレータ"></a>

### イテラブルとイテレータ

- **イテラブル**: `for` で回せるオブジェクト (`list` `str` `dict` `range` など)。`iter()` でイテレータを返せる
- **イテレータ**: `next()` で要素を 1 つずつ取り出せるオブジェクト。要素がなくなると `StopIteration` を送出する

```python
it = iter([10, 20])
next(it)    # 10
next(it)    # 20
next(it)    # StopIteration
```

`for x in obj:` は、内部的には次のような処理になっている。

```python
it = iter(obj)
while True:
    try:
        x = next(it)
    except StopIteration:
        break
    ...
```

イテレータは **一度しか使えない**。

```python
it = iter([1, 2, 3])
list(it)    # [1, 2, 3]
list(it)    # []  ← すでに使い切っている
```

### 自作イテレータ

`__iter__` と `__next__` を定義する。

```python
class CountDown:
    def __init__(self, n):
        self.n = n

    def __iter__(self):
        return self

    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

list(CountDown(3))    # [3, 2, 1]
```

### ジェネレータ関数

`yield` を含む関数はジェネレータ関数になり、呼び出すと **ジェネレータ (イテレータの一種)** を返す。<br>
`yield` で値を返して **一時停止** し、次の `next()` で続きから再開する。値は必要になったときに生成される。

```python
def count_up(n):
    for i in range(1, n + 1):
        yield i

g = count_up(3)
next(g)     # 1
list(g)     # [2, 3]
list(g)     # []  (一度きり)
```

無限のシーケンスも表現できる。

```python
def fib():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

from itertools import islice
list(islice(fib(), 8))    # [0, 1, 1, 2, 3, 5, 8, 13]
```

#### yield from

別のイテラブルの要素を、そのまま順に `yield` する。

```python
def chain2(a, b):
    yield from a
    yield from b

list(chain2([1, 2], "ab"))   # [1, 2, 'a', 'b']
```

<pre><code class="tips">ジェネレータ式 (x * x for x in range(5)) は、yield を使ったジェネレータ関数を式の形で書いたもの。</code></pre>

### itertools

イテレータを組み合わせるための標準ライブラリ。

```python
from itertools import chain, islice, count, product, permutations, combinations, groupby

list(chain([1, 2], [3]))             # [1, 2, 3]
list(islice(count(10), 3))           # [10, 11, 12]
list(product("ab", [1, 2]))          # [('a', 1), ('a', 2), ('b', 1), ('b', 2)]
list(permutations([1, 2, 3], 2))     # [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]
list(combinations([1, 2, 3], 2))     # [(1, 2), (1, 3), (2, 3)]

# groupby は「連続した」同じキーをまとめる (事前にソートが必要)
for key, group in groupby(sorted("aabbab")):
    print(key, list(group))          # a ['a','a','a'] / b ['b','b','b']
```

---

## with文とコンテキストマネージャ <a id="with" data-name="with文"></a>

`with` は、**開始時の処理** と **終了時の後始末** をセットで行う構文。<br>
ブロック内で例外が起きても、後始末は必ず実行される。

```python
with open("a.txt", encoding="utf-8") as f:
    data = f.read()
# ここに来た時点で f は自動的に close されている
```

`try` / `finally` で書くと次と同じ意味になる。

```python
f = open("a.txt", encoding="utf-8")
try:
    data = f.read()
finally:
    f.close()
```

複数のコンテキストマネージャを同時に使える。

```python
with open("in.txt", encoding="utf-8") as src, open("out.txt", "w", encoding="utf-8") as dst:
    dst.write(src.read())
```

### 自作のコンテキストマネージャ

`__enter__` と `__exit__` を持つクラスを作る。

```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self                       # as の後ろの変数に入る

    def __exit__(self, exc_type, exc, tb):
        import time
        print(f"{time.perf_counter() - self.start:.3f} 秒")
        return False                      # True を返すと例外が握りつぶされる

with Timer():
    sum(range(10_000_000))
```

### contextlib

`@contextmanager` を使うと、ジェネレータ関数でコンテキストマネージャを作れる。

```python
from contextlib import contextmanager

@contextmanager
def cd(path):
    import os
    old = os.getcwd()
    os.chdir(path)
    try:
        yield                 # ここで with ブロックが実行される
    finally:
        os.chdir(old)         # 例外が起きても必ず元に戻す

with cd("/tmp"):
    ...
```

```python
from contextlib import suppress

with suppress(FileNotFoundError):    # 指定した例外を無視する
    os.remove("maybe.txt")
```

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

#### try

このブロックに例外が発生する可能性があるコードを記述する。<br>
例外が発生した場合、exceptブロックへ処理が移り、発生しなければelseブロックが実行される。

#### except

tryブロックで例外が発生した際の処理を記述する。<br>
例外の種類を指定することで、特定のエラーをキャッチする。<br>
複数の例外をキャッチする場合は、exceptを複数並べるか、タプルで記述する。<br>
指定していない例外は捕捉されずに呼び出し元へ伝わり、どこでも捕捉されなければプログラムが異常終了する(トレースバックが表示される)。

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

<pre><code class="tips">Exceptionが一般的なエラーの基底クラスで、通常のtry/exceptではこのクラス以下を捕捉する(BaseExceptionが全ての例外の基底クラス)。</code></pre>

#### else

例外が発生しなかった場合に実行される。<br>
`else` の中で発生した例外は、同じ `try` の `except` では捕捉されない。

#### finally

例外の有無に関わらず、必ず実行されるブロック。<br>
ファイルのクローズ処理や、リソースの解放などに使う。

<pre><code class="tips">try:を使うことにより、ファイルのクローズやリソースの解放の様な後片付けを確実に実行することができる。</code></pre>

#### raise

意図的に例外を発生させる。

<pre><code class="example">raise ValueError('Sequence arguments must be non-empty')</code></pre>

#### 再送出と例外の連鎖

`except` の中で引数なしの `raise` を書くと、**捕捉した例外をそのまま再送出** する。ログを残してから呼び出し元に任せたいときに使う。

```python
try:
    risky()
except ValueError:
    print("ログを出力")
    raise              # 同じ例外をもう一度送出
```

別の例外に変換する場合は `raise ... from ...` を使う。元の例外が **原因 (`__cause__`)** として記録され、トレースバックにも両方が表示される。

```python
try:
    int("abc")
except ValueError as e:
    raise RuntimeError("設定値が不正です") from e
```

`from None` を付けると、元の例外の情報を表示しない。

#### 例外の階層と主な例外

```text
BaseException
 ├─ SystemExit
 ├─ KeyboardInterrupt          (Ctrl+C)
 └─ Exception                  (通常捕捉するのはここから下)
     ├─ ArithmeticError
     │   └─ ZeroDivisionError
     ├─ LookupError
     │   ├─ IndexError
     │   └─ KeyError
     ├─ OSError
     │   ├─ FileNotFoundError
     │   └─ PermissionError
     ├─ ValueError
     │   └─ UnicodeError (UnicodeDecodeError など)
     ├─ TypeError
     ├─ AttributeError
     ├─ NameError
     ├─ ImportError
     │   └─ ModuleNotFoundError
     ├─ StopIteration
     └─ RuntimeError
         ├─ NotImplementedError
         └─ RecursionError
```

| 例外 | 主な発生例 |
| --- | --- |
| `ValueError` | 型は正しいが値が不適切 (`int("abc")`) |
| `TypeError` | 型が不適切 (`1 + "a"`、引数の数の誤り) |
| `KeyError` | 辞書に存在しないキー (`d["x"]`) |
| `IndexError` | 範囲外のインデックス (`[][0]`) |
| `AttributeError` | 存在しない属性 (`None.foo`) |
| `NameError` | 定義されていない変数名の参照 |
| `ZeroDivisionError` | 0 での除算 |
| `FileNotFoundError` | 存在しないファイルを開こうとした |
| `StopIteration` | イテレータの終了 (`next()`) |
| `AssertionError` | `assert` の失敗 |

#### except の順序

上から順に調べ、**最初にマッチしたもの** だけが実行される。サブクラスは親クラスより先に書く。

```python
try:
    open("none.txt")
except FileNotFoundError:     # 具体的な例外を先に
    print("ファイルがない")
except OSError:               # 広い例外を後に
    print("その他の OS エラー")
```

<pre><code class="caution">try:
    ...
except:            # ❌ 裸の except は KeyboardInterrupt や SystemExit まで捕捉してしまう
    pass

except Exception:  # ○ 最低でも Exception にする (握りつぶす場合でもログは残す)</code></pre>

#### 独自の例外

`Exception` を継承して作る。アプリ共通の基底例外を 1 つ作っておくと、まとめて捕捉できる。

```python
class AppError(Exception):
    """アプリ共通の基底例外"""

class NotFoundError(AppError):
    def __init__(self, key):
        super().__init__(f"{key} が見つかりません")
        self.key = key

try:
    raise NotFoundError("user-1")
except AppError as e:
    print(e)          # user-1 が見つかりません
```

#### EAFP と LBYL

- **LBYL** (Look Before You Leap): 事前にチェックしてから実行する
- **EAFP** (Easier to Ask Forgiveness than Permission): まず実行して、失敗したら例外を処理する。Python では EAFP が好まれる

```python
# LBYL
if "key" in d:
    value = d["key"]
else:
    value = None

# EAFP
try:
    value = d["key"]
except KeyError:
    value = None

# この場合は get() が最も簡潔
value = d.get("key")
```

#### assert

条件が偽のとき `AssertionError` を送出する。**開発中の「あり得ないはず」の確認用** で、`python -O` で実行すると無効になる。入力値の検証には使わない。

```python
assert x > 0, "x は正の数のはず"
```

#### finally と return

`finally` は `return` の後でも実行される。`finally` の中で `return` すると、**例外や元の戻り値を上書きして握りつぶす** ので避ける。

```python
def f():
    try:
        return "try"
    finally:
        print("finally は実行される")

f()    # finally は実行される → 'try'
```

#### 例外オブジェクト

```python
try:
    int("abc")
except ValueError as e:
    print(e)              # invalid literal for int() with base 10: 'abc'
    print(repr(e))        # ValueError("invalid literal for int() with base 10: 'abc'")
    print(e.args)         # ("invalid literal for int() with base 10: 'abc'",)
    print(type(e).__name__)   # ValueError
```

`as e` の `e` は、**`except` ブロックを抜けると自動的に削除される**。ブロックの外で使いたい場合は、別の名前に代入しておく。


---

## Traceback <a id="traceback" data-name="Traceback"></a>

traceback モジュールは、サーバーなど、トレースバックが画面に表示されない状況で、例外の情報を取得・記録するのに役に立つ。

```python
import traceback
```

### 基本的な使い方

```python
import traceback

try:
    1 / 0
except Exception:
    traceback.print_exc()
```

### エラーを整形して表示

```python
import traceback

try:
    1 / 0
except Exception:
    error_text = traceback.format_exc()
    print(error_text)
```

### logging との組み合わせ

```python
import logging
import traceback

logger = logging.getLogger(__name__)

try:
    ...
except Exception:
    logger.error(traceback.format_exc())
```

`logging` の `logger.exception()` は、**例外のメッセージとトレースバックを自動で付けてログに記録** するので、通常はこちらで十分。`except` ブロックの中で使う。

```python
try:
    ...
except Exception:
    logger.exception("処理に失敗しました")   # ERROR レベル + トレースバック
```

<pre><code class="tips">traceback.print_exc() は標準エラー出力 (stderr) に表示する。
文字列として欲しいときは format_exc()、例外オブジェクトから整形したいときは traceback.format_exception(e) を使う。</code></pre>

---

## import <a id="import" data-name="import"></a>

`import` は単なる「ファイルを読み込む構文」ではない。<br>
**モジュールを探して読み込み、その中のオブジェクトを名前空間から使えるようにする仕組み**である。

```text
import math
   ↓
math モジュールを探す (sys.path)
   ↓
読み込む (初回のみ実行して sys.modules に保存)
   ↓
現在の名前空間に math という名前を登録
```

### 基本形

```python
import math                    # モジュールそのものを登録 → math.sqrt(16)
import math as m               # 別名を付ける          → m.sqrt(16)
from math import sqrt          # 中の名前を直接登録    → sqrt(16)
from math import sqrt as s     # 別名を付けて登録      → s(16)
from math import *             # 公開されている名前をすべて登録
```

### import と from import の違い

登録される **名前** が違う。

```python
import math
math.sqrt(16)      # OK
sqrt(16)           # NameError

from math import sqrt
sqrt(16)           # OK
math.sqrt(16)      # NameError (math という名前は作られていない)
```

```text
import math           現在の名前空間 └── math (モジュールオブジェクト)
from math import sqrt 現在の名前空間 └── sqrt (モジュール内の関数)
```

`import math` は概念的には `math = <mathモジュール>` に近い。(厳密には単純な代入ではない)

### モジュールとは

`.py` ファイル 1 つがそのままモジュールになる。

```text
project/
├── main.py
└── hello.py
```

```python
# hello.py
message = "Hello"

def say_hello():
    print(message)
```

```python
# main.py
import hello

hello.say_hello()
print(hello.message)
```

### import するとモジュールは実行される

`import hello` すると `hello.py` の **トップレベルのコードが上から順に実行** される。

```python
# hello.py
print("hello.py が実行された")

x = 100
```

```python
# main.py
import hello
print("main.py")
```

```text
hello.py が実行された
main.py
```

### 2回目以降は再実行されない (sys.modules)

一度読み込んだモジュールは **`sys.modules`** (辞書) にキャッシュされる。<br>
2回目以降の `import` は、ここにあれば既存のモジュールオブジェクトをそのまま使う。

```python
import sys
import math

print("math" in sys.modules)   # True
print(sys.modules["math"])
```

### モジュールの検索場所 (sys.path)

Pythonは PC 全体を検索するわけではなく、**`sys.path`** に並んだ場所を順に探す。

```python
import sys
print(sys.path)
```

`sys.path` に含まれる主なもの。

- 実行したスクリプトのあるディレクトリ
- 標準ライブラリ
- `site-packages` (`pip install` したパッケージの置き場所)
- 環境変数 `PYTHONPATH` で指定した場所

```text
pip install requests → site-packages → sys.path → import requests
```

### パッケージと `__init__.py`

モジュールをディレクトリでまとめたものが **パッケージ**。

```text
project/
├── main.py
└── myapp/
    ├── __init__.py
    ├── user.py
    └── database.py
```

```python
import myapp.user                      # myapp.user.some_function() で使う
from myapp import user                 # user.some_function()
from myapp.user import some_function  # some_function()
```

登録される名前は、`import a.b` なら `a`、`from a import b` なら `b`、`from a.b import c` なら `c`。

`__init__.py` は **パッケージの初期化処理**。`import myapp` したときに実行される。<br>
ここで再エクスポートしておくと、外から見える構造を整理できる。

```python
# myapp/__init__.py
from .user import get_user
```

```python
from myapp import get_user   # myapp.user を意識せず使える
```

### 絶対import と相対import

```python
from myapp.user import get_user   # 絶対import: ルートから探す
from .user import get_user        # 相対import: 今いるパッケージから探す
```

| 記法 | 意味 |
| --- | --- |
| `.` | 現在のパッケージ |
| `..` | 親パッケージ |
| `...` | さらに親 |

```text
project/
├── common/
│   └── util.py
└── app/
    └── service.py
```

```python
# app/service.py
from ..common import util   # project.common.util
```

<pre><code class="caution">相対 import は「パッケージの一部として」読み込まれたときだけ動く。
python app/service.py のように直接実行すると、
ImportError: attempted relative import with no known parent package になる。
パッケージとして実行する場合は python -m app.service とする。</code></pre>

`__init__.py` が無いディレクトリも、3.3 以降は **名前空間パッケージ** として `import` できる。ただし、初期化処理や再エクスポートが必要なら `__init__.py` を置く。

### 循環 import

`a.py` と `b.py` が互いを `import` すると、**途中まで実行された状態のモジュール** を参照してしまい、エラーになる。

```python
# a.py
import b
def fa(): ...

# b.py
from a import fa     # a はまだ実行の途中で fa が定義されていない → ImportError
```

対処法は次の通り。

- 共通部分を **第3のモジュール** に切り出して、依存を一方向にする
- `from a import fa` ではなく `import a` にして、**使う時点で** `a.fa` を参照する
- 関数の中で `import` する (呼び出し時に読み込む)
- 型ヒントだけで必要な場合は `if TYPE_CHECKING:` の中で `import` する

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:        # 実行時には import されない (型チェッカーだけが見る)
    from a import A
```

### importlib

```python
import importlib

mod = importlib.import_module("math")   # 文字列でモジュール名を指定して import
importlib.reload(mod)                   # 再読み込み (キャッシュを無視してもう一度実行する)
```

### `__name__` と `__main__`

`__name__` の値は、ファイルの使われ方で変わる。

| 使われ方 | `__name__` |
| --- | --- |
| `python hello.py` (直接実行) | `"__main__"` |
| `import hello` | `"hello"` |

```python
# hello.py
def hello():
    print("hello")

if __name__ == "__main__":
    hello()
```

`python hello.py` では `hello` が表示されるが、`import hello` では表示されない。<br>
`if __name__ == "__main__":` は **そのファイルが直接実行されたときだけ実行する** という意味になる。

### `import *` と `__all__`

`from module import *` は名前を大量に展開するため、**名前の衝突** を起こしやすく、通常は避ける。

```python
from module_a import *
from module_b import *   # 同名の foo があれば後勝ちで上書きされる
```

`__all__` を定義すると、`import *` で公開する名前を制御できる。

```python
# module.py
__all__ = ["foo", "bar"]

foo = 1
bar = 2
baz = 3   # from module import * では取り込まれない
```

### まとめ

```text
import
 ↓
モジュールを探す  (sys.path)
 ↓
見つける
 ↓
初回なら実行
 ↓
モジュールオブジェクトを作る
 ↓
sys.modules にキャッシュ
 ↓
指定された名前を現在の名前空間へ登録
```

| 疑問 | 答え |
| --- | --- |
| 何を探す？ | モジュール / パッケージ |
| どこを探す？ | `sys.path` |
| 読み込んだものは？ | モジュールオブジェクト |
| 保存場所は？ | `sys.modules` |
| どうやって使う？ | 名前空間に名前を登録 |
| 何が実行される？ | モジュールのトップレベルコード |

### 次に学ぶこと

```text
import / from import → module → package → __init__.py
   → __name__ / __main__ → sys.path → sys.modules
   → absolute / relative import → importlib
   → module spec / loader / finder
```

`sys.path` → `sys.modules` → `importlib` まで進むと、次のような疑問まで一本につながる。

- なぜ `import xxx` だけで知らないファイルを見つけられるのか
- Django で `from .models import User` がなぜ動くのか
- `pip install` したパッケージがなぜ `import` できるのか
- 循環importがなぜ起きるのか
