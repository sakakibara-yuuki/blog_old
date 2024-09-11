---
title: "Styled Components"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-08-31
updatedDate: 2024-08-31
tags: ["web", "react", "styled-components"]
---

# Introduction

## Contents

## 発展的な使い方

### ThemeProvider

`styled-components`は`<ThemeProvider>`というWrapper Componentを提供する.

`<ThmeProvider/>`で定義することによって, その子のReact Componentにthemeを適用させることができる.

```typescript
const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;

  color: ${(props) => props.theme.main};
  border: 2px solid ${(props) => props.theme.main};
`;

// define default Props for Button
Button.defaultProps = {
  theme: {
    main: "#BF4F74",
  },
};

// define theme for Button through ThemeProvider
const theme = {
  main: "mediumseagreen", // #3CB371
};

render(
  <div>
    <Button> Normal </Button>

    <ThemeProvider theme={theme}> // themeを適用
      <Button> Themed </Button>
    </ThemeProvider>
  </div>
);
```

### 関数をThemeProviderに渡す

関数もpropsとして渡すことができる. これによって, 関数はthemeを受け取ることができる.
これによって, 親のthemeを子に文脈を持たせて渡すことができる.

下の例では上のtheme(背景)に対して反転するthemeを渡している.
このように親の子で文脈的にthemeを渡すことができる.

`theme`はオブジェクトであるが, `invertTheme`は関数である.
`invertTheme`は`theme`を引数として受け取り, 新しい`theme`を返す.

`<ThemeProvider>`の`thme`プロパティはobjectだけでなく関数を受け取ることができ, `theme`を受け取り, 新しい`theme`を返す.

```typescript
const Button = styled.button`
  color: ${(props) => props.theme.fg};
  border: 2px solid ${(props) => props.theme.fg};
  background: ${(props) => props.theme.bg};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;
`;

const theme = {
  fg: "#BF4F74",
  bg: "white",
};

// fg と bg を入れ替える関数
const invertTheme = ({ fg, bg }) => ({
  fg: bg,
  bg: fg,
});

render(
  <ThemeProvider theme={theme}>
    <div>
      <Button> Default Theme </Button>

      <ThemeProvider theme={invertTheme}>
        <Button> Inverted Theme </Button>
      </ThemeProvider>
    </div>
  </ThemeProvider>
);
```

### theme prop

`theme`propをつかってReact コンポーネントにthemeを渡すことができる.
これは`theme`の設定し忘れを防いだり, overrideするのに役立つ.

```typescript
const Button = styled.button`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border-radius: 3px;

  color: ${(props) => props.theme.main};
  border: 2px solid ${(props) => props.theme.main};
`;

const theme = {
  main: "mediumseagreen",
};

render(
  <div>
    <Button theme={{main: "royalblue"}}>Adhoc theme</Button>
    <ThemeProvider theme={theme}>
      <div>
        <Button>Themed</Button>
        <Button theme={{ main: "darkorange" }}>Overridden</Button>
      </div>
    </ThemeProvider>
  </div>
);
```
