// @ts-check
/* 不同活动类型用不同的“指南”叫法 */
(function(){const qs=new URLSearchParams(location.search);const tpl=(document.documentElement.dataset.oeTemplate||qs.get('template')||'');const label=tpl.startsWith('03')||tpl.startsWith('04')?'创作展指南':tpl.startsWith('05')||tpl.startsWith('06')?'观演秩序':tpl.startsWith('07')||tpl.startsWith('08')?'活动须知':'观展指南';document.documentElement.dataset.oeGuideLabel=label})();
// @ts-ignore -- browser cache-busted absolute ESM URL
import {renderRecap} from '/v8/renderer/recap.js?v=8.554.0';
import {DEFAULT_TEMPLATE_ID} from '/v8/templates/registry.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {getTemplatePreview,loadTemplatePreview} from '/v8/templates/preview-registry.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {qs as $,qsa as qa,escapeHtml as esc,getByPath,setByPath} from '/v8/renderer/utils.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {runtimeExtraStyle} from '/v8/renderer/runtime-style.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {activityLayoutFixStyle} from '/v8/renderer/activity-layout-fix.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createCollections} from '/v8/renderer/collections.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createParticipation} from '/v8/renderer/participation.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createRouter} from '/v8/renderer/router.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createFields} from '/v8/renderer/fields.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createRuntime} from '/v8/renderer/runtime.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {bindEditorEvents} from '/v8/renderer/editor-events.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createStandaloneExporter} from '/v8/renderer/export.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {validateRendererContext} from '/v8/renderer/context.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {mapCarouselStyle} from '/v8/renderer/map-carousel.js?v=8.554.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {catalogueBookStyle} from '/v8/renderer/catalogue-book.js?v=8.554.0';

const OE_MOBILE_CSS="@media(max-width:720px){#booths .booth-directory-grid,#booths .booth-grid,#booths .lineup-grid,#booths .product-directory-grid,.booth-directory-grid,.product-directory-grid,.lineup-grid,.guest-grid,.sponsor-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:820px){.tp-site .nav{height:auto!important;padding:14px 0 0!important;background:#fffdf8!important;border-bottom:3px solid var(--tp-brown)!important}.tp-site .nav .wrap{display:flex!important;flex-wrap:wrap!important;align-items:center!important;justify-content:space-between!important;gap:8px 18px!important;height:auto!important}.tp-site .nav .brand{flex:0 0 auto!important;max-width:72%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}.tp-site .nav .links{position:static!important;left:auto!important;transform:none!important;order:3!important;flex:1 1 100%!important;width:100%!important;display:flex!important;justify-content:center!important;gap:0!important;margin:0!important;white-space:normal!important;overflow:auto!important;border-top:1px solid var(--tp-line)!important;border-radius:0!important;padding:0!important}.tp-site .nav .links a{padding:12px 16px!important;font-size:12px!important}}";


const ORIGIN=location.origin;
let state={},mode='edit',entryPreviewTimer=0;
const send=m=>parent.postMessage(m,ORIGIN);
const runtimeWindow=/** @type {Window & typeof globalThis & {__oeRenderLoadId?:number}} */(window);
runtimeWindow.__oeRenderLoadId=(runtimeWindow.__oeRenderLoadId||0)+1;

/* Template 02 homepage reveal: one observer, one animation path.
   Replaces legacy conflicting CSS view-timeline rules. */
let oeMotionObserver=null;
function setupHomeMotion(){
  if(currentTemplateId!=='02-scrapbook'||!('IntersectionObserver' in window))return;
  const root=document.querySelector('.trip-site');
  if(!root)return;
  if(oeMotionObserver)oeMotionObserver.disconnect();
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectors=[
    '.trip-intro>aside','.trip-intro-copy','.trip-news>header','.trip-news .updates-list',
    '.trip-index>header','.trip-index .quick-grid','.trip-feature>header',
    '.trip-feature .featured-activity-grid','.trip-ticket-cover','.trip-ticket-list',
    '.trip-map-copy','.trip-map-paper','.trip-community>header','.trip-community .community'
  ];
  root.querySelectorAll(selectors.join(',')).forEach(el=>{
    el.classList.add('oe-motion-target');
    if(reduce){el.classList.add('oe-motion-visible');return;}
    const bounds=el.getBoundingClientRect();
    if(bounds.top<window.innerHeight*.8 && bounds.bottom>0)el.classList.add('oe-motion-visible');
  });
  if(reduce)return;
  oeMotionObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('oe-motion-visible');
      oeMotionObserver?.unobserve(entry.target);
    });
  },{threshold:0.08,rootMargin:'0px 0px -8% 0px'});
  root.querySelectorAll('.oe-motion-target:not(.oe-motion-visible)').forEach(el=>oeMotionObserver.observe(el));
}
const runtimeStyle=document.createElement('style');
runtimeStyle.dataset.oeRuntime='1';
document.head.appendChild(runtimeStyle);

