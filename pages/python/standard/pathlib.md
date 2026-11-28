---
title: pathlib
layout: default
---

# pathlib <a id="top" data-name="TOP"></a>

`pathlib` モジュールは、ファイルシステムのパスを、文字列ではなく、**オブジェクト**として扱うためのモジュール。`/` 演算子でパスを結合でき、ファイルの読み書き、ディレクトリの作成、検索なども、パスオブジェクトのメソッドで書ける。

標準ライブラリに含まれるため、インストールは不要である。OS ごとの、パスの区切り文字の違いは、吸収される。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| オブジェクト指向 | パスを `Path` オブジェクトとして扱い、属性とメソッドで操作する |
| `/` 演算子 | `Path('/home/user') / 'documents'` のように、パスを結合できる |
| OS の違いの吸収 | Unix は `/`、Windows は `\` といった区切り文字の違いを、意識しなくてよい |
| まとまった操作 | `read_text()`、`write_text()`、`glob()`、`mkdir()` など、よく使う操作が、メソッドにある |
| 標準ライブラリ | インストール不要 |

### クラス

| クラス | 内容 |
| --- | --- |
| `PurePath` | ファイルシステムにアクセスしない、パスの計算だけを行う。`PurePosixPath` と `PureWindowsPath` がある |
| `Path` | 実際のファイルシステムを操作できる。`PurePath` を継承している |
| `PosixPath`、`WindowsPath` | `Path` の、OS ごとの実体。`Path(...)` を呼ぶと、実行環境に合わせて、どちらかになる |

通常は、`Path` だけを使う。別の OS 形式のパスを、計算だけで扱いたいときは、`PureWindowsPath` などを使う。

### バージョンごとの追加

| Python | 追加された機能 |
| --- | --- |
| 3.12 | `Path.walk()`、`is_junction()`、`relative_to(walk_up=True)`、`with_segments()`。`exists()` などの `follow_symlinks` 引数。`glob()` などの `case_sensitive` 引数 |
| 3.13 | `PurePath.full_match()`、`Path.from_uri()`、`UnsupportedOperation` |
| 3.14 | `Path.copy()`、`copy_into()`、`move()`、`move_into()`、`Path.info` |

<pre><code class="caution">このドキュメントは、Python 3.12 以降を前提にしている。
Python 3.14 で追加された copy() や move() は、このドキュメントのサンプルでは、実行して確認していない。
古い Python では、使えないメソッドがある。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

標準ライブラリのため、`import` するだけで使える。通常は、`Path` だけを `import` する。

```python
from pathlib import Path
```

以降のサンプルでは、実際のファイルを壊さないように、一時ディレクトリ (`tempfile.TemporaryDirectory()`) の中で操作する。

```python
import tempfile
from pathlib import Path
```

---

## 基本的な使い方 <a id="basic" data-name="基本的な使い方"></a>

```python
from pathlib import Path

# 現在のディレクトリ
current_dir = Path('.')

# 絶対パスの取得
absolute_path = current_dir.resolve()

