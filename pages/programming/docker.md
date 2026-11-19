---
title: Docker
layout: default
---

# Docker <a id="top" data-name="top"></a>

Docker は、アプリケーションを、実行に必要なライブラリや設定ごと、「コンテナ」にまとめて動かすための仕組みである。どの環境でも同じ状態で動かせるため、開発環境の統一、デプロイ、テストの自動化などに使われる。

このノートは、Linux (Ubuntu) への導入、基本のコマンド、Dockerfile、BuildKit と buildx、Docker Compose、セキュリティの順にまとめている。

---

## 概要 <a id="overview" data-name="概要"></a>

### 主な要素

| 要素 | 内容 |
| --- | --- |
| イメージ | コンテナの元になる、読み取り専用のテンプレート。アプリと、その実行環境を含む |
| コンテナ | イメージから起動した、実行中 (または停止中) のプロセスの環境 |
| Dockerfile | イメージの作り方を書いたファイル |
| レジストリ | イメージを保管して配布する場所 (Docker Hub など) |
| ボリューム | コンテナを削除しても残る、データの保存場所 |
| ネットワーク | コンテナどうしや、ホストとの通信の経路 |
| Docker Compose | 複数のコンテナを、1つの設定ファイル (`compose.yaml`) でまとめて管理する |
| BuildKit / buildx | イメージをビルドする仕組みと、そのコマンド (`docker buildx`) |

### 全体の流れ

```text
Dockerfile ──docker build──▶ イメージ ──docker run──▶ コンテナ
                               │
                       docker push / pull
                               │
                               ▼
                          レジストリ
```

### 仮想マシンとの違い

| | コンテナ | 仮想マシン |
| --- | --- | --- |
| OS のカーネル | ホストと共有する | ゲスト OS ごとに持つ |
| 起動の速さ | 速い (プロセスを起動するだけ) | 遅い (OS を起動する) |
| サイズ | 小さい | 大きい |
| 分離の強さ | プロセス単位 (カーネルは共有) | OS 単位 (より強い) |

### バージョンについて

<pre><code class="caution">このノートは、Docker Engine 29 系 (確認した最新は 29.9.1、2026年10月) と、Docker Compose v5 系 (確認した最新は 5.8.0) を前提にしている。
ハイフン付きの docker-compose コマンド (Compose v1) は、サポートが終了している。docker compose (スペース区切り) を使う。</code></pre>

Docker Engine 29 で変わった主な点は、次のとおりである。

| 変更 | 内容 |
| --- | --- |
| イメージストア | 新規にインストールした環境では、containerd のイメージストアが既定になった。既存の環境は、これまでの方式 (graph driver) が続く |
| ファイアウォール | iptables の代わりに、nftables を直接使うバックエンドが追加された (`--firewall-backend=nftables`)。導入時点では、実験的な機能だった |
| API のバージョン | Engine が受け付ける、クライアントの API の最小バージョンが上がった。古いクライアント (Docker 24 以前など) は、接続できないことがある |

<pre><code class="caution">古いクライアントから接続できない場合は、クライアントを更新する。
一時的な対処として、daemon.json の min-api-version で、受け付ける最小の API バージョンを下げられるが、古い API は、セキュリティ上のリスクがあるため、恒久的には使わない。
nftables の状態は変わる可能性があるため、使う前に、公式ドキュメントで確認する。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

<pre><code class="tips">Linux 内で完結する方法。</code></pre>

### 公式リポジトリの準備

```bash
# 必要なツールのインストール
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg util-linux-extra

# Docker 公式の暗号鍵を追加
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# リポジトリを APT のソースに追加
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

<pre><code class="tips">上の手順は、鍵を docker.gpg に変換して、docker.list に書く、従来の形式である。現在も使える。
現在の公式ドキュメントは、鍵をそのまま docker.asc として保存し、deb822 形式の docker.sources に書く手順になっている (下の「現在の公式の手順」を参照)。</code></pre>

#### 現在の公式の手順 (deb822 形式)

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings

# 鍵は、変換せずに、そのまま保存する
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# リポジトリを、deb822 形式で追加する
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt-get update
```

<pre><code class="caution">docker.list と docker.sources の両方を残すと、同じリポジトリが、二重に設定されたという警告が、apt に出る。
どちらか片方の手順だけを使う。</code></pre>

| 項目 | 内容 |
| --- | --- |
| 対応する Ubuntu | 24.04、22.04 の LTS のほか、25.10、26.04 (確認した公式ドキュメントの記載) |
| `0755` | ディレクトリの権限 (所有者は読み書き実行、他は読み実行) |
| 他の導入方法 | 手動でパッケージをダウンロードする方法と、`get.docker.com` の便利スクリプトがある。便利スクリプトは、本番環境には勧められていない |

### 本体と Compose のインストール

```bash
sudo apt-get update
# 本体と、Compose プラグインをまとめてインストール
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### sudo を付けずに Docker を実行するための設定

```bash
# ① docker グループに自分 ($USER) を追加
sudo usermod -aG docker $USER

# ② 設定を反映させる (一度ログアウトして再ログインでも OK) 
newgrp docker
```

<pre><code class="caution">docker グループのユーザーは、事実上、そのマシンの root と同じ権限を持つ (コンテナ経由で、ホストのファイルを操作できるため)。
信頼できるユーザーだけを追加する。</code></pre>

<pre><code class="tips">newgrp docker は、そのシェルだけに、グループを反映する。他のターミナルには、再ログインが必要になる。
newgrp コマンドは、Ubuntu では、login パッケージに含まれており、util-linux-extra を入れなくても使える (Ubuntu 24.04 で確認)。</code></pre>

### 動作確認

```bash
# Docker のサービスの状態
sudo systemctl status docker

# バージョン (クライアントとサーバーの両方が表示される)
docker version
docker compose version
docker buildx version

