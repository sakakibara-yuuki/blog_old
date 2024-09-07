---
title: "CSS ボックスモデル"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/web/css/css_boxmodel.png"
pubDate: 2024-07-13
tags: ["css", "box model"]
---

# box model

[CSSのレイアウト](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Normal_Flow)を考える上で最も基本になるのがbox modelである。

webページの各要素はすべてが矩形の領域で構成されている。
この矩形の領域をboxと呼び、boxの組み合わせによってきれいなwebページが作られる。  
まず、内容を格納するcontentがあり、
その境界を表すborderがある。
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

## box-sizing

boxの大きさをboxモデルのどこまで含めるか、boxモデルの何をsizingの対象とするのか、を指定するプロパティとしてbox-sizingがある。  
box自体の大きさはcontent + padding + borderで構成される。

```css
div {
  width: 10rem;
  padding: 1rem;
}
```

デフォルトでは`box-sizing`は`content-box`である。  
この場合、sizing(width: 10rem)により、div自体の幅は10rem + 1rem + 1rem = 12remとなる。  
`box-sizing`を`border-box`にすると、
div自体の幅は10remとなる。  
一般的には`border-box`を使うことが良しとされる。

注意すべき点として、`box-sizing: content-box;` は親要素が`box-sizing: border-box;` である場合、親要素のpaddingが子要素の幅に含まれないことがある。

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

`width:100%`は親要素の`box-sizing`に対して100%となることを意味する。  
親要素(div)の`box-sizing`は`border-box`であり、borderのサイズは10remとなり、boxのサイズは10remとなる。  
これに対して、子要素(p)の`box-sizing`は`content-box`であり、contentの大きさは親要素の100%なのでcontentの幅が10remとなる。よって, paddingを含むとboxの大きさは12remとなる。結果、子要素は親要素の幅を超えてしまう。

## box系プロパティ

<!-- boxが積まれる方向をフロー方向と呼ぶ。   -->
<!-- boxがblockの場合、フロー方向は書字方向と垂直になる。   -->
<!-- (要素にテキストを書く際、その書字方向(writing-mode)には縦書きと横書きがある。 -->
<!-- 日本語などは横書きであるが、アラビア語などは縦書きである。) -->
<!---->

