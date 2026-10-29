import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';

const origin=process.env.STUDIO_URL||'http://127.0.0.1:8124';
let browser;
before(async()=>{browser=await chromium.launch({headless:true})});
after(async()=>{await browser?.close()});

async function openEditor(template,project){
 const context=await browser.newContext({acceptDownloads:true,viewport:{width:1440,height:900}});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const uri=origin+'/v8/?template='+template+'&project='+encodeURIComponent(project);
 await page.goto(uri,{waitUntil:'domcontentloaded'});
 await page.locator('#liveFrame').waitFor({timeout:20000});
 await page.frameLocator('#liveFrame').locator('body').waitFor({timeout:20000});
 return {context,page,errors,frame:page.frameLocator('#liveFrame')};
}
test('01 and 02 use the shared Studio editor without startup errors',async()=>{
 for(const t of ['01-ip-only','02-scrapbook']){
  const {context,page,errors,frame}=await openEditor(t,'ci-'+t);
  await page.locator('#inspector').waitFor();
  await frame.locator('[data-oe-field]').first().waitFor({timeout:15000});
  assert.ok((await page.locator('#pageContentNav').count())===1);
  assert.deepEqual(errors,[],'Startup error in '+t);
  await context.close();
 }
});
test('03 and 04 mobile editor has working device toolbar and preview controls',async()=>{
 for(const id of ['03-creator-market','04-creator-catalogue']){
  const {context,page,errors}=await openEditor(id,'ci-mobile');
  await page.locator('#deviceMobileBtn').click();
  assert.ok(await page.locator('#canvas.mobile').count());
  await page.locator('#deviceDesktopBtn').click();
  assert.equal(await page.locator('#canvas.mobile').count(),0);
  assert.deepEqual(errors,[]);
  await context.close();
 }
});

test('03 and 04 canvas focus uses the same 01/02 field highlight colors',async()=>{
 for(const id of ['03-creator-market','04-creator-catalogue']){
  const {context,page,errors,frame}=await openEditor(id,'ci-highlight');
  const target=frame.locator('.hero-copy [data-oe-field="eventName"]').first();
  await target.waitFor({timeout:15000});
  await target.focus();
  const styles=await target.evaluate(el=>({outline:getComputedStyle(el).outlineColor}));
  assert.equal(styles.outline,'rgb(123, 97, 255)');
  await page.locator('#previewBtn').click();
  await page.waitForFunction(()=>document.querySelector('#liveFrame').contentDocument.documentElement.classList.contains('oe-preview'));
  assert.equal(await target.getAttribute('contenteditable'),'false');
  assert.deepEqual(errors,[]);
  await context.close();
 }
});