# テスト用のイメージを実行する (取得して、メッセージを表示して終了する)
docker run hello-world
```

<pre><code class="tips">docker version でサーバーの項目が表示されない場合は、Docker のサービスが起動していないか、権限がない。
sudo を付けて実行できるなら、docker グループの設定を確認する。</code></pre>

<pre><code class="caution">コンテナのポートをホストに公開すると、ufw や firewalld で設定したルールが、効かなくなる (Docker が、独自にファイアウォールのルールを追加するため)。
公開する範囲を絞りたい場合は、ポートの指定に、ホストのアドレスを付ける (例: 127.0.0.1:8080:80)。</code></pre>

---

## 基本のコマンド <a id="commands" data-name="基本のコマンド"></a>

### コンテナの実行 (docker run)

```bash
docker run [オプション] イメージ名[:タグ] [コマンド] [引数...]
```

| オプション | 説明 |
| --- | --- |
| `-d` | バックグラウンドで実行する |
| `-it` | 対話的に操作する (標準入力を開いて、疑似端末を割り当てる) |
| `--rm` | 終了したときに、コンテナを自動で削除する |
| `--name 名前` | コンテナに名前を付ける |
| `-p ホスト側:コンテナ側` | ポートを公開する (例: `-p 8080:80`) |
| `-v ホスト側:コンテナ側` | ホストのディレクトリをマウントする。ホスト側が名前なら、名前付きボリューム |
| `-e 変数名=値` | 環境変数を設定する |
| `--env-file ファイル` | 環境変数をまとめたファイルを読み込む |
| `--network 名前` | 接続するネットワークを指定する |
| `--restart ポリシー` | 再起動の方針 (`no`、`on-failure`、`always`、`unless-stopped`) |

```bash
# nginx を、バックグラウンドで起動して、ホストの 8080 番ポートに公開する
docker run -d --name web -p 8080:80 nginx

# 使い捨てのコンテナで、シェルを開く
docker run --rm -it ubuntu:22.04 bash
```

### コンテナの管理

| コマンド | 説明 |
| --- | --- |
| `docker ps` | 実行中のコンテナの一覧 (`-a` で、停止中も含む) |
| `docker stop コンテナ` / `docker start コンテナ` | 停止 / 開始 |
| `docker restart コンテナ` | 再起動 |
| `docker rm コンテナ` | 停止しているコンテナを削除する (`-f` で、実行中でも強制的に削除) |
| `docker logs コンテナ` | ログを表示する (`-f` で、追い続ける) |
| `docker exec -it コンテナ コマンド` | 実行中のコンテナの中で、コマンドを実行する (例: `docker exec -it web bash`) |
| `docker cp コピー元 コピー先` | ホストとコンテナの間で、ファイルをコピーする (例: `docker cp web:/etc/nginx/nginx.conf .`) |
| `docker inspect 名前` | 詳細な情報を、JSON で表示する |
| `docker stats` | CPU やメモリの使用量を、リアルタイムで表示する |

### イメージの管理

| コマンド | 説明 |
| --- | --- |
| `docker pull イメージ名:タグ` | レジストリから、イメージを取得する |
| `docker images` | ローカルのイメージの一覧 (`docker image ls` と同じ) |
| `docker rmi イメージ` | イメージを削除する |
| `docker tag 元 新しい名前:タグ` | イメージに、別の名前 (タグ) を付ける |
| `docker push イメージ名:タグ` | レジストリに、イメージを送る (先に `docker login` が必要) |
| `docker history イメージ` | イメージのレイヤーの一覧を表示する |

### ボリュームとネットワーク

| コマンド | 説明 |
| --- | --- |
| `docker volume ls` / `create` / `rm` | ボリュームの、一覧 / 作成 / 削除 |
| `docker network ls` / `create` / `rm` | ネットワークの、一覧 / 作成 / 削除 |

```bash
# 名前付きボリュームに、データを保存する (コンテナを削除しても残る)
docker run -d --name cache -v redisdata:/data redis

