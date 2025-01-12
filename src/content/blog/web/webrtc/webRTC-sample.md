---
title: 'webRTC-sample'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2025-01-10
tags: ["astro", "math"]
---

# Introduction
## Contents
## Section1
RTCDataChannel インターフェースは WebRTC API の機能で、2 つのピア間で任意のデータを送受信できるチャネルを開くことができます。この API は意図的に WebSocket API と類似しているため、同じプログラミングモデルをそれぞれ使用できます。

この例では、同じページ上の2つの要素をリンクするRTCDataChannel接続を開きます。これは明らかに作為的なシナリオですが、2つのピアを接続する流れを示すのに便利です。接続の仕組みやデータの送受信については後述しますが、リモートコンピュータの位置やリンクについては別の例で説明します。

まず、[必要なHTML](https://github.com/mdn/samples-server/blob/master/s/webrtc-simple-datachannel/index.html)を簡単に見てみよう。驚くほど複雑なものは何もない。まず、接続を確立したり閉じたりするためのボタンがいくつかある

```html
<button id="connectButton" name="connectButton" class="buttonleft">
  Connect
</button>
<button
  id="disconnectButton"
  name="disconnectButton"
  class="buttonright"
  disabled>
  Disconnect
</button>
```

そして、ユーザーが送信するメッセージを入力するテキスト入力ボックスがあり、入力されたテキストを送信するボタンがあります。この`<div>`がチャネルの最初のピアになります。

```html
<div class="messagebox">
  <label for="message"
    >Enter a message:
    <input
      type="text"
      name="message"
      id="message"
      placeholder="Message text"
      inputmode="latin"
      size="60"
      maxlength="120"
      disabled />
  </label>
  <button id="sendButton" name="sendButton" class="buttonright" disabled>
    Send
  </button>
</div>
```

最後に、メッセージを挿入する小さなボックスがあります。この<div>ブロックが2番目のピアになります。

```html
<div class="messagebox" id="receive-box">
  <p>Messages received:</p>
</div>
```

## JavaScript
GitHubで[コードそのもの](https://github.com/mdn/samples-server/blob/master/s/webrtc-simple-datachannel/main.js)を見ることもできるが、以下では、重い仕事をするコードの部分をレビューする。

### スタートアップ
スクリプトが実行されると、loadイベントリスナーを設定し、ページが完全にロードされると、startup()関数が呼び出されるようにする。
これはとても簡単だ。変数を宣言し、アクセスする必要のあるすべてのページ要素への参照を取得し、3つのボタンにイベントリスナーを設定する。
```javascript
let connectButton = null;
let disconnectButton = null;
let sendButton = null;
let messageInputBox = null;
let receiveBox = null;

let localConnection = null; // RTCPeerConnection for our "local" connection
let remoteConnection = null; // RTCPeerConnection for the "remote"

let sendChannel = null; // RTCDataChannel for the local (sender)
let receiveChannel = null; // RTCDataChannel for the remote (receiver)

function startup() {
  connectButton = document.getElementById("connectButton");
  disconnectButton = document.getElementById("disconnectButton");
  sendButton = document.getElementById("sendButton");
  messageInputBox = document.getElementById("message");
  receiveBox = document.getElementById("receive-box");

  // Set event listeners for user interface widgets

  connectButton.addEventListener("click", connectPeers, false);
  disconnectButton.addEventListener("click", disconnectPeers, false);
  sendButton.addEventListener("click", sendMessage, false);
}
```

### 接続の確立
ユーザーが "Connect "ボタンをクリックすると、connectPeers()メソッドが呼び出されます。わかりやすくするために、これを分割して少しずつ見ていきます。
```javascript
localConnection = new RTCPeerConnection();

sendChannel = localConnection.createDataChannel("sendChannel");
sendChannel.onopen = handleSendChannelStatusChange;
sendChannel.onclose = handleSendChannelStatusChange;
```
最初のステップは、接続の「ローカル」側を作成することである。
これは接続要求を送信するピアである。
次のステップは、RTCPeerConnection.createDataChannel()を呼び出してRTCDataChannelを作成し、チャネルを監視するイベントリスナーを設定して、チャネルのオープンとクローズ（つまり、ピア接続内でチャネルが接続されたときと切断されたとき）を知ることです。

チャネルの両端がそれぞれ独自のRTCDataChannelオブジェクトを持っていることを覚えておくことが重要です。

#### remote peerのセットアップ
```javascript
remoteConnection = new RTCPeerConnection();
remoteConnection.ondatachannel = receiveChannelCallback;
```

リモート・エンドも同様にセットアップしますが、上記で確立したチャネルを介して接続するため、明示的にRTCDataChannelを作成する必要はありません。
このハンドラはRTCDataChannelオブジェクトを受け取ります。

#### ICE candidateのセットアップ
次のステップは、各接続にICE候補リスナーを設定することである。これらのリスナーは、相手側に伝えるべき新しいICE候補が出たときに呼び出される。

```javascript
localConnection.onicecandidate = (e) =>
  !e.candidate ||
  remoteConnection.addIceCandidate(e.candidate).catch(handleAddCandidateError);

remoteConnection.onicecandidate = (e) =>
  !e.candidate ||
  localConnection.addIceCandidate(e.candidate).catch(handleAddCandidateError);
```
