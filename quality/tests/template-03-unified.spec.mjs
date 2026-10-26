import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

const legacyProject={
  eventName:'夏日创作祭',description:'旧版 03 的活动介绍',date:'2027.07.20',location:'示例会展中心',
  ticketUrl:'https://tickets.example.com/summer',guide:'请提前 30 分钟到场。',
  creators:[{id:'c1',name:'浮光工房',booth:'A01',description:'原创插画',tags:['原创','画集'],image:''},{id:'c2',name:'月见社',booth:'A02',tags:[]}],
  products:[{id:'p1',creatorId:'c1',name:'星空画集',price:'¥45',tags:['画集']},{id:'p2',creatorId:'c2',name:'春日明信片',price:'¥20'},{id:'p3',creatorId:'gone',name:'无主制品'}],
  maps:[{title:'一层',image:'data:image/gif;base64,R0lGODlhAQABAAAAACw='}],
  news:[{date:'07/01',title:'社团名单公开'}],
  community:[{label:'游客群',url:'https://example.com/group'}],
  sponsors:[{name:'星尘赞助'}]
};

async function openStudio(page,project,seed){
  if(seed){
    await page.goto('/v8/market-01-preview.html');
    await page.evaluate(([k,v])=>localStorage.setItem(k,JSON.stringify(v)),['onlyevent-studio-v8:03-creator-market:'+project+':iframe',seed]);
  }
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/v8/?template=03-creator-market&project='+project);
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.cm-site')).toBeAttached();
  return {frame,errors};
}

test('03 opens in the shared Studio with only its own pages and content groups',async({page})=>{
  const {frame,errors}=await openStudio(page,'unified-pages');
  await expect(page.locator('#workspaceTemplateName')).toHaveText('CREATOR MARKET');
  for(const row of ['activities','guests'])await expect(page.locator('[data-page-row="'+row+'"]')).toBeHidden();
  for(const row of ['booths','guide'])await expect(page.locator('[data-page-row="'+row+'"]')).toBeVisible();
  await expect(page.locator('#createCustomPageBtn')).toBeHidden();
  await expect(page.locator('#pageContentNav')).not.toContainText('滚动公告');
  await expect(page.locator('#pageContentNav')).not.toContainText('活动精选');
  await expect(frame.locator('.spotlight-six .spotlight-tile')).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('03 event name edits reach the brand, hero card and KV fallback',async({page})=>{
  const {frame}=await openStudio(page,'unified-name');
  const brand=frame.locator('.brand');
  await expect(brand).toHaveAttribute('contenteditable','true');
  await brand.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('夏日创作祭');
  await expect(frame.locator('.hero-copy h1')).toHaveText('夏日创作祭');
  await expect(frame.locator('.cm-kv-fallback')).toHaveText('夏日创作祭');
  await expect(page.locator('#projectEventName')).toHaveText('夏日创作祭');
});

test('old standalone 03 projects migrate onto the shared core without losing data',async({page})=>{
  const {frame,errors}=await openStudio(page,'unified-legacy',legacyProject);
  await expect(frame.locator('.hero-copy h1')).toHaveText('夏日创作祭');
  await expect(frame.locator('.hero-copy [data-oe-field="tagline"]')).toHaveText('旧版 03 的活动介绍');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('onlyevent-studio-v8:03-creator-market:unified-legacy:iframe')));
  expect(saved.creatorMarketMigrated).toBe(true);
  expect(saved.booths.map(b=>[b.no,b.name,b.products.map(p=>p.name)])).toEqual([
    ['A01','浮光工房',['星空画集']],['A02','月见社',['春日明信片']],['','其他制品',['无主制品']]
  ]);
  expect(saved.booths[0].type).toBe('原创 · 画集');
  expect(saved.venueMap.image).toBe(legacyProject.maps[0].image);
  expect(saved.updates[0]).toMatchObject({date:'07/01',title:'社团名单公开'});
  expect(saved.socialLinks[0]).toMatchObject({label:'游客群',url:'https://example.com/group'});
  expect(saved.guide.items[0].text).toBe('请提前 30 分钟到场。');
  expect(saved.legacyCreatorMarket.creators).toHaveLength(2);
  expect(saved).not.toHaveProperty('creators');
  await expect(frame.locator('.spotlight-tile')).toHaveCount(3);
  expect(errors).toEqual([]);
});

test('03 spotlight tiles open the booth page in preview',async({page})=>{
  const {frame}=await openStudio(page,'unified-spotlight');
  await page.locator('#previewBtn').click();
  await page.locator('#liveFrame').evaluate(f=>f.contentWindow.postMessage({type:'OE_HIDE_ENTRY_PREVIEW'},location.origin));
  await frame.locator('.spotlight-six .spotlight-tile').first().click();
  await expect(frame.locator('#booths')).toBeVisible();
  await expect(frame.locator('#spotlight')).toBeHidden();
});

for(const id of ['01-ip-only','02-scrapbook','03-creator-market'])test(id+' exported visitor HTML runs on its own',async({page,browser})=>{
  await page.goto('/v8/?template='+id+'&project=export-runs-'+id);
  await expect(page.frameLocator('#liveFrame').locator('[data-oe-field="eventName"]').first()).toBeAttached();
  const html=await page.evaluate(()=>new Promise(resolve=>{
    addEventListener('message',e=>{if(e.data?.type==='OE_EXPORT_HTML_RESULT')resolve(e.data.html)});
    document.querySelector('#liveFrame').contentWindow.postMessage({type:'OE_EXPORT_HTML'},location.origin);
  }));
  expect(html).not.toContain('<\\/script>');
  const visitor=await browser.newPage();
  const errors=[];visitor.on('pageerror',e=>errors.push(e.message));
  await visitor.setContent(html);
  expect(await visitor.evaluate(()=>{try{new Function(document.scripts[document.scripts.length-1].textContent);return true}catch{return false}})).toBe(true);
  // Use the real link handler; the entry gate may still cover the page.
  await visitor.evaluate(()=>document.querySelector('#skip')?.click());
  await visitor.evaluate(()=>document.querySelector('a[data-page-link="booths"]').click());
  await expect(visitor.locator('#booths')).toBeVisible();
  if(id==='03-creator-market'){
    await visitor.evaluate(()=>document.querySelector('a[data-page-link="home"]').click());
    await expect(visitor.locator('.spotlight-six .spotlight-tile')).toHaveCount(6);
  }
  expect(errors).toEqual([]);
  await visitor.close();
});

test('03 spotlight products open their product editor while editing',async({page})=>{
  const {frame}=await openStudio(page,'unified-spotlight-edit');
  const tile=frame.locator('.spotlight-six .spotlight-tile').first();
  const name=(await tile.locator('b').textContent())?.trim();
  await tile.click();
  await expect(page.locator('#inspector')).toContainText('编辑制品');
  await expect(page.locator('#inspector input[value="'+name+'"]').first()).toBeAttached();
  await expect(frame.locator('#spotlight')).toBeVisible();
});
