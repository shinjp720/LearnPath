<div data-title="OS"></div>
<a id="top" data-name="TOP">

# OS

- OSモジュールはファイルやディレクトリを作成して操作するための低レベルの方法と、プロセスを作成、管理、削除するための低レベルの方法を提供する。

```python
import os
```

---

<a id="os" data-name="osのメソッド/クラス">

## osのメソッド/クラス

### stat(path, \*, dir_fd=None, follow_symlinks=True),<br>lstat(path, \*, dir_fd=None),<br>fstat(fd)
: `stat()`は`stat_result`型の値`x`を返す。`x`は`path`に関する情報を(少なくとも)10個の要素として提供する。<br>`path`はファイル、ファイルディスクリプタ(この場合はファイルディスクリプタのみを受け入れる`stat(fd)`または`fstat()`を使うことができる)、 パスのようなオブジェクト、またはサブディレクトリだが、`dir_fd`の相対パスか、(`follow_symlinks=False`か、`lstat()`を使っている場合は)シンボリックリンクでもよい。<br>`stat_result`型の値はタプルであり、その中に含まれている値に名前でもアクセスできる。

#### stat_resultインスタンスの属性
| index | 属性名     | 意味                             |
| ----- | ---------- | -------------------------------- |
| 0     | `st_mode`  | 保護ビットとその他のモードビット |
| 1     | `st_ino`   | inode番号                        |
| 2     | `st_dev`   | デバイスID                       |
| 3     | `st_nlink` | ハードリンクの数                 |
| 4     | `st_uid`   | 所有者のユーザーID               |
| 5     | `st_gid`   | 所有者のグループID               |
| 6     | `st_size`  | サイズ(バイト単位)               |
| 7     | `st_atime` | 最終アクセス時刻                 |
| 8     | `st_mtime` | 最終変更時刻                     |
| 9     | `st_ctime` | 最終ステータス変更時刻           |

### chdir(path)
: プロセスの現在の作業ディレクトリをpathに変更する。

### chmod(path, modo, *, dir_fd=None, follow_symlinks=True), <br>lchmod(path, mode)
: `path`のパーミッションを整数modeに以下の値を0個以上指定できる。複数ある場合はビット論理和演算子`|(パイプ)`で指定する。

#### mode
| 値        | 意味     |
| --------- | -------- |
| `os.R_OK` | 読み取り |
| `os.W_OK` | 書き込み |
| `os.X_OK` | 実行     |

: シンボリックリンクのリンク先ではなくシンボリックリンク自体のパーミッションを変更したい場合は`follow_symlinks=False`を渡す(または`lchmod()`を使う)。

### getcwd()
: 現在の作業ディレクトリのパスを文字列で返す。

### listdir(path='.')
: `path`に存在するファイルとディレクトリの名前が含まれたリストを返す。

### mkdir(path, mode=0o777, dir_fd=None), <br>mkdirs(path, mode=0o777, exist_ok=False)
: `path`の一番右のディレクトリのみを作成する。その手前にあるディレクトリのいずれかが存在しない場合は`OSError`を生成する。<br>`mkdirs()`は`path`の一部であるディレクトリのうちまだ存在しないものを全て作成する(`FileExistsError`が生成されないようにしたい場合は、`exist_ok=True`を渡す)。

### remove(path, *, dir_fd=None), <br>unlink(path, *, dir_fd=None)
: `path`(ファイル)を削除する。ファイルではなくディレクトリの削除には`rmdir()`を使う。<br>`unlink()`は意味的に`remove()`と同じ。

### rmdir(path, *, dir_fd=None)
: `path`(空のディレクトリ)を削除する。削除が失敗した(具体的には、そのディレクトリが空ではない)場合は、`OSError`を生成する。

### rename(src, dst, *, src_dir_fd=None, dst_dir_fd=None), <br>renames(stc, dst, /)
: `src`を`dst`に変更(移動)する。<br>`renames()`は`rename()`

### scandir(path='.')
: `path`の要素ごとに`os.DirEntry`インスタンスを生成するイテレータを返す。

### DirEntry
: クラス`DirEntry`のインスタンス`d`はそれぞれのアイテムのベース名`name`と、完全パスを保持する`path`の2つの属性に加えていくつかのメソッドを提供する。<br>よく使われるものは以下の通り。

| メソッド       | 説明                                     |
| -------------- | ---------------------------------------- |
| `is_dir()`     | dirである場合にTrueを返す                |
| `is_file()`    | fileである場合にTrueを返す               |
| `is_symlink()` | シンボリックリンクである場合にTrueを返す |

### symlink(target, symlink_path, target_is_directory=False, *, dir_fd=None)
: `target`に対して`symlink_path`という名前のシンボリックリンクを作成する。<br>`target_is_directory`は、作成されたシンボリックリンクをファイルまたはディレクトリとして表すべきかどうかを指定するためにWindowsシステムでのみ使われる。

<a id="os-path" data-name="os.pathのメソッド">

## os.pathのメソッド

### abspath(path)
: `path`が相対パスの場合、絶対パスを返す。ファイルが存在するかどうかの確認は行わない。

### commonpath(list)
: 文字列またはパスのようなオブジェクトのリストを受け取り、リストの全ての要素に共通する部分パスのうち最も長いものを返す。<br>リストが空である、絶対パスと相対パスが混ざっている、異なるドライブのパスが含まれている場合は`ValueError`を生成する。<br>`commonprefix()`とは異なり、有効なパスだけを返す。

### commonprefix(list)
: 文字列またはパスのようなオブジェクトのリストを受け取り、リストの全ての要素に共通するプレフィックスのうち最も長い文字列を返す。
<pre><code class="caution">文字列の共通部分なので、有効なパスが返るとは限らない。</code></pre>

### dirname(path)
: `os.path.split(path)[0]`と同様に、パスのディレクトリ部分を返す。
<pre><code class="example">os.path.dirname('b/c/d.e') # 'b/c'</code></pre>

### exists(path)
: `path`が既存のファイルまたはディレクトリである場合に`True`を返す。

### isabs(path)
: `path`が絶対パスである場合に`True`を返す。

### isdir(path)
: `path`が既存のディレクトリである場合に`True`を返す。

### isfile(path)
: `path`が既存のファイルである場合に`True`を返す。

### join(path, *paths)
: 引数を現在のプラットフォームの適切なパス区切り文字で結合した文字列を返す。<br>Unixでは隣接するパスの要素を`スラッシュ(/)`で区切る。<br>いずれかの引数が絶対パスである場合、その前にある引数は無視される。
<pre><code class="example">os.path.join('a/b', 'c/d', 'e/f') # 'a/b/c/d/e/f'</code></pre>
<pre><code class="example">os.path.join('a/b', '/c/d', 'e/f') # '/c/d/e/f'</code></pre>