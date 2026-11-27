import {setStudioDevice,setStudioPreviewChrome} from '/v8/editor/studio-controls.js';
import {renderStudioCollectionRows} from '/v8/editor/studio-collections.js';
import {createStudioHistory} from '/v8/editor/studio-history.js';
import {publishChecks} from '/v8/editor/publish-checks.js';
import {downloadStudioHtml,publishStudioSite,hasLiveSite} from '/v8/editor/studio-publish.js';
import {loadStudioCropper,createStudioCropper} from '/v8/editor/studio-crop.js';
import {bindStudioField} from '/v8/editor/studio-field.js';
import {renderInspector,syncStudioIdentity as renderStudioIdentity,migrateDemoEventName} from '/v8/editor/studio-chrome.js';
import {streetGroups} from '/v8/renderer/street-spotlight.js';
import {DEFAULT_TEMPLATE_ID,getTemplate} from '/v8/templates/registry.js';
import {cleanSlug,suggestSlug,isValidSlug,readCloudSession,ensureCloudProjectFor,saveCloudConfig,uploadCloudImage,PROMO_CHANNELS,setSiteStages,listCloudProjects,getCloudSite} from '/v8/publisher.js';
import {migrateCreatorMarketState} from '/v8/templates/creator-market-migration.js';
import {GUIDE_OLD_PLACEHOLDER_TEXT,CUSTOM_PAGE_LAYOUTS} from '/v8/editor/studio-constants.js';
import {esc} from '/v8/editor/studio-format.js';
import {readJson,writeJson,removeKey} from '/v8/editor/studio-storage.js';
import {upsertAdminProject} from '/v8/editor/studio-admin-cache.js';
import {createToast} from '/v8/editor/studio-toast.js';
import {revealStages,stateAtStage} from '/v8/editor/studio-stage-state.js';
import {loadPublishRecord,persistPublishRecord,clearPublishRecord} from '/v8/editor/studio-publish-record.js';
import {setDeepState,getDeepState} from '/v8/editor/studio-state-paths.js';
import {guideLabelFor} from '/v8/editor/studio-guide-label.js';
import {stageRowsHtml} from '/v8/editor/studio-stage-html.js';
import {contentThumb} from '/v8/editor/studio-content-thumb.js';
import {renderPublishShare} from '/v8/editor/studio-publish-share.js';
import {createStageUi} from '/v8/editor/studio-stage-ui.js';
import {createPublishUi} from '/v8/editor/studio-publish-ui.js';
import {createPublishFlow} from '/v8/editor/studio-publish-flow.js';
import {createHistoryUi} from '/v8/editor/studio-history-ui.js';
import {createCloudSync} from '/v8/editor/studio-cloud-sync.js';
import {createCroppedImageStore} from '/v8/editor/studio-cropped-image.js';
import {createContentManagerMeta} from '/v8/editor/studio-content-manager.js';
import {GUIDE_PRESETS,PARTICIPATION_PRESETS,CUSTOM_PAGE_PRESETS,CUSTOM_PAGE_STARTERS} from '/v8/editor/studio-presets.js';
import {PAGE_CONTENT_CONFIG,COLLECTION_PAGE,INLINE_HOME_COLLECTIONS} from '/v8/editor/studio-page-content.js';
import {collectionStudioPageFor} from '/v8/editor/studio-collection-page.js';
import {buildStarterItems,customPagePreset} from '/v8/editor/studio-custom-page.js';
import {customPageRowsHtml} from '/v8/editor/studio-custom-page-rows.js';
import {customPageItemInspectorHtml} from '/v8/editor/studio-custom-page-item-html.js';
import {customPageSettingsHtml} from '/v8/editor/studio-custom-page-settings-html.js';
import {customPageItemsPanelHtml} from '/v8/editor/studio-custom-page-items-html.js';
import {customPageNavHtml} from '/v8/editor/studio-custom-page-nav-html.js';
import {streetManagerHtml} from '/v8/editor/studio-street-manager-html.js';
import {productInspectorHtml} from '/v8/editor/studio-product-inspector-html.js';
import {collectionMeta} from '/v8/editor/studio-collection-meta.js';
import {participationInspectorFields} from '/v8/editor/studio-participation-fields.js';
import {shareDialogHtml} from '/v8/editor/studio-share-dialog-html.js';
import {shareTextFor} from '/v8/editor/studio-share-text.js';
import {createShareDialog} from '/v8/editor/studio-share-dialog.js';
import {qrSvg} from '/v8/editor/studio-qr.js';
import {ticketSettingsInspectorHtml} from '/v8/editor/studio-ticket-inspector-html.js';
import {addressInspectorHtml} from '/v8/editor/studio-address-inspector-html.js';
import {lifecycleInspectorHtml} from '/v8/editor/studio-lifecycle-inspector-html.js';
import {heroTitleInspectorHtml} from '/v8/editor/studio-hero-title-inspector-html.js';
import {taglineEditorHtml,fieldEditorHtml} from '/v8/editor/studio-field-inspector-html.js';
import {PALETTES} from '/v8/editor/studio-palettes.js';
import {createRecapDialog} from '/v8/editor/studio-recap-dialog.js';
import {createCustomPages} from '/v8/editor/studio-custom-pages.js';
import {cleanupDeletedReferencesIn} from '/v8/editor/studio-reference-cleanup.js';
import {initDeviceControls} from '/v8/editor/studio-device.js';
import {createBannerInspector,createTrafficInspector} from '/v8/editor/studio-page-inspectors.js';
import {createOptionalPageInspector} from '/v8/editor/studio-optional-page.js';
import {createSimpleInspectors} from '/v8/editor/studio-simple-inspectors.js';
import {createFieldInspector} from '/v8/editor/studio-field-inspector.js';
import {createPageTool} from '/v8/editor/studio-page-tool.js';
import {createCollectionPanel} from '/v8/editor/studio-collection-panel.js';
import {createItemInspector} from '/v8/editor/studio-item-inspector.js';
import {createItemMutations} from '/v8/editor/studio-item-mutations.js';
import {createProductInspector} from '/v8/editor/studio-product-inspector.js';
import {createStreetManager} from '/v8/editor/studio-street-manager.js';
import {createEntryAnimationInspector} from '/v8/editor/studio-entry-animation.js';
import {createImageInspector} from '/v8/editor/studio-image-inspector.js';
import {createImageCropper} from '/v8/editor/studio-image-cropper.js';
import {blobToDataUrl} from '/v8/editor/studio-blob.js';
import {createSaveController} from '/v8/editor/studio-save.js';
import {cropSelectionInside} from '/v8/editor/studio-crop-helpers.js';
import {imageSlotConfigBaseFor} from '/v8/editor/studio-image-slot-config.js';
import {resolveImageSlotConfig} from '/v8/editor/studio-image-slot-resolve.js';
import {boothProductsHtml} from '/v8/editor/studio-booth-products-html.js';
import {canvasToBlob,downloadSvg} from '/v8/editor/studio-canvas-download.js';
import {createContentCounts} from '/v8/editor/studio-content-counts.js';
import {pageContentItems} from '/v8/editor/studio-page-nav.js';
import {pageNavHtml} from '/v8/editor/studio-page-nav-html.js';
import {presetEntriesForState} from '/v8/editor/studio-preset-entries.js';
import {collectionArrayFor,collectionPathFor} from '/v8/editor/studio-collection.js';
import {extraInspectorHtml} from '/v8/editor/studio-extra-inspector.js';
import {itemInspectorHeadHtml,itemFieldsHtml,isItemLongField,itemActionsHtml} from '/v8/editor/studio-item-inspector-html.js';
import {itemMediaPanels} from '/v8/editor/studio-item-media-html.js';
import {createModuleControls} from '/v8/editor/studio-module-controls.js';
import {setPageContentActive} from '/v8/editor/studio-page-content-active.js';
import {optionalPageHtml} from '/v8/editor/studio-optional-page-html.js';
import {bannerInspectorHtml,trafficInspectorHtml} from '/v8/editor/studio-page-inspector-html.js';
import {coverKvHtml,entryAnimationHtml} from '/v8/editor/studio-entry-animation-html.js';
import {customPageKey, customPageByKey as findCustomPage, pageLabel as pageLabelFor, customPageIndex as pageIndexFor} from '/v8/editor/studio-page-label.js';
const $=s=>document.querySelector(s);
let customPagesUi;
function renderCustomPageRows(){return customPagesUi.renderCustomPageRows()}
function openCustomPageCreator(){return customPagesUi.openCustomPageCreator()}
function moveCustomPage(pageId,dir){return customPagesUi.moveCustomPage(pageId,dir)}
function createCustomPage(presetKey){return customPagesUi.createCustomPage(presetKey)}
function removeCustomPage(pageId){return customPagesUi.removeCustomPage(pageId)}
function openCustomPageSettings(pageId){return customPagesUi.openCustomPageSettings(pageId)}
function openCustomPageItemsManager(pageId,selectedIndex=-1){return customPagesUi.openCustomPageItemsManager(pageId,selectedIndex)}
function openCustomPageItemInspector(pageId,index){return customPagesUi.openCustomPageItemInspector(pageId,index)}
function mutateCustomPageItem(pageId,index,op){return customPagesUi.mutateCustomPageItem(pageId,index,op)}
function customPageFieldLabels(page){return customPagePreset(page)}
const canvas=$('#canvas'),inspector=$('#inspector'),saveState=$('#saveState'),toastEl=$('#toast');
const query=new URLSearchParams(location.search);
const requestedTemplateId=query.get('template')||DEFAULT_TEMPLATE_ID;
const activeTemplate=getTemplate(requestedTemplateId);
const projectId=query.get('project')||'default';
// ?embed=preview shows the template with its sample content as a visitor would see it (used by the template gallery).
const embedPreview=query.get('embed')==='preview';
if(embedPreview)document.documentElement.classList.add('embed-preview');
const initialProjectName=String(query.get('name')||'').trim();
const projectStorageSuffix=projectId==='default'?activeTemplate.id:(activeTemplate.id+':'+projectId);
const STORAGE=embedPreview?'onlyevent-preview-scratch:'+activeTemplate.id:`onlyevent-studio-v8:${projectStorageSuffix}:iframe`,LEGACY_STORAGE='onlyevent-studio-v8:01:iframe',PUBLISH_STORAGE=`onlyevent-studio-publish:${projectStorageSuffix}:iframe`,ORIGIN=location.origin;
let state=structuredClone(activeTemplate.defaults),preview=embedPreview,saveTimer=null,iframe=null,frameReady=false,focusCheckpointTaken=false,currentPage='home',publishIntent='site',publishRecord={};
let hasSavedProject=false;
// The retired creator editor (03/04) stored project-less sessions under ':default:'; move them once.
try{const legacyDefaultKey='onlyevent-studio-v8:'+activeTemplate.id+':default:iframe',legacyDefault=projectId==='default'&&!embedPreview?localStorage.getItem(legacyDefaultKey):null;if(legacyDefault){localStorage.setItem(STORAGE,legacyDefault);localStorage.removeItem(legacyDefaultKey)}}catch{}
if(embedPreview){try{localStorage.removeItem(STORAGE)}catch{}}
try{const saved=localStorage.getItem(STORAGE)||(projectId==='default'&&!embedPreview&&activeTemplate.id===DEFAULT_TEMPLATE_ID?localStorage.getItem(LEGACY_STORAGE):null);if(saved){let parsed=JSON.parse(saved);if(activeTemplate.id==='03-creator-market'||activeTemplate.id==='04-creator-catalogue')parsed=migrateCreatorMarketState(parsed,activeTemplate.defaults);state={...state,...parsed};hasSavedProject=true}}catch{}
if(!hasSavedProject&&initialProjectName)state.eventName=initialProjectName;
migrateDemoEventName(state,projectId);
state.templateId=activeTemplate.id;
state.projectId=projectId;
if(state.eventStatusMode===undefined)state.eventStatusMode=activeTemplate.defaults.eventStatusMode||'auto';
if(state.eventStatus===undefined)state.eventStatus=activeTemplate.defaults.eventStatus||'upcoming';
if(state.eventStartDateTime===undefined)state.eventStartDateTime=activeTemplate.defaults.eventStartDateTime||'';
if(state.eventEndDateTime===undefined)state.eventEndDateTime=activeTemplate.defaults.eventEndDateTime||'';
if(state.heroImage===undefined)state.heroImage=activeTemplate.defaults.heroImage||'';
if(state.templateId==='02-scrapbook')state.heroDisplayMode='wide';
else if(state.heroDisplayMode===undefined)state.heroDisplayMode='poster';
if(state.mobileHeroImage===undefined)state.mobileHeroImage=activeTemplate.defaults.mobileHeroImage||'';
state.seo={...structuredClone(activeTemplate.defaults.seo||{}),...(state.seo||{})};
if(!state.entryAnimation)state.entryAnimation=structuredClone(activeTemplate.defaults.entryAnimation||{enabled:true,showSkip:true,style:'ticket-tear',title:'',subtitle:'SPECIAL EVENT PASS',ticketLabel:'SPECIAL PASS',accent:'#ff5f91',duration:1800});
state.entryAnimation={...structuredClone(activeTemplate.defaults.entryAnimation||{}),...state.entryAnimation};
state.entryAnimation={
  imageMode:'linked',image:'',
  showLabel:true,labelText:'MEMORIAL TICKET',
  showTitle:true,titleText:'',
  showSubtitle:false,subtitleText:'',
  showDate:true,dateText:'',
  showTime:false,timeText:'',
  showLocation:true,locationText:'',
  showBarcode:true,showTicketNumber:true,ticketPrefix:'NO.',
  ...state.entryAnimation
};
delete state.entryAnimation.organizer;
delete state.entryAnimation.serial;
publishRecord=loadPublishRecord(PUBLISH_STORAGE);
if(state.edition===undefined||state.edition==='首届')state.edition=activeTemplate.defaults.edition;
if(state.navigationUrl===undefined)state.navigationUrl=activeTemplate.defaults.navigationUrl;
if(state.modules?.activities===undefined&&state.modules?.stage!==undefined){state.modules.activities=state.modules.stage;delete state.modules.stage}
if(!state.guide||!Array.isArray(state.guide.items))state.guide=structuredClone(activeTemplate.defaults.guide);
const shouldSeedGuide=!state.guideSeedVersion;
state.guide.items=(state.guide.items||[]).map((x,i)=>{
 const preset=x.preset||activeTemplate.defaults.guide.items[i]?.preset||'custom';
 const defaultLabel={traffic:'ACCESS',admission:'ENTRY',facilities:'FACILITY',cosplay:'COSPLAY',safety:'SAFETY'}[preset]||'GUIDE';
 const item={image:'',label:defaultLabel,preset,...x};
 const oldText=GUIDE_OLD_PLACEHOLDER_TEXT[preset],currentText=String(item.text||'').trim();
 if(shouldSeedGuide&&(oldText&&currentText===oldText||!currentText)){
   const example=activeTemplate.defaults.guide.items.find(row=>row.preset===preset)?.text||'';
   if(example)item.text=example;
 }
 return item;
});
if(shouldSeedGuide)state.guideSeedVersion=1;
if(!Array.isArray(state.tickets))state.tickets=structuredClone(activeTemplate.defaults.tickets);
if(state.ticketUrl===undefined)state.ticketUrl=activeTemplate.defaults.ticketUrl;
if(state.ticketLinkLabel===undefined)state.ticketLinkLabel=activeTemplate.defaults.ticketLinkLabel;
if(!Array.isArray(state.ribbonItems)){
 const legacy=[state.ribbon1,state.ribbon2,state.ribbon3,state.ribbon4].map(x=>String(x||'').trim()).filter(Boolean);
 state.ribbonItems=(legacy.length?legacy:activeTemplate.defaults.ribbonItems.map(x=>x.text)).map((text,i)=>({id:'rb'+(i+1),text}));
}
delete state.ribbon1;delete state.ribbon2;delete state.ribbon3;delete state.ribbon4;
if(state.modules&&'passport' in state.modules)delete state.modules.passport;
if(!Array.isArray(state.participation))state.participation=structuredClone(activeTemplate.defaults.participation);
if(!Array.isArray(state.guests))state.guests=[];
if(!state.guestSeedVersion){
 // New projects already inherit template defaults before saved state is merged.
 // If an older saved project explicitly has guests: [], preserve that user choice.
 state.guestSeedVersion=1;
}
if(!state.guestTypeVersion){
 const oldNames=['星野 澪','林 夏','KUROHA','Aoi'];
 const isOldSample=(state.guests||[]).length===4&&(state.guests||[]).every((g,i)=>g?.name===oldNames[i]&&!g?.guestType);
 if(isOldSample)state.guests=structuredClone(activeTemplate.defaults.guests||[]);
 else state.guests=(state.guests||[]).map(g=>({guestType:g.guestType||'person',members:g.members||'',attendanceNote:g.attendanceNote||'',...g}));
 state.guestTypeVersion=1;
}

