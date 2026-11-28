---
title: DRF
layout: default
---

# DRF <a id="top" data-name="TOP"></a>

DRF は Django REST Framework の略で、Django で API サーバーを簡単に構築できるフレームワーク。<br>
model は通常の Django と同じで、特に Serializer が重要となる。

リクエストの JSON を受け取って検証し、データベースへ保存して、結果を JSON で返す。この一連の処理を、Serializer、View、Router などの部品の組み合わせで実装する。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| Serializer | Python オブジェクトや Model と JSON の相互変換と、入力の検証を担当する |
| 豊富なビュー | `APIView` から `ModelViewSet` まで、自動化の度合いが異なるクラスが用意されている |
| Router | ViewSet から、一覧・詳細・作成・更新・削除の URL をまとめて生成する |
| 認証と権限 | セッション、トークンなどの認証方式と、権限のクラスが組み込まれている |
| ページネーションとフィルタ | 一覧 API のページ分割、検索、並び替えを、設定とクラスの指定だけで追加できる |
| ブラウザブル API | ブラウザから API を直接操作できる画面 (Browsable API) が、標準で付いている |

### リクエストの流れ

```text
クライアント ──▶ URL (urls.py / Router)
             ──▶ View (認証 → 権限 → 流量制限)
             ──▶ Serializer (入力の検証・変換)
             ──▶ Model (データベース)
             ──▶ Serializer (出力の変換)
             ──▶ Response (JSON)
```

### 構成要素

| 要素 | 役割 | 参照 |
| --- | --- | --- |
| Serializer | データの定義、変換、検証 | <a href="#serializer">Serializer</a> |
| View | リクエストを受け取り、`Response` を返す | <a href="#class-baes-view">クラスベースビュー</a>、<a href="#function-based-view">関数ベースビュー</a> |
| ViewSet / Router | 複数の操作を 1 つのクラスにまとめ、URL を自動生成する | <a href="#viewset">ViewSet と Router</a> |
| Request / Response | 解析済みのリクエストと、形式を自動で選ぶレスポンス | <a href="#request-response">リクエストとレスポンス</a> |
| Authentication / Permission | 誰か、何をしてよいかの判定 | <a href="#auth-permission">認証と権限</a> |
| Pagination / Filter | 一覧の分割、絞り込み、並び替え | <a href="#pagination-filter">ページネーションとフィルタ</a> |

<pre><code class="caution">このドキュメントは、DRF 3.17 系 (2026年) を前提にしている。
3.17.0 で Python 3.9 のサポートと、非推奨だった coreapi のサポートが削除された。
coreapi を使う古い記事のスキーマ生成のコードは、そのままでは動かないことがある。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

```bash
pip install djangorestframework
```

### 動作環境

| 項目 | 内容 |
| --- | --- |
| Python | 3.10 以上 |
| Django | 4.2、5.0、5.1、5.2、6.0 (DRF 3.17.1 の公開情報による) |

<pre><code class="tips">DRF は、各 Python と Django の系列のうち、最新のパッチリリースだけを公式にサポートする。
3.17.2 には、request.data の解析サイズの制限や、AdminRenderer の情報露出に関する修正が含まれるとみられる (コミットの題名による。詳細は公式のリリースノートで確認する)。
パッチは、最新にそろえておく。</code></pre>

### settings.py

```python
# settings.py
INSTALLED_APPS = [
    # ... Django の標準のアプリ
    "rest_framework",  # DRF を有効にする
]
```

DRF の設定は、`REST_FRAMEWORK` という辞書にまとめる。

```python
# settings.py
REST_FRAMEWORK = {
    # 既定では誰でもアクセスできるため、認証済みのみに変更する
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    # 一覧をページ分割する
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}
```

| キー | 内容 |
| --- | --- |
| `DEFAULT_AUTHENTICATION_CLASSES` | 認証方式の既定 (既定は `SessionAuthentication` と `BasicAuthentication`) |
| `DEFAULT_PERMISSION_CLASSES` | 権限の既定 (既定は `AllowAny`) |
| `DEFAULT_PAGINATION_CLASS` | ページネーションの既定 (既定は未設定) |
| `PAGE_SIZE` | 1 ページの件数。`DEFAULT_PAGINATION_CLASS` と一緒に設定する |
| `DEFAULT_FILTER_BACKENDS` | フィルタの既定 |
| `DEFAULT_THROTTLE_CLASSES` / `DEFAULT_THROTTLE_RATES` | 流量制限の既定と、その上限 |
| `DEFAULT_RENDERER_CLASSES` | レスポンスの出力形式 (既定は JSON と Browsable API) |
| `EXCEPTION_HANDLER` | 例外をレスポンスに変換する関数 |

