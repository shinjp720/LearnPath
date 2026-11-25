---
title: logging
layout: default
---

# logging <a id="top" data-name="TOP"></a>

`logging` モジュールは、アプリケーションのログを記録するための標準ライブラリで、デバッグやエラーハンドリングに役に立つ。

インストールは不要で、`import` するだけで使える。ログの出力先 (コンソール、ファイル、ネットワークなど)、出力する重要度、書式を、コードの外側から切り替えられる点が、`print()` との大きな違いである。

```python
import logging
```

---

## 概要 <a id="overview" data-name="概要"></a>

### 構成要素

`logging` は、次の部品を組み合わせて動く。

| 要素 | 役割 |
| --- | --- |
| `Logger` | ログを出力する窓口。`logger.info()` などを呼ぶ。名前を持ち、階層構造になる |
| `Handler` | ログの出力先を決める (コンソール、ファイルなど) |
| `Formatter` | ログの書式を決める |
| `Filter` | ログを、条件で絞り込む。`Logger` と `Handler` に付けられる |
| `LogRecord` | 1件のログの情報を持つオブジェクト。`Formatter` が文字列にする |

### ログが出力されるまでの流れ

```text
logger.info("...")
   │
   ▼
Logger ── レベル判定 ──▶ LogRecord を作る
   │
   ├──▶ Handler A ── レベル判定 ──▶ Formatter ──▶ コンソール
   ├──▶ Handler B ── レベル判定 ──▶ Formatter ──▶ ファイル
   │
   ▼ (propagate が True のとき)
親ロガーの Handler にも渡す
```

### print() との比較

| | `print()` | `logging` |
| --- | --- | --- |
| 重要度の区別 | ✕ | ○ |
| 出力先の切り替え | コードの書き換えが必要 | `Handler` の追加・変更で済む |
| 日時、ファイル名などの付加 | 自分で書く | `Formatter` が付ける |
| 出力の ON / OFF | コードの削除やコメントアウト | レベルの設定で切り替える |
| ライブラリのログとの統合 | ✕ | ○ (同じ仕組みに乗る) |

<pre><code class="tips">このドキュメントは、Python 3.14 を前提にしている。新しい機能には、バージョンを明記している。
小さなスクリプトなら basicConfig だけで足りる。アプリケーションが大きくなったら、ロガー、ハンドラ、フォーマッタを分けて設定する。</code></pre>

---

## ログレベル <a id="levels" data-name="ログレベル"></a>

- `logging` には5つのログレベルがあり、ロガーとハンドラーにそれぞれのレベルを設定することにより、必要に応じて出力先を選べる。

| レベル | 数値 | 説明 |
| --- | --- | --- |
| DEBUG | 10 | デバッグ情報 |
| INFO | 20 | 一般的な情報 |
| WARNING | 30 | 警告 (ルートロガーの既定の出力レベル) |
| ERROR | 40 | エラー |
| CRITICAL | 50 | 致命的なエラー |

数値が大きいほど、重要度が高い。設定したレベル以上のログだけが出力される。`NOTSET` (0) は、「レベルを指定しない」ことを表し、親ロガーのレベルを引き継ぐ。

### ロガーとハンドラのレベル

ログは、先にロガーのレベルで判定され、通ったものだけが、ハンドラのレベルで、もう一度判定される。

| ロガーのレベル | ハンドラのレベル | 出力されるログ |
| --- | --- | --- |
| DEBUG | WARNING | WARNING 以上 (DEBUG と INFO は、ハンドラで除かれる) |
| WARNING | DEBUG | WARNING 以上 (DEBUG と INFO は、ロガーで除かれる) |
| DEBUG | DEBUG | すべて |

### レベル名と数値の対応

```python
import logging

print(logging.getLevelNamesMapping())  # Python 3.11 以降
```

```text
{'CRITICAL': 50, 'FATAL': 50, 'ERROR': 40, 'WARN': 30, 'WARNING': 30, 'INFO': 20, 'DEBUG': 10, 'NOTSET': 0}
```