state.guests=(state.guests||[]).map(g=>{
 const legacyUrl=String(g.socialUrl||'').trim();
 const links=Array.isArray(g.socialLinks)?g.socialLinks.filter(x=>String(x?.url||'').trim()).map(x=>({id:x.id||uid('gl'),url:String(x.url||'').trim()})):(legacyUrl?[{id:uid('gl'),url:legacyUrl}]:[]);
 const next={...g,socialLinks:links};
 delete next.socialLabel;delete next.socialUrl;
 return next;
});
if(!Array.isArray(state.customPages))state.customPages=structuredClone(activeTemplate.defaults.customPages||[]);
state.customPages=(state.customPages||[]).map((p,i)=>{
 const legacyPreset={
   photoStudio:'custom',
   brandZone:'brand',
   ocExpo:'oc',
   craftExpo:'craft',
   experience:'gameDemo',
   themeStreet:'custom',
   checkin:'custom'
 }[p.preset]||p.preset||'custom';
 return {
   id:p.id||('cp'+(i+1)),
   preset:legacyPreset,
   title:p.title||'自定义页面',
   eyebrow:p.eyebrow||'SPECIAL',
   intro:p.intro||'',
   items:Array.isArray(p.items)?p.items:[],
   ...p,
   preset:legacyPreset,
   layout:p.layout||CUSTOM_PAGE_LAYOUTS[legacyPreset]||'gallery'
 };
});
if(!state.venueMap)state.venueMap=structuredClone(activeTemplate.defaults.venueMap);
if(!Array.isArray(state.venueMap.links))state.venueMap.links=structuredClone(activeTemplate.defaults.venueMap.links);
const FIRST_LEVEL_TARGETS=new Set(['booths','activities','guests','guide',...(state.customPages||[]).map(p=>'custom-'+p.id)]);
state.venueMap.links=(state.venueMap.links||[]).map((link,i)=>{
 const legacy={participation:'activities','schedule-home':'activities','map-home':'booths','guide-home':'guide',freewalk:'activities',itasha:'activities'}[link.target];
 const requested=legacy||link.target;
 let target=FIRST_LEVEL_TARGETS.has(requested)?requested:'activities';
 const label=String(link.label||'');
 if(!FIRST_LEVEL_TARGETS.has(requested)){
   if(/摊位/i.test(label))target='booths';
   else target='activities';
 }
 return {id:link.id||('ml'+(i+1)),label:label||'继续探索',target,itemType:link.itemType||'page',itemId:link.itemId||''};
}).filter(link=>!['痛车区','COS 区','COS区'].includes(String(link.label||'').trim()));
delete state.venueMap.points;
const ACTIVITY_PRESET_VERSION=2;
if(Number(state.activityPresetVersion||0)<ACTIVITY_PRESET_VERSION){
 if(!Array.isArray(state.participation))state.participation=[];
 if(!Array.isArray(state.featuredActivities))state.featuredActivities=[];
 state.schedule=Array.isArray(state.schedule)?state.schedule:[];
 state.activityPresetVersion=ACTIVITY_PRESET_VERSION;
 writeJson(STORAGE,state)
}
state.participation=(state.participation||[]).map(item=>{
 const category=item.category||({stage:'舞台',guest:'嘉宾互动',signing:'签售',cosplay:'COS',itasha:'痛车',stamp:'集章',photo:'合影',game:'互动游戏',free:'自由交流'}[item.preset]||'其他');
 const rawMeta=String(item.meta||'').trim(),parts=rawMeta.split(/\s*·\s*/).filter(Boolean);
 const inferredArea=!item.area&&parts.length>1?parts[0]:'';
 const area=item.area||inferredArea||'活动区域';
 const meta=rawMeta.startsWith(area+' · ')?rawMeta.slice(area.length+3).trim():(inferredArea?parts.slice(1).join(' · '):rawMeta);
 const inferredType=item.activityType||({guest:'guest',signing:'signing',stage:'general',game:'interactive',photo:'interactive',stamp:'venue',cosplay:'venue',itasha:'venue'}[item.preset]||'general');
 return {
   image:item.image||'',
   detail:item.detail||item.text||'',
   rules:item.rules||'',
   requirements:item.requirements||'',
   signingRules:item.signingRules||'',
   participationMode:item.participationMode||'自由参加',
   activityType:inferredType,
   activityLocation:item.activityLocation||area||'',
   availabilityNote:item.availabilityNote||'',
   setlist:item.setlist||'',
   ...item,
   category,
   area,
   meta,
   target:'activities',
   guestIds:Array.isArray(item.guestIds)?item.guestIds:[]
 };
});
if(!Array.isArray(state.featuredActivities)||state.featuredActivities.length!==3){
 const legacy=(state.participation||[]).filter(x=>x.featured).map(x=>x.id);
 const fallback=(state.participation||[]).map(x=>x.id);
 const picked=[...legacy,...fallback.filter(id=>!legacy.includes(id))].slice(0,3);
 state.featuredActivities=Array.from({length:3},(_,i)=>({id:'fa'+(i+1),participationId:picked[i]||'',image:''}));
}else{
 state.featuredActivities=state.featuredActivities.slice(0,3).map((x,i)=>({id:x?.id||('fa'+(i+1)),participationId:x?.participationId||'',image:x?.image||''}));
}
state.modules??={};
if(state.templateId==='04-creator-catalogue')state.modules.explore=false;
for(const k of ['booths','activities','guide','freewalk','itasha','ribbon','guests','community','sponsors']){
 if(state.modules[k]===undefined)state.modules[k]=activeTemplate.defaults.modules?.[k]!==false;
}
if(!state.venueMap)state.venueMap=structuredClone(activeTemplate.defaults.venueMap);
if(!Array.isArray(state.updates))state.updates=structuredClone(activeTemplate.defaults.updates);
state.updates=(state.updates||[]).map(item=>({...item,target:({passport:'activities','guide-home':'guide'}[item.target]||item.target||'top')}));
if(!Array.isArray(state.socialLinks))state.socialLinks=structuredClone(activeTemplate.defaults.socialLinks);
if(!Array.isArray(state.sponsors))state.sponsors=structuredClone(activeTemplate.defaults.sponsors);
if(state.sponsors.length===1){
 const x=state.sponsors[0]||{};
 if(String(x.name||'').trim()==='合作伙伴'&&String(x.level||'').trim()==='合作伙伴'&&!String(x.url||'').trim()&&!String(x.logo||'').trim())state.sponsors=[];
}
state.booths=(state.booths||[]).map(b=>{const next={id:b.id||uid('b'),no:b.no||'',name:b.name||'',logo:b.logo||'',type:b.type||'',intro:b.intro||'',...b,products:Array.isArray(b.products)?b.products:[]};next.products=(next.products||[]).map(p=>({id:p.id||uid('p'),name:p.name||'',tag:'',price:p.price||'',note:p.note||'',image:p.image||'',...p}));delete next.pointId;return next});
state.guests=(state.guests||[]).map(g=>({id:g.id||uid('g'),guestType:g.guestType||'person',name:g.name||'',role:g.role||'',members:g.members||'',attendanceNote:g.attendanceNote||'',works:g.works||'',intro:g.intro||'',image:g.image||'',socialLinks:Array.isArray(g.socialLinks)?g.socialLinks:[],...g}));
state.schedule=(state.schedule||[]).map(a=>{const next={id:a.id||uid('s'),day:a.day||'DAY 1',time:a.time||'',endTime:a.endTime||'',title:a.title||'',stage:a.stage||'',detail:a.detail||'',category:a.category||'',guestIds:Array.isArray(a.guestIds)?a.guestIds:[],participationId:a.participationId||'',registrationUrl:a.registrationUrl||'',...a};next.guestIds=Array.isArray(a.guestIds)?a.guestIds:[];next.participationId=a.participationId||'';delete next.locationId;return next});
const toast=createToast(toastEl);
const publishDialog=$('#publishDialog'),publishSlug=$('#publishSlug'),publishPrimary=$('#publishPrimary'),publishStatus=$('#publishStatus'),publishResult=$('#publishResult'),publishUrl=$('#publishUrl');
function syncPublishButton(){
 const label=$('#publishBtnLabel');if(label)label.textContent=hasLiveSite(publishRecord)?'更新网站':'发布网站';
}
function savePublishRecord(next){
 publishRecord={...publishRecord,...next};persistPublishRecord(PUBLISH_STORAGE,publishRecord);syncPublishButton();
}
async function restorePublishFromCloud(){
 try{
  if(!readCloudSession())return;
  if(hasLiveSite(publishRecord)){
   let live=null;
   try{live=await getCloudSite(publishRecord.cloudProjectId)}catch(e){return}
   if(!live){publishRecord={};clearPublishRecord(PUBLISH_STORAGE);syncPublishButton();renderPublishDialog()}
   return;
  }
  const projects=await listCloudProjects();if(!Array.isArray(projects)||!projects.length)return;
  const wanted=String(projectId||''),tpl=String(state.templateId||activeTemplate.id||''),name=String(state.eventName||'').trim();
  let hit=projects.find(p=>p.id===wanted)||projects.find(p=>p.localProjectId===wanted)||projects.find(p=>p.cloudProjectId===wanted);
  if(!hit&&name){const same=projects.filter(p=>String(p.templateId||'')===tpl&&String(p.name||'').trim()===name);if(same.length===1)hit=same[0]}
  if(!hit)return;
  const site=await getCloudSite(hit.id);if(!site)return;
  const slug=site.slug||hit.slug||'',url=site.url||hit.visitorSiteUrl||(slug?'https://'+slug+'.onlyevent.cn':'');
  if(!site.id&&!slug)return;
  savePublishRecord({siteId:site.id||site.siteId,cloudProjectId:hit.id,slug,url,publishedAt:site.publishedAt||hit.publishedAt||new Date().toISOString(),staged:false});
  renderPublishDialog();
 }catch(e){}
}
let renamingSite=false;
// Sharing starts from defaults (event name, intro, key visual); the organizer only decides whether to change them.
$('#publishShareEdit').onclick=()=>openShareDialog();
$('#publishShareReset').onclick=()=>{checkpoint();state.seo??={};state.seo.ogTitle='';state.seo.ogDescription='';state.seo.ogImage='';save();send({type:'OE_REPLACE_STATE',state});renderPublishShare()};
$('#shareDialog').addEventListener('close',renderPublishShare);
$('#publishRecap').onclick=()=>{publishDialog.close();openRecapDialog()};
function renderPublishDialog(){publishUi.render()}
function openPublishDialog(){publishUi.open()}
function setPublishBusy(busy,text=''){publishUi.setBusy(busy,text)}
/* ---- staged reveal: later versions of the site that go live at set times ---- */
const exportWaiters=[];
let pendingStages=null;
const STAGE_MODULES=[['booths','社团'],['activities','活动'],['guests','嘉宾'],['guide',guideLabelText()]];
const stageModuleList=()=>STAGE_MODULES.filter(([k])=>!(activeTemplate.studioPages?.hidden||[]).includes(k)&&state.modules?.[k]!==false);
function exportHtmlFor(st){return new Promise(ok=>{exportWaiters.push(ok);send({type:'OE_REPLACE_STATE',state:st});send({type:'OE_EXPORT_HTML'})})}
async function exportStagedSite(){
 const stages=revealStages(state,stageModuleList()),htmls=[];
 try{for(let k=0;k<=stages.length;k++)htmls.push(await exportHtmlFor(stateAtStage(state,stages,k)))}
 finally{send({type:'OE_REPLACE_STATE',state})}
 pendingStages=stages.map((s,i)=>({at:new Date(s.at).toISOString(),html:htmls[i+1]}));
 publishGeneratedHtml(htmls[0]);
}
const stageUi=createStageUi({$,getState:()=>state,stageModuleList,save,toast,publishChecks});
const {renderStageRows,bindStageRows,refreshPublishChecks}=stageUi;
const publishUi=createPublishUi({
  $, getState:()=>state, getTemplate:()=>activeTemplate, getRecord:()=>publishRecord,
  hasLiveSite, cleanSlug, suggestSlug, publishChecks,
  renderStages:()=>renderStageRows(), renderShare:()=>renderPublishShare(state),
  dialog:publishDialog, slugInput:publishSlug, primary:publishPrimary, status:publishStatus, result:publishResult, url:publishUrl,
  isRenaming:()=>renamingSite, setRenaming:(v)=>{renamingSite=v}
});
const publishFlow=createPublishFlow({
  slugInput:publishSlug, statusEl:publishStatus, getState:()=>state, getTemplate:()=>activeTemplate, getProjectId:()=>projectId,
  getRecord:()=>publishRecord, setRecord:(v)=>{publishRecord=v}, saveRecord:savePublishRecord, clearRecord:()=>clearPublishRecord(PUBLISH_STORAGE), hasLiveSite, syncButton:syncPublishButton,
  cleanSlug, isValidSlug, publishStudioSite, getPending:()=>pendingStages, setPending:(v)=>{pendingStages=v}, setSiteStages,
  setBusy:setPublishBusy, renderDialog:renderPublishDialog, syncAdminProject, toast,
  isRenaming:()=>renamingSite, setRenaming:(v)=>{renamingSite=v}
});
function __stageRowRefresh(e){stageUi.handleRowEvent(e)}

