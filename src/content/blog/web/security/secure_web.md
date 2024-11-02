---
title: 'Webセキュリティの基本'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-10-18
tags: ["astro", "math"]
---

# Introduction
[安全なウェブサイトの作り方](https://www.ipa.go.jp/security/vuln/websecurity/ug65p900000196e2-att/000017316.pdf)
を読んだまとめ記事です.
## Contents

## セキュリティ実装チェックリスト

<ui>
  <li>
    <input id="1-1-a" type="checkbox">
    <label for="1-1-a">SQL文の組み立ては全てプレースホルダで実装する</label>
  </li>
  <li>
    <input id="1-1-b" type="checkbox">
    <label for="1-1-b">SQL文の構成を文字列連結により実現する場合は, アプリケーションの変数をSQL文のリテラルとして正しく構成する</label>
  </li>
  <li>
    <input id="1-2" type="checkbox">
    <label for="1-2">ウェブアプリケーションに渡されるパラメータにSQL文を直接指定しない</label>
  </li>
  <li>
    <input id="2-1" type="checkbox">
    <label for="2-1">シェルを起動できる言語機能の利用を避ける</label>
  </li>
  <li>
    <input id="3-1-a" type="checkbox">
    <label for="3-1-a">外部からのパラメータでウェブサーバー内のファイル名を直接指定する実装を避ける</label>
  </li>
  <li>
    <input id="3-1-b" type="checkbox">
    <label for="3-1-b">ファイルを開く際は, 固定のディレクトリを指定し, かつファイル名にディレクトリ名が含まれないようにする</label>
  </li>
  <li>
    <input id="4-1" type="checkbox">
    <label for="4-1">セッションIDを推測が困難なものにする</label>
  </li>
  <li>
    <input id="4-2" type="checkbox">
    <label for="4-2">セッションIDをURLパラメータに格納しない</label>
  </li>
  <li>
    <input id="4-3" type="checkbox">
    <label for="4-3">HTTPS通信で利用するCookieにはsecure属性を加える</label>
  </li>
  <li>
    <input id="4-4-a" type="checkbox">
    <label for="4-4-a">ログイン成功後に新しくセッションを開始する</label>
  </li>
  <li>
    <input id="4-4-b" type="checkbox">
    <label for="4-4-b">ログイン成功後に, 既存のセッションIDとは別に秘密情報を発行し, ページ遷移ごとにその値を確認する</label>
  </li>
  <li>
    <input id="5-1" type="checkbox">
    <label for="5-1">ウェブページに出力する全ての要素に対して, エスケープ処理を施す</label>
  </li>
  <li>
    <input id="5-2" type="checkbox">
    <label for="5-2">URLを出力するときは, "http://"や"https://"で始まるURLのみを許可する</label>
  </li>
  <li>
    <input id="5-3" type="checkbox">
    <label for="5-3">"&ltscript&gt...&lt/script&gt"要素の内容を動的に生成しない.</label>
  </li>
  <li>
    <input id="5-4" type="checkbox">
    <label for="5-4">スタイルシートを任意のサイトから取り込めるようにしない</label>
  </li>
  <li>
    <input id="5-6" type="checkbox">
    <label for="5-6">入力されたHTMLテキストから構文解析木を作成し, スクリプトを含まない必要な要素のみを抽出する</label>
  </li>
  <li>
    <input id="5-8" type="checkbox">
    <label for="5-8">HTTPレスポンスヘッダのContent-Typeフィールドに文字コードの指定を行う</label>
  </li>
  <li>
    <input id="6-1-a" type="checkbox">
    <label for="6-1-a">処理を実行するページをPOSTメソッドでアクセスできるようにし, その"hidden param"に秘密情報が挿入されるよう, 前のページを自動生成して, 実行ページではその値が正しい場合のみ処理を実行する</label>
  </li>
  <li>
    <input id="6-1-b" type="checkbox">
    <label for="6-1-b">処理を実行する直前のページで再度パスワードの入力を求め, 実行ページでは, 再度入力されたパスワードが正しい場合のみ処理を実行する</label>
  </li>
  <li>
    <input id="6-1-c" type="checkbox">
    <label for="6-1-c">Refererが正しいリンク元かを確認し, 正しい場合のみ処理を実行する.</label>
  </li>
  <li>
    <input id="7-1-a" type="checkbox">
    <label for="7-1-a">ヘッダの出力を直接行わず, ウェブアプリケーションの実行環境や言語に用意されているヘッダ出力用APIを使用する</label>
  </li>
  <li>
    <input id="7-1-b" type="checkbox">
    <label for="7-1-b">改行コードを適切に処理するヘッダ出力用APIを利用できない場合は, 改行を許可しないよう, 開発者自身で適切な処理を実装する</label>
  </li>
  <li>
    <input id="8-1-a" type="checkbox">
    <label for="8-1-a">メールヘッダを固定値にして, 外部からの入力は全てメール本文に出力する</label>
  </li>
  <li>
    <input id="8-1-b" type="checkbox">
    <label for="8-1-b">ウェブアプリケーションの実行環境や言語に用意されているメール送信用APIを使用する</label>
  </li>
  <li>
    <input id="8-2" type="checkbox">
    <label for="8-2">HTMLで宛先を指定しない</label>
  </li>
  <li>
    <input id="9-1-a" type="checkbox">
    <label for="9-1-a">HTTPレスポンスヘッダに, X-Frame-Optionsヘッダフィールドを出力し, 他ドメインサイトからのframe要素やiframe要素による読み込みを制限する.</label>
  </li>
  <li>
    <input id="9-1-b" type="checkbox">
    <label for="9-1-b">処理を実行する直前のページで再度パスワードの入力を求め, 実行ページでは, 再度入力されたパスワードが正しい場合のみ処理を実行する.</label>
  </li>
  <li>
    <input id="10-1-a" type="checkbox">
    <label for="10-1-a">直接メモリにアクセスできない言語で記述する</label>
  </li>
  <li>
    <input id="10-1-b" type="checkbox">
    <label for="10-1-b">直接メモリにアクセスできる言語で記述する部分を最小限にする</label>
  </li>
  <li>
    <input id="10-2" type="checkbox">
    <label for="10-2">脆弱性が修正されたバージョンのライブラリを使用する</label>
  </li>
  <li>
    <input id="11-1" type="checkbox">
    <label for="11-1">アクセス制限機能による防御措置が必要とされるウェブサイトには，パスワード等の秘密情報の入力を必要とする認証機能を設ける</label>
  </li>
  <li>
    <input id="11-2" type="checkbox">
    <label for="11-2">認証機能に加えて認可制御の処理を実装し, ログイン中の利用者が他人になりすましてアクセスできないようにする</label>
  </li>
</ui>

## 11種類の脆弱性
以下の11種類の脆弱性について, 
- 発生する驚異
- 注意が必要なサイト
- 根本的解決及び保険的対策

について解説している自身のブログをまとめる.
### SQLインジェクション
- [SQLインジェクション](../sql_injection)
### OSコマンドインジェクション
### パスパラメータの未チェック / ディレクトリトラバーサル
- [パスパラメータの未チェック/ディレクトリトラバーサル](../path_parameter)
### セッションハイジャック
- [セッションハイジャック](../session_hijack)
### XSS
- [XSSとCSRF](../xss_csrf)
### CSRF
- [XSSとCSRF](../xss_csrf)

### HTTPヘッダ・インジェクション
### メールヘッダ・インジェクション
### クリックジャッキング
### バッファオーバーフロー
### アクセス制御や認可制御の欠落
