---
title: デザインパターン
layout: default
---

# デザインパターン <a id="top" data-name="TOP"></a>

デザインパターンは、設計でよく出てくる問題と、その解決の型に、名前を付けたもの。「ここは Strategy にしよう」のように、短い言葉で、設計の意図を伝えられる。

GoF の 23 パターンが、広く知られている。オブジェクトの作り方 (生成)、組み合わせ方 (構造)、やり取りの決め方 (振る舞い) の 3 つに、分類される。

パターンは、目的ではなく、手段である。原則の実践として使い、問題が実際に起きてから、導入する。原則そのものは、「設計原則」のドキュメントを参照。

| 分類 | パターン |
| --- | --- |
| <a href="#creational">生成</a> | <a href="#singleton">Singleton</a>、<a href="#factory-method">Factory Method</a>、<a href="#abstract-factory">Abstract Factory</a>、<a href="#builder">Builder</a>、<a href="#prototype">Prototype</a> |
| <a href="#structural">構造</a> | <a href="#adapter">Adapter</a>、<a href="#bridge">Bridge</a>、<a href="#composite">Composite</a>、<a href="#decorator">Decorator</a>、<a href="#facade">Facade</a>、<a href="#flyweight">Flyweight</a>、<a href="#proxy">Proxy</a> |
| <a href="#behavioral">振る舞い</a> | <a href="#chain-of-responsibility">Chain of Responsibility</a>、<a href="#command">Command</a>、<a href="#interpreter">Interpreter</a>、<a href="#iterator">Iterator</a>、<a href="#mediator">Mediator</a>、<a href="#memento">Memento</a>、<a href="#observer">Observer</a>、<a href="#state">State</a>、<a href="#strategy">Strategy</a>、<a href="#template-method">Template Method</a>、<a href="#visitor">Visitor</a> |

---

## 概要 <a id="overview" data-name="概要"></a>

### デザインパターンとは

デザインパターンは、設計でよく出てくる問題と、その解決の型に、名前を付けたもの。GoF の 23パターンが、広く知られている。

GoF は Gang of Four の略で、1994年の書籍 Design Patterns: Elements of Reusable Object-Oriented Software の著者 4人 (Erich Gamma、Richard Helm、Ralph Johnson、John Vlissides) を指す。この書籍が、23のパターンを、生成、構造、振る舞いの 3つに分けて紹介した。

| 分類 | 目的 | 主なパターン |
| --- | --- | --- |
| 生成 | オブジェクトの作り方を、切り離す | Singleton、Factory Method、Abstract Factory、Builder、Prototype |
| 構造 | クラスやオブジェクトを、組み合わせる | Adapter、Bridge、Composite、Decorator、Facade、Flyweight、Proxy |
| 振る舞い | 処理や責務を、分担する | Strategy、Observer、Command、Iterator、Template Method、State、Visitor、Mediator、Memento、Chain of Responsibility、Interpreter |

内訳は、生成が 5つ、構造が 7つ、振る舞いが 11 で、合計 23 になる。各分類の詳細は、<a href="#creational">生成パターン</a>、<a href="#structural">構造パターン</a>、<a href="#behavioral">振る舞いパターン</a>を参照。

### パターンの構成要素

パターンは、名前だけではなく、次の 4つの要素で説明される。

| 要素 | 内容 |
| --- | --- |
| 名前 | 設計の話をするときの、共通の呼び名 |
| 問題 | どんな状況で、何に困っているか |
| 解決 | クラスやオブジェクトの、役割と関係の型 |
| 結果 | 使ったときの、利点と、引き換えになるもの |

### パターンを使う利点

| 利点 | 内容 |
| --- | --- |
| 共通の語彙 | 「ここは Strategy にしよう」のように、短い言葉で、設計の意図を伝えられる |
| 設計の再利用 | 先人が、試行錯誤して見つけた解決の型を、そのまま使える |
| 読みやすさ | 名前を知っていれば、コードを読むときに、構造の見当がつく |
| 原則の実践 | SOLID や GRASP の原則を、具体的な形に落とせる |

<pre><code class="tips">コード例は、すべて Python で書いている。パターンそのものは、言語に依存しない。言語によっては、パターンの形を作らなくても、同じ目的を達成できる (言語機能とパターンの章を参照)。</code></pre>

---

## 歴史と基本の考え方 <a id="history" data-name="歴史と基本の考え方"></a>

### パターンの歴史

| 年 | できごと |
| --- | --- |
| 1977年 | 建築家の Christopher Alexander が、『A Pattern Language』で、建築のパターンをまとめる |
| 1987年 | Kent Beck と Ward Cunningham が、パターンの考え方を、プログラミングに応用し、OOPSLA で発表する |
| 1994年 | Gamma、Helm、Johnson、Vlissides が、『Design Patterns』(GoF) を出版する。23 のパターンが、広く知られるようになる |
| 2005年 | ACM SIGPLAN が、GoF の著者に、Programming Languages Achievement Award を贈る |

<pre><code class="tips">GoF の本は、1994年の OOPSLA で公開され、書籍の奥付は、1995年になっている。文献では、1994年と 1995年の、両方が使われる。</code></pre>

### GoF が示した 2 つの方針

GoF の本は、パターンの土台になる、2 つの方針を示している。

| 方針 | 内容 |
| --- | --- |
| インターフェースに対してプログラムする | 実装に対してではなく、インターフェースに対して、プログラムを書く。実装を、あとから差し替えられる |
| 継承より、合成を優先する | 継承で機能を足すのではなく、オブジェクトの合成 (委譲) で、機能を組み合わせる |

<pre><code class="tips">GoF の本は、継承が、親クラスの実装の詳細を、サブクラスにさらすため、カプセル化を壊しやすいと指摘している。Decorator、Strategy、Bridge などは、継承ではなく、合成を使うパターンである。</code></pre>

---

## 原則とパターンの関係 <a id="principles" data-name="原則とパターンの関係"></a>

原則とパターンは、組み合わせて使う。各原則の詳細は、「設計原則」のドキュメントを参照。

