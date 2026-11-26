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
import {streetManagerHtml} from '/v8/editor/studio-street-manager-html.js';
import {productInspectorHtml} from '/v8/editor/studio-product-inspector-html.js';
import {collectionMeta} from '/v8/editor/studio-collection-meta.js';
import {participationInspectorFields} from '/v8/editor/studio-participation-fields.js';
import {shareDialogHtml} from '/v8/editor/studio-share-dialog-html.js';
import {shareTextFor} from '/v8/editor/studio-share-text.js';
import {ticketSettingsInspectorHtml} from '/v8/editor/studio-ticket-inspector-html.js';
import {addressInspectorHtml} from '/v8/editor/studio-address-inspector-html.js';
import {lifecycleInspectorHtml} from '/v8/editor/studio-lifecycle-inspector-html.js';
import {heroTitleInspectorHtml} from '/v8/editor/studio-hero-title-inspector-html.js';
import {taglineEditorHtml,fieldEditorHtml} from '/v8/editor/studio-field-inspector-html.js';
import {PALETTES} from '/v8/editor/studio-palettes.js';
import {recapDialogHtml} from '/v8/editor/studio-recap-dialog-html.js';
import {cropSelectionInside} from '/v8/editor/studio-crop-helpers.js';
import {imageSlotConfigBaseFor} from '/v8/editor/studio-image-slot-config.js';
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
function save(){saveState.textContent='保存中…';syncContentCounts();syncStudioIdentity();clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem(STORAGE,JSON.stringify(state));syncAdminProject();saveState.textContent='已保存';scheduleCloudSync()}catch{saveState.textContent='保存失败：图片过大或浏览器存储不足'}},180)}
// Signed-in organizers also keep each project in the Worker (D1), so it follows them across devices.
const cloudSync=createCloudSync({
  getState:()=>state, getTemplate:()=>activeTemplate, getProjectId:()=>projectId, readCloudSession,
  ensureCloudProjectFor, saveCloudConfig, syncAdminProject, saveStateEl:saveState
});
const {available:cloudSyncAvailable, schedule:scheduleCloudSync, sync:syncToCloud}=cloudSync;
const storeCroppedImageImpl=createCroppedImageStore({
  cloudAvailable:cloudSyncAvailable, getTemplateId:()=>activeTemplate.id, getProjectId:()=>projectId, getEventName:()=>state.eventName,
  ensureCloudProjectFor, uploadCloudImage, toast, blobToDataUrl
});
async function storeCroppedImage(blob){return storeCroppedImageImpl(blob)}
// Signed in, cropped images go to R2 instead of filling browser storage with data URLs.
const studioHistory=createStudioHistory({limit:80,onChange:()=>syncHistory()});
 let lastCollection='',lastItemIndex=-1;
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

function renderCustomPageRows(){
 const box=$('#customPageRows');if(!box)return;
 const pages=state.customPages||[];
 box.innerHTML=customPageRowsHtml(pages,{customPageKey,presets:CUSTOM_PAGE_PRESETS,escapeHtml:esc});

 box.querySelectorAll('[data-move-custom-page]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();moveCustomPage(btn.dataset.moveCustomPage,Number(btn.dataset.dir))}));
 box.querySelectorAll('[data-delete-custom-page-row]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();removeCustomPage(btn.dataset.deleteCustomPageRow)}));
}
function openCustomPageCreator(){
 setInspector('创建页面','选择页面预设',
   '<div class="custom-page-preset-grid">'+Object.entries(CUSTOM_PAGE_PRESETS).map(([key,p])=>
     '<button type="button" class="custom-page-preset" data-custom-page-preset="'+key+'"><b>'+esc(p.title)+'</b><small>'+esc(p.intro)+'</small></button>'
   ).join('')+'</div><p class="inspector-note">创建后会作为一级页面出现在游客导航，也可以被「继续探索」直接关联。</p>');
 inspector.querySelectorAll('[data-custom-page-preset]').forEach(btn=>btn.addEventListener('click',()=>createCustomPage(btn.dataset.customPagePreset)));
}
function moveCustomPage(pageId,dir){
 const pages=state.customPages||[],index=customPageIndex(pageId),next=index+Number(dir||0);
 if(index<0||next<0||next>=pages.length||index===next)return;
 checkpoint();[pages[index],pages[next]]=[pages[next],pages[index]];
 save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});
 syncStudioPageUI(currentPage,{openContent:false});
}
function createCustomPage(presetKey){
 const preset=CUSTOM_PAGE_PRESETS[presetKey]||CUSTOM_PAGE_PRESETS.custom;
 checkpoint();
 const page={id:uid('cp'),preset:presetKey,layout:CUSTOM_PAGE_LAYOUTS[presetKey]||'gallery',title:preset.title,eyebrow:preset.eyebrow,intro:preset.intro,ratio:preset.ratio||1.333333,items:buildCustomPageStarterItems(presetKey)};
 state.customPages??=[];state.customPages.push(page);save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});
 setStudioPage(customPageKey(page.id));
}
function customPageFieldLabels(page){return customPagePreset(page)}
function removeCustomPage(pageId){
 const i=customPageIndex(pageId),page=state.customPages?.[i];if(i<0||!page)return;
 checkpoint();
 const key=customPageKey(page.id);
 state.customPages.splice(i,1);
 (state.venueMap?.links||[]).forEach(link=>{if(link.target===key){link.target='activities';link.itemType='page';link.itemId=''}});
 save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});syncContentCounts();
 if(currentPage===key)setStudioPage('home');
 toast('页面已删除，可使用撤销恢复');
}
function openCustomPageSettings(pageId){
 const i=customPageIndex(pageId),page=state.customPages?.[i];if(i<0||!page)return;
 setInspector('专题页面',page.title,customPageSettingsHtml(page,(CUSTOM_PAGE_PRESETS[page.preset]||CUSTOM_PAGE_PRESETS.custom),esc));
 inspector.querySelectorAll('[data-custom-page-field]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{
     if(!started){checkpoint();started=true}
     page[e.target.dataset.customPageField]=e.target.value;save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});
     const title=document.querySelector('.canvas-title b');if(title&&currentPage===customPageKey(page.id))title.textContent=page.title||'专题页面';
   });
 });
 inspector.querySelector('[data-delete-custom-page]')?.addEventListener('click',()=>removeCustomPage(page.id));
}
function openCustomPageItemsManager(pageId,selectedIndex=-1){
 const page=state.customPages?.[customPageIndex(pageId)],panel=$('#contentListPanel');if(!page||!panel)return;
 const preset=customPageFieldLabels(page),items=page.items||[];
 panel.innerHTML=customPageItemsPanelHtml(items,preset,selectedIndex,esc);
 panel.querySelectorAll('[data-custom-item-index]').forEach(btn=>btn.onclick=()=>openCustomPageItemInspector(pageId,Number(btn.dataset.customItemIndex)));
 panel.querySelector('[data-add-custom-item]')?.addEventListener('click',()=>mutateCustomPageItem(pageId,items.length-1,'add'));
}
function openCustomPageItemInspector(pageId,index){
 const pi=customPageIndex(pageId),page=state.customPages?.[pi],item=page?.items?.[index];if(pi<0||!page||!item)return;
 const preset=customPageFieldLabels(page),path='customPages.'+pi+'.items.'+index;
 const image=item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
 setInspector('专题内容',preset.itemTitle+' · '+(item.title||String(index+1)),customPageItemInspectorHtml(page,item,index,preset,esc));
 inspector.querySelectorAll('[data-custom-item-field]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{if(!started){checkpoint();started=true}item[e.target.dataset.customItemField]=e.target.value;save();send({type:'OE_REPLACE_STATE',state});openCustomPageItemsManager(pageId,index)});
 });
 inspector.querySelectorAll('[data-custom-item-op]').forEach(btn=>btn.addEventListener('click',()=>mutateCustomPageItem(pageId,index,btn.dataset.customItemOp)));
 inspector.querySelector('[data-custom-item-image]')?.addEventListener('click',()=>{
   const input=$('#imageInput');input.dataset.path=path+'.image';input.dataset.returnCollection='custom:'+pageId;input.dataset.returnIndex=String(index);input.click();
 });
 inspector.querySelector('[data-custom-item-image-remove]')?.addEventListener('click',()=>{checkpoint();item.image='';save();send({type:'OE_REPLACE_STATE',state});openCustomPageItemInspector(pageId,index)});
}
function mutateCustomPageItem(pageId,index,op){
 const page=state.customPages?.[customPageIndex(pageId)];if(!page)return;page.items??=[];checkpoint();
 if(op==='up'&&index>0){[page.items[index-1],page.items[index]]=[page.items[index],page.items[index-1]];index--}
 if(op==='down'&&index<page.items.length-1){[page.items[index+1],page.items[index]]=[page.items[index],page.items[index+1]];index++}
 if(op==='delete'){
   const removed=page.items[index];
   if(removed?.id)(state.venueMap?.links||[]).forEach(link=>{if(link.target===customPageKey(page.id)&&link.itemType==='customitem'&&link.itemId===removed.id){link.itemType='page';link.itemId=''}});
   page.items.splice(index,1);index=Math.min(index,page.items.length-1)
 }
 if(op==='add'){page.items.splice(index+1,0,{id:uid('ci'),title:'',meta:'',text:'',image:'',url:''});index++}
 save();send({type:'OE_REPLACE_STATE',state});openCustomPageItemsManager(pageId,index);
 if(index>=0&&page.items[index])openCustomPageItemInspector(pageId,index);else showInspectorEmpty();
}

