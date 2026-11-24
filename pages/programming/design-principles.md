---
title: 設計原則
layout: default
---

# 設計原則 <a id="top" data-name="TOP"></a>

設計原則は、ソフトウェアを読みやすく、変更しやすく、テストしやすく保つための、経験則の集まりである。命名やガード節のような、コードの書き方に近いものから、SOLID やデメテルの法則のような、クラスの関係を決めるもの、パッケージの依存の向きを決めるものまで、扱う範囲が広い。

多くの原則は、1970年代の構造化設計から、1990年代のオブジェクト指向設計、2000年代のアジャイル開発にかけて、少しずつ整理されてきた。原則どうしは、同じ方向を向くものも、ぶつかるものもある。**原則は、守ること自体が目的ではなく、変更のコストを下げるための手段**である。

このドキュメントでは、24 の原則を、目的ごとに 8 つの章にまとめる。各原則に、定義、歴史的な背景、悪い例と良い例、注意点を、書く。

| 章 | 原則 |
| --- | --- |
| <a href="#readability">読みやすさ</a> | <a href="#naming">命名</a>、<a href="#slap">単一抽象レベル</a>、<a href="#guard-clause">ガード節</a>、<a href="#kiss">KISS</a>、<a href="#yagni">YAGNI</a>、<a href="#dry">DRY</a> |
| <a href="#behavior">振る舞いの設計</a> | <a href="#cqs">コマンド・クエリ分離</a>、<a href="#pola">最小驚きの原則</a> |
| <a href="#modularity">モジュール設計</a> | <a href="#cohesion">高凝集</a>、<a href="#coupling">低結合</a>、<a href="#information-hiding">情報隠蔽</a>、<a href="#encapsulation">カプセル化</a>、<a href="#soc">関心の分離</a> |
| <a href="#collaboration">オブジェクトの協調</a> | <a href="#demeter">デメテルの法則</a>、<a href="#tell-dont-ask">Tell, Don't Ask</a> |
| <a href="#solid">SOLID</a> | <a href="#srp">SRP</a>、<a href="#ocp">OCP</a>、<a href="#lsp">LSP</a>、<a href="#isp">ISP</a>、<a href="#dip">DIP</a> |
| <a href="#package">パッケージ設計</a> | <a href="#sdp">安定依存の原則</a> |
| <a href="#quality">変更と品質</a> | <a href="#testability">テスト容易性</a>、<a href="#crap">CRAP</a>、<a href="#trade-off">トレードオフ</a> |

---

## 概要 <a id="overview" data-name="概要"></a>

### 原則の読み方

各原則は、次の観点で読むと、他の原則との関係をつかみやすい。

| 観点 | 内容 |
| --- | --- |
| 何を減らすか | 変更の波及、重複、理解のコスト、不意の動作など |
| どの単位に効くか | 変数・関数、クラス、モジュール、パッケージ |
| 何と引き換えか | コードの量、間接層の増加、設計の手間 |

<pre><code class="tips">原則の多くは、「変更しやすさ」という 1 つの目的に、つながっている。迷ったときは、「この変更が入ったとき、どこを直すことになるか」を、基準に考える。</code></pre>

### 単位ごとの分類

| 単位 | 主な原則 |
| --- | --- |
| 変数・関数 | 命名、単一抽象レベル、ガード節、コマンド・クエリ分離 |
| クラス・オブジェクト | SRP、OCP、LSP、ISP、カプセル化、デメテルの法則、Tell, Don't Ask |
| モジュール | 高凝集、低結合、情報隠蔽、関心の分離、DIP |
| パッケージ | 安定依存の原則 |
| 設計全体 | KISS、YAGNI、DRY、最小驚きの原則、テスト容易性、トレードオフ |

<pre><code class="caution">原則の出典や年代には、諸説あるものが多い。このドキュメントの年代は、一次資料で確認できたものと、記憶に基づくものが混在する。論文や書籍を引用するときは、原典で確認する。</code></pre>

---

## 読みやすさ <a id="readability" data-name="読みやすさ"></a>

コードは、書く時間よりも、読む時間の方が長い。この章の原則は、読み手が意図をすばやくつかめるようにするためのものである。

### 意図が伝わる命名 <a id="naming"></a>

変数、関数、クラスなどの名前によって、役割、意図、性質が、読み手に伝わるようにする。

| 項目 | 内容 |
| --- | --- |
| 背景 | 1960〜70年代の開発では、`x` や `temp` のような省略名が多かった。Fortran では、`i`、`j`、`k` が慣習になっていた |
| 転機 | ソフトウェアが大規模になり、チームでの長期保守が一般的になると、読む時間の方が長いという現実が、意識されるようになった |
| 効果 | 処理の意図が、名前から分かる。コメントが減り、修正のコストが下がる |

悪い例と、良い例を示す。

```javascript
// ❌ d が何の差か、7 が何の数か、分からない
const d = end - start;
if (d > 7) { /* ... */ }

// ✅ 単位と意図が、名前に出ている
const elapsedDays = dayjs(endDate).diff(startDate, 'day');
const MAX_RETENTION_DAYS = 7;
if (elapsedDays > MAX_RETENTION_DAYS) { /* ... */ }
```

<pre><code class="caution">JavaScript の Date どうしを引き算すると、結果はミリ秒になる。上の悪い例の d を 7 と比べると、日数のつもりでも、意味が変わってしまう。dayjs の diff は、単位を指定しないと、ミリ秒を返す。</code></pre>

命名の観点を、表にまとめる。

| 観点 | 例 | 補足 |
| --- | --- | --- |
| 単位を含める | `timeoutMs`、`elapsedDays` | 単位の取り違えを防ぐ |
| 真偽値は、述語の形 | `isValid`、`hasRole` | `flag` のような、中身が分からない名前を避ける |
| 関数は、動詞 | `calculateTotal`、`saveOrder` | 副作用のある関数は、動詞で明示する |
| 略語を避ける | `customer` (`cust` ではなく) | チームで共通の略語は、例外にしてよい |
| 名前の長さは、スコープに合わせる | 狭いループの `i`、広い範囲の `elapsedDays` | 短い名前が悪いわけではない |

### 単一抽象レベル (SLAP) <a id="slap"></a>

1 つの関数やメソッドの中では、同じ抽象度の処理だけを扱う。高レベルの手順と、低レベルの実装の詳細を、混在させない。SLAP は、Single Level of Abstraction Principle の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | 1960年代後半から、Dijkstra らが、構造化プログラミングと、層による設計を進めた。1968年の THE multiprogramming system は、システムを、抽象度の違う層に分ける設計だった |
| 関連する手法 | Kent Beck の Composed Method (1996年) は、メソッドを、同じ抽象度の呼び出しだけで構成する書き方である |
| 呼び名 | SLAP の名前で紹介されることが多い。名前の起源には諸説あるため、特定の人物には帰さない |

```java
class OrderService {
    // ❌ 業務の手順、集計の計算、SQL の実行が、1 つのメソッドに混ざっている
    void place(Order order) {
        var user = userRepository.find(order.userId());
        int total = order.items().stream()
            .mapToInt(i -> i.price() * i.qty())
            .sum();
        jdbc.update("INSERT INTO orders ...", total);
    }

    // ✅ 業務の操作という、同じ粒度で揃えている
    void placeOrder(Order order) {
        var user = findUser(order.userId());
        int total = calculateTotal(order);
        saveOrder(order, total);
    }
}
```

<pre><code class="caution">金額の合計は、Stream の map ではなく、mapToInt で int の Stream に変換してから、sum を呼ぶ。Stream&lt;Integer&gt; には、sum メソッドがない。</code></pre>

