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
docker rmi ubuntu:latest           # repository
```
ただし、注意が必要なのは
- containerは停止している状態でないと削除できない。
- imageはcontainerが存在していると削除できない。(`-f`を使わない限り)
ということである。
必ずcontainerが停止しているか確認してから削除すること。
また`docker rmi <image id>`と`docker rmi <repository>`は微妙に[挙動](https://docs.docker.com/reference/cli/docker/image/rm/)が異なる。
`docker rmi <repository:tag>`はそのtagだけを消すが、`docker rmi <image id>`はimageレイヤー自体を消す。
tagが複数ある場合に`docker rmi <image id>`を使うとエラーになる。

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

| command    | description                                                                                                                                                                     |
| ---        | ---                                                                                                                                                                             |
| FROM       | base image(ベースとなるDocker Image)を指定する                                                                                                                                  |
| ENV        | Docker内で使用する環境変数を設定する                                                                                                                                            |
| WORKDIR    | Dockerfileのコマンドを実行する作業ディレクトリを設定する。ディレクトリが存在しなければ自動的に作成される。デフォルトだと`/`が設定されている。                                  |
| COPY       | ホストのファイルやディレクトリをDocker内へコピーする。ホスト側のディレクトリは`docker build .`で指定したディレクトリ。                                                          |
| RUN        | Docker内でコマンドを実行する                                                                                                                                                    |
| USER       | Docker Imageのログインするユーザー(ログインユーザー)を指定する                                                                                                                  |
| CMD        | containerが起動したときに実行するコマンドを指定する。ここで設定したコマンドがフォアグラウンドで実行されている間が生存期間になる。バックグラウンドで起動するとDockerが終了する。 |
| EXPOSE     | コンテナ起動時に公開するport記述する。ここで指定されたportをホスト側へ公開するには`-P`を使用する。                                                                             |
| VOLUME     | マウントポイントを作成する。基本的にログのような更新頻度の激しいファイルで使用すると良い。                                                                                                                                                      |
| ARG        | Dockerfileのbuild時に指定する変数を設定する。複雑になりすぎるため、基本的に使用しない。                                                                                                                                                 |
| ADD        | COPYと同じだがurlからファイルをダウンロードし、コンテナへコピー。tarファイルを解凍する                                                                                                                                             |
| ENTRYPOINT | containerが起動したときに実行するコマンドを指定する。引数を渡すと実行される。                                                                                                                             |

### Dockerfile　ベストプラクティス
コンテナと言っても様々なタイプのコンテナがある。そのうち代表的なものが
"アプリケーションコンテナ"と"システムコンテナ"である。

システムコンテナは通常のLinuxのように様々なアプリケーションを動かすためのコンテナである。
Dockerの登場以前はこちらのコンテナが主流であった。
対して、アプリケーションコンテナは1コンテナ1アプリケーションを動かすコンテナである。
1つのアプリケーションを動かすためだけの環境しか含まないため、システムコンテナよりも軽量である。アプリケーションコンテナはアプリケーションを最初のプロセスとして直接立ち上げることが多い。

この使用例に沿って軽量なイメージを作成することがベストプラクティスである。
具体的には

1. 最小限の構成にする
 - 1コンテナ1アプリケーションを守る。
1. 軽量なベースイメージを使用する
 - Googleが提供しているdistroless imageを使う. distolessイメージはアプリケーションの実行に必要なものだけが含まれているコンテナイメージであり、パッケージマネージャーやシェルは含まれていない。distorelessイメージを使うことで、イメージのサイズを最小限に抑えることができ、ロールバックやスケジューリングにかかる時間を短縮することができる。同時に、セキュリティリスクを最小限に抑えることができる。
1. Multi-Stage Buildを使う
 - distorelessイメージを使うとビルドができないが、Multi-Stage Buildを使うことでビルド環境と実行環境を分けることができる。Multi-Stage BuildとはDockerfile内で複数のFROMを使ってアプリケーションをビルドするステージとDockerコンテナで使用するイメージを作成するステージを分ける方法である。この最後のFROMでdistrolessイメージを使うことでイメージサイズを軽減することができる。
1. .dockerignoreを使う
 - `.git`や`node_modules`のような上書きされると困るものを記述する。`.dockerignore`は`.gitignore`と同じ書き方が可能。
1. Build時にcacheを意識する
 - build後にコマンドの変更、ファイルの追加や更新などが行われたら、変化が起こったレイヤーのキャッシュからビルドを実行する。コードの変換を行えばキャッシュが効かなくなる。

その他: [The Twelve-Factor App （日本語訳）](https://12factor.net/ja/)
<!-- - https://y-ohgi.com/introduction-docker/3_production/dockerfile/#_1 -->

### Docker contaienr のセキュリティリスク
Dockerと仮想マシンを比較した際の欠点は仮想マシンに対してセキュリティリスクが低いことである。

rootユーザーを使わない。
信頼されたimageを使う。
ビルド時に機密情報を与えない。
 - ビルド時にパスワードなどの機密情報を与えないようにする。[`--secret`](https://docs.docker.com/engine/swarm/secrets/)や[`--ssh`](https://docs.docker.com/reference/cli/docker/buildx/build/#ssh)を使ってセキュアにビルドする。パスワードなどの接続情報や環境変数は[Vault](https://developer.hashicorp.com/vault)などのシークレットマネージャーを使う。
.dockerignoreファイルを使う。
 - `.env`のようなファイルを見逃すようにする。
<!-- マウントには最小限の権限を与える。 -->
<!--  - ホストのファイルをマウントす -->
<!-- - https://y-ohgi.com/introduction-docker/3_production/security/#root -->
<!-- - https://y-ohgi.com/introduction-docker/3_production/image/#5 -->

## 故障かな？と思ったら
### docker logsを見る
`docker logs`でログを確認することができる。ただし、ここで確認できるログは起動したプロセスの**標準出力と標準エラーのみ**であることに注意する。

### docker commitで別のimageを作る
コンテナが停止し、その原因を探ろうと思っても、
アプリケーションの中にはエラーの情報をファイルに吐き出すものがある。このような場合は`docker logs`でログを確認することができない。

`docker start`でコンテナを起動したとしてもCMDが実行されてしまう。

このような場合、`docker commit`で停止したコンテナの状態を保存し、その状態から新しいコンテナを作成することができる。

# docker compose

## 最も簡単な使い方

## webアプリのdocker化

#### referenec
- [入門 Docker](https://y-ohgi.com/introduction-docker/)
- [始め方 - Get started — Docker-docs-ja 24.0 ドキュメント](https://docs.docker.jp/get-started/toc.html)
- [クィックスタート: Compose と Rails — Docker-docs-ja 24.0 ドキュメント](https://docs.docker.jp/compose/rails.html)