function openOptionalPageInspector(key){
 const page=state[key]||{},label=key==='freewalk'?'COS自由行':'痛车展示';
 setInspector('页面内容',label,optionalPageHtml(key,page,esc));
 inspector.querySelectorAll('[data-optional-field]').forEach(input=>bindInspectorStateInput(input,key+'.'+input.dataset.optionalField,{clean:true}));
 inspector.querySelector('[data-optional-image]')?.addEventListener('click',()=>{$('#imageInput').dataset.path=key+'.image';$('#imageInput').click()});
 inspector.querySelector('[data-optional-image-remove]')?.addEventListener('click',()=>{checkpoint();setDeep(key+'.image','');send({type:'OE_REPLACE_STATE',state});openOptionalPageInspector(key)});
}
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
function openEntryAnimationInspector(){
  if(state.templateId==='04-creator-catalogue'){
    const v=String(state.heroImage||'').trim();
    setInspector('入场动画','封面图',coverKvHtml(state,esc));
    inspector.querySelector('[data-cover-kv]')?.addEventListener('click',()=>{const input=$('#imageInput');input.dataset.path='heroImage';input.click()});
    inspector.querySelector('[data-cover-kv-remove]')?.addEventListener('click',()=>{checkpoint();state.heroImage='';save();send({type:'OE_PATCH_FIELD',path:'heroImage',value:''});openEntryAnimationInspector()});
    return;
  }

  const heroMedia=(key,label)=>{const v=String(((state.entryAnimation||{})[key])||'').trim();return '<div class="item-media"><span>'+label+'</span><div class="item-media-row">'+(v?'<img src="'+esc(v)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button type="button" data-kv-image="'+key+'">选择 / 裁剪</button></div></div></div>';};
  setInspector('入场动画','开屏设置',entryAnimationHtml(state,esc));
  inspector.querySelectorAll('[data-kv-image]').forEach(btn=>btn.addEventListener('click',()=>{
    const input=$('#imageInput');input.dataset.path='entryAnimation.'+btn.dataset.kvImage;input.click();
  }));
}
function openBannerInspector(){
  const slot=(key,label,note)=>{const v=String(state[key]||'').trim();return '<div class="item-media"><span>'+label+'</span><div class="item-media-row">'+(v?'<img src="'+esc(v)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button type="button" data-banner-image="'+key+'">'+(v?'更换':'选择 / 裁剪')+'</button>'+(v?'<button type="button" class="ghost" data-banner-remove="'+key+'">移除</button>':'')+'</div></div>'+(note?'<small>'+note+'</small>':'')+'</div>';};
  setInspector('横幅','首页横幅',bannerInspectorHtml(state,esc));
  inspector.querySelectorAll('[data-banner-image]').forEach(btn=>btn.addEventListener('click',()=>{
    const input=$('#imageInput');input.dataset.path=btn.dataset.bannerImage;input.click();
  }));
  inspector.querySelectorAll('[data-banner-remove]').forEach(btn=>btn.addEventListener('click',()=>{
    checkpoint();const key=btn.dataset.bannerRemove;setDeep(key,'');save();send({type:'OE_PATCH_FIELD',path:key,value:''});openBannerInspector();
  }));
}
function openTrafficInspector(){
  const img=String(state.venueMap?.transitImage||'');
  setInspector('交通到达','交通路线图与导航',trafficInspectorHtml(state,esc));
  inspector.querySelector('[data-traffic-image]')?.addEventListener('click',()=>{const input=$('#imageInput');input.dataset.path='venueMap.transitImage';input.click();});
  $('#saveTrafficNav')?.addEventListener('click',()=>{checkpoint();state.navigationUrl=String($('#trafficNavInput')?.value||'').trim();save();send({type:'OE_REPLACE_STATE',state});});
}
function openStreetManager(){
  setInspector('摊位','街道',streetManagerHtml(state,esc));
  inspector.querySelectorAll('[data-street-rename]').forEach(input=>input.addEventListener('change',()=>{
    const from=input.dataset.streetRename,to=String(input.value||'').trim();
    if(!to||to===from)return;
    checkpoint();
    state.booths=(state.booths||[]).map(b=>String(b.street||'')===from?{...b,street:to}:b);
    state.streets=(state.streets||[]).map(s=>String(s.name||'')===from?{...s,name:to}:s);
    save();send({type:'OE_REPLACE_STATE',state});openStreetManager();
  }));
  inspector.querySelectorAll('[data-street-delete]').forEach(btn=>btn.addEventListener('click',()=>{
    const name=btn.dataset.streetDelete;
    checkpoint();
    state.booths=(state.booths||[]).map(b=>String(b.street||'')===name?{...b,street:''}:b);
    state.streets=(state.streets||[]).filter(s=>String(s.name||'')!==name);
    save();send({type:'OE_REPLACE_STATE',state});openStreetManager();
  }));
  inspector.querySelectorAll('[data-street-image]').forEach(btn=>btn.addEventListener('click',()=>{
    const name=btn.dataset.streetImage;
    state.streets=Array.isArray(state.streets)?state.streets:[];
    let idx=state.streets.findIndex(s=>String(s.name||'')===name);
    if(idx<0){state.streets.push({name,image:''});idx=state.streets.length-1;save();send({type:'OE_REPLACE_STATE',state});}
    const input=$('#imageInput');input.dataset.path='streets.'+idx+'.image';input.click();
  }));
  $('#addStreetBtn')?.addEventListener('click',()=>{
    const name=String($('#newStreetName')?.value||'').trim();
    if(!name)return;
    checkpoint();
    state.streets=Array.isArray(state.streets)?state.streets:[];
    if(!state.streets.some(s=>String(s.name||'')===name))state.streets.push({name,image:''});
    save();send({type:'OE_REPLACE_STATE',state});openStreetManager();
  });
}
function openPageTool(tool){
 setPageContentActive({tool});
 const panel=$('#contentListPanel');if(panel)panel.innerHTML='';
 if(tool==='entryAnimation'){openEntryAnimationInspector();return}
 if(tool==='basic'){openAddressInspector();return}
 if(tool==='lifecycle'){openLifecycleInspector();return}
 if(tool==='hero'){openHeroTitleInspector();return}
 if(tool==='banner'){openBannerInspector();return}
 if(tool==='cover'){openImageInspector('heroImage');return}
 if(tool==='memo'){openMemoInspector();return}
 if(tool==='traffic'){openTrafficInspector();return}
 if(tool==='intro'){openFieldInspector('tagline');return}
 if(tool==='seo'){openSeoInspector();return}
 if(tool==='recap'){openRecapDialog();return}
 if(tool==='map'){openImageInspector('venueMap.image');return}
 if(tool==='streets'){openStreetManager();return}
 if(tool==='freewalk'||tool==='itasha'){openOptionalPageInspector(tool);return}
 showInspectorEmpty();
}
function renderPageContentNav(page,{openDefault=true}={}){
 const nav=$('#pageContentNav'),title=$('#pageContentTitle'),panel=$('#contentListPanel'),custom=customPageByKey(page);
 if(title)title.textContent=pageLabel(page)+'内容';
 if(!nav)return;
 if(custom){
   nav.innerHTML='<button type="button" data-custom-page-nav="settings"><span>页面设置</span></button><button type="button" data-custom-page-nav="items"><span>展示内容</span><b>'+String((custom.items||[]).length)+'</b></button>';
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
function addPresetItem(collection,key){
 checkpoint();
 const arr=collectionArray(collection);if(!Array.isArray(arr))return;
 const source=collection==='guide'?GUIDE_PRESETS[key]:PARTICIPATION_PRESETS[key];
 if(!source)return;
 const extra=collection==='participation'?(()=>{
  const rawMeta=String(source.meta||'').trim(),parts=rawMeta.split(/\s*·\s*/).filter(Boolean);
  return {
   detail:source.detail||source.text||'',
   rules:source.rules||'',
   requirements:source.requirements||'',
   signingRules:source.signingRules||'',
   setlist:source.setlist||'',
   participationMode:source.participationMode||'自由参加',
   activityType:source.activityType||'general',
   activityLocation:source.activityLocation||'',
   availabilityNote:source.availabilityNote||'',
   image:'',guestIds:[],
   category:source.category||({stage:'舞台',guest:'嘉宾互动',signing:'签售',live:'Live',randomDance:'随机舞蹈',cosplay:'COS',itasha:'痛车',stamp:'集章',photo:'合影',game:'互动游戏',support:'应援专区'}[source.preset]||'其他'),
   area:source.area||(parts.length>1?parts[0]:'活动区域'),
   meta:parts.length>1?parts.slice(1).join(' · '):rawMeta
  };
 })():{};
 arr.push({id:uid(collection==='guide'?'gd':'pa'),...structuredClone(source),...extra});
 save();send({type:'OE_REPLACE_STATE',state});
 openCollectionManager(collection,arr.length-1);openItemInspector(collection,arr.length-1);
}
const syncContentCounts=createContentCounts({collectionArray});
function presetEntriesFor(collection){return presetEntriesForState(collection,state.templateId,GUIDE_PRESETS,PARTICIPATION_PRESETS)}

function openCollectionManager(collection,selectedIndex=-1){
  lastCollection=collection;if(selectedIndex>=0)lastItemIndex=selectedIndex;
  if(selectedIndex<0){const m=contentManagerMeta[collection];if(m)try{setInspector('内容',m.title,'<div class="inspector-note">选择左侧条目开始编辑</div>')}catch(e){}}
 if(collection==='explore'&&state.templateId==='04-creator-catalogue')return;
 const meta=contentManagerMeta[collection],arr=collectionArray(collection),panel=$('#contentListPanel');if(!meta||!Array.isArray(arr)||!panel)return;
 document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.toggle('active',x.dataset.contentManager===collection));
 setPageContentActive({collection});
 const rows=renderStudioCollectionRows(arr,{escape:esc,selected:selectedIndex,item:meta.item,thumbnail:item=>contentThumb(collection,item)});
 const guidePresets=collection==='guide'?'<div class="preset-add"><span>常用预设</span><div>'+presetEntriesFor('guide').map(([key,x])=>'<button type="button" data-add-preset="'+key+'">'+esc(x.title)+'</button>').join('')+'</div></div>':'';
 const activityPresets=collection==='participation'?'<div class="preset-add"><span>常用活动</span><div>'+presetEntriesFor('participation').map(([key,x])=>'<button type="button" data-add-preset="'+key+'">'+esc(x.title)+'</button>').join('')+'</div></div>':'';
 const addLabel=collection==='guide'?'＋ 添加自定义指南':collection==='participation'?'＋ 添加自定义活动':'＋ 添加'+meta.title;
 const addButton=(collection==='featuredActivities'&&String(state.templateId)!=='08-birthday')?'':'<button type="button" class="sidebar-content-add" data-sidebar-content-add>'+addLabel+'</button>';
 panel.innerHTML='<div class="sidebar-content-head"><div><b>'+esc(meta.title)+'</b><span>'+arr.length+' 项</span></div>'+(arr.length>6?'<label class="sidebar-content-search"><span>⌕</span><input type="search" placeholder="'+esc(collection==='booths'?'搜索社团，或制品名称 / Tag':'搜索'+meta.title)+'" data-sidebar-content-search></label>':'')+'</div>'+guidePresets+activityPresets+'<div class="sidebar-content-rows">'+(rows||'<div class="sidebar-content-empty">'+esc(meta.empty)+'</div>')+'</div>'+addButton;
 panel.querySelectorAll('[data-open-item]').forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.openItem);panel.querySelectorAll('[data-open-item]').forEach(x=>x.classList.toggle('active',x===btn));openItemInspector(collection,i)});
 panel.querySelectorAll('[data-add-preset]').forEach(btn=>btn.onclick=()=>addPresetItem(collection,btn.dataset.addPreset));
 panel.querySelector('[data-sidebar-content-add]')?.addEventListener('click',()=>mutateItem(collection,arr.length-1,'add'));
 panel.querySelector('[data-sidebar-content-search]')?.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();panel.querySelectorAll('[data-open-item]').forEach(row=>row.hidden=!!q&&!String(row.dataset.search||'').includes(q))});
}

