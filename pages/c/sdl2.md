---
title: SDL2
layout: default
---

# SDL2 <a id="top" data-name="TOP"></a>

### インクルード

```cpp
#include <SDL.h>
```

- 最低限必要。

## 初期化・終了(必須) <a id="start-end" data-name="初期化・終了"></a>

```cpp
SDL_Init(SDL_INIT_VIDEO | SDL_INIT_AUDIO);
```

- SDL全体の初期化。
- 必ず最初に呼ぶ。
- 必要なサブシステムだけ指定するのが基本。

#### 対応する解放処理

```cpp
SDL_Quit();
```

- SDL全体の終了処理。
- プログラムの終了直前に呼ぶ。

---

## ウィンドウ管理 <a id="window" data-name="ウィンドウ管理"></a>

```cpp
SDL_Window* window = SDL_CreateWindow(
    "title",
    SDL_WINDOWPOS_CENTERED,
    SDL_WINDOWPOS_CENTERED,
    800, 600,
    SDL_WINDOW_SHOWN
);
```

- OSウィンドウを作成。
- OpenGL/Vulkanの土台にもなる。

#### 対応する解放処理

```cpp
SDL_DestroyWindow(window);
```

---

## レンダラー <a id="renderer" data-name="レンダラー"></a>

```cpp
SDL_Renderer* renderer =
    SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
```

- GPU(またはソフトウェア)を抽象化。
- SDL2の描画の心臓部。

#### 対応する解放処理

```cpp
SDL_DestroyRenderer(renderer);
```

---

## 描画ループの基本構造 <a id="draw-loop" data-name="描画の基本構造"></a>

#### 以降の描画色を設定(線などを描画する場合)。

```cpp
SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
```

#### 画面のクリア

```cpp
SDL_RenderClear(renderer);
```

#### テクスチャをキャンバス(バックバッファ)に張り付ける(まだ見えない)

```cpp
SDL_RenderCopy(renderer, texture, nullptr, &dstRect);
```

- これを繰り返して奥から手前に貼り付けていく

#### 実際の画面に表示する

```cpp
SDL_RenderPresent(renderer);
```

- バックバッファ -> 画面への表示。
- 1フレームの終わりに1度だけ呼ぶ。

---

## 画像 <a id="image" data-name="画像"></a>

#### 基本的な流れ

<pre><code class="tips">SDL_Init(SDL_INIT_VIDEO);でbmpとgifは読み込める。
bmpとgif以外のファイル形式を使用する場合はSDL_imageが必要。</code></pre>

1. 画像のパスからサーフェイスを取得 -> `SDL_LoadBMP()` または `IMG_Load()`
2. サーフェイスをテクスチャに変換 -> `SDL_CreateTextureFromSurface()`
3. サーフェイスの解放 -> `SDL_FreeSurface()`
4. 画面のクリア -> `SDL_RenderClear()`
5. バックバッファにコピー -> `SDL_RenderCopy()`
6. 画面に表示 -> `SDL_RenderPresent()`

<pre><code class="example"># include &lt;SDL_image.h&gt;;

// 使用する形式の<a href="#flag">フラグ</a>を指定して初期化
int flags = IMG_INIT_PNG | IMG_INIT_JPG;
if ((IMG_Init(flags) & flags) != flags) {
    SDL_Log("IMG_Init error: %s", IMG_GetError());
    return -1;
}

SDL_Surface* iggSurface = IMG_Load("image.png");
if (!imgSurface) {
    SDL_Log("IMG_Load error: %s", IMG_GetError());
    return -1;
}
SDL_Texture* imgTexture = SDL_CreateTextureFromSurface(renderer, imgSurface);
if (!texture) {
    std::cerr << "texture get error." << std::endl;
    return -1;
}
SDL_FreeSurface(imgSurface);

SDL_RenderClear(renderer);
SDL_RenderCopy(renderer, imgTexture, NULL, &textDst);
SDL_RenderPresent(renderer);  // 実際に画面に反映

// 最後に解放
IMG_Quit();</code></pre>

#### または

```cpp
texture = IMG_LoadTexture(renderer, path.c_str());
if (!texture) {
    std::cerr << "texture get error." << std::endl;
    return -1;
}
```

