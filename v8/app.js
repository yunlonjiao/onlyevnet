import {template01} from '/v8/templates/01-ip-only.js?v=8.11.0';
const $=s=>document.querySelector(s);
const canvas=$('#canvas'),inspector=$('#inspector'),saveState=$('#saveState'),toastEl=$('#toast');
const STORAGE='onlyevent-studio-v8:01:iframe',ORIGIN=location.origin;
let state=structuredClone(template01.defaults),preview=false,history=[],future=[],saveTimer=null,iframe=null,frameReady=false,focusCheckpointTaken=false,currentPage='home';
try{const saved=localStorage.getItem(STORAGE);if(saved)state={...state,...JSON.parse(saved)}}catch{}
if(!state.edition||state.edition==='首届')state.edition=template01.defaults.edition;
if(!state.navigationUrl)state.navigationUrl=template01.defaults.navigationUrl;
if(state.modules?.activities===undefined&&state.modules?.stage!==undefined){state.modules.activities=state.modules.stage;delete state.modules.stage}
if(!state.guide||!Array.isArray(state.guide.items))state.guide=structuredClone(template01.defaults.guide);
for(const k of ['tickets','passport','booths','activities','guide'])if(state.modules&&k in state.modules)delete state.modules[k];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),1400)}
function save(){saveState.textContent='保存中…';clearTimeout(saveTimer);saveTimer=setTimeout(()=>{localStorage.setItem(STORAGE,JSON.stringify(state));saveState.textContent='已保存'},180)}
function checkpoint(){history.push(JSON.stringify(state));if(history.length>80)history.shift();future.length=0;syncHistory()}
function syncHistory(){$('#undoBtn').disabled=!history.length;$('#redoBtn').disabled=!future.length}
function setDeep(path,value){const a=path.split('.');let o=state;for(let i=0;i<a.length-1;i++)o=o[/^\d+$/.test(a[i])?Number(a[i]):a[i]];const k=a.at(-1);o[/^\d+$/.test(k)?Number(k):k]=value;save()}
function getDeep(path){return path.split('.').reduce((o,k)=>o?.[/^\d+$/.test(k)?Number(k):k],state)}
function send(message){if(frameReady&&iframe?.contentWindow)iframe.contentWindow.postMessage(message,ORIGIN)}

const moduleLabels={booths:'摊位详情',activities:'活动详情',guide:'观展指南'};
function openGuideInspector(){
 const items=state.guide?.items||[];
 const count=Math.max(0,Math.min(items.length,Number(state.guide?.homeCount??2)));
 inspector.innerHTML='<h3>观展指南</h3><div class="item-fields"><label><span>首页展示数量</span><select id="guideHomeCount">'+
   Array.from({length:items.length+1},(_,i)=>'<option value="'+i+'"'+(i===count?' selected':'')+'>'+i+' 项</option>').join('')+
   '</select></label></div><div class="hint">首页只显示前 N 项，完整内容在“观展指南”页面展示。</div>';
 $('#guideHomeCount').onchange=e=>{checkpoint();state.guide.homeCount=Number(e.target.value);save();send({type:'OE_REPLACE_STATE',state});};
}
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

