---
title: rayon
layout: default
---

# rayon <a id="top" data-name="TOP"></a>

rayon は、Rust でデータ並列 (data parallelism) を、簡単かつ安全に書くための crate である。`iter()` を `par_iter()` に書き換えるだけで、イテレーターの処理を、複数のスレッドで、並列に実行できる。

スレッドの生成、仕事の分割、スレッド間の負荷の分散 (ワークスティーリング) は、rayon が自動で行う。Rust の型システムにより、データ競合が起きるコードは、**コンパイル時に拒否される**。そのため、並列化によるバグ (競合状態やデータ競合) を、起こしにくい。

主な用途は、CPU を使う計算 (配列の変換、集計、ソート、画像処理、探索など) を、複数のコアで速くすることである。ネットワークやファイルの待ち時間を、効率よく扱う用途 (非同期 I/O) には、向いていない。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 並列イテレーター | `par_iter()`、`into_par_iter()`、`par_iter_mut()` で、標準のイテレーターとほぼ同じ書き方ができる |
| 分割統治 | `join` と `scope` で、再帰的な処理や、借用したデータを使う処理を、並列化できる |
| ワークスティーリング | 暇なスレッドが、忙しいスレッドの仕事を、盗んで実行する。仕事の量が不均一でも、負荷が分散される |
| スレッドプール | 既定では、CPU のコア数に応じた、グローバルなプールを使う。専用のプールも作れる |
| 安全性 | `Send` と `Sync` の制約で、データ競合は、コンパイル時に防がれる |
| 並列度の自動調整 | 仕事が小さければ、実際には、並列に分割されない (呼び出し元のスレッドで、そのまま実行される) |
| 依存の少なさ | `rayon-core` と `either` に依存する (`wasm_sync` は、任意) |

### 他の方法との比較

| | rayon | `std::thread` / `std::thread::scope` | `tokio` (非同期) |
| --- | --- | --- | --- |
| 目的 | CPU を使う計算の並列化 | 任意のスレッドの処理 | 待ち時間の多い I/O の並行処理 |
| 並列度の管理 | 自動 (プールとワークスティーリング) | 手動 | ランタイムが管理する |
| 書き方 | `par_iter()` など、イテレーターの延長 | スレッドの生成と、`join` を自分で書く | `async` / `await` |
| データの分割 | 自動 | 手動 | 該当なし |
| 向いている仕事 | 配列の変換、集計、ソート | 長く動く、独立した処理 | ネットワーク、ファイル、タイマー |

<pre><code class="tips">CPU を使う重い計算を、非同期のプログラムの中で実行する場合は、tokio の spawn_blocking や、rayon::spawn と oneshot チャネルの組み合わせを使う。
async の関数の中で、rayon の並列処理を直接呼ぶと、その間、非同期のランタイムのスレッドが、止まってしまう。</code></pre>

### 向いている場面と向いていない場面

| 向いている | 向いていない |
| --- | --- |
| 大きなコレクションの、要素ごとの変換や集計 | 要素数が少なく、1要素の処理が軽い処理 (並列化のオーバーヘッドの方が、大きい) |
| ソート、検索、分割統治のアルゴリズム | ネットワークやディスクの待ち時間が、中心の処理 |
| 各要素が、独立して計算できる処理 | 前の結果に、次の結果が依存する処理 (逐次的な処理) |
| 画像、行列、シミュレーションなどの、数値計算 | ロックの競合が、多く起きる処理 |

<pre><code class="caution">このドキュメントは、rayon 1.12 (2026年4月公開) を前提にしている。最小の Rust のバージョンは、1.80 である。
古い記事にある、ParallelIterator の find や position、ThreadPool::new、Configuration などは、非推奨になっている。詳しくは、「古いコードからの変更」の章を参照。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

```bash
cargo add rayon
```

```toml
[dependencies]
rayon = "1"   # cargo add が、最新の 1.x を入れる
```

`rayon::prelude::*` を `use` すると、並列イテレーターのトレイトが、まとめて使える。

```rust
use rayon::prelude::*;
```

### フィーチャーと環境

| 項目 | 内容 |
| --- | --- |
| `web_spin_lock` | WebAssembly で、ブラウザのメインスレッドのミューテックスが、待機でエラーにならないように、スピンする (任意) |
| `RAYON_NUM_THREADS` | 環境変数。グローバルなプールのスレッド数を、指定する |
| 既定のスレッド数 | `std::thread::available_parallelism` の値 (論理コア数) |
| 最小の Rust のバージョン | 1.80 (rayon 1.12) |
| ビルドの種類 | 速度の比較や、計測は、`cargo run --release` で行う |

<pre><code class="tips">rayon のフィーチャーは、web_spin_lock だけである。通常は、フィーチャーを指定せずに、そのまま使える。
スレッド数の既定値は、ハイパースレッディングが有効な環境では、物理コアではなく、論理コアの数になる。</code></pre>

<pre><code class="caution">デバッグビルド (cargo run) では、イテレーターの最適化が、ほとんど行われないため、並列化しても、逐次より遅く見えることがある。
並列化の効果は、必ず --release で、計測する。</code></pre>

---

## 基本 <a id="basic" data-name="基本"></a>

### 最小の例

```rust
use rayon::prelude::*;

fn main() {
    let v: Vec<u64> = (1..=10).collect();

    // 逐次: iter() を使う
    let sum_seq: u64 = v.iter().map(|x| x * x).sum();

    // 並列: par_iter() に変えるだけ
    let sum_par: u64 = v.par_iter().map(|x| x * x).sum();

    assert_eq!(sum_seq, sum_par);
    println!("{sum_par}"); // 385
}
```

<pre><code class="tips">並列イテレーターも、標準のイテレーターと同じく、遅延評価である。map や filter だけでは、何も実行されず、sum や collect、for_each などの、最後の操作を呼んだ時点で、初めて、処理が行われる。</code></pre>

### 並列イテレーターの作り方

| メソッド | 元のコレクション | 要素の型 |
| --- | --- | --- |
| `par_iter()` | `&Vec<T>`、`&[T]` など | `&T` |
| `par_iter_mut()` | `&mut Vec<T>`、`&mut [T]` など | `&mut T` |
| `into_par_iter()` | `Vec<T>`、`Range`、`HashMap` など (所有権を移す) | `T` |

```rust
use rayon::prelude::*;

fn main() {
    // 範囲 (Range) は、into_par_iter() で、並列化する
    let squares: Vec<u32> = (0..10u32).into_par_iter().map(|x| x * x).collect();
    println!("{squares:?}"); // [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

    // 可変な参照で、要素をその場で書き換える
    let mut v = vec![1, 2, 3, 4];
    v.par_iter_mut().for_each(|x| *x *= 10);
    println!("{v:?}"); // [10, 20, 30, 40]

    // 所有権を移して、要素を消費する
    let words = vec![String::from("a"), String::from("bb"), String::from("ccc")];
    let lens: Vec<usize> = words.into_par_iter().map(|s| s.len()).collect();
    println!("{lens:?}"); // [1, 2, 3]
}
```

### 並列化できる主な型

| 型 | `par_iter()` | `into_par_iter()` | 補足 |
| --- | --- | --- | --- |
| `Vec<T>` / `[T]` / `[T; N]` | ○ | ○ | 添字つき (順序が保たれる) |
| `Range<T>` (整数、`char`) | - | ○ | 添字つき |
| `VecDeque<T>` | ○ | ○ | 添字つき |
| `HashMap<K, V>` / `HashSet<T>` | ○ | ○ | 添字なし (順序が、決まっていない) |
| `BTreeMap<K, V>` / `BTreeSet<T>` | ○ | ○ | 添字なし |
| `BinaryHeap<T>` / `LinkedList<T>` | ○ | ○ | 添字なし |
| `Option<T>` / `Result<T, E>` | ○ | ○ | 要素が 0 または 1 つ |
| `String` / `&str` | - | - | `par_chars()`、`par_lines()` などのメソッドを使う (「スライスと文字列」の章を参照) |

<pre><code class="tips">既存のコードの並列化は、iter() を par_iter() に、into_iter() を into_par_iter() に置き換えて、コンパイルが通るかを見る、という手順が基本になる。
コンパイルが通らない場合は、多くは、複数のスレッドから、同じ可変な状態を触っている。その場合は、「共有状態の扱い」の章の方法で、書き直す。</code></pre>

### 逐次の処理への切り替え

並列の処理が、期待どおりに動かないとき (デバッグや、結果の比較) は、`par_iter()` を `iter()` に戻して、同じ結果になるかを確認できる。