# 任意のパスを作成
path = Path('/home/user/documents')
```

| 作り方 | 内容 |
| --- | --- |
| `Path('.')` | 現在のディレクトリを表す相対パス |
| `Path.cwd()` | 現在の作業ディレクトリを、絶対パスで返す |
| `Path.home()` | ユーザーのホームディレクトリを返す |
| `Path('a', 'b', 'c.txt')` | 複数の要素を渡すと、結合される (`a/b/c.txt`) |

`Path` オブジェクトを、文字列として使いたいときは、`str(path)` を使う。多くの標準ライブラリの関数は、`Path` をそのまま受け取れる。

<pre><code class="caution">Path('~/memo.txt') の ~ は、ホームディレクトリに展開されない。
展開するときは、expanduser() を呼ぶ。</code></pre>

---

## パスの結合 <a id="join" data-name="パスの結合"></a>

```python
base_path = Path('/home/user')
new_path = base_path / 'documents' / 'file.txt'
print(new_path)  # /home/user/documents/file.txt
```

Windows では、区切り文字が `\` になり、`\home\user\documents\file.txt` のように表示される。

### パスの組み立てと変換

| メソッド | 内容 |
| --- | --- |
| `p.joinpath(*other)` | `/` 演算子と同じく、パスを結合する |
| `p.with_name(name)` | 最後の要素 (ファイル名) を置き換える |
| `p.with_suffix(suffix)` | 拡張子を置き換える。`suffix` は `'.txt'` のように、`.` から始める |
| `p.with_stem(stem)` | 拡張子を除いた部分を置き換える |
| `p.relative_to(other)` | `other` からの相対パスを返す |
| `p.is_relative_to(other)` | `other` の下にあるか判定する |
| `p.expanduser()` | 先頭の `~` を、ホームディレクトリに展開する |
| `p.absolute()` | 絶対パスにする (`..` やシンボリックリンクは、解決しない) |
| `p.as_posix()` | 区切り文字を `/` にした、文字列を返す |

```python
from pathlib import Path