# 同じネットワークのコンテナは、コンテナ名で、互いに通信できる
docker network create mynet
docker run -d --name web --network mynet nginx
docker run --rm --network mynet curlimages/curl http://web
```

<pre><code class="tips">同じユーザー定義ネットワークに接続したコンテナどうしは、コンテナ名 (Compose ではサービス名) で、名前解決できる。
Compose は、プロジェクトごとにネットワークを自動で作るため、サービス名を、そのままホスト名として使える。</code></pre>

### ディスクの確認と掃除

| コマンド | 説明 |
| --- | --- |
| `docker system df` | イメージ、コンテナ、ボリューム、ビルドキャッシュの、ディスクの使用量 |
| `docker container prune` | 停止しているコンテナを、すべて削除する |
| `docker image prune` | どのコンテナからも使われていない、タグのないイメージを削除する (`-a` で、使われていないイメージ全部) |
| `docker builder prune` | ビルドキャッシュを削除する |
| `docker system prune` | 未使用のコンテナ、ネットワーク、イメージなどを、まとめて削除する (ボリュームも消す場合は `--volumes`) |

<pre><code class="caution">prune 系のコマンドは、確認のあと、元に戻せない形で削除する。
特に、--volumes を付けた system prune は、データを保存したボリュームも消すことがある。実行する前に、docker system df や docker volume ls で、対象を確認する。</code></pre>

---

## Dockerfile <a id="docker-file" data-name="DockerFile"></a>

- `#` から始まる行はコメント
- 命令部分は大文字・小文字を区別しない (慣例として大文字を使う)
- 複数コマンドは `&&` でつなげる
- `\`(バックスラッシュ) で改行をエスケープする
- 作業ディレクトリに `Dockerfile` という名前でファイルを作成する

| 命令 | 説明 |
|---|---|
| `FROM イメージ名`<br>例: `FROM ubuntu:22.04` | ベースとなるイメージを指定 |
| `RUN シェルコマンド` | ビルド時に実行するシェルコマンド。<br>実行結果はイメージに反映される |
| `CMD ["コマンド", "引数", ...]` | コンテナ起動時のデフォルトコマンド。<br>コマンドライン側で別コマンドを指定すると上書きされる。<br>有効なのは1つのみ |
| `ENTRYPOINT ["コマンド", "引数", ...]` | 必ず実行するコマンド。<br>`docker run` 末尾の引数は追加引数として扱われる |
| `WORKDIR パス` | 作業ディレクトリを指定 (存在しなければ新規作成) |
| `COPY コピー元 コピー先` | ファイル/ディレクトリをコピー |
| `ADD 追加元 追加先` | `COPY` と違い URL 指定や zip の自動展開が可能 |
| `ENV 変数名=値` | コンテナ内に環境変数を設定 |
| `ARG 変数名[=値]` | Dockerfile 内でのみ使える一時変数 |
| `USER ユーザー名` | 指定したユーザーで実行 |
| `EXPOSE ポート番号` | 使用ポートを明示 (ホスト公開には `run` 時の `-p` が別途必要) |

<pre><code class="tips"><code class="code-like">RUN apt update &amp;&amp; apt install -y ...</code> のように &amp;&amp; でまとめるとレイヤーが1つになりイメージが軽くなる。
逆に別々の RUN に分けるとレイヤーごとのキャッシュが効きやすくなるというトレードオフもある。
CMD は「デフォルト値」、ENTRYPOINT は「固定の実行コマンド」というイメージで使い分けると分かりやすい。
両方を組み合わせ、 ENTRYPOINT を固定コマンド、CMD をそのデフォルト引数にするパターンもよく使われる。</code></pre>

**例:**

```dockerfile
FROM ubuntu:22.04
RUN apt update && apt install -y python3.11 python3-pip
ENTRYPOINT ["python3", "test.py"]
```

**ビルドコマンド**

```bash
docker build [オプション] パス
```

| オプション | 説明 |
|---|---|
| `-f 名前` | ビルドする Dockerfile 名を指定 (デフォルト: `Dockerfile`) |
| `-t イメージ名:タグ` | イメージのタグを指定 |
| `--target 名前` | マルチステージビルドで、ビルドするステージを指定 |
| `--build-arg 名前=値` | `ARG` に値を渡す |
| `--no-cache` | キャッシュを使わずにビルド |
| `--pull` | ベースイメージの、新しいバージョンを、常に取得する |
| `--platform プラットフォーム` | ビルドする CPU アーキテクチャ (例: `linux/amd64`) |
| `--secret id=名前,src=ファイル` | ビルド中だけ使うシークレットを渡す (`RUN --mount=type=secret` で読む) |
| `--progress=plain` | ビルドの出力を、省略せずに、そのまま表示する |
| `--check` | ビルドせずに、Dockerfile の問題を検査する |


### 追加の命令

| 命令 | 説明 |
| --- | --- |
| `HEALTHCHECK [オプション] CMD コマンド` | コンテナが正常に動いているかを、定期的に確認するコマンドを指定する |
| `LABEL キー=値` | イメージにメタデータを付ける |
| `VOLUME パス` | マウントポイントを宣言する (指定しなければ、匿名ボリュームが作られる) |
| `SHELL ["シェル", "オプション"]` | `RUN` などのシェル形式で使う、既定のシェルを変える |
| `STOPSIGNAL シグナル` | `docker stop` で、コンテナに送るシグナルを指定する |
| `ONBUILD 命令` | このイメージをベースにして、別のイメージをビルドするときに、実行される命令を登録する |
| `MAINTAINER` | 非推奨。代わりに `LABEL maintainer="名前"` を使う |

### HEALTHCHECK

コンテナ内のアプリが、正常に応答するかを、定期的に確認する。結果は、`docker ps` の `STATUS` に、`healthy` や `unhealthy` として表示され、Compose の `depends_on` の条件にも使える。

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

| オプション | 説明 |
| --- | --- |
| `--interval` | 確認の間隔 |
| `--timeout` | 1回の確認に、かけられる時間 |
| `--start-period` | 起動直後の、失敗を数えない期間 |
| `--start-interval` | `--start-period` の間の、確認の間隔 |
| `--retries` | 何回連続で失敗したら、`unhealthy` とするか |

<pre><code class="tips">確認のコマンドは、イメージの中にあるコマンドしか使えない。curl が入っていない軽量なイメージでは、アプリ自身に確認用のコマンドを持たせるか、別の方法を使う。</code></pre>

### マルチステージビルド <a id="multi-stage" data-name="マルチステージビルド"></a>

1つの Dockerfile に、複数の `FROM` を書いて、ビルドを段階 (ステージ) に分ける方法。ビルド用のステージで、コンパイラやビルドツールを使い、最終のステージには、**成果物だけ**をコピーする。実行に必要のないツールが、最終のイメージに残らないため、イメージが小さくなり、攻撃される面も減る。

```dockerfile
# syntax=docker/dockerfile:1

# ステージ 1: ビルド用 (コンパイラが入った大きなイメージ)
FROM golang:1 AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/app .

# ステージ 2: 実行用 (成果物だけを持つ小さなイメージ)
FROM alpine:3
COPY --from=builder /out/app /usr/local/bin/app
USER nobody
ENTRYPOINT ["app"]
```

| 書き方 | 説明 |
| --- | --- |
| `FROM イメージ AS 名前` | ステージに名前を付ける (名前を付けなければ、0 から始まる番号で参照できる) |
| `COPY --from=名前 コピー元 コピー先` | 前のステージから、ファイルをコピーする |
| `COPY --from=イメージ名 コピー元 コピー先` | 別のイメージから、直接コピーする (例: `--from=nginx:latest`) |
| `docker build --target 名前` | 指定したステージまでビルドして、そこで止める |
| `FROM scratch` | 空のイメージ。静的にリンクされたバイナリだけを置くときに使う |

最後のステージが、最終のイメージになる。`--target` を使うと、途中のステージを、イメージにできる。

```bash
# 最終のステージ (通常のイメージ) をビルド
docker build -t myapp .

# builder ステージで止めて、デバッグ用のイメージにする
docker build --target builder -t myapp:debug .
```

#### フロントエンドの例

Node.js でビルドして、静的ファイルを nginx で配信する。Vue や React などの、ビルド結果が静的ファイルになるアプリで、よく使われる構成である。

```dockerfile
# syntax=docker/dockerfile:1

FROM node:lts AS build
WORKDIR /app

# 依存関係の定義だけを、先にコピーして、キャッシュを効かせる
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

#### 開発用と本番用を、1つの Dockerfile にまとめる

```dockerfile
# syntax=docker/dockerfile:1

FROM node:lts AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
```

`docker build --target dev .` や、Compose の `build.target` で、使うステージを選べる (<a href="#docker-compose">Docker Compose</a> の章を参照)。

<pre><code class="tips">BuildKit は、最終のイメージに必要のないステージを、ビルドしない。ステージを分けても、使わないステージの分だけ、ビルドが遅くなることはない。
依存関係の定義 (package.json など) を先にコピーして、依存のインストールを、ソースコードのコピーより前に書くと、ソースだけを変えたときに、インストールのレイヤーのキャッシュが使われる。</code></pre>

