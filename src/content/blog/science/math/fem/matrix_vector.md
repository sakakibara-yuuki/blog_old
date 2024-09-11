---
title: "境界作用素を用いた勾配・発散・回転の行列表現"
author: "sakakibara"
description: "ベクトル解析で用いられることの多いこれらの概念は実は行列を用いて表現することができます。"
heroImage: "/science/science.jpg"
pubDate: 2024-03-18
tags: ["math", "fem", "有限要素法", "行列表現", "ベクトル解析"]
---

# 勾配・発散・回転

以下の記号を知っているだろうか。

$$
\mathrm{grad} \phi \\
\mathrm{div} \mathbf{v} \\
\mathrm{rot} \mathbf{v}
$$

これらは所謂ベクトル解析と呼ばれる分野に登場する記号だ。  
$\mathrm{grad}$から説明しよう。  

## 勾配
$\phi$を$n$次元実数空間$\mathbf{x}\in \mathbb{R}^n$から実数$\mathbb{R}$への関数とする。
形式的に記述すると以下のような感じだ。
$$
\phi : \mathbb{R}^n \rightarrow \mathbb{R}
$$

例としては等高線が書かれた地図のようなものや空間に分布する温度などが取り上げられる。
(この手の関数、 つまり、ベクトルから実数への関数はかなり多くの研究対象となっている。)

空間の温度の分布について考える際、その位置に対する温度の変位は指定した位置による微分で定義されるだろう。
位置を$3$次元実数空間$\mathbf{x}=(x_1, x_2, x_3)$で表すと、
$$
\bigg(\frac{\partial{\phi}}{\partial{x_1}}, \frac{\partial{\phi}}{\partial{x_2}}, \frac{\partial{\phi}}{\partial{x_3}}\bigg)
$$
となる。
または$\nabla = (\frac{\partial}{\partial{x_1}}, \frac{\partial}{\partial{x_2}}, \frac{\partial}{\partial x_3})$を用いて
$$
\nabla\phi
$$
のように表される。

そこで、以下のように演算子を定義する。
$$
\mathrm{grad} := \nabla
$$


## 発散
$\mathbf{v}$を$n$次元実数空間$\mathbf{x}\in \mathbb{R}^n$からベクトル空間$V$への関数とする。
形式的に記述すると以下のような感じだ。
$$
\mathbf{v} : \mathbb{R}^n \rightarrow V
$$

例としては水流の分布などを想像してほしい。

水流の湧き出しについて考える際、湧き出しの量はその位置の各方向で微小面積あたりどれほど水量が変化(水がその方向から出ていって入った量)したかで定義されるだろう。
位置を$3$次元実数空間$\mathbf{x}=(x_1, x_2, x_3)$で表すと、
$$
\frac{\partial{v_1}}{\partial{x_1}} + \frac{\partial{v_2}}{\partial{x_2}} + \frac{\partial{v_3}}{\partial{x_3}} 
$$
$\nabla$を用いて表すと
$$
\nabla \cdot \mathbf{v}
$$
のように表される。

そこで、以下のように演算子を定義する。
$$
\mathrm{div} := (\nabla \cdot)
$$

## 回転
水流の回転について考える際、回転の量はその位置の各方向の変位に対してどれほど水量がその方向と垂直方向に変化したかで定義されるだろう。
位置を$3$次元実数空間$\mathbf{x}=(x_1, x_2, x_3)$で表すと、
$$
\bigg(\frac{\partial{v_3}}{\partial{x_2}} - \frac{\partial{v_2}}{\partial{x_3}}, \frac{\partial{v_1}}{\partial{x_3}} - \frac{\partial{v_3}}{\partial{x_1}}, \frac{\partial{v_2}}{\partial{x_1}} - \frac{\partial{v_1}}{\partial{x_2}}\bigg)
$$
$\nabla$を用いて表すと
$$
\nabla \times \mathbf{v}
$$
のように表される。

そこで、以下のように演算子を定義する。
$$
\mathrm{rot} := (\nabla \times)
$$

