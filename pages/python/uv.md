---
title: uv
layout: default
---

# uv <a id="top" data-name="TOP"></a>

Rust 製の高速な Python のパッケージ・プロジェクト管理ツール。<br>
pip、venv、pipx、pyenv、pip-tools などの役割を1つのコマンドでまとめて扱える。

## 導入 <a id="introduction" data-name="導入"></a>

### macOS / Linux

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

を実行してターミナルを再起動、または以下のコマンドを実行。

```bash
source $HOME/.local/bin/env
```

### Windows

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### その他の方法

```bash
# Homebrew
brew install uv

# pip
pip install uv
```

### 確認と更新

```bash
# バージョンの確認
uv --version

# uv 自体の更新
uv self update
```

<pre><code class="tips">uv self update は、公式のインストールスクリプトで入れた場合に使える。
Homebrew や pip で入れた場合は、それぞれのパッケージマネージャーで更新する。</code></pre>

---

## 基本 <a id="basic" data-name="基本"></a>

### 最初の流れ

```bash
# プロジェクトを作成
uv init myproject
cd myproject

# パッケージを追加
uv add requests

# スクリプトを実行
uv run main.py
```

<pre><code class="tips">uv run は実行前に自動で環境を同期するので、仮想環境を activate する必要はない。</code></pre>

---

### プロジェクト管理

#### `uv init`

カレントディレクトリに新しいプロジェクトを作成する (pyproject.toml が作成される) 。

```bash
# 名前を指定すると、そのディレクトリを作ってプロジェクトを作成する
uv init myproject
```

次のファイルが生成される。

```text
myproject/
├── .python-version
├── README.md
├── main.py
└── pyproject.toml
```

| --- | --- |
| `--app` | アプリケーション用 (デフォルト) |
| `--lib` | ライブラリ用。`src/` 配下にパッケージを作る |
| `--script <ファイル名>` | 単体スクリプト用 (後述のインラインメタデータを付ける) |

<pre><code class="tips">uv.lock と .venv は、uv init の時点ではまだ作られない。最初の uv add、uv sync、uv run などで作成される。</code></pre>

#### `uv add <パッケージ名>`

パッケージをインストールし、 pyproject.toml に追加する。uv.lock も更新される。プロジェクトのディレクトリ内で実行する。

```bash
uv add requests

# バージョンを指定
uv add "requests>=2.31"

# requirements.txt から追加
uv add -r requirements.txt
```

#### `uv add --dev <パッケージ名>`

開発環境専用のパッケージ ( pytest や black など) を追加する。

```bash
uv add --dev pytest
```

pyproject.toml の `[dependency-groups]` の `dev` グループに追加される。

```toml
[dependency-groups]
dev = [
    "pytest>=8.0.0",
]
```

任意の名前のグループに追加する場合は `--group` を使う。

```bash
uv add --group docs mkdocs
```

#### `uv remove <パッケージ名>`

パッケージをアンインストールし、設定からも削除する。

#### `uv sync`

uv.lock の状態に合わせて、現在の環境を完全に同期 (一括インストール) する。<br>
ロックファイルにないパッケージは環境から削除される。

| --- | --- |
| `--locked` | uv.lock が pyproject.toml と合っていなければエラーにする (CI向け) |
| `--frozen` | uv.lock を更新せず、そのまま使う |
| `--no-dev` | dev グループを含めない (本番向け) |

#### `uv lock`

pyproject.toml から依存関係を解決して、uv.lock を作成・更新する (インストールはしない) 。

```bash
# 全てのパッケージを最新に更新
uv lock --upgrade

# 特定のパッケージだけ更新
uv lock --upgrade-package requests
```

#### `uv tree`

依存関係をツリーで表示する。

#### `uv export`

uv.lock の内容を、他の形式で書き出す。

```bash
uv export --format requirements-txt -o requirements.txt
```

---

### 既存プロジェクトの環境構築

```bash
git clone <リポジトリ>
cd <リポジトリ>
uv sync
```

pyproject.toml と uv.lock から、 .venv の作成と依存パッケージのインストールが行われる。<br>
必要な Python がなければ、自動でダウンロードされる。

---

### スクリプトやツールの実行

#### `uv run <スクリプト名.py>`

プロジェクト環境 (uv.lock) を利用してPythonスクリプトを実行する。<br>
スクリプト以外のコマンドも実行できる。

```bash
uv run python
uv run pytest
```

#### `uv run --with <パッケージ名> <スクリプト名.py>`

指定したパッケージをその場だけ一時的にインストールして実行する。プロジェクトの設定は変更されない。

#### インラインメタデータ (単体スクリプト)

スクリプトの先頭に依存関係を書いておくと、プロジェクトがなくても実行できる。

