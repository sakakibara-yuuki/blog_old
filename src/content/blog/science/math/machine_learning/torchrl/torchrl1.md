---
title: "torchrl: #1 tensordict"
author: "sakakibara"
description: "強化学習ライブラリ torchrlについて"
heroImage: "/science/science.jpg"
pubDate: 2024-05-09
tags: ["機械学習", "強化学習", "torchrl", "python"]
---

## torchrl

強化学習はそのアルゴリズムの多様さから一つ一つを実装するには非常に手間がかかる。
そのため、ライブラリを利用することはコスト削減の一つの重要な手段となる。

torchrlはPyTorchをベースにした強化学習パッケージである。
特徴として外部のライブラリに多く依存しておらず、pytorchのみで動作することが強みだ。
モジュールを組み合わせることで多様な強化学習アルゴリズムを実装することができる。
未だ、メジャーバージョンが0であるため、ドキュメントを探しても404となっていたり、そもそも内容が古かったりすることがあるため、ソースコードを読むことが必要となる。
しかし、実装されているアルゴリズムは多く, オブジェクト指向というよりは論文で提案された関数をそのまま実装することができるようになっている。
並列化もサポートされているため、将来を見越した利益を考えると採用する価値があると言える。

torchrlの主要なモジュールは以下の通りである。

- envs: 環境を扱うモジュール
- data: データを扱うモジュール
- modules: actorなどを扱うモジュール
- objectives: 目的関数を扱うモジュール
- collectors: データ収集を行うモジュール
- record: ログを取るモジュール
- trainers: 学習を行うモジュール

このうち重要なモジュールは

- envs: 環境を扱うモジュール
- data: データを扱うモジュール
- modules: actorなどを扱うモジュール
- objectives: 目的関数を扱うモジュール

である。
実際にプログラムを作成する際にもこの順序で作成していくことが多い。

そしてもう一つ最重要とも言えるモジュールがある。それが

- tensordict: データキャリア

である。

以下ではtensordictについてざっと説明した後、torchrlを用いてCartPole(倒立振子)を解くプログラムを作成しながら、各モジュールの使い方を説明していく。

## tensordict

名前から察することができるかもしれないが、tensrodictはテンソルを辞書的に格納するためのモジュールである。
イメージとしては以下のようなdictを高機能にしたものである。(実際のtensordictと異なることに注意)

```python
some_dict = {
    "observation": torch.tensor([256, 2, 3]),
    "action": torch.tensor([256, 5, 6]),
    "reward": torch.tensor([256, 8, 9]),
    "next": {
                "observation": torch.tensor([256, 2, 3]),
            }
}
```

なぜ、これが強化学習に必要かというとAgentとEnv間でやりとりされるデータをまとめて扱うためだ。
強化学習では、AgentとEnvの間で(observation, action, reward, next_observation)のように多くのデータがやりとりされる。これをバラバラに保持することはコードの見通しを非常に悪くするだけでなく、データの整合性を保つことが難しくなる。
また、やりとりするデータ項目を付け加えたいときにも非常に面倒になる。
tensordictはAgentとEnv間でデータを運ぶデータキャリアとして機能するのだ。
tensrodictを使用することで以上の問題から解法される。

以下の使用例はtensordictのdocumentからの引用であるが、tensordictの使い方を示している。

```python
for tensordict in dataset:
    tensordict = module(tensordict)
    loss = loss_module(tensordict)
    loss.backward()
    optimizer.step()
    optimizer.zero_grad()
```

tensordictが非常に便利なものであると伝わっただろうか。
そして、tensordictを使い慣れてくるとtensordictをnn.Moduleに渡したいシチュエーションに度々遭遇することになる。

実は、nn.Moduleでtensordictを受け取れるように、nn.Moduleとtensordictの間に挟むwrapperがある。
それが次に紹介するTensorDictModuleである。

### TensorDictModule

先ほど説明したように、TensorDictModuleはnn.Moduleとtensordictを適合させるためのモジュールで、tensorDictを入力として受け取ることができる。
TensorDictModuleにtensordictのkeyを指定することで、そのkeyに対応するテンソルをnn.moduleに流し込むことができる。
先ほどの例で`loss_module`はTensorDictModuleで作成されている。

最もシンプルな例は以下の通りである。(公式から引用)

```python : title="1入力1出力の例"
tensordict = TensorDict({
    "a": torch.randn(5, 3),
    "b": torch.zeros(5, 4, 3)
    }, batch_size=[5])

linear = TensorDictModule(nn.Linear(3, 10),
                          in_keys=["a"],
                          out_keys=["a_out"])

tensordict = linear(tensordict)
```

結果は

```bash
TensorDict(
    fields={
        a: Tensor(shape=torch.Size([5, 3]), device=cpu, dtype=torch.float32, is_shared=False),
        a_out: Tensor(shape=torch.Size([5, 10]), device=cpu, dtype=torch.float32, is_shared=False),
        b: Tensor(shape=torch.Size([5, 4, 3]), device=cpu, dtype=torch.float32, is_shared=False)},
    batch_size=torch.Size([5]),
    device=None,
    is_shared=False)
```

