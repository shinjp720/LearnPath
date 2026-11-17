---
title: Bevy
layout: default
---

# Bevy <a id="top" data-name="TOP"></a>

Bevy は、Rust で書かれた、**データ駆動のゲームエンジン**。ECS (Entity Component System) という設計を中心にしていて、2D、3D、UI、オーディオ、アセットの読み込みなど、ゲームに必要な機能を、プラグインとして組み合わせて使う。無料で、オープンソース。

エンジンというより、「ゲームを作るための、ライブラリの集まり」に近く、エディタはなく、すべてを Rust のコードで書く。

このドキュメントは、2026年10月8日にリリースされた Bevy 0.20 を前提にしている。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| ECS | ゲームのデータと処理を、エンティティ、コンポーネント、システムに分ける |
| 並列実行 | データの競合がないシステムを、自動で、複数のスレッドで並列に実行する |
| モジュール化 | 機能が、プラグインに分かれていて、必要なものだけ使える。自作のプラグインも、同じ形で書ける |
| Rust のみ | ゲームのコードも、設定も、Rust で書く。型検査と、借用の検査が、効く |
| クロスプラットフォーム | Windows、macOS、Linux、Web (WASM)、iOS、Android に対応している |
| ホットリロード | アセットを、ゲームの実行中に、差し替えられる |

### 向き不向き

| 向いている | 向いていない |
| --- | --- |
| Rust でゲームやシミュレーションを作りたい | エディタ (GUI) で、シーンを作りたい |
| データ駆動の設計や、大量のオブジェクトの処理を試したい | 安定した API で、長期の保守をしたい (バージョンごとに、破壊的変更がある) |
| 小〜中規模のゲームや、ツールを作る | 商用のゲームを、すぐに作りたい (機能が、まだ発展途上のものもある) |

<pre><code class="caution">Bevy は、まだ 1.0 に達しておらず、およそ4か月ごとに、新しいバージョンが出て、そのたびに破壊的変更がある。
ネットの記事やチュートリアルの API は、古いと、そのままでは動かない。使うバージョンの、公式のドキュメントと、移行ガイドで確認する。</code></pre>

### 最近のバージョン

| バージョン | リリース | 主な変更 |
| --- | --- | --- |
| 0.18 | 2026年1月 | `2d`、`3d`、`ui` の、フィーチャーの集まり (feature collections)。PBR の修正、フォントの機能の追加 |
| 0.19 | 2026年6月 | BSN (Bevy Scene Notation) の一部が追加された。旧 `bevy_scene` が `bevy_world_serialization` に改名された |
| 0.20 | 2026年10月 | BSN の構文の改善 (シーンの参照に `@` が必要)、WESL でのシェーダー、スプライトのカスタムマテリアル、UI の楕円の境界 |

---

## 導入 <a id="introduction" data-name="導入"></a>

### プロジェクトの作成

```bash
cargo new my_game
cd my_game
cargo add bevy
```

### フィーチャーを絞る

Bevy には、多くの機能があり、すべて有効にすると、ビルドが長くなる。0.18 から、作るゲームの種類に応じた、**フィーチャーの集まり**を指定できる。

| 集まり | 内容 |
| --- | --- |
| `2d` | 2D ゲームに必要な機能 |
| `3d` | 3D ゲームに必要な機能 |
| `ui` | UI に必要な機能 |

```toml
[dependencies]
bevy = { version = "...", default-features = false, features = ["2d", "ui"] }
```

<pre><code class="tips">バージョンは、cargo add が入れる最新のものを使う。
フィーチャーの名前や構成は、バージョンで変わるため、Cargo のフィーチャーの一覧は、docs.rs の bevy のページで確認する。</code></pre>

### 開発中のビルドを速くする

Bevy は、依存関係が大きく、最適化なしでは、実行が遅い。`Cargo.toml` に、次の設定を入れておくと、開発が快適になる。

```toml
# 自分のコードは、最小限の最適化 (ビルドを速く保つ)
[profile.dev]
opt-level = 1

# 依存するライブラリ (Bevy など) は、最大限に最適化する
[profile.dev.package."*"]
opt-level = 3
```

| 方法 | 内容 |
| --- | --- |
| `opt-level` の設定 | 上の設定。デバッグビルドでも、動作が重くなりすぎない |
| `bevy/dynamic_linking` | Bevy を、動的にリンクして、再ビルドを速くする (`cargo run --features bevy/dynamic_linking`)。配布のビルドでは、使わない |
| 速いリンカー | `lld`、`mold` などを使う |

### OS ごとの準備

| OS | 準備 |
| --- | --- |
| Windows | 追加の準備は、ほとんど不要 (C++ Build Tools は必要) |
| macOS | Xcode Command Line Tools |
| Linux | オーディオ、ウィンドウ、入力のための、開発用パッケージ (ALSA、udev、X11 / Wayland など)。ディストリビューションごとに違う |

Linux の依存パッケージは、公式の「Linux Dependencies」のページで、最新を確認する。

### 最初のアプリ

```rust
use bevy::prelude::*;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .run();
}
```

```bash
cargo run
```

ウィンドウが、開く。`DefaultPlugins` が、ウィンドウ、入力、レンダリング、オーディオ、アセットなど、ゲームに必要な機能を、すべて追加する。

---

## 基本 (ECS) <a id="basic" data-name="基本(ECS)"></a>

### ECS とは

| 用語 | 内容 | 例 |
| --- | --- | --- |
| Entity (エンティティ) | ゲームの中の「もの」を表す ID。それ自体は、データを持たない | プレイヤー、敵、弾 |
| Component (コンポーネント) | エンティティに付ける、データ | 位置、体力、スプライト |
| System (システム) | コンポーネントを読み書きする、処理 (通常の Rust の関数) | 移動、衝突判定、描画 |
| Resource (リソース) | ゲーム全体で、1つだけ持つデータ | スコア、設定、時間 |
| World (ワールド) | すべてのエンティティ、コンポーネント、リソースを保持する場所 | |
| App (アプリ) | ワールドとシステムを、まとめて動かす | |

エンティティを、データベースの「行」、コンポーネントを「列」と考えると、分かりやすい。**エンティティは、「どのコンポーネントを持っているか」だけで、種類が決まる**。

### 最初のシステム

システムは、**通常の Rust の関数**。引数に、Bevy が提供する型 (システムパラメータ) を書くと、自動で渡される。

```rust
use bevy::prelude::*;

fn hello_world() {
    println!("hello world!");
}

fn main() {
    App::new()
        .add_systems(Update, hello_world)
        .run();
}
```

`add_systems` で、システムを、スケジュール (`Update` など) に登録する。

### コンポーネントとクエリ

```rust
use bevy::prelude::*;

#[derive(Component)]
struct Person;

#[derive(Component)]
struct Name(String);

// 起動時に、1回だけ実行する (Startup)
fn add_people(mut commands: Commands) {
    commands.spawn((Person, Name("Elaina Proctor".to_string())));
    commands.spawn((Person, Name("Renzo Hume".to_string())));
    commands.spawn((Person, Name("Zayna Nieves".to_string())));
}

// Person と Name の、両方を持つエンティティを、検索する
fn greet_people(query: Query<&Name, With<Person>>) {
    for name in &query {
        println!("hello {}!", name.0);
    }
}

fn main() {
    App::new()
        .add_systems(Startup, add_people)
        .add_systems(Update, greet_people)
        .run();
}
```

