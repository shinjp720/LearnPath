---
title: webrtc
layout: default
---

# WebRTC <a id="top" data-name="TOP"></a>

WebRTC は、ブラウザやアプリケーションの間で、音声、映像、任意のデータを、**リアルタイムに、直接やり取りする**ための、技術の集まりである。Rust では、**webrtc-rs** プロジェクトの、`webrtc` crate が、純粋な Rust による、WebRTC の実装を、提供している。

`webrtc` crate は、**Sans-I/O** (入出力を持たない) のプロトコルコアである `rtc` crate の上に作られた、薄い、非同期の層である。特定の非同期ランタイムには、縛られない。Tokio と smol が、標準で、用意されており、自作のランタイムも、差し込める。

| 構成要素 | 内容 |
| --- | --- |
| `webrtc` | 非同期の API。`PeerConnection` と、背景で動く、ドライバーを持つ |
| `rtc` | Sans-I/O のプロトコルコア。ICE、DTLS、SCTP、SRTP などを、入出力なしで実装する |
| `Runtime` | タイマー、タスクの生成、ソケットを、抽象化する trait |

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 純粋な Rust | C や C++ の WebRTC ライブラリに、依存しない |
| Sans-I/O の設計 | プロトコルの状態機械が、入出力から分離され、決定的にテストできる |
| ランタイムに依存しない | `Runtime` trait を実装すれば、任意の非同期ランタイムで動く |
| 1つのイベントハンドラ | `PeerConnectionEventHandler` に、すべてのイベントが、集まる |
| データチャネル | 順序保証あり、なし、再送回数の上限ありなど、信頼性を選べる |
| メディア | 音声と映像の、送受信、シミュルキャスト、RTX、FlexFEC に対応する |
| 輻輳制御 | GCC による帯域の推定とペーシングが、オプションで使える |

### 他の選択肢との比較

| | `webrtc` (webrtc-rs) | ブラウザの WebRTC |
| --- | --- | --- |
| 実行環境 | ネイティブ (サーバー、デスクトップ、組み込みに近い環境) | ブラウザ |
| 言語 | Rust | JavaScript |
| 用途 | サーバー側の接続端 (SFU、ボット、ゲートウェイ)、ネイティブのクライアント | Web アプリのクライアント |
| API | 非同期の `PeerConnection` と、ハンドラ trait | `RTCPeerConnection` と、イベントのコールバック |

ブラウザの中の Wasm から、WebRTC を使う場合は、`web-sys` の `RtcPeerConnection` を使う。`webrtc` crate は、ネイティブ向けである。

### バージョンの系統

| 系統 | 状態 |
| --- | --- |
| 0.17.x | Tokio に結びついた、旧来の実装。**バグ修正のみ**の保守になっている (最新は 0.17.3、2026年11月) |
| 0.20.x | Sans-I/O と、ランタイム非依存の、新しい構成の、最初の安定版 (0.20.0 は、2026年7月) |
| 0.21.x | 1.0 のリリース候補。1.0 で、固定する予定の API (0.21.0 は 2026年9月、0.21.1 は 2026年10月) |
| 1.0 | 2026年11月時点で、crates.io には、まだ公開されていない |

0.21.x から 1.0 へは、公開 API を、安定させる方針である。新しいプロジェクトは、**0.21 系で、始める**。

<pre><code class="caution">webrtc は、バージョンごとに、API が大きく変わる。0.17 以前の記事のコード (on_ で始まるコールバックの登録、Arc の複製など) は、そのままでは動かない。
このドキュメントは、webrtc 0.21 (2026年11月時点の、最新は 0.21.1) を前提にしている。0.20 との違いは、「古いコードからの変更」の章にまとめている。</code></pre>

### 向いている場面

| 向いている | 向いていない |
| --- | --- |
| サーバー側で、ブラウザと、データチャネルや、メディアをやり取りする | ブラウザの中だけで、完結する場合 (ブラウザの標準 API を使う) |
| SFU、録画、ボット、ゲートウェイを、Rust で作る | 組み込み機器の、`no_std` 環境 (対象外とされている) |
| 非同期ランタイムを、自分で選びたい | C の API (FFI) が、必要な場合 (対象外とされている) |
| プロトコルを、決定的にテストしたい | |

---

## 導入 <a id="introduction" data-name="導入"></a>

### 追加

```bash
cargo add webrtc
```

```toml
[dependencies]
webrtc = "0.21"   # cargo add が、最新のバージョンを入れる
```

非同期ランタイムは、フィーチャーで、選ぶ。Tokio が、既定である。

```toml
[dependencies]
# smol を使う場合は、既定のフィーチャーを、無効にする
webrtc = { version = "0.21", default-features = false, features = ["runtime-smol"] }
```

### フィーチャー

| フィーチャー | 既定 | 内容 |
| --- | --- | --- |
| `runtime-tokio` | 有効 | Tokio による、タイマー、タスク、ソケット |
| `runtime-smol` | 無効 | smol による、同じ機能 |
| `runtime-mock` | 無効 | テスト用の、仮想時計を持つ `MockRuntime` (入出力なし) |
| `crypto-ring` | (既定の提供者) | `ring` による、暗号の提供者 |
| `crypto-aws-lc-rs` | 無効 | `aws-lc-rs` による、暗号の提供者 |

ランタイムのフィーチャーは、**加算的**である。複数を有効にしても、安全であり、1つのプロセスで、接続ごとに、別のランタイムを使える。暗号のフィーチャーも、0.21 から、加算的になった。両方が有効なときは、`ring` が、既定になる。

<pre><code class="tips">フィーチャーの名前は、バージョンで変わることがある。docs.rs の、Feature flags で、使っているバージョンのものを、確認する。
runtime-tokio と runtime-smol の両方を、無効にして、自作の Runtime を渡すことも、できる (ランタイムの章を参照)。</code></pre>

### 周辺の依存

`webrtc` は、`bytes` に依存しており、データの送信に、`BytesMut` を使う。`bytes` の使い方は、「bytes」のドキュメントを参照。

| 依存 | 役割 |
| --- | --- |
| `rtc` | Sans-I/O のプロトコルコア |
| `bytes` | データの送信の、バッファ |
| `async-trait` | イベントハンドラを、`dyn` 互換にするため |
| `quinn-udp` | UDP の、バッチ送受信 (GSO と GRO) |
| `tokio`、`smol` | 内蔵のランタイム (任意の依存) |

---

## WebRTC の基礎 <a id="concepts" data-name="WebRTCの基礎"></a>

コードを書く前に、接続が成立するまでの、流れを整理する。

### 接続の成立までの流れ

