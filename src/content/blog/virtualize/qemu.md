---
title: "仮想化: QEMU x KVM = Arch on Arch"
author: "sakakibara"
description: ""
pubDate: 2024-03-08
heroImage: "/virtualize/qemu.webp"
tags: ["仮想化", "qemu", "kvm", "arch linux", "linux"]
---

## 仮想化
仮想化技術とは様々な計算リソース(cpuやメモリ)を抽象化させることで拡張性や柔軟性を向上させることを目的とした技術です。

CPUやメモリなどの計算資源を抽象化するためにハイパーバイザーと呼ばれるソフトウェア・ファームウェアが利用されることがあり余す。
通常、ハードウェアの上にOSがあり、OSの上にミドルウェアがあり、ミドルウェアの上にアプリケーションが動作しています。

しかし、ハイパーバイザーはCPUやメモリなどの計算資源を抽象化し、仮想マシンと呼ばれるハードウェアのエミュレータを作成し、起動させます。

また、仮想マシン上でOSを動作させることができ、これにより単一のハードウェア上で複数の異なるOSを動作させることが可能となります。

## ハイパーバイザーのタイプ
さて、上のようにハイパーバイザーを導入しましたが、ハイパーバイザーには2種類のタイプがあります。

1. タイプ1のハイパーバイザーはハードウェア上で直接動作するソフトウェアです。  
1. タイプ2のハイパーバイザーはホストOS上でするソフトウェアです。  

直感的にわかるとおもいますが、タイプ1のほうが効率的に動作します。また、構成もシンプルであり、セキュリティリスクも低く、安定的に動作し、拡張も容易です。  
タイプ2のハイパーバイザーにはOracle VirtualBox, VMWare Workstationなどが挙げられます。

## 完全仮想化
ハイバーバイザー上にハードウェアを再現する際に、より効率的で完全なハードウェアシミュレーションを再現する技術を完全仮想化(full virtualization)と言います。

タイプ1であれタイプ2であれ、ハイパーバイザーはその上で仮想マシンの作成・管理を行います。ですが、当たり前ですが、ハイパーバイザー上でハードウェアをエミュレーションするのではなく、実際のハードウェアの機能を用いたほうが効率的に動作します。

完全仮想化を実現する手段の一つとしてHAV(hardware-assited virtualization)があります。これは実際のハードウェアを利用して完全仮想化を達成しようとする方法です。

### KVM
KVMとはLinuxカーネルに組み込まれているタイプ1のハイパーバイザー(機能)です。
ハードウェア上の計算資源を直接仮想マシンに提供できるという点でタイプ1のハイパーバイザーの機能を担いますが、動作にはホストOSが必要です。

KVMの役割はLinuxカーネルと通して、CPUとメモリの計算資源を仮想化し、仮想マシンが実際のハードウェにアクセスすることを可能にします。
つまり、仮想マシンが完全仮想化を達成するための仮想化を提供します。
KVM自体はハードウェアのエミュレーション自体を行わないためにKVM単体で仮想マシンを作成し、起動することはできません。

KVMを利用するためにはハードウェア自体が仮想化をサポートしているかを確認する必要があります。
```zsh title='lscpu'
LC_ALL=C lscpu | grep Virtualization
```
これでプロセッサが仮想化をサポートしていれば仮想化をすることができます。

次にカーネルモジュールが使用できるかを確認します。なければインストールしてください。
```zsh title='CONFIG_KVM'
zgrep CONFIG_KVM /proc/config.gz
```

### 仮想マシン QEMU
QEMUはハードウェアエミュレータです。特にKVMから提供される仮想化されたCPUやメモリを利用することで完全仮想化を実現した仮想マシンを作成することができます。
```zsh title='qemu'
sudo pacman -S qemu-full
```

QEMUにはいくつか変種があります。
- フルシステムエミュレーション  
プロセッサと周辺機器を含むすべてのシステムをエミュレートする。
- ユーザーモードエミュレーション  
異なるアーキテクチャでコンパイルされた実行ファイルが実行可能。
- 動的リンク  
リンク先を外部に持つので実行ファイル自体は軽くなる。
- 静的リンク
埋め込むので重くなるが、リンク先が変更しても平気　

| x          | full system emulation      | user mode emulation   |
|:-----------|:---------------------------|:----------------------|
| 動的リンク | qemu-system-{archtechture} | qemu-x86_64, qemu-arm |
| 静的リンク | non                        | qemu-user-static      |

どれを利用するかはエミュレートしたいシステムがどのアーキテクチャを採用しているか、実行サイズを小さくしたいかなどの観点から決定してください。

Arch linuxでは`qemu-desktop`(`qemu-system-x86_64`)が利用できるのでこれを利用します。(もしくは`qemu-full`に入っています。)
```zsh title='qemu-desktop'
sudo pacman -S qemu-full
or
sudo pacman -S qemu-desktop
```
仮想マシンのGUI管理ソフトであるlibvirtをインストールします。
(いらないかも)
```zsh title='libvirt'
sudo pacman -S libvirt
```

エミュレートするハードディスクの内容を保存するためにハードディスクイメージを作成します。
(Btfsを使用している場合はcopy on writeを無効にしてください。自分はext4なのでこのまま。)

