---
title: "HTMLの基本"
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/web/html/html_basic.png'
pubDate: 2024-06-14
tags: ["html", "基本", "基礎"]
---

# HTMLのメモ
HTMLで自分がつまづきやすいところをメモしておきます。

### HTMLの基本構造

基本形1:
```html
<!DOCTYPE html>
<html>
    <head>
        <meta>
        <meta>
        <title></title>
    </head>
    <body>
        <header>
        </header>
        <main></main>
        <footer></footer>
    </body>
</html>
```

基本形2:
```html
<!DOCTYPE html>
<html>
    <head>
        <meta>
        <meta>
        <title></title>
    </head>
    <body>
        <header>
            <nav>
                <li></li>
                <li></li>
            </nav>
        </header>
        <main></main>
        <aside></aside>
        <footer></footer>
    </body>
</html>
```

基本形3:
```html
<!DOCTYPE html>
<html>
    <head>
        <meta>
        <meta>
        <title></title>
    </head>
    <body>
        <main>
            <div>
                <h1></h1>
            </div>
            <setion>
                <h2>HTMLの学習記録</h2>
                <p>タグについて理解した</p>
            </setion>
            <setion>
                <h2>CSSの学習記録</h2>
                <p>要素の指定方法について理解した</p>
            </setion>
        </main>
    </body>
</html>
```

## コンテンツカテゴリー(containt category)
htmlではあらゆる要素が入れ子にできそうだが、実際はそうではない。
例えば、
```html
<p>
    この<em>単語</em>は重要です。
</p>
```
は有効であるが、
```html
<em>
    この<p>単語</p>は重要です。
</em>
```
は無効である。
Syntax Erroとなる。

もっと言ってしまえば要素は中に何を入れることができるかが決まっている。
その区分をコンテンツカテゴリーと呼ぶ。

たとえば、[`p`タグ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p#technical_summary)は

| property                                 | value                                                                 |
|------------------------------------------|-----------------------------------------------------------------------|
| Content categories(コンテンツカテゴリー) | Flow content(フローコンテンツ), palpable content(知覚可能コンテンツ). |
| Permitted content(許可されたコンテンツ)  | Phrasing content.(記述コンテンツ)                                     |

と書かれている。

対して、[`em`タグ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em#technical_summary)

| property                                 | value                                                                 |
|------------------------------------------|-----------------------------------------------------------------------|
| Content categories(コンテンツカテゴリー) | Flow content(フローコンテンツ), phrasing content(記述コンテンツ), palpable content(知覚可能コンテンツ). |
| Permitted content(許可されたコンテンツ)  | Phrasing content(記述コンテンツ).                                                                       |

この通り、`em`タグは`Phrasing content`を入れ子として許可しているが、`p`タグは`Pharasing content`ではない。このため、`em`の子に`p`を当てることはできない。

逆に`p`は`Phrasing conetnt`を入れ子として許可しており, `em`は`Phrasing content`であるため、`p`の子に`em`を当てることはできる。

気づいたかもしれないが、一つのタグが複数のコンテンツカテゴリーに属することがある。

ここでコンテンツカテゴリーの種類を見てみる。

| Content categories  | コンテンツカテゴリー | 説明                                                                                                                                       | 例                                                              |
|---------------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| MetaData content    | メタデータコンテンツ | HTMLのメタデータを表す。原則としてhead内で使用される。                                                                                     | `link`, `meta`, `title`                                         |
| Flow content        | フローコンテンツ     | HTMLのほとんどがこれに属する。ほぼ任意の要素を子要素にできる。ただし、MetaDataやliなど特定のコンテンツを親に持つことを強いられるものを除く | ほぼすべて                                                      |
| Phrasing content    | 記述コンテンツ       | Flowに属するもののうち、段落内のテキストに使用される要素。Flowの真部分集合                                                                 | `a`, `em`, `img`, `span`, `mark`                                |
| Sectioning content  | 区分コンテンツ       | セクションを明示するためのコンテンツ。headerやmainはセクションではない。                                                                   | `article`, `section`, `aside`, `nav`                            |
| Heading content     | 見出しコンテンツ     | 見出し(heading)を表現するための要素。pタグなどは直前のh1タグなどに属するようにセクションを構成するが、sectionやarticleと異なり、暗黙的。   | `h1`, `h2`, `h3`, `h4`                                          |
| Embedded content    | 埋め込みコンテンツ   | 画像や音声、映像などを埋め込むためのコンテンツ                                                                                             | `img`, `picture`, `iframe`, `object`, `param`, `video`, `audio` |
| Interactive content | 対話型コンテンツ     | ユーザーの操作に動的に反応するコンテンツ                                                                                                   | `a`, `button`, `details`, `summary`, `dialog`                   |
| Palpable content    | 知覚可能コンテンツ   | コンテンツが空や非表示である場合を除き、描写され実在するコンテンツ。フローコンテンツや記述コンテンツは少なくとも１つの知覚可能コンテンツを持つ。                                                                                                                                           | ...                           |

実はこれ以外にもフォーム関連のコンテンツカテゴリーがある。

## アウトラインアルゴリズム
## ロール
