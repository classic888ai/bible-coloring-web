// App entry — minimal router between Home / Free / CBN.

import { renderHome, type Mode } from "./ui/home.js";
import { renderColoring } from "./ui/coloring.js";
import { findPage, PAGES } from "./pages/index.js";
import type { ColoringPage } from "./engine/page.js";

const root = document.getElementById("app")!;

type Screen =
  | { kind: "home" }
  | { kind: "coloring"; page: ColoringPage; mode: Mode };

function navigate(screen: Screen): void {
  if (screen.kind === "home") {
    history.replaceState(null, "", "#");
    renderHome(root, {
      onOpenPage: (page, mode) => navigate({ kind: "coloring", page, mode }),
    });
  } else {
    history.replaceState(null, "", `#/${screen.mode}/${screen.page.id}`);
    renderColoring(root, {
      page: screen.page,
      mode: screen.mode,
      onBack: () => navigate({ kind: "home" }),
      onNext: () => navigate({ kind: "home" }),
    });
  }
}

// URL hash routing: #/free/noahs-ark or #/cbn/noahs-ark jumps straight in.
function initialScreen(): Screen {
  const m = location.hash.match(/^#\/(free|cbn)\/([\w-]+)/);
  if (m) {
    const page = findPage(m[2]!);
    if (page) return { kind: "coloring", page, mode: m[1] as Mode };
  }
  return { kind: "home" };
}

// Quick sanity check — make sure we have content at all.
if (PAGES.length === 0) {
  root.textContent = "No pages registered. See web/src/pages/index.ts";
} else {
  navigate(initialScreen());
}
