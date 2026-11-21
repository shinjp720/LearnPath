---
title: windows
layout: default
---

# windows <a id="top" data-name="TOP"></a>

windows は、Rust から、Windows の API を呼び出すための crate。Microsoft が公開している、Rust for Windows (windows-rs) プロジェクトの、中心になる crate である。Win32、COM、WinRT の、3種類の API を、1つの crate で扱える。

API の定義は、Windows の API を記述した、メタデータから、生成される。そのため、過去の API だけでなく、将来追加される API にも、同じ方法で対応できる。使いたい API は、**Cargo のフィーチャー**で、有効にする。

| 種類 | 内容 | 主な名前空間 |
| --- | --- | --- |
| Win32 | C 言語ベースの、従来の Windows API | `Win32::*` |
| COM | インターフェースと参照カウントによる、オブジェクトの仕組み | `Win32::System::Com` ほか |
| WinRT | Windows Runtime。モダンな Windows API | `Data::*`、`Storage::*` ほか |

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 網羅性 | メタデータから生成されるため、Windows API のほぼ全体を、呼び出せる |
| 型の安全性 | ハンドル、フラグ、エラーコードが、専用の型になる |
| Rust らしい戻り値 | 失敗しうる API は、`Result` を返す |
| フィーチャーによる選択 | 使う API だけを、有効にできる。ビルド時間を、抑えられる |
| COM と WinRT の、ラッパー | 参照カウント、`QueryInterface`、`Drop` が、自動で扱われる |
| 実装の提供 | `implement` フィーチャーで、COM インターフェースを、Rust で実装できる |

### 他の選択肢との比較

| | `windows` | `windows-sys` | `winapi` |
| --- | --- | --- | --- |
| 位置づけ | 高レベルの、投影 (projection) | 生の、低レベルのバインディング | 古くからある、バインディング |
| 戻り値 | `Result` に変換される | 生の値のまま | 生の値のまま |
| 文字列 | `PCWSTR`、`HSTRING`、`w!` など | 生のポインタ (`*const u16`) | 生のポインタ |
| COM、WinRT | 対応 | 対象外 | COM のみ (限定的) |
| ビルドの重さ | 重め (フィーチャーで調整) | 軽い | 中程度 |
| 保守 | Microsoft が、継続して更新 | Microsoft が、継続して更新 | 新規の更新は、少ない |

windows と windows-sys は、同じ windows-rs リポジトリで、公開されている。<a href="#sys-link">windows-sys と windows-link</a>の章で、使い分けを説明する。

### 向いている場面

| 向いている | 向いていない |
| --- | --- |
| Win32 / COM / WinRT を、まとめて使うアプリケーション | Windows 以外でも、動くコードだけを書く場合 |
| `Result` で、エラーを扱いたい場合 | ビルド時間を、最小にしたいライブラリ (windows-sys を検討する) |
| COM のオブジェクトを、安全に扱いたい場合 | 高レベルの、GUI フレームワークが欲しい場合 (iced、egui、Tauri などを検討する) |

<pre><code class="caution">windows は、バージョンごとに、破壊的変更が入る。古い記事のコード (build! マクロ、Windows:: で始まるパスなど) は、そのままでは動かない。
このドキュメントは、windows 0.62 (2026年11月時点) を前提にしている。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

### 追加

```bash
cargo add windows --features Win32_UI_WindowsAndMessaging
```

```toml
[dependencies.windows]
version = "0.62"   # cargo add が、最新のバージョンを入れる
features = [
    "Win32_Foundation",
    "Win32_UI_WindowsAndMessaging",
]
```

- windows は、`0.x` の、バージョンである。**マイナーバージョンの更新が、破壊的変更になる**。
- 最新のバージョンは、docs.rs で確認する。このドキュメントの執筆時は、0.62.2 だった。

<pre><code class="tips">ライブラリを公開する場合は、バージョンの範囲を、指定すると、依存グラフで、複数のバージョンが、重複するのを避けられる。
例: version = "&gt;=0.59, &lt;=0.62"。アプリケーションでは、通常のバージョン指定でよい。</code></pre>

### フィーチャー

API は、名前空間のパスを、アンダースコアでつないだ名前の、フィーチャーで、有効にする。

| API の名前空間 | フィーチャー |
| --- | --- |
| `Win32::Foundation` | `Win32_Foundation` |
| `Win32::UI::WindowsAndMessaging` | `Win32_UI_WindowsAndMessaging` |
| `Win32::System::Threading` | `Win32_System_Threading` |
| `Win32::System::Com` | `Win32_System_Com` |
| `Data::Xml::Dom` | `Data_Xml_Dom` |

必要なフィーチャーは、次の方法で調べる。

| 方法 | 内容 |
| --- | --- |
| フィーチャー検索 | windows-rs の、公式のフィーチャー検索ページで、API 名から、必要なフィーチャーを探す |
| docs.rs | 各項目のページに、「Available on crate features ... only」と表示される |
| コンパイルエラー | 「could not find ... in ...」と出たら、フィーチャーの不足を疑う |

<pre><code class="tips">フィーチャーは、型ごとに、依存関係がある。HWND を使う API を呼ぶなら、Win32_Foundation も必要になることが多い。
コンパイルエラーが出たら、docs.rs の、該当の項目で、必要なフィーチャーの一覧を確認する。</code></pre>

### 対象の環境

| 項目 | 内容 |
| --- | --- |
| ターゲット | `x86_64-pc-windows-msvc`、`aarch64-pc-windows-msvc`、`i686-pc-windows-msvc`、`*-pc-windows-gnu` など |
| 最小の Rust のバージョン | バージョンごとに異なる。docs.rs や、`Cargo.toml` の `rust-version` で確認する |
| Windows 以外 | Windows 以外でも、ビルド自体はできる (API の呼び出しは、Windows 上のみ) |

---

## 基本 <a id="basic" data-name="基本"></a>

### 最小の例

メッセージボックスを、表示する例。

