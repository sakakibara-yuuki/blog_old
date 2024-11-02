---
title: "docker: Dockerの使い方"
author: "sakakibara"
description: "dockerの使い方"
pubDate: 2024-06-25
updatedDate: 2024-11-8
heroImage: "/virtualize/docker_use.webp"
tags: ["仮想化", "docker", "container"]
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

:::note{.note}
imageとはimageファイル、
つまり光学メディアつまりCDやDVDのソフト化したものである。
たいていはシステムの完全な情報を一つのファイルに格納している。
昔はシステムの情報をCDやDVDに焼いていたが、現在では実際にCDやDVDに焼くことは少い(自分の周りでは)。
ただ慣例からimageファイルという言葉が使われている。SDに入れてもUSBに入れてもimageファイル。仮想化環境に入れてもimageファイルなのである。
:::

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
GitHub Container RegistryやAWS Elastic Container Registry, Artifactなどがある。
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

dockerを使っていくと、containerやimageがどんどん増えていくので、定期的に削除することが重要である。そこで、一括に削除する方法を紹介する。
```bash
docker prune prune
docker system prune

WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - unused build cache
```
dangling imagesというのは、tagがないimageのことである。Dockerfileからimageを作成すると、そのimageはtagがない状態で作成される。このようなimageをdangling imageという。


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
ここで`-t`はtagの略であり、`<repository:tag>`を指定することができる。このように指定しなければ、tagは自動でlatestになる。

imageの名前というのは大まかに`<repository:tag>`のことを指す。ただし文脈によっては`<repository>`だけを指すこともある。
さらに厳密にはimageの名前というのは
```bash
<hostname>:<port>/<username>/<repository>:<tag>
```
でOCIで規定されている。
dockerのimageというのは同じimageのimage idに対して複数の`<repository:tag>`をもつことができる。
repository名はどこに保存するかの情報でありimageそのものを指しているわけではない。
あくまでもimage idにtagがついているということである。
<!-- ややこしいのがtagの略のくせにimageのtagではなく、repositoryの名前を指定しているところである。 -->
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

Dockerfileでよく使うcommandも7つなのでせっかくなのでここでまとめておく。

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

さて、先程のcontainerにはどうやって入ればいいのだろうか？
実はそれはできない。  
というのもCMDで定義した`cat /home/hello.txt`のプロセスが終了するとcontainerも終了してしまうからである。

