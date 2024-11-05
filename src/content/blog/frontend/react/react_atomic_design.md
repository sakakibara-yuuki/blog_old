---
title: "React x Atomic Design"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-07-11
tags: ["react", "atomic design"]
---

# Introduction

~使い方、慣習についてまとめる~
ディレクトリレイアウトとAtomic Desginについてまとめる.

## Contents

<!-- ## File Structure -->
<!---->
<!-- [File Structure – React](https://legacy.reactjs.org/docs/faq-structure.html)にあるように、Reactプロジェクトではコンポーネントをどこに配置するかについてのルールは無い。 -->
<!-- しかし、よく使用されるパターンが2つあるので、それを紹介する。 -->
<!---->
<!-- ### パターン1: 機能・ルーティングによる分類 -->
<!---->
<!-- js, css, testファイルを機能やルーティング毎に分類する。 -->
<!-- 粒度はプロジェクト次第。 -->
<!---->
<!-- ```bash -->
<!-- common/ -->
<!--   Avatar.js -->
<!--   Avatar.css -->
<!--   APIUtils.js -->
<!--   APIUtils.test.js -->
<!-- feed/ -->
<!--   index.js -->
<!--   Feed.js -->
<!--   Feed.css -->
<!--   FeedStory.js -->
<!--   FeedStory.test.js -->
<!--   FeedAPI.js -->
<!-- profile/ -->
<!--   index.js -->
<!--   Profile.js -->
<!--   ProfileHeader.js -->
<!--   ProfileHeader.css -->
<!--   ProfileAPI.js -->
<!-- ``` -->
<!---->
<!-- ### パターン2: ファイルタイプによる分類 -->
<!---->
<!-- 似ている役割を果たすファイル毎に分類する。 -->
<!---->
<!-- ```bash -->
<!-- api/ -->
<!--   APIUtils.js -->
<!--   APIUtils.test.js -->
<!--   ProfileAPI.js -->
<!--   UserAPI.js -->
<!-- components/ -->
<!--   Avatar.js -->
<!--   Avatar.css -->
<!--   Feed.js -->
<!--   Feed.css -->
<!--   FeedStory.js -->
<!--   FeedStory.test.js -->
<!--   Profile.js -->
<!--   ProfileHeader.js -->
<!--   ProfileHeader.css -->
<!-- ``` -->
<!---->
<!-- さらに、コンポーネントの種類によってフォルダを分けることもある。(パターン2を適用した後にパターン1を適用する感じ, 多分) -->
<!-- これは[Atomic Design | Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/)に発展する。 -->
<!---->
<!-- どちらにも共通する注意点として以下がある。 -->
<!---->
<!-- - ディレクトリ階層は浅く(3~4階層に)保つ。深くなりすぎると、コンポーネントの再利用が難しくなる。 -->
<!-- - こだわりすぎない。はじめてから5分も考えるのは無駄。どっちかで初めてみて、必要に応じて変更する。 -->
<!---->
<!-- なお、個人プロジェクトではパターン1から初めてパターン2へ移行することを選択する。 -->

## コンポーネント設計

### Presentational Component and Container Component

Atomic Designの前に,　コンポーネントを分割する考え方を紹介する.  
この考え方はコンポーネントを外見と動作という2つの側面から見る.  

#### Presentational Component

Presentational Componentは外見を担当するコンポーネントである.  
このコンポーネントは
- スタイリングされ
- propsを受け取り
- 表示する

といった最小限の機能をもつ.

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

このコンポーネントではデザインについて一切考えず,
- Presentational Componentにデータを渡し
- Hooksによる振る舞いを実装し
- ContextやReduxを使ってデータを管理する.

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

この例では, Container ComponentはPresentational Componentの親であり, 子であるPresentational Component は親であるContainer Componentから渡されたpropsを使って表示を行っている.

このように外見と動作を分離することで, コンポーネントの可読性や再利用性が向上する.

## Atomic Design

Atomic DesignとはBrad Frostが考案したデザインシステムである.
もともとはデザインの場面で考えられてきた概念であり, ReactやVue専用のツールなどではない. デザインの設計に関する思想である.  
Atomic Designでは画面を5段階に分割し、それを組み合わせることでUIを構築する.
思想の源流に"画面はコンポーネント化された要素によって構成されている"という考え方がある. この思想は Reactとの相性が良い.  
なお, Atomic Designは前述したPresentational / Container Componentの考え方とは別ものとして考えたほうが良い. また, Atomic Designはあくまで思想であるため, 必ずしも厳密に実際に適用する必要は無い.

また, そもそもReactのコンポーネントの利点は再利用性があることである.
Webでは特定のインターフェースを様々な箇所で何度も使いまわすことが多い.
それぞれのコンポーネントがバラバラになってしまうと, 保守性が下がる.

<!-- | 階層     | 説明                                                                                          | -->
<!-- | -------- | --------------------------------------------------------------------------------------------- | -->
<!-- | Atom     | ボタンやテキストフィールドなどのこれ以上分割できない最小単位の要素                            | -->
<!-- | Molecule | Atomを組み合わせたもの。アイコン+メニューや、プロフィール画像+テキストbox, iconのリンク集など | -->
<!-- | Organism | AtomやMoleculeを組み合わせたもの。サイドメニュー, ツイート入力エリアなど                      | -->
<!-- | Template | ページのレイアウトのみを表現する要素。Organismを配置するだけ。実際のデータを持たない。        | -->
<!-- | Page     | 最終的に表示される1画面                                                                       | -->

### Atom

AtomsはAtomic Designの最下層に位置するコンポーネントである.
ボタンやテキストなどこれ以上分割できない要素を指す.

Atomsは以下の特徴を持つ.
- 状態や振る舞いを持たない.
- 文章, 色, 大きさなどの描画に関する情報はPropsで渡される.
  - CSSの[内在サイズ](https://developer.mozilla.org/ja/docs/Glossary/Intrinsic_Size)(max-contentなど)を使わないことが多い.
- 特定のドメインに依存せず, 汎用的に利用できる.

Atomsでは**色・フォント・レイアウトなどのデザインについては考えない**.  

:::note{.warning}
ただし, 原子に電子数などの定数が定められているように, フォントサイズなどの具体的なプロパティについては考える. という宗派もある.
:::

:::note{.tip}
よく, デザインからコンポーネントを切り出していると, Atomsだらけになってしまうことがある.  
"Atoms = 最小単位"という定義から何がAtomsに該当するかが切り出しやすいことが原因に思える. だが, これは誤解(?)である.  
Atomic Design全体に言えることだが, これらの分割はあくまで再利用性を高めるためのものであり, 再利用される予定が無いコンポーネントは分割する必要は無い.
むしろ, 無理に分割することで保守性が下がるので過剰な分割は控えるべきである.
:::


### Molecule
Moleculesは複数のAtoms, Moleculesを組み合わせたものであり, 単一の機能を持つコンポーネントである.

テキストボックスなどがこれに該当する.

Moleculesは以下の特徴を持つ.
- 状態や振る舞いをもたない.
- Atomsのレイアウトを担当する.
- Moleculesで担う役割は一つ.

MoleculesはAtomsとは異なり**レイアウトついてのみ考える.**

:::note{.warning}
ただし, 再利用性が保たれていることが重要である. また, moleculesはそれ単体で操作の仕方がわかるようになっていることが望ましい.  
他の箇所での再利用性が難しくなってしまうため, 可能な状態であることが望ましい.
:::

### Organisms
Organismsはより具体的な機能を持つコンポーネントである.
この意味において, Organismsが無いページは存在しない.  
意外と小さなカードやフォーム, ヘッダーやフッターなどがこれに該当する.  
Organismsではドメイン知識に依存したデータを受け取ったり, コンテキストを参照したりといった独自の振る舞いを持つ.

Organismsは以下の特徴を持つ.
- 独自の状態や振る舞い・外見を持つ.
- 外見をもつOrganismsはPresentational Componentとして作成する.
- 振る舞いをもつOrganismsはContainer Componentとして作成する.

Organismsは必ずしも単一のファイルで構成されるとは限らず,
Presentational ComponentとContainer Componentに分割することもある.

:::note{.warning}
OrganismsはAtomsやMoleculesを利用して作られるが, 必ずしもMoleculesをを利用する必要はない. つまり, Atomsを直接利用するOrganismsもある.
ここで重要なのが, Organismsはそこまで再利用性を重視する必要が無いということである.
よく使用されるOrganismsはECサイトの商品一覧などのように商品のカードはMoleculesで構成されていて, それらをOrganismsでまとめるようなものである.
:::

### Template
いわゆるワイヤーフレームと同じ, ページに表示する実データが反映される前の状態を指す. ページ構造やレイアウト構成などを説明するためのレイヤーである.

- ページ全体のレイアウトを担当する.

複数のOrganismを配置し, CSSでレイアウトを調整する.

Templateは具体性のあるコンテンツが取り除かれているため, ページの"コンテンツ構造"に焦点を当てている.
Templateによって各コンポーネントがどのように表示されて, どのように動作するのかを考えることができる.
ユーザーの視点でデザインやマーケティング的な要素を確認することもTemplateがあることで可能になる.

### Page
PageはTemplateに対して実データを反映させた状態のものをいう.
ある種, Pageはプログラミング的にはPageはTemplateのインスタンスにであると言える.

レイアウトはTemplateで済ましているので, ここでは状態の管理, ルーターの処理, API通信, Contextの作成などの振る舞いを持つ.

- router, API通信などのロジックを持つ.

## 次へ
- [ReactのAtomic Designのベストプラクティスについて](../react/react_atomic_design_bestpractice)

