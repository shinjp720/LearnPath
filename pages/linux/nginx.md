---
title: Nginx
layout: default
---

# Nginx <a id="top" data-name="TOP"></a>

## リバースプロキシとは <a id="overview" data-name="リバースプロキシとは"></a>

クライアントからのリクエストを受け取り、代わりにバックエンド (アプリケーションサーバー) へ転送して、その応答をクライアントに返すサーバー。<br>
クライアントからは Nginx だけが見え、バックエンドの存在や構成は隠れる。

```text
クライアント ──▶ Nginx (リバースプロキシ) ──▶ バックエンド (Node.js / Rust / Python など)
             ◀──                          ◀──
```

| 用途 | 説明 |
| --- | --- |
| TLS 終端 | HTTPS の処理を Nginx に任せ、バックエンドとは HTTP で通信できる |
| 負荷分散 | 複数のバックエンドにリクエストを振り分ける |
| ルーティング | パスやホスト名ごとに、別のバックエンドへ転送する |
| キャッシュ | バックエンドの応答を保存して、負荷を減らす |
| 保護 | バックエンドを直接公開せず、レート制限や接続数の制限を前段で行う |
| 静的ファイルの配信 | 静的ファイルは Nginx が返し、動的な処理だけをバックエンドに渡す |

### 用語

| 用語 | 意味 |
| --- | --- |
| フォワードプロキシ | クライアント側に置くプロキシ。クライアントの代わりに外部へアクセスする |
| リバースプロキシ | サーバー側に置くプロキシ。サーバーの代わりにクライアントからのリクエストを受ける |
| upstream | Nginx から見たバックエンド (転送先) |
| TLS 終端 | 暗号化された通信を、プロキシの位置で復号すること |

<pre><code class="tips">HTTP 以外では、gRPC は grpc_pass、TCP / UDP は stream コンテキストの proxy_pass を使う。
この文書では HTTP の proxy_pass に絞って扱う。</code></pre>

---

## 基本設定 <a id="basic" data-name="基本設定"></a>

### 最小構成

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

`proxy_pass` に転送先を指定するだけで、リバースプロキシとして動く。

### 設定の構造

| コンテキスト | 説明 |
| --- | --- |
| `http { }` | HTTP 全体の設定。`upstream`、`map`、`proxy_cache_path` などはここに書く |
| `server { }` | 仮想ホスト。`listen` と `server_name` で、どのリクエストを受けるかを決める |
| `location { }` | URL のパスごとの設定。`proxy_pass` はここ (または `if in location`) に書く |

### 設定ファイルの置き場所

