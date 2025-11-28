---
title: C++
layout: default
---

# C++ <a id="top" data-name="TOP"></a>

- C++は、C言語を基盤にオブジェクト指向プログラミングの概念を取り入れた プログラミング言語。

---

## 型 <a id="type" data-name="型"></a>

### auto(型推論) <a id="auto" data-name="型推論"></a>
<span class="code-like">auto 変数名 = 初期値</span>

変数の宣言時に初期値を与えている場合、初期値と同じ型に推論してくれる。


<pre><code class="caution">ただし配列のautoによる初期化は、()ではエラーとなったり、{}だと環境依存になったり、型が配列ではなくなったりするので注意が必要。
</code></pre>

また、[for文](#範囲for)でも使える。

<div class="subtitle">参照型への型推論</div>

autoを使って参照として型推論したい場合は次のように記述する。

```cpp
auto& 変数名 = 式;
```


<div class="subtitle"><a id="auto戻り値推論"></a>auto戻り値推論 <span class="label">C++14以降</span> </div>
C++14以降ではauto戻り値推論が導入された。

```cpp
template<typename T, typename U>
auto add(T a, U b) {
    return a + b;  // ここから型を推論してくれる
}
```

---

### decltype(expr)
decltypeは式の型を取得するための演算子で、その式がどんな型になるのかを型推論したい時に使う。<br>
decltypeは変数の型修飾子(constや参照)も保持するため注意が必要。

<div class="subtitle">基本形</div>

```cpp
int x = 10;
decltype(x) y = 20;  // yはint型
```

<div class="subtitle">式を渡す</div>

```cpp
int a = 3;
double b = 4.5;

decltype(a + b) c = a + b;  // a+bはdoubleなので、cはdouble
```

<div class="subtitle">decltype((変数名)) の挙動に注意</div>

```cpp
int x = 10;
decltype(x) a;    // int
decltype((x)) b = x; // int&(括弧があるので左辺値扱い)
```

decltype((変数)) は式として評価されるので左辺値→参照型になる

<div class="subtitle">テンプレートで使う</div>

```cpp
template <typename T, typename U>
auto add(T a, U b) -> decltype(a + b) {
    return a + b;
}
```

C++14以降は[auto戻り値推論](#auto戻り値推論)で省略可能。

---

### 型に別の名前を与える

<span class="code-like">using 新たな型名 = 元の型名</span>

とすると型に別名(エイリアス)を付けることができる。<br>

```cpp
using integer = int;

void foo(int a){}
void foo(integer a){} // オーバーロードはできない
```

ただし、あくまで別名も使えるだけなのでオーバーロードには使えない。

---

### 型特性
型特性とは、その型がどういった特徴を持っているのかを調べる機能で、特にテンプレートにおいて、具体的な型に限定はしないものの、型の特徴によって処理を変えたりする場合に使う。

型特性で最も基本的なものは、型がどのような種類のものであるかを調べる述語のクラステンプレート。

<div class="subtitle">主要な述語のテンプレート</div>

|テンプレート|説明|
|---|---|
|std::in_integral<T>::value|Tが整数型ならtrue|
|std::is_floating_point<T>::value|Tが浮動小数点数型ならtrue|
|std::is_class<T>::value|Tがクラス型ならtrue|
|std::is_pointer<T>value|Tがポインタ型ならtrue|
|std::is_lvalue_reference<T>value|Tが左辺値参照型ならtrue|
|std::is_rvalue_reference<T>value|Tが右辺値参照型ならtrue|
|std::is_const<T>value|Tがconst付きの型ならtrue|
|std::is_signed<T>::value|Tが符号を扱える型ならtrue|
|std::is_unsigned<T>::value|Tが符号なしの数値型ならtrue|

述語のテンプレートは <span class="code-like">static_assert</span> と組み合わせるのが、基本的な使い方で、static_assertは、コンパイル時に条件式がfalseになると強制的にコンパイルエラーとなる構文。

<pre><code class="example">template &lt;typename T&gt;
class Vector2d {
    static_assert(std::is_signed&lt;T&gt;::value,
                  "Tは符号を扱える整数型である必要があります。");
    T x;
    T y;
};</code></pre>

第2引数にはエラーとなった理由などをメッセージとして与えることができるが、省略することもできる(省略自体は <span class="label">C++17</span> で追加)。

---

## コンテナ <a id="containaer" data-name="コンテナ"></a>

### 各コンテナの特徴

| コンテナ | 特徴 |
| --- | --- |
| array<br>vector | 配列を表すコンテナで、arrayは固定長、vectorは可変長。要素は連続したメモリ領域に格納される。vectorは要素を追加する際にメモリの再確保と要素の再配置が起こりうる。 |
| list<br>forward_list | 連結リストを表すコンテナで、froward_listは先頭方向から末尾方向へのみ要素を辿れる単方向リストで、listは先頭方向から末尾方向、末尾方向から先頭方向へ要素を辿れる双方向リスト。 |
| deque | 双方向キューを表すコンテナで、vectorとほぼ同じだが、先頭への挿入削除も高速に行える。 |
| queue<br>priority_queue<br>stack | それぞれキュー、優先順位付きキュー、スタックを表すコンテナ。キューは末尾に要素を追加して、先頭から要素を取り出せるFIFOのコンテナ。優先順位付きキューは、高い優先順位を持つ要素から順に取り出せるキューで、デフォルトでは値が大きい要素ほど高い優先順位が割り当てられる。スタックは、末尾に要素を追加し、末尾要素から処理していくFILOのコンテナ。 |
| set<br>multiset<br>unordered_set<br>unordered_multiset | 集合を表す連想コンテナ。setとmultisetはキーの比較関数(デフォルトでは`<`演算子)に基づいて要素の挿入、削除時に自動的にソートする。unorderedコンテナの場合は、キーのハッシュを使用して要素が管理されるため順序を持たない分、高速な検索ができる。setとunordered_setは等価の要素を複数格納できない。multisetとunordered_multisetは複数格納できる。 |
| map<br>multimap<br>unordered_map<br>unordered_multimap | setは値自体をキーとしていることに対して、mapではキーと値のペアで保持するという連想コンテナ。辞書とも呼ばれる。 |
| basic_string | 文字列を格納するコンテナとして扱うことができ、標準アルゴリズムを使用できる。 |

### 各コンテナ共通のメソッド

<table>
    <caption>ほぼ全ての標準コンテナが持つ基本メソッド</caption>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>size()</td><td>要素数を返す</td></tr>
    <tr><td>empty()</td><td>要素が空かどうかを返す</td></tr>
    <tr><td>clear()</td><td>すべて削除</td></tr>
    <tr><td>swap(other)</td><td>他の同型コンテナと中身を交換</td></tr>
    <tr><td>begin(), end()</td><td>先頭・終端イテレータを取得</td></tr>
    <tr><td>cbegin(), cend()</td><td>const版イテレータを取得</td></tr>
    <tr><td>rbegin(), rend()</td><td>逆順イテレータを取得</td></tr>
    <tr><td>crbegin(), crend()</td><td>const版逆順イテレータを取得</td></tr>
</table>
※queue, stack, priority_queueはbegin/endを持たない。

### シーケンスコンテナ共通メソッド

<table>
    <caption>vector, deque, list, forward_listなど</caption>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>front()</td><td>先頭要素への参照</td></tr>
    <tr><td>back()</td><td>末尾要素への参照(forward_list除く)</td></tr>
    <tr><td>push_back(value)</td><td>末尾に追加</td></tr>
    <tr><td>pop_back()</td><td>末尾から削除(forward_list除く)</td></tr>
    <tr><td>insert(pos, value)</td><td>指定位置に挿入</td></tr>
    <tr><td>erase(pos)</td><td>指定位置を削除</td></tr>
    <tr><td>resize(n)</td><td>サイズ変更</td></tr>
    <tr><td>assign(n, value)</td><td>全要素を特定値で再構成</td></tr>
    <tr><td>emplace(pos, args...)</td><td>位置に直接構築して挿入</td></tr>
    <tr><td>emplace_back(args...)</td><td>末尾に直接構築して挿入</td></tr>
</table>
※forward_listだけはpush_front系メソッドのみ(単方向リストのため)

### 連想コンテナ共通

<table>
    <caption>set, map, multiset, multimap</caption>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>insert(value)</td><td>要素を挿入(重複を自動処理)</td></tr>
    <tr><td>emplace(args...)</td><td>直接構築して挿入</td></tr>
    <tr><td>erase(pos or key)</td><td>イテレータまたはキー指定で削除</td></tr>
    <tr><td>find(key)</td><td>要素を検索</td></tr>
    <tr><td>count(key)</td><td>該当キーの個数(setでは0か1)</td></tr>
    <tr><td>lower_bound(key)</td><td>key以上の最初の要素イテレータ</td></tr>
    <tr><td>upper_bound(key)</td><td>keyより大きい最初の要素イテレータ</td></tr>
    <tr><td>equal_range(key)</td><td>lower_boundとupper_boundのペア</td></tr>
    <tr><td>key_comp()/value_comp()</td><td>比較関数取得</td></tr>
</table>

### 連想コンテナ(map系)特有

<table>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>operator[](key)</td><td>指定キーの要素参照(存在しなければ作成)</td></tr>
    <tr><td>at(key)</td><td>指定キーの要素参照(存在しなければ例外)</td></tr>
    <tr><td>extract(key)</td><td>要素を抜き出して保持(C++17~)</td></tr>
    <tr><td>contains(key)</td><td>キーの存在確認(C++20~)</td></tr>
</table>

### コンテナアダプタ

<table>
    <caption>queue, stack, priority_queue</caption>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>push(value)</td><td>要素を追加</td></tr>
    <tr><td>emplace(args...)</td><td>直接構築して追加</td></tr>
    <tr><td>pop()</td><td>要素を取り出して削除</td></tr>
    <tr><td>front()</td><td>先頭要素を参照(queue)</td></tr>
    <tr><td>back()</td><td>末尾要素を参照(queue)</td></tr>
    <tr><td>top()</td><td>最上位要素を参照(stack/priority_queue)</td></tr>
</table>
※これらは内部コンテナ(通常deque)をラップしているためbegin()やinsert()などは非公開

### イテレータ
イテレータは反復子とも呼ばれ、コンテナ内の各要素を参照するためのポインタのようなもの。

1. 比較演算子(!=)で比較できる`(first != last)`。
2. 間接参照演算子(*)で要素を参照できる。
3. インクリメント演算子(++)で次の要素を指す。
4. 間接参照演算子(*)によって要素を書き換えられる。
5. デクリメント演算子(--)で1つ手前の要素を指す。
6. 加算/減算演算子(+/-)によって整数値を足す/引くことで任意の数だけ進んだり戻ったりできる。

1～3の要件を満たすイテレータは<b>入力イテレータ</b>、

1と3と4を満たすなら<b>出力イテレータ</b>、

1～4を満たすなら<b>順方向イテレータ</b>、

1～5を満たすなら<b>双方向イテレータ</b>、

1～6を満たすなら<b>ランダムアクセスイテレータ</b>と呼ぶ。

---

### 固定長配列 <br> `<array>`

### 可変長配列 <br> `<vector>`

### 単方向連結リスト <br> `<forward_list>`

### 双方向連結リスト <br> `<list>`

### 両端キュー <br> `<deque>`

### キュー <br> `<queue>`

### 優先順位付きキュー <br> `<priority_queue>`

### スタック <br> `<stack>`

### 順序付き集合(重複不可) <br> `<set>`

### 順序付き集合(重複可能) <br> `<multiset>`

### 順序なし集合(重複不可) <br> `<unordered_set>`

### 順序なし集合(重複可能) <br> `<unordered_multiset>`

### 順序付き連想配列(キーの重複不可) <br> `<map>`

### 順序付き連想配列(キーの重複可能) <br> `<multimap>`

### 順序なし連想配列(キーの重複不可) <br> `<unordered_map>`

### 順序なし連想配列(キーの重複可能) <br> `<unordered_multimap>`



## 変数 <a id="valiable" data-name="変数"></a>

### 変数の初期化
変数の初期化には4通りの構文がある。

```cpp
int a = 10;
int b(20);
int c{30};
int d = {40};
```

---

### constとconstexpr

```cpp
const int i = 10; // 値の変更ができなくなる
const int j = func(); // 実行時に値が確定してもいい
```

このように`const`を付けて変数を宣言すると以降、値の再代入ができなくなる。

```cpp
constexpr int max_size = 100; // コンパイル時に値が確定するのでok
```

変数宣言に`constexpr`を付けると、コンパイラにこの変数はコンパイル時に値が確定してるはずだ、
ということを明示して宣言することができ、コンパイル時に値の計算がされ実行時のオーバーヘッドを削減できる。<br>
コンパイル時に値が確定していない場合はコンパイルエラーとなる。

```cpp
constexpr int square(int x) {
    return x * x;
}
```

一方`constexpr`関数(コンストラクタも同様)の場合は引数がコンパイル時定数であればコンパイル時に評価され、引数が実行時に決まる値の場合は通常の関数として実行時に評価される。<br>
ただし`constexpr`関数はコンパイル時に実行できることが前提なので、副作用を伴う処理や動的確保や実行時にしか決まらない値を使う場合には使えず、コンパイルエラーとなる。またコンストラクタに使用する場合、メンバが`vector`のように動的にメモリ確保する型は`constexpr`のオブジェクトとして構築できない。

---

### 左辺値と右辺値
変数・引数・数値といった値は、大別して左辺値と右辺値という2つに分類される。

<div class="subtitle">左辺値(lvalue)</div>

- 値を代入することができ、式の評価後もオブジェクトが存在し続ける。
- &でアドレスが取れる。
- 代入式の左側に置ける(名前の由来であり、必ずしも左限定ではない)。

<div class="subtitle">右辺値(rvalue)</div>

- 一時的な値で、式が終わると消える。
- 通常はアドレスを取れない。
- 関数の戻り値やリテラル、計算結果など。

---

### ポインタ

基本的に[C言語]({{ site.baseurl }}/pages/c/c#pointer)と同じ。

---

### 参照

<div class="subtitle">基本構文</div>

```cpp
int x = 10;
int& r = x;  // rはxへの参照
r = 20;      // OK: xの値を変更できる
```

- 参照は宣言時に初期化する必要がある。
- 後から参照先を変更することはできない。
- <span class="code-like">const</span> を付けると参照先の値を書き換えられなくなる。

---

## 制御構文 <a id="control-syntax" data-name="制御構文"></a>

### if文
<div class="subtitle">初期化付きif文 <span class="label">C++17以降</span> </div>

```cpp
if (型 変数名 = 式; 条件)
{
    //
}
```

通常ではif文の前に変数を用意してif文で評価するような文をまとめることができる。

```cpp
int result = func();
if (result == 0) 
{
    //
}
```

これが

```cpp
if (int result = func(); result == 0)
{
    //
}
```

このように書ける。

---

### for文
<div class="subtitle"><a id="範囲for"></a>範囲for</div>

<span class="code-like">for (型 変数名: 配列)</span>

とすると配列の各要素を順番に回すことができる。

<span class="code-like">for (auto 変数名: 配列)</span>

とすると配列の要素の型に自動で推論される。

---

### switch文
<div class="subtitle">初期化付きswitch文 <span class="label">C++17以降</span> </div>
switch文も初期化付きif文と同じように書ける。

```cpp
switch (型 変数名 = 式; 条件)
{
    //
}
```

---

## 関数 <a id="fuction" data-name="関数"></a>

### 関数のオーバーロード
C++では引数の数や引数の型が違う、同じ名前の関数を複数定義することができる。

```cpp
int func(int a, int b)
{
    return a + b;
}

int func(int a, int b, int c)
{
    return func(a, b) + c; // 別の関数に委譲することもできる
}
```

---

### デフォルト引数
関数の呼び出しの時に実引数が省略された場合に渡すデフォルト値を指定することができる。

```cpp
int sum(int a, int b = 0, int c = 0)
{
    return a + b + c;
}

sum(4, 6) // 実引数を左から順番に渡し、cはデフォルト値が使われる

sum(5) // bとcがデフォルト値
```

---

### 関数オブジェクト
関数オブジェクトとは、関数のように振る舞うオブジェクトで、クラスや構造体に関数呼び出し演算子 <span class="code-like">operator()</span> を定義したもの。

```cpp
struct Adder // 関数オブジェクト
{
    int value;
    Adder(int v) : value{v} {}
    // 関数呼び出し演算子をオーバーロード
    int operator()(int x) const
    {
        return x + value;
    }
};

int main()
{
    Adder add5{5};
    std::cout << add5(10) << std::endl; // 関数のように振る舞う
    // 15
}
```

---

### ラムダ式
ラムダ式とはその場で関数を定義する構文で、述語を必要とするアルゴリズムや、コールバック関数を登録するような場合に強力な機能。

<div class="subtitle">基本構文</div>

```cpp
[](引数) -> 戻り値の型 { 関数の処理内容 };
```

戻り値は省略可能。ただし、複数のreturn文で異なる型を返す場合エラーとなる。

<div class="subtitle">キャプチャ</div>
[]の中にラムダ式を定義した時点のスコープにある変数をキャプチャして使うことができる。

<div class="subtitle">コピーキャプチャ</div>
<span class="code-like">```auto func = [a]() {}```</span><br>
指定した変数のみをコピーキャプチャ。<br>
コピーキャプチャはデフォルトで <span class="code-like">const</span> となり、キャプチャされた変数の書き換えはできない。<br>
キャプチャされた変数の値を書き換えたい場合は <span class="code-like">mutable</span> を指定する。<br>
<span class="code-like">```[=]() mutable { 関数の処理内容 };```</span><br>
キャプチャした時点の変数の値をコピーするので、元の変数の値が書き換えられてもキャプチャした変数の値は変わらない。<br>
あくまでコピーキャプチャは値のコピーなので値を書き換えても元の変数の値は変わらない。

<div class="subtitle">参照キャプチャ</div>
<span class="code-like">```auto func = [&a]() {}```</span><br>
指定した変数のみを参照キャプチャ。<br>
参照でキャプチャした場合は、デフォルトで値の書き換えが可能で、書き換えると元の変数の値も書き換えられる。<br>
元の変数が <span class="code-like">const</span> の場合は書き換えができない。

<div class="subtitle">デフォルトコピーキャプチャ</div>
<span class="code-like">```auto func = [=]() {}```</span><br>
ラムダ式を定義した時点のスコープの全ての変数をコピーキャプチャする。<br>
ラムダ式内で使っている変数をコンパイラが自動でキャプチャしてくれるのでパフォーマンスには影響しない。

<div class="subtitle">デフォルト参照キャプチャ</div>
<span class="code-like">```auto func = [&]() {}```</span><br>
ラムダ式を定義した時点のスコープの全ての変数を参照キャプチャする。

<div class="subtitle">組み合わせ</div>

```cpp
[=, &a, &b]() {} // デフォルトでコピー、aとbは参照
[&, d, e]() {}   // デフォルトで参照、dとｅはコピー
```

[]の中にはどれをどのようにキャプチャするか指定できる。
デフォルトは先頭に、`&`か`=`のいずれかしか置けない。

---

### ラムダ式を使うメリット

- 関数を書く手間を減らせる

    わざわざ別の関数や関数オブジェクト(struct + operator())を作らなくても、その場で処理を書ける。

    ```cpp
    #include <algorithm>
    #include <vector>
    #include <iostream>

    int main()
    {
        std::vector<int> v{3, 1, 4, 1, 5};

        // ラムダ式で降順ソート
        std::sort(v.begin(), v.end(), [](int a, int b) {
            return a > b;
        });

        for (int x : v) std::cout << x << ' ';
    }
    ```

- スコープ内の変数をキャプチャできる

    関数に引数として渡さなくても、ラムダ式の外側で定義された変数を直接使える。特に関数オブジェクトや関数ポ
    インタでは難しい、ローカル変数の取り込みが可能。

    ```cpp
    #include <iostream>
    #include <vector>
    #include <algorithm>

    int main()
    {
        int threshold = 3;
        std::vector<int> v{1, 2, 3, 4, 5};

        // threshold をキャプチャしてフィルタ
        v.erase(std::remove_if(v.begin(), v.end(), [threshold](int x) {
            return x < threshold;
        }), v.end());

        for (int x : v) std::cout << x << ' ';
    }
    ```

- 即席で名前のない関数オブジェクトを作れる

    STLアルゴリズムやイベントコールバックの引数として、その場で処理を渡せる。

    クラスにわざわざ関数メンバを用意する必要がなくなる。

- 型推論が効く

    ラムダ式は自動的に関数オブジェクトの型が生成されるので、自分で関数オブジェクト型を書く必要が無い。

    autoと組み合わせれば、関数ポインタや複雑なテンプレート型を明示せずに使える

    ```cpp
    auto func = [](int x) { return x * 2; };
    std::cout << func(5) << "\n";  // 10
    ```

- 関数オブジェクトより柔軟

    ローカル変数をキャプチャできる点で、従来のstruct関数オブジェクトより便利。

    関数ポインタにはできないこと(キャプチャやジェネリックラムダ)ができる。

- ジェネリックラムダ <span class="label">C++14以降</span>

     引数の型を <span class="code-like">auto</span> にして汎用関数として使える。

    ```cpp
    auto print = [](auto x) { std::cout << x << "\n"; };
    print(42);      // int
    print("Hello"); // const char*
    ```

---

### inline
inlineは関数や変数の定義をヘッダファイルに直接書けるようにする仕組みで、通常ヘッダファイルに直接定義を書いて複数のファイルから読み込むと多重定義でエラーとなるが、 <span class="code-like">inline 戻り値 関数名([引数]) {}</span> とするとエラーにならない。

```cpp
// math_utils.h
inline int square(int x)
{
    return x * x;
}
```

クラス内定義の関数やテンプレート関数は暗黙的にinline扱いとなる。

<span class="label">C++17以降</span> では

```cpp
// header.h
inline const int MAX_USERS = 100; // 複数のcppでincludeしてもOK
```

という書き方ができる。

<span class="label">C++11/14</span> では

```cpp
constexpr int MAX_USERS = 100;  // これも暗黙にinlineになる
```

<pre><code class="caution"><span class="code-like">#define</span> は型安全ではないので、C++では可能な限り型安全な <span class="code-like">inline</span> を使うべき。
</code></pre>

---

### 無名名前空間
他のソースファイルから使うことを想定していない、ヘルパー関数のようなものを作る時に、無名名前空間を使うとそのソースファイルの中でのみ有効な関数や変数を定義できる。

```cpp
namespace
{
    // 関数や変数
}
```

なおC言語では <span class="code-like">static int secret = 123;</span> とすると内部リンケージとなり、他のファイルからはアクセスできない。

---

## クラス <a id="class" data-name="クラス"></a>

### メンバ変数

---

### メンバ関数

---

### コンストラクタ
コンストラクタはクラスのインスタンス化のときに1度だけ必ず呼ばれる特殊なメンバ関数で、初期化処理を自動化できる。

<div class="subtitle">基本構文</div>

```cpp
class クラス名
{
public:
    クラス名(); // コンストラクタの宣言
};

// コンストラクタの定義
クラス名::クラス名() [: メンバ変数(初期値), メンバ変数(初期値)...] // メンバ初期化リスト
{
    // コンストラクタの本体
}
```

<pre><code class="caution">初期化リストは、値の評価がコードを書いた順番ではなくクラスの宣言順で行われるため、値が他の初期化に依存する場合は宣言の順番に注意</code></pre>

---

### デフォルトコンストラクタ
デフォルトコンストラクタとは、引数を取らないコンストラクタの事で、そのクラスのオブジェクトを <span class="code-like">T obj;</span> や <span class="code-like">T obj{};</span> (C++11以降では{}が推奨)のように引数なしでインスタンス化する時に呼ばれるコンストラクタ。

デフォルトコンストラクタを定義していなくても、コンパイラにより自動生成される場合がある。

<div class="subtitle">デフォルトコンストラクタの自動生成ルール</div>

- メンバ変数が組み込み型であれば自分で定義しなくても自動で生成される(この場合、値はゴミ)。
- ユーザー定義のコンストラクタがあれば自動生成されない。
- 強制的に作らせる場合は <span class="code-like"> = default</span> を使う。

    ```cpp
    struct Foo {
        int x;
        Foo(int n) : x{n} {}
        Foo() = default;  // 明示的にデフォルトコンストラクタを自動生成
    };

    Foo f;  // OK
    ```

- 逆に作らせたくない場合は <span class="code-like">= delete</span> を使う。

    ```cpp
    struct Foo {
        Foo() = delete;  // デフォルトコンストラクタを禁止
    };

    Foo f; // コンパイルエラー
    ```

---

### デストラクタ
デストラクタはクラスのインスタンスが破棄されるときに呼ばれる特殊なメンバ関数で、メモリの解放や後始末を行う。

<pre><code class="caution">デストラクタ内でクラス自身のメモリを解放するのは、インスタンスがスタックに生成された場合に二重解放となり危険。
デストラクタ内でのメモリの解放は、メンバ変数に動的メモリへのポインタを持っている場合に限る。</code></pre>

<div class="subtitle">基本構文</div>

```cpp
class クラス名
{
public:
    ~クラス名(); // デストラクタの宣言
};

// デストラクタの定義
クラス名::~クラス名()
{
    // デストラクタの本体
}
```

デストラクタはオーバーロードができず、引数も、戻り値もない。

---

### explicit指定子
以下のような単引数のコンストラクタは、暗黙的にそのコンストラクタが呼ばれる。<br>
ただ、書き方によってはコンストラクタの呼び出しを意図していないことがあり、見た目では非常に分かりづらい。<br>
そこで、コンストラクタに <span class="code-like">explicit</span> を付けると暗黙的なコンストラクタの呼び出しを禁止することができる。

```cpp
struct Foo {
    int i;
    Foo(int i) : i{i} {}
};

Foo a = 10;  // Foo{int} が暗黙的に呼ばれる
```

```cpp
explicit Foo(int) : i{i} {}
```

特に理由がなければ <span class="code-like">explicit</span> を指定するようにした方がいい。

---

### フレンド関数

フレンド関数を使うと非公開(`private`)のメンバ変数に、非メンバ関数からアクセスすることが可能となる。<br>
非メンバ関数をフレンド関数として宣言するには、その非メンバ関数のプロトタイプ宣言に <span class="code-like">friend</span> を付けたものをクラス内に記述する。

```cpp
class Vec
{
public:
    float x;
    float y;

    Vec() : x(0), y(0) {}
    Vec(float x, float y) : x{x}, y{y} {}
    friend Vec add(Vec &, Vec &); // フレンド関数
};

Vec add(Vec &v1, Vec &v2)
{
    Vec result{};
    result.x = v1.x + v2.x;
    result.y = v1.y + v2.y;
    return result;
}

int main()
{
    Vec v1{1.5, 2.5}, v2{3.3, 4.2};
    Vec v3 = add(v1, v2);
    std::cout << v3.x << " " << v3.y << std::endl;
}
```

---

### 演算子のオーバーロード

演算子のオーバーロードとは、既存の演算子をクラスと紐づけて意味を再定義できる仕組み。

<div class="subtitle">基本構文</div>

```cpp
戻り値の型 operator演算子(引数);
```

<div class="subtitle">メンバ関数としての単項・二項演算子</div>
メンバ関数として単項演算子をオーバーロードする場合は、引数をひとつ渡す必要があるが、メンバ関数となる演算子のオーバーロードが対象のクラスと紐づいているので、暗黙的に <span class="code-like">this</span> ポインタがその対象となるオブジェクトを指す。つまり引数なしでオーバーロードすることにより記述できる。<br>
一方、二項演算子の場合は左辺オペランドがクラス自身で右辺オペランドが関数の引数となる。

<div class="subtitle">非メンバ関数としての単項・二項演算子</div>
非メンバ関数(またはフレンド関数)として単項演算子をオーバーロードする場合は、明示的に引数としてオペランドを渡す必要がある。<br>
二項演算子の場合は第１引数が左辺オペランドで第２引数が右辺オペランドとなる。

<div class="subtitle">メンバ関数として定義</div>

```cpp
class Vec
{
public:
    int x, y;
    Vec(int x, int y) : x{x}, y{y} {}

    // +演算子のオーバーロード
    Vec operator+(const Vec &other) const
    {
        return Vec(x + other.x, y + other.y);
    }
};

int main()
{
    Vec a(1, 2), b(3, 4);
    Vec c = a + b; // a.operator+(b) が呼ばれる
    std::cout << c.x << ", " << c.y << std::endl; // 4, 6
}
```

<div class="subtitle">非メンバ関数として定義</div>
特に左辺オペランドが自作クラスではない場合や、 <span class="code-like">&gt;&gt;/&lt;&lt;</span> のようなストリーム演算子でよく使われる。

```cpp
class Vec
{
public:
    int x, y;
    Vec(int x, int y) : x(x), y(y) {}
};

// 出力用 << のオーバーロード
std::ostream &operator<<(std::ostream &os, const Vec &v)
{
    os << "(" << v.x << ", " << v.y << ")";
    return os;
}

int main()
{
    Vec v(5, 7);
    std::cout << v << std::endl; // operator<<(cout, v) が呼ばれる
}
```

<div class="subtitle">フレンド関数として定義</div>

```cpp
class Integer
{
    int m_i;

public:
    Integer(int i) : m_i{i} {}
    void show(void) { std::cout << m_i << std::endl; }
    friend int operator-(const Integer i);                // 単項演算子
    friend int operator-(const Integer lhs, Integer rhs); // 二項演算子
};

int operator-(const Integer i) // 単項演算子
{
    return -i.m_i;
}
int operator-(const Integer lhs, Integer rhs) // 二項演算子
{
    return lhs.m_i - rhs.m_i;
}

int main()
{
    Integer x{20}, y{8};
    std::cout << -x << std::endl; // -20

    std::cout << x - y << std::endl; // 12
}
```

<div class="subtitle">オーバーロードできる演算子</div>

| 演算子の種類       | 演算子                                      |
| ------------------ | ------------------------------------------- |
| 算術演算子         | `a++ a-- ++a --a +a -a a+b a-b a*b a/b a%b` |
| シフト演算子       | `>> <<`                                     |
| 比較演算子         | `== != < <= > >=`                           |
| ビット演算子       | `& ^ ~`                                     |
| 論理演算子         | `&& \| !`                                   |
| ポインタ関係       | `*a &a -> ->*`                              |
| new/delete         | `new new[] delete delete[]`                 |
| カンマ演算子       | `,`                                         |
| 代入演算子         | `= += -= *= /= %= <<=  >>= &= ^= =`         |
| 関数呼び出し演算子 | `()`                                        |
| 添字演算子         | `[]`                                        |

---

### メンバ変数の初期化
C++ではクラスのメンバ変数を初期化する方法は大別して3のパターンがある。

<div class="subtitle">クラス内初期化子</div>

```cpp
class Person {
    std::string m_name = "bob";  // ←ここで初期値を設定
    int m_age = 10;
};
```

- C++11以降で使用可能。
- デフォルトコンストラクタでも自動でこの値が使われる。
- 優先度が低く、コンストラクタのメンバ初期化リストで上書きできる。
- 書きやすく、シンプルな固定値ならこれが便利。

<div class="subtitle">コンストラクタのメンバ初期化リスト</div>

```cpp
class Person {
    std::string m_name;
    int m_age;
public:
    Person() : m_name("bob"), m_age(10) {}  // ←ここで初期化
};
```

- コンストラクタのコロン(:)以降で初期化する方法。
- コンストラクタの本体で代入するのではなく、直接初期化する。
- 特にconstメンバ、参照メンバ、重いオブジェクト(std::stringなど)は必須。
- 実際には以下の順序で動く
  1. メンバ変数が宣言順に初期化される。
  2. 初期化リストで指定したコンストラクタが呼ばれる。

<span class="code-like">Foo(int n) : x(n) {}</span>

このように引数を初期化リストに渡せる。

<pre><code class="caution">初期化の順序は、初期化リストの順番ではなくクラスのメンバ変数の宣言順！メンバ変数のデータに依存する処理の場合バグにつながる。</code></pre>

<div class="subtitle">コンストラクタ本体での代入</div>

```cpp
class Person {
    std::string m_name;
    int m_age;
public:
    Person() {
        m_name = "bob";  // ←代入
        m_age = 10;
    }
};
```

- これは初期化ではなく代入。
- std::stringであれば、まずデフォルトコンストラクタで空文字列を作ってから"bob"を代入するので余計なコストがかかる可能性がある。
- できるだけメンバ初期化リストを使う方が効率的。

<div class="subtitle">メンバ初期化リストが必須になる場合</div>

- constメンバ
- 参照メンバ
- デフォルトコンストラクタを持たないメンバクラス

```cpp
struct Bar {
    int& ref;      // 参照は必須
    const int c;   // const も必須
    std::string s; // string も初期化リスト推奨

    Bar(int x) : ref(x), c(42), s("hello") {} // 必須＆推奨
};
```

---

### staticメンバ変数
staticメンバ変数はメンバ変数の一種だが、特定のインスタンスと紐づかずに、クラスと紐づく。つまりインスタンが無くてもアクセスができるということ。<br>
メンバ変数の宣言時に <span class="code-like">static</span> を付けることで宣言することができ、そのままではメモリの割り当てが行われないので、クラス外(通常関数の定義を行う場所)で定義する必要がある。

```cpp
class A
{
    int value;
    static int count; // ここで宣言
public:
    A();
    A(int i);
};

int A::count = 0; // ここで定義
A::A(int i) : value(i) { count++; }
A::A() : A(0) {}
```

staticメンバ変数はアクセス修飾子の影響を受ける。

<span class="label">C++17以降</span> では <span class="code-like">inline</span> を付けることでヘッダに書くことがでる。

```cpp
class Foo {
public:
    inline static int counter = 0; // 定義と宣言をクラス内で完結
};
```

---

### staticメンバ関数
staticメンバ変数同様に、特定のインスタンスに紐づかない特別なメンバ関数。

```cpp
class A
{
    int value;
    static int count;

public:
    A(int i);
    A();
    static void printCount(); // ここで宣言
};
int A::count = 0;
A::A(int i) : value(i) { count++; }
A::A() : A(0) {}
void A::printCount()
{
    cout << "count: " << count << endl; // ここで定義
}

int main()
{
    A::printCount(); // クラスから呼び出し
    A a(10);
    a.printCount(); // インスタンスからも呼べる
    A b{};
    a.printCount();
}
```

---

### 右辺値参照 <span class="label">C++11以降</span>
右辺値参照とは、通常はコピーする必要がある一時オブジェクト(右辺値)から中身を奪う(所有権のムーブ)ことで、コピーすることによるコストを削減して、計算結果や一時生成オブジェクトを効率的に再利用するための仕組み。

<div class="subtitle">基本構文</div>

```cpp
型&& 変数名 = 右辺値;
```

```cpp
#include <iostream>
#include <vector>

struct MyData {
    std::vector<int> data;

    // コンストラクタ
    MyData(size_t n) : data(n) { // n個分のintを要素に持つ配列data
        std::cout << "Constructed\n";
    }

    // コピーコンストラクタ
    MyData(const MyData& other) : data(other.data) {
        std::cout << "Copied\n";
    }

    // ムーブコンストラクタ
    MyData(MyData&& other) noexcept : data(std::move(other.data)) {
        std::cout << "Moved\n";
    }
};

// 大きなデータを作る関数
MyData create_data() {
    MyData tmp(1000000); // 100万要素
    return tmp;          // 戻り値は右辺値
}

int main() {
    std::cout << "=== コピーの場合 ===\n";
    MyData a(1000000);
    MyData b = a; // 左辺値なのでコピー

    std::cout << "\n=== ムーブの場合 ===\n";
    MyData c = create_data(); // 右辺値なのでムーブ
}
```

<div class="subtitle">右辺値参照のオーバーロード</div>
右辺値参照はオーバーロードすることができる。

```cpp
#include <iostream>
using namespace std;

void show(int &v)
{
    cout << "参照: " << i << endl;
}

void show(int &&v)
{
    cout << "右辺値参照: " << i << endl;
}

int main()
{
    int i = 10;

    show(i);   // 変数は左辺値
    show(100); // リテラルは右辺値
}
```

---

### コピーとムーブ
コピーコンストラクタとムーブコンストラクタは、共に他のインスタンスを元にクラスを初期化するためのコンストラクタだが、その役割には明確な違いがある。

#### コピーコンストラクタ
文字通り複製という意味で、元のインスタンスとメンバ変数が同じになるように初期化する。ただし、メンバ変数が動的確保したポインタを持っていた場合、多重解放しないように新たにメモリ領域を動的確保してコピーするのが一般的。<br>
動的確保してコピーを行う分のコストがかかるため、処理が遅くなる恐れがある。

#### ムーブコンストラクタ
一方、ムーブではコピーとは異なり、所有権の移動を行うため処理が高速になることが期待できる。

下記の例では、`<utility>`の`std::move()`によって右辺値へキャストされているので、所有権が移動することが明確になる。

```cpp
#include <iostream>
#include <utility>

class Home // 家クラス
{
    int *m_land; // 土地
public:
    explicit Home(std::size_t size)
        : m_land{new int[size]} {} // 動的確保
    Home(Home &&other) // 右辺値参照のムーブコンストラクタ
        : m_land{other.m_land} // ムーブ元のポインタをコピーする
    {
        other.m_land = nullptr; // ムーブ元のポインタを空にする
    }
    int *land() con     st { return m_land; }
};

int main()
{
    Home A{100};
    std::cout << "Aのアドレス: " << A.land() << std::endl;
    // 所有権の移動
    Home B{std::move(A)};

    std::cout << "Bのアドレス: " << B.land() << std::endl;
    std::cout << "所有権が変わった後のAのアドレス: " << A.land() << std::endl;
}
```

---

### メンバ関数でラムダ式

クラスのメンバ関数内でラムダ式を使う場合、メンバ変数をラムダ式にキャプチャすることは仕様上禁止されているので、 <span class="code-like">this</span> ポインタを使う。

```cpp
class A
{
    int m_i;
public:
    void set_i(int); // setter
    void show(void) { std::cout << m_i << std::endl; } // getter
};
void A::set_i(int value)
{
    // ここでthisポインタを指定
    [this, value]()
    {
        m_i = value; // そのままアクセスできる
    }();
}
```

このように非const関数でthisポインタをキャプチャすると、メンバ変数を書き換えることができる。

逆にメンバ変数の読み取りのみで、書き換えを禁止したい場合はメンバ関数自体にconst指定するか、 <span class="label">C++17以降</span> であれば <span class="code-like">*this</span> によりコピーキャプチャとなる。

```cpp
class A
{
    int m_i;

public:
    void set_i(int);
    void show(void) const { std::cout << "m_i: " << m_i << std::endl; };
    explicit A(int i) : m_i{i} {}
};

void A::set_i(int value)
{
    [*this, value]() mutable
    {
        m_i = value;
        std::cout << "lambda内 ";
        show();
    }();
    std::cout << "set_i内 ";
    A::show();
}
```

<span class="label">C++14以前</span> で同様の事をしたい場合は、手動でコピーする。

```cpp
void A::set_i(int value) const
{
    auto copy = *this; // 手動でコピー
    [copy, value]() mutable
    {
        copy.m_i = value; // ラムダ式内でのみ有効な値となる
    }();
}
```

---

### 変換関数 <a id="conversion-functions" data-name="変換関数"></a>
変換関数は特殊なメンバ関数のひとつで、オブジェクトを他の型のオブジェクトにキャストなどで変換するために使われる。<br>

<div class="subtitle">基本構文</div>

```cpp
class クラス名
{
public:
    operator 戻り値の型(); // 宣言
};

クラス名::operator 戻り値の型() // 定義
{
    // 処理
}
```

よくある使用方法としては、そのオブジェクトが有効か無効かをbool型で返す変換関数がある。

<pre><code class="example">class heap {
    int *m_pi;

public:
    heap() : m_pi{nullptr} {}
    ~heap() {
        delete m_pi;
    }
    operator bool() const; // 変換関数
    bool create();
};

heap::operator bool() const {
    return m_pi != nullptr;
}

bool heap::create() {
    if (*this) { // 変換関数が呼ばれる
        return false;
    }
    m_pi = new int{};
    return true;
}

int main() {
    heap h;

    if (!h) { // 変換関数が呼ばれる
        std::cout << "変換関数がfalseを返しました" << std::endl;
    }

    h.create();

    if (!h) { // 変換関数が呼ばれる
        std::cout << "変換関数がfalseを返しました" << std::endl;
    }
}</code></pre>

<span class="code-like">explicit</span> を指定しなかった場合、ここではこの型のオブジェクトが必要であるとコンパイラが判断した時に変換関数が呼ばれる。

<pre><code class="example">class Vector4d {
    float x, y, z, w;

public:
    void show() const { std::cout << x << " " << y << " " << z << " " << w << std::endl; }
    explicit Vector4d(float x, float y, float z, float w) : x{x}, y{y}, z{z}, w{w} {}
    friend Vector4d addV(const Vector4d &lhs, const Vector4d &rhs);
};

Vector4d addV(const Vector4d &lhs, const Vector4d &rhs) {
    Vector4d result{
        lhs.x + rhs.x,
        lhs.y + rhs.y,
        lhs.z + rhs.z,
        lhs.w + rhs.w};

    return result;
}

class Vector3d {
    float x, y, z;

public:
    explicit Vector3d(float x, float y, float z) : x{x}, y{y}, z{z} {}
    explicit operator Vector4d() const; // 変換関数
};

Vector3d::operator Vector4d() const {
    Vector4d r{x, y, z, 0.0f};
    return r;
}

int main() {
    Vector3d v1{1, 2, 3}, v2{4, 5, 6};
    Vector4d v3 = addV(Vector4d{v1}, Vector4d{v2});

    v3.show();
}</code></pre>

上記の例では、 <span class="code-like">explicit operator Vector4d() const;</span> で <span class="code-like">explicit</span> を指定していることにより、<br>
明示的に <span class="code-like">Vector4d v3 = addV(Vector4d{v1}, Vector4d{v2});</span> という渡し方をしないとエラーとなる。

---

## テンプレート <a id="template" data-name="テンプレート"></a>
総称的プログラミング(generic programming)とは、プログラムの処理を特定のデータ型に限定せずに記述するプログラミングパラダイムのひとつ。

<div class="subtitle">基本構文</div>

```cpp
template <typename T, typename T2, ...> // 宣言
戻り値の型 関数名(引数);

template <typename T, typename T2, ...> // 定義
戻り値の型 関数名(引数) {
    // 処理
}
```
<div class="subtitle">使用例</div>

```cpp
template <typename T>
T multiply_add(T a, T b, T c) { // 戻り値の型にも仮引数似も使える
    T r = a * b + c; // ローカル変数にも使える
    return r;
}

int main() {
    std::cout << multiply_add<int>(2, 5, 10) << std::endl;
    std::cout << multiply_add(1.5, 2.1, 5.5) << std::endl; // <float>のように型を指定しない場合は型推論となる。
}
```

<div class="subtitle">クラスに使う場合</div>

```cpp
template <typename T> class A {
  public:
    T x;
    T y;
    void show() {
        std::cout << "x: " << x << std::endl << "y: " << y << std::endl;
    }
};

int main() {
    A<int> a{5, 10};
    a.show();
}
```

<div class="subtitle">メンバ関数に使う(宣言と定義を分ける)場合</div>

```cpp
template <typename T> class A {
    T x;

  public:
    A(T x) : x{x} {} // コンストラクタ
    template <typename U> void foo(U);
};

template <typename T> // Aのためのtemplate
template <typename U> // fooのためのtemplate
void A<T>::foo(U y) {
    std::cout << "x: " << x << ", y: " << y << std::endl;
}

int main() {
    A<int> a{10};
    a.foo<float>(5.5);
}
```

---

## 修飾子 <a id="modifier" data-name="修飾子"></a>

### 型

| 修飾子 | 意味 | 例 |
| :-- | :-- | :-- |
| `const` | 定数。変更できない | `const int x = 10;` |
| `volatile` | 最適化禁止(ハードウェアレジスタなど) | `volatile int flag;` |
| `mutable` | constメンバ関数内でも変更可能にする | `mutable int cache;` |
| `constexpr` | コンパイル時に評価可能 | `constexpr int square(int n){return n*n;}` |
| `consteval` | 常にコンパイル時に評価 | `consteval int id(){return 42;}` |
| `constinit` | 静的変数の初期化をコンパイル時に保証   | `constinit int x = 10;` |

### 記憶領域・寿命

| 修飾子                 | 意味               | 例                       |
| :------------------ | :--------------- | :---------------------- |
| `static`            | ファイルスコープ or 静的寿命 | `static int count;`     |
| `extern`            | 他ファイルに定義あり       | `extern int g_value;`   |
| `thread_local`      | スレッドごとの変数        | `thread_local int tid;` |
| `register` (C++17廃止) | レジスタ指定(今は無意味)    | `register int i;`       |

### クラスメンバ

| 修飾子        | 意味               | 例                           |
| :--------- | :--------------- | :-------------------------- |
| `virtual`  | 仮想関数             | `virtual void draw();`      |
| `override` | 親クラスの仮想関数を上書き    | `void draw() override;`     |
| `final`    | 継承/オーバーライド禁止     | `class A final {};`         |
| `explicit` | 暗黙変換を禁止          | `explicit MyClass(int x);`  |
| `friend`   | 外部関数/クラスからアクセス可能 | `friend void debug();`      |
| `inline`   | 複数定義可(内部リンク対策)   | `inline int f(){return 1;}` |

### 関数(文法・例外・呼び出し)

| 修飾子             | 意味          | 例                           |
| :-------------- | :---------- | :-------------------------- |
| `noexcept`      | 例外を投げない     | `void f() noexcept;`        |
| `[[nodiscard]]` | 戻り値を無視すると警告 | `[[nodiscard]] int calc();` |
| `[[noreturn]]`  | 戻らない関数      | `[[noreturn]] void exit();` |


### ポインタ・参照

| 修飾子                | 意味                              | 例                |
| :----------------- | :------------------------------ | :--------------- |
| `*`                | ポインタ                            | `int *p;`        |
| `&`                | 参照                              | `int &r = x;`    |
| `&&`               | 右辺値参照                           | `int &&tmp = 3;` |
| `const` の位置で意味が変わる | `const int*` と `int* const` は違う |                  |

### テンプレート・特殊化

| 修飾子                    | 意味          | 例                                 |
| :--------------------- | :---------- | :-------------------------------- |
| `typename`             | 型名であることを明示  | `typename T::value_type`          |
| `template`             | テンプレート名だと明示 | `template<typename U> void f();`  |
| `concept` / `requires` | 制約付きテンプレート  | `template<Integral T> void f(T);` |

### その他

| 修飾子        | 意味        | 例                    |
| :--------- | :-------- | :------------------- |
| `alignas`  | アラインメント指定 | `alignas(16) int v;` |
| `alignof`  | アラインメント取得 | `alignof(int)`       |
| `decltype` | 型を推論      | `decltype(x+y) z;`   |
| `auto`     | 型推論       | `auto i = 42;`       |
| `register` | (今は意味なし)  | `register int i;`    |

---

## 継承 <a id="inheritance" data-name="継承"></a>
あるクラスの異なる部分を追加、変更してクラスを再利用することを継承という。<br>
継承すると基底クラスのメンバ変数とメンバ関数を全て引き継ぐ。

<span class="subtitle">基本構文</span>

```cpp
class 派生クラス名 : アクセス修飾子 基底クラス名
{
    // クラス本体
}
```

---

### 仮想関数
派生クラスで基底クラスの関数の処理内容を変更したい場合は基底クラスの宣言時に <span class="code-like">virtual</span> を付けてオーバーライドする。

```cpp
class A
{
  public:
    virtual void show() { std::cout << "class A" << std::endl; }
};

class B : public A
{
  public:
    void show() { std::cout << "class B" << std::endl; }
};
```

virtualを付けずにメンバ関数を定義すると名前の隠蔽が発生して、オーバーライドではなく基底クラスの関数を隠す挙動となり、別の関数として扱われる。<br>
基底クラスのポインタに派生クラスのアドレスを入れて、動的ポリモーフィズムで関数を呼ぶ場合はvirtualが必要となる(virtualが無いと、この場合基底クラスの関数が呼ばれる)。

<pre><code class="caution"><span class="label">C++11以降</span> では、<span class="code-like">override</span> 指定子が導入されたので、派生クラスでオーバーライドする際はoverride指定子を付けることが推奨される。</code></pre>


```cpp
class B : public A
{
  public:
    void show() override { std::cout << "class B" << std::endl; }
};
```

さらに <span class="code-like">final</span> 指定子を付けることにより、以降の派生クラスでメンバ関数をオーバーライドすることを禁止することができる。

```cpp
class B : public A
{
  public:
    void show() override final { std::cout << "class B" << std::endl; }
};
```


---

### 純粋仮想関数
基底クラスでは関数の宣言のみで、実装を派生クラスで強制させることができる。これを純粋仮想関数という。

```cpp
virtual 戻り値の型 関数名([引数]) = 0; // 純粋仮想関数
```

純粋仮想関数が宣言されたクラスは抽象クラスとなり、インスタンス化ができなくなる。

---

### オーバーロード
基底クラスの関数を派生クラスでオーバーロード(シグネチャが異なる関数の定義)する際にも名前の隠蔽が発生して、基底クラスの関数が隠される(つまり派生クラスで同名の関数を定義すると名前の隠蔽が発生する)。<br>
これを避けるには <span class="code-like">using</span> を使って名前隠蔽を解除する。

```cpp
class Derived : public Base
{
  public:
    using Base::func;  // ← これで名前隠蔽を解除
    void func(string) { cout << "Derived::func(string)\n"; }
};
```

---

## エラーハンドリング <a id="error-handling" data-name="エラーハンドリング"></a>

### 例外
例外によるエラーハンドリングでは例外の送出(throw)と、例外の捕捉(catch)という2つの操作の記述により、正常系とエラーハンドリングを行う部分を区別して記述することができ、戻り値によるエラーハンドリングよりも見通しのいいコードを記述できる。

送出された例外が捕捉されなかった場合は、std::terminate()が呼び出され、プログラムが強制終了する。

- 例外の送出

```cpp
throw スローする例外オブジェクト;
```

例外オブジェクトにはint型やstd::string型など任意の型を使用可能だが、一般的にはstd::exceptionクラスを継承したクラスを使用する。<br>
std::exceptionを生成するには、std::exceptionクラスを継承したクラスに文字列を渡して生成したり、自作の例外クラスを作成して生成する。

  - 例外オブジェクト
<table>
  <caption>標準例外クラス</caption>
  <tr><th>例外</th><th>状況</th></tr>
  <tr><td>std::logic_error</td><td>プログラム上の設計ミス</td></tr>
  <tr><td>std::runtime_error</td><td>実行中に予期しない異常が発生した</td></tr>
  <tr><td>std::invalid_argument</td><td>不正な引数を関数に渡した</td></tr>
  <tr><td>std::out_of_range</td><td>インデックスなどが範囲外、数値が指定範囲を超えた</td></tr>
  <tr><td>std::length_error</td><td>サイズや長さが不正(大きすぎる)</td></tr>
  <tr><td>std::domain_error</td><td>数学的に定義されていない入力</td></tr>
  <tr><td>std::overflow_error<br>std::underflow_error</td><td>数値演算がオーバーフロー、アンダーフローした</td></tr>
  <tr><td>std::bad_alloc</td><td>メモリ確保に失敗した</td></tr>
  <tr><td>std::bad_cast</td><td>dynamic_castに失敗した</td></tr>
</table>

  - 自作クラス
<pre><code class="example">#include &lt;exception&gt;
#include &lt;string&gt;

class MyError : public std::exception {
    std::string msg;
  public:
    explicit MyError(const std::string& m) : msg(m) {}
    const char* what() const noexcept override {
        return msg.c_str();
    }
};</code></pre>

- 例外の捕捉

```cpp
try {
    // 例外(throw)が発生する可能性がある処理
}
catch (const std::out_of_range& e) {
    std::cerr << e.what();
}
catch (const std::exception& e) {
    std::cerr << "その他の例外: " << e.what();
}
catch (...) {
    std::cerr << "未知の例外発生";
}
```

### optional <br> `<optional>` <span class="label">C++17</span>
`std::optional`はC++17で導入された、値が存在するかもしれないし、存在しないかもしれない状態を表現するためのテンプレートクラス。

```cpp
// 値を返すか、何も返さない関数
std::optional<int> divide(int a, int b) {
    if (b == 0) {
        return std::nullopt;  // 値なし
    }
    return a / b;  // 値あり
}

int main() {
    auto result1 = divide(10, 2);
    auto result2 = divide(10, 0);
    
    // 値の存在確認
    if (result1.has_value()) {
        std::cout << "結果: " << result1.value() << std::endl;  // 5
    }
    
    // より簡潔な書き方
    if (result2) {
        std::cout << "結果: " << *result2 << std::endl;
    } else {
        std::cout << "計算できません" << std::endl;
    }
}
```

<div class="subtitle">主なメソッド</div>

| メソッド | 説明 |
|---|---|
| opt.has_value() | 値を持っているか確認 |
| opt.value() | 値を取得なければ例外(std::bad_optional_access) |
| opt.value_or(default) | 値があれば取得、なければデフォルトを返す |
| reset() | 値をクリアする |

<div class="subtitle">値へのアクセス</div>

```cpp
std::optional<int> opt = 42;

// 方法1: value()を使う(安全だが例外の可能性あり)
int val1 = opt.value();

// 方法2: *演算子を使う(値がないとき未定義動作)
int val2 = *opt;

// 方法3: value_or()を使う(最も安全)
int val3 = opt.value_or(0);  // 値がなければ0
```

## プリプロセッサ <a id="preprocessor" data-name="プリプロセッサ"></a>
プリプロセッサディレクティブは、コンパイルの前段階でソースコードに対して特定の処理を行う仕組み。<br>
プリプロセッサの仕様はCとC++でほぼ同じで、実装された時期に違いがある。

|仕様|実装|
|---|---|
|#pragma once|Cでは実装依存。C++では一般的な構文|
|可変引数マクロ|C++11以降|
|`__func__`|C++11以降|

その他は[C言語]({{ site.baseurl }}/pages/c/c#preprocessor)を参照。

---

## 動的確保 <a id="dynamic-allocation" data-name="動的確保"></a>
C++における動的確保は様々なやり方があり、それぞれの確保方法は用途・安全性・パフォーマンスが異なる。

### 低レベルな動的確保
malloc, calloc, realloc, freeによりメモリブロックを確保して解放する。C++では基本的に非推奨で、主にnew/コンテナが使われる。

---

### new/deleteによる動的確保
<div class="subtitle">単一オブジェクト</div>

```cpp
int* p = new int(42); // 値42で初期化
delete p;             // 解放
```

<div class="subtitle">配列</div>

```cpp
int* arr = new int[10](); // ()で0初期化
delete[] arr;             // 配列はdelete[]
```

### スマートポインタによる動的確保 <span class="label">C++11以降</span>
C++11以降は`RAII(Resource Acquisition Is Initialization)`を活用して、自動的に解放する方法が主流。

<div class="subtitle">std::unique_ptr</div>
単一所有権。コピー不可。スコープ終了時に自動解放。

```cpp
#include <memory>

auto p = std::make_unique<int>(42);     // 自動解放
auto arr = std::make_unique<int[]>(10); // 配列もOK
```

<div class="subtitle">std::shared_ptr</div>
参照カウント方式で複数所有可能。最後の所有者が消えると解放。

```cpp
#include <memory>

auto p = std::make_shared<int>(42);
```

<div class="subtitle">std::weak_ptr</div>
shared_ptrの弱参照(所有権なし、循環参照回避)

---

### 標準コンテナによる動的確保
<code>std::vector, std::string, std::map</code>などは内部で自動的に動的確保する。

解放はコンテナの寿命に任せる(RAII)

```cpp
std::vector<int> v(10, 42); // 内部で動的確保
```

### 配置new(placement new)
確保済みメモリ領域にオブジェクトを構築する。<br>
メモリ確保とオブジェクト構築を分けた場合に使う<br>
主にカスタムメモリアロケータや低レベルライブラリで使用する。

```cpp
#include <new>

char buf[sizeof(int)];
int* p = new(buf) int(42); // buf内にint構築
p->~int();                 // 明示的にデストラクタ呼び出し
```

### カスタムアロケータ
標準コンテナに独自のメモリ管理方法を渡すことができる。<br>
ゲームや組み込みなどで頻繁に使われる。

---

## 標準入出力 <a id="iostream" data-name="標準入出力"></a> <br> `<iostream>`

### istreamから1行読み込む<br>`std::istream& getline(std::istream& input, std::string& str);`

## ファイル入出力 <a id="fstream>" data-name="ファイル入出力"></a> <br> `<fstream>`

ファイルをオープンするときは、基本は用途に応じてコンストラクタを使い分ける。

| 用途 | 使い方 |
| --- | --- |
| 読み込みだけ | std::ifstream in{"filename"} |
| 書き込みだけ | std::ofstream out{"filename", mode} |
| 読み書き両方 | std::fstream io{"filename", mode} |

変数を作っておいて後からファイル名が決まる場合や、close()で閉じてから、別のファイルを開く場合にはopen()を使う。

<pre><code class="example">std::ifstream in;
in.open("file1.txt");
in.close();
in.open("file2.txt");  // 別ファイルを再利用して開く</code></pre>

第2引数でmodeを指定すると挙動を指定できる。

| 定数 | 説明 |
| --- | --- |
| std::ios::in | 入力用に開く |
| std::ios::out | 出力用に開く |
| std::ios::binary | バイナリモードで読み書きする |
| std::ios::app | 追記モードで開く(出力が常にストリーム終端に対して行われる) |
| std::ios::ate | ファイルを開いたら、ただちにファイル終端へ移動する |
| std::ios::trunc | ファイルを開いたら、必ず既存の内容を消去する |

<pre><code class="example">std::fstream io("data.txt", std::ios::in | std::ios::out); // 読み書き</code></pre>

<pre><code class="example">std::ofstream log;
log.open("log.txt", std::ios::out | std::ios::app); // 追記モード</code></pre>

### 入力の基本的な流れ

<pre><code class="example">#include &lt;iostream&gt;
#include &lt;fstream&gt;
#include &lt;string&gt;

int main() {
    std::ifstream ifs("data.txt"); // ファイルを開く
    if (!ifs) { // 開けなかった場合のエラー処理
        std::cerr << "ファイルを開けませんでした。\n";
        return 1;
    }

    std::string line;
    while (std::getline(ifs, line)) { // 1行ずつ読み込む
        std::cout << line << '\n';   // 行ごとに処理する
    }

    // 自動的にファイルは閉じられる（RAII）
    return 0;
}</code></pre>

- 行単位で処理
  <pre><code class="example">std::string line;
while (std::getline(ifs, line)) {
    // lineの中身をトークン分割したり解析したりする
}</code></pre>

- 単語単位で処理
  <pre><code class="example">std::string word;
while (ifs >> word) {
    std::cout << word << '\n';
}</code></pre>
  この場合はホワイトスペースで区切られる。

- 構造化されたデータを読み込む
  <pre><code class="example">int x;
double y;
while (ifs >> x >> y) {
    std::cout << "x=" << x << ", y=" << y << '\n';
}</code></pre>

- ファイル全体を一気に読み込む
  <pre><code class="example">#include &lt;sstream&gt;<br>
std::ifstream ifs("data.txt");
std::stringstream buffer;
buffer &lt;&lt; ifs.rdbuf();
std::string content = buffer.str();<br>
std::cout &lt;&lt; content;</code></pre>

- バイナリを読み込む
  <pre><code class="example">std::ifstream ifs("image.bin", std::ios::binary);
if (!ifs) return 1;<br>
std::vector&lt;char&gt; data((std::istreambuf_iterator&lt;char&gt;(ifs)),
    std::istreambuf_iterator&lt;char&gt;());
// dataにファイル内容がそのまま入る</code></pre>

- 指定したデリミタ(区切り)で読み込む
  <pre><code class="example">#include &lt;iostream&gt;
#include &lt;fstream&gt;
#include &lt;sstream&gt;
#include &lt;string&gt;
#include &lt;vector&gt;<br>
int main() {
    std::ifstream ifs("data.csv");
    if (!ifs) {
        std::cerr << "ファイルを開けませんでした\n";
        return 1;
    }<br>
    std::string line;
    while (std::getline(ifs, line)) {  // 行単位で読む
        std::vector<std::string> fields;
        std::stringstream ss(line);    // 行をストリームとして扱う
        std::string field;<br>
        while (std::getline(ss, field, ',')) {  // ',' 区切りで読む
            fields.push_back(field);
        }<br>
        // 確認用出力
        for (auto& f : fields) std::cout << "[" << f << "]";
        std::cout << "\n";
    }
}</code></pre>










---

## ファイル操作 <a id="filesystem" data-name="ファイル操作"></a> <br> `<filesystem>` <br> `namespace fs = std::filesystem;`

### パスオブジェクトを生成

<div class="subtitle">生成</div>
<pre><code>fs::path p1 = "abc/def";
fs::path p2("dir/file.txt"); // 文字列から生成
fs::path p3(std::string("dir/file.txt")); // 文字列から生成</code></pre>

<div class="subtitle">代入</div>
<pre><code>fs::path p; // 空のpath

p = "file.txt"; // operator= 文字列から
p = std::string("file2.txt");
p.assign("file3.txt") // 代入と同様</code></pre>

<div class="subtitle">連結</div>
<pre><code>fs::path p1("dir");
p1 /= "subdir";   // "dir/subdir"
p1 /= "file.txt"; // "dir/subdir/file.txt"
// osの区切り文字を自動で使う

fs::path p2("dir");
p.append("subdir");  // "dir/subdir"
p.append("file.txt"); // "dir/subdir/file.txt"
// /=とほぼ同じ

fs::path p3("file");
p += ".txt"; // "file.txt"
// 単純な文字列の連結で、区切り文字は付加されない</code></pre>

<div class="subtitle">置換</div>
<pre><code>fs::path p("dir/file.txt");
p.replace_filename("newfile.txt"); // "dir/newfile.txt"
// ファイル名部分だけを置換</code></pre>

### パスオブジェクトのメソッド

<div class="subtitle">分解</div>

| メソッド | 説明 |
| --- | --- |
| p.root_name() | ルート名("C:")など |
| p.root_directory() | ルートディレクトリ("/") |
| p.root_path() | ルート名 + ルートディレクトリ |
| p.relative_path() | ルートを除いた残りの部分 |
| p.parent_path() | 親ディレクトリ部分 |
| p.filename() | 最後の要素(ファイル名 or ディレクトリ名) |
| p.stem() | 拡張子を除いた部分 |
| p.extension() | 拡張子 |

<pre><code class="example">fs::path p = "/home/user/file.txt";
std::cout << p.root_path()    << "\n"; // "/"
std::cout << p.parent_path()  << "\n"; // "/home/user"
std::cout << p.filename()     << "\n"; // "file.txt"
std::cout << p.stem()         << "\n"; // "file"
std::cout << p.extension()    << "\n"; // ".txt"</code></pre>

<div class="subtitle">判定系</div>

| メソッド | 説明 |
| --- | --- |
| p.empty() | 空のfs::pathかどうか |
| p.has_root_name(), p.has_root_directory(), p.has_root_path() | ルートディレクトリ関連 |
| p.has_relative_path(), p.has_parent_path(), p.has_filename(), p.has_stem(), p.has_extension() | パス名関連 |

<pre><code class="example">fs::path p = "file.txt";
if (p.has_extension()) {
    std::cout << p.extension() << "\n"; // ".txt"
}</code></pre>

<div class="subtitle">イテレーション</div>

<pre><code class="example">fs::path p = "/home/user/file.txt";
for (auto& part : p) {
    std::cout << part << "\n";
}
// "/", "home", "user", "file.txt"</code></pre>

<div class="subtitle">変換・正規化</div>

| メソッド | 説明 |
| --- | --- |
| p.lexically_normal() | pに含まれる"."や".."を解決した正規化パスを返す |
| target.lexically_relative(base) | baseからtargetまでの相対パスを返す |
| target.lexically_proximate(base) | baseからtargetまでパスを可能なら相対パス、無理なら絶対パスで返す |

<div class="subtitle">クリア・交換</div>

| メソッド | 説明 |
| --- | --- |
| p.clear() | パスを空にする |
| p.swap(other) | パスを交換する |

---

### ディレクトリを走査する(単層)<br>`directory_entry fs::directory_iterator("dir");`

<pre><code class="example">for (auto& entry : std::filesystem::directory_iterator("dir")) {
    std::cout << entry.path() << "\n";
}</code></pre>

### ディレクトリを走査する(再帰)<br>`directory_entry fs::recursive_directory_iterator("dir");`

<pre><code class="example">for (auto& entry : std::filesystem::recursive_directory_iterator("dir")) {
    std::cout << entry.path() << "\n";
}</code></pre>

<pre><code class="caution"><span class="code-like">/mnt/</span> などのwindowsのディレクトリを走査する場合、 <span class="code-like">permission_denied</span> に遭遇するとエラーで落ちるので、
for (auto &entry : fs::recursive_directory_iterator("/mnt/h", fs::directory_options::skip_permission_denied))
このようにオプションを指定する。</code></pre>

### `directory_entry`のメソッド

| メソッド | 説明 |
| --- | --- |
| e.path() | directory_entryが指すパスを返す |
| e.exists() | エントリが存在するか |
| e.file_size() | サイズを返す(regular_fileのみ) |
| e.last_write_time() | 最終更新時刻 |
| e.hard_link_count() | ハードリンクの数 |
| e.status() | file_status(実態の種類や権限) |
| e.symlink_status() | file_status(リンク自体の種類や権限) |
| e.assign(const path&) | パスを書き換える |
| e.replace_filename(const path&) | ファイル名部分を書き換える |
| e.refresh() | ファイルシステムを再度問い合わせて情報を更新 |
| e.is_regular_file() | 通常ファイルかどうか |
| e.is_directory() | ディレクトリかどうか |
| e.is_symlink() | シンボリックリンクかどうか |
| e.is_block_file() | ブロックデバイス(ハードディスクやUSBなど、ブロック単位で読み書きするデバイス)かどうか |
| e.is_character_file() | キャラクターデバイス(キーボードや端末、シリアルポートのように1文字ずつ扱うデバイス)かどうか |
| e.is_fifo() | プロセス間通信で使うパイプかどうか |
| e.is_socket() | UNIXドメインソケット(ローカルプロセス間通信で使われるソケット)かどうか |
| e.is_other() | 上記のいずれにも当てはまらないファイル(システムが独自に作ったデバイスファイルなど)かどうか |

---

### 存在・種類確認系メソッド

| 関数 | 説明 |
| --- | --- |
| fs::exists(p) | pが指すファイル・ディレクトリが存在するか |
| fs::is_regular_file(p) | 通常ファイルかどうか |
| fs::is_directory(p) | ディレクトリかどうか |
| fs::is_symlink(p) | シンボリックリンクかどうか |
| fs::is_block_file(p) | ブロックデバイス(ハードディスクやUSBなど、ブロック単位で読み書きするデバイス)かどうか |
| fs::is_character_file(p) | キャラクターデバイス(キーボードや端末、シリアルポートのように1文字ずつ扱うデバイス)かどうか |
| fs::is_fifo(p) | プロセス間通信で使うパイプかどうか |
| fs::is_socket(p) | UNIXドメインソケット(ローカルプロセス間通信で使われるソケット)かどうか |
| fs::is_other(p) | 上記のいずれにも当てはまらないファイル(システムが独自に作ったデバイスファイルなど)かどうか |

---

## 文字列 <a id="string" data-name="文字列"></a> <br> `<string>`

### 生成と結合

```cpp
std::string s1;                // 空文字列
std::string s2 = "Hello";      // 文字列リテラルから
std::string s3(5, 'x');        // "xxxxx"
s1 = "World";                  // 代入

std::string s1 = "Hello";
std::string s2 = "World";
std::string s3 = s1 + " " + s2;  // "Hello World"
s1 += "!";                       // "Hello!"
```

### アクセス

```cpp
std::string s = "Hello";
char c1 = s[0];      // 'H'
char c2 = s.at(1);   // 'e'(範囲外なら例外)
s[0] = 'h';          // 先頭を小文字に
```

### 比較

```cpp
std::string a = "apple";
std::string b = "banana";

if (a == b) { }   // 等しいかどうか
if (a < b)  { }   // 辞書順比較
```

### イテレーション
```cpp
std::string s = "Hello";
for (char c : s) {
    std::cout << c << " ";   // H e l l o
}
```

### メソッド

<table>
    <caption>サイズ関連</caption>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>s.size()</td><td>サイズを返す(length()と挙動は同じだが、他のクラスと統一するならこっち)</td></tr>
    <tr><td>s.length()</td><td>サイズを返す</td></tr>
    <tr><td>s.empty()</td><td>文字列が空ならtrue</td></tr>
</table>

<table>
    <caption>検索</caption>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>s.find("keyword")</td><td>キーワードが見つかれば整数で位置を返す<br>見つからなければstd::string::npoを返す</td></tr>
    <tr><td>s.rfind("keyword")</td><td>後ろから検索して、後ろからの位置を返す<br>見つからなければstd::string::npoを返す</td></tr>
    <tr><td>s.starts_with("keyword")</td><td>sの先頭がkeywordと一致したらtrueを返す</td></tr>
    <tr><td>s.ends_with("keyword")</td><td>sの末尾がkeywordと一致したらtrueを返す</td></tr>
</table>

<pre><code class="example">// 検索が見つかった場合の判定
if (s.find("keyword") != std::string::npos) {
    std::cout << "見つかった" << std::endl;
}</code></pre>

<table>
    <caption>置換</caption>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>s.replace(i, n, "word")</td><td>sのi番目の位置からn文字をwordに書き換える</td></tr>
</table>

<pre><code class="example">// 同じ名前の別物(algorithm)
#include &lt;algorithm&gt;
#include &lt;string&gt;

std::string s = "a b c d";
std::replace(s.begin(), s.end(), ' ', '_'); // 空白を'_'に
std::cout << s;  // "a_b_c_d"
</code></pre>

<table>
    <caption>挿入・削除</caption>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>s.insert(i, "word")</td><td>sのi番目の位置にwordを挿入</td></tr>
    <tr><td>s.erase(i, n)</td><td>sのi番目からn文字削除する</td></tr>
    <tr><td>s.clear()</td><td>sを空文字列にする</td></tr>
</table>

<table>
    <caption>変換</caption>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>std::stoi(s)</td><td>整数文字列をint型に変換して返す</td></tr>
    <tr><td>std::stod("3.14")</td><td>小数文字列をdouble型に変換して返す</td></tr>
    <tr><td>std::to_string(num)</td><td>numを文字列に変換して返す</td></tr>
    <tr><td>std::to_string(num)</td><td>numを文字列に変換して返す</td></tr>
    <tr><td>s.c_str()</td><td>sをC互換文字列へ変換</td></tr>
</table>

<table>
    <caption>その他</caption>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>s.substr(i, n)</td><td>sのi番目からn文字取り出して返す</td></tr>
    <tr><td>s.compare("target")</td><td>sとtargetを辞書順で比較して、等しければ0、小さければ負数、大きければ正の整数を返す</td></tr>
</table>

### 小文字・大文字化
`<cctype>`に`std::toupper`と`std::tolower`がある。<br>
負の値となる可能性があるcharを渡すと未定義動作となるので、`static_cast<unsigned char>`に変換して渡すのが安全。

```cpp
#include <iostream>
#include <cctype>
#include <string>

std::string to_upper(const std::string& s) {
    std::string result = s;
    for (char& c : result) {
        c = static_cast<char>(std::toupper(static_cast<unsigned char>(c)));
    }
    return result;
}
```

---

## 文字列ストリーム <a id="sstream" data-name="文字列ストリーム"></a> <br> `<sstream>`
文字列をストリームとして扱うためのクラスで、C++の入出力ストリームの仕組みを文字列に対して行うための仕組み。

<pre><code class="example">#include &lt;iostream&gt;
#include &lt;sstream&gt;
#include &lt;string&gt;

int main() {
    std::stringstream ss;

    // 書き込み（出力ストリームとして使う）
    ss << "123 " << 45.6 << " hello";

    // 読み込み（入力ストリームとして使う）
    int a;
    double b;
    std::string c;

    ss >> a >> b >> c;

    std::cout << a << ", " << b << ", " << c << "\n";
}</code></pre>

### 主な種類

| クラス名                 | 用途     | 説明                      |
| -------------------- | ------ | ----------------------- |
| `std::istringstream` | 入力専用   | 文字列から値を読み取る（`>>`）       |
| `std::ostringstream` | 出力専用   | 文字列に書き込む（`<<`）          |
| `std::stringstream`  | 入出力両方可 | 両方できる（`>>` も `<<` も使える） |

---

## 正規表現 <a id="regex" data-name="正規表現"></a> <br> `<regex>`

<div class="subtitle">Row文字列</div>
Row文字列を使うことにより、文字列が生(Row)の文字列となり、エスケープなしに正規表現として扱える。

```cpp
// R"()"の中の\d+を表す
std::regex re(R"(\d+)");

// R"regex()regex"の中の\w+\s*\(\d+\)を表す
std::regex re(R"regex(\w+\s*\(\d+\))regex");
```

`regex()regex`のように好きな文字列で囲むとカスタムデリミタとなり、()の中に()を入れられるようになる。

### 文字列全体が正規表現にマッチするか調べる<br>std::regex_match();
文字列全体が正規表現にマッチするかを調べるには、`std::regex_match()`を使う。

```cpp
std::string s = "2021/04/01";

// 日付にマッチする正規表現
std::regex re {"(\\d{4})/(\\d{2})/(\\d{2})"};
std::smatch result; // 第2引数に渡すsmatch

if (regex_match(s, result, re)) {
    std::cout << result[0] << std::endl; // マッチ全体
    std::cout << result[1] << std::endl; // 年グループ
    std::cout << result[2] << std::endl; // 月グループ
    std::cout << result[3] << std::endl; // 日グループ
}
```

文字列全体がマッチしたらtrueを返し、部分的にマッチした場合や、マッチしなければfalseが返る。<br>
第2引数にはstd::smatchクラスのオブジェクトへの参照を渡す。マッチするとマッチ情報がこのオブジェクトにコンテナのような形で格納される。<br>

### 文字列が正規表現に部分的にマッチするか調べる<br>std::regex_search();
文字列sが正規表現に部分的にマッチするか調べるにには、`std::regex_search()`を使う。

```cpp
std::string s = "今日の日付は2021/04/01です。";

// 日付にマッチする正規表現
std::regex re {"(\\d{4})/(\\d{2})/(\\d{2})"};
std::smatch result; // 第2引数に渡すsmatch

if (regex_search(s, result, re)) {
    std::cout << result[0] << std::endl; // マッチ全体
    std::cout << result[1] << std::endl; // 年グループ
    std::cout << result[2] << std::endl; // 月グループ
    std::cout << result[3] << std::endl; // 日グループ
}
```

文字列sが正規表現に部分的にマッチすればtrue、マッチしなければfalseが返る。

### 正規表現で置換する<br>std::regex_replace();

```cpp
std::string s "今日の日付は2021/04/01です";

// 日付にマッチする正規表現
std::regex re {"(\\d{4})/(\\d{2})/(\\d{2})"};

// YYYY/MM/DD形式をYYYY年MM月DD日に置き換える
std::string format = "$1年$2月$3日";

s = std::regex_replace(s, re, format);
```

戻り値として変換後の新たな文字列オブジェクトが返る。<br>
置換フォーマットの"$1", "$2", "$3"はそれぞれN番目にマッチした部分文字列のプレースホルダであることを意味する。<br>
マッチした文字列全体を表すには"$&"というプレースホルダを使う。

## フォーマット <a id="format" data-name="フォーマット"></a> <br> `<format>` <span class="label">C++20</span>

`std::format()`は、値を書式指定で文字列化する関数で、第1引数に書式文字列、第2引数に文字列化したい値を渡す。

```cpp
std::string format(string_view fmt, const Args&... args);
```

<pre><code class="example">std::cout << std::format("Hello {0} World!", "C++") << std::endl; // Hello C++ World!
std::cout << std::format("答えは{}", 42) << std::endl; // 答えは42</code></pre>

書式指定文字列は、`{}`で囲まれた置換フィールドを第2引数に置き換える。<br>


## ユーティリティ <a id="utility" data-name="ユーティリティ"></a> <br> `<utility>`

### ペア <br> `<utility>`
異なる2つの型を持つpair。宣言時に型が決まり、後から変えることはできない。

```cpp
std::pair<int, std::string> p{1, "hello"}; // 初期化

p = std::make_pair(2, "world"); // まとめて値を指定

auto p = std::make_pair(10, 3.14); // 型推論を利用して生成

std::cout << p.first << std::endl; // 1つ目の要素
std::cout << p.second << std::endl; // 2つ目の要素
std::cout << std::get<0> << std::endl; // 1つ目の要素
std::cout << std::get<int> << std::endl; // int型の要素

```

### タプル <br> `<tuple>`
異なるN個の型の値を持つtuple。宣言時に型が決まり、後から変えることはできない。

```cpp
std::tuple<int, double, std::string, int> t = {11, 3.14, "hello", 22}; // 初期化

t = std::make_tuple(3, 1.5, "wold", 11) // まとめて値を指定

std::cout << std::get<1>(t) << std::endl; // 2つ目の要素
std::cout << std::get<double>(t) << std::endl; // double型の要素
// std::cout << std::get<int>(t) << std::endl; // int型が2つあるためエラー
```

### バリアント <span class="label">C++17</span> <br> `<variant>`
variantは、C++17で導入された型安全な共有体(union)で、宣言された継承関係にない複数の型のうち1つだけ値を代入できる。

| 関数 | 説明 |
| --- | --- |
| std::holds_alternative<T>(v) | その型が入っているかを安全に判定。コンパイル時に型がきまるので高速<br>std::get()と一緒に使うのが最もスタンダード。例外・エラーが無くboolが返るだけで安全。 |
| std::get_if<型のみ>(&v) | 保持している型が一致していればポインタで返し、違う型を保持してる場合はnullptrが返るので、戻り値を確認すれば安全。 |
| std::get<型またはindex>(v) | 型またはindexが一致している場合のみ戻り値で取得でき、型が違うと例外or未定義動作。 |
| v.index() | 保持している値の順番(index)を返す。std::get()はコンパイル時定数が必要なので組み合わせられない。<br>switch文やif文などで使う。 |
| std::visit(visitor, variant) | 型ごとに処理を書くため安全。 |

<pre><code class="example">// int, double, stringのいずれかを代入できるvariant
std::variant&lt;int, double, std::string&gt; v = 3;

// 初期化しない場合は最初の型のデフォルト値(この場合intの0)となる。
std::variant&lt;int , double&gt; v2{};

int n = std::get&lt;int&gt;(v); // intの値を取り出す

v = "hello"; // 文字列を代入する
std::string s = std::get&lt;string&gt;(v) // 文字列を取り出す

// indexは格納されている値のindexを返す。
if (v.index() == 2) {
    std::cout << "stringを保持" << std::endl;
}

// get_ifはポインタを返す。指定した型でなければnullptrが返る
if (std::string *p  get_if&lt;std::string&gt;(&v)) {
    std::cout << "string: " << *p << std::endl;
}

// 特定の型を保持しているか確認
if (std::holds_alternative&lt;std::string&gt;(v)) {
    std::cout << "stringを保持" << std::endl;
}</code></pre>

<div class="subtitle">visitによる型安全なパターンマッチング</div>

```cpp
std::visit(visitor, variant);
```

visitorに呼び出し可能オブジェクト、variantに`std::variant`のインスタンスを渡す。

```cpp
std::variant<int, double, std::string> v = "Hello";

std::visit([](auto&& arg) {
    using T = std::decay_t<decltype(arg)>;
    if constexpr (std::is_same_v<T, int>) {
        std::cout << "int: " << arg << std::endl;
    } else if constexpr (std::is_same_v<T, double>) {
        std::cout << "double: " << arg << std::endl;
    } else if constexpr (std::is_same_v<T, std::string>) {
        std::cout << "string: " << arg << std::endl;
    }
}, v);
```

```cpp
// どの型が来ても対応
int main() {
    std::variant<int, double, std::string> v = 3.14;
    
    std::visit([](auto&& arg) {
        std::cout << "値: " << arg << std::endl;
    }, v);
}
```

## ランダム <a id="random" data-name="ランダム"></a> <br> `<random>`
C++のランダム生成は、大別して生成・範囲・分布の3つの部品で構成されており、それらを組み合わせることにより柔軟に選択できる。

1. 乱数の元を作る `std::random_device` (seed生成用)
2. 乱数の生成方法を指定する `std::mt19937`, `std::default_random_engine` など
3. 乱数の値の範囲、分布の形を決める `std::uniform_int_distribution`, `std::normal_distribution` など

```cpp
std::random_device rd;                       // ランダムな種(シード)を生成
std::mt19937 gen(rd());                      // 乱数生成器(MersenneTwister方式)
std::uniform_int_distribution<> dist(0, 9);  // 分布の定義：0〜9の整数を一様に
int value = dist(gen);                       // 乱数の生成
```

## リンケージ <a id="linkage" data-name="リンケージ"></a>
リンケージとは、識別子(変数または関数)が他のスコープから参照できるかどうかを表す。<br>
リンケージを用いるとC++からCで書かれたプログラムを呼び出すことが出きる。

<div class="subtitle">リンケージの手順</div>

1. ファイルを用意して

    ```c
    // hello.c
    #include <stdio.h>
    
    void helloFromC(void)
    {
        printf("hello from C!!\n");
    }
    ```

     ```cpp
     // main.c
     extern "C" void helloFromC(void); // extern "C"を書く
     
     int main()
     {
         helloFromC(); // 呼び出し
         return 0;
     }
     ```

2. <span class="code-like">gcc</span> でCファイルをコンパイル。

     ```bash
     gcc -c hello.c -o hello.o
     ```

3. <span class="code-like">g++</span> でC++ファイルをコンパイル。

     ```bash
     g++ -c main.cpp -o main.o
     ```

4. <span class="code-like">g++</span> でリンク。

     ```bash
     g++ main.o hello.o -o program
     ```

5. 実行。

     ```bash
     ./program
     ```

     ```
     hello from C!!
     ```

<pre><code class="caution">CからC++のプログラムを実行することも可能だが、クラス、継承、STL、例外処理などのC++の機能はCから直接扱うことができないため、CとのインターフェースをC++でラップして、C側には単純な戻り値、関数のみを公開する形にする必要がある。</code></pre>

---
