---
title: Django プロジェクトの立ち上げ手順と settings.py
layout: default
---

# Django プロジェクトの立ち上げ手順と settings.py <a id="top" data-name="TOP"></a>

Djangoでは、**「プロジェクトを作る → アプリを作る → settings.py を設定する → URLをつなぐ」** という流れが基本になる。
Webアプリ開発では毎回ほぼ同じ手順を踏むので、テンプレートとして覚えてしまうのがおすすめ。

`settings.py` は **Djangoプロジェクト全体の設定ファイル** である。設定項目は非常に多いが、普段の開発で触るのは20個程度なので、**立ち上げ手順の各ステップで必要になるタイミングに合わせて** 説明する。

仮想環境の作成と Django のインストールは、Django のノートの「導入」を参照。

---

## 全体の流れ <a id="flow" data-name="全体の流れ"></a>

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

## ① プロジェクト作成 <a id="create-project" data-name="① プロジェクト作成"></a>

```bash
django-admin startproject config .
```

<pre><code class="tips">最後に .(ドット) を入れることにより、カレントディレクトリ (.venv と同じ階層) に manage.py が作成される。
ドットを付けないと config/ の中にさらに config/ ができ、二重構造になる。</code></pre>

```text
myproject/
│
├── manage.py
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
```

この時点では**プロジェクトだけ**ある。

### 生成されるファイル

| --- | --- |
| manage.py | Django の各種コマンドを実行するためのスクリプト |
| `__init__.py` | そのディレクトリを Python のパッケージとして扱うためのファイル (空でよい) |
| urls.py | ルーティングを記述するためのファイル |
| settings.py | プロジェクト全体の設定情報を記述するファイル |
| wsgi.py | WSGIサーバー用のエントリーポイント |
| asgi.py | ASGIサーバー用のエントリーポイント |

### 生成される settings.py の設定

生成される `settings.py` に、まず次の4つが入っている。

#### BASE_DIR

プロジェクトのルートディレクトリ。

```python
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
```

上の構成なら `BASE_DIR` は `myproject/` になる。
`BASE_DIR / "db.sqlite3"` のように、パスの組み立てに使う。

#### SECRET_KEY

暗号化に使われる秘密鍵。

```python
SECRET_KEY = "xxxxxxxxxxxxxxxx"
```

次のような処理で使われる。

- セッション
- CSRF
- パスワードリセット
- Cookie署名

**公開してはいけない。** 本番では環境変数から読み込むのが一般的。

#### DEBUG

開発モードかどうかを切り替える。

```python
DEBUG = True   # 開発
DEBUG = False  # 本番
```

`False` にすると、

- 詳細エラー画面が消える
- Staticファイルの扱いが変わる
- セキュリティ関連の設定が有効になる

といった変化がある。

#### ALLOWED_HOSTS

アクセスを許可するホスト名。

```python
ALLOWED_HOSTS = [
    "example.com",
    "localhost",
]
```

開発中は `ALLOWED_HOSTS = []` でも `DEBUG = True` なら動く。本番公開時に必須になる。

---

## ② アプリ作成 <a id="create-app" data-name="② アプリ作成"></a>

manage.py があるディレクトリ内で次のコマンドを入力する。

```bash
python manage.py startapp blog
```

```text
blog/
    __init__.py
    admin.py
    apps.py
    migrations/
    models.py
    tests.py
    views.py
```

| --- | --- |
| `__init__.py` | そのディレクトリを Python のパッケージとして扱うためのファイル |
| migrations/ | データベースの変更履歴 (マイグレーションファイル) を記録するディレクトリ |
| admin.py | Djangoの管理画面の設定ファイル |
| apps.py | アプリケーション自体の設定ファイル |
| models.py | データベースの構造 (model) を定義するファイル |
| tests.py | テストコードを書くファイル |
| views.py | 画面の表示処理やビジネスロジックを書くファイル |

<pre><code class="tips">urls.py は自動では生成されないので、後で自分で作る。</code></pre>

---

## ③ settings.py に登録（INSTALLED_APPS） <a id="installed-apps" data-name="③ INSTALLED_APPS"></a>

**一番忘れやすい作業。**

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

などに参加する。登録しないと認識されない。**自作アプリは必ず追加する。**

---

## ④ URLを接続（ROOT_URLCONF） <a id="root-urlconf" data-name="④ ROOT_URLCONF"></a>

