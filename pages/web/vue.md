---
title: Vue.js
layout: default
---

# Vue.js <a id="top" data-name="TOP"></a>

## 導入 <a id="introduction" data-name="導入"></a>

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

#### プロジェクトの作成

```bash
npm create vue@latest
```

実行するとプロジェクトに何の機能を追加するかを選択する。

- JSX Support

  JSX (React のように JavaScript の中に HTML っぽく記述する機能) を導入するか。<br>
  基本的に No 。Vue では .vue に記述していく。

- Router (SPA development)

  画面遷移の機能を最初から入れるか。<br>
  SPA には必須級。

- Pinia (state management)

  データを複数の画面や部品で共有するための仕組み。

- Vitest (unit testing)

  ブログラムの細かい部品が正しく動くかテストするツール。

- End-to-End Testing

  ブラウザを自動で動かして画面全体の動きをテストするツール。

- Linter (error prevention)

  リントツール。

- Prettier (code formatting)

  コード整形ツール。

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

---

## 基本 <a id="basic" data-name="基本"></a>

### マスタッシュ

{% raw %}
```javascript
<span>Message: {{ msg }}</span>
```
{% endraw %}

このマスタッシュ(二重波括弧)の中身は、対応するコンポーネントのインスタンスが持つ msg というプロパティの値に置き換えられる。

### JavaScript

Vue のテンプレートでは以下の場所で JavaScript の式を使用することができる(単一の式に限る)。

- テキスト展開の内部(マスタッシュの中)
- 任意の Vueディレクティブ(v- で始まる特殊な属性)の属性値の中身

{% raw %}
```javascript
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```
{% endraw %}

---

## ディレクティブ <a id="directive" data-name="ディレクティブ"></a>

v-で始まるのものをディレクティブといい、HTMLのDOM要素に対して特別な動作をさせるための命令で、技術的にはカスタム属性として扱われる。

```txt
v-on:submit.prevent="onSubmit"
名前 : 引数 . 修飾子 = "値"
```

### 動的引数

ディレクティブの引数を指す部分は各括弧([])で囲んだ式を用いることもできる。

```javascript
<a :[attributeName]="url"> ... </a>
<a @[eventName]="doSomething"> ... </a>
```

動的引数は、評価結果が null または 文字列 のいずれかになることが期待される。

### 修飾子

ドット(.)で示される接頭辞で、ディレクティブと何らかの操作を紐づける。

```javascript
<form @submit.prevent="onSubmit">...</form>
```

---

### v-bind <a id="v-bind" data-name="v-bind"></a>

動的な値を属性にバインドする。 v-bind で渡された値は JavaScript として解釈してから渡されるため何でも書ける (マスタッシュと同じ) 。

{% raw %}
```javascript
<div :num="number + 1"></div>

<div :isOk:="ok ? 'YES' : 'NO'"></div>

<div :message="message.split('').reverse().join('')"></div>

<div :id="`list-${id}`"></div>
```
{% endraw %}


#### 省略記法

v-bind は頻出なので、省略記法がある。

- v-bind:id=""
- :id=""

#### 複数の属性をバインド

次のような複数の属性を持つ JavaScriptオブジェクトがあるとして、

```javascript
const objectOfAttrs = {
    id: 'container',
    class: 'wrapper',
    style: 'background-color:green'
}
```

引数なしで v-bind を指定すると、これらの属性を1つの要素にバインドできる。

```javascript
<div v-bind="objectOfAttrs"></div>
```

#### クラスとスタイルのバインディング

class と style には複数のプロパティを持てるので、特別な拡張がある。

```javascript
<div :class="{ active: isActive }"></div>
```

上記の例は isActive がの真偽によって active というクラスを持つかが決まる。

```javascript
<script setup>
const isActive = ref(true)
const hasError = ref(false)
</script>

<template>
  <div class="static" :class="{ active: isActive, 'text-danger': hasError }"></div>
</template>
```

レンダリングはこうなる。

```javascript
<div class="static active"></div>
```

---

### v-on <a id="v-on" data-name="v-on"></a>

DOMイベントを登録する。

#### 省略記法

v-on には省略記法がある。

- v-on:click=""
- @click=""

#### インラインで呼び出す

```vue
<p>カウント: {{ count }}</p>
<button @click="count++">＋1</button>
```

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

#### DOMイベント

基本的には全てのDOMイベントに対応している。<br>
以下はよく使うイベント。

| 修飾子 | 発火するタイミング | よくあるユースケース |
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
| .prevent | デフォルトの動きを止める | フォームの再送信を防ぐ | event.prevent="" |
| .stop | イベントの伝播を止める | 親要素のクリックイベントが発生するのを防ぐ | event.stop="" |
| .once | イベントを1回だけしか発火させない | 初回クリック時のみ処理を行いたい | event.once="" |

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

#### カスタムイベント

emitにより子から親へ発火を伝えることができる。

```vue
<!-- 子コンポーネントが独自に発火させる「close-modal」というイベントをキャッチする -->
<MyModal @close-modal="isOpen = false" />
```

---

### v-model による双方向バインディング <a id="v-model" data-name="v-model"></a>

v-bindとv-onを一緒に使うことで input要素に双方向バインディングを作成できる。

{% raw %}
```javascript
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

```javascript
<script setup>
  import { ref } from 'vue'

  const text = ref('')
</script>

<template>
  <input v-model="text" placeholder="Type here" />
  <p>{{ text }}</p>
