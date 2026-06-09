import { writable } from "svelte/store";

// Keys are "itemId:bulletIndex"
export const hiddenBullets = writable<Set<string>>(new Set());

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
}

export function clearHiddenBullets() {
  hiddenBullets.set(new Set());
}
