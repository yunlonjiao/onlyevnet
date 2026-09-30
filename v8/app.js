import {template01} from '/v8/templates/01-ip-only.js?v=8.1.0';
const $=s=>document.querySelector(s);
const canvas=$('#canvas'),inspector=$('#inspector'),saveState=$('#saveState'),toastEl=$('#toast');
const STORAGE='onlyevent-studio-v8:01:iframe',ORIGIN=location.origin;
let state=structuredClone(template01.defaults),preview=false,history=[],future=[],saveTimer=null,iframe=null,frameReady=false,focusCheckpointTaken=false;
try{const saved=localStorage.getItem(STORAGE);if(saved)state={...state,...JSON.parse(saved)}}catch{}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),1400)}
function save(){saveState.textContent='保存中…';clearTimeout(saveTimer);saveTimer=setTimeout(()=>{localStorage.setItem(STORAGE,JSON.stringify(state));saveState.textContent='已保存'},180)}
function checkpoint(){history.push(JSON.stringify(state));if(history.length>80)history.shift();future.length=0;syncHistory()}
function syncHistory(){$('#undoBtn').disabled=!history.length;$('#redoBtn').disabled=!future.length}
function setDeep(path,value){const a=path.split('.');let o=state;for(let i=0;i<a.length-1;i++)o=o[/^\d+$/.test(a[i])?Number(a[i]):a[i]];const k=a.at(-1);o[/^\d+$/.test(k)?Number(k):k]=value;save()}
function getDeep(path){return path.split('.').reduce((o,k)=>o?.[/^\d+$/.test(k)?Number(k):k],state)}
function send(message){if(frameReady&&iframe?.contentWindow)iframe.contentWindow.postMessage(message,ORIGIN)}
function mountFrame(){canvas.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/render.html?v=8.1.0" title="OnlyEvent live canvas"></iframe>';iframe=$('#liveFrame')}
window.addEventListener('message',e=>{
 if(e.origin!==ORIGIN||e.source!==iframe?.contentWindow)return;
 const m=e.data||{};
 if(m.type==='OE_READY'){frameReady=true;send({type:'OE_INIT_STATE',state,mode:preview?'preview':'edit'});return}
 if(m.type==='OE_SELECT_FIELD'){focusCheckpointTaken=false;openFieldInspector(m.path);return}
 if(m.type==='OE_FIELD_FOCUS'){if(!focusCheckpointTaken){checkpoint();focusCheckpointTaken=true}return}
 if(m.type==='OE_FIELD_CHANGE'){setDeep(m.path,m.value);const f=$('#fieldInput');if(f&&f.dataset.path===m.path)f.value=m.value;return}
 if(m.type==='OE_SELECT_IMAGE')openImageInspector(m.path);
});
function openFieldInspector(path){
 const value=getDeep(path);
 inspector.innerHTML='<h3>编辑内容</h3><label>内容<textarea id="fieldInput" data-path="'+esc(path)+'">'+esc(value)+'</textarea></label><p class="hint">实时更新真实页面，不刷新 iframe。</p>';
 const input=$('#fieldInput');let started=false;
 input.addEventListener('input',e=>{if(!started){checkpoint();started=true}setDeep(path,e.target.value);send({type:'OE_PATCH_FIELD',path,value:e.target.value})});
}
function openImageInspector(path){
 inspector.innerHTML='<h3>图片</h3><p>当前：'+esc(path)+'</p><div class="row"><button id="replaceImage" type="button">替换图片</button></div><p class="hint">替换图片不会重新加载页面。</p>';
 $('#replaceImage').onclick=()=>{$('#imageInput').dataset.path=path;$('#imageInput').click()};
}
$('#imageInput').addEventListener('change',e=>{
 const file=e.target.files?.[0],path=e.target.dataset.path;e.target.value='';if(!file||!path)return;
 checkpoint();const r=new FileReader();r.onload=()=>{setDeep(path,r.result);send({type:'OE_PATCH_FIELD',path,value:r.result});toast('图片已替换')};r.readAsDataURL(file);
});
$('#deviceBtn').onclick=()=>{canvas.classList.toggle('mobile');$('#deviceBtn').textContent=canvas.classList.contains('mobile')?'桌面':'手机'};
$('#previewBtn').onclick=()=>{preview=!preview;$('#previewBtn').textContent=preview?'继续编辑':'预览';send({type:'OE_SET_MODE',mode:preview?'preview':'edit'});inspector.style.visibility=preview?'hidden':'visible';toast(preview?'现在看到的是发布效果':'已返回编辑')};
$('.page-nav').addEventListener('click',e=>{const b=e.target.closest('[data-jump]');if(b)send({type:'OE_SCROLL_TO',id:b.dataset.jump})});
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(JSON.stringify(state));state=JSON.parse(history.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory()};
$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(JSON.stringify(state));state=JSON.parse(future.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory()};
$('#publishBtn').onclick=()=>toast('发布继续沿用同一 renderer；当前先验证实时编辑内核');
mountFrame();syncHistory();