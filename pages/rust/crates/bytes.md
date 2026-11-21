---
title: bytes
layout: default
---

# bytes <a id="top" data-name="TOP"></a>

bytes は、Rust で、バイト列を効率よく扱うための crate。参照カウントで共有できる、バッファの型 `Bytes` と、書き込み用の `BytesMut`、そして、読み書きの操作を定義する、`Buf` と `BufMut` の、2つの trait を提供する。

最大の特徴は、**コピーなしで、バッファを共有、分割できる**こと。1つのバッファから、複数の `Bytes` を切り出しても、元のメモリは、共有される。ネットワークプログラミングで、受信したデータを、コピーせずに、各処理へ渡す用途に向いている。Tokio、hyper、axum、prost など、多くの crate が、バイト列の型として、`Bytes` を採用している。

| 型・trait | 内容 |
| --- | --- |
| `Bytes` | 参照カウントで共有される、読み取り専用のバッファ。clone と slice が、安価 |
| `BytesMut` | 1つの所有者だけが、書き込める、バッファ。`freeze` で、`Bytes` にできる |
| `Buf` | 読み取りの操作 (カーソルを進めながら、読む) |
| `BufMut` | 書き込みの操作 (カーソルを進めながら、書く) |

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| ゼロコピーの共有 | `Bytes` の clone や slice は、参照カウントを増やすだけで、データをコピーしない |
| 所有権の分割 | `BytesMut` を、`split_to` や `split_off` で、複数のバッファに分けられる |
| 読み書きの trait | `Buf` と `BufMut` で、数値や、バイト列を、読み書きできる |
| 標準の型への対応 | `&[u8]`、`Vec<u8>` なども、`Buf` や `BufMut` として、使える |
| 失敗しない操作 | `Buf` と `BufMut` の操作は、`Read` や `Write` と違い、I/O エラーを返さない |
| `no_std` への対応 | `std` フィーチャーを無効にすると、標準ライブラリなしでも、使える (詳細は、公式のドキュメントで確認する) |

### 他の選択肢との比較

| | `Vec<u8>` | `Arc<[u8]>` | `Bytes` |
| --- | --- | --- | --- |
| clone | 全体をコピーする | 参照カウントを増やす | 参照カウントを増やす |
| 部分的な共有 (slice) | 借用 (`&[u8]`) のみ | 不可。コピーが必要 | 所有する slice を、作れる |
| 末尾への追記 | できる | できない | できない (`BytesMut` で書く) |
| スレッド間の共有 | `Arc` などで、包む | そのまま共有できる | そのまま共有できる (`Send` と `Sync`) |
| 主な用途 | 汎用のバッファ | 変更しない、固定のデータ | ネットワークの、受信データ、フレーム |

### 向いている場面

| 向いている | 向いていない |
| --- | --- |
| 受信したデータを、コピーせずに、複数の処理へ渡す | 小さくて、短命なバッファを、1か所で使うだけの場合 (`Vec<u8>` で、十分) |
| プロトコルの、フレームを、切り出して処理する | 頻繁に、内容を書き換えるデータ (`BytesMut` や `Vec<u8>` を使う) |
| 数値を、エンディアン指定で、読み書きする | 文字列の、操作が中心の場合 (`String` や、`bytestring` を検討する) |
| Tokio、hyper、axum などと、データをやり取りする | |

<pre><code class="caution">bytes 1.2.1 から 1.11.0 には、BytesMut::reserve で、整数がオーバーフローする脆弱性 (CVE-2026-25541) がある。1.11.1 で修正されている。
このドキュメントは、bytes 1.12 (2026年11月時点の最新は、1.12.1) を前提にしている。1.11.1 以降に、更新して使う。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

### 追加

```bash
cargo add bytes
```

```toml
[dependencies]
bytes = "1"   # 1.x の間は、互換性が保たれる
```

bytes は、1.0 以降、メジャーバージョンが、安定している。そのため、`"1"` と書いてよい。

### フィーチャー

| フィーチャー | 内容 |
| --- | --- |
| `std` | 標準ライブラリを使う (既定で有効) |
| `serde` | `Bytes` と `BytesMut` に、`Serialize` と `Deserialize` を実装する |

アトミック操作を持たない環境向けに、`portable-atomic` を使う、フィーチャーもある。フィーチャー名は、docs.rs の、Feature flags で確認する。

```toml
[dependencies]
bytes = { version = "1", features = ["serde"] }   # serde 対応を有効にする
```

### 対応する Rust のバージョン

| 項目 | 内容 |
| --- | --- |
| 1.11.0 | 最小の Rust のバージョンが、1.57 に引き上げられた |
| 1.12 以降 | 変更の有無を、確認していない。`Cargo.toml` の `rust-version` で、確認する |

<pre><code class="tips">Tokio を使うプロジェクトでは、bytes が、依存として、すでに含まれていることが多い。cargo tree で、バージョンを確認し、重複させない。
Tokio の使い方は、「Tokio」のドキュメントを参照。</code></pre>

---

## 基本 <a id="basic" data-name="基本"></a>

### 最小の例

`BytesMut` に書き込み、`freeze` で `Bytes` に変えて、共有する例。

