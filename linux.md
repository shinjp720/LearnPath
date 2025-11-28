---
title: Linux
layout: default
---

# Linux <a id="top" data-name="TOP"></a>


- Linuxは、UNIXを基にして開発されたオープンソースのオペレーティングシステム。

---

## コマンド <a id="command" data-name="コマンド"></a>

<div class="subtitle">基本構文</div>

```bash
コマンド [オプション] [引数]
```

- 2つ以上のオプションを指定する場合、`ハイフン(-)`の後ろにまとめて書くこともできる。

<div class="example">
    <code>ls -aF</code>
</div>

- `ハイフン2つ(--)`で始まるオプション(ロングオプション)もあり、一意であれば以後の文字列を省略することもできる。

<div class="example">
    <code>
        ls --quote-name<br>
        ls --quote
    </code>
</div>

- また引数を受け取るロングオプションでは、引数との間に`スペース`を入れるか`イコール(=)`で引数を指定する。

<div class="example">
    <code>
        ls --width 30<br>
        ls --width=30
    </code>
</div>

---

## パッケージ管理 <a id="package-management" data-name="パッケージ管理"></a>

### apt update<br>apt upgrade

updateでインデックスを更新して、upgradeで実際にインストールする。

---

## ユーティリティーツール <a id="utility-tool" data-name="ユーティリティーツール"></a>

### wslpath windowsPath

WSL2側でWindowsのパスをUnixパスに変換する公式コマンド。<br>ファイルが存在するかどうかは判定しない。

<pre><code class="example">wslpath 'C:\Users\hoge\Documents\test.txt'
# /mnt/c/Users/hoge/Documents/test.txt</code></pre>

### rsync [option] src dst
rsyncはLinuxやUnix系システムで広く使用されるファイル同期、バックアップ用のコマンドラインツール。
<pre><code class="tips">コピー元とコピー先は、ローカルパスまたはリモートパス<b>例: user@host:/path/to/dir</b>を指定できる。</code></pre>

<div class="subtitle">よく使われるオプション</div>

| オプション        | 説明                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| -a                | アーカイブモードで実行。<br>再帰的コピー、シンボリックリンク、パーミッション、タイムスタンプ、所有者、グループ情報などを保持する。 |
| -v                | 詳細情報を表示する。処理中のファイル名などが表示される。                                                                           |
| -z                | データを圧縮して転送する。ネットワーク帯域の節約になる。                                                                           |
| -P                | 進行状況を表示し、転送が中断された場合に再開できるようにする。                                                                     |
| --delete          | コピー元に存在しないファイルをコピー先から削除する。                                                                               |
| --exclude=PATTERN | 指定したパターンに一致するファイルやディレクトリを除外する。                                                                       |
| -e ssh            | SSHを使用してリモートホストと通信する。セキュアな転送が可能。                                                                      |

<pre><code class="caution">コピー元のパスの末尾にスラッシュ(/)を付けるかどうかで動作が変わる。<br>/を付けるとディレクトリの内容のみが同期され、付けないとディレクトリ自体が含まれる。</code></pre>

<div class="subtitle">リモートサーバーへのバックアップ</div>
<pre><code class="example">rsync -avz ./data/ user@remotehost:/backup/data/</code></pre>

<div class="subtitle">ファイルの削除を含む同期</div>
<pre><code class="example">rsync -av --delete ./src/ ./dst/</code></pre>

<div class="subtitle">除外パターンを指定した同期</div>
<pre><code class="example">rsync -av --exclude='*.log' ./src/ ./dst/</code></pre>

---

## ファイル・ディレクトリ操作 <a id="file-management" data-name="ファイル管理"></a>

### ls
### cd
### pwd
### mkdir
### rmdir
### cp
### mv
### rm
### find











---

## テキスト処理 <a id="text-processing" data-name="テキスト処理"></a>

### grep
### awk
### sed
### cut
### sort
### uniq





---

## ファイル表示・編集 <a id="viewing-and-editing-filea" data-name="ファイル閲覧・編集"></a>

### cat
### more/less
### head/tail
### nano, vim, emacs


---

## プロセス管理

### ps
### top
### htop 
### kill
### pkill
### nice
### renice
### jobs
### fg
### bg


---

## 権限・ユーザー管理 <a id="user-management" data-name="権限・ユーザー管理"></a>

### sudo
### su
### chmod
### chown
### passwd
### useradd, usermod, userdel




---

## システム管理 <a id="system-management" data-name="システム管理"></a>

### ps
### top, htop
### kill, killall
### systemctl
### df
### du
### free
### uname

---

## ネットワーク <a id="network" data-name="ネットワーク"></a>

### ping
### ifconfig, ip
### netstat
### curl, wget
### scp, rsync
### ssh
### dig, nslookup






---

## シェル操作 <a id="shell-operations" data-name="シェル操作"></a>

### alias
### history
### echo
### export
### which, whereis






---

## システム情報 <a id="information" data-name="システム情報"></a>

### hostname
### whoami
### uptime
### dmesg
### lscpu, slblk, lshw




---

## 圧縮・解凍 <a id="comp-and-decomp" data-name="圧縮・解凍"></a>

### tar
### gzip, gunzip
### zip, unzip
### bzip2, bunzip2







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