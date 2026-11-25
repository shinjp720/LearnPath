---
title: OS
layout: default
---

# OS <a id="top" data-name="TOP"></a>

- `os` モジュールは、ファイルやディレクトリを作成して操作するための低レベルの方法と、プロセスを作成、管理、削除するための低レベルの方法を提供する。

```python
import os
```

---

## 概要 <a id="overview" data-name="概要"></a>

### 機能の分類

| 分類 | 主な関数 |
| --- | --- |
| ディレクトリの操作 | `getcwd()`、`chdir()`、`listdir()`、`scandir()`、`walk()`、`mkdir()`、`makedirs()`、`rmdir()` |
| ファイルの操作 | `remove()`、`unlink()`、`rename()`、`renames()`、`replace()`、`symlink()` |
| ファイルの情報 | `stat()`、`lstat()`、`fstat()`、`access()`、`chmod()` |
| パスの操作 | `os.path` モジュールの関数 (`join()`、`exists()` など) |
| プロセス・環境変数 | `getpid()`、`environ`、`getenv()`、`system()` |

`os.path` は、`os` モジュールの中にあるサブモジュールで、`import os` だけで使える。ファイルの中身を読み書きするときは、組み込みの `open()` を使う。

### 共通の引数

多くの関数が、次の引数を受け取る。

| 引数 | 内容 |
| --- | --- |
| `path` | 文字列 (`str`)、バイト列 (`bytes`)、パスのようなオブジェクト (`os.PathLike`。`pathlib.Path` など) を指定できる |
| `dir_fd` | ディレクトリのファイルディスクリプタを指定すると、`path` を、そのディレクトリからの相対パスとして扱う (Unix のみ) |
| `follow_symlinks` | `False` にすると、シンボリックリンクをたどらず、リンク自体を対象にする |

### 主な例外

ファイルやディレクトリの操作に失敗すると、`OSError` か、そのサブクラスの例外が発生する。

| 例外 | 発生する場面 |
| --- | --- |
| `FileNotFoundError` | 指定したファイルやディレクトリが存在しない |
| `FileExistsError` | 作成しようとしたファイルやディレクトリが、既に存在する |
| `PermissionError` | 権限がない |
| `NotADirectoryError` | ディレクトリを期待した場所に、ファイルを指定した |
| `IsADirectoryError` | ファイルを期待した場所に、ディレクトリを指定した |
| `OSError` | 上記以外の、OS に関するエラー (ディレクトリが空でない場合など) |

<pre><code class="tips">新しく書くコードでは、パスの操作に、pathlib を使うことが多い。os は、既存のコードを読むときや、pathlib にない機能 (環境変数、プロセスなど) で必要になる。
pathlib との対応は、このドキュメントの後半の表を参照する。</code></pre>

<pre><code class="tips">このドキュメントは、Python 3 系を前提にしている。バージョンに依存する機能には、バージョンを明記している。</code></pre>

---

## os のメソッド / クラス <a id="os" data-name="osのメソッド/クラス"></a>

### stat / lstat / fstat

```python
stat(path, *, dir_fd=None, follow_symlinks=True)
lstat(path, *, dir_fd=None)
fstat(fd)
```

`stat()` は `stat_result` 型の値 `x` を返す。`x` は、`path` に関する情報を、(少なくとも) 10 個の要素として提供する。`stat_result` 型の値はタプルであり、その中に含まれている値に、名前でもアクセスできる。

| 関数 | 内容 |
| --- | --- |
| `stat(path)` | `path` の情報を返す。`path` がシンボリックリンクのときは、リンク先の情報を返す。`follow_symlinks=False` を渡すと、リンク自体の情報を返す |
| `lstat(path)` | シンボリックリンク自体の情報を返す。`stat(path, follow_symlinks=False)` と同じ |
| `fstat(fd)` | 開いているファイルディスクリプタの情報を返す。`stat(fd)` と書いても、同じ結果になる |

`path` には、ファイル、ディレクトリ、ファイルディスクリプタ、パスのようなオブジェクトを指定できる。`dir_fd` を指定したときは、`path` を、そのディレクトリからの相対パスとして扱う。

#### stat_result インスタンスの属性

