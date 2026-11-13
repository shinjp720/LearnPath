---
title: serde
layout: default
---

# serde <a id="top" data-name="TOP"></a>

serde は構造体とデータフォーマットの変換をほぼ自動化してくれる、デファクトスタンダードのライブラリ。

serde 自体は、特定のフォーマットを扱わない。「Rust のデータ構造」と「フォーマット」の間の共通の枠組みだけを提供し、実際の読み書きは、フォーマットごとの crate (`serde_json`、`toml` など) が担当する。

```text
構造体 (Serialize / Deserialize) ◀──▶ serde ◀──▶ serde_json / toml / YAML 用の crate / csv ...
                                                         │
                                                  JSON / TOML / YAML / CSV ...
```

そのため、**構造体に一度 `derive` を付ければ、JSON でも YAML でも TOML でも読み書きできる**。

---

## 導入 <a id="introduction" data-name="導入"></a>

```toml
[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

`derive` フィーチャーを有効にすると、`#[derive(Serialize, Deserialize)]` が使えるようになる。

### フォーマットごとの crate

使うフォーマットに応じて、crate を追加する。バージョンは `cargo add` に任せると、最新の互換バージョンが入る。

| フォーマット | crate | 追加のコマンド |
| --- | --- | --- |
| JSON | `serde_json` | `cargo add serde_json` |
| YAML | `yaml_serde` など (後述の注意を参照) | `cargo add yaml_serde` |
| TOML | `toml` | `cargo add toml` |
| CSV | `csv` | `cargo add csv` |
| MessagePack | `rmp-serde` | `cargo add rmp-serde` |

---

## 基本 <a id="basic" data-name="基本"></a>

構造体に `derive` を付ける。

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
struct User {
    name: String,
    age: u32,
}
```

| トレイト | 役割 |
| --- | --- |
| `Serialize` | 構造体 → フォーマット (書き出し) |
| `Deserialize` | フォーマット → 構造体 (読み込み) |

書き出しだけ、読み込みだけなら、必要な方だけ `derive` すればよい。

### デシリアライズ (JSON → 構造体)

```rust
fn main() {
    let json = r#"
    {
        "name": "Alice",
        "age": 30
    }
    "#;

    let user: User = serde_json::from_str(json).unwrap();
    println!("{:?}", user);
}
```

- `from_str` がパース処理
- 戻り値の型は、型推論できないため、明示的に型を書くのが基本

型注釈の代わりに、`from_str::<User>(json)` のように型を指定してもよい (turbofish)。

```rust
let user = serde_json::from_str::<User>(json).unwrap();
```

### シリアライズ (構造体 → JSON)

```rust
fn main() {
    let user = User {
        name: "Alice".to_string(),
        age: 30,
    };

    let json = serde_json::to_string(&user).unwrap();
    println!("{}", json);
}
```

```json
{"name":"Alice","age":30}
```

### エラーの扱い

ここまでの例は、短くするために `unwrap` を使っている。実際のコードでは、`Result` を処理する。

```rust
fn main() {
    let json = r#"{ "name": "Alice" }"#; // age がない

    match serde_json::from_str::<User>(json) {
        Ok(user) => println!("{:?}", user),
        Err(e) => eprintln!("エラー: {} (行 {}, 列 {})", e, e.line(), e.column()),
    }
}
```

`serde_json::Error` は、エラーの種類を判定するメソッドを持つ。

| メソッド | 意味 |
| --- | --- |
| `is_syntax()` | JSON の構文エラー |
| `is_data()` | 構文は正しいが、型や項目が構造体と合わない |
| `is_eof()` | 入力が途中で終わっている |
| `is_io()` | 読み書き (I/O) のエラー |

---

## よく使う属性 <a id="attributes" data-name="よく使う属性"></a>

`#[serde(...)]` で、変換の挙動を調整できる。

### フィールド名を変える

```rust
#[derive(Serialize, Deserialize)]
struct User {
    #[serde(rename = "user_name")]
    name: String,
}
```

```json
{ "user_name": "Alice" }
```

読み込みと書き出しで、別の名前にすることもできる。

```rust
#[serde(rename(serialize = "userName", deserialize = "user_name"))]
name: String,
```

