import {test,expect} from '@playwright/test';

const templates=[
  ['01-ip-only','international-festival'],
  ['02-scrapbook','travel-scrapbook'],
  ['03-school-festival','school-festival'],
  ['04-museum-editorial','museum-editorial'],
  ['05-live-poster','live-poster'],
  ['06-expo-catalogue','expo-catalogue'],
  ['07-immersive-character','immersive-character']
];

test('admin exposes all seven IP ONLY templates',async({page})=>{
  await page.goto('/admin/');
  await page.evaluate(()=>{
    const user={id:'qa-template-user',name:'模板 QA',email:'',passwordHash:'qa',recoveryHash:'qa',authType:'quick'};
    localStorage.setItem('onlyevent-auth-sim-users-v1',JSON.stringify([user]));
    localStorage.setItem('onlyevent-auth-sim-session-v1',JSON.stringify({userId:user.id}));
  });
  await page.reload();
  await page.locator('[data-admin-page="templates"]').click();
  await expect(page.locator('#templateGrid .template-card[data-template-id]')).toHaveCount(7);
  for(const [id] of templates)await expect(page.locator('#templateGrid .template-card[data-template-id="'+id+'"]')).toBeVisible();
});

for(const [id,art] of templates){
  test(id+' loads the complete IP ONLY renderer without runtime errors',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/v8/?template='+id+'&project=qa-'+id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.hero')).toBeVisible();
    await expect(frame.locator('#tickets')).toBeVisible();
    await expect(frame.locator('.quick-grid')).toBeVisible();
    await expect(page.locator('#projectTemplateName')).not.toHaveText('');
    const active=await frame.locator('html').getAttribute('data-oe-template');
    expect(active).toBe(id);
    if(id==='02-scrapbook') await page.locator('#liveFrame').evaluate((iframe,p)=>iframe.contentWindow.postMessage({type:'OE_SHOW_PAGE',page:p},location.origin),'booths'); else await page.locator('.page-nav [data-page="booths"]').click();
    await expect(frame.locator('#booths')).toBeVisible();
    if(id==='02-scrapbook') await page.locator('#liveFrame').evaluate((iframe,p)=>iframe.contentWindow.postMessage({type:'OE_SHOW_PAGE',page:p},location.origin),'activities'); else await page.locator('.page-nav [data-page="activities"]').click();
    await expect(frame.locator('#activities')).toBeVisible();
    if(id==='02-scrapbook') await page.locator('#liveFrame').evaluate((iframe,p)=>iframe.contentWindow.postMessage({type:'OE_SHOW_PAGE',page:p},location.origin),'guests'); else await page.locator('.page-nav [data-page="guests"]').click();
    await expect(frame.locator(id==='02-scrapbook'?'#home-guests':'#guests')).toBeVisible();
    if(id==='02-scrapbook') await page.locator('#liveFrame').evaluate((iframe,p)=>iframe.contentWindow.postMessage({type:'OE_SHOW_PAGE',page:p},location.origin),'guide'); else await page.locator('.page-nav [data-page="guide"]').click();
    await expect(frame.locator('#guide')).toBeVisible();
    expect(errors,'template '+id+' should not produce renderer errors').toEqual([]);
  });
}

test('six added templates have genuinely different visual fingerprints',async({page})=>{
  const fingerprints=new Map();
  for(const [id] of templates.slice(1)){
    await page.goto('/v8/?template='+id+'&project=visual-'+id);
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('.hero')).toBeVisible();
    const fp=await frame.locator('.hero').evaluate(el=>{
      const h=getComputedStyle(el);
      const titleNode=document.querySelector('.hero h1');
      const title=titleNode?getComputedStyle(titleNode):null;
      const kv=getComputedStyle(document.querySelector('.kv'));
      const quick=document.querySelector('[data-oe-mount="quick"] > *');
      const card=quick?getComputedStyle(quick):null;
      return [
        h.backgroundColor,h.minHeight,
        title?.fontFamily||'no-title',title?.fontSize||'none',title?.fontStyle||'none',
        kv.borderRadius,kv.boxShadow,
        card?.borderRadius||'none',card?.backgroundColor||'none'
      ].join('|');
    });
    fingerprints.set(id,fp);
  }
  expect(new Set(fingerprints.values()).size).toBe(6);
});

test('all IP ONLY templates declare the required metadata and same module contract',async({page})=>{
  await page.goto('/admin/');
  const data=await page.evaluate(async()=>{
    const mod=await import('/v8/templates/registry.js?v=8.36.0');
    return mod.listTemplates().map(t=>({
      id:t.id,structureProfile:t.structureProfile,artDirection:t.artDirection,motionProfile:t.motionProfile,
      supportedModules:t.supportedModules,heroRenderer:t.heroRenderer,guestRenderer:t.guestRenderer,
      boothRenderer:t.boothRenderer,programRenderer:t.programRenderer,newsRenderer:t.newsRenderer,sponsorRenderer:t.sponsorRenderer
    }));
  });
  expect(data).toHaveLength(7);
  const contract=data[0].supportedModules.slice().sort().join('|');
  for(const t of data){
    expect(t.structureProfile).toBeTruthy();
    expect(t.artDirection).toBeTruthy();
    expect(t.motionProfile).toBeTruthy();
    expect(t.heroRenderer).toBeTruthy();
    expect(t.guestRenderer).toBeTruthy();
    expect(t.boothRenderer).toBeTruthy();
    expect(t.programRenderer).toBeTruthy();
    expect(t.newsRenderer).toBeTruthy();
    expect(t.sponsorRenderer).toBeTruthy();
    expect(t.supportedModules.slice().sort().join('|')).toBe(contract);
  }
});