<pre><code class="caution">PAGE_SIZE だけを設定しても、ページネーションは有効にならない。
DEFAULT_PAGINATION_CLASS も、一緒に設定する。</code></pre>

ブラウザブル API でログインできるようにするには、`urls.py` に次を足す。

```python
# urls.py
from django.urls import include, path

urlpatterns = [
    path("api-auth/", include("rest_framework.urls")),
]
```

Django のプロジェクトの作り方は、Django のドキュメントを参照。

---

## Serializer <a id="serializer" data-name="serializer"></a>

シリアライザーは Python オブジェクトや Model などと JSON を相互変換し、そのデータが正しいか検証するクラスであり、モデルのラッパーであるとも言える。<br>
つまり

- Python → JSON (レスポンス)
- JSON → Python (リクエスト)
- バリデーション

の 3 つを担当する。

Serializer は単なる JSON への変換器ではなく、データの定義書のようなもので、

```python
# モデル
class Book(models.Model):
    title = models.CharField(max_length=100)
    price = models.IntegerField()
```

```python
# シリアライザー
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["title", "price"]
```

これだけで、

- この API は title と price を扱う
- title は文字列
- price は整数
- 必須項目かどうか
- 最大文字数

などが決まる。

<pre><code class="tips">serializer.data が返すのは、dict や list などの Python のデータである。
JSON の文字列への変換は、View の Response が、Renderer を通して行う。</code></pre>

### Serializer と ModelSerializer

| | `Serializer` | `ModelSerializer` |
| --- | --- | --- |
| フィールド | すべて自分で定義する | モデルから自動で生成する |
| `create()` / `update()` | 自分で実装する | 既定の実装がある |
| 向く場面 | モデルに紐づかない入出力 (問い合わせフォームなど) | モデルの CRUD |

モデルに紐づかないデータは、`Serializer` を直接継承する。

```python
from rest_framework import serializers


class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    message = serializers.CharField()
```

### フィールドの定義 <a id="serializer-fields"></a>

`ModelSerializer` の `Meta` では、次の項目を指定できる。

| 項目 | 内容 |
| --- | --- |
| `model` | 対象のモデル |
| `fields` | 扱うフィールドのリスト。すべてなら `"__all__"` |
| `exclude` | 除外するフィールドのリスト (`fields` とは、どちらか一方だけ指定する) |
| `read_only_fields` | 出力だけに使い、入力では無視するフィールド |
| `extra_kwargs` | 自動生成されたフィールドの、オプションを上書きする辞書 |
| `depth` | 関連するモデルを、何階層まで展開するか |

フィールドには、次のオプションを指定できる。

| オプション | 内容 |
| --- | --- |
| `required` | 入力で必須かどうか |
| `read_only` | 出力だけに使う (入力では無視される) |
| `write_only` | 入力だけに使う (出力には含まれない)。パスワードなどに使う |
| `default` | 入力で省略されたときの値 |
| `allow_null` / `allow_blank` | `null` や空文字を許可する |
| `max_length` / `min_value` など | 長さや値の範囲の制限 |
| `validators` | 追加のバリデータのリスト |
| `source` | 対応するモデルの属性名 (名前が違うときに使う) |

```python
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "price", "created_at"]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "price": {"min_value": 0},
        }
```

<pre><code class="tips">fields には、公開するフィールドを明示する。
"__all__" や exclude は、モデルにフィールドを足したときに、意図せず API に公開されてしまう。</code></pre>

### SerializerMethodField

モデルにない値を、メソッドで計算して出力する。読み取り専用のフィールドになる。

```python
class BookSerializer(serializers.ModelSerializer):
    price_with_tax = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ["title", "price", "price_with_tax"]

    def get_price_with_tax(self, obj):
        # 税込価格を計算する (メソッド名は get_ + フィールド名)
        return int(obj.price * 1.1)
```

### 関連するモデルの扱い <a id="serializer-relations"></a>

`ForeignKey` などの関連は、既定では、関連先の主キーが出力される。表現方法は、フィールドの種類で変えられる。

| 方法 | 出力 | 補足 |
| --- | --- | --- |
| `PrimaryKeyRelatedField` | 主キー | `ModelSerializer` の既定 |
| `StringRelatedField` | モデルの `__str__()` の値 | 読み取り専用 |
| `SlugRelatedField` | 指定した属性の値 (`slug_field`) | 一意な属性を指定する |
| `HyperlinkedRelatedField` | 関連先の URL | URL の名前の設定が必要 |
| ネストしたシリアライザー | 関連先を、オブジェクトとして展開する | 下のコード例を参照 |

```python
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ["id", "name"]


class BookSerializer(serializers.ModelSerializer):
    # Book は author (ForeignKey) を持つ
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Book
        fields = ["id", "title", "author"]
```

