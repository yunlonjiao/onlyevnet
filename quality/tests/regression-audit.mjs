import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const BASE = 'https://onlyevent.cn';
const OUT = 'C:/Users/32224/Documents/deepseek-harness/default-workspace/oe-review/audit-2026-11-25';
const IMG = fileURLToPath(new URL('../fixtures/site-shot.png', import.meta.url));
const results = [];
const run = async (name, fn) => {
  const started = Date.now();
  try { const detail = await fn(); results.push({ name, pass: true, ms: Date.now() - started, detail: detail || '' }); console.log('PASS', name, detail || ''); }
  catch (error) { results.push({ name, pass: false, ms: Date.now() - started, detail: String(error).slice(0, 500) }); console.log('FAIL', name, String(error).slice(0, 300)); }
};
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Users\\32224\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe'
});

// Mobile helpers
async function mobilePage(project) {
  const context = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage();
  page.setDefaultTimeout(18000);
  await page.goto(`${BASE}/v8/?template=01-ip-only&project=${project}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6500);
  return { context, page };
}
async function openHomeContent(page) {
  await page.evaluate(() => document.querySelector('#mNativeApp .page-tree-row [data-page="home"]')?.click());
  await page.waitForTimeout(450);
}
async function clickContentText(page, text) {
  await page.evaluate((t) => {
    const b = [...document.querySelectorAll('#mNativeApp #pageContentNav button')].find((x) => x.textContent.includes(t));
    b?.click();
  }, text);
  await page.waitForTimeout(650);
}
async function openFirstItem(page) {
  await page.evaluate(() => document.querySelector('#mNativeApp .sidebar-content-rows .sidebar-content-row, #mNativeApp [data-open-item]')?.click());
  await page.waitForTimeout(700);
}

// 1. mobile shell geometry + back view bar
await run('mobile: 68/32 + fullscreen fields + view bar', async () => {
  const { context, page } = await mobilePage('suite-shell');
  try {
    const initial = await page.evaluate(() => ({
      app: Math.round(document.querySelector('#mNativeApp').getBoundingClientRect().height),
      canvas: Math.round(document.querySelector('.canvas-wrap').getBoundingClientRect().height),
      topbar: getComputedStyle(document.querySelector('.studio-topbar')).display
    }));
    assert(Math.abs(initial.app - 272) <= 4, `drawer ${initial.app} not 32dvh`);
    assert(initial.canvas >= 570, `site ${initial.canvas} too short`);
    assert(initial.topbar === 'none', 'old topbar visible');
    await openHomeContent(page);
    await clickContentText(page, '基本信息');
    const fields = await page.evaluate(() => ({
      app: Math.round(document.querySelector('#mNativeApp').getBoundingClientRect().height),
      canvas: getComputedStyle(document.querySelector('.canvas-wrap')).display
    }));
    assert(fields.app >= 840, `fields app ${fields.app}, expected full`);
    assert(fields.canvas === 'none', 'canvas visible behind fullscreen fields');
    await page.click('#mNativeApp [data-mn-back]');
    await page.waitForTimeout(300);
    await page.click('#mNativeApp [data-mn-back]');
    await page.waitForTimeout(300);
    await page.click('#mNativeApp [data-mn-back]');
    await page.waitForTimeout(450);
    const view = await page.evaluate(() => ({
      hidden: document.querySelector('#mNativeApp').hidden,
      bar: !document.querySelector('#mnViewBar')?.hidden,
      topbar: getComputedStyle(document.querySelector('.studio-topbar')).display,
      edit: document.querySelector('#mnViewBar [data-view-edit]')?.textContent.trim()
    }));
    assert(view.hidden && view.bar, 'view bar not shown after root back');
    assert(view.topbar === 'none', 'old topbar visible in view mode');
    assert(view.edit === '编辑', 'view edit label missing');
    return JSON.stringify({ initial, fields, view });
  } finally { await context.close(); }
});

// 2. custom page preset / settings / items / return
await run('mobile: custom page preset and cards', async () => {
  const { context, page } = await mobilePage('suite-custom');
  try {
    await page.click('#createCustomPageBtn');
    await page.waitForTimeout(650);
    await page.evaluate(() => document.querySelector('[data-custom-page-preset]')?.click());
    await page.waitForTimeout(900);
    const title = await page.evaluate(() => document.querySelector('#mNativeApp [data-mn-title]')?.textContent);
    assert(title === '页面', `after preset title ${title}`);
    const row = await page.evaluate(() => [...document.querySelectorAll('#mNativeApp .page-tree-row [data-page]')].find((b) => /自定义/.test(b.textContent))?.dataset.page || '');
    assert(row, 'custom page row missing');
    await page.evaluate((key) => document.querySelector(`#mNativeApp .page-tree-row [data-page="${key}"]`)?.click(), row);
    await page.waitForTimeout(600);
    const cards = await page.evaluate(() => [...document.querySelectorAll('#mNativeApp [data-custom-page-nav]')].map((b) => b.textContent.trim()));
    assert(cards.length === 2, `cards ${cards}`);
    await page.evaluate(() => document.querySelector('#mNativeApp [data-custom-page-nav="settings"]')?.click());
    await page.waitForTimeout(700);
    const settings = await page.evaluate(() => ({ title: document.querySelector('#mNativeApp [data-mn-title]')?.textContent, fields: !!document.querySelector('#mNativeApp .inspector-body') }));
    assert(settings.fields, 'settings did not open fields');
    await page.click('#mNativeApp [data-mn-back]');
    await page.waitForTimeout(400);
    await page.evaluate(() => document.querySelector('#mNativeApp [data-custom-page-nav="items"]')?.click());
    await page.waitForTimeout(700);
    const items = await page.evaluate(() => ({ title: document.querySelector('#mNativeApp [data-mn-title]')?.textContent, rows: document.querySelectorAll('#mNativeApp .sidebar-content-rows .sidebar-content-row').length }));
    assert(items.rows > 0, 'custom items list empty');
    return JSON.stringify({ title, cards, settings: settings.title, items });
  } finally { await context.close(); }
});

