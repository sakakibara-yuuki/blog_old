---
title: "Information Geometry and Its Applications : Divergence"
author: "sakakibara"
description: "情報幾何学"
heroImage: "/science/math/manifold/manifold2.jpg"
pubDate: 2024-03-19
tags: ["math", "manifold", "情報幾何学", "多様体", "統計"]
---


## 2点間のDivergence
多様体$M$上の$2$点$P, Q \in M$について考える。それぞれ局所座標系$\bm{\xi}_ P$, $\bm{\xi}_ Q$が備え付けられているとする。
Divergence$D[P : Q]$は以下を充たす$\bm{\xi}_ P, \bm{\xi}_ Q$の関数である。
ただし、$\bm{\xi}_ P, \bm{\xi}_ Q$は微分可能であるとし、
$
D[P : Q] = D[\bm{\xi}_ P : \bm{\xi}_ Q]
$
のように書く。
 
> *def* :  
> 以下を充たす関数$D[P, Q]$を$P$から$O$へのDivergenceと呼ぶ。
> $$
> \begin{array}{ll}
> \text{(半正定値性)} & D[P : Q] \geq 0 \\
> \text{(非退化性)} & D[P : Q] = 0, \implies  P = Q \\
> \end{array}
> $$
> $P, Q$が十分近いならばそれぞれの局所座標系は$\bm{\xi}_ P$を用いて、
> $\bm{\xi}_ Q = \bm{\xi}_ P + \mathrm{d}\bm{\xi}$のように表現でき、
> $D$のテーラー展開が以下のように表現できる
> $$
> \begin{aligned}
> & D[\bm{\xi}_ P : \bm{\xi}_ P + \mathrm{d}\bm{\xi}] = \frac{1}{2}\sum g_{ij}(\bm{\xi}_ P)\mathrm{d}\xi_i\mathrm{d}\xi_j + \mathcal{O}(\mathrm{d}\xi^3) \\
> \end{aligned}
> $$
> さらに、$\bm{\mathrm{G}}=(g_{ij})\text{が}\bm{\xi}_ P$において正定値である


Divergenceは$2$点$P$, $Q$がどれだけ離れているかを表しているが、一般の距離, 例えば$2-$ノルムとは異なる。
Divergenceは必ずしも対称である必要がない。つまり、一般には
$$
\begin{array}{ll}
\text{(非対象性)} & D[P : Q] \neq D[Q : P]
\end{array}
$$
である。
また、三角不等式も満たさない。


> comment:  
> Divergenceは疑距離の一種であり、特に対称性がないため距離の公理を満たさない。
> というのもDivergenceは$1$点$\bm{\xi}_ P$における計量を使用しているからだ。
> また、$D[P : Q] \ge 0$であるために$\bm{\mathrm{G}} = (g_{ij})$は正定値である必要がある。

$P, Q$が十分近いならば、微小距離の$2$乗を以下のように表現できる。
$$
\mathrm{d}s^2 = 2D[\bm{\xi} : \bm{\xi} + \mathrm{d}\bm{\xi}] = \sum g_{ij}(\bm{\xi})\mathrm{d}\xi_i\mathrm{d}\xi_j
$$
多様体$M$上で定義される$\bm{\mathrm{G}}(\bm{\xi})$が正定値であり、かつ、$2$点間の微小距離の$2$乗が上の式で定義されるとき、多様体$M$をリーマン多様体と呼ぶ。
Divergence$D$の導入により多様体$M$にリーマン多様体となる。
