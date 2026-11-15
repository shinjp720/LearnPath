---
title: regex
layout: default
---

# regex <a id="top" data-name="TOP"></a>

regex は、Rust で正規表現を扱うための標準的な crate (Rust の公式の組織が、保守している)。文字列から、パターンに合う部分を、探す・取り出す・置き換える・分割することができる。

最大の特徴は、有限オートマトンを使った実装で、**どんなパターンと入力でも、入力の長さに対して、線形時間でマッチする**ことが保証されていること。その代わりに、**後方参照と先読み (lookaround) には、対応していない**。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 線形時間 | パターンが複雑でも、入力が長くても、処理時間が、入力の長さに比例する (ReDoS と呼ばれる、極端に遅くなる攻撃に強い) |
| Unicode 対応 | 既定で Unicode に対応している (`\w` が日本語にマッチする、`\p{Hiragana}` が使える) |
| 部分一致が基本 | `is_match` や `find` は、文字列の**一部**が一致すればよい。全体の一致は、`^` と `$` などで指定する |
| 後方参照なし | `\1` のように、前にマッチした内容を、参照することはできない |
| 先読みなし | `(?=...)`、`(?!...)`、`(?<=...)`、`(?<!...)` は、使えない |
| パターンは文字列 | `Regex::new` で、実行時に、パターンの文字列をコンパイルする |

### 関連する crate

| crate | 特徴 |
| --- | --- |
| `regex` | 標準的な正規表現。高速で、Unicode 対応 |
| `regex-lite` | 機能を絞った軽量版。コンパイル時間と、バイナリサイズが小さい (その代わりに、実行は遅く、Unicode の対応は限定的) |
| `fancy-regex` | 後方参照と先読みに対応する。ただし、最悪の場合に、実行時間が長くなる可能性がある |
| `regex-automata` / `regex-syntax` | regex の内部の部品。低レベルな API |
| `aho-corasick` | 大量の固定の文字列を、同時に検索する |
| `lazy-regex` | 正規表現を、コンパイル時に検査して、初回の使用時に、1回だけコンパイルするマクロ集 |

---

## 導入 <a id="introduction" data-name="導入"></a>

```bash
cargo add regex
```

```toml
[dependencies]
regex = "1"   # cargo add が、最新のバージョンを入れる
```

<pre><code class="tips">このドキュメントは、regex 1.13 (2026年7月) を想定している。
1.13 で、正規表現を、1度だけコンパイルして使い回す regex! マクロが追加された。それ以前のバージョンでは、LazyLock を使う (後述)。</code></pre>

### フィーチャー

既定では、すべての機能が有効になっている。バイナリサイズやコンパイル時間を、減らしたい場合は、必要なものだけを有効にできる。

| フィーチャー | 内容 |
| --- | --- |
| `std` | 標準ライブラリの機能 (既定で有効) |
| `unicode` | すべての Unicode 機能 (既定で有効)。個別に、`unicode-perl` (`\w`、`\d`、`\s`)、`unicode-script` (`\p{Hiragana}` など)、`unicode-case` (大文字小文字を区別しない) などに分けられる |
| `perf` | 高速化のための機能 (既定で有効) |

```toml
# 例: Unicode は、\w, \d, \s だけに絞る
regex = { version = "1", default-features = false, features = ["std", "unicode-perl", "perf"] }
```

---

## 基本 <a id="basic" data-name="基本"></a>

### 正規表現を作る

`Regex::new` で、パターンの文字列から、`Regex` を作る。パターンが不正なら、`Err` になる。

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(r"\d+").unwrap();
    println!("{}", re.is_match("abc123"));
}
```

### raw 文字列を使う

正規表現には、バックスラッシュが、多く出てくる。Rust の通常の文字列では、`\\d` のように、バックスラッシュを2つ書く必要がある。**raw 文字列** (`r"..."`) を使うと、そのまま書ける。

```rust
let a = Regex::new(r"\d+\.\d+").unwrap();      // raw 文字列 (推奨)
let b = Regex::new("\\d+\\.\\d+").unwrap();    // 通常の文字列 (バックスラッシュが2つ必要)
```

| 書き方 | 説明 |
| --- | --- |
| `r"..."` | 中のバックスラッシュを、そのまま扱う |
| `r#"..."#` | パターンに `"` を含むときに使う |
| `"\d"` | **コンパイルエラー** (Rust の文字列で、`\d` は不正なエスケープ) |

### 一致するかを調べる (is_match)

```rust
let re = Regex::new(r"^\d{3}-\d{4}$").unwrap();

assert!(re.is_match("123-4567"));
assert!(!re.is_match("1234567"));
```

