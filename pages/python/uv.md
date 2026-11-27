---
title: uv
layout: default
---

# uv <a id="top" data-name="TOP"></a>

Rust 製の高速な Python のパッケージ・プロジェクト管理ツール。<br>
pip、venv、pipx、pyenv、pip-tools などの役割を1つのコマンドでまとめて扱える。

| 特長 | 内容 |
| --- | --- |
| 高速 | Rust 製。依存関係の解決とインストールが速く、ダウンロードしたパッケージはキャッシュされる |
| 役割をまとめて扱える | パッケージ管理、仮想環境、Python のバージョン管理、ツールの実行を、1つのコマンドで行える |
| ロックファイル | uv.lock に、全プラットフォーム共通で、正確なバージョンを記録する |
| Python の自動取得 | 必要な Python がなければ、自動でダウンロードして使う |
| 単体スクリプト | 依存関係をスクリプトに書いて、プロジェクトなしで実行できる |
| ツールの実行 | uvx で、コマンドラインツールを、環境を汚さずに実行できる |

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

<pre><code class="caution">uv は、バージョンが 0.x の間は、更新で挙動が変わることがある。更新の前に、GitHub (astral-sh/uv) の CHANGELOG を確認する。
このノートは、0.12 系の仕様をもとにしている。</code></pre>

### シェル補完

コマンドやオプションを、Tab キーで補完できるようにする。

```bash
# bash
echo 'eval "$(uv generate-shell-completion bash)"' >> ~/.bashrc

# zsh
echo 'eval "$(uv generate-shell-completion zsh)"' >> ~/.zshrc
```

設定したあとは、シェルを再起動する。fish や PowerShell などにも対応している。

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
| `--build-backend <名前>` | ビルドバックエンドを選ぶ (uv_build、hatchling、maturin など) |
| `--vcs none` | git 関連のファイルを作らない |

<pre><code class="tips">uv.lock と .venv は、uv init の時点ではまだ作られない。最初の uv add、uv sync、uv run などで作成される。</code></pre>

<pre><code class="tips">git が使える環境では、uv init は、.git/ と .gitignore も作る。作りたくないときは、--vcs none を付ける。
すでにあるパッケージのディレクトリの中で uv init すると、新しいプロジェクトが、ワークスペースのメンバーとして追加される (ワークスペースの章を参照)。</code></pre>

#### `uv add <パッケージ名>`

パッケージをインストールし、 pyproject.toml に追加する。uv.lock も更新される。プロジェクトのディレクトリ内で実行する。

```bash
uv add requests

# バージョンを指定
uv add "requests>=2.31"

# requirements.txt から追加
uv add -r requirements.txt

# Git リポジトリから追加 (tool.uv.sources に記録される)
uv add git+https://github.com/psf/requests

# ローカルのパッケージを、編集可能な形で追加
uv add --editable ../mylib

# オプション依存 (extra) に追加
uv add --optional pdf reportlab
```

<pre><code class="caution">&gt; や &lt; は、シェルでは、リダイレクトとして解釈される。バージョンを指定するときは、"requests&gt;=2.31" のように、引用符で囲む。
囲み忘れると、=2.31 という名前のファイルができてしまう。</code></pre>

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
| `--group <名前>` | 指定したグループを含める |
| `--all-groups` | すべてのグループを含める |
| `--extra <名前>` | 指定したオプション依存 (extra) を含める |
| `--all-extras` | すべての extra を含める |
| `--no-install-project` | プロジェクト自身は入れずに、依存パッケージだけを入れる (Docker のキャッシュ向け) |
| `--inexact` | ロックファイルにないパッケージを、削除しない |
| `-U` (`--upgrade`) | ロックされたパッケージを、最新に更新する |
| `-p <バージョン>` (`--python`) | 使用する Python のバージョンを指定する |

#### `uv lock`

pyproject.toml から依存関係を解決して、uv.lock を作成・更新する (インストールはしない) 。

```bash
# 全てのパッケージを最新に更新
uv lock --upgrade

# 特定のパッケージだけ更新
uv lock --upgrade-package requests

# uv.lock が最新かを確認する (更新はしない。CI 向け)
uv lock --check
```

#### `uv tree`

依存関係をツリーで表示する。

```bash
uv tree

# 直接の依存だけ (深さ 1)
uv tree --depth 1

# 逆向きに表示 (どのパッケージから依存されているか)
uv tree --invert
```

#### `uv export`

uv.lock の内容を、他の形式で書き出す。

```bash
uv export --format requirements-txt -o requirements.txt

# 本番用 (dev グループを除き、ハッシュも付けない)
uv export --no-dev --no-hashes -o requirements.txt

# pylock.toml 形式
uv export --format pylock.toml -o pylock.toml
```

