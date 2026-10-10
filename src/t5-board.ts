import { el } from './dom.js';
import type { Genre, Point, StepDir } from './data.js';
import { T5Tile } from './t5-tile.js';
import { T5Sheet } from './t5-sheet.js';
import './t5-masthead.js';

/**
 * Page shell. Light DOM so page.css owns the bento grid and its container-query layouts.
 * Owns the only piece of state: which genre the sheet shows.
 */
export class T5Board extends HTMLElement {
  #genres: readonly Genre[] = [];
  #active = -1;
  #returnFocus: T5Tile | null = null;
  readonly #grid = el('main', { class: 'board-grid', 'aria-label': 'Top 5 genres' });
  readonly #sheet = document.createElement('t5-sheet') as T5Sheet;

  constructor() {
    super();
    this.addEventListener('t5-open', (e) => this.#open(this.#indexOf(e.detail.id), e.detail.origin));
    this.addEventListener('t5-random', (e) => this.#open(this.#randomIndex(), e.detail.origin, false));
    this.#sheet.addEventListener('t5-step', (e) => this.#step(e.detail.dir));
    this.#sheet.addEventListener('close', () => {
      this.#returnFocus?.focus();
      this.#active = -1;
    });
  }

  set genres(value: readonly Genre[]) {
    this.#genres = value;
    this.#render();
  }

  connectedCallback(): void {
    if (!this.#grid.isConnected) this.append(this.#grid, this.#sheet);
  }

  #render(): void {
    const tiles = this.#genres.map((g) => {
      const tile = document.createElement('t5-tile') as T5Tile;
      tile.genre = g;
      return tile;
    });
    this.#grid.replaceChildren(document.createElement('t5-masthead'), ...tiles);
  }

  #indexOf(id: string): number {
    return this.#genres.findIndex((g) => g.id === id);
  }

  #randomIndex(): number {
    const n = this.#genres.length;
    if (n < 2) return 0;
    if (this.#active < 0) return Math.floor(Math.random() * n);
    const pick = Math.floor(Math.random() * (n - 1));
    return pick >= this.#active ? pick + 1 : pick;
  }

  #tileAt(i: number): T5Tile | null {
    return this.#grid.querySelectorAll<T5Tile>('t5-tile')[i] ?? null;
  }

  #open(i: number, origin: Point, fromTile = true): void {
    const genre = this.#genres[i];
    if (!genre) return;
    if (!this.#sheet.isOpen) this.#returnFocus = fromTile ? this.#tileAt(i) : null;
    this.#active = i;
    const n = this.#genres.length;
    const prev = this.#genres[(i - 1 + n) % n] as Genre;
    const next = this.#genres[(i + 1) % n] as Genre;
    this.#sheet.show(genre, { index: i, total: n, prev, next }, origin);
  }

  #step(dir: StepDir): void {
    const n = this.#genres.length;
    const i = (this.#active + dir + n) % n;
    this.#returnFocus = this.#tileAt(i);
    this.#open(i, { x: dir > 0 ? window.innerWidth : 0, y: window.innerHeight / 2 });
  }
}

customElements.define('t5-board', T5Board);