```rust
use bytes::{BufMut, Bytes, BytesMut};

fn main() {
    // 容量 64 バイトの、書き込み用のバッファを作る
    let mut buf = BytesMut::with_capacity(64);
    buf.put_slice(b"hello");
    buf.put_u8(b' ');
    buf.put(&b"world"[..]);

    // 読み取り専用の Bytes に変える (コピーしない)
    let bytes: Bytes = buf.freeze();

    // 同じメモリを、共有する slice を作る (コピーしない)
    let a = bytes.slice(0..5);
    let b = bytes.slice(6..);

    println!("{:?} {:?}", a, b);
}
```

```text
b"hello" b"world"
```

### 基本の流れ

| 手順 | 内容 |
| --- | --- |
| 1 | `BytesMut` を作り、`BufMut` の、`put_*` で書き込む |
| 2 | 書き終えたら、`freeze` で、`Bytes` にする |
| 3 | `Bytes` を、`clone` や `slice` で、必要な数だけ、共有する |
| 4 | 読むときは、`Buf` の、`get_*` で、カーソルを進めながら読む |

### 主な型

| 型 | 内容 |
| --- | --- |
| `Bytes` | 共有できる、読み取り専用のバッファ |
| `BytesMut` | 書き込める、一意な所有権のバッファ |
| `TryGetError` | `try_get_*` で、残りが足りないときの、エラー |
| `buf::Chain` | 2つの `Buf` を、つなげたもの |
| `buf::Take` | 先頭の、指定した長さだけを、読む `Buf` |
| `buf::Limit` | 書き込める量を、制限する `BufMut` |
| `buf::Reader`、`buf::Writer` | `Buf` と `BufMut` を、`Read` と `Write` に変えるもの |

<pre><code class="tips">Bytes は、Deref で、&amp;[u8] として扱える。len、is_empty、iter、インデックスなど、スライスの操作が、そのまま使える。
BytesMut も、同様に、&amp;mut [u8] として扱える。</code></pre>

---

## Bytes <a id="bytes" data-name="Bytes"></a>

`Bytes` は、安価に clone でき、slice を作れる、連続したメモリである。内部では、参照カウントで、メモリの解放を管理する。

### 作り方

```rust
use bytes::Bytes;

fn main() {
    // 静的なデータから (コピーしない、確保もしない)
    let a = Bytes::from_static(b"static data");

    // スライスから (コピーする)
    let b = Bytes::copy_from_slice(&[1, 2, 3]);

    // Vec<u8> や String から (所有権を引き取る)
    let c = Bytes::from(vec![4, 5, 6]);
    let d = Bytes::from(String::from("text"));

    // 空の Bytes
    let e = Bytes::new();

    println!("{} {} {} {} {}", a.len(), b.len(), c.len(), d.len(), e.len());
}
```

```text
11 3 3 4 0
```

| 関数 | 内容 |
| --- | --- |
| `Bytes::new()` | 空の `Bytes` を作る |
| `Bytes::from_static(&'static [u8])` | 静的なデータを、そのまま包む。コピーしない |
| `Bytes::copy_from_slice(&[u8])` | スライスの、内容をコピーして、作る |
| `Bytes::from(Vec<u8>)` | `Vec` の所有権を、引き取る |
| `Bytes::from(String)` | `String` の所有権を、引き取る |
| `Bytes::from_owner(owner)` | `AsRef<[u8]>` を実装する、任意の所有者を、包む |

### 分割と切り出し

| メソッド | 内容 |
| --- | --- |
| `slice(range)` | 範囲を共有する、新しい `Bytes` を返す (元は、変わらない) |
| `split_to(at)` | 先頭の `at` バイトを返し、自身は、残りになる |
| `split_off(at)` | `at` 以降を返し、自身は、先頭の `at` バイトになる |
| `truncate(len)` | 長さを `len` に切り詰める |
| `clear()` | 空にする |

```rust
use bytes::Bytes;

fn main() {
    let mut data = Bytes::from_static(b"hello world");

    // 先頭の 5 バイトを取り出す。data は、" world" になる
    let head = data.split_to(5);

    // 1 バイト目以降を取り出す。data は、" " になる
    let tail = data.split_off(1);

    println!("{:?} {:?} {:?}", head, data, tail);
}
```

```text
b"hello" b" " b"world"
```

<pre><code class="caution">slice、split_to、split_off は、範囲が長さを超えると、panic する。外部から来た値を使うときは、事前に、len と比較する。
小さな slice を、長く保持すると、元の大きなバッファ全体が、解放されない。長く持つ場合は、copy_from_slice で、コピーして、切り離す。</code></pre>

### BytesMut に戻す

参照が1つだけの `Bytes` は、`try_into_mut` で、`BytesMut` に戻せる。

```rust
use bytes::Bytes;

fn main() {
    let bytes = Bytes::from(vec![1, 2, 3]);
    let shared = bytes.clone();

    // 参照が 2 つあるため、戻せない (元の Bytes が、Err で返る)
    let bytes = match bytes.try_into_mut() {
        Ok(_) => unreachable!(),
        Err(b) => b,
    };

    // 片方を破棄すると、参照が 1 つになり、戻せる
    drop(shared);
    println!("{}", bytes.try_into_mut().is_ok());
}
```

```text
true
```

### from_owner で外部のメモリを包む

