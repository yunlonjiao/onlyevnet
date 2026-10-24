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
test('03 can edit, persist, select product cards, preview and export standalone HTML',async()=>{
 const {context,page,errors,frame}=await openEditor('03-creator-market','ci-shared-studio');
 await page.locator('[data-section="basic"]').waitFor();
 const activityName=page.locator('#inspector [data-key="eventName"]');
 await activityName.fill('QA 创作放送');
 await page.waitForTimeout(350);
 assert.equal((await frame.locator('[data-event-name]').first().textContent())?.trim(),'QA 创作放送');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('#inspector [data-key="eventName"]').waitFor();
 assert.equal(await page.locator('#inspector [data-key="eventName"]').inputValue(),'QA 创作放送');

 await page.locator('#pageContentNav [data-section="products"]').click();
 await page.locator('#contentListPanel [data-sidebar-content-add]').click();
 await page.locator('#inspector [data-key="products.0.name"]').fill('QA 制品');
 await page.waitForTimeout(550);
 await frame.locator('#directory').evaluate(el=>el.open=true);
 const product=frame.locator('[data-market-record="products"][data-market-record-id]').filter({hasText:'QA 制品'}).first();
 await product.click({timeout:15000});
 assert.ok((await page.locator('#inspector [data-key="products.0.name"]').inputValue()).includes('QA 制品'));

 await page.locator('#previewBtn').click();
 assert.ok(await page.locator('body.previewing').count());
 assert.ok(await frame.locator('html.oe-studio-preview').count());
 await page.locator('#previewBtn').click();

 await page.locator('#publishBtn').click();
 const [download]=await Promise.all([page.waitForEvent('download',{timeout:20000}),page.locator('#publishDownload').click()]);
 const html=await readFile(await download.path(),'utf8');
 assert.ok(html.includes('const d=__oeSnapshot'),'HTML must embed creator state');
 assert.ok(html.includes('QA 创作放送'),'HTML must contain latest event name');
 assert.ok(!html.includes("from'/v8/market-shared.js'"),'HTML must not import shared preview data');
 assert.deepEqual(errors,[],'03 must have no uncaught runtime errors');
 await context.close();
});
test('03 mobile editor has working device toolbar and preview controls',async()=>{
 const {context,page,errors}=await openEditor('03-creator-market','ci-mobile');
 await page.locator('#deviceMobileBtn').click();
 assert.ok(await page.locator('#canvas.mobile').count());
 await page.locator('#deviceDesktopBtn').click();
 assert.equal(await page.locator('#canvas.mobile').count(),0);
 assert.deepEqual(errors,[]);
 await context.close();
});

test('03 guide, map records, list deletion and undo/redo use the Studio workflow',async()=>{
 const {context,page,errors,frame}=await openEditor('03-creator-market','ci-guide-map');
 const name=page.locator('#inspector [data-key="eventName"]');
 const original=await name.inputValue();
 await name.fill('QA Undo Title');
 await name.blur();
 await page.locator('#undoBtn').click();
 assert.equal(await page.locator('#inspector [data-key="eventName"]').inputValue(),original);
 await page.locator('#redoBtn').click();
 assert.equal(await page.locator('#inspector [data-key="eventName"]').inputValue(),'QA Undo Title');

 await page.locator('#pageContentNav [data-section="guide"]').click();
 await page.locator('#inspector [data-key="guide"]').fill('QA 入场指南内容');
 await page.waitForTimeout(300);
 assert.equal((await frame.locator('#guideText').textContent())?.trim(),'QA 入场指南内容');

 await page.locator('#pageContentNav [data-section="maps"]').click();
 await page.locator('#contentListPanel [data-sidebar-content-add]').click();
 const mapName=page.locator('#inspector [data-key="maps.0.title"]');
 await mapName.fill('QA 场地图');
 await page.waitForTimeout(500);
 await frame.locator('#directory').evaluate(el=>el.open=true);
 const map=frame.locator('[data-market-record="maps"]').first();
 await map.click({timeout:12000});
 assert.equal(await page.locator('#inspector [data-key="maps.0.title"]').inputValue(),'QA 场地图');
 assert.equal(await frame.locator('#zoom[open]').count(),0,'Editor map selection must not open visitor zoom');
 await page.locator('#inspector [data-delete-selected]').click();
 assert.equal(await page.locator('#contentListPanel [data-open-item]').count(),0);
 assert.deepEqual(errors,[]);
 await context.close();
});

test('03 canvas focus uses the same 01/02 field highlight colors',async()=>{
 const {context,page,errors,frame}=await openEditor('03-creator-market','ci-highlight');
 const target=frame.locator('[data-event-name][data-market-edit-path]').first();
 await target.focus();
 const styles=await target.evaluate(el=>({
  outline:getComputedStyle(el).outlineColor,
  background:getComputedStyle(el).backgroundColor
 }));
 assert.equal(styles.outline,'rgb(123, 97, 255)');
 assert.equal(styles.background,'rgb(255, 247, 179)');
 await page.locator('#previewBtn').click();
 const outline=await frame.locator('[data-event-name]').first().evaluate(el=>getComputedStyle(el).outlineStyle);
 assert.equal(outline,'none');
 assert.deepEqual(errors,[]);
 await context.close();
});

