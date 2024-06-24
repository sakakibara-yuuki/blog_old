---
title: "CSSの基本"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
image:
    url: "https://docs.astro.build/assets/rays.webp"
    alt: "Astroの光線のサムネイル。"
pubDate: 2024-06-15
tags: ["astro", "公開学習", "後退", "コミュニティ"]
---

# CSSの基本
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
<link rel="stylesheet" href="../node_modules/normalize.css/normalize.css">
```

## CSSのセレクタ
CSSは以下のようにセレクタとプロパティを使ってスタイルを適用する。
```css
selector {
    property: value;
}
```

CSSには数百のプロパティがあるが、基本的なものを以下に示す。

## id selector
特定のタグに固有の一意の識別子をつける。
```html
<p id="interesting">This is interesting.</p>
```
```css
p {
    color: red;
}

#interesting {
    color: blue;
}
```
のように、idセレクタは`#`で指定する。
`<p id="interesting">`は`p`タグが適用されるが、CSSは後段の設定が優先されるため、`color: blue;`が適用される。

## class selector
特定のタグをクラスに振り分ける。
```html
<p class="important">This is important.</p>
```
```css
p {
    color: red;
}
.important {
    color: yellow;
}
```
idセレクタと似ているがクラスは複数個所で指定できる。
importantクラスのように, クラスは`.`で指定する。
`<p class="important">`は`p`タグが適用されるが、CSSは後段の設定が優先されるため、`color: yellow;`が適用される。

## li selector
`ul`や`ol`の中にある`li`タグを指定する。
`ul`や`ol`には`list-style-type`プロパティがある。これはリストのマーカーの形を指定する。
```html
<ul>
    <li>item 1</li>
    <li>item 2</li>
</ul>
```
```
ul {
    display: flex;
    list-style-type: none;
    justify-content: space-between;
    width: 30%
}
```
ヘッダーなどで使用する場合に`display: flex; justify-content: space-between`を指定することが多い。

## a selector
`a`タグはリンクを指定する。
```html
<ul>
    <li><a href="https://www.google.com">Google</a></li>
    <li><a href="#">hoge</a></li>
</ul>
```
```css
a {
    color: inherit;
    text-decoration: none;
}

a: hover {
    color: red;
    text-decoration: underline;
}
```
`color: inherit;`は親要素の色を継承する。
`text-decoration: none;`は下線を消す。
`a: hover`はマウスが乗った時のスタイルを指定する。
`:hover`は疑似クラスと呼ばれるセレクタに追加するキーワードであり、選択された要素の状態を指す。

また、`<a href="#">`はnull linkと呼ばれ、何もリンク先が指定されていないリンクを指す。

## 擬似クラス
`:hover`以外にもかなり多くの疑似クラスがある。
それらはいくつのグループに分けられる。

- 表示状態疑似クラス : `:fullscreen`, `:picture-in-picture`など
- 入力疑似クラス     : `:checked`(チェックボックスがonなら..)など
- 言語擬似クラス     : `:dir()`(書字方向が縦なら..), `:lang()`(言語がENなら..)など
- 位置擬似クラス     : `:visited`(訪れたことがあるなら...), `:link`(まだ訪れてないなら...)
- リソース状態疑似クラス :  `:play`(メディアが再生可能なら...) `:paused`(メディアが一時停止しているなら..)
- 時間軸擬似クラス       : `:current`(今表示されている要素の祖先なら...)videoの字幕用
- ツリー構造擬似クラス   : `:root`(root要素なら...), `:nth-child()`(n番目の子要素なら...)
- ユーザー操作擬似クラス : `:active`(クリックされたなら...), `:hover`(マウスが上にあるなら...)
- 関数擬似クラス         : `:is()`(セレクタが指定したものなら...), `:not`(セレクタが指定したものでないなら...)


## 属性
```html
<a href="https://www.google.com" target="_blank">Google</a>
```
```css
a[target="_blank"] {
    color: blue;
}
```
`a`タグでかつ`target="_blank"`の属性を持つものに`color: blue;`を適用する。

## 結合子
```html
<p>This is a paragraph.</p>
<div>
    <p>This is a first paragraph.</p>
    <section>
        <p>This is a second paragraph.</p>
    </section>
</div>
<p>This is a four paragraph.</p>
```

