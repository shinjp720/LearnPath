<div data-title="C++"></div>
<a id="top" data-name="TOP"></a>

# C++

- 説明文

---

## 型

### auto(型推論)
`auto 変数名 = 初期値`

変数の宣言時に初期値を与えている場合、初期値と同じ型に推論してくれる。

<pre><code class="caution">ただし配列の初期化時は環境依存になる場合があるので、autoとブレースを使った初期化はしない。
</code></pre>

また、[for文](#範囲for)でも使える。

<div class="subtitle"><a id="auto戻り値推論"></a>auto戻り値推論</div>
C++14以降ではauto戻り値推論が導入された。

```cpp
template<typename T, typename U>
auto add(T a, U b) {
    return a + b;  // ここから型を推論してくれる
}
```

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
decltype((x)) b = x; // int&（括弧があるので左辺値扱い）
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

### 型に別の名前を与える

`using 新たな型名 = 元の型名`

とすると型に別名(エイリアス)を付けることができる。<br>

```cpp
using integer = int;

void foo(int a){}
void foo(integer a){} // オーバーロードはできない
```

ただし、あくまで別名も使えるだけなのでオーバーロードには使えない。


### 変数の初期化
変数の初期化には4通りの構文がある。

```cpp
int a = 10;
int b(20);
int c{30};
int d = {40};
```

## 制御構文

### for文
<div class="subtitle"></a>範囲for</div>

`for (型 変数名: 配列)`

とすると配列の各要素を順番に回すことができる。

<a id="範囲for"></a>`for (auto 変数名: 配列)`

とすると配列の要素の型に自動で推論される。



## クラス




## 標準入出力<br>`iostream`

### istreamから1行読み込む<br>`std::istream& getline(std::istream& input, std::string& str);`