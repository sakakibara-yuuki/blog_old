---
title: 'ロードバランサーについて'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-11-25
tags: ["network", "loadbalancer"]
---

# Introduction
## Contents
## ロードバランサー
サーバーに大量にアクセスが増大すると, サーバーがダウンしてしまうことがある.
ダウンするにせよ, しないにせよ, サーバーにアクセスが集中するとレスポンスが遅くなることは確実である.

一台のサーバーのCPUやメモリなどの性能を上昇させて対応させることもある. いわゆる**スケールアップ**して対応する方法である. しかし, この方法には限界があり, コストもかかる. 
対して, 複数のサーバーを用意して負荷を分散させる方法もある. いわゆる**スケールアウト**して対応する方法である. この方法はスケールアップに比べてコストが低い.

ここで問題になるのが, 複数のサーバーに対してどのようにアクセスを分散させるかという問題だ.

ここで登場する機械, それが**ロードバランサー(LB)**である. 

ロードバランサーには主にL4, L7スイッチがある.
L4スイッチとは, OSI参照モデルの第4層(トランスポート層)での通信を制御する機器である.
L7スイッチとは, OSI参照モデルの第7層(アプリケーション層)での通信を制御する機器である.

また, 負荷分散の対象としてはネットワーク装置やセキュリティ装置などがある.
しかし, ここではサーバーに対する負荷分散を対象とする.

```d2
direction: right
style: {
fill: transparent
}
classes: {
  load balancer: {
    label: load\nbalancer
    width: 100
    height: 200
    style: {
      stroke-width: 0
      fill: "#44C7B1"
      shadow: true
      border-radius: 5
      font-color: black
    }
  }
  unhealthy: {
    style: {
      fill: "#FE7070"
      stroke: "#F69E03"
    }
  }
}

client1 -> web lb
client2 -> web lb
client3 -> web lb

web lb.class: load balancer

web lb -> api1
web lb -> api2
web lb -> api3
api2.class: unhealthy
```

負荷分散装置自体は非常に高価(最低でも数十万円)である. 
しかし, ほとんどのサービスではLBは必須となっている.

LBを使うことによるスケールアウトには付随するメリットがある.
それは, サーバーの冗長化である. サーバーがダウンしても, LBが別のサーバーにアクセスを振り分けることでサービスを継続することができる.
また, パフォーマンスの向上や拡張する余地が残されているのもメリットである.


## DNSラウンドロビン
DNSラウンドロビンとは, **一つのホスト名に対して複数のIPアドレスを持ち回りで割り当てる**ことで負荷分散を行う方法である.
この機能はDNSサーバーに備わっている.

ラウンドロビン(Round-Robin)とは"持ち回り", "役割の交代"などの意味がある.

DNSラウンドロビンはAWSのLBでも使われている.

もともとDNSサーバーには同じホスト名に対して複数のIPアドレスが割り当てられている場合には, 問い合わせ毎に順番に異なるIPアドレスを返す仕組みがある.

一応, DNSのこの機能を使えば, 一つのホスト名に対して複数のサーバーを割り当てることができる.
この方法はシンプルで, しかも, LBを使わないのでコストがかからない.

しかし, 負荷分散を行うという観点から, DNSラウンドロビンを使用した負荷分散はあまり推奨されていない.

それは,
- 障害が発生してるサーバーに対してもアクセスが振り分けられる
- 振り分け先に偏りが生じる場合がある
- セッションの維持が難しい

これをはじめとして, SSL/TLSができないなどの問題がある.

では, DNSラウンドロビンは使われないのかというと, そうではない.
なにせ, DNSラウンドロビンは
- 設定が簡単ですぐに導入できる
- 低コストで負荷分散を実現できる

といったメリットがある.  
DNSラウンドロビンは, キャッシュサーバーの負荷分散や, ロードバランサーの冗長化などに使われることがある.

