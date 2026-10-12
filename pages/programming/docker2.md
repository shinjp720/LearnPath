---
title: Docker
layout: default
---

# Docker <a id="top" data-name="top"></a>

## 導入 <a id="introduction" data-name="導入"></a>

<pre><code class="tips">Linux 内で完結する方法。</code></pre>

### 公式リポジトリの準備

```bash
# 必要なツールのインストール
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg util-linux-extra

# Docker公式の暗号鍵を追加
sudo install -m 0.755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# リポジトリをAPTのソースに追加
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 本体とComposeのインストール

```bash
sudo apt-get update
# 本体と、Composeプラグインをまとめてインストール
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### sudo を付けずに Docker を実行するための設定

```bash
# ① dockerグループに自分 ($USER) を追加
sudo usermod -aG docker $USER

# ② 設定を反映させる (一度ログアウトして再ログインでもOK) 
newgrp docker
```
---

## 基本コマンド <a id="basic-command" data-name="基本コマンド"></a>

| コマンド | 説明 |
|---|---|
| `docker -v` | Dockerのバージョン情報を表示 |
| `docker system prune -a --volumes -f` | 未使用のコンテナ・イメージ・ネットワーク・ボリュームを全て削除する |

<pre><code class="caution">-a (未使用イメージも対象) と --volumes (ボリュームも対象) を付けると影響範囲が大きくなるため、本番環境では実行前に内容を確認すること。</code></pre>

---

## イメージ関連コマンド <a id="image-command" data-name="イメージ関連コマンド"></a>

| コマンド | 説明 |
|---|---|
| `docker image ls` | イメージの一覧を表示 |
| `docker image pull [オプション] イメージ名:タグ`<br>例: `docker image pull python:3.11-slim` | Docker Hubからイメージを取得 |
| `docker image rm [オプション] イメージID`<br>`-f`: 強制削除 | イメージを削除 |
| `docker image push` | Docker Hubへイメージを登録 |
| `docker image build Dockerfileのパス`<br>`-t タグ名:バージョン`: タグ指定<br>`-f パス`: Dockerfileのパス指定(デフォルト: 現在のディレクトリ) | Dockerfileからイメージをビルド |
| `docker image inspect` | イメージの詳細を表示 |
| `docker image history` | イメージレイヤーの履歴を表示 |
| `docker image tag` | タグを付けたイメージを作成 |
| `docker image prune -a`<br>`-a`: どのコンテナからも参照されていないイメージを全て削除 | 不要なイメージを削除 |
| `docker save イメージ名 -o file.tar` | イメージをtarファイルとして保存(レジストリを使わず配布したい場合) |
| `docker load -i file.tar` | 保存したtarファイルからイメージを読み込む |

---

## コンテナ関連コマンド <a id="container-command" data-name="コンテナ関連コマンド"></a>

| コマンド | 説明 |
|---|---|
| `docker container ls (list)`<br>`-a`: 停止中も含めて表示 | 実行中コンテナの一覧を表示 |
| `docker container run [オプション] イメージ名:タグ [コマンド] [引数]` | `pull` → `create` → `start` をまとめて実行 |
| `docker container create [オプション] イメージ名:タグ [コマンド] [引数]` | イメージからコンテナを停止状態で作成 |
| `docker container start [オプション] コンテナID`<br>`-a`: 標準入出力にアタッチしシグナルを転送<br>`-i`: 標準入力にアタッチ | コンテナの起動 |
| `docker container attach [オプション] コンテナID` | コンテナに接続(シェルが稼働している必要あり)。`exit` で抜けるとコンテナ自体も停止する |
| `docker container exec [オプション] コンテナID コマンド`<br>`-it`: インタラクティブモード<br>`-d`: バックグラウンド実行 | 新たなコマンド(シェル等)を実行。`exit` で抜けてもコンテナは停止しない |
| `docker container logs [オプション] コンテナID` | ログを表示 |
| `docker container inspect [オプション] コンテナID` | 詳細情報を表示 |
| `docker container stats [オプション] コンテナID` | リソース使用状況をリアルタイム表示 |
| `docker container stop [オプション] コンテナID` | コンテナの停止 |
| `docker container restart [オプション] コンテナID` | コンテナの再起動 |
| `docker container rm [オプション] コンテナID`<br>`-f`: 強制削除 | コンテナの削除(基本は停止後に実行) |
| `docker container prune -f` | 停止中コンテナを一括削除 |
| `docker container export コンテナ名 > 出力ファイル名.tar` | コンテナをtarファイルにエクスポート |
| `docker import 出力ファイル名.tar 新しいイメージ名` | tarファイルを新しいイメージとしてインポート |