let currentTemplateId='',currentPreview={id:'',style:'',body:''};
function mountTemplate(templateId=DEFAULT_TEMPLATE_ID){
  const next=getTemplatePreview(templateId);
  if(currentTemplateId===next.id&&document.body.children.length)return;
  currentTemplateId=next.id;currentPreview=next;
  document.documentElement.dataset.oeTemplate=next.id;
  document.documentElement.dataset.oeGuideLabel=next.id.indexOf('03')===0||next.id.indexOf('04')===0?'创作展指南':next.id.indexOf('05')===0||next.id.indexOf('06')===0?'观演秩序':next.id.indexOf('07')===0||next.id.indexOf('08')===0?'活动须知':'观展指南';
  document.body.dataset.oeTemplate=next.id;
  runtimeStyle.textContent=currentPreview.style+runtimeExtraStyle+activityLayoutFixStyle+mapCarouselStyle+catalogueBookStyle+OE_MOBILE_CSS;
  document.body.innerHTML=currentPreview.body.replace('这不是后台功能，而是一种前台视觉表达。主办方只需要配置哪些企划需要展示，网站负责把它做得像活动场刊。','');
  const sponsorSection=$('.sponsors')?.closest('section');if(sponsorSection)sponsorSection.id='sponsors';
}
// Wait for OE_INIT_STATE before mounting any template. Rendering the default here
// flashes Template 01 before the Studio sends the chosen Template 02.
const getDeep=path=>getByPath(state,path);
const setDeep=(path,value)=>setByPath(state,path,value);

/** @type {import('./context.js').RendererContext} */
const rendererContext=validateRendererContext({
  qs:$,
  qsa:qa,
  escapeHtml:esc,
  getState:()=>state,
  getMode:()=>mode
});

const collections=createCollections({...rendererContext,send});
const participation=createParticipation({...rendererContext,send});
const router=createRouter({...rendererContext,renderParticipation:participation.renderParticipation,onPageNavigate:page=>send({type:'OE_PAGE_NAVIGATED',page})});
  try{window.__oeRouter=router}catch{}
const fields=createFields({...rendererContext,setModeState:next=>{mode=next},setDeep,renderTickets:collections.renderTickets});
const runtime=createRuntime(rendererContext);
const buildStandaloneHtml=()=>createStandaloneExporter({getState:()=>state,previewStyle:currentPreview.style,runtimeExtraStyle:runtimeExtraStyle+activityLayoutFixStyle+mapCarouselStyle+catalogueBookStyle,escapeHtml:esc})();

function resolveLifecycleStatus(){
  if(state.eventStatusMode==='manual')return ['upcoming','live','ended'].includes(state.eventStatus)?state.eventStatus:'upcoming';
  const now=Date.now(),start=Date.parse(state.eventStartDateTime||''),end=Date.parse(state.eventEndDateTime||'');
  if(Number.isFinite(end)&&now>end)return 'ended';
  if(Number.isFinite(start)&&now>=start&&(!Number.isFinite(end)||now<=end))return 'live';
  return 'upcoming';
}
function applyLifecycleState(){
  const status=resolveLifecycleStatus();
  const eventStatusLabel=$('[data-oe-status="event"]');
  if(eventStatusLabel)eventStatusLabel.textContent=status==='live'?'活动进行中':status==='ended'?'活动已结束':'活动未开始';
  document.documentElement.classList.remove('event-status-upcoming','event-status-live','event-status-ended');
  document.documentElement.classList.add('event-status-'+status);
  const copy=$('.hero-copy');
  if(copy){
    let badge=copy.querySelector('.event-status-badge');
    if(!badge){badge=document.createElement(status==='live'?'a':'span');badge.className='event-status-badge';copy.insertBefore(badge,copy.firstChild)}
    if(status==='live'){
      if(badge.tagName!=='A'){
        const next=document.createElement('a');next.className='event-status-badge';badge.replaceWith(next);badge=next;
      }
      badge.href='#activities';badge.dataset.pageLink='activities';badge.dataset.targetMode='page';badge.textContent='活动进行中 · 查看当天日程';
    }else{
      if(badge.tagName!=='SPAN'){
        const next=document.createElement('span');next.className='event-status-badge';badge.replaceWith(next);badge=next;
      }
      badge.textContent=status==='ended'?'活动已结束':'活动未开始';
    }
  }
  const ended=status==='ended'&&mode!=='edit';
  qa('.ticket-purchase-link,.nav>.wrap>.btn').forEach(el=>{
    if(ended)el.setAttribute('hidden','');
    else el.removeAttribute('hidden');
  });
}

