---
title: Django
layout: default
---

# Django <a id="top" data-name="TOP"></a>

## プロジェクトの立ち上げ

- [ Django プロジェクトの立ち上げ手順 ]({{ site.baseurl }}/pages/python/external/django_start.html)

## 導入 <a id="introduction" data-name="導入"></a>

### 仮想環境の作成とインストール

```bash
# 仮想環境の作成
python3 -m venv .venv

# 仮想環境の有効化 (macOS / Linux)
source .venv/bin/activate

# 仮想環境の有効化 (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Djangoのインストール
pip install django

# バージョンの確認
python -m django --version
```

---

## プロジェクト作成時の流れ <a id="start-project" data-name="プロジェクト作成時の流れ"></a>

### プロジェクトの作成

```bash
django-admin startproject djangoproject .
```

<pre><code class="tips">最後に .(ドット) を入れることにより、カレントディレクトリ (.venv と同じ階層) に manage.py が作成される。
ドットを付けないと djangoproject/ の中にさらに djangoproject/ ができ、二重構造になる。</code></pre>

```text
.venv/
manage.py
djangoproject/
├── __init__.py
├── asgi.py
├── settings.py
├── urls.py
└── wsgi.py
```

#### 生成されるファイル

| --- | --- |
| manage.py | Django の各種コマンドを実行するためのスクリプト |
| `__init__.py` | そのディレクトリを Python のパッケージとして扱うためのファイル (空でよい) |
| urls.py | ルーティングを記述するためのファイル |
| settings.py | プロジェクト全体の設定情報を記述するファイル |
| wsgi.py | WSGIサーバー用のエントリーポイント |
| asgi.py | ASGIサーバー用のエントリーポイント |

### サーバーの起動

この時点でサーバーを起動できるので、確認したい場合は次のようにする。

```bash
# manage.py があるディレクトリで実行する
python manage.py runserver
```

ブラウザで `http://127.0.0.1:8000/` を開き、ロケットのイラストが表示されれば成功。<br>
この時点では「マイグレーションが未適用」という警告が出るが、後で `migrate` するので問題ない。

### 設定

主に `settings.py` を編集する。

#### カスタムユーザーモデルへの切り替え

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

#### データベースの指定

何も変更しなければ SQLite が使われる。

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

PostgreSQL の場合 (`pip install psycopg` が必要)。

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "mydb",
        "USER": "myuser",
        "PASSWORD": "mypassword",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
```

#### タイムゾーン

```python
TIME_ZONE = "Asia/Tokyo"
USE_TZ = True
```

<pre><code class="tips">USE_TZ = True の場合、DB には UTC で保存され、表示時に TIME_ZONE に変換される。</code></pre>

#### 言語

```python
LANGUAGE_CODE = "ja"
```

#### Static ファイル

```python
STATIC_URL = "static/"
```

必要なら、

```python
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
```

本番環境では `collectstatic` で1か所に集めるため、出力先も指定する。

```python
STATIC_ROOT = BASE_DIR / "staticfiles"
```

#### Media ファイル

ユーザーがアップロードしたファイルの保存先。

```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

<pre><code class="tips">開発サーバーで Media ファイルを配信するには、プロジェクトの urls.py に以下を追記する (DEBUG = True の時のみ有効)。
from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)</code></pre>

#### その他よく触る設定

| --- | --- |
| SECRET_KEY | 署名などに使う秘密鍵。公開リポジトリに載せない |
| DEBUG | 開発時は True、本番では必ず False |
| ALLOWED_HOSTS | 公開するホスト名。DEBUG = False の時は設定が必須 |
| DEFAULT_AUTO_FIELD | 主キー (id) の型。新規プロジェクトでは BigAutoField |

<pre><code class="tips">SECRET_KEY や DB のパスワードは、環境変数や .env ファイルから読み込むようにする。</code></pre>

#### DRF を使う場合

```bash
pip install djangorestframework
```

```python
INSTALLED_APPS = [
    ...
    "rest_framework",
]
```

### アプリの作成

manage.py があるディレクトリ内で次のコマンドを入力。

```bash
python manage.py startapp myapp
```

コマンドで入力したアプリケーション用のディレクトリがプロジェクト内に作成され、以下のファイルとディレクトリが生成される。

| --- | --- |
| `__init__.py` | そのディレクトリを Python のパッケージとして扱うためのファイル |
| migrations/ | データベースの変更履歴 (マイグレーションファイル) を記録するディレクトリ |
| admin.py | Djangoの管理画面の設定ファイル |
| apps.py | アプリケーション自体の設定ファイル |
| models.py | データベースの構造 (model) を定義するファイル |
| tests.py | テストコードを書くファイル |
| views.py | 画面の表示処理やビジネスロジックを書くファイル |

