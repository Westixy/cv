<script lang="ts">
  import CvDocument from "./lib/components/CvDocument.svelte";
  import { locale, type Locale } from "./lib/i18n";

  const locales: Locale[] = ["en", "fr"];

  function handlePrint() {
    window.print();
  }
  function switchLocale(l: Locale) {
    $locale = l;
  }
</script>

<div class="app-shell">
  <!-- Print-only header band -->
  <header class="app-header no-print">
    <div class="app-header-inner">
      <h1 class="app-logo">Esteban Sotillo</h1>
      <p class="app-subtitle">Curriculum Vitae</p>
    </div>
    <nav class="app-nav">
      <button class="app-nav-btn" on:click={handlePrint}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 12H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Print / PDF
      </button>
      {#each locales as l}
        <button
          class="app-nav-btn"
          class:active={$locale === l}
          on:click={() => switchLocale(l)}
          aria-pressed={$locale === l}
        >
          {l.toUpperCase()}
        </button>
      {/each}
    </nav>
  </header>

  <main class="app-main">
    <div class="app-page">
      <CvDocument />
    </div>
  </main>

  <!-- Floating print button for mobile -->
  <button class="fab-print no-print" on:click={handlePrint} aria-label="Print CV">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 12H4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  </button>

  <footer class="app-footer no-print">
    <p>Made with Svelte • <code>Ctrl+P</code> → Save as PDF</p>
  </footer>
</div>

<style>
  /* ── App Shell ─────────────────── */
  .app-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f1f5f9;
  }

  /* ── Header ───────────────────── */
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md) var(--space-xl);
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .app-header-inner {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
  }
  .app-logo {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--mc);
    margin: 0;
    letter-spacing: -0.02em;
  }
  .app-subtitle {
    font-size: var(--text-xs);
    color: var(--text-muted);
    margin: 0;
    display: none;
  }
  @media (min-width: 600px) {
    .app-subtitle { display: inline; }
  }
  .app-nav {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .app-nav-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    font-size: var(--text-xs);
    font-weight: 600;
    font-family: inherit;
    color: var(--text);
    background: var(--subtle);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s;
  }
  .app-nav-btn:hover {
    background: var(--mc-subtle);
  }
  .app-nav-btn.active {
    background: var(--mc);
    color: #fff;
    border-color: var(--mc);
  }

  /* ── Main content area ─────────── */
  .app-main {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: var(--space-xl) var(--space-md);
  }
  .app-page {
    width: 210mm;
    min-height: 297mm;
    background: var(--bg);
    box-shadow: 0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06);
    border-radius: 2px;
    overflow: hidden;
  }

  /* ── FAB print button ──────────── */
  .fab-print {
    position: fixed;
    bottom: var(--space-lg);
    right: var(--space-lg);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--mc);
    color: #fff;
    border: none;
    box-shadow: 0 4px 14px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 50;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .fab-print:hover {
    transform: scale(1.06);
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  }
  @media (min-width: 768px) {
    .fab-print { display: none; }
  }

  /* ── Footer ────────────────────── */
  .app-footer {
    text-align: center;
    padding: var(--space-md);
    font-size: var(--text-xs);
    color: var(--text-muted);
    border-top: 1px solid var(--border);
  }
  .app-footer code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--subtle);
    padding: 0.1em 0.3em;
    border-radius: 3px;
  }

  /* ── Print ─────────────────────── */
  @media print {
    .app-shell {
      background: #fff;
    }
    .app-page {
      box-shadow: none;
      border-radius: 0;
      overflow: visible;
      width: auto;
      min-height: auto;
    }
    .app-main {
      padding: 0;
    }
  }
</style>