<pre><code class="caution">ネストしたシリアライザーは、既定では、書き込みに対応していない。
書き込みも行う場合は、create() と update() を自分で実装する必要がある。</code></pre>

### 独自のバリデーション

| メソッド名 / 命名規則 | 自動で呼ばれるタイミング | 役割 |
| --- | --- | --- |
| `to_internal_value(data)` | `is_valid()` の最初 | 受信データの型変換・加工 |
| `validate(attrs)` | `to_internal_value` の直後 | 複数項目を組み合わせた全体の検証 |
| `validate_<フィールド名>(value)` | `validate()` の前 | 特定のフィールド専用の検証 (例: `validate_product_code_key`) |
| `get_<フィールド名>(obj)` | `serializer.data` を参照した時 | `SerializerMethodField` の値を取得する |
| `to_representation(instance)` | `serializer.data` を参照した時 | 返却用データ (JSON) への変換 |

検証は、次の順序で行われる。

1. 各フィールドの型の変換と、フィールドの `validators`
2. `validate_<フィールド名>()`
3. `Meta.validators` (`UniqueTogetherValidator` など、複数項目にまたがるもの)
4. `validate()`

```python
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["title", "price"]

    def validate_price(self, value):
        # 特定のフィールドの検証。検証した値を返す
        if value < 0:
            raise serializers.ValidationError("価格は 0 以上にする。")
        return value

    def validate(self, attrs):
        # 複数項目の検証。attrs を丸ごと返す
        if attrs.get("title") == "無料" and attrs.get("price", 0) > 0:
            raise serializers.ValidationError("無料の本に、価格は付けられない。")
        return attrs
```

### ライフサイクル <a id="lifecycle"></a>

Serializer にはライフサイクルがある。

| 手順 | 内容 |
| --- | --- |
| 1. インスタンス生成 | `data=` (リクエスト) か、モデルのオブジェクト (レスポンス) を渡して作る |
| 2. `is_valid()` | バリデーションを実行する |
| 3. `validated_data` / `errors` | 成功なら検証済みのデータ、失敗ならエラーを参照する |
| 4. `save()` | `create()` か `update()` を呼び、保存する |
| 5. `data` | 返却用のデータを取り出す |

### インスタンス生成

```python
# レスポンスなら
serializer = BookSerializer(book)

# リクエストなら
serializer = BookSerializer(data=request.data)
```

| 渡し方 | 用途 |
| --- | --- |
| `BookSerializer(book)` | レスポンス (単体の出力) |
| `BookSerializer(queryset, many=True)` | レスポンス (複数の出力) |
| `BookSerializer(data=request.data)` | リクエスト (新規作成の検証) |
| `BookSerializer(instance=book, data=request.data)` | 更新 |
| `BookSerializer(instance=book, data=request.data, partial=True)` | 部分更新 |

### 入力

<pre><code class="caution">入力をバリデーションする際は <span class="code-like">data=</span> が必須。</code></pre>

<pre><code class="tips">デフォルトで単数なので、複数渡す場合は <span class="code-like">many=True</span> を指定する。</code></pre>

この時点で使えるのは

```python
# バリデーションされていないデータ
serializer.initial_data
```

#### is_valid()

```python
serializer.is_valid()
```

<span class="code-like">is_valid()</span> でバリデーションが実行される。

また、 <span class="code-like">validate()</span> や <span class="code-like">validate_&lt;field&gt;()</span> が定義されていれば自動で実行される。

<pre><code class="tips">検証用のメソッドは、検証したデータを返す必要がある。
特定のフィールドを検証するメソッドは、そのフィールドの値 (加工してもいい) を返し、
オブジェクト全体を検証する <span class="code-like">validate()</span> は、値を丸ごと返す。
また失敗した場合は <span class="code-like">ValidationError</span> を <span class="code-like">raise</span> する必要がある。</code></pre>

バリデーションが成功すると

```python
# バリデーションされたデータ
serializer.validated_data
```

へアクセスできるようになる。失敗した場合は、`serializer.errors` にエラーが入る。

```python
serializer = BookSerializer(data={"title": "DRF 入門", "price": "abc"})

if not serializer.is_valid():
    print(serializer.errors)
```

```text
{'price': ['A valid integer number is required.']}
```

`is_valid(raise_exception=True)` とすると、失敗時に `ValidationError` が `raise` される。View の中では、DRF が自動で `400 Bad Request` のレスポンスに変換するため、`if` による分岐が不要になる。

