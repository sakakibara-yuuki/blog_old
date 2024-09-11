---
title: "torchrl: #2 番外編 RNNなDQNを作る"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: "/science/science.jpg"
pubDate: 2024-05-15
tags: ["機械学習", "強化学習", "torchrl", "python"]
---


## RNNなDQN
DQN(Deep Q-Network)はQ学習をニューラルネットワークで近似する手法でであり、最も基本的なニューラルネットワークを用いた強化学習手法の一つで、その後の深層強化学習の草分け的な技術となっている。
そして、強化学習の入力というのは時系列データであることが多いため、RNN(Recurrent Neural Network)を用いることが多い。

今回は、RNNを用いたDQNを実装してみる。
なお、DQNは連続の状態空間、離散的な行動空間に対してのみ適用可能であるため、連続的な行動を行う場合には別の手法(DDPGなど)を用いる必要がある。

DQNの主な特徴は２つであり、
1. Experience Replay
2. Fixed Q-targets
である。

Experience Replay(Replay buffer)は、過去の相互作用(状態、行動、報酬、次の状態)を保存しておき、ランダムにサンプリングして学習を行うことで、データの相関を減らし、学習を安定化させる手法である。
しかし、逐次的にQ関数を更新することで、学習が不安定になることがある。そこで、一時的にQ関数を固定しておき、そのQ関数を使ってTD誤差を計算することで、学習を安定化させる手法がFixed Q-targetsである。

RNNは、時系列データを扱うためのニューラルネットワークであり、過去の影響力を保持することができる。
入力は(sequence_length, input_size)の形をしており、出力は(sequence_length, output_size)の形をしている。
RNNは時系列データを扱うためのニューラルネットワークの手法の総称であり、LSTMやGRUなどがある。
なお、今回はLSTMを用いる。

### RNN特有の注意点?
RNNは過去の情報に基づいた政策を学習するためによく使われる。
基本的なアイデアは連続する2ステップ間にreccurent状態をメモリに保持し(前のステップの情報を一時的に記憶し、次のステップでそれを利用する)、これを現在の観測値とともに方策の入力として使用することである。

中核となる考えはTensorDictをデータキャリアとして, あるステップから別のステップへ隠れ状態を渡すことである。
現在のTensorDictから前のreccrent状態を読み、現在のreccurent状態を次のステップに渡すTensorDictに書き込むことを行う方策を実装する。

Envではresetの際にゼロ化されたreccurent状態を返し、policyは観測値とともにreccurent状態を受け取る。そして、reccurent状態を次のステップに渡して使う。
step_md()関数が呼ばれるたびに、次のステップで更新されたreccurent状態が、現在のTensorDictに統合される。

### Env
たいてい、torchrlで強化学習のプログラムを作成する際にはまずはじめにEnvを作成する。
今回は、pixelを出力するCartPole gym環境といくつかのtransforms(grayscale, resizeing, scaling down rewards, normalizing observation)を作成する。

transformsで重要なものが２つある。
- InitTracker: TensorDictにis_initキーを追加することで、reset()の呼び出し時にスタンプをつける。
- TensorDictPrimer: reset()を呼び出すと、primerで指定されたキーにゼロテンソルが入る。正直あってもなくてもいいが、この変換を含めないと、収集されたデータとrepolay bufferからrecurrent
状態のkeyが消えることになり、最適なトレーニングが減少するかもしれない。なお、LSTMにはこのtransformを構築してくれるヘルパーメソッドがすでにあるので、envの実装段階でそれを意識する必要はない。

```python
env = TransformedEnv(
    GymEnv("CartPole-v1", from_pixels=True, device=device),
    Compose(
        ToTensorImage(),
        GrayScale(),
        Resize(84, 84),
        StepCounter(),
        InitTracker(),
        RewardScaling(loc=0.0, scale=0.1),
        ObservationNorm(standard_normal=True, in_keys=["pixels"]),
    ),
)

env.transform[-1].init_stats(1000, reduce_dim=[0, 1, 2], cat_dim=0, keep_dims=[0])
td = env.reset()
print(td)
```
結果
```python
TensorDict(
    fields={
        done: Tensor(shape=torch.Size([1]), device=cpu, dtype=torch.bool, is_shared=False),
        is_init: Tensor(shape=torch.Size([1]), device=cpu, dtype=torch.bool, is_shared=False),
        pixels: Tensor(shape=torch.Size([1, 84, 84]), device=cpu, dtype=torch.float32, is_shared=False),
        step_count: Tensor(shape=torch.Size([1]), device=cpu, dtype=torch.int64, is_shared=False),
        terminated: Tensor(shape=torch.Size([1]), device=cpu, dtype=torch.bool, is_shared=False),
        truncated: Tensor(shape=torch.Size([1]), device=cpu, dtype=torch.bool, is_shared=False)},
    batch_size=torch.Size([]),
    device=cpu,
    is_shared=False)
```

