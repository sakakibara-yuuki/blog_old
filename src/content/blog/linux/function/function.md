---
title: '関数型'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-08-05
tags: ["関数型", "programming"]
---

# Introduction
## Contents
## 末尾再帰最適化
## 反復と再帰
## 遅延評価
## 高階関数
### カーリー化と部分適用
高階関数の引数をバラバラにすることで, 段階的に関数を適用することが可能になる. このような技術の一つとしてカーリー化と呼ばれるものがある.

**カーリー化とは, 複数の引数を取る関数を, 一つの引数を取る高階関数に変換することである.**

カーリー化されていない関数をカーリー化する例を示す.
$n$が$m$の倍数であるかどうかを判定する関数を考える.
```javascript
function multipleOf(n, m) {
  if (m % n === 0) {
    return true;
  } else {
    return false;
  }
}
```
この関数をカーリー化する. カーリー化の原則として一つの引数のみを許す.
つまり, 引数$n$を取る関数を返す関数を定義する.
では, 引数$m$はどうすればいいか. 
これは, 関数の返り値としての関数の引数として渡すことにする.
```javascript
function multipleOf(n) {
  return function(m) {
    if (m % n === 0) {
      return true;
    } else {
      return false;
    }
  }
}
```

このように, カーリー化ではカーリー化以前の関数の引数を第一引数から順にカーリー化後の関数の外側の関数の引数に割り当てることで, カーリー化された関数を作成する.

イメージとしては, 以下のようになる.
ここで, $F$は$X\times Y$を引数に取り, 関数$G$を返す関数である.
そして, $G$は$Y$を引数に取り, $Z$を返す関数である.
$$
F: X \times Y \to G
G: Y \to Z
$$

そして, カーリー化の最大の利点とは部分適用が可能になることがある.

**部分適用とは, カーリー化関数の一部の引数だけを適用することをいう.**
たとえば, `multipleOf(2)(4)`という関数呼び出しは, 最終結果である`true`(bool値)を返す.
しかし, `multipleOf(2)`という関数呼び出しは, `m`が2の倍数であるかどうかを判定する関数を返す.
同様に, `multipleOf(3)`という関数呼び出しは, `m`が3の倍数であるかどうかを判定する関数を返す.
このように, 部分適用を行うことで, 関数の再利用性が高まる.

カーリー化で注意すべき点は, 引数の順番である.
これが上手く行かないと, 部分適用が難しくなる.
例えば, `base`の`index`乗を計算する関数を考える.

```javascript
function exponential(base) {
  return function(index) {
    if (index === 0) {
      return 1;
    } else {
      return base * exponential(base)(index - 1);
    }
  };
};
```
このカーリー化関数を部分適用してみる場合, `exponential(2)`のようにすると, $2^x$を計算する.
では, $x^2$を計算する場合はどうすればいいか.
そう, 単純にはできないのである.
この問題にはある回避方法がある.
それは, 引数の順番を変える関数を作成することである.
この場合, この関数の引数はカーリー化関数である.

```javascript
function flip(f) {
  return function(x) {
    return function(y) {
      return f(y)(x);
    };
  };
}
```
もっとわかりやすく書くと..
```javascript
function flip(exponential) {
  return function(x) {
    return function(y) {
      return exponential(y)(x);
    };
  };
}
```
このように書くと, `flip(exponential)(2)`というような関数を作成すると,
実質, `exponential(y)(2)`という関数を返す.
そして, `flip(exponential)(2)(3)`という関数は
`exponential(3)(2)`の結果を返す.

### コンビネーター
さて, 前回の`flip`関数は, コンビネーターと呼ばれる関数の一つである.
コンビネーターとは関数を組み合わせるための高階関数を指す.
ただし, この定義は狭義のコンビネーターであり, 広義のコンビネーターは, 自由変数を持たない関数である.

`multipleOf`関数を例にとる.
`multipleOf`関数は, 関数を引数に関数を返す関数でないために, コンビネーターではない.
`flip`関数は, 関数(`exponential`)を引数に関数を返す関数であるため, コンビネーターである.

<!-- `not`関数を考える. -->
<!-- ### クロージャー -->
<!-- ### モナド -->
