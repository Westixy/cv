import { writable } from "svelte/store";

// Keys are "itemId:bulletIndex"
export const hiddenBullets = writable<Set<string>>(new Set());

// Version counter forces reliable reactivity even for Set identity
let version = 0;
export const visibilityVersion = writable(0);

export function tickVersion() {
  version++;
  visibilityVersion.set(version);
}

export function toggleBullet(id: string, index: number) {
  hiddenBullets.update((set) => {
    const key = `${id}:${index}`;
    const next = new Set(set);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    return next;
  });
  tickVersion();
}

export function clearHiddenBullets() {
  hiddenBullets.set(new Set());
  tickVersion();
}