```text
ピア A                    シグナリング                    ピア B
  │── オファー (SDP) ────────────▶│── オファー (SDP) ──────────▶│
  │◀──────────── アンサー (SDP) ──│◀────────── アンサー (SDP) ──│
  │◀──────────── ICE 候補 ───────▶│◀───────── ICE 候補 ────────▶│
  │                                                              │
  │◀══════════ DTLS ハンドシェイク (UDP の直接通信) ═══════════▶│
  │◀══════════ SRTP (メディア) / SCTP (データチャネル) ════════▶│
```

### 用語

| 用語 | 内容 |
| --- | --- |
| シグナリング (signaling) | SDP と ICE 候補を、交換する仕組み。**WebRTC の仕様の、範囲外**であり、WebSocket や HTTP などを、自由に使う |
| SDP (Session Description Protocol) | 接続の条件 (コーデック、鍵の指紋、ICE の情報) を、記述した文字列 |
| オファー (offer) とアンサー (answer) | SDP の、提案と、応答 |
| ICE (Interactive Connectivity Establishment) | 通信できる経路を、探す手順 |
| ICE 候補 (candidate) | 通信に使える、アドレスの候補 (host、srflx、relay) |
| STUN | 自分の、外から見えるアドレスを、教えてもらうプロトコル |
| TURN | 直接つながらないときに、通信を中継するサーバー |
| DTLS | UDP の上の、暗号化のハンドシェイク |
| SRTP | 暗号化された、メディアの転送 |
| SCTP | データチャネルを、運ぶプロトコル (DTLS の上で動く) |

### 候補の種類

| 種類 | 内容 |
| --- | --- |
| host | 自分の、ネットワークインターフェースのアドレス |
| srflx (server reflexive) | STUN で知った、NAT の外側のアドレス |
| prflx (peer reflexive) | 接続の確認中に、相手から知らされる、アドレス |
| relay | TURN サーバーが、割り当てた、中継のアドレス |

<pre><code class="tips">シグナリングの方法は、自由に選べる。WebSocket が、最も一般的である。サーバー側を axum で書く場合は、「axum」のドキュメントを参照。
SDP の中身は、通常、読み書きする必要がない。create_offer や create_answer が返す値を、そのまま、相手へ渡す。</code></pre>

---

## 基本 <a id="basic" data-name="基本"></a>

### 最小の例

`PeerConnection` を作り、SDP のオファーを、生成する例。

```rust
use std::sync::Arc;
use webrtc::peer_connection::{
    PeerConnection, PeerConnectionBuilder, PeerConnectionEventHandler,
    RTCConfigurationBuilder, RTCIceServer, RTCPeerConnectionIceEvent,
};
use webrtc::runtime::TokioRuntime;

// イベントを受け取る型。必要なメソッドだけを、実装する
#[derive(Clone)]
struct MyHandler;

#[async_trait::async_trait]
impl PeerConnectionEventHandler for MyHandler {
    async fn on_ice_candidate(&self, event: RTCPeerConnectionIceEvent) {
        println!("ローカルの ICE 候補: {}", event.candidate);
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 接続の設定。STUN サーバーを指定する
    let config = RTCConfigurationBuilder::default()
        .with_ice_servers(vec![RTCIceServer {
            urls: vec!["stun:stun.l.google.com:19302".to_owned()],
            ..Default::default()
        }])
        .build();

    // PeerConnection を作る。背景のドライバーが、ここで、起動する
    let pc = PeerConnectionBuilder::new()
        .with_configuration(config)
        .with_runtime(Arc::new(TokioRuntime))
        .with_handler(Arc::new(MyHandler))
        .with_udp_addrs(vec!["0.0.0.0:0"])
        .build()
        .await?;

    // オファーを作り、ローカルの記述として、設定する
    let offer = pc.create_offer(None).await?;
    pc.set_local_description(offer).await?;

    Ok(())
}
```

`with_runtime` を省略すると、コンパイルされている、既定のランタイムが、使われる。

### 基本の流れ

| 手順 | 内容 |
| --- | --- |
| 1 | イベントハンドラの型を、定義する |
| 2 | `RTCConfigurationBuilder` で、ICE サーバーなどを、設定する |
| 3 | `PeerConnectionBuilder` で、設定、ランタイム、ハンドラ、バインドするアドレスを、渡す |
| 4 | `build().await` で、接続を作る (ドライバーが、起動する) |
| 5 | オファー側は、`create_offer` と `set_local_description` を、呼ぶ |
| 6 | SDP と ICE 候補を、シグナリングで、相手へ渡す |
| 7 | 終了時に、`close().await` を、呼ぶ |

### 主な型

| 型 | 内容 |
| --- | --- |
| `PeerConnection` | 接続の、操作を行う trait。`build()` は、これを実装する型を返す |
| `PeerConnectionBuilder` | 接続を、組み立てる |
| `PeerConnectionEventHandler` | イベントを、受け取る trait |
| `RTCConfigurationBuilder` | ICE サーバーなどの、設定を作る |
| `RTCIceServer` | STUN または TURN のサーバーの、指定 |
| `DataChannel` | データチャネルの操作を行う trait |
| `Runtime` | タイマー、タスク、ソケットの、抽象化 |

### 接続の共有

`build()` は、不透明な `impl PeerConnection` を返す。構造体に持たせたり、タスクの間で、共有したりするときは、1回だけ、包む。

```rust
use std::sync::Arc;
use webrtc::peer_connection::PeerConnection;

// 構造体に持たせるために、dyn の Arc にする
struct App {
    pc: Arc<dyn PeerConnection>,
}

fn make_app(pc: impl PeerConnection + 'static) -> App {
    App { pc: Arc::new(pc) }
}
```

<pre><code class="caution">この章の例は、実際には、コンパイルしていない。PeerConnection の各メソッドの、引数と戻り値は、バージョンで変わることがある。docs.rs で、確認する。
接続は、使い終わったら、close().await を呼ぶ。Drop だけでは、すべてのランタイムで、非同期の後始末が、保証されない。</code></pre>

<pre><code class="tips">アドレスの指定に、0.0.0.0:0 を使うと、OS が、ポートを選ぶ。ワイルドカードは、すべてのネットワークインターフェースを、意味する。
ネットワークが切り替わった後の、ICE の再起動では、バインドするアドレスが、もう一度、解決される (ネットワークの変化の章を参照)。</code></pre>

---

## イベントハンドラ <a id="handler" data-name="イベントハンドラ"></a>

0.17 以前は、イベントごとに、コールバックを登録していた。0.20 以降は、**1つのハンドラ**に、すべてのイベントが、集まる。

### 仕組み