| 原則 | 関連するパターン |
| --- | --- |
| 間接化 | Adapter、Bridge、Mediator |
| 開放/閉鎖、依存性逆転 | Strategy、Factory Method |
| 単一責任 | Facade、Command |
| 変動からの保護 | Strategy、State、Decorator |
| 低結合 | Observer、Mediator、Facade |
| 継承より委譲 (GoF の方針) | Decorator、Strategy、Bridge |

<pre><code class="tips">GRASP が、責任の割り当ての、一般的な指針を示すのに対して、GoF のパターンは、より具体的で、複雑な設計の型を示す。</code></pre>

---

## 生成パターン <a id="creational" data-name="生成パターン"></a>

オブジェクトの作り方を、利用する側から切り離す。作るクラスを、あとから変えやすくなる。

| パターン | 日本語名 | 目的 |
| --- | --- | --- |
| <a href="#singleton">Singleton</a> | シングルトン | インスタンスを、1つに制限する |
| <a href="#factory-method">Factory Method</a> | ファクトリーメソッド | 生成を、サブクラスに任せる |
| <a href="#abstract-factory">Abstract Factory</a> | 抽象ファクトリ | 関連するオブジェクトの組を、まとめて生成する |
| <a href="#builder">Builder</a> | ビルダー | 複雑なオブジェクトを、段階的に組み立てる |
| <a href="#prototype">Prototype</a> | プロトタイプ | 既存のオブジェクトを、複製して作る |

### Singleton <a id="singleton"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 設定の管理やログの出力のように、全体で 1つだけあればよいものが、あちこちで別々に作られると、設定が食い違ったり、資源が無駄になったりする。 |
| 仕組み | クラス自身が、自分のインスタンスを 1つだけ保持する。2回目以降の生成では、新しく作らずに、保持しているものを返す。 |
| 例のコード | `__new__` で、`_instance` が空のときだけ、インスタンスを作る。`a is b` が `True` になることで、2回の生成が、同じインスタンスを返していることを確かめている。 |
| 使いどころ | 設定の管理、ログの出力先、接続プールなど、全体で共有する窓口。 |
| 注意点 | グローバルな状態になるため、使う数は、最小限にする。マルチスレッドでは、作成の瞬間に競合して、2つ作られることがあるので、ロックなどで守る。 |

<pre><code class="caution">Singleton は、グローバルな変数と、ほぼ同じ性質を持つ。どこからでも状態を変えられるため、テストしにくく、依存関係が見えなくなる。本当に 1つだけ必要かを、先に確認する。
Python では、モジュールの変数で、同じことができる。まず、そちらを検討する。</code></pre>

### Factory Method <a id="factory-method"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 親クラスの処理の中で、具体的なクラスを直接生成すると、親クラスが、そのクラスに縛られる。形式が増えるたびに、親クラスを書き換えることになる。 |
| 仕組み | 生成する部分だけを、メソッド (ファクトリーメソッド) として切り出す。何を作るかは、サブクラスが決める。親クラスは、できあがった物を、共通のインターフェースで使う。 |
| 例のコード | Importer の `run` は、`create_parser` を呼んで、得られた Parser で解析する。JsonImporter は JsonParser を、CsvImporter は CsvParser を返す。`run` を書き換えずに、形式を増やせる。 |
| 使いどころ | 処理の流れは同じで、使う部品だけが、状況によって変わるとき。フレームワークが、利用者の部品を、生成する場面。 |
| 注意点 | 製品が 1種類で、増える見込みもないときは、導入しない。単純な関数で足りることが多い。 |

<pre><code class="tips">Importer は、Parser の具体的なクラスを知らない。新しい形式を足すときは、Parser と Importer のサブクラスを、追加するだけで済む (開放/閉鎖の原則)。</code></pre>

### Abstract Factory <a id="abstract-factory"></a>

関連する複数のオブジェクトを、組にして、まとめて生成する。たとえば、画面の部品 (ボタン、入力欄) を、テーマごとに、一式で切り替えるときに使う。

| 役割 | 内容 |
| --- | --- |
| 抽象ファクトリ | 製品を作る、メソッドの一覧を持つ (例: ボタンを作る、入力欄を作る) |
| 具体ファクトリ | 組になる製品を、まとめて作る (例: ダークテーマの一式) |
| 製品 | 作られるオブジェクト |

```python
from abc import ABC, abstractmethod


class Button(ABC):
    @abstractmethod
    def render(self) -> str: ...


class TextBox(ABC):
    @abstractmethod
    def render(self) -> str: ...


class LightButton(Button):
    def render(self):
        return "[light button]"


class LightTextBox(TextBox):
    def render(self):
        return "[light textbox]"


class DarkButton(Button):
    def render(self):
        return "[dark button]"


class DarkTextBox(TextBox):
    def render(self):
        return "[dark textbox]"


class ThemeFactory(ABC):  # 抽象ファクトリ: 組になる製品を作るメソッドを持つ
    @abstractmethod
    def create_button(self) -> Button: ...

    @abstractmethod
    def create_textbox(self) -> TextBox: ...


class LightFactory(ThemeFactory):
    def create_button(self):
        return LightButton()

    def create_textbox(self):
        return LightTextBox()


class DarkFactory(ThemeFactory):
    def create_button(self):
        return DarkButton()

    def create_textbox(self):
        return DarkTextBox()


def build_screen(factory: ThemeFactory):  # 具体的なテーマを知らない
    return [factory.create_button().render(), factory.create_textbox().render()]


print(build_screen(LightFactory()))  # ['[light button]', '[light textbox]']
print(build_screen(DarkFactory()))   # ['[dark button]', '[dark textbox]']
```

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 組み合わせが決まっている部品を、バラバラに作ると、ライト用のボタンに、ダーク用の入力欄が混ざるような、食い違いが起きる。 |
| 仕組み | 組になる製品を作るメソッドの一覧を、抽象ファクトリとして決める。組ごとに、具体ファクトリを用意する。利用側は、ファクトリを 1つ選んで渡すだけで、一式が揃う。 |
| 例のコード | `build_screen` は、ThemeFactory だけを知っている。LightFactory か DarkFactory を渡すと、同じ処理で、見た目の違う画面ができる。 |
| 使いどころ | 画面のテーマ、OS ごとの部品の一式、データベースの種類ごとの、接続やクエリの部品の一式。 |
| 注意点 | Factory Method は、1つの製品の生成を任せる。Abstract Factory は、製品の組を、まとめて作る。部品の種類を増やすときは、すべてのファクトリを直す。 |