```rust
use windows::{
    core::*,
    Win32::System::SystemInformation::GetTickCount64,
    Win32::UI::WindowsAndMessaging::*,
};

fn main() -> Result<()> {
    // OS の起動からの経過時間 (ミリ秒) を取得する
    let tick = unsafe { GetTickCount64() };
    println!("起動からの経過: {} ms", tick);

    // 文字列リテラルは、w! マクロで、UTF-16 の PCWSTR にする
    unsafe {
        MessageBoxW(None, w!("本文"), w!("題名"), MB_OK);
    }

    Ok(())
}
```

必要なフィーチャーは、`Win32_System_SystemInformation` と `Win32_UI_WindowsAndMessaging` である。

```text
起動からの経過: 12345678 ms
```

### 基本の流れ

| 手順 | 内容 |
| --- | --- |
| 1 | 使う API を、docs.rs などで探し、必要なフィーチャーを調べる |
| 2 | `Cargo.toml` に、フィーチャーを追加する |
| 3 | `use windows::{core::*, Win32::...}` で、型と関数を、取り込む |
| 4 | Win32 の関数は、`unsafe` で、呼び出す |
| 5 | 戻り値の `Result` を、`?` で、伝える |

### 主要なモジュール

| モジュール | 内容 |
| --- | --- |
| `windows::core` | `Result`、`Error`、`HRESULT`、`HSTRING`、`PCWSTR`、`w!` など、共通の型 |
| `windows::Win32` | Win32 と COM の API |
| `windows::Win32::Foundation` | `HWND`、`HANDLE`、`BOOL`、`WIN32_ERROR` など、基本の型 |
| `windows::Foundation` | WinRT の基本の型 (`Uri`、`TimeSpan` など) |
| `windows::Data`、`windows::Storage` ほか | WinRT の、名前空間 |

<pre><code class="caution">Win32 の関数は、ほとんどが unsafe である。ポインタの有効性、バッファの大きさ、スレッドの規則は、呼び出す側が保証する。
unsafe のブロックは、できるだけ小さくして、安全なラッパー関数に、閉じ込める。</code></pre>

---

## 型 (Types) <a id="types" data-name="型"></a>

Windows の、さまざまな値は、専用の型になっている。多くは、中身を1つ持つだけの、タプル構造体 (newtype) である。

### 主な型

| 型 | 内容 |
| --- | --- |
| `HWND` | ウィンドウのハンドル |
| `HANDLE` | カーネルオブジェクトのハンドル (ファイル、イベント、プロセスなど) |
| `HMODULE`、`HINSTANCE` | モジュール (実行ファイル、DLL) のハンドル |
| `BOOL` | Win32 の真偽値 (32 ビットの整数) |
| `HRESULT` | COM の、結果コード |
| `WIN32_ERROR` | Win32 の、エラーコード |
| `WPARAM`、`LPARAM`、`LRESULT` | ウィンドウメッセージの、引数と、戻り値 |
| `GUID` | 識別子 (COM のクラス、インターフェースの識別に使う) |
| `RECT`、`POINT`、`SIZE` | 構造体 |

### 型の使い方

```rust
use windows::Win32::{Foundation::*, UI::WindowsAndMessaging::*};

fn main() {
    // フラグは、newtype で、ビット演算子が使える
    let style = MB_OK | MB_ICONINFORMATION;
    println!("{:#x}", style.0);

    // BOOL は、as_bool で、bool にする
    let flag = BOOL(1);
    println!("{}", flag.as_bool());

    // ハンドルは、is_invalid で、無効な値かを、確認する
    let hwnd = HWND::default();
    println!("{}", hwnd.is_invalid());

    // 構造体は、Default で、ゼロ初期化できる
    let rect = RECT::default();
    println!("{} {}", rect.left, rect.right);
}
```

| 操作 | 内容 |
| --- | --- |
| `.0` | newtype の、中身を取り出す |
| `.as_bool()` | `BOOL` を、`bool` にする |
| `true.into()` | `bool` を、`BOOL` にする |
| `.is_invalid()` | ハンドルが、無効かを調べる |
| `Default::default()` | ゼロで、初期化する |

<pre><code class="tips">ハンドル型は、バージョンによって、中身の型が違う (整数、ポインタなど)。中身を直接触る必要がなければ、型の名前だけで扱い、.0 に依存しない。
中身の型は、使っているバージョンの、docs.rs で確認する。</code></pre>

---

## 文字列 (Strings) <a id="strings" data-name="文字列"></a>

Windows API の文字列は、UTF-16 (ワイド文字) か、ANSI の、どちらかである。Rust の `String` (UTF-8) との間で、変換が必要になる。

### 文字列の型

| 型 | 内容 |
| --- | --- |
| `PCWSTR` | 読み取り専用の、ヌル終端の UTF-16 文字列へのポインタ |
| `PWSTR` | 書き込み可能な、ヌル終端の UTF-16 文字列へのポインタ |
| `PCSTR`、`PSTR` | ANSI 版 |
| `HSTRING` | WinRT の文字列。参照カウントで管理される、UTF-16 |
| `BSTR` | COM の、文字列 |

### 文字列リテラルのマクロ

| マクロ | 作る型 | 内容 |
| --- | --- | --- |
| `w!("...")` | `PCWSTR` | UTF-16 の、静的な文字列 |
| `s!("...")` | `PCSTR` | ANSI の、静的な文字列 |
| `h!("...")` | `HSTRING` | UTF-16 の、静的な `HSTRING` |

```rust
use windows::core::*;

fn main() {
    // 静的な文字列は、マクロで作る
    let wide: PCWSTR = w!("こんにちは");
    let ansi: PCSTR = s!("hello");
    let hstr: HSTRING = h!("WinRT");

    println!("{}", hstr);
    // PCWSTR から String へ戻す (ヌル終端であることが、前提)
    let text = unsafe { wide.to_string().unwrap() };
    println!("{}", text);
    let _ = ansi;
}
```

### 動的な文字列

実行時に作る文字列は、`HSTRING` か、`Vec<u16>` を使う。

