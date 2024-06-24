---
title: "CSSのデザイン"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
image:
    url: "https://docs.astro.build/assets/rays.webp"
    alt: "Astroの光線のサムネイル。"
pubDate: 2024-06-15
tags: ["astro", "公開学習", "後退", "コミュニティ"]
---


# CSSのデザイン
CSSのデザインについて、いくつかデザインパターンとも呼ぶべきものをいくつか紹介する。

## モジュラースケール

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

### 解決策
```css
.stack > * + * {
    margin-top: 20px;
}
```
ここで、`* + *`はフクロウセレクタ(要素の前になにかしらの要素がある要素)と呼ばれる。
フクロウセレクタは、最初以外の要素に適用するセレクタと言える。

このようにすることで, `.stack`の直下にあるすべての要素に対して余白を適用することができる。
また、margin-topを使うことで、最後の要素の下に余白が適用されない。

#### 再帰
これをさらに再帰的に用いることもできる。改良は簡単、`>`を取り除くだけである。
[example](https://every-layout.dev/demos/stack-recursion/)

```css
.stack * + * {
    margin-top: 20px;
}
```
このようにすることで、`.stack`の直下にあるすべての要素に対して再帰的にmarginを適用することができる。

#### 例外
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

#### Stackの区分け
Stackは`flex`コンテキストを使うことで、カードのようなデザインを実現することができる。
要素を上のグループと下のグループにわけることができるのだ。
[example](https://every-layout.dev/demos/stack-split/)

```stack
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

## Center
テキストを中央に配置する際、`text-align: center`を使うことがある。
ただし、一般的に大量の文章を中央揃えにするのは非常に読みにくい。
それよりも、コンテナが中央に配置されていると嬉しい。

そこで、水平方向に中央揃えされたカラムを作る方法を紹介する。

### 解決策
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
    max-sizing: 60ch;
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--s1);
    padding-right: var(--s1);
}
```

## Switcher
flexにおけるレスポンシブデザインの悩みは意図した折りたたみができないことである。
例えば、横一列に並んでいる要素を縦一列に並び替えたいが、中途半端に折りたたまれてしまうことがある。
中途半端なレイアウトは、ユーザーにとって不要な情報を表示してしまうことになる。

### 解決策
切り替えのブレークポイントが`600px`であるとする。
```css
.switcher > * {
    display: flex;
    flex-wrap: wrap;
}

.switcher > * > * {
    flex-grow: 1;
    flex-basis: calc(600px - 100%) * 999);
}
```
このようにすることで.switcherの直下の要素はflex-boxになり、
`flex-grow: 1`を使うことで、アイテムが横に同じ比率で伸長される。

その下で、アイテムは`600px`以下になると`flex-basis`が非常に大きな値になるため、横の領域をすべて占有することになる。
負の値になると`flex-basis`は無効になる。

### ガター
要素間のマージンをとるには`gap`を使う。
```css
.switcher > *{
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

### 数量の調整
横にいくつも要素を並べることができるため、要素一つ一つの幅が狭まってしまう。
そこで、`.switcher`に入る要素の数を制限する必要がある。

```css
.switcher > :nth-last-child(n + 5) 
.switcher > :nth-last-child(n + 5) ~ *{
    flex-basis: 100%;
}
```
この例では`.switcher`の中で5個以上の要素がある場合に,　`flex-basis: 100%`を適用している。
`:nth-last-child(n + 5)`は後ろから数えて5番目以降から先頭までの要素に適用されるセレクタである。
`:nth-last-child(n + 5) ~ *`は後ろから5番目以降の要素に適用されるセレクタである。
なお、4つしか要素が無い場合には適用されない。

<!-- ## Frames -->
<!---->
<!-- ## Cover -->
<!---->
<!-- ## Grid -->
<!---->
<!-- ## Imposter -->

## 良いCSSとは
## CSSの公理
- カラム幅は60chを超えないようにする。(日本語の場合は24から40文字でemを使う)
```css
.measure-cap {
    max-width: 60ch;
}
```
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


## 命名規則
### BEM
BEMはBlock Element Modifierの略で、CSSの命名規則の一つであり、おそらく世界で最もよく使われている。
以下を例に説明する。
```html
<div class="alert info">
    This is an alert message.
</div>
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