```rust
use rayon::prelude::*;

fn main() {
    let v: Vec<i32> = (0..1000).collect();

    let seq: Vec<i32> = v.iter().map(|x| x * 2).collect();
    let par: Vec<i32> = v.par_iter().map(|x| x * 2).collect();

    // 添字つきのイテレーターの collect は、順序が保たれる
    assert_eq!(seq, par);
}
```

---

## イテレーターの操作 <a id="iterator" data-name="イテレーターの操作"></a>

並列イテレーターの、主なメソッドを、アダプター (変換) と、コンシューマー (結果を得る) に分けてまとめる。名前は、標準の `Iterator` と、ほぼ同じである。

### アダプター (変換)

| メソッド | 内容 |
| --- | --- |
| `map(f)` | 各要素を変換する |
| `filter(p)` | 条件に合う要素だけを残す |
| `filter_map(f)` | 変換して、`None` を捨てる |
| `flat_map(f)` | 各要素から、並列イテレーターを作って、平坦にする |
| `flat_map_iter(f)` | 各要素から、**逐次の**イテレーターを作って、平坦にする (内側が軽いときは、こちらが速い) |
| `flatten()` | 入れ子を、平坦にする |
| `inspect(f)` | 各要素を、見る (デバッグ用) |
| `cloned()` / `copied()` | 参照から、値を複製する |
| `chain(other)` | 2つの並列イテレーターを、つなぐ |
| `update(f)` | 各要素を、可変な参照で、書き換えて、そのまま流す |
| `while_some()` | `None` になったら、できるだけ早く止める |
| `panic_fuse()` | どこかでパニックしたら、残りの処理を、早めに止める |
| `with_min_len(n)` / `with_max_len(n)` | 1つの仕事の、最小 / 最大の要素数を、指定する (「粒度の制御」の章を参照) |
| `map_with(init, f)` / `map_init(init, f)` | 仕事ごとに、状態を持たせて、変換する (「共有状態の扱い」の章を参照) |

添字つきの並列イテレーター (`IndexedParallelIterator`。`Vec`、スライス、`Range` など) では、さらに次のメソッドが使える。

| メソッド | 内容 |
| --- | --- |
| `enumerate()` | 添字を付ける |
| `zip(other)` | 2つを、要素ごとに、組にする |
| `rev()` | 逆順にする |
| `take(n)` / `skip(n)` | 先頭から n 個を取る / n 個を飛ばす |
| `chunks(n)` | n 個ずつの、`Vec` にまとめる |
| `step_by(n)` | n 個おきに取る |

### コンシューマー (結果を得る)

| メソッド | 内容 |
| --- | --- |
| `for_each(f)` | 各要素に、副作用のある処理を行う (実行の順序は、決まっていない) |
| `try_for_each(f)` | 各要素に処理を行い、`Err` や `None` で、早めに止める |
| `collect()` | コレクションに集める (`Vec`、`HashMap`、`String`、`Result<Vec<_>, _>` など) |
| `sum()` / `product()` | 合計 / 積 |
| `count()` | 要素数 |
| `min()` / `max()` / `min_by_key(f)` / `max_by_key(f)` | 最小 / 最大の要素 |
| `reduce(identity, op)` | 2つの値を、1つにまとめる演算で、全体を畳み込む |
| `reduce_with(op)` | 単位元がないときの `reduce` (空なら `None`) |
| `fold(identity, op)` | 仕事ごとに畳み込んで、仕事ごとの結果の、並列イテレーターを返す (最後に `reduce` や `sum` でまとめる) |
| `try_reduce` / `try_fold` | `Result` や `Option` を返す版 |
| `any(p)` / `all(p)` | 1つでも / すべて、条件に合うか |
| `find_any(p)` / `find_first(p)` / `find_last(p)` | 条件に合う要素 (どれでも / 最初 / 最後) |
| `position_any(p)` / `position_first(p)` / `position_last(p)` | 条件に合う要素の位置 |
| `unzip()` | 組の列を、2つのコレクションに分ける |
| `partition(p)` | 条件で、2つのコレクションに分ける |

```rust
use rayon::prelude::*;

fn main() {
    let v: Vec<i32> = (1..=100).collect();

    let even_squares: Vec<i32> = v
        .par_iter()
        .filter(|x| *x % 2 == 0)
        .map(|x| x * x)
        .collect();
    println!("{}", even_squares.len()); // 50

    let max = v.par_iter().max().unwrap();
    let total: i32 = v.par_iter().sum();
    let any_big = v.par_iter().any(|&x| x > 99);
    println!("{max} {total} {any_big}"); // 100 5050 true

    // 組の列を、2つの Vec に分ける
    let (small, large): (Vec<i32>, Vec<i32>) = v.par_iter().copied().partition(|&x| x <= 50);
    println!("{} {}", small.len(), large.len()); // 50 50
}
```

<pre><code class="caution">find や position は、並列では、「最初の」要素を返す保証がないため、非推奨になっている。
どれでもよいなら find_any、先頭が必要なら find_first を使う。</code></pre>

<pre><code class="tips">map、filter、map のように、処理を、1本のチェーンでつなぐと、途中のコレクションを作らずに済み、効率がよい。途中で collect を挟むのは、結果が必要なときだけにする。</code></pre>

---

## 順序と集計 <a id="order" data-name="順序と集計"></a>

### 添字つきと添字なし

並列イテレーターには、要素の位置 (添字) が決まっている `IndexedParallelIterator` と、決まっていない `ParallelIterator` がある。`Vec`、スライス、`Range` から作ったものは、添字つきである。`HashMap` や、`filter` の後のように、位置が決まらないものは、添字なしになる。

| 操作 | 添字つき | 添字なし |
| --- | --- | --- |
| `collect::<Vec<_>>()` の順序 | 元の順序が保たれる | 元の順序が保たれる (`filter` や `flat_map` を通したあとでも、残った要素の相対的な順序が保たれる) |
| `enumerate()` / `zip()` / `rev()` / `take()` / `skip()` | 使える | 使えない |
| `for_each()` の実行の順序 | 決まっていない | 決まっていない |
| `HashMap` / `HashSet` からの `par_iter()` | - | 要素の順序は、決まっていない |

`filter` や `flat_map` を通したあとでも、`collect::<Vec<_>>()` は、元の並びの順序で、結果を並べる。一方、`for_each` の中で、各要素を処理する順序は、実行ごとに変わる。

<pre><code class="caution">for_each の中で、println! や、共有した Vec への push を行うと、出力や並びの順序が、実行ごとに変わる。
順序が必要なら、collect で結果を集めてから、逐次の処理で出力する。</code></pre>

### reduce の条件

`reduce(identity, op)` は、複数のスレッドが、それぞれ畳み込んだ結果を、あとで結合する。そのため、`op` は、次の2つの条件を満たす必要がある。

| 条件 | 内容 |
| --- | --- |
| 結合法則 | `op(op(a, b), c)` と `op(a, op(b, c))` が、同じ結果になる |
| 単位元 | `identity()` が返す値は、`op(identity(), x)` が `x` になる値 |

```rust
use rayon::prelude::*;

fn main() {
    let v: Vec<u64> = (1..=100).collect();

    // 合計: 結合法則を満たし、単位元は 0
    let sum = v.par_iter().copied().reduce(|| 0, |a, b| a + b);

    // 最大値: 単位元は、最小の値
    let max = v.par_iter().copied().reduce(|| u64::MIN, |a, b| a.max(b));

    // 空かもしれないときは reduce_with (空なら None)
    let min = v.par_iter().copied().reduce_with(|a, b| a.min(b));

    println!("{sum} {max} {min:?}"); // 5050 100 Some(1)
}
```

<pre><code class="caution">引き算 (a - b) や、文字列の連結のように、結合法則を満たさない演算を、reduce に渡すと、結果が、スレッドの数や、実行のたびに変わる。
文字列の連結のように、順序が結果に影響する処理は、添字つきのイテレーターを使って、collect で順序を保ってから、逐次的に結合する。</code></pre>

### fold と reduce

`fold` は、仕事 (分割された、要素のまとまり) ごとに、自分専用の状態に畳み込む。結果は、「仕事ごとの結果」の並列イテレーターになるため、最後に `reduce` や `sum` で、まとめる。ロックを使わずに、集計できる。

```rust
use rayon::prelude::*;
use std::collections::HashMap;

fn main() {
    let words = ["apple", "pear", "apple", "fig", "pear", "apple"];

    // 仕事ごとに HashMap を作り、最後に結合する (ロックが不要)
    let counts: HashMap<&str, usize> = words
        .par_iter()
        .fold(HashMap::new, |mut map, &w| {
            *map.entry(w).or_insert(0) += 1;
            map
        })
        .reduce(HashMap::new, |mut a, b| {
            for (k, v) in b {
                *a.entry(k).or_insert(0) += v;
            }
            a
        });

    println!("{}", counts["apple"]); // 3
}
```

