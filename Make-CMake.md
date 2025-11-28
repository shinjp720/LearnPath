---
title: Make/CMake
layout: default
---

# Make/CMake <a id="top" data-name="TOP"></a>

---

## CMake <a id="CMake" data-name="CMake"></a>

### 最小のCMakeLists.txt <a id="minimam" data-name="最小構成"></a>

```cmake
cmake_minimum_required(VERSION 3.16)  # 必要なCMakeのバージョン
project(MyProject VERSION 1.0 LANGUAGES CXX)  # プロジェクト名と使用言語

set(CMAKE_CXX_STANDARD 17)            # C++の標準
例: C++17


set(CMAKE_CXX_STANDARD_REQUIRED ON)   # 必須にする

add_executable(myapp main.cpp)        # 実行ファイルの生成 (ソースファイル指定)
```

---

### コマンド <a id="command" data-name="コマンド"></a>

#### 基本構成・プロジェクト情報

| コマンド | 役割 | 例 |
| --- | --- | --- |
| cmake_minimum_required() | 最低限必要なCMakeのバージョン指定 | cmake_minimum_required(VERSION 3.16) |
| project() | プロジェクト名と使用言語を指定 | project(MyApp LANGUAGES CXX) |
| set() | 変数を設定 | set(SRC main.cpp util.cpp) |
| message() | コンソール出力 | message(STATUS "Building project...") |

#### ビルド対象の定義

| コマンド | 役割 | 例 |
| --- | --- | --- |
| add_executable() | 実行ファイルを作成 | add_executable(myapp main.cpp) |
| add_library() | ライブラリを作成(STATIC, SHARED, INTERFACE も指定可) | add_library(utils STATIC util.cpp) |
| target_link_libraries() | 依存ライブラリをリンク | target_link_libraries(myapp PRIVATE utils) |
| target_include_directories() | ヘッダファイルのパスを追加 | target_include_directories(myapp PRIVATE include) |
| target_compile_definitions() | マクロ定義を追加 | target_compile_definitions(myapp PRIVATE DEBUG_MODE) |
| target_compile_options() | コンパイルオプションを追加 | target_compile_options(myapp PRIVATE -Wall -Wextra) |

- target_xxのアクセス指定子は設定の伝播範囲を表す。

| 指定 | 伝播範囲 | 意味 |
| --- | --- | --- |
| PRIVATE | 自分だけ | MyAppにだけ適用 |
| PUBLIC | 自分 + 依存先 | MyAppとそれを使う他のターゲット両方に適用 |
| INTERFACE | 依存先のみ | ライブラリ自身には不要、使う側にだけ伝える |

#### ディレクトリ・構成管理