```d2
direction: right
style: {
fill: transparent
}
classes: {
  load balancer: {
    label: load\nbalancer
    width: 100
    height: 200
    style: {
      stroke-width: 0
      fill: "#44C7B1"
      shadow: true
      border-radius: 5
      font-color: black
    }
  }
  unhealthy: {
    style: {
      fill: "#FE7070"
      stroke: "#F69E03"
    }
  }
}

client1 -> internet
client2 -> internet
client3 -> internet
DNS: {
  shape: image
  icon: https://icons.terrastruct.com/aws%2FNetworking%20&%20Content%20Delivery%2FAmazon-Route-53_light-bg.svg
  near: top-center
  style: {
    fill: transparent
    stroke: transparent
    border-radius: 8
    font-color: black
  }
}
internet -- DNS
internet: {
  icon: https://icons.terrastruct.com/aws%2F_General%2FInternet-alt2_light-bg.svg
  label.near: bottom-center
  style: {
    fill: white
    stroke: transparent
    border-radius: 8
    font-color: black
  }
}

internet -> server A
internet -> server B
internet -> server C
```

```d2
direction: right
style: {
fill: transparent
}
classes: {
  load balancer: {
    label: load\nbalancer
    width: 100
    height: 200
    style: {
      stroke-width: 0
      fill: "#44C7B1"
      shadow: true
      border-radius: 5
      font-color: black
    }
  }
  unhealthy: {
    style: {
      fill: "#FE7070"
      stroke: "#F69E03"
    }
  }
}


client1 -> internet
client2 -> internet
client3 -> internet
DNS: {
  shape: image
  icon: https://icons.terrastruct.com/aws%2FNetworking%20&%20Content%20Delivery%2FAmazon-Route-53_light-bg.svg
  near: top-center
  style: {
    fill: transparent
    stroke: transparent
    border-radius: 8
    font-color: black
  }
}
internet -- DNS
internet -> ap-northeast-1a.web lba
internet -> ap-northeast-1c.web lbc
internet: {
  icon: https://icons.terrastruct.com/aws%2F_General%2FInternet-alt2_light-bg.svg
  label.near: bottom-center
  style: {
    fill: white
    stroke: transparent
    border-radius: 8
    font-color: black
  }
}

ap-northeast-1a.web lba.class: load balancer
ap-northeast-1c.web lbc.class: load balancer

ap-northeast-1a : {
  web lba -> server A
  web lba -> server B
  web lba -> server C
  style: {
    fill: transparent
  }
}

ap-northeast-1c : {
  web lbc -> server D
  web lbc -> server E
  web lbc -> server F
  server D.class: unhealthy
  style: {
    fill: transparent
  }
}
```
DNSラウンドロビンで各LBにアクセスを振り分け, さらに各LBでサーバーにアクセスを振り分けている.

このようにLBを二重化するためにDNSラウンドロビンが使われている.

と, 言われてもいくつか疑問があるだろう.
- 通信するサーバーが変わるから, セッションの維持が難しいのでは?
- 結局DNSを使っていたら通信先のサーバーが偏るのでは?
- サーバーがダウンしていたら処理を振り分けられないのでは?
- ルーティング機能はついてるの?

## セッション維持
クライアントからのリクエストの度に異なるサーバーにアクセスが送られてしまっては, セッションの維持が難しいというDNSラウンドロビンで紹介した問題がある.

LBにはセッションを維持する方式としてレイヤー3方式とレイヤー7方式がある.
- レイヤー3方式  [ネットワーク]:  
リクエスト元のIPアドレスを元に振り分ける
- レイヤー7方式  [アプリケーション]:  
Cookieに埋め込まれたsessionIDを元に振り分ける

お察しの通り, 通常はレイヤー7方式が使われる.
というのもレイヤー3方式は, クライアントのIPアドレスが変わるとセッションが切れてしまうからである. 動的NATなどがクライアントに使われている場合, クライアントのIPアドレスがリクエスト毎に変わることがあるからである.

多くのロードバランサー(AWSのALBを含む)は, セッション維持(session stickiness: スティッキーセッション)という機能がある.
文字通り, セッションの管理をロードバランサーが行うのだ.
具体的には, ロードバランサー自体が特定のCookieを生成し, それをクライアントに返す.
クライアントがそのCookieを持っている場合, ロードバランサーはCookieを確認し, 同じサーバーにリクエストをルーティングする.

もしくは, アプリケーション側が生成したsessionIDがCookieに埋め込まれている場合, ロードバランサーはそのCookieを元にサーバーを選択することもできる. この場合, アプリケーションのCookieポリシーとロードバランサーの設定を合わせる必要がある.

ロードバランサー側でセッションを維持する機能がない場合, アプリケーション内でセッションの維持を実装する必要がある.

