---
title: Rust Test
layout: default
---

# Rustのテスト <a id="top" data-name="TOP"></a>

Rust は、テストの仕組みが、言語と cargo に組み込まれている。外部のテストフレームワークを入れなくても、`#[test]` と `cargo test` だけで、テストを書いて、実行できる。

| 種類 | 置き場所 | 対象 | 実行 |
| --- | --- | --- | --- |
| 単体テスト | `src/` の中 (`#[cfg(test)]`) | 関数やモジュール (非公開のものも含む) | `cargo test` |
| 結合テスト | `tests/` ディレクトリ | 公開 API を、外部から使う | `cargo test` |
| ドキュメントテスト | `///` コメントのコード | ドキュメントのサンプルコードが、動くこと | `cargo test` (`--doc`) |
| ベンチマーク | `benches/` ディレクトリ | 実行速度 | `cargo bench` |

---

## 基本 <a id="basic" data-name="基本"></a>

### 最初のテスト

`#[test]` を付けた関数が、テストになる。関数がパニックせずに終われば成功、パニックすれば失敗。

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*; // 親モジュールの関数を、使えるようにする

    #[test]
    fn add_works() {
        assert_eq!(add(2, 3), 5);
    }
}
```

```bash
cargo test
```

```text
running 1 test
test tests::add_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

| 要素 | 説明 |
| --- | --- |
| `#[test]` | この関数を、テストとして登録する。引数と戻り値は、なし (または `Result`) |
| `#[cfg(test)]` | `cargo test` のときだけ、このモジュールをコンパイルする (通常のビルドには、含まれない) |
| `use super::*;` | 親モジュール (テスト対象のコード) の中身を、読み込む |

### assert マクロ

| マクロ | 成功の条件 |
| --- | --- |
| `assert!(条件)` | 条件が `true` |
| `assert_eq!(左, 右)` | 左と右が等しい (`==`) |
| `assert_ne!(左, 右)` | 左と右が等しくない (`!=`) |
| `debug_assert!` など | デバッグビルドのときだけ検査する (リリースビルドでは、無視される) |

失敗したときの、メッセージを指定できる。

```rust
let result = add(2, 2);
assert_eq!(result, 5, "2 + 2 の結果が違う: {}", result);
```

```text
thread 'tests::add_works' panicked at src/lib.rs:10:9:
assertion `left == right` failed: 2 + 2 の結果が違う: 4
  left: 4
 right: 5
```

<pre><code class="caution">assert_eq! や assert_ne! を使う型には、Debug (失敗時に値を表示するため) と PartialEq (比較するため) が必要。
自作の構造体や enum は、#[derive(Debug, PartialEq)] を付ける。</code></pre>

### パニックすることを確認する

`#[should_panic]` を付けると、パニックしたときに成功になる。

```rust
fn divide(a: i32, b: i32) -> i32 {
    if b == 0 {
        panic!("ゼロで割ることはできません");
    }
    a / b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "ゼロで割ることはできません")]
    fn divide_by_zero_panics() {
        divide(1, 0);
    }
}
```

<pre><code class="tips">expected を指定すると、パニックのメッセージに、その文字列が含まれるときだけ成功になる。
指定しないと、まったく別の原因のパニック (バグ) でも、成功になってしまう。</code></pre>

### Result を返すテスト

テストは、`Result` を返せる。`Err` が返ると失敗になるため、`?` 演算子が使える。

```rust
#[test]
fn parse_works() -> Result<(), std::num::ParseIntError> {
    let n: i32 = "42".parse()?;
    assert_eq!(n, 42);
    Ok(())
}
```

`Box<dyn Error>` を使うと、複数の種類のエラーを、まとめて扱える。

```rust
#[test]
fn load_works() -> Result<(), Box<dyn std::error::Error>> {
    let text = std::fs::read_to_string("Cargo.toml")?;
    assert!(text.contains("[package]"));
    Ok(())
}
```

<pre><code class="caution">#[should_panic] は、Result を返すテストには付けられない。</code></pre>

### テストを除外する

時間のかかるテストなどには、`#[ignore]` を付けて、通常の実行から外す。

```rust
#[test]
#[ignore = "ネットワークが必要"]
fn calls_external_api() {
    // ...
}
```

```bash
cargo test                      # ignore したテストは、実行されない
cargo test -- --ignored         # ignore したテストだけを、実行する
cargo test -- --include-ignored # すべてを、実行する
```

### テストの実行の仕組み

- 各テストは、**別々のスレッドで、並列に**実行される。
- パニックしたテストは、失敗になる。他のテストには影響しない。
- 標準出力 (`println!`) は、既定ではキャプチャされ、**失敗したテストの分だけ**表示される。
- テストの実行順序は、保証されない。

---

## cargo test の使い方 <a id="cargo-test" data-name="cargo testの使い方"></a>

### 絞り込み

```bash
cargo test                       # すべてのテストを実行
cargo test add                   # 名前に add を含むテストだけを実行
cargo test tests::add_works -- --exact   # 名前が完全に一致するテストだけを実行
cargo test -- --skip slow        # 名前に slow を含むテストを、除外
cargo test -- --list             # テストの一覧を表示 (実行はしない)
```

