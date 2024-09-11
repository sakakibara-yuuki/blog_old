---
title: "POSIX中心主義"
author: "sakakibara"
description: "POSIX中心主義"
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-03-06
tags: ["posix", "linux"]
---


## そのコマンドはありますか？
`ex`というコマンドある。  
古より伝えられし今では伝説となってしまったコマンドだ。  
言い伝えによると`vi`, `vim`, `nvim`などの先祖に当たるらしい。
これは一目見なければ。
```zsh
man ed
```
とすると以下のように出てくる。
```zsh

EX(1P)             POSIX Programmer's Manual             EX(1P)

PROLOG
       This  manual page is part of the POSIX Programmer's Man‐
       ual.  The Linux implementation  of  this  interface  may
       differ  (consult the corresponding Linux manual page for
       details of Linux behavior), or the interface may not  be
       implemented on Linux.

```

むむむ。  
POSIXプログラマのマニュアル？Linuxでは実装されてないかもしれない？なぜなぜ？どゆこと？  
マニュアルはよくわからんが使ってみるのが一番やろ。えいや。  
```zsh
➜  ex
zsh: command not found: ex
```

## POSIX
POSIXとはIEEEの規格の名前である。
主にUNIX系のOSにういてコマンドやカーネルへのC言語インターフェースのうち最小限のものが定められている。

ちなみに、POSIX意外にもANSI(アメリカ規格)/ISO(国際規格), SUS(UNIX印)などの規格がある。
ではlinuxはPOSIXに準拠しているのかというと**なるべく準拠する** という姿勢を取っている。  
というのもPOSIXの承認には莫大な金と時間がかかるためである。
(linuxディストリビューションではLinux-FTのみが準拠しているとの噂。昔はLinuxよりUnixが多くつかわれてたからね、しょうがないね。)

そのため、linuxはlinuxで(LSB)(Linux Standard Base)という規格を作成している。
(ただこれもパッケージをRPMに制限したりと批判を浴びている面も少なくない。)

なるほど、これまで似たようなファイル構造やコマンドが使用できたのはこういった規格あったからだ。  
しかし、`ex`コマンドのようにPOSIXでは規格として定められているが、実際には実装されていないコマンドなどもある。

## POSIX中心主義
[POSIX中心主義](https://www.ipsj.or.jp/dp/contents/publication/32/S0804-R1601.html)という考え方がある。  
これは、なるべくPOSIXへ準拠するようにプログラムを組むことで持続性と互換性を保つソフトウェアを生産することを目指した取り組みだ。

ただ、端から見てその道(縛り)は険しい。  

> - プログラムを作成する際はC言語、sh のみ。バイトオーダーの関係でC言語はハードウェア依存となるためshのみ。
> - shellはPOSIXで規定されてる文法のみを使用する。

不便なコマンドがあればPOSIXで規定されたコマンドを組み合わせてコマンドを作るという指針だ。

たしかに、拡張性と持続性をもたせられるかもしれない。
しかし正直、手間がかかってしょうがない。  
また、上で挙げた`ex`コマンドのようにPOSIXに準拠しているコマンドなら必ず実装されているというわけでもない。
そもそもプログラムを何年も残したいのならはソフトウェアではなくハードウェアとして残せばよい。

だが、POSIX中心主義を唱えている著者の長期持続性の検証は非常に興味深い。
東京メトロが主催したオープンデータ活用コンテストで応募のあった281作品のうち正常に2年後に正常に動作する作品は103までに減ってしまったという報告だ。  
2年経てば、およそ63%の作品が異なる環境では動作しないということになる。
その中でも、POSIX中心主義で開発した作品は非常に長い持続性と互換性を持ったという。


開発速度・持続性・互換性、などの要素のうちどれを拾ってどれを捨てるかを判断する際に一つ、POSIX中心主義というのを覚えておこうと思った。

### .PS
もう明日からshellはshしか使わないし、なるべくC言語を書くようにするし、日本語やめてエスペラント語を話します。

## reference
- [ソフトウェアの高い互換性と長い持続性を目指すPOSIX中心主義プログラミング](https://www.ipsj.or.jp/dp/contents/publication/32/S0804-R1601.html)
- [IEEE The Open Group](https://collaboration.opengroup.org/external/pasc.org/plato/)
- [Linux 相互運用性](https://ja.wikipedia.org/wiki/Linux#%E7%9B%B8%E4%BA%92%E9%81%8B%E7%94%A8%E6%80%A7)
