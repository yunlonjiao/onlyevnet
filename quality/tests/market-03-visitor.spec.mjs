import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

const data={
  eventName:'夏日创作祭',date:'2027.07.20',location:'示例会展中心',
  ticketUrl:'javascript:alert(1)',
  creators:[{id:'c1',name:'浮光工房',booth:'A01'},{id:'c2',name:'月见社',booth:'A02'}],
  products:[{id:'p1',creatorId:'c1',name:'星空画集',price:'¥45'},{id:'p2',creatorId:'c2',name:'春日明信片',price:'¥20'},{id:'p3',creatorId:'c1',name:'夜色贴纸',price:'¥12'}]
};

async function openVisitor(page,patch={}){
  await page.goto('/v8/market-01-preview.html');
  await page.evaluate(d=>localStorage.setItem('onlyevent-market-preview:03-creator-market:qa03',JSON.stringify(d)),{...data,...patch});
  await page.goto('/v8/market-01-preview.html?template=03-creator-market&project=qa03');
}

test('03 visitor page uses the organizer name everywhere and shows no prototype copy',async({page})=>{
  await openVisitor(page);
  await expect(page.locator('#kvArtwork strong')).toHaveText('夏日创作祭');
  await expect(page.locator('footer')).toHaveText('夏日创作祭 · Powered by OnlyEvent');
  await expect(page.locator('body')).not.toContainText('原型');
  await expect(page.locator('body')).not.toContainText('STARDUST');
});

test('03 ticket button never uses a non-http link',async({page})=>{
  await openVisitor(page);
  for(const href of await page.locator('[data-ticket]').evaluateAll(list=>list.map(a=>a.getAttribute('href'))))expect(href).toBe('#guide');
  await openVisitor(page,{ticketUrl:'https://tickets.example.com/event'});
  await expect(page.locator('#tickets [data-ticket]')).toHaveAttribute('href','https://tickets.example.com/event');
});

test('03 recommended product opens the folded directory',async({page})=>{
  await openVisitor(page);
  await expect(page.locator('#directory')).not.toHaveAttribute('open','');
  await page.locator('#randomSix .tile').first().click();
  await expect(page.locator('#directory')).toHaveAttribute('open','');
  await expect(page.locator('#products')).toBeVisible();
});

test('03 editor unlinks products when their creator is deleted',async({page})=>{
  const storage='onlyevent-studio-v8:03-creator-market:qa03-delete:iframe';
  await page.goto('/v8/market-01-preview.html');
  await page.evaluate(([k,d])=>localStorage.setItem(k,JSON.stringify(d)),[storage,data]);
  await page.goto('/v8/?template=03-creator-market&project=qa03-delete');
  await page.locator('[data-section="creators"]').click();
  await page.locator('#contentListPanel [data-open-item="0"]').click();
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('#inspector [data-delete-selected]').click();
  await expect.poll(async()=>(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),storage)).creators.length).toBe(1);
  const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),storage);
  expect(saved.products.map(p=>p.creatorId)).toEqual(['','c2','']);
});