#### `uv version`

プロジェクトのバージョン (pyproject.toml の `[project]` の `version`) を、表示・更新する。

```bash
# 名前とバージョンを表示
uv version

# バージョンだけを表示
uv version --short

# マイナーバージョンを上げる (例: 0.1.0 → 0.2.0)
uv version --bump minor

# 実際には書き換えずに、結果だけを確認する
uv version --bump minor --dry-run
```

`--bump` には、`major`、`minor`、`patch` などを指定できる。

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

#### `uv run` のオプション

| オプション | 内容 |
| --- | --- |
| `--with <パッケージ名>` | 一時的に、パッケージを追加して実行する |
| `-p <バージョン>` | 使用する Python のバージョンを指定する |
| `--no-sync` | 実行前の環境の同期を、行わない |
| `--locked` / `--frozen` | uv.lock の扱いを、uv sync と同じように指定する (CI 向け) |
| `--env-file <ファイル>` | .env ファイルから、環境変数を読み込む |
| `--isolated` | プロジェクトの環境を使わず、一時的な環境で実行する |
| `-m <モジュール名>` | モジュールとして実行する (例: `uv run -m pytest`) |

```bash
# Python 3.12 で実行
uv run -p 3.12 python main.py

# 一時的に httpx を追加して実行
uv run --with httpx python -c "import httpx; print(httpx.__version__)"
```

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

# バージョンを指定 (最新を使うなら @latest)
uvx ruff@latest check .

# パッケージ名と、コマンド名が違う場合
uvx --from httpie http GET example.com

# 追加のパッケージを入れて実行
uvx --with mkdocs-material mkdocs serve
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
| `uv tool upgrade --all` | すべてのツールを更新する |
| `uv tool dir` | ツールの置き場所を表示する |

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

#### `uv python find [<バージョン>]`

条件に合う Python の、場所 (パス) を表示する。

```bash
uv python find 3.12
```

#### `uv python dir`

uv が管理している Python の、置き場所を表示する。

<pre><code class="tips">uv python pin で固定するバージョンは、pyproject.toml の requires-python の範囲に入っている必要がある。
.python-version は Git で管理して、チームで同じ Python を使えるようにする。</code></pre>

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

<pre><code class="tips">uv pip install は、仮想環境がないと、エラーになる。先に uv venv で作る。
--system を付けると、システムの Python に入れられるが、環境を壊しやすいので、通常は使わない。</code></pre>

#### `uv pip compile requirements.in -o requirements.txt`

requirements.in から依存関係を解決した requirements.txt を書き出す。

#### `uv pip sync requirements.txt`

requirements.txt の内容と環境を完全に一致させる (記載のないパッケージは削除される) 。

#### その他

| --- | --- |
| `uv pip list` | インストール済みのパッケージの一覧 |
| `uv pip freeze` | インストール済みのパッケージを requirements 形式で表示 |
| `uv pip uninstall <パッケージ名>` | パッケージの削除 |
| `uv pip show <パッケージ名>` | パッケージの詳細を表示 |
| `uv pip tree` | インストール済みのパッケージの依存関係を、ツリーで表示 |
| `uv pip check` | インストール済みのパッケージに、依存関係の矛盾がないかを確認 |

---

## ファイル構成 <a id="files" data-name="ファイル構成"></a>

| --- | --- |
| pyproject.toml | プロジェクトの設定と依存関係を記述するファイル |
| uv.lock | 依存関係を解決した結果 (全パッケージの正確なバージョン) を記録するファイル |
| .python-version | 使用する Python のバージョン |
| .venv/ | プロジェクトの仮想環境 |
| uv.toml | uv の設定ファイル (任意)。pyproject.toml の `[tool.uv]` の代わりに使える |

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

## 依存関係の管理 <a id="dependencies" data-name="依存関係の管理"></a>

### 依存関係の種類

依存関係は、用途に応じて、3つの場所に書き分ける。

| 種類 | 書く場所 | 用途 | 追加するコマンド |
| --- | --- | --- | --- |
| 通常の依存 | `[project]` の `dependencies` | 実行に必要なパッケージ。利用者にも入る | `uv add <パッケージ名>` |
| オプション依存 (extras) | `[project.optional-dependencies]` | 利用者が、選んで入れる追加機能 (`pip install "pkg[pdf]"`) | `uv add --optional <extra名> <パッケージ名>` |
| 依存グループ | `[dependency-groups]` | 開発者向けのパッケージ (テスト、ドキュメントなど)。公開するパッケージの情報には含まれない | `uv add --group <グループ名> <パッケージ名>` |

```toml
[project]
dependencies = ["requests>=2.31"]

[project.optional-dependencies]
pdf = ["reportlab"]

[dependency-groups]
dev = ["pytest>=8.0.0"]
docs = ["mkdocs"]
```

