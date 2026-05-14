// Brush definitions — ported from ColoringEngine/Engine/Brush.swift.
// Each brush is a parametric description; the shader's u_textureMode picks
// the rendering branch. Sizes are in PAINT-TEXTURE pixels (the paint texture
// is 2048×2048, so a radius of 24 ≈ a strong middle-mark crayon).

export type TextureMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
// 0 = waxy (crayon), 1 = flat (marker), 2 = speckled (chalk),
// 3 = bristle (paintbrush), 4 = fibrous (colored pencil),
// 5 = glitter (sparkle), 6 = spray paint, 7 = watercolor, 8 = star stamp

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
  /** Optional brush-specific grain texture filename. When set, overrides
   *  the global paper.jpg for this brush. Used to give crayon a real
   *  wax-on-paper photographic grain — the photoshop-brush clone approach. */
  grainTexture?: string | null;
}

export const BRUSHES: Record<string, Brush> = {
  // Crayon — the headline brush. Now uses a REAL crayon-on-paper photo as
  // the grain texture (sampled in PAGE UV) so every stamp reveals authentic
  // wax-skip patterns rather than procedural noise. This is the photoshop
  // brush clone approach — photographed real-media → tileable PNG.
  crayon: {
    name: "Crayon",
    icon: "🖍️",
    radius: 28,
    spacing: 0.32,
    baseAlpha: 0.55,          // slightly higher base now that grain is real
    hardness: 0.55,
    angleJitter: Math.PI,
    grainStrength: 0.95,
    sizeJitter: 0.15,
    hueStep: 0,
    textureMode: 0,
    shapeTexture: null,
    paperTile: 4.0,           // moderate tile — the photo already has bumpy
                              // wax texture at native scale
    grainTexture: "crayon_grain.png",
  },
  // Pencil — colored pencil. Now uses REAL graphite-on-paper photo
  // (pencil_grain.png from user's pencil-scribble-2.jpg) as the grain
  // texture. Slightly wider + softer edge + lower base alpha than the
  // previous version so it reads as "soft colored pencil tooth" rather
  // than "fine-line pen." Builds up through overlap like real pencil.
  pencil: {
    name: "Pencil",
    icon: "✏️",
    radius: 11,
    spacing: 0.14,
    baseAlpha: 0.42,
    hardness: 0.65,
    angleJitter: 0.25,
    grainStrength: 0.85,
    sizeJitter: 0.08,
    hueStep: 0,
    textureMode: 4,
    shapeTexture: null,
    paperTile: 5.0,        // texture is already at right scale; no over-tiling
    grainTexture: "pencil_grain.png",
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

  // ──────────────────────────────────────────────────────────
  // FUN BRUSHES — kids 3-6 love sparkle, novelty, and stamps.
  // ──────────────────────────────────────────────────────────

  // Glitter — sparkly stamps, hue cycles slowly so a drag has rainbow
  // glints. Wide spacing so individual sparkles are visible.
  glitter: {
    name: "Glitter",
    icon: "✨",
    radius: 18,
    spacing: 0.45,
    baseAlpha: 0.85,
    hardness: 0.50,
    angleJitter: Math.PI,
    grainStrength: 0,
    sizeJitter: 0.35,
    hueStep: 0.04,           // strong hue cycle — each sparkle is a new color
    textureMode: 5,
    shapeTexture: null,
    paperTile: 0,
  },

  // Spray paint — scattered fine dots, soft edged. Wide radius covers area
  // fast; tight stamps so the spray pattern reads as a continuous cloud.
  spray: {
    name: "Spray",
    icon: "🎨",
    radius: 32,
    spacing: 0.18,
    baseAlpha: 0.65,
    hardness: 0.0,
    angleJitter: Math.PI,
    grainStrength: 0,
    sizeJitter: 0.10,
    hueStep: 0,
    textureMode: 6,
    shapeTexture: null,
    paperTile: 0,
  },

  // Watercolor — soft wet pigment that builds with overlap. Low alpha,
  // medium radius, very tight spacing so the wash looks continuous.
  watercolor: {
    name: "Water",
    icon: "💧",
    radius: 38,
    spacing: 0.10,
    baseAlpha: 0.25,
    hardness: 0.0,
    angleJitter: 0,
    grainStrength: 0,
    sizeJitter: 0.20,
    hueStep: 0,
    textureMode: 7,
    shapeTexture: null,
    paperTile: 0,
  },

  // Star stamp — discrete star shapes. Wide spacing so each stamp is its
  // own little star, not overlapping into a blob.
  stars: {
    name: "Stars",
    icon: "⭐",
    radius: 22,
    spacing: 0.85,
    baseAlpha: 0.95,
    hardness: 0.0,            // unused — starCoverage in shader handles silhouette
    angleJitter: 0.4,
    grainStrength: 0,
    sizeJitter: 0.25,
    hueStep: 0.018,           // each star slightly different color
    textureMode: 8,
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
