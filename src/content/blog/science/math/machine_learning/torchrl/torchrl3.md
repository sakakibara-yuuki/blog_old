---
title: "torchrl: #3 envs"
author: "sakakibara"
description: "強化学習ライブラリ torchrlについて"
heroImage: "/science/science.jpg"
pubDate: 2024-05-09
tags: ["機械学習", "強化学習", "torchrl", "python"]
---

## envs
重要なモジュールを再掲しておく

- modules: actorなどを扱うモジュール
- envs: 環境を扱うモジュール
- data: データを扱うモジュール 
- objectives: 目的関数を扱うモジュール

さて、envsについて見ておこう。
envsは文字通り環境を扱うモジュールである。
強化学習において環境といえばOpenAIのgym(現在はFaramaFoundationのgymnasium)が代表的である。
envsはgymなどの他の環境をwrappeすることができる。
もちろん、カスタムで自分の環境を作成することもできる。