### 引数の区切り (--)

`cargo test` の引数は、`--` で2つに分かれる。

```text
cargo test [cargo の引数] -- [テスト本体 (テストバイナリ) の引数]
```

| 位置 | 例 |
| --- | --- |
| `--` の前 (cargo の引数) | `--lib`、`--test api_test`、`--doc`、`-p my-crate`、`--workspace`、`--release`、`--all-features` |
| `--` の後 (テスト本体の引数) | `--nocapture`、`--test-threads=1`、`--ignored`、`--exact`、`--skip` |

### 主なオプション

| オプション | 説明 |
| --- | --- |
| `-- --nocapture` | 出力をキャプチャせず、`println!` を、その場で表示する |
| `-- --show-output` | 成功したテストの出力も、最後にまとめて表示する |
| `-- --test-threads=1` | テストを、1つずつ順番に実行する |
| `--lib` | ライブラリの単体テストだけ |
| `--bins` | バイナリの単体テストだけ |
| `--test 名前` | `tests/名前.rs` の、結合テストだけ |
| `--tests` | 単体テストと結合テストだけ (ドキュメントテストは、除く) |
| `--doc` | ドキュメントテストだけ |
| `-p クレート名` | ワークスペースの、特定のクレートだけ |
| `--workspace` | ワークスペース全体 |
| `--no-fail-fast` | 失敗があっても、他のテストバイナリを実行し続ける |
| `--no-run` | ビルドだけして、実行しない |
| `--release` | 最適化ビルドで、実行する |
| `--all-features` | すべてのフィーチャーを、有効にする |

```bash
# パニックの場所を、詳しく表示する
RUST_BACKTRACE=1 cargo test
```

<pre><code class="tips">cargo test は、単体テスト → 結合テスト → ドキュメントテストの順に実行する。
既定では、あるテストバイナリが失敗すると、後続のテストバイナリは実行されない。すべて実行して、失敗を一覧で見たいときは --no-fail-fast を付ける。</code></pre>

---

## テストの配置と種類 <a id="kinds" data-name="テストの配置と種類"></a>

### 単体テスト

テスト対象のコードと、同じファイルの中に、`#[cfg(test)]` のモジュールとして書く。

```rust
// src/lib.rs
pub fn add(a: i32, b: i32) -> i32 {
    helper(a) + b
}

// 非公開の関数
fn helper(x: i32) -> i32 {
    x
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_works() {
        assert_eq!(add(1, 2), 3);
    }

    // 子モジュールなので、非公開の関数もテストできる
    #[test]
    fn helper_works() {
        assert_eq!(helper(5), 5);
    }
}
```

テストモジュールは、親モジュールの子になるため、**非公開 (`pub` でない) の関数も、テストできる**。

### 結合テスト

プロジェクト直下の `tests/` ディレクトリに、ファイルを置く。ライブラリを、**外部の利用者と同じ立場で**使うテスト。

```text
my-crate/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   └── main.rs
└── tests/
    ├── api_test.rs
    └── common/
        └── mod.rs
```

```rust
// tests/api_test.rs
use my_crate::add; // クレート名で、公開 API を読み込む

mod common;

#[test]
fn add_from_outside() {
    common::setup();
    assert_eq!(add(1, 2), 3);
}
```

```rust
// tests/common/mod.rs (共通のヘルパー)
pub fn setup() {
    // 共通の準備
}
```

| 項目 | 内容 |
| --- | --- |
| `#[cfg(test)]` | 不要 (`tests/` は、`cargo test` のときだけビルドされる) |
| 使える API | 公開 (`pub`) のものだけ |
| 1ファイル = 1クレート | `tests/` の直下の各ファイルは、別々のクレート (テストバイナリ) としてビルドされる |
| 共通のコード | `tests/common/mod.rs` のように、サブディレクトリに置く (`tests/common.rs` にすると、テストファイルとして扱われてしまう) |

<pre><code class="caution">バイナリクレート (src/main.rs だけ) の関数は、tests/ から use できない。
ロジックを src/lib.rs に移して、main.rs は、lib を呼ぶだけの薄いコードにすると、結合テストを書ける。</code></pre>

<pre><code class="tips">tests/ 直下のファイルが増えると、ファイルごとにビルドとリンクが走り、遅くなる。
tests/it/main.rs を1つ作り、他のファイルを、そのモジュール (mod a; mod b;) にすると、1つのバイナリにまとまる。</code></pre>

### ドキュメントテスト

`///` のドキュメントコメントに書いた、コードブロックが、テストとして実行される。サンプルコードが、古くならないことを保証できる。

<pre><code class="example">/// 2 つの数を足す。
///
/// # Examples
///
/// ```
/// use my_crate::add;
///
/// assert_eq!(add(1, 2), 3);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}</code></pre>

```bash
cargo test --doc
```

#### コードブロックの属性

