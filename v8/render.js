import {previewStyle,previewBody} from '/v8/templates/01-ip-only-preview.js?v=8.3.0';
const ORIGIN=location.origin;let state={},mode='edit',revealObs=null,stampObs=null,progressObs=null;
window.__oeRenderLoadId=(window.__oeRenderLoadId||0)+1;
document.head.insertAdjacentHTML('beforeend','<style>'+previewStyle+'\n.loader{display:none!important}\n[data-oe-field]{cursor:text}[data-oe-field]:hover{outline:2px solid #7b61ff77;outline-offset:2px}[data-oe-field]:focus{outline:2px solid #7b61ff;background:#fff7b3}.oe-preview [data-oe-field],.oe-preview [data-oe-item]{outline:none!important;cursor:inherit}[data-oe-item]{cursor:pointer;transition:outline-color .15s}[data-oe-item]:hover{outline:2px solid #7b61ff55;outline-offset:4px}.ticket-top{display:grid;grid-template-columns:minmax(0,1fr) 104px;gap:14px;align-items:start}.ticket-copy h3{margin-bottom:6px}.ticket-gift-image{width:104px;height:104px;padding:0;border:2px solid var(--ink);border-radius:14px;background:#fff;overflow:hidden;cursor:zoom-in;box-shadow:4px 4px 0 var(--ink)}.ticket-gift-image img{width:100%;height:100%;object-fit:cover;display:block}.gift-lightbox{border:0;padding:0;background:transparent;max-width:min(92vw,1100px);max-height:92vh}.gift-lightbox::backdrop{background:rgba(12,12,16,.82);backdrop-filter:blur(6px)}.gift-lightbox img{display:block;max-width:92vw;max-height:88vh;object-fit:contain;border-radius:14px}.gift-lightbox button{position:fixed;right:22px;top:18px;width:40px;height:40px;border:0;border-radius:50%;background:#fff;color:#111;font-size:22px;cursor:pointer}.special{isolation:isolate}.special:after{z-index:0;pointer-events:none}.special>*{position:relative;z-index:2}@media(max-width:560px){.ticket-top{grid-template-columns:1fr 88px}.ticket-gift-image{width:88px;height:88px}}</style>');
document.body.innerHTML=previewBody;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],send=m=>parent.postMessage(m,ORIGIN);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function getDeep(path){return path.split('.').reduce((o,k)=>o?.[/^\d+$/.test(k)?Number(k):k],state)}
function setDeep(path,value){const a=path.split('.');let o=state;for(let i=0;i<a.length-1;i++)o=o[/^\d+$/.test(a[i])?Number(a[i]):a[i]];o[/^\d+$/.test(a.at(-1))?Number(a.at(-1)):a.at(-1)]=value}
const fieldMap={eventName:()=>$('.brand'),tagline:()=>$('.hero-copy p'),date:()=>$$('.meta .pill')[0],location:()=>$$('.meta .pill')[1],sticker1:()=>$$('.sticker .editable-copy')[0],sticker2:()=>$$('.sticker .editable-copy')[1],sticker3:()=>$$('.sticker .editable-copy')[2],ribbon1:()=>$$('.ribbon-edit')[0],ribbon2:()=>$$('.ribbon-edit')[1],ribbon3:()=>$$('.ribbon-edit')[2],ribbon4:()=>$$('.ribbon-edit')[3],heroImage:()=>$('.kv')};

