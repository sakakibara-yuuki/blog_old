---
title: "Vimの基本: ビジュアルモード"
author: "sakakibara"
description: "vimの使い方"
pubDate: 2024-03-04
heroImage: '/vim/vim-basic-visual.webp'
tags: ["vim"]
---

## Contents
## ビジュアルモード
ビジュアルモードはそれ単体では意味をなさない。
ただ範囲を選択するだけだからだ。具体的な操作は選択した範囲に対してノーマルモードのコマンドを組み合わせて実行する。  
ここでもノーマルモードの地力が問われる。

初学者がビジュアルモードでまず、気をつけるべきはコマンドの順番だ。

例えば、`daw`は削除指定してから操作対象のテキストを選択する。
これに対してビジュアルモードは操作対象のテキストを選択してからコマンドを実行する。
(むしろ初学者はビジュアルモードの方が直感的かもしれない)

ビジュアルモードに入るには4つの入口がある。

| command  | description              |
| :---:    | :---:                    |
| `v`      | 文字単位の選択           |
| `V`      | 行単位の選択             |
| `Ctrl+v` | 矩形選択                 |
| `gv`     | 最後に選択した範囲の選択 |


また、ビジュアルモードでは、`o`を押すことで選択範囲の端から端へカーソルを移動することができる。

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/KUhMmDSldGU?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>

### 文字単位の選択の欠点
ただ、ビジュアルモードは選択した範囲に対して操作を行うため、繰り返しの操作をする場合には範囲が足りなくて困ることがある。

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/qS5mTQEsrbM?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>

このようなことが起きるため、なるべくノーマルモードのコマンドを使うべきだ。

### 矩形選択
矩形選択により選択した場合、選択範囲の角行に対してそれぞれの操作を行うことができる。

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/uSjb0WxLAMk?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>
