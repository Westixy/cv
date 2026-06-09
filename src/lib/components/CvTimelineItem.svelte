<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let period: string;
  export let title: string;
  export let subtitle: string;
  export let date: string;
  export let bullets: string[] = [];
  export let collapsible = false;

  let expanded = !collapsible;
  const dispatch = createEventDispatcher();

  function toggle() {
    if (!collapsible) return;
    expanded = !expanded;
    dispatch(expanded ? "expand" : "collapse");
  }
</script>

<article class="cv-timeline-item" class:collapsible class:collapsed={!expanded}>
  <div class="cv-timeline-bar">{period}</div>
  <div class="cv-timeline-body">
    <header
      class="cv-timeline-header"
      on:click={toggle}
      on:keydown={(e) => e.key === "Enter" && toggle()}
      role={collapsible ? "button" : undefined}
      tabindex={collapsible ? 0 : undefined}
    >
      <h3 class="cv-timeline-title">{title}</h3>
      <span class="cv-timeline-subtitle">&mdash; {subtitle}</span>
    </header>
    <time class="cv-timeline-date">{date}</time>
    {#if expanded && bullets.length > 0}
      <ul class="cv-timeline-bullets">
        {#each bullets as bullet}
          <li>{bullet}</li>
        {/each}
      </ul>
    {/if}
  </div>
</article>

<style>
  .cv-timeline-item {
    position: relative;
    padding-left: 3rem;
    margin-bottom: 0.75rem;
  }
  .cv-timeline-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    transform-origin: 100% 50%;
    transform: rotate(180deg);
    writing-mode: vertical-lr;
    text-align: center;
    box-sizing: border-box;
    font-size: 0.7rem;
    border-right: 2px solid var(--mc);
    padding: 0 3px;
    color: var(--mc);
    border-radius: 2px;
    cursor: default;
  }
  .cv-timeline-body {
    flex: 1;
  }
  .cv-timeline-header {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .collapsible .cv-timeline-header {
    cursor: pointer;
    user-select: none;
  }
  .collapsible .cv-timeline-header:hover .cv-timeline-title {
    text-decoration: underline;
    text-decoration-style: dotted;
  }
  .cv-timeline-title {
    display: inline;
    color: var(--mc);
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }
  .cv-timeline-subtitle {
    font-size: 0.85rem;
    opacity: 0.75;
  }
  .cv-timeline-date {
    display: block;
    color: var(--mc);
    font-size: 0.7rem;
    opacity: 0.8;
    margin-top: 0.1rem;
  }
  .cv-timeline-bullets {
    padding-left: 1.2rem;
    margin: 0.3rem 0 0 0;
    font-size: 0.85rem;
    line-height: 1.5;
  }
  .cv-timeline-bullets li {
    margin-bottom: 0.15rem;
  }
  .collapsed .cv-timeline-bar {
    opacity: 0.6;
  }
</style>