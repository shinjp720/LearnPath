---
title: shutil
layout: default
---

# shutil <a id="top" data-name="TOP"></a>

`shutil` (shell utilities) モジュールは、ファイルのコピーと移動を行う関数と、ディレクトリツリー全体を削除する関数を提供する。

標準ライブラリに含まれるため、インストールは不要である。`os` モジュールが、ファイルやディレクトリの、1つ1つの操作を扱うのに対して、`shutil` は、コピー、移動、再帰的な削除、アーカイブのような、**まとまった操作**を扱う。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 標準ライブラリ | インストール不要。`import shutil` で使える |
| コピー | ファイル (`copy` 系) と、ディレクトリツリー (`copytree`) をコピーする |
| 移動と削除 | `move` で移動する。`rmtree` で、ディレクトリツリーを削除する |
| アーカイブ | `make_archive` と `unpack_archive` で、zip や tar を作成、展開する |
| その他 | ディスクの使用量、コマンドの検索、端末サイズの取得など |
| パスの型 | `str` と `Path` の、どちらも渡せる |

### 主な関数

| 用途 | 関数 |
| --- | --- |
| ファイルのコピー | `copy()`、`copy2()`、`copyfile()`、`copyfileobj()` |
| 権限、メタデータのコピー | `copymode()`、`copystat()` |
| ディレクトリのコピー | `copytree()`、`ignore_patterns()` |
| 移動 | `move()` |
| 削除 | `rmtree()` |
| アーカイブ | `make_archive()`、`unpack_archive()` |
| ディスク、コマンド | `disk_usage()`、`which()`、`get_terminal_size()` |

### 他の方法との比較

| 操作 | `os`、`pathlib` | `shutil` |
| --- | --- | --- |
| ファイルのコピー | 標準の関数はない (自分で読み書きする) | `shutil.copy()` |
| ディレクトリのコピー | 標準の関数はない | `shutil.copytree()` |
| ファイルの移動 | `os.rename()`、`Path.rename()` (同じファイルシステム内のみ) | `shutil.move()` (別のファイルシステムにも移動できる) |
| 空のディレクトリの削除 | `os.rmdir()`、`Path.rmdir()` | 不要 |
| 中身のあるディレクトリの削除 | 標準の関数はない | `shutil.rmtree()` |

<pre><code class="caution">このドキュメントは、Python 3.12 以降を前提にしている。
rmtree() の onexc 引数は、Python 3.12 で追加された。古い onerror 引数は、非推奨である。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

標準ライブラリのため、`import` するだけで使える。

```python
import shutil
```

以降のサンプルでは、実際のファイルを壊さないように、一時ディレクトリ (`tempfile.TemporaryDirectory()`) の中で操作する。

```python
import shutil
import tempfile
from pathlib import Path
```

---

## 主な関数 <a id="functions" data-name="主な関数"></a>

### `copy(src, dst, *, follow_symlinks=True)`

ファイル `src` (ファイルは存在していなければならない) の内容のコピーで、ファイル `dst` を作成、または上書きする。<br>
`dst` がディレクトリの場合、`src` と同じベース名で `dst` に配置される。<br>
コピーしたファイルに対するパスを返す。

内容と、ファイルの権限 (パーミッション) をコピーする。更新日時などの、その他のメタデータは、コピーされない。

`follow_symlinks=False` を指定すると、`src` がシンボリックリンクのときに、リンクの指す先ではなく、リンクそのものを `dst` に作る。

```python
import shutil
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "a.txt"
    src.write_text("hello", encoding="utf-8")
    (base / "dir").mkdir()

    result = shutil.copy(src, base / "dir")  # dst がディレクトリなので、dir/a.txt になる
    print(Path(result).relative_to(base).as_posix())
```

```text
dir/a.txt
```

<pre><code class="caution">dst が存在しないパスのときは、その名前のファイルが作られる (ディレクトリは作られない)。
dst の親ディレクトリが存在しないと、FileNotFoundError になる。</code></pre>

### `copytree(src, dst, symlinks=False, ignore=None, copy_function=copy2, ignore_dangling_symlinks=False, dirs_exist_ok=False)`

ディレクトリ `src` をルートとするディレクトリツリーをディレクトリ `dst` にコピーする。<br>
`dirs_exist_ok` を `True` とすると、コピー先に既に存在する場合に上書きされる。デフォルトでは `FileExistsError` が発生する。

`dirs_exist_ok=True` のとき、既存のディレクトリの中身は、削除されず、**マージ**される。同名のファイルだけが、上書きされる。この引数は、Python 3.8 で追加された。

