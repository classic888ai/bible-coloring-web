// Rasterize a coloring page's regions + lineart to 2D canvases that the
// WebGL renderer uses as textures.
//
// Region ID texture (R8 internally, but rendered as RGBA here and consumed
// via the R channel): each region's pixels carry (regionID/255) in red.
// Background = 0. Used by the shader to:
//   (a) flood-fill that region (tap-to-fill)
//   (b) clip brush stamps to a single region (stay-in-lines)
//
// Lineart texture (RGBA): pre-rendered outlines drawn over the paint.

import type { ColoringPage } from "./page.js";

export function rasterizeRegionIDs(page: ColoringPage): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = page.size;
  c.height = page.size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Failed to get 2D context");

  // Background = 0 (no region).
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, page.size, page.size);

  // Each region is drawn with its red channel = (id + 1) so 0 stays the
  // "no region" sentinel. Region.id 0..253 → fill 1..254.
  // We use opaque-source compositing so the regions don't bleed.
  for (const region of page.regions) {
    const r = Math.min(254, region.id + 1);
    ctx.fillStyle = `rgb(${r}, 0, 0)`;
    ctx.fill(region.path);
  }
  return c;
}

export function rasterizeLineart(page: ColoringPage): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = page.size;
  c.height = page.size;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Failed to get 2D context");

  ctx.clearRect(0, 0, page.size, page.size);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const stroke of page.lineart) {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    if (stroke.fill) {
      ctx.fillStyle = stroke.color;
      ctx.fill(stroke.path);
    }
    ctx.stroke(stroke.path);
  }

  return c;
}

// Look up the region ID at a pixel (used for tap-to-fill region hit-testing).
// regionCanvas is the output of rasterizeRegionIDs.
// pageUV is (0..1, 0..1). Returns the region.id (0..253) or -1 for background.
export function regionIDAtUV(
  regionCanvas: HTMLCanvasElement,
  uvX: number,
  uvY: number,
): number {
  const ctx = regionCanvas.getContext("2d");
  if (!ctx) return -1;
  const px = Math.floor(uvX * regionCanvas.width);
  const py = Math.floor(uvY * regionCanvas.height);
  if (px < 0 || py < 0 || px >= regionCanvas.width || py >= regionCanvas.height) {
    return -1;
  }
  const data = ctx.getImageData(px, py, 1, 1).data;
  const r = data[0] ?? 0;
  return r === 0 ? -1 : r - 1;
}