| メソッド | `identity` の渡し方 |
| --- | --- |
| `fold(identity, op)` | クロージャ (`HashMap::new` のように、関数を渡せる)。仕事ごとに呼ばれる |
| `fold_with(init, op)` | 値。仕事ごとに、`clone` される |
| `reduce(identity, op)` | クロージャ。結合のたびに、必要に応じて呼ばれる |

### 浮動小数点数の合計

浮動小数点数の足し算は、結合法則を厳密には満たさない。並列の `sum()` は、足す順序が、スレッドの数や分割によって変わるため、結果が、逐次の `sum()` と、わずかに異なることがある。

```rust
use rayon::prelude::*;

fn main() {
    let v: Vec<f64> = (0..100_000).map(|i| (i as f64).sqrt()).collect();

    // 分割の仕方が、スレッド数によって変わるため、実行環境で、結果が異なる可能性がある
    let s1: f64 = v.par_iter().sum();

    // 固定の大きさで分けて、部分和を逐次に足すと、スレッド数に関係なく、同じ結果になる
    let partials: Vec<f64> = v.par_chunks(1024).map(|c| c.iter().sum::<f64>()).collect();
    let s2: f64 = partials.iter().sum();

    println!("{}", (s1 - s2).abs() < 1e-3); // true
}
```

<pre><code class="tips">結果を、環境に関係なく、再現したいときは、par_chunks で、固定の大きさに分けて、部分和を求め、その部分和を逐次に足す。
高い精度が必要なら、整数 (固定小数点) に直して合計する方法もある。</code></pre>

---

## collect と結果の集め方 <a id="collect" data-name="collectと集め方"></a>

### collect できるコレクション

| 集める先 | 補足 |
| --- | --- |
| `Vec<T>` | 添字つきなら、元の順序が保たれる |
| `HashMap<K, V>` / `HashSet<T>` | 同じキーがあれば、どちらが残るかは、決まっていない |
| `BTreeMap<K, V>` / `BTreeSet<T>` | 並びは、キーの順序になる |
| `String` | `char`、`&str`、`String` の並列イテレーターから集める |
| `Box<[T]>` / `Rc<[T]>` / `Arc<[T]>` | スライスとして集める |
| `Result<C, E>` | `Err` が1つでもあれば、`Err` を返す (短絡する) |
| `Option<C>` | `None` が1つでもあれば、`None` を返す (短絡する) |

```rust
use rayon::prelude::*;
use std::collections::HashSet;

fn main() {
    // 文字列に集める
    let s: String = (0..5u8).into_par_iter().map(|i| (b'a' + i) as char).collect();
    println!("{s}"); // abcde

    // 重複を除く
    let set: HashSet<u32> = [1u32, 2, 2, 3, 3, 3].par_iter().copied().collect();
    println!("{}", set.len()); // 3
}
```

### Result への collect (エラーの短絡)

`Result` の並列イテレーターを、`Result<Vec<_>, _>` に集めると、`Err` が見つかった時点で、残りの処理が、早めに打ち切られる。

```rust
use rayon::prelude::*;
use std::num::ParseIntError;

fn main() {
    let ok = ["1", "2", "3"];
    let parsed: Result<Vec<i32>, ParseIntError> = ok.par_iter().map(|s| s.parse()).collect();
    println!("{parsed:?}"); // Ok([1, 2, 3])

    let bad = ["1", "x", "3"];
    let parsed: Result<Vec<i32>, ParseIntError> = bad.par_iter().map(|s| s.parse()).collect();
    println!("{}", parsed.is_err()); // true
}
```

<pre><code class="caution">エラーが複数ある場合に、どの Err が返るかは、実行のたびに変わることがある (最初のエラーとは限らない)。
エラーの内容を、再現できる形で返したいときは、いったん、すべての結果を Vec&lt;Result&lt;_, _&gt;&gt; に集めてから、逐次に調べる。</code></pre>

### 分けて集める

| メソッド | 内容 |
| --- | --- |
| `unzip()` | 組 `(A, B)` の列を、2つのコレクションに分ける |
| `partition(p)` | 条件で、2つのコレクションに分ける (要素は、そのまま) |
| `partition_map(f)` | `Either::Left` / `Either::Right` を返す関数で、2つに分ける |
| `collect_into_vec(&mut vec)` | 既存の `Vec` に、集める (確保済みの領域を、再利用できる。添字つき限定) |
| `par_extend(iter)` | 既存のコレクションに、並列イテレーターの要素を、追加する |

```rust
use rayon::prelude::*;

fn main() {
    // unzip: 2つの Vec に分ける
    let (idx, sq): (Vec<usize>, Vec<usize>) = (0..5usize).into_par_iter().map(|i| (i, i * i)).unzip();
    println!("{idx:?} {sq:?}"); // [0, 1, 2, 3, 4] [0, 1, 4, 9, 16]

    // collect_into_vec: 既存の Vec に集める
    let mut out = Vec::new();
    (0..5u32).into_par_iter().map(|x| x + 100).collect_into_vec(&mut out);
    println!("{out:?}"); // [100, 101, 102, 103, 104]

    // par_extend: 既存の Vec に追加する
    let mut v = vec![0u32];
    v.par_extend((1..4u32).into_par_iter());
    println!("{}", v.len()); // 4
}
```

<pre><code class="tips">collect_into_vec や par_extend は、既存の Vec の領域を再利用できる。同じ処理を、何度も繰り返す場合は、毎回 collect で新しい Vec を作るより、メモリの確保を減らせる。</code></pre>

---

## スライスと文字列 <a id="slice-string" data-name="スライスと文字列"></a>

### スライスの分割

`ParallelSlice` と `ParallelSliceMut` が、スライスを、さまざまな単位で、並列に処理する。

| メソッド | 内容 |
| --- | --- |
| `par_chunks(n)` / `par_chunks_mut(n)` | n 個ずつに、分ける (最後は、短くなることがある) |
| `par_chunks_exact(n)` / `par_chunks_exact_mut(n)` | ちょうど n 個のまとまりだけ (端数は、`remainder` で得る) |
| `par_rchunks(n)` | 末尾から、n 個ずつ |
| `par_windows(n)` | 長さ n の、重なりのある窓 |
| `par_array_windows::<N>()` | 長さ `N` の窓を、`&[T; N]` として得る (1.12 で追加) |
| `par_chunk_by(f)` / `par_chunk_by_mut(f)` | 隣り合う要素が、条件を満たす間のまとまり (Rust 1.77 の `chunk_by` と同様) |
| `par_split(p)` / `par_split_mut(p)` | 条件に合う要素で、区切る |
| `par_split_inclusive(p)` | 区切りの要素を、左側に含めて分ける |

```rust
use rayon::prelude::*;

fn main() {
    let mut data: Vec<u32> = (1..=10).collect();

    // 4 個ずつのまとまりの合計
    let sums: Vec<u32> = data.par_chunks(4).map(|c| c.iter().sum()).collect();
    println!("{sums:?}"); // [10, 26, 19]

    // まとまりごとに、その場で書き換える
    data.par_chunks_mut(5).for_each(|c| c.reverse());
    println!("{data:?}"); // [5, 4, 3, 2, 1, 10, 9, 8, 7, 6]

    // 長さ 3 の窓で、移動平均 (の合計)
    let moving: Vec<u32> = data.par_windows(3).map(|w| w.iter().sum()).collect();
    println!("{}", moving.len()); // 8

    // 長さが定数の窓
    let diffs: Vec<i64> = data
        .par_array_windows::<2>()
        .map(|&[a, b]| b as i64 - a as i64)
        .collect();
    println!("{}", diffs.len()); // 9
}
```

<pre><code class="tips">要素ごとの処理が軽いときは、par_iter で 1 要素ずつ処理するより、par_chunks で、まとまりごとに処理した方が、オーバーヘッドが小さく、速くなることが多い。
行列や画像のように、行 (または、一定の幅) ごとに独立した処理は、par_chunks_mut で、行ごとに書き換えると、ロックなしで、安全に並列化できる。</code></pre>

### ソート

| メソッド | 内容 |
| --- | --- |
| `par_sort()` / `par_sort_by(f)` / `par_sort_by_key(f)` | 安定ソート (同じ値の順序が、保たれる) |
| `par_sort_unstable()` / `par_sort_unstable_by(f)` / `par_sort_unstable_by_key(f)` | 不安定ソート (一般に速く、追加のメモリが少ない) |
| `par_sort_by_cached_key(f)` | キーを、一度だけ計算して、キャッシュする (キーの計算が重いとき) |

