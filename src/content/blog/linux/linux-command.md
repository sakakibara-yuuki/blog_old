---
title: "linuxの基本コマンド  ~~意外と知らないコマンドたち~~"
author: "sakakibara"
description: "linuxの基本コマンド ~~意外と知らないコマンドたち~~"
heroImage: "/linux/linux-command.png"
pubDate: 2024-03-04
tags: ["linux", "コマンド"]
---

# linxuの基本コマンド

linuxにはPOSIXに準拠してるコマンドを中心に様々なコマンドがある。
その中でもかなり使用頻度が高いと思われるものが以下だ。  
manを読めば良くない？  
そういう意見もあるだろう。
だが、基礎的の中でも以外と見落としがちなオプションもあると思う。
そういった以外なオプションも併せて紹介していこうと思う。

## Contents

## command

#### cd : change directory

**ディレクトリを移動する。**

```zsh title="cd"
cd -
cd [-L|-P] [directory]
```

- `cd -`
- `cd -L directory`
- `cd -P directory`

世界でもっともタイプされた2文字だと思う。

| command           | description                                                                                  |
| :---------------- | :------------------------------------------------------------------------------------------- |
| `cd -`            | 直前にいたディレクトリに移動する。直前にいたディレクトリはOLDPWDという環境変数に格納される。 |
| `cd -L directory` | direcotyがシンボリックリンクの場合、実態に移動する。                                         |
| `cd -P directory` | direcotyがシンボリックリンクの場合、そのディレクトリへ移動する。                             |

`cd -`を知らない人は以外といるのではないだろうか？
少し違うが、`popd, pushd`というコマンドがある。
これは移動したディレクトリをスタックに貯めるというものである。
昔このコマンドを使おうと考えていた時期があったが、実際、4文字のコマンドを打つ苦痛がやる気を上回り、使うことをやめてしまった。

#### pwd : print working directory

**作業ディレクトリを表示する。**

```sh title='pwd'
pwd [option]
```

- `pwd -L`
- `pwd -P`

いまどこ？
カレントディレクトリ・作業ディレクトリをprintする。

| command  | description                |
| :------- | :------------------------- |
| `pwd -L` | 環境変数PWDを使用する。    |
| `pwd -P` | シンボリックリンクを除く。 |

PWDはカレントディレクトリのパスが格納された環境変数である。  
ディレクトリA, B, C, Dがあるとする。Cの下にDがあり、そのファイルにシンボリックリンクEが貼られているとする。

```sh
A
├── B
├── C
│   └── D
└── E -> C/D
```

この場合Eを経由してCへ移動するとする。その場合のPWD(pwd)は

```
A/E
```

となる。
ここで`pwd -P`とすると、

```
A/C/D
```

となる。

#### ls : list

**ファイル・ディレクトリの要素を表示する。**

```sh title='ls'
ls [options] [file]
```

- `ls -a`
- `ls -l`

世界でもっともタイプされた2文字だと思う。
オプションが多すぎる。lsを読まなければプログラマを名乗るべきではないという考えがある。実は以外と実装するのが難しいコマンドとしても知られている。

| command     | description                                         |
| :---------- | :-------------------------------------------------- |
| `ls -a`     | all、つまりすべて表示する。隠しファイルも表示する。 |
| `ls -l`     | long, 多くの情報を表示する                          |
| `ls --hide` | パターンマッチしたファイルは表示しない。            |

オプションが多すぎてすべてを追うのは難しい。この２つをよく利用する。とは言っても、オプションを指定しているわけではなく、linuxディストリビューションによっては`la=ls -a`, `ll=ls -l`のようにaliasが指定されてある。なお、`--color`というオプション
もあり、これを指定することで色がつき、テンションが上がる。

#### mkdir : make directory

**ディレクトリを作成する。**

```sh title='mkdir'
mkdir [option] directory
```

- `mkdir -p directory`
- `mkdir -m directory`

意外と`-p`コマンドを使用する。

| command              | description                                                        |
| :------------------- | :----------------------------------------------------------------- |
| `mkdir -p directory` | 作成したいディレクトリの親のディレクトリが存在しなければ作成する。 |
| `mkdir -m directory` | 作成と同時にfile modeを設定する。                                  |

#### rmdir : remove direcotry

**ディレクトリを削除する。空ならね。**

```sh title='rmdir'
rmdir [option] directory
```

- `rmdir -p`

じつはこれに近いコマンドがMS-DOSにも実装されている。

