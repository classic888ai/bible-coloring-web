// Page model — mirrors ColoringEngine/Content/ColoringPage.swift.
// A page is composed of REGIONS (closed paths, fillable) and LINEART
// (strokes drawn over everything). In CBN mode, each region carries a
// `defaultColor` and `number`. In free mode, those metadata are ignored.

export interface Region {
  id: number;               // unique within page; also used as flood-fill region ID
  path: Path2D;             // closed path in paint-texture coordinates (2048×2048)
  defaultColor: string;     // hex "#RRGGBB" — the "correct" CBN color
  number: number;           // CBN palette number, 1..N
  hint?: string;            // optional hint shown to kids ("the sun is yellow")
}

export interface LineStroke {
  path: Path2D;
  width: number;            // in paint-texture pixels
  color: string;            // hex
  fill: boolean;            // also fill the path (e.g. for solid dots)
}

export interface ColoringPage {
  id: string;
  title: string;
  size: number;             // square; 2048
  regions: Region[];
  lineart: LineStroke[];
  // Designed palette for CBN mode — unique colors in display order. Each
  // entry's index+1 is the displayed number. Derived from regions, but
  // explicit so authors can reorder.
  palette: string[];
}

// Build a palette from a regions list, deduping colors and preserving
// first-occurrence order. Returns the palette + a map from color hex to
// 1-based palette index (= the "number" shown to the user).
export function buildPalette(regions: Pick<Region, "defaultColor">[]): {
  palette: string[];
  numberFor: (color: string) => number;
} {
  const palette: string[] = [];
  const indexByColor = new Map<string, number>();
  for (const r of regions) {
    const c = r.defaultColor.toUpperCase();
    if (!indexByColor.has(c)) {
      indexByColor.set(c, palette.length + 1);
      palette.push(c);
    }
  }
  return {
    palette,
    numberFor: (color: string) => indexByColor.get(color.toUpperCase()) ?? 0,
  };
}

// Parse hex "#RRGGBB" or "#RGB" → [r,g,b,a] floats in [0,1].
export function hexToRgba(hex: string, alpha = 1): [number, number, number, number] {
  let s = hex.replace("#", "");
  if (s.length === 3) {
    s = s.split("").map((c) => c + c).join("");
  }
  const n = parseInt(s, 16);
  return [
    ((n >> 16) & 0xff) / 255,
    ((n >> 8) & 0xff) / 255,
    (n & 0xff) / 255,
    alpha,
  ];
}
