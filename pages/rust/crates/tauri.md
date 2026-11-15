---
title: Tauri
layout: default
---

# Tauri <a id="top" data-name="TOP"></a>

Tauri は、**Web の技術 (HTML / CSS / JavaScript) で画面を作り、Rust でバックエンドを書く**、デスクトップ (Windows / macOS / Linux) とモバイル (iOS / Android) アプリのフレームワーク。

アプリに、ブラウザのエンジンを同梱せず、**OS が持っている WebView** を使うため、配布するファイルが小さく、メモリの使用量も少ない。画面は、React、Vue、Svelte など、好きなフロントエンドのフレームワークで書ける。

このドキュメントは、Tauri 2 を前提にしている。

---

## 概要 <a id="overview" data-name="概要"></a>

### 仕組み

```text
┌─────────────────────── アプリ (1つのプロセス) ───────────────────────┐
│                                                                      │
│   フロントエンド (WebView)            Rust のコア (バックエンド)      │
│   HTML / CSS / JavaScript   ──IPC──▶  コマンド、状態、プラグイン     │
│   (React、Vue、Svelte など)  ◀──────  ファイル、OS の機能            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

| 部分 | 役割 |
| --- | --- |
| フロントエンド | WebView の中で動く画面。`invoke` で、Rust の関数を呼ぶ |
| Rust のコア | ウィンドウの管理、ファイルの読み書き、OS の機能の呼び出し。フロントエンドからの要求を、受け取る |
| IPC | フロントエンドと Rust の間の、メッセージのやりとり (コマンドとイベント) |
| `wry` / `tao` | Tauri が内部で使う、WebView のライブラリ (`wry`) と、ウィンドウのライブラリ (`tao`) |

### WebView

| OS | 使われる WebView |
| --- | --- |
| Windows | WebView2 (Microsoft Edge ベース) |
| macOS / iOS | WKWebView (Safari と同じエンジン) |
| Linux | WebKitGTK |
| Android | Android System WebView |

<pre><code class="caution">OS ごとに、WebView の種類やバージョンが違うため、画面の見た目や、新しい Web の機能への対応が、OS ごとに異なることがある。
すべての OS で、動作を確認する。</code></pre>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 小さい | ブラウザを同梱しないため、配布するファイルが小さい |
| Rust のバックエンド | ファイル、ネットワーク、OS の機能を、Rust で、安全に高速に扱える |
| フロントエンドを選ばない | HTML を出力できるものなら、何でも使える |
| 権限の仕組み | フロントエンドが、使える機能を、明示的に許可する (Capabilities) |
| プラグイン | ファイル、ダイアログ、通知、更新など、公式のプラグインが、用意されている |
| マルチプラットフォーム | デスクトップとモバイルを、1つのコードで扱える |

### Electron との比較

| | Tauri | Electron |
| --- | --- | --- |
| バックエンドの言語 | Rust | Node.js (JavaScript) |
| ブラウザエンジン | OS の WebView を使う | Chromium を同梱する |
| 配布サイズ | 小さい | 大きい |
| 表示の一貫性 | OS の WebView によって、差がある | どの OS でも同じ |
| モバイル | 対応している | 対応していない |
| 学習コスト | Rust の知識が必要 | JavaScript だけで済む |

<pre><code class="tips">Rust が不慣れな場合は、画面とほとんどの処理を、JavaScript で書いて、Rust は、必要な部分 (ファイルや OS の機能) を呼ぶ程度に、とどめることもできる。
プラグインの機能を、フロントエンドから直接使えるため、自分で Rust のコードを書かなくても、多くのことができる。</code></pre>

---

## 前提条件 <a id="prerequisites" data-name="前提条件"></a>

| 必要なもの | 内容 |
| --- | --- |
| Rust | `rustup` で、インストールする |
| Node.js | フロントエンドのビルドに使う (npm、pnpm、yarn のいずれか) |
| OS ごとの依存 | 下の表のとおり |

| OS | 必要なもの |
| --- | --- |
| Windows | Microsoft C++ Build Tools (「C++ によるデスクトップ開発」)、WebView2 (Windows 10 の新しいバージョンと Windows 11 には、標準で入っている) |
| macOS | Xcode または Xcode Command Line Tools (`xcode-select --install`) |
| Linux | WebKitGTK (`libwebkit2gtk-4.1-dev`)、`build-essential`、`libssl-dev`、`librsvg2-dev`、`libxdo-dev`、`libayatana-appindicator3-dev` など (ディストリビューションごとにパッケージ名が違う) |
| Android | Android Studio、Android SDK と NDK、`JAVA_HOME` と `ANDROID_HOME` などの環境変数 |
| iOS | macOS と、Xcode |

<pre><code class="caution">OS ごとの依存パッケージは、バージョンやディストリビューションで変わる。公式ドキュメントの「Prerequisites」で、最新の手順を確認する。
Tauri や、そのプラグインの、新しいバージョンは、新しい Rust を要求することがある。Rust は、rustup update で、更新しておく。</code></pre>

---

## プロジェクトの作成 <a id="create" data-name="プロジェクトの作成"></a>

### create-tauri-app

```bash
npm create tauri-app@latest
```

対話式で、次の項目を選ぶ。

| 項目 | 内容 |
| --- | --- |
| プロジェクト名 | ディレクトリ名と、アプリの名前になる |
| 識別子 (identifier) | `com.example.my-app` のような、逆ドメイン形式の、一意な ID |
| フロントエンドの言語 | TypeScript / JavaScript、または Rust (Yew、Leptos など) |
| パッケージマネージャー | npm、pnpm、yarn など |
| UI のテンプレート | Vanilla、React、Vue、Svelte、Solid、Angular など |

テンプレートを、引数で指定することもできる。

```bash
npm create tauri-app@latest my-app -- --template react-ts
cd my-app
npm install
```

### 開発サーバーの起動

```bash
npm run tauri dev
```

ウィンドウが開き、フロントエンドを編集すると、すぐに反映される。Rust のコードを変更すると、自動で再ビルドされて、アプリが再起動する。

### 既存のプロジェクトに追加する

すでにあるフロントエンドのプロジェクトに、Tauri を追加できる。

```bash
npm install -D @tauri-apps/cli@latest
npx tauri init
```

### Tauri の CLI

| コマンド | 内容 |
| --- | --- |
| `tauri dev` | 開発モードで、アプリを起動する |
| `tauri build` | リリースビルドをして、インストーラーなどを作る |
| `tauri bundle` | ビルド済みのアプリから、バンドル (インストーラー) を作る |
| `tauri info` | 環境とバージョンの情報を表示する (不具合の調査に便利) |
| `tauri icon` | 1枚の画像から、各 OS のアイコンを生成する |
| `tauri add` | プラグインを追加する |
| `tauri plugin` | プラグインを作る・管理する |
| `tauri permission` / `tauri capability` | 権限と、Capabilities を管理する |
| `tauri android ...` / `tauri ios ...` | モバイル向けの、初期化、開発、ビルド |

`npm run tauri ...` の形で、プロジェクトに入れた CLI を使う。

---

## プロジェクトの構成 <a id="structure" data-name="プロジェクトの構成"></a>

```text
my-app/
├── index.html
├── package.json
├── vite.config.ts
├── src/                      # フロントエンド
│   └── main.ts
└── src-tauri/                # Rust 側
    ├── Cargo.toml
    ├── build.rs
    ├── tauri.conf.json       # Tauri の設定
    ├── capabilities/         # 権限の設定
    │   └── default.json
    ├── icons/                # アプリのアイコン
    └── src/
        ├── main.rs           # エントリーポイント
        └── lib.rs            # アプリの本体
