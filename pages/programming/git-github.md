---
title: Git/Github
layout: default
---

# Git/Github <a id="top" data-name="TOP"></a>

Git は、ファイルの変更履歴を管理する、分散型のバージョン管理システム。GitHub は、Git のリポジトリをインターネット上に置いて、共有、レビュー、共同開発を行うためのサービス。

このドキュメントは、導入からコマンド、困ったときの対処、用語までを、作業の順にまとめたノートである。

---

## 概要 <a id="overview" data-name="概要"></a>

### Git と GitHub

| | Git | GitHub |
| --- | --- | --- |
| 種類 | バージョン管理システム (ツール) | Git リポジトリのホスティングサービス |
| 動く場所 | 自分の PC | インターネット上 |
| 主な機能 | コミット、ブランチ、マージ | リモートリポジトリ、プルリクエスト、レビュー |

### 4つの場所とコマンド

Git のファイルは、4つの場所を移動する。コマンドが、その移動に対応している。

```text
ワークツリー ──▶ ステージ ──▶ ローカルリポジトリ ──▶ リモートリポジトリ
       git add        git commit            git push
```

| 移動 | コマンド |
| --- | --- |
| ワークツリー → ステージ | `git add` |
| ステージ → ローカルリポジトリ | `git commit` |
| ローカルリポジトリ → リモートリポジトリ | `git push` |
| リモートリポジトリ → ローカルリポジトリ | `git fetch` |
| リモートリポジトリ → ワークツリー (fetch と merge) | `git pull` |

### やりたいこと別の早見表

| やりたいこと | 参照する章 |
| --- | --- |
| 初めて Git を使う準備をする | <a href="#git-introduction">Git導入</a>、<a href="#github-introduction">GitHub導入</a> |
| 変更を保存する | <a href="#staging">ステージング操作</a>、<a href="#commit">コミット</a> |
| 別の作業用に枝分かれする | <a href="#branch">ブランチ操作</a> |
| 作業内容を合流させる | <a href="#merge">マージ</a> |
| サーバーとやり取りする | <a href="#remote">リモートリポジトリ</a> |
| 作業を一時的に避難させる | <a href="#temp">一時退避</a> |
| 変更を取り消す | <a href="#cancel-delete">取り消し・削除</a>、<a href="#trouble">困った時</a> |
| 1日の流れを知る | <a href="#workflow">作業の流れ</a> |
| 言葉の意味を知る | <a href="#term">用語</a> |

<pre><code class="caution">このドキュメントは、Git 2.x を前提にしている (2026年10月時点の最新は 2.56)。
ブランチの移動と、ファイルの復元は、新しい git switch と git restore を中心に書く。古い記事の git checkout は、同じ操作を別の書き方にしたものである。</code></pre>

---

## Git導入 <a id="git-introduction" data-name="Git導入"></a>

### 初期設定

#### ユーザーネームとメールアドレスを設定する

```bash
git config --global user.name "名前"
git config --global user.email "メールアドレス"
```

<pre><code class="tips">コミットには、ここで設定した名前とメールアドレスが記録される。GitHub に公開する場合は、GitHub に登録しているメールアドレスを指定する。</code></pre>

#### デフォルトの初期ブランチ名を登録する

```bash
git config --global init.defaultBranch main
```

<pre><code class="tips">Git 3.0 では、初期ブランチ名の既定が main になる予定である (2026年末ごろの見込み)。それまでは、この設定をしておくと、バージョンによる違いが出ない。</code></pre>

#### エディタを設定する場合

```bash
# VSCode の場合
git config --global core.editor "code --wait"
```

### 設定の確認

設定はホームディレクトリ下の `.gitconfig` に保存される。

<span class="code-like">git config -&#8203;-list</span> で確認することもできる。

---

## GitHub導入 <a id="github-introduction" data-name="GitHub導入"></a>

### SSHキーの生成

GitHub に登録されているメールアドレスを指定して、キーを生成する。

```bash
ssh-keygen -t ed25519 -C "email@example.com"
```

保存場所、パスフレーズを聞かれるので、必要なければ Enter を 3回入力する。

### GitHub に公開鍵を登録

`settings >> SSH and GPG keys >> New SSH key` に、<br>
`~/.ssh` にある `id_ed25519.pub` の内容を貼り付ける。

```bash
cat ~/.ssh/id_ed25519.pub
```

<pre><code class="caution">貼り付けるのは、拡張子が .pub の公開鍵だけである。拡張子のない秘密鍵 (id_ed25519) は、他人に見せたり、貼り付けたりしてはいけない。</code></pre>

### 接続確認

```bash
ssh -T git@github.com
```

初回接続時は、「Are you sure you want to continue connecting...」と聞かれるので、`yes` と入力する。

---

## リポジトリ作成・取得 <a id="repository" data-name="リポジトリ作成・取得"></a>

### `git init`

ローカルリポジトリを作成する。

