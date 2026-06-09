<script lang="ts">
  import { revealOnScroll } from "../actions/reveal";
  import { writable } from "svelte/store";
  import { hiddenBullets, toggleBullet } from "../stores/visibility";

  export let period: string;
  export let title: string;
  export let subtitle: string;
  export let date: string;
  export let bullets: string[] = [];
  export let summary: string = "";
  export let itemId: string = "";

  const collapsed = writable(true);

  function toggle() {
    collapsed.update((v) => !v);
  }

  $: hiddenSet = $hiddenBullets;
</script>

<article class="cv-timeline-item" use:revealOnScroll>
  <div class="cv-timeline-marker">
    <span class="cv-timeline-period">{period}</span>
    <div class="cv-timeline-dot-line">
      <span class="cv-timeline-dot"></span>
      <span class="cv-timeline-line"></span>
    </div>
  </div>
  <div class="cv-timeline-body">
    <div class="cv-timeline-header">
      <h3 class="cv-timeline-title">{title}</h3>
      <span class="cv-timeline-subtitle">&mdash; {subtitle}</span>
    </div>
    {#if date}
      <time class="cv-timeline-date">{date}</time>
    {/if}
    {#if summary}
      <p class="cv-timeline-summary" class:cv-summary-hidden={!$collapsed}>{summary}</p>
    {/if}
    {#if bullets.length > 0}
      <ul class="cv-timeline-bullets" class:cv-bullets-hidden={$collapsed}>
        {#each bullets as bullet, i}
          {@const key = `${itemId}:${i}`}
          {@const isHidden = hiddenSet.has(key)}
          {#if isHidden}
            <li class="cv-bullet-row cv-bullet-hidden-row no-print">
              <button
                class="cv-bullet-hide strikethrough"
                on:click|stopPropagation={() => toggleBullet(itemId, i)}
                type="button"
                aria-label="Show bullet"
                title="This bullet is hidden. Click to show."
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
              <span class="cv-bullet-hidden-text">{bullet}</span>
            </li>
          {:else}
            <li class="cv-bullet-row">
              <button
                class="cv-bullet-hide no-print"
                on:click|stopPropagation={() => toggleBullet(itemId, i)}
                type="button"
                aria-label="Hide bullet before print"
                title="Click to hide this bullet"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <span class="cv-bullet-text">{bullet}</span>
            </li>
          {/if}
        {/each}
      </ul>
    {/if}
    {#if bullets.length > 0}
      <button class="cv-timeline-toggle" on:click={toggle} type="button" aria-label="Toggle details">
        {$collapsed ? "Show more" : "Show less"}
      </button>
    {/if}
  </div>
</article>

<style>
  .cv-timeline-item {
    display: grid;
    grid-template-columns: 5.5rem 1fr;
    gap: 0.25rem;
    position: relative;
    margin-bottom: 0.35rem;
  }
  /* Marker column */
  .cv-timeline-marker {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.15rem;
  }
  .cv-timeline-period {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-muted);
    font-weight: 600;
    text-align: center;
    line-height: 1.25;
    margin-bottom: 0.3rem;
    white-space: nowrap;
  }
  .cv-timeline-dot-line {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    width: 100%;
  }
  .cv-timeline-dot {
    display: block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--mc);
    flex-shrink: 0;
    z-index: 1;
  }
  .cv-timeline-line {
    display: block;
    position: absolute;
    top: 10px;
    bottom: -0.35rem;
    width: 2px;
    background: var(--mc);
    opacity: 0.2;
  }
  .cv-timeline-item:last-child .cv-timeline-line {
    display: none;
  }
  /* Body */
  .cv-timeline-body {
    padding-bottom: 0.3rem;
  }
  .cv-timeline-header {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .cv-timeline-title {
    display: inline;
    font-size: var(--text-md);
    font-weight: 700;
    color: var(--mc);
  }
  .cv-timeline-subtitle {
    font-size: var(--text-sm);
    color: var(--text-muted);
    font-weight: 500;
  }
  .cv-timeline-date {
    display: block;
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: 0.1rem;
    letter-spacing: 0.02em;
  }
  .cv-timeline-summary {
    font-size: var(--text-sm);
    color: var(--text-muted);
    line-height: 1.5;
    margin: 0.2rem 0 0;
    font-style: italic;
  }
  .cv-summary-hidden {
    display: none;
  }
  .cv-timeline-bullets {
    padding-left: 0;
    margin: 0.25rem 0 0 0;
    font-size: var(--text-sm);
    line-height: 1.55;
    list-style: none;
  }
  .cv-bullets-hidden {
    display: none;
  }
  .cv-bullet-row {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    margin-bottom: 0.1rem;
    color: var(--text);
  }
  .cv-bullet-row::before {
    content: "•";
    color: var(--mc);
    opacity: 0.5;
    font-size: 0.75em;
    flex-shrink: 0;
    width: 0.75rem;
    text-align: center;
  }
  .cv-bullet-text {
    flex: 1;
  }
  .cv-bullet-hide {
    all: unset;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    color: var(--text-muted);
    opacity: 0.4;
    transition: opacity 0.15s, background 0.15s, color 0.15s;
  }
  .cv-bullet-hide:hover {
    opacity: 1;
    background: var(--subtle);
    color: var(--mc);
  }
  .cv-bullet-hide.strikethrough {
    opacity: 0.8;
    color: var(--mc);
  }
  .cv-timeline-toggle {
    all: unset;
    cursor: pointer;
    font-size: var(--text-xs);
    color: var(--mc);
    font-weight: 600;
    margin-top: 0.15rem;
    display: inline-block;
    user-select: none;
  }
  .cv-timeline-toggle:hover {
    text-decoration: underline;
  }
  .cv-bullet-hidden-row::before {
    content: "⊘";
    color: var(--text-muted);
    opacity: 0.35;
    font-size: 0.7em;
  }
  .cv-bullet-hidden-text {
    flex: 1;
    color: var(--text-muted);
    opacity: 0.45;
    text-decoration: line-through;
  }

  @media print {
    .cv-timeline-item {
      grid-template-columns: 14mm 1fr;
      gap: 2mm;
      margin-bottom: 1.5mm;
    }
    .cv-timeline-period {
      font-size: 6.5pt;
      margin-bottom: 1.5mm;
    }
    .cv-timeline-dot {
      width: 6px;
      height: 6px;
    }
    .cv-timeline-line {
      top: 7px;
      width: 1.5px;
    }
    .cv-timeline-title {
      font-size: 10pt;
    }
    .cv-timeline-subtitle {
      font-size: 8.5pt;
    }
    .cv-timeline-date {
      font-size: 7pt;
    }
    .cv-timeline-summary {
      font-size: 8pt;
    }
    .cv-timeline-bullets {
      font-size: 8.5pt;
      line-height: 1.4;
      margin-top: 1mm;
    }
    .cv-timeline-toggle {
      display: none;
    }
  }
</style>