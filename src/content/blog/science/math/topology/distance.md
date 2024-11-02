---
title: '距離空間'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-10-05
tags: ["astro", "math"]
---

# Introduction
収束も, 連続も, 距離を用いて定義される.
距離とは実数値上への関数であり, 以下の性質を満たす.

- $d(x, y) \geq 0$
- $d(x, y) = 0 \Leftrightarrow x = y$
- $d(x, y) = d(y, x)$
- $d(x, y) \leq d(x, z) + d(z, y)$

これらはよく知られている.
今回は, 様々な距離が定義された空間における収束, 連続について考える.


## Contents
## 距離の定義

:::math[距離の定義]{.def}

$d: X \times X \to \mathbb{R}$が距離であるとは, 以下の性質を満たすことである.

1. $\forall x, y \in X, d(x, y) \geq 0$, $d(x, y) = 0 \Leftrightarrow x = y$
1. $\forall x, y \in X, d(x, y) = d(y, x) $
1. $\forall x, y, z \in X, d(x, z) \le d(x, y) + d(y, z)$

また, $(X, d)$を距離空間と呼ぶ.
:::

## 収束
さて, 一般の距離を用いて収束の定義を見てみよう.

これが,
> 任意の正の実数$\epsilon$に対して, ある自然数$n_0$が存在して, 
> $$
> n > n_0 \implies |a_n - a| < \epsilon
> $$

こうなる.

> 任意の正の実数$\epsilon$に対して, ある自然数$n_0$が存在して, 
> $$
> n > n_0 \implies d(a_n, a) < \epsilon
> $$


だいぶスッキリした.
## 連続
次に, 連続の定義を見てみよう.

> 任意の正の実数$\epsilon$に対して, ある実数$\delta$が存在して,
> $$
> |x - x_0| < \delta \implies |f(x) - f(x_0)| < \epsilon
> $$
> が成り立つとき, $x_0$で連続であるという.

これを距離を用いて書き直すと,

> 任意の正の実数$\epsilon$に対して, ある実数$\delta$が存在して,
> $$
> d(x, x_0) < \delta \implies d(f(x), f(x_0)) < \epsilon
> $$
> が成り立つとき, $x_0$で連続であるという.

さて, これで距離空間における収束, 連続の定義ができた.
はてさて, $f: X \to Y$の$X, Y$それぞれが異なる距離空間である場合はどうだろうか. 具体的に以下は証明できるだろうか.

:::math[連続の定義]{.lemma}
恒等写像$\mathrm{id}: \mathbb{R}^2 \to \mathbb{R}^2$は, $(\mathbb{R}^2, d_1)$から$(\mathbb{R}^2, d_2)$への写像である. この写像は連続である.

ここで, 
$$
\begin{aligned}
d_1(\bm{x}_ 1, \bm{x}_ 2) &= |x_1 - x_2| + |y_1 - y_2| \\
d_2(\bm{x}_ 1, \bm{x}_ 2) &= \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}
\end{aligned}
$$
:::
任意の$\bm{x}_ 0 \in \mathbb{R}^2$に対して$f$が連続かどうかを考える.
任意の$\epsilon > 0$に対して, ある$\delta > 0$が存在して,
$$
d_1(\bm{x}, \bm{x}_ 0) < \delta \implies d_2(f(\bm{x}), f(\bm{x}_ 0)) < \epsilon
$$
が言えればいい.
このような$\delta$は存在するだろうか.
存在する. 具体的には, $\delta = \epsilon$とすればいい.

では, 逆はどうだろうか.
:::math[連続の定義]{.lemma}
恒等写像$\mathrm{id}: \mathbb{R}^2 \to \mathbb{R}^2$は, $(\mathbb{R}^2, d_2)$から$(\mathbb{R}^2, d_1)$への写像である. この写像は連続である.

:::
任意の$\bm{x}_ 0 \in \mathbb{R}^2$に対して$f$が連続かどうかを考える.
任意の$\epsilon > 0$に対して, ある$\delta > 0$が存在して,
$$
d_2(\bm{x}, \bm{x}_ 0) < \delta \implies d_1(f(\bm{x}), f(\bm{x}_ 0)) < \epsilon
$$
が言えればいい.
このような$\delta$は存在するだろうか.
これも, 存在する. 具体的には, $\delta = \frac{\sqrt{\epsilon}}{2}$とすればいい.

これは驚くべきことだ.
つまり,  

**距離の種類によらず, 距離が定義されていれば, 恒等写像の連続性は保たれる.**

そして, この事実を拡張した系が得られる.
:::math[連続の定義]{.lemma}
$f: X \to Y$において, 
$f$が$d_1$で連続であれば, $f$は$d_2$で連続である.
$f$が$d_2$で連続であれば, $f$は$d_1$で連続である.
:::

連続かどうかを述べるのに, どんな種類の距離でも使える.. この真実はある直感を与える.

**連続性の本質は距離空間ではない**


## 開球を用いた定義
ここで, 開球を定義しよう.
$$
B_\epsilon(a) = \set{x \in X | d(x, a) < \epsilon}
$$
これを使うと, 収束は次のように書ける.
> 任意の正の実数$\epsilon$に対して, ある自然数$n_0$が存在して, 
> $$
> n > n_0 \implies a_n \in B_\epsilon(a)
> $$

また, 連続は次のように書ける.

> 任意の正の実数$\epsilon$に対して, ある実数$\delta$が存在して,
> $$
> x \in B_\delta(x_0) \implies f(x) \in B_\epsilon(f(x_0))
> $$
> が成り立つとき, $x_0$で連続であるという.

さらに式変形しよう.

> 任意の正の実数$\epsilon$に対して, ある実数$\delta$が存在して,
> $$
> x \in B_\delta(x_0) \implies x \in f^{-1}(B_\epsilon(f(x_0)))
> $$
> が成り立つとき, $x_0$で連続であるという.

ここで包含関係を使うと, 連続は次のように書ける.
> 任意の正の実数$\epsilon$に対して, ある実数$\delta$が存在して,
> $$
> B_\delta(x_0) \subset f^{-1}(B_\epsilon(f(x_0)))
> $$
> が成り立つとき, $x_0$で連続であるという.

そう, 連続とは$f(X)$の開球の逆像が$X$の開球を含むことである.

$$
\begin{aligned}
b\in f^{-1}(B_\epsilon(f(a))) \\
\epsilon' + d(f(a), f(b)) = \epsilon
\end{aligned}
$$
とすれば, $B_{\epsilon'}(f(b)) \subset B_\epsilon(f(a))$が言える.  ここから,
$$
f^{-1}(B_{\epsilon'}(f(b))) \subset f^{-1}(B_\epsilon(f(a)))
$$

また, $f$は$b$に関しても連続なので, 
$$
B_\delta(b) \subset f^{-1}(B_{\epsilon'}(f(b))) \subset f^{-1}(B_\epsilon(f(a)))
$$

つまり, $f^{-1}(B_\epsilon(f(a)))$はその中から適当に$b$を取ると, その$b$を中心とする開球が含まれるような集合である.

このように, 内部に開球を含む集合を開集合と呼ぶ.
つまり, $f^{-1}(B_{\epsilon}(f(a)))$は開集合である.
なお, $B_\epsilon(f(a))$も開集合である.
これは, 上と同じ議論で導ける.

開集合を使って, 連続性を定義すると,
:::math[連続の定義]{.lemma}
$f: X \to Y$が連続であるとは, 任意の開集合$U \subset Y$に対して, $f^{-1}(U)$が開集合であることである.
:::