| 属性 | 動作 |
| --- | --- |
| (なし) | コンパイルして、実行する |
| `no_run` | コンパイルだけして、実行しない (ネットワークに接続するコードなど) |
| `ignore` | テストの対象から外す |
| `should_panic` | パニックしたときに、成功とする |
| `compile_fail` | コンパイルに失敗したときに、成功とする |

<pre><code class="example">/// ```no_run
/// let body = reqwest::blocking::get("https://example.com")?.text()?;
/// # Ok::&lt;(), Box&lt;dyn std::error::Error&gt;&gt;(())
/// ```</code></pre>

#### 隠し行

`# ` (シャープとスペース) で始まる行は、ドキュメントには表示されないが、テストでは実行される。サンプルの準備や、`?` を使うための、お決まりのコードを隠すのに使う。

<pre><code class="example">/// ```
/// # use my_crate::parse;   // この行は、ドキュメントに表示されない
/// let n = parse("42")?;
/// assert_eq!(n, 42);
/// # Ok::&lt;(), std::num::ParseIntError&gt;(())
/// ```</code></pre>

<pre><code class="caution">ドキュメントテストは、ライブラリクレート (src/lib.rs) だけが対象。バイナリクレートのドキュメントは、テストされない。</code></pre>

---

## テストの書き方 <a id="writing" data-name="テストの書き方"></a>

### 指針

| 指針 | 内容 |
| --- | --- |
| 1テスト 1観点 | 1つのテストでは、1つの振る舞いを確認する。失敗したとき、何が壊れたか分かる |
| 名前で意図を伝える | `divide_by_zero_returns_error` のように、「何をしたら、どうなるか」が分かる名前にする |
| 準備・実行・確認 | Arrange (準備) → Act (実行) → Assert (確認) の順に書くと、読みやすい |
| 実装ではなく振る舞い | 内部の実装の詳細ではなく、公開された振る舞い (入力と出力) を確認する |
| 正常系と異常系 | 正しい入力だけでなく、境界値 (0、最大値、空) と、エラーになる入力も確認する |
| 外部への依存を分ける | 時刻、乱数、ネットワーク、ファイルは、差し替えられるようにして、結果を固定する |

```rust
#[test]
fn withdraw_reduces_balance() {
    // Arrange: 準備
    let mut account = Account::new(1000);

    // Act: 実行
    account.withdraw(300).unwrap();

    // Assert: 確認
    assert_eq!(account.balance(), 700);
}
```

### エラーを確認する

`Result` が `Err` になることや、エラーの種類を確認する。

```rust
#[derive(Debug, PartialEq)]
enum DivError {
    DivideByZero,
}

fn divide(a: i32, b: i32) -> Result<i32, DivError> {
    if b == 0 {
        Err(DivError::DivideByZero)
    } else {
        Ok(a / b)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn divide_ok() {
        assert_eq!(divide(6, 3), Ok(2));
    }

    #[test]
    fn divide_by_zero_is_error() {
        // PartialEq を実装していれば、そのまま比較できる
        assert_eq!(divide(1, 0), Err(DivError::DivideByZero));
    }

    #[test]
    fn divide_by_zero_with_matches() {
        // PartialEq がない型でも、パターンで確認できる
        let result = divide(1, 0);
        assert!(matches!(result, Err(DivError::DivideByZero)));
    }
}
```

| 確認の方法 | 使う場面 |
| --- | --- |
| `assert_eq!(result, Err(...))` | エラーの型が `PartialEq` を実装しているとき |
| `assert!(matches!(...))` | パターンで確認したいとき (値の一部だけを見る、`if` のガードを付けるなど) |
| `result.is_err()` / `is_ok()` | 成功か失敗かだけを確認する |
| `result.unwrap_err()` | `Err` の中身を取り出して、さらに検証する |

### 浮動小数点数の比較

浮動小数点数は、誤差があるため、`assert_eq!` で比較してはいけない。許容する誤差を決めて、比較する。

```rust
#[test]
fn float_compare() {
    let x = 0.1 + 0.2;

    // assert_eq!(x, 0.3);  // 失敗する (x は 0.30000000000000004)
    assert!((x - 0.3).abs() < 1e-10);
}
```

誤差を含む比較を、簡単に書きたい場合は、`approx` crate の `assert_relative_eq!` や `assert_abs_diff_eq!` が使える。

### 複数のケースをまとめて確認する

入力と期待する結果を、配列にまとめて、ループで確認できる。

```rust
#[test]
fn fizzbuzz_cases() {
    let cases = [
        (1, "1"),
        (3, "Fizz"),
        (5, "Buzz"),
        (15, "FizzBuzz"),
    ];

    for (input, expected) in cases {
        // どの入力で失敗したか分かるように、メッセージを付ける
        assert_eq!(fizzbuzz(input), expected, "input = {}", input);
    }
}
```

ループの中で1つ失敗すると、以降のケースは確認されない。ケースごとに別のテストとして扱いたい場合は、後述の `rstest` を使う。

### 準備と後片付け

Rust のテストには、`setUp` / `tearDown` のような専用の仕組みはない。関数と、`Drop` (値が破棄されるときの処理) で書く。

