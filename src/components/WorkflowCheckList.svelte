<script>
  export let work;
  export let index;
  export let depth;
  const size = "size-" + depth;
  const workId = `work-${index}-${depth}`;
  import remarkParse from "remark-parse";
  import remarkRehype from "remark-rehype";
  import rehypeSanitize from "rehype-sanitize";
  import rehypeStringify from "rehype-stringify";
  import { unified } from "unified";

  async function transformMarkdownToHtml(markdown) {
    return await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(markdown)
      .then((contents) => {
        return contents.value;
      })
      .catch((error) => {
        return error;
      });
  }

  let promise = transformMarkdownToHtml(work.description);
</script>

<div class="container {size}">
  <div class="work" style="--priority: '{work.priority ? work.priority : 'C'}'">
    <span class="title">
      <input type="checkbox" id={workId} />
      <label for={workId}>{work.title}</label>
    </span>
    <span class="description">
      {#await promise}
        <em>Loading...</em>
      {:then description}
        {@html description}
      {:catch error}
        <em>{error.message}</em>
      {/await}
    </span>
    {#if work.weight}
      <span>{work.weight}</span>
    {/if}
    {#if work.duration}
      <span>{work.duration}</span>
    {/if}
    {#if work.references}
      <span>{work.references}</span>
    {/if}
    {#if work.workflow && work.workflow.length > 0}
      <details open>
        <summary>break</summary>
        {#each work.workflow as _work, _index}
          <svelte:self work={_work} depth={depth + 1} index={_index} />
        {/each}
      </details>
    {/if}
  </div>
</div>

<style>
  .size-0 {
    & label,
    .work::after,
    .work::before{
      font-size: var(--s2);
    }
    & .description {
      font-size: var(--s0);
    }
  }
  .size-1 {
    & label,
    .work::after,
    .work::before {
      font-size: var(--s1);
    }
    & .description {
      font-size: var(--s0);
    }
  }
  .size-2 {
    & label,
    .work::after,
    .work::before {
      font-size: var(--s1);
    }
    & .description {
      font-size: var(--s0);
    }
  }
  .size-3 {
    & label,
    .work::after,
    .work::before {
      font-size: var(--s1);
    }
    & .description {
      font-size: var(--s0);
    }
  }
  .size-4 {
    & label,
    .work::after,
    .work::before {
      font-size: var(--s1);
    }
    & .description {
      font-size: var(--s0);
    }
  }
  .container {
    position: relative;
  }
  .work {
    margin-left: 2em;
    padding-bottom: 2em;
    display: grid;
    grid-template-areas:
      "title"
      "description";
  }
  .work::before {
    content: "";
    background-color: var(--md-sys-color-primary);
    position: absolute;
    top: calc(1.5em + 0.25em + 0.125em); /* radius + border-width */
    left: 0;
    width: 0.25em;
    height: calc(100% - 1.5em - 0.125em); /* radius + border-width-half */
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
  }
  .work::after {
    content: var(--priority);
    position: absolute;
    border-radius: 50%;
    border: 0.25em solid var(--md-sys-color-primary);
    top: 0.125em;
    left: calc(-0.75em - 0.125em); /* radius-half + border-width-half */
    width: 1.5em;
    height: 1.5em;
    text-align: center;
    line-height: 1.5; /* height mach with box height*/
  }
  .work:has(> .title input[type="checkbox"]:checked) {
    color: var(--md-sys-color-surface-container-high);
  }
  .work:has(> .title input[type="checkbox"]) {
    color: var(--md-sys-color-on-surface);
  }
  .title {
    grid-area: title;
    display: inline-block;
    position: relative;
    line-height: 2;
    font-weight: bold;
    border: 0.125em solid var(--md-sys-color-primary-container);
    padding-left: 1em;
    padding-right: 1em;
    max-width: max-content;
  }
  .title:has(input[type="checkbox"]:checked)::after {
    content: "";
    background-color: var(--md-sys-color-surface-container-high);
    position: absolute;
    top: calc(1.5em + 0.125em);
    left: 0.125em;
    width: 100%;
    height: 0.25em;
  }
  input[type="checkbox"] {
    appearance: none;
    position: absolute;
    top: 0;
    left: 0;
  }
  label {
    cursor: pointer;
  }
  .description {
    grid-area: description;
    display: block;
    padding: 0;
    margin: 0;
    padding-left: 1em;
  }
  details {
    margin-left: 1.5em;
  }
</style>
