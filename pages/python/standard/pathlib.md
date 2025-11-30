---
title: FastAPI
layout: default
---

# PathLib <a id="top" data-name="TOP">
```python
from pathlib import Path
```

### 基本的な使い方
```python
from pathlib import Path

# 現在のディレクトリ
current_dir = Path('.')

# 絶対パスの取得
absolute_path = current_dir.resolve()

# 任意のパスを作成
path = Path('/home/user/documents')
```

### パスの結合
```python
base_path = Path('/home/user')
new_path = base_path / 'documents' / 'file.txt'
print(new_path)  # /home/user/documents/file.txt
```

### パスオブジェクトの属性
属性	説明	UnixPathの値
Path("/usr/bin/python")	WindowsPathの値
Path(r"c:\Python3\python.exe")
anchor	driveとrootの結合	'/'	'c:\\'
drive	pのドライブ文字	''	'c:'
name	pの最後の要素	'python'	'python.exe'
parent	pの親ディレクトリ	Path('/user/bin')	Path('c:\\Python3')
parents	pの祖先ディレクトリ	(Path(/usr/bin), Path(/usr), Path(/))	(Path('c:\\Python3'), Path('c:\\'))
parts	pのすべての要素からなるタプル	('/', 'usr', 'bin', 'python')	('c:\\', 'Python2', 'python')
root	pのルートディレクトリ	'/'	'\\'
stem	pのname部分から拡張子を取り除いたもの	'python'	'Python'
suffix	pの末尾の拡張子	''	'.exe'
suffixes	pのすべての拡張子からなるリスト	[]	['.exe']

### メソッド

<table>
    <tr><th>メソッド</th><th>説明</th></tr>
    <tr><td>p.chmod(mode, *, follow_symlinks=True)</td><td>p.lchmod(mode)	chmod()は、os.chmod()と同じように、ファイルのモードとパーミッションを変更する。 Unixプラットフォームで、シンボリックリンクのリンク先ではなくシンボリックリンク自体のパーミッションを変更する場合は、follow_symlinks=Falseを渡すかlchmod()を使う。</td></tr>
    <tr><td>pathlib.Path.cwd()</td><td>現在の作業ディレクトリをパスオブジェクトとして返す。</td></tr>
    <tr><td>p.exists(*, follow_symlinks=True)</td><td>pが既存のファイルまたはディレクトリを表している(あるいは既存のファイルまたはディレクトリを指しているシンボリックリンクである)場合にTrueを返す。それ以外はFalseを返す。</td></tr>
    <tr><td>p.glob(pattern, *, case_sensitive=None) p.rglob(pattern, *, case_sensitive=None)</td><td>ディレクトリpにおいてpatternとマッチするすべてのファイルを任意の順序で返す。 patternには、pまたはサブディレクトリでの再帰グロブを許可する**が含まれていてもよい。 rglob()は常に、patternが'**/'で始まっているかのように、pとすべてのサブディレクトリで再帰グロブを実行する。</td></tr>
    <tr><td>pathlib.Path.home()</td><td>ユーザーのホームディレクトリをパスオブジェクトとして返す。</td></tr>
    <tr><td>p.is_dir()</td><td>pが既存のディレクトリ(またはディレクトリに対するシンボリックリンク)である場合にTrueを返す。それ以外はFalseを返す。</td></tr>
    <tr><td>p.is_file()</td><td>pが既存のファイル(またはファイルに対するシンボリックリンク)である場合にTrueを返す。それ以外はFalseを返す。