| 観点 | 内容 |
| --- | --- |
| 見分け方 | メソッドの中に、「業務の言葉」と「技術の言葉 (SQL、HTTP、ファイル)」が混ざっていたら、抽象レベルが混在している |
| 直し方 | 低レベルの処理を、名前のついたメソッドに切り出す |
| 効果 | メソッドの本体が、手順書のように読める。意図の把握が早い |

### ガード節 (早期リターン) <a id="guard-clause"></a>

関数の冒頭で、処理を継続できない条件や、特別な条件を判定し、早めに処理を終える。正常系の流れが、ネストの外に出て、明確になる。

| 項目 | 内容 |
| --- | --- |
| 背景 | 例外条件をすべて入れ子の `if` で処理すると、正常系のコードが、深くネストする問題が目立った |
| 文献 | Kent Beck の『Smalltalk Best Practice Patterns』(1996年) に、Guard Clause がある。Martin Fowler の『Refactoring』(1999年) で、「条件分岐のネストを、ガード節に置き換える」手法として、広く知られた |

```javascript
// ❌ 正常系が、ネストの奥にある
function order(user, stock) {
  if (user) {
    if (stock > 0) {
      placeOrder();
    }
  }
}

// ✅ 異常な条件を先に処理する
function order(user, stock) {
  if (!user) return;
  if (stock <= 0) return;

  placeOrder();
}
```

<pre><code class="caution">リソースの解放が必要な処理 (ファイル、ロック) では、早期リターンの前に、解放の漏れがないかを確認する。言語の機能 (try-with-resources、defer、RAII) で、解放を保証する。</code></pre>

### KISS (シンプルであること) <a id="kiss"></a>

システムは、できるだけシンプルに設計し、実装する。複雑さは、理解、運用、変更のコストを高める。KISS は、Keep It Simple, Stupid の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | 1960年ごろ、米海軍の設計原則として、Lockheed の Kelly Johnson の言葉が、紹介されたとされる |
| 趣旨 | 複雑な設計は、不具合を生みやすく、直しにくい。必要な処理に、集中する |
| 注意 | 「シンプル」と「簡単」は、同じではない。短く書けることよりも、構造が、少ない要素で説明できることが、重要である |

```java
// ❌ 今は 1 つしかない処理のために、インターフェースと依存を重ねている
interface OrderProcessor { void process(Order order); }

class DefaultOrderProcessor implements OrderProcessor {
    private final StockCheck stockCheck;
    private final CreditCheck creditCheck;

    public void process(Order order) {
        stockCheck.check(order);
        creditCheck.check(order);
        // ...複雑な共通処理
    }
}

// ✅ 必要な処理に集中する
class OrderService {
    public void place(Order order) {
        if (!isAvailable(order)) {
            throw new IllegalStateException("在庫なし");
        }
        confirm(order);
    }
}
```

| 複雑な設計 | シンプルな設計 |
| --- | --- |
| 分岐や処理が多く、理解しにくい | 処理の流れが、明確で分かりやすい |
| 変更の影響範囲が、広がる | 変更が、容易である |
| 不具合のリスクが、高い | 不具合が、入りにくい |

### YAGNI (今は必要ないものを作らない) <a id="yagni"></a>

「将来使うかもしれない」という理由で、今は不要な機能を実装しない。YAGNI は、You Aren't Gonna Need It の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | Kent Beck の『Extreme Programming Explained』(1999年) で、XP (エクストリーム・プログラミング) の考え方として、広まった。Ron Jeffries の言葉として、引用されることが多い |
| 趣旨 | 将来のための実装は、使われないまま残り、複雑さと保守の負担になる |

```java
// ❌ まだ要求のない形式 (Excel、PDF) まで、先に作り込んでいる
void export(Report report, Format format) {
    if (format == Format.CSV) {
        exportCsv(report);
    } else if (format == Format.EXCEL) {   // 将来用
        exportExcel(report);
    } else if (format == Format.PDF) {     // まだ不要
        exportPdf(report);
    }
}

// ✅ 現時点で必要な、CSV 出力だけを実装する
void exportCsv(Report report) {
    // 現時点で必要な CSV 出力のみ
}
```

「将来のための実装」が生む問題を、表にまとめる。

| 問題 | 内容 |
| --- | --- |
| 複雑性の増加 | 使われないコードのために、理解と変更のコストが上がる |
| 仕様の固定化 | 不要な設計が、後の変更を難しくする |
| 開発速度の低下 | 本当に必要な価値に、集中できなくなる |

<pre><code class="caution">YAGNI は、「設計をしない」という意味ではない。公開 API、データベースのスキーマ、データ形式のように、後から変えるコストが大きいものは、早めに慎重に決める。OCP の「過剰な拡張」とも、同じ問題を扱っている。</code></pre>

### DRY (重複を避ける) <a id="dry"></a>

同じ知識、意図、ルールを、システムの中で繰り返し記述しない。DRY は、Don't Repeat Yourself の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | Andy Hunt と Dave Thomas が、『The Pragmatic Programmer』(1999年) で提唱した |
| 趣旨 | 1 つの知識の表現を、システムの中の、1 か所にする。重複を減らし、変更のしやすさと、一貫性を高める |

```java
// ❌ 同じ価格の計算が、複数の場所にある
class OrderService {
    int total(int price, int qty) { return price * qty; }
}
class InvoiceService {
    int total(int price, int qty) { return price * qty; }   // 重複
}

// ✅ 共通の知識を、1 か所に集約する
class Pricing {
    static int total(int price, int qty) { return price * qty; }
}
class OrderService {
    int total(int price, int qty) { return Pricing.total(price, qty); }
}
class InvoiceService {
    int total(int price, int qty) { return Pricing.total(price, qty); }
}
```

DRY が対象とするのは、見た目が似たコードではなく、**知識の重複**である。

| | コード重複 (表面的な重複) | 知識重複 (本質的な重複) |
| --- | --- | --- |
| 内容 | 同じようなコードが、複数の場所にある | 同じルール、仕様、業務知識が、複数の場所にある |
| 解消 | メソッド化、クラス化で、共通化できる | 設計やモデルを見直して、1 か所に集約する |

```java
// 知識の重複の例: 消費税率が、複数のクラスに、別々に書かれている
class CartService   { int withTax(int price) { return price * 110 / 100; } }
class ReceiptService { int withTax(int price) { return price * 110 / 100; } }

// 消費税率の知識を、1 か所にまとめる
class TaxPolicy {
    private static final int RATE_PERCENT = 10;

    static int withTax(int price) {
        return price * (100 + RATE_PERCENT) / 100;
    }
}
```

重複のリスクを、表にまとめる。

| リスク | 内容 |
| --- | --- |
| 振る舞いの不一致 | 片方だけが修正されて、振る舞いが食い違う |
| 理解の分散 | 仕様の理解が分散し、変更が難しくなる |

<pre><code class="caution">見た目が同じでも、変更の理由が違うコードは、偶然の重複である。偶然の重複を共通化すると、片方の変更が、もう片方に影響してしまう。3 回目の重複が出てから共通化する、という目安もある。</code></pre>

---

## 振る舞いの設計 <a id="behavior" data-name="振る舞いの設計"></a>

呼び出す側が、結果を予想できるようにするための原則である。

### コマンド・クエリ分離 (CQS) <a id="cqs"></a>

オブジェクトの操作を、状態を変更する「コマンド」と、情報を返す「クエリ」に分ける。クエリは状態を変更せず、コマンドは結果の問い合わせを兼ねない。CQS は、Command-Query Separation の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | メソッドが値を返すと同時に内部状態を変更すると、呼び出し側が、副作用を予測しにくくなる |
| 文献 | Bertrand Meyer が、『Object-Oriented Software Construction』(1988年) で、体系的に説明した |
| 効果 | クエリを、何度呼んでも安全になる。テストや、デバッグが楽になる |

