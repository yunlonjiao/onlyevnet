import {template01} from '/v8/templates/01-ip-only.js?v=8.15.0';
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
if(!state.venueMap)state.venueMap=structuredClone(template01.defaults.venueMap);
if(!Array.isArray(state.updates))state.updates=structuredClone(template01.defaults.updates);
if(!Array.isArray(state.socialLinks))state.socialLinks=structuredClone(template01.defaults.socialLinks);
if(!Array.isArray(state.sponsors))state.sponsors=structuredClone(template01.defaults.sponsors);
state.booths=(state.booths||[]).map((b,i)=>({...structuredClone(template01.defaults.booths[i]||{products:[]}),...b,products:Array.isArray(b.products)?b.products:structuredClone(template01.defaults.booths[i]?.products||[])}));
state.guests=(state.guests||[]).map((g,i)=>({...structuredClone(template01.defaults.guests[i]||{}),...g}));
state.schedule=(state.schedule||[]).map((a,i)=>({...structuredClone(template01.defaults.schedule[i]||{guestIds:[]}),...a,guestIds:Array.isArray(a.guestIds)?a.guestIds:[]}));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),1400)}
function save(){saveState.textContent='保存中…';syncContentCounts();clearTimeout(saveTimer);saveTimer=setTimeout(()=>{localStorage.setItem(STORAGE,JSON.stringify(state));saveState.textContent='已保存'},180)}
function checkpoint(){history.push(JSON.stringify(state));if(history.length>80)history.shift();future.length=0;syncHistory()}
function syncHistory(){$('#undoBtn').disabled=!history.length;$('#redoBtn').disabled=!future.length}
function setDeep(path,value){const a=path.split('.');let o=state;for(let i=0;i<a.length-1;i++)o=o[/^\d+$/.test(a[i])?Number(a[i]):a[i]];const k=a.at(-1);o[/^\d+$/.test(k)?Number(k):k]=value;save()}
function getDeep(path){return path.split('.').reduce((o,k)=>o?.[/^\d+$/.test(k)?Number(k):k],state)}
function send(message){if(frameReady&&iframe?.contentWindow)iframe.contentWindow.postMessage(message,ORIGIN)}

const moduleLabels={booths:'摊位详情',activities:'活动详情',guide:'观展指南'};
const contentManagerMeta={
 tickets:{title:'票务',empty:'还没有票种',item:(x,i)=>[x.name||('票种 '+(i+1)),x.price||'']},
 highlights:{title:'特别企划',empty:'还没有企划',item:(x,i)=>[x.title||('企划 '+(i+1)),x.stamp||'']},
 booths:{title:'摊位',empty:'还没有摊位',item:(x,i)=>[(x.no?x.no+' · ':'')+(x.name||('摊位 '+(i+1))),String((x.products||[]).length)+' 个制品']},
 schedule:{title:'活动',empty:'还没有活动',item:(x,i)=>[(x.time?x.time+' · ':'')+(x.title||('活动 '+(i+1))),x.stage||'']},
 guests:{title:'嘉宾',empty:'还没有嘉宾',item:(x,i)=>[x.name||('嘉宾 '+(i+1)),x.role||'']},
 mapPoints:{title:'地图点位',empty:'还没有点位',item:(x,i)=>[x.label||('点位 '+(i+1)),x.kind||'']},
 guide:{title:'观展指南',empty:'还没有指南内容',item:(x,i)=>[x.title||('指南 '+(i+1)),(x.text||'').slice(0,24)]},
 updates:{title:'重要更新',empty:'还没有重要更新',item:(x,i)=>[x.title||('更新 '+(i+1)),x.date||'']},
 socialLinks:{title:'社群入口',empty:'还没有社群入口',item:(x,i)=>[x.label||('入口 '+(i+1)),x.url?'已设置链接':'未设置链接']},
 sponsors:{title:'赞助支持',empty:'还没有赞助信息',item:(x,i)=>[x.name||('赞助 '+(i+1)),x.level||'']}
};
function syncContentCounts(){
 document.querySelectorAll('[data-content-count]').forEach(el=>{
   const arr=collectionArray(el.dataset.contentCount);
   el.textContent=Array.isArray(arr)?arr.length:0;
 });
}
function openCollectionManager(collection){
 const meta=contentManagerMeta[collection],arr=collectionArray(collection);if(!meta||!Array.isArray(arr))return;
 const rows=arr.map((item,i)=>{
   const [title,sub]=meta.item(item,i);
   return '<button type="button" class="content-row" data-open-item="'+i+'"><span><b>'+esc(title)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><i>→</i></button>';
 }).join('');
 inspector.innerHTML='<div class="collection-manager-head"><div><span>内容</span><h3>'+esc(meta.title)+'</h3></div><b>'+arr.length+' 项</b></div>'+
   '<div class="collection-list">'+(rows||'<div class="collection-empty">'+esc(meta.empty)+'</div>')+'</div>'+
   '<button type="button" class="collection-add" id="collectionAdd">＋ 添加'+esc(meta.title)+'</button>';
 inspector.querySelectorAll('[data-open-item]').forEach(btn=>btn.onclick=()=>openItemInspector(collection,Number(btn.dataset.openItem)));
 $('#collectionAdd').onclick=()=>mutateItem(collection,arr.length-1,'add');
}