```rust
struct TestEnv {
    // テスト用のリソース
}

impl TestEnv {
    fn new() -> Self {
        // 準備
        TestEnv {}
    }
}

impl Drop for TestEnv {
    fn drop(&mut self) {
        // 後片付け (テストが、失敗しても、必ず呼ばれる)
    }
}

#[test]
fn uses_env() {
    let _env = TestEnv::new(); // スコープを抜けると、drop が呼ばれる
    // ...
}
```

重い準備を、複数のテストで共有したい場合は、`LazyLock` (Rust 1.80 以降) や `OnceLock` で、最初の1回だけ実行できる。

```rust
use std::sync::LazyLock;

static TEST_DATA: LazyLock<Vec<i32>> = LazyLock::new(|| {
    // 最初に使われたときだけ、実行される
    (1..=100).collect()
});

#[test]
fn uses_shared_data() {
    assert_eq!(TEST_DATA.len(), 100);
}
```

### テスト専用の依存

テストでだけ使う crate は、`[dev-dependencies]` に書く。通常のビルドには、含まれない。

```bash
cargo add --dev rstest
```

```toml
[dev-dependencies]
rstest = "..."   # cargo add --dev が、バージョンを入れる
```

---

## 非同期のテスト <a id="async" data-name="非同期のテスト"></a>

`async fn` をテストするには、`#[test]` ではなく、ランタイムを用意するマクロを使う。Tokio なら `#[tokio::test]`。

```toml
[dev-dependencies]
tokio = { version = "1", features = ["macros", "rt", "rt-multi-thread", "time", "test-util"] }
```

```rust
async fn fetch_value() -> u32 {
    tokio::time::sleep(std::time::Duration::from_millis(10)).await;
    42
}

#[tokio::test]
async fn fetch_value_works() {
    assert_eq!(fetch_value().await, 42);
}
```

| 書き方 | ランタイム |
| --- | --- |
| `#[tokio::test]` | 1スレッドのランタイム (既定)。テストごとに、新しく作られる |
| `#[tokio::test(flavor = "multi_thread", worker_threads = 2)]` | マルチスレッド |
| `#[tokio::test(start_paused = true)]` | 時間を止めた状態で始める (`test-util` が必要) |

### 時間を扱うテスト

`start_paused = true` にすると、待つ時間が、**実際には経過せず**、すぐに進む。`sleep` や `timeout` を含む処理を、一瞬でテストできる。

```rust
use tokio::time::{sleep, timeout, Duration};

#[tokio::test(start_paused = true)]
async fn timeout_fires() {
    let result = timeout(Duration::from_secs(5), sleep(Duration::from_secs(10))).await;
    assert!(result.is_err()); // 実際の待ち時間は、ほぼ 0
}
```

<pre><code class="tips">#[tokio::test] を付け忘れて、async fn に #[test] だけを付けると、コンパイルエラーになる (async fn は、そのままではテストにできない)。
Tokio のランタイムやタスクの詳細は、Tokio のドキュメントを参照。</code></pre>

---

## テストダブルとモック <a id="mock" data-name="テストダブルとモック"></a>

テスト対象が、時刻、データベース、外部 API などに依存していると、テストの結果が安定しない。**トレイトで抽象化して、テストでは偽物に差し替える**のが、Rust での基本。

### トレイトで差し替える (手書きの偽物)

```rust
trait Clock {
    fn now(&self) -> u64;
}

struct SystemClock;

impl Clock for SystemClock {
    fn now(&self) -> u64 {
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs()
    }
}

// 時計を、外から受け取る
fn is_expired(clock: &impl Clock, expires_at: u64) -> bool {
    clock.now() >= expires_at
}

#[cfg(test)]
mod tests {
    use super::*;

    // テスト用の、時刻が固定された時計
    struct FixedClock(u64);

    impl Clock for FixedClock {
        fn now(&self) -> u64 {
            self.0
        }
    }

    #[test]
    fn expired_after_deadline() {
        assert!(is_expired(&FixedClock(100), 100));
        assert!(!is_expired(&FixedClock(99), 100));
    }
}
```

### mockall

トレイトに `#[automock]` を付けると、モック (`Mock` + トレイト名の構造体) が、自動で作られる。

```bash
cargo add --dev mockall
```

```rust
use mockall::{automock, predicate::*};

#[automock]
trait UserRepo {
    fn find(&self, id: u32) -> Option<String>;
}

fn greeting(repo: &impl UserRepo, id: u32) -> String {
    match repo.find(id) {
        Some(name) => format!("Hello, {}!", name),
        None => "Hello, guest!".to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn greets_existing_user() {
        let mut mock = MockUserRepo::new();
        mock.expect_find()
            .with(eq(1))      // 引数が 1 のときの、期待を定義する
            .times(1)         // ちょうど 1 回呼ばれること
            .returning(|_| Some("Alice".to_string()));

        assert_eq!(greeting(&mock, 1), "Hello, Alice!");
    }

    #[test]
    fn greets_guest_when_not_found() {
        let mut mock = MockUserRepo::new();
        mock.expect_find().returning(|_| None);

        assert_eq!(greeting(&mock, 99), "Hello, guest!");
    }
}
```

