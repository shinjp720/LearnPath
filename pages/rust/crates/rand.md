---
title: rand
layout: default
---

# rand <a id="top" data-name="TOP"></a>

rand は、Rust で乱数を扱うための標準的な crate。乱数の生成、範囲の指定、配列からの抽選、シャッフル、確率分布からのサンプリングなどができる。

| crate | 役割 |
| --- | --- |
| `rand` | 乱数の生成器 (`rand::rng()` など) と、それを使いやすくする機能 |
| `rand_core` | 乱数生成器の基本となるトレイト (`rand` が再エクスポートしている) |
| `rand_distr` | 正規分布など、統計的な分布 (別の crate) |

---

## 導入 <a id="introduction" data-name="導入"></a>

Cargo.toml に追加する。

```toml
[dependencies]
rand = "0.10"
```

または cargo add。

```bash
cargo add rand
```

<pre><code class="caution">rand はバージョンごとに API の名前が変わっているため、古い記事のコードがそのまま動かないことがある。
このドキュメントは rand 0.10 を前提にしている。0.10 は、Rust 1.85 以上が必要 (エディション 2024)。
特に、0.10 では、乱数のメソッド (random_range など) を使うために use するトレイトが、Rng から RngExt に変わった。</code></pre>

### 0.10 での use

```rust
use rand::RngExt; // random や random_range などのメソッドを使うために必要
```

0.9 までは `use rand::Rng;` だったが、0.10 では `rand_core` 側で `RngCore` が `Rng` に改名されたのに合わせて、`rand` の拡張メソッドを持つトレイトが `RngExt` になった。

---

## 基本 <a id="basic" data-name="基本"></a>

`rand::rng()` で、スレッドごとの乱数生成器 (`ThreadRng`) を取得して、そのメソッドで乱数を生成する。

```rust
use rand::RngExt;

fn main() {
    let mut rng = rand::rng();

    let n: u32 = rng.random();             // u32 の全範囲から生成
    let dice = rng.random_range(1..=6);    // 1〜6
    let coin = rng.random_bool(0.5);       // 50% で true

    println!("{n} {dice} {coin}");
}
```

| 関数・メソッド | 動作 |
| --- | --- |
| `rand::rng()` | スレッドごとの乱数生成器を取得する (OS の乱数で、自動で初期化される) |
| `rng.random::<T>()` | 型 `T` の乱数を生成する |
| `rng.random_range(範囲)` | 範囲内の乱数を生成する |
| `rng.random_bool(p)` | 確率 `p` (0.0〜1.0) で `true` |
| `rng.random_ratio(n, d)` | 確率 `n / d` で `true` |
| `rng.fill(&mut 配列)` | 配列やスライスを、乱数で埋める |

### トップレベルの関数

`rng` を作らずに、直接呼び出せる関数もある。`use` も不要。

```rust
fn main() {
    let n: u32 = rand::random();             // 型で生成する値が決まる
    let dice = rand::random_range(1..=6);
    let coin = rand::random_bool(0.5);

    println!("{n} {dice} {coin}");
}
```

<pre><code class="tips">1回だけ使うなら、トップレベルの関数が手軽。
繰り返し使うなら、rand::rng() で rng を1回作って使い回す方が、コードも整理されて、見通しがよい。</code></pre>

---

## 使い方 <a id="usage" data-name="使い方"></a>

### 乱数を複数回生成する

rng を1回作って使い回す。

```rust
use rand::RngExt;

fn main() {
    let mut rng = rand::rng();

    for _ in 0..5 {
        println!("{}", rng.random_range(1..=6));
    }
}
```

### 範囲を指定して生成する

```rust
use rand::RngExt;

fn main() {
    let mut rng = rand::rng();

    // 0 以上 10 未満 (0〜9)
    let n = rng.random_range(0..10);

    println!("{n}");
}
```

範囲の書き方は、標準の `Range` と同じ。

| 書き方 | 範囲 |
| --- | --- |
| `0..10` | 0 以上 10 未満 (0〜9) |
| `1..=6` | 1 以上 6 以下 (1〜6) |
| `0.0..5.0` | 0.0 以上 5.0 未満 |
| `0.0..=1.0` | 0.0 以上 1.0 以下 |
| `'a'..='z'` | 英小文字 |

```rust
let letter = rng.random_range('a'..='z');
```

