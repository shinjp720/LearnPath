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

- RenderCopyを繰り返して奥から手前に貼り付けていく

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
SDLライブラリを初期化する. 他のほとんどのSDLの関数を呼び出す前にこの関数を呼ぶ必要がある.

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
サブシステムを終了する. いかなる場合でもこの関数を呼ばなければならない.

<div class="subtitle">構文</div>
void SDL_Quit(void)

<div class="subtitle">詳細</div>
SDL_QuitSubSystem()で既に個別にサブシステムを終了した場合でもこの関数を呼ばなければならない. 初期化中にエラーが発生した場合でもこの関数は呼んでも安全である.

---

#### SDL_GetError
現在のスレッドで最後に発生したエラーのメッセージを得る.

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
位置, 大きさ, フラグを指定してウィンドウを生成する。

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
SDL_CreateWindow()ではSDL_WINDOW_SHOWNは無視される. SDL_WindowはSDL_WINDOW_HIDDENが設定されない限り表示される. <br>SDL_WINDOW_SHOWNはSDL_GetWindowFlags()で問い合わせたとき使われる.<br>
AppleのmacOSでは, Info.plistのNSHighResolutionCapableプロパティは必ずYESでなければならない. そうしなければ高DPI OpenGL キャンバスを受信できない.<br>
フルスクリーンの設定をした場合, 幅と高さの引数であるwとhは使われない. しかし, 不正なサイズの引数(例えば大きすぎる)の場合は失敗する.<br>
SDL_WINDOW_OPENGLまたはSDL_WINDOW_VULKANフラグを指定してウィンドウを生成すると, 一致するLoadLibrary関数(SDL_GL_LoadLibrary()またはSDL_Vulkan_LoadLibrary())が呼び出され, SDL_DestroyWindow()で一致するUnloadLibrary関数が呼ばれる.<br>
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

---

#### SDL_DestroyWindow
ウィンドウを破棄する。

<div class="subtitle">構文</div>
void SDL_DestroyWindow(SDL_Window* window)

<div class="subtitle">引数</div>
window: 破棄するウィンドウ

<div class="subtitle">詳細</div>
windowがNULLの場合, この関数はSDLエラーメッセージに "Invalid window" を設定してすぐに戻る. SDL_GetError()を参照すること.

---

#### SDL_CreateRenderer
ウィンドウの2Dレンダリングコンテキストを生成する.

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
ウィンドウのレンダリングコンテキストと関連のテクスチャを破棄する.

<div class="subtitle">構文</div>
void SDL_DestroyRenderer(SDL_Renderer* renderer)

<div class="subtitle">引数</div>
renderer: レンダリングコンテキスト

<div class="subtitle">詳細</div>
rendererがNULLの場合, この関数はSDLエラーメッセージ"Invalid renderer"を設定してすぐに戻る. SDL_GetError()を参照すること.

---

#### SDL_SetWindowSize
ウィンドウのクライアント領域のサイズを設定する.

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
ウィンドウのフルスクリーン状態を設定する.

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
ウィンドウのクライアント領域のサイズを得る.

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
レンダリングの結果を画面に反映する.

<div class="subtitle">構文</div>
void SDL_RenderPresent(SDL_Renderer* renderer)

<div class="subtitle">引数</div>
renderer: レンダリングコンテキスト

<div class="subtitle">詳細</div>
SDLのレンダリング関数は背面バッファを操作する. つまり, SDL_RenderDrawLine()のようなレンダリング関数を呼んでも, 背景バッファに線が描かれるだけで, 直接画面には描かれない. グラフィックを描いた後, 背景バッファを画面に反映させる必要がある.
よって, SDLレンダリングAPIを使う場合は, そのフレームを全て描き, そしてこの関数をフレームごとに呼んでユーザに見せる必要がある.<br>
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
現在のレンダーターゲットを色で塗りつぶして消去する.

<div class="subtitle">構文</div>
int SDL_RenderClear(SDL_Renderer* renderer)

<div class="subtitle">引数</div>
renderer: レンダリングコンテキスト

<div class="subtitle">戻り値</div>
成功のとき0, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>
この関数は描画領域とクリップ領域を無視して全体を消去する.

---

### イベント処理

---

#### SDL_PollEvent
未処理のイベントをキューから得る.

<div class="subtitle">構文</div>
int SDL_PollEvent(SDL_Event* event)

<div class="subtitle">引数</div>
event: キューから得たイベントを代入するSDL_EventまたはNULL

<div class="subtitle">戻り値</div>
未処理のイベントがある場合は1, ない場合は0を戻す.

<div class="subtitle">詳細</div>
eventがNULLでない場合, イベントはキューから削除され, SDL_Event構造体のeventに代入される. 戻った1は, 削除されSDLイベント構造体に収められたこのイベントのことを指している――続くイベントのことではない.<br>
eventがNULLの場合, イベントがキューにある場合1を戻すが, イベントは削除されない.<br>
この関数は暗黙のうちにSDL_PumpEvents()を呼んでいる. この関数はビデオモードを設定したスレッドのみで呼べる.<br>
SDL_PollEvent()はシステムイベントを受信する望ましい方法である. この関数を使えば, メインループでイベントが発生するのを待つことなく処理できる.<br>
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
次のイベントが発生するまで無制限に待つ.

<div class="subtitle">構文</div>
int SDL_WaitEvent(SDL_Event* event)

<div class="subtitle">引数</div>
event: キューから得たイベントを代入するSDL_EventまたはNULL

<div class="subtitle">戻り値</div>
成功のとき1, イベントを待っているときエラーが発生すれば0を戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>
eventがNULLでない場合, イベントはキューから削除され, SDL_Event構造体のeventに代入される.この関数は暗黙のうちにSDL_PumpEvents()を呼んでいる. この関数はビデオモードを設定したスレッドのみで呼べる.

---

#### SDL_WaitEventTimeout
次のイベントが発生するまで指定の時間(ミリ秒)待つ.

<div class="subtitle">構文</div>
int SDL_WaitEventTimeout(SDL_Event* event, int timeout)

<div class="subtitle">引数</div>
event: キューから得たイベントを代入するSDL_EventまたはNULL
timeout: 次のイベントを待つミリ秒単位の最大時間

<div class="subtitle">戻り値</div>
成功のとき1, イベントを待っているときエラーが発生すれば0を戻す. SDL_GetError()で詳細を知ることができる. イベントが届かずタイムアウトした場合も0を戻す.

<div class="subtitle">詳細</div>
eventがNULLでない場合, イベントはキューから削除され, SDL_Event構造体のeventに代入される.<br>
この関数は暗黙のうちにSDL_PumpEvents()を呼んでいる. この関数はビデオモードを設定したスレッドのみで呼べる.

---

#### SDL_PumpEvents  
入力デバイスから吸い出したイベントをイベントループに加える.

<div class="subtitle">構文</div>
void SDL_PumpEvents(void)

<div class="subtitle">詳細</div>
この関数は内部の入力デバイスの状態とイベントキューを更新する.<br>
注意: この関数はビデオサブシステムを初期化したスレッドで呼ぶ必要がある. さらに安全性を考えると, いかなる場合でもメインスレッドで呼ぶべきである.<br>
SDL_PumpEvents()は装置から全ての未処理の入力情報を吸い出し, イベントキューに加える. イベントがないときSDL_PumpEvents()を呼ぶと, キューには何も加えられない. SDL_PollEvent()とSDL_WaitEvent()は暗黙のうちにSDL_PumpEvents()を呼んでいるため, ユーザからはSDL_PumpEvents()の呼び出しは隠されている. しかし, イベントを(例えばフィルタで処理しているので)獲得しないまたは待たないならば, SDL_PumpEvents()を呼んでイベントキューを強制的に更新する必要がある.

---

### SDL_GetKeyboardState
キーボードの状態を得る.

<div class="subtitle">構文</div>
const Uint8* SDL_GetKeyboardState(int* numkeys)

<div class="subtitle">引数</div>
numkeys: NULLでないとき, 戻した配列の長さが代入される

<div class="subtitle">戻り値</div>
キー状態の配列へのポインタを戻す.

<div class="subtitle">詳細</div>
戻されたポインタはSDL内部の配列へのポインタである. アプリケーションの実行中は常に有効で, 呼び出し側は解放してはならない.<br>
値が1のとき押されていて, 0のとき押されていない. 配列の添え字はSDL_Scancodeである.<br>
メモ: SDL_PumpEvents()でこの状態は更新される.<br>
メモ: この関数は全てのイベントを処理した後に状態を獲得する. よって, もしイベントを処理する前にキーやボタンを押したり離したりすると, SDL_GetKeyboardState()では押されたキーを知ることができない.<br>
メモ: この関数はシフトキーの状態を考慮しない.

<div class="subtitle">サンプルコード</div>
<pre><code class="example">const Uint8 *state = SDL_GetKeyboardState(NULL);
if (state[SDL_SCANCODE_RETURN]) {
    printf("&gt;RETURN&lt; が押された¥n");
}
if (state[SDL_SCANCODE_RIGHT] && state[SDL_SCANCODE_UP]) {
    printf("右と上が押された¥n");
}</code></pre>

