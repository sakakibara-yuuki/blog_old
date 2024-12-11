---
title: 'terraform aws'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-11-30
tags: ["astro", "math"]
---

# Introduction
## Contents
## Terraform

## IAM
通常, AWSでIAM Roleを作成する際には, IAM > ロール > AWSのサービス > ユースケースを選択して作成することが多い. 例えば, ECSのタスク実行ロールを作成するには, Elastic Container Service Taskを選択する. 許可を追加 > 許可ポリシー で, "Task"を検索して, AmazonECSTaskExecutionRolePolicyをアタッチする. これで, ECSタスクがECRにアクセスできるようになる. ここまでで, 過程で信頼ポリシーについては一切触っていない.
しかし, 次のステップで"信頼されたエンティティを選択する"で信頼ポリシーが自動的に提案され, 無自覚にそれを許可していることがほとんどである.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": [
                    "ecs-tasks.amazonaws.com"
                ]
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

このようにコンソールで自動的・デフォルトで設定されている信頼ポリシーなどはTerraformを書く際には忘れがちである.

TerraformでIAM Roleを作成するには何が必要なのかというと，
- aws_iam_role
- aws_iam_policy
- aws_iam_role_policy_attachment

