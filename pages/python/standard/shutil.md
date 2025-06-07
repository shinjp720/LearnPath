<div data-title="shutil"></div>
<a id="top" data-name="TOP">

# shutil

- `shutil(shell utilities)`モジュールは、ファイルのコピーと移動を行う関数と、ディレクトリツリー全体を削除する関数を提供する。

```python
import shutil
```

---

## shutilのメソッド

### `copy(src, dst, *, follow_symlinks=True)`
ファイル`src`(ファイルは存在していなければならない)の内容のコピーで、ファイル`dst`を作成、または上書きする。<br>`dst`がディレクトリの場合、`src`と同じベース名で`dst`に配置される。<br>コピーしたファイルに対するパスを返す。

### `copytree(str, sdt, symlinks=False, ignore=None, copy_function=copy2, ignore_dangling_symlinks=False, dirs_exist_ok=False)`
ディレクトリ`src`をルートとするディレクトリツリーをディレクトリ`dst`にコピーする。<br>`dirs_exist_ok`を`True`とすると、コピー先に既に存在する場合に上書きされる。デフォルトでは`FileExistsError`が発生する。

### `move(src, dst, copy_function=copy2)`
ファイルまたはディレクトリ`src`をファイルまたはディレクトリ`dst`に移動する。


### `rmtree(path, ignore_errors=False, onerror=None, *, onexc=None, dir_fd=None)`
指定したディレクトリ`path`とその中にあるすべてのファイルやサブディレクトリを再帰的に削除する。<br>`ignore_errors=True`とすると、削除時にエラーが出ても無視する。