### 一致した部分を探す (find)

最初に一致した部分を、`Match` として返す (なければ `None`)。

```rust
let re = Regex::new(r"\d+").unwrap();

let m = re.find("abc123def").unwrap();
assert_eq!(m.as_str(), "123");
assert_eq!(m.start(), 3);
assert_eq!(m.end(), 6);
assert_eq!(m.range(), 3..6);
```

| `Match` のメソッド | 内容 |
| --- | --- |
| `as_str()` | 一致した文字列 |
| `start()` / `end()` | 一致した位置 (**バイト**単位) |
| `range()` | `start..end` の範囲 |
| `is_empty()` | 一致した文字列が、空かどうか |

### すべての一致を探す (find_iter)

```rust
let re = Regex::new(r"\d+").unwrap();

let nums: Vec<i32> = re
    .find_iter("a1b22c333")
    .map(|m| m.as_str().parse().unwrap())
    .collect();

assert_eq!(nums, vec![1, 22, 333]);
```

### グループを取り出す (captures)

`( )` で囲んだ部分 (グループ) を、取り出す。

```rust
let re = Regex::new(r"(\d{4})-(\d{2})-(\d{2})").unwrap();

if let Some(caps) = re.captures("今日は 2024-11-04 です") {
    println!("{}", &caps[0]); // 2024-11-04 (全体)
    println!("{}", &caps[1]); // 2024
    println!("{}", &caps[2]); // 11
    println!("{}", &caps[3]); // 04
}
```

### 最初のプログラム

```rust
use regex::Regex;

fn main() {
    let re = Regex::new(r"Hello (?<name>\w+)!").unwrap();

    let Some(caps) = re.captures("Hello Murphy!") else {
        println!("no match!");
        return;
    };

    println!("The name is: {}", &caps["name"]); // Murphy
}
```

### 全体に一致させる

`is_match` や `find` は、**一部が一致すればよい**。全体が一致することを確認したい場合は、パターンの前後に、アンカーを付ける。

```rust
let re = Regex::new(r"\d+").unwrap();
assert!(re.is_match("abc123"));          // 一部が一致するので、true

let full = Regex::new(r"\A\d+\z").unwrap();
assert!(!full.is_match("abc123"));       // 全体は一致しないので、false
assert!(full.is_match("123"));
```

| アンカー | 意味 |
| --- | --- |
| `^` | 文字列の先頭 (`(?m)` を付けると、各行の先頭) |
| `$` | 文字列の末尾 (`(?m)` を付けると、各行の末尾) |
| `\A` | 文字列の先頭 (常に) |
| `\z` | 文字列の末尾 (常に) |

---

## コンパイルと再利用 <a id="compile" data-name="コンパイルと再利用"></a>

`Regex::new` は、パターンの解析とコンパイルをするため、**コストが高い**。ループや、何度も呼ばれる関数の中で呼んではいけない。

### 悪い例

```rust
fn is_number(s: &str) -> bool {
    // NG: 呼ばれるたびに、コンパイルされる
    let re = Regex::new(r"^\d+$").unwrap();
    re.is_match(s)
}
```

### regex! マクロ (1.13 以降)

`regex!` マクロは、正規表現を**初回の使用時に、1度だけコンパイル**して、以降は、同じものを使い回す。文字列リテラルを渡す。

```rust
use regex::regex;

fn is_match(line: &str) -> bool {
    // おおよそ 1 回だけコンパイルされ、自動で再利用される
    regex!(r"bar|baz").is_match(line)
}

fn main() {
    let hay = "\
path/to/foo:54:Blue Harvest
path/to/bar:90:Something, Something, Something, Dark Side
path/to/baz:3:It's a Trap!
";

    let count = hay.lines().filter(|line| is_match(line)).count();
    assert_eq!(count, 2);
}
```

### LazyLock を使う

それ以前のバージョンでも使える、定番の方法。`static` の中で、`LazyLock` (Rust 1.80 以降) を使う。

```rust
use std::sync::LazyLock;
use regex::Regex;

fn is_number(s: &str) -> bool {
    static RE: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"^\d+$").unwrap());
    RE.is_match(s)
}
```

複数の関数で共有する場合は、モジュールの先頭に、まとめて定義する。

```rust
static DATE_RE: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})").unwrap());
```

| 方法 | 使いどころ |
| --- | --- |
| `regex!(r"...")` | 文字列リテラルのパターンを、その場で書く (1.13 以降) |
| `static` + `LazyLock` | 複数の場所から共有する。1.13 より前のバージョンでも使える |
| `Regex::new` を1回だけ呼んで、変数に持つ | 構造体のフィールドに持つ、`main` で作って渡す |
| `lazy-regex` crate | コンパイル時に、パターンの検査もしたい |

