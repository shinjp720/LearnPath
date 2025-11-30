---
title: FastAPI
layout: default
---

# logging <a id="top" data-name="TOP">

- loggingモジュールは、アプリケーションのログを記録するための標準ライブラリで、デバッグやエラーハンドリングに役に立つ。

```python
import logging
```

### ログレベル
- loggingには5つのログレベルがあり、ロガーとハンドラーにそれぞれのレベルを設定することにより、必要に応じて出力先を選べる。

| レベル | 数値 | 説明 |
| --- | --- | --- |
| DEBUG | 10 | デバッグ情報 |
| INFO | 20 | 一般的な情報 |
| WARNING | 30 | 警告(デフォルトの出力レベル) |
| ERROR | 40 | エラー |
| CRITICAL | 50 | 致命的なエラー |

### 基本設定
- ロガーを作成

```python
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG) # DEBUG以上を出力
```

### ハンドラを作成

```python
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.WARNING) # WARNING以上を出力
```

### フォーマッタを作成・設定
```python
formatter = logging.Formatter("%(asctime)s [%(levelname)s] [%(name)s] %(message)s")
console_handler.setFormatter(formatter)
```


#### フォーマットのプレースホルダ一覧

| 種類 | 説明 |
| --- | --- |
| %(asctime)s | ログのタイムスタンプ |
| %(levelname)s | ログレベル |
| %(message)s | ログメッセージ |
| %(filename)s | ファイル名 |
| %(lineno)d | 行番号 |
| %(name)s | ロガーの名前 |

<div class="subtitle">ロガーにハンドラを追加</div>

```python
logger.addHandler(console_handler)
```

<div class="subtitle">ログを出力</div>

```python
logger.debug("デバッグログ")
logger.info("情報ログ")
logger.warning("警告ログ")
logger.error("エラーログ")
logger.critical("致命的エラーログ")
```

<div class="subtitle">ログをファイルに出力する場合</div>

```python
file_handler = logging.FileHandler("app.log", encoding="utf-8")
file_handler.setLevel(logging.INFO) # INFO以上を出力
file_handler.setFormatter(formatter)

logger.addHandler(file_handler)

logger.info("このログはファイルにも出力されます")
```

<div class="subtitle">設定ファイルを使う場合</div>

```python
logging.conf

[loggers]
keys=root,my_logger

[handlers]
keys=consoleHandler,fileHandler

[formatters]
keys=defaultFormatter

[logger_root]
level=WARNING
handlers=consoleHandler

[logger_my_logger]
level=DEBUG
handlers=consoleHandler,fileHandler
qualname=my_logger
propagate=0

[handler_consoleHandler]
class=StreamHandler
level=DEBUG
formatter=defaultFormatter
args=(sys.stdout,)

[handler_fileHandler]
class=FileHandler
level=INFO
formatter=defaultFormatter
args=("app.log", "a", "utf-8")

[formatter_defaultFormatter]
format=%(asctime)s [%(levelname)s] [%(name)s] %(message)s
datefmt=%Y-%m-%d %H:%M:%S
```

```python
# app.py

# logging.confを適用
import logging.config

logging.config.fileConfig("logging.conf")
logger = logging.getLogger("my_logger")

logger.info("設定ファイルから読み込んだロギング")
```