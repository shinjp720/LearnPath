---
title: uv
layout: default
---

# uv <a id="top" data-name="TOP"></a>

## 導入 <a id="introduction" data-name="導入"></a>

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

を実行してターミナルを再起動、または以下のコマンドを実行。

```bash
source $HOME/.local/bin/env
```

---

## 基本 <a id="basic" data-name="基本"></a>

### プロジェクト管理

#### `uv init`

カレントディレクトリに新しいプロジェクトを作成する (pyproject.tomlが作成される) 。

#### `uv add <パッケージ名>`

パッケージをインストールし、 pyproject.toml に追加する。必ずプロジェクトルートで実行する。

#### `uv add --dev <パッケージ名>`

開発環境専用のパッケージ ( pytest や black など) を追加する。

#### `uv remove <パッケージ名>`

パッケージをアンインストールし、設定からも削除する。

#### `uv sync`

uv.lock の状態に合わせて、現在の環境を完全に同期 (一括インストール) する。

---

### スクリプトやツールの実行

#### `uv run <スクリプト名.py>`

プロジェクト環境 (uv.lock) を利用してPythonスクリプトを実行する。

#### `uv run --with <パッケージ名> <スクリプト名.py>`

指定したパッケージをその場だけ一時的にインストールして実行する。


#### `uvx <ツール名>`

Ruff などのコマンドラインツールを、環境を汚さずにその場でダウンロードして実行する (旧 pipx) 

---

### Python のバージョン管理

#### `uv python list`

インストール可能な (またはインストール済みの) Python のバージョン一覧を表示する。

#### `uv python install <バージョン>`

指定した Python (例: 3.12) をダウンロードしてインストールする。

#### `uv python pin <バージョン>`

そのプロジェクトで使用する Python のバージョンを固定する。

---

### 従来の pip や venv を使う

#### `uv venv`

カレントディレクトリに仮想環境 (.venv) を作成する。

#### `uv pip install <パッケージ名>`

従来の pip install と同じ感覚で、仮想環境にパッケージを入れる

#### `uv pip compile requirements.in -o requirements.txt`

requirements.in から依存関係を解決した requirements.txt を書き出す