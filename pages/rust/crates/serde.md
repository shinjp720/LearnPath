---
title: serde
layout: default
---

# serde <a id="top" data-name="TOP"></a>

serdeは構造体とデータフォーマットの変換をほぼ自動化してくれるデファクトスタンダード。

---

## 導入 <a id="introduction" data-name="導入"></a>

```toml
[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

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

### デシリアライズ (JSON -> struct)

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
- 明示的に型を書くのが基本

### シリアライズ (struct -> JSON)

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

---

### よく使う属性 <a id="usefully-atr" data-name="よく使う属性"></a>

#### フィールド名を変える

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

#### フィールドがなくても可

```rust
struct User {
    name: String,
    age: Option<u32>,
}
```

#### デフォルト値

```rust
#[derive(Deserialize)]
struct Config {
    #[serde(default)]
    debug: bool,
}
```

#### JSONデータに含めない

```rust
#[serde(skip)]
temp: i32,
```

---

## ファイル入出力 <a id="file-io" data-name="ファイル入出力"></a>

### 入力

```rust
use std::fs;

let json = fs::read_to_string("data.json")?;
let user: User = serde_json::from_str(&json)?;
```

### 出力

```rust
fs::write("data.json", serde_json::to_string_pretty(&user)?)?;
```

---

## その他 <a id="etc" data-name="その他"></a>

#### Vec

```rust
let users: Vec<User> = serde_json::from_str(json)?;
```

#### Map

```rust
use std::collections::HashMap;

let map: HashMap<String, i32> = serde_json::from_str(json)?;
```

#### 型が未確定な時

```rust
use serde_json::Value;

let v: Value = serde_json::from_str(json)?;
println!("{}", v["name"]);
```

#### 整形出力

```rust
let json = serde_json::to_string_pretty(&user).unwrap();
```

- インデント付きで見やすく出力