async function publishGeneratedHtml(html){return publishFlow.publish(html)}

function syncStudioIdentity(){renderStudioIdentity(activeTemplate,state.eventName)}
function syncAdminProject(extra={}){
 upsertAdminProject({projectId,templateId:activeTemplate.id,name:state.eventName,extra});
}
const syncContentCounts=createContentCounts({collectionArray});
// Signed-in organizers also keep each project in the Worker (D1), so it follows them across devices.
const cloudSync=createCloudSync({
  getState:()=>state, getTemplate:()=>activeTemplate, getProjectId:()=>projectId, readCloudSession,
  ensureCloudProjectFor, saveCloudConfig, syncAdminProject, saveStateEl:saveState
});
const {available:cloudSyncAvailable, schedule:scheduleCloudSync, sync:syncToCloud}=cloudSync;
let saveImpl;
function save(){saveImpl()}
saveImpl=createSaveController({getState:()=>state,saveStateEl:saveState,storageKey:STORAGE,syncContentCounts,syncStudioIdentity,syncAdminProject,scheduleCloudSync});
const storeCroppedImageImpl=createCroppedImageStore({
  cloudAvailable:cloudSyncAvailable, getTemplateId:()=>activeTemplate.id, getProjectId:()=>projectId, getEventName:()=>state.eventName,
  ensureCloudProjectFor, uploadCloudImage, toast, blobToDataUrl
});
async function storeCroppedImage(blob){return storeCroppedImageImpl(blob)}
// Signed in, cropped images go to R2 instead of filling browser storage with data URLs.
const studioHistory=createStudioHistory({limit:80,onChange:()=>syncHistory()});
 let lastCollection='',lastItemIndex=-1;