### スレッドでの共有

`Regex` は `Send` と `Sync` なので、複数のスレッドから、同時に使える (参照を共有するか、`clone` する。`clone` は、軽い)。

### パターンが不正なとき

ユーザーの入力など、実行時に決まるパターンは、`unwrap()` せずに、`Err` を処理する。

```rust
match Regex::new(r"(unclosed") {
    Ok(_) => println!("OK"),
    Err(e) => eprintln!("不正なパターン: {}", e),
}
```

### 入力を、文字としてそのまま検索する

ユーザーが入力した文字列を、パターンに組み込む場合は、`regex::escape` で、特殊な文字をエスケープする。

```rust
let keyword = "a.b*c";                       // . や * を、文字として検索したい
let pattern = regex::escape(keyword);        // a\.b\*c
let re = Regex::new(&pattern).unwrap();

assert!(re.is_match("a.b*c"));
assert!(!re.is_match("axbbc"));
```

---

## マッチの取得 <a id="captures" data-name="マッチの取得"></a>

### Captures

`captures` が返す `Captures` は、1回のマッチの、全体とすべてのグループを持つ。

| 書き方 | 説明 |
| --- | --- |
| `caps[0]` | マッチ全体 |
| `caps[1]` | 1番目のグループ (`&str`)。**そのグループが、マッチに参加していないと、パニックする** |
| `&caps["name"]` | 名前付きグループ (`&str`)。同様に、存在しないとパニックする |
| `caps.get(1)` | `Option<Match>`。マッチしていなければ `None` (安全) |
| `caps.name("name")` | 名前付きグループを、`Option<Match>` で取得する |
| `caps.len()` | グループの数 (全体を含む) |
| `caps.extract()` | 全体と、グループを、まとめて取り出す |

### 名前付きグループ

`(?<名前>...)` で、グループに名前を付けられる。`(?P<名前>...)` と書くこともできる。

```rust
let re = Regex::new(r"(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})").unwrap();
let caps = re.captures("2024-11-04").unwrap();

println!("{}年{}月{}日", &caps["year"], &caps["month"], &caps["day"]);
```

### 省略できるグループ

`?` が付いたグループなど、マッチに参加しないことがあるグループは、`get` で取り出す。

```rust
let re = Regex::new(r"(\d+)(?:\.(\d+))?").unwrap();

let caps = re.captures("12").unwrap();
assert_eq!(&caps[1], "12");
assert_eq!(caps.get(2).map(|m| m.as_str()), None);   // 小数部は、マッチしていない

let caps = re.captures("12.34").unwrap();
assert_eq!(caps.get(2).map(|m| m.as_str()), Some("34"));
```

<pre><code class="caution">caps[2] のように、添字で取り出すと、そのグループがマッチに参加していないときに、パニックする。
省略できるグループは、get を使う。</code></pre>

### extract でまとめて取り出す

グループの数が決まっているときは、`extract` で、配列として受け取れる。

```rust
let re = Regex::new(r"(\d{4})-(\d{2})-(\d{2})").unwrap();

let (whole, [year, month, day]) = re.captures("2024-11-04").unwrap().extract();

assert_eq!(whole, "2024-11-04");
assert_eq!((year, month, day), ("2024", "11", "04"));
```

グループの数と、配列の長さが合わない場合や、マッチしなかったグループがある場合は、パニックする。

### すべてのマッチのグループ (captures_iter)

```rust
let re = Regex::new(r"(?<key>\w+)=(?<value>\w+)").unwrap();

for caps in re.captures_iter("a=1, b=2, c=3") {
    println!("{} -> {}", &caps["key"], &caps["value"]);
}
```

### 位置はバイト単位

`start()` や `end()` は、**バイト単位**の位置。日本語など、UTF-8 で1文字が複数バイトの文字列では、文字数とは異なる。

```rust
let text = "あいう123";
let re = Regex::new(r"\d+").unwrap();
let m = re.find(text).unwrap();

assert_eq!(m.start(), 9);                // 「あいう」は 3 文字 × 3 バイト = 9 バイト
assert_eq!(&text[m.range()], "123");     // バイト位置で、スライスできる
```

---

## 置換と分割 <a id="replace" data-name="置換と分割"></a>

### 置換

| メソッド | 動作 |
| --- | --- |
| `replace(text, rep)` | **最初の**一致だけを、置き換える |
| `replace_all(text, rep)` | **すべての**一致を、置き換える |
| `replacen(text, limit, rep)` | 最初の `limit` 個を、置き換える |

