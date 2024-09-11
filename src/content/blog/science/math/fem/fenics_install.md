---
title: "fenicxのインストールがムズすぎる"
author: "sakakibara"
description: "fenics is fuxx"
heroImage: "/science/science.jpg"
pubDate: 2024-03-24
tags: ["fem", "math", "有限要素法", "fenics", "dolfinx"]
---


# fenics
有限要素法のためのソフトウェアとしてfenicsがある。
このinstallがやたら難しいので備忘録として残す。

## fenics の components
fenicsは以下のコンポーネントから構成される。
- dolfinx
- ffcx
- basix
- ufl

メインとなるのはdolfinxだ。
```bash
git clone https://github.com/FEniCS/dolfinx.git .dolfinx
```
のようにgit からcloneしてくる。
```bash
mkdir build
cd build
cmake ..
make install
```
とすればインストール可能であるが、実際はうまく行かない。
`cmake ..`の時点で以下のエラーがでる。
```bash
ModuleNotFoundError: No module named 'ffcx'
CMake Error at /usr/share/cmake/Modules/FindPackageHandleStandardArgs.cmake:230 (message):
  Could NOT find UFCx (missing: UFCX_INCLUDE_DIRS UFCX_VERSION) (Required is
  at least version "0.7")

      Reason given by package: UFCx could not be found.

Call Stack (most recent call first):
  /usr/share/cmake/Modules/FindPackageHandleStandardArgs.cmake:600 (_FPHSA_FAILURE_MESSAGE)
  cmake/modules/FindUFCx.cmake:72 (find_package_handle_standard_args)
  CMakeLists.txt:359 (find_package)
```

この際、pythonの仮想環境を作成し、その中で作業をしていた。
`UFCx`が無いというので入れてやる。
``` bash
pip install fenics-ffcx
```
なお、この時点でもまだエラーがでる。
```bash
pip list
> fenics-ffcx 0.7.0
```

どうやら
```bash 
export PYTHONPATH=$/home/sakakibara/project/fx/.fx/lib/python3.11/site-packages

```
のようにしてやればいいらしい。
さて、
```bash
make install
```
またエラーがでる。
```bash
[ 27%] Building CXX object dolfinx/CMakeFiles/dolfinx.dir/fem/DofMap.cpp.o
In file included from /home/sakakibara/project/fx/.dolfinx/cpp/dolfinx/fem/DofMap.cpp:10:
/home/sakakibara/project/fx/.dolfinx/cpp/dolfinx/fem/utils.h: In function ‘dolfinx::fem::FunctionSpace<T> dolfinx::fem::create_functionspace(ufcx_function_space* (*)(const char*), const std::string&, std::shared_ptr<dolfinx::mesh::Mesh<T> >, std::function<std::vector<int>(const dolfinx::graph::AdjacencyList<int>&)>)’:
/home/sakakibara/project/fx/.dolfinx/cpp/dolfinx/fem/utils.h:791:47: error: ‘ufcx_function_space’ {aka ‘struct ufcx_function_space’} has no member named ‘value_shape’
  791 |   std::vector<std::size_t> value_shape(space->value_shape,
      |                                               ^~~~~~~~~~~
/home/sakakibara/project/fx/.dolfinx/cpp/dolfinx/fem/utils.h:792:47: error: ‘ufcx_function_space’ {aka ‘struct ufcx_function_space’} has no member named ‘value_shape’
  792 |                                        space->value_shape + space->value_rank);
      |                                               ^~~~~~~~~~~
/home/sakakibara/project/fx/.dolfinx/cpp/dolfinx/fem/utils.h:792:68: error: ‘ufcx_function_space’ {aka ‘struct ufcx_function_space’} has no member named ‘value_rank’
  792 |                           space->value_shape + space->value_rank);
      |                                                       ^~~~~~~~~~

/home/sakakibara/project/fx/.dolfinx/cpp/dolfinx/fem/utils.h: In function ‘dolfinx::fem::Expression<T, U> dolfinx::fem::create_expression(const ufcx_expression&, const std::vector<std::shared_ptr<const Function<T, U> > >&, const std::vector<std::shared_ptr<const Constant<T> > >&, std::shared_ptr<const FunctionSpace<U> >)’:
/home/sakakibara/project/fx/.dolfinx/cpp/dolfinx/fem/utils.h:1108:58: error: ‘const ufcx_expression’ {aka ‘const struct ufcx_expression’} has no member named ‘entity_dimension’
 1108 | td::vector<U> X(e.points, e.points + e.num_points * e.entity_dimension);
      |                                                       ^~~~~~~~~~~~~~~~

/home/sakakibara/project/fx/.dolfinx/cpp/dolfinx/fem/utils.h:1111:37: error: ‘const ufcx_expression’ {aka ‘const struct ufcx_expression’} has no member named ‘entity_dimension’
 1111 |          static_cast<std::size_t>(e.entity_dimension)};
      |                                     ^~~~~~~~~~~~~~~~
make[2]: *** [dolfinx/CMakeFiles/dolfinx.dir/build.make:230: dolfinx/CMakeFiles/dolfinx.dir/fem/DofMap.cpp.o] Error 1
make[1]: *** [CMakeFiles/Makefile2:304: dolfinx/CMakeFiles/dolfinx.dir/all] Error 2
make: *** [Makefile:136: all] Error 2
```
なんかファイルが足りないような感じがするエラーだ。
どうにも`ffcx`がうまくインストールできていないと判断。
直にインストールする。
```bash
git clone https://github.com/FEniCS/ffcx.git .ffcx
pip uninstall fenics-ffcx
pip install .
```
 またエラー
 エラー出さないと死ぬんか？ってほどエラーがでる。
 やっぱり巨大なライブラリはだめだ。小さく、シンプル、完結なライブラリでなければならない。
 ```bash
 ERROR: Could not find a version that satisfies the requirement fenics-basix<0.9.0,>=0.8.0.dev0 (from fenics-ffcx) (from versions: 0.4.0, 0.4.2.post1, 0.5.0, 0.6.0, 0.7.0.post0)
ERROR: No matching distribution found for fenics-basix<0.9.0,>=0.8.0.dev0
 ```