| コマンド | 役割 | 例 |
| --- | --- | --- |
| add_subdirectory() | サブプロジェクトを追加下層のCMakeLists.txtを読み込む | add_subdirectory(src) |
| include() | 他のCMakeファイルを読み込む | include(cmake/Utils.cmake) |
| list() | リスト操作(APPEND, REMOVE_ITEM, LENGTHなど) | list(APPEND SRC extra.cpp) |
| file() | ファイル操作(コピー・GLOB検索など) | file(GLOB SRC_FILES src/*.cpp) |

#### オプション・条件分岐

| コマンド | 役割 | 例 |
| --- | --- | --- |
| option() | ビルドオプションを定義(ON/OFF) | option(ENABLE_LOG "Enable logging" ON) |
| if(), elseif(), else(), endif() | 条件分岐 | if(CMAKE_BUILD_TYPE STREQUAL "Debug") |
| foreach(), endforeach() | 繰り返し | foreach(file IN LISTS SRC_FILES) |
| while(), endwhile() | ループ | while(cond) |

#### 検出・設定関連

| コマンド | 役割 | 例 |
| --- | --- | --- |
| find_package() | 外部パッケージを検出(OpenGL, SDL2など)| find_package(SDL2 REQUIRED) |
| find_library() | ライブラリを探す | find_library(M_LIB m) |
| find_path() | ヘッダの場所を探す | find_path(FOO_INCLUDE_DIR foo.h) |
| find_file() | ファイルを探す | find_file(CONFIG_PATH config.json) |
| find_program() | 実行ファイルを探す | find_program(GIT_EXE git) |

#### インストール・エクスポート

| コマンド | 役割 | 例 |
| --- | --- | --- |
| install() | ファイル・ターゲットをインストール | install(TARGETS myapp DESTINATION bin) |
| export() | ターゲットのエクスポート | export(TARGETS mylib FILE MyLibTargets.cmake) |
| configure_file() | テンプレートファイルに変数を埋め込んでコピー | configure_file(config.in.h config.h) |

#### デバッグ・診断によく使う

| コマンド | 役割 | 例 |
| --- | --- | --- |
| message(STATUS ...) | 状況を表示 | message(STATUS "CXX Compiler: ${CMAKE_CXX_COMPILER}") |
| cmake_print_variables() | 複数変数の内容をまとめて出力(Make 3.17+) | cmake_print_variables(CMAKE_BUILD_TYPE SRC_FILES) |
| get_target_property() | ターゲットのプロパティを取得 | get_target_property(INC_DIR mylib INCLUDE_DIRECTORIES) |
| get_filename_component() | パス操作 | get_filename_component(DIR ${FILE} DIRECTORY) |

---

### 頻出コマンド <a id="common-command" data-name="頻出コマンド"></a>

#### cmake_minimum_required(VERSION 3.16)
最低限必要なCMakeのバージョンの指定。

| バージョン | 追加された機能 |
| --- | --- |
| 3.1 | `CMAKE_CXX_STANDARD`でC++の標準を指定可能に |
| 3.8 | `target_compile_features()`でC++17などを指定可能に |
| 3.13 | `target_link_options()`が追加 |
| 3.16 | `cmake_parse_arguments(PARSE_ARGV ...)` |
| 3.20 | プリセット(CMakePresets.json)対応 |
| 3.25+ | モダンな`FetchContent_MakeAvailable()`安定化 |

- おすすめは3.16
  - 現在の主流
  - 多くのLinuxディストリやWindowsのCMakeもこのあたりが標準
  - target_*系構文、FetchContent、INTERFACEなどが安定して使える。

---

#### project(MyApp VERSION 1.0 LANGUAGES CXX)

| 引数 | 役割 |
| --- | --- |
| MyApp | プロジェクト名で変数`PROJECT_NAME`に保存される |
| VERSION 1.0 | バージョン番号で`PROJECT_VERSION`などに保存される |
| LANGUAGES CXX | 使用する言語(例: C, CXX, Fortranなど) |

- `project(MyApp VERSION 1.0 LANGUAGES CXX)` と記述すると自動的に以下の変数が設定される。

| 変数 | 内容 |
| --- | --- |
| PROJECT_NAME | MyApp |
| PROJECT_VERSION | 1.0 |
| PROJECT_SOURCE_DIR | `CMakeLists.txt` があるプロジェクトのルートパス |
| PROJECT_BINARY_DIR | ビルド出力ディレクトリ(build/ など) |
| CMAKE_PROJECT_NAME | 最上位の project名(サブディレクトリでも共通) |

- install()時の出力名
- configure_file()でのバージョンの埋め込み
- パス指定の自動化

などに使われる。

---

#### add_executable(myapp main.cpp)
C++プロジェクトをビルドする際に、どのソースファイルからどんな実行ファイルを作るかを定義する。

<pre><code class="example"># main.cppとutils.cppをコンパイルしてMyAppという実行ファイルを作るという意味
add_executable(MyApp main.cpp utils.cpp)
</code></pre>

- よく使うオプション構文

<pre><code class="example">set(SRC main.cpp utils.cpp math/add.cpp math/sub.cpp)
add_executable(MyApp ${SRC})</code></pre>


---

#### set()
CMakeにおける変数の基本は、set()で変数を定義して${変数名}で参照する。

```cmake
set(UTILITY_DIR $ENV{HOME}/utility)

include_directories(${UTILITY_DIR}/include)
link_directories(${UTILITY_DIR}/lib)
```

変数の値を確認する場合は

```cmake
message("UTILITY_DIR=${UTILITY_DIR}")
```

---

### プロジェクトにライブラリを追加 <a id="external" data-name="ライブラリの追加"></a>

#### HOMEにある自作ライブラリを追加する

```bash
~/utility/include/util.hpp
~/utility/src/util.cpp
```

- HOME変数の設定

CMakeでは環境変数を`$ENV{HOME}`で参照する。

```cmake
include_directories($ENV{HOME}/utility/include)
```

複数回使用する場合は明示的に変数に格納しておく。
```cmake
set(UTILITY_DIR $ENV{HOME}/utility)
```

windowsの場合は分岐処理を書く。

```cmake
if(WIN32)
    set(USER_HOME $ENV{USERPROFILE})
else()
    set(USER_HOME $ENV{HOME})
endif()

set(UTILITY_DIR ${USER_HOME}/utility)
```

- add_executableにソースファイルを追加

```cmake
add_executable(app main.cpp "${UTILITY_DIR}/src/util.cpp")
```

- target_include_directoriesに追加

```cmake
target_include_directories(sugaku PRIVATE "${UTILITY}/include")
```

<pre><code class="example">cmake_minimum_required(VERSION 3.16)
project(SUGAKUProject VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(UTILITY "$ENV{HOME}/utility")

add_executable(sugaku main.cpp "${UTILITY}/src/ansi_escape.cpp")
target_include_directories(sugaku PRIVATE "${UTILITY}/include")</code></pre>

---

#### SDL2を追加する
SDL2はCMake用の設定ファイル(CMake Config)を提供しているのでfind_packageで完結する。

```cmake
cmake_minimum_required(VERSION 3.16)
project(Sample LANGUAGES CXX)

find_package(SDL2 REQUIRED)
find_package(SDL2_image REQUIRED)
find_package(SDL2_ttf REQUIRED)

add_executable(MyApp main.cpp)

target_link_libraries(MyApp PRIVATE
    SDL2::SDL2
    SDL2_image::SDL2_image
    SDL2_ttf::SDL2_ttf
)
```

---

#### MySQLを追加する
libmysqlclientは多くのディストリビューションでCMake Configを提供していないので手書きする必要がある。

```cmake
include_directories(/usr/include/mysql)
link_directories(/usr/lib/x86_64-linux-gnu)

add_executable(MyApp main.cpp)
target_link_libraries(MyApp PRIVATE mysqlclient)
```

あるいはCMakeモジュールを探して手動でインポート

```cmake
find_library(MYSQL_LIB mysqlclient)
find_path(MYSQL_INCLUDE_DIR mysql.h)

include_directories(${MYSQL_INCLUDE_DIR})
target_link_libraries(MyApp PRIVATE ${MYSQL_LIB})
```

---

#### SQLite3を追加する

```cmake
cmake_minimum_required(VERSION 3.10)
project(MySQLiteApp C)

set(CMAKE_C_STANDARD 11)

# SQLite3ライブラリを探す
find_package(SQLite3 REQUIRED)

# main.cをコンパイルして実行ファイルを作る
add_executable(my_sqlite_app main.c)

# SQLite3をリンクする
target_link_libraries(my_sqlite_app PRIVATE SQLite::SQLite3)
```

---

### モダンCMakeにおける非推奨コマンド <a id="not-recommended" data-name="非推奨コマンド"></a>

| 古いコマンド | 理由 | モダンCMakeでの代替 |
| --- | --- | --- |
| `include_directories()` | グローバルに影響するため、依存関係が不明瞭になる | target_include_directories(<target> PRIVATE include/)` |
| `link_directories()` | 同様にグローバル設定。どのターゲットに影響するか不明確 | ライブラリは `target_link_libraries()` で明示的に指定する |
| `add_definitions()` | コンパイル定義を全体に適用してしまう | `target_compile_definitions(<target> PRIVATE DEBUG)` |
| `remove_definitions()` | 上記と同じ理由で不透明な操作になる | ターゲットスコープで定義管理を行う |
| `link_libraries()` | どのターゲットにリンクされるかが分かりにくい | `target_link_libraries(<target> PRIVATE libname)` |
| `add_compile_options()` | グローバルに影響する | `target_compile_options(<target> PRIVATE -Wall)` |
| `set(CMAKE_CXX_FLAGS ...)` / `CMAKE_C_FLAGS` | 全ターゲットに適用され副作用が大きい | `target_compile_options()` または `generator expressions` |
| `project(... LANGUAGES CXX C)` の直後に `set(CMAKE_CXX_STANDARD ...)` | CMake 3.1以降ではターゲットごとに指定できる | `target_compile_features(<target> PRIVATE cxx_std_20)` |
| `aux_source_directory()` | 自動でソース一覧を収集するが、可読性と明示性が低い | 明示的に `add_executable(target main.cpp foo.cpp)` と書く |
| `export(PACKAGE)` の旧形式 | 古いCMake用。パッケージ管理用の `install(EXPORT ...)` を使うのが主流 | `install(EXPORT MyTargets ...)` |
| `add_custom_command(TARGET ... PRE_BUILD ...)`（Windows限定） | クロスプラットフォームで非推奨 | `add_custom_command(OUTPUT ...)` や `add_custom_target()` を使用 |


---

### CMakeで検出可能かを調べる

<pre><code class="tips">cmake --find-package -DNAME=SDL2 -DCOMPILER_ID=GNU -DLANGUAGE=CXX -DMODE=EXIST</code></pre>

---

## Make <a id="make" data-name="Make"></a>

### シンプルなMakefile

```makefile
# コンパイラ
CC = gcc

# コンパイルオプション
CFLAGS = -Wall -Wextra -std=c99 -O2

# ソースファイル
SRCS = main.c foo.c bar.c

# オブジェクトファイル
.cを.oに置換


OBJS = $(SRCS:.c=.o)

# 実行ファイル名
TARGET = my_app

# デフォルトターゲット
all: $(TARGET)

# 実行ファイルをリンク
$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $(TARGET)

# 個別の.oファイルをビルド
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

# クリーン
オブジェクトと実行ファイル削除


clean:
	rm -f $(OBJS) $(TARGET)
```

- `$<`は最初の依存ファイルを、`$@`はターゲットファイルを意味する。
- `make`でビルド、`make cleanで`削除する。
- makeを引数なしで実行した時に最初のターゲット(ルール)つまりallが実行される

---

