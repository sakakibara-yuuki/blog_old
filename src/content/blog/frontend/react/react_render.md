---
title: 'Reactによる描画'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-09-29
tags: ["frontend", "react"]
---

# Introduction

## Contents
## レンダーとは
**レンダー**とは, Reactがコンポーネント(関数)を呼び出すことを指す.
注意すべきは, レンダーとは動作に対する単語であり, レンダーというオブジェクトやクラスがあるというわけではないのである.
使うなら, レンダーする. のようにサ変変格活用として運用することになるだろう.

さて, あるコンポーネントがレンダーされるケースには2つある.
1. 初回レンダー
2. stateのsetter関数が呼び出されたとき

これらのケースにおいて, Reactはレンダーのトリガーを引く.

### 初回レンダー
初回レンダーに関しては, あまり意識する必要はない.
とはいえ, Reactのみでアプリなどを作る場合, この初回レンダーを見かけることはあるだろう.

```jsx
import { createRoot } from 'react-dom';
const root = createRoot(document.getElementById('root'));
root.render(
<StrictMode>
  <App />
</StrictMode>
);
```

こんなふうにして使われる.
`createRoot`という関数を呼び出すことにより, レンダーのトリガーを引く.

### stateの更新
stateのsetter関数が呼び出されるとき, Reactはレンダーのトリガーを引く.
stateがsetter関数によって更新されると, レンダーが(おそらくタスクキューに)キューイングされる.

## レンダーの後に
レンダーが呼ばれた後, ReactはDOMを更新する.
1. 初回レンダー時には, まだDOMがないので, `appendChild`などでDOMを追加する.
1. 再レンダー時には, すでにDOMがあるので, 更新された部分だけを更新する.

再レンダー時には, 内部で保持している仮想DOMとレンダー後の仮想DOMを比較し, その差分のみをリアルDOMに反映する.