#### SDL_GetMouseState  
現在のマウスの状態を得る.

<div class="subtitle">構文</div>
Uint32 SDL_GetMouseState(int* x, int* y)

<div class="subtitle">引数</div>
x: フォーカスのあるウィンドウからの相対X座標を代入するポインタ
y: フォーカスのあるウィンドウからの相対Y座標を代入するポインタ

<div class="subtitle">戻り値</div>
現在のボタンのビットマスクを戻す.

<div class="subtitle">詳細</div>
現在のボタンの状態は, 戻り値のビットマスクで, SDL_BUTTON(X)マクロでチェックできる (通常はX=1が左, 2が中央, 3が右). そして, 選択したフォーカスのあるウィンドウからの相対座標はxとyに代入される. xとyにはNULLを渡すことができる.

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
マウスのデスクトップからの座標を得る.

<div class="subtitle">構文</div>
Uint32 SDL_GetGlobalMouseState(int* x, int* y)

<div class="subtitle">引数</div>
x: 現在のデスクトップからのX座標を代入するポインタ. NULLも可能
y: 現在のデスクトップからのY座標を代入するポインタ. NULLも可能
    
<div class="subtitle">戻り値</div>
ボタンの状態をSDL_BUTTON(X)マクロでテストできるビットマスクで戻す.

<div class="subtitle">詳細</div>
これはSDL_GetMouseState()と同じような働きをする. しかし, デスクトップの左上からの相対座標が報告される. これは, ウィンドウの外のマウスを追跡する必要があるが, SDL_CaptureMouse()が適さないときに有用である. 例えば, ウィンドウをドラッグしている最中にマウスを追跡する必要がある場合, そのウィンドウからの相対座標は常に同期しているとは限らないため, この関数が有用であろう.<br>
注意: SDL_GetMouseState()はSDLのイベントキューから最後に得たマウスの座標を戻す.しかし, この関数はOSに現在のマウスの位置を問い合わせる. それゆえにこの関数はあまり効率的でない. 自分が何をしているのかわかっていて, この関数を使わなければならない理由がない限り, 代わりにSDL_GetMouseState()を使うほうがよいだろう.

---

### 描画系

---

#### SDL_SetRenderDrawColor
描画操作(長方形, 直線, 消去)で使う色を設定する.

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
この関数で設定された色は, 描画, 長方形の塗りつぶし, 直線, 点, 消去とSDL_RenderClear()で使われる.

---

#### SDL_RenderDrawPoint
現在のレンダーターゲットに点を描く.

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

<div class="subtitle">サンプルコード</div>
<pre><code class="example">SDL_SetRenderDrawColor(renderer, 255, 0, 0, 255);
SDL_Rect rectangle;

rectangle.x = 0;
rectangle.y = 0;
rectangle.w = 50;
rectangle.h = 50;
SDL_RenderFillRect(renderer, &rectangle);</code></pre>

---

#### SDL_RenderDrawLine
現在のレンダーターゲットに直線を描く.

<div class="subtitle">構文</div>
int SDL_RenderDrawLine(SDL_Renderer* renderer, int x1, int y1, int x2, int y2)

<div class="subtitle">引数</div>
renderer: レンダリングコンテキスト
x1: 始点のX座標
y1: 始点のY座標
x2: 終点のX座標
y2: 終点のY座標

<div class="subtitle">戻り値</div>
成功のとき0, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>

<div class="subtitle">サンプルコード</div>
<pre><code class="example">#include "SDL.h"

int main(int argc, char* argv[])
{
    if (SDL_Init(SDL_INIT_VIDEO) == 0) {
        SDL_Window* window = NULL;
        SDL_Renderer* renderer = NULL;

        if (SDL_CreateWindowAndRenderer(640, 480, 0, &window, &renderer) == 0) {
            SDL_bool done = SDL_FALSE;

            while (!done) {
                SDL_Event event;

                SDL_SetRenderDrawColor(renderer, 0, 0, 0, SDL_ALPHA_OPAQUE);
                SDL_RenderClear(renderer);

                SDL_SetRenderDrawColor(renderer, 255, 255, 255, SDL_ALPHA_OPAQUE);
                SDL_RenderDrawLine(renderer, 320, 200, 300, 240);
                SDL_RenderDrawLine(renderer, 300, 240, 340, 240);
                SDL_RenderDrawLine(renderer, 340, 240, 320, 200);
                SDL_RenderPresent(renderer);

                while (SDL_PollEvent(&event)) {
                    if (event.type == SDL_QUIT) {
                        done = SDL_TRUE;
                    }
                }
            }
        }

        if (renderer) {
            SDL_DestroyRenderer(renderer);
        }
        if (window) {
            SDL_DestroyWindow(window);
        }
    }
    SDL_Quit();
    return 0;
}</code></pre>

---

#### SDL_RenderDrawRect  
現在のレンダーターゲットに長方形を描く.

<div class="subtitle">構文</div>
int SDL_RenderDrawRect(SDL_Renderer* renderer, const SDL_Rect* rect)

<div class="subtitle">引数</div>
renderer: レンダリングコンテキスト
rect: 描かれる長方形のSDL_Rect. NULLのとき全体

<div class="subtitle">戻り値</div>
成功のとき0, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()で詳細を知ることができる.

---

#### SDL_RenderFillRect
現在のレンダーターゲットに塗りつぶした長方形を描く.

<div class="subtitle">構文</div>
int SDL_RenderFillRect(SDL_Renderer* renderer, const SDL_Rect* rect)

<div class="subtitle">引数</div>
renderer: レンダリングコンテキスト
rect: 描かれる塗りつぶした長方形のSDL_Rect. NULLのとき全体

<div class="subtitle">戻り値</div>
成功のとき0, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>
塗りつぶす色はSDL_SetRenderDrawColor()で設定する. 色のα値はSDL_SetRenderDrawBlendMode()が呼ばれブレンドが有効でない限り無視される.

---

#### SDL_RenderCopy  
テクスチャの一部を現在のレンダーターゲットにコピーする.

<div class="subtitle">構文</div>
int SDL_RenderCopy(SDL_Renderer* renderer, SDL_Texture* texture, const SDL_Rect* srcrect, const SDL_Rect* dstrect)

<div class="subtitle">引数</div>
renderer: レンダリングコンテキスト
texture: コピー元テクスチャ (詳細を参照すること)
srcrect: コピー元のSDL_Rect. NULLのとき全体
dstrect: コピー先のSDL_Rect. NULLのとき全体. テクスチャはこの領域に合うように拡大縮小される.

<div class="subtitle">戻り値</div>
成功のとき0, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>
テクスチャはSDL_SetTextureBlendMode()で設定したブレンドモードでコピー先のテクスチャとブレンドされる.<br>
テクスチャの色はSDL_SetTextureColorMod()で設定した色の影響を受ける.<br>
テクスチャのα値はSDL_SetTextureAlphaMod()で設定したα値の影響を受ける.

<div class="subtitle">サンプルコード</div>
<pre><code class="example">#include "SDL.h"
#define SHAPE_SIZE 16

int main(int argc, char *argv[])
{
  SDL_Window* Main_Window;
  SDL_Renderer* Main_Renderer;
  SDL_Surface* Loading_Surf;
  SDL_Texture* Background_Tx;
  SDL_Texture* BlueShapes;

  /* レンダリングする(テクスチャ内の)コピー元と(画面の)コピー先の領域 */
  SDL_Rect SrcR;
  SDL_Rect DestR;

  SrcR.x = 0;
  SrcR.y = 0;
  SrcR.w = SHAPE_SIZE;
  SrcR.h = SHAPE_SIZE;

  DestR.x = 640 / 2 - SHAPE_SIZE / 2;
  DestR.y = 580 / 2 - SHAPE_SIZE / 2;
  DestR.w = SHAPE_SIZE;
  DestR.h = SHAPE_SIZE;

  /* レンダリングの前にウィンドウとレンダラーを生成する */
  Main_Window = SDL_CreateWindow("SDL_RenderCopy Example",
  SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, 640, 580, 0);
  Main_Renderer = SDL_CreateRenderer(Main_Window, -1, SDL_RENDERER_ACCELERATED);

  /* 背景画像を読み込む. SDL_LoadBMP()はサーフェイスを戻すので,
  それを高速にコピーできるテクスチャに変換する */
  Loading_Surf = SDL_LoadBMP("Background.bmp");
  Background_Tx = SDL_CreateTextureFromSurface(Main_Renderer, Loading_Surf);
  SDL_FreeSurface(Loading_Surf);  /* テクスチャは得られた -> サーフェイスを解放する */

  /* 追加のテクスチャを読み込む */
  Loading_Surf = SDL_LoadBMP("Blueshapes.bmp");
  BlueShapes = SDL_CreateTextureFromSurface(Main_Renderer, Loading_Surf);
  SDL_FreeSurface(Loading_Surf);

  /* ここが最も関心のある部分である.
  Blueshapes.bmpの選択された部分を画面の中央にレンダリングする */
  int i;
  int n;
  for(i=0;i<2;i++)
  {
    for(n=0;n<4;n++)
    {
      SrcR.x = SHAPE_SIZE * (n % 2);
      if(n > 1)
      {
        SrcR.y = SHAPE_SIZE;
      }
      else
      {
        SrcR.y = 0;
      }

      /* 背景をレンダリングする. NULLはコピー元とコピー先がデフォルトであることを意味する */
      SDL_RenderCopy(Main_Renderer, Background_Tx, NULL, NULL);

      /* 図形をレンダリングしてアニメーションにする */
      SDL_RenderCopy(Main_Renderer, BlueShapes, &SrcR, &DestR);  
      SDL_RenderPresent(Main_Renderer);
      SDL_Delay(500);
    }
  }

  /* このレンダラーは大きなキャンバスのようなものである:
  RenderCopy()で画像を加えると, その度に上書きされる.
  新しいデータがどのようにブレンドされるかは変更できる.
  あなたの「絵」が完成すれば, それをSDL_RenderPresent()を使って見せることができる */

  /* SDL 1.2ユーザへのヒント: レンダラーが理解しづらいならば, 1.2のサーフェイスとコピーに置き換えて,
  レンダラーはメインサーフェイス, SDL_RenderCopy()はメインサーフェイスへのコピー,
  SDL_RenderPresent()は旧バージョンのSDL_Flip()関数と考えればよいかもしれない */

  SDL_DestroyTexture(BlueShapes);
  SDL_DestroyTexture(Background_Tx);
  SDL_DestroyRenderer(Main_Renderer);
  SDL_DestroyWindow(Main_Window);
  SDL_Quit();

  return 0;
}</code></pre>
---

