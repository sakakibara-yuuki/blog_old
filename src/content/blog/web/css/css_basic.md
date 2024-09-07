---
title: "CSSの心構え"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: "./web/css/css_basic.png"
pubDate: 2024-06-15
tags: ["css", "命名規則", "ベストプラクティス"]
---

# CSSの心構え

## 悪いCSSとは

CSSは普通に書いていると、どんどんと複雑になっていく。
しばらく経つと、どこを変更したらどこに影響がでるのかわからなくなり、その上、多くのセレクタが氾濫してしまう。
良いCSSを書くことは難しい。  
そこで、悪いCSSを避けることを考える。

- HTMLの構造に依存するCSS
- 取り消しのルールが多いCSS
- マジックナンバーが多いCSS

### HTMLの構造に依存するCSS

```html
<div>
  <h1>
    <p>This is a sentence</p>
  </h1>
</div>
```

```css
div h1 p {
  color: red;
}
```

これが

```html
<div>
  <h2>
    <p>This is a sentence</p>
  </h2>
</div>
```

になったらCSSを書き直さなければならなくなる。
対策として

```html
<div class="entry">
  <h2 class="entry__title">
    <p>This is a sentence</p>
  </h2>
</div>
```

```css
.entry__title {
  color: red;
}
```

のようにする。

なるべく

```
div h1 p ul li a {
    color: red;
}
```

のようなHTMLの構造に依存しているCSSは避けるべきである。

この点から、セレクタの連なりは長くなりすぎない方が良いだろう。

### 取り消しのルールが多いCSS

次のようなスタイルがあるとする。

```css
.title {
  border-bottom: 1px solid #000;
  padding: 10px;
}
```

しばらくはこれで良かったが、そのうち、`border-bottom`を消したくなったとする。
すると次のようなCSSを書くだろう。

```css
.no_border {
  border-bottom: none;
  padding-bottom: 0;
}
```

```html
<h2 class="title norborder">This is a title</h2>
```

これが取り消しルールである。例外とも言える。

対策として、例外的なルールとそれまでのルールの共通部分を抜き出して、
それまでのルールに追加するルールを作成する。

```css
.title {
  margin-bottom: 10px;
  font-size: 2em;
}

.headline {
  padding-bottom: 10px;
  border-bottom: 1px solid #000;
}
```

```html
<h2 class="title headline">This is a title</h2>
```

共通部分を抜き出すという点からは一つのスタイルのプロパティの数は少なく、小粒であり、しかも共通部分を抜き出すという点からスタイルそのものの数も少なくなるべきだろう。

### マジックナンバーが多いCSS

言わずもがな、マジックナンバーは避けるべきである。

対策として, 計算と継承をする。
これが、

```css
.intoduction {
  line-height: 27px;
  font-size: 18px;
}
.lead {
  line-height: 54px;
  font-size: 36px;
}
```

こうなる。

```css
.intoduction {
  line-height: 1.5;
  font-size: 18px;
}
.lead {
  font-size: 36px;
}
```

一つ目はline-heightがfont-sizeの1.5倍であることを利用して、font-sizeが変わっても見た目がline-heightの見た目が変わらないようにしている。
二つ目はline-heightが継承されるため、line-heightを指定しなくても良い。
実は、フォント系のプロパティ(`font-size`, `color`, `line-height`)などのプロパティはこの要素に継承される。
また、

```css
line-height: 1.5;
```

ではなく、

```css
line-height: 1.5em;
```

としてしまうと、

```css
.lead {
    # line-height: 27px; 本当は36 * 1.5 = 54pxが欲しいが、18 * 1.5 = 27pxになってしまう
    font-size: 36px;
}
```

計算された値が適用されてしまうので注意が必要である。
まとめると

- `line-height`を相対値にする。
- `line-hegiht`は継承される。
- `line-height`は無単位(無次元)で指定することで、その要素のfont-sizeにたいする比率を指定する。

## CSSのリファクタリング

例えば、stackの中にcenterをいれる場合、

```css
.center {
  margin: 0 auto;
}
```

のようにショートハンドを使って宣言してしうまうと、stackで設定したmarginが上書きされてしまう。
このような問題をさけるため、本来必要でない宣言はしないようにする。
正解は

```css
.center {
  margin-left: auto;
  margin-right: auto;
}
```

である。

## CSSの公理

- カラム幅は60chを超えないようにする。(日本語の場合は24から40文字でemを使う)

```css
.measure-cap {
  max-width: 60ch;
}
```

## モバイルファースト

レスポンシブwebデザインの考え方の一つで、モバイルファーストという考え方がある。
これはレスポンシブ対応のwebページを作る際に、まずはスマートフォンサイズのページを作り、次にタブレットサイズ、PC用とだんだんと大きな画面に対応していくという考え方である。

これはスマートフォンの利用者が増加してきたことから、モバイルサイズの画面により優先して注力すべきだという考え方である。

[Mobile First](https://developer.mozilla.org/ja/docs/Glossary/Mobile_First)

## normalize CSS

CSSはブラウザによってデフォルトでスタイルが異なる。
それらを一旦リセットして、すべてのブラウザで同じスタイルを適用するためにnormalize.cssを使う。
[normalize.css](https://necolas.github.io/normalize.css/)

```html
<link rel="stylesheet" href="../node_modules/normalize.css/normalize.css" />
```

## 命名規則

### BEM

BEMはBlock Element Modifierの略で、CSSの命名規則の一つであり、おそらく世界で最もよく使われている。
以下を例に説明する。

```html
<div class="alert info">This is an alert message.</div>
```

#### Block

```css
.alert {
    ...
}
```

がBlockに該当する。

#### Element

```css
.alert__title {
    ...
}
```

Blockの中にある要素がElementに該当する。

#### Modifier

```css
.alert_warning {
    ...
}
```

もしくは`.alert--warning`のようにハイフン２つでModifierを表す。
なお、２つのハイフン`--`を使う場合は単語をつなげる際には`-`を使う。
(これはModifierがBlockまたはElementと対等な関係にあることを示す。)
BlockまたはElementの状態変化形がModifierに該当する。

<!-- ### FLOCSS -->
