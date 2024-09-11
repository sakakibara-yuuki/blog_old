---
title: '最適化問題とは'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/science/science.jpg'
pubDate: 2024-07-22
tags: ["math", "optimize", "最適化"]
---

# Introduction
多様体上での最適化問題について説明する。そのため、まず、最適化問題とは何かを説明する。

なお, 行列演算については以下を参考にすること.
[matrix cook book](https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf)

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

## 大域的最適解と局所最適解
:::math[大域的最適解]{.def}

ユークリッド空間$\mathbb{R}^n$の最適化問題の実行可能解$\bm{x}^\star \in \Omega$が**大域的最適解**であるとは, 以下が成り立つことをいう.

$$
\forall \bm{x} \in \Omega\text{に対して, }f(\bm{x}^\star) \le f(\bm{x})
$$

また, $\bm{x}^\star \in \Omega$が**局所的最適解**であるとは, $\bm{x}^\star$の近傍$U\subset \mathbb{R}^n$が存在し, その相対位相に対して, 以下を満たすことをいう.

$$
\forall \bm{x} \in \Omega \cap U\text{に対して, }f(\bm{x}^\star) \le f(\bm{x})
$$
:::


## 凸集合と凸関数
最適化の文脈において, 極小値や極大値が存在するかどうかを考えるために, 関数の凸性が重要である.

ベクトル空間$V$の元$x, y \in V$に対して, $x, y$を結ぶ線分上の元を**凸結合**という.  

:::math[凸集合]{.def}

$V$の部分集合$C$が以下の性質を満たすとき, 部分集合$C$は**凸集合**であるという.  


$$
\forall x, y \in C,\ \lambda \in [0, 1]\text{に対し, }\lambda x + ( 1 - \lambda ) y \in C
$$
:::

凸集合ではない例として, 球面$S^{n-1}$が挙げられる.
たとえば, $S^2$上の2点を考える. この2点を結ぶ線分上の点(凸結合)は球面上には存在しない.  
しかし, $S^2_{<}=\{\bm{x} \mid \| \bm{x} \| \le 1\}$は凸集合である.
$S^2_{<}$の2点を結ぶ線分上の点は$S^2_{<}$上に存在するからである.

以下では凸関数の定義について述べる.  
通常, 凸関数は下に凸な形状をしている.

:::math[凸関数]{.def}
ベクトル空間$V$の部分集合$C$を凸集合とする.  
$C$上に制限された関数$f: C \to \mathbb{R}$が以下の性質を満たすとき,   
関数$f$は$C$上の**凸関数**であるという.

$\forall x, y \in C,\ \lambda \in [0, 1]$に対して,  
$$
f(\lambda x + (1 - \lambda) y) \le \lambda f(x) + (1 - \lambda) f(y)
$$

また, 等号が成立しないとき, 関数$f$は$C$上の**狭義凸関数**であるという.
:::

ノルム$\| \cdot \|$は凸関数である. ただし, 狭義凸関数となるとは限らない.
たとえば, $C$を凸集合であるとする. $x, y\in C$の片方$x=0$である場合, $\| \cdot \|$の等号が成立する.

また, $2$次形式の凸性について考える.  
$f(\bm{x}) = \frac{1}{2}\bm{x}^\top A \bm{x} + \bm{b}^\top\bm{x} + \bm{c}$とする.
$$
\begin{aligned}
(LHS) &= \lambda \frac{1}{2}(\bm{x}^\top A \bm{x} + \bm{b}^\top\bm{x} + \bm{c}) + (1 - \lambda) \frac{1}{2}(\bm{y}^\top A \bm{y} + \bm{b}^\top\bm{y} + \bm{c}) \\
&- \frac{1}{2}(\lambda \bm{x} + (1 - \lambda)\bm{y})^\top A (\lambda \bm{x} + (1 - \lambda)\bm{y}) \\
&= \frac{1}{2}\lambda(1 - \lambda)(\bm{x} - \bm{y})^\top A (\bm{x} - \bm{y}) \\
\end{aligned}
$$

これが非負であるためには, 行列$A$が半正定値である必要がある.

