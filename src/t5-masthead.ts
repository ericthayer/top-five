import { css, fragment, centerOf } from './dom.js';

const mastStyles = css(/* css */ `
:host { display: block; container: mast / size; min-inline-size: 0; min-block-size: 0; }
header {
  box-sizing: border-box; block-size: 100%; padding: clamp(10px, 3cqmin, 20px) clamp(4px, 2cqi, 16px);
  display: grid; grid-template-rows: auto 1fr auto; gap: .5rem; color: var(--ink);
  font-family: var(--font-body);
}
.kicker { margin: 0; font: 500 .68rem/1.3 var(--font-mono); letter-spacing: .12em; text-transform: uppercase;
  display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
h1 { margin: 0; display: flex; align-items: center; justify-content: center; gap: 2cqi; min-block-size: 0;
  font-family: var(--font-display); font-weight: 400; line-height: .78; }
.top { writing-mode: vertical-rl; transform: rotate(180deg); font-size: clamp(1.6rem, min(15cqi, 17cqh), 6rem);
  letter-spacing: .02em; color: var(--ink); }
.five { position: relative; isolation: isolate; font-size: clamp(6rem, min(74cqh, 72cqi), 30rem); color: var(--riso-pink);
  animation: wobble 6s ease-in-out infinite; }
.five::before { content: "5"; position: absolute; inset: 0; z-index: -1; color: var(--riso-blue);
  transform: translate(.04em, .03em); }
.foot { display: flex; align-items: end; justify-content: space-between; gap: .75rem; flex-wrap: wrap; }
.blurb { margin: 0; max-inline-size: 26ch; font-size: clamp(.86rem, 3.4cqi, 1.05rem); line-height: 1.35; text-wrap: pretty; }
button {
  all: unset; cursor: pointer; display: inline-flex; align-items: center; gap: .5rem;
  font: 600 .9rem/1 var(--font-body); padding: .7rem 1rem .7rem .8rem; border-radius: 999px;
  background: var(--ink); color: var(--paper); transition: transform .3s cubic-bezier(.3, 1.6, .5, 1);
}
button:hover { transform: rotate(-3deg) scale(1.04); }
button:focus-visible { outline: 3px solid var(--riso-pink); outline-offset: 3px; }
svg { inline-size: 1.25rem; block-size: 1.25rem; }
button.rolling svg { animation: roll .6s cubic-bezier(.3, 1.4, .5, 1); }
@container mast (max-height: 300px) { .blurb { display: none; } }
@keyframes wobble { 50% { transform: rotate(-2.5deg) translateY(-1.5%); } }
@keyframes roll { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .five, button.rolling svg { animation: none; } button { transition: none; } }
`);

const mastMarkup = /* html */ `
<header>
  <p class="kicker"><span>Vol. 01</span><span>Ranked, then re‑ranked</span></p>
  <h1><span class="top">Top</span><span class="five">5</span></h1>
  <div class="foot">
    <p class="blurb">Eight obsessions, five picks each. Tap any tile for the full ranking.</p>
    <button type="button" aria-haspopup="dialog">
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4"/>
        <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor"/>
        <circle cx="12" cy="12" r="1.3" fill="currentColor"/>
      </svg>
      Surprise me
    </button>
  </div>
</header>`;

/** Board title plate. Dispatches `t5-random` from its dice button. */
export class T5Masthead extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [mastStyles];
    root.append(fragment(mastMarkup));
    const dice = root.querySelector('button') as HTMLButtonElement;
    dice.addEventListener('click', () => {
      dice.classList.remove('rolling');
      void dice.offsetWidth;
      dice.classList.add('rolling');
      this.dispatchEvent(new CustomEvent('t5-random', {
        bubbles: true, composed: true, detail: { origin: centerOf(dice) },
      }));
    });
  }
}

customElements.define('t5-masthead', T5Masthead);
