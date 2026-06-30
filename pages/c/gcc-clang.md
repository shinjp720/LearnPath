---
title: Linux
layout: default
---

# GCC/Clang <a id="top" data-name="TOP"></a>

---

## gcc <a id="gcc" data-name="gcc"></a>

- `-o`で実行ファイル名を指定しなければデフォルトで`a.out`というファイル名になる。

<div class="subtitle">オプション</div>

| オプション        | 説明                                                      |
| ----------------- | --------------------------------------------------------- |
| -c                | コンパイルのみ(リンクしない、.oを出力)                    |
| -o &lt;file&gt;   | 出力ファイル名の指定                                      |
| -I&lt;dir&gt;     | ヘッダーファイル探索パスの追加                            |
| -L&lt;dir&gt;     | ライブラリ探索パスの追加                                  |
| -l&lt;name&gt;    | ライブラリのリンク(例：-lm = libm)                        |
| -static           | 静的リンクを行う(すべて含めたバイナリに)                  |
| -shared           | 共有ライブラリを作る(.so)                                 |
| -g                | デバッグ情報を付加(gdbやlldbで使える)                     |
| -std=c99          | C99標準でコンパイル(他：c89, gnu99, c11, c17, gnu11, etc) |
| -ansi             | -std=c89 相当＋GNU拡張を無効化                            |
| -fstrict-aliasing | 型による最適化を有効化(-O2以上で有効)                     |
| -fno-inline       | 関数のインライン化を抑制(デバッグしやすく)                |
| -Wall             | 代表的な警告を全て表示(必須級)                            |
| -Wextra           | -Wall に含まれない追加の警告も出す                        |
| -Wpedantic        | 標準C規格に厳密でないコードにも警告                       |
| -Werror           | 警告をエラーとして扱う(品質重視・CI向け)                  |
| -Wshadow          | 同じ名前の変数が別スコープで影を落とすと警告              |
| -Wconversion      | 型変換に関する警告を有効化                                |
| -Wuninitialized   | 未初期化の変数使用を警告(-O1以上で有効)                   |
| -O0               | 最適化なし(デフォルト、デバッグ向け)                      |
| -O1               | 軽い最適化                                                |
| -O2               | 中程度の最適化(実用性高、標準的)                          |
| -O3               | 積極的な最適化(高速だがコード肥大の傾向)                  |
| -Os               | サイズ最適化(コードを小さく)                              |
| -Ofast            | -O3に加えて規格無視の最適化(安全性注意)                   |

---

<div class="subtitle">実用的な組み合わせ</div>

```c
// 開発中(デバッグ重視)
gcc -Wall -Wextra -g -O0 main.c -o main
```

```c
// 実行速度重視(リリース用)
gcc -Wall -Wextra -O2 main.c -o main
```

```c
// 品質厳格チェック(CIなど)
gcc -Wall -Wextra -Wpedantic -Werror -O2 main.c -o main
```

---

