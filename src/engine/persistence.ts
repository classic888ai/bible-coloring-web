// Local persistence for in-progress coloring pages.
// Stores paint-layer PNGs in localStorage keyed by page ID. Small enough
// for 10+ pages without hitting browser limits (each page is ~50-300 KB
// gzipped depending on coverage).

const KEY_PREFIX = "ce-paint-";
const META_KEY = "ce-paint-meta";

export interface PaintMeta {
  pageId: string;
  savedAt: number;       // epoch ms
  filledRegions: number; // for CBN progress ring
  totalRegions: number;
  mode: "free" | "cbn";
}

export function savePaint(pageId: string, pngDataURL: string, meta: Omit<PaintMeta, "pageId" | "savedAt">): void {
  try {
    localStorage.setItem(`${KEY_PREFIX}${pageId}`, pngDataURL);
    const all = readMetaList();
    const filtered = all.filter((m) => m.pageId !== pageId);
    filtered.unshift({
      pageId,
      savedAt: Date.now(),
      ...meta,
    });
    localStorage.setItem(META_KEY, JSON.stringify(filtered));
  } catch (e) {
    // QuotaExceededError or similar — silently drop (saving is best-effort).
    console.warn("Paint save failed", e);
  }
}

export function loadPaint(pageId: string): string | null {
  try {
    return localStorage.getItem(`${KEY_PREFIX}${pageId}`);
  } catch {
    return null;
  }
}

export function deletePaint(pageId: string): void {
  try {
    localStorage.removeItem(`${KEY_PREFIX}${pageId}`);
    const all = readMetaList().filter((m) => m.pageId !== pageId);
    localStorage.setItem(META_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

export function readMetaList(): PaintMeta[] {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((m): m is PaintMeta =>
      typeof m === "object" && m !== null &&
      typeof (m as PaintMeta).pageId === "string");
  } catch {
    return [];
  }
}

export function metaFor(pageId: string): PaintMeta | undefined {
  return readMetaList().find((m) => m.pageId === pageId);
}
