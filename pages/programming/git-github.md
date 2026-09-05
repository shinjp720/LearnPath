---
title: Git/Github
layout: default
---

# Git/Github <a id="top" data-name="TOP"></a>

---

## Git導入 <a id="git-introduction" data-name="Git導入"></a>

### 初期設定

#### ユーザーネームとメールアドレスを設定する

```bash
git config --global user.name “名前”
git config --global user.email “メールアドレス”
```

#### デフォルトの初期ブランチ名を登録する

```bash
git config --global init.defaultBranch main
```

#### エディタを設定する場合

```bash
# VSCode の場合
git config --global core.editor "code --wait"
```

### 設定の確認

設定はホームディレクトリ下の.gitconfigに保存される。

<span class="code-like">git config -&#8203;-list</span> で確認することもできる。

---

## GitHub導入 <a id="github-introduction" data-name="GitHub導入"></a>

### SSHキーの生成

GitHub に登録されているメールアドレスを指定してキーを生成。

```bash
ssh-keygen -t ed25519 -C "email@example.com"
```

保存場所、パスフレーズを聞かれるので、必要なければ Enter 3回入力。


### GitHub に公開鍵を登録

`settings >> SSH and GPG keys >> New SSH key` に、<br>
home にある id_ed25519.pub の内容を張り付ける。

```bash
cat id_ed25519.pub
```

### 接続確認

```bash
ssh -T git@github.com
```

初回接続時は「Are you sure you want to continue connecting...」と聞かれるので、yes と入力。

---

## リポジトリ作成・取得 <a id="repository" data-name="リポジトリ作成・取得"></a>

### git init

ローカルリポジトリの作成。

| --- | --- |
| `--bare` | 中身 (a.txtなど) を持たず、変更履歴のみを持つ (ベアリポジトリ) |
| `--shared` | 複数ユーザーからプルするため、グループによるアクセス許可 (パーミッション) を付ける |

### git clone <リモートURL>

リモートリポジトリをクローン (複製) する。

---

## 状態確認 <a id="status" data-name="状態確認"></a>

### git status

ステータス (状態) を確認する。<br>
現在のブランチ、変更されたファイルなどが表示される。

| --- | --- |
| `--ignored` | 無視されている項目を追加表示 |

### git diff <コミットID> <コミットID>

差分を見る。

| --- | --- |
| `--word-diff` | 文字単位での差分。見やすくなる |
| `--cached` | インデックスとの差分 |

#### git diff FETCH_HEAD..HEAD

追跡ブランチとローカルブランチの差分を見る。

### git show <コミットID>

コミットIDを指定して詳細を表示する。<br>
<span class="code-like">git show</span> のみだと現在位置の指定 (git show HEADと同じ) 。

### git log

コミットの履歴を表示する。

| --- | --- |
| `--all` | 現在のブランチだけでなく全てのブランチの履歴を表示 |
| `--oneline` | 各コミットごと 1行で表示 |
| `--graph` | グラフィカルに表示 |
| `--decorate` | 表示されているコミットの参照名を出力 |
| `--decorate=full` | より細かく表示 |
| -n | 過去 n件分まで表示。-5 とすれば 5件分 |
| -p | パッチ (差分) の表示 |

<pre><code class="example">git log --graph --oneline --all --decorate</code></pre>

### git blame

行ごとの変更者確認。

### get reflog

HEAD移動履歴。

---

## ステージング操作 <a id="staging" data-name="ステージング操作"></a>

### git add <ファイル名>

インデックスに追加 (ステージングする)。

commit した時に保存されるのは add した時の状態。add した後に作業して、その状態を commit する場合は再び add する必要がある。

#### git add .

ドット(.) を使うとカレントディレクトリ以下のものを全て一括して追加する。

### add でステージングに含めたくない

#### 既に git で追跡中のファイル

自分のローカル環境だけの設定を Github に上げたくないような場合。

```bash
git update-index --skip-worktree <ファイル名>
```

