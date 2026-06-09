<script lang="ts">
  import type { Reference } from "../types/cv";

  export let references: Reference[] = [];
</script>

<div class="cv-references">
  {#each references as ref}
    <div class="cv-ref-item">
      <div class="cv-ref-context">{ref.context}</div>
      <div class="cv-ref-name">{ref.name}</div>
      <div class="cv-ref-title">{ref.title}</div>
      <div class="cv-ref-contact">
        <span>{ref.phone}</span>
        <a href="mailto:{ref.email}">{ref.email}</a>
      </div>
    </div>
  {/each}
</div>

<style>
  .cv-references {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .cv-ref-item {
    padding-left: 5px;
    border-left: 2px solid var(--mc);
    margin-left: 5px;
    font-size: 0.85rem;
  }
  .cv-ref-context {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mc);
    opacity: 0.7;
    margin-bottom: 0.1rem;
  }
  .cv-ref-name {
    font-weight: 600;
    color: var(--mc);
    font-size: 0.95rem;
  }
  .cv-ref-title {
    font-size: 0.8rem;
    opacity: 0.8;
  }
  .cv-ref-contact {
    display: flex;
    flex-direction: column;
    margin-top: 0.15rem;
    gap: 0.1rem;
  }
  .cv-ref-contact a {
    color: var(--mc);
    text-decoration: none;
    font-size: 0.8rem;
  }
  .cv-ref-contact a:hover {
    text-decoration: underline;
  }
</style>