一般に対称変換$\mathcal{A}: V \to V$と, 内積$\langle \cdot, \cdot \rangle$に対して,
関数$f: V \to \mathbb{R}$
$$
f(\bm{x}) = \frac{1}{2}\langle \bm{x}, \mathcal{A}\bm{x} \rangle + \langle \bm{b}, \bm{x} \rangle + c
$$
が凸関数であるためには, $\mathcal{A}$が半正定値である必要がある.

## 無制約最適化問題

## KKT条件(カールシュ・キュー・タッカー条件)
$$
L: \mathrm{R}^n \times \mathrm{R}^m \times \mathrm{R}^p \to \mathrm{R}
$$

## シュティーフェル多様体上の最適化問題

## 2次制約付き最適化から球面への最適化へ
レイリー商の最適化については$\bm{x}^\top\bm{x}=1$という制約条件を導入することで, 目的関数が簡素になることを述べた. $\bm{x}^\top\bm{x}=1$という制約条件は実行可能集合を$n$次元に埋め込まれた$n-1$次球面$S^{n-1}$に制限したことに対応している. 

これはすなわち多様体上(球面上)で定義される目的関数に対する最適化問題と読み変えることができる. 
そこで, この問題を足がかりにして, 多様体への最適化問題についてユークリッド空間上の最適化問題と照らし合わせながら考える.

なお, 以下では$A \in \mathrm{Sym}_ +$(正定値対象行列)とする.
目的関数$\bar{f}(\bm{x}) = \bm{x}^\top A \bm{x}$の無制約最適化問題について考える.
ユークリッド空間上の無制約最適化問題に対しては, 最急降下法やニュートン法などの解法が知られている.
たとえば, 最急降下法は以下のように表される.

1. $\bm{x}_ k \in \mathbb{R}^n$を初期値として設定する. $\bm{d}_ k = -\mathrm{grad} \bar{f}(\bm{x}_ k) = -2A\bm{x} \in \mathbb{R}^n$を計算する.
1. $\phi(t) = \bar{f}(\bm{x}_ k + t\bm{d}_ k)$を最小にする$t$をステップ幅とする$t_k$.
1. $\bm{x}_ {k+1} = \bm{x}_ k + t_k\bm{d}_ k$と更新する.

ではこれは多様体上での最適化問題に対してはどのように置き換わるのだろうか.
$n-1$次球面上での目的関数$f(\bm{x})= \bm{x}^\top A \bm{x}$の最適化問題(最急降下法)について考える.

まず, 初期は$\bm{x} \in S^{n-1}$の点を選ぶ. 次に進む点$\bm{d}_ k = -\mathrm{grad}f(\bm{x})= - 2A\bm{x}$は$S^{n-1}$に収まらない. そこで, $\bm{d}_ k$を$S^{n-1}$の$\bm{x}_ k$における接空間$T_{\bm{x}_ k}S^{n-1}$に射影する. また, 球面上の点$\bm{x}$と接空間の点$\bm{d}$は直交するので, $T_{\bm{x}}S^{n-1}=\{\bm{d} \in \mathbb{R}^n \mid \bm{x}^\top \bm{d} = 0\}$となる. 
また, 球面から接空間への射影は$P = I_n - \bm{x}\bm{x}^\top$となる. したがって, $\mathrm{grad}f(\bm{x}) = -A\bm{x}_ k$を射影すると$\bm{d}_ k = P(-2A\bm{x}) = -2(I_n - \bm{x}_ k\bm{x}_ k^\top)A \bm{x}$となる. これを用いて, ステップ幅を決定する.

ただし, このように球面上の接空間へ射影をしてもその先の点$\bm{x} + t\bm{d}$は必ずしも球面上に収まるとは限らない. そこで, $\bm{x} + t\bm{d}$の代わりに$\bm{x}$から始まる$\bm{d}$方向の曲線$\bm{\gamma}_ k(t)$を考える. この曲線は$\bm{\gamma}_ k(0) = \bm{x}_ k$であり, $\bm{\gamma}_ k'(0) = \bm{d}_ k$を満たす. 
たとえば, $\bm{\gamma}(t) = (\bm{x} + t\bm{d}) / \| \bm{x} + t\bm{d} \|$が考えられる. これは球面上(半径$1$)に収まるようにはみ出た点を正規化している. この曲線上で目的関数を最小化する$t$を求めることで, 球面上での最適化問題を解くことができる.

