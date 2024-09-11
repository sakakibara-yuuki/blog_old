---
title: "torchrl: #2 modules"
author: "sakakibara"
description: "強化学習ライブラリ torchrlについて"
heroImage: "/science/science.jpg"
pubDate: 2024-05-09
tags: ["機械学習", "強化学習", "torchrl", "python"]
---

## policy
強化学習は次のステップでどのような行動を取るべきかを逐次的に意思決定するアルゴリズムである。
どのようなアルゴリズムを用いて実装されているかに限らず、その出力は行動である。
(なお、決定論的に動く場合、つまり、ある状況が来たら100%の確率で行動する場合は、状況から行動への写像としても、確率分布としても表現できることに気をつける。)

そして、方策(policy)は様々な形で表現される。
- 観測値から行動を決定する微分可能な関数
- 価値を最大化するような行動を選択する関数
- 決定論的な関数
- 確率分布

そして実際これらは複雑なRNNやCNN, transformerなどのモデルを用いて表現されることが多い。

以下では確率的なpolicy, Q-Valueを最大化するpolicyを
MLP(多層パーセプトロン), CNNを用いて見ていく。

そして、それぞれのPolicyやQ-Valueの中核となるモジュールがmodulesである。

### modules
復習になるが、TensorDictModulesはnn.Moduleをカプセル化して、TensorDictを入力として受け取ることができるようにしたものである。TensorDictModulesは受け取ったTensorDictのkeyから必要なテンソルを取り出し、それをnn.Moduleに渡し、その出力を入力として受け取ったTensorDictに書き込んで返す。

このTensorDictModulesを用いた最も単純なPolicyは以下のようになるだろう。

```python
module = torch.nn.LazyLinear(256, 4)
policy = TensorDictModules({
    module,
    in_keys=["observation"],
    out_keys=["action"]
})
```

しかし、このような単純な場合であっても、moduleの出力が適切な行動空間に入っているかなどの確認が必要であり、
また、policyが確率的に表されるならout_keysから確率的にサンプリングしなければならないような状況もある。
そのような場合にmodulesを使う。
そして、modulesの多くのクラスはTensorDictModulesを継承したクラスである。

#### 純Actor系module
Actorはmoduleの代表例である。
ActorはTensorDictModulesの一種であり、nn.modulesをラップする。ただ、デフォルトでin_keys, out_keysがそれぞれobservation, actionに設定されており、また、actionが行動空間から外れた場合、行動空間に収まるように射影される。

#### Network系module
MLPもmoduleの一種である。ただし、これはnn.Sequentialをラップしており、TensorDictModulesを継承していない。
これは観測空間や行動空間を指定することで、自動的にMLPのnn.Modulesを作成してくれる。
ConvNetやLSMModuleなどもある。

#### 確率Actor系module
PPOなどの方策最適なアルゴリズムではpolicyが確率的であることが求められる。
確率Actor系のmoduleは観測空間からパラメータ空間への写像であり、可能な行動上への確率分布をコード化する。
TorchRLはパラメータから確率分布の作成、確率分布からのサンプリング、log probabilityなどの様々な操作を一つのクラスにまとめることによって、使いやすくしている。

以下では正規分布に依存するActorの例である。

なお、ProbabilisticActorはTensorDictSequenecialを継承している。これは複数のTensorDictModulesを順番に(直列に)適用することができるクラスである。

```python
import torch
from tensordict.nn import TensorDictModule
from tensordict.nn.distributions import NormalParamExtractor
from torch.distributions import Normal
from torchrl.modules import MLP, ProbabilisticActor

tensordict = TensorDict({"observation": torch.randn(1, 3)},[])
print("input")
print(tensordict)

backbone = MLP(in_features=3, out_features=2)
extractor = NormalParamExtractor()
module = torch.nn.Sequential(backbone, extractor)

print("td_module")
td_module = TensorDictModule(module, in_keys=["observation"], out_keys=["loc", "scale"])
print(policy(tensordict))

print("\noutput")
policy = ProbabilisticActor(
    td_module,
    in_keys=["loc", "scale"],
    out_keys=["action"],
    distribution_class=Normal,
    return_log_prob=True,
)
tensordict = TensorDict({"observation": torch.randn(1, 3)},[])
policy(tensordict)
print(tensordict)
```
結果
```
input
TensorDict(
    fields={
        observation: Tensor(shape=torch.Size([1, 3]), device=cpu, dtype=torch.float32, is_shared=False)},
    batch_size=torch.Size([]),
    device=None,
    is_shared=False)

td_module
TensorDict(
    fields={
        loc: Tensor(shape=torch.Size([1, 1]), device=cpu, dtype=torch.float32, is_shared=False),
        observation: Tensor(shape=torch.Size([1, 3]), device=cpu, dtype=torch.float32, is_shared=False),
        scale: Tensor(shape=torch.Size([1, 1]), device=cpu, dtype=torch.float32, is_shared=False)},
    batch_size=torch.Size([]),
    device=None,
    is_shared=False)

output
TensorDict(
    fields={
        action: Tensor(shape=torch.Size([1, 1]), device=cpu, dtype=torch.float32, is_shared=False),
        loc: Tensor(shape=torch.Size([1, 1]), device=cpu, dtype=torch.float32, is_shared=False),
        observation: Tensor(shape=torch.Size([1, 3]), device=cpu, dtype=torch.float32, is_shared=False),
        sample_log_prob: Tensor(shape=torch.Size([1, 1]), device=cpu, dtype=torch.float32, is_shared=False),
        scale: Tensor(shape=torch.Size([1, 1]), device=cpu, dtype=torch.float32, is_shared=False)},
    batch_size=torch.Size([]),
    device=None,
    is_shared=False)
```

