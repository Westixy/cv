<script lang="ts">
  import { t } from "../i18n";
</script>

<figure class="cv-citation">
  <blockquote>
    <p>{$t.citation.text}</p>
  </blockquote>
  <figcaption>&mdash; {$t.citation.author}</figcaption>
</figure>

<style>
  .cv-citation {
    padding: var(--space-lg) var(--space-2xl);
    margin: 0;
    background: var(--mc-subtle);
    border-left: 4px solid var(--mc);
    color: var(--text);
  }
  blockquote {
    margin: 0;
    font-size: var(--text-md);
    font-style: italic;
    line-height: 1.6;
    color: var(--text);
  }
  blockquote p {
    margin: 0;
  }
  figcaption {
    margin-top: var(--space-sm);
    font-size: var(--text-sm);
    font-weight: 500;
    text-align: right;
    color: var(--mc);
    padding-right: 1rem;
  }

  @media print {
    .cv-citation {
      padding: 3mm 0 3mm 5mm;
      background: none;
      border-left: 2px solid var(--mc);
    }
    blockquote {
      font-size: 10pt;
    }
    figcaption {
      font-size: 8.5pt;
    }
  }
</style>