---
title: 'webRTC'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2025-01-10
tags: ["astro", "math"]
---

# Introduction
## Contents
## 用語
#### シグナリングチャンネル
P2Pといえども最初に何らかの中間サーバーがなければ接続を作成できない。
このサーバーをシグナリングチャンネルと呼ぶ。
この実装形態はなんでもよく、ここで交換する情報は**SD(Session Description)**で記述され、**オファー**と**アンサー**と呼ばれる。
SDP(Session Description Protocol)に従って交換される。

#### SD(Session Description)
SDには以下の情報が含まれる。
- メディアの種類
- メディアのフォーマット
- 転送プロトコル
- エンドポイントのIPアドレスとポート番号

接続を作成する際に、オファーとアンサーをSDPに従って交換すると接続が確立される。
呼び出し側がオファーを作成し、相手側がアンサーを作成する。
この交換は**ICE**を使って行われる。

結果、接続作成後にはそれぞれのPeerは2つのSDを持つ。
- ローカルSD
- リモートSD
それぞれ、自分のSDと相手のSDを持つことになる。

オファー・アンサーの交換は接続(call)を最初に接続する際に実行されるが、それ以外にもフォーマットの変更や設定の変更がある場合にも随時実行される。


## 通信の仕組み
![webRTCの画像](https://developer.mozilla.org/ja/docs/Web/API/WebRTC_API/Connectivity/webrtc-complete-diagram.png)

1. 呼び出し側が`MediaDevices.getUserMedia()`を通じてローカルメディアを取得
1. 呼び出し側が`RTCPeerConnection`を通じてシグナリングチャネルに接続
1. 呼び出し側が`RTCPeerConnection.addTrack()`でローカルメディアを追加
1. 呼び出し側が`RTCPeerConnection.createOffer()`でオファーを生成
1. 呼び出し側が`RTCPeerConnection.setLocalDescription()`を呼び出し、local SDを設定
1. 呼び出し側がSTUNサーバーを通じてICE candidateを生成
1. 呼び出し側がシグナリングチャンネルを通じてオファーを相手に送信

1. 受け取る側がオファーを受け取り、`RTCPeerConnection.setRemoteDescription()`でremote SDに設定
1. 受け取る側が(必要であれば)ローカルメディアを取得し、`RTCPeerConnection.addTrack()`で接続にアタッチする。
1. 受け取る側が`RTCPeerConnection.createAnswer()`でアンサーを生成
1. 受け取る側が`RTCPeerConnection.setLocalDescription()`に作成したアンサーを設定する。つまり、アンサーをlocal SDとして設定する。(この時点で受け取り手は2つのSDを持つことになる)
1. 受け取る側がシグナリングチャンネルを通じて呼び出す側にアンサーを送信する。
1. 呼び出す側がアンサーを受け取る。
1. 呼び出す側が`RTCPeerConnection.setRemoteDescription()`でアンサーをremote SDとして設定する。

### 保留中および現在のdescription
(`localDescription`と`remoteDescription`は接続の情報を保持するプロパティであるが、ただ単に接続に関する情報を保持するだけでは機能しないことに気づく）
プロセスを少し踏み込んで見てみると、`localDescription`と`remoteDescription`（これら2つのdescriptionを返すプロパティ）は見かけほど単純では無いことに気づく。
なぜなら、再ネゴシエーション中にオファーで互換性のないフォーマットを提案したために拒否される可能性があり、各エンドポイントは新しいフォーマットを提案し、他のピアに受理されるまで実際に切り替えない必要がある。
このような理由から、WebRTCは「保留中(Pending)」と「現在の(current)」のdescriptionを使用する。

**現在のdescription**（`RTCPeerConnection.currentLocalDescription`か`RTCPeerConnection.currentRemoteDescription`で返されるプロパティ）は、現在の接続によって実際に使用されているdescriptionを表す。
これは、双方が完全に同意した最新の接続内容を示す。

**保留中のdescription**（`RTCPeerConnection.pendingLocalDescription`か`RTCPeerConnection.pendingRemoteDescription`で返されるプロパティ）は、それぞれ`setLocalDescription()`または`setRemoteDescription()`が呼び出された後の検討中のdescriptionを示す。

descriptionを読み取る場合（`RTCPeerConnection.localDescription`および`RTCPeerConnection.remoteDescription`で返される）、保留中のdescriptionが存在する場合（つまり、保留中のdescriptionがnot nullの場合）は`pendingLocalDescription`/`pendingRemoteDescription`の値が返される。
それ以外の場合は現在のdescription（`currentLocalDescription`/`currentRemoteDescription`）が返される。

`setLocalDescription()`または`setRemoteDescription()`を呼び出してdescriptionを変更する際には、指定されたdescriptionは保留中のdescriptionとして設定され、WebRTCレイヤーがそれが受け入れられるかどうかの評価を始める。
提案されたdescriptionが合意されると、`currentLocalDescription`または`currentRemoteDescription`の値が保留中のdescriptionに変更され、保留中の情報は再びnullに設定され、保留中の情報が存在しないことを示すようにする。

`pendingLocalDescription`には、検討中のオファーまたはアンサーだけでなく、オファーまたはアンサーが作成されてから既に収集されたローカルICE candidateも含まれる。
同様に、`pendingRemoteDescription`には、`RTCPeerConnection.addIceCandidate()`の呼び出しによって提供されたリモートICE候補が含まれる。

### ICE candidates

（オファー/アンサーとSDPで議論された）メディア情報を交換するだけでなく、ピア間ではネットワーク接続に関する情報も交換する必要があります。これをICE候補と呼び、ピアが通信できる利用可能な方法（直接またはTURNサーバーを介して）を詳細に示します。通常、各ピアは最良の候補を最初に提案し、次第に劣った候補に進んでいきます。理想的にはUDPが使用されます（高速であり、メディアストリームは中断から比較的容易に復旧できるため）。ただし、ICE標準ではTCP候補も許可されています。

注意: 一般的に、TCPを使用するICE候補は、UDPが利用できない場合や、メディアストリーミングに適さない制限がある場合にのみ使用されます。ただし、すべてのブラウザがTCPを使用したICEをサポートしているわけではありません。

ICEは、TCPまたはUDPのいずれかを介した接続を表現する候補を許可しており、通常はUDPが好まれ（より広くサポートされています）、推奨されます。各プロトコルは、データがピア間でどのように送信されるかを定義するいくつかの種類の候補をサポートしています。

### 問題が発生した場合

交渉中には、物事がうまくいかないこともあります。例えば、ハードウェアやネットワーク設定の変更に適応するために接続を再交渉する場合、交渉が行き詰まることや、そもそも交渉を進められないエラーが発生することがあります。他にも、権限の問題やその他の問題が原因となる場合もあります。

#### ICEロールバック

既にアクティブな接続を再交渉している最中に交渉が失敗した場合、それによって進行中の通話を終了させたくはないでしょう。結局のところ、多くの場合、接続をアップグレードまたはダウングレードする、あるいは進行中のセッションを調整するのが目的であったはずです。このような状況で通話を中断するのは過剰な対応となります。

代わりに、ICEロールバックを開始することができます。ロールバックでは、SDPオファー（および接続の設定全体）を、接続のsignalingStateが最後に安定していたときの設定に復元します。

プログラム的にロールバックを開始するには、typeがrollbackである説明を送信します。この説明オブジェクト内の他のプロパティは無視されます。

さらに、ICEエージェントは、以前にオファーを作成したピアがリモートピアからのオファーを受信したときに自動的にロールバックを開始します。つまり、ローカルピアがhave-local-offer状態にある場合（ローカルピアが以前にオファーを送信したことを示している状態）、setRemoteDescription()をリモートピアから受け取ったオファーとともに呼び出すと、ロールバックがトリガーされ、交渉がリモートピアが発信者からローカルピアが発信者に切り替わります。