// 3. social list one scroll + add visible + section count separated
await run('mobile: social items layout', async () => {
  const { context, page } = await mobilePage('suite-social');
  try {
    await openHomeContent(page);
    await clickContentText(page, '社群');
    const data = await page.evaluate(() => {
      const add = document.querySelector('#mNativeApp .sidebar-content-add');
      const screen = [...document.querySelectorAll('#mNativeApp .mn-screen')].pop();
      const head = document.querySelector('#mNativeApp .sidebar-content-head');
      const b = head?.querySelector('b');
      const span = head?.querySelector('span');
      return {
        add: add ? { text: add.textContent.trim(), w: Math.round(add.getBoundingClientRect().width), h: Math.round(add.getBoundingClientRect().height) } : null,
        screenOverflow: getComputedStyle(screen).overflowY,
        listOverflow: getComputedStyle(document.querySelector('#mNativeApp .sidebar-content-list')).overflowY,
        rowsOverflow: getComputedStyle(document.querySelector('#mNativeApp .sidebar-content-rows')).overflowY,
        gap: b && span ? Math.round(span.getBoundingClientRect().left - b.getBoundingClientRect().right) : null
      };
    });
    assert(data.add, 'add button missing');
    assert(data.add.w > 300, `add button width ${data.add.w}`);
    assert(data.listOverflow === 'visible' && data.rowsOverflow === 'visible', 'nested scrollbars remain');
    assert(data.gap > 8, `section title/count gap ${data.gap}`);
    return JSON.stringify(data);
  } finally { await context.close(); }
});

