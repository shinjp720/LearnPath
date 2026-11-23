---
title: プログラミング全般
layout: default
---

# プログラミング全般 <a id="top" data-name="TOP"></a>

プログラミングにおける共通の知識まとめ。

特定のプログラミング言語に依存しない、設計原則、命名規則、比較演算子の書き方、基本的な用語を扱う。

---

## 概要 <a id="overview" data-name="概要"></a>

### このノートの内容

| 章 | 内容 |
| --- | --- |
| <a href="#design-principles-n-patterns">設計原則とデザインパターン</a> | SOLID、GRASP、コマンド・クエリ分離、GoF のデザインパターン。変化に強いソフトウェアを作るための考え方 |
| <a href="#nameing-convention">命名規則</a> | スネークケースやキャメルケースなど、名前の書き方 |
| <a href="#english-like">英語形式の比較演算子</a> | `eq` や `lt` など、英語で書く比較演算子 |
| <a href="#term">用語</a> | 宣言、定義、式、文など、言語に共通する基本用語 |
| <a href="#pitfalls">よくある落とし穴</a> | 設計と命名、比較、用語での、間違いやすい点 |

<pre><code class="tips">設計原則の章のコード例は Python、用語の章のコード例は C で書いている。原則そのものは、言語に依存しない。</code></pre>

---

## 設計原則とデザインパターン <a id="design-principles-n-patterns" data-name="設計原則とデザインパターン"></a>

### 変化に強いソフトウェア

変化に強いソフトウェアは、次の 3つの特性を持つ。設計原則は、これらを実現するための指針である。

| 特性 | 内容 |
| --- | --- |
| 保守性が高い | 修正箇所が局所化され、他の部分に影響を与えない |
| 再利用性が高い | ソフトウェアが部品化され、それを再利用することができる |
| 拡張性が高い | ソフトウェアを構成する要素同士を疎結合にすることで、ソフトウェアを様々な実装で拡張することができる |

---

### SOLIDの原則 <a id="solid" data-name="SOLIDの原則"></a>

SOLID は、5つの設計原則の頭文字を並べたもの。Robert C. Martin が、2000年の論文で、まとめて紹介した。

| 略称 | 原則 | 英語名 |
| --- | --- | --- |
| S | 単一責任の原則 (SRP) | Single Responsibility Principle |
| O | 開放/閉鎖の原則 (OCP) | Open-Closed Principle |
| L | リスコフの置換原則 (LSP) | Liskov Substitution Principle |
| I | インターフェース分離の原則 (ISP) | Interface Segregation Principle |
| D | 依存性逆転の原則 (DIP) | Dependency Inversion Principle |

#### 単一責任の原則 (SRP)

1つのソフトウェア構成要素 (サブシステムやモジュール、クラス、関数など) に、変更する理由が2つ以上あるようではいけない。

大前提として、コードの修正にはコストがかかる。

- そのコードを修正することで、どこに影響があるか調査しなければならない。
- 修正の影響で、動作に支障が出ないか確認しなければならない。

変更による影響を最小限に抑えるようにソフトウェアを設計する必要がある。

単一責任の原則を適用することにより、ソフトウェア構成要素が持つ単一の責務が変更された時のみ、それが変更されるようにすることで、変更による影響を最小限に抑えることができる。

次の例では、`Report` が、集計の仕様と、保存の方法という、2つの変更理由を持っている。保存の方法を、別のクラスに分けると、それぞれの変更理由が、1つになる。

```python
# 悪い例: 集計の仕様と、保存の方法が、1つのクラスにある
class Report:
    def __init__(self, items):
        self.items = items

    def total(self):
        return sum(price for _, price in self.items)

    def save(self, path):
        with open(path, "w", encoding="utf-8") as f:
            f.write(str(self.total()))
```

```python
import os
import tempfile

# 良い例: 責務ごとにクラスを分ける
class Report:
    def __init__(self, items):
        self.items = items

    def total(self):
        return sum(price for _, price in self.items)


class ReportWriter:
    def save(self, report, path):
        with open(path, "w", encoding="utf-8") as f:
            f.write(str(report.total()))


report = Report([("pen", 100), ("note", 250)])
path = os.path.join(tempfile.mkdtemp(), "report.txt")
ReportWriter().save(report, path)
print(open(path, encoding="utf-8").read())  # 350
```

#### 開放/閉鎖の原則 (OCP)

ソフトウェアの構成要素は、拡張のために開かれていて、修正のために閉じられていなければならない。

ソフトウェアの構成要素に機能拡張が発生した場合、既存のコードには修正を加えずに (閉じている) 新しくコードを追加するだけで対応できる (開いている) ようにするということ。

既存のコードは、バグがあった場合のみ修正する。

```python
# 悪い例: 図形が増えるたびに、既存の関数を修正する
def area(shape):
    if shape["type"] == "circle":
        return 3.14 * shape["r"] ** 2
    elif shape["type"] == "rectangle":
        return shape["w"] * shape["h"]
    raise ValueError(shape["type"])


print(area({"type": "circle", "r": 1}))  # 3.14
```

```python
from abc import ABC, abstractmethod

# 良い例: 図形が増えても、新しいクラスを追加するだけで済む
class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...


class Circle(Shape):
    def __init__(self, r):
        self.r = r

    def area(self):
        return 3.14 * self.r ** 2


class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h

    def area(self):
        return self.w * self.h


def total_area(shapes):
    return sum(s.area() for s in shapes)


print(total_area([Circle(1), Rectangle(2, 3)]))  # 9.14
```

