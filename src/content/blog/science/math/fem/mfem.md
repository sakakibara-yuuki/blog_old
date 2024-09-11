---
title: "mfemによる有限要素法"
author: "sakakibara"
description: "mfemによる有限要素法"
heroImage: "/science/science.jpg"
pubDate: 2024-04-27
tags: ["math", "fem", "mfem"]
---

# mfem
mfemはローレンス・リバモア国立研究所が開発している有限要素法のライブラリであり、C++で書かれている。一応python wrapperもあるが、あまりドキュメントが揃っていないので、C++で書くことにする。

mfemの作成にあたり参考にされている成書や論文は以下、

- [Numerical Solution of Partial Differential Equations](https://www.amazon.com/dp/048646900X) by the Finite Element Method by Claes Johnson
- [Theory and Practice of Finite Elements](https://www.amazon.com/dp/144191918X) by Alexandre Ern and Jean-Luc Guermond
- [Higher-Order Finite Element Methods](https://www.amazon.com/dp/158488438X) by Pavel Šolín, Karel Segeth and Ivo Doležel
- [High-Order Methods for Incompressible Fluid Flow](https://www.amazon.com/dp/0521453097) by Michel Deville, Paul Fischer and Ernest Mund
- [Finite Elements: Theory, Fast Solvers, and Applications in Elasticity Theory](https://www.amazon.com/dp/0521705185) by Dietrich Braess
- [The Finite Element Method for Elliptic Problems](https://epubs.siam.org/doi/book/10.1137/1.9780898719208) by Philippe Ciarlet
- [The Mathematical Theory of Finite Element Methods](https://www.springer.com/us/book/9780387759333) by Susanne Brenner and Ridgway Scott
- [An Analysis of the Finite Element Method](https://www.amazon.com/dp/0980232708) by Gilbert Strang and George Fix
- [The Finite Element Method: Its Basis and Fundamentals](https://www.amazon.com/dp/1856176339/) by Olek Zienkiewicz, Robert Taylor and J.Z. Zhu

またmfemのPDEに関するクラスは以下の様に成っている。

### Primal and Dual Vectors(双対ベクトル空間)
有限要素法において多くの場面ででベクトルとその微分を必要とする. MFEMはGridFunction, LinearForm、Vectorクラスを提供している。これらを使用することでベクトルが果たす様々な役割を区別することができる。

おそらく、位置を表す量としてのベクトル、写像としてのベクトル(双対ベクトル)、速度ベクトルとしてのベクトルを区別するために、という意味だと思われる。

### Bilinear Form Integrators(二次形式積分作用素)
二次形式積分作用素は有限要素法の心臓であり、これは個別のメッシュ要素上で(または辺上や面上で)の基底関数の積の積分を計算するために使われる。
BilinearFormクラスはいくつかのBilinearFormIntegratorsを追加することで大域的な疎の有限要素行列を作成作成することができる。

コメントは特になし、おそらく剛性行列や全体行列とよばれる有限要素の基底ベクトルの内積計算により得られる行列を計算し、疎行列を得るためのクラスだと思われる。これは弱形式において、二次形式に該当する。
たとえば、
$$
a(u, v) = \int_{\Omega} \nabla u \cdot \nabla v \, dx
$$

### Linear Form Integrators(一次形式積分作用素)
一次形式積分作用素は二次形式積分作用素と同様の役割を果たすが、LinearFormクラスはLinearFormIntegratorsを追加し、一般的に右辺項を計算するために使用される。
$$
-\nabla u = f
$$
の場合、右辺$f$は離散化の際、任意の$v$に対して成り立つことから
$$
-\nabla u(v) = f(v) = \langle f, v \rangle
$$
となり、右辺は一次形式となる。
### Integration(積分)
これはカスタムなBilieanr FromやLinear Formを作成するためのクラスである。

### Coefficients(係数)
Coefficientオブジェクトは一般的な関数であり、
特定の初期条件、境界条件、または解析な手法と同等に, 一次、二次形式のPDE係数を表現できる程度に連続である。

### Nonlinear Form Integrators(非線形形式積分作用素)
非線形形式積分は一般的な非線形有限要素演算子の局所作用を表現するために使用される。
加えて、それらは局所勾配演算子を組み立て、局所エネルギーを計算することができる。

### Linear Interpolators(線形補間)
二次形式や一次形式とは異なり、線形補間は積分が機能しない。しかし、ある基底関数(もしくは、基底関数の線形関数)から他の基底関数へ射影する。DiscreteLinearOperatorクラスはLinearInterpolatorsを大域的疎行列表現を作成するために使用する。

### Weak Formulations(弱形式)
弱形式は有限要素法の心臓であり、有限要素近似はほとんど望ましい近似解よりなめらかではない。
弱形式は微分不可能な関数の微分近似を意味する。

### Boundary Conditions(境界条件)
利用できる境界条件の種類と適用方法は使用する離散化に依存する。ここでは、どのように特定のクラスの問題に対して様々な境界条件を強制するかについて説明する。

### compile
通常、以下でコンパイルする。
```
g++ ex0.cpp -lmfem -I/usr/include/hypre
```

### Mesh 
```cpp
Mesh mesh(filename);
mesh.uniformRefinement();
```
`Mesh`には多くのコンストラクタがあるが、今回は

```cpp
Mesh (const std::string &filename, int generate_edges=0, int refine=1, bool fix_orientation=true)
```
を使用している。このクラスは大域的なメッシュを作成するためのクラスであり、内部でElementというクラスを使用している。これはmeshの書く要素を表すクラスであり、MeshはElementを配列として扱っている。(コンポジション)
逆に、MeshはFinitieElementSpaceというクラスから参照されている。
ElementからHexahedron, Point, Quadrilateral, ...などが派生している。

```cpp
mesh.uniformRefinement();
```
はメッシュを一様に細かくするための関数である。
要素を指定して細かくすることができるらしいが、
今回は全体のelementをメッシュする
```cpp
void mfem::Mesh::UniformRefinement(int ref_algo = 0)
```
を使用している。`ref_algo=0`であるならば、algolithm Aを使用し、三角メッシュを使用する。
非ゼロならalgorithm Bを使用し、より高精度なメッシュを作成する。

### H1_FECollection
```cpp
H1_FECollection fec(order, dim, basis_type);
```
様々な次元における同一の族($H^1, L^2, \ldots$)から得られる有限要素のあつまり。
このクラスはFiniteElementSpaceの自由度を要素間で一致させるために使用されます。
また、有限要素からその境界までの有限要素を制限するためにも使用されます。

### FiniteElementSpace
```cpp
FiniteElementSpace fespace(&mesh, &fec);
```
FiniteElementSpaceは所与のmeshのFEM viewを提供し、主に自由度の集合を計算するために使用されます。

### GridFunction
```cpp
GridFunction x(&fespace);
```
グリッド関数のクラス。関連するFE空間を持つベクトル。


<!-- ### ConstantCoefficient -->
<!-- ### LinearForm -->
<!-- ### BilinearForm -->