p = Path('/usr/local/lib/python3.12/site.py')
print(p.with_name('os.py'))
print(p.with_suffix('.txt'))
print(p.with_stem('sitecustomize'))
print(p.relative_to('/usr/local'))
print(p.is_relative_to('/usr'))
```

```text
/usr/local/lib/python3.12/os.py
/usr/local/lib/python3.12/site.txt
/usr/local/lib/python3.12/sitecustomize.py
lib/python3.12/site.py
True
```

<pre><code class="caution">/ の右辺に、絶対パスを渡すと、左辺は捨てられて、右辺のパスになる。
Path('/home/user') / '/etc' は、/etc になる。</code></pre>

---

## パスオブジェクトの属性 <a id="attributes" data-name="パスオブジェクトの属性"></a>

Unix では `p = Path("/usr/bin/python")`、Windows では `p = Path(r"c:\Python3\python.exe")` を例にした値。

| 属性 | 説明 | Unix の値 | Windows の値 |
| --- | --- | --- | --- |
| `anchor` | `drive` と `root` の結合 | `'/'` | `'c:\\'` |
| `drive` | `p` のドライブ文字 | `''` | `'c:'` |
| `name` | `p` の最後の要素 | `'python'` | `'python.exe'` |
| `parent` | `p` の親ディレクトリ | `Path('/usr/bin')` | `Path('c:\\Python3')` |
| `parents` | `p` の祖先ディレクトリ | `(Path('/usr/bin'), Path('/usr'), Path('/'))` | `(Path('c:\\Python3'), Path('c:\\'))` |
| `parts` | `p` のすべての要素からなるタプル | `('/', 'usr', 'bin', 'python')` | `('c:\\', 'Python3', 'python.exe')` |
| `root` | `p` のルートディレクトリ | `'/'` | `'\\'` |
| `stem` | `p` の `name` 部分から拡張子を取り除いたもの | `'python'` | `'python'` |
| `suffix` | `p` の末尾の拡張子 | `''` | `'.exe'` |
| `suffixes` | `p` のすべての拡張子からなるリスト | `[]` | `['.exe']` |

`parents` は、実際には、タプルではなく、インデックスで参照できるシーケンスで、上の表は、中身を、タプルの形で示している。<br>
Windows の値は、実際の表示 (repr) では、`PureWindowsPath('c:/Python3')` のように、区切りが `/` になる。

<pre><code class="caution">拡張子が複数あるファイルでは、suffix は最後の1つだけを返す。
Path('a.tar.gz').suffix は '.gz' で、suffixes は ['.tar', '.gz'] になる。</code></pre>

---

## メソッド <a id="methods" data-name="メソッド"></a>

`p` は、`Path` オブジェクト。

| メソッド | 説明 |
| --- | --- |
| `p.chmod(mode, *, follow_symlinks=True)` | `chmod()` は、`os.chmod()` と同じように、ファイルのモードとパーミッションを変更する。Unix プラットフォームで、シンボリックリンクのリンク先ではなくシンボリックリンク自体のパーミッションを変更する場合は、`follow_symlinks=False` を渡すか `lchmod()` を使う |
| `p.lchmod(mode)` | `chmod()` に `follow_symlinks=False` を渡したときと同じ。シンボリックリンク自体のパーミッションを変更する |
| `pathlib.Path.cwd()` | 現在の作業ディレクトリをパスオブジェクトとして返す |
| `p.exists(*, follow_symlinks=True)` | `p` が既存のファイルまたはディレクトリを表している (あるいは既存のファイルまたはディレクトリを指しているシンボリックリンクである) 場合に `True` を返す。それ以外は `False` を返す |
| `p.glob(pattern, *, case_sensitive=None)` | ディレクトリ `p` において `pattern` とマッチするすべてのファイルを任意の順序で返す。`pattern` には、`p` またはサブディレクトリでの再帰グロブを許可する `**` が含まれていてもよい |
| `p.rglob(pattern, *, case_sensitive=None)` | 常に、`pattern` が `'**/'` で始まっているかのように、`p` とすべてのサブディレクトリで再帰グロブを実行する |
| `pathlib.Path.home()` | ユーザーのホームディレクトリをパスオブジェクトとして返す |
| `p.is_dir()` | `p` が既存のディレクトリ (またはディレクトリに対するシンボリックリンク) である場合に `True` を返す。それ以外は `False` を返す |
| `p.is_file()` | `p` が既存のファイル (またはファイルに対するシンボリックリンク) である場合に `True` を返す。それ以外は `False` を返す |
| `p.is_mount()` | `p` がマウントポイント (ファイルシステムにおいて異なるファイルシステムがマウントされているポイント) である場合に `True` を返す。それ以外は `False` を返す |
| `p.is_symlink()` | `p` が既存のシンボリックリンクである場合に `True` を返す。それ以外は `False` を返す |
| `p.iterdir()` | ディレクトリ `p` の内容 (`'.'` と `'..'` は含まない) に対するファイルとディレクトリのパスオブジェクトをイテレータとして返す。再帰的には走査しないので、サブディレクトリ内のファイルまで含めて取得したい場合は、`rglob()` や `glob()` を使う必要がある。`.gitignore` のような隠しファイルも含めて返す |
| `p.mkdir(mode=0o777, parents=False, exist_ok=False)` | パス `p` に新しいディレクトリを作成する。ファイルのモードとアクセスフラグは `mode` に基づいて設定する。欠けている親ディレクトリがあったら必要に応じて作成するには、`parents=True` を渡す。`FileExistsError` 例外を無視したい場合は、`exist_ok=True` を渡す |
| `p.open(mode='r', buffering=-1, encoding=None, errors=None, newline=None)` | 組み込み関数 `open(p)` と同様に (他の引数は同じであるとして)、パス `p` が指しているファイルを開く |
| `p.read_bytes()` | `p` の内容を `bytes` オブジェクトとして返す |
| `p.read_text(encoding=None, errors=None)` | `p` の文字列としてデコードされた内容を返す |
| `p.readlink()` | シンボリックリンクが指しているパスを返す |
| `p.rename(target)` | `p` を `target` に置き換え、`target` を指している新しいパスオブジェクトを返す。`target` は文字列 (絶対パスまたは相対パス)。ただし、相対パスは `p` のディレクトリではなく現在の作業ディレクトリに対する相対パスと解釈される。`target` が既存のファイルまたは空のディレクトリである場合、Unix では、ユーザーがパーミッションを持っていれば、警告なしに書き換える。Windows では、`FileExistsError` を生成する |
| `p.resolve(strict=False)` | `p` の絶対パスを返す。`..` とシンボリックリンクも解決する。`strict=True` のとき、パスが存在しないと `FileNotFoundError` になる |
| `p.rmdir()` | ディレクトリ `p` を削除する。`p` が空ではない場合は、`OSError` を生成する |
| `p.samefile(target)` | `p` と `target` が同じファイルを指している場合は `True` を返す。それ以外の場合は `False` を返す。`target` は文字列またはパスオブジェクト |
| `p.stat(*, follow_symlinks=True)` | パスオブジェクトに関する情報を返す。属性は、下の「stat_result インスタンスの属性」の表を参照 |
| `p.touch(mode=0o666, exist_ok=True)` | Unix の `touch` 同様に、パス `p` で空のファイルを作成する。ファイルがすでに存在する場合、`exist_ok=True` であれば最終変更時刻を現在の時刻に更新し、`exist_ok=False` であれば `FileExistsError` を生成する |
| `p.unlink(missing_ok=False)` | ファイルまたはシンボリックリンク `p` を削除する。`FileNotFoundError` を無視するには、`missing_ok=True` を渡す |

### stat_result インスタンスの属性

| インデックス | 属性名 | 意味 |
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

<pre><code class="example">print(p.stat().st_size)</code></pre>

<pre><code class="tips">st_ctime の意味は、OS によって異なる。作成時刻を使いたいときは、公式のドキュメントで、環境ごとの扱いを確認する。</code></pre>

### メソッド (追加)

元の表にない、よく使うメソッド。

| メソッド | 内容 |
| --- | --- |
| `p.write_text(data, encoding=None, errors=None, newline=None)` | 文字列を書き込む。ファイルが存在すれば、上書きする。書き込んだ文字数を返す |
| `p.write_bytes(data)` | `bytes` を書き込む。ファイルが存在すれば、上書きする |
| `p.replace(target)` | `rename()` と同じだが、`target` が既存のファイルでも、OS を問わず、上書きする |
| `p.walk(top_down=True, on_error=None, follow_symlinks=False)` | ディレクトリツリーを、`(dirpath, dirnames, filenames)` の形で、再帰的に走査する (Python 3.12 以降) |
| `p.symlink_to(target)` | `p` に、`target` を指すシンボリックリンクを作る |
| `p.hardlink_to(target)` | `p` に、`target` へのハードリンクを作る |
| `p.lstat()` | `stat()` と同じだが、シンボリックリンクの場合、リンク自体の情報を返す |
| `p.owner()`、`p.group()` | ファイルの所有者名、グループ名 (Unix のみ) |
| `p.is_absolute()` | 絶対パスか判定する |
| `p.match(pattern)` | パスが、グロブ形式のパターンに一致するか判定する (右側から比較する) |
| `p.full_match(pattern)` | パス全体が、グロブ形式のパターンに一致するか判定する (Python 3.13 以降) |
| `Path.from_uri(uri)` | `file:///...` 形式の URI から、`Path` を作る (Python 3.13 以降) |
| `p.copy(target)`、`p.move(target)` | ファイルやディレクトリツリーを、コピー、移動する (Python 3.14 以降)。`copy_into()`、`move_into()` は、既存のディレクトリの中へ、コピー、移動する |