```bash
uv init --script example.py
uv add --script example.py requests
```

```python
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "requests",
# ]
# ///

import requests
```

```bash
uv run example.py
```

実行時に、スクリプト専用の一時的な環境が作られる。

#### `uvx <ツール名>`

Ruff などのコマンドラインツールを、環境を汚さずにその場でダウンロードして実行する (pipx run に相当) 。<br>
`uv tool run` の短縮形。

```bash
uvx ruff check .
```

#### `uv tool install <ツール名>`

コマンドラインツールを、専用の環境にインストールして常に使えるようにする (pipx install に相当) 。

```bash
uv tool install ruff
```

| --- | --- |
| `uv tool list` | インストール済みのツールの一覧 |
| `uv tool upgrade <ツール名>` | ツールの更新 |
| `uv tool uninstall <ツール名>` | ツールの削除 |
| `uv tool update-shell` | ツールの置き場所を PATH に追加する |

---

### Python のバージョン管理

#### `uv python list`

インストール可能な (またはインストール済みの) Python のバージョン一覧を表示する。

```bash
# インストール済みのものだけ
uv python list --only-installed
```

#### `uv python install <バージョン>`

指定した Python (例: 3.12) をダウンロードしてインストールする。

#### `uv python uninstall <バージョン>`

インストールした Python を削除する。

#### `uv python pin <バージョン>`

そのプロジェクトで使用する Python のバージョンを固定する (.python-version ファイルが作成される) 。

<pre><code class="tips">プロジェクトで必要な Python が入っていない場合は、uv run や uv sync の時に自動でダウンロードされる。</code></pre>

---

### 従来の pip や venv を使う

#### `uv venv`

カレントディレクトリに仮想環境 (.venv) を作成する。

```bash
# Python のバージョンを指定
uv venv --python 3.12

# 有効化 (macOS / Linux)
source .venv/bin/activate

# 有効化 (Windows)
.venv\Scripts\activate
```

#### `uv pip install <パッケージ名>`

従来の pip install と同じ感覚で、仮想環境にパッケージを入れる。

```bash
uv pip install requests
uv pip install -r requirements.txt
uv pip install -e .
```

<pre><code class="tips">uv pip は pyproject.toml や uv.lock を更新しない。依存関係をプロジェクトとして管理したい場合は uv add を使う。</code></pre>

#### `uv pip compile requirements.in -o requirements.txt`

requirements.in から依存関係を解決した requirements.txt を書き出す。

#### `uv pip sync requirements.txt`

requirements.txt の内容と環境を完全に一致させる (記載のないパッケージは削除される) 。

#### その他

| --- | --- |
| `uv pip list` | インストール済みのパッケージの一覧 |
| `uv pip freeze` | インストール済みのパッケージを requirements 形式で表示 |
| `uv pip uninstall <パッケージ名>` | パッケージの削除 |

---

## ファイル構成 <a id="files" data-name="ファイル構成"></a>

| --- | --- |
| pyproject.toml | プロジェクトの設定と依存関係を記述するファイル |
| uv.lock | 依存関係を解決した結果 (全パッケージの正確なバージョン) を記録するファイル |
| .python-version | 使用する Python のバージョン |
| .venv/ | プロジェクトの仮想環境 |

<pre><code class="tips">uv.lock は uv が自動で管理するので、手で編集しない。Git で管理して、チームで同じ環境を再現できるようにする。
.venv/ は Git で管理しない (.gitignore に入れる) 。</code></pre>

---

## pip などとの対応 <a id="compare" data-name="pip などとの対応"></a>

| 従来のコマンド | uv |
| --- | --- |
| `python -m venv .venv` | `uv venv` |
| `pip install <パッケージ名>` | `uv add <パッケージ名>` (プロジェクト管理する場合) <br> `uv pip install <パッケージ名>` (pip互換) |
| `pip install -r requirements.txt` | `uv pip install -r requirements.txt` |
| `pip freeze` | `uv pip freeze` |
| `pip-compile` | `uv pip compile` |
| `pipx run <ツール名>` | `uvx <ツール名>` |
| `pipx install <ツール名>` | `uv tool install <ツール名>` |
| `pyenv install <バージョン>` | `uv python install <バージョン>` |

---

## その他 <a id="others" data-name="その他"></a>

### キャッシュ

uv はダウンロードしたパッケージをキャッシュして、再利用する。

```bash
# キャッシュの場所を表示
uv cache dir

# 使われていないキャッシュを削除
uv cache prune

# キャッシュを全て削除
uv cache clean
```

### ビルドと公開

```bash
# パッケージ (sdist / wheel) を作成
uv build

# PyPI などに公開
uv publish
```

---
