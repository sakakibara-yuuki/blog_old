/*
 * SearchList.jsx
 * Copyright (C) 2024 sakakibara <sakakibara@organon>
 *
 * Distributed under terms of the MIT license.
 */
import { useEffect, useState } from 'preact/hooks';
import Fuse from 'fuse.js';


export default function SearchList({posts}) {

  const fuseOptions = {
    includeScore: true,
    minMatchCharLength: 2,
    keys: ['body', 'data.title'],
    threshold: 0.9,
    ignoreLocation: true,
    useExtendedSearch: true,
  };

  const fuse = new Fuse(posts, fuseOptions);
  const params = new URLSearchParams(window.location.search);
  const searchedPost = fuse.search(params.get('q')).map((result) => result.item);

  return (
    <ul>
      {
        searchedPost.map((post) => (
          <li>
            <a href={`/blog/${post.slug}/`}>
            <img width={720} height={360} src={post.data.heroImage} alt="" />
            <h3 class="title">{post.data.title}</h3>
            </a>
          </li>
        ))
      }
    </ul>
  );
}
