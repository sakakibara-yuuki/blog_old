---
title: 'Golangのtype'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-10-31
tags: ["astro", "math"]
---

# Introduction
`type`の使いどころは通常, 構造体やインターフェースを定義する際に使用されるが, それ以外にもいくつかの使い方がある.

## Contents
## これは何?
golangでは`type`というkeywardsがあり, よく
```go
type MyType int
type MyStruct struct {
    Name string
    Age int
}
type MyInterface interface {
    MyMethod()
}
```
さらに
```go
type MyFunc func(int) int
```
のような形で使用される.
関数もいけるのは考えてみればわかるけど, あんまり使ったことが無いのでびっくりした.

ここまで見ると, `type`は型を別名で定義するようなものと思われる.
しかし, 実際にはもう少し複雑な機能をもつ.

## 型の別名定義
`type`を使用して定義した型はその元の型と内容が同じであっても別の型として扱われる.
```go
type MyType int
```
`MyType`は実質的に`int`と同じ型であるが, `int`と`MyType`は別の型として扱われる.
```go
var a int = 1
var b MyType
b = a // error
```

しかし, `=`の代入演算子を使用することで, 型を別名として定義することができる.
```go
type MyType = int
var a int = 1
var b MyType
b = a // ok
```

以下, 同じようなことに関する記事
- [go の知らなかった仕様 #Go - Qiita](https://qiita.com/Nabetani/items/bfeb49c66cc569f45bc4)
