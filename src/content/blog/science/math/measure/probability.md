---
title: '確率論'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/science/science.jpg'
pubDate: 2024-07-23
tags: ["math", "measure"]
---

# Introduction
## Contents
## 確率空間

:::math[確率空間]{.def}
空でない集合$\Omega$とそのσ加法族$\mathcal{F}$, 確率測度$P$の組$(\Omega, \mathcal{F}, P)$を**確率空間**という.
:::

## 確率変数
また,
:::math[確率変数]{.def}
確率空間$(\Omega, \mathcal{F}, P)$と可測空間$(E, \mathcal{E})$の間の$\mathcal{F}$-可測な写像を**確率変数**という.

$$
X: \Omega \to E
$$
:::

特に, $E=\mathbb{R}$, $\mathcal{E}=\mathcal{B}$のとき, $\mathcal{F}$-可測であるという条件$\{\omega \mid E'\in \mathcal{E},\ X(\omega)\in E'\}\in \mathcal{F}$は$\{\omega \mid \forall \lambda,\  X(\omega)\le \lambda\}\in \mathcal{F}$のように書き表される.

<details>
<summary>引き戻し</summary>

  <!-- 命題 -->
  :::math[引き戻しは加法族になる]{.lemma}
  可測空間$(X, \mathcal{B}_ X)$, $(Y, \mathcal{B}_ Y)$間の写像$f: X \to Y$に対して,
  以下の集合族を **$\mathcal{B}_ Y$の$f$による引き戻し** という.

  $$
  f^{-1}(\mathcal{B}_ Y) = \{f^{-1}(B) \mid B \in \mathcal{B}_ Y\}
  $$

  $\mathcal{B}_ Y$の$f$による引き戻しは$X$の$\sigma$-加法族となる.
  :::

  引き戻しも逆像も同じ意味で使われるが, 集合族の値域を対象としている場合, 引き戻しということにする.

  <!-- ヒント -->
  <details>
  <summary>ヒント</summary>

  1.
  $$
  \emptyset_ X \in f^{-1}(\emptyset_ Y)
  $$

  2.
  $$
  f^{-1}(F)^{c} = f^{-1}(F^{c})
  $$

  3.
  $$
  \bigcup_{n=1}^{\infty}f^{-1}(F_n) = f^{-1}(\bigcup_{n=1}^{\infty}F_n)
  $$
  </details>

  <!-- 証明 -->
  <details>
  <summary>証明</summary>

  $f^{-1}(\mathcal{B}_ Y)$が$\sigma$-加法族の定義をちまちま確認していく.  
  1. $f^{-1}(\emptyset_ Y) = \{ x \in X \mid f(x) \in \emptyset_ Y\} = \{\emptyset_ X\}$ (そんな$x$は存在しない)である. よって, $\emptyset_ X \in f^{-1}(\emptyset_ Y)$である.  
  2. $B \in f^{-1}(\mathcal{B}_ Y)$とすると, 適当に$F\in \mathcal{B}_ Y$をとり,
  $E = f^{-1}(Y)$と表せる.  
  $E^{c} = f^{-1}(F)^{c} = f^{-1}(F^{c}) \in f^{-1}(\mathcal{B}_ Y)$
  よって, $f^{-1}(\mathcal{B}_ Y)$は補集合を持つ.  
  3. 可算個の$E_1, E_2, \ldots \in f^{-1}(\mathcal{B}_ Y)$を考える. 各$i\in \mathbb{N}$に対して
  $E_i = f^{-1}(F_i)$と書ける. このとき,  
  $\bigcup_{n=1}^{\infty}E_n = \bigcup_{n=1}^{\infty}f^{-1}(F_n) = f^{-1}( \bigcup_{n=1}^{\infty} F_n ) \in f^{-1}(\mathcal{B}_ Y)$  
  よって,　可算個の$E_1, E_2, \ldots \in f^{-1}(\mathcal{B}_ Y)$に対して, $\bigcup_{n=1}^{\infty}E_n \in f^{-1}(\mathcal{B}_ Y)$である.  

  以上より, $f^{-1}(\mathcal{B}_ Y)$は$\sigma$-加法族である.
  Q.E.D.
  </details>
</details>

