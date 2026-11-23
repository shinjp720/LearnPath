---
title: venv
layout: default
---

# venv <a id="top" data-name="TOP"></a>

venv は、仮想環境を作成するための、Python の標準ライブラリ。プロジェクトごとに、Python のパッケージを分離するのに役立つ。<br>
Python 3.3 以降で、標準ライブラリに含まれる。

仮想環境ごとに、独立した `site-packages` を持つため、プロジェクトごとに、同じパッケージの異なるバージョンを、共存させられる。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| 標準ライブラリ | 追加のインストールが、基本的に不要。Linux では、別パッケージに分離されている場合がある |
| 分離 | パッケージを、仮想環境ごとの `site-packages` に入れる。システムの Python や、他の仮想環境に、影響しない |
| 軽量 | 基本となる Python を、シンボリックリンクまたはコピーで参照する |
| pip の同梱 | 作成時に、`ensurepip` で、pip を自動で入れる (`--without-pip` で省略できる) |

### 関連ツールとの違い

| ツール | 内容 |
| --- | --- |
| `venv` | 標準ライブラリ。`python3 -m venv` で作成する |
| `virtualenv` | サードパーティ製の、同種のツール。venv の前身にあたる |
| `uv venv` | uv が提供する、仮想環境の作成コマンド。uv のドキュメントを参照 |
| `pip` | 仮想環境の中に、パッケージを入れるツール。pip のドキュメントを参照 |

<pre><code class="caution">このドキュメントは、Python 3.13 以降の挙動 (.gitignore の自動作成など) と、pip 26.3 (2026年11月) を前提にしている。
古いバージョンの Python では、一部のオプションや挙動が異なる。</code></pre>

---

## 導入 <a id="introduction" data-name="導入"></a>

Python 3.3 以降は、基本的にデフォルトでインストールされている。ただし、Linux 系の場合、Python 本体は入っていても、venv が別パッケージとして分離されている場合がある。<br>
その場合は、以下を実行する。

```bash
sudo apt install python3-venv
```

インストール済みの Python のバージョンは、次のコマンドで確認できる。

```bash
python3 --version
```

<pre><code class="tips">Debian 系 (Ubuntu など) 以外の Linux では、パッケージ名やコマンドが異なる。
Windows や macOS の、公式のインストーラーで入れた Python には、通常、venv が含まれている。</code></pre>

---

## 仮想環境の作成 <a id="create" data-name="仮想環境の作成"></a>

```bash
python3.11 -m venv .venv
```

環境にインストール済みの Python のバージョンを指定することができる。<br>
`.venv` の部分は、任意の仮想環境名を指定可能。慣例として、プロジェクトのディレクトリの直下に、`.venv` または `venv` の名前で作る。

### 作成されるもの

```text
.venv/
├── bin/               # python、pip、activate など (Windows では Scripts/)
├── include/
├── lib/
│   └── python3.11/
│       └── site-packages/   # この環境に入れたパッケージ
└── pyvenv.cfg         # 基本となる Python の情報
```

Python 3.13 以降は、`.venv` の中に、Git 用の `.gitignore` が、自動で作られる。

### 主なオプション

| オプション | 内容 |
| --- | --- |
| `--system-site-packages` | システムの `site-packages` を、仮想環境から参照できるようにする |
| `--symlinks` | シンボリックリンクを使う (多くの環境で、既定) |
| `--copies` | シンボリックリンクではなく、コピーを使う |
| `--clear` | 作成先のディレクトリが存在するとき、中身をすべて削除してから作る |
| `--upgrade` | Python を、その場でアップグレードした後に、仮想環境を新しいバージョンに合わせる |
| `--without-pip` | pip を入れない |
| `--prompt 名前` | プロンプトに表示する名前を、変更する |
| `--upgrade-deps` | pip を、PyPI の最新版に、アップグレードする |
| `--without-scm-ignore-files` | `.gitignore` などを、作らない (Python 3.13 以降) |

```bash
python3 -m venv --upgrade-deps --prompt myapp .venv
```

<pre><code class="caution">仮想環境のディレクトリは、Git などのバージョン管理に含めない。
環境を再現するときは、requirements.txt から、作り直す。</code></pre>

---

## 仮想環境の有効化 <a id="activate" data-name="仮想環境の有効化"></a>

```bash
source .venv/bin/activate
```

もしくは

```bash
. .venv/bin/activate
```

有効化すると、プロンプトの先頭に、`(.venv)` のような名前が表示される。`python` や `pip` は、仮想環境のものが使われる。

```bash
which python
```

```text
/home/user/project/.venv/bin/python
```

### シェルごとのコマンド

