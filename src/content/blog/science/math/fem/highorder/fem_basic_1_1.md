---
title: "高次有限要素法: 1.1 有限要素法の数学的基盤"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: "/science/science.jpg"
pubDate: 2024-03-24
tags: ["math", "fem", "有限要素法"]
---


# 有限要素法の数学的基盤
## 有限要素
> *def* :  
> **有限要素(Finite element)** とは以下を充たす組$\kappa = (K, P, \Sigma)$のことである。
> $$
> \begin{aligned}
> K &= \mathbb{R}^d\ s.t. (\text{$d=1$で線分の補間、$d=2$で三角形や四角形の補間}) \\
> P &= \set{\text{$K$上の多項式空間であり、}\mathrm{dim}(P) = N_P} \\
> \Sigma &= \set{L_i | \text{線形写像}\ L_i : P \rarr \mathbb{R}, i=1,2,\ldots,N_P}
> \end{aligned}
> $$

ここで、集合$\Sigma$の要素$L_i$は自由度(degree of freedom: DOFとも)と呼ばれる。
自由度は有限要素の基底関数として使われる。

### $H^1$, $\bm{H}(\mathrm{curl})$, $\bm{H}(\mathrm{div})$
$\Omega \subset \mathbb{R}^d$を有界なリプシッツ連続領域とし、$d$を空間の次元とする。  
$L^2$を自乗可積分関数(2乗ルベーグ空間)の空間, $[L^2]^d$を$d$次元$L^2$空間とする。
関数のスカラーヒルベルト空間 **$H^1$** は以下で定義される。
$$
H^1 = \set{u \in L^2(\Omega) | \nabla u \in L^2(\Omega)}
$$
$H^1$は基礎的な関数空間であり、ソボレフ空間としてよく使われる。
ここで、$H^1$の定義で使用されている偏微分は超関数(distributions)の文脈に対しても意味を持つ。

また、ベクトル値関数空間$\bm{H}(\mathrm{curl})$, $\bm{H}(\mathrm{div})$は以下で定義される。
$$
\begin{aligned}
\bm{H}(\mathrm{curl}) &= \set{\bm{u} \in [L^2(\Omega)]^d | \nabla \times \bm{u} \in [L^2(\Omega)]^d} \\
\bm{H}(\mathrm{div}) &= \set{\bm{u} \in [L^2(\Omega)]^d | \nabla \cdot \bm{u} \in L^2(\Omega)}
\end{aligned}
$$

ここで、$\bm{H}(\mathrm{curl})$と$\bm{H}(\mathrm{div})$は偏導関数の連続性のみが自乗可積分によって保証されているという点で$L^2$空間と$H^1$の中間に位置する。

簡単に言ってしまえば、$\bm{H}^1$は勾配が$L^2$に含まれるような$L^2$の元であり、  
$\bm{H}(\mathrm{curl})$は回転が$d$次元$L^2$ベクトル空間に含まれるような$d$次元$L^2$上ベクトル空間の元であり、  
$\bm{H}(\mathrm{div})$は発散が$d$次元$L^2$上ベクトル空間に含まれるような$d$次元$L^2$ベクトル空間の元である。

### unisolvency
有限要素$\kappa=(K, P, \Sigma)$がunisolvency(一意解決)とは$\Sigma$の自由度と$P$の基底関数の関係を表す概念である。  
以下を充たすとき、有限要素$\kappa=(K, P, \Sigma)$は**unisolvency(一意解決)** であるという。
$$
\forall g \in P, \\
L_1(g) = L_2(g) = \ldots = L_{N_P}(g) = 0 \implies g = 0
$$
言い換えると、$L_i (i = 1, 2,\ldots, N_P)$を要素にもつベクトル
$$
\bm{L}(g) = (L_1(g), L_2(g), \ldots, L_{N_P}(g))^T \in \mathbb{R}^{N_P}
$$
が多項式空間$P$からの単射であることを意味する。

