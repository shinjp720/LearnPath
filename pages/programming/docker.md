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

## Dockerfile <a id="docker-file" data-name="DockerFile"></a>

- `#` から始まる行はコメント
- 命令部分は大文字・小文字を区別しない(慣例として大文字を使う)
- 複数コマンドは `&&` でつなげる
- `\`(バックスラッシュ)で改行をエスケープする
- 作業ディレクトリに `Dockerfile` という名前でファイルを作成する

| 命令 | 説明 |
|---|---|
| `FROM イメージ名`<br>例: `FROM ubuntu:22.04` | ベースとなるイメージを指定 |
| `RUN シェルコマンド` | ビルド時に実行するシェルコマンド。<br>実行結果はイメージに反映される |
| `CMD ["コマンド", "引数", ...]` | コンテナ起動時のデフォルトコマンド。<br>コマンドライン側で別コマンドを指定すると上書きされる。<br>有効なのは1つのみ |
| `ENTRYPOINT ["コマンド", "引数", ...]` | 必ず実行するコマンド。<br>`docker run` 末尾の引数は追加引数として扱われる |
| `WORKDIR パス` | 作業ディレクトリを指定 (存在しなければ新規作成) |
| `COPY コピー元 コピー先` | ファイル/ディレクトリをコピー |
| `ADD 追加元 追加先` | `COPY` と違いURL指定やzipの自動展開が可能 |
| `ENV 変数名=値` | コンテナ内に環境変数を設定 |
| `ARG 変数名[=値]` | Dockerfile内でのみ使える一時変数 |
| `USER ユーザー名` | 指定したユーザーで実行 |
| `EXPOSE ポート番号` | 使用ポートを明示 (ホスト公開には `run` 時の `-p` が別途必要) |

<pre><code class="tips"><code class="code-like">RUN apt update && apt install -y ...</code> のように && でまとめるとレイヤーが1つになりイメージが軽くなる。
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
| `-f 名前` | ビルドするDockerfile名を指定 (デフォルト: `Dockerfile`) |
| `-t イメージ名:タグ` | イメージのタグを指定 |

---

## Docker Compose <a id="docker-compose" data-name="Docker Compose"></a>

### 基本コマンド

| コマンド | 説明 |
|---|---|
| `docker compose up`<br>`-d`: バックグラウンド起動<br>`--build`: Dockerfile変更時に必要に応じ再ビルドしてから起動 (差分のみ再ビルドするため高速) | サービスの起動/再起動 |
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

<pre><code class="caution">トップレベルの version: '3' 指定は現行のDocker Compose (v2, Compose Specification) では非推奨 (無視される) 。
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

**複数のDockerfileを読み込む例 (`Dockerfile.app` / `Dockerfile.db` を用意) **
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
