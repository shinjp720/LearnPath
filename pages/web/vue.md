---
title: Vue.js
layout: default
---

# Vue.js <a id="top" data-name="TOP"></a>

Vue.js は、画面 (UI) を作るための JavaScript フレームワーク。データが変わると、画面が自動で更新される (リアクティブ) ことが特徴。

| 項目 | このドキュメントでの前提 |
| --- | --- |
| バージョン | Vue 3 |
| API スタイル | Composition API (`<script setup>`) |
| 言語 | TypeScript (サンプルによっては JavaScript) |
| ビルドツール | Vite (`npm create vue@latest` で作成) |

---

## 導入 <a id="introduction" data-name="導入"></a>

### 環境構築

#### nvmのインストール

apt の node は古いことが多いので、今は nvm (Node Version Manager) を使うのが定番。

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

終わったらシェルの再起動。もしくは .bashrc を再読み込み。

```bash
source ~/.bashrc
```

nvm の動作確認。

```bash
nvm --version
```

#### Node.jsのインストール

LTS版を入れる。

```bash
nvm install --lts
```

<pre><code class="tips">誤って apt から入れた場合は、一旦削除してから nvm を入れる。
sudo apt purge nodejs npm -y && sudo apt autoremove -y
</code></pre>

<pre><code class="caution">create-vue や Vite は、新しめの Node.js を要求する。古いバージョンのままだと、プロジェクトの作成や起動でエラーになる。
必要なバージョンは、更新されるため、公式ドキュメントの前提条件を確認する (LTS を入れておけば、通常は問題ない)。</code></pre>

### プロジェクトの作成

```bash
npm create vue@latest
```

実行するとプロジェクトに何の機能を追加するかを選択する。

| 項目 | 説明 | 目安 |
| --- | --- | --- |
| TypeScript | JavaScript に型を付ける | 推奨 |
| JSX Support | JSX (React のように JavaScript の中に HTML っぽく記述する機能) を導入するか | 基本的に No。Vue では .vue に記述していく |
| Router (SPA development) | 画面遷移の機能を最初から入れるか | SPA には必須級 |
| Pinia (state management) | データを複数の画面や部品で共有するための仕組み | 複数の画面でデータを共有するなら Yes |
| Vitest (unit testing) | プログラムの細かい部品が正しく動くかテストするツール | 必要になってから |
| End-to-End Testing | ブラウザを自動で動かして画面全体の動きをテストするツール | 必要になってから |
| Linter (ESLint) | コードの書き間違いや、書き方の問題を検出するリントツール | 推奨 |
| Prettier | コード整形ツール | 推奨 |
| Vue DevTools | 開発中に、コンポーネントの状態を確認できるデバッグツール | 推奨 |

<pre><code class="tips">create-vue のバージョンによって、表示される項目 (Oxlint など) や、選択の方式 (複数選択のリストなど) が変わる。
選択に迷う項目は、外して始めて、必要になってから追加できる。</code></pre>

---

プロジェクト作成後に移動。

```bash
cd my-app
```

通常は依存関係のインストールは自動だが、念のため実行。

```bash
npm install
```

#### 開発サーバーを起動

```bash
npm run dev
```

| コマンド | 動作 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動する (ファイルを保存すると、ブラウザが自動で更新される) |
| `npm run build` | 本番用にビルドする (`dist/` に出力される) |
| `npm run preview` | ビルドした結果を、ローカルで確認する |

### プロジェクトの構成

選んだオプションによって、ディレクトリは変わる。

```text
my-app/
├── index.html          # エントリーとなる HTML (Vite は、ここから始まる)
├── package.json        # 依存関係と、npm run のコマンド
├── vite.config.ts      # Vite の設定
├── public/             # そのまま配信される静的ファイル (fetch で読む JSON など)
└── src/
    ├── main.ts         # アプリの起動処理 (createApp)
    ├── App.vue         # ルートコンポーネント
    ├── components/     # 再利用する部品
    ├── assets/         # CSS や画像
    ├── router/         # Router を選んだ場合
    ├── stores/         # Pinia を選んだ場合
    └── views/          # ページ単位のコンポーネント (Router を選んだ場合)
```

```ts
// src/main.ts: App.vue を、index.html の #app に表示する
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

---

## 基本 <a id="basic" data-name="基本"></a>

### 単一ファイルコンポーネント (SFC)

Vue では、1つの `.vue` ファイルに、コンポーネントの処理 (script)、見た目の構造 (template)、スタイル (style) をまとめて書く。

{% raw %}
```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">押した回数: {{ count }}</button>
</template>

<style scoped>
button { padding: 8px 16px; }
</style>
```
{% endraw %}

| ブロック | 役割 |
| --- | --- |
| `<script setup>` | コンポーネントの処理を書く。トップレベルの変数や import した部品を、そのまま `<template>` で使える |
| `<template>` | 画面の構造 (HTML) を書く |
| `<style scoped>` | スタイルを書く。`scoped` を付けると、このコンポーネントの中だけに適用される |

### マスタッシュ

{% raw %}
```vue
<span>Message: {{ msg }}</span>
```
{% endraw %}

このマスタッシュ(二重波括弧)の中身は、対応するコンポーネントのインスタンスが持つ msg というプロパティの値に置き換えられる。

### JavaScript

Vue のテンプレートでは以下の場所で JavaScript の式を使用することができる(単一の式に限る)。

- テキスト展開の内部(マスタッシュの中)
- 任意の Vueディレクティブ(v- で始まる特殊な属性)の属性値の中身

{% raw %}
```vue
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```
{% endraw %}

式とは、値として評価できるもののこと。`if` や `let` などの「文」や、複数の文は書けない。

{% raw %}
```vue
<!-- NG: 文は使えない -->
{{ var a = 1 }}
{{ if (ok) { return 'YES' } }}

<!-- OK: 条件は三項演算子で書く -->
{{ ok ? 'YES' : 'NO' }}
```
{% endraw %}

### 画面の切り替え方

vue におけるページの遷移の種類には以下のようなものがある。

| 切り替え方法 | URLの変化 | 状態の維持 | 主な使いどころ |
| --- | --- | --- | --- |
| 標準のページ遷移<br>`<a>タグ/window.location` | 変わる | リセットされる | 外部サイトへの移動、<br>Vue管轄外の古いページへの移動 |
| Vue Router による遷移 | 変わる | 維持される | 一般的なSPAのページ遷移（基本はこれ） |
| コンポーネント差し替え<br>v-if / 動的コンポーネント | 変わらない | 維持される | ウィザード形式のフォーム (ステップ1→2)、<br>タブ切り替え |
| モーダル・ドロワー | 変わらない | 維持される | 詳細情報のプレビュー、<br>設定画面のポップアップ |
| Nested Routes (子ルーター) | 変わる | 維持される | ダッシュボード、<br>管理画面のコンテンツ切り替え |

基本的には URL を変更してブラウザの 戻る を効かせたいなら Vue Router。<br>
URL を変えずにその場で進めたいならコンポーネントの差し替えの2軸。

---

## ディレクティブ <a id="directive" data-name="ディレクティブ"></a>

v-で始まるのものをディレクティブといい、HTMLのDOM要素に対して特別な動作をさせるための命令で、技術的にはカスタム属性として扱われる。

```txt
v-on:submit.prevent="onSubmit"
名前 : 引数 . 修飾子 = "値"
```

| 部分 | 例 | 意味 |
| --- | --- | --- |
| 名前 | `v-on` | ディレクティブの種類 |
| 引数 | `submit` | 対象 (イベント名や属性名) |
| 修飾子 | `.prevent` | 動作の追加 |
| 値 | `"onSubmit"` | JavaScript の式 |

### 主なディレクティブ

| ディレクティブ | 用途 |
| --- | --- |
| `v-bind` (`:`) | 属性に、動的な値をバインドする |
| `v-on` (`@`) | イベントを登録する |
| `v-model` | フォームの入力と、データを双方向でバインドする |
| `v-if` / `v-else-if` / `v-else` | 条件によって、要素を描画する |
| `v-show` | 条件によって、要素の表示・非表示を切り替える |
| `v-for` | 配列やオブジェクトを基に、要素を繰り返す |
| `v-html` | HTML の文字列を、そのまま描画する |
| `v-slot` (`#`) | slot に、親から要素を渡す (「slot」の章を参照) |

### 動的引数

ディレクティブの引数を指す部分は各括弧([])で囲んだ式を用いることもできる。

```vue
<a :[attributeName]="url"> ... </a>
<a @[eventName]="doSomething"> ... </a>
```

動的引数は、評価結果が null または 文字列 のいずれかになることが期待される。

### 修飾子

ドット(.)で示される接頭辞で、ディレクティブと何らかの操作を紐づける。

```vue
<form @submit.prevent="onSubmit">...</form>
```

---

### v-bind <a id="v-bind" data-name="v-bind"></a>

動的な値を属性にバインドする。 v-bind で渡された値は JavaScript として解釈してから渡されるため何でも書ける (マスタッシュと同じ) 。

```vue
<div :num="number + 1"></div>

<div :is-ok="ok ? 'YES' : 'NO'"></div>

<div :message="message.split('').reverse().join('')"></div>

<div :id="`list-${id}`"></div>
```

#### 省略記法

v-bind は頻出なので、省略記法がある。

- v-bind:id=""
- :id=""

#### 複数の属性をバインド

次のような複数の属性を持つ JavaScriptオブジェクトがあるとして、

```ts
const objectOfAttrs = {
    id: 'container',
    class: 'wrapper',
    style: 'background-color:green'
}
```

引数なしで v-bind を指定すると、これらの属性を1つの要素にバインドできる。

