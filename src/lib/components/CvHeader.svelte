<script lang="ts">
  import { t, locale, type Locale } from "../i18n";

  const locales: Locale[] = ["en", "fr"];

  function switchLocale(l: Locale) {
    $locale = l;
  }
</script>

<header class="cv-header">
  <div class="cv-header-main">
    <div class="cv-header-info">
      <h1 class="cv-name">{$t.name.full}</h1>
      <p class="cv-title">{$t.name.title}</p>

      <div class="cv-personal">
        <span class="cv-personal-item">
          <svg class="cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {$t.personal.nationality} &bull; {$t.personal.age} &bull; {$t.personal.marital}
        </span>
        <span class="cv-personal-item">
          <svg class="cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {$t.personal.address}
        </span>
        <span class="cv-personal-item">
          <svg class="cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          {$t.personal.phone}
        </span>
        <span class="cv-personal-item">
          <svg class="cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          {$t.personal.email}
        </span>
      </div>

      <div class="cv-locale-switcher">
        {#each locales as l}
          <button
            class="cv-locale-btn"
            class:active={$locale === l}
            on:click={() => switchLocale(l)}
          >
            {l.toUpperCase()}
          </button>
        {/each}
      </div>
    </div>

    <div class="cv-header-photo">
      <img src="/pp.jpeg" alt="" class="cv-photo" />
    </div>
  </div>
</header>

<style>
  .cv-header {
    margin-bottom: 1rem;
  }
  .cv-header-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }
  .cv-header-info {
    flex: 1;
  }
  .cv-name {
    font-size: 2rem;
    font-weight: 800;
    color: var(--mc);
    margin: 0;
    line-height: 1.1;
  }
  .cv-title {
    font-size: 1.15rem;
    color: var(--mc);
    opacity: 0.75;
    margin: 0.15rem 0 0.5rem 0;
  }
  .cv-personal {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-bottom: 0.5rem;
  }
  .cv-personal-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    color: var(--text);
    opacity: 0.85;
  }
  .cv-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: var(--mc);
    opacity: 0.7;
  }
  .cv-locale-switcher {
    display: flex;
    gap: 0.25rem;
  }
  .cv-locale-btn {
    background: none;
    border: 1px solid var(--mc);
    color: var(--mc);
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.15s;
    opacity: 0.6;
  }
  .cv-locale-btn:hover,
  .cv-locale-btn.active {
    opacity: 1;
    background: var(--mc);
    color: var(--bg);
  }
  .cv-header-photo {
    flex-shrink: 0;
  }
  .cv-photo {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--mc);
  }
</style>