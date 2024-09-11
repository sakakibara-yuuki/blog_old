---
title: "git考古学"
author: "sakakibara"
description: "上手くいかないことがありましたが、コミュニティに質問して助けてもらいました！"
pubDate: 2024-03-04
heroImage: '/git/git-archeology.webp'
tags: ["git", "history"]
---

## gitは天才が作ったのか？
Linus Torvaldsはlinuxを作る際に既存のバージョン管理システムが気に入らなかった。
そして自分で作ったと言われている。それがgitだ。

gitを使いこなすには一定のハードルがある。  
ステージング？インデックス？bolb？ツリー？  
オブジェクトがどれも抽象的でわかりにくいのだ。

いくらlinusが天才だったとはいえ、このようなものをはじめから作成できたかは疑問だ。
だから、過去を探索してみることにした。

## git-0.01
git-0.01は2005年4月7日にリリースされたおよそ1.2MBのプログラムだ。  
そのREADMEには以下のように書かれている。

```txt

	GIT - the stupid content tracker

"git" can mean anything, depending on your mood.

 - random three-letter combination that is pronounceable, and not
   actually used by any common UNIX command.  The fact that it is a
   mispronounciation of "get" may or may not be relevant.
 - stupid. contemptible and despicable. simple. Take your pick from the
   dictionary of slang.
 - "global information tracker": you're in a good mood, and it actually
   works for you. Angels sing, and a light suddenly fills the room.
 - "goddamn idiotic truckload of sh*t": when it breaks

This is a stupid (but extremely fast) directory content manager.  It
doesn't do a whole lot, but what it _does_ do is track directory
contents efficiently.
```

なぜかやけにテンションが高い。
何回stupidって言ってるんだこの人。  

'git'という単語に意味は無い。  
使用者が雰囲気で決めていいらしい。  
私はgitを`goddamn idiotic truckload of sh*t`と意味づけるとしよう。

そして、最後の文についてLinusのgitに対する哲学(後にUNIX哲学となる)が見て取れる。
> Gitは愚直な(しかし、かなり早い)directory content managerである。
> 多くのことはできないが、directory contentsを効率的に追跡する。

そしてREADMEはこう続く。
```txt
There are two object abstractions: the "object database", and the
"current directory cache".
```

> 2つの抽象的なobjectがある。*object database*と*current directory cahce*だ。

### Object database
``` txt
The object database is literally just a content-addressable collection
of objects.  All objects are named by their content, which is
approximated by the SHA1 hash of the object itself.  Objects may refer
to other objects (by referencing their SHA1 hash), and so you can build
up a hierarchy of objects.
```

> object databaseは文字通り、ただのコンテンツ-アドレス可能なオブジェクトのコレクションである。
> 全てのオブジェクトはそれらの内容(コンテンツ)で名前付けられる。
> つまり、オブジェクトはオブジェクトそれ自体のSHA1ハッシュで近似される。
> オブジェクトは(SHA1を参照することにより)その他のオブジェクトを参照することができ、オブジェクトの階層構造を構築することができる。

驚いた。この頃からgitの基本的な構造は変わっていない。
つまり、ファイルの変更を追跡するためにファイルのSHA1ハッシュを取り、そのハッシュを参照することでファイルの変更を追跡しているのだ。

``` txt
There are several kinds of objects in the content-addressable collection
database.  They are all in deflated with zlib, and start off with a tag
of their type, and size information about the data.  The SHA1 hash is
always the hash of the _compressed_ object, not the original one.

In particular, the consistency of an object can always be tested
independently of the contents or the type of the object: all objects can
be validated by verifying that (a) their hashes match the content of the
file and (b) the object successfully inflates to a stream of bytes that
forms a sequence of <ascii tag without space> + <space> + <ascii decimal
size> + <byte\0> + <binary object data>.
```

コンテンツアドレス可能なコレクションデータベースには、いくつかの種類のオブジェクトがある。
これらはすべてzlibでデフレートされ、そのタイプのタグとデータのサイズ情報で始まります。 
SHA1ハッシュは常に、圧縮されたオブジェクトのハッシュであり、元のオブジェクトのハッシュではありません。