| 要素 | 内容 |
| --- | --- |
| `#[derive(Component)]` | その型を、コンポーネントにする |
| `Commands` | エンティティの作成、削除や、コンポーネントの追加などの、命令を溜める |
| `commands.spawn((A, B))` | コンポーネントの組を持つ、新しいエンティティを作る |
| `Query<&Name, With<Person>>` | `Name` を読み取りで取得する。`Person` を持つエンティティだけに絞る |

### システムの実行順序

システムは、**既定では、並列に実行され、順序は保証されない**。順序が必要なときは、`chain` や `before` / `after` で、指定する。

```rust
App::new()
    .add_systems(Startup, add_people)
    .add_systems(
        Update,
        (
            hello_world,                          // 順序は、どうでもよい (並列に実行される)
            (update_people, greet_people).chain(), // この順に、実行する
        ),
    )
    .run();
```

### 主なシステムパラメータ

| パラメータ | 内容 |
| --- | --- |
| `Commands` | エンティティやコンポーネントの変更を、予約する |
| `Query<D, F>` | コンポーネントを検索する |
| `Res<T>` / `ResMut<T>` | リソースを、読む / 書く |
| `Local<T>` | そのシステムだけが持つ、状態 |
| `Single<D, F>` | ちょうど1つのエンティティだけを、取得する (0個または2個以上のときは、システムが、実行されない) |
| `Populated<D, F>` | 1つ以上のエンティティを、取得する (0個のときは、実行されない) |
| `MessageReader<T>` / `MessageWriter<T>` | メッセージを、読む / 書く |
| `Res<Time>` | 経過時間 |
| `Res<ButtonInput<KeyCode>>` | キーボードの入力 |
| `Res<AssetServer>` | アセットの読み込み |

---

## コンポーネントとリソース <a id="component" data-name="コンポーネントとリソース"></a>

### コンポーネントの定義

```rust
// 目印だけのコンポーネント (マーカー)
#[derive(Component)]
struct Enemy;

// 値を持つコンポーネント
#[derive(Component)]
struct Health(f32);

// フィールドを持つコンポーネント
#[derive(Component, Default)]
struct Position {
    x: i32,
    y: i32,
}

// enum も、コンポーネントにできる
#[derive(Component, Default)]
enum Ship {
    Destroyer,
    Frigate,
    #[default]
    Scout,
}
```

<pre><code class="tips">コンポーネントは、小さく、1つの役割に絞る。「Player という巨大な構造体」ではなく、Player (目印)、Health、Speed、Inventory のように、分けると、システムが、必要な部分だけを、取得できる。</code></pre>

### 必須コンポーネント (#[require])

あるコンポーネントを付けたときに、**自動で、他のコンポーネントも付ける**。

```rust
#[derive(Component)]
#[require(Position, Ship)] // Player を付けると、Position と Ship も付く (Default の値で)
struct Player;

fn spawn_player(mut commands: Commands) {
    commands.spawn(Player); // Position と Ship も、一緒に追加される
}
```

- 同じコンポーネントを、自分で指定すれば、その値が優先される。
- 必須コンポーネントは、再帰的に追加される。
- 以前の Bundle (`SpriteBundle` など) の代わりに、この仕組みが使われる。

### ライフサイクルフック

コンポーネントが、追加・削除されたときに、必ず実行したい処理を、フックとして付けられる。

| 属性 | タイミング |
| --- | --- |
| `#[component(on_add = 関数)]` | 追加されたとき |
| `#[component(on_insert = 関数)]` | 挿入されたとき |
| `#[component(on_discard = 関数)]` | 値が捨てられるとき |
| `#[component(on_remove = 関数)]` | 取り除かれるとき |
| `#[component(on_despawn = 関数)]` | エンティティが、削除されるとき |

```rust
use bevy::ecs::lifecycle::HookContext;
use bevy::ecs::world::DeferredWorld;

#[derive(Component, Default)]
#[component(on_add = on_ship_added)]
struct Ship;

fn on_ship_added(mut world: DeferredWorld, context: HookContext) {
    world
        .commands()
        .entity(context.entity)
        .insert(Position { x: 0, y: 0 });
}
```

### リソース

ゲーム全体で、1つだけ持つデータは、**リソース**にする。

```rust
#[derive(Resource)]
struct Score(usize);

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .insert_resource(Score(0)) // 値を指定して、登録する
        .add_systems(Update, show_score)
        .run();
}

fn show_score(score: Res<Score>) {
    println!("score: {}", score.0);
}

fn add_score(mut score: ResMut<Score>) {
    score.0 += 10;
}
```

| 登録の方法 | 内容 |
| --- | --- |
| `insert_resource(値)` | 指定した値で、登録する |
| `init_resource::<T>()` | `Default` (または `FromWorld`) の値で、登録する |

---

## システムとスケジュール <a id="system" data-name="システムとスケジュール"></a>

### スケジュール

システムは、スケジュール (実行のタイミング) に登録する。

| スケジュール | 実行のタイミング |
| --- | --- |
| `Startup` | 起動時に、1回だけ (`PreStartup`、`PostStartup` もある) |
| `First` | 毎フレームの、最初 |
| `PreUpdate` | `Update` の前 |
| `Update` | 毎フレーム。ゲームのロジックの、大部分は、ここ |
| `PostUpdate` | `Update` の後 (トランスフォームの伝播など) |
| `Last` | 毎フレームの、最後 |
| `FixedUpdate` | 一定の時間ごと (既定では 64Hz)。物理など、フレームレートに依存したくない処理向け |

### コマンドの反映

`Commands` による変更は、**その場では反映されず**、あとの同期ポイント (sync point) で、まとめて適用される。

```rust
fn spawn_and_use(mut commands: Commands) {
    commands.spawn(Player);
    // この時点では、まだ Player は、World に存在しない
}
```

同じシステムの中では、`spawn` したエンティティを、すぐにクエリで取得できない。次のシステムでは、取得できる (システムの間に、同期ポイントが入る)。

### 実行条件 (run_if)

条件を満たすときだけ、システムを実行する。

```rust
App::new()
    .add_systems(Update, jump.run_if(input_just_pressed(KeyCode::Space)))
    .add_systems(Update, play_game.run_if(in_state(AppState::InGame)))
    .add_systems(Update, on_damage.run_if(on_message::<PlayerDamaged>))
```

| 条件 | 内容 |
| --- | --- |
| `in_state(状態)` | その状態のとき |
| `input_just_pressed(キー)` | そのキーが、押された瞬間 |
| `resource_changed::<T>` | リソースが、変更されたとき |
| `on_message::<T>` | メッセージが、届いているとき |
| `on_timer(時間)` | 一定の時間ごと |

### システムのグループ (SystemSet)

```rust
#[derive(SystemSet, Debug, Clone, PartialEq, Eq, Hash)]
enum GameSet {
    Input,
    Movement,
}

App::new()
    .configure_sets(Update, (GameSet::Input, GameSet::Movement).chain())
    .add_systems(Update, read_input.in_set(GameSet::Input))
    .add_systems(Update, move_player.in_set(GameSet::Movement));
```

---

## クエリ <a id="query" data-name="クエリ"></a>

`Query<D, F>` の `D` (取得するデータ) と `F` (絞り込みの条件) を指定して、エンティティのコンポーネントを取得する。

```rust
// Transform を、読み取り専用で。Player を持つエンティティだけ
Query<&Transform, With<Player>>

// Transform を、書き換え可能で。Player かつ Living を持つ
Query<&mut Transform, (With<Player>, With<Living>)>

// 複数のコンポーネントを、タプルで取得する
Query<(&mut Transform, &Speed, &Health)>
```