<pre><code class="tips">urls.py は自動では生成されないので、後で自分で作る。</code></pre>

### settings.py に登録

```python
# settings.py

INSTALLED_APPS = [
    ...
    "myapp",
]
```

これをしないと

- Model (マイグレーションの対象にならない)
- Template (アプリ内の templates/ が見つからない)
- 管理画面や static ファイル

などが認識されない。

### ルーティング

まずプロジェクト側

```python
# djangoproject/urls.py

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("myapp.urls")),
]
```

次にアプリ側に urls.py を作る。

```text
myapp/
    urls.py
```

```python
# myapp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
]
```

### View の作成

```python
# myapp/views.py

from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello")
```

これで URL と処理がつながる。

### Model の作成

```python
# myapp/models.py

from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=100)

    def __str__(self):
        return self.title
```

<pre><code class="tips">__str__() を定義しておくと、管理画面やシェルでオブジェクトがタイトルなどで表示される。</code></pre>

### Migration の作成

```bash
python manage.py makemigrations
```

Migration ファイル (myapp/migrations/0001_initial.py など) が作成される。

### DB へ反映

```bash
python manage.py migrate
```

ここで DB にテーブルが作成される。<br>
Django 標準の認証や管理画面用のテーブルも、この時にまとめて作成される。

### スーパーユーザーの作成

管理画面にログインするためのユーザー。テーブルが必要なので `migrate` の後に行う。

```bash
python manage.py createsuperuser
```

ユーザー名、メールアドレス、パスワードの入力が求められる。

作成後、`runserver` を起動して `http://127.0.0.1:8000/admin/` にアクセスするとログインできる。

### Template の作成

一般的な構造。

```text
myapp/
  templates/
    myapp/
      index.html
```

<pre><code class="tips">templates/ の下にさらにアプリ名のディレクトリを挟むのは、別のアプリに同名のテンプレート (index.html など) があっても衝突しないようにするため。</code></pre>

View を変更。

```python
from django.shortcuts import render

def index(request):
    return render(request, "myapp/index.html")
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
| route | URL のパターンを文字列で指定する (例: `"articles/<int:pk>/"`) |
| view | ビュー関数、または クラスベースビューの as_view() で返されるビューを指定する |
| kwargs | ビューに追加で渡したい引数を辞書で指定する |
| name | URL パターンに名前を付ける。テンプレートや `reverse()` で URL を逆引きできる |

### URL から値を受け取る

`<型:名前>` の形で書くと、URL の一部をビューの引数として受け取れる。

```python
urlpatterns = [
    path("articles/<int:pk>/", views.detail, name="detail"),
]
```

```python
def detail(request, pk):
    ...
```

| コンバーター | 説明 |
| --- | --- |
| str | `/` 以外の文字列 (型を省略した場合はこれ) |
| int | 0以上の整数 |
| slug | 英数字、ハイフン、アンダースコアからなる文字列 |
| uuid | UUID |
| path | `/` を含む文字列 |

### include() と app_name

アプリ側の urls.py に `app_name` を書くと名前空間をつけられる。

```python
# myapp/urls.py

app_name = "myapp"

urlpatterns = [
    path("", views.index, name="index"),
]
```

### URL の逆引き

URL を直接書かず、name から生成する。

```python
from django.urls import reverse

reverse("myapp:detail", kwargs={"pk": 1})  # /articles/1/
```

```html
<a href="{% url 'myapp:detail' pk=article.pk %}">詳細</a>
```

---

## View <a id="view" data-name="View"></a>

リクエスト (`HttpRequest`) を受け取り、レスポンス (`HttpResponse`) を返す。

### 関数ベースビュー

```python
from django.shortcuts import get_object_or_404, redirect, render
from .models import Article

def article_list(request):
    articles = Article.objects.all()
    return render(request, "myapp/list.html", {"articles": articles})

def article_detail(request, pk):
    article = get_object_or_404(Article, pk=pk)
    return render(request, "myapp/detail.html", {"article": article})
```

<pre><code class="tips">get_object_or_404() は、オブジェクトがなければ例外ではなく 404 ページを返してくれる。</code></pre>

### request の主な属性

| --- | --- |
| request.method | HTTP メソッド (`"GET"` や `"POST"`) |
| request.GET | クエリパラメータ (`?q=django` など) |
| request.POST | フォームから POST された値 |
| request.FILES | アップロードされたファイル |
| request.user | ログイン中のユーザー |

### クラスベースビュー

よくある処理が部品として用意されている。

```python
from django.views.generic import DetailView, ListView
from .models import Article

