---
title: Axum
layout: default
---

# Axum <a id="top" data-name="TOP"></a>

Axum は非同期ランタイムの Tokio と、HTTPライブラリの Hyper を利用しており、Rust らしい型安全な Webアプリケーションを作れる。

## 最小構成

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

Axum は非同期処理を前提としているため、ほとんどのハンドラは async になる。

## 基本

### HTTP メソッド

```rust
use axum::routing::{get, post};

Router::new()
    .route("/", get(index))
    .route("/users", post(create_user));
```

- GET
- POST
- PUT
- DELETE
- PATCH

などがある。

### パスパラメータ

URL の一部を取得。

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

```
/users/123
```

### クエリパラメータ

URL にクエリを埋め込む。

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

```
/hello?name=bob
```

```
/users?page=2&sort=name&active=true
```

### JSON 受信

POST で JSON を受け取る例。

```rust
use axum::Json;
use serde::{Deserialize, Serialize};

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

送信

```json
{
    "name": "bob"
}
```

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

### 状態共有

アプリ全体で共有するデータ。例えばDB接続プールなど。

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

