---
title: "シェル芸"
author: "sakakibara"
description: "シェル芸"
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-03-04
tags: ["linux", "コマンド"]
---


# シェル芸
シェル芸でよく使うコマンドは
- grep
- sed
- awk
- xargs
- (uniq)
- (sort)

#### sed
```zsh
sed -E 's/置換前/置換後/'
sed -E 's/置換前/置換後/g'
sed -E 's/置換前/&&&/'
sed -E 's/()()/\2\1/'
```
sedは文字を置換するコマンドである。
例えば'Red Green Blue Red'を変換する。
```zsh
❯ echo 'Red Green Blue Red' | sed 's/Red/Green/'
Green Green Blue Red
❯ echo 'Red Green Blue Red' | sed 's/Red/Green/g'
Green Green Blue Green
❯ echo 'Red Green Blue Red' | sed 's/Red/&&&/'
RedRedRed Green Blue Red
❯ echo 'Red Green Blue Red' | sed -E 's/(Red) (Green)/\2\1/'
GreenRed Blue Red
```

最後の例について説明する。  
`-E`は拡張正規表現を使うオプションである。
これが無いと、`sed 's/\(Red\) \(Green\)/\2\1/'`のように`\`を使って括弧をエスケープする必要がある。  
最後の例(\2や\1などを用いた表現)は**後方参照** と呼ばれる機能である。
`\1`は1番目の括弧で括られた文字列を指し、`\2`は2番目の括弧で括られた文字列を指す。  
ただし、括弧と括弧の文字は連続していなければならない。  
たとえば、`sed -E 's/(Red)(Blue)/\2\1/'`や、`sed -E s/(Red)(Green)/\2\1/`はエラーになったり、期待した結果を得ることができない。スペースが入っていないため、マッチされないからである。

後方参照という名前は、正規表現の中で、すでにマッチした文字列を処理の後方で再び参照することに由来する。

また、上の例では全て`s/置換前/置換後/`という形式だったが、`-n /置換前/置換後/p`とすることで、置換された行だけを表示することができる。  
`-n`をはずすと、置換前と置換後の各行が表示される。

#### shebang
shell + bang(エクスクラメーションマーク)の略だと思われるこの文字列は、スクリプトの先頭に書くことで、そのスクリプトをどのプログラムで実行するかを指定する。必ず1行目に各必要がある。  
```zsh
#!/bin/zsh
```
bashやzshなどのシェルスクリプトならいいが、pythonなどのスクリプトではアーキテクチャ依存となるため、書かないほうがいいのでは？という(自分の)意見もある。

#### xargs
xargsはコマンドに引数を渡して実行するコマンドである。
```zsh
ls | xargs command
ls | xargs -n3
ls | xargs -I@ mv @ dir_@
```

xargsの後ろに何のコマンドも指定しないとechoがデフォルトで実行される。

-n\{number\}により、\{number\}個ずつの引数を渡すことができる。
-I\{string\}により、\{string\}を標準入力から読み込まれる名前で最初の引数を置換する。
ここでは適当に@を指定しているが、何でもいい。