<pre><code class="caution"><span class="code-like">is_valid()</span> は、unique なフィールドに対して重複のチェックを行う。
更新時に <span class="code-like">instance=</span> を渡していれば、更新対象の自分自身は、重複として扱われない。
<span class="code-like">instance=</span> を渡さずに <span class="code-like">data=</span> だけで検証すると、更新対象も重複と判定されて、エラーになる。
ネストしたシリアライザーでは、instance を渡せないため、同じ問題が起きる。</code></pre>

重複のチェックを走らせたくない場合は、シリアライザで以下のように定義する。

```python
class MyModelSerializer(serializers.ModelSerializer):
    # 勝手に付与された UniqueValidator を空にする
    email = serializers.EmailField(validators=[])

    class Meta:
        model = MyModel  # モデルは元のままでOK
        fields = ["id", "email", "name"]
```

#### save()

```python
serializer.save()
```

内部的にはインスタンスがあれば <span class="code-like">update()</span><br>
インスタンスがなければ <span class="code-like">create()</span> が呼ばれる。

<span class="code-like">save()</span> 後は

```python
# 保存されたモデル
serializer.instance
```

にアクセスできる。

`save()` に渡したキーワード引数は、`validated_data` に追加されて、`create()` や `update()` に渡される。リクエストには含まれない値 (ログイン中のユーザーなど) を保存するときに使う。

```python
serializer.save(owner=request.user)
```

### 出力

レスポンスとしてモデルシリアライザを通す場合は、 <span class="code-like">instance=</span> もしくは第1引数としてモデルオブジェクトを渡すことにより、どのフィールドを JSON にするかなどを精査する。

```python
user = User.objects.get(pk=1)

serializer = UserSerializer(user)
# または
serializer = UserSerializer(instance=user)

serializer.data
```

複数のオブジェクトは、`many=True` を指定して渡す。

```python
books = Book.objects.all()

serializer = BookSerializer(books, many=True)
serializer.data  # dict のリストになる
```

<pre><code class="tips">更新は特殊で、 <span class="code-like">instance=</span> と <span class="code-like">data=</span> を渡す必要がある。

serializer = UserSerializer(instance=user, data=request.data)
serializer.is_valid()
serializer.save()</code></pre>

### 更新と部分更新 <a id="partial-update"></a>

| HTTP メソッド | `partial` | 必須項目 |
| --- | --- | --- |
| `PUT` | `False` (既定) | すべての必須項目が必要 |
| `PATCH` | `True` | 送ったフィールドだけを検証し、更新する |

```python
# PATCH 相当。送られたフィールドだけを更新する
serializer = BookSerializer(instance=book, data=request.data, partial=True)
serializer.is_valid(raise_exception=True)
serializer.save()
```

### create() と update() の上書き

`ModelSerializer` の既定の `create()` と `update()` で足りない場合は、自分で上書きする。

```python
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password"]

    def create(self, validated_data):
        # パスワードをハッシュ化して保存するため、create_user() を使う
        return User.objects.create_user(**validated_data)
```

---

## リクエストとレスポンス <a id="request-response" data-name="リクエストとレスポンス"></a>

DRF の View は、Django の `HttpRequest` ではなく、DRF の `Request` を受け取る。

| 属性 | 内容 |
| --- | --- |
| `request.data` | ボディを解析した結果 (JSON、フォーム、ファイル)。`PUT` や `PATCH` でも使える |
| `request.query_params` | クエリ文字列 (Django の `request.GET` に相当) |
| `request.user` | 認証されたユーザー |
| `request.auth` | 認証の情報 (トークンなど) |

レスポンスは、`Response` で返す。`Accept` ヘッダーなどから、出力の形式 (JSON や Browsable API の HTML) が自動で選ばれる。

```python
from rest_framework import status
from rest_framework.response import Response

return Response({"message": "作成した"}, status=status.HTTP_201_CREATED)
```

| 定数 | コード | 用途 |
| --- | --- | --- |
| `HTTP_200_OK` | 200 | 取得、更新の成功 |
| `HTTP_201_CREATED` | 201 | 作成の成功 |
| `HTTP_204_NO_CONTENT` | 204 | 削除の成功 (ボディなし) |
| `HTTP_400_BAD_REQUEST` | 400 | 入力の検証エラー |
| `HTTP_401_UNAUTHORIZED` | 401 | 未認証 |
| `HTTP_403_FORBIDDEN` | 403 | 権限がない |
| `HTTP_404_NOT_FOUND` | 404 | 対象が存在しない |

`rest_framework.exceptions` の例外 (`NotFound`、`PermissionDenied`、`ValidationError` など) を `raise` すると、DRF が適切なステータスコードのレスポンスに変換する。

<pre><code class="tips">ステータスコードは、数値ではなく status の定数で書くと、意味が読み取りやすい。
例外を raise する書き方にすると、View の中の if による分岐を減らせる。</code></pre>

---

## クラスベースビュー <a id="class-baes-view" data-name="クラスベースビュー"></a>