const syncModuleControls=createModuleControls({getState:()=>state,getTemplate:()=>activeTemplate,guideLabelText});
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

function openHeroTitleInspector(){
 const hero=heroTitleInspectorHtml(state,esc);
 setInspector('主视觉',hero.title,hero.html);
 inspector.querySelectorAll('[data-sync-path]').forEach(input=>bindInspectorStateInput(input,input.dataset.syncPath,{clean:input.type!=='color'}));
 inspector.querySelectorAll('[data-hero-image]').forEach(btn=>btn.addEventListener('click',()=>{$('#imageInput').dataset.path=btn.dataset.heroImage;$('#imageInput').click()}));
 inspector.querySelectorAll('[data-hero-image-remove]').forEach(btn=>btn.addEventListener('click',()=>{checkpoint();setDeep(btn.dataset.heroImageRemove,'');save();send({type:'OE_PATCH_FIELD',path:btn.dataset.heroImageRemove,value:''})}));
}
function openLifecycleInspector(){
 const mode=String(state.eventStatusMode||'auto'),status=String(state.eventStatus||'upcoming');
 setInspector('活动状态','生命周期',lifecycleInspectorHtml(state,esc));
 inspector.querySelector('[data-event-status-mode="auto"]')?.addEventListener('click',()=>{
   checkpoint();state.eventStatusMode='auto';save();send({type:'OE_REPLACE_STATE',state});openLifecycleInspector();
 });
 inspector.querySelectorAll('[data-event-status]').forEach(btn=>btn.addEventListener('click',()=>{
   checkpoint();state.eventStatusMode='manual';state.eventStatus=btn.dataset.eventStatus;save();send({type:'OE_REPLACE_STATE',state});openLifecycleInspector();
 }));
}