```zsh title='hard_disk_img'
qemu-img create -f raw hard_disk_img 4G
```

OSをインストールします。
なお、適当な`vm`というファイルを作成し、その中で作業している。
```zsh title='~/vm'
➜  vm > file archlinux-2024.03.01-x86_64.iso
archlinux-2024.03.01-x86_64.iso: ISO 9660 CD-ROM filesystem data (DOS/MBR boot sector) 'ARCH_202403' (bootable)
➜  vm > fdisk -lu archlinux-2024.03.01-x86_64.iso
Disk archlinux-2024.03.01-x86_64.iso: 942.32 MiB, 988098560 bytes, 1929880 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x8cc6f18c

Device                           Boot   Start     End Sectors  Size Id Type
archlinux-2024.03.01-x86_64.iso1 *         64 1898495 1898432  927M  0 Empty
archlinux-2024.03.01-x86_64.iso2      1898496 1929215   30720   15M ef EFI (FAT-12/16/32)

```
```zsh title='~/vm'
qemu-system-x86_64 -cdrom archlinux_2024.iso -accel kvm -boot order=d -drive file=hard_disk_img,format=raw
```

ちなみにこのあと、自分の環境ではBIOSの画面からbootできずに一歩も動か得なくなってしまった。[試行錯誤](#try-and-error)

トラブルシューティングを見てみると
[仮想マシンがArchISOで起動しない](https://wiki.archlinux.jp/index.php/QEMU#.E4.BB.AE.E6.83.B3.E3.83.9E.E3.82.B7.E3.83.B3.E3.81.8C_Arch_ISO_.E3.81.A7.E8.B5.B7.E5.8B.95.E3.81.97.E3.81.AA.E3.81.84)
がある。
これによると、`-m 1024`というオプションをつけて、RAMを増やしてやると起動するらしい。
ただし、これが必要なのはインストールメディアのサイズが原因らしく、インストール後は容量を小さくしても問題ないらしい。
というわけで、
```zsh title='~/vm'
qemu-system-x86_64 -cdrom archlinux_2024.iso -accel kvm -m 1024 -boot order=d -drive file=hard_disk_img,format=raw
```
これでarch linuxのインストールメディアが起動できた。

### Arch linuxのインストール
arch linuxをインストールする。

### try-and-error
以下は試したがうまく行かなかった。
これはおそらくarch linuxのisoがUEFIブートをサポートしているからだろう。

QEMUはデフォルトでseabiosを使用しているためにUEFIを使用するには少し手続きが必要となる。
仮想環境におけるUEFI)を使用するためにはOVMF(Open Virtual Machine Fairmware)が必要となりこれは`edk2-ovmf`パッケージをインストールすることにで利用できる。

いくつか方法があるが、ここではその一つを紹介する。
まず、`/usr/share/edk2/x64/OVMF.4m.fd`をコピーしてくる。
```zsh title='~/vm'
➜  vm > cp /usr/share/edk2/x64/OVMF.4m.fd .
```
そこで以下のコマンドを試します。

```zsh title='~/vm'
➜  vm > qemu-system-x86_64 -cdrom archlinux-2024.03.01-x86_64.iso -accel kvm -boot order=d -drive file=hard_disk_img,format=raw -drive if=pflash,format=raw,readonly=on,file=/usr/share/edk2/x64/OVMF_CODE.4m.fd \
-drive if=pflash,format=raw,file=./OVMF.4m.fd
```

すると
`Gesture has not initialized the display (yet)`
と表示されます。

文字通りディスプレイが初期化されていないことによるエラーと推測します。

### 余談
いろいろエラー解消している間に[こんなもの](https://github.com/uchan-nos/os-from-zero/issues/115)を見つけた。機械語見てエラーの原因突き止めてるのすさまじいよなホント。
`archiso`使ってみたい

### reference
- [QEMU](https://wiki.archlinux.jp/index.php/QEMU#.E4.BB.AE.E6.83.B3.E5.8C.96.E3.82.B7.E3.82.B9.E3.83.86.E3.83.A0.E3.82.92.E5.AE.9F.E8.A1.8C.E3.81.99.E3.82.8B)
- [kvm](https://wiki.archlinux.jp/index.php/KVM)
- [libvirt](https://wiki.archlinux.jp/index.php/Libvirt)
- [archiso](https://wiki.archlinux.jp/index.php/Archiso)
- [カーネルモジュール](https://wiki.archlinux.jp/index.php/%E3%82%AB%E3%83%BC%E3%83%8D%E3%83%AB%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB)
- [QEMUでRAWディスクイメージのブート](https://unix-stackexchange-com.translate.goog/questions/276480/booting-a-raw-disk-image-in-qemu?_x_tr_sl=en&_x_tr_tl=ja&_x_tr_hl=ja&_x_tr_pto=sc)
- [rawを明示的に指定してください](https://stackoverflow-com.translate.goog/questions/47235461/how-to-resolve-specify-the-raw-format-explicitly-to-remove-the-restrictions?_x_tr_sl=en&_x_tr_tl=ja&_x_tr_hl=ja&_x_tr_pto=sc)

