---
title: "HTMLの基本"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
image:
    url: "https://docs.astro.build/assets/rays.webp"
    alt: "Astroの光線のサムネイル。"
pubDate: 2024-06-14
tags: ["astro", "公開学習", "後退", "コミュニティ"]
---

## HTMLのメモ
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

### h1~h6
id属性を使って、他のhタグからリンクを貼ることができる。
```html
<h2 id="section-heading-three">h2タグ</h2>
<a href="#section-heading-three">h2へのリンク</a>
```

### a tag
別タブでリンクを開く。
```html
<a href="URL" target="_blank">
```

### ul ol dl li tag
ul: unorder list(順序なしリスト) : ホームページのナビゲーションなど
ol: order list(順序ありリスト): 数字付きリスト
dl: definition list(定義リスト): 用語とその説明
dt: definition title(用語)
dd: definition detail(説明)
li: list item(リストの要素)

```html
<ul>
    <li>list1</li>
    <li>list2</li>
</ul>
<ol>
    <li>list1</li>
    <li>list2</li>
</ol>
<dl>
    <dt>用語1</dt>
    <dd>説明1</dd>
    <dt>用語2</dt>
    <dd>説明2</dd>
</dl>
```

### table tag
- table: 表
- tr: table row(行)
- td: table data(セル)
- th: table header(見出し)

```html
<table>
    <tr>
        <th>商品名</th>
        <th>価格</th>
    </tr>
    <tr>
        <td>りんご</td>
        <td>100円</td>
    </tr>
    <tr>
        <td>みかん</td>
        <td>100円</td>
    </tr>
</table>
```

### video tag
動画のコントロールは、`controls`属性を使う。
```html
<video src="URL" controls autoreplay loop>video name</video>
```

### header tag
ロゴやページタイトル、navなどが含まれる。
```html
<header>
    <img src="URL" alt="logo">
    <ul>
        <li>Home</li>
        <li>About</li>
    </ul>
</header>
```

### nav tag
ナビゲーションメニューが含まれる。headerに含まれることが多い。
```html
<header>
    <img src="URL" alt="logo">
    <nav>
        <ul>
            <li><a href="home">Home</a></li>
            <li><a href="home">About</a></li>
        </ul>
    </nav>
</header>
```

### main tag
ページの核となるコンテンツが含まれる。多くのtagを含む。
```html
<main>
    <h1>タイトル</h1>
    <p>本文</p>
    <img src="URL" alt="image">
</main>
```
### aside tag
本文とは関係の薄い補足情報が含まれる。サイドバーなどに使われる。
```
<aside>
    <h2>著者について</h2>
    <p>xx大学卒業後、yy社に入社。</p>
</aside>
```
### article tag
独立性の高いコンテンツが含まれる。ここだけ見てもページの内容が完結している。
```html
<article>
    <h2>記事タイトル</h2>
    <p>記事本文</p>
</article>
```

### section tag
意味のあるグループをまとめるためのタグ。articleと異なり、ここだけ見ても完結していない。
```html
<section>
    <h3>その他関連する記事</h3>
    <ul>
        <li>記事1</li>
        <li>記事2</li>
    </ul>
</section>
```
通常、sectionの次にはh3などの見出しタグが使われる。タイトルの内セクションができることは望ましく無い。

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