| index | 属性名 | 意味 |
| --- | --- | --- |
| 0 | `st_mode` | 保護ビットとその他のモードビット |
| 1 | `st_ino` | inode 番号 |
| 2 | `st_dev` | デバイス ID |
| 3 | `st_nlink` | ハードリンクの数 |
| 4 | `st_uid` | 所有者のユーザー ID |
| 5 | `st_gid` | 所有者のグループ ID |
| 6 | `st_size` | サイズ (バイト単位) |
| 7 | `st_atime` | 最終アクセス時刻 |
| 8 | `st_mtime` | 最終変更時刻 |
| 9 | `st_ctime` | 最終ステータス変更時刻 |

時刻は、エポック (1970年1月1日 0 時 0 分 0 秒 UTC) からの秒数で、浮動小数点数で表される。ナノ秒の整数で取得したいときは、`st_atime_ns`、`st_mtime_ns`、`st_ctime_ns` を使う。

```python
import os
from datetime import datetime

st = os.stat("sample.txt")
print(st.st_size)                           # サイズ (バイト)
print(datetime.fromtimestamp(st.st_mtime))  # 最終変更時刻
```

<pre><code class="caution">st_ctime は、Unix では、メタデータの最終変更時刻を表す。Windows では、ファイルの作成時刻を表す。
ファイルかディレクトリかを調べるときは、st_mode を、stat.S_ISDIR(st.st_mode) のように、stat モジュールの関数に渡す。</code></pre>

### chdir

```python
chdir(path)
```

プロセスの現在の作業ディレクトリを `path` に変更する。

<pre><code class="caution">作業ディレクトリは、プロセス全体で共有される。複数のスレッドがあるプログラムで変更すると、他のスレッドの相対パスにも影響する。
一時的に変更したいときは、Python 3.11 以降の contextlib.chdir() を with 文で使うと、元のディレクトリに戻せる。</code></pre>

### chmod / lchmod

```python
chmod(path, mode, *, dir_fd=None, follow_symlinks=True)
lchmod(path, mode)
```

`path` のパーミッションを、整数 `mode` に変更する。`mode` は、8進数 (`0o755` など) か、`stat` モジュールの定数で指定する。定数を複数指定するときは、ビット論理和演算子 (`|`) でつなぐ。

シンボリックリンクのリンク先ではなく、シンボリックリンク自体のパーミッションを変更したい場合は、`follow_symlinks=False` を渡す (または `lchmod()` を使う)。

#### mode

| 値 | 意味 |
| --- | --- |
| `stat.S_IRUSR` | 所有者の読み取り (`0o400`) |
| `stat.S_IWUSR` | 所有者の書き込み (`0o200`) |
| `stat.S_IXUSR` | 所有者の実行 (`0o100`) |
| `stat.S_IRGRP` | グループの読み取り (`0o040`) |
| `stat.S_IWGRP` | グループの書き込み (`0o020`) |
| `stat.S_IXGRP` | グループの実行 (`0o010`) |
| `stat.S_IROTH` | その他のユーザーの読み取り (`0o004`) |
| `stat.S_IWOTH` | その他のユーザーの書き込み (`0o002`) |
| `stat.S_IXOTH` | その他のユーザーの実行 (`0o001`) |
| `stat.S_IRWXU` | 所有者の読み取り、書き込み、実行 (`0o700`) |

よく使う8進数の値は、次のとおり。

| 値 | 意味 |
| --- | --- |
| `0o644` | 所有者は読み書き、それ以外は読み取りのみ |
| `0o755` | 所有者は読み書きと実行、それ以外は読み取りと実行 |
| `0o600` | 所有者のみ読み書き |

```python
import os
import stat

os.chmod("script.sh", 0o755)
os.chmod("secret.txt", stat.S_IRUSR | stat.S_IWUSR)  # 0o600 と同じ
```

<pre><code class="caution">元のドキュメントでは、mode に os.R_OK、os.W_OK、os.X_OK を指定するとしていたが、これらは access() に渡す定数である。chmod() には使えない。
Windows の chmod() は、読み取り専用の属性しか変更できない。
lchmod() は、使えないプラットフォームがある。その場合は、chmod(path, mode, follow_symlinks=False) を使う。</code></pre>

### access

```python
access(path, mode, *, dir_fd=None, effective_ids=False, follow_symlinks=True)
```

`path` に対して、現在のユーザーが、`mode` で指定した権限を持つかどうかを、`bool` で返す。`mode` には、次の値を、0 個以上指定できる。複数ある場合は、ビット論理和演算子 (`|`) で指定する。

