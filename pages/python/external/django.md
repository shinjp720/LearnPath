---
title: Django
layout: default
---

# Django <a id="top" data-name="TOP"></a>

## 導入 <a id="introduction" data-name="導入"></a>

### 仮想環境の作成とインストール

```bash
# 仮想環境の作成
python3 -m venv .venv

# 仮想環境の実行
source .venv/bin/activate

# Djangoのインストール
pip install django
```

## プロジェクトの作成 <a id="make-project" data-name="プロジェクトの作成"></a>

### プロジェクトの作成

```bash
# プロジェクトを作成
django-admin startproject djangoproject .
```

<pre><code class="tips">最後に .(ドット) を入れることにより .venv と同じディレクトリにプロジェクトを作成できる。</code></pre>

### サーバーの起動

この時点で起動が可能。

```bash
# プロジェクト内へ移動
cd djangoproject

# サーバーを起動
python manage.py runserver
```

### 生成されるファイル

| --- | --- |
| manage.py | Django のコマンドを使うためのモジュール |
| __init__.py | 他のファイルから読み込むためのファイル |
| urls.py | ルーティングを記述するためのモジュール |
| settings.py | プロジェクト全体の設定情報を記述するモジュール |
| wsgi.py | WSGIサーバー用のモジュール |
| asgi.py | ASGIサーバー用のモジュール |

---

## アプリの作成 <a id="make-app" data-name="アプリの作成"></a>

manage.py があるディレクトリ内で次のコマンドを入力。

```bash
python manage.py startup myapp
```

### 生成されるファイル

| --- |
| __init__.py |
| admin.py |
| apps.py |
| models.py |
| tests.py |
| views.py |
| migrationsディレクトリ |

---













## manage.pyのコマンド <a id="command-manage" data-name="manage.pyのコマンド"></a>

```bash
python manage.py command
```

#### startup

```bash
python manage.py startup app_name
```

コマンドで入力されたアプリケーション用のディレクトリがプロジェクト内に作成され、以下のファイルとディレクトリが生成される。

#### runserver

```bash
python manage.py runserver
```

開発用サーバーを起動する。

#### makemigrations

```bash
python manage.py makemigrations
```









#### createsuperuser

プロジェクトの管理者(スーパーユーザー)を作成する。

```bash
python manage.py createsuperuser
```

コマンドを実行すると、ユーザー名、メールアドレス、パスワードの入力が求められ、すべてを入力するとスーパーユーザーが作成される。


---



