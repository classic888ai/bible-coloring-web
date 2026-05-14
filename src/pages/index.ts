// Registry of authored Bible coloring pages.
// As we add more, they import here and get listed in HOME categories.

import type { ColoringPage } from "../engine/page.js";
import { NOAHS_ARK } from "./noahs-ark.js";

export interface PageEntry {
  page: ColoringPage;
  category: string;
}

export const PAGES: PageEntry[] = [
  { page: NOAHS_ARK, category: "Old Testament Heroes" },
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