<details>
<summary>押出し</summary>

  :::math[押出しは加法族になる]{.lemma}
  可測空間$(X, \mathcal{B}_ X)$, $(Y, \mathcal{B}_ Y)$間の写像$f: X \to Y$に対して,
  以下の集合族を **$\mathcal{B}_ X$の$f$による押出し** という.
  $$
    f(\mathcal{B}_ X) = \{F \subset Y \mid f^{-1}(F) \in \mathcal{B}_ X\}
  $$

  $f(\mathcal{B}_ X) = \{f(E) \mid E \in \mathcal{B}_ X)$ではない. こっちのほうがそれっぽいけど.
  引き戻しが$\mathcal{B}_ X$に属するような$Y$の部分集合全体の集合族が押し出しである.
  :::

  <details>
  <summary>証明</summary>

  $f(\mathcal{B}_ X)$が$\sigma$-加法族の定義をちまちま確認していく.

  1. $f^{-1}(\emptyset_Y)=\emptyset_X \in \mathcal{B}_ X$より, $\emptyset_Y \in f(\mathcal{B}_ X)$である.
  2. $F \in f(\mathcal{B}_ X)$とすると, $f^{-1}(F) \in \mathcal{B}_ X$である.  
  $f^{-1}(F^{c}) = f^{-1}(F)^{c} \in \mathcal{B}_ X$よって, $F^{c} \in f(\mathcal{B}_ X)$である.

  3. 可算個の部分集合$F_1, F_2, \ldots \in f(\mathcal{B}_ X)$を考える. 各$i\in \mathbb{N}$に対して$f^{-1}(F_i) \in \mathcal{B}_ X$である. このとき,
  $f^{-1}(\bigcup_{n=1}^{\infty}F_n) = \bigcup_{n=1}^{\infty}f^{-1}(F_n) \in \mathcal{B}_ X$  

  よって, $\bigcup_{n=1}^{\infty}F_n \in f(\mathcal{B}_ X)$である.
  以上より, $f(\mathcal{B}_ X)$は$\sigma$-加法族である.
  Q.E.D.
  </details>
</details>

<details>
<summary>ボレル集合と確率変数</summary>

<!-- 命題 -->
:::math[押し出しは加法族になる]{.lemma}
  $\{\omega \mid \forall \lambda,\  X(\omega)\le \lambda\}$がボレル集合族の引き戻しであり, 任意のボレル集合を表現できることを示す.
:::

</details>

## 期待値
期待値とは確率変数の確率測度による積分である.
:::math[期待値]{.def}
確率空間$(\Omega, \mathcal{F}, P)$上の確率変数$X$が$P$-可積分であるとき,
$$
E[X] = \int_\Omega X(\omega)P(d\omega)
$$
:::

## 条件つき期待値
条件付き期待値は初等的な条件付き確率の期待値である.

:::math[初等的な条件付確率と条件付期待値]{.def}
確率空間$(\Omega, \mathcal{F}, P)$において, 事象$B$を条件付けた場合の事象$A$の確率は$P(A | B)$で定義される. これを$B$で条件づけた$A$の確率という.
$$
P(A | B) = \frac{P(A \cap B)}{P(B)}
$$

また, 事象$B$を条件づけた場合の確率変数$X$の期待値$E[X|B]$は以下で定義される. $P(\cdot | B)$を条件づけ確率として表すとき, 特に有限加法族の場合
$$
E[X|B] = \sum_{\omega \in \Omega}X(\omega)P(X^{-1}(\omega)|B)
$$
:::

たとえば, サイコロを投げる例を考える.
確率変数$X: \Omega \to \{1, 2, \ldots, 6\}$を次のように定義する.
$$
\Omega = \bigsqcup_{i=1}^{6}A_i, \quad A_i = X^{-1}(\{i\}), P(A_i) = \frac{1}{6}
$$
また, 偶数の目が出る事象を$B=A_2 \sqcup A_4 \sqcup A_6$とする.
この場合, 条件付き確率$P(A_i | B)$は次のように計算される.
$i \in \{2, 4, 6\}$の場合
$$
P(A_i | B) = \frac{P(A_i \cap B)}{P(B)} = \frac{P(A_i)}{P(B)} = \frac{1/6}{1/2} = \frac{1}{3}
$$
$i \in \{1, 3, 5\}$の場合
$$
P(A_i | B) = 0
$$
となる.

