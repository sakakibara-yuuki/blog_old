---
title: '最適化問題とは'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-07-22
tags: ["astro", "math"]
---

# Introduction
多様体上での最適化問題について説明する。そのため、まず、最適化問題とは何かを説明する。
## Contents
## 最適化問題とは
ある値を最大・もしくは最小にするような定義域の元を求める問題のことを最適化問題という。
より具体的には、
集合$X$上の関数$f:X\to\mathbb{R}$に対して, $\Omega\subseteq X$に制限された$f$の最大値を取る$x \in \Omega$を求める問題を最大化問題という。
最大化問題と最小化問題は$f$の符号を反転させることで相互に変換でき, 形式的には同じ問題となる。

- $x \in X$を**決定変数**,
- $\Omega \subseteq X$を**実行可能集合**,
- $x \in \Omega$を**実行可能解**,
- 命題$x \in \Omega$を**制約条件**
- $f$を**目的関数**と呼ぶ。

実行可能集合を制約条件と表現する場合もある.

$$
\begin{align}
  \text{目的関数} & : f: X \to \mathbb{R} \\ 
  \text{制約条件} & : x \in \Omega
\end{align}
$$

一般に$X = \Omega$である最適化問題を**無制約最適化問題**と呼び、$\Omega \subset X$である最適化問題を**制約つき最適化問題**と呼ぶ。ほとんど問題になるのは制約付き最適化問題である。
目的関数が連続である場合、**連続最適化問題**と呼ぶ.

例えば、
三次元空間に埋め込まれた球面を実行可能集合として考える。この場合、$X=\mathbb{R}^3$, 
$\Omega=S^2=\{ \bm{x}\in \mathbb{R}^3 \mid  \|\bm{x}\|=1 \} \subset \mathbb{R}^3$となる。
実行可能集合$\Omega$上に制限された写像$f(\bm{x}) = \bm{x}\top A \bm{x}$になるような問題は制約付き連続最適化問題と言える。

また、$\Omega$上に制限された写像を目的関数として考えることで、実質的に無制約最適化問題に帰着させることができる。

ユークリッド空間上の最適化問題については多く研究がなされているが、無制約最適化問題に対する解法(最急降下法, ニュートン法)を直接適用することは難しい。そのため、制約付き最適化問題に特化した解法が研究されている。

近年、制約付き最適化での目的関数を制限し、多様体上の無制約最適化とみなすことで無制約最適化の解法を適用する手法が研究されている。

特に、注目したいのが
- (一般)シュティーフェル多様体
である。
一般シュティーフェル多様体は以下で表される集合である。
$$
St_G(p, n) = \{X \in \mathbb{R}^{n \times p} \mid X^\top G X = I_p \}
$$

正定値行列$A_p$が$A_p = V \Lambda V^\top$のように固有値分解されるとする.  
このとき, $\{X \mid X^\top X=A_p\}$を実行可能集合にもつような最適化問題を考えたい。
これは以下のように変形することで
$$
\begin{aligned}
X^\top X &= V \Lambda V^\top \\
V^\top X^\top XV &= \Lambda\\
V^\top X^\top XV &= \sqrt{\Lambda} \sqrt{\Lambda}\\
\sqrt{\Lambda}^{-1}V^\top X^\top XV\sqrt{\Lambda}^{-1} &= I_p\\
(XV\sqrt{\Lambda})^\top (XV\sqrt{\Lambda}^{-1}) &= I_p\\
\end{aligned}
$$
$X'=XV\sqrt{\Lambda}$とすると, $X'^\top X' = I_p$となり、シュティーフェル多様体上の問題に帰着される.

## レイリー商と最適化問題
対称行列$A$と非ゼロのベクトル$\bm{x}$に対して、レイリー商は以下で定義される。
$$
f(\bm{x}) = \frac{\bm{x}^\top A \bm{x}}{\bm{x}^\top \bm{x}}
$$
この関数は$\bm{x}$の2次形式であり, $\bm{x}$のスケールに依存しない。
どいういうことかというと
$$
f(\alpha\bm{x}) = \frac{\alpha\bm{x}^\top A \alpha\bm{x}}{\alpha\bm{x}^\top \alpha\bm{x}} = \frac{\bm{x}^\top A \bm{x}}{\bm{x}^\top \bm{x}}
= f(\bm{x})
$$
となる。
つまり, $f$の値は$\bm{x}$の大きさには依存しない。
そこで, $\bm{x}$の大きさが1であるとする.

