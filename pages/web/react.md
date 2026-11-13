---
title: React
layout: default
---

# React <a id="top" data-name="TOP"></a>

- React は、画面 (UI) を作るための JavaScript ライブラリ。画面の見た目を「今の状態 (state) ならこう見える」という形で**宣言的**に書くと、状態が変わったときの DOM の更新は React が行う。
- このドキュメントは React 19 (最新は 19.2) を前提にする。React 18 以前との違いは、該当箇所に注記する。
- 拡張子は、JSX を含む JavaScript が **.jsx**、TypeScript が **.tsx** である。
- JavaScript の「配列」(map, filter など)、「クロージャ」、「非同期」、分割代入、スプレッド構文の知識を前提にする。
- **命名規則**
    - コンポーネント名は、各単語の先頭を大文字にする**パスカルケース**。小文字で始めると、HTML のタグ (div など) として扱われる。
    - フックの名前は、**use** で始めるキャメルケース (例: useState, useToggle)。
    - イベントを受け取る props は **onXxx** (例: onClick, onSelect)、それに渡すハンドラ関数は **handleXxx** (例: handleClick) にすることが多い。
    - コンポーネントのファイル名は、コンポーネント名と同じパスカルケースにすることが多い (例: UserCard.jsx)。

<pre><code class="tips">React の基本の考え方は、次の式で表せる。
UI = f(state)
コンポーネント (関数) は、state と props を受け取って、画面の見た目 (JSX) を返す。state が変わると関数が呼び直されて、新しい見た目が作られる。</code></pre>

---

## 環境構築 <a id="setup" data-name="環境構築"></a>

React は、ブラウザが直接は読めない JSX を使うため、ビルドツールが必要になる。新規にアプリを作る場合は、次のどちらかを選ぶ。

| 選択肢 | 例 | 特徴 |
| --- | --- | --- |
| フレームワーク | Next.js, React Router, Expo (モバイル) | ルーティング、データ取得、サーバー側の描画などが最初から揃っている。公式は、新規アプリではこちらを勧めている。 |
| ビルドツール | Vite, Parcel, Rsbuild | 設定が軽く、画面側 (クライアント) だけの SPA を作るのに向いている。ルーティングやデータ取得は自分で選ぶ。 |

<pre><code class="tips">Create React App (CRA) は 2025年2月に非推奨となったため、新規プロジェクトでは使わない。</code></pre>

### Vite で作る

```
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

TypeScript を使う場合は、`--template react-ts` を指定する。

作成されるファイルの主な構成は、次のとおり。

```
my-app/
├─ index.html     ... <div id="root"></div> と main.jsx の読み込みがある
├─ package.json
└─ src/
   ├─ main.jsx    ... エントリポイント (React を画面に取り付ける)
   └─ App.jsx     ... 最初のコンポーネント
```

### エントリポイント

`createRoot` で HTML 内の要素 (root) に React を取り付け、`render` で最初のコンポーネントを描画する。

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

<pre><code class="tips">StrictMode は、開発中だけ動く検査用のコンポーネント。バグを見つけやすくするため、コンポーネントの関数を2回呼んだり、Effect を「開始 → 後片付け → 開始」と余分に実行したりする。本番のビルドでは何も変わらない。
React 17 以前の ReactDOM.render は、React 19 で削除された。</code></pre>

<pre><code class="caution">2025年12月に、React Server Components の重大な脆弱性が公表され、修正版がリリースされている。フレームワークを使う場合も含めて、React と関連パッケージは最新のパッチバージョンに更新しておく。</code></pre>

---

## JSX <a id="jsx" data-name="JSX"></a>

JSX は、JavaScript の中に HTML のようなマークアップを書ける構文。ビルドツールが、`React.createElement` のような関数呼び出しに変換してくれる。

```jsx
const element = <h1 className="title">Hello, React!</h1>;
```

見た目は HTML に似ているが、実体は JavaScript の式であり、変数に代入したり、関数の引数や戻り値にしたりできる。

### HTML との違い

| JSX のルール | 例 |
| --- | --- |
| 返す要素は1つにまとめる。まとまりを作りたくない場合は、Fragment (`<>...</>`) で囲む。 | `<>`<br>`  <h1>タイトル</h1>`<br>`  <p>本文</p>`<br>`</>` |
| すべてのタグを閉じる。子要素を持たないタグは、自己閉じタグにする。 | `<input />`<br>`<br />`<br>`<img src="a.png" alt="" />` |
| 属性名はキャメルケースで書く。 | `tabIndex`, `onClick`, `maxLength` |
| JavaScript の予約語と重なる属性は、別の名前になる。 | `class` → `className`<br>`for` → `htmlFor` |
| 波括弧 `{ }` の中に JavaScript の式を書ける。属性の値にも使える。 | `<img src={user.icon} alt={user.name} />` |
| style 属性は、文字列ではなくオブジェクトで渡す。波括弧が二重になるのは、外側が式、内側がオブジェクトのため。 | `style={{ color: "red", fontSize: 16 }}` |
| コメントは、波括弧の中に書く。 | `{/* コメント */}` |

### 式の埋め込み

波括弧の中には、**式**だけが書ける。変数、関数の呼び出し、三項演算子、`map` などは書けるが、`if` 文や `for` 文などの**文**は書けない。

```jsx
function Profile() {
  const name = "Taro";
  const user = { age: 25 };

  return (
    <div>
      <p>{name} さん</p>
      <p>来年は {user.age + 1} 歳</p>
      <p>{new Date().getFullYear()} 年</p>
    </div>
  );
}
```

### 条件付き表示

JSX の中では `if` 文が書けないため、次のいずれかの方法を使う。

```jsx
function Status({ isLoggedIn, unread }) {
  // 1. 早期 return
  if (unread === null) {
    return null; // null を返すと何も描画しない
  }

  return (
    <div>
      {/* 2. 三項演算子: どちらかを表示する */}
      {isLoggedIn ? <p>ようこそ</p> : <p>ログインしてください</p>}

      {/* 3. 論理積 (&&): 条件が真のときだけ表示する */}
      {unread > 0 && <span>未読が {unread} 件あります</span>}
    </div>
  );
}
```

<pre><code class="tips">true, false, null, undefined は、何も描画されない。そのため、三項演算子の片方に null を書いたり、論理積を使ったりして、表示を切り替えられる。
数値の 0 は描画される。unread &amp;&amp; ... のように、数値をそのまま論理積の左側に書くと、0 が画面に表示される。</code></pre>

### リスト表示

配列を `map` で JSX の配列に変換すると、リストとして表示できる。要素ごとに、兄弟の中で一意な **key** を指定する。

```jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

key は、並び替え・追加・削除があったときに、React が「どの要素がどれに対応するか」を判断するための目印。

| 書き方 | 説明 |
| --- | --- |
| `key={user.id}` | データが持つ、変わらない一意な ID を使う。基本はこれ。 |
| `key={index}` | 並び替えや削除をしない固定のリストなら使えるが、順序が変わる可能性があるときは避ける。 |
| `key={Math.random()}` | 毎回別の key になり、要素が毎回作り直されるため使ってはいけない。 |

<pre><code class="tips">key は、props としてコンポーネントの中からは読み取れない。値が必要な場合は、別の名前の props (id など) でも渡す。
1つの要素ではなく、複数の要素のまとまりに key を付けたい場合は、&lt;Fragment key={id}&gt; を使う (短縮形の &lt;&gt; には key を付けられない)。</code></pre>

---

## コンポーネント <a id="component" data-name="コンポーネント"></a>

コンポーネントは、画面の部品を表す関数。JSX を返す関数を定義して、HTML のタグのように `<コンポーネント名 />` と書いて使う。

```jsx
function Welcome() {
  return <h1>Welcome!</h1>;
}

export default function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
    </div>
  );
}
```

JavaScript の関数と同じように、同じコンポーネントを何度でも使い回せる。コンポーネントは、自分で `Welcome()` のように呼ぶのではなく、JSX に書いて React に呼んでもらう。