スキップされているファイルと現在追跡中のファイルの一覧。

```bash
# Ｈが追跡中のファイル、Ｓがスキップ中のファイル
git ls-files -v
```

```bash
# スキップ中のファイルを抽出する
git ls-files -v | grep "^S"
```

スキップを解除して追跡ファイルとする。

```bash
git update-index --no-skip-worktree <ファイル名>
```

#### 追跡ファイルではない場合

未追跡なファイルをステージングせずに無視したい。

```bash
echo "ファイル名" >> .git/info/exclude
```

.gitignore の要領で <code class="code-like">.git/info/exclude</code> に列挙するといい。


---

## コミット <a id="commit" data-name="コミット"></a>

### git commit -m “コメント”

ステージングしたものをコミット (変更履歴をローカルリポジトリに登録) する。

コメントを書かないとエラーになる。

| --- | --- |
| `--amend` | 直前のコミットメッセージとコミット内容を修正 (push する前) |

---

## ブランチ操作 <a id="branch" data-name="ブランチ操作"></a>

### git branch

現在のブランチを確認する。

| --- | --- |
| -a | リモートブランチも全て表示 |
| -r | リモートブランチにあるブランチだけ表示 |
| -m ブランチ名 | ブランチ名を変える |
| -d | ブランチ削除 |

#### git branch <新ブランチ名>

HEAD が指しているコミットからブランチを作成する。

#### git branch <新ブランチ名> <ブランチかID>

現在どこにいるのかに関わらず、後ろの引数で指定したブランチ (または ID) から新ブランチを作る。

```bash
# main が指しているコミットから feature を作る
git branch feature main
```

### git switch <ブランチ名>

ブランチを移動する。 <span class="code-like">checkout</span> の代替として追加されたコマンド。

### git switch -c <新ブランチ名>

ブランチの作成と移動を同時に行う。 <span class="code-like">checkout</span> の代替として追加されたコマンド。

### 親ブランチの変更を取り込む

#### git mergeを使う (安全・初心者向け)

親ブランチの変更を取り込む標準的なやり方で、コンフリクトの解消が1度で済むが、グラフの履歴が少し複雑になる。

```bash
# 取り込みたいブランチにいる状態で release を取り込む場合
git merge origin/release
```

#### git rebase (履歴をきれいに保つ)

親ブランチの最新状態からブランチを切ったかのようになるが、場合によっては複数回コンフリクトの解消が必要になる。

```bash
# 取り込みたいブランチにいる状態で release にブランチを付け替えたい場合
git rebase origin/release
```

### ブランチの削除

```bash
# ローカルのブランチを削除
git branch -d feature-abc
# リモートに削除を反映
git push origin --delete feature-abc
```

---

## マージ <a id="merge" data-name="マージ"></a>

### git merge <ブランチ名>

現在のブランチ (HEAD) に指定ブランチがマージされる。

| --- | --- |
| `--no-edit` | エディタで開かれるのを回避する |

### merge の手順

1. 作業内容をコミット
    ```bash
    git add .
    git commit -m "完成"
    ```
2. 取り込み先に切り替える
    ```bash
    git switch main
    ```
3. 最新の状態を反映させる (重要)
    ```bash
    git pull origin main
    ```
4. 合流
    ```bash
    git merge feature-abc
    ```
5. リモートに反映
    ```bash
    git push origin main
    ```

### git rebase

履歴を付け替える。

---

## リモートリポジトリ <a id="remote" data-name="リモートリポジトリ"></a>

### git remote

リモート名を表示する。

| --- | --- |
| -v | 登録されているリモート名とURLを表示 |

#### `git remote add <リモート名> <リモートURL>`

リモートリポジトリを登録する。

#### `git remote rename <旧リモート名> <新リモート名>`

登録されているリモート名を変更する。

#### `git remote set-url <リモート名> <変更したいURL>`

登録されているリモートのURLを変更する。

