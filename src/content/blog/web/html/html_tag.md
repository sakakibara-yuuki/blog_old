---
title: 'HTMLのタグ'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/web/html/html_tag.png'
pubDate: 2024-07-14
tags: ["html", "基本", "基礎"]
---

# HTMLのタグ

## h1~h6
[`h1`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/Heading_Elements)タグでリンクを作成する。
id属性を使って、他のhタグからリンクを貼ることができる。
```html
<h2 id="section-heading-three">h2タグ</h2>
<a href="#section-heading-three">h2へのリンク</a>
```

## a tag
[`a`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/a)タグでリンクを作成する。
別タブでリンクを開く。
```html
<a href="URL" target="_blank">
```
また、
```html
<a href="URL" rel="noopener noreferrer">
```
とすることで、リンクを開いた先のページがオリジンを取得できないようにすることができる。

それぞれについて見ていく。  
`noopener`は新しいタブを開いたときに、そのタブが元のページにアクセスできないようにする。
具体的には新しいタブを別スレッドで開くことで、元のページにアクセスできないようにする。
また、別のスレッドになることで、ページの処理が遅くなることを防ぐことができる。
仮に遷移先のページが重くても元タブのページに影響を与えない。

`noreferrer`はリンクをクリックしたときに、参照情報を送信しないようにする。
参照元リンク情報を送信しないことで、リンク先のページがリンク元のページを知ることができないようにする。
google analyticsなどのトラッキングを防ぐために使われる。

また、`<a href="#">`はnull linkと呼ばれ、何もリンク先が指定されていないリンクを指す。

## ul ol dl li tag
- [`ul`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/ul) :unorder list(順序なしリスト) : ホームページのナビゲーションなど
- [`ol`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/ol) :order list(順序ありリスト): 数字付きリスト
- [`dl`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/dl) :definition list(定義リスト): 用語とその説明
- [`dt`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/dt) :definition title(用語)
- [`dd`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/dd) :definition detail(説明)
- [`li`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/li) :list item(リストの要素)

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

## table tag
[`table`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/table)タグは表を作る。
- table: 表
- [`tr`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/tr): table row(行)
- [`td`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/td): table data(セル)
- [`th`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/th): table header(見出し)

```html
<table>
    <caption> お買い物 </caption>
    <thead>
        <tr>
            <th>商品名</th>
            <th>価格</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>りんご</td>
            <td>100円</td>
        </tr>
        <tr>
            <td>みかん</td>
            <td>100円</td>
        </tr>
    </tbody>
</table>
```

## video tag
[`video`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/video)タグでは動画のコントロールは、`controls`属性を使う。
```html
<video src="URL" controls autoreplay loop>video name</video>
```

## header tag
[`header`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/header)タグはロゴやページタイトル、navなどが含まれる。
```html
<header>
    <img src="URL" alt="logo">
    <ul>
        <li>Home</li>
        <li>About</li>
    </ul>
</header>
```

## nav tag
[`nav`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/nav)タグはナビゲーションメニューが含まれる。headerに含まれることが多い。
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

## main tag
[`main`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/main)タグはページの核となるコンテンツが含まれる。多くのtagを含む。
```html
<main>
    <h1>タイトル</h1>
    <p>本文</p>
    <img src="URL" alt="image">
</main>
```
## aside tag
[`aside`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/aside)タグは本文とは関係の薄い補足情報が含まれる。サイドバーなどに使われる。
```
<aside>
    <h2>著者について</h2>
    <p>xx大学卒業後、yy社に入社。</p>
</aside>
```
## article tag
[`article`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/article)タグは独立性の高いコンテンツが含まれる。ここだけ見てもページの内容が完結している。
```html
<article>
    <h2>記事タイトル</h2>
    <p>記事本文</p>
</article>
```

