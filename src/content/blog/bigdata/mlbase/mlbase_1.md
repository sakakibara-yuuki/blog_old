---
title: "機械学習基盤 #1"
author: "sakakibara"
description: "機械学習"
heroImage: '/bigdata/mlbase/mlbase_1.png'
pubDate: 2024-05-28
tags: ["機械学習", "機械学習基盤"]
---

## レイヤ

機械学習基盤はいくつかのレイヤーに分割して考える。
- データソース
- プロセッシングレイヤ
- ストレージレイヤ
- アクセスレイヤ

### データソース
RDBに入っているデータやwebなどで配信されるストリーミングデータなど。
分析を主としないサービスからのデータをデータソースと呼ぶ。

### プロセッシングレイヤ
プロセッシングレイヤは主に２つの処理に分かれている
- バッチ: 一定以上のデータをまとめて(バッチ)扱う処理. DBなどから処理(ETLなどの)をしてストレージレイヤに貯める。
- ストリーミング: IoTのセンサデータのように絶え間なく流れてくるデータを処理する。webサービスなどから送られてくるデータをKafkaなどを経由してストレージレイヤに貯める。

サービスとして以下のようなものがある。
- Spark系 (Google Data Proc, Amazon EMR)
- Spark Streming系 (Google DataFlow, Beam)
- Kafka系 (Google Cloud Pub/Sub, Amazon Kinesis)

#### Apache/Kafka とは
Kafkaは分散メッセージキューである。
後段が壊れてもデータが貯まる。
データはjsonでも何でもok

Kafka、というかpub/sub系のメッセージキューではデータソースをpublicier(pub)という。
Kafkaはbroker, topic, consumerの3つオブジェクトがあり、
brokerはpubから送られてきたデータをtopic(queue)へ送る。
consumerはtopicに溜まっているデータを取り出す(sync)。

Spark StremingはApache/Sparkをストリーミング用途で利用する場合に使用する呼び方である。
Spark Streming(SS)はKafkaに対してpubにもconsumerにもなることができる。

#### DigDag
定期実行エンジン。
定期的にワークフローを実行することができる。
他にJenkinsやRundeckなどがある。
プラグインが多い。

代表的なプラグインとしてEmbulkがある。
大容量のデータを移すこと(Posgre->S3などに)が得意。
DigDagと開発元が同じ。
設定をyml形式で書くことができる。

### ストレージレイヤ
よく知られた三層構造をとることが多い。
- データレイク(データソースからの生のデータ)
- データウェアハウス
- データマート(加工済みデータ)

代表的なサービスとして
- SSD
 - S3
 - GCS
- Postgres
 - Amazon RedShift
 - Google BigQuery
 - Amazon Athena


### アクセスレイヤ
BIツールなど。なんでもいい。
MetaBaseやTableauなど
