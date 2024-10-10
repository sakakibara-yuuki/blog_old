---
title: 'Go contextについて'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-10-08
tags: ["astro", "math"]
---

# Introduction
自分の`context`の最初のimageは, `http`のリクエストのタイムアウトを設定するためのもの. というイメージが強い.

## Contents
## contextの必要性
contextは, 一つの処理が複数のgoroutineで行われる場合に, 使われる.

具体例としては, `http`のリクエストを複数のハンドラで処理する場合.
```go
h1 := func(w http.ResponseWriter, r *http.Request) {
    // 何か処理
}
h2 := func(w http.ResponseWriter, r *http.Request) {
    // 何か処理
}
http.HandleFunc("/", h1)
http.HandleFunc("/endpoint", h2)
```

このような場合, プログラマがその構造を意識しなくても, ライブラリの仕様上知らずに構築されることもある.

また, goroutineがgoroutineを呼び出して...
結果的にgoroutineの呼び出し関係が木構造を構成することもある.

このような場合, あらゆる情報伝達が複雑になる.

例えば, 木構造のように呼び出したgoroutineの根で情報伝達のためのchannelをcloseしたら, その子まで情報伝達が終了するのだろうか?

また, 情報伝達のためのchannelの型の拡張性も低い.

このような問題を解決するために, `context`が使われる.

- 処理の締め切り
- キャンセル信号
- リクエストスコープの値の伝達

を情報伝達するために使われる.
"context", つまり, その情報の文脈を持たせたデータ構造をそれぞれのgoroutineに渡すことで, それぞれのgoroutineがその情報を共有することができる.
これはchannelのようなqueueとは異なる.

`context`は次の型をもつ.
```go
type Context interface {
    Deadline() (deadline time.Time, ok bool)
    Done() <-chan struct{}
    Err() error
    Value(key interface{}) interface{}
}
```