### 命名規則をまとめて変える

構造体全体に `rename_all` を付けると、すべてのフィールド名が変換される。

```rust
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct User {
    user_name: String,   // "userName"
    created_at: String,  // "createdAt"
}
```

| 指定 | 変換後 |
| --- | --- |
| `"lowercase"` | `username` |
| `"UPPERCASE"` | `USERNAME` |
| `"camelCase"` | `userName` |
| `"PascalCase"` | `UserName` |
| `"snake_case"` | `user_name` |
| `"SCREAMING_SNAKE_CASE"` | `USER_NAME` |
| `"kebab-case"` | `user-name` |
| `"SCREAMING-KEBAB-CASE"` | `USER-NAME` |

### 別名も受け付ける

読み込み時だけ、別の名前も受け付ける。

```rust
#[serde(alias = "userName", alias = "user")]
name: String,
```

### フィールドが省略されていてもよい

`Option` にすると、フィールドがない (または `null` の) ときに `None` になる。

```rust
#[derive(Deserialize)]
struct User {
    name: String,
    age: Option<u32>,
}
```

### デフォルト値

```rust
#[derive(Deserialize)]
struct Config {
    #[serde(default)]
    debug: bool,
}
```

`#[serde(default)]` は、フィールドがないときに、その型の `Default` の値 (`bool` なら `false`) を使う。<br>
任意の値にしたい場合は、関数を指定する。

```rust
fn default_port() -> u16 {
    8080
}

#[derive(Deserialize)]
struct Server {
    #[serde(default = "default_port")]
    port: u16,
}
```

構造体全体に `#[serde(default)]` を付けると、足りないフィールドを、構造体の `Default` から補える (構造体に `Default` が必要)。

```rust
#[derive(Deserialize, Default)]
#[serde(default)]
struct Config {
    debug: bool,
    port: u16,
}
```

### 変換の対象から外す

```rust
#[derive(Serialize, Deserialize, Default)]
struct Session {
    user: String,
    #[serde(skip)]
    temp: i32, // 書き出さず、読み込みでも使わない (Default の値になる)
}
```

`skip` は、読み込み時に `Default` の値を使うため、そのフィールドの型に `Default` が必要。

| 属性 | 動作 |
| --- | --- |
| `skip` | 書き出しも読み込みも対象外 |
| `skip_serializing` | 書き出しだけ対象外 |
| `skip_deserializing` | 読み込みだけ対象外 |
| `skip_serializing_if = "関数"` | 関数が `true` を返したら、書き出さない |

### None のときは書き出さない

```rust
#[derive(Serialize)]
struct User {
    name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    nickname: Option<String>,
}
```

`nickname` が `None` なら、`"nickname": null` ではなく、キーごと出力されない。

### 知らないフィールドを拒否する

既定では、構造体にないフィールドは、読み込み時に無視される。エラーにしたい場合は `deny_unknown_fields` を付ける。

```rust
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Config {
    debug: bool,
}
// {"debug": true, "typo": 1} はエラーになる
```

設定ファイルのスペルミスを検出するのに便利。

### 構造体をフラットに展開する

```rust
#[derive(Serialize, Deserialize)]
struct Meta {
    author: String,
    views: u32,
}

#[derive(Serialize, Deserialize)]
struct Page {
    title: String,
    #[serde(flatten)]
    meta: Meta,
}
```

```json
{ "title": "serde 入門", "author": "Alice", "views": 100 }
```

`flatten` に `HashMap` を使うと、構造体にないフィールドを、まとめて受け取れる。

```rust
use std::collections::HashMap;
use serde_json::Value;

#[derive(Deserialize)]
struct Page {
    title: String,
    #[serde(flatten)]
    extra: HashMap<String, Value>, // title 以外のフィールドがすべて入る
}
```

---

## enum の表現 <a id="enum" data-name="enumの表現"></a>

enum は、JSON でどう表現するかを4通りから選べる。

```rust
#[derive(Serialize, Deserialize)]
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}
```

### 外部タグ (既定)

バリアント名をキーにする。

```json
"Quit"
{ "Move": { "x": 1, "y": 2 } }
{ "Write": "hello" }
```

