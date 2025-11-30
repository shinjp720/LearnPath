---
title: FastAPI
layout: default
---

# random <a id="top" data-name="TOP">

```python
import random
```

### 要素ごとに出現確率を指定

- elements: 要素をリストで指定する。
- weights: 各要素の重みを指定する。重みの合計が1である必要はなく、相対的な値でいい。
- cum_weights: 累積重みを指定することもできる。
- k: k=1は1回選択することを意味し、複数回選択したい場合はkに回数を指定する。

```python
# 出現する要素
elements = ['A', 'B', 'C']
# 各要素の出現確率 (Aが50%、Bが30%、Cが20%)
weights = [0.5, 0.3, 0.2]
# 1回の選択を行う
result = random.choices(elements, weights=weights, k=1)
print(result[0])
# 複数回の選択を行う場合
results = random.choices(elements, weights=weights, k=10)
print(results)
```
