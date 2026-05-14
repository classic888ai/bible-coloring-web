// Coloring view — shared shell for both Free and CBN modes. Differences
// between modes are confined to:
//   - Palette: free shows fixed 16-color set; CBN shows page.palette + numbers
//   - Toolbox: free shows brushes; CBN shows nothing (always fill tool)
//   - Tap behavior: free strokes; CBN flood-fills the tapped region
//   - Completion check: CBN tracks per-region completion vs. defaultColor

import { Renderer } from "../engine/renderer.js";
import { BRUSHES, type Brush, type BrushName } from "../engine/brush.js";
import { type ColoringPage, hexToRgba, regionLabelCenter } from "../engine/page.js";
import { el } from "./dom.js";
import { showCelebration, showConfettiBurst, showTapPop } from "./celebration.js";
import type { Mode } from "./home.js";
import { Icons } from "./icons.js";
import { loadPaint, savePaint, deletePaint } from "../engine/persistence.js";

interface PaletteTheme {
  name: string;
  emoji: string;
  colors: string[];
}

const PALETTE_THEMES: PaletteTheme[] = [
  {
    name: "Classic",
    emoji: "🎨",
    colors: [
      "#E74C3C", "#F39C12", "#F4D03F", "#7DCE82", "#3498DB", "#5B9CFF",
      "#8E44AD", "#FF6B9D", "#FF8A47", "#A0522D", "#8B4513", "#2A2A2E",
      "#FFFFFF", "#B6DCEF", "#6FBF73", "#F08A6E",
    ],
  },
  {
    name: "Pastels",
    emoji: "🌸",
    colors: [
      "#FAD2E1", "#FFEAA7", "#C7CEEA", "#B5EAD7", "#FFDAC1", "#E2C2FF",
      "#FFB7B2", "#A8E6CF", "#FCEFB4", "#D6F4E5", "#FFCDD2", "#D0BCFF",
      "#FFE0AC", "#C8E6C9", "#F8BBD0", "#E1F5FE",
    ],
  },
  {
    name: "Neon",
    emoji: "⚡",
    colors: [
      "#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF", "#06FFA5",
      "#FF4081", "#7C4DFF", "#00E5FF", "#76FF03", "#FFEA00", "#FF3D00",
      "#E040FB", "#1DE9B6", "#FFFFFF", "#0D0D0D",
    ],
  },
  {
    name: "Earth",
    emoji: "🍂",
    colors: [
      "#8B4513", "#A0522D", "#CD853F", "#DEB887", "#F4A460", "#D2691E",
      "#6B4423", "#8B7355", "#BC8F8F", "#9C7C5C", "#5C4033", "#7B5E40",
      "#9E7B5A", "#C9A86A", "#7A5230", "#3E2723",
    ],
  },
  {
    name: "Ocean",
    emoji: "🌊",
    colors: [
      "#001F3F", "#0074D9", "#39CCCC", "#7FDBFF", "#B0E0E6", "#E0F7FA",
      "#005F73", "#0A9396", "#94D2BD", "#0077B6", "#00B4D8", "#48CAE4",
      "#90E0EF", "#ADE8F4", "#CAF0F8", "#03045E",
    ],
  },
];

// Brush size selector — multiplies the current brush's base radius.
const SIZE_OPTIONS: Array<{ label: string; mult: number }> = [
  { label: "S", mult: 0.5 },
  { label: "M", mult: 1.0 },
  { label: "L", mult: 1.7 },
];

function sizeButtonStyle(selected: boolean): string {
  return "width:36px;height:36px;border-radius:50%;font-family:Fredoka,sans-serif;" +
    "font-weight:700;font-size:13px;" +
    (selected
      ? "background:var(--gold);color:white;box-shadow:0 2px 6px rgba(0,0,0,0.18);"
      : "background:var(--cream-2);color:var(--ink-2);");
}