| 引数 | 内容 |
| --- | --- |
| `symlinks` | `True` なら、シンボリックリンクを、リンクのままコピーする。`False` なら、リンク先の中身をコピーする |
| `ignore` | コピーしないファイルを決める関数。`shutil.ignore_patterns()` で作れる |
| `copy_function` | ファイルのコピーに使う関数 (既定は `copy2`) |
| `ignore_dangling_symlinks` | `True` なら、リンク先のない、シンボリックリンクを無視する |
| `dirs_exist_ok` | `True` なら、コピー先が存在していても、エラーにしない |

```python
import shutil
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "src"
    (src / "sub").mkdir(parents=True)
    (src / "a.txt").write_text("a", encoding="utf-8")
    (src / "b.pyc").write_text("b", encoding="utf-8")
    (src / "sub" / "c.txt").write_text("c", encoding="utf-8")

    dst = base / "dst"
    shutil.copytree(src, dst, ignore=shutil.ignore_patterns("*.pyc"))  # .pyc を除いてコピーする
    print(sorted(p.relative_to(dst).as_posix() for p in dst.rglob("*")))

    try:
        shutil.copytree(src, dst)
    except FileExistsError:
        print("FileExistsError")

    shutil.copytree(src, dst, dirs_exist_ok=True)  # 既存の dst に、マージする
```

```text
['a.txt', 'sub', 'sub/c.txt']
FileExistsError
```

### `move(src, dst, copy_function=copy2)`

ファイルまたはディレクトリ `src` をファイルまたはディレクトリ `dst` に移動する。

`dst` が存在するディレクトリのときは、その中に `src` が移動される。移動先のパスが、戻り値として返る。<br>
同じファイルシステム内では、名前の付け替え (`os.rename()`) で移動する。別のファイルシステムへの移動では、`copy_function` でコピーしたあとに、`src` を削除する。

```python
import shutil
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "a.txt"
    src.write_text("hello", encoding="utf-8")
    (base / "dir").mkdir()

    result = shutil.move(src, base / "dir")
    print(Path(result).relative_to(base).as_posix())
    print(src.exists())
```

```text
dir/a.txt
False
```

<pre><code class="caution">dst のディレクトリの中に、同名のファイルやディレクトリがあると、shutil.Error になる。
dst が、既存のファイルのときは、環境によって、上書きされることがある。事前に、存在を確認する。</code></pre>

### `rmtree(path, ignore_errors=False, onerror=None, *, onexc=None, dir_fd=None)`

指定したディレクトリ `path` とその中にあるすべてのファイルやサブディレクトリを再帰的に削除する。<br>
`ignore_errors=True` とすると、削除時にエラーが出ても無視する。

| 引数 | 内容 |
| --- | --- |
| `ignore_errors` | `True` なら、削除時のエラーを無視する。存在しない `path` も、エラーにならない |
| `onexc` | エラー時に呼ばれる関数 `onexc(function, path, exception)`。Python 3.12 以降 |
| `onerror` | 古い形式。第3引数が `sys.exc_info()` のタプルになる。Python 3.12 で非推奨 |
| `dir_fd` | ディレクトリ記述子からの、相対パスで指定する (Python 3.11 以降。対応する環境のみ) |

```python
import shutil
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    target = Path(tmp) / "target"
    (target / "sub").mkdir(parents=True)
    (target / "sub" / "a.txt").write_text("a", encoding="utf-8")

    shutil.rmtree(target)
    print(target.exists())

    shutil.rmtree(target, ignore_errors=True)  # 存在しなくても、エラーにならない
    try:
        shutil.rmtree(target)
    except FileNotFoundError:
        print("FileNotFoundError")
```

```text
False
FileNotFoundError
```

#### 読み取り専用ファイルの削除

Windows では、読み取り専用のファイルを含むディレクトリを、`rmtree()` で削除すると、`PermissionError` になる。`onexc` に、権限を変更して、やり直す関数を渡す。

```python
import os
import shutil
import stat
import tempfile
from pathlib import Path


def remove_readonly(func, path, exc):
    """権限を書き込み可能にして、失敗した操作をやり直す"""
    os.chmod(path, stat.S_IWRITE)
    func(path)


with tempfile.TemporaryDirectory() as tmp:
    target = Path(tmp) / "target"
    target.mkdir()
    file = target / "readonly.txt"
    file.write_text("a", encoding="utf-8")
    file.chmod(stat.S_IREAD)  # 読み取り専用にする

    shutil.rmtree(target, onexc=remove_readonly)
    print(target.exists())
```

