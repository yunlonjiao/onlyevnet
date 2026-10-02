import {template01} from '/v8/templates/01-ip-only.js?v=8.22.0';
const $=s=>document.querySelector(s);
const canvas=$('#canvas'),inspector=$('#inspector'),saveState=$('#saveState'),toastEl=$('#toast');
const STORAGE='onlyevent-studio-v8:01:iframe',ORIGIN=location.origin;
let state=structuredClone(template01.defaults),preview=false,history=[],future=[],saveTimer=null,iframe=null,frameReady=false,focusCheckpointTaken=false,currentPage='home';
try{const saved=localStorage.getItem(STORAGE);if(saved)state={...state,...JSON.parse(saved)}}catch{}
if(!state.edition||state.edition==='首届')state.edition=template01.defaults.edition;
if(!state.navigationUrl)state.navigationUrl=template01.defaults.navigationUrl;
if(state.modules?.activities===undefined&&state.modules?.stage!==undefined){state.modules.activities=state.modules.stage;delete state.modules.stage}
if(!state.guide||!Array.isArray(state.guide.items))state.guide=structuredClone(template01.defaults.guide);
if(!Array.isArray(state.tickets))state.tickets=structuredClone(template01.defaults.tickets);
if(state.ticketUrl===undefined)state.ticketUrl=template01.defaults.ticketUrl;
if(state.ticketLinkLabel===undefined)state.ticketLinkLabel=template01.defaults.ticketLinkLabel;
if(!Array.isArray(state.ribbonItems)||!state.ribbonItems.length){
 const legacy=[state.ribbon1,state.ribbon2,state.ribbon3,state.ribbon4].map(x=>String(x||'').trim()).filter(Boolean);
 state.ribbonItems=(legacy.length?legacy:template01.defaults.ribbonItems.map(x=>x.text)).map((text,i)=>({id:'rb'+(i+1),text}));
}
delete state.ribbon1;delete state.ribbon2;delete state.ribbon3;delete state.ribbon4;
if(state.modules&&'passport' in state.modules)delete state.modules.passport;
if(!Array.isArray(state.participation))state.participation=structuredClone(template01.defaults.participation);
if(!state.venueMap)state.venueMap=structuredClone(template01.defaults.venueMap);
if(!Array.isArray(state.venueMap.links))state.venueMap.links=structuredClone(template01.defaults.venueMap.links);
for(const k of ['tickets','booths','activities','guide'])if(state.modules&&k in state.modules)delete state.modules[k];
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
function setInspector(kicker,title,html){
 inspector.innerHTML='<div class="inspector-header"><div><span class="inspector-kicker">'+esc(kicker||'属性')+'</span><b>'+esc(title||'未选择内容')+'</b></div><span class="inspector-status"><i></i>自动保存</span></div><div class="inspector-body">'+html+'</div>';
}
function showInspectorEmpty(){
 setInspector('属性','未选择内容','<div class="inspector-empty"><div class="empty-visual"><span></span><span></span><span></span></div><b>从画布或左侧内容库选择内容</b></div>');
}
function setWorkspace(name){
 document.querySelectorAll('[data-workspace]').forEach(b=>b.classList.toggle('active',b.dataset.workspace===name));
 document.querySelectorAll('[data-workspace-panel]').forEach(p=>{const on=p.dataset.workspacePanel===name;p.hidden=!on;p.classList.toggle('active',on)});
}
function contentThumb(collection,item){
 let src='';
 if(collection==='booths')src=(item.products||[]).find(p=>p.image)?.image||'';
 if(collection==='guests')src=item.image||'';
 if(collection==='tickets')src=item.image||'';
 if(collection==='socialLinks')src=item.image||'';
 if(collection==='sponsors')src=item.logo||'';
 const fallback={tickets:'票',participation:'参',booths:'摊',schedule:'时',guests:'嘉',mapPoints:'点',guide:'指',updates:'更',socialLinks:'社',sponsors:'赞'}[collection]||'•';
 return '<span class="sidebar-content-thumb '+(src?'has-image':'')+'">'+(src?'<img src="'+esc(src)+'" alt="">':fallback)+'</span>';
}