```rust
use rayon::prelude::*;

fn main() {
    let mut v: Vec<i32> = (0..1000).rev().collect();
    v.par_sort();
    assert!(v.windows(2).all(|w| w[0] <= w[1]));

    // 構造体を、キーでソート
    let mut people = vec![("bob", 30), ("alice", 25), ("carol", 35)];
    people.par_sort_by_key(|&(_, age)| age);
    println!("{people:?}"); // [("alice", 25), ("bob", 30), ("carol", 35)]

    // 降順
    let mut nums = vec![3, 1, 2];
    nums.par_sort_unstable_by(|a, b| b.cmp(a));
    println!("{nums:?}"); // [3, 2, 1]
}
```

<pre><code class="tips">要素数が少ないときは、並列ソートは、標準の sort より遅くなることがある。数千要素より大きいときに、効果が出やすい。
同じ値の順序を、気にしないなら、par_sort_unstable を使う。</code></pre>

### 文字列

`ParallelString` が、`&str` に、並列のメソッドを足す。

| メソッド | 内容 |
| --- | --- |
| `par_chars()` / `par_char_indices()` | 文字 (と、そのバイト位置) |
| `par_bytes()` | バイト |
| `par_lines()` | 行 (`\n` と `\r\n` で、区切る) |
| `par_split_whitespace()` | 空白で、区切った単語 |
| `par_split_ascii_whitespace()` | ASCII の空白だけで区切る (高速) |
| `par_split(pat)` / `par_split_terminator(pat)` | パターンで、区切る |
| `par_matches(pat)` / `par_match_indices(pat)` | パターンに一致する部分 (と位置) |

```rust
use rayon::prelude::*;

fn main() {
    let text = "the quick brown fox\njumps over\nthe lazy dog";

    let words = text.par_split_whitespace().count();
    let lines = text.par_lines().count();
    let vowels = text.par_chars().filter(|c| "aeiou".contains(*c)).count();

    println!("{words} {lines} {vowels}"); // 9 3 11
}
```

---

## join と scope <a id="join-scope" data-name="joinとscope"></a>

並列イテレーターで書けない処理 (再帰的なアルゴリズムや、種類の違う仕事の同時実行) には、`join` と `scope` を使う。

### join (2つの仕事を並列に実行する)

`join(a, b)` は、2つのクロージャを、並列に実行して、両方の結果を組で返す。空いているスレッドがあれば、並列に実行され、なければ、呼び出し元のスレッドで、順に実行される。再帰で使うと、分割統治のアルゴリズムを、簡単に並列化できる。

```rust
fn main() {
    let (a, b) = rayon::join(|| 1 + 2, || "hello".len());
    println!("{a} {b}"); // 3 5

    // 再帰: 二分木のような分割
    println!("{}", sum(&(1..=1000).collect::<Vec<u64>>())); // 500500
}

/// 配列を半分に分けて、再帰的に合計する
fn sum(v: &[u64]) -> u64 {
    // 小さくなったら、逐次で計算する (並列化のオーバーヘッドを避ける)
    if v.len() <= 1024 {
        return v.iter().sum();
    }
    let (left, right) = v.split_at(v.len() / 2);
    let (a, b) = rayon::join(|| sum(left), || sum(right));
    a + b
}
```

```rust
/// 並列クイックソート
fn quick_sort<T: PartialOrd + Send>(v: &mut [T]) {
    if v.len() <= 1 {
        return;
    }
    let mid = partition(v);
    let (lo, hi) = v.split_at_mut(mid);
    rayon::join(|| quick_sort(lo), || quick_sort(&mut hi[1..]));
}

/// 最後の要素をピボットにして、分割する
fn partition<T: PartialOrd>(v: &mut [T]) -> usize {
    let pivot = v.len() - 1;
    let mut i = 0;
    for j in 0..pivot {
        if v[j] <= v[pivot] {
            v.swap(i, j);
            i += 1;
        }
    }
    v.swap(i, pivot);
    i
}

fn main() {
    let mut v = vec![5, 2, 9, 1, 7, 3, 8];
    quick_sort(&mut v);
    println!("{v:?}"); // [1, 2, 3, 5, 7, 8, 9]
}
```

<pre><code class="caution">再帰の末端まで、join で分けると、仕事が小さすぎて、並列化のコストの方が大きくなる。
一定の大きさ (数百〜数千要素) 以下になったら、逐次の処理に切り替える。</code></pre>

<pre><code class="tips">join の2つのクロージャは、どちらも、同じデータを、読み取り専用で借用できる。可変な借用が必要なときは、split_at_mut などで、データを、重ならない部分に分けてから、それぞれに渡す。</code></pre>

### scope (複数の仕事を、スコープの中で生成する)

`scope` の中では、`spawn` で、任意の数の仕事を、生成できる。`scope` は、中で生成した、すべての仕事が終わるまで、戻らない。そのため、仕事は、スタック上のデータを、借用できる。

```rust
fn main() {
    let mut a = vec![1, 2, 3];
    let mut b = vec![10, 20, 30];

    // スコープの中で、スタックのデータを、借用して使う
    rayon::scope(|s| {
        s.spawn(|_| a.iter_mut().for_each(|x| *x *= 2));
        s.spawn(|_| b.iter_mut().for_each(|x| *x += 1));
    });

    println!("{a:?} {b:?}"); // [2, 4, 6] [11, 21, 31]
}
```

| 関数 | 内容 |
| --- | --- |
| `rayon::join(a, b)` | 2つの仕事を、並列に実行して、結果を返す |
| `rayon::scope(f)` | スコープを作る。中で生成した仕事が、すべて終わるまで、待つ |
| `rayon::scope_fifo(f)` | `scope` と同じだが、生成した順に、仕事が実行される傾向がある |
| `rayon::in_place_scope(f)` | 呼び出し元のスレッドで、`f` を、そのまま実行する `scope` |
| `rayon::spawn(f)` | **`'static`** な仕事を、プールに投げる (完了を待たない) |
| `rayon::spawn_fifo(f)` | `spawn` の、先入れ先出し版 |
| `rayon::broadcast(f)` | プールの、**すべてのスレッドで**、1回ずつ `f` を実行する |
| `rayon::yield_now()` | 他の仕事を、実行して、協調的に、実行権を譲る |

### spawn と broadcast

```rust
use std::sync::mpsc;

fn main() {
    // spawn: 'static な仕事を、プールに投げて、チャネルで結果を受け取る
    let (tx, rx) = mpsc::channel();
    rayon::spawn(move || {
        let result: u64 = (1..=100u64).sum();
        tx.send(result).unwrap();
    });
    println!("{}", rx.recv().unwrap()); // 5050

    // broadcast: すべてのスレッドで実行して、結果を Vec で受け取る
    let indexes: Vec<usize> = rayon::broadcast(|ctx| ctx.index());
    println!("{}", indexes.len() == rayon::current_num_threads()); // true
}
```

<pre><code class="caution">spawn に渡すクロージャは、'static でなければならない (スタックのデータを、借用できない)。借用が必要なら、scope を使う。
spawn の仕事の中で起きたパニックは、呼び出し元には伝わらない。デフォルトでは、プロセスが中断される。ThreadPoolBuilder の panic_handler で、処理を指定できる。</code></pre>

---

## スレッドプール <a id="thread-pool" data-name="スレッドプール"></a>

### グローバルなプール

rayon は、最初に使われたときに、グローバルなスレッドプールを、自動で作る。スレッド数は、既定では、論理コアの数である。

```rust
fn main() {
    println!("スレッド数: {}", rayon::current_num_threads());

    // プールのワーカースレッドの中でのみ、Some になる
    println!("{:?}", rayon::current_thread_index()); // None (メインスレッド)
    rayon::join(|| {}, || {});
}
```

グローバルなプールの設定は、`build_global` で、最初に1回だけ行える。

```rust
use rayon::ThreadPoolBuilder;

fn main() {
    ThreadPoolBuilder::new()
        .num_threads(4)
        .thread_name(|i| format!("worker-{i}"))
        .build_global()
        .unwrap();

    println!("{}", rayon::current_num_threads()); // 4

    // 2回目は、エラーになる
    assert!(ThreadPoolBuilder::new().num_threads(2).build_global().is_err());
}
```

<pre><code class="caution">build_global は、プログラムの中で、1回しか成功しない。すでにグローバルなプールが、(rayon の機能を使って、自動で) 作られていた場合も、エラーになる。
設定は、プログラムの最初 (他の rayon の機能を使う前) に行う。環境変数 RAYON_NUM_THREADS でも、スレッド数を指定できる。</code></pre>