### データに指定できるもの

| 型 | 内容 |
| --- | --- |
| `&T` / `&mut T` | コンポーネントの参照 |
| `Option<&T>` | あれば取得する (なければ `None`) |
| `Has<T>` | そのコンポーネントを持つかを、`bool` で取得する |
| `Entity` | エンティティの ID |
| `Ref<T>` | 変更の検知の情報つきの、参照 |

### 絞り込みの条件

| 条件 | 内容 |
| --- | --- |
| `With<T>` | `T` を持つエンティティだけ |
| `Without<T>` | `T` を持たないエンティティだけ |
| `Or<(...)>` | いずれかの条件を、満たす |
| `Changed<T>` | 前回の実行から、`T` が変更されたものだけ |
| `Added<T>` | 前回の実行から、`T` が追加されたものだけ |

### 取り出し方

```rust
fn systems(
    mut query: Query<&mut Transform, With<Player>>,
    player: Single<&Transform, With<Player>>,
    entity_ref: Res<PlayerRef>,
) {
    // すべてを、順に処理する
    for mut transform in &mut query {
        transform.translation.x += 1.0;
    }

    // 1つだけあるはずのエンティティ (Single)
    info!("{:?}", player.translation);

    // 特定のエンティティを、ID で取得する
    if let Ok(mut transform) = query.get_mut(entity_ref.0) {
        transform.translation.y += 1.0;
    }
}
```

| メソッド | 内容 |
| --- | --- |
| `iter()` / `iter_mut()` | すべてのエンティティを、順に処理する |
| `get(e)` / `get_mut(e)` | 指定したエンティティを取得する (`Result`) |
| `single()` / `single_mut()` | ちょうど1つのエンティティを取得する (`Result`。1つでなければ `Err`) |
| `par_iter()` | 並列にイテレートする |
| `iter_combinations()` | 要素の組み合わせを、順に処理する (衝突判定など) |

<pre><code class="caution">Single を引数に使うシステムは、条件に合うエンティティが、ちょうど1つでないとき、実行されずにスキップされる (エラーにならず、何も起きない)。
「システムが動かない」ときは、Single の条件に合うエンティティが、存在するか確認する。</code></pre>

### 2つのクエリの競合

同じコンポーネントを、**書き込みで取得するクエリが、2つ以上ある**と、実行時に、パニックする (エラー B0001)。

```rust
// ❌ Transform を、2 つのクエリが、書き込みで取得している
fn bad(mut a: Query<&mut Transform, With<Player>>, mut b: Query<&mut Transform, With<Enemy>>) {}

// ✅ Without で、重ならないことを、明示する
fn good(
    mut a: Query<&mut Transform, (With<Player>, Without<Enemy>)>,
    mut b: Query<&mut Transform, (With<Enemy>, Without<Player>)>,
) {}
```

---

## コマンド <a id="commands" data-name="コマンド"></a>

`Commands` は、エンティティとコンポーネントの変更を、予約する。

```rust
fn setup(mut commands: Commands) {
    // エンティティを作る
    let player = commands.spawn((Player, Health(100.0))).id(); // id() で、ID を取得する

    // 後から、コンポーネントを追加する
    commands.entity(player).insert(Speed(200.0));

    // コンポーネントを、取り除く
    commands.entity(player).remove::<Speed>();

    // エンティティを、削除する
    commands.entity(player).despawn();

    // リソースを、追加する
    commands.insert_resource(Score(0));
}
```

| メソッド | 内容 |
| --- | --- |
| `spawn(bundle)` | エンティティを作る |
| `spawn_empty()` | 空のエンティティを作る |
| `entity(e).insert(...)` | コンポーネントを追加する (すでにあれば、上書きする) |
| `entity(e).remove::<T>()` | コンポーネントを取り除く |
| `entity(e).despawn()` | エンティティを削除する (子も、一緒に削除される) |
| `insert_resource(...)` / `remove_resource::<T>()` | リソースの追加 / 削除 |
| `trigger(event)` | イベントを発行する (後述) |

---

## 状態 (States) <a id="state" data-name="状態"></a>

「メニュー」「プレイ中」「ポーズ」のような、ゲームの状態を、enum で管理する。

```rust
use bevy::prelude::*;

#[derive(States, Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
enum AppState {
    #[default]
    MainMenu,
    InGame,
    Paused,
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .init_state::<AppState>()
        // 状態に入ったとき、出たときに、1回だけ実行する
        .add_systems(OnEnter(AppState::MainMenu), spawn_menu)
        .add_systems(OnExit(AppState::MainMenu), despawn_menu)
        // その状態のあいだだけ、毎フレーム実行する
        .add_systems(Update, play_game.run_if(in_state(AppState::InGame)))
        .add_systems(Update, toggle_pause)
        .run();
}

// 状態を、切り替える
fn toggle_pause(
    input: Res<ButtonInput<KeyCode>>,
    state: Res<State<AppState>>,
    mut next_state: ResMut<NextState<AppState>>,
) {
    if input.just_pressed(KeyCode::Escape) {
        match state.get() {
            AppState::InGame => next_state.set(AppState::Paused),
            AppState::Paused => next_state.set(AppState::InGame),
            _ => {}
        }
    }
}
```

| 要素 | 内容 |
| --- | --- |
| `init_state::<S>()` | 状態を、登録する (`Default` の値が、初期状態) |
| `Res<State<S>>` | 現在の状態 (`state.get()`) |
| `ResMut<NextState<S>>` | 次の状態を、予約する (`next_state.set(...)`)。次のフレームの `StateTransition` で、切り替わる |
| `OnEnter(状態)` / `OnExit(状態)` | 状態に入る / 出る、ときのスケジュール |
| `in_state(状態)` | その状態のときだけ、実行する条件 |

---

## 2D ゲーム <a id="2d" data-name="2Dゲーム"></a>

四角いスプライトを、キー操作で動かす、最小の例。

```rust
use bevy::prelude::*;

#[derive(Component)]
struct Player;

#[derive(Component)]
struct Speed(f32);

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        .add_systems(Update, move_player)
        .run();
}

fn setup(mut commands: Commands) {
    // 2D のカメラ (これがないと、何も表示されない)
    commands.spawn(Camera2d);

    // 青い四角のプレイヤー
    commands.spawn((
        Player,
        Speed(300.0),
        Sprite::from_color(Color::srgb(0.2, 0.6, 1.0), Vec2::splat(50.0)),
        Transform::from_xyz(0.0, 0.0, 0.0),
    ));
}

fn move_player(
    input: Res<ButtonInput<KeyCode>>,
    time: Res<Time>,
    player: Single<(&mut Transform, &Speed), With<Player>>,
) {
    let (mut transform, speed) = player.into_inner();

    let mut direction = Vec2::ZERO;
    if input.pressed(KeyCode::ArrowLeft) {
        direction.x -= 1.0;
    }
    if input.pressed(KeyCode::ArrowRight) {
        direction.x += 1.0;
    }
    if input.pressed(KeyCode::ArrowUp) {
        direction.y += 1.0;
    }
    if input.pressed(KeyCode::ArrowDown) {
        direction.y -= 1.0;
    }

    if direction != Vec2::ZERO {
        // 斜めでも、速さが変わらないように、正規化する。フレーム間の時間をかけて、フレームレートに依存しないようにする
        let delta = direction.normalize() * speed.0 * time.delta_secs();
        transform.translation.x += delta.x;
        transform.translation.y += delta.y;
    }
}
```

### 座標系