<pre><code class="tips">OCP は、Bertrand Meyer が 1988年ごろに示した考え方を、Robert C. Martin が、継承ではなく、抽象への依存で実現する形に、言い直したものとされる。</code></pre>

#### リスコフの置換原則 (LSP)

もし、S が T の派生型であれば、プログラム内で T 型のオブジェクトが使われている箇所は、全て S 型のオブジェクトで置換可能にする。

多態性を利用して、利用者に対するインターフェースを統一し、置換可能にすることで、拡張性を上げることができる。

派生型は、基底型が持つ約束 (不変条件など) を、守る必要がある。

次の例では、`Square` が `Rect` の約束 (幅を変えても、高さは変わらない) を、破っている。`Rect` を前提にした関数に、`Square` を渡すと、結果が変わる。

```python
class Rect:
    def __init__(self, w, h):
        self.w, self.h = w, h

    def set_width(self, w):
        self.w = w

    def area(self):
        return self.w * self.h


class Square(Rect):  # 悪い例: 幅を変えると、高さも変わってしまう
    def set_width(self, w):
        self.w = self.h = w


def widen(r):
    r.set_width(5)  # 幅だけを 5 にする
    return r.area()


print(widen(Rect(2, 3)))    # 15 (5 x 3)
print(widen(Square(3, 3)))  # 25 (期待は 15)
```

#### インターフェース分離の原則 (ISP)

利用者にとって不要なインターフェースに依存させてはならない。

インターフェースとは、要素を利用する側に提供される仕様で、メソッドでいうと、メソッド名、パラメータ、戻り値の型などの、メソッドのシグネチャ部分のことをいう。

```python
from typing import Protocol


class Printer(Protocol):
    def print_doc(self, doc: str) -> None: ...


class Scanner(Protocol):
    def scan(self) -> str: ...


class SimplePrinter:  # 印刷だけできる
    def print_doc(self, doc):
        print("print:", doc)


class MultiFunction:  # 印刷もスキャンもできる
    def print_doc(self, doc):
        print("print:", doc)

    def scan(self):
        return "scanned"


def print_all(printer: Printer, docs):  # 印刷の機能にだけ依存する
    for d in docs:
        printer.print_doc(d)


print_all(SimplePrinter(), ["a"])
print_all(MultiFunction(), ["b"])
```

#### 依存性逆転の原則 (DIP)

抽象 (上位要素) は、詳細 (下位要素) に依存してはならない。

Robert C. Martin は、この原則を、次の 2つで表している。

| 内容 |
| --- |
| 上位のモジュールは、下位のモジュールに依存してはならない。どちらも、抽象に依存すべきである |
| 抽象は、詳細に依存してはならない。詳細が、抽象に依存すべきである |

```python
from typing import Protocol


class Notifier(Protocol):  # 抽象
    def send(self, message: str) -> None: ...


class EmailNotifier:  # 詳細 (下位)
    def send(self, message):
        print("mail:", message)


class FakeNotifier:  # テスト用の、別の詳細
    def __init__(self):
        self.sent = []

    def send(self, message):
        self.sent.append(message)


class OrderService:  # 上位。Notifier (抽象) にだけ依存する
    def __init__(self, notifier: Notifier):
        self._notifier = notifier

    def place(self, item):
        self._notifier.send(f"注文を受け付けた: {item}")


OrderService(EmailNotifier()).place("本")
fake = FakeNotifier()
OrderService(fake).place("ペン")
print(fake.sent)  # ['注文を受け付けた: ペン']
```

<pre><code class="tips">DIP は原則で、依存性の注入 (DI) は、それを実現する手法である。上の例の、コンストラクタで notifier を受け取る形が、DI である。</code></pre>

---

### GRASP (General Responsibility Assignment Software Patterns) <a id="grasp" data-name="GRASP"></a>

GRASP は、Craig Larman が、著書 Applying UML and Patterns で示した、9つの原則。クラスにどの責任を割り当てるかを、判断するための指針である。Principles (原則) の頭文字とも書く。

| 原則 | 英語名 | 内容 |
| --- | --- | --- |
| 疎結合 | Low Coupling | 結合度が低くなるように、責任を配置する |
| 高凝集 | High Cohesion | 凝集度が高くなるように、責任を配置する |
| 間接化 | Indirection | 2つのクラスの間に、仲介する要素を置く |
| 情報エキスパート | Information Expert | 必要な情報を持つクラスに、責務を割り当てる |
| 生成者 | Creator | そのクラスを使うクラスに、生成の責務を割り当てる |
| 純粋人工物 | Pure Fabrication | 問題の領域にない、人工的なクラスを導入する |
| コントローラ | Controller | システムイベントを制御する、専用のクラスを置く |
| 多態性 | Polymorphism | 変動する振る舞いを、下位クラスに実装させる |
| 変動からの保護 | Protected Variations | 変動する部分を、別のクラスに切り出す |

#### 依存度を下げるための原則

- 疎結合
  - 結合度 (他の要素との結び付きの強さ) が低くなるように、責任を配置するという基本原則。
- 高凝集
  - 凝集度 (構成要素に含まれる機能性のまとまり) が高くなるように、責任を配置するという基本原則。
- 間接化
  - 2つのクラスの中間に要素を設け、両者の仲介を行う責務を割り当てることで、2つのクラスの疎結合を促進するという原則。

#### 役割分担に関する原則

- 情報エキスパート
  - 責務を遂行するために必要な情報を全て保持しているクラスに対して、責務を割り当てるべきという原則。情報エキスパートの原則を適用することにより、責務を遂行するために必要な情報を全て保持しているクラスに対して、責務が集中するので、ソフトウェアの凝集度が高くなる。
