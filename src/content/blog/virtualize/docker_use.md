---
title: "docker: Dockerの使い方"
author: "sakakibara"
description: "dockerの使い方"
pubDate: 2024-06-25
heroImage: "/virtualize/docker_use.webp"
tags: ["仮想化", "docker"]
---

dockerが何か、については死ぬほど記事があるのでそれはそちらに譲るとする。
(機会があればコンテナ技術について書くかも)  
今回は主にdockerのベーシックな使い方について書いていく。

# dockerの使い方
## 最も簡単な使い方
手元で隔離された環境を作り、しかもポータビリティを保ちたい場合dockerを使うことが選択肢に入ってくると思う。

dockerの主要な使い方は
- imageを持ってくる
- imageからcontainerをつくる
- containerを使う

ざっとこんな感じである。
それでは、dockerの使い方を見ていこう。

##### :::note  
imageとはimageファイル、
つまり光学メディアつまりCDやDVDのソフト化したものである。
たいていはシステムの完全な情報を一つのファイルに格納している。
昔はシステムの情報をCDやDVDに焼いていたが、現在では実際にCDやDVDに焼くことは少い(自分の周りでは)。
ただ慣例からimageファイルという言葉が使われている。SDに入れてもUSBに入れてもimageファイル。仮想化環境に入れてもimageファイルなのである。

### imageを持ってくる
`ubuntu`のimageを持ってくる。
```bash
docker pull ubuntu
```
imageにはtagというプロパティがあり、何も指定しなければ`latest`がデフォルトで指定される。

### imageからcontainerをつくる & containerを使う
```bash
docker run ubuntu echo "Hello World!"
```
"imageからcontainerをつくる"と"containerを使う"は`run`コマンドで一緒に行われる。
正確には`run`コマンドはimageがない場合はimageをダウンロードしてからcontainerを作成し、containerを起動する。
(引数にはimageが必要であり、containerではないことに注意する。)
つまり、最初の`docker pull ubuntu`は(これだけで用が足りれば)見れば省略できる。

こんな感じになる。
```bash
Unable to find image 'ubuntu:latest' locally
latest: Pulling from library/ubuntu
9c704ecd0c69: Pull complete
Digest: sha256:2e863c44b718727c860746568e1d54afd13b2fa71b160f5cd9058fc436217b30
Status: Downloaded newer image for ubuntu:latest
Hello World
```
osをコンテナで隔離、持ち運びできるという触れ込みだが、これでは実感がわかない。
そこで次に、コンテナ内での操作をしてみる。
```bash
docker run -it ubuntu /bin/bash
or
docker run -it ubuntu bash
```
ここで
- `-i`: interactive
- `-t`: tty
の略であり、tty(テレタイプライター)を通してinteractiveに操作するという意味である。
このようになっただろうか。
```bash
root@9f26d865c6c2:/# ls
bin   dev  home  lib64  mnt  proc  run   srv  tmp  var
boot  etc  lib   media  opt  root  sbin  sys  usr
```
ホスト名が`9f26d865c6c2`(container id)のrootユーザーでログインできた。
また、`docker search python`などのようにしてすでにpythonが入ったimageを探すこともできる。
ここまでで、containerの隔離という性質を体感できたと思う。
Dockerの可搬性に関する機能を紹介する前にcontainerやimageの削除について見ていく。

#### contaer & imageの削除
今、どんなcontainerがあるかを確認するには
```bash
docker ps    # 動いているcontainer
docker ps -a # 全てのcontainer
docker container ps     # 上と同じ
docker container ps -a  # 上と同じ
```
を実行すれば良い。
こんな感じに表示される。
```bash
CONTAINER ID   IMAGE                                 COMMAND                  CREATED          STATUS                      PORTS     NAMES
9f26d865c6c2   ubuntu                                "bash"                   16 minutes ago   Exited (0) 15 minutes ago             stupefied_euclid
24881ca7808a   ubuntu                                "echo 'Hello World'"     17 minutes ago   Exited (0) 17 minutes ago             elated_einstein
```
ここで気づくかもしれないが、`bash`と`echo 'Hello World'`を実行するために2つのcontainerを作成している。
また、どちらも共通のimageである`ubuntu`を使っている。
ここからimageを一つ作成してしまえばそれに派生する用途の場合はcontainerを作成するだけで共通基盤の環境が複製できることがわかる。

また、imageを確認するには
```bash
docker images
docker images ubuntu
```
すると
```bash
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
ubuntu       latest    35a88802559d   2 weeks ago   78MB
```
こんな感じで表示される。
通常、`docker pull ubuntu`のようなコマンドを実行すると`docker hub`というrepositoryからimageを持ってくる。
`docker hub`以外にもcontainerのimageを格納・公開しているrepositoryがある。
GitHub Container RegistryやAWS Elastic Container Registryなどがある。
(imageファイルの規格OpenContainer Initiativeに準拠していれば、どのimageでも持ってくることができる!)