| オプション | 内容 |
| --- | --- |
| `--bare` | 中身 (a.txt など) を持たず、変更履歴のみを持つ (ベアリポジトリ) |
| `--shared` | 複数ユーザーからプルするため、グループによるアクセス許可 (パーミッション) を付ける |

### `git clone <リモートURL>`

リモートリポジトリをクローン (複製) する。

---

## 状態確認 <a id="status" data-name="状態確認"></a>

### `git status`

ステータス (状態) を確認する。<br>
現在のブランチ、変更されたファイルなどが表示される。

| オプション | 内容 |
| --- | --- |
| `--ignored` | 無視されている項目を追加表示 |

### `git diff <コミットID> <コミットID>`

差分を見る。

| オプション | 内容 |
| --- | --- |
| `--word-diff` | 文字単位での差分。見やすくなる |
| `--cached` | インデックスとの差分 |

#### `git diff FETCH_HEAD..HEAD`

直近に fetch した内容と、ローカルブランチの差分を見る。

<pre><code class="tips">特定の追跡ブランチと比べるときは、git diff origin/main..HEAD のように、追跡ブランチの名前を書く。</code></pre>

### `git show <コミットID>`

コミットID を指定して、詳細を表示する。<br>
<span class="code-like">git show</span> のみだと、現在位置の指定 (git show HEAD と同じ) 。

### `git log`

コミットの履歴を表示する。

| オプション | 内容 |
| --- | --- |
| `--all` | 現在のブランチだけでなく、全てのブランチの履歴を表示 |
| `--oneline` | 各コミットごと 1行で表示 |
| `--graph` | グラフィカルに表示 |
| `--decorate` | 表示されているコミットの参照名を出力 |
| `--decorate=full` | より細かく表示 |
| `-n` | 過去 n 件分まで表示。`-5` とすれば 5件分 |
| `-p` | パッチ (差分) の表示 |

<pre><code class="example">git log --graph --oneline --all --decorate</code></pre>

### `git blame`

行ごとの変更者を確認する。

### `git reflog`

HEAD の移動履歴を表示する。リセットやブランチの削除を取り消すときに使う (<a href="#trouble">困った時</a>)。

---

## ステージング操作 <a id="staging" data-name="ステージング操作"></a>

### `git add <ファイル名>`

インデックスに追加 (ステージングする) 。

commit したときに保存されるのは、add したときの状態。add した後に作業して、その状態を commit する場合は、再び add する必要がある。

#### `git add .`

ドット (.) を使うと、カレントディレクトリ以下のものを、全て一括して追加する。

### add でステージングに含めたくない

#### 既に git で追跡中のファイル

自分のローカル環境だけの設定を、GitHub に上げたくないような場合。

```bash
git update-index --skip-worktree <ファイル名>
```

スキップされているファイルと、現在追跡中のファイルの一覧。

```bash
# H が追跡中のファイル、S がスキップ中のファイル
git ls-files -v
```

```bash
# スキップ中のファイルを抽出する
git ls-files -v | grep "^S"
```

スキップを解除して、追跡ファイルとする。

```bash
git update-index --no-skip-worktree <ファイル名>
```

#### 追跡ファイルではない場合

未追跡のファイルを、ステージングせずに無視したい。

```bash
echo "ファイル名" >> .git/info/exclude
```

.gitignore の要領で、<code class="code-like">.git/info/exclude</code> に列挙するといい。このファイルは、自分のローカル環境だけで有効になり、リポジトリには含まれない。

---

## コミット <a id="commit" data-name="コミット"></a>

### `git commit -m "コメント"`

ステージングしたものを、コミット (変更履歴をローカルリポジトリに登録) する。

コミットメッセージが空だと、コミットは中止される。`-m` を省略すると、エディタが開く。

| オプション | 内容 |
| --- | --- |
| `--amend` | 直前のコミットメッセージとコミット内容を修正 (push する前) |

<pre><code class="tips">コミットは、1つの変更を1つのコミットにすると、レビューや取り消しがしやすい。</code></pre>

---

## ブランチ操作 <a id="branch" data-name="ブランチ操作"></a>

### `git branch`

現在のブランチを確認する。

| オプション | 内容 |
| --- | --- |
| `-a` | リモートブランチも全て表示 |
| `-r` | リモートブランチにあるブランチだけ表示 |
| `-m ブランチ名` | ブランチ名を変える |
| `-d` | ブランチ削除 |

#### `git branch <新ブランチ名>`

HEAD が指しているコミットから、ブランチを作成する。

#### `git branch <新ブランチ名> <ブランチかID>`

現在どこにいるのかに関わらず、後ろの引数で指定したブランチ (または ID) から、新ブランチを作る。

```bash
# main が指しているコミットから feature を作る
git branch feature main
```

### `git switch <ブランチ名>`

ブランチを移動する。<span class="code-like">checkout</span> の代替として追加されたコマンド。

### `git switch -c <新ブランチ名>`

ブランチの作成と移動を、同時に行う。<span class="code-like">checkout</span> の代替として追加されたコマンド。

### ブランチの削除

