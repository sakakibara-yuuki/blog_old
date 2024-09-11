---
title: "gmshのノードオーダリング"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: "/science/science.jpg"
pubDate: 2024-03-24
tags: ["math", "fem", "gmsh", "有限要素法"]
---

## gmsh

gmshのノードオーダリングについては以下にあるように、ノードの順番と辺などの関係が示されている。特に、要素によっては面などが構成されない可能性がある。
tetrahedron4(4)の場合、4ノードであり、辺は構成されない。
tetrahedron10(11)の場合、4ノードであり、辺に6ノードが構成される。
tetrahedron10(29)の場合、4ノードであり、辺に12ノード、面に4ノードが構成される。
また、nodeという言葉とverticeという言葉を使い分けていることがわかる。

nodeは頂点であれ、辺であれ、面であれ、メッシュの分点を意味するのにたいして、verticeは要素の頂点を意味する。

もっと言ってしまうと、nodeは節点であり、verticeは頂点である。

要素のnode(節点)のOrderingは以下の順序がある。

1. 要素の主要な頂点
1. 辺の節点
1. 面の節点
1. 体の節点

高次の節点は低次の節点に埋め込まれるようにしてナンバリングされる。
辺のノードは番号の小さい方から大きい番号へと向きがつけられる。
面の向きは法線が外を向くように決められている。

### attention

```python
gmsh.model.mesh.getElementEdgeNodes
```

この関数は`prime`を指定しないと、辺の節点も含めて取得することになる。
中点を含めた辺タグは存在しない。
また、この取得順序は

```python
gmsh.model.mesh.getElements
```

と同じ順序になる。
また、余談だが、この他にも

```python
gmsh.model.mesh.getJacobians
```

も同じ順序になる。
しかし、

```python
gmsh.model.mesh.getAllEdges
```

などは異なる順序になる。

```python
gmsh.model.mesh.getEdges
```

辺タグを取得する。要素の頂点通しを結んだ線であり、辺の節点は含まれない。
また、向きはbasisFunctionと同じ向きになっている。

[gmsh nord ordering](https://gmsh.info/doc/texinfo/gmsh.html#Node-ordering)

### gmsh OpenCASCADE operation

gmshのmodelモジュールはOpenCASCADEのラッパーを実装している。
occと略されるこのモジュールは、OpenCASCADEの機能をgmshで使うことができる。
[gmsh.model.occ](https://gmsh.info/doc/texinfo/gmsh.html#Namespace-gmsh_002fmodel_002focc_002fmesh)

特によくわからないのが、OpenCASCADEのブーリアン演算である。
基本的にはOpenCASCADEの機能を使っているので、OpenCASCADEのドキュメントを参照することになる。
[OpenCASCADE](https://dev.opencascade.org/doc/overview/html/specification__boolean_operations.html#specification__boolean_1)

- fuse (Union two groups): $fuse(A, B) = A \cup B$
- intersect (Intersection of two groups): $intersect(A, B) = A \cap B$
- cut (difference between two groups): $cut(A, B) = A \backslash B$
- fragment : $fragment(A, B) = A \backslash B,\ A \cap B,\ B\backslash A$

```python
import gmsh

gmsh.initialize()
S1 = gmsh.model.occ.addSphere(-0.5, 0, 0, 1)
S2 = gmsh.model.occ.addSphere(0.5, 0, 0, 1)
# S = gmsh.model.occ.fuse([(3, S1)], [(3, S2)])
# S = gmsh.model.occ.intersect([(3, S1)], [(3, S2)])
# S = gmsh.model.occ.cut([(3, S1)], [(3, S2)])
S = gmsh.model.occ.fragment([(3, S1)], [(3, S2)])
gmsh.model.occ.synchronize()
gmsh.model.mesh.generate(3)
gmsh.fltk.run()
gmsh.finalize()
```

## 四面体

$(0, 0, 0), (1, 0, 0), (0, 1, 0), (0, 0, 1)$の四面体を考える。
その体積は

$$
V = \frac{1}{3} \times \frac{1}{2} \times 1 \times 1 = 1.6666\ldots
$$

となる。

gmshではこの四面体の体積座標$(\lambda_1, \lambda_2, \lambda_3, \lambda_4)$は以下のようになる。  
有限要素法では対象とするエンティティの座標系$(x, y, z)$、  
四面体の座標系$(\xi_1, \xi_2, \xi_3)$、  
そして四面体の体積座標系$(\lambda_1, \lambda_2, \lambda_3, \lambda_4)$を考える必要がある。  
gmshで得られるJacobianはエンティティの座標系から四面体への座標系の変換である。  
gmsh内部で計算される四面体の体積座標系は以下のようになる。

$$
\begin{aligned}
\lambda_1 &= \frac{\xi_2 + 1}{2} \\
\lambda_2 &= -\frac{1 + \xi_1 + \xi_2 + \xi_3}{2} \\
\lambda_3 &= \frac{\xi_1 + 1}{2} \\
\lambda_3 &= \frac{\xi_3 + 1}{2} \\
\end{aligned}
$$

これはあまり一般的ではない。が、gmshではこれを採用している。

## gmshのbasisFunctionとinterpolation

例えば、gmshで四面体要素を作成した場合、その節点要素は以下のようになる。
$1$次要素の場合、節点は$4$つである。
そのため、$4$つの形状関数を用いて四面体の内部の値は以下のように求めることができる。

$$
u(\bm{x}) = u_1N_1(\bm{x}) + u_2N_2(\bm{x}) + u_3N_3(\bm{x}) + u_4N_4(\bm{x})
$$

$2$次要素の場合、節点は$10$個である。

$$
\begin{aligned}
u(\bm{x}) &= u_1N_1(\bm{x}) + u_2N_2(\bm{x}) + u_3N_3(\bm{x}) + u_4N_4(\bm{x}) \\
          &+ u_5N_5(\bm{x}) + u_6N_6(\bm{x}) + u_7N_7(\bm{x}) + u_8N_8(\bm{x}) \\
          &+ u_9N_9(\bm{x}) + u_{10}N_{10}(\bm{x}) \\
\end{aligned}
$$

たとえば、四面体内部の点$\bm{x}$における点の値は  
$1$次要素の場合、

$$
\begin{aligned}
\bm{x} &= x_1N_1(\bm{x}) + x_2N_2(\bm{x}) + x_3N_3(\bm{x}) + x_4N_4(\bm{x}) \\
\end{aligned}
$$

$2$次要素の場合、

$$
\begin{aligned}
\bm{x} &= x_1N_1(\bm{x}) + x_2N_2(\bm{x}) + x_3N_3(\bm{x}) + x_4N_4(\bm{x}) \\
          &+ x_5N_5(\bm{x}) + x_6N_6(\bm{x}) + x_7N_7(\bm{x}) + x_8N_8(\bm{x}) \\
          &+ x_9N_9(\bm{x}) + x_{10}N_{10}(\bm{x}) \\
\end{aligned}
$$

<!-- 特に、$x_1, x_2, x_3, \ldots$などは節点の座標だが$\lambda_i(\bm{x})$ -->

特に、$x_1, x_2, x_3, \ldots$などはその点における体積座標だ。

### ガウス・ルジャンドル積分

そのため、四面体の体積はガウス・ルジャンドル積分を用いると以下のようになる。

$$
V = \int\bm{x}\mathrm{d}V
$$
