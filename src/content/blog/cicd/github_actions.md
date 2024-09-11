---
title: 'Github Actions'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-08-15
tags: ["cicd", "github", "github actions"]
---

# Introduction
CI/CDツールの一つであるGitHub Actionsについての学習記録です。
参考文献:
- [GitHub Actionsのクイックスタート](https://docs.github.com/ja/actions/writing-workflows/quickstart)
- [Git Hub Actions入門](https://zenn.dev/hashito/articles/7c292f966c0b59)
- [継続的デリバリーのソフトウェア工学](https://www.amazon.co.jp/%E7%B6%99%E7%B6%9A%E7%9A%84%E3%83%87%E3%83%AA%E3%83%90%E3%83%AA%E3%83%BC%E3%81%AE%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E5%B7%A5%E5%AD%A6-%E3%82%82%E3%81%A3%E3%81%A8%E6%97%A9%E3%81%8F%E3%80%81%E3%82%82%E3%81%A3%E3%81%A8%E8%89%AF%E3%81%84%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2%E3%82%92%E4%BD%9C%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AE%E7%A7%98%E8%A8%A3-David-Farley-ebook/dp/B0BP9JRZS8/ref=sr_1_2?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=8B7R7QT9PPJ3&dib=eyJ2IjoiMSJ9.ziHexwDR_Y4IZLbq92ttCWmynn7PRXFilj3WRF8RUd8qpSD4m6iUqaJYVA6Hi75A1aSOTMuVAvS_mVWBbgeFIY2g6k84JQiYoFD5QWdVYm9N8Da8N2MuYYWWwjKKsCt3qA4esbNSW4TXneVuLT_HzMFOU52_yB2jyBW0iJldPJ6teHBbA4-LZIxsGsYuqng2Z6Xf6xmP_w5MmlEmS-rJ3FetJ-nRggv4G8zOLiIul9cKAGSVMZNlWIyps6szj8-CBA9uXUGFjoaFabmtW5yY9nAk1suIMSxg258PlYb4CgY.E68lFbs0arI3aFx9sWcBxDTPLPSlp4Wkf2XMepIu90g&dib_tag=se&keywords=%E7%B6%99%E7%B6%9A%E7%9A%84&qid=1723704362&sprefix=%E7%B6%99%E7%B6%9A%E7%9A%84%2Caps%2C155&sr=8-2)
- [継続的デリバリー](https://www.amazon.co.jp/%E7%B6%99%E7%B6%9A%E7%9A%84%E3%83%87%E3%83%AA%E3%83%90%E3%83%AA%E3%83%BC-%E4%BF%A1%E9%A0%BC%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A8%E3%82%A2%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AE%E3%83%93%E3%83%AB%E3%83%89%E3%83%BB%E3%83%86%E3%82%B9%E3%83%88%E3%83%BB%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E8%87%AA%E5%8B%95%E5%8C%96-%E3%82%A2%E3%82%B9%E3%82%AD%E3%83%BC%E3%83%89%E3%83%AF%E3%83%B3%E3%82%B4-%EF%BC%AA%EF%BD%85%EF%BD%9A-%EF%BC%A8%EF%BD%95%EF%BD%8D%EF%BD%82%EF%BD%8C%EF%BD%85-ebook/dp/B074BQQ96X/ref=sr_1_3?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&crid=8B7R7QT9PPJ3&dib=eyJ2IjoiMSJ9.ziHexwDR_Y4IZLbq92ttCWmynn7PRXFilj3WRF8RUd8qpSD4m6iUqaJYVA6Hi75A1aSOTMuVAvS_mVWBbgeFIY2g6k84JQiYoFD5QWdVYm9N8Da8N2MuYYWWwjKKsCt3qA4esbNSW4TXneVuLT_HzMFOU52_yB2jyBW0iJldPJ6teHBbA4-LZIxsGsYuqng2Z6Xf6xmP_w5MmlEmS-rJ3FetJ-nRggv4G8zOLiIul9cKAGSVMZNlWIyps6szj8-CBA9uXUGFjoaFabmtW5yY9nAk1suIMSxg258PlYb4CgY.E68lFbs0arI3aFx9sWcBxDTPLPSlp4Wkf2XMepIu90g&dib_tag=se&keywords=%E7%B6%99%E7%B6%9A%E7%9A%84&qid=1723704362&sprefix=%E7%B6%99%E7%B6%9A%E7%9A%84%2Caps%2C155&sr=8-3)
## Contents
## GitHub Actions
GitHub Actions(GHA)は, GitHub上でCI/CDを行うためのツールである。
githubのレポジトリに`./github/workflows/*.yml`というファイルを配置することで, CI/CDの設定を行うことができる.

基本構文は公式を見てもらえばわかるが, 
簡単には以下のようである.
yamlではインデントにはスペース2つを使うことが推奨されている.

```yaml
name: CI Pipeline

on: [push, pull_request]

name: deploy
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: step_name
        run: echo "Hello, World!"
```

### GitHub MarketPlace
#### checkout
- [checkout](https://github.com/marketplace/actions/checkout)
自身のレポジトリからコードを取得するためのアクション.

#### Build and push Docker images
- [Build and push Docker images](https://github.com/marketplace/actions/build-and-push-docker-images)
Dockerイメージをビルドして, DockerHubなどのレポジトリサービスにプッシュするアクション.

#### ZAP Baseline Scan
- [ZAP Baseline Scan](https://github.com/marketplace/actions/zap-baseline-scan)
ZAP(脆弱性検査ツール)を実行するアクション.

#### CodeFactor
- [CodeFactor](https://github.com/marketplace/codefactor)
すべてのGitHubコミット, PRにたいしてレビューを行うアクション.

#### Codacy
- [Codacy](https://github.com/marketplace/codacy)
自動コード解析/品質管理ツール.
コミットやPR毎に静的解析, 循環複雑度, テストカバレッジの測定を行う.

#### Pull Checklist
- [Pull Checklist](https://github.com/marketplace/pull-checklist)
PRのレビュー時にチェックリストを表示するアクション.

## GitHub Actionsをローカルで動かす
github actionsをローカルで動かすためには, [`act`](https://nektosact.com/)というツールを使う.
`act`は, github actionsのランナーをローカルで動かすためのツールである.

例えば, pushのイベントをトリガーにしたgithub actionsをローカルで動かす場合は以下のようにする.

```bash
act push
```
しばらくすると, github actionsの結果が表示される.

actが読み込むworkflowsはデフォルトでは`.github/workflows`直下のyamlファイルであるが, これを指定することもできる.

```bash
act -W '.github/workflows/checks.yml'
```

runnerもいろいろ指定することができるらしい.