- 生成者
  - クラスを生成する責務は、そのクラスを集約するクラスのように、そのクラスを直接使用し、そのクラスを初期化するために必要な情報を持っているクラスに割り当てるべきという原則。
  - 生成者の原則を適用することにより、クラス間の結合度が低くなり、理解のしやすさ、カプセル化が促進され、オブジェクトの再利用性を高くすることができる。
- 純粋人工物
  - 疎結合や高凝集、それらから得られる再利用性が、情報エキスパートで実現できない場合、それを実現するためのクラスを導入すべきだという原則。純粋人工物の原則を適用することにより、情報エキスパートの高凝集を確保するとともに、情報エキスパートに対する疎結合が促進され、その再利用性が高くなる。
- コントローラ
  - システム全体を表すクラスや、ユースケースシナリオを表現する、ユーザーインタフェースでないクラスに、システムイベントをコントロールする責務を割り当てるという原則。コントローラの原則を適用することにより、ユーザーインタフェースや他システムに対する結合度が下がり、ソフトウェアの再利用性を高くすることができる。

次の例では、注文の合計を求める責務を、必要な情報を持つ `Order` (情報エキスパート) に割り当てている。また、`OrderItem` の生成は、それを集約する `Order` (生成者) が行う。

```python
class OrderItem:
    def __init__(self, price, quantity):
        self.price = price
        self.quantity = quantity

    def subtotal(self):
        return self.price * self.quantity


class Order:
    def __init__(self):
        self.items = []

    def add_item(self, price, quantity):  # 生成者: Order が OrderItem を作る
        self.items.append(OrderItem(price, quantity))

    def total(self):  # 情報エキスパート: 明細を持つ Order が合計を求める
        return sum(item.subtotal() for item in self.items)


order = Order()
order.add_item(100, 2)
order.add_item(250, 1)
print(order.total())  # 450
```

#### 変動をカプセル化するための原則

- 多態性
  - クラスの機能のうち、変動する部分の仕様を下位クラスに継承させ、下位クラスで具体的なふるまい (実装) を定義することで、再利用性や拡張性を上げるという原則。多態性の原則を適用することにより、そのクラスを利用する側に対する結合度を下げ、クラスの再利用性や拡張性を上げることができる。
- 変動からの保護
  - クラスの機能のうち、変動する不安定な部分を、別のクラスとして切り出して、それを合成することで、変動しない部分を保護するとともに、変動部分の拡張性を上げるという原則。変動からの保護の原則を適用して、変動部分を切り出すことで、それを高凝集にし、交換可能性を高くすることで、変動部分の拡張性を上げることになる。

---

### コマンド・クエリ分離の原則 (CQS) <a id="cqs" data-name="CQS"></a>

プログラミングにおける副作用を最小限に抑えることで、保守性と再利用性を確保するための設計原則。Bertrand Meyer が、Eiffel 言語の設計の中で、考案した。

#### 副作用

式の評価による作用には、主たる作用と、それ以外の副作用とがある。

- 式は、評価値を得ること (関数では「引数を受け取り値を返す」) が主たる作用とされる。
- それ以外の、コンピューターの論理状態 (ローカル環境以外の状態変数の値) を変化させる作用を、副作用という。

副作用は、予期せぬエラーを発生させるリスクとなる。リスクを下げるために、次のようなコストを発生させ、結果的に、ソフトウェアの保守性を下げることになる。

- 副作用によって、どこに影響があるか調査しなければならない。
- その影響によって、動作に支障が出ないようにしなければならない。

また、副作用が起こるクラスなどのソフトウェアの構成要素は、常に同じ結果を提供するわけではないので、ソフトウェアの再利用性を下げる。

#### 参照透過性

次の性質を持つメソッドや関数の性質を、**参照透過性**という。

- 同じ条件を与えれば、必ず同じ結果が得られる。
- 他のいかなる機能の結果にも影響を与えない。

参照透過性を持つ関数は、**純粋関数**とも呼ばれる。式を、その値に置き換えても、プログラムの動作が変わらない。

```python
def add(a, b):  # 純粋関数: 同じ引数なら、必ず同じ結果
    return a + b


total = 0


def add_to_total(x):  # 副作用がある: 呼ぶたびに、結果が変わる
    global total
    total += x
    return total


print(add(1, 2), add(1, 2))                # 3 3
print(add_to_total(1), add_to_total(1))    # 1 2
```

#### コマンドとクエリ

| 種類 | 条件 | 戻り値 |
| --- | --- | --- |
| コマンド | あるメソッドが、スコープ外のオブジェクトの状態を変更する | 値を戻してはならない |
| クエリ | あるメソッドが、何らかの値を戻す | オブジェクトの状態を変えてはならない |

クラスの属性を参照する (変更を行わない) 場合は、クエリとして成立する。

上記のように、コマンドとクエリを分離させることにより、保守性の高いコードとなる。

```python
class BadCounter:  # 悪い例: 値を返しつつ、状態も変える
    def __init__(self):
        self._value = 0

    def next(self):
        self._value += 1
        return self._value


class Counter:  # 良い例: コマンドとクエリを分ける
    def __init__(self):
        self._value = 0

    def increment(self) -> None:  # コマンド: 状態を変え、値は返さない
        self._value += 1

    @property
    def value(self) -> int:  # クエリ: 値を返し、状態は変えない
        return self._value


bad = BadCounter()
print(bad.next(), bad.next())  # 1 2 (呼ぶたびに、結果が変わる)

counter = Counter()
counter.increment()
print(counter.value, counter.value)  # 1 1 (何度読んでも、同じ結果)
```