fenicx-basixも直にインストールする。

```bash
pip uninstall fenics-basix
git clone https://github.com/FEniCS/basix.git .basix
```
だけどなんかバージョンがさっきと変わってない気が...?
まぁ、気にせず、fenics-ffcxをインストールする。
またエラー
```bash
ERROR: Could not find a version that satisfies the requirement fenics-ufl<2023.4.0,>=2023.3.0.dev0 (from fenics-ffcx) (from versions: 2017.1.0.post1, 2017.2.0, 2018.1.0, 2019.1.0, 2022.1.0.post0, 2022.2.0, 2023.1.0, 2023.1.1.post0, 2023.2.0)
ERROR: No matching distribution found for fenics-ufl<2023.4.0,>=2023.3.0.dev0
```
fenics-uflも直にインストールする。
```bash
git clone https://github.com/FEniCS/ufl.git .ufl
cd .ufl
pip install .
```
これで再度`fenics-ffcx`をインストールする。
するとやっと成功した。
もう一度'dolfinx'にもどって
```bash
cmake ..
make install
```
すると、無事インストールできた。
設定はここにあるらしい
```bash
----------------------------------------------------------------------------
DOLFINx has now been installed in

    /usr/local

and demo programs have been installed in

    /usr/local/share/dolfinx/demo

Don't forget to update your environment variables. This can be done
easily using the helper file 'dolfinx.conf' which sets the appropriate
variables (for users of the Bash shell).

To update your environment variables, run the following command:

    source /usr/local/lib/dolfinx/dolfinx.conf

----------------------------------------------------------------------------
```

ちなみにdockerimageもあるらしい
```bash
docker run -it dolfinx/dolfinx:v0.7.2
```
こっちの方が8000000000000000000000000000000000000000000000000000000000000000倍楽

なお、pythonのモジュールを使用する場合は、
```bash
pip install -r build-requirements.txt
pip install --check-build-dependencies --no-build-isolation .
```
を実行する必要がある。