```rust
use windows::{core::*, Win32::UI::WindowsAndMessaging::*};

fn show(message: &str) {
    // String から、HSTRING を作る (UTF-8 から UTF-16 へ変換される)
    let text = HSTRING::from(message);
    unsafe {
        // &HSTRING は、PCWSTR の引数に、そのまま渡せる
        MessageBoxW(None, &text, w!("通知"), MB_OK);
    }
}

fn to_wide(s: &str) -> Vec<u16> {
    // 末尾に、ヌル文字を足した、UTF-16 の列を作る
    s.encode_utf16().chain(std::iter::once(0)).collect()
}

fn main() {
    show("実行時に作った文字列");

    let wide = to_wide("C:\\Windows");
    // Vec の寿命が、PCWSTR より長いことを、保証する
    let ptr = PCWSTR::from_raw(wide.as_ptr());
    println!("{}", unsafe { ptr.to_string().unwrap() });
}
```

### 変換の一覧

| 変換 | 方法 |
| --- | --- |
| `&str` → `HSTRING` | `HSTRING::from(s)` |
| `HSTRING` → `String` | `hstring.to_string()` (`Display` も使える) |
| `&str` → `Vec<u16>` | `s.encode_utf16().chain(std::iter::once(0)).collect()` |
| `Vec<u16>` → `PCWSTR` | `PCWSTR::from_raw(v.as_ptr())` |
| `PCWSTR` → `String` | `unsafe { p.to_string() }` (`Result` を返す) |
| `[u16; N]` → `String` | `String::from_utf16_lossy(&buf[..len])` |

<pre><code class="caution">PCWSTR は、ただのポインタで、寿命を管理しない。Vec や String が、先に破棄されると、ぶら下がりポインタになる。
ヌル終端のない、データから PCWSTR を作ると、範囲外を読む、未定義動作になる。</code></pre>

<pre><code class="tips">定数の文字列には、w! を使う。コンパイル時に、ヌル終端つきの UTF-16 が作られるため、実行時の、変換のコストがない。
ファイルパスは、Path の as_os_str と encode_wide でも、UTF-16 にできる (std::os::windows::ffi::OsStrExt)。</code></pre>

---

## エラー処理 <a id="error" data-name="エラー処理"></a>

### Result と Error

失敗しうる API は、`windows::core::Result<T>` を返す。エラーは、`windows::core::Error` で、中身は、`HRESULT` と、メッセージである。

| 型 | 内容 |
| --- | --- |
| `Result<T>` | `std::result::Result<T, Error>` の別名 |
| `Error` | `HRESULT` と、補足情報を持つ |
| `HRESULT` | 結果コード。負の値が、失敗を表す |

| メソッド | 内容 |
| --- | --- |
| `error.code()` | `HRESULT` を、取り出す |
| `error.message()` | OS が用意した、エラーメッセージ (文字列) |
| `Error::from_thread()` | 直前の、`GetLastError` から、エラーを作る |
| `Error::from_hresult(hr)` | `HRESULT` から、エラーを作る |
| `HRESULT::from_win32(code)` | Win32 のエラーコードを、`HRESULT` にする |
| `hr.ok()` | `HRESULT` を、`Result<()>` にする |
| `hr.is_ok()`、`hr.is_err()` | 成功か、失敗かを調べる |

### ファイルを開いて、エラーを調べる例

```rust
use windows::{
    core::*,
    Win32::{
        Foundation::*,
        Security::*,
        Storage::FileSystem::*,
    },
};

fn main() {
    let result = unsafe {
        CreateFileW(
            w!("C:\\no\\such\\file.txt"),
            GENERIC_READ.0,
            FILE_SHARE_READ,
            None,
            OPEN_EXISTING,
            FILE_ATTRIBUTE_NORMAL,
            None,
        )
    };

    match result {
        Ok(handle) => {
            println!("開いた");
            unsafe { CloseHandle(handle).ok() };
        }
        Err(e) => {
            // エラーコードと、OS のメッセージを表示する
            println!("失敗: {:#x}", e.code().0);
            println!("{}", e.message());

            // 特定のエラーかを、HRESULT で比較する
            if e.code() == HRESULT::from_win32(ERROR_FILE_NOT_FOUND.0) {
                println!("ファイルが、存在しない");
            }
        }
    }
}
```

```text
失敗: 0x80070002
指定されたファイルが見つかりません。
ファイルが、存在しない
```

メッセージの言語は、OS の表示言語に従う。上の出力は、日本語環境での、例である。

### anyhow との組み合わせ

`windows::core::Error` は、`std::error::Error` を実装している。そのため、anyhow の `?` で、そのまま伝えられる (anyhow のドキュメントを参照)。

```rust
use anyhow::Context;
use windows::Win32::System::SystemInformation::GetTickCount64;

fn main() -> anyhow::Result<()> {
    let tick = unsafe { GetTickCount64() };
    println!("{}", tick);

    let hr = windows::core::HRESULT(0);
    hr.ok().context("HRESULT の確認に失敗")?;
    Ok(())
}
```

<pre><code class="tips">thiserror で、独自のエラー型を作るときは、#[from] で windows::core::Error を、取り込める (thiserror のドキュメントを参照)。
エラーコードで、処理を分けたいときは、メッセージの文字列ではなく、code() の HRESULT を比較する。</code></pre>

<pre><code class="caution">Win32 の関数には、戻り値が BOOL で、GetLastError で、理由を取る形式のものがある。windows では、多くが Result に変換されるが、変換されていない関数もある。
戻り値の型が、BOOL や、整数の場合は、ok() や、Error::from_thread() で、自分で変換する。</code></pre>

---

## ハンドルとリソース管理 <a id="handle" data-name="ハンドル"></a>

カーネルオブジェクトの、ハンドルは、使い終わったら、閉じる必要がある。生の `HANDLE` は、`Drop` を持たないため、閉じ忘れると、リソースが漏れる。

### 手動で閉じる