</td></tr>
    <tr><td>p.is_mount()</td><td>pがマウントポイント(ファイルシステムにおいて異なるファイルシステムがマウントされているポイント)である場合にTrueを返す。 それ以外はFalseを返す。</td></tr>
    <tr><td>p.is_symlink()</td><td>pが既存のシンボリックリンクである場合にTrueを返す。それ以外はFalseを返す。</td></tr>
    <tr><td>p.iterdir()</td><td>ディレクトリpの内容('.'と'..'は含まない)に対するファイルとディレクトリのパスオブジェクトをイテレータとして返す。 再帰的には走査しないので、サブディレクトリ内のファイルまで含めて取得したい場合は、rglob()やglob()を使う必要がある。 .gitignoreのような隠しファイルも含めて返す。</td></tr>
    <tr><td>p.mkdir(mode=0O777, parents=False, exist_ok=False)</td><td>パスpに新しいディレクトリを作成する。ファイルのモードとアクセスフラグはmodeに基づいて設定する。 欠けている親ディレクトリがあったら必要に応じて作成するには、parent=Trueを渡す。 FileExistsError例外を無視したい場合は、exist_ok=Trueを渡す。</td></tr>
    <tr><td>p.open(mode='r'. buffering=-1, encoding=None, errors=None, newline=None)</td><td>組み込み関数open(p)と同様に(他の引数は同じであるとして)、パスpが指しているファイルを開く。</td></tr>
    <tr><td>p.read_bytes()</td><td>pの内容をbytesオブジェクトとして返す。</td></tr>
    <tr><td>p.read_text(encoding=None, errors=None)</td><td>pの文字列としてでコードされた内容を返す。</td></tr>
    <tr><td>p.readlink()</td><td>シンボリックリンクが指しているパスを返す。</td></tr>
    <tr><td>p.rename(target)</td><td>pをtargetに置き換え、targetを指している新しいパスオブジェクトを返す。 targetは文字列(絶対パスまたは相対パス)。ただし、相対パスはpのディレクトリではなく現在の作業ディレクトリに対する相対パスと解釈される。 targetが既存のファイルまたは空のディレクトリである場合、Unixでは、ユーザーがパーミッションを持っていれば、警告なしに書き換える。Windowsでは、FileExistsErrorを生成する。</td></tr>
    <tr><td>p.resolve(strict=False)</td><td>pの絶対パスを返す。</td></tr>
    <tr><td>p.rmdir()</td><td>ディレクトリpを削除する。pが空ではない場合は、OSErrorを生成する。</td></tr>
    <tr><td>p.samefile(target)</td><td>pとtargetが同じファイルを指している場合はTrueを返す。それ以外の場合はFalseを返す。 targetは文字列またはパスオブジェクト。</td></tr>
    <tr><td>p.stat(*, follow_symlinks=True)</td><td>パスオブジェクトに関する情報を返す。
        <table>
            <caption>stat_resultインスタンスの属性</caption>
            <tr><th>インデックス</th><th>属性名</th><th>意味</th></tr>
            <tr><td>0</td><td>st_mode</td><td>保護ビットとその他のモードビット</td></tr>
            <tr><td>1</td><td>st_ino</td><td>inode番号</td></tr>
            <tr><td>2</td><td>st_dev</td><td>デバイスID</td></tr>
            <tr><td>3</td><td>st_nlink</td><td>ハードリンクの数</td></tr>
            <tr><td>4</td><td>st_uid</td><td>所有者のユーザーID</td></tr>
            <tr><td>5</td><td>st_gid</td><td>所有者のグループID</td></tr>
            <tr><td>6</td><td>st_size</td><td>サイズ(バイト単位)</td></tr>
            <tr><td>7</td><td>st_atime</td><td>最終アクセス時刻</td></tr>
            <tr><td>8</td><td>st_mtime</td><td>最終変更時刻</td></tr>
            <tr><td>9</td><td>st_ctime</td><td>最終ステータス変更時刻</td></tr>
        </table>
        <pre><code class="example">print(p.stat().st_size)</code></pre>
    </td></tr>
    <tr><td>p.touch(mode=0o666, exist_ok=True)</td><td>Unixのtouch同様に、パスpで空のファイルを作成する。 ファイルがすでに存在する場合、exist_ok=Trueであれば最終変更時刻を現在の時刻に更新し、exist_ok=FalseであればFileExistsErrorを生成する。</td></tr>
    <tr><td>p.unlink(missing_ok=False)</td><td>ファイルまたはシンボリックリンクpを削除する。 FileExistsErrorを無視するには、missing_ok=Trueを渡す。</td></tr>
</table>