</template>
```

#### 子コンポーネントに対して v-model を使う

自作のコンポーネントに対して v-model を使う場合は defineModel() マクロを使うのが推奨されている。

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

#### チェックボックスの実装例

{% raw %}
```javascript
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```
{% endraw %}

#### 複数のチェックボックスの実装例

{% raw %}
```javascript
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
```javascript
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>
```
{% endraw %}

#### セレクトの実装例

{% raw %}
```javascript
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

### slot <a id="v-slot" data-name="slot"></a>

slot の基本は、子の `<slot />` 部分に親から要素を注入する仕組み。

`<slot>` デフォルト内容 `</slot>`<br>
とすると、親から slot に何も渡されなかった時の内容となる。

#### 基本形

子コンポーネント
```vue
// Card.vue
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

#### 名前付き slot

子コンポーネント
```vue
// MyDialog.vue
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

#### スコープ付き slot

子コンポーネント
```vue
// UserList.vue
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

親コンポーネント
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

---

### 条件付きレンダリング <a id="conditional-rendering" data-name="条件付きレンダリング"></a>

#### v-if

```javascript
<h1 v-if="awesome">Vue is awesome!</h1>
```

この h1 は awesome の値が truthy である場合にレンダリングされる。<br>
v-if 系でコンポーネントを切り替えると、そのコンポーネントのメモリは破棄されるため、再表示時は再生成される。<br>
値を保持したままにしたい場合は v-show を使う。

#### v-else, v-else-if

他の条件分岐を示すために v-else や v-else-if もある。

```javascript
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

#### v-for

v-for ディレクティブを使用すると、配列を基にした要素のリストをレンダリングできる。

{% raw %}
```javascript
<ul>
  <li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
</ul>
```
{% endraw %}

##### インデックス

v-for では以下のように現在の項目のインデックスを指す、2つ目の省略可能なエイリアスもある。

{% raw %}
```javascript
<li v-for="(item, index) in items">Message: - {{ index }} - {{ item.message }}</li>
```
{% endraw %}

##### オブジェクトに適用する

オブジェクトの各プロパティを反復処理するのにも使える。

{% raw %}
```javascript
const myObject = reactive({ title: 'How to do lists in Vue', author: 'Jane Doe', publishedAt:
'2016-04-10' })

<ul>
  <li v-for="value in myObject">{{ value }}</li>
</ul>
```
{% endraw %}

キーとバリューにアンパッキングすることもできる。

{% raw %}
```javascript
<li v-for="(value, key) in myObject">{{ key }}: {{ value }}</li>
```
{% endraw %}

さらにエイリアスを追加するとインデックスも取り出せる。

{% raw %}
```javascript
<li v-for="(value, key, index) in myObject">{{ index }}. {{ key }}: {{ value }}</li>
```
{% endraw %}

##### 範囲指定

整数を取り範囲指定もできる。1から始まることに注意。

{% raw %}
```javascript
<span v-for="n in 10">{{ n }}</span>
```
{% endraw %}

<pre><code class="caution">:key 属性が無い状態で v-for の中で動的に値を削除したりすると、インプレースパッチ戦略という仕様のせいでバグが発生する恐れがあるため、:key 属性の指定が推奨とされており、一意の値を :key とする必要がある。</code></pre>

<pre><code class="tips">追加・削除・並び替えが発生しない場合。
<ul>
  <li>index を取得して :key="index"</li>
  <li>&lt;tr v-for="n in 10" :key="n"&gt;</li>
</ul></code></pre>

<pre><code class="tips">&lt;!--複合キーを :key とする(重複がない場合)。--&gt;
&lt;ul&gt;
  &lt;!-- nameとageを組み合わせて「taro-25」のような一意の文字列を作る --&gt;
  &lt;li v-for="user in users" :key="`${user.name}-${user.age}`"&gt;
    &lcub;&lcub; user.name &rcub;&rcub; - &lcub;&lcub; user.age &rcub;&rcub;才
  &lt;/li&gt;
&lt;/ul&gt;</code></pre>

<pre><code class="tips">// IDを付与する(確実な方法)。
const rawData = [
  { name: '田中' },
  { name: '鈴木' },
  { name: '佐藤' }
];

// 画面に表示する用のデータに変換（一意のIDを付与）
const users = rawData.map((item, index) => {
  return {
    ...item,
    id: `user-unique-${index}-${Date.now()}` // 完全に一意なIDを作る
  };
});
</code></pre>

---

### v-show

```vue
<h1 v-show="ok">Hello!</h1>
```

v-if と同じく値が truthy であれば描画されるが、 v-show による要素は常にレンダリングされて DOM に残る。

#### v-html

マスタッシュの中ではデータがHTMLではなくプレーンテキストとして扱われるため、本来のHTMLとしたい場合は v-html を使う。<br>
XSS の危険があるため、ユーザーからの入力には使用しない。

{% raw %}
```vue
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```
{% endraw %}

## Reactivity API <a id="reactivity-api" data-name="Reactivity API"></a>

### ref()

ref() は引数を受け取り、それを .value プロパティを持つ ref オブジェクトにラップして返す。<br>
ref でラップすることにより、 Vue はその値の変更を検出し、それに応じて DOM を更新する。

```vue
import { ref } from 'vue'
const count = ref(0)
```

### reactive()

reactive() はオブジェクト、もしくは配列をラップして、まとめてリアクティブにするための関数。<br>
最大の特徴はアクセス時に .value が必要かどうかで、 reactive は直接アクセスできる。<br>
基本的には ref() を使うことが推奨されている。

### watch()

watch は直接 ref を監視することができ、count の値が変化するたびにコールバックが発生する。<br>
変更後の値と変更前の値を受け取ることも省略することもできる。

- 基本形
  ```vue
  import { ref, watch } from 'vue'

  const currentPage = ref(1)

  // 【書式】 watch( 監視対象, (新しい値, 古い値) => { 行いたい処理 } )
  watch(currentPage, (newPage, oldPage) => {
    console.log(`ページが ${oldPage} から ${newPage} に変わりました`)
    // ここにAPI通信などの処理を書く（returnは不要）
  })
  ```

- 応用形
  ```vue
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

