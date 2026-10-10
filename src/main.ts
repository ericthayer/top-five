import { GENRES } from './data.js';
import type { T5Board } from './t5-board.js';
import './t5-board.js';

const board = document.querySelector('t5-board') as T5Board | null;
if (board) board.genres = GENRES;
