---
title: "XDGと忍者"
author: "sakakibara"
description: "XDGと忍者"
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-03-06
tags: ["XDG", "xdg-ninja", "規格"]
---


## freedesktop.org : XDG
XDGをご存知だろうか。
現在はfreedesktop.orgという名前で、
UNIX系のデスクトップ環境(GNOME, KDE, Xfce etc...)の開発フレームワーク間の差異を見えなくするために設立された団体である。
X window systemやsystemdを生み出したことでも有名だ。
freedesktop.orgは以前**X Desktop Group** と名乗っていたたためXDGという省略系がよく見られる。

この団体は自分たちが作成した規格がLinux Standard Baseなどの国際規格に取り込まれることを目指している団体だ。要チェックしておく必要がある。

この団体の策定した規格で特に目にするのは**XDG Base directory**であり、主にディレクトリレイアウトに関する内容が含まれている。具体的な仕様は[以下][#XDGの仕様]にある。  
最近ではXDGを意識したアプリケーションが増えたこともあり、XDGで規定された内容を守ることにより、インストール時などに不要な手間をかけなくて済む。

X serverとか古いよな！最近はやっぱwaylandだよな！

freedesktop.org傘下のプロジェクトにはwaylandも含まれるのでwaylandをご使用のあなたもXDGに則ったほうがメリットが多いだろう。

また、今現在、自分の環境がXDGを遵守しているのかについて、気になる方もいるだろう。
忍者に頼めば良い。
アイエー、ニンジャ ナンデ

デスクトップをインストールしたばかりのあなたには[`xdg-user-dires`](#xdg-user-dires)を渡しておこう

## xdg-ninja
[xdg-ninja](https://github.com/b3nj5m1n/xdg-ninja)というのは$HOMEに不要なファイルやディレクトリが無いかをチェックするシェルスクリプトだ。

事前にxdg-ninjaに設定されてあるファイルに出会うとそのファイルを適切な場所に移動する方法を提示してくれる。

実際に走らせると以下のような感じになる。事前に`glow`をinstallしておくことをおすすめする。
```zsh title='zsh'
➜  ~ xdg-ninja

Starting to check your $HOME.

[bash]: /home/sakakibara/.bash_logout

  Currently unsupported.

  Relevant issue: https://savannah.gnu.org/support/?108134

[bash]: /home/sakakibara/.bash_profile

  Currently unsupported.

  Relevant issue: https://savannah.gnu.org/support/?108134

[cargo]: /home/sakakibara/.cargo

  Export the following environment variables:

    export CARGO_HOME="$XDG_DATA_HOME"/cargo

[cuda]: /home/sakakibara/.nv

  Export the following environment variables:

    export CUDA_CACHE_PATH="$XDG_CACHE_HOME"/nv

[Firefox]: /home/sakakibara/.mozilla

  Currently unsupported.

  Relevant issue:
  https://bugzilla.mozilla.org/show_bug.cgi?id=259356

[git]: /home/sakakibara/.gitconfig

  XDG is supported out-of-the-box, so we can simply move the file to
  $XDG_CONFIG_HOME/git/config.

[gnupg]: /home/sakakibara/.gnupg

  Export the following environment variables:

    export GNUPGHOME="$XDG_DATA_HOME"/gnupg

  Note: from the archwiki:

  │ If you use non-default GnuPG Home directory, you will need to
  │ edit all socket files to use the values of gpgconf --list-dirs.
  │ If you set your SSH_AUTH_SOCK manually, keep in mind that
  your
  │ socket location may be different if you are using a custom
  │ GNUPGHOME

[npm]: /home/sakakibara/.npm

  You need to put the following into your npmrc:

    prefix=${XDG_DATA_HOME}/npm
    cache=${XDG_CACHE_HOME}/npm
    init-module=${XDG_CONFIG_HOME}/npm/config/npm-init.js
    tmp=${XDG_RUNTIME_DIR}/npm

  Note: the tmp option has been removed in more recent versions
  of npm, including it will generate a warning.

[nss]: /home/sakakibara/.pki

  Disclaimer: XDG is supported, but directory may be created
  again by some programs.

  XDG is supported out-of-the-box, so we can simply move directory
  to "$XDG_DATA_HOME"/pki.

  Note: some apps (chromium, for example) hardcode path to
  "$HOME"/.pki, so directory may appear again, see
  https://bugzilla.mozilla.org/show_bug.cgi?id=818686#c11.

[ohmyzsh]: /home/sakakibara/.zshrc.pre-oh-my-zsh

  If it exists, it is used when switching back to the default
  shell you had before installing Oh My Zsh. See the FAQ
  https://github.com/ohmyzsh/ohmyzsh/wiki/FAQ#how-do-i-uninstall-oh-my-
  zsh for more information.

  You can either back it up elsewhere or delete it.

[openssh]: /home/sakakibara/.ssh

  Assumed to be present by many ssh daemons and clients such as
  DropBear and OpenSSH.

[profile]: /home/sakakibara/.profile

  There are shells and window managers that don't need this file
  and won't create it, depending on your config, this file might
  be deleted or moved.

  If you do not know, please do not move this file as it could
  lead to errors.

[python]: /home/sakakibara/.python_history

  Export the following environment variables:

    export PYTHONSTARTUP="$HOME"/python/pythonrc

  Now create the file ~/python/pythonrc, and put the following
  code into it:

    def is_vanilla() -> bool:
        import sys
        return not hasattr(__builtins__, '__IPYTHON__') and
  'bpython' not in sys.argv[0]


    def setup_history():
        import os
        import atexit
        import readline
        from pathlib import Path

        if state_home := os.environ.get('XDG_STATE_HOME'):
            state_home = Path(state_home)
        else:
            state_home = Path.home() / '.local' / 'state'

        history: Path = state_home / 'python_history'

        readline.read_history_file(str(history))
        atexit.register(readline.write_history_file,
  str(history))


    if is_vanilla():
        setup_history()

  Finally, create an empty file at $XDG_STATE_HOME/python_history

  Note: This won't work if python is invoked with -i flag.

  Credit: https://github.com/b3nj5m1n/xdg-
  ninja/issues/289#issuecomment-1666024202

[rustup]: /home/sakakibara/.rustup

  Export the following environment variables:

    export RUSTUP_HOME="$XDG_DATA_HOME"/rustup

[sqlite]: /home/sakakibara/.sqlite_history

  Export the following environment variables:

    export SQLITE_HISTORY="$XDG_CACHE_HOME"/sqlite_history

[vim]: /home/sakakibara/.viminfo

  See help for .vimrc

[vim]: /home/sakakibara/.vim

  See help for .vimrc

[volta]: /home/sakakibara/.volta

  Export the following environment variables:

    export VOLTA_HOME="$XDG_DATA_HOME"/volta

[visual studio code]: /home/sakakibara/.vscode

  Currently unsupported.

  Relevant issue: https://github.com/microsoft/vscode/issues/3884

[wget]: /home/sakakibara/.wget-hsts

  Alias wget to use a custom hsts cache file location:

    alias wget=wget --hsts-file="$XDG_DATA_HOME/wget-hsts"

[zotero]: /home/sakakibara/.zotero

  Currently unsupported.

  Relevant issue: https://github.com/zotero/zotero/issues/1203

[zsh]: /home/sakakibara/.zcompdump-organon-5.9.zwc

  Set this in your zshrc:

    compinit -d "$XDG_CACHE_HOME"/zsh/zcompdump-"$ZSH_VERSION"

  You must manually create the $XDG_CACHE_HOME/zsh directory if
  it doesn't exist yet.

[zsh]: /home/sakakibara/.zsh_history

  Set this in your zshrc:

    export HISTFILE="$XDG_STATE_HOME"/zsh/history

  You must manually create the $XDG_STATE_HOME/zsh directory if
  it doesn't exist yet.

[zsh]: /home/sakakibara/.zshenv

  Move the file to "$HOME"/.config/zsh/.zshenv and export the
  following environment variable:

    export ZDOTDIR="$HOME"/.config/zsh

  You can do this in /etc/zshenv (Or /etc/zsh/zshenv, on some
  distros).

[zsh]: /home/sakakibara/.zshrc

  Move the file to "$HOME"/.config/zsh/.zshrc and export the
  following environment variable:

    export ZDOTDIR="$HOME"/.config/zsh

  You can do this in /etc/zshenv (Or /etc/zsh/zshenv, on some
  distros).

Done checking your $HOME.

If you have files in your $HOME that shouldn't be there, but weren't recognised by xdg-ninja, please consider creating a configuration file for it and opening a pull request on github.

```

これをポチポチ潰していきます。
具体的には`export`で書かれているように環境変数を設定し、
ドットで書かれているディレクトリを環境変数が示すように配置します。

``` zsh title='huga'
export HUGA_HOME = $XDG_DATA_HOME/huga
mv .huga $HUGA_HOME
```

アフターでは以下のようになります。

``` zsh title='xdg-ninja'
~ ❯ xdg-ninja

Starting to check your $HOME.

[Firefox]: /home/sakakibara/.mozilla

  Currently unsupported.

  Relevant issue: https://bugzilla.mozilla.org/show_bug.cgi?id=259356

[nss]: /home/sakakibara/.pki

  Disclaimer: XDG is supported, but directory may be created again by
  some programs.

  XDG is supported out-of-the-box, so we can simply move directory to
  "$XDG_DATA_HOME"/pki.

  Note: some apps (chromium, for example) hardcode path to
  "$HOME"/.pki, so directory may appear again, see
  https://bugzilla.mozilla.org/show_bug.cgi?id=818686#c11.

[openssh]: /home/sakakibara/.ssh

  Assumed to be present by many ssh daemons and clients such as
  DropBear and OpenSSH.

[vim]: /home/sakakibara/.viminfo

  See help for .vimrc

[visual studio code]: /home/sakakibara/.vscode

  Currently unsupported.

  Relevant issue: https://github.com/microsoft/vscode/issues/3884

Done checking your $HOME.

If you have files in your $HOME that shouldn't be there, but weren't recognised by xdg-ninja, please consider creating a configuration file for it and opening a pull request on github.

~ ❯
```

## xdg-user-dires
```zsh title='xdg-user-dirs'
xdg-user-dirs-update
```
このコマンドを実行すると以下のフォルダが生成されます。
```zsh title='~/.config/user-dirs.dirs'
XDG_DESKTOP_DIR="$HOME/Desktop"
XDG_DOWNLOAD_DIR="$HOME/Downloads"
XDG_TEMPLATES_DIR="$HOME/Templates"
XDG_PUBLICSHARE_DIR="$HOME/Public"
XDG_DOCUMENTS_DIR="$HOME/Documents"
XDG_MUSIC_DIR="$HOME/Music"
XDG_PICTURES_DIR="$HOME/Pictures"
XDG_VIDEOS_DIR="$HOME/Videos"
```

これにより一通りのXDGの設定を`$HOME`内に生成することができます。

## XDGの仕様
様々な仕様でファイルやファイルフォーマットは運用されている。
この仕様はファイルが配置されるべき相対的なBase directoryをいくつか定義することで、ファイルが見つかるべき場所を定義している。

XDGはその仕様のうちの一つである。
XDGのBase directoryは以下のコンセプトに従って策定されている。

- user固有のデータファイルが書き込まれるBase directoryはただ一つであり、$XDG_DATA_HOMEで定義される。

- user固有の設定ファイルが書き込まれるBase directoryはただ一つであり、$XDG_CONFIG_HOMEで定義される。

- user固有の状態ファイルが書き込まれるBase directoryはただ一つであり、$XDG_STATE_HOMEで定義される。

- user固有の実行ファイルが書き込まれるBase directoryはただ一つであり、環境変数はここでは規定しない。

- データファイルを検索するための優先順位付けされたBase directoryの集合があり、このディレクトリの集合は$XDG_DATA_DIRSで定義される。

- 設定ファイルを検索するための優先順位付けされたBase directoryの集合があり、このディレクトリの集合は$XDG_CONFIG_DIRSで定義される。

- user固有の(必須ではない)キャッシュファイルが置かれるためのただ一つのBase directoryがあり、このディレクトリは$XDG_CACHE_HOMEで定義される。

- user固有の実行時ファイルとその他のファイルオブジェクトが置かれるためのただ一つのBase directoryがあり、このディレクトリは$XDG_RUNTIME_DIRで定義される。

これらの環境変数に設定されるパスは絶対パスである必要があり、
もしこれら環境変数のいずれかに相対パスが見られた場合、そのパスは無効か無視しなくてはならない。

| environment variables | default            | contents               |
|:----------------------|:-------------------|:-----------------------|
| XDG_DATA_HOME         | $HOME/.local/share       | user固有のデータ       |
| XDG_CONFIG_HOME       | $HOME/.config      | user固有の設定ファイル |
| XDG_STATE_HOME        | $HOME/.local/state | user固有の状態ファイル |
| -                     | $HOME/.local/bin   | user固有の実行ファイル |

基本的には`XDG_STATE_HOME`にはアプリが再起動するまでに永続化する必要がデータが含まれる。ですが、`XDG_STATE_HOME`にはuserが`XDG_DATA_HOME`に保存するまでもないデータ(userにとってそれほど重要でも移植性もない)が含まれることがあります。  
例えば、
- logs, history, 最近仕様したファイルなどの行動履歴に関するファイル
- view, layout, 開いていたファイル, undo history, などの現在の再起動時に再利用するための現在のアプリケーションの状態に関するファイル

※ `$HOME`が部分的にアーキテクチャ固有になります。

| environment variables | default                       | contents                                             |
|:----------------------|:------------------------------|:-----------------------------------------------------|
| XDG_DATA_DIRS         | /usr/local/share/:/usr/share/ | データファイル                                       |
| XDG_CONFIG_DIRS       | /etc/xdg                      | 設定ファイル                                         |
| XDG_CACHE_HOME        | $HOME/.cache                  | キャッシュファイル                                   |
| XDG_RUNTIME_DIR       | -                             | socket, pipeなどのファイルオブジェクト |


結果的にzshrcは以下のようになる。
```zsh title='zshrc'
# XDG environment value
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_STATE_HOME="$HOME/.local/state"

export XDG_DATA_DIRS="/usr/local/share/:/usr/share/"
export XDG_CONFIG_DIRS="/etc/xdg"
export XDG_CACHE_HOME="$HOME/.cache"
```
XDG_DATA_DIRS内のディレクトリは":"で区切られます。この順序は重要度を表します。  
XDG_CONFIG_DIRS内のディレクトリは":"で区切られます。この順序は重要度を表します。  
また、基本的には先に示したディレクトリがより優先されます。  
例えば、XDG_DATA_HOMEの方がXDG_DATA_DIRSより優先されます。  

XDG_RUNTIME_DIRはソケット、パイプなどをファイルオブジェクトを格納します。
所有権はユーザーであり、アクセス権もユーザーでなければなりません。

また、ディレクトリはローカルファイルシステム上で作成し、このディレクトリのファイルは定期的にクリーアップされる可能性があります。

