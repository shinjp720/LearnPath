---
title: subprocess
layout: default
---

# subprocess <a id="top" data-name="TOP"></a>

subprocess モジュールは、外部のコマンドやプログラムを Python から実行するためのモジュールで、たとえば、シェルコマンドを Python から実行したり、他のプログラムと連携したりする際に使われる。

標準ライブラリに含まれるため、インストールは不要である。子プロセスの標準入力 (stdin)、標準出力 (stdout)、標準エラー出力 (stderr) をパイプでつなぎ、終了コードも取得できる。<br>
ほとんどの用途は、簡易な <a href="#run">run()</a> で足りる。完了を待たずに進めたり、途中で入出力をやりとりしたりする場合は、<a href="#popen">Popen</a> を使う。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 標準ライブラリ | インストール不要。`import subprocess` で使える |
| 入出力の制御 | stdin、stdout、stderr を、パイプ、ファイル、`DEVNULL` などにつなげる |
| 終了コード | `returncode` で取得できる。`check=True` で、失敗時に例外にできる |
| タイムアウト | `timeout` を指定すると、時間切れで `TimeoutExpired` が発生する |
| 2つの層 | 簡易な `run()` と、細かく制御できる `Popen` がある |

### 他の方法との比較

| | `os.system()` | `subprocess.run()` | `Popen` |
| --- | --- | --- | --- |
| 出力の取得 | ✕ | ○ | ○ |
| タイムアウト | ✕ | ○ | ○ (`wait()`、`communicate()` の引数) |
| 完了を待たずに進める | ✕ | ✕ | ○ |
| 途中で読み書きする | ✕ | ✕ | ○ |
| 向いている場面 | 簡単な動作確認 | 大半の用途 | パイプラインや、長く動くプロセスの制御 |

### 主な API

| 項目 | 内容 |
| --- | --- |
| `run()` | コマンドを実行して、完了を待つ。`CompletedProcess` を返す |
| `CompletedProcess` | `run()` の戻り値。終了コードと、出力を持つ |
| `Popen` | プロセスを起動して、すぐに戻る。細かい制御に使う |
| `PIPE` | 入出力を、パイプにつなぐための値 |
| `DEVNULL` | 入出力を、捨てる (`os.devnull` につなぐ) ための値 |
| `STDOUT` | stderr を、stdout と同じ出力先にまとめるための値 |
| `CalledProcessError` | `check=True` で、終了コードが 0 以外のときに発生する |
| `TimeoutExpired` | `timeout` を超えたときに発生する |

<pre><code class="caution">このドキュメントは、Python 3.7 以降を前提にしている。
run() の capture_output 引数と text 引数は、Python 3.7 で追加された。古いバージョンでは、stdout=PIPE と universal_newlines=True を使う。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

標準ライブラリのため、`import` するだけで使える。

```python
import subprocess
```

以降のサンプルでは、環境による違いを減らすため、実行するプログラムに、実行中の Python 自身 (`sys.executable`) を使う。

```python
import subprocess
import sys
```

---

## run (コマンドを実行して待つ) <a id="run" data-name="run"></a>

### subprocess.run()

この関数は Popen インスタンスをカプセル化し、このインスタンスで最も一般的な処理フローを実行する。<br>
`run()` は、Popen のコンストラクタとほぼ同じ引数を受け取り、指定されたコマンドを実行し、処理が完了するかタイムアウトするのを待ち、`CompletedProcess` インスタンスを返す。このオブジェクトは、リターンコードと、stdout および stderr の内容に対する属性を持つ。

`timeout`、`input`、`check`、`capture_output` は、`run()` 独自の引数で、Popen には渡されない。

```python
import subprocess
import sys

cp = subprocess.run([sys.executable, "--version"], capture_output=True, text=True)
print(cp.returncode)
print(cp.stdout.strip())
```

```text
0
Python 3.x.y
```

### CompletedProcess インスタンスの属性

| 属性       | 説明           |
| ---------- | -------------- |
| stdout     | 標準出力       |
| stderr     | エラー出力     |
| returncode | リターンコード |
| args       | 実行したコマンド (リストまたは文字列) |

