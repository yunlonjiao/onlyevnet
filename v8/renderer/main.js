// @ts-check
// @ts-ignore -- browser cache-busted absolute ESM URL
import {DEFAULT_TEMPLATE_ID} from '/v8/templates/registry.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {getTemplatePreview} from '/v8/templates/preview-registry.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {qs as $,qsa as qa,escapeHtml as esc,getByPath,setByPath} from '/v8/renderer/utils.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {runtimeExtraStyle} from '/v8/renderer/runtime-style.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {activityLayoutFixStyle} from '/v8/renderer/activity-layout-fix.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createCollections} from '/v8/renderer/collections.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createParticipation} from '/v8/renderer/participation.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createRouter} from '/v8/renderer/router.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createFields} from '/v8/renderer/fields.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createRuntime} from '/v8/renderer/runtime.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {bindEditorEvents} from '/v8/renderer/editor-events.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createStandaloneExporter} from '/v8/renderer/export.js?v=8.34.54';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {validateRendererContext} from '/v8/renderer/context.js?v=8.34.54';

const ORIGIN=location.origin;
let state={},mode='edit',entryPreviewTimer=0;
const send=m=>parent.postMessage(m,ORIGIN);
const runtimeWindow=/** @type {Window & typeof globalThis & {__oeRenderLoadId?:number}} */(window);
runtimeWindow.__oeRenderLoadId=(runtimeWindow.__oeRenderLoadId||0)+1;

const runtimeStyle=document.createElement('style');
runtimeStyle.dataset.oeRuntime='1';
document.head.appendChild(runtimeStyle);

let currentTemplateId='',currentPreview=getTemplatePreview(DEFAULT_TEMPLATE_ID);
function mountTemplate(templateId=DEFAULT_TEMPLATE_ID){
  const next=getTemplatePreview(templateId);
  if(currentTemplateId===next.id&&document.body.children.length)return;
  currentTemplateId=next.id;currentPreview=next;
  runtimeStyle.textContent=currentPreview.style+runtimeExtraStyle+activityLayoutFixStyle;
  document.body.innerHTML=currentPreview.body.replace('这不是后台功能，而是一种前台视觉表达。主办方只需要配置哪些企划需要展示，网站负责把它做得像活动场刊。','');
  const sponsorSection=$('.sponsors')?.closest('section');if(sponsorSection)sponsorSection.id='sponsors';
  $('.scroll-progress')?.remove();
}
mountTemplate(DEFAULT_TEMPLATE_ID);

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
const fields=createFields({...rendererContext,setModeState:next=>{mode=next},setDeep,renderTickets:collections.renderTickets});
const runtime=createRuntime(rendererContext);
const buildStandaloneHtml=()=>createStandaloneExporter({getState:()=>state,previewStyle:currentPreview.style,runtimeExtraStyle:runtimeExtraStyle+activityLayoutFixStyle,escapeHtml:esc})();

function applyEntryState(){
  const a=state.entryAnimation||{},loader=$('#loader');
  if(!loader)return;
  const title=String(a.title||state.eventName||'ONLYEVENT').trim();
  const date=String(state.date||'').trim(),location=String(state.location||'').trim();
  const shortDate=date.replace(/^(\d{4})[.\/-]?/,'').replace(/[.\/-]/g,'.');
  loader.style.setProperty('--entry-accent',String(a.accent||state.theme||'#ff5f91'));
  const set=(sel,value)=>{const el=$(sel);if(el)el.textContent=value};
  set('.entry-organizer',a.organizer||'ONLYEVENT');
  set('.entry-main-title',title);
  set('.entry-subtitle',a.subtitle||'ADMIT ONE · OFFICIAL EVENT PASS');
  set('.entry-date',date||'DATE TBA');
  set('.entry-location',location||'VENUE TBA');
  set('.stub-title',a.ticketLabel||'ENTRY PASS');
  set('.stub-event',title);
  set('.entry-serial',a.serial||'OE-001');
  set('.entry-short-date',shortDate||'DATE');
  const skip=$('#skip');if(skip)skip.hidden=a.showSkip===false;
}
function previewEntry({play=false}={}){
  applyEntryState();
  const loader=$('#loader');if(!loader)return;
  document.documentElement.classList.add('oe-entry-preview');
  loader.classList.remove('hide','entry-playing');
  if(play){
    void loader.offsetWidth;
    loader.classList.add('entry-playing');
    const delay=Math.max(1100,Number(state.entryAnimation?.duration)||1800);
    clearTimeout(entryPreviewTimer);
    entryPreviewTimer=setTimeout(()=>loader.classList.add('hide'),delay+500);
  }
}
function hideEntryPreview(){
  document.documentElement.classList.remove('oe-entry-preview');
  $('#loader')?.classList.remove('entry-playing','hide');
}

function applyState(next){
  state={...state,...next};
  Object.keys(fields.fieldMap).forEach(k=>fields.applyField(k,state[k]));
  fields.extraStatePaths.forEach(k=>fields.applyField(k,state[k]));
  applyEntryState();
  collections.renderCollections();
  fields.markEditable();
  router.applyModules();
  router.showPage(router.getCurrentPage(),false);
}

bindEditorEvents({
  getMode:()=>mode,getState:()=>state,setDeep,send,router,
  openGiftLightbox:collections.openGiftLightbox,qsa:qa
});

window.addEventListener('message',e=>{
  if(e.origin!==ORIGIN||e.source!==parent)return;
  const m=e.data||{};
  if(m.type==='OE_INIT_STATE'){
    mountTemplate(m.state?.templateId||DEFAULT_TEMPLATE_ID);
    router.setCurrentPage(m.page||'home');
    applyState(m.state||{});
    fields.setMode(m.mode||'edit');
    runtime.initRuntime();
    router.showPage(router.getCurrentPage(),false);
  }
  if(m.type==='OE_PATCH_FIELD'){setDeep(m.path,m.value);fields.applyField(m.path,m.value)}
  if(m.type==='OE_REPLACE_STATE'){mountTemplate(m.state?.templateId||DEFAULT_TEMPLATE_ID);state=m.state||{};applyState(state);runtime.initRuntime()}
  if(m.type==='OE_SET_MODE'){
    fields.setMode(m.mode);
    collections.renderCollections();
    participation.renderParticipation();
    fields.markEditable();
    router.applyModules();
    router.showPage(router.getCurrentPage(),false);
  }
  if(m.type==='OE_CROP_ACTIVE'){
    document.getAnimations().forEach(animation=>{try{m.active?animation.pause():animation.play()}catch{}});
    document.documentElement.classList.toggle('oe-crop-active',!!m.active);
  }
  if(m.type==='OE_PREVIEW_ENTRY')previewEntry({play:!!m.play});
  if(m.type==='OE_HIDE_ENTRY_PREVIEW')hideEntryPreview();
  if(m.type==='OE_SHOW_PAGE')router.showPage(m.page||'home');
  if(m.type==='OE_EXPORT_HTML')send({type:'OE_EXPORT_HTML_RESULT',html:buildStandaloneHtml()});
});
send({type:'OE_READY'});