一般に多様退上に曲線を与える写像をretractionという.

## シュティーフェル多様体の接空間への射影 6.15
シュティーフェル多様体の接空間への射影について考える.

## シュティーフェル多様体と特異値分解について 9.21
$(p, m)$型行列のシュティーフェル多様体を$\mathrm{St}(p, m)$とする.
考えたい最適化問題は以下である.
$(U, V) \in \mathrm{St}(p, m) \times \mathrm{St}(p, n)$
$$
f(U, V) = -\mathrm{tr}(U^\top A V N)
$$

これには特異値分解による以下の命題が成り立つ.

:::math[特異値分解とシュティーフェル多様体]{.def}
目的関数$f(U, V) = -\mathrm{tr}(U^\top A V N)$の最適解$(U^\star, V^\star)\in \mathrm{St}(p, m) \times \mathrm{St}(p, n)$に対して,
$(U^\star, V^\star)$は$A$の左特異ベクトル$U$, 右特異ベクトル$V$に対応する.
:::

$f(U, V)=-\mathrm{tr}(U^\top A V N)$を$\mathbb{R}^{m\times p}\times\mathbb{R}^{n\times p}$上の関数に拡張した関数$\bar{f}(U, V) = -\mathrm{tr}(U^\top A V N)$を考える.
$$
\nabla \bar{f}(U, V) = \begin{pmatrix} -AVN \\ -A^\top U N \end{pmatrix}
$$
積多様体のなので,
$$
\nabla f(U, V) =
\begin{pmatrix}
 -A V N + U \mathrm{sym}(U^\top A V N) \\
 -A^\top U N + V \mathrm{sym}(V^\top A^\top U N)
\end{pmatrix}
$$
ここで, $A \in \mathbb{R}^{m\times n},\ \mathrm{sym}(A)=\frac{A + A^\top}{2}$である.

最適性の$1$次条件$\nabla f(U, V) = (0, 0)^\top$より,
$$
\begin{aligned}
A V^\star N &= U^\star \mathrm{sym}((U^\star)^\top A V^\star N) \\
A^\top U^\star N &= V^\star \mathrm{sym}((V^\star)^\top A^\top U^\star N)
\end{aligned}
$$
が成り立つ.

$$
A V^\star N = U^\star \mathrm{sym}((U^\star)^\top A V^\star N)
$$
について考える.
左から$(U^\star)^\top$をかけると,
$$
\begin{aligned}
(U^\star)^\top A V^\star N &= (U^\star)^\top U^\star \mathrm{sym}((U^\star)^\top A V^\star N) \\
&= \mathrm{sym}((U^\star)^\top A V^\star N) \\
&= \frac{(U^\star)^\top A V^\star N + ((U^\star)^\top A V^\star N)^\top}{2} \\
\end{aligned}
$$
両辺に$2$を掛けて両辺から$(U^\star)^\top A V^\star N$を両辺から引くと,
$$
\begin{aligned}
(U^\star)^\top A V^\star N &= ((U^\star)^\top A V^\star N)^\top \\
&= N^\top (V^\star)^\top A^\top U^\star
\end{aligned}
$$

同様にして,
$$
A^\top U^\star N = V^\star \mathrm{sym}((V^\star)^\top A^\top U^\star N)
$$
について考える.左から$(V^\star)^\top$をかけると,
$$
\begin{aligned}
(V^\star)^\top A^\top U^\star N &= (V^\star)^\top V^\star \mathrm{sym}((V^\star)^\top A^\top U^\star N) \\
&= \mathrm{sym}((V^\star)^\top A^\top U^\star N) \\
&= \frac{(V^\star)^\top A^\top U^\star N + ((V^\star)^\top A^\top U^\star N)^\top}{2} \\
\end{aligned}
$$
両辺に$2$を掛けて両辺から$(V^\star)^\top A^\top U^\star N$を両辺から引くと,
$$
(V^\star)^\top A^\top U^\star N = N^\top (U^\star)^\top A V^\star
$$
となる.

まとめると,
$$
\begin{aligned}
(U^\star)^\top A V^\star N &= N^\top (V^\star)^\top A^\top U^\star \\
(V^\star)^\top A^\top U^\star N &= N^\top (U^\star)^\top A V^\star
\end{aligned}
$$
