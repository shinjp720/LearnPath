---
title: FastAPI
layout: default
---

# dotenv <a id="top" data-name="TOP">

- .envファイルから環境変数を読み込んで設定するために使用する。
```python
pip install python-dotenv
```

### .envファイルを読み込む

```python
from dotenv import load_dotenv
import os
# .envファイルを読み込む
load_dotenv()
# 環境変数の取得
debug_mode = os.getenv("DEBUG")  # "True"
db_url = os.getenv("DATABASE_URL")  # "mysql://username:password@localhost:3306/mydb"
secret_key = os.getenv("SECRET_KEY")  # "your-secret-key"
print(f"Debug mode: {debug_mode}")
print(f"Database URL: {db_url}")
```

- デフォルトでは既存の環境変数を上書きしないので、上書きする場合はoverride=Trueを指定する。 load_dotenv(override=True)

### 特定の.envファイルを指定する

- 明示的にファイルパスを指定できる。

```python
from dotenv import load_dotenv
load_dotenv(dotenv_path="/path/to/specific.env")
```