```

選んだテンプレートによって、フロントエンド側の構成は変わる。Rust 側は、`src-tauri/` に、まとまっている。

### main.rs と lib.rs

アプリの本体は、`lib.rs` に書く。モバイルでは、`main` 関数が使われないため、デスクトップとモバイルの両方で、共通のコードを使えるように、分けている。

```rust
// src-tauri/src/main.rs
// Windows のリリースビルドで、コンソールのウィンドウを出さない
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    my_app_lib::run() // lib.rs の run を呼ぶ (クレート名は Cargo.toml の [lib] で決まる)
}
```

```rust
// src-tauri/src/lib.rs
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

| 要素 | 役割 |
| --- | --- |
| `tauri::Builder::default()` | アプリを組み立てる |
| `.invoke_handler(...)` | フロントエンドから呼べる、コマンドを登録する |
| `.plugin(...)` | プラグインを登録する |
| `.manage(...)` | 状態を登録する |
| `.setup(...)` | 起動時の処理 (ウィンドウやトレイの作成など) |
| `tauri::generate_context!()` | `tauri.conf.json` などの設定を、ビルド時に読み込む |
| `#[cfg_attr(mobile, tauri::mobile_entry_point)]` | モバイルのビルドで、この関数を、エントリーポイントにする |

---

## 設定ファイル <a id="config" data-name="設定ファイル"></a>

アプリの設定は、`src-tauri/tauri.conf.json` に書く。

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "my-app",
  "version": "0.1.0",
  "identifier": "com.example.my-app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      { "title": "My App", "width": 800, "height": 600 }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

| キー | 内容 |
| --- | --- |
| `productName` | アプリの名前 (インストーラーや、ウィンドウに表示される) |
| `version` | アプリのバージョン |
| `identifier` | 逆ドメイン形式の、一意な ID |
| `build.devUrl` | 開発中に、フロントエンドを読み込む URL (開発サーバーのアドレス) |
| `build.beforeDevCommand` | `tauri dev` の前に実行するコマンド (開発サーバーの起動) |
| `build.frontendDist` | ビルドしたフロントエンドの、出力先のディレクトリ |
| `build.beforeBuildCommand` | `tauri build` の前に実行するコマンド (フロントエンドのビルド) |
| `app.windows` | 起動時に作るウィンドウの設定 |
| `app.security.csp` | コンテンツセキュリティポリシー |
| `bundle` | インストーラーやアイコンなどの、配布に関する設定 |
| `plugins` | プラグインごとの設定 |

