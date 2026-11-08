---
title: Linux
layout: default
---

# Linux <a id="top" data-name="TOP"></a>

- Linuxは、UNIXを基にして開発されたオープンソースのオペレーティングシステム。

---

## コマンド <a id="command" data-name="コマンド"></a>

### 基本

```bash
コマンド [オプション] [引数]
```

- ショートオプション<br>
    `ハイフン(-) + 1文字` で表される。複数ある場合は結合できる。
    - `tar -xvf archive.tar`
    - `tar -x -v -f archive.tar`
- ロングオプション<br>
    `ハイフン2つ(--) + 複数文字` で表される。一意である場合は省略可能。
    - `ls --quote-name`
    - `ls --quote`
- 引数を受け取るオプション<br>
    引数との間に`スペース`を入れるか`イコール(=)`で引数を指定する。
    - `ls --width 30`
    - `ls --width=30`
- オプションの終端<br>
    `--` はオプションの終端を表し、以降をただの引数として扱う。
    - `rm -- -file.txt # 引数として-を渡せる`
- 業界標準のオプション
    - `-h` `--help` # ヘルプを表示
    - `-V` `--version` # バージョンを表示

---

## パッケージ管理 <a id="package-management" data-name="パッケージ管理"></a>

### apt update<br>apt upgrade

updateでインデックスを更新して、upgradeで実際にインストールする。

### apt install<br>apt remove

| コマンド | 説明 |
| --- | --- |
| apt install パッケージ名 | パッケージをインストールする |
| apt remove パッケージ名 | パッケージを削除する。設定ファイルは残る |
| apt purge パッケージ名 | 設定ファイルも含めて完全に削除する |
| apt autoremove | 不要になった依存パッケージを削除する |

```bash
sudo apt install htop
sudo apt install -y zip unzip # -y で確認に自動で「はい」と答える
sudo apt remove htop
sudo apt purge htop
sudo apt autoremove
```

### apt search<br>apt show

| コマンド | 説明 |
| --- | --- |
| apt search キーワード | パッケージ名や説明文からパッケージを検索する |
| apt show パッケージ名 | パッケージの詳細(バージョン、依存関係、説明)を表示する |
| apt list --installed | インストール済みのパッケージ一覧 |
| apt list --upgradable | 更新可能なパッケージ一覧 |

```bash
apt search samba
apt show samba
apt list --upgradable
```

### dpkg

apt が内部で使っている、.deb ファイルを直接扱うための低レベルなコマンド。

| コマンド | 説明 |
| --- | --- |
| dpkg -i ファイル.deb | .deb ファイルをインストールする |
| dpkg -l | インストール済みパッケージの一覧 |
| dpkg -L パッケージ名 | パッケージがインストールしたファイルの一覧 |
| dpkg -S /パス/ファイル | そのファイルがどのパッケージに由来するか調べる |

<pre><code class="caution">dpkg -i は依存パッケージを自動で解決しない。ローカルの .deb をインストールする場合は sudo apt install ./ファイル.deb を使うと依存関係も解決してくれる。</code></pre>



---

## ファイル・ディレクトリ操作 <a id="file-management" data-name="ファイル管理"></a>

### ls

ディレクトリの内容を一覧表示する。

```bash
ls [オプション] [パス]
```

| オプション | 説明 |
| --- | --- |
| -l | 詳細表示 (パーミッション、所有者、サイズ、更新日時) |
| -a | `.` で始まる隠しファイルも表示する |
| -h | サイズを KB や MB など読みやすい単位で表示する (-l と併用) |
| -t | 更新日時の新しい順に並べる |
| -S | サイズの大きい順に並べる |
| -r | 並び順を逆にする |
| -R | サブディレクトリも再帰的に表示する |
| -d | ディレクトリの中身ではなく、ディレクトリ自体の情報を表示する |

<pre><code class="example">ls -lah # 隠しファイルも含めて詳細表示
ls -lt # 更新が新しい順
ls -ld /etc # /etc ディレクトリ自体の情報</code></pre>

### cd

カレントディレクトリを移動する。

```bash
cd [ディレクトリ]
```

| 指定 | 移動先 |
| --- | --- |
| cd または cd ~ | ホームディレクトリ |
| cd - | 直前にいたディレクトリ |
| cd .. | 一つ上の階層 |
| cd / | ルートディレクトリ |

<pre><code class="tips">cd はシェルの組み込みコマンド。bash script.sh のようにサブシェルで実行したスクリプト内で cd しても、呼び出し元のカレントディレクトリは変わらない。</code></pre>

### pwd

現在のディレクトリを絶対パスで表示する。

```bash
pwd
```

| オプション | 説明 |
| --- | --- |
| -L | シンボリックリンクをそのまま表示する (デフォルト) |
| -P | シンボリックリンクを解決した実際のパスを表示する |

### mkdir

ディレクトリを作成する。

```bash
mkdir [オプション] ディレクトリ名
```

| オプション | 説明 |
| --- | --- |
| -p | 途中の階層もまとめて作成する。既に存在していてもエラーにならない |
| -m モード | パーミッションを指定して作成する |
| -v | 作成したディレクトリを表示する |

<pre><code class="example">mkdir -p project/src/utils # 途中の階層もまとめて作成
mkdir -p project/{src,docs,tests} # 複数のディレクトリを同時に作成
mkdir -m 700 private # 所有者のみアクセス可能なディレクトリ</code></pre>

### rmdir

空のディレクトリを削除する。

```bash
rmdir [オプション] ディレクトリ名
```

| オプション | 説明 |
| --- | --- |
| -p | 親ディレクトリも空であれば、まとめて削除する |

<pre><code class="caution">中身が残っているディレクトリは削除できずエラーになる。中身ごと削除する場合は rm -r を使う。</code></pre>

### cp

ファイルやディレクトリをコピーする。

```bash
cp [オプション] コピー元 コピー先
```

| オプション | 説明 |
| --- | --- |
| -r | ディレクトリを再帰的にコピーする |
| -a | アーカイブモード。パーミッションやタイムスタンプなどを保持して再帰コピーする |
| -i | 上書きする前に確認する |
| -u | コピー元の方が新しい場合のみコピーする |
| -v | コピーしたファイルを表示する |

<pre><code class="example">cp file.txt backup.txt # ファイルをコピー
cp -r dir1 dir2 # ディレクトリをコピー
cp -a dir1/ /mnt/hdd1/backup/ # 属性を保持してコピー</code></pre>

<pre><code class="caution">コピー先に同名のファイルがあると、確認なしで上書きされる。不安な場合は -i を付ける。</code></pre>

<pre><code class="tips">コピー先が既に存在するディレクトリの場合、その中にコピーされる。大量のファイルや繰り返しのバックアップには rsync のほうが向いている。</code></pre>

### mv

ファイルやディレクトリを移動、または名前を変更する。

```bash
mv [オプション] 移動元 移動先
```

| オプション | 説明 |
| --- | --- |
| -i | 上書きする前に確認する |
| -n | 既存のファイルを上書きしない |
| -u | 移動元の方が新しい場合のみ移動する |
| -v | 移動したファイルを表示する |

<pre><code class="example">mv old.txt new.txt # 名前の変更
mv file.txt ~/Documents/ # 移動
mv a.txt b.txt c.txt dir/ # 複数のファイルをまとめて移動</code></pre>

<pre><code class="tips">同じディレクトリ内での mv は、実質的に名前の変更になる。</code></pre>

### rm

ファイルやディレクトリを削除する。

```bash
rm [オプション] ファイル名
```

| オプション | 説明 |
| --- | --- |
| -r | ディレクトリを中身ごと再帰的に削除する |
| -f | 確認せず、存在しないファイルも無視して削除する |
| -i | 削除する前に確認する |
| -v | 削除したファイルを表示する |

<pre><code class="example">rm file.txt # ファイルを削除
rm -r dir # ディレクトリを中身ごと削除
rm -ri dir # 1つずつ確認しながら削除</code></pre>