```vue
<div v-bind="objectOfAttrs"></div>
```

#### クラスとスタイルのバインディング

class と style には複数のプロパティを持てるので、特別な拡張がある。

```vue
<div :class="{ active: isActive }"></div>
```

上記の例は、右の値 isActive の真偽によって active というクラスを持つかどうかが決まる。

```vue
<script setup>
const isActive = ref(true)
const hasError = ref(false)
</script>

<template>
  <div class="static" :class="{ active: isActive, 'text-danger': hasError }"></div>
</template>
```

レンダリングはこうなる。

```html
<div class="static active"></div>
```

配列で、複数のクラスをまとめて指定することもできる。style にはオブジェクトを渡せる。

```vue
<!-- 配列 -->
<div :class="[isActive ? 'active' : '', errorClass]"></div>

<!-- style のオブジェクト (プロパティ名は camelCase でも書ける) -->
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

---

### v-on <a id="v-on" data-name="v-on"></a>

DOMイベントを登録する。

#### 省略記法

v-on には省略記法がある。

- v-on:click=""
- @click=""

#### インラインで呼び出す

{% raw %}
```vue
<p>カウント: {{ count }}</p>
<button @click="count++">＋1</button>
```
{% endraw %}

#### メソッドを呼び出す

```vue
<!-- 引数なし -->
<button @click="sayHello">こんにちは</button>

<!-- 引数あり -->
<button @click="sayMessage('こんにちは！')">メッセージを表示</button>
```

#### event オブジェクトを渡す

```vue
<button @click="handleClick('ボタンが押されました', $event)">詳細を見る</button>
```

引数なしでメソッド名だけを書いた場合は、event オブジェクトが、最初の引数として自動で渡される。

```ts
const handleClick = (event: MouseEvent) => {
  console.log(event.target)
}
```

#### DOMイベント

基本的には全てのDOMイベントに対応している。<br>
以下はよく使うイベント。

| イベント | 発火するタイミング | よくあるユースケース |
| --- | --- | --- |
| click | 要素をクリックした時 | ボタンの実行、リンクの遷移、ポップアップの開閉 |
| dblclick | 要素をダブルクリックした時 | ファイルを開く、テキスト編集モードへの切り替え |
| mouseover | マウスカーソルが要素に乗った時 | ツールチップの表示、ホバーエフェクトの開始 |
| mouseleave | マウスカーソルが要素から外れた時 | ツールチップを隠す、メニューを閉じる |
| keydown | キーを押し下げた時 | ゲームの操作、押しっぱなしの検知 |
| keyup | キーを離した時 | 入力確定、検索文字のリアルタイム反映 |
| input | 値が変更されるたび(1文字打つごと) | 入力文字数のリアルタイムカウント、バリデーション |
| change | 値が変更された時、フォーカスから外れた時 | セレクトボックスの選択切り替え、ファイルの選択 |
| submit | フォームが送信(送信ボタンクリックなど)された時 | データの保存処理、APIへのデータ送信 |
| focus | 要素にフォーカスが当たった時 | 入力欄の背景色を変える、ヘルプメッセージを出す |
| blur | 要素からフォーカスが外れた時 | 入力エラーのチェック(未入力チェックなど) |
| scroll | 要素(または画面)がスクロールされた時 | トップへ戻るボタンの表示、無限スクロール |

#### イベント修飾子

| 修飾子 | 意味 | よくあるユースケース | 例 |
| --- | --- | --- | --- |
| .prevent | デフォルトの動きを止める | フォームの再送信を防ぐ | `@submit.prevent="onSubmit"` |
| .stop | イベントの伝播を止める | 親要素のクリックイベントが発生するのを防ぐ | `@click.stop="onClick"` |
| .once | イベントを1回だけしか発火させない | 初回クリック時のみ処理を行いたい | `@click.once="onClick"` |
| .self | イベントの発生元が、その要素自身のときだけ発火する | モーダルの背景だけのクリックで閉じる | `@click.self="close"` |

#### キー修飾子

特定のキーが押された時の処理。

```vue
<!-- Enterキーが押されたときだけ submit メソッドを実行 -->
<input type="text" @keyup.enter="submit" />

<!-- PageDownキーが押されたときだけ実行 -->
<input type="text" @keyup.page-down="onPageDown" />
```

##### よく使うシステムキー

- .enter
- .tab
- .delete(DeleteとBackspace)
- .esc
- .space
- .up / .down / .left / .right (矢印キー)

#### カスタムイベント

emitにより子から親へ発火を伝えることができる (詳しくは「Props, Emits」の章を参照)。

```vue
<!-- 子コンポーネントが独自に発火させる「close-modal」というイベントをキャッチする -->
<MyModal @close-modal="isOpen = false" />
```

---

### v-model による双方向バインディング <a id="v-model" data-name="v-model"></a>

v-bindとv-onを一緒に使うことで input要素に双方向バインディングを作成できる。

{% raw %}
```vue
<script setup>
  import { ref } from 'vue'

  const text = ref('')

  function onInput(e) {
    text.value = e.target.value
  }
</script>

<template>
  <input :value="text" @input="onInput" placeholder="Type here" />
  <p>{{ text }}</p>
</template>
```
{% endraw %}

この構文を v-model により簡潔に記述できる。

{% raw %}
```vue
<script setup>
  import { ref } from 'vue'

  const text = ref('')
</script>

<template>
  <input v-model="text" placeholder="Type here" />
  <p>{{ text }}</p>
</template>
```
{% endraw %}

#### v-model の修飾子

| 修飾子 | 動作 |
| --- | --- |
| `.lazy` | `input` ではなく、`change` イベント (フォーカスが外れたときなど) で同期する |
| `.number` | 入力値を、数値に変換する |
| `.trim` | 前後の空白を、取り除く |

```vue
<input v-model.trim="name" />
<input v-model.number="age" type="number" />
```

#### 子コンポーネントに対して v-model を使う

自作のコンポーネントに対して v-model を使う場合は defineModel() マクロを使うのが推奨されている (Vue 3.4 以降)。

親コンポーネント側

```vue
<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue' // 子コンポーネントを読み込み

const message = ref('こんにちは')
</script>

<template>
  <!-- 子コンポーネントにv-modelを渡す -->
  <CustomInput v-model="message" />
</template>
```

子コンポーネント側

```vue
<!-- CustomInput.vue -->
<script setup>
// defineModelを呼び出すだけで、親のv-modelと同期する変数（Ref）が作られる
const model = defineModel()
</script>

<template>
  <!-- inputの値をmodelにバインドすれば、親のデータも一緒に更新される -->
  <input v-model="model" />
</template>
```

複数の値をバインドする場合は、`v-model:名前` で、名前を付ける。

```vue
<!-- 親 -->
<UserForm v-model:name="name" v-model:age="age" />

<!-- 子 (UserForm.vue) -->
<script setup>
const name = defineModel('name')
const age = defineModel('age')
</script>
```

#### チェックボックスの実装例

{% raw %}
```vue
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```
{% endraw %}

#### 複数のチェックボックスの実装例

{% raw %}
```vue
const checkedNames = ref([])

<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
<label for="mike">Mike</label>
```
{% endraw %}

#### ラジオボタンの実装例

{% raw %}
```vue
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>
```
{% endraw %}

#### セレクトの実装例

{% raw %}
```vue
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```
{% endraw %}

---

### 条件付きレンダリング <a id="conditional-rendering" data-name="条件付きレンダリング"></a>

#### v-if

```vue
<h1 v-if="awesome">Vue is awesome!</h1>
```

この h1 は awesome の値が truthy である場合にレンダリングされる。<br>
v-if 系でコンポーネントを切り替えると、そのコンポーネントのメモリは破棄されるため、再表示時は再生成される。<br>
値を保持したままにしたい場合は v-show を使う。

#### v-else, v-else-if

他の条件分岐を示すために v-else や v-else-if もある。

```vue
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

```vue
<p v-if="score >= 80">合格 (優)</p>
<p v-else-if="score >= 60">合格</p>
<p v-else>不合格</p>
```

v-if、v-else-if、v-else は、隣り合う要素に書く。複数の要素をまとめて切り替える場合は、描画されない `<template>` で包む。

```vue
<template v-if="ok">
  <h1>タイトル</h1>
  <p>本文</p>
</template>
```

#### v-show

```vue
<h1 v-show="ok">Hello!</h1>
```

v-if と同じく値が truthy であれば描画されるが、 v-show による要素は常にレンダリングされて DOM に残る (CSS の display で切り替わる)。

| | v-if | v-show |
| --- | --- | --- |
| false のとき | 要素が DOM から取り除かれる | DOM に残り、`display: none` になる |
| 状態 (入力値など) | 切り替えるたびに破棄される | 保持される |
| 切り替えのコスト | 高い (作り直す) | 低い (CSS を切り替えるだけ) |
| 初期表示のコスト | 低い (false なら作られない) | 高い (常に作られる) |
| 向いている場面 | めったに切り替わらない、条件が変わらない | 頻繁に切り替える |

<pre><code class="caution">v-if と v-for を、同じ要素に書かない。Vue 3 では v-if の方が優先されるため、v-for のループ変数を v-if の条件で使えない。
絞り込みたい場合は、computed で絞り込んだ配列を作って、v-for に渡す。</code></pre>

---

### リストレンダリング <a id="v-for" data-name="v-for"></a>

v-for ディレクティブを使用すると、配列を基にした要素のリストをレンダリングできる。

{% raw %}
```vue
<ul>
  <li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
</ul>
```
{% endraw %}

#### 配列 + v-for

v-for を配列に使用する場合は以下のように現在の項目のインデックスを指す、2つ目の省略可能なエイリアスもある。