### props

props は、親から子のコンポーネントに渡す値。関数の引数に当たり、オブジェクトとしてまとめて渡される。分割代入で受け取ることが多い。

```jsx
function Greeting({ name = "Guest", age, children }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>{age} 歳</p>}
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Greeting name="Taro" age={25}>
      <p>タグの間に書いた内容は、children として渡される。</p>
    </Greeting>
  );
}
```

| 渡し方 | 説明 |
| --- | --- |
| `name="Taro"` | 文字列は、引用符で囲んで渡す。 |
| `age={25}` | 文字列以外 (数値、真偽値、配列、オブジェクト、関数など) は、波括弧で渡す。 |
| `disabled` | 値を書かない属性は、`true` を渡したことになる。 |
| `{...props}` | オブジェクトを展開して、複数の props をまとめて渡す。 |
| `children` | タグの間に書いた内容が、`children` という props で渡される。 |

関数も props として渡せる。子から親へ通知したいときは、親が関数を渡し、子がそれを呼び出す。

```jsx
function Parent() {
  function handleSelect(id) {
    console.log(`${id} が選ばれた`);
  }
  return <Item id={1} onSelect={handleSelect} />;
}

function Item({ id, onSelect }) {
  return <button onClick={() => onSelect(id)}>選ぶ</button>;
}
```

<pre><code class="caution">props は読み取り専用で、子のコンポーネントの中で書き換えてはいけない。
画面の内容を変えたい場合は、親が別の値を渡す (親の state を更新する) か、子が自分の state を持つ。</code></pre>

### コンポーネントは純粋な関数にする

コンポーネントは、レシピのようなもの。同じ材料 (props, state, context) を渡せば、いつも同じ料理 (JSX) ができる。そのため、レンダー中 (関数の本体を実行している間) は、次のことをしてはいけない。

- 関数の外にある変数を書き換える。
- 実行するたびに結果が変わる処理 (`Math.random()`、`Date.now()` など) の結果を、画面の内容に使う。
- 通信、タイマー、DOM の直接操作などの、外の世界に影響を与える処理 (副作用) をする。

```jsx
let count = 0;

// 悪い例: レンダーのたびに外の変数を書き換えている
function Counter() {
  count = count + 1;
  return <p>{count}</p>;
}
```

副作用が必要なときは、**イベントハンドラ**の中か、**Effect** の中に書く。

### 分割とファイル配置

1つのファイルに複数のコンポーネントを書くこともできるが、通常は1ファイル1コンポーネントにして、`export` / `import` で使う。

```jsx
// UserCard.jsx
export default function UserCard({ user }) {
  return <p>{user.name}</p>;
}

// App.jsx
import UserCard from "./UserCard.jsx";
```

<pre><code class="caution">コンポーネントの中で、別のコンポーネントを定義してはいけない。親が再レンダーされるたびに、子のコンポーネントが別物として作り直され、state が失われる。
子のコンポーネントは、必ずトップレベル (関数の外側) で定義する。</code></pre>

---

## レンダリングの仕組み <a id="rendering" data-name="レンダリング"></a>

React は、パラパラ漫画のように動く。state が変わるたびに、コンポーネントの関数を呼び直して「新しい1枚の絵 (JSX)」を作り、前の絵との**差分だけ**を実際の画面 (DOM) に反映する。

### 3つの段階

画面が更新されるまでには、次の3つの段階がある。

| 段階 | 内容 |
| --- | --- |
| トリガー | 最初の描画 (`render`) か、state の更新によって、描画が必要になる。 |
| レンダー | React がコンポーネントの関数を呼び出して、JSX (画面の設計図) を計算する。この段階では、DOM には触らない。 |
| コミット | 前回との差分を DOM に反映する。反映が終わると、Effect が実行される。 |

```
トリガー                 レンダー                       コミット
(初回 / state の更新) →  コンポーネントの関数を呼ぶ  →  前回との差分だけ DOM に反映
                         (JSX を作るだけ。               ↓
                          DOM は触らない)                ブラウザが画面を描画
                                                         ↓
                                                         Effect を実行
```

### state はスナップショット

レンダーのたびに、そのレンダー専用の props、state、イベントハンドラが作られる。1回のレンダーの中では、それらは**写真のように固定**されていて、途中で変わらない。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // 0 (この handleClick の中の count は、更新されない)
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

`setCount` は「次のレンダーで、この値にしてほしい」と React に依頼するだけで、実行中の関数内にある `count` は変わらない。新しい値は、次のレンダーで、新しい `count` として渡される。

### 再レンダーされるタイミング

- 自分の state が更新されたとき。
- 親のコンポーネントが再レンダーされたとき。子のコンポーネントは、props が同じでも再レンダーされる (`memo` や React Compiler で抑制できる)。

再レンダーは、コンポーネントの関数が再度呼ばれることを指す。DOM の更新は、前回との差分があったところだけに行われる。

### state が保持される条件

React は、コンポーネントの木構造の中での**位置**と**型**で、「前回と同じコンポーネントかどうか」を判断する。

| 状況 | state |
| --- | --- |
| 同じ位置に、同じコンポーネントを描画し続ける | 保持される |
| 同じ位置の、コンポーネントの種類が変わる | 破棄される (作り直される) |
| 描画されなくなる | 破棄される |
| 同じ位置・同じコンポーネントで、`key` が変わる | 破棄される (作り直される) |

<pre><code class="tips">状態をリセットしたいときは、key を変える方法が使える。
例えば、ユーザーを切り替えるときに &lt;Profile key={userId} /&gt; とすると、userId が変わるたびに Profile の state がリセットされる。</code></pre>

---

## フック <a id="hooks" data-name="フック"></a>

フック (Hook) は、`use` で始まる関数で、コンポーネントに state や副作用などの React の機能を「引っかける」ための仕組み。

### フックのルール

| ルール | 説明 |
| --- | --- |
| トップレベルでだけ呼ぶ | `if` 文、ループ、ネストした関数、早期 `return` の後などで呼んではいけない。 |
| 関数コンポーネントかカスタムフックの中でだけ呼ぶ | 通常の関数やクラスコンポーネントの中では呼べない。 |

React は、**呼び出された順番**で、各フックの状態を管理している。ロッカーの番号のようなもので、「1番目に呼んだ useState は1番のロッカー、2番目は2番のロッカー」と対応付けているため、レンダーごとに呼ぶ順番や数が変わると、別のロッカーを開けてしまう。

```jsx
function Bad({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState(""); // NG: 条件によって呼ぶ順番が変わる
  }
  const [count, setCount] = useState(0);
}
```

<pre><code class="tips">use は、このルールの例外で、条件分岐やループの中でも呼べる。
ルールの違反は、eslint-plugin-react-hooks が検出してくれる。</code></pre>

### 組み込みフックの一覧

| フック | 用途 |
| --- | --- |
| `useState` | state (状態) を持つ。 |
| `useReducer` | 複雑な state の更新ロジックを、reducer 関数にまとめる。 |
| `useContext` | Context の値を読む。 |
| `useRef` | 再レンダーを起こさない値や、DOM への参照を保持する。 |
| `useEffect` | コンポーネントを外部のシステムと同期する (描画の後に実行される)。 |
| `useLayoutEffect` | DOM の更新後、画面の描画前に実行する (要素の大きさの計測など)。 |
| `useInsertionEffect` | CSS-in-JS ライブラリ向け。通常のアプリでは使わない。 |
| `useMemo` | 計算結果をキャッシュする。 |
| `useCallback` | 関数をキャッシュする。 |
| `useTransition` | 更新を緊急でないものとして扱う。非同期の更新中かどうかも分かる。 |
| `useDeferredValue` | 値の更新を遅らせて、緊急の更新を優先する。 |
| `useId` | 一意な ID を生成する (サーバーとブラウザで一致する)。 |
| `useSyncExternalStore` | React の外にあるデータ (ストア、ブラウザの API) を購読する。 |
| `useImperativeHandle` | ref 経由で親に公開するメソッドを指定する。 |
| `useDebugValue` | カスタムフックの値を、React DevTools に表示する。 |
| `useActionState` | フォームの action の結果と、実行中かどうかを管理する。 <span class="label">19</span> |
| `useOptimistic` | 通信の完了を待たずに、画面を先に更新する (楽観的更新)。 <span class="label">19</span> |
| `useFormStatus` | 親の form が送信中かどうかを取得する (`react-dom` から import)。 <span class="label">19</span> |
| `use` | Promise や Context の値を読む。条件分岐の中でも呼べる。 <span class="label">19</span> |
| `useEffectEvent` | Effect の中で使う、最新の値を読むだけの関数を切り出す。 <span class="label">19.2</span> |

