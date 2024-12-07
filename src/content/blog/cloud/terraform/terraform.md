---
title: 'terraform'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-12-02
tags: ["astro", "math"]
---

# Introduction
## Contents
## ブロック
terraformのコードはブロックと呼ばれるもので構成される。
```hcl
locals {
  ...
}
variable <VAR_NAME> {
  ...
}
terraform {
  ...
}
provider <PROVIDER_NAME> {
  ...
}
resource <RESOURCE_TYPE> <RESOURCE_NAME> {
  ...
}
output <OUTPUT_NAME> {
  ...
}
```
```
resource <RESOURCE_TYPE> <RESOURCE_NAME> {
  ...
}
```
の`<RESOURCE_TYPE>`は`aws_instance`や`aws_vpc`などのリソースタイプを指す。
`<RESOURCE_NAME>`はリソースの名前を指す。
`<RESOURCE_TYPE>`と`<RESOURCE_NAME>`の組み合わせでterraform内でリソースを一意に識別する。

## ファイル分割
`terraform apply`をすると, 現在のディレクトリにある全ての`.tf`ファイルが読み込まれる。そのため、`terraform apply main.tf`のようにファイル名を指定することは通常無い。

ただし、サブディレクトリにある`.tf`ファイルは自動的に読み込まれない。

```plaintext
.
├── xxx.tf
├── xxx.tf
└── subdir
    ├── xxx.tf
    ├── xxx.tf
    └── xxx.tf
```
## 公式ドキュメントの読み方
terraform関連のドキュメントは見つけにくい.
- HCL2: [Automate Infrastructure on Any Cloud](https://developer.hashicorp.com/terraform?product_intent=terraform)
- CLI: [CLI](https://developer.hashicorp.com/terraform/cli)
- Providers: [Providers](https://registry.terraform.io/browse/providers?product_intent=terraform)
    - Examples
    - Arguments
    - Attribute Reference
の３つのセクションがある。

## 大体のterraform雛形
以下は、[awsのprovider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)にかかれていたExample・雛形を改造したものである。
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
}

# Create a VPC
resource "aws_vpc" "example" {
  cidr_block = "10.0.0.0/16"
}

variable "project" {
    type    = string
}

variable "environment" {
    type    = string
}
```
特に, 注目すべきは`variable`である。
これは通常のプログラミング言語における変数宣言"var project string"と同じようなものである。

terraformでは変数名を考えることが多いが、これを使うことで統一的に変数名を使うことができる。

この変数については`main.tf`と同じディレクトリに`terraform.tfvars`というファイルを作成し、以下のように記述する。

```plaintext
project = "myproject"
environment = "dev"
```

このように記述することで、
```hcl
Name = "${var.project}-${var.enviroment}-vpc"
Project = var.project
Env = var.enviro
```
のように変数を使うことができる。


具体的なterraformの構成は以下の通り。

- [terraform network](../terraform_network)
- [terraform db](../terraform_db)
- [terraform ec2](../terraform_ec2)
- [terraform management](../terraform_management)
- [terraform iam](../terraform_iam)
- [terraform parameter](../terraform_parameter)
- [terraform app server build](../terraform_app_server_build)
- [terraform grammer](../terraform_grammer)

## LBの設定
ELBのデータ構造は次のようになっている。

```d2
Load Balancer <- Listener
Target Group <- Listener
Target Group <- Target Group attachment
EC2 <- Target Group attachment
```

### aws_lb
| 項目 | 型 | 説明 |
| --- | --- | --- |
| name | string | ロードバランサー名 |
| internal | bool | 内部向けLBかどうか |
| load_balancer_type | enum | "application", "network", "gateway" |
| security_groups | string[] | LBに関連付けるセキュリティグループ |
| subnets | string[] | LBに関連付けるサブネット |
| tags | object | タグ |

```hcl
resource "aws_lb" "lb" {
  name               = "${var.project}-${var.environment}-app-lb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.web_sg.id]
  subnets = [
    aws_subnet.public_subnet_1a.id,
    aws_subnet.public_subnet_1c.id
  ]
}
```

### aws_lb_target_group
| 項目 | 型 | 説明 |
| --- | --- | --- |
| name | string | ロードバランサー名 |
| port | number | ポート番号 |
| protocol | string | "HTTP", "HTTPS", "TCP", "UDP", "TCP_UDP" |
| vpc_id | string | VPC ID |
| tags | object | タグ |

```hcl
resource "aws_lb_target_group" "alb_target_group" {
  name     = "${var.project}-${var.environment}-app-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = aws_vpc.vpc.id
  tags = {
    Name    = "${var.project}-${var.environment}-app-tg"
    Project = var.project
    Env     = var.environment
  }
}
```

### aws_lb_target_group_attachment
| 項目 | 型 | 説明 |
| --- | --- | --- |
| target_group_arn | string | 所属させたいターゲットグループのARN |
| target_id | string | EC2インスタンスなどのID |

```hcl
resource "aws_lb_target_group_attachment" "alb_target_group_attachment" {
  target_group_arn = aws_lb_target_group.alb_target_group.arn
  target_id        = aws_instance.app_server.id
}
```

### aws_lb_listener
HTTPの場合

| 項目 | 型 | 説明 |
| --- | --- | --- |
| load_balancer_arn | string | ロードバランサーのARN |
| port | number | ポート番号 |
| protocol | enum | "HTTP", "HTTPS", ... |
| certificate_arn | string | 証明書(ACM)のARN (HTTPSのみ) |
| default_action | object | ... |

default_actionの中身は次のようになる。
| 項目 | 型 | 説明 |
| --- | --- | --- |
| type | enum | "forward", "redirect", etc... |
| target_group_arn | string | forwardする場合の転送先 |

```hcl
resource "aws_lb_listener" "alb_listener_http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_target_group.arn
  }
}
```

これまでのことを少し詳しくまとめる。

