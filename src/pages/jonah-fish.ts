// Jonah and the great fish.

import type { ColoringPage, Region, LineStroke } from "../engine/page.js";
import { buildPalette } from "../engine/page.js";

const SIZE = 2048;
const INK = "#2A2A2E";
const path = (d: string) => new Path2D(d);

const regions: Region[] = [
  // Sky
  { id: 0, path: path("M 0 0 L 2048 0 L 2048 940 L 0 940 Z"),
    defaultColor: "#B6DCEF", number: 0 },
  // Sea (top of waves)
  { id: 1, path: path("M 0 940 L 2048 940 L 2048 2048 L 0 2048 Z"),
    defaultColor: "#5B9CFF", number: 0 },
  // Cloud 1
  { id: 2, path: path("M 320 280 a 100 100 0 1 0 200 0 a 100 100 0 1 0 -200 0 M 420 240 a 70 70 0 1 0 140 0 a 70 70 0 1 0 -140 0 M 510 280 a 70 70 0 1 0 140 0 a 70 70 0 1 0 -140 0"),
    defaultColor: "#FFFFFF", number: 0 },
  // Cloud 2
  { id: 3, path: path("M 1380 200 a 80 80 0 1 0 160 0 a 80 80 0 1 0 -160 0 M 1470 170 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0 M 1560 200 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0"),
    defaultColor: "#FFFFFF", number: 0 },
  // Sun
  { id: 4, path: path("M 200 480 m -100 0 a 100 100 0 1 0 200 0 a 100 100 0 1 0 -200 0"),
    defaultColor: "#FFD93D", number: 0 },
  // Fish body — big whale-shape
  { id: 5, path: path("M 480 1280 Q 480 1040 1000 1040 Q 1620 1040 1620 1280 Q 1620 1560 1000 1560 Q 480 1560 480 1280 Z"),
    defaultColor: "#5BCB7C", number: 0 },
  // Fish tail
  { id: 6, path: path("M 480 1280 L 280 1140 L 280 1420 Z"),
    defaultColor: "#4FA055", number: 0 },
  // Fish belly (lighter)
  { id: 7, path: path("M 580 1340 Q 580 1480 1000 1500 Q 1480 1480 1520 1340 Q 1480 1280 1000 1300 Q 580 1280 580 1340 Z"),
    defaultColor: "#F4D03F", number: 0 },
  // Fish eye
  { id: 8, path: path("M 1340 1180 m -28 0 a 28 28 0 1 0 56 0 a 28 28 0 1 0 -56 0"),
    defaultColor: "#2A2A2E", number: 0 },
];

const { palette, numberFor } = buildPalette(regions);
for (const r of regions) r.number = numberFor(r.defaultColor);

const lineart: LineStroke[] = [
  // Horizon
  { path: path("M 0 940 L 2048 940"), width: 8, color: INK, fill: false },
  // Waves
  { path: path("M 0 940 Q 100 920 200 940 T 400 940 T 600 940 T 800 940 T 1000 940 T 1200 940 T 1400 940 T 1600 940 T 1800 940 T 2048 940"),
    width: 8, color: INK, fill: false },
  { path: path("M 0 1080 Q 100 1060 200 1080 T 400 1080 T 600 1080 T 800 1080 T 1000 1080 T 1200 1080 T 1400 1080 T 1600 1080 T 1800 1080 T 2048 1080"),
    width: 6, color: INK, fill: false },
  // Cloud outlines
  { path: path("M 320 280 a 100 100 0 1 0 200 0 a 100 100 0 1 0 -200 0 M 420 240 a 70 70 0 1 0 140 0 a 70 70 0 1 0 -140 0 M 510 280 a 70 70 0 1 0 140 0 a 70 70 0 1 0 -140 0"),
    width: 12, color: INK, fill: false },
  { path: path("M 1380 200 a 80 80 0 1 0 160 0 a 80 80 0 1 0 -160 0 M 1470 170 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0 M 1560 200 a 60 60 0 1 0 120 0 a 60 60 0 1 0 -120 0"),
    width: 12, color: INK, fill: false },
  // Sun
  { path: path("M 200 480 m -100 0 a 100 100 0 1 0 200 0 a 100 100 0 1 0 -200 0"),
    width: 12, color: INK, fill: false },
  // Fish body outline
  { path: path("M 480 1280 Q 480 1040 1000 1040 Q 1620 1040 1620 1280 Q 1620 1560 1000 1560 Q 480 1560 480 1280 Z"),
    width: 18, color: INK, fill: false },
  // Tail
  { path: path("M 480 1280 L 280 1140 L 280 1420 Z"), width: 16, color: INK, fill: false },
  // Belly curve
  { path: path("M 580 1340 Q 1000 1480 1480 1340"), width: 8, color: INK, fill: false },
  // Mouth line
  { path: path("M 1380 1340 Q 1500 1360 1580 1320"), width: 8, color: INK, fill: false },
  // Eye
  { path: path("M 1340 1180 m -28 0 a 28 28 0 1 0 56 0 a 28 28 0 1 0 -56 0"),
    width: 4, color: INK, fill: true },
  // Spout
  { path: path("M 1100 1020 q 30 -120 60 -120 q 30 0 60 120"), width: 8, color: INK, fill: false },
  { path: path("M 1140 920 q 0 -60 -30 -100"), width: 6, color: INK, fill: false },
  { path: path("M 1190 920 q 0 -60 30 -100"), width: 6, color: INK, fill: false },
];

export const JONAH_FISH: ColoringPage = {
  id: "jonah-fish",
  title: "Jonah's Fish",
  size: SIZE,
  regions,
  lineart,
  palette,
};