$$
\begin{aligned}
E[X] &= \sum_{i=1}^{6}iP(A_i) = 1 \cdot \frac{1}{6} + 2 \cdot \frac{1}{6} + \ldots + 6 \cdot \frac{1}{6} = 3.5 \\
E[X|B] &= \sum_{i=1}^{6}iP(A_i | B) = 1 \cdot 0 + 2 \cdot \frac{1}{3} + 3 \cdot 0 + 4 \cdot \frac{1}{3} + 5 \cdot 0 + 6 \cdot \frac{1}{3} = 4
\end{aligned}
$$

さて, $E[X| B^c]$はどうなるかこれは$B^c = A_1 \sqcup A_3 \sqcup A_5$であるから, $E[X | B^c] = 1 \cdot \frac{1}{3} + 2 \cdot 0 + 3 \cdot \frac{1}{3} + 4 \cdot 0 + 5 \cdot \frac{1}{3} + 6 \cdot 0 = 3$となる.
では, $E[X | \emptyset]$はどうなるか. これは$E[X | \emptyset] = 0$となる.
$E[X | \Omega]$はどうなるか. これは$E[X | \Omega] = E[X] = 3.5$となる.
まとめると,
$$
\begin{aligned}
E[X | \emptyset] &= 0 \\
E[X | B] &= 4 \\
E[X | B^c] &= 3 \\
E[X | \Omega] &= 3.5
\end{aligned}
$$

また, 例えば$A_2$の条件付き期待値は
$$
E[X | A_2] = \sum_{\omega \in \Omega} X(\omega)P(X^{-1}(\omega) | A_2) = 2 \cdot P(A_2 | A_2) =2
$$
ここからわかるように, $A_1, A_2, \ldots, A_6$の条件付き期待値は
$$
E[X | A_i] = i
$$
このようにして見ると, 条件付き期待値はその条件(事象)によって期待値が変わることがわかる.
そこで, 条件付き期待値を事象を引数に取る写像, すなわち確率変数として見ることができる.
たとえば, $\mathcal{G} = \{\emptyset, B, B^c, \Omega\}$とすると,
$$
E[X | \mathcal{G}]: \Omega \to \mathbb{R}
$$
$$
E[X | \mathcal{G}](\omega) = 
\begin{cases}
0 & \omega \in \emptyset \\
4 & \omega \in B \\
3 & \omega \in B^c \\
3.5 & \omega \in \Omega
\end{cases}
$$
この全ての期待値を考えると,
また, $\mathcal{F}=\{A_1, A_2, \ldots, A_6\}$に対しては
$$
E[X | \mathcal{F}]: \Omega \to \mathbb{R}
$$
$$
E[X | \mathcal{F}](\omega) = 
\begin{cases}
1 & \omega \in A_1 \\
2 & \omega \in A_2 \\
3 & \omega \in A_3 \\
4 & \omega \in A_4 \\
5 & \omega \in A_5 \\
6 & \omega \in A_6
\end{cases}
$$
となり, これは実質確率変数$X$と同じである. また, このようにして考えると条件付き期待値(確率変数)の$\sigma$-加法族をどのように選ぶかというのは, 事象をどのような粒度・目の粗さで見るかということに該当する.

では, 一般の条件付き期待値の定義を述べる.
:::math[条件付期待値]{.def}
確率空間$(\Omega, \mathcal{F}, P)$上の確率変数$X$に対して, $\mathcal{G} \subset \mathcal{F}$を$\sigma$-加法族とする.  
$X$の$\mathcal{G}$に関する条件付期待値$Y=E[X | \mathcal{G}]$は次のように定義される.

$$
\forall G \in \mathcal{G}, \int_{G}Y(\omega)P(d\omega) = \int_{G}X(\omega)P(d\omega)
$$

を充たす$\mathcal{G}$-可測な確率変数$Y$を **$\sigma$-加法族$\mathcal{G}$に関する$X$の条件付期待値** という.
:::

