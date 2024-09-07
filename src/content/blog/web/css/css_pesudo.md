---
title: "CSS 疑似要素 疑似クラス"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/web/css/css_pesudo.png"
pubDate: 2024-07-14
tags: ["css", "疑似要素", "疑似クラス"]
---

# Introduction

## 擬似クラス

`:hover`以外にもかなり多くの疑似クラスがある。
それらはいくつのグループに分けられる。

- 表示状態疑似クラス : `:fullscreen`, `:picture-in-picture`など
- 入力疑似クラス : `:checked`(チェックボックスがonなら..)など
- 言語擬似クラス : `:dir()`(書字方向が縦なら..), `:lang()`(言語がENなら..)など
- 位置擬似クラス : `:visited`(訪れたことがあるなら...), `:link`(まだ訪れてないなら...)
- リソース状態疑似クラス : `:play`(メディアが再生可能なら...) `:paused`(メディアが一時停止しているなら..)
- 時間軸擬似クラス : `:current`(今表示されている要素の祖先なら...)videoの字幕用
- ツリー構造擬似クラス : `:root`(root要素なら...), `:nth-child()`(n番目の子要素なら...)
- ユーザー操作擬似クラス : `:active`(クリックされたなら...), `:hover`(マウスが上にあるなら...)
- 関数擬似クラス : `:is()`(セレクタが指定したものなら...), `:not`(セレクタが指定したものでないなら...)

## 疑似要素

[疑似要素](https://developer.mozilla.org/ja/docs/Web/CSS/Pseudo-elements)
