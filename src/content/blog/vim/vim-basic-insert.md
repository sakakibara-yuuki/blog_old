---
title: "Vimの基本: インサートモード"
author: "sakakibara"
description: "vimの使い方"
pubDate: 2024-03-04
heroImage: '/vim/vim-basic-insert.webp'
tags: ["vim"]
---

## Contents
## インサートモード
白状しよう。ノーマルモードが一番大事だ。
故に、インサートモードの機能的について言及することは少ない。

### インサートモードへ移行
インサートモードへ移行するには基本的に`i`を押すが、他にもいくつかの方法がある。
|   command   |               description              |
|:-----------:|:--------------------------------------:|
|     `i`     |       カーソルの位置にインサート       |
|     `I`     |          行の先頭にインサート          |
|     `a`     |     カーソルの次の位置にインサート     |
|     `A`     |          行の末尾にインサート          |
|     `o`     |           次の行にインサート           |
|     `O`     |           前の行にインサート           |
|     `s`     | カーソルの位置の文字を削除しインサート |
|     `S`     |          行を削除しインサート          |
| `c{motion}` | {motion}のテキストを削除してインサート |
|     `C`     | カーソルから行末まで削除してインサート |

インサートモードからノーマルモードへ移行するには`ESC`や`Ctrl+[`を押す。

### レジスタの利用
インサートモード中にコピーした文字をペーストするためにいったんノーマルモードに移行するのは面倒だ。
実はノーマルモードに移行せずにレジスタを利用することができる。

インサートモード中で`Ctrl+r`を押せばよいのだ。

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/UW_UNqy0qn4?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>

この動画では`Ctrl+r "`を押すことで無名レジスタの内容(`yiw`でコピーした単語)がペーストされている。

インサートモード中では`Ctrl+r{register}`を押すと、指定したレジスタの文字が入力される。
いちいちノーマルモードにもどっているならそれはあまり効率的ではない。これからは`Ctrl+r`を使おう。

また、意外と便利なのが`Express register`だ。
割り算は整数で閉じているが、その他の加減乗除については浮動小数点数で閉じている。

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/YsvHc3mjRcM?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/MuSanpE02BU?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>


### 抜刀術
以下はインサートモードの奥義である。

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/85-S3Y2NcaE?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>


<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/EU6fFJV-r5I?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>


<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/1Hs0abw6pxI?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>

`Ctrl+o`を押すことで、インサートモードを一瞬置き去りにし、ノーマルモードのコマンドを実行し、再びインサートモードに戻ることができる。

ただし、一振りだけだ。  
この一瞬の状態を **ノーマルインサートモード** と呼ぶ。  
通常、ここには{motion}か`d`や`y`, `p`などのコマンドを入力する。

使いこなすには、インサートモードよりも、むしろノーマルモードに熟練している必要がある。