クラスベースビューは、基底クラスを継承することで実装できるビューで、効率的で再利用性の高いAPIを構築できる。

| クラス | 自動化 | 向く場面 |
| --- | --- | --- |
| `APIView` | ほぼなし | 独自の処理が多い API |
| `GenericAPIView` + Mixins | 必要な操作だけ選ぶ | 一部の操作だけ標準の処理を使う API |
| Generics Views | 標準の CRUD が完成している | 標準的な CRUD の API |

```text
APIView
└── GenericAPIView
    └── Generics Views (GenericAPIView + Mixins の完成品)
```

### APIView

Django 純正の View クラスを DRF 用に拡張したすべての CBV の基底クラス。<br>
自動化があまりなく、拡張性が高い。

<span class="code-like">get()</span> , <span class="code-like">post()</span> , <span class="code-like">put()</span> , <span class="code-like">delete()</span> などの HTTP メソッドに対応するメソッドを自分で定義する。

DRF の認証、権限、流量制限 (スロットリング) などの基本機能は最初から組み込まれている。

```python
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Book
from .serializers import BookSerializer


class BookListView(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # 失敗時は 400 を返す
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BookDetailView(APIView):
    def get(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        return Response(BookSerializer(book).data)

    def delete(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

### GenericAPIView

APIView を継承し、モデルのデータを取得してシリアライザで変換するという API の共通パターンを共通化したクラス。<br>
単体で使うことは少なく、基本的には Mixin と組み合わせて使う。

queryset (どのデータを使うか) と serializer_class (どのシリアライザで変換するか) を設定するだけで、データのフィルタリングやページネーション、バリデーションの基盤を自動で提供してくれる。

#### 主要な属性・メソッド

| 種類 | 名前 | 内容 |
| --- | --- | --- |
| 属性 | `queryset` | 対象のデータ |
| 属性 | `serializer_class` | 変換に使うシリアライザ |
| 属性 | `lookup_field` | 1 件の取得に使うフィールド (既定は `pk`) |
| メソッド | `get_queryset()` | 対象のデータを返す。リクエストに応じて絞り込むときに上書きする |
| メソッド | `get_object()` | URL から、1 件のオブジェクトを取得する (権限のチェックも行う) |
| メソッド | `get_serializer_class()` | 使うシリアライザを返す。操作ごとに切り替えるときに上書きする |

### Mixins

特定の CRUD 操作 (一覧取得、作成、詳細取得、更新、削除) のロジックだけを個別に実装したクラス群。

単体では動作せず、必ず GenericAPIView と一緒に多重継承して使う。

必要な機能だけを使いたい (ミックスイン) 時に便利。

#### 種類

| Mixin | メソッド | 内容 |
| --- | --- | --- |
| `ListModelMixin` | `.list()` | 一覧取得 |
| `CreateModelMixin` | `.create()` | 新規作成 |
| `RetrieveModelMixin` | `.retrieve()` | 1 件取得 |
| `UpdateModelMixin` | `.update()` | 更新 (`.partial_update()` で部分更新) |
| `DestroyModelMixin` | `.destroy()` | 削除 |

```python
from rest_framework import generics, mixins

from .models import Book
from .serializers import BookSerializer


class BookList(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    # HTTP メソッドと、Mixin のメソッドを対応させる
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
```

### Generics Views

GenericAPIView と各種 Mixins を最初から組み合わせて、よくある API の形に仕上げた完成品クラス群。

コードを数行書くだけで、標準的な CRUD API が完成する。

開発効率が良く、可読性にも優れている。

#### 主な Views

| View | 内容 | 組み合わせ |
| --- | --- | --- |
| `ListAPIView` | データの「一覧取得」専用 | `GenericAPIView` + `ListModelMixin` |
| `CreateAPIView` | データの「新規作成」専用 | `GenericAPIView` + `CreateModelMixin` |
| `RetrieveUpdateDestroyAPIView` | 1 件の「取得・更新・削除」をすべて行う | `GenericAPIView` + `Retrieve` + `Update` + `Destroy` |

#### その他の Views

| View | 内容 |
| --- | --- |
| `RetrieveAPIView` | 1 件の取得専用 |
| `UpdateAPIView` | 1 件の更新専用 |
| `DestroyAPIView` | 1 件の削除専用 |
| `ListCreateAPIView` | 一覧取得と新規作成 |
| `RetrieveUpdateAPIView` | 1 件の取得と更新 |
| `RetrieveDestroyAPIView` | 1 件の取得と削除 |

```python
from rest_framework import generics

from .models import Book
from .serializers import BookSerializer


class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
```

#### 処理を差し込むメソッド

標準の処理の一部だけを変えたいときは、`create()` などではなく、次のメソッドを上書きする。

| メソッド | 呼ばれるタイミング |
| --- | --- |
| `perform_create(serializer)` | 新規作成の保存時 |
| `perform_update(serializer)` | 更新の保存時 |
| `perform_destroy(instance)` | 削除時 |

```python
class BookListCreateView(generics.ListCreateAPIView):
    serializer_class = BookSerializer

    def get_queryset(self):
        # ログイン中のユーザーの本だけを返す
        return Book.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # リクエストにない値を、保存時に追加する
        serializer.save(owner=self.request.user)
```

<pre><code class="caution">リクエストに応じてデータを絞り込むときは、queryset 属性ではなく、get_queryset() を上書きする。
クラス属性の queryset には、リクエストの情報 (request.user など) を使えない。</code></pre>

---

## 関数ベースビュー <a id="function-based-view" data-name="関数ベースビュー"></a>

関数に `@api_view` を付けると、DRF の `Request` と `Response` を使う View になる。処理が単純な API や、1 つだけの特殊なエンドポイントに向く。

```python
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Book
from .serializers import BookSerializer


@api_view(["GET", "POST"])  # 許可する HTTP メソッドを指定する
def book_list(request):
    if request.method == "GET":
        serializer = BookSerializer(Book.objects.all(), many=True)
        return Response(serializer.data)

    serializer = BookSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)
