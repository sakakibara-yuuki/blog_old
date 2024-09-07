---
title: "CSS テンプレート"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/web/css/css_template.png"
pubDate: 2024-07-12
tags: ["css", "template"]
---

# CSS template

以下に自分がよく使うCSSのテンプレートをまとめていく。

## box

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/sakakibara-yuuki/embed/JjQdvWW?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/sakakibara-yuuki/pen/JjQdvWW">
  Untitled</a> by sakakibara (<a href="https://codepen.io/sakakibara-yuuki">@sakakibara-yuuki</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## default layout

## CSS animation

## @ルール

アットルールはCSSの動作を規定するためのルールです。
`@`で始まり、`;`で終わります。

```css
@identifier (rule);
```

のような構文です。

例えば、以下のように

```css
@import "style.css";
@charset "UTF-8";
```

記述されます。
`@`ルールには以下のような種類があります。

- `@charset`: 文字セットを指定する
- `@import`: 外部のCSSスタイルシートを読み込む
- `@namespace`: XML名前空間を定義する

ある種の`@`ルールはスタイルを用いて定義したいことがあります。
そのような場合には入れ子にして記述します。

- `@media`: 特定のデバイスやメディアタイプに適用するスタイルを定義する
- `@supports`: 特定のCSSプロパティや値をブラウザがサポートしているかを判定する
- `@page`: 印刷時のページのスタイルを定義する
- `@font-face`: ダウンロードする外部フォントを指定する
- `@keyframes`: アニメーションのキーフレーム/途中のスタイルを定義する
