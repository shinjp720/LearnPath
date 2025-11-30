---
title: PyYaml
layout: default
---

# PyYAML <a id="top" data-name="TOP">

pyyamlはpythonでYAMLを読み書きするためのライブラリ。

```python
pip install pyyaml
import yaml
```

<div class="subtitle">YAMLファイルの読み込み</div>



```python
# YAMLファイルの内容をPythonオブジェクトに読み込む
with open('example.yaml', 'r') as f:
    data = yaml.safe_load(f)
    print(data)
```

<div class="subtitle">YAMLファイルへの書き出し</div>

```python
# PythonオブジェクトをYAML形式でファイルに書き込む
data = { 'name': 'John Doe', 'age': 30, 'children': ['Jane', 'Joe'] }
with open('output.yaml', 'w') as file:
    yaml.dump(data, file)
```
