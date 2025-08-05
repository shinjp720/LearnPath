<div data-title="C++"></div>
<a id="top" data-name="TOP"></a>

# C++

- 説明文

---

<<<<<<< HEAD
## 型<a id="type" data-name="型"></a>
=======
## <a id="type" data-name="型"></a>型
>>>>>>> c7eda4529132ab22b031f1347a5a443cc9c4fbf3

### auto(型推論)
<span class="code-like">`auto 変数名 = 初期値`</span>

変数の宣言時に初期値を与えている場合、初期値と同じ型に推論してくれる。

<pre><code class="caution">ただし配列のautoによる初期化は、()ではエラーとなったり、{}だと環境依存になったり、型が配列ではなくなったりするので注意が必要。
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

<span class="code-like">using 新たな型名 = 元の型名</span>

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

<<<<<<< HEAD
## 制御構文<a id="control-syntax" data-name="制御構文"></a>
=======
## <a id="control-syntax" data-name="制御構文"></a>制御構文
>>>>>>> c7eda4529132ab22b031f1347a5a443cc9c4fbf3

### for文
<div class="subtitle"></a>範囲for</div>

<span class="code-like">for (型 変数名: 配列)</span>

とすると配列の各要素を順番に回すことができる。

<span class="code-like"><a id="範囲for"></a>`for (auto 変数名: 配列)`</span>

とすると配列の要素の型に自動で推論される。



<<<<<<< HEAD
## クラス<a id="class" data-name="クラス"></a>
=======
## <a id="class" data-name="クラス"></a>クラス
>>>>>>> c7eda4529132ab22b031f1347a5a443cc9c4fbf3

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
クラス名::クラス名()
    [: メンバ変数(初期化値), メンバ変数(初期化値)...] // メンバ初期化リスト
{
    // コンストラクタの本体
}
```

### デフォルトコンストラクタ
引数を取らないコンストラクタの事で、そのクラスのオブジェクトを <span class="code-like">T obj;</span> や <span class="code-like">T obj{};</span> (C++11以降推奨)のように引数なしでインスタンス化する時に呼ばれる。

<div class="subtitle">デフォルトコンストラクタの自動生成ルール</div>

- メンバ変数が組み込み型であれば自分で定義しなくても自動で生成される(この場合、値はゴミ)。
- ユーザー定義のコンストラクタがあれば自動生成されない。
- 強制的に作らせる場合は <span class="code-like"> = default</span> を使う。

```cpp
struct Foo {
    int x;
    Foo(int n) : x(n) {}
    Foo() = default;  // 明示的にデフォルトコンストラクタを復活
};

Foo f;  // OK
```

- 作らせたくない場合は <span class="code-like">= delete</span> を使う。

```cpp
struct Foo {
    Foo() = delete;  // デフォルトコンストラクタを禁止
};
Foo f; // ❌ コンパイルエラー
```

### explicit指定子
<<<<<<< HEAD
特に以下のような単引数のコンストラクタでは、暗黙的にコンストラクタが呼ばれるが、意図していないことが多く、見た目では非常に分かりづらい。<br>
そこで、コンストラクタに<span class="code-like">explicit</span>を付けると暗黙的なコンストラクタの呼び出しを禁止することができる。
=======
以下のような例では暗黙的にコンストラクタが呼ばれるが、<span class="code-like">explicit</span>を付けると暗黙的なコンストラクタの呼び出しを禁止する。
>>>>>>> c7eda4529132ab22b031f1347a5a443cc9c4fbf3

```cpp
struct Foo {
    Foo(int) {}
};

Foo a = 10;  // ← Foo(int) が暗黙的に呼ばれる
```

```cpp
explicit Foo(int) {}
```

特に理由がなければexplicitを指定する。


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
- std::stringなら、まずデフォルトコンストラクタで空文字列を作ってから"bob"を代入するので余計なコストがかかる可能性がある。
- できるだけメンバ初期化リストを使う方が効率的。

<span class="code-like">Foo(int n) : x(n) {}</span>

このように引数を初期化リストに渡せる。

<div class="subtitle">メンバ初期化リストが必須になる場合</div>

- constメンバ
- 参照メンバ
- デフォルトコンストラクタを持たないメンバクラス

```cpp
struct Bar {
    int& ref;        // 参照は必須
    const int c;     // const も必須
    std::string s;   // string も初期化リスト推奨

    Bar(int x) : ref(x), c(42), s("hello") {} // 必須＆推奨
};
```

### デストラクタ
デストラクタはクラスのインスタンスが破棄されるときに呼ばれる特殊なメンバ関数で、メモリの解放や後始末を行う。

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

<<<<<<< HEAD
## 継承<a id="inheritance" data-name="継承"></a>
=======
## <a id="inheritance" data-name="継承"></a>継承
>>>>>>> c7eda4529132ab22b031f1347a5a443cc9c4fbf3
あるクラスの異なる部分を追加、変更してクラスを再利用することを継承という。
継承すると基底クラスのメンバ変数とメンバ関数を全て引き継ぐ。

<span class="subtitle">基本構文</span>

```cpp
class 派生クラス名 : アクセス修飾子 基底クラス名
{
    // クラス本体
}
```

### 仮想関数
派生クラスで基底クラスの関数の処理内容を変更したい場合は基底クラスの宣言時に`virtual`を付けてオーバーライドする。

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

### 純粋仮想関数
基底クラスでは関数の宣言のみで、実装を派生クラスで強制させることができる。これを純粋仮想関数という。

```cpp
virtual 戻り値の型 関数名([引数]) = 0; // 純粋仮想関数
```

純粋仮想関数が宣言されたクラスは抽象クラスとなり、インスタンス化ができなくなる。

### オーバーロード
基底クラスの関数を派生クラスでオーバーロード(シグネチャが異なる関数の定義)する際にも名前の隠蔽が発生して、基底クラスの関数が隠される(つまり派生クラスで同名の関数を定義すると名前の隠蔽が発生する)。<br>
これを避けるには`using`を使って名前隠蔽を解除する。

```cpp
class Derived : public Base
{
public:
    using Base::func;  // ← これで名前隠蔽を解除
    void func(string) { cout << "Derived::func(string)\n"; }
};
```

## 標準入出力<br>`iostream`

### istreamから1行読み込む<br>`std::istream& getline(std::istream& input, std::string& str);`