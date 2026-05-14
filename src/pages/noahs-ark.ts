// Noah's Ark — the first Bible coloring page, authored in code.
// Coordinates are in paint-texture space (2048×2048). Designed so:
//   - All regions are large enough for finger tap (3-6 year olds)
//   - Outlines are bold (16px) and warm-charcoal (not pure black)
//   - The CBN palette uses 8 distinct colors → 8 numbered swatches

import type { ColoringPage, Region, LineStroke } from "../engine/page.js";
import { buildPalette } from "../engine/page.js";

const SIZE = 2048;
const INK = "#2A2A2E";

function path(d: string): Path2D {
  return new Path2D(d);
}

const regions: Region[] = [
  // 0 — Sky (top half)
  {
    id: 0,
    path: path("M 0 0 L 2048 0 L 2048 1080 L 0 1080 Z"),
    defaultColor: "#B6DCEF",
    number: 0,
    hint: "Sky is blue",
  },
  // 1 — Rainbow band 1 (red, outermost)
  {
    id: 1,
    path: path("M 200 700 A 824 824 0 0 1 1848 700 L 1738 700 A 714 714 0 0 0 310 700 Z"),
    defaultColor: "#E74C3C",
    number: 0,
    hint: "Rainbow",
  },
  // 2 — Rainbow band 2 (orange)
  {
    id: 2,
    path: path("M 310 700 A 714 714 0 0 1 1738 700 L 1628 700 A 604 604 0 0 0 420 700 Z"),
    defaultColor: "#F39C12",
    number: 0,
  },
  // 3 — Rainbow band 3 (yellow)
  {
    id: 3,
    path: path("M 420 700 A 604 604 0 0 1 1628 700 L 1518 700 A 494 494 0 0 0 530 700 Z"),
    defaultColor: "#F4D03F",
    number: 0,
  },
  // 4 — Rainbow band 4 (green)
  {
    id: 4,
    path: path("M 530 700 A 494 494 0 0 1 1518 700 L 1408 700 A 384 384 0 0 0 640 700 Z"),
    defaultColor: "#7DCE82",
    number: 0,
  },
  // 5 — Rainbow band 5 (blue)
  {
    id: 5,
    path: path("M 640 700 A 384 384 0 0 1 1408 700 L 1298 700 A 274 274 0 0 0 750 700 Z"),
    defaultColor: "#5B9CFF",
    number: 0,
  },
  // 6 — Water (under the boat)
  {
    id: 6,
    path: path("M 0 1080 L 2048 1080 L 2048 2048 L 0 2048 Z"),
    defaultColor: "#3498DB",
    number: 0,
    hint: "Water is blue",
  },
  // 7 — Boat hull
  {
    id: 7,
    path: path("M 420 1240 Q 420 1500 540 1620 L 1508 1620 Q 1628 1500 1628 1240 Z"),
    defaultColor: "#A0522D",
    number: 0,
    hint: "Boat is brown",
  },
  // 8 — Boat house (upper structure)
  {
    id: 8,
    path: path("M 640 880 L 1408 880 L 1408 1240 L 640 1240 Z"),
    defaultColor: "#CD7F32",
    number: 0,
  },
  // 9 — Roof
  {
    id: 9,
    path: path("M 580 880 L 1024 700 L 1468 880 Z"),
    defaultColor: "#8B4513",
    number: 0,
    hint: "Roof is dark brown",
  },
  // 10 — Window 1 (left)
  {
    id: 10,
    path: path("M 740 980 L 880 980 L 880 1100 L 740 1100 Z"),
    defaultColor: "#F4D03F",
    number: 0,
    hint: "Window glows yellow",
  },
  // 11 — Window 2 (right)
  {
    id: 11,
    path: path("M 1168 980 L 1308 980 L 1308 1100 L 1168 1100 Z"),
    defaultColor: "#F4D03F",
    number: 0,
  },
  // 12 — Sun
  {
    id: 12,
    path: path("M 1700 300 m -120 0 a 120 120 0 1 0 240 0 a 120 120 0 1 0 -240 0"),
    defaultColor: "#FFD93D",
    number: 0,
    hint: "Sun is yellow",
  },
];