| 項目 | 内容 |
| --- | --- |
| trait | `PeerConnectionEventHandler` |
| 既定の実装 | すべてのメソッドに、何もしない既定の実装がある。必要なものだけを、実装する |
| `self` の形 | `&self`。`&mut self` ではない |
| 共有 | `Arc<dyn PeerConnectionEventHandler>` として、接続が、所有する |
| 変更可能な状態 | `Mutex` や `RwLock` で、包む |
| 非同期 | `#[async_trait::async_trait]` が、必要 |

### 主なイベント

| メソッド | 内容 |
| --- | --- |
| `on_ice_candidate` | ローカルの、ICE 候補が、見つかった |
| `on_connection_state_change` | 接続の状態が、変わった |
| `on_track` | リモートのトラックが、届いた |
| `on_data_channel` | **リモート**が開いた、データチャネルが、届いた |

イベントのメソッドの一覧は、docs.rs の `PeerConnectionEventHandler` で、確認する。

### 状態を持つハンドラ

```rust
use std::sync::Arc;
use tokio::sync::Mutex;
use webrtc::data_channel::DataChannel;
use webrtc::peer_connection::{
    PeerConnectionEventHandler, RTCPeerConnectionIceEvent, RTCPeerConnectionState,
};

// ハンドラの状態は、1つの Mutex に、まとめる
struct MyHandler {
    candidates: Mutex<Vec<String>>,
}

#[async_trait::async_trait]
impl PeerConnectionEventHandler for MyHandler {
    async fn on_ice_candidate(&self, event: RTCPeerConnectionIceEvent) {
        // 見つかった候補を、溜める (シグナリングで、相手へ送る用)
        self.candidates.lock().await.push(event.candidate.to_string());
    }

    async fn on_connection_state_change(&self, state: RTCPeerConnectionState) {
        println!("接続の状態: {state}");
    }

    async fn on_data_channel(&self, dc: Arc<dyn DataChannel>) {
        // 相手が開いたデータチャネルが、届く。イベントの処理は、別のタスクで行う
        tokio::spawn(async move {
            while let Some(_event) = dc.poll().await {
                // データチャネルの章を参照
            }
        });
    }
}
```

<pre><code class="caution">on_data_channel は、リモートが開いたデータチャネルに対してのみ、呼ばれる。自分で create_data_channel したチャネルは、呼ばれない (0.20 の修正)。古い記事の、二重の処理は、不要である。
ハンドラの中で、時間のかかる処理を行うと、イベントの配送が、止まる。重い処理は、tokio::spawn などで、別のタスクへ、移す。</code></pre>

<pre><code class="tips">ハンドラの中で、接続の操作を行いたいときは、ハンドラに、Arc&lt;dyn PeerConnection&gt; を持たせる。コールバックごとの、Arc の複製が、不要になる。
接続を、ハンドラの中で持つと、循環参照になりやすい。close を呼ぶ経路を、決めておく。</code></pre>

---

## シグナリング <a id="signaling" data-name="シグナリング"></a>

シグナリングは、WebRTC の仕様の外にあり、`webrtc` crate も、方法を決めていない。SDP と ICE 候補を、相手へ届ける、手段を、自分で用意する。

### 交換するもの

| データ | 送る側 | 内容 |
| --- | --- | --- |
| オファー | 接続を始める側 | `create_offer` の結果の SDP |
| アンサー | 応答する側 | `create_answer` の結果の SDP |
| ICE 候補 | 両方 | `on_ice_candidate` で、見つかるたびに |

### オファーとアンサーの手順

| 手順 | オファー側 | アンサー側 |
| --- | --- | --- |
| 1 | `create_offer` | |
| 2 | `set_local_description(offer)` | |
| 3 | オファーを、シグナリングで送る | オファーを、受け取る |
| 4 | | `set_remote_description(offer)` |
| 5 | | `create_answer` |
| 6 | | `set_local_description(answer)` |
| 7 | アンサーを、受け取る | アンサーを、シグナリングで送る |
| 8 | `set_remote_description(answer)` | |
| 9 | ICE 候補を、互いに送り、接続へ、追加する | ICE 候補を、互いに送り、接続へ、追加する |

### シグナリングの方式

| 方式 | 内容 |
| --- | --- |
| WebSocket | 双方向で、リアルタイム。最も、一般的 |
| HTTP (POST) | オファーを送り、アンサーを、応答で返す。単純な構成向き |
| 手動 | SDP を、コピーして、貼り付ける。動作確認向き (公式の例で使われている) |
| トリクル ICE | 候補を、見つかるたびに、少しずつ送る。接続の確立が、速くなる |

公式の例では、SDP を、エンコードして、受け渡すための、補助の crate (`rtc-signal`) が、使われている。

<pre><code class="caution">メソッドの名前と、SDP を表す型 (RTCSessionDescription) の、組み立て方は、バージョンで変わることがある。受け取った SDP を、型に戻す方法は、公式の例 (data-channels など) で、確認する。
ICE 候補を、接続へ追加するメソッドは、この章では、断定していない。使っているバージョンの docs.rs で、確認する。</code></pre>

<pre><code class="tips">シグナリングの、サーバーは、SDP の中身を、解釈する必要がない。受け取った文字列を、相手へ転送するだけでよい。
JSON で包むときは、「serde」のドキュメントを参照。WebSocket のサーバーを、axum で作るときは、「axum」のドキュメントを参照。</code></pre>

---

## データチャネル <a id="data-channel" data-name="データチャネル"></a>

データチャネルは、任意のデータ (テキスト、バイナリ) を、ピアの間で、直接送る仕組みである。SCTP の上で動き、DTLS で、暗号化される。

### 作り方と受け取り

| 方向 | 方法 |
| --- | --- |
| 自分が開く | `PeerConnection::create_data_channel` |
| 相手が開く | `PeerConnectionEventHandler::on_data_channel` で、受け取る |

どちらも、`Arc<dyn DataChannel>` として、扱う。

### DataChannel の操作

| メソッド | 内容 |
| --- | --- |
| `poll()` | 次のイベントを、待つ (`Option<DataChannelEvent>`) |
| `send(data)` | バイナリを送る (`BytesMut`) |
| `send_text(text)` | テキストを送る |
| `try_send(data)`、`try_send_text(text)` | 待たずに、送る。バッファが満杯なら、失敗する |
| `writable()` | 送れる状態になるまで、待つ |
| `close()` | チャネルを、閉じる |
| `label()`、`ordered()`、`protocol()` | チャネルの、属性 |
| `ready_state()` | 現在の状態 |
| `id()` | 接続内の、識別子 |

### イベント