function applyEntryState(){
  const a=state.entryAnimation||{},loader=$('#loader');
  if(!loader)return;
  const linkedTitle=String(state.eventName||'ONLYEVENT').trim();
  const linkedDate=String(state.date||'').trim();
  const linkedLocation=String(state.location||'').trim();
  const title=String(a.titleText||linkedTitle).trim();
  const date=String(a.dateText||linkedDate).trim();
  const time=String(a.timeText||'').trim();
  const location=String(a.locationText||linkedLocation).trim();
  const ticketKey='oe-memorial-ticket:'+String(state.projectId||linkedTitle||'default');
  let ticketNo='';
  try{ticketNo=localStorage.getItem(ticketKey)||''}catch{}
  if(ticketNo.length!==6){
    ticketNo=String(Math.floor(Math.random()*1000000)).padStart(6,'0');
    try{localStorage.setItem(ticketKey,ticketNo)}catch{}
  }
  loader.style.setProperty('--entry-accent',String(state.theme||'#ff5f91'));
  const set=(sel,value)=>{const el=$(sel);if(el)el.textContent=value};
  const show=(sel,on)=>{const el=$(sel);if(el)el.hidden=!on};
  const photo=$('.entry-photo');
  if(photo){
    const custom=String(a.image||'').trim();
    const linked=String(state.heroImage||'').trim();
    const kvDesktop=String(a.kvDesktop||'').trim();
    const kvMobile=String(a.kvMobile||'').trim();
    const src=kvDesktop||((a.imageMode==='custom'&&custom)?custom:(a.imageMode==='linked'?linked:custom));
    const mobileSrc=kvMobile;
    const splashSrc=(mobileSrc&&typeof matchMedia==='function'&&matchMedia('(max-width:560px)').matches)?mobileSrc:src;
    photo.style.backgroundImage=splashSrc?'url("'+splashSrc.replace(/"/g,'%22')+'")':'';
    photo.classList.toggle('empty',!src);
  }
  set('.entry-ticket-label',state.templateId==='02-scrapbook'?'A NEW JOURNEY BEGINS':String(a.labelText||'MEMORIAL TICKET'));
  set('.entry-ticket-title',title);
  set('.entry-ticket-subtitle',String(a.subtitleText||(state.templateId==='02-scrapbook'?'一起出发，去见想见的人。':'')));
  set('.entry-ticket-date',date);
  set('.entry-ticket-time',time);
  set('.entry-ticket-location',location);
  set('.entry-serial',String(a.ticketPrefix||'NO.')+' '+ticketNo);
  show('.entry-ticket-label',a.showLabel!==false);
  show('.entry-ticket-title',a.showTitle!==false&&!!title);
  show('.entry-ticket-subtitle',state.templateId==='02-scrapbook'||(a.showSubtitle===true&&!!String(a.subtitleText||'').trim()));
  show('.entry-ticket-date-wrap',a.showDate!==false&&!!date);
  show('.entry-ticket-time-wrap',a.showTime===true&&!!time);
  show('.entry-ticket-location-wrap',a.showLocation!==false&&!!location);
  show('.stub-barcode',a.showBarcode!==false);
  show('.stub-code',a.showTicketNumber!==false);
  const skip=$('#skip');if(skip)skip.hidden=a.showSkip===false;
}
function previewEntry({play=false}={}){
  applyEntryState();
  if(play&&state.templateId==='04-creator-catalogue'&&typeof window.__oeCatalogueReplay==='function'){window.__oeCatalogueReplay();return}
  const loader=$('#loader');if(!loader)return;
  document.documentElement.classList.add('oe-entry-preview');
  clearTimeout(entryPreviewTimer);
  loader.classList.remove('hide','entry-playing');
  if(play){
    void loader.offsetWidth;
    loader.classList.add('entry-playing');
    const delay=state.templateId==='02-scrapbook'?4100:Math.max(900,Math.min(3200,Number(state.entryAnimation?.duration)||1800));
    entryPreviewTimer=setTimeout(()=>{
      loader.classList.remove('entry-playing');
      loader.classList.add('hide');
    },delay+500);
  }
}
function hideEntryPreview(){
  document.documentElement.classList.remove('oe-entry-preview');
  $('#loader')?.classList.remove('entry-playing','hide');
}
function bindEntryTicket(){
  const loader=$('#loader'),gate=$('.gate'),skip=$('#skip');
  if(!loader||!gate||gate.dataset.oeEntryBound==='1')return;
  gate.dataset.oeEntryBound='1';
  const finish=()=>{clearTimeout(entryPreviewTimer);loader.classList.remove('entry-playing');loader.classList.add('hide')};
  const play=()=>{if(loader.classList.contains('entry-playing')){if(state.templateId==='02-scrapbook')finish();return}if(mode==='preview')previewEntry({play:true})};
  gate.addEventListener('click',play);
  gate.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
  skip?.addEventListener('click',e=>{e.stopPropagation();finish()});
}