| 環境 | 場所 |
| --- | --- |
| Debian / Ubuntu のパッケージ | <span class="code-like">/etc/nginx/sites-available/</span> に書き、<span class="code-like">/etc/nginx/sites-enabled/</span> にシンボリックリンクを張る |
| nginx.org 公式パッケージ、RHEL 系 | <span class="code-like">/etc/nginx/conf.d/*.conf</span> |

### 設定の確認と反映

```bash
# 文法チェック
sudo nginx -t

# 設定を反映 (接続を切らずに、新しい設定のワーカーに入れ替える)
sudo nginx -s reload
# systemd の場合
sudo systemctl reload nginx

# 読み込まれた設定全体を出力 (include を展開した最終的な内容を確認できる)
sudo nginx -T
```

<pre><code class="tips">設定を変えたら、まず nginx -t で確認してから reload する。
文法エラーのまま reload しても、実行中の設定は壊れずに残る。</code></pre>

---

## proxy_pass と URI <a id="proxy-pass" data-name="proxy_pass と URI"></a>

`proxy_pass` の転送先に **URI (パス) を含めるかどうか** で、転送されるパスが変わる。<br>
末尾のスラッシュ `/` 1文字でも URI ありと見なされるため、最もはまりやすい。

| 設定 (`location /api/` の場合) | リクエスト `/api/users` の転送先 |
| --- | --- |
| `proxy_pass http://127.0.0.1:3000;` | `/api/users` (URI なし。そのまま渡す) |
| `proxy_pass http://127.0.0.1:3000/;` | `/users` (`/api/` が `/` に置き換わる) |
| `proxy_pass http://127.0.0.1:3000/v1/;` | `/v1/users` (`/api/` が `/v1/` に置き換わる) |

```nginx
# /api/ を取り除いて、バックエンドには /users として渡す
location /api/ {
    proxy_pass http://127.0.0.1:3000/;
}
```

<pre><code class="caution">URI を指定できないケースがある。
- 正規表現の location (~ / ~*) の中では、proxy_pass に URI を書けない。
- proxy_pass に変数を使うと、URI なしなら元のリクエスト URI がそのまま渡り、URI ありなら元の URI 全体が置き換わる (location のプレフィックスの置換は行われない)。</code></pre>

### location のマッチ順序

| 記法 | 意味 |
| --- | --- |
| `location = /path` | 完全一致。マッチしたらすぐに採用 |
| `location ^~ /path/` | 前方一致。マッチしたら、正規表現の評価を省略 |
| `location ~ regex` | 正規表現 (大文字小文字を区別する) |
| `location ~* regex` | 正規表現 (大文字小文字を区別しない) |
| `location /path/` | 前方一致 (最長一致が採用される) |

評価の流れは次のとおり。

1. 完全一致 (`=`) があれば、それを採用する。
2. 最も長く一致する前方一致を探す。それが `^~` 付きなら採用する。
3. 正規表現を、ファイル内に書かれた順に評価して、最初にマッチしたものを採用する。
4. 正規表現にマッチしなければ、手順 2 の前方一致を採用する。

### パスやホストによる振り分け

```nginx
# パスで振り分ける
server {
    listen 80;
    server_name example.com;

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}

# ホスト名で振り分ける (server ごとに分ける)
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
    }
}
```

### サブパスで公開する

`/app/` 以下にバックエンドを置く場合は、`proxy_pass` の末尾に `/` を付けて、プレフィックスを取り除く。

```nginx
location /app/ {
    proxy_pass http://127.0.0.1:3000/;
}
```

<pre><code class="caution">バックエンドが返す HTML のリンクや Location ヘッダーが、/ 始まりの絶対パスだと、/app/ が付かずに壊れる。
アプリ側にベースパスを設定できるなら、それを優先する。</code></pre>

### proxy_redirect

バックエンドが返す `Location` / `Refresh` ヘッダーの URL を書き換える。

| 設定 | 動作 |
| --- | --- |
| `proxy_redirect default;` (既定) | `proxy_pass` と `location` の設定に合わせて、バックエンドのアドレスを Nginx 側の URL に自動で書き換える |
| `proxy_redirect off;` | 書き換えない (バックエンドが、正しい外部 URL を返せる場合に使う) |
| `proxy_redirect http://127.0.0.1:3000/ /;` | 指定した文字列を置換する |

---

## ヘッダーの引き継ぎ <a id="headers" data-name="ヘッダーの引き継ぎ"></a>

プロキシを経由すると、バックエンドから見た接続元は Nginx になる。<br>
元のホスト名、クライアントの IP、プロトコルをバックエンドに伝えるには、ヘッダーを自分で設定する。

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;

    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

| ヘッダー | 値 | 役割 |
| --- | --- | --- |
| `Host` | `$host` | 元のリクエストのホスト名をバックエンドに伝える |
| `X-Real-IP` | `$remote_addr` | クライアントの IP アドレス |
| `X-Forwarded-For` | `$proxy_add_x_forwarded_for` | 経由してきた IP の一覧。クライアントが付けた値の末尾に、`$remote_addr` を追加する |
| `X-Forwarded-Proto` | `$scheme` | 元のリクエストが `http` か `https` か。バックエンドがリダイレクト先の URL を作るときに必要 |

### Host の既定値

`Host` を指定しなかった場合、Nginx は `proxy_pass` に書いたホスト名 (`$proxy_host`) を渡す。<br>
そのため、バックエンドは `127.0.0.1:3000` のようなホスト名を受け取り、絶対 URL の生成やバーチャルホストの判定が狂う。

| 変数 | 値 |
| --- | --- |
| `$host` | リクエストの `Host` ヘッダーからポートを除いたもの (なければ `server_name`) |
| `$http_host` | リクエストの `Host` ヘッダーそのまま (ポートを含む) |
| `$proxy_host` | `proxy_pass` に書いたホスト名とポート (`Host` の既定値) |

ポート付きの URL (`example.com:8443` など) で公開している場合は `$http_host` を使う。

### 共通設定をまとめる

複数の location で同じヘッダーを使うなら、別ファイルに切り出して `include` する。

```nginx
# /etc/nginx/snippets/proxy-headers.conf
proxy_set_header Host              $host;
proxy_set_header X-Real-IP         $remote_addr;
proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    include snippets/proxy-headers.conf;
}
```

<pre><code class="caution">proxy_set_header は、下位のレベルに1つでも書くと、上位レベル (server など) の proxy_set_header が継承されなくなる。
location 内で別のヘッダーを足すときは、共通のヘッダーも含めてすべて書き直す (include で読み込むのが安全)。</code></pre>

<pre><code class="tips">proxy_set_header の値が空文字列 ("") だと、そのヘッダーはバックエンドに渡されない。</code></pre>

### クライアントの IP を信頼できる形で取る

`X-Forwarded-For` はクライアントが偽装できる。<br>
アプリ側では、信頼できるプロキシ (Nginx) が付けた末尾の値だけを使うように設定する。

Nginx の前段にロードバランサーや CDN がある場合は、`realip` モジュールで `$remote_addr` を元のクライアントの IP に置き換えられる。

```nginx
set_real_ip_from  10.0.0.0/8;     # 信頼する前段プロキシのアドレス
real_ip_header    X-Forwarded-For;
real_ip_recursive on;
```

---

## upstream (負荷分散) <a id="upstream" data-name="upstream"></a>

複数のバックエンドを `upstream` ブロックにまとめて、名前で `proxy_pass` に指定する。<br>
`upstream` は `http` コンテキストに書く。

```nginx
upstream app {
    server 10.0.0.11:3000;
    server 10.0.0.12:3000 weight=2;   # 2倍の割合で振り分ける
    server 10.0.0.13:3000 backup;     # 他がすべて落ちたときだけ使う

    keepalive 32;                     # バックエンドへの接続を再利用する
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://app;

        proxy_http_version 1.1;           # keepalive に必要
        proxy_set_header Connection "";   # keepalive に必要
        proxy_set_header Host $host;
    }
}
```

### 振り分けの方式

| 指定 | 方式 |
| --- | --- |
| (指定なし) | ラウンドロビン (順番に振り分ける。`weight` で重みを付けられる) |
| `least_conn;` | 接続数が最も少ないサーバーに振り分ける |
| `ip_hash;` | クライアントの IP で振り分ける (同じクライアントは、基本的に同じサーバーへ) |
| `hash $request_uri consistent;` | 任意のキーで振り分ける。`consistent` でサーバーの増減による再配置を抑える |

### server のパラメータ

| パラメータ | 説明 |
| --- | --- |
| `weight=N` | 重み (既定 1) |
| `max_fails=N` | `fail_timeout` の間に N 回失敗したら、一時的に切り離す (既定 1) |
| `fail_timeout=時間` | 失敗を数える期間と、切り離す期間 (既定 10 秒) |
| `backup` | 予備のサーバー |
| `down` | 恒久的に使わない (設定は残したまま無効にする) |

### keepalive

バックエンドへの接続を使い回して、接続の確立にかかるコストを減らす。<br>
次の3つがそろわないと効かない。

1. `upstream` に `keepalive N;` を書く。
2. location に `proxy_http_version 1.1;` を書く。
3. location に `proxy_set_header Connection "";` を書く。

### ヘルスチェックとリトライ

- Nginx (OSS 版) は、リクエストの失敗を数えて切り離す **パッシブチェック** のみ。`max_fails` と `fail_timeout` で調整する。
- 定期的にバックエンドへ問い合わせる **アクティブチェック** は、商用版 (NGINX Plus) の機能。
- `proxy_next_upstream` で、どんな失敗のときに次のサーバーを試すかを決める (既定は `error timeout`)。
- POST などの冪等でないリクエストは、バックエンドにリクエストを送った後は、既定では次のサーバーに再送しない。

<pre><code class="tips">upstream にサーバーが1つだけの場合、max_fails と fail_timeout は無視される。</code></pre>

### Unix ドメインソケット

同じマシン上のバックエンドとは、TCP の代わりに Unix ドメインソケットでも通信できる。

```nginx
upstream app {
    server unix:/run/app.sock;
}

# upstream を使わずに直接指定する場合 (末尾の :/ でソケットとパスを区切る)
location / {
    proxy_pass http://unix:/run/app.sock:/;
}
```

---

## HTTPS (TLS 終端) <a id="tls" data-name="HTTPS"></a>

### Nginx で TLS を終端する

```nginx
server {
    listen 443 ssl;
    http2 on;
    server_name example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_set_header Host              $host;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;   # https がバックエンドに伝わる
    }
}

# HTTP は HTTPS にリダイレクト
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}
```

- クライアントと Nginx の間は HTTPS、Nginx とバックエンドの間は HTTP になる。
- `http2 on;` は Nginx 1.25.1 以降で使う。それ以前の `listen 443 ssl http2;` は非推奨。
- Nginx からバックエンドへの通信は、HTTP/1.x (`proxy_http_version`) になる。クライアントとの間の HTTP/2 や HTTP/3 とは独立している。

### Let's Encrypt (certbot)

```bash
sudo apt install -y certbot python3-certbot-nginx

# 証明書の取得と、Nginx の設定の書き換えまでを自動で行う
sudo certbot --nginx -d example.com

# 更新のテスト
sudo certbot renew --dry-run
```

### バックエンドへ HTTPS で接続する

```nginx
location / {
    proxy_pass https://backend.example.com;

    proxy_ssl_server_name on;                       # SNI を送る
    proxy_ssl_verify on;                            # バックエンドの証明書を検証する
    proxy_ssl_trusted_certificate /etc/ssl/certs/ca-certificates.crt;
}
```

<pre><code class="caution">Nginx は、バックエンドの証明書を既定では検証しない (proxy_ssl_verify off)。
外部のサービスなどに転送するときは、proxy_ssl_verify on を明示する。</code></pre>

---

## WebSocket と SSE <a id="websocket" data-name="WebSocket と SSE"></a>

### WebSocket

WebSocket は、HTTP の `Upgrade` ヘッダーでプロトコルを切り替える。<br>
Nginx は既定では `Upgrade` と `Connection` を転送しないため、明示する必要がある。

```nginx
# http コンテキスト: Upgrade ヘッダーがあるときだけ "upgrade" にする
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    server_name example.com;

    location /ws/ {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;                          # Upgrade には 1.1 が必要
        proxy_set_header Upgrade    $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host       $host;

        proxy_read_timeout 3600s;                        # 無通信の接続が切られるまでの時間
    }
}
```

<pre><code class="caution">proxy_read_timeout の既定は 60 秒で、この間に何も受信しないと接続が切れる。
無通信の時間が長い WebSocket では、延ばすか、アプリ側で ping / pong を定期的に送る。</code></pre>

### SSE (Server-Sent Events) とストリーミング

応答をバッファせずに、すぐにクライアントへ流す。

```nginx
location /events/ {
    proxy_pass http://127.0.0.1:3000;

    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_buffering off;          # 応答をためずに、すぐに流す
    proxy_cache off;
    proxy_read_timeout 1h;
}
```

バックエンド側が `X-Accel-Buffering: no` ヘッダーを返しても、そのレスポンスだけバッファリングを無効にできる。

---

## タイムアウトとバッファ <a id="timeout-buffer" data-name="タイムアウトとバッファ"></a>

### タイムアウト

| ディレクティブ | 既定 | 説明 |
| --- | --- | --- |
| `proxy_connect_timeout` | 60s | バックエンドとの接続の確立を待つ時間 |
| `proxy_send_timeout` | 60s | バックエンドへのリクエストの送信で、連続する2回の書き込みの間隔の上限 |
| `proxy_read_timeout` | 60s | バックエンドからの応答で、連続する2回の読み取りの間隔の上限 |

`proxy_read_timeout` は応答全体にかかる時間の上限ではなく、**データが途切れる時間** の上限。

```nginx
location /report/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_read_timeout 300s;   # 時間のかかる処理を待つ
}
```

### リクエストボディのサイズ

```nginx
server {
    client_max_body_size 50m;   # 既定は 1m
}
```

上限を超えると、Nginx が `413 Request Entity Too Large` を返す (バックエンドには届かない)。<br>
アップロードを受け付けるなら、設定しておく。

### バッファ

| ディレクティブ | 既定 | 説明 |
| --- | --- | --- |
| `proxy_buffering` | on | バックエンドの応答をいったん Nginx で受け取ってから、クライアントに送る |
| `proxy_request_buffering` | on | クライアントのリクエストボディを、いったん Nginx で受け取ってから、バックエンドに送る |
| `proxy_buffer_size` | 4k / 8k | 応答のヘッダーを読むためのバッファ |
| `proxy_buffers` | 8 4k / 8 8k | 応答のボディ用のバッファ (個数 サイズ) |

- `proxy_buffering on` のおかげで、遅いクライアントがいても、バックエンドの接続を早く解放できる。
- 大きなファイルのアップロードや、ストリーミングでは `proxy_request_buffering off;` (リクエスト側)、`proxy_buffering off;` (応答側) を検討する。

---

## キャッシュ <a id="cache" data-name="キャッシュ"></a>

バックエンドの応答を Nginx のディスクに保存して、同じリクエストに対してバックエンドへ問い合わせずに返す。

```nginx
# http コンテキスト
proxy_cache_path /var/cache/nginx/app
                 levels=1:2
                 keys_zone=app_cache:10m   # キーのメタデータ用の共有メモリ
                 max_size=1g
                 inactive=60m              # 60 分アクセスがなければ削除
                 use_temp_path=off;

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_cache app_cache;
        proxy_cache_valid 200 301 10m;     # 成功の応答を 10 分キャッシュ
        proxy_cache_valid 404 1m;

        # バックエンドが落ちているときは、古いキャッシュを返す
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;

        # 同じキャッシュの生成を、1つのリクエストにまとめる
        proxy_cache_lock on;

        # キャッシュの状態をレスポンスヘッダーで確認する
        add_header X-Cache-Status $upstream_cache_status;
    }
}
```

| `$upstream_cache_status` | 意味 |
| --- | --- |
| `MISS` | キャッシュになかったので、バックエンドから取得した |
| `HIT` | キャッシュから返した |
| `EXPIRED` | 期限切れだったので、バックエンドから取得し直した |
| `STALE` | 古いキャッシュを返した (`proxy_cache_use_stale`) |
| `UPDATING` | 更新中なので、古いキャッシュを返した |
| `BYPASS` | キャッシュを使わずに、バックエンドから取得した |

- キャッシュするのは、既定では `GET` と `HEAD` のみ。
- キャッシュのキーは、既定では `$scheme$proxy_host$request_uri`。
- バックエンドの `Cache-Control` や `Expires` を、既定で尊重する。`Set-Cookie` を含む応答や、`Cache-Control: private / no-cache / no-store` の応答は、既定ではキャッシュされない。
- ログインしているユーザーごとに内容が変わるページは、キャッシュに入れないように注意する。`proxy_cache_bypass` や `proxy_no_cache` で、条件を指定して回避できる。

```nginx
# Cookie があるリクエストは、キャッシュを使わず、保存もしない
proxy_cache_bypass $http_cookie;
proxy_no_cache     $http_cookie;
```

---

## コンテナ環境 <a id="container" data-name="コンテナ環境"></a>

Docker Compose などで、Nginx と別のコンテナのバックエンドを組み合わせる構成。

```yaml
services:
  nginx:
    image: nginx:stable
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - app

  app:
    build: .
    expose:
      - "3000"
```

```nginx
# nginx.conf
server {
    listen 80;

    location / {
        proxy_pass http://app:3000;   # サービス名がホスト名になる
        proxy_set_header Host $host;
    }
}
```

<pre><code class="caution">proxy_pass に書いたホスト名は、Nginx の起動時に1度だけ名前解決される。
バックエンドのコンテナがまだ起動していないと、"host not found in upstream" で Nginx が起動に失敗する。
また、バックエンドを再作成して IP が変わっても、Nginx は古い IP に接続し続ける。</code></pre>

名前解決を、リクエストのたびに行いたい (動的に解決したい) ときは、`resolver` と変数を使う。

```nginx
server {
    listen 80;

    resolver 127.0.0.11 valid=10s;   # Docker の組み込み DNS

    location / {
        set $backend http://app:3000;
        proxy_pass $backend;          # 変数を使うと、実行時に名前解決される
    }
}
```

<pre><code class="tips">変数を使った proxy_pass は、location のプレフィックスが自動では取り除かれない (前述の「proxy_pass と URI」を参照)。</code></pre>

---

## エラーとログ <a id="errors" data-name="エラーとログ"></a>

### よく見るエラー

| ステータス | 主な原因 | 確認すること |
| --- | --- | --- |
| `502 Bad Gateway` | バックエンドに接続できない、または不正な応答が返った | バックエンドが起動しているか、ポート (ソケット) が合っているか |
| `503 Service Unavailable` | バックエンドが過負荷、またはレート制限に達した | `limit_req` / `limit_conn` の設定、バックエンドの状態 |
| `504 Gateway Timeout` | バックエンドの応答が、タイムアウトまでに来なかった | `proxy_read_timeout`、バックエンドの処理時間 |
| `413 Request Entity Too Large` | リクエストボディが `client_max_body_size` を超えた | `client_max_body_size` |
| `499` (ログのみ) | 応答を返す前に、クライアントが接続を切った (Nginx 独自のコード) | クライアント側のタイムアウト、バックエンドの遅さ |

### 502 の調べ方

```bash
# エラーログで原因を確認する
sudo tail -f /var/log/nginx/error.log
```

| エラーログの内容 | 原因と対処 |
| --- | --- |
| `connect() failed (111: Connection refused)` | バックエンドが起動していない、またはポートが違う |
| `connect() failed (13: Permission denied)` | Unix ソケットの権限、または SELinux による制限 |
| `upstream sent too big header` | バックエンドのヘッダーが大きすぎる。`proxy_buffer_size` を大きくする |
| `host not found in upstream` | ホスト名を解決できない (前述の「コンテナ環境」を参照) |

```bash
# RHEL 系で、Nginx からバックエンドへのネットワーク接続を許可する (SELinux)
sudo setsebool -P httpd_can_network_connect 1
```

### エラーページ

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;

    proxy_intercept_errors on;
    error_page 502 503 504 /maintenance.html;
}

location = /maintenance.html {
    root /var/www/error;
    internal;
}
```

- Nginx 自身が生成した 502 / 504 (接続できないなど) は、`error_page` だけで差し替えられる。
- バックエンドが返したエラー (500 など) を差し替えるには、`proxy_intercept_errors on;` が必要。

### ログにバックエンドの情報を出す

```nginx
# http コンテキスト
log_format proxy '$remote_addr [$time_local] "$request" $status '
                 'rt=$request_time urt=$upstream_response_time '
                 'upstream=$upstream_addr cache=$upstream_cache_status';

access_log /var/log/nginx/access.log proxy;
```

| 変数 | 意味 |
| --- | --- |
| `$request_time` | リクエストを受けてから、応答を送り終えるまでの時間 |
| `$upstream_response_time` | バックエンドが応答するまでにかかった時間 |
| `$upstream_addr` | 転送先のアドレス |
| `$upstream_status` | バックエンドが返したステータス |

`$request_time` と `$upstream_response_time` の差が大きければ、クライアントの回線やバッファが原因の可能性が高い。

---

## セキュリティ <a id="security" data-name="セキュリティ"></a>

### 直接アクセスを防ぐ

- バックエンドは `127.0.0.1` (または内部ネットワーク) だけで待ち受けて、外部からは Nginx 経由でしか届かないようにする。
- どの `server_name` にも一致しないリクエスト (IP アドレスでの直接アクセスなど) は、既定のサーバーで遮断する。

```nginx
server {
    listen 80 default_server;
    server_name _;
    return 444;   # 応答を返さずに、接続を閉じる
}
```

### レート制限

```nginx
# http コンテキスト: クライアントの IP ごとに、毎秒 10 リクエストまで
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    location /api/ {
        limit_req zone=api burst=20 nodelay;   # 一時的な 20 リクエストの超過を許容する
        limit_req_status 429;                  # 超過時のステータス (既定は 503)
        proxy_pass http://127.0.0.1:3000;
    }
}
```

<pre><code class="caution">Nginx の前段にロードバランサーや CDN がある場合、$binary_remote_addr はそれらの IP になる。
realip モジュールで、元のクライアントの IP に置き換えてから使う。</code></pre>

### 情報の隠蔽

```nginx
server_tokens off;                  # Nginx のバージョンを、エラーページやヘッダーに出さない
proxy_hide_header X-Powered-By;     # バックエンドの情報を含むヘッダーを、クライアントに渡さない
```

### アクセス制限

```nginx
location /admin/ {
    allow 192.168.0.0/24;   # 許可する範囲
    deny  all;              # それ以外は 403
    proxy_pass http://127.0.0.1:3000;
}
```

---

## 動作確認 <a id="verify" data-name="動作確認"></a>

```bash
# バックエンドに直接アクセスして、アプリが動いているか確認する
curl -i http://127.0.0.1:3000/

# Nginx 経由で確認する (Host ヘッダーを指定して、DNS を使わずに試せる)
curl -i -H "Host: example.com" http://127.0.0.1/

# 名前解決を上書きして、HTTPS で確認する
curl -i --resolve example.com:443:127.0.0.1 https://example.com/

# 経由した結果を、ヘッダーで確認する (キャッシュの状態など)
curl -sI http://127.0.0.1/ | grep -i x-cache
```

| 確認したいこと | 方法 |
| --- | --- |
| バックエンドに届いているヘッダー | バックエンドで、受け取ったヘッダーをログに出す (`X-Forwarded-For` や `Host` など) |
| どの設定が読み込まれているか | `sudo nginx -T` |
| Nginx の動作状況 | `sudo systemctl status nginx` / `sudo journalctl -u nginx` |
| 設定の変更が反映されたか | `sudo nginx -t` の後、`sudo nginx -s reload` |

<pre><code class="tips">うまく動かないときは、バックエンドへ直接 curl → Nginx 経由で curl → error.log の順に確認する。
どの段階で失敗するかで、原因 (アプリ / Nginx の設定 / ネットワーク) を絞り込める。</code></pre>