<pre><code class="caution">空の範囲 (5..5 や 10..0 など) を渡すとパニックする。
範囲が変数で決まる場合は、下限が上限より小さいことを、事前に確認する。</code></pre>

### 配列・Vec から選ぶ

配列。

```rust
use rand::prelude::IndexedRandom;

fn main() {
    let fruits = ["apple", "banana", "orange"];

    let mut rng = rand::rng();

    if let Some(fruit) = fruits.choose(&mut rng) {
        println!("{fruit}");
    }
}
```

Vec。

```rust
use rand::prelude::IndexedRandom;

fn main() {
    let numbers = vec![10, 20, 30, 40];

    let mut rng = rand::rng();

    println!("{:?}", numbers.choose(&mut rng));
}
```

`choose` は、空の配列に対しては `None` を返す (パニックしない)。

#### 重みを付けて選ぶ

`choose_weighted` で、要素ごとに選ばれやすさを変えられる。

```rust
use rand::prelude::IndexedRandom;

fn main() {
    // (名前, 重み)
    let items = [("ノーマル", 70u32), ("レア", 25), ("ウルトラレア", 5)];

    let mut rng = rand::rng();

    let picked = items.choose_weighted(&mut rng, |item| item.1).unwrap();
    println!("{}", picked.0);
}
```

重みの合計が0など、選べない場合は、`Err` が返る。

#### 重複なしで複数選ぶ

```rust
use rand::prelude::IndexedRandom;

fn main() {
    let numbers = vec![10, 20, 30, 40, 50];

    let mut rng = rand::rng();

    // 重複なしで 3 つ選ぶ (要素数より多くは選べない)
    let picked: Vec<_> = numbers.sample(&mut rng, 3).collect();
    println!("{:?}", picked);
}
```

<pre><code class="tips">sample は、0.9 までは choose_multiple という名前だった (0.10 で改名)。</code></pre>

#### イテレータから選ぶ

```rust
use rand::seq::IteratorRandom;

fn main() {
    let mut rng = rand::rng();

    // 1〜100 から 1 つ選ぶ
    let n = (1..=100).choose(&mut rng);
    println!("{:?}", n);
}
```

#### 選んだ要素を書き換える

```rust
use rand::seq::IndexedMutRandom;

fn main() {
    let mut scores = vec![0, 0, 0, 0];

    let mut rng = rand::rng();

    if let Some(score) = scores.choose_mut(&mut rng) {
        *score += 10;
    }

    println!("{:?}", scores);
}
```

### シャッフル

```rust
use rand::prelude::SliceRandom;

fn main() {
    let mut cards = vec![1, 2, 3, 4, 5];

    let mut rng = rand::rng();

    cards.shuffle(&mut rng);

    println!("{cards:?}");
}
```

`shuffle` は、元の配列を並べ替える (`mut` が必要)。

| メソッド | 動作 |
| --- | --- |
| `shuffle(&mut rng)` | 全体をシャッフルする |
| `partial_shuffle(&mut rng, n)` | 先頭 `n` 個だけを、ランダムに選んだ要素にする (全体のシャッフルより速い) |

### 浮動小数点数

```rust
use rand::RngExt;

fn main() {
    let mut rng = rand::rng();

    let x: f64 = rng.random();               // 0.0 以上 1.0 未満
    let y = rng.random_range(0.0..5.0);      // 0.0 以上 5.0 未満

    println!("{x} {y}");
}
```

### 真偽値

```rust
use rand::RngExt;

fn main() {
    // 50% の確率で true
    let b: bool = rand::random();
    println!("{b}");

    let mut rng = rand::rng();

    // 70% の確率で true
    if rng.random_bool(0.7) {
        println!("70%の確率に当選しました！");
    }

    // 3 分の 1 の確率で true
    if rng.random_ratio(1, 3) {
        println!("1/3 の確率に当選しました！");
    }
}
```

<pre><code class="caution">random_bool に渡す確率は、0.0〜1.0 の範囲にする。範囲外の値を渡すとパニックする。
旧名の gen_bool は 0.9 で非推奨になり、0.10 では使わない。</code></pre>

### バイト列を乱数で埋める

```rust
use rand::RngExt;

fn main() {
    let mut rng = rand::rng();

    let mut buf = [0u8; 8];
    rng.fill(&mut buf[..]);

    println!("{:?}", buf);
}
```

