// Creation — sun, moon, stars, tree, mountains. Designed to feel like
// "day 4 of creation" — radiant warmth.

import type { ColoringPage, Region, LineStroke } from "../engine/page.js";
import { buildPalette } from "../engine/page.js";

const SIZE = 2048;
const INK = "#2A2A2E";
const path = (d: string) => new Path2D(d);

const regions: Region[] = [
  // 0 — Sky
  { id: 0, path: path("M 0 0 L 2048 0 L 2048 1180 L 0 1180 Z"),
    defaultColor: "#FFE4B0", number: 0 },
  // 1 — Mountains backing
  { id: 1, path: path("M 0 1180 L 380 760 L 760 1180 Z"),
    defaultColor: "#9B7A5F", number: 0 },
  { id: 2, path: path("M 760 1180 L 1100 820 L 1500 1180 Z"),
    defaultColor: "#806649", number: 0 },
  { id: 3, path: path("M 1300 1180 L 1660 880 L 2048 1180 L 2048 1180 Z"),
    defaultColor: "#9B7A5F", number: 0 },
  // 4 — Ground
  { id: 4, path: path("M 0 1180 L 2048 1180 L 2048 2048 L 0 2048 Z"),
    defaultColor: "#7DCE82", number: 0 },
  // 5 — Sun
  { id: 5, path: path("M 1500 460 m -180 0 a 180 180 0 1 0 360 0 a 180 180 0 1 0 -360 0"),
    defaultColor: "#FFD93D", number: 0 },
  // 6 — Star 1
  { id: 6, path: starPath(360, 280, 80, 5),
    defaultColor: "#F08A6E", number: 0 },
  // 7 — Star 2
  { id: 7, path: starPath(820, 200, 60, 5),
    defaultColor: "#F08A6E", number: 0 },
  // 8 — Star 3 — different color so palette has variety
  { id: 8, path: starPath(220, 540, 50, 5),
    defaultColor: "#B6DCEF", number: 0 },
  // 9 — Tree trunk
  { id: 9, path: path("M 980 1500 L 1060 1500 L 1080 1900 L 960 1900 Z"),
    defaultColor: "#8B4513", number: 0 },
  // 10 — Tree foliage
  { id: 10, path: path("M 1020 1280 m -260 0 a 260 260 0 1 0 520 0 a 260 260 0 1 0 -520 0"),
    defaultColor: "#5BCB7C", number: 0 },
];

function starPath(cx: number, cy: number, r: number, points: number): Path2D {
  const p = new Path2D();
  const inner = r * 0.42;
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : inner;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad;
    if (i === 0) p.moveTo(x, y);
    else p.lineTo(x, y);
  }
  p.closePath();
  return p;
}

const { palette, numberFor } = buildPalette(regions);
for (const r of regions) r.number = numberFor(r.defaultColor);

const lineart: LineStroke[] = [
  // Horizon
  { path: path("M 0 1180 L 2048 1180"), width: 10, color: INK, fill: false },
  // Mountains
  { path: path("M 0 1180 L 380 760 L 760 1180"), width: 16, color: INK, fill: false },
  { path: path("M 760 1180 L 1100 820 L 1500 1180"), width: 16, color: INK, fill: false },
  { path: path("M 1300 1180 L 1660 880 L 2048 1180"), width: 16, color: INK, fill: false },
  // Snow caps
  { path: path("M 320 820 L 380 760 L 440 820"), width: 8, color: INK, fill: false },
  { path: path("M 1040 880 L 1100 820 L 1160 880"), width: 8, color: INK, fill: false },
  // Sun
  { path: path("M 1500 460 m -180 0 a 180 180 0 1 0 360 0 a 180 180 0 1 0 -360 0"),
    width: 14, color: INK, fill: false },
  // Sun rays
  ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
    const a = (i / 12) * Math.PI * 2;
    const r1 = 200, r2 = 260;
    const x1 = 1500 + Math.cos(a) * r1;
    const y1 = 460 + Math.sin(a) * r1;
    const x2 = 1500 + Math.cos(a) * r2;
    const y2 = 460 + Math.sin(a) * r2;
    return { path: path(`M ${x1} ${y1} L ${x2} ${y2}`), width: 10, color: INK, fill: false } as LineStroke;
  }),
  // Stars outlines
  { path: starPath(360, 280, 80, 5), width: 8, color: INK, fill: false },
  { path: starPath(820, 200, 60, 5), width: 8, color: INK, fill: false },
  { path: starPath(220, 540, 50, 5), width: 8, color: INK, fill: false },
  // Tree
  { path: path("M 980 1500 L 1060 1500 L 1080 1900 L 960 1900 Z"), width: 14, color: INK, fill: false },
  { path: path("M 1020 1280 m -260 0 a 260 260 0 1 0 520 0 a 260 260 0 1 0 -520 0"),
    width: 14, color: INK, fill: false },
  // Grass tufts
  { path: path("M 220 1500 q 20 -40 40 0 q 20 -40 40 0"), width: 6, color: INK, fill: false },
  { path: path("M 1620 1620 q 20 -40 40 0 q 20 -40 40 0"), width: 6, color: INK, fill: false },
  { path: path("M 540 1740 q 20 -40 40 0 q 20 -40 40 0"), width: 6, color: INK, fill: false },
];

export const CREATION: ColoringPage = {
  id: "creation",
  title: "Day Four",
  size: SIZE,
  regions,
  lineart,
  palette,
};
