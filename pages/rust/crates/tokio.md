---
title: tokio
layout: default
---

# Tokio <a id="top" data-name="TOP"></a>

TokioはRustの非同期ランタイムであり、ランタイムがあることで async/await による非同期処理が実行できる。

Rust の標準ライブラリには、async/await の構文と `Future` トレイトはあるが、`Future` を実際に動かす実行環境 (ランタイム) は含まれない。<br>
Tokio はそのランタイムに加えて、タイマー、ネットワーク、ファイル I/O、チャネル、ロックなど、非同期処理に必要な部品を提供する。

---

## 導入 <a id="introduction" data-name="導入"></a>

必要な機能をまとめて追加するために full フィーチャーを指定するのが一般的。

```toml
[dependencies]
# fullを指定することで、マクロ、ファイルI/O、ネットワーク、タイマーなどがすべて有効になる
tokio = { version = "1", features = ["full"] }
```

コマンドで追加する場合は次のとおり。

```bash
cargo add tokio --features full
```

### フィーチャー

`full` は便利だが、ライブラリを作る場合などは必要なものだけを指定してコンパイル時間やバイナリサイズを抑える。

| フィーチャー | 有効になる機能 |
| --- | --- |
| `rt` | 現在のスレッドで動くランタイム (`current_thread`)、`tokio::spawn` |
| `rt-multi-thread` | マルチスレッドのランタイム |
| `macros` | `#[tokio::main]`、`#[tokio::test]`、`join!`、`select!` |
| `time` | `sleep`、`timeout`、`interval` |
| `net` | `TcpListener`、`TcpStream`、`UdpSocket`、Unix ドメインソケット |
| `fs` | `tokio::fs` |
| `io-util` | `AsyncReadExt`、`AsyncWriteExt`、`BufReader` など |
| `io-std` | 標準入出力 (`tokio::io::stdin` など) |
| `sync` | `mpsc`、`oneshot`、`Mutex`、`Semaphore` など |
| `signal` | `tokio::signal` |
| `process` | `tokio::process` |
| `test-util` | テスト用の機能 (時間を止める `time::pause` など) |

<pre><code class="tips">full には test-util は含まれない。
時間を進めるテストを書く場合は、dev-dependencies で test-util を追加する。</code></pre>

---

## 基本 <a id="basic" data-name="基本"></a>

Tokio を使う場合、main 関数に <span class="code-like">#[tokio::main]</span> マクロを付与することにより、 main 関数が非同期ランタイム上で実行され async/await が使えるようになる。

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

### Future が動く仕組み

ランタイムは Future の `poll` メソッドを呼んで、処理を少しずつ進める。

| `poll` の結果 | 意味 | ランタイムの動き |
| --- | --- | --- |
| `Poll::Ready(値)` | 処理が完了した | `.await` の結果として値を返す |
| `Poll::Pending` | まだ終わっていない (I/O やタイマーを待っている) | そのタスクを中断して、他のタスクを実行する。準備ができたら、再び `poll` する |

- `.await` は、`Pending` のときにスレッドを止めずに、他のタスクへ実行を譲る場所になる。
- 裏を返すと、**`.await` のない長い処理は、他のタスクに実行を譲れない** (後述の「ブロッキング処理」を参照)。

### async ブロック

関数にしなくても、`async { ... }` と書くと、その場で Future を作れる。

```rust
#[tokio::main]
async fn main() {
    let name = String::from("Tokio");

    // async ブロックも Future。.await するまで実行されない
    let greeting = async {
        format!("こんにちは、{}!", name)
    };

    println!("{}", greeting.await);
}
```

<pre><code class="caution">Future は .await (または spawn など) するまで、何も実行されない。
.await を付け忘れると、処理が実行されないままコンパイルが通ってしまう (unused implementer of Future that must be used という警告が出る)。</code></pre>

---

## ランタイム <a id="runtime" data-name="ランタイム"></a>

### #[tokio::main] が行うこと

`#[tokio::main]` は、ランタイムを作って、その上で async の main を実行するコードに展開される。

