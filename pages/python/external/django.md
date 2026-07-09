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
| urls.py | ルーティングを記述するためのファイル |
| settings.py | プロジェクト全体の設定情報を記述するファイル |
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
| migrations/ | データベースの変更履歴を記録するディレクトリ |
| admin.py | Djangoの管理画面の設定ファイル |
| apps.py | アプリケーション自体の設定ファイル |
| models.py | データベースの構造 (model) を定義するファイル |
| tests.py | テストコードを書くファイル |
| views.py | 画面の表示処理やビジネスロジックを書くファイル |

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

プロジェクトを作成した時に設定しておきたい (後から変更が大変になる) 。



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

## ルーティング <a id="routing" data-name="ルーティング"></a>

urls.py の urlpatterns[] に path() を追記してルーティングを設定する。

### django.urls.path()

```python
# 書式
path(route, view, kwargs=None, name=None)
```

| --- | --- |
| route | ルートディレクトリを指定する |
| view | ビューまたは as_view() で返されるビューを指定する |
| kwargs | ビューで定義されている関数やメソッドが引数を取る場合に渡す |
| name | path() 関数で設定した URLパターンに名前を付けられる |


## Model <a id="model" data-name="Model"></a>

### クエリセット

モデルオブジェクトが1件のデータなら、クエリセットは検索条件、または検索結果の集合。<br>
クエリセットで条件を組み立てて、必要に応じてモデルオブジェクトを取り出す。

<pre><code class="tips">QuerySet は SQL を組み立てるためのオブジェクト。</code></pre>

以下のようなモデルがあったとする。

```python
class User(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
```

#### all()

全てのレコードを取得する。

```python
users = User.objects.all()
```

#### filter()

条件を追加する。

```python
users = User.objects.filter(age=20)
```

#### exclude()

逆条件 (NOT)。

```python
users = User.objects.exclude(age=20)
```

#### get()

条件でオブジェクトを返す。

```python
user = User.objects.get(pk=1)
```

#### first()

最初の1件を返す。なければ None。

```python
user = User.objects.first()
```


#### last()

最後の1件を返す。なければ None。

```python
user = User.objects.last()
```

#### exists()

あるかどうかを bool で返す。

```python
User.objects.filter(age=20).exists()
```

非常に高速。

#### count()

件数。

```python
User.objects.count()
```

#### order_by()

並び替え。

```python
User.objects.order_by("age")
```

逆順。

```python
User.objects.order_by("-age")
```

#### values_list()

カラムの値をタプルで返す。

```python
User.objects.values_list("name")
```

```
[
    ("Taro",),
    ("Jiro",)
]
```

リストにするなら。

```python
User.objects.values_list(
    "name",
    flat=True
)
```

```
[
    "Taro",
    "Jiro"
]
```

#### only()

必要な列だけ取得して、不要な列を遅延ロードする。

```python
User.objects.only("name")
```

逆に email だけを遅延ロード。

```python
User.objects.defer("email")
```

#### update()

一括更新。

```python
User.objects.filter(age=20).update(age=21)
```

#### delete()

条件で削除。

```python
User.objects.filter(age=20).delete()
```

#### bulk_create()

まとめて INSERT。

```python
User.objects.bulk_create([
    User(name="A"),
    User(name="B"),
    User(name="C"),
])
```

<pre><code class="tips">QuerySet は遅延評価であり、値が必要になった時にまとめて実行される。</code></pre>

---

### モデルオブジェクト

Django のモデルオブジェクトは、データベースの1レコードを Python オブジェクトとして扱うためのもの。

```python
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    email = models.EmailField()
```

以上のようなモデルがあったとして、以下のようにモデルオブジェクトを取得する。

```python
user = User.objects.get(pk=1)
```

フィールドには属性としてアクセスすることができ、

```python
print(user.name)
print(user.age)
```

値を書き換えられる。ただしこの時点ではデータベースに反映されていない。

```python
user.name = "Jiro"
user.age = 25
```

#### save()

```python
user.save()
```

これで UPDATE される。

#### delete()

```python
user.delete()
```

これで DELETE される。

#### create()

```python
user = User.objects.create(
    name="Taro",
    age=20,
    email="a@example.com"
)
```

これで INSERT される。

```python
user = User(
    name="Taro",
    age=20,
    email="a@example.com"
)

user.save()
```

これも同じ意味。

### その他の操作

#### 主キーの取得

pkが主キーを表す。

```python
user.pk
```

<pre><code class="tips">主キーを設定しなかった場合、自動で id というフィールドが pk として追加される。</code></pre>


#### 辞書化

```python
from django.forms.models import model_to_dict

obj = model_to_dict(user)
```

#### オブジェクトをコピー

```python
user.pk = None
user.save()
```

#### オブジェクト同士を比較

```python
u1 = User.objects.get(pk=1)
u2 = User.objects.get(pk=1)

print(u1 == u2)
```

#### リレーションへアクセス

例えばこういうモデル。

```python
class Post(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
```

取得。

```python
post = Post.objects.get(pk=1)
```

親へ。

```python
post.author
```

逆参照。

```python
user.post_set.all()
```

#### 値を最新にする

値を最新の状態 (データベースの値) に書き換える。

```python
user.refresh_from_db()
```

---









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

---
