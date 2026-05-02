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

clapには builder パターンと derive の二つの実装方法があり、

builder は
- 動的にCLIを変えたい
- 条件分岐したい
- プラグイン的構造

derive は
- 普通のCLI
- 型安全に書きたい
- コードを短くしたい

という用途に向いている。

| 意味 | builder | derive |
| --- | --- | --- |
| コマンド | Command | struct |
| サブコマンド | subcommand | enum |
| 引数 | Arg | フィールド |
| 必須オプション | required(true) | Optionかどうか |
| 入力の取得 | get_matches() | parse() |

このような対応関係になっている。

---

## 実装 <a id="implement" data-name="実装"></a>

### Command(ルート)

#### builder

```rust
Command::new("app")
    .version("1.0")
    .about("説明")
```

#### derive

```rust
use clap::Parser;

#[derive(Parser)]
#[command(
    name = "app",
    version = "1.0",
    about = "説明"
)]
struct Cli {
}
```

### subcommand

#### builder

```rust
.subcommand(Command::new("add"))
.subcommand(Command::new("remove"))
```

#### derive

```rust
#[derive(Parser)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(clap::Subcommand)]
enum Commands {
    Add,
    Remove,
}
```

### Arg(引数・オプション)

#### builder

```rust
#[derive(Parser)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(clap::Subcommand)]
enum Commands {
    Add,
    Remove,
}
```

#### derive

```rust
#[arg(short, long)]
name: String,
```

### フラグ(bool)

#### builder

```rust
Arg::new("force")
    .long("force")
    .action(ArgAction::SetTrue)
```

#### derive

```rust
#[arg(long)]
force: bool,
```

bool は自動でフラグ扱いで、引数として渡されなければ false となる。

### デフォルト値

#### builder

```rust
.default_value("foo")
```

#### derive

```rust
#[arg(default_value = "foo")]
name: String,
```

### 値を制限

#### builder

```rust
.value_parser(["a", "b"])
```

#### derive

```rust
#[arg(value_parser = ["a", "b"])]
mode: String,
```

### help

#### builder

```rust
.help("説明")
```

#### derive

```rust
#[arg(help = "説明")]
```

またはフィールドコメント(///)

### サブコマンドごとの引数

#### builder

```rust
Command::new("add")
    .arg(Arg::new("name"))
```

#### derive

```rust
#[derive(clap::Subcommand)]
enum Commands {
    Add {
        #[arg(long)]
        name: String,
    },
}
```

### サブコマンドの必須引数

#### builder

```rust
.subcommand_required(true)
```

#### derive

```rust
#[command(subcommand_required = true)]
```

### 引数の取得

#### builder

```rust
let matches = cmd.get_matches();
```

#### derive

```rust
let cli = Cli::parse();
```

---

## サンプル <a id="sample" data-name="サンプル"></a>

### builder

<pre><code class="example">Command::new("app")
    .subcommand(
        Command::new("add")
            .arg(Arg::new("name").long("name").required(true))
            .arg(Arg::new("force").long("force").action(ArgAction::SetTrue))
    )</code></pre>

### derive

<pre><code class="example">use clap::{Parser, Subcommand};

#[derive(Parser)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    Add {
        #[arg(long)]
        name: String,

        #[arg(long)]
        force: bool,
    },
}</code></pre>