// Number assignment: derive from designed palette so identically-colored
// regions share a number. The palette will become the CBN swatches in order.
const { palette, numberFor } = buildPalette(regions);
for (const r of regions) {
  r.number = numberFor(r.defaultColor);
}

const lineart: LineStroke[] = [
  // Rainbow outermost arc
  { path: path("M 200 700 A 824 824 0 0 1 1848 700"), width: 16, color: INK, fill: false },
  { path: path("M 310 700 A 714 714 0 0 1 1738 700"), width: 12, color: INK, fill: false },
  { path: path("M 420 700 A 604 604 0 0 1 1628 700"), width: 12, color: INK, fill: false },
  { path: path("M 530 700 A 494 494 0 0 1 1518 700"), width: 12, color: INK, fill: false },
  { path: path("M 640 700 A 384 384 0 0 1 1408 700"), width: 12, color: INK, fill: false },
  { path: path("M 750 700 A 274 274 0 0 1 1298 700"), width: 12, color: INK, fill: false },

  // Horizon line (water/sky border)
  { path: path("M 0 1080 L 2048 1080"), width: 10, color: INK, fill: false },

  // Boat hull outline
  { path: path("M 420 1240 Q 420 1500 540 1620 L 1508 1620 Q 1628 1500 1628 1240 Z"),
    width: 18, color: INK, fill: false },

  // Plank lines on hull
  { path: path("M 460 1380 L 1588 1380"), width: 6, color: INK, fill: false },
  { path: path("M 480 1500 L 1568 1500"), width: 6, color: INK, fill: false },

  // House structure
  { path: path("M 640 880 L 1408 880 L 1408 1240 L 640 1240 Z"), width: 16, color: INK, fill: false },

  // Roof
  { path: path("M 580 880 L 1024 700 L 1468 880 Z"), width: 16, color: INK, fill: false },

  // Windows
  { path: path("M 740 980 L 880 980 L 880 1100 L 740 1100 Z"), width: 10, color: INK, fill: false },
  { path: path("M 1168 980 L 1308 980 L 1308 1100 L 1168 1100 Z"), width: 10, color: INK, fill: false },
  // Window cross
  { path: path("M 810 980 L 810 1100 M 740 1040 L 880 1040"), width: 6, color: INK, fill: false },
  { path: path("M 1238 980 L 1238 1100 M 1168 1040 L 1308 1040"), width: 6, color: INK, fill: false },

  // Sun
  { path: path("M 1700 300 m -120 0 a 120 120 0 1 0 240 0 a 120 120 0 1 0 -240 0"),
    width: 14, color: INK, fill: false },
  // Sun rays — 8 short lines
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
    const a = (i / 8) * Math.PI * 2;
    const r1 = 140;
    const r2 = 190;
    const cx = 1700, cy = 300;
    const x1 = cx + Math.cos(a) * r1;
    const y1 = cy + Math.sin(a) * r1;
    const x2 = cx + Math.cos(a) * r2;
    const y2 = cy + Math.sin(a) * r2;
    return {
      path: path(`M ${x1} ${y1} L ${x2} ${y2}`),
      width: 10, color: INK, fill: false,
    } as LineStroke;
  }),

  // Wave hints in water
  { path: path("M 80 1280 Q 220 1240 360 1280 T 640 1280"), width: 6, color: INK, fill: false },
  { path: path("M 1408 1280 Q 1548 1240 1688 1280 T 1968 1280"), width: 6, color: INK, fill: false },
  { path: path("M 80 1480 Q 220 1440 360 1480 T 640 1480"), width: 6, color: INK, fill: false },
  { path: path("M 1408 1480 Q 1548 1440 1688 1480 T 1968 1480"), width: 6, color: INK, fill: false },
  { path: path("M 80 1700 Q 220 1660 360 1700 T 640 1700"), width: 6, color: INK, fill: false },
  { path: path("M 1408 1700 Q 1548 1660 1688 1700 T 1968 1700"), width: 6, color: INK, fill: false },
];

export const NOAHS_ARK: ColoringPage = {
  id: "noahs-ark",
  title: "Noah's Ark",
  size: SIZE,
  regions,
  lineart,
  palette,
};
