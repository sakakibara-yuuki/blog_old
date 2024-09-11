---
title: "yaml フロントマター"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: "https://docs.astro.build/assets/rays.webp"
pubDate: 2024-03-05
tags: ["yaml", "frontmatter"]
---

## Contents
## YAML フロントマター
[yaml front matter](https://jekyllrb.com/docs/front-matter/)は
```yaml
---
title: "yaml フロントマター"
author: "sakakibara"
---
```

のように'---'で囲まれた部分のことです。
フロントマターは、ページの最初に記述されなければならず、当然ですが、この部分にはyaml形式で記述します。
フロントマターを含む部分は主に特別なファイルとして扱われます。
広くmarkdwonファイルでメタデータを埋め込むために使われているもの見かけますが、
markdwonに限らず、他のファイル形式でも採用されていることがあります。(e.g. `.astro`)

元々はjekyllで使われていたものですが、gatsbyやastroなどの他の静的サイトジェネレータでも採用されています。
フロントマターに記述するプロパティは、そのサイトジェネレータによって異なります。また、自分で追加することも多くの場合可能です。

ただ、以下のものはどこでも使えると思います。
- published
- date
- tags

#### github docs
[github docs](https://docs.github.com/ja/contributing/writing-for-github-docs/using-yaml-frontmatter)では

- versions
- redirect_from
- title
- shortTitle
- intro
- permissions
- product
- layout
- children
- childGroups
- featuredLinks
- showMiniToc
- allowTitleToDifferFromFilename
- changelog
- defaultPlatform
- defaultTool
- learningTracks
- includeGuides
- type
- topics
- communityRedirect
- effectiveDate

が使えます。

#### astro
[astro](https://docs.astro.build/ja/guides/cms/frontmatter-cms/)ではフロントマターを修正することできます。
[プログラムによるフロントマターの変更](https://docs.astro.build/ja/guides/markdown-content/#%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%A0%E3%81%AB%E3%82%88%E3%82%8B%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%83%9E%E3%82%BF%E3%83%BC%E3%81%AE%E5%A4%89%E6%9B%B4)


#### reference
- [github docs](https://docs.github.com/ja/contributing/writing-for-github-docs/using-yaml-frontmatter)
- [astro](https://docs.astro.build/ja/guides/markdown-content/#%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%83%9E%E3%82%BF%E3%83%BC-layout)
- [astro mdx](https://mdxjs.com/guides/frontmatter/)
