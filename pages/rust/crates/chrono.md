---
title: chrono
layout: default
---

# chrono <a id="top" data-name="TOP"></a>

chrono は、Rust で日付と時刻を扱うための、広く使われている crate である。日付 (年月日)、時刻、タイムゾーンつきの日時、時間の長さを、それぞれ別の型として表し、計算、文字列との変換 (フォーマットと解析)、UNIX タイムスタンプとの変換ができる。

最大の特徴は、**タイムゾーンを持つ型** (`DateTime<Tz>`) と、**持たない型** (`NaiveDate`、`NaiveTime`、`NaiveDateTime`) が、型として分かれている点である。「どのタイムゾーンの、いつなのか」が決まっていない値を、誤って、決まっている値として扱うことを、コンパイル時に防げる。

標準ライブラリの `std::time` は、経過時間 (`Instant`、`Duration`) と、システム時刻 (`SystemTime`) だけを扱い、年月日や曜日、タイムゾーンは扱わない。カレンダーに関わる処理は、chrono のような crate を使う。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 型の区別 | タイムゾーンあり (`DateTime<Tz>`) と、なし (`Naive*`) を、型で区別する |
| 暦 | 先発グレゴリオ暦 (proleptic Gregorian calendar)。昔の日付も、現在と同じ規則で計算する |
| 精度 | ナノ秒。うるう秒も、`23:59:60` のように表せる |
| タイムゾーン | `Utc`、`Local` (OS の設定)、`FixedOffset` (固定の時差) を、標準で持つ。IANA のタイムゾーン (`Asia/Tokyo` など) は、`chrono-tz` crate で使う |
| 文字列 | strftime に似た書式での出力と解析、RFC 3339、RFC 2822 に対応する |
| serde | `serde` フィーチャーで、JSON などとの変換ができる |
| 計算 | 時間の加算・減算、月や日の単位での加算、差の計算、丸め |
| 環境 | `no_std` (`alloc` あり) にも、`wasm32` にも、対応する |

### 主な型

| 型 | 内容 | 例 |
| --- | --- | --- |
| `NaiveDate` | 日付 (年月日)。タイムゾーンなし | `2026-11-19` |
| `NaiveTime` | 時刻 (時分秒とナノ秒)。日付もタイムゾーンもなし | `09:30:00` |
| `NaiveDateTime` | 日付と時刻。タイムゾーンなし | `2026-11-19T09:30:00` |
| `DateTime<Tz>` | 日付と時刻と、タイムゾーン (オフセット) | `2026-11-19T09:30:00+09:00` |
| `Utc` / `Local` / `FixedOffset` | タイムゾーンを表す型 (`TimeZone` トレイトを実装する) | |
| `TimeDelta` (別名 `Duration`) | 時間の長さ。符号つき | `3 時間 25 分` |
| `Months` / `Days` | 暦の上での、月数と日数。月単位の加算に使う | |
| `Weekday` / `Month` | 曜日と月の列挙型 | `Weekday::Thu` |
| `IsoWeek` | ISO 8601 の、週番号と、その年 | `2026 年の第 47 週` |
| `MappedLocalTime<T>` (旧名 `LocalResult<T>`) | 現地の時刻から、タイムゾーンつきの日時への変換の結果。1つに決まるとは限らない | |

<pre><code class="tips">Naive は、「素朴な」の意味で、タイムゾーンの情報を持たないことを表す。
NaiveDateTime の 2026-11-19 09:30:00 は、日本の 9 時半なのか、UTC の 9 時半なのか、決まっていない。タイムゾーンを付けて、初めて、1つの時点になる。</code></pre>

### 型の選び方

| 用途 | 型 |
| --- | --- |
| ログ、データベース、API でやり取りする時刻 | `DateTime<Utc>` |
| ユーザーに表示する時刻 | `DateTime<Local>`、または、`chrono-tz` の `DateTime<Tz>` |
| 外部から、オフセットつきで届く時刻 (RFC 3339 の文字列など) | `DateTime<FixedOffset>` |
| 誕生日、祝日、締め切りの日付 | `NaiveDate` |
| 営業時間 (毎日 9 時から 18 時、など) | `NaiveTime` |
| 場所が決まっていない「壁時計の時刻」 | `NaiveDateTime` |
| 処理にかかった時間の計測 | `std::time::Instant` (chrono ではない) |

### 他の選択肢との比較

| | chrono | time | jiff | std::time |
| --- | --- | --- | --- | --- |
| 年月日、曜日 | ○ | ○ | ○ | ✕ |
| IANA タイムゾーン | `chrono-tz` が必要 | 別の crate が必要 | 本体に含む | ✕ |
| 時間の長さ | `TimeDelta` (符号つき) | `Duration` (符号つき) | `Span`、`SignedDuration` | `Duration` (符号なし) |
| 経過時間の計測 | ✕ | ✕ | ✕ | `Instant` |
| 特徴 | 歴史が長く、周辺の crate の対応が、最も多い | マクロでの日時の記述、`no_std` に強い | 夏時間を考慮した計算が、標準の API になっている | 追加の依存がない |

<pre><code class="tips">既存のコードや、他の crate (sqlx、diesel、serde_with など) が chrono の型を使っていることが多いため、迷ったときは chrono が無難である。
新規のプロジェクトで、夏時間を考慮した計算や、IANA タイムゾーンが中心なら、jiff も候補になる。</code></pre>

### 向いている場面と向いていない場面

| 向いている | 向いていない |
| --- | --- |
| 日付と時刻の計算、書式の変換 | 処理時間の計測 (`std::time::Instant` を使う) |
| API、データベース、ログでの、時刻のやり取り | 暦が絶対に必要な、天文計算や、歴史上の日付 (ユリウス暦など) |
| UNIX タイムスタンプとの変換 | 自然言語の日付の解析 (「来週の火曜日」など。別の crate が必要) |

<pre><code class="caution">このドキュメントは、chrono 0.4.45 (2026年6月) を前提にしている。
0.4 系の中で、API の名前が何度か変わった (特に 0.4.23 以降)。古い記事の Utc.ymd()、NaiveDate::from_ymd()、Utc::today()、NaiveDateTime::from_timestamp() などは、非推奨になっている。
詳しくは、「古いコードからの変更」の章を参照。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

```bash
cargo add chrono
```

```toml
[dependencies]
chrono = "0.4"   # cargo add が、最新の 0.4.x を入れる
```

JSON などで使う場合は、`serde` フィーチャーを付ける。

```bash
cargo add chrono --features serde
```

IANA のタイムゾーン (`Asia/Tokyo` など) が必要なときは、`chrono-tz` を、一緒に追加する。

```bash
cargo add chrono-tz
```

### フィーチャー

| フィーチャー | 既定 | 内容 |
| --- | --- | --- |
| `alloc` | ○ | 文字列の書式化など、メモリの確保が必要な機能 |
| `std` | ○ | 標準ライブラリとの連携 (`SystemTime` など)。`alloc` を含む |
| `now` | ○ | システム時刻の取得 (`Utc::now()`) |
| `clock` | ○ | OS のタイムゾーンの取得 (`Local`)。`now` を含む |
| `wasmbind` | ○ | `wasm32` で、JavaScript の `Date` と連携する |
| `oldtime` | ○ | 現在は、効果がない (古い `time` 0.1 との互換用だった) |
| `serde` | | serde による、シリアライズとデシリアライズ |
| `unstable-locales` | | `_localized` の付いたメソッドによる、ロケールごとの表示 (API が変わる可能性がある) |
| `rkyv-16` / `rkyv-32` / `rkyv-64` | | rkyv によるシリアライズ (排他的) |
| `arbitrary` | | `arbitrary` crate による、ランダムなインスタンスの生成 |

<pre><code class="tips">既定のフィーチャーで、ほとんどの用途は足りる。
依存を減らしたい場合は、default-features = false にして、必要なものだけを足す。now だけなら、Utc::now() と書式化が使える。alloc だけなら、時刻の取得はできないが、書式化はできる。</code></pre>

```toml
# Utc::now() と、書式化だけを使う
chrono = { version = "0.4", default-features = false, features = ["now"] }
```

<pre><code class="caution">Local は、clock フィーチャーが必要である。default-features = false にして、clock を付けないと、Local が見つからないというコンパイルエラーになる。</code></pre>

### 環境

| 項目 | 内容 |
| --- | --- |
| 最小の Rust のバージョン (MSRV) | Rust 1.62 (chrono 0.4.45)。マイナーバージョンで、上がることがある |
| use の書き方 | 型は、`use chrono::prelude::*;` で、まとめて取り込める |

`prelude` には、`DateTime`、`NaiveDate`、`NaiveTime`、`NaiveDateTime`、`Utc`、`Local`、`FixedOffset`、`TimeZone`、`Datelike`、`Timelike`、`Weekday`、`Month` などが含まれる。`TimeDelta`、`Months`、`Days`、`DurationRound` は含まれないため、個別に `use` する。

---

## 基本 <a id="basic" data-name="基本"></a>

### 最小の例

