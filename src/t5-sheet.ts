import { css, el, fragment, reducedMotion } from './dom.js';
import { inkCss } from './ink.styles.js';
import type { Genre, Point, StepDir } from './data.js';

const sheetStyles = css(/* css */ `
${inkCss}
dialog {
  padding: 0; border: 0; background: transparent; color: inherit; overflow: visible;
  inline-size: min(720px, 100% - 32px); max-inline-size: none; max-block-size: calc(100% - 32px);
}
dialog::backdrop {
  background:
    radial-gradient(circle, rgb(0 0 0 / .35) 0 1px, transparent 1.5px) 0 0 / 7px 7px,
    rgb(20 19 26 / .55);
}
.sheet {
  container: sheet / inline-size; position: relative; isolation: isolate; overflow: hidden auto;
  box-sizing: border-box; max-block-size: calc(100dvh - 32px); padding: var(--pad);
  background: var(--bg); color: var(--fg); border-radius: var(--shape); corner-shape: var(--corner, round);
  font-family: var(--font-body); display: grid; gap: 1.25rem;
}
[data-motif="zigzag"].sheet { --shape: 160px 160px 28px 28px; padding-block-start: max(var(--pad), 90px); }
[data-motif="lanes"].sheet, [data-motif="halftone"].sheet { --shape: 28px 120px 28px 28px; }
[data-motif="scallop"].sheet { padding-inline-end: max(var(--pad), 86px); }
.motif-box { inset: 0 0 auto auto; inline-size: min(48%, 340px); block-size: 240px; }
[data-motif="zigzag"] .motif-box, [data-motif="lanes"] .motif-box { inline-size: 100%; block-size: 180px; }
[data-motif="scallop"] .motif-box { inline-size: 90px; block-size: 100%; }
[data-motif="lanes"] .motif-box { block-size: 120px; }
header { display: grid; grid-template-columns: 1fr auto; gap: .5rem 1rem; align-items: start; }
.cat { margin: 0; font: 500 .7rem/1 var(--font-mono); letter-spacing: .12em; text-transform: uppercase; }
h2 { grid-column: 1; margin: 0; font: 400 clamp(2.2rem, 9cqi, 4.4rem)/.92 var(--font-display); text-wrap: balance; }
h2 small { display: block; font-size: .42em; letter-spacing: .02em; margin-block-end: .2em; }
.close { grid-column: 2; grid-row: 1 / span 2; }
ol { list-style: none; margin: 0; padding: 0; display: grid; }
li { display: grid; grid-template-columns: 2.2ch 1fr; gap: .9rem; align-items: center;
  padding-block: .7rem; border-block-start: 2px dashed currentColor; }
li:first-child { border: 0; }
.num { font: 400 2.6rem/1 var(--font-display); text-align: center; }
li:first-child .num { font-size: 4.4rem; }
li:first-child .name { font-size: 1.6rem; }
.name { margin: 0; font-size: 1.15rem; font-weight: 700; line-height: 1.15; }
.note { margin: .2rem 0 0; font-size: .95rem; line-height: 1.4; }
footer { display: flex; align-items: center; justify-content: space-between; gap: .75rem; flex-wrap: wrap;
  font: 500 .72rem/1 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; }
footer output { font-variant-numeric: tabular-nums; }
button {
  all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: .45rem;
  padding: .6rem .9rem; border: 2px solid currentColor; border-radius: 999px;
  font: 600 .85rem/1 var(--font-body); letter-spacing: 0; text-transform: none;
  transition: background .2s, color .2s;
}
button:hover { background: var(--fg); color: var(--bg); }
button:focus-visible { outline: 3px solid var(--fg); outline-offset: 3px; }
.close { padding: .55rem; background: var(--bg); }
svg { inline-size: 1.1rem; block-size: 1.1rem; }
@container sheet (max-width: 440px) { .label { display: none; } }
`);

