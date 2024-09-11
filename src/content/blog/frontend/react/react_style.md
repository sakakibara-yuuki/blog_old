---
title: 'React Style Guide'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-08-29
tags: ["react", "style guide", "eslint", "prettier"]
---

# Introduction
Reactのスタイルガイドは複数ある.
主に以下が有名である.

- [Airbnb React/JSX Style Guide](https://airbnb.io/javascript/react/)

そこで, Airbnbの[スタイルガイド](https://airbnb.io/javascript/react/)をESLint x eslint-config-prettierを使って設定する.

ただし, Airbnbのスタイルガイドは少し古いため, 一部変更が必要であることに気をつけること.

<!-- ## ESlint x eslint-config-prettier の導入 -->
## Contents

## Airbnb React/JSX Style Guide
### 基本ルール (Basic Rules)

1. 1ファイル1コンポーネントを推奨する.
1. jsxの拡張子は`.jsx`を使う.
1. `React.createElement`を使用しない.

<details>
<summary>例外</summary>

1. 一つのファイルに複数のstateless, もしくは純粋(副作用がく, 参照透過性を持つ)なコンポーネントが含まれる場合を除く.
1.  
1. jsxではないファイルからアプリを初期化する場合を除く.
</details>

### Class vs React.createClass vs stateless
1. 内部状態や参照がある場合は`class extends React.Component`を使用する. (**React公式には反するので注意!!**)
1. 内部状態や参照がない場合はクラスよりも通常の関数を使用する. アロー関数ではない.

### Mixins
1. Mixinsは使用しない.

### 命名規則(Naming)
1. 拡張子は`.jsx`とする.
1. ファイル名はPascalCaseとする.
1. コンポーネント名はPascalCaseとする. そのインスタンスはcamelCaseとする.
1. ファイル名とコンポーネント名は一致する.
1. 高階コンポーネントと渡されたコンポーネントの名前の合成を生成されたコンポーネントの名前に使用する. (**そもそも高階コンポーネントは推奨されてません！ 注意[^high-order] Hookを使え！！**)
1. 目的が異なるのにDOMで使用されている属性名を使うことを避ける.

[^high-order]: [フックを動的に変更しない](https://ja.react.dev/reference/rules/react-calls-components-and-hooks#dont-dynamically-mutate-a-hook)

### 宣言(Declaration)
1. `displayName`は使用しない.

### 整理(Alignment)
1. eslintに従ってください.

### 引用符(Quotes)
1. jsxの属性には常に二重引用符(")を使用する. (通常のHTML属性も二重引用符(")を使用する)

### スペース(Spacing)
1. 自己閉じタグの前に半角スペースを入れる.
1. jsxの中括弧を囲む際にはスペースを入れない.

### Props
1. camelCaseを常に使用する.
1. プロパティの値が真偽値の場合, 真偽値を省略する.
1. `img`タグには`alt`属性を必ず付ける.
1. `img`タグには`image`, `photo`, `picture`などの単語を使わない.
1. 有効な、抽象的でないARIA roleのみを使用する.
1. 要素に`accesskey`を使用しない.
1. 配列のindexをkeyとして使用しない. 一意なIDを使用する.
1. 必須でないプロップには, 常に明示的なdefaultPropsを定義する.

### Refs
1. ref callabackを使用する.

### 括弧(Parentheses)
1. jsxタグが複数行にまたがる場合, 括弧で囲む.

### JSXタグ(Tags)
1. コンポーネントが子要素を持たない場合, 自己閉じタグを使用する.
1. コンポーネントに複数行のプロパティがある場合, そのタグを改行で閉じる.

### 関数(Methods)
1. ローカル変数をクローズするためにアロー関数を使用する.
1. コンストラクタでrenderメソッド内でイベントハンドラをバインドする(**古いので注意**).
1. Reactコンポーネントの内部関数にはアンダースコア(_ )で始まる関数を避ける.
1. renderメソッドでは必ずreturnを使用する. (**古いので注意**)