{% raw %}
```vue
<li v-for="(item, index) in items">Message: - {{ index }} - {{ item.message }}</li>
```
{% endraw %}

#### オブジェクト + v-for

オブジェクトの各プロパティを反復処理するのにも使える。

{% raw %}
```vue
const myObject = reactive({ title: 'How to do lists in Vue', author: 'Jane Doe', publishedAt:
'2016-04-10' })

<ul>
  <li v-for="value in myObject">{{ value }}</li>
</ul>
```
{% endraw %}

キーとバリューにアンパッキングすることもできる。

{% raw %}
```vue
<li v-for="(value, key) in myObject">{{ key }}: {{ value }}</li>
```
{% endraw %}

さらにエイリアスを追加するとインデックスも取り出せる。

{% raw %}
```vue
<li v-for="(value, key, index) in myObject">{{ index }}. {{ key }}: {{ value }}</li>
```
{% endraw %}

#### 範囲指定

整数を取り範囲指定もできる。1から始まることに注意。

{% raw %}
```vue
<span v-for="n in 10">{{ n }}</span>
```
{% endraw %}

<pre><code class="tips">v-for で分割代入する場合は、丸括弧 ( ) で囲んで書く必要がある。例: (item, index) in items
また、 in と of はどっちでもいい。</code></pre>

#### :key

<pre><code class="caution">:key 属性が無い状態で v-for の中で動的に値を削除したりすると、インプレースパッチ戦略という仕様のせいでバグが発生する恐れがあるため、:key 属性の指定が推奨とされており、一意の値を :key とする必要がある。</code></pre>

| key の決め方 | 使える場面 |
| --- | --- |
| 一意の ID (`:key="user.id"`) | **基本はこれ**。追加・削除・並び替えがあっても、正しく動く |
| index (`:key="index"`) | 追加・削除・並び替えが発生しない場合だけ |
| 複合キー (`:key="`${user.name}-${user.age}`"`) | ID がなく、組み合わせに重複がない場合 |
| 自分で ID を付与する | ID がないデータで、確実に一意にしたい場合 |

追加・削除・並び替えが発生しない場合は、index を使える。

```vue
<tr v-for="n in 10" :key="n">
```

複合キーは、組み合わせが重複しない場合に使える。

{% raw %}
```vue
<ul>
  <!-- nameとageを組み合わせて「taro-25」のような一意の文字列を作る -->
  <li v-for="user in users" :key="`${user.name}-${user.age}`">
    {{ user.name }} - {{ user.age }}才
  </li>
</ul>
```
{% endraw %}

ID がないデータは、取得したときに、1度だけ ID を付与する。

```ts
const rawData = [
  { name: '田中' },
  { name: '鈴木' },
  { name: '佐藤' }
];

// 画面に表示する用のデータに変換（一意のIDを付与）
const users = rawData.map((item) => ({
  ...item,
  id: crypto.randomUUID() // 一意なIDを作る
}));
```

<pre><code class="caution">ID を付与する処理を、表示のたびに実行される場所 (テンプレートの中や computed など) に書くと、毎回別の ID になり、すべての行が作り直される。
データを取得した直後に、1度だけ付与して、保存しておく。</code></pre>

---

### v-html <a id="v-html" data-name="v-html"></a>

マスタッシュの中ではデータがHTMLではなくプレーンテキストとして扱われるため、本来のHTMLとしたい場合は v-html を使う。

{% raw %}
```vue
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```
{% endraw %}

<pre><code class="caution">v-html には XSS (悪意のあるスクリプトの埋め込み) の危険があるため、ユーザーからの入力には使用しない。</code></pre>

---

## Reactivity API <a id="reactivity-api" data-name="Reactivity API"></a>

Vue は、ref や reactive でラップされた値の変更を検出して、それを使っている画面を自動で更新する。この仕組みを、リアクティブという。

| API | 用途 |
| --- | --- |
| `ref()` | 値 (数値、文字列、オブジェクトなど) を、リアクティブにする |
| `reactive()` | オブジェクトや配列を、リアクティブにする |
| `computed()` | 他の値から算出される値 (キャッシュされる) |
| `watch()` | 値の変化をきっかけに、処理を実行する |
| `watchEffect()` | 処理の中で使った値を自動で追跡して、変わると再実行する |

### ref()

ref() は引数を受け取り、それを .value プロパティを持つ ref オブジェクトにラップして返す。<br>
ref でラップすることにより、 Vue はその値の変更を検出し、それに応じて DOM を更新する。

```ts
import { ref } from 'vue'
const count = ref(0)

count.value++                 // script の中では .value が必要
console.log(count.value)      // 1
```

テンプレートの中では、自動で展開されるため、`.value` は不要。

{% raw %}
```vue
<p>{{ count }}</p>
```
{% endraw %}

### reactive()

reactive() はオブジェクト、もしくは配列をラップして、まとめてリアクティブにするための関数。<br>
最大の特徴はアクセス時に .value が必要かどうかで、 reactive は直接アクセスできる。<br>
基本的には ref() を使うことが推奨されている。

```ts
import { reactive } from 'vue'

const user = reactive({ name: 'Alice', age: 20 })
user.age++   // .value は不要
```

| | ref | reactive |
| --- | --- | --- |
| 扱える値 | どんな値でも | オブジェクトと配列だけ (数値や文字列は不可) |
| script での値の取得 | `.value` が必要 | 直接アクセスできる |
| 変数の再代入 | `.value = 新しい値` で、可能 | 変数ごと置き換えると、リアクティブでなくなる |
| 分割代入 | `.value` を取り出す | 取り出した値が、リアクティブでなくなる |

<pre><code class="caution">reactive のオブジェクトを、分割代入したり、変数ごと置き換えたりすると、リアクティブな接続が切れる。
迷ったら ref を使う。ref なら、配列やオブジェクトも、.value を置き換えるだけでよい。</code></pre>

### computed()

computed関数は、getter関数が渡されることを想定しており、戻り値は算出された値となる。<br>
computed関数に含まれたリアクティブな値が変化したことにより発火し、必ず戻り値を返す必要がある。

computed はリアクティブな依存関係にもとづきキャッシュされており、依存関係が更新されたときのみ再評価されるため、実行コストが下がる。

```ts
import { ref, computed } from 'vue'

const count = ref(1)

// 【書式】 computed(() => { return 加工した値 })
const doubleCount = computed(() => {
  return count.value * 2
})

// 使うときは .value をつける（テンプレート上では doubleCount のままでOK）
console.log(doubleCount.value) // 2
```

<pre><code class="example">const publishedBooksMessage = computed(() => {
    return author.books.length > 0 ? 'Yes' : 'No' 
})</code></pre>

ページネーションで、現在のページに応じた10件だけを切り出す例。

```ts
const allDataList = ref<MyData[]>([])

// 現在のページ番号を ref で保持（1ページ目からスタート）
const currentPage = ref(1)
// ページあたりの表示件数を定数で定義
const ITEMS_PER_PAGE = 10

// 現在のページに応じた10件のみを自動で切り出す computed
const displayedDataList = computed(() => {
  // 例: 1ページ目なら 0, 2ページ目なら 10 が開始位置になる
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE

  // JavaScriptの .slice(開始, 終了) を使って10件だけを切り出す
  return allDataList.value.slice(start, end)
})
```

<pre><code class="caution">computed の中では、値の算出だけを行い、他の値を書き換えたり、API を呼んだりしない (副作用を持たせない)。
そうした処理は、watch やイベントハンドラに書く。</code></pre>

### watch()

watch は直接 ref を監視することができ、count の値が変化するたびにコールバックが発生する。<br>
変更後の値と変更前の値を受け取ることも省略することもできる。

- 基本形
  ```ts
  import { ref, watch } from 'vue'

  const currentPage = ref(1)

  // 【書式】 watch( 監視対象, (新しい値, 古い値) => { 行いたい処理 } )
  watch(currentPage, (newPage, oldPage) => {
    console.log(`ページが ${oldPage} から ${newPage} に変わりました`)
    // ここにAPI通信などの処理を書く（returnは不要）
  })
  ```

- 応用形
  ```ts
  const page = ref(1)
  const keyword = ref('')

  // 配列で渡すと、新旧の値も配列で返ってくる
  watch([page, keyword], ([newPage, newKeyword], [oldPage, oldKeyword]) => {
    console.log('ページかキーワードのどちらかが変わりました')
  })
  ```

<pre><code class="example">import { ref, watch } from 'vue'
const count = ref(0)
watch(count, (newCount) => {
    console.log(`new count is: ${newCount}`)
})</code></pre>

#### オプション

watch の第3引数で、動作を変更できる。

| オプション | 動作 |
| --- | --- |
| `immediate: true` | 登録した直後にも、1回実行する |
| `deep: true` | オブジェクトの内部の変更 (プロパティの追加や、配列の `push`) も検知する |
| `once: true` | 最初の1回だけ実行して、監視をやめる (Vue 3.4 以降) |

```ts
watch(
  () => props.userId,
  (newId) => { fetchUserData(newId) },
  { immediate: true }
)
```

### watchEffect()

処理の中で使ったリアクティブな値を、自動で追跡する。登録した直後に1回実行され、その後は、使った値が変わるたびに再実行される。

```ts
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  // count を使っているので、count が変わるたびに再実行される
  console.log(`count: ${count.value}`)
})
```

### computed・watch・メソッドの使い分け

| 目的 | 使うもの |
| --- | --- |
| 他の値から、表示用の値を作りたい | `computed` (キャッシュされる) |
| 値が変わったとき、API 呼び出しなどの処理をしたい | `watch` |
| ボタンのクリックなど、操作のたびに処理したい | メソッド (関数) |
| 使った値を、自動で追跡して処理したい | `watchEffect` |