| 項目 | 内容 |
| --- | --- |
| 原点 | 画面の中央 (0, 0) |
| X | 右が、プラス |
| Y | **上が、プラス** |
| Z | 画面の手前が、プラス。2D では、描画の順序 (大きいほど手前) を決める |

### スプライト

```rust
// 色つきの四角
Sprite::from_color(Color::srgb(1.0, 0.0, 0.0), Vec2::new(100.0, 50.0))

// 画像 (assets フォルダの、ファイル)
Sprite::from_image(asset_server.load("player.png"))
```

| コンポーネント | 内容 |
| --- | --- |
| `Transform` | 位置 (`translation`)、回転 (`rotation`)、拡大率 (`scale`) |
| `GlobalTransform` | 親の変換を含めた、最終的な位置 (Bevy が、自動で計算する) |
| `Sprite` | 2D の画像、または色の四角 |
| `Text2d` | ゲームの世界の中に、表示するテキスト |

### トランスフォームの操作

```rust
let mut transform = Transform::from_xyz(10.0, 20.0, 0.0);

transform.translation.x += 5.0;                // 移動
transform.rotate_z(std::f32::consts::FRAC_PI_4); // 回転 (ラジアン)
transform.scale = Vec3::splat(2.0);            // 拡大
```

---

## 3D ゲーム <a id="3d" data-name="3Dゲーム"></a>

箱を、回転させて、表示する例。

```rust
use bevy::prelude::*;

#[derive(Component)]
struct Spin;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        .add_systems(Update, spin)
        .run();
}

fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    // 箱 (メッシュと、マテリアル)
    commands.spawn((
        Mesh3d(meshes.add(Cuboid::new(1.0, 1.0, 1.0))),
        MeshMaterial3d(materials.add(Color::srgb(0.8, 0.3, 0.3))),
        Transform::from_xyz(0.0, 0.5, 0.0),
        Spin,
    ));

    // 地面
    commands.spawn((
        Mesh3d(meshes.add(Plane3d::default().mesh().size(10.0, 10.0))),
        MeshMaterial3d(materials.add(Color::srgb(0.3, 0.5, 0.3))),
    ));

    // 光源
    commands.spawn((PointLight::default(), Transform::from_xyz(4.0, 8.0, 4.0)));

    // カメラ (原点を見る)
    commands.spawn((
        Camera3d::default(),
        Transform::from_xyz(-2.5, 4.5, 9.0).looking_at(Vec3::ZERO, Vec3::Y),
    ));
}

fn spin(time: Res<Time>, mut query: Query<&mut Transform, With<Spin>>) {
    for mut transform in &mut query {
        transform.rotate_y(time.delta_secs());
    }
}
```

| コンポーネント | 内容 |
| --- | --- |
| `Mesh3d(Handle<Mesh>)` | 3D の形状 |
| `MeshMaterial3d(Handle<StandardMaterial>)` | 表面の見た目 (色、質感) |
| `Camera3d` | 3D のカメラ |
| `PointLight` / `DirectionalLight` / `SpotLight` | 点光源 / 平行光源 / スポットライト |

<pre><code class="tips">メッシュとマテリアルは、アセットとして、Assets&lt;Mesh&gt; と Assets&lt;StandardMaterial&gt; に登録して、ハンドル (Handle) を、コンポーネントに持たせる。
同じメッシュのハンドルを clone して、複数のエンティティで共有できる。</code></pre>

<pre><code class="caution">3D では、右手座標系 (Y が上、手前が +Z、前方が -Z) が使われる。
カメラが原点を向いていない、光源がない、といった理由で、何も見えないことがよくある。</code></pre>

---

## アセット <a id="asset" data-name="アセット"></a>

画像、音、フォント、3D モデルなどの、外部のファイルは、`AssetServer` で読み込む。

```rust
fn load_assets(mut commands: Commands, asset_server: Res<AssetServer>) {
    // 読み込みは、背景で行われる (すぐに戻る)。ハンドルだけが、返る
    let image: Handle<Image> = asset_server.load("textures/player.png");

    commands.spawn((Sprite::from_image(image), Transform::default()));
}
```

| 項目 | 内容 |
| --- | --- |
| 置き場所 | プロジェクト直下の `assets/` フォルダ (`asset_server.load("textures/player.png")` は `assets/textures/player.png`) |
| ハンドル (`Handle<T>`) | アセットへの参照。読み込みが終わる前から、使える |
| 非同期 | 読み込みは、バックグラウンドで行われる。終わる前は、画像などが表示されない |
| 共有 | 同じパスを、何度 `load` しても、1回だけ読み込まれる |
| ホットリロード | ファイルを変更すると、実行中に、反映できる (`file_watcher` フィーチャー) |

```rust
// 読み込みの状態を、確認する
fn check(asset_server: Res<AssetServer>, handle: Res<PlayerImage>) {
    if asset_server.is_loaded_with_dependencies(&handle.0) {
        info!("読み込み済み");
    }
}
```

<pre><code class="caution">アセットのパスは、assets フォルダからの、相対パスで指定する。
cargo run で実行するときは、プロジェクトのフォルダの assets が読まれる。実行ファイルを単体で配布するときは、実行ファイルの隣に、assets フォルダを置く必要がある。
glTF (.glb) のシーンの読み込みの API は、0.19 の bevy_scene の改名の影響を受けているため、使っているバージョンのドキュメントを確認する。</code></pre>

---

## メッセージとイベント <a id="message" data-name="メッセージとイベント"></a>

システム同士が、通信する仕組みは、2種類ある。

| | メッセージ (Message) | イベント (Event) |
| --- | --- | --- |
| 用途 | システム間の通信 | 起きたことへの、反応 (オブザーバー) |
| 発行 | `MessageWriter::write` | `commands.trigger(...)` |
| 受け取り | `MessageReader::read` (システム) | `On<E>` を受け取る、オブザーバー |
| 頻度 | 頻繁なもの向け | 頻繁でないもの向け |
| 処理 | 溜まった複数を、まとめて処理できる | 1つずつ、すぐに処理される |
| 遅延 | 最大1フレーム | `commands.trigger` は、次の同期ポイント |
| 伝播 | なし | 階層を、バブリングできる (`EntityEvent`) |

### メッセージ

```rust
use bevy::prelude::*;

#[derive(Message)]
struct PlayerDamaged {
    entity: Entity,
    damage: f32,
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_message::<PlayerDamaged>() // メッセージを、登録する
        .add_systems(Update, (deal_damage, apply_damage).chain())
        .run();
}

// 送る側
fn deal_damage(mut writer: MessageWriter<PlayerDamaged>, query: Query<Entity, With<Player>>) {
    for entity in &query {
        writer.write(PlayerDamaged { entity, damage: 10.0 });
    }
}

// 受け取る側
fn apply_damage(mut reader: MessageReader<PlayerDamaged>, mut query: Query<&mut Health>) {
    for message in reader.read() {
        if let Ok(mut health) = query.get_mut(message.entity) {
            health.0 -= message.damage;
        }
    }
}
```

<pre><code class="caution">メッセージは、2回の更新のうちに、読まれないと、黙って捨てられる。
受け取るシステムは、送るシステムと、同じか、その直後の、スケジュールで実行されるようにする。
古い記事の EventReader / EventWriter / add_event は、現在は MessageReader / MessageWriter / add_message に、置き換わっている。</code></pre>

### イベントとオブザーバー

イベントは、`trigger` で発行して、オブザーバー (`On<E>` を第1引数に取る関数) が、**その場で反応**する。