- SDL_imageを使っている、かつsurfaceを触る必要がない場合は<br>
  `IMG_LoadTexture()` を使用するとサーフェイスの取得を省略できる。

<a id="flag"></a>
<table>
    <caption>使用可能な拡張子</caption>
    <tr><th>拡張子</th><th>フラグ</th><th>備考</th></tr>
    <tr><td>.png</td><td>IMG_INIT_PNG</td><td>最も一般的</td></tr>
    <tr><td>.jpg, jpeg</td><td>IMG_INIT_JPG</td><td>写真向き</td></tr>
    <tr><td>.bmp</td><td>不要</td><td>SDL標準対応</td></tr>
    <tr><td>.gif</td><td>不要</td><td>静止画のみ</td></tr>
    <tr><td>.tif, tiff</td><td>IMG_INIT_TIF</td><td>あまり使われていない</td></tr>
    <tr><td>.webp</td><td>IMG_INIT_WEBP</td><td>最近増えている</td></tr>
</table>

<pre><code class="tips">SurfaceはCPUメモリ上の一時バッファ的な存在で、TextureはGPUメモリ(またはドライバ管理領域)なので、それぞれ解放が必要。</code></pre>

#### 対応する解放処理

```cpp
// IMG_Initを使用した場合
IMG_Quit();
```

```cpp
// surfaceの解放
SDL_FreeSurface(surface);
```

```cpp
// textureの解放
SDL_DestroyTexture(texture);
```

<pre><code class="tips">SDL_LoadBMP()とIMG_Load()は、失敗時にnullptrを返し、SDL_FreeSurface(nullptr)とSDL_DestroyTexture(nullptr)は何もしないため安全。</code></pre>

---

## フォント <a id="font" data-name="フォント"></a>

#### 基本的な流れ

1. TTFの初期化 -> `TTF_Init()`
2. フォントの読み込み -> `TTF_OpenFont()`
3. 色の指定 -> `SDL_Color color = {}`
4. サーフェイスに変換 -> `TTF_RenderUTF8_Blended()`
5. テクスチャに変換 -> `SDL_CreateTextureFromSurface()`
6. サーフェイスの解放 -> `SDL_FreeSurface()`
6. 画面のクリア -> `SDL_RenderClear()`
7. バックバッファにコピー -> `SDL_RenderCopy()`
8. 画面に表示 -> `SDL_RenderPresent()`

<pre><code class="example">#include &lt;SDL_ttf.h&gt;

if (TTF_Init()) {
    std::cerr << "ttf init error." << std::endl;
    return -1;
}

TTF_Font* font = TTF_OpenFont("フォントファイル.ttf", フォントのポイントサイズ);
if (font == NULL) {
    std::cerr << "ttf open error." << std::endl;
    return -1;
}
SDL_Color color = {255, 255, 255, 255};  // 白
SDL_Surface* textSurface = TTF_RenderUTF8_Blended(font, "表示する文字列", color);
SDL_Texture* textTexture = SDL_CreateTextureFromSurface(renderer, textSurface);
if (!textTexture) {
    std::cerr << "texture get error." << std::endl;
    return -1;
}
SDL_FreeSurface(textSurface);

SDL_RenderClear(renderer);
SDL_RenderCopy(renderer, textTexture, NULL, &textDst);
SDL_RenderPresent(renderer);  // 実際に画面に反映

TTF_Quit();</code></pre>

#### 幅を計算して自動的に改行する

<pre><code class="example">std::string line;
int w, h;

for (char c : text) {
    line += c;
    TTF_SizeUTF8(font, line.c_str(), &w, &h); // サイズを取得

    if (w > 400) {
        // ここまでが1行
        drawText(line);
        line.clear();
        line += c;  // 次の行の最初の文字
    }
}</code></pre>

#### 対応する解放処理

```cpp
TTF_Quit();
```

---

## 図形 <a id="shape" data-name="図形"></a>

#### 基本的な流れ

1. 色の指定 -> `SDL_Color color = {}`
2. 画面のクリア -> `SDL_RenderClear()`
3. バックバッファに描画 -> `SDL_RenderDrawLine()`
4. 画面に表示 -> `SDL_RenderPresent()`

#### 代表的な描画関数

