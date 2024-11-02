---
title: 'React つまづきどころ'
author: "sakakibara"
description: 'Lorem ipsum dolor sit amet'
heroImage: '/blog-placeholder-3.jpg'
pubDate: 2024-10-03
tags: ["frontend", "react"]
---

# Introduction
## Contents
## 開けるけど閉じられない.
以下のようなコンポーネントを作成したとき, モーダルを開けることはできるが, 閉じることができない.
```typescript

function MonthlyCalendarCell({
  date = new Date(),
}) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  function modalOpen() {
    console.log("modalOpen");
    setIsModalOpen(true);
  }

  function modalClose(event: React.MouseEvent<HTMLDivElement>) {
    console.log("modalClose");
    setIsModalOpen(false);
  }

  return (
    <div onClick={modalOpen}>
      <p> Click Me!! </p>
      {
        isModalOpen && (
          <ModalCard toggleModal={modalClose}/>
        )
      }
    </div>
  );
}
```
なぜか.
### 解決策
バブリングを考慮していなかった.

- [イベント伝播](https://ja.react.dev/learn/responding-to-events#event-propagation)

これはどちらかというとjavascriptのWeb APIの問題だが, なぜかすっかり忘れていた.

イベントはその発生場所から親の要素へと伝播していく. この例では, `onClick`イベントは`modalClose`を呼び, その実行が終わってもさらに祖先へ伝播していき, `modalOpen`を呼び出してしまう.
- [参考](https://azukiazusa.dev/blog/event-bubbling-follows-the-react-tree-not-the-dom-tree/)


## closestの要素が見つからない.
`closest`を使って,　イベントの発生源の親要素を取得しようとしたが, 取得できない.
```typescript
function clickHandler(event: React.MouseEvent<HTMLDivElement>) {
  const target = event.target; // ここでエラー
  const parent = target.closest(".parent");
  console.log(parent);
}
```
エラーは以下の通り,
```typescript
Property 'closest' does not exist on type 'EventTarget'.
```

### 解決策
`event.target`は`EventTarget`型であり, `closest`メソッドを持っていない. そのため, `HTMLElement`型にキャストする必要がある.

```typescript
function clickHandler(event: React.MouseEvent<HTMLDivElement>) {
  const target = event.target as HTMLElement; // ここでエラー
  const parent = target.closest(".parent");
  console.log(parent);
}
```

## リダイレクト後に違う画面になる.
```typescript
// another-page.tsx
const router = useRouter();
function clickHandler(event: React.MouseEvent<HTMLDivElement>) {
  router.push("/page/new");
}

// page.tsx
function Page() {
  const [ isNew, setIsNew ] = useState("old");

  useEffect(() => {
      setIsNew("new");
      router.push(`/page/${isNew}`);
    }
  }, [isNew]);

  return (
    <div>
      <div onClick={clickHandler}> Click Me!! </div>
      {
        isNew && <NewPage />
      }
    </div>
  );
}
```


### 解決策

まず, 第一に, `useState`のstateはその時点での値が使用される.
次に, `router.push`は非同期処理であるため, `useEffect`内で`router.push`を呼び出すと, `isNew`の値が変更される前に`router.push`が呼び出されてしまう.
さらに, ページ遷移後の`Page`コンポーネントはアンマウントされるため, `useState`でのstateの変更が無効になる. つまり, 初期値が使用される.

そう, Reactのstateは完全にページ遷移したらその情報は消える.
`state`はコンポーネントのライフらサイクルに依存しており,
- ページのリロード
- ページ遷移
- コンポーネントのアンマウント

などがあると, `state`は消える.
対策として, `localStorage`を使うか, `useContext`を使う.
