---
title: "高次有限要素法: 2.2  H1適合近似"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: "/science/science.jpg"
pubDate: 2024-03-24
tags: ["math", "fem", "有限要素法"]
---


## $H^1$適合近似
#### 1次元の階層基本要素
$K_a = (-1, 1)$を$1$次元の参照区間とし、このケースでは要素内補間において関連する局所近似次数は$1\le p^b$である。(unisolventを参照)
基本要素$\mathcal{K}_ {a}^1=(K_a, W_a, \Sigma_ {a}^1)$は多項式空間
$$
W_a = \mathcal{P}_ {p^b}(K_a)
$$
で定義付けられている。
ここで、$\mathcal{P}_ {p}(e)$は$1$次元の区間$e$内に定義された$p$次の多項式空間であるとする。
$W_a$における階層基底は頂点関数を構成する。
$$
\begin{aligned}
\psi_ {a}^{v_1}(\xi) = \lambda_{2, a}(\xi) = l_0(\xi) \\
\psi_ {a}^{v_2}(\xi) = \lambda_{1, a}(\xi) = l_1(\xi)
\end{aligned}
$$
ここで、$\lambda_{1, a}$と$\lambda_{2, a}$は$1$次元のアフィン座標と(以前に定義した)気泡関数である。
$$
\psi_ {k, a}^b = l_k,\ 2\le k \le p^b
$$
さらにそのうえ、気泡関数はカーネル関数をもちいて以下のように表現できる。
$$
\psi_ {k, a}^b = \lambda_{1, a}\lambda_{2, a}\phi_ {k-1}(\lambda_{1, a}-\lambda_{2, a})
$$
一つ上の式は四角形やブロック型に対してより適切であるが、あとで、三角形や四面体に対してより自然な形で拡張する。プリズムはその両方を含む。

#### 四角形の階層基本要素
次に、$\mathcal{K}_ q^1$上の任意次数の基本要素について考える。
$\mathcal{K}_ q^1$は以下の参照領域である。
$$
K_q = \set{\bm{\xi} \in \mathbb{R}^2 | -1 \le \xi_1, \xi_2 \le 1}
$$
なぜ、$[-1, 1]$の区間で定義したのかというと、Jacobi多項式の自然な定義域が$[-1, 1]$だからだ。  
以下で定義される$1$次元アフィン座標$\lambda_{j, q},\ j=1,\ldots, 4$を使う。
$$
\begin{aligned}
\lambda_{1, q}(\xi_1, \xi_2) = \frac{\xi_1 + 1}{2} \\
\lambda_{2, q}(\xi_1, \xi_2) = \frac{1 - \xi_1}{2} \\
\lambda_{3, q}(\xi_1, \xi_2) = \frac{\xi_2 + 1}{2} \\
\lambda_{4, q}(\xi_1, \xi_2) = \frac{1 - \xi_2}{2} \\
\end{aligned}
$$