結果は `Cow<str>` で、一致がなければ、元の文字列を借用したまま (コピーしない) 返す。

```rust
let re = Regex::new(r"\s+").unwrap();

let s = re.replace_all("a   b \t c", " ");
assert_eq!(s, "a b c");

// String が必要なら、into_owned / to_string
let owned: String = s.into_owned();
```

### 置換文字列の書き方

置換する文字列の中で、`$` を使って、グループを参照できる。

| 書き方 | 意味 |
| --- | --- |
| `$1`、`${1}` | 1番目のグループ |
| `$name`、`${name}` | 名前付きグループ |
| `$0` | マッチ全体 |
| `$$` | `$` という文字 |

```rust
let re = Regex::new(r"(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})").unwrap();

let out = re.replace_all("2024-11-04", "${d}/${m}/${y}");
assert_eq!(out, "04/11/2024");
```

<pre><code class="caution">$1abc のように、グループ参照の直後に、英数字や _ が続くと、「1abc」という名前のグループとして解釈される (存在しないので、空文字列になる)。
区切りたいときは、${1}abc のように、波括弧で囲む。</code></pre>

### 置換文字列を、そのまま使う (NoExpand)

置換文字列の中の `$` を、展開したくないときは、`NoExpand` で包む。

```rust
use regex::NoExpand;

let re = Regex::new(r"price").unwrap();
let out = re.replace("price: 10", NoExpand("$5"));
assert_eq!(out, "$5: 10");
```

### クロージャで置換する

置換の内容を、プログラムで計算したいときは、クロージャを渡す。

```rust
use regex::Captures;

// snake_case を、camelCase にする
let re = Regex::new(r"_([a-z])").unwrap();
let camel = re.replace_all("user_name_id", |caps: &Captures| caps[1].to_uppercase());

assert_eq!(camel, "userNameId");
```

### 分割

```rust
let re = Regex::new(r"[,\s]+").unwrap();

let parts: Vec<&str> = re.split("a, b  c,d").collect();
assert_eq!(parts, vec!["a", "b", "c", "d"]);

// 最大で 2 つに分割
let parts: Vec<&str> = re.splitn("a, b, c", 2).collect();
assert_eq!(parts, vec!["a", "b, c"]);
```

---

## 構文 <a id="syntax" data-name="構文"></a>

### 基本

| 書き方 | 意味 |
| --- | --- |
| `.` | 改行 (`\n`) 以外の、任意の1文字 |
| `^` / `$` | 文字列の先頭 / 末尾 |
| `[abc]` | `a`、`b`、`c` のどれか1文字 |
| `[^abc]` | `a`、`b`、`c` 以外の1文字 |
| `[a-z]` | `a` から `z` の範囲 |
| <code>a&#124;b</code> | `a` または `b` |
| `(...)` | グループ (キャプチャする) |
| `(?:...)` | グループ (キャプチャしない) |
| `(?<名前>...)` | 名前付きグループ |

### 量指定子

| 書き方 | 意味 |
| --- | --- |
| `*` | 0回以上 |
| `+` | 1回以上 |
| `?` | 0回または1回 |
| `{n}` | ちょうど n 回 |
| `{n,}` | n 回以上 |
| `{n,m}` | n 回以上 m 回以下 |
| `*?`、`+?`、`??`、`{n,m}?` | 最短一致 (できるだけ少なく) |

```rust
let greedy = Regex::new(r"<.+>").unwrap();
let lazy = Regex::new(r"<.+?>").unwrap();

let text = "<a><b>";
assert_eq!(greedy.find(text).unwrap().as_str(), "<a><b>"); // 最長一致
assert_eq!(lazy.find(text).unwrap().as_str(), "<a>");      // 最短一致
```

### 文字クラスのショートカット

| 書き方 | 意味 (Unicode が有効なとき) |
| --- | --- |
| `\d` | Unicode の数字 (全角数字なども含む) |
| `\D` | `\d` 以外 |
| `\w` | 単語を構成する文字 (英数字、`_`、日本語の文字なども含む) |
| `\W` | `\w` 以外 |
| `\s` | 空白文字 (全角スペースなども含む) |
| `\S` | `\s` 以外 |
| `\b` | 単語の境界 |
| `\B` | 単語の境界でない位置 |
| `\<` / `\>` | 単語の開始 / 終了の境界 (`\b{start}` / `\b{end}` と同じ) |

### Unicode のクラス

`\p{...}` で、Unicode のカテゴリや、文字の種類 (スクリプト) を指定できる。

