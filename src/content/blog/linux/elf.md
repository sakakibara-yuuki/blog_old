---
title: "ELF(Executable and Linkable Format)"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: '/linux/elf.png'
pubDate: 2024-06-03
tags: ["linux", "elf"]
---


## ELF(Executable and Linkable Format)
ELFはExecutable and Linking Formatと呼ばれるオブジェクトファイルのフォーマットである。

オブジェクトファイルとはアセンブラとリンクエディタによって作成され、プロセッサ上で直接実行することを目的としたプログラムのバイナリ表現である。

オブジェクトファイルには3つのタイプがある。

- Relocatable file: 他のオブジェクトファイルとリンクすることで実行可能なファイル、または、Shared object fileを作成するのに適したコードとデータが格納されている。
- Executable file: 実行に適したプログラムが格納されている。
- Shared object file: リンクに適したようにコードとデータが格納される。

Shared object fileはまず、リンクエディターが他のRelocatable fileやShared object fileと一緒に処理し、別のobject fileを生成する。

次に、Dynamic LinkerがExecutable fileやShared objectと組み合わせてプロセスイメージを実行する。

### File Format
オブジェクトファイルはプログラムのリンク(ビルド)とプログラムの実行に関わる。
"リンク"、"実行"の2つの異なるニーズを満たすためにオブジェクトファイルは2つのファイルフォーマット(Linking ViewとExecution View)を持つ。

どちらもELF header, Program Header Table, Section Header Tableの3つを持つ。

ELFヘッダーはファイルの構成を記述する。
Sectionは命令、データ、シンボルテーブル、再配置情報など、Linking Viewのためのオブジェクトファイルの大部分を保持する。

Program Header Tableはシステムにプロセスイメージの作成方法を指示する。  
プロセスイメージの構築(プログラムの実行)に使われるファイルにはProgram Header Tableが必要である。  
Section Header TableはSection Headerに関する情報が格納されている。
各SectionにはSection名、Sectionサイズなどに関する情報が含まれている。
Link時に使用されるファイルにはSection Header Tableが必要である。


| Linking View |
|---|
| ELF Header            |
| Program Header Table optional       |
| Section Header        |
| Section 1             |
| Section 2             |
| ...                   |
| Section n             |
| ...                   |
| Section Header Table  |


| Execution View                |
|---|
| ELF Header                    |
| Program Header Table          |
| Segment 1                     |
| Segment 2                     |
| ...                           |
| Section Header Table optional |

