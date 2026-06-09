<script lang="ts">
  import { revealOnScroll } from "../actions/reveal";
  export let title: string;
  export let icon: string | undefined = undefined;
</script>

<section class="cv-section" use:revealOnScroll>
  <h2 class="cv-section-title">
    {#if icon}
      <span class="cv-section-icon">{icon}</span>
    {/if}
    <span>{title}</span>
  </h2>
  <div class="cv-section-body">
    <slot />
  </div>
</section>

<style>
  .cv-section {
    margin-bottom: var(--space-lg);
    break-inside: avoid;
  }
  .cv-section-title {
    font-size: var(--text-xs);
    font-weight: 700;
    color: var(--mc);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0 0 var(--space-lg) 0;
    padding-bottom: 0.35rem;
    border-bottom: 1.5px solid var(--mc);
  }
  .cv-section-icon {
    font-size: 0.9em;
    opacity: 0.8;
  }
  .cv-section-body {
    padding-left: 0.15rem;
  }

  @media print {
    .cv-section {
      margin-bottom: 3mm;
    }
    .cv-section-title {
      font-size: 7.5pt;
      padding-bottom: 0.15rem;
      border-bottom-width: 1px;
      margin-bottom: 2mm;
    }
  }
</style>