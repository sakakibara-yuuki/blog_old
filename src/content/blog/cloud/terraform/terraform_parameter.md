---
title: 'terraform_parameter'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-12-05
tags: ["astro", "math"]
---

# Introduction
## Contents
## DB接続情報の管理
DB接続情報は、terraformのコードに直接書くべきではない。
そこで、パラメータストアを使って、DB接続情報を管理する。
パラメータストアは、VPCの外にあるAWSのサービスで、DB接続情報を安全に管理するために使われる。

`aws_ssm_parameter`を使って、パラメータストアにパラメータを登録することができる。

| 項目 | 型 | 説明 |
| --- | --- | --- |
| name | string | パラメータ名 |
| type | string | "String", "StringList", "SeureString" |
| value | string | パラメータの値 |
| overwrite | bool | 既に存在する場合、上書きするかどうか |
| description | string | パラメータの説明 |
| tags | object | タグ |

必要なパラメータは
```bash
terraform state show aws_db_instance.mysql_standalone
```
から必要なパラメータを探し出し、以下のように登録する。

```hcl
## appserver.tf
## Parameter Store
resource "aws_ssm_parameter" "host" {
  name  = "/${var.project}/${var.environment}/app/MYSQL_HOST"
  type  = "String"
  value = aws_db_instance.mysql_standalone.address
}

resource "aws_ssm_parameter" "port" {
  name  = "/${var.project}/${var.environment}/app/MYSQL_PORT"
  type  = "String"
  value = aws_db_instance.mysql_standalone.port
}

resource "aws_ssm_parameter" "database" {
  name  = "/${var.project}/${var.environment}/app/MYSQL_DATABASE"
  type  = "String"
  value = aws_db_instance.mysql_standalone.db_name
}

resource "aws_ssm_parameter" "username" {
  name  = "/${var.project}/${var.environment}/app/MYSQL_USERNAME"
  type  = "SecureString"
  value = aws_db_instance.mysql_standalone.username
}

resource "aws_ssm_parameter" "password" {
  name  = "/${var.project}/${var.environment}/app/MYSQL_PASSWORD"
  type  = "SecureString"
  value = aws_db_instance.mysql_standalone.password
}
```

コンソールのSystems Managerのパラメータストアに登録されていることを確認する。

