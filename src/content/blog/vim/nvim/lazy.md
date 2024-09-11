---
title: 'Nvimのパッケージマネージャlazy.nvim'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-08-28
tags: ["nvim", "Neovim", "lazy.nvim"]
---


# Introduction
これまでvimのパッケージマネージャーとして`vim-plugin`を使ってきた.
しかし, Neovimへの以降に伴いnvim用のパッケージマネージャーを用いることにした.

## Contents
## LazyVim と lazy.nvim

`LazyVim`というパッケージがある.
これ自体はパッケージマネージャーではないが, nvimのパッケージマネージャ関連の情報を探っている時におそらく最も頻繁に目にするだろう.
似たような文字列として`lazy.nvim`というものがある.
これらはどのような関係があるのだろうか.

[`lazy.nvim`](https://lazy.folke.io/)とは, Neovimのためのモジュールプラグインマネージャーである.


[`LazyVIM`](https://www.lazyvim.org/)とは, Neovimのセットアップであり, 内部で`lazy.nvim`に頼っている.
こっちの`lazy.nvim`がnevimのパッケージマネージャーとなる.

混乱しがちなのが, `LazyVim`と`lazy.nvim`という名前だ.
口にだしたらどっちも同じような音なので２つの役割がごっちゃになる.

## lazy.nvim
前述の通り, Neovimのために作成されたパッケージマネージャである.
つぎのようなディレクトリレイアウトを用意しておこう.

```bash
~/.config/nvim
├── lua
│   ├── config
│   │   └── lazy.lua
│   └── plugins
│       ├── spec1.lua
│       ├── **
│       └── spec2.lua
└── init.lua
```

`.config/nvim/init.lua`に次のように記述すし,
```lua
require("config.lazy")
```
`.config/nvim/lua/config/lazy.lua`に次のように記述することでlazy.nvimをinstallすることができる.

```lua
-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = "https://github.com/folke/lazy.nvim.git"
  local out = vim.fn.system({ "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath })
  if vim.v.shell_error ~= 0 then
    vim.api.nvim_echo({
      { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
      { out, "WarningMsg" },
      { "\nPress any key to exit..." },
    }, true, {})
    vim.fn.getchar()
    os.exit(1)
  end
end
vim.opt.rtp:prepend(lazypath)

-- Make sure to setup `mapleader` and `maplocalleader` before
-- loading lazy.nvim so that mappings are correct.
-- This is also a good place to setup other settings (vim.opt)
vim.g.mapleader = " "
vim.g.maplocalleader = "\\"

-- Setup lazy.nvim
require("lazy").setup({
  spec = {
    -- import your plugins
    { import = "plugins" },
  },
  -- Configure any other settings here. See the documentation for more details.
  -- colorscheme that will be used when installing plugins.
  install = { colorscheme = { "habamax" } },
  -- automatically check for plugin updates
  checker = { enabled = true },
})
```

注目すべきはこのファイルの`require("lazy").setup({spec=...})`の記述であり,
`{import = "plugins"}`となっている.
`~/.config/nvim/lua/plugins`の中に多くの設定ファイル(spec*.lua)を記述できる.
記述できる項目は[ここ](https://lazy.folke.io/spec)に記載されている通りで, ほとんどkey=valueの記述できる.

```lua
return {
  -- the colorscheme should be available when starting Neovim
  {
    "folke/tokyonight.nvim",
    lazy = false, -- make sure we load this during startup if it is your main colorscheme
    priority = 1000, -- make sure to load this before all the other start plugins
    config = function()
      -- load the colorscheme here
      vim.cmd([[colorscheme tokyonight]])
    end,
  },

  -- I have a separate config.mappings file where I require which-key.
  -- With lazy the plugin will be automatically loaded when it is required somewhere
  { "folke/which-key.nvim", lazy = true },

  {
    "nvim-neorg/neorg",
    -- lazy-load on filetype
    ft = "norg",
    -- options for neorg. This will automatically call `require("neorg").setup(opts)`
    opts = {
      load = {
        ["core.defaults"] = {},
      },
    },
  },

  {
    "dstein64/vim-startuptime",
    -- lazy-load on a command
    cmd = "StartupTime",
    -- init is called during startup. Configuration for vim plugins typically should be set in an init function
    init = function()
      vim.g.startuptime_tries = 10
    end,
  },

  {
    "hrsh7th/nvim-cmp",
    -- load cmp on InsertEnter
    event = "InsertEnter",
    -- these dependencies will only be loaded when cmp loads
    -- dependencies are always lazy-loaded unless specified otherwise
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",
      "hrsh7th/cmp-buffer",
    },
    config = function()
      -- ...
    end,
  },

  -- if some code requires a module from an unloaded plugin, it will be automatically loaded.
  -- So for api plugins like devicons, we can always set lazy=true
  { "nvim-tree/nvim-web-devicons", lazy = true },

  -- you can use the VeryLazy event for things that can
  -- load later and are not important for the initial UI
  { "stevearc/dressing.nvim", event = "VeryLazy" },

  {
    "Wansmer/treesj",
    keys = {
      { "J", "<cmd>TSJToggle<cr>", desc = "Join Toggle" },
    },
    opts = { use_default_keymaps = false, max_join_length = 150 },
  },

  {
    "monaqa/dial.nvim",
    -- lazy-load on keys
    -- mode is `n` by default. For more advanced options, check the section on key mappings
    keys = { "<C-a>", { "<C-x>", mode = "n" } },
  },

  -- local plugins need to be explicitly configured with dir
  { dir = "~/projects/secret.nvim" },

  -- you can use a custom url to fetch a plugin
  { url = "git@github.com:folke/noice.nvim.git" },

  -- local plugins can also be configured with the dev option.
  -- This will use {config.dev.path}/noice.nvim/ instead of fetching it from GitHub
  -- With the dev option, you can easily switch between the local and installed version of a plugin
  { "folke/noice.nvim", dev = true },
}
```

**なお, `options.lua`はあくまでもlazy.nvimの設定ファイルであり, nvim全体の設定ファイルではない.
nvimの設定ファイルは`init.lua`である.**

## LazyViM

`LazyVim`をinstallできただろうか,
`LazyVim`をinstallしたらやることは使わないpluginを`disable`にすることである.

`lua/plugins/disabled.lua`に次のように記述する.
```lua
return {
  { "folke/trouble.nvim", enabled=false }
}
```