すべてのオブジェクトは、
(a)そのハッシュがファイルの内容と一致し、
(b)そのオブジェクトが<ascii tag without space> + <space> + <ascii decimal size> + <byte0> + <binary object data>のシーケンスを形成するバイトストリームに正常に展開されることを検証することで、
検証することができます。
```
BLOB: A "blob" object is nothing but a binary blob of data, and doesn't
refer to anything else.  There is no signature or any other verification
of the data, so while the object is consistent (it _is_ indexed by its
sha1 hash, so the data itself is certainly correct), it has absolutely
no other attributes.  No name associations, no permissions.  It is
purely a blob of data (ie normally "file contents").

TREE: The next hierarchical object type is the "tree" object.  A tree
object is a list of permission/name/blob data, sorted by name.  In other
words the tree object is uniquely determined by the set contents, and so
two separate but identical trees will always share the exact same
object.

Again, a "tree" object is just a pure data abstraction: it has no
history, no signatures, no verification of validity, except that the
contents are again protected by the hash itself.  So you can trust the
contents of a tree, the same way you can trust the contents of a blob,
but you don't know where those contents _came_ from.

```
> BLOB：「ブロブ」オブジェクトは、データのバイナリ・ブロブに過ぎず、他の何かを参照することはない。
> データには署名もその他の検証もないので、オブジェクトは一貫しているが（sha1ハッシュでインデックス付けされているので、データ自体は間違いなく正しい）、それ以外の属性はまったくない。
> 名前の関連もパーミッションもない。
> 純粋にデータの塊（つまり通常は「ファイルの内容」）である。
> 
> ツリー：次の階層オブジェクト・タイプは、"ツリー "オブジェクトです。
> ツリー・オブジェクトは、パーミッション／名前／ブロブ・データを名前順に並べたリストです。
> 言い換えれば、ツリーオブジェクトはセットの内容によって一意に決定されるため、2つの別々の、しかし同一のツリーは、常にまったく同じオブジェクトを共有することになります。
> 
> 繰り返しますが、"ツリー "オブジェクトは純粋なデータの抽象化に過ぎません。履歴も署名も正当性の検証もありませんが、ハッシュ自体によってコンテンツが再び保護されることを除いては。 
> つまり、ツリーの中身は、ブロブの中身と同じように信頼できるが、その中身がどこから来たのかはわからない。

<!-- ``` -->
<!-- Side note on trees: since a "tree" object is a sorted list of -->
<!-- "filename+content", you can create a diff between two trees without -->
<!-- actually having to unpack two trees.  Just ignore all common parts, and -->
<!-- your diff will look right.  In other words, you can effectively (and -->
<!-- efficiently) tell the difference between any two random trees by O(n) -->
<!-- where "n" is the size of the difference, rather than the size of the -->
<!-- tree. -->
<!---->
<!-- Side note 2 on trees: since the name of a "blob" depends entirely and -->
<!-- exclusively on its contents (ie there are no names or permissions -->
<!-- involved), you can see trivial renames or permission changes by noticing -->
<!-- that the blob stayed the same.  However, renames with data changes need -->
<!-- a smarter "diff" implementation. -->
<!-- ``` -->
<!-- > ツリーについての余談：「ツリー」オブジェクトは「ファイル名＋コンテンツ」のソートされたリストなので、実際に2つのツリーを解凍しなくても、2つのツリーの差分を作成することができる。  -->
<!-- > 共通部分をすべて無視するだけで、diffは正しく表示される。  -->
<!-- > 言い換えれば、任意の2つのランダムなツリーの違いを、O(n)で効果的に（そして効率的に）知ることができる。 -->
<!-- >  -->
<!-- > ツリーに関する余談2："ブロブ "の名前はそのコンテンツに完全に依存する（つまり、名前もパーミッションも関係ない）ので、些細なリネームやパーミッションの変更は、ブロブが同じままであることに気づけばわかる。  -->
<!-- > しかし、データの変更を伴う名前の変更には、よりスマートな「diff」の実装が必要である。 -->

```
CHANGESET: The "changeset" object is an object that introduces the
notion of history into the picture.  In contrast to the other objects,
it doesn't just describe the physical state of a tree, it describes how
we got there, and why.

A "changeset" is defined by the tree-object that it results in, the
parent changesets (zero, one or more) that led up to that point, and a
comment on what happened. Again, a changeset is not trusted per se:
the contents are well-defined and "safe" due to the cryptographically
strong signatures at all levels, but there is no reason to believe that
the tree is "good" or that the merge information makes sense. The
parents do not have to actually have any relationship with the result,
for example.
```
> チェンジセット チェンジセット "オブジェクトは、歴史という概念を取り入れたオブジェクトだ。
> 他のオブジェクトとは対照的に、単にツリーの物理的な状態を記述するだけでなく、どのようにしてそこに到達したのか、そしてなぜそうなったのかを記述します。
> 
> チェンジセット "は、その結果のツリーオブジェクト、その時点に至るまでの親チェンジセット(0個、1個、またはそれ以上)、そして何が起こったかのコメントによって定義されます。
> 繰り返しますが、チェンジセットはそれ自体信頼されるものではありません。
> すべてのレベルで暗号的に強力な署名があるため、内容は明確に定義され「安全」ですが、ツリーが「良い」ものであると信じる理由も、マージ情報が意味を持つものであると信じる理由もありません。
> 例えば、親が結果と実際に何らかの関係を持つ必要はない。

<!-- ``` -->
<!-- Note on changesets: unlike real SCM's, changesets do not contain rename -->
<!-- information or file mode chane information.  All of that is implicit in -->
<!-- the trees involved (the result tree, and the result trees of the -->
<!-- parents), and describing that makes no sense in this idiotic file -->
<!-- manager. -->
<!-- ``` -->
<!-- > チェンジセットに関する注意：本物のSCMと違って、チェンジセットにはリネーム情報やファイルモードチェーン情報は含まれていません。 -->
<!-- > それらはすべて、関係するツリー（結果ツリーと親の結果ツリー）に暗黙的に含まれている。 -->
<!-- > の管理者でなければならない。 -->

