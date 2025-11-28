---
title: データフォーマット
layout: default
---

# データフォーマット <a id="top" data-name="TOP"></a>

---

## JSON <a id="json" data-name="JSON"></a>

<pre><code class="example">{
  "name": "John Doe",
  "age": 30,
  "married": true
}</code></pre>

<table>
    <caption>基本ルール</caption>
    <tr><th>種類</th><th>内容</th></tr>
    <tr><td>データ</td><td>キーと値のペアを:(コロン)で区切る</td></tr>
    <tr><td>値の区切り</td><td>キーとvalueの間は:(コロン)、要素同士は,(カンマ)で区切る</td></tr>
    <tr><td>配列</td><td>[]で囲んで,(カンマ)で区切る</td></tr>
    <tr><td>要素</td><td>オブジェクト、配列、文字列、数値、真偽値、nullのいずれか</td></tr>
    <tr><td>ホワイトスペース</td><td>無視される</td></tr>
    <tr><td>コメント</td><td>JSONではコメントは書けない</td></tr>
</table>

<table>
    <caption>JSONの要素は次のいずれか</caption>
    <tr><th>名前</th><th>書き方</th><th>説明</th></tr>
    <tr><td>object</td><td>{}</td><td>{}で囲まれた中にキーと値のペア<br>それぞれのペアは:で区切る</td></tr>
    <tr><td>array</td><td>[]</td><td>[]で囲まれた中に値のリストを並べる<br>要素同士は,で区切る</td></tr>
    <tr><td>string</td><td>""</td><td>""で囲まれた文字列</td></tr>
    <tr><td>number</td><td>012</td><td>数値</td></tr>
    <tr><td>true</td><td>"true"</td><td>真を表す(全て小文字のみ)</td></tr>
    <tr><td>false</td><td>"false"</td><td>偽を表す(全て小文字のみ)</td></tr>
    <tr><td>null</td><td>"null"</td><td>空を表す(全て小文字のみ)</td></tr>
</table>

- 基本構造として一番外側はobjectかarrayである必要がある。
- true, false, nullは小文字である必要がある。
- 同じオブジェクト内でキーは重複できない(重複すると最後の値が有効)。

<pre><code class="example">{
  "fruits": ["Apple", "Orange", "Banana"],
  "numbers": [1, 2, 3, 4, 5]
}</code></pre>

<table>
    <caption>文字列中で有効なエスケープ文字</caption>
    <tr><th>記号</th><th>意味</th></tr>
    <tr><td>\"</td><td>ダブルクォート</td></tr>
    <tr><td>\\</td><td>バックスラッシュ</td></tr>
    <tr><td>\/</td><td>スラッシュ</td></tr>
    <tr><td>\b</td><td>バックスペース</td></tr>
    <tr><td>\f</td><td>フォームフィード</td></tr>
    <tr><td>\n</td><td>改行</td></tr>
    <tr><td>\r</td><td>復帰</td></tr>
    <tr><td>\t</td><td>タブ</td></tr>
    <tr><td>\uXXXX</td><td>16進のUnicodeコードポイント</td></tr>
</table>

---

## YAML <a id="yaml" data-name="YAML"></a>
YAMLはJSONのスーパーセットであり、YAML -> JSON, JSON -> YAMLへのデータの変換が可能。

<pre><code class="example">person:
  name: John Doe
  age: 30
  children:
    - name: Jane Doe
      age: 10
    - name: Jack Doe
      age: 7
</code></pre>

<table>
    <caption>基本ルール</caption>
    <tr><th>種類</th><th>内容</th></tr>
    <tr><td>データ</td><td>キーと値のペアを: (コロンとスペース)で区切る</td></tr>
    <tr><td>値</td><td>クォートなし、'(シングルクォート)、"(ダブルクォート)のいずれか</td></tr>
    <tr><td>配列</td><td>-(ハイフン)で表す</td></tr>
    <tr><td>階層</td><td>2または4個のスペース(インデント)で表す(TABは禁止)</td></tr>
    <tr><td>真偽値、null</td><td>true, false, yes, no, on, off, null</td></tr>
    <tr><td>コメント</td><td>#でコメント(行の途中にも書ける)</td></tr>
