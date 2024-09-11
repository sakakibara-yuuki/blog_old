---
title: "高次有限要素法: 1.2 直交多項式"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: "/science/science.jpg"
pubDate: 2024-03-24
tags: ["math", "fem", "有限要素法"]
---


# 直交多項式
直交多項式は数学、数値計算と理論の両方の多様な領域で多く応用されています。
今回では、高次形状関数の適切な設計において重要な役割を果たします。

## Jacobi多項式族
Jacobi多項式族のクラスは以下のように定義されます。
$$
P_{n, \alpha, \beta}(x) = \frac{1}{2^n n!} \left(1 - x\right)^{\alpha} \left(1 + x\right)^{\beta} \frac{d^n}{dx^n}[(1 - x)^{\alpha + n} (1 + x)^{\beta + n}]
$$
ヤコビ多項式は直交多項式の中で重要な立ち位置を占めています。
ヤコビ多項式は以下のJacobi微分方程式を満たします。
$$
(1 - x ^2)\frac{d^2}{dx^2}P_{n, \alpha, \beta}(x) + (\beta - \alpha - (\alpha + \beta + 2)x)\frac{d}{dx} P_{n, \alpha, \beta}(x)+ n(n + \alpha + \beta + 1)P_{n, \alpha, \beta}(x) = 0
$$
ただし、$(\alpha, \beta > -1)$は実数のパラメータである。
さて、$I=(-1, 1)$とし、以下の重み
$$
\mathcal{w}_ {\alpha, \beta}(x) = (1 - x)^\alpha (1 + x)^\beta
$$
を持ち、$2$乗可積分な関数全体
$$
||u||^2_{\alpha, \beta} = \int_{-1}^{1} |u(x)|^2 \mathcal{w}_ {\alpha, \beta}(x)dx
$$
を集めた空間を$L^2_ {\alpha, \beta}(I)$とする。

ここで、任意の$u\in L^2_ {\alpha, \beta}(I)$は以下のように展開できる。
$$
u(x) = \sum_{n=0}^{\infty} c_n P_{n, \alpha, \beta}(x), \quad \lim_{N\to \infty}|| u - \sum_{n=0}^{N}c_n P_{n, \alpha, \beta}  ||_ {L^2_{\alpha, \beta}} = 0
$$
Jacobi多項式の直交性は以下のように表される。
$$
\int_{-1}^{1} P_{n, \alpha, \beta}(x)P_{m, \alpha, \beta}(x)\mathcal{w}_ {\alpha, \beta}(x)dx =
\begin{cases}
e_{n, \alpha, \beta}& n = m \\
0 & n\neq m
\end{cases}
$$
ただし、
$$
e_ {n, \alpha, \beta} = \frac{2^{\alpha + \beta + 1}}{2n + \alpha + \beta + 1}\frac{\Gamma(n + \alpha +
1)\Gamma(n + \beta + 1)}{\Gamma(n + 1)\Gamma(n + \alpha + \beta + 1)} 
$$
ここで、$\Gamma$はガンマ関数である。
係数$c_n$は以下のように計算される。
$$
c_n = \frac{1}{e_{n, \alpha, \beta}}\int_{-1}^{1} u(x)P_{n, \alpha, \beta}(x)\mathcal{w}_ {\alpha, \beta}(x)dx
$$
また、次の関係式が成り立つ。
$$
\frac{d}{dx}P_{n, \alpha, \beta}(x) = 2^{-k}\frac{\Gamma(n + k + \alpha + \beta + 1)}{\Gamma(n + \alpha + \beta + 1)}P_{n-k, \alpha+k, \beta+k}
$$

<!-- ## Legendre多項式 -->
## Lobatto形状関数
以下のように定義する。
$$
\begin{aligned}
l_0(x) &= \frac{1 - x}{2}, \quad l_1(x) = \frac{1 + x}{2} \\
l_k(x) &= \frac{1}{||L_{k-1}||}\int_{-1}^{x}L_{k-1}(t)dt, \quad k \le 2
\end{aligned}
$$
ここで、(1.42)から$||L_{k-1}|| = \sqrt{2 / (2k - 1)}$である。
明らかに、$l_k(-1) = 0, k = 2, 3,\ldots$にたいして、
これは、$L_k$から$L_0 = 1$への高次Legendre多項式直交性は次のように表される。
$$
\int_{-1}^{1}L_k(x)dx = 0 \quad k \ge 1
$$
(これはミスか？)
Lobatto形状関数$l_0, l_1, l_2, \ldots, l_p$は区間$(-1, 1)$における次数$p$の多項式$P_p(-1, 1)$空間の完備な基底を形成する。
ここで、参照のため、リストを示す。

$$
\begin{aligned}
l_2(x) &= \frac{1}{2}\sqrt{\frac{3}{2}}(x^2 - 1) \\
l_3(x) &= \frac{1}{2}\sqrt{\frac{5}{2}}(x^2 - 1)x \\
l_4(x) &= \frac{1}{8}\sqrt{\frac{7}{2}}(x^2 - 1)(5x^2 - 1) \\
l_5(x) &= \frac{1}{8}\sqrt{\frac{9}{2}}(x^2 - 1)(7x^2 - 3)x \\
l_6(x) &= \frac{1}{16}\sqrt{\frac{11}{2}}(x^2 - 1)(21x^4 - 14x^2 + 1) \\
\end{aligned}
$$
Lobatto形状関数は階層形状関数の設計について非常に重要な役割を果たす。

## kernel関数
kernel関数は高次Lobatto形状関数$l_2, l_3, \ldots$を積に分解することができ、便利であり、以下のように分解される。
$$
l_k(x) = l_0(x)l_1(x)\phi_{k-2}(x), \quad 2 \ge k
$$
$2 \ge k$での全ての関数$l_k$に対しては$\pm 1$で値が$0$になるので、kernel関数$\phi_{k-1}, \ k=2, 3, \ldots$は$k-2$次数の多項式である。
リストを示す。
$$
\begin{aligned}
\phi_0(x) &= - 2\sqrt{\frac{3}{2}} \\
\phi_1(x) &= - 2\sqrt{\frac{5}{2}}x \\
\phi_2(x) &= - \frac{1}{2}\sqrt{\frac{7}{2}}(5x^2 - 1) \\
\phi_3(x) &= - \frac{1}{2}\sqrt{\frac{9}{2}}(7x^2 - 3)x \\
\phi_4(x) &= - \frac{1}{4}\sqrt{\frac{11}{2}}(21x^4 - 14x^2 + 1) \\
\end{aligned}
$$
kernel関数$\phi_0, \phi_1, \ldots$は高次形状関数を三角形や四面体で定義するために使う。