### 内部タグ

`tag` で指定したフィールドに、バリアント名を入れる。

```rust
#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
enum Event {
    Quit,
    Move { x: i32, y: i32 },
    Write { text: String },
}
```

```json
{ "type": "Quit" }
{ "type": "Move", "x": 1, "y": 2 }
{ "type": "Write", "text": "hello" }
```

### 隣接タグ

`tag` と `content` で、種類と中身を別のフィールドにする。

```rust
#[derive(Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}
```

```json
{ "type": "Quit" }
{ "type": "Move", "data": { "x": 1, "y": 2 } }
{ "type": "Write", "data": "hello" }
```

### タグなし

タグを付けず、上のバリアントから順に、読み込めるかを試す。

```rust
#[derive(Deserialize, Debug)]
#[serde(untagged)]
enum IdOrName {
    Id(u32),
    Name(String),
}
// 1 は Id(1)、"alice" は Name("alice") になる
```

| 方式 | 書き方 | 特徴 |
| --- | --- | --- |
| 外部タグ | (指定なし) | 既定。どのバリアントでも使える |
| 内部タグ | `tag = "type"` | タプル形式 (`Write(String)` など) のバリアントは使えない |
| 隣接タグ | `tag = "type", content = "data"` | 種類と中身が分かれていて、扱いやすい |
| タグなし | `untagged` | エラーの原因が分かりにくい (後述) |

### バリアント名を変える

```rust
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
enum Status {
    Active,    // "active"
    Inactive,  // "inactive"
}
```

---

## ファイル入出力 <a id="file-io" data-name="ファイル入出力"></a>

`?` を使うので、`main` が `Result` を返す形にしている。

### 入力

```rust
use std::fs;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let json = fs::read_to_string("data.json")?;
    let user: User = serde_json::from_str(&json)?;
    println!("{:?}", user);
    Ok(())
}
```

### 出力

```rust
use std::fs;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let user = User { name: "Alice".into(), age: 30 };
    fs::write("data.json", serde_json::to_string_pretty(&user)?)?;
    Ok(())
}
```

### Reader / Writer を直接使う

文字列を経由せずに、ファイルから直接読み書きできる。

```rust
use std::fs::File;
use std::io::{BufReader, BufWriter};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // BufReader で包んでから渡す
    let reader = BufReader::new(File::open("data.json")?);
    let user: User = serde_json::from_reader(reader)?;

    let writer = BufWriter::new(File::create("out.json")?);
    serde_json::to_writer_pretty(writer, &user)?;
    Ok(())
}
```

### serde_json の主な関数

| 関数 | 変換 |
| --- | --- |
| `from_str` | `&str` → 構造体 |
| `from_slice` | `&[u8]` → 構造体 |
| `from_reader` | `Read` → 構造体 |
| `to_string` | 構造体 → `String` |
| `to_string_pretty` | 構造体 → `String` (インデント付き) |
| `to_vec` | 構造体 → `Vec<u8>` |
| `to_writer` / `to_writer_pretty` | 構造体 → `Write` |
| `from_value` / `to_value` | `Value` ↔ 構造体 |

<pre><code class="tips">from_reader は、from_str や from_slice よりも遅くなりやすい。
ファイルの内容を一度に読み込めるなら、read_to_string して from_str する方が簡単で速いことが多い。</code></pre>

---

## serde_json の便利な使い方 <a id="json-tips" data-name="serde_jsonの便利な使い方"></a>

#### Vec

```rust
let users: Vec<User> = serde_json::from_str(json)?;
```

#### Map

```rust
use std::collections::HashMap;

let map: HashMap<String, i32> = serde_json::from_str(json)?;
```

#### 型が未確定なとき

```rust
use serde_json::Value;

let v: Value = serde_json::from_str(json)?;
println!("{}", v["name"]); // "Alice" (Value は、引用符付きで表示される)
```

`Value` は、JSON のあらゆる値を表す enum。

