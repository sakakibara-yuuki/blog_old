<script>
  export let work;
  export let index;
  export let depth;
  const size = "size-" + depth;
  const workId = `work-${index}-${depth}`;
</script>

<div class="container {size}">
  <div class="work">
    <span class="title">
      <input type="checkbox" id={workId} />
      <label for={workId}>{work.title}</label>
    </span>
    <p class="description">
      {work.description}
    </p>
    {#if work.workflow && work.workflow.length > 0}
      <details>
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
    font-size: var(--s0);
    & label {
      font-size: var(--s0);
    }
    & .description {
      font-size: var(--s-1);
    }
  }
  .size-1 {
    font-size: var(--s-1);
    & label {
      font-size: var(--s-1);
    }
    & .description {
      font-size: var(--s-2);
    }
  }
  .size-2 {
    font-size: var(--s-2);
    & label {
      font-size: var(--s-2);
    }
    & .description {
      font-size: var(--s-3);
    }
  }
  .size-3 {
    font-size: var(--s-3);
    & label {
      font-size: var(--s-3);
    }
    & .description {
      font-size: var(--s-4);
    }
  }
  .size-4 {
    font-size: var(--s-4);
    & label {
      font-size: var(--s-4);
    }
    & .description {
      font-size: var(--s-5);
    }
  }
  .container {
    position: relative;
  }
  .work {
    padding-left: 1em;
    padding-bottom: 2em;
  }
  .work::before {
    content: "";
    background-color: var(--md-sys-color-primary);
    position: absolute;
    top: calc(1.5em + 0.25em); /* radius + border-width */
    left: 0;
    width: 0.25em;
    height: calc(100% - 1.5em - 0.125em); /* radius + border-width-half */
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
  }
  .work::after {
    content: "A";
    position: absolute;
    border-radius: 50%;
    border: 0.25em solid var(--md-sys-color-primary);
    top: 0;
    left: calc(-0.75em - 0.125em); /* radius-half + border-width-half */
    width: 1.5em;
    height: 1.5em;
    text-align: center;
    line-height: 1.5; /* height mach with box height*/
  }
  .title {
    display: inline-block;
    position: relative;
    left: 1em;
    line-height: 2;
    font-weight: bold;
  }
  .title:has(input[type="checkbox"]:checked)::after {
    content: "";
    background-color: var(--md-sys-color-tertiary);
    position: absolute;
    top: 0.75em;
    left: 0.125em;
    width: 100%;
    height: 0.25em;
  }
  input[type="checkbox"] {
    appearance: none;
    position: absolute;
  }
  label {
    cursor: pointer;
  }
  .description {
    margin-top: 0.5em;
    padding-left: 1em;
  }
  details {
    margin-left: 1.5em;
  }
</style>