| メソッド | 説明 |
| --- | --- |
| `expect_メソッド名()` | そのメソッドの期待を定義する |
| `.with(条件)` | 引数の条件 (`eq(1)` など) |
| `.times(n)` / `.never()` | 呼ばれる回数 (期待と違うと、テストが失敗する) |
| `.returning(クロージャ)` | 戻り値を、引数から計算して返す |
| `.return_const(値)` | 固定の値を返す |

### 外部の HTTP API のモック

| crate | 特徴 |
| --- | --- |
| `wiremock` | 非同期のモックサーバー。リクエストの条件と、レスポンスを定義する |
| `httpmock` | モックサーバーを起動して、リクエストを検証する |
| `mockito` | 軽量なモックサーバー |

---

## パラメータ化テスト <a id="rstest" data-name="パラメータ化テスト"></a>

`rstest` crate を使うと、同じテストを、複数の入力で、**別々のテストとして**実行できる。

```bash
cargo add --dev rstest
```

```rust
use rstest::rstest;

#[rstest]
#[case(1, 1)]
#[case(2, 4)]
#[case(3, 9)]
fn square_works(#[case] input: i32, #[case] expected: i32) {
    assert_eq!(input * input, expected);
}
```

```text
test square_works::case_1 ... ok
test square_works::case_2 ... ok
test square_works::case_3 ... ok
```

### 組み合わせ (values)

```rust
use rstest::rstest;

// 2 × 2 = 4 通りの組み合わせが、すべて実行される
#[rstest]
fn add_is_commutative(
    #[values(1, 2)] a: i32,
    #[values(3, 4)] b: i32,
) {
    assert_eq!(a + b, b + a);
}
```

### フィクスチャ

`#[fixture]` で準備用の関数を定義して、テストの引数に、同じ名前で受け取る。

```rust
use rstest::{fixture, rstest};

#[fixture]
fn users() -> Vec<&'static str> {
    vec!["Alice", "Bob"]
}

#[rstest]
fn has_two_users(users: Vec<&str>) {
    assert_eq!(users.len(), 2);
}
```

---

## プロパティベーステスト <a id="proptest" data-name="プロパティベーステスト"></a>

具体的な入力と結果を書く代わりに、「**どんな入力でも成り立つ性質**」を書いて、ランダムな入力で検証する。人間が思いつかない入力 (境界値や、特殊な値) で、バグを見つけやすい。

```bash
cargo add --dev proptest
```

```rust
use proptest::prelude::*;

proptest! {
    // 性質: 2 回反転すると、元に戻る
    #[test]
    fn reverse_twice_is_identity(v in prop::collection::vec(any::<i32>(), 0..100)) {
        let mut w = v.clone();
        w.reverse();
        w.reverse();
        prop_assert_eq!(v, w);
    }

    // 性質: 数値を文字列にして、パースすると、元に戻る
    #[test]
    fn parse_roundtrip(n in any::<i32>()) {
        let s = n.to_string();
        prop_assert_eq!(s.parse::<i32>().unwrap(), n);
    }
}
```

| 項目 | 説明 |
| --- | --- |
| `any::<T>()` | 型 `T` の、任意の値を生成する |
| `0..100` | 範囲を指定する |
| `"[a-z]{1,10}"` | 正規表現に合う文字列を生成する |
| `prop::collection::vec(戦略, 範囲)` | 指定した長さの範囲の、`Vec` を生成する |
| `prop_assert!` / `prop_assert_eq!` | proptest 用の assert (失敗の縮小のために使う) |
| `prop_assume!(条件)` | 条件を満たさない入力を、読み飛ばす |

- **縮小 (shrinking)**: 失敗する入力が見つかると、proptest は、失敗する最小の入力まで、自動で小さくして報告する。
- 失敗した入力は、`proptest-regressions/` ディレクトリに保存され、次回以降も、必ず再現される (リポジトリに、含めておく)。

### よく使う性質

| 性質 | 例 |
| --- | --- |
| 往復 (round-trip) | エンコードして、デコードすると、元に戻る |
| 冪等 (idempotent) | 同じ操作を、2回行っても、結果が変わらない (`sort` を2回など) |
| 不変条件 | 並び替えても、要素の数と中身は、変わらない |
| 基準との比較 | 最適化した実装と、単純な実装の結果が、一致する |

---

## スナップショットテスト <a id="insta" data-name="スナップショットテスト"></a>

複雑な出力 (文字列、JSON、構造体など) を、**ファイルに保存した、前回の結果**と比較する。期待値を、手で書かなくてよい。

```bash
cargo add --dev insta
cargo install cargo-insta
```

```rust
#[test]
fn render_matches_snapshot() {
    let output = render_report();
    insta::assert_snapshot!(output);
}
```

| 手順 | 内容 |
| --- | --- |
| 1 | 初回の実行では、保存済みの結果がないため、テストは失敗して、`.snap.new` ファイルが作られる |
| 2 | `cargo insta review` で、差分を確認して、承認 (accept) または却下 (reject) する |
| 3 | 承認すると、`snapshots/` に `.snap` ファイルが保存される。**リポジトリに含める** |
| 4 | 以降は、出力が変わると、テストが失敗する。意図した変更なら、再度 review して承認する |