<pre><code class="caution">ルートロガーの既定のレベルは WARNING である。何も設定せずに logging.info() や logger.info() を呼んでも、出力されない。
出力されないときは、まず、ロガーとハンドラのレベルを確認する。</code></pre>

---

## 基本 <a id="basic" data-name="基本"></a>

### basicConfig で設定する

最小の設定は、`logging.basicConfig()` で行う。ルートロガーに、ハンドラとフォーマッタをまとめて設定できる。

```python
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
)

logging.debug("デバッグ情報")
logging.info("起動した")
logging.warning("設定ファイルが見つからない")
```

```text
2026-11-25 10:00:00,123 [DEBUG] デバッグ情報
2026-11-25 10:00:00,124 [INFO] 起動した
2026-11-25 10:00:00,124 [WARNING] 設定ファイルが見つからない
```

| 引数 | 内容 |
| --- | --- |
| `level` | ルートロガーのレベル |
| `format` | ログの書式 |
| `datefmt` | 日時の書式 |
| `filename` | 指定すると、ファイルに出力する |
| `filemode` | ファイルを開くモード。既定は `"a"` (追記) |
| `encoding` | ファイルのエンコーディング (Python 3.9 以降) |
| `handlers` | 使うハンドラのリスト。`filename` とは、同時に指定できない |
| `force` | 既存のハンドラを削除して、設定しなおす (Python 3.8 以降) |

<pre><code class="caution">basicConfig は、ルートロガーにハンドラが既にあると、何もしない。設定が反映されないときは、force=True を指定する。
ライブラリの中では、basicConfig を呼ばない。ログの設定は、アプリケーション側で行う。</code></pre>

---

## ロガーの作成 <a id="logger" data-name="ロガーの作成"></a>

- ロガーを作成

```python
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG) # DEBUG 以上を出力
```

`getLogger()` に渡す名前は、通常、モジュール名の `__name__` にする。同じ名前で呼ぶと、同じロガーが返る。

### ロガーの階層

ロガーは、名前を `.` で区切った階層になる。`app.db` は、`app` の子である。子のレベルが `NOTSET` のとき、親のレベルを引き継ぐ。

```python
import logging

app = logging.getLogger("app")
db = logging.getLogger("app.db")  # app の子ロガー

app.setLevel(logging.INFO)
print(db.getEffectiveLevel())  # 子は、親のレベルを引き継ぐ
```

```text
20
```

子のロガーが受け取ったログは、既定では、親のロガーのハンドラにも渡される (`propagate`)。そのため、ルートロガーにハンドラを設定すれば、すべてのモジュールのログを、まとめて出力できる。

### ロガーの主な操作

| 操作 | 内容 |
| --- | --- |
| `logger.setLevel(level)` | ロガーのレベルを設定する |
| `logger.addHandler(handler)` | ハンドラを追加する |
| `logger.removeHandler(handler)` | ハンドラを外す |
| `logger.handlers` | 追加済みのハンドラのリスト |
| `logger.getChild("db")` | 子ロガー (`名前.db`) を取得する |
| `logger.getEffectiveLevel()` | 親から引き継ぐ分も含めた、実際のレベルを返す |
| `logger.isEnabledFor(level)` | そのレベルが出力対象か調べる |
| `logger.propagate` | `False` にすると、親ロガーのハンドラに渡さない |

<pre><code class="tips">ロガーは、モジュールの先頭で、logger = logging.getLogger(__name__) と書いて、モジュール全体で使い回す。
関数の中で、呼ぶたびに、ロガーを作りなおす必要はない。</code></pre>

---

## フォーマッタ <a id="formatter" data-name="フォーマッタ"></a>

- フォーマッタを作成・設定

```python
formatter = logging.Formatter("%(asctime)s [%(levelname)s] [%(name)s] %(message)s")
```

作成したフォーマッタは、ハンドラの `setFormatter()` で設定する (次の章を参照)。

### フォーマットのプレースホルダ一覧

