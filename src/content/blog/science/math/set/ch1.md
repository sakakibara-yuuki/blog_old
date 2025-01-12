---
title: "集合"
author: "sakakibara"
description: "集合"
heroImage: '/science/math/set/ch1.png'
pubDate: 2024-03-19
updatedDate: 2024-12-24
tags: ["math", "集合"]
---

# 集合
集合は数学の基礎概念にして、数学の基本的な対象である。
集合論には素朴集合論と公理的集合論があるが、ここでは素朴集合論を前提とする。
集合には、共通部分、和集合、差集合、補集合などの基本的でかつ直感的な演算が定義されるが、ここからつくられる世界は実に多様である。
中には非自明な命題を導くことができ、数学の面白さの一端を示している。

## 全称量化子と存在量化子
多くの場面で全称量化子$\forall$と存在量化子$\exists$が使われる。  
たとえば、包含関係$A \subset B$の定義は、
$$
\forall x \in A, x \in B
$$
とされる。  
これは"$A$に属する任意の$x$が, $B$に属する"という命題を表している。

しかし、より正確な全称量化子を用いた包含の定義は、
$$
\forall x, (x \in A \implies x \in B)
$$
である。

一般に、
$$
\forall x \in A, (\ldots)
$$
という書き方は、
$$
\forall x, (x \in A \implies (\ldots))
$$
を慣習的に省略したものである。
まぁ、実用上は同じ意味であり、どちらを使ってもよい。

また、同じことは存在量化子についても言える。

## 集合演算
集合$A, B, C, D$間の演算$\cap, \cup$に対して以下が成り立つ。

<!--:::math[交換法則]{.proposition}-->
$$
\begin{aligned}
A \cap B = B \cap A \\
A \cup B = B \cup A
\end{aligned}
$$
<!--:::-->
集合代数としての和と積について可換である。

<!--:::math[結合法則]{.proposition}-->
$$
\begin{aligned}
(A \cap B) \cap C = B \cap (A \cap C) \\
(A \cup B) \cup C = B \cup (A \cap C)
\end{aligned}
$$
<!--:::-->
同じ演算ならどこから計算しても良い。

<!--:::math[分配法則]{.proposition}-->
$$
\begin{aligned}
A \cup (B \cap C) = (A \cup B) \cap (A \cup C) \\
A \cap (B \cup C) = (A \cap B) \cup (A \cap C)
\end{aligned}
$$
<!--:::-->
$A \cdot$の演算を分配的に適用できる。

<!--:::math[ド・モルガンの法則]{.proposition}-->
$$
\begin{aligned}
X - (A \cup B) = (X - A) \cap (X - B) \\
X - (A \cap B) = (X - A) \cup (X - B)
\end{aligned}
$$
<!--:::-->
和と積が否定によって反転する有名な法則。

集合$A, B, C, D$間の$\subset$に対して以下が成り立つ。  

<!--:::math[包含関係]{.proposition}-->
$$
\begin{align}
A \cap B &\subset A \subset A \cup B \\
A \subset C,\ B \subset C &\implies A \cup B \subset C \\
D \subset A,\ D \subset B &\implies D \subset A \cap B
\end{align}
$$
<!--:::-->
上から抑えるか、下から抑えるか。

こんな単純な演算から様々な場所に顔を出すいくつもの法則、--交換法則、結合法則、分配法則--がでてくるのは不思議、というか集合を基盤としているのだということを強く感じさせる。

## 写像演算
写像$f: X \rightarrow Y$, $g: Y \rightarrow Z$, $h: Z \rightarrow W$について

proposition: (結合法則)
$$
    h \circ (g \circ f) = (h \circ g) \circ f
$$

proposition: (8つの命題)  
$f : A \rightarrow B$と$A_1, A_2 \subset A$と$B_1, B_2 \subset B$に対して
$$
\begin{align}
f(A_1 \cup A_2) &= f(A_1) \cup f(A_2) \\
f(A_1 \cap A_2) &\subset f(A_1) \cap f(A_2) \\
f^{-1}(B_1 \cup B_2) &= f^{-1}(B_1) \cup f^{-1}(B_2) \\
f^{-1}(B_1 \cap B_2) &= f^{-1}(B_1) \cap f^{-1}(B_2) \\
A_1 &\subset f^{-1}(f(A_1)) \\
f(f^{-1}(B_1)) &\subset B_1 \\
f(A_1) - f(A_2) &\subset f(A_1 - A_2) \\
f^{-1}(B_1) - f^{-1}(B_2) &= f^{-1}(B_1 - B_2)
\end{align}
$$

覚えておこう。**逆像は何でもあり。**