| シェル | コマンド |
| --- | --- |
| bash / zsh | `source .venv/bin/activate` |
| fish | `source .venv/bin/activate.fish` |
| csh / tcsh | `source .venv/bin/activate.csh` |
| PowerShell (Linux・macOS) | `.venv/bin/Activate.ps1` |
| コマンドプロンプト (Windows) | `.venv\Scripts\activate.bat` |
| PowerShell (Windows) | `.venv\Scripts\Activate.ps1` |

<pre><code class="tips">有効化しなくても、仮想環境の Python を、パスで直接指定すれば、その環境で実行できる (例: .venv/bin/python script.py)。
スクリプトや CI では、この方法が分かりやすい。</code></pre>

<pre><code class="caution">Windows の PowerShell で Activate.ps1 が実行できないときは、実行ポリシーの設定が必要になる場合がある。
例: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser</code></pre>

---

## 仮想環境内での操作 <a id="usage" data-name="仮想環境内での操作"></a>

| コマンド | 説明 |
| --- | --- |
| pip install パッケージ名 | パッケージのインストール |
| pip list | インストール済みパッケージの確認 |
| pip freeze > requirements.txt | パッケージの固定化 |
| pip install -r requirements.txt | パッケージの一括インストール |
| deactivate | 仮想環境の無効化 |

### その他のよく使うコマンド

| コマンド | 説明 |
| --- | --- |
| pip uninstall パッケージ名 | パッケージのアンインストール |
| pip show パッケージ名 | パッケージの情報の確認 |
| python -m pip install --upgrade pip | 仮想環境の中の pip の、アップグレード |

<pre><code class="tips">pip の詳しい使い方は、pip のドキュメントを参照。
requirements.txt を、リポジトリに含めておくと、別の環境でも、同じパッケージを再現できる。</code></pre>

---

## 仮想環境の削除 <a id="remove" data-name="仮想環境の削除"></a>

```bash
deactivate
rm -rf .venv
```

仮想環境のディレクトリごと削除すればOK。有効化したままの場合は、先に `deactivate` で無効化する。

<pre><code class="caution">削除するディレクトリの名前は、作成したときの名前に合わせる。
.env は、環境変数のファイルの名前としても使われるため、.venv と間違えると、必要なファイルを消すことがある。</code></pre>

作り直すときは、同じ手順で、作成から行う。

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## スクリプトの自動化 <a id="automation" data-name="スクリプトの自動化"></a>

```bash
#!/bin/bash
source .venv/bin/activate
python script.py
```

これを `run.sh` として保存する。<br>

実行権限を付与する。

```bash
chmod +x run.sh
```

実行する。

```bash
./run.sh
```

`. run.sh` でも実行できる。ただし、現在のシェルで実行されるため、スクリプトの終了後も、仮想環境が有効なまま残る。<br>
`./run.sh` は、別のプロセスで実行されるため、現在のシェルには、影響しない。

### 有効化を省略する書き方

```bash
#!/bin/bash
# スクリプトのあるディレクトリに移動して、仮想環境の Python を直接指定する
cd "$(dirname "$0")"
.venv/bin/python script.py
```

<pre><code class="tips">有効化の処理が不要なため、シェルの状態に左右されない。
cron や systemd など、対話的でない環境から呼ぶときに、向いている。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `ensurepip is not available` | Debian 系で、`python3-venv` が入っていない | `sudo apt install python3-venv` を実行する |
| `python3.11: command not found` | 指定したバージョンの Python が、インストールされていない | `python3 --version` で、入っているバージョンを確認する |
| `.venv/bin/activate: No such file or directory` | 仮想環境を作っていない、ディレクトリが違う、または Windows である | 場所を確認する。Windows では `Scripts` ディレクトリを使う |
| 有効化したのに、システムの `pip` が使われる | `source` ではなく、直接実行したため、現在のシェルに反映されない | `source .venv/bin/activate` で実行し、`which pip` で確認する |
| 仮想環境のディレクトリを、移動や改名したら、動かなくなった | 環境内のスクリプトに、元のパスが書き込まれている | 削除して、作り直す。`requirements.txt` で復元する |
| 仮想環境を削除したつもりで、削除されていない | `.env` と `.venv` を、取り違えた | ディレクトリ名を確認して、`.venv` を削除する |
| `error: externally-managed-environment` | システムの Python に、pip で直接入れようとした | 仮想環境を作って、その中でインストールする |
| PowerShell で、スクリプトの実行が無効のようなエラーになる | 実行ポリシーで、`Activate.ps1` の実行が制限されている | `RemoteSigned` などに、ユーザー単位で変更する |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| pip | 仮想環境の中に、パッケージを入れる。pip のドキュメントを参照 |
| uv | 仮想環境の作成と、パッケージ管理を、まとめて行う。uv のドキュメントを参照 |
| `virtualenv` | venv と同種の、サードパーティ製のツール |