---

## 使い方の例 <a id="usage" data-name="使い方の例"></a>

### ファイルの読み書き

`write_text()` と `read_text()` で、ファイルを開かずに、文字列を読み書きできる。

```python
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    p = Path(tmp) / 'memo.txt'
    p.write_text('こんにちは\n', encoding='utf-8')
    print(p.read_text(encoding='utf-8'), end='')
    print(p.stat().st_size)  # バイト数
```

```text
こんにちは
16
```

<pre><code class="tips">read_text() と write_text() には、encoding を指定する。省略すると、環境の既定の文字コードが使われ、環境によって、文字化けする。</code></pre>

### ディレクトリの作成と検索

```python
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    (base / 'a' / 'b').mkdir(parents=True, exist_ok=True)
    (base / 'a' / 'x.py').touch()
    (base / 'a' / 'b' / 'y.py').touch()
    (base / 'a' / 'z.txt').touch()

    print(sorted(p.name for p in (base / 'a').iterdir()))
    print(sorted(p.name for p in (base / 'a').glob('*.py')))
    print(sorted(p.name for p in (base / 'a').rglob('*.py')))
```

```text
['b', 'x.py', 'z.txt']
['x.py']
['x.py', 'y.py']
```

`glob()` と `iterdir()` は、順序が決まっていない。順序が必要なときは、`sorted()` を使う。