`assert_debug_snapshot!` (Debug 形式)、`assert_json_snapshot!` (JSON 形式。`json` フィーチャーが必要) なども使える。

---

## 補助的な crate <a id="helpers" data-name="補助的なcrate"></a>

| crate | 用途 |
| --- | --- |
| `tempfile` | 一時ファイルや一時ディレクトリ (破棄されると、自動で削除される) |
| `assert_cmd` + `predicates` | コマンドラインツールを、実際に実行してテストする |
| `pretty_assertions` | `assert_eq!` の失敗時の差分を、色付きで見やすくする |
| `serial_test` | 特定のテストを、直列に実行する |
| `approx` | 浮動小数点数の、誤差を含む比較 |
| `testcontainers` | テスト用に、Docker のコンテナ (DB など) を起動する |
| `fake` | テスト用の、ダミーデータの生成 |

### tempfile

```rust
use tempfile::tempdir;

#[test]
fn writes_file() -> std::io::Result<()> {
    let dir = tempdir()?;                       // 一時ディレクトリを作る
    let path = dir.path().join("a.txt");

    std::fs::write(&path, "hello")?;
    assert_eq!(std::fs::read_to_string(&path)?, "hello");

    Ok(())
} // dir が破棄されるときに、ディレクトリも削除される
```

### assert_cmd (CLI のテスト)

ツールを実際に起動して、終了コードや出力を確認する。結合テスト (`tests/`) に書く。

```bash
cargo add --dev assert_cmd predicates
```

```rust
// tests/cli.rs
use assert_cmd::cargo::cargo_bin_cmd;
use predicates::prelude::*;

#[test]
fn prints_help() {
    cargo_bin_cmd!("myapp") // Cargo.toml のバイナリ名
        .arg("--help")
        .assert()
        .success()
        .stdout(predicate::str::contains("Usage"));
}

#[test]
fn fails_with_unknown_option() {
    cargo_bin_cmd!("myapp")
        .arg("--unknown")
        .assert()
        .failure()
        .stderr(predicate::str::contains("error"));
}
```

<pre><code class="caution">古い記事にある Command::cargo_bin("myapp") は、現在は非推奨になっている (将来の cargo で、ビルドの出力先が変わったときに、動かなくなるため)。
代わりに、cargo_bin_cmd! マクロを使う。このマクロは、結合テスト (tests/) とベンチマークの中でだけ使える。</code></pre>

### pretty_assertions

```rust
#[cfg(test)]
mod tests {
    use pretty_assertions::assert_eq; // 標準の assert_eq! を、差し替える

    #[test]
    fn compares_structs() {
        assert_eq!(build_expected(), build_actual()); // 失敗時に、差分が見やすい
    }
}
```

---

## 並列実行と共有状態 <a id="parallel" data-name="並列実行と共有状態"></a>

テストは並列に実行されるため、**テスト同士が共有する状態**があると、実行のたびに結果が変わる (不安定なテスト) 原因になる。

| 共有されるもの | 問題 | 対処 |
| --- | --- | --- |
| ファイル | 同じパスに、複数のテストが書き込む | `tempfile` で、テストごとに別のパスを使う |
| 環境変数 | プロセス全体で共有される | 直列に実行する、または環境変数に頼らない設計にする |
| ポート | 同じポートを、複数のテストが使う | ポート 0 を指定して、OS に空いているポートを選ばせる |
| `static` の値 | テスト間で、状態が引き継がれる | 状態を持たない設計にする。または直列に実行する |
| データベース | 同じテーブルを、複数のテストが書き換える | テストごとに、別のスキーマや DB を作る (トランザクションを、巻き戻す) |

### 直列に実行する

```bash
# すべてのテストを、1 つずつ実行 (遅くなる)
cargo test -- --test-threads=1
```

特定のテストだけを直列にするなら、`serial_test` を使う。

```rust
use serial_test::serial;

#[test]
#[serial]
fn test_a() {
    // #[serial] を付けたテストは、同時には実行されない
}

#[test]
#[serial]
fn test_b() {
    // ...
}
```

### 環境変数

<pre><code class="caution">Rust 2024 エディションでは、std::env::set_var と remove_var は unsafe になった (他のスレッドが環境変数を読んでいると、未定義動作になりうるため)。
並列に実行されるテストの中で、環境変数を書き換えるのは避ける。必要なら、serial_test などで直列にして、unsafe ブロックで囲む。</code></pre>

```rust
#[test]
#[serial_test::serial]
fn reads_env() {
    // Rust 2024 エディションでは、unsafe が必要
    unsafe {
        std::env::set_var("APP_MODE", "test");
    }
    // ...
}
```

### 乱数や時刻

乱数や時刻に依存するコードは、**シードを固定した乱数生成器**や、**固定した時計**を、引数で受け取る設計にすると、再現できるテストになる。