function __setlistLive(path,value){
   try{
    if(!/\.setlist$/.test(path))return;
    const parts=path.split('.');const idx=parts[1];
    const prefix=path.indexOf('schedule.')===0?'schedule-':'participation-';
    const row=document.querySelector('[data-activity-index="'+idx+'"]')||document.getElementById(prefix+idx)||document.querySelector('[data-oe-index="'+idx+'"]');if(!row)return;
    let box=row.querySelector('.bl-setlist');
    if(!box){box=document.createElement('div');box.className='bl-setlist';const host=row.querySelector('.bl-set-body, .tp-activity-copy, .bd-activity-copy, .bl-activity-copy')||row;host.appendChild(box)}
    const songs=String(value||'').split(/(?=《)|[\/、,，\n]+/).map(t=>t.trim()).filter(Boolean);
    box.innerHTML=songs.map(t=>'<span>'+t.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</span>').join('');
   }catch(err){}
 }
function applyState(next){
   if(next&&Array.isArray(next.socialLinks)&&/^0[5678]/.test(String(next.templateId||""))){next={...next,socialLinks:next.socialLinks.filter(x=>!/摊主|COS|报名/.test(String(x&&x.label||"")))}}
  state={...state,...next};
  document.documentElement.dataset.oePalette05=state.palette05||"warm";
  document.documentElement.dataset.oePalette06=state.palette06||"classic";
  ["01","02","03","04","05","06","07","08"].forEach(n=>{document.documentElement.dataset["oePalette"+n]=state["palette"+n]||"original"});
  Object.keys(fields.fieldMap).forEach(k=>fields.applyField(k,state[k]));
  fields.extraStatePaths.forEach(k=>fields.applyField(k,state[k]));
  applyEntryState();
  applyLifecycleState();
  collections.renderCollections();
  participation.renderParticipation();
  renderRecap(state);
  bindEntryTicket();
  fields.markEditable();
  router.applyModules();
  router.showPage(router.getCurrentPage(),false);
}

bindEditorEvents({
  getMode:()=>mode,getState:()=>state,setDeep,send,router,
  openGiftLightbox:collections.openGiftLightbox,qsa:qa
});

// Messages are handled one at a time, in order, because loading a template's preview is asynchronous.
let messageQueue=Promise.resolve();
window.addEventListener('message',e=>{
  if(e.origin!==ORIGIN||e.source!==parent)return;
  const m=e.data||{};
  messageQueue=messageQueue.then(()=>handleMessage(m)).catch(err=>console.error('[OnlyEvent renderer]',err));
});
async function handleMessage(m){
  if(m.type==='OE_INIT_STATE'||m.type==='OE_REPLACE_STATE')await loadTemplatePreview(m.state?.templateId||DEFAULT_TEMPLATE_ID);
  if(m.type==='OE_INIT_STATE'){
    mountTemplate(m.state?.templateId||DEFAULT_TEMPLATE_ID);
    router.setCurrentPage(m.page||'home');
    applyState(m.state||{});
    fields.setMode(m.mode||'edit');
    if(m.mode==='preview'&&state.entryAnimation?.enabled!==false)previewEntry({play:false});
    runtime.initRuntime();
    router.showPage(router.getCurrentPage(),false);
    requestAnimationFrame(setupHomeMotion);
  }
  if(m.type==='OE_PATCH_FIELD'){setDeep(m.path,m.value);fields.applyField(m.path,m.value);
     if(__setlistLive)__setlistLive(m.path,m.value);if(m.path!=='heroImage'&&m.path!=='mobileHeroImage')applyEntryState();else collections.renderCatalogueBook?.();if(['eventStatus','eventStatusMode','eventStartDateTime','eventEndDateTime'].includes(m.path))applyLifecycleState()}
  if(m.type==='OE_REPLACE_STATE'){mountTemplate(m.state?.templateId||DEFAULT_TEMPLATE_ID);state=m.state||{};applyState(state);runtime.initRuntime();requestAnimationFrame(setupHomeMotion)}
  if(m.type==='OE_SET_MODE'){
    fields.setMode(m.mode);
    if(m.mode==='preview'&&state.entryAnimation?.enabled!==false)previewEntry({play:false});
    else if(m.mode!=='preview')hideEntryPreview();
    applyLifecycleState();
    collections.renderCollections();
    participation.renderParticipation();
    fields.markEditable();
    router.applyModules();
    router.showPage(router.getCurrentPage(),false);
    requestAnimationFrame(setupHomeMotion);
  }
    if(m.type==='OE_CROP_ACTIVE'){
    document.getAnimations().forEach(animation=>{try{m.active?animation.pause():animation.play()}catch{}});
    document.documentElement.classList.toggle('oe-crop-active',!!m.active);
  }
  if(m.type==='OE_PREVIEW_ENTRY')previewEntry({play:!!m.play});
  if(m.type==='OE_HIDE_ENTRY_PREVIEW')hideEntryPreview();
  if(m.type==='OE_SHOW_PAGE'){router.showPage(m.page||'home');requestAnimationFrame(setupHomeMotion)}
  if(m.type==='OE_EXPORT_HTML')send({type:'OE_EXPORT_HTML_RESULT',html:buildStandaloneHtml()});
 if(m.type==='OE_BLUR'){try{document.activeElement&&document.activeElement.blur()}catch(e){}}
 if(m.type==='OE_SAVE_SELECTION'){try{const s=getSelection();if(s&&s.rangeCount&&!s.isCollapsed){window.__oeSel=s.getRangeAt(0).cloneRange()}}catch(e){}}
 if(m.type==='OE_RESTORE_SELECTION'){try{const r=window.__oeSel;if(!r)return;const host=r.commonAncestorContainer.nodeType===1?r.commonAncestorContainer:r.commonAncestorContainer.parentElement;const ed=host&&host.closest&&host.closest('[contenteditable="true"]');if(ed)ed.focus({preventScroll:true});const s=getSelection();s.removeAllRanges();s.addRange(r)}catch(e){}}
}
// Synchronize native browser Back/Forward with the in-page router.
window.addEventListener('popstate',()=>{
  const requested=decodeURIComponent((location.hash||'#home').slice(1)||'home');
  const page=requested==='home'||router.isStandalonePage(requested)?requested:'home';
  router.showPage(page,false);
  window.scrollTo({top:0,left:0,behavior:'auto'});
  requestAnimationFrame(setupHomeMotion);
});
send({type:'OE_READY'});
try{
 const __fixT7MobileNav=()=>{
  if(currentTemplateId!=='07-tea-party'||innerWidth>820)return;
  const nav=document.querySelector('.tp-site .nav'),wrap=document.querySelector('.tp-site .nav .wrap'),links=document.querySelector('.tp-site .nav .links'),brand=document.querySelector('.tp-site .nav .brand');
  if(!nav||!wrap||!links)return;
  const set=(el,props)=>{for(const [k,v] of Object.entries(props))el.style.setProperty(k,v,'important')};
  set(nav,{height:'auto',padding:'14px 0 0',background:'#fffdf8','border-bottom':'3px solid var(--tp-brown)','backdrop-filter':'none','-webkit-backdrop-filter':'none'});
  set(wrap,{display:'flex','flex-wrap':'wrap','align-items':'center','justify-content':'space-between',gap:'8px 18px',height:'auto',position:'relative'});
  if(brand)set(brand,{flex:'0 0 auto','max-width':'72%',overflow:'hidden','text-overflow':'ellipsis','white-space':'nowrap'});
  set(links,{position:'static',left:'auto',transform:'none',order:'3',flex:'1 1 100%',width:'100%',display:'flex','justify-content':'center',gap:'10px',margin:'0','white-space':'normal',overflow:'auto','border-top':'1px solid var(--tp-line)','border-radius':'0',padding:'0'});
  links.querySelectorAll('a').forEach(a=>set(a,{padding:'12px 14px','font-size':'13px','letter-spacing':'0','white-space':'nowrap'}));
  const dock=document.querySelector('.tp-site .mobile-dock');if(dock)set(dock,{'backdrop-filter':'none','-webkit-backdrop-filter':'none'});
 };
 __fixT7MobileNav();window.addEventListener('resize',__fixT7MobileNav);setTimeout(__fixT7MobileNav,300);setTimeout(__fixT7MobileNav,1200);
}catch(e){}


/* PAGE TOP and #top links must scroll the preview iframe, not the outer editor */
try{
 const __oeTopScroll=e=>{const a=e.target&&e.target.closest&&e.target.closest('a[href="#top"],.bd-top');if(!a)return;e.preventDefault();window.scrollTo({top:0,left:0,behavior:'auto'});try{history.replaceState(null,'',location.pathname+location.search)}catch(err){}};
 document.addEventListener('click',__oeTopScroll,true);
}catch(e){}

/* activity day tabs must work in the editor preview too */
document.addEventListener('click',(e)=>{
 const tab=e.target&&e.target.closest&&e.target.closest('#activities .activity-day-tabs [data-activity-day]');
 if(!tab)return;
 e.preventDefault();
 const day=tab.dataset.activityDay||'';
 document.querySelectorAll('#activities .activity-day-tabs [data-activity-day]').forEach(x=>x.classList.toggle('active',x===tab));
 document.querySelectorAll('#activities [data-activity-day]:not(.activity-day-tabs [data-activity-day])').forEach(r=>{r.hidden=!!day&&r.dataset.activityDay!==day});
},true);

try{
 const __fixTouchTargets=()=>{
  if(!(innerWidth<=820||matchMedia('(pointer:coarse)').matches))return;
  document.querySelectorAll('.pill.venue-nav').forEach(a=>{if(a.getBoundingClientRect().height<44)a.style.setProperty('min-height','44px','important');});
  document.querySelectorAll('.mobile-dock a').forEach(a=>{if(a.getBoundingClientRect().width<44)a.style.setProperty('min-width','44px','important');});
 };
 new MutationObserver(__fixTouchTargets).observe(document.body,{childList:true,subtree:true});
 setTimeout(__fixTouchTargets,400);setTimeout(__fixTouchTargets,1500);
}catch(e){}

try{
 const __dropTemplateFooters=()=>{document.querySelectorAll('footer').forEach(el=>el.remove());};
 new MutationObserver(__dropTemplateFooters).observe(document.body,{childList:true,subtree:true});
 setTimeout(__dropTemplateFooters,200);setTimeout(__dropTemplateFooters,800);
}catch(e){}

function stripStrayBraceText(){
  try{
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const hits=[];let node;
    while((node=walker.nextNode())){if(/^\s*\)\}\s*$/.test(node.nodeValue||''))hits.push(node)}
    hits.forEach(n=>n.remove());
  }catch(e){}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',stripStrayBraceText,{once:true});else stripStrayBraceText();
new MutationObserver(()=>requestAnimationFrame(stripStrayBraceText)).observe(document.documentElement,{childList:true,subtree:true});
