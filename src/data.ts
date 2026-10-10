/** Riso ink names. Each maps to a token in page.css and a fg/overprint pairing in tile styles. */
export type Ink = 'blue' | 'orange' | 'purple' | 'yellow' | 'pink' | 'teal' | 'green' | 'red';

/** Background motif. Each one is drawn from the genre's own world (record grooves, road lanes, a board). */
export type Motif = 'halftone' | 'zigzag' | 'stars' | 'record' | 'glyph' | 'lanes' | 'scallop' | 'checker';

/** Named grid area on the board. Board layouts in page.css place tiles by these names. */
export type Area = 'soul' | 'taco' | 'scif' | 'hiph' | 'type' | 'road' | 'snkr' | 'game';

export interface Pick {
  readonly name: string;
  readonly note: string;
}

export type FivePicks = readonly [Pick, Pick, Pick, Pick, Pick];

export interface Genre {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly ink: Ink;
  readonly motif: Motif;
  readonly area: Area;
  readonly picks: FivePicks;
}

export interface Point {
  readonly x: number;
  readonly y: number;
}

export type StepDir = -1 | 1;

export interface OpenDetail {
  readonly id: string;
  readonly origin: Point;
}

declare global {
  interface HTMLElementEventMap {
    't5-open': CustomEvent<OpenDetail>;
    't5-random': CustomEvent<{ readonly origin: Point }>;
    't5-step': CustomEvent<{ readonly dir: StepDir }>;
  }
}

/** Placeholder rankings. Swap for real data; the shape is the contract. */
export const GENRES: readonly Genre[] = [
  {
    id: 'soul-singers', title: 'Soul Singers', category: 'Music', ink: 'blue', motif: 'halftone', area: 'soul',
    picks: [
      { name: 'Aretha Franklin', note: 'Queen. Not up for debate.' },
      { name: 'Otis Redding', note: 'Try a Little Tenderness, every time.' },
      { name: 'Sam Cooke', note: 'The template everyone traced.' },
      { name: 'Marvin Gaye', note: "What's Going On still asks the question." },
      { name: 'Nina Simone', note: 'Refuses every category, including this one.' },
    ],
  },
  {
    id: 'tacos', title: 'Tacos', category: 'Food', ink: 'orange', motif: 'zigzag', area: 'taco',
    picks: [
      { name: 'Al pastor', note: 'Off the trompo, with a sliver of pineapple.' },
      { name: 'Birria', note: 'Dunk it. Consommé is mandatory.' },
      { name: 'Carnitas', note: 'Crispy edges or nothing.' },
      { name: 'Baja fish', note: 'Beer batter, cabbage, crema.' },
      { name: 'Carne asada', note: 'Simple, charred, reliable.' },
    ],
  },
  {
    id: 'sci-fi-films', title: 'Sci‑Fi Films', category: 'Film', ink: 'purple', motif: 'stars', area: 'scif',
    picks: [
      { name: 'Blade Runner', note: 'The rain, the neon, the tears.' },
      { name: 'Arrival', note: 'A first-contact film about grief.' },
      { name: 'Alien', note: 'A haunted house with a cargo manifest.' },
      { name: '2001: A Space Odyssey', note: 'Still ahead of us.' },
      { name: 'Children of Men', note: 'That one long take.' },
    ],
  },
  {
    id: 'hip-hop-albums', title: 'Hip‑Hop Albums', category: 'Music', ink: 'yellow', motif: 'record', area: 'hiph',
    picks: [
      { name: 'Illmatic', note: 'Ten tracks, no skips.' },
      { name: 'The Low End Theory', note: 'Jazz bass, perfect pocket.' },
      { name: 'Madvillainy', note: 'Two-minute masterpieces.' },
      { name: 'Aquemini', note: 'Atlanta, fully formed.' },
      { name: 'Ready to Die', note: 'Storytelling at its peak.' },
    ],
  },
  {
    id: 'typefaces', title: 'Typefaces', category: 'Design', ink: 'pink', motif: 'glyph', area: 'type',
    picks: [
      { name: 'Futura', note: 'Went to the moon. Literally.' },
      { name: 'Akzidenz‑Grotesk', note: 'Helvetica before Helvetica.' },
      { name: 'Garamond', note: 'Five centuries and counting.' },
      { name: 'Cooper Black', note: 'Warm, round, a little goofy.' },
      { name: 'Gill Sans', note: 'The London Underground in a font.' },
    ],
  },
  {
    id: 'road-trip-songs', title: 'Road Trip Songs', category: 'Music', ink: 'teal', motif: 'lanes', area: 'road',
    picks: [
      { name: 'Fast Car', note: 'Tracy Chapman, windows down.' },
      { name: 'Born to Run', note: 'Built for highway on-ramps.' },
      { name: 'Running Down a Dream', note: 'The guitar outro does the driving.' },
      { name: 'Go Your Own Way', note: 'Every passenger sings this one.' },
      { name: 'Ramble On', note: 'Good for mile 300.' },
    ],
  },
  {
    id: 'sneakers', title: 'Sneakers', category: 'Style', ink: 'green', motif: 'scallop', area: 'snkr',
    picks: [
      { name: 'Air Jordan 1', note: 'Chicago colorway.' },
      { name: 'Adidas Samba', note: 'Gum sole, forever.' },
      { name: 'Nike Air Max 1', note: 'The visible air bubble that started it.' },
      { name: 'New Balance 990', note: 'Grey suede, dad approved.' },
      { name: 'Converse Chuck 70', note: 'Goes with everything.' },
    ],
  },
  {
    id: 'board-games', title: 'Board Games', category: 'Games', ink: 'red', motif: 'checker', area: 'game',
    picks: [
      { name: 'Wingspan', note: 'Birds, engines, quiet joy.' },
      { name: 'Codenames', note: 'Best with a loud table.' },
      { name: 'Catan', note: 'Wood for sheep, anyone?' },
      { name: 'Ticket to Ride', note: 'The gateway game.' },
      { name: 'Azul', note: 'Pretty tiles, sharp elbows.' },
    ],
  },
];
