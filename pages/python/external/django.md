---
title: Django
layout: default
---

# Django <a id="top" data-name="TOP"></a>

## 導入 <a id="introduction" data-name="導入"></a>

### 仮想環境の作成とインストール

```bash
# 仮想環境の作成
python3 -m venv .venv

# 仮想環境の実行
source .venv/bin/activate

# Djangoのインストール
pip install django
```

### プロジェクトの作成

```bash
# プロジェクトを作成
django-admin startproject djangoproject
```

### サーバーの起動

```bash
# プロジェクト内へ移動
cd djangoproject

# サーバーを起動
python manage.py runserver
```

コードを書く
: こんちわ
: おおおおおおおおお。
: - aaaa
: - aaaa
> **プロジェクトの作成**
> `django-admin startproject prc`
> 
> ここに複数行の説明を書けます。
> 改行しても、空行を挟んでも「一つの塊」として表示されます。

> **データベースのマイグレーション**
> `python manage.py migrate`
> 
> 1. モデルの変更を検知
> 2. データベースに反映
> 
> のようなリストを中に入れることも可能です。