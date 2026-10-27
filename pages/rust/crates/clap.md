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

deriveは、構造体・enumに `#[derive(Parser)]` や `#[derive(Subcommand)]` を付けるだけで CLIの 定義ができる方式。

- コマンド全体 → `struct`
- サブコマンド → `enum`
- 引数・オプション → 構造体のフィールド

型がそのままCLIの形になるので、書く量が少なく、間違いにも気づきやすい。

普通のCLIを作るならほぼこれで十分。動的にコマンドを組み立てたい・プラグイン的に増減させたいなど特殊な事情がある場合だけ、後述の builder 方式を検討する。

### 設計の考え方

まずは「引数(オプション)で足りるか」を考え、処理そのものを切り替えたくなったらサブコマンドを使う。

```bash
# 引数だけで足りる
myapp --input input.txt --output output.txt

# 処理を切り替えたい → サブコマンド
myapp add
myapp remove
myapp list

# サブコマンドごとに必要な引数が違う → サブコマンド + 専用の引数
myapp add --name Alice
myapp remove --id 10
```

「引数かサブコマンドか」の二択ではなく、**親の構造体の中にサブコマンドを持たせる**ことができる。

| やりたいこと | 使うもの |
| --- | --- |
| `--input` `--output` `-v` などを受け取る | 引数(`#[arg]`) |
| `add` `remove` `list` のように処理を切り替える | サブコマンド(`enum`) |
| サブコマンドごとに別のオプションを受け取る | サブコマンド + 専用の引数 |
| CLI全体で共通のオプションを受け取る | 親の構造体のフィールド |

### 登場する型・マクロの役割

| 型 / マクロ | 役割 |
| --- | --- |
| `Parser` | CLI全体の引数を解析する。ルートの構造体に付ける |
| `Subcommand` | コマンドの種類を定義する。`enum` に付ける |
| `Args` | 引数・オプションをひとまとめにする。構造体に付ける |
| `ValueEnum` | 選択肢を `enum` で表す |

### `#[command(...)]` と `#[arg(...)]` の違い

- `#[command(...)]` → CLI全体・サブコマンドの設定(名前、バージョン、説明など)
- `#[arg(...)]` → 個々の引数・オプションの設定

---

## 実装 <a id="implement" data-name="実装"></a>

### 基本構成

```rust
use clap::Parser;

/// アプリケーションの説明 `///` ドキュメントコメントがヘルプの文章になる
#[derive(Parser, Debug)]
#[command(name = "my-app", version, about, long_about = None)]
struct Args {
    // フィールドをここに定義
}

fn main() {
    let args = Args::parse();
    println!("{:?}", args);
}
```

### 説明文

`#[arg(help = "...")]` で指定するか、フィールドの直前に `///` コメントを書く。

```rust
#[arg(help = "説明")]
name: String,
```

### 引数の取得

```rust
let args = Args::parse();
```

### Command(ルート)

CLI全体の入り口。`#[command(...)]` でアプリ名やバージョン、説明を指定する。

```rust
use clap::Parser;

#[derive(Parser, Debug)]
#[command(name = "my-app", version, about, long_about = None)]
struct Args {
    // フィールドをここに定義
}
```

<pre><code class="tips">version や about を引数なしで指定すると、Cargo.toml の version や description が自動適用される</code></pre>

---

## サブコマンド <a id="subcommand" data-name="サブコマンド"></a>

`#[command(subcommand)]` を付けたフィールドに、 `enum` で定義したサブコマンド一覧を紐付ける。


```rust
#[derive(Parser)]
struct Args {
    #[command(subcommand)]
    command: Commands,
}

#[derive(clap::Subcommand)]
enum Commands {
    Add,
    Remove,
}
```

`enum` なので `match` で分岐でき、コマンドごとに処理を整理しやすい。

```rust
match args.command {
    Commands::Add => println!("追加処理"),
    Commands::Remove => println!("削除処理"),
}
```

### サブコマンドを必須にする

```rust
#[derive(Parser)]
#[command(subcommand_required = true)]
struct Args {
    #[command(subcommand)]
    command: Commands,
}
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

### サブコマンドの引数を構造体に切り出す

引数が増えてきたら、バリアントに構造体を1つ持たせて、引数はそちらにまとめる。`#[derive(clap::Args)]` を付けた構造体は、そのままサブコマンドの引数になる。

