---
title: "gitのいろは"
author: "sakakibara"
description: "gitのいろは"
pubDate: 2024-03-04
tags: ["git", "初心者"]
heroImage: '/git/git-basic.webp'
---

<!-- ## gitのいろは -->
<!-- ### スナップショット系操作 -->
<!-- #### git status -->
<!-- #### git add  -->
<!-- #### git commit -->
<!-- コミットメッセージをどうするか -->
<!-- #### git diff -->
<!-- #### git log -->
<!-- #### git show -->
<!-- #### git restore -->
<!-- #### git reset -->
<!---->
<!-- ### ブランチ操作 -->
<!-- #### git branch -->
<!-- #### git switch -->
<!-- #### git stash -->
<!-- git statsh apply -->
<!-- git stash drop -->
<!---->
<!-- #### git merge -->
<!-- fast forward こっちが基本 -->
<!-- 3way merge -->
<!-- git commit --amend -->
<!-- #### git rebase -->
<!-- #### git remote -->

## おすすめエイリアス
gitを使用する際にエイリアスを使うとgit commitの粒度が細かくなる。
これはコマンド長が短くなると心理的ハードルが下がるためであると思われる。そこで、いくつか自分が設定しているエイリアスを紹介する。
```zsh
[alias]
   st = status
   sw = switch
   lo = log --graph --pretty=format:'[%ad %Cgreen%ar%Creset] %C(yellow)%h%Creset %s %Cblue%d' --date=format:'%Y-%m-%d %H:%M'
   br = branch
   ci = commit
```
基本2文字で統一している。
`log`が少々長いが、このようにするとキラキラlogが表示される。

## 差分はhistogramを使おう
gitではconflictなどが生じた際に差分を表示することができる。
`git mergetool`などを使うと差分をきれいに表示してくれるが、
この差分アルゴリズムはいくつか指定することができる。

