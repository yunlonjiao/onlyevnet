import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

const svg=color=>'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="'+color+'"/></svg>');
const legacyProject={
  eventName:'星海同人祭',description:'旧版 04 的活动介绍',
  creators:[{id:'c1',name:'浮光工房',booth:'A01',tags:['原创']},{id:'c2',name:'月见社',booth:'A02',tags:[]}],
  products:[{id:'p1',creatorId:'c1',name:'星空画集',price:'¥45'},{id:'p2',creatorId:'c2',name:'春日明信片',price:'¥20'}],
  maps:[{title:'一层',image:svg('#3366cc')},{title:'二层',image:svg('#cc3366')}]
};

async function openStudio(page,project,seed){
  if(seed){
    await page.goto('/v8/render.html');
    await page.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),['onlyevent-studio-v8:04-creator-catalogue:'+project+':iframe',seed]);
  }
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/v8/?template=04-creator-catalogue&project='+project);
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.cc-site .cb-book')).toBeAttached();
  return {frame,errors};
}

test('04 runs on the shared Studio with the catalogue on its homepage',async({page})=>{
  const {frame,errors}=await openStudio(page,'cat-pages');
  await expect(page.locator('#workspaceTemplateName')).toHaveText('创作者场刊');
  for(const row of ['activities','guests'])await expect(page.locator('[data-page-row="'+row+'"]')).toBeHidden();
  await expect(page.locator('#createCustomPageBtn')).toBeHidden();
  await expect(frame.locator('.cb-kind-cover')).toHaveCount(1);
  await expect(frame.locator('[data-catalogue-count]')).toHaveText(/^封面 \/ \d+$/);
  expect(errors).toEqual([]);
});

test('04 catalogue turns pages, jumps from the contents and has circle cuts',async({page})=>{
  const {frame}=await openStudio(page,'cat-flip');
  await frame.locator('[data-catalogue-step="1"]').click();
  await expect(frame.locator('.cb-kind-contents')).toBeVisible();
  await expect(frame.locator('[data-catalogue-count]')).toHaveText(/^2-3 \//);
  await frame.locator('.cb-contents button').filter({hasText:'参展社团'}).click();
  await expect(frame.locator('.cb-cut')).toHaveCount(3);
  await expect(frame.locator('.cb-cut .cb-space').first()).toHaveText('A01');
  await expect(frame.locator('.cb-leaf')).toHaveCount(0);
  await frame.locator('[data-catalogue-step="-1"]').click();
  await expect(frame.locator('.cb-cut')).toHaveCount(0);
});

test('04 circle cuts and works open their editors',async({page})=>{
  const {frame}=await openStudio(page,'cat-edit');
  await frame.locator('[data-catalogue-step="1"]').click();
  await frame.locator('.cb-contents button').filter({hasText:'参展社团'}).click();
  await frame.locator('.cb-cut').first().click();
  await expect(page.locator('#inspector')).toContainText('浮光工房');
  await frame.locator('.cb-work').first().click();
  await expect(page.locator('#inspector')).toContainText('编辑制品');
});

test('old 04 projects migrate and keep every map in the catalogue and the map section',async({page})=>{
  const {frame,errors}=await openStudio(page,'cat-legacy',legacyProject);
  await expect(frame.locator('.hero-copy h1')).toHaveText('星海同人祭');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('onlyevent-studio-v8:04-creator-catalogue:cat-legacy:iframe')));
  expect(saved.booths.map(b=>b.products.map(p=>p.name))).toEqual([['星空画集'],['春日明信片']]);
  await frame.locator('[data-catalogue-step="1"]').click();
  await frame.locator('.cb-contents button').filter({hasText:'场地图'}).click();
  // the two map pages may sit on neighbouring spreads, so collect the map pictures while turning pages
  const seen=new Set();
  for(let i=0;i<3;i++){
    for(const src of await frame.locator('.cb-kind-map img').evaluateAll(list=>list.map(x=>x.getAttribute('src'))))seen.add(src);
    await frame.locator('[data-catalogue-step="1"]').click();
    await expect(frame.locator('.cb-leaf')).toHaveCount(0);
  }
  expect(seen.size).toBe(2);
  expect(errors).toEqual([]);
});

test('04 exported catalogue works on its own, as single pages on phones',async({page,browser})=>{
  await openStudio(page,'cat-export');
  const html=await page.evaluate(()=>new Promise(resolve=>{
    addEventListener('message',e=>{if(e.data?.type==='OE_EXPORT_HTML_RESULT')resolve(e.data.html)});
    document.querySelector('#liveFrame').contentWindow.postMessage({type:'OE_EXPORT_HTML'},location.origin);
  }));
  for(const [viewport,pattern] of [[{width:1440,height:900},/^2-3 \//],[{width:390,height:844},/^2 \//]]){
    const visitor=await browser.newPage({viewport});
    const errors=[];visitor.on('pageerror',e=>errors.push(e.message));
    await visitor.setContent(html);
    await visitor.evaluate(()=>document.querySelector('#skip')?.click());
    await visitor.evaluate(()=>document.querySelector('[data-catalogue-step="1"]').click());
    await expect(visitor.locator('[data-catalogue-count]')).toHaveText(pattern);
    await expect(visitor.locator('.cb-book.is-single')).toHaveCount(viewport.width<760?1:0);
    expect(errors).toEqual([]);
    await visitor.close();
  }
});