```cpp
int SDL_RenderDrawPoint(SDL_Renderer* renderer, int x, int y);
int SDL_RenderDrawLine(SDL_Renderer* renderer, int x1, int y1, int x2, int y2);
int SDL_RenderDrawRect(SDL_Renderer* renderer, const SDL_Rect* rect);
int SDL_RenderFillRect(SDL_Renderer* renderer, const SDL_Rect* rect);
```

#### 円を描く

<pre><code class="example">void DrawCircle(SDL_Renderer* r, int cx, int cy, int radius)
{
    for (int x = -radius; x <= radius; x++)
    {
        int y = (int)std::sqrt(radius * radius - x * x);
        SDL_RenderDrawPoint(r, cx + x, cy + y);
        SDL_RenderDrawPoint(r, cx + x, cy - y);
    }
}</code></pre>

---

## ループ構造 <a id="loop" data-name="ループ構造"></a>

### フレームレート制限

<pre><code class="example">const int FPS = 60;
const int frameDelay = 1000 / FPS;

while (running)
{
    Uint32 frameStart = SDL_GetTicks();

    while (SDL_PollEvent(&e)) {
        if (e.type == SDL_QUIT) running = false;
    }

    SDL_RenderClear(renderer);
    SDL_RenderCopy(renderer, tex, NULL, &dst);
    SDL_RenderPresent(renderer);

    Uint32 frameTime = SDL_GetTicks() - frameStart;
    if (frameDelay > frameTime) {
        SDL_Delay(frameDelay - frameTime);  // 無理のない速度で描画
    }
}</code></pre>

### イベント駆動に近いWaitEvent型

<pre><code class="example">while (running) {
    SDL_Event e;
    SDL_WaitEvent(&e);

    switch (e.type) {
        case SDL_QUIT:
            running = false;
            break;
        case SDL_KEYDOWN:
            handle_key(e.key);
            break;
    }

    render();
}</code></pre>

- イベントが来るまでブロック
- 入力が無い間はCPUをほぼ使わない
- ツール系アプリ向き

### さらに負荷を減らすWaitEvent型

<pre><code class="example">SDL_Event e;

while (running) {
    SDL_WaitEvent(&e);

    do { // ここで連続的なイベントは描画前に処理する
        running = handleEvent(&e);
    } while (SDL_PollEvent(&e));

    drawImageWithAspectFit();
}</code></pre>

### 高反応 + 省電力型

<pre><code class="example">while (running) {
    SDL_Event e;
    if (SDL_WaitEventTimeout(&e, frameDelay)) {
        do {
            handleEvent(e);
        } while (SDL_PollEvent(&e));
    }

    update();
    render();
}</code></pre>

---

## イベント処理(入力・ウィンドウ) <a id="event" data-name="イベント処理"></a>

SDL2ではイベントの種類を`SDL_Event.type`で判別する。

```cpp
// 基本形
SDL_Event e;
while (SDL_PollEvent(&e)) {
    if (e.type == SDL_QUIT) {
        // ウィンドウが閉じられた
    }
}
```

<table>
    <caption>よく使うイベント識別子</caption>
    <tr><th>識別子</th><th>意味</th></tr>
    <tr><td>SDL_QUIT</td><td>アプリ終了(×ボタンなど)</td></tr>
    <tr><td>SDL_WINDOWEVENT</td><td>ウィンドウイベント(e.window.event)</td></tr>
    <tr><td>SDL_KEYDOWN</td><td>キーが押された<br>(e.key.keysym.sym)<br>
        <table>
            <tr><td>SDLK_a~SDLK_z</td><td>文字キー</td></tr>
            <tr><td>SDLK_0~SDLK_9</td><td>数字キー</td></tr>
            <tr><td>SDLK_RETURN</td><td>Enter</td></tr>
            <tr><td>SDLK_ESCAPE</td><td>Esc</td></tr>
            <tr><td>SDLK_BACKSPACE</td><td>BackSpace</td></tr>
            <tr><td>SDLK_SPACE</td><td>Space</td></tr>
            <tr><td>SDLK_UP</td><td>上</td></tr>
            <tr><td>SDLK_DOWN</td><td>下</td></tr>
            <tr><td>SDLK_LEFT</td><td>左</td></tr>
            <tr><td>SDLK_RIGHT</td><td>右</td></tr>
            <tr><td>SDLK_F1~SDLK_F12</td><td>ファンクションキー</td></tr>
        </table>    
    </td></tr>
    <tr><td>SDL_KEYUP</td><td>キーが離された</td></tr>
    <tr><td>SDL_MOUSEMOTION</td><td>マウス移動</td></tr>
    <tr><td>SDL_MOUSEBUTTONDOWN</td><td>ボタン押下</td></tr>
    <tr><td>SDL_MOUSEBUTTONUP</td><td>ボタン解放</td></tr>
    <tr><td>SDL_MOUSEWHEEL</td><td>ホイール</td></tr>