```

認証や権限は、`@authentication_classes` と `@permission_classes` で指定する。`@api_view` より下に書くと無視されるため、**上**に書く。

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({"username": request.user.username})
```

<pre><code class="caution">許可していない HTTP メソッドでアクセスすると、405 Method Not Allowed が返る。
@permission_classes などのデコレータは、@api_view より下に書くと、設定が反映されない。</code></pre>

---

## ViewSet と Router <a id="viewset" data-name="ViewSetとRouter"></a>

ViewSet は、一覧・詳細・作成・更新・削除といった複数の操作を、1 つのクラスにまとめる仕組み。Router と組み合わせると、URL も自動で生成される。

| クラス | 内容 |
| --- | --- |
| `ViewSet` | 操作のメソッド (`list()`、`retrieve()` など) を、すべて自分で書く |
| `GenericViewSet` | `GenericAPIView` の機能を持つ。Mixins と組み合わせて使う |
| `ModelViewSet` | 一覧・詳細・作成・更新・部分更新・削除が、すべて揃っている |
| `ReadOnlyModelViewSet` | 一覧と詳細だけ (読み取り専用) |

```python
# views.py
from rest_framework import viewsets

from .models import Book
from .serializers import BookSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
```

```python
# urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BookViewSet

router = DefaultRouter()
router.register(r"books", BookViewSet, basename="book")

urlpatterns = [
    path("api/", include(router.urls)),
]
```

これだけで、次の URL が使える。

| HTTP メソッド | URL | 操作 |
| --- | --- | --- |
| `GET` | `/api/books/` | 一覧 (`list`) |
| `POST` | `/api/books/` | 作成 (`create`) |
| `GET` | `/api/books/<pk>/` | 詳細 (`retrieve`) |
| `PUT` | `/api/books/<pk>/` | 更新 (`update`) |
| `PATCH` | `/api/books/<pk>/` | 部分更新 (`partial_update`) |
| `DELETE` | `/api/books/<pk>/` | 削除 (`destroy`) |

`DefaultRouter` は、API の入口になるルートの画面も作る。画面が不要なら、`SimpleRouter` を使う。

### 独自のアクション <a id="viewset-action"></a>

標準の操作以外のエンドポイントは、`@action` で足す。

```python
from rest_framework.decorators import action
from rest_framework.response import Response


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    @action(detail=True, methods=["post"])
    def discount(self, request, pk=None):
        # POST /api/books/<pk>/discount/ になる
        book = self.get_object()
        book.price = int(book.price * 0.9)
        book.save()
        return Response(self.get_serializer(book).data)
```

| 引数 | 内容 |
| --- | --- |
| `detail` | `True` なら 1 件に対する操作 (URL に `<pk>` が付く)、`False` なら全体に対する操作 |
| `methods` | 許可する HTTP メソッドのリスト |
| `url_path` | URL の末尾 (省略すると、メソッド名になる) |

<pre><code class="tips">標準的な CRUD が中心なら ModelViewSet と Router の組み合わせが最も短く書ける。
操作ごとに処理が大きく異なる場合は、APIView や Generics Views に分けた方が、読みやすいことが多い。</code></pre>

---

## 認証と権限 <a id="auth-permission" data-name="認証と権限"></a>

DRF では、View の処理の前に、認証 (誰か) と権限 (何をしてよいか) が判定される。

### 認証

