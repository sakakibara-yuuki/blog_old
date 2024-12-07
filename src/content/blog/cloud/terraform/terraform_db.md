---
title: 'terraform db'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-12-04
tags: ["astro", "math"]
---

# Introduction
## Contents
## DB運用
RDS全体の構造は以下のようになっている。

```d2
VPC <- DB subnet group
parameter group <- RDS instance
option group <- RDS instance
DB subnet group <- RDS instance
```

### aws_db_parameter_group
parameter groupではRDSで使用されるDBインスタンスのパラメータを設定する。
このパラメータはAWS側で用意されているものを使う。

| 項目 | 型 | 説明 |
| --- | --- | --- |
| `family` | string | パラメータグループファミリ, "mysql8.0", "postgres12", etc.. |
| `parameter` | block | 具体的なパラメータname, value |
| `tags` | object | タグ |

#### Example
今回はRDSのパラメータの`character_set_database`と`character_set_server`をutf8mb4に設定する。

```hcl
resource "aws_db_parameter_group" "mysql_standalone_parametergroup" {
  name   = "${var.project}-${var.environment}-mysql-standalone-parametergroup"
  family = "mysql8.0"

  parameter {
    name  = "character_set_database"
    value = "utf8mb4"
  }

  parameter {
    name  = "character_set_server"
    value = "utf8mb4"
  }
}
```

### オプショングループ
DBインスタンスに追加するオプションを設定するためのリソースである。

| 項目 | 型 | 説明 |
| --- | --- | --- |
| `name` | string | オプショングループ名 |
| `engine_name` | string | エンジン名, `mysql`, `postgres`など |
| `major_engine_version` | string | メジャーエンジンバージョン, "5.7", "8.0"など |
| `option` | block | 個別具体的なオプション名 |
| `tags` | object | タグ |

#### Example
```hcl
resource "aws_db_option_group" "mysql_standalone_optiongroup" {
  name                 = "${var.project}-${var.environment}-mysql-standalone-optiongroup"
  engine_name          = "mysql"
  major_engine_version = "8.0"
}
```

### サブネットグループ
DBが配置されるサブネットを指定するリソースである。
今回は、プライベートサブネットを束ねる形でサブネットグループを作成していく。

| 項目 | 型 | 説明 |
| --- | --- | --- |
| `name` | string | サブネットグループ名 |
| `subnet_ids` | string[] | サブネットID |
| `tags` | object | タグ |

![aws_db_subnet_group](./aws_db_subnet_group.png)

#### Example
```hcl
resource "aws_db_parameter_group" "mysql_standalone_parametergroup" {
  name   = "${var.project}-${var.environment}-mysql-standalone-parametergroup"
  family = "mysql8.0"

  parameter {
    name  = "character_set_database"
    value = "utf8mb4"
  }

  parameter {
    name  = "character_set_server"
    value = "utf8mb4"
  }
}

resource "aws_db_option_group" "mysql_standalone_optiongroup" {
  name                 = "${var.project}-${var.environment}-mysql-standalone-optiongroup"
  engine_name          = "mysql"
  major_engine_version = "8.0"
}

resource "aws_db_subnet_group" "mysql_standalone_subnetgroup" {
  name       = "${var.project}-${var.environment}-mysql-standalone-subnetgroup"
  subnet_ids = [aws_subnet.private_subnet_1a.id, aws_subnet.private_subnet_1c.id]
  tags = {
    Name    = "${var.project}-${var.environment}-mysql-standalone-subnetgroup"
    Project = var.project
    Env     = var.environment
  }
}
```

### ランダム文字列の生成
ランダム文字列を生成するために`hasicorp/random`というproviderを使う。
そのため、`terraform init`を実行してproviderをインストールする必要がある。

![random_generate](./random_generate.png)

| 項目 | 型 | 説明 |
| --- | --- | --- |
| `length` | number | ランダム文字列の長さ(default: true) |
| `upper` | bool | 大文字英字を使うかどうか(default: true)  |
| `lower` | bool | 小文字英字を使うかどうか(default: true)  |
| `number` | bool | 数字を使うかどうか(default: true)  |
| `special` | bool | 特殊文字を使うかどうか(default: true)  |
| `override_special` | string | 利用したい特殊文字 |