```bash
# ローカルのブランチを削除
git branch -d feature-abc
# リモートに削除を反映
git push origin --delete feature-abc
```

| 削除対象 | コマンド |
| --- | --- |
| ローカルブランチ | `git branch -d feature-abc` |
| リモートブランチ | `git push origin --delete feature-abc` |

<pre><code class="tips">マージが終わったブランチは、もう使わないので、散らからないように削除しておく。
-d は、マージされていないブランチを削除しようとすると、拒否される。それでも削除する場合は、-D を使う。</code></pre>

---

## マージ <a id="merge" data-name="マージ"></a>

### `git merge <ブランチ名>`

現在のブランチ (HEAD) に、指定ブランチがマージされる。

| オプション | 内容 |
| --- | --- |
| `--no-edit` | エディタで開かれるのを回避する |
| `--abort` | コンフリクトで止まったマージを中止して、マージ前の状態に戻す |

### merge の手順

マージは、取り込み先のブランチに立って行う。

| 手順 | 内容 | コマンド |
| --- | --- | --- |
| 1 | 作業内容をコミット | `git add .`<br>`git commit -m "完成"` |
| 2 | 取り込み先に切り替える | `git switch main` |
| 3 | 最新の状態を反映させる (重要) | `git pull origin main` |
| 4 | 合流 | `git merge feature-abc` |
| 5 | リモートに反映 | `git push origin main` |

<pre><code class="tips">手順 3 が重要なのは、自分が作業している間に、他の人が main を更新しているかもしれないからである。古い状態のまま合流させると、コンフリクトが起きやすくなる。</code></pre>

### 親ブランチの変更を取り込む

作業中のブランチに、親ブランチ (main や release など) の最新の変更を取り込む方法は、2つある。

| 方法 | 特徴 | 向いている場面 |
| --- | --- | --- |
| `git merge` | コンフリクトの解消が 1度で済むが、グラフの履歴が少し複雑になる | 安全に進めたいとき。初心者向け |
| `git rebase` | 履歴をきれいに保てるが、場合によっては複数回コンフリクトを解消する | 履歴を一本道にしたいとき |

#### git merge を使う (安全・初心者向け)

親ブランチの変更を取り込む、標準的なやり方。コンフリクトの解消が 1度で済むが、グラフの履歴が少し複雑になる。

```bash
# 取り込みたいブランチにいる状態で release を取り込む場合
git merge origin/release
```

#### git rebase を使う (履歴をきれいに保つ)

親ブランチの最新状態からブランチを切ったかのようになるが、場合によっては複数回コンフリクトの解消が必要になる。

```bash
# 取り込みたいブランチにいる状態で release にブランチを付け替えたい場合
git rebase origin/release
```

### `git rebase`

履歴を付け替える。

<pre><code class="caution">rebase は、コミットを作り直して、履歴を書き換える。すでに push して、他の人が取得しているブランチには、使わない。
書き換えた履歴を push するには、強制的な push が必要になり、他の人の履歴と食い違う原因になる。</code></pre>

### コンフリクトの解消 <a id="conflict" data-name="コンフリクトの解消"></a>

同じファイルの同じ行を、別々のブランチで編集してマージすると、Git がどちらを優先するか決められず、止まる。これが**コンフリクト** (衝突) である。`CONFLICT` と表示されても、慌てる必要はない。

1. エディタ (VS Code など) で、ファイルを開く。
2. `<<<<<<<` や `>>>>>>>` で囲まれた部分を見て、正しいコードに修正する。
3. 修正したファイルを `git add` して、`git commit` する。

```text
<<<<<<< HEAD
現在のブランチ側の内容
=======
マージしようとしたブランチ側の内容
>>>>>>> feature-abc
```

<pre><code class="tips">コンフリクトを解消できないときは、git merge --abort で、マージを始める前の状態に戻せる。</code></pre>

### プルリクエスト (PR) <a id="pull-request" data-name="プルリクエスト"></a>

チーム開発では、いきなり `git merge` せずに、GitHub 上の**プルリクエスト**の機能を使って、マージするのが一般的である。

| 手順 | 内容 | コマンドなど |
| --- | --- | --- |
| 1 | ブランチをそのまま push | `git push origin feature-abc` |
| 2 | ブラウザで GitHub を開く | 「Compare & pull request」のボタンを押す |
| 3 | レビューを受ける | チームメンバーに、コードを見てもらう |
| 4 | 承認されたらマージ | GitHub 上のボタンで、マージする |

<pre><code class="tips">PR を使うと、「誰が、何を、なぜ変更したか」の記録が残り、ミスを事前に防げる。</code></pre>

---

## リモートリポジトリ <a id="remote" data-name="リモートリポジトリ"></a>

### `git remote`

リモート名を表示する。

| オプション | 内容 |
| --- | --- |
| `-v` | 登録されているリモート名と URL を表示 |

#### `git remote add <リモート名> <リモートURL>`

リモートリポジトリを登録する。

#### `git remote rename <旧リモート名> <新リモート名>`