const moduleLabels={booths:'摊位详情',activities:'活动详情',guide:'观展指南',freewalk:'COS / 自由行',itasha:'痛车展示'};
const contentManagerMeta={
 tickets:{title:'票务',empty:'还没有票种',item:(x,i)=>[x.name||('票种 '+(i+1)),x.price||'']},
 booths:{title:'摊位',empty:'还没有摊位',item:(x,i)=>[(x.no?x.no+' · ':'')+(x.name||('摊位 '+(i+1))),String((x.products||[]).length)+' 个制品']},
 participation:{title:'活动参与',empty:'还没有参与活动',item:(x,i)=>[x.title||('参与活动 '+(i+1)),x.meta||'']},
 schedule:{title:'当天日程',empty:'还没有日程',item:(x,i)=>[(x.time?x.time+' · ':'')+(x.title||('日程 '+(i+1))),x.stage||'']},
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
function openCollectionManager(collection,selectedIndex=-1){
 const meta=contentManagerMeta[collection],arr=collectionArray(collection),panel=$('#contentListPanel');if(!meta||!Array.isArray(arr)||!panel)return;
 document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.toggle('active',x.dataset.contentManager===collection));
 const rows=arr.map((item,i)=>{
   const [title,sub]=meta.item(item,i),search=(title+' '+sub).toLowerCase();
   return '<button type="button" class="sidebar-content-row '+(i===selectedIndex?'active':'')+'" data-open-item="'+i+'" data-search="'+esc(search)+'">'+contentThumb(collection,item)+'<span class="sidebar-content-copy"><b>'+esc(title)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><i>›</i></button>';
 }).join('');
 panel.innerHTML='<div class="sidebar-content-head"><div><b>'+esc(meta.title)+'</b><span>'+arr.length+' 项</span></div>'+(arr.length>6?'<label class="sidebar-content-search"><span>⌕</span><input type="search" placeholder="搜索'+esc(meta.title)+'" data-sidebar-content-search></label>':'')+'</div><div class="sidebar-content-rows">'+(rows||'<div class="sidebar-content-empty">'+esc(meta.empty)+'</div>')+'</div><button type="button" class="sidebar-content-add" data-sidebar-content-add>＋ 添加'+esc(meta.title)+'</button>';
 panel.querySelectorAll('[data-open-item]').forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.openItem);panel.querySelectorAll('[data-open-item]').forEach(x=>x.classList.toggle('active',x===btn));openItemInspector(collection,i)});
 panel.querySelector('[data-sidebar-content-add]')?.addEventListener('click',()=>mutateItem(collection,arr.length-1,'add'));
 panel.querySelector('[data-sidebar-content-search]')?.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();panel.querySelectorAll('[data-open-item]').forEach(row=>row.hidden=!!q&&!String(row.dataset.search||'').includes(q))});
}