`Bytes::from_owner` を使うと、`AsRef<[u8]>` を実装した、任意の型を、`Bytes` として扱える。メモリマップしたファイルなどを、コピーせずに、共有する用途がある。

```rust
use bytes::Bytes;

// 独自のバッファを持つ、所有者の型
struct Owner(Vec<u8>);

impl AsRef<[u8]> for Owner {
    fn as_ref(&self) -> &[u8] {
        &self.0
    }
}

fn main() {
    let owner = Owner(vec![10, 20, 30, 40]);

    // 所有者を、Bytes に包む (所有者は、最後の参照が消えるまで、生きる)
    let bytes = Bytes::from_owner(owner);
    let part = bytes.slice(1..3);
    println!("{:?}", &part[..]);
}
```

```text
[20, 30]
```

<pre><code class="tips">from_owner に渡す型は、Send であり、'static である必要がある。借用を含む型は、渡せない。
from_owner は、1.9 で追加された。それ以前は、独自に、Bytes の内部の仕組みを、作る必要があった。</code></pre>

---

## BytesMut <a id="bytes-mut" data-name="BytesMut"></a>

`BytesMut` は、書き込み用のバッファで、`Vec<u8>` に似ている。違いは、`split` 系のメソッドで、**コピーなしで、バッファを分割できる**点である。

### 作り方

| 関数 | 内容 |
| --- | --- |
| `BytesMut::new()` | 空のバッファ |
| `BytesMut::with_capacity(n)` | 容量 `n` を、確保したバッファ |
| `BytesMut::zeroed(n)` | 長さ `n` の、ゼロで埋めたバッファ |
| `BytesMut::from(&[u8])` | スライスの内容を、コピーして作る |

### 書き込み

```rust
use bytes::{BufMut, BytesMut};

fn main() {
    let mut buf = BytesMut::new();

    // extend_from_slice は、Vec と同じ名前で、末尾に追加する
    buf.extend_from_slice(b"abc");

    // BufMut の、put_* でも、書き込める
    buf.put_u8(b'd');

    // 長さを広げて、ゼロで埋める
    buf.resize(6, 0);

    println!("{:?} len={}", buf, buf.len());
}
```

```text
b"abcd\x00\x00" len=6
```

### 分割

| メソッド | 内容 |
| --- | --- |
| `split()` | 全体を、返す。自身は、空になる (残りの容量は、自身に残る) |
| `split_to(at)` | 先頭の `at` バイトを、返す |
| `split_off(at)` | `at` 以降を、返す |
| `unsplit(other)` | `split` したバッファを、元に戻して、つなげる |
| `try_unsplit(other)` | つなげられない場合に、panic せず、結果を返す (1.12 で追加) |
| `freeze()` | 読み取り専用の `Bytes` にする (コピーしない) |

```rust
use bytes::BytesMut;

fn main() {
    let mut buf = BytesMut::from(&b"hello world"[..]);

    // " world" を切り離す
    let tail = buf.split_off(5);
    println!("{:?} {:?}", buf, tail);

    // 連続していれば、コピーなしで、元に戻る
    buf.unsplit(tail);
    println!("{:?}", buf);

    // 先頭の 5 バイトを取り出し、残りを、すべて取り出す
    let head = buf.split_to(5);
    let rest = buf.split();
    println!("{:?} {:?} {}", head, rest, buf.len());
}
```

```text
b"hello" b" world"
b"hello world"
b"hello" b" world" 0
```

### 追記の補助 (1.12)

| メソッド | 内容 |
| --- | --- |
| `extend_from_within(range)` | 自身の一部を、末尾に、複製して追加する |
| `try_unsplit(other)` | `unsplit` の、失敗しない版 |

<pre><code class="caution">freeze した後は、BytesMut に戻して、書き込むことはできない。書き続けたい場合は、freeze しないか、try_into_mut で戻す。
split_to と split_off は、範囲外で panic する。長さを、事前に確認する。</code></pre>

<pre><code class="tips">BytesMut は、std::fmt::Write を実装している。write! マクロで、書式つきの文字列を、そのまま書き込める。
BytesMut は、書き込むと、自動で容量が増える。with_capacity は、上限ではなく、初期の確保量である。</code></pre>

---

## Buf (読み取り) <a id="buf" data-name="Buf"></a>

`Buf` は、バイト列を、先頭から順に読むための trait である。読むたびに、内部の**カーソル**が、進む。`&[u8]`、`Bytes`、`BytesMut` などが、実装している。

### 基本のメソッド

| メソッド | 内容 |
| --- | --- |
| `remaining()` | 残りのバイト数 |
| `has_remaining()` | 残りが、あるか |
| `chunk()` | 現在位置から続く、連続したスライス (全体とは限らない) |
| `advance(cnt)` | カーソルを、`cnt` バイト進める |
| `copy_to_slice(dst)` | 残りから、`dst` の長さ分を、コピーする |
| `copy_to_bytes(len)` | 先頭の `len` バイトを、`Bytes` として取り出す |

### 数値の読み取り

