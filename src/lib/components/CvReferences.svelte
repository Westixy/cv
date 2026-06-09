<script lang="ts">
  import type { Reference } from "../types/cv";

  export let references: Reference[] = [];
</script>

<div class="cv-references">
  {#each references as ref}
    <div class="cv-ref-item">
      <div class="cv-ref-name">{ref.name}</div>
      <div class="cv-ref-role">
        <span class="cv-ref-title">{ref.title}</span>
        <span class="cv-ref-context">&bull; {ref.context}</span>
      </div>
      <div class="cv-ref-contact">
        <span>{ref.phone}</span>
        <span>&bull;</span>
        <a href="mailto:{ref.email}">{ref.email}</a>
      </div>
    </div>
  {/each}
</div>

<style>
  .cv-references {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .cv-ref-item {
    padding: 0.4rem 0.6rem;
    border-left: 3px solid var(--mc);
    background: var(--mc-subtle);
    border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    break-inside: avoid;
  }
  .cv-ref-name {
    font-weight: 700;
    color: var(--mc);
    font-size: var(--text-sm);
  }
  .cv-ref-role {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin-top: 0.05rem;
    flex-wrap: wrap;
  }
  .cv-ref-title {
    font-weight: 500;
  }
  .cv-ref-context {
    font-style: italic;
    opacity: 0.8;
  }
  .cv-ref-contact {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: var(--text-xs);
    color: var(--text);
    margin-top: 0.15rem;
    flex-wrap: wrap;
  }
  .cv-ref-contact a {
    color: var(--mc);
    text-decoration: none;
  }
  .cv-ref-contact a:hover {
    text-decoration: underline;
  }

  @media print {
    .cv-references {
      gap: 2mm;
    }
    .cv-ref-item {
      padding: 1.5mm 2mm;
      border-left-width: 2px;
      background: none;
    }
    .cv-ref-name {
      font-size: 8.5pt;
    }
    .cv-ref-role {
      font-size: 7.5pt;
    }
    .cv-ref-contact {
      font-size: 7.5pt;
    }
  }
</style>