| イベント | 内容 |
| --- | --- |
| `OnOpen` | チャネルが開き、送受信できる |
| `OnMessage(msg)` | メッセージが届いた (`msg.data` が、本体) |
| `OnClosing` | 閉じ始めた |
| `OnClose` | 閉じた |
| `OnError` | エラーが起きた |
| `OnBufferedAmountLow` | 送信待ちのデータが、下限を下回った |
| `OnBufferedAmountHigh` | 送信待ちのデータが、上限に達した (実装固有) |

`DataChannelEvent` は、0.21 で `#[non_exhaustive]` になった。`match` には、`_` の腕が、必要である。

### 送受信の例

```rust
use std::sync::Arc;
use webrtc::data_channel::{DataChannel, DataChannelEvent};

// データチャネルのイベントを、ループで処理する
async fn handle_data_channel(dc: Arc<dyn DataChannel>) -> webrtc::error::Result<()> {
    while let Some(event) = dc.poll().await {
        match event {
            DataChannelEvent::OnOpen => {
                println!("データチャネルが開いた");
                dc.send_text("Hello, peer!").await?;
            }
            DataChannelEvent::OnMessage(msg) => {
                // テキストとして、読めるときだけ表示する
                if let Ok(text) = String::from_utf8(msg.data.to_vec()) {
                    println!("受信: {}", text);
                }
            }
            DataChannelEvent::OnClose => {
                println!("データチャネルが閉じた");
                break;
            }
            // 将来追加される、イベントを受け流す
            _ => {}
        }
    }
    Ok(())
}
```

バイナリを送るときは、`BytesMut` を渡す。

```rust
use bytes::BytesMut;
use std::sync::Arc;
use webrtc::data_channel::DataChannel;

async fn send_binary(dc: Arc<dyn DataChannel>) -> webrtc::error::Result<()> {
    dc.send(BytesMut::from(&b"binary payload"[..])).await?;
    Ok(())
}
```

### 信頼性の選択

データチャネルは、作るときの、設定で、信頼性が決まる。

| 設定 | 内容 |
| --- | --- |
| `ordered` | `true` なら、順序を保証する (既定は `true`) |
| `max_retransmits` | 再送の、最大回数。指定すると、信頼性が下がる |
| `max_packet_life_time` | 再送を続ける、時間 (ミリ秒) |
| `protocol` | サブプロトコルの名前 |
| `negotiated` | アプリケーションが、双方で、同じ設定を、事前に決める |

<pre><code class="caution">データチャネルの、メッセージの大きさには、上限がある。ドキュメントには、受信できるメッセージが、16384 バイトまでと、書かれている。大きなデータは、自分で、分割して送る。
0.21 では、データチャネルの ID の型が、usize のハンドルに変わった。実際に、ネットワーク上で使われるストリーム ID は、別に stream_id() で、取得する (まだ決まっていないときは None)。</code></pre>

<pre><code class="tips">OnMessage の msg.data は、バイト列である。テキストか、バイナリかを、区別したいときは、メッセージの種類を持つ欄が、あるかを、docs.rs の RTCDataChannelMessage で確認する。
poll のループは、チャネルごとに、別のタスクで回す。ハンドラの中で、直接回すと、イベントの配送を、止めてしまう。</code></pre>

---

## 送信のバックプレッシャー <a id="backpressure" data-name="バックプレッシャー"></a>

既定では、データチャネルの送信キューは、**上限がない**。送り手が、受け手より速いと、メモリが、増え続ける。上限を設けると、`send` が、容量が空くまで、待つようになる。

### 設定

```rust
use webrtc::peer_connection::PeerConnectionBuilder;

fn builder_with_limit() -> PeerConnectionBuilder {
    // 送信キューの、未送信のバイト数に、上限を設ける (4 MiB)
    PeerConnectionBuilder::new().with_data_channel_send_buffer_limit(4 * 1024 * 1024)
}
```

### 上限があるときの、送信の方法

| メソッド | 振る舞い |
| --- | --- |
| `send()`、`send_text()` | 容量が空くまで、待ってから、キューに入れる |
| `writable()` | 容量が空くまで、待つ。送信を、自分でペース配分したいときに使う |
| `try_send()`、`try_send_text()` | 待たない。満杯なら、`ErrSendBufferFull` で、失敗する |

```rust
use bytes::BytesMut;
use std::sync::Arc;
use webrtc::data_channel::DataChannel;

// 容量が空くのを、待ってから送る
async fn paced_send(dc: Arc<dyn DataChannel>, payload: BytesMut) -> webrtc::error::Result<()> {
    dc.writable().await?;
    dc.send(payload).await
}

// 満杯なら、すぐに諦める
async fn drop_if_full(dc: Arc<dyn DataChannel>, payload: BytesMut) {
    if dc.try_send(payload).await.is_err() {
        // 送信を諦め、必要なら、再送や破棄を、自分で決める
    }
}
```

### 閾値によるイベント

| メソッド | 内容 |
| --- | --- |
| `set_buffered_amount_low_threshold(n)` | 下限を設定する。下回ると、`OnBufferedAmountLow` が届く |
| `set_buffered_amount_high_threshold(n)` | 上限を設定する。達すると、`OnBufferedAmountHigh` が届く |
| `outstanding_bytes()` | SCTP が、まだ解放していない、送信側のバイト数 |

<pre><code class="caution">try_send は、失敗したとき、渡した data を、消費する。再試行するときは、事前に、複製を残しておく。
上限は、複数の送信者がいると、厳密ではなく、目安になる。上限を、少し超えることが、ある。</code></pre>

<pre><code class="tips">受信側が遅いときは、ドライバーが、データチャネルの取り出しを、止める。SCTP の受信ウィンドウが、縮み、相手の送信が、遅くなる (0.21 で、メッセージが、黙って捨てられなくなった)。
受信のウィンドウは、with_sctp_receive_buffer_size で、変えられる。接続数が多いときは、小さくすると、メモリの使用量が、減る。</code></pre>

---

## ICE、STUN、TURN <a id="ice" data-name="ICE"></a>

### ICE サーバーの設定

```rust
use webrtc::peer_connection::{RTCConfigurationBuilder, RTCIceServer};

fn config() -> webrtc::peer_connection::RTCConfiguration {
    RTCConfigurationBuilder::default()
        .with_ice_servers(vec![
            // STUN サーバー。自分の外側のアドレスを、知るために使う
            RTCIceServer {
                urls: vec!["stun:stun.l.google.com:19302".to_owned()],
                ..Default::default()
            },
        ])
        .build()
}
```

TURN サーバーを使う場合は、`urls` に、`turn:` で始まる URL を、指定し、認証情報も、設定する。`RTCIceServer` の、認証情報の欄の名前は、docs.rs で確認する。

### サーバーの種類

