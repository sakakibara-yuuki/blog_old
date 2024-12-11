---
title: 'terraform lb'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-12-08
tags: ["astro", "math"]
---

# Introduction
## Contents
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

ロードバランサーがパケットを分配するターゲットをグループ化する雛形を作る。
どのロードバランサーが受け付けるのか、ターゲットはどのVPCに所属するのか、ターゲットに対してどのポート・プロトコルで通信するのかなどを設定する。

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

aws_lb_target_group_attachementはターゲットグループに所属させたいEC2インスタンスなどを指定するもの。
EC2インスタンス自体とターゲットグループを関連付ける。

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

ロードバランサーがインターネットからどのよなリクエストを受付、それをどこに転送してくのか(リスナー)を設定する。

| 項目 | 型 | 説明 |
| --- | --- | --- |
| load_balancer_arn | string | ロードバランサーのARN |
| port | number | ポート番号 |
| protocol | enum | "HTTP", "HTTPS", ... |
| ssl_policy | enume | "ELBSecurityPolicy-2016-08"など (HTTPSのみ) |
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