```rust
use rand::{rngs::StdRng, RngExt, SeedableRng};

fn roll(rng: &mut impl RngExt) -> u32 {
    rng.random_range(1..=6)
}

#[test]
fn roll_is_in_range() {
    let mut rng = StdRng::seed_from_u64(42);
    for _ in 0..1000 {
        assert!((1..=6).contains(&roll(&mut rng)));
    }
}
```

---

## ベンチマーク <a id="bench" data-name="ベンチマーク"></a>

標準の `cargo bench` と `#[bench]` は、nightly 版の Rust でしか使えない。stable の Rust では、`criterion` や `divan` を使う。

| crate | 特徴 |
| --- | --- |
| `criterion` | 統計的な分析、過去の結果との比較、回帰の検出、HTML レポート。定番 |
| `divan` | `#[divan::bench]` 属性で書ける、少ない記述の、新しいベンチマーク crate |

### criterion

```bash
cargo add --dev criterion
```

```toml
# Cargo.toml: 標準のテストハーネスを、無効にする
[[bench]]
name = "fib_bench"
harness = false
```

```rust
// benches/fib_bench.rs
use criterion::{criterion_group, criterion_main, Criterion};
use std::hint::black_box;

fn fib(n: u64) -> u64 {
    if n < 2 { n } else { fib(n - 1) + fib(n - 2) }
}

fn bench_fib(c: &mut Criterion) {
    // black_box で、コンパイラの最適化による、計算の省略を防ぐ
    c.bench_function("fib 20", |b| b.iter(|| fib(black_box(20))));
}

criterion_group!(benches, bench_fib);
criterion_main!(benches);
```

```bash
cargo bench
```

### divan

```toml
[[bench]]
name = "fib_bench"
harness = false
```

```rust
// benches/fib_bench.rs
fn main() {
    divan::main();
}

fn fib(n: u64) -> u64 {
    if n < 2 { n } else { fib(n - 1) + fib(n - 2) }
}

#[divan::bench]
fn fib_20() -> u64 {
    fib(divan::black_box(20))
}

// 複数の入力で、計測する
#[divan::bench(args = [10, 20, 30])]
fn fib_n(n: u64) -> u64 {
    fib(divan::black_box(n))
}
```

<pre><code class="tips">ベンチマークは、必ず --release (最適化あり) で計測する。cargo bench は、既定でそうなっている。
計測結果は、マシンの負荷でばらつくため、他の処理を止めて、複数回の結果で、比較する。</code></pre>

---

## カバレッジと変異テスト <a id="coverage" data-name="カバレッジと変異テスト"></a>

### カバレッジ (cargo-llvm-cov)

テストが、コードのどの行を実行したかを、計測する。

```bash
cargo install cargo-llvm-cov
rustup component add llvm-tools-preview
```

```bash
cargo llvm-cov                                  # 結果を、ターミナルに表示
cargo llvm-cov --html --open                    # HTML のレポートを作って、開く
cargo llvm-cov --lcov --output-path lcov.info   # lcov 形式で出力 (CI のサービス向け)
```

ブランチカバレッジ (条件分岐の網羅) やドキュメントテストの計測には、nightly 版の Rust が必要。stable のまま使える代替として、`cargo-tarpaulin` もある。

<pre><code class="caution">カバレッジが高いことは、テストの質が高いことを意味しない。コードを実行しただけで、何も検証していないテストでも、カバレッジは上がる。
数字を目標にするのではなく、テストされていない部分を探す道具として使う。</code></pre>

### 変異テスト (cargo-mutants)

コードを、わざと少し書き換えて (例: `+` を `-` に)、**テストが失敗するか**を確認する。テストが失敗しない変更は、そのコードが、十分に検証されていないことを意味する。

```bash
cargo install cargo-mutants
cargo mutants
```

### Miri (未定義動作の検出)

`unsafe` を含むコードは、Miri というインタープリターで、テストを実行すると、未定義動作を検出できる。

```bash
rustup +nightly component add miri
cargo +nightly miri test
```

---

## nextest <a id="nextest" data-name="nextest"></a>

`cargo-nextest` は、`cargo test` の代わりに使える、高速で、結果が見やすいテストランナー。大きなプロジェクトや、CI で広く使われている。

```bash
cargo install cargo-nextest --locked
```

```bash
cargo nextest run                       # すべてのテストを実行
cargo nextest run add                   # 名前で絞り込み
cargo nextest run -E 'test(add)'        # フィルター式で絞り込み
cargo nextest run --no-fail-fast        # 失敗しても、続ける
cargo nextest run --retries 2           # 失敗したテストを、最大2回再実行
```

| | cargo test | cargo nextest |
| --- | --- | --- |
| 実行の単位 | テストバイナリ内のテストを、スレッドで並列に実行 | **テストごとに、別のプロセス**で実行 |
| 並列性 | テストバイナリ間は、直列 | すべてのテストバイナリのテストを、並列に実行 |
| 状態の共有 | 同じプロセス内で、`static` が共有される | プロセスが分かれているため、共有されない |
| 出力 | 失敗したテストの出力が、最後にまとまる | 進捗と、失敗の出力が、見やすい |
| 追加の機能 | - | 再試行、遅いテストの検出、タイムアウト、JUnit 形式の出力、フィルター式 |
| ドキュメントテスト | 実行する | **実行しない** |

