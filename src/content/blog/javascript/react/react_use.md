---
title: 'Reactの使い方'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-07-11
tags: ["astro", "math"]
---

# Introduction
使い方、慣習についてまとめる。

## File Structure
[File Structure – React](https://legacy.reactjs.org/docs/faq-structure.html)にあるように、Reactプロジェクトではコンポーネントをどこに配置するかについてのルールは無い。
しかし、よく使用されるパターンが2つあるので、それを紹介する。

### パターン1: 機能・ルーティングによる分類
js, css, testファイルを機能やルーティング毎に分類する。
粒度はプロジェクト次第。
```bash
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

### パターン2: ファイルタイプによる分類
似ている役割を果たすファイル毎に分類する。

```bash
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```
さらに、コンポーネントの種類によってフォルダを分けることもある。(パターン2を適用した後にパターン1を適用する感じ, 多分)
これは[Atomic Design | Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)に発展する。

どちらにも共通する注意点として以下がある。

- ディレクトリ階層は浅く(3~4階層に)保つ。深くなりすぎると、コンポーネントの再利用が難しくなる。
- こだわりすぎない。はじめてから5分も考えるのは無駄。どっちかで初めてみて、必要に応じて変更する。

なお、個人プロジェクトではパターン1から初めてパターン2へ移行することを選択する。

### Atomic Design