登録されているリモート名を変更する。

#### `git remote set-url <リモート名> <変更したいURL>`

登録されているリモートの URL を変更する。

#### `git remote rm <リモート名>`

リモートリポジトリを削除する。

### `git fetch <リモート名> <ブランチ名>`

リモートブランチの変更履歴を、追跡ブランチに持ってくる。<br>
<span class="code-like">fetch</span> は HEAD に影響されないので、安全に実行できる。ただし <span class="code-like">pull</span> は別。

### `git push <リモート名> <ブランチ名>`

ローカルからリモートへプッシュする。

#### `git push -u <リモート名> <ブランチ名>`

追跡を指定して、以降ブランチ名の記述が不要になる。

### `git pull <リモート名> <取り込みたいブランチ名>`

フェッチとマージを同時に行う。<br>
リモートブランチの変更履歴を、ローカルブランチの HEAD (今いるブランチ) に、一気に持ってくる。

<span class="code-like">git push -u origin main</span> が指定されていると、origin main がマージされる。

<pre><code class="caution">ファイルをコミットしていない状態で  <span class="code-like">pull</span> しようとすると
ファイルが混ざるのを防ぐために <span class="code-like">pull</span> が拒否されることがあるのでその場合は、
<span class="code-like">git stash</span> <span class="code-like">git pull</span> <span class="code-like">git stash pop</span> を行う。</code></pre>

### リモートから特定のディレクトリを取り込む

事前に `git fetch` で、リモートの最新の状態を取得しておく。

#### 単一のファイルを取り込む

```bash
git restore --source=origin/<ブランチ名> -- <ファイルパス>
```

#### ディレクトリごと取り込む

```bash
git restore --source=origin/<ブランチ名> -- <ディレクトリパス>/
```

---

## 一時退避 <a id="temp" data-name="一時退避"></a>

### `git stash`

<span class="code-like">stash</span> は、現在の作業内容を一時的に退避して、作業ディレクトリとステージング領域を、HEAD (現在の最新コミット) の状態に戻す。コミットはしたくない場合に便利。<br>
基本的には、ワーキングツリーはクリーンになる。<br>
<span class="code-like">git stash</span> で作成されたデータは、.git/refs/stash というファイルに保存される。

| オプション | 内容 |
| --- | --- |
| `-m` | commit のようにメッセージを付ける |
| `-u` | untracked file も含めて退避 |

<pre><code class="tips">Git の管理下にあるファイルしか退避させないので、
<span class="code-like">git stash -u</span> が普段使いでOK。</code></pre>

#### `git stash pop`

退避していた変更が再び適用されて、stash は削除される。

#### `git stash apply`

退避していた変更を適用して、stash を残しておく場合。

<pre><code class="caution">git apply は、パッチファイルを適用する別のコマンドである。stash の変更を適用するときは、git stash apply と書く。</code></pre>

#### `git stash list`

stash の一覧を表示する。

```bash
stash@{0}: WIP on release: 5f3a2b1... # 一番新しい
stash@{1}: WIP on feature/login: 8d9c4f2...
stash@{2}: WIP on main: 3a7b9e0... # 古いもの
```

<pre><code class="tips">WIP は Work In Progress の略</code></pre>

インデックスを指定して適用する。

```bash
git stash pop stash@{1}
git stash apply stash@{1}
```

<pre><code class="tips">間違ったブランチで作業をしたので、<span class="code-like">switch</span> したくても、
ファイルに変更を加えた状態では <span class="code-like">switch</span> 出来ないので 、
<span class="code-like">stash</span> で <span class="code-like">commit</span> する前の状態にして 
<span class="code-like">switch</span> してから <span class="code-like">pop</span> を行うと解決できる。</code></pre>

---

## 取り消し・削除 <a id="cancel-delete" data-name="取り消し・削除"></a>

### `git restore <ファイル名>`

ファイルの変更を捨てて、ステージング (なければ最新コミット) の状態に戻す。

<pre><code class="tips">誤って <span class="code-like">git rm</span> した場合でもコミット前なら <span class="code-like">git restore &lt;ファイル名&gt;</span> で戻せる</code></pre>

### `git restore --staged <ファイル名>`

誤って余計なファイルをステージングしてしまった時などに、ステージングを取り消す。

### `git restore --source <コミットID> <ファイル名>`

ファイルの変更を捨てて、特定のコミットの状態まで戻す。

<pre><code class="tips">このコマンドは、作業ツリーのファイルだけを戻す。ステージングも戻すときは、--staged --worktree を付ける。</code></pre>

### `git reset --hard HEAD`

最新のコミット (HEAD) の状態に、手元のファイルごと完全に巻き戻す。<br>
HEAD 以降の作業が無かったことになる。

### `git reset --hard <コミットID>`

現在作業中の状態を全て破棄して、コミットID の状態にする。

### `git reset --soft HEAD~`

直前のコミットだけを取り消して、add してステージングした状態に戻す。<br>
HEAD~ は 1つ前のコミットという意味。

