---
title: 'terraform s3'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-12-11
tags: ["astro", "math"]
---

# Introduction
## Contents
## S3
```d2
Bucket <- Public Access Block
Bucket <- Bucket Policy
Policy Document <- Bucket Policy
```

Public Access BlockとBucket Policyはアクセス権限に関するリソースである。
バケットを作成する場合、その名前は世界で唯一である必要がある。
S3には大抵、静的コンテンツを保存する。

### aws_s3_bucket
| 項目 | 型 | 説明 |
| --- | --- | --- |
| bucket | string | バケット名 |
| force_destroy | bool | バケットが空でない場合でも削除するかどうか |
| versioning | enum | バージョニングの設定 |
| tags | object | タグ |

```hcl
resource "random_string" "s3_unique_key" {
  length  = 6
  upper   = false
  lower   = true
  numeric = true
  special = false
}

resource "aws_s3_bucket" "s3_static_bucket" {
  bucket = "${var.project}-${var.environment}-static-bucket-${random_string.s3_unique_key.result}"
}

resource "aws_s3_bucket_versioning" "s3_static_bucket_version" {
  bucket = aws_s3_bucket.s3_static_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}
```


### aws_s3_public_access_block
これはコンソール上のブロックパブリック・アクセスに相当するものである。

| 項目 | 型 | 説明 |
| --- | --- | --- |
| bucket | string | バケット名 |
| block_public_acls | bool | 新しいACL設定をブロック |
| block_public_policy | bool | 新しいバケットポリシーをブロック |
| ignore_public_acls | bool | 公開ACL設定を無視するか |
| restrict_public_buckets | bool | 所有者とAWSサービスのみにアクセス制限 |

注意点としてbucket policyと依存関係がある。

プライベート用のバケットを作成する場合、このリソースを全てfalseにし、 `aws_s3_bucket_policy`を使ってバケットポリシーを内部(例えば、ビルドEC2インスタンス)から設定する。

```hcl
resource "aws_s3_bucket_public_access_block" "s3_static_bucket" {
  bucket                  = aws_s3_bucket.s3_static_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = false
  # depends_on              = [aws_s3_bucket_policy.s3_static_bucket]
}
```

### aws_iam_policy_document
jsonデータで記述する。
これはIAMと同じ

```hcl
data "aws_iam_policy_document" "s3_static_bucket" {
  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.s3_static_bucket.arn}/*"]
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::186578003896:user/admin"]
    }
  }
}
```

### aws_s3_bucket_policy
| 項目 | 型 | 説明 |
| --- | --- | --- |
| bucket | string | バケット名 |
| policy | string | バケットポリシーを表現するJSON |

```hcl
resource "aws_s3_bucket_policy" "s3_static_bucket" {
  bucket = aws_s3_bucket.s3_static_bucket.id
  policy = data.aws_iam_policy_document.s3_static_bucket.json
}
```