function openItemInspector(collection,index){itemInspectorUi.open(collection,index)}
function openProductInspector(boothIndex,productIndex,opts){productUi.product(boothIndex,productIndex,opts)}
function openBoothProductManager(boothIndex){productUi.booth(boothIndex)}

function openCollectionManager(collection,selectedIndex=-1){panelUi.openCollectionManager(collection,selectedIndex)}
function addPresetItem(collection,key){panelUi.addPresetItem(collection,key)}
const historyUi=createHistoryUi(studioHistory,$('#undoBtn'),$('#redoBtn'));
function checkpoint(){historyUi.checkpoint(state)}
function syncHistory(){historyUi.sync()}
function setDeep(path,value){setDeepState(state,path,value);save()}
function getDeep(path){return path.split('.').reduce((o,k)=>o?.[/^\d+$/.test(k)?Number(k):k],state)}
function send(message){if(frameReady&&iframe?.contentWindow)iframe.contentWindow.postMessage(message,ORIGIN)}
function setInspector(kicker,title,html){
 renderInspector(inspector,esc,kicker,title,html);
 inspector?.querySelectorAll('button').forEach(btn=>btn.classList.add('oe-inspector-action'));
 inspector?.querySelectorAll('.inspector-body label').forEach(el=>el.classList.add('oe-inspector-row'));
 inspector?.querySelectorAll('.inspector-body input,.inspector-body select,.inspector-body textarea').forEach(el=>el.classList.add('oe-inspector-control'));
 requestAnimationFrame(()=>{ inspector?.querySelectorAll('.inspector-body label').forEach(el=>el.classList.add('oe-inspector-row')); inspector?.querySelectorAll('.inspector-body input,.inspector-body select,.inspector-body textarea').forEach(el=>el.classList.add('oe-inspector-control')); });
}
function showInspectorEmpty(){
 setInspector('属性','未选择内容','<div class="inspector-empty"><div class="empty-visual"><span></span><span></span><span></span></div><b>从画布或左侧内容库选择内容</b></div>');
}
function setWorkspace(name){
 const target=document.querySelector('[data-workspace-panel="'+name+'"]')?name:'pages';
 document.querySelectorAll('[data-workspace]').forEach(b=>b.classList.toggle('active',b.dataset.workspace===target));
 document.querySelectorAll('[data-workspace-panel]').forEach(p=>{const on=p.dataset.workspacePanel===target;p.hidden=!on;p.classList.toggle('active',on)});
}

