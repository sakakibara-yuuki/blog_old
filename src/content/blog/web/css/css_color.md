---
title: "CSS 色の指定"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-09-06
updatedDate: 2024-09-06
tags: ["css", "rgb", "design", "color"]
---

# Introduction

- [公式はここ](https://developer.mozilla.org/ja/docs/Web/CSS/color_value/rgb)

cssには色を指定するための方法がいくつかある.
おそらく? 最も多く使われているのは16進数表記だろう.
`#`で始まる6桁の16進数で色を指定する.
2桁ずつR, G, Bの値を表している.
透明度を表す際にはこのあとに2桁の16進数を追加する.

しかし, 再利用性の観点かれcssでは`rbg()`関数を使用することが望ましい.
この記事では`rgb()`関数を使った色の指定方法について解説する.

## Contents

## rgb()

### 十六進数の問題点

`rbg()`の説明に入る前に, なぜ`rgb()`を使うべきなのか, なぜ16進数表記が問題なのかについて説明する.

まず, 前提としてwebサイトを含む多くのデザインでは決まった数の色のセットを使う.
特定の色はsky-blue, tomateなどと名付けられ, さらに
それらの色はprimary-color, secondary-color, ...., background-colorなど名付けられる.

実際のテキストやborderの色の設定にはprimary-color, secondary-colorなどの色を使う.
このように色を名前で管理することで, デザインとしての一貫性を保つことができる.
また, 色のデザインを変更する際に, 一箇所で変更するだけで全体のデザインが変わるため, 保守性が高まる.

この管理はcssでは変数を使うことで実現できる.

```css
:root {
  --tomato: #ff6347;
  --sky-blue: #87ceeb;
  --dark: #333;
  --primary-color: var(--tomato);
  --secondary-color: var(--sky-blue);
  --background-color: var(--dark);
}
div {
  color: var(--primary-color);
  background-color: var(--background-color);
}
```

この例では16進数表記を使って, 色を指定しているが, この方法にはある問題がある.
それは**透明度の指定ができない**ということだ.

十六進数表記では`#ff6347`+`aa`のように透明度にかんする情報は6桁のあとに2桁追加する必要がある.
しかし, この方法では透明度を変更した別の変数を定義する必要がある.
変数の増加は保守性を下げる.

そこで, `rgb()`を利用することを推奨する.

### rgb()の利用

`rgb()`は`rgb(255 99 71)`のようにR, G, Bの値を直接指定することができる.
また, 透明度を指定する際には`rgb(255 99 71 / 0.5)`のように透明度を指定することができる.

ここで注意するべきなことは`rgb()`はカンマ`,`で区切るのではなく, 空白で区切ることである.

```css
rgb(255 99 71)         /* good */
rgb(255 99 71 / 0.5)   /* good */
rgb(255 99 71 / 50%)   /* good */
rgb(255, 99, 71, 0.5)  /* good */
rgb(255, 99, 71 / 0.5) /* bad */
```

一応`rgb()`の引数全てがカンマ区切りである場合は`rgba()`との互換性のため, 実装されてあるが, この方法は推奨されない.
また, カンマ区切りと`/`を併用することはできない.
また, `rgba()`の使用は推奨されない.

`rgb()`を使う上で以上の点を注意するこで, 変数を使った色の管理に関する最初の例を再掲しよう.

```css
:root {
  --tomato: 255 99 71;
  --sky-blue: 135 206 235;
  --dark: 51 51 51;
  --primary-color: var(--tomato);
  --secondary-color: var(--sky-blue);
  --background-color: var(--dark);
}
body {
  color: rgb(var(--primary-color));
  background-color: rgb(var(--background-color));
}
button {
  border: 1px solid rgb(var(--secondary-color) / 0.5);
}
```

のようになる.
(多少, `rgb()`をところどころで使っているので, 冗長になるかもしれないが, どのみち`var`を使ってるので, それほど変わらないだろう.)
気をつけるべきは`--tomato: 255 99 71;`のようにR, G, Bの値をスペース区切りで指定することである.
