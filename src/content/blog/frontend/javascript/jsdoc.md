---
title: 'JsDoc 3の使い方'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-07-02
tags: ["javascript", "document", "jsdoc"]
---

# Introduction
[JsDoc 3](https://jsdoc.app)はJavaScriptのAPIドキュメントジェネレーターでありソースコードに直接コードそのものと一緒にドキュメントを追加することでドキュメントサイトを生成することができる。

JsDocコメントはドキュメント化されるコードの直前に記述され、`/**`で始まり`*/`で終わる。`/*`や`/***`で始まるコメントはドキュメント化されない。

特殊な[JsDocタグ](https://jsdoc.app/#block-tags)を使用することでより詳細な情報を追加することができる。
例えば、クラスのコンストラクタであることを示すには`@constructor`タグを追加することでそれを示せる。

ES6でいくつか例を示す。
コンストラクター・インスタンスメソッド・staticメソッドを持つクラス
```javascript
/** Class representing a point. */
class Point {
    /**
     * Create a point.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    constructor(x, y) {
        // ...
    }

    /**
     * Get the x value.
     * @return {number} The x value.
     */
    getX() {
        // ...
    }

    /**
     * Get the y value.
     * @return {number} The y value.
     */
    getY() {
        // ...
    }

    /**
     * Convert a string containing two comma-separated numbers into a point.
     * @param {string} str - The string containing two comma-separated numbers.
     * @return {Point} A Point object.
     */
    static fromString(str) {
        // ...
    }
```

ESモジュールに関する例
ESモジュールを使用する場合は@moduleタグを使用してモジュールを定義できる。
例えば、`import * as myShirt from 'my/shirt'`を呼び出しているなら、`@module my/shirt`を追加することでJsDocにその旨を記述することができる。
仮に`@module`タグが値を持たなくても、JSDocはパスに従ってモジュールを特定使用とする。

JSDocのnamepathを使用し、JSDocのコメントからモジュールを参照するときは、`module:`という接頭辞をつけなければならない。`my/pants`のドキュメントを`my/shirt`のモジュールにリンクさせたい場合は`@see`を使ってドキュメント化しなければならない。
```javascript
/**
 * Pants module.
 * @module my/pants
 * @see module:my/shirt
 */
```

モジュールの各メンバーのnamepathは`module:`で始まりmodule名が続く。  
`my/pants`が`jeans`クラスをexportし、jeansにhemというメソッドがある場合、そのメソッドの名前は
```javascript
module: my/pants.jeans#hem
```
となる。

exportする場合もexport文の前にJsDocコメントを追加するだけであり、別名でexportする際にはブロックの最初にJsDocを書くことで文書化できる。
```javascript
/** @module color/mixer */

/** The name of the module. */
export const name = 'mixer';

/** The most recent blended color. */
export var lastColor = null;

/**
 * Blend two colors together.
 * @param {string} color1 - The first color, in hexadecimal format.
 * @param {string} color2 - The second color, in hexadecimal format.
 * @return {string} The blended color.
 */
export function blend(color1, color2) {}

// convert color to array of RGB values (0-255)
function rgbify(color) {}

export {
    /**
     * Get the red, green, and blue values of a color.
     * @function
     * @param {string} color - A color, in hexadecimal format.
     * @returns {Array.&lt;number>} An array of the red, green, and blue values,
     * each ranging from 0 to 255.
     */
    rgbify as toRgb
}
```