</table>

---

### エラー処理

```cpp
std::cerr << SDL_GetError() << std::endl;
```

- SDL関数が失敗したら必ず確認

---

## 関数 <a id="function" data-name="関数"></a>

---

### 初期化・終了

#### SDL_Init

<div class="subtitle">構文</div>
int SDL_Init(Uint32 flags)

<div class="subtitle">引数</div>
flags: サブシステム初期化フラグ

<div class="subtitle">戻り値</div>
成功のとき0, エラーのとき負の数のエラーコードを戻す. SDL_GetError()を呼んで詳細を知ることができる.

<div class="subtitle">詳細</div>

flagsは以下の項目の論理和で複数設定できる。

| flag | 意味 |
| --- | --- |
| SDL_INIT_TIMER | タイマ サブシステム |
| SDL_INIT_AUDIO | オーディオ サブシステム |
| SDL_INIT_VIDEO | ビデオ サブシステム. イベントサブシステムも自動的に初期化される |
| SDL_INIT_JOYSTICK | ジョイスティック サブシステム. イベントサブシステムも自動的に初期化される |
| SDL_INIT_HAPTIC | ハプティクス(感覚フィードバック) サブシステム|
| SDL_INIT_GAMECONTROLLER | コントローラー サブシステム. ジョイスティックサブシステムも自動的に初期化される |
| SDL_INIT_EVENTS | イベント サブシステム |
| SDL_INIT_SENSOR | センサー |
| SDL_INIT_EVERYTHING | 上記のサブシステムの全て |
| SDL_INIT_NOPARACHUTE | 互換性のために存在する. このフラグは機能しない |

<div class="subtitle">サンプルコード</div>

<pre><code class="example">#include "SDL.h"

int main(int argc, char* argv[]) {
    if (SDL_Init(SDL_INIT_VIDEO|SDL_INIT_AUDIO) != 0) {
        SDL_Log("SDLを初期化できなかった: %s", SDL_GetError());
        return 1;
    }

    /* ... */

    SDL_Quit();
    return 0;
}</code></pre>

#### SDL_Quit

<div class="subtitle">構文</div>
void SDL_Quit(void)

<div class="subtitle">詳細</div>
SDL_QuitSubSystem()で既に個別にサブシステムを終了した場合でもこの関数を呼ばなければならない. 初期化中にエラーが発生した場合でもこの関数は呼んでも安全である.

#### SDL_GetError

<div class="subtitle">構文</div>
const char* SDL_GetError(void)

<div class="subtitle">戻り値</div>
発生したエラーの情報のメッセージを返す。または, `SDL_ClearError()`を呼んでからエラーがなければ, 空の文字列を戻す.

<div class="subtitle">詳細</div>
複数のエラーが発生している場合は最後のエラーメッセージのみを返す。
SDL_GetError()を呼べるか否かは, SDL関数の戻り値をチェックする必要がある. エラーが発生したかを確認するためにSDL_GetError()の結果を利用すべきではない。

<div class="subtitle">サンプルコード</div>

<pre><code class="example">if (SDL_Init(SDL_INIT_EVERYTHING) < 0) {
    // 回復できないエラー. ここで終了処理を行う
    printf("SDL_Init 失敗: %s¥n", SDL_GetError());
}</code></pre>

### ウィンドウ・レンダラー

#### SDL_CreateWindow

<div class="subtitle">構文</div>
SDL_Window* SDL_CreateWindow(const char* title, int x, int y, int w, int h, Uint32 flags)

<div class="subtitle">引数</div>

