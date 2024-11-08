---
title: 'React x Atomic Design / Best Practice'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-11-04
tags: ["astro", "math"]
---

# React x Atomic Design / Best Practice
Atomic Designに関する基礎を理解しても, どの粒度で分割すればよいか. どのような情報をコンポーネントに持たせるべきか. どのようにスタイリングを行うべきか. などの問題が生じる.
この記事ではAtomic Designを用いたReactコンポーネントの設計においてのベストプラクティスを紹介する.

## Contents
## 基本的な方針
以下ではAtomic Designを用いたReactコンポーネントの設計においてのベストプラクティスを紹介する.
特に
- スタイリング
- レイアウト
の観点から紹介する.

### スタイリング
Atomic Designを採用したコンポーネントの設計をする上での一つの困難として
どの情報をコンポーネントに持たせるかがある.

コンポーネントは再利用されることが前提にある.
そのため, 基本的にコンポーネントが持つ情報は**使用場面に依存しないような情報**に限定されるべきである.  
"保存を示す"ボタンが使用される場面のどこでも青色であるならば, その色情報はコンポーネントに持たせるべきである.
また, コンポーネントのスタイリングでもう一つ注意すべき観点として, コンポーネントが変化するUIであるという点がある.
ホバー, クリック, フォーカスなどの状態によってスタイルが変化するコンポーネントはその変化に耐えられるように設計されるべきである.
コンポーネントが持つ固有の情報とコンポーネントが使われる際に変化する情報を分けて考えることが重要である.

また, これはCSSの設計においても同様であるが, 様々なデバイスを通して表示されるように, 各要素のデザインをする際に固定値を使用することは推奨されない.

### レイアウト
何度も繰り返すが, コンポーネントは再利用されることが前提にある.
そのため, コンポーネント自身にレイアウト情報をもたせることは避けるべきである.
例えば, 右側にmarginをとったコンポーネントを作成すれば, そのコンポーネントは右側にmarginをとらないコンポーネントとしては利用できない.  

CSSでは自身のスタイリングに関する情報とその内部のレイアウトに関する情報に大別される.
コンポーネントにレイアウトに関するプロパティを持たせない最も単純な回避策は, wrapperを要素を使用することである.
```html
// Good
.layout {
    margin-right: 10px;
}

<div class="layout">
    <Component />
</div>
```
MoleculesやOrganismsのコンポーネントを作成する際には, CSSのカスケード性を利用してその子コンポーネントのレイアウトに関する情報を親コンポーネントに持たせることができる.

この手法はAtomic Designベースの"APBCCSS"の手法である.

```html
.user .button {
    margin-right: 10px;
}
// Atoms
<div class="button"> ... </div>

// Molecules
<div class="user">
    <Button />
</div>
```

同様に, Organismsなどにおいては`flex`や`grid`を使用してレイアウトを行うことが多い.

### 手をつける順番
デザインが作成されたらどこから手をつけるべきか.
Atomsなどから手をつけることが良いか, Templatesなどの全体像から手をつけるべきか.
Atomic DesignはAtomsから語られることも多く, 実際のプロダクトでもAtomsから作成することが王道のように感じる. しかし, Atomsからの作成は, どこでそのコンポーネントが再利用されるかの予測が難しく, また, 細かいデザインに視野が狭まりがちである.

**おすすめは, Templatesから手をつけることである**.
Templates(ワイヤーフレーム)からOrganismsに分解していく.
Templatesから手をつけることで, どのコンポーネントが再利用されるかと言った問題や細かいデザインに視野が狭まるといった問題を回避することができる.  
この工程でOrganismsの間で不要な依存関係が発生していないかをチェックする.
これにより, どのコンポーネントから実装していくかの優先順位を決めることもできる.  
Organismsをいくつか並べてみると, いくつか共通部分が見えてくる.
これをMoleculesとして切り出し, 必要な部分はAtomsとして切り出す.  
この作成方法であれば, 過剰にコンポーネントを増やすこともなく, 再利用性の高いコンポーネントを作成することができる.

注意として, ユーザーが自由にコンポーネントを並べられるダッシュボード型のようなデザインはこの逆で作成すると良い.

また, 協業の観点から多くのデザイナーはワイヤーフレームから作成し, その後に細かい調整を行うことが多い.
Templatesから手をつけることで, その作成手順に沿うことになり, デザイナーの意図を理解しやすくなる.

