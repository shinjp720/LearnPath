<div data-title="subprocess"></div>
<a id="top" data-name="TOP">

# subprocess

- subprocessモジュールは、外部のコマンドやプログラムをPythonから実行するためのモジュールで、たとえば、シェルコマンドをPythonから実行したり、他のプログラムと連携したりする際に使われる。

```python
import subprocess
```

---

### class Popen(args, bufsize=-1, executable=None, stdin=None, stdout=None, stderr=None, preexec_fn=None, close_fds=False, shell=False, cwd=None, env=None, universal_newlines=None, startupinfo=None, creationflags=0, restore_signals=True, start_new_session=False, pass_fds=(), *, user=None, group=None, extra_groups=None, encoding=None, errors=None, text=None, umask=-1, pipesize=-1, process_group=None)
: これはPopenクラスのコンストラクタのシグネチャで、プログラムから別のプログラムを実行するための様々な方法をサポートする。

### subprocess.run()
: この関数はPopenインスタンスをカプセル化し、このインスタンスで最も一般的な処理フローを実行する。<br>run()は、Popenのコンストラクタと同じ引数を受け取り、指定されたコマンドを実行し、処理が完了するかタイムアウトするのを待ち、CompletedProcessインスタンスを返す。このオブジェクトは、リターンコードと、stdoutおよびstderrの内容に対する属性を持つ。

**CompletedProcessインスタンスの属性**

| 属性       | 説明           |
| ---------- | -------------- |
| stdout     | 標準出力       |
| stderr     | エラー出力     |
| returncode | リターンコード |

: argsは必須引数で、1つの引数で完結する場合(`"ls"`など)は文字列で指定できる。<br>複数の引数(オプションやコマンドに渡す引数)を渡す場合は、`["ls", "-l"]`リストとして渡すか、`"ls -l"`文字列で渡して`shell=True`とする。

<pre><code class="caution">リストとしてコマンドを渡す場合は、特殊文字($, *, |, >など)が使えない。<br>逆にshell=Trueとすると特殊文字が使えるが、ユーザーの入力を直接渡すと脆弱性となるので注意が必要。</code></pre>

<pre><code class="example">cp = subprocess.run("ls -l", shell=True, capture_output=True, text=True)
</code></pre>

: コマンドの出力を補足する必要がある場合は、capture_output引数とtext引数をTrueに設定するのが一般的。

<pre><code class="example">cp = subprocess.run("ls", capture_output=True, text=True)
print(cp.stdout)</code></pre>


