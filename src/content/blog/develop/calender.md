---
title: 'Nextjs Calendar開発日記'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-09-23
tags: ["nextjs", "開発日記"]
---

# Introduction
Nextjsでカレンダーを作成する際の開発日記です。
## Contents
## 9/23 : 24:00
開発を始める.
UIに関しては予め少しだけ考えている.

ディレクトリの構成を変える.
globals.cssとかfaviconとかをとりあえずuiに移動.
faviconって`ui`か？publicな気もする.

faviconはpublicっぽい.

カスタムフォントはどこに移動する?
アプリ全体で使用するからapp直下かなぁ..

app直下にuiを作ってglobals.cssもpage.module.cssも移動!
page.tsx, laout.tsx以外はuiディレクトに移動する.
'typescriptとnextjsで作る実践...'の本を呼んでるけど, これPage routeの書き方になっていて, 参考にならない.
...
[example](https://github.com/vercel/next.js/tree/canary/examples/with-absolute-imports)
ではcomponentsディレクトリをappと同じ階層に作っている.
これがベストか?

そもそもApp routerなのにページと関係ないディレクトリを`app`以下に作るのはどうかな...いいのか..?
ファイルならいいか...

- その階層以下に関係のあるファイルはその階層に置く.
  - そのための`page.tsx`などの特殊な名前のファイルがある.
- urlに対応しないようなディレクトリはその階層に置かない.

ようにしよう. (なるべく)

faviconもそうだけどfontsも配信するからpublicに置こうかな...

<details>
<summary>
chatgptに聞こう
</summary>
```
あなた:
NextjsでApp Routerを採用する場合, app直下のディレクトリにはurlと対応の関係ないファイルはどこにおくべき？新たなディレクトリを作成してその中に格納すべき？それともファイルのまま存在させておくべき？そもそもpage.tsxなどの特殊な名前のファイルがあるのはそれ以外の名前をもつファイルの存在を許すためだとおもうから.

ChatGPT:
ChatGPT

Next.js 13のApp Routerを使用する場合、appディレクトリ直下には、URLと対応するページやAPIのエントリポイントとなるファイルが配置されます。page.tsx や layout.tsx といったファイルは特定の役割を持ち、URL構造に基づいてページやレイアウトを定義します。

それ以外の、URLに対応しないユーティリティファイルやコンポーネントは、appディレクトリ内に置くのではなく、通常は appディレクトリの外に新たにlibやcomponentsといったディレクトリを作成し、その中に格納するのが一般的なベストプラクティスです。これにより、ディレクトリ構造が整理され、URLと直接関連しないロジックや再利用可能なコンポーネントが明確に区別されます。

Next.jsでは、特殊なファイル（page.tsx, layout.tsx など）はURLと対応するために存在しており、その他のファイルは appの外でモジュールとして使用されるべきです。例えば:

css

app/
  dashboard/
    page.tsx
  profile/
    page.tsx
components/
  Header.tsx
lib/
  api.ts

このように構成することで、プロジェクト全体が整理され、保守性も向上します。
```
確かに??
```
Next.jsでは、特殊なファイル（page.tsx, layout.tsx など）はURLと対応するために存在しており、その他のファイルは appの外でモジュールとして使用されるべきです。
とありますが, それはなぜ？
ChatGPT:
ChatGPT

Next.jsで page.tsx や layout.tsx などの特殊なファイルが app ディレクトリに存在し、その他のファイルを app の外に配置すべきとされる理由は、プロジェクトの構造を整理し、役割を明確に分けるためです。いくつかの理由を挙げると以下の通りです。
1. URL対応の明確化

app ディレクトリ内のファイルやディレクトリは、URL構造と対応するように設計されています。page.tsx はそのディレクトリのURLに対応するページを生成し、layout.tsx はそのディレクトリ以下の全ページに共通のレイアウトを適用します。こうすることで、URLとファイルシステムの関係が一貫性を持ち、ページ構造の理解が容易になります。

    app/dashboard/page.tsx → /dashboard のURLに対応
    app/profile/page.tsx → /profile のURLに対応

2. 役割の明確化

Next.jsは、ファイルシステムベースのルーティングを採用しており、app ディレクトリのファイルが直接ルートやページの生成に関与します。そのため、URLと無関係なコンポーネントやユーティリティ関数を app ディレクトリ内に置くと、プロジェクトの役割分担が不明確になり、ファイル構造が混乱する可能性があります。

    appディレクトリ内のファイル: URLと直接対応し、ページやレイアウト、APIエンドポイントを定義
    appディレクトリ外のファイル: 再利用可能なコンポーネント、APIコールやロジックのヘルパー関数など、ページとは直接関連しないコード

3. 保守性の向上

ファイルを適切に分離することで、プロジェクトが大きくなった際にも、管理が容易になります。URLと対応しないファイルが app の外にあることで、プロジェクトが整理されていて見通しがよくなり、保守や変更が簡単になります。特に、再利用可能なコンポーネントやロジックを別ディレクトリに置くことで、他の部分でも使いやすくなります。
4. 拡張性のため

将来的にプロジェクトが大きくなった際にも、ファイル構造が整理されていると、機能を追加しやすくなります。appディレクトリ内にページやレイアウトが集約され、それ以外のロジックが外部に分離されていることで、変更が局所的に留まるため、他の機能に影響を与えるリスクが減ります。

このため、Next.jsでは app 内のファイルはURLやページに関わるものに限定し、その他のファイルを外部に配置することが推奨されています。
```

</details>

ということで`app`外に`components`ディレクトリを作成してそこにコンポーネントを格納することにしました.
Astroもそうだったしね!

でも, fontsの設定でsrcの指定が`../`みたいになるのが気になる...
しょうがないか...
`app`直下に`components`や`lib`を...入れよう!

### 9/23 0:35
storybookを導入する.
コンポーネント駆動開発じゃぁー!!
```bash
npx storybook@latest init
```

StorybookのEslintがflat configじゃないのが気になる...
[[Bug]: Eslint new flat configuration support](https://github.com/storybookjs/storybook/issues/24326)
なる...ほど...?
`FlatCompat`を使うと, 古い設定をflat config内で使える...?
まぁ, いいか...
古いスタイルで行こう.

というか`eslint`がそもそもversion 8だったわ.

つかれたなぁ...

storiesファイルに`component`ディレクトリみたいなものを作成する必要があるのか？
なんかよく見たら`stories`とは別にすでに作った`components`ディレクトリに`.stories.tsx`を作成している[人](https://qiita.com/Kontam/items/299078aceb1988e8ac66)もいる

[いいの見つけた](https://blog.microcms.io/storybook-react-use/)!
やっぱmicroCMSよね.

ここでも確かに`components`ディレクトリに`.stories.tsx`を作成している.
しかも面白そうなaddon紹介してんじゃーん.
- [viewport](https://storybook.js.org/addons/@storybook/addon-viewport)
- [storybook-addon-figma](https://storybook.js.org/addons/storybook-figma)
これ以外にも
- [@storybook/addon-designs](https://storybook.js.org/addons/@storybook/addon-designs)
がある. こっちのほうが人気なのでこっちを入れよう.

`.stories/preview.tsx`に`viewport`を追加するといいらしい.
じぶんはgalaxyなので`galaxys9`を追加する.

というか[コンポーネント駆動開発](https://www.componentdriven.org/)についてあった...
後で読もう...

それと`storybook-addon-design`について...
はまぁいいか.
うーん, 使い方がよくわからん...
とりあえずFigmaでデザインを作成するか.

## 9/23 1:51
Figmaお絵描き中...
ちょっとお風呂入る.
3:14...寝る

## 9/23 14:59
作業再開!

componentsディレクトリ直下にatomsなどのディレクトリを作成する.
## 9/23 16:31
散歩
## 9/23 17:28
作業再開!

Buttonコンポーネントっている？
抽象化しすぎて普通のHTMLタグと変わらないのでは?

いいaddonを見つけた.
- [console](https://storybook.js.org/addons/@storybook/addon-console)

使い方がようわからん...
config.jsって何? storybookにそんなファイルあったっけ?

componentsディレクトリにstoriesを含めた方がいい理由をもう一つ見つけてしまった.
https://storybook.js.org/docs/configure#configure-story-loading

preview.tsに細工したら上手く行った.
20:08　コーヒーブレイク

Jtestつかおうかなぁ...
svelteをサポートしていないのが残念...

nexjsでvitest使えるらしいので使ってみる.
あとはplaywrightかなぁ...

21:55 やばい...youtube見てた...
なんかイヤホンつけてると時間経つのが早い...
なんか, storybookがJest使ってるらしいのでJestでテストします.
やる気でない...

date-fnsを見る.
これで ある月のリストを取得するのどうしたらええんか...
startOfMonthね...
がんばろー

猫が泣いている.

死にたくなってくる
暗くなってきた.

引数何にするか迷う.

2:27ウルフオブウォールストリートを見てしまった...
もうお風呂入って寝よう.
常々, 逆算思考ができないなぁ.

## 9/24 13:55
起床から少し経った. 
家族がコロナになったらしい.

個人開発者としていろんな人を見ると勇気をもらえる.
- [個人開発者](https://zenn.dev/statstat/articles/28d5b4f53a56ce#pieter-levels%EF%BC%88%E3%83%94%E3%83%BC%E3%82%BF%E3%83%BC%E3%83%BB%E3%83%AC%E3%83%99%E3%83%AB%E3%82%BA%EF%BC%89%E6%B0%8F)
彼らの開発したものを自分で作って日本で売ればいいのでは?
情報格差を利用した商売って結局海外のものを日本にもってくるだけでいいのでは?
その中でもAIをつかって高く売れそうなものがいいな.

- [アニメ「負けヒロインが多すぎる！」のWebサイト制作費を見積もってみた ](https://www.youtube.com/watch?v=Vs0jUfl7Dk0)
を見た.
俺じゃ作業ペースがおそすぎる...
これで300万円って安いなぁ...

- [IT業界に転職する際に知っておくべきポートフォリオの話](https://www.youtube.com/watch?v=yMEjLDnM81E)
を見た.
たしかにポートフォリオのどこを見るかについては考えたことはなかった.

classってのはstyleのためにあるのに, なぜstyleを使わないのか?

