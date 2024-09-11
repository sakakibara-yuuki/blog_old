---
title: 'javascript基礎'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-06-30
tags: ["javascript", "基礎", "基本"]
---

# Introduction
scriptタグはhead内かbody内に記載する。
最も良い方法は　bodyタグの最後に記載すること
htmlは上から下に読み込まれるため、scriptタグがあるとそこで読み込みが遅くなるため。
```html
<h1>Hello world</h1>
<script>
  console.log('Hello world');
</script>
```

scriptタグの中にjavascriptのコードを記載することもできるが、実際はjavascriptのコードを記載するファイルを外部ファイルとして読み込むことが多い。

```html
<h1>Hello world</h1>
<script src="index.js"></script>
```

nodejsを使ってjavascriptのコードを実行することもできる。
```bash
ndoe index.js
```
変数の宣言には`let`を使う。
```javascript
let name = 'sakakibara';
```
変数の代入は
```javascript
name = 'sakakibara2';
```
定数は`const`を使う。
```javascript
const name = 'sakakibara';
```
変数は再代入可能だが、定数は再代入不可能。

javascriptではプリミティブ型とオブジェクト型がある。

プリミティブ型
- number
- string
- boolean
- undefined
- null

オブジェクト型
- object(key-value)
- array
- function

### 厳密等価と等価演算子
`===`と`==`は異なる。
`===`は厳密等価演算子で、型と値が等しいかどうかを判定する。
`==`は等価演算子で、値が等しいかどうかを判定する。

```javascript
1 === 1 // true
1 === '1' // false
1 == '1' // true
```

### Truthy, Falsy
任意の値を真偽値に変換するとき、truthyとfalsyに分けられる。
Falsyな値
- undefined
- null
- 0
- false
- ''
- NaN
これ以外がtruthyな値になる。

### 4つのfor文
- for: 決まった回数の繰り返し
- for-in: オブジェクトのプロパティを繰り返し
- for-of: 配列の要素を繰り返し
- foreach: 配列の要素を繰り返し

```javascript
let arrayObjects = {a: 1, b: 2, c: 3};
const array = [1, 2, 3, 4, 5];
for (let i=0; i<5; i++) {
  console.log(i);
}
for key in arrayObjects {
  console.log(arrayObjects[key]);
}
for (let value of array) {
  console.log(value);
}
array.forEach((value) => {
  console.log(value);
});
array.forEach((value, index) => {
  console.log(value);
  console.log(index);
});
```

### constractor
複数のオブジェクトを作成するとき、共通のプロパティを持つとする。
そのような場合、共通のプロパティを持つオブジェクトを切り出すことができる。
```javascript
const product1 = {
    name: 'apple',
    price: 120,
    sayInfo: () => {
        console.log(`apple: ${this.name}, price: ${this.price}`);
    },
};

const product2 = {
    name: 'banana',
    price: 220,
    sayInfo: () => {
        console.log(`banana: ${this.name}, price: ${this.price}`);
    }
}
```
このような場合、constractorを使うことで、以下のように書くことができる。
```javascript
class Product {
    # オブジェクト毎に異なるプロパティ
    constructor(name, price) {
        this.name = name;
        this.price = name;
    }
}

const p1 = new Product('apple', 120);
const p2 = new Product('banana', 320);
console.log(p1);
console.log(p2);
```
また、classにmethodを追加することもできる。
以下では`sayInfo`というmethodを追加している。
`sayInfo`はオブジェクトメソッドであるが、`static`をつけることでクラスメソッドにすることができる。
```javascript
class Product {
    # オブジェクト毎に異なるプロパティ
    constructor(name, price) {
        this.name = name;
        this.price = name;
    }
    # オブジェクト毎に共通のプロパティ
    sayInfo: () => {
        console.log(`name: ${this.name}, price: ${this.price}`);
    }
    static sayDetail: () => {
        console.log('This is product class');
    }
}
```
配列も内部的にはArrayというクラスを使って作成されている。
```bash
let array = [1, 2, 3, 4]
let array = new Array(1, 2, 3, 4);
```

**オブジェクトはconstで宣言してもプロパティの変更が可能。**
また、`object.key = value`でプロパティを追加することもで, `delete product.key`でプロパティを削除することもできる。
constで変更不可能にするためには、primitiveか`Object.freeze`を使う。