| メソッド | 動作 |
| --- | --- |
| `v["key"]` / `v[0]` | キーまたは添字で取り出す。存在しなければ `Value::Null` (パニックしない) |
| `v.get("key")` | 存在しなければ `None` |
| `as_str()` | `Option<&str>` |
| `as_i64()` / `as_u64()` / `as_f64()` | `Option<数値>` |
| `as_bool()` | `Option<bool>` |
| `as_array()` / `as_object()` | `Option<&Vec<Value>>` / `Option<&Map<..>>` |
| `is_null()` | `null` かどうか |

```rust
let name = v["name"].as_str().unwrap_or("(なし)");
println!("{}", name); // Alice (引用符なし)
```

#### json! マクロ

JSON のような書き方で、`Value` を作れる。

```rust
use serde_json::json;

let v = json!({
    "name": "Alice",
    "age": 30,
    "tags": ["admin", "dev"],
});

println!("{}", v);
```

変数を埋め込むこともできる (`Serialize` を実装している型であればよい)。

```rust
let name = "Bob";
let v = json!({ "name": name, "age": 25 });
```

#### Value と構造体の変換

```rust
use serde_json::{from_value, to_value, Value};

let v: Value = to_value(&user)?;          // 構造体 → Value
let user: User = from_value(v)?;          // Value → 構造体
```

#### 整形出力

```rust
let json = serde_json::to_string_pretty(&user).unwrap();
```

- インデント付きで見やすく出力

```json
{
  "name": "Alice",
  "age": 30
}
```

#### 1行に1つの JSON (JSON Lines / NDJSON)

```rust
use serde_json::Deserializer;

let data = r#"{"name":"Alice","age":30}
{"name":"Bob","age":25}"#;

for user in Deserializer::from_str(data).into_iter::<User>() {
    println!("{:?}", user?);
}
```

---

## YAML <a id="yaml" data-name="YAML"></a>

YAML は、人間が読み書きしやすく、**コメントを書ける**ため、設定ファイルによく使われる。

### crate の選び方

<pre><code class="caution">YAML は、serde 公式の crate (serde_yaml) が、2024年3月に非推奨になり、開発が終了している。
後継の crate が複数あって状況が変わりやすいため、導入するときは、crates.io や RustSec で最新の状況を確認する。</code></pre>

2026年8月時点の、あるオープンソースプロジェクトの調査をまとめると、次のとおり。

| crate | 状況 | serde_yaml からの移行 |
| --- | --- | --- |
| `serde_yaml` | 非推奨 (開発終了) | - |
| `yaml_serde` | YAML 関連の organization が保守するフォーク。2026年8月にも更新あり | API が同じで、crate 名の置き換えだけで済む |
| `serde_yaml_ng` | 2024年5月以降、リリースなし | API が同じ |
| `serde_norway` | 2024年12月以降、リリースなし | API が同じ |
| `serde-saphyr` | 活発に開発されている (1.0 は2026年7月) | API が異なる (`Value` 型がない) |
| `serde_yml` | 健全性の問題 (RUSTSEC-2025-0068) があり、保守もされていない | 使わない |

このドキュメントでは `yaml_serde` を使う。他の crate に変える場合も、API が同じなら、`yaml_serde::` の部分を置き換えればよい。

```bash
cargo add yaml_serde
```

### 読み込みと書き出し

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Server {
    host: String,
    port: u16,
}

#[derive(Serialize, Deserialize, Debug)]
struct Config {
    server: Server,
    debug: bool,
    tags: Vec<String>,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let yaml = r#"
# サーバーの設定
server:
  host: 127.0.0.1
  port: 8080
debug: true
tags:
  - web
  - api
"#;

    // YAML → 構造体
    let config: Config = yaml_serde::from_str(yaml)?;
    println!("{:?}", config);

    // 構造体 → YAML
    let out = yaml_serde::to_string(&config)?;
    println!("{}", out);

    Ok(())
}
```

構造体は、JSON のときと同じ `derive` のまま使える。関数名も、`from_str` と `to_string` で同じ。

### Value で扱う

```rust
let v: yaml_serde::Value = yaml_serde::from_str(yaml)?;
println!("{:?}", v["server"]["port"].as_u64()); // Some(8080)
```

### JSON との違い

| 項目 | 内容 |
| --- | --- |
| コメント | `#` で書ける。ただし、読み込むと失われるため、読み込んで書き出すと、コメントは消える |
| インデント | スペースで階層を表す (タブは使えない) |
| 複数行の文字列 | `|` (改行を保つ)、`>` (改行を空白に変える) |
| アンカーとエイリアス | `&名前` で定義して、`*名前` で再利用できる |
| 複数のドキュメント | `---` で区切って、1つのファイルに複数のドキュメントを書ける |
| enum | `!バリアント名` のタグで表される (後述) |