| 引数名 | 意味 |
| --- | --- |
| title	| UTF-8文字列のウィンドウのタイトル |
| x	| ウィンドウのスクリーン座標系のX座標, SDL_WINDOWPOS_CENTERED, または SDL_WINDOWPOS_UNDEFINED |
| y	| ウィンドウのスクリーン座標系のY座標, SDL_WINDOWPOS_CENTERED, または SDL_WINDOWPOS_UNDEFINED |
| w	| ウィンドウのスクリーン座標系の幅 |
| h	| ウィンドウのスクリーン座標系の高さ |
| flags	| 0 または 1つ以上のSDL_WindowFlags列挙体の論理和 |

SDL_WindowFlags

| フラグ | 意味 |
| --- | --- |
| SDL_WINDOW_FULLSCREEN | フルスクリーン |
| SDL_WINDOW_FULLSCREEN_DESKTOP | 現在のデスクトップの解像度でフルスクリーン |
| SDL_WINDOW_OPENGL | OpenGLコンテキストを使用 |
| SDL_WINDOW_VULKAN| Vulkanインスタンスを使用 |
| SDL_WINDOW_METAL | ウィンドウはMetalビューを使用 |
| SDL_WINDOW_SHOWN | 見えている |
| SDL_WINDOW_HIDDEN | 見えていない |
| SDL_WINDOW_BORDERLESS | 枠がない |
| SDL_WINDOW_RESIZABLE | 大きさを変えられる |
| SDL_WINDOW_MINIMIZED | 最小化されている |
| SDL_WINDOW_MAXIMIZED | 最大化されている |
| SDL_WINDOW_MOUSE_GRABBED | ウィンドウはマウス入力をグラブしている |
| SDL_WINDOW_INPUT_GRABBED | SDL_WINDOW_MOUSE_GRABBEDと同等(互換性のため) |
| SDL_WINDOW_KEYBOARD_GRABBED | ウィンドウはキーボード入力をグラブしている |
| SDL_WINDOW_INPUT_FOCUS | 入力のフォーカスがある |
| SDL_WINDOW_MOUSE_FOCUS | マウスのフォーカスがある |
| SDL_WINDOW_FOREIGN | SDL以外によって生成された |
| SDL_WINDOW_ALLOW_HIGHDPI | 高DPIモードで生成された (SDL2.0.1以上) |
| SDL_WINDOW_MOUSE_CAPTURE | ウィンドウはマウスを捕捉している(INPUT_GRABBEDとは無関係である. SDL2.0.4以上) |
| SDL_WINDOW_ALWAYS_ON_TOP | ウィンドウは常に他の上にある (SDL2.0.5以上) |
| SDL_WINDOW_SKIP_TASKBAR | ウィンドウはタスクバーに加えられない (X11専用 SDL2.0.5以上) |
| SDL_WINDOW_UTILITY | ウィンドウはユーティリティウィンドウとして扱われる (X11専用 SDL2.0.5以上) |
| SDL_WINDOW_TOOLTIP | ウィンドウはツールチップとして扱われる (X11専用 SDL2.0.5以上) |
| SDL_WINDOW_POPUP_MENU | ウィンドウはポップアップメニューとして扱われる (X11専用 SDL2.0.5以上) |

<div class="subtitle">戻り値</div>
生成されたSDL_Windowのポインタを返す。 失敗のときNULLを戻す. SDL_GetError()を呼んで詳細を知ることができる.

<div class="subtitle">詳細</div>

SDL_CreateWindow()ではSDL_WINDOW_SHOWNは無視される. SDL_WindowはSDL_WINDOW_HIDDENが設定されない限り表示される. SDL_WINDOW_SHOWNはSDL_GetWindowFlags()で問い合わせたとき使われる.
AppleのmacOSでは, Info.plistのNSHighResolutionCapableプロパティは必ずYESでなければならない. そうしなければ高DPI OpenGL キャンバスを受信できない.
フルスクリーンの設定をした場合, 幅と高さの引数であるwとhは使われない. しかし, 不正なサイズの引数(例えば大きすぎる)の場合は失敗する.
SDL_WINDOW_OPENGLまたはSDL_WINDOW_VULKANフラグを指定してウィンドウを生成すると, 一致するLoadLibrary関数(SDL_GL_LoadLibrary()またはSDL_Vulkan_LoadLibrary())が呼び出され, SDL_DestroyWindow()で一致するUnloadLibrary関数が呼ばれる.
SDL_WINDOW_VULKANを指定してVulkanドライバが動作しなかった場合, SDL_Vulkan_LoadLibrary()が失敗するためSDL_CreateWindow()も失敗する.

