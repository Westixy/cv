<script lang="ts">
  import type { Project } from "../types/cv";

  export let projects: Project[] = [];
</script>

<div class="cv-projects">
  {#each projects as proj}
    <article class="cv-project">
      <div class="cv-project-header">
        <span class="cv-project-title">{proj.title}</span>
        <span class="cv-project-desc">&mdash; {proj.desc}</span>
      </div>
      <div class="cv-project-context">{proj.context}</div>
      <p class="cv-project-detail">{proj.detail}</p>
      <a href={proj.link} target="_blank" rel="noopener noreferrer" class="cv-project-link">
        {proj.link}
      </a>
    </article>
  {/each}
</div>

<style>
  .cv-projects {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .cv-project {
    padding-left: 5px;
    border-left: 2px solid var(--mc);
    margin-left: 5px;
  }
  .cv-project-header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }
  .cv-project-title {
    font-weight: 600;
    color: var(--mc);
    font-size: 0.95rem;
  }
  .cv-project-desc {
    font-size: 0.85rem;
    opacity: 0.8;
  }
  .cv-project-context {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mc);
    opacity: 0.7;
    margin-top: 0.15rem;
  }
  .cv-project-detail {
    margin: 0.25rem 0;
    font-size: 0.85rem;
    line-height: 1.4;
  }
  .cv-project-link {
    font-size: 0.75rem;
    color: var(--mc);
    text-decoration: none;
    word-break: break-all;
  }
  .cv-project-link:hover {
    text-decoration: underline;
  }
</style>