| 書き方 | 意味 |
| --- | --- |
| `\p{L}` (または `\pL`) | 文字 (Letter) |
| `\p{Lu}` / `\p{Ll}` | 大文字 / 小文字 |
| `\p{N}` | 数字 |
| `\p{P}` | 句読点 |
| `\p{Hiragana}` | ひらがな |
| `\p{Katakana}` | カタカナ |
| `\p{Han}` | 漢字 |
| `\p{Latin}` / `\p{Greek}` | ラテン文字 / ギリシャ文字 |
| `\P{...}` | その否定 |

### エスケープ

| 書き方 | 意味 |
| --- | --- |
| `\n`、`\t`、`\r` | 改行、タブ、復帰 |
| `\x41` | 16進数のコード (2桁) |
| `\x{3042}` / `\u{3042}` | 16進数のコードポイント (「あ」) |
| `\.`、`\*`、`\+`、`\?`、`\(`、`\)`、`\[`、`\{`、`\\` | 特殊な文字を、そのまま文字として扱う |

### 文字クラスの集合演算

```rust
// 母音以外の、英小文字
let re = Regex::new(r"[a-z&&[^aeiou]]+").unwrap();
assert_eq!(re.find("hello").unwrap().as_str(), "h");

// 差集合: 英小文字から、x と y と z を除く
let re = Regex::new(r"[a-z--xyz]").unwrap();
assert!(re.is_match("a"));
assert!(!re.is_match("x"));
```

| 書き方 | 意味 |
| --- | --- |
| `[a-z&&[^aeiou]]` | 積集合 (両方に含まれる) |
| `[a-z--xyz]` | 差集合 (後ろを除く) |
| `[a-z~~aeiou]` | 対称差 (どちらか一方にだけ含まれる) |
| `[[:alpha:]]` | POSIX クラス (ASCII のみ)。`[:digit:]`、`[:space:]` など |

### フラグ

`(?フラグ)` で、パターンの途中からフラグを有効にする。`(?フラグ:...)` で、その範囲だけに適用する。`(?-フラグ)` で無効にする。

| フラグ | 意味 |
| --- | --- |
| `i` | 大文字小文字を区別しない |
| `m` | 複数行モード (`^` と `$` が、各行の先頭と末尾にマッチする) |
| `s` | `.` が、改行にもマッチする |
| `x` | 空白とコメントを無視する (読みやすく書ける) |
| `U` | 量指定子の、最長と最短を入れ替える |
| `u` | Unicode モード (既定で有効) |
| `R` | CRLF モード (`\r\n` を、1つの改行として扱う) |

```rust
let re = Regex::new(r"(?i)hello").unwrap();
assert!(re.is_match("HELLO"));

// (?x) で、コメントを付けて、読みやすく書く
let re = Regex::new(
    r"(?x)
    (\d{4})  # 年
    -
    (\d{2})  # 月
    -
    (\d{2})  # 日
    ",
)
.unwrap();
assert!(re.is_match("2024-11-04"));

// 一部だけに適用: a は大文字小文字を区別せず、b は区別する
let re = Regex::new(r"(?i:a)b").unwrap();
assert!(re.is_match("Ab"));
assert!(!re.is_match("AB"));
```

### 対応していない構文

| 構文 | 内容 | 代わりの方法 |
| --- | --- | --- |
| `\1`、`\k<name>` | 後方参照 | `fancy-regex`、またはプログラムで比較する |
| `(?=...)`、`(?!...)` | 先読み | `fancy-regex`、またはグループで取り出して、プログラムで判定する |
| `(?<=...)`、`(?<!...)` | 後読み | 同上 |
| `(?>...)`、`a*+` | アトミックグループ、所有量指定子 | (なし) |

これらに対応しないことが、「線形時間」の保証の理由になっている。

---

## 日本語を扱う <a id="japanese" data-name="日本語を扱う"></a>

既定で Unicode が有効なため、日本語も、そのまま扱える。

```rust
// \w は、日本語の文字にもマッチする
let re = Regex::new(r"\w+").unwrap();
assert_eq!(re.find("こんにちは world").unwrap().as_str(), "こんにちは");

// ひらがなだけの文字列か
let hira = Regex::new(r"^\p{Hiragana}+$").unwrap();
assert!(hira.is_match("ひらがな"));
assert!(!hira.is_match("カタカナ"));

// 漢字を、すべて取り出す
let han = Regex::new(r"\p{Han}+").unwrap();
let words: Vec<&str> = han.find_iter("東京都と大阪府").map(|m| m.as_str()).collect();
assert_eq!(words, vec!["東京都", "大阪府"]);
```

