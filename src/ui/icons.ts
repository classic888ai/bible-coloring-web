// Inline SVG icons — render reliably across all browsers/headless modes,
// unlike emoji which depend on platform fonts.

function svg(content: string, size = 24): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">${content}</svg>`;
}

// Each function returns an SVG DOM element (not innerHTML for safety).
function parseSvg(s: string): SVGElement {
  const div = document.createElement("div");
  // Single-source SVG markup, hardcoded internally — not user input.
  div.insertAdjacentHTML("afterbegin", s);
  return div.firstElementChild as SVGElement;
}

export const Icons = {
  gear: () => parseSvg(svg(`<path d="M19.14 12.94c.04-.31.06-.62.06-.94 0-.32-.02-.63-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.49.49 0 00-.49-.42h-3.84a.49.49 0 00-.49.42l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87a.49.49 0 00.12.61l2.03 1.58c-.05.3-.07.62-.07.94 0 .32.02.63.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.14.24.43.34.69.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.27.42.49.42h3.84c.24 0 .44-.18.49-.42l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.27.1.55 0 .69-.22l1.92-3.32a.49.49 0 00-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z"/>`)),
  crayon: () => parseSvg(svg(`<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.21a1 1 0 000-1.42l-2.33-2.33a1 1 0 00-1.41 0L15.13 5.13l3.75 3.75 1.83-1.84z"/>`)),
  numbers: () => parseSvg(svg(`<text x="12" y="17" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="900">1 2 3</text>`)),
  back: () => parseSvg(svg(`<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>`)),
  undo: () => parseSvg(svg(`<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>`)),
  redo: () => parseSvg(svg(`<path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>`)),
  save: () => parseSvg(svg(`<path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>`)),
  trash: () => parseSvg(svg(`<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>`)),
  brush_crayon: () => parseSvg(svg(`<path d="M8.7 11.66c.21.21.41.43.61.65l9.07-7.36c.32-.26.6-.54.85-.84l.05-.06-.18-.21c-.25-.3-.54-.58-.85-.84l-7.36 9.07c-.21-.2-.43-.4-.65-.61L8.7 11.66zm7.43 1.36l-.74-.74-1.41 1.41.74.74c.39.39.39 1.02 0 1.41l-2.83 2.83c-.39.39-1.02.39-1.41 0l-.74-.74-1.41 1.41.74.74c1.17 1.17 3.07 1.17 4.24 0l2.83-2.83c1.17-1.17 1.17-3.07 0-4.23zM6 14c-2.21 0-4 1.79-4 4 0 1.45.78 2.71 1.93 3.4.96.57 2.62 1.1 4.07 1.1.83 0 1.93-.16 2.61-.36-2.21-.92-4.61-3.34-4.61-6.14 0-.69.16-1.34.43-1.92C6.29 14.04 6.15 14 6 14z"/>`)),
  brush_pencil: () => parseSvg(svg(`<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>`)),
  brush_chalk: () => parseSvg(svg(`<circle cx="6" cy="6" r="1.5"/><circle cx="12" cy="9" r="1.5"/><circle cx="18" cy="6" r="1.5"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="17" r="1.5"/><circle cx="6" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/>`)),
  brush_marker: () => parseSvg(svg(`<path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-4 17l-3-3 3-3v2h6v2h-6v2z"/>`)),
  brush_paint: () => parseSvg(svg(`<path d="M18 4V3a1 1 0 00-1-1H5a1 1 0 00-1 1v4a1 1 0 001 1h12a1 1 0 001-1V6h1v4H9v11a1 1 0 001 1h2a1 1 0 001-1v-9h9V4h-4z"/>`)),
  brush_rainbow: () => parseSvg(svg(`<path d="M12 7c-5.52 0-10 4.48-10 10h2c0-4.42 3.58-8 8-8s8 3.58 8 8h2c0-5.52-4.48-10-10-10zm0 4c-3.31 0-6 2.69-6 6h2c0-2.21 1.79-4 4-4s4 1.79 4 4h2c0-3.31-2.69-6-6-6zm0 4c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z"/>`)),
  brush_glitter: () => parseSvg(svg(`<path d="M12 2l1.6 4.4L18 8l-4.4 1.6L12 14l-1.6-4.4L6 8l4.4-1.6L12 2zm6 12l.9 2.5L21.5 17l-2.6.9L18 20.5l-.9-2.6L14.5 17l2.6-.5L18 14zm-13 0l.9 2.5L8.5 17l-2.6.9L5 20.5l-.9-2.6L1.5 17l2.6-.5L5 14z"/>`)),
  brush_spray: () => parseSvg(svg(`<circle cx="6" cy="6" r="1.2"/><circle cx="10" cy="4" r="1.2"/><circle cx="14" cy="6" r="1.2"/><circle cx="18" cy="5" r="1.2"/><circle cx="7" cy="10" r="1.2"/><circle cx="12" cy="9" r="1.2"/><circle cx="17" cy="11" r="1.2"/><circle cx="5" cy="14" r="1.2"/><circle cx="10" cy="15" r="1.2"/><circle cx="15" cy="14" r="1.2"/><circle cx="19" cy="15" r="1.2"/><circle cx="8" cy="19" r="1.2"/><circle cx="13" cy="18" r="1.2"/><circle cx="18" cy="19" r="1.2"/>`)),
  brush_watercolor: () => parseSvg(svg(`<path d="M12 2C9.24 6.34 6 10.59 6 14.71 6 18.74 8.69 22 12 22s6-3.26 6-7.29C18 10.59 14.76 6.34 12 2zm0 18.5c-2.43 0-4.5-2.27-4.5-5.29 0-2.71 2.07-5.93 4.5-9.21 2.43 3.28 4.5 6.5 4.5 9.21 0 3.02-2.07 5.29-4.5 5.29z"/>`)),
  brush_stars: () => parseSvg(svg(`<path d="M12 2l3 7.5L23 10l-6 5 2 8-7-4-7 4 2-8L1 10l8-0.5L12 2z"/>`)),
};

export type IconName = keyof typeof Icons;
