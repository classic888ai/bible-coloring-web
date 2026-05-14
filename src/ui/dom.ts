// Tiny safe DOM construction helpers — avoid innerHTML so untrusted strings
// (story titles, etc.) can't ever be interpreted as HTML.

export interface DOMAttrs {
  class?: string;
  style?: string;
  dataset?: Record<string, string>;
  [key: string]: string | number | boolean | EventListener | Record<string, string> | undefined;
}

export type DOMChild = HTMLElement | SVGElement | Node | string | null | undefined | DOMChild[];

export function el(
  tag: string,
  attrs: DOMAttrs = {},
  children: DOMChild = null,
): HTMLElement {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (k === "class" && typeof v === "string") node.className = v;
    else if (k === "style" && typeof v === "string") node.setAttribute("style", v);
    else if (k === "dataset" && typeof v === "object" && v !== null) {
      for (const [dk, dv] of Object.entries(v as Record<string, string>)) {
        node.dataset[dk] = dv;
      }
    } else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    } else if (typeof v === "boolean") {
      if (v) node.setAttribute(k, "");
    } else {
      node.setAttribute(k, String(v));
    }
  }
  appendChildren(node, children);
  return node;
}

export function appendChildren(parent: HTMLElement, children: DOMChild): void {
  if (children == null) return;
  if (Array.isArray(children)) {
    for (const c of children) appendChildren(parent, c);
    return;
  }
  if (typeof children === "string") {
    parent.appendChild(document.createTextNode(children));
    return;
  }
  parent.appendChild(children as Node);
}

export function clear(node: HTMLElement): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}
