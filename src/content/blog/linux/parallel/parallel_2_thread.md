---
title: "並行処理: #2 pthreadによるデータの共有"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: '/linux/parallel/parallel_2_thread.png'
pubDate: 2024-05-30
tags: ["linux", "parallel", "並行処理", "pthread"]
---

### コンテキストスイッチ
スレッドの切替時にはコンテキストスイッチが発生する。  
コンテキストスイッチとは、 *CPUのレジスタに含まれる情報* (プログラムカウンタ、スタックポインタ、汎用レジスタ)を *メモリの特定の場所* に保存し、後で復元すること(機構)である。

コンテキストスイッチは２つの手段に分かれる。
1. コンテキストの保存
 - 保存するレジスタ: プログラムカウンタ、スタックポインタ、汎用レジスタ
 - メモリに保存: レジスタの内容は(現在のスレッドの)コントロールブロックに保存される。
1. コンテキストの復元
 - スレッドの選択: OSのスケジューラが次に実行するスレッドを選択する。
 - メモリから復元: 次のスレッドまたはコントロールブロックからレジスタの内容を復元する。
 - 実行の再開: レジスタの内容が復元された後、次のスレッドが再開される。

### コントロールブロック
コントロールブロックとはOSがプロセスやスレッドの状態を管理するために使用するデータ構造である。
コントロールブロックは以下の２つに分けられる。
- PCB: プロセスコントロールブロック
- TCB: スレッドコントロールブロック

PCBに保存される内容としては
- プロセスID (PID): 各プロセスに固有の識別子。
- プロセス状態: 実行中、準備完了、待機中などのプロセスの現在の状態。
- プログラムカウンタ (PC): 次に実行される命令のアドレス。
- レジスタの内容: プロセスの実行中のCPUレジスタの内容。
- メモリ管理情報: プロセスのメモリ空間（ページテーブルやセグメント情報など）。
- 入出力状態情報: プロセスが使用している入出力デバイスの情報。
- スケジューリング情報: プロセスの優先度やスケジューリングキューの位置など。
- アカウント情報: CPU使用時間やメモリ使用量などのリソース使用情報。

TCBに保存される内容としては
- アカウント情報: CPU使用時間やメモリ使用量などのリソース使用情報。
- スレッド状態: 実行中、準備完了、待機中などのスレッドの現在の状態。
- プログラムカウンタ (PC): スレッドの次に実行される命令のアドレス。
- レジスタの内容: スレッドの実行中のCPUレジスタの内容。
- スタックポインタ: スレッドのスタックの現在のトップを指すポインタ。
- スケジューリング情報: スレッドの優先度やスケジューリングキューの位置など。

```bash
+------------------+
| プロセスID      |
| プロセス状態    |
| プログラムカウンタ|
| レジスタ内容    |
| メモリ管理情報  |
| 入出力状態情報  |
| スケジューリング|
| アカウント情報  |
+------------------+

+------------------+
| スレッドID      |
| スレッド状態    |
| プログラムカウンタ|
| レジスタ内容    |
| スタックポインタ|
| スケジューリング|
+------------------+
```

### サブルーチンとコルーチン
サブルーチンと関数は同じ意味で、特定のタスクを実行するための自己完結型のコードブロックである。

対して、コルーチンは、サブルーチンと異なり複数のエントリポイントを持ち、実行状態を保持して再開することのできるプログラム構造である。
制御ポイントを移動さえるにはyieldを使う。

サブルーチンとコルーチンの違いとしては
- サブルーチン
 - 単一のエントリポイントと終了ポイントを持つ。
 - 一度呼び出されると、完了するまで実行を続ける。
 - 終了後、制御は呼び出し元に戻る。
- コルーチン
 - 複数のエントリポイントを持つ。
 - `yield`を使って、途中で一時停止し、再開することができる。

コルーチンはどうやって関数の状態を保存しているのか？
コルーチンが実行されると、その状態をコンテキストとしてメモリに保存する。
1. ローカル変数と実行状態をメモリに保存する。
 - ローカル変数やプログラムカウンターを保存する。
1. スタックの管理
 - 実装にもよるが、コルーチン毎に専用のスタックを持ち、コルーチンが実行を再開するときにはスタックを用いてローカル変数や戻りアドレスを管理する。
1. Generatorとしての実装
 - Pythonではジェネレーターとして実装されている。

スレッドの状態は(TCBなどにして)OSが管理し、コルーチンの状態はユーザーが管理する。
このため、コルーチンは軽量スレッドと言われる。
### シグナル
killなどはプロセスに対してシグナルを送信する。
シグナルとはプロセスに対してOSが通知するためのメッセージ・メカニズムである。
シグナルはプロセスに何か特定の状況が起こったことを発生したことを通知するために使用される。
割り込み、エラー、プロセスの終了などが該当する。
プロセスはシグナルを受信した際にどのようにシグナルをハンドリングするか、どのような関数を定義して応答するかを決めることができる。
たとえば、プロセスの終了、無視、停止、コアダンプなどである。

## スレッドのデータ共有
スレッドは
- ファイルディスクリプタ
- スレッド
- プロセス属性(PID, カレントDIR, etc..)
を共有する。  