### $\delta$-propertyについて
有限要素$\kappa = (K, P, \Sigma)$について、
多項式空間の部分集合$\mathcal{B} = \{\theta_1, \theta_2, \ldots, \theta_{N_P}\} \subset P$が$\delta$-propertyを持つとは以下を充たすことをいう。
$$
L_i(\theta_j) = \delta_{ij},\ \forall i,j=1,2,\ldots,N_P
$$
ただし、$\delta_{ij}$はクロネッカーのデルタである。

### unisolvencyの特徴
有限要素がunisolvencyであることと、その有限要素がもつ多項式空間$P$が$\delta$-propertyを持つことについては以下の重要な命題が成り立つ。  
有限要素$\kappa=(K, P, \Sigma)$について、
$$
\text{有限要素$\kappa$がunisolvencyである} \iff \\
\text{$\delta$-propertyを持つ基底$\mathcal{B} = \{\theta_1, \theta_2, \ldots, \theta_{N_P}\} \in P$が唯一つ存在する}
$$

*proof* :  
$\implies$の証明:   
有限要素$\kappa$がunisolvencyであるとする。また、多項式空間の任意の基底について$\{g_1, g_2, \ldots, g_{N_P}\} \subset P$をとる。  
多項式空間の任意の元$\theta_j (j = 1, 2, \ldots, N_P)$は係数$a_{kj} \in \mathbb{R}$を用いて以下のように線形和を用いて表現できる。
$$
\theta_j = \sum_{k=1}^{N_P} a_{kj} g_k
$$
ここで、$\delta-$propertyが成り立つときはどのような状況であるかを考える。
$\delta-$propertyがなりたつときは以下を充たす係数$a_{kj}$が一意に定まるときである。
$$
L_i(\theta_j) = \sum_{k=1}^{N_P} a_{kj} L_i(g_k) = \delta_{ij}
$$
($L_i$の線形性を用いている。)  
この式を行列形式で表現すると以下のようになる。
$$
\begin{aligned}
\bm{L}\bm{A} &= \bm{I}
\end{aligned}
$$
そこで、証明すべき命題を上の行列方程式の係数行列$A$が一意に定まることを示すことに帰着させる。
(不定・不能ではないことを示す)

$\bm{L}$の各列が線形従属であると仮定する。
すると$L_i$にて適当な非ゼロな係数$\alpha_k$を用いて
$$
\sum_{k=1}^{N_P} \alpha_{k} L_i(g_k) = \sum_{k=1}^{N_P}L_i(\alpha_k g_k) = 0
$$
と表現することができる。  
(ベクトル$v_1, v_2, \ldots$が線形独立であるということは、$\sum c_i v_i = 0 \implies c_i = 0$ であることを意味する。よって線形独立ではないということは$\sum c_i v_i = 0 \land c_i \neq 0$)

しかし、有限要素$\kappa$がunisolvencyであるという仮定のため、任意の$\alpha_k g_k$に対して
$$
\sum_{k=1}^{N_P} L_i(\alpha_{k} g_k) = 0 \implies \alpha_k g_k = 0
$$
であるはず。
これは、$L_i$が線形従属であることと矛盾する。
よって、$\bm{L}$の各列は線形独立であり、それに伴い、$\bm{L}$は可逆である。
よって、係数行列$A$は一意に定まる。

$\impliedby$の証明:   
$\delta$-propertyを持つ基底$\mathcal{B} = \{\theta_1, \theta_2, \ldots, \theta_{N_P}\} \in P$が唯一つ存在するとする。

多項式空間$P$の任意の元$g \in P$は適当な係数$\gamma_i$を用いて以下のように表現できる。
$$
g = \sum_{i=1}^{N_P} \gamma_i \theta_i
$$
よって、
$$
L_i(g) = \sum_{j=1}^{N_P} \gamma_j L_i(\theta_j) = \gamma_i
$$
($\theta_i$が$\delta$-propertyであることを用いた。)  
よって
$$
L_i(g) = 0 \implies \gamma_i = 0 \implies g = 0
$$
以上より、有限要素$\kappa$はunisolvencyである。
Q.E.D.