```rust
#[derive(Event)]
struct GameOver {
    score: u32,
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_observer(on_game_over) // グローバルなオブザーバーを登録する
        .run();
}

fn on_game_over(event: On<GameOver>) {
    println!("ゲームオーバー: スコア {}", event.score);
}

fn finish(mut commands: Commands) {
    commands.trigger(GameOver { score: 100 });
}
```

### エンティティのイベント

特定のエンティティに対する、イベントは、`EntityEvent` を使う。

```rust
#[derive(EntityEvent)]
struct Hit {
    #[event_target]
    entity: Entity,
    damage: f32,
}

fn spawn_enemy(mut commands: Commands) {
    commands
        .spawn((Enemy, Health(30.0)))
        .observe(|event: On<Hit>, mut query: Query<&mut Health>| {
            if let Ok(mut health) = query.get_mut(event.entity) {
                health.0 -= event.damage;
            }
        });
}
```

コンポーネントの追加などの、組み込みのライフサイクルイベントも、オブザーバーで受け取れる。

```rust
// Enemy が追加されたとき
fn on_enemy_added(event: On<Add<Enemy>>, query: Query<&Position>) {
    if let Ok(position) = query.get(event.entity) {
        println!("敵が現れた: {:?}", position.x);
    }
}
```

---

## 階層 (親子関係) <a id="hierarchy" data-name="階層"></a>

エンティティは、親子関係を持てる。親の `Transform` と `Visibility` は、子に、引き継がれる。

| コンポーネント | 内容 |
| --- | --- |
| `ChildOf` | 子に付ける。親のエンティティを指す |
| `Children` | 親に付ける。子の一覧 (Bevy が、自動で同期する) |

```rust
fn spawn_ship(mut commands: Commands) {
    // children! マクロで、子を指定する
    commands.spawn((
        Ship,
        Transform::from_xyz(0.0, 0.0, 0.0),
        children![
            (Turret, Transform::from_xyz(10.0, 0.0, 0.0)),
            (Turret, Transform::from_xyz(-10.0, 0.0, 0.0)),
        ],
    ));
}
```

```rust
// with_children を使う書き方
commands.spawn(Ship).with_children(|parent| {
    parent.spawn(Turret);
    parent.spawn(Turret);
});

// 子から、親を指定する書き方
let ship = commands.spawn(Ship).id();
commands.spawn((Turret, ChildOf(ship)));
```

<pre><code class="tips">親を despawn すると、すべての子と子孫も、自動で一緒に削除される。
子だけを残したいときは、先に、detach_children などで、親子関係を外す。
子の Transform は、親からの相対位置になる。</code></pre>

親子関係は、「リレーションシップ」の仕組みで実装されていて、`#[relationship]` を使って、独自の関係 (「砲台が、船に取り付けられている」など) も定義できる。

---

## 入力 <a id="input" data-name="入力"></a>

| 型 | 内容 |
| --- | --- |
| `ButtonInput<KeyCode>` | キーボード |
| `ButtonInput<MouseButton>` | マウスのボタン |
| `Gamepad` | 接続されたコントローラー (コンポーネントとして、エンティティに付く) |
| `MessageReader<KeyboardInput>` | キー入力のメッセージ (すべての入力を、順に取得する) |
| `Touches` | タッチ |

`ButtonInput` のメソッド。

| メソッド | 内容 |
| --- | --- |
| `pressed(key)` | 押されている間、`true` |
| `just_pressed(key)` | 押された**フレーム**だけ、`true` |
| `just_released(key)` | 離された**フレーム**だけ、`true` |
| `any_pressed([...])` | いずれかが、押されている |

```rust
fn input_system(
    keys: Res<ButtonInput<KeyCode>>,
    mouse: Res<ButtonInput<MouseButton>>,
) {
    if keys.just_pressed(KeyCode::Space) {
        info!("ジャンプ!");
    }

    // Ctrl + Shift + A
    let shift = keys.any_pressed([KeyCode::ShiftLeft, KeyCode::ShiftRight]);
    let ctrl = keys.any_pressed([KeyCode::ControlLeft, KeyCode::ControlRight]);
    if ctrl && shift && keys.just_pressed(KeyCode::KeyA) {
        info!("特殊技!");
    }

    if mouse.just_pressed(MouseButton::Left) {
        info!("クリック");
    }
}
```

<pre><code class="caution">キーの操作を「移動」のように、継続するものは pressed、「ジャンプ」のように、1回だけ実行するものは just_pressed を使う。
just_pressed を FixedUpdate の中で使うと、押した瞬間を、取り逃がすことがある (FixedUpdate は、フレームごとに、実行されないため)。入力は、Update で読む。</code></pre>

---

## 時間とタイマー <a id="time" data-name="時間とタイマー"></a>

### Time

```rust
fn time_passed(time: Res<Time>) {
    info!("前のフレームからの時間: {:?}", time.delta());
    info!("秒: {}", time.delta_secs());
    info!("起動してからの時間: {:?}", time.elapsed());
}
```

| 型 | 内容 |
| --- | --- |
| `Res<Time>` | 通常は、ゲームの時間 (一時停止や、速度の変更の影響を受ける)。`FixedUpdate` の中では、固定の間隔の時間になる |
| `Res<Time<Real>>` | 現実の時間 (一時停止の影響を受けない) |
| `Res<Time<Fixed>>` | 固定の時間間隔 |

<pre><code class="tips">移動や回転などの量には、time.delta_secs() をかけて、フレームレートに依存しないようにする。
(古い記事の time.delta_seconds() は、delta_secs() に改名されている。)</code></pre>

### Timer

Timer は、0 から、指定した時間まで、**増えていく**。

| モード | 内容 |
| --- | --- |
| `TimerMode::Once` | 終わったら、そのまま。リセットするまで、終了の状態 |
| `TimerMode::Repeating` | 終わったら、自動でリセットして、繰り返す |

```rust
#[derive(Resource)]
struct SpawnTimer(Timer);

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        // 2 秒ごとに、繰り返すタイマー
        .insert_resource(SpawnTimer(Timer::from_seconds(2.0, TimerMode::Repeating)))
        .add_systems(Update, spawn_enemies)
        .run();
}

fn spawn_enemies(
    time: Res<Time>,
    mut timer: ResMut<SpawnTimer>,
    mut commands: Commands,
) {
    // 毎フレーム、経過した時間を足す
    timer.0.tick(time.delta());

    // 時間が経ったフレームだけ、true
    if timer.0.just_finished() {
        commands.spawn(Enemy);
    }
}
```

| メソッド | 内容 |
| --- | --- |
| `tick(delta)` | 時間を進める |
| `is_finished()` | 終了したか (`Once` では、終了後も `true` のまま) |
| `just_finished()` | 今回の `tick` で、終了したか |
| `reset()` | 最初に戻す |
| `fraction()` | 進行の割合 (0.0〜1.0) |
| `pause()` / `unpause()` | 一時停止 / 再開 |

<pre><code class="caution">Timer::default() は、長さ 0 のタイマーになる。Local&lt;Timer&gt; のように、Default で作られる場所では、期待した長さにならない。
Timer をリソースやコンポーネントに入れて、from_seconds で作る。</code></pre>

### 固定の時間間隔 (FixedUpdate)

物理計算などの、フレームレートに依存しない処理は、`FixedUpdate` に登録する。

```rust
App::new()
    .insert_resource(Time::<Fixed>::from_hz(30.0)) // 30 回 / 秒
    .add_systems(FixedUpdate, physics_step)
```

---

## UI <a id="ui" data-name="UI"></a>