$$
f(\bm{x}) = \bm{x}^\top A \bm{x}
$$
レイリー商を用いた最小化最適化問題について考える.
$$
\begin{align}
 \text{目的関数} &: f(\bm{x}) = \frac{\bm{x}^\top A \bm{x}}{\bm{x}^\top \bm{x}} \\
 \text{制約条件} &: \bm{x} \in \mathbb{R}^n
\end{align}
$$

この問題を$\bm{x}^\top \bm{x} = 1$という制約条件を導入すると,
$$
\begin{align}
 \text{目的関数} &: f(\bm{x}) = \bm{x}^\top A \bm{x} \\
 \text{制約条件} &: S^{n-1} = \{ \bm{x} \in \mathbb{R}^n \mid \bm{x}^\top \bm{x} = 1 \} 
\end{align}
$$
となり, $n-1$次元球面上の最適化問題に帰着される.

$p \in \mathbb{N}$とし, $p$個のレイリー商の和について考える
$$
\sum_{i=1}^{p}\mu_i \bm{x}_ i^\top A \bm{x}_ i
$$
ただし, $p$個のベクトル$\{\bm{x}_ 1, \bm{x}_ 2, \ldots, \bm{x}_ p\}$は正規直交規定をなすとする.
つまり, 各$\bm{x}$は球面$S^{n-1}$上の元であり,　$\bm{x}_ i^\top \bm{x}_ j=\delta_{ij}$を満たす.
$p$個のベクトルを並べた行列$X=[\bm{x}_ 1, \bm{x}_ 2, \ldots, \bm{x}_ p]$を考えると, $X^\top X = I_p$であり, 行列$X$はシュティーフェル多様体の元であることを意味する.
また, $N = \mathrm{diag}(\mu_1, \mu_2, \ldots, \mu_p)$とすると, レイリー商の和は以下のように表される.
$$
\sum_{i=1}^{p}\mu_i \bm{x}_ i^\top A \bm{x}_ i = \mathrm{tr}(X^\top A X N)
$$

<details>
<summary>証明</summary>

ここで$X^\top A X$の$(i, j)$成分は$\sum_{k, l} x_ {ik}  A_{kl} x_ {lj} = \bm{x}_ i^\top A \bm{x}_ j$と表される.
$X^\top A XN$の$(i, j)$成分は
$$
\sum_{k, l, m} x_ {ik}  A_{kl} x_ {lm} \mu_{m, j}\delta_{m, j} = \sum_{k, l} x_ {ik}  A_{kl} x_ {lj} \mu_{j, j} = \mu_j \bm{x}_ i^\top A \bm{x}_ j
$$
と表される.  
$\sum_{i=1}^{p}\mu_i\bm{x}_ i^\top A \bm{x}_ i$を表すには$X^\top A X N$の$(i, i)$成分の和を取ればよいので
$$
\sum_{i=1}^{p}\mu_i \bm{x}_ i^\top A \bm{x}_ i = \mathrm{tr}(X^\top A X N)
$$
となる.
</details>

よって, レイリー商の和についての最適化問題はシュティーフェル多様体を実行可能集合とする最適化問題となる.
$$
\begin{align}
 \text{目的関数} &: f(X) := \mathrm{tr}(X^\top A X N) \\
 \text{制約条件} &: X \in St_G(p, n) = \{ X \mid X^\top X = I_p \}
\end{align}
$$

## 凸集合と凸関数
最適化の文脈において, 極小値や極大値が存在するかどうかをかんがえるために, 関数の凸性が重要である.

<div style="background-color: #e8e8e8">
<h5 style="color: gray">def</h5>

</div>