function field(path,value,tag='span',cls=''){return '<'+tag+(cls?' class="'+cls+'"':'')+' data-oe-field="'+path+'" contenteditable="'+(mode==='edit')+'" spellcheck="false">'+esc(value)+'</'+tag+'>'}
function ensureLightbox(){
 let dlg=$('#giftLightbox');if(dlg)return dlg;
 dlg=document.createElement('dialog');dlg.id='giftLightbox';dlg.className='gift-lightbox';dlg.innerHTML='<button type="button" aria-label="关闭">×</button><img alt="赠品图片">';
 document.body.appendChild(dlg);dlg.querySelector('button').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});return dlg;
}
function openGiftLightbox(src){if(!src)return;const dlg=ensureLightbox();dlg.querySelector('img').src=src;dlg.showModal()}
function cleanupTicketShell(){$('#tickets .section-no')?.remove();$('#tickets .ticket-actions')?.remove()}
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
 if(path.startsWith('ribbon')){const i=Number(path.replace('ribbon',''))-1;$$('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=value??'')}
}
function applyState(next){state={...state,...next};Object.keys(fieldMap).forEach(k=>applyField(k,state[k]));renderCollections();markEditable()}
function markEditable(){
 Object.entries(fieldMap).forEach(([path,get])=>{const el=get();if(!el)return;if(path==='heroImage'){el.dataset.oeImage=path;return}el.dataset.oeField=path;el.contentEditable=mode==='edit'?'true':'false';el.spellcheck=false});
 $$('[data-oe-field]').forEach(el=>el.contentEditable=mode==='edit'?'true':'false')
}
function setMode(next){mode=next;document.documentElement.classList.toggle('oe-preview',mode==='preview');$$('[data-oe-field]').forEach(el=>el.contentEditable=mode==='edit'?'true':'false')}
function initRuntime(){
 if(revealObs)revealObs.disconnect();if(stampObs)stampObs.disconnect();if(progressObs)progressObs.disconnect();
 revealObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.closest('.special')?.classList.add('seen');revealObs.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(x=>revealObs.observe(x));
 stampObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){$('.pass-stamp[data-stamp="'+e.target.dataset.hit+'"]')?.classList.add('hit');stampObs.unobserve(e.target)}}),{threshold:.65});$$('.zone[data-hit]').forEach(x=>stampObs.observe(x));
 const prog=$$('.scroll-progress a');progressObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)prog.forEach(a=>a.classList.toggle('active',a.dataset.sec===e.target.id))}),{threshold:.35});['top','tickets','highlights','passport','booths','stage'].map(id=>$('#'+id)).filter(Boolean).forEach(x=>progressObs.observe(x));
 $$('.pin').forEach(p=>p.addEventListener('click',()=>{const pop=$('#mapPop');if(pop)pop.innerHTML='<b>'+p.dataset.name+'</b><br><span>'+p.dataset.info+'</span>'}));
}
document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||mode!=='edit')return;send({type:'OE_FIELD_FOCUS',path:el.dataset.oeField});send({type:'OE_SELECT_FIELD',path:el.dataset.oeField})},true);
document.addEventListener('input',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||mode!=='edit')return;const path=el.dataset.oeField;setDeep(path,el.textContent);if(path.startsWith('ribbon')){const i=Number(path.replace('ribbon',''))-1;$$('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=el.textContent)}send({type:'OE_FIELD_CHANGE',path,value:el.textContent})});
document.addEventListener('click',e=>{
 const giftImage=e.target.closest?.('[data-ticket-image]');
 if(giftImage){const i=Number(giftImage.dataset.ticketImage);if(mode==='preview'){e.preventDefault();openGiftLightbox(state.tickets?.[i]?.image);return}else{e.preventDefault();send({type:'OE_SELECT_ITEM',collection:'tickets',index:i});return}}
 const item=e.target.closest?.('[data-oe-item]');if(item&&mode==='edit')send({type:'OE_SELECT_ITEM',collection:item.dataset.oeItem,index:Number(item.dataset.oeIndex)});
 const img=e.target.closest?.('[data-oe-image]');if(img&&mode==='edit'){e.preventDefault();send({type:'OE_SELECT_IMAGE',path:img.dataset.oeImage})}
 const a=e.target.closest?.('a[href^="#"]');if(a){const t=$(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}}
});
window.addEventListener('message',e=>{
 if(e.origin!==ORIGIN||e.source!==parent)return;const m=e.data||{};
 if(m.type==='OE_INIT_STATE'){applyState(m.state||{});setMode(m.mode||'edit');initRuntime()}
 if(m.type==='OE_PATCH_FIELD'){applyField(m.path,m.value)}
 if(m.type==='OE_REPLACE_STATE'){state=m.state||{};applyState(state);initRuntime()}
 if(m.type==='OE_SET_MODE')setMode(m.mode)
 if(m.type==='OE_SCROLL_TO')$('#'+m.id)?.scrollIntoView({behavior:'smooth',block:'start'})
});
send({type:'OE_READY'});