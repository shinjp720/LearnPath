---
title: Axum
layout: default
---

# Axum <a id="top" data-name="TOP"></a>

Axum は非同期ランタイムの Tokio と、HTTP ライブラリの Hyper を利用しており、Rust らしい型安全な Web アプリケーションを作れる。

ミドルウェアには Tower のエコシステム (`tower` / `tower-http`) をそのまま使える。<br>
独自のマクロに頼らず、通常の関数とトレイト (エクストラクタ、`IntoResponse`) でハンドラを書くのが特徴。

---

## 導入 <a id="introduction" data-name="導入"></a>

### cargo add

```bash
cargo add axum
cargo add tokio --features full
```

### Cargo.toml

```toml
[dependencies]
axum = "0.8"
tokio = { version = "1", features = ["full"] }
```

JSON やクエリを扱う場合は、`serde` も追加する。

```toml
[dependencies]
axum = "0.8"
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```

### よく使うクレート

| クレート | 用途 |
| --- | --- |
| `tokio` | 非同期ランタイム (`#[tokio::main]` など) |
| `serde` / `serde_json` | JSON やクエリの変換 (`Deserialize` / `Serialize`) |
| `tower` | ミドルウェアの基盤 (`ServiceBuilder` など) |
| `tower-http` | 実用的なミドルウェア集 (ログ、CORS、圧縮、静的ファイル配信) |
| `tracing` / `tracing-subscriber` | ログ出力 |
| `axum-extra` | Cookie や型付きヘッダーなど、axum 本体にない拡張 |

<pre><code class="caution">パスの書き方は、axum 0.7 と 0.8 で異なる。
0.7 は /users/:id、0.8 は /users/{id}。このドキュメントは 0.8 の書き方に統一している。</code></pre>

---

## 最小構成 <a id="minimal" data-name="最小構成"></a>

```rust
use axum::{
    routing::get,
    Router,
};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(root));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    axum::serve(listener, app)
        .await
        .unwrap();
}

async fn root() -> &'static str {
    "Hello, World!"
}
```

Axum は非同期処理を前提としているため、ほとんどのハンドラは async 関数になる。

| 要素 | 役割 |
| --- | --- |
| `Router::new()` | ルーターを作る |
| `.route("/", get(root))` | パス `/` への GET リクエストを、`root` 関数に渡す |
| `TcpListener::bind` | 待ち受けるアドレスとポートを指定する |
| `axum::serve` | ルーターを使って、サーバーを起動する |

<pre><code class="tips">0.0.0.0 は、すべてのネットワークインターフェースで待ち受ける (外部からもアクセスできる)。
開発中に自分のマシンからだけ使うなら 127.0.0.1:3000 にする。</code></pre>

### サーバーの起動

```bash
cargo run
```

### 動作確認

```bash
curl http://localhost:3000/
# Hello, World!
```

---

## 基本 <a id="basic" data-name="基本"></a>

### HTTP メソッド

```rust
use axum::routing::{get, post};

Router::new()
    .route("/", get(index))
    .route("/users", post(create_user));
```

| 関数 | HTTP メソッド |
| --- | --- |
| `get` | GET |
| `post` | POST |
| `put` | PUT |
| `delete` | DELETE |
| `patch` | PATCH |

これらは `axum::routing` にあり、`head`、`options` なども用意されている。

同じパスに複数のメソッドを割り当てる場合は、チェーンでつなげる。

```rust
Router::new()
    .route("/users", get(list_users).post(create_user));
```

### パスパラメータ

URL のパスの一部を取得する。

```rust
use axum::extract::Path;

async fn user(
    Path(id): Path<u32>
) -> String {
    format!("user: {}", id)
}
```

#### ルーティング

```rust
.route("/users/{id}", get(user))
```

#### アクセス

```text
/users/123
```

`Path<u32>` の指定により、`123` は自動で `u32` に変換される。数値に変換できない場合 (`/users/abc` など) は、`400 Bad Request` が返る。

#### 複数のパスパラメータ

タプル、または構造体で受け取る。

```rust
use axum::extract::Path;
use serde::Deserialize;

// タプルで受け取る (パスの出現順)
async fn post_by_tuple(
    Path((user_id, post_id)): Path<(u32, u32)>
) -> String {
    format!("user: {}, post: {}", user_id, post_id)
}

// 構造体で受け取る (フィールド名がパラメータ名と対応する)
#[derive(Deserialize)]
struct PostPath {
    user_id: u32,
    post_id: u32,
}

async fn post_by_struct(
    Path(p): Path<PostPath>
) -> String {
    format!("user: {}, post: {}", p.user_id, p.post_id)
}
```

