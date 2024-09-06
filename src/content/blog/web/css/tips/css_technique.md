---
title: "CSSのテクニックTips"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: "/web/css/css_technique.png"
pubDate: 2024-06-15
tags: ["css", "tips"]
---

# CSSのテクニックTips

CSSのデザインについて、いくつかデザインパターンとも呼ぶべきものをいくつか紹介する。

<!-- ## モジュラースケール -->

## Stack

marginを使うか、paddingを使うかで迷うことがある。
主な違いはpaddingは個々の要素に適用されるのに対し、
marginは要素間の関係を調整するためにつかわれる。
しかし、だからこそ、単一の要素に対してmarginを使うことは問題がある(場合がある)。

```css
p {
  margin-bottom: 20px;
}
```

marginは要素間の関係を調整すべきなのだが、現状、個別の要素に対して適用されていることからだ。

コンテキストを考慮すべきなのである。

上の例で問題な点は

- 最後の`p`要素にもmarginが適用されてしまう
- 親要素にpaddingがある場合、余白が重複してしまう

ではどのようにすればいいか。

### Stack: 解決策

```css
.stack > * + * {
  margin-top: 20px;
}
```

ここで、`* + *`はフクロウセレクタ(要素の前になにかしらの要素がある要素)と呼ばれる。
フクロウセレクタは、最初以外の要素に適用するセレクタと言える。

このようにすることで, `.stack`の直下にあるすべての要素に対して余白を適用することができる。
また、margin-topを使うことで、最後の要素の下に余白が適用されない。

#### Stack: 再帰