| 認証クラス | 内容 |
| --- | --- |
| `SessionAuthentication` | Django のセッション。ブラウザからの利用に向く (CSRF のチェックがある) |
| `BasicAuthentication` | Basic 認証。テスト用途に限る |
| `TokenAuthentication` | DRF 標準のトークン認証 (`rest_framework.authtoken` を `INSTALLED_APPS` に追加する) |
| JWT | 標準にはない。`djangorestframework-simplejwt` などを使う |

```python
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


class MeView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
```

### 権限

| 権限クラス | 内容 |
| --- | --- |
| `AllowAny` | 誰でもよい (既定) |
| `IsAuthenticated` | 認証済みのユーザーだけ |
| `IsAdminUser` | `is_staff` が真のユーザーだけ |
| `IsAuthenticatedOrReadOnly` | 認証済みなら書き込み可、未認証は読み取りだけ |
| `DjangoModelPermissions` | Django のモデルの権限 (`add`、`change`、`delete`) に従う |
| `DjangoModelPermissionsOrAnonReadOnly` | 上に加えて、未認証の読み取りを許可する |

複数の権限は、リストに並べると、すべてを満たす必要がある (AND)。`&`、`|`、`~` で、組み合わせも書ける。

```python
permission_classes = [IsAuthenticated, IsOwner]  # 両方を満たす
permission_classes = [IsAdminUser | IsOwner]     # どちらかを満たす
```

### 独自の権限

```python
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # 読み取り (GET、HEAD、OPTIONS) は、誰でも許可する
        if request.method in permissions.SAFE_METHODS:
            return True
        # 書き込みは、持ち主だけに許可する
        return obj.owner == request.user
```

| メソッド | 内容 |
| --- | --- |
| `has_permission(request, view)` | View 全体に対する判定。リクエストの最初に呼ばれる |
| `has_object_permission(request, view, obj)` | 1 件のオブジェクトに対する判定。`get_object()` から呼ばれる |

<pre><code class="caution">has_object_permission() は、一覧 (list) では呼ばれない。
APIView で get_object() を使わずに自分でオブジェクトを取得する場合は、check_object_permissions(request, obj) を呼ぶ必要がある。
SessionAuthentication は、ログイン済みのリクエストに CSRF のチェックを行うため、トークンなしの POST は 403 になる。</code></pre>

---

## ページネーションとフィルタ <a id="pagination-filter" data-name="ページネーションとフィルタ"></a>

### ページネーション

| クラス | 内容 |
| --- | --- |
| `PageNumberPagination` | ページ番号で分割する (`?page=2`) |
| `LimitOffsetPagination` | 件数と開始位置で分割する (`?limit=20&offset=40`) |
| `CursorPagination` | カーソルで分割する。大量のデータや、追加が続くデータに向く |

ページネーションを有効にすると、一覧のレスポンスは、配列ではなく、次の形になる。

```text
{
  "count": 123,
  "next": "http://example.com/api/books/?page=3",
  "previous": "http://example.com/api/books/?page=1",
  "results": [ ... ]
}
```

View ごとに設定を変えるときは、クラスを継承して指定する。

```python
from rest_framework.pagination import PageNumberPagination


class StandardPagination(PageNumberPagination):
    page_size = 20                      # 1 ページの件数
    page_size_query_param = "page_size"  # クライアントが件数を指定するキー
    max_page_size = 100                 # 指定できる件数の上限


class BookListView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = StandardPagination
```

### フィルタ

標準で、検索と並び替えのフィルタが使える。

```python
from rest_framework import filters, generics


class BookListView(generics.ListAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title"]      # ?search=python
    ordering_fields = ["price"]    # ?ordering=-price
```

| フィルタ | 内容 |
| --- | --- |
| `SearchFilter` | `search_fields` の項目を、キーワードで検索する |
| `OrderingFilter` | `ordering_fields` の項目で、並び替える |
| `DjangoFilterBackend` | 項目ごとの絞り込み。`django-filter` を別に入れる |

<pre><code class="tips">項目ごとの絞り込み (価格の範囲など) が必要な場合は、django-filter を使うと、少ない記述で書ける。
filter_backends は、settings.py の DEFAULT_FILTER_BACKENDS で、全体の既定にもできる。</code></pre>

---

## 実践例 <a id="practice" data-name="実践例"></a>

本の API を、`ModelViewSet` と `DefaultRouter` で作る。

```python
# models.py
from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=100)
    price = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
```

```python
# serializers.py
from rest_framework import serializers

from .models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "price", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("価格は 0 以上にする。")
        return value
```

```python
# views.py
from rest_framework import filters, viewsets

from .models import Book
from .serializers import BookSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by("id")
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title"]
    ordering_fields = ["price", "created_at"]
```

