---
title: 'Ajaxとその代替'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/web/web/ajax_review.png'
pubDate: 2024-07-01
tags: ["web", "ajax"]
---

# Introduction
ブラウザ内で非同期通信を行いながらUIの更新・構築を行うプログラミング手法を**Ajax**と呼ぶ。
通常はブラウザの組み込みオブジェクトである`XMLHttpRequest`を使用して実装される。
`XMLHttpRequest`は非同期通信を行うためのAPIであり、サーバーとの通信を非同期で行うためのメソッドやプロパティを提供する。
データのやり取りはXML形式で行われ、ページ全体のHTMLそのものを更新するよりも通信のデータ量は少なくなる。(なお、XML形式でなくJSON形式でデータのやり取りを行うこともでき、最近ではJSON形式が主流である。)
また、ブラウザの機能とは非同期に通信を行う。そのため、ブラウザはレスポンスを待つ間に、レスポンスに左右されない箇所のHTMLの更新やユーザーからの入力を受け付けることができる。

Ajaxとは(Asynchronous JavaScript and XML)の略であり、以下のような特徴を持つ。

![Ajax](https://upload.wikimedia.org/wikipedia/commons/0/0b/Ajax-vergleich-en.svg)

Ajaxは以下のような技術で構成されている。
- `XMLHttpRequest`オブジェクト(現代ではFetch APIが推奨されている)
- DOM
- XML
- JavaScript

各種ブラウザは`XMLHttpRequest`をサポートしている。1999年にはIE5にて初めて実装され、2001年にはMozillaにて実装された。2004年にSafari, 2005年にOperaにて実装された。

`XMLHttpRequest`は画面遷移を伴わない動的なwebアプリケーションの作成が可能となるため、webアプリケーションの開発において長く重要な技術としてつかわれてきた。

しかし、Ajaxは以下のような問題点がある。

- 各種ブラウザ間の実装の違いをコードで吸収する必要がある。
- デザインとコードが分離できない。

このような問題点を解決するために、緩衝となるフレームワークが開発されてきた。
- Google Web Toolkit
- Prototype JavaScript Framework
- JQuery
- Spry

また、Ajaxを構成する技術として以下のような技術がある。

### Fetch API
[Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API)はHTTPリクエストを行ってリソースを取得するためのAPIである。Fetch APIを使用することでページ全体のリフレッシュを行わずに、指定したURLからリソースを取得できる。Fetch APIは`XMLHttpRequest`と似たAPIであるが、より柔軟な操作が可能である。  
`XMLHttpRequest`はcallback関数を使って非同期通信を行うが、Fetch APIはPromiseを使って非同期通信を行う。
また、Fetch APIはリクエストとレスポンスの両方を扱うことができる。[^1][^2]
なお、[MDN](https://developer.mozilla.org/ja/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data#xmlhttprequest_api)にあるようにできればFetch APIを使うことが推奨されている。

Fetch APIは`fetch`メソッドを使う。`fetch`メソッドはURLに対してリクエストを行う。
例えば、GitHubにはユーザー情報を取得するためのAPIとして、
`https://api.github.com/users/GitHub{user-id}`がある。

[^1]: (https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch)
[^2]: (https://developer.mozilla.org/ja/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data)


### DOM
[DOM(Document Object Model)](https://developer.mozilla.org/ja/docs/Web/API/Document_Object_Model/Introduction)とはHTMLドキュメントのコンテンツと構造をJavascriptから操作するためのオブジェクトであり、HTMLのオブジェクト指向的表現である。DOMでは文書を根としてHTMLタグの構造はtreeで表現される。そのため、DOMによって表現された表現するHTMLタグの構造をDOMツリーと呼ぶ。
DOMにはHTMLドキュメントそのものを表す`document`オブジェクトがあり、指定したHTML要素を取得したり作成したりするメソッドが実装されている。

## Ajaxと現代
Ajaxは過去にjQueryによって普及、支えられてきた。
現代ではFetch APIがブラウザの標準APIとして実装され多く使用されている。しかし、Ajaxには以下のような問題があった。  
SPA(Single Page Application)はjavascript fileが肥大化し、初期表示までに時間がかかった。また、
ユーザー環境が様々であり、初期表示のためにfetchする責務をクライアントサイドに持たせるとパフォーマンスが悪化する場合があった。

これらの問題を解決するためにNextJSでは初期表示に関しては、サーバーサイドでfetchすることが試みられた。

当初NextJSでは初期表示やクローラーの応答のためにサーバーを用意していた。様々な技術的需要の変化を経てそのサーバーの役割が変化し、今日ではフロントエンド専用のAPI Gatewayとして使用されている。
そのように、バックエンドのAPIから取得したデータをフロントエンド向けに加工整形するためのサーバー(API Gateway)をBFF(Backend For Frontend)と呼ぶ。(BFFはBFFを使用したネットワークアーキテクチャスタイルのことを指す場合もある。)

BFFでは初期表示時にはデータをfetchしてSSRでHTMLを生成する。
初期表示後にデータの更新があった際にはAPIサーバーから最新のデータを取り直す必要があるが、この場合でもクライアントからAPIサーバーへの通信は行われない。クライアントはBFFへデータを送信しBFFからAPIサーバーへデータを取得し直し、BFFから加工済みの最新データを渡す。
これによりクライアントはBFFのみと通信を行っていることになる。
この利点はBFF側でデータの加工整形を行うことで通信量の削減やクライアント側でfetchする責務を持たせないことでパフォーマンスの向上が期待できる点である。
```d2
direction: right
title: |md
  # 従来のAjax
| {near: top-center}

client: {
    fetch
}
client.fetch <-> backend_1
client.fetch <-> backend_2
client.fetch <-> backend_3
```


```d2
direction: right

title: |md
  # BFFアーキテクチャスタイル
| {near: top-center}
client: {
    fetch
}
client.fetch <-> BFF
BFF <-> backend_1
BFF <-> backend_2
BFF <-> backend_3
```

これによりブラウザ側でやることは取得したデータを表示することと、
BFFにデータを依頼することだけになっている。

クライアント側でなるべくfetchさせず、サーバーのみと通信を行うという観点からAjax以前の状態のアプローチに見えるかもしれない。しかし、実体はAjaxで発達してきたAPI サーバーとクライアントの役割をAPI サーバーとBFF, BFFとクライアントに分離することで、パフォーマンスの向上を図っているのである。


参考:
- [Ajaxから始まった一つの時代の終わり](https://zenn.dev/monicle/articles/the-end-of-the-ajax-heyday)
- [流行りのBFFアーキテクチャとは？｜Offers Tech Blog](https://zenn.dev/overflow_offers/articles/20220418-what-is-bff-architecture)
- [BFFとはなんなのか？ #BFF - Qiita](https://qiita.com/souhei-etou/items/d5de99bb8cba1c59d393)