#### SDL_RenderCopyEx  
テクスチャの一部を, 指定の点を中心に回転させ, 上下左右を反転を指定して, 現在のレンダーターゲットにコピーする.

<div class="subtitle">構文</div>
int SDL_RenderCopyEx(SDL_Renderer* renderer, SDL_Texture* texture, const SDL_Rect* srcrect, const SDL_Rect* dstrect, const double angle, const SDL_Point* center, const SDL_RendererFlip flip)

<div class="subtitle">引数</div>
renderer: レンダリングコンテキスト
texture: コピー元テクスチャ (詳細を参照すること)
srcrect: コピー元のSDL_Rect. NULLのとき全体
dstrect: コピー先のSDL_Rect. NULLのとき全体. テクスチャはこの領域に合うように拡大縮小される.
angle: dstrectにコピーするときの画像の角度(度数法・時計回り)
center: dstrectにコピーするときの画像の回転の中心を表すSDL_Pointのポインタ (NULLのときdstrect.w/2, dstrect.h/2)
flip: テクスチャの上下左右反転を表すSDL_RendererFlip

<div class="subtitle">戻り値</div>
成功のとき0, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>
テクスチャの一部を現在のレンダリングターゲットにコピーする. 指定の点を中心に回転させ, 上下かつ/または左右を反転させることもできる.<br>
テクスチャはSDL_SetTextureBlendMode()で設定したブレンドモードでコピー先のテクスチャとブレンドされる.<br>
テクスチャの色はSDL_SetTextureColorMod()で設定した色の影響を受ける.<br>
テクスチャのα値はSDL_SetTextureAlphaMod()で設定したα値の影響を受ける.<br>

---

### テクスチャ・サーフェス

---

#### SDL_CreateTexture
レンダリングコンテキストのテクスチャを生成する.

<div class="subtitle">構文</div>
SDL_Texture* SDL_CreateTexture(SDL_Renderer* renderer, Uint32 format, int access, int w, int h)

<div class="subtitle">引数</div>
renderer: レンダリングコンテキスト
format: SDL_PixelFormatEnumの1つ
access: SDL_TextureAccessの1つ
w: テクスチャの幅
h: テクスチャの高さ

<div class="subtitle">戻り値</div>
成功のとき生成されたテクスチャへのポインタを戻す. レンダリングコンテキストが使えない, formatが対応していない, wまたはhが範囲外のときNULLを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>
テクスチャを生成する前にSDL_HINT_RENDER_SCALE_QUALITYを設定することでテクスチャの拡大方法を設定できる.

<div class="subtitle">サンプルコード</div>
<pre><code class="example">#include&lt;stdlib.h&gt;
#include"SDL.h"
// 四角形を動かす
int main()
{
        SDL_Window *window;
        SDL_Renderer *renderer;
        SDL_Texture *Texture;
        SDL_Event event;
        SDL_Rect r;
        if (SDL_Init(SDL_INIT_VIDEO) < 0) {
                SDL_LogError(SDL_LOG_CATEGORY_APPLICATION, "SDLを初期化できなかった: %s", SDL_GetError());
                return 3;
        }

        window = SDL_CreateWindow("SDL_CreateTexture",
                        SDL_WINDOWPOS_UNDEFINED,
                        SDL_WINDOWPOS_UNDEFINED,
                        1024, 768,
                        SDL_WINDOW_RESIZABLE);

        r.w = 100;
        r.h = 50;

        renderer = SDL_CreateRenderer(window, -1, 0);

        Texture = SDL_CreateTexture(renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, 1024, 768);

        while(1)
        {
                SDL_PollEvent(&event);
                if(event.type == SDL_QUIT)
                        break;
                r.x=rand()%500;
                r.y=rand()%500;

                SDL_SetRenderTarget(renderer, Texture);
                SDL_SetRenderDrawColor(renderer, 0x00, 0x00, 0x00, 0x00);
                SDL_RenderClear(renderer);
                SDL_RenderDrawRect(renderer,&r);
                SDL_SetRenderDrawColor(renderer, 0xFF, 0x00, 0x00, 0x00);
                SDL_RenderFillRect(renderer, &r);
                SDL_SetRenderTarget(renderer, NULL);
                SDL_RenderCopy(renderer, Texture, NULL, NULL);
                SDL_RenderPresent(renderer);
        }
        SDL_DestroyRenderer(renderer);
        return 0;
}</code></pre>
---

#### SDL_DestroyTexture  
テクスチャを破棄する.    

<div class="subtitle">構文</div>
void SDL_DestroyTexture(SDL_Texture* texture)

<div class="subtitle">引数</div>
texture: 破棄するテクスチャ

<div class="subtitle">詳細</div>
NULLや不正なテクスチャを渡した場合はSDLエラーメッセージに"Invalid texture"が設定される.

---

#### SDL_CreateTextureFromSurface
サーフェイスからテクスチャを生成する.

<div class="subtitle">構文</div>
SDL_Texture* SDL_CreateTextureFromSurface(SDL_Renderer* renderer, SDL_Surface* surface)

<div class="subtitle">引数</div>
renderer: レンダリングコンテキスト
surface: テクスチャで使うピクセルデータを持つSDL_Surface

<div class="subtitle">戻り値</div>
成功のとき生成されたテクスチャ, 失敗のときNULLを戻す. SDL_GetError()で詳細を知ることができる.

<div class="subtitle">詳細</div>
この関数はサーフェイスを修正/解放しない.<br>
このテクスチャのSDL_TextureAccessヒントはSDL_TEXTUREACCESS_STATICである.<br>
生成されるテクスチャのピクセル形式はサーフェイスのピクセル形式とは異なる場合がある. テクスチャのピクセル形式はSDL_QueryTexture()で得ることができる.
    
<div class="subtitle">サンプルコード</div>
<pre><code class="example">    /* OpenGLのテクスチャとして使うために
       各ピクセルがR,G,B,A順の32bitサーフェイスを生成する */
    SDL_Surface *surface;
    Uint32 rmask, gmask, bmask, amask;

    /* SDLはピクセルを32bitの値として解釈する.
       よって, マスクはマシンのエンディアン(バイト順)に依存する */
#if SDL_BYTEORDER == SDL_BIG_ENDIAN
    rmask = 0xff000000;
    gmask = 0x00ff0000;
    bmask = 0x0000ff00;
    amask = 0x000000ff;
#else
    rmask = 0x000000ff;
    gmask = 0x0000ff00;
    bmask = 0x00ff0000;
    amask = 0xff000000;
#endif

surface = SDL_CreateRGBSurface(0, width, height, 32,
                               rmask, gmask, bmask, amask);
if (surface == NULL) {
    fprintf(stderr, "CreateRGBSurface 失敗: %s¥n", SDL_GetError());
    exit(1);
}

SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);

if (texture == NULL) {
    fprintf(stderr, "CreateTextureFromSurface 失敗: %s¥n", SDL_GetError());
    exit(1);
}

SDL_FreeSurface(surface);
surface = NULL;</code></pre>

---

#### SDL_QueryTexture
テクスチャの情報を得る.

<div class="subtitle">構文</div>
int SDL_QueryTexture(SDL_Texture* texture, Uint32* format, int* access, int* w, int* h)

