<script lang="ts">
  import { revealOnScroll } from "../actions/reveal";
  export let period: string;
  export let title: string;
  export let subtitle: string;
  export let date: string;
  export let bullets: string[] = [];
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
    {#if bullets.length > 0}
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
  .cv-timeline-bullets {
    padding-left: 1.1rem;
    margin: 0.25rem 0 0 0;
    font-size: var(--text-sm);
    line-height: 1.55;
    list-style: disc outside;
  }
  .cv-timeline-bullets li {
    margin-bottom: 0.1rem;
    color: var(--text);
  }
  .cv-timeline-bullets li::marker {
    color: var(--mc);
    opacity: 0.5;
    font-size: 0.75em;
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
    .cv-timeline-bullets {
      font-size: 8.5pt;
      line-height: 1.4;
      margin-top: 1mm;
    }
  }
</style>