### computed()

computed関数は、getter関数が渡されることを想定しており、戻り値は算出された値となる。<br>
computed関数に含まれたリアクティブな値が変化したことにより発火し、必ず戻り値を返す必要がある。

computed はリアクティブな依存関係にもとづきキャッシュされており、依存関係が更新されたときのみ再評価されるため、実行コストが下がる。

```vue
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

<pre><code class="example">const allDataList = ref&lt;myData[]&gt;([])

// 2. 現在のページ番号を ref で保持（1ページ目からスタート）
const currentPage = ref(1)
// ページあたりの表示件数を定数で定義
const ITEMS_PER_PAGE = 10

// 3. 【重要】現在のページに応じた10件のみを自動で切り出す computed
const displayedDataList = computed(() => {
  // 例: 1ページ目なら 0, 2ページ目なら 10 が開始位置になる
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE

  // JavaScriptの .slice(開始, 終了) を使って10件だけを切り出す
  return allDataList.value.slice(start, end)
})</code></pre>

## ライフサイクルフック <a id="lifecycle-hook" data-name="ライフサイクルフック"></a>

各 Vue コンポーネントインスタンスは、生成時に一連の初期化を行うが、特定のタイミングで独自のコードを追加することができる。

### onMounted

コンポーネントが最初のレンダリングを終了し、 DOM ノードを生成した後にコードを実行する。

```javascript
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
    console.log(`コンポーネントがマウントされました。`)
})
</script>
```

### onUpdated

### onUnmounted

---

## TemplateRef<a id="template-ref" data-name="TemplateRef"></a>

TemplateRef は、コンポーネントのテンプレート内でレンダリングされた DOM要素や子コンポーネントのインスタンスに直接アクセスするための機能。

通常 Vueは宣言的なデータバインディングによって DOM 操作を自動化するが、特定のケース (ライブラリの初期化、DOMのフォーカス、アニメーションの制御など)で直接要素を操作したい場合に使用する。

可能な限り DOMは直接操作しないことが推奨されている。

### 使い方

```javascript
const compRef = ref<InstanceType<typeof ExtendedInput>>();
```

または vue3.5 以降なら

```javascript
const compRef = useTemplateRef<HTMLInputElement>("compRef")
```

と宣言して、

```javascript
<MyComponent ref="comRef" />
```

で紐づける。

#### DOM 要素の場合

```javascript
const inputEl = ref<HTMLInputElement>();
<input ref="inputEl">
```

すると

```javascript
inputEl.value?.focus();
```

のようにアクセスできる。

---

## Props, Emits <a id="props-emits" data-name="Props, Emits"></a>

親子コンポーネント間のデータ通信は、「Propsは下り（親→子）」「Emitsは上り（子→親）」というルールで動きます。 [1]
これをVue 3の標準的な書き方 `<script setup>` で解説します。

### 1. Props（親から子へデータを渡す）


親が子に「このデータを使ってね」と指示を出す時に使います。

- 子コンポーネント側: defineProps で受け取る名前を宣言します。

{% raw %}
```javascript
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


- 親コンポーネント側: タグの属性としてデータを渡します。

```javascript
<!-- Parent.vue -->
<template>
  <!-- titleとpriceを渡す。動的な値（変数）なら : をつける -->
  <Child title="おいしいリンゴ" :price="150" />
</template>
```

### 2. Emits（子から親へイベントを通知する）

子が「ボタンが押されたよ！」などの出来事を親に報告する時に使います。

- 子コンポーネント側: defineEmits でイベント名を登録し、実行します。

```javascript
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

- 親コンポーネント側: @イベント名 で子の報告を待ち構えます。

```javascript
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

---

### まとめ

- Props: 親が子を「設定」するイメージ（一方通行）。
- Emits: 子が親に「合図」を送るイメージ。

---

Vue3 Composition API `<script setup>` における、コンポーネント間でデータをやり取りするための props（親から子へ） と emits（子から親へ） の具体的な実装例です。
親コンポーネント（App.vue）と、子コンポーネント（UserCard.vue）の2つのファイルを使って解説します。

### 1. 【子】UserCard.vue (データを受け取り、イベントを放つ)

子コンポーネントでは、マクロ関数である defineProps と defineEmits を使用します。これらは import なしでそのまま使えます。

{% raw %}
```javascript
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

    <!-- @click の中で直接 emit することも可能です -->
    <button @click="emit('delete-user')">❌ 削除</button>

  </div>
</template>

<style scoped>
.card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 6px; }
button { margin-right: 5px; }
</style>
```
{% endraw %}


---

### 2. 【親】App.vue (データを渡し、イベントを受け取る)

親コンポーネントでは、子コンポーネントの属性（:）に対してデータを渡し、子コンポーネントのイベント（@）に対して関数を紐づけます。

```javascript
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

<style scoped>
.parent { padding: 20px; max-width: 400px; }
</style>
```

---

### データの流れのまとめ

これまでの会話で学んだ「バインド（:）」と「イベント（@）」の知識がそのまま使われています。