```javascript
// ❌ 取得のつもりの関数が、状態を変更している
function getBalance() {
  balance -= 100;   // 手数料を引く
  return balance;
}

// ✅ クエリとコマンドに、役割を分ける
function getBalance() {
  return balance;
}

function chargeFee() {
  balance -= 100;
}
```

<pre><code class="caution">スタックの pop や、アトミックな compareAndSet のように、取得と変更を、分けられない操作もある。CQS は、原則であり、例外を認めた上で使う。CQRS は、CQS の考え方を、アーキテクチャの単位に広げたものである。</code></pre>

### 最小驚きの原則 (PoLA) <a id="pola"></a>

ソフトウェアの振る舞いを、利用者や開発者が持つ、合理的な期待と、できるだけ一致させる。名前やインターフェースから、予測できない動作を避ける。PoLA は、Principle of Least Astonishment の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | 利用者が増え、システムの振る舞いを予測できることが、重要になった。1970〜80年代の UI やプログラミング言語の設計で、利用者の予想しない挙動が、操作ミスや、理解の負担を生むことが、問題になった |
| 広まり | 言語設計、UI 設計、ライブラリ設計の指針として、引用されるようになった。Perl の設計思想として、知られている |
| 出典 | 名前の起源は、はっきりしない。特定の年や書籍には、帰さない |

```java
class UserRepository {
    // ❌ delete という名前なのに、実際には削除せず、フラグを立てるだけである
    void delete(UserId id) {
        updateFlag(id, true);
    }
}

class UserRepository {
    // ✅ 名前と振る舞いが一致している
    void delete(UserId id) {
        database.delete(id);       // 本当に削除する
    }

    void softDelete(UserId id) {
        updateFlag(id, true);      // 論理削除は、別の名前で提供する
    }
}
```

驚きを避ける設計の観点を、表にまとめる。

| 観点 | 内容 |
| --- | --- |
| 直感的な名前 | 名前から、振る舞いが予測できる |
| 一貫した振る舞い | 似た操作は、似た動作をする |
| 一般的な期待に沿う | 標準ライブラリや、他の言語の慣習と、矛盾しない |

---

## モジュール設計 <a id="modularity" data-name="モジュール設計"></a>

システムを、どのような単位に分け、単位どうしを、どうつなぐかを決める原則である。構造化設計で整理され、オブジェクト指向設計にも引き継がれた。

### 高凝集 (High Cohesion) <a id="cohesion"></a>

モジュール内部のデータや処理が、共通する目的や責務に、強く関連している状態にする。互いに関係の深い振る舞いをまとめ、無関係な処理の混在を避ける。

| 項目 | 内容 |
| --- | --- |
| 背景 | 1970年代の構造化設計の研究で、モジュールをどのように分割するかが、重要な課題になった。モジュール内部の要素の関連の強さを表す「凝集度」が、品質を考える指標として、整理された |
| 文献 | Stevens、Myers、Constantine の論文「Structured Design」(1974年)。Yourdon と Constantine の『Structured Design』(1975年、1979年版) |

```java
// ❌ 無関係な処理が、1 つのクラスに混在している
class Utils {
    void calculateTax()  { /* ... */ }
    void sendEmail()     { /* ... */ }
    void resizeImage()   { /* ... */ }
}

// ✅ 目的ごとに、まとめる
class Pricing {
    int calculateTax()   { /* ... */ return 0; }
    int calculateTotal() { /* ... */ return 0; }
}
```

構造化設計では、凝集度を、段階に分けて考える。上ほど低く、下ほど高い。

| 段階 | 内容 |
| --- | --- |
| 偶発的 (coincidental) | たまたま同じ場所にある。`Utils` が、その典型である |
| 論理的 (logical) | 同じ種類の処理だが、目的が違う |
| 時間的 (temporal) | 同じ時期に実行される (初期化処理など) |
| 手続き的 (procedural) | 決まった順序で実行される |
| 通信的 (communicational) | 同じデータを扱う |
| 逐次的 (sequential) | 出力が、次の処理の入力になる |
| 機能的 (functional) | 1 つの機能のためだけに、まとまっている |

<pre><code class="tips">Utils や Helper という名前のクラスが肥大化していたら、凝集度が低いサインである。名前から、責務が説明できるかを確認する。</code></pre>

### 低結合 (Low Coupling) <a id="coupling"></a>

モジュール間の依存関係を、必要最小限に抑え、相手の内部構造や実装の詳細を知らなくても、協調できるようにする。

| 項目 | 内容 |
| --- | --- |
| 背景 | 1960〜70年代の大規模ソフトウェア開発で、1 つのモジュールの変更が、他のモジュールにも広く影響する問題が、顕在化した |
| 趣旨 | 構造化設計では、モジュール同士の依存の強さを表す「結合度」が重視され、変更の影響を抑えるために、低結合が推奨された |

変更の波及を、図で示す。

```text
        A (データ構造を定義)
       ↙         ↘
 B (A を直接参照)  C (A を直接参照)
```

A のデータ構造を変更すると、A に依存する B と C も、修正が必要になる。

```typescript
// ❌ 実装 (mysql) に、直接依存している
class OrderService {
  async find() {
    return mysql.query("SELECT * FROM orders");
  }
}

// ✅ 抽象 (インターフェース) を介して、依存を減らす
interface OrderRepository {
  find(): Promise<Order[]>;
}

class OrderService {
  constructor(private repo: OrderRepository) {}

  find() {
    return this.repo.find();
  }
}
```

結合度も、段階に分けて考えられる。上ほど高く (悪く)、下ほど低い。

| 段階 | 内容 |
| --- | --- |
| 内容結合 | 他のモジュールの内部を、直接書き換える |
| 共通結合 | グローバルなデータを、共有する |
| 外部結合 | 外部の形式やデバイスに依存する |
| 制御結合 | 引数のフラグで、相手の動作を切り替える |
| スタンプ結合 | 必要以上に大きなデータ構造を、渡す |
| データ結合 | 必要なデータだけを、引数で渡す |

<pre><code class="tips">高凝集と低結合は、セットで考える。凝集度の高いモジュールに分ければ、モジュール間でやり取りするものが、減りやすい。</code></pre>

### 情報隠蔽 (Information Hiding) <a id="information-hiding"></a>

モジュールの内部の詳細を、外部に見せず、必要なインターフェースだけを公開する。変更されやすい設計判断を、モジュールの内側に隠す。

| 項目 | 内容 |
| --- | --- |
| 背景 | David Parnas が、論文「On the Criteria to Be Used in Decomposing Systems into Modules」(1972年) で提唱した |
| 趣旨 | 変更の影響を局所化し、保守性と再利用性を高める手段として、示した |

Parnas は、KWIC (Key Word In Context) という、小さなシステムを、2 通りに分割して比較した。

| 分割 | 内容 |
| --- | --- |
| 処理の手順で分ける | 入力、循環シフト、整列、出力のように、処理の順に、モジュールを分ける。データ構造の変更が、全モジュールに波及する |
| 設計判断を隠すように分ける | 行の記憶、入力、循環シフト、整列、出力などに分け、各モジュールが、自分の内部の判断 (データの持ち方など) を隠す。変更の影響が、局所化される |

```java
// ❌ 内部の構造が、公開されている
class User {
    public String name;
    public List<String> roles;   // 内部の構造が、公開されている
}
user.roles.add("admin");         // 外部から、自由に変更できてしまう

// ✅ 必要な操作だけを、公開する
class User {
    private final List<String> roles = new ArrayList<>();

    public boolean hasRole(String role) {
        return roles.contains(role);
    }

    public void addRole(String role) {
        // ルールを検証してから、変更する
        if (isValid(role)) {
            roles.add(role);
        }
    }

    private boolean isValid(String role) {
        return role != null && !role.isBlank();
    }
}
```

<pre><code class="caution">内部のリストを、getter でそのまま返すと、外部から自由に変更できてしまい、隠したことにならない。変更不可のコピー (List.copyOf など) を返すか、必要な操作だけを、メソッドとして公開する。</code></pre>