## section tag
[`section`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/section)タグは意味のあるグループをまとめるためのタグ。articleと異なり、ここだけ見ても完結していない。
```html
<section>
    <h3>その他関連する記事</h3>
    <ul>
        <li>記事1</li>
        <li>記事2</li>
    </ul>
</section>
```
通常、sectionの次にはh3などの見出しタグが使われる。タイトルが無いセクションができることは望ましく無い。
ただし、[ここ](https://developer.mozilla.org/ja/docs/Web/HTML/Element/section#%E8%A6%8B%E5%87%BA%E3%81%97%E3%81%AE%E3%81%AA%E3%81%84%E3%82%BB%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E4%BD%BF%E7%94%A8)にあるように、webアプリやUIのコンポーネントを表す際にはsectionタグを使うことが推奨される。

## div tag
[`div`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/div)タグはブロックレベルのコンテナであり、スタイル付けのために要素をグループ化するために使用される。
要素が意味を持たない場合に使用される。

## span tag
[`span`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/span)タグはインラインのコンテナであり、スタイル付けのために要素をグループ化するために使用される。
要素が意味を持たない場合に使用される。

## form tag
[`form`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/form)タグは情報を送信するためのコントロールを含むドキュメントのブロックを表す。
```html
<form method="get">
  <label>
    Name:
    <input name="submitted-name" autocomplete="name" />
  </label>
  <button>Save</button>
</form>
```

## label tag
[`label`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/label)タグは入力フォーム要素に関連付けられるラベルを定義する。

これにより、ユーザーがラベルをクリックすると、関連するフォーム要素がアクティブになる。
(当たり判定が大きくなる。)
`label`の子要素として`input`を持つことで関連付けられる。
```html
<label>
  Do you like peas?
  <input type="checkbox" name="peas" />
</label>
```

また、子要素でなくとも、`input`の`id`属性と`label`の`for`属性が同じであれば関連付けられる。
この方法の利点としては例えば、チェックボックスとラベルの間に他の要素がある場合でも、関連付けが可能であるという点である。
```html
<input type="checkbox" id="check1" />
<label for="check1">Do you like peas?</label>
```

ラベル付けされた要素は**ラベル対象コントロール**と呼ばれ、複数のラベルを持つことができる。
```html
<label for="username">名前を入力してください:</label>
<input id="username" name="username" type="text" />
<label for="username">名前を忘れてしまいましたか？</label>
```

## button tag
[`button`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/button)タグはクリック可能なボタンを作成する。
[気をつけるべきこと](https://developer.mozilla.org/ja/docs/Web/HTML/Element/button#%E3%83%A1%E3%83%A2)
として
- `form`で囲むか`for`属性に`form`のidを指定する
- `type=button`でないと、フォームが送信され、レスポンスをリロードしようとする

## fieldset tag
[`fieldset`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/fieldset)タグはいくつかのコントロールをグループ化するために使用される。

```html
<form>
  <fieldset>
    <legend>choose your favarit monster</legend>
        <input type="radio" id="kraken">
        <label for="kraken">Kraken</label>
    </fieldset>
</form>
```

興味深いことに、fieldset要素はform要素の子要素である必要はない。form属性を使って、fieldset要素がどのフォームに属するかを指定することができる。
```html
<form id="monster">
    ...
</form>

<fieldset form="monster">
<legend>choose your favarit monster</legend>
    <input type="radio" id="kraken">
    <label for="kraken">Kraken</label>
</fieldset>
```


## iframe tag
[`iframe`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/iframe)タグは閲覧コンテキストであり、他のHTMLページを埋め込むために使用される。inlineFrameの略。
```html
<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/UW_UNqy0qn4?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>
```

## template tag
[`template`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/template)タグはページがよみこまれたときには表示されないが、実行時にJavaScriptを使って後からインスタンス化することのできるHTMLを保持するためのメカニズムを提供する。

ページの読み込み時にはパーサーがページの読み込み時にその内容の有効性を検証するが、要素の内容は描画されない。
```html
<table id="producttable">
  <thead>
    <tr>
      <td>UPC_Code</td>
      <td>Product_Name</td>
    </tr>
  </thead>
  <tbody>
    <!-- existing data could optionally be included here -->
  </tbody>
</table>

<template id="productrow">
  <tr>
    <td class="record"></td>
    <td></td>
  </tr>
</template>
```
これでテーブルヘッダーだけがある行が作成される。

```javascript
// templete 要素の content 属性の有無を確認することで、
// ブラウザーが HTML の template 要素に対応しているかテストします。
if ("content" in document.createElement("template")) {

  // 既存の HTML tbody と template の行を使って
  // table をインスタンス生成します。
  const tbody = document.querySelector("tbody");
  const template = document.querySelector("#productrow");

  // 新しい行を複製して表に挿入します。
  const clone = template.content.cloneNode(true);
  let td = clone.querySelectorAll("td");
  td[0].textContent = "1235646565";
  td[1].textContent = "Stuff";

  tbody.appendChild(clone);

  // 新しい行を複製して表に挿入します。
  const clone2 = template.content.cloneNode(true);
  td = clone2.querySelectorAll("td");
  td[0].textContent = "0384928528";
  td[1].textContent = "Acme Kidney Beans 2";

  tbody.appendChild(clone2);

} else {
  // HTML の template 要素に対応していないので
  // 表に行を追加するほかの方法を探します。
}
```

## s tag
[`<s>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/s)タグは打ち消しで、その中のテキストを取り消し線、または打ち消し線で表示する。
`<s>`タグはすでに適切でなくなった過去の事柄を表すために使用される。
ただし、文書の修正を示す場合は[`<del>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/del)や[`<ins>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/ins)タグを使用することが推奨される。


## nonscript tag
[`<nonscript>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/noscript)タグはブラウザーがJavaScriptをサポートしていない場合、もしくは無効にされている場合に表示される代替コンテンツである。

## code tag
[`<code>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/code)タグはコンピュータのコードを表示するために使用される。

## pre tag
[`<pre>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/pre)タグはhtml内のテキストのレイアウトをそのまま表示する。改行やスペースなどもそのまま表示される。

## hr tag
[`hr`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/hr#%E8%A9%A6%E3%81%97%E3%81%A6%E3%81%BF%E3%81%BE%E3%81%97%E3%82%87%E3%81%86)タグは水平線を表示する。  
これは話の場面の切り替えや話題の転換を表すために使われる。
ただ単に水平線を表示するだけなら、CSSのborderプロパティを使うべきである。