| オプション | 戻る範囲 | 変更したファイル |
| --- | --- | --- |
| `--soft` | HEAD のみ | ステージングされたまま残る |
| `--mixed` (既定) | HEAD とステージング | ワークツリーに残る |
| `--hard` | HEAD、ステージング、ワークツリー | 破棄される |

<pre><code class="caution">reset --hard は、コミットしていない変更を、元に戻せない形で破棄する。実行する前に、git status で内容を確認する。</code></pre>

### `git revert`

打ち消しコミットを作成する。履歴を書き換えずに、取り消しを記録できるため、push 済みのコミットにも使える。

### `git rm <ファイル名>`

リポジトリにあるファイル自体を削除する。削除した履歴が残るのが特徴。

| オプション | 内容 |
| --- | --- |
| `--cached` | ファイルを残したまま Git の追跡をやめる。その後に .gitignore に追加 |
| `-r` | 再帰的にディレクトリごと削除 |

---

## タグ <a id="tag" data-name="タグ"></a>

コミットに、分かりやすい名前 (v1.0 など) を付ける。リリースの目印として使う。

### `git tag`

タグの一覧を表示する。

### `git tag v1.0`

現在のコミットに、軽量タグを付ける。

```bash
# 注釈付きタグ
git tag -a v1.0 -m "最初のリリース"
```

### `git push --tags`

ローカルのタグを、まとめてリモートへ送る。

```bash
# 1つだけ送る場合
git push origin v1.0

# タグを削除する場合
git tag -d v1.0
git push origin --delete v1.0
```

<pre><code class="tips">タグは、git push だけでは、リモートに送られない。git push origin &lt;タグ名&gt; か、git push --tags で送る。</code></pre>

---

## git worktree <a id="worktree" data-name="git worktree"></a>

1つの git リポジトリから、複数の作業ディレクトリを作って、別々のブランチを同時に作業できる機能。

.git/ が複製されるわけではなく、1つの .git/ を使うため、高速で安全。

### worktree を追加

```bash
git worktree add ../feature-a feature-a
```

### 新しいブランチを作りつつ追加

```bash
git worktree add -b feature-b ../feature-b
```

### worktree の一覧

```bash
git worktree list
```

### 作業が終わったら

大元の .git/ があるディレクトリから、

```bash
git worktree remove ../feature-a
```

またはディレクトリごと削除して、

```bash
git worktree prune
```

---

## 作業の流れ <a id="workflow" data-name="作業の流れ"></a>

ここまでのコマンドを、実際の開発の流れにまとめる。

### ブランチの基本操作

| 操作 | コマンド | 補足 |
| --- | --- | --- |
| 一覧表示 | `git branch` | 今どのブランチにいるか確認 |
| 新規作成 | `git branch <名前>` | 新しい枝を作る |
| 切り替え | `git switch <名前>` | 古い記事では `git checkout <名前>` |
| 作成と切り替え | `git switch -c <名前>` | 古い記事では `git checkout -b <名前>`。一番よく使う |
| 削除 | `git branch -d <名前>` | 用が済んだブランチを消す |

### トピックブランチ運用の流れ

開発現場で最も一般的な、機能ごとにブランチを作る流れ。

| 手順 | 内容 | コマンド |
| --- | --- | --- |
| 1 | 本番用 (main など) から、新しいブランチを作る | `git switch -c feature-login-page` |
| 2 | そのブランチの中で、作業してコミットする | `git add .`<br>`git commit -m "ログイン画面の実装"` |
| 3 | 合流先 (main など) に戻る | `git switch main` |
| 4 | 作った機能を、本番に取り込む | `git merge feature-login-page` |

### 1日の流れ

チーム開発 (GitHub や GitLab を使う場合) での、1日の流れの例。

#### 朝: 最新の状態に同期する

寝ている間に、他のメンバーが進めた作業を、自分の環境に取り込む。

| 手順 | 内容 | コマンド |
| --- | --- | --- |
| 1 | メインブランチ (`main` や `develop`) に移動 | `git switch main` |
| 2 | 最新をプルする | `git pull origin main` |

<pre><code class="tips">古いコードをベースに作業を始めると、あとで合流させるときに、コンフリクトが起きる確率が高くなる。</code></pre>

#### 昼: 自分のタスクを進める

| 手順 | 内容 | コマンド |
| --- | --- | --- |
| 1 | 最新の main から、新しいブランチを作る | `git switch -c feature/my-task` |
| 2 | こまめにコミットする。「1つの機能ができた」「バグが1つ直った」など、意味のある単位で記録する | `git add .`<br>`git commit -m "feat: 〇〇機能の実装"` |
| 3 | 任意で、本流 (main) を自分のブランチに取り込む。大きなプロジェクトでは、最終的な合流が楽になる | `git merge main` または `git rebase main` |

#### 夕方から夜: 成果を共有・保存する