### 専用のプール

プールを、自分で作って、`install` で、その中で処理を実行できる。`install` の中の並列イテレーターは、そのプールのスレッドで、実行される。

```rust
use rayon::prelude::*;
use rayon::ThreadPoolBuilder;

fn main() {
    // 2 スレッドだけの、専用のプール
    let pool = ThreadPoolBuilder::new().num_threads(2).build().unwrap();

    let sum: u64 = pool.install(|| {
        println!("{}", rayon::current_num_threads()); // 2
        (1..=100u64).into_par_iter().sum()
    });
    println!("{sum}"); // 5050
}
```

| 項目 | 内容 |
| --- | --- |
| `ThreadPoolBuilder::new()` | ビルダーを作る |
| `.num_threads(n)` | スレッド数 (0 なら、既定の値) |
| `.thread_name(f)` | スレッド名を決める関数 |
| `.stack_size(bytes)` | スレッドのスタックのサイズ |
| `.start_handler(f)` / `.exit_handler(f)` | スレッドの開始 / 終了時に呼ばれる関数 |
| `.panic_handler(f)` | `spawn` した仕事で、パニックが起きたときの処理 |
| `.use_current_thread()` | プールを作るスレッドを、プールの一員として使う |
| `.build()` | 専用のプールを作る |
| `.build_global()` | グローバルなプールとして、設定する (1回だけ) |
| `pool.install(f)` | プールの中で `f` を実行して、結果を返す |
| `pool.join(a, b)` / `pool.scope(f)` / `pool.spawn(f)` / `pool.broadcast(f)` | プールを指定した `join`、`scope`、`spawn`、`broadcast` |
| `pool.current_num_threads()` | そのプールのスレッド数 |

<pre><code class="tips">用途の違う仕事 (計算の重い処理と、応答性が必要な処理など) は、別のプールに分けると、互いに邪魔をしにくい。
テストで、スレッド数を固定したいときや、並列度を制限したいときにも、専用のプールと install が使える。</code></pre>

<pre><code class="caution">プールの外の、別のスレッドから install を呼ぶと、呼び出し元のスレッドは、仕事が終わるまで、ブロックされる。
async のコードの中で、直接 install すると、非同期のランタイムの、ワーカースレッドが止まる。</code></pre>

---

## 粒度の制御 <a id="granularity" data-name="粒度の制御"></a>

rayon は、仕事を、必要に応じて、自動で分割する。多くの場合は、既定のままで、よい性能が出る。ただし、1要素の処理が極端に軽い、または、極端に重いときは、分割の粒度を調整すると、速くなる。

### 分割の仕組み

並列イテレーターは、まず、全体を1つの仕事として扱い、他のスレッドが暇なときに、仕事を2つに分ける。分けた仕事も、同様に、さらに分けられる。そのため、要素数が少ないときは、ほとんど分割されず、実質的に、逐次と同じ動作になる。

| 状況 | 起きること |
| --- | --- |
| 1要素の処理が軽い (数ナノ秒) | 分割と、スレッド間の受け渡しのコストが、処理より大きくなる |
| 1要素の処理が重い | 細かく分割した方が、負荷が均等になる |
| 要素ごとの処理時間が、不揃い | ワークスティーリングが、負荷を、自動で均等にする |

### with_min_len と with_max_len

| メソッド | 内容 |
| --- | --- |
| `with_min_len(n)` | 1つの仕事が、最低でも n 要素を持つように、分割を制限する (軽い処理に使う) |
| `with_max_len(n)` | 1つの仕事が、最大でも n 要素になるまで、分割を続ける (重い処理に使う) |

```rust
use rayon::prelude::*;

fn main() {
    let v: Vec<u64> = (0..1_000_000).collect();

    // 軽い処理: 1 つの仕事を、最低 10,000 要素にして、分割のコストを減らす
    let a: u64 = v.par_iter().with_min_len(10_000).map(|x| x * 2).sum();

    // 重い処理: 細かく分けて、負荷を均等にする
    let b: u64 = v.par_iter().with_max_len(1_000).map(|x| x * 2).sum();

    assert_eq!(a, b);
}
```

<pre><code class="tips">with_min_len や with_max_len の最適な値は、処理の内容と、環境によって変わる。値を決める前に、計測する。
軽い処理では、1要素ずつではなく、par_chunks でまとまりごとに処理する方が、手軽で、効果が大きいことが多い。</code></pre>

### 途中で止める処理と、ブロック分割

`any`、`find_any`、`find_first` のように、結果が見つかった時点で、残りを止められる処理でも、並列では、他のスレッドが、すでに、先の要素を処理している。結果が、先頭付近にあるなら、無駄な処理が増える。`by_exponential_blocks` や `by_uniform_blocks` は、要素を、ブロックに区切って、ブロックごとに、順に並列処理する。

```rust
use rayon::prelude::*;

fn main() {
    let data: Vec<u32> = (0..10_000_000).collect();

    // 先頭付近にある要素を探す: ブロックを、指数的に大きくしながら処理する
    let found = data
        .par_iter()
        .by_exponential_blocks()
        .any(|&x| x == 1_234);
    println!("{found}"); // true

    // 一定の大きさのブロックごとに処理する
    let found = data
        .par_iter()
        .by_uniform_blocks(100_000)
        .find_first(|&&x| x == 5_000_000);
    println!("{found:?}"); // Some(5000000)
}
```

| メソッド | 内容 |
| --- | --- |
| `by_exponential_blocks()` | ブロックの大きさを、1, 2, 4, ... のように倍々に増やす。結果の位置が、分からないときに向く |
| `by_uniform_blocks(n)` | n 要素ずつの、一定の大きさのブロックで処理する |

### 木構造の並列処理 (walk_tree)

木のように、各要素が、さらに子の要素を持つデータは、`walk_tree` で、並列に走査できる。

```rust
use rayon::iter::walk_tree;
use rayon::prelude::*;

struct Node {
    value: u32,
    children: Vec<Node>,
}

fn main() {
    let tree = Node {
        value: 1,
        children: vec![
            Node { value: 2, children: vec![] },
            Node {
                value: 3,
                children: vec![Node { value: 4, children: vec![] }],
            },
        ],
    };

    // 子の取り出し方を、クロージャで教える
    let sum: u32 = walk_tree(&tree, |n| n.children.iter())
        .map(|n| n.value)
        .sum();
    println!("{sum}"); // 10
}
```

### 逐次のイテレーターの並列化 (par_bridge)

`par_bridge()` は、標準の `Iterator` を、並列イテレーターに変換する。チャネルや、ファイルの読み込みのように、`par_iter()` にできないものに使える。

```rust
use rayon::iter::ParallelBridge;
use rayon::prelude::*;

fn main() {
    // 標準のイテレーターを、並列にする
    let it = (1..=1000u64).filter(|x| x % 3 == 0);
    let sum: u64 = it.par_bridge().map(|x| x * 2).sum();
    println!("{sum}"); // 333666
}
```

<pre><code class="caution">par_bridge は、元のイテレーターから、要素を 1つずつ、ロックして取り出すため、取り出しの速度が、ボトルネックになることがある。元の順序も保たれない。
Vec やスライス、Range など、par_iter にできるものは、par_iter を使う。メモリに収まるなら、いったん Vec に集めてから、par_iter にする方が速いことが多い。</code></pre>

---

## 共有状態の扱い <a id="shared-state" data-name="共有状態の扱い"></a>

並列の処理で、複数のスレッドが、同じ可変なデータを触るコードは、Rust のコンパイラが、コンパイル時に拒否する。結果を集めるには、共有を避ける方法を、優先する。

### 方法の選び方

| 方法 | 内容 | 向いている場面 |
| --- | --- | --- |
| 戻り値で集める | `map` と `collect`、`sum`、`reduce` | 最も簡単で、速い。まず、これを考える |
| `fold` と `reduce` | 仕事ごとに、専用の状態に集めて、最後に結合する | ヒストグラム、`HashMap` への集計 |
| `map_init` / `for_each_init` | 仕事ごとに、再利用できる状態 (バッファ、乱数生成器) を作る | 一時的なバッファを、使い回したいとき |
| `for_each_with` | 仕事ごとに、値を `clone` して渡す | チャネルの `Sender` を、各仕事に渡す |
| アトミック型 | `AtomicUsize::fetch_add` など | 単純なカウンタ、フラグ |
| `Mutex` / `RwLock` | ロックで守る | 更新が、まれなとき |
| 専用の並行データ構造 | `dashmap` など | 多数のスレッドが、頻繁に更新する、マップ |