// 4. ticket image: upload then remove without leaving inspector
await run('mobile: image upload and remove refresh', async () => {
  const { context, page } = await mobilePage('suite-image');
  try {
    await openHomeContent(page);
    await clickContentText(page, '票务');
    await openFirstItem(page);
    await page.evaluate(() => {
      const input = document.querySelector('#imageInput');
      input.dataset.path = 'tickets.0.image';
      input.dataset.returnCollection = 'tickets';
      input.dataset.returnIndex = '0';
    });
    await page.setInputFiles('#imageInput', IMG);
    await page.waitForTimeout(1500);
    assert(await page.evaluate(() => document.querySelector('#imageCropDialog').open), 'crop did not open');
    await page.click('#cropApply');
    await page.waitForTimeout(4500);
    const uploaded = await page.evaluate(() => ({
      image: !!document.querySelector('#mNativeApp .item-media img'),
      remove: !!document.querySelector('#mNativeApp [data-remove-media]')
    }));
    assert(uploaded.image, 'uploaded image did not appear in inspector');
    await page.click('#mNativeApp [data-remove-media]');
    await page.waitForTimeout(900);
    const removed = await page.evaluate(() => ({
      image: !!document.querySelector('#mNativeApp .item-media img'),
      remove: !!document.querySelector('#mNativeApp [data-remove-media]')
    }));
    assert(!removed.image, 'image stayed after remove');
    return JSON.stringify({ uploaded, removed });
  } finally { await context.close(); }
});

// 5. crop ratio, fixed selection, zoom
await run('mobile: crop ratio and zoom', async () => {
  const { context, page } = await mobilePage('suite-crop');
  try {
    const live = await page.evaluate(() => {
      const kv = document.querySelector('#liveFrame')?.contentDocument?.querySelector('.kv');
      if (!kv) return null;
      const r = kv.getBoundingClientRect();
      return { ratio: +(r.width / r.height).toFixed(3), w: Math.round(r.width), h: Math.round(r.height) };
    });
    await page.evaluate(() => {
      const input = document.querySelector('#imageInput');
      input.dataset.path = 'heroImage';
    });
    await page.setInputFiles('#imageInput', IMG);
    await page.waitForTimeout(1500);
    const crop = await page.evaluate(() => {
      const s = document.querySelector('cropper-selection');
      const r = s.getBoundingClientRect();
      const img = document.querySelector('cropper-image');
      return { ratio: +(r.width / r.height).toFixed(3), w: Math.round(r.width), h: Math.round(r.height), resizable: s.getAttribute('resizable'), movable: s.getAttribute('movable'), imageH: Math.round(img.getBoundingClientRect().height) };
    });
    if (live) assert(Math.abs(crop.ratio - live.ratio) < 0.03, `crop ${crop.ratio} vs live ${live.ratio}`);
    else assert(Math.abs(crop.ratio - 0.94) < 0.04, `crop ratio ${crop.ratio}`);
    assert(crop.resizable === null && crop.movable === null, 'selection still movable/resizable');
    for (let i = 0; i < 3; i++) { await page.click('#cropZoomOut'); await page.waitForTimeout(180); }
    const after = await page.evaluate(() => Math.round(document.querySelector('cropper-image').getBoundingClientRect().height));
    assert(after < crop.imageH, `zoom out did not shrink image ${crop.imageH}->${after}`);
    return JSON.stringify({ live, crop, after });
  } finally { await context.close(); }
});

// 6. media controls: no empty plus, label on one line, remove red
await run('mobile: media controls and labels', async () => {
  const { context, page } = await mobilePage('suite-media');
  try {
    await openHomeContent(page);
    await clickContentText(page, '票务');
    await openFirstItem(page);
    const data = await page.evaluate(() => {
      const empty = document.querySelector('#mNativeApp .item-media-empty');
      const label = document.querySelector('#mNativeApp .item-media>span');
      const remove = document.querySelector('#mNativeApp [data-remove-media]');
      return {
        emptyDisplay: empty ? getComputedStyle(empty).display : 'none',
        labelWidth: label ? Math.round(label.getBoundingClientRect().width) : 0,
        labelLines: label ? Math.round(label.getBoundingClientRect().height / parseFloat(getComputedStyle(label).lineHeight || '16')) : 0,
        removeColor: remove ? getComputedStyle(remove).color : null
      };
    });
    assert(data.emptyDisplay === 'none', 'extra empty plus visible');
    assert(data.labelWidth >= 96, `label width ${data.labelWidth}`);
    assert(data.labelLines <= 1, `label wraps ${data.labelLines} lines`);
    if (data.removeColor) assert(/194|183|199/.test(data.removeColor), `remove not red ${data.removeColor}`);
    return JSON.stringify(data);
  } finally { await context.close(); }
});