```rust
use bytes::Buf;

fn main() {
    // &[u8] は、Buf を実装している。カーソルを進めるため、mut が必要
    let mut data: &[u8] = &[0x00, 0x01, 0xff, 0x02, b'a', b'b'];

    let id = data.get_u16();    // ビッグエンディアンで、2 バイト読む
    let flag = data.get_u8();   // 1 バイト読む
    let len = data.get_u8() as usize;
    let name = data.copy_to_bytes(len);

    println!("{} {} {} {:?}", id, flag, len, name);
    println!("残り: {}", data.remaining());
}
```

```text
1 255 2 b"ab"
残り: 0
```

### 失敗しない読み取り

`get_*` は、残りが足りないと、**panic する**。外部のデータを読むときは、`try_get_*` を使うと、`Result` で、結果を受け取れる。

```rust
use bytes::Buf;

fn main() {
    let mut data: &[u8] = &[0x01];

    // 残りが 1 バイトしかないため、2 バイトの読み取りは、失敗する
    match data.try_get_u16() {
        Ok(v) => println!("値: {}", v),
        Err(_) => println!("データが不足している"),
    }
}
```

```text
データが不足している
```

| メソッド | 残りが足りないとき |
| --- | --- |
| `get_u16()` など | panic する |
| `try_get_u16()` など | `Err(TryGetError)` を返す (1.10 で追加) |

<pre><code class="caution">get_u32 や copy_to_bytes は、残りが足りないと panic する。ネットワークから受け取ったデータには、remaining の確認か、try_get_* を使う。
chunk は、残りの全体を返すとは限らない。バッファが、複数の断片に分かれている場合、先頭の断片だけを返す。全体が必要なら、copy_to_bytes を使う。</code></pre>

<pre><code class="tips">&amp;[u8] に対して get_* を呼ぶと、スライス自体が、短くなっていく。元のスライスを残したいときは、先に、コピー (let mut view = data;) を作る。
try_get_* は、1.10 で追加された。それ以前のバージョンでは、remaining で、確認してから読む。</code></pre>

---

## BufMut (書き込み) <a id="buf-mut" data-name="BufMut"></a>

`BufMut` は、バイト列へ、順に書き込むための trait である。`BytesMut`、`Vec<u8>`、`&mut [u8]` などが、実装している。

### 基本のメソッド

| メソッド | 内容 |
| --- | --- |
| `remaining_mut()` | 書き込める、残りのバイト数 |
| `put_slice(src)` | スライスを、書き込む |
| `put(buf)` | `Buf` の内容を、すべて書き込む |
| `put_u8(n)` | 1 バイト書き込む |
| `put_bytes(val, cnt)` | `val` を、`cnt` 回、書き込む |
| `limit(n)` | 書き込める量を、`n` に制限する |

### 数値の書き込み

```rust
use bytes::BufMut;

fn main() {
    // Vec<u8> は、BufMut を実装している
    let mut out: Vec<u8> = Vec::new();

    out.put_u32(0xdeadbeef);   // ビッグエンディアンで、4 バイト
    out.put_u16_le(1);         // リトルエンディアンで、2 バイト
    out.put_bytes(0, 2);       // ゼロを 2 バイト

    println!("{:02x?}", out);
}
```

```text
[de, ad, be, ef, 01, 00, 00, 00]
```

### 書き込み先ごとの違い

| 書き込み先 | 容量が足りないとき |
| --- | --- |
| `BytesMut` | 自動で、容量を増やす |
| `Vec<u8>` | 自動で、容量を増やす |
| `&mut [u8]` | panic する (固定の長さのため) |
| `Limit` | 制限を超えると、panic する |

```rust
use bytes::BufMut;

fn main() {
    let mut array = [0u8; 4];

    // 固定長のスライスに、書き込む
    let mut writer = &mut array[..];
    writer.put_u16(0x0102);
    println!("残り: {}", writer.remaining_mut());
    writer.put_u16(0x0304);

    println!("{:?}", array);
}
```

```text
残り: 2
[1, 2, 3, 4]
```

<pre><code class="caution">固定長の、&amp;mut [u8] に、容量を超えて書き込むと、panic する。書き込み前に、remaining_mut で確認する。
BytesMut の remaining_mut は、非常に大きな値を返す。書き込める量の、上限の確認には使えない。</code></pre>

<pre><code class="tips">書き込める量に、上限を設けたいときは、limit で、BufMut を包む。上限を超えた書き込みを、早い段階で検出できる。
Vec&lt;u8&gt; も BufMut を実装しているため、書き込み用の関数は、&amp;mut impl BufMut を受け取ると、型を問わず使える。</code></pre>

---

## 数値とエンディアン <a id="endian" data-name="数値とエンディアン"></a>

`Buf` と `BufMut` は、整数や浮動小数点数を、読み書きするメソッドを、持つ。**接尾辞なしは、ビッグエンディアン**である。

### 名前の規則

| 接尾辞 | バイト順 | 例 |
| --- | --- | --- |
| (なし) | ビッグエンディアン (ネットワークバイトオーダー) | `get_u16`、`put_u16` |
| `_le` | リトルエンディアン | `get_u16_le`、`put_u16_le` |
| `_ne` | 実行環境の、ネイティブ | `get_u16_ne`、`put_u16_ne` |

### 対応する型

