---
title: Django プロジェクトの立ち上げ手順と settings.py
layout: default
---

# Django プロジェクトの立ち上げ手順と settings.py

Djangoでは、**「プロジェクトを作る → アプリを作る → settings.py を設定する → URLをつなぐ」** という流れが基本になります。
Webアプリ開発では毎回ほぼ同じ手順を踏むので、テンプレートとして覚えてしまうのがおすすめです。

`settings.py` は **Djangoプロジェクト全体の設定ファイル** です。設定項目は非常に多いですが、普段の開発で触るのは20個程度なので、**立ち上げ手順の各ステップで必要になるタイミングに合わせて** 説明します。

---

# 全体の流れ

```text
① プロジェクト作成
        ↓
② アプリ作成
        ↓
③ settings.py にアプリを登録
        ↓
④ urls.py を接続
        ↓
⑤ Model作成（＋ DB設定）
        ↓
⑥ makemigrations
        ↓
⑦ migrate
        ↓
⑧ View作成
        ↓
⑨ Template作成
        ↓
⑩ 動作確認
```

---

# ① プロジェクト作成

```bash
django-admin startproject config .
```

```text
myproject/
│
├── manage.py
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
```

この時点では**プロジェクトだけ**あります。このとき生成される `settings.py` に、まず次の4つが入っています。

## BASE_DIR

プロジェクトのルートディレクトリです。

```python
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
```

上の構成なら `BASE_DIR` は `myproject/` になります。
`BASE_DIR / "db.sqlite3"` のように、パスの組み立てに使います。

## SECRET_KEY

暗号化に使われる秘密鍵です。

```python
SECRET_KEY = "xxxxxxxxxxxxxxxx"
```

次のような処理で使われます。

- セッション
- CSRF
- パスワードリセット
- Cookie署名

**公開してはいけません。** 本番では環境変数から読み込むのが一般的です。

## DEBUG

開発モードかどうかを切り替えます。

```python
DEBUG = True   # 開発
DEBUG = False  # 本番
```

`False` にすると、

- 詳細エラー画面が消える
- Staticファイルの扱いが変わる
- セキュリティ関連の設定が有効になる

といった変化があります。

## ALLOWED_HOSTS

アクセスを許可するホスト名です。

```python
ALLOWED_HOSTS = [
    "example.com",
    "localhost",
]
```

開発中は `ALLOWED_HOSTS = []` でも `DEBUG = True` なら動きます。本番公開時に必須になります。

---

# ② アプリ作成

```bash
python manage.py startapp blog
```

```text
blog/
    admin.py
    apps.py
    migrations/
    models.py
    tests.py
    views.py
```

---

# ③ settings.py に登録（INSTALLED_APPS）

**一番忘れやすい作業です。**

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    ...
    "blog",
]
```

ここに書いたアプリだけが、

- モデル
- マイグレーション
- テンプレート
- static

などに参加します。登録しないと認識されません。**自作アプリは必ず追加します。**

---

# ④ URLを接続（ROOT_URLCONF）

`settings.py` の `ROOT_URLCONF` が、最初に読み込まれるURLファイルを指しています。

```python
ROOT_URLCONF = "config.urls"
```

まずプロジェクト側で、アプリのURLを `include()` します。

```python
# config/urls.py

from django.urls import include, path

urlpatterns = [
    path("", include("blog.urls")),
]
```

次にアプリ側に `blog/urls.py` を作ります。

```python
# blog/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
]
```

---

# ⑤ Model作成（＋ DATABASES）

```python
# blog/models.py

from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=100)
```

## DATABASES

データベース接続の設定です。デフォルトはSQLiteで、そのまま使えます。

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

MySQLなど他のDBを使う場合は書き換えます。

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "...",
        "USER": "...",
        "PASSWORD": "...",
    }
}
```

## DEFAULT_AUTO_FIELD

自動生成される主キー（`id`）の型です。

```python
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
```

これにより `id` は64bit整数になります。

---

# ⑥ Migration作成

```bash
python manage.py makemigrations
```

Migrationファイルが生成されます。

---

# ⑦ DBへ反映

```bash
python manage.py migrate
```

ここでDBにテーブルが作られます。

---

# ⑧ View作成

まずは動作確認用に、文字列を返すだけのViewを作ります。

```python
# blog/views.py

from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello")
```

ここでURLと処理がつながります。

---

# ⑨ Template作成（TEMPLATES）

一般的には次の構成でテンプレートを置きます。

```text
blog/
    templates/
        blog/
            index.html
```

Viewを `render` に変更します。

```python
from django.shortcuts import render

def index(request):
    return render(request, "blog/index.html")
```

`settings.py` の `TEMPLATES` は、テンプレートを探す場所などを設定する項目です。

```python
TEMPLATES = [
    {
        ...
    }
]
```

アプリ内の `templates/` を使うだけなら、デフォルトのままで動きます（`APP_DIRS: True`）。プロジェクト直下の `templates/` も使いたい場合は `DIRS` に追加します。

---

# ⑩ 開発サーバー起動

```bash
python manage.py runserver
```

アクセスすると、`Hello` または `index.html` の内容が表示されます。

---

