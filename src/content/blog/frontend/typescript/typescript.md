---
title: "Typescriptの基本"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-2.jpg"
pubDate: 2024-08-22
tags: ["typescript", "基本", "基礎"]
---

# TypeScript の基本

## Contents

## 型の定義

### 変数

変数に型を指定する. これが TypeScript の基本である.

```typescript
var a: T = value;
let b: T = value;
const c: T = value;
```

### プリミティブ

```typescript
let arg: number = 2;
let isDone: bool = false;
let color: string = "blue";
```

以下ではエラーが発生する.

```typescript
let number: string = "2";
number = "3"; // Ok
number = 3; // Error
```

### 配列

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)

```typescript
const array: number[] = [];
array.push(1); // Ok
array.push("Takuya"); // Error
```

もしくは

```typescript
const array: Array<number> = [];
array.push(1); // Ok
array.push("Takuya"); // Error
```

である. また, 複数の型を持つ配列は以下のように定義することができる.

```typescript
const array: (number | string)[] = [1, "Takuya"]; // Union Ok
const array: [number, string] = [1, "Takuya"]; // Ok
const array: Array<number, string> = [1, "Takuya"]; // Ok
```

### object

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/objects.html)

オブジェクト型自体は次のように定義する.

```typescript
{
  name: string;
  age: number;
}
```

```typescript
const 変数: {キー名: value, キー名: value, ...} = オブジェクト;
let 変数: {キー名: value, キー名: value, ...} = オブジェクト;
var 変数: {キー名: value, キー名: value, ...} = オブジェクト;
```

これは結局プリミティブ型と同じである.
下は具体例であり, プリミティブ型と同じであるが, "{"と"}"で括られているので,
プリミティブ型と同じであると気づきにくい.

```typescript
const user: { name: string; age: number } = {
  name: "Takuya",
  age: 22,
};
```

### any

any 型はどんな型でも代入できる.

```typescript
let user: any = { firstName: "Takuya" };
user = 3;
```

### 関数

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-type-expressions)

関数を"第一級オブジェクト"とした場合の型

```typescript
(name: string) => string;
```

仮引数を関数に適用する場合

```typescript
function someFunc(引数: 型, 引数: 型, ...): 戻り値の型 {
  return 戻り値;
}
```

より具体的な例

```typescript
function sayHello(
  firstName: string,
  formatter: (name: string) => string
): string {
  ...
  return 'Hello';
}
```

アロー関数の仮引数に型を指定する場合
**微妙に第一級オブジェクトとしての関数の型と異なるので注意.**

```typescript
let sayHello = (name: string): string => {
  return `Hello, ${name}`;
};
```

## 型の機能

### 型推論

