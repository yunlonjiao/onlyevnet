#!/usr/bin/env node
/**
 * Architecture guard for OnlyEvent.
 * Fails when a change adds a forbidden dependency or grows known structural debt.
 * Baselines may only be lowered: delete old rules instead of raising limits.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const BASELINE_IMPORTANT = 1325;
const BASELINE_GENERIC_INSPECTOR = 24;

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
};
const rel = (path) => path.replace(ROOT + '\\', '').replace(ROOT + '/', '').replaceAll('\\', '/');
const read = (path) => readFileSync(path, 'utf8');
const importsOf = (text) => [...text.matchAll(/(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g)].map((m) => m[1]);

const files = walk(ROOT);
const sourceFiles = files.filter((path) => /\.(js|mjs|html)$/.test(path) && rel(path).startsWith('v8/'));
const templateFiles = sourceFiles.filter((path) => rel(path).startsWith('v8/templates/'));
const rendererFiles = sourceFiles.filter((path) => rel(path).startsWith('v8/renderer/'));
const mobileFiles = sourceFiles.filter((path) => rel(path).startsWith('v8/mobile/'));
const desktopFiles = sourceFiles.filter((path) => rel(path).startsWith('v8/editor/') && !rel(path).startsWith('v8/editor/mobile/'));

const errors = [];
const warnings = [];

const forbidden = (filesList, test, label) => {
  for (const path of filesList) {
    const hit = importsOf(read(path)).find(test);
    if (hit) errors.push(`${label}: ${rel(path)} → ${hit}`);
  }
};

forbidden(templateFiles, (spec) => spec.includes('/v8/editor/') || spec.includes('/v8/app.js') || spec.includes('/v8/mobile/'), 'template must not import editor');
forbidden(rendererFiles, (spec) => spec.includes('/v8/editor/') || spec.includes('/v8/app.js'), 'renderer must not import editor');
forbidden(mobileFiles, (spec) => spec.includes('/v8/editor/desktop/'), 'mobile must not import desktop UI');
forbidden(desktopFiles, (spec) => spec.includes('/v8/mobile/'), 'desktop must not import mobile UI');

const templateStorage = templateFiles.filter((path) => /\blocalStorage\s*[.\[]/.test(read(path)));
for (const path of templateStorage) errors.push(`template must not access localStorage: ${rel(path)}`);

const css = read(join(ROOT, 'v8/styles.css'));
const important = (css.match(/!important/g) || []).length;
if (important > BASELINE_IMPORTANT) errors.push(`!important grew: ${important} > ${BASELINE_IMPORTANT}`);
if (important < BASELINE_IMPORTANT) warnings.push(`!important reduced: ${important} < ${BASELINE_IMPORTANT}; lower BASELINE_IMPORTANT`);

const genericSelectors = [];
const ruleRe = /([^{}]+)\{[^}]*\}/g;
let rule;
while ((rule = ruleRe.exec(css))) {
  for (const selector of rule[1].split(',').map((s) => s.trim())) {
    if (/^\.inspector(?:-body)?\b/.test(selector) && /(?:^|\s)(button|input|select|textarea|label)(?:\b|\[|:|$)/.test(selector)) genericSelectors.push(selector);
  }
}
if (genericSelectors.length > BASELINE_GENERIC_INSPECTOR) errors.push(`generic Inspector selectors grew: ${genericSelectors.length} > ${BASELINE_GENERIC_INSPECTOR}`);
if (genericSelectors.length < BASELINE_GENERIC_INSPECTOR) warnings.push(`generic Inspector selectors reduced: ${genericSelectors.length} < ${BASELINE_GENERIC_INSPECTOR}; lower baseline`);

console.log('OnlyEvent architecture check');
console.log(`  templates: ${templateFiles.length}`);
console.log(`  renderer: ${rendererFiles.length}`);
console.log(`  mobile: ${mobileFiles.length}`);
console.log(`  desktop: ${desktopFiles.length}`);
console.log(`  !important: ${important} (baseline ${BASELINE_IMPORTANT})`);
console.log(`  generic Inspector selectors: ${genericSelectors.length} (baseline ${BASELINE_GENERIC_INSPECTOR})`);

for (const message of warnings) console.log(`  warning: ${message}`);
if (errors.length) {
  for (const message of errors) console.error(`  error: ${message}`);
  process.exit(1);
}
console.log('  OK');
