---
title: 'nextjs メモ'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-09-20
tags: ["nextjs", "memo"]
---

# Introduction
Next.jsのメモ
主にtutorialを見ながら進める

## Contents

## フォルダ構成
まず, 最初にプロジェクトを作成する場合に確認するべきものはフォルダ構成だ.

```bash
.
├── app
│   ├── dashboard
│   ├── layout.tsx
│   ├── lib
│   ├── page.tsx
│   ├── seed
│   └── ui
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public
│   ├── customers
│   ├── favicon.ico
│   ├── hero-desktop.png
│   ├── hero-mobile.png
│   └── opengraph-image.png
├── README.md
└── tsconfig.json
```
概ね, このような構成になっている.
- `/app`: 全てのページのルートであり, ロジックを含む
- `/app/lib`: アプリで使う関数を格納する, 再利用可能な関数やデータフェッチのための関数など
- `/app/ui`: アプリで使うUIコンポーネントを格納する. card, table, fortms.etc... 何かファイルを新しく保存するたび、ロードされる.
- `/public`: 画像やファビコンなどの静的ファイルを格納する
- 設定ファイル: `next.config.mjs`, `tsconfig.json`, `postcss.config.js` など

placeholderのデータがあると便利.
ここでは`/app/lib/placeholder-data.ts`に格納されている.

### TypeScript
`.ts`や`.tsx`のファイルがある. これらはTypeScriptで書かれている.
`/app/lib/definitions.ts`にデータベースへ返すための型定義が格納されている.

TypeScriptを使うことで, データのフォーマットのエラーを事前に検知することができる.