**`run` / `create` 共通の主なオプション**

| オプション | 説明 |
|---|---|
| `--name` | コンテナに名前を付ける |
| `-it` | 対話型モードで起動 |
| `-d` | バックグラウンドモードで起動 |
| `-p` | ホストに公開するポートを指定 |
| `--mount` / `-v` | フォルダのマウント |
| `--rm` | 終了時にコンテナを削除 |

<pre><code class="tips">イメージはPCに取得済みならそれを使用し、無ければDocker Hubから自動的に `pull` される。</code></pre>

**例:**
```bash
docker container create -it --name myub ubuntu:22.04 /bin/bash
docker start -ia myub
```

**その他の便利な確認コマンド:**

| コマンド | 説明 |
|---|---|
| `docker exec -it コンテナID sh`(または `bash`) | 稼働中コンテナにシェルで入る |
| {% raw %} docker inspect -f {{.NetworkSettings.IPAddress}} コンテナID {% endraw %}| コンテナのIPアドレスだけを抽出表示 |
| `docker diff コンテナID` | 起動後に変更/追加/削除されたファイルを表示 |
| `docker top コンテナID` | コンテナ内で実行中のプロセス一覧を表示 |
| `docker cp [オプション] コンテナID:パス ホスト側パス` | コンテナ内ファイルをホストへコピー |

---

## ネットワーク <a id="network" data-name="ネットワーク"></a>

| コマンド | 説明 |
|---|---|
| `docker network ls` | ネットワーク一覧を表示 |
| `docker network create ネットワーク名` | ネットワークを作成 |
| `docker network inspect ネットワーク名` | 接続中コンテナなど詳細を表示 |
| `docker network connect / disconnect ネットワーク名 コンテナ名` | ネットワークへの接続/切断 |
| `docker network rm ネットワーク名` | ネットワークを削除 |
| `docker network prune` | 未使用ネットワークを一括削除 |

**主なネットワークドライバ**

| ドライバ | 説明 |
|---|---|
| `bridge` | デフォルト。単一ホスト内の仮想ブリッジでコンテナ同士を接続 |
| `host` | ホストのネットワークスタックを直接共有(ポート分離なし) |
| `none` | ネットワーク無効化 |
| `overlay` | 複数ホスト(Swarmクラスタなど)にまたがるネットワーク |

<pre><code class="tips">`docker compose` では、同じ `compose.yaml` 内のサービスは自動的に専用ネットワークに接続され、**サービス名で名前解決**できる(例: `db` というサービス名にアプリコンテナから `db:3306` でアクセス可能)。単体の `docker run` にはない大きな利点。</code></pre>

---

## Dockerfile <a id="docker-file" data-name="DockerFile"></a>

- `#` から始まる行はコメント
- 命令部分は大文字・小文字を区別しない(慣例として大文字を使う)
- 複数コマンドは `&&` でつなげる
- `\`(バックスラッシュ)で改行をエスケープする
- 作業ディレクトリに `Dockerfile` という名前でファイルを作成する

| 命令 | 説明 |
|---|---|
| `FROM イメージ名`<br>例: `FROM ubuntu:22.04` | ベースとなるイメージを指定 |
| `RUN シェルコマンド` | ビルド時に実行するシェルコマンド。実行結果はイメージに反映される |
| `CMD ["コマンド", "引数", ...]` | コンテナ起動時のデフォルトコマンド。コマンドライン側で別コマンドを指定すると上書きされる。有効なのは1つのみ |
| `ENTRYPOINT ["コマンド", "引数", ...]` | 必ず実行するコマンド。`docker run` 末尾の引数は追加引数として扱われる |
| `WORKDIR パス` | 作業ディレクトリを指定(存在しなければ新規作成) |
| `COPY コピー元 コピー先` | ファイル/ディレクトリをコピー |
| `ADD 追加元 追加先` | `COPY` と違いURL指定やzipの自動展開が可能 |
| `ENV 変数名=値` | コンテナ内に環境変数を設定 |
| `ARG 変数名[=値]` | Dockerfile内でのみ使える一時変数 |
| `USER ユーザー名` | 指定したユーザーで実行 |
| `EXPOSE ポート番号` | 使用ポートを明示(ホスト公開には `run` 時の `-p` が別途必要) |

<pre><code class="tips">`RUN apt update && apt install -y ...` のように `&&` でまとめるとレイヤーが1つになりイメージが軽くなる。逆に別々の `RUN` に分けるとレイヤーごとのキャッシュが効きやすくなるというトレードオフもある。
> `CMD` は「デフォルト値」、`ENTRYPOINT` は「固定の実行コマンド」というイメージで使い分けると分かりやすい。両方を組み合わせ、`ENTRYPOINT` を固定コマンド、`CMD` をそのデフォルト引数にするパターンもよく使われる。</code></pre>

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
| `-f 名前` | ビルドするDockerfile名を指定(デフォルト: `Dockerfile`) |
| `-t イメージ名:タグ` | イメージのタグを指定 |

---

## マルチステージビルド <a id="multi-stage-builds" data-name="マルチステージビルド"></a>

ビルド時にしか使わないツール(コンパイラなど)を最終イメージに含めず、サイズを削減する書き方。

```dockerfile
# ビルド用ステージ
FROM golang:1.22 AS builder
WORKDIR /app
COPY . .
RUN go build -o myapp