#### 設計の指針

- 単に引数を加工して結果を返すだけのロジックは、できる限り副作用のないクエリとして実装し、実際に状態を変化させるコマンドを、最小限に留めるようにする。
- 状態を変更するメソッドとしないメソッドを明確に分けることで、様々な状況において、自信をもって問い合わせを行うことができる。
- オブジェクトを分析するときは、同一性を持ち、同一のものが状態を変えるオブジェクトなのか、同一性を持つ必要のないオブジェクトなのかを、よく検討する必要がある。
- 同一性を持つ必要がないのであれば、状態を更新するコマンドとして実装する必要がなく、副作用を減らすことができる。

<pre><code class="caution">CQS には、例外がある。スタックの pop は、要素を取り出して (クエリ)、スタックを変える (コマンド) 操作で、分離すると、かえって使いにくい。Martin Fowler は、できる限り従い、必要な場合は、破ってよい、という立場を取っている。</code></pre>

<pre><code class="tips">CQS を、システム全体の構成に広げた考え方を、CQRS (Command Query Responsibility Segregation) という。CQS はメソッドの設計の原則で、CQRS は、アーキテクチャの設計の考え方である。</code></pre>

---

### デザインパターン <a id="design-patterns" data-name="デザインパターン"></a>

デザインパターンは、設計でよく出てくる問題と、その解決の型に、名前を付けたもの。GoF の 23パターンが、広く知られている。

GoF は Gang of Four の略で、1994年の書籍 Design Patterns: Elements of Reusable Object-Oriented Software の著者 4人 (Erich Gamma、Richard Helm、Ralph Johnson、John Vlissides) を指す。この書籍が、23のパターンを、生成、構造、振る舞いの 3つに分けて紹介した。

| 分類 | 目的 | 主なパターン |
| --- | --- | --- |
| 生成 | オブジェクトの作り方を、切り離す | Singleton、Factory Method、Abstract Factory、Builder、Prototype |
| 構造 | クラスやオブジェクトを、組み合わせる | Adapter、Bridge、Composite、Decorator、Facade、Flyweight、Proxy |
| 振る舞い | 処理や責務を、分担する | Strategy、Observer、Command、Iterator、Template Method、State、Visitor、Mediator、Memento、Chain of Responsibility、Interpreter |

内訳は、生成が 5つ、構造が 7つ、振る舞いが 11 で、合計 23 になる。各分類の詳細は、<a href="#creational">生成パターン</a>、<a href="#structural">構造パターン</a>、<a href="#behavioral">振る舞いパターン</a>を参照。

#### パターンの構成要素

パターンは、名前だけではなく、次の 4つの要素で説明される。

| 要素 | 内容 |
| --- | --- |
| 名前 | 設計の話をするときの、共通の呼び名 |
| 問題 | どんな状況で、何に困っているか |
| 解決 | クラスやオブジェクトの、役割と関係の型 |
| 結果 | 使ったときの、利点と、引き換えになるもの |

#### パターンを使う利点

| 利点 | 内容 |
| --- | --- |
| 共通の語彙 | 「ここは Strategy にしよう」のように、短い言葉で、設計の意図を伝えられる |
| 設計の再利用 | 先人が、試行錯誤して見つけた解決の型を、そのまま使える |
| 読みやすさ | 名前を知っていれば、コードを読むときに、構造の見当がつく |
| 原則の実践 | SOLID や GRASP の原則を、具体的な形に落とせる |

#### 原則とパターンの関係

原則とパターンは、組み合わせて使う。

| 原則 | 関連するパターン |
| --- | --- |
| 間接化 | Adapter、Bridge、Mediator |
| 開放/閉鎖、依存性逆転 | Strategy、Factory Method |
| 単一責任 | Facade、Command |
| 変動からの保護 | Strategy、State、Decorator |

<pre><code class="tips">GRASP が、責任の割り当ての、一般的な指針を示すのに対して、GoF のパターンは、より具体的で、複雑な設計の型を示す。</code></pre>

#### 言語機能で簡単になるパターン

パターンは、言語の機能が足りない部分を、設計で補う側面がある。言語によっては、パターンを、特別に作らなくても、同じことが書ける。Peter Norvig は、23パターンのうち 16個が、Lisp や Dylan の言語機能で、簡単になるか、不要になることを示した。

Python では、次のようになる。

| パターン | Python での書き方 |
| --- | --- |
| Singleton | モジュールの変数。モジュールは、1度だけ読み込まれる |
| Iterator | `__iter__` とジェネレータ (`yield`) |
| Strategy | 関数を、そのまま渡す |
| Command | 呼び出せるオブジェクト (関数など) を、渡す |
| Observer | コールバック関数のリスト |
| Prototype | `copy.deepcopy()` |
| Decorator | 関数デコレータ (`@` の構文) は、近い発想の、言語の機能 |

<pre><code class="tips">言語の機能で足りるときは、パターンの形を、そのまま真似しない。パターンの意図 (何を解決するか) を理解して、言語に合った形で書く。</code></pre>

#### 問題から、パターンを探す

