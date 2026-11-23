---
title: pip
layout: default
---

# pip <a id="top" data-name="TOP"></a>

pip は、Python パッケージのインストール、アップグレード、および管理を行うための、コマンドラインツール。<br>
PyPI (Python Package Index) などから、パッケージを取得して、インストールする。

仮想環境の中で使うのが基本である。仮想環境の作り方は、venv のドキュメントを参照。

---

## 概要 <a id="overview" data-name="概要"></a>

### 特徴

| 特徴 | 内容 |
| --- | --- |
| パッケージの管理 | インストール、アンインストール、アップグレード、一覧の表示ができる |
| 依存関係の解決 | インストールするパッケージが必要とする、他のパッケージも、あわせて入れる |
| 環境の再現 | `requirements.txt` に、パッケージの一覧を書き出して、別の環境で復元できる |
| 定期的なリリース | 年に4回ほど、機能のリリースがある (26.0、26.1 のように、年と番号で表す) |

<pre><code class="caution">このドキュメントは、pip 26.3 (2026年11月) を前提にしている。
新しいオプションは、バージョンによって使えないことがある。pip --version で、バージョンを確認する。</code></pre>

---

## pip のインストール <a id="install" data-name="pipのインストール"></a>

```bash
sudo apt update
sudo apt install python3-pip
```

インストールできたかどうかは、バージョンの表示で確認する。

```bash
pip --version
python3 -m pip --version
```

<pre><code class="tips">python.org の公式のインストーラーで入れた Python には、通常、pip が含まれている。
仮想環境を作ると、その中には、pip が自動で入る。</code></pre>

---

## pip 自体のアップグレード <a id="upgrade-pip" data-name="pip自体のアップグレード"></a>

```bash
python3 -m pip install --upgrade pip
```

<pre><code class="caution">Debian や Ubuntu のシステムの Python に対して、このコマンドを実行すると、externally-managed-environment のエラーになることがある。
その場合は、仮想環境を作って、その中でアップグレードする。</code></pre>

仮想環境を作るときに、`--upgrade-deps` を付けると、pip が最新版になる。

```bash
python3 -m venv --upgrade-deps .venv
```

---

## 使い方 <a id="usage" data-name="使い方"></a>

| コマンド | 説明 |
| --- | --- |
| pip install パッケージ名 | パッケージのインストール |
| pip uninstall パッケージ名 | パッケージのアンインストール |
| pip freeze > requirements.txt | パッケージの固定化 |
| pip install -r requirements.txt | パッケージの一括インストール |
| pip install --no-cache-dir -r requirements.txt | 仮想環境などでキャッシュを行わずに一括インストール |
| pip list | インストール済みパッケージの確認 |
| pip show パッケージ名 | パッケージのバージョン確認 |
| pip install パッケージ名==バージョン | パッケージのバージョンを指定してインストール |
| pip install --upgrade パッケージ名 | パッケージのアップグレード |

### その他のよく使うコマンド

| コマンド | 説明 |
| --- | --- |
| pip list --outdated | 新しいバージョンがある、パッケージの確認 |
| pip uninstall -y パッケージ名 | 確認なしで、アンインストール |
| pip install --dry-run パッケージ名 | インストールせずに、何が入るかを確認 |
| pip install -e . | 開発中のプロジェクトを、編集可能な状態でインストール |
| pip check | インストール済みパッケージの、依存関係の矛盾を確認 |

<pre><code class="tips">pip とは別の Python が起動してしまうことを避けたいときは、python3 -m pip install のように、python3 -m を付けて実行する。
どの Python の pip を使うかが、はっきりする。</code></pre>

---

## バージョンの指定 <a id="version-specifier" data-name="バージョンの指定"></a>

| 書き方 | 意味 |
| --- | --- |
| `パッケージ名==1.2.3` | 1.2.3 に固定する |
| `パッケージ名>=1.2` | 1.2 以上 |
| `パッケージ名<2.0` | 2.0 未満 |
| `パッケージ名~=1.2` | 1.2 以上、2.0 未満 (互換のあるバージョン) |
| `パッケージ名!=1.3` | 1.3 を除く |

範囲を指定するときは、全体を引用符で囲む。

```bash
pip install "requests>=2.0,<3.0"
```

<pre><code class="caution">引用符で囲まずに、pip install requests&gt;=2.0 と書くと、シェルが、&gt; をリダイレクトとして解釈する。
2.0 という名前のファイルが作られて、意図した結果にならない。</code></pre>