`settings.py` の `ROOT_URLCONF` が、最初に読み込まれるURLファイルを指している。

```python
ROOT_URLCONF = "config.urls"
```

まずプロジェクト側で、アプリのURLを `include()` する。

```python
# config/urls.py

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("blog.urls")),
]
```

次にアプリ側に `blog/urls.py` を作る。

```python
# blog/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
]
```

---

## ⑤ Model作成（＋ DATABASES） <a id="model" data-name="⑤ Model作成"></a>

```python
# blog/models.py

from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title
```

<pre><code class="tips">__str__() を定義しておくと、管理画面やシェルでオブジェクトがタイトルなどで表示される。</code></pre>

### DATABASES

データベース接続の設定。デフォルトはSQLiteで、そのまま使える。

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

MySQLなど他のDBを使う場合は書き換える。

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

PostgreSQL の場合は `ENGINE` を `django.db.backends.postgresql` にし、`pip install psycopg` でドライバーを入れる。`HOST` や `PORT` も必要に応じて指定する。

### DEFAULT_AUTO_FIELD

自動生成される主キー（`id`）の型。

```python
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
```

これにより `id` は64bit整数になる。

### カスタムユーザーモデルへの切り替え

プロジェクトを作成した時に設定しておきたい (後から変更が大変になる) 。
Django では標準で User モデルが用意されているが、将来的にログインIDをユーザー名ではなくメールアドレスにしたい、プロフィール画像や電話番号の項目を追加したいとなった時、標準のままだとマイグレーションで衝突が起きる。

1. ユーザー管理用のアプリを作る (accounts など) 。
2. そのアプリの models.py に、標準の `AbstractUser` を継承したクラスを作る。中身が空でもよい。
    ```python
    from django.contrib.auth.models import AbstractUser

    class CustomUser(AbstractUser):
        pass
    ```
3. settings.py に以下を追記する (最初の migrate をする前に) 。
    ```python
    AUTH_USER_MODEL = "accounts.CustomUser"
    ```

<pre><code class="tips">他のモデルからユーザーを参照する場合は User を直接 import せず、
settings.AUTH_USER_MODEL (ForeignKey などの定義時) や get_user_model() (関数内) を使う。</code></pre>

---

## ⑥ Migration作成 <a id="makemigrations" data-name="⑥ Migration作成"></a>

```bash
python manage.py makemigrations
```

Migrationファイル (blog/migrations/0001_initial.py など) が生成される。

---

## ⑦ DBへ反映 <a id="migrate" data-name="⑦ DBへ反映"></a>

```bash
python manage.py migrate
```

ここでDBにテーブルが作られる。<br>
Django 標準の認証や管理画面用のテーブルも、この時にまとめて作成される。

### スーパーユーザーの作成

管理画面にログインするためのユーザー。テーブルが必要なので `migrate` の後に行う。

```bash
python manage.py createsuperuser
```

ユーザー名、メールアドレス、パスワードの入力が求められる。<br>
作成後、`runserver` を起動して `http://127.0.0.1:8000/admin/` にアクセスするとログインできる。

---

## ⑧ View作成 <a id="view" data-name="⑧ View作成"></a>

まずは動作確認用に、文字列を返すだけのViewを作る。

```python
# blog/views.py

from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello")
```

ここでURLと処理がつながる。

---

## ⑨ Template作成（TEMPLATES） <a id="template" data-name="⑨ Template作成"></a>

一般的には次の構成でテンプレートを置く。

```text
blog/
    templates/
        blog/
            index.html
```

<pre><code class="tips">templates/ の下にさらにアプリ名のディレクトリを挟むのは、別のアプリに同名のテンプレート (index.html など) があっても衝突しないようにするため。</code></pre>

Viewを `render` に変更する。

```python
from django.shortcuts import render

def index(request):
    return render(request, "blog/index.html")
```

### TEMPLATES

`settings.py` の `TEMPLATES` は、テンプレートを探す場所などを設定する項目。

```python
TEMPLATES = [
    {
        ...
    }
]
```

アプリ内の `templates/` を使うだけなら、デフォルトのままで動く（`APP_DIRS: True`）。プロジェクト直下の `templates/` も使いたい場合は `DIRS` に `BASE_DIR / "templates"` を追加する。

---