| やりたいこと | 候補のパターン |
| --- | --- |
| 生成するクラスを、実行時に切り替えたい | Factory Method、Abstract Factory |
| 引数が多く、手順のある、複雑なオブジェクトを組み立てたい | Builder |
| インスタンスを、1つに制限したい | Singleton (慎重に) |
| 既存のクラスを、別のインターフェースで使いたい | Adapter |
| 機能を、継承せずに、重ねて追加したい | Decorator |
| 複雑な内部を、簡単な入口で隠したい | Facade |
| 木構造の部分と全体を、同じ扱いで操作したい | Composite |
| アクセスの制御や、遅延が必要 | Proxy |
| アルゴリズムを、差し替えたい | Strategy |
| 変化を、複数の相手に通知したい | Observer |
| 操作を、オブジェクトにして、取り消したい | Command |
| 状態ごとに、振る舞いを変えたい | State |
| 処理の骨組みを固定して、一部だけ変えたい | Template Method |
| 集合の中身を、順に取り出したい | Iterator |
| 処理を、担当者に順に回したい | Chain of Responsibility |

#### 似ているパターンの違い

| 比較 | 違い |
| --- | --- |
| Strategy と State | Strategy は、利用者が、アルゴリズムを選んで渡す。State は、状態が、自分で次の状態へ移る |
| Adapter と Facade | Adapter は、1つのクラスの、インターフェースを合わせる。Facade は、複数のクラスを、1つの入口にまとめる |
| Decorator と Proxy | Decorator は、機能を追加する。Proxy は、アクセスを制御する。どちらも、同じインターフェースで、包む |
| Factory Method と Abstract Factory | Factory Method は、1つの製品の生成を、サブクラスに任せる。Abstract Factory は、関連する製品の組を、まとめて生成する |
| Template Method と Strategy | Template Method は、継承で、一部を差し替える。Strategy は、委譲で、全体を差し替える |

#### 使いすぎに注意

パターンは、目的ではなく、手段である。

| 落とし穴 | 内容 |
| --- | --- |
| パターンありきの設計 | 問題がないのに、パターンを当てはめて、クラスが増える |
| Singleton の乱用 | グローバルな状態になり、テストしにくく、依存が見えなくなる |
| 継承の多用 | 継承で組み合わせると、クラスの数が、爆発する。委譲を、先に考える |
| 先回りの抽象化 | 変更が起きる前に、柔軟にしすぎて、読みにくくなる |

---

### 生成パターン <a id="creational" data-name="生成パターン"></a>

オブジェクトの作り方を、利用する側から切り離す。作るクラスを、あとから変えやすくなる。

| パターン | 日本語名 | 目的 |
| --- | --- | --- |
| Singleton | シングルトン | インスタンスを、1つに制限する |
| Factory Method | ファクトリーメソッド | 生成を、サブクラスに任せる |
| Abstract Factory | 抽象ファクトリ | 関連するオブジェクトの組を、まとめて生成する |
| Builder | ビルダー | 複雑なオブジェクトを、段階的に組み立てる |
| Prototype | プロトタイプ | 既存のオブジェクトを、複製して作る |

#### Singleton

クラスのインスタンスを、1つだけに制限して、そこへのアクセス方法を、1か所に用意する。設定や、ログの管理など、全体で 1つだけ必要なものに使う。

```python
class Config:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.values = {}
        return cls._instance


a = Config()
b = Config()
a.values["debug"] = True
print(a is b, b.values)  # True {'debug': True}
```

<pre><code class="caution">Singleton は、グローバルな変数と、ほぼ同じ性質を持つ。どこからでも状態を変えられるため、テストしにくく、依存関係が見えなくなる。本当に 1つだけ必要かを、先に確認する。
Python では、モジュールの変数で、同じことができる。まず、そちらを検討する。</code></pre>

#### Factory Method

オブジェクトの生成を、サブクラスが決める形にする。親クラスは、生成した物の使い方だけを知っていて、具体的なクラス名を知らない。

```python
import json
from abc import ABC, abstractmethod


class Parser(ABC):
    @abstractmethod
    def parse(self, text): ...


class JsonParser(Parser):
    def parse(self, text):
        return json.loads(text)


class CsvParser(Parser):
    def parse(self, text):
        return [row.split(",") for row in text.splitlines()]


class Importer(ABC):
    def run(self, text):
        parser = self.create_parser()  # ファクトリーメソッド
        return parser.parse(text)

    @abstractmethod
    def create_parser(self) -> Parser: ...


class JsonImporter(Importer):
    def create_parser(self):
        return JsonParser()


class CsvImporter(Importer):
    def create_parser(self):
        return CsvParser()


print(JsonImporter().run('{"a": 1}'))   # {'a': 1}
print(CsvImporter().run("a,b\n1,2"))    # [['a', 'b'], ['1', '2']]
```

<pre><code class="tips">Importer は、Parser の具体的なクラスを知らない。新しい形式を足すときは、Parser と Importer のサブクラスを、追加するだけで済む (開放/閉鎖の原則)。</code></pre>

#### Abstract Factory

関連する複数のオブジェクトを、組にして、まとめて生成する。たとえば、画面の部品 (ボタン、入力欄) を、テーマごとに、一式で切り替えるときに使う。

| 役割 | 内容 |
| --- | --- |
| 抽象ファクトリ | 製品を作る、メソッドの一覧を持つ (例: ボタンを作る、入力欄を作る) |
| 具体ファクトリ | 組になる製品を、まとめて作る (例: ダークテーマの一式) |
| 製品 | 作られるオブジェクト |

#### Builder

複雑なオブジェクトを、段階的に組み立てる。引数が多いコンストラクタを、読みやすい手順に置き換える。