### map_init (仕事ごとの状態)

`map_init(init, f)` は、仕事ごとに `init` を、1回だけ呼んで、その状態を、同じ仕事の中の要素で、使い回す。要素ごとに、メモリの確保や、生成のコストがかかる処理に向く。

```rust
use rayon::prelude::*;

fn main() {
    let lines = vec!["  alpha ", "beta", "  gamma  "];

    let lens: Vec<usize> = lines
        .par_iter()
        .map_init(
            // 仕事ごとに 1 回: バッファを作る
            || String::with_capacity(256),
            // 要素ごとに: バッファを、使い回す
            |buf, line| {
                buf.clear();
                buf.push_str(line.trim());
                buf.len()
            },
        )
        .collect();

    println!("{lens:?}"); // [5, 4, 5]
}
```

<pre><code class="caution">map_init の init は、仕事の分割のたびに呼ばれるため、1つのスレッドで、何回も呼ばれることがある。「スレッドにつき 1回」ではない。
スレッドごとに、1回だけ初期化したい場合は、thread_local を使うか、broadcast で、各スレッドの状態を、準備する。</code></pre>

### アトミック型とチャネル

```rust
use rayon::prelude::*;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::mpsc;

fn main() {
    // アトミックなカウンタ: fetch_add で、読み取りと加算を、不可分に行う
    let counter = AtomicUsize::new(0);
    (0..1000).into_par_iter().for_each(|_| {
        counter.fetch_add(1, Ordering::Relaxed);
    });
    println!("{}", counter.load(Ordering::Relaxed)); // 1000

    // チャネル: 各仕事に、Sender の複製を渡す
    let (tx, rx) = mpsc::channel();
    (0..5u32).into_par_iter().for_each_with(tx, |tx, x| {
        tx.send(x * x).unwrap();
    });
    let mut results: Vec<u32> = rx.iter().collect();
    results.sort();
    println!("{results:?}"); // [0, 1, 4, 9, 16]
}
```

<pre><code class="tips">カウンタには、load してから store するのではなく、fetch_add のように、1回の操作で完結するメソッドを使う。load と store の間に、他のスレッドが割り込むと、値がずれる。
Ordering は、単なるカウンタなら Relaxed でよい。他のデータの可視性に、関わる場合は、SeqCst などを選ぶ。</code></pre>

### Mutex の使い方

```rust
use rayon::prelude::*;
use std::sync::Mutex;

fn main() {
    let results = Mutex::new(Vec::new());

    (0..100u32).into_par_iter().for_each(|x| {
        // ロックを持つ時間は、短くする (計算は、ロックの外で行う)
        let value = x * x;
        results.lock().unwrap().push(value);
    });

    let mut v = results.into_inner().unwrap();
    v.sort(); // 並びが、実行ごとに変わるので、ソートする
    println!("{}", v.len()); // 100
}
```

<pre><code class="caution">Mutex のロックを持ったまま、rayon の並列処理 (par_iter、join など) を呼ぶと、デッドロックする危険がある。待っているスレッドが、別の仕事を実行しようとして、同じロックを取ろうとするため。
ロックの範囲は、短くして、ロックを持っている間は、並列処理を呼ばない。</code></pre>

<pre><code class="caution">Rc、Cell、RefCell は、スレッド間で共有できない (Send と Sync を満たさない) ため、並列の処理に、使えない。
Rc は Arc に、Cell や RefCell は、アトミック型や Mutex に置き換えるか、共有しない設計に直す。</code></pre>

---

## パニックとエラー <a id="panic" data-name="パニックとエラー"></a>

### パニックの伝わり方

| 場面 | 動作 |
| --- | --- |
| 並列イテレーター、`join`、`scope` の中でのパニック | パニックが、呼び出し元のスレッドに、**伝わる** (`join` では、もう一方のクロージャも、必ず実行される) |
| `spawn` した仕事の中でのパニック | 呼び出し元には、伝わらない。`panic_handler` が、設定されていなければ、プロセスが**中断される** |
| 複数のパニック | 1つだけが、伝わる。残りは、捨てられる |

```rust
use rayon::prelude::*;
use std::panic;

fn main() {
    let result = panic::catch_unwind(|| {
        (0..100).into_par_iter().for_each(|i| {
            if i == 50 {
                panic!("途中で失敗した");
            }
        });
    });

    // 並列の処理の中のパニックは、呼び出し元で、catch_unwind できる
    println!("{}", result.is_err()); // true
}
```

### エラーを返す処理

パニックではなく、`Result` や `Option` で、エラーを返す方が、一般的である。

| メソッド | 内容 |
| --- | --- |
| `try_for_each(f)` | 各要素に処理を行い、`Err` が出たら、早めに止めて、`Err` を返す |
| `try_reduce(identity, op)` | `Result` を返す、`reduce` |
| `try_fold(identity, op)` | `Result` を返す、`fold` |
| `collect::<Result<_, _>>()` | `Err` が出たら、早めに止めて、`Err` を返す |
| `panic_fuse()` | 他の要素でパニックが起きたら、残りの要素の処理を、早めに止める |
| `while_some()` | `None` が出たら、早めに止める |

```rust
use rayon::prelude::*;

fn check(x: &u32) -> Result<(), String> {
    if *x == 7 {
        Err(format!("{x} は使えない"))
    } else {
        Ok(())
    }
}

fn main() {
    let ok: Result<(), String> = (0..5u32).collect::<Vec<_>>().par_iter().try_for_each(check);
    println!("{ok:?}"); // Ok(())

    let err: Result<(), String> = (0..10u32).collect::<Vec<_>>().par_iter().try_for_each(check);
    println!("{err:?}"); // Err("7 は使えない")
}
```

<pre><code class="tips">join では、片方のクロージャがパニックしても、もう一方は、最後まで実行される。そのあとで、パニックが、呼び出し元に伝わる。後始末が必要な処理は、Drop を実装した型に任せると、確実に実行される。</code></pre>

<pre><code class="caution">spawn した仕事の中のパニックは、既定では、プロセス全体を中断する。
サーバーなど、止めたくないプログラムでは、ThreadPoolBuilder の panic_handler を設定するか、仕事の中で catch_unwind する。</code></pre>

---

## 非同期との組み合わせ <a id="async" data-name="非同期との組み合わせ"></a>

非同期のランタイム (tokio など) の中で、CPU を使う重い処理をそのまま実行すると、その間、ランタイムのスレッドが占有されて、他のタスクが、進まなくなる。重い処理は、rayon のプールに任せて、結果を、非同期に受け取る。

### rayon::spawn と oneshot チャネル

```rust
use rayon::prelude::*;
use tokio::sync::oneshot;

/// 重い計算を rayon のプールで実行して、結果を非同期に待つ
async fn heavy_sum(data: Vec<u64>) -> u64 {
    let (tx, rx) = oneshot::channel();

    // rayon のスレッドで、並列に計算する (async のスレッドは、ブロックされない)
    rayon::spawn(move || {
        let sum: u64 = data.par_iter().sum();
        let _ = tx.send(sum);
    });

    rx.await.expect("rayon の仕事が、結果を返す前に、終了した")
}

#[tokio::main]
async fn main() {
    let sum = heavy_sum((1..=1_000_000u64).collect()).await;
    println!("{sum}"); // 500000500000
}
```

### spawn_blocking との比較

```rust
use rayon::prelude::*;

#[tokio::main]
async fn main() {
    let data: Vec<u64> = (1..=1_000_000).collect();

    // tokio の blocking 用のスレッドから、rayon を呼ぶ
    let sum = tokio::task::spawn_blocking(move || data.par_iter().sum::<u64>())
        .await
        .unwrap();

    println!("{sum}"); // 500000500000
}
```

| | `rayon::spawn` + `oneshot` | `tokio::task::spawn_blocking` + rayon |
| --- | --- | --- |
| 待っている間に使うスレッド | なし (rayon のプールだけ) | tokio の blocking 用のスレッドを、1つ占有する |
| 書き方 | チャネルを、自分で用意する | 簡単 |
| 向いている場面 | 重い計算が、頻繁に、大量にある | たまに実行する重い処理 |

<pre><code class="tips">rayon に渡した仕事は、途中で、キャンセルできない。非同期の側で、結果を待つのをやめても、rayon の仕事は、最後まで実行される。長時間かかる処理では、キャンセル用のフラグ (AtomicBool) を、仕事の中で、定期的に確認する設計にする。</code></pre>