なお, ここで注意すべき点がある.
- Cookieの有効期限とアプリケーションのセッションの有効期限を合わせる必要がある.
- 複数のロードバランサーを利用する場合, Cookieが一貫性を保つように設定する必要がある.
- SSL/TLSの終端をロードバランサーで行う場合, 暗号化された中でCookieを検出できる.

## ルーティング
クライアントからのリクエストをどのサーバーに振り分けるかの機能であるが, ロードバランサーでは振り分け先を決定する機能がある.

ではどのサーバーに振り分けるのか, その基準や方式にはどのようなものがあるのか.

- ラウンドロビン方式:  
DNSのラウンドロビンと同じで, 順番にリクエストを振り分ける方式  
ただし, 各サーバーが同じ性能でないと, 負荷が偏る可能性がある.
そこで, サーバー毎に重みを設定することで負荷を均等にするという試みもある.

- リーストコネクション方式:  
接続数が少ないサーバーにリクエストを振り分ける方式  
ロードバランサーがサーバーの接続数(TCPコネクションがどのくらいあるか)を監視し, 最もコネクション数が少ないサーバーにリクエストを振り分ける.  
一般には, 大容量のファイルを転送する場合通信には時間がかかる. そこで, コネクション数を数えることで, 通信が早く終わるサーバーにリクエストを振り分けることで, パフォーマンスを向上させることができる.

- ファーストアンサー方式:
最も早くレスポンスを返したサーバーにリクエストを振り分ける方式  
いかに高性能なサーバーであっても, 負荷がかかっている場合にはレスポンスが遅くなることがある. そこで, ロードバランサーがサーバーにリクエストを送信し, どのサーバーが最も早くレスポンスを返すかを計測し, そのサーバーにリクエストを振り分ける.

- ハッシュ方式:
送信元IPとか宛先IPなどから導出したハッシュ値を使ってサーバーを選択する方式

## ヘルスチェック
障害が発生しているサーバーにアクセスを振り分けないように, ロードバランサーからサーバーを監視する機能がある. これを**ヘルスチェック**という.

ヘルスチェックには代表的なものがいくつかある.

- レイヤー3監視: ping監視  (ネットワークレイヤ)
- レイヤー4監視: ポート監視  (トランスポートレイヤ)
- レイヤー7監視: コンテンツ監視  (アプリケーションレイヤ)

当然, レイヤーというのはOSI参照モデルのことである.  
レイヤー3監視では, サーバー自体の異常検知は可能であるが, それ以上のレイヤー, つまりサーバー上で動作しているサービス異常検知はできない.  
一方で, レイヤー7監視では, サービス異常まで検知可能であり, 最も関し精度が高いヘルスチェックである.  

では, レイヤー7監視を使えばいいのかというと, 通常はそうなのだが, トレードオフがあることを理解しておく必要がある.
つまり, レイヤーが高ければ高いほど, ヘルスチェックの精度は高くなるが, 監視にかかる負荷が高くなる.

監視にかかる負荷にまつわる話として, ヘルスチェックの頻度・間隔についても考える必要がある.

ヘルスチェックは定期的にサーバーに対して, ヘルスチェック用のパケットを送信する.
このパケットの送信間隔を短くすることで, サーバーの障害を早く検知できるが, その分サーバーに負荷がかかる.

ただし, 現状, サーバースペックが向上しているため, ヘルスチェックの負荷はあまり気にする必要はないかもしれない.

むしろ, 監視精度という観点とは別に, 障害時の切り分けを容易にするために, 異なるレイヤーのヘルスチェックを使用することもある.

例えば, レイヤー3監視とレイヤー7監視を併用することで, OSやネットワークの障害であるのか, アプリケーションでの障害なのかを切り分けることができる.  
レイヤー3監視が生き, レイヤー7監視が生きている場合問題はない.  
レイヤー3監視が生き, レイヤー7監視が死んでいる場合, アプリケーションの障害である可能性が高い.  
レイヤー3監視が死んで, レイヤー7監視が生きている場合はありえない.  
レイヤー3監視が死んで, レイヤー7監視が生きている場合, OSやネットワークの障害である可能性が高い.  

## 通信

以下のような通信を考える.