## Molecules / Organisms と Templates / Pages の違い
Atomic Designはあくまで推奨される設計手法であり, あまりこだわる必要はない.
それでも, Molecules / Organisms と Templates / Pages の違いについてわからなくなることがある.
### Molecules / Organisms
この２つは実装で求められることはほとんど同じである.
どちらも複数のコンポーネントを含み, PropsやStateを管理する.
しかし, 特に再利用性に関してMoleculesのほうが高い.
- Molecules
  - 再利用性が高い
  - UIライブラリのコンポーネント一覧に掲載されているようなコンポーネント
  - コンテキストに依存しない
- Organisms
  - 単体でも独立したコンテンツとして機能する
  - Webページのコンテンツそのもの

Organisms(組織)は, その名の通り, 自立・独立していることが求められる.
対して, Molecules(分子)は, パーツであるという意味合いが強い.  
つまり, **それぞれの違いを決定付けるのはUI上でどのようなビジュアルを持つかということではなく, どのように機能するかということである**.

### Templates / Pages
そもそもPagesやTemplatesを用いいない場合もあり, 先程とは逆の意味で(あまり意識することが無い所以に)分別が難しい.
基本的にはTemplatesはワイヤーフレームとして実現し, それにデータを流し込むことでPagesを作成する.

## アンチパターン
### 荒すぎるコンポーネント
コンポーネントの一つのアンチパターンとして, 一つのコンポーネントが複数の役割を持つというものがある.
このようなコンポーネントは再利用性が低く, また, 保守が難しくなる.
Atomic Designに倣うことでそれぞれの役割に沿ったコンポーネントを作成することで, こうした破綻を防ぐことができる.

### 細かすぎるコンポーネント
Atomic Designは自然と管理すべきコンポーネントの数が多くなりがちである.
これは管理，保守の難しさに繋がる. そのため, 現実的な妥協点を見極めることが重要となる.
特に, (Templatesからではなく)Atomsからコンポーネントを作成した場合によく生じる問題である.

コンポーネントを分割して作成することが良いことに変わりは無いが, 必ずしも多くのコンポーネントに分割することが正解とは限らない.
将来的な効率化を過度に考えすぎて細かい粒度でコンポーネントを作成したが, 結局追加開発は行われなかった...となれば徒労になる.

そもそも予め必要な要素を完璧に把握してAtomsやMoleculesを作成することは難しい.

特にAtomsはその分類が簡単で, 最小単位であることから厳密に実装すると大量のAtomsが発生する.
再利用性が無い, 一箇所でしか使われないコンポーネントはコンポーネントとして分割する意味は無い.
そのコンポーネントが再利用するかどうかを考えると, 過剰なコンポーネントの作成を避けることができる.

## プロジェクト構成の例
その1.
```bash
src
├── index.js
├── container
│   ├── footer.js
│   └── header.js
└── presentational
    ├── atoms
    │   ├── button.js
    │   └── checkbox.js
    └── molecules
        ├── searchbox.js
        └── searchbutton.js
```
このディレクトリレイアウトでは, 大きく,
`container`と`presentational`に分けられている.
`container`にはおおよそOrganismsに対応するコンポーネントが配置され, `index.js`がTemplatesとPagesに対応している.
`presentational`はAtomsやMoleculesに対応している.
Organismsは採用していない.


その2.
```bash
src
├── index.js
├── container
│   ├── organisms
│   │   ├── footer.js
│   │   └── header.js
│   └── templates
│       ├── 404.js
│       └── top.js
└── presentational
    ├── ...
    └── ...
```
先程と同様に, `container`と`presentational`に分けられている.
この場合, `index.js`は単なるルートファイルとして存在し, どのTemplatesを表示するかを決定する.
`container`はOrganismsとTemplatesに分けられており, `presentational`はその1と同じである.


その3.
```bash
src
├── index.js
├── components
│   ├── container
│   └── presentational
└── modules
    ├── bar.js
    └── foo.js
```
この例では, 
`components`ディレクトリと`modules`ディレクトリが存在する.
`modules`はUIとは独立した処理を持ちたい場合に使う. `modules`は`hooks`や`context`などが配置されることが多い.

`components`ディレクトリは`container`と`presentational`に分かれており, その2と同じ構成である.

その4.
```bash
src
├── index.js
├── components
│   ├── atoms
│   ├── molecules
│   ├── organisms
│   └── templates
└── modules
    ├── bar.js
    └── foo.js
```
これは独自の構成であり, その3から`container`や`presentational`の区別をなくしたものである.
`atoms`や`molecules`などが`presentational`に対応することを暗黙の前提として用いている.

また, storybookを使用する場合など, 以下のような構成もある.
```bash
atoms
└── button
    ├── index.js
    └── index.stories.js
```

<!--APCBSS-->
<!-- ## Global State Management( Recoil ) -->
<!-- ## Json Place Holder -->
