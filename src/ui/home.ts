// Home screen — mode picker + categorized story rows, matching the
// Bible App for Kids visual feel and Happy Color's category-feed pattern.

import type { ColoringPage } from "../engine/page.js";
import { pagesByCategory } from "../pages/index.js";
import { el, clear } from "./dom.js";
import { Icons } from "./icons.js";

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