```css
div p {
    color: red;
}
```
これは`div`タグの中にある`p`タグに`color: red;`を適用する。
これはdivの下にあるpタグにどこまでも再帰的に適用される。
これを子孫結合子という。

```css
div > p {
    color: blue;
}
```
これは`div`タグの直下にある`p`タグに`color: blue;`を適用する。
これはdivの直下のみにあるpタグにのみ適用される。
これを子結合子という。

```css
div + p {
    color: green;
}
```
これは`div`タグの次に並ぶ`p`タグに`color: green;`を適用する。
これは入れ子ではなく、`div`の次に隣接する`p`タグにのみ適用される。
これを隣接兄弟結合子という。

```css
div ~ p {
    color: yellow;
}
```
これは`div`タグの後ろ(直後でなくても良い)に`p`タグがある場合に`color: yellow;`が適用される。
これは後続兄弟結合子という。

## box model
webページの各要素はすべてが矩形の領域で構成されている。
この矩形の領域をboxと呼び、boxの組み合わせによってきれいなwebページが作られる。

まず、内容を格納するcontentがあり、
borderがある。
borderの内側がpaddingで外側がmarginである。

```d2
margin: {
    label.near: top-center
    style.font-color: "#E6EE9C"
    style.stroke-dash: 3
    border: {
        label.near: top-center
        style.font-color: "#C5E1A5"
        padding: {
            label.near: top-center
            style.font-color: "#A5D6A7"
            style.stroke-dash: 3
            content: {
                label.near: top-center
                style.font-color: "#66BB6A"
            }
        }
    }
}
```

このboxにはdisplayプロパティがあり、以下のように分類される。
これには書字方向(writing-mode)が関係している。
書字方向は縦書きと横書きがある。
日本語などは横書きであるが、アラビア語などは縦書きである。
boxが積まれる方向をフロー方向と呼ぶ。
boxがblockの場合、フロー方向は書字方向と垂直になる。
また、フロー方向を主軸、垂直方向を交差軸と呼ぶ。

### box系プロパティ: それ自体の振る舞いを変える
| displayプロパティ | 説明 |
| --- | --- |
| block | 要素は書字方向いっぱいに広がる。結果、書字方向とは垂直に積まれる。 |
| inline | 要素は書字方向に積まれる。 |
| inline-block | 要素は書字方向に積まれるが、block要素のように幅や高さを指定できる。 |
| none | 要素は非表示になる。 |

つまり、パラグラフに割り当てて考えればblockは段落を、inlineは単語に該当する。

### 整形系(コンテキスト)プロパティ: その子の振る舞いを変える
| displayプロパティ | 説明 |
| --- | --- |
| flex | その子のフロー方向を制御する。 |
| grid | その子はグリッド上に割り当てられる。 |