function openGuideInspector(){
 const items=state.guide?.items||[];
 const max=Math.min(items.length,4);
 const count=Math.max(0,Math.min(max,Number(state.guide?.homeCount??2)));
 inspector.innerHTML='<div class="inspector-section-head"><div><h3>观展指南</h3><small>首页摘要</small></div><b id="guideCountReadout">'+count+' 项</b></div>'+
   '<div class="segmented-count" id="guideCountSegments">'+
   Array.from({length:max+1},(_,i)=>'<button type="button" data-count="'+i+'" class="'+(i===count?'active':'')+'" aria-pressed="'+(i===count)+'">'+i+'</button>').join('')+
   '</div><p class="inspector-note">完整内容保留在「观展指南」页面。</p>';
 $('#guideCountSegments').addEventListener('click',e=>{
   const b=e.target.closest('[data-count]');if(!b)return;
   const next=Number(b.dataset.count);if(next===Number(state.guide.homeCount??2))return;
   checkpoint();state.guide.homeCount=next;save();
   document.querySelectorAll('#guideCountSegments [data-count]').forEach(x=>{const on=Number(x.dataset.count)===next;x.classList.toggle('active',on);x.setAttribute('aria-pressed',String(on))});
   $('#guideCountReadout').textContent=next+' 项';
   send({type:'OE_REPLACE_STATE',state});
 });
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

function mountFrame(){canvas.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/render.html?v=8.15.0" title="OnlyEvent live canvas"></iframe>';iframe=$('#liveFrame')}
window.addEventListener('message',e=>{
 if(e.origin!==ORIGIN||e.source!==iframe?.contentWindow)return;
 const m=e.data||{};
 if(m.type==='OE_READY'){frameReady=true;send({type:'OE_INIT_STATE',state,mode:preview?'preview':'edit',page:currentPage});return}
 if(m.type==='OE_RENDER_ERROR'){toast(m.stage==='fallback'?'预览加载失败':'模块加载异常，已自动切换安全渲染');return}
 if(m.type==='OE_SELECT_FIELD'){document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.remove('active'));focusCheckpointTaken=false;openFieldInspector(m.path);return}
 if(m.type==='OE_FIELD_FOCUS'){if(!focusCheckpointTaken){checkpoint();focusCheckpointTaken=true}return}
 if(m.type==='OE_FIELD_CHANGE'){
 setDeep(m.path,m.value);
 const f=$('#fieldInput');if(f&&f.dataset.path===m.path)f.value=m.value;
 const linked=inspector.querySelector('[data-sync-path="'+CSS.escape(m.path)+'"]');if(linked)linked.value=m.value;
 return
}
 if(m.type==='OE_SELECT_IMAGE'){document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.remove('active'));openImageInspector(m.path);return}
 if(m.type==='OE_SELECT_ITEM'){document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.toggle('active',x.dataset.contentManager===m.collection));openItemInspector(m.collection,m.index);return}
 if(m.type==='OE_MAP_POINT_MOVE'){
   const p=state.venueMap?.points?.[m.index];if(!p)return;
   checkpoint();p.x=m.x;p.y=m.y;save();
   const x=inspector.querySelector('[data-key="x"]'),y=inspector.querySelector('[data-key="y"]');if(x)x.value=m.x;if(y)y.value=m.y;
   return
 }
 if(m.type==='OE_MAP_POINT_ADD'){
   checkpoint();state.venueMap??={image:'',points:[]};state.venueMap.points??=[];
   state.venueMap.points.push({id:uid('mp'),kind:'booth',label:'新点位',x:m.x,y:m.y});
   save();send({type:'OE_REPLACE_STATE',state});
   document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.toggle('active',x.dataset.contentManager==='mapPoints'));
   openItemInspector('mapPoints',state.venueMap.points.length-1);
   return
 }
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
 schedule:{title:'活动',fields:[['time','时间'],['title','标题'],['stage','区域名称'],['detail','详情'],['registrationUrl','报名 / 外部链接']]},
 guide:{title:'指南内容',fields:[['title','标题'],['text','说明']]},
 guests:{title:'嘉宾',fields:[['name','姓名 / 名称'],['role','身份'],['works','代表作'],['intro','介绍'],['socialLabel','平台名称'],['socialUrl','平台链接'],['appearance','签售 / 舞台时间']]},
 booths:{title:'摊位',fields:[['no','摊位号'],['name','社团名'],['type','分类'],['intro','简介']]},
 mapPoints:{title:'地图点位',fields:[['label','点位名称']]},
 updates:{title:'重要更新',fields:[['date','日期'],['title','更新内容']]},socialLinks:{title:'社群入口',fields:[['label','名称'],['note','说明'],['url','链接']]},sponsors:{title:'赞助支持',fields:[['name','名称'],['level','级别'],['url','链接']]}
};
function uid(prefix){return prefix+Math.random().toString(36).slice(2,8)}
function fitTextarea(el){if(!el)return;el.style.height='auto';el.style.height=Math.max(36,el.scrollHeight)+'px'}
function cleanValue(v){return String(v??'').split('\n').map(x=>x.trimEnd()).join('\n').replace(/^\s*\n+/,'').replace(/\n+\s*$/,'').trim()}
function collectionArray(collection){
 if(collection==='guide')return state.guide?.items;
 if(collection==='mapPoints')return state.venueMap?.points;
 return state[collection];
}
function collectionPath(collection,index,key){
 if(collection==='guide')return 'guide.items.'+index+'.'+key;
 if(collection==='mapPoints')return 'venueMap.points.'+index+'.'+key;
 return collection+'.'+index+'.'+key;
}
function optionsHtml(items,value,labelFn=x=>x.label||x.name||x.id){
 return '<option value="">未关联</option>'+items.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===value?'selected':'')+'>'+esc(labelFn(x))+'</option>').join('');
}
function extraInspector(collection,index,item){
 if(collection==='schedule'){
   const locations=state.venueMap?.points||[],guests=state.guests||[];
   return '<div class="reference-panel"><b>内容关联</b><label><span>活动地点</span><select data-ref="locationId">'+optionsHtml(locations,item.locationId,x=>x.label+' · '+x.kind)+'</select></label>'+
     '<div class="reference-list"><span>出席嘉宾</span>'+guests.map(g=>'<label class="check-row"><input type="checkbox" data-guest-ref="'+esc(g.id)+'" '+((item.guestIds||[]).includes(g.id)?'checked':'')+'><span>'+esc(g.name)+'</span></label>').join('')+'</div></div>';
 }
 if(collection==='guests'){
   const related=(state.schedule||[]).filter(a=>(a.guestIds||[]).includes(item.id));
   const image=item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
   return '<div class="item-media"><span>嘉宾图片</span><div class="item-media-row">'+image+'<div><button data-media-path="guests.'+index+'.image">选择 / 裁剪</button>'+(item.image?'<button data-remove-media="guests.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>'+
     '<div class="reference-panel"><b>关联活动</b><div class="linked-summary">'+(related.length?related.map(a=>'<span>'+esc(a.time+' '+a.title)+'</span>').join(''):'<span>暂未关联活动</span>')+'</div></div>';
 }
 if(collection==='booths'){
   const points=state.venueMap?.points||[],products=item.products||[];
   return '<div class="reference-panel"><b>地图关联</b><label><span>摊位点位</span><select data-ref="pointId">'+optionsHtml(points,item.pointId,x=>x.label+' · '+x.kind)+'</select></label></div>'+
     '<div class="product-editor"><div class="product-editor-head"><b>制品</b><button type="button" data-product-op="add">＋ 添加制品</button></div>'+
     products.map((p,j)=>'<div class="product-edit-card" data-product-row="'+j+'><div class="product-edit-media">'+(p.image?'<img src="'+esc(p.image)+'" alt="">':'<div>＋</div>')+'<button type="button" data-product-image="'+j+'">图片</button></div><div class="product-edit-fields"><input data-product-key="name" data-product-index="'+j+'" value="'+esc(p.name||'')+'" placeholder="制品名称"><input data-product-key="price" data-product-index="'+j+'" value="'+esc(p.price||'')+'" placeholder="价格"><input data-product-key="note" data-product-index="'+j+'" value="'+esc(p.note||'')+'" placeholder="说明"></div><button type="button" class="product-remove" data-product-op="remove" data-product-index="'+j+'">×</button></div>').join('')+
     '</div>';
 }
 if(collection==='mapPoints'){
   const linked=(state.booths||[]).filter(b=>b.pointId===item.id);
   const kinds=[['booth','摊位'],['stage','舞台'],['service','服务台'],['restroom','卫生间'],['changing','更衣室'],['entrance','出入口'],['food','餐饮'],['other','其他']];
   return '<div class="reference-panel"><b>点位类型</b><label><span>类型</span><select data-ref="kind">'+kinds.map(x=>'<option value="'+x[0]+'" '+(item.kind===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label></div>'+
     '<div class="reference-panel"><b>点位使用情况</b><div class="linked-summary">'+(linked.length?linked.map(b=>'<span>'+esc((b.no||'')+' '+b.name)+'</span>').join(''):'<span>暂未关联摊位</span>')+'</div><p class="inspector-note">直接在地图上拖动点位调整位置；摊位关联在摊位编辑器中设置。</p></div>';
 }
 if(collection==='updates'){
   const targets=[['top','首页顶部'],['tickets','票务'],['passport','活动参与'],['map-home','场地图'],['schedule-home','当天日程'],['guests','嘉宾'],['guide-home','观展指南'],['community','社群']];
   return '<div class="reference-panel"><b>跳转位置</b><label><span>点击后前往</span><select data-ref="target">'+targets.map(x=>'<option value="'+x[0]+'" '+(item.target===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label></div>';
 }
 return '';
}
function openItemInspector(collection,index){
 const meta=collectionMeta[collection],arr=collectionArray(collection),item=arr?.[index];if(!meta||!item)return;
 const count=arr.length;
 const isLong=k=>['text','gift','note','detail','intro','works','appearance'].includes(k);
 const media=collection==='tickets'?'<div class="item-media"><span>赠品图片</span><div class="item-media-row">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="tickets.'+index+'.image">选择图片</button>'+(item.image?'<button data-remove-media="tickets.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>':collection==='socialLinks'?'<div class="item-media"><span>二维码 / 图片</span><div class="item-media-row">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="socialLinks.'+index+'.image">选择图片</button>'+(item.image?'<button data-remove-media="socialLinks.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>':collection==='sponsors'?'<div class="item-media"><span>Logo</span><div class="item-media-row">'+(item.logo?'<img src="'+esc(item.logo)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="sponsors.'+index+'.logo">选择 Logo</button>'+(item.logo?'<button data-remove-media="sponsors.'+index+'.logo" class="ghost">移除</button>':'')+'</div></div></div>':'';
 inspector.innerHTML='<button type="button" class="inspector-back" data-back-collection="'+collection+'">← '+esc(meta.title)+'列表</button><div class="item-inspector-head"><div><span>'+esc(meta.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0')+'</b></div><div class="item-tools"><button data-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-op="down" '+(index===count-1?'disabled':'')+'>↓</button></div></div><div class="item-fields">'+meta.fields.map(([key,label])=>'<label><span>'+label+'</span>'+(isLong(key)?'<textarea data-key="'+key+'" rows="1">'+esc(item[key]||'')+'</textarea>':'<input data-key="'+key+'" value="'+esc(item[key]??'')+'" '+(key==='tone'?'type="color"':'')+'>')+'</label>').join('')+'</div>'+media+extraInspector(collection,index,item)+'<div class="item-actions"><button data-op="add">＋ 添加</button><button data-op="delete" class="danger">删除</button></div>';
 inspector.querySelector('[data-back-collection]')?.addEventListener('click',()=>openCollectionManager(collection));
 inspector.querySelectorAll('textarea').forEach(fitTextarea);
 inspector.querySelectorAll('[data-key]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{
     if(!started){checkpoint();started=true}
     const key=e.target.dataset.key;
     let value=e.target.value;
     if(collection==='mapPoints'&&(key==='x'||key==='y'))value=Math.max(0,Math.min(100,Number(value)||0));
     item[key]=value;save();if(collection==='mapPoints')send({type:'OE_REPLACE_STATE',state});else send({type:'OE_PATCH_FIELD',path:collectionPath(collection,index,key),value});
     if(e.target.tagName==='TEXTAREA')fitTextarea(e.target);
   });
   input.addEventListener('blur',e=>{
     if(e.target.type==='color')return;
     const key=e.target.dataset.key,cleaned=cleanValue(e.target.value);
     if(cleaned!==e.target.value&&!(collection==='mapPoints'&&(key==='x'||key==='y'))){e.target.value=cleaned;item[key]=cleaned;save();send({type:'OE_PATCH_FIELD',path:collectionPath(collection,index,key),value:cleaned});if(e.target.tagName==='TEXTAREA')fitTextarea(e.target)}
   });
 });
 inspector.querySelectorAll('[data-ref]').forEach(sel=>sel.addEventListener('change',e=>{checkpoint();item[e.target.dataset.ref]=e.target.value;save();send({type:'OE_REPLACE_STATE',state})}));
 inspector.querySelectorAll('[data-guest-ref]').forEach(ch=>ch.addEventListener('change',e=>{checkpoint();item.guestIds??=[];item.guestIds=e.target.checked?[...new Set([...item.guestIds,e.target.dataset.guestRef])]:item.guestIds.filter(id=>id!==e.target.dataset.guestRef);save();send({type:'OE_REPLACE_STATE',state})}));
 inspector.querySelectorAll('[data-op]').forEach(btn=>btn.addEventListener('click',()=>mutateItem(collection,index,btn.dataset.op)));
 inspector.querySelectorAll('[data-media-path]').forEach(btn=>btn.addEventListener('click',()=>{$('#imageInput').dataset.path=btn.dataset.mediaPath;$('#imageInput').dataset.returnCollection=collection;$('#imageInput').dataset.returnIndex=String(index);$('#imageInput').click()}));
 inspector.querySelectorAll('[data-remove-media]').forEach(btn=>btn.addEventListener('click',()=>{checkpoint();setDeep(btn.dataset.removeMedia,'');save();send({type:'OE_REPLACE_STATE',state});openItemInspector(collection,index)}));
 inspector.querySelectorAll('[data-product-key]').forEach(input=>input.addEventListener('input',e=>{const j=Number(e.target.dataset.productIndex),key=e.target.dataset.productKey;item.products[j][key]=e.target.value;save();send({type:'OE_REPLACE_STATE',state})}));
 inspector.querySelectorAll('[data-product-image]').forEach(btn=>btn.addEventListener('click',e=>{const j=Number(e.target.dataset.productImage),path='booths.'+index+'.products.'+j+'.image';$('#imageInput').dataset.path=path;$('#imageInput').dataset.returnCollection='booths';$('#imageInput').dataset.returnIndex=String(index);$('#imageInput').click()}));
 inspector.querySelectorAll('[data-product-op]').forEach(btn=>btn.addEventListener('click',e=>{checkpoint();item.products??=[];if(btn.dataset.productOp==='add')item.products.push({id:uid('p'),name:'新制品',price:'',note:'',image:''});if(btn.dataset.productOp==='remove'&&item.products.length>1)item.products.splice(Number(btn.dataset.productIndex),1);save();send({type:'OE_REPLACE_STATE',state});openItemInspector('booths',index)}));
}
function mutateItem(collection,index,op){
 const arr=collectionArray(collection);if(!Array.isArray(arr))return;checkpoint();
 if(op==='up'&&index>0){[arr[index-1],arr[index]]=[arr[index],arr[index-1]];index--}
 if(op==='down'&&index<arr.length-1){[arr[index+1],arr[index]]=[arr[index],arr[index+1]];index++}
 if(op==='delete'&&arr.length>1){arr.splice(index,1);index=Math.max(0,index-1)}
 if(op==='add'){
   const fresh=collection==='tickets'?{id:uid('t'),name:'新票种',price:'¥0',gift:'',note:'',image:''}:
     collection==='highlights'?{id:uid('h'),stamp:'STAMP '+String(arr.length+1).padStart(2,'0'),title:'新企划',text:'',tone:'#ffe45c'}:
     collection==='guide'?{id:uid('gd'),title:'新指南内容',text:''}:
     collection==='guests'?{id:uid('g'),name:'新嘉宾',role:'Guest',works:'',intro:'',image:'',socialLabel:'',socialUrl:'',appearance:''}:
     collection==='booths'?{id:uid('b'),no:'',name:'新摊位',type:'',intro:'',pointId:'',products:[{id:uid('p'),name:'新制品',price:'',note:'',image:''}]}:
     collection==='mapPoints'?{id:uid('mp'),kind:'other',label:'新点位',x:50,y:50,boothId:''}:
     collection==='updates'?{id:uid('u'),date:'',title:'新更新',target:'top'}:
     collection==='socialLinks'?{id:uid('sl'),label:'新社群入口',note:'',url:'',image:''}:
     collection==='sponsors'?{id:uid('sp'),name:'新赞助商',level:'合作伙伴',url:'',logo:''}:
     {id:uid('s'),time:'12:00',title:'新活动',stage:'MAIN STAGE',detail:'',locationId:'',guestIds:[],registrationUrl:''};
   arr.splice(index+1,0,fresh);index++;
 }
 save();send({type:'OE_REPLACE_STATE',state});openItemInspector(collection,index);
}
function imageSlotConfig(path){
 if(path==='heroImage')return {label:'主视觉 KV',ratio:1,ratioLabel:'KV · 1:1',width:1400,height:1400};
 if(/^tickets\.\d+\.image$/.test(path))return {label:'票务赠品图',ratio:1,ratioLabel:'赠品图 · 1:1',width:900,height:900};
 if(/^guests\.\d+\.image$/.test(path))return {label:'嘉宾图片',ratio:.8,ratioLabel:'嘉宾图 · 4:5',width:960,height:1200};
 if(/^booths\.\d+\.products\.\d+\.image$/.test(path))return {label:'制品图片',ratio:1,ratioLabel:'制品图 · 1:1',width:1000,height:1000};
 if(path==='venueMap.image')return {label:'场地图',ratio:1.5,ratioLabel:'地图 · 3:2',width:1500,height:1000};
 if(/^socialLinks\.\d+\.image$/.test(path))return {label:'二维码 / 社群图片',ratio:1,ratioLabel:'社群图 · 1:1',width:900,height:900};
 if(/^sponsors\.\d+\.logo$/.test(path))return {label:'赞助商 Logo',ratio:1.8,ratioLabel:'Logo · 9:5',width:1080,height:600};
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
   if(/^tickets\.\d+\.image$/.test(cropContext.path))send({type:'OE_PATCH_FIELD',path:cropContext.path,value:data});
   else send({type:'OE_REPLACE_STATE',state});
   toast('图片已裁剪');
   const c=cropContext.returnCollection,i=Number(cropContext.returnIndex);
   closeImageCropper();
   if(c&&Number.isInteger(i))openItemInspector(c,i);
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
document.querySelector('.content-managers').addEventListener('click',e=>{
 const b=e.target.closest('[data-content-manager]');if(!b)return;
 document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.toggle('active',x===b));
 openCollectionManager(b.dataset.contentManager);
});
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(JSON.stringify(state));state=JSON.parse(history.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory();syncContentCounts()};
$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(JSON.stringify(state));state=JSON.parse(future.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory();syncContentCounts()};
$('#publishBtn').onclick=()=>send({type:'OE_EXPORT_HTML'});
syncModuleControls();syncContentCounts();bindModuleControls();mountFrame();syncHistory();