const moduleLabels={booths:'摊位',activities:'活动',guests:'嘉宾',guide:guideLabelText()};
function customPageByKey(key){return findCustomPage(state.customPages||[],key)}
function pageLabel(key){return pageLabelFor(key,state.customPages||[],moduleLabels)}
function customPageIndex(id){return pageIndexFor(state.customPages||[],id)}

const contentManagerMeta=createContentManagerMeta({getState:()=>state,pageLabel,guideLabelText});

function buildCustomPageStarterItems(presetKey){return buildStarterItems(presetKey,uid)}
function guideLabelText(){return guideLabelFor(activeTemplate?.id||'')}
function collectionStudioPage(collection){return collectionStudioPageFor(collection,{currentPage,templateId:activeTemplate.id})}

function openOptionalPageInspector(key){optionalPageUi.open(key)}
function openHeroTitleInspector(){simpleInspectorUi.hero()}
function openLifecycleInspector(){simpleInspectorUi.lifecycle()}
function openAddressInspector(){simpleInspectorUi.address()}
function openTicketSettingsInspector(){simpleInspectorUi.ticket()}

function syncCanvasSelection(path){
 if(/^heroTitle|^(?:heroImage|mobileHeroImage)$|^tagline$|^sticker\d+$/.test(path)){syncStudioPageUI('home',{openContent:false});setPageContentActive({tool:'hero'});return}
 if(/^ribbonItems\./.test(path)){syncStudioPageUI('home',{openContent:false});setPageContentActive({collection:'ribbonItems'});return}
 if(/^guide\..+\.image$/.test(path))return {label:'指南配图',ratio:16/9,ratioLabel:'指南配图 · 比例 16:9',width:1600,height:900,fixed:true};
 if(path==='venueMap.image'){syncStudioPageUI('home',{openContent:false});setPageContentActive({tool:'map'});return}
 const map=[
   [/^tickets\.|^ticketUrl$|^ticketLinkLabel$/,'home','tickets'],
   [/^venueMap\.links\./,'home','explore'],
   [/^updates\./,'home','updates'],
   [/^guests\./,state.templateId==='02-scrapbook'?'home':'guests','guests'],
   [/^socialLinks\./,'home','socialLinks'],
   [/^sponsors\./,'home','sponsors'],
   [/^booths\./,'booths','booths'],
   [/^participation\./,collectionStudioPage('activities'),'participation'],
   [/^schedule\./,collectionStudioPage('activities'),'schedule'],
   [/^guide\.items\./,collectionStudioPage('guide'),'guide']
 ];
 const hit=map.find(([re])=>re.test(path));
 if(hit){syncStudioPageUI(hit[1],{openContent:false});setPageContentActive({collection:hit[2]})}
}
function openBannerInspector(){bannerInspectorUi.open()}
function openTrafficInspector(){trafficInspectorUi.open()}
function openEntryAnimationInspector(){entryAnimationUi.open()}
function openStreetManager(){streetUi.open()}
function openPageTool(tool){pageTool(tool)}
function renderPageContentNav(page,{openDefault=true}={}){
 const nav=$('#pageContentNav'),title=$('#pageContentTitle'),panel=$('#contentListPanel'),custom=customPageByKey(page);
 if(title)title.textContent=pageLabel(page)+'内容';
 if(!nav)return;
 if(custom){
   nav.innerHTML=customPageNavHtml((custom.items||[]).length);
   nav.querySelector('[data-custom-page-nav="settings"]')?.addEventListener('click',()=>{nav.querySelectorAll('[data-custom-page-nav]').forEach(x=>x.classList.toggle('active',x.dataset.customPageNav==='settings'));if(panel)panel.innerHTML='';openCustomPageSettings(custom.id)});
   nav.querySelector('[data-custom-page-nav="items"]')?.addEventListener('click',()=>{nav.querySelectorAll('[data-custom-page-nav]').forEach(x=>x.classList.toggle('active',x.dataset.customPageNav==='items'));openCustomPageItemsManager(custom.id)});
   if(panel)panel.innerHTML='<div class="sidebar-content-empty">选择页面设置或展示内容。</div>';
   if(openDefault){nav.querySelector('[data-custom-page-nav="items"]')?.classList.add('active');openCustomPageItemsManager(custom.id)}
   return;
 }
 const visibleItems=pageContentItems({page,state,template:activeTemplate,config:PAGE_CONTENT_CONFIG});
 nav.innerHTML=pageNavHtml(visibleItems,esc);
 syncContentCounts();
 nav.querySelectorAll('[data-page-content-manager]').forEach(btn=>btn.addEventListener('click',()=>openCollectionManager(btn.dataset.pageContentManager)));
 nav.querySelectorAll('[data-page-tool]').forEach(btn=>btn.addEventListener('click',()=>openPageTool(btn.dataset.pageTool)));
 if(panel)panel.innerHTML='<div class="sidebar-content-empty">选择上方内容进行管理。</div>';
 if(openDefault&&visibleItems[0]){
   if(visibleItems[0].collection)openCollectionManager(visibleItems[0].collection);
   else openPageTool(visibleItems[0].tool);
 }
}
function syncStudioPageUI(page,{openContent=true}={}){
 if(page==='guests'&&state.templateId==='02-scrapbook')page='home';
 currentPage=page||'home';
 document.querySelectorAll('.page-nav [data-page]').forEach(btn=>btn.classList.toggle('active',btn.dataset.page===currentPage));
 document.querySelectorAll('[data-page-row]').forEach(row=>row.classList.toggle('active',row.dataset.pageRow===currentPage));
 const title=document.querySelector('.canvas-title b');if(title)title.textContent=pageLabel(currentPage);
 if(openContent)renderPageContentNav(currentPage);
}
function setStudioPage(page,{openContent=true}={}){
 syncStudioPageUI(page,{openContent});
 if(currentPage==='animation'){
   send({type:'OE_SHOW_PAGE',page:'home'});
   send({type:'OE_PREVIEW_ENTRY',state,play:false});
 }else{
   send({type:'OE_HIDE_ENTRY_PREVIEW'});
   send({type:'OE_SHOW_PAGE',page:currentPage});
 }
}
function bindModuleControls(){
 document.querySelectorAll('[data-module]').forEach(input=>input.addEventListener('change',()=>{
   checkpoint();state.modules??={};state.modules[input.dataset.module]=input.checked;save();
   if(!input.checked&&currentPage===input.dataset.module)setStudioPage('home');
   syncModuleControls();send({type:'OE_REPLACE_STATE',state});
 }));
}

