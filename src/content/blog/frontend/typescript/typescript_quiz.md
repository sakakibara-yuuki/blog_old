---
title: 'Typescript Quiz'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-08-19
tags: ["typescript", "quiz"]
---

# Introduction
森田賢二さんの
TypeScriptのクイズです。
[typescript_squize](https://gist.github.com/kenmori/8cea4b82dd12ad31f565721c9c456662)
大変参考になります。
## Contents
## Quiz

| No | 正誤 | 自分の回答                         | コメント                           |
|----|------|------------------------------------|------------------------------------|
| 0  | o    | `: string`                         |                                    |
| 1  | x    | `Required(Foo)`                    | `type PartialFoo = Partial<Foo>`   |
| 2  | x    | `type RequiredFoo = Required<Foo>` | `;` を忘れた..                     |
| 3  | x    | `type FooA = Omit(Foo, 'name');`   | `type Picked = Pick<Foo, "name>;"` |
| 4  | x    | `type FooA = Omit<Foo, 'age'>;`    |                                    |
| 5  | x    | `{name: string, age: int}`         | 理由が言えない                     |
| 6  | x    | TがUのサブタイプなら..             |                                    |
| 7  | x    | type A = Exclude<Part, 'add'>      |                                    |
| 8  | x    | nullじゃない?                      | 絶対にreturnされる関数             |
| 9  | x    | 任意個の実引数を取る               | 任意の関数                         |

- No2. ジェネリクスは複数の引数を取れる関数のような扱いができる?
- No2. PickとOmitの使いわけは何?
- No5. Javascriptのオブジェクトはconstであれ書き込みが可能であるそうだ. 各プロパティは後々に変更できるようにwidening(型の拡大)され, 各プロパティの型はプリミティブになる. 
  - [Best common type](https://www.typescriptlang.org/docs/handbook/type-inference.html#best-common-type)
  - [型の拡大](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#unit-types)
  - [Wideing](https://github.com/microsoft/TypeScript-New-Handbook/blob/master/reference/Widening-and-Narrowing.md#widening)
  - wideningについてなぜか最新のtypescriptには記載が無い. これはtypescriptの内部動作として自然に行われるものであるからと推察される.
  - [microsoft devblogs](https://devblogs.microsoft.com/search?query=widening&blogs=%2Ftypescript%2F&sortby=)
  - [変数宣言](https://typescriptbook.jp/reference/values-types-variables/let-and-const)
  - [widening](https://qiita.com/yamashin0616/items/f6f2405dba4570638228)
  - [値渡しと参照渡し](https://typescriptbook.jp/reference/functions/pass-by-value)
- No6. [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
  - [Conditional Types](https://typescriptbook.jp/reference/type-reuse/conditional-types)
- No7. [indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
  - [Keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html#the-keyof-type-operator)
- No8. [never](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)
  - [never](https://typescriptbook.jp/reference/statements/never#never%E3%81%AE%E7%89%B9%E6%80%A7)
- No9. [rest parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters-and-arguments)

| No | 正誤 | 自分の回答                          | コメント             |
|----|------|-------------------------------------|----------------------|
| 10 | o    | Tが関数ならR, 違うならanyにキャスト |                      |
| 11 | o    | `T extends Promise<infer R> ? R`    | 答えが記載されてない |
| 12 | o    | 全くわからない                      |                      |