- [公式はここ](https://www.typescriptlang.org/docs/handbook/type-inference.html)

TypeScript は型推論, つまり型を指定しなくてもその変数がどのような型であるのかを推論する機能がある.

```typescript
const age = 10;
console.log(age.length); // Error !
```

また, return も同じである.

```typescript
function createUser() {
  return { age: 10 };
}
const user = createUser();
console.log(user.length); // Error !
```

なお！！！
forEach は string 型として推測される.

```typescript
const names = ["Takuya", "Yamada"];
names.forEach((name) => {
  console.log(name.length); // Ok
});
```

### 型アサーション

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

型注釈と呼ばれる機能がある.
TypeScript が具体的な型を推論できない場合に, ユーザーが型を指定することができる.
たとえば, Web API の戻り値などは型を推論できないため, この機能が必要になる.
`document.getElementById`は`HTMLElement | null`を返す.
つまり, それが具体的に`div`なのか`input`なのかはわからない.

以下は javascript では通用するが, Typescript ではエラーが発生する.

```typescript
const myCanvas = document.getElementById("main_canvas");
console.log(myCanvas.width); // Error !
```

これは typescript が`myCanvas`の型を推論できないためである.
(というより, typescript は HTMLElement か null であると推測しているが, HTMLElement には width プロパティが存在しないためエラーが発生する.)

このような場合に開発者が TypeScript に型を指定する必要がある.

```typescript
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

### 型エイリアス

これまでは型といえば変数宣言や関数宣言の仮引数に型を指定していた.
しかし, これらの型を再利用し, コードの可読性を向上させるために, 型エイリアスを使用することができる.
型エイリアスは`type`という何らかのオブジェクトを生成するようなものではなく, 単に, 型に別名をつけることができる機能である.

以下はプリミティブ型の型エイリアス

```typescript
type Age = number;
const age: Age = 10;
```

以下はオブジェクト型の型エイリアス

```typescript
type Point = {
  x: number;
  y: number;
};

function printPoint(p: Point) {
  console.log(`x: ${p.x}, y: ${p.y}`);
}

printPoint({ x: 10, y: 20 });
printPoint({ x: 10, t: 20 }); // Error !
```

型が合っていたとしてもプロパティ名が異なる場合はエラーが発生する.

以下は関数型の型エイリアス

```typescript
type Formatter = (a: string) => string;

function formatString(name: string, formatter: Formatter) {
  return formatter(name);
}
```

オブジェクトのキー名を明記せずに型エイリアスを使用することもできる.

```typescript
// つまり,
type Label = {
  label: string;
};
// となるところを
// 以下で定義する.
type Label = {
  [key: string]: string;
};

const label: Label = {
  topTitle: "title of top page",
  topSubTitle: "title of subtitle",
  topFeature1: "title of feature 1",
  topFeature2: "title of feature 2",
};

// 以下はエラー
const hoge: Label = {
  message: 100, // stringが期待されているが,
  // numberが代入されている.
};
```

これはインデックスシグネチャと呼ばれる機能である.

### インターフェース

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)

インターフェースは型エイリアスと似ている機能だが, type とは異なりより豊富な機能を持っている.
多くはクラスと組み合わせて使用することが多い.

```typescript
interface 型 {
  キー名: 型;
  キー名: 型;
  ...
}
```

以下はインターフェースの具体例である.

```typescript
interface Point {
  x: number;
  y: number;
}

function printPoint(p: Point) {
  console.log(`x: ${p.x}, y: ${p.y}`);
}

interface Point {
  z: number;
}

// この時点でPointが更新されている.

printPoint({ x: 10, y: 20 }); // Error ! zがないため
printPoint({ x: 10, y: 20, z: 30 }); // Ok
```

このようにインターフェースは拡張が容易に可能である.
型エイリアスを利用した際には, 後から同名の型定義はできない.

```typescript
interface Point {
  x: number;
  y: number;
}

type Point = {
  x: number;
  y: number;
}; // Error !
```

#### interface とクラス

インターフェースはクラスの振る舞いを定義し, implements を使用してクラスに実装を強制することができる.

```typescript
interface Point {
  x: number;
  y: number;
  z: number;
}

class MyPoint implements Point {
  x: number;
  y: number;
} // Error ! zが実装されていないため
```

なお, オプショナルなプロパティを設定することで, オプショナルなプロパティを設定することができる.

```typescript
interface Point {
  x: number;
  y: number;
  z?: number;
}

class MyPoint implements Point {
  x: number;
  y: number;
} // Ok
```

#### interface の継承

また, インターフェースはインターフェースを継承することできる.

```typescript
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}
const cc: ColorfulCircle = { color: "red", radius: 42 };
```

#### interface vs type

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

オブジェクトの型を定義する場合, インターフェースと型エイリアスのどちらも利用することができる.
継承に関する細かな機能が違うが, どちらもだいたい同じような機能を持っている.

TypeScript の設計思想としては２つの機能は異なる.

- インターフェースはクラスやオブジェクトの**一側面を定義した型**, つまり, インターフェースにマッチする型の他に, それ以外のプロパティを持っていてることが前提.
- 型エイリアスはオブジェクトの型そのものを定義する.

クラスやオブジェクトの一部のプロパティを定義する場合はインターフェースを使用するのが適切.

### クラス

```typescript
class クラス名 {
  プロパティ: 型;
  メソッド() {
    ...
  }
}

class Point {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  moveX(n: number): void {
    this.x += n;
  }

  moveY(n: number): void {
    this.y += n;
  }
}

const point = newPoint(1, 2);
point.moveX(10);
```

#### クラスの継承

クラスは extends を使用して, 他のクラスを継承することができる.

```typescript
class Point3D extends Point {
  z: number;
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    super(x, y);
    this.z = z;
  }

  moveZ(n: number): void {
    this.z += n;
  }
}

const point3d = new Point3D();
point3d.moveX(10);
point3d.moveZ(20);
```

#### クラスと interface

```typescript
interface IUser {
  name: string;
  age: number;
  sayHello(): () => string;
}

class User implements IUser {
  name: string;
  age: number;

  constructor() {
    this.name = "";
    this.age = 0;
  }

  sayHello(): string {
    return () => `Hello, ${this.name} my age is ${this.age}`;
  }
}

