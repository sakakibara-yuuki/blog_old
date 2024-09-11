---
title: "辺形状関数を用いた電磁場解析"
author: "sakakibara"
description: "うまくいかないことなんてねぇ"
heroImage: "/science/science.jpg"
pubDate: 2024-03-18
tags: ["math", "fem", "有限要素法", "電磁場解析", "数値解析"]
---


# 電磁界解析
マクスウェル方程式を手で解く人はいない。  
解析的に解けないケースがほとんどだからだ。
実際に電磁界解析を行おうと思うとコンピュータによる数値解析が必須になってくる。
だが、電磁界解析を行うソフトは非常に高価で数100万~数1000万程度の金かかる。
それにカスタマイズ性も低く、使いこなすのに練度が必要となる。

そこで、自前の電磁界解析プログラムを作成して、様々な実験を行う。

以下ではどのようにしてマクスウェル方程式を数値解析に落とし込むか。
より具体的に言えばどのようにして微分方程式を行列計算に落とし込むかについて説明する。

## Contents
## 重み付き残差法
### 内積
内積という概念が広いことを知っている人は多いだろう。
$$
\langle\cdot \rangle: V\times V \rightarrow \mathbb{R}
$$
$a, b, c \in V$, $\alpha \in \mathbb{R}$について以下が成り立つなら演算子$\langle\cdot\rangle$を内積という。
$$
\begin{aligned}
\text{(正値性)}&\  \langle a\cdot a \rangle \ge 0\ \land\ \langle a\cdot a \rangle = 0 \implies a = 0 \\
\text{(対称性)}&\  \langle a\cdot b \rangle = \langle b \cdot a \rangle \\
\text{(多重線形性)}&\  \alpha \langle a \cdot b \rangle = \langle \alpha a \cdot b \rangle \\
&\  \langle a + b \cdot c \rangle = \langle a \cdot c \rangle + \langle b \cdot c \rangle
\end{aligned}
$$
複素数を前提とした定義もあるが、あまり使用しないので今回は以上を満たす演算$\langle \cdot \rangle$を内積とする。

内積という概念は距離の概念を拡張したものと取られられている。
これは関数としての距離が内積の定義に含まれるからである。

