// Home screen — mode picker + categorized story rows, matching the
// Bible App for Kids visual feel and Happy Color's category-feed pattern.

import type { ColoringPage } from "../engine/page.js";
import { pagesByCategory, findPage } from "../pages/index.js";
import { el, clear } from "./dom.js";
import { Icons } from "./icons.js";
import { readMetaList } from "../engine/persistence.js";

export type Mode = "free" | "cbn";

interface HomeProps {
  onOpenPage: (page: ColoringPage, mode: Mode) => void;
}

export function renderHome(root: HTMLElement, props: HomeProps): void {
  clear(root);
  let primedMode: Mode | null = null;

  const modePick = (mode: Mode, cardNode: HTMLElement) => {
    primedMode = mode;
    root.querySelectorAll(".mode-card").forEach((c) =>
      c.classList.toggle("primed", c === cardNode),
    );
    // Suggest the next step by scrolling stories into view.
    const scroll = root.querySelector<HTMLElement>(".home-scroll");
    const firstCat = scroll?.querySelector<HTMLElement>(".category");
    if (firstCat && scroll) {
      scroll.scrollTo({ top: firstCat.offsetTop - 60, behavior: "smooth" });
    }
  };

  const freeCard = el("button", { class: "mode-card free", dataset: { mode: "free" } }, [
    el("div", { class: "mode-card-icon" }, Icons.crayon() as unknown as HTMLElement),
    el("div", { class: "mode-card-title" }, "Color It In"),
    el("div", { class: "mode-card-sub" }, "Pick any color, anywhere"),
  ]);
  freeCard.addEventListener("click", () => modePick("free", freeCard));

  const cbnCard = el("button", { class: "mode-card numbers", dataset: { mode: "cbn" } }, [
    el("div", { class: "mode-card-icon" }, Icons.numbers() as unknown as HTMLElement),
    el("div", { class: "mode-card-title" }, "By the Numbers"),
    el("div", { class: "mode-card-sub" }, "Tap to fill each piece"),
  ]);
  cbnCard.addEventListener("click", () => modePick("cbn", cbnCard));

  const modeRow = el("div", { class: "mode-row" }, [freeCard, cbnCard]);

  const categoriesEl = el("div", {});

  // CONTINUE row — pages with saved in-progress state, most recent first.
  // Per the top-app research, this is the single highest-impact retention
  // feature: never lose the kid's half-finished art.
  const inProgress = readMetaList();
  if (inProgress.length > 0) {
    const continueStrip = el("div", { class: "category-strip" });
    for (const meta of inProgress) {
      const page = findPage(meta.pageId);
      if (!page) continue;
      const progress = meta.totalRegions > 0
        ? meta.filledRegions / meta.totalRegions
        : 0;
      const thumbSlot = el("div", { class: "story-thumb" });
      thumbSlot.appendChild(makeThumbnail(page));
      if (progress > 0) thumbSlot.appendChild(makeProgressRing(progress));
      const tile = el("button", {
        class: "story-tile",
        dataset: { page: page.id, resume: "1" },
      }, [
        thumbSlot,
        el("div", { class: "story-title" }, page.title),
      ]);
      tile.addEventListener("click", () => {
        // Resume in the same mode the user was using.
        props.onOpenPage(page, meta.mode);
      });
      continueStrip.appendChild(tile);
    }
    categoriesEl.appendChild(el("div", { class: "category" }, [
      el("div", { class: "category-title" }, "Continue"),
      continueStrip,
    ]));
  }

  for (const [cat, pages] of pagesByCategory()) {
    const strip = el("div", { class: "category-strip" });
    for (const page of pages) {
      const thumbSlot = el("div", { class: "story-thumb" });
      thumbSlot.appendChild(makeThumbnail(page));
      const tile = el("button", {
        class: "story-tile",
        dataset: { page: page.id },
      }, [
        thumbSlot,
        el("div", { class: "story-title" }, page.title),
      ]);
      tile.addEventListener("click", () => {
        props.onOpenPage(page, primedMode ?? "free");
      });
      strip.appendChild(tile);
    }
    categoriesEl.appendChild(el("div", { class: "category" }, [
      el("div", { class: "category-title" }, cat),
      strip,
    ]));
  }

  const home = el("div", { class: "home" }, [
    el("div", { class: "home-topbar" }, [
      el("div", { class: "home-logo" }, [
        "Bible ",
        el("span", { class: "accent" }, "Coloring"),
      ]),
      el("button", { class: "home-gear", "aria-label": "Settings (grown-ups only)" },
        Icons.gear() as unknown as HTMLElement),
    ]),
    el("div", { class: "home-scroll" }, [
      modeRow,
      categoriesEl,
      el("div", { style: "height: 40px" }),
    ]),
  ]);

  root.appendChild(home);
  maybeShowFirstLaunchHint();
}