- Props (上から下へのデータ移動)
- 親が :user-name="name" とバインドしてデータを子に流します。
  - 子は defineProps で受け取り、自分のDOMに {% raw %} {{ userName }} {% endraw %} で紐づけます。
- Emits (下から上へのイベント通知)
- 子がボタン操作などをきっかけに emit('celebrate') を発射します。
  - 親は @celebrate="handleCelebrate" でそれをキャッチし、自身の関数を実行します。

---

厳密なTypeScriptの enum 構文そのものではありませんが、役割としては「このコンポーネントが外（親）に向かって発射できるイベントの種類の一覧（列挙）」を定義しているため、本質的には enum と全く同じ目的で使用されています。
この書き方（配列形式）の裏側にある仕様と、TypeScriptを使ったより強力な定義方法について解説します。

### 1. 配列で書く意味（JavaScriptとしての基本）

defineEmits(['celebrate', 'delete-user']) のように配列で文字列を並べることで、Vueに対して「この2つのイベント名だけを正式なイベントとして認めます」と宣言しています。
もし開発者が間違えて、配列に登録していないイベント名（例: emit('invalid-event')）を実行しようとすると、Vueがブラウザのコンソールで警告（Warning）を出してミスを教えてくれます。

### 2. TypeScriptを使ってさらに安全にする書き方

もしプロジェクトで TypeScript（counter.ts などの話があった環境）を使用している場合、配列ではなく TypeScriptの型定義（ジェネリクス） を使って、完全に enum や型安全なオブジェクトに近い形で定義するのが主流です。
型を使って書くと、「イベント名」だけでなく「一緒に送るデータの型」までガチガチに固定できます。

```javascript
<script setup lang="ts">// 配列ではなく、型定義 <{ ... }> を使って定義する
const emit = defineEmits<{
  // イベント名: [送るデータの型]
  celebrate: []                      // データは何も送らない
  'delete-user': []                  // データは何も送らない
  'update-name': [newName: string]   // 💡 文字列データを一緒に送る必要があるイベント
}>()
const changeName = () => {
  // ⭕ 正しい使い方（文字列を一緒に送っている）
  emit('update-name', '新しい名前')
  
  // ❌ TypeScriptがコンパイルエラーを出してくれる（数値を送ろうとしたり、引数が足りないと怒られる）
  // emit('update-name', 123)
}
</script>
```

### まとめ

- defineEmits([...]) の配列は、そのコンポーネントが持つ 「イベント名の列挙（仕様書）」 の役割を果たしています。
- TypeScript環境であれば、さらに一歩進めて 「送るデータの種類と型」までをセットにした定義 が可能です。

「コンポーネントが外に公開しているインターフェース（窓口）の一覧」として捉えると、PropsもEmitsも非常に整理しやすくなります。
この 「子から親へデータを乗せて送るパターン（例: 上記の newName のようなケース）」 について、親側でどう受け取るかなど具体的な処理を見てみますか？

---

親から子へJSONデータを渡す場合も、基本的なデータ（文字列や数値）を渡す時と全く同じ「バインド（:）」の仕組みを使います。
JavaScriptのオブジェクトや配列（JSONデータ）をそのまま props として子コンポーネントに安全に流し込むことができます。
Composition API（TypeScript対応）での具体的な実装例です

---

### 1. 【子】UserDetail.vue (JSONデータを受け取る)

子は defineProps を使って、受け取るデータが「オブジェクト（Object）」または「配列（Array）」であることを定義します。

{% raw %}
```javascript
<script setup lang="ts">
// 受け取るJSONデータの型を定義（TypeScriptの場合）
interface UserInfo {
  id: number
  name: string
  hobbies: string[]
}

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

---

### 2. 【親】App.vue (JSONデータを取得して子に渡す)

親側では、前の手順で学した fetch などを使い、リアクティブな変数（ref）にJSONデータを格納して子にバインドします。

```javascript
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserDetail from './UserDetail.vue'

// 最初は null を入れておき、fetch 後に JSON を格納する
const userJson = ref(null)