### カプセル化の原則 (Encapsulation) <a id="encapsulation"></a>

データと、それを操作する振る舞いを、ひとつの単位にまとめ、外部から直接アクセスできないようにする。

| 項目 | 内容 |
| --- | --- |
| 背景 | 1980年代に、情報隠蔽の考え方とともに、ソフトウェアの保守性と安全性を高めるために、重視されるようになった |
| 位置づけ | オブジェクト指向の、中心的な概念として、広く普及した |

```java
// ❌ データと操作が、分離している
class Account {
    public int balance;               // データが、公開されている
}

class AccountService {
    void deposit(Account acc, int amount) {
        acc.balance += amount;        // 外部から、直接変更する
    }
}

// ✅ データと操作を、まとめる
class Account {
    private int balance;

    public void deposit(int amount) {
        if (amount <= 0) throw new IllegalArgumentException();
        balance += amount;
    }

    public int getBalance() {
        return balance;
    }
}
```

情報隠蔽との違いを、表にまとめる。

| | 情報隠蔽 | カプセル化 |
| --- | --- | --- |
| 内容 | 実装の詳細を、外から見せない | データと振る舞いを、ひとつにまとめる |
| 位置づけ | モジュール分割の考え方 | クラスやオブジェクトの設計手法 |
| 効果 | 変更の影響を、局所化する | 不正な状態を防ぎ、一貫性を保つ |

情報隠蔽は、「隠すこと」に焦点を当てた、広い概念である。カプセル化は、それを実現するための、具体的な手段のひとつである。

<pre><code class="caution">2 つの用語の使い分けは、文献によって異なる。上の表は、一般的な整理である。getter と setter を、すべてのフィールドに機械的に付けるだけでは、カプセル化にならない。不正な状態を防ぐ操作を、オブジェクトの側に持たせる。</code></pre>

### 関心の分離 (Separation of Concerns) <a id="soc"></a>

システムを、「関心 (やりたいこと)」ごとに分け、それぞれを独立して扱えるようにする。SoC は、Separation of Concerns の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | Edsger W. Dijkstra が、1974年の論文「On the role of scientific thought」(EWD447) で、「関心の分離」という言葉を使った。複雑なものを扱うために、ある側面だけを、他の側面から切り離して、考える方法である |
| 広まり | 複雑なシステムを扱うための、基本的な考え方として、広まった |

<pre><code class="caution">関心の分離の出典を、1968年の THE multiprogramming system の論文とする記述がある。しかし、この言葉を使った論文は、1974年の EWD447 である。THE の論文は、層による設計の例として、関連する。</code></pre>

Web アプリケーションでの、分け方の例を、表にまとめる。

| 層 | 関心 |
| --- | --- |
| Controller | リクエストの受付 |
| Service | ビジネスロジック |
| Repository | データの保存 |
| View | 画面の表示 |

```java
// ❌ 入力チェック、登録、画面のレスポンス生成が、1 つのクラスに混在している
class UserController {
    public void register(User user) {
        // 入力チェック
        if (user.getName().isEmpty()) { /* ... */ }
        // ユーザー登録 (ビジネスロジック)
        userRepository.save(user);
        // 画面へのレスポンス生成
        render("/users/success");
    }
}

// ✅ 関心ごとに分離する
class UserController {
    private final UserService userService;

    public void register(RegisterRequest req) {
        userService.register(req.toUser());
    }
}

class UserService {
    public void register(User user) { /* 業務処理 */ }
}

class UserRepository {
    public void save(User user) { /* データ保存 */ }
}
```

<pre><code class="tips">関心の分け方は、層 (Controller、Service、Repository) だけではない。機能 (注文、ユーザー) ごとに縦に分ける方法もある。分けすぎて、何も処理しない中継だけの層が増えると、読みにくくなる。</code></pre>

---

## オブジェクトの協調 <a id="collaboration" data-name="オブジェクトの協調"></a>

オブジェクトどうしが、どこまで相手を知り、どう頼み合うかを決める原則である。

### デメテルの法則 (Law of Demeter) <a id="demeter"></a>

オブジェクトは、直接の知り合いとだけ、やり取りする。「知らない人と話さない」、または、最小知識の原則 (Principle of Least Knowledge) とも呼ばれる。

| 項目 | 内容 |
| --- | --- |
| 背景 | 1987年の秋に、Northeastern University の Ian Holland が、Demeter Project の中で発見したスタイルのルールである |
| 文献 | Lieberherr、Holland、Riel の論文「Object-Oriented Programming: An Objective Sense of Style」(OOPSLA 1988年)。Lieberherr と Holland の「Assuring good style for object-oriented programs」(IEEE Software、1989年) |
| 名前の由来 | 研究プロジェクト Demeter の名前に、由来する。Demeter は、ギリシャ神話の農耕の女神である |

メソッドが、呼び出してよい相手を、表にまとめる。

| 相手 | 例 |
| --- | --- |
| 自分自身 | `this` のメソッド |
| 引数として渡されたオブジェクト | `order.getUserName()` の `order` |
| 自分のフィールド | `this.repository` |
| 自分が生成したオブジェクト | メソッド内で `new` したもの |

```java
class OrderService {
    // ❌ order → user → account と、知らない相手をたどって、アクセスしている
    void place(Order order) {
        String name = order.getUser().getAccount().getName();
    }
}

class OrderService {
    // ✅ 直接の相手から、必要な情報だけをもらう
    void place(Order order) {
        String name = order.getUserName();
    }
}
```

「詳しく知らない」ことで、次の効果が得られる。

| 効果 | 内容 |
| --- | --- |
| 結合の抑制 | 他のオブジェクトの内部構造の変化に、影響を受けにくくなる |
| 変更に強い | 連鎖的な変更 (変更の波及) を、防げる |
| 見通しのよさ | 依存関係がシンプルになり、理解と保守がしやすくなる |

<pre><code class="caution">委譲先を作っても、その中で同じ連鎖をしていれば、解決していない。たとえば、Order の getAccountName が、user.getAccount().getName() を呼んでいると、連鎖が、Order の中に移っただけである。user.getAccountName() のように、User の側にも、メソッドを用意する。</code></pre>

<pre><code class="tips">「ドットは 1 つまで」という数え方は、正確ではない。Stream やビルダーのように、同じ型を返しながら続けるメソッドチェーンは、別の相手と話しているわけではないため、違反にならない。委譲メソッドが増えすぎるときは、責務の分け方も、見直す。</code></pre>

### Tell, Don't Ask (振る舞いを依頼する) <a id="tell-dont-ask"></a>

オブジェクトの内部状態を、問い合わせる (Ask) のではなく、やりたいことを依頼 (Tell) する。

| 項目 | 内容 |
| --- | --- |
| 背景 | Alec Sharp の『Smalltalk by Example』(1997年) の、「手続き型のコードは、情報を取得して判断する。オブジェクト指向のコードは、オブジェクトに何かをさせる」という趣旨の指摘が、元になっている |
| 提唱 | Andy Hunt と Dave Thomas (The Pragmatic Programmers) が、IEEE Software のコラムなどで、取り上げた |
| 補足 | Martin Fowler は、2013年のブログで、この原則を解説している。ただし、自分では、常には使っていないとも述べている |
| 趣旨 | 密に結合しているデータと振る舞いを、同じ場所に置く |

```java
// ❌ 状態を取得して、外で判断し、外から状態を変更している
class OrderService {
    void confirm(Order order) {
        if (order.getTotal().isZero()) {
            throw new IllegalStateException("金額が 0");
        }
        order.setStatus(CONFIRMED);
    }
}

// ✅ やりたいことを、オブジェクトに依頼する
class Order {
    void confirm() {
        if (total.isZero()) {
            throw new IllegalStateException("金額が 0");
        }
        this.status = CONFIRMED;
    }
}

class OrderService {
    void confirm(Order order) {
        order.confirm();   // やりたいことを依頼する (Tell)
    }
}
```

