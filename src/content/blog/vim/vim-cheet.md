---
title: "Vimの基本: cheetsheet"
author: "sakakibara"
description: "vimの使い方"
pubDate: 2024-03-04
heroImage: '/vim/vim-cheet.webp'
tags: ["vim"]
---

## Contents
## vim-cheetsheet

### motion
| command | description             |
| :---:   | :----                   |
| h       | ←に1文字                |
| j       | ↓に1文字                |
| k       | ↑に1文字                |
| l       | →に1文字                |
| 0       | 行の先頭(Oではなくゼロ) |
| ^       | (空白を除く)行の先頭    |
| $       | 行の末尾                |
#### 論理行と表示行
| command | description                |
| :---:   | :----                      |
| gh      | ←に1行(表示行)             |
| gj      | ↓に1行(表示行)             |
| gk      | ↑に1行(表示行)             |
| gl      | ↑に1行(表示行)             |
| g0      | 先頭(表示行)               |
| g^      | (空白を除く)先頭(表示行)   |
| g$      | 末尾(表示行)               |

#### 単語を単位とした移動{motion}
| command | description          |
| :---:   | :----                |
| ge      | 前の単語の語尾に移動 |
| b       | 前の単語の語頭に移動 |
| e       | 次の単語の語尾に移動 |
| w       | 次の単語の語頭に移動 |

#### 文字の検索による移動{motion}
| command | description          |
| :---:   | :----                |
| f{char} | 次の{char}に移動     |
| t{char} | 次の{char}の前に移動 |
| F{char} | 前の{char}に移動     |
| T{char} | 前の{char}の後に移動 |

#### テキストオブジェクト{motion}
| command | description          | example                                |
| :---    | :----                | :----                                  |
| daw     | 単語周辺を削除       | Alice beginning {to get} "very" tired  |
| diw     | 単語単体を削除       | Alice  beginning {to get} "very" tired |
| da}     | {}内の単語周辺を削除 | Alice was beginning  "very" tired      |
| di}     | {}内の単語単体を削除 | Alice was beginning {} "very" tired    |
| da"     | ""内の単語周辺を削除 | Alice was beginning {to get} tired     |
| di"     | ""内の単語単体を削除 | Alice was beginning {to get} "" tired  |

#### 削除
| command   | description                |
| :---      | :----                      |
| x         | カーソルの文字を削除       |
| dd        | 1行削除                    |
| d{motion} | motionで指定した範囲を削除 |


例えば、
| command | description            |
| :---    | :----                  |
| d0      | 行頭まで削除           |
| d$      | 行末まで削除           |
| dge     | 前の単語の語尾まで削除 |
| db      | 前の単語の語頭まで削除 |
| de      | 次の単語の語尾まで削除 |
| dw      | 次の単語の語頭まで削除 |
| daw     | 単語周辺の範囲を削除   |
| diw     | 単語を削除             |

#### コピー
| command   | description                  |
| :---      | :----                        |
| yy        | 1行コピー                    |
| y{motion} | motionで指定した範囲をコピー |

#### ペースト
| command | description                    |
| :---    | :----                          |
| p       | カーソルの後ろにペースト       |
| P       | カーソルの前にペースト(大文字) |

#### その他のレジスタ("[%#.:/])
| command | description        |
| :---:   | :-----------:      |
| "%      | 現在のファイル名   |
| "#      | 代替のファイル名   |
| ".      | 直前の削除や挿入   |
| ":      | 直前のExコマンド   |
| "/      | 直前の検索パターン |

### 入れ替え操作テクニック
| command |                description               |
|:-------:|:----------------------------------------:|
|    xp   | カーソル位置の文字と次の文字を入れ替える |
|   ddp   |   カーソル位置の行と次の行を入れ替える   |

### レジスタ
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

### その他
| command | description          |
| :---:   | :----                |
| `<shift-k>`       | その単語のmanを引く                 |
