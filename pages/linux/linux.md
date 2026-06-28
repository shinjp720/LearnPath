---
title: Linux
layout: default
---

# Linux <a id="top" data-name="TOP"></a>

- Linuxは、UNIXを基にして開発されたオープンソースのオペレーティングシステム。

---

## スクリプト <a id="script" data-name="スクリプト"></a>




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

## プロセス管理 <a id="" data-name=""></a>

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