さて、以上の証明は有限要素がunisolvencyであることを確認するための方法を示してくれている。
つまり、多項式空間の適当な基底を集めてきて、行列$\bm{L}$を構成し、その行列が可逆であることを確認すれば良い。また、$\delta-$propertyをもつ多項式を構成するための、実際の係数行列$A$の値も行列$\bm{L}$の逆行列を計算することで求めることができる。

#### example (unisolvencyではない)
$K=[-1, 1]^2$の正方形領域を考える。
ここで、多項式空間$P$は以下の元で張られる空間であるとする。
$$
P = \mathrm{span}\{1, x_1, x_2, x_1x_2\}
$$
(ここで、$x_1, x_2$はそれぞれいわゆる$x, y$座標を表す。  
また、多項式空間の元$g\in P$は適当な係数の線形和となる。  
例えば、$g(x_1, x_2) = 1 + 2x_1 + 3x_2 + 4x_1x_2$のように表現できる。  
また、$(x_1, x_2) = (-1, -1)$のとき、$g(-1, -1) = (1, -1, -1, 1)\cdot(1,2,3,4)$のように表現できることにも留意すべきである。前がLとなり、後ろが係数となる。
)  
また、自由度$\Sigma$は$[-1, 0], [1, 0], [0, 1], [0, -1]$で値を持つとする。
$$
\begin{aligned}
L_1(g) &= g(-1, 0) \\
L_2(g) &= g(1, 0) \\
L_3(g) &= g(0, 1) \\
L_4(g) &= g(0, -1)
\end{aligned}
$$
このとき、有限要素$\kappa = (K, P, \Sigma)$はunisolvencyであるかどうかを考える。
この場合、行列$\bm{L}$は以下のようになる。
$$
\bm{L} = \begin{pmatrix}
1 & -1 & 0 & 0 \\
1 & 1 & 0 & 0 \\
1 & 0 & 1 & 0 \\
1 & 0 & -1 & 0
\end{pmatrix}
$$
これは可逆ではない。
よって、有限要素$\kappa$はunisolvencyではないし、$\delta$-propertyを持つ基底も存在しない。

#### example (unisolvencyである)
区間$K_a = (-1, 1)$、$K_a$上の$p$次多項式空間$P_a=P^p(K_a)$について考える。  
$K_a$を$N_p = p+1$個の(幾何学的な)点($-1 = X_1 < X_2 <\cdots < X_{N_P} = 1$)で被膜するすることを考える。  
これらの点は慎重に選ばれなければならない。
というのも、それらの点の分布が基底関数を決め、結果的に離散問題の条件をを決めるからである。  
自由度を以下のように定義する。
$$
\begin{aligned}
\Sigma_a &= \{L_1, L_2, \ldots, L_{N_P}\},\ L_i : P_a \rarr \mathbb{R} \\
L_i(g) &= g(X_i),\ \forall g \in P_a,\ i=1,2,\ldots,N_P
\end{aligned}
$$

明らかに$L_i$は線形写像である。  
(多項式$g+f$について$L_i(g+f)=g(X_i) + f(X_i)=L_i(g) + L_i(f)$と定義できるから)  
$\forall g \in P_a$は以下を充たす。  
(例えば$3$次方手式$=0$となる点は$3$つしか無い。一般に$p$次多項式の根は$p$個である。$p+1$個の点があるとき、$p$次多項式は$0$となる。)
$$
g(X_1) = g(X_2) = \ldots = g(X_{N_P}) = 0 \implies g = 0
$$
よって、有限要素$\kappa_a = (K_a, P_a, \Sigma_a)$はunisolvencyである。

