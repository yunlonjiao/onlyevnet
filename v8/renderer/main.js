import {previewStyle,previewBody} from '/v8/templates/01-ip-only-preview.js?v=8.33.9';
import {qs as $,qsa as qa,escapeHtml as esc,getByPath,setByPath} from '/v8/renderer/utils.js?v=8.25.0';
import {runtimeExtraStyle} from '/v8/renderer/runtime-style.js?v=8.33.9';
import {createCollections} from '/v8/renderer/collections.js?v=8.33.9';
import {createParticipation} from '/v8/renderer/participation.js?v=8.33.9';
import {createRouter} from '/v8/renderer/router.js?v=8.33.4';
import {createFields} from '/v8/renderer/fields.js?v=8.25.0';
import {createRuntime} from '/v8/renderer/runtime.js?v=8.25.0';
import {bindEditorEvents} from '/v8/renderer/editor-events.js?v=8.33.9';
import {createStandaloneExporter} from '/v8/renderer/export.js?v=8.33.9';

const ORIGIN=location.origin;
let state={},mode='edit';
const send=m=>parent.postMessage(m,ORIGIN);
function reportRuntime(stage,err){
  const message=String(err&&err.message||err||'Unknown runtime error');
  const stack=String(err&&err.stack||'');
  console.error('[OnlyEvent runtime]',stage,err);
  try{send({type:'OE_RUNTIME_ERROR',stage,message,stack})}catch{}
  let box=document.getElementById('oeRuntimeError');
  if(!box){
    box=document.createElement('pre');box.id='oeRuntimeError';
    box.style.cssText='position:fixed;z-index:999999;left:12px;right:12px;top:12px;max-height:46vh;overflow:auto;margin:0;padding:12px 14px;border:2px solid #b42318;border-radius:10px;background:#fff5f3;color:#7a271a;font:12px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;box-shadow:0 8px 30px rgba(0,0,0,.2)';
    document.body.appendChild(box);
  }
  box.textContent='OnlyEvent renderer runtime error\n['+stage+'] '+message+(stack?'\n\n'+stack:'');
}
window.addEventListener('error',e=>reportRuntime('window.error',e.error||e.message));
window.addEventListener('unhandledrejection',e=>reportRuntime('unhandledrejection',e.reason));
window.__oeRenderLoadId=(window.__oeRenderLoadId||0)+1;

const runtimeStyle=document.createElement('style');
runtimeStyle.dataset.oeRuntime='1';
runtimeStyle.textContent=previewStyle+runtimeExtraStyle;
document.head.appendChild(runtimeStyle);
document.body.innerHTML=previewBody.replace('这不是后台功能，而是一种前台视觉表达。主办方只需要配置哪些企划需要展示，网站负责把它做得像活动场刊。','');

const sponsorSection=$('.sponsors')?.closest('section');if(sponsorSection)sponsorSection.id='sponsors';
$('.scroll-progress')?.remove();

const getDeep=path=>getByPath(state,path);
const setDeep=(path,value)=>setByPath(state,path,value);

const collections=createCollections({qs:$,escapeHtml:esc,getState:()=>state,getMode:()=>mode});
const participation=createParticipation({qs:$,escapeHtml:esc,getState:()=>state});
const router=createRouter({qs:$,qsa:qa,getState:()=>state,getMode:()=>mode,renderParticipation:participation.renderParticipation});
const fields=createFields({qs:$,qsa:qa,getMode:()=>mode,setModeState:next=>{mode=next},setDeep,renderTickets:collections.renderTickets});
const runtime=createRuntime({qs:$,qsa:qa});
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
    try{
      router.setCurrentPage(m.page||'home');
      applyState(m.state||{});
      fields.setMode(m.mode||'edit');
      runtime.initRuntime();
      router.showPage(router.getCurrentPage(),false);
      document.documentElement.dataset.oeRenderer='modular';
    }catch(err){reportRuntime('OE_INIT_STATE',err)}
  }
  if(m.type==='OE_PATCH_FIELD'){try{fields.applyField(m.path,m.value)}catch(err){reportRuntime('OE_PATCH_FIELD '+m.path,err)}}
  if(m.type==='OE_REPLACE_STATE'){try{state=m.state||{};applyState(state);runtime.initRuntime()}catch(err){reportRuntime('OE_REPLACE_STATE',err)}}
  if(m.type==='OE_SET_MODE')fields.setMode(m.mode);
  if(m.type==='OE_CROP_ACTIVE'){
    document.getAnimations().forEach(animation=>{try{m.active?animation.pause():animation.play()}catch{}});
    document.documentElement.classList.toggle('oe-crop-active',!!m.active);
  }
  if(m.type==='OE_SHOW_PAGE')router.showPage(m.page||'home');
  if(m.type==='OE_EXPORT_HTML')send({type:'OE_EXPORT_HTML_RESULT',html:buildStandaloneHtml()});
});
send({type:'OE_READY'});
