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
autoVirtualDiskShrink=true   # 仮想ディスクの自動縮小
```

完全にシャットダウンして更新。

```powershell
wsl --shutdown
```