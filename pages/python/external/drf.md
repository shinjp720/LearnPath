---
title: DRF
layout: default
---

# DRF <a id="top" data-name="TOP">

DRF は DjangoRESTFramework の略で Django で APIサーバーを簡単に構築することができるフレームワーク。<br>
model は通常の Django と同じで、特に Serializer が重要となる。

## 導入 <a id="introduction" data-name="導入"></a>

```bash
pip install djangorestframework
```

## Serializer <a id="serializer" data-name="serializer"></a>

シリアライザーは Python オブジェクトや Model などと JSON を相互変換し、そのデータが正しいか検証するクラス。<br>
つまり

- Python -> JSON (レスポンス)
- JSON -> Python (リクエスト)
- バリデーション

の3つを担当する。

Serializer は単なる JSON の変換器ではなく、データの定義書のようなもので、

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

### ライフサイクル

Serializer にはライフサイクルがある。

#### インスタンス生成

```python
# レスポンスなら
serializer = BookSerializer(book)

# リクエストなら
serializer = BookSerializer(data=request.data)
```

<pre><code class="caution">データを渡す際は <span class="code-like">data=</span>が必須。</code></pre>

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

<span class="code-like">validate()</span> や <span class="code-like">validate_&lt;filed&gt;()</span> があれば自動で実行される。

<pre><code class="tips">実装した <span class="code-like">validate()</span> は、検証したデータを返す必要があり、
特定のフィールドを検証するメソッドはそのフィールドの値 (加工してもいい) を、
オブジェクト全体を検証する <span class="code-like">validate()</span> は値を丸ごと返す必要がある。
また失敗した場合は <span class="code-like">ValidationError</span> を <span class="code-like">raise</span> する必要がある。</code></pre>

バリデーションが成功すると

```python
# バリデーションされたデータ
serializer.validated_data
```

へアクセスできるようになる。

#### save()

```python
serializer.save()
```

内部的にはインスタンスがあれば <span class="code-like">create()</span><br>
インスタンスがなければ <span class="code-like">update()</span> が呼ばれる。

<span class="code-like">save()</span> 後は

```python
# 保存されたモデル
serializer.instance
```

にアクセスできる。

## クラスベースビュー <a id="class-baes-view" data-name="クラスベースビュー"></a>

クラスベースビューは、基底クラスを継承することで実装できるビューで、効率的で再利用性の高いAPIを構築できる。

### APIView

Django 純正の View クラスを DRF用に拡張したすべての CBV の基底クラス。<br>
自動化があまりなく、拡張性が高い。

<span class="code-like">get()</span> , <span class="code-like">post()</span> , <span class="code-like">put()</span> , <span class="code-like">delete()</span> などの HTTPメソッドに対応するメソッドを自分で定義する。

DRF の認証、権限、認証制限などの基本機能は最初から組み込まれている。

### GenericAPIView

APIView を継承し、モデルのデータを取得してシリアライザで変換するという API の共通パターンを共通化したクラス。<br>
単体で使うことは少なく、基本的には Mixin と組み合わせて使う。

queryset (どのデータを使うか) と serializer_class (どのシリアライザで変換するか) を設定するだけで、データのフィルタリングやページネーション、バリデーションの基盤を自動で提供してくれる。

#### 主要な属性・メソッド

- 属性: queryset, serializer_class, lookup_field など
- メソッド: get_queryset(), get_object() など

### Mixins

特定の CRUD 操作 (一覧取得、作成、詳細取得、更新、削除) のロジックだけを個別に実装したクラス群
。

単体では動作せず、必ず GenericAPIView と一緒に多重継承するして使う。

必要な機能だけを使いたい (ミックスイン) 時に便利。

#### 種類

- ListModelMixin: 一覧取得 (.list())

- CreateModelMixin: 新規作成 (.create())

- RetrieveModelMixin: 1件取得 (.retrieve())

- UpdateModelMixin: 更新 (.update())

- DestroyModelMixin: 削除 (.destroy())

### Generics Views

GenericAPIView と各種 Mixins を最初から組み合わせて、よくある API の形に仕上げた完成品クラス群。

コードを数行書くだけで、標準的な CRUD API が完成する。

開発効率が良く、可読性にも優れている。

#### 主な Views

- ListAPIView: データの「一覧取得」専用（GenericAPIView + ListModelMixin）

- CreateAPIView: データの「新規作成」専用（GenericAPIView + CreateModelMixin）

- RetrieveUpdateDestroyAPIView: 1件の「取得・更新・削除」をすべて行う（GenericAPIView + Retrieve + Update + Destroy）