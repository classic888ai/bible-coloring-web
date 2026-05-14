// David & Goliath — generated with GPT Image 2 (see tools/AI_PAGE_WORKFLOW.md).
// Free-coloring only for now; CBN regions await bitmap region detection.

import type { ColoringPage, Region } from "../engine/page.js";

const SIZE = 2048;

// Single full-page region so free-coloring brushes can paint anywhere.
// When bitmap region detection ships, this will be replaced with the
// detected regions and their default colors.
function fullPageRegion(): Region {
  const path = new Path2D();
  path.rect(0, 0, SIZE, SIZE);
  return { id: 0, path, defaultColor: "#FFFFFF", number: 1 };
}

export const DAVID_GOLIATH: ColoringPage = {
  id: "david-goliath",
  title: "David & Goliath",
  size: SIZE,
  regions: [fullPageRegion()],
  lineart: [],
  palette: ["#FFFFFF"],
  lineartImageURL: "./pages/david-goliath.png",
};