test('03 image editor uses the shared Cropper UI and saves a cropped hero',async()=>{
 const {context,page,errors}=await openEditor('03-creator-market','ci-cropper');
 await page.locator('#pageContentNav [data-section="images"]').click();
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/eioAAAAASUVORK5CYII=','base64');
 await page.locator('input[data-file="heroImage"]').setInputFiles({name:'hero.png',mimeType:'image/png',buffer:png});
 await page.locator('#imageCropDialog[open]').waitFor({timeout:20000});
 await page.locator('#cropStage cropper-selection').waitFor({timeout:20000});
 await page.locator('#cropApply').click();
 await page.locator('#imageCropDialog').waitFor({state:'hidden',timeout:20000});
 await page.waitForTimeout(400);
 const src=await page.locator('#inspector .item-media img').first().getAttribute('src');
 assert.ok(src?.startsWith('data:image/webp;base64,'),'Cropping must save a WebP data URL');
 assert.deepEqual(errors,[]);
 await context.close();
});

test('Studio identifiers stay English while organizer event names remain editable',async()=>{
 for(const [id,label] of [['01-ip-only','POP FESTIVAL'],['02-scrapbook','TRAVEL JOURNEY'],['03-creator-market','CREATOR MARKET'],['04-creator-catalogue','CREATOR CATALOGUE']]){
  const {context,page,errors}=await openEditor(id,'ci-identity-'+id);
  assert.equal(await page.locator('#projectTemplateName').textContent(),label);
  assert.equal(await page.locator('#workspaceTemplateName').textContent(),label);
  assert.equal(await page.locator('#studioVersion').textContent(),'v8.41.5');
  assert.deepEqual(errors,[]);
  await context.close();
 }
});
test('template style labels are distinct; all fresh sites display STARDUST ONLY',async()=>{
 const styleNames={
  '01-ip-only':'POP FESTIVAL','02-scrapbook':'TRAVEL JOURNEY',
  '03-creator-market':'CREATOR MARKET','04-creator-catalogue':'CREATOR CATALOGUE'
 };
 const {context:registryContext,page:registryPage}=await openEditor('01-ip-only','ci-style-contract');
 const templates=await registryPage.evaluate(async()=>{
  const {listTemplates}=await import('/v8/templates/registry.js?v=8.41.5');
  return listTemplates().map(t=>({id:t.id,name:t.name,label:t.label,studioName:t.studioName,defaultEvent:t.defaults.eventName}));
 });
 assert.equal(templates.length,4);
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
  const nameField=id.startsWith('0')&&Number(id.slice(0,2))<3?
   frame.locator('[data-oe-field="eventName"]').first():
   frame.locator('[data-event-name]').first();
  await nameField.waitFor({timeout:15000});
  await page.waitForFunction(()=>document.querySelector('#projectEventName')?.textContent==='STARDUST ONLY');
  assert.equal((await nameField.textContent())?.trim(),'STARDUST ONLY');
  if(id==='03-creator-market'||id==='04-creator-catalogue'){
   assert.equal(await frame.locator('html').evaluate(el=>el.ownerDocument.title),'STARDUST ONLY');
  }
  assert.deepEqual(errors,[]);
  await context.close();
 }
});
test('legacy unscoped sample names migrate, but organizers own project names',async()=>{
 const {context,page,errors}=await openEditor('03-creator-market','default');
 await page.evaluate(()=>localStorage.setItem(
  'onlyevent-studio-v8:03-creator-market:default:iframe',
  JSON.stringify({eventName:'同人创作展',description:'原始内容仍需保留'})
 ));
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('#projectEventName')?.textContent==='STARDUST ONLY');
 assert.equal(await page.locator('#inspector [data-key="description"]').inputValue(),'原始内容仍需保留');
 assert.deepEqual(errors,[]);
 await context.close();
 const owned=await openEditor('03-creator-market','ci-owner-name');
 await owned.page.locator('#inspector [data-key="eventName"]').fill('主办方自己的漫展名');
 await owned.page.waitForFunction(()=>{
  const raw=localStorage.getItem('onlyevent-studio-v8:03-creator-market:ci-owner-name:iframe');
  return raw&&JSON.parse(raw).eventName==='主办方自己的漫展名';
 });
 await owned.page.reload({waitUntil:'domcontentloaded'});
 await owned.page.waitForFunction(()=>document.querySelector('#projectEventName')?.textContent==='主办方自己的漫展名');
 assert.deepEqual(owned.errors,[]);
 await owned.context.close();
});
test('03 sidebar and canvas titles stay in sync for products and pages',async()=>{
 const {context,page,errors}=await openEditor('03-creator-market','ci-page-alignment');
 await page.locator('#pageContentNav [data-section="products"]').click();
 assert.equal(await page.locator('#pageContentNav [data-section="products"] span').textContent(),'制品管理');
 assert.equal(await page.locator('#pageContentNav [data-section="products"] b').textContent(),'0');
 assert.ok(await page.locator('.page-nav [data-page="booths"].active').count());
 assert.equal(await page.locator('.canvas-title b').textContent(),'摊位');
 await page.locator('#pageContentNav [data-section="guide"]').click();
 assert.equal(await page.locator('.canvas-title b').textContent(),'观展指南');
 await page.locator('.page-nav [data-page="animation"]').click();
 assert.equal(await page.locator('.canvas-title b').textContent(),'动画页面');
 assert.equal(await page.locator('#createCustomPageBtn').isVisible(),false);
 assert.deepEqual(errors,[]);
 await context.close();
});
test('03 mobile pages and Inspector drawers open and dismiss correctly',async()=>{
 const {context,page,errors}=await openEditor('03-creator-market','ci-mobile-drawers');
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
