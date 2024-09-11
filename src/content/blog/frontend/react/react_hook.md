---
title: "React Hook"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-08-31
updatedDate: 2024-09-01
tags: ["react", "hook"]
---

# Introduction

useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef, useImperativeHandle, useLayoutEffect, useDebugValue,...

これらが React の Hook であり, これらが React の大きな機能を提供している.
そこで, 最初に custom hook について説明する.
そこから custom hook の部品としての観点から, それぞれの hook について説明する.

## Contents

## React と 型

custom hook について説明する前に, React と TypeScript について説明する.
TypeScript は JSX をサポートしており, `@types/react`と`@types/react-dom`をインストールすることで, React の型を使うことができる.

```bash
npm i @types/react @types/react-dom
```

<!-- - コンポーネントは`JSX.Element`を返す関数である. -->
<!-- - children は`React.ReactNode`型である. -->

### props Object の型

通常, コンポーネントの props を記述するには`interface`か`type`を使う.

```typescript
interface MyButtonProps {
  title: string;
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return <button disabled={disabled}>{title}</button>;
}
```

### Hook の型

```typescript
const [enabled, setEnabled] = useState(true);
const [enabled, setEnabled] = useState<boolean>(true);
```

最初の例でも`enabled`は`boolean`型が割り当てられ, また, `setEnabled`は引数として`boolean`型を受け取る関数であると推測される.

２番めの例でも, 明示的に型を指定することができる.
この例をさらに有効にするケースとして以下がある.

```typescript
type Status = "idle" | "loading" | "success" | "error";
const [state, setState] = useState<Status>("idle");
```

この例ではリテラル型を使って, state が特定の文字列のみを受け入れるようにしている.

## Custom Hooks

custom Hooks の例

```typescript
import { useState, useEffect } from "react";

function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // イベントリスナーの登録
    function handleOnline(): void {
      setIsOnline(true);
    }

    function handleOffline(): void {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
}
```

これは以下のように使うことができる.

```typescript
import { useOnlineStatus } from "./useOnlineStatus.tsx";

function StatusBar(): JSX.Element {
  const isOnline = useOnlineStatus();
  return <div>{isOnline ? "Online" : "Offline"}</div>;
}
```

また, 別の例としては,
テキストボックスに文字を入力して, 入力された文字を表示する custom hook がある.
custom hook は use で始まる名前にすることが要請されている.

```typescript
import React, { useState, useCallback, useDebugValue } from "react";

function useInput() {
  const [state, setState] = useState<string>("");

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
  }, []);

  useDebugValue(`Input: ${state}`);
  return [state, onChange] as const;
}

export function Input(): JSX.Element {
  const [text, onChangeText] = useInput();
  return (
    <div>
      <input value={text} onChange={onChangeText} />
      <p>Input: {text}</p>
    </div>
  );
}
```

`useInput`では, input 要素の`onChange`がよばれたら内部の状態を更新するために, `useState`と`useCallback`を使っている.  
`Input`コンポーネントは, `useInput`を使って input 要素を表示している.  
このコードを動かすと, 入力された内容が input 要素の下に表示される.

また, `useDebugValue`を使って, デバッグ時に状態を表示することができる.
これは, React DevTools(ブラウザの拡張機能)を使って, デバッグ時に状態を確認するためのものである.

custom hook を使うことで, 関数コンポーネントの hook のロジックをまとめることができ, コードの可読性が高まるだけではなく, 複数のコンポーネントで同じロジックを使いまわすことができる.

## useState

[state の管理](https://ja.react.dev/learn/managing-state)
[state 構造の選択](https://ja.react.dev/learn/choosing-the-state-structure#principles-for-structuring-state)

## useEffect

## useCallBack