function mountFrame(){canvas.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/render.html?v=8.11.0" title="OnlyEvent live canvas"></iframe>';iframe=$('#liveFrame')}
window.addEventListener('message',e=>{
 if(e.origin!==ORIGIN||e.source!==iframe?.contentWindow)return;
 const m=e.data||{};
 if(m.type==='OE_READY'){frameReady=true;send({type:'OE_INIT_STATE',state,mode:preview?'preview':'edit',page:currentPage});return}
 if(m.type==='OE_RENDER_ERROR'){toast(m.stage==='fallback'?'预览加载失败':'模块加载异常，已自动切换安全渲染');return}
 if(m.type==='OE_SELECT_FIELD'){focusCheckpointTaken=false;openFieldInspector(m.path);return}
 if(m.type==='OE_FIELD_FOCUS'){if(!focusCheckpointTaken){checkpoint();focusCheckpointTaken=true}return}
 if(m.type==='OE_FIELD_CHANGE'){
 setDeep(m.path,m.value);
 const f=$('#fieldInput');if(f&&f.dataset.path===m.path)f.value=m.value;
 const linked=inspector.querySelector('[data-sync-path="'+CSS.escape(m.path)+'"]');if(linked)linked.value=m.value;
 return
}
 if(m.type==='OE_SELECT_IMAGE'){openImageInspector(m.path);return}
 if(m.type==='OE_SELECT_ITEM'){openItemInspector(m.collection,m.index);return}
 if(m.type==='OE_EXPORT_HTML_RESULT'){downloadPublishedHtml(m.html);return}
});
function downloadPublishedHtml(html){
 const blob=new Blob([html],{type:'text/html;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 const name=(state.eventName||'onlyevent').replace(/[\\/:*?"<>|]+/g,'-').trim()||'onlyevent';
 a.href=url;a.download=name+'.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已生成游客站');
}

function bindInspectorStateInput(input,path,{clean=false,number=false}={}){
 let started=false;
 input.addEventListener('input',e=>{
   if(!started){checkpoint();started=true}
   const value=number?Number(e.target.value):e.target.value;
   setDeep(path,value);send({type:'OE_PATCH_FIELD',path,value});
   if(path==='heroTitleSize'){const out=$('#heroTitleSizeValue');if(out)out.textContent=value+' px'}
 });
 if(clean)input.addEventListener('blur',e=>{
   const value=cleanValue(e.target.value);
   if(value!==e.target.value)e.target.value=value;
   setDeep(path,value);send({type:'OE_PATCH_FIELD',path,value});
 });
}

function openHeroTitleInspector(){
 inspector.innerHTML='<h3>主视觉标题</h3><div class="item-fields">'+
  '<label><span>第一行</span><input data-sync-path="heroTitle1" value="'+esc(state.heroTitle1||'')+'"></label>'+
  '<label><span>第二行</span><input data-sync-path="heroTitle2" value="'+esc(state.heroTitle2||'')+'"></label>'+
  '<label><span>第三行</span><input data-sync-path="heroTitle3" value="'+esc(state.heroTitle3||'')+'"></label>'+
  '<label><span>字号 · <b id="heroTitleSizeValue">'+Number(state.heroTitleSize||126)+' px</b></span><input type="range" min="56" max="160" step="1" data-sync-path="heroTitleSize" value="'+Number(state.heroTitleSize||126)+'"></label>'+
  '<label><span>主文字颜色</span><input type="color" data-sync-path="heroTitleColor" value="'+esc(state.heroTitleColor||'#17151b')+'"></label>'+
  '<label><span>强调色</span><input type="color" data-sync-path="heroTitleAccentColor" value="'+esc(state.heroTitleAccentColor||'#ff5f91')+'"></label>'+
 '</div>';
 inspector.querySelectorAll('[data-sync-path]').forEach(input=>bindInspectorStateInput(input,input.dataset.syncPath,{clean:input.type==='text',number:input.type==='range'}));
}

function openAddressInspector(){
 inspector.innerHTML='<h3>地址与导航</h3><div class="item-fields">'+
  '<label><span>场馆地址</span><input data-sync-path="edition" value="'+esc(state.edition||'')+'"></label>'+
  '<label><span>导航链接</span><input type="url" data-sync-path="navigationUrl" value="'+esc(state.navigationUrl||'')+'" placeholder="https://"></label>'+
 '</div><div class="row"><button id="testNavigation" type="button">打开导航 ↗</button></div>';
 bindInspectorStateInput(inspector.querySelector('[data-sync-path="edition"]'),'edition',{clean:true});
 bindInspectorStateInput(inspector.querySelector('[data-sync-path="navigationUrl"]'),'navigationUrl',{clean:true});
 $('#testNavigation').onclick=()=>{const url=String(state.navigationUrl||'').trim();if(url.startsWith('https://')||url.startsWith('http://'))window.open(url,'_blank','noopener');else toast('请填写有效的 http/https 链接')};
}

function openFieldInspector(path){
 if(path==='edition'){openAddressInspector();return}
 if(path.startsWith('heroTitle')){openHeroTitleInspector();return}
 const value=getDeep(path);
 inspector.innerHTML='<h3>编辑内容</h3><label>内容<textarea id="fieldInput" data-path="'+esc(path)+'">'+esc(value)+'</textarea></label>';
 const input=$('#fieldInput');let started=false;fitTextarea(input);
 input.addEventListener('input',e=>{if(!started){checkpoint();started=true}setDeep(path,e.target.value);send({type:'OE_PATCH_FIELD',path,value:e.target.value});fitTextarea(e.target)});
 input.addEventListener('blur',e=>{const cleaned=cleanValue(e.target.value);if(cleaned!==e.target.value){e.target.value=cleaned;setDeep(path,cleaned);send({type:'OE_PATCH_FIELD',path,value:cleaned});fitTextarea(e.target)}});
}
const collectionMeta={
 tickets:{title:'票务',fields:[['name','票名'],['price','价格'],['gift','特典'],['note','备注']]},
 highlights:{title:'特别企划',fields:[['stamp','印章文字'],['title','标题'],['text','说明'],['tone','强调色']]},
 schedule:{title:'活动',fields:[['time','时间'],['title','标题'],['stage','区域'],['detail','详情']]},guide:{title:'指南内容',fields:[['title','标题'],['text','说明']]}
};
function uid(prefix){return prefix+Math.random().toString(36).slice(2,8)}
function fitTextarea(el){if(!el)return;el.style.height='auto';el.style.height=Math.max(36,el.scrollHeight)+'px'}
function cleanValue(v){return String(v??'').split('\n').map(x=>x.trimEnd()).join('\n').replace(/^\s*\n+/,'').replace(/\n+\s*$/,'').trim()}
function openItemInspector(collection,index){
 const meta=collectionMeta[collection],arr=collection==='guide'?state.guide?.items:state[collection],item=arr?.[index];if(!meta||!item)return;
 const count=arr.length;
 const media=collection==='tickets'?'<div class="item-media"><span>赠品图片</span><div class="item-media-row">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media="replace">选择图片</button>'+(item.image?'<button data-media="remove" class="ghost">移除</button>':'')+'</div></div></div>':'';
 inspector.innerHTML='<div class="item-inspector-head"><div><span>'+esc(meta.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0')+'</b></div><div class="item-tools"><button data-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-op="down" '+(index===count-1?'disabled':'')+'>↓</button></div></div><div class="item-fields">'+meta.fields.map(([key,label])=>'<label><span>'+label+'</span>'+(key==='text'||key==='gift'||key==='note'?'<textarea data-key="'+key+'" rows="1">'+esc(item[key]||'')+'</textarea>':'<input data-key="'+key+'" value="'+esc(item[key]||'')+'" '+(key==='tone'?'type="color"':'')+'>')+'</label>').join('')+'</div>'+media+'<div class="item-actions"><button data-op="add">＋ 添加</button><button data-op="delete" class="danger">删除</button></div>';
 inspector.querySelectorAll('textarea').forEach(fitTextarea);
 inspector.querySelectorAll('[data-key]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{
     if(!started){checkpoint();started=true}
     const key=e.target.dataset.key;arr[index][key]=e.target.value;save();const path=collection==='guide'?'guide.items.'+index+'.'+key:collection+'.'+index+'.'+key;send({type:'OE_PATCH_FIELD',path,value:e.target.value});
     if(e.target.tagName==='TEXTAREA')fitTextarea(e.target);
   });
   input.addEventListener('blur',e=>{
     if(e.target.type==='color')return;
     const key=e.target.dataset.key,cleaned=cleanValue(e.target.value);
     if(cleaned!==e.target.value){e.target.value=cleaned;arr[index][key]=cleaned;save();const path=collection==='guide'?'guide.items.'+index+'.'+key:collection+'.'+index+'.'+key;send({type:'OE_PATCH_FIELD',path,value:cleaned});if(e.target.tagName==='TEXTAREA')fitTextarea(e.target)}
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
 const arr=collection==='guide'?state.guide?.items:state[collection];if(!Array.isArray(arr))return;checkpoint();
 if(op==='up'&&index>0){[arr[index-1],arr[index]]=[arr[index],arr[index-1]];index--}
 if(op==='down'&&index<arr.length-1){[arr[index+1],arr[index]]=[arr[index],arr[index+1]];index++}
 if(op==='delete'&&arr.length>1){arr.splice(index,1);index=Math.max(0,index-1)}
 if(op==='add'){
   const fresh=collection==='tickets'?{id:uid('t'),name:'新票种',price:'¥0',gift:'',note:'',image:''}:collection==='highlights'?{id:uid('h'),stamp:'STAMP '+String(arr.length+1).padStart(2,'0'),title:'新企划',text:'',tone:'#ffe45c'}:collection==='guide'?{id:uid('gd'),title:'新指南内容',text:''}:{id:uid('s'),time:'12:00',title:'新活动',stage:'MAIN STAGE',detail:''};
   arr.splice(index+1,0,fresh);index++;
 }
 save();send({type:'OE_REPLACE_STATE',state});openItemInspector(collection,index);
}
function imageSlotConfig(path){
 if(path==='heroImage')return {label:'主视觉 KV',ratio:1,ratioLabel:'KV · 1:1',width:1400,height:1400};
 if(/^tickets\.\d+\.image$/.test(path))return {label:'票务赠品图',ratio:1,ratioLabel:'赠品图 · 1:1',width:900,height:900};
 return {label:'图片',ratio:1,ratioLabel:'1:1',width:1200,height:1200};
}
function openImageInspector(path){
 const current=getDeep(path);
 inspector.innerHTML='<h3>图片</h3><p>当前：'+esc(path)+'</p><div class="row"><button id="replaceImage" type="button">替换图片</button>'+(current?'<button id="cropCurrentImage" type="button">裁剪当前图片</button>':'')+'</div>';
 $('#replaceImage').onclick=()=>{$('#imageInput').dataset.path=path;$('#imageInput').click()};
 const cropBtn=$('#cropCurrentImage');if(cropBtn)cropBtn.onclick=()=>openImageCropper(current,path);
}
let activeCropper=null,cropContext=null,cropperModulePromise=null;
function getCropperModule(){
 if(!cropperModulePromise)cropperModulePromise=import('https://cdn.jsdelivr.net/npm/cropperjs@2.2.0/+esm');
 return cropperModulePromise;
}
async function openImageCropper(src,path,returnCollection='',returnIndex=''){
 const dlg=$('#imageCropDialog'),stage=$('#cropStage'),img=$('#cropImage'),cfg=imageSlotConfig(path);
 cropContext={path,returnCollection,returnIndex,cfg,src};
 $('#cropSlotLabel').textContent=cfg.label;
 $('#cropRatioLabel').textContent=cfg.ratioLabel;
 img.src=src;
 dlg.showModal();
 stage.classList.add('loading');
 try{
   const mod=await getCropperModule(),Cropper=mod.default||mod.Cropper;
   if(activeCropper?.destroy)activeCropper.destroy();
   stage.querySelectorAll('cropper-canvas').forEach(x=>x.remove());
   const template='<cropper-canvas background><cropper-image rotatable scalable skewable translatable></cropper-image><cropper-shade hidden></cropper-shade><cropper-handle action="move" plain></cropper-handle><cropper-selection initial-coverage="0.88" aspect-ratio="'+cfg.ratio+'" movable resizable zoomable outlined><cropper-grid role="grid" bordered covered></cropper-grid><cropper-crosshair centered></cropper-crosshair><cropper-handle action="move" theme-color="rgba(255,255,255,.35)"></cropper-handle><cropper-handle action="n-resize"></cropper-handle><cropper-handle action="e-resize"></cropper-handle><cropper-handle action="s-resize"></cropper-handle><cropper-handle action="w-resize"></cropper-handle><cropper-handle action="ne-resize"></cropper-handle><cropper-handle action="nw-resize"></cropper-handle><cropper-handle action="se-resize"></cropper-handle><cropper-handle action="sw-resize"></cropper-handle></cropper-selection></cropper-canvas>';
   activeCropper=new Cropper(img,{container:stage,template});
 }catch(err){
   console.error('[OnlyEvent cropper]',err);
   toast('裁剪器加载失败，可稍后重试');
   dlg.close();
 }finally{stage.classList.remove('loading')}
}
function closeImageCropper(){
 if(activeCropper?.destroy)activeCropper.destroy();
 activeCropper=null;cropContext=null;
 $('#imageCropDialog').close();
}
async function applyImageCrop(){
 if(!activeCropper||!cropContext)return;
 const selection=activeCropper.getCropperSelection?.();
 if(!selection){toast('未找到裁剪区域');return}
 $('#cropApply').disabled=true;
 try{
   const canvas=await selection.$toCanvas({width:cropContext.cfg.width,height:cropContext.cfg.height});
   const data=canvas.toDataURL('image/webp',.9);
   checkpoint();
   setDeep(cropContext.path,data);
   send({type:'OE_PATCH_FIELD',path:cropContext.path,value:data});
   toast('图片已裁剪');
   const c=cropContext.returnCollection,i=Number(cropContext.returnIndex);
   closeImageCropper();
   if(c==='tickets'&&Number.isInteger(i))openItemInspector('tickets',i);
 }catch(err){
   console.error('[OnlyEvent crop apply]',err);
   toast('裁剪失败，请重试');
 }finally{const b=$('#cropApply');if(b)b.disabled=false}
}
$('#cropApply').onclick=applyImageCrop;
$('#cropCancel').onclick=closeImageCropper;
$('#cropClose').onclick=closeImageCropper;
$('#imageCropDialog').addEventListener('cancel',e=>{e.preventDefault();closeImageCropper()});
$('#cropReset').onclick=()=>activeCropper?.getCropperSelection?.()?.$reset?.();
$('#cropRotateLeft').onclick=()=>activeCropper?.getCropperImage?.()?.$rotate?.('-90deg');

$('#imageInput').addEventListener('change',e=>{
 const file=e.target.files?.[0],path=e.target.dataset.path;
 const returnCollection=e.target.dataset.returnCollection||'',returnIndex=e.target.dataset.returnIndex||'';
 e.target.value='';delete e.target.dataset.returnCollection;delete e.target.dataset.returnIndex;
 if(!file||!path)return;
 const r=new FileReader();
 r.onload=()=>openImageCropper(r.result,path,returnCollection,returnIndex);
 r.readAsDataURL(file);
});
$('#deviceBtn').onclick=()=>{canvas.classList.toggle('mobile');$('#deviceBtn').textContent=canvas.classList.contains('mobile')?'桌面':'手机'};
$('#previewBtn').onclick=()=>{preview=!preview;$('#previewBtn').textContent=preview?'继续编辑':'预览';send({type:'OE_SET_MODE',mode:preview?'preview':'edit'});inspector.style.visibility=preview?'hidden':'visible';toast(preview?'现在看到的是发布效果':'已返回编辑')};
$('.page-nav').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(!b)return;setStudioPage(b.dataset.page);if(b.dataset.page==='guide')openGuideInspector()});
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(JSON.stringify(state));state=JSON.parse(history.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory()};
$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(JSON.stringify(state));state=JSON.parse(future.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory()};
$('#publishBtn').onclick=()=>send({type:'OE_EXPORT_HTML'});
syncModuleControls();bindModuleControls();mountFrame();syncHistory();