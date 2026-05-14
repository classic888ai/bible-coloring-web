// Coloring view — shared shell for both Free and CBN modes. Differences
// between modes are confined to:
//   - Palette: free shows fixed 16-color set; CBN shows page.palette + numbers
//   - Toolbox: free shows brushes; CBN shows nothing (always fill tool)
//   - Tap behavior: free strokes; CBN flood-fills the tapped region
//   - Completion check: CBN tracks per-region completion vs. defaultColor

import { Renderer } from "../engine/renderer.js";
import { BRUSHES, type Brush, type BrushName } from "../engine/brush.js";
import { type ColoringPage, hexToRgba } from "../engine/page.js";
import { el } from "./dom.js";
import { showCelebration, showConfettiBurst } from "./celebration.js";
import type { Mode } from "./home.js";
import { Icons } from "./icons.js";
import { loadPaint, savePaint, deletePaint } from "../engine/persistence.js";

const FREE_PALETTE = [
  "#E74C3C", "#F39C12", "#F4D03F", "#7DCE82", "#3498DB", "#5B9CFF",
  "#8E44AD", "#FF6B9D", "#FF8A47", "#A0522D", "#8B4513", "#2A2A2E",
  "#FFFFFF", "#B6DCEF", "#6FBF73", "#F08A6E",
];

interface ColoringProps {
  page: ColoringPage;
  mode: Mode;
  onBack: () => void;
  onNext: () => void;
}

export function renderColoring(root: HTMLElement, props: ColoringProps): void {
  // Build top bar (back button, progress (CBN only), undo, save).
  const backBtn = el("button", { class: "icon-button", "aria-label": "Back to stories" },
    Icons.back() as unknown as HTMLElement);
  const undoBtn = el("button", { class: "icon-button", "aria-label": "Undo", disabled: "true" },
    Icons.undo() as unknown as HTMLElement);
  const clearBtn = el("button", { class: "icon-button", "aria-label": "Clear page" },
    Icons.trash() as unknown as HTMLElement);
  const saveBtn = el("button", { class: "icon-button primary", "aria-label": "Save your art" },
    Icons.save() as unknown as HTMLElement);

  const progressFill = el("div", { class: "progress-fill" });
  progressFill.style.width = "0%";
  const progressBar = el("div", { class: "progress-bar" }, [progressFill]);

  const topBar = el("div", { class: "top-bar" }, [
    backBtn,
    undoBtn,
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

  const bottomPanel = el("div", { class: "bottom-panel" }, [
    paletteEl,
    ...(props.mode === "free" ? [toolboxEl] : []),
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

  let currentColor = props.mode === "cbn"
    ? (props.page.palette[0] ?? FREE_PALETTE[0]!)
    : FREE_PALETTE[0]!;
  let currentBrush: Brush = BRUSHES.crayon!;
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
    const colors = props.mode === "cbn" ? props.page.palette : FREE_PALETTE;
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

  function rebuildToolbox(): void {
    if (props.mode !== "free") return;
    toolboxEl.replaceChildren();
    const brushList: BrushName[] = ["crayon", "pencil", "chalk", "marker", "paint", "rainbow"];
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
  rebuildToolbox();

  function pageUVFromEvent(e: PointerEvent): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    return { x: clamp01(x), y: clamp01(y) };
  }

  function autoAdvancePalette(): void {
    // Tap Color Pro pattern: after finishing a CBN color, select the next
    // unfinished color in the palette.
    for (const hex of props.page.palette) {
      if (!paletteCompleted(hex)) {
        currentColor = hex;
        rebuildPalette();
        // Auto-scroll the palette so the new selection is visible.
        const target = paletteEl.querySelector(".swatch.selected") as HTMLElement | null;
        target?.scrollIntoView({ behavior: "smooth", inline: "center" });
        return;
      }
    }
  }

  function handleCBNTap(e: PointerEvent): void {
    const uv = pageUVFromEvent(e);
    const regionID = renderer.regionAt(uv);
    if (regionID < 0) return;
    const region = props.page.regions.find((r) => r.id === regionID);
    if (!region) return;
    if (filled.has(regionID)) return;  // already filled

    // Compare selected color to region's expected color (case-insensitive).
    if (region.defaultColor.toUpperCase() !== currentColor.toUpperCase()) {
      // Wrong color — shake + hint badge.
      canvasWrap.classList.remove("shake");
      void canvasWrap.offsetWidth;  // restart animation
      canvasWrap.classList.add("shake");
      const expected = props.page.palette.indexOf(region.defaultColor.toUpperCase()) + 1;
      const hint = el("div", { class: "wrong-hint" }, `Try color #${expected}`);
      hint.style.left = `${e.clientX - canvasWrap.getBoundingClientRect().left}px`;
      hint.style.top = `${e.clientY - canvasWrap.getBoundingClientRect().top - 50}px`;
      canvasWrap.appendChild(hint);
      setTimeout(() => hint.remove(), 1400);
      return;
    }

    // Correct: fill the region.
    renderer.floodFill(regionID, currentColor, 1);
    renderer.draw();
    filled.set(regionID, currentColor);
    updateProgress();
    autosave();

    // Tiny confetti burst at the tap point — adds satisfying feedback.
    const wrapRect = canvasWrap.getBoundingClientRect();
    showConfettiBurst(canvasWrap, e.clientX - wrapRect.left, e.clientY - wrapRect.top, 8);

    // Did we just finish this color in the palette?
    if (paletteCompleted(currentColor)) {
      autoAdvancePalette();
    }

    // Are we DONE?
    if (isComplete()) {
      lastTapX = e.clientX - wrapRect.left;
      lastTapY = e.clientY - wrapRect.top;
      setTimeout(() => triggerCompletion(), 350);
    }
  }

  function handleFreeStrokeStart(e: PointerEvent): void {
    canvas.setPointerCapture(e.pointerId);
    drawing = true;
    const uv = pageUVFromEvent(e);
    renderer.startStroke(uv);
    // The first move handler call will emit the first stamp.
    handleFreeStrokeMove(e);
  }

  function handleFreeStrokeMove(e: PointerEvent): void {
    if (!drawing) return;
    const uv = pageUVFromEvent(e);
    const pressure = e.pressure > 0 ? e.pressure : 0.5;  // floor for finger
    const color = hexToRgba(currentColor);
    renderer.continueStroke(currentBrush, [color[0], color[1], color[2]], uv, pressure, 0);
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

  // Resize observer — keep canvas pixel size in sync with CSS size.
  const ro = new ResizeObserver(() => {
    sizeCanvas(canvas, canvasWrap, props.page);
    renderer.draw();
  });
  ro.observe(canvasWrap);

  // Initial draw.
  renderer.draw();

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
