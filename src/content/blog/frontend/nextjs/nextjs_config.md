---
title: 'Nextjs Config'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-09-22
tags: ["nextjs", "config"]
---

# Introduction
## Contents
## Section1

```bash
npx create-next-app@latest
```

`nex dev`, `next build`を実行して, 日宇町な依存関係を自動的にinstallされる.

`jsconfig.json`がある場合, `tsconifg.json`へ`paths`コンパイラーオプションを移行する．そして, `jsconfig.json`を削除する.

### Next.js canary(ベータ版)
next.js canaryでは, `next.config.js`を使うことが推奨されている. 
`next.config.ts`を使うことも推奨されている.
`next.config.ts`を使うことで型をimportできる.

デフォルトでは`mjs`ファイルが生成されるが, `ts`ファイルを追加するだけで, `cjs`, `cts`, `mjs`,`mts`などのimport をサポートしている.

Next.jsは`next/types`にアプリに存在する全てのルートに関する定義が生成されている. これにより, Typescriptはエディタに無効なリンクに対する警告を出すことができる.