# 実行用ステージ(軽量イメージ)
FROM debian:bookworm-slim
COPY --from=builder /app/myapp /usr/local/bin/myapp
ENTRYPOINT ["myapp"]
```

- `AS builder` でステージに名前を付ける
- `COPY --from=builder` で前段のステージから成果物だけをコピー
- 最終イメージにビルドツール一式が含まれないため、サイズ・セキュリティ両面で有利

---

## .dockerignore <a id="dockerignore" data-name=".dockerignore"></a>

`.gitignore` 同様、ビルドコンテキストに含めたくないファイル/ディレクトリを指定する。転送量削減やイメージへの不要ファイル混入防止に有効。

```
.git
node_modules
*.log
.env
__pycache__/
```

---

## ヘルスチェック <a id="health-check" data-name="ヘルスチェック"></a>

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1
```

`docker container ls` の `STATUS` 欄に `(healthy)` / `(unhealthy)` と表示される。`compose.yaml` の `depends_on` に `condition: service_healthy` を指定すれば、依存先が健全になってから起動する制御もできる。

---

## ログ <a id="log" data-name="ログ"></a>

| コマンド | 説明 |
|---|---|
| `docker logs -f コンテナID` | ログをリアルタイム追従表示 |
| `docker logs --since 10m コンテナID` | 直近10分のログのみ表示 |
| `docker logs --tail 100 コンテナID` | 末尾100行のみ表示 |

デフォルトのログドライバは `json-file` だが、サイズ上限を設定しないとログファイルが際限なく肥大化する点に注意。

```yaml
services:
  app:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

---

## リソース制限 <a id="resource-limits" data-name="リソース制限"></a>

| オプション | 説明 |
|---|---|
| `--memory` (`-m`) | 使用メモリの上限(例: `--memory=512m`) |
| `--cpus` | 使用CPUコア数の上限(例: `--cpus=1.5`) |
| `--memory-swap` | メモリ+スワップの合計上限 |

```bash
docker run -d --memory=512m --cpus=1.0 nginx
```

---

## セキュリティの基本 <a id="security" data-name="セキュリティの基本"></a>

- **rootで動かさない**: Dockerfile内で `USER` を指定し、非rootユーザーでアプリを実行する
- **不要な権限を与えない**: `--cap-drop=ALL` で全capabilityを外し、必要なものだけ `--cap-add` で戻す
- **読み取り専用ファイルシステム**: `--read-only` でコンテナ内FSを読み取り専用にし、書き込みが必要な箇所は `tmpfs` や volume を明示マウントする
- **公式/信頼できるベースイメージを使う**: `Official Image` バッジなど、提供元が明確なイメージを選ぶ
- **脆弱性スキャン**: `docker scout cves イメージ名`(Docker Desktop同梱のDocker Scout)で既知の脆弱性を確認
- **秘密情報をイメージに焼き込まない**: パスワードやAPIキーは `ENV`/`ARG` に直接書かず、BuildKitの `--secret` オプションや実行時の環境変数、Git管理外の `.env` 経由で渡す

---

## BuildKit <a id="buildKit" data-name="BuildKit"></a>

Docker 23以降デフォルトで有効なビルドエンジン。従来より高速でキャッシュ効率も良い。

```bash
docker build --secret id=mysecret,src=./secret.txt .
```
```dockerfile
RUN --mount=type=secret,id=mysecret cat /run/secrets/mysecret
```

`RUN --mount=type=cache,target=/root/.cache` のようなキャッシュマウントも可能。

---

## docker context <a id="docker-context" data-name="docker context"></a>

複数のDocker環境(ローカル、リモートサーバー、クラウド等)を切り替えて操作する機能。

| コマンド | 説明 |
|---|---|
| `docker context ls` | コンテキスト一覧を表示 |
| `docker context create 名前 --docker host=ssh://user@remote-host` | リモートホストへのコンテキストを作成 |
| `docker context use 名前` | 使用するコンテキストを切り替え |

