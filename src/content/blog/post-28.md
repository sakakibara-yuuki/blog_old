---
title: "/usr/local/bin vs ~/.local/bin"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
image:
    url: "https://docs.astro.build/assets/rays.webp"
    alt: "Astroの光線のサムネイル。"
pubDate: 2024-03-06
tags: ["astro", "公開学習", "後退", "コミュニティ"]
---

## /usr/local/bin vs ~/.local/bin
`/usr/local/bin` はそのlinuxを使用している(rootに限らず)`usr`が共通で使用できるlocalな(systemではない)プログラムです。
`pacman -S`などのパッケージマネージャーでインストールしたプログラムは通常ここに保存されます。
もちろん格納されている(すべき)なのはバイナリです。

その他の紛らわしいディレクトリとして`/bin`,`/sbin`, `/usr/bin`, `/usr/sbin`, `/usr/local`, ...などがある。
基本的に`/usr`直下でないものはrootユーザーがアクセスする権限を持つ。システムを維持するために必要なコマンドやプログラムが格納される。linuxをインストールした直後に際に展開される。  
`/usr`直下のものはrootユーザーに限らず一般の`usr`が使用できる。
