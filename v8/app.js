import {template01} from '/v8/templates/01-ip-only.js?v=8.31.0';
const $=s=>document.querySelector(s);
const canvas=$('#canvas'),inspector=$('#inspector'),saveState=$('#saveState'),toastEl=$('#toast');
const STORAGE='onlyevent-studio-v8:01:iframe',ORIGIN=location.origin;
let state=structuredClone(template01.defaults),preview=false,history=[],future=[],saveTimer=null,iframe=null,frameReady=false,focusCheckpointTaken=false,currentPage='home';
try{const saved=localStorage.getItem(STORAGE);if(saved)state={...state,...JSON.parse(saved)}}catch{}
if(!state.edition||state.edition==='首届')state.edition=template01.defaults.edition;
if(!state.navigationUrl)state.navigationUrl=template01.defaults.navigationUrl;
if(state.modules?.activities===undefined&&state.modules?.stage!==undefined){state.modules.activities=state.modules.stage;delete state.modules.stage}
if(!state.guide||!Array.isArray(state.guide.items))state.guide=structuredClone(template01.defaults.guide);
state.guide.items=(state.guide.items||[]).map((x,i)=>({image:'',preset:x.preset||template01.defaults.guide.items[i]?.preset||'custom',...x}));
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
const FIRST_LEVEL_TARGETS=new Set(['booths','activities','guide','freewalk','itasha']);
state.venueMap.links=(state.venueMap.links||[]).map((link,i)=>{
 const legacy={participation:'activities','schedule-home':'activities','map-home':'booths','guide-home':'guide'}[link.target];
 let target=FIRST_LEVEL_TARGETS.has(legacy||link.target)?(legacy||link.target):'activities';
 const label=String(link.label||'');
 if(/痛车/i.test(label))target='itasha';
 else if(/COS|自由行/i.test(label))target='freewalk';
 else if(/摊位/i.test(label)&&target==='activities')target='booths';
 return {id:link.id||('ml'+(i+1)),label:label||'继续探索',target,itemType:link.itemType||'page',itemId:link.itemId||''};
});
delete state.venueMap.points;
state.participation=(state.participation||[]).map(item=>({...item,target:{participation:'activities','schedule-home':'activities','guide-home':'guide'}[item.target]||item.target||'activities'}));
state.modules??={};
for(const k of ['booths','activities','guide','freewalk','itasha','ribbon','guests','community','sponsors']){
 if(state.modules[k]===undefined)state.modules[k]=template01.defaults.modules?.[k]!==false;
}
if(!state.venueMap)state.venueMap=structuredClone(template01.defaults.venueMap);
if(!Array.isArray(state.updates))state.updates=structuredClone(template01.defaults.updates);
if(!Array.isArray(state.socialLinks))state.socialLinks=structuredClone(template01.defaults.socialLinks);
if(!Array.isArray(state.sponsors))state.sponsors=structuredClone(template01.defaults.sponsors);
state.booths=(state.booths||[]).map((b,i)=>{const next={...structuredClone(template01.defaults.booths[i]||{products:[]}),...b,products:Array.isArray(b.products)?b.products:structuredClone(template01.defaults.booths[i]?.products||[])};delete next.pointId;return next});
state.guests=(state.guests||[]).map((g,i)=>({...structuredClone(template01.defaults.guests[i]||{}),...g}));
state.schedule=(state.schedule||[]).map((a,i)=>{const next={...structuredClone(template01.defaults.schedule[i]||{guestIds:[]}),...a,guestIds:Array.isArray(a.guestIds)?a.guestIds:[]};delete next.locationId;return next});
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
 const target=document.querySelector('[data-workspace-panel="'+name+'"]')?name:'pages';
 document.querySelectorAll('[data-workspace]').forEach(b=>b.classList.toggle('active',b.dataset.workspace===target));
 document.querySelectorAll('[data-workspace-panel]').forEach(p=>{const on=p.dataset.workspacePanel===target;p.hidden=!on;p.classList.toggle('active',on)});
}
function contentThumb(collection,item){
 let src='';
 if(collection==='booths')src=(item.products||[]).find(p=>p.image)?.image||'';
 if(collection==='guests')src=item.image||'';
 if(collection==='tickets')src=item.image||'';
 if(collection==='socialLinks')src=item.image||'';
 if(collection==='sponsors')src=item.logo||'';
 const fallback={ribbonItems:'告',tickets:'票',explore:'↗',participation:'参',booths:'摊',schedule:'时',guests:'嘉',guide:'指',updates:'更',socialLinks:'社',sponsors:'赞'}[collection]||'•';
 return '<span class="sidebar-content-thumb '+(src?'has-image':'')+'">'+(src?'<img src="'+esc(src)+'" alt="">':fallback)+'</span>';
}

