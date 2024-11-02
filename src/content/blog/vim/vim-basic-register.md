---
title: "Vimの基本: ノーマルモード(レジスタ編)"
author: "sakakibara"
description: "vimの使い方"
pubDate: 2024-03-04
heroImage: '/vim/vim-basic-register.webp'
tags: ["vim"]
---

## Contents
## コピーが思うようにいかない
vimを使用している中で混乱しがちな機能がコピー・ペーストだ。  
主に、ペーストする際にコピーした内容が思っていたものと違うことがある。
その原因の一つがレジスタの概念を理解していないことが挙げられる。

例えば、以下の`function`内の`xxx`を`arg`に変更したいとする。

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/A9xrvFQwniQ?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>


`yiw`で`arg`をコピーした後に`diw`で単語を削除し、`sift-p`でペーストすると`arg`ではなく`xxx`がペーストされてしまう。

言ってしまえば **`d` は削除というよりカット**の役割をしているのだ。

### レジスタの種類
**レジスタ**とはテキストを保持するコンテナだ。  
`x, s, d{motion}, c{motion}, y{motion}`はレジスタを設定するためのコマンドと言える。  
例えば`d{motion}`は`{motion}`で指定したテキストをレジスタに格納し、対象のテキストを削除する。  
もはや削除の機能などおまけのようなものだ。  
そのうちよく使われるレジスタは主に4つだ。

- 無名ジレスタ
- ヤンクレジスタ
- 名前付きレジスタ
- ブラックホールレジスタ
- その他のレジスタ

問題なのはどの`y`や`d`がどのレジスタに格納され、`p`がどのレジスタからペーストするかだ。

レジスタは`"a`のように`"{register}`で指定する。
また、レジスタは`:registers`または`:reg`で確認できる。

#### 無名レジスタ("")
無名レジスタは`"`で表される。

デフォルトでは`x, s, d{motion}, c{motion}, y{motion}`コマンドは無名レジスタに格納される。

`p`でペーストすると無名レジスタがペーストされる。  
`p`は`""p`と同じである。  

これが上記の問題の原因だ。  
つまり、`yiw`で`arg`を無名レジスタに格納し、  
`diw`で`xxx`を無名レジスタに格納して`arg`が上書きされる。

無名レジスタは上書きが頻発するので、文字通りの"レジスタ"としての役割を果たすことは少ない。

詳しくは[:h quote_quote]  

#### ヤンクレジスタ("0)
ヤンクレジスは`"0`で表される。

`y{motion}`でコピーするとその内容はヤンクレジスタに格納される。  

`"0p`でペーストするとヤンクレジスタに格納された内容がペーストされる。

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/W-QqFmK39Hc?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>

詳しくは[:h quote0]

#### 名前付きレジスタ("[a-zA-Z]))
ヤンクレジスは`[a-zA-Z]`で表される。  
ここでは`"r`としよう。

`"r`は例えば`"ryiw`で設定できる。
`"r`の内容は`"rp`でペーストできる。

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/2Jt4c4x6QE8?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>

正直ヤンクレジスタよりもだいぶ使い勝手がいい。
詳しくは[:h quote_alpha]

#### ブラックホールレジスタ("_)
ブラックホールレジスタは`"_`で表される。

`"_d{motion}`で削除すると、削除した内容はブラックホールレジスタに格納される。
というよりゴミ箱に格納してるようなものだ。"/dev/null"のような存在だ。

詳しくは[:h quote_]

#### その他のレジスタ("[%#.:/])

| command | description        |
| :---:   | :-----------:      |
| "%      | 現在のファイル名   |
| "#      | 代替のファイル名   |
| ".      | 直前の削除や挿入   |
| ":      | 直前のExコマンド   |
| "/      | 直前の検索パターン |


<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/ASV0jrxN3s8?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>

詳しくは[:h registers]

### 入れ替え操作テクニック
ちょっとした入れ替えテクニックを紹介する。

| command |                description               |
|:-------:|:----------------------------------------:|
|    xp   | カーソル位置の文字と次の文字を入れ替える |
|   ddp   |   カーソル位置の行と次の行を入れ替える   |

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/iwOgmf1qpEM?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>

<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/4L9BbagSrKQ?autoplay=1" frameborder="0">Sorry, your browser doesn't support embedded videos.</iframe>

### その他のレジスタ
ここでは紹介しなかったが、実際にはレジスタは10種類ある。
大きく分けてレジスタには10種類ある。

|                        name                        |       register       |
|:--------------------------------------------------:|:--------------------:|
|           無名レジスタ(unnamed register)           |          ""          |
|         数字レジスタ(10 numbered register)         |       "0 to "9       |
|         削除レジスタ(small delete register)        |          "-          |
|         名前付きレジスタ(26 named register)        | "a to "z or "A to "Z |
|       read-onlyレジスタ(3 read-only register)      |      ":, "., "%      |
|   代替バッファレジスタ(alternate buffer register)  |          "#          |
|           式レジスタ(expression register)          |          "=          |
|          選択レジスタ(selection register)          |       "* and "+      |
|     ブラックホールレジスタ(black hole register)    |          "_          |
| 検索パターンレジスタ(last search pattern register) |          "/          |

### 選択範囲を置換
選択範囲を置換する方法を紹介する。
選択範囲を`yaw`で無名レジスタ'"'に格納し,
":"でコマンドラインモードに入る.
`:%s/<C-r>"/some/g`で選択範囲を置換する。