/* ---- live updates and recap ---- */
const recapDialog=$('#recapDialog');
const recapCommit=({structural=false}={})=>{save();send({type:'OE_REPLACE_STATE',state});if(structural)renderRecapDialog()};
function renderRecapDialog(){
 state.recap??={mode:'off',title:'',summary:'',posts:[],photos:[],videos:[],links:[]};
 const r=state.recap;for(const k of ['posts','photos','videos','links'])r[k]??=[];
 $('#recapBody').innerHTML=recapDialogHtml(r,esc);
 $('#recapBody').querySelector('[data-recap="mode"]').value=r.mode||'off';
}
function bindRecapDialog(){
 const body=$('#recapBody');
 body.addEventListener('input',e=>{
  const t=e.target,r=state.recap;
  if(t.dataset.recap){checkpoint();r[t.dataset.recap]=t.value;recapCommit();return}
  const row=t.closest('[data-list]');if(!row||!t.dataset.f)return;
  checkpoint();r[row.dataset.list][Number(row.dataset.i)][t.dataset.f]=t.value;recapCommit();
 });
 body.addEventListener('click',e=>{
  const r=state.recap,b=e.target.closest('button');if(!b)return;
  if(b.dataset.add){checkpoint();const k=b.dataset.add;r[k].push(k==='posts'?{id:uid('rp'),time:'',text:''}:k==='photos'?{id:uid('ph'),image:'',caption:''}:k==='videos'?{id:uid('vd'),url:'',title:''}:{id:uid('lk'),label:'',url:''});recapCommit({structural:true});return}
  if(b.classList.contains('recap-rm')){checkpoint();const row=b.closest('[data-list]');r[row.dataset.list].splice(Number(row.dataset.i),1);recapCommit({structural:true});return}
  if(b.dataset.pick!==undefined){$('#imageInput').dataset.path='recap.photos.'+b.dataset.pick+'.image';$('#imageInput').click()}
 });
 body.addEventListener('change',e=>{if(e.target.dataset.recap==='mode')recapCommit()});
}
function openRecapDialog(){renderRecapDialog();if(!recapDialog.open)recapDialog.showModal()}
const shareDialog=$('#shareDialog');
function shareText(){return shareTextFor(state,publishRecord)}
function renderShareDialog(){
 state.seo??={};
 const seo=state.seo,url=publishRecord?.url||'',host=url?url.replace(/^https?:\/\//,'').replace(/\/$/,''):'发布后显示网址';
 const title=seo.ogTitle||seo.pageTitle||state.eventName||'活动网站',desc=seo.ogDescription||seo.metaDescription||state.tagline||'',img=seo.ogImage||state.heroImage||'';
 $('#shareBody').innerHTML=shareDialogHtml(state,publishRecord,PROMO_CHANNELS,esc);
 const body=$('#shareBody');
 $('#shareMessage').value=shareText();
 if(url)qrSvg(url).then(svg=>{const box=$('#shareQr');if(!box)return;box.innerHTML=svg;$('#shareQrSave').onclick=()=>downloadSvg(svg,(state.eventName||'活动')+'-二维码.svg')}).catch(()=>{const box=$('#shareQr');if(box)box.textContent='二维码没能生成，请刷新后重试。'});
 body.querySelectorAll('[data-seo-field]').forEach(input=>{
  bindInspectorStateInput(input,'seo.'+input.dataset.seoField,{clean:true});
  input.addEventListener('input',()=>{const t=state.seo,card=body.querySelector('.share-card-text');if(!card)return;card.querySelector('b').textContent=t.ogTitle||t.pageTitle||state.eventName||'活动网站';card.querySelector('small').textContent=t.ogDescription||t.metaDescription||state.tagline||''});
 });
 const copy=async(text)=>{try{await navigator.clipboard.writeText(text);toast('已复制')}catch{toast('复制失败')}};
 body.querySelector('[data-share-copy-url]')?.addEventListener('click',()=>copy(url));
 body.querySelectorAll('[data-share-channel]').forEach(b=>b.addEventListener('click',()=>copy(url.replace(/\/$/,'')+'/?from='+b.dataset.shareChannel)));
 body.querySelector('[data-share-open]')?.addEventListener('click',()=>window.open(url,'_blank','noopener'));
 body.querySelector('[data-share-copy-text]')?.addEventListener('click',()=>copy($('#shareMessage').value));
 body.querySelector('[data-seo-image]')?.addEventListener('click',()=>{$('#imageInput').dataset.path='seo.ogImage';$('#imageInput').click()});
 body.querySelector('[data-seo-image-remove]')?.addEventListener('click',()=>{checkpoint();state.seo.ogImage='';save();send({type:'OE_REPLACE_STATE',state});renderShareDialog()});
}
// QR codes come from a small vendored library (MIT, qrcode-generator), loaded the first time it is needed.
let qrLoader=null;
function qrSvg(text){
 qrLoader??=new Promise((ok,fail)=>{if(window.qrcode)return ok();const el=document.createElement('script');el.src='/v8/vendor/qrcode.js';el.onload=ok;el.onerror=()=>{qrLoader=null;fail(new Error('qr'))};document.head.appendChild(el)});
 return qrLoader.then(()=>{const q=window.qrcode(0,'M');q.addData(text);q.make();return q.createSvgTag({cellSize:6,margin:3,scalable:true})});
}
function openShareDialog(){renderShareDialog();if(!shareDialog.open)shareDialog.showModal()}
function openSeoInspector(){shareDialog.open?renderShareDialog():openShareDialog()}

function openAddressInspector(){
 setInspector('基础信息','时间、场馆与导航',addressInspectorHtml(state,esc));
 const tplId=(activeTemplate?.id||'');
 const num=(tplId.match(/^0\d/)||[])[0];
 if(num&&PALETTES[num]){
  const key="palette"+num;
  const options=PALETTES[num].map(([v,l])=>'<option value="'+v+'">'+l+'</option>').join('');
  const box=document.createElement("label");
  box.innerHTML='<span>配色方案</span><select data-palette>'+options+'</select>';
  inspector.querySelector(".item-fields")?.appendChild(box);
  const sel=inspector.querySelector("[data-palette]");
  if(sel){sel.value=state[key]||PALETTES[num][0][0];sel.addEventListener("change",()=>{checkpoint();state[key]=sel.value;save();send({type:"OE_REPLACE_STATE",state})})}
 }
 bindInspectorStateInput(inspector.querySelector('[data-sync-path="eventStartDateTime"]'),'eventStartDateTime',{clean:true});
 bindInspectorStateInput(inspector.querySelector('[data-sync-path="eventEndDateTime"]'),'eventEndDateTime',{clean:true});
 bindInspectorStateInput(inspector.querySelector('[data-sync-path="date"]'),'date',{clean:true});
 bindInspectorStateInput(inspector.querySelector('[data-sync-path="location"]'),'location',{clean:true});
 bindInspectorStateInput(inspector.querySelector('[data-sync-path="edition"]'),'edition',{clean:true});
 bindInspectorStateInput(inspector.querySelector('[data-sync-path="navigationUrl"]'),'navigationUrl',{clean:true});
 $('#testNavigation').onclick=()=>{const url=String(state.navigationUrl||'').trim();if(url.startsWith('https://')||url.startsWith('http://'))window.open(url,'_blank','noopener');else toast('请填写有效的 http/https 链接')};
}

function openTicketSettingsInspector(){
 setInspector('票务','购票平台',ticketSettingsInspectorHtml(state,esc));
 bindInspectorStateInput($('#ticketLinkLabelInput'),'ticketLinkLabel',{clean:true});
 bindInspectorStateInput($('#ticketUrlInput'),'ticketUrl',{clean:true});
 $('#testTicketUrl').onclick=()=>{const url=String(state.ticketUrl||'').trim();if(/^https?:\/\//i.test(url))window.open(url,'_blank','noopener');else toast('请填写有效的 http/https 链接')};
}
function openFieldInspector(path){
 if(path.startsWith('ribbonItems.')){
   const i=Number(path.split('.')[1])||0;
   setWorkspace('pages');syncStudioPageUI('home',{openContent:false});renderPageContentNav('home',{openDefault:false});
   openCollectionManager('ribbonItems',i);setPageContentActive({collection:'ribbonItems'});openItemInspector('ribbonItems',i);return
 }
 if(path==='ticketUrl'||path==='ticketLinkLabel'){openTicketSettingsInspector();return}
 if(['date','location','edition','navigationUrl'].includes(path)){openAddressInspector();return}
 if(path==='eventStatus'){openLifecycleInspector();return}
 if(path.startsWith('seo.')){openSeoInspector();return}
 if(path==='tagline'&&state.templateId==='02-scrapbook'){
   setInspector('活动简介','简介正文',taglineEditorHtml(state.tagline,esc));
   const input=$('#fieldInput');fitTextarea(input);let started=false;
   input.addEventListener('input',e=>{if(!started){checkpoint();started=true}setDeep('tagline',e.target.value);send({type:'OE_PATCH_FIELD',path:'tagline',value:e.target.value});fitTextarea(e.target)});
   input.addEventListener('blur',()=>save());return;
 }
 if(path.startsWith('heroTitle')||['heroImage','mobileHeroImage'].includes(path)){openHeroTitleInspector();return}
 const value=getDeep(path);
 setInspector('内容','编辑文字',fieldEditorHtml(path,value,esc));
 const input=$('#fieldInput');let started=false;fitTextarea(input);
 input.addEventListener('input',e=>{if(!started){checkpoint();started=true}setDeep(path,e.target.value);send({type:'OE_PATCH_FIELD',path,value:e.target.value});fitTextarea(e.target)});
 input.addEventListener('blur',e=>{const cleaned=cleanValue(e.target.value);if(cleaned!==e.target.value){e.target.value=cleaned;setDeep(path,cleaned);send({type:'OE_PATCH_FIELD',path,value:cleaned});fitTextarea(e.target)}});
}

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

function openBoothProductManager(boothIndex){
 const booth=state.booths?.[boothIndex];if(!booth)return;
 const products=booth.products||[];
 setInspector('制品','制品管理 · '+(booth.no||booth.name||'摊位'),
   '<div class="product-direct-head"><button type="button" class="ghost" data-booth-product-back>← 返回摊位编辑</button><span>'+esc((booth.no?booth.no+' · ':'')+(booth.name||'摊位'))+'</span></div>'+
   '<div class="product-editor"><div class="product-editor-head"><b>共 '+products.length+' 件制品</b><button type="button" data-booth-product-add="'+boothIndex+'">＋ 添加制品</button></div>'+
   '<div class="sidebar-content-rows">'+(products.length?products.map((p,j)=>
      '<div class="product-manager-row"><button type="button" class="sidebar-content-row product-manager-name-row" data-booth-product-open="'+j+'"><span class="sidebar-content-copy"><b>'+esc(p.name||'未命名制品')+'</b></span></button><div class="product-manager-tools"><button type="button" data-booth-product-move="'+j+'" data-dir="-1" '+(j===0?'disabled':'')+' title="上移">↑</button><button type="button" data-booth-product-move="'+j+'" data-dir="1" '+(j===products.length-1?'disabled':'')+' title="下移">↓</button></div></div>'
   ).join(''):'<p class="inspector-note">还没有制品，点击“添加制品”开始。</p>')+'</div></div>');
 inspector.querySelector('[data-booth-product-back]')?.addEventListener('click',()=>openItemInspector('booths',boothIndex));
 inspector.querySelector('[data-booth-product-add]')?.addEventListener('click',()=>addBoothProduct(boothIndex));
 inspector.querySelectorAll('[data-booth-product-open]').forEach(btn=>btn.addEventListener('click',()=>openProductInspector(boothIndex,Number(btn.dataset.boothProductOpen))));
 inspector.querySelectorAll('[data-booth-product-move]').forEach(btn=>btn.addEventListener('click',()=>moveBoothProduct(boothIndex,Number(btn.dataset.boothProductMove),Number(btn.dataset.dir))));
}
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
function openProductInspector(boothIndex,productIndex,{focusImage=false}={}){
 const booth=state.booths?.[boothIndex],product=booth?.products?.[productIndex];if(!booth||!product)return;
 const path='booths.'+boothIndex+'.products.'+productIndex;
 const image=product.image?'<img src="'+esc(product.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
 setInspector('制品','编辑制品',productInspectorHtml(booth,product,esc));
 inspector.querySelector('[data-direct-product-back]')?.addEventListener('click',()=>openBoothProductManager(boothIndex));
 inspector.querySelectorAll('textarea').forEach(fitTextarea);
 try{const h=inspector.querySelector('textarea[data-key="setlist"]');
  if(h&&!h.dataset.chips){h.dataset.chips='1';
   const wrap=document.createElement('div');wrap.className='chip-editor';
   const list=document.createElement('div');list.className='chip-list';
   const inp=document.createElement('input');inp.type='text';inp.className='chip-input';inp.placeholder='输入曲名后回车';
   wrap.append(list,inp);h.parentElement.insertBefore(wrap,h);h.classList.add('chip-source');
   const splitSongs=v=>String(v||'').split(/(?=《)|[\/、,，\n]+/).map(t=>t.trim()).filter(Boolean);
   const sync=()=>{h.value=[...list.querySelectorAll('.chip')].map(c=>c.dataset.v).join('\n');h.dispatchEvent(new Event('input',{bubbles:true}));h.dispatchEvent(new Event('change',{bubbles:true}));h.blur&&h.blur();try{save();send({type:'OE_REPLACE_STATE',state})}catch(e){console.warn('[chips sync]',e)}};
   const add=v=>{if(!v)return;const c=document.createElement('span');c.className='chip';c.dataset.v=v;c.innerHTML=esc(v)+'<button type="button" aria-label="删除">×</button>';c.querySelector('button').onclick=()=>{c.remove();sync()};list.appendChild(c)};
   splitSongs(h.value).forEach(add);
   inp.addEventListener('keydown',e=>{if(e.key!=='Enter')return;e.preventDefault();add(inp.value.trim());inp.value='';inp.blur();setTimeout(()=>sync(),0)});
  }}catch(err){console.warn('[chips]',err)}
 inspector.querySelectorAll('[data-direct-product-key]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{if(!started){checkpoint();started=true}const key=e.target.dataset.directProductKey;product[key]=e.target.value;save();send({type:'OE_REPLACE_STATE',state});if(e.target.tagName==='TEXTAREA')fitTextarea(e.target)});
   input.addEventListener('blur',e=>{const key=e.target.dataset.directProductKey,cleaned=cleanValue(e.target.value);if(cleaned!==e.target.value){e.target.value=cleaned;product[key]=cleaned;save();send({type:'OE_REPLACE_STATE',state});if(e.target.tagName==='TEXTAREA')fitTextarea(e.target)}});
 });
 const choose=()=>{const input=$('#imageInput');input.dataset.path=path+'.image';input.dataset.returnCollection='product:'+boothIndex;input.dataset.returnIndex=String(productIndex);input.click()};
 inspector.querySelector('[data-direct-product-image]')?.addEventListener('click',choose);
 inspector.querySelector('[data-direct-product-crop]')?.addEventListener('click',()=>openImageCropper(product.image,path+'.image','product:'+boothIndex,String(productIndex)));
 inspector.querySelector('[data-direct-product-remove-image]')?.addEventListener('click',()=>{checkpoint();product.image='';save();send({type:'OE_REPLACE_STATE',state});openProductInspector(boothIndex,productIndex)});
 inspector.querySelector('[data-direct-product-delete]')?.addEventListener('click',()=>{checkpoint();booth.products.splice(productIndex,1);save();send({type:'OE_REPLACE_STATE',state});openBoothProductManager(boothIndex)});
 if(focusImage)requestAnimationFrame(()=>inspector.querySelector('[data-direct-product-image]')?.focus());
}
function openItemInspector(collection,index){
  lastCollection=collection;lastItemIndex=index;
 const meta=collectionMeta[collection],arr=collectionArray(collection),item=arr?.[index];if(!meta||!item)return;
 const count=arr.length;
 const isLong=isItemLongField;
 const inspectorFields=collection==='participation'?participationInspectorFields(item):meta.fields;
 const {media,guideMedia}=itemMediaPanels(collection,index,item,esc);
 const itemTitle=contentManagerMeta[collection]?.item?.(item,index)?.[0]||meta.title;
 const itemActions=itemActionsHtml(collection);
 setInspector('内容',meta.title+' · '+itemTitle,itemInspectorHeadHtml(meta,index,count,esc)+'<div class="item-fields">'+itemFieldsHtml(inspectorFields,item,esc,isLong)+'</div>'+media+guideMedia+extraInspector(collection,index,item)+itemActions);
 inspector.querySelectorAll('textarea').forEach(fitTextarea);
 try{const h=inspector.querySelector('textarea[data-key="setlist"]');
  if(h&&!h.dataset.chips){h.dataset.chips='1';
   const wrap=document.createElement('div');wrap.className='chip-editor';
   const list=document.createElement('div');list.className='chip-list';
   const inp=document.createElement('input');inp.type='text';inp.className='chip-input';inp.placeholder='输入曲名后回车';
   wrap.append(list,inp);h.parentElement.insertBefore(wrap,h);h.classList.add('chip-source');
   const splitSongs=v=>String(v||'').split(/(?=《)|[\/、,，\n]+/).map(t=>t.trim()).filter(Boolean);
   const sync=()=>{h.value=[...list.querySelectorAll('.chip')].map(c=>c.dataset.v).join('\n');h.dispatchEvent(new Event('input',{bubbles:true}));h.dispatchEvent(new Event('change',{bubbles:true}));h.blur&&h.blur();try{send({type:'OE_PATCH_FIELD',path:collection+'.'+index+'.setlist',value:h.value})}catch(e){}};
   const add=v=>{if(!v)return;const c=document.createElement('span');c.className='chip';c.dataset.v=v;c.innerHTML=esc(v)+'<button type="button" aria-label="删除">×</button>';c.querySelector('button').onclick=()=>{c.remove();sync()};list.appendChild(c)};
   splitSongs(h.value).forEach(add);
   inp.addEventListener('keydown',e=>{if(e.key!=='Enter')return;e.preventDefault();add(inp.value.trim());inp.value='';sync()});
  }}catch(err){console.warn('[chips]',err)}
 inspector.querySelectorAll('[data-key]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{
     if(!started){checkpoint();started=true}
     const key=e.target.dataset.key;
     let value=e.target.value;
     item[key]=value;save();send({type:'OE_PATCH_FIELD',path:collectionPath(collection,index,key),value});
     if(e.target.tagName==='TEXTAREA')fitTextarea(e.target);
   });
   input.addEventListener('blur',e=>{
     if(e.target.type==='color')return;
     const key=e.target.dataset.key,cleaned=cleanValue(e.target.value);
     if(cleaned!==e.target.value){e.target.value=cleaned;item[key]=cleaned;save();send({type:'OE_PATCH_FIELD',path:collectionPath(collection,index,key),value:cleaned});if(e.target.tagName==='TEXTAREA')fitTextarea(e.target)}
   });
 });
 inspector.querySelectorAll('[data-ref]').forEach(sel=>sel.addEventListener('change',e=>{checkpoint();item[e.target.dataset.ref]=e.target.value;save();send({type:'OE_REPLACE_STATE',state})}));
 if(collection==='explore'){
   inspector.querySelector('[data-explore-page]')?.addEventListener('change',e=>{checkpoint();item.target=e.target.value;item.itemType='page';item.itemId='';save();send({type:'OE_REPLACE_STATE',state});openCollectionManager('explore',index);openItemInspector('explore',index)});
 }
 inspector.querySelector('[data-schedule-plan]')?.addEventListener('change',e=>{checkpoint();item.participationId=e.target.value;save();send({type:'OE_REPLACE_STATE',state});openItemInspector('schedule',index)});
 inspector.querySelector('[data-featured-activity-select]')?.addEventListener('change',e=>{checkpoint();item.participationId=e.target.value;save();send({type:'OE_REPLACE_STATE',state});openCollectionManager('featuredActivities',index);openItemInspector('featuredActivities',index)});
 inspector.querySelector('[data-edit-featured-source]')?.addEventListener('click',e=>{const i=Number(e.currentTarget.dataset.editFeaturedSource);openCollectionManager('participation',i);setPageContentActive({collection:'participation'});openItemInspector('participation',i)});
 inspector.querySelectorAll('[data-guest-ref]').forEach(ch=>ch.addEventListener('change',e=>{checkpoint();item.guestIds??=[];item.guestIds=e.target.checked?[...new Set([...item.guestIds,e.target.dataset.guestRef])]:item.guestIds.filter(id=>id!==e.target.dataset.guestRef);save();send({type:'OE_REPLACE_STATE',state})}));
 inspector.querySelector('[data-activity-type]')?.addEventListener('change',e=>{checkpoint();item.activityType=e.target.value;save();send({type:'OE_REPLACE_STATE',state});openItemInspector('participation',index)});
 inspector.querySelectorAll('[data-activity-extra-key]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{if(!started){checkpoint();started=true}item[e.target.dataset.activityExtraKey]=e.target.value;save();send({type:'OE_REPLACE_STATE',state})});
 });
 if(collection==='guests')inspector.querySelectorAll('[data-guest-type]').forEach(btn=>btn.addEventListener('click',()=>{checkpoint();item.guestType=btn.dataset.guestType;save();send({type:'OE_REPLACE_STATE',state});openItemInspector('guests',index)}));
 if(collection==='guests'){
   inspector.querySelectorAll('[data-guest-plan-ref]').forEach(ch=>ch.addEventListener('change',e=>{
     checkpoint();
     const plan=(state.participation||[]).find(x=>x.id===e.target.dataset.guestPlanRef);if(!plan)return;
     plan.guestIds=Array.isArray(plan.guestIds)?plan.guestIds:[];
     plan.guestIds=e.target.checked?[...new Set([...plan.guestIds,item.id])]:plan.guestIds.filter(id=>id!==item.id);
     save();send({type:'OE_REPLACE_STATE',state});openItemInspector('guests',index);
   }));
   inspector.querySelectorAll('[data-guest-schedule-ref]').forEach(ch=>ch.addEventListener('change',e=>{
     checkpoint();
     const row=(state.schedule||[]).find(x=>x.id===e.target.dataset.guestScheduleRef);if(!row)return;
     row.guestIds=Array.isArray(row.guestIds)?row.guestIds:[];
     row.guestIds=e.target.checked?[...new Set([...row.guestIds,item.id])]:row.guestIds.filter(id=>id!==item.id);
     save();send({type:'OE_REPLACE_STATE',state});openItemInspector('guests',index);
   }));
   inspector.querySelector('[data-guest-social-add]')?.addEventListener('click',()=>{
     checkpoint();item.socialLinks=Array.isArray(item.socialLinks)?item.socialLinks:[];item.socialLinks.push({id:uid('gl'),url:''});
     save();send({type:'OE_REPLACE_STATE',state});openItemInspector('guests',index);
   });
   inspector.querySelectorAll('[data-guest-social-url]').forEach(input=>{
     let started=false;
     input.addEventListener('input',e=>{
       if(!started){checkpoint();started=true}
       const j=Number(e.target.dataset.guestSocialUrl);item.socialLinks??=[];if(!item.socialLinks[j])return;
       item.socialLinks[j].url=e.target.value;
       const detected=e.target.closest('.guest-social-editor-row')?.querySelector('.guest-platform-detected');if(detected)detected.textContent=guestPlatformName(e.target.value);
       save();send({type:'OE_REPLACE_STATE',state});
     });
     input.addEventListener('blur',e=>{
       const j=Number(e.target.dataset.guestSocialUrl),cleaned=cleanValue(e.target.value);if(!item.socialLinks?.[j])return;
       item.socialLinks[j].url=cleaned;e.target.value=cleaned;save();send({type:'OE_REPLACE_STATE',state});
       const detected=e.target.closest('.guest-social-editor-row')?.querySelector('.guest-platform-detected');if(detected)detected.textContent=guestPlatformName(cleaned);
     });
   });
   inspector.querySelectorAll('[data-guest-social-remove]').forEach(btn=>btn.addEventListener('click',()=>{
     checkpoint();const j=Number(btn.dataset.guestSocialRemove);item.socialLinks??=[];item.socialLinks.splice(j,1);
     save();send({type:'OE_REPLACE_STATE',state});openItemInspector('guests',index);
   }));
 }
 inspector.querySelectorAll('[data-op]').forEach(btn=>btn.addEventListener('click',()=>mutateItem(collection,index,btn.dataset.op)));
 inspector.querySelectorAll('[data-media-path]').forEach(btn=>btn.addEventListener('click',()=>{$('#imageInput').dataset.path=btn.dataset.mediaPath;$('#imageInput').dataset.returnCollection=collection;$('#imageInput').dataset.returnIndex=String(index);$('#imageInput').click()}));
 inspector.querySelectorAll('[data-remove-media]').forEach(btn=>btn.addEventListener('click',()=>{checkpoint();setDeep(btn.dataset.removeMedia,'');save();send({type:'OE_REPLACE_STATE',state});setTimeout(()=>openItemInspector(collection,index),60)}));
 if(collection==='booths'){
   inspector.querySelector('[data-booth-product-add]')?.addEventListener('click',()=>addBoothProduct(index));
   inspector.querySelector('[data-booth-products-manage]')?.addEventListener('click',()=>openBoothProductManager(index));
 }
}
function clearExploreItemRef(itemType,itemId){
 (state.venueMap?.links||[]).forEach(link=>{
   if(link.itemType===itemType&&String(link.itemId||'')===String(itemId||'')){link.itemType='page';link.itemId=''}
 });
}
function cleanupDeletedReferences(collection,item){
 const id=item?.id;if(!id)return;
 if(collection==='participation'){
   (state.schedule||[]).forEach(row=>{if(row.participationId===id)row.participationId=''});
   (state.featuredActivities||[]).forEach(slot=>{if(slot.participationId===id)slot.participationId=''});
   clearExploreItemRef('participation',id);
 }
 if(collection==='schedule')clearExploreItemRef('schedule',id);
 if(collection==='guests'){
   (state.participation||[]).forEach(row=>{row.guestIds=(row.guestIds||[]).filter(x=>x!==id)});
   (state.schedule||[]).forEach(row=>{row.guestIds=(row.guestIds||[]).filter(x=>x!==id)});
   clearExploreItemRef('guest',id);
 }
 if(collection==='booths')clearExploreItemRef('booth',id);
 if(collection==='guide')clearExploreItemRef('guide',id);
}
function mutateItem(collection,index,op){
 const arr=collectionArray(collection);if(!Array.isArray(arr))return;checkpoint();
 if(op==='up'&&index>0){[arr[index-1],arr[index]]=[arr[index],arr[index-1]];index--}
 if(op==='down'&&index<arr.length-1){[arr[index+1],arr[index]]=[arr[index],arr[index+1]];index++}
 if(op==='delete'&&arr.length){
   const removed=arr[index];cleanupDeletedReferences(collection,removed);
   arr.splice(index,1);
   if(!arr.length){save();send({type:'OE_REPLACE_STATE',state});syncContentCounts();openCollectionManager(collection);showInspectorEmpty();return}
   index=Math.max(0,index-1);
 }
 if(op==='add'){
   const fresh=collection==='ribbonItems'?{id:uid('rb'),text:'新滚动公告'}:
     collection==='explore'?{id:uid('ml'),label:'新探索入口',target:'activities',itemType:'page',itemId:''}:
     collection==='tickets'?{id:uid('t'),name:'新票种',price:'¥0',gift:'',note:'',image:''}:
     collection==='guide'?{id:uid('gd'),preset:'custom',title:'新指南内容',label:'GUIDE',text:''}:
     collection==='guests'?{id:uid('g'),guestType:'person',name:'新嘉宾',role:'GUEST',members:'',attendanceNote:'',works:'',intro:'',image:'',socialLinks:[]}:
     collection==='booths'?{id:uid('b'),no:'',name:'新摊位',logo:'',type:'',intro:'',products:[{id:uid('p'),name:'新制品',tag:'',price:'',note:'',image:''}]}:
     collection==='updates'?{id:uid('u'),date:'',title:'新更新',target:'top'}:
     collection==='participation'?{id:uid('pa'),preset:'custom',activityType:'general',title:'新活动',text:'',detail:'',participationMode:'自由参加',requirements:'',rules:'',signingRules:'',activityLocation:'',availabilityNote:'',setlist:'',image:'',target:'activities',url:'',guestIds:[]}:
     collection==='socialLinks'?{id:uid('sl'),label:'新社群入口',note:'',url:'',image:''}:
     collection==='sponsors'?{id:uid('sp'),name:'新赞助商',level:'合作伙伴',url:'',logo:''}:
     {id:uid('s'),time:'12:00',title:'新活动',stage:'MAIN STAGE',detail:'',participationId:'',guestIds:[],registrationUrl:''};
   arr.splice(index+1,0,fresh);index++;
   if(collection==='sponsors'){
     state.modules=state.modules||{};
     state.modules.sponsors=true;
     syncModuleControls();
   }
 }
 save();send({type:'OE_REPLACE_STATE',state});syncContentCounts();openCollectionManager(collection,index);openItemInspector(collection,index);
}
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
function imageSlotConfig(path){
 const cfg=imageSlotConfigBase(path);
 const measured=liveImageFrameRatio(path);
 if(measured&&!cfg.free){return {...cfg,ratio:measured,ratioLabel:'与当前展示框比例一致',width:1600,height:Math.round(1600/measured),fixed:true}}
 return cfg;
}

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
function openImageInspector(path){
 const current=getDeep(path);
 if(path==='venueMap.image'||/^guide\.items\.\d+\.image$/.test(path)){
   const guideMatch=path.match(/^guide\.items\.(\d+)\.image$/),guideItem=guideMatch?state.guide?.items?.[Number(guideMatch[1])]:null;
   const isGuideRoute=!!guideItem&&guideItem.preset==='traffic';
   const title=isGuideRoute?'入口示意图 / 交通路线图':'场地图';
   const isHomeMap=path==='venueMap.image'&&state.templateId==='02-scrapbook';
   const markup=isHomeMap?
     '<div class="item-media hero-media-field"><span>场地图 KV</span><div class="item-media-row">'+
     (current?'<img src="'+esc(current)+'" alt="场地图预览">':'<div class="item-media-empty">＋</div>')+
     '<div><button id="replaceImage" type="button">'+(current?'选择 / 裁剪':'选择 / 裁剪')+'</button>'+
     (current?'<button id="removeImage" type="button" class="ghost danger">移除</button>':'')+
     '</div></div></div>'+
     '<div class="item-media"><span>地图关联入口</span><div class="map-links-editor-preview">'+
     (state.venueMap?.links||[]).map((x,i)=>'<button type="button" class="ghost map-link-edit" data-map-link-index="'+i+'"><span>'+esc(x.label||'链接 '+(i+1))+'</span><span>编辑 ↗</span></button>').join('')+
     '<button type="button" class="ghost" id="addMapLink">＋ 添加关联入口</button></div></div>':
     '<div class="item-media"><span>'+esc(title)+'</span><div class="item-media-row">'+
     (current?'<img src="'+esc(current)+'" alt="">':'<div class="item-media-empty">＋</div>')+
     '<div><button id="replaceImage" type="button">'+(current?'替换图片':'选择 / 裁剪')+'</button>'+
     (current?'<button id="removeImage" type="button" class="ghost danger">移除</button>':'')+'</div></div></div>';
   setInspector(title,isHomeMap?'图片与关联链接':title,markup+(path==='venueMap.image'?moreMapsMarkup():''));
   if(path==='venueMap.image')bindMoreMaps();
   if(isHomeMap){
     inspector.querySelectorAll('[data-map-link-index]').forEach(btn=>btn.addEventListener('click',()=>{
       openCollectionManager('explore',Number(btn.dataset.mapLinkIndex));setPageContentActive({tool:'map'});
     }));
     $('#addMapLink')?.addEventListener('click',()=>mutateItem('explore',(state.venueMap?.links||[]).length-1,'add'));
   }
   $('#replaceImage').onclick=()=>{$('#imageInput').dataset.path=path;$('#imageInput').click()};
   $('#removeImage')?.addEventListener('click',()=>{checkpoint();setDeep(path,'');save();send({type:'OE_REPLACE_STATE',state});openImageInspector(path)});
   return;
 }
 setInspector('媒体','图片','<p class="inspector-path">'+esc(path)+'</p><div class="row"><button id="replaceImage" type="button">替换图片</button>'+(current?'<button id="cropCurrentImage" type="button">裁剪当前图片</button><button id="removeImage" type="button" class="danger ghost">移除图片</button>':'')+'</div>');
 $('#replaceImage').onclick=()=>{$('#imageInput').dataset.path=path;$('#imageInput').click()};
 $('#cropCurrentImage')?.addEventListener('click',()=>openImageCropper(current,path));
 $('#removeImage')?.addEventListener('click',()=>{checkpoint();setDeep(path,'');save();send({type:'OE_REPLACE_STATE',state});toast('图片已移除');openImageInspector(path)});
}
let activeCropper=null,cropContext=null;
const getCropperModule=loadStudioCropper;
function blobToDataUrl(blob){
 return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
}
async function prepareCropFile(file,cfg){
 // Old-CMS fast path: most files enter the cropper immediately without re-encoding.
 const directLimit=10*1024*1024;
 if(file.size<=directLimit)return {url:URL.createObjectURL(file),optimized:false};
 try{
   const bitmap=await createImageBitmap(file);
   const long=Math.max(bitmap.width,bitmap.height),max=cfg.free?3600:3200;
   if(!long||long<=max){
     bitmap.close?.();
     return {url:URL.createObjectURL(file),optimized:false};
   }
   const scale=max/long,w=Math.max(1,Math.round(bitmap.width*scale)),h=Math.max(1,Math.round(bitmap.height*scale));
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   canvas.getContext('2d',{alpha:false}).drawImage(bitmap,0,0,w,h);
   bitmap.close?.();
   const blob=await canvasToBlob(canvas,'image/webp',.92);
   return {url:URL.createObjectURL(blob),optimized:true};
 }catch(err){
   console.warn('[OnlyEvent large crop preview]',err);
   return {url:URL.createObjectURL(file),optimized:false};
 }
}
if('requestIdleCallback' in window)requestIdleCallback(()=>getCropperModule(),{timeout:1800});
else setTimeout(()=>getCropperModule(),900);
function fitCropSelectionToImage(){
 const selection=activeCropper?.getCropperSelection?.(),cropperImage=activeCropper?.getCropperImage?.(),cropperCanvas=activeCropper?.getCropperCanvas?.();
 if(!selection||!cropperImage||!cropperCanvas||!cropContext)return;
 const canvasRect=cropperCanvas.getBoundingClientRect(),imageRect=cropperImage.getBoundingClientRect();
 const left=imageRect.left-canvasRect.left,top=imageRect.top-canvasRect.top,imgW=imageRect.width,imgH=imageRect.height;
 if(!imgW||!imgH)return;
 const pad=.88,ratio=cropContext.cfg.ratio;
 let width=imgW*pad,height=imgH*pad;
 if(cropContext.cfg.fixed&&Number.isFinite(ratio)&&ratio>0){
   if(width/height>ratio)width=height*ratio;else height=width/ratio;
   if(width>imgW*pad){width=imgW*pad;height=width/ratio}
   if(height>imgH*pad){height=imgH*pad;width=height*ratio}
 }
 const x=left+(imgW-width)/2,y=top+(imgH-height)/2;
 selection.$change?.(x,y,width,height,cropContext.cfg.fixed?ratio:NaN);
}
function keepCropSelectionInsideImage(event){
 const cropperCanvas=activeCropper?.getCropperCanvas?.(),cropperImage=activeCropper?.getCropperImage?.();
 if(!cropperCanvas||!cropperImage)return;
 if(!cropSelectionInside(cropperCanvas.getBoundingClientRect(),cropperImage.getBoundingClientRect(),event.detail||{}))event.preventDefault();
}
let cropPreviewFrame=0,cropPreviewSeq=0;
function scheduleCropPreview(){
 cancelAnimationFrame(cropPreviewFrame);
 cropPreviewFrame=requestAnimationFrame(()=>renderCropPreview());
}
async function renderCropPreview(){
 const selection=activeCropper?.getCropperSelection?.(),canvas=$('#cropPreviewCanvas'),shell=$('#cropPreviewShell');
 if(!selection||!canvas||!shell||!cropContext)return;
 const seq=++cropPreviewSeq,ratio=Math.max(.1,Number(selection.width||1)/Math.max(1,Number(selection.height||1)));
 const maxW=Math.max(220,Math.min(420,shell.clientWidth||360));
 const width=Math.round(maxW),height=Math.max(120,Math.round(width/ratio));
 try{
   const cropped=await selection.$toCanvas({width,height});
   if(seq!==cropPreviewSeq||!cropContext)return;
   canvas.width=cropped.width;canvas.height=cropped.height;
   canvas.style.aspectRatio=cropped.width+' / '+cropped.height;
   const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(cropped,0,0);
 }catch(err){console.warn('[OnlyEvent crop preview]',err)}
}

