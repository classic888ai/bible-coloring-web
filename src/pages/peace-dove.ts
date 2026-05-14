// Peace dove — a simple, recognizable dove with olive branch.

import type { ColoringPage, Region, LineStroke } from "../engine/page.js";
import { buildPalette } from "../engine/page.js";

const SIZE = 2048;
const INK = "#2A2A2E";
const path = (d: string) => new Path2D(d);

const regions: Region[] = [
  // Sky background
  { id: 0, path: path("M 0 0 L 2048 0 L 2048 2048 L 0 2048 Z"),
    defaultColor: "#FFE4B0", number: 0 },
  // Dove body (oval)
  { id: 1, path: path("M 1024 1180 m -360 0 a 360 240 0 1 0 720 0 a 360 240 0 1 0 -720 0"),
    defaultColor: "#FFFFFF", number: 0 },
  // Wing
  { id: 2, path: path("M 900 1080 Q 700 720 940 800 Q 1180 880 1100 1100 Z"),
    defaultColor: "#E8E8F0", number: 0 },
  // Head
  { id: 3, path: path("M 1340 980 m -140 0 a 140 140 0 1 0 280 0 a 140 140 0 1 0 -280 0"),
    defaultColor: "#FFFFFF", number: 0 },
  // Beak
  { id: 4, path: path("M 1480 980 L 1620 950 L 1620 1010 Z"),
    defaultColor: "#F39C12", number: 0 },
  // Olive branch leaf 1
  { id: 5, path: path("M 1620 980 Q 1740 880 1820 920 Q 1740 1000 1620 980 Z"),
    defaultColor: "#7DCE82", number: 0 },
  // Olive branch leaf 2
  { id: 6, path: path("M 1680 1000 Q 1780 1080 1860 1040 Q 1780 1120 1680 1040 Z"),
    defaultColor: "#5BCB7C", number: 0 },
  // Olive 1
  { id: 7, path: path("M 1840 960 m -22 0 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0"),
    defaultColor: "#4FA055", number: 0 },
  // Olive 2
  { id: 8, path: path("M 1880 1060 m -22 0 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0"),
    defaultColor: "#4FA055", number: 0 },
  // Eye
  { id: 9, path: path("M 1380 940 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0"),
    defaultColor: "#2A2A2E", number: 0 },
  // Cloud puff
  { id: 10, path: path("M 360 1500 a 80 80 0 1 0 160 0 a 80 80 0 1 0 -160 0 M 460 1460 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0 M 540 1500 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0"),
    defaultColor: "#FFFFFF", number: 0 },
];

const { palette, numberFor } = buildPalette(regions);
for (const r of regions) r.number = numberFor(r.defaultColor);

const lineart: LineStroke[] = [
  // Dove body
  { path: path("M 1024 1180 m -360 0 a 360 240 0 1 0 720 0 a 360 240 0 1 0 -720 0"),
    width: 18, color: INK, fill: false },
  // Wing
  { path: path("M 900 1080 Q 700 720 940 800 Q 1180 880 1100 1100 Z"),
    width: 14, color: INK, fill: false },
  // Wing feather lines
  { path: path("M 880 940 Q 940 880 1000 880"), width: 6, color: INK, fill: false },
  { path: path("M 880 980 Q 960 920 1040 920"), width: 6, color: INK, fill: false },
  { path: path("M 880 1020 Q 980 980 1080 980"), width: 6, color: INK, fill: false },
  // Head
  { path: path("M 1340 980 m -140 0 a 140 140 0 1 0 280 0 a 140 140 0 1 0 -280 0"),
    width: 14, color: INK, fill: false },
  // Beak
  { path: path("M 1480 980 L 1620 950 L 1620 1010 Z"), width: 12, color: INK, fill: false },
  // Eye
  { path: path("M 1380 940 m -16 0 a 16 16 0 1 0 32 0 a 16 16 0 1 0 -32 0"),
    width: 4, color: INK, fill: true },
  // Tail feathers
  { path: path("M 700 1280 L 580 1380"), width: 8, color: INK, fill: false },
  { path: path("M 720 1320 L 600 1440"), width: 8, color: INK, fill: false },
  { path: path("M 760 1340 L 660 1480"), width: 8, color: INK, fill: false },
  // Olive branch
  { path: path("M 1620 980 Q 1740 880 1820 920 Q 1740 1000 1620 980"), width: 8, color: INK, fill: false },
  { path: path("M 1680 1000 Q 1780 1080 1860 1040 Q 1780 1120 1680 1040"), width: 8, color: INK, fill: false },
  { path: path("M 1840 960 m -22 0 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0"), width: 6, color: INK, fill: false },
  { path: path("M 1880 1060 m -22 0 a 22 22 0 1 0 44 0 a 22 22 0 1 0 -44 0"), width: 6, color: INK, fill: false },
  // Cloud
  { path: path("M 360 1500 a 80 80 0 1 0 160 0 a 80 80 0 1 0 -160 0 M 460 1460 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0 M 540 1500 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0"),
    width: 12, color: INK, fill: false },
];

export const PEACE_DOVE: ColoringPage = {
  id: "peace-dove",
  title: "Peace Dove",
  size: SIZE,
  regions,
  lineart,
  palette,
};