分布によって定められた行動のlog-probabilityがtensordictに追加される。
これはPPOなどの方策最適化アルゴリズムで必要とされる。
また、分布のパラメータは出力されるtensordictのlocとscaleで返される。

rollout時にランダムサンプリングを制御したい場合には
set_explorationを使うことで、確率的な行動選択を制御することができる。

なお、ここで使用しているNormalParamExtractorは
tensordict/tensordict/nn/distributions/continuous.pyに定義されているクラスである。
おもしろいことに、Size([1, 2, 3])のような形状のテンソルを受け取ると、最後の3列だけに着目して、それを前2列をlocに、後ろ1列をscaleとしてtensrodictに追加する処理を行う。
Size([2, 7])のような形状ならば、前4列をloc, 後ろ3列をscaleとして追加する。
これは特に平均や標準偏差を計算しているわけではなく、前4列のlocは入力の値がそのまま入る。
後ろのscaleは一応正の値になるように変換をしているが、基本はそのままの値であり、ただ"loc"と"scal"という名前のkeyをつけているだけである。

そしてこれはドキュメントに存在してないので、使い方を知りたい場合はソースコードを見ること。

```python
from torchrl.envs.utils import ExplorationType, set_exploration_type

with set_exploration_type(ExplorationType.MEAN):
    rollout = env.rollout(max_steps=10, policy=policy) # takes the mean as action
with set_exploration_type(ExplorationType.RANDOM):
    rollout = env.rollout(max_steps=10, policy=policy) # Samples actions according to the dist
```

<!-- #### 探索系module -->
#### Q-Value Actor系module
いくつかの場合、policyは単独では動かず、別のmoduleの上に構築されることがある。
Q-Value Actorがその最たる例である。
Q-Value Actorは行動価値を推定し、その最大価値を持つ行動を(greedilyに)選択する。
また、いくつかのケース(行動と観測が有限離散空間である場合)には
観測値と行動の価値の表、所謂Q-Tableを用いることがある。
Q-Tableから最も価値の高い行動を選択することができる。
DQNが革新的であったのはそれをQ(s, a)マップをNNで近似することにより、連続観測状態へ適用可能にしたことである。

それでは例を見ていこう。
``` python
import torch
from tensordict import TensorDict
from tensordict.nn import TensorDictModule, TensorDictSequential
from torchrl.modules import QValueModule, MLP
from torchrl.envs import GymEnv

env = GymEnv("CartPole-v1")

tensordict = TensorDict({"observation": torch.randn(1, 4)}, [])

num_actions = 2
value_net = TensorDictModule(
    MLP(out_features=num_actions, num_cells=[32, 32]),
    in_keys=["observation"],
    out_keys=["action_value"],
)
print(value_net(tensordict))

policy = TensorDictSequential(
    value_net,  # writes action values in our tensordict
    QValueModule(spec=env.action_spec),  # Reads the "action_value" entry by default
)

print(policy(tensordict))
```

Q-Value actorはQ-ValueModuleを用いて、行動価値を推定し、その最大価値を持つ行動を選択する。
``` bash
TensorDict(
    fields={
        action_value: Tensor(shape=torch.Size([1, 2]), device=cpu, dtype=torch.float32, is_shared=False),
        observation: Tensor(shape=torch.Size([1, 4]), device=cpu, dtype=torch.float32, is_shared=False)},
    batch_size=torch.Size([]),
    device=None,
    is_shared=False)

TensorDict(
    fields={
        action: Tensor(shape=torch.Size([1, 2]), device=cpu, dtype=torch.int64, is_shared=False),
        action_value: Tensor(shape=torch.Size([1, 2]), device=cpu, dtype=torch.float32, is_shared=False),
        chosen_action_value: Tensor(shape=torch.Size([1, 1]), device=cpu, dtype=torch.float32, is_shared=False),
        observation: Tensor(shape=torch.Size([1, 4]), device=cpu, dtype=torch.float32, is_shared=False)},
    batch_size=torch.Size([]),
    device=None,
    is_shared=False)
```

Q-ValueModuleはargmax演算子に依存しているため、この方策は決定論的である。

以上で、modulesの説明は終わりである。
この他にも様々なmodulesがあるので少しずつ試していくと良いだろう。