### それぞれの関係式
$\mathrm{div}$, $\mathrm{rot}$, $\mathrm{grad}$それぞれを結ぶ重要な関係式がある。
それが以下だ。
$$
\begin{aligned}
\mathrm{rot}(\mathrm{grad}) &= 0 \\
\mathrm{div}(\mathrm{rot}) &= 0
\end{aligned}
$$

すなわち回転するような勾配は存在しないし、発散するような回転は存在しないということである。  
これは実際に$\nabla$を計算してみるとわかる。
また、以下の演算をラプラシアンやラプラス演算子などと呼ぶ
$$
\Delta = \mathrm{div}(\mathrm{grad})
$$
これは調和作用素などと呼ばれることもあり、物理の文脈でよく出てくる。  
また、なぜだかこの逆には特別な名前がついていない。  
$$
? = \mathrm{grad}(\mathrm{div})
$$

この演算には特別な名前ついていないものの、以下の様に重要な役割を果たす。
$$
\begin{aligned}
\mathrm{rot}(\mathrm{rot}) &= [\mathrm{grad}, \mathrm{div}] \\
                           &= \mathrm{grad}(\mathrm{div}) - \mathrm{div}(\mathrm{grad}) \\
                           &= \mathrm{grad}(\mathrm{div}) - \Delta
\end{aligned}
$$

この演算には名前が無いので個人的にロトロトと読んでいる。

