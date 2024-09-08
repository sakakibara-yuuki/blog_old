---
title: "CSS MDNの読み方と対応"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-09-06
updatedDate: 2024-09-06
tags: ["css", "MDN"]
---

# Introduction

HTML, CSS, JavaScriptのリファレンスとして有名なページとして
[MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/CSS)がある.

今回はそのMDNのCSSのリファレンスの読み方につてまとめる.
また, MDNの記事とその内容について自分が解釈した記事のリンクをまとめる.
- [HTML要素リファレンス](https://developer.mozilla.org/ja/docs/Web/HTML/Element)
などもあるが, これは今度まとめる.

## Contents

## MDN

特に, 参照すべきは[リファレンス](https://developer.mozilla.org/ja/docs/Web/CSS#%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9)の項目である.

ここにはCSSのリファレンスで説明される用語や概念が纏められている.
この項目には`CSSのリファレンス`と`CSSの主要な概念`という2つの項目があるが, まずは`CSSの主要な概念`を読むと良い.

次に, [Cook Book](https://developer.mozilla.org/ja/docs/Web/CSS/Layout_cookbook)
という項目も参照すると良い.  
ここにはCSSを使ったレイアウトの実装方法が纏められている.  
何かを実装しようと思った際には, まずはここを参照すると良い.

また, [CSS を使ってよくある問題を解決する](https://developer.mozilla.org/ja/docs/Learn/CSS/Howto)
も参照すると良い.

```bash
MDN
├── チュートリアル
│   ├── CSS 学習領域
│   ├── CSSの第一歩
│   ├── CSSの構成要素
│   ├── CSS テキスト装飾
│   ├── CSS レイアウト
│   └── CSSを使ってよくある問題を解決する
├── CSSの主要な概念
│   ├── 言語の構文と書式
│   ├── 詳細度と継承とカスケード
│   ├── CSS 単位と値および関数記法
│   ├── ボックスモデルとマージンの相殺
│   ├── 包含ブロック
│   ├── 重ね合わせとブロック整形コンテキスト
│   ├── 初期値、計算値、使用値、実効値
│   ├── CSS 一括指定プロパティ
│   ├── CSS フレックスボックスレイアウト
│   ├── CSS グリッドレイアウト
│   ├── CSS セレクター
│   ├── メディアクエリー
│   └── アニメーション
├── リファレンス
└── 料理帳
    ├── カード
    ├── グリッドラッパー
    ├── ナビゲーションの分割
    ├── バッジ付きリストグループ
    ├── パンくずナビゲーション
    ├── ページ付け
    ├── メディアオブジェクト
    ├── 張り付くフッター
    ├── 欄
    └── 要素を中央に配置

```

### CSSの主要な概念

- 言語の構文と書式
- 詳細度と継承とカスケード
- CSS 単位と値および関数記法
- ボックスモデルとマージンの相殺
  - [ボックスモデル](../css_boxmodel)
  - [ボックスモデル2](../css_boxmodel_2)
- 包含ブロック
- 重ね合わせとブロック整形コンテキスト
- 初期値、計算値、使用値、実効値
- CSS 一括指定プロパティ
- CSS フレックスボックスレイアウト
- CSS グリッドレイアウト
  - [CSS Grid Layout](../css_grid_layout)
- CSS セレクター
  - [CSS 結合子](../css_combinator)
  - [CSS セレクタ](../css_selector)
  - [CSS 疑似要素](../css_pesudo)
- メディアクエリー
- アニメーション