`stdout` と `stderr` は、キャプチャしなかった場合は `None` になる。`returncode` は、POSIX では、負の値 `-N` が、シグナル `N` で終了したことを表す。<br>
`cp.check_returncode()` を呼ぶと、終了コードが 0 以外のときに、`CalledProcessError` が発生する。

### 引数 args

argsは必須引数で、1つの引数で完結する場合 (`"ls"` など) は文字列で指定できる。<br>
複数の引数 (オプションやコマンドに渡す引数) を渡す場合は、`["ls", "-l"]` リストとして渡すか、`"ls -l"` 文字列で渡して `shell=True` とする。

| 渡し方 | `shell` | 動作 |
| --- | --- | --- |
| `["ls", "-l"]` | 不要 | プログラムを直接実行する。特殊文字は、解釈されない |
| `"ls"` | 不要 | プログラム名として実行する。引数は、付けられない |
| `"ls -l"` | `shell=True` が必要 | シェルが解釈して、実行する |

<pre><code class="caution">リストとしてコマンドを渡す場合は、特殊文字($, *, |, &gt;など)が使えない。<br>逆にshell=Trueとすると特殊文字が使えるが、ユーザーの入力を直接渡すと脆弱性となるので注意が必要。</code></pre>

POSIX では、`shell=False` のときに `"ls -l"` を渡すと、文字列全体がプログラム名として扱われ、`FileNotFoundError` になる。

<pre><code class="tips">コマンド文字列を、リストに分けたいときは、shlex.split() を使う。
シェルに渡す文字列に、外部の値を入れる必要があるときは、shlex.quote() で、エスケープする。</code></pre>

### シェルを経由する実行 (shell=True)

<pre><code class="example">cp = subprocess.run("ls -l", shell=True, capture_output=True, text=True)
</code></pre>

`shell=True` は、シェル (POSIX では `/bin/sh`) 経由でコマンドを実行する。`*` の展開、リダイレクト、パイプ、環境変数の展開など、シェルの機能が使える。<br>
Windows の `dir` や `echo` のような、実行ファイルではなく、シェルの組み込みコマンドも、`shell=True` で実行できる。

### 出力の取得 (capture_output、text)

コマンドの出力を捕捉する必要がある場合は、capture_output 引数と text 引数を True に設定するのが一般的。

<pre><code class="example">cp = subprocess.run("ls", capture_output=True, text=True)
print(cp.stdout)</code></pre>

| 指定 | stdout、stderr の型 |
| --- | --- |
| `capture_output=True` のみ | `bytes` |
| `capture_output=True` と `text=True` | `str` |
| `capture_output=True` と `encoding="utf-8"` | `str` (文字コードを指定してデコードする) |

`capture_output=True` は、`stdout=PIPE` と `stderr=PIPE` を指定するのと同じ。`capture_output` と、`stdout`、`stderr` を、同時に指定することはできない。

<pre><code class="tips">text=True のデコードには、実行環境のロケールの文字コードが使われる。文字化けや UnicodeDecodeError が出るときは、encoding="utf-8" のように、相手の出力の文字コードを指定する。</code></pre>

### 標準エラー出力をまとめる

標準出力と標準エラー出力を、1つにまとめて受け取るときは、`stdout=PIPE` と `stderr=STDOUT` を指定する。この場合、`cp.stderr` は `None` になる。

```python
import subprocess
import sys

code = "import sys; print('out'); print('err', file=sys.stderr)"
cp = subprocess.run(
    [sys.executable, "-c", code],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
)
print(cp.stdout)
print(cp.stderr)
```

```text
out
err

None
```

出力が不要なときは、`stdout=subprocess.DEVNULL` のように指定して、捨てる。

### 終了コードの確認 (check)

既定では、コマンドが失敗 (終了コードが 0 以外) しても、例外は発生しない。`check=True` を指定すると、`CalledProcessError` が発生する。

```python
import subprocess
import sys

try:
    subprocess.run([sys.executable, "-c", "import sys; sys.exit(3)"], check=True)
except subprocess.CalledProcessError as e:
    print("終了コード:", e.returncode)
```

```text
終了コード: 3
```

| `CalledProcessError` の属性 | 内容 |
| --- | --- |
| `returncode` | 終了コード |
| `cmd` | 実行したコマンド |
| `stdout`、`stderr` | キャプチャした出力 (キャプチャしていなければ `None`) |