<pre><code class="tips">新しいテーマを足すときは、ThemeFactory のサブクラスと、製品のクラスを足すだけで済む。build_screen は、具体的なテーマを知らない。
一方で、新しい種類の部品 (チェックボックスなど) を足すと、すべてのファクトリを修正する。</code></pre>

### Builder <a id="builder"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 引数が多いコンストラクタは、どの引数が何かが、読み取りにくい。省略できる項目の組み合わせごとに、コンストラクタが増える。 |
| 仕組み | 項目を 1つずつ設定するメソッドを用意して、最後に `build()` で、完成品を作る。各メソッドが `self` を返すので、メソッドを連ねて書ける (メソッドチェーン)。 |
| 例のコード | QueryBuilder が、列、条件、件数を、別々に受け取る。`build()` で、SQL の文字列にまとめる。`where` は、何回でも呼べて、条件が `AND` でつながる。 |
| 使いどころ | 設定の多いオブジェクトの生成。SQL、HTTP リクエスト、ドキュメントなど、手順のある組み立て。 |
| 注意点 | 必須の項目は、`build()` で検証する。Python では、キーワード引数や、dataclass で足りることも多い。 |

<pre><code class="caution">この例は、Builder の形を見せるためのもので、条件に、値を直接書いている。実際の SQL では、値を文字列で組み立てず、プレースホルダを使う (SQL のドキュメントを参照)。</code></pre>

### Prototype <a id="prototype"></a>

既存のオブジェクトを、見本として複製し、新しいオブジェクトを作る。生成のコストが高いときや、設定済みのオブジェクトを、少しだけ変えたいときに使う。

```python
import copy

base = {"name": "template", "tags": ["a", "b"]}
clone = copy.deepcopy(base)  # 入れ子の中身まで、複製する
clone["tags"].append("c")

print(base["tags"], clone["tags"])  # ['a', 'b'] ['a', 'b', 'c']
```

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 生成に手間や時間がかかるオブジェクトを、毎回 1から作ると、無駄が大きい。設定済みのものを、少しだけ変えて使いたい場面もある。 |
| 仕組み | 見本となるオブジェクトを、複製 (クローン) して、新しいオブジェクトを作る。複製したあとで、必要な部分だけを変える。 |
| 例のコード | `copy.deepcopy()` で、入れ子の中身まで複製する。clone の `tags` に追加しても、base の `tags` は変わらない。 |
| 使いどころ | 設定済みのひな型からの派生。ゲームの敵キャラクターの量産。 |
| 注意点 | 浅い複製は、入れ子の中身を共有する。ファイルや接続など、外部の資源を持つオブジェクトは、複製に向かない。 |

<pre><code class="tips">copy.copy() は、浅い複製で、入れ子の中身を共有する。元に影響させないときは、copy.deepcopy() を使う。</code></pre>

---

## 構造パターン <a id="structural" data-name="構造パターン"></a>

クラスやオブジェクトを、組み合わせて、大きな構造を作る。

| パターン | 日本語名 | 目的 |
| --- | --- | --- |
| <a href="#adapter">Adapter</a> | アダプター | インターフェースを、合わせる |
| <a href="#bridge">Bridge</a> | ブリッジ | 抽象と実装を、切り離して、別々に拡張する |
| <a href="#composite">Composite</a> | コンポジット | 部分と全体を、同じ扱いにする |
| <a href="#decorator">Decorator</a> | デコレーター | 機能を、重ねて追加する |
| <a href="#facade">Facade</a> | ファサード | 複雑な内部に、簡単な入口を作る |
| <a href="#flyweight">Flyweight</a> | フライウェイト | 同じデータを共有して、メモリを節約する |
| <a href="#proxy">Proxy</a> | プロキシ | 代理のオブジェクトで、アクセスを制御する |

### Adapter <a id="adapter"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 使いたいクラスが、利用側の期待するインターフェースと、メソッド名や引数が違い、そのままでは使えない。外部のライブラリなど、書き換えられないことが多い。 |
| 仕組み | 間に入る Adapter が、既存のクラスを内部に持つ。新しいインターフェースの呼び出しを、既存のクラスの呼び出しに、変換する。 |
| 例のコード | `run` は、`log` メソッドを持つものを期待する。LoggerAdapter が、`log` を、OldLogger の `write_log` につなぐ。OldLogger は、書き換えていない。 |
| 使いどころ | 外部ライブラリの利用 (差し替えに備えて、自分用のインターフェースで包む)。古いコードとの接続。 |
| 注意点 | 変換だけに徹して、ロジックは入れない。複数のクラスを、まとめて隠したいときは、Facade を使う。 |

### Bridge <a id="bridge"></a>

抽象 (何をするか) と、実装 (どうやるか) を、別々のクラスの系統に分けて、組み合わせられるようにする。

| 役割 | 内容 | 例 |
| --- | --- | --- |
| 抽象 | 利用者が使う側の、クラスの系統 | 通知 (緊急、通常) |
| 実装 | 実際の処理を行う、クラスの系統 | 送信手段 (メール、SMS) |

```python
from abc import ABC, abstractmethod


class Sender(ABC):  # 実装の系統: どうやって送るか
    @abstractmethod
    def send(self, message): ...


class EmailSender(Sender):
    def send(self, message):
        print("mail:", message)


class SmsSender(Sender):
    def send(self, message):
        print("sms:", message)


class Notification:  # 抽象の系統: 何を送るか
    def __init__(self, sender: Sender):
        self._sender = sender

    def notify(self, message):
        self._sender.send(message)


class UrgentNotification(Notification):
    def notify(self, message):
        super().notify(f"[緊急] {message}")


Notification(EmailSender()).notify("週次レポート")       # mail: 週次レポート
UrgentNotification(SmsSender()).notify("サーバー停止")   # sms: [緊急] サーバー停止
UrgentNotification(EmailSender()).notify("ディスク不足")  # mail: [緊急] ディスク不足
```

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 通知の種類と、送信手段のように、2つの軸が、それぞれ増えるとき、継承だけで組み合わせると、クラスの数が、掛け算で増える。 |
| 仕組み | 抽象 (Notification) が、実装 (Sender) への参照を持ち、実際の処理を、そちらに任せる。2つの系統は、別々に増やせる。 |
| 例のコード | Notification に、Sender を渡して組み合わせる。UrgentNotification は、`[緊急]` を付けるだけで、送り方は、渡された Sender に任せる。種類が 3、手段が 3 になっても、継承なら 3 × 3 で 9クラス、Bridge なら 3 + 3 で 6クラスで済む。 |
| 使いどころ | 図形と描画 API、通知の種類と送信手段、OS ごとの実装の切り替え。 |
| 注意点 | Adapter は、あとから、合わない物を合わせる。Bridge は、最初から、2つの軸を分けて設計する。軸が 1つしかないときは、不要。 |