<pre><code class="caution">\d は、Unicode の「数字」にマッチするため、全角の数字 (１２３) にもマッチする。
半角の数字だけを、対象にしたい場合は、[0-9] と書く (または、Unicode を無効にする (?-u:\d))。</code></pre>

<pre><code class="caution">長音符 (ー) は、文字の種類 (スクリプト) が、ひらがなとカタカナのどちらでもない扱いなので、\p{Katakana} には、マッチしない。
カタカナの語を扱うときは、[\p{Katakana}ー]+ のように、ー を加える。</code></pre>

### 全角スペースを含む空白

`\s` は、全角スペース (U+3000) にもマッチする。

```rust
let re = Regex::new(r"\s+").unwrap();
let s = re.replace_all("山田　　太郎", " ");
assert_eq!(s, "山田 太郎");
```

### 郵便番号

```rust
// 半角の数字だけにしたい場合は、[0-9] を使う
let re = Regex::new(r"^〒?[0-9]{3}-[0-9]{4}$").unwrap();

assert!(re.is_match("123-4567"));
assert!(re.is_match("〒123-4567"));
assert!(!re.is_match("１２３-４５６７")); // 全角は、マッチしない
```

---

## RegexBuilder <a id="builder" data-name="RegexBuilder"></a>

パターンに `(?i)` を書く代わりに、`RegexBuilder` で、フラグやサイズの制限を、メソッドとして指定できる。

```rust
use regex::RegexBuilder;

let re = RegexBuilder::new(r"hello")
    .case_insensitive(true)
    .build()
    .unwrap();

assert!(re.is_match("HELLO"));
```

| メソッド | 対応するフラグなど |
| --- | --- |
| `case_insensitive(bool)` | `i` |
| `multi_line(bool)` | `m` |
| `dot_matches_new_line(bool)` | `s` |
| `swap_greed(bool)` | `U` |
| `ignore_whitespace(bool)` | `x` |
| `unicode(bool)` | `u` |
| `crlf(bool)` | `R` |
| `size_limit(bytes)` | コンパイル後の、プログラムのサイズの上限 |
| `dfa_size_limit(bytes)` | 実行時のキャッシュの、サイズの上限 |
| `nest_limit(n)` | パターンの、入れ子の深さの上限 |

<pre><code class="tips">ユーザーから受け取ったパターンを、コンパイルする場合は、size_limit と nest_limit で、上限を設ける。
巨大なパターンによる、メモリの大量消費を防げる (上限を超えると、Err (CompiledTooBig など) になる)。</code></pre>

---

## 複数のパターン (RegexSet) <a id="set" data-name="複数のパターン"></a>

複数のパターンを、1回の走査で、まとめて検索する。「どのパターンに一致したか」が分かる。

```rust
use regex::RegexSet;

let set = RegexSet::new([
    r"^\d+$",        // 0: 数字だけ
    r"^[a-z]+$",     // 1: 英小文字だけ
    r"^\s*$",        // 2: 空白だけ
])
.unwrap();

assert!(set.is_match("abc"));

let matched: Vec<usize> = set.matches("123").into_iter().collect();
assert_eq!(matched, vec![0]);
```

| メソッド | 内容 |
| --- | --- |
| `is_match(text)` | いずれかのパターンに一致するか |
| `matches(text)` | 一致したパターンの、番号の集合 (`SetMatches`) |
| `SetMatches::matched_any()` / `matched_all()` | いずれかに一致したか / すべてに一致したか |
| `SetMatches::matched(i)` | `i` 番目のパターンに一致したか |

`RegexSet` は、どこに一致したか (位置) や、グループは、分からない。位置が必要なら、`RegexSet` で絞り込んで、該当する `Regex` で、改めて検索する。

---

## バイト列 (regex::bytes) <a id="bytes" data-name="バイト列"></a>

`regex::bytes::Regex` は、UTF-8 とは限らない、バイト列 (`&[u8]`) を検索する。バイナリデータや、壊れた文字コードを含むデータに使う。

```rust
use regex::bytes::Regex;

let re = Regex::new(r"(?-u)\xFF+").unwrap(); // (?-u) で、バイト単位のマッチにする

assert!(re.is_match(b"abc\xFF\xFFdef"));

let m = re.find(b"abc\xFF\xFFdef").unwrap();
assert_eq!(m.as_bytes(), b"\xFF\xFF");
```

| | `regex::Regex` | `regex::bytes::Regex` |
| --- | --- | --- |
| 検索の対象 | `&str` (UTF-8) | `&[u8]` |
| `Match` の取り出し | `as_str()` | `as_bytes()` |
| 不正な UTF-8 | 扱えない | 扱える |

---