<div class="subtitle">サンプルコード</div>

<pre><code class="example">#include "SDL.h"
#include &lt;stdio.h&gt;

int main(int argc, char* argv[]) {

    SDL_Init(SDL_INIT_VIDEO);              // SDL2を初期化する

    SDL_Window *window;                    // ポインタを宣言する
    // 次の設定でアプリケーションウィンドウを生成する:
    window = SDL_CreateWindow(
        "An SDL2 window",                  // ウィンドウのタイトル
        SDL_WINDOWPOS_UNDEFINED,           // X座標の初期値
        SDL_WINDOWPOS_UNDEFINED,           // Y座標の初期値
        640,                               // 幅のピクセル数
        480,                               // 高さのピクセル数
        SDL_WINDOW_OPENGL                  // フラグ
    );

    // ウィンドウの生成に成功したかチェックする
    if (window == NULL) {
        // ここを通ったならばウィンドウを生成できなかった...
        printf("ウィンドウを生成できなかった: %s¥n", SDL_GetError());
        return 1;
    }

    // ウィンドウが開いた: ここでプログラムループに入る (SDL_PollEvent()を参照すること)

    SDL_Delay(3000);  // 例として3000ミリ秒間停止する

    // ウィンドウを閉じて破棄する
    SDL_DestroyWindow(window);

    // 終了処理
    SDL_Quit();
    return 0;
}</code></pre>
  
#### SDL_DestroyWindow

<div class="subtitle">構文</div>
void SDL_DestroyWindow(SDL_Window* window)

<div class="subtitle">引数</div>
window: 破棄するウィンドウ

<div class="subtitle">詳細</div>
windowがNULLの場合, この関数はSDLエラーメッセージに "Invalid window" を設定してすぐに戻る. SDL_GetError()を参照すること.

#### SDL_CreateRenderer

<div class="subtitle">構文</div>


<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>


SDL_DestroyRenderer  

SDL_SetWindowSize  
SDL_SetWindowFullscreen  
SDL_GetWindowSize  

SDL_RenderPresent  
SDL_RenderClear  
    


<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### イベント処理

SDL_PollEvent  
SDL_WaitEvent  

SDL_PumpEvents  

SDL_GetKeyboardState  
SDL_GetMouseState  
SDL_GetGlobalMouseState  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### 描画系

SDL_SetRenderDrawColor  
SDL_RenderDrawPoint  
SDL_RenderDrawLine  
SDL_RenderDrawRect  
SDL_RenderFillRect  

SDL_RenderCopy  
SDL_RenderCopyEx  





<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### テクスチャ・サーフェス

SDL_CreateTexture  
SDL_DestroyTexture  

SDL_CreateTextureFromSurface  
SDL_QueryTexture  

SDL_LoadBMP  
SDL_FreeSurface  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### 画像

IMG_Init  
IMG_Quit  
IMG_Load  
IMG_LoadTexture  


<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### フォント

TTF_Init  
TTF_Quit  

TTF_OpenFont  
TTF_CloseFont  

TTF_RenderUTF8_Blended  
TTF_RenderText_Blended  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### 入力（キーボード・マウス・ゲームパッド）

SDL_GetKeyboardState  
SDL_GetScancodeFromKey  

SDL_MouseButtonEvent  
SDL_MouseMotionEvent  

SDL_NumJoysticks  
SDL_GameControllerOpen  
SDL_GameControllerGetButton  
SDL_GameControllerGetAxis 



<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

###  時間・FPS制御

SDL_GetTicks  
SDL_GetPerformanceCounter  
SDL_GetPerformanceFrequency  

SDL_Delay  




<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### ウィンドウとレンダラーの実用系

SDL_SetRenderTarget  
SDL_GetRendererOutputSize  
SDL_SetRenderScale  


<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### クリップ・表示範囲

SDL_RenderSetClipRect  
SDL_RenderGetClipRect  


<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### カーソル・表示

SDL_ShowCursor  
SDL_SetCursor  
SDL_CreateSystemCursor  


<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### その他よく使う補助

SDL_memset  
SDL_memcpy  
SDL_Log  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>






## 導入 <a id="introduction" data-name="導入"></a>
