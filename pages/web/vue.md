---
title: Vue.js
layout: default
---

# Vue.js <a id="top" data-name="TOP"></a>

## 導入 <a id="introduction" data-name="導入"></a>

#### nvmのインストール

apt の node は古いことが多いので、今は nvm (Node Version Manager) を使うのが定番。

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

終わったらシェルの再起動。もしくは .bashrc を再読み込み。

```bash
source ~/.bashrc
```

nvm の動作確認。

```bash
nvm --version
```

#### Node.jsのインストール

LTS版を入れる。

```bash
nvm install --lts
```

<pre><code class="tips">誤って apt から入れた場合は、一旦削除してから nvm を入れる。
sudo apt purge nodejs npm -y && sudo apt autoremove -y
</code></pre>

#### プロジェクトの作成

```bash
npm create vue@latest
```

作成後に移動。

```bash
cd my-app
```

通常は依存関係のインストールは自動だが、念のため実行。

```bash
npm install
```

#### 開発サーバーを起動

```bash
npm run dev
```

---