貧血ドメインモデルとの関係を、表にまとめる。

| | 貧血ドメインモデル | リッチなドメインモデル |
| --- | --- | --- |
| 内容 | データだけを持つモデル | データと振る舞いを持つモデル |
| 特徴 | ロジックが、外部のサービスに散らばる | オブジェクトに、やりたいことを依頼できる |
| Tell, Don't Ask | 反する | 沿う |

<pre><code class="tips">状態を調べるだけの操作 (クエリ) は、問題ない。コマンド・クエリ分離の考え方と合わせて、「判断のために、状態を取り出して、外で処理していないか」を、確認する。デメテルの法則の違反は、Tell, Don't Ask の違反を、示すことが多い。</code></pre>

---

## SOLID <a id="solid" data-name="SOLID"></a>

SOLID は、オブジェクト指向設計の 5 つの原則の頭文字である。Robert C. Martin (Uncle Bob) がまとめた原則に、Michael Feathers が、この頭文字の名前を付けたとされる。Martin の『Agile Software Development, Principles, Patterns, and Practices』(2002年) で、広く知られた。

| 頭文字 | 原則 | 一言で |
| --- | --- | --- |
| S | <a href="#srp">単一責任原則 (SRP)</a> | 変更する理由を、1 つにする |
| O | <a href="#ocp">開放閉鎖の原則 (OCP)</a> | 拡張に開き、変更に閉じる |
| L | <a href="#lsp">リスコフの置換原則 (LSP)</a> | サブタイプで、置き換えても壊れない |
| I | <a href="#isp">インターフェース分離の原則 (ISP)</a> | 使わないメソッドに、依存させない |
| D | <a href="#dip">依存性逆転の原則 (DIP)</a> | 抽象に依存する |

### 単一責任原則 (SRP) <a id="srp"></a>

モジュールは、ただ一つのアクター (変更を要求する人や組織のまとまり) に対して、責任を持つ。異なる理由で変更される処理を、一つにまとめない。SRP は、Single Responsibility Principle の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | 1990年代にオブジェクト指向設計が普及する中で、さまざまな業務の責務を持つ巨大なクラスが、問題になった |
| 初期の定義 | Martin の『Agile Software Development』(2002年) では、「クラスを変更する理由は、1 つだけであるべき」という形で、説明された |
| 現在の定義 | 「1 つの仕事」ではなく、「変更を要求するアクターとの関係」として、説明が明確になった。『Clean Architecture』(2017年) で整理された |
| 源流 | Tom DeMarco や Meilir Page-Jones が論じた、凝集度の考え方に、つながる |

```java
// ❌ 給与計算、勤務報告、データ保存という、変更の理由が違う処理が、混在している
class Employee {
    int calcSalary()     { /* 給与計算 */ return 0; }
    String reportWorkTime() { /* 勤務報告 */ return ""; }
    void save()          { /* データ保存 */ }
}

// ✅ 責務ごとに分割する
class PayrollCalculator   { int calcSalary(Employee e) { return 0; } }
class TimeReporter        { String report(Employee e) { return ""; } }
class EmployeeRepository  { void save(Employee e) { } }
```

<pre><code class="tips">給与計算は経理部門、勤務報告は人事部門のように、変更を求める相手が違うかを考える。相手が違うなら、1 つのクラスに入れると、片方の変更が、もう片方を壊す。</code></pre>

<pre><code class="caution">SRP は、「メソッドを 1 つしか持たない」という意味ではない。細かく分けすぎると、関連する処理が散らばり、読みにくくなる。変更の理由が同じものは、同じ場所に置く。</code></pre>

### 開放閉鎖の原則 (OCP) <a id="ocp"></a>

既存のコードを変更せずに、新しい振る舞いを追加できるように設計する。ソフトウェアは、拡張に対して開き、変更に対して閉じているべきである。OCP は、Open/Closed Principle の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | 1988年に、Bertrand Meyer が、『Object-Oriented Software Construction』で提唱した。当初は、継承による拡張を、中心に考えていた |
| 再解釈 | 1990年代に、Martin が、抽象 (インターフェース) とポリモーフィズムによる形に、整理し直した |

```java
// ❌ 会員種別が増えるたびに、calculate を修正する必要がある
class DiscountCalculator {
    int calculate(Order order) {
        if (order.isRegular()) {
            return order.amount() * 10 / 100;    // 10%
        } else if (order.isPremium()) {
            return order.amount() * 20 / 100;    // 20%
        }
        return 0;
        // 新しい会員種別が増えるたびに、ここを修正する
    }
}

// ✅ 拡張で対応できる
interface DiscountPolicy {
    int apply(int amount);
}

class RegularDiscount implements DiscountPolicy {
    public int apply(int amount) { return amount * 10 / 100; }
}

class PremiumDiscount implements DiscountPolicy {
    public int apply(int amount) { return amount * 20 / 100; }
}

class DiscountCalculator {
    public int calculate(Order order, DiscountPolicy policy) {
        return policy.apply(order.amount());
    }
}
```

<pre><code class="caution">整数に 0.1 を掛けると、結果が double になり、int を返すメソッドではコンパイルエラーになる。上の例は、整数のまま割合を計算している。金額の計算では、誤差の出ない型 (BigDecimal など) を使うことも、検討する。</code></pre>

過剰な拡張設計は、OCP の落とし穴である。

| | 過剰な拡張 (やりすぎ) | 適切な OCP |
| --- | --- | --- |
| 方針 | 将来の可能性を、すべて抽象化する | 変更しやすいポイントだけを、抽象化する |
| 構造 | クラスや構造が、複雑になる | 必要になったときに、拡張する |
| 結果 | 実際には使われない拡張ポイントが、増える | シンプルな構造を、保つ |

OCP は、「なんでも拡張できるようにすること」ではない。変更の可能性が高い部分を見極めて、適切に拡張できるようにすることが、重要である。

### リスコフの置換原則 (LSP) <a id="lsp"></a>

ある型のオブジェクトを、そのサブタイプで置き換えても、プログラムの正しさが保たれることを保証する。LSP は、Liskov Substitution Principle の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | 1987年に、Barbara Liskov が、基調講演「Data Abstraction and Hierarchy」で提唱した |
| 形式化 | Liskov と Jeannette Wing が、論文「A Behavioral Notion of Subtyping」(1994年) で、振る舞いの観点から、形式的に定義した |
| 趣旨 | サブタイプが、基底型の振る舞いの契約を守ることが、拡張性と安全性につながる |

LSP を守るために、サブタイプが守る契約を、表にまとめる。

| 契約 | 内容 |
| --- | --- |
| 事前条件 | サブタイプで、強めてはいけない (基底型より、厳しい入力を要求しない) |
| 事後条件 | サブタイプで、弱めてはいけない (基底型より、少ない保証にしない) |
| 不変条件 | 基底型の不変条件を、維持する |
| 例外 | 基底型が投げない種類の例外を、投げない |

長方形と正方形は、LSP の典型的な例である。

```java
// ❌ サブタイプで、契約を破っている
class Rectangle {
    protected int width, height;

    void setWidth(int w)  { width = w; }
    void setHeight(int h) { height = h; }
    int area()            { return width * height; }
}

class Square extends Rectangle {
    @Override void setWidth(int w)  { super.setWidth(w); super.setHeight(w); }   // 高さも変わってしまう
    @Override void setHeight(int h) { super.setWidth(h); super.setHeight(h); }   // 幅も変わってしまう
}

// Rectangle として扱うコードが、Square で壊れる
static void resize(Rectangle r) {
    r.setWidth(5);
    r.setHeight(4);
    assert r.area() == 20;    // Square を渡すと、16 になり、失敗する
}
```