| command    | description                                                          |
| :--------- | :------------------------------------------------------------------- |
| `rmdir -p` | 親のディレクトリまで削除します。`rmdir -p a/b` は`rmdir a/b a`と同じ |

実際にはディレクトリの中にファイルが入っているまま削除する場合が多いため、このコマンドはほとんど使用しない。  
本当は中身を削除して、ディレクトリが空であることを確認した上でrmdirで削除したほうが安全なのかもしれない。

#### cat : concatenate files

**ファイルを連結する。**

```sh title='cat'
cat [option] [file]
```

- `cat -n file1 file2`
- `cat -E file1 file2`

おや？と思った方も多いだろう。
catコマンドというとファイルの中身を見るコマンドとして知られるからだ。

| command              | description                                |
| :------------------- | :----------------------------------------- |
| `cat -n file1 file2` | ファイルを繋げて行番号を表示する           |
| `cat -b file1 file2` | ファイルを繋げて行番号を表示する(空行以外) |
| `cat -E file1 file2` | ファイルを繋げて行末文字を表示する         |
| `cat -`              | catの入力として標準入力を使う              |

このコマンドの本質は引数を与えられた複数のファイルを結合して標準出力に流すことにある。
ファイルの中身を見るという使い方は目的のファイルと0個のファイルを結合して標準出力に流すという処理に相当する。

この他に重要な使い方としてヒアドキュメントを利用した書き方がある。

```sh title='cat'
cat - << EOF > file
>   Alice was beginning to get very tired of sitting by her sister
> on the bank, and of having nothing to do:  once or twice she had
> peeped into the book her sister was reading, but it had no
> pictures or conversations in it, `and what is the use of a book,'
> thought Alice `without pictures or conversation?'
> EOF
```

指定した文字(EOF)が出てくるまでを入力とする書き方でshell scriptの中などで意外と使用される。

#### more : more display

**もっと表示する。**

```zsh title=more
more [option] file
```

- `more -p file`
- `more -n number file`

| command               | description                                          |
| :-------------------- | :--------------------------------------------------- |
| `more -p file`        | moreしたあとにスクリーントップまでスクロールします。 |
| `more -n number file` | n字行頭から表示します                                |

次の`less`が優秀過ぎて完全に下位互換です。

#### less : opposite more

**moreとは違う。**

```zsh title=less
less [option]
```

- `less -N file`
- `less -X file`

| command        | description                            |
| :------------- | :------------------------------------- |
| `less -N file` | 行番号を表示                           |
| `less -X file` | lessで表示した内容をターミナルに残す。 |

moreとは異なり、後ろに戻ることができる。また、moreとはことなり、一度にすべて読み込んでいるわけではないので大きなファイルを開く際に有効。そして何よりvi likeなキーバインドで操作できるのでvi like キーバインドに慣れている人にとってはかなり使いやすい。  
特に、砂漠のような環境では必ずしもターミナルがスクロールできるとは限らない。
そもそもスクロールという概念がGUIシステムがなければ成り立たないものだからだ。
そんなとき、lessコマンドがデフォルトで入っていることに深く感謝する日がくるだろう。
そして、ちょっとしたファイルを開くのにVScodeなどを使用していた過去の自分に後悔するのだ。
`less`..お前がいたのにな。ずっと傍で見守っててくれたんだな。と。

#### tail : dispaly last file

**ファイルの尻尾だけ見せる。**

```zsh title=tail
tail [option] [file]
```

- `tail -n number file`
- `tail -f file`

| command           | description                                |
| :---------------- | :----------------------------------------- |
| `tail -n 10 file` | ファイルの末尾20行を表示する。             |
| `tail -f file`    | 増えていくファイルを追跡(follow)表示する。 |

`tail`意外にも`head`というコマンドがある。
`tail`と同じコマンドで効果は逆となる。

特に`tail -f file`が面白い。
指定したファイルが書き込まれるとそれを追跡して表示してくれる。  
どうもログを追跡表示する際に使用するらいしい。

#### touch : update timestamp

**タイムスタンプを更新する。**

```zsh title=touch
touch [option] file
```

- `touch -a file`
- `touch -m file`

え、このコマンドって空のファイルを作るコマンドじゃないんですか？
そう思った人も多いだろう。

| command         | description              |
| :-------------- | :----------------------- |
| `touch -a file` | アクセス時刻を変更する。 |
| `touch -m file` | 更新時刻を変更する。     |

昔、恩師からアクセス時刻や更新時刻を変更するということを教えてもらった。
そもそもファイルのアクセス時刻や更新時刻とはなんだろうか。
ファイルには以下のタイムスタンプがある。