---

## state <a id="state" data-name="state"></a>

state は、コンポーネントが持つ、**時間とともに変わる値**。state が更新されると、コンポーネントが再レンダーされて、画面が最新の状態になる。

### useState

```javascript
const [state, setState] = useState(初期値);
```

`useState` は、「現在の値」と「値を更新する関数」の2つの要素を持つ配列を返す。配列の分割代入で、好きな名前を付けて受け取る。初期値は、最初のレンダーでだけ使われる。

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count} 回クリックされた</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

通常の変数 (`let count = 0;`) との違いは、次の2つ。

- 通常の変数は、レンダーのたびに初期化されて値が失われるが、state は React が保持してくれる。
- 通常の変数を書き換えても再レンダーされないが、state は更新関数を呼ぶと再レンダーされる。

### 前の値に基づいて更新する

前の値を使って次の値を決めるときは、更新関数に**関数**を渡す。

```jsx
function handleClick() {
  // 値を渡す場合: どれも同じ count (0) をもとに計算するため、1しか増えない
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}

function handleClick2() {
  // 関数を渡す場合: 直前の更新結果を受け取るため、3増える
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
}
```

更新関数に渡した関数は、キューに積まれて、次のレンダーの前に順番に実行される。引数 (`c`) には、その時点の最新の値が渡される。

### 初期値の遅延評価

初期値の計算が重い場合は、値ではなく関数を渡すと、最初のレンダーでだけ実行される。

```jsx
// 毎回のレンダーで loadTodos() が実行される (結果は最初の1回しか使われない)
const [todos, setTodos] = useState(loadTodos());

// 関数を渡すと、最初のレンダーでだけ実行される
const [todos, setTodos] = useState(() => loadTodos());
```

### オブジェクトや配列の state

オブジェクトや配列の state は、**元の値を書き換えず、新しい値を作って渡す**。React は、前の値と新しい値が同じ参照かどうか (`Object.is`) で変更を判断するため、同じ参照のままだと更新されたとみなされない。

| 操作 | 書き方 |
| --- | --- |
| オブジェクトのプロパティを更新 | `setUser({ ...user, name: "Hanako" })` |
| ネストしたプロパティを更新 | `setUser({ ...user, address: { ...user.address, city: "Osaka" } })` |
| 配列に追加 | `setItems([...items, newItem])` |
| 配列から削除 | `setItems(items.filter((item) => item.id !== id))` |
| 配列の要素を更新 | `setItems(items.map((item) => item.id === id ? { ...item, done: true } : item))` |
| 配列を並び替え | `setItems([...items].sort((a, b) => a.id - b.id))`<br>`setItems(items.toSorted((a, b) => a.id - b.id))` |

<pre><code class="caution">push、splice、sort、reverse などの元の配列を書き換えるメソッドや、obj.name = "..." のような代入を、state に対して直接行ってはいけない。書き換えたあとに set 関数を呼んでも、同じ参照のため再レンダーされない。
ネストが深くて更新が大変な場合は、Immer (use-immer) のようなライブラリも使える。</code></pre>

### state の設計

- **計算で求められる値は、state にしない。** 他の state や props から計算できる値は、レンダー中に計算する。

```jsx
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");

// state にせず、レンダー中に計算する
const fullName = firstName + " " + lastName;
```

- **同じ情報を複数の state に持たない。** 例えば、選択中のオブジェクトを丸ごと state に入れるのではなく、選択中の ID だけを持つ。オブジェクトが更新されたときに、コピーが古いままになるのを防げる。

### state のリフトアップ

複数のコンポーネントで同じ state を使いたい場合は、**共通の親**に state を持たせて、props で渡す。データは親から子へ (props)、変更の通知は子から親へ (イベント用の関数の props) 流れる。

```jsx
function Parent() {
  const [value, setValue] = useState("");

  return (
    <>
      <Input value={value} onChange={setValue} />
      <Preview value={value} />
    </>
  );
}

function Input({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}

function Preview({ value }) {
  return <p>入力中: {value}</p>;
}
```

### フォームの入力 (制御コンポーネント)

入力欄の値を state で管理する方法を、**制御コンポーネント**と呼ぶ。`value` (チェックボックスなら `checked`) と `onChange` をセットで指定する。

```jsx
function Form() {
  const [form, setForm] = useState({ name: "", agree: false, color: "red", memo: "" });

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function handleSubmit(e) {
    e.preventDefault(); // ページの再読み込みを防ぐ
    console.log(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} />

      <label>
        <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
        同意する
      </label>

      <select name="color" value={form.color} onChange={handleChange}>
        <option value="red">赤</option>
        <option value="blue">青</option>
      </select>

      {/* React では、textarea も value で値を指定する */}
      <textarea name="memo" value={form.memo} onChange={handleChange} />

      <button type="submit">送信</button>
    </form>
  );
}
```

値を state で管理せず、送信時に取得する方法を**非制御コンポーネント**と呼ぶ。初期値は `defaultValue` で指定する。

```jsx
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(formData.get("name"));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue="Taro" />
      <button type="submit">送信</button>
    </form>
  );
}
```

<pre><code class="tips">React 19 では、form の action に関数を渡す方法も使える。詳しくは「Suspense・Actions」の章を参照。</code></pre>

---

## イベント処理 <a id="event" data-name="イベント"></a>

JSX のタグに、`onClick` のようなキャメルケースの属性で、イベントハンドラ (関数) を指定する。

```jsx
function Button() {
  function handleClick() {
    alert("クリックされた");
  }

  return <button onClick={handleClick}>クリック</button>;
}
```

| | DOM (HTML) | React (JSX) |
| --- | --- | --- |
| 属性名 | `onclick` (小文字) | `onClick` (キャメルケース) |
| 渡すもの | 文字列のコード | **関数** |

<pre><code class="caution">onClick には、関数そのものを渡す。onClick={handleClick()} のように呼び出した結果を書くと、描画のときにその場で実行されてしまう。
引数を渡したい場合は、アロー関数で包む。onClick={() =&gt; handleDelete(id)}</code></pre>

### イベントオブジェクト

ハンドラは、引数としてイベントオブジェクトを受け取る。DOM のイベントとほぼ同じように使える。

```jsx
function SearchForm() {
  const [text, setText] = useState("");

  function handleChange(e) {
    setText(e.target.value); // イベントが起きた要素の値
  }

  function handleSubmit(e) {
    e.preventDefault(); // フォーム送信 (ページの再読み込み) を止める
    console.log(text);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={handleChange} />
    </form>
  );
}
```

| メソッド・プロパティ | 説明 |
| --- | --- |
| `e.target` | イベントが発生した要素 |
| `e.currentTarget` | ハンドラを指定した要素 |
| `e.preventDefault()` | ブラウザの標準の動作 (リンク遷移やフォーム送信など) を止める |
| `e.stopPropagation()` | 親要素へのイベントの伝播 (バブリング) を止める |

### 主なイベント

| イベント | 発生するタイミング |
| --- | --- |
| `onClick` | クリックしたとき |
| `onChange` | 入力値が変わったとき (React では、`input` イベントと同様に、入力のたびに発生する) |
| `onSubmit` | フォームを送信したとき |
| `onKeyDown` / `onKeyUp` | キーを押したとき / 離したとき |
| `onFocus` / `onBlur` | フォーカスが当たったとき / 外れたとき |
| `onMouseEnter` / `onMouseLeave` | マウスが要素に入ったとき / 出たとき |
| `onScroll` | スクロールしたとき |