たとえば, $B = A_2 \sqcup A_4 \sqcup A_6$を上の$G$として考える.
$$
\begin{aligned}
(LHS) &= \sum_{\omega \in B}Y(\omega)P(B) \\
&= \sum_{\omega \in B}Y(\omega)\frac{1}{2} \\
&= Y(\omega)\frac{1}{2} ,\ \omega \in B\\
(RHS) &= \sum_{\omega \in A_2 \sqcup A_4 \sqcup A_6}X(\omega)P(X^{-1}(\omega)) \\
&= X(2)P(A_2) + X(4)P(A_4) + X(6)P(A_6) \\
&= 2 \cdot \frac{1}{6} + 4 \cdot \frac{1}{6} + 6 \cdot \frac{1}{6} \\
&= 2
\end{aligned}
$$
ここから$Y(\omega) = 4,\ \omega \in B$であることになる.
これは$Y = E[X | B]$と同じである.

## 条件つき確率
:::math[条件付確率]{.def}
確率空間$(\Omega, \mathcal{F}, P)$と部分$\sigma$-加法族$\mathcal{G} \in \mathcal{F}$に対し, 以下で定義される確率変数$P(A | \mathcal{G})$が以下を充たすとき, **$P(A | \mathcal{G})$を$\mathcal{G}$に関する条件付き確率** という.
$$
A\in \mathcal{F},\ P(A | \mathcal{G}) = E[\bm{1}_ A | \mathcal{G}]
$$
:::

条件付き期待値にはいくつか重要な性質がある.

$(\Omega, \mathcal{F}, P)$上の可積分な確率変数$X, Y, X_1, X_2, \ldots$と$\sigma$-加法族$\mathcal{G} \subset \mathcal{F}$に対して, 以下が成り立つ.

1. $X$が非負ならば、, $E[X | \mathcal{G}]\ge 0,\ (a.e.)$.
1. $\forall a, b,\ E[aX + bY | \mathcal{G}] = aE[X | \mathcal{G}] + bE[Y | \mathcal{G}]$
1. $X_1, X_2, \ldots $が非負で単調増加で$X$に概収束するならば, $\{E[X_n | \mathcal{G}]\}_ n$は単調増加で$E[X | \mathcal{G}]$に概収束する.

さらに,
1. $E[E[X | \mathcal{G}]]=E[x]$
1. $\mathcal{G} \subset \mathcal{H}$ならば, $E[E[X | \mathcal{H}] | \mathcal{G}] = E[X | \mathcal{G}]$ (tower property: 塔の性質と呼ばれる)
1. $X$が$\mathcal{G}$-可測ならば, $E[X | \mathcal{G}] = X$
1. $X$が$\mathcal{G}$-可測かつ$XY$が期待値を持つならば, $E[XY | \mathcal{G}] = XE[Y | \mathcal{G}]$
1. $\sigma[X]$が$\mathcal{G}$と独立ならば, $E[X | \mathcal{G}] = E[X]$
<details>
<summary>証明</summary>

1. 
$E[X | \mathcal{G}]$の定義より,

$$
\forall G \in \mathcal{G},\ \int_{G}E[X | \mathcal{G}]dP = \int_{G}X dP
$$
が成り立つ. よって,

$$
E[X] = \int_\Omega X dP = \int_{\bigsqcup_{i=0} G_i} X dP = \int_{\bigsqcup_{i=0} G_i} E[X | \mathcal{G}]dP = \int_\Omega E[X | \mathcal{G}]dP = E[E[X | \mathcal{G}]]
$$

2.
条件付き期待値の定義より,
$$
\forall G \in \mathcal{G},\ \int_{G}E[E[X | \mathcal{H}] | \mathcal{G}]dP = \int_{G}E[X | \mathcal{H}] dP
$$

3.
これは上のサイコロの例で$E[X | \mathcal{F}] = X$となっていることから明らかである.
$X$が$\mathcal{G}$-可測であるとき, $X$は$\mathcal{G}$の中で定義関数となる. 
$$
\forall G \in \mathcal{G},\ \int_{G}X dP = \int_G X\bm{1}_ {G}dP
$$
よって, 条件付き期待値の定義より,
$$
X\bm{1}_ {G} = E[X | \mathcal{G}]
$$
よって,
$$
E[X | \mathcal{G}] = X
$$
が成り立つ.
</details>

## 自己エントロピー(自己情報量)
## エントロピー(平均情報量)
エントロピーとは確率変数のもつ情報の量の期待値である.

## 相対エントロピー(KLダイバージェンス)
## 転送エントロピー
## 相互情報量