class ArticleListView(ListView):
    model = Article
    template_name = "myapp/list.html"
    context_object_name = "articles"

class ArticleDetailView(DetailView):
    model = Article
    template_name = "myapp/detail.html"
```

urls.py では `as_view()` を使って指定する。

```python
path("", views.ArticleListView.as_view(), name="list"),
path("<int:pk>/", views.ArticleDetailView.as_view(), name="detail"),
```

| ビュー | 説明 |
| --- | --- |
| ListView | 一覧表示 |
| DetailView | 詳細表示 |
| CreateView | 新規作成 |
| UpdateView | 更新 |
| DeleteView | 削除 |
| TemplateView | テンプレートを表示するだけ |

---

## Template <a id="template" data-name="Template"></a>

HTML に Python のデータを埋め込むための仕組み。

### 変数とタグ

```html
<!-- 変数 -->
<h1>{{ article.title }}</h1>

<!-- タグ (繰り返し) -->
<ul>
  {% for article in articles %}
    <li>{{ article.title }}</li>
  {% empty %}
    <li>記事がありません</li>
  {% endfor %}
</ul>

<!-- タグ (条件分岐) -->
{% if user.is_authenticated %}
  <p>{{ user.username }} さん</p>
{% else %}
  <p>ログインしてください</p>
{% endif %}
```

### フィルター

`|` で値を加工する。

```html
{{ article.title|upper }}
{{ article.body|truncatechars:50 }}
{{ article.created_at|date:"Y/m/d H:i" }}
{{ value|default:"なし" }}
```

### テンプレートの継承

共通部分を base.html にまとめる。

```html
<!-- templates/base.html -->
<!DOCTYPE html>
<html lang="ja">
<head>
  <title>{% block title %}サイト名{% endblock %}</title>
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>
```

```html
<!-- templates/myapp/index.html -->
{% extends "base.html" %}

{% block title %}トップ{% endblock %}

{% block content %}
  <h1>Hello</h1>
{% endblock %}
```

<pre><code class="tips">プロジェクト共通の templates/ を使う場合は、settings.py の TEMPLATES の "DIRS" に BASE_DIR / "templates" を追加する。</code></pre>

### Static ファイルの読み込み

```html
{% load static %}
<link rel="stylesheet" href="{% static 'css/style.css' %}">
```

### CSRF 対策

POST するフォームには `{% csrf_token %}` が必須。

```html
<form method="post">
  {% csrf_token %}
  ...