<pre><code class="tips">継承だけで、通知の種類と、送信手段の組み合わせごとに、クラスを作ると、数が爆発する。Bridge なら、種類と手段を、別々に増やせる。</code></pre>

### Composite <a id="composite"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | ファイルとディレクトリのように、個々の物と、それをまとめた物があるとき、利用側が、両者を区別して扱うと、条件分岐だらけになる。 |
| 仕組み | 個々の物 (葉) と、まとめた物 (複合) に、同じインターフェースを持たせる。複合は、子を持ち、同じ操作を、子に順に呼んで、結果をまとめる (再帰)。 |
| 例のコード | File と Directory が、どちらも `get_size()` を持つ。Directory は、子の `get_size()` の合計を返す。入れ子が深くても、`root.get_size()` の 1回で、全体の 400 が得られる。 |
| 使いどころ | ファイルシステム、画面の部品の入れ子、組織図、メニュー。 |
| 注意点 | 葉と複合のインターフェースを、完全にそろえようとすると、葉に、意味のない操作 (子の追加など) が生える。この例では、`add` を、Directory だけに持たせている。 |

### Decorator <a id="decorator"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 機能の組み合わせごとに、サブクラスを作ると、クラスが爆発する (ミルク入り、シロップ入り、両方入り...)。 |
| 仕組み | 元のオブジェクトと同じインターフェースを持つ Decorator が、元のオブジェクトを内部に持つ。呼び出しを元に渡して、その前後に、処理を足す。何重にも包める。 |
| 例のコード | `Syrup(Milk(Coffee()))` は、内側から順に呼ばれて、300 + 50 + 30 で 380 になる。包む順序や組み合わせは、実行時に自由に決められる。 |
| 使いどころ | ストリームの加工 (圧縮、暗号化、バッファリング)、ログ出力や、認証の追加。 |
| 注意点 | 小さなオブジェクトが、たくさんできて、デバッグしにくくなる。順序で結果が変わることがあるため、組み立てを 1か所にまとめる。 |

<pre><code class="tips">Python の @ で書く関数デコレータは、関数を包んで、機能を足す文法で、考え方が近い。ただし、GoF の Decorator パターンは、オブジェクトを包む設計の型で、別のものである。</code></pre>

### Facade <a id="facade"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 複数のクラスを、決まった順序で呼ばないと使えないと、利用者が、内部の仕組みを知る必要がある。呼び出しの手順が、あちこちに重複する。 |
| 仕組み | 内部のクラスを、まとめて呼び出す、簡単な入口 (Facade) を用意する。内部のクラスは、そのまま残るので、必要なら、直接使うこともできる。 |
| 例のコード | Computer の `boot()` が、Cpu、Memory、Disk を、決まった順序で呼ぶ。利用者は、`boot()` だけを知っていればよい。 |
| 使いどころ | ライブラリの簡易な API、サブシステムの入口、層の境界。 |
| 注意点 | 入口が肥大化しないように、用途ごとに分ける。Adapter は、1つのクラスのインターフェースを合わせる。Facade は、複数のクラスを、1つの入口にまとめる。 |

### Flyweight <a id="flyweight"></a>

同じ内容のオブジェクトを、複数作らずに、共有して、メモリを節約する。大量の、似たオブジェクトを扱うときに使う (文字、地図の記号など)。

| 要素 | 内容 |
| --- | --- |
| 共有する部分 | 変わらない部分 (文字の形など)。1つだけ作る |
| 共有しない部分 | 場所ごとに違う部分 (文字の位置など)。利用側が持つ |

```python
class Glyph:
    def __init__(self, char):
        self.char = char  # 共有する部分: 文字の形

    def draw(self, x, y):  # 共有しない部分 (位置) は、外から受け取る
        return f"{self.char}@({x},{y})"


class GlyphFactory:
    _cache = {}

    @classmethod
    def get(cls, char):
        if char not in cls._cache:
            cls._cache[char] = Glyph(char)
        return cls._cache[char]


glyphs = [GlyphFactory.get(c) for c in "abab"]
print([g.draw(i * 10, 0) for i, g in enumerate(glyphs)])  # ['a@(0,0)', 'b@(10,0)', 'a@(20,0)', 'b@(30,0)']
print(len(GlyphFactory._cache), glyphs[0] is glyphs[2])    # 2 True
```

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 文字や、地図の記号のように、同じ内容のオブジェクトが、何万個も必要になると、毎回作るのでは、メモリを大量に使う。 |
| 仕組み | 状態を、共有する部分 (変わらない) と、共有しない部分 (場所ごとに違う) に分ける。共有する部分は、ファクトリが、キャッシュから、同じものを返す。共有しない部分は、利用側が持つ。 |
| 例のコード | GlyphFactory の `get` は、同じ文字に、同じ Glyph を返す。"abab" の 4文字を要求しても、作られる Glyph は 2つで、`glyphs[0] is glyphs[2]` が `True` になる。位置は、`draw` の引数で、外から渡す。 |
| 使いどころ | テキストエディタの文字、ゲームの木や弾、大量に並ぶ、同種の部品。 |
| 注意点 | メモリが問題になっていないなら、導入しない。Python の `sys.intern()` が、同じ文字列を共有する仕組みも、近い発想である。 |

<pre><code class="caution">共有するオブジェクトは、変更できないものにする。共有しているものを変更すると、すべての利用側に影響する。</code></pre>

