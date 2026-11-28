---
title: random
layout: default
---

# random <a id="top" data-name="TOP"></a>

random は、疑似乱数を生成する Python の標準ライブラリ。<br>
整数や小数の乱数、リストからの選択、並び替え、確率分布に従う乱数などを扱える。

```python
import random
```

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 標準ライブラリ | インストールは不要で、`import random` だけで使える |
| 疑似乱数 | 生成器が、決まった計算で乱数を作る。同じ種 (seed) からは、同じ列が得られる |
| 生成器 | 内部は Mersenne Twister。モジュールの関数は、隠れた `Random` のインスタンスのメソッドである |
| スレッドセーフ | グローバルの生成器と `Random` のインスタンスは、スレッドセーフである |

### 関数の分類

| 分類 | 主な関数 |
| --- | --- |
| 整数 | `randint()`、`randrange()`、`getrandbits()` |
| 小数 | `random()`、`uniform()` |
| バイト列 | `randbytes()` |
| 要素の選択 | `choice()`、`choices()`、`sample()`、`shuffle()` |
| 確率分布 | `gauss()`、`normalvariate()`、`triangular()`、`expovariate()`、`binomialvariate()` など |
| 種と状態 | `seed()`、`getstate()`、`setstate()` |

<pre><code class="caution">random の乱数は、予測できるため、パスワードやトークンなどのセキュリティ用途には使えない。
その用途には、標準ライブラリの secrets モジュールを使う。</code></pre>

<pre><code class="tips">このドキュメントは、Python 3.12 以降の公式ドキュメントを前提にしている。
バージョンによって、一部の関数の引数や挙動が異なる。違いは、各章と落とし穴の表に書いている。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

標準ライブラリのため、インストールは不要。

```python
import random

print(random.random())
```

```text
0.7364712141640124
```

出力は、実行のたびに変わる。

---

## 乱数の生成 <a id="generate" data-name="乱数の生成"></a>

### 整数

| 関数 | 内容 |
| --- | --- |
| `randint(a, b)` | `a` 以上 `b` 以下の整数 (両端を含む) |
| `randrange(stop)` | 0 以上 `stop` 未満の整数 |
| `randrange(start, stop, step)` | `range(start, stop, step)` の中から選んだ整数 |
| `getrandbits(k)` | `k` ビットの、0 以上の整数 |

```python
import random

print(random.randint(1, 6))         # サイコロ (1〜6)
print(random.randrange(10))         # 0〜9
print(random.randrange(0, 100, 5))  # 0 から 95 までの 5 の倍数
```

<pre><code class="caution">randint() は、終端の値を含む。randrange() や range() は、終端の値を含まない。
Python 3.12 以降は、randrange(10.0) のような、整数以外の値は TypeError になる。
キーワード引数での指定は、意図しない解釈をされることがあるため、位置引数で渡す。</code></pre>

### 小数

| 関数 | 内容 |
| --- | --- |
| `random()` | `0.0 <= X < 1.0` の小数 |
| `uniform(a, b)` | `a` と `b` の間の小数 |

```python
import random

print(random.random())        # 0.0 以上 1.0 未満
print(random.uniform(1, 10))  # 1 から 10 の間
```

<pre><code class="tips">uniform() の終端の値が含まれるかどうかは、浮動小数点の丸めによって変わる。</code></pre>

### バイト列

```python
import random

data = random.randbytes(4)  # 4 バイトのランダムなバイト列
print(data)
```

<pre><code class="caution">randbytes() は、セキュリティ用のトークンの生成には使えない。
その用途には、secrets.token_bytes() を使う。</code></pre>

---

## 要素の選択 <a id="select" data-name="要素の選択"></a>

### 1 つ選ぶ (choice)

```python
import random

fruits = ["apple", "banana", "cherry"]
print(random.choice(fruits))
```

空のシーケンスを渡すと、`IndexError` になる。

### 要素ごとに出現確率を指定

`random.choices()` で、要素ごとに出現確率を指定して選べる。

| 引数 | 内容 |
| --- | --- |
| `elements` | 要素をリストで指定する |
| `weights` | 各要素の重みを指定する。重みの合計が 1 である必要はなく、相対的な値でいい |
| `cum_weights` | 累積重みを指定することもできる |
| `k` | `k=1` は 1 回選択することを意味し、複数回選択したい場合は `k` に回数を指定する |

```python
# 出現する要素
elements = ['A', 'B', 'C']
# 各要素の出現確率 (Aが50%、Bが30%、Cが20%)
weights = [0.5, 0.3, 0.2]
# 1回の選択を行う
result = random.choices(elements, weights=weights, k=1)
print(result[0])
# 複数回の選択を行う場合
results = random.choices(elements, weights=weights, k=10)
print(results)
```

