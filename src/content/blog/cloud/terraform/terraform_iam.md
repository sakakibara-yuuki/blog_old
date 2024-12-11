---
title: 'terraform iam'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-12-05
tags: ["astro", "math"]
---

# Introduction
## Contents
## Section1
## terraform IAM Role
terraformの、というかAWSのIAM Roleはかなり複雑である。

```d2
Instance Profile: {
    label: Instance Profile\n\nEC2に関連付けるリソース
}
Trust Policy: {
    label: Trust Policy\n\nIAM RoleをEC2と関連付けることを定義
    shape: page
}
Policy: {
    label: Policy\n\nポリシーの具体的な内容
    shape: page
}
Trust Policy <- IAM Role: {
    source-arrowhead: {
        shape: diamond
        style.filled: true
    }
}
IAM Role <- Instance Profile
IAM Role <- Policy attachement
Policy <- Policy attachement: {
    source-arrowhead: {
        shape: diamond
        style.filled: true
    }
}
```

### 信頼ポリシーの作成
信頼ポリシーとは何か。
IAM Roleは、他のAWSサービスやアカウントに対してどのような操作を許可するかを定義するものであり、帽子で表現される。
ある種類(色など)の帽子をかぶっている人が特定の建物や区域や施設に入れるような約束の下では、その帽子自体が侵入許可書になる。
ヘルメットをかぶっている人は工事現場に入ることが出来、青い帽子をかぶっている人はトイレの清掃員としてある会社に入ることができる、といった具合である。
つまり、帽子は認証・認可でいうところの認可の役割を担っているのだ。  
ここで重要になってくるのが、誰が帽子をかぶるのか、と、その帽子をかぶっている人が何をすることができるのか、である。

さて、信頼ポリシーでは、誰が(どのプリンシパルが) IAM Roleを引き受けるのかを定義する。
つまり、**誰がその帽子をかぶるのか**を定義する。

信頼ポリシーの他に、ポリシーというものがある。
ポリシーは、**その帽子をかぶっている人が何をすることができるのか** を定義する。


| 項目 | 型 | 説明 |
| --- | --- | --- |
| version | string | ポリシーのバージョン。現在は"2012-10-17"のみ |
| policy_id | string | ポリシーID |
| statement | block | ... |

statementの中身は以下の通り。
| 項目 | 型 | 説明 |
| --- | --- | --- |
| sid | string | ポリシーID |
| effect | enume | "Allow" or "Deny" |
| actions | string[] | アクションリスト |
| resources | string[] | 処理対象のリソース |
| principals | block | ... |

principalsの中身は以下の通り。
| 項目 | 型 | 説明 |
| --- | --- | --- |
| type | string | "AWS", "Service"など |
| identifiers | string[] | ARN, サービスURLなど |

以下は何が書いてあるかわからないと思うが、マネジメントコンソールでIAM Roleを作成すると、以下のようなJSONが生成される。
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```
それをterraformで書くと以下のようになる。
```hcl
data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}
```
以下のコマンドで、ポリシーが正しく作成されているか確認できる。
```bash
terraform state show data.aws_iam_policy_document.ec2_assume_role
```
これによってEC2が帽子を被ることができるようになる。

### IAM Roleの作成
`aws_iam_role`リソースを使ってIAM Roleを作成する。

| 項目 | 型 | 説明 |
| --- | --- | --- |
| name | string | IAM Roleの名前 |
| assume_role_policy | string | 信頼ポリシーjson |
| description | string | 説明 |
| tags | object | タグ |

```hcl
resource "aws_iam_role" "app_iam_role" {
  name               = "${var.project}-${var.environment}-app-iam-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json
}
```

### IAM Roleにポリシーをアタッチする
`aws_iam_role_policy_attachment`リソースを使ってIAM Roleにポリシーをアタッチする。
| 項目 | 型 | 説明 |
| --- | --- | --- |
| role | string | アタッチするIAM Roleの名前 |
| policy_arn | string | アタッチするポリシーのARN |

今回は、4つのポリシーをIAM Roleへアタッチする。
- AmazonSSMManagedInstanceCore: Session Managerを使うためのポリシー
- AmazonS3ReadOnlyAccess: S3からファイルを読み込むためのポリシー
- AmazonEC2ReadOnlyAccess: EC2のタグを読み込むためのポリシー
- AmazonSSMReadOnlyAccess: Parameter Storeを読み込むためのポリシー

たとえば、AmazonEC2ReadOnlyAccessのARNは以下のようになる。
```
arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess
```

```hcl
resource "aws_iam_role_policy_attachment" "app_iam_role_ec2_readonly" {
  role       = aws_iam_role.app_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess"
}

resource "aws_iam_role_policy_attachment" "app_iam_role_ssm_managed" {
  role       = aws_iam_role.app_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "app_iam_role_ssm_readonly" {
  role       = aws_iam_role.app_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}

resource "aws_iam_role_policy_attachment" "app_iam_role_s3_readonly" {
  role       = aws_iam_role.app_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}
```

このように`aws_iam_role_policy_attachment`の中で`policy_arn`を選んで付けることで、IAM Roleにポリシーをアタッチすることができる。

### IAM Roleにインスタンスプロファイルをアタッチする
EC2にIAM Roleをアタッチする際に、直接的にIAM Roleがアタッチされるのではなく、インスタンスプロファイルを介してアタッチされる。

| 項目 | 型 | 説明 |
| --- | --- | --- |
| name | string | インスタンスプロファイルの名前 |
| role | string | アタッチするIAM Roleの名前 |

ここで注意すべきなのが、nameをIAM Role名と一致させるべきということである。
roleは一応Optionだが、設定しなければ意味がないので、必ず設定するようにする。

```hcl
resource "aws_iam_instance_profile" "app_ec2_profile" {
  name = aws_iam_role.app_iam_role.name
  role = aws_iam_role.app_iam_role.name
}
```
インスタンスプロファイルはコンソール上で確認することが困難なため、以下のコマンドで確認することができる。
```bash
terraform state show aws_iam_instance_profile.app_ec2_profile
```

### EC2インスタンスにIAM Roleをアタッチする
EC2インスタンスにIAM Roleをアタッチするためには、`aws_instance`の`iam_instance_profile`を指定する必要がある。

```hcl
resource "aws_instance" "app_server" {
  ami                         = data.aws_ami.app.id
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.public_subnet_1a.id
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.app_ec2_profile.name
  vpc_security_group_ids = [aws_security_group.app_sg.id,
  aws_security_group.opmng_sg.id]
  key_name = aws_key_pair.keypair.key_name
  tags = {
    Name    = "${var.project}-${var.environment}-app-ec2"
    Project = var.project
    Env     = var.environment
    Type    = "app"
  }
}
```
