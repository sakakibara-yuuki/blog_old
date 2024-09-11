---
title: 'JavaScriptの仕組み: #1 実行環境とスコープ'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-07-01
tags: ["javascript", "基礎", "基本"]
---

# Introduction
過去、NetScape Navigatorというブラウザが登場した。
このブラウザにはJavascriptというプログラミング言語が搭載されていた。
その後、MicrosoftがInternet Explorerというブラウザをリリースし、これにもJavascriptが搭載捺せたかった。
しかし、ライセンスの関係上、MicrosoftはJavascriptを使うことができなかった。
そこで、MicrosoftはJScriptという言語を開発し、これをInternet Explorerに搭載した。
その後、JavascriptとJScriptの互換性がなかったため、ECMAScriptという標準が策定された。
ECMAScriptはJavascriptのコアの部分を策定した仕様である。
JavascriptはECMAScriptという標準使用に基づいているプログラミング言語である。(というかECMAScriptを実装したものがjavascript以外は無い)

そのため,　JavaScriptはECMAScriptで定義された仕様以外にも多くの機能を持っている。

ブラウザ環境ではWeb APIsと呼ばれるブラウザの機能を利用するためのAPIがある。
これは、Javascriptからブラウザの機能を利用するためのAPIである。
画面の更新を行うDOM APIやHTTP通信を行うXMLHttpRequest APIなどがある。
nodejs環境では、ECMAScriptの仕様を実装した機能とモジュールを管理するCommonJSという仕様がある。
このようにJavascriptは環境によって使える機能が異なる。

JavascriptはJavascriptEngineと呼ばれるプログラムによって実行される。
JavascriptEngineの中で最もシェアがあるのはV8エンジンである。
JavascriptからWeb APIsを通してブラウザの機能を利用することができる。

## コードが実行されるまで
### 実行前コード
JavaScriptEngineはコードの実行前にコード・グローバルオブジェクト・thisを生成する。
グローバルオブジェクトはブラウザではWindowオブジェクト、nodejsではglobalオブジェクトである。WindowオブジェクトにWeb APIsが含まれる。
```javascript
window.alert("Hello world!"); # alertが出る
> undefined
this;
> Window http://localhost:3000/ # Windowオブジェクトが返る
```

### コンテキスト
コードを実行する際の文脈や状況をコンテキストという。そのコードが実行されるとき、どのような状況であるのかを表す言葉である。
ブラウザ上ではwindowオブジェクトやthisが用意されているので、これらをまとめたものがコンテキストとなる。

コンテキストには種類がある。
- グローバルコンテキスト:
    - 実行中のコンテキスト内の変数・関数
    - グローバルオブジェクト
    - this
- 関数コンテキスト: 
    - 実行中のコンテキスト内の変数・関数
    - arguments
    - super
    - this
    - 外部変数の5つ
- evalコンテキスト (eval関数を使った場合, evalが非推奨なので使わない)

つまり、どのコンテキストで実行されているかの分類である。
### コールスタック
コードが実行されるまでにグローバルコンテキストが生成される。
```javascript
function a() {
}
function b() {
  a();
}
function c() {
  b();
}
c();
```
のようなコードは下から順にコンテキストが積まれる。
```d2
grid-rows: 4
a(function a)
b(function b)
c(function c)
グローバル(c())
```
コールスタックの一番上にああるコンテキストが実行中のコンテキストである。
これは開発者ツールのsourcesのbreakpointでグローバルコンテキストを選択し、
Call Stackというタブがあるので、そこで確認できる。

### ホイスティング
コンテキスト内で宣言した変数や関数の定義をコード実行前にメモリに配置することを**ホイスティング**という。また、ホイスティングのことを**宣言の巻き上げ**ともいう。
以下の２つのコードは同じ結果を返す。
```javascript
function a() {
  console.log("a is called");
}
a();
```
```javascript
a();
function a() {
  console.log("a is called");
}
```
なぜならば、javaScriptでは**関数や変数の宣言をコード実行前にメモリに配置する**ためである。

変数の宣言には3つあった。
- let: ブロックスコープの変数の宣言
- const: ブロックスコープの定数の宣言
- var: 変数の宣言

#### varのホイスティング
```javascript
var b = 0;
console.log(b);
```
は動作するが、
```javascript
console.log(b);
var b = 0;
```
は`undefined`となる。
後者では変数`b`がメモリに確保されたあと、undefinedが代入され、`console.log`で実行した後に`b`に0が代入されるためである。

