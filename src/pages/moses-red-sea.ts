// Moses parts the Red Sea — generated with GPT Image 2.

import type { ColoringPage, Region } from "../engine/page.js";

const SIZE = 2048;

function fullPageRegion(): Region {
  const path = new Path2D();
  path.rect(0, 0, SIZE, SIZE);
  return { id: 0, path, defaultColor: "#FFFFFF", number: 1 };
}

export const MOSES_RED_SEA: ColoringPage = {
  id: "moses-red-sea",
  title: "Moses & the Red Sea",
  size: SIZE,
  regions: [fullPageRegion()],
  lineart: [],
  palette: ["#FFFFFF"],
  lineartImageURL: "./pages/moses-red-sea.png",
};
