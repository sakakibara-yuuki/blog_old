---
title: "Reactのlifecycleについて"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-11-04
tags: ["astro", "math"]
---

# Introduction

Reactのコンポーネントはstateを保持しているが, それはライフサイクルが終わるとstateが消えてしまう.
現在, Functional Componentが推奨されており, lifecycleを意識することは少なくなっている.
しかし, Hooksを使う場合には新しいlifecycleを考慮する必要がある.
そしてそれはReact Componentのlifecycleを理解しておくこともHooksのlifecycleを理解する上で助けになるだろう.

## Contents

## Functional 以前の Lifecycle

コンポーネントは`constructor`が呼ばれ, `render`が呼ばれ, 画面上に表示される.
そして, イベントなどでstateが変更されると`render`が呼び出される.
この一連の流れはlifecycleの一部である.

`constructor`, `render`以外にもライフサイクルに関するメソッドが大きく3つある.

1. Mounting
2. Updating
3. Unmounting

Mountingはコンポーネントが生成される時に呼ばれる.
Updatingはコンポーネントが更新される時に呼ばれる.
Unmountingはコンポーネントが破棄される時に呼ばれる.
それぞれについて詳しく説明していく.

### Mounting

#### componentDidMount

このメソッドはい最初の`render`が実行された後に呼ばれる.
そのため, DOMアクセスが可能で, 要素に対する初期化なども行うことができる.
クライアントサイドだけで実行される.

### Updating

#### shouldComponentUpdate

#### componentDidUpdate

### Unmounting

#### componentWillUnmount

#### getDerivedStateFromProps

## EffectのLifecycle

Functional Componentは事実上ただの関数であるため, 上記のようなライフサイクルを持たない.
しかし, Effectを使った場合にライフサイクルの理解が困難になる.
クラスコンポーネントの場合, コンポーネントはMouting, Updating, Unmountingの3つのライフサイクルに分けられる.
それに対して, Effectはコンポーネントのライフサイクルから独立して考える必要がある.
Effectのライフサイクルは"同期の開始・停止"の2つしかない.
propsやstateが変更される度, このサイクルが回り続ける.

以下の例をみてみよう.
以下はチャットルームに入った`roomId`の変更に応じて, サーバーとの接続を開始するコンポーネントである.

```javascript
const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

"同期の開始"はこの部分である.

```javascript
const connection = createConnection(serverUrl, roomId);
connection.connect();
```

ここで, サーバーとの接続を開始している.

また, "同期の停止"は`return`の部分である.
`return`内部に書かれるこの処理をクリーンアップ関数と呼ぶ.

```javascript
connection.disconnect();
```

ここで, サーバーとの接続を切断している.

これが実際にどう動くのかをみていく.

1. `roomId`が変更される
2. 同期の開始がよばれる
3. 再度, `roomId`が変更される
4. 同期の停止がよばれ, 開始がよばれる
5. 再度, `roomId`が変更される
6. 同期の停止がよばれ, 開始がよばれる
   ...

そう, returnが呼ばれる手前のタイミングで処理が街状態になるのである.

ここからわかることは**Effectは同期処理**であるということである.
また, 1つのEffectには1つの役割を持たせるべきである.
異なる内容の同期の開始を行うと, 依存配列の変更や追加によって, 予期せぬ動作を引き起こす可能性があるからである.

### 変更検知の仕組み

`roomId`は依存配列に格納されているため, その変更が検知される.

コンポーネントが再レンダーされる度, Reactは新しい依存配列を確認し, 前回の配列と同じ場所に同じ値があるかを確認する.
この比較は[`Object.is`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is)を使って行われる.

### 空の依存配列

依存配列が空の場合, どうなるのだろう.
答えは単純に呼ばれる. である.
複雑に言ってしまえば, 上の例で, Mounting時に接続され, Unmoounting時に切断する.

```javascript
import { useState, useEffect } from "react";
import { createConnection } from "./chat.js";

const serverUrl = "https://localhost:1234";
const roomId = "general";

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? "Close chat" : "Open chat"}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

`show`が切り替わるたびに, `ChatRoom`がマウントされたり, アンマウントされたりする.
マウントされる度に接続され, アンマウントされる度に切断される.

### リアクティブな値

典型的なりアクティブな値(時間変化する値)は, `state`や`props`である.
しかし, これらから導出される値もまた, リアクティブな値になる.
以下の例では`serverUrl`は`state`でも`props`でも無いが, リアクティブな値である.

```javascript
function ChatRoom({ roomId, selectedServerUrl }) {
  // roomId はリアクティブ
  const settings = useContext(SettingsContext); // settings はリアクティブ
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl はリアクティブ
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // エフェクトは roomId と serverUrl を利用している
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // そのため、どちらかが変更された場合は再同期が必要！
  // ...
}
```

### linterとリアクティブな値

リアクティブな値が依存配列に含まれていない場合, eslintなどがエラーをだすことがある.

```javascript
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Something's wrong here!
```

Effectの内部で`serverUrl`, `roomId`をつかっているため, これらがリアクティブな値である可能性があるので, 依存配列に含めるべきである.

逆に, 内部で固定値として定義してしまえばその限りではない.

```javascript
function ChatRoom() {
  useEffect(() => {
    const serverUrl = "https://localhost:1234"; // serverUrl is not reactive
    const roomId = "general"; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

### 参考

- [公式](https://ja.react.dev/learn/lifecycle-of-reactive-effects)
- [アホみたいに助かる記事](https://zenn.dev/yodaka/articles/7c3dca006eba7d#discuss)
