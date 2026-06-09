<script lang="ts">
  import type { TechCategory } from "../types/cv";

  export let categories: TechCategory[] = [];
</script>

<div class="cv-tech-tags">
  {#each categories as cat}
    <div class="cv-tech-cat">
      <h4 class="cv-tech-cat-name">{cat.name}</h4>
      <div class="cv-tech-grid">
        {#each cat.items as item}
          <span class="cv-tag">{item}</span>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .cv-tech-tags {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  .cv-tech-cat {
    break-inside: avoid;
  }
  .cv-tech-cat-name {
    font-size: var(--text-xs);
    margin: 0 0 0.3rem 0;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 700;
  }
  .cv-tech-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }
  .cv-tag {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    font-size: var(--text-xs);
    font-weight: 500;
    background: var(--mc-subtle);
    color: var(--mc);
    border-radius: var(--radius-sm);
    border: 1px solid var(--mc-muted);
    transition: background 0.15s;
    white-space: nowrap;
  }

  @media print {
    .cv-tech-tags {
      gap: 2mm;
    }
    .cv-tech-cat-name {
      font-size: 6.5pt;
      margin-bottom: 1mm;
    }
    .cv-tech-grid {
      gap: 1.5mm;
    }
    .cv-tag {
      font-size: 7pt;
      padding: 0.1rem 0.3rem;
    }
  }
</style>