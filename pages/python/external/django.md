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

この時点で起動が可能なので確認する場合。

```bash
# プロジェクト内へ移動
cd djangoproject

# サーバーを起動
python manage.py runserver
```

### 設定

### スーパーユーザーの作成

```bash
python manage.py createsuperuser
```

ユーザー名、メールアドレス、パスワードの入力が求められる。

### カスタムユーザーモデルへの切り替え

プロジェクトを作成した時に設定しておきたい (後から変更が大変になる) 。
Django では標準で User モデルが用意されているが、将来的にログインIDをユーザー名ではなくメールアドレスにしたい、プロフィール画像や電話番号の項目を追加したいとなった時、標準のままだとマイグレーションで衝突が起きる。

1. ユーザー管理用のアプリを作る (accounts など) 。
2. そのアプリの models.py に、標準の User を継承した空のクラスを作る。
    ```python
    from django.contrib.auth.models import AbstractUser

    class CustomUser(AbstractUser):
    pass
    ```
3. settings.py に以下を追記する (migrate する前に) 。
    ```python
    AUTH_USER_MODEL = 'accounts.CustomUser'
    ```

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

---

## Model <a id="model" data-name="Model"></a>

Model = データベース。

### フィールド <a id="filed" data-name="フィールド"></a>

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
| verbose_name="名前" | 管理画面、フォームなどで表示する名称 |
| help_text="説明" | 管理画面などで補助説明を表示 |
| `validators=[...]` | 独自バリデーションを追加 |

---

#### CharField()

短い文字列。

- 必ず max_length が必要
- 名前、タイトル、メールアドレスなど

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

0以上の自然数。

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

```python
price = models.DecimalField(
    max_digits=8,
    decimal_places=2
)
```

であれば

```
123456.78
```

まで保存可能。お金はこちらを使う。

#### BooleanField()

真偽値。

```python
is_active = models.BooleanField(default=True)
```

#### DateField

日付けだけ。

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
  - 保存するたび更新

#### BinaryField()

バイト列。

```python
data = models.BinaryField()
```

画像そのものを保存することも可能だが、通常はファイルとして保存する。

#### UUID()

UUID。

```python
import uuid

id = models.UUIDField(
    primary_key=True,
    default=uuid.uuid4,
    editable=False
)
```

#### JSON()

JSON をそのまま保存できる。

```python
info = models.JSONField()
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

この場合アップロード先が <span class="code-like">MEDIA_ROOT/files/</span> となる。

#### ImageField()

画像専用。 Pillow ライブラリが必要。

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

URL用文字列。

```python
slug = models.SlugField()
```

---

### リレーション <a id="eelationship" data-name="リレーション"></a>

#### ForeignKey()

多対一。

```python
class Book(models.Model):
    author = models.ForeignKey(
        Author,
        on_delete=models.CASCADE
    )
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

多対多

```python
tags = models.ManyToManyField(Tag)
```

中間テーブルが自動生成される。

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

#### 比較演算子

| SQL | Django |
| --- | --- |
| `=` | age=20 |
| `>` | age__gt=20 |
| `>=` | age__gte=20 |
| `<` | age__lt=20 |
| `<=` | age__lte=20 |
| `!=` | exclude(age=20) |

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

#### 1件取得

条件でオブジェクトを返す。<br>
なければ `DoesNotExist`<br>
複数あれば `MultipleObjectsReturned` となる。

```python
user = User.objects.get(pk=1)
```

<pre><code class="tips">エラーを出さずに None を返させたい場合は
User.objects.get(pk=999).first()
とするとエラーを発生させずに、なければ None となる。</code></pre>

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

Python のスライス構文がそのまま使える。

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

#### COUNT

件数。

```sql
SELECT COUNT(*)
FROM user;
```

```python
User.objects.count()
```

条件付き

```python
User.objects.filter(age=20).count()
```

#### EXISTS

存在するかどうかを bool で返す。

```SQL
SELECT EXISTS(
    SELECT *
    FROM user
    WHERE age=20
);
```

```python
User.objects.filter(age=20).exists()
```

非常に高速。


#### 最初の1件

最初の1件を返す。なければ None。

```python
user = User.objects.first()
```


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

クエリセットが返る。

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

```
[
    (1, "Taro"),
    (2, "Jiro")
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

<pre><code class="caution">Djangoでは、 pk (または id) があるかどうかで save() した時に新規、か更新かを判別しているため、単なる unique キーで更新する場合は以下のように <span class="code-like">update_or_create()</span> を使う。

# データのイメージ
unique_value = update_data.pop('unique_key') # 検索条件にするため辞書から抜く

# これだけで「検索 ➔ あれば更新」を1行で行う
instance, created = MyModel.objects.update_or_create(
    unique_key=unique_value,    # どのレコードを探すか（一意のキー）
    defaults=update_data        # 更新したい中身（辞書）
)</code></pre>



<pre><code class="tips">モデルに対してバリデーションを行う場合は <span class="code-like">full_clean()</span> を行う。full_clean は以下の3つを実行する (DRF であればシリアライザを使う)。
<ul><li>clean_fields() : 各フィールドの基本チェック。</li>
    <li>clean() : 自分でロジックを書いたチェック。</li>
    <li>validate_unique() : 一意性のチェック (unique=True や unique_together の違反がないか)</li></ul></code></pre>

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
                    'end_date': '終了日は開始日よりも後の日付にしてください。'
                })</code></pre>

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