| サーバー | URL の形 | 用途 |
| --- | --- | --- |
| STUN | `stun:host:port` | 外側のアドレスの、発見 |
| TURN (UDP) | `turn:host:port` | 直接つながらないときの、中継 |
| TURN (TLS) | `turns:host:port` | 制限の厳しい、ネットワークでの、中継 |

### ネットワークの変化への対応

| 機能 | 内容 |
| --- | --- |
| ICE の再起動 | UDP のソケットを、もう一度、バインドし直す |
| ワイルドカードのバインド | `0.0.0.0` は、すべてのインターフェースを意味し、インターフェースごとに、ソケットを作る |
| 再解決 | バインドするアドレスは、バインドのたびに、解決し直される。Wi-Fi から、携帯回線への切り替えに、追従できる |
| バインドの失敗 | バインドできないアドレスは、記録され、飛ばされる (ドライバーは止まらない) |
| ICE TCP | 能動と受動の、両方に対応する (新しいドライバーで) |
| mDNS 候補 | 既定は、`QueryOnly` で、Safari の候補を、解決できる |
| TURN の割り当ての更新 | 更新の間隔に、上限を設けられる (`with_turn_allocation_refresh_interval_cap`) |

<pre><code class="caution">STUN と TURN が、同じアドレスを、共有していると、古いバージョンでは、サーバー反射候補が、集まらない問題があった (0.21 で修正)。接続できないときは、バージョンを確認する。
STUN サーバーの URL に、使っている IP のアドレスの種類 (IPv4、IPv6) に合う、アドレスがないと、そのサーバーは、飛ばされる (0.21.1 の修正)。</code></pre>

<pre><code class="tips">公開の STUN サーバーは、開発用に、便利だが、本番では、自前の STUN と TURN (coturn など) を、用意することが多い。
ICE の設定を、後から変えたいときは、set_configuration で、ICE サーバーの更新が、反映される (0.20 の修正)。</code></pre>

---

## メディア <a id="media" data-name="メディア"></a>

音声と映像は、RTP で運ばれ、SRTP で、暗号化される。

### 概念

| 概念 | 内容 |
| --- | --- |
| トラック | 1本の、音声または映像のストリーム |
| `TrackLocal` | 自分が送る、トラック |
| `TrackRemote` | 相手から届く、トラック (`on_track` で受け取る) |
| `SampleWriter` | メディアのサンプルを、RTP にして、送る補助 |
| トランシーバー | 送信と受信の、組 |
| `MediaEngine` | 使うコーデックの、登録 |

### コーデックと耐障害性

| 機能 | 内容 |
| --- | --- |
| RTX (RFC 4588) | 既定で、ネゴシエートされる。映像の再送に、効く |
| NACK | 欠けたパケットの、再送要求 |
| FlexFEC (draft-03) | 前方誤り訂正。送信と受信の、両方に対応する (0.21) |
| ULPFEC | 受信側で、復元できないため、**既定では、提案されない** (0.21) |
| シミュルキャスト | 複数の品質の映像を、同時に送る。`a=simulcast` の順序に、従う |
| ジッタバッファ | インターセプタとして提供される (オプション) |

### 公式の例

| 例 | 内容 |
| --- | --- |
| `play-from-disk-vpx` | ファイルの映像を、送る |
| `save-to-disk-h26x` | 届いた映像を、ファイルに保存する |
| `play-from-disk-fec`、`save-to-disk-fec` | FlexFEC を使う |
| `bandwidth-estimation-from-disk` | 帯域の推定に合わせて、送る |
| `rtcp-processing` | `TrackLocal::poll` による、イベントの処理 |
| `stats` | 統計情報の取得 |

<pre><code class="caution">0.21 では、既定のオファーから、ULPFEC (ペイロードタイプ 116) が、なくなった。相手が ULPFEC を、前提にしている場合は、接続の条件が、変わる。
MediaEngine の、コーデックの登録の API は、この章では、コードを載せていない。公式の例 (play-from-disk-vpx など) の形を、参照する。</code></pre>

<pre><code class="tips">TrackLocal には、poll で、イベント (バインド、解除、RTCP による通知) を、受け取る方法がある。コールバックなしで、トラックの状態の変化に、反応できる。
get_stats で得る、統計情報の型は、get_stats が報告する名前で、公開されている (0.20 の修正)。</code></pre>

---

## 輻輳制御とインターセプタ <a id="interceptor" data-name="輻輳制御"></a>

### インターセプタ

インターセプタは、RTP と RTCP のパケットの、流れに、割り込んで、処理を挟む仕組みである。NACK、レポート、ペーシングなどが、インターセプタとして、実装されている。

| 項目 | 内容 |
| --- | --- |
| 内蔵の数 | 0.21 で、6 から 13 に増えた |
| 追加されたもの | 輻輳制御、ペーサー、FlexFEC の、エンコーダとデコーダ、ジッタバッファ、RFC 8888 のフィードバック、定期的な PLI |
| 構造 | **平らなリスト**。入れ子の型ではない |
| 並び順 | `Slot` で、決まる。名前つきのスロットは、1,000 ずつ離れている |
| 自作 | 間の番号 (例: `Slot::from(3_500)`) に、差し込める |
| 型パラメータ | `RTCPeerConnection` には、もう、ない |

### 輻輳制御

送信の速度を、ネットワークの状況に、合わせる仕組みである。**オプトイン**で、既定では、無効である。ペーシングが、遅延を増やすため、明示的に有効にする。

```rust
// レジストリに、輻輳制御を追加する (レジストリと MediaEngine は、事前に用意する)
let registry = configure_congestion_control(
    registry,
    Gcc::default(),
    CongestionFeedback::Twcc,
    &mut media_engine,
)?;
```

| 要素 | 内容 |
| --- | --- |
| `BandwidthEstimator` | 帯域の推定器の、拡張点 |
| `Gcc` | Google Congestion Control の実装 (カルマンフィルタ、適応的な閾値、損失の制御、AIMD) |
| `ConstantBitrate` | 経路の帯域が、分かっているときの、固定の推定器 |
| `CongestionFeedback::Twcc` | TWCC のフィードバックを使う |
| RFC 8888 | もう一つの、フィードバックの方式 (TWCC と、どちらか一方) |
| `targetBitrate` | 推定値。送信 RTP ストリームの、統計情報に現れる |

<pre><code class="caution">この章のコードは、断片である。use 文、レジストリと MediaEngine の作り方は、公式の例 (bandwidth-estimation-from-disk) を参照する。実際には、コンパイルしていない。
Registry::with は、0.21 から Slot を、受け取る。0.20 以前のコードは、そのままでは、動かない。</code></pre>