```rust
use windows::{core::*, Win32::{Foundation::*, System::Threading::*}};

fn main() -> Result<()> {
    unsafe {
        // 手動リセットのイベントを作る
        let event = CreateEventW(None, true, false, None)?;
        SetEvent(event)?;
        // シグナル状態なので、待たずに、すぐ戻る
        let status = WaitForSingleObject(event, 0);
        println!("{:?}", status == WAIT_OBJECT_0);
        CloseHandle(event)?;
    }
    Ok(())
}
```

必要なフィーチャーは、`Win32_Foundation`、`Win32_System_Threading`、`Win32_Security` である。

### Owned による自動解放

windows-core には、ハンドルを、自動で閉じる、`Owned<T>` が用意されている。

```rust
use windows::{
    core::*,
    Win32::{Foundation::*, System::Threading::*},
};

fn main() -> Result<()> {
    // Owned が、スコープを抜けるときに、CloseHandle を呼ぶ
    let event = unsafe { Owned::new(CreateEventW(None, true, false, None)?) };
    unsafe { SetEvent(*event)? };
    let status = unsafe { WaitForSingleObject(*event, 0) };
    println!("{:?}", status == WAIT_OBJECT_0);
    Ok(())
}
```

### ハンドルの扱い

| 状況 | 方法 |
| --- | --- |
| 短い処理で、1回だけ使う | `CloseHandle` を、手動で呼ぶ |
| 途中で、`?` により、早期リターンする可能性がある | `Owned<HANDLE>` を使う |
| 自分で、ラッパー型を作る | `Drop` で、`CloseHandle` を呼ぶ構造体を、定義する |
| COM のオブジェクト | `Drop` で、`Release` が、自動で呼ばれる (閉じる処理は、不要) |

<pre><code class="caution">Owned を使っているときに、さらに CloseHandle を呼ぶと、二重に閉じることになる。どちらか一方に、そろえる。
Owned::new は、渡したハンドルの所有権を、受け取る unsafe な関数である。他の場所で、閉じられるハンドルを、渡してはいけない。</code></pre>

<pre><code class="tips">Owned の、詳しい API は、使っているバージョンの docs.rs で確認する。ハンドルを閉じる関数が、型ごとに、決まっている。
ウィンドウのハンドル (HWND) は、CloseHandle ではなく、DestroyWindow で破棄する。</code></pre>

---

## API の呼び出し <a id="call" data-name="API呼び出し"></a>

### null を取りうる引数は Option

ポインタやハンドルの引数が、null を許す API では、`Option<T>` を使う。

```rust
use windows::{core::*, Win32::UI::WindowsAndMessaging::*};

fn main() {
    unsafe {
        // 第1引数の、親ウィンドウは、なしを表す None
        MessageBoxW(None, w!("本文"), w!("題名"), MB_OK);
    }
}
```

| 引数の種類 | 渡し方 |
| --- | --- |
| null を許す、ハンドル | `None` または `Some(handle)` |
| null を許す、ポインタ | `None` または `Some(&value)` |
| null を許す、文字列 | `PCWSTR::null()` |
| null を許さない、引数 | 値を、そのまま渡す |

### バッファを渡す API

出力先のバッファを、スライスで受け取る API が、多い。長さは、スライスから、自動で決まる。

```rust
use windows::Win32::System::LibraryLoader::GetModuleFileNameW;

fn main() {
    // 実行ファイルの、パスを受け取るバッファ
    let mut buf = [0u16; 260];
    // 戻り値は、書き込んだ文字数 (ヌル文字を除く)
    let len = unsafe { GetModuleFileNameW(None, &mut buf) } as usize;
    let path = String::from_utf16_lossy(&buf[..len]);
    println!("{}", path);
}
```

```text
C:\Users\shin\project\target\debug\sample.exe
```

必要なフィーチャーは、`Win32_Foundation` と `Win32_System_LibraryLoader` である。

### 構造体を渡す API

構造体は、`Default` で、ゼロ初期化して、参照で渡す。`cbSize` のような、サイズを持つ欄は、自分で設定する。

```rust
use windows::Win32::System::SystemInformation::*;

fn main() {
    let mut info = SYSTEM_INFO::default();
    unsafe { GetSystemInfo(&mut info) };
    println!("ページサイズ: {}", info.dwPageSize);
    println!("プロセッサ数: {}", info.dwNumberOfProcessors);
}
```

### 呼び出しの種類

| 戻り値 | 意味 | 扱い方 |
| --- | --- | --- |
| `Result<T>` | 成功なら値、失敗なら `Error` | `?` で伝える |
| 値 (`u32` など) | 失敗しない、または、特別な値で失敗を表す | ドキュメントで、仕様を確認する |
| `BOOL` | 真偽、または成否 | `.as_bool()` か、`.ok()` |
| `HRESULT` | COM の結果コード | `.ok()` で `Result` にする |

<pre><code class="tips">API の戻り値が Result になっているかは、docs.rs の、関数のシグネチャで確認する。同じ名前の API でも、バージョンで、戻り値の形が変わることがある。
引数の型が、Param&lt;T&gt; のように、ジェネリクスの場合は、複数の型 (PCWSTR、&amp;HSTRING など) を渡せる。</code></pre>

---

## コールバック <a id="callback" data-name="コールバック"></a>

Win32 のコールバックは、`extern "system"` の、関数ポインタで、渡す。クロージャは、そのまま渡せない。状態を渡したいときは、`LPARAM` などの引数に、ポインタを、詰める。

### EnumWindows でウィンドウの一覧を取る