### Proxy <a id="proxy"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 本物のオブジェクトの生成が重かったり、アクセス権の確認や、通信が必要だったりして、本物を、いつでも直接扱うのは、都合が悪い。 |
| 仕組み | 本物と同じインターフェースを持つ代理 (Proxy) が、利用者と本物の間に立つ。必要になったときだけ、本物に、処理を渡す。 |
| 例のコード | LazyImage は、`display()` が初めて呼ばれるまで、RealImage を作らない (遅延読み込み)。2回目以降は、作った物を使い回すので、読み込みは 1回だけになる。 |
| 使いどころ | 遅延読み込み (仮想プロキシ)、アクセス権の確認 (保護プロキシ)、結果のキャッシュ、遠隔のオブジェクトの代理 (リモートプロキシ)。 |
| 注意点 | 本物と同じ契約を守る。Decorator は、機能を足す。Proxy は、アクセスを制御する。 |

---

## 振る舞いパターン <a id="behavioral" data-name="振る舞いパターン"></a>

オブジェクト同士の、やり取りと、責務の分担を決める。

| パターン | 日本語名 | 目的 |
| --- | --- | --- |
| <a href="#chain-of-responsibility">Chain of Responsibility</a> | 責任連鎖 | 処理を、担当者の鎖に、順に回す |
| <a href="#command">Command</a> | コマンド | 操作を、オブジェクトにする |
| <a href="#interpreter">Interpreter</a> | インタープリター | 簡単な言語の文法を、クラスで表す |
| <a href="#iterator">Iterator</a> | イテレーター | 集合の中身を、順に取り出す |
| <a href="#mediator">Mediator</a> | メディエーター | オブジェクト同士のやり取りを、仲介役に集める |
| <a href="#memento">Memento</a> | メメント | 状態を保存して、あとで元に戻せるようにする |
| <a href="#observer">Observer</a> | オブザーバー | 変化を、複数の相手に通知する |
| <a href="#state">State</a> | ステート | 状態ごとの振る舞いを、クラスに分ける |
| <a href="#strategy">Strategy</a> | ストラテジー | アルゴリズムを、差し替えられるようにする |
| <a href="#template-method">Template Method</a> | テンプレートメソッド | 処理の骨組みを決め、一部をサブクラスに任せる |
| <a href="#visitor">Visitor</a> | ビジター | データ構造と、その上の処理を、切り離す |

### Strategy <a id="strategy"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 割引の種類ごとに、if 文で分岐すると、種類が増えるたびに、分岐のある関数を、書き換えることになる。 |
| 仕組み | アルゴリズムを、共通の呼び出し方を持つ部品 (戦略) として、切り出す。利用側は、部品を受け取って、呼び出すだけにする。 |
| 例のコード | `no_discount` と `student_discount` が、戦略にあたる。Cart は、どちらが渡されたかを知らず、`total` で、渡された戦略を呼ぶだけである。新しい割引は、関数を 1つ足すだけで済む。 |
| 使いどころ | 割引や料金の計算、並べ替えの基準、圧縮の方式、検証のルール。 |
| 注意点 | 戦略の選択は、利用者の責任になる。違いが小さいなら、if 文で十分なこともある。State は、状態が自分で、次の状態へ移る点が違う。 |

<pre><code class="tips">Python では、関数が、そのまま戦略になる。クラスを用意しなくても、Strategy の意図 (アルゴリズムの差し替え) を実現できる。</code></pre>

### Observer <a id="observer"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | ある値の変化を、画面表示や、ログなど、複数の場所に伝えたい。変化する側が、通知先を直接知っていると、通知先が増えるたびに、書き換えが必要になる。 |
| 仕組み | 通知する側 (Subject) が、登録された受け手 (Observer) の一覧を持つ。変化があったときに、全員に通知する。通知する側は、受け手の中身を知らない。 |
| 例のコード | `subscribe` で、表示用とログ用の関数を登録する。`notify(25)` を呼ぶと、登録した順に、両方の関数が呼ばれる。 |
| 使いどころ | 画面のイベント処理、状態の変化に応じた画面の更新、Pub/Sub のメッセージ配信。 |
| 注意点 | 不要になった受け手は、登録を解除する (この例には、解除のメソッドがないので、実際には `unsubscribe` を用意する)。通知が連鎖すると、流れが追えなくなる。 |

### Command <a id="command"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 操作を、関数の呼び出しとして実行するだけでは、あとから、取り消したり、履歴に残したり、実行を予約したりできない。 |
| 仕組み | 操作の内容 (対象と引数) を、1つのオブジェクトにまとめて、`execute` と `undo` を持たせる。命令を出す側と、実行する側が、切り離される。 |
| 例のコード | AppendCommand が、編集の対象と、追加する文字列を持つ。`execute` で追加して、`undo` で、追加した分を取り除く。実行したコマンドを `history` に積んでおくと、`pop()` して `undo()` することで、直前の操作から、順に取り消せる。 |
| 使いどころ | エディタの undo / redo、ジョブキュー、マクロ (操作の記録と再生)。 |
| 注意点 | 操作の種類ごとに、クラスが増える。Python では、関数やクロージャで足りることもある。この例の `undo` は、追加した文字列が空のとき、`[:-0]` が空文字列になり、全体が消えてしまう。実際には、実行前の状態を覚えておく方法もある。 |

### State <a id="state"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 状態によって振る舞いが変わるとき、メソッドごとに、状態の if 文が並ぶ。状態が増えるたびに、あちこちを書き換えることになる。 |
| 仕組み | 状態ごとにクラスを作り、振る舞いと、次の状態への移り方を、状態のクラスに持たせる。持ち主 (Context) は、今の状態を保持して、処理を渡すだけにする。 |
| 例のコード | Green、Yellow、Red が、それぞれ `next` で、次の状態を返す。TrafficLight は、`change` で、状態を差し替えるだけで、どの順序で変わるかを知らない。 |
| 使いどころ | 信号、注文の状態 (受付、発送、完了)、接続の状態、ゲームのキャラクターの状態。 |
| 注意点 | 状態が少なく、単純なら、列挙型と if 文、または辞書で十分である。状態の数だけ、クラスが増える。Strategy は、利用者が選ぶ。State は、状態が自分で移る。 |