// 7. featured slot one plus and gaps
await run('mobile: featured slot single plus', async () => {
  const { context, page } = await mobilePage('suite-featured');
  try {
    await openHomeContent(page);
    await clickContentText(page, '活动精选');
    await openFirstItem(page);
    const data = await page.evaluate(() => {
      const empty = [...document.querySelectorAll('#mNativeApp .item-media-empty')].filter((e) => getComputedStyle(e).display !== 'none');
      const media = document.querySelector('#mNativeApp .featured-slot-panel .item-media');
      const buttons = [...document.querySelectorAll('#mNativeApp .featured-slot-panel .item-media-row button')].map((b) => b.textContent.trim());
      return { empty: empty.length, buttons, media: !!media };
    });
    assert(data.empty === 0, `${data.empty} empty plus boxes visible`);
    assert(data.buttons.length <= 1, `too many buttons ${JSON.stringify(data.buttons)}`);
    return JSON.stringify(data);
  } finally { await context.close(); }
});

// 8. guest checkbox size + presets 4 columns + guest type removed
await run('mobile: guest checks and activity presets', async () => {
  const { context, page } = await mobilePage('suite-guests');
  try {
    await page.evaluate(() => document.querySelector('#mNativeApp .page-tree-row [data-page="guests"]')?.click());
    await page.waitForTimeout(500);
    await page.evaluate(() => document.querySelector('#mNativeApp #pageContentNav button')?.click());
    await page.waitForTimeout(500);
    await openFirstItem(page);
    const data = await page.evaluate(() => {
      const cb = document.querySelector('#mNativeApp .check-row input[type=checkbox]');
      return { check: cb ? { w: getComputedStyle(cb).width, h: getComputedStyle(cb).height } : null, guestType: !!document.querySelector('#mNativeApp .guest-type-panel') };
    });
    if (data.check) assert(data.check.w === '18px' && data.check.h === '18px', `checkbox ${JSON.stringify(data.check)}`);
    assert(!data.guestType, 'guest type panel still exists');
    await page.evaluate(() => document.querySelector('#mNativeApp .page-tree-row [data-page="activities"]')?.click());
    await page.waitForTimeout(500);
    await page.evaluate(() => [...document.querySelectorAll('#mNativeApp #pageContentNav button')].find((b) => b.dataset.pageContentManager === 'participation')?.click());
    await page.waitForTimeout(600);
    const preset = await page.evaluate(() => {
      const grid = document.querySelector('#mNativeApp .preset-add>div');
      return grid ? { cols: getComputedStyle(grid).gridTemplateColumns, btnW: Math.round(grid.querySelector('button')?.getBoundingClientRect().width || 0) } : null;
    });
    assert(preset, 'activity presets missing');
    assert(preset.cols.split(' ').length === 4, `activity preset columns ${preset.cols}`);
    return JSON.stringify({ data, preset });
  } finally { await context.close(); }
});

