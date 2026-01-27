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

---

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

---

#### SDL_Quit

<div class="subtitle">構文</div>
void SDL_Quit(void)

<div class="subtitle">詳細</div>
SDL_QuitSubSystem()で既に個別にサブシステムを終了した場合でもこの関数を呼ばなければならない. 初期化中にエラーが発生した場合でもこの関数は呼んでも安全である.

---

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

---

### ウィンドウ・レンダラー

---

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

---

#### SDL_CreateRenderer

<div class="subtitle">構文</div>
SDL_Renderer* SDL_CreateRenderer(SDL_Window* window, int index, Uint32 flags)

<div class="subtitle">引数</div>

window: レンダリングを表示するウィンドウ<br>
index: 初期化するレンダリングドライバの番号. -1のとき要求のflagsに対応した最初のドライバを初期化する<br>
flags: 0または1つ以上のSDL_RendererFlagsの倫理和

<div class="subtitle">戻り値</div>

成功のときレンダリングコンテキスト, 失敗のときNULLを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>

SDL_RendererFlags

| フラグ | 意味 |
| --- | --- |
| SDL_RENDERER_SOFTWARE | ソフトウェア レンダラー |
| SDL_RENDERER_ACCELERATED | ハードウェア アクセラレーション |
| SDL_RENDERER_PRESENTVSYNC | 更新周期と同期 |
| SDL_RENDERER_TARGETTEXTURE | テクスチャへのレンダリングに対応 |

<div class="subtitle">サンプルコード</div>

<pre><code class="example">#include "SDL.h"

int main(int argc, char *argv[])
{
    SDL_Window *win = NULL;
    SDL_Renderer *renderer = NULL;
    SDL_Texture *bitmapTex = NULL;
    SDL_Surface *bitmapSurface = NULL;
    int posX = 100, posY = 100, width = 320, height = 240;
    SDL_bool loopShouldStop = SDL_FALSE;

    SDL_Init(SDL_INIT_VIDEO);

    win = SDL_CreateWindow("Hello World", posX, posY, width, height, 0);

    renderer = SDL_CreateRenderer(win, -1, SDL_RENDERER_ACCELERATED);

    bitmapSurface = SDL_LoadBMP("img/hello.bmp");
    bitmapTex = SDL_CreateTextureFromSurface(renderer, bitmapSurface);
    SDL_FreeSurface(bitmapSurface);

    while (!loopShouldStop)
    {
        SDL_Event event;
        while (SDL_PollEvent(&event))
        {
            switch (event.type)
            {
                case SDL_QUIT:
                    loopShouldStop = SDL_TRUE;
                    break;
            }
        }

        SDL_RenderClear(renderer);
        SDL_RenderCopy(renderer, bitmapTex, NULL, NULL);
        SDL_RenderPresent(renderer);
    }

    SDL_DestroyTexture(bitmapTex);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(win);

    SDL_Quit();

    return 0;
}</code></pre>

---

#### SDL_DestroyRenderer  

<div class="subtitle">構文</div>

void SDL_DestroyRenderer(SDL_Renderer* renderer)

<div class="subtitle">引数</div>

renderer: レンダリングコンテキスト

<div class="subtitle">詳細</div>

rendererがNULLの場合, この関数はSDLエラーメッセージ"Invalid renderer"を設定してすぐに戻る. SDL_GetError()を参照すること.

---

#### SDL_SetWindowSize

<div class="subtitle">構文</div>

void SDL_SetWindowSize(SDL_Window* window, int w, int h)

<div class="subtitle">引数</div>

window: 設定するウィンドウ
w: スクリーン座標系でのウィンドウの幅のピクセル数. 0より大きい必要がある
h: スクリーン座標系でのウィンドウの高さのピクセル数. 0より大きい必要がある

<div class="subtitle">詳細</div>

フルスクリーンウィンドウの場合は自動的にディスプレイモードのサイズになる. そして, サイズを変える場合はSDL_SetWindowDisplayMode()を使う必要がある.

---

#### SDL_SetWindowFullscreen  

<div class="subtitle">構文</div>

int SDL_SetWindowFullscreen(SDL_Window* window, Uint32 flags)

<div class="subtitle">引数</div>

