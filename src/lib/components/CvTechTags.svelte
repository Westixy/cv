<script lang="ts">
  import type { TechCategory } from "../types/cv";

  export let categories: TechCategory[] = [];
</script>

<div class="cv-tech-tags">
  {#each categories as cat}
    <div class="cv-tech-cat">
      <h4 class="cv-tech-cat-name">{cat.name}</h4>
      <ul class="cv-tech-list">
        {#each cat.items as item}
          <li class="cv-tech-item">{item}</li>
        {/each}
      </ul>
    </div>
  {/each}
</div>

<style>
  .cv-tech-tags {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .cv-tech-cat-name {
    margin: 0 0 0.25rem 0;
    font-size: 0.85rem;
    color: var(--mc);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .cv-tech-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .cv-tech-item {
    padding: 0.15rem 0;
    margin-left: 5px;
    border-left: 2px solid var(--mc);
    padding-left: 8px;
    margin-bottom: 2px;
    font-size: 0.85rem;
  }
</style>