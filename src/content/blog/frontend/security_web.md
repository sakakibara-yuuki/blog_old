---
title: 'Web Security'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-08-14
tags: ["security", "web", "memo"]
---

# Introduction
## Contents
## セッション
セッションとは何か
セッションハイジャック
セッションストレージ
暗号化cookieや署名済みcookieの設定をローテーションする
CookieStoreセッションに対するリプレイ攻撃
セッション固定攻撃
セッション固定攻撃 - 対応策
セッションを失効させる

## クロスサイトリクエストフォージェリ（CSRF）
CSRFへの対応策

## リダイレクトとファイル
リダイレクト
ファイルアップロード
ファイルアップロードで実行可能なコードを送り込む
ファイルのダウンロード

## ユーザー管理
アカウントに対する総当たり攻撃
アカウントのハイジャック
CAPTCHA
ログ出力
正規表現
権限昇格

## インジェクション
許可リスト方式と禁止リスト方式
SQLインジェクション
クロスサイトスクリプティング（XSS）
CSSインジェクション
テキスタイルインジェクション（Textile Injection）
Ajaxインジェクション
コマンドラインインジェクション
ヘッダーインジェクション

## 安全でないクエリ生成
## HTTPセキュリティヘッダー
デフォルトのセキュリティヘッダー
Strict-Transport-Securityヘッダー
Content-Security-Policyヘッダー
Feature-Policy Header
Cross-Origin Resource Sharing（CORS）

## イントラネットとAdminのセキュリティ
クロスサイトスクリプティング
クロスサイトリクエストフォージェリ
その他の予防策

## 利用環境のセキュリティ
独自のcredential

## 依存関係の管理とCVEについて
## 追加資料
## 参考資料
- [安全なウェブサイトの作り方](https://www.ipa.go.jp/security/vuln/websecurity/ug65p900000196e2-att/000017316.pdf)
- [Rails セキュリティガイド](https://railsguides.jp/security.html#%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%A2%E3%83%83%E3%83%97%E3%83%AD%E3%83%BC%E3%83%89%E3%81%A7%E5%AE%9F%E8%A1%8C%E5%8F%AF%E8%83%BD%E3%81%AA%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E9%80%81%E3%82%8A%E8%BE%BC%E3%82%80)
- [安全なWebアプリケーションの作り方](https://www.amazon.co.jp/%E4%BD%93%E7%B3%BB%E7%9A%84%E3%81%AB%E5%AD%A6%E3%81%B6-%E5%AE%89%E5%85%A8%E3%81%AAWeb%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9-%E7%AC%AC2%E7%89%88-%E8%84%86%E5%BC%B1%E6%80%A7%E3%81%8C%E7%94%9F%E3%81%BE%E3%82%8C%E3%82%8B%E5%8E%9F%E7%90%86%E3%81%A8%E5%AF%BE%E7%AD%96%E3%81%AE%E5%AE%9F%E8%B7%B5-%E5%BE%B3%E4%B8%B8/dp/4797393165)