### 名前の変更と削除

```python
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / 'a.txt'
    src.touch()

    dst = src.rename(base / 'b.txt')  # 新しいパスオブジェクトが返る
    print(dst.name)

    dst.unlink()
    dst.unlink(missing_ok=True)  # 存在しなくても、エラーにならない

    (base / 'dir').mkdir()
    (base / 'dir' / 'c.txt').touch()
    try:
        (base / 'dir').rmdir()
    except OSError:
        print('OSError')  # 空でないディレクトリは、rmdir() で削除できない
```

```text
b.txt
OSError
```

中身のあるディレクトリを削除するときは、`shutil.rmtree()` を使う。「shutil」のドキュメントを参照。

### ディレクトリツリーの走査 (walk)

`walk()` は、`os.walk()` の `pathlib` 版で、`dirpath` が `Path` になる。

```python
import tempfile
from pathlib import Path

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    (base / 'a' / 'b').mkdir(parents=True)
    (base / 'a' / 'x.py').touch()
    (base / 'a' / 'b' / 'y.py').touch()

    for dirpath, dirnames, filenames in base.walk():
        dirnames.sort()  # 走査の順序を、そろえる
        print(dirpath.relative_to(base).as_posix(), sorted(filenames))
```

```text
. []
a ['x.py']
a/b ['y.py']
```

---

## 実践例 <a id="examples" data-name="実践例"></a>

### 拡張子ごとのファイル数を数える

```python
import tempfile
from collections import Counter
from pathlib import Path


def count_by_suffix(root):
    """root 以下のファイルを、拡張子ごとに数える"""
    counter = Counter()
    for p in Path(root).rglob('*'):
        if p.is_file():
            counter[p.suffix or '(なし)'] += 1
    return counter


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    (base / 'sub').mkdir()
    for name in ['a.py', 'b.py', 'c.txt', 'README', 'sub/d.py']:
        (base / name).touch()

    for suffix, n in sorted(count_by_suffix(base).items()):
        print(suffix, n)
```

```text
(なし) 1
.py 3
.txt 1
```

### 拡張子ごとのフォルダに整理する

ファイルを、拡張子の名前のフォルダに、移動する。

```python
import tempfile
from pathlib import Path


def organize(root):
    """root 直下のファイルを、拡張子ごとのフォルダに移動する"""
    root = Path(root)
    for p in list(root.iterdir()):  # 移動で内容が変わるため、リストにしてから処理する
        if p.is_file() and p.suffix:
            folder = root / p.suffix[1:]
            folder.mkdir(exist_ok=True)
            p.rename(folder / p.name)


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    for name in ['a.py', 'b.py', 'c.txt', 'README']:
        (base / name).touch()

    organize(base)
    print(sorted(p.relative_to(base).as_posix() for p in base.rglob('*')))
```

```text
['README', 'py', 'py/a.py', 'py/b.py', 'txt', 'txt/c.txt']
```

---

## 古い書き方との対応 <a id="migration" data-name="古い書き方との対応"></a>