async function openImageCropper(src,path,returnCollection='',returnIndex='',ownedUrl=''){
 const dlg=$('#imageCropDialog'),stage=$('#cropStage'),img=$('#cropImage'),cfg=imageSlotConfig(path);
 cropContext={path,returnCollection,returnIndex,cfg,src,ownedUrl};
 $('#cropSlotLabel').textContent=cfg.label;
 $('#cropRatioLabel').textContent=cfg.ratioLabel;
 img.src=src;
 dlg.showModal();
 send({type:'OE_CROP_ACTIVE',active:true});
 stage.classList.add('loading');
 try{
   if(activeCropper?.destroy)activeCropper.destroy();
   await new Promise(res=>{if(img.complete&&img.naturalWidth)return res();img.addEventListener('load',res,{once:true});img.addEventListener('error',res,{once:true});});
   activeCropper=await createStudioCropper({image:img,stage,ratio:cfg.ratio,coverage:.9});
   const selection=activeCropper.getCropperSelection?.();
   if(selection){
     if(cfg.fixed&&Number.isFinite(cfg.ratio)){selection.aspectRatio=cfg.ratio;selection.initialAspectRatio=cfg.ratio}
     selection.addEventListener('change',e=>{keepCropSelectionInsideImage(e);if(cfg.fixed&&Number.isFinite(cfg.ratio)){const w=Number(selection.width||0),h=Number(selection.height||0);if(w>1&&h>1){const fit=w/cfg.ratio;if(Math.abs(h-fit)>0.6)selection.height=fit}}if(!e.defaultPrevented)scheduleCropPreview()});
   }
   requestAnimationFrame(()=>{activeCropper?.reset?.();fitCropSelectionToImage();scheduleCropPreview();setTimeout(()=>{fitCropSelectionToImage();scheduleCropPreview()},120)});
 }catch(err){
   console.error('[OnlyEvent cropper]',err);toast('裁剪器加载失败，可稍后重试');closeImageCropper();
 }finally{stage.classList.remove('loading')}
}
function closeImageCropper(){
 cancelAnimationFrame(cropPreviewFrame);cropPreviewSeq++;
 if(activeCropper?.destroy)activeCropper.destroy();
 activeCropper=null;
 const ownedUrl=cropContext?.ownedUrl||'';
 cropContext=null;
 if(ownedUrl)URL.revokeObjectURL(ownedUrl);
 send({type:'OE_CROP_ACTIVE',active:false});
 const dlg=$('#imageCropDialog');if(dlg.open)dlg.close();
}
async function applyImageCrop(){
 if(!activeCropper||!cropContext)return;
 const selection=activeCropper.getCropperSelection?.();if(!selection){toast('未找到裁剪区域');return}
 const applyBtn=$('#cropApply');if(applyBtn){applyBtn.dataset.label=applyBtn.textContent;applyBtn.textContent='上传中…';applyBtn.classList.add('is-busy')}
 $('#cropApply').disabled=true;
 try{
   let width=cropContext.cfg.width,height=cropContext.cfg.height;
   if(cropContext.cfg.free){
     const ratio=Math.max(.1,Number(selection.width||1)/Math.max(1,Number(selection.height||1))),max=cropContext.cfg.maxSize||2000;
     if(ratio>=1){width=max;height=Math.max(1,Math.round(max/ratio))}else{height=max;width=Math.max(1,Math.round(max*ratio))}
   }
   const cropped=await selection.$toCanvas({width,height});
   const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const cx=canvas.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,width,height);cx.drawImage(cropped,0,0,width,height);
   const blob=await canvasToBlob(canvas,'image/webp',.9);
   const data=await storeCroppedImage(blob);
   checkpoint();setDeep(cropContext.path,data);
   if(/^(?:heroImage|mobileHeroImage)$/.test(cropContext.path)||/^tickets\.\d+\.image$/.test(cropContext.path))send({type:'OE_PATCH_FIELD',path:cropContext.path,value:data});else send({type:'OE_REPLACE_STATE',state});
   toast('图片已应用');
   const c=cropContext.returnCollection,i=Number(cropContext.returnIndex),croppedPath=cropContext.path;closeImageCropper();
   if(/^venueMap\.(?:image|more\.\d+\.image)$/.test(croppedPath))openImageInspector('venueMap.image');
   if(/^recap\./.test(croppedPath))renderRecapDialog();
   if(c&&Number.isInteger(i)){if(c.startsWith('custom:'))openCustomPageItemInspector(c.slice(7),i);else if(c.startsWith('product:'))openProductInspector(Number(c.slice(8)),i);else openItemInspector(c,i)}
 }catch(err){console.error('[OnlyEvent crop apply]',err);toast('裁剪失败，请重试')}
 finally{const b=$('#cropApply');if(b){b.disabled=false;if(b.dataset.label){b.textContent=b.dataset.label;delete b.dataset.label}b.classList.remove('is-busy')}}
}
$('#cropApply').onclick=applyImageCrop;
$('#cropCancel').onclick=closeImageCropper;
$('#cropClose').onclick=closeImageCropper;
$('#imageCropDialog').addEventListener('cancel',e=>{e.preventDefault();closeImageCropper()});
$('#cropReset').onclick=()=>{fitCropSelectionToImage();scheduleCropPreview()};
$('#cropZoomOut').onclick=()=>{const im=activeCropper?.getCropperImage?.();if(im?.$zoom){im.$zoom(-.18);scheduleCropPreview()}else toast('裁剪器不支持缩小')};
$('#cropZoomIn').onclick=()=>{const im=activeCropper?.getCropperImage?.();if(im?.$zoom){im.$zoom(.18);scheduleCropPreview()}else toast('裁剪器不支持放大')};
$('#cropRotateLeft').onclick=()=>{activeCropper?.getCropperImage?.()?.$rotate?.('-90deg');requestAnimationFrame(()=>{fitCropSelectionToImage();scheduleCropPreview()})};

