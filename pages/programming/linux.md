<div data-title="Linux"></div>
<a id="top" data-name="TOP">

# Linux

- Linuxは、UNIXを基にして開発されたオープンソースのオペレーティングシステム。

---

<a id="command" data-name="コマンド">

## コマンド

- Linuxのコマンドは通常、以下のような形をとる。

<div class="example">
    <code>コマンド [オプション] [引数]</code>
</div>

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

<a id="package-management" data-name="パッケージ管理">

## パッケージ管理

### apt update<br>apt upgrade

: updateでインデックスを更新して、upgradeで実際にインストールする。

---

<a id="utility-tool" data-name="ユーティリティーツール">

## ユーティリティーツール

### wslpath windowsPath
: WSL2側でWindowsのパスをUnixパスに変換する公式コマンド。<br>ファイルが存在するかどうかは判定しない。
<div class="example">
    <code>
        wslpath 'C:\Users\hoge\Documents\test.txt'<br>
        /mnt/c/Users/hoge/Documents/test.txt # 出力例
    </code>
</div>

### rsync [option] src dst
: rsyncはLinuxやUnix系システムで広く使用されるファイル同期、バックアップ用のコマンドラインツール。
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

<a id="file-management" data-name="ファイル管理">

## ファイル管理

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

<a id="text-processing" data-name="テキスト処理">

## テキスト処理
### grep
### awk
### sed
### cut
### sort
### uniq





---

<a id="viewing-and-editing-filea" data-name="ファイル閲覧・編集">

## ファイル閲覧・編集

### cat
### more/less
### head/tail
### nano, vim, emacs


---

<a id="comp-and-decomp" data-name="圧縮・解凍">

## 圧縮・解凍

### tar
### gzip, gunzip
### zip, unzip
### bzip2, bunzip2





---

<a id="network" data-name="ネットワーク">

## ネットワーク

### ping
### ifconfig, ip
### netstat
### curl, wget
### scp, rsync
### ssh
### dig, nslookup






---

<a id="system-management" data-name="システム管理">

## システム管理

### ps
### top, htop
### kill, killall
### systemctl
### df
### du
### free
### uname




---

<a id="user-management" data-name="権限・ユーザー管理">

## 権限・ユーザー管理

### sudo
### su
### chmod
### chown
### passwd
### useradd, usermod, userdel




---

<a id="shell-operations" data-name="シェル操作">

## シェル操作

### alias
### history
### echo
### export
### which, whereis






---

<a id="information" data-name="システム情報">

## システム情報

### hostname
### whoami
### uptime
### dmesg
### lscpu, slblk, lshw



---

<a id="shell-script" data-name="シェルスクリプト">

## シェルスクリプト

### 実行

- スクリプトファイルの冒頭に<br>`#!/bin/bash`<br>と書くとサブプロセスとしてbashを起動して以後のコマンドを実行することができる。これを`shebang(シェバン)`という。

```bash
chmod +x script.sh # 実行権限を付与
./script.sh # 実行
```

: このように実行権限を付与して実行する。

- また、
```bash
bash script.sh
```

- としてもサブプロセスとして実行でき、この場合は実行権限を付しなくても実行できる。<br>サブシェルとして起動することにより、`cd`や`export`といったシェルの状態を変更するコマンドが、親プロセスに影響を与えない。

- また、逆に

```bash
source script.sh # または . script.sh
```

とするとサブシェルを起動せずに実行でき、`cd`や`export`のようなシェルの状態を変更するコマンドが、現在のシェルにも影響を与える。