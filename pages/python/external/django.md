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

---



