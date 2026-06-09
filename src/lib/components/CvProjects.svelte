<script lang="ts">
  import type { Project } from "../types/cv";

  export let projects: Project[] = [];
</script>

<div class="cv-projects">
  {#each projects as proj}
    <article class="cv-project">
      <div class="cv-project-header">
        <span class="cv-project-title">{proj.title}</span>
        <span class="cv-project-context">{proj.context}</span>
      </div>
      <p class="cv-project-desc">{proj.desc}</p>
      <p class="cv-project-detail">{proj.detail}</p>
      {#if proj.link}
        <a
          href={proj.link}
          target="_blank"
          rel="noopener noreferrer"
          class="cv-project-link"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          {proj.link}
        </a>
      {/if}
    </article>
  {/each}
</div>

<style>
  .cv-projects {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
  .cv-project {
    padding: 0.5rem 0.6rem;
    background: var(--mc-subtle);
    border-radius: var(--radius-sm);
    border: 1px solid var(--mc-muted);
    break-inside: avoid;
  }
  .cv-project-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.15rem;
  }
  .cv-project-title {
    font-weight: 700;
    color: var(--mc);
    font-size: var(--text-sm);
  }
  .cv-project-context {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    font-weight: 500;
  }
  .cv-project-desc {
    margin: 0;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--text);
    line-height: 1.4;
  }
  .cv-project-detail {
    margin: 0.15rem 0 0.2rem;
    font-size: var(--text-xs);
    color: var(--text-muted);
    line-height: 1.45;
  }
  .cv-project-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: var(--text-xs);
    color: var(--mc);
    text-decoration: none;
    font-family: var(--font-mono);
    word-break: break-all;
    transition: opacity 0.15s;
  }
  .cv-project-link:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

  @media print {
    .cv-projects {
      gap: 2mm;
    }
    .cv-project {
      padding: 1.5mm 2mm;
      background: none;
      border: none;
      border-left: 2px solid var(--mc);
      border-radius: 0;
    }
    .cv-project-title {
      font-size: 8.5pt;
    }
    .cv-project-context {
      font-size: 6.5pt;
    }
    .cv-project-desc {
      font-size: 8pt;
    }
    .cv-project-detail {
      font-size: 7.5pt;
    }
    .cv-project-link {
      font-size: 7pt;
    }
  }
</style>