```d2 animateInterval=4000
direction: right
style.fill: transparent

classes: {
  load balancer: {
    label: load\nbalancer
    width: 100
    height: 200
    style: {
      stroke-width: 0
      fill: "#44C7B1"
      shadow: true
      border-radius: 5
      font-color: black
    }
  }
  unhealthy: {
    style: {
      fill: "#FE7070"
      stroke: "#F69E03"
    }
  }
}

client1: {
  label: client1\n\n192.168.0.1
}

internet: {
  icon: https://icons.terrastruct.com/aws%2F_General%2FInternet-alt2_light-bg.svg
  label.near: bottom-center
  style: {
    fill: white
    stroke: transparent
    border-radius: 8
    font-color: black
  }
}
web lba.class: load balancer
web lba: {
  label: load\nbalancer\n\n192.168.0.100
}
server A: {
  label: server A\n\n10.0.0.1
}
server B: {
  label: server B\n\n10.0.0.2
}
client1 -> internet -> web lba
(client1 <- internet)[0]: null
(internet <- web lba)[0]: null

web lba -> server A
web lba <- server A
web lba -> server B
web lba <- server B
(web lba <- server A)[0]: null
(web lba <- server B)[0]: null

route: |md
  - source: 192.168.0.1 (client)
  - destin: 192.168.0.100 (LB)
|

scenarios: {
  A : {
    (client1 -> internet -> web lba)[0].style: {
      animated: true
    }
  }
  B : {
    (web lba -> server B)[0].style: {
      animated: true
    }
    route: |md
      - source: 192.168.0.1 (client)
      - destin: 10.0.0.2 (B)
    |
  }
  C: {
    (web lba -> server B)[0]: null
    web lba <- server B: {
      style: {
        animated: true
      }
    }
    (client1 -> internet -> web lba)[0]: null
    internet <- web lba: {
      style: {
        animated: true
      }
    }
    client1 <- internet: ?{
      style: {
        animated: true
        font-size: 50
      }
    }
    route: |md
      - source: 10.0.0.2 (B) ?
      - destin: 192.168.0.1 (client)
    |
  }
}
```

この例では, clientから送られてきたリクエストをロードバランサーが受け取り, リクエストのパケットの宛先をserver A(10.0.01)に書き換えて送信している.

しかし, レスポンスでは帰り先が10.0.0.1となっており, 誰から送られてきレスポンスかclientはわからない.

TCP/IPでは, クライアントはレスポンスが送信先IPアドレス・ポート(クライアントがリクエストを送信したIPアドレス・ポート)に送信されてくると期待している.
よって, レスポンスが異なるIPアドレス・ポートから来た場合はそのレスポンスを破棄する.

そこで, リクエスト時にはclient1のIPアドレスを自分のIPアドレスとしてserver Aに送信し, レスポンス時にはserver Aからのレスポンスの送り先をロードバランサーのIPに書き換える.

```d2 animateInterval=2000
direction: right
style.fill: transparent

classes: {
  load balancer: {
    label: load\nbalancer
    width: 100
    height: 200
    style: {
      stroke-width: 0
      fill: "#44C7B1"
      shadow: true
      border-radius: 5
      font-color: black
    }
  }
  unhealthy: {
    style: {
      fill: "#FE7070"
      stroke: "#F69E03"
    }
  }
}

client1: {
  label: client1\n\n192.168.0.1
}

internet: {
  icon: https://icons.terrastruct.com/aws%2F_General%2FInternet-alt2_light-bg.svg
  label.near: bottom-center
  style: {
    fill: white
    stroke: transparent
    border-radius: 8
    font-color: black
  }
}
web lba.class: load balancer
web lba: {
  label: load\nbalancer\n\n192.168.0.100
}
server A: {
  label: server A\n\n10.0.0.1
}
server B: {
  label: server B\n\n10.0.0.2
}
client1 -> internet -> web lba
(client1 <- internet <- web lba)[0]: null

web lba -> server A
web lba <- server A: null
web lba -> server B
web lba <- server B: null
route: |md
  - source: 192.168.0.1 (client)
  - destin: 192.168.0.100 (LB)
|

scenarios: {
  A : {
    (client1 -> internet -> web lba)[0].style: {
      animated: true
    }
  }
  B : {
    (web lba -> server B)[0].style: {
      animated: true
    }
    route: |md
      - source: 192.168.0.100 (LB)
      - destin: 10.0.0.2 (B)
    |
  }
  C: {
    (web lba -> server B)[0]: null
    web lba <- server B: {
      style: {
        animated: true
      }
    }
    route: |md
      - source: 10.0.0.2 (B)
      - destin: 192.168.0.100 (LB)
    |
  }
  D: {
    web lba -> server B: null
    web lba <- server B
    (client1 -> internet -> web lba)[0]: null
    client1 <- internet <- web lba: {
      style: {
        animated: true
      }
    }
    route: |md
      - source: 192.168.0.100 (LB)
      - destin: 192.168.0.1 (client)
    |
  }
}
```
上記のような方法をソース **NAT(Network Address Translation)** という.
この方式を見ればわかる通り, ロードバランサーに負荷が集中する.
しかし, 考えてみれば, 通常, クライアントからのリクエストはレスポンスほど重くない. そこで, リクエストはサーバーで受け付けて, レスポンスはサーバーから直接送信すればロードバランサーの負荷を減らせる. この方式をDSR(Direct Server Return)という. (ただし, AWSではDSRはサポートされていない)