```text
A
['A', 'B', 'A', 'C', 'A', 'A', 'B', 'A', 'C', 'B']
```

出力は、実行のたびに変わる。

`cum_weights` は、`itertools.accumulate()` で作れる。`weights` と同じ結果になる。

```python
import random
from itertools import accumulate

elements = ['A', 'B', 'C']
cum_weights = list(accumulate([5, 3, 2]))  # [5, 8, 10]
print(random.choices(elements, cum_weights=cum_weights, k=5))
```

<pre><code class="caution">choices() は、同じ要素を何度でも選べる (復元抽出)。結果は、k 個のリストで返るため、k=1 でも result[0] で取り出す。
weights と cum_weights は、同時に指定できない。
重みがすべて 0 の場合は、ValueError になる。Decimal は、重みに使えない。</code></pre>

### 重複なく選ぶ (sample)

```python
import random

numbers = list(range(1, 11))
print(random.sample(numbers, k=3))  # 重複なしで 3 個
```

| 引数 | 内容 |
| --- | --- |
| `population` | 選ぶ元のシーケンス。`range()` も渡せる (大きな範囲でも効率がよい) |
| `k` | 選ぶ個数。母集団より大きいと `ValueError` になる |
| `counts` | 各要素の個数 (キーワード引数) |

```python
import random

# 赤 4 個、青 2 個の中から、5 個を選ぶ
print(random.sample(["red", "blue"], counts=[4, 2], k=5))
```

<pre><code class="caution">Python 3.11 以降、sample() の母集団は、シーケンスでなければならない。set を渡すと TypeError になるため、list() に変換する。</code></pre>

### 並び替える (shuffle)

```python
import random

cards = [1, 2, 3, 4, 5]
random.shuffle(cards)  # 元のリストを、その場で並び替える
print(cards)
```

元のリストを変えずに、並び替えた新しいリストを得るには、`sample()` を使う。

```python
shuffled = random.sample(cards, k=len(cards))
```

### 選択の関数の比較

| 関数 | 重複 | 戻り値 | 元のデータ |
| --- | --- | --- | --- |
| `choice()` | - | 要素 1 つ | 変わらない |
| `choices()` | あり | リスト (`k` 個) | 変わらない |
| `sample()` | なし | リスト (`k` 個) | 変わらない |
| `shuffle()` | なし | `None` | その場で変わる |

---

## 確率分布 <a id="distribution" data-name="確率分布"></a>

| 関数 | 内容 |
| --- | --- |
| `gauss(mu, sigma)` | 正規分布 (ガウス分布) |
| `normalvariate(mu, sigma)` | 正規分布 (`gauss()` と同じ分布を返す) |
| `triangular(low, high, mode)` | 三角分布 |
| `expovariate(lambd)` | 指数分布 |
| `binomialvariate(n, p)` | 二項分布。`n` 回の試行の成功回数を返す (Python 3.12 以降) |

```python
import random

# 平均 170、標準偏差 5 の正規分布から 3 つ取り出す
print([round(random.gauss(170, 5), 1) for _ in range(3)])

# コインを 10 回投げたときの、表の回数
print(random.binomialvariate(n=10, p=0.5))
```

<pre><code class="tips">binomialvariate(n, p) は、sum(random() &lt; p for i in range(n)) と、数学的に同じ結果になる。
Python 3.12 より前のバージョンには、binomialvariate() がない。</code></pre>

---

## 乱数の種 (seed) <a id="seed" data-name="乱数の種"></a>

`seed()` で種を固定すると、同じ乱数の列を再現できる。

```python
import random

random.seed(0)
print(random.random())

random.seed(0)
print(random.random())  # 同じ値になる
```

```text
0.8444218515250481
0.8444218515250481
```

| 関数 | 内容 |
| --- | --- |
| `seed(a)` | 種を設定する。省略すると、OS の乱数などから決まる |
| `getstate()` | 生成器の内部の状態を取得する |
| `setstate(state)` | `getstate()` で取得した状態に、生成器を戻す |

```python
import random

state = random.getstate()
a = random.random()

random.setstate(state)  # 状態を戻す
b = random.random()

print(a == b)  # True
```

### Random クラス

モジュールの関数は、1 つのグローバルな生成器を共有する。独立した生成器が必要なときは、`Random` のインスタンスを作る。

```python
import random

rng = random.Random(42)  # 種を指定して、独立した生成器を作る
print(rng.randint(1, 6))
print(rng.choice(["A", "B", "C"]))
```

<pre><code class="tips">スレッドごと、テストごと、シミュレーションごとに、独立した生成器が必要な場合は、Random のインスタンスを使う。
フリースレッドのビルドでは、同じ生成器を複数のスレッドで使うと、競合による性能の低下が起きることがある。スレッドごとにインスタンスを分ける。</code></pre>