```rust
use windows::{
    core::*,
    Win32::{Foundation::*, UI::WindowsAndMessaging::*},
};

// EnumWindows に渡す、コールバック関数
unsafe extern "system" fn collect(hwnd: HWND, lparam: LPARAM) -> BOOL {
    unsafe {
        // LPARAM に詰めた、Vec へのポインタを、元に戻す
        let titles = &mut *(lparam.0 as *mut Vec<String>);

        if IsWindowVisible(hwnd).as_bool() {
            let mut buf = [0u16; 256];
            let len = GetWindowTextW(hwnd, &mut buf);
            if len > 0 {
                titles.push(String::from_utf16_lossy(&buf[..len as usize]));
            }
        }
    }
    // true を返すと、列挙を続ける
    true.into()
}

fn main() -> Result<()> {
    let mut titles: Vec<String> = Vec::new();

    unsafe {
        // Vec へのポインタを、LPARAM として渡す
        EnumWindows(Some(collect), LPARAM(&mut titles as *mut _ as isize))?;
    }

    for title in titles {
        println!("{}", title);
    }
    Ok(())
}
```

必要なフィーチャーは、`Win32_Foundation` と `Win32_UI_WindowsAndMessaging` である。

### コールバックの規則

| 項目 | 内容 |
| --- | --- |
| 関数の形 | `unsafe extern "system" fn(...) -> ...` |
| 渡し方 | `Some(関数名)` (引数が、`Option` の場合) |
| 状態の受け渡し | `LPARAM` や、`*mut c_void` に、ポインタを詰める |
| 戻り値 | API ごとに、決まっている (`BOOL` で、継続の可否を示すものが多い) |
| パニック | コールバックの外へ、パニックを伝えてはいけない |

<pre><code class="caution">コールバックの中で、パニックすると、FFI の境界を越えるため、プログラムが、異常終了する。必要なら、std::panic::catch_unwind で、受け止める。
LPARAM に渡したポインタは、API の呼び出しが、終わるまで有効でなければならない。非同期に、呼ばれるコールバックには、ローカル変数のポインタを渡してはいけない。</code></pre>

<pre><code class="tips">Rust 2024 エディションでは、unsafe fn の中でも、unsafe の操作に、unsafe ブロックが必要になる。上の例は、それに合わせて、unsafe ブロックで囲んでいる。
BOOL は、windows-result に移っているが、windows::Win32::Foundation からも、引き続き、使える。</code></pre>

---

## COM の利用 <a id="com" data-name="COM"></a>

COM (Component Object Model) は、インターフェースと参照カウントで、オブジェクトを扱う仕組みである。windows では、インターフェースが、Rust の構造体になり、`Drop` で、`Release` が呼ばれる。

### COM の基本

| 項目 | 内容 |
| --- | --- |
| 初期化 | `CoInitializeEx` を、スレッドごとに、1回呼ぶ |
| 後始末 | `CoUninitialize` を、初期化と同じ回数だけ、呼ぶ |
| 作成 | `CoCreateInstance` で、クラスの ID から、インターフェースを得る |
| 別のインターフェースへ | `.cast::<T>()` で、`QueryInterface` を呼ぶ |
| 解放 | `Drop` で、自動的に、`Release` が呼ばれる |

### ショートカットを作る例

```rust
use windows::{
    core::*,
    Win32::{
        System::Com::*,
        UI::Shell::*,
    },
};

fn main() -> Result<()> {
    unsafe {
        // シングルスレッド アパートメントで、COM を初期化する
        CoInitializeEx(None, COINIT_APARTMENTTHREADED).ok()?;

        // COM オブジェクトは、CoUninitialize より前に、破棄する必要がある
        {
            // ShellLink クラスから、IShellLinkW を作る
            let link: IShellLinkW = CoCreateInstance(&ShellLink, None, CLSCTX_INPROC_SERVER)?;
            link.SetPath(w!("C:\\Windows\\notepad.exe"))?;

            // IPersistFile へ、QueryInterface する
            let file: IPersistFile = link.cast()?;
            file.Save(w!("C:\\Temp\\notepad.lnk"), true)?;
        }

        CoUninitialize();
    }
    Ok(())
}
```

必要なフィーチャーは、`Win32_System_Com`、`Win32_UI_Shell` である。保存先のフォルダは、事前に作っておく。

### COM のスレッドモデル

| 指定 | 内容 |
| --- | --- |
| `COINIT_APARTMENTTHREADED` | シングルスレッド アパートメント (STA)。UI スレッドで使う |
| `COINIT_MULTITHREADED` | マルチスレッド アパートメント (MTA)。ワーカースレッドで使う |

<pre><code class="caution">CoUninitialize の後に、COM オブジェクトが、Drop されると、Release が、不正な状態で呼ばれる。上の例のように、ブロックで囲み、オブジェクトを、先に破棄する。
スレッドモデルの異なるスレッドへ、COM オブジェクトを、そのまま渡してはいけない。</code></pre>

<pre><code class="tips">CoInitializeEx は、HRESULT を返す。ok() で Result にして、? で伝えると、失敗を見逃さない。
WinRT の API (XmlDocument など) は、別途の COM の初期化なしで、動く場合がある。ただし、スレッドの条件は、API ごとに確認する。</code></pre>

---

## COM の実装 <a id="com-implement" data-name="COMの実装"></a>

Windows が定義している、COM のインターフェースを、Rust で実装したい場合は、`implement` フィーチャーを使う。

### 準備

```toml
[dependencies.windows]
version = "0.62"   # cargo add が、最新のバージョンを入れる
features = [
    "implement",
    "Win32_System_Com",
]
```

### IPersist を実装する例

```rust
use windows::{core::*, Win32::System::Com::*};

// IPersist を実装する、構造体
#[implement(IPersist)]
struct Persist(GUID);

// 実装の本体は、「インターフェース名_Impl」の trait で書く
impl IPersist_Impl for Persist_Impl {
    fn GetClassID(&self) -> Result<GUID> {
        Ok(self.0)
    }
}

fn main() -> Result<()> {
    let guid = GUID::new()?;

    // Into で、COM のオブジェクトにする (ヒープ確保と、参照カウントが付く)
    let persist: IPersist = Persist(guid).into();

    let id = unsafe { persist.GetClassID()? };
    println!("{}", id == guid);
    Ok(())
}
```

```text
true
```

### 実装の流れ

