import {template01} from '/v8/templates/01-ip-only.js?v=8.0.1';
import {previewStyle,previewBody} from '/v8/templates/01-ip-only-preview.js?v=8.0.1';

const $=s=>document.querySelector(s);
const canvas=$('#canvas'), inspector=$('#inspector'), saveState=$('#saveState'), toastEl=$('#toast');
const STORAGE='onlyevent-studio-v8:01:preview-clone';
let state=structuredClone(template01.defaults);
let preview=false, selected=null, history=[], future=[], saveTimer=null, surface=null, host=null, revealObs=null, stampObs=null, progressObs=null;
try{const saved=localStorage.getItem(STORAGE);if(saved)state={...state,...JSON.parse(saved)}}catch{}

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const q=s=>surface?.querySelector(s);
const qa=s=>surface?[...surface.querySelectorAll(s)]:[];
function toast(t){toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),1400)}
function checkpoint(){history.push(JSON.stringify(state));if(history.length>60)history.shift();future.length=0;syncHistory()}
function syncHistory(){$('#undoBtn').disabled=!history.length;$('#redoBtn').disabled=!future.length}
function scheduleSave(){saveState.textContent='保存中…';clearTimeout(saveTimer);saveTimer=setTimeout(()=>{localStorage.setItem(STORAGE,JSON.stringify(state));saveState.textContent='已保存'},220)}
function setDeep(path,value){const a=path.split('.');let o=state;for(let i=0;i<a.length-1;i++)o=o[/^\d+$/.test(a[i])?Number(a[i]):a[i]];const k=a.at(-1);o[/^\d+$/.test(k)?Number(k):k]=value;scheduleSave()}
function getDeep(path){return path.split('.').reduce((o,k)=>o?.[/^\d+$/.test(k)?Number(k):k],state)}

