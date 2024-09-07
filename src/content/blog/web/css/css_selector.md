---
title: "CSSセレクタ"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/web/css/css_selector.png"
pubDate: 2024-07-13
tags: ["css", "selector"]
---

# CSSセレクタ

CSSは以下のようにセレクタとプロパティを使ってスタイルを適用する。

```css
selector {
  property: value;
}
```

セレクターにはいくつか種類がある。

- 要素型セレクタ: `a {...}`
- 全称セレクタ: `* {...}`
- idセレクタ: `#a {...}`
- クラスセレクタ: `a.b {...}`
- 属性セレクタ: 要素+属性`a[title] {...}`
- 入れ子セレクタ: `a { b {...} }`

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
