import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const ROOT=resolve(process.cwd(),'..');
const STORAGE='onlyevent-studio-v8:01-ip-only:iframe';

async function loadState(page,mutator=()=>{}){
  await page.goto('/v8/');
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  await page.evaluate(async({storage,mutatorSource})=>{
    const mod=await import('/v8/templates/01-ip-only.js?v=qa-complete');
    const state=structuredClone(mod.template01.defaults);
    (0,eval)('('+mutatorSource+')')(state);
    localStorage.setItem(storage,JSON.stringify(state));
  },{storage:STORAGE,mutatorSource:mutator.toString()});
  await page.reload();
  await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
  return page.frameLocator('#liveFrame');
}

async function enterPreview(page,frame){
  await page.locator('#previewBtn').click();
  await expect(frame.locator('#loader')).toBeVisible();
  // Skip the optional entry sequence using the same handler as the visible skip button.
  // The assertion below concerns visitor controls, not animation playback timing.
  await frame.locator('#skip').evaluate(el=>el.click());
  await expect.poll(async()=>frame.locator('#loader').evaluate(el=>el.classList.contains('hide')),{timeout:5000}).toBe(true);
}

test('nav, CTA, tabs, search, map entry and external links are real interactions',async({page})=>{
  const frame=await loadState(page,s=>{
    s.ticketUrl='https://example.com/tickets';
    s.navigationUrl='https://example.com/venue';
    s.socialLinks=[{id:'sl1',label:'游客群',note:'测试',url:'https://example.com/community',image:''}];
    s.venueMap.links=[{id:'m1',label:'摊位区',target:'booths',itemType:'page',itemId:''}];
  });

  await frame.locator('.quick [data-page-link="booths"]').click();
  await expect(frame.locator('#booths')).toBeVisible();
  await frame.locator('#booths .section-back').click();
  await expect(frame.locator('.hero')).toBeVisible();

  await page.locator('.page-nav [data-page="booths"]').click();
  const tabs=frame.locator('#booths [role="tab"]');
  await expect(tabs).toHaveCount(2);
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected','true');
  await tabs.nth(0).click();
  const search=frame.locator('#booths [data-directory-search]');
  await search.fill('星屑工房');
  await expect(frame.locator('#booths [data-directory-card][data-kind="booth"]:visible')).toHaveCount(1);

  await page.locator('.page-nav [data-page="home"]').click();
  await expect(frame.locator('#map-home [data-page-link="booths"]').first()).toBeVisible();
  await enterPreview(page,frame);
  await frame.locator('#map-home [data-page-link="booths"]').first().click();
  await expect(frame.locator('#booths')).toBeVisible();
  await frame.locator('#booths .section-back').click();
  await expect(frame.locator('.hero')).toBeVisible();

  const ticket=frame.locator('a[href="https://example.com/tickets"]').first();
  await expect(ticket).toBeVisible();
  await expect(ticket).toHaveAttribute('target','_blank');
});

test('hover and keyboard focus produce visible state changes',async({page})=>{
  const frame=await loadState(page);
  const quick=frame.locator('.quick-card').first();
  const before=await quick.evaluate(el=>getComputedStyle(el).transform);
  await quick.hover();
  await page.waitForTimeout(250);
  const after=await quick.evaluate(el=>getComputedStyle(el).transform);
  expect(after).not.toBe(before);

  await page.locator('#previewBtn').click();
  await frame.locator('.gate').focus();
  const outline=await frame.locator('.gate').evaluate(el=>getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe('none');
});

test('visitor headings are meaningful and all content images have alt text',async({page})=>{
  const frame=await loadState(page,s=>{
    const data='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="gray"/></svg>');
    s.guests[0].image=data;
    s.booths[0].logo=data;
    s.booths[0].products[0].image=data;
    s.guide.items[0].image=data;
    s.venueMap.image=data;
  });
  const h1=frame.locator('h1');
  await expect(h1).toHaveCount(1);
  await expect(h1).not.toHaveText('');
  for(const pageName of ['home','booths','activities','guests','guide']){
    await page.locator('.page-nav [data-page="'+pageName+'"]').click();
    const missing=await frame.locator('img').evaluateAll(imgs=>imgs.filter(img=>!img.hasAttribute('alt')).length);
    expect(missing,'every img must have an alt attribute').toBe(0);
  }
});

