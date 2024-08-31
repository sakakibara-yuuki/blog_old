---
title: "React x Atomic Design"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-07-11
tags: ["astro", "math"]
---

# Introduction

~使い方、慣習についてまとめる~
ディレクトリレイアウトとAtomic Desginについてまとめる.

## Contents

## File Structure

[File Structure – React](https://legacy.reactjs.org/docs/faq-structure.html)にあるように、Reactプロジェクトではコンポーネントをどこに配置するかについてのルールは無い。
しかし、よく使用されるパターンが2つあるので、それを紹介する。

### パターン1: 機能・ルーティングによる分類

js, css, testファイルを機能やルーティング毎に分類する。
粒度はプロジェクト次第。

```bash
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

### パターン2: ファイルタイプによる分類

似ている役割を果たすファイル毎に分類する。

```bash
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

さらに、コンポーネントの種類によってフォルダを分けることもある。(パターン2を適用した後にパターン1を適用する感じ, 多分)
これは[Atomic Design | Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)に発展する。

どちらにも共通する注意点として以下がある。

- ディレクトリ階層は浅く(3~4階層に)保つ。深くなりすぎると、コンポーネントの再利用が難しくなる。
- こだわりすぎない。はじめてから5分も考えるのは無駄。どっちかで初めてみて、必要に応じて変更する。

なお、個人プロジェクトではパターン1から初めてパターン2へ移行することを選択する。

## コンポーネント設計

### Presentational Component and Container Component

Atomic Designの前に,　コンポーネントを分割する考え方を紹介する.
それらはコンポーネントを２つの側面から見る.  
つまり, 外見と動作である.

#### Presentational Component

Presentational Componentは外見を担当するコンポーネントである.  
スタイリングされており,
propsを受け取り、それを表示するだけの最小限の機能をもつ.

```typescript
type ButtonProps = {
  label: string;
  text: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export function Button(props: ButtonProps) {
  const { label, text, disabled, onClick } = props;
  return (
    <div>
      <span>{label}</span>
      <button disabled={disabled} onClick={onClick}>
        {text}
      </button>
    </div>
  );
}
```

#### Container Component

Container Componentは動作を担当するコンポーネントである。

ここではデザインについて一切考えず, Presentational Componentにデータを渡す.

また, Hooksをつかって, 振る舞いを実装し, ContextやReduxを使ってデータを管理する.

```typescript
import { useSate, useCallback } from "react";
import { Button } from "./Button";

function usePopup() {
  const cb = useCallback((text: string) => {
    prompt(text);
  }, []);
  return cb;
}

type CountButtonProps = {
  label: string;
  maximum: number;
};

export function CountButton(props: CountButtonProps) {
  const { label, maximum } = props;
  const displayPopup = usePopup();
  const [count, setCount] = useState(0);

  const onClick = useCallback(() => {
    const newCount = count + 1;
    setCount(newCount);

    if (newCount >= maximum) {
      displayPopup("You've clicked ${newCount} times!");
    }
  }, [count, maximum]);

  const disabled = count >= maximum;
  const text = disabled ? "Maximum" : "Click me!";
  return <Button label={label} text={text} disabled={disabled} onClick={onClick} />;
}
```

この例では, Container ComponentはPresentational Componentの親であり, Presentational Component はContainer Componentから渡されたpropsを使って表示を行っている.

このように外見と動作を分離することで, コンポーネントの可読性や再利用性が向上する.

### Atomic Design

Atomic DesignとはBrad Frostが考案したデザインシステムである。
画面を5段階に分割し、それを組み合わせることでUIを構築する。
根底にはコンポーネント化された要素が画面を構成しているという考え方があり, Reactとの相性が良い。しかし, ReactやVue専用のツールなどではない。
もともとはデザインの場面で考えられてきた概念である.

| 階層     | 説明                                                                                          |
| -------- | --------------------------------------------------------------------------------------------- |
| Atom     | ボタンやテキストフィールドなどのこれ以上分割できない最小単位の要素                            |
| Molecule | Atomを組み合わせたもの。アイコン+メニューや、プロフィール画像+テキストbox, iconのリンク集など |
| Organism | AtomやMoleculeを組み合わせたもの。サイドメニュー, ツイート入力エリアなど                      |
| Template | ページのレイアウトのみを表現する要素。Organismを配置するだけ。実際のデータを持たない。        |
| Page     | 最終的に表示される1画面                                                                       |

#### Atom

- Atomsは状態や振る舞いを持たない.
- 文章, 色, 大きさなどの描画に関する情報はPropsで渡される.
- 大きさも親コンポーネントから制御できるように, propsで渡す
  - CSSの[内在サイズ](https://developer.mozilla.org/ja/docs/Glossary/Intrinsic_Size)(max-contentなど)を使わないことが多い.
- 特定のドメインに依存せず, 汎用的に利用できるコンポーネント.

Atomsはデザインの最小単位であり, ボタンやテキストなどこれ以上分割できない要素
を指す.

Presentational Componentと同じように, 振る舞いについては考えず, 外見を担当するコンポーネントである.  
しかし, Presentational Component とは異なり**色・フォント・レイアウトなどのデザインについては考えない.**

#### Molecule

- Moleculeは状態や振る舞いをもたない.
- Atomsのレイアウトを担当する.
- Moleculeで担う役割は一つ.

MoleculeはAtomsを組み合わせたものであり, 一つの機能を持つコンポーネントである.

Presentational Componentと同じように, 振る舞いについては考えず, 外見を担当するコンポーネントである.  
しかし, Presentational Component とは異なり**色・フォントなどのデザインについては考えない.**

#### Organism

- Organismは独自の状態や振る舞い・外見を持つ.
- **外見をもつOrganismはPresentational Componentとして作成する.**
- **振る舞いをもつOrganismはContainer Componentとして作成する.**

Organismは必ずしも単一のファイルで構成されるとは限らない.

#### Template

- ページ全体のレイアウトを担当する.

複数のOrganismを配置し, CSSでレイアウトを調整する.

#### Page

- router, API通信などのロジックを持つ.

<!-- ## Global State Management( Recoil ) -->
<!-- ## Json Place Holder -->
