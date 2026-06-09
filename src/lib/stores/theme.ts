import { writable, get } from "svelte/store";

export type Theme = "light" | "dark";

function createThemeStore() {
  const stored =
    typeof localStorage !== "undefined"
      ? (localStorage.getItem("cv-theme") as Theme | null)
      : null;
  const initial: Theme = stored === "dark" ? "dark" : "light";

  const { subscribe, set, update } = writable<Theme>(initial);

  // Apply on init
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", initial);
  }

  return {
    subscribe,
    toggle: () => {
      update((current) => {
        const next: Theme = current === "light" ? "dark" : "light";
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", next);
        }
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("cv-theme", next);
        }
        return next;
      });
    },
  };
}

export const theme = createThemeStore();