Bevy の UI も、ECS で作る。画面は、`Node` コンポーネントを持つエンティティの、階層で表現し、レイアウトは、Flexbox または CSS Grid で行う。

### テキストを表示する

```rust
#[derive(Component)]
struct ScoreText;

fn setup_ui(mut commands: Commands) {
    commands.spawn(Camera2d);

    commands.spawn((
        ScoreText,
        Text::new("Score: 0"),
        Node {
            position_type: PositionType::Absolute, // 画面の中で、位置を直接指定する
            top: Val::Px(12.0),
            left: Val::Px(12.0),
            ..default()
        },
    ));
}

// スコアが変わったら、テキストを更新する
fn update_score_text(score: Res<Score>, mut text: Single<&mut Text, With<ScoreText>>) {
    if score.is_changed() {
        text.0 = format!("Score: {}", score.0);
    }
}
```

### レイアウト

`Node` の、主なフィールド。

| フィールド | 内容 |
| --- | --- |
| `width` / `height` | 幅と高さ (`Val::Px(200.0)`、`Val::Percent(50.0)` など) |
| `flex_direction` | 並べる方向 (`FlexDirection::Row` / `Column`) |
| `justify_content` | 主軸の配置 (`JustifyContent::Center` など) |
| `align_items` | 交差軸の配置 |
| `margin` / `padding` / `border` | 余白と枠線 (`UiRect::all(Val::Px(8.0))`) |
| `position_type` | `Relative` (既定) か `Absolute` |
| `row_gap` / `column_gap` | 要素の間隔 |

| `Val` | 内容 |
| --- | --- |
| `Val::Px(n)` | ピクセル |
| `Val::Percent(n)` | 親に対する割合 |
| `Val::Vw(n)` / `Val::Vh(n)` | 画面の幅 / 高さに対する割合 |
| `Val::Auto` | 自動 |

```rust
fn spawn_menu(mut commands: Commands) {
    // 画面全体を覆う、コンテナ (中央寄せ)
    commands.spawn((
        Node {
            width: Val::Percent(100.0),
            height: Val::Percent(100.0),
            justify_content: JustifyContent::Center,
            align_items: AlignItems::Center,
            flex_direction: FlexDirection::Column,
            row_gap: Val::Px(12.0),
            ..default()
        },
        children![
            Text::new("My Game"),
            (
                Button,
                Node {
                    width: Val::Px(200.0),
                    height: Val::Px(50.0),
                    justify_content: JustifyContent::Center,
                    align_items: AlignItems::Center,
                    ..default()
                },
                BackgroundColor(Color::srgb(0.25, 0.25, 0.25)),
                children![Text::new("Start")],
            ),
        ],
    ));
}
```

### ボタンの操作

ボタンの、ホバーや押下は、ピッキング (後述) の仕組みで、検知する。

| コンポーネント | 内容 |
| --- | --- |
| `Hovered` | ポインターが、重なっているか (`hovered.get()`) |
| `Pressed` | 押されている間、付く |

```rust
fn button_system(
    mut buttons: Query<(&Hovered, Has<Pressed>, &mut BackgroundColor), With<Button>>,
) {
    for (hovered, pressed, mut color) in &mut buttons {
        *color = match (hovered.get(), pressed) {
            (_, true) => Color::srgb(0.35, 0.75, 0.35).into(),
            (true, false) => Color::srgb(0.35, 0.35, 0.35).into(),
            (false, false) => Color::srgb(0.25, 0.25, 0.25).into(),
        };
    }
}
```

<pre><code class="caution">古い記事にある Interaction コンポーネントは、非推奨になっている。新しいコードでは、Hovered と Pressed、またはピッキングのイベントを使う。
UI のウィジェット (ボタン、チェックボックス、スライダー、テキスト入力など) は、bevy_ui_widgets として提供されている。大きな、スタイル付きのウィジェットのセット (bevy_feathers) は、別のフィーチャーが必要。</code></pre>

---

## ピッキング <a id="picking" data-name="ピッキング"></a>

マウスやタッチで、エンティティを、クリックやドラッグする機能。`DefaultPlugins` に、含まれている。

| 要素 | 内容 |
| --- | --- |
| UI | 標準で、ピッキングの対象になる |
| スプライト | `Pickable` コンポーネントを付けると、対象になる |
| 3D のメッシュ | `MeshPickingPlugin` を、追加する |
| 対象から外す | `Pickable::IGNORE` |

クリックやドラッグなどの操作は、イベントとして発行されるため、オブザーバーで、反応する。

```rust
commands
    .spawn((
        Sprite::from_color(Color::srgb(1.0, 0.5, 0.0), Vec2::splat(80.0)),
        Pickable::default(),
    ))
    .observe(|_: On<PointerClick>| {
        info!("クリックされた!");
    });
```

ポインターのイベントの主なもの: `PointerPress`、`PointerRelease`、`PointerClick`、`PointerOver`、`PointerOut`、`PointerDragStart`、`PointerDrag`、`PointerDragEnd`。

---

## オーディオ <a id="audio" data-name="オーディオ"></a>

`AudioPlayer` を、エンティティに付けると、再生が始まる。

```rust
fn play_music(mut commands: Commands, asset_server: Res<AssetServer>) {
    // BGM をループ再生する
    commands.spawn((
        AudioPlayer::new(asset_server.load("music/bgm.ogg")),
        PlaybackSettings::LOOP,
    ));
}

fn play_effect(mut commands: Commands, asset_server: Res<AssetServer>) {
    // 効果音を、1回だけ再生して、エンティティを削除する
    commands.spawn((
        AudioPlayer::new(asset_server.load("sounds/jump.ogg")),
        PlaybackSettings::DESPAWN,
    ));
}
```

| 項目 | 内容 |
| --- | --- |
| 対応形式 | `wav`、`ogg`、`flac`、`mp3` |
| `PlaybackSettings::ONCE` | 1回だけ再生する |
| `PlaybackSettings::LOOP` | ループ再生する |
| `PlaybackSettings::DESPAWN` | 1回再生して、エンティティを削除する |
| `PlaybackSettings::REMOVE` | 1回再生して、オーディオのコンポーネントだけを取り除く |
| `AudioSink` | 再生の制御 (`pause`、`play`、`set_volume`、`toggle_playback` など)。再生が始まると、自動で付く |
| `GlobalVolume` | 全体の音量のリソース |

<pre><code class="tips">GlobalVolume や PlaybackSettings を変更しても、すでに再生中の音には、反映されない (音の再生が始まるときに、値が使われるため)。
再生中の音量は、AudioSink の set_volume で変更する。</code></pre>

---

## プラグイン <a id="plugin" data-name="プラグイン"></a>

ゲームの機能を、プラグインとして分けると、コードが整理できる。Bevy の機能自体も、すべてプラグインで提供されている。

### 関数でプラグインを作る

```rust
// src/player.rs
use bevy::prelude::*;

pub fn plugin(app: &mut App) {
    app.add_systems(Startup, spawn_player)
        .add_systems(Update, move_player);
}

fn spawn_player(mut commands: Commands) { /* ... */ }
fn move_player() { /* ... */ }
```

```rust
// src/main.rs
mod player;

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_plugins(player::plugin)
        .run();
}
```

### Plugin トレイトを実装する

```rust
pub struct PlayerPlugin;

impl Plugin for PlayerPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, spawn_player)
            .add_systems(Update, move_player);
    }
}
```

