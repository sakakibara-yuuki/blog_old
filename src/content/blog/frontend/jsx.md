---
title: 'JSX'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-11-04
tags: ["astro", "math"]
---

# Introduction
JSXはreactを使用する際に避けられない.
初めてこれを触った時は, reactのコンポーネントを書くための記法だと感じていた.
しかし, 気づいてみればこれは違う. これについて説明する.

## Contents
## ReactとJSX
JSXはJavaScriptの拡張構文であり, Reactと同じでMeta(Facebook)によって開発されている.
ReactはUIを構築するためにWebAPIを使用して, HTMLを生成する.
ただし, 純粋なReactやWebAPIを使用すると, コードが複雑になる.
そこで, JSXが登場する.
Metaが開発していることもあり, JSXはReactとの親和性が高い.

ここで, 
```html
<div class="greeting">Hello, World!</div>
```
というHTMLを例にReactの標準APIを使用した場合のコードとJSXを使用した場合のコードを比較してみる.

Reactの標準APIを使用した場合は以下のようになる.
```javascript
// Reactの標準APIを使用した場合
import React from 'react';

const Hello = () => React.createElement(
    'div',
    {className: 'greeting'},
    'Hello, World!'
);

export default Hello;
```
対して, JSXを使用した場合は以下のようになる.
```javascript
// JSXを使用した場合
import React from 'react';

const Hello = () => <div className="greeting">Hello, World!</div>;

export default Hello;
```

Reactの標準APIの使用もまずまずわかりやすいが, JSXを使用した場合の方がコードが簡潔になる. なお, React標準APIを使用した場合でも, HTMLの入れ子構造などを再現できる.

## Babel
前述の通り, Reactはただのjavascriptのモジュールであり, JSXは(本質的にはReactとは関係ない)JavaScriptの拡張構文である.

しかし, 通常のJavaScriptエンジンはJSXを理解できないため, JSXをJavaScriptに変換する必要がある.
この変換を行うツールがBabelである.
ソースコードをBabelでトランスパイルすることで, JSXをJavaScriptに変換することができる.

通常, babelはビルドシステムなどに組み込まれているが, ここではbabel-cliを使用してコマンドラインからbabelを使用する方法を説明する.

以下のようなコマンドを実行して, Babelをインストールする.
```bash
npm i -D @babel/core @babel/cli @babel/preset-env @babel/preset-react
```

```json
// babel.config.json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```
`@babel/preset-env`により, ES6+の構文をES5に変換することができる.
これにより後方互換性を保つことができる.
また, `@babel/preset-react`を使用することで, Reactコンポーネントに書かれたJSXをJavaScriptに変換することができる.

では実際に, JSXを用いたReactをJavaScriptに変換してみる.
```javascript
// index.jsx
import React from 'react';

export default function Hello() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
```
上記のコードを以下のコマンドでトランスパイルする.
```bash
npx babel index.jsx
```
すると, 以下のようなコードが出力される.
```javascript
import React from 'react';
export default function Hello() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Hello World"));
}
```
このように, JSXをJavaScriptに変換することができる.