const moduleLabels={booths:'摊位',activities:'活动',guide:'观展指南',freewalk:'COS / 自由行',itasha:'痛车展示'};
const contentManagerMeta={
 ribbonItems:{title:'滚动公告',empty:'还没有滚动公告',item:(x,i)=>[x.text||('公告 '+(i+1)),'']},
 explore:{title:'继续探索',empty:'还没有探索入口',item:(x,i)=>[x.label||('入口 '+(i+1)),moduleLabels[x.target]||'页面']},
 tickets:{title:'票务',empty:'还没有票种',item:(x,i)=>[x.name||('票种 '+(i+1)),x.price||'']},
 booths:{title:'摊位',empty:'还没有摊位',item:(x,i)=>[(x.no?x.no+' · ':'')+(x.name||('摊位 '+(i+1))),String((x.products||[]).length)+' 个制品']},
 participation:{title:'活动',empty:'还没有活动',item:(x,i)=>[x.title||('活动 '+(i+1)),x.meta||'']},
 schedule:{title:'当天日程',empty:'还没有日程',item:(x,i)=>[(x.time?x.time+' · ':'')+(x.title||('日程 '+(i+1))),x.stage||'']},
 guests:{title:'嘉宾',empty:'还没有嘉宾',item:(x,i)=>[x.name||('嘉宾 '+(i+1)),x.role||'']},
 guide:{title:'观展指南',empty:'还没有指南内容',item:(x,i)=>[x.title||('指南 '+(i+1)),(x.text||'').slice(0,24)]},
 updates:{title:'重要更新',empty:'还没有重要更新',item:(x,i)=>[x.title||('更新 '+(i+1)),x.date||'']},
 socialLinks:{title:'社群入口',empty:'还没有社群入口',item:(x,i)=>[x.label||('入口 '+(i+1)),x.url?'已设置链接':'未设置链接']},
 sponsors:{title:'赞助支持',empty:'还没有赞助信息',item:(x,i)=>[x.name||('赞助 '+(i+1)),x.level||'']}
};

const GUIDE_PRESETS={
 traffic:{preset:'traffic',title:'交通到达',text:'填写场馆地址、地铁 / 公交、自驾 / 网约车、入口位置。可以上传路线图或入口示意图。',image:''},
 admission:{preset:'admission',title:'入场须知',text:'填写入场时间、检票方式、排队、现场购票、二次入场、禁止夜排等说明。',image:''},
 facilities:{preset:'facilities',title:'场馆设施',text:'填写卫生间、更衣室、寄存、餐饮、医疗点、休息区、充电或无障碍信息。',image:''},
 cosplay:{preset:'cosplay',title:'COS / 道具规则',text:'填写更衣、摄影、道具尺寸、仿真武器、妆造和现场拍摄规则。',image:''},
 safety:{preset:'safety',title:'安全与禁止事项',text:'填写禁止携带物品、禁止行为、紧急情况处理和 Staff 联系方式。',image:''}
};
const PARTICIPATION_PRESETS={
 stage:{preset:'stage',title:'舞台活动',meta:'主舞台 · 时间待定',text:'填写节目、Talk、表演或舞台互动内容。',target:'activities',url:''},
 stamp:{preset:'stamp',title:'集章 / 打卡',meta:'活动区域 · 全天',text:'填写集章点、打卡规则、兑换方式或完成奖励。',target:'activities',url:''},
 photo:{preset:'photo',title:'主题合影',meta:'集合区域 · 时间待定',text:'填写集合时间、地点和参与方式。',target:'activities',url:''},
 game:{preset:'game',title:'互动游戏 / 抽选',meta:'活动区域 · 时间待定',text:'填写互动游戏、抽选或现场挑战的参与规则。',target:'activities',url:''},
 free:{preset:'free',title:'自由交流 / 同好活动',meta:'活动区域 · 时间待定',text:'填写自由交流、同好聚会或临时互动内容。',target:'activities',url:''}
};