このように、TensorDictModuleはTensorDictのkey: "a"を受け取って、"a_out"という項目を新たに追加したTensorDictを返すことができる。
ここで、せっかちな読者のために注意すべきことを先に述べておく。
出力されたtensordictは入力されたtensordictを上書きしたものなので、新しい変数に代入すべきではない。
つまり、

```python
tensordict = module(tensordict) # ok
new_tensordict = module(tensordict) # don't
```

気をつけてほしい。

また、TensorDictにしていするout_keyを["out_1, out_2"]のように複数指定することで複数出力にも対応している。同様にin_keyを["in_1", "in_2"]のように複数指定することで複数入力にも対応している。

以下は2入力2出力の例である。

```python : title="2入力2出力の例"
class MultiModule(nn.Module):
    def __init__(self, in_1, in_2, out_1, out_2):
        super().__init__()
        self.linear_1 = nn.Linear(in_1, out_1)
        self.linear_2 = nn.Linear(in_2, out_2)

    def forward(self, x_1, x_2):
        y_1 = self.linear_1(x_1)
        y_2 = self.linear_2(x_2)
        return y_1, y_2

multimodule = TensorDictModule(MultiModule(3, 3, 10, 5),
                               in_keys=["a", "b"],
                               out_keys=["a_out", "b_out"])
tensordict = multimodule(tensordict)
print(tensordict)
```

結果

```bash
TensorDict(
    fields={
        a: Tensor(shape=torch.Size([5, 3]), device=cpu, dtype=torch.float32, is_shared=False),
        a_out: Tensor(shape=torch.Size([5, 10]), device=cpu, dtype=torch.float32, is_shared=False),
        b: Tensor(shape=torch.Size([5, 4, 3]), device=cpu, dtype=torch.float32, is_shared=False),
        b_out: Tensor(shape=torch.Size([5, 4, 5]), device=cpu, dtype=torch.float32, is_shared=False)},
    batch_size=torch.Size([5]),
    device=None,
    is_shared=False)
```

TensorDictの紹介の最後にProbabilisticTensorDictModuleについて紹介しよう。
機械学習は確率分布をあつかうことが多く、このモジュールは避けては通れないだろう。

## ProbabilisticTensorDictModule(確率的TensorDictModule)

```python
import torch
import torch.nn as nn
from tensordict.nn import (
    ProbabilisticTensorDictModule,
    ProbabilisticTensorDictSequential,
)
from tensordict.nn.distributions import NormalParamExtractor
from torch import distributions as dist
from tensordict import TensorDict
from tensordict.nn import TensorDictModule

td = TensorDict({
    "input": torch.randn(3, 4),
    "hidden": torch.randn(3, 8)
    }, [3])

net = TensorDictModule(nn.GRUCell(4, 8),
                       in_keys=["input", "hidden"],
                       out_keys=["hidden"])

extractor = TensorDictModule(NormalParamExtractor(),
                             in_keys=["hidden"],
                             out_keys=["loc", "scale"])

td_module = ProbabilisticTensorDictSequential(
    net,
    extractor,
    ProbabilisticTensorDictModule(
        in_keys=["loc", "scale"],
        out_keys=["action"],
        distribution_class=dist.Normal,
        return_log_prob=True,
    ),
)

print("before")
print(td)
td_module(td)
print("after")
print(td)
```

結果は

```text
before
TensorDict(
    fields={
        hidden: Tensor(shape=torch.Size([3, 8]), device=cpu, dtype=torch.float32, is_shared=False),
        input: Tensor(shape=torch.Size([3, 4]), device=cpu, dtype=torch.float32, is_shared=False)},
    batch_size=torch.Size([3]),
    device=None,
    is_shared=False)
after
TensorDict(
    fields={
        action: Tensor(shape=torch.Size([3, 4]), device=cpu, dtype=torch.float32, is_shared=False),
        hidden: Tensor(shape=torch.Size([3, 8]), device=cpu, dtype=torch.float32, is_shared=False),
        input: Tensor(shape=torch.Size([3, 4]), device=cpu, dtype=torch.float32, is_shared=False),
        loc: Tensor(shape=torch.Size([3, 4]), device=cpu, dtype=torch.float32, is_shared=False),
        sample_log_prob: Tensor(shape=torch.Size([3, 4]), device=cpu, dtype=torch.float32, is_shared=False),
        scale: Tensor(shape=torch.Size([3, 4]), device=cpu, dtype=torch.float32, is_shared=False)},
    batch_size=torch.Size([3]),
    device=None,
    is_shared=False)
```

となる。
ここで注目すべきは`ProbabilisticTensorDictModule`である。
`ProbabilisticTensorDictModule`は確率分布を表すノンパラメトリックなモジュールである。
分布パラメータは入力である`loc`と`scale`から取り出され、出力は`action`として書き込まれる。
この場合、平均と分散から出力が(対数に変換されているが)サンプリングされる。
この場合は`dist.Normal`が指定されているため、正規分布からサンプリングされる。

次回ではtensordictの応用であるtorchrlのmodulesについて説明する。