### タイムアウト (timeout)

`timeout` (秒) を指定すると、時間内に終わらなかった場合に、子プロセスが終了させられ、`TimeoutExpired` が発生する。

```python
import subprocess
import sys

try:
    subprocess.run([sys.executable, "-c", "import time; time.sleep(10)"], timeout=1)
except subprocess.TimeoutExpired as e:
    print("タイムアウト:", e.timeout, "秒")
```

```text
タイムアウト: 1 秒
```

### 標準入力への入力 (input)

`input` に渡した値が、子プロセスの標準入力に送られる。`text=True` のときは `str`、そうでなければ `bytes` を渡す。

```python
import subprocess
import sys

cp = subprocess.run(
    [sys.executable, "-c", "print(input().upper())"],
    input="hello\n",
    capture_output=True,
    text=True,
)
print(cp.stdout.strip())
```

```text
HELLO
```

### 作業ディレクトリと環境変数 (cwd、env)

| 引数 | 内容 |
| --- | --- |
| `cwd` | 子プロセスの作業ディレクトリを指定する |
| `env` | 子プロセスの環境変数を指定する。**親の環境変数を、置き換える** |

```python
import os
import subprocess
import sys

env = {**os.environ, "GREETING": "hi"}  # 親の環境変数を引き継いで、1つ足す
cp = subprocess.run(
    [sys.executable, "-c", "import os; print(os.environ['GREETING'])"],
    env=env,
    capture_output=True,
    text=True,
)
print(cp.stdout.strip())
```

```text
hi
```

<pre><code class="caution">env に、足したい環境変数だけを渡すと、PATH などが消えて、コマンドが見つからなくなることがある。
通常は、os.environ をコピーして、変更を加える。</code></pre>

---

## 旧来の関数 (call、check_call、check_output) <a id="legacy" data-name="旧来の関数"></a>

`run()` が追加される前から使われている関数。古いコードでよく見かける。新しいコードでは、`run()` を使う。

| 関数 | 内容 | 戻り値 |
| --- | --- | --- |
| `call()` | 実行して、完了を待つ | 終了コード |
| `check_call()` | 実行して、完了を待つ。0 以外なら、`CalledProcessError` | 0 |
| `check_output()` | 実行して、完了を待つ。0 以外なら、`CalledProcessError` | 標準出力 (`bytes`。`text=True` なら `str`) |

| 古い書き方 | `run()` での書き方 |
| --- | --- |
| `subprocess.call(cmd)` | `subprocess.run(cmd).returncode` |
| `subprocess.check_call(cmd)` | `subprocess.run(cmd, check=True)` |
| `subprocess.check_output(cmd, text=True)` | `subprocess.run(cmd, check=True, capture_output=True, text=True).stdout` |

---

## Popen (プロセスを細かく制御する) <a id="popen" data-name="Popen"></a>

### class Popen(args, bufsize=-1, executable=None, stdin=None, stdout=None, stderr=None, preexec_fn=None, close_fds=True, shell=False, cwd=None, env=None, universal_newlines=None, startupinfo=None, creationflags=0, restore_signals=True, start_new_session=False, pass_fds=(), *, user=None, group=None, extra_groups=None, encoding=None, errors=None, text=None, umask=-1, pipesize=-1, process_group=None)

これは Popen クラスのコンストラクタのシグネチャで、プログラムから別のプログラムを実行するための様々な方法をサポートする。

`Popen` は、プロセスを起動すると、完了を待たずに、すぐに戻る。`run()` で足りない場合に使う。

### 主な引数

| 引数 | 内容 |
| --- | --- |
| `args` | 実行するコマンド。リストまたは文字列 |
| `stdin`、`stdout`、`stderr` | `PIPE`、`DEVNULL`、ファイルオブジェクトなどを指定する。`stderr` は `STDOUT` も指定できる |
| `shell` | シェル経由で実行する |
| `cwd`、`env` | 作業ディレクトリと、環境変数 |
| `text`、`encoding`、`errors` | 入出力を、文字列として扱う |
| `bufsize` | 入出力のバッファリングの設定 |
| `close_fds` | 子プロセスで、不要なファイル記述子を閉じる (POSIX では、既定で `True`) |
| `pass_fds` | 子プロセスに、引き継ぐファイル記述子 (POSIX のみ) |
| `start_new_session` | 子プロセスを、新しいセッションで起動する (POSIX のみ) |
| `preexec_fn` | 子プロセスの実行直前に呼ぶ関数 (POSIX のみ) |
| `startupinfo`、`creationflags` | Windows 固有の設定 |
| `user`、`group`、`extra_groups`、`umask` | 子プロセスの、ユーザー、グループ、umask (POSIX のみ。Python 3.9 以降) |
| `pipesize` | パイプのサイズ (Linux のみ。Python 3.10 以降) |
| `process_group` | 子プロセスの、プロセスグループ (POSIX のみ。Python 3.11 以降) |