| 手順 | 内容 | コマンドなど |
| --- | --- | --- |
| 1 | リモートにプッシュする。自分の PC が壊れても、コードは GitHub に残る | `git push origin feature/my-task` |
| 2 | プルリクエスト (PR) を作成する | ブラウザで GitHub を開いて作成 (<a href="#pull-request">プルリクエスト</a>) |
| 3 | レビューを受けて、コメントがあれば修正し、再度プッシュする | `git push origin feature/my-task` |
| 4 | 承認 (Approve) が出たら、`main` にマージする | GitHub 上のボタン |

### 意識しておくこと

| ポイント | 内容 |
| --- | --- |
| コミットは小さく | 巨大なコミットはレビューが大変。1つのコミットは、1つの変更が理想 |
| プルはこまめに | 朝だけでなく、昼休み明けなども `pull` しておくと、コンフリクトを最小限に抑えられる |
| スタッシュを活用 | 作業途中で、急に別のブランチを触る必要が出たら、`git stash` で一時避難する |
| コンフリクトを恐れない | Git が、ぶつかっている場所を示してくれる。手動で直して、コミットすれば解決する (<a href="#conflict">コンフリクトの解消</a>) |

### ブランチ名の付け方

一人のプロジェクトでも、あとで見たときに、何をしたブランチかが分かる名前にする。

| 名前 | 内容 |
| --- | --- |
| `feature/xxx` | 新機能 |
| `bugfix/xxx` | バグ修正 |
| `refactor/xxx` | コード整理 |

---

## 困った時 <a id="trouble" data-name="困った時"></a>

状況から、対処を探すための章。

| 状況 | 参照 |
| --- | --- |
| 作業途中で、別のブランチに切り替えたい | <a href="#trouble-switch">現在の履歴を残しつつ別のブランチに切り替えたい</a> |
| コミットを取り消したい | <a href="#trouble-undo">直前のコミットを取り消したい</a> |
| 消してしまったものを戻したい | <a href="#trouble-reflog">コミットを消してしまった</a>、<a href="#trouble-branch">ブランチを消してしまった</a> |
| 押してしまったものを直したい | <a href="#trouble-push">誤ったコミットをプッシュしてしまった</a> |

### 現在の履歴を残しつつ別のブランチに切り替えたい <a id="trouble-switch" data-name="別のブランチに切り替えたい"></a>

コミットできる状況なら、コミットするのが一番安心。

```bash
git add .
git commit -m "WIP: 作業途中"
git switch other-branch
```

コミットできない状況なら、stash がいい。

### 緊急対応などでブランチを切り替えたい

一つの方法として、現在の状態をコミットする。<br>
それができない場合は、`git stash` で変更内容をスタッシュに保存し、ブランチを切り替えて作業した後、ブランチを元に戻して取り出す。

```bash
git stash
# ブランチを切り替えて作業し、元のブランチに戻る
git stash pop
```

### 無視したいファイルをコミットしてしまったとき (ignoreしたい)

git の追跡対象から除外する。

```bash
git rm --cached ファイル名
```

過去のコミット履歴からも削除する。

```bash
git filter-branch -f --index-filter 'git rm --cached -rf --ignore-unmatch ファイル名' HEAD
```

<pre><code class="caution">git filter-branch は、公式のドキュメントで、使用が推奨されていない。落とし穴が多く、処理も遅いため、git filter-repo などの別のツールを使うことが勧められている。
履歴を書き換えたら、リモートにも強制的な push が必要になり、他の人のリポジトリと食い違う。
パスワードやキーなどの秘密情報を、コミットしてしまった場合は、履歴から消す前に、まず無効化して、作り直す。</code></pre>

```bash
# git filter-repo を使う場合 (別途インストールが必要)
git filter-repo --invert-paths --path ファイル名
```

### 直前のコミットを取り消したい <a id="trouble-undo" data-name="直前のコミットを取り消したい"></a>

リモートにプッシュしていないなら、`reset` で戻す。戻す範囲は、オプションで選ぶ。

| 戻す範囲 | コマンド |
| --- | --- |
| HEAD (コミットの先端) だけ元に戻す | `git reset --soft HEAD~` |
| HEAD とインデックス (ステージング) を元に戻す | `git reset HEAD~` |
| HEAD とインデックスとワーキングツリー (ローカルのファイル) を元に戻す | `git reset --hard HEAD~` |

プッシュ済みなら、`revert` で打ち消す。

```bash
git revert コミット
```

### 別のブランチにコミットしてしまった

例: main に、本来は feature に積むはずのコミットをしてしまった場合。

```bash
# 別のブランチを切る (今のコミットから feature ができる)
git branch feature

# 今のブランチ (main) をリセット
git reset --hard HEAD~

# 先ほどのブランチにスイッチ
git switch feature
```

<pre><code class="tips">すでに feature が存在する場合は、git branch ではなく、git cherry-pick で、コミットを feature に移す。</code></pre>

### コミットを消してしまった (リセットしてしまった) <a id="trouble-reflog" data-name="コミットを消してしまった"></a>

`reflog` で、リセットする前の HEAD のコミットID を調べて、戻す。