function mountFrame(){canvas.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/render.html" title="OnlyEvent live canvas"></iframe>';iframe=$('#liveFrame')}
window.addEventListener('message',e=>{
 if(e.origin!==ORIGIN||e.source!==iframe?.contentWindow)return;
 const m=e.data||{};
 if(m.type==='OE_READY'){frameReady=true;send({type:'OE_INIT_STATE',state,mode:preview?'preview':'edit',page:currentPage});return}
 if(m.type==='OE_RENDER_ERROR'){toast(m.stage==='fallback'?'预览加载失败':'模块加载异常，已自动切换安全渲染');return}
 if(m.type==='OE_PAGE_NAVIGATED'){
   const page=String(m.page||'home');
   if(currentPage==='animation')return;
   if(page===currentPage)return;
   setWorkspace('pages');syncStudioPageUI(page,{openContent:true});showInspectorEmpty();
   return
 }
 if(m.type==='OE_SELECT_FIELD'){document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.remove('active'));syncCanvasSelection(m.path);focusCheckpointTaken=false;openFieldInspector(m.path);openInspectorSheetOnPhone();return}
 if(m.type==='OE_FIELD_FOCUS'){if(!focusCheckpointTaken){checkpoint();focusCheckpointTaken=true}return}
 if(m.type==='OE_FIELD_CHANGE'){
 setDeep(m.path,m.value);
 send({type:'OE_PATCH_FIELD',path:m.path,value:m.value});
 const f=$('#fieldInput');if(f&&f.dataset.path===m.path)f.value=m.value;
 const linked=inspector.querySelector('[data-sync-path="'+CSS.escape(m.path)+'"]');if(linked)linked.value=m.value;
 return
}
 if(m.type==='OE_SELECT_IMAGE'){document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.remove('active'));syncCanvasSelection(m.path);openImageInspector(m.path);return}
 if(m.type==='OE_SELECT_CUSTOM_PAGE'){
   const key=customPageKey(m.pageId);setWorkspace('pages');syncStudioPageUI(key,{openContent:false});renderPageContentNav(key,{openDefault:false});openCustomPageSettings(m.pageId);return
 }
 if(m.type==='OE_SELECT_CUSTOM_ITEM'){
   const key=customPageKey(m.pageId);setWorkspace('pages');syncStudioPageUI(key,{openContent:false});renderPageContentNav(key,{openDefault:false});
   const nav=$('#pageContentNav');nav?.querySelector('[data-custom-page-nav="items"]')?.classList.add('active');
   openCustomPageItemsManager(m.pageId,m.index);openCustomPageItemInspector(m.pageId,m.index);return
 }
 if(m.type==='OE_SELECT_COLLECTION'){
   const page=collectionStudioPage(m.collection);
   setWorkspace('pages');syncStudioPageUI(page,{openContent:false});renderPageContentNav(page,{openDefault:false});
   openCollectionManager(m.collection);setPageContentActive({collection:m.collection});showInspectorEmpty();return
 }
 if(m.type==='OE_SELECT_ITEM'){
   const page=collectionStudioPage(m.collection);
   setWorkspace('pages');syncStudioPageUI(page,{openContent:false});renderPageContentNav(page,{openDefault:false});
   openCollectionManager(m.collection,m.index);setPageContentActive({collection:m.collection});openItemInspector(m.collection,m.index);return
 }
 if(m.type==='OE_SELECT_PRODUCT'){
   const boothIndex=Number(m.boothIndex),productIndex=Number(m.productIndex);
   if(!Number.isInteger(boothIndex)||!Number.isInteger(productIndex))return;
   setWorkspace('pages');syncStudioPageUI('booths',{openContent:false});renderPageContentNav('booths',{openDefault:false});
   openCollectionManager('booths',boothIndex);setPageContentActive({collection:'booths'});
   openProductInspector(boothIndex,productIndex,{focusImage:!!m.focusImage});
   return
 }

 if(m.type==='OE_EXPORT_HTML_RESULT'){if(exportWaiters.length){exportWaiters.shift()(m.html);return}if(publishIntent==='download'){publishIntent='site';downloadPublishedHtml(m.html)}else publishGeneratedHtml(m.html);return}
});
function downloadPublishedHtml(html){
 downloadStudioHtml(html,state.eventName||'onlyevent');
 toast('已生成游客站');
}

function bindInspectorStateInput(input,path,{clean=false,number=false}={}){
 return bindStudioField(input,{
  path,checkpoint,
  parseValue:number?Number:undefined,
  cleanValue:clean?cleanValue:undefined,
  update:(field,value)=>{setDeep(field,value);send({type:'OE_PATCH_FIELD',path:field,value})},
 });
}


/* ---- live updates and recap ---- */
const recapDialog=$('#recapDialog');
const recapUi=createRecapDialog({$,getState:()=>state,recapDialog,recapCommit:(...args)=>recapCommit(...args),uid,checkpoint});
function openRecapDialog(){recapUi.open()}
function renderRecapDialog(){recapUi.render()}
function bindRecapDialog(){recapUi.bind()}
const shareDialog=$('#shareDialog');
const shareUi=createShareDialog({
  $, getState:()=>state, getRecord:()=>publishRecord, shareDialog, PROMO_CHANNELS, esc,
  checkpoint, save, send, bindInspectorStateInput, toast, qrSvg, downloadSvg, shareTextFor
});
function shareText(){return shareTextFor(state,publishRecord)}
function renderShareDialog(){shareUi.render()}
function openShareDialog(){shareUi.open()}
function openSeoInspector(){shareUi.openSeo()}
const recapCommit=({structural=false}={})=>{save();send({type:'OE_REPLACE_STATE',state});if(structural)renderRecapDialog()};

function openFieldInspector(path){fieldInspectorUi.open(path)}