<div class="subtitle">引数</div>
texture: 調査するテクスチャ
format: テクスチャの生の形式を代入するポインタ(SDL_PixelFormat). 実際の形式とは異なることがある. しかし, ピクセルのコピーではこの形式が使われる. この情報が必要なければNULLにできる
access: 実際のアクセスを代入するポインタ(SDL_TextureAccessの1つ). この情報が必要なければNULLにできる
w: テクスチャの幅を代入するポインタ. この情報が必要なければNULLにできる
h: テクスチャの高さを代入するポインタ. この情報が必要なければNULLにできる

<div class="subtitle">戻り値</div>
成功のとき0, 失敗のとき負の数のエラーコードを戻す. SDL_GetError()で詳細を知ることができる.

---

#### SDL_LoadBMP  
BMPファイルをサーフェイスに読み込む.

<div class="subtitle">構文</div>
SDL_Surface* SDL_LoadBMP(const char* file)

<div class="subtitle">引数</div>
file: BMPイメージファイル

<div class="subtitle">戻り値</div>
成功のとき生成されたSDL_Surface, 失敗のときNULLを戻す. SDL_GetError()を呼んで詳細を知ることができる.

<div class="subtitle">詳細</div>
生成されたサーフェイスはSDL_FreeSurface()で解放する必要がある.<br>
SDL_LoadBMP()は, SDL_RWFromFile()でファイルを開き自動的にファイルを閉じるSDL_LoadBMP_RW()のマクロである.

<div class="subtitle">サンプルコード</div>
<pre><code class="example">const char *image_path = "myimage.bmp";
SDL_Surface *image = SDL_LoadBMP(image_path);

/* ファイルの読み込みに失敗したらユーザに知らせる */
if (!image) {
    printf("画像の読み込みに失敗した %s: %s¥n", image_path, SDL_GetError());
    return 1;
}

/* ここで画像を使う */

/* 最後にサーフェイスの資源を解放する */
SDL_FreeSurface(image);</code></pre>

---

#### SDL_FreeSurface
RGBサーフェイスを解放する.

<div class="subtitle">構文</div>
void SDL_FreeSurface(SDL_Surface* surface)

<div class="subtitle">引数</div>
surface: 解放するSDL_Surface
    
<div class="subtitle">詳細</div>
この関数はNULLを渡しても安全である.

---

### 画像

---

#### IMG_Init
SDL_imageを初期化する.

<div class="subtitle">構文</div>
int IMG_Init(int flags)

<div class="subtitle">引数</div>
flags: 初期化フラグ. 論理和で複数指定できる

<div class="subtitle">戻り値</div>
初期化された全てのフラグ

<div class="subtitle">詳細</div>
この関数はSDL_imageが必要とする動的リンクライブラリを読み込み, 使用するために初期化する. この関数はSDL_imageの内で最初に呼ばなければならない. もし呼び出しに失敗すれば, ライブラリを使うことはできない.<br>
フラグはIMG_InitFlagsの1つか, 論理和で複数選択する. 成功のとき初期化に成功したフラグ, 失敗のとき0が戻される.<br>
現在, 以下のフラグがある

| フラグ |
| --- |
| IMG_INIT_JPG |
| IMG_INIT_PNG |
| IMG_INIT_TIF |
| IMG_INIT_WEBP |
| IMG_INIT_JXL |
| IMG_INIT_AVIF |

フラグは将来のSDL_imageのリリースで追加される可能性がある.<br>
この関数は様々な画像の読み書きに対応するために外部の共有ライブラリを必要とする. そのため, 共有ライブラリが使えない場合は, メモリ不足などの問題がなくシステムが正常でも初期化に失敗する場合がある.<br>
この関数はフラグを追加するために複数回呼び出せる. その場合の戻り値には, 新たに正常に初期化されたフラグと, 以前に初期化したフラグの両方が含まれている.<br>
以前に初期化したフラグを戻すために0(フラグなし)で呼び出すことは可能である. この方法で変更を加えず安全に現在の状態を得ることができる.<br>
この関数は以前初期化したフラグを新たなものと同様に戻すため, この関数を0で呼ぶことはできるが, 戻り値が0か否かでエラーをチェックすることはできない. 代わりに戻り値に要求したフラグが全て含まれているかでチェックすべきである. もしゲームに特定のフォーマットのデータがあるならば, 致命的なエラーを引き起こしてしまう. 一般的な画像表示アプリケーションならば, JPGとPNGに対応していれば恐らく問題はなく, たとえあらゆる形式を要求したとしても, WEBPはなくても十分だろう.<br>
他の周辺ライブラリとは違い, IMG_Initは重ならない. 一度IMG_Quit()を呼べば全て終了するため, IMG_Initの回数呼ぶ必要はない. そのため, プログラム中ではIMG_InitとIMG_Quitを1度だけ呼ぶのが最良と考えられる. これは必須ではないが, そうでない場合は発生する危険性に注意する必要がある.<br>
SDL_imageを初期化した後, アプリケーションはSDL_SurfaceやSDL_Textureに画像を読み込むことができるようになる.<br>

---

#### IMG_Quit  
SDL_imageを終了する.

<div class="subtitle">構文</div>
void IMG_Quit()

<div class="subtitle">詳細</div>
この関数が資源を解放した後はSDL_imageの関数を呼んではならない. この関数は様々なコードで使われる共有ライブラリをアンロードする.<br>
この呼び出しの後, IMG_Init(0)を呼ぶと0(読み込まれたコーデックがない)が戻る.<br>
この呼び出しの後, IMG_Init()を呼んでコーデックを再ロードするのは安全である.<br>
他の周辺ライブラリとは違い, IMG_Initは重ならない. 一度IMG_Quit()を呼べば全て終了するため, IMG_Initの回数呼ぶ必要はない. そのため, プログラム中ではIMG_InitとIMG_Quitを1度だけ呼ぶのが最良と考えられる. これは必須ではないが, そうでない場合は発生する危険性に注意する必要がある.

---

#### IMG_Load  
画像をファイルシステムのパスからサーフェイスに読み込む.

<div class="subtitle">構文</div>
SDL_Surface *IMG_Load(const char *file)

<div class="subtitle">引数</div>
file: 画像ファイルのパス名

<div class="subtitle">戻り値</div>
新しいSDLサーフェイスを戻す. エラーのときNULLを戻す.

<div class="subtitle">詳細</div>
SDL_SurfaceはCPUからアクセスできるメモリ上のピクセルバッファである. 後でデータを他に渡したり, 操作する場合はこれを使うことになる.<br>
生成されたSDL_Surfaceの形式には保証がない. 多くの場合, SDL_imageは画像と完全に一致するサーフェイスを生成しようとするが, 変換される場合もある. (SDLが直接対応していない形式の画像や, 様々な形式で圧縮されていてSDL_imageがそのうちの1つを選択した場合など.) SDL_Surfaceの形式を精査し, その後SDL_ConvertSurface()で必要な形式に変換することもできる.<br>
画像ファイルが透過ピクセルに対応している場合, SDLはサーフェイスにカラーキーを設定する. 以下のようにすると呼び出し後にRLEアクセラレーションを有効にできる:<br>
SDL_SetColorKey(image, SDL_RLEACCEL, image->format->colorkey);<br>
ファイルシステムではなく抽象I/Oからのデータが必要な場合は, SDL_RWopsから読み込む別の関数IMG_Load_RW()も存在する.<br>
SDLの2DレンダリングAPIを使用する場合, GPUが使用するSDL_Textureに画像を直接読み込むIMG_LoadTexture()をこの関数の代わりに使うこと.<br>
戻されたサーフェイスを使い終えたならば, アプリケーションはSDL_FreeSurface()で破棄する必要がある.<br>

<div class="subtitle">サンプルコード</div>
<pre><code class="example">// sample.pngをimageに読み込む
SDL_Surface *image;
image=IMG_Load("sample.png");
if(!image) {
    printf("IMG_Load: %s¥n", IMG_GetError());
    // ここでエラー処理を行う
}</code></pre>

---

#### IMG_LoadTexture  
画像をファイルからGPUテクスチャに読み込む.

<div class="subtitle">構文</div>
SDL_Texture *IMG_LoadTexture(SDL_Renderer *renderer, const char *file)

<div class="subtitle">引数</div>
renderer: GPUテクスチャを生成するために使用するSDL_Renderer
file: 画像ファイルのパス名

<div class="subtitle">戻り値</div>
生成されたテクスチャ, エラーのときNULLを戻す.

<div class="subtitle">詳細</div>
SDL_TextureはGPUメモリ内の画像で, SDLの2DレンダリングAPIで使用できる. これは読み込んだ後に画像を直接編集するのでなければ, CPUを使用するSDL_Surfaceよりもはるかに効率的である.<br>
読み込んだ画像に透明色またはカラーキーがある場合ば, テクスチャにはαチャネルが生成される. そうでない場合は, 画像データを表すのに最も合理的な形式でSDL_Textureを生成しようとする(しかしほとんどの場合は32ビットRGBまたは32ビットRGBAとなる).<br>
ファイルではなく抽象I/Oを使用する必要があるならば, SDL_RWopsからファイルを読み込む別の関数IMG_LoadTexture_RW()も存在する.<br>
SDL_Surface(CPUメモリ内のピクセルバッファ)に読み込みたいならば, 代わりにIMG_Load()を使用すること.<br>
テクスチャを使用し終えたならば, アプリケーションはSDL_DestroyTexture()を呼んで破棄しなければならない.