```rust
.route("/users/{user_id}/posts/{post_id}", get(post_by_struct))
```

### クエリパラメータ

URL のクエリ文字列から、値を取得する。

```rust
use axum::extract::Query;
use serde::Deserialize;

#[derive(Deserialize)]
struct Params {
    name: String,
}

async fn hello(
    Query(params): Query<Params>
) -> String {
    format!("Hello {}", params.name)
}
```

#### アクセス

```text
/hello?name=bob
```

```text
/users?page=2&sort=name&active=true
```

省略できるパラメータは `Option` にする。`Option` でないフィールドが欠けていると、`400 Bad Request` になる。

```rust
use axum::extract::Query;
use serde::Deserialize;

#[derive(Deserialize)]
struct ListParams {
    page: Option<u32>,
    sort: Option<String>,
    #[serde(default)] // 省略されたら false (Default の値) になる
    active: bool,
}

async fn list_users(
    Query(p): Query<ListParams>
) -> String {
    let page = p.page.unwrap_or(1);
    format!("page={}, sort={:?}, active={}", page, p.sort, p.active)
}
```

### JSON 受信

POST で JSON を受け取る例。

```rust
use axum::Json;
use serde::Deserialize;

#[derive(Deserialize)]
struct User {
    name: String,
}

async fn create_user(
    Json(user): Json<User>
) -> String {
    format!("created {}", user.name)
}
```

送信するデータ (リクエストボディ)

```json
{
    "name": "bob"
}
```

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "bob"}'
```

<pre><code class="caution">Json エクストラクタは、Content-Type: application/json のヘッダーがないと 415 Unsupported Media Type を返す。
curl で試すときは、-H "Content-Type: application/json" を忘れないようにする。</code></pre>

### JSON 返却

```rust
use axum::Json;
use serde::Serialize;

#[derive(Serialize)]
struct User {
    name: String,
}

async fn get_user() -> Json<User> {
    Json(User {
        name: "shin".into(),
    })
}
```

`Json` は、受信にも返却にも使える。受信では `Deserialize`、返却では `Serialize` を実装した型が必要になる。

### 状態共有

アプリ全体で共有するデータ。例えば DB 接続プールなど。

```rust
use axum::extract::State;

#[derive(Clone)]
struct AppState {
    app_name: String,
}
```

#### Router に登録

```rust
let state = AppState {
    app_name: "My App".into(),
};

let app = Router::new()
    .route("/", get(root))
    .with_state(state);
```

#### 取得

```rust
async fn root(
    State(state): State<AppState>
) -> String {
    state.app_name
}
```

#### 書き換えられる状態

リクエストごとに状態を書き換える場合は、`Arc` と `Mutex` で包む。<br>
`AppState` は、リクエストのたびに `Clone` されるため、`Arc` で包むと中身はコピーされずに共有される。

```rust
use std::sync::{Arc, Mutex};
use axum::extract::State;

#[derive(Clone)]
struct AppState {
    counter: Arc<Mutex<u32>>,
}

async fn count(
    State(state): State<AppState>
) -> String {
    let mut counter = state.counter.lock().unwrap();
    *counter += 1;
    format!("count: {}", *counter)
}
```

```rust
let state = AppState {
    counter: Arc::new(Mutex::new(0)),
};

let app = Router::new()
    .route("/count", get(count))
    .with_state(state);
