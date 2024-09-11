---
title: "blogを書く際に使う便利ツール"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: "https://docs.astro.build/assets/rays.webp"
pubDate: 2024-03-05
tags: ["astro", "tool", "blog"]
---

# ブログを作成する際に便利なツール

## Contents

## grim

[grim](https://git.sr.ht/~emersion/grim)は言わずとしれたwaylandのスクリーンショットツールです。
私はhyprlandを使用しており、grimを`super + G`で`~/Picture`にスクリーンショットを保存するように設定しています。

```text title="~/.config/hypr/hyprland.conf"
$screenshot = grim
bind = $mainMod, G, exec, $screenshot
```

## vhs

[vhs](https://github.com/charmbracelet/vhs)はターミナルに入力されるコマンドを録画したようなgifアニメーションを作成することができるツールです。
`.tape`のsuffixのついたファイルに独自言語を記述し、`vhs`コマンドを実行することで、gifアニメーションを作成できます。
カーソルの色、速度、などを調整することができ、対話型のコマンドを表現する際に重宝します。

## showmethekey

![showmethekey](https://github.com/AlynxZhou/showmethekey)はwaylandでキーストロークをスクリーン表示するツールです。
x11ではscreenkeyというツールがありますが、waylandでは使用することが困難なため、showmethekeyを使用しています。
ただし、このツールはあまり情報源が無く、トラブルは自分で解決する必要があります。

## wlrobs-hs

[wlrobs-hs](https://aur.archlinux.org/packages/wlrobs-hg)はobs-stduioのプラグインであり、hyprland(wlroot)での画面録画を可能にします。

## Katex 可換図式

Katexでは可換図式を$\{CD\}$を用いて表現することができる。
だが、斜めの矢印がどうしても使えない。
そこで$array$環境を使う。

```latex
\begin{array}{ccc}
A & \xrightarrow{f} & B \\
\downarrow & & \downarrow \\
C & \xrightarrow{g} & D
\end{array}
```

$$
\begin{array}{ccc}
A & \xrightarrow{f} & B \\
\downarrow & \searrow^g & \downarrow \\
C & \xrightarrow{g} & D
\end{array}
$$

[可換図式](https://redgregory.notion.site/Diagrams-With-KaTeX-9166ebfa650a463dbdf67357143ebaed)
または
[quivar](https://q.uiver.app/#q=WzAsMyxbMCwwLCJBIl0sWzEsMCwiQiJdLFsxLDEsIkMiXSxbMCwxLCJmIl0sWzEsMiwiZyJdLFswLDIsImcgXFxjaXJjIGYiLDJdXQ==)を使う。