```rust
use chrono::prelude::*;

fn main() {
    // 現在の時刻 (UTC と、OS のタイムゾーン)
    let utc: DateTime<Utc> = Utc::now();
    let local: DateTime<Local> = Local::now();
    println!("{}", utc.format("%Y-%m-%d %H:%M:%S"));
    println!("{}", local.to_rfc3339());

    // 日付だけを使う
    let today: NaiveDate = Local::now().date_naive();
    println!("{today}");

    // 年月日を指定して作る
    let dt = Utc.with_ymd_and_hms(2026, 11, 19, 9, 30, 0).unwrap();
    println!("{dt}"); // 2026-11-19 09:30:00 UTC
}
```

### 主な API

| メソッド | 内容 |
| --- | --- |
| `Utc::now()` | 現在の UTC の時刻 (`DateTime<Utc>`) |
| `Local::now()` | 現在の、OS のタイムゾーンでの時刻 (`DateTime<Local>`) |
| `NaiveDate::from_ymd_opt(y, m, d)` | 年月日から、日付を作る (不正な日付は `None`) |
| `Utc.with_ymd_and_hms(y, m, d, h, mi, s)` | 年月日と時分秒から、日時を作る (`MappedLocalTime`) |
| `dt.format("...")` | 書式を指定して、文字列にする |
| `DateTime::parse_from_rfc3339(s)` | RFC 3339 の文字列を、日時にする |
| `NaiveDate::parse_from_str(s, fmt)` | 書式を指定して、文字列を、日付にする |
| `dt + TimeDelta` / `dt - dt` | 時間の加算と、差の計算 |
| `dt.with_timezone(&tz)` | 同じ時点を、別のタイムゾーンで表す |
| `dt.timestamp()` | UNIX タイムスタンプ (秒) |

### 型の変換の全体像

```text
NaiveDateTime ──and_utc()──────────▶ DateTime<Utc>
NaiveDateTime ──and_local_timezone(tz)──▶ MappedLocalTime<DateTime<Tz>>
DateTime<Tz>  ──naive_local()──────▶ NaiveDateTime (その地域の壁時計)
DateTime<Tz>  ──naive_utc()────────▶ NaiveDateTime (UTC の壁時計)
DateTime<Tz>  ──with_timezone(&tz2)─▶ DateTime<Tz2> (同じ時点)
DateTime<Tz>  ──date_naive()───────▶ NaiveDate
DateTime<Tz>  ──time()─────────────▶ NaiveTime
```

<pre><code class="tips">タイムゾーンのない値 (Naive) から、タイムゾーンのある値に変えるときは、and_utc() か and_local_timezone() を使う。
前者は、UTC として解釈するため、常に 1つに決まる。後者は、夏時間などで、1つに決まらないことがあるため、結果が MappedLocalTime で返る。</code></pre>

---

## 日時の作成 <a id="create" data-name="日時の作成"></a>

### 日付と時刻

```rust
use chrono::{NaiveDate, NaiveDateTime, NaiveTime};

fn main() {
    // 不正な値は None になる (panic しない _opt の付いた関数を使う)
    let date = NaiveDate::from_ymd_opt(2026, 11, 19).unwrap();
    let time = NaiveTime::from_hms_opt(9, 30, 0).unwrap();

    // 日付と時刻を組み合わせる
    let dt = NaiveDateTime::new(date, time);
    assert_eq!(dt, date.and_hms_opt(9, 30, 0).unwrap());

    // 存在しない日付は None
    assert!(NaiveDate::from_ymd_opt(2026, 2, 29).is_none());
    assert!(NaiveDate::from_ymd_opt(2026, 13, 1).is_none());
    assert!(NaiveTime::from_hms_opt(24, 0, 0).is_none());

    // ミリ秒、マイクロ秒、ナノ秒つき
    let t = NaiveTime::from_hms_milli_opt(9, 30, 0, 123).unwrap();
    println!("{t}"); // 09:30:00.123
}
```

| メソッド | 内容 |
| --- | --- |
| `NaiveDate::from_ymd_opt(y, m, d)` | 年、月、日 |
| `NaiveDate::from_yo_opt(y, ordinal)` | 年と、年内の通算日 (1〜366) |
| `NaiveDate::from_isoywd_opt(y, week, weekday)` | ISO 8601 の年、週、曜日 |
| `NaiveDate::from_weekday_of_month_opt(y, m, weekday, n)` | 月の、第 n 番目の曜日 |
| `NaiveTime::from_hms_opt(h, m, s)` | 時、分、秒 |
| `NaiveTime::from_hms_milli_opt(h, m, s, ms)` | ミリ秒つき (`_micro_opt`、`_nano_opt` もある) |
| `date.and_hms_opt(h, m, s)` | 日付に、時刻を足して、`NaiveDateTime` にする |
| `date.and_time(time)` | 日付と `NaiveTime` から、`NaiveDateTime` にする |
| `NaiveTime::MIN` / `NaiveDate::MIN` / `NaiveDate::MAX` | 最小と最大の値 |

<pre><code class="caution">古い記事にある、_opt の付かない関数 (NaiveDate::from_ymd、and_hms など) は、不正な値で panic するため、非推奨になっている。
必ず、_opt の付いた関数を使い、Option を処理する。</code></pre>

### タイムゾーンつきの日時

```rust
use chrono::prelude::*;

fn main() {
    // UTC
    let utc = Utc.with_ymd_and_hms(2026, 11, 19, 9, 30, 0).unwrap();

    // 固定のオフセット (日本は UTC+9)
    let jst = FixedOffset::east_opt(9 * 3600).unwrap();
    let dt_jst = jst.with_ymd_and_hms(2026, 11, 19, 18, 30, 0).unwrap();

    // 同じ時点なので、等しい
    assert_eq!(utc, dt_jst);
    println!("{}", dt_jst.to_rfc3339()); // 2026-11-19T18:30:00+09:00

    // 別のタイムゾーンで表す (時点は変わらない)
    let converted = utc.with_timezone(&jst);
    assert_eq!(converted.to_rfc3339(), "2026-11-19T18:30:00+09:00");
}
```

`with_ymd_and_hms()` は、`MappedLocalTime` を返す。`Utc` と `FixedOffset` では、必ず `Single` になるため、`.unwrap()` でよい。夏時間のあるタイムゾーンでは、そうとは限らない (<a href="#timezone">タイムゾーン</a>の章を参照)。

| メソッド | 内容 |
| --- | --- |
| `FixedOffset::east_opt(secs)` | 東向き (UTC より進んだ側) の、秒数でのオフセット |
| `FixedOffset::west_opt(secs)` | 西向きのオフセット |
| `tz.with_ymd_and_hms(...)` | 現地の年月日と時分秒から作る |
| `tz.from_local_datetime(&naive)` | `NaiveDateTime` を、そのタイムゾーンの現地時刻として、解釈する |
| `tz.from_utc_datetime(&naive)` | `NaiveDateTime` を、UTC として解釈して、そのタイムゾーンで表す |

<pre><code class="tips">日本標準時 (JST) は、夏時間がなく、UTC+9 で固定である。日本だけを扱うなら、FixedOffset::east_opt(9 * 3600) で足りる。
複数の国や、夏時間を扱う場合は、chrono-tz の IANA タイムゾーンを使う。</code></pre>

---

## 取得と置換 <a id="datelike" data-name="取得と置換"></a>

年月日は `Datelike` トレイト、時分秒は `Timelike` トレイトで取得する。`NaiveDate`、`NaiveDateTime`、`DateTime<Tz>` などが実装している (`prelude` に含まれる)。

### 取得

```rust
use chrono::prelude::*;

fn main() {
    let dt = Utc.with_ymd_and_hms(2026, 11, 19, 9, 30, 15).unwrap();

    println!("{}", dt.year());    // 2026
    println!("{}", dt.month());   // 11
    println!("{}", dt.day());     // 19
    println!("{}", dt.hour());    // 9
    println!("{}", dt.minute());  // 30
    println!("{}", dt.second());  // 15
    println!("{}", dt.weekday()); // Thu
    println!("{}", dt.ordinal()); // 323 (年内の通算日)

    assert_eq!(dt.weekday(), Weekday::Thu);
    assert_eq!(dt.iso_week().week(), 47);
    assert_eq!(dt.quarter(), 4);
    assert_eq!(dt.num_days_in_month(), 30);
}
```

| `Datelike` のメソッド | 内容 |
| --- | --- |
| `year()` / `month()` / `day()` | 年、月 (1〜12)、日 (1〜31) |
| `month0()` / `day0()` | 0 から始まる月、日 |
| `ordinal()` | 年内の通算日 (1〜366) |
| `weekday()` | 曜日 (`Weekday`) |
| `iso_week()` | ISO 8601 の週 (`IsoWeek`) |
| `quarter()` | 四半期 (1〜4) |
| `num_days_in_month()` | その月の日数 |
| `num_days_from_ce()` | 西暦 1 年 1 月 1 日からの日数 |
| `year_ce()` | 西暦の年 (紀元前かどうかと、年の組) |

| `Timelike` のメソッド | 内容 |
| --- | --- |
| `hour()` / `minute()` / `second()` | 時 (0〜23)、分、秒 |
| `nanosecond()` | 秒未満のナノ秒 |
| `hour12()` | 12 時間制の時 (午後かどうかと、時の組) |
| `num_seconds_from_midnight()` | 0 時からの秒数 |

