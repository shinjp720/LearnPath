---
title: Docker
layout: default
---

# Docker <a id="top" data-name="top"></a>


コマンド
docker -v
Dockerのバージョン情報を表示
docker system prune -a --volumes -f
全ての未使用リソースを削除する

イメージのコマンド
docker image ls
イメージの一覧を表示
docker image pull [オプション] イメージ名:タグ
docker image pull python:3.11-slim

 DockerHubからイメージを取得
docker image rm [オプション] イメージID
イメージを削除
-t
強制的に削除



docker image push
DockerHubへイメージを登録
docker image build Dockerfileのパス
Dockerfileからイメージをビルド
-t タグ名:バージョン
タグを指定する
-f パス
Dockerfileのパスを指定する(デフォルトで現在のディレクトリ)



docker image inspect
イメージの詳細を表示
docker image history
イメージレイヤーの履歴を表示
docker image tag
タグを付けたイメージを作成
docker image prune
不要なイメージを削除
-a
コンテナから参照されていないイメージを全て削除




コンテナのコマンド
docker container ls (list)
実行中のコンテナの一覧を表示
-a
停止中も含めてコンテナの一覧を表示



docker container run [オプション] イメージ名:タグ [コマンド] [引数]
docker image pull
docker container create
docker container start
をまとめて行う
--name
コンテナに名前を付ける
-it
対話型モードで起動
-d
バックグラウンドモードで起動
-p
ホストに公開するポートの指定
-mount
フォルダのマウント
--rm
終了時にコンテナを削除

イメージはPCに取得済みであればそれを使用し、無ければDockerHubから取得(pull)する
docker container create [オプション] イメージ名:タグ [コマンド] [引数]
イメージからコンテナを停止状態で作成する
--name
コンテナに名前を付ける
-it
対話型モードで起動
-d
バックグラウンドモードで起動
-p
ホストに公開するポートの指定
-mount
フォルダのマウント
-v
フォルダのマウント
--rm
終了時にコンテナを削除


docker container create -it --name myub ubuntu:22.04 bin/bash
docker start -ia myub
これで実行できる



docker container start [オプション] コンテナID
コンテナの起動
-a
標準入出力にアタッチし、シグナルを転送
-i
コンテナの標準入力にアタッチ



docker container attach [オプション] コンテナID
コンテナに接続する。コンテナ内でシェルが動作している必要がある。また接続後exitでシェルを抜けるとコンテナ自体も停止する
docker container exec [オプション] コンテナID コマンド (Execute)
コンテナに接続して新たなコマンド(シェルなど)を実行する。また接続後exitでシェルを抜けてもコンテナは停止しない
-it
インタラクティブモードで実行
-d
バックグラウンドで実行



docker container logs [オプション] コンテナID
コンテナのログを表示
docker container inspect [オプション] コンテナID
コンテナの詳細情報を表示
docker container stats [オプション] コンテナID
コンテナのリソースの使用状況をリアルタイムで表示
docker container stop [オプション] コンテナID
コンテナの停止(主にバックグラウンドで実行中のコンテナを停止)
docker container restart [オプション] コンテナID
コンテナの再起動(主にバックグラウンドで実行中のコンテナを再起動)
docker container [オプション] rm コンテナID
コンテナを削除する。基本的にコンテナを停止してから実行する
-f
強制的に削除する



docker container prune
停止中のコンテナを一括削除
-f
確認プロンプトを表示せずに削除



docker container export コンテナ名 > 出力ファイル名.tar
コンテナのエクスポート
docker container import 出力ファイル名.rar 新しいイメージ名
コンテナイメージとしてインポート

Dockerfile
# コメントとなる
Dockerfile内では大文字と小文字を区別しない
複数の命令は&&でつなげる
\(バックスラッシュ) で改行をエスケープする
作業ディレクトリにDockerfileという名前のファイルを作成する

FROM イメージ名
ベースとなるコンテナイメージを指定する
FROM ubuntu:22.04



RUN シェルコマンド
docker image buildを実行した時に実行するシェルコマンドを設定する
アプリケーションのインストール、ユーザーの追加などを行う
RUNで実行されたコマンドの結果は、イメージに反映される
RUN apt update
RUN apt install -y python3.10(-yはy/nを確認しないオプション)
RUN apt install -y python3-pip
RUN apt update && apt install -y python3.11(複数のコマンドは&&でつなげると容量が軽くなる)



CMD [“コマンド”[, “引数”, ...]]
docker attach(docker run)を実行した時にデフォルトで実行するコマンドを指定する
コンテナ起動時にコマンドラインから別のコマンドを指定すれば上書きとなる
Dockerfile内では1つのCMDのみが有効
CMD [“echo”, “hello world!”]



ENTRYPOINT [“コマンド”,  [“引数”, ...]]
docker start(run)を実行した時に必ず実行するコマンドを指定する
docker start(run)の末尾に続く引数はENTRYPOINTで指定したコマンドの引数として扱われる

ENTRYPOINT [“python3”, “test.py”]



WORKDIR パス
作業ディレクトリを絶対パスか相対パスで指定する。ディレクトリが存在しない場合は新たに作成される
COPY コピー元ファイルかディレクトリ コピー先ディレクトリ
ファイルまたはディレクトリをコピーする
COPY requirements.txt ${PWD}



