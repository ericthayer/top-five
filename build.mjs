// Compiles nothing itself: run `tsc` first. Inlines page.css and the dist/ ES modules
// (in dependency order) into one standalone index.html for publishing.
import { readFileSync, writeFileSync } from 'node:fs';

const order = ['dom', 'data', 'ink.styles', 't5-tile', 't5-masthead', 't5-sheet', 't5-board', 'main'];
const strip = (src) => src
  .split('\n')
  .filter((l) => !/^import\s/.test(l) && !/^export\s*\{\s*\};?$/.test(l))
  .map((l) => l.replace(/^export\s+/, ''))
  .join('\n');

const modules = order.map((n) => `// ---- ${n}.ts\n${strip(readFileSync(`dist/${n}.js`, 'utf8'))}`).join('\n');
const html = readFileSync('src/index.template.html', 'utf8')
  .replace('/*@page.css*/', () => readFileSync('src/page.css', 'utf8'))
  .replace('/*@modules*/', () => modules);
writeFileSync('index.html', html);
console.log(`index.html ${(html.length / 1024).toFixed(1)} KB`);
