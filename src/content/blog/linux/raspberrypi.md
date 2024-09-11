---
title: "raspberrypiを買ったらやること"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: '/linux/raspberrypi.png'
pubDate: 2024-06-05
tags: ["linux", "raspberrypi", "config"]
---

### rps-imager
自分のPCはArchLinuxなので自分のPCにpacmanでrps-imagerを導入する。
rps-imagerではデバイス(/dev)にアクセスする必要があるため、root権限でアクセスする必要がある。
しかし、rootユーザではXwaylandのディスプレイにアクセスできなかった。
そこで以下のコマンドを入力してから
```bash
xhost +
```
root権限で実行する。
```bash
sudo rsp-imager
```

なお、OSはUbuntu Serverでsshを最初に導入しておくことにする。

### IPアドレスの固定
netplanを使用してIPアドレスを固定する。

```bash
vim /etc/netplan/51-hogehoge-init.yaml
```
設定ファイル`51-hogehoge-init.yaml`の名前は辞書順で最後に来るものが適用される。
内容は
```bash
# This file is generated from information provided by the datasource.  Changes
# to it will not persist across an instance reboot.  To disable cloud-init's
# network configuration capabilities, write a file
# /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg with the following:
# network: {config: disabled}
network:
    ethernets:
        eth0:
            dhcp4: false
            addresses: [192.168.3.81/24]
            optional: true
            nameservers:
              addresses: [8.8.8.8, 8.8.8.4]
    version: 2
```

どうでもよいが, プライベートIPの`192.168.3.81`の`81`は"パイ"の意味である。
２つ目のraspberrypiは`82`のように続く。

### hostnameの変更
`/etc/hostname`と`/etc/hosts`を変更する。
`/etc/hostname`は好きなものでいいが、数字をつけるかどうかは悩みどころ。一つ故障したら謎に欠番ができることになってしまう。

`/etc/hosts`は以下のように変更する。

```bash
192.168.3.81    raspberrypi1
192.168.3.82    raspberrypi2
```

これで
```bash
ssh pi@raspberrypi1
```
で接続できるようになる。
台数が増えて、パスワードを覚えるのが大変になったら、公開鍵認証で接続できるようにする。

管理PC側で鍵を生成する。
```bash
ssh-keygen -t ed25519 -C "raspberrypi for ssh"
```
(なんですか？ED25519って？楕円曲線って？)
`-C`オプションはコメントをつけるためなので実際はなくてもいい。
ここで生成された公開鍵を各ノードへ送る。
この方法には２つある。

なお、２つ目の方法をおすすめする。 

一つは単純にコピーしてauthorized_keysに登録する方法  
まぁ、いちいちコピーしてもいいが、SecureCoPyの`scp`コマンドを使うとちょっと楽。
普通の`cp`と同じで
```
scp source destination_user@destination_host:directory
```
という形で使う。管理PCからraspberrypi1をsshで操作している場合は
```bash
scp raspberrypi_ed25519.pub pi@raspberrypi1:/home/pi/.ssh/raspberrypi1.pub
```
次に、authorized_keysに追加する。
```bash
cat raspberrypi1.pub raspberrypi2 >> authorized_keys
```

2つめの方法は`ssh-copy-id`を使う方法。
```bash
ssh-copy-id -i ~/.ssh/raspberrypi.pub pi@raspberrypi1
```
これで、raspberrypi1に公開鍵が登録(.ssh/authorized_kyesが作成され、中にpublic keyがコピー)される。

これらにより、パスワードを入力することなくsshで接続できるようになる。  
なお、
```bash
ssh -i ~/.ssh/raspberrypi1 pi@raspberrypi1
```
のように秘密鍵を指定する必要がある。
これはこれでめんどくさいのでエイリアスを登録する。

管理PCで`.ssh/config`に以下を追加する。  
```bash
Host raspberrypi1
  HostName raspberrypi1
  User pi
  IdentityFile ~/.ssh/raspberrypi_ed25519

Host raspberrypi2
  HostName raspberrypi2
  User pi
  IdentityFile ~/.ssh/raspberrypi_ed25519
```

これにより
```bash
ssh raspberrypi1
```
で接続できるようになる。

### docker Engineの導入

次のinstall手順に従ってdockerを導入する。
[docker Engineの導入](https://docs.docker.com/engine/install/ubuntu/#uninstall-old-versions)
コピペするよりも一行ずつ実行することをおすすめする。
また、`sudo`なしで実行できるように現在のユーザーをdockerグループに追加する。
なお、docker CE導入時にすでにdockerグループが作成されていると思うので以下で確認する。

```bash
cat /etc/group | grep docker
```

[docker non-rootの導入](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user)

<!-- ### Kubernetesの導入 -->
<!-- ... -->