ADD 追加元のファイルパス 追加先のファイルパス
COPYと違ってurlの指定もできて、zipファイルは解凍されるので必要に応じて使う
ENV 環境変数名=代入する値
コンテナ側に環境変数を設定する
ARG 変数名[=値]
Dockerfile内でのみ使える一時変数を定義する
USER ユーザー名
指定したユーザーでログインする
EXPOSE ポート番号
コンテナのアプリケーションで使用するポート番号を指定する
指定したポートはコンテナを起動する際に-pオプションでホストのポートに割り当てる


docker build [オプション] パス
-f 名前
ビルドするDockerfileの名前を指定する。デフォルトでDockerfile
-t イメージ名:タグ
イメージのタグを指定する





apt -m install python3.10
apt install python3-pip

Docker compose
composeのコマンド
docker compose up
サービスの起動／再起動
-d
バックグラウンドで起動
--build
Dockerfileに変更があった場合、必要に応じてイメージをビルドしてコンテナを起動する
キャッシュを利用して変更があった部分のみを再ビルドするので、イメージを削除するよりも高速になる



docker compose down
サービスの停止とコンテナの削除
--rmi all
イメージとコンテナを一括削除
--rmi local
ビルドされたイメージとコンテナの削除



docker compose exec コンテナ名 コマンド
コマンドの実行
docker compose logs
ログの表示
docker compose ps
コンテナの一覧を表示
docker compose start
サービスの開始
docker compose stop
サービスの停止
docker compose build
イメージのビルドを行う
Dockerfileに変更があった場合、必要に応じてイメージを再ビルドする
docker compose create
コンテナの作成のみを行う
docker compose run
サービスのコンテナを起動

compose.yaml
services:
任意のサービス名
image:
イメージを使用する場合のベースイメージ／ビルドイメージ名
build:
Dockerfileの格納先を指定する
container_name:
コンテナ名
expose:
“80”
コンテナ間で公開するポート番号(ホストには公開しない)
ports:
“8080:80”
ホストに公開するポート番号(ポートフォワーディング)
environment:
環境変数
env_file:
環境変数をまとめたファイルを指定する。ここで指定したファイルの内容がそのままコンテナの環境変数として設定される。
env_file: .env
# .env
BASE_DIR=/var/mydb
MYSQL_ROOT_PASSWARD=rootpass
MYSQL_DATABASE=plactice_db



volumes:
ボリュームのマウント／名前付きボリューム
volumes:
  - ${PWD}:${BASE_DIR}



depends_on:
サービスの依存関係
stdin_open:
標準入力の受付
tty:
疑似TTY端末の割り当て
command:
デフォルトのコマンドを上書き


services:
  db:
    image: mypython:1
    container_name: mypy
    volumes:
      -  ./src:/var/app/src

複数のDockerfileをcompose.yamlで読み込む場合
# Dockerfileを用意する
Dockerfile.app
Dockerfile.db
version: '3'
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

devcontainer
Remote Developmentの拡張機能を入れて

ファイルの永続化
コンテナ内でフォルダやファイルを作成してもコンテナを削除すると共に消えてしまう。そこでホスト側(windowsやMac)のフォルダをコンテナにマウントすることでフォルダやファイルを永続化する。よく利用されるマウントには2種類ある。
volume:ホスト側で名前が付いたボリュームを作成し、コンテナに割り当てる方法。bindよりもアクセス速度が速く、公式サイトでは新たにコンテナを運用する場合にはvolimeを使うことが推奨されている。
WSLの場合”\\wsl.localhost\docker-desktop-data\data\docker\volumes\”配下に作成される。
bind:ホスト側の任意のフォルダをコンテナに割り当てる方法。ホスト側でもフォルダの内容を操作したい場合に使用する。
volumeを使ったマウント
docker volume create オプション
ボリュームの作成
--name
volumeに名前を設定する



docker volume ls
ボリュームの一覧を表示
docker volume rm
ボリュームの削除
docker volume prune
未使用のボリュームの一括削除


docker container run -it --mount src=vol_test,dst=/tmp/vol_test python /bin/bash
srcにボリューム名、dstにコンテナ側の割当先のディレクトリ名を指定する。

bindを使ったマウント
事前準備としてホスト側でフォルダを作成する。
docker container run -it --rm --mount type=bind,src=$(PWD)/test,dst=/tmp/test python /bin/bash
type=bindでbindを指定、srcにフォルダ名、dstにコンテナ側の割り当て先のディレクトリ名を指定する。srcのフォルダ名は絶対パスで指定する必要がある。フォルダが存在しない場合エラーになる。

-vを使ったマウント
docker container create -v ホスト側のパス:コンテナ側のパス[:オプション] コンテナID
:ro
読み込み専用
:wr
読み書き可能




作成済みコンテナ内のファイルをコピーする
docker cp [オプション] コンテナIDもしくはコンテナ名:コンテナ側のパス ホスト側のパス



DockerCEのインストール手順
まずはwsl2をインストールする(管理者権限でPowerShellを実行)
wsl --install
wsl --set-default-version 2

wslの更新
ubuntuのインストール
wsl --install -d ubuntu


競合するパッケージがある可能性がある場合はアンインストールする
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done

dockeのaptリポジトリを設定する
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

dockerのパッケージをインストールする
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

インストールができているかの確認
sudo docker run hello-world

sudoを付けずに実行するためのコマンド
sudo gpasswd -a [ユーザー名] docker
sudo chgrp docker /var/run/docker.sock
sudo systemctl restart docker

コマンドを入力後ubuntuを再起動する