たとえば、`p`タグはFireFoxの[デフォルト](resource://gre-resources/)では`    display: block;`となっている。

#### flex
子を**敷き詰める**効果がある。
flexを指定すると、何も指定がなければフロー方向が書字方向(水平)になる。

縦積みになっている状態で flexを横積みにすると、各boxの横のスペースを検知し、それを埋めるように横に積む。

横積みになっている状態で flexを縦積みにすると、各boxの縦のスペースを検知し、それを埋めるように縦に積む。

<table>
    <tr>
        <th>property</th>
        <th>values</th>
        <th>description</th>
    </tr>
    <tr>
        <td rowspan="2">flex-direction</td>
        <td rowspan="2">フロー方向の指定</td>
        <td>row(子を列に並べる, 水平方向)</td>
    </tr>
    <tr>
        <td>column(子を行に並べる、垂直方向)</td>
    </tr>
</table>

<table>
    <tr>
        <th>property</th>
        <th>values</th>
        <th>description</th>
    </tr>
    <tr>
        <td rowspan="4">justify-content</td>
        <td rowspan="4">主軸方向に沿って内部アイテムどうしの間隔を配分する</td>
        <td>start</td>
    </tr>
    <tr>
        <td>center</td>
    </tr>
    <tr>
        <td>space-between</td>
    </tr>
    <tr>
        <td>space-around</td>
    </tr>
    <tr>
        <td rowspan="4">align-content</td>
        <td rowspan="4">交差軸方向に沿って内部アイテムどうしの間隔を配分する。これはflexが折り返し設定され複数行にまたがっている時にしか有効ではない。折り返された複数行におけるjustify-contentのようなもの</td>
        <td>start</td>
    </tr>
    <tr>
        <td>center</td>
    </tr>
    <tr>
        <td>space-between</td>
    </tr>
    <tr>
        <td>space-around</td>
    </tr>
    <tr>
        <td rowspan="3">justify-items</td>
        <td rowspan="3">軸上のアイテムの"配置"を制御する</td>
        <td> strech </td>
    </tr>
    <tr>
        <td>center</td>
    </tr>
    <tr>
        <td>start, end</td>
    </tr>
    <tr>
        <td rowspan="3">align-items</td>
        <td rowspan="3">交差軸上のアイテムの"配置"を制御する</td>
        <td>strech</td>
    </tr>
    <tr>
        <td>center</td>
    </tr>
    <tr>
        <td>start, end</td>
    </tr>
</table>
まず、`justify-content`でどっちの軸に沿ってにboxがあるかを確認してから`align-items`でその交差軸上での配置を考えるとわかりやすい。

<table>
    <tr>
        <th>property</th>
        <th>values</th>
        <th>description</th>
    </tr>
    <tr>
        <td>flex-basis</td>
        <td>flexアイテムのサイズの初期値を設定する。 大きさはcontent-boxが設定される</td>
        <td>30px</td>
    </tr>
    <tr>
        <td>flex-grow</td>
        <td>flex-grow係数を設定する。空き領域の分だけ伸長する。flex-grow指定されていないアイテムは伸長されない。flex-grow指定されているアイテムはその合計に対する比に応じて伸長する</td>
        <td>0</td>
    </tr>
    <tr>
        <td>flex-shurink</td>
        <td>flex-growの反対。縮小する</td>
        <td>0</td>
    </tr>
    <tr>
        <td>flex</td>
        <td>flex-grow flex-shurink flex-basisの一括設定</td>
        <td>1 1 50px</td>
    </tr>
</table>

## grid
gridはその名の通り、グリッド上に要素を配置することができる。
gridで囲む要素をグリッドコンテナ、その中に配置される要素をグリッドアイテムと呼ぶ。
最も簡単な方法は以下の通り

```css
.container {
    display: grid;
    girid-template: 1fr 3fr 1fr / 1fr 2fr 1fr 1fr;
}
```

グリッドコンテナのプロパティは以下の通り。
グリッドをどのように配置するかを指定する。

- grid-template-columns
- grid-template-rows
- grid-template-areas
- grid-template


個々のグリッドアイテムがどのグリッドに割り当てられるかを指定する。

- grid-column
- grid-row
- grid-area


個々のグリッドアイテムのレスポンシブな配置を指定する。

- grid-auto-columns
- grid-auto-rows
- grid-auto-flow

以上のショートハンドが以下。

- grid


## box-sizing
boxの大きさをboxモデルのどこまで含めるか、boxモデルの何をsizingの対象とするのか、を指定するプロパティとしてbox-sizingがある。  

box自体の大きさはcontent + padding + borderで構成される。

```
div {
    width: 10rem;
    padding: 1rem;
}
```
デフォルトではbox-sizingはcontent-boxである。  
この場合、sizing(width: 10rem)により、div自体の幅は10rem + 1rem + 1rem = 12remとなる。

box-sizingをborder-boxにすると、
div自体の幅は10remとなる。

一般的にはborder-boxを使うことが良しとされる。

注意すべき点として、box-sizing: content-box; は親要素がbox-sizing: border-box; である場合、親要素のpaddingが子要素の幅に含まれないことがある。

```css
div {
    box-sizing: border-box;
    width: 10rem;
}

p {
    box-sizing: content-box;
    width: 100%;
    padding: 1rem;
}
```
```html
<div>
    <p>text</p>
</div>
```

`width:100%`の意味は親要素のbox-sizingに対して100%となることを意味する。
親要素(div)のbox-sizingはborder-boxであり、borderのサイズは10remとなり、boxのサイズは10remとなる。  
これに対して、子要素(p)のbox-sizingはcontent-boxであり、contentの大きさは親要素の100%なのでcontentの幅が10remとなる。よって, paddingを含むとboxの大きさは12remとなる。結果、子要素は親要素の幅を超えてしまう。
