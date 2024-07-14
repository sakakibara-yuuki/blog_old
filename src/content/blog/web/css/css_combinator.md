---
title: 'CSS結合子'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/web/css/css_combinator.png'
pubDate: 2024-07-14
tags: ["astro", "math"]
---

# 結合子
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
