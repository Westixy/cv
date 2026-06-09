<script lang="ts">
  import CvDocument from "./lib/components/CvDocument.svelte";
  import { locale, type Locale } from "./lib/i18n";
  import { theme } from "./lib/stores/theme";
  import { clearHiddenBullets } from "./lib/stores/visibility";

  const locales: Locale[] = ["en", "fr"];

  // ── Konami easter egg ─────────────────
  const KONAMI = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a",
  ];
  let konamiBuf: string[] = [];
  let easterEgg = false;

  function handleKonami(e: KeyboardEvent) {
    konamiBuf.push(e.key);
    if (konamiBuf.length > KONAMI.length) konamiBuf.shift();
    if (
      konamiBuf.length === KONAMI.length &&
      konamiBuf.every((k, i) => k === KONAMI[i])
    ) {
      easterEgg = true;
      konamiBuf = [];
      setTimeout(() => (easterEgg = false), 4000);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleResetHidden() {
    clearHiddenBullets();
  }

  function switchLocale(l: Locale) {
    $locale = l;
  }

  $: currentTheme = $theme;

  function toggleTheme() {
    theme.toggle();
  }
</script>

<svelte:window on:keydown={handleKonami} />

<div class="app-shell">
  {#if easterEgg}
    <div class="easter-toast" class:visible={easterEgg}>
      <span class="easter-toast-icon">🎮</span>
      <span>Nice moves! Now go crush that interview.</span>
    </div>
  {/if}

  <!-- Shell header -->
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
      <button class="app-nav-btn" on:click={handleResetHidden} title="Show all hidden bullet points">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Show all
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
      <button
        class="app-nav-btn app-theme-btn no-print"
        on:click={toggleTheme}
        aria-label="Toggle theme"
        title={currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {#if currentTheme === 'light'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        {/if}
      </button>
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
    background: var(--shell-bg);
    color: var(--shell-text);
    transition: background 0.3s, color 0.3s;
  }

  /* ── Scroll-reveal ───────────────── */
  @keyframes reveal-up {
    0%   { opacity: 0; transform: translateY(18px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  :global(.reveal-on-scroll) {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }
  :global(.reveal-on-scroll.visible) {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Easter egg toast ─────────── */
  .easter-toast {
    position: fixed;
    bottom: var(--space-lg);
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: var(--subtle);
    border: none;
    border-radius: 999px;
    padding: 0.35rem 0.9rem;
    font-size: var(--text-xs);
    color: var(--text-muted);
    opacity: 0;
    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  }
  .easter-toast.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  .easter-toast-icon {
    font-size: 0.85rem;
    line-height: 1;
  }

  /* ── Header ───────────────────── */
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md) var(--space-xl);
    background: var(--shell-header-bg);
    border-bottom: 1px solid var(--shell-border);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 3px var(--shell-shadow);
    transition: background 0.3s, border-color 0.3s;
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
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .app-nav-btn:hover {
    background: var(--mc-subtle);
  }
  .app-nav-btn.active {
    background: var(--mc);
    color: #fff;
    border-color: var(--mc);
  }
  .app-theme-btn {
    padding: 0.35rem 0.55rem;
    line-height: 1;
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
    box-shadow: var(--shadow-page);
    border-radius: 2px;
    overflow: hidden;
    transition: background 0.3s, box-shadow 0.3s;
    animation: page-enter 0.5s ease-out;
  }
  @keyframes page-enter {
    0%   { opacity: 0; transform: translateY(12px); }
    100% { opacity: 1; transform: translateY(0); }
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
    border-top: 1px solid var(--shell-border);
    transition: border-color 0.3s;
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
