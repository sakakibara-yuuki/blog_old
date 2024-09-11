---
title: "MLシステム: youtubeの仕組み"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
heroImage: '/bigdata/mlsystem/youtube.png'
pubDate: 2024-06-05
tags: ["youtube", "機械学習", "検索システム", "機械学習基盤"]
---

# YouTubeの検索システム
YouTubeでは何億もの動画がアップロードされ、その中から検索によって目的の動画を見つけることができる。
大量の動画を効率的に扱うためにはそれなりの検索システムが必要となる。

## 検索システムの仮定
- 入力はテキストとする。
- 動画形式のみを検索対象とする。
- 一つ一つの動画同士には関連性がなく、"内容とタイトルや説明などのテキストデータ(video, text)"毎に独立しているとする。
- 事前に教師データは用意されている。
- 検索言語は(めんどくさいので)英語のみとする。
- 動画は$10^9$本程度とする。
- ユーザー毎にパーソナライズする(過去の操作を考慮して、ユーザー毎に動画の優先度を変えたり)必要はないとする。

## MLタスクの枠組み

### MLタスクの目的
ユーザーは入力したテキストにたいして、関連性が高く、見たい動画を表示することを期待している。これをMLのタスクとして落とし込むにはテキストクエリに対する関連性をベースに動画をランク付けする問題として定式化することができる。

### 入力と出力
- 入力: テキストデータ
- 出力: テキストクエリに対する関連性が高い動画のランク付けされたリスト

```d2
direction: right
results: {
    Video 1
    Video 2
    Video 3
}
Input: "Dogs playing indoor"
System: "Video Search System"
Input -> System -> results
```

### ML技術の選定
動画とテキストの関連性を決めるために、動画の内容と動画のテキストデータ(タイトル、説明文)を使う。

```d2
direction: right
system: {
    style: {
        stroke-dash: 3
        opacity: 0.5
    }
    video featured text: {
        video 1 : "" {
            shape: image
            icon: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8PxKWUaE3tPbMrsJZH7Y62UbgX5ruelfphQ&s
        }
        video 2: ".\n.\n." {
            style.fill: transparent
            style.stroke-width: 0
        }
        video 3: "" {
            shape: image
            icon: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8PxKWUaE3tPbMrsJZH7Y62UbgX5ruelfphQ&s
        }
    }
    video featured visual: {
        video 1 : "" {
            shape: image
            icon: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8PxKWUaE3tPbMrsJZH7Y62UbgX5ruelfphQ&s
        }
        video 2: ".\n.\n." {
            style.fill: transparent
            style.stroke-width: 0
        }
        video 3: "" {
            shape: image
            icon: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8PxKWUaE3tPbMrsJZH7Y62UbgX5ruelfphQ&s
        }
    }
    Visual Search -> video featured visual
    Text Search -> video featured text
    video featured visual -> Fusing
    video featured text -> Fusing
}
Results: {
    video 1 : "" {
        shape: image
        icon: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8PxKWUaE3tPbMrsJZH7Y62UbgX5ruelfphQ&s
    }
    video 2: ".\n.\n." {
        style.fill: transparent
        style.stroke-width: 0
    }
    video 3: "" {
        shape: image
        icon: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8PxKWUaE3tPbMrsJZH7Y62UbgX5ruelfphQ&s
    }
}
Input: "Dogs playing indoor"
Input -> system.Visual Search
Input -> system.Text Search
system.Fusing -> Results
```

#### Visual Search
Visual Searchではテキストを入力として受け取って、動画のリストを出力する。
出力された動画は入力テキストと動画の内容の類似度によってランク付けされる。

動画の内容を処理し、動画を検索する方法として一般に表現学習が使われる。
入力テキストと動画は別個に２つのエンコーダーを使ってそれぞれ埋め込みベクトルに変換される。
動画とテキストの埋め込みベクトルの類似度はコサイン類似度などを使って計算される。

外見的にも文脈的にも入力テキストと似ている動画をランク付けするために、埋め込み空間の入力テキスト(ベクトル)と埋め込み空間の動画(ベクトル)の内積を計算する。
ここで注意すべきは入力テキストは一つのベクトルに対して、動画のベクトルは複数あるため、意味としては各動画に対するテキストの類似度を計算してベクトルとして考えることになる。

#### Text Search
"dogs playing indoor"のような入力テキストを受け取るText Searchがどのように動くかの外観は以下の通りである。

```d2
direction: right
ids: "Search results" {
    grid-gap: 0
    grid-rows: 2
    id 1
    id 2
}

DB: "動画に関するテキストデータ"{
    shape: cylinder
}

table: ""{
    grid-gap: 0
    grid-rows: 5
    grid-columns: 3

    Video ID
    Title
    Tags

    1
    My dog is playing indoor
    dog, indoor, play

    2
    The swimming competition in the middle school
    pool, child

    3
    watch the video I took when I was in Japan
    travel, japan, vlog
}

Dogs playing indoor -> Text Search -> ids
Text Search <-> DB
DB -> table: {style.stroke-dash: 3}
```

転置インデックス(逆引き索引)はデータベースから全文検索を行うためによく使われる効率的な方法である。

なお、普通の索引は文書Aの中に単語がどの場所Xにあるかを記録するが、
転置インデックス(逆引き索引)はどの単語がどの文書Xにあるかを記録する。

転置インデックスは機械学習ベースでは無いために学習コストは無い。
よくElasticsearchやSolrなどが使われる。

## Data準備

### データエンジニアリング
### 特徴量エンジニアリング

#### テキストデータの前処理
#### テキスト正規化
#### Tokenization
#### Token to ID
#### 動画データの前処理

## Modelの構築
### モデルの選定
#### テキストエンコーダー
#### 統計的手法
#### ML的方法

#### 動画エンコーダー

## モデルの学習

## 評価
### Offline Metrics
### Online Metrics

## デプロイ

## 推論パイプライン
## 動画indexingパイプライン
## テキストindexingパイプライン