<pre><code class="caution">alpine や scratch は、glibc のない、または、ほとんど何もない環境である。ビルド用のステージで、glibc に依存してコンパイルしたバイナリは、動かないことがある。
実行用のイメージには、ビルド用のイメージと、互換性のある (同じ系統の) ベースを選ぶか、静的にリンクする。
scratch は、CA 証明書も持たないため、HTTPS で通信するアプリでは、証明書をコピーする必要がある。</code></pre>

### .dockerignore <a id="dockerignore" data-name="dockerignore"></a>

ビルドのコンテキスト (`docker build` に渡すディレクトリ) から、除外するファイルを書く。ビルドの速度と、イメージの安全性のために、ほぼ必須のファイルである。

```text
# バージョン管理のデータ
.git
.gitignore

# 依存関係とビルドの成果物 (イメージの中で、作り直す)
node_modules
target
dist

# 秘密情報とログ
.env
*.log
```

| 効果 | 内容 |
| --- | --- |
| ビルドが速くなる | 大きなディレクトリを、Docker に送らなくてよい |
| キャッシュが効く | 関係のないファイルが変わっても、`COPY . .` のレイヤーが、無効にならない |
| 秘密情報を含めない | `.env` などが、イメージに入ることを防ぐ |

### ビルドの指針

| 指針 | 理由 |
| --- | --- |
| ベースイメージのタグを、具体的に指定する (`node:22-slim` など)。`latest` は避ける | 同じ Dockerfile から、同じイメージを作れる |
| 必要最小限のベースを選ぶ (`-slim`、`alpine`、マルチステージ) | イメージが小さくなる |
| 変わりにくい命令を上に、変わりやすい命令を下に書く | レイヤーのキャッシュが、使われやすくなる |
| `apt-get install` には、`--no-install-recommends` を付けて、同じ `RUN` の中で、パッケージリストを消す | 不要なファイルを、レイヤーに残さない |
| `USER` で、root 以外のユーザーを指定する | コンテナが乗っ取られたときの影響を、減らす |
| 秘密情報を、`ENV` や `ARG` に書かない | `docker history` で、見えてしまう (代わりに、シークレットマウントを使う) |
| `COPY` を使い、`ADD` は、URL や tar の展開が必要なときだけ使う | 動作が、予測しやすい |
| `exec 形式` (`["コマンド", "引数"]`) で、`CMD` と `ENTRYPOINT` を書く | シェルを経由せず、シグナルが、アプリに直接届く |
| `docker build --check` や hadolint で、Dockerfile を検査する | 問題を、ビルドの前に見つける |

<pre><code class="tips">シェル形式 (CMD python app.py のような書き方) は、/bin/sh -c を経由して実行されるため、docker stop のシグナルが、アプリに届かないことがある。
アプリが、停止の指示を受け取れるように、exec 形式を使う。</code></pre>

---

## BuildKit と buildx <a id="buildkit" data-name="BuildKitとbuildx"></a>

BuildKit は、Docker のイメージをビルドする仕組みで、現在の `docker build` は、BuildKit を使う。キャッシュの扱いが賢く、複数のステージの並列ビルド、シークレットの安全な受け渡し、マルチプラットフォームのビルドなどができる。`docker buildx` は、BuildKit の機能を、すべて使うためのコマンドである。

### syntax ディレクティブ

Dockerfile の**1行目**に書く、特別なコメント。使う Dockerfile の文法のバージョン (フロントエンド) を、指定する。

```dockerfile
# syntax=docker/dockerfile:1
```

`docker/dockerfile:1` と書くと、後方互換性が保たれた、最新の安定版が使われる。新しい機能 (下記) を使う Dockerfile には、先頭に付けておく。

### RUN --mount

`RUN` の実行中だけ、ファイルやディレクトリをマウントする。マウントした内容は、イメージのレイヤーに残らない。

| 種類 | 用途 |
| --- | --- |
| `type=cache` | ビルドをまたいで、残るキャッシュ (パッケージマネージャーのダウンロードなど) |
| `type=secret` | 秘密情報を、ビルド中だけ読めるようにする |
| `type=ssh` | SSH エージェントを転送する (非公開のリポジトリの取得など) |
| `type=bind` | ビルドのコンテキストや、他のステージのファイルを、コピーせずに読む |
| `type=tmpfs` | 一時的なメモリ上の領域 |

#### キャッシュのマウント

```dockerfile
# syntax=docker/dockerfile:1
FROM node:lts
WORKDIR /app
COPY package.json package-lock.json ./

# npm のキャッシュを、ビルドをまたいで再利用する
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
```

依存関係が変わって、インストールのレイヤーが、無効になっても、ダウンロード済みのパッケージが、キャッシュから使われる。

#### シークレットのマウント

```dockerfile
# syntax=docker/dockerfile:1
FROM alpine:3
RUN --mount=type=secret,id=token \
    cat /run/secrets/token > /dev/null
```

```bash
# ビルド時に、ファイルとして渡す
docker build --secret id=token,src=./token.txt .
```

<pre><code class="caution">秘密情報を、ARG や ENV で渡すと、docker history でイメージの履歴から、読み取れてしまう。
ビルド中に、トークンなどが必要な場合は、必ず type=secret を使う。マウントした内容は、レイヤーに残らない。</code></pre>

### ヒアドキュメント

`RUN` や `COPY` で、複数行のスクリプトや、ファイルの内容を、書ける。`&&` と `\` でつなぐ代わりに、読みやすく書ける。

```dockerfile
# syntax=docker/dockerfile:1
FROM debian:stable-slim