</table>

- クォート('か"で囲む)した方がいいケース(値を文字列として扱いたい)
  - '(シングルクォート)はRow文字扱い
  - "(ダブルクォート)はエスケープ文字が有効
  - 真偽値を表す文字列
  - 日付データ(2025-10-25)
  - 先頭に0を含む数値(8進数として扱われる可能性)
  - 値が数値で始まる
  - #を含む(コメントとして扱われる可能性)
  - :を含む

- 複数行の文字列

<pre><code class="example">description: |
  これは複数行の文章です。
  改行もそのまま保持されます。</code></pre>

<pre><code class="example">summary: >
  これは複数行の文章ですが、
  改行はスペースに変換されます。</code></pre>

- &(アンカー)、*(エイリアス)、<<(マージキー)で共通の値を再利用

<pre><code class="example">default: &default_settings
  color: blue
  size: medium

product1:
  <<: *default_settings
  price: 100

product2:
  <<: *default_settings
  price: 150</code></pre>

---

## INI <a id="ini" data-name="INI"></a>

<pre><code class="example">; アプリ設定ファイル
version = 1.2.3

[Database]
host = localhost
port = 3306
user = root
password = secret

[Paths]
data_dir = /var/data
log_dir  = /var/log/app

[User]
name = foo
email = foo@example.com</code></pre>

<table>
    <caption>基本ルール</caption>
    <tr><td>データ</td><td>KEY = valueの形式(実装依存で:(コロン)も可の場合もあり)</td></tr>
    <tr><td>値の区切り</td><td>=</td></tr>
    <tr><td>セクション</td><td>[]で囲まれたセクション毎にグループ化される</td></tr>
    <tr><td>セクションなしキー</td><td>ファイルの最初など、セクション外にキーと値を書ける場合もある<br>[default]セクションとして扱われるなど実装依存</td></tr>
    <tr><td>ホワイトスペース</td><td>無視される</td></tr>
    <tr><td>型</td><td>全て文字列として扱われる</td></tr>
    <tr><td>文字列</td><td>値に空白や記号を含む場合は"(ダブルクォート)か'(シングルクォート)で囲む</td></tr>
    <tr><td>コメント</td><td>#(シャープ)または;(セミコロン)以降がコメント</td></tr>
</table>

- INIファイルは、セクション、キーと値、コメントの3要素で構成される。

---

## .env <a id="env" data-name=".env"></a>
.envファイルは環境変数をファイルで管理するための形式で、環境変数向けで人気の形式。

狭いスコープならファイル名は <span class="code-like">.env</span> でいいが、他のプログラムと競合する場合は <span class="code-like">~/.config/.myapp.env</span> のようにする。

<pre><code class="example"># コメント
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASS=secret
DEBUG=true</code></pre>

<table>
    <caption>基本ルール</caption>
    <tr><th>種類</th><th>内容</th></tr>
    <tr><td>データ</td><td>KEY=valueの形式</td></tr>
    <tr><td>値の区切り</td><td>=</td></tr>
    <tr><td>空行</td><td>無視される</td></tr>
    <tr><td>スペース</td><td>キーやバリュー前後は無視されるが、=(イコール)の前後にはスペースを置かない。</td></tr>
    <tr><td>クォート</td><td>値に空白や特殊文字を含めたい場合は"か'で囲む。</td></tr>
    <tr><td>変数展開</td><td>${OTHER_VAR}形式で他の変数を参照できるツールもある。</td></tr>
    <tr><td>コメント</td><td>#で始まる行は無視。途中の#は文字として扱う。</td></tr>
</table>

<pre><code class="caution"><span class="code-like">KEY = value</span> とせずに <span class="code-like">KEY=value</span> とする。
型情報はないので全て文字列として扱われる(trueも"true")。
.iniのようなセクションはない。
全てのツールで${VAR}が動くとは限らない。</code></pre>

---

## XML <a id="xml" data-name="XML"></a>