| timestamp | mean   | description                                                                                                                     |
| :-------- | :----- | :------------------------------------------------------------------------------------------------------------------------------ |
| atime     | access | ファイルを読み込んだ際に更新される。 <br> ファイルの属性を更新した際に更新される。<br> ファイルの内容を更新した際に更新される。 |
| ctime     | change | ファイルの属性を変更した際に更新される。 <br> ファイルの内容を変更した際に更新される。                                          |
| mtime     | modify | ファイルの内容を変更した際に更新される。                                                                                        |

#### stat : status of file

**ファイルのステータスを表示する**

```zsh title=stat
stat [option] [file]
```

- `stat -f file`
- `stat -t file`

| command        | description                                          |
| :------------- | :--------------------------------------------------- |
| `stat -f file` | ファイルが管理されているファイルシステムを表示する。 |
| `stat -t file` | ファイルの簡易情報を表示する。                       |

`ls`関連のコマンドを調べている際に出会った.
どうもctime, atime, mtimeの情報を表示することができるらしい.

#### rm : remove file or directory

**ファイル or ディレクトリを削除する。**

```zsh title=rm
rm [option] [file]
```

- `rm -r file`
- `rm -f file`

| command      | description                                                    |
| :----------- | :------------------------------------------------------------- |
| `rm -r file` | 再帰的に削除する。つまり、中にディレクトリがあろうが削除する。 |
| `rm -f file` | 強制的に削除する。問答無用                                     |

世の中に絶望し、自暴自棄になっていた俺は`rm -rf`を使うことになんの躊躇いもなかった。  
ある日、何かの間違いで'~'というファイル名のファイルを作ってしまった。

"チッ、舐めたツラしたファイルだな。消してやる。"

俺はホームレスになっていた。

#### mv : move file

**ファイルを移動(名前の変更)をする。**

```zsh title=mv
man [option] source dest
```

- `mv -f source dest`
- `mv -S=hoge source dest`
- `mv -b=never source dest`

| command                   | description                                              |
| :------------------------ | -------------------------------------------------------- |
| `mv -f source dest`       | 同じ名前のファイルがあっても強制的に移動させる。         |
| `mv -S=hoge source dest`  | 同じ名前のファイルあったら末尾に文字列(hoge)を追加する。 |
| `mv -b=never source dest` | 同じ名前のファイルがあったらバックアップ(~)を指定する    |

基礎的なコマンドほど実力が問われる。

ここで取り上げたコマンドは基本的に同じコマンドがあった際にどのように振る舞うかだ。
いちいち他の名前にしたディレクトリを作成してからmvをするのでは手間がかかる。
そこで、上記のようなコマンドを使用する。
基本的に`alias mv=mv --backup=never`のようにエイリアスを指定して使用する。

また、たまにスクリプトで見かけるのがブレース展開である。[^1][^2]
簡単に言ってしまえばカッコ{}を外延的に展開する。  
そして展開した文字列には分配法則のような規則が適応される。  
まぁ、そんな感じ。

```zsh title='mv'
mv hoge{,.suffix}
```

この場合`hoge.suffix`というファイルが生成される。