### 乱数のイテレータ

```rust
fn main() {
    // u8 の乱数を 5 個
    let v: Vec<u8> = rand::random_iter().take(5).collect();
    println!("{:?}", v);
}
```

---

## 生成できる型 <a id="types" data-name="生成できる型"></a>

`rng.random::<T>()` (または `let x: T = rng.random();`) で生成できる主な型。

| 型 | 生成される値 |
| --- | --- |
| 整数型 (`u8`、`i32`、`u64` など) | その型の全範囲から、一様に |
| `f32` / `f64` | 0.0 以上 1.0 未満 |
| `bool` | `true` と `false` が、50% ずつ |
| `char` | 有効な Unicode のコードポイントから、一様に |
| タプル、配列 | 各要素を、それぞれ生成する |

```rust
use rand::RngExt;

fn main() {
    let mut rng = rand::rng();

    let (a, b): (u8, bool) = rng.random();
    let rgb: [u8; 3] = rng.random();   // ランダムな色

    println!("{a} {b} {rgb:?}");
}
```

<pre><code class="caution">char を random() で生成すると、日本語や記号など、あらゆる Unicode の文字が出る。
英数字だけの文字列が欲しい場合は、random_range('a'..='z') や、後述の Alphanumeric を使う。</code></pre>

---

## 分布 <a id="distribution" data-name="分布"></a>

分布 (`rand::distr`) を使うと、「どのように乱数を生成するか」を、値として持ち回せる。

### Uniform (範囲を使い回す)

同じ範囲で何度も生成するなら、`Uniform` を作っておくと効率がよい。

```rust
use rand::distr::{Distribution, Uniform};

fn main() {
    // 1〜6 を生成する分布 (範囲が不正だと Err になる)
    let die = Uniform::new_inclusive(1, 6).unwrap();

    let mut rng = rand::rng();

    for _ in 0..5 {
        println!("{}", die.sample(&mut rng));
    }
}
```

### 重み付きの添字 (WeightedIndex)

```rust
use rand::distr::{weighted::WeightedIndex, Distribution};

fn main() {
    let names = ["あたり", "はずれ"];
    let weights = [1u32, 9]; // あたり 10%、はずれ 90%

    let dist = WeightedIndex::new(&weights).unwrap();

    let mut rng = rand::rng();

    println!("{}", names[dist.sample(&mut rng)]);
}
```

同じ重みで何度も抽選するなら、`choose_weighted` よりも `WeightedIndex` を作っておく方が効率がよい。

### ランダムな英数字の文字列

```rust
use rand::distr::{Alphanumeric, SampleString};

fn main() {
    let mut rng = rand::rng();

    // 英大文字・小文字・数字から、16 文字の文字列を作る
    let s = Alphanumeric.sample_string(&mut rng, 16);

    println!("{s}");
}
```

<pre><code class="caution">rand は、暗号ライブラリではない (rand 自身がポリシーとして明記している)。
パスワード、認証トークン、秘密鍵など、セキュリティに関わる値の生成には、rand の保証に頼らずに、OS の乱数を直接使う getrandom などの crate や、暗号用の crate を使う。</code></pre>

### 確率で true を返す (Bernoulli)

```rust
use rand::distr::{Bernoulli, Distribution};

fn main() {
    let d = Bernoulli::new(0.3).unwrap(); // 30% で true
    let mut rng = rand::rng();

    println!("{}", d.sample(&mut rng));
}
```

### 統計的な分布 (rand_distr)

正規分布、指数分布、ポアソン分布などは、`rand_distr` crate に入っている。

```bash
cargo add rand_distr
```

```rust
use rand::distr::Distribution;
use rand_distr::Normal;

fn main() {
    // 平均 170.0、標準偏差 5.0 の正規分布
    let normal = Normal::new(170.0, 5.0).unwrap();

    let mut rng = rand::rng();

    println!("{:.1}", normal.sample(&mut rng));
}
```

<pre><code class="tips">rand_distr は、rand のバージョンに合ったものを使う。
cargo add で追加して、ビルドが通るかを確認する (rand の Distribution トレイトが、別のバージョンの rand のものだと、型が合わずにエラーになる)。</code></pre>

---

