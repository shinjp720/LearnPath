---
title: clap
layout: default
---

# clap <a id="top" data-name="TOP"></a>

clapはCLIを作るための定番ライブラリ。

---

## 導入 <a id="introduction" data-name="導入"></a>

```toml
[dependencies]
clap = { version = "4", features = ["derive"] }
```

または

```bash
cargo add clap@4.5 --features derive
```

環境変数を取り込む場合

```bash
cargo add clap@4.5 --features derive, env
```

---

## 基本 <a id="basic" data-name="基本"></a>

```rust
use clap::Parser;

#[derive(Parser, Debug)]
struct Args {
    /// 名前
    #[arg(short, long)]
    name: String,

    /// デバッグモード
    #[arg(long)]
    debug: bool,

    /// 入力ファイル
    input: String,
}

fn main() {
    let args = Args::parse();

    println!("{:?}", args);
}
```

### `///`

この文字列がhelpで表示される。

### `#[derive(Parser)]`

この構造体を引数として使う。

### `#[arg(...)]`

よく使うオプション。

| 書き方 | 意味 |
| --- | --- |
| short | `-n` |
| long | `--name` |
| default_value = "xxx" | デフォルト値 |
| required = true | 必須 |
| help = "説明" | ヘルプ文 |

<pre><code class="example">#[arg(short, long, default_value = "guest")]
name: String,</code></pre>

### 省略可能オプション

オプションの指定だけで引数を省略可能にする場合はOptionにする。

```rust
#[arg(long)]
name: Option<String>,
```

### 複数受け取る

同じオプションを複数受け取れる様にするならVecにする。

```rust
#[arg(long)]
files: Vec<String>,
```

<pre><code class="example">--files a --files b</code></pre>

---

## 実行例 <a id="execute" data-name="実行例"></a>

cargo run で実行する場合

```bash
# cargoへの引数と分けるため -- を置く
cargo run -- -n shin --debug input.txt
```

コンパイル後に実行する場合

```bash
./target/debug/myapp -n shin --debug input.txt
```

---

## サブコマンド <a id="sub-command" data-name="サブコマンド"></a>

```bash
git add
git commit
```

このような構造のサブコマンドの書き方。

```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    Add {
        file: String,
    },
    Commit {
        message: String,
    },
}
```