function uid(prefix){return prefix+Math.random().toString(36).slice(2,8)}
function fitTextarea(el){if(!el)return;el.style.height='auto';el.style.height=Math.max(36,el.scrollHeight)+'px'}
function cleanValue(v){return String(v??'').split('\n').map(x=>x.trimEnd()).join('\n').replace(/^\s*\n+/,'').replace(/\n+\s*$/,'').trim()}
function guestPlatformName(url){
 const raw=String(url||'').trim();if(!raw)return '未填写';
 let host='';
 try{host=new URL(/^https?:\/\//i.test(raw)?raw:'https://'+raw).hostname.toLowerCase().replace(/^www\./,'')}catch{}
 if(/(^|\.)bilibili\.com$/.test(host)||host==='b23.tv')return 'Bilibili';
 if(/(^|\.)xiaohongshu\.com$/.test(host)||host==='xhslink.com')return '小红书';
 if(/(^|\.)douyin\.com$/.test(host)||host==='v.douyin.com')return '抖音';
 if(/(^|\.)weibo\.com$/.test(host)||host==='weibo.cn')return '微博';
 if(host==='x.com'||host==='twitter.com'||host.endsWith('.twitter.com'))return 'X / Twitter';
 if(host==='youtube.com'||host.endsWith('.youtube.com')||host==='youtu.be')return 'YouTube';
 if(host==='instagram.com'||host.endsWith('.instagram.com'))return 'Instagram';
 if(host==='tiktok.com'||host.endsWith('.tiktok.com'))return 'TikTok';
 if(host==='pixiv.net'||host.endsWith('.pixiv.net'))return 'Pixiv';
 if(host==='lofter.com'||host.endsWith('.lofter.com'))return 'LOFTER';
 if(host==='facebook.com'||host.endsWith('.facebook.com'))return 'Facebook';
 if(host==='twitch.tv'||host.endsWith('.twitch.tv'))return 'Twitch';
 return host||'个人主页';
}

function collectionArray(collection){return collectionArrayFor(collection,state)}
function collectionPath(collection,index,key){return collectionPathFor(collection,index,key)}
function extraInspector(collection,index,item){return extraInspectorHtml(collection,index,item,state,{esc,guideLabelText,customPageKey})}

function moveBoothProduct(boothIndex,productIndex,dir){
 const booth=state.booths?.[boothIndex],products=booth?.products||[],next=productIndex+Number(dir||0);
 if(!booth||productIndex<0||next<0||next>=products.length||productIndex===next)return;
 checkpoint();[products[productIndex],products[next]]=[products[next],products[productIndex]];
 save();send({type:'OE_REPLACE_STATE',state});openBoothProductManager(boothIndex);
}
function addBoothProduct(boothIndex){
 const booth=state.booths?.[boothIndex];if(!booth)return;
 checkpoint();booth.products??=[];
 booth.products.push({id:uid('p'),name:'新制品',tag:'',price:'',note:'',image:''});
 const productIndex=booth.products.length-1;
 save();send({type:'OE_REPLACE_STATE',state});
 openProductInspector(boothIndex,productIndex);
}
function clearExploreItemRef(itemType,itemId){
 (state.venueMap?.links||[]).forEach(link=>{
   if(link.itemType===itemType&&String(link.itemId||'')===String(itemId||'')){link.itemType='page';link.itemId=''}
 });
}
function cleanupDeletedReferences(collection,item){cleanupDeletedReferencesIn(state,collection,item,clearExploreItemRef)}
function mutateItem(collection,index,op){return itemMutations(collection,index,op)}
function liveImageFrameRatio(path){
 try{
  const doc=iframe?.contentDocument;if(!doc)return 0;
  let el=null,loader=null,oldDisplay='',wasHidden=false;
  if(/^entryAnimation\.kv/.test(path)){
   loader=doc.querySelector('#loader');
   if(loader){oldDisplay=loader.style.display;wasHidden=loader.classList.contains('hide');loader.style.display='grid';loader.classList.remove('hide')}
   el=doc.querySelector('.loader .entry-photo')||doc.querySelector('.entry-photo');
  }else if(path==='heroImage'||path==='mobileHeroImage'){
   el=doc.querySelector('.kv');
  }else{
   el=doc.querySelector('[data-oe-field="'+path+'"]')||doc.querySelector('[data-oe-image="'+path+'"]');
  }
  if(!el)return 0;
  const r=el.getBoundingClientRect(),ratio=r.width/r.height;
  if(loader){loader.style.display=oldDisplay;if(wasHidden)loader.classList.add('hide')}
  if(!Number.isFinite(ratio)||ratio<0.25||ratio>4)return 0;
  return ratio;
 }catch{return 0}
}
function imageSlotConfigBase(path){return imageSlotConfigBaseFor(path,{templateId:state.templateId,state,viewportWidth:window.innerWidth,presets:CUSTOM_PAGE_PRESETS})}
// Extra venue maps: with more than one map, visitors swipe between them on every template.
function imageSlotConfig(path){return resolveImageSlotConfig(imageSlotConfigBase(path),liveImageFrameRatio(path))}

function moreMapsMarkup(){
 const more=state.venueMap?.more||[];
 return '<div class="item-media more-maps-editor"><span>更多场地图（多张时游客可左右滑动）</span>'+
  more.map((m,i)=>'<div class="item-media-row" data-more-map="'+i+'">'+(m.image?'<img src="'+esc(m.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+
   '<div><input data-more-map-title="'+i+'" value="'+esc(m.title||'')+'" placeholder="名称，例如 二层 / B 馆" aria-label="场地图名称"><button type="button" data-more-map-replace="'+i+'">'+(m.image?'替换图片':'选择 / 裁剪')+'</button><button type="button" class="ghost danger" data-more-map-remove="'+i+'">移除</button></div></div>').join('')+
  '<button type="button" class="ghost" id="addMoreMap">＋ 添加一张场地图</button></div>';
}
function bindMoreMaps(){
 const pick=i=>{$('#imageInput').dataset.path='venueMap.more.'+i+'.image';$('#imageInput').click()};
 const refresh=()=>{send({type:'OE_REPLACE_STATE',state});openImageInspector('venueMap.image')};
 inspector.querySelectorAll('[data-more-map-replace]').forEach(b=>b.addEventListener('click',()=>pick(Number(b.dataset.moreMapReplace))));
 inspector.querySelectorAll('[data-more-map-remove]').forEach(b=>b.addEventListener('click',()=>{checkpoint();state.venueMap.more.splice(Number(b.dataset.moreMapRemove),1);save();refresh()}));
 inspector.querySelectorAll('[data-more-map-title]').forEach(input=>input.addEventListener('change',()=>{checkpoint();setDeep('venueMap.more.'+input.dataset.moreMapTitle+'.title',input.value);send({type:'OE_REPLACE_STATE',state})}));
 $('#addMoreMap')?.addEventListener('click',()=>{checkpoint();state.venueMap.more??=[];state.venueMap.more.push({id:uid('map'),title:'',image:''});save();openImageInspector('venueMap.image');pick(state.venueMap.more.length-1)});
}
function openImageInspector(path){imageInspectorUi.open(path)}
function openImageCropper(src,path,returnCollection,returnIndex,ownedUrl){cropperUi.open(src,path,returnCollection,returnIndex,ownedUrl)}
function closeImageCropper(){cropperUi.close()}

const cropperUi=createImageCropper({$,getState:()=>state,send,setDeep,checkpoint,toast,storeCroppedImage,imageSlotConfig,createStudioCropper,loadStudioCropper,openImageInspector,renderRecapDialog,openCustomPageItemInspector,openProductInspector,openItemInspector});
cropperUi.bind();
initDeviceControls({$,canvas,setStudioDevice});
function __openPreviewTab(){
 const projectId=state.projectId||'default';
 const templateId=state.templateId||'08-birthday';
 writeJson('oe-preview-state:'+templateId+':'+projectId,state)
 const url='/v8/preview.html?template='+encodeURIComponent(templateId)+'&project='+encodeURIComponent(projectId);
 const win=window.open(url,'oe-preview-'+projectId);
 if(!win)toast('浏览器拦截了新标签，请允许弹窗后再点预览');else toast('预览已在新标签打开');
}
function setPreview(next){
 if(next){__openPreviewTab();return}
 toast('预览已在新标签打开；关闭预览标签页即可回到编辑');
}
$('#previewBtn').onclick=()=>setPreview(!preview);
if(embedPreview)setStudioPreviewChrome(true);
$('#createCustomPageBtn').onclick=openCustomPageCreator;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&preview)setPreview(false)});
$('.page-nav')?.addEventListener('click',e=>{
 const b=e.target.closest('[data-page]');if(!b)return;
 setWorkspace('pages');setStudioPage(b.dataset.page);
});
function reconcilePageAfterHistory(){
 if(String(currentPage).startsWith('custom-')&&!customPageByKey(currentPage)){setStudioPage('home');return}
 if(String(currentPage).startsWith('custom-'))renderPageContentNav(currentPage,{openDefault:false});
}
$('#undoBtn').onclick=()=>{const next=studioHistory.undo(state);if(!next)return;state=next;renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});save();syncHistory();syncContentCounts();reconcilePageAfterHistory()
  try{const rows=collectionArray(lastCollection);if(lastCollection&&Array.isArray(rows)){if(lastItemIndex>=0&&lastItemIndex<rows.length){openCollectionManager(lastCollection,lastItemIndex);openItemInspector(lastCollection,lastItemIndex)}else{openCollectionManager(lastCollection)}}}catch(e){}
};
$('#redoBtn').onclick=()=>{const next=studioHistory.redo(state);if(!next)return;state=next;renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});save();syncHistory();syncContentCounts();reconcilePageAfterHistory()
  try{const rows=collectionArray(lastCollection);if(lastCollection&&Array.isArray(rows)){if(lastItemIndex>=0&&lastItemIndex<rows.length){openCollectionManager(lastCollection,lastItemIndex);openItemInspector(lastCollection,lastItemIndex)}else{openCollectionManager(lastCollection)}}}catch(e){console.warn("[history refresh]",e&&e.message||e)}
};
$('#backAdminBtn')?.addEventListener('click',()=>{location.href='/admin/'});
$('#publishBtn').onclick=openPublishDialog;
$('#publishClose').onclick=()=>publishDialog.close();
$('#publishCancel').onclick=()=>publishDialog.close();
publishPrimary.onclick=()=>{
 publishIntent='site';
 if(revealStages(state,stageModuleList()).length){setPublishBusy(true,'正在生成各批页面…');exportStagedSite();return}
 pendingStages=publishRecord?.staged?[]:null;send({type:'OE_EXPORT_HTML'});
};
const __dlBtn=$('#publishDownload');if(__dlBtn)__dlBtn.onclick=()=>{publishIntent='download';send({type:'OE_EXPORT_HTML'})};
$('#publishOpen').onclick=()=>{if(publishRecord?.url)window.open(publishRecord.url,'_blank','noopener')};
$('#shareBtn').onclick=openShareDialog;$('#shareClose').onclick=()=>shareDialog.close();$('#publishShare').onclick=()=>{publishDialog.close?.();openShareDialog()};
$('#publishCopy').onclick=async()=>{if(!publishRecord?.url)return;try{await navigator.clipboard.writeText(publishRecord.url);toast('链接已复制')}catch{toast('复制失败')}};
$('#publishRename').addEventListener('click',()=>{renamingSite=true;renderPublishDialog();publishSlug.disabled=false;publishSlug.focus();publishSlug.select()});
publishSlug.addEventListener('input',()=>{const clean=cleanSlug(publishSlug.value);if(clean!==publishSlug.value)publishSlug.value=clean});
if(projectId!=='default'&&!hasSavedProject){writeJson(STORAGE,state);syncAdminProject()}
const pageTool=createPageTool({$,setPageContentActive,openEntryAnimationInspector,openAddressInspector,openLifecycleInspector,openHeroTitleInspector,openBannerInspector,openImageInspector,openTrafficInspector,openFieldInspector,openSeoInspector,openRecapDialog,openStreetManager,openOptionalPageInspector,showInspectorEmpty});
function presetEntriesFor(collection){return presetEntriesForState(collection,state.templateId,GUIDE_PRESETS,PARTICIPATION_PRESETS)}
const imageInspectorUi=createImageInspector({$,getState:()=>state,getDeep,setInspector,inspector,esc,moreMapsMarkup,bindMoreMaps,openCollectionManager,setPageContentActive,mutateItem,checkpoint,setDeep,save,send,openImageCropper,toast});
const entryAnimationUi=createEntryAnimationInspector({$,getState:()=>state,setInspector,inspector,esc,checkpoint,save,send});
const streetUi=createStreetManager({$,getState:()=>state,setInspector,inspector,esc,checkpoint,save,send});
const productUi=createProductInspector({$,getState:()=>state,setInspector,inspector,esc,fitTextarea,checkpoint,save,send,cleanValue,openBoothProductManager,openImageCropper,openItemInspector,moveBoothProduct,addBoothProduct});
const itemMutations=createItemMutations({getState:()=>state,collectionArray,checkpoint,cleanupDeletedReferences,save,send,syncContentCounts,openCollectionManager,openItemInspector,showInspectorEmpty,uid,syncModuleControls:()=>syncModuleControls()});
const itemInspectorUi=createItemInspector({$,getState:()=>state,setLast:(c,i)=>{lastCollection=c;lastItemIndex=i},collectionMeta,collectionArray,isItemLongField,participationInspectorFields,itemMediaPanels,contentManagerMeta,itemActionsHtml,setInspector,esc,itemInspectorHeadHtml,itemFieldsHtml,extraInspector,fitTextarea,inspector,send,checkpoint,save,collectionPath,cleanValue,setDeep,openCollectionManager,setPageContentActive,mutateItem,addBoothProduct,openBoothProductManager,uid,guestPlatformName});
const panelUi=createCollectionPanel({$,state,contentManagerMeta,collectionArray,setInspector,setPageContentActive,renderStudioCollectionRows,esc,presetEntriesFor,contentThumb,openItemInspector,checkpoint,uid,save,send,GUIDE_PRESETS,PARTICIPATION_PRESETS,setLast:(c,i)=>{lastCollection=c;if(i>=0)lastItemIndex=i},syncContentCounts,presetEntriesFor,syncModuleControls:()=>syncModuleControls(),mutateItem});
const fieldInspectorUi=createFieldInspector({$,getState:()=>state,setInspector,inspector,esc,setWorkspace,syncStudioPageUI,renderPageContentNav,openCollectionManager,setPageContentActive,openItemInspector,openTicketSettingsInspector,openAddressInspector,openLifecycleInspector,openSeoInspector,openHeroTitleInspector,setDeep,send,getDeep,fitTextarea,cleanValue,save,checkpoint});
const simpleInspectorUi=createSimpleInspectors({$,getState:()=>state,getTemplate:()=>activeTemplate,setInspector,inspector,esc,PALETTES,bindInspectorStateInput,checkpoint,setDeep,save,send,toast});
const optionalPageUi=createOptionalPageInspector({$,getState:()=>state,setInspector,inspector,esc,bindInspectorStateInput,checkpoint,setDeep,send});
const bannerInspectorUi=createBannerInspector({$,getState:()=>state,setInspector,inspector,esc,checkpoint,setDeep,save,send});
const trafficInspectorUi=createTrafficInspector({$,getState:()=>state,setInspector,inspector,esc,checkpoint,save,send});
customPagesUi=createCustomPages({
  $, inspector, getState:()=>state, getCurrentPage:()=>currentPage, customPageKey, customPageIndex, customPageFieldLabels, CUSTOM_PAGE_PRESETS, CUSTOM_PAGE_LAYOUTS, buildCustomPageStarterItems, uid, checkpoint, save, send, setStudioPage, syncStudioPageUI, syncContentCounts, toast, showInspectorEmpty, bindInspectorStateInput, setInspector, esc, customPageRowsHtml, customPageSettingsHtml, customPageItemsPanelHtml, customPageItemInspectorHtml, escapeHtml:esc
});
const syncModuleControls=createModuleControls({getState:()=>state,getTemplate:()=>activeTemplate,guideLabelText});
syncStudioIdentity();syncPublishButton();renderCustomPageRows();syncModuleControls();syncContentCounts();setWorkspace('pages');bindModuleControls();bindStageRows();bindRecapDialog();$('#recapClose').onclick=()=>recapDialog.close();mountFrame();syncHistory();setStudioPage('home');

