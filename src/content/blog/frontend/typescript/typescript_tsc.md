---
title: "Typescriptの導入"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-2.jpg"
pubDate: 2024-08-22
tags: ["typescript", "config"]
---

# Typescript の導入

TypeScript のモジュールが無いと javascript に変換できない.
そのため, TypeScript のモジュールをインストールする必要がある.

`npm`でどの version の typescript が install できるのかを確認してみる.

```bash
npm info typescript
```

色々な情報が表示されるが, typescript のモジュールは`typescript@5.5.4`という名前であることがわかる.(一番上)

```bash
typescript@5.5.4 | Apache-2.0 | deps: none | versions: 3169
TypeScript is a language for application scale JavaScript development
https://www.typescriptlang.org/
...
```

それでは install してみる.  
この場合, typescript はランタイム時には必要ないので開発環境オプション(`-D` | `--save-dev`)を指定して install する.

```bash
npm i -D typescript@5.5.4
```

それでは適当なファイルを作成して, typescript を javascript に変換してみる.
まず, 適当なファイルを作成する.

```bash
let message: string = "Hello, World!";
console.log(message);
```

次に, `tsc`コマンドを使って typescript を javascript に変換する.
なお, tsc は typsscript compiler の略である.

```bash
npx tsc filename.ts
```

`npx`はローカルにインストールされたモジュールを実行するためのコマンドである.
nodemodules 配下にあるモジュールを探索して実行することができる.
出来きたものを確認してみると,
`filename.ts`以外にも`filename.js`が作成されていることがわかる.
そして中身は javascript に変換されていることがわかる.

なお, 型チェックを厳密にすることもできる.

```bash
npx tsc filename.ts --strict=true
```

多くは`tsconfig.json`に設定を記述しておくことが多いが, このようにコマンドライン引数で設定することもできる.

```bash
var message = "Hello, World!";
console.log(message);
```

当然, 実行できる.

```bash
node filename.js
> Hello, World!
```