| 種類 | メソッド (読み取り) | メソッド (書き込み) |
| --- | --- | --- |
| 符号なし整数 | `get_u8`、`get_u16`、`get_u32`、`get_u64`、`get_u128` | `put_u8` ほか、同様 |
| 符号つき整数 | `get_i8`、`get_i16`、`get_i32`、`get_i64`、`get_i128` | `put_i8` ほか、同様 |
| 浮動小数点数 | `get_f32`、`get_f64` | `put_f32`、`put_f64` |
| 任意の長さの整数 | `get_uint(nbytes)`、`get_int(nbytes)` | `put_uint(n, nbytes)`、`put_int(n, nbytes)` |

```rust
use bytes::{Buf, BufMut, BytesMut};

fn main() {
    let mut buf = BytesMut::new();

    // 3 バイトの整数 (24 ビット) を、ビッグエンディアンで書く
    buf.put_uint(0x010203, 3);
    // 浮動小数点数は、リトルエンディアンで書く
    buf.put_f32_le(1.5);

    let mut view = &buf[..];
    let a = view.get_uint(3);
    let b = view.get_f32_le();
    println!("{:#x} {}", a, b);
}
```

```text
0x10203 1.5
```

| 比較 | 内容 |
| --- | --- |
| `Buf::get_u16()` | `from_be_bytes` と、同じ結果 |
| `Buf::get_u16_le()` | `from_le_bytes` と、同じ結果 |
| `byteorder` crate | 同じ目的の、別の crate (関連 crate の章を参照) |

<pre><code class="caution">put_u16 や get_u16 は、ビッグエンディアンである。リトルエンディアンのプロトコルでは、_le を付けるのを、忘れない。
get_uint や put_uint の nbytes は、8 以下である。範囲外は、panic する。</code></pre>

---

## 分割と共有 <a id="split-share" data-name="分割と共有"></a>

bytes の中心は、**コピーせずに、メモリを分けて共有する**仕組みである。

### 全体の流れ

```text
BytesMut (書き込み)
    │ put_*
    ▼
BytesMut ──freeze──▶ Bytes ──clone / slice──▶ Bytes, Bytes, ...
                       ▲                         │
                       └──try_into_mut───────────┘ (参照が 1 つのときだけ)
```

### 操作ごとの、コピーの有無

| 操作 | コピー | 内容 |
| --- | --- | --- |
| `Bytes::clone` | しない | 参照カウントを、増やす |
| `Bytes::slice` | しない | 同じメモリの、一部を指す |
| `Bytes::split_to`、`split_off` | しない | 同じメモリを、2つに分ける |
| `BytesMut::freeze` | しない | 型を、変えるだけ |
| `BytesMut::split`、`split_to`、`split_off` | しない | 同じメモリを、分ける |
| `BytesMut::unsplit` | 連続していれば、しない | 連続していなければ、コピーして、つなげる |
| `Bytes::copy_from_slice` | **する** | 新しいメモリを、確保する |

### 受信バッファから、メッセージを切り出す

```rust
use bytes::{Bytes, BytesMut};

fn main() {
    let mut buf = BytesMut::from(&b"GET /index.html HTTP/1.1\r\nHost: example"[..]);

    // 先頭の行を、コピーせずに、切り出す
    let pos = buf.iter().position(|&b| b == b'\n').unwrap();
    let line: Bytes = buf.split_to(pos + 1).freeze();

    println!("{:?}", line);
    println!("残り: {:?}", buf);
}
```

```text
b"GET /index.html HTTP/1.1\r\n"
残り: b"Host: example"
```

<pre><code class="tips">受信用の BytesMut に、データを溜め、完成したメッセージを、split_to で切り出し、freeze して、他のタスクへ渡す。受信バッファ自体は、再利用できる。
切り出した Bytes が、すべて破棄されるまで、元のメモリは、解放されない。長期間、保持する Bytes は、コピーして、切り離すことも、検討する。</code></pre>

---

## アダプタ <a id="adapter" data-name="アダプタ"></a>

`Buf` と `BufMut` には、別の形に変える、アダプタがある。

### 一覧

| アダプタ | 元の trait | 内容 |
| --- | --- | --- |
| `chain(next)` | `Buf` | 2つの `Buf` を、つなげて、1つの `Buf` にする |
| `take(limit)` | `Buf` | 先頭の `limit` バイトだけを、読む `Buf` にする |
| `reader()` | `Buf` | `std::io::Read` を実装する、型にする |
| `limit(n)` | `BufMut` | 書き込める量を、`n` に制限する |
| `writer()` | `BufMut` | `std::io::Write` を実装する、型にする |

### chain と take

```rust
use bytes::Buf;

fn main() {
    // 2 つの断片を、つなげて、1 つの Buf として読む (コピーしない)
    let first: &[u8] = b"hello ";
    let second: &[u8] = b"world";
    let mut chained = first.chain(second);

    let all = chained.copy_to_bytes(chained.remaining());
    println!("{:?}", all);

    // 先頭の 3 バイトだけを、読む
    let data: &[u8] = b"abcdef";
    let mut limited = data.take(3);
    println!("{} {:?}", limited.remaining(), limited.copy_to_bytes(3));
}
```

```text
b"hello world"
3 b"abc"
```

### reader と writer

標準の `Read` や `Write` を要求する API に、`Buf` や `BufMut` を渡したいときに使う。