| 方法 | 内容 |
| --- | --- |
| 関数 (`fn plugin(app: &mut App)`) | 簡単な場合。設定を持たない |
| `Plugin` トレイト | 設定 (フィールド) を持たせたいとき、`finish` などのライフサイクルを使いたいとき |
| `add_plugins((A, B, C))` | 複数のプラグインを、まとめて追加する |

### DefaultPlugins の設定

```rust
App::new()
    .add_plugins(DefaultPlugins.set(WindowPlugin {
        primary_window: Some(Window {
            title: "My Game".into(),
            ..default()
        }),
        ..default()
    }))
    .run();
```

### 主な DefaultPlugins

| プラグイン | 内容 |
| --- | --- |
| `WindowPlugin` / `WinitPlugin` | ウィンドウ |
| `InputPlugin` | キーボードとマウス |
| `TimePlugin` | 時間 |
| `TransformPlugin` | `Transform` の伝播 |
| `RenderPlugin` / `CorePipelinePlugin` | 描画 (wgpu) |
| `SpritePlugin` | スプライト |
| `PbrPlugin` | 3D の物理ベースレンダリング |
| `UiPlugin` | UI |
| `TextPlugin` | テキストとフォント |
| `AssetPlugin` | アセット |
| `AudioPlugin` | オーディオ |
| `StatesPlugin` | 状態 |
| `LogPlugin` | ログ |
| `DefaultPickingPlugins` | ピッキング |
| `GilrsPlugin` | ゲームパッド |

### ファイルの構成の例

```text
my_game/
├── Cargo.toml
├── assets/
│   ├── textures/
│   └── sounds/
└── src/
    ├── main.rs         # App の組み立て
    ├── player.rs       # プレイヤーのプラグイン
    ├── enemy.rs        # 敵のプラグイン
    ├── ui.rs           # UI のプラグイン
    └── state.rs        # 状態の定義
```

---

## シーンと BSN <a id="scene" data-name="シーンとBSN"></a>

### BSN (Bevy Scene Notation)

0.19 で一部が導入された、**シーンを、コードの中に、宣言的に書く**ための記法。`bsn!` マクロを使う。

```rust
#[derive(Component, Clone, Default)]
struct Ship;

#[derive(Component, Clone, Default)]
struct Player {
    score: usize,
}

fn spawn_scene(mut commands: Commands) {
    commands.spawn_scene(bsn! {
        Player
        Ship
    });
}
```

シーンを返す関数を作って、組み合わせられる。

```rust
fn button() -> impl Scene {
    bsn! {
        Button
        Node { width: px(100) }
    }
}

fn my_button() -> impl Scene {
    bsn! {
        @button()               // 別のシーンを参照するときは、@ を付ける (0.20 で必須になった)
        Node { height: px(100) } // 同じコンポーネントは、フィールドごとに合成される
    }
}
```

| 記法 | 内容 |
| --- | --- |
| `bsn! { ... }` | 1つのルートエンティティを表す、シーン |
| `bsn_list! { ... }` | 複数のエンティティの、並び |
| `@名前` / `@関数()` / `@{式}` | 他のシーンの参照 (0.20 から、`@` が必要) |
| `Children [ A -- B ]` | 子のエンティティ。`--` で区切る |
| `#名前` | `Name` の指定と、同じシーン内での参照 |
| `on(...)` | エンティティに、オブザーバーを付ける |

<pre><code class="caution">BSN は、0.19 で導入されたばかりで、0.20 でも構文が変わった (シーンの参照に @ が必要になった)。今後も変わる可能性が高い。
使うバージョンの、公式のリリースノートと移行ガイドで、確認する。</code></pre>

### ワールドのシリアライズ

エンティティとコンポーネントの全体を、ファイルに保存・読み込みする仕組み。**旧 `bevy_scene` が、0.19 で `bevy_world_serialization` に改名**された (BSN のために、名前が空けられた)。

| 旧 | 新 |
| --- | --- |
| `bevy_scene` (保存・読み込み) | `bevy_world_serialization` |
| `DynamicScene` | `DynamicWorld` |
| `DynamicSceneRoot` | `DynamicWorldRoot` |

```rust
// ファイルから、ワールドを読み込む
fn load_world(mut commands: Commands, asset_server: Res<AssetServer>) {
    commands.spawn(DynamicWorldRoot(asset_server.load("scene.scn.ron")));
}
```

---

## 物理 <a id="physics" data-name="物理"></a>

Bevy には、物理エンジンが、標準では含まれない。コミュニティの crate を使う。

| crate | 内容 |
| --- | --- |
| `avian` (`avian2d` / `avian3d`) | Bevy の ECS に、ネイティブに作られた物理エンジン |
| `bevy_rapier` | Rapier (Rust の物理エンジン) の、Bevy 用の連携 |

### Avian の例

```rust
use avian2d::prelude::*;
use bevy::prelude::*;

fn setup(mut commands: Commands) {
    // 動く物体 (重力や力の影響を受ける)
    commands.spawn((
        RigidBody::Dynamic,
        Collider::circle(0.5),
        LinearVelocity(Vec2::new(0.0, 0.0)),
        Transform::from_xyz(0.0, 5.0, 0.0),
    ));

    // 動かない地面
    commands.spawn((
        RigidBody::Static,
        Collider::rectangle(20.0, 1.0),
        Transform::from_xyz(0.0, -3.0, 0.0),
    ));
}
```

| コンポーネント | 内容 |
| --- | --- |
| `RigidBody::Dynamic` | 力と衝突の影響を受ける物体 |
| `RigidBody::Kinematic` | コードからだけ動かす物体 (プレイヤーの操作、動く床) |
| `RigidBody::Static` | 動かない物体 (地面、壁) |
| `Collider` | 衝突の形状 |
| `LinearVelocity` | 速度 |
| `Mass` | 質量 (指定しないと、コライダーの大きさから決まる) |
| `Sensor` | 衝突を検知するだけで、物理的には影響しない領域 |

衝突は、メッセージ (`CollisionStart`) として読むか、`CollisionEventsEnabled` を付けたエンティティの、オブザーバーで受け取る。

<pre><code class="caution">Avian や bevy_rapier などの crate は、対応する Bevy のバージョンが決まっている。Bevy を更新するときは、これらの crate の、対応するバージョンも合わせる。
バージョンが食い違うと、型が一致せずに、エラーになる (cargo tree -d で、Bevy が、複数のバージョン入っていないかを確認できる)。</code></pre>

---

## デバッグと最適化 <a id="debug" data-name="デバッグと最適化"></a>

### ログ

```rust
info!("メッセージ");
warn!("警告");
error!("エラー");
debug!("デバッグ");
```

```bash
RUST_LOG=info,my_game=debug cargo run   # ログのレベルを、環境変数で指定する
```

### 調べる道具

| 道具 | 内容 |
| --- | --- |
| `FrameTimeDiagnosticsPlugin` など | FPS やフレーム時間の、診断 |
| Gizmos | 線や図形を、その場で描いて、デバッグする (`Gizmos` システムパラメータ) |
| `bevy_inspector_egui` | ワールドのエンティティとコンポーネントを、実行中に、GUI で確認・編集する (コミュニティ製) |
| `bevy_lint` | Bevy の、書き方の問題を検出する、リンター (非公式) |
| Tracy | 詳細なプロファイラー (`trace_tracy` フィーチャー) |

### リリースビルドの最適化

配布するビルドの、設定の例。

```toml
[profile.release]
opt-level = 3
lto = "thin"
codegen-units = 1
```

