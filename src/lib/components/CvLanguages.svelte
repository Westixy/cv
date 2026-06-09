<script lang="ts">
  import type { Language } from "../types/cv";

  export let languages: Language[] = [];
</script>

<div class="cv-languages">
  {#each languages as lang}
    <div class="cv-lang-item">
      <span class="cv-lang-name">{lang.name}</span>
      <div class="cv-lang-bar">
        <span
          class="cv-lang-fill"
          style="width: {lang.level === 'Native'
            ? '100%'
            : lang.level === 'Fluent'
              ? '82%'
              : lang.level === 'B2'
                ? '65%'
                : lang.level === 'B1'
                  ? '48%'
                  : '30%'}"
        ></span>
      </div>
      <span class="cv-lang-level">{lang.level}</span>
    </div>
  {/each}
</div>

<style>
  .cv-languages {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .cv-lang-item {
    display: grid;
    grid-template-columns: 4rem 1fr 3.5rem;
    align-items: center;
    gap: 0.5rem;
  }
  .cv-lang-name {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text);
  }
  .cv-lang-bar {
    height: 5px;
    background: var(--mc-muted);
    border-radius: 999px;
    overflow: hidden;
  }
  .cv-lang-fill {
    display: block;
    height: 100%;
    background: var(--mc);
    border-radius: 999px;
  }
  .cv-lang-level {
    font-size: var(--text-xs);
    color: var(--text-muted);
    text-align: right;
    font-weight: 500;
  }

  @media print {
    .cv-languages {
      gap: 1.5mm;
    }
    .cv-lang-item {
      grid-template-columns: 12mm 1fr 10mm;
      gap: 2mm;
    }
    .cv-lang-name {
      font-size: 8pt;
    }
    .cv-lang-bar {
      height: 3px;
    }
    .cv-lang-level {
      font-size: 7pt;
    }
  }
</style>