</form>
```

---

## Model インスタンスと QuerySet <a id="model-queryset" data-name="Model と QuerySet"></a>

基本はメソッドにより戻り値が決まる。

| メソッド | 戻り値 | 説明 |
| --- | --- | --- |
| get() | インスタンス1つ | ピンポイントに1つ。なければ例外 |
| first() / last() | インスタンス1つ | 先頭/最後の1つ。なければ None |
| create() | インスタンス1つ | データを作って返す |
| get_or_create() | (インスタンス, 作成したか) | あれば取得、なければ作成 |
| all() | クエリセット | 全件まとめて |
| filter() | クエリセット | 条件に合うものをまとめて |
| exclude() | クエリセット | 条件以外をまとめて |
| order_by() | クエリセット | 並び替えて返す |
| count() | 整数 | 件数 |
| exists() | bool | 存在するか |

---

## Model <a id="model" data-name="Model"></a>

Model = データベースのテーブル定義。 1つのモデルクラスが1つのテーブルに、 1つのインスタンスが1レコードに対応する。

### フィールド <a id="field" data-name="フィールド"></a>

#### フィールド共通オプション

| オプション | 説明 |
| --- | --- |
| null=True | DBでnullを許可 |
| blank=True | フォームで空入力、空文字列を許可 |
| default= | デフォルト値 |
| choices= | 選択肢を制限 |
| unique=True | 一意制約 |
| db_index=True | インデックス作成 |
| primary_key=True | 主キー |
| editable=False | 管理画面やフォームで編集不可にする |
| verbose_name="名前" | 管理画面、フォームなどで表示する名称 |
| help_text="説明" | 管理画面などで補助説明を表示 |
| `validators=[...]` | 独自バリデーションを追加 |

<pre><code class="tips">文字列系のフィールド (CharField など) で空欄を許可する場合は、null=True ではなく blank=True を使う。
null=True も付けると「空」の状態が NULL と空文字列の2通りになってしまうため。</code></pre>

---

#### CharField()

短い文字列。

- 必ず max_length が必要
- 名前、タイトルなど

    ```python
    name = models.CharField(max_length=10)
    ```

#### TextField()

長文用。

- 記事本文、コメント、説明文など

    ```python
    body = models.TextField()
    ```

#### IntegerField()

整数。

- 年齢、在庫数、順位など

    ```python
    age = models.IntegerField()
    ```

#### BigIntegerField()

かなり大きな整数。

```python
count = models.BigIntegerField()
```

#### PositiveIntegerField()

0以上の整数。

```python
stock = models.PositiveIntegerField()
```

#### FloatField()

浮動小数。

- 誤差があるためお金など、正確な値には向かない

    ```python
    score = models.FloatField()
    ```

#### DecimalField()

固定小数点。

- `max_digits` : 全体の桁数
- `decimal_places` : そのうち小数部の桁数

```python
price = models.DecimalField(
    max_digits=8,
    decimal_places=2
)
```

であれば、整数部が6桁、小数部が2桁で

```text
999999.99
```

まで保存可能。お金はこちらを使う。

#### BooleanField()

真偽値。

```python
is_active = models.BooleanField(default=True)
```

#### DateField()

日付だけ。

```python
birthday = models.DateField()
```

#### TimeField()

時間だけ。

```python
open_time = models.TimeField()
```

#### DateTimeField()

日時。

```python
created_at = models.DateTimeField()
```

よく使うオプション。

```python
created_at = models.DateTimeField(auto_now_add=True)
updated_at = models.DateTimeField(auto_now=True)
```

- `auto_now_add=True`
  - 作成時のみセット
- `auto_now=True`
  - `save()` するたび更新

<pre><code class="tips">auto_now は update() による一括更新では更新されない。
また、どちらも editable=False となるため、管理画面のフォームには表示されない。</code></pre>

#### BinaryField()

バイト列。

```python
data = models.BinaryField()
```

画像そのものを保存することも可能だが、通常はファイルとして保存する。

#### UUIDField()

UUID。

```python
import uuid

id = models.UUIDField(
    primary_key=True,
    default=uuid.uuid4,
    editable=False
)
```

#### JSONField()

JSON をそのまま保存できる。

```python
info = models.JSONField(default=dict)
```

Python では辞書として扱える。

```python
user.info["name"]
```

#### FileField()

ファイル。

```python
file = models.FileField(upload_to="files/")
```

この場合アップロード先が <span class="code-like">MEDIA_ROOT/files/</span> となる。<br>
DB には保存したファイルのパス (文字列) が入る。

#### ImageField()

画像専用。 Pillow ライブラリが必要。

```bash
pip install pillow
```

```python
image = models.ImageField(upload_to="images/")
```

#### EmailField()

メールアドレスの形式を検証する。

```python
email = models.EmailField()
```

#### URLField()

URL形式を検証する。

```python
url = models.URLField()
```

#### SlugField()

URL用文字列 (英数字、ハイフン、アンダースコア)。

```python
slug = models.SlugField()
```

---

#### choices の使い方

選択肢を `TextChoices` で定義すると管理しやすい。

```python
class Article(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "下書き"
        PUBLISHED = "published", "公開"

    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.DRAFT,
    )
```

```python
article.status == Article.Status.PUBLISHED
article.get_status_display()  # "公開"
```

### Meta クラス <a id="meta" data-name="Meta クラス"></a>

モデル全体の設定をまとめて書く。

```python
class Article(models.Model):
    title = models.CharField(max_length=100)

    class Meta:
        ordering = ["-id"]
        verbose_name = "記事"
        verbose_name_plural = "記事"
```

| --- | --- |
| ordering | デフォルトの並び順 |
| verbose_name / verbose_name_plural | 管理画面などでの表示名 |
| db_table | テーブル名を指定する |
| unique_together / constraints | 複数フィールドにまたがる一意制約など |
| indexes | インデックスの定義 |

---

### リレーション <a id="relationship" data-name="リレーション"></a>

#### ForeignKey()

多対一。

```python
class Book(models.Model):
    author = models.ForeignKey(
        Author,
        on_delete=models.CASCADE
    )
