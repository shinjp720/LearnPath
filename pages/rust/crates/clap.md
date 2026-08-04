---
title: clap
layout: default
---

# clap <a id="top" data-name="TOP"></a>

clapはCLIを作るための定番ライブラリ。ここでは基本的に **derive** マクロを使った書き方で統一する。

**builder** パターンという実装方法もある。

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
cargo add clap@4.5 --features derive,env
```

---

## 基本 <a id="basic" data-name="基本"></a>

deriveは、構造体・enumに `#[derive(Parser)]` や `#[derive(Subcommand)]` を付けるだけでCLIの定義ができる方式。

- コマンド全体 → `struct`
- サブコマンド → `enum`
- 引数・オプション → 構造体のフィールド

型がそのままCLIの形になるので、書く量が少なく、間違いにも気づきやすい。

普通のCLIを作るならほぼこれで十分。動的にコマンドを組み立てたい・プラグイン的に増減させたいなど特殊な事情がある場合だけ、後述の builder 方式を検討する。

---

## 実装 <a id="implement" data-name="実装"></a>

### Command(ルート)

CLI全体の入り口。`#[command(...)]` でアプリ名やバージョン、説明を指定する。

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

### 引数の取得

```rust
let cli = Cli::parse();
```

### サブコマンド

`#[command(subcommand)]` を付けたフィールドに、`enum` で定義したサブコマンド一覧を紐付ける。

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

### サブコマンドを必須にする

```rust
#[derive(Parser)]
#[command(subcommand_required = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}
```

### 引数・オプション

フィールドとして書くだけで、名前がそのままオプション名になる。

```rust
#[derive(Parser)]
struct Cli {
    #[arg(short, long)]
    name: String,
}
```

`-n`(short)、`--name`(long)の両方で渡せるようになる。

### フラグ(bool)

`bool` 型のフィールドは自動でフラグ扱いになり、渡さなければ `false`。

```rust
#[arg(long)]
force: bool,
```

### デフォルト値

```rust
#[arg(default_value = "foo")]
name: String,
```

### 値を制限する

```rust
#[arg(value_parser = ["a", "b"])]
mode: String,
```

### help(説明文)

`#[arg(help = "...")]` で指定するか、フィールドの直前に `///` コメントを書く方法もある。

```rust
#[arg(help = "説明")]
name: String,
```

### サブコマンドごとの引数

`enum` の各バリアントに直接フィールドを持たせる。

```rust
#[derive(clap::Subcommand)]
enum Commands {
    Add {
        #[arg(long)]
        name: String,
    },
}
```

### サブコマンドを入れ子にする

`app config get` のように、あるサブコマンドの下にさらにサブコマンドを持たせたい場合は、バリアント側にも `#[command(subcommand)]` フィールドを持たせて別の `enum` にネストする。

```rust
#[derive(clap::Subcommand)]
enum Commands {
    Config {
        #[command(subcommand)]
        action: ConfigAction,
    },
}

#[derive(clap::Subcommand)]
enum ConfigAction {
    Get {
        key: String,
    },
    Set {
        key: String,
        value: String,
    },
}
```

呼び出し方は `app config get <key>` / `app config set <key> <value>` のようになり、階層が深くなるほど `enum` を分けて積み重ねていけばよい。

### サブコマンド or 引数(同じ階層で両方を許す)

「サブコマンドを省略したら通常の引数として動く」「特定のサブコマンドが来たときだけ別の挙動にする」といったパターンは、サブコマンドを `Option` にして分岐する。

```rust
#[derive(Parser)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,

    // サブコマンドが無いときに使う引数
    #[arg(long)]
    name: Option<String>,
}

#[derive(clap::Subcommand)]
enum Commands {
    Add {
        #[arg(long)]
        name: String,
    },
}
```

```rust
match cli.command {
    Some(Commands::Add { name }) => { /* サブコマンドあり */ }
    None => { /* サブコマンド無し、cli.name を見る */ }
}
```

サブコマンド同士を共通の親でまとめつつ、共通オプションを親側に持たせたい場合は `#[command(flatten)]` で構造体を埋め込む方法もある。

```rust
#[derive(clap::Args)]
struct CommonOpts {
    #[arg(long)]
    verbose: bool,
}

#[derive(clap::Subcommand)]
enum Commands {
    Add {
        #[command(flatten)]
        common: CommonOpts,

        #[arg(long)]
        name: String,
    },
}
```

---

## サンプル <a id="sample" data-name="サンプル"></a>

```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "app", version = "1.0", about = "説明")]
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
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Add { name, force } => {
            println!("name: {name}, force: {force}");
        }
    }
}
```

---

## 参考: builder方式 <a id="builder" data-name="builder方式"></a>

derive では対応しづらい、動的にコマンドを組み立てるようなケース向けの方式。普段はほぼ使わないが、対応関係だけ載せておく。

| 意味 | derive | builder |
| --- | --- | --- |
| コマンド | `struct` | `Command` |
| サブコマンド | `enum` | `subcommand` |
| 引数 | フィールド | `Arg` |
| 必須オプション | `Option`かどうか | `required(true)` |
| 入力の取得 | `parse()` | `get_matches()` |

```rust
Command::new("app")
    .subcommand(
        Command::new("add")
            .arg(Arg::new("name").long("name").required(true))
            .arg(Arg::new("force").long("force").action(ArgAction::SetTrue))
    )
```