$('#imageInput').addEventListener('change',async e=>{
 const file=e.target.files?.[0],path=e.target.dataset.path;
 const returnCollection=e.target.dataset.returnCollection||'',returnIndex=e.target.dataset.returnIndex||'';
 e.target.value='';delete e.target.dataset.returnCollection;delete e.target.dataset.returnIndex;
 if(!file||!path)return;
 const cfg=imageSlotConfig(path);
 try{
   if(file.size>10*1024*1024)toast('正在准备超大图片…');
   const prepared=await prepareCropFile(file,cfg);
   openImageCropper(prepared.url,path,returnCollection,returnIndex,prepared.url);
 }catch(err){console.error('[OnlyEvent image input]',err);toast('图片读取失败')}
});
function setDevice(mode){setStudioDevice(mode,{canvas})}
$('#deviceDesktopBtn').onclick=()=>setDevice('desktop');
$('#deviceMobileBtn').onclick=()=>setDevice('mobile');
 const syncStudioDevice=()=>{const coarse=matchMedia('(pointer:coarse)').matches;const shortLandscape=coarse&&innerHeight<=560;try{setDevice(innerWidth<=820||shortLandscape?'mobile':'desktop')}catch(e){}};
 syncStudioDevice();
 let __deviceTimer=null;
 window.addEventListener('resize',()=>{clearTimeout(__deviceTimer);__deviceTimer=setTimeout(syncStudioDevice,150)});
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
