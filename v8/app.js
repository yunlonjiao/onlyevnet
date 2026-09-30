import {template01} from '/v8/templates/01-ip-only.js?v=8.1.0';
const $=s=>document.querySelector(s);
const canvas=$('#canvas'),inspector=$('#inspector'),saveState=$('#saveState'),toastEl=$('#toast');
const STORAGE='onlyevent-studio-v8:01:iframe',ORIGIN=location.origin;
let state=structuredClone(template01.defaults),preview=false,history=[],future=[],saveTimer=null,iframe=null,frameReady=false,focusCheckpointTaken=false,currentPage='home';
try{const saved=localStorage.getItem(STORAGE);if(saved)state={...state,...JSON.parse(saved)}}catch{}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),1400)}
function save(){saveState.textContent='保存中…';clearTimeout(saveTimer);saveTimer=setTimeout(()=>{localStorage.setItem(STORAGE,JSON.stringify(state));saveState.textContent='已保存'},180)}
function checkpoint(){history.push(JSON.stringify(state));if(history.length>80)history.shift();future.length=0;syncHistory()}
function syncHistory(){$('#undoBtn').disabled=!history.length;$('#redoBtn').disabled=!future.length}
function setDeep(path,value){const a=path.split('.');let o=state;for(let i=0;i<a.length-1;i++)o=o[/^\d+$/.test(a[i])?Number(a[i]):a[i]];const k=a.at(-1);o[/^\d+$/.test(k)?Number(k):k]=value;save()}
function getDeep(path){return path.split('.').reduce((o,k)=>o?.[/^\d+$/.test(k)?Number(k):k],state)}
function send(message){if(frameReady&&iframe?.contentWindow)iframe.contentWindow.postMessage(message,ORIGIN)}

const moduleLabels={booths:'摊位 / 地图',stage:'舞台日程'};
function syncModuleControls(){
 document.querySelectorAll('[data-module]').forEach(input=>{input.checked=state.modules?.[input.dataset.module]!==false});
 document.querySelectorAll('[data-module-page]').forEach(btn=>{btn.hidden=state.modules?.[btn.dataset.modulePage]===false});
}
function setStudioPage(page){
 currentPage=page||'home';
 document.querySelectorAll('.page-nav [data-page]').forEach(btn=>btn.classList.toggle('active',btn.dataset.page===currentPage));
 const title=document.querySelector('.canvas-title b');if(title)title.textContent=currentPage==='home'?'首页':(moduleLabels[currentPage]||'页面');
 send({type:'OE_SHOW_PAGE',page:currentPage});
}
function bindModuleControls(){
 document.querySelectorAll('[data-module]').forEach(input=>input.addEventListener('change',()=>{
   checkpoint();state.modules??={};state.modules[input.dataset.module]=input.checked;save();
   if(!input.checked&&currentPage===input.dataset.module)setStudioPage('home');
   syncModuleControls();send({type:'OE_REPLACE_STATE',state});
 }));
}

