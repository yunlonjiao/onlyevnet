import {test,expect} from '@playwright/test';
import {useCloudPublisher,signInCloud} from './cloud-publisher.mjs';
const ids=['01-ip-only','02-scrapbook','03-creator-market','04-creator-catalogue','05-live-poster','06-band-live','07-tea-party','08-birthday'];
test('admin lists eight current, actionable templates',async({page})=>{
 await signInCloud(page,await useCloudPublisher(page),'模板QA');
 await page.goto('/admin/');
 await page.locator('[data-admin-page="templates"]').click();
 await expect(page.locator('#templateGrid .template-card[data-template-id]')).toHaveCount(8);
 for(const id of ids)await expect(page.locator('#templateGrid [data-template="'+id+'"]')).toHaveText(/使用此模板/);
});
for(const id of ids)test(id+' opens the correct Studio instead of silently reverting to IP ONLY',async({page})=>{
 await page.goto('/v8/?template='+id+'&project=registry-current-'+id);
 const frame=page.frameLocator('#liveFrame');
 await expect(frame.locator('body')).toBeVisible();
 await expect(page.locator('#workspaceTemplateName')).not.toBeEmpty();
 if(id.startsWith('04')){
  await expect(frame.locator('.cc-site [data-oe-mount="catalogue-book"] .cb-book')).toBeAttached();
 }else if(id.startsWith('05')){
  await expect(frame.locator('.ls-site [data-oe-mirror="lineup"] .lineup-card').first()).toBeAttached();
  await expect(frame.locator('.ls-site [data-oe-mirror="timetable"] .timeline-row').first()).toBeAttached();
 }else if(id.startsWith('06')){
  await expect(frame.locator('.bl-site [data-oe-mirror="lineup"] .lineup-card').first()).toBeAttached();
 }else if(id.startsWith('08')){
  await expect(frame.locator('.bd-site #participation .featured-activity-card').first()).toBeAttached();
 }else if(id.startsWith('07')){
  await expect(frame.locator('.tp-site [data-oe-mirror="lineup"] .lineup-card').first()).toBeAttached();
  await expect(frame.locator('.tp-site #participation .featured-activity-card').first()).toBeAttached();
 }else if(id.startsWith('03')){
  await expect(frame.locator('.cm-site [data-oe-mount="product-spotlight"]')).toBeAttached();
 }else{
  await expect(frame.locator('.hero')).toBeAttached();
 }
});
test('all templates share the IP ONLY core',async({page})=>{
 await page.goto('/v8/');
 const rows=await page.evaluate(async()=>{
  const r=await import('/v8/templates/registry.js');
  return r.listTemplates().map(t=>({id:t.id,eventType:t.eventType||'ip-only',supportedModules:t.supportedModules}));
 });
 expect(rows.map(t=>t.id)).toEqual(ids);
 expect(rows.every(x=>x.eventType==='ip-only')).toBe(true);
 expect(rows.every(x=>x.supportedModules.includes('booths'))).toBe(true);
});