<pre><code class="tips">推定値 (targetBitrate) を、エンコーダの、目標の ビットレートへ、反映させると、帯域に合わせた、映像の送信が、できる。
輻輳制御は、実際のネットワークで、検証されることが、少ない。決定的な、経路のシミュレーターで、テストされている段階なので、本番では、結果を、観察する。</code></pre>

---

## ランタイム <a id="runtime" data-name="ランタイム"></a>

`webrtc` は、タイマー、タスクの生成、ソケット、名前解決を、`Runtime` trait を通して、行う。

### 内蔵のランタイム

| 型 | フィーチャー | 内容 |
| --- | --- | --- |
| `TokioRuntime` | `runtime-tokio` (既定) | Tokio を使う |
| `SmolRuntime` | `runtime-smol` | smol を使う |
| `MockRuntime` | `runtime-mock` | 仮想時計。入出力なし。テスト用 |

### 接続ごとの選択

ランタイムは、**接続ごとに、渡す値**である。1つのプロセスで、接続ごとに、別のランタイムを使える。

```rust
use std::sync::Arc;
use webrtc::peer_connection::PeerConnectionBuilder;
use webrtc::runtime::TokioRuntime;

async fn build_on_tokio() -> Result<(), Box<dyn std::error::Error>> {
    // 接続ごとに、ランタイムを渡す
    let _pc = PeerConnectionBuilder::new()
        .with_runtime(Arc::new(TokioRuntime))
        .with_udp_addrs(vec!["0.0.0.0:0"])
        .build()
        .await?;
    Ok(())
}
```

### 自作のランタイム

| 項目 | 内容 |
| --- | --- |
| 実装する trait | `webrtc::runtime::Runtime` |
| 追加の変更 | `#[cfg]` の編集、fork、上流への変更は、不要 |
| ソケット | `quinn-udp` の型 (`Transmit`、`RecvMeta` など) が、そのまま使われる |
| 例 | `custom-runtime`。`async-executor` と `async-io` の上で、`--no-default-features` で、動く |
| 時間 | `Runtime` に、既定の実装つきの `now()` があり、ドライバーは、そこから時刻を得る |

<pre><code class="caution">webrtc::runtime は、quinn-udp の型を、公開 API に再公開している。quinn-udp のメジャーバージョンが上がると、webrtc 側でも、破壊的変更になる。
組み込み向けの、no_std 環境 (embassy など) は、対象外である。標準ライブラリの型が、全体で使われている。</code></pre>

<pre><code class="tips">ランタイムの切り替えは、フィーチャーと、with_runtime だけで、行える。PeerConnection の API は、変わらない。
Tokio の使い方は、「Tokio」のドキュメントを参照。</code></pre>

---

## 設定とチューニング <a id="tuning" data-name="設定とチューニング"></a>

### PeerConnectionBuilder のオプション

| メソッド | 内容 |
| --- | --- |
| `with_configuration(config)` | ICE サーバーなどの、設定 |
| `with_runtime(runtime)` | ランタイム |
| `with_handler(handler)` | イベントハンドラ |
| `with_udp_addrs(addrs)` | バインドする、UDP のアドレス |
| `with_dedicated_reactor_thread(bool)` | ドライバーを、専用のリアクタースレッドに固定する |
| `with_reactor_pool_size(n)` | リアクタースレッドの、プールの大きさ |
| `with_sctp_receive_buffer_size(n)` | SCTP の受信ウィンドウ (バイト) |
| `with_data_channel_send_buffer_limit(n)` | データチャネルの、送信キューの上限 (バイト) |

```rust
use std::sync::Arc;
use webrtc::peer_connection::PeerConnectionBuilder;

async fn tuned(handler: Arc<impl webrtc::peer_connection::PeerConnectionEventHandler>)
    -> Result<(), Box<dyn std::error::Error>>
{
    let _pc = PeerConnectionBuilder::new()
        .with_handler(handler)
        .with_udp_addrs(vec!["0.0.0.0:0"])
        // ドライバーを、専用のリアクタースレッドに、固定する
        .with_dedicated_reactor_thread(true)
        .with_reactor_pool_size(4)
        // 受信ウィンドウを小さくして、接続数が多いときの、メモリを抑える
        .with_sctp_receive_buffer_size(256 * 1024)
        .build()
        .await?;
    Ok(())
}
```

### 性能の目安

公式の発表による、`data-channels-flow-control` の、ベンチマークの結果である (0.20 の時点。環境と条件で、変わる)。

| 構成 | 傾向 |
| --- | --- |
| 接続 1 本、既定の設定 | 遅延が支配的で、Pion (Go の実装) より、遅い |
| 接続 1 本、専用リアクター | Pion より、速い |
| 接続 10 本の、合計 | 既定の設定でも、Pion より、速い |

数値そのものは、環境で変わるため、このドキュメントでは、載せない。自分の環境で、測る。

### 暗号の提供者と設定

| 項目 | 内容 |
| --- | --- |
| 暗号の提供者 | 値として、接続ごとに、渡す。グローバルな、登録は不要 |
| 既定 | `ring` |
| 切り替え | `crypto-aws-lc-rs` のフィーチャーで、`aws-lc-rs` が使える |
| 自作 | OpenSSL、FIPS のモジュール、HSM などを、3つの trait の実装で、差し込める |
| 設定の組み立て | `SettingEngineBuilder::new()…build()` |
| 提供者の指定 | `SettingEngineBuilder::with_crypto_provider(...)` |
| SCTP の MTU | `SettingEngineBuilder::with_sctp_mtu` |
| DTLS の暗号スイート | `SettingEngine::set_dtls_cipher_suites()` で、制限できる |

<pre><code class="caution">この章の、SettingEngine を、PeerConnectionBuilder に渡す、メソッドの名前は、確認していない。docs.rs で、確認する。
専用のリアクタースレッドは、接続ごとに、OS のスレッドを作らず、プロセス全体で共有する、上限つきのプールから、割り当てられる (0.20 の改善)。</code></pre>

<pre><code class="tips">データチャネルの、送信の遅延が重要な場合は、専用のリアクタースレッドを、試す。接続数が多い場合は、既定の設定でも、効率がよい。
性能の調整は、必ず、自分のワークロードで、測ってから行う。</code></pre>

---

## 実践例 <a id="practice" data-name="実践例"></a>

### データチャネルで、メッセージを返すピア

データチャネルを、受け取って、届いたテキストを、そのまま返す例。