function mount(){
  if(revealObs)revealObs.disconnect(); if(stampObs)stampObs.disconnect(); if(progressObs)progressObs.disconnect();
  canvas.innerHTML='<div class="preview-host" id="previewHost"></div>';
  host=$('#previewHost');
  surface=host.attachShadow({mode:'open'});
  surface.innerHTML='<style>'+previewStyle+'\n:host{display:block;position:relative} .loader{display:none!important}</style>'+previewBody;
  applyStateAndEditMarkers();
  bindSurface();
  initPreviewRuntime();
  syncPreviewClass();
}
function applyStateAndEditMarkers(){
  const brand=q('.brand');
  if(brand){brand.textContent=state.eventName;brand.dataset.edit='eventName';brand.contentEditable='true'}
  const desc=q('.hero-copy p');
  if(desc){desc.textContent=state.tagline;desc.dataset.edit='tagline';desc.contentEditable='true'}
  const pills=qa('.meta .pill');
  if(pills[0]){pills[0].textContent=state.date;pills[0].dataset.edit='date';pills[0].contentEditable='true'}
  if(pills[1]){pills[1].textContent=state.location;pills[1].dataset.edit='location';pills[1].contentEditable='true'}
  const stickers=qa('.sticker .editable-copy');
  ['sticker1','sticker2','sticker3'].forEach((key,i)=>{if(stickers[i]){stickers[i].textContent=state[key];stickers[i].dataset.edit=key;stickers[i].contentEditable='true'}});
  const ribbon=qa('.ribbon-edit');
  ['ribbon1','ribbon2','ribbon3','ribbon4'].forEach((key,i)=>{if(ribbon[i]){ribbon[i].textContent=state[key];ribbon[i].dataset.edit=key;ribbon[i].contentEditable='true'}});
  qa('[data-ribbon-mirror]').forEach((el,i)=>{const key=['ribbon1','ribbon2','ribbon3','ribbon4'][Number(el.dataset.ribbonMirror)];if(key)el.textContent=state[key]});
  const kv=q('.kv');
  if(kv){kv.dataset.image='heroImage';kv.style.backgroundImage="linear-gradient(180deg,transparent,rgba(0,0,0,.26)),url('"+String(state.heroImage).replace(/'/g,"%27")+"')"}
}
function bindSurface(){
  surface.addEventListener('input',onInput);
  surface.addEventListener('click',onClick);
  surface.addEventListener('focusin',onFocus,true);
}
function onInput(e){
  const el=e.target.closest?.('[data-edit]'); if(!el||preview)return;
  if(!history.length||history.at(-1)!==JSON.stringify(state)) checkpoint();
  setDeep(el.dataset.edit,el.textContent);
  if(el.dataset.edit.startsWith('ribbon')){
    const n=Number(el.dataset.edit.replace('ribbon',''))-1;
    qa('[data-ribbon-mirror="'+n+'"]').forEach(x=>x.textContent=el.textContent);
  }
}
function onFocus(e){
  const el=e.target.closest?.('[data-edit]'); if(!el||preview)return;
  selected={kind:'field',path:el.dataset.edit}; openFieldInspector(el.dataset.edit);
}
function onClick(e){
  const anchor=e.target.closest?.('a[href^="#"]');
  if(anchor){const target=q(anchor.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'})}}
  if(preview)return;
  const img=e.target.closest?.('[data-image]');
  if(img){selected={kind:'image',path:img.dataset.image};openImageInspector(img.dataset.image);return}
}
function openFieldInspector(path){
  const value=getDeep(path);
  inspector.innerHTML='<h3>编辑内容</h3><label>内容<textarea id="fieldInput">'+esc(value)+'</textarea></label><p class="hint">也可以直接在画布里输入，不会刷新页面。</p>';
  $('#fieldInput').addEventListener('input',e=>{
    checkpoint(); setDeep(path,e.target.value);
    qa('[data-edit="'+CSS.escape(path)+'"]').forEach(x=>x.textContent=e.target.value);
    if(path.startsWith('ribbon')){const n=Number(path.replace('ribbon',''))-1;qa('[data-ribbon-mirror="'+n+'"]').forEach(x=>x.textContent=e.target.value)}
  });
}
function openImageInspector(path){
  inspector.innerHTML='<h3>图片</h3><p>当前：'+esc(path)+'</p><div class="row"><button id="replaceImage" type="button">替换图片</button></div><p class="hint">只替换当前图片，不改变模板布局。</p>';
  $('#replaceImage').onclick=()=>{$('#imageInput').dataset.path=path;$('#imageInput').click()}
}
function syncPreviewClass(){
  canvas.classList.toggle('preview',preview);
  qa('[data-edit]').forEach(el=>el.contentEditable=preview?'false':'true');
  qa('.editable-copy,.ribbon-edit').forEach(el=>{if(!el.dataset.edit)el.contentEditable='false'});
  inspector.style.visibility=preview?'hidden':'visible';
}
function initPreviewRuntime(){
  const reveal=qa('.reveal');
  revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');e.target.closest('.special')?.classList.add('seen');revealObs.unobserve(e.target)}
  }),{threshold:.12});
  reveal.forEach(x=>revealObs.observe(x));

  stampObs=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){const hit=e.target.dataset.hit;const stamp=q('.pass-stamp[data-stamp="'+hit+'"]');if(stamp)stamp.classList.add('hit');stampObs.unobserve(e.target)}
  }),{threshold:.65});
  qa('.zone[data-hit]').forEach(x=>stampObs.observe(x));

  const secs=['top','tickets','highlights','passport','booths','stage'].map(id=>q('#'+id)).filter(Boolean);
  const prog=qa('.scroll-progress a');
  progressObs=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting)prog.forEach(a=>a.classList.toggle('active',a.dataset.sec===e.target.id))
  }),{threshold:.35});
  secs.forEach(s=>progressObs.observe(s));

  qa('.pin').forEach(p=>p.onclick=()=>{
    const pop=q('#mapPop'); if(pop)pop.innerHTML='<b>'+esc(p.dataset.name)+'</b><br><span>'+esc(p.dataset.info)+'</span>';
  });
}
$('#imageInput').addEventListener('change',e=>{
  const file=e.target.files?.[0], path=e.target.dataset.path; e.target.value=''; if(!file||!path)return;
  checkpoint(); const r=new FileReader();
  r.onload=()=>{setDeep(path,r.result);const el=q('[data-image="'+CSS.escape(path)+'"]');if(el)el.style.backgroundImage='linear-gradient(180deg,transparent,rgba(0,0,0,.26)),url("'+r.result+'")';toast('图片已替换')};
  r.readAsDataURL(file)
});
$('#deviceBtn').onclick=()=>{canvas.classList.toggle('mobile');$('#deviceBtn').textContent=canvas.classList.contains('mobile')?'桌面':'手机'}
$('#previewBtn').onclick=()=>{preview=!preview;$('#previewBtn').textContent=preview?'继续编辑':'预览';syncPreviewClass();toast(preview?'现在看到的是发布效果':'已返回编辑')}
$('.page-nav').addEventListener('click',e=>{const b=e.target.closest('[data-jump]');if(!b)return;q('#'+b.dataset.jump)?.scrollIntoView({behavior:'smooth',block:'start'})})
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(JSON.stringify(state));state=JSON.parse(history.pop());mount();scheduleSave();syncHistory()}
$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(JSON.stringify(state));state=JSON.parse(future.pop());mount();scheduleSave();syncHistory()}
$('#publishBtn').onclick=()=>{toast('发布功能保留；先完成模板复刻核对')}
mount();syncHistory();