ただし, DSRを使う場合, レスポンスを返すサーバーBのIPアドレスとロードバランサーのIPアドレスを一致させる必要がある. これを**IPマスカレード**, または**IPアドレスのスプーフィング** という.
もしくはNATテーブルを使って, サーバーBのIPアドレスをロードバランサーのIPアドレスに変換することもできる.

```d2 animateInterval=2000
direction: right
style.fill: transparent

classes: {
  load balancer: {
    label: load\nbalancer
    width: 100
    height: 200
    style: {
      stroke-width: 0
      fill: "#44C7B1"
      shadow: true
      border-radius: 5
      font-color: black
    }
  }
  unhealthy: {
    style: {
      fill: "#FE7070"
      stroke: "#F69E03"
    }
  }
}

client1: {
  label: client1\n\n192.168.0.1
}

internet: {
  icon: https://icons.terrastruct.com/aws%2F_General%2FInternet-alt2_light-bg.svg
  label.near: bottom-center
  style: {
    fill: white
    stroke: transparent
    border-radius: 8
    font-color: black
  }
}
web lba.class: load balancer
web lba: {
  label: load\nbalancer\n\n192.168.0.100
}
server A: {
  label: server A\n\n10.0.0.1
}
server B: {
  label: server B\n\n10.0.0.2
}
client1 -> internet -> web lba
(client1 <- internet <- web lba)[0]: null

web lba -> server A
web lba <- server A: null
web lba -> server B
web lba <- server B: null
route: |md
  - source: 192.168.0.1 (client)
  - destin: 192.168.0.100 (LB)
|

scenarios: {
  A : {
    (client1 -> internet -> web lba)[0].style: {
      animated: true
    }
  }
  B : {
    (web lba -> server B)[0].style: {
      animated: true
    }
    route: |md
      - source: 192.168.0.100 (LB)
      - destin: 10.0.0.2 (B)
    |
  }
  C: {
    server B -> client1: {
      style: {
        animated: true
      }
    }
    route: |md
      - source: 192.168.0.100 (LB)
      - destin: 192.168.0.1 (client)
    |
  }
}
```

## セッションとコネクション
webサーバーとクライアントの通信で**セッション**という単語を聞いたことがあるかもしれない.
対して, DBとの接続では**コネクション**という単語を使ったことがあるかもしれない.

セッションとコネクション, 違いは一体なんなんだろうか.

単刀直入に言ってしまえば, セッションは**アプリケーション層(HTTPなど)**での通信のことであり, コネクションは**トランスポート層(TCP)**での通信のことである.

セッションとはwebサービスとクライアント間のひと続きである通信のことである. さて, ひと続きとはどこまでのことを言うのであろうか.
そのセッションのスタートは3wayハンドシェイクであり, セッションの終わりはwebサービス側が決める. セッションの開始と終了の実態は非常に曖昧である.

対して, コネクションは通信相手との間での仮想的な接続状態を表している.
そしてほとんどのケースで, コネクションとはTCPコネクションを指す.
つまり, 3wayハンドシェイクが完了して通信相手と接続が確立された状態を指す.

つまり, セッションと異なり, コネクションの定義は明確である.

TCPコネクションの上でHTTP通信などが行われることが多いので, 
コネクションを張った上でセッションが行われることが多い.