<pre><code class="caution">async fn の中で、par_iter や rayon::join を、直接呼ばない。呼び出したスレッドが、結果が出るまで、ブロックされる。
rayon の仕事の中から、tokio の async のコードを待つ (block_on など) のも、避ける。スレッドの役割が混ざって、デッドロックや、性能の低下につながる。</code></pre>

非同期のランタイム自体については、「Tokio」のドキュメントを参照。

---

## 性能の指針 <a id="performance" data-name="性能の指針"></a>

### 計測の例

```rust
use rayon::prelude::*;
use std::time::Instant;

fn is_prime(n: u64) -> bool {
    n >= 2 && (2..).take_while(|i| i * i <= n).all(|i| n % i != 0)
}

fn main() {
    let range = 0..2_000_000u64;

    let t = Instant::now();
    let seq = range.clone().filter(|&n| is_prime(n)).count();
    println!("逐次: {seq} 個, {:?}", t.elapsed());

    let t = Instant::now();
    let par = range.into_par_iter().filter(|&n| is_prime(n)).count();
    println!("並列: {par} 個, {:?}", t.elapsed());

    assert_eq!(seq, par);
}
```

```text
逐次: 148933 個, (経過時間)
並列: 148933 個, (経過時間)
```

個数は、どの環境でも同じになる。経過時間は、CPU のコア数や、ビルドの種類 (`--release`) によって、大きく変わる。コアが複数ある環境では、並列版の方が、コア数に応じて、短くなる。コアが 1 つの環境では、並列化の効果は、出ない。

### 指針

| 指針 | 理由 |
| --- | --- |
| **計測してから並列化する**。`--release` で、逐次と比べる | 並列化で、遅くなることもある |
| 全体の処理時間の、大部分を占める処理を、並列化する | 並列化できない部分が、全体の速度の上限を決める (アムダールの法則) |
| 1要素が軽いときは、`par_chunks` や `with_min_len` で、粒度を粗くする | 分割と受け渡しのコストを、減らす |
| 共有のロックを、避ける。`fold` と `reduce`、`collect` を使う | ロックの競合で、並列の効果が、なくなる |
| 要素ごとの、メモリの確保を、減らす (`map_init`、`flat_map_iter`) | メモリの確保は、スレッド間で、競合しやすい |
| メモリ帯域が、ボトルネックの処理は、期待ほど速くならない | CPU のコアを増やしても、メモリの転送速度は、増えない |
| 隣り合うスレッドが、近いメモリを頻繁に書き換えるのを、避ける | キャッシュラインの競合 (false sharing) で遅くなる |
| 入れ子の並列化は、そのままでよい | ワークスティーリングが、全体で、仕事を分配する |

<pre><code class="caution">グローバルなプールは、最初に使われたときに、スレッドを起動する。1回目の計測だけが、遅くなることがある。
計測は、複数回行い、最初の数回は、ウォームアップとして、捨てる。</code></pre>

<pre><code class="tips">並列化したあとの、結果が正しいかを確認するために、同じ入力で、逐次版と並列版の結果を、比較するテストを書いておく。
性能の継続的な計測には、criterion のようなベンチマークの crate が使える。</code></pre>

---

## 実践例 <a id="practice" data-name="実践例"></a>

### 単語の出現数を数える

大きな文字列を、行ごとに並列に処理して、単語の出現数を数える。仕事ごとに `HashMap` を作り、最後に結合するため、ロックが不要である。

```rust
use rayon::prelude::*;
use std::collections::HashMap;

/// 単語の出現数を、並列に数える
fn word_count(text: &str) -> HashMap<String, usize> {
    text.par_lines()
        .fold(HashMap::new, |mut map, line| {
            for word in line.split_whitespace() {
                *map.entry(word.to_lowercase()).or_insert(0) += 1;
            }
            map
        })
        .reduce(HashMap::new, |mut a, b| {
            for (word, n) in b {
                *a.entry(word).or_insert(0) += n;
            }
            a
        })
}

fn main() {
    let text = "the quick brown fox\nThe lazy dog\nthe end";
    let counts = word_count(text);

    // 出現数の多い順 (同数なら、単語の順) に並べる
    let mut top: Vec<(&String, &usize)> = counts.iter().collect();
    top.sort_by(|a, b| b.1.cmp(a.1).then(a.0.cmp(b.0)));

    for (word, n) in top.iter().take(3) {
        println!("{word}: {n}");
    }
}
```

```text
the: 3
brown: 1
dog: 1
```

### 画像の変換

画素の配列を、並列に変換する。画素ごとに独立した処理なので、`par_iter_mut` で、その場で書き換える。

```rust
use rayon::prelude::*;

/// RGB の画素を、グレースケールに変換する (その場で書き換える)
fn to_grayscale(pixels: &mut [[u8; 3]]) {
    pixels.par_iter_mut().for_each(|p| {
        // 人の目の感度に合わせた、重みづけ (整数で計算する)
        let gray = ((p[0] as u32 * 299 + p[1] as u32 * 587 + p[2] as u32 * 114) / 1000) as u8;
        *p = [gray, gray, gray];
    });
}

fn main() {
    let mut pixels = vec![[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 255]];
    to_grayscale(&mut pixels);
    println!("{pixels:?}"); // [[76, 76, 76], [149, 149, 149], [29, 29, 29], [255, 255, 255]]
}
```

### モンテカルロ法による円周率

乱数で、点を打って、円の内側に入った割合から、円周率を求める。ここでは、乱数の代わりに、添字から、決まった値を作る関数 (SplitMix64) を使い、結果が、スレッド数に依存しないようにしている。

```rust
use rayon::prelude::*;

/// 添字から、疑似乱数を作る (SplitMix64)
fn splitmix64(mut x: u64) -> u64 {
    x = x.wrapping_add(0x9E37_79B9_7F4A_7C15);
    x = (x ^ (x >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    x = (x ^ (x >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    x ^ (x >> 31)
}

/// 0 以上 1 未満の値にする
fn unit(x: u64) -> f64 {
    (x >> 11) as f64 / (1u64 << 53) as f64
}

fn estimate_pi(samples: u64) -> f64 {
    let inside = (0..samples)
        .into_par_iter()
        .filter(|&i| {
            // 添字から、2 つの座標を作る
            let x = unit(splitmix64(2 * i));
            let y = unit(splitmix64(2 * i + 1));
            x * x + y * y <= 1.0
        })
        .count();
    4.0 * inside as f64 / samples as f64
}

fn main() {
    let pi = estimate_pi(10_000_000);
    println!("{pi:.2}"); // 3.14
}
```

<pre><code class="tips">乱数を使う処理を並列化するときは、スレッドごとに、別の乱数生成器を持たせる (map_init で作る) か、この例のように、添字から値を作る。
1つの乱数生成器を、Mutex で共有すると、ロックの競合で、遅くなる。</code></pre>

### 行列の積

行ごとに、独立して計算できる。出力の行を、`par_chunks_mut` で、重ならないように分けて、書き込む。

```rust
use rayon::prelude::*;

/// n × n の行列の積 (a, b, 結果は、行優先の 1 次元配列)
fn matmul(a: &[f64], b: &[f64], n: usize) -> Vec<f64> {
    let mut c = vec![0.0; n * n];

    // 出力の 1 行ごとを、1 つの仕事にする
    c.par_chunks_mut(n).enumerate().for_each(|(i, row)| {
        for k in 0..n {
            let aik = a[i * n + k];
            for j in 0..n {
                row[j] += aik * b[k * n + j];
            }
        }
    });
    c
}

fn main() {
    let a = vec![1.0, 2.0, 3.0, 4.0];
    let b = vec![5.0, 6.0, 7.0, 8.0];
    println!("{:?}", matmul(&a, &b, 2)); // [19.0, 22.0, 43.0, 50.0]
}
```

### 複数のファイルの行数を数える

ファイルの読み込みが失敗する可能性があるため、`Result` を返す、`try_reduce` で集計する。

```rust
use rayon::prelude::*;
use std::fs;
use std::io;
use std::path::PathBuf;

/// すべてのファイルの行数の合計を返す (1 つでも失敗したら、エラー)
fn count_lines(paths: &[PathBuf]) -> io::Result<usize> {
    paths
        .par_iter()
        .map(|p| fs::read_to_string(p).map(|s| s.lines().count()))
        .try_reduce(|| 0, |a, b| Ok(a + b))
}

fn main() -> io::Result<()> {
    // 例のために、一時的なファイルを作る
    let dir = std::env::temp_dir().join("rayon_count_lines");
    fs::create_dir_all(&dir)?;
    let mut paths = Vec::new();
    for i in 0..3 {
        let path = dir.join(format!("{i}.txt"));
        fs::write(&path, "a\nb\nc\n")?;
        paths.push(path);
    }

    println!("{}", count_lines(&paths)?); // 9

    fs::remove_dir_all(&dir)?;
    Ok(())
}
```

