<script lang="ts">
  import { t } from "../i18n";
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<header class="cv-header">
  <div class="cv-header-inner">
    <!-- Photo column -->
    <div class="cv-header-photo">
      <div class="cv-photo-frame">
        <img src="/pp.jpeg" alt="" loading="eager" />
      </div>
    </div>

    <!-- Info column -->
    <div class="cv-header-info">
      <div class="cv-header-top">
        <div class="cv-header-identity">
          <h1 class="cv-name">{$t.name.full}</h1>
          <p class="cv-title">{$t.name.title}</p>
        </div>
        <p class="cv-tagline">&ldquo;{$t.citation.text}&rdquo;</p>
      </div>

      <ul class="cv-contact-list">
        <li class="cv-contact-item" title="Address">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cv-icon">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{$t.personal.address}</span>
        </li>
        <li class="cv-contact-item" title="Phone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cv-icon">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          <a href="tel:{$t.personal.phone}">{$t.personal.phone}</a>
        </li>
        <li class="cv-contact-item" title="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cv-icon">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <a href="mailto:{$t.personal.email}">{$t.personal.email}</a>
        </li>
      </ul>

      <!-- Metadata badges -->
      <div class="cv-meta-row">
        <span class="cv-meta-badge">{$t.personal.nationality}</span>
        <span class="cv-meta-sep">&bull;</span>
        <span class="cv-meta-badge">{$t.personal.age}</span>
        <span class="cv-meta-sep">&bull;</span>
        <span class="cv-meta-badge">{$t.personal.marital}</span>
      </div>

    </div>
  </div>
</header>

<style>
  .cv-header {
    padding: var(--space-2xl) var(--space-2xl) var(--space-xl);
    background: linear-gradient(135deg, var(--mc-subtle) 0%, var(--bg) 100%);
    border-bottom: 3px solid var(--mc);
    margin-bottom: 0;
  }
  .cv-header-inner {
    display: grid;
    grid-template-columns: 96px 1fr;
    gap: var(--space-xl);
    align-items: start;
  }
  .cv-header-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }
  .cv-header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-xl);
  }
  .cv-header-identity {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* Name */
  .cv-name {
    font-size: var(--text-3xl);
    font-weight: 800;
    color: var(--mc);
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
  .cv-title {
    font-size: var(--text-lg);
    font-weight: 500;
    color: var(--text-muted);
    margin-bottom: 0;
  }
  .cv-tagline {
    font-size: var(--text-xs);
    font-style: italic;
    color: var(--text-muted);
    opacity: 0.6;
    max-width: 32ch;
    line-height: 1.5;
    text-align: right;
    border-right: 2px solid var(--mc);
    padding-right: 0.75rem;
    padding-top: 0.35rem;
    flex-shrink: 0;
  }

  /* Contact list */
  .cv-contact-list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm) var(--space-xl);
  }
  .cv-contact-item {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: var(--text-sm);
    color: var(--text);
  }
  .cv-contact-item a {
    color: var(--text);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.15s;
  }
  .cv-contact-item a:hover {
    border-bottom-color: var(--mc);
  }
  .cv-icon {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    color: var(--mc);
    opacity: 0.65;
  }

  /* Meta badges */
  .cv-meta-row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }
  .cv-meta-badge {
    font-size: var(--text-xs);
    padding: 0.15rem 0.6rem;
    background: var(--mc-muted);
    color: var(--mc);
    border-radius: 999px;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  .cv-meta-sep {
    color: var(--text-muted);
    font-size: var(--text-xs);
  }

  /* Photo */
  .cv-photo-frame {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid var(--mc);
    box-shadow: var(--shadow-sm);
  }
  .cv-photo-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media print {
    .cv-header {
      padding: 8mm 0 3mm;
      background: none;
      border-bottom: 2px solid var(--mc);
    }
    .cv-header-inner {
      grid-template-columns: 72px 1fr;
      gap: 5mm;
    }
    .cv-photo-frame {
      width: 72px;
      height: 72px;
      border-width: 2px;
    }
    .cv-name {
      font-size: 20pt;
    }
    .cv-header-top {
      flex-direction: column;
      gap: 1mm;
    }
    .cv-title {
      font-size: 10.5pt;
    }
    .cv-tagline {
      font-size: 7pt;
      text-align: left;
      border-right: none;
      border-left: 1px solid var(--mc);
      padding-right: 0;
      padding-left: 2mm;
      padding-top: 0;
      max-width: none;
    }
    .cv-contact-item {
      font-size: 8.5pt;
    }
    .cv-meta-badge {
      font-size: 7.5pt;
    }
    .cv-icon {
      width: 13px;
      height: 13px;
    }
  }
</style>