<pre><code class="caution">YAML は、文字列と、数値・真偽値・null の区別が、書き方に左右される。
"123"、"true"、"null"、"no" のような、他の型に見える文字列は、引用符で囲んで書く。
特に、設定ファイルを他のツールと共有する場合は、ツールごとに解釈が異なる (YAML 1.1 では no が false になるなど) ので注意する。</code></pre>

### enum の表現

`serde_yaml` 0.9 系の仕様 (`yaml_serde` も同様) では、enum のバリアントは YAML のタグで表される。

```rust
#[derive(Serialize, Deserialize, Debug)]
enum Shape {
    Point,
    Circle(f64),
    Rect { w: f64, h: f64 },
}
```

```yaml
- Point
- !Circle 1.5
- !Rect { w: 2.0, h: 3.0 }
```

### JSON と YAML の相互変換

どちらも `Value` を経由すれば、構造体を定義しなくても変換できる。

```rust
let json = r#"{"name": "Alice", "tags": ["a", "b"]}"#;

let v: serde_json::Value = serde_json::from_str(json)?;
let yaml = yaml_serde::to_string(&v)?;
println!("{}", yaml);
```

```yaml
name: Alice
tags:
- a
- b
```

---

## TOML <a id="toml" data-name="TOML"></a>

TOML は、Cargo.toml でおなじみの設定ファイル向けの形式。コメントを書けて、YAML よりも解釈の曖昧さが少ない。

```bash
cargo add toml
```

```toml
# config.toml
debug = true
tags = ["web", "api"]

[server]
host = "127.0.0.1"
port = 8080
```

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Server {
    host: String,
    port: u16,
}

#[derive(Serialize, Deserialize, Debug)]
struct Config {
    debug: bool,
    tags: Vec<String>,
    server: Server,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let text = std::fs::read_to_string("config.toml")?;

    // TOML → 構造体
    let config: Config = toml::from_str(&text)?;
    println!("{:?}", config);

    // 構造体 → TOML
    let out = toml::to_string_pretty(&config)?;
    println!("{}", out);

    Ok(())
}
```

### 配列のテーブル

`[[名前]]` で、構造体の配列 (`Vec<T>`) を書ける。

```toml
[[servers]]
name = "web"
port = 8080

[[servers]]
name = "api"
port = 9090
```

```rust
#[derive(Deserialize, Debug)]
struct Server {
    name: String,
    port: u16,
}

#[derive(Deserialize, Debug)]
struct Config {
    servers: Vec<Server>,
}
```

### TOML の制約

| 項目 | 内容 |
| --- | --- |
| トップレベル | テーブル (構造体や Map) のみ。`Vec<T>` を直接書き出すことはできない |
| `null` | 存在しない。`None` のフィールドは、書き出されない (配列の中の `None` は書き出せない) |
| 整数 | 64 ビットの符号付き整数の範囲 |
| 日時 | TOML 独自の型 (`toml::value::Datetime`) がある |

<pre><code class="tips">toml crate は、読み込んで書き出すと、コメントや書式が失われる。
コメントや書式を保ったまま、一部だけ書き換えたい場合は、toml_edit を使う。</code></pre>

---

## その他の形式 <a id="other-formats" data-name="その他の形式"></a>

### 形式の比較

| 形式 | crate | 人間が読める | 主な用途 |
| --- | --- | --- | --- |
| JSON | `serde_json` | ○ | API、データ交換、設定 |
| YAML | `yaml_serde` など | ○ | 設定ファイル |
| TOML | `toml` | ○ | 設定ファイル |
| RON | `ron` | ○ | Rust の構造体に近い書き方の設定、ゲームのデータ |
| CSV | `csv` | ○ | 表形式のデータ |
| URL エンコード | `serde_urlencoded` | ○ | クエリ文字列、フォーム (Axum の `Query` や `Form` でも使われる) |
| MessagePack | `rmp-serde` | × | JSON に近い構造を、小さいバイナリで扱う |
| CBOR | `ciborium` | × | 標準化されたバイナリ形式 (IoT など) |
| postcard | `postcard` | × | 組み込みや、サイズを小さくしたい場面 (`no_std` 対応) |

### CSV

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
struct Record {
    name: String,
    age: u32,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let data = "name,age\nAlice,30\nBob,25\n";

    // 読み込み: 1行目のヘッダーと、フィールド名が対応する
    let mut reader = csv::Reader::from_reader(data.as_bytes());
    for result in reader.deserialize() {
        let record: Record = result?;
        println!("{:?}", record);
    }

    // 書き出し: 最初の1行目に、ヘッダーが自動で書かれる
    let mut writer = csv::Writer::from_writer(std::io::stdout());
    writer.serialize(Record { name: "Carol".into(), age: 28 })?;
    writer.flush()?;

    Ok(())
}
```