```rust
use bytes::{Buf, BufMut, BytesMut};
use std::io::{Read, Write};

fn main() -> std::io::Result<()> {
    // Buf を、Read として使う
    let mut reader = (&b"hello"[..]).reader();
    let mut text = String::new();
    reader.read_to_string(&mut text)?;
    println!("{}", text);

    // BufMut を、Write として使う
    let mut writer = BytesMut::new().writer();
    writer.write_all(b"written")?;
    let buf = writer.into_inner();
    println!("{:?}", buf);

    Ok(())
}
```

```text
hello
b"written"
```

<pre><code class="caution">Read と Write の操作は、I/O エラーを返しうるが、Buf と BufMut は、失敗しない設計になっている。writer で書き込む先が BytesMut のときは、容量が自動で増えるため、実質的に、失敗しない。
chain で作った Buf の chunk は、先頭の断片だけを返す。全体を扱うには、copy_to_bytes などを使う。</code></pre>

---

## 容量とメモリ <a id="capacity" data-name="容量とメモリ"></a>

### 容量の操作

| メソッド | 内容 |
| --- | --- |
| `capacity()` | 再確保なしで、書き込める、全体の大きさ |
| `len()` | 現在の、データの長さ |
| `reserve(additional)` | 追加で、`additional` バイト分の空きを、確保する |
| `try_reserve(additional)` | `reserve` の、失敗を返す版 |
| `clear()` | 長さを 0 にする (容量は、残る) |
| `truncate(len)` | 長さを、切り詰める |

```rust
use bytes::BytesMut;

fn main() {
    let mut buf = BytesMut::with_capacity(8);
    println!("len={} cap>={}", buf.len(), buf.capacity() >= 8);

    // 空きが足りなければ、再確保や、領域の再利用が、行われる
    buf.reserve(1024);
    println!("cap>={}", buf.capacity() >= 1024);
}
```

```text
len=0 cap>=true
cap>=true
```

### メモリが解放されるタイミング

| 状況 | 内容 |
| --- | --- |
| `Bytes` の clone が、すべて破棄された | 元のメモリが、解放される |
| 一部の `Bytes` だけが、残っている | **元の、大きなバッファ全体が、残る** |
| `BytesMut` を `split` した | 分けた片方が残っている間は、同じメモリが、使われる |
| `reserve` | 未使用の容量が、そのまま保持される保証は、ない |

<pre><code class="caution">reserve は、未使用の容量を、保持することを保証しない。呼び出しの前後で、容量が、同じ領域であることを前提にしない。
長さフィールドなどの、外部から来た値を、そのまま reserve に渡すと、巨大な確保を、強制される。上限を決めて、確認してから、確保する。</code></pre>

<pre><code class="tips">長く保持する、小さなデータは、Bytes::copy_from_slice で、コピーして、元の大きなバッファから、切り離す。
受信バッファを、繰り返し使う場合は、reserve で、必要な空きを、確保してから、読み込みを行う。</code></pre>

---

## 他の crate との連携 <a id="integration" data-name="他crateとの連携"></a>

### 標準ライブラリとの連携

| 対象 | 方法 |
| --- | --- |
| `std::io::Read` | `Buf::reader()` |
| `std::io::Write` | `BufMut::writer()` |
| `std::fmt::Write` | `BytesMut` が、直接実装している (`write!` を使える) |
| `&[u8]`、`Vec<u8>` | `Buf`、`BufMut` を、実装している |
| `String` へ変換 | `String::from_utf8_lossy(&bytes)` |

```rust
use bytes::BytesMut;
use std::fmt::Write;

fn main() {
    let mut buf = BytesMut::new();

    // fmt::Write を使い、書式つきで書き込む
    write!(buf, "{}-{}", 12, 34).unwrap();
    println!("{:?}", buf);
}
```

```text
b"12-34"
```

### Tokio との連携

Tokio の `AsyncReadExt::read_buf` は、`BufMut` を受け取り、読み込んだデータを、そのまま追記する。

```rust
use bytes::BytesMut;
use tokio::{io::AsyncReadExt, net::TcpStream};

async fn read_some(stream: &mut TcpStream) -> std::io::Result<BytesMut> {
    let mut buf = BytesMut::with_capacity(4096);

    // 読み込んだバイト数が返る。0 なら、接続が閉じられた
    let n = stream.read_buf(&mut buf).await?;
    println!("{} バイト読んだ", n);

    Ok(buf)
}
```

必要なフィーチャーは、tokio の `net`、`io-util` である。

### 他の crate での、Bytes

| crate | 使われ方 |
| --- | --- |
| `tokio-util` | `Decoder` と `Encoder` が、`BytesMut` を扱う |
| `http`、`http-body-util` | リクエストとレスポンスの、本体が `Bytes` |
| `hyper` | HTTP の本体の、データの単位が `Bytes` |
| `axum` | `Bytes` を、リクエスト本体の抽出に使える (axum のドキュメントを参照) |
| `prost` | Protocol Buffers の、エンコードとデコードに、`Buf` と `BufMut` を使う |
| `serde` | `serde` フィーチャーで、`Bytes` を、シリアライズできる (serde のドキュメントを参照) |

<pre><code class="tips">Tokio の、ネットワーク処理では、受信バッファを BytesMut にして、read_buf で読み込む方法が、標準的である。
tokio-util の Decoder は、decode の中で、BytesMut の先頭を、split_to で切り出す形で、実装する。</code></pre>