---

## ライフサイクルフック <a id="lifecycle-hook" data-name="ライフサイクルフック"></a>

各 Vue コンポーネントインスタンスは、生成時に一連の初期化を行うが、特定のタイミングで独自のコードを追加することができる。

| フック | タイミング | 主な用途 |
| --- | --- | --- |
| `onBeforeMount` | マウントの直前 | |
| `onMounted` | マウント後 (DOM が作られた後) | API からのデータ取得、DOM の操作、外部ライブラリの初期化 |
| `onBeforeUpdate` | データの変更による、DOM の更新の直前 | |
| `onUpdated` | DOM の更新後 | 更新後の DOM の状態を使った処理 |
| `onBeforeUnmount` | アンマウントの直前 | |
| `onUnmounted` | アンマウント後 (コンポーネントが取り除かれた後) | タイマーやイベントリスナーの解除、後片付け |

`<script setup>` の中に直接書いた処理は、コンポーネントの生成時に実行されるため、他のフレームワークの「created」に相当するフックは必要ない。

### onMounted

コンポーネントが最初のレンダリングを終了し、 DOM ノードを生成した後にコードを実行する。

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
    console.log(`コンポーネントがマウントされました。`)
})
</script>
```

データの取得は、`onMounted` の中で行うことが多い。

```ts
const users = ref<User[]>([])

onMounted(async () => {
  const response = await fetch('/users.json')
  users.value = await response.json()
})
```

### onUpdated

リアクティブな値の変更によって、DOM が更新された後に実行される。

```ts
import { onUpdated } from 'vue'

onUpdated(() => {
  console.log('DOM が更新されました')
})
```

<pre><code class="caution">onUpdated の中で、リアクティブな値を書き換えると、再び更新が起きて、無限ループになる。
値の変更への反応は、watch を使う。</code></pre>

### onUnmounted

コンポーネントが画面から取り除かれた後に実行される。タイマーやイベントリスナーなどの後片付けをする。

{% raw %}
```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const seconds = ref(0)
let timerId: number | undefined

onMounted(() => {
  // 1秒ごとにカウントアップ
  timerId = window.setInterval(() => {
    seconds.value++
  }, 1000)
})

onUnmounted(() => {
  // 後片付け (これを忘れると、画面を離れても、タイマーが動き続ける)
  clearInterval(timerId)
})
</script>

<template>
  <p>{{ seconds }} 秒経過</p>
</template>
```
{% endraw %}

---

## TemplateRef <a id="template-ref" data-name="TemplateRef"></a>

TemplateRef は、コンポーネントのテンプレート内でレンダリングされた DOM要素や子コンポーネントのインスタンスに直接アクセスするための機能。

通常 Vueは宣言的なデータバインディングによって DOM 操作を自動化するが、特定のケース (ライブラリの初期化、DOMのフォーカス、アニメーションの制御など)で直接要素を操作したい場合に使用する。

可能な限り DOMは直接操作しないことが推奨されている。

### 使い方

Vue 3.5 以降は、`useTemplateRef()` を使う。引数の文字列を、テンプレートの `ref="..."` と一致させる。

```vue
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const input = useTemplateRef<HTMLInputElement>('input')

