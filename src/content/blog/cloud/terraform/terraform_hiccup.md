---
title: 'terraform つまづきどころ'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-12-25
tags: ["astro", "math"]
---

# Introduction
## Contents
## `assign_public_ip=true`で挙動が変わる。
ECSの設定をしている中で、

Fargetで "プライベートサブネット" + "`assign_public_ip=true`"  

という設定をしていると、挙動が特殊になる。

- AWSでプライベートサブネットにパブリックIPを割り当てることはできない。
- すると、裏でVPC内のルーティングやSGの扱いが変わるケースがある。
- もしくはコンソール側で自動的に別の設定に書き換えられる

プライベートサブネットで動かすなら`assign_public_ip=false`にしておくのが無難。