---

### フォント

---

#### TTF_Init
SDL_ttfを初期化する.

<div class="subtitle">構文</div>
int TTF_Init(void)

<div class="subtitle">戻り値</div>
成功のとき0, エラーのとき-1を戻す.

<div class="subtitle">詳細</div>
このライブラリの別の関数を安全に呼ぶためにはこの関数を正常に呼ぶ必要がある. 例外はTTF_GetError()で, この関数が失敗したとき人が読めるエラーメッセージを戻す.<br>
このライブラリはSDLライブラリを使用しているため, SDLはこのライブラリの関数を呼ぶ前に初期化されている必要がある<br>
この関数は複数回呼んでも安全である. ライブラリは初期化の回数を数えていて, TTF_Quit()を呼ぶたびにカウントを減らしている. そのため, 初期化と終了は対になっている必要がある.<br>

---

#### TTF_Quit
SDL_ttfを解放する.

<div class="subtitle">構文</div>
void TTF_Quit(void)

<div class="subtitle">詳細</div>
ライブラリを使い終えたならば, 内部リソースの解放のためこの関数を呼ぶ必要がある. ライブラリを初期化せずにこの関数を呼んでも何もせずに戻るだけで安全である.<br>
TTF_Init()を呼んで成功した回数だけこの関数を呼ぶと, ライブラリが実際に解放される.<br>
この関数を呼んでも開かれたフォントは自動的には閉じず, その後にフォントを閉じようとしてもライブラリは解放されているため正常に閉じることができないので注意すること. 開いた全てのフォントに対してTTF_CloseFont()を呼び, その後でこの関数を呼ぶのがよいだろう.

---

#### TTF_OpenFont
ポイントサイズを指定してフォントをファイルから生成する.

<div class="subtitle">構文</div>
TTF_Font *TTF_OpenFont(const char *file, int ptsize)

<div class="subtitle">引数</div>
file: フォントファイルのパス名
ptsize: 新たに開くフォントのポイントサイズ

<div class="subtitle">戻り値</div>
利用可能なTTF_Font, エラーのときNULLを戻す.

<div class="subtitle">詳細</div>
一部の.fonフォントはファイル内に複数のフォントが埋め込まれている. その場合, ポイントサイズはサイズを選択する番号となる. 値が大きすぎる場合, 最も大きな番号のサイズになる.<br>
TTF_Fontを使い終えたらTTF_CloseFont()で破棄すること.

---

#### TTF_CloseFont
フォントを破棄する.

<div class="subtitle">構文</div>
void TTF_CloseFont(TTF_Font *font)

<div class="subtitle">引数</div>
font: 破棄するフォント

<div class="subtitle">詳細</div>
フォントを使い終えたとき, この関数を呼ぶこと. この関数はフォントに関連する資源を解放する. この関数はNULL, 例えばTTF_OpenFont()の失敗の結果に対して呼んでも安全である.<br>
この関数に渡した後, fontは無効になる. このfontに対していくつかの関数, 例えばTTF_FontFaceFamilyName()やTTF_FontFaceStyleName()が戻した文字列へのポインタも同様に無効である.

---

#### TTF_RenderUTF8_Blended  
UTF-8テキストを, 生成したARGBサーフェイスに混合(Blend)モードでレンダリングする.

<div class="subtitle">構文</div>
SDL_Surface * TTF_RenderUTF8_Blended(TTF_Font *font, const char *text, SDL_Color fg)

<div class="subtitle">引数</div>
font: レンダリングで使用するフォント
text: レンダリングするUTF-8テキスト
fg: テキストの前景色

<div class="subtitle">戻り値</div>
成功のとき生成された32ビットARGBサーフェイス, エラーのときNULLを戻す.

<div class="subtitle">詳細</div>
この関数は新たに32ビットARGBサーフェイスを生成し, 指定の前景色とαブレンドを用いてディザリングを行いレンダリングする. この関数の戻り値は生成されたサーフェイス, またはエラーが発生した場合はNULLである.<br>
この関数は改行しないため, どれだけ文字列が長くてもサーフェイスのテキストは1行である. 改行して複数行にする必要がある場合は, 代わりにTTF_RenderUTF8_Blended_Wrapped()を使うことができる.<br>
この関数は改行コードで改行しない.<br>
TTF_RenderUTF8_Solid, TTF_RenderUTF8_Shaded, TTF_RenderUTF8_LCDを使うと別の画質でレンダリングできる.<br>

---

#### TTF_RenderText_Blended  
Latin1のテキストを, 生成したARGBサーフェイスに混合(Blend)モードでレンダリングする.    

<div class="subtitle">構文</div>
SDL_Surface *TTF_RenderText_Blended(TTF_Font *font, const char *text, SDL_Color fg)

<div class="subtitle">引数</div>
font: レンダリングで使用するフォント
text: レンダリングするLatin1テキスト
fg: テキストの前景色
bg: テキストの背景色

<div class="subtitle">戻り値</div>
成功のとき生成された32ビットARGBサーフェイス, エラーのときNULLを戻す.

<div class="subtitle">詳細</div>
この関数は新たに32ビットARGBサーフェイスを生成し, 指定の前景色とαブレンドを用いてディザリングを行いレンダリングする. この関数の戻り値は生成されたサーフェイス, またはエラーが発生した場合はNULLである.<br>
この関数は改行しないため, どれだけ文字列が長くてもサーフェイスのテキストは1行である. 改行して複数行にする必要がある場合は, 代わりにTTF_RenderText_Blended_Wrapped()を使うことができる.<br>
この関数は改行コードで改行しない.<br>
1バイトLatin1でエンコードされているのが確実でない限り, 本当に必要なのはTTF_RenderUTF8_Blendedだろう. US ASCII文字はどちらの関数でも正常に動作するが, 他の多くの文字はUTF-8としての処理が必要である.<br>
TTF_RenderText_Solid, TTF_RenderText_Blended, TTF_RenderText_LCDを使うと別の画質でレンダリングできる.<br>

---

### 入力（キーボード・マウス・ゲームパッド）

---

#### SDL_GetKeyboardState
キーボードの状態を得る.

<div class="subtitle">構文</div>
const Uint8* SDL_GetKeyboardState(int* numkeys)

<div class="subtitle">引数</div>
numkeys: NULLでないとき, 戻した配列の長さが代入される

<div class="subtitle">戻り値</div>
キー状態の配列へのポインタを戻す.

<div class="subtitle">詳細</div>
戻されたポインタはSDL内部の配列へのポインタである. アプリケーションの実行中は常に有効で, 呼び出し側は解放してはならない.<br>
値が1のとき押されていて, 0のとき押されていない. 配列の添え字はSDL_Scancodeである.<br>
メモ: SDL_PumpEvents()でこの状態は更新される.<br>
メモ: この関数は全てのイベントを処理した後に状態を獲得する. よって, もしイベントを処理する前にキーやボタンを押したり離したりすると, SDL_GetKeyboardState()では押されたキーを知ることができない.<br>
メモ: この関数はシフトキーの状態を考慮しない.<br>

<div class="subtitle">サンプルコード</div>
<pre><code class="example">const Uint8 *state = SDL_GetKeyboardState(NULL);
if (state[SDL_SCANCODE_RETURN]) {
    printf("&lt;RETURN&gt; が押された¥n");
}
if (state[SDL_SCANCODE_RIGHT] && state[SDL_SCANCODE_UP]) {
    printf("右と上が押された¥n");
}</code></pre>
        
---

#### SDL_GetScancodeFromKey  
指定のキーコードから現在のキーボードレイアウトに割り当てられたスキャンコードを得る.

<div class="subtitle">構文</div>
SDL_Scancode SDL_GetScancodeFromKey(SDL_Keycode key)

<div class="subtitle">引数</div>
key: スキャンコードを得たいSDL_Keycode

<div class="subtitle">戻り値</div>
SDL_Keycodeに割り当てられたSDL_Scancodeを戻す.