onMounted(async () => {
  try {
    // public/user.json などからデータを取得
    const response = await fetch('/user.json')
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
      【超重要】
      データが fetch されるまでは userJson は null なので、
      v-if="userJson" を使って「データが空のときは子を作らない」制御をします。
    -->
    <UserDetail
      v-if="userJson"
      :user-data="userJson"
    />

    <p v-else>データを読み込み中...</p>

  </div>
</template>
```

---

### 重要なポイント

1. v-if による非同期ガード
   JSONデータを fetch で後から読み込む場合、読み込みが完了する前に子が動いてしまうと「null の中の id が読めない」というエラー（Cannot read properties of null）で画面が真っ白になります。
   親側で v-if="userJson" と書き、データが確実に存在するときだけ子を表示させるのがVue開発の鉄則です。
2. データの参照（参照渡し）
   JavaScriptの仕様上、オブジェクトや配列を props で渡すと「参照」が渡されます。
   子が受け取った userData.name = '勝手に変更' のように子コンポーネント側で直接JSONの中身を書き換えてはいけません（Vueから警告が出ます）。変更したい場合は、前述の emits を使って親に変更を依頼します。

---

Vue 3（Composition API）で、あらかじめHTMLで枠組み（テーブルのヘッダーなど）を作っておき、親から渡されたJSONデータを v-for を使って行（<tr>）として書き込んでいく（表示する）標準的な実装例です。
データの件数が0件のときの考慮（空の表示）も含めた実用的なコードにしています。

---

### 1. 【子】DataTable.vue（テーブルの枠を用意してデータを書き込む）

テーブルのヘッダー`<thead>`を固定で作成しておき、データが入るボディ`<tbody>`の部分に v-for を使ってJSONデータを流し込みます。

{% raw %}
```javascript
<script setup lang="ts">
// 1. JSONデータの1件分の型を定義
interface Member {
  id: number
  name: string
  role: string
  status: string
}

// 2. 親からメンバー一覧（配列）を受け取る
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

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}
th {
  background-color: #f5f5f5;
  font-weight: bold;
}
tr:hover {
  background-color: #fafafa;
}
.badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
.active { background-color: #e6f4ea; color: #137333; }
.offline { background-color: #fce8e6; color: #c5221f; }
.empty-message { text-align: center; color: #999; }
</style>
```
{% endraw %}

---

### 2. 【親】App.vue（データをfetchして子テーブルへ渡す）

親はデータを fetch し、空配列 [] で初期化しておくことで、読み込み中であってもテーブルの枠組み（ヘッダー）だけは画面に最初から表示させておくことができます。

```javascript
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from './DataTable.vue'

// 最初は空の配列を入れておく（これでテーブルの枠だけ先に見せられる）
const memberList = ref([])

onMounted(async () => {
  try {
    // public/members.json などから配列データを取得
    const response = await fetch('/members.json')
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

<style scoped>
.app-container { padding: 20px; max-width: 800px; margin: 0 auto; }
</style>
```

---

### 3. 想定しているJSONデータ（public/members.json）の例

```json
[
{ "id": 1, "name": "山田 太郎", "role": "エンジニア", "status": "active" },
{ "id": 2, "name": "佐藤 美咲", "role": "デザイナー", "status": "active" },
{ "id": 3, "name": "鈴木 一郎", "role": "マネージャー", "status": "offline" }
]
```

### 重要なポイント

- 最初からテーブルの枠を見せるテクニック:
  親側で ref([]) と空の配列で初期化しておくことで、v-if でコンポーネントごと非表示にすることなく、「ヘッダーだけある空のテーブル」を画面に先に出すことができます。通信が完了（await が通過）すると、tbody の中身だけがシュッと書き換わります。
- :key="member.id" の指定:
  v-for でループしてテーブルの行を書き込む際は、Vueが各行を正しく識別して高速に描画できるよう、一意のID（id など）を :key に必ずバインドしてください。

---

親から渡された props の値が変化したタイミングで処理を実行（発火）したい場合は、Vue 3の watch（ウォッチャー） という機能を使用します。
props の値を監視する場合、Composition API（<script setup>）では「アロー関数で props の値を返す（getter関数形式）」という独特の書き方をするのがポイントです。
具体的な実装例を解説します。

---

### 実装コード例

子コンポーネント側で、親から渡される userId という props が変わった瞬間に、APIから新しいデータを再取得する（fetch）ようなケースを想定したコードです。

{% raw %}
```javascript
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

---

### なぜ () => props.userId とアロー関数で書くのか？

これまでに学んだ通り、props は親から渡されるデータ（リアクティブなオブジェクト）です。
直接 watch(props.userId, ...) と書こうとすると、JavaScriptは「その瞬間の数値（例: 1）」を watch に渡してしまいます。数値などのただの値（プリミティブ値）は、後から中身が変わっても Vue が変化を追跡できません。
そこで、「値が必要になったら、このアロー関数を実行して props.userId の最新の表（器）を見に行ってね」 という命令（getter）の形にして watch に渡す必要があります。これにより、Vue は正しく変化を検知して関数を発火させることができます。

### 応用：画面が開いた瞬間（最初の1回目）も同時に発火させたい場合

デフォルトの watch は、「値が『変化』したとき」にしか動きません。画面が開いた初期値のタイミングでも同じ処理を動かしたい場合は、第三引数に { immediate: true } というオプションを追加します。

```javascript
watch(
() => props.userId,
(newId) => {
fetchUserData(newId)
},
{ immediate: true } // 💡 画面が開いた瞬間（初期化時）も即座に実行する
)
```

これで、親側のデータ変更と完全に同期して動く子コンポーネントが作れるようになります。
この watch の書き方について、監視したいデータが複数ある場合の書き方や、その他に気になった部分はありますか？

---

ユーザーの操作（ボタンクリック）をきっかけにデータを取得し、あらかじめ用意したテーブルに後から書き込むという、実務でも非常によく使う実践的な開発の流れです。
これまでに学んだ ref（空の箱）、emits（親への通知）、props（親から子へのデータ流下）、アロー関数による async/await のすべてが綺麗に繋がります。
親コンポーネント（App.vue）と、子コンポーネント（UserTable.vue）の2つのコード例を使って全体の流れを解説します。

---

### 1. 【子】UserTable.vue (枠だけ作り、ボタンで親に通知する)

- ポイント:
- 最初に「参照ボタン」を置いておきます。
  - ボタンが押されたら、emit('request-data') で親に「データが欲しい」と通知します。
  - 親からデータ（props.users）が流れてくるまでは、自動的に「データがありません」の行が表示されます。

{% raw %}
```javascript
<script setup lang="ts">
// データの構造体（設計図）
interface User {
  id: number
  name: string
  email: string
}

// 1. 親からデータを受け取るためのProps（初期値は空配列）
defineProps<{
  users: User[]
}>()

// 2. 親にイベントを通知するためのEmits（配列による列挙型のような定義）
const emit = defineEmits(['request-data'])
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

<style scoped>
.load-btn { margin-bottom: 15px; padding: 8px 16px; cursor: pointer; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
th { background-color: #eee; }
.empty-text { text-align: center; color: #888; padding: 20px 0; }
</style>
```
{% endraw %}

---

### 2. 【親】App.vue (通知を受け取り、fetchしたデータを子に流す)

- ポイント:
- 最初、userDataList は ref([])（空の配列という箱）で宣言して子に渡しているため、エラーにならず空のテーブルが先に描画されます。
  - 子から通知（@request-data）が来たら、loadData（非同期のアロー関数）が発火します。
  - await を使って通信が完了した瞬間、箱の中身（.value）が上書きされ、それが瞬時に子コンポーネントのテーブルに書き込まれます。

```javascript
<script setup lang="ts">
import { ref } from 'vue'
import UserTable from './UserTable.vue'

// 1. データの「表（器）」を空の配列で固定宣言（const）しておく
const userDataList = ref([])

// 2. 子からの通知をきっかけに動く非同期のアロー関数
const loadData = async () => {
  try {
    console.log('親：データのリクエストを受け取りました。通信を開始します。')

    // public/users.json などからデータを取得（完了するまで await で待機）
    const response = await fetch('/users.json')
    const json = await response.json()

    // 3. 取得完了後、固定された箱の中身（.value）を書き換える
    // ➔ これにより、子コンポーネントへ自動的にデータが流れてテーブルが更新される
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

<style scoped>
.container { padding: 20px; }
</style>
```

---

### 処理のタイムライン（全体の流れ）

1. 画面表示（最初）:
   親が ref([]) を子にパス。子はそれを受け取り、「空のテーブル（ヘッダーと案内文のみ）」をはじめに画面に描画します。
2. ユーザーの操作:
   ユーザーが「データを参照する」ボタンをクリックします。
3. 子から親への通知（Emits）:
   子が @click をトリガーに emit('request-data') を発射します。親はイベントループを通じてそれを検知し、loadData 関数を呼び出します。
4. データの取得（Async/Await）:
   親の関数内で await fetch が動き、JavaScriptは通信が終わるまでその行で待機します（その間もブラウザは固まりません）。
5. データの流下と書き込み（Props）:
   通信が完了すると、親が userDataList.value にデータを代入します。Vueのリアクティブシステムが作動し、Propsを通じて子に新しいJSONデータが一瞬で流れ込み、テーブルの行`<tr>`が自動で書き換えられます。

ここまで組み立ててきた知識（バインド、アロー関数、イベント、constとref、interface）がすべて綺麗に噛み合う非常に美しい設計パターンです。

---

あらかじめHTMLで「10行分の空の行（枠）」を固定で作っておき、親からデータが届いたらその枠の中に文字を書き込んでいくスタイルですね。
この場合、Vueの v-for の「指定した回数（数値）だけループする」という機能と、JavaScriptの配列のインデックス（何番目のデータか）を組み合わせることで綺麗に実装できます。
Composition APIでの具体的な実装例です。

---

### 1. 【子】FixedTable.vue（10行の固定枠を用意する）

- ポイント:
- v-for="i in 10" と書くことで、データが何件であっても必ず10行固定でテーブルを描画します。
  - members[i - 1] を使って、配列から1つずつデータを取り出してセルに書き込みます。データがない行（後半の行など）は、自動的に空欄になります。

{% raw %}
```javascript
<script setup lang="ts">
// データの構造体
interface Member {
  id: number
  name: string
  role: string
}

// 親から最大10件の配列データを受け取る
defineProps<{
  members: Member[]
}>()

const emit = defineEmits(['request-next-page'])
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
        <!-- 💡 データの件数ではなく、必ず「1〜10」の10回ループして行を作る -->
        <tr v-for="i in 10" :key="i">
          <!-- 行番号（1〜10） -->
          <td class="row-num">{{ i }}</td>

          <!--
            💡 配列は0番目から始まるため、i - 1 番目のデータを参照する。
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

<style scoped>
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
th { background-color: #f5f5f5; }
.row-num { background-color: #fafafa; color: #999; font-weight: bold; width: 40px; text-align: center; }
.btn { padding: 8px 16px; cursor: pointer; }
</style>
```
{% endraw %}

### 💡 コード内の便利なJavaScript構文の解説

- members[i - 1]?.name（オプショナルチェーニング）
  データが3件しかない場合、4番目（`members[3]`）を見に行くと「中身が undefined（空っぽ）」になり、通常はエラーで画面が壊れます。しかし ?. をつけておくと、データがなくてもエラーにせず、安全に「何もないよ」と処理を流してくれます。
- ?? '（空席）'（Null合体演算子）
  データがなくて undefined や null だった場合に、代わりに右側の文字（- や （空席））を自動で表示してくれる便利な書き方です。

---

### 2. 【親】App.vue（10件ずつデータを切り出して子に流す）

親側は全体のデータ（例えば30件）を持っており、ユーザーがボタンを押すたびにページ番号を切り替えて、「次の10件」の配列を子に新しくバインドします。

{% raw %}
```javascript
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FixedTable from './FixedTable.vue'

// 全体のデータ（例: 30件分が入る）
const allMembers = ref([])

// 現在表示しているページ（1ページ目 ＝ 0〜9件目）
const currentPage = ref(0)

// 子に渡す「現在の10件だけ」を切り出す（computedで自動計算）
// pageが0なら0〜9番目、pageが1なら10〜19番目を切り出す
const currentTenMembers = computed(() => {
  const start = currentPage.value * 10
  const end = start + 10
  return allMembers.value.slice(start, end)
})

// 最初は空のデータを入れておく
onMounted(async () => {
  try {
    // サーバーから全件データをfetch
    const response = await fetch('/all-members.json')
    allMembers.value = await response.json()
  } catch (error) {
    console.error(error)
  }
})

// 子から「次の10件」の通知が来たらページを進める
const goToNextPage = () => {
  // 次のページへ（データの最大件数を超えないように考慮）
  if ((currentPage.value + 1) * 10 < allMembers.value.length) {
    currentPage.value++
  } else {
    // 最後のページまで行ったら最初に戻るデモ
    currentPage.value = 0
  }
}
</script>

<template>
  <div class="container">
    <h1>10行固定テーブル（ページ: {{ currentPage + 1 }}）</h1>

    <!-- 切り出した「10件ずつのデータ」を子に流し込む -->
    <FixedTable
      :members="currentTenMembers"
      @request-next-page="goToNextPage"
    />

  </div>
</template>

<style scoped>
.container { padding: 20px; max-width: 600px; }
</style>
```
{% endraw %}

---

### 全体の動き

1. 初期状態:
   親は allMembers を空配列で初期化し、子には空配列（0件）が渡されます。
   子は v-for="i in 10" で動いているため、データが0件でも最初からきれいな10行の空テーブル（すべて「-」や「（空席）」と書かれた状態）が描画されます。
2. データのフェッチ:
   onMounted でデータが届くと、最初の10件が currentTenMembers によって自動的に切り出され、子テーブルの「1〜10行目」の枠の中にピタッと文字が書き込まれます。
3. 次の10件を押したとき:
   ユーザーがボタンを押すと、親の currentPage が変わります。Vueのリアクティブシステムにより、computed が次の「11〜20番目のデータ」を瞬時に切り出して子に流し込み、テーブルの10行の枠はそのままで、中身の文字だけがスッと10件分入れ替わります。

---

おっしゃる通り、実際のWeb開発においてサーバーからデータが届く（propsが更新される）タイミングは、ネットワークの速度やサーバーの混雑状況によって毎回バラバラ（まちまち）です。
子コンポーネント側で、いつ届くか分からない props をスマートに待つ（あるいはデータが届いた瞬間に処理を引っ掛ける）には、主に3つの定番のアプローチがあります。
目的や好みに合わせて使い分けますが、Vue 3では「1」の算出プロパティ（computed）を使うのが最も美しく推奨される方法です。

---

### アプローチ1：待たずに「自動追従」させる（computed）【最推奨】

「データがいつ届くか」を意識して待つコードを書くのではなく、「データが届いたら自動的に連動して計算してね」という仕組みを作っておく方法です。
Vue 2まではデータを待つために複雑な処理が必要でしたが、Vue 3のComposition APIでは、computed の中で props を使うだけで、Vueのリアクティブシステムが裏側で自動的にデータの到着を待ち構えてくれます。

```javascript
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  members: Member[]
}>()

// 💡 データの到着を待つ必要はない！
// props.members が空から10件に変わった瞬間、この computed が自動で再計算される
const activeMembers = computed(() => {
  return props.members.filter(m => m.status === 'active')
})
</script>
```

---

### アプローチ2：届いた瞬間を監視して関数を実行する（watch）

データが届いた「その瞬間」をトリガーにして、何か別のJavaScriptの関数（例: ログを仕込む、別のAPIを叩くなど）を実行したい場合は、以前に登場した watch を使って到着を待ち伏せします。

```javascript
<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  members: Member[]
}>()

// 💡 props.members の中身が書き換わった瞬間（＝データが届いた時）に発火する
watch(
  () => props.members,
  (newMembers) => {
    if (newMembers.length > 0) {
      console.log('親からデータが10件届きました！ここで特別な処理を動かします。')
    }
  }
)
</script>
```

---

### アプローチ3：親側で「データが揃うまで子を作らない」（v-if ガード）

子コンポーネント側で「データが届くまで待つ」のが面倒な場合、親コンポーネントの段階でデータが届くまで子コンポーネントの描画自体を完全にストップさせておくという豪快かつ非常に安全な方法です。
前々回のコード例で紹介した v-if による制御がこれに当たります。

```javascript
<!-- 【親コンポーネントのHTML】 -->
<template>
  <!-- 💡 memberList.length が 0 より大きくなる（データが届く）まで、この子コンポーネントは生まれません -->
  <FixedTable
    v-if="memberList.length > 0"
    :members="memberList"
  />
  
  <!-- データが届くまでは、代わりにこれを出して待つ -->
  <p v-else>サーバーからの返答を待っています...</p>
</template>
```

### この方法をとると、子コンポーネントが生まれた（画面に描画された）時点ではすでに100%データが中に存在している状態になるため、子側で「いつ届くかな？」と心配して待つ必要が一切なくなります

### まとめ

- 画面に表示するデータを加工したいだけなら: 待つコードは書かず、computed に丸投げする（自動で追従してくれる）。
- データが届いた瞬間に何か処理を実行したいなら: watch で到着の瞬間を待ち伏せる。
- 初期のバグを一番安全に防ぎたいなら: 親側で v-if を使って、データが届いてから子コンポーネントを出現させる。

今回の「10行の固定テーブルの枠を最初から見せておきたい」という目的であれば、アプローチ1（computed） または特別な処理が必要なければテンプレート（HTML）に直接 {% raw %} {{ members[i - 1]?.name }} {% endraw %} と書いておくだけで、Vueが勝手にタイミングを合わせて描画してくれます。
Vueの「データが変われば画面が変わる」という自動追従（リアクティブ）の恩恵が、まさにここで生きてきます。

---

computed で作成した算出プロパティは、基本的には `<template>`（HTML側）の中で呼び出します。
これまで学んだマスタッシュ構文や :（属性バインド）の中に、カッコ () を付けずにそのまま記述します。
具体的な記述方法を、今回の「10行固定テーブル」の例に組み込んで解説します

---

### 呼び出し方のコード例

親から渡されたデータを computed で並び替えて、それをテーブルに書き込む例です。

{% raw %}
```javascript
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  members: Member[]
}>()

// 1. computed を定義する（例：IDが小さい順に並び替える処理）
const sortedMembers = computed(() => {
  // props.members が空のときは空配列を返し、データが届いたら自動で並び替える
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
          2. 【ここで呼ぶ！】
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

---

### なぜカッコ () を付けないのか？

通常の関数（methods）は、実行するために myFunction() のようにカッコが必要ですが、computed はVueの仕組みによって「最新の結果が常に入っている変数（定数）」のように扱えるよう自動変換されています。
そのため、HTML側ではただの変数（ref などと同じ感覚）として、名前を書くだけで呼び出せます。

### 応用：`<script setup>`（JS側）の中で呼び出す場合

もしHTML側ではなく、JavaScriptの処理の中で computed の結果を使いたい場合は、ref の時と全く同じように .value を付けて呼び出します。

```javascript
// JS側で computed の結果をログに出したり、別の計算に使いたいとき
console.log(sortedMembers.value) // 💡「.value」をつける
```

---

### まとめ

- `<template>`（HTML）で呼ぶとき: {% raw %} {{ sortedMembers }} {% endraw %} のようにカッコなしでそのまま書く。
- `<script setup>`（JS）で呼ぶとき: sortedMembers.value のように .value をつける。

親からのデータ（props）がいつ届くか分からなくても、このように computed を呼び出しておけば、Vueの裏側の無限ループがデータの到着を検知した瞬間に勝手に再計算して、画面の表示をパッと最新に書き換えてくれます。
これで全体の流れが綺麗に繋がりました。次に進みたい新しい実装（例：テーブルの行をクリックしたときに、その行の詳細データをポップアップで表示する機能など）はありますか？

---

現状の「コンポーネントA（ボタン） ➔ 親（フェッチ） ➔ コンポーネントB（10行固定テーブル）」という設計は、Vue.jsにおける非常に美しい単一方向データフロー（State Upパターン）です。
コンポーネントB（テーブル）において、「10行の固定枠（`<tr>`）はそのままに、親から届いた配列データを使って中身（各セル）の更新のみを自動的に行う」ためには、前述の computed を使ってテンプレート（HTML）に直接バインドするアプローチが最もスマートかつパフォーマンスが高い実装になります。
コンポーネントBの内部で watch を使ってデータを別の変数に移し替える必要はありません。Vue 3のリアクティブシステムにすべて任せる書き方が以下になります

---

### コンポーネントB（テーブル）の実装コード

{% raw %}
```javascript
<script setup lang="ts">
import { computed } from 'vue'

// データの構造体（設計図）
interface Member {
  id: number
  name: string
  role: string
}

// 1. 親からデータ（最初は空、フェッチ後に10件届く）を受け取る
const props = defineProps<{
  members: Member[]
}>()

// 2. computed で親からの props をそのまま追従させる
// props.members が変わった瞬間、この定数の中身が自動で最新になります
const displayMembers = computed(() => {
  return props.members
})
</script>

<template>
  <div class="table-container">
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
        <!--
          💡 枠組みは「必ず10行」で固定してあらかじめ描画しておく。
          displayMembers の中身が空のときは自動で「-」になり、
          親からデータが届いた（propsが更新された）瞬間にセルの文字だけが書き換わります。
        -->
        <tr v-for="i in 10" :key="i">
          <td class="row-num">{{ i }}</td>

          <!-- オプショナルチェーニング（?.）とNull合体（??）で枠を維持 -->
          <td>{{ displayMembers[i - 1]?.id ?? '-' }}</td>
          <td>{{ displayMembers[i - 1]?.name ?? '（空席）' }}</td>
          <td>{{ displayMembers[i - 1]?.role ?? 'ー' }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<style scoped>
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
th { background-color: #f5f5f5; }
.row-num { color: #999; text-align: center; width: 40px; font-weight: bold; }
</style>
```
{% endraw %}

---

#### なぜこの書き方で「テーブルの更新のみ」ができるのか？

1.  DOMの枠（`<tr>`）が壊れない:
    v-for="i in 10" によって、HTMLとしてのテーブルの構造（10行分の行要素）はコンポーネントBが画面に表示された瞬間から固定されています。
2.  Vueの最小限のパッチ（更新）:
    親コンポーネントがフェッチを完了して members を流し込むと、Vueの裏側の無限ループ（イベントループ）がそれを検知し、computed（displayMembers）を再計算します。
3.  テキストノード（セルの文字）だけが書き換わる:
    Vueは10行の `<tr>` 自体を作り直すのではなく、{% raw %} {{ }} {% endraw %} で紐づけられている 「セルの文字（テキスト）」だけをピンポイントで書き換えます。

#### そのため、まさに理想とされている「テーブルの枠は動かさず、届いたデータ配列から中身の書き込みだけを行う」という挙動が、JavaScriptでごちゃごちゃと待機処理を書くことなく、Vueの標準機能（宣言的レンダリング）だけで完全に実現できます

この構造で、コンポーネントAのボタンを押したときに親経由でBのテーブルの中身がサッと切り替わるはずです。