<pre><code class="caution">ゴミ箱を経由せず即座に削除されるため、元に戻せない。
スクリプト内で変数を使う場合、変数が空になると意図しない範囲を削除する恐れがある (例: rm -rf $DIR/* で $DIR が空のとき)。</code></pre>

### find

条件に一致するファイルを検索する。

```bash
find [検索開始パス] [条件] [アクション]
```

| 条件・アクション | 説明 |
| --- | --- |
| -name "パターン" | 名前で検索 (ワイルドカード可、大文字小文字を区別) |
| -iname "パターン" | 大文字小文字を区別せず名前で検索 |
| -type f / -type d | ファイル / ディレクトリのみ対象にする |
| -size +100M | 100MB より大きいファイル |
| -mtime -7 | 7日以内に更新されたファイル (+30 なら30日より前) |
| -maxdepth N | 探索する階層の深さを制限する |
| -exec コマンド {} \; | 見つかったファイルに対してコマンドを実行する |
| -delete | 見つかったファイルを削除する |

<pre><code class="example">find . -name "*.log" # カレント以下の .log ファイル
find /var/log -type f -size +100M # 100MB を超えるログ
find . -type f -mtime -7 # 7日以内に更新されたファイル
find . -name "*.tmp" -exec rm {} \; # 見つけた .tmp を削除</code></pre>

<pre><code class="tips">-exec の末尾を \; ではなく + にすると、複数のファイルをまとめて1回のコマンドに渡すため効率が良い。</code></pre>

<pre><code class="caution">-delete は元に戻せない。まず -delete を付けずに実行して、対象を確認してから付け足す。</code></pre>

---

## テキスト処理 <a id="text-processing" data-name="テキスト処理"></a>

### grep

パターンに一致する行を検索する。

```bash
grep [オプション] パターン [ファイル]
```

| オプション | 説明 |
| --- | --- |
| -i | 大文字小文字を区別しない |
| -v | 一致しない行を表示する |
| -n | 行番号を表示する |
| -r | ディレクトリ配下を再帰的に検索する |
| -E | 拡張正規表現を使う |
| -w | 単語単位で一致させる |
| -c | 一致した行数のみ表示する |
| -l | 一致したファイル名のみ表示する |
| -A N / -B N / -C N | 一致行の後 / 前 / 前後 N 行も表示する |

<pre><code class="example">grep -rn "TODO" ./src # src 以下から TODO を行番号付きで検索
grep -v "^#" config.conf # コメント行以外を表示
ps aux | grep nginx # パイプで他のコマンドの結果を絞り込む</code></pre>

#### 正規表現の基本

| 記号 | 意味 |
| --- | --- |
| `.` | 任意の1文字 |
| `*` | 直前の文字の0回以上の繰り返し |
| `^` | 行頭 |
| `$` | 行末 |

<pre><code class="example">grep '^ERROR' app.log # 行頭が ERROR の行</code></pre>

<pre><code class="tips">正規表現は、シェルに解釈されないようにシングルクォートで囲む。</code></pre>

### awk

テキストを区切り文字で分割し、条件に応じて処理する。

```bash
awk [-F 区切り文字] '条件 {処理}' [ファイル]
```

| 変数・指定 | 説明 |
| --- | --- |
| $0 | 行全体 |
| $1, $2, ... | 1番目、2番目...のフィールド |
| NF | その行のフィールド数 |
| NR | 現在の行番号 |
| -F | 区切り文字を指定する (デフォルトは空白) |
| BEGIN / END | 最初 / 最後に1回だけ実行する処理 |

<pre><code class="example">awk '{print $1}' access.log # 1列目だけ表示
awk -F: '{print $1}' /etc/passwd # : 区切りの1列目 (ユーザー名)
awk '$3 >= 1000 {print $1}' file # 3列目が1000以上の行の1列目
awk '{sum += $1} END {print sum}' nums.txt # 1列目の合計</code></pre>

### sed

テキストを置換・削除・抽出する。

```bash
sed [オプション] 'コマンド' [ファイル]
```

| コマンド・オプション | 説明 |
| --- | --- |
| s/A/B/ | 各行の最初の A を B に置換する |
| s/A/B/g | 各行のすべての A を B に置換する |
| Nd / /パターン/d | N 行目 / パターンに一致する行を削除する |
| -n 'N,Mp' | N〜M 行目だけを表示する |
| -i | ファイルを直接書き換える |

<pre><code class="example">sed 's/foo/bar/g' file.txt # 置換結果を表示 (ファイルは変更しない)
sed -i.bak 's/foo/bar/g' file.txt # file.txt.bak にバックアップを作って書き換え
sed -n '5,10p' file.txt # 5〜10行目のみ表示
sed '/^#/d' file.txt # コメント行を除外</code></pre>

<pre><code class="caution">-i は元のファイルを直接書き換える。-i.bak のようにバックアップ用の拡張子を付けておくと安全。</code></pre>

<pre><code class="tips">区切り文字は / 以外も使える。パスを置換するときは sed 's|/usr/local|/opt|g' のようにすると、エスケープが不要で読みやすい。</code></pre>

### cut

各行から指定した列や文字数を切り出す。

```bash
cut [オプション] [ファイル]
```

| オプション | 説明 |
| --- | --- |
| -d 区切り文字 | 区切り文字を指定する (1文字のみ。デフォルトはタブ) |
| -f N | N 番目のフィールドを切り出す (1,3 や 2-4 も指定可) |
| -c N-M | N〜M 文字目を切り出す |

<pre><code class="example">cut -d: -f1 /etc/passwd # ユーザー名の一覧
cut -d, -f2,4 data.csv # CSV の2列目と4列目
cut -c1-10 file.txt # 各行の先頭10文字</code></pre>

<pre><code class="tips">cut は連続した空白を1つの区切りとして扱えない。空白区切りのテキストは awk のほうが扱いやすい。</code></pre>

### sort

行を並べ替える。

```bash
sort [オプション] [ファイル]
```

| オプション | 説明 |
| --- | --- |
| -n | 数値として並べ替える |
| -r | 降順にする |
| -u | 重複する行を除いて出力する |
| -k N | N 番目のフィールドをキーにする |
| -t 区切り文字 | フィールドの区切り文字を指定する |
| -h | 1K, 2M など人間が読める単位で比較する |

<pre><code class="example">sort -n numbers.txt # 数値順
sort -t: -k3 -n /etc/passwd # 3列目 (UID) の数値順
du -sh * | sort -h # サイズの小さい順にディレクトリを並べる</code></pre>

### uniq

連続する重複行をまとめる。

```bash
uniq [オプション] [ファイル]
```

| オプション | 説明 |
| --- | --- |
| -c | 重複した回数を行頭に付ける |
| -d | 重複している行のみ表示する |
| -u | 重複していない行のみ表示する |

<pre><code class="caution">uniq は隣り合っている行だけを重複として扱う。通常は先に sort をかけてから使う。</code></pre>

<pre><code class="example">sort file.txt | uniq # 重複を除去
sort access.log | uniq -c | sort -nr | head # 出現回数の多い順に上位10件</code></pre>

---

## ファイル表示・編集 <a id="viewing-and-editing-filea" data-name="ファイル閲覧・編集"></a>

### cat

ファイルの内容を表示する。複数のファイルを連結することもできる。

```bash
cat [オプション] ファイル...
```

| オプション | 説明 |
| --- | --- |
| -n | 行番号を付けて表示する |
| -A | 改行(`$`)やタブ(`^I`)などの制御文字を可視化して表示する |

<pre><code class="example">cat file.txt # 内容を表示
cat -n file.txt # 行番号付き
cat a.txt b.txt > merged.txt # 連結して新しいファイルに保存</code></pre>

ヒアドキュメントを使うと、複数行をそのままファイルに書き込める。

```bash
cat > memo.txt << EOF
1行目
2行目
EOF
```

<pre><code class="tips">長いファイルを cat で表示すると流れてしまうので、less を使う。</code></pre>

### more/less

ファイルをページ単位で表示する。less は後戻りもできる more の上位互換。

```bash
less ファイル名
```

| キー | 説明 |
| --- | --- |
| Space / f | 次のページへ |
| b | 前のページへ |
| j / k | 1行下 / 上へ |
| g / G | 先頭 / 末尾へ |
| /文字列 | 前方検索 (n で次、N で前の一致へ) |
| F | 末尾を追従する (Ctrl+C で解除) |
| q | 終了 |

<pre><code class="tips">less +F ファイル名 で、tail -f のように末尾を追従しながら開ける。</code></pre>

### head/tail

ファイルの先頭 / 末尾を表示する。

```bash
head [オプション] ファイル
tail [オプション] ファイル
```

| オプション | 説明 |
| --- | --- |
| -n N | 先頭 / 末尾の N 行を表示する (デフォルトは10行) |
| -n +N | (tail) N 行目以降をすべて表示する |
| -f | (tail) 追記されるたびに表示を更新する |
| -F | (tail) -f に加えて、ログローテーションでファイルが入れ替わっても追従する |

<pre><code class="example">head -n 5 file.txt # 先頭5行
tail -n 20 file.txt # 末尾20行
tail -n +2 data.csv # 1行目 (ヘッダー) を除いて表示
tail -f /var/log/syslog # ログをリアルタイムで監視</code></pre>

### nano, vim, emacs

ターミナルで使えるテキストエディタ。

| エディタ | 特徴 | 保存して終了 | 保存せず終了 |
| --- | --- | --- | --- |
| nano | 初心者向け。画面下部にキー操作が表示される | Ctrl+X → Y → Enter | Ctrl+X → N |
| vim | モードを切り替えて操作する。ほとんどの環境に入っている | Esc → `:wq` | Esc → `:q!` |
| emacs | 拡張性が高い | Ctrl+X Ctrl+S → Ctrl+X Ctrl+C | Ctrl+X Ctrl+C → 確認で保存しない方を選ぶ |

#### vim の基本操作

| 操作 | 説明 |
| --- | --- |
| i | 挿入モードにする (文字を入力できる) |
| Esc | ノーマルモードに戻る |
| `:w` / `:q` / `:wq` | 保存 / 終了 / 保存して終了 |
| `:q!` | 保存せず強制終了 |
| /文字列 | 検索 (n で次の一致へ) |
| dd / yy / p | 行の削除(切り取り) / 行のコピー / 貼り付け |
| u / Ctrl+R | 元に戻す / やり直し |
| gg / G | ファイルの先頭 / 末尾へ |
| `:set number` | 行番号を表示する |

<pre><code class="tips">vim で操作が分からなくなったら、Esc を数回押してから :q! で抜けられる。</code></pre>

---

## プロセス管理 <a id="prosece" data-name="プロセス"></a>

### ps

実行中のプロセスの、その時点の一覧を表示する。

```bash
ps aux
ps -ef
```

`a` は全ユーザー、`u` はユーザー情報付き、`x` は端末に紐付かないプロセスも含める指定。

| 列 | 説明 |
| --- | --- |
| USER | 実行しているユーザー |
| PID | プロセスID |
| %CPU / %MEM | CPU / メモリの使用率 |
| STAT | 状態 (R: 実行中、S: 待機中、T: 停止中、Z: ゾンビ) |
| COMMAND | 実行しているコマンド |

<pre><code class="example">ps aux | grep nginx # 特定のプロセスを探す
ps aux --sort=-%mem | head -n 6 # メモリ使用量の多い上位5件</code></pre>

<pre><code class="tips">grep の結果に grep 自身が混ざるのが邪魔な場合は、pgrep -a nginx を使うとプロセス名で絞り込める。</code></pre>

### top

プロセスの状況をリアルタイムで監視する。

```bash
top
```

| キー | 説明 |
| --- | --- |
| q | 終了 |
| P / M | CPU / メモリ使用率の順に並べる |
| 1 | CPU コアごとの使用率を表示する |
| k | PID を指定してプロセスを終了する |
| h | ヘルプを表示する |

<pre><code class="tips">画面上部の load average は、直近 1分・5分・15分 の平均負荷。CPU のコア数より小さければ余裕がある。</code></pre>

### htop

top の高機能版。色付きで見やすく、マウスでも操作できる。

```bash
sudo apt install htop
htop
```

| キー | 説明 |
| --- | --- |
| F3 | プロセスを検索する |
| F4 | プロセスを絞り込む |
| F5 | ツリー表示の切り替え |
| F6 | 並べ替えの基準を選ぶ |
| F9 | シグナルを送信してプロセスを終了する |
| F10 | 終了 |

### kill

PID を指定してプロセスにシグナルを送る。

```bash
kill [-シグナル] PID
```

| シグナル | 説明 |
| --- | --- |
| 15 (SIGTERM) | 終了を要求する。デフォルト |
| 9 (SIGKILL) | 強制終了する |
| 1 (SIGHUP) | 設定の再読み込みに使うデーモンもある |
| 2 (SIGINT) | 割り込み。Ctrl+C と同じ |
| 19 (SIGSTOP) | 一時停止する |
| 18 (SIGCONT) | 一時停止したプロセスを再開する |

<pre><code class="example">kill 1234 # 終了を要求
kill -9 1234 # 強制終了
kill -l # シグナルの一覧</code></pre>

<pre><code class="caution">-9 はプロセスに後片付けをさせずに終了させる。まず通常の kill を試し、応答しない場合の最終手段にする。</code></pre>

### pkill

プロセス名などの条件を指定して、一致するプロセスにシグナルを送る。

```bash
pkill [オプション] パターン
```

| オプション | 説明 |
| --- | --- |
| -f | プロセス名だけでなく、コマンドライン全体を対象にする |
| -x | プロセス名が完全に一致するものだけを対象にする |
| -u ユーザー名 | 指定したユーザーのプロセスだけを対象にする |
| -9 | シグナルを指定する (kill と同じ書き方) |

<pre><code class="example">pkill nginx
pkill -f "python app.py"
pkill -u user1</code></pre>

<pre><code class="tips">実行前に pgrep -a パターン で、どのプロセスが対象になるか確認できる。</code></pre>

### nice

優先度(nice 値)を指定してコマンドを起動する。

```bash
nice -n 値 コマンド
```

nice 値は -20(優先度が最も高い) 〜 19(最も低い) で、デフォルトは 0。

<pre><code class="example">nice -n 19 tar -czf backup.tar.gz /data # 他の処理を邪魔しないように低い優先度で圧縮</code></pre>

<pre><code class="tips">一般ユーザーは nice 値を増やす(優先度を下げる)方向にしか指定できない。負の値は sudo が必要。</code></pre>

### renice

実行中のプロセスの優先度を変更する。

```bash
renice -n 値 -p PID
```

<pre><code class="example">renice -n 10 -p 1234 # 優先度を下げる
sudo renice -n -5 -p 1234 # 優先度を上げる (要 sudo)</code></pre>

<pre><code class="caution">一般ユーザーは nice 値を上げる(優先度を下げる)ことしかできず、一度上げた値は元に戻せない。</code></pre>

### jobs

現在のシェルで実行中、または停止中のジョブを一覧表示する。コマンドの末尾に `&` を付けると、バックグラウンドで実行できる。

```bash
sleep 100 & # バックグラウンドで実行
jobs # ジョブの一覧
jobs -l # PID も表示
```

### fg

バックグラウンドのジョブをフォアグラウンドに戻す。

```bash
fg [%ジョブ番号]
```

ジョブ番号を省略すると、直近のジョブが対象になる。

### bg

停止中のジョブをバックグラウンドで再開する。

```bash
bg [%ジョブ番号]
```

実行中のコマンドを Ctrl+Z で止めて、バックグラウンドへ回す流れ。

```bash
# 1. 実行中のコマンドを Ctrl+Z で一時停止
# 2. バックグラウンドで再開
bg %1
# 3. 必要になったらフォアグラウンドに戻す
fg %1
```

<pre><code class="tips">シェルを閉じるとジョブも終了することがある。ログアウト後も動かし続けたい場合は nohup や tmux を使う。Ctrl+Z などの操作は ショートカット の項を参照。</code></pre>

---

## 権限・ユーザー管理 <a id="user-management" data-name="権限・ユーザー管理"></a>

### sudo

一時的に管理者(root)や他のユーザーの権限でコマンドを実行する。

```bash
sudo [オプション] コマンド
```

| オプション | 説明 |
| --- | --- |
| -u ユーザー名 | 指定したユーザーとして実行する |
| -i | root のログインシェルを起動する |
| -s | 現在のシェルを root 権限で起動する |
| -l | 自分に許可されているコマンドを表示する |

<pre><code class="example">sudo apt update
sudo -u www-data whoami # www-data ユーザーとして実行
sudo !! # 直前のコマンドを sudo 付きで再実行</code></pre>

<pre><code class="caution">設定ファイル /etc/sudoers は直接編集せず、必ず visudo コマンドで編集する。文法を間違えると sudo が使えなくなる。</code></pre>

### su

ユーザーを切り替える。

```bash
su [-] [ユーザー名]
```

ユーザー名を省略すると root になる。`-` を付けると、環境変数なども切り替え先のユーザーのものになる(ログインシェル)。

<pre><code class="example">su - user2 # user2 に切り替え
sudo su - # root になる (root のパスワードが未設定でも使える)
exit # 元のユーザーに戻る</code></pre>

### chmod

ファイルやディレクトリのパーミッションを変更する。

```bash
chmod [オプション] モード ファイル
```

`ls -l` の `-rwxr-xr--` は、左から 所有者・グループ・その他 の順に rwx を並べたもの。数値は r=4、w=2、x=1 を足して表す。

| 数値 | 表記 | 主な用途 |
| --- | --- | --- |
| 755 | rwxr-xr-x | 実行ファイル、ディレクトリ |
| 644 | rw-r--r-- | 通常のファイル |
| 600 | rw------- | 秘密鍵など、所有者のみ読み書きするファイル |
| 700 | rwx------ | 所有者のみアクセスするディレクトリ |

記号でも指定できる。`u`(所有者) `g`(グループ) `o`(その他) `a`(全員) に対して `+`(付与) `-`(削除) `=`(指定) を使う。

<pre><code class="example">chmod 755 script.sh
chmod +x script.sh # 全員に実行権限を付与
chmod u+x,g-w file # 所有者に実行を付与し、グループの書き込みを削除
chmod -R 755 dir # 配下も含めて再帰的に変更</code></pre>

<pre><code class="tips">ディレクトリの x 権限は「中に入れる」という意味になる。SSH の秘密鍵は、他のユーザーが読めるパーミッションだと 600 にするよう警告されて使えない。</code></pre>

<pre><code class="caution">777 は誰でも読み書き実行できる状態になる。必要な場合を除き使わない。</code></pre>

### chown

ファイルの所有者やグループを変更する。

```bash
chown [オプション] ユーザー[:グループ] ファイル
```

| オプション | 説明 |
| --- | --- |
| -R | 配下も含めて再帰的に変更する |

<pre><code class="example">sudo chown user file.txt # 所有者のみ変更
sudo chown user:group file.txt # 所有者とグループを変更
sudo chown :group file.txt # グループのみ変更
sudo chown -R user:user dir/ # 配下も含めて変更</code></pre>

### passwd

パスワードを変更する。

```bash
passwd [オプション] [ユーザー名]
```

| コマンド | 説明 |
| --- | --- |
| passwd | 自分のパスワードを変更する |
| sudo passwd ユーザー名 | 指定したユーザーのパスワードを変更する |
| sudo passwd -l ユーザー名 | アカウントをロックする |
| sudo passwd -u ユーザー名 | ロックを解除する |
| sudo passwd -e ユーザー名 | 次回ログイン時にパスワードの変更を求める |

<pre><code class="tips">入力したパスワードは画面に表示されない。Samba 用のパスワードはこれとは別に、smbpasswd で設定する。</code></pre>

### useradd, usermod, userdel

ユーザーの追加・変更・削除を行う。

| コマンド | 説明 |
| --- | --- |
| useradd -m -s /bin/bash ユーザー名 | ユーザーを追加する。-m でホームディレクトリを作成し、-s でログインシェルを指定 |
| usermod -aG グループ名 ユーザー名 | ユーザーをグループに追加する |
| usermod -s /bin/bash ユーザー名 | ログインシェルを変更する |
| userdel ユーザー名 | ユーザーを削除する |
| userdel -r ユーザー名 | ホームディレクトリも含めて削除する |

<pre><code class="example">sudo useradd -m -s /bin/bash user1
sudo passwd user1 # パスワードを設定
sudo usermod -aG sudo user1 # sudo グループに追加
id user1 # 所属グループの確認</code></pre>

<pre><code class="caution">usermod -G だけを指定すると、既存の補助グループが置き換えられてしまう。グループを追加する場合は必ず -a と併用する。</code></pre>

<pre><code class="tips">Ubuntu や Debian では、対話形式でユーザーを追加できる adduser のほうが扱いやすい。グループの変更は、対象のユーザーが再ログインすると反映される。</code></pre>

---

## システム管理 <a id="system-management" data-name="システム管理"></a>

### ps

[プロセス管理](#prosece)の ps を参照。

### top, htop

[プロセス管理](#prosece)の top, htop を参照。

### kill, killall

kill は[プロセス管理](#prosece)を参照。

killall は、プロセス名を指定して、一致するプロセスをすべて終了する。

```bash
killall [オプション] プロセス名
```

<pre><code class="example">killall nginx
killall -9 python3 # 強制終了</code></pre>

<pre><code class="caution">同じ名前のプロセスがすべて対象になる。巻き込みたくない場合は、kill で PID を指定する。</code></pre>

### systemctl

systemctl は、Linux で systemd を操作するためのコマンドで、昔の service コマンドや /etc/init.d/ のスクリプトを置き換える存在。

#### 基本構文

```bash
systemctl <サブコマンド> <ユニット名>
```

#### Unit

systemd では管理対象をユニットと呼び、代表的なものは以下の通り。

| 種類 | 拡張子 | 用途 |
| --- | --- | --- |
| Service | .service | サービス・デーモン |
| Socket | .socket | ソケット起動 |
| Mount | .mount | マウントポイント |
| Timer | .timer | 定期実行 (cron の代替) |
| Target | .target | 実行レベルのようなグループ |

#### よく使うサブコマンド

| サブコマンド | 意味 |
| --- | --- |
| start | サービスを起動する |
| stop | サービスを停止する |
| restart | サービスを一度停止してから起動する |
| reload | プロセスを停止せずに設定を再読み込み。対応していないサービスもある |
| reload-or-restart | リロードできなければ再起動 |
| status | 状態を確認 |
| enable | PC起動時に自動起動する |
| disable | 自動起動を無効化 |
| is-enabled | 起動状態の確認 |
| is-active | 起動中か確認 |
| list-units | 起動中のユニット一覧 |
| list-unit-files | インストール済みユニット一覧 |
| --failed | 失敗したユニット一覧 |
| deamon-reload | ユニットファイル変更後の再読み込み |

RustやCで作成したサーバープログラムを .service ファイルとして登録すれば、systemctl で起動・停止・自動起動まで一元管理できる。

### df

ディスクの使用状況(空き容量)を表示する。

```bash
df [オプション] [パス]
```

| オプション | 説明 |
| --- | --- |
| -h | 容量を読みやすい単位で表示する |
| -T | ファイルシステムの種類も表示する |
| -i | 容量ではなく inode の使用状況を表示する |

<pre><code class="example">df -h # すべてのマウント済み領域
df -hT /mnt/hdd1 # 指定したパスがある領域とファイルシステムの種類</code></pre>

<pre><code class="tips">df が表示するのはマウント済みの領域のみ。未マウントのディスクを含めて確認する場合は lsblk を使う。</code></pre>

### du

ディレクトリやファイルが使っている容量を表示する。

```bash
du [オプション] [パス]
```

| オプション | 説明 |
| --- | --- |
| -h | 容量を読みやすい単位で表示する |
| -s | 合計のみ表示する |
| --max-depth=N | 表示する階層の深さを制限する |

<pre><code class="example">du -sh /var/log # ディレクトリの合計サイズ
du -h --max-depth=1 /var # 1階層下のサイズを一覧表示
du -h --max-depth=1 . | sort -h # 小さい順に並べる</code></pre>

<pre><code class="tips">df と du の値が一致しないことがある。削除済みでもプロセスが開いたままのファイルは、du には出ないが df の使用量には含まれる。</code></pre>

### free

メモリの使用状況を表示する。

```bash
free [オプション]
```

| オプション | 説明 |
| --- | --- |
| -h | 容量を読みやすい単位で表示する |
| -m | MB 単位で表示する |
| -s 秒 | 指定した間隔で繰り返し表示する |

| 列 | 説明 |
| --- | --- |
| total | 全体の容量 |
| used | 使用中の容量 |
| free | 完全に未使用の容量 |
| buff/cache | バッファやキャッシュとして使われている容量 |
| available | 実際に新しいプロセスが使える容量の目安 |

<pre><code class="tips">Linux は空いているメモリをキャッシュに使うため、free が小さくても問題ない。実際に使える量は available を見る。</code></pre>

### uname

カーネルやシステムの情報を表示する。

```bash
uname [オプション]
```

| オプション | 説明 |
| --- | --- |
| -a | すべての情報を表示する |
| -s | カーネル名 |
| -r | カーネルのバージョン |
| -m | CPU のアーキテクチャ (x86_64, aarch64 など) |
| -n | ホスト名 |

<pre><code class="tips">ディストリビューションのバージョンは uname ではなく、cat /etc/os-release や lsb_release -a で確認できる。</code></pre>

## ディスク管理 <a id="disc-management" data-name="ディスク管理"></a>

### mount, umount

mount は外付けのハードディスクなどをマウントする。

#### HDD をマウント

1. HDD の UUID を確認する。
    ```bash
    sudo blkid
    ```
2. ディレクトリを作成
    ```bash
    sudo mkdir -p /mnt/hdd1
    sudo mkdir -p /mnt/hdd2
    ```
3. 自動マウント設定を追記
    ```bash
    sudo vim /etc/fstab
    ```
    ```bash
    UUID=確認したUUID1  /mnt/hdd1  ext4  defaults  0  2
    UUID=確認したUUID2  /mnt/hdd2  ext4  defaults  0  2
    ```
    <pre><code class="tips">フォーマットが NTFS(Windows形式) の場合は ext4 を ntfs-3g に書き換える。</code></pre>
4. 反映させる
    ```bash
    sudo mount -a
    ```
    <pre><code class="caution">ファイルの記述が間違っていた場合、起動に失敗する可能性があるため、必ずこのコマンドを実行して、成功してから再起動する。</code></pre>

#### マウントを解除

```bash
sudo umount /dev/hdd1
```

### hdparm

ディスクの状態を管理する。

#### ディスクの休止を設定する

設定ファイルを開く。

```bash
sudo vim /etc/hdparm.conf
```

一番下に追記する。

```conf
/dev/sdXX {
    spindown_time = 120
}
```

<pre><code class="tips">UUIDなどでマウントされているのであれば、
/dev/sdXX ではなく /dev/disk/by-id や /dev/disk/by-uuid で指定するほうが安全。</code></pre>


| --- | --- |
| 0 | 無効 (休止しない) |
| 1 ~ 240 | 5秒単位 (120 なら 120*5=600秒 (10分)) |
| 241 ~ 251 | 30分単位 (241 なら 30分、242なら1時間) |


#### sudo hdparm -C /dev/sd??

マウント済みの /dev/ 配下のディスクのパワーモードを表示。



---

## ネットワーク <a id="network" data-name="ネットワーク"></a>

### ping

ホストとの疎通を確認する。

```bash
ping [オプション] ホスト
```

| オプション | 説明 |
| --- | --- |
| -c 回数 | 指定した回数で停止する |
| -i 秒 | 送信間隔を指定する |
| -s バイト | パケットのサイズを指定する |

<pre><code class="example">ping -c 4 example.com
ping -c 3 192.168.1.1</code></pre>

<pre><code class="caution">Linux の ping は、-c を付けないと止まるまで送り続ける。Ctrl+C で停止する。</code></pre>

<pre><code class="tips">応答がなくても、相手側が ICMP を遮断しているだけで、ホスト自体は動いている場合がある。</code></pre>

### ifconfig, ip

ネットワークインターフェースの確認や設定を行う。ifconfig は古い net-tools のコマンドで、現在は ip (iproute2) が標準。

| コマンド | 説明 |
| --- | --- |
| ip a | IP アドレスの一覧 (ip addr show の省略形) |
| ip -br a | IP アドレスを1行ずつ簡潔に表示する |
| ip link | インターフェースの一覧と状態 |
| ip link set インターフェース名 up / down | インターフェースを有効 / 無効にする |
| ip r | ルーティングテーブル (デフォルトゲートウェイなど) |
| ip neigh | ARP テーブル (同じネットワーク上の機器) |

<pre><code class="example">ip -br a
ip r # default via ... がルーターの IP</code></pre>

<pre><code class="caution">ip addr add で追加した IP アドレスは、再起動すると消える一時的な設定。恒久的に設定するには Netplan を使う。</code></pre>

<pre><code class="tips">Netplan の設定で必要なインターフェース名は、ip link で確認できる。</code></pre>

### netstat

ネットワーク接続やポートの待ち受け状況を表示する。netstat は古い net-tools のコマンドで、現在は後継の ss が標準。

```bash
ss [オプション]
```

| オプション | 説明 |
| --- | --- |
| -t / -u | TCP / UDP を表示する |
| -l | 待ち受け中 (LISTEN) のポートのみ表示する |
| -n | ポート名やホスト名を解決せず、数値で表示する |
| -p | ポートを使用しているプロセスを表示する |
| -a | すべての接続を表示する |

<pre><code class="example">sudo ss -tulpn # 待ち受けているポートとプロセスの一覧
ss -tlnp | grep :80 # 80番ポートを使っているものを探す</code></pre>

<pre><code class="tips">-p でプロセス名を表示するには、sudo が必要。netstat を使う場合は、同じオプションで netstat -tulpn と書ける。</code></pre>

### curl, wget

URL からデータを取得する。

#### curl

```bash
curl [オプション] URL
```

| オプション | 説明 |
| --- | --- |
| -o ファイル名 | 指定した名前で保存する |
| -O | URL のファイル名のまま保存する |
| -L | リダイレクトに従う |
| -I | レスポンスヘッダーのみ取得する |
| -s | 進捗やエラーを表示しない |
| -X メソッド | HTTP メソッドを指定する (POST など) |
| -H "ヘッダー" | リクエストヘッダーを追加する |
| -d データ | リクエストボディを送る |

<pre><code class="example">curl -I https://example.com # ヘッダーのみ確認
curl -L -o file.zip https://example.com/file.zip # リダイレクトに従って保存
curl -X POST -H "Content-Type: application/json" -d '{"name":"test"}' https://example.com/api</code></pre>

#### wget

```bash
wget [オプション] URL
```

| オプション | 説明 |
| --- | --- |
| -O ファイル名 | 指定した名前で保存する |
| -c | 中断したダウンロードを再開する |
| -P ディレクトリ | 保存先のディレクトリを指定する |
| -q | 進捗を表示しない |

<pre><code class="tips">curl はデフォルトで標準出力に表示し、wget はデフォルトでファイルに保存する。</code></pre>

<pre><code class="caution">curl や wget で取得したスクリプトを、内容を確認せずにそのまま bash に渡して実行するのは危険。</code></pre>

### scp, rsync

ネットワーク越しにファイルをコピーする。

```bash
scp [オプション] コピー元 コピー先
```

| オプション | 説明 |
| --- | --- |
| -r | ディレクトリを再帰的にコピーする |
| -P ポート | ポート番号を指定する |
| -i 鍵ファイル | 秘密鍵を指定する |

<pre><code class="example">scp file.txt user@host:/home/user/ # ローカルからリモートへ
scp user@host:/var/log/syslog ./ # リモートからローカルへ
scp -r ./dir user@host:/backup/ # ディレクトリごと</code></pre>

<pre><code class="caution">ポート番号の指定は、scp は大文字の -P、ssh は小文字の -p。</code></pre>

<pre><code class="tips">scp は差分転送や中断からの再開ができない。大きなデータや繰り返しのバックアップには、[rsync](#rsync) のほうが向いている。</code></pre>

### ssh

リモートのマシンに安全に接続する。

```bash
ssh [オプション] ユーザー名@ホスト
```

| オプション | 説明 |
| --- | --- |
| -p ポート | ポート番号を指定する |
| -i 鍵ファイル | 秘密鍵を指定する |
| -L ローカルポート:ホスト:ポート | ローカルポートフォワードを行う |
| -v | 接続の詳細なログを表示する (トラブルシューティング用) |

#### 鍵認証の設定

1. 鍵ペアを作成する。
    ```bash
    ssh-keygen -t ed25519
    ```
2. 公開鍵をサーバーに登録する。
    ```bash
    ssh-copy-id ユーザー名@ホスト
    ```
3. 接続を確認する。
    ```bash
    ssh ユーザー名@ホスト
    ```

#### ~/.ssh/config

接続先を登録しておくと、短い名前で接続できる。

```conf
Host myserver
    HostName 192.168.1.100
    User ユーザー名
    Port 22
    IdentityFile ~/.ssh/id_ed25519
```

```bash
ssh myserver
```

<pre><code class="tips">~/.ssh ディレクトリは 700、秘密鍵は 600 のパーミッションにしておく。</code></pre>

### dig, nslookup

DNS サーバーに問い合わせて、ドメインの情報を調べる。

| コマンド | 説明 |
| --- | --- |
| dig ドメイン | A レコード (IPv4 アドレス) を問い合わせる |
| dig ドメイン MX | レコードの種類を指定する (MX, TXT, NS, AAAA など) |
| dig +short ドメイン | 結果のみを簡潔に表示する |
| dig @8.8.8.8 ドメイン | 問い合わせる DNS サーバーを指定する |
| dig -x IPアドレス | 逆引きする |
| nslookup ドメイン | 名前解決を行う |

<pre><code class="example">dig +short example.com
dig @8.8.8.8 example.com MX</code></pre>

<pre><code class="tips">コマンドが見つからない場合は、dnsutils (新しいバージョンでは bind9-dnsutils) パッケージをインストールする。</code></pre>

---

## シェル操作 <a id="shell-operations" data-name="シェル操作"></a>

### alias

コマンドに別名を付ける。

```bash
alias 名前='コマンド'
```

<pre><code class="example">alias ll='ls -alF' # ll で ls -alF を実行できる
alias # 登録済みの alias を一覧表示
unalias ll # alias を解除</code></pre>

そのシェルを閉じると消えてしまうため、恒久的にする場合は `~/.bashrc` に追記して読み込み直す。

```bash
echo "alias ll='ls -alF'" >> ~/.bashrc
source ~/.bashrc
```

### history

実行したコマンドの履歴を表示・再利用する。

| コマンド | 説明 |
| --- | --- |
| history | 履歴を一覧表示する |
| history 20 | 直近20件を表示する |
| !! | 直前のコマンドを再実行する |
| !N | 履歴番号 N のコマンドを再実行する |
| !文字列 | その文字列で始まる直近のコマンドを再実行する |
| history -c | 現在のシェルの履歴を消去する |

<pre><code class="tips">履歴の検索は Ctrl+R が便利。ショートカット の項を参照。</code></pre>

<pre><code class="caution">パスワードなどをコマンドラインに直接書くと、履歴 (~/.bash_history) に残る。</code></pre>

### echo

文字列や変数の値を表示する。

```bash
echo [オプション] 文字列
```

| オプション | 説明 |
| --- | --- |
| -n | 末尾に改行を付けない |
| -e | `\n` や `\t` などのエスケープシーケンスを解釈する |

<pre><code class="example">echo "Hello"
echo $PATH # 変数の値を表示
echo $? # 直前のコマンドの終了ステータス (0 は成功)
echo "text" > file.txt # ファイルに上書き
echo "text" >> file.txt # ファイルに追記
echo '$HOME' # $HOME (シングルクォートでは変数が展開されない)
echo "$HOME" # /home/ユーザー名</code></pre>

<pre><code class="caution">> は既存の内容を上書きする。追記したい場合は >> を使う。</code></pre>

### export

変数を環境変数として、子プロセスにも引き継ぐ。

```bash
MY_VAR=hello # 現在のシェルのみ有効
export MY_VAR=hello # 子プロセスにも引き継がれる
export PATH="$PATH:$HOME/bin" # PATH に追加
```

| コマンド | 説明 |
| --- | --- |
| export -p | export 済みの変数を一覧表示する |
| unset 変数名 | 変数を削除する |

<pre><code class="tips">そのシェルを閉じると消えるため、恒久的にする場合は ~/.bashrc に追記する。スクリプトの中で設定した変数を現在のシェルに反映するには、source で実行する。</code></pre>

### which, whereis

コマンドの場所を調べる。

| コマンド | 説明 |
| --- | --- |
| which コマンド名 | PATH から見つかった、実行されるファイルの場所を表示する |
| which -a コマンド名 | PATH 上のすべての候補を表示する |
| whereis コマンド名 | 実行ファイル、ソース、man ページの場所を表示する |
| type コマンド名 | alias や組み込みコマンドかどうかも含めて種類を表示する |

<pre><code class="example">which python3
whereis ssh
type cd # cd is a shell builtin</code></pre>

<pre><code class="tips">cd のようなシェルの組み込みコマンドは、which では見つからないことがある。その場合は type を使う。</code></pre>

---

## システム情報 <a id="information" data-name="システム情報"></a>

### hostname

ホスト名を表示する。

| コマンド | 説明 |
| --- | --- |
| hostname | ホスト名を表示する |
| hostname -I | このマシンのすべての IP アドレスを表示する |
| hostname -f | FQDN (完全修飾ドメイン名) を表示する |
| sudo hostnamectl set-hostname 名前 | ホスト名を変更する |

### whoami

現在のユーザー名を表示する。関連するコマンドも合わせて使える。

| コマンド | 説明 |
| --- | --- |
| whoami | 現在のユーザー名 |
| id | ユーザー ID、グループ ID、所属グループ |
| who | 現在ログインしているユーザーの一覧 |
| w | ログイン中のユーザーと、実行中の作業 |

### uptime

システムの稼働時間と負荷を表示する。

```bash
uptime
# 10:23:45 up 5 days,  3:12,  2 users,  load average: 0.15, 0.10, 0.05
```

| オプション | 説明 |
| --- | --- |
| -p | 稼働時間のみ読みやすく表示する |
| -s | 起動した日時を表示する |

<pre><code class="tips">load average は直近 1分・5分・15分 の平均負荷。CPU のコア数より小さければ余裕がある。</code></pre>

### dmesg

カーネルのメッセージ(ハードウェアの認識、ドライバ、エラーなど)を表示する。

```bash
sudo dmesg [オプション]
```

| オプション | 説明 |
| --- | --- |
| -T | 時刻を人間が読める形式で表示する |
| -H | 見やすい形式で表示する (ページャー付き) |
| -w | 新しいメッセージを待ち受けて追従する |
| --level=err,warn | エラーと警告のみ表示する |

<pre><code class="example">sudo dmesg -T | tail -n 20 # 直近のメッセージ
sudo dmesg -T --level=err,warn # エラーと警告のみ</code></pre>

<pre><code class="tips">USB メモリや HDD を接続した直後に実行すると、デバイス名 (sdb など) が割り当てられたかを確認できる。一般ユーザーだと権限エラーになる環境が多いので、sudo を付ける。</code></pre>

### lscpu, lsblk, lshw

ハードウェアの情報を表示する。

| コマンド | 説明 |
| --- | --- |
| lscpu | CPU の情報 (モデル、コア数、キャッシュなど) |
| lsblk | ブロックデバイス (ディスクやパーティション) をツリー表示する |
| lsblk -f | ファイルシステムの種類や UUID も表示する |
| sudo lshw -short | ハードウェアの一覧を簡潔に表示する |
| sudo lshw -class disk | ディスクの詳細を表示する |

<pre><code class="tips">lsblk -f では、blkid と同じように UUID を確認できる。マウントの設定は ディスク管理 の項を参照。</code></pre>

---

## 圧縮・解凍 <a id="comp-and-decomp" data-name="圧縮・解凍"></a>

### tar

複数のファイルを1つにまとめたり(アーカイブ)、展開したりする。

```bash
tar [オプション] アーカイブ名 [対象]
```

| オプション | 説明 |
| --- | --- |
| -c | アーカイブを作成する |
| -x | アーカイブを展開する |
| -t | アーカイブの内容を一覧表示する |
| -v | 処理中のファイル名を表示する |
| -f | アーカイブのファイル名を指定する |
| -z | gzip で圧縮・展開する (.tar.gz) |
| -j | bzip2 で圧縮・展開する (.tar.bz2) |
| -J | xz で圧縮・展開する (.tar.xz) |
| -C ディレクトリ | 展開先のディレクトリを指定する |

<pre><code class="example">tar -czvf archive.tar.gz dir/ # dir を gzip で圧縮
tar -xzvf archive.tar.gz # 展開
tar -xzvf archive.tar.gz -C /tmp # 展開先を指定
tar -tf archive.tar.gz # 展開せずに中身を確認</code></pre>

<pre><code class="tips">-f は直後にアーカイブ名を取るため、オプションをまとめるときは最後に置く。展開時は圧縮形式を自動で判別してくれるので、-z などは省略できる。</code></pre>

<pre><code class="caution">展開先に同名のファイルがあると、確認なしで上書きされる。</code></pre>

### gzip, gunzip

ファイルを gzip 形式で圧縮・展開する。

```bash
gzip [オプション] ファイル
gunzip ファイル.gz
```

| オプション | 説明 |
| --- | --- |
| -k | 元のファイルを残す |
| -d | 展開する (gunzip と同じ) |
| -1 〜 -9 | 圧縮レベルを指定する (数字が大きいほど圧縮率が高い) |

<pre><code class="example">gzip file.txt # file.txt.gz ができ、元のファイルは消える
gzip -k file.txt # 元のファイルを残して圧縮
gunzip file.txt.gz # 展開</code></pre>

<pre><code class="tips">gzip はディレクトリをそのまま圧縮できない。複数のファイルをまとめるときは tar と組み合わせる。</code></pre>

### zip, unzip

zip 形式で圧縮・展開する。Windows とのやりとりに向いている。

```bash
sudo apt install zip unzip
```

| コマンド | 説明 |
| --- | --- |
| zip -r アーカイブ.zip ディレクトリ/ | ディレクトリを再帰的に圧縮する |
| zip -e アーカイブ.zip ファイル | パスワード付きで圧縮する |
| unzip アーカイブ.zip | 展開する |
| unzip アーカイブ.zip -d 展開先 | 展開先を指定する |
| unzip -l アーカイブ.zip | 展開せずに中身を確認する |

<pre><code class="tips">Windows で作った zip のファイル名が文字化けする場合は、unzip -O cp932 アーカイブ.zip で展開できることがある (環境による)。</code></pre>

<pre><code class="caution">zip -e の暗号化は強度が低い。機密性が必要なデータには向かない。</code></pre>

### bzip2, bunzip2

bzip2 形式で圧縮・展開する。gzip よりも圧縮率が高いが、時間がかかる。

```bash
bzip2 [オプション] ファイル
bunzip2 ファイル.bz2
```

| オプション | 説明 |
| --- | --- |
| -k | 元のファイルを残す |
| -d | 展開する (bunzip2 と同じ) |

<pre><code class="example">bzip2 -k file.txt # file.txt.bz2 ができ、元のファイルも残る
bunzip2 file.txt.bz2 # 展開</code></pre>

<pre><code class="tips">ディレクトリを圧縮する場合は、tar -cjvf archive.tar.bz2 dir/ のように tar と組み合わせる。</code></pre>

---

## Netplan <a id="netplan" data-name="Netplan"></a>

ipアドレスの固定やネットワークの設定にはnetplanを使う。

### 設定ファイルを検索

```bash
ls /etc/netplan/
```

`01-netcfg.yaml` や `50-cloud-init.yaml` 等があり、適宜読み替える。

<pre><code class="tips">複数ファイルがある場合は、念のために元のファイルの拡張子を .back とし、 99-custom-config.yaml のような名前でひとつのファイルにまとめるのが慣習。</code></pre>

### 設定ファイルを書き換える

```bash
sudo vim /etc/netplan/01-netcfg.yaml
```

```yaml
network:
     version: 2
     ethernets:
       enp3s0: # 自分の環境のインターフェース名
         dhcp4: no
         addresses: [1192.168.1.100/24] # 固定したいIP
         routes:
           - to: default
             via: 192.168.0.1 # ルーターのIP
         nameservers:
           addresses: [8.8.8.8, 8.8.4.4] # GoogleなどのDNS
```

<pre><code class="tips">ip link で自分の環境インターフェース名は確認可能。</code></pre>

### 設定を適用

```bash
sudo netplan apply
```

---

## wslpath windows_path <a id="wslpath" data-name="wslpath"></a>

WSL2側でWindowsのパスをUnixパスに変換する公式コマンド。<br>
ファイルが存在するかどうかは判定しない。

<pre><code class="example">wslpath 'C:\Users\hoge\Documents\test.txt'
# /mnt/c/Users/hoge/Documents/test.txt</code></pre>

---

## `rsync [option] src dst` <a id="rsync" data-name="rsync"></a>

rsyncはLinuxやUnix系システムで広く使用されるファイル同期、バックアップ用のコマンドラインツール。

<pre><code class="tips">コピー元とコピー先は、ローカルパスまたはリモートパス<strong>例: user@host:/path/to/dir</strong>を指定できる。</code></pre>

### よく使われるオプション

| オプション        | 説明 |
| --- | --- |
| -a                | アーカイブモードで実行。<br>再帰的コピー、シンボリックリンク、パーミッション、タイムスタンプ、所有者、グループ情報などを保持する。 |
| -v                | 詳細情報を表示する。処理中のファイル名などが表示される。 |
| -z                | データを圧縮して転送する。ネットワーク帯域の節約になる。 |
| -P                | 進行状況を表示し、転送が中断された場合に再開できるようにする。 |
| --delete          | コピー元に存在しないファイルをコピー先から削除する。 |
| --exclude=PATTERN | 指定したパターンに一致するファイルやディレクトリを除外する。 |
| -e ssh            | SSHを使用してリモートホストと通信する。セキュアな転送が可能。 |

<pre><code class="caution">コピー元のパスの末尾にスラッシュ(/)を付けるかどうかで動作が変わる。
/を付けるとディレクトリの内容のみが同期され、付けないとディレクトリ自体が含まれる。</code></pre>

#### リモートサーバーへのバックアップ

<pre><code class="example">rsync -avz ./data/ user@remotehost:/backup/data/</code></pre>

#### ファイルの削除を含む同期

<pre><code class="example">rsync -av --delete ./src/ ./dst/</code></pre>

#### 除外パターンを指定した同期

<pre><code class="example">rsync -av --exclude='*.log' ./src/ ./dst/</code></pre>

---

## Samba <a id="samba" data-name="Samba"></a>

Samba は 他のデバイスから Linux への接続を円滑にしてくれる。

### 導入

パッケージリストを更新してSambaをインストール。

```bash
sudo apt update
sudo apt install samba
```

### 共有ディレクトリの作成

ディレクトリの作成と権限の付与。

```bash
mkdir ~/share
chmod 777 ~/share
```

### Sambaの設定

設定ファイルを編集。

```bash
sudo vim /etc/samba/smb.conf
```

```bash
[Ubuntu-Share] # ネットワーク上で表示される名前
    path = /home/ユーザー名/share # フルパスを指定
    writable = yes
    guest ok = no
    read only = no
    force user = ユーザー名
```

共有ディレクトリ配下のシンボリックリンクからのアクセスを許可する場合、`[global]` セクションに以下を追記。

```bash
[global]
    follow symlinks = yes # リンクを辿ることを許可
    wide links = yes # 共有ディレクトリの外を指すリンクを許可
    unix extensions = no # wide links を機能させる
```

共有ディレクトリにも追記しておくと確実。

```bash
[Ubuntu-Share]
    # 省略
    follow symlinks = yes
    wide links = yes
```

<pre><code class="tips"># ln -s [リンク先の実体パス] [作成するリンクの名前]
sudo ln -s /data/movies /mnt/share/movies</code></pre>

### Sambaユーザーの登録

Samba 専用のパスワードを設定する必要がある。

```bash
sudo smbpasswd -a ユーザー名
```

パスワードの入力を求められる。

### 再起動

```bash
sudo systemctl restart smbd nmbd
```

### ファイヤーウォールの許可(必要な場合)

```bash
sudo ufw allow samba
```

### 接続確認

Windowsのエクスプローラーに入力。

```bash
\\UbuntuのIPアドレス\
```

---

## シェルスクリプト <a id="shell-script" data-name="シェルスクリプト"></a>

### 実行

スクリプトファイルの冒頭に

```bash
#!/bin/bash
```

と書くと、サブプロセスとしてbashを起動して以後のコマンドを実行することができる。これを`shebang(シェバン)`という。

```bash
chmod +x script.sh # 実行権限を付与
./script.sh # 実行
```

このように実行権限を付与して実行する。

<pre><code class="tips">shebang は #!/usr/bin/env bash と書くこともできる。PATH から bash を探して実行するため、bash が /bin 以外にある環境でも動く。</code></pre>

また、

```bash
bash script.sh
```

としてもサブプロセスとして実行でき、この場合は実行権限を付しなくても実行できる。<br>
サブシェルとして起動することにより、`cd`や`export`といったシェルの状態を変更するコマンドが、親プロセスに影響を与えない。

また、逆に

```bash
source script.sh # または . script.sh
```

とするとサブシェルを起動せずに実行でき、`cd`や`export`のようなシェルの状態を変更するコマンドが、現在のシェルにも影響を与える。

### パス

| 種類 | 例 | 説明 |
| --- | --- | --- |
| 絶対パス | `/home/user/file.txt` | ルート `/` から始まる |
| 相対パス | `./file.txt` `../file.txt` | `.` は現在のディレクトリ、`..` は親ディレクトリ |

### ワイルドカード(グロブ)

ファイル名のパターンは、コマンドに渡される前にシェルが展開する。

| 記号 | 意味 | 例 |
| --- | --- | --- |
| `*` | 任意の文字列 | `rm *.log` |
| `?` | 任意の1文字 | `file?.txt` は file1.txt や fileA.txt に一致 |
| `[]` | 文字集合のいずれか1文字 | `file[123].txt` は file1.txt〜file3.txt に一致 |
| `{}` | ブレース展開。指定した文字列に展開する (パターンマッチではない) | `touch file{1..5}.txt` で file1.txt〜file5.txt を作成 |

### クォートとエスケープ

| 記法 | 説明 |
| --- | --- |
| `" "` | 変数やコマンド置換が展開される |
| `' '` | 展開されず、すべて文字列として扱われる |
| `\` | 直後の1文字の特殊な意味を打ち消す |

<pre><code class="example">name="taro"
echo "hello $name" # hello taro
echo 'hello $name' # hello $name
echo \$HOME # $HOME</code></pre>

`\` を行末に置くと、コマンドを次の行に続けて書ける。

```bash
gcc main.c \
    sub.c \
    -o app
```

<pre><code class="caution">\ の直後に空白が入ると行継続にならず、エラーになる。</code></pre>

#### 変数はダブルクォートで囲む

シェルは空白で単語を分割するため、クォートしない変数は意図しない形に展開される。

```bash
file="hello world.txt"
rm $file # rm hello world.txt と展開され、2つのファイルを指定したことになる
rm "$file" # 1つのファイルとして扱われる
```

<pre><code class="tips">変数は基本的にダブルクォートで囲む。空の変数が引数から消えてしまう事故も防げる (rm -rf "$dir"/* のように書く)。</code></pre>

### 変数

```bash
name="taro"
echo "$name"
```

<pre><code class="caution">= の前後にスペースを入れてはいけない。name = "taro" と書くと、name というコマンドを実行しようとしてエラーになる。</code></pre>

`$HOME` や `$PATH` などの環境変数も同じように参照できる。子プロセスに引き継ぐには `export` を使う ([シェル操作](#shell-operations))。

#### 特殊変数

| 変数 | 説明 |
| --- | --- |
| `$0` | スクリプト名 |
| `$1` `$2` ... | 第1引数、第2引数... |
| `$@` | すべての引数 (`"$@"` とクォートして使う) |
| `$#` | 引数の数 |
| `$?` | 直前のコマンドの終了ステータス |

```bash
for arg in "$@"; do
    echo "$arg"
done
```

### 標準入出力とリダイレクト

Linux のコマンドは、3つのデータの流れを使って動く。

| 名前 | 番号 | 説明 |
| --- | --- | --- |
| stdin | 0 | 標準入力 |
| stdout | 1 | 標準出力 (通常の出力) |
| stderr | 2 | 標準エラー出力 |

| 記法 | 説明 |
| --- | --- |
| `> ファイル` | 標準出力をファイルに上書きする |
| `>> ファイル` | 標準出力をファイルに追記する |
| `< ファイル` | ファイルを標準入力として渡す |
| `2> ファイル` | 標準エラー出力をファイルに書き出す |
| `&> ファイル` | 標準出力とエラー出力の両方を書き出す (bash 限定) |
| `2>&1` | 標準エラー出力を、標準出力と同じ出力先にする |

<pre><code class="example">echo hello > file.txt
sort < file.txt
command > out.log 2> err.log # 通常出力とエラーを分けて保存
command > /dev/null # 出力を捨てる
command > /dev/null 2>&1 # 通常出力もエラーも捨てる</code></pre>

<pre><code class="tips">/dev/null は、書き込まれたデータをすべて捨てる特殊なファイル。</code></pre>

<pre><code class="caution">2>&1 は書く順番が重要。> file 2>&1 は両方がファイルに出力されるが、2>&1 > file ではエラー出力が端末に残る。</code></pre>

#### ヒアドキュメント・ヒアストリング

複数行の文字列や、文字列そのものを標準入力として渡す。

```bash
cat << EOF
hello
world
EOF
```

```bash
mysql << EOF
SELECT * FROM users;
EOF
```

```bash
grep hello <<< "hello world"
```

<pre><code class="tips">開始の区切りを << 'EOF' のようにクォートすると、本文中の変数が展開されなくなる。</code></pre>

### パイプ

前のコマンドの標準出力を、次のコマンドの標準入力に渡す。

```bash
cat log.txt | grep ERROR | sort | uniq
```

長くなる場合は、`\` で改行すると読みやすい。

```bash
cat log.txt \
    | grep ERROR \
    | sort \
    | uniq
```

<pre><code class="tips">シェルは、小さなコマンドをパイプでつないで目的の処理を組み立てる考え方で作られている。Docker や CI/CD のスクリプトも、この発想の延長にある。</code></pre>

#### tee

標準出力に表示しつつ、ファイルにも保存する。

```bash
command | tee output.log
command | tee -a output.log # 追記
```

#### xargs

標準入力の内容を、コマンドの引数として渡す。

```bash
find . -name "*.txt" | xargs rm # 空白を含むファイル名で壊れる
find . -name "*.txt" -print0 | xargs -0 rm # 安全な書き方
```

<pre><code class="tips">-print0 と -0 を組み合わせると、ファイル名を区切り文字 NUL で受け渡すため、空白や改行を含む名前でも安全に処理できる。</code></pre>

### コマンド置換と算術

```bash
today=$(date) # コマンドの結果を変数に入れる
echo "$today"
n=$((1 + 2)) # 算術演算
((n++)) # インクリメント
```

<pre><code class="tips">コマンド置換の古い書き方にバッククォート(`date`)があるが、入れ子にしづらいので $( ) を使う。</code></pre>

<pre><code class="caution">n が 0 のとき ((n++)) は終了ステータス 1 を返すため、set -e の下ではスクリプトが止まってしまう。n=$((n + 1)) なら問題ない。</code></pre>

### 終了コードと条件実行

Linux のコマンドは、成功なら `0`、失敗ならそれ以外の数値を終了ステータスとして返す。

```bash
echo $? # 直前のコマンドの終了ステータス
exit 1 # スクリプトを終了ステータス 1 で終了する
```

```bash
make && ./app # 成功したときだけ次を実行
mkdir dir || echo "failed" # 失敗したときだけ次を実行
```

### 条件分岐

```bash
if [ -f file.txt ]; then
    echo "exists"
fi
```

| 条件 | 説明 |
| --- | --- |
| `-f ファイル` | 通常のファイルが存在する |
| `-d ディレクトリ` | ディレクトリが存在する |
| `-z 文字列` | 文字列が空である |
| `"$a" = "hello"` | 文字列が等しい |

| 数値比較 | 意味 |
| --- | --- |
| `-eq` | 等しい (==) |
| `-ne` | 等しくない (!=) |
| `-gt` / `-ge` | より大きい (>) / 以上 (>=) |
| `-lt` / `-le` | より小さい (<) / 以下 (<=) |

```bash
if [ "$n" -gt 10 ]; then
    echo "big"
fi
```

<pre><code class="tips">[ ] は test コマンドの別名で、[ -f file ] と test -f file は同じ意味。[ ] の内側の両端には、スペースが必要。</code></pre>

#### [[ ]]

bash 拡張の条件式。パターンマッチができ、変数をクォートし忘れても単語分割されにくい。

```bash
if [[ "$name" == *.txt ]]; then
    echo "text file"
fi
```

#### case

1つの値に対して、複数のパターンで分岐する。

```bash
case "$1" in
    start)
        echo start
        ;;
    stop)
        echo stop
        ;;
    *)
        echo "usage: $0 start|stop"
        ;;
esac
```

<pre><code class="tips">コマンドライン用のスクリプトで、サブコマンドの切り替えによく使われる。</code></pre>

### ループ

#### for

```bash
for file in *.txt; do
    echo "$file"
done
```

<pre><code class="caution">for f in $(ls) は、空白を含むファイル名が分割されて壊れる。ワイルドカードで直接指定する。</code></pre>

#### while

```bash
while IFS= read -r line; do
    echo "$line"
done < file.txt
```

<pre><code class="tips">IFS= と -r を付けると、行頭の空白やバックスラッシュがそのまま読み込まれる。</code></pre>

#### shift

引数を1つずつ左にずらす。引数を順番に処理するときに使う。

```bash
while [ $# -gt 0 ]; do
    echo "$1"
    shift
done
```

### 関数

```bash
hello() {
    echo "hello"
}

hello
```

<pre><code class="tips">関数の引数も $1, $2 で受け取る。これはスクリプト本体の引数とは別に扱われる。</code></pre>

### グループ化とサブシェル

| 記法 | 説明 |
| --- | --- |
| `( )` | サブシェルで実行する。cd や変数の変更が呼び出し元に影響しない |
| `{ }` | 現在のシェルでコマンドをグループ化する |

```bash
(cd dir && ls) # 実行後も、カレントディレクトリは変わらない
```

```bash
{
    echo hello
    echo world
} > out.txt # グループ全体の出力をまとめてリダイレクト
```

### バックグラウンド実行

```bash
command & # バックグラウンドで実行
wait # バックグラウンドのジョブがすべて終わるまで待つ
nohup python app.py & # ログアウトしても実行を続ける
```

<pre><code class="tips">nohup の出力は、デフォルトでは nohup.out に書き込まれる。実行中のジョブの操作は、プロセス管理の jobs, fg, bg を参照。</code></pre>

### 安全に書くための設定

```bash
set -euo pipefail
```

| オプション | 説明 |
| --- | --- |
| `-e` | コマンドが失敗したら、その場でスクリプトを終了する |
| `-u` | 未定義の変数を参照したらエラーにする |
| `-o pipefail` | パイプの途中のコマンドが失敗した場合も、失敗として扱う |

#### trap

スクリプトの終了時などに、指定した処理を実行する。

```bash
trap 'rm -f temp.txt' EXIT # どんな終わり方でも一時ファイルを削除
```

#### デバッグ

```bash
set -x # 実行するコマンドを表示する
set +x # 解除
```

```bash
bash -x script.sh # スクリプト全体をデバッグ表示で実行
```

#### ShellCheck

シェルスクリプトの静的解析ツール。クォートの漏れなどを指摘してくれる。

```bash
sudo apt install shellcheck
shellcheck script.sh
```

オンライン版は [ShellCheck](https://www.shellcheck.net) で試せる。

### bash と sh の違い

| 種類 | 特徴 |
| --- | --- |
| sh | POSIX 準拠の最低限の機能 |
| bash | sh を拡張したもの。配列、`[[ ]]`、`&>`、高機能な補完など |

```bash
arr=("a" "b" "c")
echo "${arr[0]}" # 要素の参照
echo "${arr[@]}" # すべての要素
```

<pre><code class="caution">#!/bin/sh と書いているのに bash の構文を使うと、動かない環境がある。Ubuntu や Debian では /bin/sh は dash なので、[[ ]] や配列はエラーになる。sh script.sh のように実行した場合も、shebang に関係なく sh で動く。</code></pre>

---

## ショートカット <a id="short-cut" data-name="ショートカット"></a>

<table>
<caption>移動</caption>
<tr><th>ショートカットキー</th><th>説明</th></tr>
<tr><td>Ctrl+A</td><td>カーソルを行頭へ</td></tr>
<tr><td>Ctrl+E</td><td>カーソルを行末へ</td></tr>
<tr><td>Ctrl+→ または Alt+F</td><td>カーソルを1単語右へ</td></tr>
<tr><td>Ctrl+← または Alt+B</td><td>カーソルを1単語左へ</td></tr>
</table>

<table>
<caption>操作</caption>
<tr><th>ショートカットキー</th><th>説明</th></tr>
<tr><td>Ctrl+K</td><td>カーソル位置から行末までを削除</td></tr>
<tr><td>Ctrl+U</td><td>カーソル位置から行頭までを削除</td></tr>
<tr><td>Ctrl+W</td><td>後方に1単語分削除</td></tr>
<tr><td>Ctrl+Y</td><td>最後に削除した内容を挿入</td></tr>
<tr><td>Ctrl+L</td><td>画面をクリア(内容は残る)</td></tr>
<tr><td>Tab</td><td>ディレクトリ名やファイル名やコマンドを補完</td></tr>
</table>

<table>
<caption>コマンド履歴</caption>
<tr><th>ショートカットキー</th><th>説明</th></tr>
<tr><td>↑ と ↓</td><td>実行したコマンドの履歴を順番に表示</td></tr>
<tr><td>Ctrl+R</td><td>実行したコマンドの履歴から検索を行う。再度キーを入力すると履歴をさかのぼる。</td></tr>
<tr><td>Ctrl+S</td><td>行き過ぎたときにひとつ前に戻る(ただし多くの場合、スクロールロックが割り当てられている)</td></tr>
<tr><td>Enter</td><td>検索結果を実行</td></tr>
<tr><td>Esc</td><td>検索結果を表示したままターミナルに戻る</td></tr>
<tr><td>Ctrl+G</td><td>検索結果を破棄してターミナルに戻る</td></tr>
</table>

<table>
<caption>スクロールロック</caption>
<tr><th>ショートカットキー</th><th>説明</th></tr>
<tr><td>Ctrl+S</td><td>ターミナルの画面をロックする。入力は受け付けている(スクロールロック)</td></tr>
<tr><td>Ctrl+Q</td><td>ロックを解除</td></tr>
</table>

<table>
<caption>状態</caption>
<tr><th>ショートカットキー</th><th>説明</th></tr>
<tr><td>Ctrl+C</td><td>実行中のプロセスを強制的に終了</td></tr>
<tr><td>Ctrl+D</td><td>現在のユーザーからログアウト</td></tr>
<tr><td>Ctrl+Z</td><td>実行中のジョブをバックグラウンドへ(fgで戻す)</td></tr>
</table>

---