### Dockerのライフサイクル
containerの[ライフサイクル](https://docs.docker.com/reference/cli/docker/container/ls/#status)は7つあり、以下のようである。

1. 一度も開始されていないcontainerは`created`(できたてほやほや)  
1. `docker start`や`docker run`でCMDやENTRYPOINTが実行されると`running`になる。  
1. `docker pause`で`pause`になり、再起動policyによって動き始めるcontainerは`restarting`になる。  
1. container内のプロセスが完了したり、`docker stop`により、もう動作していないcontinaerは`exited`になる。
1. 削除されたcontainerは`removed`になる。
1. 削除がうまくいかず死にかけのcontainerは`dead`になる。

`exited`しただけでCMDの存続期間が長いcontainerでは
```bash
docker restart <container id>
```
で再起動できる。
また, containerから出るには`exit`を実行するか、`Ctrl + p + q`を押す。
`exit`はコンテナを動かしているプロセスを終了するので、containerも終了する。
`Ctrl + q + p`はコンテナを動かしているプロセスを終了せずにコンテナから抜ける。
この場合、コンテナのステータスは`running`のままである。
| command | description |
| --- | --- |
|exit|コンテナを終了する|
|Ctrl + p + q|コンテナを終了せずに抜ける(デタッチ)|

デタッチで抜けたcontainerに対して
```bash
docker attach <container id>
```
とすることで再びそのコンテナに入ることができる。

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
 - `.env`のようなファイルを含まないようにする。
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
```bash
docker commit <container id> <new image name:tag>
```
例
```bash
❯ docker images
REPOSITORY                       TAG       IMAGE ID       CREATED         SIZE
hello                            latest    1a65f2ede275   2 days ago      78MB
❯ docker ps -a
CONTAINER ID   IMAGE                                 COMMAND                  CREATED       STATUS                     PORTS     NAMES
7716c45d1ea7   hello                                 "cat /home/hello.txt"    2 days ago    Exited (0) 2 minutes ago             brave_mestorf
33ab02be4eda   hello                                 "cat /home/hello.txt"    2 days ago    Exited (0) 2 days ago                nostalgic_agnesi

❯ docker commit 7716c45d1ea7 helloworld:update  
sha256:b6dc487b3ce2243015e4fd0893eb7e26a1e250fe43cb4d8caa52834615def4d7

❯ docker images
REPOSITORY                       TAG       IMAGE ID       CREATED          SIZE
helloworld                       update    b6dc487b3ce2   10 seconds ago   78MB
hello                            latest    1a65f2ede275   2 days ago       78MB
```

#### docker Hub
docker HubはDockerの公式レジストリであり、Dockerイメージを保存・管理するためのサービスである。
ここに自分が作成したimageをpushしてみる。
```bash
❯ docker images
REPOSITORY                       TAG       IMAGE ID       CREATED         SIZE
sakakibarayuuki/hello            update    459db1b7e63a   3 seconds ago   78MB
❯ docker login
Login Succeeded
❯ docker push sakakibarayuuki/hello:update
The push refers to repository [docker.io/sakakibarayuuki/hello]
4568fc594304: Pushed
a30a5965a4f7: Mounted from library/ubuntu
update: digest: sha256:3fe269400820339033658ec085e741f8761fd793ecb9e77ae9efb77e62c39c50 size: 736
```
こうすることで自分が作成したimageをdocker Hubにpushすることができる。
docker Hubは変化したimage layerだけをpushするので、大きなファイルをpushするときには便利である。
dockerのimageがどんなものかを知りたいときには`docker history`を使うと良い。
```bash
docker history
```
#### docker run再考
docker runは`create + start`を一口におこなうコマンドである。
`create`はimageからcontainerを作成するコマンドであり、
`start`はcontainerのCMDを実行するコマンドである。
CMDがすぐに終了するコマンドである場合、`docker run`はすぐに終了する。
CMDを上書きするには以下のようにする。
```bash
❯ docker run hello whoami
root
```
しかし、コンテナの中に入って作業をしたいという場合はどうすればいいのだろうか？
`-it`オプションを使うことでコンテナの中に入ることができる。
```bash
docker run -it hello /bin/bash
```
この`-it`は`-i`と`-t`の略であり、`-i`はコンテナの標準入力を開き、`-t`はttyを開くという意味である。
試しに、
```bash
❯ docker run -t hello bash
root@ede2f58c7c2f:/# ls

```
のようにしてみると、コンテナの中に入ることができるが、`ls`などのコマンドから応答が帰ってこない。

`-i`オプションはホスト側からコンテナへの標準入力をつなぐためのオプションであり、これが無いとコンテナの中でコマンドを実行してもホスト側には返ってこない。

`-t`オプションはttyを開くためのオプションであり、これが無いとコンテナの中でコマンドを実行してもttyが開かれていないため、コマンドが実行されない。

また、システムコンテナのように常時起動しているコンテナには名前をつけることができる。
```bash
docker run -it --name dev hello bash
```
また、名前をつけるとプログラムから呼び出せるときに便利という利点がある。
また、
detached mode と foreground mode(short-term)という２つの使い方がある。
```bash
docker run -d <image>  # コンテナをバックグラウンドで動かす(detached mode)
docker run --rm <image>  # コンテナをExitする際に削除する (foreground mode)
```

#### docker run -u $(id -u):$(id -g)を使う
dockerはデフォルトでrootユーザーでコンテナを起動する。
これがセキュリティ的にまずいのは、例えばローカルのファイルをマウントした際に、root権限を持ってローカルのファイルを操作できる可能性があるからである。
そこで、`-u`オプションを使ってログインユーザーを指定することができる。

まず、適当にDockerfileを作成し、ビルドする。
```bash
FROM ubuntu:latest

RUN mkdir created_in_Dockerfile
```
```bash
❯ docker images
REPOSITORY                       TAG       IMAGE ID       CREATED          SIZE
<none>                           <none>    145de4e2c089   3 seconds ago    78MB
```
次に、`-u`オプションを使用してログインユーザーを指定しコンテナを起動する。
```bash
❯ docker run -it -u $(id -u):$(id -g) -v .:/created_in_run 145de4e2c089
ubuntu@96722b4b8025:/$ id -u
1000
ubuntu@96722b4b8025:/$ id -g
1000
```
するとどうだろう。コンテナ内でのユーザーが`1000:1000`になっている。rootユーザーではない。
次に`run`実行時に作成したファイルとDockerfileで作成したファイルの権限を見てみる。

```bash
ubuntu@96722b4b8025:/$ ll
total 64
drwxr-xr-x   1 root   root   4096 Jun 28 09:11 ./
drwxr-xr-x   1 root   root   4096 Jun 28 09:11 ../
-rwxr-xr-x   1 root   root      0 Jun 28 09:11 .dockerenv*
lrwxrwxrwx   1 root   root      7 Apr 22 13:08 bin -> usr/bin/
drwxr-xr-x   2 root   root   4096 Apr 22 13:08 boot/
drwxr-xr-x   2 root   root   4096 Jun 28 09:09 created_in_Dockerfile/
drwxr-xr-x   2 ubuntu ubuntu 4096 Jun 28 09:09 created_in_run/
```
`created_in_Dockerfile`を見ると、アクセス権限が`drwxr-xr-x`になっている。
今、自分は`1000:1000`のユーザーであり、`root`ユーザーでも`root`グループでもないのでその他の`r-x`の権限が適用される。

この結果により`run`実行時に`-u`オプションを使うことで、マウント時のファイルの権限を制御し、ログインユーザーを指定することができる。
また、Dockerfileで作成したファイルはroot権限で作成されることがわかる。

#### referenec
- [入門 Docker](https://y-ohgi.com/introduction-docker/)
- [始め方 - Get started — Docker-docs-ja 24.0 ドキュメント](https://docs.docker.jp/get-started/toc.html)
- [クィックスタート: Compose と Rails — Docker-docs-ja 24.0 ドキュメント](https://docs.docker.jp/compose/rails.html)