```python
class QueryBuilder:
    def __init__(self, table):
        self._table = table
        self._columns = ["*"]
        self._where = []
        self._limit = None

    def select(self, *columns):
        self._columns = list(columns)
        return self

    def where(self, condition):
        self._where.append(condition)
        return self

    def limit(self, n):
        self._limit = n
        return self

    def build(self) -> str:
        sql = f"SELECT {', '.join(self._columns)} FROM {self._table}"
        if self._where:
            sql += " WHERE " + " AND ".join(self._where)
        if self._limit is not None:
            sql += f" LIMIT {self._limit}"
        return sql


sql = QueryBuilder("users").select("id", "name").where("age >= 20").limit(10).build()
print(sql)  # SELECT id, name FROM users WHERE age >= 20 LIMIT 10
```

<pre><code class="caution">この例は、Builder の形を見せるためのもので、条件に、値を直接書いている。実際の SQL では、値を文字列で組み立てず、プレースホルダを使う (SQL のドキュメントを参照)。</code></pre>

#### Prototype

既存のオブジェクトを、見本として複製し、新しいオブジェクトを作る。生成のコストが高いときや、設定済みのオブジェクトを、少しだけ変えたいときに使う。

```python
import copy

base = {"name": "template", "tags": ["a", "b"]}
clone = copy.deepcopy(base)  # 入れ子の中身まで、複製する
clone["tags"].append("c")

print(base["tags"], clone["tags"])  # ['a', 'b'] ['a', 'b', 'c']
```

<pre><code class="tips">copy.copy() は、浅い複製で、入れ子の中身を共有する。元に影響させないときは、copy.deepcopy() を使う。</code></pre>

---

### 構造パターン <a id="structural" data-name="構造パターン"></a>

クラスやオブジェクトを、組み合わせて、大きな構造を作る。

| パターン | 日本語名 | 目的 |
| --- | --- | --- |
| Adapter | アダプター | インターフェースを、合わせる |
| Bridge | ブリッジ | 抽象と実装を、切り離して、別々に拡張する |
| Composite | コンポジット | 部分と全体を、同じ扱いにする |
| Decorator | デコレーター | 機能を、重ねて追加する |
| Facade | ファサード | 複雑な内部に、簡単な入口を作る |
| Flyweight | フライウェイト | 同じデータを共有して、メモリを節約する |
| Proxy | プロキシ | 代理のオブジェクトで、アクセスを制御する |

#### Adapter

互換性のないインターフェースの間に入って、変換する。既存のクラスを、書き換えずに、別のインターフェースで使えるようにする。

```python
class OldLogger:
    def write_log(self, text):
        print("old:", text)


class LoggerAdapter:  # 新しいインターフェース (log) に、合わせる
    def __init__(self, old):
        self._old = old

    def log(self, message):
        self._old.write_log(message)


def run(logger):  # log メソッドを持つものを、受け取る
    logger.log("start")


run(LoggerAdapter(OldLogger()))  # old: start
```

#### Bridge

抽象 (何をするか) と、実装 (どうやるか) を、別々のクラスの系統に分けて、組み合わせられるようにする。

| 役割 | 内容 | 例 |
| --- | --- | --- |
| 抽象 | 利用者が使う側の、クラスの系統 | 通知 (緊急、通常) |
| 実装 | 実際の処理を行う、クラスの系統 | 送信手段 (メール、SMS) |

#### Composite

部分と全体を、同じインターフェースで扱える、木構造を作る。ファイルとディレクトリのような構造に向く。

```python
class File:
    def __init__(self, name, size):
        self.name = name
        self._size = size

    def get_size(self):
        return self._size


class Directory:
    def __init__(self, name):
        self.name = name
        self.children = []

    def add(self, child):
        self.children.append(child)

    def get_size(self):
        return sum(c.get_size() for c in self.children)


root = Directory("root")
docs = Directory("docs")
docs.add(File("a.txt", 100))
docs.add(File("b.txt", 250))
root.add(docs)
root.add(File("c.txt", 50))
print(root.get_size())  # 400
```

#### Decorator

同じインターフェースを持つ別のオブジェクトで包んで、機能を重ねて追加する。継承を使わずに、組み合わせで、機能を増やせる。

```python
class Coffee:
    def cost(self):
        return 300


class Milk:
    def __init__(self, base):
        self._base = base

    def cost(self):
        return self._base.cost() + 50


class Syrup:
    def __init__(self, base):
        self._base = base

    def cost(self):
        return self._base.cost() + 30


print(Syrup(Milk(Coffee())).cost())  # 380
```

<pre><code class="tips">Python の @ で書く関数デコレータは、関数を包んで、機能を足す文法で、考え方が近い。ただし、GoF の Decorator パターンは、オブジェクトを包む設計の型で、別のものである。</code></pre>

#### Facade

複雑な、複数のクラスの操作を、1つの簡単な入口にまとめる。

```python
class Cpu:
    def start(self):
        print("cpu start")


class Memory:
    def load(self):
        print("memory load")


class Disk:
    def read(self):
        print("disk read")


class Computer:  # ファサード
    def __init__(self):
        self._cpu = Cpu()
        self._memory = Memory()
        self._disk = Disk()

    def boot(self):
        self._cpu.start()
        self._memory.load()
        self._disk.read()


Computer().boot()  # 利用者は、boot だけを呼べばよい
```

#### Flyweight

同じ内容のオブジェクトを、複数作らずに、共有して、メモリを節約する。大量の、似たオブジェクトを扱うときに使う (文字、地図の記号など)。

| 要素 | 内容 |
| --- | --- |
| 共有する部分 | 変わらない部分 (文字の形など)。1つだけ作る |
| 共有しない部分 | 場所ごとに違う部分 (文字の位置など)。利用側が持つ |

#### Proxy

本物の代わりに、代理のオブジェクトを置いて、アクセスを制御する。遅延読み込みや、アクセス権の確認、キャッシュなどに使う。