### 置換

`with_` で始まるメソッドは、一部だけを置き換えた、新しい値を返す。元の値は変わらない。存在しない値になる場合は `None` を返す。

```rust
use chrono::prelude::*;

fn main() {
    let dt = Utc.with_ymd_and_hms(2026, 11, 19, 9, 30, 15).unwrap();

    // 月初の 0 時 0 分 0 秒
    let first = dt
        .with_day(1)
        .unwrap()
        .with_hour(0)
        .unwrap()
        .with_minute(0)
        .unwrap()
        .with_second(0)
        .unwrap();
    println!("{}", first.to_rfc3339()); // 2026-11-01T00:00:00+00:00

    // 11 月に 31 日はないので None
    assert!(dt.with_day(31).is_none());
}
```

<pre><code class="tips">時刻を 0 時にしたいだけなら、with_hour などを重ねるよりも、日付を取り出して、and_hms_opt(0, 0, 0) で作り直す方が、短く書ける。
日単位や、時間単位で切り捨てたい場合は、「丸めと切り捨て」の章の duration_trunc が使える。</code></pre>

<pre><code class="caution">with_month() は、日が存在しない月になる場合 (1 月 31 日を 2 月にする、など) に None を返す。月を加算する場合は、with_month() ではなく、Months を使った加算 (「時間の計算」の章) を使う。</code></pre>

---

## 文字列への変換 <a id="format" data-name="文字列への変換"></a>

### format()

`format()` に、strftime に似た書式を渡す。`to_string()` で `String` になり、`println!` にも、そのまま渡せる。

```rust
use chrono::prelude::*;

fn main() {
    let dt = Utc.with_ymd_and_hms(2026, 11, 5, 9, 3, 7).unwrap();

    println!("{}", dt.format("%Y-%m-%d %H:%M:%S")); // 2026-11-05 09:03:07
    println!("{}", dt.format("%Y/%-m/%-d"));        // 2026/11/5 (ゼロ埋めなし)
    println!("{}", dt.format("%a %b %e %Y"));       // Thu Nov  5 2026
    println!("{}", dt.format("%A, %B %d"));         // Thursday, November 05
    println!("{}", dt.format("%I:%M %p"));          // 09:03 AM
    println!("{}", dt.format("%Y年%m月%d日 %H時%M分")); // 2026年11月05日 09時03分
}
```

### 主な書式指定子

| 指定子 | 内容 | 例 |
| --- | --- | --- |
| `%Y` / `%y` | 年 (4 桁) / 年 (下 2 桁) | `2026` / `26` |
| `%m` | 月 (ゼロ埋め) | `11` |
| `%d` | 日 (ゼロ埋め) | `05` |
| `%e` | 日 (空白埋め) | ` 5` |
| `%-d` / `%-m` / `%-H` | パディングなし | `5` |
| `%H` / `%I` | 時 (24 時間制) / 時 (12 時間制) | `09` |
| `%M` / `%S` | 分 / 秒 | `03` / `07` |
| `%p` / `%P` | AM / PM (大文字) / am / pm (小文字) | `AM` / `am` |
| `%a` / `%A` | 曜日 (短い形式 / 長い形式) | `Thu` / `Thursday` |
| `%b` / `%B` | 月名 (短い形式 / 長い形式) | `Nov` / `November` |
| `%j` | 年内の通算日 | `309` |
| `%u` / `%w` | 曜日の番号 (月曜が 1) / (日曜が 0) | `4` / `4` |
| `%F` / `%T` / `%R` | `%Y-%m-%d` / `%H:%M:%S` / `%H:%M` | `2026-11-05` |
| `%f` | ナノ秒 (9 桁) | `123456789` |
| `%.3f` / `%.6f` | 小数点つきの、ミリ秒 / マイクロ秒 | `.123` / `.123456` |
| `%z` / `%:z` | オフセット | `+0900` / `+09:00` |
| `%Z` | タイムゾーンの名前 | `UTC`、`JST` (chrono-tz) |
| `%s` | UNIX タイムスタンプ (秒) | `1793869387` |
| `%+` | ISO 8601 / RFC 3339 の形式 | `2026-11-05T09:03:07.123456789+00:00` |
| `%%` | `%` そのもの | `%` |

