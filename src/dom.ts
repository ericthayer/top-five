/** Build a constructable stylesheet for a shadow root. */
export function css(text: string): CSSStyleSheet {
  const s = new CSSStyleSheet();
  s.replaceSync(text);
  return s;
}

type Attrs = Readonly<Record<string, string>>;

/** createElement with attributes and text. Text always goes through textContent. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Clone a static, trusted template string into a fragment. Never pass data through this. */
export function fragment(markup: string): DocumentFragment {
  const t = document.createElement('template');
  t.innerHTML = markup;
  return t.content;
}

export function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function centerOf(node: Element): { x: number; y: number } {
  const r = node.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