```text
False
```

<pre><code class="tips">Python 3.11 以前では、onexc がないため、onerror を使う。関数の第3引数は、例外ではなく、sys.exc_info() のタプルになる。</code></pre>

<pre><code class="caution">rmtree() は、ごみ箱を経由せず、確認もなく、すべてを削除する。取り消せない。
path に、変数の値や、ユーザーの入力を使うときは、削除してよいパスか、事前に確認する。
path が、シンボリックリンクのときは、OSError になる。</code></pre>

---

## copy 系の関数の使い分け <a id="copy-family" data-name="copy系の使い分け"></a>

| 関数 | 内容 | `dst` にディレクトリ | メタデータ |
| --- | --- | --- | --- |
| `copyfile(src, dst)` | 内容だけをコピーする | ✕ (ファイルのパスを渡す) | コピーしない |
| `copy(src, dst)` | 内容と、権限をコピーする | ○ | 権限のみ |
| `copy2(src, dst)` | `copy` に加えて、更新日時などもコピーする | ○ | できる限りコピーする |
| `copyfileobj(fsrc, fdst)` | 開いているファイルオブジェクトの間でコピーする | (ファイルオブジェクトを渡す) | コピーしない |

| 補助の関数 | 内容 |
| --- | --- |
| `copymode(src, dst)` | 権限だけを、コピーする |
| `copystat(src, dst)` | 権限、更新日時などを、コピーする (内容はコピーしない) |

```python
import os
import shutil
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "a.txt"
    src.write_text("hello", encoding="utf-8")
    os.utime(src, (0, 0))  # 更新日時を、1970年1月1日にする

    shutil.copy(src, base / "b.txt")
    shutil.copy2(src, base / "c.txt")
    print((base / "b.txt").stat().st_mtime > 0)  # copy は、更新日時を引き継がない
    print((base / "c.txt").stat().st_mtime)      # copy2 は、更新日時を引き継ぐ
```

```text
True
0.0
```

<pre><code class="tips">更新日時を残したいときは、copy2 を使う。copytree() の既定のコピー関数も、copy2 である。</code></pre>

---

## アーカイブ <a id="archive" data-name="アーカイブ"></a>

### make_archive (アーカイブを作る)

`make_archive(base_name, format, root_dir=None, base_dir=None)` は、ディレクトリを、zip や tar のアーカイブにまとめる。作成したアーカイブのパスを返す。

| 引数 | 内容 |
| --- | --- |
| `base_name` | 作るアーカイブの名前 (拡張子なし)。パスを含められる |
| `format` | `"zip"`、`"tar"`、`"gztar"`、`"bztar"`、`"xztar"` など |
| `root_dir` | アーカイブの、起点となるディレクトリ |
| `base_dir` | アーカイブに入れる、`root_dir` からの相対パス |

`get_archive_formats()` で、使える形式の一覧を確認できる。

### unpack_archive (アーカイブを展開する)

`unpack_archive(filename, extract_dir=None, format=None)` は、アーカイブを展開する。`format` を省略すると、拡張子から判断する。

```python
import shutil
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "src"
    (src / "sub").mkdir(parents=True)
    (src / "a.txt").write_text("a", encoding="utf-8")
    (src / "sub" / "b.txt").write_text("b", encoding="utf-8")

    archive = shutil.make_archive(str(base / "backup"), "zip", root_dir=src)
    print(Path(archive).name)

    out = base / "out"
    shutil.unpack_archive(archive, out)
    print(sorted(p.relative_to(out).as_posix() for p in out.rglob("*")))
```

```text
backup.zip
['a.txt', 'sub', 'sub/b.txt']
```

<pre><code class="caution">出所の分からないアーカイブを、unpack_archive() で展開しない。意図しない場所に、ファイルが書き込まれるおそれがある。
tar 系の展開の安全性を高める filter 引数については、公式のドキュメントで確認する。</code></pre>

---

## ディスクとコマンドの情報 <a id="system-info" data-name="ディスクとコマンド"></a>

| 関数 | 内容 | 戻り値 |
| --- | --- | --- |
| `disk_usage(path)` | `path` があるディスクの使用量 | `total`、`used`、`free` を持つ名前付きタプル (バイト) |
| `which(cmd)` | `PATH` から、コマンドの実行ファイルを探す | パス。見つからなければ `None` |
| `get_terminal_size(fallback=(80, 24))` | 端末の大きさ | `columns`、`lines` を持つ名前付きタプル |
| `chown(path, user=None, group=None)` | 所有者とグループを変更する (POSIX のみ) | なし |