#### `git remote rm <リモート名>`

リモートリポジトリを削除する。

### `git fetch <リモート名> <ブランチ名>`

リモートブランチの変更履歴を追跡ブランチに持ってくる。<br>
<span class="code-like">fetch</span> は HEAD に影響されないので安全に実行できる。ただし <span class="code-like">pull</span> は別。

### `git push <リモート名> <ブランチ名>`

ローカルからリモートへプッシュする。

#### `git push -u <リモート名> <ブランチ名>`

追跡を指定して、以降ブランチ名の記述が不要になる。

### `git pull <リモート名> <取り込みたいブランチ名>`

フェッチとマージを同時に行う。<br>
リモートブランチの変更履歴をローカルブランチの HEAD (今いるブランチ) に一気に持ってくる。

<span class="code-like">git push -u origin main</span> が指定されていると、 origin main がマージされる。

<pre><code class="caution">ファイルをコミットしていない状態で  <span class="code-like">pull</span> しようとすると
ファイルが混ざるのを防ぐために <span class="code-like">pull</span> が拒否されることがあるのでその場合は、
<span class="code-like">git stash</span> <span class="code-like">git pull</span> <span class="code-like">git stash pop</span> を行う。</code></pre>

### リモートから特定のディレクトリを取り込む

#### 単一のフィルを取り込む

```bash
git restore --source=origin/<ブランチ名> -- <ファイルパス>
```

#### ディレクトリごと取り込む

```bash
git restore --source=origin/<ブランチ名> -- <ディレクトリパス>/
```

---

## 一時退避 <a id="temp" data-name="一時退避"></a>

### git stash

<span class="code-like">stash</span> は現在の作業内容を一時的に退避して、作業ディレクトとステージング領域を HEAD (現在の最新コミット) の状態に戻す。コミットはしたくない場合に便利。<br>
基本的にはワーキングツリーはクリーンになる。<br>
<span class="code-like">git stash</span> で作成されたデータは .git/refs/stash というファイルに保存される。

| --- | --- |
| -m | commit のようにメッセージを付ける |
| -u | untracked file も含めて退避 |

<pre><code class="tips">Git の管理下にあるファイルしか退避させないので、
<span class="code-like">git stash -u</span> が普段使いでOK。</code></pre>

#### git stash pop

退避していた変更が再び適用されて、 stash は削除される。

#### git apply

退避していた変更を適用して stash を残しておく場合。

#### git stash list

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


## 取り消し・削除 <a id="cancel-delete" data-name="取り消し・削除"></a>

### `git restore <ファイル名>`

ファイルの変更を捨てて最新コミットの状態に戻す。

<pre><code class="tips">誤って <span class="code-like">git rm</span> した場合でもコミット前なら <span class="code-like">git restore &lt;ファイル名&gt;</span> で戻せる</code></pre>

### `git restore --staged <ファイル名>`

誤って余計なファイルをステージングしてしまった時などにステージングを取り消す。

### `git restore --source <コミットID> <ファイル名>`

ファイルの変更を捨てて特定のコミット状態まで戻す (ステージングエリアも含む)。

### `git reset --hard HEAD`

最新のコミット (HEAD) の状態に、手元のファイルごと完全に巻き戻す。<br>
HEAD 以降の作業が無かったことになる。

### `git reset --hard <コミットID>`

現在作業中の状態を全て破棄して、コミットID の状態にする。

### `git reset --soft HEAD~`

直前のコミットだけを取り消して add してステージングした状態に戻す。<br>
HEAD~ は1つ前のコミットという意味。

### `git revert`

打ち消しコミット作成。

### `git rm <ファイル名>`

リポジトリにあるファイル自体を削除する。削除した履歴が残るのが特徴。

| --- | --- |
| --cached | ファイルを残したまま Git の追跡をやめる。その後に .gitignore に追加 |
| -r | 再帰的にディレクトリごと削除 |

---

## タグ <a id="tag" data-name="タグ"></a>