---

## Docker Compose <a id="docker-compose" data-name="Docker Compose"></a>

### 基本コマンド

| コマンド | 説明 |
|---|---|
| `docker compose up`<br>`-d`: バックグラウンド起動<br>`--build`: Dockerfile変更時に必要に応じ再ビルドしてから起動(差分のみ再ビルドするため高速) | サービスの起動/再起動 |
| `docker compose down`<br>`--rmi all`: イメージ・コンテナを一括削除<br>`--rmi local`: ローカルビルドしたイメージ・コンテナを削除 | サービスの停止とコンテナの削除 |
| `docker compose exec コンテナ名 コマンド` | コマンドの実行 |
| `docker compose logs` | ログの表示 |
| `docker compose ps` | コンテナの一覧を表示 |
| `docker compose start` / `stop` | サービスの開始/停止 |
| `docker compose build` | Dockerfile変更時に必要に応じイメージを再ビルド |
| `docker compose create` | コンテナの作成のみ |
| `docker compose run` | サービスのコンテナを起動 |

### compose.yaml の主な項目

| 項目 | 説明 |
|---|---|
| `services:` | 任意のサービス名を定義 |
| `image:` | ベースイメージ/ビルド済みイメージ名 |
| `build:` | Dockerfileの格納先を指定 |
| `container_name:` | コンテナ名 |
| `expose:` | コンテナ間でのみ公開するポート(ホストには非公開) |
| `ports:`<br>例: `"8080:80"` | ホストに公開するポート(`ホスト側:コンテナ側`) |
| `environment:` | 環境変数を直接指定 |
| `env_file:`<br>例: `.env` | 環境変数をまとめたファイルを指定 |
| `volumes:` | ボリュームのマウント/名前付きボリューム |
| `depends_on:` | サービス間の依存関係 |
| `stdin_open:` | 標準入力の受付 |
| `tty:` | 疑似TTY端末の割り当て |
| `command:` | デフォルトのコマンドを上書き |
| `logging:` | ログドライバとオプション |

<pre><code class="caution">トップレベルの `version: '3'` 指定は現行のDocker Compose(v2, Compose Specification)では非推奨(無視される)。新規作成時は省略してよい。</code></pre>

**`.env` の例:**
```env
BASE_DIR=/var/mydb
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=practice_db
```

**単一サービスの例:**
```yaml
services:
  db:
    image: mypython:1
    container_name: mypy
    volumes:
      - ./src:/var/app/src
```

**複数のDockerfileを読み込む例(`Dockerfile.app` / `Dockerfile.db` を用意):**
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

---

## ファイルの永続化 (volume / bind) <a id="volume-bind" data-name="ファイルの永続化"></a>

コンテナ内で作成したファイルはコンテナ削除と共に消えるため、ホスト側フォルダをマウントして永続化する。