```python
# urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BookViewSet

router = DefaultRouter()
router.register(r"books", BookViewSet, basename="book")

urlpatterns = [
    path("api/", include(router.urls)),
]
```

動作を確認する。

```bash
curl -X POST http://127.0.0.1:8000/api/books/ \
  -H "Content-Type: application/json" \
  -d '{"title": "DRF 入門", "price": 2500}'
```

```text
{"id":1,"title":"DRF 入門","price":2500,"created_at":"2026-11-28T10:00:00+09:00"}
```

<pre><code class="tips">queryset に order_by() を付けておくと、ページネーションの警告 (順序が不定) を避けられる。
出力の日時などは、設定によって変わる。</code></pre>

---

## テスト <a id="testing" data-name="テスト"></a>

DRF には、API のテスト用に、`APIClient` と `APITestCase` が用意されている。Django のテストの基本は、Django のドキュメントを参照。

| 項目 | 内容 |
| --- | --- |
| `APITestCase` | `self.client` が `APIClient` になっているテストケース |
| `APIClient` | `get()`、`post()` などで API を呼ぶ。`format="json"` で JSON を送れる |
| `APIRequestFactory` | View を直接呼ぶときの、リクエストを作る |
| `force_authenticate()` | 認証の手順を省略して、ログイン済みにする |

```python
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Book


class BookApiTests(APITestCase):
    def setUp(self):
        user = get_user_model().objects.create_user(username="tester", password="pass")
        # 認証が必要な API でも、ログインの手順を省略できる
        self.client.force_authenticate(user=user)

    def test_create_book(self):
        response = self.client.post(
            "/api/books/", {"title": "DRF 入門", "price": 2500}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Book.objects.count(), 1)

    def test_invalid_price(self):
        response = self.client.post(
            "/api/books/", {"title": "DRF 入門", "price": -1}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("price", response.data)
```

```bash
python manage.py test
```

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `When a serializer is passed a data keyword argument you must call .is_valid()` | `data=` で作った Serializer の `.data` を、`is_valid()` の前に参照している | `is_valid()` を呼んでから、`.data` を参照する |
| `You must call .is_valid() before calling .save()` | `data=` で作った Serializer を、検証せずに保存している | `save()` の前に、`is_valid()` を呼ぶ |
| `Got AttributeError when attempting to get a value for field` | 複数のオブジェクトを渡しているのに `many=True` がない。またはフィールド名がモデルの属性と合っていない | `many=True` を付ける。`source` や `fields` を確認する |
| 更新時に、unique のエラーになる | `instance=` を渡さずに、`data=` だけで検証している。またはネストしたシリアライザーを使っている | `instance=` を渡す。ネストの場合は、`validators=[]` で重複のチェックを外す |
| `PUT` で、必須項目のエラーになる | `PUT` はすべての必須項目が必要 | 一部だけ更新するときは、`PATCH` か `partial=True` を使う |
| `Creating a ModelSerializer without either the 'fields' attribute` | `Meta` に `fields` も `exclude` もない | `fields` を明示する (すべてなら `"__all__"`) |
| ページネーションが効かない | `PAGE_SIZE` だけを設定していて、`DEFAULT_PAGINATION_CLASS` がない | `DEFAULT_PAGINATION_CLASS` も設定する |
| `POST` が `403` になり、`CSRF Failed` と出る | `SessionAuthentication` では、ログイン済みのリクエストに CSRF のチェックがある | CSRF トークンを付ける。または、トークン認証などに切り替える |
| 他人のデータを `PUT` や `DELETE` できてしまう | 権限が `IsAuthenticated` だけで、持ち主を確認していない | `has_object_permission()` を持つ、独自の権限を追加する |
| `has_object_permission()` が呼ばれない | 一覧では呼ばれない。`APIView` で `get_object()` を使っていない | `get_object()` を使うか、`check_object_permissions()` を呼ぶ |
| `validate_<フィールド名>()` が呼ばれない | そのフィールドが、`fields` にない、または `read_only` になっている | `fields` と、`read_only_fields` を確認する |
| coreapi に関する警告やエラーが出る | 3.17.0 で coreapi のサポートが削除された | OpenAPI を生成する別のライブラリ (`drf-spectacular` など) に移行する |
| ユーザーごとのデータに絞れない | `queryset` 属性では、`request` を使えない | `get_queryset()` を上書きする |

---

## 関連 <a id="ecosystem" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| `django-filter` | 項目ごとの絞り込みのフィルタ |
| `drf-spectacular` | OpenAPI のスキーマと、ドキュメントの自動生成 |
| `djangorestframework-simplejwt` | JWT による認証 |
| `django-cors-headers` | CORS の設定 (フロントエンドが別のオリジンのとき) |
