---
title: rand
layout: default
---

# rand <a id="top" data-name="TOP"></a>

---

## 導入 <a id="introduction" data-name="導入"></a>

Cargo.tomlに追加。

```toml
[dependencies]
rand = "0.10"
```

または cargo add。

```bash
cargo add rand
```

## 実装 <a id="implement" data-name="実装"></a>

### ランダムを複数回使う

rng を1回作って使い回す。

```rust
use rand::Rng;

fn main() {
    let mut rng = rand::rng();

    for _ in 0..5 {
        println!("{}", rng.random_range(1..=6));
    }
}
```

### 指定した範囲のランダム

```rust
use rand::Rng;

fn main() {
    let mut rng = rand::rng();

    // 0～9
    let n = rng.random_range(0..10);

    println!("{n}");
}
```

### 配列・Vec から選ぶ

配列。

```rust
use rand::prelude::IndexedRandom;

fn main() {
    let fruits = ["apple", "banana", "orange"];

    let mut rng = rand::rng();

    if let Some(fruit) = fruits.choose(&mut rng) {
        println!("{fruit}");
    }
}
```

Vec。

```rust
use rand::prelude::IndexedRandom;

fn main() {
    let numbers = vec![10, 20, 30, 40];

    let mut rng = rand::rng();

    println!("{:?}", numbers.choose(&mut rng));
}
```

### シャッフル

```rust
use rand::prelude::SliceRandom;

fn main() {
    let mut cards = vec![1, 2, 3, 4, 5];

    let mut rng = rand::rng();

    cards.shuffle(&mut rng);

    println!("{cards:?}");
}
```

### 浮動小数

```rust
let mut rng = rand::rng();

let x: f64 = rng.random();        // 0.0～1.0未満
let y = rng.random_range(0.0..5.0);
```