<pre><code class="tips">設定ファイルは、JSON のほかに、JSON5 や TOML の形式も使える。
プラットフォームごとに設定を分けたい場合は、tauri.linux.conf.json のように、プラットフォームの名前を付けたファイルで、一部を上書きできる。</code></pre>

---

## コマンド <a id="command" data-name="コマンド"></a>

フロントエンドから、**Rust の関数を呼ぶ**仕組み。Rust の関数に、`#[tauri::command]` を付けて、`generate_handler!` で登録する。

### 基本

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

```ts
import { invoke } from "@tauri-apps/api/core";

const message = await invoke<string>("greet", { name: "Tauri" });
console.log(message); // Hello, Tauri!
```

`invoke` は、`Promise` を返す。引数は、オブジェクトで渡す。

<pre><code class="caution">JavaScript から渡す引数の名前は、camelCase で書く。Rust 側の引数名 (snake_case) は、自動で変換される。
Rust の user_name は、JavaScript では userName で渡す。(snake_case のまま渡したい場合は、#[tauri::command(rename_all = "snake_case")] を付ける。)</code></pre>

```rust
#[tauri::command]
fn add_user(user_name: String, age: u32) -> String {
    format!("{} ({})", user_name, age)
}
```

```ts
await invoke("add_user", { userName: "Alice", age: 30 });
```

### 構造体を渡す・返す

引数は `Deserialize`、戻り値は `Serialize` を実装していれば、構造体も渡せる。

```rust
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct NewUser {
    name: String,
    age: u32,
}

#[derive(Serialize)]
struct User {
    id: u32,
    name: String,
}

#[tauri::command]
fn create_user(user: NewUser) -> User {
    User { id: 1, name: user.name }
}
```

```ts
interface User {
  id: number;
  name: string;
}

const user = await invoke<User>("create_user", {
  user: { name: "Alice", age: 30 },
});
```

### エラーを返す

戻り値を `Result<T, E>` にすると、`Err` のとき、JavaScript 側の `Promise` が、reject される。`E` は、`Serialize` を実装している必要がある。

```rust
#[tauri::command]
fn read_config(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}
```

```ts
try {
  const text = await invoke<string>("read_config", { path: "config.json" });
} catch (err) {
  console.error("失敗:", err); // Rust の Err の中身が入る
}
```

自作のエラー型を使う場合は、`thiserror` で定義して、`Serialize` を、手動で実装する。

```rust
#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

// フロントエンドには、エラーのメッセージを、文字列として渡す
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[tauri::command]
fn read_config(path: String) -> Result<String, Error> {
    Ok(std::fs::read_to_string(path)?) // ? で、io::Error が Error に変換される
}
```

<pre><code class="tips">anyhow::Error は Serialize を実装していないため、そのままコマンドの戻り値には使えない。
内部では anyhow を使い、コマンドの境界で、上のような自作のエラー型に変換するか、map_err(|e| e.to_string()) で、文字列にする。</code></pre>

### 非同期のコマンド

`async fn` にすると、メインスレッドをブロックせずに、実行される。時間のかかる処理 (ネットワークやファイルの I/O) は、非同期のコマンドにする。

```rust
#[tauri::command]
async fn fetch_text(url: String) -> Result<String, String> {
    let body = reqwest::get(&url)
        .await
        .map_err(|e| e.to_string())?
        .text()
        .await
        .map_err(|e| e.to_string())?;
    Ok(body)
}
```

| 種類 | 実行される場所 |
| --- | --- |
| 通常の `fn` のコマンド | メインスレッド (重い処理は、UI を止めることがある) |
| `async fn` のコマンド | 非同期のランタイム (Tokio) のスレッド |

<pre><code class="caution">async のコマンドが、&amp;str のような、借用した型の引数を受け取る場合は、戻り値を Result にする必要がある。
借用を避けるなら、String など、所有した型で受け取る。</code></pre>

### 引数に渡せる特別な型

コマンドの引数に、次の型を書くと、Tauri が自動で渡してくれる (JavaScript からは、渡さない)。

| 型 | 内容 |
| --- | --- |
| `tauri::AppHandle` | アプリ全体の操作 (ウィンドウの作成、イベントの送信、パスの取得など) |
| `tauri::WebviewWindow` | このコマンドを呼んだ、ウィンドウ |
| `tauri::State<'_, T>` | `manage` で登録した、状態 |
| `tauri::ipc::Channel<T>` | フロントエンドへ、データを連続して送る経路 |

```rust
#[tauri::command]
fn app_info(app: tauri::AppHandle) -> String {
    app.package_info().name.clone()
}
```

### コマンドを別のファイルに分ける

```rust
// src-tauri/src/commands.rs
#[tauri::command]
pub fn hello() -> String {
    "hello".to_string()
}
```

```rust
// src-tauri/src/lib.rs
mod commands;

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![commands::hello])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

<pre><code class="caution">lib.rs に直接書いたコマンドは、pub にできない。別のモジュールに分けたコマンドは、pub にして、モジュールのパス (commands::hello) で登録する。</code></pre>

### 連続してデータを送る (Channel)

ダウンロードの進捗のように、**処理中に何度も、フロントエンドへデータを送りたい**ときは、`Channel` を使う。

```rust
use tauri::ipc::Channel;

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
enum DownloadEvent {
    Started { url: String },
    Progress { bytes: usize },
    Finished,
}

#[tauri::command]
fn download(url: String, on_event: Channel<DownloadEvent>) {
    on_event.send(DownloadEvent::Started { url }).unwrap();
    for bytes in [1000, 2000, 3000] {
        on_event.send(DownloadEvent::Progress { bytes }).unwrap();
    }
    on_event.send(DownloadEvent::Finished).unwrap();
}
```

```ts
import { invoke, Channel } from "@tauri-apps/api/core";

type DownloadEvent =
  | { event: "started"; data: { url: string } }
  | { event: "progress"; data: { bytes: number } }
  | { event: "finished" };

const onEvent = new Channel<DownloadEvent>();
onEvent.onmessage = (message) => {
  console.log(message.event, message);
};

await invoke("download", { url: "https://example.com/file", onEvent });
```

---

## 状態管理 <a id="state" data-name="状態管理"></a>

アプリ全体で共有するデータは、`manage` で登録して、コマンドの引数の `State` で受け取る。

```rust
use std::sync::Mutex;
use tauri::State;

#[derive(Default)]
struct AppState {
    counter: u32,
}

#[tauri::command]
fn increment(state: State<'_, Mutex<AppState>>) -> u32 {
    let mut s = state.lock().unwrap();
    s.counter += 1;
    s.counter
}

pub fn run() {
    tauri::Builder::default()
        .manage(Mutex::new(AppState::default())) // 状態を登録する
        .invoke_handler(tauri::generate_handler![increment])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

| 項目 | 内容 |
| --- | --- |
| 書き換える状態 | `Mutex` (または `RwLock`) で包む。`State` は、共有された参照として渡されるため |
| `Arc` | 不要 (Tauri が、内部で共有している) |
| 型の一致 | `manage` に渡した型と、`State<T>` の `T` が、完全に一致している必要がある (`Mutex<AppState>` で登録したなら、`State<'_, Mutex<AppState>>`) |
| `setup` の中で取得 | `app.state::<Mutex<AppState>>()` (`use tauri::Manager;` が必要) |

<pre><code class="caution">std::sync::Mutex のロックを持ったまま .await してはいけない (ロックを持つ時間が長くなり、デッドロックの原因になる)。
await をまたいで、ロックを持つ必要があるときは、tokio::sync::Mutex を使う。</code></pre>

---

## イベント <a id="event" data-name="イベント"></a>

コマンドが、「フロントエンドからの、呼び出し」なのに対して、イベントは、**どちらからでも、メッセージを送れる**、通知の仕組み。

| | コマンド | イベント |
| --- | --- | --- |
| 方向 | フロントエンド → Rust | どちらからも |
| 戻り値 | あり (`Promise`) | なし (一方向の通知) |
| 型 | 引数と戻り値に、型がある | JSON (任意のペイロード) |
| 向いている用途 | 処理の依頼と、結果の取得 | 状態の変化の通知、複数の受け手への配信 |

### Rust からフロントエンドへ

```rust
use tauri::{AppHandle, Emitter};

#[derive(Clone, serde::Serialize)]
struct Progress {
    percent: u32,
}

#[tauri::command]
fn start_job(app: AppHandle) {
    for percent in [25, 50, 75, 100] {
        // 全ウィンドウに送る
        app.emit("job-progress", Progress { percent }).unwrap();
    }
}
```

```ts
import { listen } from "@tauri-apps/api/event";

// リスナーを登録する (戻り値は、解除する関数)
const unlisten = await listen<{ percent: number }>("job-progress", (event) => {
  console.log(`進捗: ${event.payload.percent}%`);
});

// 不要になったら、解除する
unlisten();
```

### フロントエンドから Rust へ

```ts
import { emit } from "@tauri-apps/api/event";

await emit("user-clicked", { id: 1 });
```

```rust
use tauri::Listener;

tauri::Builder::default()
    .setup(|app| {
        app.listen("user-clicked", |event| {
            println!("受信: {}", event.payload());
        });
        Ok(())
    })
```

| メソッド | 内容 |
| --- | --- |
| `app.emit(name, payload)` | すべてのウィンドウに、送る |
| `app.emit_to(label, name, payload)` | 特定のウィンドウに、送る |
| `app.listen(name, handler)` | イベントを受け取る |

<pre><code class="tips">ペイロードは、Serialize と Clone を実装した型にする。
イベントを送る側のメソッドは Emitter トレイト、受け取る側のメソッドは Listener トレイトで、提供されるため、use が必要。
コンポーネントが消えるときに、listen の解除 (unlisten) を忘れると、リスナーが残り続ける。</code></pre>

---

## 権限 (Capabilities) <a id="capabilities" data-name="権限"></a>

Tauri 2 では、フロントエンドから使える機能が、**許可されたものだけ**に制限される。ファイルの読み書きやウィンドウの操作などの機能は、**Capabilities** で、許可を与えないと、使えない。

権限の設定は、`src-tauri/capabilities/` の、JSON ファイルに書く。

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "メインウィンドウの権限",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "opener:default",
    "dialog:default",
    "fs:allow-read-text-file"
  ]
}
```

| キー | 内容 |
| --- | --- |
| `identifier` | この Capability の名前 |
| `windows` | この権限を与える、ウィンドウのラベル (`"*"` で、すべて) |
| `webviews` | WebView のラベルで、対象を指定する場合 |
| `permissions` | 許可する権限の一覧 |
| `platforms` | 適用する OS (`linux`、`macOS`、`windows`、`android`、`iOS`) |

### 権限の名前

| 形式 | 内容 |
| --- | --- |
| `プラグイン名:default` | そのプラグインの、既定の権限のセット |
| `プラグイン名:allow-コマンド名` | 特定のコマンドを、許可する |
| `プラグイン名:deny-コマンド名` | 特定のコマンドを、禁止する |
| `core:default` | Tauri 本体の機能 (ウィンドウ、イベントなど) の、既定の権限 |

### スコープ (許可する範囲)

ファイルなど、対象を持つ権限は、**スコープ**で、許可する範囲を絞れる。

```json
{
  "identifier": "fs:allow-read-text-file",
  "allow": [{ "path": "$APPDATA/*" }]
}
```

この例では、アプリのデータディレクトリ (`$APPDATA`) の中の、ファイルだけを読める。

### 権限が足りないとき

権限が許可されていない機能を呼ぶと、`not allowed. Permissions associated with this command: ...` のような、エラーになる。エラーに表示された権限を、Capability に追加する。

```bash
npm run tauri permission add fs:allow-read-text-file
```

### CSP

`tauri.conf.json` の `app.security.csp` で、コンテンツセキュリティポリシーを設定できる。テンプレートでは `null` (無効) になっているため、公開するアプリでは、設定する。

```json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; connect-src ipc: http://ipc.localhost"
    }
  }
}
```

<pre><code class="caution">外部の Web サイトのスクリプトや、信頼できないコンテンツを、アプリの WebView で読み込むと、フロントエンドから、Rust の機能が呼ばれる危険がある。
読み込むコンテンツは、アプリに同梱したものに限り、Capabilities は、必要最小限にする。
自作のコマンド (generate_handler! で登録したもの) を、細かく制限する方法は、公式ドキュメントの「アプリのマニフェスト」を参照する。</code></pre>

---

## プラグイン <a id="plugin" data-name="プラグイン"></a>

多くの機能は、公式の**プラグイン**として提供される。プラグインは、Rust の crate (`tauri-plugin-名前`) と、JavaScript のパッケージ (`@tauri-apps/plugin-名前`) の、2つで1組になっている。

### 主な公式プラグイン

| プラグイン | 内容 |
| --- | --- |
| `opener` | URL やファイルを、OS の既定のアプリで開く |
| `dialog` | ファイルの選択、保存、メッセージのダイアログ |
| `fs` | ファイルシステムの、読み書き |
| `http` | HTTP リクエスト (Rust 側から送るため、CORS の制限を受けない) |
| `shell` | 外部のコマンドの実行、サイドカー (同梱する実行ファイル) |
| `store` | キーと値の、永続的な保存 (設定の保存など) |
| `sql` | SQLite などの、データベース |
| `notification` | OS の通知 |
| `clipboard-manager` | クリップボードの読み書き |
| `global-shortcut` | アプリが非アクティブでも動く、グローバルなショートカット |
| `os` | OS の情報 |
| `process` | アプリの終了や、再起動 |
| `log` | ログの出力 |
| `updater` | アプリの自動更新 |
| `window-state` | ウィンドウの位置とサイズを、保存・復元する |
| `single-instance` | アプリの、多重起動を防ぐ |
| `autostart` | OS のログイン時に、自動で起動する |
| `deep-link` | カスタム URL (`myapp://...`) でアプリを開く |
| `positioner` | ウィンドウを、画面の特定の位置に配置する |
| `stronghold` | 暗号化された、安全なストレージ |
| `websocket` | WebSocket |
| `upload` | ファイルのアップロードとダウンロード |
| `cli` | コマンドライン引数の解析 |