<!-- 先程の例と同じように感じるかもしれないが、この場合は$p+1$個の点に対して$p$次多項式(最高次数が$p$である多項式)を考えている。 -->
<!-- 先程の例は$4$つの点に対して$2$次多項式を考えていた。 -->

$\delta-$propertyを充たす空間$P_a$の基底を構成するのは簡単である。
1Dの場合、ラグランジュの補間多項式が利用できるため、線形方程式を解く必要さえない。
高次元の場合の頂点要素も同じ方法で構成できる。
例えば、$\mathrm{dim}(T) = 2$の正三角形$T$と$T$上の$p$次多項式空間$P_T = P^p(T)$について考える。
$T$を$N_P = \frac{(p+1)(p+2)}{2}$個Gauss-Lobatto点$X_1, X_2, \ldots, X_{N_p}$でカバーすることを考える。
$\delta-$propertyを充たす基底関数は$N_p\times N_p$の行列$\bm{L}$の逆行列を計算することで求められる。(証明した通り)
頂点の値に基づいた有限要素は$h-$adaptiveな要素の構築にも利用できることで有名である。


#### example (unisolventな階層要素)
他の有限要素の設計に対する重要なアプローチとして階層形状関数の適用がある。
領域$K$と$N_p$次元の最大次数$p$の多項式空間$P$とし、  
多項式空間$P$の階層基底$\mathcal{B}^p=\set{\theta_1, \theta_1, \ldots, \theta_ {N_p}}$について考える。  
階層基底とは任意の$p$に対して  
$$
\mathcal{B}^p \subset \mathcal{B}^{p+1}
$$
を充たす基底のことである。
あらゆる多項式$g\in P$は以下の線形和で表現できる。
$$
g = \sum_{i=1}^{N_p}\beta_i\theta_i = \sum_{i=1}^{N_p}L_i(g)\theta_i
$$
ここで、$\beta_i$は実数値係数を表し、$L_i(g)=\beta_i$である。

明らかに、$\Sigma = \set{L_1, L_2, \ldots, L_{N_p}}$の選択によって有限要素$\kappa = (K, P, \Sigma)$はunisolvencyとなり、$\mathcal{B}$は$\delta-$propertyを持つ。

階層要素では頂点要素よりも簡単に非均一な次数の多項式近似を扱うことができる。
つまり、$p$-や$hp$-adaptiveでの適用を可能にする。

## 有限要素メッシュ
対象の問題を研究するためにリプシッツ連続境界を持つ領域$\Omega$を考える。これはその境界が区分多項式であるような計算領域$\Omega_h$で近似される。

> *def* : 有限要素  
> 区分多項式をもつ領域$\Omega_h \sub \mathbb{R}^d$上における有限要素$\mathcal{T}_ {h,p} = \set{K_1, K_2, \ldots, K_M}$は$\Omega_h$の幾何学的分割である。
> 有限要素は$\Omega_h$を有限個の非交差な開集合ポリゴンセル$K_i$に分割する。
> $$
> \Omega_h = \bigcup_{i=1}^M \bar{K_i}
> $$
> 
> それらのセル$K_i, \ 1 \ge i \ge M$は次数$1 \ge p(K_i)=p_i$の多項式が備え付けられている。

> *def* : ハイブリッドメッシュ  
> 様々なセルのタイプが結合されているとき、メッシュはハイブリッドメッシュと呼ばれる。

*def* : 正則メッシュ
任意の２つの要素$K_i, K_j, \ i\neq j$に対して、次の一つの条件のどれかを充たすならば、そのメッシュを正則メッシュと呼ぶ。

- $\bar{K_i} \cup \bar{K_j} = \emptyset$
- $\bar{K_i} \cup \bar{K_j}$は単一共通の頂点を持つ。
- $\bar{K_i} \cup \bar{K_j}$は単一共通の辺を持つ。
- $\bar{K_i} \cup \bar{K_j}$は単一共通の面を持つ。


## 有限要素補間と適合性
### 参照領域と参照写像
### 有限要素の離散化
