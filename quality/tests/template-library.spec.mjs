import {test,expect} from '@playwright/test';
const ids=['01-ip-only','02-scrapbook','03-creator-market','04-creator-catalogue'];
test('admin lists four current, actionable templates',async({page})=>{
 await page.goto('/admin/');
 await page.evaluate(()=>{
  const user={id:'qa-current-templates',name:'模板QA',email:'',passwordHash:'qa',recoveryHash:'qa',authType:'quick'};
  localStorage.setItem('onlyevent-auth-sim-users-v1',JSON.stringify([user]));
  localStorage.setItem('onlyevent-auth-sim-session-v1',JSON.stringify({userId:user.id}));
 });
 await page.reload();
 await page.locator('[data-admin-page="templates"]').click();
 await expect(page.locator('#templateGrid .template-card[data-template-id]')).toHaveCount(4);
 for(const id of ids)await expect(page.locator('#templateGrid [data-template="'+id+'"]')).toHaveText(/使用此模板/);
});
for(const id of ids)test(id+' opens the correct Studio instead of silently reverting to IP ONLY',async({page})=>{
 await page.goto('/v8/?template='+id+'&project=registry-current-'+id);
 const frame=page.frameLocator('#liveFrame');
 await expect(frame.locator('body')).toBeVisible();
 await expect(page.locator('#workspaceTemplateName')).not.toBeEmpty();
 if(id.startsWith('03')||id.startsWith('04')){
  await expect(page.locator('#pageContentNav [data-section="creators"]')).toBeVisible();
  await expect(frame.locator(id.startsWith('03')?'#randomSix':'#catalogue')).toBeAttached();
 }else{
  await expect(frame.locator('.hero')).toBeAttached();
 }
});
test('registry retains IP ONLY core but separates creator fair modules',async({page})=>{
 await page.goto('/v8/');
 const rows=await page.evaluate(async()=>{
  const r=await import('/v8/templates/registry.js');
  return r.listTemplates().map(t=>({id:t.id,eventType:t.eventType||'ip-only',supportedModules:t.supportedModules}));
 });
 expect(rows.map(t=>t.id)).toEqual(ids);
 expect(rows.slice(0,2).every(x=>x.eventType==='ip-only')).toBe(true);
 expect(rows.slice(2).every(x=>x.eventType==='creator-market')).toBe(true);
 expect(rows.slice(2).every(x=>x.supportedModules.includes('products'))).toBe(true);
});
