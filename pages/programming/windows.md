---
title: Windows
layout: default
---

# Windows <a id="top" data-name="TOP"></a>

## WSL2 <a id="wsl2" data-name="WSL2"></a>

```
C:\Users\<ユーザー名>\.wslconfig
```

上記の場所に設定ファイルを置くことで、WSL2の挙動をカスタマイズできる。

### おすすめの設定

```config
[wsl2]
memory=12GB      # PCのメモリに合わせて調整（例: 16GB搭載なら8GB〜12GB）
processors=4     # 必要十分なコア数に制限
swap=2GB         # スワップスペースのサイズを指定

[experimental]
autoMemoryReclaim=gradual    # メモリの自動解放
networkingMode=mirrored      # ネットワークのミラーモード化
```

完全にシャットダウンして更新。

```powershell
wsl --shutdown
```

---

## カスタムコマンド <a id="custom-command" data-name="カスタムコマンド"></a>

### 自作の実行可能プログラムをターミナルから実行できるようにする

管理者権限でコマンドプロンプトを起動して、以下のコマンドを実行。

```dos
mklink "C:\Windows\呼び出したいコマンド名.exe" "自作プログラムのフルパス.exe"
```

---

## シャットダウンタイマー <a id="shutdown-timer" data-name="シャットダウンタイマー"></a>

### 指定した時間の後にシャットダウンする

コマンドプロンプトで以下のコマンドを入力。

```dos
shutdown /s /t [秒数]
```

| --- | --- |
| 30分後 | 1800 |
| 1時間後 | 3600 |
| 2時間後 | 7200 |
| 3時間後 | 10800 |

### スリープタイマーを設定する

windows にスリープコマンド自体がないため以下を入力。

```dos
timeout /t [秒数] && rundll32.exe powrprof.dll,SetSuspendState 0,1,0
```

<pre><code class="tips">batファイルを作る場合は、以下を sleep.bat として、 ANSI または Sihft-JIS で保存。

@echo off
timeout /t %1 && rundll32.exe powrprof.dll,SetSuspendState 0,1,0

作成したsleep.bat ファイルをC:\Windows フォルダーに移動。

<span class="code-like">sleep 1800</span>のように使用。
</code></pre>


