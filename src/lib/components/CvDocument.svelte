<script lang="ts">
  import { t } from "../i18n";
  import { buildCvData } from "../data/cv-data";
  import CvHeader from "./CvHeader.svelte";
  import CvCitation from "./CvCitation.svelte";
  import CvSection from "./CvSection.svelte";
  import CvTimelineItem from "./CvTimelineItem.svelte";
  import CvTechTags from "./CvTechTags.svelte";
  import CvProjects from "./CvProjects.svelte";
  import CvReferences from "./CvReferences.svelte";
  import CvLanguages from "./CvLanguages.svelte";

  $: cv = buildCvData($t);
</script>

<article class="cv-document">
  <CvHeader />

  <CvCitation />

  <div class="cv-columns">
    <div class="cv-left">
      <CvSection title={$t.sections.experiences}>
        {#each cv.experiences as exp}
          <CvTimelineItem
            period={exp.period}
            title={exp.title}
            subtitle={exp.company}
            date={exp.date}
            bullets={exp.bullets}
          />
        {/each}
      </CvSection>

      <CvSection title={$t.sections.trainings}>
        {#each cv.trainings as training}
          <CvTimelineItem
            period={training.period}
            title={training.title}
            subtitle={training.school}
            date=""
            bullets={training.bullets}
          />
        {/each}
      </CvSection>
    </div>

    <aside class="cv-right">
      <CvSection title={$t.sections.technologies}>
        <CvTechTags categories={cv.techCategories} />
      </CvSection>

      <CvSection title={$t.sections.projects}>
        <CvProjects projects={cv.projects} />
      </CvSection>

      <CvSection title={$t.sections.references}>
        <CvReferences references={cv.references} />
      </CvSection>

      <CvSection title={$t.sections.languages}>
        <CvLanguages languages={cv.languages} />
      </CvSection>
    </aside>
  </div>
</article>

<style>
  .cv-document {
    padding: 0;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    line-height: 1.55;
  }
  .cv-columns {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.2rem;
    padding: var(--space-xl) var(--space-2xl) var(--space-2xl);
  }
  .cv-right {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .cv-left {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  @media (max-width: 768px) {
    .cv-columns {
      grid-template-columns: 1fr;
      padding: var(--space-lg);
    }
    .cv-left,
    .cv-right {
      gap: 0;
    }
    .cv-right {
      margin-top: var(--space-lg);
      padding-top: var(--space-lg);
      border-top: 1px solid var(--border);
    }
  }

  @media print {
    .cv-document {
      max-width: none;
      padding: 0;
    }
    .cv-columns {
      display: grid;
      grid-template-columns: 1fr 72mm;
      gap: 7mm;
      padding: 5mm 0 0;
    }
    .cv-right {
      gap: 0;
    }
    .cv-left {
      gap: 0;
    }
  }
</style>