```rust
// #[tokio::main] を付けた main は、おおよそ次のように展開される
fn main() {
    tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap()
        .block_on(async {
            // 元の main の中身
        })
}
```

### ランタイムの種類

| 種類 | 指定 | 特徴 |
| --- | --- | --- |
| マルチスレッド (既定) | `#[tokio::main]` | CPU コア数に応じた複数のワーカースレッドで、タスクを並列に実行する (`rt-multi-thread` が必要) |
| シングルスレッド | `#[tokio::main(flavor = "current_thread")]` | 1つのスレッドですべてのタスクを動かす。軽量で、テストや小さなツールに向く |

```rust
// ワーカースレッド数を指定する
#[tokio::main(worker_threads = 2)]
async fn main() {
    println!("2 スレッドのランタイム");
}

// シングルスレッドのランタイム
#[tokio::main(flavor = "current_thread")]
async fn main() {
    println!("1 スレッドのランタイム");
}
```

### Builder でランタイムを作る

`main` を async にしたくない場合や、設定を細かく指定したい場合は、`Builder` を使う。

```rust
use tokio::runtime::Builder;

fn main() {
    let rt = Builder::new_multi_thread()
        .worker_threads(4)
        .thread_name("my-worker")
        .enable_all()   // time や I/O などのドライバーを有効にする
        .build()
        .unwrap();

    // async のコードを、同期のコードから実行する
    rt.block_on(async {
        println!("ランタイム上で実行中");
    });
}
```

<pre><code class="tips">マルチスレッドのランタイムでは、タスクがどのワーカースレッドで実行されるか分からず、await をまたいでスレッドが変わることもある。
そのため、spawn するタスクは Send である必要がある。Send でない値を扱いたい場合は、tokio::task::LocalSet と spawn_local を使う。</code></pre>

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

`join!` は、すべての Future の結果をタプルで返す。

```rust
async fn double(n: u32) -> u32 {
    n * 2
}

#[tokio::main]
async fn main() {
    let (a, b, c) = tokio::join!(double(1), double(2), double(3));
    println!("{a} {b} {c}"); // 2 4 6
}
```

<pre><code class="tips">join! は、渡した Future を同じタスクの中で交互に進める (並行)。複数のスレッドで同時に動かす (並列) わけではない。
スレッドをまたいで並列に実行したい場合は、次の spawn を使う。</code></pre>

### try_join

`Result` を返す Future を同時に実行して、**最初のエラーが出た時点で全体をエラーとして返す**。残りの Future は破棄 (キャンセル) される。

```rust
async fn fetch(id: u32) -> Result<u32, String> {
    if id == 2 {
        Err(format!("id {} は失敗しました", id))
    } else {
        Ok(id * 10)
    }
}

#[tokio::main]
async fn main() {
    match tokio::try_join!(fetch(1), fetch(2), fetch(3)) {
        Ok((a, b, c)) => println!("成功: {a} {b} {c}"),
        Err(e) => println!("エラー: {e}"),
    }
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

<pre><code class="caution"><span class="code-like">tokio::spawn</span> に渡す Future は <span class="code-like">'static</span> かつ <span class="code-like">Send</span> である必要がある。タスクがいつまで実行されるか、どのスレッドで実行されるか分からないため、タスク内で外部の参照 (&amp;str や &amp;T) を使うことは基本的にできず、所有権を持ったデータを渡すか Arc や Mutex を使う</code></pre>

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

### JoinHandle の扱い

`spawn` が返す `JoinHandle` で、タスクの結果を受け取ったり、タスクを止めたりできる。

| 操作 | 動作 |
| --- | --- |
| `handle.await` | タスクの完了を待ち、`Result<T, JoinError>` を返す |
| `handle` を drop する | タスクは **キャンセルされず**、切り離されて動き続ける |
| `handle.abort()` | タスクをキャンセルする (次の `.await` の位置で止まる) |
| タスク内でパニック | 他のタスクには波及せず、`handle.await` が `Err(JoinError)` になる |

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // パニックしたタスクの検出
    let panicked = tokio::spawn(async {
        panic!("失敗しました");
    });
    if let Err(e) = panicked.await {
        println!("パニックしたか: {}", e.is_panic());
    }

    // abort によるキャンセル
    let worker = tokio::spawn(async {
        loop {
            println!("動作中...");
            sleep(Duration::from_millis(300)).await;
        }
    });

    sleep(Duration::from_secs(1)).await;
    worker.abort();

    if let Err(e) = worker.await {
        println!("キャンセルされたか: {}", e.is_cancelled());
    }
}
```