const user = new User();
user.name = "Takuya";
user.age = 22;
```

#### クラスのアクセス修飾子

アクセス修飾子として以下の 3 つがある.
`public`, `private`, `protected`である.
これによって, メンバやメッソッドのアクセス範囲を制限することができる.
なお, 無指定の場合は`public`となる.

```typescript
class BasePoint3D {
  public x: number;
  private y: number;
  protected z: number;
}

const basePoint = new BasePoint3D();
basePoint.x = 1; // Ok
basePoint.y = 2; // Error !
basePoint.z = 3; // Error !

class ChildPoint extends BasePoint3D {
  constructor() {
    super();
    this.x = 1; // Ok
    this.y = 2; // Error !
    this.z = 3; // Ok
  }
}
```

## 頻繁に使われる型

<!--### Enum-->
<!---->
<!--### Generics-->
<!---->

### Union

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [TypeScriptのunion型はorです](https://qiita.com/uhyo/items/b1f806531895cb2e7d9a)

Union型は指定した型のいずれかに当てはまれば良いという性質をもつ型である. それぞれの型をUnionのメンバと呼ぶ.

```typescript
function printId(id: number | string) {
  console.log(id);
}
printId(101); // Ok
printId("202"); // Ok
printId({ myID: 22342 }); // Error !
```

TypeScriptはUnion型の全てのメンバに対して有効である場合にのみ,
その操作を許可する.
たとえば, `number`で受け取ったのに`string`で用意されているメソッドは使えない.

```typescript
function printId(id: number | string) {
  console.log(id.toUpperCase()); // Error !
}
```

このような場合には, 型ガードを使用することでエラーを回避することができる.

```typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    // id は string 型であることが確定している
    console.log(id.toUpperCase());
  } else {
    // id は number 型であることが確定している
    console.log(id);
  }
}
```

この場合は, 単純なプリミティブ型であったからよかったものの, もう少し複雑になったら対応が難しくなる. 例えば,

```typescript
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // x は string[] 型であることが確定している
    console.log("Hello, " + x.join(" and "));
  } else {
    // x は string 型であることが確定している
    console.log("Welcome lone traveler " + x);
  }
}
```

:::note{.note}
"Union"という名前にも限らず, メンバのプロパティの共通部分を持っているように見える.(特に最後の例などは)
これは非常に混乱する.
しかし, この名付けは適切であり, 型理論から由来を取っている.
`number | string`は"Union"という名前の通り, `number`の値か, `string`の値を持てる型である.
そして, 両方の型の共通部分だけが, Union型で使用できる.
:::

#### 余剰プロパティチェック

興味深いことに,以下ではエラーが発生しない.

```typescript
type A = {
  a: number;
};
type B = {
  b: string;
  x: number;
};
type C = A | B;

const c: C = { a: 1, x: 3 };
```

実はこれ, Union型の問題というより, TypeScriptが構造的部分型を採用していることによる問題であるのだが, ここで取り上げる.

この例では"A"型でも"B"型でもないのにそのUnion型である"C"型に代入されていることに違和感を覚えるかもしれない.
しかし, "C"型は
**"A"型以外のプロパティを持つことを許容している。**
つまり, "A"型のプロパティを持っているので"C"型に代入できるのである。

しかし, 通常はこのようなことを行うとエラーが発生する.

```typescript
const a: A = { a: 1, x: 3 }; // Error !
```

これは先程の説明と矛盾しているように見える.
しかし, 矛盾していないのである. この問題の核心は, このエラーはコンパイルエラーではないことにある.

このエラーは**余剰プロパティチェック**と呼ばれるものである.
先程の例のように定義した変数`a: A`には余剰のプロパティである`x`が含まれていた.
しかし, "A"型として定義しているため, `a`は`x`にアクセスすることができない.
このような場合, プログラマーのミスである可能性が高いため, TypeScriptは余剰プロパティチェックを発生させる.

余剰プロパティチェックはオブジェクトリテラル, つまり,

```typescript
const a: A = { a: 1, x: 3 }; // Error !
```

のように変数宣言した場合に発生する.
つまり,

```typescript
const obj = { a: 1, x: 3 };
const a: A = obj; // OK
```

このようにすれば余剰プロパティチェックは発生しない.

ここで, 最初の例について考えてみると, `c`にはオブジェクトリテラルが代入されているため, 余剰プロパティチェックが発生するはずである.

しかし, **Union型について余剰プロパティチェックが行われる場合, Union型のメンバのどれかに存在するプロパティは全て許可される**という仕様になっている.[^unioncheck]

[^unioncheck]: [typescript issue](https://github.com/microsoft/TypeScript/issues/38024)

#### 判別可能なUnion型(discriminated unions)

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

通常, Union型は型の絞り込みが複雑になりガチである.
そこで, Unionを構成する型に各型を判別するためのプロパティ(ディスクリミネータと呼ぶ)を付与することにより, Union型の絞り込みを行うことができる.
なお, ディスクリミネータとしてはリテラル型を使用することが多い.

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

そして, この絞り込みは以下のように行う.

```typescript
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
}
```

もしくは`switch`文を使用して

```typescript
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
  }
}
```

### リテラル

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)

`|`でデータ(文字列や数値)を列挙すると, そのデータのみを許可する型を定義することができる.  
これをリテラル型と呼ぶ.

```typescript
変数: 許可するデータ | 許可するデータ | ...
```

具体的には以下のようになる.

```typescript
let postStatus: "draft" | "published" | "deleted";
postStatus = "draft"; // Ok
postStatus = "drafts"; // 型宣言に無い文字のためエラー
```

リテラル型は数値にも適用できる.
以下は関数の返り値が数値のリテラル型である例である.

```typescript
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