| 古い書き方 (`os`、`os.path`、`glob`) | `pathlib` での書き方 |
| --- | --- |
| `os.path.join(a, b)` | `Path(a) / b` |
| `os.getcwd()` | `Path.cwd()` |
| `os.path.expanduser('~')` | `Path.home()`、`Path('~').expanduser()` |
| `os.path.abspath(p)` | `Path(p).absolute()`、`Path(p).resolve()` |
| `os.path.exists(p)` | `Path(p).exists()` |
| `os.path.isfile(p)`、`os.path.isdir(p)` | `Path(p).is_file()`、`Path(p).is_dir()` |
| `os.path.basename(p)` | `Path(p).name` |
| `os.path.dirname(p)` | `Path(p).parent` |
| `os.path.splitext(p)` | `Path(p).stem` と `Path(p).suffix` |
| `os.listdir(p)` | `Path(p).iterdir()` |
| `glob.glob('*.py')` | `Path('.').glob('*.py')` |
| `os.walk(p)` | `Path(p).walk()` (Python 3.12 以降) |
| `os.makedirs(p, exist_ok=True)` | `Path(p).mkdir(parents=True, exist_ok=True)` |
| `os.remove(p)` | `Path(p).unlink()` |
| `os.rmdir(p)` | `Path(p).rmdir()` |
| `os.rename(a, b)` | `Path(a).rename(b)` |
| `open(p)` | `Path(p).open()` |

「os」のドキュメントも、あわせて参照。

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `Path('/home/user') / '/etc'` が `/etc` になる | `/` の右辺が絶対パスだと、左辺は捨てられる | 右辺を、相対パスにする。外部の入力は、`is_absolute()` で確認する |
| `FileNotFoundError` (`mkdir`) | 親ディレクトリが存在しない | `parents=True` を指定する |
| `FileExistsError` (`mkdir`、`touch(exist_ok=False)`) | 既に存在している | `exist_ok=True` を指定する |
| `'~'` が展開されない | `Path` は、`~` を自動では展開しない | `expanduser()` を呼ぶ |
| `glob()` の結果の順序が、実行ごとに違う | 順序が決まっていない | `sorted()` を使う |
| `len(p.iterdir())` が `TypeError` になる | `iterdir()` が返すのは、イテレータ | `list(p.iterdir())` にする |
| `FileExistsError` (`rename`、Windows) | Windows では、`target` が既存のファイルだと、エラーになる | `replace()` を使う |
| `OSError` (`rmdir`) | ディレクトリが空ではない | `shutil.rmtree()` を使う |
| `IsADirectoryError` (`unlink`) | `unlink()` は、ファイルとシンボリックリンク用である | ディレクトリは、`rmdir()` か `shutil.rmtree()` を使う |
| `ValueError` (`with_suffix('txt')`) | 拡張子が、`.` から始まっていない | `with_suffix('.txt')` のように書く |
| `a.tar.gz` の `suffix` が `.gz` になる | `suffix` は、最後の1つだけを返す | `suffixes` を使う (`''.join(p.suffixes)`) |
| `exists()` が、`False` なのに、リンクはある | シンボリックリンクの、リンク先が存在しない | `is_symlink()` で、リンク自体を確認する |
| 文字化け、`UnicodeDecodeError` (`read_text`) | `encoding` を省略して、環境の既定の文字コードが使われた | `encoding='utf-8'` のように、明示する |
| `NotImplementedError` (`cannot instantiate 'WindowsPath'`) | Unix で、`WindowsPath` を作ろうとした | 計算だけなら、`PureWindowsPath` を使う |
| 古いライブラリが、`Path` を受け取らない | 文字列だけを受け取る実装である | `str(p)` や `os.fspath(p)` で渡す |

---

## 関連 <a id="related" data-name="関連"></a>

| モジュール、ドキュメント | 用途 |
| --- | --- |
| `os` | 従来の、ファイルやパスの操作。「os」のドキュメントを参照 |
| `shutil` | コピー、移動、`rmtree` による削除、アーカイブ。「shutil」のドキュメントを参照 |
| `glob` | パターンに一致する、ファイルの検索 (文字列で返す) |
| `tempfile` | 一時ファイル、一時ディレクトリの作成 |
| `fnmatch` | ファイル名の、パターンマッチ |
| `subprocess` | 外部コマンドの実行。「subprocess」のドキュメントを参照 |
