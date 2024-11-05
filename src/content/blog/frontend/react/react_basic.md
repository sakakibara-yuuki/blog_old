---
title: 'React の基本'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-07-10
tags: ["react", "基本", "基礎"]
---

# Introduction
[React](https://ja.react.dev/learn)は内部でWeb APIsを使って、UIを構築するためのJavaScriptライブラリである。
Reactで作られたアプリは、Reactコンポーネント(もしくは単にコンポーネント)と呼ばれるUI部品を組み合わせて構築される。

## コンポーネント
**[コンポーネント](https://ja.react.dev/learn/your-first-component#defining-a-component)とはマークアップを返すJavaScript関数である。**
- コンポーネントは他のコンポーネントを組み合わせて構築される。
- コンポーネントは単一のマークアップのみを返す。
- コンポーネントは大文字で始まる名前を持つ。

### JSX
**ここで使われるマークアップ構文を[JSX](https://ja.react.dev/learn/writing-markup-with-jsx#jsx-putting-markup-into-javascript)と呼ぶ。**
コンポーネントは単一のマークアップのみを返すため、兄弟要素を返したい場合は、`<div></div>`タグや空のタグ`<></>`で囲む必要がある。
JSXの機能としては

- cssクラスを適用するためには、`className`属性を使用する。
- `{}`を使うことでタグの属性に式を評価できる。
 - 文字列
 - オブジェクト
 - リスト
- `li`を使う際には`key`属性を指定する。
また, より詳細は[JSXについて](../jsx.md)を参照する。
HTMLをJSXに変換する場合には[コンバータ](https://transform.tools/html-to-jsx)を使用する。

### イベントハンドラ
コンポーネント内にイベントハンドラ関数を宣言することで、イベントを処理することができる。  
**[イベントハンドラ](https://ja.react.dev/learn/adding-interactivity#responding-to-events)関数はコンポーネント内に記述されたコールバック関数である。**
JSXでイベントハンドラを使う際には`{}`内にイベントハンドラ関数を記述する。  
- コンポーネントはイベントハンドラを呼び出すのではなく、関数の参照を渡す。


## State
コンポーネントに状態([state](https://ja.react.dev/learn/state-a-components-memory))を持たせるために`useSate`を使用する。  
`useState`は
-　現在の`state`
- `state`を更新するための関数(setter)
で構成される配列を返す。

イベントハンドラに`state`を更新する関数を記述することで、例えばボタンがクリックされる毎にカウントアップするような処理を実装することができる。

- 同じコンポーネントを複数の場所でレンダリングする場合、それぞれが独自・独立の`state`を持つ。

## Hook
`useState`はReactのビルトイン[`Hook`](https://ja.react.dev/learn/state-a-components-memory#meet-your-first-hook)の一つである。  
**Hookとは`use`で始まる関数である。**
ビルトインのHookは[APIリファレンス](https://ja.react.dev/reference/react)で確認できる。
また、独自のHookを作成することもできる。

- Hookはコンポーネントのトップレベルでのみ呼び出すことができる。

ここではHookの返り値をHookオブジェクトと呼称する。  
Hookオブジェクトを複数のコンポーネントで共有したい場合は、それぞれのコンポーネントの親となるコンポーネントでHookオブジェクトとイベントハンドラを宣言する必要がある。  
親コンポーネントで宣言されたHookオブジェクトとイベントハンドラを子コンポーネントに渡すことで、Hookオブジェクトを複数の子コンポーネントで共有することができる。
![share component](https://ja.react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fsharing_data_parent_clicked.dark.png&w=640&q=75)

この手法を"stateのリフトアップ(持ち上げ)"と呼ぶ。

親コンポーネントから子コンポーネントにはタグの属性を使って情報(オブジェクト, Hookオブジェクトやイベントハンドラ)を渡すことができる。  

**親コンポーネントから子コンポーネントに渡される情報(オブジェクト)を`props`と呼ぶ。**

## UIのツリー
コンポーネントの親子関係を表現する際にはUIのツリーを使う。子を持たないコンポーネントはリーフコンポーネントと呼ぶ。この分類はデータの流れやパフォーマンスを理解する際に有用である。
![UIのツリー](https://ja.react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fgeneric_render_tree.dark.png&w=640&q=75)

## 純粋なコンポーネント
コンポーネントは純粋な関数であるべきである。
純粋な関数とは以下を満たす関数である。
- 呼び出される前の変数を変更しない。
- 同一入力同一出力(参照透過性)