### Template Method <a id="template-method"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 処理の流れは同じで、一部の手順だけが違う、複数の処理があると、同じ流れのコードを、コピーして書くことになる。 |
| 仕組み | 親クラスのメソッド (テンプレート) で、処理の順序を固定する。変わる手順を、抽象メソッドにして、サブクラスに実装させる。 |
| 例のコード | Report の `render` が、`header`、`body`、`footer` の順に呼ぶ。`body` は抽象メソッドで、サブクラスが実装する。`header` と `footer` は、既定の実装があり、必要なら、上書きできる。 |
| 使いどころ | フレームワークの処理の流れ、テストの準備と後片付け (`setUp` と `tearDown`)、レポートの生成。 |
| 注意点 | 継承に頼るため、親クラスの流れを、サブクラスが理解しておく必要がある。差し替えたい範囲が広いときは、Strategy を使う。親が、サブクラスの処理を呼ぶ形で、「ハリウッドの原則」(Don't call us, we'll call you) とも呼ばれる。 |

### Iterator <a id="iterator"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | リスト、木、データベースの結果など、集合の内部の構造が違うと、中身の取り出し方も違い、利用側が、構造に依存してしまう。 |
| 仕組み | 「次の要素を取り出す」ことだけを提供する、イテレーターを用意する。利用側は、内部の構造を知らずに、順に取り出せる。 |
| 例のコード | Countdown の `__iter__` が、`yield` を使うジェネレータで、3、2、1 を順に返す。`list()` や for 文に、そのまま渡せる。 |
| 使いどころ | 独自のコレクション、巨大なデータを、少しずつ処理する場面 (ジェネレータは、値を 1つずつ作るので、メモリを節約できる)。 |
| 注意点 | Python のイテレーターは、一度使い切ると、再利用できない。この例は、`__iter__` が呼ばれるたびに、新しいジェネレータを作るので、何度でも走査できる。 |

<pre><code class="tips">Python の for 文は、Iterator パターンを、言語の機能として持っている。__iter__ を持つオブジェクトは、for 文で、順に取り出せる。</code></pre>

### Chain of Responsibility <a id="chain-of-responsibility"></a>

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

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 処理できる人が、リクエストの内容によって決まるとき、送り手が、誰に頼むかを、すべて知っていると、結合が強くなる。 |
| 仕組み | 担当者 (ハンドラー) が、次の担当者への参照を持つ。処理できれば処理し、できなければ、次に回す。送り手は、鎖の先頭に、渡すだけでよい。 |
| 例のコード | 課長 (10万円まで)、部長 (100万円まで) の順につなぐ。50,000 は課長、500,000 は部長が承認する。5,000,000 は、鎖の最後まで回っても、担当者がいないので、「承認者なし」になる。 |
| 使いどころ | 承認のフロー、Web フレームワークのミドルウェア、画面のイベントの伝播、ログのレベルごとの処理。 |
| 注意点 | 誰も処理しないまま、終わる可能性がある。鎖の最後に、既定の処理を置く。鎖の順序が、結果に影響し、処理の流れが追いにくくなる。 |

### Mediator <a id="mediator"></a>

オブジェクトどうしが、直接やり取りせず、仲介役を通す。やり取りのルールを、仲介役に集めると、参加者どうしの結合が、減る。画面の部品どうしの連携や、チャットルームに向く。

```python
class ChatRoom:  # 仲介役: 参加者どうしは、互いを知らない
    def __init__(self):
        self._users = []

    def join(self, user):
        self._users.append(user)
        user.room = self

    def send(self, sender, message):
        for user in self._users:
            if user is not sender:
                user.receive(sender.name, message)


class User:
    def __init__(self, name):
        self.name = name
        self.room = None

    def say(self, message):
        self.room.send(self, message)

    def receive(self, from_name, message):
        print(f"{self.name} <- {from_name}: {message}")


room = ChatRoom()
alice, bob, carol = User("alice"), User("bob"), User("carol")
for u in (alice, bob, carol):
    room.join(u)

alice.say("hello")
# bob <- alice: hello
# carol <- alice: hello
```

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 多数のオブジェクトが、互いに直接やり取りすると、つながりが網の目のようになり、1つの変更が、あちこちに影響する。 |
| 仕組み | やり取りのルールを、仲介役 (Mediator) に集める。参加者は、仲介役とだけやり取りして、互いを知らなくてよい。 |
| 例のコード | ChatRoom が、`send` で受け取ったメッセージを、送信者以外の参加者に、届ける。User は、他の User を知らず、`room` を通して話すだけである。 |
| 使いどころ | チャットルーム、フォームの部品どうしの連携 (入力に応じて、ボタンを有効にするなど)、航空管制。 |
| 注意点 | 仲介役にロジックが集まりすぎると、仲介役が肥大化する。Observer は、1つの対象の変化を、一方向に通知する。Mediator は、参加者どうしのやり取りを、双方向に調整する。 |

<pre><code class="caution">仲介役に、ロジックが集まりすぎると、仲介役自体が、巨大になる。参加者どうしの、単純な通知だけなら、Observer で足りる。</code></pre>

### Memento <a id="memento"></a>

オブジェクトの状態を、外に保存して、あとで元に戻す。カプセル化を壊さずに、スナップショットを作る。編集の取り消しなどに使う。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Snapshot:  # メメント: 保存した状態。あとから変更できない
    text: str
    cursor: int


class Editor:
    def __init__(self):
        self.text = ""
        self.cursor = 0

    def type(self, s):
        self.text += s
        self.cursor = len(self.text)

    def save(self) -> Snapshot:
        return Snapshot(self.text, self.cursor)

    def restore(self, snap: Snapshot):
        self.text = snap.text
        self.cursor = snap.cursor