```python
import shutil

usage = shutil.disk_usage(".")
print(usage.total, usage.used, usage.free)

print(shutil.which("python3"))

size = shutil.get_terminal_size()
print(size.columns, size.lines)
```

```text
982820896768 130743676928 802078171136
/usr/bin/python3
80 24
```

値は、環境によって異なる。

<pre><code class="tips">外部コマンドを subprocess で実行する前に、shutil.which() で存在を確認すると、FileNotFoundError を避けられる。「subprocess」のドキュメントを参照。</code></pre>

---

## 実践例 <a id="examples" data-name="実践例"></a>

### 古いものを消す、バックアップ関数

ディレクトリを、日時つきの zip にまとめて、新しい `keep` 個だけを残す。

```python
import shutil
import tempfile
from datetime import datetime
from pathlib import Path


def backup_dir(src, dest_root, stamp=None, keep=3):
    """src を zip にして、dest_root に置く。古い zip は、keep 個を残して削除する"""
    src = Path(src)
    dest_root = Path(dest_root)
    dest_root.mkdir(parents=True, exist_ok=True)
    stamp = stamp or datetime.now().strftime("%Y%m%d-%H%M%S")

    archive = shutil.make_archive(
        str(dest_root / f"{src.name}-{stamp}"),
        "zip",
        root_dir=src.parent,
        base_dir=src.name,
    )

    # 名前に日時が入っているため、名前順が、古い順になる
    for old in sorted(dest_root.glob(f"{src.name}-*.zip"))[:-keep]:
        old.unlink()
    return Path(archive)


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    data = base / "data"
    data.mkdir()
    (data / "a.txt").write_text("a", encoding="utf-8")

    for i in range(1, 6):
        backup_dir(data, base / "backup", stamp=f"2026112{i}")

    print([p.name for p in sorted((base / "backup").iterdir())])
```

```text
['data-20261123.zip', 'data-20261124.zip', 'data-20261125.zip']
```

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `FileExistsError` (`copytree`) | コピー先のディレクトリが、既に存在する | `dirs_exist_ok=True` を指定する (Python 3.8 以降)。マージされる |
| `IsADirectoryError` (`copy`) | `src` が、ディレクトリである | ディレクトリは、`copytree()` でコピーする |
| `copy()` のコピー先が、ファイルになった | `dst` が、存在しないパスで、ディレクトリとして扱われなかった | 先に、`Path(dst).mkdir(parents=True, exist_ok=True)` で作る |
| コピーしたファイルの、更新日時が変わった | `copy()` は、更新日時をコピーしない | `copy2()` を使う |
| `shutil.Error` (`already exists`、`move`) | 移動先のディレクトリに、同名のものがある | 先に、削除するか、別の名前にする |
| `PermissionError` (`rmtree`、Windows) | 読み取り専用のファイルが、含まれている | `onexc` で、権限を変更して、やり直す |
| `OSError` (`rmtree`) | `path` が、シンボリックリンクである | リンクは、`os.unlink()` や `Path.unlink()` で削除する |
| `DeprecationWarning` (`onerror`) | Python 3.12 で、`onerror` が非推奨になった | `onexc` に書き換える。第3引数が、例外のオブジェクトになる |
| 削除したものが、元に戻らない | `rmtree()` は、ごみ箱を使わない | 削除前に、`path` を確認する。大事なデータは、バックアップを取る |
| `copytree` で、リンク切れのエラー | リンク先のない、シンボリックリンクが含まれている | `ignore_dangling_symlinks=True` を指定する。または `symlinks=True` |
| `FileNotFoundError` (`copy`) | `src` が存在しない。または、`dst` の親ディレクトリが存在しない | パスを確認する。親ディレクトリを、先に作る |

---

## 関連 <a id="related" data-name="関連"></a>

| モジュール、ドキュメント | 用途 |
| --- | --- |
| `os` | ファイルやディレクトリの、1つ1つの操作。「os」のドキュメントを参照 |
| `pathlib` | パスをオブジェクトとして扱う。`Path.rename()`、`Path.unlink()` など |
| `tempfile` | 一時ファイル、一時ディレクトリの作成 |
| `glob` | パターンに一致する、ファイルの検索 |
| `zipfile`、`tarfile` | アーカイブを、細かく操作する (`shutil` の下で使われている) |
| `subprocess` | 外部コマンドの実行。「subprocess」のドキュメントを参照 |