---

## 実践例 <a id="practice" data-name="実践例"></a>

### 長さつきフレームの、エンコードとデコード

先頭に 4 バイトの長さを持つ、フレームの、読み書きの例。受信が途中で切れた場合に、続きを待つ。

```rust
use bytes::{Buf, BufMut, Bytes, BytesMut};

// 長さ (4 バイト、ビッグエンディアン) と、本体を書き込む
fn encode(payload: &[u8], dst: &mut BytesMut) {
    dst.reserve(4 + payload.len());
    dst.put_u32(payload.len() as u32);
    dst.put_slice(payload);
}

// 1 フレーム分が揃っていれば、本体を取り出す。足りなければ、None を返す
fn decode(src: &mut BytesMut) -> Option<Bytes> {
    if src.len() < 4 {
        return None;
    }

    // 長さは、読み取るだけで、カーソルは進めない
    let len = u32::from_be_bytes([src[0], src[1], src[2], src[3]]) as usize;
    if src.len() < 4 + len {
        // 続きを待つため、必要な分の空きを、確保する
        src.reserve(4 + len - src.len());
        return None;
    }

    // 長さの部分を捨て、本体を、コピーせずに切り出す
    src.advance(4);
    Some(src.split_to(len).freeze())
}

fn main() {
    let mut buf = BytesMut::new();
    encode(b"hello", &mut buf);
    encode(b"world", &mut buf);

    // 末尾の 3 バイトを切り離して、受信が途中で切れた状態を、作る
    let tail = buf.split_off(buf.len() - 3);

    println!("{:?}", decode(&mut buf));
    println!("{:?}", decode(&mut buf));

    // 続きが届いたので、つなげる
    buf.unsplit(tail);
    println!("{:?}", decode(&mut buf));
}
```

```text
Some(b"hello")
None
Some(b"world")
```

### tokio-util の Codec にする

上の関数は、tokio-util の、`Decoder` と `Encoder` から、そのまま呼び出せる。

```rust
use bytes::{Bytes, BytesMut};
use tokio_util::codec::{Decoder, Encoder};

// encode と decode は、上の例の関数
struct FrameCodec;

impl Decoder for FrameCodec {
    type Item = Bytes;
    type Error = std::io::Error;

    fn decode(&mut self, src: &mut BytesMut) -> Result<Option<Bytes>, Self::Error> {
        Ok(decode(src))
    }
}

impl Encoder<Bytes> for FrameCodec {
    type Error = std::io::Error;

    fn encode(&mut self, item: Bytes, dst: &mut BytesMut) -> Result<(), Self::Error> {
        encode(&item, dst);
        Ok(())
    }
}
```

<pre><code class="caution">この Codec のコードは、コンパイルして確認していない。tokio-util の Decoder と Encoder の、シグネチャは、バージョンで変わることがある。docs.rs で、確認する。
長さを信頼して、reserve する実装では、巨大な長さを、送りつけられると、大量のメモリを確保させられる。実用では、フレームの最大の長さを、決めて、確認する。</code></pre>

<pre><code class="tips">長さつきフレームの処理は、tokio-util の LengthDelimitedCodec が、用意されている。独自の形式が必要でなければ、これを使う方が、安全である。
このフレームの形式は、説明用に、簡略化している。バージョンや、チェックサムの欄は、持たない。</code></pre>

---

## テスト <a id="test" data-name="テスト"></a>

### 単体テスト

`Bytes` は、`&[u8]` や `Vec<u8>` と、比較できる。

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use bytes::{Bytes, BytesMut};

    #[test]
    fn roundtrip() {
        let mut buf = BytesMut::new();
        encode(b"hello", &mut buf);

        let frame = decode(&mut buf).unwrap();
        assert_eq!(frame, &b"hello"[..]);
        // 読み終えたので、バッファは空になる
        assert!(buf.is_empty());
    }

    #[test]
    fn partial_frame_returns_none() {
        let mut buf = BytesMut::new();
        encode(b"hello", &mut buf);
        // 途中までしか届いていない状態を、作る
        buf.truncate(6);

        assert!(decode(&mut buf).is_none());
        // 未完成のデータは、消費されない
        assert_eq!(buf.len(), 6);
    }

    #[test]
    #[should_panic]
    fn get_beyond_remaining_panics() {
        use bytes::Buf;
        let mut data: &[u8] = &[1];
        // 残りが足りない読み取りは、panic する
        let _ = data.get_u32();
    }

    #[test]
    fn slice_shares_memory() {
        let bytes = Bytes::from_static(b"hello world");
        let part = bytes.slice(6..);
        assert_eq!(part, &b"world"[..]);
    }
}
```

### テストの方針

| 対象 | 方法 |
| --- | --- |
| エンコードとデコード | 往復して、元に戻ることを確認する |
| 途中で切れた入力 | 1 バイトずつ、増やしながら、`None` や不足を、確認する |
| 不正な入力 | 長さが、実際より大きい、ゼロなどの、値を与える |
| 境界 | 空のバッファ、ちょうど 1 フレーム、複数のフレームを与える |
| panic | `get_*` の、範囲外の読み取りは、`#[should_panic]` で確認する |