[^1]: [zshのブレース展開](https://zsh.sourceforge.io/Doc/Release/Options-Index.html)

[^2]: [zshのブレース展開解説](https://hirotanoblog.com/linux-brace-expansion/11557/)

#### cp : copy file or direcotry

**ファイルをコピーする。**

```zsh title=cp
cp [option] source dest
```

- `cp -r source dest`
- `cp -a source dest`
- `cp -s source dest`

mvと似たようなコマンド(--backup, -S, -f)も一応ある。

| command             | description                            |
| :------------------ | :------------------------------------- |
| `cp -r source dest` | 再帰的にコピーする。                   |
| `cp -a source dest` | アクセス権も含めて再帰的にコピーする。 |
| `cp -s source dest` | シンボリックリンクを作成する。         |

最後のコマンドを見て、嘘だろ。`ln`の立場なくなるやんけ。と思った方もいるだろう。
ここで作成したシンボリックリンクはカレントディレクトリに作成される。

#### ln : make link file

**リンクを作成する。**

```zsh title=ln
ln [option] target link_name
```

- `ln -s target link_name`
- `ln -f target link_name`

linuxはファイル・ディレクトリ・リンクの3つの原子で構成されている。  
というかそもそもファイルって何？  
我々調査隊は[ファイルシステムの奥地](post-20) へと向かった...

| command                  | description                    |
| :----------------------- | ------------------------------ |
| `ln -s target link_name` | シンボリックリンクを貼る       |
| `ln -f target link_name` | 既にリンクがあったら削除する。 |

引数を特に使用しないならハードリンクになる。
とはいってもあまりハードリンクを使用したことがない。

#### find : find file

**ファイルを探す。**

```zsh title=find
find [option] [starting-point(path)...] [expression]
```

- `find path -maxdepth 2 -name 'file_name_reg'`
- `find path -mindepth 3 -path 'path_name_reg'`
- `find path -type f -name 'path_name_reg' -printf`

これもオプションが多い。unixの哲学はどうした。kissはどうした。

| command                                           | description                                                                              |
| :------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `find path -maxdepth 2 -name 'file_name_reg'`     | 最大深さ2でpathからスタートして`file_name_reg`でマッチするファイルを探しパスを表示する。 |
| `find path -mindepth 3 -path 'path_name_reg'`     | 最小深さ3でpathからスタートして`path_name_reg`でマッチするパスを探してパスを表示する。   |
| `find path -type f -path 'path_name_reg' -printf` | pathから`path_name_reg`にマッチするパスを探し、ファイルを集め、表示する。                |

`find`コマンドのexpressionにワイルドカードなどを使用する場合はシングルクォート(ダブルクオート)で囲む必要がある。shellが展開してしまい複数のexpressionが渡されてしまうためである。
たとえば、

```zsh
find . -name *.txt
```

だと、実質

```zsh
find . -name a.txt b.txt c.txt
```

のように`find`コマンドを呼び出していることと同じになる。

`find`コマンドはtypeオプションを使用することでファイルの種類を指定することができる。これはファイルやディレクトリ以外にもブロックファイルやキャラクタファイル, ソケットなども指定することができる。
また、`-printf`オプションのようにファイルを実行することができる。
`-exec rm`のようにすると`find`見つけたファイルを削除することができる。

#### chmod : change mode

**mode を変更する。**

```zsh title=chmod
chmod [option] [mode] file
```

- `chmod -R 777 file`
- `chmod ug+x file`
  見ざる・書かざる・動かざる
  | command | description |
  |:---------------------|--------------------------------------|
  | `chmod -R 777 file` | 再帰的に権限を変更する。 |
  | `chmod -R ug+x file` | ユーザとグループに実行権限を与える。 |

`chmod`コマンドはファイルの権限を変更するコマンドである。
ファイルにはアクセス権限という概念があり、だれがそのファイルにアクセスできるかを制御することができる。
どのアクセス権限が設定されているかは`ls -l`コマンドで確認することができる。

```zsh
drwxr-xr-x 2 sakakibara sakakibara 4096 Mar  4 18:31 B
drwxr-xr-x 3 sakakibara sakakibara 4096 Mar  4 18:35 C
lrwxrwxrwx 1 sakakibara sakakibara    3 Mar  4 18:35 E -> C/D
```

上記の例で、`B`というディレクトリはユーザー`sakakibara`が所有しており、グループ`sakakibara`に属している。

`drwxr-xr-x`は

- `d` directory
- `rwx` はread, write, execute
  を表す。

`rwx`が3つあるが、それぞれ前からユーザ(ファイルの所有者)、グループ、その他に関するアクセス権限を表す。
ファイルBはsakakibaraは読み書き実行ができ、sakakibaraに属しているユーザは読み込みと実行ができるが書き込みはできない。
その他のユーザーは実行しかできない。
ということを表している。

`777`とはユーザ、グループ、その他それぞれの`rwx`を8進数で表した数である。
それぞれ次のように対応している。

- `x`: 1
- `w`: 2
- `r`: 4

例えば、ユーザーが読み書き実行が可能ならば $4 + 2 + 1 = 7$
となり、
グループが読み込みと実行が可能ならば $4 + 0 + 1 = 5$
その他のグループは何もできないならば $0 + 0 + 0 = 0$
となり、`750`となる。

#### chown : change ownership

**ownershipを変更する。**

```zsh title=chown
chown [option] [owner]:[group] file
```

- `chown user:group file`
- `chown -R user:group file`
  ファイルのオーナーは誰。

| command                    | description                            |
| :------------------------- | :------------------------------------- |
| `chown user:group file`    | ユーザーとグループを変更する。         |
| `chown -R user:group file` | 再帰的にユーザーとグループを変更する。 |

ファイルの所有者がどのユーザーか、どのグループかを変更するコマンドである。
たとえば、`ls -l`で

```
drwxr-xr-x 2 sakakibara sakakibara 4096 Mar  4 18:31 B
drwxr-xr-x 3 sakakibara sakakibara 4096 Mar  4 18:35 C
lrwxrwxrwx 1 sakakibara sakakibara    3 Mar  4 18:35 E -> C/D
```

であるならば、`chow root:root B`とすることでBの所有者をrootに変更することができる。

```
drwxr-xr-x  2 root       root       4096 Mar  4 18:31 B
drwxr-xr-x  3 sakakibara sakakibara 4096 Mar  4 18:35 C
lrwxrwxrwx  1 sakakibara sakakibara    3 Mar  4 18:35 E -> C/D
```

#### ps : show processes

**プロセスを見る。**

```zsh title=ps
ps [optinos]
```

プロセスを見るコマンドである。
次のコマンドと合わせて使用することが多い。
なぜか制御端末があるプロセスかどうかについての情報が多い。

- `ps -A`
- `ps a`
- `ps -C`

| command     | description                            |
| :---------- | :------------------------------------- |
| `ps -A`     | 全てのプロセスを表示する。             |
| `ps a`      | 制御端末を持つプロセスを表示する。     |
| `ps x`      | 制御端末を持たないプロセスを表示する。 |
| `ps u`      | プロセスのユーザーも含め表示する。     |
| `ps -C zsh` | コマンド名でプロセスを表示する。       |

`ps aux`のようにするとより詳細な情報を表示することができる。

#### kill : kill jobs

**ジョブを殺す。**

```zsh title=kill
kill [-signal] pid|name
```

- `kill pid`
- `kill -l`
- `kill -s SIGNAL pid`
- `kill %job`

| command              | description                                   |
| :------------------- | :-------------------------------------------- |
| `kill pid`           | pidのプロセスを消す。`kill -s TERM pid`と同じ |
| `kill -l`            | シグナルの一覧を表示する。                    |
| `kill -l SIGNAL`     | シグナルの番号を表示する。                    |
| `kill -s SIGNAL pid` | シグナルを指定してプロセスに送る。            |
| `kill $job`          | ジョブを消す。                                |

<!-- プロセスとジョブって何が違うんスカ？ -->

ジョブはシェルによって管理されるプロセスの集まりである。
コマンドによって生じる複数のプロセス群をまとめて管理するために使用される。これによって単一のコマンド(だが、複数のプロセスを生成する)ものを一つのものとして(ジョブとして)管理することができる。

## [番外編]

### 知っておいたほうがよいコマンド

#### zgrep

**圧縮ファイルに対するgrep**

```zsh title='zgrep'
zgrep [option] [-e] pattern filename
```

オプションは`grep`で使用されているものを引き継ぎます。

### コマンド・メタ

#### man & whatis & apropose

**このコマンドって何？**

```zsh title='whatis & apropose'
whatis -w "*ls*"
apropos user
```

### おもしろコマンド

#### pv

**パイプ先の処理時間を表示する**

#### at

**指定した時刻にプログラムを走らせる**

#### export

**変数を環境変数に出荷する**
おまえ、コマンドだったのか。シンタックスだと思ってた。

#### script

#### tmpwatch

#### tee

#### watch

#### yes

#### sar

#### taskset

#### readelf

#### file

#### pstree

#### nohup

#### disown

#### strings

## 参考

- [［改訂第3版］Linuxコマンドポケットリファレンス](https://www.amazon.co.jp/%EF%BC%BB%E6%94%B9%E8%A8%82%E7%AC%AC3%E7%89%88%EF%BC%BDLinux%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%83%9D%E3%82%B1%E3%83%83%E3%83%88%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9-%E6%B2%93%E5%90%8D-%E4%BA%AE%E5%85%B8/dp/4774174041/ref=pd_bxgy_img_d_sccl_2/357-3659538-7720555?pd_rd_w=89tMa&content-id=amzn1.sym.a6ef8710-f9e8-4ae9-bcba-322dc294eed3&pf_rd_p=a6ef8710-f9e8-4ae9-bcba-322dc294eed3&pf_rd_r=57BBVJE6CARFCW585QWQ&pd_rd_wg=0eC5L&pd_rd_r=fcbf9584-b63d-4c65-9191-c4b49cf52306&pd_rd_i=4774174041&psc=1)
- [POSIX準拠とは本当はどういうことなのか？「POSIXで規定されたものだけを使う」ではありません](https://qiita.com/ko1nksm/items/08228276ce9335592989)
- [POSIX C言語API一覧とコマンド一覧の調べ方](https://qiita.com/ko1nksm/items/18787925a7821e1d5d74)
