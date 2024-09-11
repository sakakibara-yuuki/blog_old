---
title: "Typescript x React ハマりどころ"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-2.jpg"
pubDate: 2024-08-22
tags: ["typescript", "react", "error"]
---

# Introduction

## Contents

## 'React' refers to a UMD global

```typescript
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

とすると以下のエラーが出る.

```text
'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.
```

[この記事](https://akamist.com/blog/archives/5188)が詳しい.

### ReSolve

先頭に以下を追加する.

```typescript
import React from "react";
```

もしくは,
`tsconfig`に以下を追加する.

```json
{
  "compilerOptions": {
    <!-- choose "react" or "react-jsx" -->
    "jsx": "react-jsx"
  }
}
```

<details>
    <summary>解説</summary>
17.0以前はjsxがbuild時に`React.createElement`に変換されていた.
そのため, `import React from 'react'`が必須だった.
17.0以降はjsxを別のjsx(`_jsx`関数)へ変換することもできるようになった.
そのため, `import React from 'react'`は不要になった.

ところで, TypeScript で JSX を使う場合, `ts-loader`が jsx を変換する.
TypeScript4.1 以降では jsx から`_jsx`への変換に対応している.
そのため, React17.0 を使用している場合の TypeScript では`tsconfig`に jsx をどのように変換するかを指定する必要がある.

[公式はここ](https://www.typescriptlang.org/docs/handbook/jsx.html)

```json
{
  "compilerOptions": {
    <!-- choose "react" or "react-jsx" -->
    "jsx": "react-jsx"
  }
}
```

**React18 以降, Typescript5.0 以降を使用しているのにもかかわらず, このエラーが出た場合はもしかしたら使用している tsserver が古い可能性がある.**

</details>

## Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'User'

```typescript
interface User {
  name: string;
  age: number;
}

Object.keys(user).map((key: string) => {
  return <div>{user[key]}</div>;
});
```

とすると以下のエラーが出る.

```typescript
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'User'.
  No index signature with a parameter of type 'string' was found on type 'User'.ts(7053)
```

`string`の型の表現は`User`の index として使えないと言われている...
string 型のパラメータを持つ index signature が User 型に見つからないと言われている.
つまり...

```typescript
interface User {
  name: string;
}
```

の name の部分は string 型ではないために, このエラーが出る.
このエラーは少し有名でいくつか対策がある.

### ReSolve

#### object.entries を使う

```typescript
interface User {
  name: string;
  age: number;
}

Object.entries(user).forEach(([key, value]) => {
  return <div>{value}</div>;
});
```

そもそも`user[key]`を使わないので, エラーが出ない.

#### Typeof obj を使う

[Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html#the-keyof-type-operator)を使ってオブジェクトの型の和を生成する.

`typeof user`は`"name" | "age"`と同じ.

```typescript
interface User {
  name: string;
  age: number;
}

Object.keys(user).map((key: string) => {
  return <div>{user[key as typeof user]}</div>;
});
```

ただし, この方法だと型安全性が失われる.

#### index signature を追加する

[index signature](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures)を使って取りうる値を指定する.

```typescript
const user: { [key: string]: string | number } = {
  name: "hoge",
  age: 20,
};
```

これは user に文字の index をつけると`string`か`number`のどちらかを返すという意味.

ただし, index signature は様々な制約があるので, 使いづらい場合もある.

<details>
<summary>解説</summary>

`map`や`for`でも同じ問題が発生する.  
原因は`map`や`for`が"string"を引数に取るためである.  
通常 key は`string`であるが, `obj[key]`はどの型になるか Typescript は正確に推論できない.

例えば,

```typescript
const obj = {
  a: 1,
  b: "b",
  c: true,
};
```

この場合, `obj[key]`は`number | string | boolean`のいずれかになる.
TypeScript はこの不確実性を許容しないためにエラーを出す.

内部でうまいこと`keyof typeof obj`に変換してくれよ と思うかもしれないが, それはできない.  
まず, Typescript が javascript のコードを動かせなければならない, スーパーセットであることが理由だ.
というのも, `keyof typeof obj`にしてしまうと, 余計な`key`が入り込んでしまうおそれがあるからである.

例えば,

```typescript
type Obj = {
  a: () => void;
  b: () => void;
};

const obj = {
  a: () => console.log('a'),
  b: () => console.log('b'),
  c: 'japan'
}

for key in obj {
  const func = obj[key];
  fun(); // ここでエラーがでる!
}
```

このような実行時の型エラーを防ぐために, TypeScript では明示的に型を指定する必要がある.

</details>

## event type

```typescript
function onClick(event) {
  console.log(event.target.value);
}
```

event の型が不明確なためにエラーが出る.

### ReSolve

[DOM イベント](https://ja.react.dev/learn/typescript#typing-dom-events)

公式を読みましょう.

```typescript
event: React.ChangeEvent<HTMLButtonElement>;
```

ここで

```typescript
event: React.MouseEvent<HTMLButtonElement>;
```

~を選んではいけない.~
~なぜか, [こちら](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373)を見ればわかるが, `MouseEvent`は`target`を持たない.~
~それ故, `ChangeEvent`を使う.~

HTMLButtonElement は親をたどれば`SyntheticEvent`を継承しているため, `target`を持っている.

```typescript
event: React.MouseEvent<HTMLButtonElement>;
```

これが正しい.