<pre><code class="caution">abort によるキャンセルは、タスクが次に .await で中断する位置で行われる。
.await を含まない長い処理は、途中で止められない。

また、main が終了するとランタイムが破棄され、実行中のタスクは完了を待たずに終了する。
タスクの結果が必要なら、必ず JoinHandle を await する。</code></pre>

### JoinSet

動的な数のタスクをまとめて管理する。**完了した順** に結果を受け取れる。

```rust
use tokio::task::JoinSet;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    let mut set = JoinSet::new();

    for i in 1..=3u64 {
        set.spawn(async move {
            sleep(Duration::from_millis(100 * (4 - i))).await;
            i
        });
    }

    // 完了した順に取り出す (全部取り出すと None になる)
    while let Some(result) = set.join_next().await {
        println!("完了: タスク{}", result.unwrap());
    }
}
```

- `JoinSet` を drop すると、中のタスクはすべて `abort` される。
- Vec に `JoinHandle` を溜めて順に await する方法と違い、先に終わったものから処理できる。

### select

複数の Future のうち、**最初に完了したもの** の処理を実行する。残りの Future は破棄 (キャンセル) される。

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    tokio::select! {
        _ = sleep(Duration::from_secs(1)) => {
            println!("1秒のタイマーが先に完了");
        }
        _ = sleep(Duration::from_secs(2)) => {
            println!("こちらは実行されない");
        }
    }
}
```

| 書き方 | 意味 |
| --- | --- |
| `パターン = Future => 処理` | Future が完了して、パターンにマッチしたら、処理を実行する |
| `else => 処理` | すべてのブランチのパターンがマッチしなかったときの処理 |
| `if 条件` を付ける | 条件が偽のブランチは、最初から無効になる |

<pre><code class="caution">select! で負けたブランチの Future は途中で破棄される。そのため、「途中まで読んだデータが失われる」といった問題が起こりうる (cancel safety)。
mpsc の recv() などは安全だが、read_exact() や write_all() は途中までの処理が失われる可能性がある。
select! のループで使う Future は、cancel safe かどうかをドキュメントで確認する。</code></pre>

---

## タスク間通信 <a id="channel" data-name="タスク間通信"></a>

タスク同士でデータをやり取りするには、チャネルを使う。

| チャネル | 送信側 → 受信側 | 用途 |
| --- | --- | --- |
| `mpsc` | 多 → 1 | 複数のタスクから、1つのタスクへメッセージを送る (キュー) |
| `oneshot` | 1 → 1 (1回だけ) | 処理の結果を1つだけ返す |
| `broadcast` | 多 → 多 (全員が全メッセージを受け取る) | イベントを、複数のタスクに通知する |
| `watch` | 多 → 多 (最新の値だけ) | 設定や状態など、最新の値を共有する |

### mpsc

```rust
use tokio::sync::mpsc;

#[tokio::main]
async fn main() {
    // 容量 32 のチャネル (満杯だと、send が空くまで待つ)
    let (tx, mut rx) = mpsc::channel::<String>(32);

    for id in 0..3 {
        let tx = tx.clone(); // 送信側は clone して、タスクごとに持たせる
        tokio::spawn(async move {
            tx.send(format!("ワーカー{}からのメッセージ", id)).await.unwrap();
        });
    }

    // 手元の送信側を閉じる (これを忘れると、recv が終わらない)
    drop(tx);

    // すべての Sender が drop されると、recv は None を返してループが終わる
    while let Some(msg) = rx.recv().await {
        println!("{}", msg);
    }
}
```

<pre><code class="tips">channel(n) は容量付きなので、受信側が遅いと送信側が待たされる (バックプレッシャー)。
unbounded_channel() は容量に上限がなく、受信が追いつかないとメモリが増え続けるので、必要な場合だけ使う。</code></pre>

### oneshot

「処理を依頼して、結果を1つ受け取る」場合に使う。

```rust
use tokio::sync::oneshot;