<pre><code class="caution">preexec_fn は、スレッドを使うプログラムでは、安全に使えないことがある。可能な限り、他の引数 (start_new_session、process_group など) で代用する。</code></pre>

### メソッドと属性

| 項目 | 内容 |
| --- | --- |
| `communicate(input=None, timeout=None)` | 入力を送り、出力を最後まで読み、終了を待つ。`(stdout, stderr)` を返す |
| `poll()` | 終了したか確認する。実行中なら `None`、終了していれば、終了コード |
| `wait(timeout=None)` | 終了を待つ。終了コードを返す |
| `send_signal(sig)` | シグナルを送る |
| `terminate()` | 終了を要求する (POSIX では `SIGTERM`) |
| `kill()` | 強制終了する (POSIX では `SIGKILL`) |
| `pid` | プロセス ID |
| `returncode` | 終了コード。実行中は `None` |
| `stdin`、`stdout`、`stderr` | `PIPE` を指定したときの、ファイルオブジェクト |

### 基本の使い方

`with` 文で使うと、終了時に、標準入出力が閉じられ、プロセスの終了が待たれる。

```python
import subprocess
import sys

with subprocess.Popen(
    [sys.executable, "-c", "print('hi')"],
    stdout=subprocess.PIPE,
    text=True,
) as proc:
    out, _ = proc.communicate()

print(out.strip())
print(proc.returncode)
```

```text
hi
0
```

### 出力を逐次読む

出力を、終了を待たずに、1行ずつ読むときは、`stdout` を、ループで読む。

```python
import subprocess
import sys

code = "for i in range(3): print(i, flush=True)"
with subprocess.Popen(
    [sys.executable, "-c", code],
    stdout=subprocess.PIPE,
    text=True,
) as proc:
    for line in proc.stdout:
        print("受信:", line.strip())
```

```text
受信: 0
受信: 1
受信: 2
```

### パイプラインの接続

シェルの `ls -l | grep py` に当たる処理を、Popen をつないで書く (POSIX の例)。

```python
import subprocess

p1 = subprocess.Popen(["ls", "-l"], stdout=subprocess.PIPE)
p2 = subprocess.Popen(["grep", "py"], stdin=p1.stdout, stdout=subprocess.PIPE, text=True)
p1.stdout.close()  # p2 が先に終了したとき、p1 が SIGPIPE を受け取れるように、親側を閉じる
out, _ = p2.communicate()
print(out)
```

<pre><code class="tips">固定の文字列だけで構成されたパイプラインなら、subprocess.run("ls -l | grep py", shell=True, ...) と書く方が、簡潔である。</code></pre>

### タイムアウトの扱い

`communicate()` の `timeout` が切れても、**子プロセスは終了しない**。`kill()` で終了させて、もう一度 `communicate()` を呼ぶ。

```python
import subprocess
import sys

proc = subprocess.Popen(
    [sys.executable, "-c", "import time; time.sleep(10)"],
    stdout=subprocess.PIPE,
)
try:
    outs, errs = proc.communicate(timeout=1)
except subprocess.TimeoutExpired:
    proc.kill()  # 子プロセスを、強制終了する
    outs, errs = proc.communicate()  # 残った出力を回収して、終了を待つ
print("終了コード:", proc.returncode)
```

```text
終了コード: -9
```

<pre><code class="caution">stdout=PIPE を指定して、出力を読まずに wait() を呼ぶと、パイプが一杯になって、デッドロックすることがある。
出力を受け取るときは、wait() ではなく、communicate() を使う。</code></pre>

---

## 例外 <a id="exceptions" data-name="例外"></a>