## 乱数生成器 <a id="rng" data-name="乱数生成器"></a>

| 型 | 取得方法 | 特徴 |
| --- | --- | --- |
| `ThreadRng` | `rand::rng()` | 通常はこれ。スレッドごとに1つで、OS の乱数で自動的に初期化される。`Send` ではない |
| `StdRng` | `StdRng::seed_from_u64(n)` など | 種 (シード) を指定して作れる。アルゴリズムは、バージョンで変わる可能性がある |
| `SmallRng` | `SmallRng::seed_from_u64(n)` など | 高速で小さいが、暗号用途には使えない |

0.9 までは、`SmallRng` に `small_rng` フィーチャーが必要 (既定で有効) だったが、0.10 ではこのフィーチャーが削除されている。

### シードを指定する (再現できる乱数)

同じシードからは、同じ乱数の列が得られる。テストやシミュレーションの再現に使う。

```rust
use rand::{rngs::StdRng, RngExt, SeedableRng};

fn main() {
    let mut rng = StdRng::seed_from_u64(42);

    for _ in 0..3 {
        println!("{}", rng.random_range(1..=100));
    }
}
```

<pre><code class="caution">同じシードで同じ結果になるのは、基本的に、同じバージョンの rand、同じ種類の RNG を使った場合だけ。
StdRng のアルゴリズムは将来変わりうるため、rand を更新すると、結果が変わることがある。
長期間にわたって再現性が必要なら、ChaCha8Rng のように、アルゴリズムが決まっている RNG を指定する (0.10 では chacha フィーチャーが必要)。</code></pre>

### OS から種を取って作る

シードを指定せずに、OS の乱数で初期化した RNG を作るなら `rand::make_rng()` (0.10 で追加) を使う。

```rust
use rand::{rngs::StdRng, RngExt};

fn main() {
    let mut rng: StdRng = rand::make_rng();

    println!("{}", rng.random_range(1..=100));
}
```

---

## 実用例 <a id="example" data-name="実用例"></a>

### サイコロ

```rust
use rand::RngExt;

fn roll(rng: &mut impl RngExt) -> u32 {
    rng.random_range(1..=6)
}

fn main() {
    let mut rng = rand::rng();

    let total = roll(&mut rng) + roll(&mut rng);
    println!("2つのサイコロの合計: {total}");
}
```

### 数当てゲームの答え

```rust
use rand::RngExt;

fn main() {
    let answer = rand::rng().random_range(1..=100);
    println!("答えは {answer} (本来は表示しない)");
}
```

### ガチャ

```rust
use rand::prelude::IndexedRandom;

fn main() {
    let table = [("ノーマル", 80u32), ("レア", 17), ("ウルトラレア", 3)];

    let mut rng = rand::rng();

    for i in 1..=10 {
        let (name, _) = table.choose_weighted(&mut rng, |t| t.1).unwrap();
        println!("{i}回目: {name}");
    }
}
```

### ランダムな順番で処理する

```rust
use rand::prelude::SliceRandom;

fn main() {
    let mut players = vec!["Alice", "Bob", "Carol", "Dave"];

    players.shuffle(&mut rand::rng());

    for (i, p) in players.iter().enumerate() {
        println!("{}番目: {}", i + 1, p);
    }
}
```

---

## テスト <a id="test" data-name="テスト"></a>

乱数を使う関数は、RNG を引数で受け取るようにしておくと、テストでシード付きの RNG を渡せる。

```rust
use rand::RngExt;

// RNG を引数で受け取る (どの RNG でも渡せる)
pub fn roll_dice(rng: &mut impl RngExt) -> u32 {
    rng.random_range(1..=6)
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::{rngs::StdRng, SeedableRng};

    #[test]
    fn dice_is_in_range() {
        let mut rng = StdRng::seed_from_u64(42);

        for _ in 0..1000 {
            let n = roll_dice(&mut rng);
            assert!((1..=6).contains(&n));
        }
    }
}
```

<pre><code class="tips">テストでは、「具体的な値」ではなく、「範囲に収まっているか」「性質を満たしているか」を検証する。
具体的な値を assert すると、rand を更新したときに、テストが壊れることがある。</code></pre>

---

## バージョン間の変更 <a id="migration" data-name="バージョン間の変更"></a>

古い記事やコードを読むときの対応表。