```

`on_delete` は参照先が削除された時の動作を指定する (必須)。

| --- | --- |
| CASCADE | 参照しているレコードも一緒に削除する |
| PROTECT | 参照されている間は削除できない (例外を出す) |
| SET_NULL | NULL にする (null=True が必要) |
| SET_DEFAULT | デフォルト値にする |
| DO_NOTHING | 何もしない (DB の制約によってはエラーになる) |

`related_name` を指定すると、逆参照の名前を変えられる。

```python
author = models.ForeignKey(
    Author,
    on_delete=models.CASCADE,
    related_name="books"
)
```

```python
author.books.all()
```

#### OneToOneField()

一対一。

```python
profile = models.OneToOneField(
    User,
    on_delete=models.CASCADE
)
```

#### ManyToManyField()

多対多。

```python
tags = models.ManyToManyField(Tag)
```

中間テーブルが自動生成される。

```python
article.tags.add(tag)       # 追加
article.tags.remove(tag)    # 削除
article.tags.set([tag1, tag2])  # 置き換え
article.tags.all()          # 取得
```

---

### クエリセット <a id="queryset" data-name="クエリセット"></a>

モデルオブジェクトが1件のデータなら、クエリセットは検索条件、または検索結果の集合。<br>
クエリセットで条件を組み立てて、必要に応じてモデルオブジェクトを取り出す。

<pre><code class="tips">QuerySet は SQL を組み立てるためのオブジェクト。</code></pre>

以下のようなモデルがあったとする。

```python
class User(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
```

<pre><code class="tips">以下の SQL は対応するイメージを示すもの。実際のテーブル名は「アプリ名_モデル名」(例: myapp_user) になり、発行される SQL も完全に同じではない。</code></pre>

#### 全件取得

全てのレコードを取得する。

```sql
SELECT * FROM user;
```

```python
users = User.objects.all()
```

#### 条件検索

条件を追加する。

```sql
SELECT *
FROM user
WHERE age = 20;
```

```python
users = User.objects.filter(age=20)
```

複数条件。

`filter()` にカンマ (`,`) 区切りで複数の条件を渡すと、デフォルトで `AND` 条件になる。

```sql
SELECT *
FROM user
WHERE age = 20
AND name = '田中';
```

```python
users = User.objects.filter(
    age=20,
    name="田中"
)
```

`filter()` はメソッドチェーンでつなげてもよい。

```python
users = User.objects.filter(age=20).filter(name="田中")
```

#### 比較演算子

| SQL | Django |
| --- | --- |
| `=` | age=20 |
| `>` | age__gt=20 |
| `>=` | age__gte=20 |
| `<` | age__lt=20 |
| `<=` | age__lte=20 |
| `!=` | exclude(age=20) |
| `IN` | age__in=[20, 30] |
| `BETWEEN` | age__range=(20, 30) |
| `IS NULL` | age__isnull=True |

#### LIKE

- 部分一致 (大文字小文字を区別する)

    ```sql
    WHERE name LIKE '%smith%'
    ```

    ```python
    User.objects.filter(name__contains="smith")
    ```

- 部分一致 (大文字小文字を区別しない)

    ```sql
    WHERE LOWER(name) LIKE '%smith%'
    ```

    ```python
    User.objects.filter(name__icontains="smith")
    ```

- 前方一致

    ```sql
    WHERE name LIKE 'John%'
    ```

    ```python
    User.objects.filter(name__startswith="John")
    ```

- 後方一致

    ```sql
    WHERE name LIKE '%son'
    ```

    ```python
    User.objects.filter(name__endswith="son")
    ```

<pre><code class="tips">SQLite では LIKE が大文字小文字を区別しないため、contains でも icontains と同じ動きになる。</code></pre>

#### NOT

逆条件 (NOT)。

```sql
SELECT *
FROM user
WHERE age != 20;
```

```python
users = User.objects.exclude(age=20)
```

#### Qオブジェクト

`Q` オブジェクトを使用することにより、 `OR` 条件 (`|`) や複雑な条件を組み合わせたクエリを作成できる。

```python
from django.db.models import Q

# OR 条件
users = User.objects.filter(Q(age=20) | Q(name="田中"))

# AND 条件
users = User.objects.filter(Q(age=20) & Q(name="田中"))

# NOT 条件
users = User.objects.filter(~Q(age=20))
```

#### 1件取得

条件でオブジェクトを返す。<br>
なければ `DoesNotExist`<br>
複数あれば `MultipleObjectsReturned` となる。

```python
user = User.objects.get(pk=1)
```

```python
try:
    user = User.objects.get(pk=999)
except User.DoesNotExist:
    user = None
```

<pre><code class="tips">エラーを出さずに None を返させたい場合は
User.objects.filter(pk=999).first()
とすると、なければ None となる。
(get() が返すのはインスタンスなので、get().first() とは書けない)</code></pre>

#### LIMIT

```sql
SELECT *
FROM user
LIMIT 5;
```

```python
users = User.objects.all()[:5]
```

途中を取得。

```sql
LIMIT 5 OFFSET 10;
```

```python
users = User.objects.all()[10:15]
```

Python のスライス構文がそのまま使える。ただし負の値 (`[-1]` など) は使えない。

#### ORDER BY

並び替え。

```sql
SELECT *
FROM user
ORDER BY age;
```

```python
User.objects.order_by("age")
```

逆順。

```sql
ORDER BY age DESC;
```

```python
User.objects.order_by("-age")
```

複数のフィールドで並び替え。

```python
User.objects.order_by("-age", "name")
```

#### COUNT

件数。

```sql
SELECT COUNT(*)
FROM user;
```

```python
User.objects.count()
```

条件付き。

```python
User.objects.filter(age=20).count()
```

#### EXISTS

存在するかどうかを bool で返す。

```sql
SELECT EXISTS(
    SELECT *
    FROM user
    WHERE age=20
);
```

```python
User.objects.filter(age=20).exists()
```

データを全件取得せずに済むため、存在チェックだけなら `count()` や `if queryset:` よりも高速。

#### 最初の1件

最初の1件を返す。なければ None。

```python
user = User.objects.first()
```

並び順が指定されていなければ、主キーの昇順で最初の1件となる。

#### 最後の1件

最後の1件を返す。なければ None。

```python
user = User.objects.last()
```

#### 特定の列だけ

```sql
SELECT name
FROM user;
```

```python
User.objects.values("name")
```

辞書のクエリセットが返る。

```python
# <QuerySet [{'name': 'Taro'}, {'name': 'Jiro'}]>
```

複数列。

```python
User.objects.values(
    "id",
    "name"
)
```

#### values_list()

タプルで取得。

```python
User.objects.values_list("id", "name")
```

```text
[
    (1, "Taro"),
    (2, "Jiro")
]
```

1列だけなら `flat=True` を指定すると、タプルではなく値そのものが並ぶ。

```python
User.objects.values_list(
    "name",
    flat=True
)
```

```text
[
    "Taro",
    "Jiro"
]
```

#### DISTINCT

重複を除外。

```sql
SELECT DISTINCT age
FROM user;
```

```python
User.objects.values("age").distinct()
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

#### 集計 (aggregate / annotate)

全体の集計は `aggregate()`。辞書が返る。

```python
from django.db.models import Avg, Count, Max, Sum

User.objects.aggregate(Avg("age"))
# {'age__avg': 25.3}
```

レコードごとに集計値を付けるのは `annotate()`。

```python
from django.db.models import Count

authors = Author.objects.annotate(book_count=Count("books"))

for author in authors:
    print(author.name, author.book_count)
```

グループごとの集計は `values()` と組み合わせる。

```sql
SELECT age, COUNT(*)
FROM user
GROUP BY age;
```

```python
User.objects.values("age").annotate(count=Count("id"))
```

#### F式

フィールドの値を、DB 側で計算して使う。

```python
from django.db.models import F

# 在庫を1減らす (Python で値を取り出さずに DB 上で計算する)
Product.objects.filter(pk=1).update(stock=F("stock") - 1)
```

#### リレーションをまたぐ検索

`__` (アンダースコア2つ) で関連先のフィールドを指定できる。

```python
# 著者の名前が「夏目」の本
Book.objects.filter(author__name="夏目")
```

#### select_related() / prefetch_related()

関連オブジェクトを何度もアクセスすると、レコードごとにクエリが発行されてしまう (N+1 問題)。

```python
# 悪い例 : 本の数だけ author を取得するクエリが走る
for book in Book.objects.all():
    print(book.author.name)
```

事前にまとめて取得しておくことで防げる。

```python
# ForeignKey / OneToOne は JOIN で一緒に取得
Book.objects.select_related("author")

# ManyToMany / 逆参照は別クエリでまとめて取得
Article.objects.prefetch_related("tags")
```

#### update()

一括更新。

```python
User.objects.filter(age=20).update(age=21)
```

<pre><code class="tips">update() は save() を呼ばないため、auto_now のフィールドは更新されず、シグナルも発火しない。</code></pre>

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

<pre><code class="tips">bulk_create() も save() を呼ばない。まとめて UPDATE する場合は bulk_update() を使う。</code></pre>

#### get_or_create() / update_or_create()

あれば取得、なければ作成する。

```python
user, created = User.objects.get_or_create(
    name="Taro",
    defaults={"age": 20},
)
```

- `name` で検索し、なければ `defaults` の値も含めて作成する
- `created` は新規作成された場合に True

あれば更新、なければ作成する場合は `update_or_create()`。

```python
user, created = User.objects.update_or_create(
    name="Taro",
    defaults={"age": 21},
)
```

<pre><code class="tips">QuerySet は遅延評価であり、値が必要になった時にまとめて実行される。
一度評価された結果はキャッシュされ、同じ QuerySet を再利用しても再度クエリは発行されない。</code></pre>

---

### モデルオブジェクト <a id="model-object" data-name="モデルオブジェクト"></a>

Django のモデルオブジェクトは、データベースの1レコードを Python オブジェクトとして扱うためのもの。

#### update

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

```python
user.name = "Jiro"
user.age = 25
```

値を書き換えられる。ただしこの時点ではデータベースに反映されていない。

```python
user.save()
```

これで UPDATE される。

<pre><code class="tips">save() はバリデーションを自動では行わない。
モデルに対してバリデーションを行う場合は <span class="code-like">full_clean()</span> を呼ぶ (DRF であればシリアライザを使う。 ModelForm は内部で自動的に実行する)。full_clean は以下を実行する。
<ul><li>clean_fields() : 各フィールドの基本チェック。</li>
    <li>clean() : 自分でロジックを書いたチェック。</li>
    <li>validate_unique() : 一意性のチェック (unique=True や unique_together の違反がないか)</li>
    <li>validate_constraints() : Meta.constraints のチェック (Django 4.1 以降)</li></ul></code></pre>

<pre><code class="example"># clean()の実装例

from django.core.exceptions import ValidationError
from django.db import models

class SaleEvent(models.Model):
    title = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()

    # 独自ルールを clean() に書き込む
    def clean(self):
        # 親クラスのcleanを呼んでおく（習慣として）
        super().clean()

        # 開始日と終了日の矛盾をチェック
        if self.start_date and self.end_date:
            if self.end_date < self.start_date:
                raise ValidationError({
                    "end_date": "終了日は開始日よりも後の日付にしてください。"
                })</code></pre>

保存のたびに一部のフィールドだけを更新したい場合は `update_fields` を指定する。

```python
user.save(update_fields=["age"])
```

#### insert

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

#### delete

```python
user.delete()
```

これで DELETE される。

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

<pre><code class="tips">editable=False のフィールド (auto_now_add など) は含まれない。</code></pre>

#### オブジェクトをコピー

```python
user.pk = None
user._state.adding = True
user.save()
```

pk を None にして保存することで、新しいレコードとして INSERT される。<br>
unique 制約のあるフィールドがある場合は、先に値を変えておかないとエラーになる。

#### オブジェクト同士を比較

```python
u1 = User.objects.get(pk=1)
u2 = User.objects.get(pk=1)

print(u1 == u2)  # True
```

別々に取得したインスタンスでも、同じモデルで主キーが同じなら等しいとみなされる。

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

<pre><code class="tips">逆参照の名前は「モデル名(小文字)_set」が標準。 related_name を指定した場合はその名前になる。</code></pre>

#### 値を最新にする

値を最新の状態 (データベースの値) に書き換える。

```python
user.refresh_from_db()
```

---

## 管理画面 <a id="admin" data-name="管理画面"></a>

Django には、モデルの CRUD ができる管理画面が標準で付いている。<br>
`createsuperuser` で作成したユーザーでログインする。

### モデルの登録

admin.py にモデルを登録すると、管理画面に表示される。

```python
# myapp/admin.py

from django.contrib import admin
from .models import Article

admin.site.register(Article)
```

### 表示のカスタマイズ

`ModelAdmin` を継承して、一覧画面などを設定できる。

```python
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "created_at")
    search_fields = ("title",)
    list_filter = ("created_at",)
    ordering = ("-created_at",)
```

| --- | --- |
| list_display | 一覧画面に表示するフィールド |
| search_fields | 検索ボックスの対象フィールド |
| list_filter | 右側の絞り込みフィルター |
| ordering | 一覧の並び順 |
| readonly_fields | 編集不可にするフィールド |

---

## マイグレーション <a id="migration" data-name="マイグレーション"></a>

モデルの変更をデータベースに反映する仕組み。

### 基本の流れ

1. models.py を編集する
2. `makemigrations` でマイグレーションファイルを作る
3. `migrate` で DB に反映する

```bash
python manage.py makemigrations
python manage.py migrate
```

### 状態の確認

```bash
# 適用済み / 未適用の一覧
python manage.py showmigrations

# マイグレーションが発行する SQL の確認
python manage.py sqlmigrate myapp 0001
```

### 元に戻す

アプリ名と戻したいマイグレーションの番号を指定して `migrate` する。

```bash
# 0001 の状態まで戻す
python manage.py migrate myapp 0001

# このアプリのマイグレーションを全て取り消す
python manage.py migrate myapp zero
```

<pre><code class="tips">マイグレーションファイルは Git などで管理する。適用済みのファイルは書き換えず、変更が必要なら新しいマイグレーションを作る。</code></pre>

---

## Django shell <a id="django-shell" data-name="Django shell"></a>

Django shell とは Django を起動した状態の Python で、直接 ORM が使える。

### 起動

このように起動して、

```bash
python manage.py shell
```

Python コード から ORM がそのまま使える。

```python
from myapp.models import User

user = User(...)
user.save()
```

終了は `exit()` または Ctrl + D。

<pre><code class="tips">django-extensions を入れると shell_plus が使え、モデルが自動で import された状態で起動できる。</code></pre>

### 基本は create

```python
from myapp.models import User

User.objects.create(
    name="test-user",
    email="test@example.com",
)
```

### バリデーションを通す

バリデーションをきちんと通したい場合は、

```python
user = User(
    name="test-user",
    email="invalid",
)

user.full_clean()
user.save()
```

<pre><code class="tips">email="invalid" はメールアドレスの形式として不正なので、full_clean() の時点で ValidationError が発生し、save() には進まない。</code></pre>

### ForeignKeyも使える

```python
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.IntegerField()
```

であれば、

```python
user = User.objects.get(id=1)

Order.objects.create(
    user=user,
    amount=1000,
)
```

ID だけ指定したかったら、

```python
Order.objects.create(
    user_id=1,
    amount=1000,
)
```

でもOK。

### 検証データ投入用スクリプト

```python
User.objects.create(...)
User.objects.create(...)
Order.objects.create(...)
```

のように毎回打つなら、例えば <code class="code-like">seed_test_data.py</code> というスクリプトを作って、

```text
myapp/
├── models.py
└── management/
    ├── __init__.py
    └── commands/
        ├── __init__.py
        └── seed_test_data.py
```

このようなディレクトリ構造にしておけば、

```bash
python manage.py seed_test_data
```

で Django環境 で実行できる。

スクリプトは `BaseCommand` を継承した `Command` クラスとして書き、処理を `handle()` に記述する。

```python
# myapp/management/commands/seed_test_data.py

from django.core.management.base import BaseCommand
from myapp.models import User

class Command(BaseCommand):
    help = "検証用のデータを投入する"

    def handle(self, *args, **options):
        User.objects.create(name="test-user", age=20, email="test@example.com")
        self.stdout.write(self.style.SUCCESS("データを投入しました"))
```

<pre><code class="tips">データ投入には、JSON などのファイルから読み込む fixtures (dumpdata / loaddata コマンド) も使える。</code></pre>

---

## manage.pyのコマンド <a id="command-manage" data-name="manage.pyのコマンド"></a>

### startproject

プロジェクトを作成する。

```bash
django-admin startproject djangoproject .
```

<pre><code class="tips">startproject は manage.py がまだ存在しない状態で使うため、manage.py ではなく django-admin のコマンドになる。</code></pre>

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

ポートを指定する場合。

```bash
python manage.py runserver 8080
```

### makemigrations

マイグレーションファイル (モデルの変更内容を記述したモジュール) を生成する。

```bash
python manage.py makemigrations
```

### migrate

マイグレーションファイルの内容を DB に反映する。

```bash
python manage.py migrate
```

### createsuperuser

プロジェクトの管理者 (スーパーユーザー) を作成する。

```bash
python manage.py createsuperuser
```

コマンドを実行すると、ユーザー名、メールアドレス、パスワードの入力が求められ、すべてを入力するとスーパーユーザーが作成される。

### shell

Django を起動した状態の Python 対話環境を開く。

```bash
python manage.py shell
```

### test

テストを実行する。

```bash
python manage.py test
```

### collectstatic

Static ファイルを `STATIC_ROOT` に集める (本番環境用)。

```bash
python manage.py collectstatic
```

### check

設定やモデルに問題がないか検査する。

```bash
python manage.py check
```

### changepassword

ユーザーのパスワードを変更する。

```bash
python manage.py changepassword ユーザー名
```

---