```bash
# extra を含めて同期
uv sync --extra pdf

# グループを含めて同期
uv sync --group docs

# すべてのグループを含める
uv sync --all-groups
```

<pre><code class="tips">dev グループは、uv sync や uv run で、既定で含まれる。含めたくないときは --no-dev を付ける。
--dev は、--group dev の短縮形である。</code></pre>

### バージョンの指定

| 書き方 | 意味 |
| --- | --- |
| `requests` | バージョンの指定なし。uv add すると、取得したバージョンが、下限 (`>=`) として記録される |
| `requests>=2.31` | 2.31 以上 |
| `requests==2.31.0` | 2.31.0 に固定 |
| `requests~=2.31` | 互換のあるバージョン (2.31 以上、3.0 未満) |
| `requests>=2.31,<3` | 範囲を指定 |

### 依存元の指定 (tool.uv.sources)

PyPI 以外 (Git リポジトリやローカルのパス) から入れるときは、`[tool.uv.sources]` に書く。

```toml
[project]
dependencies = ["mylib", "gitlib"]

[tool.uv.sources]
mylib = { path = "../mylib", editable = true }
gitlib = { git = "https://github.com/example/gitlib", tag = "v1.0.0" }
```

| キー | 内容 |
| --- | --- |
| `git` | Git リポジトリの URL。`tag`、`branch`、`rev` で、取得する位置を指定する |
| `path` | ローカルのパス。`editable = true` で、編集可能な形で入れる |
| `workspace` | ワークスペースのメンバー (`workspace = true`) |
| `index` | 指定した、パッケージのインデックスから取得する |

### 更新

```bash
# すべてのパッケージを最新にして、環境に反映
uv sync --upgrade

# 特定のパッケージだけ更新
uv lock --upgrade-package requests
uv sync

# 古くなっているパッケージを確認
uv tree --outdated
```

<pre><code class="tips">プレリリース版の扱いは、--prerelease で指定する (allow、disallow、explicit など)。
0.12 以降は、依存先のパッケージが要求するプレリリース版も、解決できるようになった。その場合も、安定版があれば、先に選ばれる。</code></pre>

---

## ワークスペース <a id="workspace" data-name="ワークスペース"></a>

複数のパッケージを、1つのリポジトリで、まとめて管理する仕組み (Cargo のワークスペースに由来する)。モノレポで使う。

```toml
# ルートの pyproject.toml
[project]
name = "albatross"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = ["bird-feeder"]

[tool.uv.sources]
bird-feeder = { workspace = true }

[tool.uv.workspace]
members = ["packages/*"]
exclude = ["packages/seeds"]
```

```text
albatross/
├── pyproject.toml
├── uv.lock
├── src/albatross/
└── packages/
    ├── bird-feeder/
    │   └── pyproject.toml
    └── seeds/            # exclude されているので、メンバーではない
```

| 項目 | 内容 |
| --- | --- |
| uv.lock | ワークスペース全体で、1つだけ作られる |
| `uv lock` | ワークスペース全体を、一度に解決する |
| `uv run` / `uv sync` | 既定では、ルートに対して動く。`--package <名前>` で、特定のメンバーを対象にできる |
| `--all-packages` | すべてのメンバーを対象にする (例: `uv sync --all-packages`) |
| requires-python | ワークスペース全体で、1つになる (すべてのメンバーの範囲の、共通部分) |

```bash
# メンバー bird-feeder の環境で、テストを実行
uv run --package bird-feeder pytest
```

<pre><code class="caution">メンバー同士で、依存関係が衝突する場合や、メンバーごとに、別の仮想環境が必要な場合は、ワークスペースに向かない。その場合は、各パッケージを独立したプロジェクトにして、パスの依存 (path) で、つなぐ。
また、あるメンバーが、別のメンバーの依存パッケージを、誤って import していても、uv は検知できない。</code></pre>

---

## 設定 <a id="config" data-name="設定"></a>

### 設定ファイル

uv の設定は、次の場所に書ける。

| 場所 | 内容 |
| --- | --- |
| pyproject.toml の `[tool.uv]` | プロジェクトの設定 |
| uv.toml | プロジェクトの設定 (pyproject.toml と同じディレクトリに置く) |
| `~/.config/uv/uv.toml` (Windows は `%APPDATA%\uv\uv.toml`) | ユーザー全体の設定 |

<pre><code class="tips">uv.toml と pyproject.toml の [tool.uv] が、同じディレクトリに両方あるときは、uv.toml が使われる。
設定は、コマンドラインのオプション、環境変数、プロジェクトの設定、ユーザーの設定の順に、優先される。</code></pre>