// 9. guide traffic label/one hint
await run('mobile: guide image label', async () => {
  const { context, page } = await mobilePage('suite-guide');
  try {
    await page.evaluate(() => document.querySelector('#mNativeApp .page-tree-row [data-page="guide"]')?.click());
    await page.waitForTimeout(500);
    await page.evaluate(() => document.querySelector('#mNativeApp #pageContentNav button')?.click());
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const rows = [...document.querySelectorAll('#mNativeApp .sidebar-content-rows .sidebar-content-row')];
      const row = rows.find((b) => /交通|到达/.test(b.textContent)) || rows[0];
      row?.click();
    });
    await page.waitForTimeout(700);
    const text = await page.evaluate(() => document.querySelector('#mNativeApp .inspector-body')?.innerText.slice(0, 300));
    assert(/路线图|入口示意/.test(text || ''), 'guide image label missing');
    return (text || '').replace(/\n/g, ' | ').slice(0, 160);
  } finally { await context.close(); }
});

// 10. template previews all load sample content, no loader
await run('templates: all eight preview pages', async () => {
  const context = await browser.newContext({ viewport: { width: 900, height: 700 } });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const ids = ['01-ip-only','02-scrapbook','03-creator-market','04-creator-catalogue','05-live-poster','06-band-live','07-tea-party','08-birthday'];
  const details = [];
  try {
    for (const id of ids) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try { await page.goto(`${BASE}/v8/preview.html?template=${id}&project=default&embed=1`, { waitUntil: 'domcontentloaded' }); break; }
        catch (error) { if (attempt === 1) throw error; await page.waitForTimeout(1500); }
      }
      await page.waitForFunction(() => {
        const doc = document.querySelector('#previewFrame')?.contentDocument;
        const text = (doc?.body?.innerText || '').trim();
        return text.length > 5 && !/Loading preview/.test(text);
      }, null, { timeout: 25000 });
      const data = await page.evaluate(() => {
        const doc = document.querySelector('#previewFrame')?.contentDocument;
        return { text: (doc?.body?.innerText || '').trim().slice(0, 40), loading: /Loading preview/.test(doc?.body?.innerText || '') };
      });
      assert(data.text.length > 5 && !data.loading, `${id} preview empty/loading`);
      details.push({ id, text: data.text.replace(/\n/g, ' ') });
    }
    return JSON.stringify(details);
  } finally { await context.close(); }
});

// 11. desktop editor remains desktop
await run('desktop: editor layout unchanged', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/v8/?template=01-ip-only&project=suite-desktop`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  const data = await page.evaluate(() => ({
    native: !!document.querySelector('#mNativeApp'),
    sidebar: Math.round(document.querySelector('.sidebar')?.getBoundingClientRect().width || 0),
    inspector: Math.round(document.querySelector('.inspector')?.getBoundingClientRect().width || 0),
    topbar: getComputedStyle(document.querySelector('.studio-topbar')).display
  }));
  assert(!data.native, 'mobile shell present on desktop');
  assert(data.sidebar >= 200 && data.inspector >= 280, `desktop widths ${JSON.stringify(data)}`);
  assert(data.topbar !== 'none', 'desktop topbar hidden');
  await page.screenshot({ path: `${OUT}/desktop-check.png` });
  await context.close();
  return JSON.stringify(data);
});

// 12. responsive 320 page grid and fields
await run('mobile 320: page grid and fields fit', async () => {
  const context = await browser.newContext({ viewport: { width: 320, height: 568 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(`${BASE}/v8/?template=01-ip-only&project=suite-320`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6500);
  const data = await page.evaluate(() => {
    const app = document.querySelector('#mNativeApp');
    const grid = document.querySelector('#mNativeApp .page-nav');
    const cell = document.querySelector('#mNativeApp .page-tree-row');
    return { app: Math.round(app.getBoundingClientRect().height), grid: grid ? Math.round(grid.getBoundingClientRect().width) : 0, cell: cell ? Math.round(cell.getBoundingClientRect().width) : 0 };
  });
  assert(data.cell > 60, `320 page cell too narrow ${data.cell}`);
  await page.screenshot({ path: `${OUT}/mobile-320.png` });
  await context.close();
  return JSON.stringify(data);
});

// 13. template 08 no literal brace text
await run('template 08: no stray brace text', async () => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/v8/?template=08-birthday&project=suite-08`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6500);
  const data = await page.evaluate(() => {
    const doc = document.querySelector('#liveFrame')?.contentDocument;
    if (!doc) return { found: [] };
    const found = [];
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) if (/\}\)/.test(node.nodeValue || '')) found.push((node.nodeValue || '').trim().slice(0, 30));
    return { found };
  });
  assert(data.found.length === 0, `brace text ${JSON.stringify(data.found)}`);
  await context.close();
  return JSON.stringify(data);
});