### Policyを作る
Policyは3つの部分から構成される。
- ConvNet: 画像を特徴量に変換する
- LSTM: RNNのモデル
- MLP: LSTMの出力を行動関数に変換する

#### ConvNet
入力は84x84だが64個のベクトルにリサイズする。
```python
feature = Mod(
    ConvNet(
        num_cells=[32, 32, 64],
        squeeze_output=True,
        aggregator_class=nn.AdaptiveAvgPool2d,
        aggregator_kwargs={"output_size": (1, 1)},
        device=device,
    ),
    in_keys=["pixels"],
    out_keys=["embed"],
)

n_cells = feature(env.reset()["embed"]).shape[-1] # 何個のベクトルが出力されるか, 64個
```
#### LSTM

#### MLP
単一レイヤーのMLPを行動関数を表現するために使用する。
```python
mlp = MLP(
    out_features=2,
    num_cells=[
        64,
    ],
    device=device,
)

# zero埋め
mlp[-1].bias.data.fill_(0.0)
mlp = Mod(mlp, in_keys=["embed"], out_keys=["action_value"])
```

#### Q-Valueを使って行動を選択する
policyの最後にQ-Value Moduleを作成する。
Q-Value moduelはQValueModuleを使用し、MLPから出力される"action_values"を入力として読み取り、最大値をもつactionを収集する。
やるべきことは行動空間の指定だけで、これは文字列を渡すかaction_speceを指定するかのどちらかである。

```python
qval = QValueModule(action_space=None, spec=env.action_spec)
```

なお、似たようなものとしてQValueActorがあるが、こちらはQValueModuleをSequentialのモジュールをwrapしているだけである。最終的な結果は同じようなものになる。

DQNは決定論的なアルゴリズムであり、探索は重要な要素である。だが、ここではスキップする。
set_reccurent_modeをTrueにすることでcuDNN最適化を行うことができる。
```
policy = Seq(feature, lstm.set_recurrent_mode(True), mlp, qval)
policy(env.reset())
```

#### DQN Lossの実装
DQNlossはpolicyとaction_spaceを引数に取る必要がある。
これは冗長に見えるかもしれないが、DQNLossとQValueModuleクラスの互換性を確かめるために重要である。

Double DQNを使うためには、ターゲットネットワークとして使うネットワークパラメータのコピーを作るようにdelay_value引数を設定する必要がある。

```python
loss_fn = DQNLoss(policy, action_space=env.action_spec, delay_value=True)
```
今回はDouble DQNを使うため、ターゲットパラメータをアップデートする必要がある。
そのため、SoftUpdateインスタンスを使用する。

```python
updater = SoftUpdate(loss_fn, eps=0.95)
optim = torch.optim.Adam(policy.parameters(), lr=1e-4)
```
#### Collectorとreplay buffer
最も簡単なdatacollectorを作成する。
全100万フレームでアルゴリズムを学習させ, 1ステップで50フレームをバッファに保存する。
(frame_per_batch=50は一度に50フレームを収集することができ、total_frames=200は合計で200フレームを収集することを意味する。つまり、collectoerは200フレームを収集するまで動作し、一度に50フレームずつ収集する。
つまり、collectoerは 50フレーム x 4回 = 200フレームを収集する。)

バッファは50フレームの長さをもつ軌道を2万個保持できるように設計する。

(storage=LazyMemmapStorage(20_000)は20_000のデータを保存することができる。batch_size=4は一度に4つのバッチを最適化ステップで使用する。prefetch=10はバッファから10バッチ分のデータを事前にフェッチしておくことを意味する。)

最適化ステップ(1回のdataにつき16回)では、バッファから4つのアイテムをサンプリングし、合計200個の軌道を使用して学習する。


また、LazyMemmapStorageを使用して、データをディスクに保存しながら進む。
ここら辺はtraining loopを見ながら理解するのがいいかも

```python
collector = SyncDataCollector(env, stoch_policy, frames_per_batch=50, total_frames=200)
rb = TensorDictReplayBuffer(
    storage=LazyMemmapStorage(20_000), batch_size=4, prefetch=10
)
```

#### training loop
進捗を把握するために、50回のデータ収集について1回、環境内で方策を実行し、トレーニング後の結果をプロットする。
QValueModuleの出力のキーが(action_values, action, chosen_action_value)であることに注意する。
また、is_init keyはステップが初期かどうかを示し、recurrent_state keyがあることにも注意する。