## ベクトル場と離散表現
さて、これらの演算子はベクトル場やスカラー場に対して定義されるものである。
以下ではこれらの演算子を行列を用いて表現する方法について考える。
以下の内容は[A.Bossavit, "Computational Electromagnetism: Variational Formulations, Complementarity, Edge Elements"](https://www.sciencedirect.com/book/9780121187101/computational-electromagnetism)に基づいている。

### 勾配行列
さて、以上でベクトル場$\mathbf{v}$やスカラー場$\phi$とそれにまつわる演算子について軽く触れた。

先程触れた勾配・発散・回転と同様の概念はネットワーク的に表現できる。
ネットワーク的にとは接続行列や隣接行列を使用して定義できるのだ。

頂点$n_1$から辺$e$が出て、頂点$n_2$へ入っているとする。
この関係を
$$
\partial{e} = n_2 - n_1
$$
のように表現する。
これを様々な辺について考える。  
辺$e_k$が頂点$n_i$から出て頂点$n_j$へ出ているとする。
$$
\partial{e_k} = \sum_i G_{ki} n_i
$$
ここで$G_{ki}$は
$$
G_{ki} =
\begin{cases}
\text{辺}e_k \text{が頂点} n_i \text{へ入っているのであれば}1 \\
\text{辺}e_k \text{が頂点} n_i \text{から出ているのであれば}-1 \\
\mathrm{other} 0
\end{cases}
$$
のようにして定義される。

このような要素を持つ行列を$\mathrm{G}=[G_{ki}]$と定義する。  
これを勾配行列という。

頂点の個数を$N$, 辺の個数を$E$とすると勾配行列$\mathrm{G}$は$E \times N$の行列である。
頂点に値を振り宛てた$N$個の要素をもつベクトルを$\phi \in \mathbb{R}^N$とすると、
その勾配は$\mathrm{G}\phi$のようにして表される。

勾配行列$\mathrm{G}$は所謂接続行列になっている。
そして勾配行列の積を$\mathrm{div}\mathrm{grad}$とのアナロジーからラプラス行列という。
$$
\mathrm{L} = \mathrm{G}^T\mathrm{G}
$$

### 回転行列
勾配行列で考えた辺と頂点に対する考えをさらに拡張し、
面と辺に対しても同じような考えを適用してみる。

面$f$の境界の辺$e_1, e_2, e_3, e_4$が面を囲む向きに定まっているとする。この関係を
$$
\partial{f} = e_1 + e_2 + e_3 + e_4
$$
のように表現する。

これを様々な面について考える。  
面$f_k$が辺$e_i$に囲まれているとする。
$$
\partial{f_k} = \sum_i R_{ki} e_i
$$
ここで$R_{ki}$は
$$
R_{ki} =
\begin{cases}
\text{面}f_k\text{が辺}e_i\text{によって適切な向きによって囲まれているのであれば}1 \\
\text{面}f_k\text{が辺}e_i\text{によって適切な向きの逆向きによって囲まれているのであれば}-1 \\
\mathrm{other} 0
\end{cases}
$$
のようにして定義される。

このような要素を持つ行列を$\mathrm{R}=[R_{ki}]$と定義する。  
これを回転行列という。

辺の個数を$E$, 面の個数を$F$とすると回転行列$\mathrm{R}$は$F \times E$の行列である。
辺に値を振り宛てた$E$個の要素をもつベクトルを$\mathbf{v} \in \mathbb{R}^E$とすると、
その回転は$\mathrm{R}\mathbf{v}$のようにして表される。

ラプラス行列のようにロトロト行列$\mathrm{R}^T\mathrm{R}$について考えることもできる。

### 発散行列
発散に関しても以上と同じ関係が導かれる。
それを$\mathbf{D}$とする。

### 勾配・回転・発散 に関する関係式
さて、興味深いことにベクトル解析で見られた勾配・回転・発散の関係が離散化した状態でも見られる。

つまり、
$$
\mathrm{rot}(\mathrm{grad}) = 0 \\
\mathrm{div}(\mathrm{rot}) = 0
$$
が表現できる。

面fについて
$$
\begin{aligned}
\partial{f} &= e_1 + e_2 + e_3 + e_4 \\
\partial{e_1} &= n_2 - n_1 \\
\partial{e_2} &= n_3 - n_2 \\
\partial{e_3} &= n_4 - n_3 \\
\partial{e_4} &= n_1 - n_4
\end{aligned}
$$
のように表現できるとしよう。

さて、ここで以下のような考えをしてみる。
$$
\begin{aligned}
\partial{\partial{f}} &= \partial{(e_1 + e_2 + e_3 + e_4)} \\
    &= \partial{e_1} + \partial{e_2} + \partial{e_3} + \partial{e_4} \\
    &= n_2 - n_1 \\
    &+ n_3 - n_2 \\
    &+ n_4 - n_3 \\
    &+ n_1 - n_4 \\
    &= 0
\end{aligned}
$$
なんと、$\partial{f}$の境界を取る作用をすると、それは$0$になる。

そしてこれを行列的な表現をすると、
$$
\mathrm{RG} = O
$$
となる。
また、発散行列$\mathrm{D}$と回転行列$\mathrm{R}$についても同じことが言える。
$$
\mathrm{DR} = O
$$

### 辺要素のrot

有限要素法では解析対象を要素と呼ばれる小さな領域に分割する。
解析対象に関する物理場は要素内での補間により表現する。
要素内での補間の方法には大きく３つある。

- 頂点補間: 頂点に実際の値を割り当て、その値を用いて要素内の物理場を補間する。
- 辺補間: 辺に実際の値を割り当て、その値を用いて要素内の物理場を補間する。
- 面補間: 辺に実際の値を割り当て、その値を用いて要素内の物理場を補間する。

ベクトル・ポテンシャルなどを扱う際には辺補間を使う。  
ベクトル・ポテンシャル$\mathbf{A}$を辺補間で補間する際に磁束密度$\mathbf{B}$は
$$
\mathbf{B} = \mathrm{rot}\mathbf{A}
$$
のように表される。
そしてその辺要素の値をベクトルとした$\{A\}$と$\{B\}$について
$$
\{B\} = R \{A\}
$$
として表現できる。
$$
\mathbf{B} = \{{\nabla \times \mathbf{N}}\}^T\{A\}
$$
また、磁束密度$\mathbf{B}$は以下のようも表現できるとする。
$$
\begin{aligned}
\mathbf{B} &= \{M\}^T\{B\} \\
&= \{M\}^TR\{A\} \\
&= \{R^T\{M\}\}^T\{A\}
\end{aligned}
$$
すなわち、
$$
\{\nabla \times \mathbf{N}\} = R^T\{M\}
$$
が成り立つ。

注意しなければならないこととして、面から辺は計算できるが、辺から面は計算できないことだ。
つまり、辺の形状関数が判明していれば点の形状関数が求められるが逆は必ずしも成り立たないということである。