<pre><code class="caution">Python 3.11 以降、seed() に渡せる型は、None、int、float、str、bytes、bytearray だけである。
同じ種でも、Python のバージョンや、関数の種類によって、結果の列が同じになるとは限らない。</code></pre>

---

## 実践例 <a id="practice" data-name="実践例"></a>

### ガチャ (確率つきの抽選)

```python
import random

# 景品と、出現確率の重み
prizes = ["SSR", "SR", "R"]
weights = [3, 17, 80]  # 合計が 100 である必要はないが、百分率にすると分かりやすい

results = random.choices(prizes, weights=weights, k=10)
print(results)
```

### トランプのシャッフルと配布

```python
import random

suits = ["♠", "♥", "♦", "♣"]
ranks = ["A"] + [str(n) for n in range(2, 11)] + ["J", "Q", "K"]
deck = [f"{suit}{rank}" for suit in suits for rank in ranks]

random.shuffle(deck)
hand = deck[:5]  # 先頭の 5 枚を配る
print(hand)
```

### ランダムなパスワード

パスワードの生成には、`random` ではなく、`secrets` を使う。

```python
import secrets
import string

alphabet = string.ascii_letters + string.digits
password = "".join(secrets.choice(alphabet) for _ in range(16))
print(password)
```

---

## テスト <a id="testing" data-name="テスト"></a>

乱数を使うコードは、そのままでは結果が毎回変わるため、テストしにくい。種を固定するか、生成器を引数で渡す。

```python
import random


def pick_winner(entries, rng=None):
    # 生成器を引数で受け取り、テストでは種を固定したものを渡す
    rng = rng or random
    return rng.choice(entries)


def test_pick_winner_is_reproducible():
    entries = ["A", "B", "C"]
    first = pick_winner(entries, random.Random(0))
    second = pick_winner(entries, random.Random(0))
    assert first == second


def test_pick_winner_is_in_entries():
    entries = ["A", "B", "C"]
    for _ in range(100):
        assert pick_winner(entries) in entries
```

<pre><code class="tips">グローバルの random.seed() をテストの中で呼ぶと、他のテストにも影響する。独立した Random のインスタンスを使う方が、安全である。
結果の値そのものを検証するのではなく、「結果が候補の中にある」「同じ種なら同じ結果になる」といった、性質を検証する。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| パスワードやトークンが、予測されるおそれがある | `random` は、セキュリティ用途に向いていない | `secrets` を使う |
| `randint(1, 6)` で、7 が出ないと思ったが、6 が出た | `randint()` は、終端を含む | 終端を含めたくないときは `randrange()` を使う |
| `IndexError` | `choice()` や `choices()` に、空のシーケンスを渡した | 空でないことを、先に確認する |
| `TypeError: Cannot specify both weights and cumulative weights` のようなエラー | `choices()` に、`weights` と `cum_weights` の両方を渡した | どちらか一方だけを渡す |
| `ValueError` (重み) | `choices()` の重みが、すべて 0 | 0 より大きい重みを、少なくとも 1 つ与える |
| `TypeError` (`sample()`) | Python 3.11 以降で、`set` を `sample()` に渡した | `list()` に変換して渡す |
| `ValueError: Sample larger than population or is negative` のようなエラー | `sample()` の `k` が、母集団より大きい | `k` を母集団の大きさ以下にする。重複を許すなら `choices()` を使う |
| `shuffle()` の戻り値が `None` | `shuffle()` は、その場で並び替える | 戻り値を使わず、元のリストを使う。新しいリストが必要なら `sample()` を使う |
| `random.shuffle(range(5))` が失敗する | `range` や、タプルなどの、変更できないシーケンスは、その場で並び替えられない | `list()` に変換するか、`sample()` を使う |
| `randrange(10.0)` が `TypeError` になる | Python 3.12 以降、整数以外の値は、自動で変換されない | 整数を渡す |
| `binomialvariate` が見つからない | Python 3.12 より前のバージョンを使っている | Python を更新するか、`sum(random() < p for ...)` で代用する |
| 種を固定しても、結果が再現しない | 別の場所で、同じ生成器を使って、乱数を消費している。またはバージョンが違う | 独立した `Random` のインスタンスを使う |
| 乱数の偏りを、統計的に厳密に扱いたい | `random` は、数値計算向けの機能が限られる | NumPy の乱数などを使う |

---

## 関連 <a id="ecosystem" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| `secrets` | セキュリティ用途の乱数 (パスワード、トークン) |
| `os.urandom()` | OS が提供する、乱数のバイト列 |
| `random.SystemRandom` | `os.urandom()` を使う生成器。種を指定できず、再現はできない |
| `uuid` | 一意な ID の生成 |
| `numpy.random` | 配列の乱数、数値計算向けの乱数 |
| `itertools` | `accumulate()` で、`cum_weights` を作る |
