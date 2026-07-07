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

## Serializer

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

<pre><code class="tips">デフォルトで単数なので、複数渡す場合は <span class="code-like">many=True</span> を指定する</code></pre>

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

<span class="code-like">validate()</span> や <span class="code-like">validate_ &lt;filed&gt;()</span> があれば自動で実行される。

<pre><code class="tips">実装した <span class="code-like">validate()</span> は、検証したデータを返す必要があり、
特定のフィールドを検証するメソッドはそのフィールドの値を (加工してもいい)、
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