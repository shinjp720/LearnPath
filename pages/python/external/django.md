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

---

## プロジェクト作成時の流れ <a id="start-project" data-name="プロジェクト作成時の流れ"></a>

### プロジェクトの作成

```bash
django-admin startproject djangoproject .
```

<pre><code class="tips">最後に .(ドット) を入れることにより .venv と同じディレクトリにプロジェクトを作成できる。</code></pre>

#### 生成されるファイル

| --- | --- |
| manage.py | Django のコマンドを使うためのモジュール |
| `__init__.py` | 他のファイルからモジュールを読み込むためのファイル |
| urls.py | ルーティングを記述するためのモジュール |
| settings.py | プロジェクト全体の設定情報を記述するモジュール |
| wsgi.py | WSGIサーバー用のモジュール |
| asgi.py | ASGIサーバー用のモジュール |

### サーバーの起動

この時点で起動が可能なので確認。

```bash
# プロジェクト内へ移動
cd djangoproject

# サーバーを起動
python manage.py runserver
```

### アプリの作成 

manage.py があるディレクトリ内で次のコマンドを入力。

```bash
python manage.py startapp myapp
```

コマンドで入力したアプリケーション用のディレクトリがプロジェクト内に作成され、以下のファイルとディレクトリが生成される。

| --- | --- |
| `__init__.py` | 他のファイルからモジュールを読み込むためのファイル |
| admin.py |  |
| apps.py |  |
| models.py |  |
| tests.py |  |
| views.py |  |
| migrationsディレクトリ |  |

### settings.py に登録

```python
# settings.py

INSTALLED_APPS = [
    ...
    "myapp",
]
```

これをしないと

- Model
- Template
- Migration

などが認識されない。

### ルーティング

まずプロジェクト側

```python
# config/urls.py

from django.urls import include, path

urlpatterns = [
    path("", include("myapp.urls")),
]
```

次にアプリ側に urls.py を作る。

```
myapp/
    urls.py
```

```python
# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
]
```

### View の作成

```python
# blog/views.py

from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello")
```

これで URL と処理がつながる。

### Model の作成

```python
from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=100)
```

### Migration の作成

```bash
python manage.py makemigrations
```

Migration ファイルが作成される。

### DB へ反映

```bash
python manage.py migrate
```

ここで DB にテーブルが作成される。

### Template の作成

一般的な構造。

```
blog/
    templates/
        blog/
            index.html
```

View を変更。

```python
from django.shortcuts import render

def index(request):
    return render(request, "myapp/index.html")
```

---

## 設定 <a id="settings" data-name="設定"></a>

### スーパーユーザーの作成



### カスタムユーザーモデルへの切り替え

プロジェクトを作成した時に設定しておきたい (後から変更が大変) 。



### データベースの指定

```python
DATABASES = {
    ...
}
```

### タイムゾーン

```python
TIME_ZONE = "Asia/Tokyo"
```

### 言語

```python
LANGUAGE_CODE = "ja"
```

### Static ファイル

```python
STATIC_URL = "static/"
```

必要なら、

```python
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
```

### Media ファイル

```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

### DRF を使う場合

```bash
pip install djangorestframework
```

```python
INSTALLED_APPS = [
    ...
    "rest_framework",
]
```

---

## manage.pyのコマンド <a id="command-manage" data-name="manage.pyのコマンド"></a>

### startproject

プロジェクトを作成する。

### startapp

アプリを作成する。

```bash
python manage.py startapp app_name
```

### runserver

開発用サーバーを起動する。

```bash
python manage.py runserver
```

### makemigrations

マイグレーションを実行するための情報が記述されたモジュールを生成する。

```bash
python manage.py makemigrations
```

#### createsuperuser

プロジェクトの管理者(スーパーユーザー)を作成する。

```bash
python manage.py createsuperuser
```

コマンドを実行すると、ユーザー名、メールアドレス、パスワードの入力が求められ、すべてを入力するとスーパーユーザーが作成される。
