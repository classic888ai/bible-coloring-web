// Registry of authored Bible coloring pages.
// As we add more, they import here and get listed in HOME categories.

import type { ColoringPage } from "../engine/page.js";
import { NOAHS_ARK } from "./noahs-ark.js";
import { CREATION } from "./creation.js";
import { JONAH_FISH } from "./jonah-fish.js";
import { PEACE_DOVE } from "./peace-dove.js";
import { DAVID_GOLIATH } from "./david-goliath.js";

export interface PageEntry {
  page: ColoringPage;
  category: string;
}

export const PAGES: PageEntry[] = [
  { page: NOAHS_ARK, category: "Old Testament Heroes" },
  { page: DAVID_GOLIATH, category: "Old Testament Heroes" },
  { page: JONAH_FISH, category: "Old Testament Heroes" },
  { page: PEACE_DOVE, category: "Old Testament Heroes" },
  { page: CREATION, category: "Creation & Animals" },
];

export function pagesByCategory(): Map<string, ColoringPage[]> {
  const m = new Map<string, ColoringPage[]>();
  for (const e of PAGES) {
    const list = m.get(e.category) ?? [];
    list.push(e.page);
    m.set(e.category, list);
  }
  return m;
}

export function findPage(id: string): ColoringPage | undefined {
  return PAGES.find((e) => e.page.id === id)?.page;
}