<pre><code class="tips">開発中の遅さは、多くの場合、最適化なしのビルドが原因。cargo run --release で、実際の速度を確認する。
性能の問題は、エンティティの数、毎フレームの処理の量、クエリの範囲 (Changed や With で、絞る) の順に疑う。</code></pre>

---

## テスト <a id="test" data-name="テスト"></a>

システムは、通常の関数なので、`App` を作って、**ウィンドウなしで**、テストできる。

```rust
use bevy::prelude::*;

#[derive(Component)]
struct Health(i32);

fn apply_damage(mut query: Query<&mut Health>) {
    for mut health in &mut query {
        health.0 -= 1;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn health_decreases() {
        let mut app = App::new();
        app.add_systems(Update, apply_damage);

        // エンティティを、直接 World に作る
        let entity = app.world_mut().spawn(Health(10)).id();

        app.update(); // 1フレーム分、実行する

        assert_eq!(app.world().get::<Health>(entity).unwrap().0, 9);
    }
}
```

| 項目 | 内容 |
| --- | --- |
| `App::new()` | プラグインを追加せずに、最小限の App を作る |
| `app.add_plugins(MinimalPlugins)` | 時間など、最小限の機能が必要なときに追加する |
| `app.world_mut()` | ワールドを直接操作する (`spawn`、`insert_resource` など) |
| `app.update()` | 1フレーム分、システムを実行する |
| `app.world().get::<T>(entity)` | コンポーネントを、取り出して、確認する |

<pre><code class="tips">テストしやすくするため、ロジックを、通常の関数に切り出して、システムは、それを呼ぶだけにすることも有効。
Rust のテストの詳細は、「Rustのテスト」のドキュメントを参照。</code></pre>

---

## ビルドと配布 <a id="build" data-name="ビルドと配布"></a>

| 対象 | 方法 |
| --- | --- |
| Windows / macOS / Linux | `cargo build --release`。実行ファイルと、`assets` フォルダを、一緒に配布する |
| Web (WASM) | `wasm32-unknown-unknown` ターゲットで、ビルドして、`wasm-bindgen` や `trunk` などで、ブラウザ向けにまとめる |
| iOS / Android | 対応しているが、追加の設定 (Xcode、Android SDK など) が必要 |

```bash
rustup target add wasm32-unknown-unknown
cargo build --release --target wasm32-unknown-unknown
```

<pre><code class="caution">Web 向けのビルドでは、ファイルシステムや、スレッドなどに、制限がある。アセットは、HTTP で読み込まれる。
バイナリが大きくなりやすいため、リリースビルドで、サイズの最適化 (opt-level = "s" や "z"、lto) をする。</code></pre>

---

## 古いコードからの変更 <a id="migration" data-name="古いコードからの変更"></a>

古い記事のコードを、読み替えるための、対応表。

| 古い書き方 | 現在 | バージョン |
| --- | --- | --- |
| `Camera2dBundle::default()` | `Camera2d` | 0.15 |
| `SpriteBundle { ... }` | `Sprite` + `Transform` | 0.15 |
| `PbrBundle { mesh, material, .. }` | `Mesh3d` + `MeshMaterial3d` + `Transform` | 0.15 |
| `time.delta_seconds()` | `time.delta_secs()` | 0.15 |
| `Query::get_single()` | `Query::single()` (`Result` を返す) | 0.16 |
| `Parent` コンポーネント | `ChildOf` | 0.16 |
| `Trigger<E>` | `On<E>` | 0.17 |
| `EventReader` / `EventWriter` / `add_event` | `MessageReader` / `MessageWriter` / `add_message` | 0.17 |
| `Interaction` | `Hovered` / `Pressed`、ピッキングのイベント | 0.20 |
| `bevy_scene` (保存・読み込み) | `bevy_world_serialization` | 0.19 |

<pre><code class="tips">バージョンごとの変更は、公式サイト (bevy.org) の「Migration Guides」に、まとまっている。
バージョンを上げるときは、ジャンプせず、1つずつ上げて、そのたびに、移行ガイドを読んで、コンパイルエラーを直す。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| ビルドや起動が、とても遅い | 最適化なしの、デバッグビルド | `[profile.dev]` の `opt-level` を設定する。`bevy/dynamic_linking` を使う。`--release` で確認する |
| 画面に、何も表示されない | カメラがない。2D と 3D のカメラを、取り違えている | `Camera2d` または `Camera3d` を、spawn する |
| スプライトが、見えない | `assets` のパスが違う。Z の値で、隠れている | パスを確認する。`Transform` の Z を、調整する |
| システムが、実行されない | `Single` に合うエンティティが、1つでない。`add_systems` が、書かれていない。`run_if` の条件が、満たされない | 条件と登録を、確認する |
| `spawn` したエンティティが、すぐにクエリに出ない | `Commands` は、同期ポイントで、まとめて適用される | 次のシステムで、使う。または `chain` で順序を指定する |
| 実行時に、`B0001` でパニックする | 同じコンポーネントを、書き込みで取得するクエリが、2つある | `Without` で重ならないようにする。`ParamSet` を使う |
| メッセージを、受け取れない | 2回の更新のうちに、読まれず、捨てられた | 送るシステムの後で、受け取る。`add_message` を忘れていないか確認する |
| 動きの速さが、環境によって違う | フレームごとに、固定の量を動かしている | `time.delta_secs()` を、かける |
| 古い記事のコードが、コンパイルできない | API が、バージョンで変わっている | 「古いコードからの変更」の表。公式の移行ガイド |
| 型が一致しない (Bevy が、複数入っている) | 関連する crate が、別のバージョンの Bevy に依存している | `cargo tree -d` で確認して、対応するバージョンを、揃える |
| 親を動かしたのに、子が動かない (または二重に動く) | 子の `Transform` は、親からの相対位置 | 子の位置は、相対で指定する。絶対位置は、`GlobalTransform` |
| `Local<Timer>` が、すぐに終わる | `Timer::default()` は、長さ 0 | リソースに入れて、`from_seconds` で作る |
| 入力を取り逃がす | `FixedUpdate` の中で、`just_pressed` を使っている | 入力は、`Update` で読む |
| アセットが、読み込まれない | `assets` フォルダの場所が、違う | プロジェクト直下の `assets/`。単体配布のときは、実行ファイルの隣 |

---

## 関連 crate <a id="ecosystem" data-name="関連crate"></a>

| crate | 内容 |
| --- | --- |
| `avian2d` / `avian3d` | 物理エンジン |
| `bevy_rapier2d` / `bevy_rapier3d` | Rapier による物理エンジンの連携 |
| `bevy_egui` / `bevy_inspector_egui` | egui による、デバッグ用の UI と、インスペクター |
| `leafwing-input-manager` | 入力を、アクションに割り当てる |
| `bevy_asset_loader` | アセットの、読み込みの管理 (ローディング画面など) |
| `bevy_kira_audio` | 高機能なオーディオ |
| `bevy_tweening` | アニメーション (補間) |
| `bevy_hanabi` | GPU によるパーティクル |
| `bevy_ecs_tilemap` | タイルマップ |
| `bevy_ecs_ldtk` | LDtk (レベルエディタ) のデータの読み込み |
| `bevy_replicon` / `lightyear` | ネットワーク (マルチプレイヤー) |
| `godot-bevy` | Godot と、Bevy の連携 |
| `bevy_lint` | Bevy 向けのリンター (非公式) |

<pre><code class="tips">コミュニティの crate は、Bevy の新しいバージョンへの対応に、時間がかかることがある。
使いたい crate が、使っている Bevy のバージョンに、対応しているか (README の、互換性の表) を、先に確認する。</code></pre>
