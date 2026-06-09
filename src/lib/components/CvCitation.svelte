<script lang="ts">
  import { t } from "../i18n";
</script>

<blockquote class="cv-citation">
  <p class="cv-citation-text">{$t.citation.text}</p>
  <cite class="cv-citation-author">&mdash; {$t.citation.author}</cite>
</blockquote>

<style>
  .cv-citation {
    text-align: center;
    color: var(--mc);
    font-size: 1.125rem;
    font-style: italic;
    opacity: 0.85;
    margin: 1.5rem 0;
    border: none;
    padding: 0;
  }
  .cv-citation-text {
    margin: 0 0 0.25rem 0;
  }
  .cv-citation-author {
    display: block;
    text-align: right;
    font-size: 0.875rem;
    font-style: normal;
    padding-right: 3rem;
    opacity: 0.8;
  }
</style>