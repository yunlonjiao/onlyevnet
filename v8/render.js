import {previewStyle,previewBody} from '/v8/templates/01-ip-only-preview.js?v=8.3.0';
import {qs as $,qsa as qa,escapeHtml as esc,getByPath,setByPath} from '/v8/renderer/utils.js?v=8.4.0';
import {runtimeExtraStyle} from '/v8/renderer/runtime-style.js?v=8.4.0';
import {createCollections} from '/v8/renderer/collections.js?v=8.4.0';
import {createPassport} from '/v8/renderer/passport.js?v=8.4.0';
const ORIGIN=location.origin;let state={},mode='edit',revealObs=null,stampObs=null,progressObs=null;
window.__oeRenderLoadId=(window.__oeRenderLoadId||0)+1;
const runtimeStyle=document.createElement('style');
runtimeStyle.textContent=previewStyle+runtimeExtraStyle;
document.head.appendChild(runtimeStyle);
document.body.innerHTML=previewBody.replace('这不是后台功能，而是一种前台视觉表达。主办方只需要配置哪些企划需要展示，网站负责把它做得像活动场刊。','');
const send=m=>parent.postMessage(m,ORIGIN);
const sponsorSection=$('.sponsors')?.closest('section');if(sponsorSection)sponsorSection.id='sponsors';$('.scroll-progress')?.remove();
const getDeep=path=>getByPath(state,path);
const setDeep=(path,value)=>setByPath(state,path,value);
const fieldMap={eventName:()=>$('.brand'),tagline:()=>$('.hero-copy p'),date:()=>qa('.meta .pill')[0],location:()=>qa('.meta .pill')[1],edition:()=>qa('.meta .pill')[2],sticker1:()=>qa('.sticker .editable-copy')[0],sticker2:()=>qa('.sticker .editable-copy')[1],sticker3:()=>qa('.sticker .editable-copy')[2],ribbon1:()=>qa('.ribbon-edit')[0],ribbon2:()=>qa('.ribbon-edit')[1],ribbon3:()=>qa('.ribbonconst {field,openGiftLightbox,renderTickets,renderHighlights,renderSchedule,renderCollections}=createCollections({
  qs:$,
  escapeHtml:esc,
  getState:()=>state,
  getMode:()=>mode
});enderCollections(){renderTickets();renderHighlights();renderSchedule()}
function applyField(path,value){
 if(path.includes('.')){
   setDeep(path,value);
   const parts=path.split('.'),collection=parts[0],index=Number(parts[1]),key=parts[2];
   if(collection==='highlights'&&key==='tone'){const card=$('[data-oe-item="highlights"][data-oe-index="'+index+'"]');if(card)card.style.setProperty('--tone',value||'#ffe45c');return}
   if(collection==='tickets'&&key==='image'){renderTickets();markEditable();return}
   const el=$('[data-oe-field="'+CSS.escape(path)+'"]');if(el)el.textContent=value??'';return
 }
 const el=fieldMap[path]?.();if(!el)return;
 if(path==='heroImage'){el.style.backgroundImage='linear-gradient(180deg,transparent,rgba(0,0,0,.26)),url("'+String(value).replace(/"/g,'%22')+'")';return}
 if(path==='ticketUrl'){const a=$('#tickets .ticket-actions a');if(a)a.href=value||'#';return}
 el.textContent=value??'';
 if(path.startsWith('ribbon')){const i=Number(path.replace('ribbon',''))-1;qa('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=value??'')}
}

const standalonePages=['booths','stage'];const homeModules=['tickets','highlights','passport','community','sponsors'];
let currentPage='home';
function moduleOn(key){return state.modules?.[key]!==false}
function renderQuickAccess(){
 const grid=$('.quick-grid');if(!grid)return;
 const defs=[
  ['tickets','01','票务与特典','查看票种 →','home'],
  ['highlights','02','特别企划','查看企划 →','home'],
  ['passport','03','活动护照','开始集章 →','home'],
  ['booths','04','摊位与地图','查找摊位 →','page'],
  ['stage','05','舞台日程','查看节目 →','page'],
  ['community','06','社群公告','查看社群 →','home'],
  ['sponsors','07','赞助支持','查看支持 →','home']
 ];
 grid.innerHTML=defs.filter(x=>moduleOn(x[0])).map(x=>'<a class="quick-card reveal in" href="#'+x[0]+'" data-target-mode="'+x[4]+'" data-page-link="'+x[0]+'"><span>'+x[1]+const {renderPassport,consumeStampParam}=createPassport({
  qs:$,
  qsa:qa,
  escapeHtml:esc,
  getState:()=>state
});
mp');history.replaceState(null,'',u.pathname+u.search+u.hash);
}
function applyModules(){
 $('.ribbon')?.classList.toggle('oe-page-hidden',!moduleOn('ribbon'));
 [...homeModules,...standalonePages].forEach(id=>$('#'+id)?.classList.toggle('oe-module-off',!moduleOn(id)));
 const navMap={tickets:'tickets',highlights:'highlights',booths:'booths',stage:'stage',community:'community'};
 Object.entries(navMap).forEach(([id,key])=>qa('.nav a[href="#'+id+'"],.mobile-dock a[href="#'+id+'"]').forEach(a=>a.hidden=!moduleOn(key)));
 renderQuickAccess();renderPassport();
}
function showPage(page,updateHash=true){
 if(page!=='home'&&!standalonePages.includes(page))page='home';
 if(page!=='home'&&!moduleOn(page))page='home';
 currentPage=page;

 const hero=$('.hero'),ribbon=$('.ribbon'),quick=$('.quick');
 [hero,quick].filter(Boolean).forEach(el=>el.classList.toggle('oe-page-hidden',page!=='home'));
 if(ribbon)ribbon.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn('ribbon'));

 homeModules.forEach(id=>{
   const el=$('#'+id);
   if(el)el.classList.toggle('oe-page-hidden',page!=='home'||!moduleOn(id));
 });
 standalonePages.forEach(id=>{
   const el=$('#'+id);
   if(el)el.classList.toggle('oe-page-hidden',page!==id||!moduleOn(id));
 });

 $('.footer')?.classList.toggle('oe-page-hidden',false);
 document.documentElement.scrollTop=0;document.body.scrollTop=0;
 if(updateHash){const hash=page==='home'?'#home':'#'+page;history.replaceState(null,'',location.pathname+location.search+hash)}
}
function scrollHomeSection(id){
 showPage('home',false);
 requestAnimationFrame(()=>$('#'+id)?.scrollIntoView({behavior:'smooth',block:'start'}));
}
function applyState(next){state={...state,...next};Object.keys(fieldMap).forEach(k=>applyField(k,state[k]));renderCollections();markEditable();applyModules();showPage(currentPage,false)}
function markEditable(){
 Object.entries(fieldMap).forEach(([path,get])=>{const el=get();if(!el)return;if(path==='heroImage'){el.dataset.oeImage=path;return}el.dataset.oeField=path;el.contentEditable=mode==='edit'?'true':'false';el.spellcheck=false});
 qa('[data-oe-field]').forEach(el=>el.contentEditable=mode==='edit'?'true':'false')
}
function setMode(next){mode=next;document.documentElement.classList.toggle('oe-preview',mode==='preview');qa('[data-oe-field]').forEach(el=>el.contentEditable=mode==='edit'?'true':'false')}
function initRuntime(){
 if(revealObs)revealObs.disconnect();if(stampObs)stampObs.disconnect();if(progressObs)progressObs.disconnect();
 revealObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.closest('.special')?.classList.add('seen');revealObs.unobserve(e.target)}}),{threshold:.12});qa('.reveal').forEach(x=>revealObs.observe(x));
 stampObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){$('.pass-stamp[data-stamp="'+e.target.dataset.hit+'"]')?.classList.add('hit');stampObs.unobserve(e.target)}}),{threshold:.65});qa('.zone[data-hit]').forEach(x=>stampObs.observe(x));
 const prog=qa('.scroll-progress a');progressObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)prog.forEach(a=>a.classList.toggle('active',a.dataset.sec===e.target.id))}),{threshold:.35});['top','tickets','highlights','passport','booths','stage'].map(id=>$('#'+id)).filter(Boolean).forEach(x=>progressObs.observe(x));
 qa('.pin').forEach(p=>p.addEventListener('click',()=>{const pop=$('#mapPop');if(pop)pop.innerHTML='<b>'+p.dataset.name+'</b><br><span>'+p.dataset.info+'</span>'}));
}
document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||mode!=='edit')return;send({type:'OE_FIELD_FOCUS',path:el.dataset.oeField});send({type:'OE_SELECT_FIELD',path:el.dataset.oeField})},true);
document.addEventListener('input',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||mode!=='edit')return;const path=el.dataset.oeField;setDeep(path,el.textContent);if(path.startsWith('ribbon')){const i=Number(path.replace('ribbon',''))-1;qa('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=el.textContent)}send({type:'OE_FIELD_CHANGE',path,value:el.textContent})});
document.addEventListener('click',e=>{if(e.target.closest?.('.brand')){e.preventDefault();showPage('home');return}
 const giftImage=e.target.closest?.('[data-ticket-image]');
 if(giftImage){const i=Number(giftImage.dataset.ticketImage);if(mode==='preview'){e.preventDefault();openGiftLightbox(state.tickets?.[i]?.image);return}else{e.preventDefault();send({type:'OE_SELECT_ITEM',collection:'tickets',index:i});return}}
 const item=e.target.closest?.('[data-oe-item]');if(item&&mode==='edit')send({type:'OE_SELECT_ITEM',collection:item.dataset.oeItem,index:Number(item.dataset.oeIndex)});
 const img=e.target.closest?.('[data-oe-image]');if(img&&mode==='edit'){e.preventDefault();send({type:'OE_SELECT_IMAGE',path:img.dataset.oeImage})}
 const a=e.target.closest?.('a[href^="#"]');if(a){
   const target=(a.dataset.pageLink||a.getAttribute('href').slice(1)||'home');
   if(target==='top')return;
   e.preventDefault();
   if(a.dataset.targetMode==='home'||homeModules.includes(target))scrollHomeSection(target);
   else if(standalonePages.includes(target))showPage(target);
   else showPage('home');
 }
});

function buildStandaloneHtml(){
 const clone=document.body.cloneNode(true);
 clone.querySelector('.loader')?.remove();clone.querySelector('#giftLightbox')?.remove();
 clone.querySelectorAll('[data-oe-field]').forEach(el=>{el.removeAttribute('data-oe-field');el.removeAttribute('contenteditable');el.removeAttribute('spellcheck')});
 clone.querySelectorAll('[data-oe-item]').forEach(el=>{el.removeAttribute('data-oe-item');el.removeAttribute('data-oe-index')});
 clone.querySelectorAll('[data-oe-image]').forEach(el=>el.removeAttribute('data-oe-image'));
 const stateJson=JSON.stringify(state).replace(/</g,'\\u003c');
 const runtime='(()=>{const $=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)],S='+stateJson+';const mods=S.modules||{};const standalone=["booths","stage"],homeMods=["tickets","highlights","passport","community","sponsors"];const on=k=>mods[k]!==false;function show(p){if(p!=="home"&&!standalone.includes(p))p="home";if(p!=="home"&&!on(p))p="home";[$(".hero"),$(".quick")].filter(Boolean).forEach(el=>el.classList.toggle("oe-page-hidden",p!=="home"));$(".ribbon")?.classList.toggle("oe-page-hidden",p!=="home"||!on("ribbon"));homeMods.forEach(id=>$("#"+id)?.classList.toggle("oe-page-hidden",p!=="home"||!on(id)));standalone.forEach(id=>$("#"+id)?.classList.toggle("oe-page-hidden",p!==id||!on(id)));history.replaceState(null,"",location.pathname+location.search+(p==="home"?"#home":"#"+p));scrollTo(0,0)}function key(){return"oe-passport:"+String(S.eventName||"event").toLowerCase().replace(/\\s+/g,"-")}function hits(){try{return JSON.parse(localStorage.getItem(key())||"[]")}catch{return[]}}function paint(){const h=new Set(hits());qa("[data-pass-code]").forEach(el=>el.classList.toggle("hit",h.has(String(el.dataset.passCode).toUpperCase())))}const u=new URL(location.href),code=u.searchParams.get("stamp");if(code&&(S.passport?.tasks||[]).some(t=>String(t.code).toUpperCase()===String(code).toUpperCase())){const h=new Set(hits());h.add(String(code).toUpperCase());localStorage.setItem(key(),JSON.stringify([...h]));u.searchParams.delete("stamp");history.replaceState(null,"",u.pathname+u.search+u.hash)}paint();document.addEventListener("click",e=>{const a=e.target.closest("a[href^=\"#\"]");if(!a)return;e.preventDefault();const t=a.dataset.pageLink||a.getAttribute("href").slice(1)||"home";if(homeMods.includes(t)){show("home");requestAnimationFrame(()=>$("#"+t)?.scrollIntoView({behavior:"smooth",block:"start"}))}else show(t)});$(".brand")?.addEventListener("click",e=>{e.preventDefault();show("home")});show((location.hash||"#home").slice(1),false)})();';
 const extra='.oe-page-hidden{display:none!important}.loader{display:none!important}.special:after{display:none!important}.kv:after{display:none!important}.ticket-top{display:grid;grid-template-columns:minmax(0,1fr) 104px;gap:14px;align-items:start}.ticket-gift-image{width:104px;height:104px;padding:0;border:2px solid var(--ink);border-radius:14px;background:#fff;overflow:hidden;cursor:zoom-in;box-shadow:4px 4px 0 var(--ink)}.ticket-gift-image img{width:100%;height:100%;object-fit:cover;display:block}';
 return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(state.eventName||'OnlyEvent')+'</title><style>'+previewStyle+extra+'</style></head><body>'+clone.innerHTML+'<script>'+runtime+'<\\/script></body></html>';
}
window.addEventListener('message',e=>{
 if(e.origin!==ORIGIN||e.source!==parent)return;const m=e.data||{};
 if(m.type==='OE_INIT_STATE'){currentPage=m.page||'home';applyState(m.state||{});setMode(m.mode||'edit');consumeStampParam();initRuntime();showPage(currentPage,false)}
 if(m.type==='OE_PATCH_FIELD'){applyField(m.path,m.value)}
 if(m.type==='OE_REPLACE_STATE'){state=m.state||{};applyState(state);initRuntime()}
 if(m.type==='OE_SET_MODE')setMode(m.mode)
 if(m.type==='OE_SHOW_PAGE')showPage(m.page||'home');if(m.type==='OE_EXPORT_HTML')send({type:'OE_EXPORT_HTML_RESULT',html:buildStandaloneHtml()})
});
send({type:'OE_READY'});