```java
// ✅ 共通の抽象で、契約を統一する
interface Shape {
    int area();
}

class Rectangle implements Shape {
    private final int width, height;

    Rectangle(int width, int height) { this.width = width; this.height = height; }
    public int area() { return width * height; }
}

class Square implements Shape {
    private final int size;

    Square(int size) { this.size = size; }
    public int area() { return size * size; }
}
```

| | 置き換えできない | 置き換えできる |
| --- | --- | --- |
| 構造 | Square が、Rectangle を継承する | Rectangle と Square が、Shape を実装する |
| 問題・利点 | 幅と高さを、独立して変更できない | 共通の契約 (振る舞い) に揃う |
| 結果 | Rectangle として扱うと、不正な状態になる | どちらも Shape として、安全に扱える |

<pre><code class="tips">継承は、「現実の世界での is-a」ではなく、「振る舞いの契約を満たすか」で判断する。サブクラスで、メソッドを例外にしたり、何もしない実装にしたくなったときは、LSP の違反を疑う。</code></pre>

### インターフェース分離の原則 (ISP) <a id="isp"></a>

クライアントにとって不要なメソッドを持たない、小さく特化したインターフェースに分離する。ISP は、Interface Segregation Principle の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | Martin が、1990年代に、Xerox のプリンタシステムの設計に関わった経験から、整理したとされる。SOLID の 1 つとして、『Agile Software Development』(2002年) でまとめられた |
| 趣旨 | 「使わないメソッドに、依存させない」ことの重要性を示した |

```java
// ❌ 不要なメソッドに依存している
interface Machine {
    void print();
    void scan();
    void fax();
    void copy();
}

class SimplePrinter implements Machine {
    public void print() { /* ... */ }
    public void scan()  { throw new UnsupportedOperationException(); }
    public void fax()   { throw new UnsupportedOperationException(); }
    public void copy()  { throw new UnsupportedOperationException(); }
}

// ✅ 役割ごとに、小さく分離する
interface Printer { void print(); }
interface Scanner { void scan(); }
interface Fax     { void fax(); }

class SimplePrinter implements Printer {
    public void print() { /* ... */ }
}
```

複合機のインターフェースで、比べる。

| | 1 つの大きなインターフェース | 機能ごとに分離 |
| --- | --- | --- |
| 構造 | `MultiFunctionPrinter` が、すべての機能を強制する | `Printer`、`Scanner`、`Fax` に分かれる |
| 実装側 | 使わない機能を、例外で埋める | 必要なインターフェースだけを実装する |

<pre><code class="caution">実装できないメソッドを、UnsupportedOperationException で埋めている場合は、ISP と LSP の、両方の違反である。一方で、インターフェースを 1 メソッドずつに分けすぎると、数が増えて、管理が大変になる。クライアントの視点で、まとまりを決める。</code></pre>

### 依存性逆転の原則 (DIP) <a id="dip"></a>

上位のモジュールが、下位のモジュールに、直接依存しない。どちらも抽象に依存することで、実装の変更の影響を小さくする。DIP は、Dependency Inversion Principle の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | Martin が、1990年代に、C++ Report の記事などで提唱し、SOLID の 1 つとして、『Agile Software Development』(2002年) で整理した |
| 趣旨 | 変化しやすい具体的な実装ではなく、安定した抽象に依存する |

```java
// ❌ 具体的な実装に、直接依存している
class UserService {
    private JdbcUserRepository repo = new JdbcUserRepository();
    // 具体実装に直接依存しており、変更時に影響が広がる
}

// ✅ 抽象に依存し、DI で注入する
interface UserRepository {
    User findById(int id);
}

class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;   // DI で注入する
    }
}
```

DIP と DI は、混同されやすい。

| | DIP (設計の原則) | DI (実現する手段) |
| --- | --- | --- |
| 内容 | 依存の向きを逆転する (上位は抽象に依存する) | 依存を、外部から注入する |
| レベル | 設計レベルの考え方 | コンストラクタや、フレームワークでの実装手法 |

DIP は「何を目指すか」の原則であり、DI は、そのための具体的な手段である。

<pre><code class="tips">抽象 (インターフェース) は、利用する側のモジュールに置く。そうすると、下位のモジュールが、上位の定義した抽象に合わせる形になり、依存の向きが、逆転する。</code></pre>

<pre><code class="caution">DI コンテナやフレームワークは、DIP に必須ではない。コンストラクタで渡すだけでも、DIP は実現できる。すべてのクラスに、インターフェースを作ると、KISS と YAGNI に反する。変更や差し替えが、現実に起こる境界だけに、抽象を置く。</code></pre>

---

## パッケージ設計 <a id="package" data-name="パッケージ設計"></a>

クラスより大きい単位 (パッケージ、モジュール、コンポーネント) の、依存の向きを決める原則である。

### 安定依存の原則 (SDP) <a id="sdp"></a>

依存するなら、より安定した (変更しにくい) モジュールに、依存する。SDP は、Stable Dependencies Principle の略である。

| 項目 | 内容 |
| --- | --- |
| 背景 | Martin が、1990年代なかばに、パッケージ (コンポーネント) の設計原則の 1 つとして、整理した。『Agile Software Development』(2002年) と、『Clean Architecture』(2017年) でも、扱われている |
| 趣旨 | 変更の波及を抑え、システムを安定させる |
| 対象 | クラスではなく、パッケージやコンポーネントの単位である |

ここでの「安定」は、変更が少ないことではなく、**変更しにくいこと**を指す。多くのモジュールから依存されているモジュールは、変更すると、依存元のすべてに影響するため、変更しにくい。

| | 安定したモジュール | 不安定なモジュール |
| --- | --- | --- |
| 変更のしやすさ | 変更しにくい | 変更しやすい |
| 例 | ドメイン、共通基盤 | UI、外部連携 |
| 依存の向き | 他に依存しない | 安定したモジュールに依存する |

依存の向きは、「不安定 → 安定」にする。

```text
❌ 安定 (core)  ──▶  不安定 (feature)    変更の波及が広がる
✅ 不安定 (feature)  ──▶  安定 (core)    変更の波及範囲が小さい
```

安定性は、数値でも測れる。

| 記号 | 内容 |
| --- | --- |
| Ca (afferent coupling) | このモジュールに、依存している外部のモジュールの数 |
| Ce (efferent coupling) | このモジュールが、依存している外部のモジュールの数 |
| I (instability) | Ce / (Ca + Ce)。0 に近いほど安定、1 に近いほど不安定 |

```java
// ❌ 不安定な UI の部品に、業務のクラスが依存している
class OrderService {
    private final WebController controller;

    public void placeOrder(Order order) {
        controller.showResult(order);   // UI に依存する
    }
}

// ✅ 安定した抽象 (業務側のインターフェース) に依存する
interface OrderNotifier {
    void notify(Order order);
}

class OrderService {
    private final OrderNotifier notifier;

    public void placeOrder(Order order) {
        notifier.notify(order);         // 抽象に依存する
    }
}
```

<pre><code class="tips">安定したモジュールを、変更しにくいまま保つには、抽象 (インターフェース) の割合を、増やす。安定したモジュールが具象クラスばかりだと、変更したいときに、困る。この考え方は、安定抽象の原則 (SAP) と、呼ばれる。</code></pre>

<pre><code class="caution">クラスの図で、SDP を説明している資料がある。しかし、クラス単位の依存の向きの問題は、DIP の領域である。SDP は、パッケージやコンポーネントの単位で、考える。</code></pre>

---

## 変更と品質 <a id="quality" data-name="変更と品質"></a>

変更のしやすさと、テストのしやすさ、品質特性どうしの関係を扱う。

### テスト容易性 (Testability) <a id="testability"></a>

ソフトウェアを、テストしやすくする性質や、設計の考え方である。