### git tag

### git tag v1.0

### `git push --tags`

---

## git worktree <a id="worktree" data-name="git worktree"></a>

1つの git リポジトリから、複数の作業ディレクトリを作って、別々のブランチを同時に作業できる機能。

あくまで .git/ が複製されるわではなく、1つの .git/ を使うため高速で安全。

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
git worktree remove ../project-hotfix
```

またはディレクトリごと削除して、

```bash
git worktree prune
```

---

## 困った時 <a id="trouble" data-name="困った時"></a>

### 現在の履歴を残しつつ別のブランチに切り替えたい

コミットできる状況ならコミットするのが一番安心。

```bash
git add .
git commit -m "WIP: 作業途中"
git switch other-branch
```

コミットできない状況なら stash がいい。

### 無視したいファイルをコミットしてしまったとき(ignoreしたい)
gitの追跡対象から除外する。
git rm --cached ファイル名
過去のコミット履歴からも削除する。
git filter-branch -f --index-filter ‘git rm --cachd -rf --ignore-unmatch ファイル名’ HEAD

### 直前のコミットを取り消したい
リモートにプッシュしていないなら
HEAD(コミットの先端)だけ元に戻す
git reset --soft HEAD~
HEADとインデックス(ステージング)を元に戻す
git reset HEAD~
HEADとインデックスとワーキングツリー(ローカルのファイル)を元に戻す
git reset --hard HEAD~

プッシュ済みなら
git revert コミット

### 別のブランチにコミットしてしまった
git branch 別のブランチ
別のブランチを切る
git reset --hard HEAD~
今のブランチをリセット
git switch 先ほどのブランチ
先ほどのブランチにスイッチ

### コミットを消してしまった(リセットしてしまった)
git reflog
git reset --hard コミットid
gitリセットする前のHEADのコミットidを入力する

### ブランチを消してしまった
git reflog
git branch ブランチ名 コミット

### コミットメッセージを変えたい
git commit --amend--

### マージしたけどコンフリクトしたので元に戻したい
git reset --hard ORIG_HEAD
マージを取り消す

### 違うユーザー名でコミットしてしまった
.gitconfigか.git/configでユーザー名を変更して
git commit --amend -m “コミットメッセージ” --author=”user.name<user.email>”
でHEADのコミットを変更



### 緊急対応などでブランチを切り替えたい
一つの方法として現在の状態をコミットする
それができない場合は
git stash
で変更内容をスタッシュに保存
ブランチを切り替えて作業後、ブランチを元に戻して
git stash pop
でスタッシュから取り出す

### 誤ったコミットをプッシュしてしまった
git push origin :ブランチ名
でリモートのブランチを削除
git reset --hard コミット
ローカルのコミットを打ち消す
git push origin ブランチ名
で再度プッシュする

### リリース後にバグが出て切り戻したい
git log
でログをみて
git revert -m 1 マージコミット

### 切り戻したあとに再マージできない
git revert 打ち消したコミット
git merge ブランチ

---

## 用語 <a id="term" data-name="用語"></a>

### リポジトリ (repository)

リポジトリとは、ファイルやディレクトリの変更履歴(コミット)を管理する場所。

#### リモートリポジトリ

リモート上のリポジトリ、Git上に作られるリポジトリ(自分のPCなどに作ることもできる)。

#### ローカルリポジトリ

自分のPCに作られるリポジトリ。

### コミット (commit)

変更履歴をローカルリポジトリに登録することをコミットという。

※ ここでいう変更履歴はファイルやディレクトリの 作成/更新/削除 を指す (空のディレクトリはGit管理外となる) 。

### ステージ (stage)

ワークツリー内のファイルをコミットするためには、前準備としてコミット対象となるファイルをステージングエリア (ステージ) に置く必要がある。<br>
インデックスとも呼ばれる。

#### ワークツリー

git で履歴の管理を行うファイルの保存場所。

#### ステージング

ステージングエリアに置くには <span class="code-like">git add</span> でファイルを指定しインデックスに登録する (ステージするとも言う) 。

### ブランチ (branch)

ブランチとは、変更履歴を分岐して進めていく機能のこと。基本となる main ブランチがデフォルト。<br>
ブランチは、コミットを指す名前付きのポインタであり、 HEAD は現在チェックアウトしている位置を表すポインタという二段階構造になっている。<br>
ブランチはあくまでポインタであり、ツリー構造 (親子関係) になっているのはコミット履歴。<br>
main ブランチのみでバージョン管理していくことも可能だが、通常は開発ブランチを作成し、さらに機能追加やバグ修正を並行して進めていく。

#### チェックアウト

ブランチを移動することをチェックアウトという(main ブランチしかない状態は main ブランチにチェックアウトされている状態ともいえる) 。<br>
現在ではブランチの移動は <span class="code-like">git switch</span> が推奨。

#### 追跡ブランチ

追跡ブランチは正確には「リモート追跡ブランチ」という。リモートを追跡するためのブランチ

### フェッチ (fetch)

リモートブランチの変更履歴を追跡ブランチに持ってくることをフェッチという。

また追跡ブランチの現在位置を指すポインタは FETCH_HEAD となる (ローカルブランチはHEAD) 。

### マージ (merge)

変更を取り込んで合流させる。<br>
変更を取り込みたいブランチに立って行う。

### プル (pull)

フェッチとマージを同時に行うことをプルという。リモートブランチの変更履歴をローカルブランチに一気に持ってくる。

### プッシュ (push)

プルをダウンロードに例えると、プッシュはアップロード。<br>
ローカルブランチの変更履歴をリモートブランチに一気にアップする。

### クローン (clone)

リモートリポジトリの内容(コミットされた変更履歴)をローカルリポジトリに複製すること。

### HEAD

現在位置 (チェックアウト中のコミット) を指すポインタ。

#### HEAD指定

HEAD とはブランチにおける現在位置を指すポインタのことで、簡単に言うと現在の コミットID の別名。

#### 現在位置より前

チルダ(~) で現在位置より前の場所を指定できる。<br>
HEAD~1 は1つ前、 HEAD~2 は2つ前。

#### 親の指定

ブランチの親が複数ある時は キャレット(^) で親の指定ができる。<br>
HEAD^1 は親その1、 HEAD^2 は親その2となる。<br>
HEAD^ とだけすると、実質 HEAD~1 と同じく現在より1つ前 (直前) のコミットを指す。

### リセット (reset)

指定したコミットまでリセットすることができる。

デフォルトではコミットとインデックス (ステージングエリア) がリセットされるが、オプションで指定することもできる。

<span class="code-like">--soft</span> はコミットのみリセット、 <span class="code-like">--hard</span> はコミット/インデックス/ワーキングツリー (ワークツリー) の全てがリセットされる。

### log

<span class="code-like">git log</span> はコミットのログを表示する。

### reflog

<span class="code-like">git reflog</span> は参照ログ (HEAD等の移動履歴) を表示する。この参照を指定してリセットを戻すこともできる。

### リバート (revert)

コミットを打ち消すコミットを作成する。

### チェリーピック (cherry-pick)

特定のコミットを取り入れる。

### スタッシュ (stash)

ワークツリーの変更を一時的に退避させる時に使う。

### タグ (tag)

コミットに分かりやすい名前を付けたい場合はタグを使う。

#### 軽量タグ

名前がついているだけのシンプルなタグ。

#### 注釈付きタグ

注釈付きのタグも作成できる。注釈はコミット詳細に表示される。

### Git管理下から外す (.gitignore)
.gitignore という隠しファイルに指定すると、Git管理下から外すことができる。

.gitignore という名前でファイルを作成してエディタでファイル名とディレクトリ名を追加する。ファイルの場合は／ファイル名、ディレクトリの場合は／ディレクトリ名／で追加する。

### プルリクエスト (pull requests)
一通り終えたタスクのブランチのマージをレビュワー (レビュー担当者) に依頼する機能のこと。


---








Gitのブランチ（Branch）は、プロジェクトの歴史を枝分かれさせて、「本番用のコードを汚さずに新しい機能を作る」ための魔法のツールです。並行世界をいくつも作るようなものだと考えると分かりやすいですよ。

基本的な使い方と流れを整理しました。





## 1. 基本のコマンド操作

まずはこれだけ覚えておけば戦えます。

| 操作 | コマンド | 補足 |
| --- | --- | --- |
| **一覧表示** | `git branch` | 今どのブランチにいるか確認 |
| **新規作成** | `git branch <名前>` | 新しい枝を作る |
| **切り替え** | `git checkout <名前>` | `git switch <名前>` でもOK |
| **作成＆切替** | `git checkout -b <名前>` | 一気にやってくれる一番使うやつ |
| **削除** | `git branch -d <名前>` | 用が済んだブランチを消す |

---

## 2. 一般的な作業の流れ（ワークフロー）

開発現場で最も一般的な「トピックブランチ運用」の流れはこんな感じです。

1. **ブランチを作る**
本番用（`main`など）から最新の状態を引き継いで、新しいブランチを作ります。
`git checkout -b feature-login-page`
2. **作業してコミットする**
そのブランチの中で自由にコードを書き、区切りが良いところで保存します。
`git add .` → `git commit -m "ログイン画面の実装"`
3. **元のブランチに戻る**
作業が終わったら、合流地点（`main`など）に戻ります。
`git checkout main`
4. **合流（マージ）させる**
作った機能を本番に取り込みます。
`git merge feature-login-page`

---

## 3. 知っておくと捗るTips

### コンフリクト（衝突）を恐れない

同じファイルの同じ行を別々のブランチで編集してマージすると、「どっちを優先すればいいの？」とGitが困って止まります。これが**コンフリクト**です。

> **対処法:** Gitが「ここがぶつかってるよ」とマークを出してくれるので、手動でコードを整えてから再度コミットすれば解決します。

### ブランチ名は分かりやすく

自分一人のプロジェクトでも、後で見た時に「何をした枝か」が分かる名前にしましょう。

* `feature/xxx`（新機能）
* `bugfix/xxx`（バグ修正）
* `refactor/xxx`（コード整理）

---

安全に、そしてスマートにマージするための標準的な手順をまとめました。

---

## 1. ローカルでのマージ手順（基本の5ステップ）

自分のパソコン（ローカル）で完結させる場合の流れです。

### ① 作業ブランチの内容をすべてコミットする

まずは、作業していたブランチ（例: `feature-abc`）でやり残しがないか確認し、すべて保存します。

```bash
git add .
git commit -m "機能を完成させた"

