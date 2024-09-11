---
title: 'JavaScriptの仕組み: #2 変数と関数とオブジェクト'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-07-01
tags: ["javascript", "基礎", "基本"]
---

# Introduction
## 変数
|type | 再宣言 | 再代入 | スコープ | ホイスティング |
|---|---|---|---|---|
|let | × | ○ | ブロックスコープ | × |
|const | × | × | ブロックスコープ | ×  |
|var | ○ | ○ | 関数スコープ | undefined |

再宣言とは
```javascript
let a = 1;
let a = 1;
```

再代入とは
```javascript
let a = 0;
a = 1;
```

スコープとは
```javascript
{
    let a =0;
    var b =0;
}
```
`b`は外からもアクセスできるが、`a`は外からアクセスできない

ホイスティングとは
```javascript
console.log(g);
let a = 0; // ReferenceError: Cannot access 'a' before initialization
var b = 0; // undefined
```

## 暗黙的な型変換
変数が呼ばれた状況によって変数の型が自動的に変換されることを**暗黙的な型変換**という
```javascript
let a = 1;
console.log( a + "1" ); // 11
console.log( a - "1" ); // 0
console.log( a - null ); // 1
console.log( a - true ); // 0
```
`+`は文字列の結合にも使うが、`-`は数値の引き算にしか使わないため、`-`は文字列を数値に変換してから計算する。

### 厳格な比較
`===`と`==`はそれぞれ異なる。
- `===`は型も含めて等しいかどうかを比較する
- `==`は型を無視して等しいかどうかを比較する

```javascript
let a = '1';
let b = 1;

console.log( a === b ); // false
console.log( a == b ); // true
```

`==`を使うとまず、暗黙的な型変換が行われる。そのため、`a`が文字列で`b`が数値の場合、`a`を数値に変換してから比較する。

### AND / OR演算子
`&&`と`||`は左辺から右辺に評価されるが、返り値が決まった時点で評価を終了する。
例えば,
```javascript
const a = 0;
const b = 2;
console.log(a && b); // 0
```
の場合、`a` がfaltyなので、この時点での評価である`a`を返す。
また、
```javascript
const a = 0;
const b = 2;
console.log(a || b); // 2
```
の場合は、`a`がfaltyなので`b`を評価するまで全体の評価が終了しない。`b`がtruthyなので、`b`を返す。

```javascript
const a = 0;
const b = 2;
const c = 3;
console.log(a || b || c); // 2
console.log(a || b && c); // 3 : a = falty -> b = truthy -> c = truthy
console.log((a || b) && c); // 3
console.log(a || (b && c)); // 3
```

よく、
```javascript
function hello(name) {
    if(!name) { // nameがfaltyならifに入る
        name = 'Guest';
    }
    console.log(`Hello, ${name}`);
}
hello(); // Hello, Guest
```
のように初期値を設定する際に使われる。
これを短く書くと
```javascript
function hello(name) {
    name = name || 'Guest'; // nameがfaltyならGuestを代入
    console.log(`Hello, ${name}`);
}
hello(); // Hello, Guest
```
のようになる。これは`||`演算子の左辺nameがfaltyなら右辺を評価するという性質を利用したものである。
nameに`Bob`が入っている場合は、`name`がfaltyでないので、`name`がそのまま使われる。
ただし、これは数値の0や空文字列もfaltyとして扱うため、注意が必要である。

なお、デフォルト引数を使っても同じことができる。
```javascript
function hello(name = 'Guest') {
    console.log(`Hello, ${name}`);
}
hello(); // Hello, Guest
```

また、
```javascript
let name = 'Bob';
name && hello(name);
```
のようにすることもできる。

### プリミティブ型とオブジェクト型