| 値 | 意味 |
| --- | --- |
| `os.F_OK` | 存在する |
| `os.R_OK` | 読み取り |
| `os.W_OK` | 書き込み |
| `os.X_OK` | 実行 |

```python
import os

print(os.access("sample.txt", os.R_OK))              # 読み取れるか
print(os.access("sample.txt", os.R_OK | os.W_OK))    # 読み書きできるか
```

<pre><code class="caution">access() で確認してから open() するまでの間に、状況が変わることがある。
ファイルを開くときは、先に確認せず、open() を呼んで、PermissionError や FileNotFoundError を、try / except で処理する。</code></pre>

### getcwd

```python
getcwd()
```

現在の作業ディレクトリのパスを、文字列で返す。

### listdir

```python
listdir(path='.')
```

`path` に存在するファイルとディレクトリの名前が含まれたリストを返す。名前だけが返るため、完全なパスが必要なときは、`os.path.join()` で、`path` と結合する。

<pre><code class="caution">リストの順序は不定である。順序が必要なときは、sorted(os.listdir(path)) とする。</code></pre>

### mkdir / makedirs

```python
mkdir(path, mode=0o777, *, dir_fd=None)
makedirs(name, mode=0o777, exist_ok=False)
```

`mkdir()` は、`path` の一番右のディレクトリのみを作成する。その手前にあるディレクトリのいずれかが存在しない場合は、`FileNotFoundError` (`OSError` のサブクラス) を生成する。

`makedirs()` は、`name` の一部であるディレクトリのうち、まだ存在しないものを、すべて作成する (`FileExistsError` が生成されないようにしたい場合は、`exist_ok=True` を渡す)。

```python
import os

os.mkdir("logs")                              # logs だけを作る
os.makedirs("output/2026/11", exist_ok=True)  # 途中のディレクトリもまとめて作る
```

<pre><code class="caution">元のドキュメントでは、makedirs() を mkdirs() と書いていたが、正しい名前は makedirs() である。
mode は、umask によって、一部のビットが除かれることがある。</code></pre>

### remove / unlink

```python
remove(path, *, dir_fd=None)
unlink(path, *, dir_fd=None)
```

`path` (ファイル) を削除する。ファイルではなくディレクトリの削除には、`rmdir()` を使う。`unlink()` は、意味的に `remove()` と同じ。

### rmdir

```python
rmdir(path, *, dir_fd=None)
```

`path` (空のディレクトリ) を削除する。削除が失敗した (具体的には、そのディレクトリが空ではない) 場合は、`OSError` を生成する。

<pre><code class="tips">中身のあるディレクトリを、まとめて削除したいときは、shutil.rmtree() を使う。</code></pre>

### rename / renames / replace

```python
rename(src, dst, *, src_dir_fd=None, dst_dir_fd=None)
renames(old, new)
replace(src, dst, *, src_dir_fd=None, dst_dir_fd=None)
```

`rename()` は、`src` を `dst` に変更 (移動) する。

`renames()` は、`rename()` と同じ処理に加えて、`new` の途中のディレクトリを、必要に応じて作成する。移動したあと、`old` の末尾にある、空になったディレクトリは、削除する。

`replace()` は、`rename()` とほぼ同じだが、`dst` が既にファイルとして存在する場合に、すべてのプラットフォームで、`dst` を置き換える。

| 関数 | `dst` が既に存在するファイルのとき |
| --- | --- |
| `rename()` | Unix では置き換える。Windows では `FileExistsError` になる |
| `replace()` | どのプラットフォームでも置き換える |

### scandir

```python
scandir(path='.')
```

`path` の要素ごとに `os.DirEntry` インスタンスを生成するイテレータを返す。`with` 文で使うと、終了時に、自動的に閉じられる。

```python
import os

with os.scandir(".") as entries:
    for entry in entries:
        print(entry.name, entry.is_dir())
```

### DirEntry

クラス `DirEntry` のインスタンス `d` は、それぞれのアイテムのベース名 `name` と、完全パスを保持する `path` の 2 つの属性に加えて、いくつかのメソッドを提供する。よく使われるものは、以下のとおり。

| メソッド | 説明 |
| --- | --- |
| `is_dir()` | dir である場合に `True` を返す |
| `is_file()` | file である場合に `True` を返す |
| `is_symlink()` | シンボリックリンクである場合に `True` を返す |
| `stat()` | `stat_result` を返す |