```javascript
class Product {
    # オブジェクト毎に異なるプロパティ
    constructor(name, price) {
        this.name = name;
        this.price = name;
    }
};
product = new Product('apple', 120);
product.name = 'banana';
product.stock = 5;
delete product.stock;
```
Object型の変数は参照であり、object.keyの実体はobjectから見たら参照の参照に格納されている。
そのため、constを使ってもプロパティの変更が可能。
なぜならばconstは定義した定数の参照先アドレスを変えるとエラーとなるが、参照の参照は変更可能だから。

#### スプレッド構文
オブジェクトのプロパティを展開することで、新しいオブジェクトを作成することができる。
```javascript
const product3 = { ...product1 };
console.log(product3);
```

### よく使うオブジェクト
#### Math
#### String
stringのwrapperオブジェクトとして、Stringがある。
数値やbooleanにも同様のwrapperオブジェクトがある。
stringにもプロパティやメソッドがある。
```javascript
const message = 'hello world';
console.log(message.length); // 11
console.log(message[1]); // e
console.log(message.indexOf('world')); // 6
console.log(message.includes('world')); // true
console.log(message.replace('world', 'hell')); // 'hello hell'
console.log(message.split(' ')); // ['hello', 'world']
console.log(message.split(' ').join(",")); // 'hello,world'
```
#### Date
日付を扱うためのオブジェクト。日付の変換や計算ができる。
```javascript
const now = new Date();
console.log(now);　// 現在日時
const date = new Date('2024-01-01');
console.log(date);　// Sun Jan 01 2024 09:00:00 GMT+0900 (日本標準時)
```
```
console.log(date);　 // Sat Jan 01 2024 09:00:00 GMT+0900 (日本標準時)
console.log(date.getFullYear());　// 2024 year
console.log(date.getMonth()); // 1 month
console.log(date.getDate()); // 1 day
console.log(date.getDay()); // 6 week
```

#### Array
配列にはオブジェクトを削除挿入するためのメソッドがある。
配列はdequeのようになっており、先頭と末尾に要素を追加削除することができる。
- shift: 先頭の要素を削除
- pop: 末尾の要素を削除
- unshift: 先頭に要素を追加
- reduce: 配列を要素毎に走査して、前の結果に現在の配列の要素を加えていく。

配列から特定の要素を検索するには、`indexOf`や`find`を使う。
配列の要素がprimitive型の場合は`indexOf`を使う。
配列の要素がobject型の場合は`find`を使う。
```javascript
const array = [1, 2, 3, 4, 5];
console.log(array.indexOf(3)); // 2
const objectArray = [{id: 1, name: 'apple'}, {id: 2, name: 'banana'}];
console.log(objectArray.find((object) => object.id === 2)); // {id: 2, name: 'banana'}
```
配列には真偽値の判定のために`every`や`some`がある。
```javascript
numbers = [1, 2, 3, 4, 5];
console.log(numbers.every((value) => value > 0)); // true
console.log(numbers.every((value) => value > 3)); // false
console.log(numbers.some((value) => value > 3)); // true
console.log(numbers.some((value) => value > 6)); // false
```
また、filterで特定条件に合致する要素を抽出することができる。
```javascript
numbers = [1, 2, 3, 4, 5];
console.log(numbers.filter((value) => value > 3)); // [4, 5]
```
各要素に処理を適用した結果を返すmapもある。
```javascript
numbers = [1, 2, 3, 4, 5];
console.log(numbers.map((value) => value * 2)); // [2, 4, 6, 8, 10]
```

### scope
javascriptは`script`要素毎に異なるスコープを持つ。
それぞれのモジュールを別々のjavascriptファイルに記載して、htmlで`script`要素で読み込むことができるが、それぞれのモジュールは異なるスコープを持つために、モジュール同士が連携できない。
```html
<script type="module">
    export const scopeA = "A";
</script>
<script type="module">
    // 異なるmoduleスコープの変数には直接アクセスできない
    console.log(scopeA); // => ReferenceError: scopeA is not defined
</script>
```
モジュールを別々のscript要素で読み込むと、それぞれのモジュールは異なるスコープを持つため、変数の参照ができない。
そのため、HTMLではscript要素でindex.jsのみを読み込むようにする。
index.js内でimportを使って他のモジュールを読み込む。
import文を使うことでモジュールはすべてscriptのスコープ内に読み込まれるため、連携が可能になる。
このようにHTMLから読み込むjavascriptファイルをjavascriptにおけるエントリーポイントとする。

### javascript と moudle 
[javascript vs module](https://blog.mizukami.sh/entry/2022/05/21/javascript-module)
[javascript module](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules#a_background_on_modules)

### Same Origin Policy
file:///から始まるURLは異なるoriginとして扱われる。
### npm init は必要か
