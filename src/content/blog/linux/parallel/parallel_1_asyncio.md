---
title: "並行処理: #1 asyncio"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: '/linux/parallel/parallel_1_asyncio.png'
pubDate: 2024-05-30
tags: ["linux", "parallel", "並行処理", "asyncio"]
---

## 非同期処理と並行処理
非同期処理と並行処理は似ているが異なる概念である。

- 非同期処理:
非同期処理とはタスクが他のタスクの終了を待たずに次のタスクを進める処理のことである。

- 並行処理:
並行処理とは単一CPUで複数のタスクを交互に少しずつ進めることで、タスクが同時に進行しているように見せる処理のことである。

非同期処理は並行処理を実現する一つの手段である。

- 非同期処理であり、並行処理でない例:
ディスクからデータの読み込みを行う際、読込中に他の処理にCPUのリソースを割り当てることができるが、これは単なるリソースの有効活用であり、複数のタスクが並行して進んでいるわけではない。

- 非同期処理でなく、並行処理である例:
複数のタスクを文字通り複数のCPUで処理するとき、それは非同期処理(あるタスクが他のタスクの終了を待っているわけではない)だが、並行処理である。


### asyncio
pythonを主として記述するが、javascriptなどでも基本的に同じ

以下ではシングルCPUを想定して並行プログラミングを考える。
並行プログラミンの方法としては3つある。

- マルチスレッド
- マルチプロセス
- async(ノンブロッキング処理)

最初の2つは馴染深いと思う。  
マルチスレッドは一つのプロセス内で複数のスレッドを利用して並行処理を行う方法。  
マルチプロセスはプロセス自体を複数走らせらせる方法。  

そして、asyncは待ち状態になる処理に入ったらその間に他の処理を行う方法である。

asyncはプロセスを複数動かすわけでもなく、スレッドを分岐させているわけでもなく非同期処理を実現することができる。

pythonでは`asyncio`という標準パッケージが提供されている。

`asyncio`では待ち処理が起きる箇所に`async`をつけておくことによって、その処理で待ちがくると他の処理を優先することになる。これにより待ち時間を無駄にすることなくCPUリソースを利用することができる。

では待ち状態が終わったことをどのようにプロセスは知るのだろうか？
割り込みだろうか？

答えはポーリングである。
ポーリングとは状態が変化したかどうかを確認することをループする処理である。
非同期処理ではどのように非同期にしたい処理を扱っているかが非常に重要となる。


### 非同期処理の仕組み
非同期にしたい処理(function)の前に`async`をつけてマークする。
このように`async`がついた関数をコルーチンと呼び、非同期な処理を行うことが許される。  
コルーチンの実行時に他のコルーチンに処理を譲るために注目しているコルーチン内部に`await`をつけてマークする。
`await`を処理する段階になったら他のコルーチンに処理を譲る。

コルーチンはコルーチン毎に待ち状態に入ったか、待ち状態が終わったか、その返り値など(イベント)を管理する必要がある。

全てのコルーチンはイベントループによって管理される。
イベントループは処理すべきタスクのリストを保持し、ポーリングとコールバックをメインに利用している。
イベントループは定期的にタスクの状態をチェックし、イベントの発生を検知し、コールバック関数を呼びだして対応する。

### 具体例

``` python
import asyncio

async def main():
    print('Hello ...')
    await asyncio.sleep(1)
    print('...world!')

asyncio.run(main())
```
と
``` python
import time

def main():
    print('Hello ...')
    time.sleep(1)
    print('...world!')

main()
```
の違いはなんだろうか。
どちらも1秒待って`Hello... ...world!`と出力するがこの２つのプログラムには裏に違いがある。
まず、最初のプログラムでは`asyncio`を利用してmainをコルーチンとして処理している。
次のプログラムでは`time`を利用して非同期に処理している見慣れたコードだ。

つまり、この２つのプログラムの違いとはどちらも結果は同じで1秒待つが、その1秒の間に他のことができるかどうかである。

なお、`async`で登録したコルーチンはasyncio.run()のような形でしか使用できない。
例えば、以下のようなコードを書くとエラーがでる。

``` python
import asyncio

async def hello():
    print('Hello ...')
    await asyncio.sleep(1)
    print('...world!')

def main():
    hello()

main()
```

非同期処理を行うためにイベントループで処理が待ち状態に入ったかどうかを監視する必要があるため通常の関数呼び出しは使えないのである。
これはただの関数ではなく、コルーチンなのである。


### タスク
Taskはコルーチンのwrapperであり、コルーチンがイベントループ上でどのように実行されるかを管理する。
タスクは開始、停止、再開、終了する際の状態を保持する。
また、コルーチンが完了した場合、その結果も保持する。

taskを使用してイベントループを考えると、イベントループは処理すべきタスクのリストを保持している。

``` python
import asyncio

async def hello():
    print("Hello...")
    await asyncio.sleep(1)
    print("...world!")

async def main():
    # コルーチンをタスクとしてスケジュール
    task = asyncio.create_task(hello())

    # タスクの完了を待つ
    await task

asyncio.run(main())
```
これは
``` python
import asyncio

async def hello():
    print('Hello ...')
    await asyncio.sleep(1)
    print('...world!')

asyncio.run(hello())
```
と処理内容としては同じであるが、後者の方がシンプルである。

後者では`asyncio.run()`は内部でイベントループを作成し、コルーチンである`hello()`を実行する。

前者では`asyncio.run()`は内部でイベントループを作成し、`hello()`をtaskとして登録し、その完了を待つ。

コルーチンもtaskも同じような使われ方をしているが、コルーチンとその返り値、taskの3つはawaitablはオブジェクトと呼ばれる。

taskを使用する利点は複数のコルーチンを制御することができるということだ。そもそも複数のコルーチンを制御できなければ並行処理とは呼べない。

つまり、

``` python
import asyncio


async def wait1():
    print('Hello ...!')
    await asyncio.sleep(1)
    print('...world!')


async def wait2():
    print('Hello ...?')
    await asyncio.sleep(1)
    print('...world?')


def main():
    loop = asyncio.new_event_loop()
    loop.run_until_complete(wait1())
    loop.run_until_complete(wait2())


main()
```
は、実際には並行処理が実現されていない。  
しかし、`task`を使用すると並行処理が実現できる。

taskを使用すると
``` python
import asyncio

async def wait1():
    print('Hello ...!')
    await asyncio.sleep(1)
    print('...world!')

async def wait2():
    print('Hello ...?')
    await asyncio.sleep(1)
    print('...world?')

async def main():
    # wait1() と wait2() をタスクとして同時にスケジュールする
    task1 = asyncio.create_task(wait1())
    task2 = asyncio.create_task(wait2())

    # 両方のタスクが完了するまで待つ
    await task1
    await task2

# asyncio.run() を使って main() コルーチンを実行
asyncio.run(main())
```
このコードでは全体の実行時間は1秒になる。
このようにタスクを使用することで複数の非同期操作を管理することができる。

なお、awaitに前をつける処理は`asyncio.wait`のように非同期処理を行うために実装されている関数やメソッドに限られる。
例えば、標準的な`open()`のような関数は`await`と共に直接使用することはできない。

なお、昔、
``` python
await task1
await task2
```
と
``` python
await task2
await task1
```
は異なる処理になるものと思っていた。
しかし実際にはどちらも同じ処理になる。  
順番にtaskの処理が終わるのは理解できる。
どのtaskの処理も終わっていないのも理解できる。  
task1が終わらず、task2が終わった場合ではtask1が終わっていないためawaitで引っかかるのでその処理は結果として同時終わることになる。