function themeButtonStyle(selected: boolean): string {
  return "width:36px;height:36px;border-radius:50%;font-size:18px;" +
    "display:inline-flex;align-items:center;justify-content:center;" +
    (selected
      ? "background:white;box-shadow:0 0 0 2px var(--gold), 0 2px 6px rgba(0,0,0,0.18);"
      : "background:var(--cream-2);");
}

interface ColoringProps {
  page: ColoringPage;
  mode: Mode;
  onBack: () => void;
  onNext: () => void;
}

export function renderColoring(root: HTMLElement, props: ColoringProps): void {
  // Build top bar (back button, stay-in-lines (free only), progress (CBN only), clear, save).
  const backBtn = el("button", { class: "icon-button", "aria-label": "Back to stories" },
    Icons.back() as unknown as HTMLElement);
  const undoBtn = el("button", { class: "icon-button", "aria-label": "Undo", disabled: "true" },
    Icons.undo() as unknown as HTMLElement);
  const clearBtn = el("button", { class: "icon-button", "aria-label": "Clear page" },
    Icons.trash() as unknown as HTMLElement);
  const saveBtn = el("button", { class: "icon-button primary", "aria-label": "Save your art" },
    Icons.save() as unknown as HTMLElement);
  const stayInLinesBtn = el("button", {
    class: "icon-button",
    "aria-label": "Stay in the lines",
    title: "Stay in the lines",
  }, "✏️");

  const progressFill = el("div", { class: "progress-fill" });
  progressFill.style.width = "0%";
  const progressBar = el("div", { class: "progress-bar" }, [progressFill]);

  const topBar = el("div", { class: "top-bar" }, [
    backBtn,
    undoBtn,
    ...(props.mode === "free" ? [stayInLinesBtn] : []),
    ...(props.mode === "cbn" ? [progressBar] : [el("div", { class: "top-bar-spacer" })]),
    clearBtn,
    saveBtn,
  ]);

  // Canvas.
  const canvas = document.createElement("canvas");
  canvas.id = "canvas";

  // Size the canvas to its container preserving aspect ratio. We render
  // at devicePixelRatio for crispness.
  const canvasWrap = el("div", { class: "canvas-wrap" }, [canvas]);

  // Palette panel (mode-dependent).
  const paletteEl = el("div", { class: "palette" });

  // Tool dock (free mode only).
  const toolboxEl = el("div", { class: "toolbox" });
  // Size + palette controls (free mode only). Rendered above the toolbox.
  const accessoriesEl = el("div", {
    style: "display:flex;gap:10px;justify-content:space-between;align-items:center;padding:0 14px;margin-bottom:6px;",
  });

  const bottomPanel = el("div", { class: "bottom-panel" }, [
    paletteEl,
    ...(props.mode === "free" ? [accessoriesEl, toolboxEl] : []),
  ]);

  const coloring = el("div", { class: "coloring" }, [topBar, canvasWrap, bottomPanel]);
  root.replaceChildren(coloring);

  // ------------------------------------------------------------------
  // RENDERER + INPUT
  // ------------------------------------------------------------------

  // First-time WebGL canvas sizing: match container exactly so we don't
  // upscale/downscale CSS.
  sizeCanvas(canvas, canvasWrap, props.page);

  let renderer: Renderer;
  try {
    renderer = new Renderer(canvas);
    renderer.loadPage(props.page);
  } catch (err) {
    canvasWrap.replaceChildren(
      el("div", { style: "padding: 24px; text-align: center; color: var(--ink-2)" },
        `Sorry, this browser can't run the coloring engine. (${(err as Error).message})`,
      ),
    );
    return;
  }

  // Restore prior paint state if any. Resume is one of the highest-impact
  // retention features per the top-app research — never throw away the kid's
  // half-finished page.
  const savedPaint = loadPaint(props.page.id);
  if (savedPaint) {
    renderer.importPaintPNG(savedPaint).then(() => renderer.draw()).catch(() => {});
  }

  let currentPalette = PALETTE_THEMES[0]!;
  let currentColor = props.mode === "cbn"
    ? (props.page.palette[0] ?? currentPalette.colors[0]!)
    : currentPalette.colors[0]!;
  let currentBrush: Brush = BRUSHES.crayon!;
  let currentSizeMult = 1.0;
  let stayInLines = false;
  let activeClipRegion = 0;   // captured at pointerdown when stayInLines is on
  let drawing = false;
  let lastTapX = 0;
  let lastTapY = 0;

  // Per-region fill state (CBN). null = unfilled, hex = the color used.
  const filled = new Map<number, string>();

  const filledCount = () => filled.size;
  const totalRegions = props.page.regions.length;

  function updateProgress(): void {
    const pct = Math.round((filledCount() / totalRegions) * 100);
    progressFill.style.width = `${pct}%`;
  }

  function isComplete(): boolean {
    if (props.mode !== "cbn") return false;
    for (const region of props.page.regions) {
      const f = filled.get(region.id);
      if (!f || f.toUpperCase() !== region.defaultColor.toUpperCase()) return false;
    }
    return true;
  }

  function paletteCompleted(color: string): boolean {
    // A palette swatch is "completed" in CBN once every region with that
    // default color has been filled with that color.
    const target = color.toUpperCase();
    for (const region of props.page.regions) {
      if (region.defaultColor.toUpperCase() !== target) continue;
      if ((filled.get(region.id) ?? "").toUpperCase() !== target) return false;
    }
    return true;
  }

  function rebuildPalette(): void {
    paletteEl.replaceChildren();
    const colors = props.mode === "cbn" ? props.page.palette : currentPalette.colors;
    colors.forEach((hex, i) => {
      const swatch = el("button", {
        class: "swatch",
        "aria-label": `Color ${hex}`,
        dataset: { hex },
      });
      swatch.style.background = hex;
      if (props.mode === "cbn") {
        const number = i + 1;
        swatch.appendChild(el("div", { class: "swatch-number" }, String(number)));
        if (paletteCompleted(hex)) swatch.classList.add("completed");
      }
      if (hex.toUpperCase() === currentColor.toUpperCase()) swatch.classList.add("selected");
      swatch.addEventListener("click", () => {
        if (props.mode === "cbn" && paletteCompleted(hex)) return; // can't reselect a finished color
        currentColor = hex;
        paletteEl.querySelectorAll(".swatch").forEach((s) => {
          s.classList.toggle("selected", (s as HTMLElement).dataset.hex === hex);
        });
      });
      paletteEl.appendChild(swatch);
    });
  }
  rebuildPalette();

  function rebuildAccessories(): void {
    if (props.mode !== "free") return;
    accessoriesEl.replaceChildren();

    // Size selector (S/M/L).
    const sizeRow = el("div", { style: "display:flex;gap:6px;align-items:center;" }, [
      el("div", {
        style: "font-size:11px;font-weight:700;color:var(--ink-2);margin-right:4px;",
      }, "Size"),
    ]);
    for (const opt of SIZE_OPTIONS) {
      const btn = el("button", {
        style: sizeButtonStyle(opt.mult === currentSizeMult),
      }, opt.label);
      btn.addEventListener("click", () => {
        currentSizeMult = opt.mult;
        rebuildAccessories();
      });
      sizeRow.appendChild(btn);
    }

    // Palette theme selector.
    const themeRow = el("div", { style: "display:flex;gap:6px;align-items:center;" }, [
      el("div", {
        style: "font-size:11px;font-weight:700;color:var(--ink-2);margin-right:4px;",
      }, "Palette"),
    ]);
    for (const theme of PALETTE_THEMES) {
      const isSel = theme === currentPalette;
      const btn = el("button", {
        title: theme.name,
        "aria-label": `${theme.name} palette`,
        style: themeButtonStyle(isSel),
      }, theme.emoji);
      btn.addEventListener("click", () => {
        currentPalette = theme;
        currentColor = theme.colors[0]!;
        rebuildAccessories();
        rebuildPalette();
      });
      themeRow.appendChild(btn);
    }

    accessoriesEl.appendChild(sizeRow);
    accessoriesEl.appendChild(themeRow);
  }

  function rebuildToolbox(): void {
    if (props.mode !== "free") return;
    toolboxEl.replaceChildren();
    const brushList: BrushName[] = [
      "crayon", "pencil", "chalk", "marker", "paint", "rainbow",
      "glitter", "spray", "watercolor", "stars",
    ];
    for (const name of brushList) {
      const brush = BRUSHES[name]!;
      const iconFn = `brush_${name}` as keyof typeof Icons;
      const iconNode = (Icons[iconFn] ?? Icons.brush_crayon)();
      const t = el("button", {
        class: "tool",
        "aria-label": brush.name,
        dataset: { brush: name },
      }, [
        el("div", { class: "tool-icon" }, iconNode as unknown as HTMLElement),
        el("div", { class: "tool-label" }, brush.name),
      ]);
      if (currentBrush === brush) t.classList.add("selected");
      t.addEventListener("click", () => {
        currentBrush = brush;
        toolboxEl.querySelectorAll(".tool").forEach((tt) => {
          tt.classList.toggle("selected", (tt as HTMLElement).dataset.brush === name);
        });
      });
      toolboxEl.appendChild(t);
    }
  }
  rebuildAccessories();
  rebuildToolbox();

  // Stay-in-the-lines toggle behavior (free mode).
  function updateStayInLinesVisual(): void {
    if (stayInLines) {
      stayInLinesBtn.style.background = "var(--gold)";
      stayInLinesBtn.style.color = "white";
      stayInLinesBtn.style.borderColor = "var(--gold-deep)";
    } else {
      stayInLinesBtn.style.background = "";
      stayInLinesBtn.style.color = "";
      stayInLinesBtn.style.borderColor = "";
    }
  }
  stayInLinesBtn.addEventListener("click", () => {
    stayInLines = !stayInLines;
    updateStayInLinesVisual();
  });

  function pageUVFromEvent(e: PointerEvent): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return { x: clamp01(x), y: clamp01(y) };
  }

  function handleCBNTap(e: PointerEvent): void {
    const uv = pageUVFromEvent(e);
    const regionID = renderer.regionAt(uv);
    if (regionID < 0) return;
    const region = props.page.regions.find((r) => r.id === regionID);
    if (!region) return;
    if (filled.has(regionID)) return;  // already filled

    // EASY MODE for ages 3-6: tap any region, it fills with the correct
    // color automatically. The palette below stays as a legend showing
    // progress, but doesn't gate the fill — pre-readers shouldn't have to
    // match colors before tapping.
    const fillColor = region.defaultColor;
    renderer.floodFill(regionID, fillColor, 1);
    renderer.draw();
    filled.set(regionID, fillColor);
    updateProgress();
    rebuildPalette();   // refresh completed-color visual state
    hideRegionNumber(regionID);
    autosave();

    // Tap feedback — ripple + pop + audio + haptic + confetti micro-burst.
    // Multi-sensory feedback is the defining "Happy Color feel" element.
    const wrapRect = canvasWrap.getBoundingClientRect();
    const tx = e.clientX - wrapRect.left;
    const ty = e.clientY - wrapRect.top;
    showTapPop(canvasWrap, tx, ty, fillColor);
    showConfettiBurst(canvasWrap, tx, ty, 6);

    // Are we DONE?
    if (isComplete()) {
      lastTapX = e.clientX - wrapRect.left;
      lastTapY = e.clientY - wrapRect.top;
      setTimeout(() => triggerCompletion(), 350);
    }
  }

  // Render number labels at each region's pole-of-inaccessibility so kids
  // see WHICH color goes where. Numbers are HTML overlay divs sized to the
  // canvas, so they scale crisply at any DPI. Hidden as regions fill.
  const numberOverlay = el("div", {
    style: "position:absolute;inset:0;pointer-events:none;",
  });
  canvasWrap.appendChild(numberOverlay);
  const numberLabels = new Map<number, HTMLElement>();

  // Region-specific font sizing — small regions get smaller numbers so
  // they don't overflow. The label center is the pole-of-inaccessibility,
  // so we use its distance-from-edge to scale.
  function buildRegionNumbers(): void {
    if (props.mode !== "cbn") return;
    numberOverlay.replaceChildren();
    numberLabels.clear();
    for (const region of props.page.regions) {
      if (filled.has(region.id)) continue;
      const center = regionLabelCenter(region, props.page.size);
      const label = el("div", {
        style: "position:absolute;transform:translate(-50%,-50%);" +
               "font-family:Fredoka,sans-serif;font-weight:800;" +
               "color:#2A2A2E;" +
               "background:rgba(255,251,238,0.92);" +
               "border:3px solid #2A2A2E;" +
               "border-radius:999px;" +
               "display:flex;align-items:center;justify-content:center;" +
               "box-shadow:0 2px 5px rgba(0,0,0,0.18);" +
               "pointer-events:none;user-select:none;" +
               "line-height:1;",
      }, String(region.number));
      label.dataset.region = String(region.id);
      label.dataset.cx = String(center.x);
      label.dataset.cy = String(center.y);
      numberOverlay.appendChild(label);
      numberLabels.set(region.id, label);
    }
    positionRegionNumbers();
  }

  function positionRegionNumbers(): void {
    const wrapRect = canvasWrap.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const offsetX = canvasRect.left - wrapRect.left;
    const offsetY = canvasRect.top - wrapRect.top;
    const scale = canvasRect.width / props.page.size;
    // Significantly larger than before: 64px base at canvas scale, with a
    // floor of 18px so even tiny regions stay readable. Numbers now sit in
    // a circular cream chip with a charcoal border so they're crisp
    // against any background color.
    const fontPx = Math.max(18, Math.round(64 * scale));
    const chipSize = Math.round(fontPx * 1.7);
    for (const [, label] of numberLabels) {
      const cx = Number(label.dataset.cx);
      const cy = Number(label.dataset.cy);
      label.style.left = `${offsetX + cx * scale}px`;
      label.style.top = `${offsetY + cy * scale}px`;
      label.style.fontSize = `${fontPx}px`;
      label.style.width = `${chipSize}px`;
      label.style.height = `${chipSize}px`;
    }
  }

  function hideRegionNumber(id: number): void {
    const label = numberLabels.get(id);
    if (!label) return;
    label.style.transition = "opacity 0.3s, transform 0.3s";
    label.style.opacity = "0";
    label.style.transform = "translate(-50%, -50%) scale(0.4)";
    setTimeout(() => label.remove(), 320);
    numberLabels.delete(id);
  }

  function handleFreeStrokeStart(e: PointerEvent): void {
    canvas.setPointerCapture(e.pointerId);
    drawing = true;
    const uv = pageUVFromEvent(e);
    // Capture the region under the touch for stay-in-the-lines clipping.
    if (stayInLines) {
      const rid = renderer.regionAt(uv);
      // Renderer's clipRegionID convention is 1-based (regionID + 1).
      activeClipRegion = rid >= 0 ? rid + 1 : 0;
    } else {
      activeClipRegion = 0;
    }
    renderer.startStroke(uv);
    handleFreeStrokeMove(e);
  }

  // Build a brush with the current size multiplier applied.
  function sizedBrush(): Brush {
    return { ...currentBrush, radius: currentBrush.radius * currentSizeMult };
  }

  function handleFreeStrokeMove(e: PointerEvent): void {
    if (!drawing) return;
    const uv = pageUVFromEvent(e);
    const pressure = e.pressure > 0 ? e.pressure : 0.5;
    const color = hexToRgba(currentColor);
    renderer.continueStroke(sizedBrush(), [color[0], color[1], color[2]], uv, pressure, activeClipRegion);
    renderer.draw();
  }

  function handleFreeStrokeEnd(e: PointerEvent): void {
    if (!drawing) return;
    drawing = false;
    canvas.releasePointerCapture(e.pointerId);
    renderer.endStroke();
    autosave();
  }

  // Save the paint layer to localStorage. Debounced to avoid blocking the
  // input thread on rapid stroke ends — savePaint reads back a 2048² texture
  // which is non-trivial.
  let saveTimer: number | null = null;
  function autosave(): void {
    if (saveTimer != null) window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      try {
        const png = renderer.exportPaintPNG();
        savePaint(props.page.id, png, {
          filledRegions: filledCount(),
          totalRegions,
          mode: props.mode,
        });
      } catch (e) {
        console.warn("autosave failed", e);
      }
    }, 600);
  }

  // Wire input depending on mode.
  if (props.mode === "cbn") {
    canvas.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      handleCBNTap(e);
    });
  } else {
    canvas.addEventListener("pointerdown", (e) => { e.preventDefault(); handleFreeStrokeStart(e); });
    canvas.addEventListener("pointermove", handleFreeStrokeMove);
    canvas.addEventListener("pointerup", handleFreeStrokeEnd);
    canvas.addEventListener("pointercancel", handleFreeStrokeEnd);
  }

  // Top-bar actions.
  backBtn.addEventListener("click", () => props.onBack());
  clearBtn.addEventListener("click", () => {
    if (!confirm("Clear the page and start over?")) return;
    renderer.clearPaint();
    renderer.draw();
    filled.clear();
    updateProgress();
    rebuildPalette();
    deletePaint(props.page.id);
  });
  saveBtn.addEventListener("click", () => {
    const dataURL = renderer.exportPNG();
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = `${props.page.id}.png`;
    a.click();
  });

  // Resize observer — keep canvas pixel size in sync with CSS size, and
  // reposition the CBN number labels to match.
  const ro = new ResizeObserver(() => {
    sizeCanvas(canvas, canvasWrap, props.page);
    renderer.draw();
    positionRegionNumbers();
  });
  ro.observe(canvasWrap);

  // Initial draw.
  renderer.draw();

  // Build CBN number labels after first draw so the canvas has a known size.
  buildRegionNumbers();
  // For pages opened mid-session (with some regions already filled from
  // persistence), make sure those numbers don't render at all.
  // (filled is hydrated from the renderer's restored paint... but we don't
  // track per-region fill state across reloads yet — that's a future polish.)

  function triggerCompletion(): void {
    showCelebration({
      canvasContainer: canvasWrap,
      originX: lastTapX,
      originY: lastTapY,
      storyTitle: props.page.title,
      onSave: () => {
        const dataURL = renderer.exportPNG();
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = `${props.page.id}.png`;
        a.click();
      },
      onReplay: () => {
        // For v1, "replay" just clears and lets the user re-do it.
        renderer.clearPaint();
        renderer.draw();
        filled.clear();
        updateProgress();
        rebuildPalette();
        dismissCelebration();
      },
      onNext: () => props.onNext(),
      onDismiss: () => dismissCelebration(),
    });
    function dismissCelebration() {
      document.querySelector(".celebration")?.remove();
    }
  }
}

function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

function sizeCanvas(canvas: HTMLCanvasElement, container: HTMLElement, page: ColoringPage): void {
  // Fit the page's square aspect inside the container, max edge ≤ container.
  const dpr = window.devicePixelRatio || 1;
  const cw = container.clientWidth - 24;   // padding
  const ch = container.clientHeight - 24;
  const side = Math.min(cw, ch);
  canvas.style.width = `${side}px`;
  canvas.style.height = `${side}px`;
  // Bitmap is the displayed size × dpr, but capped at page.size to avoid
  // pointless upsampling.
  const pixelSide = Math.min(page.size, Math.round(side * dpr));
  canvas.width = pixelSide;
  canvas.height = pixelSide;
}
