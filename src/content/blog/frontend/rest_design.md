---
title: "REST API の設計"
author: "sakakibara"
description: "Lorem ipsum dolor sit amet"
heroImage: "/blog-placeholder-3.jpg"
pubDate: 2024-08-14
tags: ["REST", "API", "web", "設計"]
---

# Introduction

<!-- - [What Is the Difference Between Swagger and OpenAPI?](https://swagger.io/blog/api-strategy/difference-between-swagger-and-openapi/) -->

## Contents

## URIの設計

どのような名前をつけるかはITの世界では頻繁に生じる重要な問題である.
URIはリソースを指定するものであるが, これについても同じことが言える.
以降では, URIにどのような名前をつけるかについていくつかの基準を示す.

- **短く入力が容易であること** :  
  シンプルで覚えやすい名前で入力ミスを防ぐことができる.

```bash
x GET http://api.example.com/service/api/search
o GET http://api.example.com/search
```

- **人間が理解しやすいこと**(省略形は避ける):  
  誤認識を防ぐために, 人間が理解しやすい名前をつけることが重要である.

```bash
x GET http://api.example.com/sv/u
o GET http://api.example.com/users
```

- **すべて小文字であること**:  
  UNIXは大文字と小文字を区別するが, WindowsやMacOSは区別しないと言われている. また, 誤認識を防ぐためにも小文字で統一することが重要である.

```bash
x GET http://api.example.com/Users
o GET http://api.example.com/users
```

- **単語はハイフン'-'でつなげること**:  
  そもそもハイフンは単語をつなぐために使われていた. 対してアンダースコアはタイプライターで下線を引くために使われていた. また, アンダースコアはURLのリンクをクリックする際に見えないことがある.

```bash
x GET http://api.example.com/popular_users
o GET http://api.example.com/popular-users
```

なお, 単語を連結するようなシンプルさに欠けるURIはそもそもURIの名前を見直すべきである.

```bash
o GET http://api.example.com/users/popular
```

- **単語は複数形を利用すること**:  
  URIではリソースの集合を指定するため, 複数形を利用することが推奨される.

```bash
x GET http://api.example.com/user/12345
o GET http://api.example.com/users/12345
```

- エンコードが必要な文字は使用しないこと:  
  URIから意味を推測することができるように, エンコードが必要な文字は使用しないことが推奨される.

```bash
x GET http://api.example.com/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC
o GET http://api.example.com/users
```

- サーバー側のアーキテクチャに依存しないこと
  悪意のあるユーザーがURIを推測することで, サーバー側のアーキテクチャを知ることができる. ファイルアップロードなどで実行可能なコードが送り込まれる恐れがある.[^1]

```bash
x GET http://api.example.com/cgi-bin/get_user.php?id=12345
o GET http://api.example.com/users/12345
```

- 改造が容易であること:  
  URIは変更されることがあるため, その際に影響範囲が小さいことが重要である. また, システムに依存するようなURIは改変が困難であり, 予測可能ではない.

```bash
x GET http://api.example.com/items/alpha/12345
x GET http://api.example.com/items/beta/67890
o GET http://api.example.com/items/12345
```

- 一貫性があること
  一定のルールに従ってURIを設計することで, 間違いを防ぐことができる.

```bash
x GET http://api.example.com/friends?id=12345
x POST http://api.example.com/friends/12345/message
o GET http://api.example.com/friends/12345
o POST http://api.example.com/friends/12345/messages
```

[^1]: [Rails セキュリティ](https://railsguides.jp/security.html#%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%A2%E3%83%83%E3%83%97%E3%83%AD%E3%83%BC%E3%83%89%E3%81%A7%E5%AE%9F%E8%A1%8C%E5%8F%AF%E8%83%BD%E3%81%AA%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E9%80%81%E3%82%8A%E8%BE%BC%E3%82%80)

## HTTPメッソッドの適用

URIはリソースを指定し, HTTPメソッドはそのリソースに対する操作を指定する.

```bash
GET /v1/users/123
```

例えば, 以上のURIはユーザーの情報を(リソース)をGET(操作)で取得する.

HTTPのメッソドには主要なものが4種類ある.

| メソッド | 概要           |
| -------- | -------------- |
| POST     | リソースの作成 |
| GET      | リソースの取得 |
| PUT      | リソースの更新 |
| DELETE   | リソースの削除 |

それぞれが, CRUD(Create, Read, Update, Delete)に対応している.

同じURIでも, メソッドによって異なる操作を行うことができる.
| 操作 | APIの実装例 |
| --- | --- |
| ユーザー情報一覧を取得 | GET <http://api.example.com/users> |
| ユーザーの新規登録 | POST <http://api.example.com/users> |
| 特定のユーザー情報を取得 | GET <http://api.example.com/users/12345> |
| 特定のユーザー情報を更新 | PUT <http://api.example.com/users/12345> |
| 特定のユーザー情報を削除 | DELETE <http://api.example.com/users/12345> |

## クエリとパスの使い分け

リソースを特定する方法には, クエリとパスの2つがある.

<table>
    <thead>
    <tr>
        <th>種類</th>
        <th>概要</th>
        <th>使い分け</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>クエリ</td>
        <td>
        URLの末尾から<code>?</code> で続くキーバリュー<br/>
        <code>GET http://api.example.com/users?page=3</code>
        </td>
        <td>パラメータが省略可能であるとき</td>
    </tr>
    <tr>
        <td>パス</td>
        <td>
        URLに埋め込まれるパラメータ<br/>
        <code>GET http://api.example.com/users/123</code>
        </td>
        <td>
        一意のリソースを指定したいとき<br/>
        例えば, 検索条件などはパスに含めるべきではない<br/>
        <code>GET http://api.example.com/users?name=tanaka</code>
        </td>
    </tr>
    </tbody>
</table>

## ステータスコードの適用

ステータスコードはHTTPのリクエストに対するレスポンスの状態を示すものである.
処理結果の概要を把握するためにあり,
| ステータスコード | 概要 |
| --- | --- |
| 1xx | 情報 |
| 2xx | 成功 |
| 3xx | リダイレクト |
| 4xx | クライアント側に起因するエラー |
| 5xx | サーバー側に起因するエラー |

の5つに分類される.
このうち, よく使われるステータスコードについて説明する.

### 1xx 情報

- 100 Continue: サーバーがリクエストを受け付けたが, 処理が継続中(拒否されていない)であることを示す.
- 101 Switching Protocols: プロトコルの切り替えが行われたことを示す.

### 2xx 成功

- 200 OK: リクエストが成功したことを示す.
- 201 Created: リクエストが成功し, 新しいリソースが作成されたことを示す. 本文データが含まれておらず, ヘッダーのlocationに新しいリソースのURIが含まれる.
- 202 Accepted: 非同期ジョブを受け付けたことを示す. 実際の処理結果は別途受け取る必要がある.
- 204 No Content: リクエストが成功したが, レスポンスボディが空であることを示す. つまり, クライアントのビューを更新する必要がないことを示す.

### 3xx リダイレクト

REST APIでは基本的にリダイレクトは使われない.

### 4xx クライアント側に起因するエラー

- 400 Bad Request: その他エラー. 一番曖昧
- 401 Unauthorized: 認証されていないことを示す.
- 403 Forbidden: アクセスが許可されていないことを示す. ただ, これが帰ってくるとリソースの存在が知られてしまうので, 存在を隠すためには404を返す.
- 404 Not Found: リソースが存在しないことを示す.
- 409 Conflict: リクエストが競合していることを示す.
- 429 Too Many Requests: リクエストが多すぎることを示す. レートリミットを設定している場合に使用される.

### 5xx サーバー側に起因するエラー

- 500 Internal Server Error: サーバー内部のエラーが発生したことを示す.
- 503 Service Unavailable: サービスが一時的に利用できないことを示す. メンテナンス中や高負荷時に使用される.

### HTTPメソッドとステータスコードの対応

HTTPメソッドとステータスコードの対応は以下の通りである.

<div>
<table>
    <caption>成功</caption>
    <thead>
    <tr>
        <th>status</th>
        <th>GET</th>
        <th>POST</th>
        <th>PUT</th>
        <th>DELETE</th>
    </tr>
    </thead>
    <tbody>
        <tr>
            <th>200 OK</th>
            <td>o</td>
            <td>o</td>
            <td>o</td>
            <td>o</td>
        </tr>
        <tr>
            <th>201 Create</th>
            <td>x</td>
            <td>o</td>
            <td>x</td>
            <td>x</td>
        </tr>
        <tr>
            <th>202 Accepted</th>
            <td>x</td>
            <td>o</td>
            <td>x</td>
            <td>o</td>
        </tr>
        <tr>
            <th>204 No Content</th>
            <td>x</td>
            <td>x</td>
            <td>o</td>
            <td>o</td>
        </tr>
    </tbody>
</table>

<table>
    <caption>失敗</caption>
    <thead>
    <tr>
        <th>status</th>
        <th>GET</th>
        <th>POST</th>
        <th>PUT</th>
        <th>DELETE</th>
    </tr>
    </thead>
    <tr>
        <td>400 Bad Request</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
    </tr>
    <tr>
        <td>401 Unauthorized</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
    </tr>
    <tr>
        <td>403 Forbidden</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
    </tr>
    <tr>
        <td>404 Not Found</td>
        <td>o</td>
        <td>x</td>
        <td>o</td>
        <td>o</td>
    </tr>
    <tr>
        <td>409 Conflict</td>
        <td>x</td>
        <td>o</td>
        <td>o</td>
        <td>x</td>
    </tr>
    <tr>
        <td>429 Too Many Requests</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
    </tr>
    <tr>
        <td>500 Internal Server Error</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
    </tr>
    <tr>
        <td>503 Service Unavailable</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
        <td>o</td>
    </tr>
</table>
</div>

## データフォーマット

レスポンスのデータフォーマットは主に3つある.
どのフォーマットもテキスト形式であるが, その特徴は異なる.

| フォーマット | 特徴                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| XML          | タグが入れ子になっている.　属性がつけられる                                         |
| JSON         | javascriptのオブジェクトとして扱える. **XMLよりデータ量が少ない**                   |
| JSONP        | JSONのデータをコールバック関数でラップしたもの. **クロスドメイン通信に使用される**  |

フォーマットを指定する方法にも3つある.

| フォーマット     | 指定方法                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------- |
| クエリパラメータ | <code>GET http://api.example.com/users?format=json</code>                                 |
| 拡張子           | <code>GET http://api.example.com/users.json</code>                                        |
| Acceptヘッダー   | <code>GET http://api.example.com/users</code> <br/> <code>Accept: application/json</code> |

クエリパラメータが一番使われることが多い.
URLがリソースであることを考えると, REST API的にはAcceptヘッダーを使用することが推奨される.

## データの内部構造

レスポンスの内部構造について, 設計ポイントを以下に示す.

### エンベロープは必要ない

エンベロープは, レスポンスのメタデータを含むものである.
しかし, これはレスポンスのヘッダー情報と役割が被るため, 使用する必要がない.

エンベロープを使っている例 ☓

```json
{
  "header": {
    "status": 200,
    "errorCode": 0
  },
  "response": {
    "name": "tanaka"
  }
}
```

エンベロープを使っていない例 ◯

```json
{
  "name": "tanaka"
}
```

### ネストを浅くする

ネストが深いと, データの取得が面倒になり, データ量が増える.
そのため, ネストを浅くすることが重要である.

ネストが深い例 x

```json
{
  "id": "12345",
  "name": "tanaka",
  "profile": {
    "birthday": "1990-01-01",
    "gender": "male"
  }
}
```

ネストが浅い例 ◯

```json
{
  "id": "12345",
  "name": "tanaka",
  "birthday": "1990-01-01",
  "gender": "male"
}
```

### ページネーションをサポートする

HATEOASに関連することであるが,
ページネーションをサポートすることで, ページネーションのリンクを提供することができる.

```json
{
  "users": [
    {
      "id": "12345",
      "name": "tanaka"
    }
  ],
  "nextPage": 1
}
```

ただし, このようなページの指定の方法では情報が変更された場合に, ページネーションのリンクが変更されるため, ページネーションのリンクを提供することができない.
そこで, ページがあるのかどうか, キーとなる情報を返すことが推奨される.

```json
{
  "users": [
    {
      "id": "12345",
      "name": "tanaka"
    }
  ],
  "hasNextPage": true,
  "nextPageToken": "FqTs7"
}
```

### プロパティの命名規則は統一する

プロパティの命名規則は統一することが重要である.
例えば, キャメルケースやスネークケースなどがあるが, どちらか一方を選択し, 統一することが重要である.

スネークケースは一般的には可読性が3つの中で最も高いとされている.
キャメルケースは, JavaScriptのプロパティ名として一般的である.
プロパティ名が変数名である場合は, キャメルケースを使用することが妥当.
パスカルケースはあまりWebAPIは使われない.

スネークケースかキャメルケースのどちらかを選択し, 統一することが重要である.

### 日付はRFC3339形式で返す

日付はRFC3339形式で返すことが推奨される.
日付のフォーマットとして他にも,

| フォーマット    | 概要                               | 推奨 |
| --------------- | ---------------------------------- | ---- |
| RFC 822         | Thu, 29 Mar 2018 08:00:00 GMT      | x    |
| RFC 850         | Thursday, 29-Mar-2018 08:00:00 GMT | x    |
| Unix time stamp | 1521781500                         | x    |
| RFC3339         | 2018-03-29T08:00:00Z               | ◯    |

などがある.

### 大きな数値は文字列で返す

javascriptの演算可能な最大整数は2^53-1(9,007,199,254,740,991)である.
この16桁を超える数値は, 文字列で返すことが推奨される.

多きな数値を数値で返す例 x

```json
{
  "id": 12345678901234567890
}
```

多きな数値を文字列で返す例 ◯

```json
{
  "id": "12345678901234567890"
}
```

## エラーレスポンス

エラーレスポンスについて, 設計ポイントを以下に示す.

### エラー詳細はレスポンスボディに含める

基本的にステータスコードで判断できるが, 足りない情報はレスポンスボディに含める.
good

```json
{
  "code": 12345,
  "message": "不正な検索条件です"
}
```

### エラーの際にHTMLを返さないようにする

APIを叩いて期待しているのはJSONなどのデータ(リソースの表現)であるため, HTMLを返すことは避ける.

また, レスポンスフォーマットが変わると, クライアント側の処理が適切に行われない可能性がある.

そのため, Content-Typeをapplication/jsonに設定することが重要である.

```json
Content-Type: application/json
{
    "code": 12345,
    "message": "不正な検索条件です",
}
```

### サービス閉塞時は"503" + "Retry-After"を返す

404を返したくなるが, サービス閉塞時は503を返すことが推奨される.
これはクライアントから見た場合に, 404だとサービスがいつ利用できるようになるのかがわからないからである.

```json
Content-Type: application/json
Retry-After: Mon, 6 Jun 2018 00:00:00 GMT
{
    "code": 12345,
    "message": "サービスが一時的に利用できません",
}
```