<div class="subtitle">詳細</div>
SDL_Scancode
| キー名 | SDL_Scancodeの値 | SDL_Keycodeの値 |
| --- | --- |--- |
| "0" | SDL_SCANCODE_0 | SDLK_0 |
"1"	SDL_SCANCODE_1	SDLK_1
"2"	SDL_SCANCODE_2	SDLK_2
"3"	SDL_SCANCODE_3	SDLK_3
"4"	SDL_SCANCODE_4	SDLK_4
"5"	SDL_SCANCODE_5	SDLK_5
"6"	SDL_SCANCODE_6	SDLK_6
"7"	SDL_SCANCODE_7	SDLK_7
"8"	SDL_SCANCODE_8	SDLK_8
"9"	SDL_SCANCODE_9	SDLK_9
"A"	SDL_SCANCODE_A	SDLK_a
"AC Back" (アプリケーションキーの戻るキー)	SDL_SCANCODE_AC_BACK	SDLK_AC_BACK
"AC Bookmarks" (アプリケーションキーのブックマークキー)	SDL_SCANCODE_AC_BOOKMARKS	SDLK_AC_BOOKMARKS
"AC Forward" (アプリケーションキーの進むキー)	SDL_SCANCODE_AC_FORWARD	SDLK_AC_FORWARD
"AC Home" (アプリケーションキーのホームキー)	SDL_SCANCODE_AC_HOME	SDLK_AC_HOME
"AC Refresh" (アプリケーションキーの更新キー)	SDL_SCANCODE_AC_REFRESH	SDLK_AC_REFRESH
"AC Search" (アプリケーションの検索キー)	SDL_SCANCODE_AC_SEARCH	SDLK_AC_SEARCH
"AC Stop" (アプリケーションの中断キー)	SDL_SCANCODE_AC_STOP	SDLK_AC_STOP
"AC Again" (アプリケーションの再開キー)	SDL_SCANCODE_AGAIN	SDLK_AGAIN
"AltErase" (Erase-Eaze)	SDL_SCANCODE_ALTERASE	SDLK_ALTERASE
"'"	SDL_SCANCODE_APOSTROPHE	SDLK_QUOTE
"Application" (アプリケーションキー/コンポーズキー/コンテキストメニューキー(Windows))	SDL_SCANCODE_APPLICATION	SDLK_APPLICATION
"AudioMute" (無音キー)	SDL_SCANCODE_AUDIOMUTE	SDLK_AUDIOMUTE
"AudioNext" (次トラックキー)	SDL_SCANCODE_AUDIONEXT	SDLK_AUDIONEXT
"AudioPlay" (再生キー)	SDL_SCANCODE_AUDIOPLAY	SDLK_AUDIOPLAY
"AudioPrev" (前トラックキー)	SDL_SCANCODE_AUDIOPREV	SDLK_AUDIOPREV
"AudioStop" (停止キー)	SDL_SCANCODE_AUDIOSTOP	SDLK_AUDIOSTOP
"B"	SDL_SCANCODE_B	SDLK_b
"¥" (ISOキーボードならばリターンキーの左下, QWERTY配列のANSIキーボードならばキーボードの右下に位置するキー. アメリカレイアウトならば逆斜線(バックススラッシュ)と縦線, イギリスのMacのレイアウトならば逆斜線(バックススラッシュ)と縦線, イギリスのWindowsのレイアウトならチルダとナンバー記号(#), スイス(ドイツ語)のレイアウトならドル記号とポンド記号, ドイツのレイアウトならナンバー記号とアポストロフィー, フランスのMacのレイアウトなら抑音アクセント, フランス語のWindowsのレイアウトならマイクロ記号)	SDL_SCANCODE_BACKSLASH	SDLK_BACKSLASH
"Backspace"	SDL_SCANCODE_BACKSPACE	SDLK_BACKSPACE
"Brightness Down" (暗くするキー)	SDL_SCANCODE_BRIGHTNESSDOWN	SDLK_BRIGHTNESSDOWN
"Brightness Up" (明るくするキー)	SDL_SCANCODE_BRIGHTNESSUP	SDLK_BRIGHTNESSUP
"C	SDL_SCANCODE_C	SDLK_c
"Calculator" (電卓キー)	SDL_SCANCODE_CALCULATOR	SDLK_CALCULATOR
"Cancel"	SDL_SCANCODE_CANCEL	SDLK_CANCEL
"CapsLock"	SDL_SCANCODE_CAPSLOCK	SDLK_CAPSLOCK
"Clear"	SDL_SCANCODE_CLEAR	SDLK_CLEAR
"Clear/Again"	SDL_SCANCODE_CLEARARAIN	SDLK_CLEARARAIN
","	SDL_SCANCODE_COMMA	SDLK_COMMA
"Computer" (マイコンピュータキー)	SDL_SCANCODE_COMPUTER	SDLK_COMPUTER
"Copy"	SDL_SCANCODE_COPY	SDLK_COPY
"CrSel"	SDL_SCANCODE_CRSEL	SDLK_CRSEL
"CurrencySubUnit" (通貨補助単位キー)	SDL_SCANCODE_CURRENCYSUBUNIT	SDLK_CURRENCYSUBUNIT
"CurrencyUnit" (通貨単位キー)	SDL_SCANCODE_CURRENCYUNIT	SDLK_CURRENCYUNIT
"Cut"	SDL_SCANCODE_CUT	SDLK_CUT
"D"	SDL_SCANCODE_D	SDLK_d
"DecimalSeparator" (小数点キー)	SDL_SCANCODE_DECIMALSEPARATOR	SDLK_DECIMALSEPARATOR
"Delete"	SDL_SCANCODE_DELETE	SDLK_DELETE
"DisplaySwitch" (ミラーリング/デュアルディスプレイスイッチ, ビデオモードスイッチ)	SDL_SCANCODE_DISPLAYSWITCH	SDLK_DISPLAYSWITCH
"Down" (下カーソルキー)	SDL_SCANCODE_DOWN	SDLK_DOWN
"E"	SDL_SCANCODE_E	SDLK_e
"Eject"	SDL_SCANCODE_EJECT	SDLK_EJECT
"End"	SDL_SCANCODE_END	SDLK_END
"="	SDL_SCANCODE_EQUALS	SDLK_EQUALS
"Escape" (ESCキー)	SDL_SCANCODE_ESCAPE	SDLK_ESCAPE
"Execute"	SDL_SCANCODE_EXECUTE	SDLK_EXECUTE
"ExSel"	SDL_SCANCODE_EXSEL	SDLK_EXSEL
"F"	SDL_SCANCODE_F	SDLK_f
"F1"	SDL_SCANCODE_F1	SDLK_F1
"F10"	SDL_SCANCODE_F10	SDLK_F10
"F11"	SDL_SCANCODE_F11	SDLK_F11
"F12"	SDL_SCANCODE_F12	SDLK_F12
"F13"	SDL_SCANCODE_F13	SDLK_F13
"F14"	SDL_SCANCODE_F14	SDLK_F14
"F15"	SDL_SCANCODE_F15	SDLK_F15
"F16"	SDL_SCANCODE_F16	SDLK_F16
"F17"	SDL_SCANCODE_F17	SDLK_F17
"F18"	SDL_SCANCODE_F18	SDLK_F18
"F19"	SDL_SCANCODE_F19	SDLK_F19
"F2"	SDL_SCANCODE_F2	SDLK_F2
"F20"	SDL_SCANCODE_F20	SDLK_F20
"F21"	SDL_SCANCODE_F21	SDLK_F21
"F22"	SDL_SCANCODE_F22	SDLK_F22
"F23"	SDL_SCANCODE_F23	SDLK_F23
"F24"	SDL_SCANCODE_F24	SDLK_F24
"F3"	SDL_SCANCODE_F3	SDLK_F3
"F4"	SDL_SCANCODE_F4	SDLK_F4
"F5"	SDL_SCANCODE_F5	SDLK_F5
"F6"	SDL_SCANCODE_F6	SDLK_F6
"F7"	SDL_SCANCODE_F7	SDLK_F7
"F8"	SDL_SCANCODE_F8	SDLK_F8
"F9"	SDL_SCANCODE_F9	SDLK_F9
"Find"	SDL_SCANCODE_FIND	SDLK_FIND
"G"	SDL_SCANCODE_G	SDLK_g
"`" (ANSI, ISOキーボードならばキーボードの左上に位置するキー. アメリカのWindowsレイアウトとイギリスのMacレイアウトならば抑音アクセントとチルダ, イギリスのWindowsレイアウトなら抑音アクセントと否定記号, アメリカとイギリスのISOキーボードのMacレイアウトなら節記号とプラスマイナス記号, スイス(ドイツ語)レイアウト(MacはISOキーボードの場合のみ)ならば節記号と度記号, ドイツのレイアウト(MacはISOキーボードの場合のみ)ならば曲折アクセント, フランスのWindowsレイアウトならば上付き2とチルダ, フランスのISOキーボードのMacレイアウトならば単価記号とナンバー記号, スイス(ドイツ語)・ドイツ・フランスのANSIキーボードのMacレイアウトならば小なり記号と大なり記号)	SDL_SCANCODE_GRAVE	SDLK_BACKQUOTE
"H"	SDL_SCANCODE_H	SDLK_h
"Help"	SDL_SCANCODE_HELP	SDLK_HELP
"Home"	SDL_SCANCODE_HOME	SDLK_HOME
"I"	SDL_SCANCODE_I	SDLK_i
"Insert" (PCのInsertキー, 一部のMacのHelpキー(コード117ではなく73))	SDL_SCANCODE_INSERT	SDLK_INSERT
"J"	SDL_SCANCODE_J	SDLK_j
"K"	SDL_SCANCODE_K	SDLK_k
"KBDIllumDown"	SDL_SCANCODE_KBDILLUMDOWN	SDLK_KBDILLUMDOWN
"KBDIllumToggle"	SDL_SCANCODE_KBDILLUMTOGGLE	SDLK_KBDILLUMTOGGLE
"KBDIllumUp"	SDL_SCANCODE_SDL_SCANCODE_KBDILLUMUP	SDLK_SDL_SCANCODE_KBDILLUMUP
"Keypad 0" (テンキーの0)	SDL_SCANCODE_KP_0	SDLK_KP_0
"Keypad 00" (テンキーの00)	SDL_SCANCODE_KP_00	SDLK_KP_00
"Keypad 000" (テンキーの000)	SDL_SCANCODE_KP_000	SDLK_KP_000
"Keypad 1" (テンキーの1)	SDL_SCANCODE_KP_1	SDLK_KP_1
"Keypad 2" (テンキーの2)	SDL_SCANCODE_KP_2	SDLK_KP_2
"Keypad 3" (テンキーの3)	SDL_SCANCODE_KP_3	SDLK_KP_3
"Keypad 4" (テンキーの4)	SDL_SCANCODE_KP_4	SDLK_KP_4
"Keypad 5" (テンキーの5)	SDL_SCANCODE_KP_5	SDLK_KP_5
"Keypad 6" (テンキーの6)	SDL_SCANCODE_KP_6	SDLK_KP_6
"Keypad 7" (テンキーの7)	SDL_SCANCODE_KP_7	SDLK_KP_7
"Keypad 8" (テンキーの8)	SDL_SCANCODE_KP_8	SDLK_KP_8
"Keypad 9" (テンキーの9)	SDL_SCANCODE_KP_9	SDLK_KP_9
"Keypad A" (テンキーのA)	SDL_SCANCODE_KP_A	SDLK_KP_A
"Keypad &" (テンキーの&)	SDL_SCANCODE_KP_AMPERSAND	SDLK_KP_AMPERSAND
"Keypad @" (テンキーの@)	SDL_SCANCODE_KP_AT	SDLK_KP_AT
"Keypad B" (テンキーのB)	SDL_SCANCODE_KP_B	SDLK_KP_B
"Keypad Backspace" (テンキーのバックスペースキー)	SDL_SCANCODE_KP_BACKSPACE	SDLK_KP_BACKSPACE
"Binary" (テンキーのバイナリキー)	SDL_SCANCODE_BINARY	SDLK_BINARY
"Keypad C" (テンキーのC)	SDL_SCANCODE_KP_C	SDLK_KP_C
"Keypad :" (テンキーの:)	SDL_SCANCODE_KP_COLON	SDLK_KP_COLON
"Keypad ," (テンキーの,)	SDL_SCANCODE_KP_COMMA	SDLK_KP_COMMA
"Keypad D" (テンキーのD)	SDL_SCANCODE_KP_D	SDLK_KP_D
"Keypad &&" (テンキーの&&)	SDL_SCANCODE_KP_DBLAMPERSAND	SDLK_KP_DBLAMPERSAND
"Keypad ||" (テンキーの||)	SDL_SCANCODE_KP_DBLVERTICALBAR	SDLK_KP_DBLVERTICALBAR
"Keypad Decimal" (テンキーの小数点)	SDL_SCANCODE_KP_DECIMAL	SDLK_KP_DECIMAL
"Keypad /" (テンキーの/)	SDL_SCANCODE_KP_DIVIDE	SDLK_KP_DIVIDE
"Keypad E" (テンキーのE)	SDL_SCANCODE_KP_E	SDLK_KP_E
"Keypad Enter" (テンキーのEnter)	SDL_SCANCODE_KP_ENTER	SDLK_KP_ENTER
"Keypad =" (テンキーの=)	SDL_SCANCODE_KP_EQUALS	SDLK_KP_EQUALS
"Keypad = (AS400)" (テンキーの=AS400)	SDL_SCANCODE_KP_EQUALSAS400	SDLK_KP_EQUALSAS400
"Keypad !" (テンキーの!)	SDL_SCANCODE_KP_EXCLAM	SDLK_KP_EXCLAM
"Keypad F" (テンキーのF)	SDL_SCANCODE_KP_F	SDLK_KP_F
"Keypad >" (テンキーの大なり)	SDL_SCANCODE_KP_GREATER	SDLK_KP_GREATER
"Keypad #" (テンキーの#)	SDL_SCANCODE_KP_HASH	SDLK_KP_HASH
"Keypad Keypad Hexadecimal" (テンキーの16進数)	SDL_SCANCODE_KP_HEXADECIMAL	SDLK_KP_HEXADECIMAL
"Keypad {" (テンキーの{)	SDL_SCANCODE_KP_LEFTBRACE	SDLK_KP_LEFTBRACE
"Keypad (" (テンキーの()	SDL_SCANCODE_KP_LEFTPAREN	SDLK_KP_LEFTPAREN
"Keypad <" (テンキーの)	SDL_SCANCODE_KP_LESS	SDLK_KP_LESS
"Keypad MemAdd" (テンキーのメモリ加算)	SDL_SCANCODE_KP_MEMADD	SDLK_KP_MEMADD
"Keypad MemClear" (テンキーのメモリクリア)	SDL_SCANCODE_KP_MEMCLEAR	SDLK_KP_MEMCLEAR
"Keypad MemDivide" (テンキーのメモリ除算)	SDL_SCANCODE_KP_MEMDIVIDE	SDLK_KP_MEMDIVIDE
"Keypad MemMultiply" (テンキーのメモリ乗算)	SDL_SCANCODE_KP_MEMMULTIPLY	SDLK_KP_MEMMULTIPLY
"Keypad MemRecall" (テンキーのメモリ呼出)	SDL_SCANCODE_KP_MEMRECALL	SDLK_KP_MEMRECALL
"Keypad MemStore" (テンキーのメモリ保存)	SDL_SCANCODE_KP_MEMSTORE	SDLK_KP_MEMSTORE
"Keypad MemSubtract" (テンキーのメモリ減算)	SDL_SCANCODE_KP_MEMSUBTRACT	SDLK_KP_MEMSUBTRACT
"Keypad -" (テンキーの-)	SDL_SCANCODE_KP_MINUS	SDLK_KP_MINUS
"Keypad *" (テンキーの*)	SDL_SCANCODE_KP_MULTIPLY	SDLK_KP_MULTIPLY
"Keypad Octal" (テンキーの8進数)	SDL_SCANCODE_KP_OCTAL	SDLK_KP_OCTAL
"Keypad %" (テンキーの%)	SDL_SCANCODE_KP_PERCENT	SDLK_KP_PERCENT
"Keypad ." (テンキーの.)	SDL_SCANCODE_KP_PERIOD	SDLK_KP_PERIOD
"Keypad +" (テンキーの+)	SDL_SCANCODE_KP_PLUS	SDLK_KP_PLUS
"Keypad +/-" (テンキーの+/-)	SDL_SCANCODE_KP_PLUSMINUS	SDLK_KP_PLUSMINUS
"Keypad ^" (テンキーの^)	SDL_SCANCODE_KP_POWER	SDLK_KP_POWER
"Keypad }" (テンキーの})	SDL_SCANCODE_KP_RIGHTBRACE	SDLK_KP_RIGHTBRACE
"Keypad )" (テンキーの))	SDL_SCANCODE_KP_RIGHTPAREN	SDLK_KP_RIGHTPAREN
"Keypad Space" (テンキーのスペース)	SDL_SCANCODE_KP_SPACE	SDLK_KP_SPACE
"Keypad Tab" (テンキーのタブ)	SDL_SCANCODE_KP_TAB	SDLK_KP_TAB
"Keypad |" (テンキーの|)	SDL_SCANCODE_KP_VERTICALBAR	SDLK_KP_VERTICALBAR
"Keypad XOR" (テンキーのXOR)	SDL_SCANCODE_KP_XOR	SDLK_KP_XOR
"L"	SDL_SCANCODE_L	SDLK_l
"Left Alt" (Alt, Optionキー)	SDL_SCANCODE_LALT	SDLK_LALT
"Left Ctrl"	SDL_SCANCODE_LCTRL	SDLK_LCTRL
"Left" (左カーソルキー)	SDL_SCANCODE_LEFT	SDLK_LEFT
"["	SDL_SCANCODE_LEFTBRACKET	SDLK_LEFTBRACKET
"Left GUI" (Windows, Command(Apple), Metaキー)	SDL_SCANCODE_LGUI	SDLK_LGUI
"Left Shift"	SDL_SCANCODE_LSHIFT	SDLK_LSHIFT
"M"	SDL_SCANCODE_M	SDLK_m
"Mail" (メール, eメールキー)	SDL_SCANCODE_MAIL	SDLK_MAIL
"MediaSelect" (メディア選択キー)	SDL_SCANCODE_MEDIASELECT	SDLK_MEDIASELECT
"Menu"	SDL_SCANCODE_MENU	SDLK_MENU
"-"	SDL_SCANCODE_MINUS	SDLK_MINUS
"ModeSwitch" (上記で網羅されているかはわからない. しかし, 特別なKMOD_MODEがあればここに追加する)	SDL_SCANCODE_MODE	SDLK_MODE
"Mute"	SDL_SCANCODE_MUTE	SDLK_MUTE
"N"	SDL_SCANCODE_N	SDLK_n
"Numlock" (PCのNumLockキー, MacのClearキー)	SDL_SCANCODE_NUMLOCKCLEAR	SDLK_NUMLOCKCLEAR
"O"	SDL_SCANCODE_O	SDLK_o
"Oper"	SDL_SCANCODE_OPER	SDLK_OPER
"Out"	SDL_SCANCODE_OUT	SDLK_OUT
"P"	SDL_SCANCODE_P	SDLK_p
"PageDown"	SDL_SCANCODE_PAGEDOWN	SDLK_PAGEDOWN
"PageUp"	SDL_SCANCODE_PAGEUP	SDLK_PAGEUP
"Paste"	SDL_SCANCODE_PASTE	SDLK_PASTE
"Pause" (Pause/Breakキー)	SDL_SCANCODE_PAUSE	SDLK_PAUSE
"."	SDL_SCANCODE_PERIOD	SDLK_PERIOD
"Power" (USBドキュメントによると, これは状態フラグで, 物理的なキーではない. しかし, 一部のMacのキーボードには実際にPOWERキーが存在する)	SDL_SCANCODE_POWER	SDLK_POWER
"PrintScreen"	SDL_SCANCODE_PRINTSCREEN	SDLK_PRINTSCREEN
"Prior"	SDL_SCANCODE_PRIOR	SDLK_PRIOR
"Q"	SDL_SCANCODE_Q	SDLK_q
"R"	SDL_SCANCODE_R	SDLK_r
"Right Alt" (オルタネートグラフィックキー, Optionキー)	SDL_SCANCODE_RALT	SDLK_RALT
"Right Ctrl"	SDL_SCANCODE_RCTRL	SDLK_RCTRL
"Return" (メインキーボードのENTERキー)	SDL_SCANCODE_RETURN	SDLK_RETURN
"Return"	SDL_SCANCODE_RETURN2	SDLK_RETURN2
"Right GUI" (Windows, Command(Apple), Metaキー)	SDL_SCANCODE_RGUI	SDLK_RGUI
"Right" (右カーソルキー)	SDL_SCANCODE_RIGHT	SDLK_RIGHT
"]"	SDL_SCANCODE_RIGHTBRACKET	SDLK_RIGHTBRACKET
"Right Shift"	SDL_SCANCODE_RSHIFT	SDLK_RSHIFT
"S"	SDL_SCANCODE_S	SDLK_s
"ScrollLock"	SDL_SCANCODE_SCROLLLOCK	SDLK_SCROLLLOCK
"Select"	SDL_SCANCODE_SELECT	SDLK_SELECT
";"	SDL_SCANCODE_SEMICOLON	SDLK_SEMICOLON
"Separator"	SDL_SCANCODE_SEPARATOR	SDLK_SEPARATOR
"/"	SDL_SCANCODE_SLASH	SDLK_SLASH
"Sleep"	SDL_SCANCODE_SLEEP	SDLK_SLEEP
"Space"	SDL_SCANCODE_SPACE	SDLK_SPACE
"Stop"	SDL_SCANCODE_STOP	SDLK_STOP
"SysReq"	SDL_SCANCODE_SYSREQ	SDLK_SYSREQ
"T"	SDL_SCANCODE_T	SDLK_t
"Tab"	SDL_SCANCODE_TAB	SDLK_TAB
"ThousandsSeparator" (桁区切りキー)	SDL_SCANCODE_THOUSANDSSEPARATOR	SDLK_THOUSANDSSEPARATOR
"U"	SDL_SCANCODE_U	SDLK_u
"Undo"	SDL_SCANCODE_UNDO	SDLK_UNDO
"" (名前なし)	SDL_SCANCODE_UNKNOWN	SDLK_UNKNOWN
"Up" (上カーソルキー)	SDL_SCANCODE_UP	SDLK_UP
"V"	SDL_SCANCODE_V	SDLK_v
"VolumeDown"	SDL_SCANCODE_VOLUMEDOWN	SDLK_VOLUMEDOWN
"VolumeUp"	SDL_SCANCODE_VOLUMEUP	SDLK_VOLUMEUP
"W"	SDL_SCANCODE_W	SDLK_w
"WWW" (WWW/World Wide Webキー)	SDL_SCANCODE_WWW	SDLK_WWW
"X"	SDL_SCANCODE_X	SDLK_X
"Y"	SDL_SCANCODE_Y	SDLK_y
"Z"	SDL_SCANCODE_Z	SDLK_z
これらの物理キーに対応する仮想キーは存在しない
"" (名前なし. アジアのキーボードで使われる. 末尾のUSBドキュメントを参照すること)	SDL_SCANCODE_INTERNATIONAL1	(なし)
"" (名前なし)	SDL_SCANCODE_INTERNATIONAL2	(なし)
"" (名前なし. 円記号)	SDL_SCANCODE_INTERNATIONAL3	(なし)
"" (名前なし)	SDL_SCANCODE_INTERNATIONAL4	(なし)
"" (名前なし)	SDL_SCANCODE_INTERNATIONAL5	(なし)
"" (名前なし)	SDL_SCANCODE_INTERNATIONAL6	(なし)
"" (名前なし)	SDL_SCANCODE_INTERNATIONAL7	(なし)
"" (名前なし)	SDL_SCANCODE_INTERNATIONAL8	(なし)
"" (名前なし)	SDL_SCANCODE_INTERNATIONAL9	(なし)
"" (名前なし. ハングル/英文字トグル)	SDL_SCANCODE_SDL_SCANCODE_LANG1	(なし)
"" (名前なし. 韓国の漢字変換)	SDL_SCANCODE_SDL_SCANCODE_LANG2	(なし)
"" (名前なし. カタカナ)	SDL_SCANCODE_SDL_SCANCODE_LANG3	(なし)
"" (名前なし. ひらがな)	SDL_SCANCODE_SDL_SCANCODE_LANG4	(なし)
"" (名前なし. 全角/半角)	SDL_SCANCODE_SDL_SCANCODE_LANG5	(なし)
"" (名前なし. 予約)	SDL_SCANCODE_SDL_SCANCODE_LANG6	(なし)
"" (名前なし. 予約)	SDL_SCANCODE_SDL_SCANCODE_LANG7	(なし)
"" (名前なし. 予約)	SDL_SCANCODE_SDL_SCANCODE_LANG8	(なし)
"" (名前なし. 予約)	SDL_SCANCODE_SDL_SCANCODE_LANG9	(なし)
"" (名前なし)	SDL_SCANCODE_LOCKINGCAPSLOCK	(なし)
"" (名前なし)	SDL_SCANCODE_LOCKINGNUMLOCK	(なし)
"" (名前なし)	SDL_SCANCODE_LOCKINGSCROLLLOCK	(なし)
"" (名前なし. これはISOキーボードでANSIキーボードに追加されたキーで, 左シフトとYの間に位置する. アメリカとイギリスのMacレイアウトならば抑音アクセントとチルダ, アメリカとイギリスのWindowsレイアウトならば逆斜線(バックススラッシュ)と縦線, スイス(ドイツ語)・ドイツ・フランスのレイアウトならば小なり記号と大なり記号)	SDL_SCANCODE_NONUSBACKSLASH	(なし)
"" (名前なし. ISO USBキーボードでは, 実際にはこのコードを49のキーの代わりに使っている. しかし, 見る限り全てのOSは2つのコードを同一視している. よってSDLを実装する者は, 使っているキーボードがこれら2つのコードを生成しない, そしてOSが区別しない限り, SDL_SCANCODE_BACKSLASHをこのコードの代わりに生成すべきである. SDLのユーザは, SDLはほとんどの(全ての?)キーボードでこのコードを生成しないため, このコードを当てにしてはならない.)	SDL_SCANCODE_NONUSHASH	(なし)
これらの仮想キーに対応する物理キーは存在しない
"&"	(なし)	SDLK_AMPERSAND
"*"	(なし)	SDLK_ASTERISK
"@"	(なし)	SDLK_AT
"^"	(なし)	SDLK_CARET
":"	(なし)	SDLK_COLON
"$"	(なし)	SDLK_DOLLAR
"!"	(なし)	SDLK_EXCLAIM
">"	(なし)	SDLK_GREATER
"#"	(なし)	SDLK_HASH
"("	(なし)	SDLK_LEFTPAREN
"<"	(なし)	SDLK_LESS
"%"	(なし)	SDLK_PERCENT
"+"	(なし)	SDLK_PLUS
"?"	(なし)	SDLK_QUESTION
"""	(なし)	SDLK_QUOTEDBL
")"	(なし)	SDLK_RIGHTPAREN
"_"	(なし)	SDLK_UNDERSCORE




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
<pre><code class="example"></code></pre>