```bash
git reflog
git reset --hard コミットID
```

### ブランチを消してしまった <a id="trouble-branch" data-name="ブランチを消してしまった"></a>

```bash
git reflog
git branch ブランチ名 コミット
```

### コミットメッセージを変えたい

```bash
git commit --amend
```

<pre><code class="caution">amend は、コミットを作り直す。すでにプッシュしたコミットに使うと、履歴が食い違う。プッシュ前のコミットにだけ使う。</code></pre>

### マージしたけどコンフリクトしたので元に戻したい

マージを取り消す。

```bash
git reset --hard ORIG_HEAD
```

<pre><code class="tips">コンフリクトで止まっている最中は、git merge --abort でも、マージ前の状態に戻せる。</code></pre>

### 違うユーザー名でコミットしてしまった

`.gitconfig` か `.git/config` でユーザー名を変更して、HEAD のコミットを変更する。

```bash
git commit --amend -m "コミットメッセージ" --author="user.name <user.email>"
```

### 誤ったコミットをプッシュしてしまった <a id="trouble-push" data-name="誤ったコミットをプッシュしてしまった"></a>

リモートのブランチを削除して、ローカルのコミットを打ち消し、再度プッシュする。

```bash
# リモートのブランチを削除
git push origin :ブランチ名

# ローカルのコミットを打ち消す
git reset --hard コミット

# 再度プッシュする
git push origin ブランチ名
```

<pre><code class="caution">この方法は、リモートのブランチを削除するので、他の人がそのブランチを使っている場合は、使わない。
他の人も使っているブランチでは、git revert で、打ち消しコミットを追加する。</code></pre>

### リリース後にバグが出て切り戻したい

ログを見て、マージコミットを打ち消す。

```bash
git log
git revert -m 1 マージコミット
```

`-m 1` は、マージコミットの親のうち、1つ目 (マージ先のブランチ側) を残す、という指定。

### 切り戻したあとに再マージできない

切り戻しで作られた打ち消しコミットを、さらに打ち消してから、マージし直す。

```bash
git revert 打ち消したコミット
git merge ブランチ
```

---

## 用語 <a id="term" data-name="用語"></a>

### リポジトリ (repository)

リポジトリとは、ファイルやディレクトリの変更履歴 (コミット) を管理する場所。

#### リモートリポジトリ

リモート上のリポジトリ、Git 上に作られるリポジトリ (自分の PC などに作ることもできる) 。

#### ローカルリポジトリ

自分の PC に作られるリポジトリ。

### コミット (commit)

変更履歴をローカルリポジトリに登録することを、コミットという。

※ ここでいう変更履歴は、ファイルやディレクトリの 作成/更新/削除 を指す (空のディレクトリは Git 管理外となる) 。

### ステージ (stage)

ワークツリー内のファイルをコミットするためには、前準備として、コミット対象となるファイルをステージングエリア (ステージ) に置く必要がある。<br>
インデックスとも呼ばれる。

#### ワークツリー

git で履歴の管理を行う、ファイルの保存場所。

#### ステージング

ステージングエリアに置くには、<span class="code-like">git add</span> でファイルを指定して、インデックスに登録する (ステージするとも言う) 。

### ブランチ (branch)

ブランチとは、変更履歴を分岐して進めていく機能のこと。基本となる main ブランチがデフォルト。<br>
ブランチは、コミットを指す名前付きのポインタであり、HEAD は現在チェックアウトしている位置を表すポインタという、二段階構造になっている。<br>
ブランチはあくまでポインタであり、ツリー構造 (親子関係) になっているのは、コミット履歴。<br>
main ブランチのみでバージョン管理していくことも可能だが、通常は開発ブランチを作成し、さらに機能追加やバグ修正を並行して進めていく。

#### チェックアウト

ブランチを移動することを、チェックアウトという (main ブランチしかない状態は、main ブランチにチェックアウトされている状態ともいえる) 。<br>
現在では、ブランチの移動は <span class="code-like">git switch</span> が推奨。

#### 追跡ブランチ

追跡ブランチは、正確には「リモート追跡ブランチ」という。リモートを追跡するためのブランチ。<code class="code-like">origin/main</code> のような名前で表される。

### フェッチ (fetch)

リモートブランチの変更履歴を、追跡ブランチに持ってくることを、フェッチという。

また、直近のフェッチで取得した内容の先頭を指すポインタは、FETCH_HEAD となる (ローカルブランチは HEAD) 。

### マージ (merge)

変更を取り込んで、合流させる。<br>
変更を取り込みたいブランチに立って行う。

### リベース (rebase)

ブランチの土台を、別のコミットに付け替えて、履歴を書き換える。マージと違い、合流の記録が残らず、履歴が一本道になる。

### プル (pull)

フェッチとマージを同時に行うことを、プルという。リモートブランチの変更履歴を、ローカルブランチに一気に持ってくる。

### プッシュ (push)

プルをダウンロードに例えると、プッシュはアップロード。<br>
ローカルブランチの変更履歴を、リモートブランチに一気にアップする。

