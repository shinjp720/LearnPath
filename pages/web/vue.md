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

作成後に移動。

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
## 基本

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

---

## ディレクティブ

v-で始まるのものをディレクティブといい、HTMLのDOM要素に対して特別な動作をさせるための命令で、技術的にはカスタム属性として扱われる。

```txt
v-on:submit.prevent="onSubmit"
名前 : 引数 . 修飾子 = "値"
```

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

### v-bind

動的な値を属性にバインドする。
v-bind には省略記法がある。

- v-bind:id=""
- :id=""

#### 複数の属性をバインド

次のような複数の属性を持つ JavaScriptオブジェクトがあるとして、

```vue
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

上記の例は isActive がの真偽によって active というクラスを持つかが決まる。

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

```vue
<div class="static active"></div>
```

### v-on

DOMイベントを購読する。<br>
v-on には省略記法がある。

- v-on:click=""
- @click=""

### v-model による双方向バインディング

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

#### チェックボックス

```vue
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

#### 複数のチェックボックス

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

#### ラジオボタン

```vue
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>
```

#### セレクト

```vue
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

---

### 条件付きレンダリング

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

#### v-for

v-for ディレクティブを使用すると、配列を基にした要素のリストをレンダリングできる。

```vue
<ul>
  <li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
</ul>
```

##### インデックス

v-for では以下のように現在の項目のインデックスを指す、2つ目の省略可能なエイリアスもある。

```vue
<li v-for="(item, index) in items">Message: - {{ index }} - {{ item.message }}</li>
```

##### オブジェクトに適用する

オブジェクトの各プロパティを反復処理するのにも使える。

```vue
const myObject = reactive({ title: 'How to do lists in Vue', author: 'Jane Doe', publishedAt:
'2016-04-10' })

<ul>
  <li v-for="value in myObject">{{ value }}</li>
</ul>
```

キーとバリューにアンパッキングすることもできる。

```vue
<li v-for="(value, key) in myObject">{{ key }}: {{ value }}</li>
```

さらにエイリアスを追加するとインデックスも取り出せる。

```vue
<li v-for="(value, key, index) in myObject">{{ index }}. {{ key }}: {{ value }}</li>
```

###### 範囲指定

整数を取り範囲指定もできる。1から始まることに注意。

```vue
<span v-for="n in 10">{{ n }}</span>
```

### v-show

```vue
<h1 v-show="ok">Hello!</h1>
```

v-if と同じく値が truthy であれば描画されるが、 v-show による要素は常にレンダリングされて DOM に残る。

#### v-html

マスタッシュの中ではデータがHTMLではなくプレーンテキストとして扱われるため、本来のHTMLとしたい場合は v-html を使う。<br>
XSS の危険があるため、ユーザーからの入力には使用しない。

```vue
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

## Reactivity API

### ref()

ref() は引数を受け取り、それを .value プロパティを持つ ref オブジェクトにラップして返す。<br>
こうすることにより、 Vue はその値の変更を検出し、それに応じて DOM を更新する。

```vue
import { ref } from 'vue' const count = ref(0)
```

### reactive()

reactive() はオブジェクト、もしくは配列をラップして、まとめてリアクティブにするための関数。<br>
最大の特徴はアクセス時に .value が必要かどうかで、 reactive は直接アクセスできる。<br>
基本的には ref() を使うことが推奨されている。

### watch()

watch は直接 ref を監視することができ、count の値が変化するたびにコールバックが発生する。

```vue
import { ref, watch } from 'vue'
const count = ref(0)
watch(count, (newCount) => {
    console.log(`new count is: ${newCount}`)
})
```

また、コールバックに第2引数を指定すると変更前の値のエイリアスとなる。

```vue
watch(todoId, (newVal, oldVal) => {
    console.log(`IDが ${oldVal} から ${newVal} に変わりました！`)
})
```

### computed()

computed関数は、getter関数が渡されることを想定しており、戻り値は算出された ref となる。<br>
またcomputedはリアクティブな依存関係にもとづきキャッシュされており、依存関係が更新されたときのみ再評価されgetter関数が実行されるためコストが下がる。

```vue
const publishedBooksMessage = computed(() => {
    return author.books.length > 0 ? 'Yes' : 'No' 
})
```

## ライフサイクルフック

各 VUe コンポーネントインスタンスは、生成時に一連の初期化を行いますが、特定のタイミングで独自のコードを追加することができる。

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

### onUpdated

### onUnmounted

---

Vueのコンポーネント間のコミュニケーションを整理すると、以下のシンプルな2行に集約されます。

- Props（親 → 子）：親が子にデータを「授ける」（属性として渡す）
- Emits（子 → 親）：子が親に何かを「告げる」（イベントを発生させる）

## なぜわざわざ分かれているのか？

もし子が親のデータを勝手に書き換えられると、どこで誰がデータを変えたのか分からなくなり、アプリがバグだらけになってしまいます。
そのため、「データは親が管理し、子はお願い（報告）するだけ」という役割分担が徹底されています。

## Emit の書き方のイメージ

`<script setup>` を使った、ごく短い例を載せておきますね。
子コンポーネント（報告する側）

```vue
<script setup>
const emit = defineEmits(['response']) // 「response」というイベントを飛ばすと宣言

function notifyParent() {
    emit('response', '終わったよ！') // 親に報告（第2引数でデータも送れる）
}
</script>

<template>
  <button @click="notifyParent">親に報告する</button>
</template>
```

親コンポーネント（受け取る側）

```vue
<template>
  <!-- v-on（@）を使って、子のイベントを待ち構える -->
  <Child @response="(msg) => console.log(msg)" />
</template>
```
