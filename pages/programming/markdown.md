<div data-title="Markdown"></div>
<a id="top" data-name="TOP"></a>

# Markdown

---

<a id="element" data-name="要素名"></a>

## マークダウン(Markdown)の要素一覧。

### **1. 見出し(Headings)**
🔹ブロック要素

```
# 見出し1
## 見出し2
### 見出し3
#### 見出し4
##### 見出し5
###### 見出し6
```

### **2. 強調(Emphasis)**
🔹インライン要素

```
*斜体* または _斜体_
**太字** または __太字__
***斜体+太字*** または ___斜体+太字___
~~取り消し線~~
```

### **3. リスト(Lists)**

#### **3.1 番号なしリスト(Unordered List)**
🔹ブロック要素

```
- アイテム1
    - サブアイテム
        - さらにサブアイテム
* 別の記法
+ 別の記法
```

#### **3.2 番号付きリスト(Ordered List)**
🔹ブロック要素

```
1. アイテム1
2. アイテム2
    1. サブアイテム
    2. サブアイテム
3. アイテム3
```

### **4. 引用(Blockquote)**
🔹ブロック要素

```
> これは引用です。
>> ネストされた引用
>>> さらにネスト
```

### **5. コード(Code)**

#### **5.1 インラインコード**
🔹インライン要素

```
`print("Hello, World!")`
```

#### **5.2 コードブロック**
🔹ブロック要素

````
```
print("Hello, World!")
```
````

または言語指定:

````
```python
def hello():
    print("Hello, World!")
```
````

### **6. 水平線(Horizontal Rule)**
🔹ブロック要素

```
---
***
___
```

### **7. リンク(Links)**
🔹インライン要素

```
[リンクテキスト](https://example.com)
[リンクテキスト](https://example.com "タイトル")
```

### **8. 画像(Images)**
🔹インライン要素

```
![代替テキスト](https://example.com/image.jpg)
![代替テキスト](https://example.com/image.jpg "タイトル")
```

### **9. テーブル(Tables)**
🔹ブロック要素<br>
🔹ハイフンは3つ以上でOK

```
| 見出し1 | 見出し2 | 見出し3 |
| ------- | ------- | ------- |
| 内容1   | 内容2   | 内容3   |
| 内容A   | 内容B   | 内容C   |
```

または整列を指定:

```
| 左寄せ | 中央寄せ | 右寄せ |
| :----- | :------: | -----: |
| 左     |   中央   |     右 |
| A      |    B     |      C |
```

### **10. チェックリスト(Task List)**

```
- [ ] 未完了のタスク
- [x] 完了したタスク
```

### **11. HTML の埋め込み**

```
<div style="color: red;">赤いテキスト</div>
```

### **12. エスケープ(特殊文字)**

```
\*これでアスタリスクをエスケープ\*
```

### **13. 自動リンク**

```
<https://example.com>
```

### **14. 定義リスト(対応エンジンが必要)**

```
用語1
: 定義1

用語2
: 定義2
```

### **15. 改行**
意図的に改行を入れたい場合は、**行末にスペースを2つ**、または**&lt;br&gt;**タグを入れる。