function mountFrame(){canvas.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/render.html?v=8.1.0" title="OnlyEvent live canvas"></iframe>';iframe=$('#liveFrame')}
window.addEventListener('message',e=>{
 if(e.origin!==ORIGIN||e.source!==iframe?.contentWindow)return;
 const m=e.data||{};
 if(m.type==='OE_READY'){frameReady=true;send({type:'OE_INIT_STATE',state,mode:preview?'preview':'edit',page:currentPage});return}
 if(m.type==='OE_SELECT_FIELD'){focusCheckpointTaken=false;openFieldInspector(m.path);return}
 if(m.type==='OE_FIELD_FOCUS'){if(!focusCheckpointTaken){checkpoint();focusCheckpointTaken=true}return}
 if(m.type==='OE_FIELD_CHANGE'){setDeep(m.path,m.value);const f=$('#fieldInput');if(f&&f.dataset.path===m.path)f.value=m.value;return}
 if(m.type==='OE_SELECT_IMAGE'){openImageInspector(m.path);return}
 if(m.type==='OE_SELECT_ITEM'){openItemInspector(m.collection,m.index);return}
 if(m.type==='OE_EXPORT_HTML_RESULT'){downloadPublishedHtml(m.html);return}
});
function downloadPublishedHtml(html){
 const blob=new Blob([html],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 const name=(state.eventName||'onlyevent').replace(/[\\/:*?"<>|]+/g,'-').trim()||'onlyevent';
 a.href=url;a.download=name+'.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已生成游客站');
}

function openFieldInspector(path){
 const value=getDeep(path);
 inspector.innerHTML='<h3>编辑内容</h3><label>内容<textarea id="fieldInput" data-path="'+esc(path)+'">'+esc(value)+'</textarea></label>';
 const input=$('#fieldInput');let started=false;fitTextarea(input);
 input.addEventListener('input',e=>{if(!started){checkpoint();started=true}setDeep(path,e.target.value);send({type:'OE_PATCH_FIELD',path,value:e.target.value});fitTextarea(e.target)});input.addEventListener('blur',e=>{const cleaned=cleanValue(e.target.value);if(cleaned!==e.target.value){e.target.value=cleaned;setDeep(path,cleaned);send({type:'OE_PATCH_FIELD',path,value:cleaned});fitTextarea(e.target)}});
}
const collectionMeta={
 tickets:{title:'票务',fields:[['name','票名'],['price','价格'],['gift','特典'],['note','备注']]},
 highlights:{title:'特别企划',fields:[['stamp','印章文字'],['title','标题'],['text','说明'],['tone','强调色']]},
 schedule:{title:'舞台日程',fields:[['time','时间'],['title','标题'],['stage','区域']]}
};
function uid(prefix){return prefix+Math.random().toString(36).slice(2,8)}
function fitTextarea(el){if(!el)return;el.style.height='auto';el.style.height=Math.max(36,el.scrollHeight)+'px'}
function cleanValue(v){return String(v??'').split('\n').map(x=>x.trimEnd()).join('\n').replace(/^\s*\n+/,'').replace(/\n+\s*$/,'').trim()}
function openItemInspector(collection,index){
 const meta=collectionMeta[collection],item=state[collection]?.[index];if(!meta||!item)return;
 const count=state[collection].length;
 const media=collection==='tickets'?'<div class="item-media"><span>赠品图片</span><div class="item-media-row">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media="replace">选择图片</button>'+(item.image?'<button data-media="remove" class="ghost">移除</button>':'')+'</div></div></div>':'';
 inspector.innerHTML='<div class="item-inspector-head"><div><span>'+esc(meta.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0')+'</b></div><div class="item-tools"><button data-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-op="down" '+(index===count-1?'disabled':'')+'>↓</button></div></div><div class="item-fields">'+meta.fields.map(([key,label])=>'<label><span>'+label+'</span>'+(key==='text'||key==='gift'||key==='note'?'<textarea data-key="'+key+'" rows="1">'+esc(item[key]||'')+'</textarea>':'<input data-key="'+key+'" value="'+esc(item[key]||'')+'" '+(key==='tone'?'type="color"':'')+'>')+'</label>').join('')+'</div>'+media+'<div class="item-actions"><button data-op="add">＋ 添加</button><button data-op="delete" class="danger">删除</button></div>';
 inspector.querySelectorAll('textarea').forEach(fitTextarea);
 inspector.querySelectorAll('[data-key]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{
     if(!started){checkpoint();started=true}
     const key=e.target.dataset.key;state[collection][index][key]=e.target.value;save();send({type:'OE_PATCH_FIELD',path:collection+'.'+index+'.'+key,value:e.target.value});
     if(e.target.tagName==='TEXTAREA')fitTextarea(e.target);
   });
   input.addEventListener('blur',e=>{
     if(e.target.type==='color')return;
     const key=e.target.dataset.key,cleaned=cleanValue(e.target.value);
     if(cleaned!==e.target.value){e.target.value=cleaned;state[collection][index][key]=cleaned;save();send({type:'OE_PATCH_FIELD',path:collection+'.'+index+'.'+key,value:cleaned});if(e.target.tagName==='TEXTAREA')fitTextarea(e.target)}
   });
 });
 inspector.querySelectorAll('[data-op]').forEach(btn=>btn.addEventListener('click',()=>mutateItem(collection,index,btn.dataset.op)));
 inspector.querySelectorAll('[data-media]').forEach(btn=>btn.addEventListener('click',()=>{
   const path='tickets.'+index+'.image';
   if(btn.dataset.media==='replace'){$('#imageInput').dataset.path=path;$('#imageInput').dataset.returnCollection='tickets';$('#imageInput').dataset.returnIndex=String(index);$('#imageInput').click()}
   if(btn.dataset.media==='remove'){checkpoint();state.tickets[index].image='';save();send({type:'OE_PATCH_FIELD',path,value:''});openItemInspector('tickets',index)}
 }));
}
function mutateItem(collection,index,op){
 const arr=state[collection];if(!Array.isArray(arr))return;checkpoint();
 if(op==='up'&&index>0){[arr[index-1],arr[index]]=[arr[index],arr[index-1]];index--}
 if(op==='down'&&index<arr.length-1){[arr[index+1],arr[index]]=[arr[index],arr[index+1]];index++}
 if(op==='delete'&&arr.length>1){arr.splice(index,1);index=Math.max(0,index-1)}
 if(op==='add'){
   const fresh=collection==='tickets'?{id:uid('t'),name:'新票种',price:'¥0',gift:'',note:'',image:''}:collection==='highlights'?{id:uid('h'),stamp:'STAMP '+String(arr.length+1).padStart(2,'0'),title:'新企划',text:'',tone:'#ffe45c'}:{id:uid('s'),time:'12:00',title:'新日程',stage:'MAIN STAGE'};
   arr.splice(index+1,0,fresh);index++;
 }
 save();send({type:'OE_REPLACE_STATE',state});openItemInspector(collection,index);
}
function openImageInspector(path){
 inspector.innerHTML='<h3>图片</h3><p>当前：'+esc(path)+'</p><div class="row"><button id="replaceImage" type="button">替换图片</button></div>';
 $('#replaceImage').onclick=()=>{$('#imageInput').dataset.path=path;$('#imageInput').click()};
}
$('#imageInput').addEventListener('change',e=>{
 const file=e.target.files?.[0],path=e.target.dataset.path;e.target.value='';if(!file||!path)return;
 checkpoint();const r=new FileReader();r.onload=()=>{setDeep(path,r.result);send({type:'OE_PATCH_FIELD',path,value:r.result});toast('图片已替换');const c=e.target.dataset.returnCollection,i=Number(e.target.dataset.returnIndex);delete e.target.dataset.returnCollection;delete e.target.dataset.returnIndex;if(c==='tickets'&&Number.isInteger(i))openItemInspector('tickets',i)};r.readAsDataURL(file);
});
$('#deviceBtn').onclick=()=>{canvas.classList.toggle('mobile');$('#deviceBtn').textContent=canvas.classList.contains('mobile')?'桌面':'手机'};
$('#previewBtn').onclick=()=>{preview=!preview;$('#previewBtn').textContent=preview?'继续编辑':'预览';send({type:'OE_SET_MODE',mode:preview?'preview':'edit'});inspector.style.visibility=preview?'hidden':'visible';toast(preview?'现在看到的是发布效果':'已返回编辑')};
$('.page-nav').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b)setStudioPage(b.dataset.page)});
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(JSON.stringify(state));state=JSON.parse(history.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory()};
$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(JSON.stringify(state));state=JSON.parse(future.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory()};
$('#publishBtn').onclick=()=>send({type:'OE_EXPORT_HTML'});
syncModuleControls();bindModuleControls();mountFrame();syncHistory();