### MessagePack

```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let user = User { name: "Alice".into(), age: 30 };

    let bytes: Vec<u8> = rmp_serde::to_vec(&user)?;
    let decoded: User = rmp_serde::from_slice(&bytes)?;
    println!("{:?} ({} バイト)", decoded, bytes.len());

    Ok(())
}
```

`rmp_serde::to_vec` は、構造体を配列として書き出す (フィールド名を含まないため小さい)。フィールド名つきの Map として書き出したい場合は `to_vec_named` を使う。

### postcard

```rust
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let user = User { name: "Alice".into(), age: 30 };

    let bytes = postcard::to_allocvec(&user)?;
    let decoded: User = postcard::from_bytes(&bytes)?;
    println!("{:?}", decoded);

    Ok(())
}
```

```toml
[dependencies]
postcard = { version = "1", features = ["use-std"] }
```

### CBOR

```rust
let mut buf = Vec::new();
ciborium::into_writer(&user, &mut buf)?;

let decoded: User = ciborium::from_reader(&buf[..])?;
```

### URL エンコード

```rust
let s = serde_urlencoded::to_string(&user)?;
// name=Alice&age=30

let decoded: User = serde_urlencoded::from_str(&s)?;
```

<pre><code class="caution">バイナリ形式の bincode は、保守されていた開発者が開発を終了した (RUSTSEC-2025-0141)。最終リリースの 3.0.0 は、開発終了を知らせるコンパイルエラーだけを含んでいる。
新しく採用する場合は、postcard (serde ベース)、rkyv などの代替を検討する。</code></pre>

---

## 形式をまたいで使う <a id="cross-format" data-name="形式をまたいで使う"></a>

serde の利点は、**同じ構造体を、すべての形式で使える**こと。

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct User {
    name: String,
    age: u32,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let user = User { name: "Alice".into(), age: 30 };

    println!("{}", serde_json::to_string(&user)?);
    // {"name":"Alice","age":30}

    println!("{}", yaml_serde::to_string(&user)?);
    // name: Alice
    // age: 30

    println!("{}", toml::to_string(&user)?);
    // name = "Alice"
    // age = 30

    Ok(())
}
```

### 自己記述的な形式と、属性の相性

JSON、YAML、TOML などは、データの中に型や項目の名前が含まれる (自己記述的)。<br>
一方、postcard や bincode のようなコンパクトなバイナリ形式は、データに型の情報を持たない (非自己記述的)。

<pre><code class="caution">非自己記述的な形式 (postcard など) では、次の属性が使えない、または正しく動かないことがある。
- skip_serializing_if (書き出す項目が減ると、読み込み側とずれる)
- flatten、untagged、内部タグ付きの enum
バイナリ形式を使う構造体には、これらの属性を避ける。</code></pre>

---

## 自作の変換 <a id="custom" data-name="自作の変換"></a>

### deserialize_with

読み込み時の変換を、関数で差し替える。たとえば、数値が文字列で書かれている JSON (`{"count": "42"}`) を読み込む。

```rust
use serde::{Deserialize, Deserializer};