イベントは、DOM と同じように子から親へ伝わる (バブリング)。キャプチャ段階で受け取りたい場合は、`onClickCapture` のように末尾に `Capture` を付ける。

<pre><code class="tips">レンダー中は純粋でなければならないが、イベントハンドラは、レンダー中には実行されないため、通信や state の更新などの副作用を自由に書ける。
「ユーザーの操作が原因の処理」はイベントハンドラ、「画面に表示されたことが原因の処理」は Effect に書く。</code></pre>

---

## Effect <a id="effect" data-name="Effect"></a>

Effect は、コンポーネントを React の**外の世界**(サーバーとの通信、ブラウザの API、タイマー、外部のライブラリなど) と**同期**させる仕組み。描画が終わったあとに実行される。

### useEffect

```javascript
useEffect(() => {
  // 同期の開始 (セットアップ)

  return () => {
    // 同期の停止 (クリーンアップ)
  };
}, [依存する値, ...]);
```

第2引数の依存配列によって、Effect が実行されるタイミングが決まる。

| 第2引数 | 実行されるタイミング |
| --- | --- |
| 省略 | 毎回のレンダーのあと |
| `[]` | 最初の描画のあとに1回だけ (クリーンアップは、画面から消えるときに実行される) |
| `[a, b]` | 最初の描画のあと、および `a` か `b` が前回から変わったレンダーのあと |

クリーンアップ関数は、**次に Effect が実行される前**と、**コンポーネントが画面から消えるとき**に呼ばれる。

「マウントされたら実行、更新されたら実行」ではなく、**「同期を開始する」「同期を停止する」**という見方で考えると分かりやすい。依存配列には、Effect の中で使っている props、state、コンポーネント内の変数を**すべて**書く。

### 例: イベントリスナー

```jsx
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);

    // クリーンアップ: 登録したリスナーを解除する
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <p>幅: {width}px</p>;
}
```

