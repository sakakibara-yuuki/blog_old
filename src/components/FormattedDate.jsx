/*
 * FormattedDate.jsx
 * Copyright (C) 2024 sakakibara <sakakibara@organon>
 *
 * Distributed under terms of the MIT license.
 */

export default function FormattedDate({date}) {
  return (
    <time dateTime={date.toISOString()}>
      {
        date.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
      }
    </time>
  )
}
