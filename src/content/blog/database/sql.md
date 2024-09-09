---
title: 'SQLの整理'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/database/sql.webp'
pubDate: 2024-08-05
tags: ["database", "sql"]
---

# Introduction
[スッキリわかるSQL入門](https://book.impress.co.jp/books/1123101107)を読んでみた.
今更SQLの入門書かよ...と思ったけどかなりわかりやすかった.
この記事はその本を読んで学び, 残したいと思った内容をまとめたものである.
なお, ~~part9~~part12以降は別の本, [達人に学ぶDB設計 徹底指南書](https://www.amazon.co.jp/dp/B00EE1XPAI)と一緒にまとめる.


先に感想を述べる.
この本は天文対話と同じく教師と生徒の対話方式で進んでいく.
帯に定番本とあるが, その文言は決して偽りや過言ではない.
SQLの基本的な構文を覚えやすく整理して提示されていて, それぞれの共通点, 相違点を明確に示しているので非常に頭に入りやすい.
章のはじめに生徒が困難を抱え, それを教師がSQLの新しい構文を教えることにより解決するという構成になっている.
前の章までの知識ではできなかったことが次の章でできるようになっているので読んでいて力がついていく感覚がある.
そのような, 章と章の間は繋がりがある一方, 章を個別に読んでも理解できるようになっている.

★★★★★

なお, この文章では関係代数をベースにこの本の内容をまとめ直している.
そのため, この文章ほど本はわかりにくくない.

---


DBMはいくつか存在する.
- [PostgreSQL](https://www.postgresql.org/docs/)
- [MySQL](https://dev.mysql.com/doc/)
- [MariaDB](https://mariadb.com/docs/server/)

(MariaDBのドキュメントがネストが深すぎて死ぬほど読みにくい.
PostgreSQLのドキュメントは日本語記事ばかりで検索汚染されている.
MySQLはまあまあ読みやすい.)

リレーショナルDBというのは文字通りリレーション(関係)をもつデータベースのことである.
(関係)とは数学的には直積集合の部分集合を言う.
例えば(社員番号, 名前, 部署番号)の組をもつデータを考える.
この場合, 社員番号, 名前, 部署番号それぞれを属性と呼ぶ. 一般に属性の頭文字attributeの$A$を用いて表現される.
属性全体を集めた集合を属性集合と呼び, これを$A$で表す.

$A = \set{A_0, A_1, \ldots ,\ A_{N-1}}$

属性は取りうる値の集合の添字となる. 取りうる集合をドメインと呼び$D$で表す.
それは例えば, $0$以上$100$以下の整数全体であったり, $10$文字以下の文字列全体であったりする.
ドメイン全体を集めた集合をドメイン集合と呼び, これを$\mathcal{D}$で表す.

$\mathcal{D} = \set{D_0, D_1, \ldots , D_{N-1}}$

$(A, \mathcal{D})$の組をスキーマと呼び, これを$R$で表す.  
または, $R(A_0: D_0, A_1: D_1, \ldots, A_{N-1}:D_{N-1})$のようにして表現する.

DBで扱うような対象をどのように数学的に表現するかについてのモデルを関係モデルと呼ぶ.
関係モデルにおいては２つの方法がある. 一つがリレーションを直積の部分集合として表現する方法であり, もう一つがリレーションを関数として表現する方法である.　なお, これらは見かけは異なるが等価である.

１つ目, リレーションを直積の部分集合として表現する(古典的?)な観点から, 数学的な関係は$D_0 \times D_1\ldots \times D_{N-1}$の部分集合を表す.  
そこで, $r(R) \subset D_0 \times D_1\ldots \times D_{N-1}$をリレーションと呼び. 
$t \in r(R)$をタプル(組)と呼び定義する.

２つ目, リレーションを関数の集合として表現する手法としてタプルを属性に対してドメインの値を対応させる写像として表現する.
$$
t_i: A \to \bigcup_{D\in\mathcal{D}}D
$$
としたとき,
$$
r(R) \subset \set{ t_i \mid t_i: A \to \bigcup_{D\in\mathcal{D}}D }
$$
をリレーションと呼び定義する.

この定義では例えば, DBでの$i$行目のデータは$t_i(\text{社員番号}) = 101, t_i(\text{名前}) = \text{"田中"}, t_i(\text{部署番号})=02$のように表現できる.

基本的に２つ目の定義の方が数学的に厳密でなおかつシンプルである. なので, 基本的に２つ目の定義を採用する.

属性はそれぞれ異なっていなければならず, リレーションでは(集合なので)重複するタプルは存在してはならない.
表形式ではタプルを行として表現するが, その順序に本質的な意味はない.
また, 属性の順序も本質的な意味はない.

リレーションモデルでは次の4つの構造を入れる.
1. ドメイン制約
1. キー制約
1. 参照整合性制約
1. 従属性

ドメイン制約とは
<div style="border: 1px solid black; border-radius: 10px;">
ドメイン制約
<ul>
    タプルの取りうる値がドメインに含まれていなければならない.
</ul>
</div>
ことである.

例えば, 社員番号が整数であることや, 食費が正の実数であることなどがこれにあたる.
(どちらかといえば値域を制限している気がするがなぜかドメイン(定義域)制約という.)

残りについては後述する.

## Contents
## SQLのコマンド4つ
SQLには主に4つのコマンドがある.

- SELECT
- UPDATE
- DELTE
- INSERT

である.

SQLで混乱をきたしやすいのはこれらコマンドの構文を混合して覚えてしまうことだ.
そこで, それぞれのコマンドの構文の関係を整理してみる.

<table>
    <tr>
        <th style="text-align: center;">命令</th>
        <th style="text-align: center;">命令固有の文</th>
        <th style="text-align: center;">行の絞り込み</th>
        <th style="text-align: center;">その他装飾</th>
    </tr>
    <tr>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 10px 10px 50px #bdbdbd,
                   -10px -10px 50px #ffffff;">SELECT</td>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 9px 9px 45px #bdbdbd,
                   -9px -9px 45px #ffffff;">FROM テーブル名</td>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 8px 8px 40px #bdbdbd,
                   -8px -8px 40px #ffffff;">WHERE</td>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 6px 6px 30px #bdbdbd,
                   -6px -6px 30px #ffffff;">その他</td>
    </tr>
    <tr>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 10px 10px 50px #bdbdbd,
                   -10px -10px 50px #ffffff;">UPDATE</td>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 9px 9px 45px #bdbdbd,
                   -9px -9px 45px #ffffff;">テーブル名</td>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 8px 8px 40px #bdbdbd,
                   -8px -8px 40px #ffffff;">WHERE</td>
        <td></td>
    </tr>
    <tr>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 10px 10px 50px #bdbdbd,
                   -10px -10px 50px #ffffff;">DELETE</td>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 9px 9px 45px #bdbdbd,
                   -9px -9px 45px #ffffff;">FROM テーブル名</td>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 8px 8px 40px #bdbdbd,
                   -8px -8px 40px #ffffff;">WHERE</td>
        <td></td>
    </tr>
    <tr>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 10px 10px 50px #bdbdbd,
                   -10px -10px 50px #ffffff;">INSERT</td>
        <td style="text-align: center;
                   border: 0px solid black;
                   border-radius: 5px;
                   box-shadow: 9px 9px 45px #bdbdbd,
                   -9px -9px 45px #ffffff;">INTO テーブル名</td>
        <td></td>
        <td></td>
    </tr>
</table>

この表のように, 命令, 固有文, 行の絞り込み, その他装飾の4つの要素でSQLが構成されている.
実際にSQLを書く時は左から順に書いていくと良いだろう.

1. 命令を書く
1. テーブル名を書く
1. テーブルより後ろの文を書く
1. テーブルより前の文を書く(SELECTのみ)


## WHERE句
WHERE句は行の絞り込みを行うための句である.  

テーブルを$T= \set{A_0, A_1, \ldots ,A_{n-1}}$とする.  
たとえば, $v$より大きい$A_j$の要素ををもつ行を取り出す場合, 取り出したタプルの集合$R'$は次の様に表される.

$$
R' = \{ t_i \mid t_i(A_j) > v,\ i \in \mathbb{N} \}
$$

そしてこれはSQLでは次のように表現される.

```sql
SELECT * FROM T WHERE A_j > v
```

where句には条件( 命題 )を指定する.  
指定できる条件( 命題 )には次のようなものがある.

| 条件 | 意味 |
| --- | --- |
|Exp > a| 比較演算子 |
|Exp IS NULL| NULL演算子 |
|Exp LIKE '%田中%'| LIKE演算子 |
|Exp BETWEEN a AND b| BETWEEN演算子 |
|Exp IN ('b', 'a')| IN演算子 |
|Exp < ANY(100, 200, 300)| ANY演算子 |
|Exp < ALL(100, 200, 300)| ALL演算子 |
|A AND B| 論理演算子 |

論理演算子には優先順位がある. `NOT` > `AND` > `OR`の順である.
(ANDとORはアルファベット順と同じ優先順位)

## 主キー
各行を一意に区別するために, 各行は異なる値をもつ属性を持つ必要がある.
各行が異なる値を持つ属性として, 社員番号や学籍番号などが挙げられる.
これら番号が持つべき共通の性質として以下がある.

- 社員番号を持たない社員が存在しない.
- 同じ社員番号が複数の社員に割り当てられていない.

このような属性を主キーと呼ぶ. 主キーは以下の性質を持つ.

<div style="border: 1px dashed black; border-radius: 10px;">
<ul>
    <li>NULLではない.</li>
    <li>行は重複しない.</li>
    <li>一度値が設定されたら変更されない.</li>
</ul>
</div>


属性集合に主キーとなる属性がある場合, その属性を**自然キー**(natural key)と呼ぶ.
属性集合に主キーとなる属性が無い場合, 主キーとなる属性を追加することが強く推奨される.
このようにして作られた属性を**人工キー**(artifical key), または, **代替キー**(surrogate key) と呼ぶ.

また, 複数の主キーが存在する場合, それらを**キー** または**候補キー**(candidate key)と呼ぶ.
選ばれなかった候補キーを**代替キー**(alternative key)と呼ぶ.  
surrogate と alternative では異なる意味であるが, 日本語ではどちらも"代替キー"で被っているの注意が必要である.

また, 主キーが存在しない場合でも, 属性集合のある部分集合が主キーの役割を果たす場合がある.
複数の属性を集めた集合が主キーと同じ性質をもつ場合, これを**複合キー**(composite key), **複合主キー**と呼ぶ.

<!-- より抽象的に属性集合の部分集合でタプルを一意に決定するものを**スーパーキー**(super key)と呼ぶ. 主キーも候補キーも複合キーもスーパーキーである.   -->
<!-- この立場から見ると, スーパーキーのうち一点集合の和集合が候補キーであり, その中から一つ選んだものが主キーであると言える. -->
<!-- また, スーパーキーのうち一点集合を除いたものが複合キーと言える. -->

ここで2つ目の制約であるキー制約について説明しよう.
キー制約とは
<div style="border: 1px solid black; border-radius: 10px;">
キー制約
<ul>
    <li>候補キーの属性値が同じタプルが存在してはならない </li>
    <li>主キーはNULLであってはならない</li>
</ul>
</div>
という制約である.

<!-- より厳密には -->
<!-- 属性集合$A$の部分集合$S$がスーパーキーであるとは, -->
<!---->
<!-- $$ -->
<!-- \forall t, t' \in r(R),\ t(S)=t'(S) \Rightarrow t=t' -->
<!-- $$ -->
<!---->
<!-- となることである.   -->
<!-- 翻って, 候補キーとは属性集合$A$の部分集合$C$であって, スーパーキー$S$であるもののうち最小のものであり当然, 上と同じ命題を充たす. -->

複合キーとは属性集合$A$の部分集合$C$であって
$$
\forall t, t' \in r(R),\ t(C)=t'(C) \Rightarrow t=t'
$$
候補キーとは属性集合$A$の部分集合$Ca$であって,
$$
\forall t, t' \in r(R),\ \forall C_i \in Ca,\ t(C_i)=t'(C_i) \Rightarrow t=t'
$$
$Ca$の元を主キーと呼ぶ.

## その他装飾
SELECTに使われる装飾には以下のようなものがある.

| キーワード | 意味 | 注意点 |
| --- | --- | --- |
| DISTINCT  A | 重複を除く | ... |
| ORDER BY A ASC| ソート | ASCで昇順, DESCで降順. ORDER BYをつけないとランダム |
| OFFSET - FETCH | 何行から何行を取得 | 対応してないDBMS(SQLite, ,MySQL, MariaDB)もある |
| UNION | 和集合 | 属性とそのドメインを揃える必要がある. ORDER BYは最後のSELECTに追加する必要がある. |
| EXCEPT | 差集合 | A \ BとB\ Aは異なる |
| INTERSECT | 積集合 | ... |

ここで, 関係代数における集合演算について説明する.
集合演算は基本的に6つの演算がある.

- 和
- 直積
- 差
- 選択
- 射影
- 属性名の変更

また, これらの演算から"積, 商, 自然結合"といった演算が定義される. 
<div style="display: flex; justify-content: space-evenly; gap: 3rem;">
<div style="flex: 3 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption>R</caption>
    <tbody>
    <thead style="height: 1rem;">
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 3 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption>S</caption>
    <tbody>
    <thead>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">a</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    </tbody>
</table>
</div>
</div>

### 和
$$
R \cup S = \set{t \mid t \in r(R) \lor t \in r(S)}
$$
<div style="display: flex; justify-content: center;">
<div style="min-width: 10rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;">
    <caption> R u S </caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">a</td>
    </tr>
    </tbody>
</table>
</div>
</div>

```sql
SELECT * FROM R
UNION
SELECT * FROM S
```

### 差
$$
R \setminus S = \set{t \mid t \in r(R),\ t \notin r(S)}
$$
<div style="display: flex; justify-content: center;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> R \ S </caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>

```sql
SELECT * FROM R
EXCEPT
SELECT * FROM S
```

### 直積  
$$
\begin{aligned}
t\star s &: A \times S \to t(A) \cup s(S) \\
R \times S &= \set{t\star s \mid t \in r(R), s \in r(S)}
\end{aligned}
$$
<div style="display: flex; justify-content: space-evenly; gap: 3rem;">
<div style="flex: 3 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption>R</caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 3 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption>S</caption>
    <tbody>
    <thead>
    <tr>
        <th>D</th>
        <th>E</th>
        <th>F</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">d</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">b</td>
    </tr>
    </tbody>
</table>
</div>
</div>

<div style="display: flex; justify-content: center;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 20rem;">
    <caption>R x S</caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
        <th>D</th>
        <th>E</th>
        <th>F</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">d</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">b</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">d</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">b</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">d</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">b</td>
    </tr>
    </tbody>
</table>
</div>

同じ属性が$R, S$に存在する場合は属性名を変更する必要がある.  
$R.A_i$, $S.A_i$のようにして新たな属性名をつける.

```sql
SELECT * FROM R, S
```

### 選択  
$P_F$は$t$が与えられた時に真偽を返す述語である.
$$
\sigma_{F} (R) = \set{t \mid t \in r(R), P_F(t)}
$$

<div style="display: flex; justify-content: space-evenly; gap: 3rem;">
<div style="flex: 3 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption>R</caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 3 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption>Sigma {C=c} (R)</caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>
</div>

```sql
SELECT * FROM R WHERE C = 'c'
```

### 射影
$$
\pi_{A'} (R) = \set{t \mid t \in r(R),\ t(A') \subset t(A)}
$$
<div style="display: flex; justify-content: space-evenly; gap: 3rem;">
<div style="flex: 3 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption>R</caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 2 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 9rem;">
    <caption>Pi {A, C} (R)</caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    </tbody>
</table>
</div>
</div>

重複しているものは取り除かれていることに注意する.

```sql
SELECT A, C FROM R
```

### 積(共通部分)
$$
R\cap S = R \setminus (R \setminus S)
$$

<div style="display: flex; justify-content: space-evenly; gap: 3rem;">
<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption>R</caption>
    <tbody>
    <thead style="height: 1rem;">
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption>S</caption>
    <tbody>
    <thead>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">a</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    </tbody>
</table>
</div>
</div>

<div style="display: flex; justify-content: space-evenly; gap: 3rem;">
<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> R \ S </caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> R n S </caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    </tbody>
</table>
</div>
</div>

```sql
SELECT * FROM R
INTERSECT
SELECT * FROM S
```

### 商
$$
R \div S = \pi_{A'}(R) \setminus \pi_{A'}(\pi_{A'}(R) \times S \setminus R)
$$
<div style="display: flex; justify-content: space-evenly; gap: 3rem;">

<div style="flex: 6 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;">
    <caption> R </caption>
    <tbody>
    <tr>
        <th style="min-width: 1rem;">A</th>
        <th style="min-width: 1rem;">B</th>
        <th style="min-width: 1rem;">C</th>
        <th style="min-width: 1rem;">D</th>
        <th style="min-width: 1rem;">E</th>
        <th style="min-width: 1rem;">F</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">d</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">b</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">d</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">b</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">d</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">b</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 2 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;">
    <caption> S </caption>
    <tbody>
    <tr>
        <th style="min-width: 1rem;">C</th>
        <th style="min-width: 1rem;">D</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">f</td>
    </tr>
    </tbody>
</table>
</div>
</div>

SQLでは商はサポートされていない.
### 結合
$$
\begin{aligned}
R \Join_{F} S &= \sigma_{F}(R \times S) \\
&= \set{t\star u \mid t \in r(R), u\in r(S), P_F(t, u)} 
\end{aligned}
$$
ここで, $P_F$は述語である.
<div style="display: flex; justify-content: space-evenly; gap: 3rem;">
<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> R </caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">3</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">5</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">3</td>
        <td style="border: 1px solid black;">4</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> S </caption>
    <tbody>
    <tr>
        <th>C</th>
        <th>D</th>
        <th>E</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">4</td>
        <td style="border: 1px solid black;">5</td>
        <td style="border: 1px solid black;">3</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">4</td>
        <td style="border: 1px solid black;">4</td>
        <td style="border: 1px solid black;">6</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">5</td>
        <td style="border: 1px solid black;">5</td>
        <td style="border: 1px solid black;">7</td>
    </tr>
    </tbody>
</table>
</div>
</div>

<div style="display: flex; justify-content: space-evenly; gap: 3rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> R Join B=C S </caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
        <th>D</th>
        <th>E</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">5</td>
        <td style="border: 1px solid black;">5</td>
        <td style="border: 1px solid black;">5</td>
        <td style="border: 1px solid black;">7</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">3</td>
        <td style="border: 1px solid black;">4</td>
        <td style="border: 1px solid black;">4</td>
        <td style="border: 1px solid black;">5</td>
        <td style="border: 1px solid black;">3</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">3</td>
        <td style="border: 1px solid black;">4</td>
        <td style="border: 1px solid black;">4</td>
        <td style="border: 1px solid black;">4</td>
        <td style="border: 1px solid black;">6</td>
    </tr>
    </tbody>
</table>
</div>

### 自然結合
$$
R \Join S = \pi_{A, B, C, D}(\sigma_{R.B = S.B, R.C = S.C)}(R \times S))
$$
結合では同じ属性名($B, C$)が存在するため, 属性名を変更するのが自然である.

<div style="display: flex; justify-content: space-evenly; gap: 3rem;">
<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> R </caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">f</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> S </caption>
    <tbody>
    <tr>
        <th>B</th>
        <th>C</th>
        <th>D</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">f</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">a</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>
</div>

<div style="display: flex; justify-content: center; gap: 3rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 20rem;">
    <caption> R x S </caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>R.B</th>
        <th>R.C</th>
        <th>S.B</th>
        <th>S.C</th>
        <th>D</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">f</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">a</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">f</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">a</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">f</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">a</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">f</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">a</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">f</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>


<div style="display: flex; justify-content: center; gap: 3rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 11rem;">
    <caption> R join S </caption>
    <tbody>
    <tr>
        <th>A</th>
        <th>B</th>
        <th>C</th>
        <th>D</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">a</td>
        <td style="border: 1px solid black;">b</td>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">a</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">c</td>
        <td style="border: 1px solid black;">d</td>
        <td style="border: 1px solid black;">e</td>
        <td style="border: 1px solid black;">c</td>
    </tr>
    </tbody>
</table>
</div>

```sql
SELECT * FROM R
NATURAL JOIN S
```

## 式と関数
### 式
where句の説明でExpという記号を使ったが, これは式を表す.
以降では式について説明する.

式はSELCTの文でよく使われる.
```sql
SELECT A1, A2+100, 'SQL' FROM T;
```
以上ではA1は列名, A2+100は式, 'SQL'は固定値となる.
これを実行すると, 列名が計算式そのもまま出力されるので`AS`がよく使われる.
また, `INSERT`, `UPDATE`などでも式が使われる.

基本的に式は`+, -, *, /`などの演算子を使って計算を行う.
これ以外にも特殊な演算として`CASE`演算がある.

```sql
CASE EXP WHEN V1 THEN R1
         WHEN V2 THEN R2
         ELSE R3
END
```

### 関数
式とは異なり, 関数はデータベースによって提供されるものである.
関数は各タプルで評価され, その結果を返す.
また, DBMS毎に実装されている関数が異なり, 互換性が少ないことに注意する必要がある.

ちなみに関数を自作することもできる.
これをユーザー定義関数(UDF)と呼ぶ.
また, 実行する複数のSQL文をまとめてプログラムのな形でDBMS内に保存し(あらかじめコンパイルしておいて), 外部から呼び出すこともできる. この機能を**ストアドプロシージャ**(貯めてある処理)と呼ぶ. ストアドプロシージャーは一度コンパイルされるためパフォーマンスの向上が期待でき、再利用可能なのでコードの重複を減らし保守性を向上させることができる. また, クエリを投げる回数が減るためネットワークのトラフィックの減少やSQLインジェクションのリスクを減らすことができる.

- [Postgresqlのストアドプロシージャー](https://www.postgresql.org/docs/current/sql-createprocedure.html)
- [MySQLのストアドプロシージャー](https://dev.mysql.com/doc/refman/9.0/en/create-procedure.html)
- [MariaDBのストアドプロシージャー](https://mariadb.com/kb/en/create-procedure/)

関数には以下のようなものがある.
(ただし, 関数を多用するとパフォーマンスが悪くなることがあるので注意が必要である.)

#### 文字にまつわる関数
| 関数 | 引数 | 戻り値 |
| --- | --- | --- |
| LENGTH | 文字列をドメインにもつ属性 | 文字の長さ |
| TRIM | 文字列をドメインにもつ属性 | 文字列の前後の空白を取り除いた文字列 |
| REPLACE | 文字列をドメインにもつ属性, 置換前の文字, 置換後の文字 | 置換後の文字列 |
| SUBSTRING | 文字列をドメインにもつ属性, 開始位置, 長さ | 開始位置から長さ分の文字列 |
| CONCAT | 文字列をドメインにもつ属性の列 | 連結した文字列 |

#### 数値にまつわる関数
| 関数 | 引数 | 戻り値 |
| --- | --- | --- |
| ROUND | 数値をドメインにもつ属性, 小数点以下の桁数 | 四捨五入した値 |
| TRUNC | 数値をドメインにもつ属性, 小数点以下の桁数 | 切り捨てた値 |
| POWER | 数値をドメインにもつ属性, 指数 | 累乗した値 |

#### 日付にまつわる関数
| 関数 | 引数 | 戻り値 |
| --- | --- | --- |
| CURRENT_TIMESTAMP | なし | 現在の日時 |
| CURRENT_DATE | なし | 現在の日付 |
| CURRENT_TIME | なし | 現在の時刻 |

#### 変換にまつわる関数
| 関数 | 引数 | 戻り値 |
| --- | --- | --- |
| CAST | 変換前の属性 AS 変換後のドメイン | 変換後のデータ |
| COALESCE(コアレス) | 属性や式の列 | NULLでない最初のデータ |

COALESCEは"もしNULLならこの値を返す"という関数である.

## 集計とGROUP
例えば, 売上の合計を求める場合, 以下のようにして集計できる.
```sql
SELECT SUM(売上) FROM 売上テーブル;
```
SUMは集計関数と呼ばれる機能の一つであり, 集計関数は該当する各行ではなく, 該当する行が集計された結果を返す.

一見, LENGTHなどと同じような関数のように見えるが, 関数と集計関数は異なる点が多い.
集計関数は集計の対象となったすべての行に対して一回だけ計算を行い, 一つの答えを返す.
**結果の表は必ず一つの行になる**.
すなわち, 集合を引数に取る集合関数なのである.

集計関数には以下のようなものがある.

| 関数 | 意味 |
| --- | --- |
| SUM | 各行の値の合計を求める |
| MAX | 各行の値の最大値を求める |
| MIN | 各行の値の最小値を求める |
| AVG | 各行の値の平均値を求める |
| COUNT | 行数をカウントする(なお, COUNT(* )だとNULL行を含めてしまう) |

### 集計の注意点
集計関数には関数や式と異なり注意するべき点がある.

- SELECT文の属性リストの中, ORDER BY句, HAVING句にしか書けない.
- 結果が非正規形であってはならない.
- 引数にできる属性のドメインに制限がある.
- NULLの扱いが集計関数毎によって異なる.

### グループ毎に分割して集計する
これまではテーブル全体に対して集計を行ってきたが, 例えば家計簿の中から費目毎に集計を行いたい場合があるだろう.
このような場合にはGROUP BY句を使う.

```sql
SELECT 費目, SUM(金額)
    FROM 家計簿テーブル
GROUP BY 費目;
```

GROUP BY句は集計関数と一緒に使うことが多く, 以下の手順で処理される.
1. WHERE句で行を絞り込む
1. グループ毎に分割する
1. 各グループを集計する
1. SELECT句で属性を絞り込む

複数列のグループ化も可能である. つまり, 属性$A_1, A_2$を基準にグループ化する場合, $(A_1, A_2)$の組をグループ化の基準として使う.


集計した結果に対してSELECTの条件($A_j > v$など)を指定したい場合, HAVING句を使う.
**集計関数はWHERE句では使えない**ことに注意が必要である.
WHERE句は行を絞り込むための句であるが, その時点では集計対象となる行(集計した結果)が決まっていないためである.

HAVING句はWHERE句と同じように条件を指定するが, 集計結果に対して条件を指定する.
HAVING句とWHERE句が異なるのは絞り込みが実行されるタイミングのみである.
HAVING句は集計結果が終わった段階で実行されるため, 集計関数を使うことができる.
たとえば, 費目で集計を行った後にその合計が0円以上のものだけをとりだす場合,
```sql
SELECT 費目, SUM(金額)
    FROM 家計簿テーブル
GROUP BY 費目
HAVING SUM(出金額) > 0;
```
のようになる.

### 集計テーブル
計算を一から全て行うのではなく, 集計するためのテーブルを作成するという運用もある.
このようにして作成されたテーブルを**集計テーブル**と呼ぶ.
主な運用は以下のようなものである.

1. 集計テーブルを作成する
1. 集計関数を用いて集計した結果を集計テーブルに更新する
1. 集計結果を参照する場合は, 既存の集計テーブルを参照する

ただし, 集計テーブルを作成するということは, データの重複を生むことになるため, データの整合性を保つためには注意が必要である(未更新が生じる).

## 副問合せ: サブクエリ
ひとまずSELECT文で何らかの検索結果を得て, 得られた具体的な値を用いてさらにSELECTやUPDATEなどを実行するというような場合がある.

ひとまずSELECT文で何らかの検索結果を得て, 得られた具体的な値を用いてさらにSELECTやUPDATEなどを実行したい場合, それを1つのSQL文で表現することができる.
他のSQL文の一部分として登場するSQL文を**副問合せ**, **サブクエリ**と呼ぶ.

副問い合わせが処理される順番は以下の通りである.

1. 副問合せのSQLが実行され, 具体的な結果を得る.
1. その結果を元に親のSQLが実行される.

また, 副問合せの返すテーブルのパターンによって以下のようなものが考えられる.
つまり,
問い合わせの結果が...
1. (1, 1)の場合: スカラ
1. (m, 1)の場合: ベクタ
1. (m, n)の場合: 行列
である.

### (1, 1)の場合: スカラ
単一の値を返すので, かなり多くの場所で使うことができる.
- SELECT文の属性リスト
- FROM句
- UPDATE文のSET句

Ex.
```sql
SELECT 日付, メモ, 出金額,
    (SELECT 合計 FROM 家計簿集計
     WHERE 費目 = '食費') AS 食費合計
FROM 家計簿;
WHERE 費目 = '食費';
```

### (m, 1)の場合: ベクタ
複数の値を返すので, リストのように使うことができる.
- WHERE句の条件( IN, ANY, ALLなど ), ただし <, >, = などの比較演算子には使えない
- SELECT文のFROM句

Ex.
```sql
SELECT * FROM 家計簿集計
WHERE 費目 IN (SELECT DISTINCT 費目 FROM 家計簿);
```

などである.
注意すべき点として, **単一の値の代わりに記述することはできない**
例えば, "=, >, <"などの比較演算子は使えない.
単位に順序が定義されていないからである.  
そのため, 複数行と比較したいときには, IN, ANY, ALLなどの演算子を使う必要がある.

NOT IN演算子の注意点として,
右辺に一つでもNULLが含まれている場合, NOT IN演算子は常に真を返す.  
どういうことかというと,
```sql
A NOT IN (B, C, NULL)
```
のような場合であると,
```sql
A != B ?
A != C ?
A != NULL ?
```
となるが, `A != NULL`はそもそもNULLとの比較ができないため, 
結果はNULLとなる.

### (m, n)の場合: 行列
表となるので, テーブルの代わりとして使うことができる.
- SELECT文のFROM句やINSERT文など

特に, INSERTで副問合せを使う.

```sql
INSERT INTO 家計簿集計(費目, 合計)
    SELECT 費目, SUM(出金額)
    FROM 家計簿
    GROUP BY 費目;
```
これで複数行のINSERTを一回のSQLで行うことができる.

## 結合と外部キー
通常, テーブルは複数に分けることになる.
基本的に, テーブルを複数のテーブルに分けると行数が少なくて済む.
これにはいくつかメリットがある.

1. 属性の取りうる値を変更する場合, 変更を少なくすることができる.
1. 属性に関連のある属性を新たに追加する場合, 関係ない属性と同じ表に載せなくて済む.
1. 特定のタプルを書き換える場合, 変更回数が少なくて済む(さもなければ, 漏らさず被らず行を検索しなければいけない).

実務上, 分けたテーブルを適切に結合して利用する.
そこで, 分けたテーブルを適切に結合するために**外部キー**(forigne key)が使われる.
そして, 外部キーこそがリレーションの中心的な役割を果たす.

<div style="display: flex; justify-content: space-evenly; gap: 3rem; flex-wrap: wrap;">
<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 20rem;">
    <caption> 家計簿テーブル(左) </caption>
    <tbody>
    <tr>
        <th>日付</th>
        <th>費目ID(FK)</th>
        <th>メモ</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">02-03</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">カフェラテ</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">02-05</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">昼食</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">02-10</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">1月の給料</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> 費目テーブル(右) </caption>
    <tbody>
    <tr>
        <th>ID</th>
        <th>名前</th>
    </tr>
    </thead>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">給料</td>
    </tr>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">食費</td>
    </tr>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">3</td>
        <td style="border: 1px solid black;">水道光熱費</td>
    </tr>
    </tbody>
</table>
</div>
</div>

上の例では, 家計簿テーブルの費目IDが費目テーブルのIDと対応している.
この場合, 左のテーブルの費目IDが外部キーとなる.
外部キーを使って, 2つのテーブルを結合することができる.

そこでは, 以下の手順で結合が行われる.

1. 左表の各行について, 右表の各行と条件が合致するかどうかを調べる.
1. 合致した行と取り出し, それらを一つの表にまとめる.

結合とは結合条件に合致する行を一つ一つ取り出して, それらを一つの表にまとめることである.
決して, 2つの表を単純にくっつけることではない.
<!-- (左表の属性が外部キーになることがあるのか？という疑問が生じるかもしれない.) -->

なお, より厳密には$FK$が$R$から$S$への外部キーであるとは
リレーション$R, S$に対して,
$$
\forall t \in R, \exist u \in S, t(FK) = u(PK)
$$
が成り立つことをいう.


### 結合の種類
あらゆる表が先程のように結合できるとは限らない.

例えば,
1. 外部キーにある値が参照先に複数存在する場合
1. 外部キーにある値が参照先に存在しない場合

外部キーにある値が参照先に複数存在する場合,
結合では左の表の行を必要な分だけ複製して結合する.
<div style="display: flex; justify-content: space-evenly; gap: 3rem; flex-wrap: wrap;">
<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 20rem;">
    <caption> 家計簿テーブル(左) </caption>
    <tbody>
    <tr>
        <th>日付</th>
        <th>費目ID(FK)</th>
        <th>メモ</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">02-03</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">カフェラテ</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">02-05</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">昼食</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> 費目テーブル(右) </caption>
    <tbody>
    <tr>
        <th>ID</th>
        <th>名前</th>
    </tr>
    </thead>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">給料</td>
    </tr>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">食費</td>
    </tr>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">水道光熱費</td>
    </tr>
    </tbody>
</table>
</div>
</div>

この例では, 費目IDが$1$の行が右のテーブルに2つ存在する.
この場合, 結合では左の表の行を必要な分だけ複製する.
<div style="display: flex; justify-content: space-evenly; gap: 3rem; flex-wrap: wrap;">
<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 20rem;">
    <caption> 家計簿テーブル(左) </caption>
    <tbody>
    <tr>
        <th>日付</th>
        <th>費目ID(FK)</th>
        <th>メモ</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">02-03</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">カフェラテ</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">02-05</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">昼食</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">02-05</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">昼食</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> 費目テーブル(右) </caption>
    <tbody>
    <tr>
        <th>ID</th>
        <th>名前</th>
    </tr>
    </thead>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">給料</td>
    </tr>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">食費</td>
    </tr>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">水道光熱費</td>
    </tr>
    </tbody>
</table>
</div>
</div>

それから結合する.

<div style="display: flex; justify-content: space-evenly; gap: 3rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;">
    <caption> 家計簿テーブル(左) </caption>
    <tbody>
    <tr>
        <th>日付</th>
        <th>費目ID(FK)</th>
        <th>メモ</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">02-03</td>
        <td style="border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">カフェラテ</td>
        <td style="border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">食費</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">02-05</td>
        <td style="border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">昼食</td>
        <td style="border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">給料</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">02-05</td>
        <td style="border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">昼食</td>
        <td style="border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">水道光熱費</td>
    </tr>
    </tbody>
</table>
</div>
のようになる.


外部キーにある値が参照先に存在しない場合,
結合では左の表の行を取り出すが, 右の表の行が存在しないため, その行の結合を諦める.

<div style="display: flex; justify-content: space-evenly; gap: 3rem; flex-wrap: wrap;">
<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 20rem;">
    <caption> 家計簿テーブル(左) </caption>
    <tbody>
    <tr>
        <th>日付</th>
        <th>費目ID(FK)</th>
        <th>メモ</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">02-03</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">カフェラテ</td>
    </tr>
    <tr>
        <td style="border: 1px solid black;">02-05</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">4</td>
        <td style="border: 1px solid black;">昼食</td>
    </tr>
    </tbody>
</table>
</div>

<div style="flex: 1 1rem;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 10rem;">
    <caption> 費目テーブル(右) </caption>
    <tbody>
    <tr>
        <th>ID</th>
        <th>名前</th>
    </tr>
    </thead>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">1</td>
        <td style="border: 1px solid black;">給料</td>
    </tr>
    <tr>
        <td style="background-color: #e0e0e0; width: 3rem; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">食費</td>
    </tr>
    </tbody>
</table>
</div>
</div>

ここでは, 費目IDが$4$の行が右のテーブルに存在しない.
のでその結合は諦める.
<div style="display: flex; justify-content: space-evenly; gap: 3rem; flex-wrap: wrap;">
<table style="border: 1px solid black;
              text-align: center;
              border-spacing: 0;
              width: 20rem;">
    <caption> 家計簿テーブル(左) </caption>
    <tbody>
    <tr>
        <th>日付</th>
        <th>費目ID(FK)</th>
        <th>メモ</th>
        <th>ID</th>
        <th>名前</th>
    </tr>
    </thead>
    <tr>
        <td style="border: 1px solid black;">02-03</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">カフェラテ</td>
        <td style="background-color: #e0e0e0; border: 1px solid black;">2</td>
        <td style="border: 1px solid black;">食費</td>
    </tr>
    </tbody>
</table>
</div>

のようになる.

ただし, 左の表の外部キーが右の表に存在しない場合にも(NULL)でいいから結合したい場合がある.
この場合, **左外部結合**を使う. (左の情報を残す)
また, その逆であるように,
右の表の外部キーが左の表に存在しない場合にも(NULL)でいいから結合したい場合がある.
この場合, **右外部結合**を使う. (右の情報を残す)
これまで見てきた通常の結合は**内部結合**と呼ばれる.

## トランザクション
電源が遮断されたとき, もしくはDBへの処理が途中で中断されたとき, 処理が途中で終わってしまうことがある.
これによって, データの整合性が壊れることがある.

よく言われるのが, 銀行から金を引き出す操作と実際に引き出す操作の間に処理が途中で終わってしまった場合に, 銀行から金を引き出したという記録は残っているが, 手元には引き出した金が無いという状況である.

このような問題を解決するために, 処理の終了と処理の確定を一体化させる仕組みが考えられた。これを**トランザクション**と呼ぶ.

上の例で言えば, 処理の開始を銀行から金を引き出す操作とし, 手元に金がある場合に処理を確定することで途中で処理が遮断されても, 処理が確定されていないので, もう一度トライできるというわけだ.

以上の例からトランザクションには以下のような性質が求められる.
- トランザクションの処理の状態は, 実行済みか, 未実行か, どちらかである.
- トランザクションは他のトランザクションに影響されない(独立している).

### 原子性
最初の性質を**原子性**(atomicity)と呼ぶ.
DBMSが扱うトランザクションは, この原子性を備える.

SQLにおいて, より具体的には
```sql
BEGIN;
INSERT INTO R(A1, A2, A3) VALUES (1, 2, 3); -- 処理1 --
DELETE FROM R WHERE A1 = 1; -- 処理2 --
COMMIT;
```
のようにして記述する.
この例では処理1と処理2をまとめてトランザクションとして扱っている.

なお, `COMMIT;`の代わりに`ROLLBACK;`を使うことで, それまでの処理を未確定として取り消すことができる. (上の例では, コマンドラインでの操作を想定している.)

なお, ほとんどのDBMSは, トランザクションを自動的に開始する.
一般には一つのSQLについて自動的にトランザクションが開始され, そのSQLが終了するとトランザクションが終了する.
これは自動コミットモード(auto commit mode)と呼ばれる.

### 独立性
2つ目の性質を**独立性**(isolation)と呼ぶ.

トランザクションが独立しているとは, 他のトランザクションに影響されないということである.
他のトランザクションの影響を受けるとどのような問題が生じるのだろうか.
#### ダーティーリード(書きかけを読む)
未確定の状態を途中で他のトランザクションが読み取ることをダーティーリードと呼ぶ.  
例えば, 金を引き出している途中に, 他の人が引き出した金額を見てしまうという状況である.
結果的に, トランザクションがRoll backされたとしても, 他のトランザクションはcommitされてしまうかもしれない. これによりデータの整合性が壊れる.

#### 反復不能読み取り(SELECT -> UPDATE -> SELECT)
同じトランザクション内で同じデータを読み取っても, 結果が異なることを反復不能読み取りと呼ぶ.  
具体的には, あるトランザクションでSELECTをして, 他のトランザクションがその次にUPDATEを行った場合, 次のSELECTで結果が異なることがトランザクションの中で生じることである.

#### ファントムリード(SELECT -> INSERT -> SELECT)
同じトランザクション内で同じ条件でSELECTをしても, 結果が異なることをファントムリードと呼ぶ.
反復不能読み取りと本質的には同じであるが, こちらはSELECTとSELECTの間でINSERTを行うことで行数が変化してしまう場合に生じる.
集計時に影響が生じることがある.


具体的には, SQLのトランザクションは(内部で)lockという仕組みを使って独立性を保っている.
lockはトランザクションが終了すると自動的に解除される.

トランザクションの独立性の程度を"トランザクションの分離レベル"と呼び, 以下の4つがある.
- READ UNCOMMITED
- READ COMMITED
- REPEATABLE READ
- SERIALIZABLE
下に行くほど細かい粒度でトランザクションを分離する.
当然だが, 下に行くほどトランザクションの処理速度は遅くなる.

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```
のようにして, トランザクションの分離レベルを設定することができる.

また, 自身でトランザクションの分離を制御することもできる.

| ロック | 対象 | SQL |
| --- | --- | --- |
| 行ロック | 特定の行をロックする | `SELECT ... FOR UPDATE` |
| 表ロック | 特定の表をロックする | `LOCK TABLE テーブル IN モード MODE` |
| データベースロック | データベース全体をロックする | `LOCK DATABASE データベース IN モード MODE` |

また, ロックのレベル(MODE)についても
- 共有ロック: 他のトランザクションのロックを許可(デフォルト)
- 排他ロック: 他のトランザクションのロックを許可しない
などを設定することができる.

#### ロックによる弊害: デッドロック
難儀なことに, ロックを使うことにより発生する問題がある.
その代表例がデッドロックである.

デッドロックとは, 2つのトランザクションA, Bが資源X, Yをロックする場合に生じる.
トランザクションAが資源Xをロックしており, トランザクションBが資源Yをロックしているとする.
トランザクションAはトランザクションBがロックを解除したら資源Yを使用する予定だが,  
トランザクションBはトランザクションAがロックを解除したら資源Xを使用する予定である.

この場合, トランザクションA, Bは互いに待ち状態が続くため, どちらもロックを解除することができない.

あなたがAさんだとして, Bさんが前から来る人であるとする.  
資源X, Yを(あなたから見て)右の道, 左の道とする.  
あなたは右の道を通りたいため, Bさんが右の道を譲るのを待っている.  
Bさんは左の道を通りたいため, あなたが左の道を譲るのを待っている.  
結果, どちらも譲らないため, どちらも進むことができない.  
(二人とも早く譲れよ... と思っている状況である.)  
このような状況である.  

デッドロックを回避するためには以下が考えられる.

- トランザクションの時間を短くする.
- それぞれのトランザクションで同じ順番で資源をロックする.

### 一貫性. 永続性.
トランザクションに求められる性質として, 一貫性と永続性がある.
一貫性とは, トランザクションが開始前と終了後でデータの整合性が保たれていることである.
永続性とは, トランザクションが終了した後もデータが保持されることである.

原子性, 独立性, 一貫性, 永続性の4つの性質を**ACID特性**と呼ぶ.

## 権限
DBMSには多くの機能や文法があるが, 基本的にはそれらは以下の４つに分類される.

|機能|説明|例|
|---|---|---|
|DML|データ操作言語| `SELECT`, `INSERT` |
|TCL|トランザクション制御言語| `COMMIT`, `ROLLBACK` |
|DDL|データ定義言語| `CREATE`, `ALTER` |
|DCL|データ制御言語| `GRANT`, `REVOKE` |

この章ではDCLについて説明する.
DCLはデータベースの管理者が使う言語であり, ユーザに対して権限を与える・剥奪するための言語である.

`GRANT`と`REVOKE`がその代表例である.

```sql
GRANT 権限 TO ユーザ; -- ユーザに権限を与える --
REVOKE 権限 FROM ユーザ; -- ユーザから権限を剥奪する --
```

## 制約
これまでいくつか制約を説明してきたが今一度まとめよう.
制約により制御を制限することで安全性を高めることができる.
また, リレーションモデルとの対応を取るためにも制約は重要である.


ここでは基本的な3つのSQLにおける制約について説明する.
1. CHECK制約
1. NOT NULL制約
1. UNIQUE制約
1. PRIMARY KEY制約
1. FOREIGN KEY制約

リレーションモデルでは次の4つの構造が要請されていた.
各制約はそれぞれの構造を充たすために使われる.

|構造|制約|
|---|---|
|ドメイン制約| CHECK制約, NOT NULL制約 |
|キー制約| PRIMARY KEY制約 |
|参照整合性制約| FOREIGN KEY制約 |
|従属性| UNIQUE制約 |
制約は以下のように記述する.

```sql
CREATE TABLE R (
    A1 INTEGER DEFAULT 1
    A2 INTEGER DEFAULT 'x' NOT NULL
    A3 INTEGER DEFAULT 'x' CHECK( A3 >= 0 )
    A4 VARCHAR(10) UNIQUE
    PRIMARY KEY(A1)
    -- PRIMARY KEY(A1, A2) などもできる --
    -- A0 INTEGER PRIMARY KEY もできる --
);
```

### CHECK制約
CHECK制約は, 列に対して条件を設定する制約である.
ある値が妥当かどうかをチェックするために使われる.
たとえば, 年齢が0以上であることをチェックするためには以下のように記述する.

```sql
INSERT INTO R (A1, A3) VALUES (1, -1);
-- ERROR --
```

### NOT NULL制約
NOT NULL制約は, 列に対してNULLを許可しない制約である.
NOT NULL制約はDEFAULT指定と組み合わせて使うことが多い.

```sql
INSERT INTO R (A1, A2) VALUES (1, NULL);
-- (1, 'x') が挿入される --
```

### UNIQUE制約
UNIQUE制約は, 列に対して重複を許さない制約である.
UNIQUE制約は複数の列に対しても設定することができる.

```sql
INSERT INTO R (A1, A4) VALUES (1, 'a');
INSERT INTO R (A1, A4) VALUES (2, 'a');
-- ERROR --
```

### PRIMEARY KEY制約
PRIMARY KEY制約は, UNIQUE制約とNOT NULL制約を組み合わせた制約である.
PRIMARY KEY制約は, そのテーブルの行を一意に識別するために使われる.
PRIMARY KEY制約は複数の列に対しても設定することができる.

```sql
INSERT INTO R (A1, A4) VALUES (1, 'a');
INSERT INTO R (A1, A4) VALUES (1, 'b');
-- ERROR --
```

### FOREIGN KEY制約
FOREIGN KEY制約は, 参照元のテーブルの外部キーに対して設定する制約である.
これは参照整合性制約を満たすために使われる.
参照整合性制約は, 外部キーの参照される状態を保つための制約であり,
以下のような状況を避けるために使われる.

- 参照先の属性値が存在しない!
- 参照先の属性値が変更されている!
- 存在しない行を参照している!
- 存在しない行を参照するように変更されている!

SQLではFOREIGN KEY制約は以下のように記述する.

```sql
CREATE TABLE R (
    A1 INTEGER REFERENCES S(B1)
);

CREATE TABLE R (
    A1 INTEGER PRIMARY KEY
    FOREIGN KEY (A1) REFERENCES S(B1)
);

-- 参照先 --

CREATE TABLE S (
    B1 INTEGER
);
```

より厳密には参照整合性制約とは外部キー$FK$に対してリレーション$R, S$が以下を充たすことをいう.
$$
\forall t \in R, \exist u \in S, t(FK) = r_2(PK)
$$

また, 属性集合$X, Y$が関数従属であるとは, $X$の値が決まれば$Y$の値が一意に決まることをいい$X \to Y$として表す.
<!-- $$ -->
<!-- \forall t \in R, \forall u \in S, t(X) = u(X) \Rightarrow t(Y) = u(Y) -->
<!-- $$ -->
$$
\forall t, u \in R,\ t(X) = u(X) \Rightarrow t(Y) = u(Y)
$$

## 終わり
このほかにも

- CREATE DOMAIN
- VIEW TABLE
- WITH句
- INDEX
- TRIGGER
- ストアドプロシージャ
- ROLL
- バックアップ

など, ここで書くべきことがあるが,  
さすがに長過ぎるので, ここで終わりにする.

また設計(概念, 物理)に関することなどは別の記事に書く.