test('Studio identifiers stay English while organizer event names remain editable',async()=>{
 for(const [id,label] of [['01-ip-only','流行嘉年华'],['02-scrapbook','旅途手账'],['03-creator-market','创作者集市'],['04-creator-catalogue','创作者场刊'],['05-live-poster','舞台现场'],['06-band-live','乐队演出'],['07-tea-party','茶会小聚'],['08-birthday','生日应援']]){
  const {context,page,errors}=await openEditor(id,'ci-identity-'+id);
  assert.equal(await page.locator('#projectTemplateName').textContent(),label);
  assert.equal(await page.locator('#workspaceTemplateName').textContent(),label);
  assert.equal(await page.locator('#studioVersion').textContent(),'v'+(await import(new URL('../v8/version.js',import.meta.url))).STUDIO_VERSION);
  assert.deepEqual(errors,[]);
  await context.close();
 }
});
test('template style labels are distinct; all fresh sites display STARDUST ONLY',async()=>{
 const styleNames={
  '01-ip-only':'流行嘉年华','02-scrapbook':'旅途手账',
  '03-creator-market':'创作者集市','04-creator-catalogue':'创作者场刊',
  '05-live-poster':'舞台现场','06-band-live':'乐队演出','07-tea-party':'茶会小聚','08-birthday':'生日应援'
 };
 const {context:registryContext,page:registryPage}=await openEditor('01-ip-only','ci-style-contract');
 const templates=await registryPage.evaluate(async()=>{
  const {listTemplates}=await import('/v8/templates/registry.js?v=8.41.5');
  return listTemplates().map(t=>({id:t.id,name:t.name,label:t.label,studioName:t.studioName,defaultEvent:t.defaults.eventName}));
 });
 assert.equal(templates.length,8);
 for(const t of templates){
  assert.equal(t.label,styleNames[t.id]);
  assert.equal(t.studioName,t.label);
  assert.equal(t.name,t.id.slice(0,2)+' · '+t.label);
  assert.equal(t.defaultEvent,'STARDUST ONLY');
 }
 await registryContext.close();
 for(const [id,style] of Object.entries(styleNames)){
  const {context,page,frame,errors}=await openEditor(id,'ci-default-'+id);
  await page.waitForFunction(()=>document.querySelector('#projectEventName')?.textContent==='STARDUST ONLY');
  assert.equal(await page.locator('#projectTemplateName').textContent(),style);
  const nameField=Number(id.slice(0,2))<9?
   frame.locator('[data-oe-field="eventName"]').first():
   frame.locator('[data-event-name]').first();
  await nameField.waitFor({timeout:15000});
  await page.waitForFunction(()=>document.querySelector('#projectEventName')?.textContent==='STARDUST ONLY');
  assert.equal((await nameField.textContent())?.trim(),'STARDUST ONLY');
  assert.deepEqual(errors,[]);
  await context.close();
 }
});
test('legacy unscoped sample names migrate, but organizers own project names',async()=>{
 const {context,page,errors,frame}=await openEditor('04-creator-catalogue','default');
 await page.evaluate(()=>localStorage.setItem(
  'onlyevent-studio-v8:04-creator-catalogue:default:iframe',
  JSON.stringify({eventName:'同人创作展',description:'原始内容仍需保留'})
 ));
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('#projectEventName')?.textContent==='STARDUST ONLY');
 await page.frameLocator('#liveFrame').locator('.hero-copy [data-oe-field="tagline"]').waitFor({timeout:15000});
 assert.equal((await page.frameLocator('#liveFrame').locator('.hero-copy [data-oe-field="tagline"]').textContent())?.trim(),'原始内容仍需保留');
 assert.deepEqual(errors,[]);
 await context.close();
 const owned=await openEditor('04-creator-catalogue','ci-owner-name');
 const brand=owned.frame.locator('.brand');
 await brand.waitFor({timeout:15000});
 await owned.page.waitForFunction(()=>document.querySelector('#liveFrame').contentDocument.querySelector('.brand')?.getAttribute('contenteditable')==='true');
 await brand.click();
 await owned.page.keyboard.press('Control+A');
 await owned.page.keyboard.type('主办方自己的漫展名');
 await owned.page.waitForFunction(()=>{
  const raw=localStorage.getItem('onlyevent-studio-v8:04-creator-catalogue:ci-owner-name:iframe');
  return raw&&JSON.parse(raw).eventName==='主办方自己的漫展名';
 });
 await owned.page.reload({waitUntil:'domcontentloaded'});
 await owned.page.waitForFunction(()=>document.querySelector('#projectEventName')?.textContent==='主办方自己的漫展名');
 assert.deepEqual(owned.errors,[]);
 await owned.context.close();
});

test('04 mobile pages and Inspector drawers open and dismiss correctly',async()=>{
 const {context,page,errors}=await openEditor('04-creator-catalogue','ci-mobile-drawers');
 await page.setViewportSize({width:390,height:844});
 await page.locator('#mobilePagesBtn').click();
 assert.ok(await page.locator('body.mobile-sidebar-open').count());
 assert.equal(await page.locator('#mobilePanelBackdrop').isVisible(),true);
 await page.locator('.page-nav [data-page="booths"]').click();
 assert.equal(await page.locator('body.mobile-sidebar-open').count(),0);
 await page.locator('#mobileInspectorBtn').click();
 assert.ok(await page.locator('body.mobile-inspector-open').count());
 await page.locator('#mobilePanelBackdrop').click({position:{x:190,y:180}});
 assert.equal(await page.locator('body.mobile-inspector-open').count(),0);
 assert.deepEqual(errors,[]);
 await context.close();
});

