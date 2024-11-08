---
title: 'Reactのkey'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-11-04
tags: ["astro", "math"]
---

# Keyはなんのためにあるのか
Reactを使用してリストを作成する際, `key`というキーワードがなぜ必須なのか.
無くても動くだろと思っているし, 実際に動くこともあるが, warningが気になることもあるだろう.
この記事では, `key`がなぜ必要なのか, どのような効果があるのかを説明する.
## Contents
## listをHTMLへ
単純なリストをHTMLの`ul`タグで作成する場合,
以下のようになるだろう.

```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```
ここで新たに`kiwi`を追加する状況を考える.
```html
<ul>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
  + <li>kiwi</li>
</ul>
```
これは非常に自然な操作であり, 何も問題は無いように見える.
では, `kiwi`を`apple`の前に追加する場合はどうだろうか.
```html
<ul>
  + <li>kiwi</li>
  <li>apple</li>
  <li>banana</li>
  <li>orange</li>
</ul>
```
`kiwi`が先頭に, `apple`が2番目になる.
その後のアイテムも一つずつずれていくことになる.

このように, リストの表示順が変わる場合, **たった一つのアイテムを追加するだけでDOM構造としては全てのアイテムが変更されてしまい, Reactが再描画すべき対象が格段に増えてしまう**.

これを防ぐために, Reactは`key`を要求している.
`key`を利用することで, Reactは変更すべきアイテムが効率的に見つけられるようになり, DOMの再描画のコストを抑えることができる.