function openGuideInspector(){
 const items=state.guide?.items||[];
 const max=Math.min(items.length,4);
 const count=Math.max(0,Math.min(max,Number(state.guide?.homeCount??2)));
 setInspector('页面设置','观展指南','<div class="inspector-section-head"><div><h3>首页摘要</h3><small>控制首页显示数量</small></div><b id="guideCountReadout">'+count+' 项</b></div>'+
   '<div class="segmented-count" id="guideCountSegments">'+
   Array.from({length:max+1},(_,i)=>'<button type="button" data-count="'+i+'" class="'+(i===count?'active':'')+'" aria-pressed="'+(i===count)+'">'+i+'</button>').join('')+
   '</div><p class="inspector-note">完整内容保留在「观展指南」页面。</p>');
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

function mountFrame(){canvas.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/render.html?v=8.22.0" title="OnlyEvent live canvas"></iframe>';iframe=$('#liveFrame')}
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
 if(m.type==='OE_SELECT_ITEM'){setWorkspace('content');openCollectionManager(m.collection,m.index);openItemInspector(m.collection,m.index);return}
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
   setWorkspace('content');openCollectionManager('mapPoints',state.venueMap.points.length-1);
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
 setInspector('主视觉','标题与样式','<div class="item-fields">'+
  '<label><span>第一行</span><input data-sync-path="heroTitle1" value="'+esc(state.heroTitle1||'')+'"></label>'+
  '<label><span>第二行</span><input data-sync-path="heroTitle2" value="'+esc(state.heroTitle2||'')+'"></label>'+
  '<label><span>第三行</span><input data-sync-path="heroTitle3" value="'+esc(state.heroTitle3||'')+'"></label>'+
  '<label><span>字号 · <b id="heroTitleSizeValue">'+Number(state.heroTitleSize||126)+' px</b></span><input type="range" min="56" max="160" step="1" data-sync-path="heroTitleSize" value="'+Number(state.heroTitleSize||126)+'"></label>'+
  '<label><span>主文字颜色</span><input type="color" data-sync-path="heroTitleColor" value="'+esc(state.heroTitleColor||'#17151b')+'"></label>'+
  '<label><span>强调色</span><input type="color" data-sync-path="heroTitleAccentColor" value="'+esc(state.heroTitleAccentColor||'#ff5f91')+'"></label>'+
 '</div>');
 inspector.querySelectorAll('[data-sync-path]').forEach(input=>bindInspectorStateInput(input,input.dataset.syncPath,{clean:input.type==='text',number:input.type==='range'}));
}

function openAddressInspector(){
 setInspector('基础信息','场馆与导航','<div class="item-fields">'+
  '<label><span>场馆地址</span><input data-sync-path="edition" value="'+esc(state.edition||'')+'"></label>'+
  '<label><span>导航链接</span><input type="url" data-sync-path="navigationUrl" value="'+esc(state.navigationUrl||'')+'" placeholder="https://"></label>'+
 '</div><div class="row"><button id="testNavigation" type="button">打开导航 ↗</button></div>');
 bindInspectorStateInput(inspector.querySelector('[data-sync-path="edition"]'),'edition',{clean:true});
 bindInspectorStateInput(inspector.querySelector('[data-sync-path="navigationUrl"]'),'navigationUrl',{clean:true});
 $('#testNavigation').onclick=()=>{const url=String(state.navigationUrl||'').trim();if(url.startsWith('https://')||url.startsWith('http://'))window.open(url,'_blank','noopener');else toast('请填写有效的 http/https 链接')};
}

function openRibbonInspector(){
 const items=state.ribbonItems||[];
 const rows=items.map((item,i)=>'<div class="ribbon-setting-row"><span class="ribbon-setting-index">'+String(i+1).padStart(2,'0')+'</span><input data-ribbon-text="'+i+'" value="'+esc(item.text||'')+'" placeholder="滚动信息"><div class="ribbon-setting-actions"><button type="button" data-ribbon-op="up" data-ribbon-index="'+i+'" '+(i===0?'disabled':'')+'>↑</button><button type="button" data-ribbon-op="down" data-ribbon-index="'+i+'" '+(i===items.length-1?'disabled':'')+'>↓</button><button type="button" data-ribbon-op="delete" data-ribbon-index="'+i+'" '+(items.length<=1?'disabled':'')+'>×</button></div></div>').join('');
 setInspector('首页','滚动公告','<div class="ribbon-setting-list">'+rows+'</div><button type="button" class="collection-add" data-ribbon-add '+(items.length>=12?'disabled':'')+'>＋ 添加一条滚动信息</button><p class="inspector-note">当前 '+items.length+' 条。整组内容会原样循环：4 条就按 4 条循环，5 条就按 5 条循环；系统只复制整组来做无缝衔接，不会插入空白。</p>');
 inspector.querySelectorAll('[data-ribbon-text]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{const i=Number(e.target.dataset.ribbonText);if(!state.ribbonItems?.[i])return;if(!started){checkpoint();started=true}state.ribbonItems[i].text=e.target.value;save();send({type:'OE_PATCH_FIELD',path:'ribbonItems.'+i+'.text',value:e.target.value})});
   input.addEventListener('blur',e=>{const i=Number(e.target.dataset.ribbonText),cleaned=cleanValue(e.target.value);if(!state.ribbonItems?.[i])return;if(cleaned!==e.target.value)e.target.value=cleaned;state.ribbonItems[i].text=cleaned;save();send({type:'OE_REPLACE_STATE',state})});
 });
 inspector.querySelector('[data-ribbon-add]')?.addEventListener('click',()=>{if(state.ribbonItems.length>=12){toast('滚动信息最多 12 条');return}checkpoint();state.ribbonItems.push({id:uid('rb'),text:'新滚动信息'});save();send({type:'OE_REPLACE_STATE',state});openRibbonInspector()});
 inspector.querySelectorAll('[data-ribbon-op]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.ribbonIndex),op=btn.dataset.ribbonOp;if(!state.ribbonItems?.[i])return;checkpoint();if(op==='delete'&&state.ribbonItems.length>1)state.ribbonItems.splice(i,1);if(op==='up'&&i>0)[state.ribbonItems[i-1],state.ribbonItems[i]]=[state.ribbonItems[i],state.ribbonItems[i-1]];if(op==='down'&&i<state.ribbonItems.length-1)[state.ribbonItems[i+1],state.ribbonItems[i]]=[state.ribbonItems[i],state.ribbonItems[i+1]];save();send({type:'OE_REPLACE_STATE',state});openRibbonInspector()}));
}
function openTicketSettingsInspector(){
 setInspector('票务','购票平台','<div class="item-fields">'+
   '<label><span>按钮文字</span><input id="ticketLinkLabelInput" value="'+esc(state.ticketLinkLabel||'前往官方售票平台')+'"></label>'+
   '<label><span>外部购票链接</span><input id="ticketUrlInput" type="url" value="'+esc(state.ticketUrl||'')+'" placeholder="https://"></label>'+
   '</div><div class="row"><button id="testTicketUrl" type="button">打开购票平台 ↗</button></div><p class="inspector-note">这是整场活动统一的购票入口，不需要在每个票种里重复填写。</p>');
 bindInspectorStateInput($('#ticketLinkLabelInput'),'ticketLinkLabel',{clean:true});
 bindInspectorStateInput($('#ticketUrlInput'),'ticketUrl',{clean:true});
 $('#testTicketUrl').onclick=()=>{const url=String(state.ticketUrl||'').trim();if(/^https?:\/\//i.test(url))window.open(url,'_blank','noopener');else toast('请填写有效的 http/https 链接')};
}
function openFieldInspector(path){
 if(path.startsWith('ribbon')){openRibbonInspector();return}
 if(path==='ticketUrl'||path==='ticketLinkLabel'){openTicketSettingsInspector();return}
 if(path==='edition'){openAddressInspector();return}
 if(path.startsWith('heroTitle')){openHeroTitleInspector();return}
 const value=getDeep(path);
 setInspector('内容','编辑文字','<label>内容<textarea id="fieldInput" data-path="'+esc(path)+'">'+esc(value)+'</textarea></label>');
 const input=$('#fieldInput');let started=false;fitTextarea(input);
 input.addEventListener('input',e=>{if(!started){checkpoint();started=true}setDeep(path,e.target.value);send({type:'OE_PATCH_FIELD',path,value:e.target.value});fitTextarea(e.target)});
 input.addEventListener('blur',e=>{const cleaned=cleanValue(e.target.value);if(cleaned!==e.target.value){e.target.value=cleaned;setDeep(path,cleaned);send({type:'OE_PATCH_FIELD',path,value:cleaned});fitTextarea(e.target)}});
}
const collectionMeta={
 tickets:{title:'票务',fields:[['name','票名'],['price','价格'],['gift','特典'],['note','备注']]},
 participation:{title:'活动参与',fields:[['title','活动名称'],['meta','时间 / 地点'],['text','参与说明'],['url','外部报名 / 详情链接']]},
 schedule:{title:'当天日程',fields:[['time','时间'],['title','标题'],['stage','区域名称'],['detail','详情'],['registrationUrl','报名 / 外部链接']]},
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
   const products=item.products||[],logo=item.logo?'<img src="'+esc(item.logo)+'" alt="">':'<div class="item-media-empty">＋</div>';
   return '<div class="item-media"><span>社团 Logo（可选）</span><div class="item-media-row">'+logo+'<div><button data-media-path="booths.'+index+'.logo">选择 Logo</button>'+(item.logo?'<button data-remove-media="booths.'+index+'.logo" class="ghost">移除</button>':'')+'</div></div></div>'+
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
 if(collection==='participation'){
   const targets=[['participation','活动参与'],['schedule-home','当天日程'],['highlights','特别企划'],['tickets','票务'],['booths','摊位'],['map-home','场地图'],['guide','观展指南'],['freewalk','自由行'],['itasha','痛车']];
   return '<div class="reference-panel"><b>页面关联（可选）</b><label><span>点击后前往</span><select data-ref="target">'+targets.map(x=>'<option value="'+x[0]+'" '+(item.target===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label><p class="inspector-note">如果填写外部链接，会优先打开外部报名或详情页面。</p></div>';
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
 const itemTitle=contentManagerMeta[collection]?.item?.(item,index)?.[0]||meta.title;
 setInspector('内容',meta.title+' · '+itemTitle,'<div class="item-inspector-head"><div><span>'+esc(meta.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0')+'</b></div><div class="item-tools"><button data-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-op="down" '+(index===count-1?'disabled':'')+'>↓</button></div></div><div class="item-fields">'+meta.fields.map(([key,label])=>'<label><span>'+label+'</span>'+(isLong(key)?'<textarea data-key="'+key+'" rows="1">'+esc(item[key]||'')+'</textarea>':'<input data-key="'+key+'" value="'+esc(item[key]??'')+'" '+(key==='tone'?'type="color"':'')+'>')+'</label>').join('')+'</div>'+media+extraInspector(collection,index,item)+'<div class="item-actions"><button data-op="add">＋ 添加</button><button data-op="delete" class="danger">删除</button></div>');
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
     collection==='guide'?{id:uid('gd'),title:'新指南内容',text:''}:
     collection==='guests'?{id:uid('g'),name:'新嘉宾',role:'Guest',works:'',intro:'',image:'',socialLabel:'',socialUrl:'',appearance:''}:
     collection==='booths'?{id:uid('b'),no:'',name:'新摊位',logo:'',type:'',intro:'',products:[{id:uid('p'),name:'新制品',price:'',note:'',image:''}]}:
     collection==='mapPoints'?{id:uid('mp'),kind:'other',label:'新点位',x:50,y:50,boothId:''}:
     collection==='updates'?{id:uid('u'),date:'',title:'新更新',target:'top'}:
     collection==='participation'?{id:uid('pa'),title:'新参与活动',meta:'',text:'',target:'participation',url:''}:
     collection==='socialLinks'?{id:uid('sl'),label:'新社群入口',note:'',url:'',image:''}:
     collection==='sponsors'?{id:uid('sp'),name:'新赞助商',level:'合作伙伴',url:'',logo:''}:
     {id:uid('s'),time:'12:00',title:'新活动',stage:'MAIN STAGE',detail:'',locationId:'',guestIds:[],registrationUrl:''};
   arr.splice(index+1,0,fresh);index++;
 }
 save();send({type:'OE_REPLACE_STATE',state});syncContentCounts();openCollectionManager(collection,index);openItemInspector(collection,index);
}
function imageSlotConfig(path){
 if(path==='heroImage')return {label:'主视觉 KV',ratio:1,ratioLabel:'固定比例 · 1:1',width:1400,height:1400,fixed:true};
 if(/^tickets\.\d+\.image$/.test(path))return {label:'票务赠品图',ratio:1,ratioLabel:'固定比例 · 1:1',width:900,height:900,fixed:true};
 if(/^guests\.\d+\.image$/.test(path))return {label:'嘉宾图片',ratio:.8,ratioLabel:'固定比例 · 4:5',width:960,height:1200,fixed:true};
 if(/^booths\.\d+\.products\.\d+\.image$/.test(path))return {label:'制品图片',ratio:1,ratioLabel:'固定比例 · 1:1',width:1000,height:1000,fixed:true};
 if(path==='venueMap.image')return {label:'场地图',ratio:null,ratioLabel:'自由裁剪',maxSize:2000,free:true};
 if(/^(freewalk|itasha)\.image$/.test(path))return {label:'活动图片',ratio:.8,ratioLabel:'固定比例 · 4:5',width:960,height:1200,fixed:true};
 if(/^booths\.\d+\.logo$/.test(path))return {label:'社团 Logo',ratio:1,ratioLabel:'固定比例 · 1:1',width:700,height:700,fixed:true};
 if(/^socialLinks\.\d+\.image$/.test(path))return {label:'二维码 / 社群图片',ratio:1,ratioLabel:'固定比例 · 1:1',width:900,height:900,fixed:true};
 if(/^sponsors\.\d+\.logo$/.test(path))return {label:'赞助商 Logo',ratio:1.8,ratioLabel:'固定比例 · 9:5',width:1080,height:600,fixed:true};
 return {label:'图片',ratio:1,ratioLabel:'固定比例 · 1:1',width:1200,height:1200,fixed:true};
}
function openImageInspector(path){
 const current=getDeep(path);
 if(path==='venueMap.image'){
   const links=state.venueMap?.links||[];
   const targets=[['tickets','票务'],['participation','活动参与'],['booths','摊位'],['schedule-home','当天日程'],['activities','活动详情'],['guide','观展指南'],['community','社群'],['freewalk','COS / 自由行'],['itasha','痛车展示'],['guests','嘉宾']];
   const rows=links.map((item,i)=>'<div class="map-link-setting-row"><span class="map-link-setting-index">'+String(i+1).padStart(2,'0')+'</span><div class="map-link-setting-fields"><input data-map-link-label="'+i+'" value="'+esc(item.label||'')+'" placeholder="标签名称"><select data-map-link-target="'+i+'">'+targets.map(x=>'<option value="'+x[0]+'" '+(item.target===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></div><div class="map-link-setting-actions"><button type="button" data-map-link-op="up" data-map-link-index="'+i+'" '+(i===0?'disabled':'')+'>↑</button><button type="button" data-map-link-op="down" data-map-link-index="'+i+'" '+(i===links.length-1?'disabled':'')+'>↓</button><button type="button" data-map-link-op="delete" data-map-link-index="'+i+'">×</button></div></div>').join('');
   setInspector('场地图','地图与快捷标签',
     '<div class="map-image-actions"><button id="replaceImage" type="button">'+(current?'替换场地图':'上传场地图')+'</button>'+(current?'<button id="removeImage" type="button" class="danger ghost">删除场地图</button>':'')+'</div>'+
     '<p class="inspector-note">上传或替换后会先进入裁剪；场地图使用自由比例，横图和竖图都可以按实际内容调整。游客可点击查看大图。</p>'+
     '<div class="reference-panel map-link-settings"><div class="product-editor-head"><b>地图旁快捷标签</b><button type="button" data-map-link-add>＋ 添加标签</button></div>'+rows+'<p class="inspector-note">标签只负责带游客前往已有内容，例如主舞台→当天日程、摊位→摊位页、COS区→活动参与。</p></div>');
   $('#replaceImage').onclick=()=>{$('#imageInput').dataset.path=path;$('#imageInput').click()};
   $('#removeImage')?.addEventListener('click',()=>{checkpoint();setDeep(path,'');save();send({type:'OE_REPLACE_STATE',state});toast('已删除场地图');openImageInspector(path)});
   inspector.querySelectorAll('[data-map-link-label]').forEach(input=>{
     let started=false;
     input.addEventListener('input',e=>{const i=Number(e.target.dataset.mapLinkLabel);if(!state.venueMap?.links?.[i])return;if(!started){checkpoint();started=true}state.venueMap.links[i].label=e.target.value;save();send({type:'OE_PATCH_FIELD',path:'venueMap.links.'+i+'.label',value:e.target.value})});
     input.addEventListener('blur',e=>{const i=Number(e.target.dataset.mapLinkLabel);if(!state.venueMap?.links?.[i])return;const v=cleanValue(e.target.value);state.venueMap.links[i].label=v;e.target.value=v;save();send({type:'OE_REPLACE_STATE',state})});
   });
   inspector.querySelectorAll('[data-map-link-target]').forEach(select=>select.addEventListener('change',e=>{const i=Number(e.target.dataset.mapLinkTarget);if(!state.venueMap?.links?.[i])return;checkpoint();state.venueMap.links[i].target=e.target.value;save();send({type:'OE_REPLACE_STATE',state})}));
   inspector.querySelector('[data-map-link-add]')?.addEventListener('click',()=>{checkpoint();state.venueMap.links.push({id:uid('ml'),label:'新标签',target:'participation'});save();send({type:'OE_REPLACE_STATE',state});openImageInspector(path)});
   inspector.querySelectorAll('[data-map-link-op]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.mapLinkIndex),op=btn.dataset.mapLinkOp,arr=state.venueMap.links;if(!arr?.[i])return;checkpoint();if(op==='delete')arr.splice(i,1);if(op==='up'&&i>0)[arr[i-1],arr[i]]=[arr[i],arr[i-1]];if(op==='down'&&i<arr.length-1)[arr[i+1],arr[i]]=[arr[i],arr[i+1]];save();send({type:'OE_REPLACE_STATE',state});openImageInspector(path)}));
   return;
 }
 setInspector('媒体','图片','<p class="inspector-path">'+esc(path)+'</p><div class="row"><button id="replaceImage" type="button">替换图片</button>'+(current?'<button id="cropCurrentImage" type="button">裁剪当前图片</button><button id="removeImage" type="button" class="danger ghost">移除图片</button>':'')+'</div>');
 $('#replaceImage').onclick=()=>{$('#imageInput').dataset.path=path;$('#imageInput').click()};
 $('#cropCurrentImage')?.addEventListener('click',()=>openImageCropper(current,path));
 $('#removeImage')?.addEventListener('click',()=>{checkpoint();setDeep(path,'');save();send({type:'OE_REPLACE_STATE',state});toast('图片已移除');openImageInspector(path)});
}
let activeCropper=null,cropContext=null,cropperModulePromise=null;
function getCropperModule(){
 if(!cropperModulePromise)cropperModulePromise=import('https://cdn.jsdelivr.net/npm/cropperjs@2.2.0/+esm');
 return cropperModulePromise;
}
async function prepareCropSource(src,cfg){
 try{
   const img=new Image(),ready=new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject});
   img.src=src;await ready;
   const max=cfg.free?2800:2200,long=Math.max(img.naturalWidth,img.naturalHeight);
   if(!long||long<=max)return src;
   const scale=max/long,w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   canvas.getContext('2d',{alpha:false}).drawImage(img,0,0,w,h);
   return canvas.toDataURL('image/webp',.92);
 }catch(err){console.warn('[OnlyEvent crop preview]',err);return src}
}
if('requestIdleCallback' in window)requestIdleCallback(()=>getCropperModule(),{timeout:1800});
else setTimeout(()=>getCropperModule(),900);
async function openImageCropper(src,path,returnCollection='',returnIndex=''){
 const dlg=$('#imageCropDialog'),stage=$('#cropStage'),img=$('#cropImage'),cfg=imageSlotConfig(path);
 cropContext={path,returnCollection,returnIndex,cfg,src};
 $('#cropSlotLabel').textContent=cfg.label;
 $('#cropRatioLabel').textContent=cfg.ratioLabel;
 dlg.showModal();
 stage.classList.add('loading');
 try{
   const [mod,workingSrc]=await Promise.all([getCropperModule(),prepareCropSource(src,cfg)]),Cropper=mod.default||mod.Cropper;
   if(activeCropper?.destroy)activeCropper.destroy();
   stage.querySelectorAll('cropper-canvas').forEach(x=>x.remove());
   img.src=workingSrc;
   try{await img.decode()}catch{}
   const ratioAttr=Number.isFinite(cfg.ratio)&&cfg.ratio>0?' aspect-ratio="'+cfg.ratio+'" initial-aspect-ratio="'+cfg.ratio+'"':'';
   const resizeHandles=cfg.free
     ?'<cropper-handle action="n-resize"></cropper-handle><cropper-handle action="e-resize"></cropper-handle><cropper-handle action="s-resize"></cropper-handle><cropper-handle action="w-resize"></cropper-handle><cropper-handle action="ne-resize"></cropper-handle><cropper-handle action="nw-resize"></cropper-handle><cropper-handle action="se-resize"></cropper-handle><cropper-handle action="sw-resize"></cropper-handle>'
     :'<cropper-handle action="ne-resize"></cropper-handle><cropper-handle action="nw-resize"></cropper-handle><cropper-handle action="se-resize"></cropper-handle><cropper-handle action="sw-resize"></cropper-handle>';
   const template='<cropper-canvas background><cropper-image rotatable scalable skewable translatable></cropper-image><cropper-shade hidden></cropper-shade><cropper-handle action="move" plain></cropper-handle><cropper-selection initial-coverage="0.88"'+ratioAttr+' movable resizable outlined><cropper-grid role="grid" bordered covered></cropper-grid><cropper-crosshair centered></cropper-crosshair><cropper-handle action="move" theme-color="rgba(255,255,255,.35)"></cropper-handle>'+resizeHandles+'</cropper-selection></cropper-canvas>';
   activeCropper=new Cropper(img,{container:stage,template});
   const selection=activeCropper.getCropperSelection?.();
   if(selection&&cfg.fixed&&Number.isFinite(cfg.ratio)){selection.aspectRatio=cfg.ratio;selection.initialAspectRatio=cfg.ratio}
 }catch(err){
   console.error('[OnlyEvent cropper]',err);toast('裁剪器加载失败，可稍后重试');dlg.close();
 }finally{stage.classList.remove('loading')}
}
function closeImageCropper(){
 if(activeCropper?.destroy)activeCropper.destroy();
 activeCropper=null;cropContext=null;
 $('#imageCropDialog').close();
}
async function applyImageCrop(){
 if(!activeCropper||!cropContext)return;
 const selection=activeCropper.getCropperSelection?.();if(!selection){toast('未找到裁剪区域');return}
 $('#cropApply').disabled=true;
 try{
   let width=cropContext.cfg.width,height=cropContext.cfg.height;
   if(cropContext.cfg.free){
     const ratio=Math.max(.1,Number(selection.width||1)/Math.max(1,Number(selection.height||1))),max=cropContext.cfg.maxSize||2000;
     if(ratio>=1){width=max;height=Math.max(1,Math.round(max/ratio))}else{height=max;width=Math.max(1,Math.round(max*ratio))}
   }
   const canvas=await selection.$toCanvas({width,height});
   const data=canvas.toDataURL('image/webp',.9);
   checkpoint();setDeep(cropContext.path,data);
   if(/^tickets\.\d+\.image$/.test(cropContext.path))send({type:'OE_PATCH_FIELD',path:cropContext.path,value:data});else send({type:'OE_REPLACE_STATE',state});
   toast('图片已应用');
   const c=cropContext.returnCollection,i=Number(cropContext.returnIndex);closeImageCropper();if(c&&Number.isInteger(i))openItemInspector(c,i);
 }catch(err){console.error('[OnlyEvent crop apply]',err);toast('裁剪失败，请重试')}
 finally{const b=$('#cropApply');if(b)b.disabled=false}
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
function setDevice(mode){
 const mobile=mode==='mobile';canvas.classList.toggle('mobile',mobile);
 document.querySelectorAll('[data-device]').forEach(b=>b.classList.toggle('active',b.dataset.device===mode));
 const label=$('#canvasDeviceLabel');if(label)label.textContent=mobile?'手机画布':'桌面画布';
}
$('#deviceDesktopBtn').onclick=()=>setDevice('desktop');
$('#deviceMobileBtn').onclick=()=>setDevice('mobile');
function setPreview(next){
 preview=!!next;document.body.classList.toggle('previewing',preview);
 const label=$('#previewLabel');if(label)label.textContent=preview?'退出预览':'预览';
 $('#previewBtn').classList.toggle('active',preview);
 send({type:'OE_SET_MODE',mode:preview?'preview':'edit'});toast(preview?'预览模式 · 页面交互已启用':'已返回编辑');
}
$('#previewBtn').onclick=()=>setPreview(!preview);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&preview)setPreview(false)});
document.querySelector('.workspace-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-workspace]');if(!b)return;setWorkspace(b.dataset.workspace)});
$('.page-nav').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(!b)return;setWorkspace('pages');setStudioPage(b.dataset.page);if(b.dataset.page==='guide')openGuideInspector()});
document.querySelector('.content-managers').addEventListener('click',e=>{const b=e.target.closest('[data-content-manager]');if(!b)return;setWorkspace('content');openCollectionManager(b.dataset.contentManager)});
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(JSON.stringify(state));state=JSON.parse(history.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory();syncContentCounts()};
$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(JSON.stringify(state));state=JSON.parse(future.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory();syncContentCounts()};
$('#publishBtn').onclick=()=>send({type:'OE_EXPORT_HTML'});
syncModuleControls();syncContentCounts();setWorkspace('pages');showInspectorEmpty();bindModuleControls();mountFrame();syncHistory();