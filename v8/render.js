import {previewStyle,previewBody} from '/v8/templates/01-ip-only-preview.js?v=8.3.0';
const ORIGIN=location.origin;let state={},mode='edit',revealObs=null,stampObs=null,progressObs=null;
window.__oeRenderLoadId=(window.__oeRenderLoadId||0)+1;
document.head.insertAdjacentHTML('beforeend','<style>'+previewStyle+'\n.loader{display:none!important}\n[data-oe-field]{cursor:text}[data-oe-field]:hover{outline:2px solid #7b61ff77;outline-offset:2px}[data-oe-field]:focus{outline:2px solid #7b61ff;background:#fff7b3}.oe-preview [data-oe-field],.oe-preview [data-oe-item]{outline:none!important;cursor:inherit}[data-oe-item]{cursor:pointer;transition:outline-color .15s}[data-oe-item]:hover{outline:2px solid #7b61ff55;outline-offset:4px}.ticket-top{display:grid;grid-template-columns:minmax(0,1fr) 104px;gap:14px;align-items:start}.ticket-copy h3{margin-bottom:6px}.ticket-gift-image{width:104px;height:104px;padding:0;border:2px solid var(--ink);border-radius:14px;background:#fff;overflow:hidden;cursor:zoom-in;box-shadow:4px 4px 0 var(--ink)}.ticket-gift-image img{width:100%;height:100%;object-fit:cover;display:block}.gift-lightbox{border:0;padding:0;background:transparent;max-width:min(92vw,1100px);max-height:92vh}.gift-lightbox::backdrop{background:rgba(12,12,16,.82);backdrop-filter:blur(6px)}.gift-lightbox img{display:block;max-width:92vw;max-height:88vh;object-fit:contain;border-radius:14px}.gift-lightbox button{position:fixed;right:22px;top:18px;width:40px;height:40px;border:0;border-radius:50%;background:#fff;color:#111;font-size:22px;cursor:pointer}.special{isolation:isolate}.special:after{display:none!important}.special>*{position:relative;z-index:2}.kv:after{display:none!important}@media(max-width:560px){.ticket-top{grid-template-columns:1fr 88px}.ticket-gift-image{width:88px;height:88px}}.oe-page-hidden{display:none!important}.oe-page-view{min-height:calc(100vh - 72px)}.nav .links a[hidden],.mobile-dock a[hidden]{display:none!important}
.quick-hub{display:grid!important;grid-template-columns:minmax(0,1.15fr) minmax(360px,.85fr)!important;gap:18px!important;align-items:stretch}
.quick-feature{min-height:224px;border:2px solid var(--ink);border-radius:22px;background:var(--primary);color:#fff;padding:22px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:8px 8px 0 var(--ink);transition:.2s}
.quick-feature:hover{transform:translate(-3px,-4px) rotate(-.25deg)}
.quick-feature .quick-kicker{font-size:10px;font-weight:950;letter-spacing:.14em;opacity:.8}
.quick-feature b{display:block;font-size:clamp(34px,4vw,58px);line-height:.9;letter-spacing:-.05em}
.quick-feature p{display:flex;flex-wrap:wrap;gap:7px;margin:16px 0 0}
.quick-feature p span{display:inline-flex;padding:6px 9px;border:2px solid var(--ink);border-radius:999px;background:#fff;color:var(--ink);font-size:10px;font-weight:900}
.quick-feature small{font-size:11px;font-weight:950}
.quick-index{display:grid;grid-template-columns:1fr;align-content:start;border-top:2px solid var(--ink)}
.quick-row{display:grid;grid-template-columns:44px 1fr auto;gap:12px;align-items:center;min-height:48px;padding:9px 2px;border-bottom:2px solid var(--ink);transition:.18s}
.quick-row:hover{padding-left:8px;background:color-mix(in srgb,var(--accent) 28%,transparent)}
.quick-row .quick-no{font-size:10px;font-weight:950;color:#8a8188}
.quick-row b{font-size:14px}
.quick-row small{font-size:10px;color:#6f676e;white-space:nowrap}
.quick-hub.no-feature{grid-template-columns:1fr!important}.quick-hub.no-feature .quick-index{display:grid;grid-template-columns:1fr 1fr;gap:0 18px}
@media(max-width:900px){.quick-hub{grid-template-columns:1fr!important}.quick-feature{min-height:190px}.quick-hub.no-feature .quick-index{grid-template-columns:1fr}}
@media(max-width:560px){.quick{padding:28px 0}.quick-feature{min-height:168px;padding:18px}.quick-feature b{font-size:38px}.quick-row{grid-template-columns:34px 1fr auto;min-height:44px}.quick-row small{font-size:9px}}
</style>');
document.body.innerHTML=previewBody.replace('这不是后台功能，而是一种前台视觉表达。主办方只需要配置哪些企划需要展示，网站负责把它做得像活动场刊。','');
const $=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)],send=m=>parent.postMessage(m,ORIGIN);
const sponsorSection=$('.sponsors')?.closest('section');if(sponsorSection)sponsorSection.id='sponsors';$('.scroll-progress')?.remove();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function getDeep(path){return path.split('.').reduce((o,k)=>o?.[/^\d+$/.test(k)?Number(k):k],state)}
function setDeep(path,value){const a=path.split('.');let o=state;for(let i=0;i<a.length-1;i++)o=o[/^\d+$/.test(a[i])?Number(a[i]):a[i]];o[/^\d+$/.test(a.at(-1))?Number(a.at(-1)):a.at(-1)]=value}
const fieldMap={eventName:()=>$('.brand'),tagline:()=>$('.hero-copy p'),date:()=>qa('.meta .pill')[0],location:()=>qa('.meta .pill')[1],edition:()=>qa('.meta .pill')[2],sticker1:()=>qa('.sticker .editable-copy')[0],sticker2:()=>qa('.sticker .editable-copy')[1],sticker3:()=>qa('.sticker .editable-copy')[2],ribbon1:()=>qa('.ribbon-edit')[0],ribbon2:()=>qa('.ribbon-edit')[1],ribbon3:()=>qa('.ribbon-edit')[2],ribbon4:()=>qa('.ribbon-edit')[3],heroImage:()=>$('.kv')};

function field(path,value,tag='span',cls=''){return '<'+tag+(cls?' class="'+cls+'"':'')+' data-oe-field="'+path+'" contenteditable="'+(mode==='edit')+'" spellcheck="false">'+esc(value)+'</'+tag+'>'}
function ensureLightbox(){
 let dlg=$('#giftLightbox');if(dlg)return dlg;
 dlg=document.createElement('dialog');dlg.id='giftLightbox';dlg.className='gift-lightbox';dlg.innerHTML='<button type="button" aria-label="关闭">×</button><img alt="赠品图片">';
 document.body.appendChild(dlg);dlg.querySelector('button').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});return dlg;
}
function openGiftLightbox(src){if(!src)return;const dlg=ensureLightbox();dlg.querySelector('img').src=src;dlg.showModal()}
function cleanupTicketShell(){$('#tickets .section-no')?.remove();$('#tickets .ticket-actions')?.remove();$('.nav .btn')?.remove()}
function renderTickets(){
 cleanupTicketShell();
 const box=$('#tickets .ticket-grid');if(!box)return;
 box.innerHTML=(state.tickets||[]).map((x,i)=>{
   const image=x.image?'<button class="ticket-gift-image" type="button" data-ticket-image="'+i+'" aria-label="查看赠品图片"><img src="'+esc(x.image)+'" alt="'+esc(x.name||'')+' 赠品"></button>':'';
   return '<article class="ticket cut-ticket reveal in" data-oe-item="tickets" data-oe-index="'+i+'"><div class="ticket-top"><div class="ticket-copy">'+field('tickets.'+i+'.name',x.name,'h3')+'<div class="price" data-oe-field="tickets.'+i+'.price" contenteditable="'+(mode==='edit')+'" spellcheck="false">'+esc(x.price)+'</div></div>'+image+'</div><div class="gift"><b>包含 / 特典</b>\n'+field('tickets.'+i+'.gift',x.gift,'span')+'</div>'+field('tickets.'+i+'.note',x.note||'','small')+'</article>';
 }).join('');
}
function renderHighlights(){
 const box=$('#highlights .specials');if(!box)return;
 box.innerHTML=(state.highlights||[]).map((x,i)=>'<article class="special reveal in" data-oe-item="highlights" data-oe-index="'+i+'" style="--tone:'+esc(x.tone||'#ffe45c')+'">'+field('highlights.'+i+'.stamp',x.stamp||('STAMP '+String(i+1).padStart(2,'0')),'span','stamp')+field('highlights.'+i+'.title',x.title,'h3')+field('highlights.'+i+'.text',x.text,'p')+'</article>').join('');
}
function renderSchedule(){
 const box=$('#stage .timeline');if(!box)return;
 box.innerHTML=(state.schedule||[]).map((x,i)=>'<div class="event reveal in" data-oe-item="schedule" data-oe-index="'+i+'">'+field('schedule.'+i+'.time',x.time,'span')+field('schedule.'+i+'.title',x.title,'b')+field('schedule.'+i+'.stage',x.stage,'span')+'<span>→</span></div>').join('');
}
function renderCollections(){renderTickets();renderHighlights();renderSchedule()}
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
 const links=[
  ['tickets','票务与特典','查看票种','home'],
  ['passport','活动护照','开始集章','home'],
  ['booths','摊位与地图','查找摊位','page'],
  ['stage','舞台日程','查看节目','page'],
  ['community','社群公告','查看社群','home'],
  ['sponsors','赞助支持','查看支持','home']
 ].filter(x=>moduleOn(x[0]));
 const highlightTitles=(state.highlights||[]).slice(0,3).map(x=>'<span>'+esc(x.title||'')+'</span>').join('');
 const feature=moduleOn('highlights')?'<a class="quick-feature reveal in" href="#highlights" data-target-mode="home" data-page-link="highlights"><span class="quick-kicker">FEATURED / THIS EVENT</span><div><b>本届亮点</b><p>'+highlightTitles+'</p></div><small>查看特别企划 →</small></a>':'';
 const index=links.length?'<div class="quick-index">'+links.map((x,i)=>'<a class="quick-row reveal in" href="#'+x[0]+'" data-target-mode="'+x[3]+'" data-page-link="'+x[0]+'"><span class="quick-no">'+String(i+1).padStart(2,'0')+'</span><b>'+x[1]+'</b><small>'+x[2]+' →</small></a>').join('')+'</div>':'';
 grid.className='quick-grid quick-hub'+(!feature?' no-feature':'');
 grid.innerHTML=feature+index;
}
function renderPassport(){
 const section=$('#passport');if(!section)return;
 const tasks=state.passport?.tasks||[],required=Math.min(Number(state.passport?.required||tasks.length),tasks.length);
 const passStamps=section.querySelector('.pass-stamps'),zones=section.querySelector('.zone-list');
 if(passStamps)passStamps.innerHTML=tasks.map(t=>'<div class="pass-stamp" data-pass-code="'+esc(t.code)+'">'+esc(t.name)+'</div>').join('');
 if(zones)zones.innerHTML=tasks.map((t,i)=>'<article class="zone"><span class="zone-no">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(t.name)+'</b><small>'+esc(t.location||'')+'</small></div><span>QR</span></article>').join('');
 const p=section.querySelector('.passbook p');if(p)p.textContent=(state.passport?.reward||'')+' · '+required+' / '+tasks.length;
 updatePassportStamps();
}
function passportStorageKey(){return 'oe-passport:'+String(state.eventName||'event').toLowerCase().replace(/\s+/g,'-')}
function getPassportHits(){try{return JSON.parse(localStorage.getItem(passportStorageKey())||'[]')}catch{return []}}
function addPassportHit(code){const hits=new Set(getPassportHits());hits.add(String(code).toUpperCase());localStorage.setItem(passportStorageKey(),JSON.stringify([...hits]));updatePassportStamps()}
function updatePassportStamps(){const hits=new Set(getPassportHits());qa('[data-pass-code]').forEach(el=>el.classList.toggle('hit',hits.has(String(el.dataset.passCode).toUpperCase())))}
function consumeStampParam(){
 const u=new URL(location.href),code=u.searchParams.get('stamp');if(!code)return;
 const valid=(state.passport?.tasks||[]).some(t=>String(t.code).toUpperCase()===String(code).toUpperCase());
 if(valid)addPassportHit(code);
 u.searchParams.delete('stamp');history.replaceState(null,'',u.pathname+u.search+u.hash);
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