`barcode-scanner`、`biometric`、`nfc`、`geolocation`、`haptics` は、主にモバイル向けのプラグイン。

### プラグインを追加する

```bash
npm run tauri add dialog
```

このコマンドは、Rust の依存関係、JavaScript のパッケージ、プラグインの登録、基本の権限の追加までを、まとめて行う。手動で行う場合は、次の4つの手順になる。

| 手順 | 内容 |
| --- | --- |
| 1 | `cargo add tauri-plugin-dialog` (`src-tauri/` の中で) |
| 2 | `npm add @tauri-apps/plugin-dialog` |
| 3 | `lib.rs` で、プラグインを登録する |
| 4 | Capabilities に、権限を追加する (`dialog:default`) |

```rust
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init()) // プラグインを登録
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 使用例

#### dialog (ファイルを選ぶ)

```ts
import { open } from "@tauri-apps/plugin-dialog";

const file = await open({
  multiple: false,
  directory: false,
  filters: [{ name: "テキスト", extensions: ["txt", "md"] }],
});
console.log(file); // 選んだファイルのパス (キャンセルなら null)
```

#### fs (ファイルを読む)

```ts
import { readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";

// アプリの設定ディレクトリの、config.json を読む
const text = await readTextFile("config.json", {
  baseDir: BaseDirectory.AppConfig,
});
```

```json
{
  "permissions": [
    "fs:allow-read-text-file",
    {
      "identifier": "fs:scope",
      "allow": [{ "path": "$APPCONFIG/*" }]
    }
  ]
}
```

#### store (設定を保存する)

```ts
import { Store } from "@tauri-apps/plugin-store";

const store = await Store.load("settings.json");

await store.set("theme", "dark");
await store.save();

const theme = await store.get<string>("theme");
```

<pre><code class="tips">プラグインの Rust 側と JavaScript 側のバージョンは、同じ系統に揃える。
バージョンが食い違うと、実行時にエラーになることがある。tauri info で、各パッケージのバージョンを確認できる。</code></pre>

---

## ウィンドウ <a id="window" data-name="ウィンドウ"></a>

### 設定で作る

`tauri.conf.json` の `app.windows` に、ウィンドウを定義する。`label` を指定しないと `main` になる。

```json
{
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "My App",
        "width": 1000,
        "height": 700,
        "minWidth": 600,
        "resizable": true
      }
    ]
  }
}
```

### Rust で作る

```rust
use tauri::{WebviewUrl, WebviewWindowBuilder};

