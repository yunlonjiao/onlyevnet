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
import {createContentCounts} from '/v8/editor/studio-content-counts.js';
import {pageContentItems} from '/v8/editor/studio-page-nav.js';
import {pageNavHtml} from '/v8/editor/studio-page-nav-html.js';
import {presetEntriesForState} from '/v8/editor/studio-preset-entries.js';
import {collectionArrayFor,collectionPathFor} from '/v8/editor/studio-collection.js';
import {extraInspectorHtml} from '/v8/editor/studio-extra-inspector.js';
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
 box.innerHTML=pages.map((page,index)=>{
   const key=customPageKey(page.id),preset=CUSTOM_PAGE_PRESETS[page.preset]||CUSTOM_PAGE_PRESETS.custom;
   return '<div class="page-tree-row custom-page-row" data-page-row="'+esc(key)+'"><button data-page="'+esc(key)+'" type="button"><span class="nav-icon">◇</span><span>'+esc(page.title||preset.title)+'</span><small class="custom-page-type">'+esc(preset.title)+'</small></button><div class="custom-page-row-tools"><button type="button" data-move-custom-page="'+esc(page.id)+'" data-dir="-1" '+(index===0?'disabled':'')+' title="上移" aria-label="上移 '+esc(page.title||preset.title)+'">↑</button><button type="button" data-move-custom-page="'+esc(page.id)+'" data-dir="1" '+(index===pages.length-1?'disabled':'')+' title="下移" aria-label="下移 '+esc(page.title||preset.title)+'">↓</button><button type="button" class="custom-page-row-delete" data-delete-custom-page-row="'+esc(page.id)+'" title="删除页面" aria-label="删除 '+esc(page.title||preset.title)+'">×</button></div></div>';
 }).join('');
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
 setInspector('专题页面',page.title,
   '<div class="item-fields">'+
   '<label><span>页面标题</span><input data-custom-page-field="title" value="'+esc(page.title||'')+'"></label>'+
   '<label><span>英文小标题</span><input data-custom-page-field="eyebrow" value="'+esc(page.eyebrow||'SPECIAL')+'"></label>'+
   '<label><span>页面介绍</span><textarea data-custom-page-field="intro" rows="4">'+esc(page.intro||'')+'</textarea></label>'+
   '</div><div class="reference-panel"><b>页面预设</b><p class="inspector-note">'+esc((CUSTOM_PAGE_PRESETS[page.preset]||CUSTOM_PAGE_PRESETS.custom).title)+' · 页面已按该内容类型配置展示结构。</p></div>'+
   '<div class="custom-page-settings-actions"><button type="button" class="danger ghost" data-delete-custom-page>删除此页面</button></div>');
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
 const rows=items.map((item,i)=>'<button type="button" class="sidebar-content-row '+(i===selectedIndex?'active':'')+'" data-custom-item-index="'+i+'">'+
   '<span class="sidebar-content-thumb '+(item.image?'has-image':'')+'">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'◇')+'</span>'+
   '<span class="sidebar-content-copy"><b>'+esc(item.title||preset.itemTitle+' '+(i+1))+'</b>'+(item.meta?'<small>'+esc(item.meta)+'</small>':'')+'</span><i>›</i></button>').join('');
 panel.innerHTML='<div class="sidebar-content-head"><div><b>'+esc(preset.itemTitle+'展示')+'</b><span>'+items.length+' 项</span></div></div>'+
   '<div class="sidebar-content-rows">'+(rows||'<div class="sidebar-content-empty">还没有'+esc(preset.itemTitle)+'内容</div>')+'</div>'+
   '<button type="button" class="sidebar-content-add" data-add-custom-item>＋ 添加'+esc(preset.itemTitle)+'</button>';
 panel.querySelectorAll('[data-custom-item-index]').forEach(btn=>btn.onclick=()=>openCustomPageItemInspector(pageId,Number(btn.dataset.customItemIndex)));
 panel.querySelector('[data-add-custom-item]')?.addEventListener('click',()=>mutateCustomPageItem(pageId,items.length-1,'add'));
}
function openCustomPageItemInspector(pageId,index){
 const pi=customPageIndex(pageId),page=state.customPages?.[pi],item=page?.items?.[index];if(pi<0||!page||!item)return;
 const preset=customPageFieldLabels(page),path='customPages.'+pi+'.items.'+index;
 const image=item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
 setInspector('专题内容',preset.itemTitle+' · '+(item.title||String(index+1)),
   '<div class="item-inspector-head"><div><span>'+esc(page.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(page.items.length).padStart(2,'0')+'</b></div><div class="item-tools"><button data-custom-item-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-custom-item-op="down" '+(index===page.items.length-1?'disabled':'')+'>↓</button></div></div>'+
   '<div class="item-fields">'+
   '<label><span>'+esc(preset.titleLabel)+'</span><input data-custom-item-field="title" value="'+esc(item.title||'')+'"></label>'+
   '<label><span>'+esc(preset.metaLabel)+'</span><input data-custom-item-field="meta" value="'+esc(item.meta||'')+'"></label>'+
   '<label><span>'+esc(preset.textLabel)+'</span><textarea data-custom-item-field="text" rows="4">'+esc(item.text||'')+'</textarea></label>'+
   '<label><span>外部链接（可选）</span><input data-custom-item-field="url" value="'+esc(item.url||'')+'"></label>'+
   '</div><div class="item-media"><span>展示图片</span><div class="item-media-row">'+image+'<div><button type="button" data-custom-item-image>选择 / 裁剪</button>'+(item.image?'<button type="button" class="ghost" data-custom-item-image-remove>移除</button>':'')+'</div></div></div>'+
   '<div class="item-actions"><button data-custom-item-op="add">＋ 添加</button><button data-custom-item-op="delete" class="danger">删除</button></div>');
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
 setInspector('页面内容',label,
   '<div class="item-fields">'+
   '<label><span>页面标题</span><input data-optional-field="title" value="'+esc(page.title||label)+'"></label>'+
   '<label><span>正文</span><textarea data-optional-field="text" rows="6">'+esc(page.text||'')+'</textarea></label>'+
   '</div>'+
   '<div class="item-media"><span>页面图片</span><div class="item-media-row">'+
   (page.image?'<img src="'+esc(page.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+
   '<div><button type="button" data-optional-image>选择 / 裁剪</button>'+
   (page.image?'<button type="button" class="ghost" data-optional-image-remove>移除</button>':'')+
   '</div></div></div>');
 inspector.querySelectorAll('[data-optional-field]').forEach(input=>bindInspectorStateInput(input,key+'.'+input.dataset.optionalField,{clean:true}));
 inspector.querySelector('[data-optional-image]')?.addEventListener('click',()=>{$('#imageInput').dataset.path=key+'.image';$('#imageInput').click()});
 inspector.querySelector('[data-optional-image-remove]')?.addEventListener('click',()=>{checkpoint();setDeep(key+'.image','');send({type:'OE_REPLACE_STATE',state});openOptionalPageInspector(key)});
}
function setPageContentActive({tool='',collection=''}={}){
 document.querySelectorAll('[data-page-content-manager],[data-page-tool]').forEach(x=>{
   const on=collection?x.dataset.pageContentManager===collection:tool?x.dataset.pageTool===tool:false;
   x.classList.toggle('active',on);
 });
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
    setInspector('入场动画','封面图',
      '<div class="entry-animation-inspector"><div class="item-media"><span>封面 KV（贴合书页 5:7）</span><div class="item-media-row">'+(v?'<img src="'+esc(v)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button type="button" data-cover-kv>选择 / 裁剪</button>'+(v?'<button type="button" class="ghost" data-cover-kv-remove>移除</button>':'')+'</div></div></div><p class="inspector-note">封面 KV 会铺在合上的书页上，比例贴合书本；不需要再区分桌面和手机。</p></div>');
    inspector.querySelector('[data-cover-kv]')?.addEventListener('click',()=>{const input=$('#imageInput');input.dataset.path='heroImage';input.click()});
    inspector.querySelector('[data-cover-kv-remove]')?.addEventListener('click',()=>{checkpoint();state.heroImage='';save();send({type:'OE_PATCH_FIELD',path:'heroImage',value:''});openEntryAnimationInspector()});
    return;
  }

  const heroMedia=(key,label)=>{const v=String(((state.entryAnimation||{})[key])||'').trim();return '<div class="item-media"><span>'+label+'</span><div class="item-media-row">'+(v?'<img src="'+esc(v)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button type="button" data-kv-image="'+key+'">选择 / 裁剪</button></div></div></div>';};
  setInspector('入场动画','开屏设置',
    '<div class="entry-animation-inspector">'+heroMedia('kvDesktop','主图')+heroMedia('kvMobile','手机 KV（可选，留空用桌面 KV）')+
    ''+
    '<p class="inspector-note">开屏动画单独使用这两张图，与首页横幅互不影响；手机 KV 留空时沿用桌面 KV。</p></div>');
  inspector.querySelectorAll('[data-kv-image]').forEach(btn=>btn.addEventListener('click',()=>{
    const input=$('#imageInput');input.dataset.path='entryAnimation.'+btn.dataset.kvImage;input.click();
  }));
}
function openBannerInspector(){
  const slot=(key,label,note)=>{const v=String(state[key]||'').trim();return '<div class="item-media"><span>'+label+'</span><div class="item-media-row">'+(v?'<img src="'+esc(v)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button type="button" data-banner-image="'+key+'">'+(v?'更换':'选择 / 裁剪')+'</button>'+(v?'<button type="button" class="ghost" data-banner-remove="'+key+'">移除</button>':'')+'</div></div>'+(note?'<small>'+note+'</small>':'')+'</div>';};
  setInspector('横幅','首页横幅',
    '<div class="entry-animation-inspector">'+slot('heroImage','桌面横幅')+slot('mobileHeroImage','手机横幅（可选）','留空时用桌面横幅居中裁切')+
    '<p class="inspector-note">桌面 5:2 宽幅，手机 3:2；两张都可单独上传。</p></div>');
  inspector.querySelectorAll('[data-banner-image]').forEach(btn=>btn.addEventListener('click',()=>{
    const input=$('#imageInput');input.dataset.path=btn.dataset.bannerImage;input.click();
  }));
  inspector.querySelectorAll('[data-banner-remove]').forEach(btn=>btn.addEventListener('click',()=>{
    checkpoint();const key=btn.dataset.bannerRemove;setDeep(key,'');save();send({type:'OE_PATCH_FIELD',path:key,value:''});openBannerInspector();
  }));
}
function openTrafficInspector(){
  const img=String(state.venueMap?.transitImage||'');
  setInspector('交通到达','交通路线图与导航',
    '<div class="entry-animation-inspector"><div class="item-media"><span>交通路线图</span><div class="item-media-row">'+
    (img?'<img src="'+esc(img)+'" alt="">':'<div class="item-media-empty">＋</div>')+
    '<div><button type="button" data-traffic-image>选择 / 裁剪</button></div></div></div>'+
    '<div class="item-fields"><label><span>地图导航链接</span><input id="trafficNavInput" value="'+esc(state.navigationUrl||'')+'" placeholder="https://uri.amap.com/..."></label></div>'+
    '<div class="entry-animation-actions"><button type="button" id="saveTrafficNav">保存导航链接</button></div>'+
    '<p class="inspector-note">交通文字内容在「规则与须知」里维护（交通到达那一条）。</p></div>');
  inspector.querySelector('[data-traffic-image]')?.addEventListener('click',()=>{const input=$('#imageInput');input.dataset.path='venueMap.transitImage';input.click();});
  $('#saveTrafficNav')?.addEventListener('click',()=>{checkpoint();state.navigationUrl=String($('#trafficNavInput')?.value||'').trim();save();send({type:'OE_REPLACE_STATE',state});});
}
function openStreetManager(){
  const groups=streetGroups(state);
  const images=new Map((state.streets||[]).map((s,i)=>[String(s.name||''),String(s.image||'')]));
  const rows=groups.map(g=>{
    const img=images.get(g.name)||'';
    const range=[g.from,g.to].filter(Boolean).join('–');
    return '<div class="item-fields"><label><span>'+esc(range||'未分配号段')+' · '+g.count+' 个社团</span><input data-street-rename="'+esc(g.name)+'" value="'+esc(g.name)+'"></label>'+
      '<div class="item-media-row"><button type="button" data-street-image="'+esc(g.name)+'">'+(img?'更换宣传图':'上传街道宣传图')+'</button>'+
      (img?'<img src="'+esc(img)+'" alt="" style="width:64px;height:36px;object-fit:cover;border-radius:6px">':'')+
      '<button type="button" class="ghost" data-street-delete="'+esc(g.name)+'">删除街道</button></div></div>';
  }).join('');
  setInspector('摊位','街道',
    '<div class="entry-animation-inspector">'+
    (rows||'<div class="sidebar-content-empty">还没有街道，先在摊位的「街道」字段里填写。</div>')+
    '<div class="item-fields"><label><span>新增街道</span><input id="newStreetName" placeholder="例如 D 街道 · 新刊区"></label></div>'+
    '<div class="entry-animation-actions"><button type="button" id="addStreetBtn">新增街道</button></div>'+
    '<p class="inspector-note">街道来自每个摊位的「街道」字段；改名会同步更新该街道下的所有摊位，宣传图用于社团作品页的街道横幅和首页街道卡。</p></div>');
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

function syncModuleControls(){
 const guestPageRow=document.querySelector('[data-page-row="guests"]');
 if(guestPageRow)guestPageRow.style.display=state.templateId==='02-scrapbook'?'none':'';
 // Templates without some first-level pages (03 has no 活动 / 嘉宾) or without custom pages.
 (activeTemplate.studioPages?.hidden||[]).forEach(page=>{const row=document.querySelector('[data-page-row="'+page+'"]');if(row)row.style.display='none'});
 /* removeUnusedRows：单页模板不再保留这些页面入口 */
 if(/^0[56]/.test(activeTemplate.id||'')){['activities','guests','guide'].forEach(k=>{document.querySelectorAll('[data-page-row="'+k+'"]').forEach(r=>r.remove())})}
 const guideRow=document.querySelector('[data-page-row="guide"]');if(guideRow){const span=guideRow.querySelector('span:last-child');if(span)span.textContent=guideLabelText()} /* 按活动类型命名指南页 */
 const bookStreetRow=(()=>{
   if(state.templateId!=='04-creator-catalogue')return null;
   let row=document.querySelector('[data-page-row="bookStreets"]');
   const nav=document.querySelector('.page-nav');
   if(!row&&nav){
     row=document.createElement('div');row.className='page-tree-row';row.dataset.pageRow='bookStreets';
     row.innerHTML='<button type="button"><span class="nav-icon">◎</span><span>街道导览</span></button><label class="page-inline-switch" title="在书里显示街道导览页"><input type="checkbox" data-book-street aria-label="街道导览页面"><i></i></label>';
     const custom=nav.querySelector('#customPageRows');if(custom)nav.insertBefore(row,custom);else nav.appendChild(row);
     row.querySelector('[data-book-street]').addEventListener('change',e=>{checkpoint();state.bookStreetPage=e.target.checked;save();send({type:'OE_REPLACE_STATE',state});});
   }
   if(row){row.style.display='';const cb=row.querySelector('[data-book-street]');if(cb)cb.checked=state.bookStreetPage===true;}
   return row;
 })();
 const animRow=document.querySelector('.entry-animation-row');if(animRow)animRow.style.display=(activeTemplate.studioPages?.hidden||[]).includes('animation')?'none':'';
 const customPageButton=document.querySelector('#createCustomPageBtn');
 if(customPageButton)customPageButton.hidden=activeTemplate.studioPages?.customPages===false;
 document.querySelectorAll('[data-module]').forEach(input=>{input.checked=state.modules?.[input.dataset.module]!==false});
 document.querySelectorAll('[data-page-row]').forEach(row=>row.classList.toggle('is-disabled',state.modules?.[row.dataset.pageRow]===false));
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

function openHeroTitleInspector(){
 const desktop=String(state.heroImage||'').trim(),mobile=String(state.mobileHeroImage||'').trim();
 const media=(path,label,src,emptyLabel)=>'<div class="item-media hero-media-field"><span>'+label+'</span><div class="item-media-row"><button type="button" class="item-media-thumb '+(src?'':'empty')+'" data-hero-image="'+path+'" aria-label="上传'+label+'">'+(src?'<img src="'+esc(src)+'" alt="">':'<b>'+emptyLabel+'</b>')+'</button>'+(src?'<button type="button" class="item-media-remove" data-hero-image-remove="'+path+'">移除</button>':'')+'</div></div>';
 const isTravel=state.templateId==='02-scrapbook';
 setInspector('主视觉',isTravel?'主图与裁切':'标题、图片与裁切',
  '<div class="item-fields">'+
  '<label><span>第一行</span><input data-sync-path="heroTitle1" value="'+esc(state.heroTitle1||'')+'"></label>'+
  '<label><span>第二行</span><input data-sync-path="heroTitle2" value="'+esc(state.heroTitle2||'')+'"></label>'+
  '<label><span>第三行</span><input data-sync-path="heroTitle3" value="'+esc(state.heroTitle3||'')+'"></label>'+
  '</div>'+
  media('heroImage','主图',desktop,'＋')+media('mobileHeroImage','手机主图（可选）',mobile,'＋')+
  '<p class="inspector-note">手机主图留空时自动使用主图。</p>');
 inspector.querySelectorAll('[data-sync-path]').forEach(input=>bindInspectorStateInput(input,input.dataset.syncPath,{clean:input.type!=='color'}));
 inspector.querySelectorAll('[data-hero-image]').forEach(btn=>btn.addEventListener('click',()=>{$('#imageInput').dataset.path=btn.dataset.heroImage;$('#imageInput').click()}));
 inspector.querySelectorAll('[data-hero-image-remove]').forEach(btn=>btn.addEventListener('click',()=>{checkpoint();setDeep(btn.dataset.heroImageRemove,'');save();send({type:'OE_PATCH_FIELD',path:btn.dataset.heroImageRemove,value:''})}));
}
function openLifecycleInspector(){
 const mode=String(state.eventStatusMode||'auto'),status=String(state.eventStatus||'upcoming');
 setInspector('活动状态','生命周期','<div class="lifecycle-grid">'+
   '<button type="button" data-event-status-mode="auto" class="'+(mode==='auto'?'active':'')+'"><b>自动判断</b><small>根据活动开始 / 结束时间自动切换</small></button>'+
   '<button type="button" data-event-status="upcoming" class="'+(mode==='manual'&&status==='upcoming'?'active':'')+'"><b>手动 · 未开始</b><small>强制显示未开始状态</small></button>'+
   '<button type="button" data-event-status="live" class="'+(mode==='manual'&&status==='live'?'active':'')+'"><b>手动 · 进行中</b><small>强制显示进行中状态</small></button>'+
   '<button type="button" data-event-status="ended" class="'+(mode==='manual'&&status==='ended'?'active':'')+'"><b>手动 · 已结束</b><small>强制隐藏失效购票入口</small></button>'+
 '</div><p class="inspector-note">推荐使用自动判断。只在需要提前切换或特殊运营时使用手动状态。</p>');
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
 $('#recapBody').innerHTML=
  '<section class="share-block"><h3>显示方式</h3><div class="item-fields"><label><span>首页上的这一块</span><select data-recap="mode"><option value="off">不显示</option><option value="live">现场直击（活动当天用）</option><option value="recap">活动回顾（活动结束后用）</option></select></label>'+
  '<label><span>标题</span><input data-recap="title" maxlength="40" placeholder="留空则用默认标题" value="'+esc(r.title||'')+'"></label>'+
  '<label><span>简介</span><textarea data-recap="summary" rows="3" maxlength="600" placeholder="一两句话说说今天或这次活动">'+esc(r.summary||'')+'</textarea></label></div></section>'+
  '<section class="share-block"><h3>现场动态</h3>'+r.posts.map((p,i)=>'<div class="recap-row" data-list="posts" data-i="'+i+'"><input data-f="time" maxlength="12" placeholder="时间" value="'+esc(p.time||'')+'"><textarea data-f="text" rows="2" maxlength="300" placeholder="发生了什么">'+esc(p.text||'')+'</textarea><button type="button" class="recap-rm" aria-label="删除">×</button></div>').join('')+'<button type="button" class="recap-add" data-add="posts">＋ 添加一条动态</button></section>'+
  '<section class="share-block"><h3>现场照片</h3><div class="recap-photos">'+r.photos.map((p,i)=>'<div class="recap-photo" data-list="photos" data-i="'+i+'"><button type="button" class="recap-pick" data-pick="'+i+'">'+(p.image?'<img src="'+esc(p.image)+'" alt="">':'＋')+'</button><input data-f="caption" maxlength="40" placeholder="说明（可不填）" value="'+esc(p.caption||'')+'"><button type="button" class="recap-rm" aria-label="删除">×</button></div>').join('')+'</div><button type="button" class="recap-add" data-add="photos">＋ 添加一张照片</button></section>'+
  '<section class="share-block"><h3>B站视频</h3><p class="inspector-note">粘贴视频链接，BV 号的视频会直接嵌入播放，其他链接显示成按钮。</p>'+r.videos.map((v,i)=>'<div class="recap-row" data-list="videos" data-i="'+i+'"><input data-f="url" placeholder="视频链接" value="'+esc(v.url||'')+'"><input data-f="title" maxlength="40" placeholder="标题（可不填）" value="'+esc(v.title||'')+'"><button type="button" class="recap-rm" aria-label="删除">×</button></div>').join('')+'<button type="button" class="recap-add" data-add="videos">＋ 添加一个视频</button></section>'+
  '<section class="share-block"><h3>微博、小红书等平台的投稿链接</h3>'+r.links.map((l,i)=>'<div class="recap-row" data-list="links" data-i="'+i+'"><input data-f="label" maxlength="30" placeholder="按钮文字" value="'+esc(l.label||'')+'"><input data-f="url" placeholder="链接" value="'+esc(l.url||'')+'"><button type="button" class="recap-rm" aria-label="删除">×</button></div>').join('')+'<button type="button" class="recap-add" data-add="links">＋ 添加一个链接</button></section>';
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
function shareText(){
 const url=publishRecord?.url||'',bits=[state.date,state.location].map(v=>String(v||'').trim()).filter(Boolean).join(' · ');
 return '我会去「'+(state.eventName||'活动')+'」！'+(bits?'\n'+bits:'')+(url?'\n活动网站：'+url:'');
}
function renderShareDialog(){
 state.seo??={};
 const seo=state.seo,url=publishRecord?.url||'',host=url?url.replace(/^https?:\/\//,'').replace(/\/$/,''):'发布后显示网址';
 const title=seo.ogTitle||seo.pageTitle||state.eventName||'活动网站',desc=seo.ogDescription||seo.metaDescription||state.tagline||'',img=seo.ogImage||state.heroImage||'';
 $('#shareBody').innerHTML=
  '<section class="share-block"><h3>网站地址</h3>'+(url?'<div class="share-url"><b>'+esc(url)+'</b><button type="button" data-share-copy-url>复制链接</button><button type="button" data-share-open>打开网站 ↗</button></div>':'<p class="inspector-note">还没有发布。发布后这里会显示游客网址。</p>')+'</section>'+
  (url?'<section class="share-block"><h3>二维码</h3><div class="share-qr"><div id="shareQr" aria-label="活动网站二维码"></div><div><p class="inspector-note">印在海报或写进群公告，扫一下就能打开活动网站。</p><button type="button" id="shareQrSave">下载二维码</button></div></div></section>':'')+
  (url?'<section class="share-block"><h3>各平台的宣传链接</h3><p class="inspector-note">不同平台发不同的链接，后台「数据统计」里就能看到哪个平台带来的访问多。</p>'+PROMO_CHANNELS.map(c=>'<div class="share-channel"><b>'+c.label+'</b><code>'+esc(url.replace(/\/$/,'')+'/?from='+c.key)+'</code><button type="button" data-share-channel="'+c.key+'">复制</button></div>').join('')+'</section>':'')+
  '<section class="share-block"><h3>别人转发时的样子</h3><div class="share-card"><div class="share-card-img">'+(img?'<img src="'+esc(img)+'" alt="">':'<span>分享封面</span>')+'</div><div class="share-card-text"><b>'+esc(title)+'</b><small>'+esc(desc)+'</small><i>'+esc(host)+'</i></div></div>'+
  '<div class="item-fields"><label><span>分享标题</span><input data-seo-field="ogTitle" value="'+esc(seo.ogTitle||'')+'" placeholder="留空则使用活动名称"></label>'+
  '<label><span>分享描述</span><textarea data-seo-field="ogDescription" rows="3" placeholder="留空则使用活动简介">'+esc(seo.ogDescription||'')+'</textarea></label></div>'+
  '<div class="item-media"><span>分享封面</span><div class="item-media-row">'+(seo.ogImage?'<img src="'+esc(seo.ogImage)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button type="button" data-seo-image>选择 / 裁剪</button>'+(seo.ogImage?'<button type="button" class="ghost" data-seo-image-remove>移除</button>':'')+'</div></div></div>'+
  '<p class="inspector-note">封面留空时使用活动主视觉。</p></section>'+
  '<section class="share-block"><h3>发给朋友的话</h3><textarea id="shareMessage" rows="4"></textarea><div class="share-actions"><button type="button" data-share-copy-text>复制文案</button></div></section>'+
  '<details class="share-block"><summary>搜索引擎</summary><div class="item-fields"><label><span>页面标题</span><input data-seo-field="pageTitle" value="'+esc(seo.pageTitle||'')+'" placeholder="留空则使用活动名称"></label>'+
  '<label><span>页面描述</span><textarea data-seo-field="metaDescription" rows="3" placeholder="用于搜索结果摘要">'+esc(seo.metaDescription||'')+'</textarea></label>'+
  '<label><span>标准网址 Canonical</span><input type="url" data-seo-field="canonical" value="'+esc(seo.canonical||'')+'" placeholder="一般不用填"></label></div></details>';
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
function downloadSvg(svg,name){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
function openShareDialog(){renderShareDialog();if(!shareDialog.open)shareDialog.showModal()}
function openSeoInspector(){shareDialog.open?renderShareDialog():openShareDialog()}

function openAddressInspector(){
 setInspector('基础信息','时间、场馆与导航','<div class="item-fields">'+
  '<label><span>活动开始时间</span><input type="datetime-local" data-sync-path="eventStartDateTime" value="'+esc(state.eventStartDateTime||'')+'"></label>'+
  '<label><span>活动结束时间</span><input type="datetime-local" data-sync-path="eventEndDateTime" value="'+esc(state.eventEndDateTime||'')+'"></label>'+
  '<label><span>活动日期</span><input data-sync-path="date" value="'+esc(state.date||'')+'"></label>'+ 
  '<label><span>举办城市</span><input data-sync-path="location" value="'+esc(state.location||'')+'"></label>'+ 
  '<label><span>场馆地址</span><input data-sync-path="edition" value="'+esc(state.edition||'')+'"></label>'+
  '<label><span>导航链接</span><input type="url" data-sync-path="navigationUrl" value="'+esc(state.navigationUrl||'')+'" placeholder="https://"></label>'+
 '</div><div class="row"><button id="testNavigation" type="button">打开导航 ↗</button></div><p class="inspector-note">活动状态默认自动判断：开始前为未开始，活动时间内为进行中，超过结束时间后自动变为已结束。</p>');
 const tplId=(activeTemplate?.id||'');
 const PALETTES={
  '01':[['original','原色'],['ice','冷蓝'],['cream','奶油棕']],
  '02':[['original','原色'],['blue','灰蓝'],['sand','暖砂']],
  '03':[['original','原色'],['matcha','抹茶'],['pink','藕粉']],
  '04':[['original','原色'],['gray','冷灰'],['wine','酒红']],
  '05':[['warm','原色'],['ice','雾蓝'],['forest','森绿'],['mauve','沙紫']],
  '06':[['classic','原色'],['ice','冷蓝'],['brick','砖红']],
  '07':[['original','原色'],['mint','薄荷'],['sakura','樱粉']],
  '08':[['original','原色'],['sky','星空蓝'],['butter','奶油黄']]
 };
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
 setInspector('票务','购票平台','<div class="item-fields">'+
   '<label><span>按钮文字</span><input id="ticketLinkLabelInput" value="'+esc(state.ticketLinkLabel||'前往官方售票平台')+'"></label>'+
   '<label><span>外部购票链接</span><input id="ticketUrlInput" type="url" value="'+esc(state.ticketUrl||'')+'" placeholder="https://"></label>'+
   '</div><div class="row"><button id="testTicketUrl" type="button">打开购票平台 ↗</button></div><p class="inspector-note">这是整场活动统一的购票入口，不需要在每个票种里重复填写。</p>');
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
   setInspector('活动简介','简介正文','<label>活动介绍<textarea id="fieldInput" data-path="tagline">'+esc(state.tagline||'')+'</textarea></label>');
   const input=$('#fieldInput');fitTextarea(input);let started=false;
   input.addEventListener('input',e=>{if(!started){checkpoint();started=true}setDeep('tagline',e.target.value);send({type:'OE_PATCH_FIELD',path:'tagline',value:e.target.value});fitTextarea(e.target)});
   input.addEventListener('blur',()=>save());return;
 }
 if(path.startsWith('heroTitle')||['heroImage','mobileHeroImage'].includes(path)){openHeroTitleInspector();return}
 const value=getDeep(path);
 setInspector('内容','编辑文字','<label>内容<textarea id="fieldInput" data-path="'+esc(path)+'">'+esc(value)+'</textarea></label>');
 const input=$('#fieldInput');let started=false;fitTextarea(input);
 input.addEventListener('input',e=>{if(!started){checkpoint();started=true}setDeep(path,e.target.value);send({type:'OE_PATCH_FIELD',path,value:e.target.value});fitTextarea(e.target)});
 input.addEventListener('blur',e=>{const cleaned=cleanValue(e.target.value);if(cleaned!==e.target.value){e.target.value=cleaned;setDeep(path,cleaned);send({type:'OE_PATCH_FIELD',path,value:cleaned});fitTextarea(e.target)}});
}
const collectionMeta={
 ribbonItems:{title:'滚动公告',fields:[['text','内容']]},
 explore:{title:'继续探索',fields:[['label','显示名称']]},
 tickets:{title:'票务',fields:[['name','票名'],['price','价格'],['gift','特典'],['note','备注']]},
 featuredActivities:{title:'活动精选',fields:[]},
 participation:{title:'活动',fields:[['title','活动名称'],['text','一句话简介'],['detail','活动内容'],['participationMode','参与方式'],['requirements','参加要求'],['rules','通用规则与注意事项'],['url','报名 / 外部链接']]},
 schedule:{title:'活动日程',fields:[['day','日期 / DAY'],['time','开始时间'],['endTime','结束时间'],['title','活动名称'],['stage','地点区域'],['detail','活动简介'],['setlist','节目'],['registrationUrl','报名 / 外部链接']]},
 guide:{title:'指南内容',fields:[['title','标题'],['label','英文小标题'],['text','说明']]},
 guests:{title:'嘉宾',fields:[['name','姓名 / 团体名称'],['members','成员（可选）'],['attendanceNote','出席说明（可选）'],['works','代表作 / 主要内容'],['intro','介绍']]},
 booths:{title:'摊位',fields:[['no','摊位号'],['street','街道'],['name','社团名'],['type','分类'],['intro','简介']]},
 updates:{title:'重要更新',fields:[['date','日期'],['title','更新内容']]},socialLinks:{title:'社群入口',fields:[['label','名称'],['note','说明'],['url','链接']]},sponsors:{title:'赞助支持',fields:[['name','名称'],['level','级别'],['url','链接']]}
};
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
 setInspector('制品','编辑制品',
   '<div class="product-direct-head"><button type="button" class="ghost" data-direct-product-back>← 返回制品列表</button><span>'+esc((booth.no?booth.no+' · ':'')+(booth.name||'所属摊位'))+'</span><b>'+esc(product.name||'未命名制品')+'</b></div>'+
   '<div class="item-media product-direct-media"><span>制品图片</span><div class="item-media-row">'+image+'<div><button type="button" data-direct-product-image>选择 / 裁剪</button>'+(product.image?'<button type="button" data-direct-product-crop class="ghost">重新裁剪</button><button type="button" data-direct-product-remove-image class="ghost">移除</button>':'')+'</div></div></div>'+
   '<div class="item-fields product-direct-fields">'+
     '<label><span>制品名称</span><input data-direct-product-key="name" value="'+esc(product.name||'')+'"></label>'+
     '<label><span>Tag（选填）</span><input data-direct-product-key="tag" value="'+esc(product.tag||'')+'" placeholder="如：亚克力 立牌"></label>'+
     '<label><span>价格</span><input data-direct-product-key="price" value="'+esc(product.price||'')+'"></label>'+
     '<label><span>说明</span><textarea data-direct-product-key="note" rows="2">'+esc(product.note||'')+'</textarea></label>'+
   '</div>'+
   '<p class="inspector-note">制品搜索只匹配“名称 + Tag”。</p>'+
   '<div class="item-actions"><button type="button" data-direct-product-delete class="danger">删除制品</button></div>'
 );
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
function participationInspectorFields(item){
 const preset=item?.preset||'custom';
 const common={
  title:['title','活动名称'],text:['text','一句话简介'],detail:['detail','活动内容'],
  mode:['participationMode','参与方式'],requirements:['requirements','参加要求'],
  rules:['rules','活动规则'],url:['url','报名链接'],setlist:['setlist','节目']
 };
 const map={
  stage:[common.title,common.text,common.detail,common.mode,common.rules,common.url,common.setlist],
  guest:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules,common.url,common.setlist],
  signing:[common.title,common.text,common.detail,common.mode,common.requirements,common.url,common.setlist],
  live:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules,common.url,common.setlist],
  randomDance:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  stamp:[common.title,common.text,common.detail,common.mode,common.rules],
  game:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  photo:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  cosplay:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  itasha:[common.title,common.text,common.detail,common.rules],
  support:[common.title,common.text,common.detail,common.mode,common.rules]
 };
 return map[preset]||[common.title,common.text,common.detail,common.mode,common.requirements,common.rules,common.url,common.setlist];
}
function openItemInspector(collection,index){
  lastCollection=collection;lastItemIndex=index;
 const meta=collectionMeta[collection],arr=collectionArray(collection),item=arr?.[index];if(!meta||!item)return;
 const count=arr.length;
 const isLong=k=>['text','gift','note','detail','rules','requirements','intro','works','appearance','setlist'].includes(k);
 const inspectorFields=collection==='participation'?participationInspectorFields(item):meta.fields;
 const media=collection==='participation'
   ?'<div class="item-media"><span>活动宣传图</span><div class="item-media-row">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="participation.'+index+'.image">选择 / 裁剪</button>'+(item.image?'<button data-remove-media="participation.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>'
   :collection==='tickets'?'<div class="item-media"><span>赠品图片</span><div class="item-media-row">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="tickets.'+index+'.image">选择图片</button>'+(item.image?'<button data-remove-media="tickets.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>':collection==='socialLinks'?'<div class="item-media"><span>二维码 / 图片</span><div class="item-media-row">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="socialLinks.'+index+'.image">选择 / 裁剪</button>'+(item.image?'<button data-remove-media="socialLinks.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>':collection==='sponsors'?'<div class="item-media"><span>Logo</span><div class="item-media-row">'+(item.logo?'<img src="'+esc(item.logo)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="sponsors.'+index+'.logo">选择 Logo</button>'+(item.logo?'<button data-remove-media="sponsors.'+index+'.logo" class="ghost">移除</button>':'')+'</div></div></div>':'';
 const guideMedia=collection==='guide'&&item.preset==='traffic'
   ?(item.image
     ?'<div class="item-media"><span>路线图 / 入口示意图</span><div class="item-media-row"><img src="'+esc(item.image)+'" alt=""><div><button data-media-path="guide.items.'+index+'.image">替换图片</button><button data-remove-media="guide.items.'+index+'.image" class="ghost">移除</button></div></div></div>'
      :'<div class="item-media"><span>路线图 / 入口示意图</span><div class="item-media-row"><div><button type="button" data-media-path="guide.items.'+index+'.image">＋ 上传路线图 / 入口示意图</button></div></div></div>')
   :'';
 const itemTitle=contentManagerMeta[collection]?.item?.(item,index)?.[0]||meta.title;
 const itemActions=collection==='featuredActivities'?'':'<div class="item-actions"><button data-op="add">＋ 添加</button><button data-op="delete" class="danger">删除</button></div>';
 setInspector('内容',meta.title+' · '+itemTitle,'<div class="item-inspector-head"><div><span>'+esc(meta.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0')+'</b></div><div class="item-tools"><button data-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-op="down" '+(index===count-1?'disabled':'')+'>↓</button></div></div><div class="item-fields">'+inspectorFields.map(([key,label])=>'<label><span>'+label+'</span>'+(isLong(key)?'<textarea data-key="'+key+'" rows="1">'+esc(item[key]||'')+'</textarea>':'<input data-key="'+key+'" value="'+esc(item[key]??'')+'" '+(key==='tone'?'type="color"':'')+'>')+'</label>').join('')+'</div>'+media+guideMedia+extraInspector(collection,index,item)+itemActions);
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
function imageSlotConfigBase(path){

 if(path==='heroImage'&&state.templateId==='01-ip-only')return {label:'首页主视觉',ratio:window.innerWidth<=820?0.94:812/500,ratioLabel:'与首页主视觉框一致',width:window.innerWidth<=820?940:1624,height:window.innerWidth<=820?1000:1000,fixed:true};
 if(path==='heroImage'&&state.templateId==='05-live-poster')return {label:'舞台主视觉',ratio:3/5,ratioLabel:'舞台主视觉 · 3:5（与右侧竖版框体一致）',width:900,height:1500,fixed:true};
 if(path==='heroImage'&&state.templateId==='06-band-live')return {label:'首屏主视觉',ratio:4/5,ratioLabel:'首屏主视觉 · 4:5（竖版）',width:1000,height:1250,fixed:true};
 if(/^guests\.\d+\.image$/.test(path))return {label:'嘉宾形象图',ratio:3/4,ratioLabel:'嘉宾形象图 · 比例 3:4',width:900,height:1200,fixed:true};
 if(path==='heroImage'&&state.templateId==='02-scrapbook')return {label:'首页全屏 KV',ratio:16/9,ratioLabel:'桌面端全屏主视觉 · 1920 × 1080',width:1920,height:1080,fixed:true};
 if(path==='heroImage'&&state.templateId==='04-creator-catalogue')return {label:'封面图',ratio:5/7,ratioLabel:'封面 KV · 比例 5:7（贴合书页）',width:1000,height:1400,fixed:true};
 if(path==='heroImage'&&state.templateId==='03-creator-market')return {label:'首页横幅',ratio:5/2,ratioLabel:'首页横幅 · 比例 5:2（宽幅）',width:1800,height:720,fixed:true};
 if(path==='heroImage')return {label:'桌面主视觉 KV',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1400,height:1400,fixed:true};
 if(path==='mobileHeroImage'&&state.templateId==='03-creator-market')return {label:'手机横幅',ratio:3/2,ratioLabel:'手机横幅 · 比例 3:2',width:1200,height:800,fixed:true};
 if(path==='mobileHeroImage'&&state.templateId==='02-scrapbook')return {label:'手机主视觉（可选）',ratio:3/4,ratioLabel:'标准海报 · 比例 3:4',width:1080,height:1440,fixed:true};
 if(path==='mobileHeroImage')return {label:'手机主视觉 KV',ratio:4/5,ratioLabel:'手机端独立主视觉 · 比例 4:5',width:1080,height:1350,fixed:true};
 if(path==='entryAnimation.kvDesktop'&&state.templateId==='01-ip-only')return {label:'开屏桌面 KV',ratio:1,ratioLabel:'纪念票照片 · 1:1（与照片框一致）',width:1200,height:1200,fixed:true};
 if(path==='entryAnimation.kvDesktop')return {label:'开屏桌面 KV',ratio:16/9,ratioLabel:'桌面开屏 · 比例 16:9',width:1920,height:1080,fixed:true};
 if(path==='entryAnimation.kvMobile'&&state.templateId==='01-ip-only')return {label:'开屏手机 KV',ratio:1,ratioLabel:'纪念票照片 · 1:1（与照片框一致）',width:1200,height:1200,fixed:true};
 if(path==='entryAnimation.kvMobile')return {label:'开屏手机 KV',ratio:9/16,ratioLabel:'手机开屏 · 比例 9:16',width:1080,height:1920,fixed:true};
 if(path==='venueMap.image')return {label:'场地图',ratio:16/9,ratioLabel:'场地图 · 比例 16:9',width:1600,height:900,fixed:true};
 if(path==='venueMap.transitImage')return {label:'交通路线图',ratio:16/9,ratioLabel:'交通路线图 · 比例 16:9',width:1600,height:900,fixed:true};
 if(/^streets\.\d+\.image$/.test(path))return {label:'街道宣传图',ratio:1/1.414,ratioLabel:'街道海报 · A4 竖版（1:1.414）',width:1080,height:1527,fixed:true};
 if(path==='seo.ogImage')return {label:'分享封面',ratio:1.91,ratioLabel:'社交分享推荐比例 1.91:1',width:1200,height:628,fixed:true};
 if(/^recap\.photos\.\d+\.image$/.test(path))return {label:'现场照片',ratio:4/3,ratioLabel:'裁剪框可移动 · 比例 4:3',width:1200,height:900,fixed:true};
 if(/^tickets\.\d+\.image$/.test(path))return {label:'票务赠品图',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:900,height:900,fixed:true};
 if(/^participation\.\d+\.image$/.test(path))return {label:'活动宣传图',ratio:16/9,ratioLabel:'裁剪框可移动 · 比例 16:9',width:1440,height:810,fixed:true};
 if(/^featuredActivities\.\d+\.image$/.test(path))return {label:'首页活动精选图片',ratio:16/9,ratioLabel:'裁剪框可移动 · 比例 16:9',width:1440,height:810,fixed:true};
 if(/^guests\.\d+\.image$/.test(path))return {label:'嘉宾宣传图',ratio:4/3,ratioLabel:'与嘉宾卡预览一致 · 裁剪框可移动 · 比例 4:3',width:1200,height:900,fixed:true};
 if(/^booths\.\d+\.products\.\d+\.image$/.test(path))return {label:'制品图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1000,height:1000,fixed:true};
 if(path==='venueMap.image'||/^venueMap\.more\.\d+\.image$/.test(path))return {label:'场地图',ratio:16/9,ratioLabel:'场地图 · 与展示框比例一致',width:1600,height:900,fixed:true};
 if(/^guests\.\d+\.image$/.test(path))return {label:'嘉宾形象图',ratio:3/4,ratioLabel:'嘉宾形象图 · 比例 3:4',width:900,height:1200,fixed:true};
 if(/^guide\.items\.\d+\.image$/.test(path)){const i=Number(path.match(/^guide\.items\.(\d+)\.image$/)?.[1]||-1),item=state.guide?.items?.[i];return {label:item?.preset==='traffic'?'交通路线图 / 入口示意图':'指南图片',ratio:16/9,ratioLabel:'与展示框比例一致',width:1600,height:900,fixed:true}};
 if(/^(freewalk|itasha)\.image$/.test(path))return {label:'活动图片',ratio:.8,ratioLabel:'裁剪框可移动 · 比例 4:5',width:960,height:1200,fixed:true};
 if(/^booths\.\d+\.logo$/.test(path))return {label:'社团 Logo',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:700,height:700,fixed:true};
 if(/^socialLinks\.\d+\.image$/.test(path))return {label:'二维码 / 社群图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:900,height:900,fixed:true};
 if(/^sponsors\.\d+\.logo$/.test(path))return {label:'赞助商 Logo',ratio:1.8,ratioLabel:'裁剪框可移动 · 比例 9:5',width:1080,height:600,fixed:true};
 const cm=path.match(/^customPages\.(\d+)\.items\.\d+\.image$/);
 if(cm){
   const page=state.customPages?.[Number(cm[1])],preset=CUSTOM_PAGE_PRESETS[page?.preset]||CUSTOM_PAGE_PRESETS.custom,ratio=preset.ratio||1.333333;
   return {label:(preset.itemTitle||'展示内容')+'图片',ratio,ratioLabel:'裁剪框可移动 · 页面预设比例',width:ratio<1?960:1200,height:ratio<1?1200:Math.round(1200/ratio),fixed:true};
 }
 return {label:'图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1200,height:1200,fixed:true};
}
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
function canvasToBlob(canvas,type='image/webp',quality=.9){
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('图片编码失败')),type,quality));
}
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
 const c=cropperCanvas.getBoundingClientRect(),r=cropperImage.getBoundingClientRect(),d=event.detail||{};
 const left=r.left-c.left,top=r.top-c.top,right=left+r.width,bottom=top+r.height,eps=.5;
 if(d.x<left-eps||d.y<top-eps||d.x+d.width>right+eps||d.y+d.height>bottom+eps)event.preventDefault();
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