#[tokio::main]
async fn main() {
    let (tx, rx) = oneshot::channel();

    tokio::spawn(async move {
        // 重い処理の結果を返す
        tx.send(42).unwrap();
    });

    // 結果が届くまで待つ
    let answer = rx.await.unwrap();
    println!("結果: {}", answer);
}
```

`mpsc` でリクエストを送り、リクエストに `oneshot::Sender` を含めて、結果を返してもらう、というパターンもよく使われる。

---

## 共有状態と同期 <a id="sync" data-name="共有状態と同期"></a>

### Mutex は std と tokio のどちらを使うか

| | `std::sync::Mutex` | `tokio::sync::Mutex` |
| --- | --- | --- |
| ロックの取得 | `lock().unwrap()` (同期) | `lock().await` |
| ガードを `.await` をまたいで保持 | できない (`Send` でなくなり、`spawn` でコンパイルエラーになる) | できる |
| 向いている場面 | ロック中に短い同期処理しか行わない場合 | ロック中に `.await` が必要な場合 |
| コスト | 軽い | やや重い |

```rust
use std::sync::{Arc, Mutex};
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    let data = Arc::new(Mutex::new(0));
    let data_clone = Arc::clone(&data);

    tokio::spawn(async move {
        {
            let mut guard = data_clone.lock().unwrap();
            *guard += 1;
        } // await の前にガードを drop する

        sleep(Duration::from_millis(100)).await;
    })
    .await
    .unwrap();

    println!("値: {}", *data.lock().unwrap());
}
```

<pre><code class="tips">Tokio のドキュメントでも、ロックを持つ時間が短く、その間に .await しないなら、std::sync::Mutex を使うことが推奨されている。
tokio::sync::Mutex は、ロックを保持したまま .await する必要があるとき (例: ロック中にネットワークアクセスする) に使う。</code></pre>

### 同期プリミティブ

| 型 | 用途 |
| --- | --- |
| `Mutex` | 排他制御 (一度に1つのタスクだけがアクセス) |
| `RwLock` | 読み取りは同時に複数、書き込みは1つだけ |
| `Semaphore` | 同時に実行できる数の制限 |
| `Notify` | 待機しているタスクに、「準備ができた」と通知する |
| `Barrier` | 指定した数のタスクが揃うまで待つ |
| `OnceCell` | 非同期の初期化を、一度だけ行う |

### Semaphore で同時実行数を制限する

```rust
use std::sync::Arc;
use tokio::sync::Semaphore;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // 同時に実行できるのは 2 タスクまで
    let semaphore = Arc::new(Semaphore::new(2));
    let mut handles = vec![];

    for i in 0..5 {
        let semaphore = Arc::clone(&semaphore);
        handles.push(tokio::spawn(async move {
            // 許可を取得する (空きがなければ待つ。スコープを抜けると自動で返却される)
            let _permit = semaphore.acquire().await.unwrap();

            println!("タスク{} 開始", i);
            sleep(Duration::from_millis(500)).await;
            println!("タスク{} 終了", i);
        }));
    }

    for handle in handles {
        handle.await.unwrap();
    }
}
```

外部 API へのアクセス数や、同時に開くファイル数の制限などに使える。

---

## stdを使わないパターン <a id="dont-use-std" data-name="stdを使わないパターン"></a>

Tokio を使う際、標準ライブラリ (std) を使うとブロッキングしてしまう場合があるという重要なルールがある。

ブロッキングとは、`.await` で他のタスクに実行を譲らずに、そのスレッドを止めてしまうこと。<br>
ワーカースレッドが止まると、そのスレッドで動くはずだった他のタスクも進まなくなる。

```rust
// NG: スレッドを止めるので、同じスレッドの他のタスクも止まる
async fn bad() {
    std::thread::sleep(std::time::Duration::from_secs(1));
}