# よく一緒に設定するもの

## 言語とタイムゾーン

```python
LANGUAGE_CODE = "ja"           # 例: "ja", "en-us"
TIME_ZONE = "Asia/Tokyo"
```

関連する設定として、次の2つがあります。

```python
USE_I18N = True   # 国際化（翻訳機能）を使う
USE_TZ = True     # タイムゾーン対応。通常は True（DBにはUTCで保存される）
```

## Staticファイル（CSS・JS・画像）

```python
STATIC_URL = "static/"
```

プロジェクト共通のstaticディレクトリを追加するなら、開発ではよく次を使います。

```python
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
```

本番では `collectstatic` の出力先として `STATIC_ROOT` を設定します。

```python
STATIC_ROOT = BASE_DIR / "staticfiles"
```

## Mediaファイル（ユーザーのアップロード）

ユーザー画像などのアップロードを扱う場合に設定します。

```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

`MEDIA_URL` がURLのパス、`MEDIA_ROOT` が保存先です。

## 開発から本番へ

本番では最低限、次を変更します。

```python
DEBUG = False
ALLOWED_HOSTS = ["example.com"]
# SECRET_KEY は環境変数から読み込む
```

---

# DRF（Django REST Framework）を使う場合の追加設定

APIバックエンドとして使う場合は、初期設定で次の2つを行うことが多いです。

1. パッケージをインストール
   ```bash
   pip install djangorestframework
   ```

2. `INSTALLED_APPS` に追加
   ```python
   INSTALLED_APPS = [
       ...
       "rest_framework",
       "blog",
   ]
   ```

その後、必要に応じて `REST_FRAMEWORK` 設定（認証方式、ページネーションなど）を追加します。

---

# 普段あまり触らない設定

プロジェクト作成時に自動で入っていて、通常はそのままで問題ない設定です。

## MIDDLEWARE

リクエスト・レスポンスの途中で実行される処理です。セッション、認証、CSRF、共通処理などがここで動きます。

```python
MIDDLEWARE = [
    ...
]
```

```text
Request
   ↓
Middleware
   ↓
View
   ↓
Middleware
   ↓
Response
```

## WSGI_APPLICATION / ASGI_APPLICATION

デプロイ時に使うサーバー向けの設定です。

```python
WSGI_APPLICATION = "config.wsgi.application"
```

- **WSGI**：Gunicornなど、従来型の同期サーバーで利用。普段は触りません。
- **ASGI**：WebSocketや非同期通信で利用。`config/asgi.py` が用意されています。なお、`ASGI_APPLICATION` という設定項目は、WebSocketを扱う Channels などを導入するときに自分で追加するのが一般的です。

## AUTH_PASSWORD_VALIDATORS

パスワード強度のチェックです（長さ、数字のみ禁止、よくあるパスワード禁止など）。

```python
AUTH_PASSWORD_VALIDATORS = [
    ...
]
```

---

# 開発でよく変更する設定

| 設定 | 用途 | 触る頻度 |
|------|------|---------|
| `INSTALLED_APPS` | アプリ追加 | ★★★★★ |
| `DATABASES` | DB接続 | ★★★★★ |
| `STATIC_URL` / `STATICFILES_DIRS` | CSS・JS | ★★★★★ |
| `DEBUG` | 開発・本番切替 | ★★★★★ |
| `MEDIA_URL` / `MEDIA_ROOT` | アップロード | ★★★★☆ |
| `LANGUAGE_CODE` | 日本語化 | ★★★★☆ |
| `TIME_ZONE` | タイムゾーン | ★★★★☆ |
| `ALLOWED_HOSTS` | 本番公開 | ★★★★☆ |
| `SECRET_KEY` | 秘密鍵 | ★★★★☆ |
| `ASGI_APPLICATION` | WebSocket対応 | ★★★☆☆ |

Djangoに慣れてくると、これらに加えて `LOGGING`（ログ出力）、`CACHES`（キャッシュ）、`EMAIL_BACKEND`（メール送信）、`AUTH_USER_MODEL`（カスタムユーザーモデル）、`REST_FRAMEWORK`（DRFの設定）などもよく扱うようになります。

---

# 毎回のチェックリスト

開発を始めるたびに、この順番で確認するとスムーズです。

| 手順 | 内容 | 必須 |
|------|------|:---:|
| ① | プロジェクト作成 (`startproject`) | ✅ |
| ② | アプリ作成 (`startapp`) | ✅ |
| ③ | `INSTALLED_APPS` に登録 | ✅ |
| ④ | プロジェクト側 `urls.py` で `include()` | ✅ |
| ⑤ | アプリ側 `urls.py` を作成 | ✅ |
| ⑥ | `views.py` を作成 | ✅ |
| ⑦ | `models.py` を作成（必要なら） | △ |
| ⑧ | `makemigrations` | モデル変更時 |
| ⑨ | `migrate` | モデル変更時 |
| ⑩ | テンプレートやAPIを実装し、`runserver` で動作確認 | ✅ |

この流れは、テンプレートを返す従来型のDjangoアプリでも、Vue.jsなどと組み合わせたAPIバックエンドとしてのDjangoでも共通です。