## DB instance
DBインスタンスの設定項目は多い。
- 基本設定
- ストレージ
- ネットワーク
- DB設定
- バックアップ
- 削除防止
などなど...

### 基本設定
| 項目 | 型 | 説明 |
| --- | --- | --- |
| 基本設定 | --- | --- |
| `engine` | string | エンジン名 |
| `engine_version` | string | エンジンバージョン |
| `identifier` | string | DBインスタンス名 |
| `instance_class` | string | インスタンスクラス |
| `username` | string | ユーザ名 |
| `password` | string | パスワード |
| `tags` | object | タグ |
| ストレージ | --- | --- |
| `allocated_storage` | number | ストレージ容量 |
| `max_allocated_storage` | number | 最大ストレージ容量 |
| `storage_type` | string | ストレージタイプ |
| `storages_encrypted` | bool | ストレージ暗号化 |
| ネットワーク | --- | --- |
| `multi_az` | bool | マルチAZ |
| `availability_zone` | string | アベイラビリティゾーン |
| `db_subnet_group_name` | string | サブネットグループ名 |
| `vpc_security_group_ids` | string[] | セキュリティグループID |
| `publicly_accessible` | bool | パブリックアクセス |
| `port` | number | ポート番号 |
| DB設定 | --- | --- |
| `name` | string | DB名 |
| `parameter_group_name` | string | パラメータグループ名 |
| `option_group_name` | string | オプショングループ名 |
| `subnet_group_name` | string | サブネットグループ名 |
| バックアップ | --- | --- |
| `backup_window` | string | バックアップウィンドウ |
| `backup_retention_period` | number | バックアップ保持期間 |
| `maintenance_window` | string | メンテナンスウィンドウ |
| `auto_minor_version_upgrade` | bool | マイナーバージョンアップグレード |
| 削除防止 | --- | --- |
| `skip_final_snapshot` | bool | 最終スナップショットをスキップ |
| `deletion_protection` | bool | 削除防止 |
| `apply_immediately` | bool | 即時反映するか |

![aws_db_instance](./aws_db_instance.png)

バックアップでは`backup_window`でいつバックアップを取るかを指定し、`maintenance_window`でいつメンテナンスを行うかを指定している。つまり, `backup_window`が`04:00-05:00`であるなら、`maintenance_window`は`05:00-06:00`のように、バックアップ後にメンテナンスを行うように設定する。

また, `identifier`は**DBインスタンス名**であり、`name`は**DB名**であることに注意する。`identifier`はコンソール上での表示名・識別名であり、`database-1`のような名前が付けられていることが多い。
対して、`name`はDBにアクセスする際の名前であり、`mydb`のような名前が付けられていることが多い。

### RDSの削除対策
以下では誤削除を防止するための設定を行う。
| 項目 | 型 | 説明 |
| --- | --- | --- |
| `deletion_protection` | bool | 削除防止するか (true)|
| `skip_final_snapshot` | bool | 削除時のスナップショットをスキップ (false)|
| `apply_immediately` | bool | 即時反映するか (false)|

"()"の中がデフォルト値であり、
デフォルトでは削除対策が有効になっている。

削除実行時にはこれを反転させる。

- `deletion_protection`: true -> false
- `skip_final_snapshot`: false -> true
- `apply_immediately`: false -> true

削除時には`terraform apply`を実行して、この設定を反映させなければ削除できない。
- `terraform apply`: 削除対策を解除
- db_instanceの部分をコメントアウトで削除

この順番でなければdb instanceは削除されない。

## RDSのパスワード・パラメータストア
今回、terraformのパスワードは`random_password`を使って生成した。
生成されたパスワードは`terraform.tfstate`ファイルから確認できたが、これにはセキュリティ上の問題がある。
そう。パスワードが平文で保存されているのだ。

この問題の対応方法として、
- RDSのパスワードをDBインスタンスを作成した後に変更する
- 管理者以外がtfstateファイルを見れないようにする。

