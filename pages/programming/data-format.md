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
    <tr><td>キー</td><td>必ず"(ダブルクォート)で囲んだ文字列にする(シングルクォートやクォートなしは不可)</td></tr>
    <tr><td>値の区切り</td><td>キーと値の間は:(コロン)、ペア同士・配列の要素同士は,(カンマ)で区切る(末尾のカンマは不可)</td></tr>
    <tr><td>配列</td><td>[]で囲んで,(カンマ)で区切る</td></tr>
    <tr><td>要素</td><td>オブジェクト、配列、文字列、数値、真偽値、nullのいずれか</td></tr>
    <tr><td>ホワイトスペース</td><td>トークンの間にある空白・改行・タブは無視される</td></tr>
    <tr><td>コメント</td><td>JSONではコメントは書けない(JSONCやJSON5などの拡張仕様では書ける)</td></tr>
</table>

<table>
    <caption>JSONの要素は次のいずれか</caption>
    <tr><th>名前</th><th>書き方</th><th>説明</th></tr>
    <tr><td>object</td><td>{}</td><td>{}で囲まれた中にキーと値のペア<br>それぞれのペアは:で区切る</td></tr>
    <tr><td>array</td><td>[]</td><td>[]で囲まれた中に値のリストを並べる<br>要素同士は,で区切る</td></tr>
    <tr><td>string</td><td>""</td><td>""で囲まれた文字列</td></tr>
    <tr><td>number</td><td>123</td><td>数値(10進数のみ)<br>小数・指数表記は可(例: -1.5e3)<br>先頭の不要な0(012)、+記号、16進数、NaN、Infinityは不可</td></tr>
    <tr><td>true</td><td>true</td><td>真を表す(全て小文字、クォートなし)</td></tr>
    <tr><td>false</td><td>false</td><td>偽を表す(全て小文字、クォートなし)</td></tr>
    <tr><td>null</td><td>null</td><td>空を表す(全て小文字、クォートなし)</td></tr>
</table>

- 仕様(RFC 8259)上は一番外側にどの値(文字列や数値など)を置いてもよいが、古い仕様(RFC 4627)ではobjectかarrayのみだった。互換性のため、通常は一番外側をobjectかarrayにする。
- true, false, nullは小文字で、クォートなしで書く(<span class="code-like">"true"</span> と書くと真偽値ではなく文字列になる)。
- 同じオブジェクト内でキーは重複させない(重複時の挙動はパーサ依存で、多くは最後の値が有効)。
- 文字列の中に改行などの制御文字を直接書くことはできない。<span class="code-like">\n</span> などのエスケープを使う。
- 日付型はない。ISO 8601形式の文字列(例: <span class="code-like">"2025-10-25T09:30:00+09:00"</span>)で表すのが一般的。

<pre><code class="example">{
  "fruits": ["Apple", "Orange", "Banana"],
  "numbers": [1, 2, 3, 4, 5]
}</code></pre>

次のJSONは不正(パースエラーになる)。

<pre><code class="caution">{
  'name': "John",
  age: 30,
  "tags": ["a", "b",],
}</code></pre>

- <span class="code-like">'name'</span> : キーがシングルクォート
- <span class="code-like">age</span> : キーにクォートがない
- <span class="code-like">["a", "b",]</span> と最後の <span class="code-like">,</span> : 末尾のカンマ

<table>
    <caption>文字列中で有効なエスケープ文字</caption>
    <tr><th>記号</th><th>意味</th></tr>
    <tr><td>\"</td><td>ダブルクォート</td></tr>
    <tr><td>\\</td><td>バックスラッシュ</td></tr>
    <tr><td>\/</td><td>スラッシュ</td></tr>
    <tr><td>\b</td><td>バックスペース</td></tr>
    <tr><td>\f</td><td>フォームフィード</td></tr>
    <tr><td>\n</td><td>改行</td></tr>
    <tr><td>\r</td><td>キャリッジリターン(復帰)</td></tr>
    <tr><td>\t</td><td>タブ</td></tr>
    <tr><td>\uXXXX</td><td>4桁の16進数で表すUnicode(UTF-16のコードユニット)<br>BMP外の文字は \uD83D\uDE00 のようにサロゲートペアで書く</td></tr>
</table>

