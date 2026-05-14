// Custom-page store. User-uploaded coloring pages persisted in localStorage
// as data URLs. Mirrors the iOS CustomPageStore (disk-based) but adapted
// for the browser sandbox.
//
// Custom pages are free-coloring-only for now — no CBN regions because
// auto-detecting regions from arbitrary line art needs a region-detection
// pass that's not yet implemented. The whole-page region is enough for
// free coloring: brushes paint, paper grain shows through, save-as-PNG
// works.

import type { ColoringPage } from "./page.js";

const KEY_PREFIX = "ce-custom-";
const META_KEY = "ce-custom-meta";

export interface CustomPageMeta {
  id: string;
  title: string;
  addedAt: number;
}

function fullPageRegion(size: number) {
  const path = new Path2D();
  path.rect(0, 0, size, size);
  return {
    id: 0,
    path,
    defaultColor: "#FFFFFF",
    number: 1,
  };
}

export function saveCustomPage(title: string, imageDataURL: string): ColoringPage | null {
  try {
    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(`${KEY_PREFIX}${id}`, imageDataURL);

    const all = readMeta();
    const meta: CustomPageMeta = { id, title, addedAt: Date.now() };
    all.unshift(meta);
    localStorage.setItem(META_KEY, JSON.stringify(all));

    return buildPage(id, title, imageDataURL);
  } catch (e) {
    console.warn("custom page save failed", e);
    return null;
  }
}

export function listCustomPages(): ColoringPage[] {
  return readMeta().flatMap((m) => {
    const url = localStorage.getItem(`${KEY_PREFIX}${m.id}`);
    if (!url) return [];
    return [buildPage(m.id, m.title, url)];
  });
}

export function deleteCustomPage(id: string): void {
  try {
    localStorage.removeItem(`${KEY_PREFIX}${id}`);
    const all = readMeta().filter((m) => m.id !== id);
    localStorage.setItem(META_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

function readMeta(): CustomPageMeta[] {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((m): m is CustomPageMeta =>
      typeof m === "object" && m !== null &&
      typeof m.id === "string" && typeof m.title === "string");
  } catch {
    return [];
  }
}

function buildPage(id: string, title: string, imageDataURL: string): ColoringPage {
  const size = 2048;
  return {
    id,
    title,
    size,
    regions: [fullPageRegion(size)],
    lineart: [],
    palette: ["#FFFFFF"],
    lineartImageURL: imageDataURL,
    isCustom: true,
  };
}
