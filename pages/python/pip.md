<div data-title="pip"></div>
<a id="top" data-name="TOP">

# pip

- pipはpythonパッケージのインストール、アップグレード、および管理を行うためのコマンドラインツール。

---

## pip自体のアップグレード

```python
python -m pip install --upgrade pip
```

---

## 使い方

| コマンド                                       | 説明                                               |
| ---------------------------------------------- | -------------------------------------------------- |
| pip install パッケージ名                       | パッケージのインストール                           |
| pip uninstall パッケージ名                     | パッケージのアンインストール                       |
| pip freeze > requirements.txt                  | パッケージの固定化                                 |
| pip install -r requirements.txt                | パッケージの一括インストール                       |
| pip install --no-cache-dir -r requirements.txt | 仮想環境などでキャッシュを行わずに一括インストール |
| pip list                                       | インストール済みパッケージの確認                   |
| pip show パッケージ名                          | パッケージのバージョン確認                         |
| pip install パッケージ名==バージョン           | パッケージのバージョンを指定してインストール       |
| pip install --upgrade パッケージ名             | パッケージのアップグレード                         |