```toml
# pyproject.toml
[tool.uv]
# このプロジェクト自身を、パッケージとしてビルド・インストールしない
package = false

# uv sync / uv run で、既定で含めるグループ
default-groups = ["dev", "docs"]

# チームで、uv のバージョンをそろえる
required-version = ">=0.12"

# 社内などの、別のパッケージのインデックスを追加
[[tool.uv.index]]
name = "internal"
url = "https://example.com/simple"
```

### 環境変数

| 環境変数 | 内容 |
| --- | --- |
| `UV_CACHE_DIR` | キャッシュの置き場所 |
| `UV_PYTHON` | 使用する Python (バージョンまたはパス) |
| `UV_PROJECT_ENVIRONMENT` | プロジェクトの仮想環境の場所 (既定は .venv) |
| `UV_LINK_MODE` | パッケージのファイルの入れ方 (`copy` など)。キャッシュと環境が、別のファイルシステムにあるときに使う |
| `UV_PUBLISH_TOKEN` | uv publish で使う、トークン |

---

## CI と Docker <a id="ci" data-name="CI と Docker"></a>

### GitHub Actions

```yaml
steps:
  - uses: actions/checkout@v4
  # setup-uv のバージョンは、公式の README で、最新を確認する
  - uses: astral-sh/setup-uv@v5
  - run: uv sync --locked
  - run: uv run pytest
```

CI では、`--locked` を付けて、uv.lock が pyproject.toml と合っていないときに、エラーにする。付けないと、uv が、uv.lock を自動で更新してしまい、食い違いに気づけない。

### Docker

```dockerfile
FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# 先に、依存パッケージだけを入れる (ソースを変えても、この層のキャッシュが効く)
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-install-project --no-dev

# ソースをコピーして、プロジェクト自身を入れる
COPY . .
RUN uv sync --locked --no-dev

CMD ["uv", "run", "main.py"]
```

<pre><code class="tips">.venv/ は、.dockerignore に入れる。ホストの仮想環境を、イメージにコピーしないようにする。
:latest は、バージョンが変わるので、再現性が必要なときは、バージョンのタグを指定する。</code></pre>

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

ビルドした成果物は、dist/ に作られる。公開には、PyPI のトークンが必要になる。

```bash
# トークンを指定して公開
uv publish --token <トークン>

# 環境変数で指定
UV_PUBLISH_TOKEN=<トークン> uv publish

# テスト用の TestPyPI に公開
uv publish --publish-url https://test.pypi.org/legacy/
```

ワークスペースのすべてのメンバーを、まとめてビルドするときは、`uv build --all-packages` を使う。

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| uv pip install したのに、pyproject.toml が変わらない | uv pip は、pip 互換のコマンドで、プロジェクトの設定を更新しない | プロジェクトで管理するなら、`uv add` を使う |
| uv pip install で、仮想環境が見つからないというエラーになる | 仮想環境 (.venv) がない | `uv venv` で作る。プロジェクトなら、`uv add` や `uv sync` を使う |
| uv sync をしたら、手で入れたパッケージが消えた | uv sync は、ロックファイルと、環境を完全に一致させる | pyproject.toml に追加する (`uv add`)。一時的に使うなら `uv run --with`。残したいなら `--inexact` |
| `uv add requests>=2.31` で、おかしなファイルができた | `>` が、シェルのリダイレクトとして、解釈された | `"requests>=2.31"` のように、引用符で囲む |
| uv add がプロジェクトの外でエラーになる | pyproject.toml のあるディレクトリの外で、実行している | プロジェクトのディレクトリへ移動する。まだなければ、`uv init` で作る |
| uv tool install したのに、コマンドが見つからない | ツールの置き場所が、PATH に入っていない | `uv tool update-shell` を実行して、シェルを再起動する |
| CI で、uv.lock の食い違いに気づけなかった | 既定では、uv run や uv sync が、uv.lock を自動で更新する | CI では、`--locked` を付ける |
| 別のマシンで、Python のバージョンが違い、動かない | .python-version や requires-python が、そろっていない | `uv python pin` で固定して、.python-version を Git で管理する |
| uv self update が使えない | Homebrew や pip で、uv を入れている | 入れたときと同じ、パッケージマネージャーで更新する |
| チームで、uv のバージョンが違い、挙動が変わった | uv は、0.x の間は、更新で挙動が変わることがある | `required-version` で、バージョンの範囲をそろえる |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| uv の公式ドキュメント (docs.astral.sh/uv) | 全機能の詳細と、コマンドリファレンス |
| uv の CHANGELOG (GitHub: astral-sh/uv) | 更新の履歴と、挙動の変更 |
| 「pip と venv」のノート | 従来の方法 (pip、venv) の使い方 |

---