なお, 今回は手動でデータ型を宣言しているが, [Prisma](https://www.prisma.io/)をつかうことでより正確な型を取得することができる.

なんか最近良く見かけるのがpnpmだ. これも使う.

## CSSのスタイリング
`/app/ui`の中に`global.css`というフォルダがあるはずだ. これは全てのページで共通のスタイルを定義するためのファイルだ.

これをimportする. 通常はtop levelのコンポーネントでimportする.

```
// /app/layout.tsx
import '@/app/ui/global.css';

export default function RootLayout({children}): {children: React.ReactNode} {
  return (
    <html lang="ja">
        <body>{children}</body>
    </html>
  );
}
```
もちろん, `global.css`にtailwindの文を書いてtailwindを使うこともできる.
だが, 今回は無視する.

### CSS Modules
CSS Modules, つまりcssファイルをコンポーネントに紐づけることで, コンポーネントごとに(スコープを制限して)スタイルを定義することができる.

`/app/ui`にhome.module.cssというファイルを作り
```css
.shape {
    height: 0;
    width: 0;
    border-bottom: 30px solid black;
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
}
```
のようなファイルを作り, `/app/pages.tsx`でimport する.
```tsx
import styles from '@/app/ui/home.module.css';
...

export default function HomePage() {
  return (
  ...
    <div className={styles.shape}></div>
  ...
  );
}
```
のような感じで使う.

### `clsx`を使う
`clsx`はクラス名をつけたり外したりすることのできるライブラリである.
ステータスによって色を変えたい時などに使う.
支払い済み -> .paid, 未払い -> .unpaid など

主に状態毎にスタイルを変える時に使う.

## Fontsや画像の最適配信

cssをNextjsでどのように使うかについては紹介した.
ここではfontsや画像の適用方法について紹介する.

### フォント最適化とは何か?
フォントはデザイン上重要な要素であるが, フォントファイルは結構大きいため(源ノゴシックvaliableは13M), ページの読み込み速度を遅くする原因になる.

フォントの読み込みが遅いと,ページの読み込みが遅くなり, ユーザ体験が悪くなる.
<!-- 累積レイアウトシフ(Googleによって使用されているウェブサイトの体験とパフォーマンスを評価する指標である. )によると,  -->
ブラウザが最初にフォールバックフォント(指定されたフォントが指定された時間内に読み込まれない場合に表示される代替のフォント)を読み込み, レンダリングする.
その後, そのフォントが読み込みが成功すると, カスタムフォントに切り替わる.
この切り替えによって, レンダリング後のわずかな瞬間, レイアウトがずれることがある.
(通常, フォントはキャッシュされるため, 同一ドメインの他のページで同じフォントを使う場合は, この遅延は生じない.)
なお, ここで紹介した方法以外にも, 時間内にフォントが読み込まれない場合にずっとフォールバックフォントをを表示するという方法もある.

next.jsはnext/fontモジュールを使用することで, アプリ内のフォントを最適化することができる.
これはAstroでもあった機能であり, 現代webフレームワークでは標準的な機能である.

ビルド時にフォントファイルをダウンロードし, 他の静的ファイルと一緒に配信する.
これによって, フォントの読み込むためのダウンロードの時間を短縮することができる.

### primary fontの適用

```typescript
// /app/lib/fonts.ts
import { Inter } from 'next/font/goolge';
export const inter = Inter({subsets: ['latin']});
```
Google Fontを使う場合は, `next/font/google`を使う.
ここでは`Inter`のフォントを使い, そのサブセット(スタイルやフォントの太さなどが変更されているそのフォントの派生形)である`latin`を指定している.

```typescript
import {inter} from '@/app/lib/fonts';
...
<body className={`${inter.clasName} antialiased`}>...</body>
...
```
のようにすることでbody全体にそのフォントを適用することができる.(カスタムフォントは?)
`antialiased`はフォントのエイリアスをなくすためのtailwindでの設定である.


### 画像の最適化
`/public`直下のファイルが静的アセットとして配信される．
```html
<img
  src="/hero.png"
  alt="Screenshots of the dashboard project showing desktop version" />
```

めんどくさいのが, 画像のサイズの変更だ.
多様なデバイスに対応, 画像のサイズを変更する必要がある.
また, 画像のサイズが変更されると, レイアウトが変更されるおそれもある.
スクロールによってビューポートの外にある画像は遅延ロードする必要がある.
デバイスによって表示する画像を変更する必要がある.

next/imageをつかうことで, これらの問題を解決することができる.

`<Image>`コンポーネントを使うことができる.
```tsx
import Image from 'next/image';

<Image
  src="/hero-desktop.png"
  width={1000}
  height={760}
  className="hidden md:block"
  alt="Screenshots of the dashboard project showing desktop version" />
```

~widthやheightが具体的な数字として設定されてるじゃんと思うかもしれない.~
幅を1000px, 高さを760pxに設定している.
特に, これらはもと画像のアスペクト比を保持する必要がある.

また, Tailwindの設定だからわかりにくいが, `hidden md:block`は, モバイルデバイスでは非表示という設定である.

## ページレイアウトとルーティング
やっと, ページのレイアウトとルーティングについて紹介する.
やっとだ.

Nextjsはファイルシステムのルーティングをサポートしている.
つまり, それぞれのフォルダがurlの一部に対応しているということだ.
現在, フォルダは次の様になっているが,
`app`は`/`,つまりルートに.  
`dashboard`は`dashboard`に対応している.  
よって, `app/dashboard`は`/dashboard`というurlに関するページであると解釈される.

```bash
├── app
│   ├── dashboard
│   │   ├── customers
│   │   ├── invoices
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── lib
│   │   ├── data.ts
│   │   ├── definitions.ts
│   │   ├── placeholder-data.ts
│   │   └── utils.ts
│   ├── page.tsx
│   ├── seed
│   │   └── route.ts
│   └── ui
│       ├── acme-logo.tsx
│       ├── button.tsx
│       ├── customers
│       ├── dashboard
│       ├── fonts.ts
│       ├── global.css
│       ├── home.module.css
│       ├── invoices
│       ├── login-form.tsx
│       ├── search.tsx
│       └── skeletons.tsx
```

それぞれのroute毎に`layout.tsx`と`page.tsx`ファイルを作ることで, 別々のUIを持つことができる.
`page.tsx`はそのページを構成する特別なNexjsファイルであり, React componentをexportする.
これはそのページのコンテンツそのものであり, これが無いとページは表示されない.
App.tsxにはすでに`page.tsx`がある.
これは'/'に対応している.

ネストされたルートを作成するにはフォルダ同士をネストし, その中に`layout.tsx`と`page.tsx`を作成する.
`app/dashboard/page.tsx`は`/dashboard`に対応している.

```tsx
export default function Page() {
  return (
    <p>Dashboard</p>
  );
}
```
このように新しいディレクトリを作成し,　その中に`page.tsx`ファイルを作成することで, その新しいページを作成することができる．

`page.tsx`や `layout.tsx`のように, ページに特定の名前をつけることによって, その他の関連するファイルと同じディレクトリに配置することができる.
つまり, `page.tsx`だけが, public アクセスなのだ.
例えば, `/ui`や`/lib`ディレクトリは, `/app`ディレクトリの中に配置されている.

`layout.tsx`は, 複数のページで共通のレイアウトを定義するためのファイルである.
`/dashboard/layout.tsx`というファイルを作成する. 
```tsx
import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```
ここでは, `children`Propsをつけとる. childrenは`page.tsx`かその他のコンポーネントになる.

`layout.tsx`を使う利益の一つは, ナビゲーション時にページのレイアウトはサイドレンダリングされないとうことだ.
これは, 部分レンダリングとよばれる.

`app`にも`layout.tsx`があるが, これはroot layoutと呼ばれ, 必須である.
ここには`<html>`や`<body>`, `<meta>`タグが含まれる.

### メタデータ
メタデータにはいくつかの種類がある.
- `description`: そのサイトが何についているかを説明する
- `keywords`: サイトのキーワード, 検索エンジンによって使われる
- `og:title`: OpenGraphに使われる.
- `icon`: サイトのアイコン

nextjsにはメタデータを定義/追加するためのいくつかの方法がある.
- Config-based: 静的な`metadata`オブジェクト, `layout.js`や`page.js`内で動的な`generateMetadata`関数をつかう.
- ファイルベース: `facvicon.ico`などのファイルを作成する.大抵`public`ディレクトリに配置される.

`metadata`オブジェクトを使う場合.
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'This is a official ....',
  metadataBase: new URL('https://loclahost....')
};