test('visitor controls expose state without relying only on color',async({page})=>{
  const frame=await loadState(page);
  await page.locator('.page-nav [data-page="booths"]').click();
  await page.locator('#previewBtn').click();
  await frame.locator('.gate').click();
  await expect.poll(async()=>frame.locator('#loader').evaluate(el=>el.classList.contains('hide')),{timeout:5000}).toBe(true);
  const fav=frame.locator('#booths [data-favorite-booth]').first();
  await expect(fav).toHaveAttribute('aria-pressed','false');
  await fav.click();
  await expect(fav).toHaveAttribute('aria-pressed','true');
  await expect(fav).toContainText('已收藏');
});

test('same-origin assets do not return 404 and renderer has no runtime errors',async({page})=>{
  const failures=[];
  page.on('response',res=>{
    const u=new URL(res.url());
    if(u.origin==='http://127.0.0.1:4173'&&res.status()>=400)failures.push(res.status()+' '+u.pathname);
  });
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!/ERR_CONNECTION_REFUSED/.test(m.text()))errors.push(m.text())});
  const frame=await loadState(page);
  for(const key of ['home','booths','activities','guests','guide']){
    await page.locator('.page-nav [data-page="'+key+'"]').click();
    await expect(key==='home'?frame.locator('.hero'):frame.locator('#'+key)).toBeVisible();
  }
  expect(failures).toEqual([]);
  expect(errors).toEqual([]);
});

test('source has reduced-motion fallback, no autoplay video, and no unpinned latest dependency',async()=>{
  const preview=readFileSync(resolve(ROOT,'v8/templates/01-ip-only-preview.js'),'utf8');
  const runtime=readFileSync(resolve(ROOT,'v8/renderer/runtime-style.js'),'utf8');
  const motion=readFileSync(resolve(ROOT,'motion-resources.md'),'utf8');
  const pkg=readFileSync(resolve(ROOT,'quality/package.json'),'utf8');
  expect(preview+runtime).toContain('prefers-reduced-motion');
  expect(preview+runtime).not.toMatch(/<video[^>]*autoplay/i);
  expect(motion).toContain('Version pinned');
  expect(motion).toContain('License');
  expect(motion).not.toMatch(/(?:@|\/)(?:latest)(?:\b|["'])/i);
  expect(pkg).not.toMatch(/"[^"]+"\s*:\s*"latest"/i);
});

test('default page avoids infinite blur/filter animations and excessive web fonts',async({page})=>{
  const frame=await loadState(page);
  const audit=await frame.locator('html').evaluate(()=>{
    const nodes=[...document.querySelectorAll('*')];
    const animatedFilter=nodes.filter(el=>{
      const cs=getComputedStyle(el);
      return cs.animationName!=='none'&&cs.filter!=='none';
    }).length;
    const families=new Set(nodes.map(el=>getComputedStyle(el).fontFamily).filter(Boolean));
    return {animatedFilter,fontFamilies:[...families]};
  });
  expect(audit.animatedFilter).toBe(0);
  expect(audit.fontFamilies.length).toBeLessThanOrEqual(4);
});

test('missing external URLs give explicit non-dead-end feedback',async({page})=>{
  const frame=await loadState(page,s=>{
    s.ticketUrl='';
    s.navigationUrl='';
    s.socialLinks=[{id:'sl1',label:'游客群',note:'测试',url:'',image:''}];
  });
  await page.locator('.page-nav [data-page="home"]').click();
  await expect(frame.locator('#community .social-action.muted')).toContainText('未设置链接');
  await page.locator('.page-nav [data-page="guide"]').click();
  await expect(frame.locator('#guide .guide-venue-nav-empty')).toBeVisible();
  await expect(frame.locator('#guide .guide-venue-nav-empty')).toContainText('设置场馆导航');
});

test('no accidental admin or design-explanation copy leaks into visitor preview',async({page})=>{
  const frame=await loadState(page);
  await enterPreview(page,frame);
  const forbidden=['设计说明','开发说明','模板说明','这是某某风格','这个模板','复用统一数据','后台功能','模拟流程阶段'];
  const text=await frame.locator('body').innerText();
  for(const phrase of forbidden)expect(text).not.toContain(phrase);
});

test('mobile visitor CTA targets remain large enough to tap',async({page})=>{
  await page.setViewportSize({width:430,height:900});
  const frame=await loadState(page);
  await enterPreview(page,frame);
  const targets=frame.locator('.mobile-dock a:visible,.btn:visible,.quick-card:visible');
  const n=await targets.count();
  expect(n).toBeGreaterThan(0);
  for(let i=0;i<Math.min(n,8);i++){
    const b=await targets.nth(i).boundingBox();
    if(b)expect(Math.max(b.width,b.height)).toBeGreaterThanOrEqual(40);
  }
});