window: 設定するウィンドウ
flags: SDL_WINDOW_FULLSCREEN, SDL_WINDOW_FULLSCREEN_DESKTOP または 0 (詳細を参照すること)

<div class="subtitle">戻り値</div>

成功のとき0を, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()を呼んで詳細を知ることができる.

<div class="subtitle">詳細</div>

flagsをSDL_WINDOW_FULLSCREENにするとビデオモードを変え「本当の」フルスクリーンになる. SDL_WINDOW_FULLSCREEN_DESKTOPにするとデスクトップと同じサイズにした「ニセの」フルスクリーンになる. 0のときウィンドウモードになる.

---

#### SDL_GetWindowSize  

<div class="subtitle">構文</div>
void SDL_GetWindowSize(SDL_Window* window, int* w, int* h)

<div class="subtitle">引数</div>

window: 幅と高さを得るウィンドウ
x: スクリーン座標系のウィンドウの幅を代入するポインタ. NULLでもよい
y: スクリーン座標系のウィンドウの高さを代入するポインタ. NULLでもよい

<div class="subtitle">詳細</div>

幅または高さが必要なければ, 引数のwまたはhをNULLにしてもよい.

---

#### SDL_RenderPresent  

<div class="subtitle">構文</div>

void SDL_RenderPresent(SDL_Renderer* renderer)

<div class="subtitle">引数</div>

renderer: レンダリングコンテキスト

<div class="subtitle">詳細</div>

レンダリングの結果を画面に反映する.SDLのレンダリング関数は背面バッファを操作する. つまり, SDL_RenderDrawLine()のようなレンダリング関数を呼んでも, 背景バッファに線が描かれるだけで, 直接画面には描かれない. グラフィックを描いた後, 背景バッファを画面に反映させる必要がある.
よって, SDLレンダリングAPIを使う場合は, そのフレームを全て描き, そしてこの関数をフレームごとに呼んでユーザに見せる必要がある.
背景バッファは反映した後は無効になると考える必要がある. つまり, 前のフレームのグラフィックが残っているとみなしてはならない. 全てのピクセルを上書きする場合でも, 各フレームを描く前にSDL_RenderClear()を呼んで背景バッファを初期化することを推奨する.

<div class="subtitle">サンプルコード</div>

<pre><code class="example">#include "SDL.h"

int main(int argc, char* argv[])
{
        SDL_Window* window;
        SDL_Renderer* renderer;

        // SDLを初期化する
        if (SDL_Init(SDL_INIT_VIDEO) < 0)
                return 1;

        // 描画するウィンドウを生成する
        window = SDL_CreateWindow("SDL_RenderClear",
                        SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
                        512, 512,
                        0);

        // ウィンドウへの描画で使うSDL_CreateRendererを生成する
        renderer = SDL_CreateRenderer(window, -1, 0);

        // 描画の色を選択する. ここでは赤を設定する
        SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);

        // 選択した色で画面を消去する
        SDL_RenderClear(renderer);

        // 上の描画は全て裏側で行われている
        // これで新たに表示され, ウィンドウが赤くなる
        SDL_RenderPresent(renderer);

        // ウィンドウを見せるために5秒待つ
        SDL_Delay(5000);

        // 全て終了する
        SDL_Quit();
        return 0;
}</code></pre>

---

#### SDL_RenderClear  
    
<div class="subtitle">構文</div>

int SDL_RenderClear(SDL_Renderer* renderer)

<div class="subtitle">引数</div>

renderer: レンダリングコンテキスト

<div class="subtitle">戻り値</div>

成功のとき0, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>

現在のレンダーターゲットを色で塗りつぶして消去する.この関数は描画領域とクリップ領域を無視して全体を消去する.

---

### イベント処理

---

#### SDL_PollEvent

<div class="subtitle">構文</div>

int SDL_PollEvent(SDL_Event* event)

<div class="subtitle">引数</div>

event: キューから得たイベントを代入するSDL_EventまたはNULL

<div class="subtitle">戻り値</div>

未処理のイベントがある場合は1, ない場合は0を戻す.

<div class="subtitle">詳細</div>

未処理のイベントをキューから得る.eventがNULLでない場合, イベントはキューから削除され, SDL_Event構造体のeventに代入される. 戻った1は, 削除されSDLイベント構造体に収められたこのイベントのことを指している――続くイベントのことではない.