## 実践例 <a id="example" data-name="実践例"></a>

### ログの解析

```rust
use regex::Regex;

fn main() {
    let log = "\
12:00:01 [INFO] server started
12:00:05 [WARN] disk usage 91%
12:00:09 [ERROR] connection lost
";

    let re = Regex::new(r"^(?<time>\d{2}:\d{2}:\d{2}) \[(?<level>[A-Z]+)\] (?<msg>.*)$").unwrap();

    for line in log.lines() {
        if let Some(caps) = re.captures(line) {
            println!("{} | {:<5} | {}", &caps["time"], &caps["level"], &caps["msg"]);
        }
    }
}
```

### 日付の形式を変える

```rust
let re = Regex::new(r"(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})").unwrap();
let text = "開始: 2024-11-04、終了: 2024-12-31";

let out = re.replace_all(text, "${y}年${m}月${d}日");
assert_eq!(out, "開始: 2024年11月04日、終了: 2024年12月31日");
```

### 変数を展開する (テンプレート)

`${name}` の形の部分を、`HashMap` の値で置き換える。

```rust
use std::collections::HashMap;
use regex::{Captures, Regex};

fn expand(template: &str, vars: &HashMap<&str, &str>) -> String {
    let re = Regex::new(r"\$\{(\w+)\}").unwrap();

    re.replace_all(template, |caps: &Captures| {
        // 変数が見つからなければ、元の文字列のまま残す
        vars.get(&caps[1]).copied().unwrap_or(&caps[0]).to_string()
    })
    .into_owned()
}

fn main() {
    let vars = HashMap::from([("name", "Alice"), ("place", "Tokyo")]);
    println!("{}", expand("Hello, ${name}! Welcome to ${place}. ${unknown}", &vars));
    // Hello, Alice! Welcome to Tokyo. ${unknown}
}
```

### 空白を整える

```rust
let re = Regex::new(r"\s+").unwrap();
let cleaned = re.replace_all("  hello   world \n ", " ").trim().to_string();
assert_eq!(cleaned, "hello world");
```

### 数値を取り出す

```rust
let re = Regex::new(r"-?\d+(?:\.\d+)?").unwrap();

let nums: Vec<f64> = re
    .find_iter("温度は -3.5 度、湿度は 62 %")
    .filter_map(|m| m.as_str().parse().ok())
    .collect();

assert_eq!(nums, vec![-3.5, 62.0]);
```

### 簡易的な URL の分解

```rust
let re = Regex::new(r"^(?<scheme>https?)://(?<host>[^/:]+)(?::(?<port>\d+))?(?<path>/.*)?$").unwrap();

let caps = re.captures("https://example.com:8080/a/b").unwrap();
assert_eq!(&caps["scheme"], "https");
assert_eq!(&caps["host"], "example.com");
assert_eq!(caps.name("port").map(|m| m.as_str()), Some("8080"));
assert_eq!(caps.name("path").map(|m| m.as_str()), Some("/a/b"));
```

<pre><code class="caution">メールアドレスや URL を、正規表現で厳密に検証することは、非常に難しい (仕様が複雑で、完全に表現できない)。
上の例は、簡易的な分解のためのもの。厳密な検証には、url crate など、専用のパーサーを使う。</code></pre>

---

## パフォーマンス <a id="performance" data-name="パフォーマンス"></a>

| 指針 | 内容 |
| --- | --- |
| コンパイルを、繰り返さない | `Regex::new` は、コストが高い。`regex!` や `LazyLock` で、1回だけにする |
| 必要な機能だけを呼ぶ | 速い順に、`is_match` → `find` → `captures`。一致したかだけなら、`is_match` を使う |
| グループが不要なら、取り出さない | `captures` は、グループの位置を計算するため、遅い。全体の位置だけなら、`find` |
| ASCII だけなら、Unicode を無効にする | `(?-u:\w)` や `[a-zA-Z0-9_]` の方が、コンパイルも実行も軽い (`\w` や `\p{...}` は、巨大なテーブルになる) |
| 固定の文字列は、`str` のメソッド | 単純な固定の文字列の検索は、`str::contains` や `str::find` で十分 (正規表現は不要) |
| 大量の固定の文字列 | `aho-corasick` を使う |
| 先頭に `.*` を置かない | 検索したい部分の前に、`.*` を付ける必要はない (部分一致が、既定のため) |
| 軽量にしたい場合 | `regex-lite` (その代わりに、機能が限られ、実行は遅い) |

