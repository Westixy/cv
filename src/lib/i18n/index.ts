import { writable, derived } from "svelte/store";
import en from "./en";
import fr from "./fr";

export type Translations = typeof en;
export type Locale = "en" | "fr";

const translations: Record<Locale, Translations> = { en, fr };

function detectLocale(): Locale {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cv-locale") as Locale | null;
    if (stored && (stored === "en" || stored === "fr")) return stored;
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === "fr") return "fr";
  }
  return "en";
}

export const locale = writable<Locale>(detectLocale());

locale.subscribe((value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cv-locale", value);
    document.documentElement.lang = value;
  }
});

export const t = derived(locale, ($locale) => {
  return translations[$locale];
});