export default function RootLayout() {
  // ...
}
```

このように記述すると, Nextjsは自動的にタイトルとメタデータをアプリケーションに追加する.

特定のページにカスタムにタイトルを追加したい場合は, そのページ自体にmetadataオブジェクトを追加することができる.
入れ子になったpageはのmetadataは, 親のmetadataを上書きする.

`/dashboard/invoices`での例

```tsx
import {Metadata} from 'next';

export const metadata: Metadata = { 
  title: "Invoices | Acem Dashboard",
}
```
これはこれで機能するが, 全てのページで同じタイトルが繰り返されている.
例えば, Acem(会社名)が変わった場合, 全てのページのタイトルを変更する必要がある.

そこで, 代わりに`title.template`ファイルを使うことで, タイトルのテンプレート化を行うことができる.

```typescript
// /app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadatqa = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard'
  }
  description: 'This is a official ....',
  metadataBase: new URL('https://loclahost....')
};

```

`%s`は特定のページタイトルに置き換えられる.

```tsx
// /app/dashboard/invoices/page.tsx
export const metadata: Metadata = {
  title: 'Invoices',
}

```
## ページのナビゲーション
ページ間を遷移できるようにリンクを作成する必要がある.
普通, ページを遷移するためには`<a>`タグを使う.
しかし, これはページ全体をリロードするため, ページ遷移が遅くなる.

`Link`コンポーネントというものがある.
これを使用することで, ページ間にリンクを作成することができる.

`<Link />`コンポーネントをつかうために, `/app/ui/dashboard/nav-links.tsx`を開き, `next/link`から`Link`をインポートする.
```tsx
// /app/ui/dashboard/nav-links.tsx

import Link from 'next/link';

export default function NavLinks() {
  return (
  ....
  <Link
    key={link.name}
    href={link.href}
  >
  <LinkIcon />
  </Link>
  ....
  )
  }

```
`<a href="...">`の代わりに`<Link href="...">`を使うことで, ページ遷移が高速化される.

なぜ, これで高速化されるのか?
Nextjsは自動的にルートセグメント毎にアプリケーションを分割している.
ブラウザは最初のロード時に, すべてのアプリケーションをロードする必要がある.

さらに, `Link`はブラウザのviewportに表示されるたび, 遷移積のページをバックグラウンドでプリフェッチする.
つまり, リンクをタッチする前に, そのページがすでにロードされている.

一般的なUIパターンとしてユーザーが現在いるページを他のリストとは異なる色で表現するケースがある.

これには現在のページのurlを知る必要がある.
そこではクライアント側で動作するために, `use client`を追加し,
`userPathname()`という関数をインポートする必要がある.

```tsx
'use client';

import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();
  //...
```

状態によってスタイルを変更するために, `clsx`を使う.
```tsx
'use client';
import clsx from 'clsx';

export default function NavLinks() {
  return (
    // ...
    <Link
      key={link.name}
      href={link.href}
      className={clsx(
        {'bg-sky-100 text-blue-600': pathname === link.href},
      )}
      >
    // ...
    </Link>
  )
}
```