### 例: タイマー

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => s + 1); // 関数形式で更新して、古い seconds を参照しない
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{seconds} 秒</p>;
}
```

### 例: データの取得

```jsx
function User({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(`/api/users/${userId}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setUser(await res.json());
      } catch (e) {
        if (e.name !== "AbortError") setError(e);
      }
    }
    load();

    // userId が変わったときや画面から消えるときに、前のリクエストを中止する
    return () => controller.abort();
  }, [userId]);

  if (error) return <p>エラー: {error.message}</p>;
  if (!user) return <p>読み込み中...</p>;
  return <p>{user.name}</p>;
}
```

<pre><code class="caution">useEffect に渡す関数自体を async にしてはいけない。async 関数は Promise を返すため、クリーンアップ関数として扱われない。上の例のように、中で async 関数を定義して呼ぶ。</code></pre>

<pre><code class="tips">Effect でのデータ取得を自前で書くと、キャッシュ、重複リクエスト、読み込み中やエラーの管理など、考えることが多い。フレームワークのデータ取得機能や、TanStack Query、SWR のようなライブラリを使うのがおすすめ。</code></pre>

### Effect が不要なケース

Effect は、外部システムとの同期のための仕組み。次のような場合は、Effect を使わないほうがシンプルで、バグも減る。

| やりたいこと | Effect を使わない方法 |
| --- | --- |
| props や state から、表示する値を計算する | レンダー中に計算する。(state にもしない) |
| ユーザーの操作 (クリックなど) に応じて処理をする | イベントハンドラの中に書く。 |
| props が変わったときに、state をリセットする | コンポーネントの `key` を変える。 |
| state の変更を、親に伝える | state を更新するイベントハンドラの中で、親の関数も呼ぶ。 |

```jsx
// 悪い例: Effect で派生した値を state に入れている (余分に1回レンダーが増える)
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(firstName + " " + lastName);
}, [firstName, lastName]);

// 良い例: レンダー中に計算する
const fullName = firstName + " " + lastName;
```

### 開発時の二重実行

StrictMode を使っている開発環境では、コンポーネントの最初の描画のときに、Effect が「開始 → 停止 (クリーンアップ) → 開始」と**余分に1回**実行される。クリーンアップが正しく書かれているか確認するための仕組みで、本番では実行されない。

二重実行で問題が出る場合は、クリーンアップが足りていない可能性が高い。通信なら中止 (または結果を無視) する、リスナーなら解除する、といった後片付けを追加する。

### useEffectEvent <span class="label">19.2</span>

Effect の中で、props や state の**最新の値を読みたい**が、その値が変わっても Effect を**再実行したくない**場合に使う。

```jsx
import { useEffect, useEffectEvent } from "react";

function ChatRoom({ roomId, theme }) {
  // 最新の theme を読む関数 (Effect Event)
  const onConnected = useEffectEvent(() => {
    showNotification("接続しました", theme);
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on("connected", () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // theme は依存配列に入れなくてよい (theme が変わっても再接続しない)
}
```

<pre><code class="caution">useEffectEvent で作った関数は、Effect の中からだけ呼ぶ。他のコンポーネントに props として渡したり、依存配列に入れたりしてはいけない。
依存配列の警告を消すための手段ではなく、「値が変わっても再同期は不要」なロジックを切り出すために使う。</code></pre>

### useLayoutEffect

`useEffect` は、画面が描画されたあとに実行されるが、`useLayoutEffect` は、DOM の更新後、**画面の描画の前**に同期的に実行される。要素の大きさや位置を計測して、その結果で再レンダーすることで、一瞬の表示のちらつきを防ぎたい場合に使う。通常は `useEffect` を使う。

---

## ref <a id="ref" data-name="ref"></a>

ref は、**レンダーに使わない値**を保持するための仕組み。state と違って、値を変更しても再レンダーされない。主な用途は次の2つ。

- DOM 要素への参照を持つ。
- タイマーの ID や、前回の値など、画面の表示には影響しない値を保持する。

### useRef

```javascript
const ref = useRef(初期値); // { current: 初期値 } というオブジェクトが返る
```

返されるオブジェクトは、レンダーをまたいで同じものが使われる。値は `ref.current` で読み書きする。

```jsx
import { useRef } from "react";

function SearchBox() {
  const inputRef = useRef(null);

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>入力欄にフォーカス</button>
    </>
  );
}
```

要素の `ref` 属性に渡すと、その DOM 要素が `ref.current` に入る。描画前は `null` なので、使うのはイベントハンドラや Effect の中にする。

```jsx
function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null); // タイマー ID を保持する (画面には表示しない)

  function handleStart() {
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  return (
    <>
      <p>{seconds} 秒</p>
      <button onClick={handleStart}>開始</button>
      <button onClick={handleStop}>停止</button>
    </>
  );
}
```

### state との違い

| | state | ref |
| --- | --- | --- |
| 値を変更したときの再レンダー | する | しない |
| 変更の方法 | set 関数を呼ぶ | `ref.current` に直接代入する |
| レンダー中の読み書き | 読める | 読み書きしない (初期化は除く) |
| 向いている値 | 画面に表示する値 | 画面に影響しない値 (タイマー ID、DOM 要素など) |

<pre><code class="caution">ref.current は、レンダー中に読んだり書いたりしてはいけない。レンダーが純粋でなくなり、挙動が予測できなくなる。読み書きは、イベントハンドラや Effect の中で行う。</code></pre>

### 子コンポーネントの DOM への ref <span class="label">19</span>

React 19 では、関数コンポーネントは `ref` を通常の props として受け取れる。

```jsx
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />;
}

function Form() {
  const inputRef = useRef(null);
  return <MyInput placeholder="名前" ref={inputRef} />;
}
```

<pre><code class="tips">React 18 以前では、ref を受け取るために forwardRef で関数を包む必要があった。React 19 でも forwardRef は使えるが、将来は非推奨になる予定。</code></pre>

### ref コールバック

`ref` には、関数も渡せる。要素が DOM に追加されたときに呼ばれ、React 19 では、**クリーンアップ関数**を返せる。

```jsx
<div
  ref={(node) => {
    // node が DOM に追加されたときの処理
    const observer = new ResizeObserver(() => { /* サイズ変更の処理 */ });
    observer.observe(node);

    // 要素が DOM から取り除かれたときの処理
    return () => observer.disconnect();
  }}
/>
```

### useImperativeHandle

親に公開する操作を、`focus` のような**限られたメソッド**だけに絞りたい場合に使う。

```jsx
import { useImperativeHandle, useRef } from "react";

function FancyInput({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));

  return <input ref={inputRef} />;
}
```

---

## Context <a id="context" data-name="Context"></a>

props は親から子へ渡すため、深い階層の子孫に値を渡そうとすると、途中のコンポーネントも props を受け渡す必要がある (**props のバケツリレー**)。

Context を使うと、途中のコンポーネントを飛ばして、離れた子孫へ直接値を届けられる。社内放送のように、親が値を発信して、受信したいコンポーネントだけがそれを受け取る。

### 使い方

1. `createContext` で Context を作る。
2. 親で、Context のコンポーネントに `value` を渡して囲む。
3. 子孫で、`useContext` を使って値を読む。

```jsx
import { createContext, useContext, useState } from "react";

// 1. Context を作る (引数は、Provider がないときのデフォルト値)
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");

  return (
    // 2. value を渡して囲む
    <ThemeContext value={theme}>
      <Page />
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        テーマを切り替え
      </button>
    </ThemeContext>
  );
}

function Page() {
  return <Button />; // theme を受け渡す必要がない
}

function Button() {
  // 3. 値を読む
  const theme = useContext(ThemeContext);
  return <button className={theme}>OK</button>;
}
```

<pre><code class="tips">React 19 では、&lt;ThemeContext value={theme}&gt; のように、Context をそのままコンポーネントとして使える。React 18 以前では、&lt;ThemeContext.Provider value={theme}&gt; と書く必要があった (19 でも動くが、将来は非推奨になる予定)。
useContext(ThemeContext) の代わりに、use(ThemeContext) でも読める。use は条件分岐の中でも呼べる。</code></pre>

最も近い親の Context の値が使われるため、`Context` をネストして、一部の範囲だけ値を上書きすることもできる。

### Context を扱いやすくする

Context と、それを読む処理を、カスタムフックにまとめておくと使いやすい。

```jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return <AuthContext value={{ user, setUser }}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth は AuthProvider の中で使う必要がある");
  }
  return context;
}
```

<pre><code class="caution">Context の value が変わると、その Context を読んでいるすべてのコンポーネントが再レンダーされる。頻繁に変わる値には向いていない。
value にオブジェクトのリテラル ({ user, setUser } など) を直接書くと、親が再レンダーされるたびに新しいオブジェクトになり、読んでいるコンポーネントが毎回再レンダーされる。気になる場合は useMemo で包むか、React Compiler を使う。</code></pre>

---

## reducer <a id="reducer" data-name="reducer"></a>

state の更新ロジックが複雑になってきたら、`useReducer` を使って、更新の処理を **reducer 関数**にまとめられる。更新したい内容は、「**何が起きたか**」を表す **action** (オブジェクト) として `dispatch` で送る。

```javascript
const [state, dispatch] = useReducer(reducer, 初期値);

function reducer(state, action) {
  // action に応じて、新しい state を返す
  return 新しい state;
}
```

```jsx
import { useReducer, useState } from "react";

function todoReducer(todos, action) {
  switch (action.type) {
    case "added":
      return [...todos, { id: action.id, text: action.text, done: false }];
    case "toggled":
      return todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "deleted":
      return todos.filter((t) => t.id !== action.id);
    default:
      throw new Error(`不明な action: ${action.type}`);
  }
}

let nextId = 0;

function TodoApp() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [text, setText] = useState("");

  function handleAdd() {
    dispatch({ type: "added", id: nextId++, text });
    setText("");
  }

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAdd}>追加</button>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => dispatch({ type: "toggled", id: t.id })}
              />
              {t.text}
            </label>
            <button onClick={() => dispatch({ type: "deleted", id: t.id })}>削除</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

<pre><code class="caution">reducer は純粋な関数にする。通信などの副作用や、引数の state を直接書き換える処理を入れず、新しい state を返す。</code></pre>

| | useState | useReducer |
| --- | --- | --- |
| コードの量 | 少ない | 多い (reducer 関数が必要) |
| 向いているケース | 単純な値の更新 | 複数の state が連動する、更新のパターンが多い |
| 更新ロジックの置き場所 | 各イベントハンドラに散らばる | reducer にまとまる |
| テスト | コンポーネント経由で行う | reducer 単体 (純粋な関数) でテストできる |

<pre><code class="tips">Context と組み合わせて、state と dispatch を離れたコンポーネントに渡す方法もよく使われる。state 用と dispatch 用で Context を分けると、dispatch だけを使うコンポーネントは、state が変わっても再レンダーされなくなる。</code></pre>

---

## パフォーマンス <a id="performance" data-name="パフォーマンス"></a>

再レンダー自体は、悪いことではない。画面が遅いと感じてから、**計測して**(React DevTools の Profiler など) 原因を見つけて対処する。何もしなくても十分に速いことが多い。

### React Compiler

React Compiler は、ビルド時にコードを解析して、`useMemo`、`useCallback`、`React.memo` に相当するメモ化を**自動で**追加してくれるツール。2025年10月に 1.0 が安定版としてリリースされた。有効にすると、手動のメモ化を書かなくてもよくなる。

```
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
```

有効にする設定は、ビルドツールやフレームワークによって異なるため、公式の導入ガイドを参照する。

<pre><code class="tips">コンポーネントやフックが、React のルール (純粋なレンダー、state を直接変更しない、フックのルールなど) に従っていることが前提になる。ルールに反しているコードは、コンパイラが最適化をスキップする。
既存のコードにある useMemo や useCallback は、最初はそのまま残しておく。新しく書くコードでは、メモ化はコンパイラに任せて、細かく制御したいときだけ手動で書く。</code></pre>

### メモ化

コンパイラを使っていない場合や、細かく制御したい場合は、手動でメモ化する。

| 関数 | 説明 |
| --- | --- |
| `memo(Component)` | props が前回と同じ (浅い比較) なら、再レンダーをスキップする。 |
| `useMemo(() => 計算, [依存])` | 計算結果をキャッシュして、依存する値が変わったときだけ再計算する。 |
| `useCallback(関数, [依存])` | 関数をキャッシュして、依存する値が変わるまで同じ参照を使う。 |

```jsx
import { memo, useCallback, useMemo, useState } from "react";

const Row = memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>;
});

function List({ items, keyword }) {
  const [selectedId, setSelectedId] = useState(null);

  // keyword か items が変わったときだけ、絞り込みを再計算する
  const visibleItems = useMemo(
    () => items.filter((item) => item.name.includes(keyword)),
    [items, keyword]
  );

  // 同じ関数の参照を使い続けるため、memo した Row の再レンダーが防げる
  const handleSelect = useCallback((id) => setSelectedId(id), []);

  return (
    <ul>
      {visibleItems.map((item) => (
        <Row key={item.id} item={item} onSelect={handleSelect} />
      ))}
    </ul>
  );
}
```

<pre><code class="caution">memo で包んでも、props に毎回新しいオブジェクトや関数 (インラインで書いたもの) を渡していると、「前回と同じ」とみなされず、効果がなくなる。</code></pre>

### 緊急でない更新を後回しにする

入力欄のように即座に反応してほしい部分と、重い描画の部分を分けて、重い部分を後回しにできる。

```jsx
import { useDeferredValue, useState } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query); // 遅れて更新される値

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <SlowList query={deferredQuery} />
    </>
  );
}
```

state の更新を後回しにしたいときは、`useTransition` を使う (「Suspense・Actions」の章を参照)。

### コードの分割

`lazy` で、コンポーネントが最初に必要になったときに読み込む。読み込み中の表示は、`Suspense` で指定する。

```jsx
import { lazy, Suspense } from "react";