const PAGE_CONTENT_CONFIG={
 home:[
   {tool:'basic',label:'基本信息'},
   {tool:'hero',label:'主视觉'},
   {collection:'ribbonItems',label:'滚动公告'},
   {collection:'tickets',label:'票务'},
   {tool:'map',label:'场地图'},
   {collection:'explore',label:'继续探索'},
   {collection:'updates',label:'重要更新'},
   {collection:'guests',label:'嘉宾'},
   {collection:'socialLinks',label:'社群'},
   {collection:'sponsors',label:'赞助'}
 ],
 booths:[{collection:'booths',label:'摊位与制品'}],
 activities:[{collection:'participation',label:'活动企划'},{collection:'schedule',label:'当天日程'}],
 guide:[{collection:'guide',label:'指南内容'}],
 freewalk:[{tool:'freewalk',label:'页面内容'}],
 itasha:[{tool:'itasha',label:'页面内容'}]
};
const COLLECTION_PAGE={
 ribbonItems:'home',tickets:'home',explore:'home',updates:'home',guests:'home',socialLinks:'home',sponsors:'home',
 booths:'booths',participation:'activities',schedule:'activities',guide:'guide'
};
function openOptionalPageInspector(key){
 const page=state[key]||{},label=key==='freewalk'?'COS / 自由行':'痛车展示';
 setInspector('页面内容',label,
   '<div class="item-fields">'+
   '<label><span>页面标题</span><input data-optional-field="title" value="'+esc(page.title||label)+'"></label>'+
   '<label><span>正文</span><textarea data-optional-field="text" rows="6">'+esc(page.text||'')+'</textarea></label>'+
   '</div>'+
   '<div class="item-media"><span>页面图片</span><div class="item-media-row">'+
   (page.image?'<img src="'+esc(page.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+
   '<div><button type="button" data-optional-image>选择 / 裁剪</button>'+
   (page.image?'<button type="button" class="ghost" data-optional-image-remove>移除</button>':'')+
   '</div></div></div>');
 inspector.querySelectorAll('[data-optional-field]').forEach(input=>bindInspectorStateInput(input,key+'.'+input.dataset.optionalField,{clean:true}));
 inspector.querySelector('[data-optional-image]')?.addEventListener('click',()=>{$('#imageInput').dataset.path=key+'.image';$('#imageInput').click()});
 inspector.querySelector('[data-optional-image-remove]')?.addEventListener('click',()=>{checkpoint();setDeep(key+'.image','');send({type:'OE_REPLACE_STATE',state});openOptionalPageInspector(key)});
}
function openPageTool(tool){
 document.querySelectorAll('[data-page-content-manager],[data-page-tool]').forEach(x=>x.classList.toggle('active',x.dataset.pageTool===tool));
 const panel=$('#contentListPanel');if(panel)panel.innerHTML='';
 if(tool==='basic'){openAddressInspector();return}
 if(tool==='hero'){openHeroTitleInspector();return}
 if(tool==='map'){openImageInspector('venueMap.image');return}
 if(tool==='freewalk'||tool==='itasha'){openOptionalPageInspector(tool);return}
 showInspectorEmpty();
}
function renderPageContentNav(page,{openDefault=true}={}){
 const items=PAGE_CONTENT_CONFIG[page]||[],nav=$('#pageContentNav'),title=$('#pageContentTitle'),panel=$('#contentListPanel');
 if(title)title.textContent=(moduleLabels[page]||'首页')+'内容';
 if(!nav)return;
 nav.innerHTML=items.map(x=>x.collection
   ?'<button type="button" data-page-content-manager="'+x.collection+'"><span>'+esc(x.label)+'</span><b data-content-count="'+x.collection+'">0</b></button>'
   :'<button type="button" data-page-tool="'+x.tool+'"><span>'+esc(x.label)+'</span></button>'
 ).join('');
 syncContentCounts();
 nav.querySelectorAll('[data-page-content-manager]').forEach(btn=>btn.addEventListener('click',()=>openCollectionManager(btn.dataset.pageContentManager)));
 nav.querySelectorAll('[data-page-tool]').forEach(btn=>btn.addEventListener('click',()=>openPageTool(btn.dataset.pageTool)));
 if(panel)panel.innerHTML='<div class="sidebar-content-empty">选择上方内容进行管理。</div>';
 if(openDefault&&items[0]){
   if(items[0].collection)openCollectionManager(items[0].collection);
   else openPageTool(items[0].tool);
 }
}
function addPresetItem(collection,key){
 checkpoint();
 const arr=collectionArray(collection);if(!Array.isArray(arr))return;
 const source=collection==='guide'?GUIDE_PRESETS[key]:PARTICIPATION_PRESETS[key];
 if(!source)return;
 arr.push({id:uid(collection==='guide'?'gd':'pa'),...structuredClone(source)});
 save();send({type:'OE_REPLACE_STATE',state});
 openCollectionManager(collection,arr.length-1);openItemInspector(collection,arr.length-1);
}
function syncContentCounts(){
 document.querySelectorAll('[data-content-count]').forEach(el=>{
   const arr=collectionArray(el.dataset.contentCount);
   el.textContent=Array.isArray(arr)?arr.length:0;
 });
}
function openCollectionManager(collection,selectedIndex=-1){
 const meta=contentManagerMeta[collection],arr=collectionArray(collection),panel=$('#contentListPanel');if(!meta||!Array.isArray(arr)||!panel)return;
 document.querySelectorAll('[data-content-manager],[data-page-content-manager]').forEach(x=>x.classList.toggle('active',(x.dataset.contentManager||x.dataset.pageContentManager)===collection));
 const rows=arr.map((item,i)=>{
   const [title,sub]=meta.item(item,i),search=(title+' '+sub).toLowerCase();
   return '<button type="button" class="sidebar-content-row '+(i===selectedIndex?'active':'')+'" data-open-item="'+i+'" data-search="'+esc(search)+'">'+contentThumb(collection,item)+'<span class="sidebar-content-copy"><b>'+esc(title)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><i>›</i></button>';
 }).join('');
 const guidePresets=collection==='guide'?'<div class="preset-add"><span>常用预设</span><div>'+Object.entries(GUIDE_PRESETS).map(([key,x])=>'<button type="button" data-add-preset="'+key+'">'+esc(x.title)+'</button>').join('')+'</div></div>':'';
 const activityPresets=collection==='participation'?'<div class="preset-add"><span>常用活动</span><div>'+Object.entries(PARTICIPATION_PRESETS).map(([key,x])=>'<button type="button" data-add-preset="'+key+'">'+esc(x.title)+'</button>').join('')+'</div></div>':'';
 const addLabel=collection==='guide'?'＋ 添加自定义指南':collection==='participation'?'＋ 添加自定义活动':'＋ 添加'+meta.title;
 panel.innerHTML='<div class="sidebar-content-head"><div><b>'+esc(meta.title)+'</b><span>'+arr.length+' 项</span></div>'+(arr.length>6?'<label class="sidebar-content-search"><span>⌕</span><input type="search" placeholder="搜索'+esc(meta.title)+'" data-sidebar-content-search></label>':'')+'</div>'+guidePresets+activityPresets+'<div class="sidebar-content-rows">'+(rows||'<div class="sidebar-content-empty">'+esc(meta.empty)+'</div>')+'</div><button type="button" class="sidebar-content-add" data-sidebar-content-add>'+addLabel+'</button>';
 panel.querySelectorAll('[data-open-item]').forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.openItem);panel.querySelectorAll('[data-open-item]').forEach(x=>x.classList.toggle('active',x===btn));openItemInspector(collection,i)});
 panel.querySelectorAll('[data-add-preset]').forEach(btn=>btn.onclick=()=>addPresetItem(collection,btn.dataset.addPreset));
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
 document.querySelectorAll('[data-page-row]').forEach(row=>row.classList.toggle('is-disabled',state.modules?.[row.dataset.pageRow]===false));
}
function syncStudioPageUI(page,{openContent=true}={}){
 currentPage=page||'home';
 document.querySelectorAll('.page-nav [data-page]').forEach(btn=>btn.classList.toggle('active',btn.dataset.page===currentPage));
 document.querySelectorAll('[data-page-row]').forEach(row=>row.classList.toggle('active',row.dataset.pageRow===currentPage));
 const title=document.querySelector('.canvas-title b');if(title)title.textContent=currentPage==='home'?'首页':(moduleLabels[currentPage]||'页面');
 if(openContent)renderPageContentNav(currentPage);
}
function setStudioPage(page,{openContent=true}={}){
 syncStudioPageUI(page,{openContent});
 send({type:'OE_SHOW_PAGE',page:currentPage});
}
function bindModuleControls(){
 document.querySelectorAll('[data-module]').forEach(input=>input.addEventListener('change',()=>{
   checkpoint();state.modules??={};state.modules[input.dataset.module]=input.checked;save();
   if(!input.checked&&currentPage===input.dataset.module)setStudioPage('home');
   syncModuleControls();send({type:'OE_REPLACE_STATE',state});
 }));
}