```python
class RealImage:
    def __init__(self, path):
        print("loading", path)  # 重い処理
        self.path = path

    def display(self):
        print("show", self.path)


class LazyImage:  # プロキシ
    def __init__(self, path):
        self._path = path
        self._real = None

    def display(self):
        if self._real is None:  # 初めて必要になったときに、読み込む
            self._real = RealImage(self._path)
        self._real.display()


img = LazyImage("a.png")  # この時点では、読み込まない
img.display()  # loading a.png / show a.png
img.display()  # show a.png (読み込みは 1回だけ)
```

---

### 振る舞いパターン <a id="behavioral" data-name="振る舞いパターン"></a>

オブジェクト同士の、やり取りと、責務の分担を決める。

| パターン | 日本語名 | 目的 |
| --- | --- | --- |
| Chain of Responsibility | 責任連鎖 | 処理を、担当者の鎖に、順に回す |
| Command | コマンド | 操作を、オブジェクトにする |
| Interpreter | インタープリター | 簡単な言語の文法を、クラスで表す |
| Iterator | イテレーター | 集合の中身を、順に取り出す |
| Mediator | メディエーター | オブジェクト同士のやり取りを、仲介役に集める |
| Memento | メメント | 状態を保存して、あとで元に戻せるようにする |
| Observer | オブザーバー | 変化を、複数の相手に通知する |
| State | ステート | 状態ごとの振る舞いを、クラスに分ける |
| Strategy | ストラテジー | アルゴリズムを、差し替えられるようにする |
| Template Method | テンプレートメソッド | 処理の骨組みを決め、一部をサブクラスに任せる |
| Visitor | ビジター | データ構造と、その上の処理を、切り離す |

#### Strategy

アルゴリズムを、部品として切り出して、差し替えられるようにする。条件分岐を、部品の差し替えに置き換える。

```python
def no_discount(price):
    return price


def student_discount(price):
    return int(price * 0.8)


class Cart:
    def __init__(self, strategy):
        self._strategy = strategy  # 割引の方法を、外から受け取る

    def total(self, price):
        return self._strategy(price)


print(Cart(no_discount).total(1000))       # 1000
print(Cart(student_discount).total(1000))  # 800
```

<pre><code class="tips">Python では、関数が、そのまま戦略になる。クラスを用意しなくても、Strategy の意図 (アルゴリズムの差し替え) を実現できる。</code></pre>

#### Observer

あるオブジェクトの変化を、登録した複数のオブジェクトに、自動で通知する。イベント処理や、画面の更新で使う。

```python
class Subject:
    def __init__(self):
        self._observers = []

    def subscribe(self, fn):
        self._observers.append(fn)

    def notify(self, value):
        for fn in self._observers:
            fn(value)


temperature = Subject()
temperature.subscribe(lambda v: print("display:", v))
temperature.subscribe(lambda v: print("log:", v))
temperature.notify(25)
# display: 25
# log: 25
```

#### Command

操作を、オブジェクトとして表す。操作の履歴や、取り消し (undo)、実行の予約ができる。

```python
class Editor:
    def __init__(self):
        self.text = ""


class AppendCommand:
    def __init__(self, editor, s):
        self._editor = editor
        self._s = s

    def execute(self):
        self._editor.text += self._s

    def undo(self):
        self._editor.text = self._editor.text[:-len(self._s)]


editor = Editor()
history = []
for s in ["Hello", ", ", "World"]:
    cmd = AppendCommand(editor, s)
    cmd.execute()
    history.append(cmd)
print(editor.text)  # Hello, World

history.pop().undo()
print(editor.text)  # Hello,
```

#### State

状態ごとの振る舞いを、状態のクラスに分けて、状態の切り替えで、振る舞いを変える。状態による条件分岐を減らせる。

```python
class Green:
    label = "green"

    def next(self):
        return Yellow()


class Yellow:
    label = "yellow"

    def next(self):
        return Red()


class Red:
    label = "red"

    def next(self):
        return Green()


class TrafficLight:
    def __init__(self):
        self._state = Green()

    def change(self):
        self._state = self._state.next()  # 状態が、次の状態を決める

    @property
    def label(self):
        return self._state.label


light = TrafficLight()
for _ in range(4):
    print(light.label, end=" ")  # green yellow red green
    light.change()
print()
```

#### Template Method

処理の骨組み (順序) を、親クラスで決めて、一部の手順を、サブクラスに任せる。

```python
from abc import ABC, abstractmethod


class Report(ABC):
    def render(self):  # テンプレート: 順序は、ここで固定する
        return "\n".join([self.header(), self.body(), self.footer()])

    def header(self):
        return "== report =="

    @abstractmethod
    def body(self): ...  # サブクラスで、実装する

    def footer(self):
        return "== end =="


class SalesReport(Report):
    def body(self):
        return "sales: 100"


print(SalesReport().render())
# == report ==
# sales: 100
# == end ==
```

#### Iterator

集合の内部の構造を見せずに、中身を、順に取り出す方法を提供する。

```python
class Countdown:
    def __init__(self, start):
        self._start = start

    def __iter__(self):
        n = self._start
        while n > 0:
            yield n  # ジェネレータが、イテレーターの役割を果たす
            n -= 1


print(list(Countdown(3)))  # [3, 2, 1]
```

<pre><code class="tips">Python の for 文は、Iterator パターンを、言語の機能として持っている。__iter__ を持つオブジェクトは、for 文で、順に取り出せる。</code></pre>

#### Chain of Responsibility

処理を、担当者のつながり (鎖) に、順に回す。担当できる人が処理して、できなければ、次の人に回す。

