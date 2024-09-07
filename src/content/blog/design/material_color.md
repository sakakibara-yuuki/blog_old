---
title: "Material Color"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-09-06
updatedDate: 2024-09-06
tags: ["material", "design"]
---

# Introduction

- [公式はここ](https://m3.material.io/styles/color/roles)

Material Designを次に進めたものがMaterial Themingである.
Material YouはMaterial Themingの次の進化であり, ユーザーが自分自身を表現するためのデザインを提供する.
Material YouはMaterial Design 3の一部である[^glossary].

[^glossary]: [Glossary - Material Design 3](https://m3.material.io/foundations/glossary#49d47276-0230-4b2c-83bd-88fc349ff808)

## Contents

## 色の役割とは何か?

以下では色の役割について説明する.
Material DesignにはいくつかColor Roleがある.

Color Roleはpaint by numberキャンパス(1950年代にアメリカで流行した絵画キット. 絵の分割された領域に数字が書かれており, 対応する絵の具を塗るだけで絵が完成する)における数字のようなものである.
Color RoleはUIの要素間でそれぞれ結合する組織であり, どの色をどこに配置するかということを意味する.

また, Color Roleをトークンとして扱うことで, デザインシステムをより効果的に管理することができる.

### 一般的な概念

Color Roleには様々あるが, 以下に一般的なcolor roleの名前, 概念を示す.

- Surface: backgroundや画面の大きな低強調領域に使われるrole.
- Primary, Secondary, Tertiary: 強調や強調しない前景要素に使われるアクセントカラーに使われるrole.
- Container: ボタンのような前景要素の塗りつぶし色として使われるrole. テキストやアイコンには使われない.
- On: この単語で始まるroleはテキストやアイコンの色を対となる親の色の上に置くことを示す. 例えば, `on primary`はprimary塗りつぶし色に対するテキストやアイコンに使用される.
- Variant: この単語で終わるroleは, 非variantのペアより強調度の低い代替を提示する. 例えば, `outline variant`は`outline color`のあまり強調されないバージョンである.

また, 適切やペアやレイヤーで実装するように注意する必要がある.
例えば,

![Pairing and layering colors good](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lg828-map-do.png?alt=media&token=eea319f1-b5f5-45d5-94fb-d03cc37195f3)

- (1) primary
- (2) on primary
- (3) secondary
- (4) on secondary container

で構成されるボタンはコントラストレベルの可視性を保つために使われる.
対して,

![Paring and layering colors bad](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lgp0q-map-dont.png?alt=media&token=a4a2d93d-9e6c-4e67-bcda-82fe93f490a1)

- (1) primary
- (2) primary container
- (3) secondary container
- (4) on surface

で構成されるbuttonは醜い.

primary, secondary, tertiary,は全てsurfaceに対するroleである.
そのため, まず, surfaceについて説明する.

> primary colorを調べると"三原色"という説明が出てくるかもしれない.
> しかし, それが赤, 青, 黄色であるとは限らない.
> もともと, primary colorは"原色"を意味し, それが赤, 青, 黄色であるとは限らないのだ.
> 色の選択は恣意的であり, 初期のカラー写真などではオレンジ, 緑, 紫などが使われていた.
> 以降の説明でも, primary colorは緑である.
> また, secondary colorは"2次色"を意味し, 2種類のprimary colorを均等に混ぜた色を指す.
> 例えば, 緑と赤を混ぜると黄色になる.
> そして, tertiary colorは"3次色"を意味し, デジタルの文脈では1次色と2次色を均等に混ぜた色を指す.　2次色が1次色を均等に混ぜるという意味なので, 例えば, 0.5緑と0.5赤に1緑を混ぜるため, 1.5緑と0.5赤になる. つまり3:1で緑と赤を混ぜることになる.
> 注意すべきは, 原色や色を混ぜるという前提として"色相環"が用いられることが多い. 色相環とはどの色とどの色を混ぜるとどの色になるのかを示す円環状の図のことである. しかし, 通常, 色相環は様々であり, RGB色相環, RYB色相環, CMY色相環などがある. おそらく今回はRBG(CMY)色相環を使っている.

![色相環](https://www.adobe.com/jp/creativecloud/design/discover/secondary-colors.html)

また, Material Designではそれぞれの色のジェネレーターである[Material pallet generator](https://www.materialpalette.com/green/light-green)が提供されている.
また, [Material theme builder](https://material-foundation.github.io/material-theme-builder/)のようなツールも提供されている.

<div style="text-align: center;">
<iframe src="https://material-foundation.github.io/material-theme-builder/" frameborder="0" height="600" width="500"></iframe>
</div>

つまり, どの色をどこで使うかを決めるだけでいい. paint by numberキャンパスのように.

### Surface

より自然な背景にはsurface roleを使い, カードのようなコンポーネントにはcontainer roleを使う.

surface には3つのroleがある.

- surface: 背景のデフォルト色
- on surface: 任意のsurfaceに対するテキストやアイコンの色
- on surface variant: 任意のsurfaceに対するテキストやアイコンの控えめな強調色

![light theme surface and on surface](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lwkz4-%5B1P%5Dcolor-surface-on-roles-light.png?alt=media&token=a1d2c87e-4236-47c9-ba66-aeecca5206a8)
以上はライトテーマでのsurfaceとon surface

強調のレベルに基づいて名付けられる5つの
surface container rolesがある.

- surface container lowest
- surface container low
- surface container
- surface container high
- surface container highest

見てわかるが, highestに近づくほど強調される.
以下はライトテーマとダークテーマにおける5つのsurface contaienr roleの例である.
![five level surface](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Flmjmdf3w-%5B1P%5Dcolor-surface-core-with-container.gif?alt=media&token=d77b9fba-d5e2-4c43-9c69-dcaed049ec75)

surface roleの最も一般的な使い方として背景としてsurfaceを使い, `<nav>`にsurface containerを使うというものがある.
![surface and surface container](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lxzxz-%5B1P%5D%20color-surface-pairs_example.png?alt=media&token=80e9695a-1e6c-4d7b-9bfe-a93c4f9b7b51)

- (1) surface
- (2) surface container

全てのカラーマッピング(特にsurface)は各画面サイズのクラス(デバイス毎の画面サイズ)を通じたレイアウト領域で同じであるべきである.
例えばモバイルとタブレットでも, `<body>`はsurfaceを, `<nav>`はsurface containerを使うべきである.
![mobile and tablet](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lzo6a-%5B1P%5D%20color-surface-mapping-1.png?alt=media&token=2ea0ec0c-dc62-4973-b70d-0438171b5478)

- (1) surface
- (2) surface container

必要な階層, 機能エリア, デザインロジックなどに応じて, 色が一貫して適用されている限り, 巨大な画面クラスのサイズにadd-on surface を使うことという手がある.
![add-on surface](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Flmjmkt4k-%5B1P%5D-color-surface-mapping-surface-complex.gif?alt=media&token=975addc3-1a35-4b94-a443-228bcf54b73c)

この例では, `<body>`と`<nav>`の領域が画面サイズクラス(surface と surface containerそれぞれ)を通して同じcolor roleを持っていて, 巨大な画面サイズに他のsurface containerの変化バージョンを追加している.

デフォルトでは, ナビゲーションバー, メニューやダイアログなどのneutral-coloredのコンポーネントは特定のsurface container roleにマップされる.
しかし, それらのroleはユーザーのニーズに合わせて制作者によって再度マップされる.

![default surface](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4m1sb8-%5B1P%5D%20color-surface-mapping-surface-container-examples.png?alt=media&token=0c236365-a68f-4cdd-b8e2-6d803e502a11)

以上はコンポーネントに適用されるデフォルトのsurface container roleである.

- (1) surface container low
- (2) surface container
- (3) surface container high
- (3) surface container highest

#### 逆の色(補色)

逆のrolesはコンポーネントに対して選択的(あなたの自由に)に適用され, 周囲のUIのと逆の色を構成し, コントラスト効果を生み出す.

- Inverse surface: surfaceに対しコントラストになる要素の背景の塗りつぶし
- Inverse on surface: inverse surfaceに対するテキストやアイコンの色
- Inverse primary: inverse surfaceに対するテキストボタンのようなaction可能な要素

![inverse surface](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4mi4ws-inverse-swatch.png?alt=media&token=63077b34-ae6c-4ac2-a387-8b7a28966343)

ライトテーマでのカラースキーマにおけるinverse surface, inverse on surface, inverse primary role

![snackbar](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4mip6w-inverse-surface.png?alt=media&token=0933c268-4122-4ee5-af39-1255ce802910)

- (1) 背景に対するInverse surface
- (2) テキストに対するInverse on surface
- (3) テキスト, ボタンに対するInverse primary

### Primary (原色, 1次色)

- Primary: 強調的な塗りつぶし, surfaceに対するテキスト, アイコン.
- On primary: primaryに対するテキストやアイコンの色.
- Primary container: surfaceに対し独立した塗りつぶし色, FAB(❤)のようなkey要素に使われる.
- On Primary container: primary containerに対するテキストやアイコンの色.

![primary colors](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lhky0-primary-swatch.png?alt=media&token=1b783e3a-bf9f-4e2a-bfa2-82ca87fb0f38)
primary color roleはprimaryとprimary containerとそれらに対する"on" colorを含む.

![primary](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lmy0g-role_primary.png?alt=media&token=dc2ed8b4-54d8-400c-b0fc-874943cc3706)

- (1) On primary
- (2) Primary
  ![primary container](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lnhda-role_primary_container.png?alt=media&token=1750a738-d5f5-4ed2-87dd-db1288b257ff)

- (3) On primary container
- (4) Primary container

### Secondary(2次色)

フィルターチップのようなUIであまり目立たないコンポーネントにはsecondaryを使う.
役割は4つある.

- Secondary: surfaceに対する目立ちにくい塗りつぶしテキスト, アイコン
- On secondary: secondaryに対するテキストやアイコンの色
- Secondary container: トーンボタンのような劣性のコンポーネントのsurfaceに対するあまり目立たない塗りつぶし色
- On secondary container: secondary containerに対するテキストやアイコンの色

![secondary colors](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lpesx-secondary-swatch.png?alt=media&token=4a9c75a1-5ea6-4e64-beff-65dd021380c9)

以上はSecondary color roleはsecondaryとsecondary containerとそれらに対する"on" colorを含む.

![secondary](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lqlc8-role_secondary.png?alt=media&token=add827f1-9383-4394-8c27-a5106231e7aa)

- (1) Icon: On secondary Container
- (2) Secondary Container

### Tertiary

tertiary roleの役割はprimary colorとsecondary colorの間のバランスを取ったり, 入力フィールドのような要素に注目させるための対称的なアクセントに使う.

- Teritary: surfaceの目立つ塗りつぶしテキスト, アイコンの補助
- On tertiary: tertiaryに対するテキストやアイコンの色
- Tertiary container: 入力フィールドのようなコンポーネントのsurfaceに対する補完的なコンテナの色.
- On tertiary container: tertiary containerに対するテキストやアイコンの色

![tertiary colors](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lss2v-tertiary-swatch.png?alt=media&token=29e86788-4f31-4d08-a365-e77918182568)

Tertiary color roleはtertiaryとtertiary containerとそれらに対する"on" colorを含む.

Tertiary color roleはデザイナーの裁量によって適用される.
より幅広い色彩表現を提供するためのものである.

![tertiary](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4lti8g-Tertiary%20Container.png?alt=media&token=665ee68a-ea40-49f6-8f12-08625592409c)

- (1) On tertiary
- (2) Tertiary

### Error

Error roleはエラーであることを伝えるために使われる. 例えば, 間違っているpasswordやテキストフィールドなどである.

Error roleには4つのroleがある.

- Error: 塗りつぶしアイコン, テキスト, 緊急性に関するsurfaceに対する注意を引くための色
- On error: errorに対するテキストやアイコンの色
- Error container: surfaceに対する注意を引く塗りつぶし色
- On error container: error containerに対するテキストやアイコンの色

### Outline

surfaceに対するoutlineの色は2つ.

- Outline: テキストフィールドのoutlineのような重要な境界
- Outline variant: 分割線のようなデコレーションの要素

![outline and outline variant](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4m9qsp-outline-swatch.png?alt=media&token=48912c85-a0f2-4406-9280-95ce203eea7f)
light themeにおけるcolor schemeのoutlineとoutline variantの色
![outline example](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4ma6y6-outline-components.png?alt=media&token=39187b8b-7f17-428a-8f65-8b620ac157fa)

- (1) コンテナ境界に対しoutlineを使ったテキストフィールド
- (2) 分割線に対しoutlineを使ったリストアイテム

以下、注意点
![different contrast](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4mb1t4-outline-don't-1.png?alt=media&token=13ec37c9-30da-441f-8a3a-0c65b46046c1)
分割線に対しoutlineを使っては行けない. なぜなら, それ(分割線)は異なるコントラストが要求されているからである. 代わりにoutline variantを使うべきである.

![multiple elements](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4mbmcb-outline-don't-2.png?alt=media&token=fa7eaf72-05b9-498f-b0c6-f2685308565a)
カードのような複数の要素を含むコンポーネントに対してoutlineを使うべきではない. 代わりにoutline variantを使うべきである.

![clusterd](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4mcbte-outline-don't-3.png?alt=media&token=6c38eaf8-fbe7-4b31-b0fe-83b40e78ead4)

チップスのようなクラスター化された要素, もしくは互いに近接しているUI要素に対してoutline variantを使うべきではない.
代わりに outlineを使ったり, surfaceとのコントラストが3:1となる他の色を使うべきである.

![hierarchy](https://firebasestorage.googleapis.com/v0/b/design-spec/o/projects%2Fgm3sandbox%2Fimages%2Fln4mcv4g-outline-don't-4.png?alt=media&token=a9936e94-ef81-4e03-9cb8-2bbf89b2d777)

視覚的な階層やターゲットに対する視覚的な境界を作るためにoutline variantを使うべきではない.代わりに, outlineを使ったり, surfaceとのコントラストが3:1となる他の色を使うべきである.