// OK: 待っている間、他のタスクを実行できる
async fn good() {
    tokio::time::sleep(std::time::Duration::from_secs(1)).await;
}
```

<pre><code class="caution">下の表の std 側は、すべてが「使用禁止」ではない。
ブロッキングするのは、待ち時間の長い操作 (sleep、I/O、ロックの競合など) で、Instant::now() のように一瞬で終わるものは問題ない。
備考の列で、ブロッキングが問題になるものを確認する。</code></pre>

### 時間・タイマー関連

| 目的 | std | tokio (推奨) | 備考 |
| --- | --- | --- | --- |
| 一定時間待つ | std::thread::sleep(duration) | tokio::time::sleep(duration).await | std 版はスレッドを止めるので避ける |
| 現在時刻の取得 | std::time::Instant::now() | tokio::time::Instant::now() | std 版でも問題ない。tokio 版は、テストで時間を進める機能と連動する |
| 一定間隔のループ | ループと sleep の組み合わせ | tokio::time::interval(duration) | sleep だと、処理時間の分だけ間隔がずれる |
| タイムアウト処理 | なし (自作が必要) | tokio::time::timeout(duration, future).await | |

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

| 目的 | std | tokio (推奨) | 備考 |
| --- | --- | --- | --- |
| ファイルの読み書き | std::fs::File | tokio::fs::File | tokio 版は、内部でブロッキング用のスレッドプールを使って実行している |
| TCP通信 (サーバー) | std::net::TcpListener | tokio::net::TcpListener | std 版の accept はスレッドを止める |
| TCP通信 (クライアント) | std::net::TcpStream | tokio::net::TcpStream | |
| トレイト (共通処理) | std::io::{Read, Write} | tokio::io::{AsyncRead, AsyncWrite} | `read` / `write_all` などは Ext トレイトを import して使う |

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

| 目的 | std | tokio | 備考 |
| --- | --- | --- | --- |
| 相互排除 (ロック) | std::sync::Mutex | tokio::sync::Mutex | ロックを短く持つだけなら std 版でもよい (「共有状態と同期」を参照) |
| 読み書きロック | std::sync::RwLock | tokio::sync::RwLock | 同上 |
| スレッド/タスク間通信 | std::sync::mpsc | tokio::sync::mpsc | std 版の `recv` は、待っている間スレッドを止める |
| 一度だけの初期化 | std::sync::Once / OnceLock | tokio::sync::OnceCell | 初期化処理が async のときは tokio 版 |

### スレッド・タスクの生成

| 目的 | std | tokio (推奨) | 備考 |
| --- | --- | --- | --- |
| 並行タスクの開始 | std::thread::spawn | tokio::spawn | tokio のタスクは軽量で、大量に作れる |
| 重い計算・同期I/Oの実行 | なし | tokio::task::spawn_blocking | 次の「ブロッキング処理」を参照 |

---

## ブロッキング処理 <a id="blocking" data-name="ブロッキング処理"></a>

CPU を長く使う計算や、非同期に対応していない同期ライブラリの呼び出しは、そのまま async の中で実行するとワーカースレッドを占有してしまう。<br>
目安として、`.await` と `.await` の間の処理は、数十マイクロ秒から百マイクロ秒程度に収めることが推奨されている。

### spawn_blocking

ブロッキング処理専用のスレッドプールで実行して、結果を `.await` で受け取る。

```rust
#[tokio::main]
async fn main() {
    // 重い計算を、ブロッキング用のスレッドで実行する
    let handle = tokio::task::spawn_blocking(|| {
        (1..=100_000_000u64).sum::<u64>()
    });

    println!("計算を待っている間も、他のタスクは動ける");

    let total = handle.await.unwrap();
    println!("合計: {}", total);
}
```

### 使い分け

| 方法 | 動作 | 使う場面 |
| --- | --- | --- |
| `spawn_blocking` | ブロッキング用のスレッドプールで実行し、`JoinHandle` を返す | 同期 API の呼び出し、短めの重い計算 |
| `block_in_place` | 現在のワーカースレッドをブロッキングに使い、他のタスクは別のワーカーに移される。マルチスレッドのランタイムでのみ使える (`current_thread` ではパニックする) | `'static` でない参照を使ったまま、ブロッキング処理をしたいとき |
| `std::thread::spawn` | 独立した OS スレッド | 長時間動き続ける処理 |
| `rayon` など | CPU 並列用のスレッドプール | 大量の計算を、並列で処理したいとき (結果は `oneshot` で受け取る) |