| 手順 | 内容 |
| --- | --- |
| 1 | `#[implement(インターフェース名)]` を、構造体に付ける |
| 2 | マクロが作る `構造体名_Impl` に、`インターフェース名_Impl` を、実装する |
| 3 | `IUnknown` (`QueryInterface`、`AddRef`、`Release`) は、マクロが、実装する |
| 4 | `.into()` で、COM のインターフェースの値に、変換する |

<pre><code class="caution">この章のコードは、公式のガイドの形を参考にしているが、0.62 では、確認していない。_Impl trait のメソッドの、シグネチャは、バージョンで変わることがある。
実装するインターフェースの、_Impl trait の定義は、docs.rs で確認する。</code></pre>

<pre><code class="tips">複数のインターフェースを実装するときは、implement の引数に、カンマ区切りで、並べる。
独自のインターフェースを定義したいときは、interface マクロ (windows-interface) を使う。</code></pre>

---

## WinRT <a id="winrt" data-name="WinRT"></a>

WinRT (Windows Runtime) の API も、同じ crate で、呼び出せる。名前空間は、`Win32` ではなく、`Data`、`Storage`、`Foundation` などである。

### XML を扱う例

```rust
use windows::{core::*, Data::Xml::Dom::*};

fn main() -> Result<()> {
    // WinRT のクラスは、new で作る
    let doc = XmlDocument::new()?;
    doc.LoadXml(h!("<html>hello world</html>"))?;

    let root = doc.DocumentElement()?;
    // HSTRING は、&str と比較できる
    assert!(root.NodeName()? == "html");
    println!("{}", root.InnerText()?);
    Ok(())
}
```

```text
hello world
```

必要なフィーチャーは、`Data_Xml_Dom` である。

### WinRT の、特徴

| 項目 | 内容 |
| --- | --- |
| メソッド名 | パスカルケース (`LoadXml`、`DocumentElement`) |
| 文字列 | `HSTRING` |
| 戻り値 | `Result` |
| プロパティ | getter は、メソッド (`NodeName()`) として、呼ぶ |
| 非同期 | `IAsyncOperation` など。windows-future が、対応する |
| コレクション | `IVector` や `IMap` など。windows-collections が、対応する |

### WinRT 関連の crate

| crate | 内容 |
| --- | --- |
| `windows-future` | 非同期の型 (`IAsyncOperation` など) |
| `windows-collections` | コレクションの型 (`IIterable`、`IVector`、`IMap` など) |
| `windows-numerics` | 数値の型 (ベクトル、行列など) |

これらは、windows crate の、依存として、含まれている。単独でも、使える。

<pre><code class="tips">WinRT の非同期 API を使うときは、windows-future のドキュメントで、待機の方法 (ブロッキング、await) を確認する。メソッドの名前は、バージョンで変わっている。
WinRT の型を、フィーチャーなしで使うと、コンパイルエラーになる。型の名前空間に、対応するフィーチャーを、有効にする。</code></pre>

---

## windows-sys と windows-link <a id="sys-link" data-name="windows-sys"></a>

### windows-sys

windows-sys は、windows と、同じメタデータから、生成された、低レベルの crate である。`Result` への変換や、COM の、ラッパーは、ない。

```rust
use windows_sys::Win32::System::SystemInformation::GetTickCount64;

fn main() {
    // 戻り値は、生の値のまま
    let tick = unsafe { GetTickCount64() };
    println!("{}", tick);
}
```

```toml
[dependencies.windows-sys]
version = "0.61"   # cargo add が、最新のバージョンを入れる
features = ["Win32_System_SystemInformation"]
```

### windows と windows-sys の使い分け

| 状況 | 選ぶ crate |
| --- | --- |
| COM、WinRT を使う | `windows` |
| `Result` で、エラーを扱いたい | `windows` |
| 少数の Win32 関数だけを、軽く呼びたい | `windows-sys` |
| ライブラリで、利用者のビルド時間を、増やしたくない | `windows-sys` |
| アプリケーションで、手軽に書きたい | `windows` |

### windows-link

windows-link は、外部の関数を、リンクするための、小さな crate である。`link!` マクロで、関数を、宣言する。

```rust
// kernel32.dll の GetTickCount64 を、自分で宣言する
windows_link::link!("kernel32.dll" "system" fn GetTickCount64() -> u64);

fn main() {
    println!("{}", unsafe { GetTickCount64() });
}
```

```toml
[dependencies]
windows-link = "0.2"
```

| crate | 内容 |
| --- | --- |
| `windows-link` | `link!` マクロによる、リンクの宣言。インポートライブラリを、挿入しない |
| `windows-targets` | 以前の、リンクの仕組み。windows-link に、置き換わっている |
| `windows-bindgen` | メタデータから、必要な API だけの、バインディングを、生成する |

<pre><code class="tips">必要な API が、ごく少数なら、windows-bindgen で、バインディングを生成し、windows-link だけに依存する方法もある。依存を、最小にできる。
windows-bindgen の使い方は、公式の readme と、サンプルで確認する。</code></pre>

<pre><code class="caution">windows と windows-sys の型は、別の crate の型である。両方を使うと、同じ名前の型が、互換にならない。1つのプロジェクトでは、どちらかに、そろえる。</code></pre>

---

## 実践例 <a id="practice" data-name="実践例"></a>

### ウィンドウの作成

ウィンドウクラスの登録、ウィンドウの作成、メッセージループまでの、最小の例。

