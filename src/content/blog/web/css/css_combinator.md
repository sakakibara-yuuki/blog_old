---
title: "CSS 結合子"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/web/css/css_combinator.png"
pubDate: 2024-07-14
tags: ["css"]
---

# 結合子

## Contents

## 子孫結合

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

## 子結合

```css
div > p {
  color: blue;
}
```

これは`div`タグの直下にある`p`タグに`color: blue;`を適用する。
これはdivの直下のみにあるpタグにのみ適用される。
これを子結合子という。

## 隣接兄弟結合 & 後続兄弟結合

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

## クラスセレクタと注意点

[`クラスセレクタ`](https://developer.mozilla.org/ja/docs/Web/CSS/Class_selectors)は、クラス属性に基づいて要素を選択するためのセレクタである。

```html
<ul>
  <li class="spacious elegant"><div>A</div></li>
  <li class="spacious"><div class="elegant">B</div></li>
</ul>
```

```css
li.spacious.elegant {
  margin: 2em;
}

li.spacious .elegant {
  margin: 2em;
}
```

上と下のコードは異なる意味を持つ。上のセレクタではAを選択し、下のセレクタではBを選択する。
下のセレクタは`li.spacious`クラスの中にある`elegant`クラスを選択する。ここでは``(空白, space)が子孫結合子を意味するからである。