### 残差を求める方法
ベクトル空間$V$、$f : V\rarr V$とする。  
$\bm{a}, \bm{b} \in V$にたいして
$$
f(\bm{a}) = \bm{b}
$$
以上のような関数を考える。ここで$f, \bm{b}$を既知として$\bm{a}$を求めたいがどのようにすればよいだろうか。  
最初に考得られる手段が最小二乗法である。  
$\bm{a}'$を$\bm{a}$の近似解とする。以下で定義する$\bm{R}$を残差という。
$$
\bm{R} = \bm{b} - f(\bm{a}')
$$
最小二乗法は残差の二乗和(内積)を最小にするような近似解$\bm{a}'$を$\bm{a}$とする手法である。
$$
\bm{a} = \min_{\bm{a'}} \big(\langle\bm{R}(\bm{a}')\cdot\bm{R}(\bm{a}')\rangle\big)
$$

残差の二乗を最小にするベクトルが解であるというのは非常に直感的だが、この他にこれに近い考えとして重み付き残差法というのものがある。

$$
0 = \langle\bm{w}\cdot\bm{R}(\bm{a}')\rangle
$$
ここで$\bm{w}$は重み関数と呼ばれる関数で、この種類によって様々なバリエーションが生まれる。

### ガラーキン法
ベクトル空間$V$が基底$\langle \bm{N}_ 1, \bm{N}_ 2, \ldots, \bm{N}_ E \rangle$によって生成されているとする。
$\bm{a}\in V$について以下が成り立つ。
$$
\bm{a} = \sum a_e \bm{N}_ e
$$
そこで、重み付き残差法における$\bm{w}$を$\bm{N}_ e$とすると、
$$
0 = \langle\bm{N}_ e\cdot\bm{R}(\bm{a}')\rangle
$$
が得られる。  
$\bm{N}_ e$が$E$個あるため方程式が$E$個得られる。
これにより$E$個の$a_e$を変数とする方程式が得られるため、行列で計算できる。
ガラーキン法の特徴として残差が基底により生成する空間の直交空間となることである。

## 有限要素法
有限要素法とは対象(これを$M$とする。)を複数の要素(または有限要素)と呼ばれる領域に分割して、各領域で物理量を補間することにより実際の現象をシミュレーションする手法のことだ。
分割された要素は$2$次元であれば三角形や四角形であったり、$3$次元であれば四面体、六面体、プリズム、などに分割される。基本的に分割が細ければ細かいほどシミュレーションとしての精度は向上するが、計算コストが増大する。  
また、要素内における物理量の補間に関しても1次補間、2次補間、...といった分類やラグランジュ補間、ルジャンドル補間などの補間手法による分類などががある。

今回は最も単純な四面体要素、1次ラグランジュ補間について解説する。

## A-$\phi$法
<!-- 対象$M$を四面体で分割し、その要素一つを$m$としよう。 -->
よく知られたようにマクスウェル方程式は以下の４つの式で表される。
$$
\begin{align}
\mathrm{div}\bm{D} &= \rho
\mathrm{div}\bm{B} &= 0
\mathrm{rot}\bm{E} &= -\frac{\partial \bm{B}}{\partial t}
\mathrm{rot}\bm{H} &= \bm{J}+\frac{\partial \bm{D}}{\partial t}
\end{align}
$$
ただし、適当なテンソル$\epsilon, \mu, \sigma$を用いて
$$
\bm{D} = \epsilon \bm{E}
\bm{B} = \mu \bm{H}
\bm{J} = \sigma \bm{E} + \bm{J}_ {source}
$$
のような関係がある。

磁束密度$\bm{B}$はベクトル・ポテンシャルにより表現することもできる。
ベクトル・ポテンシャルを$\bm{A}$とすると。
$$
\bm{B} = \mathrm{rot}(\bm{A} + \mathrm{grad}\chi)
$$
のように表現できる。実質的に$\bm{B}$の値を決定しているのは$\bm{A}$であるが、
$\mathrm{rot}$の演算は$\mathrm{grad}$を$0$にするために$\mathrm{grad}\chi$の分だけ自由度が残る。
これをゲージ自由度という。
これを$3$つめの式に代入すると
$$
\begin{align}
\mathrm{rot}\bm{E} &= -\frac{\partial \bm{B}}{\partial t} \\
&= -\frac{\partial}{\partial t}\mathrm{rot}(\bm{A} + \mathrm{grad}\chi) \\
&= -\mathrm{rot}(\frac{\partial \bm{A}}{\partial t} + \frac{\partial}{\partial t}\chi)
\end{align}
$$
より
$$
\mathrm{rot}(\bm{E} + \frac{\partial \bm{A}}{\partial t} + \frac{\partial}{\partial t}\chi) = \bm{0}
$$
これにより(ヘルムホルツの原理)、
$$
\bm{E} + \frac{\partial \bm{A}}{\partial t} + \frac{\partial}{\partial t}\chi = \mathrm{grad}\chi'
$$

$$
\bm{E} = -\frac{\partial \bm{A}}{\partial t} - \frac{\partial}{\partial t}\chi + \mathrm{grad}\chi'
$$

ここでも$\chi, \chi'$の分だけ不定となる。
この不定を決定することによりさまざまなパターンのベクトル・ポテンシャルが定義できる。
不定の値を様々にチューニングしてベクトル・ポテンシャル間を変換することをゲージ変換という。
逆にマクスウェル方程式はゲージ変換の元で普遍な理論という見方もできる。
(実用上、計算がしやすくなる以上の意味は見いだせない。)


以降の有限要素法では$\chi=0$, $\chi' = \frac{\partial \phi}{\partial t}$とする。つまり
$$
\begin{aligned}
\bm{B} &= \mathrm{rot}\bm{A} \\
\bm{E} &= -\frac{\partial \bm{A}}{\partial t} + \mathrm{grad}\frac{\partial \phi}{\partial t}
\end{aligned}
$$
を選択する。
したがって。
$$
\begin{aligned}
\bm{J} &= \sigma\bm{E} + \bm{J}_ {source} \\
&= -\sigma\frac{\partial \bm{A}}{\partial t} - \mathrm{grad}\sigma\frac{\partial \phi}{\partial t} + \bm{J}_ {source}
\end{aligned}
$$

少しだけ注意すべきは$\bm{E}$の第二項が$\frac{\partial \phi}{\partial t}$となっていることである。
多くの参考資料ではこの代わりに$\bm{E} = -\frac{\partial \bm{A}}{\partial t} + \bm{\phi}$となっていることがおおいだろう。

さて、これまでの$\bm{A}, \frac{\partial \phi}{\partial t}$の導入から式$3$を満たすことは自明である。
式$4$について考える。
$$
\begin{aligned}
\mathrm{rot}\bm{H} &= \bm{J}+\frac{\partial \bm{D}}{\partial t} \\
\mathrm{rot}\mu^{-1}\bm{B} &= \bm{J}+\epsilon\frac{\partial \bm{E}}{\partial t} \\
\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} &= \bm{J}-\epsilon\frac{\partial^2 \bm{A}}{\partial t^2} + \epsilon\mathrm{grad}\frac{\partial^2 \phi}{\partial t^2} \\
\end{aligned}
$$
これ以上の式変形は不要に複雑になるのでここで留めておこう。

有限要素法では右辺第二項以降を無視することが多い。
これは準静的過程(quasi-static)と呼ばれる。英語名が不思議なので検索に意外と引っかからない。
第二項を無視できる条件は周波数と誘電率と伝導率が関わるが、大体無視できるのでよい。

$$
\begin{aligned}
\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} &= \bm{J} \\
\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} &= -\sigma\frac{\partial \bm{A}}{\partial t} - \sigma\mathrm{grad}\frac{\partial \phi}{\partial t} + \bm{J}_ {source} \\
\end{aligned}
$$
少し整理して
$$
\begin{equation}
\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} + \sigma\frac{\partial \bm{A}}{\partial t} + \sigma\mathrm{grad}\frac{\partial \phi}{\partial t} = \bm{J}_ {source} \tag{eq:$A-\phi$}
\end{equation}
$$
有限要素法ではこの式$(eq:A-\phi)$を解く。

### 補間と形状関数
位置次元$\mathbb{R}$上で定義された実数値関数$f(x)$について, $f(x_1), f(x_2), \ldots, f(x_n)$が与えれているとする。この元の関数$f(x)$はどのような関数だろうか？

単純な考えとして、実数値関数$f(x)$を多項式$p_{n-1}(x)$で近似する方法だ。
$$
\begin{aligned}
p_{n-1}(x) &= a_0 + a_1 x + a_2 x^2 + a_3 x^3 \cdots + a_{n-1} x^{n-1} \\
&\simeq f(x)
\end{aligned}
$$
このような関数を補間する多項式のことを補間多項式と呼ぶ。
のように表現して連立方程式を解く方法が考えられる。
$$
\begin{pmatrix}
f(x_1) \\
f(x_2) \\
\vdots \\
f(x_n)
\end{pmatrix}

=

\begin{pmatrix}
1 & x_1 & x_1^2 & \cdots & x_1^{n-1} \\
1 & x_2 & x_2^2 & \cdots & x_2^{n-1} \\
&&&\vdots& \\
1 & x_{n-1} & x_{n-1}^2 & \cdots & x_{n-1}^{n-1} \\
\end{pmatrix}

\begin{pmatrix}
a_0 \\
a_1 \\
\vdots \\
a_{n-1} 
\end{pmatrix}
$$
この真ん中の行列はヴァンデルモンドの行列として行列式が非常にきれいに求められることが知られている。(可逆である。)
この解法に見られる特徴として、$f(x_i)=p(x_i)$となっている点である。これは補間という考えで非常に重要な性質である。

実際にこれは最もシンプルな方法であり、計算もうまくことが知られている。
ただし、これは計算コストが高いことが知られている。(LU分解ができない)

もっとうまいやり方がある。

それは以下のような補間多項式を用いる方法だ。

$$
p_{2}(x) = f(x_1)L_1(x) + f(x_2)L_2(x) + f(x_3)L_3(x)
$$
ただし、$L_i$は$2$次の多項式であり以下を満たす。
$$
L_i(x_j) = 
\begin{cases}
1 & \text{if } (i = j) \\
0 & \text{if } (i \neq j)
\end{cases}
$$

補間多項式は$3$つの項で表されているが、実際には$2$次の多項式となる。
この関数$\phi_i$を用いる補間をラグランジュ補間と呼ぶ。  
これをヴァンデルモンドを用いる方法で再び示してみよう。
$$
\begin{pmatrix}
p(x_1) \\
p(x_2) \\
\vdots \\
p(x_n)
\end{pmatrix}

=

\begin{pmatrix}
L_1(x_1) & 0 & \cdots & 0 \\
0 & L_0(x_0) & \cdots & 0 \\
\vdots&&&\vdots&\\
0 & 0 & \cdots & L_{n}(x_n)\\
\end{pmatrix}

\begin{pmatrix}
f(x_1) \\
f(x_2) \\
\vdots \\
f(x_n)
\end{pmatrix}
$$
このようにヴァンデルモンドを使用していた部分が単位行列になる。  
このラグランジュ補間は$n$個の標本点に対して$n-1$次の多項式を構成する。
**最終的に得られる補間多項式は形式的には(展開すれば)、上で挙げたヴァンデルモンドの方程式と変わらない。
$L_i(x_j)$のように標本点で$1$となるような$n-1$次の多項式を基底関数に用いた補間多項式は一意に定まる。**
つまり、ヴァンデルモンドの行列を計算して導出しても、ラグランジュ補間を用いて導出した補間多項式しても、結果的に得られる補間多項式は同じである。  
今回の場合は、これらは具体的に以下のように書き下せる。
$$
\begin{aligned}
L_1(x) = \frac{(x - x_2)(x - x_3)}{(x_1 - x_2)(x_1 - x_3)} \\
L_2(x) = \frac{(x - x_1)(x - x_3)}{(x_2 - x_1)(x_2 - x_3)} \\
L_3(x) = \frac{(x - x_1)(x - x_2)}{(x_3 - x_1)(x_3 - x_2)}
\end{aligned}
$$
また、これらの関数は互いに直交することがわかる。(部分積分をしてみればすぐに気づく。どのみち$x_i$を代入すれば$0$になるため)

まとめる。  
一般に$n-1$次の多項式は
$$
p_{n-1}(x) = f(x_1)L_1(x) + f(x_2)L_2(x) + \cdots + f(x_{n})L_{n}(x)
$$
ただし、$L_i(x_j)$は以下を満たす$n-1$次多項式である。
$$
L_i(x_j) = 
\begin{cases}
1 & \text{if } (i = j) \\
0 & \text{if } (i \neq j)
\end{cases}
$$

標本点を多く取れば取るほど精度が高くなると考えられる。しかし、ラグランジュ補間は急峻な関数を近似する際、標本点を多く取ると多項式補間が振動する現象(ルンゲ現象)を引き起こすことが知られている。

(なんと、この関数は1779年に考え出されたものらしい。しかも発案者はラグランジュではなく、エドワード・ワーリングという人らしい。)

<!-- ### ガウス型積分 -->
### 要素内補間
対象$M$のある$3$次元四面体要素を$m$とする。
$m$内の物理量$\phi$を補間する方法について考える。予め名前をつけておくが、要素内の点における物理量はたいていある関数の線形和で表される。その関数を形状関数とか基底関数などと呼ばれる。
$m$は$4$つの頂点と$6$つの辺と$4$つの面を持つ。
$4$つの頂点に$\phi(\bm{x}_ 0), \phi(\bm{x}_ 1), \phi(\bm{x}_ 2), \phi(\bm{x}_ 3)$が割てられているとする。この定数をそれぞれ$\phi_0, \phi_1, \phi_2, \phi_3$とする。

四面体全体の体積を$V$とし、頂点$i$を除く頂点と要素$m$内の点$\bm{x}$で構成される四面体の体積$V_i(\bm{x})$を考える。
$$
L_i(\bm{x}) = \frac{V_i(\bm{x})}{V}
$$
とする。
このように$L_i(\bm{x})$を定義することで
$$
L_i(\bm{x}_ j) = 
\begin{cases}
1 & \text{if } (\bm{x}_ i = \bm{x}_ j) \\
0 & \text{if } (\bm{x}_ i \neq \bm{x}_ j)
\end{cases}
$$
を実現できる。  
<!-- そこで、局所座標$(L_0, L_1, L_2, L_3)$を考える。   -->
<!-- この線形和、$1$次の多項式を考える。 -->
$$
\phi(\bm{x}) = \phi_0L_0(\bm{x}) + \phi_1L_1(\bm{x}) + \phi_2L_2(\bm{x}) + \phi_3L_3(\bm{x})
$$
を考える。

ここで$4$つの標本点$(\bm{x_0}, \phi_0), (\bm{x_1}, \phi_1), (\bm{x_2}, \phi_2), (\bm{x_3}, \phi_3)$があるなら3次の多項式が得られるのではないか？という疑問が浮上する。

実際に、最初の考えに立ち返ってみる。
$$
\phi(\bm{x}) = a_0 + ax + by + cz
$$
ここで$a_0, a, b, c$の$4$つを変数とするために$4$つの式が必要となる。
そしてそれは$4$つの標本点によって構成できる。
そう。つまり単純に$n$個の標本点があれば$n-1$次補完多項式を定義できるというわけではない。
多次元の空間を考える場合には少し複雑になる。

以上によって$1$次式で表される$L_i(\bm{x})$を用いて$\phi(\bm{x})$をラグランジュ補間することができる。

頂点$i$に標本点をもつ補間の基底関数を**節点形状関数**$\omega_i$という。
この他にも辺$e$に標本点をもつ補間の基底関数を**辺形状関数**$\bm{N}_ e$、面$f$に標本点をもつ補間の基底関数を**面形状関数**$M_f$という。
そしてこれら形状関数は以下を要請する。
$$
\begin{aligned}
\omega_ i({\bm{x}_ j}) &= \delta_{ij} \\
\int_e\bm{N}_ e\mathrm{d}\bm{l}_ {e'} &= \delta_{ee'} \\
\iint_f M_f \mathrm{d}\bm{S}_ {f'} &= \delta_{ff'}
\end{aligned}
$$

なぜ辺形状関数などを使うのかというと連続に関する制限を締め付けないためにある。
頂点形状関数のみだと要素の節点での値が連続であることを要請する。
しかし辺形状関数だとその辺の対角にある面(その辺を含まない面)でのみ接線方向で連続となる。
この性質は媒質の境界面で物性が階段的に変化するような対象をシミュレーションする際に有効となる。
たとえば、空気と鉄を有限要素にりシミュレーションする際、空気の要素と鉄の要素が面をまたいで要素分割されるのであれば、面の垂直方向(面の法線方向)での連続性は考慮しなくて済む。

(さすがに文字だけではイメージできないので図を載せたい。)

面形状関数についてはよく知らない。

ともかく以上のような理由から電磁ベクトル・ポテンシャルの解析には辺形状関数を用いることが多い。

そこで要素$m$内におけるベクトルポテンシャル$\bm{A}$を次のように辺形状関数$\bm{N}_ e$を用いて補間したい。
$$
\bm{A}(\bm{x}) = \sum_{e\in \mathrm{Edge}}A_e\bm{N}_ e(\bm{x})
$$
ベクトル・ポテンシャルはその法線方向(垂直方向)には一般には不連続性を要求するからである。
(これは異なる透磁率をもつ物体において磁束密度$\bm{B}$が境界面に垂直方向で連続であり、接線方向では一般に不連続であることからくる。$\bm{B} = \mathrm{rot}\bm{A}$として表されるのでベクトル$\bm{A}$は境界面の垂直方向には不連続であり、境界面の接線方向には連続である。(ストークスの定理より))

電磁ポテンシャル(まぁ、電位)は節点形状関数$L_i$を用いて補間する。
$$
\phi(\bm{x}) = \sum_{n \in {Node}}\phi_i L_i(\bm{x})
$$

ここで何食わぬ顔で$\omega_i$をテクニカルに微分しよう。
$$
\begin{aligned}
\nabla \omega_i &= \nabla \omega_i \sum \omega_j - \omega_i \nabla \sum \omega_j \\
&= \sum_j (\omega_j \nabla \omega_i - \omega_i \nabla \omega_j)
\end{aligned}
$$
ここで勾配・回転・発散の資料を参考にしてほしいのだが、勾配行列$G$を用いると
$$
\nabla \omega_i = \sum G_{ki} \bm{N}_ k
$$
が得られる。
そこで頂点$i$から頂点$j$へ向かう辺$k$の辺形状関数$\bm{N}_ k$を
次のように定義する。
$$
\bm{N}_ k = \omega_i \nabla \omega_j - \omega_j \nabla \omega_i
$$
このように定義すると
$$
\begin{aligned}
\nabla \omega_i &= \nabla \omega_i \sum \omega_j - \omega_i \nabla \sum \omega_j \\
&= \sum_j -(\omega_i \nabla \omega_j - \omega_j \nabla \omega_i) \\
&= \sum_k G_{ki}\bm{N}_ k
\end{aligned}
$$
第二項は辺$k$が頂点$i$から出ていって、頂点$j$へ入っているのでこのようになる。  
そしてこれは勾配行列と頂点形状関数の関係を充たす。  

(辺形状関数の導出がテクニカルすぎるって？
俺もそーおもう)

辺形状関数の$\mathrm{rot}$については辺形状関数を以上のように定義したことにより非常に計算しやすくなる。
$$
\begin{aligned}
\mathrm{rot}\bm{N}_ k &= \mathrm{rot}(\omega_i \nabla \omega_j - \omega_j \nabla \omega_i) \\
                      &= \nabla \times (\omega_i \nabla \omega_j - \omega_j \nabla \omega_i) \\
                      &= \nabla \omega_i \times \nabla \omega_j + \omega_i \nabla \times \nabla \omega_j \\
                      &-(\nabla \omega_j \times \nabla \omega_i + \omega_j \nabla \times \nabla \omega_i) \\
                      &= \nabla \omega_i \times \nabla \omega_j + \omega_i \mathrm{rot}(\mathrm{grad}(\omega_j)) \\
                      &-(\nabla \omega_j \times \nabla \omega_i + \omega_j \mathrm{rot}(\mathrm{grad}(\omega_i)) \\
                      &= 2 \nabla \omega_i \times \nabla \omega_j
\end{aligned}
$$
$\mathrm{rot}\mathrm{grad} = 0$となることに気をつけると良い。
結果的に
$$
\mathrm{rot}\bm{N}_ k = 2 \nabla \omega_i \times \nabla \omega_j
$$
### 座標の変換と全体行列
有限要素法では必ず座標の変換が必要になる。
$$
\begin{pmatrix}
\frac{\partial}{\partial\xi_1} \\
\frac{\partial}{\partial\xi_2} \\
\frac{\partial}{\partial\xi_3} \\
\end{pmatrix}

=

\begin{pmatrix}
\partial_{\xi_1} \\
\partial_{\xi_2} \\
\partial_{\xi_3} \\
\end{pmatrix}
,
\begin{pmatrix}
\frac{\partial}{\partial x} \\
\frac{\partial}{\partial y} \\
\frac{\partial}{\partial z} \\
\end{pmatrix}

=

\begin{pmatrix}
\partial_{x} \\
\partial_{y} \\
\partial_{z} \\
\end{pmatrix}
$$
とする。
$$
\begin{pmatrix}
\partial_{\xi_1} \\
\partial_{\xi_2} \\
\partial_{\xi_3} \\
\end{pmatrix}

=
\begin{pmatrix}
\frac{\partial x}{\partial \xi_1} & \frac{\partial y}{\partial \xi_1} & \frac{\partial z}{\partial \xi_1} \\
\frac{\partial x}{\partial \xi_2} & \frac{\partial y}{\partial \xi_2} & \frac{\partial z}{\partial \xi_2} \\
\frac{\partial x}{\partial \xi_3} & \frac{\partial y}{\partial \xi_3} & \frac{\partial z}{\partial \xi_3} \\
\end{pmatrix}
\begin{pmatrix}
\partial_{x} \\
\partial_{y} \\
\partial_{z} \\
\end{pmatrix}
$$
ここで、行列
$$
J = 
\begin{pmatrix}
\frac{\partial x}{\partial \xi_1} & \frac{\partial y}{\partial \xi_1} & \frac{\partial z}{\partial \xi_1} \\
\frac{\partial x}{\partial \xi_2} & \frac{\partial y}{\partial \xi_2} & \frac{\partial z}{\partial \xi_2} \\
\frac{\partial x}{\partial \xi_3} & \frac{\partial y}{\partial \xi_3} & \frac{\partial z}{\partial \xi_3} \\
\end{pmatrix}
$$
とする。

### 全体行列
有限要素法では以下のような行列を計算することがある。
$$
\begin{aligned}
& \mathrm{rot}\bm{N}_ e \cdot \mathrm{rot}\bm{N}_ {e'} \\
& \bm{N}_ e \cdot \bm{N}_ {e'} \\
& \nabla \omega_i \cdot \bm{N}_ e \\
& \nabla \omega_i \cdot \nabla \omega_j \\
\end{aligned}
$$
ただし、以上での$\mathrm{rot}, \nabla$は全て$(x, y, z)$においての微分である。
これを予め計算しやすくしておこう。
そのためには座標変換に注意する必要がある。
先に結果を示すと、
$$
\begin{align}
\mathrm{rot}\bm{N}_ e \cdot \mathrm{rot}\bm{N}_ {e'} &= 4\{\langle\nabla_{\xi} \omega_i \cdot \nabla_{\xi} \omega_{i'}\rangle\langle\nabla_{\xi} \omega_j \cdot \nabla_{\xi} \omega_{j'}\rangle \nonumber \\
&- \langle\nabla_{\xi} \omega_i \cdot \nabla_{\xi} \omega_{j'}\rangle\langle\nabla_{\xi} \omega_j \cdot \nabla_{\xi} \omega_{i'}\rangle \} \\
\bm{N}^{x}_ e \cdot \bm{N}^{x}_ {e'} &= \langle \bm{N}^{\xi}_ e \cdot \bm{N}^{\xi}_ {e'} \rangle \\
\nabla \omega_i \cdot \bm{N}_ e &= \langle\nabla_{\xi}\omega_i\cdot \bm{N}^{\xi}_ e\rangle \\
\nabla \omega_i \cdot \nabla \omega_j &= \langle\nabla_{\xi}\omega_i\cdot\nabla_{\xi}\omega_j\rangle \\
\end{align}
$$
となる。

#### $\mathrm{rot}\bm{N}_ e \cdot \mathrm{rot}\bm{N}_ {e'}$
$$
\mathrm{rot}\bm{N}_ {e} = 2\nabla \omega_i \times \nabla \omega_j
$$
のように書けることは既に述べた。
ここで、ベクトル4重積を紹介する。
$$
(A\times B)\cdot(C\times D) = (A\cdot C)(B\cdot D) - (A\cdot D)(B\cdot C)
$$
これを用いて、$\mathrm{rot}\bm{N}_ e \cdot \mathrm{rot}\bm{N}_ {e'}$を計算する。
$$
\begin{aligned}
\mathrm{rot}\bm{N}_ e \cdot \mathrm{rot}\bm{N}_ {e'} &= 2(\nabla \omega_i \times \nabla \omega_j)\cdot 2(\nabla \omega_{i'} \times \nabla \omega_{j'}) \\
&= 4(\nabla \omega_i \times \nabla \omega_j)\cdot (\nabla \omega_{i'} \times \nabla \omega_{j'}) \\
&= 4\{(\nabla \omega_i \cdot \nabla \omega_{i'})(\nabla \omega_j \cdot \nabla \omega_{j'}) - (\nabla \omega_i \cdot \nabla \omega_{j'})(\nabla \omega_j \cdot \nabla \omega_{i'}) \} \\
&= 4\{(\nabla \omega_i \cdot \nabla \omega_{i'})(\nabla \omega_j \cdot \nabla \omega_{j'}) - (\nabla \omega_i \cdot \nabla \omega_{j'})(\nabla \omega_j \cdot \nabla \omega_{i'}) \} \\
\end{aligned}
$$
ここで、係数を無視した以下を考える。また、$\nabla = J^{-1}\nabla_{\xi}$であり、
$$
\begin{aligned}
\nabla\omega_i \cdot \nabla \omega_j &= (\nabla\omega_i)^T(\nabla \omega_j) \\
& = (J^{-1}\nabla_{\xi}\omega_i)^T(J^{-1}\nabla_{\xi}\omega_j) \\
& = (\nabla_{\xi}\omega_i)^T(J^{-T}J^{-1})\nabla_{\xi}\omega_j \\
& = (\nabla_{\xi}\omega_i)^T(JJ^{T})^{-1}\nabla_{\xi}\omega_j \\
& = (\nabla_{\xi}\omega_i)^Tg^{-1}\nabla_{\xi}\omega_j \\
\end{aligned}
$$
ここで、$g = JJ^{T}$とする。
である。
また、$\langle \bm{a} \cdot \bm{b} \rangle = \bm{a}^{T}g^{-1}\bm{b}$とする。
$$
\begin{aligned}
(\nabla \omega_i \times \nabla \omega_j)\cdot (\nabla \omega_{i'} \times \nabla \omega_{j'}) &= (\nabla \omega_i \cdot \nabla \omega_{i'})(\nabla \omega_j \cdot \nabla \omega_{j'}) \\
&- (\nabla \omega_i \cdot \nabla \omega_{j'})(\nabla \omega_j \cdot \nabla \omega_{i'}) \\
&= \langle\nabla_{\xi} \omega_i \cdot \nabla_{\xi} \omega_{i'}\rangle\langle\nabla_{\xi} \omega_j \cdot \nabla_{\xi} \omega_{j'}\rangle \\
&- \langle\nabla_{\xi} \omega_i \cdot \nabla_{\xi} \omega_{j'}\rangle\langle\nabla_{\xi} \omega_j \cdot \nabla_{\xi} \omega_{i'}\rangle \\
\end{aligned}
$$
よって、
$$
\begin{aligned}
\mathrm{rot}\bm{N}_ e \cdot \mathrm{rot}\bm{N}_ {e'} &= 4\{\langle\nabla_{\xi} \omega_i \cdot \nabla_{\xi} \omega_{i'}\rangle\langle\nabla_{\xi} \omega_j \cdot \nabla_{\xi} \omega_{j'}\rangle \\
&- \langle\nabla_{\xi} \omega_i \cdot \nabla_{\xi} \omega_{j'}\rangle\langle\nabla_{\xi} \omega_j \cdot \nabla_{\xi} \omega_{i'}\rangle \}\\
\end{aligned}
$$
となる。

#### $\bm{N}_ e \cdot \bm{N}_ {e'}$
$$
\begin{aligned}
\bm{N}^{x} &= \omega_i \nabla \omega_j - \omega_j \nabla \omega_i \\
\bm{N}^{\xi} &= \omega_i \nabla_{\xi} \omega_j - \omega_j \nabla_{\xi} \omega_i \\
\bm{N}^{x} &= J^{-1}\bm{N}^{\xi}
\end{aligned}
$$
であるとする。
$$
\begin{aligned}
\bm{N}^{x}_ e \cdot \bm{N}^{x}_ {e'} &= (\bm{N}^{x}_ e)^{T}\bm{N}^{x}_ {e'} \\
&= (J^{-1}\bm{N}^{\xi}_ e)^{T}J^{-1}\bm{N}^{\xi}_ {e'} \\
&= (\bm{N}^{\xi}_ e)^{T}J^{-T}J^{-1}\bm{N}^{\xi}_ {e'} \\
&= (\bm{N}^{\xi}_ e)^{T}(JJ^{T})^{-1}\bm{N}^{\xi}_ {e'} \\
&= (\bm{N}^{\xi}_ e)^{T}g^{-1}\bm{N}^{\xi}_ {e'} \\
&= \langle \bm{N}^{\xi}_ e \cdot \bm{N}^{\xi}_ {e'} \rangle
\end{aligned}
$$
となる。

### $\nabla \omega_i \cdot \bm{N}_ e$
$$
\begin{aligned}
\nabla \omega_i \cdot \bm{N}_ e &= J^{-1}\nabla_{\xi}\omega_i \cdot J^{-1}\bm{N}^{\xi}_ e \\
&= (J^{-1}\nabla_{\xi}\omega_i)^{T}J^{-1}\bm{N}^{\xi}_ e \\
&= (\nabla_{\xi}\omega_i)^{T}J^{-T}J^{-1}\bm{N}^{\xi}_ e \\
&= (\nabla_{\xi}\omega_i)^{T}(JJ^{T})^{-1}\bm{N}^{\xi}_ e \\
&= (\nabla_{\xi}\omega_i)^{T}g^{-1}\bm{N}^{\xi}_ e \\
&= \langle\nabla_{\xi}\omega_i\cdot \bm{N}^{\xi}_ e\rangle \\
\end{aligned}
$$
### $\nabla \omega_i \cdot \nabla \omega_j$
$$
\begin{aligned}
\nabla \omega_i \cdot \nabla \omega_j &= J^{-1}\nabla_{\xi}\omega_i \cdot J^{-1}\nabla_{\xi}\omega_j \\
&= (J^{-1}\nabla_{\xi}\omega_i)^{T}J^{-1}\nabla_{\xi}\omega_j \\
&= (\nabla_{\xi}\omega_i)^{T}J^{-T}J^{-1}\nabla_{\xi}\omega_j \\
&= (\nabla_{\xi}\omega_i)^{T}(JJ^{T})^{-1}\nabla_{\xi}\omega_j \\
&= (\nabla_{\xi}\omega_i)^{T}g^{-1}\nabla_{\xi}\omega_j \\
&= \langle\nabla_{\xi}\omega_i\cdot\nabla_{\xi}\omega_j\rangle \\
\end{aligned}
$$

### 有限要素行列
式$(eq: A-\phi)$を行列にする。
物理法則はあらゆる空間のすべての点で成立する法則であるのでこの法則は要素$m$内の任意の点$\bm{x}$でも成り立つ。
$$
\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} + \sigma\frac{\partial \bm{A}}{\partial t} + \sigma\mathrm{grad}\frac{\partial \phi}{\partial t} = \bm{J}_ {source}
$$
$$
\bm{A}(\bm{x}) = \sum_{e\in \mathrm{Edge}}A_e\bm{N}_ e(\bm{x})
$$
$$
\phi(\bm{x}) = \sum_{n \in {Node}}\phi_i L_i(\bm{x})
$$
$$
\bm{N}_ k = \omega_i \nabla \omega_j - \omega_j \nabla \omega_i
$$
この式にガラーキン法を適用する。
重みは辺$\bm{N}_ {e'}$だ。  
ベクトル公式を一つ紹介する。
なお、時間による偏微分をみやすくするために$\frac{\partial \bm{A}}{\partial t} = \dot{\bm{A}}$とする。
$$
\mathrm{div}(\bm{a}\times \bm{b}) = \bm{b}\cdot\mathrm{rot}\bm{a} - \bm{a}\cdot\mathrm{rot}\bm{b}
$$
それじゃlet's go
とりあえず両辺に$\bm{N}_ {e'}$との内積を取る。
$$
\bm{N}_ {e'}\cdot (\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} + \sigma\dot{\bm{A}} + \sigma\mathrm{grad}\dot{\phi} )= \bm{N}_ {e'}\cdot\bm{J}_ {source}
$$
右辺から計算していこう
$$
\begin{aligned}
(LHS) &= \mu^{-1}\mathrm{rot}\bm{A}\cdot\mathrm{rot}\bm{N}_ {e'} + \mathrm{div}(\mu^{-1}\mathrm{rot}\bm{A}\times\bm{N}_ {e'}) \\
      &+\sigma(\bm{N}_ {e'}\cdot\dot{\bm{A}} + \mathrm{grad}\dot{\phi}) \\
\end{aligned}
$$
~~これを要素$m$内の$\bm{x}$について積分(要素$m$内、体積分)する。~~
これを解析対象$M$について積分(体積分)する。解析対象$M$が占める三次元空間を$\Omega$とする。
$$
\int_{\Omega}\bm{N}_ {e'}\cdot (\mathrm{rot}\mu^{-1}\mathrm{rot}\bm{A} + \sigma\dot{\bm{A}} + \sigma\mathrm{grad}\dot{\phi})\mathrm{d}V = \int_{\Omega}\bm{N}_ {e'}\cdot\bm{J}_ {source}\mathrm{d}V
$$
先程計算したものを使用して右辺を計算する。
$$
\begin{aligned}
(LHS) &= \int_{\Omega}\mu^{-1}\mathrm{rot}\bm{A}\cdot\mathrm{rot}\bm{N}_ {e'} + \mathrm{div}(\mu^{-1}\mathrm{rot}\bm{A}\times\bm{N}_ {e'}) \\
      &+\sigma(\bm{N}_ {e'}\cdot\dot{\bm{A}} + \bm{N}_ {e'}\cdot\mathrm{grad}\dot{\phi}) \mathrm{d}V\\
      &= \int_{\Omega}\mu^{-1}\mathrm{rot}\bm{A}\cdot\mathrm{rot}\bm{N}_ {e'}\mathrm{d}V
      + \int_{\Omega}\mathrm{div}(\mu^{-1}\mathrm{rot}\bm{A}\times\bm{N}_ {e'})\mathrm{d}V \\
      &+ \int_{\Omega}\sigma(\bm{N}_ {e'}\cdot\dot{\bm{A}} + \bm{N}_ {e'}\cdot\mathrm{grad}\dot{\phi}) \mathrm{d}V \\
      &= \int_{\Omega}\mu^{-1}\mathrm{rot}\bm{A}\cdot\mathrm{rot}\bm{N}_ {e'}\mathrm{d}V
      + \int_{\partial \Omega}\mu^{-1}\mathrm{rot}\bm{A}\times\bm{N}_ {e'}\cdot\mathrm{d}\bm{S} \\
      &+ \int_{\Omega}\sigma(\bm{N}_ {e'}\cdot\dot{\bm{A}} + \bm{N}_ {e'}\cdot\mathrm{grad}\dot{\phi}) \mathrm{d}V \\
\end{aligned}
$$
ここで二段目の式変形の第二項ではガウスの法則を使った。
境界では磁束密度$\bm{B}=\mathrm{rot}\bm{A}$は面に対して垂直であり**特別に$\partial\Omega$において$\bm{B}\parallel\bm{n}$つまり$\bm{B}\times \bm{n}=0$ という条件をつける。**
これにより、
$$
\begin{aligned}
(LHS) &= \int_{\Omega}\mu^{-1}\mathrm{rot}\bm{A}\cdot\mathrm{rot}\bm{N}_ {e'}\mathrm{d}V
      + \int_{\Omega}\sigma(\bm{N}_ {e'}\cdot\dot{\bm{A}} + \bm{N}_ {e'}\cdot\mathrm{grad}\dot{\phi}) \mathrm{d}V \\
\end{aligned}
$$
さて、積分の前提として積分対象は非交叉な積分対象に分割できる。  
$$
\Omega = \sum_{m}V_m
$$
とする。  
ここで分割した積分対象 要素$m$について考える。
ここで$\bm{A}, \phi$などを形状関数で表現したものを代入する。なお、第二項と第三項を入れ替えている。
$$
\begin{aligned}
(LHS)_m &= \int_{V_m}\mu^{-1}\mathrm{rot}\bm{A}\cdot\mathrm{rot}\bm{N}_ {e'}\mathrm{d}V
      + \int_{V_m}\sigma(\bm{N}_ {e'}\cdot\dot{\bm{A}} + \bm{N}_ {e'}\cdot\mathrm{grad}\dot{\phi}) \mathrm{d}V \\
      &= \sum_{e\in m_E} A_ e\int_{V_m}\mu^{-1}\mathrm{rot}\bm{N}_ e\cdot\mathrm{rot}\bm{N}_ {e'}\mathrm{d}V \\
      &+ \sum_{e\in m_E}\dot{A}_ e\int_{V_m}\sigma\bm{N}_ {e'}\cdot\bm{N}_ e \mathrm{d}V
      + \sum_{n\in m_N}\dot{\phi}_ n\int_{V_m}\sigma\bm{N}_ {e'}\cdot\mathrm{grad}L_n \mathrm{d}V \\
\end{aligned}
$$
そこで
$$
\begin{aligned}
K_{ee'} &= \int_{V_m}\mu^{-1}\mathrm{rot}\bm{N}_ e\cdot\mathrm{rot}\bm{N}_ {e'}\mathrm{d}V \\
K_{nn}  &= 0 \\
K_{e'n} = K_{ne'} &= 0 \\
C_{e'e} = C_{ee'} &= \int_{V_m}\sigma\bm{N}_ {e'}\cdot\bm{N}_ {e}\mathrm{d}V \\
C_{e'n} &= \int_{V_m}\sigma\bm{N}_ {e'}\cdot\mathrm{grad}L_n\mathrm{d}V
\end{aligned}
$$
これを用いると
$$
\begin{aligned}
(LHS) &= \sum_m(LHS)_m \\
(LHS)_m &= \sum_e A_eK_{ee'} + \sum_e\dot{A}_ eC_{e'e} + \sum_{n}\dot{\phi}_ nC_{e'n}
\end{aligned}
$$
また、$K_{ee'},K_{e'n},K_{nn},C_{ee'},C_{e'n},C_{nn}$などを成分にもつ行列を考え、
$$
\mathbf{A}=(A_0,\ldots, A_e,\ldots, A_{E-1}, \phi_0, \ldots, \phi_n\ldots\phi_{N-1})
$$
とし、
$$
\begin{aligned}
(RHS) &= \int_{\Omega}\bm{N}_ {e'}\cdot\bm{J}_ {source}\mathrm{d}V \\
      &= F_e'
\end{aligned}
$$
とする。
$$
\mathrm{K}\mathbf{A} + \mathrm{C}\dot{\mathbf{A}} = \mathrm{F}
$$
が得られる。

## 不完全コレスキー分解前処理共役勾配法
## ゲージ変換と電流の発散条件
さて、先程導出した式だが実はうまく解けない。
時間変化をしない$\mathrm{C}=\mathrm{O}$の状態でも解けない。
これは$\mathrm{K}$が必ず特異行列になることに由来する。
これは四面体を考えてみればわかる。

対象から四面体要素$m$を一つ取り出して磁束密度$\bm{B}=\mathrm{rot}\bm{A}$を計算することを考えてみよう。
辺形状関数の標本点は辺に割当てられ、磁束密度は面に割り当てれられる。
磁束密度がベクトルポテンシャルの標本点の線形和で表されるとする。
四面体の面は$4$つに対して辺は$6$本だ。つまり、各面に割り当てられる磁束密度を求めるにあたって辺の数が多すぎるため方程式は不定となる。(自由度が多すぎて解が一意に定まらない。)

四面体のある面でループを作る際、それは補木と木に分割することができる。木(または補木)を一意に決定するとループが決まるため、$K$の$\mathrm{rank}$は補木の辺の数$e-n+1$と等しくなる。
これは図形の根本的な問題をはらんでいる。
<!-- オイラーの多面体定理$n - e + f = 2$ -->
<!-- そしてそれは$G^Tb=0$として表される。 -->
<!-- これを確認することで方程式が事前によく解けるかどうかが判断できる。 -->
そこで以下ではどのようにすればこの方程式が解けるのかを見ていく。

## クランク・ニコルソン法
## 共役勾配法
## 不完全コレスキー分解