/* Shared mobile drawers, identical across every template. */
restorePublishFromCloud();



const __cleanGuestPanels=()=>{document.querySelectorAll('.inspector .reference-panel').forEach(p=>{const tpl=String(state.templateId||'');const t=(p.querySelector('b')?.textContent||'').trim();if(/^0[56]/.test(tpl)&&(t==='嘉宾类型'||t==='关联活动'))p.remove()})};
try{new MutationObserver(__cleanGuestPanels).observe(document.body,{childList:true,subtree:true})}catch(e){}






const __homeEntryClick=(e)=>{
 let el=e.target;
 while(el&&el!==document.body){
  const txt=(el.textContent||'').trim();
  const keys=['现场活动','出演阵容','观演秩序','活动日程'];
  const hit=(txt.length<=18&&!el.closest('.inspector'))?keys.find(k=>txt.startsWith(k)):null;
  if(hit){
   const map={'现场活动':'participation','出演阵容':'guests','观演秩序':'guide','活动日程':'schedule'};
   e.preventDefault();e.stopPropagation();
   try{openCollectionManager(map[hit])}catch(err){console.warn('[home entry]',err)}
   return;
  }
  el=el.parentElement;
 }
};
document.addEventListener('click',__homeEntryClick,true);





/* 07/08 do not ship an entry-animation page: remove the row instead of hiding it */
const __dropAnimationPage=()=>{if(!/^0[78]/.test(String(state.templateId||'')))return;document.querySelectorAll('[data-page="animation"],.page-nav [data-market-page="animation"]').forEach(el=>el.remove())};
try{new MutationObserver(__dropAnimationPage).observe(document.body,{childList:true,subtree:true});__dropAnimationPage()}catch(e){}


/* 导出 HTML 已废弃：只保留网站链接发布 */
const __removeExportHtml=()=>{document.querySelectorAll('#publishDownload,[data-export-html]').forEach(el=>el.remove())};
try{new MutationObserver(__removeExportHtml).observe(document.body,{childList:true,subtree:true});__removeExportHtml()}catch(e){}

try{document.addEventListener('input',__stageRowRefresh);document.addEventListener('change',__stageRowRefresh)}catch(e){}

const __stageAddRefresh=e=>{if(!e.target.closest?.('#stageAdd')&&!e.target.closest?.('.stage-remove'))return;setTimeout(()=>{try{refreshPublishChecks()}catch(err){}},0)};
try{document.addEventListener('click',__stageAddRefresh,true)}catch(e){}

try{const __vv=window.visualViewport;if(__vv){const __syncKb=()=>{const kb=Math.max(0,window.innerHeight-__vv.height-(__vv.offsetTop||0));document.documentElement.style.setProperty('--kb-inset',kb+'px')};__vv.addEventListener('resize',__syncKb);__vv.addEventListener('scroll',__syncKb);__syncKb()}}catch(e){}



try{
 if(innerWidth<=820){
  const done=document.createElement('button');done.id='mobileKeyboardDone';done.type='button';done.textContent='完成';
  document.body.appendChild(done);
  const syncDone=()=>{const kb=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--kb-inset'))||0;done.hidden=kb<80};
  const vv=window.visualViewport;if(vv){vv.addEventListener('resize',syncDone);vv.addEventListener('scroll',syncDone)}
  syncDone();
  done.addEventListener('click',()=>{try{document.activeElement&&document.activeElement.blur()}catch(e){};try{window.frames[0].postMessage({type:'OE_BLUR'},'*')}catch(e){};try{send({type:'OE_BLUR'})}catch(e){}});
 }
}catch(e){}

try{const __vv=window.visualViewport;if(__vv){const __syncSafari=()=>{const docH=document.documentElement.clientHeight||window.innerHeight;const extra=Math.min(140,Math.max(0,docH-__vv.height,window.innerHeight-(__vv.height+(__vv.offsetTop||0))));document.documentElement.style.setProperty('--safari-inset',extra+'px')};__vv.addEventListener('resize',__syncSafari);__vv.addEventListener('scroll',__syncSafari);window.addEventListener('orientationchange',()=>setTimeout(__syncSafari,300));__syncSafari()}}catch(e){}


function openInspectorSheetOnPhone(){if(document.querySelector('#mNativeApp'))document.dispatchEvent(new CustomEvent('oe-mobile-open-fields'))}
try{
 const __mediaTapOpenPicker=e=>{
  const box=e.target.closest&&e.target.closest('.inspector .item-media,.inspector .item-media-empty');
  if(!box||e.target.closest('button,input,textarea,select,a'))return;
  const btn=document.querySelector('.inspector #replaceImage');
  if(btn){e.preventDefault();btn.click()}
 };
 document.addEventListener('click',__mediaTapOpenPicker,false);
}catch(e){}