- 上記以外のエスケープ(<span class="code-like">\'</span> など)は無効。

---

## YAML <a id="yaml" data-name="YAML"></a>
YAML 1.2はJSONのほぼスーパーセットであり、ほとんどのJSONは有効なYAMLとして読める。YAML -> JSONへの変換も多くの場合可能だが、コメントは失われ、アンカーとエイリアスは展開される。

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
    <tr><td>配列</td><td>- (ハイフンとスペース)で表す<br>JSONのような [1, 2, 3] のフロー形式も可</td></tr>
    <tr><td>マッピング</td><td>インデントで表す<br>JSONのような {a: 1, b: 2} のフロー形式も可</td></tr>
    <tr><td>階層</td><td>スペースによるインデントで表す(幅は揃っていれば何個でもよいが、2個が一般的。TABは禁止)</td></tr>
    <tr><td>真偽値、null</td><td>true, false, null(~もnull)<br>YAML 1.1のパーサではyes, no, on, offも真偽値になる(YAML 1.2では文字列)</td></tr>
    <tr><td>コメント</td><td>#でコメント(行頭のほか、行の途中にも書けるが、#の直前に空白が必要)</td></tr>
    <tr><td>ドキュメント区切り</td><td>---で区切ると1つのファイルに複数のドキュメントを書ける(終端は ...)</td></tr>
</table>

- クォート('か"で囲む)した方がいいケース(値を文字列として扱いたい)
  - '(シングルクォート)はRaw文字扱い(エスケープは無効。'自体は''と重ねて書く)
  - "(ダブルクォート)はエスケープ文字(\nなど)が有効
  - 真偽値やnullに見える文字列(yes, no, on, off, nullなど)。国コードのNO(ノルウェー)がfalseになる問題が有名
  - 日付データ(2025-10-25はタイムスタンプとして解釈されるパーサがある)
  - 先頭に0を含む数値(YAML 1.1では8進数として扱われる可能性)
  - 数値として解釈される文字列(バージョン <span class="code-like">1.10</span> が数値の <span class="code-like">1.1</span> になるなど)
  - ' #'(空白+#)を含む(コメントとして扱われる)
  - ': '(コロン+スペース)を含む、または末尾が:
  - 先頭が * & ! % @ ` [ { などの特殊文字

- 複数行の文字列

<pre><code class="example">description: |
  これは複数行の文章です。
  改行もそのまま保持されます。</code></pre>

<pre><code class="example">summary: >
  これは複数行の文章ですが、
  改行はスペースに変換されます。</code></pre>

- <span class="code-like">|-</span> や <span class="code-like">&gt;-</span> のように - を付けると、末尾の改行が除去される。

- &(アンカー)、*(エイリアス)、&lt;&lt;(マージキー)で共通の値を再利用

<pre><code class="example">default: &default_settings
  color: blue
  size: medium

product1:
  &lt;&lt;: *default_settings
  price: 100

product2:
  &lt;&lt;: *default_settings
  price: 150</code></pre>

- マージキー(<span class="code-like">&lt;&lt;</span>)はYAML 1.1由来の拡張で、YAML 1.2の仕様には含まれないが、多くのパーサが対応している。

---

## INI <a id="ini" data-name="INI"></a>
INIには厳密な標準仕様がなく、細かい挙動(コメントの書き方、クォート、セクション外のキーなど)は実装によって異なる。

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
    <tr><th>種類</th><th>内容</th></tr>
    <tr><td>データ</td><td>KEY = valueの形式(実装依存で:(コロン)も可の場合もあり)</td></tr>
    <tr><td>値の区切り</td><td>=</td></tr>
    <tr><td>セクション</td><td>[]で囲まれたセクション毎にグループ化される</td></tr>
    <tr><td>セクションなしキー</td><td>ファイルの最初など、セクション外にキーと値を書ける場合もある<br>[default]セクションとして扱われるなど実装依存</td></tr>
    <tr><td>ホワイトスペース</td><td>キーや値の前後の空白は無視されるのが一般的(実装依存)</td></tr>
    <tr><td>型</td><td>全て文字列として扱われる(数値などへの変換は読み込み側で行う)</td></tr>
    <tr><td>文字列</td><td>値に空白や記号を含む場合は"(ダブルクォート)か'(シングルクォート)で囲む実装が多い(実装依存)</td></tr>
    <tr><td>コメント</td><td>行頭の#(シャープ)または;(セミコロン)以降がコメント<br>行の途中のコメントに対応するかは実装依存</td></tr>
</table>

- INIファイルは、セクション、キーと値、コメントの3要素で構成される。
- 階層はセクションの1段のみ。入れ子にしたい場合は <span class="code-like">[a.b]</span> のようにセクション名に.を使うなど、実装ごとの工夫が必要。

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
    <tr><td>スペース</td><td>=(イコール)の前後にはスペースを置かない(ツールによっては許容されるが、動作が不定になるため避ける)</td></tr>
    <tr><td>クォート</td><td>値に空白や特殊文字を含めたい場合は"か'で囲む。<br>ツールによっては、"の中では \n などのエスケープや変数展開が有効で、'の中では全てそのままの文字として扱われる。</td></tr>
    <tr><td>変数展開</td><td>${OTHER_VAR}形式で他の変数を参照できるツールもある。</td></tr>
    <tr><td>export</td><td>行頭に <span class="code-like">export </span> を付けて書ける(シェルのsourceと共用できる)ツールもある。</td></tr>
    <tr><td>コメント</td><td>#で始まる行は無視。<br>行の途中の#は、クォートされていない値では空白の直前にある場合にコメントとして扱うツールが多い(実装依存)。</td></tr>
</table>

<pre><code class="caution"><span class="code-like">KEY = value</span> とせずに <span class="code-like">KEY=value</span> とする。
型情報はないので全て文字列として扱われる(trueも"true")。
.iniのようなセクションはない。
全てのツールで${VAR}が動くとは限らない。
パスワードなどの秘密情報を含むため、.envはGitにコミットしない(.gitignoreに追加する)。
代わりに、キーだけを書いた .env.example をコミットしておくと便利。</code></pre>

---

## XML <a id="xml" data-name="XML"></a>
XML(Extensible Markup Language)はタグで構造化してデータを表す形式。設定ファイル(Mavenのpom.xmlなど)、データ交換(SOAP、RSS/Atom)、SVG、Office文書(.docxなどの内部)などで使われる。人間にも機械にも読めるが、JSONに比べると冗長。

XML文書の最初にバージョンやエンコーディングを指定するXML宣言を置くことが推奨される。宣言は省略できるが、置く場合は文書の先頭(前に空白や改行も置かない)に書く。エンコーディングを省略した場合はUTF-8として扱われる。

<pre><code class="example">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;person&gt;
    &lt;name&gt;John Doe&lt;/name&gt;
    &lt;age&gt;30&lt;/age&gt;
    &lt;married&gt;true&lt;/married&gt;
&lt;/person&gt;</code></pre>

<table>
    <caption>基本ルール(整形式の条件)</caption>
    <tr><th>種類</th><th>内容</th></tr>
    <tr><td>要素</td><td>開始タグ <span class="code-like">&lt;element&gt;</span> と終了タグ <span class="code-like">&lt;/element&gt;</span> で囲む。終了タグは省略できない(HTMLとの違い)</td></tr>
    <tr><td>ルート要素</td><td>文書には必ず1つのルート要素(最外の要素)が存在する</td></tr>
    <tr><td>入れ子</td><td>正しく入れ子にする(<span class="code-like">&lt;a&gt;&lt;b&gt;&lt;/a&gt;&lt;/b&gt;</span> のような交差は不可)</td></tr>
    <tr><td>大文字小文字</td><td>タグ名や属性名は区別する(<span class="code-like">&lt;Name&gt;</span> と <span class="code-like">&lt;name&gt;</span> は別の要素)</td></tr>
    <tr><td>属性</td><td>開始タグ内に <span class="code-like">name="value"</span> の形で書く。値は"(ダブルクォート)か'(シングルクォート)で必ず囲む。同じ要素内で属性名は重複できない</td></tr>
    <tr><td>空要素</td><td>内容のない要素は <span class="code-like">&lt;person id="123" /&gt;</span> のように自己終了タグで書ける</td></tr>
    <tr><td>空白</td><td>テキスト中の空白や改行は文書上は保持される(無視するかは読み込む側の実装次第)</td></tr>
    <tr><td>型</td><td>全て文字列として扱われる(型はXSDなどのスキーマで与える)</td></tr>
    <tr><td>コメント</td><td><span class="code-like">&lt;!-- --&gt;</span> で囲む。コメント中に -- を含めることはできない</td></tr>
</table>

<table>
    <caption>タグ名・属性名のルール</caption>
    <tr><th>種類</th><th>内容</th></tr>
    <tr><td>使える文字</td><td>先頭は文字か_、以降は文字・数字・-・_・. が使える。空白は不可。日本語の名前も使える</td></tr>
    <tr><td>:(コロン)</td><td>名前空間のプレフィックス用に使われるため、通常の名前には使わない</td></tr>
    <tr><td>予約</td><td>xml(大文字小文字を問わない)で始まる名前は予約されている</td></tr>
</table>

要素には属性を持たせることができ、属性は開始タグ内でキーと値のペアで書く。

<pre><code class="example">&lt;person id="123" nationality="American"&gt;
    &lt;name&gt;John Doe&lt;/name&gt;
    &lt;age&gt;30&lt;/age&gt;
    &lt;married&gt;true&lt;/married&gt;
&lt;/person&gt;</code></pre>

要素はネストすることができ、階層構造を持たせることができ、データの関連性を明示的にできる。

<pre><code class="example">&lt;family&gt;
    &lt;parent&gt;
        &lt;name&gt;John Doe&lt;/name&gt;
        &lt;age&gt;30&lt;/age&gt;
    &lt;/parent&gt;
    &lt;children&gt;
        &lt;child&gt;
            &lt;name&gt;Jane Doe&lt;/name&gt;
            &lt;age&gt;10&lt;/age&gt;
        &lt;/child&gt;
        &lt;child&gt;
            &lt;name&gt;Jack Doe&lt;/name&gt;
            &lt;age&gt;7&lt;/age&gt;
        &lt;/child&gt;
    &lt;/children&gt;
&lt;/family&gt;</code></pre>

内容のない要素は、終了タグを省略して開始タグの末尾に/(スラッシュ)を置くことで空要素として表現できる。次の2つは同じ意味。

<pre><code class="example">&lt;person id="123" /&gt;
&lt;person id="123"&gt;&lt;/person&gt;</code></pre>

データを属性として表現するか要素として表現するかは設計次第。一般的には次のように使い分ける。

- 属性: IDや種別、単位などの単純なメタ情報(値は1つだけ、入れ子にできない、順序は保証されない)
- 要素: 複数回現れるデータ、構造を持つデータ、長い文章(順序が保持される)

<pre><code class="example">&lt;price currency="JPY"&gt;1200&lt;/price&gt;</code></pre>

テキストや属性値の中に特殊文字をそのまま書けない場合は、エンティティ参照を使う。XMLで定義済みのエンティティは次の5つ。

<table>
    <caption>定義済みエンティティ</caption>
    <tr><th>文字</th><th>書き方</th><th>備考</th></tr>
    <tr><td>&lt;</td><td>&amp;lt;</td><td>テキスト中では必ずエスケープする</td></tr>
    <tr><td>&gt;</td><td>&amp;gt;</td><td>テキスト中では省略可(ただし ]]&gt; は書けない)</td></tr>
    <tr><td>&amp;</td><td>&amp;amp;</td><td>テキスト中では必ずエスケープする</td></tr>
    <tr><td>"</td><td>&amp;quot;</td><td>"で囲んだ属性値の中ではエスケープする</td></tr>
    <tr><td>'</td><td>&amp;apos;</td><td>'で囲んだ属性値の中ではエスケープする</td></tr>
</table>

<pre><code class="example">&lt;message&gt;1 &amp;lt; 2 &amp;amp;&amp;amp; 3 &amp;gt; 2&lt;/message&gt;</code></pre>

- 文字参照で文字コードを直接指定することもできる。10進数は <span class="code-like">&amp;#12354;</span>、16進数は <span class="code-like">&amp;#x3042;</span> で、どちらも「あ」を表す。

特殊文字や他のマークアップを含むテキストをそのまま扱いたい場合、CDATAセクションを使用する。CDATAセクション内のデータはパースされない。

<pre><code class="example">&lt;script&gt;
    &lt;![CDATA[
    if (age &lt; 18) {
        alert("Underage");
    }
    ]]&gt;
&lt;/script&gt;</code></pre>

- CDATAセクションの中には <span class="code-like">]]&gt;</span> を書けない。
- CDATAセクションはテキスト内容にだけ使える。属性値の中では使えない。

名前空間(namespace)を使うと、異なる語彙の要素名が衝突するのを避けられる。<span class="code-like">xmlns</span> 属性で宣言する。

<pre><code class="example">&lt;root xmlns="http://example.com/default" xmlns:ex="http://example.com/ext"&gt;
    &lt;item&gt;デフォルト名前空間の要素&lt;/item&gt;
    &lt;ex:item&gt;exプレフィックスの名前空間の要素&lt;/ex:item&gt;
&lt;/root&gt;</code></pre>

- 名前空間のURIは識別のための文字列で、そのURLに実際にアクセスされるとは限らない。

<table>
    <caption>その他の構文</caption>
    <tr><th>名前</th><th>書き方</th><th>説明</th></tr>
    <tr><td>処理命令</td><td><span class="code-like">&lt;?target data?&gt;</span></td><td>アプリケーションへの指示(例: <span class="code-like">&lt;?xml-stylesheet type="text/xsl" href="style.xsl"?&gt;</span>)</td></tr>
    <tr><td>DOCTYPE宣言</td><td><span class="code-like">&lt;!DOCTYPE root ...&gt;</span></td><td>DTDの指定や内部定義に使う</td></tr>
</table>

整形式(well-formed)と妥当(valid)は別の概念。構文ルールを守っていれば整形式で、さらにスキーマの定義に従っていれば妥当となる。

<table>
    <caption>XMLに関連する主な技術</caption>
    <tr><th>名前</th><th>内容</th></tr>
    <tr><td>DTD</td><td>要素や属性の構造を定義する古いスキーマ言語(XML自体の構文を使わない)</td></tr>
    <tr><td>XSD(XML Schema)</td><td>XMLで書くスキーマ言語。データ型(整数、日付など)も定義できる</td></tr>
    <tr><td>XPath</td><td>ノードを指定するためのパス式(例: <span class="code-like">/family/children/child[1]/name</span>)</td></tr>
    <tr><td>XSLT</td><td>XMLを別のXMLやHTMLに変換するための言語</td></tr>
</table>

<table>
    <caption>パース方式</caption>
    <tr><th>名前</th><th>内容</th></tr>
    <tr><td>DOM</td><td>文書全体をメモリ上のツリーとして読み込む。操作しやすいが大きな文書ではメモリを使う</td></tr>
    <tr><td>SAX</td><td>先頭から読み進め、タグを見つけるたびにイベントで通知する(プッシュ型)。省メモリだが扱いは複雑</td></tr>
    <tr><td>StAX/プル型</td><td>呼び出し側が必要なときに次のイベントを取り出す。省メモリで制御しやすい</td></tr>
</table>

<pre><code class="caution">外部から受け取ったXMLをパースするときは、外部エンティティ(XXE攻撃の原因になる)やDTDの処理を無効にする。
多くのパーサではデフォルトで無効でない場合があるので、利用するライブラリの設定を確認する。</code></pre>

---

## フォーマットの比較 <a id="compare" data-name="比較"></a>

<table>
    <caption>各フォーマットの比較</caption>
    <tr><th></th><th>JSON</th><th>YAML</th><th>INI</th><th>.env</th><th>XML</th></tr>
    <tr><td>コメント</td><td>×</td><td>○(#)</td><td>○(; #)</td><td>○(#)</td><td>○(&lt;!-- --&gt;)</td></tr>
    <tr><td>階層構造</td><td>○</td><td>○</td><td>△(セクションの1段のみ)</td><td>×</td><td>○</td></tr>
    <tr><td>配列</td><td>○</td><td>○</td><td>×(実装依存)</td><td>×</td><td>○(同名要素の繰り返し)</td></tr>
    <tr><td>型</td><td>文字列、数値、真偽値、null</td><td>解釈により決まる(暗黙の型変換に注意)</td><td>全て文字列</td><td>全て文字列</td><td>全て文字列(型はスキーマで与える)</td></tr>
    <tr><td>主な用途</td><td>Web API、データ交換、設定</td><td>設定ファイル(CI、Kubernetesなど)</td><td>簡単な設定ファイル</td><td>環境変数の管理</td><td>文書、データ交換、設定</td></tr>
</table>
