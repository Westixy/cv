<script lang="ts">
  import { locale } from "./lib/i18n";
  import CvDocument from "./lib/components/CvDocument.svelte";

  let showTooltip = false;

  function handlePrint() {
    window.print();
  }
</script>

<div class="app-root">
  <nav class="app-toolbar no-print">
    <span class="app-title">CV</span>
    <div class="app-toolbar-actions">
      <button class="app-btn" on:click={handlePrint} title="Print to PDF">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <polyline points="6 9 6 2 18 2 18 9"/>
          <path d="M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2"/>
          <rect x="6" y="14" width="12" height="8"/>
        </svg>
        Print
      </button>
      <!-- Social links -->
      <a
        class="app-btn app-btn-ghost"
        href="https://github.com/Westixy"
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </a>
    </div>
  </nav>

  <CvDocument />
</div>

<style>
  .app-root {
    min-height: 100vh;
  }
  .app-toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1.5rem;
    background: var(--bg);
    border-bottom: 1px solid var(--mc);
    backdrop-filter: blur(8px);
    background: color-mix(in srgb, var(--bg) 85%, transparent);
  }
  .app-title {
    font-weight: 700;
    font-size: 1rem;
    color: var(--mc);
    letter-spacing: 0.05em;
  }
  .app-toolbar-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .app-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.75rem;
    border: 1px solid var(--mc);
    background: var(--mc);
    color: var(--bg);
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .app-btn:hover {
    opacity: 0.85;
  }
  .app-btn-ghost {
    background: transparent;
    color: var(--mc);
    padding: 0.3rem 0.5rem;
  }

  @media print {
    .no-print {
      display: none !important;
    }
  }
</style>