<pre><code class="tips">regex crate は、どんなパターンでも、入力の長さに比例した時間で終わる。いわゆる ReDoS (後方参照などによる、指数的な遅延) が、起きない設計。
ただし、巨大なパターンのコンパイルには、時間とメモリがかかるため、信頼できないパターンには、RegexBuilder で size_limit を設定する。</code></pre>

---

## テスト <a id="test" data-name="テスト"></a>

正規表現は、書き間違いや、意図しないマッチが起きやすいため、**マッチする例と、しない例**の、両方をテストで確認する。

```rust
use regex::Regex;

fn is_postal_code(s: &str) -> bool {
    let re = regex::regex!(r"^[0-9]{3}-[0-9]{4}$");
    re.is_match(s)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matches_valid() {
        assert!(is_postal_code("123-4567"));
    }

    #[test]
    fn rejects_invalid() {
        assert!(!is_postal_code("1234567"));      // ハイフンがない
        assert!(!is_postal_code("123-45678"));    // 桁が多い
        assert!(!is_postal_code("abc-defg"));     // 数字でない
        assert!(!is_postal_code(" 123-4567"));    // 前に空白がある
        assert!(!is_postal_code("１２３-４５６７")); // 全角
    }
}
```

<pre><code class="tips">static や regex! で定義した正規表現は、最初に使われるまで、コンパイルされない。パターンが不正でも、使われるまで、エラーに気付けない。
定義した正規表現を、実際に実行するテストを、必ず1つは書いておく。</code></pre>

テストの書き方の詳細は、「Rustのテスト」のドキュメントを参照。

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `\d` が、全角の数字にもマッチする | Unicode が、既定で有効 | `[0-9]` を使う。または `(?-u:\d)` |
| `"\d"` で、コンパイルエラー | Rust の通常の文字列では、`\d` が不正なエスケープ | raw 文字列 `r"\d"` を使う |
| 全体が一致していないのに、`is_match` が `true` | 部分一致が、既定 | `^...$` または `\A...\z` を付ける |
| 関数が遅い | `Regex::new` を、毎回呼んでいる | `regex!` や `LazyLock` で、1回だけにする |
| `caps[2]` でパニック | そのグループが、マッチに参加していない | `caps.get(2)` で、`Option` として扱う |
| `.` が、改行にマッチしない | `.` は、改行以外の文字 | `(?s)` を付ける |
| 複数行の文字列で、`^` と `$` が、期待どおりに動かない | `^` と `$` は、文字列全体の先頭と末尾 | `(?m)` を付ける |
| `$` が、末尾の改行の前にマッチしない | `$` は、改行を許さず、文字列の真の末尾にだけマッチする | 改行を含めるなら `\n?\z` など。通常は、`trim` するか `lines()` で、行ごとに処理する |
| 日本語の位置が、ずれる | `start()` と `end()` は、文字数ではなく、バイト位置 | 文字単位の位置が必要なら、`text[..m.start()].chars().count()` |
| `\p{Katakana}` が「ー」にマッチしない | 長音符は、スクリプトが、カタカナとして扱われない | `[\p{Katakana}ー]` と書く |
| `$1abc` が空になる | 「1abc」という名前のグループとして解釈される | `${1}abc` と書く |
| ユーザーの入力で、エラーや誤動作 | 入力に `.`、`*`、`(` などが含まれている | `regex::escape` でエスケープする |
| `{` でパターンのエラー | `{` が、量指定子の開始として解釈される | `\{` と、エスケープする |
| 先読みや後方参照で、エラー | regex crate は、対応していない | `fancy-regex` を使う。または、グループで取り出して、プログラムで判定する |
| `CompiledTooBig` のエラー | パターンが、大きすぎる (大きな繰り返し `{n,m}` や、Unicode のクラスの組み合わせ) | パターンを簡単にする。`size_limit` を、上げる |

---

## 関連 crate <a id="ecosystem" data-name="関連crate"></a>

| crate | 用途 |
| --- | --- |
| `regex-lite` | 軽量な正規表現 (バイナリサイズとコンパイル時間を、小さくしたいとき) |
| `fancy-regex` | 先読みと後方参照に、対応した正規表現 |
| `lazy-regex` | コンパイル時のパターンの検査と、遅延コンパイル、グループの取り出しを、マクロで書ける |
| `aho-corasick` | 大量の固定の文字列を、高速に検索する |
| `memchr` | 1バイトや、固定の文字列の、高速な検索 |
| `bstr` | バイト列の、文字列のような操作 |
| `regex-syntax` / `regex-automata` | 正規表現の構文解析と、マッチングエンジンの、低レベルな部品 |
| `onig` / `pcre2` | C ライブラリのバインディング (Oniguruma / PCRE2)。Perl 互換の、豊富な構文 |
