---
title: 'AWS: IAMについて'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-11-10
tags: ["aws", "IAM"]
---

# Introduction
AWS Identity and Access Management (IAM) は、AWSアカウントのリソースとサービスへのアクセスを管理するためのサービスです。
IAMを使用することで、ユーザーごとに異なる権限を設定し、AWSリソースへのアクセスを制御できます。

IAMはユーザー、グループ、ロール、ポリシーを活用してアクセス管理を行います。
これにより、適切なリソースに対して必要なアクセス権を付与し、不正なアクセスを防ぐことが可能です。

ちなみにIAMユーザーはAWSアカウントとは別物であり, IAM Identity Centerで作成されるuserもまた別物である.

## Contents
## ユーザーとグループ
AWSアカウントはテナントとしての役割を持つ.
テナントとはオフィスビルやショッピングセンターや百貨店などの建物の一角を借り, そのスペースを使って事務所や店舗を運営している人や企業のことを指す.
AWSにおいても同様で, 仮想化された計算資源の一角を借りることができるのがパブリッククラウドであり, 我々はその一角を借りてサービスを運用する.
この概念は次に述べるIAMユーザーとは異なる.

### IAMユーザー
IAMユーザーはAWSのリソースにアクセスできるAWSアカウント内の各個人やシステムのことを指す.
ユーザーごとにアクセスキーやパスワードを持ち, AWSマネジメントコンソールやAWS CLI, SDKなどを使ってAWSリソースにアクセスすることができる.

ユーザは以下のような特徴を持つ.
- 一意のID: AWSアカウント内で一意のIDを持つ.
- 認証情報の提供: パスワードやアクセスキーが必要. パスワードはAWSマネジメントコンソールで, アクセスキーはAWS CLIやSDKで使用する.
- 権限設定: 各ユーザはポリシーに基づいてAWSリソースにアクセスできる権限が設定される.

使用例として
- 人間のユーザ: 人間のユーザはAWSアカウントにログインしてAWSリソースにアクセスするための人間.
- アプリケーションやサービスアカウント: プログラムによるアクセスのために作成されるユーザ. 通常, アクセスキーを発行する.

### IAMグループ
対して, IAMグループは複数のユーザーをまとめて管理するための仕組みである.
グループに対してポリシーを設定することができ, そのグループに所属するユーザーはグループに設定されたポリシーに基づいてアクセス権限が付与される.

グループは以下のような特徴を持つ.
- 権限の一括管理: グループに対してポリシーを設定することで, そこに所属するユーザー全員に一括してアクセス権限を付与できる.
- 階層構造が不可: IAMグループは入れ子にできない. IAMグループはIAMグループを含められない.
- 複数グループの所属: ユーザーは複数のグループに所属できる.

使用例として
- 開発者グループ: 開発者チームのメンバーをまとめて管理するグループ. (EC2インスタンスへのアクセス権限などが付与されている)
- 管理者グループ: 管理者のグループを作成し, 全てのリソースへのアクセス権限を持つ.

などがある.
```d2
vars: {
  d2-config: {
    layout-engine: tala
  }
}
user: {
  style: {
    border-radius: 999
  }
}
group: {
  style: {
    border-radius: 999
  }
}
direction: left
group -> user: {style.stroke-dash: 3}
```

## ロールとポリシー
IAMロールはAWSリソースが自身へのアクセスを**一時的に**許可するための仕組みである.
これにより, AWSリソースからAWSリソースへ, サービスからAWSリソースへのアクセスが可能になる.
IAMユーザとは異なり, ロールには認証情報(パスワードやアクセスキー)が無い.
代わりに, ロールを"引き受ける"形でアクセス権限を取得する.

### IAMロール
ロールは以下のような特徴を持つ.
- 一時的なアクセス: ロールは一時的なアクセス権限をもつ. これにより, セキュリティ上のリスクを軽減できる.
- 信頼ポリシー: ロールに"信頼ポリシー"(信頼の方策)を設定することで, どのAWSアカウントやサービスがロールを引き受けることができるかを定義・制御できる.
- ロールの引受: ユーザやサービスがロールを"引き受ける"ことで, 特定の権限が一時的に付与される.
```d2
user: {
  style: {
    border-radius: 999
  }
}
group: {
  style: {
    border-radius: 999
  }
}
role: {
  style: {
    border-radius: 8
  }
}
direction: left
group -> user: {style.stroke-dash: 3}
role -> user
role -> group
```

使用例として
- EC2インスタンスのロール: EC2インスタンスからS3バケットにアクセスするために, ロールを通じてアクセス権を付与.
- クロスアカウントアクセス: 異なるAWSアカウント間でリソースにアクセスするためのロールを作成.
他のアカウントが自分のリソースにアクセスできるようにする.

