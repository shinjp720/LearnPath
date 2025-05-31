<div data-title="BeautifulSoup"></div>
<a id="top" data-name="TOP">

# BeautifulSoup

- BeautifulSoup(ビューティフルスープ)は、PythonでHTMLやXMLを解析・スクレイピングするためのライブラリで、HTML/XMLをパースして、タグや属性、テキストを簡単に抽出・操作できる。

```python
pip install beautifulsoup4
from bs4 import BeautifulSoup
```

---

## スープオブジェクトの作成

### requestsで作成

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")
```

### ファイルから作成

```python
from bs4 import BeautifulSoup

with open(file_path, encoding="utf-8") as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, 'html.parser')
```

---

## パーサーの種類

| パーサー    | 速度       | 寛容さ     | インストール         | 特徴               |
| ----------- | ---------- | ---------- | -------------------- | ------------------ |
| html.parser | 遅い       | 高い       | 不要                 | 手軽に使える       |
| lxml        | 速い       | 高い       | pip install lxml     | 最もバランスがいい |
| html5lib    | 遅め       | 非常に高い | pip install html5lib | ブラウザと同じ解析 |
| xml         | 非常に速い | 低い       | pip install lxml     | XML専用            |

---

## スープオブジェクトのメソッド

| メソッド                                 | 説明                                                                                                                                                 | 例                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `soup.find("タグ名")`                    | タグで検索する。タグオブジェクトを返す。<br>`soup.p`は`soup.find("p")`のショートカット。<br>指定したタグが複数ある場合は最初に見つかった要素となる。 | `soup.find("p")`                              |
| `soup.find_all("タグ名")`                | 複数のタグを検索する。<br>タグオブジェクトをリストで返す。                                                                                           | `soup.find_all("p")`                          |
| `soup.find("タグ名", class_="クラス名")` | クラスで検索する。<br>classはpythonの予約語なので`class_`とする必要がある。                                                                          | `soup.find("p", class_="text")`               |
| `soup.find("タグ名", 属性名="値")`       | 特定の属性で検索する。                                                                                                                               | `soup.find("a", href="https://example.com")`  |
| `soup.select_one("css_selector")`        | CSSセレクターで検索する。<br>指定した要素が複数ある場合は最初に見つかった要素となる。                                                                | `soup.select_one("#main-image .a-color-red")` |
| `soup.select("css_selector")`            | CSSセレクターで検索する。<br>タグオブジェクトのリストで返す。                                                                                        | `soup.select("div p")`                        |
| `soup.new_tag("new_tag")`                | タグオブジェクトを生成して返す。                                                                                                                     | `p_tag = soup.new_tag("p")`                   |
| `soup.prettify()`                        | 綺麗にフォーマットされたHTMLを返す。                                                                                                                 | `html_content = soup.prettify()`              |

---

## タグオブジェクトの属性とメソッド

### 属性

| 属性              | 説明                                                                                                                                | 例                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `tag.text`        | タグ中のテキストを表す。すべての子孫要素を含めたテキストを取得する。                                                                | `p_tag.text`                                       |
| `tag.string`      | タグの直接のテキストを表す。<br>子要素がある場合はNoneが返るので注意。<br>タグの中身が必ず1つのテキストノードである場合に使用する。 | `p_tag.string`                                     |
| `tag.name`        | タグ名を表す。                                                                                                                      | `p_tag.name` `"p"`                                 |
| `tag.attrs`       | タグの属性を辞書型で表す。                                                                                                          | `a_tag.attrs` => `{"href": "https://example.com"}` |
| `tag.parent`      | 親要素を表す。                                                                                                                      | `p_tag.parent`                                     |
| `tag.contents`    | 直接の子要素のリスト。                                                                                                              | `div.contents`                                     |
| `tag.children`    | 直接の子要素のイテレータ。                                                                                                          | `div.children`                                     |
| `tag.descendants` | すべての子孫要素のイテレータ。                                                                                                      | `div.descendants`                                  |

### メソッド

| メソッド                            | 説明                                                                                                                                                                                                                       | 例                                                                                                    |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `tag.get("属性名")`                 | 指定した属性の値を取得する。<br>属性が存在しない場合`None`が返る。                                                                                                                                                         | `a_tag.get("href")`                                                                                   |
| `tag["属性名"]`                     | 指定した属性の値を取得する。<br>属性が存在しない場合、`KeyError`が発生する。                                                                                                                                               | `a_tag["href"]`                                                                                       |
| `tag.has_attr("属性名")`            | 指定した属性があるか確認する。                                                                                                                                                                                             | `a_tag.has_attr("href")`                                                                              |
| `tag.append("追加する要素")`        | タグ、または文字列を要素の末尾に追加する。                                                                                                                                                                                 | `new_tag = soup.new_tag("strong")`<br>`new_tag.string = "Appended Strong"`<br>`p_tag.append(new_tag)` |
| `tag.insert(index, "挿入する要素")` | 挿入する位置を指定して要素を挿入する。                                                                                                                                                                                     | `ul_tag.insert(0, ui_tag)`                                                                            |
| `tag.decompose()`                   | タグを削除する。                                                                                                                                                                                                           | `a_tag.decompose()`                                                                                   |
| `tag.extract()`                     | タグを削除して返す。                                                                                                                                                                                                       | `a_tag.extract()`                                                                                     |
| `tag.replace_with("New contents")`  | タグの中身をタグごと置き換える。<br>文字列として渡した場合はタグはエスケープされ、<br>単なる文字列として置き換えられる。<br>HTMLのタグとして置き換えたい場合は<br>スープオブジェクトとして渡すか、タグオブジェクトを渡す。 | `p_tag.replace_with(soup)`<br>`p_tag.replace_with(new_tag)`                                           |
| `tag.clear()`                       | タグはそのままに、テキストを削除する。                                                                                                                                                                                     | `a_tag.clear()`                                                                                       |