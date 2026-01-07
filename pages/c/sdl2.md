---
title: SDL2
layout: default
---

# SDL2 <a id="top" data-name="TOP"></a>

## メソッド <a id="methods" data-name="メソッド">

### 初期化・終了(必須)

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

### ウィンドウ管理

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

### レンダラー(2D描画の中核)

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

### 描画ループの基本セット

```cpp
SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
```

- 以降の描画色を設定。

```cpp
SDL_RenderClear(renderer);
```

- 画面を塗りつぶす(実質のフレーム開始)。

```cpp
SDL_RenderCopy(renderer, texture, nullptr, &dstRect);
```

- テクスチャを画面の描画。
- 2Dゲームで最も使う関数。

```cpp
SDL_RenderPresent(renderer);
```

- バックバッファ->画面への反映。
- 1フレームの終わり。

---

### 画像処理

#### サーフェイスの取得

```cpp
// 画像の読み込み
SDL_Surface* surface = SDL_LoadBMP("image.bmp");
```

- デフォルトで使えるが.bmpのみ。

#### または

```cpp
#include <SDL2/SDL_image.h>

// SDL_imageの初期化
int flags = IMG_INIT_PNG | IMG_INIT_JPG;  // 使いたい形式だけ
if ((IMG_Init(flags) & flags) != flags) {
    SDL_Log("IMG_Init error: %s", IMG_GetError());
    return -1;
}

// 画像の読み込み
SDL_Surface* surface = IMG_Load("image.png");
if (!surface) {
    SDL_Log("IMG_Load error: %s", IMG_GetError());
    return -1;
}
```

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
SDL_FreeSurface(surface);
```

#### テクスチャの生成

```cpp
SDL_Texture* texture =
    SDL_CreateTextureFromSurface(renderer, surface);
```

#### 対応する解放処理

```cpp
SDL_DestroyTexture(texture);
```

<pre><code class="tips">SDL_LoadBMP()とIMG_Load()は、失敗時にnullptrを返し、SDL_FreeSurface(nullptr)とSDL_DestroyTexture(nullptr)は何もしないため安全。</code></pre>

---

### ループ構造

#### 単純なゲームループ(ポーリング型)

```cpp
bool running = true;

while (running) {
    SDL_Event e;
    while (SDL_PollEvent(&e)) {
        if (e.type == SDL_QUIT) {
            running = false;
        }
    }

    update();   // 状態更新
    render();   // 描画
}
```

- 毎フレーム必ずupdate()/render()を呼ぶ
- ゲーム・リアルタイムアプリ・アニメーション主体のアプリ向き

#### イベント駆動に近いループ(WaitEvent型)

```cpp
bool running = true;

while (running) {
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
}
```

- イベントが来るまでブロック
- 入力が無い間はCPUをほぼ使わない
- ツール系アプリ向き

#### フレームレート制限

```cpp
const int FPS = 60;
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
}
```

---

### イベント処理(入力・ウィンドウ)


---

### キーボード入力

---

### 時間・フレーム制御

```cpp
// 軌道からの経過ミリ秒(約49日でオーバーフロー)
Uint32 now = SDL_GetTicks();

// 簡易的なフレーム制御
SDL_Delay(16);
```

---

### エラー処理

```cpp
std::cerr << SDL_GetError() << std::endl;
```

- SDL関数が失敗したら必ず確認

---

### 最小限の構成

```
SDL_CreateWindow
SDL_CreateRenderer

while (running)
 ├ SDL_PollEvent
 ├ SDL_SetRenderDrawColor
 ├ SDL_RenderClear
 ├ SDL_RenderCopy
 └ SDL_RenderPresent

SDL_DestroyTexture
SDL_DestroyRenderer
SDL_DestroyWindow
SDL_Quit</code></pre>
```

---







## 導入 <a id="introduction" data-name="導入"></a>