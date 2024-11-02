---
title: 'Vim Exコマンド'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-10-03
tags: ["vim", "exコマンド"]
---

# Introduction
vim の Ex コマンドについてまとめます。
## Contents
## argdo

- [argdo](https://chatgpt.com/c/66fd7714-1364-8005-b941-7e23cc28717b)

一気に複数のファイルに対してコマンドを実行することができる。

```vim
:argdo %s/検索する文字列/置換する文字列/gc | update
```
- `argdo` : 引数リストに含まれるファイルに対してコマンドを実行する。
- `%s/検索する文字列/置換する文字列/gc` : 検索する文字列を置換する文字列に置換する。
- `update` : 編集した内容を保存する。

前提として全てのファイルをバッファに乗せて置く必要がある.
