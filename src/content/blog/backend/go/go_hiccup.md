---
title: 'Go言語つまづきどころ'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-10-07
tags: ["astro", "math"]
---

# Introduction
## Contents
## `fmt.Println`と`println`の違い
`println`はruntime時に使用される組み込み関数であり,  `fmt`パッケージが標準ライブラリにあるし,いずれ削除される可能性がある.

言語開発者にとっては依存関係の無い標準出力は便利であるが, `fmt`をつかえばいいだろう. もしくは`log`

`println`はデバッグ用途でのみ使用するべきである.[^goboot]

[^goboot]: https://go.dev/ref/spec#Bootstrapping