これを深く理解するために複数スレッドのプロセスのメモリ配置を見てみる。
プロセスのメモリ配置は以下のようになっている。
<table>
<tr>
    <th>メモリアドレス</th>
    <th>領域名</th>
    <th>説明</th>
</tr>
<tr>
    <td>0x00000000~0x3fffffff</td>
    <td>Kernel</td>
    <td>OSがプロセスを管理するための領域, TCBやPCBなどもここ。</td>
</tr>
<tr>
    <td>0x40000000~0x7fffffff</td>
    <td>コード</td>
    <td>プログラムのコード</td>
</tr>
<tr>
    <td>0x80000000~0xbfffffff</td>
    <td>ヒープ</td>
    <td>プログラム実行中に動的に確保されるメモリ. static変数もここ。</td>
</tr>
<tr>
    <td rowspan="4">0xc0000000~0xfbffffff</td>
    <td rowspan="4">スタック</td>
    <td>0xc00000~0xc0ffffはスレッド1用</td>
</tr>
<tr>
    <td>0xc10000~0xc1ffffはスレッド2用</td>
</tr>
<tr>
    <td>0xc20000~0xc2ffffはスレッド2用</td>
</tr>
<tr>
    <td>0xc30000~0xfbffffffは新しいスレッド用</td>
</tr>
<tr>
    <td>0xfc000000~0xffffffff</td>
    <td>IO</td>
    <td>ペリフェラルIO(メモリマップドIO)レジスタ</td>
</tr>
</table>

ここからすぐにわかることだが、スレッドは他のスレッドのスタック領域に(危ないが)アクセスできるし、IO領域にもアクセスできる。
もちろんスレッド毎に異なる値を持つ変数にアクセスすることができる。スレッド毎に異なる値をスレッドローカルな変数と呼ぶ。

なお、通常は共通のデータはヒープ領域に配置することになる。
これいがいもマナーが悪いがグローバル変数を使用する場合もある。

次はグローバル変数を使用する例である。
``` c title="global.c"
#include <pthread.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

int varA; // GLOBAL variable

void *ThreadFunc(void *arg){
  int n = (int)arg;
  int varB;

  varB = 4*n;
  printf("ThreadFunc-%d-1: var-A=%d, varB=%d\n", n, varA, varB);
  varA = 5*n;
  printf("ThreadFunc-%d-2: var-A=%d, varB=%d\n", n, varA, varB);
  sleep(2);
  printf("ThreadFunc-%d-3: var-A=%d, varB=%d\n", n, varA, varB);
  varB = 6*n;
  printf("ThreadFunc-%d-4: var-A=%d, varB=%d\n", n, varA, varB);

  return NULL;
}

int main(void){
  pthread_t thread1, thread2;
  int varB;

  varA = 1; varB = 2;
  printf("main-1: varA=%d, varB=%d\n", varA, varB);
  pthread_create(&thread1, NULL, ThreadFunc, (void *)1);

  sleep(1);

  varB = 3;
  printf("main-2: varA=%d, varB=%d\n", varA, varB);
  pthread_create(&thread2, NULL, ThreadFunc, (void *)2);

  pthread_join(thread1, NULL);
  pthread_join(thread2, NULL);
  printf("main-3: varA=%d, varB=%d\n", varA, varB);

  return 0;
}
```
次はヒープ領域に入れてグローバルで渡す例である。
``` c title="heap.c"
#include <pthread.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

char *varA;
#define STRINGSIZE 32

void *ThreadFunc(void *arg){
  int n = (int)arg;

  snprintf(varA, STRINGSIZE, "Hello I'm No.%d", n);
  printf("Thread-%d: let varA=%s \n", n, varA);
  sleep(2);
  printf("Thread-%d: After 2 secs. let varA=%s \n", n, varA);

  return NULL;
}

int main(void){
  pthread_t thread1, thread2;
  int varB;

  varA = (char *)malloc(STRINGSIZE);
  strcpy(varA, "Good morning");
  printf("main-1: varA=%s \n", varA);
  pthread_create(&thread1, NULL, ThreadFunc, (void *)1);

  sleep(1);
  printf("main-2: varA=%s \n", varA);
  pthread_create(&thread2, NULL, ThreadFunc, (void *)2);

  pthread_join(thread1, NULL);
  pthread_join(thread2, NULL);
  printf("main-3: varA=%s \n", varA);

  return 0;
}
```

次はデータをポインタとして渡す方法である。
``` c title="pointer.c"
#include <pthread.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

typedef struct {
    int id;
    char *message;
} thread_data;

void *ThreadFunc(void *arg) {
    thread_data *data = (thread_data *)arg;
    // データを使用
    printf("ThreadFunc: data %d\n", data->id);
    data->id += 3;
}

int main() {
    pthread_t thread;
    thread_data data = {1, "Hello"};
    pthread_create(&thread, NULL, ThreadFunc, (void *)&data);
    sleep(3);
    printf("main: data %d\n", data.id);
    pthread_join(thread, NULL);
    return 0;
}
```


