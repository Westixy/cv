<script lang="ts">
  import type { Language } from "../types/cv";
  import { t } from "../i18n";

  export let languages: Language[] = [];
</script>

<ul class="cv-languages">
  {#each languages as lang}
    <li class="cv-lang-item">
      <span class="cv-lang-name">{lang.name}</span>
      <span class="cv-lang-level">{lang.level}</span>
    </li>
  {/each}
</ul>

<style>
  .cv-languages {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .cv-lang-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0;
    margin-left: 5px;
    border-left: 2px solid var(--mc);
    padding-left: 8px;
    margin-bottom: 4px;
  }
  .cv-lang-name {
    font-weight: 500;
    font-size: 0.9rem;
  }
  .cv-lang-level {
    font-size: 0.8rem;
    color: var(--mc);
    opacity: 0.85;
  }
</style>