function mountFrame(){canvas.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/render.html?v=8.31.0" title="OnlyEvent live canvas"></iframe>';iframe=$('#liveFrame')}
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
 if(m.type==='OE_SELECT_ITEM'){
   const page=COLLECTION_PAGE[m.collection]||currentPage||'home';
   setWorkspace('pages');syncStudioPageUI(page,{openContent:false});renderPageContentNav(page,{openDefault:false});
   openCollectionManager(m.collection,m.index);openItemInspector(m.collection,m.index);return
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
 if(path.startsWith('ribbonItems.')){
   const i=Number(path.split('.')[1])||0;
   setWorkspace('pages');syncStudioPageUI('home',{openContent:false});renderPageContentNav('home',{openDefault:false});
   openCollectionManager('ribbonItems',i);openItemInspector('ribbonItems',i);return
 }
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
 ribbonItems:{title:'滚动公告',fields:[['text','内容']]},
 explore:{title:'继续探索',fields:[['label','显示名称']]},
 tickets:{title:'票务',fields:[['name','票名'],['price','价格'],['gift','特典'],['note','备注']]},
 participation:{title:'活动参与',fields:[['title','活动名称'],['meta','时间 / 地点'],['text','参与说明'],['url','外部报名 / 详情链接']]},
 schedule:{title:'当天日程',fields:[['time','时间'],['title','标题'],['stage','区域名称'],['detail','详情'],['registrationUrl','报名 / 外部链接']]},
 guide:{title:'指南内容',fields:[['title','标题'],['text','说明']]},
 guests:{title:'嘉宾',fields:[['name','姓名 / 名称'],['role','身份'],['works','代表作'],['intro','介绍'],['socialLabel','平台名称'],['socialUrl','平台链接'],['appearance','签售 / 舞台时间']]},
 booths:{title:'摊位',fields:[['no','摊位号'],['name','社团名'],['type','分类'],['intro','简介']]},
 updates:{title:'重要更新',fields:[['date','日期'],['title','更新内容']]},socialLinks:{title:'社群入口',fields:[['label','名称'],['note','说明'],['url','链接']]},sponsors:{title:'赞助支持',fields:[['name','名称'],['level','级别'],['url','链接']]}
};
function uid(prefix){return prefix+Math.random().toString(36).slice(2,8)}
function fitTextarea(el){if(!el)return;el.style.height='auto';el.style.height=Math.max(36,el.scrollHeight)+'px'}
function cleanValue(v){return String(v??'').split('\n').map(x=>x.trimEnd()).join('\n').replace(/^\s*\n+/,'').replace(/\n+\s*$/,'').trim()}
function collectionArray(collection){
 if(collection==='guide')return state.guide?.items;
 if(collection==='explore')return state.venueMap?.links;
 return state[collection];
}
function collectionPath(collection,index,key){
 if(collection==='guide')return 'guide.items.'+index+'.'+key;
 if(collection==='explore')return 'venueMap.links.'+index+'.'+key;
 return collection+'.'+index+'.'+key;
}
function optionsHtml(items,value,labelFn=x=>x.label||x.name||x.id){
 return '<option value="">未关联</option>'+items.map(x=>'<option value="'+esc(x.id)+'" '+(x.id===value?'selected':'')+'>'+esc(labelFn(x))+'</option>').join('');
}
function exploreDetailOptions(page,itemType='page',itemId=''){
 const selected=(type,id)=>type===itemType&&String(id||'')===String(itemId||'')?' selected':'';
 let out='<option value="page:"'+selected('page','')+'>页面顶部</option>';
 if(page==='booths')out+=(state.booths||[]).map(x=>'<option value="booth:'+esc(x.id)+'"'+selected('booth',x.id)+'>'+esc((x.no?x.no+' · ':'')+(x.name||'摊位'))+'</option>').join('');
 if(page==='activities'){
   out+=(state.participation||[]).map(x=>'<option value="participation:'+esc(x.id)+'"'+selected('participation',x.id)+'>企划 · '+esc(x.title||'活动')+'</option>').join('');
   out+=(state.schedule||[]).map(x=>'<option value="schedule:'+esc(x.id)+'"'+selected('schedule',x.id)+'>日程 · '+esc((x.time?x.time+' ':'')+(x.title||'活动'))+'</option>').join('');
 }
 if(page==='guide')out+=(state.guide?.items||[]).map(x=>'<option value="guide:'+esc(x.id)+'"'+selected('guide',x.id)+'>'+esc(x.title||'指南')+'</option>').join('');
 return out;
}
function extraInspector(collection,index,item){
 if(collection==='schedule'){
   const guests=state.guests||[];
   return '<div class="reference-panel"><b>内容关联</b><div class="reference-list"><span>出席嘉宾</span>'+guests.map(g=>'<label class="check-row"><input type="checkbox" data-guest-ref="'+esc(g.id)+'" '+((item.guestIds||[]).includes(g.id)?'checked':'')+'><span>'+esc(g.name)+'</span></label>').join('')+'</div></div>';
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
 if(collection==='explore'){
   const pages=[['booths','摊位'],['activities','活动'],['guide','观展指南'],['freewalk','COS / 自由行'],['itasha','痛车展示']];
   const detailOptions=exploreDetailOptions(item.target,item.itemType,item.itemId);
   return '<div class="reference-panel explore-link-settings"><b>跳转目标</b>'+
     '<label><span>一级页面</span><select data-explore-page>'+pages.map(x=>'<option value="'+x[0]+'" '+(item.target===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label>'+
     '<label><span>页内内容（可选）</span><select data-explore-detail>'+detailOptions+'</select></label></div>';
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
 const guideMedia=collection==='guide'
   ?(item.image
     ?'<div class="item-media"><span>'+(item.preset==='traffic'?'路线图 / 入口示意图':'附图')+'</span><div class="item-media-row"><img src="'+esc(item.image)+'" alt=""><div><button data-media-path="guide.items.'+index+'.image">替换图片</button><button data-remove-media="guide.items.'+index+'.image" class="ghost">移除</button></div></div></div>'
     :'<div class="guide-media-add"><button type="button" data-media-path="guide.items.'+index+'.image">＋ 添加附图</button></div>')
   :'';
 const itemTitle=contentManagerMeta[collection]?.item?.(item,index)?.[0]||meta.title;
 setInspector('内容',meta.title+' · '+itemTitle,'<div class="item-inspector-head"><div><span>'+esc(meta.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0')+'</b></div><div class="item-tools"><button data-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-op="down" '+(index===count-1?'disabled':'')+'>↓</button></div></div><div class="item-fields">'+meta.fields.map(([key,label])=>'<label><span>'+label+'</span>'+(isLong(key)?'<textarea data-key="'+key+'" rows="1">'+esc(item[key]||'')+'</textarea>':'<input data-key="'+key+'" value="'+esc(item[key]??'')+'" '+(key==='tone'?'type="color"':'')+'>')+'</label>').join('')+'</div>'+media+guideMedia+extraInspector(collection,index,item)+'<div class="item-actions"><button data-op="add">＋ 添加</button><button data-op="delete" class="danger">删除</button></div>');
 inspector.querySelectorAll('textarea').forEach(fitTextarea);
 inspector.querySelectorAll('[data-key]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{
     if(!started){checkpoint();started=true}
     const key=e.target.dataset.key;
     let value=e.target.value;
     item[key]=value;save();send({type:'OE_PATCH_FIELD',path:collectionPath(collection,index,key),value});
     if(e.target.tagName==='TEXTAREA')fitTextarea(e.target);
   });
   input.addEventListener('blur',e=>{
     if(e.target.type==='color')return;
     const key=e.target.dataset.key,cleaned=cleanValue(e.target.value);
     if(cleaned!==e.target.value){e.target.value=cleaned;item[key]=cleaned;save();send({type:'OE_PATCH_FIELD',path:collectionPath(collection,index,key),value:cleaned});if(e.target.tagName==='TEXTAREA')fitTextarea(e.target)}
   });
 });
 inspector.querySelectorAll('[data-ref]').forEach(sel=>sel.addEventListener('change',e=>{checkpoint();item[e.target.dataset.ref]=e.target.value;save();send({type:'OE_REPLACE_STATE',state})}));
 if(collection==='explore'){
   inspector.querySelector('[data-explore-page]')?.addEventListener('change',e=>{checkpoint();item.target=e.target.value;item.itemType='page';item.itemId='';save();send({type:'OE_REPLACE_STATE',state});openCollectionManager('explore',index);openItemInspector('explore',index)});
   inspector.querySelector('[data-explore-detail]')?.addEventListener('change',e=>{checkpoint();const [type,id='']=String(e.target.value||'page:').split(':');item.itemType=type||'page';item.itemId=id;save();send({type:'OE_REPLACE_STATE',state})});
 }
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
   const fresh=collection==='ribbonItems'?{id:uid('rb'),text:'新滚动公告'}:
     collection==='explore'?{id:uid('ml'),label:'新探索入口',target:'activities',itemType:'page',itemId:''}:
     collection==='tickets'?{id:uid('t'),name:'新票种',price:'¥0',gift:'',note:'',image:''}:
     collection==='guide'?{id:uid('gd'),preset:'custom',title:'新指南内容',text:'',image:''}:
     collection==='guests'?{id:uid('g'),name:'新嘉宾',role:'Guest',works:'',intro:'',image:'',socialLabel:'',socialUrl:'',appearance:''}:
     collection==='booths'?{id:uid('b'),no:'',name:'新摊位',logo:'',type:'',intro:'',products:[{id:uid('p'),name:'新制品',price:'',note:'',image:''}]}:
     collection==='updates'?{id:uid('u'),date:'',title:'新更新',target:'top'}:
     collection==='participation'?{id:uid('pa'),preset:'custom',title:'新活动',meta:'时间 / 地点待定',text:'',target:'participation',url:''}:
     collection==='socialLinks'?{id:uid('sl'),label:'新社群入口',note:'',url:'',image:''}:
     collection==='sponsors'?{id:uid('sp'),name:'新赞助商',level:'合作伙伴',url:'',logo:''}:
     {id:uid('s'),time:'12:00',title:'新活动',stage:'MAIN STAGE',detail:'',guestIds:[],registrationUrl:''};
   arr.splice(index+1,0,fresh);index++;
 }
 save();send({type:'OE_REPLACE_STATE',state});syncContentCounts();openCollectionManager(collection,index);openItemInspector(collection,index);
}
function imageSlotConfig(path){
 if(path==='heroImage')return {label:'主视觉 KV',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1400,height:1400,fixed:true};
 if(/^tickets\.\d+\.image$/.test(path))return {label:'票务赠品图',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:900,height:900,fixed:true};
 if(/^guests\.\d+\.image$/.test(path))return {label:'嘉宾图片',ratio:.8,ratioLabel:'裁剪框可移动 · 比例 4:5',width:960,height:1200,fixed:true};
 if(/^booths\.\d+\.products\.\d+\.image$/.test(path))return {label:'制品图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1000,height:1000,fixed:true};
 if(path==='venueMap.image')return {label:'场地图',ratio:null,ratioLabel:'裁剪框自由比例',maxSize:2000,free:true};
 if(/^guide\.items\.\d+\.image$/.test(path))return {label:'指南说明图',ratio:null,ratioLabel:'裁剪框自由比例',maxSize:1800,free:true};
 if(/^(freewalk|itasha)\.image$/.test(path))return {label:'活动图片',ratio:.8,ratioLabel:'裁剪框可移动 · 比例 4:5',width:960,height:1200,fixed:true};
 if(/^booths\.\d+\.logo$/.test(path))return {label:'社团 Logo',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:700,height:700,fixed:true};
 if(/^socialLinks\.\d+\.image$/.test(path))return {label:'二维码 / 社群图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:900,height:900,fixed:true};
 if(/^sponsors\.\d+\.logo$/.test(path))return {label:'赞助商 Logo',ratio:1.8,ratioLabel:'裁剪框可移动 · 比例 9:5',width:1080,height:600,fixed:true};
 return {label:'图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1200,height:1200,fixed:true};
}
function openImageInspector(path){
 const current=getDeep(path);
 if(path==='venueMap.image'){
   setInspector('场地图','场地图',
     '<div class="map-image-actions"><button id="replaceImage" type="button">'+(current?'替换场地图':'上传场地图')+'</button>'+(current?'<button id="removeImage" type="button" class="danger ghost">删除场地图</button>':'')+'</div>');
   $('#replaceImage').onclick=()=>{$('#imageInput').dataset.path=path;$('#imageInput').click()};
   $('#removeImage')?.addEventListener('click',()=>{checkpoint();setDeep(path,'');save();send({type:'OE_REPLACE_STATE',state});openImageInspector(path)});
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
function canvasToBlob(canvas,type='image/webp',quality=.9){
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('图片编码失败')),type,quality));
}
function blobToDataUrl(blob){
 return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
}
async function prepareCropFile(file,cfg){
 // Old-CMS fast path: most files enter the cropper immediately without re-encoding.
 const directLimit=10*1024*1024;
 if(file.size<=directLimit)return {url:URL.createObjectURL(file),optimized:false};
 try{
   const bitmap=await createImageBitmap(file);
   const long=Math.max(bitmap.width,bitmap.height),max=cfg.free?3600:3200;
   if(!long||long<=max){
     bitmap.close?.();
     return {url:URL.createObjectURL(file),optimized:false};
   }
   const scale=max/long,w=Math.max(1,Math.round(bitmap.width*scale)),h=Math.max(1,Math.round(bitmap.height*scale));
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   canvas.getContext('2d',{alpha:false}).drawImage(bitmap,0,0,w,h);
   bitmap.close?.();
   const blob=await canvasToBlob(canvas,'image/webp',.92);
   return {url:URL.createObjectURL(blob),optimized:true};
 }catch(err){
   console.warn('[OnlyEvent large crop preview]',err);
   return {url:URL.createObjectURL(file),optimized:false};
 }
}
if('requestIdleCallback' in window)requestIdleCallback(()=>getCropperModule(),{timeout:1800});
else setTimeout(()=>getCropperModule(),900);
function fitCropSelectionToImage(){
 const selection=activeCropper?.getCropperSelection?.(),cropperImage=activeCropper?.getCropperImage?.(),cropperCanvas=activeCropper?.getCropperCanvas?.();
 if(!selection||!cropperImage||!cropperCanvas||!cropContext)return;
 const canvasRect=cropperCanvas.getBoundingClientRect(),imageRect=cropperImage.getBoundingClientRect();
 const left=imageRect.left-canvasRect.left,top=imageRect.top-canvasRect.top,imgW=imageRect.width,imgH=imageRect.height;
 if(!imgW||!imgH)return;
 const pad=.88,ratio=cropContext.cfg.ratio;
 let width=imgW*pad,height=imgH*pad;
 if(cropContext.cfg.fixed&&Number.isFinite(ratio)&&ratio>0){
   if(width/height>ratio)width=height*ratio;else height=width/ratio;
   if(width>imgW*pad){width=imgW*pad;height=width/ratio}
   if(height>imgH*pad){height=imgH*pad;width=height*ratio}
 }
 const x=left+(imgW-width)/2,y=top+(imgH-height)/2;
 selection.$change?.(x,y,width,height,cropContext.cfg.fixed?ratio:NaN);
}
function keepCropSelectionInsideImage(event){
 const cropperCanvas=activeCropper?.getCropperCanvas?.(),cropperImage=activeCropper?.getCropperImage?.();
 if(!cropperCanvas||!cropperImage)return;
 const c=cropperCanvas.getBoundingClientRect(),r=cropperImage.getBoundingClientRect(),d=event.detail||{};
 const left=r.left-c.left,top=r.top-c.top,right=left+r.width,bottom=top+r.height,eps=.5;
 if(d.x<left-eps||d.y<top-eps||d.x+d.width>right+eps||d.y+d.height>bottom+eps)event.preventDefault();
}
let cropPreviewFrame=0,cropPreviewSeq=0;
function scheduleCropPreview(){
 cancelAnimationFrame(cropPreviewFrame);
 cropPreviewFrame=requestAnimationFrame(()=>renderCropPreview());
}
async function renderCropPreview(){
 const selection=activeCropper?.getCropperSelection?.(),canvas=$('#cropPreviewCanvas'),shell=$('#cropPreviewShell');
 if(!selection||!canvas||!shell||!cropContext)return;
 const seq=++cropPreviewSeq,ratio=Math.max(.1,Number(selection.width||1)/Math.max(1,Number(selection.height||1)));
 const maxW=Math.max(220,Math.min(420,shell.clientWidth||360));
 const width=Math.round(maxW),height=Math.max(120,Math.round(width/ratio));
 try{
   const cropped=await selection.$toCanvas({width,height});
   if(seq!==cropPreviewSeq||!cropContext)return;
   canvas.width=cropped.width;canvas.height=cropped.height;
   canvas.style.aspectRatio=cropped.width+' / '+cropped.height;
   const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(cropped,0,0);
 }catch(err){console.warn('[OnlyEvent crop preview]',err)}
}

async function openImageCropper(src,path,returnCollection='',returnIndex='',ownedUrl=''){
 const dlg=$('#imageCropDialog'),stage=$('#cropStage'),img=$('#cropImage'),cfg=imageSlotConfig(path);
 cropContext={path,returnCollection,returnIndex,cfg,src,ownedUrl};
 $('#cropSlotLabel').textContent=cfg.label;
 $('#cropRatioLabel').textContent=cfg.ratioLabel;
 img.src=src;
 dlg.showModal();
 send({type:'OE_CROP_ACTIVE',active:true});
 stage.classList.add('loading');
 try{
   const mod=await getCropperModule(),Cropper=mod.default||mod.Cropper;
   if(activeCropper?.destroy)activeCropper.destroy();
   stage.querySelectorAll('cropper-canvas').forEach(x=>x.remove());
   try{await img.decode()}catch{}
   const ratioAttr=Number.isFinite(cfg.ratio)&&cfg.ratio>0?' aspect-ratio="'+cfg.ratio+'" initial-aspect-ratio="'+cfg.ratio+'"':'';
   const handles='<cropper-handle action="n-resize"></cropper-handle><cropper-handle action="e-resize"></cropper-handle><cropper-handle action="s-resize"></cropper-handle><cropper-handle action="w-resize"></cropper-handle><cropper-handle action="ne-resize"></cropper-handle><cropper-handle action="nw-resize"></cropper-handle><cropper-handle action="se-resize"></cropper-handle><cropper-handle action="sw-resize"></cropper-handle>';
   const template='<cropper-canvas background><cropper-image initial-center-size="contain" rotatable></cropper-image><cropper-shade hidden></cropper-shade><cropper-selection initial-coverage="0.72"'+ratioAttr+' movable resizable outlined><cropper-grid role="grid" bordered covered></cropper-grid><cropper-crosshair centered></cropper-crosshair><cropper-handle action="move" theme-color="rgba(255,255,255,.32)"></cropper-handle>'+handles+'</cropper-selection></cropper-canvas>';
   activeCropper=new Cropper(img,{container:stage,template});
   const selection=activeCropper.getCropperSelection?.();
   if(selection){
     if(cfg.fixed&&Number.isFinite(cfg.ratio)){selection.aspectRatio=cfg.ratio;selection.initialAspectRatio=cfg.ratio}
     selection.addEventListener('change',e=>{keepCropSelectionInsideImage(e);if(!e.defaultPrevented)scheduleCropPreview()});
   }
   requestAnimationFrame(()=>{fitCropSelectionToImage();scheduleCropPreview()});
 }catch(err){
   console.error('[OnlyEvent cropper]',err);toast('裁剪器加载失败，可稍后重试');closeImageCropper();
 }finally{stage.classList.remove('loading')}
}
function closeImageCropper(){
 cancelAnimationFrame(cropPreviewFrame);cropPreviewSeq++;
 if(activeCropper?.destroy)activeCropper.destroy();
 activeCropper=null;
 const ownedUrl=cropContext?.ownedUrl||'';
 cropContext=null;
 if(ownedUrl)URL.revokeObjectURL(ownedUrl);
 send({type:'OE_CROP_ACTIVE',active:false});
 const dlg=$('#imageCropDialog');if(dlg.open)dlg.close();
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
   const blob=await canvasToBlob(canvas,'image/webp',.9);
   const data=await blobToDataUrl(blob);
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
$('#cropReset').onclick=()=>{fitCropSelectionToImage();scheduleCropPreview()};
$('#cropRotateLeft').onclick=()=>{activeCropper?.getCropperImage?.()?.$rotate?.('-90deg');requestAnimationFrame(()=>{fitCropSelectionToImage();scheduleCropPreview()})};

$('#imageInput').addEventListener('change',async e=>{
 const file=e.target.files?.[0],path=e.target.dataset.path;
 const returnCollection=e.target.dataset.returnCollection||'',returnIndex=e.target.dataset.returnIndex||'';
 e.target.value='';delete e.target.dataset.returnCollection;delete e.target.dataset.returnIndex;
 if(!file||!path)return;
 const cfg=imageSlotConfig(path);
 try{
   if(file.size>10*1024*1024)toast('正在准备超大图片…');
   const prepared=await prepareCropFile(file,cfg);
   openImageCropper(prepared.url,path,returnCollection,returnIndex,prepared.url);
 }catch(err){console.error('[OnlyEvent image input]',err);toast('图片读取失败')}
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
$('.page-nav')?.addEventListener('click',e=>{
 const b=e.target.closest('[data-page]');if(!b)return;
 setWorkspace('pages');setStudioPage(b.dataset.page);
});
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(JSON.stringify(state));state=JSON.parse(history.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory();syncContentCounts()};
$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(JSON.stringify(state));state=JSON.parse(future.pop());send({type:'OE_REPLACE_STATE',state});save();syncHistory();syncContentCounts()};
$('#publishBtn').onclick=()=>send({type:'OE_EXPORT_HTML'});
syncModuleControls();syncContentCounts();setWorkspace('pages');bindModuleControls();mountFrame();syncHistory();setStudioPage('home');