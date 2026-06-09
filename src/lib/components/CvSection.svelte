<script lang="ts">
  export let title: string;
</script>

<section class="cv-section">
  <h2 class="cv-section-title">{title}</h2>
  <div class="cv-section-body">
    <slot />
  </div>
</section>

<style>
  .cv-section {
    margin-bottom: 1rem;
  }
  .cv-section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--mc);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0.5rem 0;
    padding-bottom: 0.2rem;
    border-bottom: 1.5px solid var(--mc);
  }
  .cv-section-body {
    padding-left: 0.25rem;
  }
</style>