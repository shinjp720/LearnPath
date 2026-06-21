---
title: tokio
layout: default
---

# Tokio <a id="top" data-name="TOP"></a>

TokioはRustの非同期ランタイムであり、ランタイムがあることで async/await による非同期処理が実行できる。

## 導入 <a id="introduction" data-name="導入"></a>

必要な機能をまとめて追加するために full フィーチャーを指定するのが一般的。

```rust
[dependencies]
# fullを指定することで、マクロ、ファイルI/O、ネットワーク、タイマーなどがすべて有効になる
tokio = { version = "1", features = ["full"] }
```

---

## 基本 <a id="basic" data-name="基本"></a>

Tokio を使う場合、main 関数に <span class="code-like">#[tokio::main]</span> マクロを付与することにより、 main関数非同期ランタイム上で実行され async/await が使えるようになる。

```rust
#[tokio::main]
async fn main() {
    println!("タスクを開始します");

    // async関数の呼び出し (この時点ではまだ実行されず、Futureが返るだけ)
    let future_message = get_message();

    // .await をつけることで、その処理が終わるまで待機 (中断)する
    let message = future_message.await;

    println!("受け取ったメッセージ: {}", message);
}

// asyncをつけることで、非同期関数 (Futureを返す関数)になる
async fn get_message() -> String {
    // Tokioの提供する非同期スリープ (スレッドをブロックしない)
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    String::from("こんにちは、Tokio!")
}
```

### Future

Future は未来の約束で、今は終わっていないけどいずれ値 (またはエラー) を返すトレイトで、 関数に async を付けることにより自動的に Future を返す状態マシンに変換される。

Rust の非同期関数は呼び出された時点では実行されず Future を返すので、その Future に対して <span class="code-like">.await</span> を付けることによって、その位置で待って裏で処理を実行する。

---

## 実行 <a id="execute" data-name="実行"></a>

### join

複数の Future を同時に実行して、すべてが完了するのを待つ。

```rust
use tokio::time::{sleep, Duration};

async fn do_task_a() {
    sleep(Duration::from_secs(2)).await;
    println!("タスクA 完了");
}

async fn do_task_b() {
    sleep(Duration::from_secs(1)).await;
    println!("タスクB 完了");
}

#[tokio::main]
async fn main() {
    // join! 全体としては合計2秒で終わる (直列だと3秒かかる)
    tokio::join!(do_task_a(), do_task_b());
    println!("すべてのタスクが完了しました");
}
```

### spawn

タスクを完全に切り離してバックグラウンドで実行する。

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // バックグラウンドでタスクを開始 (戻り値は JoinHandle)
    let handle = tokio::spawn(async {
        for i in 1..=3 {
            println!("バックグラウンドタスク: {}", i);
            sleep(Duration::from_millis(500)).await;
        }
        "タスク完了！"
    });

    println!("メイン関数は別の作業をしています...");
    sleep(Duration::from_secs(1)).await;

    // バックグラウンドタスクの結果を回収する
    match handle.await {
        Ok(result) => println!("結果: {}", result),
        Err(e) => eprintln!("タスクでエラーが発生: {:?}", e),
    }
}
```

<pre><code class="caution"><span class="code-like">tokio::spawn</span> されたタスクはいつまで実行されるか分からないため、タスク内で外部の参照 (&str や &T) を使うことは基本的にできず、所有権を持ったデータを渡すか Arc や Mutex を使う</code></pre>

```rust
use std::sync::Arc;
use tokio::sync::Mutex; // Tokio版のMutexを使用

#[tokio::main]
async fn main() {
    // 1. 共有したいデータを Mutex と Arc で包む
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for i in 0..3 {
        // 2. タスクごとに Arc をクローンする (中身のデータはコピーされず、参照カウントだけが増える)
        let counter_clone = Arc::clone(&counter);

        // 3. クローンした Arc を move で spawn の中に渡す
        let handle = tokio::spawn(async move {
            // 4. Mutex をロックしてデータを書き換える (.await が必要)
            let mut lock = counter_clone.lock().await;
            *lock += i;
            println!("タスク{}が実行されました。現在の値: {}", i, *lock);
        });

        handles.push(handle);
    }

    // すべてのバックグラウンドタスクの完了を待つ
    for handle in handles {
        handle.await.unwrap();
    }

    // メイン関数でも中身を確認できる
    println!("最終的な値: {}", *counter.lock().await);
}
```

## stdを使わないパターン <a id="dont-use-std" data-name="stdを使わないパターン"></a>

Tokio を使う際、標準ライブラリ (std) を使うとブロッキングしてしまう場合があるという重要なルールがある。

### 時間・タイマー関連

| 目的 | std (使用禁止) | tokio (推奨) |
| --- | --- | --- |
| 一定時間待つ | std::thread::sleep(duration) | tokio::time::sleep(duration).await |
| 現在時刻の取得 | std::time::Instant::now() | tokio::time::Instant::now() |
| 一定間隔のループ | ループと sleep の組み合わせ | tokio::time::interval(duration) |
| タイムアウト処理 | なし (自作が必要) | tokio::time::timeout(duration, future).await |

<pre><code class="example">// タイムアウト処理
use std::time::Duration;

async fn long_task() {
    tokio::time::sleep(Duration::from_secs(5)).await;
}

#[tokio::main]
async fn main() {
    // 5秒かかるタスクを3秒でタイムアウトさせる
    match tokio::time::timeout(Duration::from_secs(3), long_task()).await {
        Ok(_) => println!("タスク完了"),
        Err(_) => println!("時間切れになりました！"),
    }
}</code></pre>

### ファイル・ネットワークI/O

| 目的 | std (使用禁止) | tokio (推奨) |
| --- | --- | --- |
| ファイルの読み書き | std::fs::File | tokio::fs::File |
| TCP通信 (サーバー) | std::net::TcpListener | tokio::net::TcpListener |
| TCP通信 (クライアント) | std::net::TcpStream | tokio::net::TcpStream |
| トレイト (共通処理) | std::io::{Read, Write} | tokio::io::{AsyncRead, AsyncWrite} |

<pre><code class="example">// ファイル読み込み
use tokio::fs::File;
use tokio::io::AsyncReadExt; // .read_to_string() を使うために必要

#[tokio::main]
async fn main() -> tokio::io::Result<()> {
    let mut file = File::open("foo.txt").await?;
    let mut contents = String::new();
    
    // 読み込みを待っている間、スレッドは他のタスクを処理できる
    file.read_to_string(&mut contents).await?;
    println!("{}", contents);
    Ok(())
}</code></pre>

### 同期機構・排他制御

| 目的 | std (使用禁止) | tokio (推奨) |
| --- | --- | --- |
| 相互排除 (ロック) | std::sync::Mutex | tokio::sync::Mutex |
| 読み書きロック | std::sync::RwLock | tokio::sync::RwLock |
| スレッド/タスク間通信 | std::sync::mpsc | tokio::sync::mpsc |
| 一度だけの初期化 | std::sync::Once | tokio::sync::Once |

### スレッド・タスクの生成

| 目的 | std (使用禁止) | tokio (推奨) |
| --- | --- | --- |
| 並行タスクの開始 | std::thread::spawn | tokio::spawn |
| 重い計算・同期I/Oの実行 | なし | tokio::task::spawn_blocking |
