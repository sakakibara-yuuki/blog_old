---
title: "Typescriptの設定"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-2.jpg"
pubDate: 2024-08-22
tags: ["typescript", "config", "prettier", "eslint"]
---

# Introduction

## Contents

## tsconfig.json

typescript では[`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#handbook-content)という設定ファイルを元に補完やエラーチェックを行う.
そのため, `tsconfig.json`の設定から逃れることはできない.
実際にどのような項目が設定できるのかは[公式](https://www.typescriptlang.org/tsconfig/)に記載されている.
以下では主要な設定項目について説明する.

### noImplicitAny

型が指定されておらず, Typescirpt が型推論ができない場合にエラーを出すかどうかを指定する.[^noimplicitany]
通常, 型推論ができない場合は`any`型として扱われ(これを暗黙の`any`, または ImplicitAny と呼ぶ), そのままコンパイルされる. しかし, この設定を`true`にすることで, 型推論ができない場合はエラーを出すようになる.

[^noimplicitany]: [noImplicitAny](https://www.typescriptlang.org/tsconfig/#noImplicitAny)

### strictNullChecks

null と undefined を厳しく扱うかどうかを指定する.[^strictnullchecks]
通常, 変数に null と undefined が代入されてもエラーにはならないが, この設定を`true`にすることで, null や undefined を代入する型で定義されていない限り, エラーを出すようになる.
このエラーを防ぐためには, null と undefined を許容する型を(Union などを使って)明示的に指定する必要がある.

[^strictnullchecks]: [strictNullChecks](https://www.typescriptlang.org/tsconfig/#strictNullChecks)

### target

コンパイル後の ECMAscript のバージョンを指定する.[^target]
es5, es6, es2015, es2016, などが指定できる.
es6 を指定しよう.

- default は es6

[^target]: [target](https://www.typescriptlang.org/tsconfig/#target)

## Prettier

[Prettier](https://prettier.io/)は formatter の一つで, コードのフォーマットを自動で行ってくれる.
`.prettierrc`という設定ファイルを作成し, その中に設定を記述することで, フォーマットの設定を変更することができる. json っぽい形式で記述する.

ここらへんのスタイルガイドについては, 以下の[Style Guide](#style-guide)を参照すると良い

公式はここ[configuration file](https://prettier.io/docs/en/configuration)

```json
{
  // コードの末尾にセミコロンをつけるかどうか
  "semi": false,
  // オブジェクト定義の最後のカンマを無しにするかどうか
  "trailingComma": "none",
  // 文字列の定義などクオートにシングルクォートを使うかどうか
  "singleQuote": true
  ...
  // 行を折り返す文字数
  "printWidth": 80
}
```

そして, `package.json`の scripts はよく次のような script を追加する.

```json
{
  "scripts": {
    "prettier-format": "prettier --config .prettierrc "src/**/*.ts" --write"
  }
}
```

これにより, `npm run prettier-format`を実行することで, `src`ディレクトリ以下の`.ts`ファイルをフォーマットすることができる.

また, 以下で説明する`ESLint`と組み合わせて使うために`eslint-plugin-prettier`を使うと良い.
[ここらへん](https://prettier.io/docs/en/install#eslint-and-other-linters)を調べるといろいろ出てくる.


## ESLint

[`ES Lint`](https://eslint.org/)は, javascript や typescript のコードを解析し, 問題がある箇所に警告を出すツールである.
`eslint.config.js`という設定ファイルを作成し, その中に設定を記述することで, 解析の設定を変更することができる.

`.eslintrc.js`で設定されている場合もあるが, それは version が古い(9.00)以前のものなので注意

```javascript
// eslint.config.js
export default [
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
];
```

value はエラーレベルを指定する.

- "off" or 0: 何もしない
- "warn" or 1: 警告を出す
- "error" or 2: エラーを出す

その他にも設定できる項目は多く,
どのようなルールがあるかは[公式](https://eslint.org/docs/latest/rules/)を参照すると良い.

## Style Guide

- [JavaScript Standard Style](https://standardjs.com/)
- [Airbnb Style Guide](https://github.com/airbnb/javascript)
- [Google Style Guide](https://google.github.io/styleguide/)
- [TypeScript Deep Dive Style Guilde](https://typescript-jp.gitbook.io/deep-dive/styleguide)
- [Nextjs ES Lint](https://nextjs.org/docs/pages/building-your-application/configuring/eslint#eslint-plugin)

<!-- ### React Style Guide -->
<!-- - [Airbnb React/JSX Style Guide](https://airbnb.io/javascript/react/) -->
<!-- - [Tao of React Style Guide](https://alexkondov.com/tao-of-react/) -->
