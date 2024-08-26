---
title: "Astroで画像が読み込まれない"
author: "sakakibara"
description: ""
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-04-11
tags: ["astro", "画像"]
---

Astroでブログを書いているが、画像が読み込まれない。
Netlifyで手元でdevelopしているときは問題なく表示されるが、公開すると画像が読み込まれない。
なぜだろうか？
手元でうまく言っているのでおそらくNetlifyの設定がおかしいのだろうと思って旅にでた。
[Netlify Image CDN](https://docs.netlify.com/frameworks/astro/#netlify-image-cdn)
を見てみると、
> To transform a source image hosted on another domain, you must first configure allowed domains in your astro.config.mjs file.
> Visit the Astro docs to learn more.

なる文を見つけた。なるほど...? いや、CDN使ってへんしなぁ...。でも興味あるから見てみよ。と思って該当のページを見てみると、

[Authorizing remote images](https://docs.astro.build/en/guides/images/#authorizing-remote-images)

ふーんこういうふうに設定するんだ。。と思って下を見ていくと

[Images in Markdown files](https://docs.astro.build/en/guides/images/#images-in-markdown-files)

> The \<img\> tag is not supported for local images, and the \<Image /> component is unavailable in .md files.

**\<img\>タグはローカル画像に対してサポートされていないし、\<Image />コンポーネントは.mdファイルでは利用できない。**

..!!

また、[\<img\>タグについて](https://docs.astro.build/ja/guides/images/#img)の記述を見ると、どうにも\<img\>タグはあんまり推奨していない気がする。
なお、使用する際には`.astro`ファイルからの相対パスを指定する必要があることに注意する。

#### conclusion
.mdファイルでは\<img\>タグを使わずに
```markdown
![alt](url)
```
を使用して<Image />に変換する必要がある。  
よって、markdownのYamlフロントマターで指定する`title`で使用する画像も`url`で指定する必要がある。

また, エラーとしても以下のようなエラーが出る。
```
    If you want to use an image from your `src` folder,
you need to either import it or if the image is coming from a content collection, use the image() schema helper https://docs.astro.build/en/guides/images/#images-in-content-collections.
See https://docs.astro.build/en/guides/images/#src-required for more information on the `src` property.
```


import するか、content collectionから取得するか、image()を使うかということのようだ。

![画像が読み込めない](https://docs.astro.build/en/reference/errors/local-image-used-wrongly/)


