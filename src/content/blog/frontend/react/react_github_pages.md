---
title: 'React アプリをGitHub Pagesにデプロイする方法'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-08-15
tags: ["react", "github", "deploy"]
---

# Introduction
React アプリをGitHub Pagesにでデプロイする方法を紹介する.
ここでは２つの方法を紹介する.

1. gh-pages
1. GitHub Actions

なお, 今回はGitHub Actionsを使ってデプロイした.

## Contents
## gh-pages
[gh-pages](https://github.com/tschaub/gh-pages)は`gh-pages`ブランチへファイルをデプロイするためのツールである.
今回はとくに[gh-pagesのcli](https://github.com/tschaub/gh-pages?tab=readme-ov-file#command-line-utility)を使う.

```bash
npm install gh-pages --save-dev
```

package.jsonに以下のスクリプトを追加する.

```json
"scripts": {
    "deploy": "gh-pages -d build"
}
```
ここでは`dist`にビルドされたファイルをデプロイする.
```bash
npm run deploy
```

なお, github pagesはおそらくデフォルトでは`main`ブランチを参照するため,  
`settings` > `pages`から`gh-pages`ブランチを選択する.

---
[Build for Relative Paths](https://create-react-app.dev/docs/deployment/#building-for-relative-paths)ではserver のrootがhostされていることを前提としているが, これをオーバーライドするには`package.json`に`homepage`フィールドを追加する.
---

## GitHub Actions
GitHub Actionsを使って自動デプロイする方法もある.
以下のような`.github/workflows/main.yml`を作成する.

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: set up nodejs
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: install dependencies
        run: npm install

      - name: build
        run: npm run build

      - name: deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```


まず, 
`settings` > `Actions` > `General` > `Read and write permissions `を選択する.

また, その下の
`Allow GitHub Actions to create and approve pull requests`にもチェックを入れる.

今回は`gh-pages`というリポジトリに公開用のファイルをデプロイするため, `gh-pages`ブランチを選択する.
特に, 上のgithub actionに`permission`の設定があるが, これが無いとエラーが出る.

そして, 最後に 
`package.json`に以下のフィールドを追加する.

```json
"homepage": "./"
```

[このサイト](https://ufirst.jp/memo/2019/11/post-2331/)を参考にした.

これで, `main`ブランチにpushすると自動でデプロイされる.

[やったね！](https://sakakibara-yuuki.github.io/react_todo_list/)

## 参考
- [actions-gh-pages](https://github.com/peaceiris/actions-gh-pages?tab=readme-ov-file#%EF%B8%8F-first-deployment-with-github_token)