| プレースホルダ | 内容 |
| --- | --- |
| `%(asctime)s` | ログのタイムスタンプ |
| `%(levelname)s` | ログレベル |
| `%(message)s` | ログメッセージ |
| `%(filename)s` | ファイル名 |
| `%(lineno)d` | 行番号 |
| `%(name)s` | ロガーの名前 |
| `%(funcName)s` | 関数名 |
| `%(pathname)s` | ファイルのパス |
| `%(process)d` | プロセス ID |
| `%(thread)d` | スレッド ID |
| `%(taskName)s` | `asyncio` のタスク名 (Python 3.12 以降) |

### 日時の書式

`asctime` は、既定では、`2026-11-25 10:00:00,123` のように、ミリ秒が付く。`datefmt` を指定すると、日時の書式を変えられる。

```python
formatter = logging.Formatter(
    "%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
```

### 書式のスタイル

既定は `%` スタイルである。`style` を指定すると、`str.format` 形式で書ける。

```python
formatter = logging.Formatter("{asctime} [{levelname}] {message}", style="{")
```

---

## ハンドラ <a id="handler" data-name="ハンドラ"></a>

### ハンドラを作成

- `logging` では、標準出力やファイル出力以外にもさまざまな `handlers` が用意されている。

| ハンドラクラス | 説明 |
| --- | --- |
| `logging.StreamHandler` | コンソール (標準出力 / 標準エラー出力) に出力する |
| `logging.FileHandler` | ファイルに出力する |
| `logging.handlers.RotatingFileHandler` | ファイルサイズに応じてローテーションする |
| `logging.handlers.TimedRotatingFileHandler` | 時間間隔に応じてローテーションする |
| `logging.NullHandler` | 何もしない。ライブラリが、「出力先の設定はしない」ことを示すために使う |
| `logging.handlers.QueueHandler` | ログをキューに入れる。別スレッドで書き出すときに使う |
| `logging.handlers.SysLogHandler` | syslog に送る |
| `logging.handlers.SMTPHandler` | メールで送る |

<div class="subtitle">標準出力ハンドラの作成</div>

```python
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.WARNING) # WARNING 以上を出力
console_handler.setFormatter(formatter)
```

<pre><code class="caution">StreamHandler() は、引数を省略すると、標準エラー出力 (sys.stderr) に出力する。
標準出力に出力したいときは、logging.StreamHandler(sys.stdout) と書く (import sys が必要)。</code></pre>

<div class="subtitle">ロガーにハンドラを追加</div>

```python
logger.addHandler(console_handler)
```

<div class="subtitle">ローテーション機能を持つハンドラの追加</div>

- ファイルサイズや時間に応じてログファイルを自動で切り替える `handlers` も利用できる。

##### `RotatingFileHandler` (サイズ指定)
```python
from logging.handlers import RotatingFileHandler

# 最大 1MB、バックアップファイル数 3 つまで保持
rotating_handler = RotatingFileHandler("app_rotating.log", maxBytes=1024 * 1024, backupCount=3, encoding="utf-8")
rotating_handler.setLevel(logging.INFO)
rotating_handler.setFormatter(formatter)

logger.addHandler(rotating_handler)
```

サイズが `maxBytes` を超えると、`app_rotating.log.1`、`app_rotating.log.2` のように、番号つきのファイルに退避される。

##### `TimedRotatingFileHandler` (時間指定)
```python
from logging.handlers import TimedRotatingFileHandler

# 毎日深夜 0 時 (midnight) にローテーション、バックアップ 7 日分保持
timed_handler = TimedRotatingFileHandler("app_timed.log", when="midnight", interval=1, backupCount=7, encoding="utf-8")
timed_handler.setLevel(logging.INFO)
timed_handler.setFormatter(formatter)

logger.addHandler(timed_handler)
```

| `when` の値 | 内容 |
| --- | --- |
| `"S"` | 秒 |
| `"M"` | 分 |
| `"H"` | 時間 |
| `"D"` | 日 |
| `"midnight"` | 毎日、深夜 0 時 |
| `"W0"〜"W6"` | 曜日 (月曜日が `W0`) |

<pre><code class="caution">複数のプロセスが、同じログファイルに、ローテーションつきで書き込むと、ファイルが壊れたり、Windows ではエラーになったりする。
プロセスごとにファイルを分けるか、QueueHandler で 1 つのプロセスに集約する。</code></pre>