const sheetMarkup = /* html */ `
<dialog aria-labelledby="sheet-title">
  <article class="sheet">
    <div class="motif-box" aria-hidden="true"><div class="motif"></div></div>
    <header>
      <p class="cat"></p>
      <h2 id="sheet-title"><small>Top 5</small><span class="title"></span></h2>
      <button type="button" class="close" aria-label="Close">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    </header>
    <ol role="list"></ol>
    <footer>
      <button type="button" data-dir="-1"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg><span class="label"></span></button>
      <output aria-live="polite"></output>
      <button type="button" data-dir="1"><span class="label"></span><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></button>
    </footer>
  </article>
</dialog>`;

export interface SheetPosition {
  readonly index: number;
  readonly total: number;
  readonly prev: Genre;
  readonly next: Genre;
}

/** Modal detail view for one genre. Dispatches `t5-step` for prev/next and arrow keys. */
export class T5Sheet extends HTMLElement {
  readonly #root: ShadowRoot;
  readonly #dialog: HTMLDialogElement;
  readonly #article: HTMLElement;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.#root.adoptedStyleSheets = [sheetStyles];
    this.#root.append(fragment(sheetMarkup));
    this.#dialog = this.#root.querySelector('dialog') as HTMLDialogElement;
    this.#article = this.#root.querySelector('article') as HTMLElement;

    this.#root.querySelector('.close')?.addEventListener('click', () => this.close());
    this.#dialog.addEventListener('click', (e) => { if (e.target === this.#dialog) this.close(); });
    this.#dialog.addEventListener('close', () => this.dispatchEvent(new Event('close')));
    this.#dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.#step(-1);
      if (e.key === 'ArrowRight') this.#step(1);
    });
    for (const b of this.#root.querySelectorAll<HTMLButtonElement>('footer button')) {
      b.addEventListener('click', () => this.#step(b.dataset['dir'] === '-1' ? -1 : 1));
    }
  }

  get isOpen(): boolean { return this.#dialog.open; }

  show(genre: Genre, pos: SheetPosition, origin: Point): void {
    this.#render(genre, pos);
    if (!this.#dialog.open) this.#dialog.showModal();
    this.#reveal(origin);
  }

  close(): void { this.#dialog.close(); }

  #step(dir: StepDir): void {
    this.dispatchEvent(new CustomEvent('t5-step', { detail: { dir } }));
  }

  #reveal(origin: Point): void {
    if (reducedMotion()) return;
    const r = this.#article.getBoundingClientRect();
    const at = `at ${origin.x - r.left}px ${origin.y - r.top}px`;
    this.#article.animate(
      [{ clipPath: `circle(0 ${at})` }, { clipPath: `circle(150% ${at})` }],
      { duration: 520, easing: 'cubic-bezier(.2, .9, .2, 1)' },
    );
  }

  #render(g: Genre, pos: SheetPosition): void {
    const a = this.#article;
    a.dataset['ink'] = g.ink;
    a.dataset['motif'] = g.motif;
    a.scrollTop = 0;
    (a.querySelector('.cat') as HTMLElement).textContent = g.category;
    (a.querySelector('.title') as HTMLElement).textContent = g.title;
    (a.querySelector('ol') as HTMLOListElement).replaceChildren(...g.picks.map((p, i) => {
      const body = el('div');
      body.append(el('p', { class: 'name' }, p.name), el('p', { class: 'note' }, p.note));
      const li = el('li');
      li.append(el('span', { class: 'num', 'aria-hidden': 'true' }, String(i + 1)), body);
      return li;
    }));
    const [prevBtn, nextBtn] = a.querySelectorAll<HTMLButtonElement>('footer button');
    this.#label(prevBtn, `Previous: ${pos.prev.title}`, pos.prev.title);
    this.#label(nextBtn, `Next: ${pos.next.title}`, pos.next.title);
    (a.querySelector('output') as HTMLOutputElement).textContent = `${pos.index + 1} / ${pos.total}`;
  }

  #label(btn: HTMLButtonElement | undefined, aria: string, text: string): void {
    if (!btn) return;
    btn.setAttribute('aria-label', aria);
    (btn.querySelector('.label') as HTMLElement).textContent = text;
  }
}

customElements.define('t5-sheet', T5Sheet);