```rust
use windows::{
    core::*,
    Win32::{
        Foundation::*,
        Graphics::Gdi::*,
        System::LibraryLoader::GetModuleHandleW,
        UI::WindowsAndMessaging::*,
    },
};

fn main() -> Result<()> {
    unsafe {
        let module = GetModuleHandleW(None)?;
        let instance: HINSTANCE = module.into();
        let class_name = w!("sample_window");

        // ウィンドウクラスの登録
        let wc = WNDCLASSW {
            hInstance: instance,
            lpszClassName: class_name,
            lpfnWndProc: Some(wndproc),
            hCursor: LoadCursorW(None, IDC_ARROW)?,
            hbrBackground: HBRUSH((COLOR_WINDOW.0 + 1) as isize as *mut _),
            ..Default::default()
        };
        if RegisterClassW(&wc) == 0 {
            return Err(Error::from_thread());
        }

        // ウィンドウの作成
        CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            class_name,
            w!("windows crate のサンプル"),
            WS_OVERLAPPEDWINDOW | WS_VISIBLE,
            CW_USEDEFAULT,
            CW_USEDEFAULT,
            640,
            480,
            None,
            None,
            Some(instance),
            None,
        )?;

        // メッセージループ。WM_QUIT で、GetMessageW が 0 を返して、終了する
        let mut msg = MSG::default();
        while GetMessageW(&mut msg, None, 0, 0).as_bool() {
            let _ = TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    }
    Ok(())
}

// ウィンドウプロシージャ
extern "system" fn wndproc(
    window: HWND,
    message: u32,
    wparam: WPARAM,
    lparam: LPARAM,
) -> LRESULT {
    unsafe {
        match message {
            WM_DESTROY => {
                // ウィンドウが破棄されたら、メッセージループを終える
                PostQuitMessage(0);
                LRESULT(0)
            }
            // 処理しないメッセージは、既定の処理に任せる
            _ => DefWindowProcW(window, message, wparam, lparam),
        }
    }
}
```

必要なフィーチャーは、`Win32_Foundation`、`Win32_Graphics_Gdi`、`Win32_System_LibraryLoader`、`Win32_UI_WindowsAndMessaging` である。

| 要素 | 内容 |
| --- | --- |
| `WNDCLASSW` | ウィンドウクラスの定義。プロシージャと、カーソルなどを、持つ |
| `RegisterClassW` | クラスを登録する。失敗すると 0 を返す |
| `CreateWindowExW` | ウィンドウを作る。`Result<HWND>` を返す |
| `GetMessageW` | メッセージを取る。`WM_QUIT` で、ループを抜ける |
| `DefWindowProcW` | 処理しないメッセージの、既定の処理 |

<pre><code class="caution">この例の、背景のブラシの指定 (HBRUSH の作り方) は、ハンドル型の中身の型に、依存する。使っているバージョンで、コンパイルが通らない場合は、docs.rs で HBRUSH の定義を確認する。
GUI を作り込むなら、生の Win32 ではなく、フレームワーク (Tauri、iced、egui など) の利用も、検討する。</code></pre>

### プロセスの一覧

ToolHelp の、スナップショットで、実行中のプロセスを、列挙する例。

```rust
use windows::{
    core::*,
    Win32::{
        Foundation::*,
        System::Diagnostics::ToolHelp::*,
    },
};

// ヌル終端の UTF-16 の配列から、文字列を作る
fn exe_name(entry: &PROCESSENTRY32W) -> String {
    let len = entry
        .szExeFile
        .iter()
        .position(|&c| c == 0)
        .unwrap_or(entry.szExeFile.len());
    String::from_utf16_lossy(&entry.szExeFile[..len])
}

fn main() -> Result<()> {
    unsafe {
        // プロセスの、スナップショットを取る
        let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0)?;

        let mut entry = PROCESSENTRY32W::default();
        // 構造体の大きさを、事前に設定する
        entry.dwSize = size_of::<PROCESSENTRY32W>() as u32;

        Process32FirstW(snapshot, &mut entry)?;
        loop {
            println!("{:>6}  {}", entry.th32ProcessID, exe_name(&entry));
            // 次がなければ、エラーが返り、ループを抜ける
            if Process32NextW(snapshot, &mut entry).is_err() {
                break;
            }
        }

        CloseHandle(snapshot)?;
    }
    Ok(())
}
```

```text
     0  [System Process]
     4  System
  1234  explorer.exe
```

必要なフィーチャーは、`Win32_Foundation`、`Win32_System_Diagnostics_ToolHelp` である。出力の内容は、環境によって異なる。

<pre><code class="tips">途中で、早期リターンする可能性があるなら、snapshot を Owned で包むと、閉じ忘れを防げる。
プロセスの、詳細な情報 (メモリ使用量など) が欲しいときは、OpenProcess で、ハンドルを開き、別の API を呼ぶ。権限が足りないと、失敗する。</code></pre>

---

## テスト <a id="test" data-name="テスト"></a>

### プラットフォームの切り分け

windows を使うコードは、Windows 上でのみ動く。クロスプラットフォームの、プロジェクトでは、Windows 向けの依存と、コードを、条件つきにする。

```bash
cargo add windows --target 'cfg(windows)' --features Win32_System_SystemInformation
```

```toml
[target.'cfg(windows)'.dependencies.windows]
version = "0.62"   # cargo add が、最新のバージョンを入れる
features = ["Win32_System_SystemInformation"]
```

```rust
#[cfg(windows)]
pub fn uptime_ms() -> u64 {
    unsafe { windows::Win32::System::SystemInformation::GetTickCount64() }
}

#[cfg(not(windows))]
pub fn uptime_ms() -> u64 {
    // Windows 以外では、未対応として、0 を返す
    0
}
```

### 単体テスト

```rust
#[cfg(windows)]
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn uptime_is_positive() {
        // 起動してから、少なくとも 1 ms は、経っている
        assert!(uptime_ms() > 0);
    }
}
```

### テストの方針

| 対象 | 方法 |
| --- | --- |
| Win32 の、ラッパー関数 | `#[cfg(windows)]` の、テストで、実際の API を呼ぶ |
| GUI、ウィンドウ | ロジックを、API の呼び出しから、分離して、ロジックだけをテストする |
| COM | テストの中で、`CoInitializeEx` を呼び、最後に、`CoUninitialize` を呼ぶ |
| CI | `windows-latest` の、ランナーで、実行する |
| Windows 以外での、確認 | `cargo check --target x86_64-pc-windows-msvc` で、型の整合性だけを確認できる場合がある |

<pre><code class="caution">テストは、並列に、実行される。COM を、初期化するテストでは、スレッドごとに、初期化と後始末が必要になる。
Windows 以外で、cargo check を行う場合は、リンクが必要な処理 (cargo build) は、通らない。結果は、環境で、確認する。</code></pre>