---

## ログの出力 <a id="output" data-name="ログの出力"></a>

<div class="subtitle">ログを出力</div>

```python
logger.debug("デバッグログ")
logger.info("情報ログ")
logger.warning("警告ログ")
logger.error("エラーログ")
logger.critical("致命的エラーログ")
```

| メソッド | 内容 |
| --- | --- |
| `logger.debug(msg)` | DEBUG のログを出力する |
| `logger.info(msg)` | INFO のログを出力する |
| `logger.warning(msg)` | WARNING のログを出力する |
| `logger.error(msg)` | ERROR のログを出力する |
| `logger.critical(msg)` | CRITICAL のログを出力する |
| `logger.exception(msg)` | ERROR のログに、例外のトレースバックを付ける。`except` の中で使う |
| `logger.log(level, msg)` | レベルを、数値や変数で指定して出力する |

### 値の埋め込み

メッセージに値を入れるときは、f 文字列ではなく、`%s` と引数で渡す。

```python
user = "shin"

logger.info("ログインした: user=%s", user)  # ✅ 出力するときだけ、文字列を組み立てる
logger.info(f"ログインした: user={user}")   # ❌ 出力しないレベルでも、組み立てる
```

<pre><code class="tips">引数で渡すと、そのレベルが出力対象でないときに、文字列の組み立てが行われない。
値を作る処理自体が重いときは、if logger.isEnabledFor(logging.DEBUG): で囲む。</code></pre>

### 例外のログ

`except` の中では、`logger.exception()` を使うと、トレースバックも、ログに残る。

```python
try:
    1 / 0
except ZeroDivisionError:
    logger.exception("計算に失敗した")
```

```text
2026-11-25 10:00:00,123 [ERROR] [__main__] 計算に失敗した
Traceback (most recent call last):
  File "app.py", line 3, in <module>
    1 / 0
ZeroDivisionError: division by zero
```

| 書き方 | 内容 |
| --- | --- |
| `logger.exception(msg)` | ERROR のレベルで、トレースバックを付ける |
| `logger.error(msg, exc_info=True)` | `logger.exception()` と同じ結果になる |
| `logger.warning(msg, exc_info=True)` | ERROR 以外のレベルでも、トレースバックを付けられる |
| `logger.info(msg, stack_info=True)` | 例外がなくても、呼び出しのスタックを付ける |

---

## ファイルへの出力 <a id="file-output" data-name="ファイルへの出力"></a>

<div class="subtitle">ログをファイルに出力する場合</div>

```python
file_handler = logging.FileHandler("app.log", encoding="utf-8")
file_handler.setLevel(logging.INFO) # INFO 以上を出力
file_handler.setFormatter(formatter)

logger.addHandler(file_handler)

logger.info("このログはファイルにも出力されます")
```

| 引数 | 内容 |
| --- | --- |
| `filename` | 出力先のファイル名 |
| `mode` | ファイルを開くモード。既定は `"a"` (追記)。`"w"` にすると、起動のたびに上書きされる |
| `encoding` | エンコーディング。日本語を出力するときは、`"utf-8"` を指定する |
| `delay` | `True` にすると、最初のログを出力するまで、ファイルを開かない |

<pre><code class="caution">encoding を省略すると、環境の既定のエンコーディングで書き込まれる。Windows では、日本語のログが、文字化けすることがある。
ファイルへ出力するときは、encoding="utf-8" を指定する。</code></pre>

---

## 設定ファイル <a id="config-file" data-name="設定ファイル"></a>

### fileConfig (ini 形式)

<div class="subtitle">設定ファイルを使う場合</div>

`logging.conf`

```ini
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

# logging.conf を適用
import logging.config

logging.config.fileConfig("logging.conf")
logger = logging.getLogger("my_logger")

logger.info("設定ファイルから読み込んだロギング")
```