```

<pre><code class="tips">ロックを持つ時間が短く、ロック中に .await しないなら、std::sync::Mutex で問題ない。
ロックを保持したまま .await が必要な場合は、tokio::sync::Mutex を使う。</code></pre>

#### DB 接続プール

```rust
#[derive(Clone)]
struct AppState {
    db: sqlx::PgPool, // プールの内部が Arc なので、Clone しても同じプールを共有する
}
```

<pre><code class="tips">with_state は、ルーターの最後に呼ぶ。
複数のファイルでルーターを分ける場合は、各ルーターを Router&lt;AppState&gt; を返す関数にして、最終的なルーターで1回だけ with_state を呼ぶ。</code></pre>

---

## ハンドラとエクストラクタ <a id="handler" data-name="ハンドラとエクストラクタ"></a>

ハンドラは、**エクストラクタを引数に取り、`IntoResponse` を実装した型を返す async 関数**。

```rust
async fn handler(
    State(state): State<AppState>,   // エクストラクタ
    Path(id): Path<u32>,             // エクストラクタ
    Json(body): Json<Payload>,       // エクストラクタ (ボディを消費するので、最後に置く)
) -> impl IntoResponse {
    // ...
}
```

### 主なエクストラクタ

| エクストラクタ | 取得するもの | 備考 |
| --- | --- | --- |
| `Path<T>` | パスパラメータ | |
| `Query<T>` | クエリ文字列 | |
| `Json<T>` | JSON のボディ | ボディを消費する |
| `Form<T>` | フォームのボディ (`application/x-www-form-urlencoded`) | ボディを消費する |
| `State<S>` | アプリ全体の状態 | |
| `HeaderMap` | すべてのヘッダー | |
| `Extension<T>` | `layer` で追加した値 | 型の不一致が実行時まで分からないため、通常は `State` を優先する |
| `String` / `Bytes` | 生のボディ | ボディを消費する |
| `Request` | リクエスト全体 | ボディを消費する |
| `ConnectInfo<SocketAddr>` | 接続元のアドレス | `into_make_service_with_connect_info` で起動する必要がある |
| `MatchedPath` | マッチしたルートのパターン (`/users/{id}` など) | |

<pre><code class="caution">リクエストのボディを消費するエクストラクタ (Json、Form、String、Bytes、Request) は、引数の最後に置く。
ボディは1度しか読めないため、最後以外に置くとコンパイルエラーになる。</code></pre>

### エクストラクタが失敗したとき

エクストラクタが失敗すると、ハンドラは呼ばれずに、自動でエラーレスポンスが返る。

| エクストラクタ | 失敗の原因 | ステータス |
| --- | --- | --- |
| `Json` | `Content-Type` が `application/json` でない | 415 Unsupported Media Type |
| `Json` | JSON の構文エラー | 400 Bad Request |
| `Json` | 構文は正しいが、型や項目が合わない | 422 Unprocessable Entity |
| `Path` | 型に変換できない | 400 Bad Request |
| `Query` | 必須の項目がない、型に変換できない | 400 Bad Request |

失敗を自分で処理したい場合は、`Result<エクストラクタ, Rejection>` で受け取る。

```rust
use axum::{
    extract::rejection::JsonRejection,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::Deserialize;

#[derive(Deserialize)]
struct User {
    name: String,
}

async fn create_user(
    payload: Result<Json<User>, JsonRejection>,
) -> impl IntoResponse {
    match payload {
        Ok(Json(user)) => (StatusCode::CREATED, format!("created {}", user.name)),
        Err(rejection) => (rejection.status(), rejection.body_text()),
    }
}
```

### debug_handler

ハンドラの型が合わないときのコンパイルエラーは、分かりにくい。`debug_handler` を付けると、原因を示すメッセージになる。

```toml
[dependencies]
axum = { version = "0.8", features = ["macros"] }
```

```rust
use axum::debug_handler;

#[debug_handler]
async fn handler(Json(body): Json<Payload>, State(state): State<AppState>) -> String {
    // エクストラクタの順序が違う場合などに、原因を教えてくれる
    todo!()
}
```

<pre><code class="tips">主なエラーの原因: ボディを消費する引数が最後でない、戻り値が IntoResponse を実装していない、引数や保持している値が Send でない (std の MutexGuard を .await をまたいで保持するなど)、State の型が with_state と一致しない。</code></pre>

---

## レスポンス <a id="response" data-name="レスポンス"></a>

ハンドラの戻り値は、`IntoResponse` を実装している型であればよい。

| 戻り値の型 | レスポンス |
| --- | --- |
| `&'static str` / `String` | 本文がテキストで、ステータスは 200 |
| `Json<T>` | JSON (`Content-Type: application/json`) |
| `Html<T>` | HTML (`Content-Type: text/html`) |
| `StatusCode` | 本文なしで、ステータスだけ |
| `(StatusCode, T)` | ステータスを指定して、本文 `T` を返す |
| `(StatusCode, [(ヘッダー名, 値)], T)` | ステータスとヘッダーを指定して、本文を返す |
| `Redirect` | リダイレクト |
| `Result<T, E>` | `T` と `E` の両方が `IntoResponse` なら、成功と失敗で別のレスポンスを返せる |
| `impl IntoResponse` | 戻り値の型を明示せずに、`IntoResponse` を実装した何かを返す |

```rust
use axum::{
    http::{header, StatusCode},
    response::{Html, IntoResponse, Redirect},
    Json,
};
use serde::Serialize;

#[derive(Serialize)]
struct User {
    name: String,
}

// ステータスを指定して JSON を返す
async fn created() -> (StatusCode, Json<User>) {
    (StatusCode::CREATED, Json(User { name: "bob".into() }))
}

// HTML を返す
async fn page() -> Html<&'static str> {
    Html("<h1>Hello</h1>")
}

// リダイレクト
async fn moved() -> Redirect {
    Redirect::to("/")
}

// ステータスだけ
async fn no_content() -> StatusCode {
    StatusCode::NO_CONTENT
}

// ヘッダーを付けて返す
async fn download() -> impl IntoResponse {
    (
        [(header::CONTENT_TYPE, "text/plain; charset=utf-8")],
        "ファイルの内容",
    )
}
```

### Redirect の種類

| 関数 | ステータス | 用途 |
| --- | --- | --- |
| `Redirect::to(uri)` | 303 See Other | POST の後に、結果ページへ移動する |
| `Redirect::temporary(uri)` | 307 Temporary Redirect | メソッドを保ったまま、一時的に移動する |
| `Redirect::permanent(uri)` | 308 Permanent Redirect | メソッドを保ったまま、恒久的に移動する |

---

## ルーティング <a id="routing" data-name="ルーティング"></a>

### パスの書き方

| 書き方 | 意味 | 例 |
| --- | --- | --- |
| `/users` | 固定のパス | `/users` |
| `/users/{id}` | パスパラメータ | `/users/123` |
| `/files/{*path}` | 残りのパスをすべて受け取る (ワイルドカード) | `/files/a/b/c.txt` |

```rust
use axum::extract::Path;

// /files/a/b/c.txt なら、path は "a/b/c.txt"
async fn file(Path(path): Path<String>) -> String {
    format!("file: {}", path)
}

let app = Router::new()
    .route("/files/{*path}", get(file));
```

<pre><code class="caution">axum 0.7 から 0.8 で、パスの書き方が変わった。
0.7: /users/:id、/files/*path
0.8: /users/{id}、/files/{*path}
パスに { や } の文字そのものを使いたい場合は、{{ と }} と書く。</code></pre>

### ルーターを分割する (nest / merge)

```rust
use axum::{routing::get, Router};

fn user_routes() -> Router {
    Router::new()
        .route("/", get(list_users))
        .route("/{id}", get(get_user))
}

fn health_routes() -> Router {
    Router::new().route("/health", get(health))
}

let app = Router::new()
    .nest("/users", user_routes())   // /users, /users/{id}
    .merge(health_routes());         // /health
```

| メソッド | 動作 |
| --- | --- |
| `nest("/prefix", router)` | 別のルーターを、パスの接頭辞を付けて取り込む |
| `merge(router)` | 別のルーターのルートを、そのまま取り込む |

### 404 の処理 (fallback)

どのルートにもマッチしなかったリクエストを処理する。

```rust
use axum::http::StatusCode;

async fn not_found() -> (StatusCode, &'static str) {
    (StatusCode::NOT_FOUND, "ページが見つかりません")
}

let app = Router::new()
    .route("/", get(root))
    .fallback(not_found);
```

---

## エラー処理 <a id="error" data-name="エラー処理"></a>

ハンドラが `Result<T, E>` を返し、`E` に `IntoResponse` を実装すると、`?` 演算子でエラーを自然に返せる。

```rust
use axum::{
    extract::Path,
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;

// アプリケーション独自のエラー型
enum AppError {
    NotFound,
    BadRequest(String),
    Internal,
}

// エラー型を、HTTP レスポンスに変換する
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        match self {
            AppError::NotFound => {
                (StatusCode::NOT_FOUND, "見つかりません").into_response()
            }
            AppError::BadRequest(msg) => {
                (StatusCode::BAD_REQUEST, msg).into_response()
            }
            AppError::Internal => {
                (StatusCode::INTERNAL_SERVER_ERROR, "サーバーエラー").into_response()
            }
        }
    }
}

#[derive(Serialize)]
struct User {
    id: u32,
    name: String,
}

async fn get_user(Path(id): Path<u32>) -> Result<Json<User>, AppError> {
    if id == 0 {
        return Err(AppError::BadRequest("id は 1 以上にしてください".into()));
    }
    if id != 1 {
        return Err(AppError::NotFound);
    }
    Ok(Json(User { id, name: "shin".into() }))
}
```

### From を実装して ? を使う

他のエラー型から `AppError` に変換できるようにすると、`?` が使える。

```rust
impl From<std::num::ParseIntError> for AppError {
    fn from(_: std::num::ParseIntError) -> Self {
        AppError::BadRequest("数値の形式が正しくありません".into())
    }
}

async fn parse(Path(s): Path<String>) -> Result<String, AppError> {
    let n: i32 = s.parse()?; // ParseIntError が、AppError に変換される
    Ok(format!("number: {}", n))
}
```

<pre><code class="caution">内部のエラーメッセージ (DB のエラーなど) を、そのままクライアントに返さない。
詳細は tracing などでサーバー側のログに残して、クライアントには汎用のメッセージを返す。</code></pre>

<pre><code class="tips">エラー型を1つずつ定義するのが面倒な場合は、anyhow::Error を包む struct AppError(anyhow::Error) を作り、IntoResponse と From を実装する方法がよく使われる。
エラー型を細かく定義したい場合は、thiserror が便利。</code></pre>

---

## ミドルウェア <a id="middleware" data-name="ミドルウェア"></a>

ミドルウェアは、リクエストとレスポンスの前後に処理を挟む仕組み。Axum は、Tower の `Layer` と `Service` を使う。

### layer

```rust
let app = Router::new()
    .route("/", get(root))
    .layer(some_layer);   // ここまでに追加したルートに適用される
```

| メソッド | 動作 |
| --- | --- |
| `layer(l)` | ルーターのすべてのルートに適用する (マッチしなかったリクエストにも適用される) |
| `route_layer(l)` | マッチしたルートだけに適用する |

<pre><code class="caution">layer は、呼び出した時点で追加されているルートにだけ適用される。
layer の後で route を追加しても、そのルートにはミドルウェアが適用されない。layer は、ルートを追加した後に呼ぶ。</code></pre>

### tower-http (ログ・CORS)

```toml
[dependencies]
tower-http = { version = "0.6", features = ["trace", "cors"] }
tracing = "0.1"
tracing-subscriber = "0.3"
```

```rust
use axum::{routing::get, Router};
use tower_http::{cors::CorsLayer, trace::TraceLayer};

#[tokio::main]
async fn main() {
    // TraceLayer のログは DEBUG レベルなので、出力するレベルを指定する
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();

    let app = Router::new()
        .route("/", get(root))
        .layer(TraceLayer::new_for_http())   // リクエストのログ
        .layer(CorsLayer::permissive());     // CORS をすべて許可 (開発用)

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Hello, World!"
}
```

<pre><code class="caution">CorsLayer::permissive() は、すべてのオリジンを許可する。
本番では、許可するオリジンやメソッドを、CorsLayer::new() で明示的に指定する。</code></pre>

### 自作のミドルウェア (from_fn)

非同期関数を、ミドルウェアにできる。

```rust
use axum::{
    extract::Request,
    middleware::{self, Next},
    response::Response,
    routing::get,
    Router,
};

async fn log_request(req: Request, next: Next) -> Response {
    println!("{} {}", req.method(), req.uri());

    // 次のミドルウェア、またはハンドラを呼ぶ
    let response = next.run(req).await;

    println!("ステータス: {}", response.status());
    response
}

let app = Router::new()
    .route("/", get(root))
    .layer(middleware::from_fn(log_request));
```

ミドルウェアで、リクエストを途中で拒否することもできる。

```rust
use axum::http::StatusCode;

async fn require_token(req: Request, next: Next) -> Result<Response, StatusCode> {
    let authorized = req
        .headers()
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        == Some("Bearer secret-token");

    if authorized {
        Ok(next.run(req).await)
    } else {
        Err(StatusCode::UNAUTHORIZED)   // ハンドラを呼ばずに 401 を返す
    }
}
```

### 適用の順序

`layer` を複数回つなげた場合、**最後に追加したものが最も外側になる**。リクエストは、最後に追加した layer から順に通る。

```rust
Router::new()
    .route("/", get(root))
    .layer(layer_a)   // 3 番目に通る (ハンドラの直前)
    .layer(layer_b)   // 2 番目に通る
    .layer(layer_c);  // 1 番目に通る (最も外側)
```

上から書いた順に実行したい場合は、`tower::ServiceBuilder` でまとめる。

```rust
use tower::ServiceBuilder;

Router::new()
    .route("/", get(root))
    .layer(
        ServiceBuilder::new()
            .layer(layer_a)   // 1 番目に通る
            .layer(layer_b)   // 2 番目に通る
            .layer(layer_c),  // 3 番目に通る
    );
```

---

## 静的ファイル <a id="static-files" data-name="静的ファイル"></a>

`tower-http` の `ServeDir` で、ディレクトリのファイルを配信できる。

```toml
[dependencies]
tower-http = { version = "0.6", features = ["fs"] }
```

```rust
use axum::{routing::get, Router};
use tower_http::services::ServeDir;

let app = Router::new()
    .route("/api/hello", get(hello))
    // API にマッチしなかったリクエストを、static ディレクトリのファイルとして配信する
    .fallback_service(ServeDir::new("static"));

// 特定のパスの下に配信する場合 (/assets/xxx → assets ディレクトリ)
let app = Router::new()
    .nest_service("/assets", ServeDir::new("assets"));
```

---

## WebSocket <a id="websocket" data-name="WebSocket"></a>

`ws` フィーチャーを有効にする。

```toml
[dependencies]
axum = { version = "0.8", features = ["ws"] }
```

```rust
use axum::{
    extract::ws::{WebSocket, WebSocketUpgrade},
    response::Response,
    routing::get,
    Router,
};

// 受け取ったメッセージを、そのまま返すエコーサーバー
async fn ws_handler(ws: WebSocketUpgrade) -> Response {
    ws.on_upgrade(handle_socket)
}

async fn handle_socket(mut socket: WebSocket) {
    // 接続が閉じられる (None) か、エラーになるまで繰り返す
    while let Some(Ok(msg)) = socket.recv().await {
        if socket.send(msg).await.is_err() {
            return; // 送信に失敗したら、クライアントが切断している
        }
    }
}

let app = Router::new().route("/ws", get(ws_handler));
```

<pre><code class="tips">WebSocket のハンドラは、HTTP の GET リクエストをアップグレードして始まるため、route には get を使う。
Nginx の後ろで動かす場合は、Upgrade ヘッダーを転送する設定が必要になる。</code></pre>

---

## 起動と終了 <a id="serve" data-name="起動と終了"></a>

### グレースフルシャットダウン

終了シグナルを受け取ったら、新しい接続の受付を止めて、処理中のリクエストが終わるのを待ってから終了する。

```rust
#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(root));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c()
        .await
        .expect("Ctrl+C のハンドラを登録できませんでした");
    println!("終了シグナルを受信しました");
}
```

### 接続元のアドレスを取得する

`ConnectInfo` を使うには、`into_make_service_with_connect_info` で起動する。

```rust
use std::net::SocketAddr;
use axum::extract::ConnectInfo;

async fn whoami(ConnectInfo(addr): ConnectInfo<SocketAddr>) -> String {
    format!("あなたのアドレス: {}", addr)
}

let app = Router::new().route("/whoami", get(whoami));

axum::serve(
    listener,
    app.into_make_service_with_connect_info::<SocketAddr>(),
)
.await
.unwrap();
```

<pre><code class="caution">Nginx などのリバースプロキシの後ろでは、ConnectInfo は、プロキシのアドレスになる。
クライアントの IP が必要な場合は、X-Forwarded-For ヘッダーを読むが、このヘッダーは偽装できるので、信頼できるプロキシが付けた値だけを使う。</code></pre>

---

## テスト <a id="test" data-name="テスト"></a>

`Router` は Tower の `Service` なので、サーバーを起動せずに、`oneshot` でリクエストを直接渡せる。

```toml
[dev-dependencies]
tower = { version = "0.5", features = ["util"] }
```

```rust
use axum::{
    body::{to_bytes, Body},
    http::{Request, StatusCode},
    routing::get,
    Router,
};
use tower::ServiceExt; // oneshot を使うために必要

// テストしやすいように、Router を作る処理を関数に分ける
fn app() -> Router {
    Router::new().route("/", get(root))
}

async fn root() -> &'static str {
    "Hello, World!"
}

#[tokio::test]
async fn root_returns_hello() {
    let response = app()
        .oneshot(
            Request::builder()
                .uri("/")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);

    let body = to_bytes(response.into_body(), usize::MAX).await.unwrap();
    assert_eq!(&body[..], b"Hello, World!");
}
```

POST で JSON を送るテストは、`Content-Type` ヘッダーとボディを指定する。

```rust
let response = app()
    .oneshot(
        Request::builder()
            .method("POST")
            .uri("/users")
            .header("content-type", "application/json")
            .body(Body::from(r#"{"name": "bob"}"#))
            .unwrap(),
    )
    .await
    .unwrap();

assert_eq!(response.status(), StatusCode::OK);
```

---

## 構成の例 <a id="structure" data-name="構成の例"></a>

規模が大きくなったら、役割ごとにファイルを分ける。

```text
src/
├── main.rs      # 起動処理 (リスナーの作成と serve)
├── app.rs       # Router の組み立て (app 関数)
├── state.rs     # AppState
├── error.rs     # AppError と IntoResponse の実装
├── models.rs    # リクエスト・レスポンスの型 (Deserialize / Serialize)
└── handlers/
    ├── mod.rs
    ├── users.rs
    └── health.rs
```

```rust
// main.rs
mod app;
mod error;
mod handlers;
mod models;
mod state;

#[tokio::main]
async fn main() {
    let state = state::AppState::new();
    let app = app::build(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

```rust
// app.rs
use axum::{routing::get, Router};
use crate::{handlers, state::AppState};

pub fn build(state: AppState) -> Router {
    Router::new()
        .route("/health", get(handlers::health::check))
        .nest("/users", handlers::users::routes())
        .with_state(state)   // 最後に1回だけ呼ぶ
}
```

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `/users/:id` にマッチしない (0.8) | 0.7 以前の書き方を使っている | `/users/{id}` に書き換える |
| `the trait Handler<_, _> is not implemented` | 引数の順序、戻り値の型、`Send` でない値などの問題 | `#[debug_handler]` を付けて、原因を確認する |
| POST で `415 Unsupported Media Type` | `Content-Type: application/json` のヘッダーがない | クライアントでヘッダーを付ける |
| POST で `422 Unprocessable Entity` | JSON の項目や型が、構造体と合っていない | 構造体のフィールド名と型を確認する。省略できる項目は `Option` にする |
| クエリで `400 Bad Request` | 必須のパラメータが欠けている、型が合わない | 省略できるものは `Option` や `#[serde(default)]` にする |
| `with_state` を呼んでいないエラー | `Router<AppState>` のまま `serve` に渡している | 最終的なルーターで `with_state(state)` を呼ぶ |
| ミドルウェアが効かない | `layer` の後で、ルートを追加している | ルートを追加してから、`layer` を呼ぶ |
| ミドルウェアの実行順が逆 | `layer` は、最後に追加したものが最も外側になる | `tower::ServiceBuilder` で、書いた順にまとめる |
| `future cannot be sent between threads safely` | `.await` をまたいで、`std::sync::MutexGuard` などを保持している | `.await` の前に drop する、`tokio::sync::Mutex` を使う |
| 外部からアクセスできない | `127.0.0.1` で待ち受けている (またはファイアウォールの設定) | `0.0.0.0` で待ち受ける。公開範囲に注意する |

---

## 関連クレート <a id="ecosystem" data-name="関連クレート"></a>

| クレート | 用途 |
| --- | --- |
| `axum-extra` | `CookieJar`、`TypedHeader` など、axum 本体にない機能 |
| `tower` | ミドルウェアの基盤 (`ServiceBuilder`、`ServiceExt`) |
| `tower-http` | ログ、CORS、圧縮、静的ファイル、タイムアウトなど |
| `serde` / `serde_json` | リクエスト・レスポンスの変換 |
| `sqlx` | 非同期の DB クライアント |
| `anyhow` / `thiserror` | エラー処理 |
| `tracing` / `tracing-subscriber` | ログ出力 |
| `utoipa` | OpenAPI のドキュメント生成 |
| `validator` | 入力値の検証 |
| `askama` / `maud` | HTML テンプレート |