```rust
use std::sync::Arc;
use webrtc::data_channel::{DataChannel, DataChannelEvent};
use webrtc::peer_connection::{
    PeerConnectionBuilder, PeerConnectionEventHandler, RTCConfigurationBuilder, RTCIceServer,
    RTCPeerConnectionState,
};

// 受け取ったデータチャネルを、処理するハンドラ
struct EchoHandler;

#[async_trait::async_trait]
impl PeerConnectionEventHandler for EchoHandler {
    async fn on_connection_state_change(&self, state: RTCPeerConnectionState) {
        println!("接続の状態: {state}");
    }

    async fn on_data_channel(&self, dc: Arc<dyn DataChannel>) {
        // チャネルごとに、タスクを分けて、イベントを処理する
        tokio::spawn(async move {
            while let Some(event) = dc.poll().await {
                match event {
                    DataChannelEvent::OnMessage(msg) => {
                        // 届いたテキストを、そのまま返す
                        if let Ok(text) = String::from_utf8(msg.data.to_vec()) {
                            let _ = dc.send_text(&text).await;
                        }
                    }
                    DataChannelEvent::OnClose => break,
                    _ => {}
                }
            }
        });
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = RTCConfigurationBuilder::default()
        .with_ice_servers(vec![RTCIceServer {
            urls: vec!["stun:stun.l.google.com:19302".to_owned()],
            ..Default::default()
        }])
        .build();

    let pc = PeerConnectionBuilder::new()
        .with_configuration(config)
        .with_handler(Arc::new(EchoHandler))
        .with_udp_addrs(vec!["0.0.0.0:0"])
        .build()
        .await?;

    // ここで、シグナリングを使い、オファーを受け取り、アンサーを返す
    // (set_remote_description、create_answer、set_local_description)

    // 終了時に、明示的に閉じる
    pc.close().await?;
    Ok(())
}
```

### 流れ

| 段階 | 内容 |
| --- | --- |
| 起動 | ハンドラを渡して、接続を作る |
| シグナリング | 相手のオファーを、受け取り、アンサーを返す |
| チャネルの到着 | `on_data_channel` が、呼ばれる |
| 処理 | チャネルごとの、タスクで、`poll` を回す |
| 終了 | `close().await` を、呼ぶ |

<pre><code class="caution">この例は、実際には、コンパイルしていない。接続の作成と、イベントの処理の形は、docs.rs の記述と、公式の例に、基づいている。
シグナリングの部分は、コメントで、省略している。完全な動作する例は、公式リポジトリの examples (data-channels) を、参照する。</code></pre>

<pre><code class="tips">ブラウザから、このピアに接続するときは、ブラウザ側が、データチャネルを作る (createDataChannel) と、on_data_channel が呼ばれる。
Web サーバーの中で動かす場合は、接続の数に、上限を設ける。接続ごとに、ソケットとタスクが、作られる。</code></pre>

---

## テスト <a id="test" data-name="テスト"></a>

### 決定的なテスト

`webrtc` の設計では、プロトコルの処理が、入出力から、分離されている。テストでは、**仮想時計**を使うと、タイマーを待たずに、時間を進められる。

| 手段 | 内容 |
| --- | --- |
| `runtime-mock` | `MockRuntime`。仮想時計で、タイマーを進める。入出力は、行わない |
| `rtc` crate | 入出力なしの、プロトコルコア。バイト列を渡し、出力を、読み取り、時間を手で進める |
| ループバック | 同じプロセスで、2つの `PeerConnection` を、つなぐ |

`MockRuntime` では、ICE のタイムアウト、DTLS の再送、SCTP の再送タイマーが、仮想時間で、進む。

```toml
[dev-dependencies]
webrtc = { version = "0.21", features = ["runtime-mock"] }   # テスト用に、MockRuntime を有効にする
```

### テストの方針

| 対象 | 方法 |
| --- | --- |
| タイムアウト、再送 | `MockRuntime` で、時間を進める |
| データチャネルの送受信 | 同じプロセスの、2つの接続で、往復を確認する |
| ハンドラのロジック | ロジックを、接続から分離し、通常の関数として、テストする |
| 再接続 | ICE の再起動を、テストで起こす |
| ブラウザとの相互運用 | 自動化されていない。手動、または、自前の CI で確認する |

<pre><code class="caution">0.21 では、PeerConnection、DataChannel などの trait が、sealed になった。外部の型で、これらの trait を、実装して、テスト用の代役にすることは、できない。
自分のコードを、trait の境界で、包み、その境界の側を、差し替えるようにする。</code></pre>

<pre><code class="tips">ネットワークを使うテストは、不安定になりやすい。時間に依存する処理は、MockRuntime で、決定的に、テストする。
Rust のテスト全般は、「Rustのテスト」のドキュメントを参照。</code></pre>

---

## rtc (Sans-I/O コア) <a id="rtc" data-name="rtc"></a>

`rtc` crate は、WebRTC のプロトコルを、**入出力なしで**実装した、コアである。`webrtc` は、この上の、薄い非同期の層になっている。

### 設計の考え方

| 項目 | 内容 |
| --- | --- |
| 入力 | 受信したバイト列と、現在の時刻を、渡す |
| 出力 | 送るべきバイト列と、次のタイムアウトを、読み取る |
| 時刻 | コアは、時刻を、**尋ねない**。呼び出し側が、渡す |
| スレッド | 内部で、スレッドも、ソケットも、持たない |
| テスト | 実際のネットワークなしで、再現できる |

### ドライバーの構造

`webrtc` の、背景のドライバーは、次の順に、処理を繰り返す。

```text
poll_writes → poll_events → poll_reads → poll_timeout / handle_timeout
```

### webrtc と rtc の使い分け

| 状況 | 選ぶ crate |
| --- | --- |
| Tokio や smol で、手軽に、WebRTC を使いたい | `webrtc` |
| 自前のイベントループに、組み込みたい | `rtc` |
| 入出力の、細かい制御が必要 | `rtc` |
| プロトコルを、決定的にテストしたい | `rtc` (または、`webrtc` の `runtime-mock`) |

### rtc の特徴

| 機能 | 内容 |
| --- | --- |
| 暗号の提供者 | `ring` または `aws-lc-rs`。自作も可能 |
| 外部の署名 | HSM、TPM、クラウドの KMS で、DTLS の署名を、行える |
| ビルドの対象 | `wasm32-wasip2` に、対応 |
| 仕様の適合 | W3C の API に対して、95% 以上とされる (2026年1月の分析。`rtc` のみの値) |

<pre><code class="caution">95% 以上という適合の数値は、webrtc ではなく、rtc に対するものである。2026年1月の分析が、そのまま使われており、更新されていない。
rtc の公開 API は、webrtc とは別に、バージョンが付けられている。両方のバージョンを、揃える。</code></pre>

---

## 古いコードからの変更 <a id="migration" data-name="古いコードからの変更"></a>

### 0.17 から 0.20 へ