<!--### never-->

## Tips

TypeScript でよく使われる高度な機能について説明する.

### Optional Chaining

プロパティに`?`をつけることで,
プロパティが存在するかどうかの条件分岐を簡単に行うことができる.

`null`または`undefined`の場合, 実行時エラーは発生しない.

```typescript
interface User {
  name: string;
  social?: {
    twitter: boolean;
    facebook: boolean;
  };
}

let user: User;

user = { name: "Takuya", social: { twitter: true, facebook: true } };

console.log(user.social?.twitter); // true

user = { name: "Takuya" };
console.log(user.social?.twitter); // undefined だが実行時エラーは発生しない.
```

### Non-Null Assertion Operator

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-)

`--strictNullChecks`を指定してコンパイルする場合,
TypeScript は通常`null`の可能性がある変数にアクセスする際にエラーを発生させる.
`null`でないことを知らせる(注釈する)ために`!`を使用する.

```typescript
function processUser(user?: User) {
  let s = user!.name;
}
```

### 型ガード

- [typeof の公式はここ](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
- [型ガードの公式はここ](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards)

typeof を使って型を絞り込むことができる.  
typeofはjavascriptの機能で, 値の型を返す.
ただ, javascriptの機能であるので, 返せる型は`"string"`, `"number"`, `"boolean"`, `"symbol"`, `"undefined"`, `"object"`, `"function"`のみである.

`typeof` は `keyof` と似ているが機能は異なる.
TypeScript では if や switch 文を使って型を絞り込むことができる.
その条件分岐で型を絞り込むことを型ガードと呼ぶ.

```typescript
function addOne(value: number | string) {
  if (typeof value === "number") {
    return value + 1;
  }
  return value + "1";
}
```

型ガードを用いることで, as を使用する型アサーションよりも安全に型を絞りこむことができる.  
optional のプロパティも型ガードで null チェックを行うことができる.

```typescript
// infoがプロパティ
type User = {
  info?: {
    name: string;
    age: number;
  };
};

let response = {};

const user = response as any as User;
// user.infoが存在すればnameを取得するという型ガード
if (user.info) {
  console.log(user.info.name);
}
```

### keyof

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)

型に対して`keyof`を使用することで, その型のプロパティ名のリテラル型の Union 型を取得することができる.

:::note{.note}
なお, 取得できるのは**文字列ではなく, リテラル型**であるので注意する.
:::

これは, オブジェクトのプロパティ名を key としてその value を取得する際に使用される.

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

type UserKey = keyof User; // 実質 "name" | "age" | "email" のリテラル型
const key1: UserKey = "name"; // Ok
const key2: UserKey = "phone"; // Error !

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = {
  name: "Takuya",
  age: 22,
  email: "test@gmail.com",
};

const userName = getProperty(user, "name"); // Ok
const userGender = getProperty(user, "gender"); // Error ! genderはUserに存在しない.
```

過去, ここで[躓いた](./typescript_react/#typeof-obj-%E3%82%92%E4%BD%BF%E3%81%86)ことがある.

### Index Signature

- [公式はここ](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

Index Signature を用いることで, オブジェクトのプロパティが可変な場合,　プロパティの型をまとめて定義することができる.

```typescript
type SupportVersions = {
  [env: string]: boolean;
};

let versions: SupportVersions = {
  102: true,
  102: true,
  103: false,
  "104": false, // Error !
};
```

<!--
### readonly

### unknown

### Async/Await

### 型定義ファイル
-->