## ⑩ 開発サーバー起動 <a id="runserver" data-name="⑩ 開発サーバー起動"></a>

```bash
python manage.py runserver
```

ブラウザで `http://127.0.0.1:8000/` にアクセスすると、`Hello` または `index.html` の内容が表示される。

<pre><code class="tips">プロジェクトを作成した直後 (④ より前) に runserver すると、ロケットのイラストの画面が表示される。
その時は「マイグレーションが未適用」という警告が出るが、⑦ の migrate で解消される。</code></pre>

---

## よく一緒に設定するもの <a id="common-settings" data-name="よく一緒に設定するもの"></a>

### 言語とタイムゾーン

```python
LANGUAGE_CODE = "ja"           # 例: "ja", "en-us"
TIME_ZONE = "Asia/Tokyo"
```

関連する設定として、次の2つがある。

```python
USE_I18N = True   # 国際化（翻訳機能）を使う
USE_TZ = True     # タイムゾーン対応。通常は True（DBにはUTCで保存される）
```

### Staticファイル（CSS・JS・画像）

```python
STATIC_URL = "static/"
```

プロジェクト共通のstaticディレクトリを追加するなら、開発ではよく次を使う。

```python
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
```

本番では `collectstatic` の出力先として `STATIC_ROOT` を設定する。

```python
STATIC_ROOT = BASE_DIR / "staticfiles"
```

### Mediaファイル（ユーザーのアップロード）

ユーザー画像などのアップロードを扱う場合に設定する。

```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

`MEDIA_URL` がURLのパス、`MEDIA_ROOT` が保存先。

<pre><code class="tips">開発サーバーで Media ファイルを配信するには、プロジェクトの urls.py に以下を追記する (DEBUG = True の時のみ有効)。
from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)</code></pre>

### 開発から本番へ

本番では最低限、次を変更する。

```python
DEBUG = False
ALLOWED_HOSTS = ["example.com"]
# SECRET_KEY は環境変数から読み込む
```

---

## DRF（Django REST Framework）を使う場合の追加設定 <a id="drf" data-name="DRF を使う場合"></a>

APIバックエンドとして使う場合は、初期設定で次の2つを行うことが多い。

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

その後、必要に応じて `REST_FRAMEWORK` 設定（認証方式、ページネーションなど）を追加する。

---

## 普段あまり触らない設定 <a id="rarely-settings" data-name="普段あまり触らない設定"></a>

プロジェクト作成時に自動で入っていて、通常はそのままで問題ない設定。

### MIDDLEWARE

リクエスト・レスポンスの途中で実行される処理。セッション、認証、CSRF、共通処理などがここで動く。

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

### WSGI_APPLICATION / ASGI_APPLICATION

デプロイ時に使うサーバー向けの設定。

```python
WSGI_APPLICATION = "config.wsgi.application"
```

- **WSGI**：Gunicornなど、従来型の同期サーバーで利用。普段は触らない。
- **ASGI**：WebSocketや非同期通信で利用。`config/asgi.py` が用意されている。なお、`ASGI_APPLICATION` という設定項目は、WebSocketを扱う Channels などを導入するときに自分で追加するのが一般的。

### AUTH_PASSWORD_VALIDATORS

パスワード強度のチェック（長さ、数字のみ禁止、よくあるパスワード禁止など）。

```python
AUTH_PASSWORD_VALIDATORS = [
    ...
]
```

---

## 開発でよく変更する設定 <a id="frequent-settings" data-name="開発でよく変更する設定"></a>

| 設定 | 用途 | 触る頻度 |
| --- | --- | --- |
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

Djangoに慣れてくると、これらに加えて `LOGGING`（ログ出力）、`CACHES`（キャッシュ）、`EMAIL_BACKEND`（メール送信）、`AUTH_USER_MODEL`（カスタムユーザーモデル）、`REST_FRAMEWORK`（DRFの設定）などもよく扱うようになる。

---

## 毎回のチェックリスト <a id="checklist" data-name="毎回のチェックリスト"></a>

開発を始めるたびに、この順番で確認するとスムーズ。

| 手順 | 内容 | 必須 |
| --- | --- | :---: |
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

この流れは、テンプレートを返す従来型のDjangoアプリでも、Vue.jsなどと組み合わせたAPIバックエンドとしてのDjangoでも共通。

---
