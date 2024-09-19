<script>
  export let work;
  export let index;
  export let depth;
  const size = "size-" + depth;
  const workId = `work-${index}-${depth}`;
  import Icon from "@iconify/svelte";
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
  let workWeight = {weight: 400, width: "5px"};
  switch (work.weight) {
    case "light":
      workWeight.weight = 200;
      workWeight.width = "3px";
      break;
    case "heavy":
      workWeight.weight = 700;
      workWeight.width = "7px";
      break;
  }
  let priorityColor = "var(--md-sys-color-primary)";
  switch (work.priority) {
    case "A":
      priorityColor = "hsl(0 75 41)";
      break;
    case "B":
      priorityColor = "hsl(45 75 41)";
      break;
    default:
      priorityColor = "hsl(90 75 41)";
      break;
  }
</script>

<div class="container {size}">
  <div
      class="work"
      style="--priority: '{work.priority ? work.priority : 'C'}';
             --priority-color: {priorityColor}">
    <span class="title" style="border-width: {workWeight.width}; font-weight: {workWeight.weight};">
      <input type="checkbox" id={workId} />
      <label for={workId}>{work.title}</label>
    </span>
    <div class="info">
      {#if work.weight == "light"}
        <Icon icon="mdi:feather" />
      {:else if work.weight == "heavy"}
        <Icon icon="mdi:weight-lifter" />
      {/if}
      {#if work.duration}
        <span>{work.duration}</span>
      {/if}
    </div>
    <span class="description">
      {#await promise}
        <em>Loading...</em>
      {:then description}
        {@html description}
      {:catch error}
        <em>{error.message}</em>
      {/await}
    </span>
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
      "info"
      "description";
  }
  .work::before {
    content: "";
    background-color: var(--md-sys-color-primary-container);
    position: absolute;
    top: calc(1.5em + 0.25em + 0.125em); /* radius + border-width */
    left: 0;
    width: 0.25em;
    height: calc(100% - 1.5em - 0.125em); /* radius + border-width-half */
    border-radius: 10px;
  }
  .work::after {
    content: var(--priority);
    position: absolute;
    border-radius: 50%;
    border: 0.25em solid var(--priority-color);
    top: 0.125em;
    left: calc(-0.75em - 0.125em); /* radius-half + border-width-half */
    width: 1.5em;
    height: 1.5em;
    text-align: center;
    line-height: 1.5; /* height mach with box height*/
  }
  .work:has(> .title input[type="checkbox"]:checked) {
    color: var(--md-sys-color-surface-container-high);
    transition: 0.2s;
    &::after {
      background-color: var(--md-sys-color-surface-container-low);
      border-color: var(--md-sys-color-surface-container-low);
    }
    &::before {
      background-color: var(--md-sys-color-surface-container-low);
    }
    & .title {
      border-color: var(--md-sys-color-surface-container-low);
    }
    & a {
      color: var(--md-sys-color-surface-container-low);
    }
    & .description {
      background-color: var(--md-sys-color-surface-container-low);
      color: var(--md-sys-color-surface-container-low);
    }
  }
  .work:has(> .title input[type="checkbox"]) {
    color: var(--md-sys-color-on-surface);
  }
  .title {
    grid-area: title;
    display: inline-block;
    position: relative;
    line-height: 2;
    border-style: solid;
    border-color: var(--md-sys-color-primary);
    /* border: 0.125em solid var(--md-sys-color-primary-container); */
    padding-left: 1em;
    padding-right: 1em;
    max-width: max-content;
  }
  .title:has(input[type="checkbox"]:checked)::after {
    content: "";
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
  .info {
    display: grid;
    grid-template-areas: "icon duration";
    gap: 0.5em;
    justify-content: flex-start;
    align-items: center;
    width: max-content;
    padding-left: 0.25em;
    padding-right: 0.5em;
  }
  .info > :first-child {
    grid-area: icon;
  }
  .info > :nth-child(2) {
    grid-area: duration;
    font-style: italic;
  }
  .description {
    grid-area: description;
    display: block;
    padding: 0 1em;
    margin: 0;
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
    border-radius: 10px;
  }
  details {
    margin-left: 1.5em;
  }
</style>
