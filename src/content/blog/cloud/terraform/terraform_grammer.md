---
title: 'terraform grammer'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-12-05
tags: ["astro", "math"]
---

# Introduction
## Contents
## terraformの文法
### terraformのメタ引数
メタ引数は全てのリソースで使える特殊な引数であり、以下のようなものがある。
| メタ引数 | 説明 |
| --- | --- |
| depends_on | リソース間の依存関係を指定する |
| count | リソースを複数作成する際に使う |
| for_each | リストをループしながらリソースを複製する |
| lifecycle | terraformがリソースを操作するときの振る舞いを定義する |
| provider | プロバイダを指定(上書き)する |

#### depends_on
terraformのリソース間の依存関係はどのようにして決まるのだろうか。

terraformではそのソースコード内でリソースの参照関係を定義することによって、リソース間の依存関係が自動的に判定される。具体的には、`aws_instance`の`vpc_security_group_ids`などのような引数を使うことで、リソース間の依存関係を明示的に示すことができる。

しかし、暗黙的に依存関係があるにも関わらず、terraformがそれを判定できない場合がある。そのような場合には、`depends_on`を使って明示的に依存関係を示すことができる。

実際にそのようなケースとして、S3のバケットポリシーとパブリック・アクセスブロック間の依存関係がある。バケットポリシーを設定する前にパブリック・アクセスブロックを設定しておかないと、バケットポリシーの設定ができない。しかし、terraformのコード上では明示的にその依存関係を示すことができないため、`depends_on`を使って明示的に依存関係を示す必要がある。

また、terraformでの依存関係を調べるのに`terraform graph`などを使うことができる。

#### cout
複数リソースを扱う際に、`count`と`for_each`があるが、これらは排他的である。つまり、同時に使用できない。
実際に例を見ていく。

```hcl
resource "aws_instance" "server" {
  count = 4

  ami = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = {
    Name = "server-${count.index}"
  }
}
```
このように, countというメタ引数を使い、`aws_instance`を4つ作成することができる。各リソースのインデックスは`count.index`で取得できる。
なお、このインデックスは0から始まる。

### for_each
`count`とは異なり、`for_each`に代入するのはmapまたはsetである。
リストでは回せないことに注意する。
以下は、`for_each`にマップを使った例である。

```hcl
resource "aws_vpc" "vpc" {
  cidr_block = "192.168.0.0/20"
}

resource "aws_subnet" "subnet" {
  for_each = {
    "192.168.1.0/24" = "ap-northeast-1a"
    "192.168.2.0/24" = "ap-northeast-1c"
    "192.168.3.0/24" = "ap-northeast-1d"
  }

  vpc_id             = aws_vpc.vpc.id
  cidr_block         = each.key
  availability_zone  = each.value
}
```
`for_each`の定義は、`for_each = {key = value}`のように定義する。
`each.key`と`each.value`でそれぞれkeyとvalueを取得できる。

以下は配列を使いたい場合(setに直した)の例である。
```hcl
resource "aws_iam_user" "user" {
  for_each = toset(["user1", "user2", "user3"])

  name = each.value
}
```
`toset`を使うことで、リストをセットに変換することができる。
なお、この関数を使うことで重複を削除することができる。
(というか、リストは重複を許すからfor_eachに代入できない？)

### lifecycle
`lifecycle`は、リソースの振る舞いを定義するメタ引数である。
そもそも、terraformにはどのようなライフサイクルがあるのだろうか。

| フェーズ | 説明 |
| --- | --- |
| Create | クラウド上に存在しないリソースを新規に生成する。 |
| Destroy | クラウド上に生成したリソースを削除する。 |
| Update | クラウド上に生成済みのリソースに対して修正を行う。 |
| Destroy & Re-Create | コード変更が"Update"で対応できないので、一度クラウド上のリソースを削除して再生成する。 |

これらlifecyleに対して、`lifecyle`メタ引数はさらに細かく振る舞いを制御することができる。
| 項目 | 型 | 説明 |
| --- | --- | --- |
| create_before_destroy | bool | リソースを削除前に生成するか |
| prevent_destroy | bool | リソースを削除できないようにするか |
| ignore_changes | string[] | 指定された属性の変更反映を無視する |

例としては以下のようなものである。
```hcl
lifecyle {
  create_before_destroy = true
  prevent_destroy = true
  ignore_changes = ["tags"]
}
```
prevent_destroyはRDSなどに使用される。

## terraform におけるfor文
通常、for文といったら、繰り返し処理を表すものだが、
terraformのfor文は、**リスト型(list map set)を異なるリスト型(list map)に変換する**という意味で使われる。
(内包表記的に)

```hcl
[for s in var.list : upper(s)]
```
| 元\先 | list | map |
| --- | --- | --- |
| list, set | [for s in var.list : upper(s)] | {for s in var.list : s => upper(s)} |
| map | [for k, v in var.map : upper(v)] | {for k, v in var.map : k => upper(v)} |

変換元がlistなら`s`、mapなら`k, v`を使う。  
変換先がlistなら`[]`、mapなら`{}`を使う。
特に、mapでは`k => v`のように`=>`を使う。

さらに、`if`を使って条件分岐を行うこともできる。
以下のif文は、空文字列を除外して大文字に変換する。
```hcl
[for s in var.list : upper(s) if s != ""] 
```

ただし、`if`しかなく、`else`や`then`などは使えない。

for文を使った例として以下のようなものがある。
```
//some.tf
variable "list" {
  type = list(string)
  default = ["a", "b", "c"]
}
> terraform init //これが無いとsome.tfを読み込まない。
> terraform console
> [ for s in var.list : upper(s) ]
> [
  "A"
  "B"
  "C"
  ]
```

## terraform における3項演算子
3項演算子は、`condition ? true : false`のように使う。
```hcl
var.a != "" ? var.a : "default"
```
terraformでは**if文が存在しない**ため、3項演算子を使って条件分岐を行うことができる。

```
//some.tf
variable "message" {
  type = list(string)
  default = "hello world"
}
> terraform init //これが無いとsome.tfを読み込まない。
> terraform console
> var.message != "" ? var.message : "good night..."
> good night...
```