#### let・constのホイスティング
```javascript
console.log(b);
let b = 0;
```
varではエラーが出ないが、let・constでは`ReferenceError: Cannot access 'b' before initialization`となる。

**コンテキストが生成される際にホイスティングは行われる.**

なお、関数の宣言はホイスティングされるが、関数式はホイスティングされない。
```javascript
a();

function a() {
    console.log("a is called");
}
```
は動作するが、
```javascript
a();

const a = function() {
    console.log("a is called");
}
```
はエラーになる。

## スコープ
スコープとは実行中のコードから値と式が参照できる範囲のことである。
javascriptは5種類のスコープがある。
1. グローバルスコープ
1. スクリプトスコープ
1. 関数スコープ
1. ブロックスコープ
1. モジュールスコープ

### グローバルスコープとスクリプトスコープ
`type=text/javascript`でscriptタグを使うとjavascriptで書かれたスクリプトはグローバルスコープになる。

```javascript
let a = 0;
var b = 0;
function c() {}
debugger;
```
このコードでは`a`がスクリプトスコープに, `b`と`c`がグローバルスコープになる。
グローバルコンテキスト(window)が生成されると、グローバルスコープが生成される。
これにより、
```javascript
window.b = 1;
```
のようにグローバルスコープに定義することができる。
また、
```javascript
window.b = 1;
let b = 1;
```
のようにすると、`let`のスコープが優先されて、`b`はスクリプトスコープになる。
まとめると、
windowオブジェクトそれ自体がグローバルスコープであり、windowオブジェクトのプロパティはグローバルスコープになる。
なお、使い勝手の観点から一般的なスクリプトスコープもグローバルスコープとして扱われる。

### 関数スコープとブロックスコープ
関数スコープは関数内で定義された変数や関数が有効なスコープである。
```javascript
function a() {
    let b = 0;
    console.log(b);
}
a();
```
は通常通り実行できるが、
```javascript
function a() {
    let b = 0;
}
console.log(b);
a();
```
はエラーになる。これは`b`が関数スコープ内で定義されて、関数の外では参照できないためである。
また、`{}`で囲まれたコードを**ブロック**と呼ぶが、このブロック内で変数を定義するには`let`か`const`でなければならない。`var`で宣言した場合はブロックスコープが無視される。
```javascript
{
    let c = 1;
    console.log(c);
}
```
は動作するが、
```javascript
{
    let c = 1;
}
console.log(c);
```
はエラーになる。
また、
```javascript
{
    var c = 1;
}
console.log(c);
```
ではブロックが無視されるので動作する。

また、
```javascript
{
    function d() {
        console.log("d is called");
    }
}
d();
```
も動作する。このように関数宣言はブロックスコープを無視する。
また、
```javascript
{
    const d = function {
        console.log("d is called");
    }
}
d();
```
はエラーになる。関数式はブロックスコープを無視しないためである。

一般に、`if`や`for`などもブロックスコープを持つ。

### スコープとコンテキスト
スコープとコンテキストは異なる概念である。
スコープは変数や関数が参照できる範囲を表すが、コンテキストは実行中のコードの状況を表す。
今回はその対応関係を見ていく。
グローバルコンテキストは
- 実行中のコンテキスト内の変数・関数
- グローバルオブジェクト
- this

グローバルスコープはグローバルコンテキストの事項中の変数・関数のことである。
また、
関数スコープは関数コンテキストの中の変数・関数のことである。
### lexicalスコープ
コードを書く場所によって参照できる変数が変わるスコープのことを**lexicalスコープ**という。
また、コードを記述した時点で決定するため**静的スコープ**ともいう。
```javascript
let a = 2;
function fn1 () {
  let b = 1;
  function fn2 () {
    let c = 3;
    console.log(b);
  }
  fn2();
}
fn1();
```
では、`fn2`内で`b`を参照できるが
```javascript
let a = 2;
function fn1 () {
  let b = 1;
  fn2();
}
function fn2 () {
  let c = 3;
  console.log(b);
}
fn1();
```
では、`fn2`内で`b`を参照できない。
`fn1`で`b`を定義しているが、参照の有効範囲が`fn1`内であるためである。
最初になぜ`fn2`内で`b`を参照できたかというと、`fn2`内で`b`を参照するとき、`fn2`内に`b`がないか探し、なければ`fn1`内に`b`がないか探し、なければグローバルスコープに`b`がないか探すためである。
このように、自身のスコープよりの外側のスコープを参照できるのでこれを**外部スコープ**と呼ぶこともある。

