---
title: "github pagesでの投稿"
author: "sakakibara"
description: "GitHub Pagesの使い方とGitHub Actionsを使った自動デプロイについて。"
pubDate: 2024-06-22
heroImage: "/git/github_pages.webp"
tags: ["github", "git"]
---

# GitHub Pagesとは

github pagesとは[GitHub](https://docs.github.com/ja/pages/getting-started-with-github-pages/about-github-pages)が提供する(静的)サイトホスティングサービスである。
リポジトリにhtmlファイルを置くことで、`https://username.github.io/repo-name/file_name.html`のようにそのページへアクセスできるようになる。

最高では？と思うかもしれないが、使用にあたりいくつかの制限がある。

- ECサイトなどのオンラインビジネス、商取引のためのサイトは利用できない
- 既存のWebサイトのコピーを作成することはできない
- リポジトリの上限は1GBまで
- 10分のデプロイでタイムアウト
- サイトのトラフィックは100GB/月 かつ　10回/時ビルドまで
- GitHub側でのレートリミッタがある

どれも"そりゃそうだ"と思う制限ではあるが、正直"既存のWebサイトのコピーを..."の部分はテストサイトをデプロイする際に踏んでしまいがちな地雷かもしれない。

Jekyllを使うことによってmarkdownファイルによるデプロイやカスタムドメインの設定などができる。
また、GitHub Actionsを使って自動デプロイすることも可能であり、かなり多くのニーズを取り込んでいるサービスである。

## 最も簡単な使い方

多くの場面でちょっとした静的サイトデプロイの候補として挙げられるGitHub Pagesだ。
その手軽さが売りであり、最も多くの使用方法はリポジトリのルートに`index.html`をおくことだろう。

左上のsettingsから
右サイドバーのナビゲーションバーから`Pages`を選択し、Build and deploymentの`Deply from a branch`を選択する。ここで好きなブランチを選択し、好きなブランチを選択する。
つぎに、ディレクトリを選択する。
`/`を選択するとリポジトリのルートに`index.html`がある場合、`/docs`を選択すると`/docs/index.html`がある場合にデプロイされる。
custom domainも設定することができる。

これで`https://username.github.io/repo-name`でアクセスできるようになる。

あまりにも簡単すぎて説明することがないが、これがGitHub Pagesの基本的な使い方である。

## GitHub Actionsを使った自動デプロイ

リポジトリのルートや`/docs`に`index.html`を作成しなければならないのだろうか？

それは嫌なのでgithub Actionsを(少々)カスタマイズしてデプロイする手法について説明しよう。

### 静的サイトのデプロイ

ローカルリポジトリで`.github/workflows`ディレクトリを作成しその中に適当な`yaml`ファイルを作成する。

working directoryに`index.html`があるような場合(今までのような場合)では以下のように`yaml`ファイルを記述し、`git push`すれば自動でデプロイされる。

```yaml
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload entire repository
          path: "."
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

ここでつまづきやすいのは`on>push>branches`であり、
`settings>Environments>github-pages>Deployment branches and tags`で`main`を指定していなければdeployされない。
好きなブランチを指定しよう。
また

```yaml
uses: actions/upload-pages-artifact@v3
with:
  # Upload entire repository
  path: "."
```

の`path`を指定することでデプロイするディレクトリを指定できる。
例えば、`dist/index.html`に公開したいファイルが置かれているなら

```yaml
uses: actions/upload-pages-artifact@v3
with:
  # Upload entire repository
  path: "./dist"
```

のようにすれば良い。

### ビルド & デプロイ

`index.html`をpushと同時にbuildして特定のファイルに生成されたファイルをデプロイするにはどうしたらいいだろうか。

先ほどの`yaml`ファイルのように多少の変更を加えるだけでビルド & デプロイが可能になる。

例えば次のようなディレクトリがあるとする。

```bash
❯ ls
dist  LICENSE  node_modules  package.json  package-lock.json  README.md  scripts  src
```

ここで

```bash
npm run build
```

のようなコマンドで`dist`ディレクトリに`index.html`が生成されるとする。

そのような場合、`.github/workflows/deply.yaml`を次のように記述する。

```yaml
name: Deploy Resume with GitHub Pages dependencies preinstalled

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Build with npm
        run: |
          npm install
          npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist"

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

注目すべきはここである。

```yaml
- name: Build with npm
run: |
  npm install
  npm run build
- name: Upload artifact
uses: actions/upload-pages-artifact@v3
with:
  path: "./dist"
```

`run`の中でビルドコマンドを実行し, `path`でビルドされたファイルが置かれているディレクトリを指定する。
これで`git push`するだけでビルド & デプロイが可能になる。

これで`https://username.github.io/repo-name/dist`ではなく
`https://username.github.io/repo-name/`のようにアクセスできるようになる。

最高だね！

### ちょっと詳しく

github pagesをGitHub Actionsでデプロイする際に重要なactionが3つある。

- [actions/configure-pages](https://github.com/actions/configure-pages/blob/main/action.yml)
- [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact/blob/main/action.yml)
- [actions/deploy-pages](https://github.com/actions/deploy-pages/blob/main/action.yml)

それぞれがGitHub Pagesのデプロイに必要な機能を提供している。
それぞれ、

- GitHub Pagesを有効にしてサイトに関する様々なメタデータを抽出する
- GitHub Pagesにデプロイできるartifactsをパッケージ化する(zip化)
- Action artifactsをGitHub Pagesにデプロイする

といった機能を提供している。

だが、ほとんどの場合、どのようなartifactsをデプロイするかが開発者にとって重要である。
そこで`actions/upload-pages-artifact`を使ってデプロイするファイルを指定することができる。その使用方法は各リポジトリの`action.yml`に記載されている。
