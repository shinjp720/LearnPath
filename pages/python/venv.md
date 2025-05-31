<div data-title="venv"></div>
<a id="top" data-name="TOP"></a>

# venv

- venvは仮想環境を作成するための標準ライブラリで、プロジェクトごとにPythonパッケージを分離するのに役立つ。
- Python3.3以降は基本的にデフォルトでインストールされているが、Linux系の場合Python本体は入っていても別パッケージとして分離されている場合がある。
その場合は以下を実行する。

```bash
sudo apt install python3-venv
```

---

## 仮想環境の作成

```bash
python3.11 -m venv .venv
```
環境にインストール済みのpythonのバージョンを指定することができる。<br>
.venvの部分は任意の仮想環境名を指定可能。

---

## 仮想環境の有効化

```bash
source .venv/bin/activate
```

もしくは

```bash
. .venv/bin/activate
```

---

## 仮想環境内での操作

| コマンド                        | 説明                             |
| ------------------------------- | -------------------------------- |
| pip install パッケージ名        | パッケージのインストール         |
| pip list                        | インストール済みパッケージの確認 |
| pip freeze > requirements.txt   | パッケージの固定化               |
| pip install -r requirements.txt | パッケージの一括インストール     |
| deactivate                      | 仮想環境の無効化                 |

---

## 仮想環境の削除
```bash
rm -rf .env
```
仮想環境のディレクトリごと削除すればOK。

---

## スクリプトの自動化

```bash
#!/bin/bash
source .venv/bin/activate
python script.py
```

これを`run.sh`として保存。<br>

実行権限を付与して。

```bash
chmod +x run.sh
```

実行。

```bash
. run.sh
```