| 例外 | 発生する場面 |
| --- | --- |
| `SubprocessError` | このモジュールの例外の、基底クラス |
| `CalledProcessError` | `check=True` (または `check_call()`、`check_output()`) で、終了コードが 0 以外 |
| `TimeoutExpired` | `timeout` を超えた |
| `FileNotFoundError` | 実行するプログラムが、見つからない (標準の例外) |
| `PermissionError` | 実行する権限がない (標準の例外) |
| `ValueError` | 引数の組み合わせが、不正 (`capture_output` と `stdout` の同時指定など) |

---

## 実践例 <a id="examples" data-name="実践例"></a>

### コマンドを実行して、出力を返す関数

失敗の種類ごとに、例外を分けて処理する。

```python
import subprocess
import sys


def run_command(args, timeout=10):
    """コマンドを実行して、標準出力を返す。失敗時は、RuntimeError にする"""
    try:
        cp = subprocess.run(
            args,
            capture_output=True,
            text=True,
            check=True,
            timeout=timeout,
        )
    except FileNotFoundError:
        raise RuntimeError(f"コマンドが見つからない: {args[0]}")
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"終了コード {e.returncode}: {e.stderr.strip()}") from e
    except subprocess.TimeoutExpired:
        raise RuntimeError(f"タイムアウト: {timeout} 秒")
    return cp.stdout


print(run_command([sys.executable, "--version"]).strip())

try:
    run_command(["no-such-command"])
except RuntimeError as e:
    print(e)
```

```text
Python 3.x.y
コマンドが見つからない: no-such-command
```

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `FileNotFoundError` (POSIX で `"ls -l"` を渡したとき) | `shell=False` では、文字列全体が、プログラム名として扱われる | リストで渡す (`["ls", "-l"]`)。または `shell=True` にする |
| `cp.stdout` が `None` | `capture_output=True` (または `stdout=PIPE`) を指定していない | `capture_output=True` を指定する |
| 出力が `b'...'` になる | `text=True` を指定していない。`bytes` で返っている | `text=True` を指定する。または `decode()` する |
| `ValueError` (`may not be used with capture_output`) | `capture_output` と、`stdout`、`stderr` を、同時に指定した | どちらかにする。まとめたいときは、`stdout=PIPE` と `stderr=STDOUT` |
| `*` や `$HOME` が、展開されない | `shell=False` では、シェルの機能が使われない | `shell=True` にする。または、Python 側で展開する (`glob`、`os.path.expandvars()`) |
| コマンドが失敗しても、例外にならない | `check` の既定は `False` | `check=True` を指定する。または `returncode` を確認する |
| プログラムが止まったままになる | `PIPE` の出力を読まずに、`wait()` を呼んでいる | `communicate()` を使う |
| `timeout` を指定したのに、孫プロセスが残る | `shell=True` では、シェルだけが終了して、シェルが起動したプロセスが残ることがある | `shell=True` を避けて、直接実行する |
| 文字化け、`UnicodeDecodeError` | ロケールの文字コードと、出力の文字コードが違う | `encoding="utf-8"` のように、相手の文字コードを指定する |
| `env` を指定したら、`PATH` が消えた | `env` は、環境変数を、全体として置き換える | `{**os.environ, "KEY": "value"}` のように、コピーして足す |
| Windows で `dir` や `echo` が見つからない | 実行ファイルではなく、シェルの組み込みコマンドである | `shell=True` を指定する |
| ユーザーの入力で、意図しないコマンドが動く | `shell=True` に、外部の入力を、そのまま渡している (シェルインジェクション) | リストで渡して、`shell=False` にする。やむを得ないときは、`shlex.quote()` を使う |

---

## 関連 <a id="related" data-name="関連"></a>

| モジュール、ドキュメント | 用途 |
| --- | --- |
| `shlex` | コマンド文字列の分割 (`shlex.split()`) と、エスケープ (`shlex.quote()`) |
| `shutil` | `shutil.which()` で、コマンドが存在するか確認する |
| `asyncio` | `asyncio.create_subprocess_exec()` で、非同期にプロセスを実行する |
| `os` | `os.system()` など、旧来の方法。「os」のドキュメントを参照 |
| `logging` | 子プロセスの出力を、記録に残す。「logging」のドキュメントを参照 |
