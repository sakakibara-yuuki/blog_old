---
title: "CSS ボックスモデル 2"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-08-31
tags: ["css", "box model", "grid layout"]
---

# ブロック要素はどうきまるのか

- [CSS ボックスモデル](../css_boxmodel)
- [グリッドレイアウト](../css_grid_layout)

でわかるように, boxモデルの大きさやレイアウトがどのようにきまるのかは一見, 非常に複雑である.

この困難の理由はboxのサイズが
**親の大きさによって決まるか, 子によって決まるか**が一律に決まっているわけではないからである(デフォルト設定においてさえ).

さらに, 親や子も **大きさが決まっているか否か** や **blockかinline** かについても判断しなければならず,  
また, **大きさに関わるプロパティ** の種類も多い.

この組み合わせが複雑であるため, boxの大きさがどのように決まるのかがわかりにくい.

- blockかinlineか
- 大きさに関わるプロパティ
- 親に依存するか子に依存するか
- 親や子の大きさが決まっているか

それぞれについて, どのようにboxの大きさが決まるのかを説明する.

## Contents

## block か inline か

- [公式はここ](https://developer.mozilla.org/ja/docs/Web/CSS/display/multi-keyword_syntax_of_display#display_%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3%E3%81%AE%E5%80%A4%E3%82%92%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B%E3%81%A8%E3%81%A9%E3%81%86%E3%81%AA%E3%82%8B%E3%81%AE%E3%81%8B)

boxモデルにはblockレベルとinlineレベルがある.
まず, boxモデルの大きさを設定できるのはblockレベルの要素である.

`<h1>`, `<p>`, `<div>` などはblock要素である.  
`<span>`, `<a>`, `<img>` などはinline要素である.

`display: grid`や`display: flex`を使うことで子の要素をblock要素にすることができる.

例えば, `<span>`要素に`display: flex`を指定することでblock要素にすることができる.

`display: grid`や`display: flex`の要素もblock要素である.

## 大きさに関わるプロパティ

横幅や高さを設定するプロパティは`width`, `min-width`, `max-width`, `height`, `min-height`, `max-height`である.

| プロパティ | サイズ           | 初期値 | flow                 | grid                             |
| ---------- | ---------------- | ------ | -------------------- | -------------------------------- |
| width      | 横幅             | auto   | 親に合わせたサイズ   | 中身または配置先に合わせたサイズ |
| min-width  | 横幅の最小サイズ | auto   | 0として処理          | 0または`min-content`として処理   |
| max-width  | 横幅の最大サイズ | none   | -                    | -                                |
| height     | 縦幅             | auto   | 中身に合わせたサイズ | 中身または配置先に合わせたサイズ |
| min-height | 高さの最小サイズ | auto   | 0として処理          | 0または`min-content`として処理   |
| max-height | 高さの最大サイズ | none   | -                    | -                                |

## 確定サイズ or 不確定サイズ

ブラウザ画面から見える範囲を **初期包含ブロック(ビューポート)** と呼ぶ.
viewportは`<html>`要素の親要素である.  
`<html>`, `<body>`, `<div>`, `<h1>`は`display: block flow`が適用されている.  
`display: block flow`はその要素自体がblock要素であり, 子要素は`flow`レイアウトが適用される.

#### `display: block flow`の場合

これによって, `width`, `height`の初期値は`auto`である.
大元がビューポートの場合, boxはその大きさに合わせたサイズになる.
つまり, 横幅は親要素に合わせたサイズになる.  
高さは中身に合わせたサイズになる.

ビューポートの横幅自体やpxなどのようにレイアウトの指定がなくても確定するサイズを **確定サイズ(define size)** と呼ぶ.  
対して高さは中身に合わせたサイズになるので **不確定サイズ(undefine size)** と呼ばれる.

### width, heightのauto

例えば, 要素のサイズを"80%"と指定したとき, blockの横幅は確定サイズなので指定前のサイズの"80%"になる.  
高さは不確定サイズである場合"%"は`auto`として扱われる.

ここで注意すべきことは, `<html>`, `<body>`などの高さがデフォルトで`auto`になっているため, 不確定サイズになることである.  
そこでblockの高さにおける"%"を有効にするには親の高さを確定サイズにする必要がある.

具体的にはビューポートの高さが確定サイズであるため, `<html>`, `<body>`の高さを100%にすることでblock要素の高さにおける"%"を有効にすることができる.  
もしくは直接に`height: 80vh`のようにビューポートの高さを基準としてblockの高さを指定することもできる.

### min-width, max-widthのauto

`min-width`と`max-width`の初期値は`auto`であり, 0として処理される.
つまり, 横幅も高さも0まで縮まることができる.  
block要素がビューポートより大きい場合はオーバーフローする.  
そして, **ブラウザ画面自体にスクロールバーが表示される.**

block要素に`overflow: auto`を指定することでblock要素にスクロールバーを表示することができる.

### min-content, max-contentという値

横幅が`auto`の場合, 親要素の幅に合わせることになる.
つまり, 中身の幅に合わせることはできない.  
中身に合わせたサイズを**内在的なサイズ(intrinsic size)** と呼ぶ.

| 値            | 指定されるサイズ       |
| ------------- | ---------------------- |
| `min-content` | 中身の横幅の最小サイズ |
| `max-content` | 中身の横幅の最大サイズ |

`min-content`は改行を入れるだけ入れたサイズになる.
`max-content`は改行を除けるだけ除いた幅のサイズになる.

これらを高さに適用した場合は`auto`と同じ挙動になる.