eventがNULLの場合, イベントがキューにある場合1を戻すが, イベントは削除されない.

この関数は暗黙のうちにSDL_PumpEvents()を呼んでいる. この関数はビデオモードを設定したスレッドのみで呼べる.

SDL_PollEvent()はシステムイベントを受信する望ましい方法である. この関数を使えば, メインループでイベントが発生するのを待つことなく処理できる.

一般的には1フレームごとに, 通常はゲームの状態を更新する前の最初の処理として全イベントを処理する.

<div class="subtitle">サンプルコード</div>

<pre><code class="example">while (1) {
    SDL_Event event;
    while (SDL_PollEvent(&event)) { // 全てのイベントがハンドルされるまで獲得する!
         // ここでイベントを処理する
    }
    // ここで別の処理(描画など)を行う
}</code></pre>

---

#### SDL_WaitEvent  

<div class="subtitle">構文</div>

int SDL_WaitEvent(SDL_Event* event)

<div class="subtitle">引数</div>

event: キューから得たイベントを代入するSDL_EventまたはNULL

<div class="subtitle">戻り値</div>

成功のとき1, イベントを待っているときエラーが発生すれば0を戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>

次のイベントが発生するまで無制限に待つ.eventがNULLでない場合, イベントはキューから削除され, SDL_Event構造体のeventに代入される.この関数は暗黙のうちにSDL_PumpEvents()を呼んでいる. この関数はビデオモードを設定したスレッドのみで呼べる.

<div class="subtitle">サンプルコード</div>

---

#### SDL_PumpEvents  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### SDL_GetKeyboardState  

<div class="subtitle">構文</div>

void SDL_PumpEvents(void)

<div class="subtitle">詳細</div>

この関数は内部の入力デバイスの状態とイベントキューを更新する.<br>
注意: この関数はビデオサブシステムを初期化したスレッドで呼ぶ必要がある. さらに安全性を考えると, いかなる場合でもメインスレッドで呼ぶべきである.<br>
SDL_PumpEvents()は装置から全ての未処理の入力情報を吸い出し, イベントキューに加える. イベントがないときSDL_PumpEvents()を呼ぶと, キューには何も加えられない. SDL_PollEvent()とSDL_WaitEvent()は暗黙のうちにSDL_PumpEvents()を呼んでいるため, ユーザからはSDL_PumpEvents()の呼び出しは隠されている. しかし, イベントを(例えばフィルタで処理しているので)獲得しないまたは待たないならば, SDL_PumpEvents()を呼んでイベントキューを強制的に更新する必要がある.

#### SDL_GetMouseState  

<div class="subtitle">構文</div>

Uint32 SDL_GetMouseState(int* x, int* y)

<div class="subtitle">引数</div>

x: フォーカスのあるウィンドウからの相対X座標を代入するポインタ
y: フォーカスのあるウィンドウからの相対Y座標を代入するポインタ

<div class="subtitle">戻り値</div>

現在のボタンのビットマスクを戻す.

<div class="subtitle">詳細</div>

現在のマウスの状態を得る.現在のボタンの状態は, 戻り値のビットマスクで, SDL_BUTTON(X)マクロでチェックできる (通常はX=1が左, 2が中央, 3が右). そして, 選択したフォーカスのあるウィンドウからの相対座標はxとyに代入される. xとyにはNULLを渡すことができる.

<div class="subtitle">サンプルコード</div>
<pre><code class="example">int x, y;
Uint32 buttons;

SDL_PumpEvents();  // 最新のマウスの状態を確実に得る

buttons = SDL_GetMouseState(&x, &y);

SDL_Log("マウスカーソルの座標は %d, %d", x, y);
if ((buttons & SDL_BUTTON_LMASK) != 0) {
    SDL_Log("マウスボタン1(左)が押された");
}</code></pre>

---

### SDL_GetGlobalMouseState  

<div class="subtitle">構文</div>

Uint32 SDL_GetGlobalMouseState(int* x, int* y)

<div class="subtitle">引数</div>

x: 現在のデスクトップからのX座標を代入するポインタ. NULLも可能
y: 現在のデスクトップからのY座標を代入するポインタ. NULLも可能
    
<div class="subtitle">戻り値</div>