### クローン (clone)

リモートリポジトリの内容 (コミットされた変更履歴) を、ローカルリポジトリに複製すること。

### HEAD

現在位置 (チェックアウト中のコミット) を指すポインタ。

#### HEAD指定

HEAD とはブランチにおける現在位置を指すポインタのことで、簡単に言うと、現在のコミットID の別名。

#### 現在位置より前

チルダ (~) で、現在位置より前の場所を指定できる。<br>
HEAD~1 は 1つ前、HEAD~2 は 2つ前。

#### 親の指定

ブランチの親が複数ある時は、キャレット (^) で親の指定ができる。<br>
HEAD^1 は親その1、HEAD^2 は親その2となる。<br>
HEAD^ とだけすると、実質 HEAD~1 と同じく、現在より 1つ前 (直前) のコミットを指す。

### リセット (reset)

指定したコミットまで、リセットすることができる。

デフォルトでは、コミットとインデックス (ステージングエリア) がリセットされるが、オプションで指定することもできる。

<span class="code-like">--soft</span> はコミットのみリセット、<span class="code-like">--hard</span> はコミット/インデックス/ワーキングツリー (ワークツリー) の全てがリセットされる。

### log

<span class="code-like">git log</span> は、コミットのログを表示する。

### reflog

<span class="code-like">git reflog</span> は、参照ログ (HEAD 等の移動履歴) を表示する。この参照を指定して、リセットを戻すこともできる。

### リバート (revert)

コミットを打ち消すコミットを作成する。

### チェリーピック (cherry-pick)

特定のコミットを取り入れる。

### スタッシュ (stash)

ワークツリーの変更を、一時的に退避させる時に使う。

### タグ (tag)

コミットに、分かりやすい名前を付けたい場合は、タグを使う。

#### 軽量タグ

名前がついているだけの、シンプルなタグ。

#### 注釈付きタグ

注釈付きのタグも作成できる。注釈はコミット詳細に表示される。

### Git管理下から外す (.gitignore)

.gitignore という隠しファイルに指定すると、Git 管理下から外すことができる。

.gitignore という名前でファイルを作成して、エディタでファイル名とディレクトリ名を追加する。ファイルの場合は `/ファイル名`、ディレクトリの場合は `/ディレクトリ名/` で追加する。

<pre><code class="caution">.gitignore は、まだ追跡されていないファイルにだけ効く。すでにコミットしたファイルを外すには、git rm --cached ファイル名 で、追跡をやめてから、.gitignore に追加する。</code></pre>

### プルリクエスト (pull requests)

一通り終えたタスクのブランチのマージを、レビュワー (レビュー担当者) に依頼する機能のこと。

---

## よくある落とし穴 <a id="pitfalls" data-name="よくある落とし穴"></a>

| 症状 | 原因 | 対処 |
| --- | --- | --- |
| `fatal: not a git repository` | リポジトリではないディレクトリで実行している | リポジトリのディレクトリに移動する。または、`git init` や `git clone` を行う |
| `Please tell me who you are` | `user.name` と `user.email` が未設定 | `git config --global` で設定する (<a href="#git-introduction">Git導入</a>) |
| `Permission denied (publickey)` | SSH キーが、GitHub に登録されていない | 公開鍵を登録し、`ssh -T git@github.com` で確認する (<a href="#github-introduction">GitHub導入</a>) |
| `failed to push some refs` (rejected) | リモートに、手元にはない新しいコミットがある | `git pull` で取り込んでから、`git push` する |
| `src refspec main does not match any` | まだコミットがない。または、ブランチ名が違う | 1つ以上コミットしてから push する。`git branch` で名前を確認する |
| `Your local changes would be overwritten` | 未コミットの変更が、切り替えや取り込みと衝突する | コミットするか、`git stash` で退避する |
| `detached HEAD` | ブランチではなく、特定のコミットに移動している | `git switch -c <新ブランチ名>` で、ブランチを作る |
| `refusing to merge unrelated histories` | 共通の履歴がない、別々のリポジトリを合流させようとした | 合流させる意図を確認する。必要なら `--allow-unrelated-histories` を付ける |
| `.gitignore` に書いたのに、無視されない | すでに追跡されているファイル | `git rm --cached ファイル名` で、追跡をやめる |
| `push` したのに、ブランチが GitHub に見えない | 別のリモートや、別のブランチ名に送っている | `git remote -v` と `git branch -a` で確認する |

---

## 関連 <a id="related" data-name="関連"></a>

| 名前 | 用途 |
| --- | --- |
| GitHub CLI (`gh`) | コマンドラインから、PR の作成や、リポジトリの操作を行う |
| `git filter-repo` | 履歴の書き換え (ファイルの削除など) に使う、`filter-branch` の代わりのツール |
| Git 公式ドキュメント (git-scm.com) | 各コマンドの詳しい説明 |
| Docker | 開発環境をコンテナで管理する。リポジトリと組み合わせて使う |