| セクション | 内容 |
| --- | --- |
| `[loggers]`、`[handlers]`、`[formatters]` | 使う名前の一覧を、`keys` に書く |
| `[logger_名前]` | ロガーの設定。`root` 以外は、`qualname` が必要 |
| `[handler_名前]` | ハンドラの設定。`class`、`level`、`formatter`、`args` を書く |
| `[formatter_名前]` | フォーマッタの設定。`format`、`datefmt` を書く |

<pre><code class="caution">fileConfig は、disable_existing_loggers の既定が True である。設定を読み込む前に作られたロガーは、設定ファイルに書かれていない限り、無効になる。
既存のロガーを残すときは、logging.config.fileConfig("logging.conf", disable_existing_loggers=False) と書く。</code></pre>

### dictConfig (辞書形式)

`dictConfig` は、同じ設定を、辞書で書く方法である。JSON や YAML から読み込んだ辞書も、そのまま渡せる。新しく書くときは、こちらを使うことが多い。

```python
import logging
import logging.config

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "level": "DEBUG",
            "formatter": "default",
            "stream": "ext://sys.stdout",
        },
        "file": {
            "class": "logging.FileHandler",
            "level": "INFO",
            "formatter": "default",
            "filename": "app.log",
            "encoding": "utf-8",
        },
    },
    "loggers": {
        "my_logger": {
            "level": "DEBUG",
            "handlers": ["console", "file"],
            "propagate": False,
        },
    },
    "root": {
        "level": "WARNING",
        "handlers": ["console"],
    },
}

logging.config.dictConfig(LOGGING)

logger = logging.getLogger("my_logger")
logger.info("dictConfig から読み込んだロギング")
```

| キー | 内容 |
| --- | --- |
| `version` | 必須。現在は `1` のみ |
| `disable_existing_loggers` | 既存のロガーを無効にするか。`False` にしておくと安全 |
| `formatters` | フォーマッタの定義 |
| `handlers` | ハンドラの定義。`class` にクラス名を、文字列で書く |
| `loggers` | ロガーごとの設定 |
| `root` | ルートロガーの設定 |

<pre><code class="tips">標準出力や標準エラー出力は、"ext://sys.stdout" のように、文字列で指定する。
Django の LOGGING 設定も、この dictConfig の形式である。</code></pre>

---

## 応用 <a id="advanced" data-name="応用"></a>

### フィルタ (Filter)

`Filter` を使うと、レベル以外の条件で、ログを絞り込める。`Logger` と `Handler` の、どちらにも付けられる。

```python
import logging


class OnlyInfo(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return record.levelno == logging.INFO  # INFO のログだけを通す


console_handler = logging.StreamHandler()
console_handler.addFilter(OnlyInfo())
```

### QueueHandler (別スレッドでの出力)

ファイルやネットワークへの出力は、時間がかかる。`QueueHandler` でキューに入れ、`QueueListener` が別スレッドで書き出すと、呼び出し側の処理が止まらない。

```python
import logging
import logging.handlers
import queue

log_queue: queue.Queue = queue.Queue(-1)  # 上限なし

file_handler = logging.FileHandler("app.log", encoding="utf-8")
listener = logging.handlers.QueueListener(log_queue, file_handler)

logger = logging.getLogger("app")
logger.setLevel(logging.INFO)
logger.addHandler(logging.handlers.QueueHandler(log_queue))

listener.start()  # 別スレッドで、キューのログをハンドラに渡す
logger.info("キュー経由のログ")
listener.stop()   # 残りを書き出して停止する
```

<pre><code class="tips">Python 3.14 以降は、QueueListener を with 文で使える。with に入ると開始し、抜けると停止する。</code></pre>

### ライブラリでの使い方

ライブラリを作るときは、ハンドラを設定せず、`NullHandler` だけを付ける。出力先の設定は、利用する側のアプリケーションに任せる。

```python
import logging

logger = logging.getLogger(__name__)
logger.addHandler(logging.NullHandler())
```

---

## 実践例 <a id="example" data-name="実践例"></a>

コンソールには WARNING 以上を、ローテーションつきのファイルには DEBUG 以上を出力する例。ルートロガーにハンドラを設定し、各モジュールのロガーは、`propagate` で、そこに集める。

