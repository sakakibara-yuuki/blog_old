---
title: 'React CSS Styling'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-07-21
tags: ["astro", "math"]
---

# Introduction
CSSの当て方は様々あるが、どれも隆盛がある。
- Pure CSS
- Inline CSS
- [CSS Module](https://github.com/css-modules/css-modules)
- [styled-component](https://styled-components.com/) (CSS in JS)
- [vanilla-extract](https://vanilla-extract.style/) (zero runtime CSS in JS)

## Contents
## styled-component
styleを適用するだけのコンポーネントを作成することができる。

```js
import sytle from "styled-components";

const ButtonStyle = styled.button`
  background-color: red;
  color: white;
`

const App = () => {
  return (
    <div>
      <ButtonStyle>
        <button>
         Click me
        </button>
      </ButtonStyle>
    </div>
  )
};
```
