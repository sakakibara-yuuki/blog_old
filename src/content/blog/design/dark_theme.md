---
title: "Dark theme"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-09-07
updatedDate: 2024-09-07
tags: ["design", "dark theme"]
---

# Dark Theme

Dark modeは近年のwebサイトやアプリで多く見かけるようになったデザイントレンドの一つだ.
この記事ではdark themeの実装方法について説明する.

## Contents

## CSSでの実装

自分がよく使うdark themeの実装方法は以下の通りだ.

- `light.css`, `dark.css`のcssファイルを用意する.
- あらかじめ`light.css`も`dark.css`も同じcss変数を使うようにしておく.
- このcssファイルをheaderで読み込む.
- `localStorage`を使ってユーザーが"dark"か"light"を選択する.
- 例えば, "light"を選択した場合, `<html>`タグに`light`クラスを追加する.
- `<html>`タグ以下では`light.css`と`dark.css`のcss変数を使える.
- `light.css`, `dark.css`のcss変数を使って, テーマカラーを設定する.

### CSSファイルの用意

まず, dark theme, light themeのcssファイルを用意する.

```css
/* light.css */
.light {
  -md-sys-color-primary: rgb(255, 255, 255);
  -md-sys-color-secondary: rgb(255, 255, 255);
  -md-sys-color-surface: rgb(255, 255, 255);
  -md-sys-color-surface-contianer: rgb(255, 255, 255);
}

/* dark.css */
.dark {
  -md-sys-color-primary: rgb(0, 0, 0);
  -md-sys-color-secondary: rgb(0, 0, 0);
  -md-sys-color-surface: rgb(0, 0, 0);
  -md-sys-color-surface-contianer: rgb(0, 0, 0);
}
```

ここでは同じcss変数を使うようにする.

### CSSファイルをheaderで読み込む

次に, このcssファイルをheaderで読み込む.

```html
<header>
  <link rel="stylesheet" href="css/light.css" id="theme" />
  <link rel="stylesheet" href="css/dark.css" id="theme" />
  <link rel="stylesheet" href="global.css" id="theme" />
</header>
```

### localStorageを使ってユーザーが"dark"か"light"を選択する

```html
<script>
  // localstorageに保存されたテーマを取得, もしくはブラウザのテーマを取得
  const theme = (() => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  })();

  // lightのthemeの場合はdarkクラスを削除, darkのthemeの場合はdarkクラスを追加
  if (theme === "light") {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }

  // 現在のthemeをlocalstorageに格納
  window.localStorage.setItem("theme", theme);

  // buttonがクリックされた時にdarkクラスを追加, 削除
  const handleToggleClick = () => {
    const element = document.documentElement;
    element.classList.toggle("dark");
    element.classList.toggle("light");

    const isDark = element.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  // handleToggleClickをbuttonに追加
  document
    .getElementById("themeToggle")
    .addEventListener("click", handleToggleClick);
</script>
```

### CSSファイルの変数を使ってテーマカラーを設定する

`<html>`に`dark`や`light`クラスが追加されたら, `<html>`以下では`light.css`や`dark.css`のcss変数を使える.

```html
<html class="dark">
  <header>
    <link rel="stylesheet" href="css/light.css" id="theme" />
    <link rel="stylesheet" href="css/dark.css" id="theme" />
    <link rel="stylesheet" href="global.css" id="theme" />
  </header>
  <body>
    <main>
      <button id="themeToggle">Toggle</button>
    </main>
  </body>
</html>
```

```css
header {
  background-color: var(--md-sys-color-surface-container-lowest);
}
main {
  background-color: var(--md-sys-color-surface);
}
```

以上!