```
TRUST: The notion of "trust" is really outside the scope of "git", but
it's worth noting a few things. First off, since everything is hashed
with SHA1, you _can_ trust that an object is intact and has not been
messed with by external sources. So the name of an object uniquely
identifies a known state - just not a state that you may want to trust.

Furthermore, since the SHA1 signature of a changeset refers to the
SHA1 signatures of the tree it is associated with and the signatures
of the parent, a single named changeset specifies uniquely a whole
set of history, with full contents. You can't later fake any step of
the way once you have the name of a changeset.

So to introduce some real trust in the system, the only thing you need
to do is to digitally sign just _one_ special note, which includes the
name of a top-level changeset.  Your digital signature shows others that
you trust that changeset, and the immutability of the history of
changesets tells others that they can trust the whole history.

In other words, you can easily validate a whole archive by just sending
out a single email that tells the people the name (SHA1 hash) of the top
changeset, and digitally sign that email using something like GPG/PGP.

In particular, you can also have a separate archive of "trust points" or
tags, which document your (and other peoples) trust.  You may, of
course, archive these "certificates of trust" using "git" itself, but
it's not something "git" does for you.

Another way of saying the same thing: "git" itself only handles content
integrity, the trust has to come from outside.

of the parent, a single named changeset specifies uniquely a whole
set of history, with full contents. You can't later fake any step of
the way once you have the name of a changeset.

So to introduce some real trust in the system, the only thing you need
to do is to digitally sign just _one_ special note, which includes the
name of a top-level changeset.  Your digital signature shows others that
you trust that changeset, and the immutability of the history of
changesets tells others that they can trust the whole history.

In other words, you can easily validate a whole archive by just sending
out a single email that tells the people the name (SHA1 hash) of the top
changeset, and digitally sign that email using something like GPG/PGP.

In particular, you can also have a separate archive of "trust points" or
tags, which document your (and other peoples) trust.  You may, of
course, archive these "certificates of trust" using "git" itself, but
it's not something "git" does for you.

Another way of saying the same thing: "git" itself only handles content
integrity, the trust has to come from outside.
```
信頼：「信頼」という概念は「git」の範囲外ですが、いくつか注意すべき点があります。
まず第一に、すべてがSHA1でハッシュ化されているので、オブジェクトが無傷であり、外部ソースによっていじられていないことを信頼することができます。
つまり、オブジェクトの名前は、既知の状態を一意に識別する。

さらに、チェンジセットのSHA1署名は、それが関連付けられたツリーのSHA1署名と親の署名を参照するので、一つの名前のチェンジセットは、全内容を含む一連の履歴を一意に特定します。
いったんチェンジセットの名前を知ってしまうと、あとからどのステップもごまかすことはできない。

ですから、システムに本当の信頼を導入するために必要なことは、トップレベルのチェンジセットの名前を含む、たった一つの特別なメモに電子署名をすることです。 
あなたのデジタル署名は、あなたがそのチェンジセットを信頼していることを他の人に示し、チェンジセットの履歴の不変性は、その履歴全体を信頼できることを他の人に伝えます。

### current directory cache
       カレントディレクトリキャッシュ (".dircache/index")

カレントディレクトリキャッシュ」は単純なバイナリファイルであり、任意の時点における仮想ディレクトリの内容を効率的に表現したものを含んでいる。 
これは、名前、日付、パーミッション、コンテンツ（別名「ブロブ」）オブジェクトのセットを関連付ける単純な配列によって行われます。
キャッシュは常に名前順に並べられ、名前はどの時点でも一意である。
しかし、キャッシュには長期的な意味はなく、いつでも部分的に更新することができる。

特に、"カレント・ディレクトリ・キャッシュ "は、確かにカレント・ディレクトリの内容と一貫している必要はないが、2つの非常に重要な属性を持っている：

(a)キャッシュされた状態をすべて再生成できる（ディレクトリ構造だけでなく、"blob "オブジェクトを通してデータも再生成できる）。

  特別なケースとして、カレント・ディレクトリ・キャッシュから "ツリー・オブジェクト"への明確で曖昧さのない一方向のマッピングがあります。
そのため、ディレクトリキャッシュは、いつでも一意に、ただ一つの「ツリー」オブジェクトを指定する(しかし、そのツリーオブジェクトとディレクトリで起こったことを簡単に照合 するための追加データを持っている)。

そして

(b)キャッシュされた状態（「インスタンス化待ちのツリーオブジェクト」）と現在の状態との間の矛盾を見つけるための効率的なメソッドを持っている。

ディレクトリキャッシュが行うことはこの2つだけです。
これはキャッシュであり、通常の操作は、既知のツリーオブジェクトから完全に再生成するか、開発中のライブツリーと更新/比較することです。
ディレクトリキャッシュを完全に吹き飛ばしても、それが記述していたツリーの名前がある限り、情報を失うことはありません。

(特に、まだインスタンス化されていない中間ツリーの表現を持つことができます。
ある意味では、現在のディレクトリキャッシュはツリーコミットへの「作業中」であると考えることができます)。