<pre><code class="tips">spawn_blocking に渡した処理は、abort してもキャンセルできない (すでに実行中のスレッドを止められない)。
無限に動き続ける処理を spawn_blocking に入れると、ランタイムの終了も遅れるので注意する。</code></pre>

---

## 時間 <a id="time" data-name="時間"></a>

### interval

一定間隔で処理を繰り返す。

```rust
use tokio::time::{interval, Duration};

#[tokio::main]
async fn main() {
    let mut ticker = interval(Duration::from_secs(1));

    for _ in 0..3 {
        // 最初の tick は、すぐに完了する
        ticker.tick().await;
        println!("tick");
    }
}
```

処理が間隔より長くかかって、tick に遅れた場合の動作は、`MissedTickBehavior` で選べる。

| 設定 | 動作 |
| --- | --- |
| `Burst` (既定) | 遅れた分の tick を、続けて連続で消化する |
| `Delay` | 遅れた時点から、改めて間隔を数え直す |
| `Skip` | 遅れた分の tick を飛ばして、元のタイミングに合わせる |

```rust
use tokio::time::MissedTickBehavior;

let mut ticker = interval(Duration::from_secs(1));
ticker.set_missed_tick_behavior(MissedTickBehavior::Skip);
```

### timeout と select の使い分け

| 目的 | 使うもの |
| --- | --- |
| 1つの処理に、時間制限をかける | `tokio::time::timeout` |
| 複数の処理のうち、最初に終わったものを使う | `tokio::select!` |

---

## ネットワーク <a id="network" data-name="ネットワーク"></a>

### TCP のエコーサーバー

接続ごとにタスクを `spawn` して、複数のクライアントを同時に処理するのが基本パターン。

```rust
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:8080").await?;
    println!("待ち受け中: 127.0.0.1:8080");

    loop {
        // 新しい接続を待つ
        let (mut socket, addr) = listener.accept().await?;
        println!("接続: {}", addr);

        // 1接続につき1タスク
        tokio::spawn(async move {
            let mut buf = [0u8; 1024];

            loop {
                match socket.read(&mut buf).await {
                    Ok(0) => return, // 接続が閉じられた
                    Ok(n) => {
                        // 受け取ったデータをそのまま返す
                        if socket.write_all(&buf[..n]).await.is_err() {
                            return;
                        }
                    }
                    Err(_) => return,
                }
            }
        });
    }
}
```

<pre><code class="tips">読み取ったデータをそのまま書き戻すだけなら、tokio::io::copy(&amp;mut reader, &amp;mut writer) で書ける。
socket.split() で、読み取り側と書き込み側に分けると、1つのソケットを同時に読み書きできる。</code></pre>

### TCP のクライアント

```rust
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpStream;

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut stream = TcpStream::connect("127.0.0.1:8080").await?;

    stream.write_all(b"hello").await?;

    let mut buf = [0u8; 1024];
    let n = stream.read(&mut buf).await?;
    println!("受信: {}", String::from_utf8_lossy(&buf[..n]));

    Ok(())
}
```

`read` は、要求したバイト数より少ない量を返すことがあるため、一定のバイト数を確実に読みたい場合は `read_exact` を使う。

---

## ファイルとI/O <a id="io" data-name="ファイルとI/O"></a>