editor = Editor()
editor.type("Hello")
snap = editor.save()
editor.type(", Wrold")  # 打ち間違い
print(editor.text)       # Hello, Wrold
editor.restore(snap)
print(editor.text, editor.cursor)  # Hello 5
```

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 取り消しのために、状態を保存したい。しかし、内部の状態を、外から自由に読み書きできるようにすると、カプセル化が壊れる。 |
| 仕組み | 保存した状態を、メメント (Snapshot) というオブジェクトに入れる。作成と復元は、元のオブジェクト (Editor) が行い、履歴を持つ側は、メメントの中身を見ずに、保管するだけにする。 |
| 例のコード | `save` が、Snapshot を返して、`restore` で、その時点に戻す。Snapshot は `frozen=True` なので、あとから書き換えられない。打ち間違えたあとでも、保存した時点の、"Hello" とカーソルの位置 5 に戻る。 |
| 使いどころ | 編集の取り消し、ゲームのセーブ、操作に失敗したときの巻き戻し。 |
| 注意点 | Python には private がないので、「メメントの中身を見ない」は、慣習で守る。状態が大きいときは、履歴の数を制限するか、差分だけを保存する。 |

<pre><code class="tips">Command の undo は、操作を逆に実行する。Memento は、状態そのものを保存して、戻す。状態が大きいときは、履歴の数を制限するか、差分だけを保存する。</code></pre>

### Visitor <a id="visitor"></a>

データ構造を変えずに、新しい処理を、あとから追加する。要素のクラスに、accept メソッドを持たせ、処理は、別のクラス (ビジター) に、まとめる。構文木の処理や、ファイル構造の集計に向く。

```python
class Number:
    def __init__(self, value):
        self.value = value

    def accept(self, visitor):
        return visitor.visit_number(self)


class Add:
    def __init__(self, left, right):
        self.left, self.right = left, right

    def accept(self, visitor):
        return visitor.visit_add(self)


class Evaluator:  # 処理 1: 値を計算する
    def visit_number(self, node):
        return node.value

    def visit_add(self, node):
        return node.left.accept(self) + node.right.accept(self)


class Printer:  # 処理 2: 文字列にする (データ構造を変えずに、追加できる)
    def visit_number(self, node):
        return str(node.value)

    def visit_add(self, node):
        return f"({node.left.accept(self)} + {node.right.accept(self)})"


expr = Add(Number(1), Add(Number(2), Number(3)))
print(expr.accept(Printer()), "=", expr.accept(Evaluator()))  # (1 + (2 + 3)) = 6
```

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 構文木のように、種類の違う要素が並ぶ構造に、計算や表示などの処理を足すたび、要素のクラスを書き換えると、クラスが肥大化する。 |
| 仕組み | 要素のクラスは、`accept(visitor)` だけを持つ。`accept` は、ビジターの、自分の種類に対応するメソッド (`visit_number` など) を呼び返す。処理は、ビジターのクラスに、まとまる。要素の型と、ビジターの型の、両方で呼び出し先が決まるので、ダブルディスパッチとも呼ばれる。 |
| 例のコード | Number と Add は、Evaluator にも Printer にも対応する。同じ式 `expr` に、`accept(Printer())` で文字列が、`accept(Evaluator())` で計算結果が得られる。Add は、子の `accept` を呼ぶので、入れ子の式でも、再帰的に処理される。 |
| 使いどころ | コンパイラの構文木、ファイル構造の集計、ドキュメントの変換 (HTML や PDF など)。 |
| 注意点 | 要素の種類が増えると、すべてのビジターを直す。要素が頻繁に増えるなら、使わない。 |

| | 内容 |
| --- | --- |
| 処理の追加 | 新しいビジターを、1 つ書くだけで済む |
| 要素の追加 | すべてのビジターに、メソッドを足す必要がある |

<pre><code class="tips">Python では、functools.singledispatch や match 文で、型ごとの処理を書ける。Visitor の形を、そのまま真似しなくても、同じ目的を達成できる。</code></pre>

### Interpreter <a id="interpreter"></a>

簡単な言語の文法を、クラスで表して、解釈する。1 つの規則を、1 つのクラスにして、式を木構造で組み立てる (Composite と、近い構造)。検索条件の式や、簡単な設定の言語に使う。

```python
class Var:
    def __init__(self, name):
        self.name = name

    def interpret(self, ctx):
        return ctx[self.name]


class And:
    def __init__(self, left, right):
        self.left, self.right = left, right

    def interpret(self, ctx):
        return self.left.interpret(ctx) and self.right.interpret(ctx)


class Or:
    def __init__(self, left, right):
        self.left, self.right = left, right

    def interpret(self, ctx):
        return self.left.interpret(ctx) or self.right.interpret(ctx)


class Not:
    def __init__(self, expr):
        self.expr = expr

    def interpret(self, ctx):
        return not self.expr.interpret(ctx)


