---
title: SDL3
layout: default
---

# SDL3 <a id="top" data-name="TOP"></a>

## 導入 <a id="introduction" data-name="導入"></a>

### 依存パッケージのインストール

```bash
sudo apt update
sudo apt install -y \
  build-essential \
  cmake \
  git \
  pkg-config \
  libx11-dev \
  libxrandr-dev \
  libxinerama-dev \
  libxcursor-dev \
  libxi-dev \
  libgl1-mesa-dev \
  libwayland-dev \
  wayland-protocols \
  libdrm-dev \
  libxtst-dev
```

### SDL3の取得とビルド・インストール

```bash
cd ~
git clone https://github.com/libsdl-org/SDL.git SDL3
cd SDL3
mkdir build
cd build
```

### CMake

```bash
cmake .. \
  -DCMAKE_BUILD_TYPE=Release \
  -DSDL_SHARED=ON \
  -DSDL_STATIC=OFF
```

```bash
cmake --build . -j$(nproc)
sudo cmake --install .
```

### 最小のプロジェクト構成

```
project/
├── CMakeLists.txt
└── main.cpp
```

### CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 3.16)
project(sdl3_sample LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(SDL3 REQUIRED)

add_executable(sdl3_sample
    main.cpp
)

target_link_libraries(sdl3_sample
    SDL3::SDL3
)
```

### main.cpp(動作確認)

```cpp
#include <SDL3/SDL.h>
#include <iostream>

int main(int argc, char* argv[])
{
    if (SDL_Init(SDL_INIT_VIDEO) != 0) {
        std::cerr << "SDL_Init Error: " << SDL_GetError() << std::endl;
        return 1;
    }

    SDL_Window* window = SDL_CreateWindow(
        "SDL3 on WSL2",
        800, 600,
        SDL_WINDOW_RESIZABLE
    );

    if (!window) {
        std::cerr << "CreateWindow Error: " << SDL_GetError() << std::endl;
        SDL_Quit();
        return 1;
    }

    bool running = true;
    SDL_Event e;

    while (running) {
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }
        SDL_Delay(16);
    }

    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}
```

### ビルド・実行

```bash
mkdir build
cd build
cmake ..
cmake --build .
./sdl3_sample
```