#[tauri::command]
fn open_settings(app: tauri::AppHandle) -> tauri::Result<()> {
    WebviewWindowBuilder::new(&app, "settings", WebviewUrl::App("settings.html".into()))
        .title("設定")
        .inner_size(500.0, 400.0)
        .build()?;
    Ok(())
}
```

### フロントエンドから操作する

```ts
import { getCurrentWindow } from "@tauri-apps/api/window";

const win = getCurrentWindow();
await win.setTitle("新しいタイトル");
await win.minimize();
```

ウィンドウの操作も、権限が必要。たとえば、`setTitle` には、`core:window:allow-set-title` が必要になる。

<pre><code class="tips">ウィンドウの枠をなくして (decorations を false に)、独自のタイトルバーを作る場合は、ドラッグで動かせる領域に、data-tauri-drag-region 属性を付ける。
また、最小化や閉じるボタンの操作に必要な、ウィンドウの権限を、Capability に追加する。</code></pre>

---

## メニューとトレイ <a id="tray" data-name="メニューとトレイ"></a>

### システムトレイ

トレイのアイコンを使うには、`tray-icon` フィーチャーを有効にする。

```toml
# src-tauri/Cargo.toml
tauri = { version = "2", features = ["tray-icon"] }
```

```rust
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
};

pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let quit = MenuItem::with_id(app, "quit", "終了", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit])?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .on_menu_event(|app, event| {
                    if event.id.as_ref() == "quit" {
                        app.exit(0);
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

アプリのメニューバーは、`tauri::menu::{Menu, Submenu, MenuItem}` で組み立てて、`app.set_menu(...)` で設定する。

---

## ファイルとパス <a id="path" data-name="ファイルとパス"></a>

アプリのデータや設定を保存する場所は、OS ごとに違う。`app.path()` で、OS に合った場所を取得できる。

```rust
use tauri::Manager;

#[tauri::command]
fn data_dir(app: tauri::AppHandle) -> Result<String, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    Ok(dir.to_string_lossy().to_string())
}
```

| メソッド | 内容 |
| --- | --- |
| `app_data_dir()` | アプリのデータの保存先 |
| `app_config_dir()` | アプリの設定の保存先 |
| `app_cache_dir()` | アプリのキャッシュの保存先 |
| `app_log_dir()` | アプリのログの保存先 |
| `resource_dir()` | アプリに同梱した、リソースの場所 |
| `home_dir()` / `download_dir()` など | OS の標準のディレクトリ |

### リソースとサイドカー

| 機能 | 設定 | 内容 |
| --- | --- | --- |
| リソース | `bundle.resources` | データファイルなどを、アプリに同梱する |
| サイドカー | `bundle.externalBin` | 別の実行ファイルを同梱して、`shell` プラグインで起動する |

---

## フロントエンド <a id="frontend" data-name="フロントエンド"></a>

### フレームワークを使うときの注意

Tauri のアプリのフロントエンドは、**静的なファイル**として、アプリに同梱される。サーバーでのレンダリング (SSR) には、対応していない。

| フレームワーク | 設定 |
| --- | --- |
| React、Vue、Svelte (Vite) | そのまま使える |
| Next.js、Nuxt、SvelteKit など | 静的な書き出し (SSG、SPA モード) にする |

`tauri.conf.json` の `build.frontendDist` に、ビルドの出力先を指定する。

<pre><code class="caution">アプリの画面を、通常のブラウザで開くと、invoke などの Tauri の API は、使えない (Tauri のウィンドウの中でだけ、動く)。
ブラウザだけで、画面を確認したいときは、Tauri の API の呼び出しを、まとめた関数を作って、ブラウザでは、ダミーの値を返すようにする。</code></pre>

### JavaScript の API パッケージ

| パッケージ | 内容 |
| --- | --- |
| `@tauri-apps/api/core` | `invoke`、`Channel` など |
| `@tauri-apps/api/event` | `listen`、`emit` |
| `@tauri-apps/api/window` | ウィンドウの操作 |
| `@tauri-apps/api/path` | パスの取得 |
| `@tauri-apps/plugin-*` | 各プラグインの API |

---

## 開発とデバッグ <a id="debug" data-name="開発とデバッグ"></a>

| 目的 | 方法 |
| --- | --- |
| フロントエンドのデバッグ | ウィンドウを右クリックして「Inspect (検証)」を選ぶ。または開発者ツールのショートカットを使う (開発モードで有効) |
| Rust のログ | `println!` や `dbg!` の出力は、`tauri dev` を実行しているターミナルに表示される |
| 本格的なログ | `tauri-plugin-log` で、ログをファイルや WebView に出す |
| バックトレース | `RUST_BACKTRACE=1 npm run tauri dev` |
| リリースビルドのデバッグ | `tauri build --debug` で、デバッグ情報つきのビルドを作る |
| 環境の確認 | `npm run tauri info` |

<pre><code class="tips">リリースビルドで、開発者ツールを使いたい場合は、tauri の devtools フィーチャーを有効にする。
ただし、本番のアプリで、開発者ツールを使えるようにすることは、セキュリティ上のリスクがあるため、通常は避ける。</code></pre>

---

## ビルドと配布 <a id="build" data-name="ビルドと配布"></a>

```bash
npm run tauri build
```

フロントエンドのビルドと、Rust のリリースビルドを行い、インストーラーを作る。出力は、`src-tauri/target/release/bundle/` に作られる。

| OS | 生成される形式 |
| --- | --- |
| Windows | `.msi`、`.exe` (NSIS のインストーラー) |
| macOS | `.app`、`.dmg` |
| Linux | `.deb`、`.rpm`、`.AppImage` |
| Android | `.apk`、`.aab` |
| iOS | `.ipa` |

`bundle.targets` で、作る形式を絞れる (`"all"` ですべて)。

### OS ごとにビルドする

Tauri のアプリは、基本的に、**ビルドする OS 向けのもの**が作られる。Windows 向けのインストーラーは Windows で、macOS 向けは macOS で、ビルドする。複数の OS 向けに配布するときは、CI (GitHub Actions など) で、OS ごとにビルドする。

{% raw %}
```yaml
name: release
on:
  push:
    tags: ["v*"]

jobs:
  build:
    strategy:
      matrix:
        platform: [macos-latest, ubuntu-22.04, windows-latest]
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Linux の依存パッケージ
        if: matrix.platform == 'ubuntu-22.04'
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.1-dev libayatana-appindicator3-dev librsvg2-dev
      - run: npm ci
      - uses: tauri-apps/tauri-action@v0
```
{% endraw %}

`tauri-apps/tauri-action` は、ビルドして、GitHub の Releases に、インストーラーをアップロードするアクション。

### 署名

| OS | 内容 |
| --- | --- |
| macOS | コード署名と、公証 (notarization) が必要。ないと、他のユーザーの環境で、警告が出る |
| Windows | コード署名の証明書があると、SmartScreen の警告を、減らせる |
| アップデーター | `updater` プラグインは、更新ファイルの署名の検証が必須。`tauri signer generate` で鍵を作る |

---

## モバイル <a id="mobile" data-name="モバイル"></a>

Tauri 2 は、**iOS と Android**にも対応している。同じ Rust のコードとフロントエンドを、モバイルでも使える。

```bash
# 初期化 (最初の1回)
npm run tauri android init
npm run tauri ios init

# 開発 (エミュレーターや、実機で起動)
npm run tauri android dev
npm run tauri ios dev

# ビルド
npm run tauri android build
npm run tauri ios build
```

| 項目 | 内容 |
| --- | --- |
| エントリーポイント | `#[cfg_attr(mobile, tauri::mobile_entry_point)]` を、`run` 関数に付ける |
| 条件付きコンパイル | `#[cfg(desktop)]` と `#[cfg(mobile)]` で、デスクトップ専用・モバイル専用のコードを分ける |
| 使えない機能 | メニュー、トレイ、複数のウィンドウなど、デスクトップ専用の機能がある |
| モバイル専用のプラグイン | `barcode-scanner`、`biometric`、`nfc`、`geolocation`、`haptics` など |

```rust
pub fn run() {
    let builder = tauri::Builder::default();

    // デスクトップでだけ、プラグインを登録する
    #[cfg(desktop)]
    let builder = builder.plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}));

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

---

## テスト <a id="test" data-name="テスト"></a>

| 対象 | 方法 |
| --- | --- |
| Rust のロジック | 通常の `cargo test`。コマンドの中身を、通常の関数に切り出して、それを単体でテストする |
| フロントエンド | Vitest など。`@tauri-apps/api/mocks` の `mockIPC` で、`invoke` を、模擬できる |
| アプリ全体 (E2E) | WebDriver (`tauri-driver`)。主に Windows と Linux で使える |

### ロジックを切り出す

コマンドは、フロントエンドとの接続部分だけにして、実際の処理は、通常の関数に分けると、テストしやすい。

```rust
// 通常の関数: Tauri に依存せず、そのままテストできる
pub fn calc_total(prices: &[u32]) -> u32 {
    prices.iter().sum()
}

#[tauri::command]
fn total(prices: Vec<u32>) -> u32 {
    calc_total(&prices)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn calc_total_sums_prices() {
        assert_eq!(calc_total(&[100, 200, 300]), 600);
    }
}
```

### フロントエンドでの模擬

```ts
import { mockIPC } from "@tauri-apps/api/mocks";
import { invoke } from "@tauri-apps/api/core";
import { expect, test } from "vitest";

test("greet を呼ぶ", async () => {
  mockIPC((cmd, args) => {
    if (cmd === "greet") {
      return `Hello, ${(args as { name: string }).name}!`;
    }
  });

  expect(await invoke("greet", { name: "Tauri" })).toBe("Hello, Tauri!");
});
```

テストの書き方の詳細は、「Rustのテスト」のドキュメントを参照。

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| 引数が、Rust に届かない (または、エラー) | JavaScript 側の引数名が、snake_case になっている | camelCase で渡す (`user_name` は `userName`) |
| `not allowed. Permissions associated with this command: ...` | 必要な権限が、Capabilities にない | 表示された権限を、`capabilities/*.json` に追加する |
| `state not managed for field ...` で、パニック | `manage` で、状態を登録していない、または型が一致しない | `.manage(...)` で登録する。`Mutex` で包んで登録したなら、`State` の型も、同じにする |
| `async` のコマンドで、コンパイルエラー | 借用した引数 (`&str`) があるのに、戻り値が `Result` でない | `Result` を返す。または `String` などの所有した型で受け取る |
| lib.rs のコマンドが、`pub` にできない | 生成されるコードとの、制約 | 別のモジュールに分けて、`pub` にする |
| 画面をブラウザで開くと、`invoke` でエラー | Tauri の API は、Tauri のウィンドウの中でだけ動く | `npm run tauri dev` で、アプリとして起動する |
| 外部の API の呼び出しが、ブロックされる | CSP、または CORS | CSP の `connect-src` を、確認する。CORS を避けたいなら、`http` プラグインや、Rust 側で通信する |
| Linux でビルドに失敗する | WebKitGTK などの、依存パッケージがない | 前提条件のパッケージを、インストールする (`webkit2gtk-4.1`) |
| Windows でビルドに失敗する | C++ Build Tools がない | 「C++ によるデスクトップ開発」を、インストールする |
| `tauri dev` では動くが、ビルド後は動かない | `frontendDist` のパスが違う、または相対パスの扱い | `build.frontendDist` を、確認する。リソースは `resource_dir()` で参照する |
| 大きなデータを `invoke` で渡して、遅い | JSON にして、やりとりされる | `tauri::ipc::Response` でバイナリを返す。連続するデータは、`Channel` を使う |
| UI の動作が、重い | 重い処理を、同期のコマンド (メインスレッド) で実行している | `async fn` のコマンドにする。または、別のスレッドで実行する |
| 見た目が、OS ごとに違う | OS の WebView が、異なる | 各 OS で確認する。最新の CSS の機能は、対応を確認して使う |
| `bundle` でアイコンのエラー | アイコンのファイルがない | `npm run tauri icon 画像.png` で生成する |
| プラグインが、動かない | Rust と JavaScript のバージョンが、食い違っている、または権限が足りない | バージョンを揃える。`tauri info` で確認する |
| Rust のバージョンのエラー | Tauri や、プラグインが、新しい Rust を要求している | `rustup update` |

---

## 関連 <a id="ecosystem" data-name="関連"></a>

| 名前 | 内容 |
| --- | --- |
| `tauri` | 本体の crate |
| `tauri-build` | ビルドスクリプト用の crate |
| `wry` / `tao` | WebView とウィンドウの、基盤の crate |
| `tauri-plugin-*` | 公式のプラグイン |
| `tauri-apps/tauri-action` | GitHub Actions で、ビルドとリリースを行う |
| `tauri-driver` | WebDriver による、E2E テスト |
| `tauri-specta` | コマンドの型から、TypeScript の型を生成する (コミュニティ製) |
| `serde` / `serde_json` | コマンドの引数と、戻り値の変換 |
| `thiserror` / `anyhow` | エラー処理 |
| `tokio` | 非同期のランタイム |

### 他の選択肢

| 名前 | 内容 |
| --- | --- |
| Electron | Chromium を同梱する、JavaScript のデスクトップアプリのフレームワーク |
| Dioxus | Rust で画面も書く、クロスプラットフォームの UI フレームワーク |
| Wails | Go で書く、Tauri に近い仕組みのフレームワーク |