### 簡単な読み書き

ファイル全体を一度に読み書きするだけなら、関数が用意されている。

```rust
#[tokio::main]
async fn main() -> std::io::Result<()> {
    // 書き込み
    tokio::fs::write("out.txt", "こんにちは\nTokio\n").await?;

    // 読み込み
    let text = tokio::fs::read_to_string("out.txt").await?;
    println!("{}", text);

    Ok(())
}
```

### 1行ずつ読む

```rust
use tokio::fs::File;
use tokio::io::{AsyncBufReadExt, BufReader};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let file = File::open("out.txt").await?;
    let mut lines = BufReader::new(file).lines();

    // 行がなくなると None になる
    while let Some(line) = lines.next_line().await? {
        println!("{}", line);
    }

    Ok(())
}
```

### バッファ付きの書き込み

```rust
use tokio::fs::File;
use tokio::io::{AsyncWriteExt, BufWriter};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let file = File::create("log.txt").await?;
    let mut writer = BufWriter::new(file);

    for i in 0..3 {
        writer.write_all(format!("行{}\n", i).as_bytes()).await?;
    }

    // バッファに残ったデータを書き出す
    writer.flush().await?;

    Ok(())
}
```

<pre><code class="caution">tokio の BufWriter は、drop されたときに自動で flush されない (async の処理は drop の中で実行できないため)。
書き込みの最後に、必ず flush().await を呼ぶ。</code></pre>

### 標準入出力

```rust
use tokio::io::{self, AsyncBufReadExt, BufReader};

#[tokio::main]
async fn main() -> io::Result<()> {
    let stdin = BufReader::new(io::stdin());
    let mut lines = stdin.lines();

    while let Some(line) = lines.next_line().await? {
        println!("入力: {}", line);
    }

    Ok(())
}
```

---

## シグナルとシャットダウン <a id="shutdown" data-name="シグナルとシャットダウン"></a>

### Ctrl+C を受け取る

`select!` と組み合わせると、処理を続けながら、終了シグナルを待てる。

```rust
use tokio::time::{interval, Duration};

#[tokio::main]
async fn main() {
    let mut ticker = interval(Duration::from_secs(1));

    loop {
        tokio::select! {
            _ = ticker.tick() => {
                println!("処理中...");
            }
            _ = tokio::signal::ctrl_c() => {
                println!("終了シグナルを受信しました。後片付けをして終了します");
                break;
            }
        }
    }
}
```

### SIGTERM を受け取る (Unix のみ)

コンテナやサービスとして動かす場合は、`SIGTERM` で停止されることが多い。

```rust
use tokio::signal::unix::{signal, SignalKind};

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mut sigterm = signal(SignalKind::terminate())?;

    println!("SIGTERM を待っています");
    sigterm.recv().await;
    println!("SIGTERM を受信しました");

    Ok(())
}
```

### 複数のタスクをまとめて止める

タスクが複数ある場合は、`tokio-util` の `CancellationToken` で、停止を通知する。

```toml
[dependencies]
tokio-util = "0.7"
```

```rust
use tokio::time::{sleep, Duration};
use tokio_util::sync::CancellationToken;

#[tokio::main]
async fn main() {
    let token = CancellationToken::new();
    let mut handles = vec![];

    for id in 0..3 {
        let token = token.clone();
        handles.push(tokio::spawn(async move {
            tokio::select! {
                _ = token.cancelled() => {
                    println!("ワーカー{}: 停止要求を受け取りました", id);
                }
                _ = sleep(Duration::from_secs(60)) => {
                    println!("ワーカー{}: 処理が完了しました", id);
                }
            }
        }));
    }

    sleep(Duration::from_millis(500)).await;
    token.cancel(); // すべてのワーカーに停止を通知する

    for handle in handles {
        handle.await.unwrap();
    }
}
```

<pre><code class="tips">グレースフルシャットダウンの基本の流れ: 終了シグナルを受け取る → 新しい処理の受付を止める → 実行中のタスクの完了を JoinHandle や JoinSet で待つ。
待つ時間に上限を設けたい場合は、timeout と組み合わせる。</code></pre>