```python
# app.py
import logging
from logging.handlers import RotatingFileHandler

logger = logging.getLogger(__name__)


def setup_logging() -> None:
    """アプリケーション全体のロギングを設定する。"""
    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.WARNING)
    console_handler.setFormatter(formatter)

    file_handler = RotatingFileHandler(
        "app.log", maxBytes=1024 * 1024, backupCount=3, encoding="utf-8"
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)

    root = logging.getLogger()  # ルートロガー
    root.setLevel(logging.DEBUG)
    root.addHandler(console_handler)
    root.addHandler(file_handler)


def divide(a: int, b: int) -> float:
    logger.debug("divide(%s, %s)", a, b)
    try:
        return a / b
    except ZeroDivisionError:
        logger.exception("ゼロで割ろうとした")
        raise


def main() -> None:
    setup_logging()
    logger.info("起動した")

    divide(10, 2)
    try:
        divide(1, 0)
    except ZeroDivisionError:
        logger.warning("処理を中断した")


if __name__ == "__main__":
    main()
```

コンソールには、次のような出力が表示される。DEBUG と INFO は、ファイルにだけ出力される。

```text
2026-11-25 10:00:00 [ERROR] [__main__] ゼロで割ろうとした
Traceback (most recent call last):
  ...
ZeroDivisionError: division by zero
2026-11-25 10:00:00 [WARNING] [__main__] 処理を中断した
```

<pre><code class="tips">setup_logging() は、プログラムの入口で、1 回だけ呼ぶ。各モジュールでは、getLogger(__name__) でロガーを取得して、ログを出力するだけにする。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `logger.info()` の出力が表示されない | ルートロガーの既定のレベルが WARNING で、ロガーにレベルを設定していない | `logger.setLevel()` か、`basicConfig(level=...)` でレベルを下げる |
| ハンドラのレベルを下げても、DEBUG が出ない | ロガーのレベルで、先に除かれている | ロガーのレベルも、同じように下げる |
| 同じログが、2 回出力される | ハンドラを重複して追加した。または、子と親の両方のハンドラに渡っている | 追加済みか確認する。子の `propagate` を `False` にする |
| 関数を呼ぶたびに、ログの行が増える | `setup_logging()` などの中で、毎回 `addHandler()` している | 設定は、入口で 1 回だけ行う。`if not logger.handlers:` で確認する |
| `basicConfig()` を呼んでも、設定が反映されない | ルートロガーに、ハンドラが既にある | `force=True` を指定する |
| `fileConfig` の後に、既存のロガーのログが出ない | `disable_existing_loggers` の既定が `True` | `False` を指定する。`dictConfig` では、`"disable_existing_loggers": False` と書く |
| Windows で、日本語のログが文字化けする | `encoding` を指定していない | `encoding="utf-8"` を指定する |
| ライブラリの `basicConfig()` が、利用側の設定を邪魔する | ライブラリの中で、ログを設定している | ライブラリは、`NullHandler` だけを付ける |
| `KeyError: "Attempt to overwrite 'message' in LogRecord"` | `extra` に、`message` や `name` などの、予約された名前を使った | `extra` のキーを、別の名前にする |
| ローテーション時に、ログファイルが壊れる、または `PermissionError` になる | 複数のプロセスが、同じファイルを開いている | プロセスごとにファイルを分ける。または、`QueueHandler` で集約する |
| ログに、`,123` のようなミリ秒が付く | `asctime` の既定の書式である | `datefmt` で、書式を指定する |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| `logging.handlers.QueueHandler` / `QueueListener` | ログを、キュー経由で別スレッドから書き出す |
| `warnings` | 非推奨の API などの、警告を出す標準ライブラリ。`logging.captureWarnings(True)` で、ログに流せる |
| `loguru` | 設定が簡単な、サードパーティのロギングライブラリ |
| `structlog` | 構造化ログ (キーと値の形式) を扱う、サードパーティのライブラリ |
| `python-json-logger` | ログを、JSON 形式で出力する、サードパーティのライブラリ |

Django や FastAPI のロギングについては、それぞれのドキュメントを参照。
