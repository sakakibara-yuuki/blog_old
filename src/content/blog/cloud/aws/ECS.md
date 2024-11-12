---
title: 'ECS(Fargate)'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-11-11
tags: ["astro", "math"]
---

# Introduction
AWSのECS(Elastic Contaienr Service)は, コンテナ化されたアプリケーションを管理するためのサービスである.

## Contents
## ECSとは
FargateはECSで利用できるサーバーレスのコンテナ実行環境である.
インフラの管理を自動化し, コンテナの実行に集中することができる.

起動タイプには２つある.
- EC2: スケーラビリティが高い. 必要に応じたリソース調整が可能
- Fargate: サーバーレス. インフラの管理不要

## Fargateの利点と特徴
Fargateを利用することで, オンデマンドでスケーリングが可能であり, インフラのオーバーヘッドが少ないという利点がある.
- 自動スケーリング: ワークロードに応じてリソースが自動調整される. コスト効率が高い.
- セキュリティ: 他のユーザーと隔離された環境で動作.