# 規則: adult かつ (member または、blocked でない)
rule = And(Var("adult"), Or(Var("member"), Not(Var("blocked"))))
print(rule.interpret({"adult": True, "member": False, "blocked": False}))  # True
print(rule.interpret({"adult": True, "member": False, "blocked": True}))   # False
```

#### 解説

| 項目 | 内容 |
| --- | --- |
| 困りごと | 「adult かつ (member または、blocked でない)」のような規則を、if 文で書くと、規則を変えるたびに、コードを書き換えることになる。規則を、データのように組み替えたい。 |
| 仕組み | 文法の規則 1つを、クラス 1つで表す。終端 (Var) と、他の式を組み合わせるもの (And、Or、Not) に、同じ `interpret` を持たせる。式を木構造に組み立てて、根の `interpret` を呼ぶと、再帰的に評価される。 |
| 例のコード | `rule` を組み立てて、`interpret` に、辞書 (文脈) を渡す。同じ `rule` でも、渡す辞書で結果が変わる (`blocked` が `True` だと、結果は `False` になる)。 |
| 使いどころ | 検索条件、権限の規則、簡単な計算式、設定用の小さな言語。 |
| 注意点 | 文法が大きくなると、クラスが増えて、管理が難しくなる。本格的な言語は、パーサーのライブラリを使う。木構造の作りは、Composite に近い。 |

<pre><code class="caution">文法が複雑になると、クラスの数が増えて、管理が難しくなる。本格的な言語は、専用のパーサーのライブラリを、検討する。</code></pre>


---

## パターンの選び方 <a id="selection" data-name="パターンの選び方"></a>

### 問題から、パターンを探す

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
| 抽象と実装を、別々に増やしたい | Bridge |
| 大量の似たオブジェクトで、メモリを節約したい | Flyweight |
| 複数の部品の連携を、1か所に集めたい | Mediator |
| 状態を保存して、元に戻したい | Memento (または、Command の undo) |
| データ構造を変えずに、新しい処理を足したい | Visitor |
| 簡単な規則の式を、評価したい | Interpreter |

### 似ているパターンの違い

| 比較 | 違い |
| --- | --- |
| Strategy と State | Strategy は、利用者が、アルゴリズムを選んで渡す。State は、状態が、自分で次の状態へ移る |
| Adapter と Facade | Adapter は、1つのクラスの、インターフェースを合わせる。Facade は、複数のクラスを、1つの入口にまとめる |
| Decorator と Proxy | Decorator は、機能を追加する。Proxy は、アクセスを制御する。どちらも、同じインターフェースで、包む |
| Factory Method と Abstract Factory | Factory Method は、1つの製品の生成を、サブクラスに任せる。Abstract Factory は、関連する製品の組を、まとめて生成する |
| Mediator と Observer | Mediator は、参加者どうしのやり取りを、双方向に調整する。Observer は、1 つの対象の変化を、一方向に通知する |
| Memento と Command | Memento は、状態を保存して、戻す。Command は、操作を逆に実行して、戻す |
| Template Method と Strategy | Template Method は、継承で、一部を差し替える。Strategy は、委譲で、全体を差し替える |

---

## 言語機能とパターン <a id="language-features" data-name="言語機能とパターン"></a>

パターンは、言語の機能が足りない部分を、設計で補う側面がある。言語によっては、パターンを、特別に作らなくても、同じことが書ける。Peter Norvig は、23パターンのうち 16個が、Lisp や Dylan の言語機能で、簡単になるか、不要になることを示した。

Python では、次のようになる。

| パターン | Python での書き方 |
| --- | --- |
| Singleton | モジュールの変数。モジュールは、1度だけ読み込まれる |
| Iterator | `__iter__` とジェネレータ (`yield`) |
| Strategy | 関数を、そのまま渡す |
| Command | 呼び出せるオブジェクト (関数など) を、渡す |
| Observer | コールバック関数のリスト |
| Visitor | `functools.singledispatch` や match 文で、型ごとの処理を書く |
| Prototype | `copy.deepcopy()` |
| Decorator | 関数デコレータ (`@` の構文) は、近い発想の、言語の機能 |

<pre><code class="tips">言語の機能で足りるときは、パターンの形を、そのまま真似しない。パターンの意図 (何を解決するか) を理解して、言語に合った形で書く。</code></pre>

---

## 使いすぎに注意 <a id="overuse" data-name="使いすぎに注意"></a>

パターンは、目的ではなく、手段である。

| 落とし穴 | 内容 |
| --- | --- |
| パターンありきの設計 | 問題がないのに、パターンを当てはめて、クラスが増える |
| Singleton の乱用 | グローバルな状態になり、テストしにくく、依存が見えなくなる |
| 継承の多用 | 継承で組み合わせると、クラスの数が、爆発する。委譲を、先に考える |
| 先回りの抽象化 | 変更が起きる前に、柔軟にしすぎて、読みにくくなる |

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| Singleton を使ったら、テストが書きにくくなった | グローバルな状態になり、テストの間で、状態が残る | 本当に 1つだけ必要かを、確認する。インスタンスを、引数で渡す (DIP)。Python では、モジュールの変数を使う |
| Strategy と State を、取り違える | どちらも、振る舞いを、別のクラスに委譲する形で、似ている | 誰が切り替えるかで、区別する。利用者が選ぶなら Strategy、状態が自分で移るなら State |
| 継承で機能を足して、クラスの組み合わせが、爆発した | 機能の組み合わせごとに、サブクラスを作っている | Decorator や Strategy で、委譲を使って、組み合わせる |
| 複製したオブジェクトを変更したら、元も変わった | 浅い複製で、入れ子の中身を共有している | `copy.deepcopy()` を使う |
| Factory Method の生成クラスが、増えすぎた | 製品が 1 種類しかないのに、導入している | 生成の切り替えが、実際に必要になってから、導入する。単純な関数で足りることが多い |
| Builder で、必須の項目を、設定し忘れた | 組み立ての途中で、検証していない | `build()` で、必須の項目を検証する |
| Decorator を重ねる順序で、結果が変わった | 処理が、順序に依存している | 順序の決まりを、ドキュメントに残す。組み立てを、1 か所にまとめる |
| Proxy が、本物と違う動きをする | 追加の処理が、元の契約を破っている | 本物と同じ契約を守る (LSP) |
| Facade が、肥大化した | あらゆる機能を、1 つの入口にまとめている | 入口を、用途ごとに分ける |
| Observer で、通知が連鎖して、追えなくなった | 通知を受けた側が、別の通知を出している | 通知の流れを、図にして、循環を避ける |
| Observer で、不要なオブジェクトが、解放されない | 登録した関数が、オブジェクトへの参照を保持している | 不要になったら、登録を解除する。弱い参照 (`weakref`) を使う方法もある |
| 責任連鎖で、誰も処理しないまま、終わった | 鎖の最後に、受け手がいない | 鎖の最後に、既定の処理を置く |
| Visitor で、要素を足すたびに、全ビジターの修正が必要になる | 要素の種類が、頻繁に増えている | 要素が頻繁に増えるなら、Visitor を使わない |
| Memento で、メモリの使用量が、増え続ける | 毎回、状態の全体を、保存している | 履歴の数を制限するか、差分だけを保存する |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| 『Design Patterns』 (GoF) | 23 のデザインパターンの出典 |
| 『Head First Design Patterns』 (Eric Freeman、Elisabeth Robson) | デザインパターンの、入門書 |
| 『Refactoring to Patterns』 (Joshua Kerievsky) | 既存のコードを、パターンに向けて改善する方法 |
| 『Patterns of Enterprise Application Architecture』 (Martin Fowler) | 業務アプリケーションの、アーキテクチャのパターン |
| 「設計原則」のドキュメント | SOLID、GRASP、コマンド・クエリ分離などの原則 |
| 「プログラミング全般」のノート | 命名規則、比較演算子、基本用語 |
