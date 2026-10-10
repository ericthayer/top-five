import { css, el, fragment, centerOf } from './dom.js';
import { inkCss } from './ink.styles.js';
import type { Genre } from './data.js';

const tileStyles = css(/* css */ `
${inkCss}
:host { display: block; container: tile / size; min-inline-size: 0; min-block-size: 0; }
.tile {
  position: relative; isolation: isolate; overflow: hidden; box-sizing: border-box;
  inline-size: 100%; block-size: 100%; padding: var(--pad);
  display: grid; grid-template-rows: auto 1fr auto; gap: .4rem;
  background: var(--bg); color: var(--fg); border-radius: var(--shape); corner-shape: var(--corner, round);
  font-family: var(--font-body);
  transition: transform .4s cubic-bezier(.3, 1.6, .5, 1), box-shadow .4s cubic-bezier(.3, 1.6, .5, 1);
  animation: settle .7s cubic-bezier(.3, 1.6, .5, 1) both;
  animation-delay: calc(var(--order, 0) * 55ms);
}
[data-motif="zigzag"].tile  { padding-block-start: max(var(--pad), 34cqi); }
[data-motif="lanes"].tile   { padding-inline: max(var(--pad), 26cqh); }
[data-motif="scallop"].tile { padding-inline-end: max(var(--pad), 58px); }
[data-motif="scallop"] button { font-size: clamp(1.1rem, min(10.5cqi, 24cqh), 5.6rem); }
.tile:hover { transform: translate(-4px, -4px) rotate(-.4deg); box-shadow: 8px 8px 0 var(--ink); }
.tile:active { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 var(--ink); }
.tile:has(button:focus-visible) { outline: 3px solid var(--ink); outline-offset: 4px; }
.tile:hover .motif { transform: translate(6px, -5px); }
[data-motif="lanes"].tile:hover .motif { background-position: 0 14%, -104px 28%, 0 42%; transform: none; }

.meta { display: flex; justify-content: start; align-items: center; gap: .5rem; }
.cat {
  font: 500 .66rem/1 var(--font-mono); letter-spacing: .1em; text-transform: uppercase;
  padding: .38em .7em; border: 1.5px solid currentColor; border-radius: 999px;
}

h2 { margin: 0; align-self: end; }
button {
  all: unset; cursor: pointer; display: block;
  font-family: var(--font-display); font-weight: 400; line-height: .92;
  font-size: clamp(1.1rem, min(12cqi, 24cqh), 5.6rem);
  text-wrap: balance; hyphens: auto;
  text-shadow: 0 0 0 var(--ink2);
  transition: text-shadow .3s cubic-bezier(.3, 1.6, .5, 1);
}
button::after { content: ""; position: absolute; inset: 0; z-index: 1; }
.tile:hover button, button:focus-visible { text-shadow: .06em .05em 0 var(--ink2); }
.tile[data-ink="pink"]:hover button { text-shadow: .06em .05em 0 var(--on-dark); }

ol { list-style: none; margin: 0; padding: 0; display: grid; gap: .22rem;
  font-size: clamp(.78rem, 4cqi, 1rem); font-weight: 600; }
li { display: grid; grid-template-columns: 2.4ch 1fr; align-items: baseline; }
li:nth-child(n + 2) { display: none; }
.rank { font: 500 .78em/1 var(--font-mono); }
li:first-child { font-size: 1.12em; }
@container tile (min-height: 330px) and (min-width: 230px) {
  li:nth-child(n + 2) { display: grid; }
  li:first-child { padding-block-end: .25rem; margin-block-end: .2rem; border-block-end: 1.5px dashed currentColor; }
}
@container tile (max-height: 150px) { .cat { display: none; } }
@keyframes settle { from { transform: translateY(14px) scale(.97) rotate(.6deg); } }
@media (prefers-reduced-motion: reduce) {
  .tile, .motif, button { animation: none; transition: none; }
}
`);

const tileMarkup = /* html */ `
<article class="tile" lang="en">
  <div class="motif-box" aria-hidden="true"><div class="motif"></div></div>
  <header class="meta">
    <span class="cat"></span>
  </header>
  <h2><button type="button" aria-haspopup="dialog"></button></h2>
  <ol role="list"></ol>
</article>`;

/** One genre plate on the board. Dispatches `t5-open` when activated. */
export class T5Tile extends HTMLElement {
  #genre: Genre | null = null;
  readonly #root: ShadowRoot;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    this.#root.adoptedStyleSheets = [tileStyles];
    this.#root.append(fragment(tileMarkup));
    this.#button.addEventListener('click', () => this.#open());
  }

  get genre(): Genre | null { return this.#genre; }
  set genre(value: Genre | null) {
    this.#genre = value;
    this.#render();
  }

  override focus(options?: FocusOptions): void { this.#button.focus(options); }

  get #button(): HTMLButtonElement {
    return this.#root.querySelector('button') as HTMLButtonElement;
  }

  #open(): void {
    if (!this.#genre) return;
    this.dispatchEvent(new CustomEvent('t5-open', {
      bubbles: true, composed: true,
      detail: { id: this.#genre.id, origin: centerOf(this) },
    }));
  }

  #render(): void {
    const g = this.#genre;
    if (!g) return;
    const article = this.#root.querySelector('article') as HTMLElement;
    article.dataset['ink'] = g.ink;
    article.dataset['motif'] = g.motif;
    this.setAttribute('area', g.area);
    (this.#root.querySelector('.cat') as HTMLElement).textContent = g.category;
    this.#button.textContent = g.title;
    this.#button.setAttribute('aria-label', `Top 5 ${g.title}. Number one: ${g.picks[0].name}`);

    const list = this.#root.querySelector('ol') as HTMLOListElement;
    list.replaceChildren(...g.picks.map((p, i) => {
      const li = el('li');
      li.append(el('span', { class: 'rank', 'aria-hidden': 'true' }, String(i + 1)), el('span', {}, p.name));
      return li;
    }));
  }
}

customElements.define('t5-tile', T5Tile);