```

### ② 取り込み先（mainなど）に切り替える

マージ作業は「取り込みたい先のブランチ」に立って行います。

```bash
git checkout main

```

### ③ 最新の状態を反映する（重要！）

自分が作業している間に、他の人が `main` を更新しているかもしれません。最新の状態を引っ張ってきましょう。

```bash
git pull origin main

```

### ④ ブランチをマージする

ここでいよいよ合流です。

```bash
git merge feature-abc

```

### ⑤ リモートリポジトリへ送る

ローカルでマージが成功したら、その結果をGitHubなどのサーバーに反映させます。

```bash
git push origin main

```

---

## 2. 実務でよく使う「Pull Request（PR）」方式

チーム開発では、いきなり `git merge` せず、**GitHub上の「Pull Request」機能**を使ってマージするのが一般的です。

1. **ブランチをそのままPush:** `git push origin feature-abc`
2. **ブラウザで確認:** GitHubを開くと「Compare & pull request」というボタンが出るのでクリック。
3. **レビュー:** チームメンバーにコードを見てもらい、OKをもらったらボタンをポチッと押してマージ完了！

> **なぜPRを使うの？**
> 「誰が、何を、なぜ変更したか」の記録が残り、ミスを事前に防げるからです。

---

## 3. マージ後の後片付け

マージが終わった後のブランチは、もう使いません。散らからないように消しておきましょう。

| 削除対象 | コマンド |
| --- | --- |
| **ローカルブランチ** | `git branch -d feature-abc` |
| **リモートブランチ** | `git push origin --delete feature-abc` |

---

## もし「コンフリクト（衝突）」が起きたら…

マージした瞬間に `CONFLICT` と表示されても、焦らなくて大丈夫です。これはGitが「どっちの修正が正しいか選んで！」と言っている状態です。

1. VS Codeなどのエディタでファイルを開く。
2. `<<<<<<< HEAD` や `>>>>>>>` で囲まれた部分を見て、正しいコードに修正する。
3. 修正したファイルを `git add` して、`git commit` すれば解決です。

---

朝一番に「最新の状態を取り込む（`pull`）」のは、開発現場での**鉄則であり、平和な一日を過ごすための儀式**のようなものです。

一般的な開発現場（特にGitHubやGitLabなどを使うチーム）での1日の流れ（ワークフロー）をまとめました。

---

## ☀️ 朝：最新の状態に同期する

まずは、寝ている間に他のメンバーが進めた作業を自分の環境に取り込みます。

1. **メインブランチ（`main` / `develop`）に移動**
`git switch main`
2. **最新をプルする**
`git pull origin main`
> **なぜこれが必要？**
> 古いコードをベースに作業を始めると、後で合流させる時に**「コンフリクト（衝突）」**が起きる確率が跳ね上がるからです。


---

## 🛠️ 昼：自分のタスクを進める

最新の状態を確保したら、自分の作業領域を作って開発を開始します。

1. **新しいブランチを作る**
`git switch -c feature/my-task`
（必ず最新の`main`から枝分かれさせます）
2. **こまめにコミットする**
「1つの機能ができた」「バグが1つ直った」など、意味のある単位で記録します。
`git add .` → `git commit -m "feat: 〇〇機能の実装"`
3. **たまに本流（main）を混ぜる（任意）**
大きなプロジェクトだと、昼間にも `main` がどんどん更新されます。時々 `main` を自分のブランチにマージ（またはリベース）しておくと、最終的な合流が楽になります。

---

## 📤 夕方〜夜：成果を共有・保存する

作業がキリの良いところまで来たら、サーバーにアップロードします。

1. **リモートにプッシュ**
`git push origin feature/my-task`
（これで自分のPCが壊れても、コードはGitHubに残ります）
2. **プルリクエスト（PR）を作成**
ブラウザでGitHubを開き、「マージしてください！」というリクエストを送ります。
3. **レビューと修正**
他のメンバーから「ここ、もっとこうした方がいいよ」とコメントをもらったら修正し、再度プッシュします。
4. **マージ！**
OK（Approve）が出たら、晴れて `main` に合流。これであなたの仕事が世界（プロジェクト）に反映されます。

---

## 💡 プロが意識している「3つのポイント」

| ポイント | 内容 |
| --- | --- |
| **Commitは小さく** | 巨大なコミットはレビューが大変です。「1つのコミット＝1つの変更」が理想。 |
| **Pullはこまめに** | 朝だけでなく、お昼休み明けなども `pull` しておくとコンフリクトを最小限に抑えられます。 |
| **Stash（スタッシュ）を活用** | 作業途中で急に別のブランチを触る必要が出たら、`git stash` で一時避難させましょう。 |

---

### 次のステップとして

この流れの中で、「作業途中で他のブランチに切り替えなきゃいけなくなった時の避難方法（stash）」について詳しく知りたいですか？

あるいは、「コミットメッセージに何を書けばいいか迷う（命名規則）」といった実践的な悩みがあれば、それについてもアドバイスできますよ！