<pre><code class="tips">DirEntry のメソッドは、多くの場合、OS への追加の問い合わせが不要で、listdir() の結果に os.path.isdir() などを呼ぶよりも速い。
is_dir() と is_file() は、既定では、シンボリックリンクをたどる。たどりたくないときは、follow_symlinks=False を渡す。</code></pre>

### walk

```python
walk(top, topdown=True, onerror=None, followlinks=False)
```

ディレクトリ `top` から、下の階層を順にたどる。ディレクトリごとに、`(dirpath, dirnames, filenames)` のタプルを返すジェネレータである。

| 値 | 内容 |
| --- | --- |
| `dirpath` | いま見ているディレクトリのパス (文字列) |
| `dirnames` | `dirpath` の直下にある、ディレクトリ名のリスト |
| `filenames` | `dirpath` の直下にある、ファイル名のリスト |

```python
import os

for dirpath, dirnames, filenames in os.walk("."):
    for filename in filenames:
        print(os.path.join(dirpath, filename))
```

<pre><code class="tips">topdown=True のときは、dirnames のリストを、その場で書き換えると、書き換えたあとのディレクトリだけをたどる。.git のような、たどりたくないディレクトリを除くときに使う。</code></pre>

### symlink

```python
symlink(target, symlink_path, target_is_directory=False, *, dir_fd=None)
```

`target` に対して、`symlink_path` という名前のシンボリックリンクを作成する。

`target_is_directory` は、作成されたシンボリックリンクを、ファイルまたはディレクトリとして表すべきかどうかを指定するために、Windows システムでのみ使われる。

<pre><code class="caution">Windows では、シンボリックリンクの作成に、特別な権限 (管理者権限、または開発者モード) が必要になることがある。</code></pre>

---

## os.path のメソッド <a id="os-path" data-name="os.pathのメソッド"></a>

### abspath

```python
abspath(path)
```

`path` が相対パスの場合、絶対パスを返す。ファイルが存在するかどうかの確認は行わない。

### commonpath

```python
commonpath(list)
```

文字列またはパスのようなオブジェクトのリストを受け取り、リストのすべての要素に共通する部分パスのうち、最も長いものを返す。

リストが空である、絶対パスと相対パスが混ざっている、異なるドライブのパスが含まれている場合は、`ValueError` を生成する。`commonprefix()` とは異なり、有効なパスだけを返す。

### commonprefix

```python
commonprefix(list)
```

文字列またはパスのようなオブジェクトのリストを受け取り、リストのすべての要素に共通するプレフィックスのうち、最も長い文字列を返す。
<pre><code class="caution">文字列の共通部分なので、有効なパスが返るとは限らない。</code></pre>

### dirname

```python
dirname(path)
```

`os.path.split(path)[0]` と同様に、パスのディレクトリ部分を返す。
<pre><code class="example">os.path.dirname('b/c/d.e') # 'b/c'</code></pre>

### exists

```python
exists(path)
```

`path` が既存のファイルまたはディレクトリである場合に、`True` を返す。

### isabs

```python
isabs(path)
```

`path` が絶対パスである場合に、`True` を返す。

### isdir

```python
isdir(path)
```

`path` が既存のディレクトリである場合に、`True` を返す。

### isfile

```python
isfile(path)
```

`path` が既存のファイルである場合に、`True` を返す。

### join

```python
join(path, *paths)
```

引数を、現在のプラットフォームの適切なパス区切り文字で結合した文字列を返す。Unix では、隣接するパスの要素を、スラッシュ (`/`) で区切る。

いずれかの引数が絶対パスである場合、その前にある引数は無視される。
<pre><code class="example">os.path.join('a/b', 'c/d', 'e/f') # 'a/b/c/d/e/f'</code></pre>
<pre><code class="example">os.path.join('a/b', '/c/d', 'e/f') # '/c/d/e/f'</code></pre>

### その他のよく使う関数