さて、containerやimageを削除するには
```bash
docker rm 9f26d865c6c2    # container id
docker rmi 35a88802559d   # image id

docker rm stupefied_euclid  # names
docker rmi ubuntu           # repository
```
ただし、注意が必要なのは
- containerは停止している状態でないと削除できない。
- imageはcontainerが存在していると削除できない。
ということである。
必ずcontainerが停止しているか確認してから削除すること。

を入力すれば良い。

次は、可搬性に関する機能、Dockerfileについて見ていこう。

#### Dockerfile
Dockerfileはimageを作成するための独自言語(DSL)で書かれるスクリプトである。簡単に例を見てみよう。
```bash
FROM ubuntu

COPY hello.txt /home/hello.txt
CMD ["cat", "/home/hello.txt"]
```
適当なディレクトリを作成し、その中で`hello.txt`を作成し、上記のDockerfileを作成する。
ファイルの名前は`Dockerfile`である必要がある(実行時に指定できるけどここでは)。

このファイルからimageをbuildしよう。
```bash
docker build -t hello .
```
"buildする。`.`(current directoyのDockerfileをルートとし) tagはhelloにする"という意味である。
ここで`-t`はtagの略であり、repository名を指定することができる。
ややこしいのがtagの略のくせにimageのtagではなく、repositoryの名前を指定しているところである。
`docker images`を実行すると
```bash
REPOSITORY                       TAG       IMAGE ID       CREATED         SIZE
hello                            latest    1a65f2ede275   4 minutes ago   78MB
```
いい感じにimageが作成されている!
最高だね。

hello imageからcontainerを作成して見よう。
```bash
❯ docker run hello
Hello World!
```
`hello.txt`の中身が表示された。
ここで気づいたかもしれないが、Dockerfileの`CMD`はcontainerが起動したときに実行されるコマンドである。
たいていのpublic imageでは`CMD [/bin/bash]`がデフォルトで指定されている。
今回は`cat /home/hello.txt`が実行された。
**dockerの基本は1 container 1 processである。**

しかしこのcontainerの中には入れない
というのも`cat /home/hello.txt`のプロセスが終了するとcontainerも終了してしまうからである。
[containerのライフサイクルは7つあり](https://docs.docker.com/reference/cli/docker/container/ls/#status)

1. 一度も開始されていないcontainerは`created`(できたてほやほや)  
1. `docker start`や`docker run`でCMDやENTRYPOINTが実行されると`running`になる。  
1. `docker pause`で`pause`になり、再起動policyによって動き始めるcontainerは`restarting`になる。  
1. container内のプロセスが完了したり、`docker stop`により、もう動作していないcontinaerは`exited`になる。
1. 削除されたcontainerは`removed`になる。
1. 削除がうまくいかず死にかけのcontainerは`dead`になる。

7つながりでDockerfileでよく使うcommandも7つなのでせっかくなのでここでまとめておく。

| command     | description                                         |
| ---         | ---                                                 |
| FROM        | base imageを指定する                                |
| COPY        | ファイルやディレクトリをコピーする                  |
| ADD         | COPYと同じだがtarファイルを解凍する                 |
| RUN         | コマンドを実行する                                  |
| CMD         | containerが起動したときに実行するコマンドを指定する |
| ENTRYPOINT  | containerが起動したときに実行するコマンドを指定する |
| EXPOSE      | portを公開する                                      |
| ENV         | 環境変数を設定する                                  |
| ARG         | build時に指定する変数を設定する                     |
| VOLUME      | マウントポイントを作成する                          |
| WORKDIR     | 作業ディレクトリを指定する                          |
| USER        | ユーザーを指定する                                  |
| HEALTHCHECK | containerのhealthをチェックする                     |
| ONBUILD     | build時に実行するコマンドを指定する                 |

### Dockerfile　ベストプラクティス

https://y-ohgi.com/introduction-docker/3_production/dockerfile/#_1
https://y-ohgi.com/introduction-docker/3_production/image/#5
https://y-ohgi.com/introduction-docker/3_production/security/#root

アプリケーションコンテナとシステムコンテナ

その他
[The Twelve-Factor App （日本語訳）](https://12factor.net/ja/)

## 故障かな？と思ったら
### docker logsを見る
### docker commitで別のimageを作る

# docker compose

## 最も簡単な使い方

## webアプリのdocker化

#### referenec
- [入門 Docker](https://y-ohgi.com/introduction-docker/)
- [始め方 - Get started — Docker-docs-ja 24.0 ドキュメント](https://docs.docker.jp/get-started/toc.html)
- [クィックスタート: Compose と Rails — Docker-docs-ja 24.0 ドキュメント](https://docs.docker.jp/compose/rails.html)
