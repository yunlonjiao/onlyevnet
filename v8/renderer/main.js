// @ts-check
// @ts-ignore -- browser cache-busted absolute ESM URL
import {previewStyle,previewBody} from '/v8/templates/01-ip-only-preview.js?v=8.33.9';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {qs as $,qsa as qa,escapeHtml as esc,getByPath,setByPath} from '/v8/renderer/utils.js?v=8.25.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {runtimeExtraStyle} from '/v8/renderer/runtime-style.js?v=8.33.9';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createCollections} from '/v8/renderer/collections.js?v=8.33.9';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createParticipation} from '/v8/renderer/participation.js?v=8.33.9';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createRouter} from '/v8/renderer/router.js?v=8.33.4';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createFields} from '/v8/renderer/fields.js?v=8.33.11';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createRuntime} from '/v8/renderer/runtime.js?v=8.25.0';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {bindEditorEvents} from '/v8/renderer/editor-events.js?v=8.33.9';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {createStandaloneExporter} from '/v8/renderer/export.js?v=8.33.9';
// @ts-ignore -- browser cache-busted absolute ESM URL
import {validateRendererContext} from '/v8/renderer/context.js?v=8.33.11';

const ORIGIN=location.origin;
let state={},mode='edit';
const send=m=>parent.postMessage(m,ORIGIN);
const runtimeWindow=/** @type {Window & typeof globalThis & {__oeRenderLoadId?:number}} */(window);
runtimeWindow.__oeRenderLoadId=(runtimeWindow.__oeRenderLoadId||0)+1;

const runtimeStyle=document.createElement('style');
runtimeStyle.dataset.oeRuntime='1';
runtimeStyle.textContent=previewStyle+runtimeExtraStyle;
document.head.appendChild(runtimeStyle);
document.body.innerHTML=previewBody.replace('这不是后台功能，而是一种前台视觉表达。主办方只需要配置哪些企划需要展示，网站负责把它做得像活动场刊。','');

const sponsorSection=$('.sponsors')?.closest('section');if(sponsorSection)sponsorSection.id='sponsors';
$('.scroll-progress')?.remove();

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

const collections=createCollections(rendererContext);
const participation=createParticipation(rendererContext);
const router=createRouter({...rendererContext,renderParticipation:participation.renderParticipation});
const fields=createFields({...rendererContext,setModeState:next=>{mode=next},setDeep,renderTickets:collections.renderTickets});
const runtime=createRuntime(rendererContext);
const buildStandaloneHtml=createStandaloneExporter({getState:()=>state,previewStyle,runtimeExtraStyle,escapeHtml:esc});

function applyState(next){
  state={...state,...next};
  Object.keys(fields.fieldMap).forEach(k=>fields.applyField(k,state[k]));
  fields.extraStatePaths.forEach(k=>fields.applyField(k,state[k]));
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
    router.setCurrentPage(m.page||'home');
    applyState(m.state||{});
    fields.setMode(m.mode||'edit');
    runtime.initRuntime();
    router.showPage(router.getCurrentPage(),false);
  }
  if(m.type==='OE_PATCH_FIELD')fields.applyField(m.path,m.value);
  if(m.type==='OE_REPLACE_STATE'){state=m.state||{};applyState(state);runtime.initRuntime()}
  if(m.type==='OE_SET_MODE')fields.setMode(m.mode);
  if(m.type==='OE_CROP_ACTIVE'){
    document.getAnimations().forEach(animation=>{try{m.active?animation.pause():animation.play()}catch{}});
    document.documentElement.classList.toggle('oe-crop-active',!!m.active);
  }
  if(m.type==='OE_SHOW_PAGE')router.showPage(m.page||'home');
  if(m.type==='OE_EXPORT_HTML')send({type:'OE_EXPORT_HTML_RESULT',html:buildStandaloneHtml()});
});
send({type:'OE_READY'});