| 項目 | 内容 |
| --- | --- |
| 背景 | 2000年代に、テスト駆動開発 (TDD) が普及するとともに、テスト容易性が、設計の重要な品質として認識されるようになった |
| 文献 | Kent Beck の『Test-Driven Development: By Example』(2000年代前半)。Michael Feathers の『Working Effectively with Legacy Code』(2004年) は、テストできない既存コードに、継ぎ目 (seam) を作る方法を、扱っている |

テスト容易性には、2 つの観点がある。

| 観点 | 内容 | 例 |
| --- | --- | --- |
| 制御可能性 (Controllability) | テストで、対象の振る舞いを制御できる | 外部の依存 (DB、API、時間) を、差し替える |
| 観測可能性 (Observability) | テストで、結果や内部の状態を観測できる | 戻り値、状態の変化、出力 (イベント、ログ) |

```java
// ❌ HTTP とファイルに、直接依存していて、テストしにくい
class ReportService {
    void generate() {
        var data = httpClient.get("/reports");     // HTTP に直接依存
        fileSystem.write("report.csv", data);      // ファイルに直接出力
    }
}

// ✅ 依存を分離して、テストしやすくする
interface ReportFetcher { String fetch(); }
interface ReportWriter  { void write(String data); }

class ReportService {
    private final ReportFetcher fetcher;
    private final ReportWriter writer;

    ReportService(ReportFetcher fetcher, ReportWriter writer) {
        this.fetcher = fetcher;
        this.writer = writer;
    }

    void generate() {
        var data = fetcher.fetch();   // 差し替え可能
        writer.write(data);           // 結果を検証可能
    }
}
```

差し替えた依存で、テストを書く例を示す。

```java
// 取得処理を、固定の値を返す関数に、書き込み処理を、リストへの追加に差し替える
List<String> written = new ArrayList<>();
var service = new ReportService(() -> "data", written::add);

service.generate();

assert written.equals(List.of("data"));
```

差し替えたい依存の、代表例を、表にまとめる。

| 依存 | 差し替えの方法 |
| --- | --- |
| 時刻 | Java の `Clock` のように、時刻を、引数やフィールドで渡す |
| 乱数 | 乱数生成器を、外から渡す |
| ファイル、HTTP | インターフェースを経由し、テストでは、メモリ上の実装を使う |
| データベース | リポジトリのインターフェースを、差し替える |

Rust でのテストの書き方は、「Rustのテスト」のドキュメントを参照。

<pre><code class="tips">テストのために、メソッドを public にしたくなったときは、設計を見直す合図である。振る舞いを、より小さな部品に切り出し、その部品を、直接テストする方法を、検討する。</code></pre>

### CRAP (変更に強い設計の指標) <a id="crap"></a>

クラスやメソッドが、どれだけ変更のリスクを抱えているかを、数値で評価する指標である。CRAP は、Change Risk Anti-Patterns の略である。複雑で、テストの少ないコードを、見つけるために使う。

| 項目 | 内容 |
| --- | --- |
| 背景 | 2007年に、Alberto Savoia と Bob Evans が、考案して公開した |
| 趣旨 | 保守性とテスト容易性の観点から、変更のリスクが高いコードを、検出する |
| 実装 | Java の Crap4j、.NET の NDepend などで、実装された。Rust には、`cargo-crap` がある |

計算式は、次の通りである。

```text
CRAP(m) = CC(m)^2 × (1 - cov(m))^3 + CC(m)
```

| 記号 | 内容 |
| --- | --- |
| CC (循環的複雑度) | コードの分岐の多さ (複雑さ) |
| cov (テスト網羅率) | テストで、どのくらいコードが実行されているか。0〜1 の値 |

計算の例を示す。

| メソッド | CC | カバレッジ | CRAP | 評価 |
| --- | --- | --- | --- | --- |
| `OrderService` の処理 | 10 | 20% | 61.2 | 高リスク |
| `UserService` の処理 | 4 | 80% | 4.1 | 低リスク |
| `Pricing` の処理 | 3 | 90% | 3.0 | 低リスク |
| 参考: 複雑で、テストなし | 6 | 0% | 42.0 | 高リスク |

CRAP が 30 を超えるメソッドは、リスクが高い (crappy) とみなされる。これは、Crap4j や NDepend などで使われる、既定のしきい値である。

CC ごとに、しきい値の 30 を下回るために必要な、カバレッジの目安を示す。

| CC | 必要なカバレッジの目安 |
| --- | --- |
| 5 | 0% でも下回る |
| 6 | 約 13% 以上 |
| 10 | 約 42% 以上 |
| 15 | 約 60% 以上 |
| 20 | 約 71% 以上 |
| 25 | 約 80% 以上 |
| 30 以上 | カバレッジが 100% でも、下回らない |

CRAP を使った改善の流れを、表にまとめる。

| 手順 | 内容 |
| --- | --- |
| 1. 測定 | 各メソッドの CC とカバレッジを計測し、CRAP の値を算出する |
| 2. 特定 | CRAP の値が高いメソッド (変更のリスクが高いもの) を見つける |
| 3. 改善 | 責務の分割、条件の整理、テストの追加などで、リスクを下げる |

<pre><code class="caution">CRAP は、メソッド (関数) 単位の指標である。クラス単位で示すツールは、メソッドの値を集計している。また、カバレッジは、コードが実行されたことを示すだけで、結果を検証していることは保証しない。assert のないテストで、数値だけを上げても、リスクは下がらない。</code></pre>

### トレードオフ (すべてを同時に満たすことはできない) <a id="trade-off"></a>

複数の品質特性の間には、相反する関係があり、一方を高めると、他方が下がることがある。

| 項目 | 内容 |
| --- | --- |
| 背景 | ソフトウェアの品質特性を整理する国際規格が、作られた。ISO/IEC 9126 (1991年) の後継として、ISO/IEC 25010 (2011年) が、策定された。設計では、バランスを取る判断が重要だと、認識されている |
| 規格 | ISO/IEC 25010 は、ソフトウェア製品の品質モデルである。2023年に、改訂版が出たとされる |

品質特性の、トレードオフの例を、表にまとめる。

| 品質特性 | トレードオフの関係 (例) |
| --- | --- |
| 信頼性 | ↔ 性能、開発速度 |
| 性能 | ↔ 変更容易性、シンプルさ |
| 変更容易性 | ↔ 性能、実装の簡潔さ |
| 機能性 | ↔ シンプルさ、開発速度 |

目的に応じて、優先する特性を決める。

| | すべてを満たそうとする | 目的に応じて、バランスを取る |
| --- | --- | --- |
| 方針 | 処理を高速にし、機能を豊富にし、実装をシンプルにし、変更に強くする。すべてを、同時に追求する | 今回の優先を、「変更容易性」と「信頼性」に決める |
| 性能 | 最高を目指す | 必要十分な水準にする |
| 機能 | 最初から、すべてを作る | 段階的に拡張する |
| 結果 | どれも、中途半端になる | 判断の根拠が、明確になる |

優先する特性の違いが、設計にどう表れるかを、比べる。

| | 性能を重視する設計 | 変更容易性を重視する設計 |
| --- | --- | --- |
| 抽象化 | 少なくして、呼び出しを減らす | 増やして、差し替えやすくする |
| 重複 | 許容する (高速化のため) | 避ける |
| 向く場面 | 処理の速さが、価値に直結する | 要求が、頻繁に変わる |

<pre><code class="tips">トレードオフの判断は、あとから理由が分からなくなる。何を優先し、何を諦めたかを、設計の記録 (ADR など) に残しておく。アーキテクチャの評価手法として、SEI の ATAM が知られている。</code></pre>

---

## 場面別の選び方 <a id="usage" data-name="場面別の選び方"></a>

困ったときに、どの原則から確認するかの目安である。