- **volume**: ホスト側に名前付きボリュームを作成しコンテナに割り当てる方式。`bind` よりアクセス速度が速く、公式でも新規運用時はvolume推奨。
  - WSLの場合 `\\wsl.localhost\docker-desktop-data\data\docker\volumes\` 配下に作成される。
- **bind**: ホスト側の任意フォルダをコンテナに割り当てる方式。ホスト側からも直接ファイルを操作したい場合に使用。

### volumeを使ったマウント

| コマンド | 説明 |
|---|---|
| `docker volume create [オプション]`<br>`--name`: 名前を設定 | ボリュームの作成 |
| `docker volume ls` | ボリューム一覧を表示 |
| `docker volume rm` | ボリュームの削除 |
| `docker volume prune` | 未使用ボリュームの一括削除 |

```bash
docker container run -it --mount src=vol_test,dst=/tmp/vol_test python /bin/bash
```
`src` にボリューム名、`dst` にコンテナ側の割当先ディレクトリを指定する。

### bindを使ったマウント

```bash
docker container run -it --rm --mount type=bind,src=$(pwd)/test,dst=/tmp/test python /bin/bash
```
`type=bind` でbindを指定、`src` にフォルダ名(絶対パス)、`dst` にコンテナ側の割当先ディレクトリを指定する。フォルダが存在しない場合はエラーになる。

> 📝 `$(PWD)` はシェル変数展開としては `$(pwd)` または `${PWD}`(環境変数展開)が正しい表記。`$(PWD)` という書き方は通常機能しない。

### -v を使ったマウント

```bash
docker container create -v ホスト側パス:コンテナ側パス[:オプション] コンテナID
```

| オプション | 説明 |
|---|---|
| `:ro` | 読み込み専用 |
| `:rw` | 読み書き可能 |

---

## Dev Container <a id="dev-container" data-name="Dev Container"></a>

VS Codeの「Dev Containers」拡張機能を使うと、コンテナ内を直接の開発環境として利用できる。

---

## よく使う便利コマンド集 <a id="utils" data-name="よく使う便利コマンド"></a>

| コマンド | 説明 |
|---|---|
| `docker save イメージ名 -o file.tar` | イメージをtarファイルとして保存 |
| `docker load -i file.tar` | tarファイルからイメージを読み込む |
| {% raw %} docker inspect -f {{.NetworkSettings.IPAddress}} コンテナID {% endraw %} | コンテナIPアドレスの抽出表示 |
| `docker diff コンテナID` | 変更/追加/削除ファイルを表示 |
| `docker top コンテナID` | 実行中プロセス一覧を表示 |

---

## Kubernetesとの違い(参考) <a id="kubernetes" data-name="Kubernetesとの違い"></a>

Docker(単体)は「1台のホスト上でコンテナを動かす」仕組みであるのに対し、**Kubernetes** は複数ホストにまたがるコンテナ群を自動でスケジューリング・スケーリング・自己修復する「オーケストレーションツール」。Docker単体やCompose、Swarmで物足りなくなってきたタイミング(複数サーバーでの本番運用、自動スケーリング、ゼロダウンタイムデプロイなど)で検討されることが多い。

| | 対象規模 | 主な用途 |
|---|---|---|
| Docker / Compose | 1台のホスト、開発環境 | ローカル開発、簡易な本番運用 |
| Docker Swarm | 複数ホスト | Docker純正のオーケストレーション(比較的シンプル) |
| Kubernetes | 複数ホスト(大規模) | 本番運用の事実上の標準。エコシステムが大きい分、学習コストも高い |

---

## PC起動時に Docker を起動する <a id="startup" data-name="PC起動時に Docker を起動する"></a>

<span class="code-like">docker-compose.yml</span> が <span class="code-like">/home/USER/my-projects</span>
 というディレクトリにあるとする。

### 設定ファイルを作成

ubuntu のシステム管理ディレクトリに、自動起動用の設定ファイルを新規作成する。

```bash
sudo vim /etc/systemd/system/my-docker-apps.service
```

以下がファイルの内容。

```toml
[Unit]
Description=My Docker Compose Applications
# Docker本体が完全に立ち上がった後に、この処理をスタートさせる指定
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
# docker-compose.ymlがある絶対パスを指定
WorkingDirectory=/home/USER/my-project
# 起動時に実行するコマンド (-d でバックグラウンド実行) 
ExecStart=/usr/bin/docker compose up -d
# Ubuntuシャットダウン時に綺麗にコンテナを停止させるコマンド
ExecStop=/usr/bin/docker compose down

[Install]
# Ubuntuが通常の起動 (マルチユーザーモード) を完了した時に実行する指定
WantedBy=multi-user.target
```

### Ubuntu に認識させる

```bash
# 設定ファイルのリロード
sudo systemctl daemon-reload
```

### 自動起動を有効化

```bash
sudo systemctl enable my-docker-apps.service
```

### 設定後の便利コマンド

#### 手動で起動

```bash
sudo systemctl start my-docker-apps.service
```

#### 手動で停止 (シャットダウン時の動きをテスト)

```bash
sudo systemctl stop my-docker-apps.service
```

#### 現在のステータスを確認

```bash
sudo systemctl status my-docker-apps.service
```