いろいろ紹介するのもいいが、[git-diff](https://ishiotks.hatenablog.com/entry/2019/11/07/125615)にある通り`--histogram`を使うといいらしい。
とりあえず設定しておくといいかもしれない。
```zsh
git config --global diff.algorithm histogram
```

## 機密情報をどうするか
`.env`に環境変数としてアクセストークンなどを保存することが多い。
これをリポジトリで管理しないように`.gitignore`で無視することが通常の運用である。
しかし、`.env`ファイルのアクセス権限を変更しなかったり、そもそも平文でアクセストークンを保存するのはセキュリティ上問題がある。
また、ELFバイナリなんかはリバースエンジニアリングされるとアクセストークンが漏洩する可能性がある。

[aws](https://github.com/awslabs/git-secrets)や[hasicorp](https://www.hashicorp.com/products/vault)はアクセストークンを保存するためのツールを提供している。
これで全てが防げるかどうかはわからないが、無いよりマシだろう。

## .gitディレクトリ
.gitディレクトリには何がはいっているのか。
適当に`git init`して中身を確認してみる。
```zsh
.
├── config
├── description
├── HEAD
├── branches  *
├── hooks     *
│   ├── pre-commit.sample
│   ├── ...
│   └── update.sample
├── info      *
│   └── exclude
├── objects   *
│   ├── info  *
│   └── pack  *
└── refs      *
    ├── heads *
    └── tags  *
```
このようになっている。
なお、`*`がついているものはディレクトリであることを示す。
hookはgitの操作の前後に実行されるshellスクリプトであるが、ここでは省略する。

`exclude`を見てみる。
```zsh
# git ls-files --others --exclude-from=.git/info/exclude
# Lines that start with '#' are comments.
# For a project mostly in C, the following would be a good set of
# exclude patterns (uncomment them if you want to use them):
# *.[oa]
# *~
```
これはgitで管理されていないファイルを指定するためのファイルであることがわかる。
ここには他のリポジトリにとっては不要だが、自分にとっては必要な設定を記述する。
こうすることによって自分の環境のみ必要なファイルを他人に迷惑を書けることなく管理することができる。
.gitignoreのような形で書くことができる。

`config`を見てみる
```zsh
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
```
ここには`git config`のこのリポジトリ限定の設定が書かれている。
例えば、適当に
```zsh
git config --local alias.stts status
```
のような設定をしてみると、`config`に以下のような設定が追加される。
```
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[alias]
	stts = status
```

`description`はどうやらリポジトリの説明文を書くファイルのようだ。
どうやらここはgithubのリポジトリの説明文(description)に相当する部分のようだ。
```
Unnamed repository; edit this file 'description' to name the repository.
```
そして`HEAD`を見てみる。
```zsh
ref: refs/heads/main
```

`HEAD`は現在のブランチを指している。これがどのように変化するかに着目する。

`config`や`description`はリポジトリの設定や説明文を書くファイルであることがわかった。

gitがどのようにファイルを管理しているかについて知るためには残りの

- `HEAD`ファイルと
- `objects`ディレクトリ
- `refs`ディレクトリ
- `branch`ディレクトリ

の4つのディレクトリに注目する。

#### git add してみる
さて、適当なファイルを作成し、`git add`してみよう。
```zsh
$ cat A
> 0123
$ git add A
```
すると以下のように`index`ファイルと`objects/40/38...4f`というファイルが作成される。

`objects/40`以下のファイルを見てみよう。
まず、
```zsh
$ file objects/40/38*
> objects/40/381e26feb9944a22c5c11b6f5516f2abc77f4f: zlib compressed data
```

どうもzlibで圧縮されているようだ。
これを適当に解凍してみる。
なお、`hoge=objects/40/381e26feb9944a22c5c11b6f5516f2abc77f4f`とすること。(醜いので)
```zsh
$ python -c "import zlib; print(zlib.decompress(open('hoge', 'rb').read()).decode())"
> blob 50123
```
おぉ、どうやら`blob 5`という文字列にファイルAの内容が格納されているようだ。

`index`ファイルを見てみる。
```zsh
DIRCfiW`
ir�iW`
6bt]��@8&J"�U�OA
                C
```
読めるような、、読めないような
[git-index](https://git-scm.com/docs/index-format)に詳しく書いてある。
また、`git ls-files --stage`で`index`ファイルの内容を見ることができる。
```zsh
$ git ls-files --stage
> 100644 40381e26feb9944a22c5c11b6f5516f2abc77f4f 0	A
```
1列名はファイルのモードを示している。ファイルのモードには以下のようなものがある。

- 100644 - 通常のファイル（非実行可能ファイル）
- 100755 - 実行可能ファイル
- 120000 - シンボリックリンク
- 160000 - サブモジュール
2列名はファイルのハッシュ値(SHA-1)を示している。

次に、ファイルを編集してみる。3を消して456を追加してみる。
```zsh
$ cat A
>012456
```
すると`.git`ファイルは以下のように新たなファイルが`objects`に作成される。
```
.
├── config
├── description
├── HEAD
├── index
├── branches
├── hooks
│   ├── pre-commit.sample
│   ├── ...
│   └── update.sample
├── info
│   └── exclude
├── objects
│   ├── 36
│   │   └── ed83ab6ec0e255078f7b0eede5ad9bfbee0071
│   ├── 40
│   │   └── 381e26feb9944a22c5c11b6f5516f2abc77f4f
│   ├── info
│   └── pack
└── refs
    ├── heads
    └── tags
```
`index`ファイルの中身が変更されており、
```zsh
DIRC^@^@^@^B^@^@^@^Afil±7^]^K<99>fil±6ê.Ä^@^@þ^A^@bt.
^@^@<81>¤^@^@^Cè^@^@^Cè^@^@^@^G6í<83>«nÀâU^G<8f>{^Níå­<9b>ûî^@q^@^AA^@ ùt<8e>ÐpÝá5Ïþë~sg|<82>Coð
```
それを`git ls-files --stage`で確認すると以下のようになる。
```zsh
100644 36ed83ab6ec0e255078f7b0eede5ad9bfbee0071 0	A
```
先程と変わっていることがわかる(ファイルのハッシュを再計算したので当たり前だが)。
また、`objects`の新しいファイルを見てみると
```zsh
python -c "import zlib; print(zlib.decompress(open('ed83ab6ec0e255078f7b0eede5ad9bfbee0071', 'rb').read()).decode())"
blob 7012456
```
のようになっていることがわかる。

以上をひとまずまとめると、
1. `git add`するとファイルを圧縮したファイル`objects/num/compress...1`が作成される。また、indexファイルが作成される。
1. さらに変更して`git add`すると`objects/num/compress...2`ファイルが新たに作成される。また、indexファイルが変更される。

#### git rm --cached してみる
`git rm --cached`しても`objects`には圧縮したものが残っている。ただ、indexファイルの中身が変わるだけである。
```zsh
DIRC^@^@^@^B^@^@^@^@9Ø<90>^S<9e>å5l~õr!lëÍ'ªAùß
```
`git ls-files --stage`で確認すると何も表示されない。
```zsh
$ git ls-files -s
>
```
そこで、`git add`をしてみる。
```zsh
├── objects
│   ├── 36
│   │   └── ed83ab6ec0e255078f7b0eede5ad9bfbee0071
│   ├── 40
│   │   └── 381e26feb9944a22c5c11b6f5516f2abc77f4f
│   ├── info
│   └── pack
```
ここで、`objects`ファイルは変わらない。
どうもファイルのハッシュ値を計算して、新たにファイルを作成しているが、ファイル名も内容も被っているので更新されていないようにみえるのである。
これは`ls -lt -c objects/36/..`で確認すると作成した時間が更新されているので新たに`36`ディレクトリが作られたことがわかる。

#### git commit してみる
`git commit`すると`objects`, `COMMIT_EDITMSG`, `refs` `logs`にファイルが作成される。

`COMMIT_EDITMSG`はコミットメッセージが格納されているファイルである。
```zsh
$ cat COMMIT_EDITMSG
> Initial commit
```
`logs`は後回しにする。
注目したいのは`objects`と`index`と`refs`である。

`index`ファイルから見ていく。
相変わらず読めないが、
```zsh
$ git ls-files -s
> 100644 36ed83ab6ec0e255078f7b0eede5ad9bfbee0071 0	A
```
とあり、先程と変わらないことがわかる。

`objects`ファイルを見てみる。
`objects/32`というファイルが新しく作成されている。
これを解凍して見てみると
```zsh
commit 201tree df14f7c51d079648cb4db3941b7872ec20776d3c
author sakakibara yuuki <sakakilabo0000@gmail.com> 1718186488 +0900
committer sakakibara yuuki <sakakilabo0000@gmail.com> 1718186488 +0900

initial commit
```
最初の行に`commit 201tree df14..`とあり、
`objects`ディレクトリにも`df`というディレクトリがあり、`14f7...`と続くファイルがある。
おそらくこれがcommitを表したファイルなのだろう。
そこで`objects/df/14f..`を解凍してみると
``` zsh
$ python -c "import zlib; print(zlib.decompress(open('14f7c51d079648cb4db3941b7872ec20776d3c', 'rb').read()).decode(errors='replace'))"
> tree 29100644 A6탫n��U�{�孛��q
```
もうちょっといい感じに解凍できるのかもしれないけどここで力尽きた。
とりあえず、`tree`, `100644`, `A6..`という文字列が格納されていることがわかる。
おそらく`tree`とはディレクトリ構造(木構造)を表すもので、`100644`はファイルのモードを示している。  
ここからcommitの情報はtree(ディレクトリ)への参照であることがわかる。  
自力で解凍するのは諦めて`git cat-file -p df14...`で中身を見てみる。
```zsh
$ git cat-file -p df14...
> 100644 blob 36ed83ab6ec0e255078f7b0eede5ad9bfbee0071	A
```
ファイルAの場所を指すハッシュ値が記述されていることがわかる。

以上でだいたいgitがどのようにファイルを管理しているかがわかったかもしれない。
1. `git add`するとファイルが圧縮されて`objects`に保存される。
1. indexファイルは`git add`するたびに変更される。
1. ファイルのハッシュ値の前2文字をディレクトリ名とし、後ろの文字列をファイル名として保存される。
1. `git commit`すると`objects`にtreeを記述するファイルとcommitに関するファイルが作成される。
1. `refs/heads`にはブランチ名のファイルが作成され、
中にはcommitのハッシュ値が記述されている。

staging areaというのは`index`ファイルのことで,
`git add`することでファイルが圧縮されて`objects`にその時のワーキングディレクトリの状態が保存される。

git commit すると、indexファイルに記述されたファイルの名前を元に、`objects`にcommitを記述するファイルが作成され、その中でtreeファイルを指定する。
treeには`objects`に保存されたファイルの名前が記述されている。

おそらく、バージョン管理システムで最も重い処理というのはファイルの圧縮と解凍であろう。
`git add`と`git commit`をするたびに圧縮されたファイルを作成するのは処理に時間がかかる。
そこで、`git add`をするたびに、`objects`ファイルを作成して(`git add`で登録したものしか`git commit`しないので、どうせそのうち`git commit`はするだろうから)先に圧縮する処理を細かく入れておく。  

そして、`git commit`すると、`objects`にその時のワーキングディレクトリの状態と`objects`に保存されたファイルの対応づけを行うような処理を行うことで(これも`objects`に保存しておく)効率よくファイルを管理することができる。
`git add`すると、

```d2
vars: {
  d2-config: {
    layout-engine: tala
  }
}
direction: up
\.git: {
    objects {
        file1\.zip: {shape: page}
        file2\.zip: {shape: page}
    }
    index: {shape: page}
    index -> objects.file1\.zip: {style.stroke-dash: 3}
}
working tree {
    file1: {shape: page}
    file2: {shape: page}
}
working tree -> \.git.objects: zip
```

`git commit`すると、
```d2
vars: {
  d2-config: {
    layout-engine: tala
  }
}
direction: up
\.git: {
    objects {
        file1\.zip: {shape: page}
        file2\.zip: {shape: page}
        commit\.zip: {shape: page}
        tree\.zip: {shape: page}
        commit\.zip -> tree\.zip: {style.stroke-dash: 3}
        tree\.zip -> file1\.zip: {style.stroke-dash: 3}
    }
    index: {shape: page}
    index -> objects.file1\.zip: {style.stroke-dash: 3}
}
working tree {
    file1: {shape: page}
    file2: {shape: page}
}
working tree -> \.git.objects: zip
```

## gitオブジェクト
長々と.gitの中身を見てきたが、ここでgitオブジェクトについて説明しよう。
とは言え、[Gitの内部](https://git-scm.com/book/ja/v2/Git%E3%81%AE%E5%86%85%E5%81%B4-Git%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88)に詳しくかいてあるので、正直これを見てもらえれば理解できると思う。

ファイルをzipで圧縮したものをblobオブジェクトと呼ぶ。
これはそのファイルのSHA-1の前2文字がディレクトリ名、残りをファイル名として保存される。
blogオブジェクトをディレクトリ構造として保存するためのオブジェクトをtreeオブジェクトと呼ぶ。
treeオブジェクトも名前にハッシュ値がつけられる。
treeオブジェクトはblobオブジェクトとtreeオブジェクトの名前が保存される。

これにより、履歴をとるためにはtreeオブジェクト指定すれば良いことになる。
履歴とtreeオブジェクトを対応付けるオブジェクトをcommitオブジェクトと呼ぶ。
commitオブジェクトはtreeオブジェクトのハッシュ値、著者やcommitが実行された時間を保存している。

`HEAD`には`ref: refs/heads/main`とあり、
`refs/heads/main`には直前に行ったcommitのcommitオブジェクトのハッシュ値が保存されている。

`git sw -c dev`のようにブランチを切り、
```zsh
mkdir B && echo 987 > B/C
```
のようにファイルを作成する。
`HEAD`には`ref: refs/heads/dev`となり、
`refs/heads/dev`が新たに作成されている。
`refs/heads/dev`には直前に行ったcommitのcommitオブジェクトのハッシュ値が保存されている。

`git sw -d HEAD^`のようにHEADを1つ前に戻すと、
`HEAD`には`32d38...`となり、直前に行ったcommitのcommitオブジェクトのハッシュ値が保存されている。 
`refs/heads/{dev, main}`はそのままである。
このようにするとHEADが指しているcommitオブジェクトの中身を見ることができる。(ワーキングディレクトリに展開される。)

## gitのブランチ戦略
gitではどのようなブランチを切って開発していくべきだろうか。
gitのブランチの切り方、運用の仕方をまとめたものを**ブランチ戦略**と呼ぶ。
ブランチ戦略にはいくつかの種類がある。
[この記事](https://qiita.com/trsn_si/items/cfecbf7dff20c64628ea)がよくまとまっているので主に参考にするが、
- [git-flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [github-flow](https://docs.github.com/ja/get-started/using-github/github-flow)
- [gitlab-flow](https://about.gitlab.com/blog/2023/07/27/gitlab-flow-duo/)

の主に3つを使うことがおおいだろう。
git-flowは大規模開発用、github-flowはシンプルだがgithubの使用を前提としたもの、gitlab
-flowはgithub-flowに改良を加えたものである。
個人開発ではgithub-flowをよく使うことが多いだろう。

### git-flow
git-flowは大規模開発用のブランチ戦略であり、5つのブランチを使う。
- main
- develop
- feature
- release-branch
- hotfix

開発の軸足となるdevelopブランチから個別の機能を開発するfeatureブランチを切り、
featureブランチからdevelopブランチへマージする。
release-branchではbugの修正のみを行い、適当なタイミングでmainブランチにマージする。
mainブランチでリリースされたものに対してbugが発生した場合はhotfixブランチを切り、mainブランチにマージする。

言葉にすれば簡単だが、ブランチの数が大きく運用が複雑になる。
少なくとも個人開発では使わない。

### github-flow
github-flowは3つのブランチを使う。
- main
- develop(es)
- integration

git-flowと比較してみるとだいぶシンプルになった。develop(es)ブランチはfeatureブランチに該当し、integrationブランチはdevelopブランチに該当する。
integrationブランチからmainブランチにマージする前にpull requestを作成し、レビューを受ける。また、mainへマージした直後にデプロイを継続的に行う。
CI/CDの整備が必要となる。

### gitlab-flow
gitlab-flowは4つのブランチを使う。
- main
- feature/hotfix
- pre-production
- production

gitlab-flowはmainがリリースするためのブランチではない。
mainからfeatureブランチを切り、featureからmainへマージする。
mainからpre-productionブランチを切り、pre-productionからproductionブランチへマージする。

pre-production以降の流れというのは複数環境でデプロイが行われたかを確認するためのものである。これはgithub-flowの欠点であった複数環境でのデプロイにおいてデプロイのタイミングとブランチの結びつきが不明瞭という欠点を補うものである。
これもまた、CI/CDの整備が必要となる。

## gitのコミットメッセージ
gitをを使う際にコミットメッセージをどうするかは悩ましい問題である。
その際に参考になりそうなのが[どのようにGit commit messageを書くか](https://cbea.ms/git-commit/)である。
重要なことは振り返って見やすいコミットメッセージを書くことである。
そのため、コミットメッセージにいくつか規格や制約を設けることが重要である。
コミットメッセージの長さや、コミットメッセージの形式を統一することで、コミットメッセージを見返す際に見やすくなる。

実際、LinuxカーネルやGitの開発でも規格的なコミットメッセージが使われている。
- [torvalds/linux](https://github.com/torvalds/linux)
- [git/git](https://github.com/git/git)

逆にこのように規格を設けないと、blame, revert, rebase, log, shortlogなどが効果を発揮しづらくなる。
参考記事では**いいコミットメッセージ**の要件を3つ挙げている。

1. Style: マークアップ構文、マージン、文法、大文字小文字の統一、句読点の規格化
1. Content: コミットメッセージに含めるもの、含めないものは何かの規格化
1. Metadata: issue tracking ID, pull request IDの規格化

また、たった7つのルールを守るだけで、コミットメッセージが見やすくなるという。

1. 件名と本文を空行で分ける
1. 件名は50文字以内にする
1. 件名の頭文字を大文字にする
1. 件名の最後にピリオドをつけない
1. 件名は命令形にする
1. 本文は72文字以内程度にまとめる
1. 本文は何を変えたかではなく、なぜ変えたかを書く

例1
```text
Summarize changes in around 50 characters or less

More detailed explanatory text, if necessary. Wrap it to about 72
characters or so. In some contexts, the first line is treated as the
subject of the commit and the rest of the text as the body. The
blank line separating the summary from the body is critical (unless
you omit the body entirely); various tools like `log`, `shortlog`
and `rebase` can get confused if you run the two together.

Explain the problem that this commit is solving. Focus on why you
are making this change as opposed to how (the code explains that).
Are there side effects or other unintuitive consequences of this
change? Here's the place to explain them.

Further paragraphs come after blank lines.

 - Bullet points are okay, too

 - Typically a hyphen or asterisk is used for the bullet, preceded
   by a single space, with blank lines in between, but conventions
   vary here

If you use an issue tracker, put references to them at the bottom,
like this:

Resolves: #123
See also: #456, #789
```

ただ1行で書くこともできる。
```text
Fix typo in introduction to user guide
```

自分が現時点で守れていないと思うルールは以下の2つである。

5. 件名は命令形にする
7. 本文は何を変えたかではなく、なぜ変えたかを書く

### 5. 件名は命令形にする
なぜGitは命令形で書くべきなのかというと、Git自身がデフォルトで命令形を使っているからである。
```zsh
Merge branch `dev`
```
このようなメッセージがデフォルトで表示される。  
Gitはデフォルトで命令形を使っているので、それに合わせるべきである。  
だからといって、そもそも命令形で書くことは難しい。  
通常、我々は報告をする際に命令形を使うことは無い。  
注意すべき点として、まず、
関係代名詞は命令形ではない。
- Fixed bug with Y
- Changing behavior of X

また、説明文は命令形ではない。
- More fixes for broken stuff
- Sweet new API methods

ではどうすればいいだろうか。
簡単な対処だが、以下の**太字**の部分を抜き出せば良い。

- If applied, this commit will **your subject line here**
- If applied, this commit will **refactor subsystem X for readability**
- If applied, this commit will **update getting started documentation**
- If applied, this commit will **remove deprecated methods**
- If applied, this commit will **release version 1.0.0**
- If applied, this commit will **merge pull request #123 from user/branch**

なぜこれがいいかというと、`Fixed bug with Y`のようなコミットメッセージを防げるからだ。

- If applied, this commit will ~~**fixed bug with Y**~~
- If applied, this commit will ~~**changing behavior of X**~~
- If applied, this commit will ~~**more fixes for broken stuff**~~
- If applied, this commit will ~~**sweet new API methods**~~

また、[commit message](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)を参考にしてコミットメッセージの先頭にprefixをつけることもできる。
```text
feat: remove deprecated methods
```
のようにすることで、全体の統一が取れる。

### 7. 本文は何を変えたかではなく、なぜ変えたかを書く
なぜ変えたかの良い例としては
```text
commit eb0b56b19017ab5c16c745e6da39c53126924ed6
Author: Pieter Wuille <pieter.wuille@gmail.com>
Date:   Fri Aug 1 22:57:55 2014 +0200

   Simplify serialize.h's exception handling

   Remove the 'state' and 'exceptmask' from serialize.h's stream
   implementations, as well as related methods.

   As exceptmask always included 'failbit', and setstate was always
   called with bits = failbit, all it did was immediately raise an
   exception. Get rid of those variables, and replace the setstate
   with direct exception throwing (which also removes some dead
   code).

   As a result, good() is never reached after a failure (there are
   only 2 calls, one of which is in tests), and can just be replaced
   by !eof().

   fail(), clear(n) and exceptions() are just never called. Delete
   them.
```

基本的には変更がどのように行われたかについては除くことができる。
- 変更前の動作
- なぜその方法で解決したのか
- 現在の動作

この3つについて書くことができればいいコミットメッセージになる。

