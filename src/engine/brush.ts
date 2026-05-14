// Brush definitions — ported from ColoringEngine/Engine/Brush.swift.
// Each brush is a parametric description; the shader's u_textureMode picks
// the rendering branch. Sizes are in PAINT-TEXTURE pixels (the paint texture
// is 2048×2048, so a radius of 24 ≈ a strong middle-mark crayon).

export type TextureMode = 0 | 1 | 2 | 3 | 4;
// 0 = waxy (crayon), 1 = flat (marker), 2 = speckled (chalk),
// 3 = bristle (paintbrush), 4 = fibrous (colored pencil)

export interface Brush {
  name: string;
  icon: string;          // emoji shown in the UI tool picker
  radius: number;        // in paint-texture pixels
  spacing: number;       // fraction of radius between stamps
  baseAlpha: number;     // 0..1, source alpha for each stamp
  hardness: number;      // 0 = gaussian, 1 = crisp disc
  angleJitter: number;   // radians of random rotation per stamp
  grainStrength: number; // 0..1
  sizeJitter: number;    // 0..1, ±fraction of radius
  hueStep: number;       // 0 = no rotation; 0.015 = rainbow cycle
  textureMode: TextureMode;
  /** Per-brush stamp shape texture filename in /textures/. null = procedural. */
  shapeTexture: string | null;
  /** How densely to tile the paper-grain texture across the page. Higher
   *  = finer/sharper grain. Crayon = ~6-10, pencil = ~14-20. */
  paperTile: number;
}

export const BRUSHES: Record<string, Brush> = {
  // Crayon — the headline brush. Wider spacing so individual wax-skip
  // moments survive into the visible stroke. Paper grain tiled at ~7
  // (so the paper-bump pattern repeats across a 2048 page about 7 times,
  // putting each bump at ~10px — a believable paper-fiber scale).
  crayon: {
    name: "Crayon",
    icon: "🖍️",
    radius: 28,
    spacing: 0.32,
    baseAlpha: 0.45,
    hardness: 0.50,
    angleJitter: Math.PI,
    grainStrength: 0.95,
    sizeJitter: 0.15,
    hueStep: 0,
    textureMode: 0,
    shapeTexture: null,       // use procedural soft disc for now (Deevad
                              // shapes don't quite read as crayon — keeping
                              // procedural until user's own crayon photos
                              // are extracted)
    paperTile: 7.0,
  },
  // Pencil — narrow, hard, dense paper-tooth modulation. Tile paper grain
  // tighter (~14) so the fiber strokes look finer.
  pencil: {
    name: "Pencil",
    icon: "✏️",
    radius: 10,
    spacing: 0.20,
    baseAlpha: 0.55,
    hardness: 0.85,
    angleJitter: 0.3,
    grainStrength: 0.92,
    sizeJitter: 0.06,
    hueStep: 0,
    textureMode: 4,
    shapeTexture: null,
    paperTile: 14.0,
  },
  // Chalk — sparse dotted shape texture × paper grain. Real shape stamps.
  chalk: {
    name: "Chalk",
    icon: "🎨",
    radius: 38,
    spacing: 0.18,
    baseAlpha: 0.55,
    hardness: 0.40,
    angleJitter: Math.PI,
    grainStrength: 0.80,
    sizeJitter: 0.12,
    hueStep: 0,
    textureMode: 2,
    shapeTexture: "shape_chalk.png",
    paperTile: 9.0,
  },
  // Marker — solid, sharp, no grain. The "confident" brush.
  marker: {
    name: "Marker",
    icon: "🖊️",
    radius: 22,
    spacing: 0.08,
    baseAlpha: 0.97,
    hardness: 0.98,
    angleJitter: 0,
    grainStrength: 0,
    sizeJitter: 0.0,
    hueStep: 0,
    textureMode: 1,
    shapeTexture: null,
    paperTile: 0,
  },
  // Paint — wet bristle, directional streaks, paper grain visible.
  paint: {
    name: "Paint",
    icon: "🖌️",
    radius: 42,
    spacing: 0.12,
    baseAlpha: 0.55,
    hardness: 0.25,
    angleJitter: Math.PI,
    grainStrength: 0.40,
    sizeJitter: 0.12,
    hueStep: 0,
    textureMode: 3,
    shapeTexture: "shape_bristle.png",
    paperTile: 6.0,
  },
  // Rainbow — marker-style with hue cycling.
  rainbow: {
    name: "Rainbow",
    icon: "🌈",
    radius: 26,
    spacing: 0.10,
    baseAlpha: 0.92,
    hardness: 0.95,
    angleJitter: 0,
    grainStrength: 0.10,
    sizeJitter: 0.0,
    hueStep: 0.013,
    textureMode: 1,
    shapeTexture: null,
    paperTile: 0,
  },
};

export type BrushName = keyof typeof BRUSHES;

// HSV → RGB for the rainbow brush's hue cycling.
export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: return [v, t, p];
    case 1: return [q, v, p];
    case 2: return [p, v, t];
    case 3: return [p, q, v];
    case 4: return [t, p, v];
    case 5: return [v, p, q];
    default: return [v, v, v];
  }
}
