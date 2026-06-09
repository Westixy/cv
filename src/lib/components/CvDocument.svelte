<script lang="ts">
  import { t, locale } from "../i18n";
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

<main class="cv-document">
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
</main>

<style>
  .cv-document {
    max-width: 1024px;
    margin: 0 auto;
    padding: 1.5rem;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    line-height: 1.5;
  }
  .cv-columns {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 1.5rem;
  }
  @media (max-width: 768px) {
    .cv-columns {
      grid-template-columns: 1fr;
    }
    .cv-right {
      border-top: 1px solid var(--mc);
      padding-top: 0.75rem;
    }
  }
  @media print {
    .cv-document {
      max-width: none;
      padding: 0;
    }
  }
</style>