```d2
direction: up
**.style.border-radius: 7
global scope: グローバルスコープ {
    style: {
        fill: "#FAFFAF"
        stroke: "#FAFFAF"
    }
    a, fn1
    function scope(fn1): 関数スコープ(fn1) {
        style {
            fill: "#96C9F4"
            stroke: "#96C9F4"
        }
        b, fn2
        function scope(fn2): 関数スコープ(fn2) {
            style {
                fill: "#3FA2F6"
                stroke: "#3FA2F6"
            }
            c
        }
    }
}
global scope.function scope(fn1) -> global scope.a, fn1
global scope.function scope(fn1).function scope(fn2) -> global scope.function scope(fn1).b, fn2
global scope.function scope(fn1).function scope(fn2) -> global scope.a, fn1
```

レキシカルスコープは外部スコープのことを指す場合もあるし、どのようにしてスコープを決定するかの仕様のことを指す場合もある。静的スコープなどの文脈では後者の意味で使われることが多い。

レキシカルスコープは関数コンテキストの
- 外部変数
に該当する。

### スコープチェーン
スコープが複数階層で連なっている状態をスコープチェーンと呼ぶ。
```javascript
let a = 1;
function fn1 () {
  let a = 2;
  function fn2 () {
    let a = 3;
    console.log(a);
  }
  fn2();
}
fn1(); // a=3
```
このような場合では`a=3`となる。
このようにスコープが複数階層で連なっている場合、変数を参照する際には一番内側のスコープから順に変数を探し、見つかったらそれを使う。なければ外側のスコープを探す。見つかった段階でその変数を使う。
なお、グローバルスコープとスクリプトスコープの変数名が同じ場合は、スクリプトスコープが優先される。つまり、グローバルスコープの方がスクリプトスコープよりも外側のスコープであることがわかる。
```javascript
let a = 1;
window.a = 4;
function fn1 () {
  function fn2 () {
    console.log(a);
  }
  fn2();
}
fn1(); // a=4
```
### クロージャー
レキシカルスコープの変数を関数が参照することを**クロージャー**という。
```javascript
function fn1() {
  let a = 1;
  function fn2() {
    console.log(a);
  }
  fun2();
}
fun1();
```
このクロージャーを使うことでいくつか独特の機能を作ることができる。
一つがプライベート変数の定義である。
２つめが動的な関数の生成である。
#### プライベート変数の定義
incrementを使ってカウントアップする関数を作る。
```javascript
function increment() {
    let num = 0;
    num = num + 1;
    console.log(num);
}

increment(); // 1
increment(); // 1
increment(); // 1
```
のようになってしまう。`num`を外部に持ち出すと`num`がどこかで初期化されてしまう恐れがある。
そこで、クロージャーを使ってプライベート変数を定義する。
```javascript
function incrementFactory() {
    let num = 0;
    function() increment() {
        num = num + 1;
        console.log(num);
    }
    return increment;
}

const increment = incrementFactory();
increment(); // 1
increment(); // 2
increment(); // 3
```

#### 動的な関数の生成
```javascript
function addNumberFactory(num) {
    function addNumber(value) {
        return num + value;
    }
    return addNumber;
}

const add5 = addNumberFactory(5);
const add10 = addNumberFactory(10);
const result = add5(10);
const result = add10(10);
console.log(result); // 15
```
このように、関数の生成時に引数を渡すことで、動的な関数を生成することができる。

### 即時関数
関数定義と同時に一度だけ実行される関数を**即時関数(IIFE)**という。
```javascript
let result = (function(仮引数){ retun 戻り値; })(実引数);
```
言ってしまえば、関数を定義してその後すぐに実行する関数である。
通常、関数式として定義した場合は`()`をつける必要がない。しかし、即時関数の場合は明示的に`()`をつける必要がある。

関数の中で定義されたprivateな値と外部の値を分けるために使われることが多い。
```javascript
let result = (function() {
    let privateValue = 0;
    let publicValue = 1;
    function privateFn() {
        console.log("privateFn is called");
    }
    function publicFn() {
        console.log("publicFn is called" + privateVal++);
    }

    return {
        publicValue,
        publicFn
    };
})();

c.publicFn() // public is called
c.publicValue // 10
```