例えば, EC2インスタンスからS3バケットにファイルをアップロードするとする. この場合, アプリケーションからS3バケットにアクセスするためにAWS SDKを使用しなければならない. では, そのためにIAMユーザーを作成してアクセスキーを発行するのかというと, それはアンチパターンにつながる. なぜなら, 以下の問題が発生するからである.
- アクセスキーが漏洩すると, アプリケーションのアクセスキーを設定し直す必要がある. そのためにアプリケーションを一時停止して, 新しいアクセスキーを設定して, 再度デプロイする必要がある.
- アプリケーションの権限管理のためのIAMユーザーを作成しなければならない.

このような問題を解決するために, IAMロールを使用する.
IAMロールを使用すれば, アプリケーション内にアクセスキーをハードコードする必要がなくなる.
まず, IAMロールにポリシーを付与する. そして, IAMロールをEC2インスタンスにアタッチする. これで, EC2インスタンスはIAMロールに付与された権限を持つことができる.
IAMロールをアタッチすると, Security Token Service(STS)というサービスから一時的なアクセスキーを受け取ることができる. このアクセスキーの情報はアプリケーションが持つ必要は無い. また, アクセスキーは一定時間毎にリフレッシュされる.

### IAMポリシー
対して, IAMポリシーはAWSリソースに対するアクセス権限を定義するための**JSON形式の文書**である.
ポリシーをユーザーやグループ, ロールに付与することで, AWSリソースに対するアクセス権限を制御できる.

ポリシーには3つの種類がある.
1. AWS管理ポリシー: AWSが提供するポリシー. 例: AmazonS3FullAccess
2. カスタマー管理ポリシー: ユーザが作成したポリシー. 特定の要件に応じた権限を設定できる. 例: S3FullAccess
3. インラインポリシー: 特定のユーザやグループに直接付与されるポリシー. 使い捨てや一時的な権限設定に利用される.

ポリシーは"Effect"と"Action"と"Resource"の3つの要素で構成される.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::example-bucket"
        }
    ]
}
```

使用例として
- リソース単位の制御: S3バケットの特定のディレクトリにのみアクセスを許可.
- 特定のアクションのみ許可: S3バケットのリスト操作のみを許可し, その他の操作を禁止.
- 条件の付与: 特定のIPアドレスからのアクセスのみ許可.


つまり, ロールに対しポリシーを設定し, ユーザやグループがそのロールを引き受けることで, 一時的なアクセスを可能にする.
つまり,
```d2
user: {
  style: {
    border-radius: 999
  }
}
group: {
  style: {
    border-radius: 999
  }
}
role: {
  style: {
    border-radius: 8
  }
}
group -> user: {style.stroke-dash: 3}
direction: left
policy -> user: {style.animated: true}
policy -> group: {style.animated:true}
policy -> role: {style.animated:true}
role -> user
role -> group
```
デフォルトではユーザーやグループには何もポリシーが付与されていない.
最低限のポリシーを必要になってから徐々に付与することがベストプラクティスになっている.
### ポリシーの書き方
ポリシーはJSON形式で記述される.  
すべての操作を許可するポリシーは以下のようになる.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowAllSamplePolicy",
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```
特定の操作だけ許可するポリシーは以下のようになる.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "SpecificAllSamplePolicy",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": "*"
        }
    ]
}
```
これで`s3`に関する全ての操作が許可される.
さらに細かくリソースを制御することもできる.
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "SpecificAllSamplePolicy",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::example-bucket"
        }
    ]
}
```

IAMポリシーの要素については以下の通り.

|要素|説明|
|---|---|
|Version|AWSが管理するバージョン情報. 固定値.|
|Statement|ポリシーの内容を記述する. 複数のポリシーを記述可能.|
|Sid|ステートメントID. ポリシー内で一意である必要がある. 省略可能.|
|Effect|`Allow`または`Deny`. アクションの許可または拒否を指定.|
|Action|Effectで指定した許可または拒否の対象を指定.|
|Resource|Actionで指定した対象を実行するリソースを指定.|
|Condition|ポリシーを実行できる条件を指定.|

- [IAM JSON ポリシー リファレンス](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies.html)
- [IAM JSON policy reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html)

### ARN(Amazon Resource Name)
ARNは以下のような構造を持つ.
```plaintext
arn:(partition):(service):(region):(account-id):(resource)
arn:(partition):(service):(region):(account-id):(resourcetype)/(resource)
arn:(partition):(service):(region):(account-id):(resourcetype):(resource)
```
例えば, S3バケットのARNは以下のようになる.
```plaintext
arn:aws:s3:::example-bucket
```
これじゃぁ省略が多くて意味がわからないと思うが,
iam-sampleというIAMユーザーのARNは以下のようになる.
```plaintext
arn:aws:iam::123456789012:user/iam-sample
```
ワイルドカードを使うこともできる.  
`admin`グループのすべてのユーザーを指定するARNは以下のようになる.
```plaintext
arn:aws:iam::123456789012:admin/*
```
- [ARNの詳細](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference-arns.html)
- [ARNの詳細(英語)](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html)