0.20 では、コールバックの登録が、ハンドラ trait に、置き換わった。

| 古い書き方 (0.17) | 現在 | 備考 |
| --- | --- | --- |
| `pc.on_peer_connection_state_change(Box::new(...))` | `PeerConnectionEventHandler::on_connection_state_change` | コールバックの登録が、不要になった |
| `pc.on_ice_candidate(Box::new(...))` | `PeerConnectionEventHandler::on_ice_candidate` | 同上 |
| コールバックごとの `Arc::clone` | ハンドラ 1つを、`Arc` で、渡す | `&self` なので、変更可能な状態は、`Mutex` で包む |
| `api.new_peer_connection(config).await?` | `PeerConnectionBuilder::new()…build().await?` | 接続を作る形が、変わった |
| Tokio に、固定 | `Runtime` を、接続ごとに渡す | `runtime-tokio` は、既定 |
| データチャネルの、コールバック | `DataChannel::poll()` の、ループ | イベントを、取りに行く形になった |
| 送信キューの、上限なし | `with_data_channel_send_buffer_limit`、`writable()`、`try_send()` | オプトインで、上限を設ける |

### 0.20 から 0.21 へ

| 領域 | 変更 |
| --- | --- |
| 設定 | `SettingEngine` は、`SettingEngineBuilder::new()…build()` で作る |
| 暗号 | コンストラクタが、`Arc<dyn RTCCryptoProvider>` を受け取る。`CustomSigner` は、`SigningKey` の実装に変わった。`RTCCertificate::from_key_pair` は、`RTCCertificate::generate` に変わった。`openssl` のフィーチャーは、削除された |
| インターセプタ | `RTCPeerConnection` から、チェーンの型パラメータが、なくなった。`Registry::with(Slot, …)` になった |
| データチャネル | `RTCDataChannelId` は、`usize` のハンドル。ネットワーク上の ID は、`stream_id() -> Option<StreamId>` |
| 列挙型 | 多くの公開の enum が、`#[non_exhaustive]` になった。`match` に、`_` の腕を足す |
| コーデック | 既定のオファーから、ULPFEC (PT 116) が、なくなった |
| バインドするアドレス | `PeerConnectionBuilder::build` で、アドレスに `Send + 'static` が必要になった |
| trait | `PeerConnection`、`DataChannel`、`RtpSender` などは、sealed になった |

<pre><code class="caution">0.17 から 0.20 以降への移行は、機械的な置き換えでは済まない。イベントを、ハンドラへ移し、API 全体が、非同期になっている。実質的に、移植作業になる。
この表は、公式の発表の内容に基づく。個々のメソッドの、最新のシグネチャは、docs.rs で確認する。検索で出てくる記事の多くは、0.17 以前のものである。</code></pre>

<pre><code class="tips">0.21.x から 1.0 へは、公開 API を、変えない方針である。0.21 で、移行しておくと、1.0 への更新は、小さくなる。
cargo-semver-checks が、公式の CI に入っており、意図しない API の破壊は、検出される。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| 古い記事のコードが、コンパイルできない | 0.17 以前の、コールバックの API を、使っている | 「古いコードからの変更」の表を、確認し、ハンドラ trait に移す |
| ハンドラの状態を、変更できない | ハンドラのメソッドは、`&self` | `Mutex` や `RwLock` で、状態を包む |
| 接続を、構造体に持たせられない | `build()` が、不透明な `impl PeerConnection` を返す | `Arc<dyn PeerConnection>` に、1回、包む |
| 接続が、いつまでも、解放されない | `close().await` を、呼んでいない | 終了時に、明示的に、`close().await` を呼ぶ |
| `on_data_channel` が、自分のチャネルで呼ばれない | リモートが開いたチャネルにだけ、呼ばれる | 自分で作ったチャネルは、`create_data_channel` の戻り値を、使う |
| `match` で、コンパイルエラーになる (0.21) | `DataChannelEvent` などが、`#[non_exhaustive]` | `_ => {}` の腕を、足す |
| メッセージが、途中で、切れる | メッセージの大きさの、上限を、超えている | 大きなデータは、自分で、分割して送る |
| 送り手のメモリが、増え続ける | 送信キューの、上限がない (既定) | `with_data_channel_send_buffer_limit` で上限を設け、`writable()` か `try_send` を使う |
| `ErrSendBufferFull` が返る | `try_send` が、上限を超えた | 待つなら `send` か `writable()`。諦めるなら、データを、破棄する |
| 単一の接続で、遅延が大きい | 既定の設定は、往復の遅延に、不利 | `with_dedicated_reactor_thread(true)` を、試す |
| ブラウザとの接続で、映像が、乱れる | 輻輳制御が、無効 (既定) | `configure_congestion_control` で、オプトインする |
| 相手が、ULPFEC を、前提にしている | 0.21 の既定のオファーから、ULPFEC が、なくなった | FlexFEC を、使う。または、`MIME_TYPE_ULP_FEC` を、明示的に登録する |
| Safari の候補が、解決されない | mDNS の設定 | 既定の `QueryOnly` を、変えていないか、確認する |
| テスト用の代役が、作れない (0.21) | `PeerConnection` や `DataChannel` が、sealed | trait の境界を、自分のコードで、包む |
| 複数のバージョンの `webrtc` と `rtc` が、混ざる | 依存の crate ごとに、バージョンが違う | `cargo tree -d` で確認し、揃える |

---

## 関連 crate <a id="ecosystem" data-name="関連crate"></a>

| crate | 用途 |
| --- | --- |
| `rtc` | Sans-I/O のプロトコルコア。`webrtc` の土台 |
| `rtc-signal` | 公式の例で使われる、シグナリングの補助 |
| `tokio` | 非同期ランタイム (Tokio のドキュメントを参照) |
| `bytes` | データの送信の、バッファ (bytes のドキュメントを参照) |
| `axum` | シグナリング用の、WebSocket サーバー (axum のドキュメントを参照) |
| `serde`、`serde_json` | SDP や候補を、JSON で包む (serde のドキュメントを参照) |
| `anyhow`、`thiserror` | エラー処理 (それぞれのドキュメントを参照) |
| `web-sys` | ブラウザの中の Wasm から、`RtcPeerConnection` を使う |
| `quinn-udp` | UDP の、バッチ送受信。`webrtc` の公開 API にも現れる |

<pre><code class="tips">公式の examples は、データチャネル、メディアの再生と保存、シミュルキャスト、ICE の再起動、統計情報など、30 以上ある。API の形は、まず、例で確認する。
Rust には、他にも WebRTC の実装がある。比較する場合は、それぞれの、最新の状態と、保守の状況を、確認する (このドキュメントでは、調べていない)。</code></pre>