| 関数 | 内容 | 例 |
| --- | --- | --- |
| `basename(path)` | パスの、最後の要素 (ファイル名) を返す | `os.path.basename('b/c/d.e')` → `'d.e'` |
| `split(path)` | `(dirname, basename)` のタプルを返す | `os.path.split('b/c/d.e')` → `('b/c', 'd.e')` |
| `splitext(path)` | `(拡張子を除いた部分, 拡張子)` のタプルを返す | `os.path.splitext('d.tar.gz')` → `('d.tar', '.gz')` |
| `islink(path)` | シンボリックリンクなら `True` を返す | `os.path.islink('link')` |
| `getsize(path)` | ファイルのサイズ (バイト) を返す | `os.path.getsize('d.e')` |
| `getmtime(path)` | 最終変更時刻を、エポックからの秒数で返す | `os.path.getmtime('d.e')` |
| `normpath(path)` | `.` や `..`、重複した区切り文字を整理する | `os.path.normpath('a/./b/../c')` → `'a/c'` (Unix) |
| `realpath(path)` | シンボリックリンクをたどった、絶対パスを返す | `os.path.realpath('link')` |
| `relpath(path, start)` | `start` からの相対パスを返す | `os.path.relpath('/a/b/c', '/a')` → `'b/c'` (Unix) |
| `expanduser(path)` | 先頭の `~` を、ホームディレクトリに展開する | `os.path.expanduser('~/x')` |
| `expandvars(path)` | `$HOME` などの、環境変数を展開する | `os.path.expandvars('$HOME/x')` |

### パスに関する定数

| 定数 | 内容 |
| --- | --- |
| `os.sep` | パスの区切り文字。Unix では `/`、Windows では `\` |
| `os.pathsep` | `PATH` などの、パスのリストの区切り文字。Unix では `:`、Windows では `;` |
| `os.curdir` | カレントディレクトリを表す文字列 (`.`) |
| `os.pardir` | 親ディレクトリを表す文字列 (`..`) |
| `os.linesep` | 改行の文字列。Unix では `\n`、Windows では `\r\n` |
| `os.name` | OS の種類。Unix 系は `'posix'`、Windows は `'nt'` |

<pre><code class="tips">パスは、文字列を + でつなぐのではなく、os.path.join() で結合する。区切り文字の違いを、自分で気にしなくて済む。
スクリプトと同じ場所のファイルを指すときは、os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data.txt') のように、__file__ を基準にする。</code></pre>

---

## プロセスと環境変数 <a id="process-env" data-name="プロセスと環境変数"></a>

### 環境変数

`os.environ` は、環境変数を保持する、辞書のようなオブジェクトである。キーと値は、どちらも文字列である。

| 書き方 | 内容 |
| --- | --- |
| `os.environ["KEY"]` | 値を取得する。存在しないと `KeyError` になる |
| `os.environ.get("KEY", "default")` | 値を取得する。存在しないときは、`default` を返す |
| `os.getenv("KEY", "default")` | `os.environ.get()` と同じ |
| `os.environ["KEY"] = "value"` | 値を設定する。このプロセスと、子プロセスにだけ反映される |

```python
import os

os.environ["MY_VAR"] = "value"
print(os.environ.get("MY_VAR"))     # value
print(os.getenv("NOT_EXISTS", "-")) # -
```

### プロセスの情報と操作

| 関数 | 内容 |
| --- | --- |
| `os.getpid()` | 現在のプロセスの ID を返す |
| `os.getppid()` | 親プロセスの ID を返す |
| `os.cpu_count()` | CPU の論理コア数を返す。判定できないときは `None` を返す |
| `os.system(command)` | 文字列のコマンドを、シェルで実行し、終了ステータスを返す |
| `os.kill(pid, sig)` | プロセスに、シグナルを送る |
| `os.fork()` | 現在のプロセスを複製する (Unix のみ) |

<pre><code class="caution">os.system() は、文字列をそのままシェルに渡す。外部からの入力を含めると、意図しないコマンドが実行される危険がある。
別のプログラムを実行するときは、subprocess.run(["ls", "-l"], check=True) のように、リストで渡す。プロセスを並列に動かしたいときは、multiprocessing を使う。</code></pre>

---

## 実践例 <a id="example" data-name="実践例"></a>

### ディレクトリを作って、ファイルを一覧する

```python
import os

# 出力先ディレクトリを作成 (存在していてもエラーにしない)
os.makedirs(os.path.join("output", "logs"), exist_ok=True)

# ファイルを作成
path = os.path.join("output", "logs", "a.txt")
with open(path, "w", encoding="utf-8") as f:
    f.write("hello")

# 一覧を表示 (順序は不定なので、sorted() で並べる)
for name in sorted(os.listdir(os.path.join("output", "logs"))):
    print(name)  # a.txt
```

### 拡張子で、ファイルを探す

```python
import os

for dirpath, dirnames, filenames in os.walk("."):
    for filename in filenames:
        if os.path.splitext(filename)[1] == ".py":
            print(os.path.join(dirpath, filename))
