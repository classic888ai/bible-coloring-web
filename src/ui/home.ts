// Home screen — mode picker + categorized story rows, matching the
// Bible App for Kids visual feel and Happy Color's category-feed pattern.

import type { ColoringPage } from "../engine/page.js";
import { pagesByCategory, findPage } from "../pages/index.js";
import { el, clear } from "./dom.js";
import { Icons } from "./icons.js";
import { readMetaList } from "../engine/persistence.js";
import { listCustomPages, saveCustomPage } from "../engine/custom_pages.js";

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

  // YOUR PAGES row — custom uploads + "Add a Page" tile. Always show the
  // add tile so the feature is discoverable, even with no custom pages yet.
  const yourStrip = el("div", { class: "category-strip" });
  yourStrip.appendChild(makeAddPageTile((page) => props.onOpenPage(page, "free")));
  for (const customPage of listCustomPages()) {
    const thumbSlot = el("div", { class: "story-thumb" });
    thumbSlot.appendChild(makeCustomThumbnail(customPage));
    const tile = el("button", { class: "story-tile" }, [
      thumbSlot,
      el("div", { class: "story-title" }, customPage.title),
    ]);
    tile.addEventListener("click", () => props.onOpenPage(customPage, "free"));
    yourStrip.appendChild(tile);
  }
  categoriesEl.appendChild(el("div", { class: "category" }, [
    el("div", { class: "category-title" }, "Your Pages"),
    yourStrip,
  ]));

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
      makeUpcomingTeaser(),
      makeFooter(),
    ]),
  ]);

  root.appendChild(home);
  maybeShowFirstLaunchHint();
}

// A teaser for the next content pack — implies an active product roadmap.
// Tapping "Notify me" pops an email mailto so parents can opt in.
function makeUpcomingTeaser(): HTMLElement {
  const upgrade = el("div", {
    style: "margin:12px 18px 24px;padding:20px;border-radius:24px;" +
           "background:linear-gradient(135deg,#FFE7B5 0%,#F7C078 100%);" +
           "color:#2A2A2E;box-shadow:0 6px 16px rgba(42,42,46,0.10);" +
           "display:flex;flex-direction:column;gap:8px;",
  }, [
    el("div", {
      style: "font-family:Fredoka,sans-serif;font-size:20px;font-weight:700",
    }, "Coming soon: Jesus' Stories pack"),
    el("div", { style: "font-size:14px;color:#5A4A2A;line-height:1.4" },
      "12 more pages — the Nativity, miracles, parables. Free for early supporters."),
  ]);
  const cta = el("button", {
    style: "align-self:flex-start;margin-top:6px;background:#2A2A2E;color:white;" +
           "font-size:14px;font-weight:700;padding:10px 18px;border-radius:999px;",
  }, "Notify me on iOS launch");
  cta.addEventListener("click", () => {
    const subject = encodeURIComponent("Notify me when Bible Coloring launches on iOS");
    const body = encodeURIComponent("Please add me to the launch list!");
    window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
  });
  upgrade.appendChild(cta);
  return upgrade;
}

function makeFooter(): HTMLElement {
  return el("div", {
    style: "padding:20px 18px 40px;text-align:center;color:var(--ink-2);font-size:12px;line-height:1.5",
  }, [
    el("div", { style: "font-weight:700;margin-bottom:4px" }, "Bible Coloring"),
    el("div", {}, "Joyful coloring for ages 3–6. Free to play. No ads, ever."),
    el("div", { style: "margin-top:10px;opacity:0.7" }, "Brush textures CC0 via ambientCG + David Revoy. Made with care."),
  ]);
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

// Tile that opens a file picker to import an image as a custom page.
// Visually distinct (dashed border + plus icon) so it reads as "add new."
function makeAddPageTile(onAdded: (page: ColoringPage) => void): HTMLElement {
  const tile = el("button", { class: "story-tile" });
  const thumb = el("div", {
    class: "story-thumb",
    style: "border-style:dashed;background:rgba(232,181,71,0.10);" +
           "display:flex;align-items:center;justify-content:center;" +
           "font-size:60px;color:var(--gold-deep);font-weight:300;",
  }, "+");
  tile.appendChild(thumb);
  tile.appendChild(el("div", { class: "story-title" }, "Add a Page"));

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/webp,image/svg+xml";
  input.style.display = "none";
  tile.appendChild(input);

  tile.addEventListener("click", () => input.click());
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      if (typeof dataURL !== "string") return;
      const title = file.name.replace(/\.[^.]+$/, "").slice(0, 30) || "My Page";
      const page = saveCustomPage(title, dataURL);
      if (page) onAdded(page);
      else alert("Couldn't save that page. Try a smaller image.");
    };
    reader.readAsDataURL(file);
  });
  return tile;
}

function makeCustomThumbnail(page: ColoringPage): HTMLImageElement {
  const img = new Image();
  img.src = page.lineartImageURL ?? "";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "contain";
  img.style.background = "white";
  return img;
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
