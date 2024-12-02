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

## VPCの作成
[公式はここ](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc)
| 項目 | 型 | 説明 |
| --- | --- | --- |
| `cidr_block` | string | IPv4 CIDRブロック |
| `assign_generated_ipv6_cidr_block` | string | IPv6 CIDRブロック |
| `instance_tenancy` | string | テナンシー("default"or "dedicated") |
| `enable_dns_support` | bool | DNS解決の有効化 |
| `enable_dns_hostnames` | bool | DNSホスト名の有効化 |
| `tags` | object | タグ |

### Example
以下は公式ドキュメントに載っている例より項目が多いが, コンソールで作成する場合にはこれらの項目が設定される。
```hcl
resource "aws_vpc" "vpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"
  enable_dns_support = true
  enable_dns_hostnames = true
  assign_generated_ipv6_cidr_block = false

  tags = {
    Name = "${var.project}-${var.environment}-vpc"
    Project = var.project
    Env = var.environment
  }
}
```

## VPCとSubnet
VPCとSubnetは依存関係がある。
今回もVPCと同じようにresourceブロックを使う。
| 項目 | 型 | 説明 |
| --- | --- | --- |
| `vpc_id` | string | VPCのID |
| `availability_zone` | string | サブネットのアベイラビリティゾーン |
| `cidr_block` | string | IPv4 CIDRブロック |
| `map_public_ip_on_launch` | bool | このサブネットの中でインスタンス起動時にパブリックIPをマッピングするかどうか |
| `tags` | object | タグ |

### Example
public subnet
```hcl
resource "aws_subnet" "public_subnet_1a" {
  vpc_id = aws_vpc.vpc.id
  availability_zone = "ap-northeast-1a"
  cidr_block = "10.0.0.0/20"
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.project}-${var.environment}-public-subnet-1a"
    Project = var.project
    Env = var.environment
    Type = "public"
  }
}
```

private subnet
```hcl
resource "aws_subnet" "private_subnet_1a" {
  vpc_id = aws_vpc.vpc.id
  availability_zone = "ap-northeast-1a"
  cidr_block = "10.0.16.0/20"
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.project}-${var.environment}-public-subnet-1a"
    Project = var.project
    Env = var.environment
    Type = "private"
  }
}
```
ここでは, パブリックサブネットには`map_public_ip_on_launch = true`を設定している。

## ルートテーブルの作成
```d2
direction: "top"
route: {
  route table <- route table association
}
VPC <- route -> subnet
```
AWS providerを用いたterraformにおけるルートテーブルの仕組みは少し面倒で, 以上のような関係がある。
つまり、単純にルートテーブルを作成するだけでは終わりというわけではなく、ふたつのリソース（route tableとroute table association）を作ってはじめてルートテーブルが有効になる。
どちらもリソースであるため、resourceブロックを使って作成する。

route tableはルートテーブルリソースを提供し、
route table associationはルートテーブルとサブネットの関連付けを提供する。
つまり、route tableという"点"とその点をサブネットという点につなぐ線がroute table associationである。

### route table
| 項目 | 型 | 説明 |
| --- | --- | --- |
| `vpc_id` | string | VPCのID |
| `tags` | object | タグ |

### route table association
| 項目 | 型 | 説明 |
| --- | --- | --- |
| `route_table_id` | string | ルートテーブルID |
| `subnet_id` | string | サブネットID |

### Example
```hcl
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "${var.project}-${var.environment}-public-rt"
    Project = var.project
    Env = var.environment
    Type = "public"
    }
}

resource "aws_route_table_association" "public_rt_1a" {
  route_table_id = aws_route_table.public_rt.id
  subnet_id = aws_subnet.public_subnet_1a.id
  }
```

果たしてルーティングの設定ってこれで合ってたっけ？という疑問がある。

### インターネットゲートウェイの作成
```d2
direction: "top"
VPC <- internet gateway <- route <- route table
```