```python
utd = 16
longest = 0

traj_lens = []
for i, data in enumerate(collector):
    print("="*31)
    print(data)
    print("="*31)
    # it is important to pass data that is not flattened
    rb.extend(data.unsqueeze(0).to_tensordict().cpu())
    for _ in range(utd): # 16回
        s = rb.sample().to(device, non_blocking=True)
        print("="*31)
        print(s)
        print("="*31)
        loss_vals = loss_fn(s)
        loss_vals["loss"].backward()
        optim.step()
        optim.zero_grad()
    longest = max(longest, data["step_count"].max().item())
    )
    exploration_module.step(data.numel())
    updater.step()

    with set_exploration_type(ExplorationType.MODE), torch.no_grad():
        rollout = env.rollout(10000, stoch_policy)
        traj_lens.append(rollout.get(("next", "step_count")).max().item())
```
結果
```
===============================
TensorDict(
    fields={
        action: Tensor(shape=torch.Size([50, 2]), device=cpu, dtype=torch.int64, is_shared=False),
        action_value: Tensor(shape=torch.Size([50, 2]), device=cpu, dtype=torch.float32, is_shared=False),
        chosen_action_value: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.float32, is_shared=False),
        collector: TensorDict(
            fields={
                traj_ids: Tensor(shape=torch.Size([50]), device=cpu, dtype=torch.int64, is_shared=False)},
            batch_size=torch.Size([50]),
            device=None,
            is_shared=False),
        done: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
        embed: Tensor(shape=torch.Size([50, 128]), device=cpu, dtype=torch.float32, is_shared=False),
        is_init: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
        next: TensorDict(
            fields={
                done: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
                is_init: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
                pixels: Tensor(shape=torch.Size([50, 1, 84, 84]), device=cpu, dtype=torch.float32, is_shared=False),
                recurrent_state_c: Tensor(shape=torch.Size([50, 1, 128]), device=cpu, dtype=torch.float32, is_shared=False),
                recurrent_state_h: Tensor(shape=torch.Size([50, 1, 128]), device=cpu, dtype=torch.float32, is_shared=False),
                reward: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.float32, is_shared=False),
                step_count: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.int64, is_shared=False),
                terminated: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
                truncated: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.bool, is_shared=False)},
            batch_size=torch.Size([50]),
            device=None,
            is_shared=False),
        pixels: Tensor(shape=torch.Size([50, 1, 84, 84]), device=cpu, dtype=torch.float32, is_shared=False),
        recurrent_state_c: Tensor(shape=torch.Size([50, 1, 128]), device=cpu, dtype=torch.float32, is_shared=False),
        recurrent_state_h: Tensor(shape=torch.Size([50, 1, 128]), device=cpu, dtype=torch.float32, is_shared=False),
        step_count: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.int64, is_shared=False),
        terminated: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
        truncated: Tensor(shape=torch.Size([50, 1]), device=cpu, dtype=torch.bool, is_shared=False)},
    batch_size=torch.Size([50]),
    device=None,
    is_shared=False)
===============================
```
```
===============================
TensorDict(
    fields={
        action: Tensor(shape=torch.Size([4, 50, 2]), device=cpu, dtype=torch.int64, is_shared=False),
        action_value: Tensor(shape=torch.Size([4, 50, 2]), device=cpu, dtype=torch.float32, is_shared=False),
        chosen_action_value: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.float32, is_shared=False),
        collector: TensorDict(
            fields={
                traj_ids: Tensor(shape=torch.Size([4, 50]), device=cpu, dtype=torch.int64, is_shared=False)},
            batch_size=torch.Size([4, 50]),
            device=cpu,
            is_shared=False),
        done: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
        embed: Tensor(shape=torch.Size([4, 50, 128]), device=cpu, dtype=torch.float32, is_shared=False),
        index: Tensor(shape=torch.Size([4, 50]), device=cpu, dtype=torch.int64, is_shared=False),
        is_init: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
        next: TensorDict(
            fields={
                done: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
                is_init: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
                pixels: Tensor(shape=torch.Size([4, 50, 1, 84, 84]), device=cpu, dtype=torch.float32, is_shared=False),
                recurrent_state_c: Tensor(shape=torch.Size([4, 50, 1, 128]), device=cpu, dtype=torch.float32, is_shared=False),
                recurrent_state_h: Tensor(shape=torch.Size([4, 50, 1, 128]), device=cpu, dtype=torch.float32, is_shared=False),
                reward: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.float32, is_shared=False),
                step_count: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.int64, is_shared=False),
                terminated: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
                truncated: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.bool, is_shared=False)},
            batch_size=torch.Size([4, 50]),
            device=cpu,
            is_shared=False),
        pixels: Tensor(shape=torch.Size([4, 50, 1, 84, 84]), device=cpu, dtype=torch.float32, is_shared=False),
        recurrent_state_c: Tensor(shape=torch.Size([4, 50, 1, 128]), device=cpu, dtype=torch.float32, is_shared=False),
        recurrent_state_h: Tensor(shape=torch.Size([4, 50, 1, 128]), device=cpu, dtype=torch.float32, is_shared=False),
        step_count: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.int64, is_shared=False),
        terminated: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.bool, is_shared=False),
        truncated: Tensor(shape=torch.Size([4, 50, 1]), device=cpu, dtype=torch.bool, is_shared=False)},
    batch_size=torch.Size([4, 50]),
    device=cpu,
    is_shared=False)
===============================
```