| 0.8 までの書き方 | 0.9 以降 |
| --- | --- |
| `rand::thread_rng()` | `rand::rng()` |
| `rng.gen()` | `rng.random()` |
| `rng.gen_range(a..b)` | `rng.random_range(a..b)` |
| `rng.gen_bool(p)` | `rng.random_bool(p)` |
| `rng.gen_ratio(n, d)` | `rng.random_ratio(n, d)` |
| `rand::distributions` | `rand::distr` |
| `distributions::Standard` | `distr::StandardUniform` |
| `distributions::DistString` | `distr::SampleString` |
| `distributions::WeightedIndex` | `distr::weighted::WeightedIndex` |

さらに、0.10 での変更点。

| 0.9 の書き方 | 0.10 |
| --- | --- |
| `use rand::Rng;` (拡張メソッド) | `use rand::RngExt;` |
| `choose_multiple` | `sample` |
| `choose_multiple_array` | `sample_array` |
| `choose_multiple_weighted` | `sample_weighted` |
| `OsRng` | `SysRng` (名前の変更) |
| `SeedableRng::from_os_rng()` | 削除。`rand::make_rng()` を使う |
| `small_rng` フィーチャー | 削除 |
| `ReseedingRng` | 削除 |

<pre><code class="tips">gen は、Rust 2024 エディションで予約語になったため、0.9 で random に改名された。
旧名は 0.9 で非推奨になり、0.10 では thread_rng や distributions と同様に、使えなくなっている。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

### ThreadRng を別のスレッドに渡せない

`rand::rng()` が返す `ThreadRng` は `Send` ではない。<br>
`tokio::spawn` のタスクの中で `.await` をまたいで保持すると、`future cannot be sent between threads safely` というエラーになる。

```rust
use rand::RngExt;

#[tokio::main]
async fn main() {
    tokio::spawn(async {
        // NG: rng を .await の前後で持ち続けるとエラー
        // let mut rng = rand::rng();
        // tokio::time::sleep(std::time::Duration::from_millis(10)).await;
        // println!("{}", rng.random_range(1..=6));

        // OK: 値を取り出したら、rng はすぐに手放す
        let n = rand::rng().random_range(1..=6);
        tokio::time::sleep(std::time::Duration::from_millis(10)).await;
        println!("{n}");
    })
    .await
    .unwrap();
}
```

<pre><code class="tips">スレッドをまたぐ場合は、各スレッドやタスクの中で rand::rng() を呼ぶか、Send な StdRng や SmallRng を作って渡す。</code></pre>

---

## よくあるエラー <a id="errors" data-name="よくあるエラー"></a>

| エラーの例 | 原因 | 対処 |
| --- | --- | --- |
| `no method named random_range found for struct ThreadRng` | トレイトが use されていない。0.10 では `Rng` ではなく `RngExt` が必要 | `use rand::RngExt;` |
| `cannot find function thread_rng in crate rand` | 0.9 で `rng` に改名された | `rand::rng()` |
| `unresolved import rand::distributions` | 0.9 で `distr` に改名された | `rand::distr` |
| `no method named gen_range found` | 0.9 で `random_range` に改名された | `random_range` |
| パニック (空の範囲) | `random_range` に、空の範囲を渡した | 範囲の下限と上限を確認する |
| パニック (確率が範囲外) | `random_bool` に 0.0〜1.0 以外を渡した | 確率の値を確認する |
| `future cannot be sent between threads safely` | `ThreadRng` を `.await` をまたいで保持している | rng を手放してから `.await` する |
| `rustc 1.xx is not supported` のようなエラー | rand 0.10 が要求する Rust のバージョンより古い | Rust を 1.85 以上に更新する |

---

## 関連クレート <a id="ecosystem" data-name="関連クレート"></a>

| crate | 用途 |
| --- | --- |
| `rand_distr` | 正規分布、指数分布、ポアソン分布などの統計的な分布 |
| `getrandom` | OS の乱数を直接取得する (セキュリティ用途の乱数の土台) |
| `fastrand` | 依存の少ない、軽量な乱数 (暗号用途には使えない) |
| `uuid` | UUID (ランダムな識別子) の生成 |
| `fake` | テスト用のダミーデータ (名前、住所など) の生成 |
| `proptest` | ランダムな入力でテストする (プロパティベーステスト) |