ボタンの状態をSDL_BUTTON(X)マクロでテストできるビットマスクで戻す.

<div class="subtitle">詳細</div>
マウスのデスクトップからの座標を得る.これはSDL_GetMouseState()と同じような働きをする. しかし, デスクトップの左上からの相対座標が報告される. これは, ウィンドウの外のマウスを追跡する必要があるが, SDL_CaptureMouse()が適さないときに有用である. 例えば, ウィンドウをドラッグしている最中にマウスを追跡する必要がある場合, そのウィンドウからの相対座標は常に同期しているとは限らないため, この関数が有用であろう.<br>
注意: SDL_GetMouseState()はSDLのイベントキューから最後に得たマウスの座標を戻す.しかし, この関数はOSに現在のマウスの位置を問い合わせる. それゆえにこの関数はあまり効率的でない. 自分が何をしているのかわかっていて, この関数を使わなければならない理由がない限り, 代わりにSDL_GetMouseState()を使うほうがよいだろう.

---

### 描画系

---

#### SDL_SetRenderDrawColor  

<div class="subtitle">構文</div>

int SDL_GetRenderDrawColor(SDL_Renderer* renderer, Uint8* r, Uint8* g, Uint8* b, Uint8* a)

<div class="subtitle">引数</div>

renderer: レンダリングコンテキスト
r: 描画で使われる赤成分の値を代入するポインタ
g: 描画で使われる緑成分の値を代入するポインタ
b: 描画で使われる青成分の値を代入するポインタ
a: 描画で使われるα成分の値を代入するポインタ. 通常はSDL_ALPHA_OPAQUE(255)

<div class="subtitle">戻り値</div>

成功のとき0, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>
    
描画操作(長方形, 直線, 消去)で使う色を得る.

---

#### SDL_RenderDrawPoint  

<div class="subtitle">構文</div>

int SDL_RenderDrawPoint(SDL_Renderer* renderer, int x, int y)

<div class="subtitle">引数</div>

renderer: レンダリングコンテキスト
x: 点のX座標
y: 点のY座標

<div class="subtitle">戻り値</div>

成功のとき0, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>

現在のレンダーターゲットに点を描く.<br>
SDL_RenderDrawPoint()は1つの点を描く. 複数の点を描く場合は, 代わりにSDL_RenderDrawPoints()が使える.

---

#### SDL_RenderDrawLine  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_RenderDrawRect  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_RenderFillRect  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_RenderCopy  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_RenderCopyEx  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### テクスチャ・サーフェス

---

#### SDL_CreateTexture  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_DestroyTexture  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_CreateTextureFromSurface  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_QueryTexture  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_LoadBMP  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_FreeSurface  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### 画像

---

#### IMG_Init  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### IMG_Quit  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### IMG_Load  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### IMG_LoadTexture  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### フォント

---

#### TTF_Init  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### TTF_Quit  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### TTF_OpenFont  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### TTF_CloseFont  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### TTF_RenderUTF8_Blended  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### TTF_RenderText_Blended  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### 入力（キーボード・マウス・ゲームパッド）

---

#### SDL_GetKeyboardState

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_GetScancodeFromKey  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_MouseButtonEvent

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_MouseMotionEvent  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_NumJoysticks  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_GameControllerOpen  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_GameControllerGetButton  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>
  
---

#### SDL_GameControllerGetAxis 

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

###  時間・FPS制御

---

#### SDL_GetTicks  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_GetPerformanceCounter  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_GetPerformanceFrequency  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### SDL_Delay  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### ウィンドウとレンダラーの実用系

---

#### SDL_SetRenderTarget  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_GetRendererOutputSize  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_SetRenderScale  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### クリップ・表示範囲

---

#### SDL_RenderSetClipRect  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_RenderGetClipRect  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### カーソル・表示

---

#### SDL_ShowCursor  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_SetCursor  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_CreateSystemCursor  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

### その他よく使う補助

---

#### SDL_memset  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_memcpy  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

#### SDL_Log  

<div class="subtitle">構文</div>
<div class="subtitle">引数</div>
<div class="subtitle">戻り値</div>
<div class="subtitle">詳細</div>
<div class="subtitle">サンプルコード</div>

---

## 導入 <a id="introduction" data-name="導入"></a>