boxには[`display`](https://developer.mozilla.org/ja/docs/Web/CSS/display)プロパティがあり、大きく２つに分類される。

- box系プロパティ: それ自体の振る舞いを変える
- 整形系(コンテキスト)プロパティ: その子の振る舞いを変える

以下では、これらのプロパティについて説明する。
| displayプロパティ | 説明 |
| --- | --- |
| inline | 要素は書字方向に積まれる。 default|
| block | 要素は書字方向いっぱいに広がる。結果、書字方向とは垂直に積まれる。 |
| inline-block | 要素は書字方向に積まれるが、block要素のように幅や高さを指定できる。 |
| none | 要素は非表示になる。 |

つまり、パラグラフに割り当てて考えれば`block`は段落に、`inline`は単語に該当する。

デフォルトでは`inline`であり、たとえば、`p`タグはFireFoxの[デフォルト](resource://gre-resources/)では`display: block;`となっている。

## 整形系(コンテキスト)プロパティ

| displayプロパティ | 説明                          |
| ----------------- | ----------------------------- |
| flex              | その子要素を1次元に配置する。 |
| grid              | その子要素を2次元に配置する。 |

### flex

**[flex box](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Flexbox)はアイテムを並べる1次元のレイアウトモデルである。**
行か列のどちらかの方向にアイテムを並べることができる。デフォルトでは書字方向(水平)にアイテムが並ぶ。

極論2次元も1次元の直積なのでflexさえあれば十分である(ただし、gridの方が2次元のレイアウトを簡単に行える)。
CSSの最も重要なレイアウト方法である。

```bash
div {
  display: flex;
}
```

この宣言がされている`div`が**flex container**となり、その子要素が**flex item**となる。

### flex-direction

flex containerは２つの軸を持つ。

[![flex](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Flexbox/flex_terms.png)](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Flexbox#%E3%83%95%E3%83%AC%E3%83%83%E3%82%AF%E3%82%B9%E3%83%A2%E3%83%87%E3%83%AB)

flex itemが配置されている軸を**主軸**と呼び、  
それに垂直な軸を**交差軸**と呼ぶ。

<!-- 縦積みになっている状態で flexを横積みにすると、各boxの横のスペースを検知し、それを埋めるように横に積む。 -->
<!-- 横積みになっている状態で flexを縦積みにすると、各boxの縦のスペースを検知し、それを埋めるように縦に積む。 -->

主軸の方向を決めるプロパティとして以下がある。

```bash
div {
  display: flex;
  flex-direction: row;
}
```

<table>
    <tr>
        <th>property</th>
        <th>values</th>
        <th>description</th>
    </tr>
    <tr>
        <td rowspan="2">
          <a href="https://developer.mozilla.org/ja/docs/Web/CSS/flex-direction">
            flex-direction
          </a>
        </td>
        <td>row</td>
        <td>主軸を水平方向(列)とする。default</td>
    </tr>
    <tr>
        <td>column</td>
        <td>主軸を垂直方向(行)とする。</td>
    </tr>
</table>

### flex-wrap

flex containerのbox-sizeに対してflex itemが画面をはみ出す場合がある。
折り返すためには以下のプロパティを使う。

```bash
div {
  display: flex;
  flex-wrap: wrap;
}
```

<table>
    <tr>
        <th>property</th>
        <th>values</th>
        <th>description</th>
    </tr>
    <tr>
        <td rowspan="3">
          <a href="https://developer.mozilla.org/ja/docs/Web/CSS/flex-wrap">
            flex-wrap
          </a>
        </td>
        <td>nowrap</td>
        <td>折り返さない。</td>
    </tr>
    <tr>
        <td>wrap</td>
        <td>折り返す。</td>
    </tr>
</table>
`flex-direction`と`flex-wrap`を一括で指定するプロパティとして

```bash
flex-flow: row wrap;
```

がある。(が、あまり使われない?)

### flex

flex itemがflex containerのうちどの程度のスペースを占めるかを指定することができる。
それが[flex](https://developer.mozilla.org/ja/docs/Web/CSS/flex)プロパティだ。
flex itemに以下のように指定する。

```bash
.item {
  flex: 1;
}
```

これは`.item`が主軸の使用可能なスペースのうちどれだけを占めるかを指定する。
まず、paddingやmarginを設定した後、残りのスペースを同じ割合で分配する。

また、以下のように指定することもできる。

```bash
.item1{
  flex: 1;
}

.item2{
  flex: 2;
}
```

この場合、`.item1`と`.item2`のスペースの割合は1:2となる。
また、最小値を指定することもできる。

```bash
.item1 {
  flex: 1 100px;
}

.item2 {
  flex: 2 200px;
}
```

この意味するところは、
まず、最初に`.item1`,`.imte2`に100px, 200pxのスペースを割り当てる。
その後、paddingやmarginを設定した後、残りのスペースを1:2の割合で分配する。
といった具合である。
これは`width`とは異なり、初期値として100px, 200pxを指定しているため、サイズの変更があったらそれに応じてbox-sizeは変更される。

<table>
    <tr>
        <th>property</th>
        <th>values</th>
        <th>description</th>
    </tr>
    <tr>
        <td rowspan="3">
          <a href="https://developer.mozilla.org/ja/docs/Web/CSS/flex">
            flex
          </a>
        </td>
        <td>1</td>
        <td>1単位のスペースを占有する。</td>
    </tr>
    <tr>
        <td>1 100px</td>
        <td>100pxのスペースを占有し,残りのスペースから1単位のスペースを占有する。</td>
    </tr>
</table>

### justify-content

flex itemが主軸方向にどのように配置されるかを指定するプロパティとして`justify-content`がある。

```bash
div {
  display: flex;
  justify-content: center;
}
```

<table>
    <tr>
        <th>property</th>
        <th>values</th>
        <th>description</th>
    </tr>
    <tr>
        <td rowspan="3">
          <a href="https://developer.mozilla.org/ja/docs/Web/CSS/justify-content">
            justify-items
          </a>
        </td>
        <td>auto</td>
        <td>親のjustify-itemsを継承する。なければ無視。</td>
    </tr>
    <tr>
        <td>center</td>
        <td>flex itemが主軸の中央で互いに接するように詰められる。</td>
    </tr>
    <tr>
        <td>stretch</td>
        <td>flex itemが主軸に沿って完全に埋めるようになる。max-height/max-widthの制限は受ける。</td>
    </tr>
</table>

### align-items

flex itemが交差軸上でどのように配置するかを指定するプロパティとして`align-items`がある。

```bash
div {
  display: flex;
  align-items: center;
}
```

<table>
    <tr>
        <th>property</th>
        <th>values</th>
        <th>description</th>
    </tr>
    <tr>
        <td rowspan="3">
          <a href="https://developer.mozilla.org/ja/docs/Web/CSS/align-items">
            align-items
          </a>
        </td>
        <td>normal</td>
        <td>flex itemではstretchとして機能する。</td>
    </tr>
    <tr>
        <td>center</td>
        <td>flex itemは交差軸上の中央に配置される。</td>
    </tr>
    <tr>
        <td>stretch</td>
        <td>flex itemをflex containerを埋めるように交差軸上に引き伸ばす。</td>
    </tr>
</table>

まず、`justify-content`でどっちの軸に沿ってにboxがあるかを確認してから`align-items`でその交差軸上での配置を考えるとレイアウトがやりやすい。

## grid

[grid](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Grids)はその名の通り、グリッド上に要素を配置することができる。
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