const Chart = lazy(() => import("./Chart.jsx"));

function Report() {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <Chart />
    </Suspense>
  );
}
```

### その他の工夫

- state は、**使う場所のなるべく近く**に置く。親の高い位置に置くと、更新のたびに広い範囲が再レンダーされる。
- 大量のリストは、見えている範囲だけを描画する**仮想化** (TanStack Virtual、react-window など) を使う。
- key を適切に指定する。

### Activity <span class="label">19.2</span>

`Activity` は、コンポーネントを**非表示にしても state を保持**したいときに使う。

```jsx
import { Activity } from "react";

function Tabs({ tab }) {
  return (
    <>
      <Activity mode={tab === "home" ? "visible" : "hidden"}>
        <Home />
      </Activity>
      <Activity mode={tab === "settings" ? "visible" : "hidden"}>
        <Settings />
      </Activity>
    </>
  );
}
```

| mode | 動作 |
| --- | --- |
| `visible` | 通常どおり表示する。 |
| `hidden` | 子を非表示にして、Effect を停止 (クリーンアップ) する。state は保持される。更新は、React に他にやることがなくなるまで後回しにされる。 |

条件付きの描画 (`{tab === "home" && <Home />}`) だと、切り替えるたびにコンポーネントが破棄されて state が失われるが、`Activity` なら失われない。

---

## Suspense・Actions <a id="async-ui" data-name="Suspense・Actions"></a>

非同期の処理を、画面の中で扱いやすくするための仕組み。

### Suspense

子のコンポーネントが「まだ表示できない」(コードやデータの読み込み中) とき、代わりに `fallback` を表示する。

```jsx
<Suspense fallback={<p>読み込み中...</p>}>
  <Profile />
</Suspense>
```

`lazy` によるコードの読み込み、`use` による Promise の読み取り、Suspense に対応したフレームワークやライブラリのデータ取得で、Suspense が働く。

### use <span class="label">19</span>

`use` は、Promise や Context の値を読むための関数。Promise が解決されるまで、コンポーネントは中断されて、一番近い `Suspense` の `fallback` が表示される。

```jsx
import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const message = use(messagePromise); // 解決されるまで fallback が表示される
  return <p>{message}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>読み込み中...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

<pre><code class="caution">クライアントのコンポーネントの中で作った Promise (use(fetch(...)) など) は、レンダーのたびに新しく作られるため、いつまでも解決された状態にならない。
Promise は、サーバーコンポーネントから渡す、キャッシュ機能を持つライブラリを使うなどして、レンダーをまたいで同じものを使えるようにする。</code></pre>

### useTransition

state の更新を**緊急でないもの (トランジション)**として扱う。トランジション中は、すでに表示されている画面が `fallback` に置き換わらず、更新中かどうかを `isPending` で知れる。

```jsx
import { useState, useTransition } from "react";

function Tabs() {
  const [tab, setTab] = useState("home");
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab); // この更新は、緊急でないものとして扱われる
    });
  }

  return (
    <>
      <button onClick={() => selectTab("posts")}>投稿</button>
      {isPending && <span>切り替え中...</span>}
      <TabContent tab={tab} />
    </>
  );
}
```

React 19 では、`startTransition` に **async 関数**も渡せる。トランジションの中で実行される非同期の関数を **Action** と呼び、完了するまで `isPending` が `true` になる。

```jsx
startTransition(async () => {
  const error = await updateName(name);
  if (error) {
    setError(error);
  }
});
```

<pre><code class="caution">await のあとに state を更新する場合は、その更新を、もう一度 startTransition で包む必要がある。</code></pre>

### form の action <span class="label">19</span>

`form` の `action` に関数を渡すと、送信時にその関数が **Action** として実行される。関数は、フォームの入力値を `FormData` として受け取る。

```jsx
function NameForm() {
  async function save(formData) {
    const name = formData.get("name");
    await updateName(name);
  }

  return (
    <form action={save}>
      <input name="name" />
      <button type="submit">保存</button>
    </form>
  );
}
```

<pre><code class="tips">&lt;form action={関数}&gt; では、preventDefault は不要。送信が成功すると、非制御のフォームの入力欄は、自動でリセットされる。</code></pre>

### useActionState <span class="label">19</span>

Action の結果と、実行中かどうかを管理する。

```jsx
import { useActionState } from "react";

function NameForm() {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error; // 次の state になる
      }
      return null;
    },
    null // 初期の state
  );

  return (
    <form action={submitAction}>
      <input name="name" />
      <button type="submit" disabled={isPending}>保存</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

`useActionState` には、「前回の state と `FormData` を受け取って、次の state を返す関数」と、初期の state を渡す。戻り値は、`[現在の state, form に渡す action, 実行中かどうか]`。

### useFormStatus <span class="label">19</span>

親の `form` が送信中かどうかを、子のコンポーネントから取得する。props で `pending` を受け渡さなくてよい。

```jsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>送信</button>;
}
```

<pre><code class="caution">useFormStatus は、form を描画しているコンポーネントと同じコンポーネントの中では、状態を取得できない。form の中に置いた、子のコンポーネントの中で呼ぶ。</code></pre>

### useOptimistic <span class="label">19</span>

通信の完了を待たずに、**成功したと仮定した画面**を先に表示する (楽観的更新)。Action が完了すると、本物の state に置き換わる。失敗した場合も、元の state に戻る。

```jsx
import { useOptimistic } from "react";

function Thread({ messages, sendMessage }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { text: newMessage, sending: true }]
  );

  async function formAction(formData) {
    addOptimisticMessage(formData.get("message")); // 先に画面へ反映する
    await sendMessage(formData);                   // 通信 (完了すると本物の messages に置き換わる)
  }

  return (
    <>
      {optimisticMessages.map((m, i) => (
        <p key={i}>
          {m.text} {m.sending && <small>(送信中...)</small>}
        </p>
      ))}
      <form action={formAction}>
        <input name="message" />
        <button type="submit">送信</button>
      </form>
    </>
  );
}
```

---

## エラー処理 <a id="error-handling" data-name="エラー処理"></a>

コンポーネントの描画中にエラーが発生すると、画面全体が消えてしまう。**エラーバウンダリ**で囲むと、その範囲のエラーを捕まえて、代わりの表示 (fallback) を出せる。

エラーバウンダリは、現状では**クラスコンポーネント**でしか書けない。自分で書くより、`react-error-boundary` ライブラリを使うのが一般的。

```jsx
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <ErrorBoundary fallback={<p>エラーが発生しました</p>}>
      <Profile />
    </ErrorBoundary>
  );
}
```

自分で書く場合は、次のようになる。

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  // エラーが起きたときに、次の state を決める
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // エラーの内容を記録する
  componentDidCatch(error, info) {
    console.error(error, info.componentStack);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
```

<pre><code class="caution">エラーバウンダリが捕まえるのは、描画中 (レンダー、ライフサイクル) のエラーだけ。イベントハンドラの中や、非同期の処理 (setTimeout、fetch の結果など) で起きたエラーは捕まえられないため、try / catch で処理する。</code></pre>

<pre><code class="tips">React 19 では、createRoot のオプションに onCaughtError (エラーバウンダリが捕まえたエラー)、onUncaughtError (捕まえられなかったエラー) を指定して、エラーを記録できる。</code></pre>

---

## カスタムフック <a id="custom-hook" data-name="カスタムフック"></a>

カスタムフックは、**state を持つロジック**を関数に切り出して再利用するための仕組み。`use` で始まる名前にして、中で他のフックを呼べる。

コンポーネントが「画面の部品」を切り出すものなら、カスタムフックは「ロジックの部品」を切り出すもの。

<pre><code class="tips">カスタムフックで共有されるのは、ロジックだけで、state そのものは共有されない。呼び出すたびに、独立した state が作られる。
同じレシピカード (フック) を、2つの台所 (コンポーネント) で使っても、材料 (state) は別々になる、というイメージ。</code></pre>