<pre><code class="caution">format() に、サポートされていない指定子 (%#z など) を渡すと、to_string() や println! の時点で panic する。
ユーザーが入力した書式を使う場合は、先に StrftimeItems::new(fmt).parse() で検証し、エラーを処理する。</code></pre>

```rust
use chrono::format::StrftimeItems;

fn main() {
    // 書式を、事前に検証する
    assert!(StrftimeItems::new("%Y-%m-%d").parse().is_ok());
    assert!(StrftimeItems::new("%Q").parse().is_err());
}
```

### RFC 3339 と RFC 2822

API や、ログで使う、標準的な形式は、専用のメソッドがある。

```rust
use chrono::prelude::*;

fn main() {
    let dt = Utc.with_ymd_and_hms(2026, 11, 5, 9, 3, 7).unwrap();

    println!("{}", dt.to_rfc3339());  // 2026-11-05T09:03:07+00:00
    println!("{}", dt.to_rfc2822());  // Thu, 5 Nov 2026 09:03:07 +0000

    // 小数秒の桁数と、UTC を Z と書くかどうかを、指定する
    println!("{}", dt.to_rfc3339_opts(SecondsFormat::Millis, true)); // 2026-11-05T09:03:07.000Z
    println!("{}", dt.to_rfc3339_opts(SecondsFormat::Secs, true));   // 2026-11-05T09:03:07Z
}
```

| `SecondsFormat` | 内容 |
| --- | --- |
| `Secs` | 秒まで (小数なし) |
| `Millis` / `Micros` / `Nanos` | 小数 3 桁 / 6 桁 / 9 桁 |
| `AutoSi` | 必要な桁数 (0、3、6、9 桁) を、自動で選ぶ |

### Display と Debug

| 型 | `{}` (Display) | `{:?}` (Debug) |
| --- | --- | --- |
| `DateTime<Utc>` | `2026-11-05 09:03:07 UTC` | `2026-11-05T09:03:07Z` |
| `DateTime<FixedOffset>` | `2026-11-05 18:03:07 +09:00` | `2026-11-05T18:03:07+09:00` |
| `NaiveDateTime` | `2026-11-05 09:03:07` | `2026-11-05T09:03:07` |
| `NaiveDate` | `2026-11-05` | `2026-11-05` |
| `NaiveTime` | `09:03:07` | `09:03:07` |
| `TimeDelta` | `PT3725S` (ISO 8601 の期間) | `TimeDelta { secs: 3725, nanos: 0 }` |

<pre><code class="tips">ログに出す場合は、to_rfc3339() か、Debug の形式 ({:?}) が、機械で読み直せて、扱いやすい。
人が読む表示には、format() で、必要な書式を指定する。</code></pre>

### 日本語での表示 (ロケール)

`format()` の `%a` や `%B` は、英語で出力される。日本語で出したい場合は、`unstable-locales` フィーチャーを有効にして、`format_localized()` を使う。

```toml
[dependencies]
chrono = { version = "0.4", features = ["unstable-locales"] }
```

```rust
use chrono::prelude::*;

fn main() {
    let dt = Utc.with_ymd_and_hms(2026, 11, 19, 9, 30, 0).unwrap();

    println!("{}", dt.format_localized("%A %B %d", Locale::ja_JP)); // 木曜日 11月 19
    println!("{}", dt.format_localized("%x %X", Locale::ja_JP));    // 2026年11月19日 09時30分00秒
    println!("{}", dt.format_localized("%A %B", Locale::fr_FR));    // jeudi novembre
}
```

<pre><code class="caution">unstable-locales は、API が、パッチバージョンで変わったり、なくなったりする可能性があると、明記されている。
日本語の曜日だけが必要なら、["日", "月", "火", "水", "木", "金", "土"] のような配列を、weekday().num_days_from_sunday() で引く方が、依存が少なく、安定する。</code></pre>

```rust
use chrono::prelude::*;

fn main() {
    let d = NaiveDate::from_ymd_opt(2026, 11, 19).unwrap();
    let names = ["日", "月", "火", "水", "木", "金", "土"];
    let w = names[d.weekday().num_days_from_sunday() as usize];
    println!("{}年{}月{}日 ({})", d.year(), d.month(), d.day(), w); // 2026年11月19日 (木)
}
```

---

## 文字列からの解析 <a id="parse" data-name="文字列からの解析"></a>

### 主なメソッド

| メソッド | 対象の文字列 | 結果 |
| --- | --- | --- |
| `DateTime::parse_from_rfc3339(s)` | RFC 3339 (`2026-11-19T09:30:00+09:00`) | `DateTime<FixedOffset>` |
| `DateTime::parse_from_rfc2822(s)` | RFC 2822 (`Thu, 19 Nov 2026 09:30:00 +0900`) | `DateTime<FixedOffset>` |
| `DateTime::parse_from_str(s, fmt)` | 書式で指定。**オフセットが必要** | `DateTime<FixedOffset>` |
| `NaiveDateTime::parse_from_str(s, fmt)` | 書式で指定。オフセットは不要 | `NaiveDateTime` |
| `NaiveDate::parse_from_str(s, fmt)` | 書式で指定 | `NaiveDate` |
| `NaiveTime::parse_from_str(s, fmt)` | 書式で指定 | `NaiveTime` |
| `s.parse::<T>()` | 標準の形式 (`FromStr`) | `T` |
| `NaiveDate::parse_and_remainder(s, fmt)` | 書式で指定。残りの文字列も返す | `(NaiveDate, &str)` |

### 例

```rust
use chrono::prelude::*;

fn main() -> Result<(), chrono::ParseError> {
    // RFC 3339: オフセットつき
    let dt = DateTime::parse_from_rfc3339("2026-11-19T09:30:00+09:00")?;
    println!("{}", dt.with_timezone(&Utc)); // 2026-11-19 00:30:00 UTC

    // 書式を指定: オフセットがあれば、DateTime になる
    let dt2 = DateTime::parse_from_str("2026-11-19 09:30:00 +0900", "%Y-%m-%d %H:%M:%S %z")?;
    assert_eq!(dt, dt2);

    // 書式を指定: オフセットがなければ、Naive になる
    let n = NaiveDateTime::parse_from_str("2026-11-19 09:30:00", "%Y-%m-%d %H:%M:%S")?;
    let d = NaiveDate::parse_from_str("2026/11/19", "%Y/%m/%d")?;
    let t = NaiveTime::parse_from_str("09:30", "%H:%M")?;
    println!("{n} {d} {t}");

    // FromStr (標準の形式)
    let utc: DateTime<Utc> = "2026-11-19T09:30:00+09:00".parse()?; // UTC に変換される
    let date: NaiveDate = "2026-11-19".parse()?;
    println!("{utc} {date}");

    Ok(())
}
```

### 日付だけの文字列から日時を作る

`DateTime::parse_from_str` は、オフセットが必要なため、日付だけの文字列は、エラーになる。`NaiveDate` として解析してから、時刻とタイムゾーンを足す。

```rust
use chrono::prelude::*;
use chrono_tz::Asia::Tokyo;

fn main() -> Result<(), chrono::ParseError> {
    let date = NaiveDate::parse_from_str("2026-11-19", "%Y-%m-%d")?;

    // UTC の 0 時
    let utc_midnight = date.and_hms_opt(0, 0, 0).unwrap().and_utc();

    // 東京の 0 時 (夏時間がないため、single() は必ず Some)
    let tokyo_midnight = date
        .and_hms_opt(0, 0, 0)
        .unwrap()
        .and_local_timezone(Tokyo)
        .single()
        .unwrap();

    println!("{utc_midnight} / {tokyo_midnight}");
    Ok(())
}
```

### エラーの種類

解析に失敗すると、`ParseError` が返る。`{}` で、メッセージを表示できる。

| 入力と書式 | エラー | 原因 |
| --- | --- | --- |
| `"2026-11-19"` を `%Y-%m-%d %H:%M:%S` で解析 | `TooShort` | 書式の途中 (時刻の部分) で、文字列が終わっている |
| `"2026-11-19"` を `NaiveDateTime::parse_from_str` に、`%Y-%m-%d` で渡す | `NotEnough` | 書式に時刻がなく、`NaiveDateTime` を作る情報が足りない |
| `"2026-11-19"` を `DateTime::parse_from_str` に、`%Y-%m-%d` で渡す | `NotEnough` | オフセットの情報がない |
| `"2026-11-31"` を `%Y-%m-%d` で解析 | `OutOfRange` | 存在しない日付 (形式は、合っている) |
| `"2026-01-05x"` を `%Y-%m-%d` で解析 | `TooLong` | 書式の後ろに、余分な文字がある |
| `"2026-11"` を `%Y-%m-%d` で解析 | `TooShort` | 文字列が、途中で終わっている |

### 解析の寛容さ

| 入力 | 結果 |
| --- | --- |
| `"2026-1-5"` を `%Y-%m-%d` で解析 | 成功する (ゼロ埋めがなくても、読める) |
| `" 2026-01-05"` (先頭に空白) | 成功する |
| `"2026-01-05 "` (末尾に空白) | `TooLong` で失敗する |
| `parse_from_rfc3339("2026-11-19 09:30:00+09:00")` (`T` の代わりに空白) | 成功する |
| `"2026-11-19 09:30:00".parse::<NaiveDateTime>()` | **失敗する** (標準の形式は `T` 区切り) |
| `%Z` (タイムゾーンの名前) だけで、`DateTime` を解析 | 失敗する (名前から、オフセットは決まらない) |

<pre><code class="caution">空白区切りの日時 (2026-11-19 09:30:00) は、str::parse::&lt;NaiveDateTime&gt;() では解析できない。
NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S") を使う。</code></pre>

<pre><code class="tips">日時を解析するときは、解析に使う書式と、データの形式 (ゼロ埋め、区切り文字、オフセットの有無) を、先に確認する。
外部のデータは、形式が揃っていないことが多い。解析できない行は、読み飛ばすか、エラーとして記録する。</code></pre>

---

## 時間の計算 <a id="arithmetic" data-name="時間の計算"></a>

### TimeDelta (時間の長さ)

`TimeDelta` は、符号つきの、時間の長さを表す (以前の名前は `Duration` で、現在も別名として使える)。標準ライブラリの `std::time::Duration` と違い、負の値を持てる。

```rust
use chrono::prelude::*;
use chrono::TimeDelta;

fn main() {
    let dt = Utc.with_ymd_and_hms(2026, 11, 19, 9, 30, 0).unwrap();

    // 作る (範囲外なら None)
    let week = TimeDelta::try_days(7).unwrap();
    let ten_hours = TimeDelta::try_hours(10).unwrap();

    // 加算と減算
    let later = dt + week;
    let earlier = dt - ten_hours;
    println!("{later} / {earlier}");

    // 差
    let diff: TimeDelta = later - dt;
    println!("{} 日 / {} 時間", diff.num_days(), diff.num_hours()); // 7 日 / 168 時間

    // 比較
    assert!(dt < later);
}
```

| メソッド | 内容 |
| --- | --- |
| `TimeDelta::try_days(n)` | n 日 (範囲外なら `None`)。`try_hours`、`try_minutes`、`try_seconds` もある |
| `TimeDelta::days(n)` | n 日。範囲外だと panic する (`hours`、`minutes`、`seconds` なども) |
| `TimeDelta::zero()` | 長さ 0 |
| `td.num_days()` | 日数 (小数は切り捨て)。`num_hours()`、`num_minutes()`、`num_seconds()` もある |
| `TimeDelta::MAX` / `TimeDelta::MIN` | 最大と最小 |
| `TimeDelta::from_std(d)` | `std::time::Duration` から変換する (範囲外なら `Err`) |
| `td.to_std()` | `std::time::Duration` に変換する (負の値は `Err`) |
| `dt.checked_add_signed(td)` | 範囲外のとき、panic せずに `None` を返す加算 |

<pre><code class="tips">固定の値 (7 日、10 時間など) には、TimeDelta::days() のような短い書き方でも、panic しない。
ユーザーの入力や、外部のデータから作る値には、try_days() などを使い、None を処理する。</code></pre>

### 月と日の単位での加算 (Months / Days)

`TimeDelta` は、秒数での加算である。「1 か月後」のように、暦の上での加算には、`Months` と `Days` を使う。

```rust
use chrono::{Days, Months, NaiveDate};

fn main() {
    let jan31 = NaiveDate::from_ymd_opt(2026, 1, 31).unwrap();

    // 31 日がない月は、その月の末日に丸められる
    let feb = jan31.checked_add_months(Months::new(1)).unwrap();
    println!("{feb}"); // 2026-02-28

    let nov = jan31.checked_sub_months(Months::new(2)).unwrap();
    println!("{nov}"); // 2025-11-30

    // 演算子でも書ける (範囲外のとき panic する)
    assert_eq!(jan31 + Months::new(1), feb);

    // 日数
    println!("{}", jan31 + Days::new(30)); // 2026-03-02
}
```

`Months` と `Days` は、`NaiveDate`、`NaiveDateTime`、`DateTime<Tz>` に使える。

<pre><code class="caution">月の加算は、月末の日付で、結果が変わる。1 月 31 日に 1 か月を足すと 2 月 28 日になり、さらに 1 か月を足しても 3 月 28 日で、3 月 31 日には戻らない。
月末を基準にしたい場合は、元の日付に、加算する月数をまとめて足す (31 日 + 2 か月 = 3 月 31 日)。</code></pre>

### 差の計算

```rust
use chrono::NaiveDate;

fn main() {
    let a = NaiveDate::from_ymd_opt(2026, 1, 1).unwrap();
    let b = NaiveDate::from_ymd_opt(2026, 12, 25).unwrap();

    // 日数の差 (どちらの書き方でもよい)
    println!("{}", b.signed_duration_since(a).num_days()); // 358
    println!("{}", (b - a).num_days());                    // 358

    // 年齢 (満年齢)
    let birth = NaiveDate::from_ymd_opt(1990, 5, 20).unwrap();
    let today = NaiveDate::from_ymd_opt(2026, 11, 19).unwrap();
    println!("{:?}", today.years_since(birth)); // Some(36)
}
```

`years_since()` は、満年齢を返す。`base` の方が未来のときは `None` になる。

### 標準ライブラリとの変換

```rust
use chrono::{DateTime, TimeDelta, Utc};
use std::time::{Duration, SystemTime};

fn main() {
    // Duration
    let td = TimeDelta::from_std(Duration::from_secs(90)).unwrap();
    println!("{}", td.num_seconds()); // 90

    // SystemTime
    let dt: DateTime<Utc> = SystemTime::now().into();
    let back: SystemTime = dt.into();
    let _ = back;
}
```

<pre><code class="tips">処理にかかった時間を測るには、chrono ではなく、std::time::Instant を使う。
Instant は、時計の調整 (NTP や、手動での変更) の影響を受けないが、DateTime は、システム時刻に基づくため、時計が戻ると、差が負になることがある。</code></pre>

---

## タイムゾーン <a id="timezone" data-name="タイムゾーン"></a>

### 標準のタイムゾーン

| 型 | 内容 |
| --- | --- |
| `Utc` | 協定世界時 (UTC) |
| `Local` | OS に設定されたタイムゾーン (`clock` フィーチャーが必要) |
| `FixedOffset` | 固定の時差 (夏時間なし) |

```rust
use chrono::prelude::*;

fn main() {
    let utc = Utc.with_ymd_and_hms(2026, 11, 19, 0, 0, 0).unwrap();

    // 同じ時点を、別のタイムゾーンで表す
    let jst = utc.with_timezone(&FixedOffset::east_opt(9 * 3600).unwrap());
    let local = utc.with_timezone(&Local);
    println!("{jst} / {local}");

    // オフセットの取得
    println!("{}", jst.offset().local_minus_utc()); // 32400 (秒)

    // 壁時計の時刻
    println!("{}", jst.naive_local()); // 2026-11-19 09:00:00
    println!("{}", jst.naive_utc());   // 2026-11-19 00:00:00
}
```

### IANA のタイムゾーン (chrono-tz)

`Asia/Tokyo` や `America/New_York` のような、IANA のタイムゾーンは、`chrono-tz` crate で使う。夏時間などの規則を含む。

```rust
use chrono::prelude::*;
use chrono_tz::{Asia::Tokyo, America::New_York, Tz};

fn main() {
    let utc = Utc.with_ymd_and_hms(2026, 11, 19, 0, 0, 0).unwrap();

    // 型として指定する
    let tokyo = utc.with_timezone(&Tokyo);
    let ny = utc.with_timezone(&New_York);
    println!("{tokyo}"); // 2026-11-19 09:00:00 JST
    println!("{ny}");    // 2026-11-18 19:00:00 EST
    println!("{}", tokyo.format("%Z")); // JST

    // 文字列から指定する (設定ファイルやユーザーの入力など)
    let tz: Tz = "America/New_York".parse().unwrap();
    assert_eq!(tz, New_York);
    assert!("Mars/Olympus".parse::<Tz>().is_err());
}
```

<pre><code class="tips">chrono-tz の Tz は、タイムゾーン名ごとの列挙型で、DateTime&lt;Tz&gt; として、chrono の API をそのまま使える。
タイムゾーンのデータは、crate に埋め込まれている。tzdata の更新を取り込むには、chrono-tz のバージョンを上げる。</code></pre>

### 存在しない時刻と、2 回ある時刻

夏時間のあるタイムゾーンでは、現地の時刻が、1つの時点に決まらないことがある。

| 状況 | 例 (America/New_York) | `MappedLocalTime` |
| --- | --- | --- |
| 時計が進んで、存在しない時刻ができる | 2026年3月8日 2:30 | `None` |
| 時計が戻って、同じ時刻が 2 回ある | 2026年11月1日 1:30 | `Ambiguous(早い方, 遅い方)` |
| 通常 | それ以外 | `Single(日時)` |

```rust
use chrono::prelude::*;
use chrono::{LocalResult, TimeDelta};
use chrono_tz::America::New_York;

fn main() {
    // 存在しない時刻 (夏時間の開始で、2:00 が 3:00 になる)
    let none = New_York.with_ymd_and_hms(2026, 3, 8, 2, 30, 0);
    assert!(matches!(none, LocalResult::None));

    // 2 回ある時刻 (夏時間の終了で、2:00 が 1:00 に戻る)
    let amb = New_York.with_ymd_and_hms(2026, 11, 1, 1, 30, 0);
    println!("{amb:?}"); // Ambiguous(2026-11-01T01:30:00EDT, 2026-11-01T01:30:00EST)

    let early = amb.earliest().unwrap(); // 夏時間 (EDT)
    let late = amb.latest().unwrap();    // 標準時 (EST)
    assert_eq!(late - early, TimeDelta::hours(1));

    // 1 つに決まるときだけ受け取る
    if let Some(dt) = New_York.with_ymd_and_hms(2026, 11, 19, 9, 0, 0).single() {
        println!("{dt}");
    }
}
```

| メソッド | 内容 |
| --- | --- |
| `single()` | `Single` のときだけ `Some`。それ以外は `None` |
| `earliest()` | `Single` なら、その値。`Ambiguous` なら、早い方。`None` なら、`None` |
| `latest()` | `Single` なら、その値。`Ambiguous` なら、遅い方。`None` なら、`None` |
| `unwrap()` | `Single` なら、その値。それ以外は panic する |

<pre><code class="caution">夏時間のあるタイムゾーンで、with_ymd_and_hms(...).unwrap() とすると、年に 2 回ある、特定の 1 時間の入力で panic する。
ユーザーの入力や、スケジュールの計算では、MappedLocalTime の 3 つの場合を、すべて処理する。
Local も、同じ理由で、MappedLocalTime を返す。</code></pre>

### 夏時間をまたぐ加算

日数の加算 (`Days`) と、時間の加算 (`TimeDelta`) は、夏時間をまたぐと、結果が変わる。

```rust
use chrono::prelude::*;
use chrono::{Days, TimeDelta};
use chrono_tz::America::New_York;

fn main() {
    // 2026年3月8日に、夏時間が始まる (3 月 7 日の 12 時は、まだ標準時)
    let before = New_York.with_ymd_and_hms(2026, 3, 7, 12, 0, 0).unwrap();

    // 暦の上で 1 日後: 現地の同じ時刻 (12 時)
    let plus_day = before.checked_add_days(Days::new(1)).unwrap();
    // 24 時間後: 時計の上では、13 時
    let plus_24h = before + TimeDelta::hours(24);

    println!("{plus_day}"); // 2026-03-08 12:00:00 EDT
    println!("{plus_24h}"); // 2026-03-08 13:00:00 EDT
}
```

<pre><code class="tips">「翌日の同じ時刻」には Days、「ちょうど 24 時間後」には TimeDelta を使う。
タイムゾーンが Utc の場合は、夏時間がないため、どちらも同じ結果になる。</code></pre>

### 今日の日付を、特定のタイムゾーンで得る

`Utc::now().date_naive()` は、UTC の日付である。日本の「今日」は、タイムゾーンを変えてから、日付を取り出す。

```rust
use chrono::prelude::*;
use chrono_tz::Asia::Tokyo;

fn main() {
    let today_tokyo: NaiveDate = Utc::now().with_timezone(&Tokyo).date_naive();
    println!("{today_tokyo}");
}
```

### 環境ごとの注意 (Local)

| 環境 | 注意 |
| --- | --- |
| `wasm32` (ブラウザ) | `Local` は、JavaScript の `Date` を使う (`wasmbind`)。夏時間の境目でも、`MappedLocalTime` が、常に `Single` で返る |
| `no_std` | `Local` は使えない (`clock` が必要)。`Utc` と `FixedOffset` は使える |
| コンテナ、サーバー | OS のタイムゾーンが、UTC のことが多い。ユーザーの地域に合わせる場合は、`Local` に頼らず、タイムゾーンを明示する |

---

## UNIX タイムスタンプ <a id="timestamp" data-name="UNIXタイムスタンプ"></a>

UNIX タイムスタンプは、1970年1月1日 0 時 0 分 0 秒 (UTC) からの経過時間である。タイムゾーンに依存しない、1つの時点を表すため、データベースや、API でのやり取りに向いている。

```rust
use chrono::prelude::*;

fn main() {
    // タイムスタンプ → 日時 (範囲外なら None)
    let dt = DateTime::from_timestamp(1_700_000_000, 0).unwrap();
    println!("{}", dt.to_rfc3339()); // 2023-11-14T22:13:20+00:00

    let ms = DateTime::from_timestamp_millis(1_700_000_000_123).unwrap();
    println!("{}", ms.timestamp_subsec_millis()); // 123

    // 日時 → タイムスタンプ
    println!("{}", dt.timestamp());        // 1700000000 (秒)
    println!("{}", ms.timestamp_millis()); // 1700000000123 (ミリ秒)

    // UNIX エポック
    assert_eq!(DateTime::UNIX_EPOCH.timestamp(), 0);

    // NaiveDateTime は、UTC として解釈してから取り出す
    let n = NaiveDate::from_ymd_opt(2026, 11, 19)
        .unwrap()
        .and_hms_opt(0, 0, 0)
        .unwrap();
    println!("{}", n.and_utc().timestamp()); // 1795046400
}
```

| メソッド | 内容 |
| --- | --- |
| `DateTime::from_timestamp(secs, nsecs)` | 秒とナノ秒から、`DateTime<Utc>` を作る (範囲外なら `None`) |
| `DateTime::from_timestamp_secs(secs)` | 秒から作る |
| `DateTime::from_timestamp_millis(ms)` | ミリ秒から作る |
| `DateTime::from_timestamp_micros(us)` | マイクロ秒から作る |
| `DateTime::from_timestamp_nanos(ns)` | ナノ秒から作る (範囲外にならない) |
| `dt.timestamp()` | 秒 |
| `dt.timestamp_millis()` / `dt.timestamp_micros()` | ミリ秒 / マイクロ秒 |
| `dt.timestamp_nanos_opt()` | ナノ秒 (`i64` に収まらない場合は `None`) |
| `dt.timestamp_subsec_millis()` | 秒未満の部分 (ミリ秒) |

<pre><code class="caution">タイムスタンプの単位 (秒かミリ秒か) の取り違えは、よくある間違いである。
10 桁なら秒、13 桁ならミリ秒であることが多い。ミリ秒を from_timestamp() に渡すと、遠い未来の日付になるか、None になる。</code></pre>

<pre><code class="tips">タイムスタンプは、i64 で表されるため、いわゆる 2038 年問題は起きない。
ナノ秒を i64 で表せるのは、西暦 1677 年頃から 2262 年頃までである。timestamp_nanos() ではなく、範囲外を None にする timestamp_nanos_opt() を使う。</code></pre>

---

## 丸めと切り捨て <a id="rounding" data-name="丸めと切り捨て"></a>

### 秒未満の丸め (SubsecRound)

`SubsecRound` は、`prelude` に含まれる。

```rust
use chrono::prelude::*;

fn main() {
    let dt = Utc
        .with_ymd_and_hms(2026, 11, 19, 9, 37, 45)
        .unwrap()
        .with_nanosecond(123_456_789)
        .unwrap();

    // ミリ秒 (3 桁) までに切り捨て
    println!("{}", dt.trunc_subsecs(3).nanosecond()); // 123000000
    // 四捨五入
    println!("{}", dt.round_subsecs(3).nanosecond()); // 123000000
    // 秒未満を切り捨てる
    println!("{}", dt.trunc_subsecs(0).second());     // 45
}
```

### 時間単位での丸め (DurationRound)

`DurationRound` トレイトを、`use` して使う。

```rust
use chrono::prelude::*;
use chrono::{DurationRound, TimeDelta};

fn main() {
    let dt = Utc.with_ymd_and_hms(2026, 11, 19, 9, 37, 45).unwrap();

    // 1 時間単位で切り捨て
    let hour = dt.duration_trunc(TimeDelta::try_hours(1).unwrap()).unwrap();
    println!("{}", hour.to_rfc3339()); // 2026-11-19T09:00:00+00:00

    // 15 分単位で切り捨て
    let quarter = dt.duration_trunc(TimeDelta::try_minutes(15).unwrap()).unwrap();
    println!("{}", quarter.minute()); // 30

    // 1 時間単位で四捨五入 / 切り上げ
    println!("{}", dt.duration_round(TimeDelta::try_hours(1).unwrap()).unwrap().hour());    // 10
    println!("{}", dt.duration_round_up(TimeDelta::try_hours(1).unwrap()).unwrap().hour()); // 10

    // 日単位で切り捨て (UTC の 0 時)
    let day = dt.duration_trunc(TimeDelta::try_days(1).unwrap()).unwrap();
    println!("{}", day.hour()); // 0
}
```

| メソッド | 内容 |
| --- | --- |
| `duration_trunc(d)` | `d` の倍数に、切り捨てる |
| `duration_round(d)` | `d` の倍数に、四捨五入する |
| `duration_round_up(d)` | `d` の倍数に、切り上げる |

<pre><code class="tips">時間ごとの集計 (ログの件数を 1 時間ごとに数えるなど) では、duration_trunc で、時刻を揃えて、キーにする。
日付の境界 (現地の 0 時) が必要な場合は、duration_trunc ではなく、タイムゾーンを変えてから、日付を取り出して、作り直す。</code></pre>

---

## 暦の扱い <a id="calendar" data-name="暦の扱い"></a>

### 曜日 (Weekday) と月 (Month)

```rust
use chrono::prelude::*;

fn main() {
    // Weekday
    assert_eq!(Weekday::Mon.succ(), Weekday::Tue);
    assert_eq!(Weekday::Mon.pred(), Weekday::Sun);
    assert_eq!(Weekday::Sat.num_days_from_monday(), 5);
    assert_eq!(Weekday::Sun.num_days_from_sunday(), 0);
    let w: Weekday = "Fri".parse().unwrap();
    println!("{w}"); // Fri

    // Month
    let m = Month::November;
    println!("{} {}", m.number_from_month(), m.name()); // 11 November
    assert_eq!(Month::try_from(12u8).unwrap(), Month::December);
    assert_eq!(Month::January.pred(), Month::December);
}
```

### 月初・月末・第 n 曜日

```rust
use chrono::prelude::*;

fn main() {
    let d = NaiveDate::from_ymd_opt(2026, 11, 19).unwrap();

    // 月初
    let first = d.with_day(1).unwrap();
    // 月末 (その月の日数を使う)
    let last = d.with_day(d.num_days_in_month() as u32).unwrap();
    println!("{first} {last}"); // 2026-11-01 2026-11-30

    // 月末 (翌月 1 日の前日。年をまたぐ 12 月でも、そのまま使える)
    let next_first = NaiveDate::from_ymd_opt(2026, 12, 1).unwrap();
    assert_eq!(next_first.pred_opt().unwrap(), last);

    // 第 4 木曜日
    let th = NaiveDate::from_weekday_of_month_opt(2026, 11, Weekday::Thu, 4).unwrap();
    println!("{th}"); // 2026-11-26

    // うるう年かどうかは、2 月の日数で調べる
    assert_eq!(NaiveDate::from_ymd_opt(2024, 2, 1).unwrap().num_days_in_month(), 29);
    assert!(NaiveDate::from_ymd_opt(2100, 2, 29).is_none()); // 2100 年は、うるう年ではない
}
```

### 日付の範囲と ISO 週

```rust
use chrono::prelude::*;

fn main() {
    let d = NaiveDate::from_ymd_opt(2026, 11, 19).unwrap();

    // 月末まで、1 日ずつ進む
    let days: Vec<NaiveDate> = d.iter_days().take_while(|x| x.month() == 11).collect();
    println!("{}", days.len()); // 12 (19 日から 30 日まで)

    // ISO 8601 の週番号 (月曜始まりで、第 1 週は、その年の最初の木曜日を含む週)
    let iso = d.iso_week();
    println!("{} 年の第 {} 週", iso.year(), iso.week()); // 2026 年の第 47 週

    // 年・週・曜日から、日付を作る
    let w = NaiveDate::from_isoywd_opt(2026, 47, Weekday::Thu).unwrap();
    assert_eq!(w, d);
}
```

<pre><code class="caution">ISO 8601 の週の年 (iso_week().year()) は、暦の年 (year()) と、年末年始で、異なることがある。
たとえば、2026年12月31日は、ISO 週では 2026 年の第 53 週だが、2027年1月1日は、2026 年の第 53 週に属する (2027 年の第 1 週ではない)。週単位の集計では、iso_week().year() と week() を、組にして使う。</code></pre>

### 曜日の集合 (WeekdaySet)

営業日や、定休日のように、曜日の集合を扱うときは、`WeekdaySet` が使える。

```rust
use chrono::{Weekday, WeekdaySet};

fn main() {
    let holidays = WeekdaySet::from_array([Weekday::Sat, Weekday::Sun]);
    assert!(holidays.contains(Weekday::Sat));
    assert!(!holidays.contains(Weekday::Mon));
    println!("{}", holidays.len()); // 2
}
```

### うるう秒と範囲

| 項目 | 内容 |
| --- | --- |
| うるう秒 | `NaiveTime` は、`23:59:60` のように、ナノ秒の部分を 10 億以上にして表す (`from_hms_milli_opt(23, 59, 59, 1_500)` は `23:59:60.500`)。ほとんどの計算では、通常の秒として、扱われる |
| 日付の範囲 | `NaiveDate::MIN` から `NaiveDate::MAX` (およそ ±26 万年)。範囲外になる計算は、`checked_` 系で `None` になる |
| 時刻の循環 | `NaiveTime` に `TimeDelta` を足すと、24 時間で循環する (9:30 に 20 時間を足すと、5:30) |

<pre><code class="tips">NaiveTime どうしの引き算 (signed_duration_since) は、日をまたいだことを考慮しない。
日をまたぐ経過時間は、NaiveDateTime か、DateTime で計算する。</code></pre>

---

## serde (JSON など) <a id="serde" data-name="serde"></a>

`serde` フィーチャーを有効にすると、chrono の型が、`Serialize` と `Deserialize` を実装する。

```toml
[dependencies]
chrono = { version = "0.4", features = ["serde"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### 既定の形式

| 型 | JSON での表現 |
| --- | --- |
| `DateTime<Utc>` / `DateTime<FixedOffset>` | RFC 3339 の文字列 (`"2026-11-19T09:30:00Z"`、`"2026-11-19T09:30:00+09:00"`) |
| `NaiveDateTime` | `"2026-11-19T09:30:00"` |
| `NaiveDate` | `"2026-11-19"` |
| `NaiveTime` | `"09:30:00"` |

`DateTime<Utc>` を、オフセットつきの文字列から読むと、UTC に変換される。オフセットのない文字列は、エラーになる。

### タイムスタンプで保存する

`#[serde(with = "...")]` で、UNIX タイムスタンプの整数にできる。

| モジュール | 形式 |
| --- | --- |
| `chrono::serde::ts_seconds` | 秒 |
| `chrono::serde::ts_milliseconds` | ミリ秒 |
| `chrono::serde::ts_microseconds` | マイクロ秒 |
| `chrono::serde::ts_nanoseconds` | ナノ秒 |
| 上記に `_option` を付けたもの | `Option<DateTime<Utc>>` 用 (`null` を許す) |

```rust
use chrono::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, PartialEq)]
struct Event {
    name: String,
    // 既定: RFC 3339 の文字列
    starts_at: DateTime<Utc>,
    // UNIX タイムスタンプ (秒)
    #[serde(with = "chrono::serde::ts_seconds")]
    created: DateTime<Utc>,
    // ミリ秒。項目がなくても、null でもよい
    #[serde(default, with = "chrono::serde::ts_milliseconds_option")]
    deleted: Option<DateTime<Utc>>,
    date: NaiveDate,
}

fn main() {
    let ev = Event {
        name: "release".into(),
        starts_at: Utc.with_ymd_and_hms(2026, 11, 19, 9, 30, 0).unwrap(),
        created: Utc.with_ymd_and_hms(2026, 11, 1, 0, 0, 0).unwrap(),
        deleted: None,
        date: NaiveDate::from_ymd_opt(2026, 11, 19).unwrap(),
    };

    let json = serde_json::to_string(&ev).unwrap();
    println!("{json}");

    let back: Event = serde_json::from_str(&json).unwrap();
    assert_eq!(ev, back);

    // オフセットつきの入力は、UTC に変換される。deleted がなくても読める
    let input = r#"{"name":"x","starts_at":"2026-11-19T18:30:00+09:00","created":0,"date":"2026-11-19"}"#;
    let e2: Event = serde_json::from_str(input).unwrap();
    println!("{}", e2.starts_at); // 2026-11-19 09:30:00 UTC
}
```

```text
{"name":"release","starts_at":"2026-11-19T09:30:00Z","created":1793491200,"deleted":null,"date":"2026-11-19"}
2026-11-19 09:30:00 UTC
```

<pre><code class="tips">API で日時を受け渡す場合は、DateTime&lt;Utc&gt; を、既定の RFC 3339 の形式のままにすると、他の言語やツールからも、読みやすい。
形式を変えたい場合は、フィールドごとに with を付けるか、serde_with crate を使う。</code></pre>

<pre><code class="caution">serde の with で、_option の付かないモジュールを、Option&lt;DateTime&lt;Utc&gt;&gt; に付けると、コンパイルエラーになる。
Option の項目には、必ず _option の付いたモジュールを使う。項目が JSON になくても許す場合は、default も付ける。</code></pre>

---

## 実践例 <a id="practice" data-name="実践例"></a>

### 営業日を進める

土日を除いて、n 営業日後の日付を求める。祝日は考慮しない (祝日のデータは、別に用意する必要がある)。

```rust
use chrono::{Datelike, Days, NaiveDate, Weekday};

/// 土日を除いて、n 営業日後の日付を返す
fn add_business_days(mut date: NaiveDate, mut n: u32) -> NaiveDate {
    while n > 0 {
        date = date.checked_add_days(Days::new(1)).expect("日付の範囲を超えた");
        if !matches!(date.weekday(), Weekday::Sat | Weekday::Sun) {
            n -= 1;
        }
    }
    date
}

fn main() {
    let thu = NaiveDate::from_ymd_opt(2026, 11, 19).unwrap();
    println!("{}", add_business_days(thu, 1)); // 2026-11-20 (金)
    println!("{}", add_business_days(thu, 2)); // 2026-11-23 (月)
    println!("{}", add_business_days(thu, 5)); // 2026-11-26 (木)
}
```

### 月の期間

月次の集計では、「月初以上、翌月初未満」の半開区間にすると、月末の日数や、時刻の扱いを、気にしなくてよい。

```rust
use chrono::{Months, NaiveDate};

/// 月の期間を、[月初, 翌月の月初) で返す
fn month_range(year: i32, month: u32) -> Option<(NaiveDate, NaiveDate)> {
    let first = NaiveDate::from_ymd_opt(year, month, 1)?;
    let next = first.checked_add_months(Months::new(1))?;
    Some((first, next))
}

fn main() {
    let (from, to) = month_range(2026, 12).unwrap();
    println!("{from} 以上 {to} 未満"); // 2026-12-01 以上 2027-01-01 未満
    assert!(month_range(2026, 13).is_none());
}
```

### ログの時間ごとの集計

アクセスログのような、`19/Nov/2026:09:30:12 +0900` の形式の時刻を解析して、UTC の 1 時間ごとに、件数を数える。

```rust
use chrono::{DateTime, DurationRound, TimeDelta, Utc};
use std::collections::BTreeMap;

/// 1 時間ごと (UTC) の件数を数える
fn count_per_hour(lines: &[&str]) -> BTreeMap<DateTime<Utc>, usize> {
    let mut map = BTreeMap::new();
    for line in lines {
        let Ok(dt) = DateTime::parse_from_str(line, "%d/%b/%Y:%H:%M:%S %z") else {
            continue; // 解析できない行は、読み飛ばす
        };
        let hour = dt
            .with_timezone(&Utc)
            .duration_trunc(TimeDelta::try_hours(1).unwrap())
            .unwrap();
        *map.entry(hour).or_insert(0) += 1;
    }
    map
}

fn main() {
    let lines = [
        "19/Nov/2026:09:30:12 +0900",
        "19/Nov/2026:09:45:00 +0900",
        "19/Nov/2026:10:01:00 +0900",
        "broken line",
    ];
    for (hour, count) in count_per_hour(&lines) {
        println!("{} {count}", hour.to_rfc3339());
    }
}
```

```text
2026-11-19T00:00:00+00:00 2
2026-11-19T01:00:00+00:00 1
```

### 経過時間の表示

```rust
use chrono::TimeDelta;

/// 時間の長さを、「1時間2分5秒」の形にする
fn format_elapsed(d: TimeDelta) -> String {
    let sign = if d < TimeDelta::zero() { "-" } else { "" };
    let secs = d.num_seconds().abs();
    format!("{sign}{}時間{}分{}秒", secs / 3600, secs % 3600 / 60, secs % 60)
}

fn main() {
    println!("{}", format_elapsed(TimeDelta::try_seconds(3725).unwrap())); // 1時間2分5秒
    println!("{}", format_elapsed(TimeDelta::try_seconds(-90).unwrap()));  // -0時間1分30秒
}
```

---

## テスト <a id="test" data-name="テスト"></a>

`Utc::now()` を、ロジックの中で直接呼ぶと、テストの結果が、実行する時刻によって変わる。現在時刻を、外から渡せる形にして、テストでは、固定の時刻を渡す。

### 時計を差し替える

```rust
use chrono::{DateTime, TimeZone, Utc};

/// 現在時刻を返すもの
trait Clock {
    fn now(&self) -> DateTime<Utc>;
}

/// 本番用: システムの時刻
struct SystemClock;

impl Clock for SystemClock {
    fn now(&self) -> DateTime<Utc> {
        Utc::now()
    }
}

/// テスト用: 固定の時刻
struct FixedClock(DateTime<Utc>);

impl Clock for FixedClock {
    fn now(&self) -> DateTime<Utc> {
        self.0
    }
}

/// 期限が切れているかどうか
fn is_expired(expires_at: DateTime<Utc>, clock: &impl Clock) -> bool {
    clock.now() >= expires_at
}

fn main() {
    let expires_at = Utc.with_ymd_and_hms(2026, 12, 1, 0, 0, 0).unwrap();
    println!("{}", is_expired(expires_at, &SystemClock));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn 期限の直前は有効() {
        let expires_at = Utc.with_ymd_and_hms(2026, 12, 1, 0, 0, 0).unwrap();
        let clock = FixedClock(Utc.with_ymd_and_hms(2026, 11, 30, 23, 59, 59).unwrap());
        assert!(!is_expired(expires_at, &clock));
    }

    #[test]
    fn 期限ちょうどは失効() {
        let expires_at = Utc.with_ymd_and_hms(2026, 12, 1, 0, 0, 0).unwrap();
        let clock = FixedClock(expires_at);
        assert!(is_expired(expires_at, &clock));
    }
}
```

### テストする観点

| 観点 | 例 |
| --- | --- |
| 境界 | 期限ちょうど、その 1 秒前と 1 秒後 |
| 月末 | 1 月 31 日に 1 か月を足す。2 月 28 日と、うるう年の 2 月 29 日 |
| 年またぎ | 12 月 31 日から 1 月 1 日。ISO 週の年がずれる日 |
| 夏時間 | 存在しない時刻と、2 回ある時刻 (`chrono-tz` の `America/New_York` など) |
| 解析 | 空文字列、不正な日付 (`2026-11-31`)、オフセットのない文字列 |
| タイムゾーン | UTC の日付と、日本の日付が、異なる時刻 (UTC の 15 時以降) |

<pre><code class="tips">日時のテストでは、Utc::now() や Local::now() を、テストの期待値に使わない。
固定の日時 (Utc.with_ymd_and_hms で作る) を使い、期待値も、固定の値や文字列で書く。</code></pre>

<pre><code class="caution">tokio::time::pause() は、tokio のタイマー (sleep や interval) を止めるもので、chrono の Utc::now() には影響しない。
chrono の現在時刻を固定したい場合は、上のように、時計を差し替える設計にする。</code></pre>

テストの書き方全般は、「Rustのテスト」のドキュメントを参照。

---

## 古いコードからの変更 <a id="migration" data-name="古いコードからの変更"></a>

chrono 0.4.20 から 0.4.41 にかけて、panic する関数や、紛らわしい API が、非推奨になった。古い記事や、古い crate のコードに残っているため、対応を確認する。

| 古い書き方 | 現在 | バージョン |
| --- | --- | --- |
| `Utc.ymd(2026, 11, 19).and_hms(9, 30, 0)` | `Utc.with_ymd_and_hms(2026, 11, 19, 9, 30, 0).unwrap()` | 0.4.23 |
| `Utc::today()` / `Local::today()` | `Utc::now().date_naive()` / `Local::now().date_naive()` | 0.4.23 |
| `dt.date()` | `dt.date_naive()` | 0.4.23 |
| `Date<Tz>` | `NaiveDate` または `DateTime<Tz>` | 0.4.23 |
| `NaiveDate::from_ymd(y, m, d)` | `NaiveDate::from_ymd_opt(y, m, d)` | 0.4.23 |
| `NaiveTime::from_hms(h, m, s)` | `NaiveTime::from_hms_opt(h, m, s)` | 0.4.23 |
| `date.and_hms(h, m, s)` | `date.and_hms_opt(h, m, s)` | 0.4.23 |
| `date.succ()` / `date.pred()` | `date.succ_opt()` / `date.pred_opt()` | 0.4.23 |
| `FixedOffset::east(secs)` | `FixedOffset::east_opt(secs)` | 0.4.23 |
| `Utc.timestamp(secs, 0)` | `DateTime::from_timestamp(secs, 0)` | 0.4.23 |
| `NaiveDateTime::from_timestamp_opt(secs, 0)` | `DateTime::from_timestamp(secs, 0)` (`DateTime<Utc>` を返す) | 0.4.35 |
| `naive.timestamp()` | `naive.and_utc().timestamp()` | 0.4.35 |
| `naive.timestamp_nanos()` | `naive.and_utc().timestamp_nanos_opt()` | 0.4.31 |
| `DateTime::from_utc(naive, Utc)` | `naive.and_utc()` または `DateTime::from_naive_utc_and_offset` | 0.4.27 |
| `Utc.datetime_from_str(s, fmt)` | `NaiveDateTime::parse_from_str(s, fmt)?.and_utc()` | 0.4.29 |
| `chrono::MIN_DATETIME` などの定数 | `DateTime::MIN_UTC`、`NaiveDateTime::MIN`、`NaiveDate::MIN` など | 0.4.20 |
| `TimeDelta::min_value()` | `TimeDelta::MIN` | 0.4.39 |
| `NaiveDateTime::UNIX_EPOCH` | `DateTime::UNIX_EPOCH` | 0.4.41 |

名前の変更だけで、古い名前も使える型がある。

| 古い名前 | 新しい名前 |
| --- | --- |
| `Duration` | `TimeDelta` (`Duration` は、別名として残っている) |
| `LocalResult<T>` | `MappedLocalTime<T>` (`LocalResult` は、別名として残っている) |

```rust
use chrono::prelude::*;

fn main() {
    // ❌ 古い書き方 (非推奨。不正な値で panic する)
    // let dt = Utc.ymd(2026, 11, 19).and_hms(9, 30, 0);

    // ✅ 現在の書き方
    let dt = Utc.with_ymd_and_hms(2026, 11, 19, 9, 30, 0).unwrap();

    // ❌ let today = Utc::today();
    // ✅ 日付だけが必要なら、NaiveDate にする
    let today = Utc::now().date_naive();

    println!("{dt} {today}");
}
```

<pre><code class="tips">非推奨の API を使うと、コンパイラが警告を出す。警告のメッセージに、移行先が書かれているため、警告を、そのまま、手がかりにできる。
警告をすべて直したい場合は、クレートの先頭に #![deny(deprecated)] を付けると、非推奨の API の使用が、エラーになる。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `with_ymd_and_hms(...).unwrap()` が、特定の日時で panic する | 夏時間の境目で、現地の時刻が `None` か `Ambiguous` になる | `single()`、`earliest()`、`latest()` で、すべての場合を処理する |
| `DateTime::parse_from_str` で、日付だけの文字列が `NotEnough` になる | `DateTime` の解析には、オフセットが必要 | `NaiveDate` で解析して、`and_hms_opt` と、タイムゾーンを足す |
| `"2026-11-19 09:30:00".parse::<NaiveDateTime>()` が失敗する | `FromStr` は、`T` 区切りの形式が前提 | `NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M:%S")` を使う |
| `format()` を表示した瞬間に panic する | サポートされていない書式指定子 | `StrftimeItems::new(fmt).parse()` で、事前に検証する |
| 1 月 31 日に 1 か月を足すと 2 月 28 日になる | `Months` の加算は、存在しない日を、月末に丸める | 月末の扱いを、仕様として決める。月末基準なら、元の日付から、まとめて足す |
| 日本の「今日」が、朝 9 時前にずれる | `Utc::now().date_naive()` は、UTC の日付 | `Utc::now().with_timezone(&Tokyo).date_naive()` にする |
| 日付が、遠い未来や過去になる、または `None` になる | タイムスタンプの単位 (秒とミリ秒) の取り違え | `from_timestamp` (秒) と、`from_timestamp_millis` (ミリ秒) を、使い分ける |
| `Local` が見つからない、というエラーになる | `default-features = false` で、`clock` を外している | `features = ["clock"]` を付ける |
| 24 時間後と、翌日の同じ時刻が、異なる | 夏時間をまたぐと、1 日が、23 時間か 25 時間になる | `TimeDelta` (経過時間) と `Days` (暦の日数) を、目的に合わせて使い分ける |
| `NaiveDateTime` を保存したら、タイムゾーンが分からなくなった | `Naive` は、どのタイムゾーンかの情報を持たない | 保存する時点で、`and_utc()` か `and_local_timezone()` で、明示する |
| 古い記事のコードが、警告だらけになる | 0.4.23 以降に、API が非推奨になった | 「古いコードからの変更」の表で、置き換える |
| `timestamp_nanos_opt()` が `None` になる | `i64` のナノ秒で表せる範囲 (1677 年頃から 2262 年頃) を超えている | `None` を処理する。秒かマイクロ秒を使う |
| `TimeDelta::days(n)` で panic する | `n` が、表せる範囲を超えている | 外部からの値は、`try_days(n)` で `None` を処理する |
| 年末年始の週番号が、おかしい | ISO 週の年と、暦の年が、異なることがある | `iso_week().year()` と `week()` を、組で使う |

---

## 関連 crate <a id="related" data-name="関連crate"></a>

| crate | 用途 |
| --- | --- |
| `chrono-tz` | IANA のタイムゾーン (`Asia/Tokyo` など) と、夏時間 |
| `serde_with` | serde で、日時の形式を、変える (chrono の型に対応するフィーチャーがある) |
| `jiff` | chrono とは別の日時 crate。IANA タイムゾーンを、本体に含む |
| `time` | chrono とは別の日時 crate |
| `humantime` | 「1h 30m」のような、人間向けの期間の解析と表示 (`std::time::Duration`) |
| `chrono-humanize` | 「3 時間前」のような、相対的な表示 (英語) |
| `cron` / `croner` | cron 式の解析と、次の実行時刻の計算 (chrono の型を使う) |
| `iana-time-zone` | OS のタイムゾーン名の取得 (chrono の `Local` が、内部で使う) |
| `sqlx` / `diesel` / `rusqlite` | フィーチャーで、データベースの日時型と、chrono の型を、変換する (各 crate のドキュメントを確認) |
| `tokio` | 非同期のタイマー (`sleep`、`interval`)。chrono の `Utc::now()` とは別 |
