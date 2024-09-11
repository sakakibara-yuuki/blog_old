---
title: "並行処理: #1 pthread 使い方"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: '/linux/parallel/parallel_1_thread.png'
pubDate: 2024-05-30
tags: ["linux", "parallel", "並行処理", "pthread"]
---

## pthread
pthreadはCで使われるスレッドライブラリであり、POSIXスレッドとも呼ばれる。
pthreadでよく使われる関数は以下の通りである。

- pthread_create: スレッドを作る。
- pthread_exit: スレッドを終了する。
- pthread_join: スレッドの終了を待つ。

- pthread_self: 自分自身のスレッドIDを取得する。
- pthread_equal: スレッドIDが等しいかどうかを調べる。
- pthread_cancel: スレッドをキャンセルする。

特に最初の3つだけで基本的にはスレッドを使うことができる。
最後の3つのうち上２つは使い方が簡単なので説明はせず、最後の一つはそもそも使用することがプログラミングスタイル的に推奨できないので説明はしない。

### スレッドを作る。
以下では`pthread_create`を使っている。使い方についてはmanを見ろという感じ。
重要なことは`pthread_create`はスレッドを作成した後、作成したスレッドの終了を待つことなく、すぐに帰ってくる。
元のスレッドと新しいスレッドがどの順番で実行されるかはOSの気まぐれである。

なお、`pthread_create`の第一引数はスレッドIDを格納する変数であり、int型(`pthread_t`)である。

``` c title="first_thread.c"
#include <pthread.h>
#include <stdio.h>

void *ThreadFunc(void *arg) {
    for(int i=0; i<6; i++) {
        printf("ThreadFunc: %d\n", i);
        sleep(1);
    }
    return NULL;
}

int main() {
    pthread_t thread;

    if(pthread_create(&thread, NULL, ThreadFunc, NULL) != 0) {
        printf("Error: pthread cannot' be create\n");
        exit(1);
    }

    for(int i=0; i<3; i++) {
        printf("main: %d\n", i);
        sleep(1);
    }

    return 0;
}
```
ここで、`ThreadFunc`は`6`回ループするが、`main`は`3`回ループしない。実際に実行してみると、`I'm threadFunc`が`3`回しか表示されないことがわかる。


通常、main関数が終了すると、そのプロセスが終了する。
そのプロセスが終了すると、そのプロセスにおけるスレッドも終了する。

プロセスに対して全てのスレッドは対等であり、
どのスレッドからプロセス終了のシグナルが送られてきてもそのプロセスは終了する。

### スレッドを終了させる。
スレッドはコールバック関数がreturnすると終了する。  
また、`pthread_exit`を使うことでその関数をよびだしたスレッドのみを終了させることができる。
これはいわゆる`break`のようなものであり、入れ子になった呼び出しでも終了させることができる。

``` c title="first_thread2.c"
#include <pthread.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

void AnotherFunc(int n) {
  if(n == 1){
    printf("bye!");
    pthread_exit(NULL);
  }
}

void *ThreadFunc(void *arg){
  for(int i=0; i<3; i++){
    printf("ThreadFunc: %d\n", i);
    AnotherFunc(i);
    sleep(1);
  }
  return NULL;
}

int main(void) {
  pthread_t thread;

  if(pthread_create(&thread, NULL, ThreadFunc, NULL) != 0) {
    printf("Error: pthread cannot be create\n");
    exit(1);
  }

  for(int i=0; i<5; i++){
    printf("main: %d\n", i);
    sleep(1);
  }

  return 0;
}
```
### スレッドの終了を待つ。
スレッドで複数の処理をさせて、その結果をまとめたい場合があるだろう。
他の処理を待ってから次の処理を行いたい場合である。

`pthread_join`はスレッドの終了を待つ関数である。
この関数の返り値は`pthread_join`で指定したスレッドが終了するまで帰ってこない。(そのため無限ループになると`pthread_join`を呼び出した関数も終了できなくなる。)
言ってしまえば,　この関数は非同期で処理されていたスレッドが合流するまで待つ関数である。

なお、`pthread_join`を`main`に書いてあるが、これを他のスレッドから呼び出すことももちろん可能である。
しかし、そうなるとどこでスレッドが生成されてどこで合流するかがわかりにくくなるので、基本的にそのスレッドを生成したスレッドで待ち合わせをするべきである。

また、`pthread_join`を呼ぶ前にスレッドが終了していてもすぐに帰ってくるだけで、問題は無い。
OSはスレッドの実行が終了した後もスレッドのコンテキスト(終了したか？戻り値は何か？)を保持し続けるためである。

ただし、`pthread_join`を呼び出すとOSはそのコンテキストを破棄する。
そのため、`pthread_join`で待った後に再度`pthread_join`で待ってはいけない。
通常、このような二重待ちを避けるために`pthread_join`で一度待った後にはスレッドIDに`NULL`を代入することが推奨されている。

``` c title="first_thread3.c"
#include <pthread.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>


void *ThreadFunc(void *arg){
  int n = (int)arg;

  for(int i = 0; i<n; i++){
    printf("ThreadFunc: %d\n", i);
    sleep(1);
  }
  return NULL;
}

int main(int argc, char *argv[]) {
  pthread_t thread;
  int n;

  if(argc > 1){
    n = atoi(argv[1]);
  } else {
    n = 1;
  }

  if(pthread_create(&thread, NULL, ThreadFunc, (void *)n) != 0) {
    printf("Error: pthread cannot be create\n");
    exit(1);
  }

  for(int i=0; i<5; i++){
    printf("main: %d\n", i);
    sleep(1);
  }

  if(pthread_join(thread, NULL) != 0) {
    printf("Error: failed to wait thread termination\n");
    exit(1);
  }

  printf("Bye!\n");

  return 0;
}
```
二重joinを避ける改良
``` c title="first_thread3.c"
if(thread != NULL){
    if(pthread_join(thread, NULL)!=0){
        printf("Error: failed to wait thread termination\n");
        exit(1);
    }
    thread = NULL;
}
```