<pre><code class="tips">受信バッファを使うコードは、1 バイトずつ、データを渡して、デコードを繰り返すテストを書くと、途中で切れた場合の、不具合を見つけやすい。
Rust のテスト全般は、「Rustのテスト」のドキュメントを参照。</code></pre>

---

## 古いコードからの変更 <a id="migration" data-name="古いコードからの変更"></a>

bytes の API は、0.4 から 0.5、1.0 で、大きく変わった。古い記事のコードを、読み替えるときの目安である。

| 古い書き方 | 現在 | 備考 |
| --- | --- | --- |
| `Buf::bytes()` | `Buf::chunk()` | 名前が、変わった |
| `BufMut::bytes_mut()` | `BufMut::chunk_mut()` | 名前が、変わった |
| `IntoBuf` trait | 廃止。`Buf` を、直接使う | 0.5 ごろ |
| `get_u16::<BigEndian>()` のような、型パラメータ指定 | `get_u16()`、`get_u16_le()` | 0.5 ごろ。接尾辞で、バイト順を指定する |
| `remaining` で確認してから、`get_*` | `try_get_*` | 1.10 で追加 |
| 外部のメモリを、独自に包む | `Bytes::from_owner` | 1.9 で追加 |
| 自身の一部を、取り出して、追記する | `BytesMut::extend_from_within` | 1.12 で追加 |
| `unsplit` の、panic の可能性 | `BytesMut::try_unsplit` | 1.12 で追加 |
| 1.2.1〜1.11.0 の `BytesMut::reserve` | 1.11.1 以降へ更新 | 整数オーバーフローの修正 (CVE-2026-25541) |

<pre><code class="caution">この表の、バージョンの境目は、おおよその目安である。1.9、1.10、1.11、1.12 の変更は、リリースノートで確認したが、0.4 から 0.5 への変更は、記憶に基づく。
正確な変更は、tokio-rs/bytes の CHANGELOG で確認する。検索で出てくる記事の多くは、古い。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `get_u32` などで panic する | 残りのバイト数が、足りない | `remaining()` で確認する。または、`try_get_*` を使う |
| `split_to` や `slice` で panic する | 範囲が、長さを超えている | 長さを、事前に確認する |
| 小さな `Bytes` を持つだけで、メモリが増える | 切り出した元の、大きなバッファ全体が、残っている | `Bytes::copy_from_slice` で、コピーして切り離す |
| 巨大なメモリを、確保させられる | 外部から来た長さを、そのまま `reserve` に渡している | 最大の長さを決め、超えたら、接続を閉じる |
| `freeze` した後に、書き込めない | `Bytes` は、読み取り専用 | 書き続けるなら、`freeze` しない。または、`try_into_mut` で戻す |
| `try_into_mut` が、`Err` になる | 他にも、同じバッファを共有する `Bytes` がある | 他の参照を破棄してから、呼ぶ |
| `chunk()` の内容が、一部しかない | `Buf` が、複数の断片で、構成されている | `copy_to_bytes` や `copy_to_slice` を使う |
| 数値が、逆の順序で読める | バイト順の、指定の誤り (`put_u16` は、ビッグエンディアン) | リトルエンディアンには、`_le` を付ける |
| `&mut [u8]` への書き込みで panic する | 固定長で、容量が足りない | `remaining_mut()` で確認する。または、`BytesMut` を使う |
| `{:?}` の表示が、文字列にならない | `Bytes` の `Debug` は、`b"..."` の形式 | `String::from_utf8_lossy(&bytes)` を使う |
| `reserve` の後の容量が、期待と違う | `reserve` は、未使用の容量の保持を、保証しない | 容量の再利用を、前提にしない |
| 依存の脆弱性の警告が出る | 1.11.1 より前の bytes を、使っている | `cargo update -p bytes` で、更新する |
| 複数のバージョンの bytes が、ビルドされる | 依存の crate ごとに、要求するバージョンが、違う | `cargo tree -d` で確認し、バージョンを揃える |

---

## 関連 crate <a id="ecosystem" data-name="関連crate"></a>

| crate | 用途 |
| --- | --- |
| `tokio` | 非同期ランタイム。`read_buf` などで、`BufMut` を使う (Tokio のドキュメントを参照) |
| `tokio-util` | `Decoder`、`Encoder`、`LengthDelimitedCodec` |
| `http`、`http-body-util` | HTTP の型と、本体の扱い |
| `hyper` | HTTP のクライアントと、サーバー |
| `axum` | Web フレームワーク (axum のドキュメントを参照) |
| `prost` | Protocol Buffers |
| `serde` | シリアライズ (serde のドキュメントを参照) |
| `byteorder` | 数値の、バイト順を指定した、読み書き |
| `bytestring` | `Bytes` を土台にした、UTF-8 の文字列型 |
| `memmap2` | メモリマップ。`Bytes::from_owner` と、組み合わせる用途がある |
| `anyhow`、`thiserror` | エラー処理 (それぞれのドキュメントを参照) |

<pre><code class="tips">数値の読み書きだけが目的なら、bytes がなくても、標準ライブラリの from_be_bytes と to_be_bytes で、足りる。
bytes が必要になるのは、バッファを、コピーせずに、共有、分割したいときである。</code></pre>
