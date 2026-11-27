import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('../v8/styles.css', import.meta.url));
const css = readFileSync(file, 'utf8');
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
const buckets = new Map();
const selectors = [];
let total = 0;

for (const [, selector, body] of rules) {
  const count = (body.match(/!important/g) || []).length;
  if (!count) continue;
  total += count;
  const clean = selector.trim().replace(/\s+/g, ' ');
  const bucket = clean.includes('#mNativeApp .inspector') ? 'mobile-inspector'
    : clean.includes('#mNativeApp') ? 'mobile'
    : clean.includes('.studio-desktop .inspector') ? 'desktop-inspector'
    : clean.includes('.studio-desktop') ? 'desktop'
    : 'other';
  buckets.set(bucket, (buckets.get(bucket) || 0) + count);
  selectors.push({ count, selector: clean, bucket });
}

console.log(`total !important: ${total}`);
for (const [name, count] of [...buckets].sort((a, b) => b[1] - a[1])) {
  console.log(`${name}: ${count}`);
}
console.log('\ntop selectors:');
for (const row of selectors.sort((a, b) => b.count - a.count).slice(0, 15)) {
  console.log(`${row.count}\t${row.bucket}\t${row.selector.slice(0, 140)}`);
}