const ONBOARD_KEY = "ce-onboarded";

function maybeShowFirstLaunchHint(): void {
  try {
    if (localStorage.getItem(ONBOARD_KEY) === "1") return;
  } catch { return; }

  const overlay = el("div", {
    class: "onboard-overlay",
    style: "position:fixed;inset:0;background:rgba(42,42,46,0.55);z-index:90;" +
           "display:flex;align-items:center;justify-content:center;padding:24px;",
  });

  const card = el("div", {
    style: "background:var(--cream);border-radius:28px;padding:28px 24px;" +
           "max-width:340px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);" +
           "border:2px solid var(--line-warm);",
  }, [
    el("div", { style: "font-size:60px;margin-bottom:10px" }, "🌈"),
    el("div", {
      style: "font-family:Fredoka,sans-serif;font-size:24px;font-weight:700;margin-bottom:8px",
    }, "Hi! Pick a story to color"),
    el("div", {
      style: "font-size:14px;color:var(--ink-2);margin-bottom:18px;line-height:1.4",
    }, "Tap Color It In to color freely with crayons. Tap By the Numbers to fill each piece by its number."),
  ]);

  const goBtn = el("button", {
    style: "background:var(--gold);color:white;font-size:17px;font-weight:700;" +
           "padding:14px 32px;border-radius:999px;box-shadow:0 4px 12px rgba(232,181,71,0.35);",
  }, "Let's go!");
  goBtn.addEventListener("click", () => {
    try { localStorage.setItem(ONBOARD_KEY, "1"); } catch {}
    overlay.remove();
  });
  card.appendChild(goBtn);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

// SVG circular progress ring overlaid on the bottom-right of a thumbnail.
// Matches the Happy Color "started but not done" visual pattern.
function makeProgressRing(progress: number): SVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 36 36");
  svg.setAttribute("class", "progress-ring");
  // Style inline so this component is self-contained.
  svg.setAttribute("style",
    "position:absolute;bottom:8px;right:8px;width:36px;height:36px;" +
    "background:rgba(255,255,255,0.92);border-radius:50%;" +
    "box-shadow:0 2px 6px rgba(0,0,0,0.18);");
  const r = 14;
  const c = 2 * Math.PI * r;
  const bg = document.createElementNS(ns, "circle");
  bg.setAttribute("cx", "18");
  bg.setAttribute("cy", "18");
  bg.setAttribute("r", String(r));
  bg.setAttribute("fill", "none");
  bg.setAttribute("stroke", "#EFE6CC");
  bg.setAttribute("stroke-width", "4");
  svg.appendChild(bg);
  const fg = document.createElementNS(ns, "circle");
  fg.setAttribute("cx", "18");
  fg.setAttribute("cy", "18");
  fg.setAttribute("r", String(r));
  fg.setAttribute("fill", "none");
  fg.setAttribute("stroke", "#6FBF73");
  fg.setAttribute("stroke-width", "4");
  fg.setAttribute("stroke-linecap", "round");
  fg.setAttribute("stroke-dasharray", `${c * progress} ${c}`);
  fg.setAttribute("transform", "rotate(-90 18 18)");
  svg.appendChild(fg);
  const text = document.createElementNS(ns, "text");
  text.setAttribute("x", "18");
  text.setAttribute("y", "22");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("font-family", "Fredoka, sans-serif");
  text.setAttribute("font-size", "10");
  text.setAttribute("font-weight", "700");
  text.setAttribute("fill", "#2A2A2E");
  text.textContent = `${Math.round(progress * 100)}%`;
  svg.appendChild(text);
  return svg;
}

function makeThumbnail(page: ColoringPage): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 320;
  c.height = 320;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#FFFBF0";
  ctx.fillRect(0, 0, 320, 320);

  const scale = 320 / page.size;
  ctx.save();
  ctx.scale(scale, scale);

  // Faint pre-color hint — show defaultColor of each region at ~38% so
  // the kid sees what's possible.
  for (const region of page.regions) {
    ctx.fillStyle = region.defaultColor + "60";
    ctx.fill(region.path);
  }

  // Lineart on top.
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
  ctx.restore();
  return c;
}