| 場面 | 確認する原則 |
| --- | --- |
| コードが読みにくい | <a href="#naming">命名</a>、<a href="#slap">単一抽象レベル</a>、<a href="#guard-clause">ガード節</a> |
| 1 つの変更で、多くの場所を直す | <a href="#dry">DRY</a>、<a href="#coupling">低結合</a>、<a href="#demeter">デメテルの法則</a> |
| クラスが、大きくなりすぎた | <a href="#srp">SRP</a>、<a href="#cohesion">高凝集</a>、<a href="#soc">関心の分離</a> |
| 条件分岐が、増え続ける | <a href="#ocp">OCP</a>、<a href="#lsp">LSP</a> |
| 呼び出した結果が、予想と違う | <a href="#cqs">コマンド・クエリ分離</a>、<a href="#pola">最小驚きの原則</a> |
| テストが書きにくい | <a href="#testability">テスト容易性</a>、<a href="#dip">DIP</a>、<a href="#isp">ISP</a> |
| 内部の状態が、外から壊される | <a href="#encapsulation">カプセル化</a>、<a href="#information-hiding">情報隠蔽</a>、<a href="#tell-dont-ask">Tell, Don't Ask</a> |
| 設計が、複雑になりすぎた | <a href="#kiss">KISS</a>、<a href="#yagni">YAGNI</a> |
| パッケージの依存が、絡み合っている | <a href="#sdp">安定依存の原則</a>、<a href="#dip">DIP</a> |
| どこから直すか、決められない | <a href="#crap">CRAP</a> |

---

## 原則どうしの関係 <a id="relations" data-name="原則どうしの関係"></a>

原則は、同じ方向を向くことも、ぶつかることもある。

### 同じ方向を向く原則

| 組み合わせ | 関係 |
| --- | --- |
| 高凝集 と 低結合 | 凝集度の高い単位に分ければ、単位どうしのやり取りが減る |
| SRP と 高凝集 | どちらも、変更の理由を、まとめる |
| 情報隠蔽 と カプセル化 | 隠す考え方と、まとめる手段である |
| デメテルの法則 と Tell, Don't Ask | 連鎖した取得は、判断が外に出ているサインである |
| DIP と テスト容易性 | 抽象に依存すると、テストで、差し替えられる |

### ぶつかりやすい原則

| 組み合わせ | 衝突の内容 | 判断の目安 |
| --- | --- | --- |
| DRY と 低結合 | 共通化すると、使う側すべてが、共通部分に依存する | 変更の理由が同じものだけ、共通化する |
| YAGNI と OCP | 拡張点を作ると、使われないコードが残る | 変更が実際に起きてから、拡張点を作る |
| KISS と DIP、ISP | 抽象を増やすと、構造が複雑になる | 差し替えが、現実に起こる境界だけに置く |
| デメテルの法則 と KISS | 委譲メソッドが増える | 責務の分け方を見直し、委譲を減らす |
| SRP と 凝集 | 分けすぎて、関連する処理が散らばる | 変更の理由で、分ける |
| 性能 と 変更容易性 | 抽象化は、呼び出しの手間を増やす | <a href="#trade-off">トレードオフ</a>として、優先を決める |

---

## 歴史の年表 <a id="history" data-name="歴史の年表"></a>

| 年 | できごと |
| --- | --- |
| 1960年ごろ | KISS が、米海軍の設計原則として紹介される |
| 1968年 | Dijkstra が、「Go To Statement Considered Harmful」を発表する。THE multiprogramming system の論文も、同年である |
| 1972年 | Parnas が、情報隠蔽を提唱する |
| 1974年 | Dijkstra が、「関心の分離」という言葉を使う。Stevens、Myers、Constantine が、「Structured Design」を発表する |
| 1975〜79年 | Yourdon と Constantine が、『Structured Design』で、凝集度と結合度を整理する |
| 1987年 | Liskov が、LSP につながる基調講演を行う。Holland が、デメテルの法則を発見する |
| 1988年 | Meyer が、『Object-Oriented Software Construction』で、CQS と OCP を示す |
| 1994年 | Liskov と Wing が、振る舞いの観点から、サブタイプを形式化する |
| 1996年ごろ | Martin が、DIP、ISP、パッケージの原則 (SDP など) を、記事にまとめる。Beck が、ガード節を紹介する |
| 1997年 | Sharp が、『Smalltalk by Example』で、手続き型とオブジェクト指向の違いを指摘する (Tell, Don't Ask の元) |
| 1999年 | Fowler の『Refactoring』、Hunt と Thomas の『The Pragmatic Programmer』(DRY)、Beck の『Extreme Programming Explained』(YAGNI) が出版される |
| 2002年 | Martin が、『Agile Software Development, Principles, Patterns, and Practices』で、SOLID をまとめる |
| 2007年 | Savoia と Evans が、CRAP 指標を公開する |
| 2011年 | ISO/IEC 25010 が、策定される |
| 2017年 | Martin が、『Clean Architecture』で、SRP をアクターの観点から説明する |

<pre><code class="caution">この年表のうち、1996年ごろの Martin の記事、1997年の Sharp、ISO/IEC 25010 の年は、検索での確認ができていない部分がある。出典として引用するときは、原典で確認する。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| すべてのクラスに、インターフェースがある | DIP や OCP を、形式的に適用している | 差し替えが現実に起こる境界だけに、抽象を置く |
| 共通化したコードが、条件分岐だらけになる | 偶然の重複を、DRY で統合した | 変更の理由が違うなら、重複を戻す |
| getter と setter だらけで、不正な状態になる | カプセル化を、アクセサの有無だけで考えている | 不正な状態を防ぐ操作を、オブジェクトに持たせる |
| 委譲メソッドが、大量に増える | デメテルの法則を、機械的に守っている | 責務の置き場所を、見直す |
| 何もしない中継の層が、増える | 関心の分離を、層の数で考えている | 各層が、固有の関心を持つかを確認する |
| サブクラスで、例外を投げたり、何もしなかったりする | 継承を、is-a で判断した | 継承をやめ、共通の抽象に、揃える |
| クラスが、細かく分かれすぎて、全体を追えない | SRP を、「1 メソッド 1 クラス」と誤解している | 変更の理由が同じものは、まとめる |
| `Utils` や `Helper` が肥大化する | 置き場所に迷い、とりあえず入れている | 目的ごとのクラスに、分ける |
| DI コンテナの設定が複雑になる | DIP と DI を、混同している | コンストラクタでの注入から始める |
| 使われない拡張点が、残っている | 将来を予測して、先に作った | YAGNI に従い、必要になってから作る |
| カバレッジは高いが、バグが見つかる | assert のないテストで、数値だけを上げた | 結果を検証するテストを、書く |
| 早期リターンで、リソースの解放が漏れる | ガード節を、解放処理の前に置いた | 言語の機能で、解放を保証する |
| 原則どうしが衝突して、決められない | 優先する品質特性が、決まっていない | トレードオフとして、優先を記録する |

---

## 関連 <a id="references" data-name="関連"></a>

| 名前 | 内容 |
| --- | --- |
| 『Clean Code』 | 命名、関数、コメントなど、コードの書き方の実践 |
| 『Agile Software Development, Principles, Patterns, and Practices』 | SOLID とパッケージの原則 |
| 『Clean Architecture』 | 依存の向き、コンポーネントの原則、SRP の現在の定義 |
| 『Refactoring』 | ガード節など、コードを改善する手法の一覧 |
| 『The Pragmatic Programmer』 | DRY、Tell, Don't Ask などの実践 |
| 『Object-Oriented Software Construction』 | CQS、OCP の原典 |
| 『Working Effectively with Legacy Code』 | テストのない既存コードを、変更する方法 |
| 「Rustのテスト」のドキュメント | Rust での、単体テスト、結合テストの書き方 |
| 「プログラミング全般」のノート | プログラミング全般の基本事項 |