fn from_str_to_u32<'de, D>(deserializer: D) -> Result<u32, D::Error>
where
    D: Deserializer<'de>,
{
    let s = String::deserialize(deserializer)?;
    s.parse().map_err(serde::de::Error::custom)
}

#[derive(Deserialize, Debug)]
struct Item {
    #[serde(deserialize_with = "from_str_to_u32")]
    count: u32,
}

fn main() {
    let item: Item = serde_json::from_str(r#"{"count": "42"}"#).unwrap();
    println!("{:?}", item); // Item { count: 42 }
}
```

書き出し側は、同様に `serialize_with` で差し替える。両方まとめて、モジュールとして指定するなら `with = "モジュール名"` を使う。

| 属性 | 動作 |
| --- | --- |
| `deserialize_with = "関数"` | 読み込みの変換を、関数で行う |
| `serialize_with = "関数"` | 書き出しの変換を、関数で行う |
| `with = "モジュール"` | モジュール内の `serialize` と `deserialize` の関数を使う |

---

## 借用 (ゼロコピー) <a id="borrow" data-name="借用"></a>

`from_str` で読み込む場合は、入力の文字列を、構造体が借用できる (新しい `String` を作らない)。

```rust
#[derive(Deserialize, Debug)]
struct Borrowed<'a> {
    name: &'a str,
}

fn main() {
    let json = r#"{"name": "Alice"}"#;
    let b: Borrowed = serde_json::from_str(json).unwrap();
    println!("{}", b.name);
}
```

<pre><code class="caution">&amp;str で借用できるのは、入力の中の文字列を、そのまま参照できるときだけ。
\n や \" のようなエスケープを含む文字列は、変換が必要なため、読み込みに失敗する。
エスケープがあっても読み込めるようにするなら、Cow&lt;'a, str&gt; に #[serde(borrow)] を付けるか、String を使う。</code></pre>

`from_reader` は、入力を借用できないため、`DeserializeOwned` (借用を持たない型) だけが使える。

---

## よくあるエラー <a id="errors" data-name="よくあるエラー"></a>

| メッセージの例 | 原因 | 対処 |
| --- | --- | --- |
| ``missing field `age` `` | 必須のフィールドがない | `Option` にする、`#[serde(default)]` を付ける |
| `invalid type: string "30", expected u32` | 値の型が合わない | データの型を直す、`deserialize_with` で変換する |
| `unknown variant` | enum にないバリアント名 | `rename` や `rename_all` を確認する |
| `unknown field` | `deny_unknown_fields` で、知らないフィールドがあった | フィールド名のスペルや、構造体の定義を確認する |
| `expected value at line 1 column 1` | 空文字列や、JSON でない入力 | 入力が空でないか、正しい形式かを確認する |
| `trailing characters` | JSON の後に、余計な文字がある | 複数の JSON が並ぶ場合は、`Deserializer::into_iter` を使う |
| `data did not match any variant of untagged enum` | `untagged` の、どのバリアントにも合わない (原因は表示されない) | バリアントの順序を見直す。`serde_path_to_error` で調べる |
| `invalid type: string, expected a borrowed string` | `&str` で借用しようとしたが、エスケープを含んでいた | `String` や `Cow` にする |

<pre><code class="tips">エラーが、どのフィールドで起きたか分からないときは、serde_path_to_error を使うと、フィールドのパス (users[2].age など) を教えてくれる。</code></pre>

---

## 関連クレート <a id="ecosystem" data-name="関連クレート"></a>

| crate | 用途 |
| --- | --- |
| `serde_with` | `serde` の属性を拡張する (文字列と数値の相互変換、空文字列を `None` にする、など) |
| `serde_path_to_error` | エラーが起きたフィールドのパスを教えてくれる |
| `serde_repr` | enum を、数値 (`#[repr(u8)]` の値) として、書き出し・読み込みする |
| `schemars` | 構造体から、JSON Schema を生成する |
| `toml_edit` | コメントや書式を保ったまま、TOML を編集する |
| `config` / `figment` | 設定ファイル、環境変数、コマンドライン引数を、重ねて読み込む |
| `serde_urlencoded` | URL エンコードの、読み込みと書き出し |