といった管理がある。それぞれに対して、メリット・デメリットがある。
- tfstateとAWSが一致しなくなるため、パスワードは別管理が必要になる。
- 人の管理をしなければならなくなる。

今回は後者の対応、つまり管理者以外がtfstateファイルを見れないようにすることを行った。

![aws_db_password_management](./aws_db_password_management.png)

## RDSへのデータ投入
### RDSの踏み台サーバー
![aws_jump_server](./aws_jump_server.png)
コンソールからEC2 > キーペア > キーペアの作成を選択し、キーペアを作成する。
`web-server-gin-dev-keypair`のような名前をつける。
ファイル形式はpem形式とする。

サブネットを`ap-northeast-1a`、セキュリティグループを
- アプリケーション用
- 運用管理用
の2つを選択する。

キーペアは最初に作成したキーペアを選択する。

sshで接続する！

```bash
ssh -i <pemファイル> ec2-user@<public_ip>
```
EC2インスタンス内でMySQLクライアントをインストールする。
[こちら](https://dev.mysql.com/doc/refman/8.4/en/linux-installation-yum-repo.html)を参照！

```bash
sudo yum localinstall mysql80-community-release-el7.noarch.rpm
```
ただし、これだとファイルが存在しない(リポジトリを登録していないので)と言われるので、以下のコマンドを実行する。
以下のコマンドはリポジトリに登録せず、パッケージファイルを直接指定してインストールする方法である。

```bash
sudo dnf -y install https://dev.mysql.com/get/mysql84-community-release-el9-1.noarch.rpm # リポジトリの登録
sudo dnf -y install mysql-community-client # db client の インストール
```

terraform.tfstateファイルからRDSのエンドポイントを取得
```bash
> cat terraform.tfstate | grep -A 100 "aws_db_instance" | grep -E "address|password"

"address": "web-service-gin-dev-mysql-standalone.cymalqtopmzh.ap-northeast-1.rds.amazonaws.com",
"manage_master_user_password": null,
"password": "Mz8z6uZWCGeHMBl0",
```

では、MySQLに接続してみる。

```bash
mysql -h web-service-gin-dev-mysql-standalone.cymalqtopmzh.ap-northeast-1.rds.amazonaws.com -P 3306 -u admin -pMz8z6uZWCGeHMBl0
```
ここで、`p`の後ろにスペースを入れないことに注意する。

すると、MySQLに接続できる。

次に、sqlファイルを`rsync`で踏み台サーバーにコピーする。
```bash
sudo rsync -avz -e "ssh -i ssh/web-server-gin-dev-keypair.pem" sql/data.tar.gz ec2-user@13.231.243.93:/home/ec2-user/
```
ここで、`-e`以降に`ssh`のコマンドを入れる。
また、`ssh`では`ec2-user@<public_ip>`の部分は、`ec2-user@<private_ip>`でも良かったが、なぜか`rsync`では`public_ip`を指定する必要があった。

ec2-userでログインして、tarファイルを解凍する。
```bash
tar -zxvf data.tar.gz
```

ここに格納されていたconfファイルを変更する。
```bash
[client]
user = admin
password = Mz8z6uZWCGeHMBl0
host = web-service-gin-dev-mysql-standalone.cymalqtopmzh.ap-northeast-1.rds.amazonaws.com
port = 3306
```

`10-alter_user`ディレクトリに含まれる以下の`ALTER`文を実行する。
```bash
// alter-user.sql
ALTER USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY 'Mz8z6uZWCGeHMBl0';
```

```bash
// 10-alter.sh
mysql -defaults-extra-file=../dbaccess.cnf < ./alter-user.sql
```
その他、`20-create_db/create_table.sh`、`30_insert_data/insert_sampledata.sh`を実行する。

終わったら、ECSを削除して、KeyPairを削除する。
また、RDSも停止する。

ここで、興味深いのが、`10-alter-user`, `20-create_db`, `30_insert_data`というファイルの名付けである。また、それらディレクトリの中身も`.cmd`, `.sh`, `.sql`といった拡張子のファイルで構成されていることである。
`.cmd`ファイルはWindowsのバッチファイルであり、`.sh`ファイルはLinuxのシェルスクリプトである。

