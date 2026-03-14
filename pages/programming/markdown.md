---
title: Markdown
layout: default
---

# Markdown <a id="top" data-name="TOP"></a>

---



## マークダウン(Markdown)の要素一覧

### 見出し(Headings) <a id="headings" data-name="見出し"></a>
🔹ブロック要素

```markdown
# 見出し1
## 見出し2
### 見出し3
#### 見出し4
##### 見出し5
###### 見出し6
```

### 強調(Emphasis) <a id="emphasis" data-name="強調"></a>
🔹インライン要素

```markdown
*斜体* または _斜体_
**太字** または __太字__
***斜体+太字*** または ___斜体+太字___
~~取り消し線~~
```

###  リスト(Lists) <a id="lists" data-name="リスト"></a>

#### 番号なしリスト(Unordered List)
🔹ブロック要素

```markdown
- アイテム1
    - サブアイテム
        - さらにサブアイテム
* 別の記法
+ 別の記法
```

#### 番号付きリスト(Ordered List)
🔹ブロック要素

```markdown
1. アイテム1
2. アイテム2
    1. サブアイテム
    2. サブアイテム
3. アイテム3
```

### 引用(Blockquote) <a id="blockquote" data-name="引用"></a>
🔹ブロック要素

```markdown
> これは引用です。
>> ネストされた引用
>>> さらにネスト
```

### コード(Code) <a id="code" data-name="コード"></a>

#### インラインコード
🔹インライン要素

```markdown
`print("Hello, World!")`
```

#### コードブロック
🔹ブロック要素

````markdown
```
print("Hello, World!")
```
````

または言語指定:

````markdown
```python
def hello():
    print("Hello, World!")
```
````

### リンク(Links) <a id="links" data-name="リンク"></a>
🔹インライン要素

```markdown
[リンクテキスト](https://example.com)
[リンクテキスト](https://example.com "タイトル")
```

```markdown
<https://example.com>
```

#### 任意の位置へのリンク

マークダウンを用いて任意の位置へのリンクを貼る場合は、<br>
要素にidを持たせて`[テキスト](#id)`とする、

```markdown
<p id="here">ジャンプ先</p>

[ジャンプ先へジャンプ](#here)
```

もしくは、`[テキスト](#見出し)`とする。<br>
日本語も可能だが、空白は-(ハイフン)に、英大文字は英小文字にする必要がある。<br>
また記号は無視される。

```markdown
### ジャンプ先

[ジャンプ先へジャンプ](#ジャンプ先)
```

<pre><code class="tips">ページへのリンクを貼る場合は
[C言語|プリプロセッサ](pages/c/c#preprocessor)
のように書く</code></pre>

### 水平線(Horizontal Rule) <a id="horizontal-rule" data-name="水平線"></a>
🔹ブロック要素

```markdown
---
***
___ (アンダースコア)
```

### 画像(Images) <a id="images" data-name="画像"></a>
🔹インライン要素

```markdown
![代替テキスト](https://example.com/image.jpg)
![代替テキスト](https://example.com/image.jpg "タイトル")
```

### テーブル(Tables) <a id="table" data-name="テーブル"></a>
🔹ブロック要素<br>
🔹ハイフンは3つ以上でOK

```markdown
| 見出し1 | 見出し2 | 見出し3 |
| ------- | ------- | ------- |
| 内容1   | 内容2   | 内容3   |
| 内容A   | 内容B   | 内容C   |
```

または整列を指定:

```markdown
| 左寄せ | 中央寄せ | 右寄せ |
| :----- | :------: | -----: |
| 左     |   中央   |     右 |
| A      |    B     |      C |
```

### チェックリスト(Task List) <a id="task-list" data-name="チェックリスト"></a>

```markdown
- [ ] 未完了のタスク
- [x] 完了したタスク
```

### HTMLの埋め込み <a id="html" data-name="HTMLの埋め込み"></a>

```markdown
<div style="color: red;">赤いテキスト</div>
```

### エスケープ(特殊文字) <a id="escape" data-name="エスケープ"></a>

```markdown
\*これでアスタリスクをエスケープ\*
```

### 改行 <a id="br" data-name="改行"></a>
意図的に改行を入れたい場合は、**行末にスペースを2つ**、または**&lt;br&gt;**タグを入れる。

### 定義リスト(対応エンジンが必要) <a id="def-list" data-name="定義リスト"></a>

```markdown
用語1
: 定義1

用語2
: 定義2
```