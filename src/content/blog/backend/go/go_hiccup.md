---
title: 'Go言語つまづきどころ'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-10-07
tags: ["astro", "math"]
---

# Introduction
## Contents
## `fmt.Println`と`println`の違い
`println`はruntime時に使用される組み込み関数であり,  `fmt`パッケージが標準ライブラリにあるし,いずれ削除される可能性がある.

言語開発者にとっては依存関係の無い標準出力は便利であるが, `fmt`をつかえばいいだろう. もしくは`log`

`println`はデバッグ用途でのみ使用するべきである.[^goboot]

[^goboot]: https://go.dev/ref/spec#Bootstrapping

## bcryptでハマったところ
`bcrypt`はPasswordなどをハッシュ化するためのライブラリである. 
とはいったものの, 実際に使ってみると不可解な点が見受けられる.
どうも, ハッシュ化した結果, 同じような文字列が出力されるのだ.

```json
{
"password": "$2a$10$8Xi4EKCo2LPkuRmUO74JDOYXFkFXDT2HH53KiR8rHRKA3nnyvE8X."
}
```
これはいったいどういうことだろう.

実は, `bcrypt`のハッシュ化にはフォーマットがある.

```plaintext
$2a$[cost]$[salt][hashed_password]
```

`$2a$`はバージョンを示し,
`$10$`はコストパラメータを示す.
その後の22文字はソルト`8Xi4EKCo2LPkuRmUO74JDO`である.
残りは`YXFkFXDT2HH53KiR8rHRKA3nnyvE8X.`は実際にハッシュ化されたパスワードである.

このように, `bcrypt`はハッシュ化した結果をフォーマットして出力する.

そう, `bcrypt`を使用する限り, saltは不要なのである.
自分はこれに気づかず, モデルに`Salt`を追加してしまっていた.