```

### ファイルとサイズの一覧

```python
import os

with os.scandir(".") as entries:
    for entry in entries:
        if entry.is_file():
            print(entry.name, entry.stat().st_size)
```

---

## pathlib との対応 <a id="pathlib" data-name="pathlibとの対応"></a>

`pathlib.Path` を使うと、同じ操作を、オブジェクトのメソッドとして書ける。

| os / os.path | pathlib |
| --- | --- |
| `os.getcwd()` | `Path.cwd()` |
| `os.listdir(p)` | `Path(p).iterdir()` |
| `os.mkdir(p)` | `Path(p).mkdir()` |
| `os.makedirs(p, exist_ok=True)` | `Path(p).mkdir(parents=True, exist_ok=True)` |
| `os.remove(p)` | `Path(p).unlink()` |
| `os.rmdir(p)` | `Path(p).rmdir()` |
| `os.rename(a, b)` | `Path(a).rename(b)` |
| `os.replace(a, b)` | `Path(a).replace(b)` |
| `os.stat(p)` | `Path(p).stat()` |
| `os.symlink(t, l)` | `Path(l).symlink_to(t)` |
| `os.walk(p)` | `Path(p).walk()` (Python 3.12 以降) |
| `os.path.exists(p)` | `Path(p).exists()` |
| `os.path.isfile(p)` | `Path(p).is_file()` |
| `os.path.isdir(p)` | `Path(p).is_dir()` |
| `os.path.join(a, b)` | `Path(a) / b` |
| `os.path.basename(p)` | `Path(p).name` |
| `os.path.dirname(p)` | `Path(p).parent` |
| `os.path.splitext(p)` | `Path(p).suffix` と `Path(p).stem` |
| `os.path.abspath(p)` | `Path(p).absolute()` |
| `os.path.realpath(p)` | `Path(p).resolve()` |
| `os.path.expanduser('~')` | `Path.home()` |

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `AttributeError: module 'os' has no attribute 'mkdirs'` | 関数名が違う | `os.makedirs()` と書く |
| `makedirs()` で `FileExistsError` になる | ディレクトリが既に存在する | `exist_ok=True` を渡す |
| `rmdir()` で `OSError` になる | ディレクトリが空ではない | 中身を先に削除する。まとめて削除するときは、`shutil.rmtree()` を使う |
| Windows で `rename()` が `FileExistsError` になる | 移動先のファイルが、既に存在する | `os.replace()` を使う |
| Windows で `chmod()` を呼んでも、権限が変わらない | 読み取り専用の属性しか、変更できない | 読み取り専用以外の権限は、Windows の ACL の仕組みで設定する |
| `os.path.join('a', '/b')` が `'/b'` になる | 絶対パスの引数があると、その前の引数が無視される | 後ろの引数が、絶対パスになっていないか確認する |
| 相対パスのファイルが見つからない | 相対パスは、スクリプトの場所ではなく、現在の作業ディレクトリが基準になる | `__file__` を基準に、絶対パスを組み立てる |
| `listdir()` の順序が、環境によって違う | 順序が不定である | `sorted()` で並べる |
| `os.chdir()` を呼んだら、他の処理のパスが壊れた | 作業ディレクトリが、プロセス全体で共有される | 絶対パスを使う。または、`contextlib.chdir()` を使う |
| `os.environ["KEY"]` で `KeyError` になる | 環境変数が設定されていない | `os.environ.get("KEY")` を使う |
| `os.path.exists()` で確認したのに、`open()` で `FileNotFoundError` になる | 確認と、実際の操作の間に、ファイルが削除された | 先に確認せず、`try` / `except` で処理する |
| `os.system()` で、意図しないコマンドが実行される | 入力を、そのままシェルに渡している | `subprocess.run()` に、リストで渡す |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| `pathlib` | パスを、オブジェクトとして扱う標準ライブラリ。新しいコードでは、こちらを使うことが多い |
| `shutil` | ファイルやディレクトリの、コピー、移動、再帰的な削除 (`copy()`、`move()`、`rmtree()`) |
| `glob` | ワイルドカード (`*.txt` など) で、ファイルを検索する |
| `tempfile` | 一時ファイルや、一時ディレクトリを作成する |
| `subprocess` | 外部のプログラムを実行する。`os.system()` の代わりに使う |
| `stat` | `stat_result` の `st_mode` を読み取る関数や、`chmod()` に渡す定数 |