Rust のテスト全般は、「Rustのテスト」のドキュメントを参照。

---

## 古いコードからの変更 <a id="migration" data-name="古いコードからの変更"></a>

windows は、頻繁に、破壊的変更が入る。古い記事のコードを、読み替えるときの、目安である。

| 古い書き方 | 現在 | 備考 |
| --- | --- | --- |
| `windows::build!` マクロと `build.rs` | フィーチャーを有効にする | 初期のバージョン (0.9 ごろまで) の方式 |
| `windows::include_bindings!()` | 不要 | 同上 |
| `Windows::Win32::...` (大文字の `Windows`) | `windows::Win32::...` | 初期のバージョンの、パスの書き方 |
| `windows::Result` | `windows::core::Result` | `core` モジュールに、移動した |
| 引数に、`HWND(0)` や `HWND::default()` を渡す | `None` を渡す | null を許す引数は、`Option` になった |
| `windows-targets` | `windows-link` | 0.61 の系統から、置き換わった |
| `BOOL` を、`windows` に依存して使う | `windows-result` に移動 (再エクスポートで、従来のパスも使える) | windows-rs のリリース 0.62 |
| `h!` マクロ | Edition 2024 に合わせた、小さな破壊的変更 | windows-rs のリリース 63 の、windows-strings |
| `GetLastError` を、自分で呼ぶ | `Error::from_thread()` | 戻り値が、`Result` の API では、自動で変換される |

### リリースの名前

windows-rs のリポジトリは、リリースの名前とタグを、63 から、数字だけにした。crate のバージョンとは、独立している。サンプルを探すときは、リリースページで、該当の crate が、更新されたリリースを確認する。

<pre><code class="caution">この表の、バージョンの境目は、おおよその目安である。正確な変更のバージョンは、windows-rs の、リリースノートで確認する。
検索で出てくる記事の多くは、古い。記事の日付と、使っている windows のバージョンを、必ず確認する。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `could not find ... in ...` | 必要なフィーチャーが、有効になっていない | docs.rs で、必要なフィーチャーを確認し、`Cargo.toml` に追加する |
| `this function is unsafe` | Win32 の関数は、ほとんどが unsafe | `unsafe` ブロックで、呼び出す。ブロックは、小さく保つ |
| 日本語が、文字化けする | ANSI 版 (`...A`) を、使っている | ワイド版 (`...W`) と、`w!` を使う |
| `PCWSTR` の内容が、壊れる | 元の `Vec<u16>` や `String` が、先に破棄された | 元のバッファの寿命を、PCWSTR の使用が、終わるまで保つ |
| 文字列の、末尾に、ゴミが出る | ヌル終端のない、データを、`PCWSTR` に渡した | 末尾に、0 を足す。または、`w!` や `HSTRING` を使う |
| 型が、一致しない (`HWND` など) | `windows` と `windows-sys` の型を、混ぜている | 1つのプロジェクトでは、どちらかに、そろえる |
| COM の呼び出しが、失敗する (`0x800401F0` のような、コード) | `CoInitializeEx` を呼んでいない | スレッドごとに、COM を、初期化する |
| `CoUninitialize` の後で、クラッシュする | COM オブジェクトが、後から、`Drop` された | オブジェクトを、ブロックで囲み、先に破棄する |
| 同じ crate の、複数のバージョンが、ビルドされる | 依存の crate ごとに、`windows` のバージョンが、違う | `cargo tree -d` で確認し、バージョンを揃える。ライブラリでは、範囲指定を使う |
| ビルドが、遅い | フィーチャーを、大量に有効にしている | 必要な名前空間だけを、有効にする。少数の関数なら、`windows-sys` を検討する |
| コールバックの中で、プログラムが、異常終了する | パニックが、FFI の境界を、越えた | `catch_unwind` で、受け止める |
| Windows 以外で、ビルドが通らない | Windows 専用の API を、無条件に、呼んでいる | `#[cfg(windows)]` と、`[target.'cfg(windows)'.dependencies]` で、切り分ける |
| 古い記事のコードが、動かない | API が、バージョンで、変わっている | <a href="#migration">古いコードからの変更</a>の表を、確認する |

---

## 関連 crate <a id="ecosystem" data-name="関連crate"></a>

| crate | 用途 |
| --- | --- |
| `windows-sys` | 低レベルの、生のバインディング |
| `windows-link` | 外部関数の、リンクの宣言 (`link!` マクロ) |
| `windows-core` | `Result`、`Error`、`HSTRING` など、共通の型 (windows が、再エクスポートする) |
| `windows-result` | `Result`、`Error`、`HRESULT`、`BOOL` などの、エラー関連の型 |
| `windows-strings` | `HSTRING`、`PCWSTR` などの、文字列の型 |
| `windows-bindgen` | メタデータから、バインディングを、生成する |
| `windows-implement`、`windows-interface` | COM の、実装と、インターフェース定義のマクロ |
| `windows-future` | WinRT の、非同期の型 |
| `windows-collections` | WinRT の、コレクションの型 |
| `windows-numerics` | ベクトルや、行列などの、数値の型 |
| `windows-registry` | レジストリの、操作 |
| `windows-threading` | Windows の、スレッドプールの、操作 |
| `windows-services` | Windows サービスの、実装 |
| `windows-version` | OS のバージョンの、取得 |
| `tokio` | 非同期ランタイム (tokio のドキュメントを参照) |
| `anyhow`、`thiserror` | エラー処理 (それぞれのドキュメントを参照) |
| `tauri` | デスクトップアプリのフレームワーク (Tauri のドキュメントを参照) |

<pre><code class="tips">windows-registry、windows-threading、windows-services などは、windows-rs のリポジトリで、公開されている。それぞれの、API は、docs.rs で確認する。
レジストリの操作だけが目的なら、windows 全体より、windows-registry の方が、軽く、書きやすい。</code></pre>