onMounted(() => {
  input.value?.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

Vue 3.4 以前は、テンプレートの `ref` の値と**同じ名前の変数**を、`ref()` で宣言する。

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

// 変数名が、テンプレートの ref="input" と一致している必要がある
const input = ref<HTMLInputElement | null>(null)

onMounted(() => {
  input.value?.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

<pre><code class="caution">TemplateRef は、コンポーネントがマウントされるまでは null になる (v-if で非表示のときも null)。
そのため、setup の中で直接使わずに、onMounted の中など、マウント後に使う。`?.` で null の場合に備える。</code></pre>

### 子コンポーネントの場合

子コンポーネントに ref を付けると、子のインスタンスを取得できる。<br>
`<script setup>` のコンポーネントは、既定では内部が非公開なので、子側で `defineExpose` した項目だけ、親から呼べる。

```vue
<!-- 子: MyInput.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const input = useTemplateRef<HTMLInputElement>('input')

const focus = () => input.value?.focus()

// 親から呼べるようにする
defineExpose({ focus })
</script>

<template>
  <input ref="input" />
</template>
```

```vue
<!-- 親 -->
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import MyInput from './MyInput.vue'

const myInput = useTemplateRef<InstanceType<typeof MyInput>>('myInput')

onMounted(() => {
  myInput.value?.focus()
})
</script>

<template>
  <MyInput ref="myInput" />
</template>
```

### 複数の要素をまとめて扱う <a id="grouping" data-name="複数の要素をまとめて扱う"></a>

入力欄が複数あるとき、`ref1`、`ref2` のように変数を連番で増やすと、管理が大変になる。<br>
**1項目を1オブジェクトとして定義**して、共通の処理をループで書くと、すっきりする。

#### 配列でまとめる

```ts
const fields = [
  {
    el: useTemplateRef<HTMLInputElement>("exInput1"),
    model: ref("REF1"),
  },
  {
    el: useTemplateRef<HTMLInputElement>("exInput2"),
    model: ref("REF2"),
  },
  {
    el: useTemplateRef<HTMLInputElement>("exInput3"),
    model: ref("REF3"),
  },
]
```

共通の処理をループで書ける。

```ts
fields.forEach(field => {
  watch(field.model, (value) => {
    if (value === "") {
      field.el.value?.focus()
    }
  })
})
```

#### 名前も残したいなら

配列ではなくオブジェクトでもよい。

```ts
const fields = {
  exInput1: {
    el: useTemplateRef<HTMLInputElement>("exInput1"),
    model: ref("REF1"),
  },
  exInput2: {
    el: useTemplateRef<HTMLInputElement>("exInput2"),
    model: ref("REF2"),
  },
  exInput3: {
    el: useTemplateRef<HTMLInputElement>("exInput3"),
    model: ref("REF3"),
  },
}
```

ループは、値だけなら `Object.values`、キーも欲しいなら `Object.entries` を使う。

```ts
Object.values(fields).forEach(field => {
  watch(field.model, value => {
    if (value === "") {
      field.el.value?.focus()
    }
  })
})
```

```ts
Object.entries(fields).forEach(([name, field]) => {
  console.log(name); // exInput1

  watch(field.model, value => {
    if (value === "") {
      field.el.value?.focus()
    }
  })
})
```

#### 型を付ける

```ts
import { ref, useTemplateRef, type Ref } from 'vue'

type Field = {
  el: ReturnType<typeof useTemplateRef<HTMLInputElement>>
  model: Ref<string>
}

const fields: Record<string, Field> = {
  exInput1: {
    el: useTemplateRef("exInput1"),
    model: ref("REF1"),
  },
  exInput2: {
    el: useTemplateRef("exInput2"),
    model: ref("REF2"),
  },
  exInput3: {
    el: useTemplateRef("exInput3"),
    model: ref("REF3"),
  },
}
```

この設計にしておくと、後から、バリデーションやエラーメッセージも、同じオブジェクトに追加できるので、フォームが大きくなっても管理しやすくなる。

```ts
type Field = {
  el: ReturnType<typeof useTemplateRef<HTMLInputElement>>
  model: Ref<string>
  error: Ref<string | null>
  required: boolean
}
```

「フォームの各入力項目をオブジェクトとして扱う」設計は、Vue でも実務でよく使われるパターン。

#### キーでループする

`useTemplateRef` は、実行時に文字列のキーで要素を探すため、テンプレート側でも、キーを使った動的な ref (`:ref="key"`) にできる。<br>
**オブジェクトのキーと、テンプレートの ref の文字列を一致させる**ことで、テンプレートのループも、スクリプトのループも、まとめられる。

{% raw %}
```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

// 1. 各入力を識別する一意のキー（id）のリスト
const inputKeys = ['exInput1', 'exInput2', 'exInput3'] as const
type InputKey = typeof inputKeys[number]

// 2. テンプレートRefをオブジェクトでまとめて定義
// useTemplateRef は引数の文字列とテンプレートの ref="..." を紐づけます
const inputRefs = {
  exInput1: useTemplateRef<HTMLInputElement>('exInput1'),
  exInput2: useTemplateRef<HTMLInputElement>('exInput2'),
  exInput3: useTemplateRef<HTMLInputElement>('exInput3'),
}

// 3. 値（v-model用）もオブジェクトにまとめる
const formValues = ref<Record<InputKey, string>>({
  exInput1: 'REF1',
  exInput2: 'REF2',
  exInput3: 'REF3',
})

// 4. for ループで一括処理する関数
const clearAllInputs = () => {
  for (const key of inputKeys) {
    // 値をクリア
    formValues.value[key] = ''

    // DOM要素（input）に直接アクセスして操作（例: スタイル変更など）
    const inputElement = inputRefs[key].value
    if (inputElement) {
      inputElement.style.borderColor = 'red'
    }
  }
}
</script>

<template>
  <div style="padding: 20px; display: flex; flex-direction: column; gap: 10px;">
    <!-- 5. テンプレート側もキーを使ってループで回す -->
    <div v-for="key in inputKeys" :key="key">
      <label>{{ key }}: </label>
      <!-- ref に動的な文字列を渡すことで、useTemplateRef と自動で紐づく -->
      <input
        :ref="key"
        v-model="formValues[key]"
        type="text"
      />
    </div>

    <button @click="clearAllInputs">一括操作を実行</button>
  </div>
</template>
```
{% endraw %}

| ポイント | 説明 |
| --- | --- |
| `:ref="key"` の動的バインディング | `key` が `'exInput1'` のときは `ref="exInput1"` として処理される。スクリプト側の `useTemplateRef('exInput1')` に、要素が格納される |
| データのオブジェクト化 (`formValues`) | `v-model` 用の値を `formValues[key]` の形にすると、ループの中で `formValues.value[key] = '新しい値'` のように、一括で書き換えられる |
| 型安全性 (`as const`) | キーを `as const` で固定して `InputKey` 型を作ると、存在しないキーを指定したときに、TypeScript がエラーにしてくれる |

---

## Props, Emits <a id="props-emits" data-name="Props, Emits"></a>

親子コンポーネント間のデータ通信は、「Propsは下り（親→子）」「Emitsは上り（子→親）」というルールで動く。<br>
Vue 3 の標準的な書き方である `<script setup>` で説明する。

| | 向き | イメージ | 親の書き方 | 子の書き方 |
| --- | --- | --- | --- | --- |
| Props | 親 → 子 | 親が子を「設定」する (一方通行) | `:属性名="値"` | `defineProps` |
| Emits | 子 → 親 | 子が親に「合図」を送る | `@イベント名="関数"` | `defineEmits` |

### Props（親から子へデータを渡す）

親が子に「このデータを使ってね」と指示を出す時に使う。

- 子コンポーネント側: defineProps で受け取る名前を宣言する。

{% raw %}
```vue
<!-- Child.vue -->
<script setup>
// 受け取るデータの名前と型を定義
defineProps({
  title: String,
  price: Number
})
</script>

<template>
  <div>
    <h3>{{ title }}</h3>
    <p>価格: {{ price }}円</p>
  </div>
</template>
```
{% endraw %}

- 親コンポーネント側: タグの属性としてデータを渡す。

```vue
<!-- Parent.vue -->
<template>
  <!-- titleとpriceを渡す。動的な値（変数）なら : をつける -->
  <Child title="おいしいリンゴ" :price="150" />
</template>
```

<pre><code class="tips">:price="150" のように : を付けると、"150" は文字列ではなく、JavaScript の式 (数値の 150) として渡される。
: を付けずに price="150" と書くと、文字列の "150" になる。</code></pre>

#### 型で定義する (TypeScript)

TypeScript では、型で props を定義できる。`?` を付けると、省略できる props になる。

```ts
const props = defineProps<{
  title: string
  price?: number
}>()
```

省略したときの値 (既定値) は、`withDefaults` で指定する。

```ts
const props = withDefaults(defineProps<{
  title: string
  price?: number
}>(), {
  price: 0
})
```

Vue 3.5 以降は、props を分割代入して、既定値を書ける (リアクティブは保たれる)。

```ts
const { title, price = 0 } = defineProps<{
  title: string
  price?: number
}>()
```

#### 名前の書き方

| 場所 | 書き方 | 例 |
| --- | --- | --- |
| 子の script (`defineProps`) | camelCase | `userName` |
| 親のテンプレート (属性) | kebab-case が慣習 (camelCase も可) | `:user-name="name"` |

<pre><code class="caution">props は、子から見て読み取り専用。子で props の値を直接書き換えてはいけない (Vue が警告を出す)。
親のデータを変更したいときは、次の emits で親に依頼する。</code></pre>

### Emits（子から親へイベントを通知する）

子が「ボタンが押されたよ！」などの出来事を親に報告する時に使う。

- 子コンポーネント側: defineEmits でイベント名を登録し、実行する。

```vue
<!-- Child.vue -->
<script setup>
const emit = defineEmits(['answer']) // イベント名を登録

const sendOld = () => {
  // 'answer' というイベントを、データと一緒に親へ送る
  emit('answer', '了解しました！')
}
</script>

<template>
  <button @click="sendOld">親に返事をする</button>
</template>
```

- 親コンポーネント側: @イベント名 で子の報告を待ち構える。

```vue
<!-- Parent.vue -->
<script setup>
const handleAnswer = (msg) => {
  alert("子からのメッセージ: " + msg)
}
</script>

<template>
  <!-- 子が answer を実行したら、自分の handleAnswer を動かす -->
  <Child @answer="handleAnswer" />
</template>
```

#### Emits を型で定義する

`defineEmits(['celebrate', 'delete-user'])` のように配列で書くことは、TypeScript の enum そのものではないが、「このコンポーネントが外 (親) に向かって発行できるイベントの一覧 (仕様書)」を定義している、という点で似た役割になる。<br>
登録していないイベント名 (例: `emit('invalid-event')`) を実行しようとすると、Vue がコンソールに警告を出して、ミスを教えてくれる。

TypeScript を使っている場合は、配列ではなく、型 (ジェネリクス) で定義するのが主流。イベント名だけでなく、**一緒に送るデータの型**まで固定できる。

```vue
<script setup lang="ts">
// 配列ではなく、型定義 <{ ... }> を使って定義する
const emit = defineEmits<{
  // イベント名: [送るデータの型]
  celebrate: []                      // データは何も送らない
  'delete-user': []                  // データは何も送らない
  'update-name': [newName: string]   // 文字列データを一緒に送るイベント
}>()

const changeName = () => {
  // OK: 文字列を一緒に送っている
  emit('update-name', '新しい名前')

  // NG: 型が合わないので、TypeScript がエラーにする
  // emit('update-name', 123)
}
</script>
```

| 書き方 | 内容 |
| --- | --- |
| `defineEmits(['a', 'b'])` | イベント名の一覧だけを登録する |
| `defineEmits<{ a: [], b: [value: string] }>()` | イベント名と、送るデータの型を登録する |

### 親子の連携例

`UserCard.vue` (子) と `App.vue` (親) の2つのファイルで、props と emits を使った例を示す。<br>
`defineProps` と `defineEmits` は、マクロ関数なので、import なしでそのまま使える。<br>
(`<style scoped>` は省略している。)

#### 【子】UserCard.vue (データを受け取り、イベントを放つ)

{% raw %}
```vue
<script setup>
// 1. 親から受け取るデータ（props）の定義
defineProps({
  userName: {
    type: String,
    required: true
  },
  userAge: {
    type: Number,
    default: 20
  }
})

// 2. 親へ送るイベント（emits）の定義
const emit = defineEmits(['celebrate', 'delete-user'])

// ボタンが押されたときに実行する関数
const clickCelebrate = () => {
  // 'celebrate' というイベントを親に送る
  emit('celebrate')
}
</script>

<template>
  <div class="card">
    <!-- 親から受け取った props を {{ }} で表示 -->
    <h3>名前: {{ userName }}</h3>
    <p>年齢: {{ userAge }} 歳</p>

    <!-- ボタンクリックで子コンポーネント内の関数を実行 -->
    <button @click="clickCelebrate">🎉 祝う</button>

    <!-- @click の中で直接 emit することも可能 -->
    <button @click="emit('delete-user')">❌ 削除</button>
  </div>
</template>
```
{% endraw %}

#### 【親】App.vue (データを渡し、イベントを受け取る)

親コンポーネントでは、子コンポーネントの属性（:）に対してデータを渡し、子コンポーネントのイベント（@）に対して関数を紐づける。

```vue
<script setup>
import { ref } from 'vue'
// 子コンポーネントをインポート
import UserCard from './UserCard.vue'

// 親が管理しているリアクティブなデータ
const name = ref('山田太郎')
const age = ref(25)

// 子から 'celebrate' イベントが飛んできたときに動く関数
const handleCelebrate = () => {
  age.value += 1 // 年齢を1増やす（データが変わると子側の表示も自動で変わる）
}

// 子から 'delete-user' イベントが飛んできたときに動く関数
const handleDelete = () => {
  alert(`${name.value} さんのデータを削除しました（デモ）`)
}
</script>

<template>
  <div class="parent">
    <h1>親コンポーネント</h1>

    <!--
      :属性名="データ" で props を渡す
      @イベント名="関数" で emits を受け取る
    -->
    <UserCard
      :user-name="name"
      :user-age="age"
      @celebrate="handleCelebrate"
      @delete-user="handleDelete"
    />
  </div>
</template>
```

#### データの流れのまとめ

この例では、v-bind（:）と v-on（@）の知識が、そのまま使われている。

| 向き | 親の書き方 | 子の書き方 |
| --- | --- | --- |
| Props (上から下へのデータ移動) | `:user-name="name"` と、バインドしてデータを流す | `defineProps` で受け取り、テンプレートの {% raw %}`{{ userName }}`{% endraw %} で表示する |
| Emits (下から上へのイベント通知) | `@celebrate="handleCelebrate"` で、キャッチして、自身の関数を実行する | ボタン操作などをきっかけに `emit('celebrate')` で発行する |

<pre><code class="tips">Props と Emits は、「コンポーネントが外に公開しているインターフェース (窓口) の一覧」として捉えると、整理しやすい。
子が受け取るデータは props、子から出ていくイベントは emits、と覚える。</code></pre>

---

## slot <a id="v-slot" data-name="slot"></a>

slot の基本は、子の `<slot />` 部分に親から要素を注入する仕組み。

`<slot>` デフォルト内容 `</slot>`<br>
とすると、親から slot に何も渡されなかった時の内容となる。

| 種類 | 用途 |
| --- | --- |
| 基本形 | 親から渡した要素を、子の1か所に差し込む |
| 名前付き slot | 子の複数の場所に、それぞれ別の要素を差し込む |
| スコープ付き slot | 子が持つデータを、親に渡して、親が表示方法を決める |

### 基本形

子コンポーネント
```vue
<!-- MyCard.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>
```

親コンポーネント
```vue
<MyCard>
  <!-- 画像、見出し、ボタンが混ざったHTMLを丸ごと注入 -->
  <img src="avatar.png" alt="ユーザー">
  <h3>山田 太郎</h3>
  <p>フロントエンドエンジニアです。</p>
  <button>フォロー</button>
</MyCard>
```

### 名前付き slot

子コンポーネント
```vue
<!-- MyDialog.vue -->
<template>
  <div class="dialog">
    <header>
      <slot name="header" />
    </header>

    <main>
      <slot />
    </main>

    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>
```

親コンポーネント
```vue
<template>
  <MyDialog>
    <template #header>
      <h1>タイトル</h1>
    </template>

    本文です

    <template #footer>
      <button>閉じる</button>
    </template>
  </MyDialog>
</template>
```

- 正式には v-slot:header
- #header は省略形
- 名前のない slot は、`default` という名前になり、`<template #default>` と書ける

### スコープ付き slot

子コンポーネント
{% raw %}
```vue
<!-- UserList.vue -->
<script setup>
const users = [
  { id: 1, name: '田中', role: '管理者' },
  { id: 2, name: '佐藤', role: '一般' }
]
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      <!-- userデータを props として親に送る -->
      <slot :user="user">
        {{ user.name }} <!-- バックアップ表示 -->
      </slot>
    </li>
  </ul>
</template>
```
{% endraw %}

親コンポーネント
{% raw %}
```vue
<template>
  <UserList>
    <!-- 子から送られてきたデータを slotProps という名前で受け取る -->
    <template #default="slotProps">
      <strong>{{ slotProps.user.name }}</strong>
      <span>（権限: {{ slotProps.user.role }}）</span>
    </template>
  </UserList>
</template>
```
{% endraw %}

分割代入で、受け取ることもできる。

{% raw %}
```vue
<template #default="{ user }">
  <strong>{{ user.name }}</strong>
</template>
```
{% endraw %}

---

## 実践パターン <a id="practice" data-name="実践パターン"></a>

実際のアプリでよく使う、「親が `fetch` でデータを取得して、props で子に渡し、子が表示する」という構成の例をまとめる。<br>
共通の型は、`src/types.ts` に置く。サンプルでは、`<style scoped>` は省略している。

```ts
// src/types.ts
export interface UserInfo {
  id: number
  name: string
  hobbies: string[]
}

export interface Member {
  id: number
  name: string
  role: string
  status?: string
}

export interface User {
  id: number
  name: string
  email: string
}
```

<pre><code class="tips">fetch は、404 や 500 などの HTTP エラーでは、例外 (エラー) を投げない。
HTTP のエラーも catch で処理したい場合は、response.ok を確認して、自分で例外を投げる。</code></pre>

### JSON を props で渡す

親から子へ JSON データ (オブジェクトや配列) を渡す場合も、文字列や数値と同じ、バインド（:）の仕組みを使う。

#### 【子】UserDetail.vue (JSONデータを受け取る)

子は defineProps で、受け取るデータの型を定義する。

{% raw %}
```vue
<script setup lang="ts">
import type { UserInfo } from './types'

// propsの定義
defineProps<{
  // データの名前: 型を指定
  userData: UserInfo
}>()
</script>

<template>
  <div class="user-profile">
    <!-- オブジェクトの中身を {{ }} で掘り下げて表示 -->
    <p>ID: {{ userData.id }}</p>
    <h2>名前: {{ userData.name }}</h2>

    <h3>趣味:</h3>
    <ul>
      <!-- 配列データなら v-for でループ処理できる -->
      <li v-for="hobby in userData.hobbies" :key="hobby">
        {{ hobby }}
      </li>
    </ul>
  </div>
</template>
```
{% endraw %}

#### 【親】App.vue (JSONデータを取得して子に渡す)

親側では、fetch などを使い、リアクティブな変数（ref）にJSONデータを格納して子にバインドする。

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserDetail from './UserDetail.vue'
import type { UserInfo } from './types'

// 最初は null を入れておき、fetch 後に JSON を格納する
const userJson = ref<UserInfo | null>(null)

onMounted(async () => {
  try {
    // public/user.json などからデータを取得
    const response = await fetch('/user.json')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    userJson.value = await response.json()
  } catch (error) {
    console.error('データ取得失敗:', error)
  }
})
</script>

<template>
  <div>
    <h1>親コンポーネント</h1>

    <!--
      【重要】
      データが fetch されるまでは userJson は null なので、
      v-if="userJson" で「データが空のときは子を作らない」制御をする。
    -->
    <UserDetail
      v-if="userJson"
      :user-data="userJson"
    />

    <p v-else>データを読み込み中...</p>
  </div>
</template>
```

| ポイント | 説明 |
| --- | --- |
| v-if による非同期ガード | JSON を fetch で後から読み込む場合、読み込みが完了する前に子が描画されると、「null の中の id が読めない」というエラー (Cannot read properties of null) になる。親側で `v-if="userJson"` と書き、データが存在するときだけ子を表示させる |
| 参照渡し | オブジェクトや配列を props で渡すと、「参照」が渡される。子で `userData.name = '...'` のように、直接書き換えてはいけない (Vue が警告を出す)。変更したい場合は、emits を使って親に依頼する |

### 配列をテーブルに表示する

あらかじめ HTML で枠組み (テーブルのヘッダーなど) を作っておき、親から渡された JSON の配列を、v-for で行 (`<tr>`) として書き込む。データが0件のときの表示も用意しておく。

#### 【子】DataTable.vue（テーブルの枠を用意してデータを書き込む）

テーブルのヘッダー `<thead>` を固定で作成しておき、データが入るボディ `<tbody>` の部分に v-for を使って流し込む。

{% raw %}
```vue
<script setup lang="ts">
import type { Member } from './types'

// 親からメンバー一覧（配列）を受け取る
defineProps<{
  members: Member[]
}>()
</script>

<template>
  <div class="table-container">
    <table>
      <!-- あらかじめ作成しておく固定のヘッダー -->
      <thead>
        <tr>
          <th>ID</th>
          <th>名前</th>
          <th>役職</th>
          <th>ステータス</th>
        </tr>
      </thead>

      <!-- 枠の中にデータを動的に書き込む -->
      <tbody>
        <!-- データが1件以上ある場合、行（tr）をループさせて書き込む -->
        <tr v-for="member in members" :key="member.id">
          <td>{{ member.id }}</td>
          <td>{{ member.name }}</td>
          <td>{{ member.role }}</td>
          <td>
            <!-- 値に応じてバッジなどの見た目を変えることも可能 -->
            <span class="badge" :class="member.status">{{ member.status }}</span>
          </td>
        </tr>

        <!-- データが空の場合のプレースホルダー行 -->
        <tr v-if="members.length === 0">
          <td colspan="4" class="empty-message">表示するデータがありません。</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```
{% endraw %}

#### 【親】App.vue（データをfetchして子テーブルへ渡す）

親は、空の配列 `[]` で初期化しておく。そうすることで、読み込み中でも、テーブルの枠組み (ヘッダー) だけは、最初から画面に表示される。

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from './DataTable.vue'
import type { Member } from './types'

// 最初は空の配列を入れておく（これでテーブルの枠だけ先に見せられる）
const memberList = ref<Member[]>([])

onMounted(async () => {
  try {
    // public/members.json などから配列データを取得
    const response = await fetch('/members.json')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    memberList.value = await response.json()
  } catch (error) {
    console.error('テーブルデータの取得に失敗:', error)
  }
})
</script>

<template>
  <div class="app-container">
    <h1>チームメンバー一覧</h1>

    <!-- データを子コンポーネントのテーブルに流し込む -->
    <DataTable :members="memberList" />
  </div>
</template>
```

想定している JSON データ (`public/members.json`) の例。

```json
[
  { "id": 1, "name": "山田 太郎", "role": "エンジニア", "status": "active" },
  { "id": 2, "name": "佐藤 美咲", "role": "デザイナー", "status": "active" },
  { "id": 3, "name": "鈴木 一郎", "role": "マネージャー", "status": "offline" }
]
```

| ポイント | 説明 |
| --- | --- |
| 最初からテーブルの枠を見せる | 親で `ref<Member[]>([])` と空の配列で初期化しておくと、v-if でコンポーネントごと非表示にせずに、「ヘッダーだけの空のテーブル」を先に出せる。通信が完了すると、tbody の中身だけが書き換わる |
| `:key="member.id"` | v-for で行を作るときは、Vue が各行を正しく識別して、高速に描画できるように、一意の ID を `:key` にバインドする |
| `ref<Member[]>([])` の型 | 型を付けないと、`ref([])` は、要素の型が `never` になり、TypeScript でエラーになることがある |

### ボタンを押して取得する

ユーザーの操作 (ボタンクリック) をきっかけに、データを取得して、あらかじめ用意したテーブルに、後から書き込む流れ。<br>
ref (空の箱)、emits (親への通知)、props (親から子へのデータ)、async/await が、すべてつながる。

#### 【子】UserTable.vue (枠だけ作り、ボタンで親に通知する)

- 最初に「参照ボタン」を置いておく。ボタンが押されたら、`emit('request-data')` で、親に「データが欲しい」と通知する。
- 親からデータ (`users`) が流れてくるまでは、自動的に「データがありません」の行が表示される。

{% raw %}
```vue
<script setup lang="ts">
import type { User } from './types'

// 1. 親からデータを受け取るためのProps
defineProps<{
  users: User[]
}>()

// 2. 親にイベントを通知するためのEmits
const emit = defineEmits<{
  'request-data': []
}>()
</script>

<template>
  <div class="table-area">
    <!-- ユーザーが押す参照ボタン -->
    <button @click="emit('request-data')" class="load-btn">データを参照する</button>

    <table>
      <!-- あらかじめ描画しておく固定のヘッダー（枠組み） -->
      <thead>
        <tr>
          <th>ID</th>
          <th>名前</th>
          <th>メールアドレス</th>
        </tr>
      </thead>

      <tbody>
        <!-- データが流れてきたら、行（tr）をループして書き込む -->
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>

        <!-- データがまだ空（初期状態）のときに表示する行 -->
        <tr v-if="users.length === 0">
          <td colspan="3" class="empty-text">「データを参照する」ボタンを押してください。</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```
{% endraw %}

#### 【親】App.vue (通知を受け取り、fetchしたデータを子に流す)

- 最初、`userDataList` は `ref<User[]>([])` (空の配列) で宣言して子に渡すため、エラーにならず、空のテーブルが先に描画される。
- 子から通知 (`@request-data`) が来たら、`loadData` (非同期のアロー関数) が実行される。
- `await` で通信が完了した後に、箱の中身 (`.value`) を上書きすると、子コンポーネントのテーブルに、すぐに書き込まれる。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import UserTable from './UserTable.vue'
import type { User } from './types'

// 1. データの「器」を、空の配列で宣言（const）しておく
const userDataList = ref<User[]>([])

// 2. 子からの通知をきっかけに動く非同期のアロー関数
const loadData = async () => {
  try {
    console.log('親：データのリクエストを受け取りました。通信を開始します。')

    // public/users.json などからデータを取得（完了するまで await で待機）
    const response = await fetch('/users.json')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const json = await response.json()

    // 3. 取得完了後、箱の中身（.value）を書き換える
    // → 子コンポーネントへ自動的にデータが流れて、テーブルが更新される
    userDataList.value = json

    console.log('親：データの流し込みが完了しました。')
  } catch (error) {
    console.error('データの取得に失敗しました:', error)
  }
}
</script>

<template>
  <div class="container">
    <h1>マイアプリケーション</h1>

    <!--
      :users で空の箱（またはデータ）を下に流し、
      @request-data で子からのボタンクリック通知を待ち構える
    -->
    <UserTable
      :users="userDataList"
      @request-data="loadData"
    />
  </div>
</template>
```

#### 処理のタイムライン

| 順 | できごと | 内容 |
| --- | --- | --- |
| 1 | 画面表示 (最初) | 親が `ref([])` を子に渡す。子は、「空のテーブル (ヘッダーと案内文のみ)」を、最初に描画する |
| 2 | ユーザーの操作 | ユーザーが「データを参照する」ボタンをクリックする |
| 3 | 子から親への通知 (Emits) | 子が `emit('request-data')` を発行して、親が `loadData` 関数を呼び出す |
| 4 | データの取得 (async/await) | 親の関数内で `await fetch` が動き、通信が終わるまで、その行で待機する (ブラウザは固まらない) |
| 5 | データの流下と書き込み (Props) | 通信が完了すると、親が `userDataList.value` にデータを代入する。Props を通じて子に新しいデータが流れ込み、テーブルの行 `<tr>` が自動で書き換わる |

### 固定行のテーブルとページング

あらかじめ HTML で「10行分の空の行 (枠)」を固定で作っておき、親からデータが届いたら、その枠の中に文字を書き込んでいく。<br>
v-for の「指定した回数 (数値) だけループする」機能と、配列のインデックスを組み合わせる。

#### 【子】FixedTable.vue（10行の固定枠を用意する）

- `v-for="i in 10"` と書くことで、データが何件でも、必ず10行固定でテーブルを描画する。
- `members[i - 1]` で、配列から1つずつデータを取り出してセルに書き込む。データがない行 (後半の行など) は、代わりの文字が表示される。

{% raw %}
```vue
<script setup lang="ts">
import type { Member } from './types'

// 親から最大10件の配列データを受け取る
defineProps<{
  members: Member[]
}>()

const emit = defineEmits<{
  'request-next-page': []
}>()
</script>

<template>
  <div class="table-area">
    <button @click="emit('request-next-page')" class="btn">次の10件を参照</button>

    <table>
      <thead>
        <tr>
          <th>行</th>
          <th>ID</th>
          <th>名前</th>
          <th>役職</th>
        </tr>
      </thead>

      <tbody>
        <!-- データの件数ではなく、必ず「1〜10」の10回ループして行を作る -->
        <tr v-for="i in 10" :key="i">
          <!-- 行番号（1〜10） -->
          <td class="row-num">{{ i }}</td>

          <!--
            配列は0番目から始まるため、i - 1 番目のデータを参照する。
            「members[i - 1]」が存在するときだけ、中身を表示する（オプショナルチェーニング「?.」を使用）
          -->
          <td>{{ members[i - 1]?.id ?? '-' }}</td>
          <td>{{ members[i - 1]?.name ?? '（空席）' }}</td>
          <td>{{ members[i - 1]?.role ?? 'ー' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```
{% endraw %}

コード内で使っている JavaScript の構文。

| 構文 | 説明 |
| --- | --- |
| `members[i - 1]?.name` (オプショナルチェーニング) | データが3件しかないときに、4番目 (`members[3]`) を見に行くと `undefined` になり、通常はエラーになる。`?.` を付けると、エラーにせず、`undefined` を返す |
| `?? '（空席）'` (Null合体演算子) | 左側が `undefined` または `null` のときに、右側の値を使う |

#### 【親】App.vue（10件ずつデータを切り出して子に流す）

親側は全体のデータ (例えば30件) を持っており、ユーザーがボタンを押すたびにページ番号を切り替えて、「次の10件」の配列を子にバインドする。

{% raw %}
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FixedTable from './FixedTable.vue'
import type { Member } from './types'

const PAGE_SIZE = 10

// 全体のデータ（例: 30件分が入る）
const allMembers = ref<Member[]>([])

// 現在表示しているページ（0 が 1 ページ目 ＝ 0〜9件目）
const currentPage = ref(0)

// 子に渡す「現在の10件だけ」を切り出す（computedで自動計算）
// page が 0 なら 0〜9 番目、1 なら 10〜19 番目
const currentMembers = computed(() => {
  const start = currentPage.value * PAGE_SIZE
  return allMembers.value.slice(start, start + PAGE_SIZE)
})

onMounted(async () => {
  try {
    // サーバーから全件データをfetch
    const response = await fetch('/all-members.json')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    allMembers.value = await response.json()
  } catch (error) {
    console.error(error)
  }
})

// 子から「次の10件」の通知が来たらページを進める
const goToNextPage = () => {
  // データの最大件数を超えないように考慮
  if ((currentPage.value + 1) * PAGE_SIZE < allMembers.value.length) {
    currentPage.value++
  } else {
    // 最後のページまで行ったら最初に戻る (デモ)
    currentPage.value = 0
  }
}
</script>

<template>
  <div class="container">
    <h1>10行固定テーブル（ページ: {{ currentPage + 1 }}）</h1>

    <!-- 切り出した「10件ずつのデータ」を子に流し込む -->
    <FixedTable
      :members="currentMembers"
      @request-next-page="goToNextPage"
    />
  </div>
</template>
```
{% endraw %}

#### 全体の動き

| 順 | できごと | 内容 |
| --- | --- | --- |
| 1 | 初期状態 | 親は `allMembers` を空配列で初期化し、子には空配列 (0件) が渡される。子は `v-for="i in 10"` で動くため、データが0件でも、最初から10行の空のテーブル (すべて「-」や「（空席）」の状態) が描画される |
| 2 | データのフェッチ | `onMounted` でデータが届くと、最初の10件が `currentMembers` によって自動で切り出され、子のテーブルの「1〜10行目」に、文字が書き込まれる |
| 3 | 「次の10件」を押したとき | 親の `currentPage` が変わり、`computed` が次の「11〜20番目のデータ」を切り出して、子に流し込む。テーブルの10行の枠はそのままで、中身の文字だけが入れ替わる |

#### なぜ「枠を動かさずに、中身だけ」更新できるのか

1. **DOM の枠 (`<tr>`) が壊れない**: `v-for="i in 10"` によって、テーブルの構造 (10行分の行要素) は、子が画面に表示された時点で固定される。
2. **変わった部分だけを更新する**: 親が `members` を流し込むと、Vue のリアクティブな仕組みが、依存している箇所を検知して、再描画する。Vue は、10行の `<tr>` を作り直すのではなく、変わった部分 (セルの文字) だけを書き換える。
3. **待機処理が不要**: JavaScript で、データの到着を待つ処理を書かなくても、Vue の標準機能 (宣言的レンダリング) だけで、「枠は動かさず、届いたデータで、中身だけを書き込む」挙動になる。

### props の変化を監視する

親から渡された props の値が変化したタイミングで処理を実行したい場合は、Vue 3 の watch (ウォッチャー) を使う。<br>
props を監視する場合は、「アロー関数で props の値を返す (getter 関数形式)」という書き方にするのがポイント。

#### 実装コード例

子コンポーネント側で、親から渡される `userId` という props が変わった瞬間に、API から新しいデータを再取得する (fetch) ケース。

{% raw %}
```vue
<script setup lang="ts">
import { watch } from 'vue'

// 1. propsの定義
const props = defineProps<{
  userId: number
}>()

// 2. props の変化を監視する（watch）
// 第一引数: () => props.対象の変数名 （アロー関数で渡す）
// 第二引数: (新しい値, 古い値) => { 実行したい処理 }
watch(
  () => props.userId,
  async (newId, oldId) => {
    console.log(`userIdが ${oldId} から ${newId} に変わりました！`)

    // 【ここに発火させたい処理を書く】
    // 例: 新しいIDをもとにデータを再取得する関数を動かす
    await fetchUserData(newId)
  }
)

// デモ用の関数
const fetchUserData = async (id: number) => {
  console.log(`ID: ${id} のデータを再取得中...`)
}
</script>

<template>
  <div class="box">
    <p>現在表示中のユーザーID: {{ props.userId }}</p>
  </div>
</template>
```
{% endraw %}

#### なぜ () => props.userId とアロー関数で書くのか？

props は、親から渡されるデータ (リアクティブなオブジェクト) である。<br>
直接 `watch(props.userId, ...)` と書くと、JavaScript は「その瞬間の数値 (例: 1)」を watch に渡してしまう。数値などのただの値 (プリミティブ値) は、後から変わっても Vue が追跡できない。<br>
そこで、「値が必要になったら、このアロー関数を実行して、`props.userId` の最新の値を見に行く」という命令 (getter) の形にして watch に渡す。これにより、Vue は変化を検知できる。

| 書き方 | 結果 |
| --- | --- |
| `watch(props.userId, ...)` | NG。数値がそのまま渡されるため、変化を検知できない (警告が出る) |
| `watch(() => props.userId, ...)` | OK。getter なので、変化を検知できる |
| `watch(props, ...)` | props オブジェクト全体を監視する (オブジェクトの変化を検知する) |

#### 応用：画面が開いた瞬間（最初の1回目）も同時に発火させたい場合

デフォルトの watch は、値が「変化」したときにしか動かない。画面が開いた初期値のタイミングでも同じ処理を動かしたい場合は、第3引数に `{ immediate: true }` を追加する。

```ts
watch(
  () => props.userId,
  (newId) => {
    fetchUserData(newId)
  },
  { immediate: true } // 画面が開いた瞬間（初期化時）も、すぐに実行する
)
```

<pre><code class="tips">配列やオブジェクトを props で受け取り、親が中身を直接変更する場合 (push など) は、watch が反応しないことがある。
その場合は、{ deep: true } を付ける。(親が、配列ごと新しい値に置き換える場合は、deep は不要。)</code></pre>

### データが届くタイミングへの対処

サーバーからデータが届く (props が更新される) タイミングは、ネットワークの速度やサーバーの混雑状況によって、毎回バラバラになる。<br>
子コンポーネント側で、いつ届くか分からない props を扱うには、主に3つの定番のアプローチがある。

#### アプローチ1：待たずに「自動追従」させる（computed）【最推奨】

「データがいつ届くか」を意識して待つコードを書くのではなく、「データが届いたら、自動的に連動して計算する」仕組みを作っておく方法。<br>
computed の中で props を使うだけで、Vue のリアクティブな仕組みが、データの更新を検知して、再計算してくれる。

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { Member } from './types'

const props = defineProps<{
  members: Member[]
}>()

// データの到着を待つ必要はない
// props.members が空から10件に変わった瞬間、この computed が自動で再計算される
const activeMembers = computed(() => {
  return props.members.filter(m => m.status === 'active')
})
</script>
```

#### アプローチ2：届いた瞬間を監視して関数を実行する（watch）

データが届いた「その瞬間」をトリガーにして、別の処理 (ログを仕込む、別の API を呼ぶなど) を実行したい場合は、watch を使う。

```vue
<script setup lang="ts">
import { watch } from 'vue'
import type { Member } from './types'

const props = defineProps<{
  members: Member[]
}>()

// props.members の中身が書き換わった瞬間（＝データが届いた時）に実行される
watch(
  () => props.members,
  (newMembers) => {
    if (newMembers.length > 0) {
      console.log('親からデータが届きました！ここで特別な処理を動かします。')
    }
  }
)
</script>
```

#### アプローチ3：親側で「データが揃うまで子を作らない」（v-if ガード）

子コンポーネント側で「データが届くまで待つ」のが面倒な場合は、親コンポーネントの段階で、データが届くまで、子コンポーネントの描画自体を止めておく方法。<br>
「JSON を props で渡す」の例で使った v-if による制御が、これに当たる。

```vue
<!-- 【親コンポーネントのHTML】 -->
<template>
  <!-- memberList.length が 0 より大きくなる（データが届く）まで、この子コンポーネントは作られない -->
  <FixedTable
    v-if="memberList.length > 0"
    :members="memberList"
  />

  <!-- データが届くまでは、代わりにこれを出して待つ -->
  <p v-else>サーバーからの返答を待っています...</p>
</template>
```

この方法をとると、子コンポーネントが作られた (画面に描画された) 時点では、すでにデータが中に存在している状態になるため、子側で「いつ届くか」を心配する必要が一切なくなる。

#### どれを使うか

| 目的 | 使うもの |
| --- | --- |
| 画面に表示するデータを加工したいだけ | 待つコードは書かず、**computed** に任せる (自動で追従する) |
| データが届いた瞬間に、何か処理を実行したい | **watch** で、到着の瞬間を待ち受ける |
| 初期のバグを、一番安全に防ぎたい | 親側で **v-if** を使って、データが届いてから、子を出現させる |

「10行の固定テーブルの枠を最初から見せておきたい」という目的であれば、特別な処理が必要ない限り、テンプレートに直接 {% raw %}`{{ members[i - 1]?.name }}`{% endraw %} と書いておくだけで、Vue がタイミングを合わせて描画してくれる。<br>
Vue の「データが変われば画面が変わる」という自動追従 (リアクティブ) の恩恵が、ここで生きてくる。

### computed の呼び方

computed で作成した算出プロパティは、基本的には `<template>` の中で呼び出す。<br>
マスタッシュ構文や `:` (属性バインド) の中に、カッコ () を付けずに、そのまま記述する。

親から渡されたデータを、computed で並び替えて、テーブルに書き込む例。

{% raw %}
```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { Member } from './types'

const props = defineProps<{
  members: Member[]
}>()

// 1. computed を定義する（例：IDが小さい順に並び替える処理）
const sortedMembers = computed(() => {
  // props.members が空のときは空配列を返し、データが届いたら自動で並び替える
  // (sort は元の配列を書き換えるため、コピー [...] してから並び替える)
  return [...props.members].sort((a, b) => a.id - b.id)
})
</script>

<template>
  <table>
    <thead>
      <tr><th>行</th><th>ID</th><th>名前</th></tr>
    </thead>
    <tbody>
      <tr v-for="i in 10" :key="i">
        <td>{{ i }}</td>

        <!--
          2. 【ここで呼ぶ】
          定義した「sortedMembers」を、カッコ()を付けずにそのまま使う
        -->
        <td>{{ sortedMembers[i - 1]?.id ?? '-' }}</td>
        <td>{{ sortedMembers[i - 1]?.name ?? '（空席）' }}</td>
      </tr>
    </tbody>
  </table>
</template>
```
{% endraw %}

#### なぜカッコ () を付けないのか？

通常の関数 (メソッド) は、実行するために `myFunction()` のようにカッコが必要。<br>
一方、computed は、「最新の結果が常に入っている変数 (定数)」のように扱えるように、Vue が自動で変換している。そのため、HTML 側では、ただの変数 (ref などと同じ感覚) として、名前を書くだけで呼び出せる。

#### 応用：`<script setup>`（JS側）の中で呼び出す場合

HTML 側ではなく、JavaScript の処理の中で computed の結果を使いたい場合は、ref の時と同じように `.value` を付けて呼び出す。

```ts
// JS側で computed の結果をログに出したり、別の計算に使いたいとき
console.log(sortedMembers.value) // 「.value」をつける
```

| 場所 | 書き方 |
| --- | --- |
| `<template>` (HTML) で呼ぶとき | {% raw %}`{{ sortedMembers }}`{% endraw %} のように、カッコなしでそのまま書く |
| `<script setup>` (JS) で呼ぶとき | `sortedMembers.value` のように、`.value` をつける |

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| script で、値が更新されない・比較が合わない | ref の `.value` を付け忘れている | script の中では `count.value` と書く (テンプレートでは不要) |
| 値を変えても、画面が更新されない | reactive のオブジェクトを、分割代入したり、変数ごと置き換えたりした | `ref` を使う。`reactive` は、プロパティを書き換える |
| `Cannot read properties of null` | データが届く前に、`null` の中身を読もうとした | `v-if` で描画を止める。または `?.` と `??` を使う |
| 行を削除したら、表示がずれる | `v-for` に `:key` がない (または index を使っている) | 一意の ID を `:key` にする |
| `Set operation on key ... failed: target is readonly` の警告 | 子で、props を書き換えようとした | `emit` で親に依頼する。子で変更したいなら、`ref` にコピーして使う |
| `v-if` と `v-for` を同じ要素に書いたら、動かない | Vue 3 では `v-if` が優先され、ループ変数を使えない | `computed` で絞り込んだ配列を、`v-for` に渡す |
| TemplateRef が `null` | マウント前に使っている (または `v-if` で非表示) | `onMounted` の後に使う。`?.` で `null` に備える |
| `watch(props.userId, ...)` が動かない | 値そのものが渡されて、追跡できない | `watch(() => props.userId, ...)` と、アロー関数で渡す |
| 配列に `push` しても、watch が動かない | 配列の内部の変更は、既定では検知されない | `{ deep: true }` を付ける。または、配列ごと置き換える |
| `onUpdated` で画面が固まる | `onUpdated` の中で、リアクティブな値を書き換えて、無限ループになった | 値の変更への反応は、`watch` を使う |
| HTTP の 404 や 500 が、catch されない | `fetch` は、HTTP のエラーでは、例外を投げない | `response.ok` を確認して、自分で例外を投げる |
| `v-html` にユーザーの入力を渡して、スクリプトが実行された | XSS (悪意のあるスクリプトの埋め込み) | ユーザーの入力には、`v-html` を使わない。マスタッシュ ({% raw %}`{{ }}`{% endraw %}) で表示する |
