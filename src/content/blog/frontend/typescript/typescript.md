---
title: 'Typescriptの基本'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-2.jpg'
pubDate: 2024-08-22
tags: ["astro", "math"]
---

# Introduction
## Typescriptの導入
typescriptのモジュールが無いとjavascriptに変換できない.
そのため, typescriptのモジュールをインストールする必要がある.

`npm`でどのversionのtypescriptがinstallできるのかを確認してみる.

```bash
npm info typescript
```
色々な情報が表示されるが, typescriptのモジュールは`typescript@5.5.4`という名前であることがわかる.(一番上)

```bash
typescript@5.5.4 | Apache-2.0 | deps: none | versions: 3169
TypeScript is a language for application scale JavaScript development
https://www.typescriptlang.org/
...
```
それではinstallしてみる.  
この場合, typescriptはランタイム時には必要ないので開発環境オプション(`-D` | `--save-dev`)を指定してinstallする.

```bash
npm i -D typescript@5.5.4
```

それでは適当なファイルを作成して, typescriptをjavascriptに変換してみる.
まず, 適当なファイルを作成する.
```bash
let message: string = "Hello, World!";
console.log(message);
```
次に, `tsc`コマンドを使ってtypescriptをjavascriptに変換する.
なお, tscはtypsscript compilerの略である.
```bash
npx tsc filename.ts
```
`npx`はローカルにインストールされたモジュールを実行するためのコマンドである.
nodemodules配下にあるモジュールを探索して実行することができる.
出来きたものを確認してみると, 
`filename.ts`以外にも`filename.js`が作成されていることがわかる.
そして中身はjavascriptに変換されていることがわかる.

```bash
var message = "Hello, World!";
console.log(message);
```
当然, 実行できる.

```bash
node filename.js
> Hello, World!
```

## Contents
## Section1