// 14. 430 / 768 / landscape responsive checks
for (const view of [{ w: 430, h: 932, name: '430' }, { w: 768, h: 1024, name: '768' }]) {
  await run(`mobile ${view.name}: drawer and fields`, async () => {
    const context = await browser.newContext({ viewport: { width: view.w, height: view.h }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const page = await context.newPage();
    await page.goto(`${BASE}/v8/?template=01-ip-only&project=suite-${view.name}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6500);
    const data = await page.evaluate(() => ({
      app: Math.round(document.querySelector('#mNativeApp').getBoundingClientRect().height),
      cell: Math.round(document.querySelector('#mNativeApp .page-tree-row')?.getBoundingClientRect().width || 0)
    }));
    assert(Math.abs(data.app - parentDvh(view.h)) <= 4, `${view.name} drawer ${data.app}`);
    assert(data.cell > 80, `${view.name} page cell ${data.cell}`);
    await context.close();
    return JSON.stringify(data);
  });
}

await run('mobile landscape: shell still usable', async () => {
  const context = await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto(`${BASE}/v8/?template=01-ip-only&project=suite-landscape`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6500);
  const data = await page.evaluate(() => ({
    native: !!document.querySelector('#mNativeApp'),
    app: Math.round(document.querySelector('#mNativeApp')?.getBoundingClientRect().height || 0),
    canvas: Math.round(document.querySelector('.canvas-wrap')?.getBoundingClientRect().height || 0)
  }));
  assert(data.native, 'landscape not using mobile shell');
  assert(data.app > 100 && data.canvas > 200, `landscape sizes ${JSON.stringify(data)}`);
  await context.close();
  return JSON.stringify(data);
});
function parentDvh(h) { return Math.round(h * 0.32); }

// 17. repeated view/edit keeps one shell and stable sidebar
await run('mobile: repeated view/edit keeps DOM stable', async () => {
  const { context, page } = await mobilePage('suite-cycles');
  try {
    for (let i = 0; i < 6; i++) {
      await page.evaluate(() => document.querySelector('#mNativeApp [data-mn-back]')?.click());
      await page.waitForTimeout(220);
      await page.evaluate(() => document.querySelector('#mnViewBar [data-view-edit]')?.click());
      await page.waitForTimeout(220);
    }
    await page.evaluate(() => document.querySelector('#mNativeApp [data-mn-back]')?.click());
    await page.waitForTimeout(350);
    const data = await page.evaluate(() => {
      const sidebar = document.querySelector('.sidebar');
      return { apps: document.querySelectorAll('#mNativeApp').length, bars: document.querySelectorAll('#mnViewBar').length, sidebars: document.querySelectorAll('.sidebar').length, backdrop: sidebar ? getComputedStyle(sidebar).backdropFilter : null, view: document.body.classList.contains('m-native-view') };
    });
    assert(data.apps === 1 && data.bars === 1 && data.sidebars === 1, 'duplicates '+JSON.stringify(data));
    assert(data.view && data.backdrop === 'none', 'sidebar blur '+JSON.stringify(data));
    return JSON.stringify(data);
  } finally { await context.close(); }
});

await browser.close();
writeFileSync(`${OUT}/regression-results.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.pass);
console.log(`\nRESULT ${results.length - failed.length}/${results.length} passed, ${failed.length} failed`);
if (failed.length) console.log(failed.map((f) => `${f.name}: ${f.detail}`).join('\n'));
