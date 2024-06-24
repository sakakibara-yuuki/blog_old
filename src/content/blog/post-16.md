---
title: "Arch linux手術室"
author: "sakakibara"
description: "Arch linux小説です。"
image:
    url: "https://cdn.icon-icons.com/icons2/2699/PNG/512/archlinux_logo_icon_167835.png"
    alt: "Arch linux logo"
pubDate: 2024-03-04
tags: ["astro", "公開学習", "コミュニティ"]
---

# 手術中
心臓が汗をかく。  
部屋は暗いが眼の前のディスプレイがやたら眩しい。  

"練習通りにいってくれ。"

汚い字で書かれたメモを見ながら、慎重にパーティションを切り分ける。  

1つのタイプミスが命取りになる。  
カーソルの点滅に心臓の鼓動が追いつく。  
呼吸を殺し、指先に意識を移し、暗闇の中で輝く文字だけを見つめる。  
Enterに小指をかけた直前、あの日々を思い出した。

### UEFI or BIOS
```bash title='UEFI or BIOS'
cat /sys/firmware/efi/fw_platform_size
```

linuxがどのように起動するか。  
電源を入れると、マザーボードのROMに書き込まれた起動ファームウェアが実行される。  
起動ファームウェアは大きく分けて2つ。  
BIOSとUEIFだ。

端的に言ってしまえばBIOSの方が古くてUEFIの方が新しい。  
なので最近のPCはUEFIを採用している。

自分が使用する起動ファームウェアがどちらを採用しているかによって今後のインストール手順が大きく変わる。

また、linuxのインストールはインストールメディアとインストール先のブロックデバイスが必要になる。

このコマンドを含め、明示されるまでは暗黙のうちにインストールメディアのlinuxのコマンドを入力していることに注意する。

### Can you use your network ?
```bash title='can you use network?'
ip link
ping archlinux.jp
```

このあとの工程でインストールメディアから様々なパッケージをダウンロードする。
そのため、インターネットに接続されていることは必須となる。

`ip link` コマンドはlinuxが認識しているネットワークデバイスを表示するコマンドである。
注意することとして、これにeth0のような表示あったからと言って、それはインターネットに接続している確認にはならない。
あくまで接続されているデバイスを表示するだけなのだ。

`ping archlinux.jp`コマンドはarchlinux.jpへデータを送信し、応答を表示するコマンドだ。

`ping`コマンドはICMP(Internet Control Message Protocol: インターネット制御通知プロトコル)というプロトコルのECHO_REQUESTを使用する。これはネットワークの通知のテストに使われる。

### timedate check
```bash title='timedatectl'
timedatectl status
```
時間をチェックする。

### separete partition
```bash title='lsblk'
lsblk
```

```bash title='gdisk'
gdisk /dev/sda
```

```bash title='gdisk'
> o => Y
> n => Enter => Enter => +1G => ef00
> n => Enter => Enter => +4G => 8200
> n => Enter => Enter => Enter => 8e00
> w
```

### add LVM
#### 物理ボリューム: Physical Volume
```bash title='pvcreate'
pvcreate /dev/sda3
```
```bash title='pvs or pvdisplay'
pvs
pvdisplay
```
#### ボリュームグループ: Volume Group
```bash title='vgcreate'
vgcreate ArchVolGroup /dev/sda3
```
```bash title='vgs, vgdisplay'
vgs
vgdisplay
```
#### 論理ボリューム: Logical Volume
```bash title='lvcreate'
lvcreate -L 100G ArchVolGroup -n lvol
lvcreate -l 100%FREE ArchVolGroup -n lvolhome
```

```bash title='lvdisplay, lvremove, lvresize ...'
lvdisplay
lvremove
lvresize
```

### add file system
```bash title='mkfs'
mkfs.fat -F 32 /dev/sda1
mkswap /dev/sda2
mk.ext4 /dev/ArchVolGroup/lvol
mk.ext4 /dev/ArchVolGroup/lvolhome
```
```bash title='lsblk'
lsblk --fs
```

### mount block device
```bash title='mount'
mount /dev/ArchVolGroup/lvol /mnt
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot
mkdir /mnt/home
mount /dev/ArchVolGroup/lvolhome /mnt/home
swapon /dev/sda2
```

### chose pacman mirrorlist
```bash title='mount'
reflector --sort rate --country jp --latest 10 --save /etc/pacman.d/mirrorlist
```

### download pacages
```bash title='mount'
pacstrap -K /mnt base linux linux-firmware vim sudo man-db man-pages lvm2
```

### fstab
```bash title='mount'
genfstab -U /mnt >> /mnt/etc/fstab
```

### setting XDG
```bash title='zsh'
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"
```

### change root
```bash title='mount'
arch-chroot /mnt
```

### setting locale
```bash title='mount'
ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
```

```bash title='vim /etc/locale.gen'
en_US.UTF-8 //unmount
jp_JP.UTF-8 //unmount
```

```bash title='locale-gen'
locale-gen
```

```bash title='vim /etc/locale.conf'
LANG=en_US.UTF-8
```
```bash title='vim /etc/hostname'
organon
```

### setting network
```bash title='systemd-networkd'
systemctl enable systemd-networkd systemd-resolved
```
```zsh title='vim /etc/systemd/network/ether.network'
[Match]
Name = enp03
[Network]
DHCP = yes
```

### setting for LVM
```bash title='vim /etc/mkinitcpio.conf'
HOOKS=(base ... block lvm2 filesystem)
```

### initcpio
```bash title='mkinitcpio'
mkinitcpio -P
```

### user add

### setting grub and microcode
```bash title='grub'
pacman -S amd-ucode grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
```

```bash title='grub'
mkdir /boot/EFI/boot
cp /boot/EFI/GRUB/grubx64.efi /boot/EFI/boot/bootx64.efi
```

```bash title='vim /etc/default/grub'
GRUB_CMDLINE_LINUX_DEFAULT="root=/dev/ArchVolGroup/lvol"
GRUB_PRELOAD_MODULES="... lvm"
```

```bash title='vim /etc/default/grub'
grub-mkconfig -o /boot/grub/grub.cfg
```

### Arch linux
```bash title='reboot'
exit
umount -R /mnt
reboot
```