```python
class Handler:
    def __init__(self, limit, name, next_handler=None):
        self._limit = limit
        self._name = name
        self._next = next_handler

    def handle(self, amount):
        if amount <= self._limit:
            return f"{self._name} が承認 ({amount})"
        if self._next is not None:
            return self._next.handle(amount)  # 次の担当者へ回す
        return "承認者なし"


chain = Handler(100_000, "課長", Handler(1_000_000, "部長"))
print(chain.handle(50_000))      # 課長 が承認 (50000)
print(chain.handle(500_000))     # 部長 が承認 (500000)
print(chain.handle(5_000_000))   # 承認者なし
```

#### そのほかのパターン

| パターン | 内容 | 使う場面 |
| --- | --- | --- |
| Mediator | オブジェクト同士が、直接やり取りせず、仲介役を通す | 画面の部品同士の、連携。チャットルーム |
| Memento | オブジェクトの状態を、外に保存して、あとで戻す | 編集の取り消し、スナップショット |
| Visitor | データ構造を変えずに、新しい処理を、あとから追加する | 構文木の処理、ファイル構造の集計 |
| Interpreter | 簡単な言語の文法を、クラスで表して、解釈する | 検索条件の式、簡単な設定の言語 |

---

## 命名規則 <a id="nameing-convention" data-name="命名規則"></a>

複数の単語を、1つの名前にまとめる書き方には、いくつかの形式がある。

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

この章のコード例は、C で書いている。

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

式の評価によって、値を得ること以外に、状態を変化させる作用。変数への代入や、関数呼び出しによる入出力など。設計への影響は、<a href="#cqs">コマンド・クエリ分離の原則</a>を参照。

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
| クラスが増えすぎて、全体が追いにくい | 責務を、細かく分けすぎている | 「変更する理由」の単位で、分ける。理由が同じものは、まとめる |
| 使われない抽象が、増えた | 将来の拡張を、先回りして抽象化している | 変更が、実際に必要になってから、抽象化する (OCP) |
| 継承したクラスを、親の代わりに使うと、結果が変わる | 子が、親の約束を、破っている (LSP 違反) | 継承をやめて、委譲にする。または、親の約束を、見直す |
| 使わないメソッドを、実装させられる | 1つのインターフェースが、大きすぎる (ISP 違反) | 利用者ごとに、小さなインターフェースに分ける |
| DIP と DI を、混同する | 原則と、実現する手法を、同じものとして覚えている | DIP は設計の原則、DI は、依存を外から渡す手法と、区別する |
| 値を取得するメソッドが、状態を変える | クエリのつもりのメソッドが、副作用を持つ (CQS 違反) | 取得と更新を、別のメソッドに分ける。スタックの pop のような、慣習がある操作は例外 |
| CQS と CQRS を、混同する | 名前が似ている | CQS はメソッド単位の原則、CQRS は、システムの構成の考え方と、区別する |
| 同じ種類の名前に、複数の形式が混ざる | 規約を決めていない。または、言語の慣習に従っていない | 言語の慣習と、プロジェクトの規約に、そろえる |
| 変数名に、ハイフンを使ったら、エラーになった | ケバブケースは、引き算として解釈される | スネークケースか、キャメルケースにする。ケバブケースは、URL や CSS で使う |
| Perl で、数値を `eq` で比較したら、期待と違った | `eq` は、文字列の比較 | 数値は、`==` を使う |
| Bash で、文字列を `-eq` で比較したら、エラーになった | `-eq` は、整数の比較 | 文字列は、`=` を使う |
| Singleton を使ったら、テストが書きにくくなった | グローバルな状態になり、テストの間で、状態が残る | 本当に 1つだけ必要かを、確認する。インスタンスを、引数で渡す (DIP)。Python では、モジュールの変数を使う |
| パターンを使ったら、クラスが増えて、読みにくくなった | 問題がないのに、パターンを当てはめている | 問題が実際に起きてから、導入する。まず、単純な書き方を試す |
| Strategy と State を、取り違える | どちらも、振る舞いを、別のクラスに委譲する形で、似ている | 誰が切り替えるかで、区別する。利用者が選ぶなら Strategy、状態が自分で移るなら State |
| 継承で機能を足して、クラスの組み合わせが、爆発した | 機能の組み合わせごとに、サブクラスを作っている | Decorator や Strategy で、委譲を使って、組み合わせる |
| 同じ名前を、複数のファイルで定義して、リンクエラーになった | ヘッダに、定義を書いている | ヘッダは宣言だけにして、定義は、1つの .c ファイルに書く |
| `if (a = 3)` が、常に真になる | `=` (代入) と `==` (比較) を、書き間違えている | 比較は `==`。代入も式であり、値が 3 になるため、エラーにならない |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| Clean Architecture (Robert C. Martin) | SOLID と、依存関係の向き (DIP) の解説 |
| Applying UML and Patterns (Craig Larman) | GRASP の出典 |
| Object-Oriented Software Construction (Bertrand Meyer) | OCP と CQS の出典 |
| Design Patterns (GoF) | 23のデザインパターンの出典 |
| Head First Design Patterns (Eric Freeman、Elisabeth Robson) | デザインパターンの、入門書 |
| [Martin Fowler: CommandQuerySeparation](https://www.martinfowler.com/bliki/CommandQuerySeparation.html) | CQS の解説と、例外の考え方 |
| [PEP 8](https://peps.python.org/pep-0008/) | Python のスタイルガイド。命名規則を含む |
| Python のドキュメント | 演算子の章を参照 |
