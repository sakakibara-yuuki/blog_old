/*
 * SearchList.jsx
 * Copyright (C) 2024 sakakibara <sakakibara@organon>
 *
 * Distributed under terms of the MIT license.
 */
import FormattedDate from './FormattedDate';
import Fuse from 'fuse.js';
import styled from 'styled-components';

const Container = styled.div`
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  ul li {
    width: calc(50% - 1rem);
  }
  ul li * {
    text-decoration: none;
    transition: 0.2s ease;
  }
  ul li:first-child {
    width: 100%;
    margin-bottom: 1rem;
    text-align: center;
  }
  ul li:first-child img {
    width: 100%;
  }
  ul li:first-child .title {
    font-size: 2.369rem;
  }
  ul li img {
    margin-bottom: 0.5rem;
    border-radius: 12px;
  }
  ul li a {
    display: block;
    text-align: center;
  }
  .title {
    margin: 0;
    color: var(--md-sys-color-on-surface);
    line-height: 1;
  }
  .date {
    margin: 0;
    color: var(--md-sys-color-on-surface-variant);
  }
  div.date {
    display: flex;
    justify-content: center;
    gap: 0.5em;
  }
  ul li a:hover h4,
  ul li a:hover .date {
    color: var(--md-sys-color-primary);
  }
  ul a:hover img {
    box-shadow: var(--box-shadow);
  }
  @media (max-width: 720px) {
    ul {
        gap: 0.5em;
    }
    ul li {
        width: 100%;
        text-align: center;
    }
    ul li:first-child {
        margin-bottom: 0;
    }
    ul li:first-child .title {
        font-size: 1.563em;
    }
  }
`;


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
  const query = params.get('q');
  let searchedPost = posts;
  if (query) {
    searchedPost = fuse.search(query).map((result) => result.item);
  }

  return (
    <Container>
    <ul>
      {
        searchedPost.map((post) => (
          <li>
            <a href={`/blog/${post.slug}/`}>
            <img width={720} height={360} src={post.data.heroImage} alt="" />
            <h4 class="title">{post.data.title}</h4>

            <p class="date">
              <div class="date">
              {
                post.data.updatedDate && (
                  <div>
                    <FormattedDate date={post.data.updatedDate} /> ←
                  </div>
                )
              }
              <FormattedDate date={post.data.pubDate} />
              </div>
            </p>

            </a>
          </li>
        ))
      }
    </ul>
    </Container>
  );
}