### 例: useToggle

```javascript
import { useState } from "react";

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle];
}
```

```jsx
function Menu() {
  const [open, toggleOpen] = useToggle();
  return (
    <>
      <button onClick={toggleOpen}>メニュー</button>
      {open && <nav>...</nav>}
    </>
  );
}
```

### 例: useDebounce

値の変化を、指定した時間だけ待ってから反映する。検索欄のように、入力のたびに通信したくない場合に使う。

```javascript
import { useEffect, useState } from "react";

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // 値が変わったら、待っていたタイマーを取り消す
  }, [value, delay]);

  return debounced;
}
```

### 例: useLocalStorage

```javascript
import { useEffect, useState } from "react";

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

<pre><code class="caution">サーバーで描画するフレームワーク (Next.js など) では、サーバー側に localStorage がないため、レンダー中に localStorage を読むとエラーになる。そのような環境では、Effect の中で読むなどの対処が必要になる。</code></pre>

### 例: useSyncExternalStore

React の外にあるデータ (ブラウザの API など) を購読するときは、`useSyncExternalStore` を使う。

```javascript
import { useSyncExternalStore } from "react";

function subscribe(callback) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,           // 購読の開始と解除
    () => navigator.onLine, // 現在の値 (ブラウザ)
    () => true           // サーバーで描画するときの値
  );
}
```

---

## React 19 の新機能と移行 <a id="whats-new" data-name="新機能と移行"></a>

### バージョンごとの主な新機能

| バージョン | 主な新機能 |
| --- | --- |
| 19.0 (2024年12月) | Actions、`useActionState`、`useOptimistic`、`useFormStatus`、`use`<br>form の `action` に関数を渡す<br>`ref` を props として受け取る / ref コールバックのクリーンアップ<br>`<Context>` を直接 Provider として使う<br>`<title>`、`<meta>`、`<link>` をコンポーネントの中に書ける (自動で head に移動される)<br>カスタム要素 (Web Components) への対応<br>Server Components と Server Actions (フレームワーク向け) |
| 19.1 (2025年6月) | デバッグ機能の追加や、Suspense まわりの改善が中心 |
| 19.2 (2025年10月) | `Activity`、`useEffectEvent`<br>`cacheSignal` (Server Components 向け)<br>Chrome DevTools のパフォーマンスプロファイルへの React 専用のトラック (Performance Tracks)<br>Partial Pre-rendering<br>`eslint-plugin-react-hooks` v6 |
| React Compiler 1.0 (2025年10月) | 自動メモ化を行うビルド時のツール (React 本体とは別にリリースされる) |

### React 18 以前からの書き換え

| 18 以前の書き方 | 19 での書き方・扱い |
| --- | --- |
| `ReactDOM.render` / `hydrate` | 削除された。`createRoot` / `hydrateRoot` を使う。 |
| `forwardRef` で ref を受け取る | `ref` を props として受け取る。`forwardRef` は将来非推奨になる予定。 |
| `<Context.Provider value={...}>` | `<Context value={...}>` |
| 関数コンポーネントの `defaultProps` | 削除された。デフォルト引数を使う。 |
| `propTypes` | 無視される。TypeScript などで型を付ける。 |
| 文字列の ref (`ref="input"`)、旧 Context (`contextTypes`) | 削除された。 |
| `react-dom/test-utils` の `act` | `react` から import する。 |

<pre><code class="tips">TypeScript の型 (@types/react) も 19 で変わっている。useRef には初期値の引数が必須になり、グローバルな JSX 名前空間は React.JSX になった。</code></pre>

---

## エコシステム <a id="ecosystem" data-name="エコシステム"></a>

React 本体は、画面を作る部分に絞られている。ルーティングやデータ取得などは、ライブラリを組み合わせて使う。フレームワーク (Next.js など) を使う場合は、その一部が最初から含まれている。

| 分野 | 代表的なライブラリ |
| --- | --- |
| ルーティング | React Router, TanStack Router |
| データ取得・キャッシュ | TanStack Query, SWR |
| グローバルな状態管理 | Zustand, Redux Toolkit, Jotai |
| フォーム | React Hook Form |
| バリデーション | Zod |
| スタイリング | CSS Modules, Tailwind CSS |
| UI コンポーネント | Radix UI, shadcn/ui, MUI |
| テスト | Vitest, React Testing Library, Playwright |

<pre><code class="tips">状態管理のライブラリは、最初から入れる必要はない。まずは useState、リフトアップ、Context と reducer で足りるかを確認する。サーバーから取得したデータは、グローバルな状態管理ではなく、TanStack Query のような取得・キャッシュ用のライブラリで扱うと、管理が楽になることが多い。</code></pre>

---

## TypeScript <a id="typescript" data-name="TypeScript"></a>

TypeScript を使うと、props や state の型を指定できて、間違った使い方をエディタが教えてくれる。ファイルの拡張子は `.tsx` にする。

### props の型

props の型は、`type` で定義して、引数の分割代入に指定する。

```tsx
import type { ReactNode } from "react";

type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary"; // ? を付けると省略できる
  children?: ReactNode;
};

function Button({ label, onClick, variant = "primary", children }: ButtonProps) {
  return (
    <button className={variant} onClick={onClick}>
      {label}
      {children}
    </button>
  );
}
```

### state・ref・イベント

```tsx
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type User = { id: number; name: string };

function Example() {
  // 初期値から型が推論できない場合は、型引数で指定する
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState(""); // string と推論される

  // DOM への ref は、要素の型を指定して、初期値に null を渡す
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} value={name} onChange={handleChange} />
    </form>
  );
}
```

### Context・reducer

```tsx
import { createContext, useReducer } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<Theme | null>(null); // Provider がないときは null

type Action =
  | { type: "added"; text: string }
  | { type: "deleted"; id: number };

type Todo = { id: number; text: string };

function reducer(todos: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case "added":
      return [...todos, { id: Date.now(), text: action.text }];
    case "deleted":
      return todos.filter((t) => t.id !== action.id);
  }
}
```

### よく使う型

| 型 | 用途 |
| --- | --- |
| `ReactNode` | 描画できるものすべて (JSX、文字列、数値、null、配列など)。`children` の型に使う。 |
| `React.JSX.Element` | JSX 式の型。 |
| `ComponentProps<"button">` | 指定した HTML 要素や、コンポーネントが受け取れる props の型。要素のラッパーを作るときに、継承して使える。 |
| `ChangeEvent<HTMLInputElement>` | input などの `onChange` のイベントの型。 |
| `FormEvent<HTMLFormElement>` | form の `onSubmit` のイベントの型。 |
| `MouseEvent<HTMLButtonElement>` | `onClick` のイベントの型。 |
| `Dispatch<SetStateAction<T>>` | `useState` の set 関数の型。props で渡すときに使う。 |

<pre><code class="tips">関数コンポーネントに React.FC を付ける書き方もあるが、必須ではない。props に型を付けて、普通の関数として書くのが一般的。</code></pre>

---

## 落とし穴 <a id="pitfalls" data-name="落とし穴"></a>

エラーにならずに動いてしまうため、知らないと原因に気づきにくい挙動をまとめる。

### コンポーネントの中でコンポーネントを定義する

親が再レンダーされるたびに、中で定義した関数が**新しい関数**として作られる。React は「別のコンポーネントに変わった」と判断して、子の DOM と state を毎回破棄して作り直す。

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  // NG: Parent が再レンダーされるたびに、別のコンポーネントになる
  function Child() {
    const [text, setText] = useState("");
    return <input value={text} onChange={(e) => setText(e.target.value)} />;
  }

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child /> {/* ボタンを押すたびに、入力した内容が消える */}
    </>
  );
}
```

<pre><code class="caution">コンポーネントは、必ずトップレベル (関数の外) で定義する。親の値を使いたい場合は、props で渡す。</code></pre>

### state を直接変更する

オブジェクトや配列を直接書き換えても、参照が変わらないため、React は更新を検知できない。