これをさらに再帰的に用いることもできる。改良は簡単、`>`を取り除くだけである。
[example](https://every-layout.dev/demos/stack-recursion/)

```css
.stack * + * {
  margin-top: 20px;
}
```

このようにすることで、`.stack`の直下にあるすべての要素に対して再帰的にmarginを適用することができる。

#### Stack: 例外

CSSが直列的であることを利用すると、例外としてのセレクタの適用が有効である。

```html
<div class="stack">
  <div>First</div>
  <div>Second</div>
  <div class="stack-exception">Third</div>
  <div>Fourth</div>
</div>
```

ここで`.stack-exception`に対してmarginを適用したくない場合、

```css
.stack > * + * {
  margin-top: var(--space, 1.5rem);
}

.stack-exception {
  --space: 3rem;
}
```

のようにすることで、例外を適用することができる。
この妙がわかるだろうか。
`.stack`の中には`.stack-exception`がある場合がある。その場合に限り、変数`--space`を使用することができる。
それ以外の場合は`1.5rem`が適用されるのだ。

#### Stack: stackの区分け

Stackは`flex`コンテキストを使うことで、カードのようなデザインを実現することができる。
要素を上のグループと下のグループにわけることができるのだ。
[example](https://every-layout.dev/demos/stack-split/)

```css
.stack {
  display: flex;
  flex-direction: column;
  justify-content: flext-start;
}

.stack > * + * {
  margin-top: var(--space, 1.5rem);
}

.stack > :nth-child(2) {
  margin-bottom: auto;
}
```

`nth-child(2)`は、2番目の要素に適用されるセレクタである。
`nth`というのは`n-th`(n番目)の略である。
2番目の要素に`margin-bottom: auto`を適用することで、ここを境に上下に要素をわけることができる。
親要素が`flex`であり、`flex-direction: column`(縦方向)であることから、縦に積まれ、margin-bottomがautoであることから、左に折り返されるのだ。

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="VwJLgbq" data-pen-title="stack" data-editable="true" data-user="sakakibara-yuuki" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/sakakibara-yuuki/pen/VwJLgbq">
  stack</a> by sakakibara (<a href="https://codepen.io/sakakibara-yuuki">@sakakibara-yuuki</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Center

テキストを中央に配置する際、`text-align: center`を使うことがある。
ただし、一般的に大量の文章を中央揃えにするのは非常に読みにくい。
それよりも、コンテナが中央に配置されていると嬉しい。

そこで、水平方向に中央揃えされたカラムを作る方法を紹介する。

### Center: 解決策

単純な方法は、`margin: 0 auto`を使うことである。

```css
.center {
  margin: 0 auto;
}
```

ただし、これは本来必要ではない垂直方向の余白も0になってしまうので次が推奨される。

```css
.center {
  max-width: 60ch;
  margin-left: auto;
  margin-right: auto;
}
```

なお、`ch`は文字の幅を表す単位である。ここでは文章を読むのに適した幅を指定している。
そのため、`rem`ではなく`ch`を使っている。

なお、この場合だと、画面の幅が60chを下回ると画面の端に接触してしまうので、多くの場合、paddingを使って余白を作る。
paddingを使う際、`box-sizing: border-box`の場合だとcontent幅が60chにはならないので、ここだけ例外的に`box-sizing: content-box`を使う。

```css
.center {
  box-sizing: content-box;
  max-width: 60ch;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--s1);
  padding-right: var(--s1);
}
```

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="dyBoaZa" data-pen-title="center" data-editable="true" data-user="sakakibara-yuuki" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/sakakibara-yuuki/pen/dyBoaZa">
  center</a> by sakakibara (<a href="https://codepen.io/sakakibara-yuuki">@sakakibara-yuuki</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

## Switcher

flexにおけるレスポンシブデザインの悩みは意図した折りたたみができないことである。  
例えば、横一列に並んでいる要素を縦一列に並び替えたいが、中途半端に折りたたまれてしまうことがある。
中途半端なレイアウトは、ユーザーにとって不要な情報を表示してしまうことになる。

折り返し地点で一気に横から縦に変わることが望ましいケースがある。

- [demo](https://every-layout.dev/demos/switcher-basic/)

`@media`を使用して要素を変更できる

```css
@media (max-width: 600px) {
  .container {
    display: flex;
  }
  .switcher > * {
    display: block;
  }
}
```

しかし、極力それを使うのは避けたい。
というのもbreak pointで設定される値というのはコンテンツとは無関係な値であるからだ。
これによりデバイス毎に予想外のデザインを示すことがある。
そこで、より抽象度の高い折り返しの指定を紹介する。

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="JjQdxew" data-pen-title="switcher" data-editable="true" data-user="sakakibara-yuuki" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/sakakibara-yuuki/pen/JjQdxew">
  switcher</a> by sakakibara (<a href="https://codepen.io/sakakibara-yuuki">@sakakibara-yuuki</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

一応、以上でブレイクポイントを使わずに折りたたみを実現することができる。
しかし、この方法だと、横一列から縦一列に一気に変わることができない。

### Switcher: 解決策

切り替えのブレークポイントを通常のbreakpoint(viewportの幅)に対してではなく、親要素を基準として設定する。  
例えば、break point が`30rem`の場合、親要素が`30rem`以下になると折りたたまれるようにする。

```html
<div class="switcher">
  <div class="container">
    <div>item 1</div>
    <div>item 2</div>
    <div>item 3</div>
  </div>
</div>
```

```css
.switcher > * {
    display: flex;
    flex-wrap: wrap;
}

.switcher > * > * {
    flex-grow: 1;
    flex-basis: calc(30rem - 100%) * 999);
}
```

このようにすることで.switcherの直下の要素は折り返し可能なflex itemになり、marginやpaddingが設定された後、`flex-basis`が適用される。　　
`flex-basis`の計算について説明する。
`100%`は親要素の大きさを表す。よって、`calc(30rem - 100%)`は30remより親が大きい場合には負の値になり、小さい場合には正の値になる。さらに`999`を掛けているので、`calc(30rem - 100%) * 999`は

- 30remより親が大きい場合には極端な負の値
- 30remより親が小さい場合には極端な正の値
  を意味する。
  しかし、`flex-basis`では負の値は0に修正されるため、
  `flex-basis`は
- 30remより親が小さい場合には極端な正の値
- 30remより親が大きい場合には0
  を意味することになる。

`flex-grow: 1`を使うことで、各flex itemが横に同じ比率で伸長される。

極端に大きな初期値にそれぞれが均等な割合で伸びるため、横幅が親要素の幅を超えると、`flex-wrap`によって一気に折り返される。

### Switcher: ガター

要素間のマージンをとるには`gap`を使う。

```css
.switcher > * {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    --break-point: 600px;
}

.switcher > * {
    flex-grow: 1;
    flex-basis: calc(var(--break-point) - 100%) * 999);
}
```

### Switcher: 数量の調整

さて、親要素に対するブレイクポイントを設定することでswitchを実装することができたが、ブレイクポイントではなく、子要素の数によってswitchを実装することもできる。

```css
.switcher > * {
  display: flex;
  flex-wrap: wrap;
}

.switcher > .container > :nth-last-child(n + 5),
.switcher > .container > :nth-last-child(n + 5) ~ * {
  flex-grow: 1;
  flex-basis: 100%;
}
```

`:nth-last-child`について説明しよう。
`:nth-last-child(n + 5)`は後ろから数えて5番目から先頭までの要素を表すセレクタである。(5番目を含む)

そして`~`は、例えば、`a ~ b`は`a`の後に続く(直後でなくていい)`b`に適用されるセレクタである。

よって、以上のcssは子要素が

- 5個以上の場合、すべての子要素に対して`flex-basis: 100%; flex-grow: 1;`を適用することになる。
- 5個未満の場合、`:nth-last-child(n + 5)`が適用されないため、`flex-basis: 100%; flex-grow: 1;`が適用されない。

これによって、子要素が5個以上の場合には、一気にflex itemになり横並びになる。

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="GRbJzLp" data-pen-title="switcher2" data-editable="true" data-user="sakakibara-yuuki" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/sakakibara-yuuki/pen/GRbJzLp">
  switcher2</a> by sakakibara (<a href="https://codepen.io/sakakibara-yuuki">@sakakibara-yuuki</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### Sidebar: 余白の調整

- [demo](https://every-layout.dev/demos/sidebar-media-object/)

### icon: 画像の調整

iconではsvgが使われる。

```html
<svg class="icon" viewBox="0 0 10 10" stroke="currentColor" stroke-width="2">
  <path
    d="
    M1,1 9,9
    M9,1 1,9"
  />
</svg>
```

`M1,1 9,9`は(1,1)から(9,9)までの線を引くという意味であり、
`M9,1 1,9`(9,1)から(1,9)までの線を引くという意味である。
viewBoxは、svgの座標系を指定するものである。
`viewBox="0 0 10 10"`は、(0,0)から(10,10)までの座標系を指定している。

```css
.icon {
  width: 0.75em;
  height: 0.75em;
  stroke: currentColor;
  stroke-width: 2;
}
```

svgはテキストと同じようにスタイルを適用することができる。

```css
.small {
  font-size: 0.75em;
}

.big {
  font-size: 1.5em;
}

.icon .small {
  // 0.75em * 0.75em = 0.5625em になる。
}

.icon .big {
  // 0.75em * 1.5em = 1.125em になる。
  }
```

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="wvLaOQy" data-pen-title="icon" data-editable="true" data-user="sakakibara-yuuki" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/sakakibara-yuuki/pen/wvLaOQy">
  icon</a> by sakakibara (<a href="https://codepen.io/sakakibara-yuuki">@sakakibara-yuuki</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

<!-- ## Frames -->
<!---->
<!-- ## Cover -->
<!---->
<!-- ## Grid -->
<!---->
<!-- ## Imposter -->