<pre><code class="caution">ファイルの読み込みのように、待ち時間のある I/O を、rayon の仕事の中で行うと、そのスレッドは、待っている間、他の仕事を進められない。
I/O が処理の中心なら、rayon ではなく、非同期の I/O や、専用のスレッドを使う。</code></pre>

---

## テスト <a id="test" data-name="テスト"></a>

並列の処理のテストは、結果が、スレッド数や、実行の順序に、依存しないことを確認する。

### 逐次との比較

```rust
use rayon::prelude::*;

/// 並列版
fn sum_of_squares(v: &[u64]) -> u64 {
    v.par_iter().map(|x| x * x).sum()
}

/// 基準にする、逐次版
fn sum_of_squares_seq(v: &[u64]) -> u64 {
    v.iter().map(|x| x * x).sum()
}

fn main() {
    let v: Vec<u64> = (1..=1000).collect();
    println!("{}", sum_of_squares(&v)); // 333833500
}

#[cfg(test)]
mod tests {
    use super::*;
    use rayon::ThreadPoolBuilder;

    #[test]
    fn 並列版が逐次版と同じ結果になる() {
        let v: Vec<u64> = (1..=1000).collect();
        assert_eq!(sum_of_squares(&v), sum_of_squares_seq(&v));
    }

    #[test]
    fn スレッド数に依存しない() {
        let v: Vec<u64> = (1..=1000).collect();
        let expected = sum_of_squares_seq(&v);

        // 1, 2, 8 スレッドの、専用のプールで確認する
        for threads in [1, 2, 8] {
            let pool = ThreadPoolBuilder::new().num_threads(threads).build().unwrap();
            let actual = pool.install(|| sum_of_squares(&v));
            assert_eq!(actual, expected, "スレッド数 {threads} で、結果が異なる");
        }
    }

    #[test]
    fn 空の入力() {
        assert_eq!(sum_of_squares(&[]), 0);
    }
}
```

### テストの観点

| 観点 | 内容 |
| --- | --- |
| 逐次との一致 | 同じ入力で、並列版と逐次版の結果を比べる |
| スレッド数 | 1、2、多数のスレッドの専用のプールで、同じ結果になるか確認する |
| 空と1要素 | 要素が 0 個や 1 個のときも、動作するか |
| 順序 | `collect` した結果の順序が、期待どおりか。順序に依存しない処理は、ソートしてから比べる |
| エラー | `Result` の短絡 (どの `Err` が返るかは、決まっていない) を、テストに書くときは、`Err` かどうかだけを確認する |
| 時間 | 実行時間を `assert` しない (環境で変わる) |

<pre><code class="tips">スレッド数を 1 にして実行すると、短絡する処理 (any、find_any、collect::&lt;Result&gt;) の動作が、決まった順序になり、テストしやすい。
cargo test を、環境変数 RAYON_NUM_THREADS=1 付きで実行する方法や、専用のプールで num_threads(1) を指定する方法がある。</code></pre>

テストの書き方全般は、「Rustのテスト」のドキュメントを参照。

---

## 古いコードからの変更 <a id="migration" data-name="古いコードからの変更"></a>

古い記事や、古いコードに残っている、非推奨の書き方と、現在の対応。

| 古い書き方 | 現在 | バージョン |
| --- | --- | --- |
| `par_iter.find(p)` | `find_any(p)` / `find_first(p)` / `find_last(p)` | 非推奨 (順序が保証されないため) |
| `par_iter.position(p)` | `position_any(p)` / `position_first(p)` / `position_last(p)` | 非推奨 |
| `iter::repeatn(x, n)` | `iter::repeat_n(x, n)` | 1.11 |
| `ThreadPool::new(Configuration::new())` | `ThreadPoolBuilder::new().build()` | 非推奨 |
| `rayon::Configuration` | `ThreadPoolBuilder` | 非推奨 |
| `rayon::initialize(config)` | `ThreadPoolBuilder::build_global()` | 非推奨 |
| `breadth_first` のオプション | `spawn_fifo`、`scope_fifo` | 非推奨 |
| スレッド数の既定値が、`num_cpus` crate の値 | `std::thread::available_parallelism` の値 | 1.8 |

| rayon のバージョン | 最小の Rust のバージョン |
| --- | --- |
| 1.12 / 1.11 | 1.80 |
| 1.10 〜 1.8 | 1.63 |
| 1.7 | 1.59 |

<pre><code class="caution">rayon 1.11 から、最小の Rust のバージョンが 1.80 になった。古い Rust のツールチェーンを使うプロジェクトでは、rayon を 1.10 に固定する必要がある (cargo update rayon --precise 1.10.0)。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `par_iter` にしたら、逐次より遅い | 要素数が少ない、または、1要素の処理が軽い。または、デバッグビルドで計測している | `--release` で計測する。`par_chunks` や `with_min_len` で、粒度を粗くする |
| `Rc<...>` cannot be shared between threads safely | `Rc` や `RefCell` が、並列の処理に、含まれている | `Arc` と `Mutex` に置き換える。または、共有しない設計にする |
| `cannot borrow ... as mutable more than once` | 複数のクロージャで、同じデータを可変に借用している | `split_at_mut` や `par_chunks_mut` で、重ならない部分に分ける。または、`fold` と `reduce` を使う |
| 結果の並びが、実行ごとに違う | `for_each` の中で、共有した `Vec` に `push` している | `collect` で結果を集める。または、集めたあとで、ソートする |
| 浮動小数点の合計が、逐次とわずかに違う | 足す順序が、並列では、変わる | 許容誤差で比較する。固定の大きさの `par_chunks` で、部分和を作って、逐次に足す |
| `reduce` の結果が、毎回違う | 演算が、結合法則を満たしていない (引き算など) | 結合法則を満たす演算にする。または、順序を保って、逐次に畳み込む |
| 並列の処理の中で、デッドロックする | `Mutex` のロックを持ったまま、並列処理を呼んでいる。または、`join` の中で、別のクロージャを、チャネルで待っている | ロックの範囲を短くする。仕事どうしで、待ち合わないようにする |
| `build_global` が、エラーになる | すでに、グローバルなプールが、作られている (2回目の呼び出し、または、rayon の機能を使ったあと) | プログラムの最初で、1回だけ呼ぶ。または、専用のプールを使う |
| 非同期のプログラムが、固まる | `async fn` の中で、`par_iter` などを、直接呼んでいる | `rayon::spawn` と `oneshot`、または `spawn_blocking` を使う |
| `spawn` の中のパニックで、プロセスが終了した | `panic_handler` が、設定されていない (既定では、中断する) | `ThreadPoolBuilder::panic_handler` を設定する。または、仕事の中で、`catch_unwind` する |
| `find` や `position` で、警告が出る | 並列では、「最初の」要素の保証がなく、非推奨になった | `find_any`、`find_first` などに変える |
| コレクションを `Result` に集めたとき、返るエラーが、実行ごとに違う | 短絡では、どのエラーが先に見つかるか、決まっていない | 先に、すべてを `Vec<Result<_, _>>` に集めて、逐次に調べる |
| CPU を使い切れない | I/O の待ちが多い。または、メモリ帯域が、ボトルネック | 非同期 I/O や、専用のスレッドを使う。メモリ帯域の場合は、並列化を減らす |

---

## 関連 crate <a id="related" data-name="関連crate"></a>

| crate | 用途 |
| --- | --- |
| `rayon-core` | rayon のスレッドプールの部分 (`join`、`scope`、`ThreadPool`) だけを含む。並列イテレーターは、含まない |
| `crossbeam` | スレッド間の通信 (チャネル、ワークスティーリングのキュー) など、低水準の並行処理の部品 |
| `dashmap` | 複数のスレッドから、同時に更新できる `HashMap` |
| `tokio` | 非同期のランタイム。重い計算は、`spawn_blocking` や rayon に任せる |
| `wasm-bindgen-rayon` | WebAssembly (ブラウザ) で、rayon を使うための、アダプター |
| `rayon-cond` | 条件によって、並列と逐次を、切り替えられるイテレーター |
| `indicatif` | 進捗バー。フィーチャーで、並列イテレーターの進捗表示に対応する (各 crate のドキュメントを確認) |
| `ndarray` / `hashbrown` / `polars` | 多次元配列、ハッシュマップ、データフレーム。フィーチャーなどで、rayon を使った並列処理に対応する (各 crate のドキュメントを確認) |
| `paralight` / `orx-parallel` | rayon とは別の、データ並列のライブラリ |