---

## requirements.txt <a id="requirements" data-name="requirements.txt"></a>

`requirements.txt` は、インストールするパッケージを、1行に1つずつ書いたファイル。

```text
requests==2.32.3
flask>=3.0
```

```bash
pip freeze > requirements.txt
pip install -r requirements.txt
```

`pip freeze` は、インストール済みのパッケージを、すべてバージョンつきで書き出す。直接入れたパッケージだけでなく、依存するパッケージも含まれる。

<pre><code class="tips">環境を作り直すときは、仮想環境を新しく作って、pip install -r requirements.txt を実行する。
キャッシュを使わない方が良い場合は、--no-cache-dir を付ける。</code></pre>

---

## 仮想環境での利用 <a id="venv" data-name="仮想環境での利用"></a>

仮想環境を有効化した状態では、`pip` は、その環境にパッケージをインストールする。

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install requests
pip list
deactivate
```

<pre><code class="caution">Debian や Ubuntu などの、最近のシステムの Python には、pip によるインストールを制限する仕組みがある (PEP 668)。
システムの Python に、直接パッケージを入れようとすると、externally-managed-environment のエラーになる。
--break-system-packages で回避できるが、システムを壊す恐れがあるため、仮想環境を使う。</code></pre>

---

## 設定とキャッシュ <a id="config-cache" data-name="設定とキャッシュ"></a>

| コマンド | 説明 |
| --- | --- |
| pip config list | 現在の設定の確認 |
| pip cache dir | キャッシュの場所の確認 |
| pip cache list | キャッシュの内容の確認 |
| pip cache purge | キャッシュの削除 |

設定は、設定ファイルや、`PIP_` で始まる環境変数でも、変更できる。詳細は、公式のドキュメントで確認する。

---

## pip 26 系の主な変更 <a id="pip-26" data-name="pip26系の主な変更"></a>

| バージョン | 変更 |
| --- | --- |
| 26.0 | `--uploaded-prior-to` で、指定した日時より前にアップロードされた配布物だけを、対象にできる。`--only-final` と `--all-releases` で、パッケージごとに、プレリリースを制御できる |
| 26.1 | ロックファイル (`pylock.toml`) と、公開直後のバージョンを避ける仕組みが、話題になった。ホイールのインストール時に、予期しないインポートがあると、警告する |
| 26.2 | Python 3.15 の対応を表明した。制約ファイルが、分離されたビルド環境に、影響しなくなった。ビルド時の制約は、`--build-constraint` で指定する |
| 26.3 | ホイールのインストール時に、予期しないインポートを、ブロックする。中断されたインストールからの、回復も改善された |

<pre><code class="caution">この表は、リリースの告知をもとに、要点だけをまとめたもの。
オプションの細かい挙動は、バージョンごとに変わることがあるため、公式のドキュメントで確認する。</code></pre>

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `error: externally-managed-environment` | システムの Python に、pip で直接入れようとした (PEP 668) | 仮想環境を作って、その中でインストールする |
| `pip: command not found` | pip が入っていない、または PATH に含まれていない | `sudo apt install python3-pip` を実行する。`python3 -m pip` でも実行できる |
| `Permission denied` | システムのディレクトリに、書き込もうとした | `sudo pip` は使わず、仮想環境を使う |
| 入れたはずのパッケージが、`import` できない | `pip` と `python` が、別の環境を指している | `python3 -m pip install` で実行して、同じ Python に入れる |
| `Failed building wheel` | ビルドに必要なコンパイラや、ヘッダーファイルがない | エラーの内容を確認して、必要なパッケージを OS に入れる |
| `requests>=2.0` と書いたら、ファイルができた | 引用符がなく、`>` がリダイレクトになった | `"requests>=2.0"` のように、引用符で囲む |
| `requirements.txt` に、使っていないパッケージが入る | `pip freeze` は、依存するパッケージも、すべて書き出す | 直接使うパッケージだけを、手で書く方法も検討する |
| 依存関係の矛盾の警告が、表示された | パッケージどうしが、互いに合わないバージョンを要求している | `pip check` で確認して、バージョンを調整する |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| venv | 仮想環境の作成。venv のドキュメントを参照 |
| uv | pip と同様の操作が、できる高速なツール。uv のドキュメントを参照 |
| `pipx` | コマンドラインのアプリを、独立した環境にインストールする |
| `requirements.txt` | パッケージの一覧を書いたファイル |