```rust
use clap::{Args, Parser, Subcommand};

#[derive(Parser, Debug)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand, Debug)]
enum Commands {
    Add(AddArgs),
    Remove(RemoveArgs),
    List(ListArgs),
}

#[derive(Args, Debug)]
struct AddArgs {
    #[arg(long)]
    name: String,
}

#[derive(Args, Debug)]
struct RemoveArgs {
    #[arg(long)]
    id: u32,
}

#[derive(Args, Debug)]
struct ListArgs {
    #[arg(long)]
    all: bool,
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Add(args) => println!("追加: {}", args.name),
        Commands::Remove(args) => println!("削除: {}", args.id),
        Commands::List(args) => println!("すべて表示: {}", args.all),
    }
}
```

呼び出し方は `myapp add --name Alice` / `myapp remove --id 10` / `myapp list --all` のようになる。

<pre><code class="tips">use clap::Args をするとルートの構造体名 Args と衝突するので、この書き方のときはルートを Cli などにしておくと楽。Args は clap の必須の型名ではなく、あくまで構造体に付ける名前(マクロは #[derive(Args)])</code></pre>

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

呼び出し方は `app config get <key> / app config set <key> <value>` 
のようになり、階層が深くなるほど `enum` を分けて積み重ねていけばいい。

### サブコマンド or 引数(同じ階層で両方を許す)

「サブコマンドを省略したら通常の引数として動く」「特定のサブコマンドが来たときだけ別の挙動にする」といったパターンは、サブコマンドを `Option` にして分岐する。

```rust
#[derive(Parser)]
struct Args {
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
match args.command {
    Some(Commands::Add { name }) => { /* サブコマンドあり */ }
    None => { /* サブコマンド無し、args.name を見る */ }
}
```

### 共通オプションを持たせる

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

CLI全体で共通のオプションは、親の構造体にフィールドとして置く方法もある。

```rust
#[derive(Parser)]
struct Cli {
    #[arg(long)]
    verbose: bool,

    #[command(subcommand)]
    command: Commands,
}
```

```bash
myapp --verbose add --name Alice
```

<pre><code class="tips">親に置いたオプションは、デフォルトではサブコマンドより前に書く必要がある。サブコマンドの後ろ (myapp add --verbose) でも受け付けたい場合は #[arg(long, global = true)] を付ける</code></pre>

---

## 引数 <a id="argument" data-name="引数"></a>

### 位置引数

オプションフラグ指定 (- や --)なしで受け取る引数。

```rust
// 必須の位置引数
file_path: String,

// 任意の位置引数
output_path: Option<String>,
```

`myapp input.txt output.txt` のように、フィールドの定義順で受け取る。

### オプション

`-n` や `--name` のような名前付き引数。

構造体に `#[arg(short, long)]` を付けてフィールドとして書くだけで、名前がそのままオプション名になる。

```rust
#[derive(Parser)]
struct Args {
    #[arg(short, long)]
    name: String,
}
```

`-n`(short)、`--name`(long)の両方で渡せるようになる。フィールド名にアンダースコアが含まれる場合は、ハイフンに変換される (`log_level` → `--log-level`)。

### フラグ(bool)

`bool` 型のフィールドは自動でフラグ扱いになり、渡さなければ `false`となる。

```rust
#[arg(long)]
force: bool,
```

`bool` には `action = ArgAction::SetTrue` が自動で設定されるため、通常は明示する必要はない。

### 回数を数える

`-v` `-vv` `-vvv` のように、指定された回数で挙動を変えたいときは `ArgAction::Count` を使う。型は `u8` など整数にする。

```rust
#[arg(short, long, action = clap::ArgAction::Count)]
verbose: u8,
```

```bash
myapp -vv   # verbose は 2
```

### デフォルト値

```rust
#[arg(default_value = "foo")]
name: String,
```

```rust
#[arg(short, long, default_value = "8080", help = "ポート番号")]
port: u16,
```

`default_value` を指定したフィールドは省略可能になるので、`required = true` と併用することは基本的にない。

### 複数の値を受け取る

`Vec` にすると、複数回の指定をまとめて受け取れる。

```rust
#[arg(short, long)]
include: Vec<String>,
```

```bash
myapp --include src --include tests
```

一度の指定で決まった個数の値を受け取りたい場合は `num_args` を使う。

```rust
#[arg(long, num_args = 2)]
coordinates: Vec<i32>,
```

```bash
myapp --coordinates 10 20
```

### 値を制限する

```rust
#[arg(value_parser = ["a", "b"])]
mode: String,
```

またはValueEnum を利用すると安全。

```rust
use clap::{Parser, ValueEnum};

#[derive(ValueEnum, Clone, Debug)]
enum Mode {
    Fast,
    Safe,
}

#[derive(Parser)]
struct Args {
    #[arg(value_enum, default_value_t = Mode::Safe)]
    mode: Mode,
}
```

許可されていない値を渡すと、clapが自動でエラーにしてくれる。

### 他のオプションを必須にする

```rust
/// keyword が指定されている場合のみ使用可能なオプション
#[arg(short, long, requires = "keyword")]
verbose: bool,
```

### 同時指定を禁止する

`conflicts_with` で、別の引数との同時指定をエラーにできる。

```rust
#[arg(long, conflicts_with = "yaml")]
json: bool,

#[arg(long)]
yaml: bool,
```

```bash
myapp --json --yaml   # エラー
```

### 環境変数連携

```rust
// 環境変数からの取得 (features = ["env"] が必要)
#[arg(long, env = "DATABASE_URL")]
db_url: String,
```

### `#[arg(...)]` 属性まとめ

数が多いので、まずは優先度の高いものから覚える。

| 指定 | 意味 | 優先度 |
| --- | --- | --- |
| `long` | 長いオプションを作る (`--input`) | ★★★ |
| `short` | 短いオプションを作る (`-i`) | ★★★ |
| `default_value = "..."` | デフォルト値 | ★★★ |
| `help = "..."` | ヘルプの説明文 | ★★★ |
| `value_parser = ...` | 入力値の解析・制限 | ★★ |
| `required = true` | 必須にする | ★★ |
| `env = "..."` | 環境変数から受け取る | ★★ |
| `action = ...` | フラグ・回数・複数回指定の制御 | ★★ |
| `conflicts_with = "..."` | 同時指定の禁止 | ★★ |
| `requires = "..."` | 別の引数の指定を要求 | ★★ |
| `num_args = N` | 一度に受け取る値の個数 | ★ |
| `value_name = "..."` | ヘルプに表示する値の名前 | ★ |
| `hide = true` | ヘルプ一覧から隠す | ★ |
| `global = true` | サブコマンドにもオプションを適用する | ★ |
| `index = N` | 位置引数の位置を指定する | ★ |
| `trailing_var_arg = true` | 残りの引数をまとめて受け取る | ★ |
| `group = "..."` | 引数をグループ化する | ★ |

公式ドキュメント

- [Derive Tutorial](https://docs.rs/clap/latest/clap/_derive/_tutorial/index.html)
- [Arg](https://docs.rs/clap/latest/clap/struct.Arg.html)

---

## サンプル <a id="sample" data-name="サンプル"></a>

```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "app", version = "1.0", about = "説明")]
struct Args {
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
    let args = Args::parse();

    match args.command {
        Commands::Add { name, force } => {
            println!("name: {name}, force: {force}");
        }
    }
}
```

### help / version のメッセージを上書きする

```rust
use clap::{ArgAction, CommandFactory, Parser, Subcommand};

#[derive(Parser)]
#[command(
    name = "my_app",
    version = "1.0",
    about = "アプリの説明",
    disable_help_flag = true,
    // ヘルプはデフォルトでサブコマンド扱いなので無効化
    disable_help_subcommand = true,
    disable_version_flag = true
)]

struct Args {
    #[command(subcommand)]
    /// サブコマンド
    command: Option<Commands>,

    /// ヘルプを表示
    #[arg(short, long, action=ArgAction::SetTrue)]
    help: bool,

    /// バージョンを表示
    #[arg(short, long, action=ArgAction::SetTrue)]
    version: bool,
}

#[derive(Subcommand)]
enum Commands {
    /// サブコマンド
    Command,
}

fn main() {
    let args = Args::parse();

    match args {
        // ヘルプのオプション
        Args { help: true, .. } => {
            Args::command().print_help().unwrap();
            println!();
        }

        // バージョンのオプション
        Args { version: true, .. } => {
            let version_text = Args::command().render_version();
            println!("{version_text}");
        }

        // コマンドが渡された
        Args {
            command: Some(cmd), ..
        } => {
            match cmd {
                // Analyze
                Commands::Command => {
                    // サブコマンドの処理
                }
            }
        }

        // 何も渡されなかった
        Args { command: None, .. } => {
            Args::command().print_help().unwrap();
            println!();
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