RUN <<EOF
set -e
apt-get update
apt-get install -y --no-install-recommends curl
rm -rf /var/lib/apt/lists/*
EOF

COPY <<EOF /etc/app.conf
port = 8080
mode = production
EOF
```

<pre><code class="tips">ヒアドキュメントの RUN は、1行ずつ、エラーを検知しない。スクリプトの先頭に set -e を書くと、途中のコマンドが失敗したときに、ビルドを止められる。</code></pre>

### COPY と ADD の追加機能

| オプション | 説明 | 必要な syntax のバージョン |
| --- | --- | --- |
| `--chmod` | コピーしたファイルの、権限を指定する | 1.2 |
| `--link` | 前のレイヤーに依存しない形でコピーする。ベースイメージが変わっても、このレイヤーのキャッシュを再利用できる | 1.4 |
| `--exclude` | パターンに一致するファイルを、除いてコピーする | 1.19 |
| `--parents` | 親のディレクトリの構造を保ったまま、コピーする | 1.20 |
| `ADD --checksum` | `ADD` で取得した、URL の内容を、ハッシュで検証する | (公式ドキュメントで確認) |

<pre><code class="tips">バージョンは、公式ドキュメントの記載による。# syntax=docker/dockerfile:1 を使っていれば、安定版の最新が使われるため、通常は、バージョンを意識しなくてよい。</code></pre>

### ビルドのチェック

```bash
# ビルドせずに、Dockerfile の問題 (非推奨の書き方など) を検査する
docker build --check .
```

### キャッシュの共有 (CI など)

CI の環境のように、毎回、まっさらな環境でビルドする場合は、キャッシュを、外部に保存して、次回のビルドで読み込む。

```bash
docker buildx build \
  --cache-to type=registry,ref=myorg/app:buildcache,mode=max \
  --cache-from type=registry,ref=myorg/app:buildcache \
  -t myorg/app:latest .
```

| キャッシュの種類 | 保存先 |
| --- | --- |
| `type=registry` | コンテナレジストリ |
| `type=gha` | GitHub Actions のキャッシュ |
| `type=local` | ローカルのディレクトリ |

### マルチプラットフォームビルド

1回のビルドで、`amd64` と `arm64` など、複数の CPU アーキテクチャ向けのイメージを作る。

```bash
# 複数のプラットフォームに対応できる、ビルダーを作って使う
docker buildx create --use

# 2 種類のアーキテクチャ向けに、ビルドして、レジストリに送る
docker buildx build --platform linux/amd64,linux/arm64 -t myorg/app:latest --push .
```

<pre><code class="tips">Apple Silicon の Mac などで作ったイメージを、amd64 のサーバーで動かすと、exec format error になる。
--platform linux/amd64 を指定するか、マルチプラットフォームでビルドする。</code></pre>

### buildx bake

複数のイメージの、ビルドの設定を、ファイル (HCL、JSON、または Compose ファイル) にまとめて、`docker buildx bake` で、一度にビルドする。

```hcl
# docker-bake.hcl
group "default" {
  targets = ["app"]
}

target "app" {
  context    = "."
  dockerfile = "Dockerfile"
  tags       = ["myorg/app:latest"]
  platforms  = ["linux/amd64", "linux/arm64"]
}
```

```bash
# 設定の内容を確認する
docker buildx bake --print

# ビルドする
docker buildx bake
```

<pre><code class="tips">docker compose build のビルドも、BuildKit を使う。Compose v5 では、Compose 内蔵のビルダーが廃止され、ビルドは buildx (bake を含む) に任される。</code></pre>

---

## Docker Compose <a id="docker-compose" data-name="Docker Compose"></a>

### 基本コマンド

| コマンド | 説明 |
|---|---|
| `docker compose up`<br>`-d`: バックグラウンド起動<br>`--build`: 起動の前に、毎回イメージをビルドする (変更のないレイヤーは、キャッシュが使われるため高速) | サービスの起動/再起動 |
| `docker compose down`<br>`--rmi all`: イメージ・コンテナを一括削除<br>`--rmi local`: ローカルビルドしたイメージ・コンテナを削除 | サービスの停止とコンテナの削除 |
| `docker compose exec コンテナ名 コマンド` | コマンドの実行 |
| `docker compose logs` | ログの表示 |
| `docker compose ps` | コンテナの一覧を表示 |
| `docker compose start` / `stop` | サービスの開始/停止 |
| `docker compose build` | イメージをビルドする (変更のないレイヤーは、キャッシュが使われる) |
| `docker compose create` | コンテナの作成のみ |
| `docker compose run` | サービスの設定で、1回限りのコマンドを実行する (新しいコンテナを作る。`--rm` で、終了後に削除) |
| `docker compose up --wait` | ヘルスチェックを含めて、サービスの準備ができるまで待つ (バックグラウンドで起動する) |
| `docker compose watch` | ファイルの変更を監視して、コンテナに同期、または再ビルドする (`develop.watch` の設定が必要) |
| `docker compose config` | `compose.yaml` を検証して、変数の展開と、複数ファイルのマージ後の内容を表示する (`-q` で検証だけ) |
| `docker compose pull` | イメージを取得する |
| `docker compose restart` | サービスを再起動する |
| `docker compose images` | サービスが使っているイメージの一覧 |
| `docker compose down -v` | コンテナと一緒に、名前付きボリュームも削除する |

### compose.yaml の主な項目

| 項目 | 説明 |
|---|---|
| `services:` | 任意のサービス名を定義 |
| `image:` | ベースイメージ/ビルド済みイメージ名 |
| `build:` | Dockerfile の格納先を指定 |
| `container_name:` | コンテナ名 |
| `expose:` | コンテナ間でのみ公開するポート (ホストには非公開) |
| `ports:`<br>例: `"8080:80"` | ホストに公開するポート (`ホスト側:コンテナ側`) |
| `environment:` | 環境変数を直接指定 |
| `env_file:`<br>例: `.env` | 環境変数をまとめたファイルを指定 |
| `volumes:` | ボリュームのマウント/名前付きボリューム |
| `depends_on:` | サービス間の依存関係 |
| `stdin_open:` | 標準入力の受付 |
| `tty:` | 疑似 TTY 端末の割り当て |
| `command:` | デフォルトのコマンドを上書き |
| `logging:` | ログドライバとオプション |
| `healthcheck:` | ヘルスチェックの設定 (`test`、`interval`、`timeout`、`retries`、`start_period`) |
| `restart:` | 再起動の方針 (`no`、`always`、`on-failure`、`unless-stopped`) |
| `networks:` | 接続するネットワーク |
| `profiles:` | 指定したプロファイルのときだけ、サービスを起動する |
| `secrets:` / `configs:` | シークレットと設定ファイルを、ファイルとしてマウントする |
| `develop:` | 開発用の設定 (`watch` による、自動同期など) |
| `working_dir:` / `user:` / `entrypoint:` | 作業ディレクトリ / 実行ユーザー / `ENTRYPOINT` の上書き |
| `platform:` | 実行するプラットフォーム (例: `linux/amd64`) |
| `post_start:` / `pre_stop:` / `pre_start:` | ライフサイクルフック |

<pre><code class="caution">トップレベルの version: '3' 指定は現行の Docker Compose (v2, Compose Specification) では非推奨 (無視される) 。
新規作成時は省略してよい。</code></pre>

**`.env` の例**
```env
BASE_DIR=/var/mydb
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=practice_db
```

**単一サービスの例**
```yaml
services:
  db:
    image: mypython:1
    container_name: mypy
    volumes:
      - ./src:/var/app/src
```

**複数の Dockerfile を読み込む例 (`Dockerfile.app` / `Dockerfile.db` を用意)**
```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.app
    ports:
      - "8080:8080"
    depends_on:
      - db

  db:
    build:
      context: .
      dockerfile: Dockerfile.db
    ports:
      - "3306:3306"
```

<pre><code class="tips">設定ファイルの名前は、compose.yaml が推奨されている。docker-compose.yml や docker-compose.yaml も、引き続き読み込まれる。
設定を書き換えたあとは、docker compose config -q で、文法と変数の展開を、検証できる (エラーがなければ、何も表示されない)。</code></pre>

### ビルドの設定

`build:` には、Dockerfile の場所のほか、ビルド時の引数や、マルチステージの `target` も、指定できる。

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      target: dev          # マルチステージの、使うステージ
      args:
        NODE_ENV: development
    ports:
      - "5173:5173"
```

| 項目 | 説明 |
| --- | --- |
| `context:` | ビルドのコンテキスト (ディレクトリ、または Git の URL) |
| `dockerfile:` | コンテキストからの、Dockerfile の相対パス |
| `target:` | マルチステージビルドで、ビルドするステージ名 |
| `args:` | ビルド時の引数 (Dockerfile の `ARG`) |
| `platforms:` | ビルドするプラットフォームのリスト |
| `secrets:` | ビルド中に使う、シークレット |

### 起動順序とヘルスチェック

`depends_on` は、既定では、コンテナが「起動する」ことしか待たない。データベースが、接続を受け付けるまで待つには、`healthcheck` と、`condition: service_healthy` を組み合わせる。

```yaml
services:
  web:
    build: .
    depends_on:
      db:
        condition: service_healthy
        restart: true
      redis:
        condition: service_started

  redis:
    image: redis

  db:
    image: postgres:18
    environment:
      POSTGRES_PASSWORD: example
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
```

| `condition` | 待つ内容 |
| --- | --- |
| `service_started` | 起動すること (既定) |
| `service_healthy` | `healthcheck` が、成功すること |
| `service_completed_successfully` | 正常終了すること (マイグレーションなど、1回で終わる処理) |

`restart: true` を付けると、依存先のサービスが、Compose の操作で更新または再起動されたとき、このサービスも、自動で再起動される。

```bash
# ヘルスチェックを含めて、サービスの準備ができるまで待つ (バックグラウンドで起動する)
docker compose up --wait
```

<pre><code class="caution">healthcheck の test の中で、環境変数を、コンテナ内のシェルで展開したい場合は、$$ と書く ($${POSTGRES_USER} など)。
$ 1つだと、Compose が、コンテナの外 (ホストの環境) の値として展開してしまう。</code></pre>

### 環境変数の扱い

| 方法 | 内容 |
| --- | --- |
| `.env` ファイル | compose.yaml の中の `${変数}` を展開するための値。プロジェクトのディレクトリに置くと、自動で読み込まれる |
| `env_file:` | ファイルの内容を、**コンテナの環境変数**として渡す |
| `environment:` | コンテナの環境変数を、直接書く |

```yaml
services:
  db:
    image: mysql:${MYSQL_VERSION:-8}
    env_file:
      - .env
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE:?MYSQL_DATABASE を設定してください}
```

| 展開の書き方 | 意味 |
| --- | --- |
| `${VAR}` | `VAR` の値 (未設定なら、空文字列) |
| `${VAR:-既定値}` | `VAR` が未設定、または空なら、既定値 |
| `${VAR:?メッセージ}` | `VAR` が未設定、または空なら、メッセージを出して、エラーにする |
| `$$` | `$` そのもの |

<pre><code class="caution">.env には、パスワードなどの秘密情報が入りやすい。Git にコミットしない (.gitignore に追加し、.dockerignore にも追加する)。
同じ変数が、シェルの環境変数、.env、environment など、複数の場所で設定されたときの優先順位は、公式ドキュメントの「Environment variables precedence」を参照する。</code></pre>

### ボリュームとネットワーク

トップレベルの `volumes:` と `networks:` で、名前付きボリュームや、ネットワークを定義して、サービスから使う。

```yaml
services:
  web:
    image: nginx
    networks:
      - front
  api:
    image: myapi
    networks:
      - front
      - back
  cache:
    image: redis
    networks:
      - back
    volumes:
      - cachedata:/data

networks:
  front:
  back:
    internal: true   # 外部 (インターネット) への通信を遮断する

volumes:
  cachedata:
```

| 項目 | 説明 |
| --- | --- |
| 名前付きボリューム | Docker が管理する保存場所。`docker compose down` では削除されず、`docker compose down -v` で削除される |
| バインドマウント | ホストのディレクトリを、そのままマウントする (`./src:/var/app/src`)。開発向き |
| `networks:` | 指定しなければ、プロジェクトの既定のネットワークに、すべてのサービスが接続される |
| `internal: true` | 外部への通信を遮断した、ネットワーク (データベースなどを、置くとき) |

<pre><code class="caution">docker compose down -v は、名前付きボリュームを削除する。データベースのデータも、消える。
本番に近いデータを扱う環境では、-v を付けない。</code></pre>

### プロファイル (profiles)

サービスに `profiles:` を付けると、そのプロファイルを指定したときだけ、起動する。デバッグ用や、テスト用のサービスを、通常の起動から外せる。

```yaml
services:
  app:
    image: myapp

  debug:
    image: busybox
    command: sleep 3600
    profiles:
      - debug
```

```bash
# app だけが起動する
docker compose up -d

# debug も起動する
docker compose --profile debug up -d

# 環境変数でも指定できる
COMPOSE_PROFILES=debug docker compose up -d
```

### 複数ファイルと include

| 方法 | 内容 |
| --- | --- |
| `compose.override.yaml` | `compose.yaml` と同じ場所に置くと、自動でマージされる。開発用の設定の上書きに向く |
| `-f` を複数指定する | `docker compose -f compose.yaml -f compose.prod.yaml up` のように、指定した順にマージする |
| `include:` | 別の Compose ファイルを、丸ごと取り込む。取り込んだファイルの相対パスや環境変数は、そのファイルの場所を基準に処理される |
| `extends:` | 別のファイルのサービスの設定を、継承する |

```yaml
# compose.yaml
include:
  - path: ./db/compose.yaml

services:
  app:
    image: myapp
    depends_on:
      - db
```

```bash
# マージした結果を、確認する
docker compose -f compose.yaml -f compose.prod.yaml config
```

### Compose Watch (開発用の自動同期) <a id="compose-watch" data-name="ComposeWatch"></a>

ソースコードの変更を監視して、コンテナに、自動で反映する。バインドマウントの代わりに、使うことができる (Compose 2.22 以降)。

```yaml
services:
  web:
    build: .
    command: npm start
    develop:
      watch:
        # ソースの変更を、コンテナにコピーする
        - action: sync
          path: ./web
          target: /app/web
          ignore:
            - node_modules/

        # package.json が変わったら、イメージを作り直す
        - action: rebuild
          path: package.json

        # 設定ファイルが変わったら、コピーして、コンテナを再起動する
        - action: sync+restart
          path: ./proxy/nginx.conf
          target: /etc/nginx/conf.d/default.conf
```

```bash
# ログと一緒に、監視を開始する
docker compose up --watch

# ログとは別に、監視だけを開始する
docker compose watch
```

| `action` | 動作 | 向いている場面 |
| --- | --- | --- |
| `sync` | 変更したファイルを、コンテナにコピーする | インタープリタ言語のソースコード、静的ファイル |
| `rebuild` | イメージを作り直して、コンテナを作り直す | 依存関係の定義 (`package.json`)、コンパイルが必要なコード |
| `sync+restart` | コピーして、コンテナを再起動する (2.23 以降) | 設定ファイルの変更 |
| `sync+exec` | コピーして、コンテナの中で、コマンドを実行する (2.32 以降) | 設定の再読み込み |
| `restart` | コンテナを再起動する (2.32 以降) | |

<pre><code class="tips">sync は、コンテナの中のファイルを、ホストの変更に合わせて書き換える。サービスが、ファイルの変更を自分で検知して再読み込みする (ホットリロード) 場合に、効果的である。
node_modules などの、ホストと異なるビルド結果は、ignore に追加して、同期の対象から外す。</code></pre>

### シークレットと設定ファイル

秘密情報や、設定ファイルは、`environment:` に直接書くよりも、トップレベルの `secrets:` と `configs:` で、ファイルとしてマウントする方が、安全に扱える。

```yaml
services:
  app:
    image: myapp
    secrets:
      - db_password
    configs:
      - source: app_config
        target: /etc/app/config.toml

secrets:
  db_password:
    file: ./db_password.txt

configs:
  app_config:
    file: ./config.toml
```

`secrets` は、コンテナの中の `/run/secrets/名前` に、ファイルとして置かれる。環境変数のように、`docker inspect` や、子プロセスに、見えてしまうことがない。

### ライフサイクルフック

サービスの起動や停止の前後に、コマンドを実行する。

```yaml
services:
  app:
    image: myapp:latest
    post_start:
      - command: ["./seed.sh"]
    pre_stop:
      - command: ["./flush.sh"]
```

| フック | 実行される場所とタイミング |
| --- | --- |
| `post_start` | 起動した、サービスのコンテナの中で、起動の直後に実行する |
| `pre_stop` | サービスのコンテナの中で、停止の直前に実行する |
| `pre_start` | 起動の前に、専用の一時的なコンテナで実行する (初期化用のコンテナ。新しい機能のため、対応するバージョンは、公式ドキュメントで確認する) |

<pre><code class="tips">1回だけ実行したい初期化処理 (マイグレーションなど) は、別のサービスにして、restart: "no" を付け、他のサービスから condition: service_completed_successfully で待つ方法もある。</code></pre>

### Compose v5

Compose のバージョンは、古い Compose ファイルの形式の「v2」「v3」との混同を避けるため、v2 の次が、v5 になった (v3 と v4 はない)。

| 変更 | 内容 |
| --- | --- |
| Go の SDK | Compose の機能を、他のアプリケーションから、ライブラリとして使えるようになった |
| ビルド | Compose 内蔵のビルダーが廃止された。ビルドは、buildx (bake を含む) に任される |
| リモートの定義 | OCI レジストリや、Git リポジトリ上の Compose ファイルを、`-f` で指定できる (例: `docker compose -f oci://...`) |

<pre><code class="tips">docker compose version で、使っているバージョンを確認できる。
docker-compose (ハイフン付き) が見つかる場合は、サポートが終了した v1 である。docker-compose-plugin を入れて、docker compose に切り替える。</code></pre>


---

## セキュリティ <a id="security" data-name="セキュリティ"></a>

### イメージとビルド

| 対策 | 内容 |
| --- | --- |
| root 以外で実行する | Dockerfile の `USER` で、一般ユーザーを指定する |
| 小さなイメージを使う | `-slim`、`alpine`、マルチステージビルドで、不要なツールを入れない |
| 秘密情報を、イメージに含めない | `ENV`、`ARG`、`COPY` で渡さない。ビルド中は `RUN --mount=type=secret`、実行時は Compose の `secrets` を使う |
| タグの代わりに、ダイジェストで固定する | `image: nginx@sha256:...` の形で、中身まで固定できる (タグは、後から別のイメージを指すように、付け替えられる) |
| 脆弱性をスキャンする | Docker Scout や Trivy などで、イメージの既知の脆弱性を検査する |
| イメージの出所を確認する | 公式イメージや、信頼できる発行元のイメージを使う |

### 実行時

```yaml
services:
  app:
    image: myapp
    user: "1000:1000"        # root 以外で実行する
    read_only: true          # ルートファイルシステムを、読み取り専用にする
    cap_drop:
      - ALL                  # Linux の特権 (ケーパビリティ) を、すべて外す
    security_opt:
      - no-new-privileges:true   # 実行中に、権限を上げることを禁止する
    tmpfs:
      - /tmp                 # 書き込みが必要な場所だけ、一時的な領域にする
    ports:
      - "127.0.0.1:8080:80"  # ホストの内側 (localhost) だけに、公開する
```

| 設定 | 効果 |
| --- | --- |
| `user:` | コンテナ内のプロセスを、root 以外で実行する |
| `read_only: true` | ファイルシステムへの書き込みを禁止する (必要な場所だけ、`tmpfs` や `volumes` で許可する) |
| `cap_drop: [ALL]` | 不要な特権を、外す (必要なものだけ、`cap_add` で足す) |
| `security_opt: [no-new-privileges:true]` | 子プロセスが、権限を上げることを防ぐ |
| `ports: "127.0.0.1:..."` | 外部に公開せず、ホスト自身からだけ、接続できるようにする |

### Docker 自体の保護

<pre><code class="caution">/var/run/docker.sock をコンテナにマウントすると、そのコンテナは、Docker を通じて、ホストを自由に操作できる (事実上、root 権限になる)。
必要な場合を除いて、マウントしない。</code></pre>

| 項目 | 内容 |
| --- | --- |
| `docker` グループ | メンバーは、事実上 root と同じ権限を持つ。信頼できるユーザーだけにする |
| Rootless モード | Docker のデーモン自体を、一般ユーザーの権限で動かす方法がある。導入の手順は、公式ドキュメントの「Rootless mode」を参照する |
| Engine の更新 | Docker Engine は、セキュリティ修正のあるリリースが、頻繁に出る (2026年には、`docker cp` に関する脆弱性の修正など)。定期的に更新する |
| ファイアウォール | 公開したポートは、ufw や firewalld の設定を、すり抜ける。公開する範囲は、`127.0.0.1:` などで絞る |

---

## 古いコードからの変更 <a id="migration" data-name="古いコードからの変更"></a>

古い記事や、古いリポジトリの設定に、残っていることが多い書き方と、現在の対応表。

| 古い書き方 | 現在 |
| --- | --- |
| `docker-compose up` (ハイフン付き。Compose v1) | `docker compose up` (v1 は、サポートが終了している) |
| compose.yaml の `version: "3"` | 省略する (現行の Compose では、無視されて、警告が出る) |
| `docker-compose.yml` | `compose.yaml` が推奨 (旧名も、引き続き使える) |
| `DOCKER_BUILDKIT=1 docker build` | BuildKit が既定のため、指定は不要 |
| `MAINTAINER 名前` | `LABEL maintainer="名前"` |
| `ADD` で、ローカルのファイルをコピーする | `COPY` を使う (`ADD` は、URL の取得や、tar の展開のときだけ) |
| `pip install` や `npm install` の結果を、1つのイメージに含める | マルチステージビルドで、成果物だけを、最終のイメージにコピーする |
| `RUN a && b && c` を、長く連ねる | ヒアドキュメント (`RUN <<EOF`) |
| ビルドの引数で、トークンなどを渡す (`ARG`) | `RUN --mount=type=secret` |
| Docker 24 以前のクライアントで、Engine 29 に接続する | クライアントを更新する (最小の API バージョンが、上がっている) |
| graph driver (overlay2) を前提にした設定 | Engine 29 の、新規インストールでは、containerd のイメージストアが既定。graph driver は、将来、削除される予定 |

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `permission denied while trying to connect to the Docker daemon socket` | 現在のユーザーが、`docker` グループに入っていない、または、反映されていない | `sudo usermod -aG docker $USER` のあと、再ログインする (または `newgrp docker`) |
| `docker: 'compose' is not a docker command` | Compose のプラグインが、入っていない | `docker-compose-plugin` を入れる。ハイフン付きの `docker-compose` は、v1 である |
| `version` is obsolete という警告 | `compose.yaml` の、トップレベルに `version:` がある | `version:` の行を、削除する |
| `bind: address already in use` | ホスト側のポートを、他のプロセス (または別のコンテナ) が使っている | 別のホスト側のポートにする (`"8081:80"`)。使用中のプロセスを確認する |
| ホストのブラウザから、コンテナのアプリに接続できない | アプリが、コンテナの中で、`127.0.0.1` だけを待ち受けている | アプリが、`0.0.0.0` で待ち受けるように設定する |
| 起動直後に、データベースへの接続に失敗する | `depends_on` が、コンテナの起動しか待たない | `healthcheck` と `condition: service_healthy` を使う |
| ソースを変えても、反映されない | ソースが、イメージの中に入っている。または、ビルドのキャッシュが使われている | `docker compose up --build`、バインドマウント、`develop.watch` を使う。`--no-cache` でキャッシュを無効にして確認する |
| `failed to compute cache key` と `not found` | コピー元が、ビルドのコンテキストの外にある。または、`.dockerignore` で除外されている | コンテキストのディレクトリと、`.dockerignore` を確認する |
| イメージが、極端に大きい | 単一ステージで、ビルドツールが残っている。`apt` のキャッシュが残っている。`.dockerignore` がない | マルチステージビルド、`--no-install-recommends`、`.dockerignore` を使う |
| `exec format error` | イメージの CPU アーキテクチャ (`arm64` など) と、実行する環境が、合っていない | `--platform` を指定する。マルチプラットフォームでビルドする |
| コンテナの中で、`.env` の値が見えない | `.env` は、`compose.yaml` の中の `${変数}` を展開するためのもので、コンテナには渡されない | `env_file:` か `environment:` で渡す |
| ディスクの空き容量が、足りなくなった | 古いイメージ、停止したコンテナ、ビルドキャッシュ、ボリュームが残っている | `docker system df` で内訳を確認して、`prune` 系のコマンドで掃除する (`--volumes` は慎重に) |
| ufw で閉じたポートに、外部から接続できてしまう | Docker が、公開したポートのルールを、ufw とは別に追加する | `127.0.0.1:ホスト側:コンテナ側` で公開するか、`DOCKER-USER` チェーンで制御する |

---

## 関連ツール <a id="tools" data-name="関連ツール"></a>

| ツール | 用途 |
| --- | --- |
| Docker Desktop | Windows と macOS で、Docker を使うためのアプリ (Linux 向けもある) |
| Docker Hub | イメージの、公式のレジストリ |
| hadolint | Dockerfile の、書き方を検査する (リンター) |
| dive | イメージのレイヤーごとの内容と、無駄なファイルを調べる |
| Docker Scout / Trivy | イメージの、既知の脆弱性を検査する |
| lazydocker | ターミナル上で、コンテナやログを操作する UI |
| Podman | Docker と互換性のある、デーモンを持たないコンテナエンジン |

---