---

## テスト <a id="test" data-name="テスト"></a>

### #[tokio::test]

async の関数をテストするには、`#[tokio::test]` を使う。

```rust
async fn add_later(a: u32, b: u32) -> u32 {
    tokio::time::sleep(std::time::Duration::from_millis(10)).await;
    a + b
}

#[tokio::test]
async fn test_add_later() {
    assert_eq!(add_later(1, 2).await, 3);
}
```

| 指定 | ランタイム |
| --- | --- |
| `#[tokio::test]` | `current_thread` (既定) |
| `#[tokio::test(flavor = "multi_thread", worker_threads = 2)]` | マルチスレッド |

### 時間を止めるテスト

`test-util` フィーチャーを有効にすると、実際には待たずに、時間を進めるテストが書ける。

```toml
[dev-dependencies]
tokio = { version = "1", features = ["full", "test-util"] }
```

```rust
use tokio::time::{sleep, timeout, Duration};

// start_paused = true で、時間を止めた状態でテストを始める
// (実行するタスクがなくなると、時計が自動で進む)
#[tokio::test(start_paused = true)]
async fn timeout_fires() {
    let result = timeout(Duration::from_secs(5), sleep(Duration::from_secs(10))).await;
    assert!(result.is_err()); // 実際の待ち時間はほぼ 0
}
```

<pre><code class="tips">時間を止めるテストでは、std::time::Instant ではなく tokio::time::Instant を使わないと、時計の動きが連動しない。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| 処理が実行されない | Future に `.await` を付け忘れている | `.await` を付ける (`unused implementer of Future` の警告に注意) |
| 他のタスクが止まる・遅くなる | async の中で、ブロッキング処理 (`std::thread::sleep` や重い計算) をしている | tokio 版の API か、`spawn_blocking` を使う |
| `future cannot be sent between threads safely` | `.await` をまたいで、`Send` でない値 (`std::sync::MutexGuard`、`Rc` など) を保持している | `.await` の前に drop する、`tokio::sync::Mutex` を使う、`Arc` を使う |
| `borrowed value does not live long enough` (`'static` が必要) | `spawn` するタスクに、ローカル変数の参照を渡している | `move` で所有権を渡す、`clone` する、`Arc` で共有する |
| `there is no reactor running` / `must be called from the context of a Tokio runtime` | ランタイムの外で、Tokio の API を呼んでいる | `#[tokio::main]` か `Runtime::block_on` の中で呼ぶ |
| タスクの出力が途中で出ない | `main` が先に終わって、ランタイムごとタスクが破棄された | `JoinHandle` を `await` する、`JoinSet` を使う |
| `recv()` が終わらない | `Sender` が1つでも drop されずに残っている | 手元の `tx` を `drop` する |
| `select!` で処理が途中で消える | 負けたブランチの Future が破棄される (cancel safety) | cancel safe な API を使う、状態をループの外に持つ |
| メモリが増え続ける | `unbounded_channel` で、受信が追いついていない | 容量付きの `channel(n)` に変える |
| `recursion in an async fn requires boxing` | `async fn` が自分自身を再帰で呼んでいる | `Box::pin(再帰呼び出し)` で包む |

---

## 関連クレート <a id="ecosystem" data-name="関連クレート"></a>

| クレート | 用途 |
| --- | --- |
| `tokio-util` | `CancellationToken`、コーデック (`Framed`) など、Tokio の補助機能 |
| `tokio-stream` | `Stream` (非同期のイテレータ) の拡張。`StreamExt` など |
| `futures` | `Future` / `Stream` の共通のユーティリティ (`join_all` など) |
| `tracing` | 非同期処理に対応した、構造化ログ |
| `hyper` | HTTP の実装 (サーバー・クライアント) |
| `axum` | Tokio ベースの Web フレームワーク |
| `reqwest` | HTTP クライアント |
| `tonic` | gRPC |
| `sqlx` | 非同期の DB クライアント |