```jsx
const [items, setItems] = useState(["A", "B"]);

function handleAdd() {
  items.push("C");   // NG: 元の配列を書き換えている
  setItems(items);   // 同じ参照なので、再レンダーされない
}

function handleAdd2() {
  setItems([...items, "C"]); // 新しい配列を作って渡す
}
```

`push`、`splice`、`sort`、`reverse` などの元の配列を書き換えるメソッドは、`[...items].sort()` のようにコピーしてから使うか、`toSorted()`、`toReversed()` などを使う。

### set 関数を呼んでも、すぐには値が変わらない

```jsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);
  console.log(count); // 0 (更新前の値)

  setCount(count + 1);
  setCount(count + 1);
  // 3回呼んでも、次のレンダーの count は 1 (3 ではない)
}
```

前の値をもとに更新するときは、`setCount((c) => c + 1)` のように関数を渡す。更新後の値が必要なときは、新しい値を変数に入れて使う。

```jsx
const next = count + 1;
setCount(next);
console.log(next);
```

### key に index や Math.random() を使う

並び替えや削除があるリストで `key={index}` を使うと、要素と key の対応がずれて、state や入力内容が別の要素に引き継がれる。

```jsx
const [items, setItems] = useState(["A", "B", "C"]);

return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>
        {item} <input />
      </li>
    ))}
  </ul>
);
// 先頭の "A" を削除すると、0 番目の key は残るため、
// A の欄に入力していた内容が、B の欄に表示されたままになる
```

key には、データが持つ変わらない一意な ID (`item.id` など) を使う。`Math.random()` は、毎回別の key になって要素が作り直されるため使わない。

### 数値 0 が画面に表示される

```jsx
const items = [];

return (
  <div>
    {items.length && <List items={items} />}     {/* 0 が表示される */}
    {items.length > 0 && <List items={items} />} {/* 何も表示されない */}
  </div>
);
```

論理積 (`&&`) は、左辺が falsy ならその値を返す。`false`、`null`、`undefined` は描画されないが、`0` は描画される。左辺は、真偽値になる式にする。

### onClick に関数の呼び出しを書く

```jsx
<button onClick={handleClick()}>   {/* NG: 描画のときに実行される */}
<button onClick={handleClick}>     {/* OK: 関数を渡す */}
<button onClick={() => handleDelete(id)}> {/* OK: 引数が必要なときは、アロー関数で包む */}
```

`handleClick()` と書くと、クリックしたときではなく、描画のときに関数が実行される。その中で `setState` を呼んでいると、無限ループになることもある。

### Effect の依存配列

依存配列に、レンダーのたびに新しく作られるオブジェクトや配列を入れると、毎回「変わった」と判断されて、Effect が毎回実行される。

```jsx
function Search({ keyword }) {
  const [items, setItems] = useState([]);
  const options = { keyword, limit: 10 }; // 毎回新しいオブジェクト

  useEffect(() => {
    fetchItems(options).then(setItems); // setItems → 再レンダー → options が変わる → ...
  }, [options]); // 無限ループ
}
```

オブジェクトは Effect の中で作るか、文字列や数値などの値 (プリミティブ) だけを依存に入れる。

```jsx
useEffect(() => {
  fetchItems({ keyword, limit: 10 }).then(setItems);
}, [keyword]);
```

<pre><code class="caution">依存配列を省略すると、毎回のレンダーのあとに Effect が実行される。Effect の中で state を更新していると、無限ループになる。
依存配列の警告を、eslint-disable で消して済ませてはいけない。古い値を参照するバグの原因になる。</code></pre>

### Effect や setInterval の中で、古い値を参照する

コンポーネントのレンダーごとに、変数 (state や props) は固定される。依存配列に入れずに Effect を作ると、**その時点の古い値**を使い続ける。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // count は、最初のレンダーの 0 のまま
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{count}</p>; // 1 になったあと、変わらない
}
```

関数形式で更新すれば、古い値に依存しない。

```jsx
setCount((c) => c + 1);
```

### 開発中に Effect が2回実行される

StrictMode の開発環境では、Effect が「開始 → クリーンアップ → 開始」と余分に1回実行される。通信が2回送られているように見えるが、本番では1回になる。

<pre><code class="caution">二重実行を避けるために StrictMode を外したり、ref のフラグで2回目を無視したりしてはいけない。クリーンアップの書き方 (通信の中止、リスナーの解除など) が足りていないことを教えてくれているので、そちらを直す。</code></pre>

### レンダー中に副作用を書く

レンダーは、何度も呼ばれる可能性があるため、毎回同じ結果になる**純粋な処理**にする。

```jsx
function Card() {
  const id = Math.random();           // NG: レンダーのたびに値が変わる
  document.title = "Card";            // NG: DOM を直接書き換えている
  fetch("/api/log", { method: "POST" }); // NG: レンダーのたびに通信している
  return <div id={id}>...</div>;
}
```

| やりたいこと | 書く場所 |
| --- | --- |
| 一意な ID が欲しい | `useId` |
| 最初のレンダーでだけ決める値が欲しい | `useState(() => 値)` |
| DOM や外部システムを操作したい | Effect |
| 操作に応じて通信したい | イベントハンドラ |

### props を state にコピーする

```jsx
function Profile({ user }) {
  const [name, setName] = useState(user.name);
  // user が別のユーザーに変わっても、name は最初の値のまま
  return <p>{name}</p>;
}
```

`useState` の初期値は、最初のレンダーでしか使われないため、props が変わっても state には反映されない。props をそのまま使うか、親で `key={user.id}` を指定して、変わったときに作り直す。

### 入力欄の value と onChange

| 書き方 | 起きること |
| --- | --- |
| `value` だけを指定して、`onChange` がない | 入力できなくなる (読み取り専用になる)。開発中に警告が出る。 |
| 初期値が `undefined` や `null` の state を `value` に渡す | 非制御から制御に切り替わったという警告が出る。`value={text ?? ""}` のように、空文字にする。 |
| `value` と `defaultValue` の両方を指定する | 警告が出る。どちらか一方にする。 |

### 同じ位置のコンポーネントは state を引き継ぐ

```jsx
{isPlayerA ? <Counter person="A" /> : <Counter person="B" />}
// 切り替えても、同じ位置・同じ種類のコンポーネントなので、Counter の state が引き継がれる
```

別のコンポーネントとして扱いたい場合は、`key` を付ける。

```jsx
{isPlayerA ? <Counter key="A" person="A" /> : <Counter key="B" person="B" />}
```

### Context の value にオブジェクトを直書きする

```jsx
function Provider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext value={{ user, setUser }}>  {/* 再レンダーのたびに新しいオブジェクト */}
      {children}
    </UserContext>
  );
}
```

`value` が毎回新しいオブジェクトになるため、この Context を読んでいるすべてのコンポーネントが、毎回再レンダーされる。`useMemo` で包むか、React Compiler を使う。

### その他の罠

| 書き方 | 起きること | 対策 |
| --- | --- | --- |
| `useState(loadTodos())` | 初期値は最初しか使われないが、`loadTodos()` は毎回のレンダーで実行される | `useState(() => loadTodos())` |
| `useEffect(async () => { ... })` | async 関数は Promise を返すため、クリーンアップ関数として扱われない | 中で async 関数を定義して呼ぶ |
| `if` や早期 `return` のあとで `useState` を呼ぶ | 呼び出し順が変わって、エラーや誤動作になる | フックは、先頭のトップレベルで呼ぶ |
| `state.sort()`、`state.reverse()` | 元の配列を書き換えるため、再レンダーされない | `[...state].sort()`、`toSorted()` |
| `<>...</>` に `key` を付ける | 短縮形の Fragment には、key を付けられない | `<Fragment key={id}>` を使う |
| `class`、`for` 属性 | 警告が出て、意図したとおりに動かないことがある | `className`、`htmlFor` を使う |
| 子のコンポーネントの中で `props.key` を読む | `key` は props に含まれず、`undefined` になる | 別の名前の props でも渡す |