<pre><code class="caution">nextest は、ドキュメントテストを実行しない。nextest だけで、すべてのテストが通ったと思わないよう、cargo test --doc も、あわせて実行する。
cargo nextest run && cargo test --doc</code></pre>

### 設定ファイル

`.config/nextest.toml` で、プロファイルごとの設定を書ける。

```toml
# .config/nextest.toml
[profile.default]
fail-fast = true

[profile.ci]
fail-fast = false
retries = 2

[profile.ci.junit]
path = "junit.xml"   # CI のサービスが読める、JUnit 形式のレポート
```

```bash
cargo nextest run --profile ci
```

---

## CI での実行 <a id="ci" data-name="CIでの実行"></a>

GitHub Actions の例。テスト、フォーマット、静的解析 (clippy) を、あわせて確認する。

```yaml
name: ci
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: clippy, rustfmt
      - uses: Swatinem/rust-cache@v2   # ビルドのキャッシュ

      - run: cargo fmt --all -- --check
      - run: cargo clippy --all-targets --all-features -- -D warnings
      - run: cargo test --workspace --all-features
```

<pre><code class="tips">アクションのバージョン (@v4 など) は、更新されるため、公式のドキュメントで、最新を確認する。
ビルドのキャッシュを使うと、依存関係のビルドを、毎回やり直さずに済む。</code></pre>

### 品質の確認コマンド

| コマンド | 内容 |
| --- | --- |
| `cargo test` | テストの実行 |
| `cargo fmt --check` | フォーマットが、揃っているかの確認 |
| `cargo clippy -- -D warnings` | 静的解析 (警告を、エラーとして扱う) |
| `cargo doc --no-deps` | ドキュメントの生成 (ドキュメントコメントの書き間違いの検出) |

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `println!` の出力が、見えない | 成功したテストの出力は、キャプチャされる | `cargo test -- --nocapture` または `--show-output` |
| たまに失敗するテストがある | テスト間で、ファイル、環境変数、ポートなどを共有している | テストごとに、別のリソースを使う。または `serial_test` で直列にする |
| 単体テストの `use` で、関数が見つからない | `use super::*;` がない | テストモジュールの先頭に書く |
| `tests/` から `use crate::...` できない | 結合テストは、別のクレート | `use クレート名::...` で、公開 API を使う |
| 結合テストから、`main.rs` の関数を呼べない | バイナリクレートは、ライブラリとして使えない | `src/lib.rs` にロジックを移す |
| `assert_eq!` で、コンパイルエラー | 型が `Debug` または `PartialEq` を実装していない | `#[derive(Debug, PartialEq)]` を付ける |
| 浮動小数点数の `assert_eq!` が失敗する | 誤差が出る | 許容する誤差を決めて、比較する |
| `#[should_panic]` が、バグを見逃す | 別の原因のパニックでも、成功になる | `expected = "メッセージ"` を指定する |
| `async fn` にテストの属性を付けたら、エラー | `#[test]` は、async fn に使えない | `#[tokio::test]` を使う |
| ドキュメントテストが、実行されない | バイナリクレート、または nextest だけを実行している | ライブラリにする。`cargo test --doc` を実行する |
| `Result` を返すテストに、`#[should_panic]` を付けたら、エラー | 両方は、組み合わせられない | どちらかにする |
| 環境によって、結果が変わる | 時刻、乱数、ファイルパス、ネットワークに依存している | 注入して、固定する (固定の時計、シード付きの乱数、一時ディレクトリ) |
| テストの順番に、依存している | 実行順は、保証されない | 各テストが、単独で成り立つようにする |
| `set_var` で、コンパイルエラー (`unsafe`) | Rust 2024 エディションで、`unsafe` になった | `unsafe` ブロックで囲む。または環境変数に頼らない設計にする |
| テストが、リリースビルドで、動かない | `debug_assert!` は、リリースでは検査されない | `assert!` を使う。または、デバッグビルドで実行する |

---

## 関連ツール <a id="ecosystem" data-name="関連ツール"></a>

| ツール | 用途 |
| --- | --- |
| `cargo test` | 標準のテストランナー |
| `cargo-nextest` | 高速なテストランナー |
| `rstest` | パラメータ化テストと、フィクスチャ |
| `proptest` / `quickcheck` | プロパティベーステスト |
| `insta` | スナップショットテスト |
| `mockall` | トレイトのモックの自動生成 |
| `wiremock` / `httpmock` | HTTP のモックサーバー |
| `assert_cmd` + `predicates` | CLI のテスト |
| `tempfile` | 一時ファイルと一時ディレクトリ |
| `serial_test` | テストの直列実行 |
| `criterion` / `divan` | ベンチマーク |
| `cargo-llvm-cov` / `cargo-tarpaulin` | カバレッジの計測 |
| `cargo-mutants` | 変異テスト |
| `cargo-fuzz` | ファジング (ランダムな入力で、クラッシュを探す) |
| `miri` | 未定義動作の検出 |
