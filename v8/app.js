import {DEFAULT_TEMPLATE_ID,getTemplate} from '/v8/templates/registry.js?v=8.34.70';
import {cleanSlug,suggestSlug,isValidSlug,createSite,updateSite} from '/v8/publisher.js?v=8.34.70';
const $=s=>document.querySelector(s);
const canvas=$('#canvas'),inspector=$('#inspector'),saveState=$('#saveState'),toastEl=$('#toast');
const query=new URLSearchParams(location.search);
const requestedTemplateId=query.get('template')||DEFAULT_TEMPLATE_ID;
const activeTemplate=getTemplate(requestedTemplateId);
const projectId=query.get('project')||'default';
const initialProjectName=String(query.get('name')||'').trim();
const projectStorageSuffix=projectId==='default'?activeTemplate.id:(activeTemplate.id+':'+projectId);
const STORAGE=`onlyevent-studio-v8:${projectStorageSuffix}:iframe`,LEGACY_STORAGE='onlyevent-studio-v8:01:iframe',PUBLISH_STORAGE=`onlyevent-studio-publish:${projectStorageSuffix}:iframe`,ADMIN_PROJECTS_KEY='onlyevent-admin-projects-v1',ORIGIN=location.origin;
const GUIDE_OLD_PLACEHOLDER_TEXT={"traffic":"填写场馆地址、地铁 / 公交、自驾 / 网约车、入口位置。可以上传路线图或入口示意图。","admission":"填写入场时间、检票方式、排队、现场购票、二次入场、禁止夜排等说明。","facilities":"填写卫生间、更衣室、寄存、餐饮、医疗点、休息区、充电或无障碍信息。","cosplay":"填写更衣、摄影、道具尺寸、仿真武器、妆造和现场拍摄规则。","safety":"填写禁止携带物品、禁止行为、紧急情况处理和 Staff 联系方式。"};
const CUSTOM_PAGE_LAYOUTS={
 custom:'gallery',
 cosplay:'people',photographer:'people',
 officialShop:'product',freebie:'product',
 food:'place',
 itasha:'showcase',model:'showcase',prop:'showcase',brand:'showcase',
 oc:'gallery',illustration:'gallery',craft:'gallery',exhibition:'gallery',
 comic:'reading',novel:'reading',
 gameDemo:'activity',tabletop:'activity',cardGame:'activity',support:'activity'
};
let state=structuredClone(activeTemplate.defaults),preview=false,history=[],future=[],saveTimer=null,iframe=null,frameReady=false,focusCheckpointTaken=false,currentPage='home',publishIntent='site',publishRecord={};
let hasSavedProject=false;
try{const saved=localStorage.getItem(STORAGE)||(projectId==='default'&&activeTemplate.id===DEFAULT_TEMPLATE_ID?localStorage.getItem(LEGACY_STORAGE):null);if(saved){state={...state,...JSON.parse(saved)};hasSavedProject=true}}catch{}
if(!hasSavedProject&&initialProjectName)state.eventName=initialProjectName;
state.templateId=activeTemplate.id;
state.projectId=projectId;
if(!state.entryAnimation)state.entryAnimation=structuredClone(activeTemplate.defaults.entryAnimation||{enabled:true,showSkip:true,style:'ticket-tear',title:'',subtitle:'SPECIAL EVENT PASS',ticketLabel:'SPECIAL PASS',accent:'#ff5f91',duration:1800});
state.entryAnimation={...structuredClone(activeTemplate.defaults.entryAnimation||{}),...state.entryAnimation};
state.entryAnimation={
  imageMode:'linked',image:'',
  showLabel:true,labelText:'MEMORIAL TICKET',
  showTitle:true,titleText:'',
  showSubtitle:false,subtitleText:'',
  showDate:true,dateText:'',
  showTime:false,timeText:'',
  showLocation:true,locationText:'',
  showBarcode:true,showTicketNumber:true,ticketPrefix:'NO.',
  ...state.entryAnimation
};
delete state.entryAnimation.organizer;
delete state.entryAnimation.serial;
try{publishRecord=JSON.parse(localStorage.getItem(PUBLISH_STORAGE)||'{}')||{}}catch{publishRecord={}}
if(state.edition===undefined||state.edition==='首届')state.edition=activeTemplate.defaults.edition;
if(state.navigationUrl===undefined)state.navigationUrl=activeTemplate.defaults.navigationUrl;
if(state.modules?.activities===undefined&&state.modules?.stage!==undefined){state.modules.activities=state.modules.stage;delete state.modules.stage}
if(!state.guide||!Array.isArray(state.guide.items))state.guide=structuredClone(activeTemplate.defaults.guide);
const shouldSeedGuide=!state.guideSeedVersion;
state.guide.items=(state.guide.items||[]).map((x,i)=>{
 const preset=x.preset||activeTemplate.defaults.guide.items[i]?.preset||'custom';
 const defaultLabel={traffic:'ACCESS',admission:'ENTRY',facilities:'FACILITY',cosplay:'COSPLAY',safety:'SAFETY'}[preset]||'GUIDE';
 const item={image:'',label:defaultLabel,preset,...x};
 const oldText=GUIDE_OLD_PLACEHOLDER_TEXT[preset],currentText=String(item.text||'').trim();
 if(shouldSeedGuide&&(oldText&&currentText===oldText||!currentText)){
   const example=activeTemplate.defaults.guide.items.find(row=>row.preset===preset)?.text||'';
   if(example)item.text=example;
 }
 return item;
});
if(shouldSeedGuide)state.guideSeedVersion=1;
if(!Array.isArray(state.tickets))state.tickets=structuredClone(activeTemplate.defaults.tickets);
if(state.ticketUrl===undefined)state.ticketUrl=activeTemplate.defaults.ticketUrl;
if(state.ticketLinkLabel===undefined)state.ticketLinkLabel=activeTemplate.defaults.ticketLinkLabel;
if(!Array.isArray(state.ribbonItems)){
 const legacy=[state.ribbon1,state.ribbon2,state.ribbon3,state.ribbon4].map(x=>String(x||'').trim()).filter(Boolean);
 state.ribbonItems=(legacy.length?legacy:activeTemplate.defaults.ribbonItems.map(x=>x.text)).map((text,i)=>({id:'rb'+(i+1),text}));
}
delete state.ribbon1;delete state.ribbon2;delete state.ribbon3;delete state.ribbon4;
if(state.modules&&'passport' in state.modules)delete state.modules.passport;
if(!Array.isArray(state.participation))state.participation=structuredClone(activeTemplate.defaults.participation);
if(!Array.isArray(state.guests))state.guests=[];
if(!state.guestSeedVersion){
 // New projects already inherit template defaults before saved state is merged.
 // If an older saved project explicitly has guests: [], preserve that user choice.
 state.guestSeedVersion=1;
}
if(!state.guestTypeVersion){
 const oldNames=['星野 澪','林 夏','KUROHA','Aoi'];
 const isOldSample=(state.guests||[]).length===4&&(state.guests||[]).every((g,i)=>g?.name===oldNames[i]&&!g?.guestType);
 if(isOldSample)state.guests=structuredClone(activeTemplate.defaults.guests||[]);
 else state.guests=(state.guests||[]).map(g=>({guestType:g.guestType||'person',members:g.members||'',attendanceNote:g.attendanceNote||'',...g}));
 state.guestTypeVersion=1;
}

state.guests=(state.guests||[]).map(g=>{
 const legacyUrl=String(g.socialUrl||'').trim();
 const links=Array.isArray(g.socialLinks)?g.socialLinks.filter(x=>String(x?.url||'').trim()).map(x=>({id:x.id||uid('gl'),url:String(x.url||'').trim()})):(legacyUrl?[{id:uid('gl'),url:legacyUrl}]:[]);
 const next={...g,socialLinks:links};
 delete next.socialLabel;delete next.socialUrl;
 return next;
});
if(!Array.isArray(state.customPages))state.customPages=structuredClone(activeTemplate.defaults.customPages||[]);
state.customPages=(state.customPages||[]).map((p,i)=>{
 const legacyPreset={
   photoStudio:'custom',
   brandZone:'brand',
   ocExpo:'oc',
   craftExpo:'craft',
   experience:'gameDemo',
   themeStreet:'custom',
   checkin:'custom'
 }[p.preset]||p.preset||'custom';
 return {
   id:p.id||('cp'+(i+1)),
   preset:legacyPreset,
   title:p.title||'自定义页面',
   eyebrow:p.eyebrow||'SPECIAL',
   intro:p.intro||'',
   items:Array.isArray(p.items)?p.items:[],
   ...p,
   preset:legacyPreset,
   layout:p.layout||CUSTOM_PAGE_LAYOUTS[legacyPreset]||'gallery'
 };
});
if(!state.venueMap)state.venueMap=structuredClone(activeTemplate.defaults.venueMap);
if(!Array.isArray(state.venueMap.links))state.venueMap.links=structuredClone(activeTemplate.defaults.venueMap.links);
const FIRST_LEVEL_TARGETS=new Set(['booths','activities','guests','guide',...(state.customPages||[]).map(p=>'custom-'+p.id)]);
state.venueMap.links=(state.venueMap.links||[]).map((link,i)=>{
 const legacy={participation:'activities','schedule-home':'activities','map-home':'booths','guide-home':'guide',freewalk:'activities',itasha:'activities'}[link.target];
 const requested=legacy||link.target;
 let target=FIRST_LEVEL_TARGETS.has(requested)?requested:'activities';
 const label=String(link.label||'');
 if(!FIRST_LEVEL_TARGETS.has(requested)){
   if(/摊位/i.test(label))target='booths';
   else target='activities';
 }
 return {id:link.id||('ml'+(i+1)),label:label||'继续探索',target,itemType:link.itemType||'page',itemId:link.itemId||''};
}).filter(link=>!['痛车区','COS 区','COS区'].includes(String(link.label||'').trim()));
delete state.venueMap.points;
const ACTIVITY_PRESET_VERSION=2;
if(Number(state.activityPresetVersion||0)<ACTIVITY_PRESET_VERSION){
 if(!Array.isArray(state.participation))state.participation=[];
 if(!Array.isArray(state.featuredActivities))state.featuredActivities=[];
 state.schedule=Array.isArray(state.schedule)?state.schedule:[];
 state.activityPresetVersion=ACTIVITY_PRESET_VERSION;
 try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch{}
}
state.participation=(state.participation||[]).map(item=>{
 const category=item.category||({stage:'舞台',guest:'嘉宾互动',signing:'签售',cosplay:'COS',itasha:'痛车',stamp:'集章',photo:'合影',game:'互动游戏',free:'自由交流'}[item.preset]||'其他');
 const rawMeta=String(item.meta||'').trim(),parts=rawMeta.split(/\s*·\s*/).filter(Boolean);
 const inferredArea=!item.area&&parts.length>1?parts[0]:'';
 const area=item.area||inferredArea||'活动区域';
 const meta=rawMeta.startsWith(area+' · ')?rawMeta.slice(area.length+3).trim():(inferredArea?parts.slice(1).join(' · '):rawMeta);
 const inferredType=item.activityType||({guest:'guest',signing:'signing',stage:'general',game:'interactive',photo:'interactive',stamp:'venue',cosplay:'venue',itasha:'venue'}[item.preset]||'general');
 return {
   image:item.image||'',
   detail:item.detail||item.text||'',
   rules:item.rules||'',
   requirements:item.requirements||'',
   signingRules:item.signingRules||'',
   participationMode:item.participationMode||'自由参加',
   activityType:inferredType,
   activityLocation:item.activityLocation||area||'',
   availabilityNote:item.availabilityNote||'',
   setlist:item.setlist||'',
   ...item,
   category,
   area,
   meta,
   target:'activities',
   guestIds:Array.isArray(item.guestIds)?item.guestIds:[]
 };
});
if(!Array.isArray(state.featuredActivities)||state.featuredActivities.length!==3){
 const legacy=(state.participation||[]).filter(x=>x.featured).map(x=>x.id);
 const fallback=(state.participation||[]).map(x=>x.id);
 const picked=[...legacy,...fallback.filter(id=>!legacy.includes(id))].slice(0,3);
 state.featuredActivities=Array.from({length:3},(_,i)=>({id:'fa'+(i+1),participationId:picked[i]||'',image:''}));
}else{
 state.featuredActivities=state.featuredActivities.slice(0,3).map((x,i)=>({id:x?.id||('fa'+(i+1)),participationId:x?.participationId||'',image:x?.image||''}));
}
state.modules??={};
for(const k of ['booths','activities','guide','freewalk','itasha','ribbon','guests','community','sponsors']){
 if(state.modules[k]===undefined)state.modules[k]=activeTemplate.defaults.modules?.[k]!==false;
}
if(!state.venueMap)state.venueMap=structuredClone(activeTemplate.defaults.venueMap);
if(!Array.isArray(state.updates))state.updates=structuredClone(activeTemplate.defaults.updates);
state.updates=(state.updates||[]).map(item=>({...item,target:({passport:'activities','guide-home':'guide'}[item.target]||item.target||'top')}));
if(!Array.isArray(state.socialLinks))state.socialLinks=structuredClone(activeTemplate.defaults.socialLinks);
if(!Array.isArray(state.sponsors))state.sponsors=structuredClone(activeTemplate.defaults.sponsors);
if(state.sponsors.length===1){
 const x=state.sponsors[0]||{};
 if(String(x.name||'').trim()==='合作伙伴'&&String(x.level||'').trim()==='合作伙伴'&&!String(x.url||'').trim()&&!String(x.logo||'').trim())state.sponsors=[];
}
state.booths=(state.booths||[]).map(b=>{const next={id:b.id||uid('b'),no:b.no||'',name:b.name||'',logo:b.logo||'',type:b.type||'',intro:b.intro||'',...b,products:Array.isArray(b.products)?b.products:[]};next.products=(next.products||[]).map(p=>({id:p.id||uid('p'),name:p.name||'',tag:'',price:p.price||'',note:p.note||'',image:p.image||'',...p}));delete next.pointId;return next});
state.guests=(state.guests||[]).map(g=>({id:g.id||uid('g'),guestType:g.guestType||'person',name:g.name||'',role:g.role||'',members:g.members||'',attendanceNote:g.attendanceNote||'',works:g.works||'',intro:g.intro||'',image:g.image||'',socialLinks:Array.isArray(g.socialLinks)?g.socialLinks:[],...g}));
state.schedule=(state.schedule||[]).map(a=>{const next={id:a.id||uid('s'),day:a.day||'DAY 1',time:a.time||'',endTime:a.endTime||'',title:a.title||'',stage:a.stage||'',detail:a.detail||'',category:a.category||'',guestIds:Array.isArray(a.guestIds)?a.guestIds:[],participationId:a.participationId||'',registrationUrl:a.registrationUrl||'',...a};next.guestIds=Array.isArray(a.guestIds)?a.guestIds:[];next.participationId=a.participationId||'';delete next.locationId;return next});
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){toastEl.textContent=t;toastEl.classList.add('show');clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),1400)}
const publishDialog=$('#publishDialog'),publishSlug=$('#publishSlug'),publishPrimary=$('#publishPrimary'),publishStatus=$('#publishStatus'),publishResult=$('#publishResult'),publishUrl=$('#publishUrl');
function syncPublishButton(){
 const label=$('#publishBtnLabel');if(label)label.textContent=publishRecord?.siteId?'更新网站':'发布网站';
}
function savePublishRecord(next){
 publishRecord={...publishRecord,...next};localStorage.setItem(PUBLISH_STORAGE,JSON.stringify(publishRecord));syncPublishButton();
}
function renderPublishDialog(){
 const hasSite=!!publishRecord?.siteId,slug=cleanSlug(publishRecord?.slug||suggestSlug(state.eventName,state.date));
 publishSlug.value=slug;publishSlug.readOnly=hasSite;
 $('#publishHost').textContent='.onlyevent.cn';
 publishPrimary.textContent=hasSite?'更新网站':'发布网站';
 publishStatus.textContent=hasSite?'已发布，可将最新修改同步到线上网站。':'设置网站地址后即可发布。';
 publishResult.hidden=!publishRecord?.url;
 publishUrl.textContent=publishRecord?.url||'';
 $('#publishOpen').disabled=!publishRecord?.url;$('#publishCopy').disabled=!publishRecord?.url;
}
function openPublishDialog(){
 renderPublishDialog();publishDialog.showModal();if(!publishRecord?.siteId)setTimeout(()=>publishSlug.select(),0);
}
function setPublishBusy(busy,text=''){
 publishPrimary.disabled=busy;$('#publishDownload').disabled=busy;publishSlug.disabled=busy||!!publishRecord?.siteId;
 if(text)publishStatus.textContent=text;
}
async function publishGeneratedHtml(html){
 const slug=cleanSlug(publishSlug.value);
 if(!isValidSlug(slug)){setPublishBusy(false,'地址需为 3–63 位小写字母、数字或连字符。');publishSlug.focus();return}
 setPublishBusy(true,publishRecord?.siteId?'正在更新网站…':'正在发布网站…');
 try{
   const payload={html,title:state.eventName||'OnlyEvent',slug,templateId:state.templateId||activeTemplate.id};
   const result=publishRecord?.siteId
     ?await updateSite({...payload,siteId:publishRecord.siteId,editToken:publishRecord.editToken})
     :await createSite(payload);
   if(!result.siteId)throw new Error('发布服务未返回站点 ID');
   if(!publishRecord?.siteId&&!result.editToken)throw new Error('发布服务未返回编辑凭证');
   const publishedUrl=result.url||('https://'+slug+'.onlyevent.cn');
   savePublishRecord({siteId:result.siteId,editToken:result.editToken||publishRecord.editToken,slug:result.slug||slug,url:publishedUrl,publishedAt:new Date().toISOString()});
   syncAdminProject({siteUrl:publishedUrl,status:'published'});
   renderPublishDialog();publishStatus.textContent='网站已上线';toast('网站已发布');
 }catch(error){
   publishStatus.textContent=error?.message||'发布失败，请稍后重试';
 }finally{setPublishBusy(false)}
}

function syncStudioIdentity(){const t=document.querySelector('#workspaceTemplateName');if(t)t.textContent=activeTemplate.name.replace(/^\d+\s*·\s*/,'');const p=document.querySelector('#projectTemplateName');if(p)p.textContent=activeTemplate.name.replace(/^\d+\s*·\s*/,'');const e=document.querySelector('#projectEventName');if(e)e.textContent=state.eventName||'未命名活动'}
function syncAdminProject(extra={}){
 if(projectId==='default')return;
 let rows=[];try{rows=JSON.parse(localStorage.getItem(ADMIN_PROJECTS_KEY)||'[]')||[]}catch{}
 const i=rows.findIndex(p=>p.id===projectId),base=i>=0?rows[i]:{id:projectId,templateId:activeTemplate.id};
 const next={...base,name:state.eventName||base.name||'未命名活动',templateId:activeTemplate.id,updatedAt:new Date().toISOString(),...extra};
 if(i>=0)rows[i]=next;else rows.push(next);
 localStorage.setItem(ADMIN_PROJECTS_KEY,JSON.stringify(rows));
}
function save(){saveState.textContent='保存中…';syncContentCounts();syncStudioIdentity();clearTimeout(saveTimer);saveTimer=setTimeout(()=>{localStorage.setItem(STORAGE,JSON.stringify(state));syncAdminProject();saveState.textContent='已保存'},180)}
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
 if(collection==='participation')src=item.image||'';
 if(collection==='featuredActivities')src=item.image||'';
 if(collection==='socialLinks')src=item.image||'';
 if(collection==='sponsors')src=item.logo||'';
 const fallback={ribbonItems:'告',tickets:'票',featuredActivities:'精',explore:'↗',participation:'参',booths:'摊',schedule:'时',guests:'嘉',guide:'指',updates:'更',socialLinks:'社',sponsors:'赞'}[collection]||'•';
 return '<span class="sidebar-content-thumb '+(src?'has-image':'')+'">'+(src?'<img src="'+esc(src)+'" alt="">':fallback)+'</span>';
}

const moduleLabels={booths:'摊位',activities:'活动',guests:'嘉宾',guide:'观展指南'};
function customPageKey(id){return 'custom-'+id}
function customPageByKey(key){return (state.customPages||[]).find(p=>customPageKey(p.id)===key)}
function pageLabel(key){return moduleLabels[key]||customPageByKey(key)?.title||(key==='home'?'首页':key==='animation'?'动画页面':'页面')}
function customPageIndex(id){return (state.customPages||[]).findIndex(p=>String(p.id)===String(id))}

const contentManagerMeta={
 ribbonItems:{title:'滚动公告',empty:'还没有滚动公告',item:(x,i)=>[x.text||('公告 '+(i+1)),'']},
 explore:{title:'继续探索',empty:'还没有探索入口',item:(x,i)=>[x.label||('入口 '+(i+1)),pageLabel(x.target)]},
 tickets:{title:'票务',empty:'还没有票种',item:(x,i)=>[x.name||('票种 '+(i+1)),x.price||'']},
 featuredActivities:{title:'活动精选',empty:'暂无精选活动',item:(x,i)=>{const a=(state.participation||[]).find(v=>v.id===x.participationId);return ['精选 '+String(i+1).padStart(2,'0'),a?.title||'未选择活动']}},
 booths:{title:'摊位',empty:'还没有摊位',item:(x,i)=>[(x.no?x.no+' · ':'')+(x.name||('摊位 '+(i+1))),String((x.products||[]).length)+' 个制品']},
 participation:{title:'活动',empty:'还没有活动',item:(x,i)=>[x.title||('活动 '+(i+1)),x.area||x.meta||'']},
 schedule:{title:'活动日程',empty:'还没有日程',item:(x,i)=>[((x.day?x.day+' · ':'')+(x.time?x.time+' · ':'')+(x.title||('日程 '+(i+1)))),x.stage||'']},
 guests:{title:'嘉宾',empty:'还没有嘉宾',item:(x,i)=>[x.name||('嘉宾 '+(i+1)),x.role||'']},
 guide:{title:'观展指南',empty:'还没有指南内容',item:(x,i)=>[x.title||('指南 '+(i+1)),(x.text||'').slice(0,24)]},
 updates:{title:'重要更新',empty:'还没有重要更新',item:(x,i)=>[x.title||('更新 '+(i+1)),x.date||'']},
 socialLinks:{title:'社群入口',empty:'还没有社群入口',item:(x,i)=>[x.label||('入口 '+(i+1)),x.url?'已设置链接':'未设置链接']},
 sponsors:{title:'赞助支持',empty:'还没有赞助信息',item:(x,i)=>[x.name||('赞助 '+(i+1)),x.level||'']}
};

const GUIDE_PRESETS={
 traffic:{preset:'traffic',title:'交通到达',label:'ACCESS',text:'',image:''},
 admission:{preset:'admission',title:'入场须知',label:'ENTRY',text:''},
 facilities:{preset:'facilities',title:'场馆设施',label:'FACILITY',text:''},
 cosplay:{preset:'cosplay',title:'COS / 道具规则',label:'COSPLAY',text:''},
 safety:{preset:'safety',title:'安全与禁止事项',label:'SAFETY',text:''}
};
const PARTICIPATION_PRESETS={
 stage:{preset:'stage',activityType:'general',title:'舞台活动',meta:'主舞台 · 时间待定',text:'主舞台节目、Talk、表演或特别企划。',detail:'这里填写舞台活动的完整介绍，例如节目内容、出演阵容、流程亮点和观众可以参与的环节。',participationMode:'现场自由观看',requirements:'如有座位区、排队、年龄或入场限制，请在这里填写。',rules:'请听从现场工作人员引导；具体开始时间以当天现场为准。',target:'activities',url:'',guestIds:[]},
 guest:{preset:'guest',activityType:'guest',title:'嘉宾见面会',meta:'主舞台 · 时间待定',text:'嘉宾见面、访谈、Q&A 与现场互动。',detail:'这里填写嘉宾互动的主题、访谈内容、现场问答或特别环节。',participationMode:'按现场规则入场',requirements:'如设置内场席位、号码牌或提问征集，可在这里说明。',rules:'请尊重嘉宾与现场秩序；拍照、录像及互动方式以主办方现场规则为准。',target:'activities',url:'',guestIds:[]},
 signing:{preset:'signing',activityType:'signing',title:'嘉宾签售',meta:'签售区 · 时间待定',text:'嘉宾签名、签绘、交流或合影活动。',detail:'这里填写签售对象、参与资格、可签物品、互动时长以及现场流程。',participationMode:'凭签售资格按号码牌顺序参加',requirements:'请提前准备需要签名的官方周边或指定物品；如需购买资格商品请写明。',rules:'请按工作人员叫号排队，禁止插队；拍照、录像、握手、合影和礼物接收规则以现场公告为准。',signingRules:'示例：每人限签 2 件；To 签内容请提前准备；不签私物；签售过程中不安排合影。',target:'activities',url:'',guestIds:[]},
 live:{preset:'live',activityType:'live',title:'乐队Live',meta:'主舞台 · 时间待定',text:'ACG 乐队、主题 Live 或特别音乐舞台。',detail:'这里填写乐队Live的出演介绍、演出主题和现场亮点。',participationMode:'现场自由观看',requirements:'如有前排区、站席、应援棒或禁止携带物品要求，请在这里填写。',rules:'请勿冲撞舞台或影响周围观众；摄影、录像及应援方式以现场规则为准。',setlist:'Opening Theme\nCharacter Song\nSpecial Medley',target:'activities',url:'',guestIds:[]},
 randomDance:{preset:'randomDance',activityType:'interactive',title:'随机舞蹈',meta:'随机舞蹈区 · 时间待定',text:'随机舞蹈、宅舞自由舞台或主题舞蹈活动。',detail:'这里填写活动形式、歌曲范围、领舞安排和每轮流程。',participationMode:'现场自由参加',requirements:'建议提前查看公开歌单；请在指定区域内参与，注意与其他参与者保持安全距离。',rules:'禁止危险动作、推搡和占用通道；歌曲与活动轮次以现场实际播放为准。',target:'activities',url:'',guestIds:[]},
 stamp:{preset:'stamp',activityType:'venue',title:'集章打卡',meta:'活动区域 · 全天',text:'场内集章、打卡点或完成任务兑换奖励。',detail:'这里填写需要前往的打卡点、任务内容、集章数量以及完成后的兑换方式。',participationMode:'领取集章卡后自由参加',requirements:'请保管好集章卡；部分点位可能需要完成指定互动后才能盖章。',rules:'每人每个点位通常限盖一次；奖品数量有限，兑完即止。',activityLocation:'场内各打卡点',availabilityNote:'开展期间开放',target:'activities',url:'',guestIds:[]},
 game:{preset:'game',activityType:'interactive',title:'互动游戏',meta:'互动区 · 时间待定',text:'现场小游戏、问答、抽选或观众挑战。',detail:'这里填写游戏玩法、参与人数、每轮时间、奖励内容和主持流程。',participationMode:'现场报名后排队参加',requirements:'如有年龄、人数、组队、道具或答题要求，请在这里填写。',rules:'请按照工作人员安排依次参与；同一项目重复参与次数可由主办方自行限制。',target:'activities',url:'',guestIds:[]},
 photo:{preset:'photo',activityType:'interactive',title:'主题合影',meta:'集合区域 · 时间待定',text:'角色、嘉宾或同好主题集合拍摄。',detail:'这里填写集合主题、参与角色范围、拍摄流程以及摄影安排。',participationMode:'在指定时间到集合点自由参加',requirements:'请提前到达集合点并听从站位安排；大型道具需确保安全。',rules:'请勿遮挡通道；拍摄结束后及时疏散，返图与公开发布规则由主办方自行说明。',target:'activities',url:'',guestIds:[]},
 cosplay:{preset:'cosplay',activityType:'venue',title:'COS活动',meta:'COS 区 · 全天',text:'COS 自由舞台、摄影区或角色集合活动。',detail:'这里填写区域用途、自由舞台报名方式、摄影规则或角色集合安排。',participationMode:'开放区域自由参与',requirements:'大型道具、摄影灯具和三脚架请遵守场馆及主办方尺寸与安全要求。',rules:'尊重 Coser 拍摄意愿；未经同意请勿近距离拍摄或触碰服装道具。',activityLocation:'COS摄影区',availabilityNote:'开展期间开放',target:'activities',url:'',guestIds:[]},
 itasha:{preset:'itasha',activityType:'venue',title:'痛车展示',meta:'展示区 · 全天',text:'痛车、模型、应援物或大型主题展示。',detail:'这里填写展示主题、参展阵容、车辆与展品介绍和推荐打卡内容。',participationMode:'开放区域自由参观',requirements:'请在围栏或划定区域外观看；如开放合影请按现场指引进行。',rules:'禁止触碰、倚靠车辆或展品；请勿阻塞展示区通道。',activityLocation:'主题展示区',availabilityNote:'开展期间开放',target:'activities',url:'',guestIds:[]},
 support:{preset:'support',activityType:'venue',title:'应援专区',meta:'主题专区 · 全天',text:'角色应援、纪念墙、留言区或主题互动专区。',detail:'这里填写应援主题、现场布置、留言、打卡方式与展示内容。',participationMode:'开放区域自由参与',requirements:'如需自带应援物、填写留言卡或完成指定任务，请在这里说明。',rules:'请爱护现场布置与公共物料；禁止张贴未经主办允许的内容。',activityLocation:'主题专区',availabilityNote:'开展期间开放',target:'activities',url:'',guestIds:[]}
};

const CUSTOM_PAGE_PRESETS={
 custom:{title:'自定义展示页',eyebrow:'SPECIAL',intro:'用于其他信息量较大、需要独立浏览的专题内容。',itemTitle:'内容',titleLabel:'标题',metaLabel:'副标题或位置',textLabel:'介绍',ratio:1.333333},

 cosplay:{title:'COS自由行',eyebrow:'COSPLAY',intro:'展示参加自由行的 Coser 阵容、角色、作品和出席信息。',itemTitle:'Coser',titleLabel:'CN或昵称',metaLabel:'角色与作品',textLabel:'简介与出席信息',ratio:.8},
 photographer:{title:'摄影师阵容',eyebrow:'PHOTOGRAPHER',intro:'展示摄影师阵容、拍摄风格、约拍说明和出席时段。',itemTitle:'摄影师',titleLabel:'CN或昵称',metaLabel:'拍摄风格',textLabel:'简介与约拍信息',ratio:.8},
 itasha:{title:'痛车展示',eyebrow:'ITASHA',intro:'集中展示参加活动的痛车、车主、主题和车辆信息。',itemTitle:'车辆',titleLabel:'车主或展示名',metaLabel:'IP与角色主题',textLabel:'车辆介绍与展示信息',ratio:1.5},

 food:{title:'餐饮指南',eyebrow:'FOOD & DRINK',intro:'展示场内或合作餐饮、菜单、价格、位置和推荐内容。',itemTitle:'餐饮',titleLabel:'店铺或餐饮名',metaLabel:'位置与价格',textLabel:'介绍与推荐内容',ratio:1.333333},
 officialShop:{title:'官方物贩',eyebrow:'OFFICIAL SHOP',intro:'展示官方周边、限定商品、售价、销售位置和购买限制。',itemTitle:'商品',titleLabel:'商品名称',metaLabel:'价格与销售位置',textLabel:'商品说明与购买限制',ratio:1},
 brand:{title:'品牌展商',eyebrow:'BRAND',intro:'集中展示合作品牌、企业展商、展位信息和现场展示内容。',itemTitle:'展商',titleLabel:'品牌或展商名',metaLabel:'展位与合作内容',textLabel:'品牌介绍与现场展示',ratio:1.333333},

 oc:{title:'原创OC展',eyebrow:'ORIGINAL CHARACTER',intro:'集中展示原创角色设定、世界观、立绘、设定图和创作者信息。',itemTitle:'OC',titleLabel:'角色或作品名',metaLabel:'作者与作品类型',textLabel:'角色设定与作品介绍',ratio:.8},
 illustration:{title:'插画作品展',eyebrow:'ILLUSTRATION',intro:'展示插画、原画、视觉设计等平面作品与作者信息。',itemTitle:'作品',titleLabel:'作品名称',metaLabel:'作者与类型',textLabel:'作品介绍与创作说明',ratio:1.333333},
 comic:{title:'漫画作品展',eyebrow:'COMIC',intro:'展示漫画、短篇、四格、连载作品和作者信息。',itemTitle:'作品',titleLabel:'漫画名称',metaLabel:'作者与类型',textLabel:'作品简介与阅读说明',ratio:.75},
 novel:{title:'小说作品展',eyebrow:'NOVEL',intro:'展示同人小说、原创小说、短篇文本和作者信息。',itemTitle:'作品',titleLabel:'作品名称',metaLabel:'作者与题材',textLabel:'作品简介与阅读说明',ratio:.75},
 craft:{title:'手作展示',eyebrow:'HANDCRAFT',intro:'展示饰品、布艺、黏土、手工制品等实体创作。',itemTitle:'作品',titleLabel:'作品名称',metaLabel:'作者与材料',textLabel:'制作介绍与展示信息',ratio:1},
 model:{title:'模型展示',eyebrow:'MODEL',intro:'展示模型、GK、手办改造、场景模型等实体作品。',itemTitle:'模型',titleLabel:'作品名称',metaLabel:'作者与类型',textLabel:'制作介绍与展示信息',ratio:1.333333},
 prop:{title:'道具展示',eyebrow:'PROP',intro:'展示武器道具、盔甲、服装道具和大型制作物。',itemTitle:'道具',titleLabel:'作品名称',metaLabel:'作者与作品来源',textLabel:'制作介绍与展示说明',ratio:1.5},

 gameDemo:{title:'游戏试玩',eyebrow:'GAME DEMO',intro:'展示电子游戏、独立游戏和现场试玩项目。',itemTitle:'游戏',titleLabel:'游戏名称',metaLabel:'类型与试玩位置',textLabel:'玩法介绍与试玩说明',ratio:1.777778},
 tabletop:{title:'桌游专区',eyebrow:'TABLETOP',intro:'展示桌游项目、桌台安排、参与人数和预约信息。',itemTitle:'桌游',titleLabel:'游戏名称',metaLabel:'位置与人数',textLabel:'规则与参与说明',ratio:1.333333},
 cardGame:{title:'卡牌专区',eyebrow:'CARD GAME',intro:'展示集换式卡牌、牌桌活动、赛制和参与说明。',itemTitle:'卡牌项目',titleLabel:'项目名称',metaLabel:'位置与赛制',textLabel:'规则与参与说明',ratio:1.333333},

 freebie:{title:'无料交换',eyebrow:'FREEBIE',intro:'展示无料、交换物、领取条件、交换规则和作者信息。',itemTitle:'无料或交换物',titleLabel:'名称',metaLabel:'作者与领取位置',textLabel:'领取条件与交换说明',ratio:1},
 support:{title:'应援企划',eyebrow:'FAN PROJECT',intro:'用于生日应援、角色纪念、痛楼、留言墙等内容量较大的同好企划。',itemTitle:'企划',titleLabel:'企划名称',metaLabel:'角色与展示位置',textLabel:'企划介绍与参与方式',ratio:.8},
 exhibition:{title:'主题展览',eyebrow:'EXHIBITION',intro:'用于原画展、设定展、历史回顾、纪念展等独立主题内容。',itemTitle:'展项',titleLabel:'展项名称',metaLabel:'主题与位置',textLabel:'展项介绍与展示说明',ratio:1.333333}
};

const CUSTOM_PAGE_STARTERS={
 custom:[
  ['专题内容 01','时间 · 地点','核心介绍 · 参与方式 · 注意事项'],
  ['专题内容 02','区域 · 时段','补充内容 · 现场信息 · 关联说明'],
  ['专题内容 03','状态 · 标签','扩展介绍 · 外部链接 · 更新信息']
 ],
 cosplay:[
  ['参展 Coser 01','角色名 · 作品名','出席时段 · 集合信息 · 社交平台说明'],
  ['参展 Coser 02','角色名 · 作品名','出席时段 · 集合信息 · 摄影说明'],
  ['参展 Coser 03','角色名 · 作品名','出席时段 · 互动信息 · 注意事项']
 ],
 photographer:[
  ['摄影师 01','人像 · 场照','出席时段 · 约拍方式 · 返图说明'],
  ['摄影师 02','舞台 · 抓拍','活动区域 · 拍摄偏好 · 联系方式'],
  ['摄影师 03','胶片 · 氛围','出席时间 · 预约方式 · 作品平台']
 ],
 itasha:[
  ['痛车 01','作品名 · 角色名','车型 · 车主 · 展示时段 · 展示区域'],
  ['痛车 02','作品名 · 角色名','车型 · 改装主题 · 展示信息'],
  ['痛车 03','作品名 · 角色名','车辆亮点 · 拍摄说明 · 现场位置']
 ],
 food:[
  ['推荐餐饮 01','场馆内 · ¥--','主打餐品 · 营业时间 · 位置说明'],
  ['推荐餐饮 02','场馆周边 · ¥--','推荐菜单 · 距离 · 营业时段'],
  ['补给点 03','饮品 · 轻食','价格区间 · 排队提示 · 位置说明']
 ],
 officialShop:[
  ['限定商品 01','¥-- · 官方物贩区','规格 · 限购数量 · 销售时段'],
  ['限定商品 02','¥-- · 官方物贩区','商品内容 · 购买限制 · 库存提示'],
  ['会场特典 03','消费条件 · 领取处','领取条件 · 数量限制 · 发放时间']
 ],
 brand:[
  ['品牌展商 01','展位号待填 · 合作内容','品牌简介 · 现场展示 · 互动内容'],
  ['品牌展商 02','展位号待填 · 展示主题','产品体验 · 领取活动 · 现场说明'],
  ['品牌展商 03','展位号待填 · 联动企划','合作信息 · 展示内容 · 外部平台']
 ],
 oc:[
  ['原创角色 01','创作者 · 世界观','角色设定 · 性格 · 背景故事'],
  ['原创角色 02','创作者 · 世界观','角色关系 · 设定亮点 · 展示内容'],
  ['原创角色 03','创作者 · 企划名','视觉设定 · 创作说明 · 作者信息']
 ],
 illustration:[
  ['插画作品 01','作者 · 原创 / 同人','作品主题 · 创作说明 · 展示信息'],
  ['插画作品 02','作者 · 系列名','画面主题 · 创作时间 · 作者平台'],
  ['插画作品 03','作者 · 作品类型','作品简介 · 使用媒介 · 展示说明']
 ],
 comic:[
  ['漫画作品 01','作者 · 短篇 / 连载','作品简介 · 话数 · 阅读说明'],
  ['漫画作品 02','作者 · 四格 / 故事','题材 · 角色 · 展示范围'],
  ['漫画作品 03','作者 · 系列名','故事梗概 · 更新状态 · 阅读入口']
 ],
 novel:[
  ['小说作品 01','作者 · 题材','作品简介 · 篇幅 · 阅读说明'],
  ['小说作品 02','作者 · 短篇 / 连载','题材标签 · 角色 · 更新状态'],
  ['小说作品 03','作者 · 系列名','故事梗概 · 篇幅 · 阅读入口']
 ],
 craft:[
  ['手作作品 01','作者 · 材料','制作工艺 · 尺寸 · 展示说明'],
  ['手作作品 02','作者 · 材料','制作时间 · 作品亮点 · 现场信息'],
  ['手作作品 03','作者 · 系列名','材质 · 工艺 · 创作说明']
 ],
 model:[
  ['模型作品 01','作者 · GK / 改造','比例 · 材料 · 制作说明'],
  ['模型作品 02','作者 · 场景模型','比例 · 制作周期 · 展示亮点'],
  ['模型作品 03','作者 · 手办改造','原型 · 涂装 · 制作说明']
 ],
 prop:[
  ['道具作品 01','作者 · 作品来源','尺寸 · 材料 · 制作说明'],
  ['道具作品 02','作者 · 角色来源','结构 · 工艺 · 展示注意事项'],
  ['道具作品 03','作者 · 大型制作','材料 · 制作周期 · 展示方式']
 ],
 gameDemo:[
  ['试玩项目 01','独立游戏 · 试玩区','平台 · 核心玩法 · 单次试玩时长'],
  ['试玩项目 02','动作 / 解谜 · 试玩区','操作方式 · 排队提示 · 试玩内容'],
  ['试玩项目 03','多人游戏 · 试玩区','支持人数 · 试玩规则 · 开放时段']
 ],
 tabletop:[
  ['桌游项目 01','4 人 · 60 分钟','适合人数 · 单局时长 · 报名方式'],
  ['桌游项目 02','2–6 人 · 桌游区','规则难度 · 开桌时间 · 参与说明'],
  ['桌游项目 03','组队体验 · 桌游区','推荐人数 · 游戏时长 · 预约信息']
 ],
 cardGame:[
  ['卡牌活动 01','对战区 · 赛制待填','报名方式 · 轮次 · 奖励说明'],
  ['卡牌活动 02','自由对战 · 卡牌区','开放时段 · 卡组要求 · 参与规则'],
  ['卡牌活动 03','教学体验 · 卡牌区','参与对象 · 教学时段 · 现场规则']
 ],
 freebie:[
  ['无料 01','作者 · 领取点','数量 · 领取条件 · 发放时段'],
  ['交换物 02','作者 · 交换区','交换条件 · 数量 · 注意事项'],
  ['无料 03','作者 · 展位 / 区域','领取规则 · 限量说明 · 补充信息']
 ],
 support:[
  ['应援企划 01','角色名 · 展示区','企划主题 · 参与方式 · 开放时段'],
  ['留言企划 02','角色名 · 留言区','参与规则 · 留言方式 · 展示说明'],
  ['纪念企划 03','纪念主题 · 展示区','企划内容 · 互动方式 · 注意事项']
 ],
 exhibition:[
  ['展项 01','主题 · 展区','展项介绍 · 展示内容 · 观看说明'],
  ['展项 02','主题 · 展区','历史背景 · 作品信息 · 展示重点'],
  ['展项 03','主题 · 展区','关联内容 · 展示方式 · 观看提示']
 ]
};
function buildCustomPageStarterItems(presetKey){
 const rows=CUSTOM_PAGE_STARTERS[presetKey]||CUSTOM_PAGE_STARTERS.custom;
 return rows.map(([title,meta,text])=>({id:uid('ci'),title,meta,text,image:'',url:''}));
}
const PAGE_CONTENT_CONFIG={
 animation:[{tool:'entryAnimation',label:'入场动画'}],
 home:[
   {tool:'basic',label:'基本信息'},
   {tool:'hero',label:'主视觉'},
   {collection:'ribbonItems',label:'滚动公告'},
   {collection:'tickets',label:'票务'},
   {tool:'map',label:'场地图'},
   {collection:'featuredActivities',label:'活动精选'},
   {collection:'explore',label:'继续探索'},
   {collection:'updates',label:'重要更新'},
   {collection:'socialLinks',label:'社群'},
   {collection:'sponsors',label:'赞助'}
 ],
 booths:[{collection:'booths',label:'摊位与制品'}],
 activities:[{collection:'schedule',label:'日程'},{collection:'participation',label:'活动详情'}],
 guests:[{collection:'guests',label:'嘉宾'}],
 guide:[{collection:'guide',label:'指南内容'}]
};
const COLLECTION_PAGE={
 ribbonItems:'home',tickets:'home',featuredActivities:'home',explore:'home',updates:'home',socialLinks:'home',sponsors:'home',
 booths:'booths',participation:'activities',schedule:'activities',guests:'guests',guide:'guide'
};

function renderCustomPageRows(){
 const box=$('#customPageRows');if(!box)return;
 const pages=state.customPages||[];
 box.innerHTML=pages.map((page,index)=>{
   const key=customPageKey(page.id),preset=CUSTOM_PAGE_PRESETS[page.preset]||CUSTOM_PAGE_PRESETS.custom;
   return '<div class="page-tree-row custom-page-row" data-page-row="'+esc(key)+'"><button data-page="'+esc(key)+'" type="button"><span class="nav-icon">◇</span><span>'+esc(page.title||preset.title)+'</span><small class="custom-page-type">'+esc(preset.title)+'</small></button><div class="custom-page-row-tools"><button type="button" data-move-custom-page="'+esc(page.id)+'" data-dir="-1" '+(index===0?'disabled':'')+' title="上移" aria-label="上移 '+esc(page.title||preset.title)+'">↑</button><button type="button" data-move-custom-page="'+esc(page.id)+'" data-dir="1" '+(index===pages.length-1?'disabled':'')+' title="下移" aria-label="下移 '+esc(page.title||preset.title)+'">↓</button><button type="button" class="custom-page-row-delete" data-delete-custom-page-row="'+esc(page.id)+'" title="删除页面" aria-label="删除 '+esc(page.title||preset.title)+'">×</button></div></div>';
 }).join('');
 box.querySelectorAll('[data-move-custom-page]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();moveCustomPage(btn.dataset.moveCustomPage,Number(btn.dataset.dir))}));
 box.querySelectorAll('[data-delete-custom-page-row]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();removeCustomPage(btn.dataset.deleteCustomPageRow)}));
}
function openCustomPageCreator(){
 setInspector('创建页面','选择页面预设',
   '<div class="custom-page-preset-grid">'+Object.entries(CUSTOM_PAGE_PRESETS).map(([key,p])=>
     '<button type="button" class="custom-page-preset" data-custom-page-preset="'+key+'"><b>'+esc(p.title)+'</b><small>'+esc(p.intro)+'</small></button>'
   ).join('')+'</div><p class="inspector-note">创建后会作为一级页面出现在游客导航，也可以被「继续探索」直接关联。</p>');
 inspector.querySelectorAll('[data-custom-page-preset]').forEach(btn=>btn.addEventListener('click',()=>createCustomPage(btn.dataset.customPagePreset)));
}
function moveCustomPage(pageId,dir){
 const pages=state.customPages||[],index=customPageIndex(pageId),next=index+Number(dir||0);
 if(index<0||next<0||next>=pages.length||index===next)return;
 checkpoint();[pages[index],pages[next]]=[pages[next],pages[index]];
 save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});
 syncStudioPageUI(currentPage,{openContent:false});
}
function createCustomPage(presetKey){
 const preset=CUSTOM_PAGE_PRESETS[presetKey]||CUSTOM_PAGE_PRESETS.custom;
 checkpoint();
 const page={id:uid('cp'),preset:presetKey,layout:CUSTOM_PAGE_LAYOUTS[presetKey]||'gallery',title:preset.title,eyebrow:preset.eyebrow,intro:preset.intro,ratio:preset.ratio||1.333333,items:buildCustomPageStarterItems(presetKey)};
 state.customPages??=[];state.customPages.push(page);save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});
 setStudioPage(customPageKey(page.id));
}
function customPageFieldLabels(page){
 const preset=CUSTOM_PAGE_PRESETS[page?.preset]||CUSTOM_PAGE_PRESETS.custom;
 return preset;
}
function removeCustomPage(pageId){
 const i=customPageIndex(pageId),page=state.customPages?.[i];if(i<0||!page)return;
 checkpoint();
 const key=customPageKey(page.id);
 state.customPages.splice(i,1);
 (state.venueMap?.links||[]).forEach(link=>{if(link.target===key){link.target='activities';link.itemType='page';link.itemId=''}});
 save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});syncContentCounts();
 if(currentPage===key)setStudioPage('home');
 toast('页面已删除，可使用撤销恢复');
}
function openCustomPageSettings(pageId){
 const i=customPageIndex(pageId),page=state.customPages?.[i];if(i<0||!page)return;
 setInspector('专题页面',page.title,
   '<div class="item-fields">'+
   '<label><span>页面标题</span><input data-custom-page-field="title" value="'+esc(page.title||'')+'"></label>'+
   '<label><span>英文小标题</span><input data-custom-page-field="eyebrow" value="'+esc(page.eyebrow||'SPECIAL')+'"></label>'+
   '<label><span>页面介绍</span><textarea data-custom-page-field="intro" rows="4">'+esc(page.intro||'')+'</textarea></label>'+
   '</div><div class="reference-panel"><b>页面预设</b><p class="inspector-note">'+esc((CUSTOM_PAGE_PRESETS[page.preset]||CUSTOM_PAGE_PRESETS.custom).title)+' · 页面已按该内容类型配置展示结构。</p></div>'+
   '<div class="custom-page-settings-actions"><button type="button" class="danger ghost" data-delete-custom-page>删除此页面</button></div>');
 inspector.querySelectorAll('[data-custom-page-field]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{
     if(!started){checkpoint();started=true}
     page[e.target.dataset.customPageField]=e.target.value;save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});
     const title=document.querySelector('.canvas-title b');if(title&&currentPage===customPageKey(page.id))title.textContent=page.title||'专题页面';
   });
 });
 inspector.querySelector('[data-delete-custom-page]')?.addEventListener('click',()=>removeCustomPage(page.id));
}
function openCustomPageItemsManager(pageId,selectedIndex=-1){
 const page=state.customPages?.[customPageIndex(pageId)],panel=$('#contentListPanel');if(!page||!panel)return;
 const preset=customPageFieldLabels(page),items=page.items||[];
 const rows=items.map((item,i)=>'<button type="button" class="sidebar-content-row '+(i===selectedIndex?'active':'')+'" data-custom-item-index="'+i+'">'+
   '<span class="sidebar-content-thumb '+(item.image?'has-image':'')+'">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'◇')+'</span>'+
   '<span class="sidebar-content-copy"><b>'+esc(item.title||preset.itemTitle+' '+(i+1))+'</b>'+(item.meta?'<small>'+esc(item.meta)+'</small>':'')+'</span><i>›</i></button>').join('');
 panel.innerHTML='<div class="sidebar-content-head"><div><b>'+esc(preset.itemTitle+'展示')+'</b><span>'+items.length+' 项</span></div></div>'+
   '<div class="sidebar-content-rows">'+(rows||'<div class="sidebar-content-empty">还没有'+esc(preset.itemTitle)+'内容</div>')+'</div>'+
   '<button type="button" class="sidebar-content-add" data-add-custom-item>＋ 添加'+esc(preset.itemTitle)+'</button>';
 panel.querySelectorAll('[data-custom-item-index]').forEach(btn=>btn.onclick=()=>openCustomPageItemInspector(pageId,Number(btn.dataset.customItemIndex)));
 panel.querySelector('[data-add-custom-item]')?.addEventListener('click',()=>mutateCustomPageItem(pageId,items.length-1,'add'));
}
function openCustomPageItemInspector(pageId,index){
 const pi=customPageIndex(pageId),page=state.customPages?.[pi],item=page?.items?.[index];if(pi<0||!page||!item)return;
 const preset=customPageFieldLabels(page),path='customPages.'+pi+'.items.'+index;
 const image=item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
 setInspector('专题内容',preset.itemTitle+' · '+(item.title||String(index+1)),
   '<div class="item-inspector-head"><div><span>'+esc(page.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(page.items.length).padStart(2,'0')+'</b></div><div class="item-tools"><button data-custom-item-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-custom-item-op="down" '+(index===page.items.length-1?'disabled':'')+'>↓</button></div></div>'+
   '<div class="item-fields">'+
   '<label><span>'+esc(preset.titleLabel)+'</span><input data-custom-item-field="title" value="'+esc(item.title||'')+'"></label>'+
   '<label><span>'+esc(preset.metaLabel)+'</span><input data-custom-item-field="meta" value="'+esc(item.meta||'')+'"></label>'+
   '<label><span>'+esc(preset.textLabel)+'</span><textarea data-custom-item-field="text" rows="4">'+esc(item.text||'')+'</textarea></label>'+
   '<label><span>外部链接（可选）</span><input data-custom-item-field="url" value="'+esc(item.url||'')+'"></label>'+
   '</div><div class="item-media"><span>展示图片</span><div class="item-media-row">'+image+'<div><button type="button" data-custom-item-image>选择 / 裁剪</button>'+(item.image?'<button type="button" class="ghost" data-custom-item-image-remove>移除</button>':'')+'</div></div></div>'+
   '<div class="item-actions"><button data-custom-item-op="add">＋ 添加</button><button data-custom-item-op="delete" class="danger">删除</button></div>');
 inspector.querySelectorAll('[data-custom-item-field]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{if(!started){checkpoint();started=true}item[e.target.dataset.customItemField]=e.target.value;save();send({type:'OE_REPLACE_STATE',state});openCustomPageItemsManager(pageId,index)});
 });
 inspector.querySelectorAll('[data-custom-item-op]').forEach(btn=>btn.addEventListener('click',()=>mutateCustomPageItem(pageId,index,btn.dataset.customItemOp)));
 inspector.querySelector('[data-custom-item-image]')?.addEventListener('click',()=>{
   const input=$('#imageInput');input.dataset.path=path+'.image';input.dataset.returnCollection='custom:'+pageId;input.dataset.returnIndex=String(index);input.click();
 });
 inspector.querySelector('[data-custom-item-image-remove]')?.addEventListener('click',()=>{checkpoint();item.image='';save();send({type:'OE_REPLACE_STATE',state});openCustomPageItemInspector(pageId,index)});
}
function mutateCustomPageItem(pageId,index,op){
 const page=state.customPages?.[customPageIndex(pageId)];if(!page)return;page.items??=[];checkpoint();
 if(op==='up'&&index>0){[page.items[index-1],page.items[index]]=[page.items[index],page.items[index-1]];index--}
 if(op==='down'&&index<page.items.length-1){[page.items[index+1],page.items[index]]=[page.items[index],page.items[index+1]];index++}
 if(op==='delete'){
   const removed=page.items[index];
   if(removed?.id)(state.venueMap?.links||[]).forEach(link=>{if(link.target===customPageKey(page.id)&&link.itemType==='customitem'&&link.itemId===removed.id){link.itemType='page';link.itemId=''}});
   page.items.splice(index,1);index=Math.min(index,page.items.length-1)
 }
 if(op==='add'){page.items.splice(index+1,0,{id:uid('ci'),title:'',meta:'',text:'',image:'',url:''});index++}
 save();send({type:'OE_REPLACE_STATE',state});openCustomPageItemsManager(pageId,index);
 if(index>=0&&page.items[index])openCustomPageItemInspector(pageId,index);else showInspectorEmpty();
}

function openOptionalPageInspector(key){
 const page=state[key]||{},label=key==='freewalk'?'COS自由行':'痛车展示';
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
function setPageContentActive({tool='',collection=''}={}){
 document.querySelectorAll('[data-page-content-manager],[data-page-tool]').forEach(x=>{
   const on=collection?x.dataset.pageContentManager===collection:tool?x.dataset.pageTool===tool:false;
   x.classList.toggle('active',on);
 });
}
function syncCanvasSelection(path){
 if(/^heroTitle|^heroImage$|^tagline$|^sticker\d+$/.test(path)){syncStudioPageUI('home',{openContent:false});setPageContentActive({tool:'hero'});return}
 if(/^ribbonItems\./.test(path)){syncStudioPageUI('home',{openContent:false});setPageContentActive({collection:'ribbonItems'});return}
 if(path==='venueMap.image'){syncStudioPageUI('home',{openContent:false});setPageContentActive({tool:'map'});return}
 const map=[
   [/^tickets\.|^ticketUrl$|^ticketLinkLabel$/,'home','tickets'],
   [/^venueMap\.links\./,'home','explore'],
   [/^updates\./,'home','updates'],
   [/^guests\./,'guests','guests'],
   [/^socialLinks\./,'home','socialLinks'],
   [/^sponsors\./,'home','sponsors'],
   [/^booths\./,'booths','booths'],
   [/^participation\./,'activities','participation'],
   [/^schedule\./,'activities','schedule'],
   [/^guide\.items\./,'guide','guide']
 ];
 const hit=map.find(([re])=>re.test(path));
 if(hit){syncStudioPageUI(hit[1],{openContent:false});setPageContentActive({collection:hit[2]})}
}
function openEntryAnimationInspector(){
 const a=state.entryAnimation||{};
 const linkedImage=String(state.heroImage||'').trim();
 const customImage=String(a.image||'').trim();
 const imageSrc=(a.imageMode==='custom'&&customImage)?customImage:linkedImage||customImage;
 const row=(key,label,value,placeholder,showKey,shown=true)=>
   '<div class="entry-field-row">'+
   '<label class="toggle-field"><span>'+label+'</span><input type="checkbox" data-entry-field="'+showKey+'" '+(shown?'checked':'')+'></label>'+
   '<input data-entry-field="'+key+'" value="'+esc(value||'')+'" placeholder="'+esc(placeholder||'')+'">'+
   '</div>';
 setInspector('入场动画','纪念票设置',
   '<div class="entry-animation-inspector">'+
   '<div class="item-fields">'+
   '<label class="toggle-field"><span>启用入场动画</span><input type="checkbox" data-entry-field="enabled" '+(a.enabled!==false?'checked':'')+'></label>'+
   '<label><span>左侧 KV</span><select data-entry-field="imageMode"><option value="linked" '+(a.imageMode!=='custom'?'selected':'')+'>联动首页 KV</option><option value="custom" '+(a.imageMode==='custom'?'selected':'')+'>单独上传</option></select></label>'+
   '</div>'+
   '<div class="item-media"><span>票根 KV</span><div class="item-media-row">'+
   (imageSrc?'<img src="'+esc(imageSrc)+'" alt="">':'<div class="item-media-empty">KV</div>')+
   '<div><button type="button" data-entry-image>选择 / 裁剪</button>'+
   (customImage?'<button type="button" class="ghost" data-entry-image-remove>移除单独 KV</button>':'')+
   '</div></div></div>'+
   '<div class="item-fields">'+
   row('labelText','顶部标签',a.labelText||'MEMORIAL TICKET','MEMORIAL TICKET','showLabel',a.showLabel!==false)+
   row('titleText','活动名',a.titleText||'','留空则联动：'+(state.eventName||'活动名称'),'showTitle',a.showTitle!==false)+
   row('subtitleText','副标题',a.subtitleText||'','可选副标题','showSubtitle',a.showSubtitle===true)+
   row('dateText','日期',a.dateText||'','留空则联动：'+(state.date||'活动日期'),'showDate',a.showDate!==false)+
   row('timeText','时间',a.timeText||'','例如 10:30 - 17:00','showTime',a.showTime===true)+
   row('locationText','地点',a.locationText||'','留空则联动：'+(state.location||'活动地点'),'showLocation',a.showLocation!==false)+
   '<label class="toggle-field"><span>显示条形码</span><input type="checkbox" data-entry-field="showBarcode" '+(a.showBarcode!==false?'checked':'')+'></label>'+
   '<div class="entry-field-row"><label class="toggle-field"><span>显示随机票号</span><input type="checkbox" data-entry-field="showTicketNumber" '+(a.showTicketNumber!==false?'checked':'')+'></label><input data-entry-field="ticketPrefix" value="'+esc(a.ticketPrefix||'NO.')+'" placeholder="NO."></div>'+
   '</div>'+
   '<div class="entry-animation-actions"><button type="button" id="previewEntryAnimation">▶ 播放动画</button><button type="button" id="resetEntryAnimation">恢复模板默认</button></div>'+
   '<p class="inspector-note">所有右侧信息都可单独显示/隐藏。活动名、日期、地点留空时自动联动网站基础信息；票号由系统为每位游客自动生成。</p>'+
   '</div>');
 inspector.querySelectorAll('[data-entry-field]').forEach(input=>{
   const key=input.dataset.entryField;
   input.addEventListener('change',e=>{
     checkpoint();
     const value=e.target.type==='checkbox'?e.target.checked:e.target.value;
     state.entryAnimation??={};state.entryAnimation[key]=value;save();
     send({type:'OE_REPLACE_STATE',state});
     send({type:'OE_PREVIEW_ENTRY',state,play:false});
     if(key==='imageMode')openEntryAnimationInspector();
   });
   if(input.type!=='checkbox'&&input.tagName!=='SELECT'&&input.type!=='color')input.addEventListener('input',e=>{
     state.entryAnimation??={};state.entryAnimation[key]=e.target.value;save();
     send({type:'OE_REPLACE_STATE',state});
     send({type:'OE_PREVIEW_ENTRY',state,play:false});
   });
 });
 inspector.querySelector('[data-entry-image]')?.addEventListener('click',()=>{
   state.entryAnimation.imageMode='custom';save();
   const input=$('#imageInput');input.dataset.path='entryAnimation.image';input.click();
 });
 inspector.querySelector('[data-entry-image-remove]')?.addEventListener('click',()=>{
   checkpoint();state.entryAnimation.image='';state.entryAnimation.imageMode='linked';save();
   send({type:'OE_REPLACE_STATE',state});send({type:'OE_PREVIEW_ENTRY',state,play:false});openEntryAnimationInspector();
 });
 $('#previewEntryAnimation')?.addEventListener('click',()=>send({type:'OE_PREVIEW_ENTRY',state,play:true}));
 $('#resetEntryAnimation')?.addEventListener('click',()=>{
   checkpoint();
   state.entryAnimation={enabled:true,imageMode:'linked',image:'',showLabel:true,labelText:'MEMORIAL TICKET',showTitle:true,titleText:'',showSubtitle:false,subtitleText:'',showDate:true,dateText:'',showTime:false,timeText:'',showLocation:true,locationText:'',showBarcode:true,showTicketNumber:true,ticketPrefix:'NO.',showSkip:true,duration:1800};
   save();send({type:'OE_REPLACE_STATE',state});send({type:'OE_PREVIEW_ENTRY',state,play:false});openEntryAnimationInspector();
 });
}
function openPageTool(tool){
 setPageContentActive({tool});
 const panel=$('#contentListPanel');if(panel)panel.innerHTML='';
 if(tool==='entryAnimation'){openEntryAnimationInspector();return}
 if(tool==='basic'){openAddressInspector();return}
 if(tool==='hero'){openHeroTitleInspector();return}
 if(tool==='map'){openImageInspector('venueMap.image');return}
 if(tool==='freewalk'||tool==='itasha'){openOptionalPageInspector(tool);return}
 showInspectorEmpty();
}
function renderPageContentNav(page,{openDefault=true}={}){
 const nav=$('#pageContentNav'),title=$('#pageContentTitle'),panel=$('#contentListPanel'),custom=customPageByKey(page);
 if(title)title.textContent=pageLabel(page)+'内容';
 if(!nav)return;
 if(custom){
   nav.innerHTML='<button type="button" data-custom-page-nav="settings"><span>页面设置</span></button><button type="button" data-custom-page-nav="items"><span>展示内容</span><b>'+String((custom.items||[]).length)+'</b></button>';
   nav.querySelector('[data-custom-page-nav="settings"]')?.addEventListener('click',()=>{nav.querySelectorAll('[data-custom-page-nav]').forEach(x=>x.classList.toggle('active',x.dataset.customPageNav==='settings'));if(panel)panel.innerHTML='';openCustomPageSettings(custom.id)});
   nav.querySelector('[data-custom-page-nav="items"]')?.addEventListener('click',()=>{nav.querySelectorAll('[data-custom-page-nav]').forEach(x=>x.classList.toggle('active',x.dataset.customPageNav==='items'));openCustomPageItemsManager(custom.id)});
   if(panel)panel.innerHTML='<div class="sidebar-content-empty">选择页面设置或展示内容。</div>';
   if(openDefault){nav.querySelector('[data-custom-page-nav="items"]')?.classList.add('active');openCustomPageItemsManager(custom.id)}
   return;
 }
 const items=PAGE_CONTENT_CONFIG[page]||[];
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
 const extra=collection==='participation'?(()=>{
  const rawMeta=String(source.meta||'').trim(),parts=rawMeta.split(/\s*·\s*/).filter(Boolean);
  return {
   detail:source.detail||source.text||'',
   rules:source.rules||'',
   requirements:source.requirements||'',
   signingRules:source.signingRules||'',
   setlist:source.setlist||'',
   participationMode:source.participationMode||'自由参加',
   activityType:source.activityType||'general',
   activityLocation:source.activityLocation||'',
   availabilityNote:source.availabilityNote||'',
   image:'',guestIds:[],
   category:source.category||({stage:'舞台',guest:'嘉宾互动',signing:'签售',live:'Live',randomDance:'随机舞蹈',cosplay:'COS',itasha:'痛车',stamp:'集章',photo:'合影',game:'互动游戏',support:'应援专区'}[source.preset]||'其他'),
   area:source.area||(parts.length>1?parts[0]:'活动区域'),
   meta:parts.length>1?parts.slice(1).join(' · '):rawMeta
  };
 })():{};
 arr.push({id:uid(collection==='guide'?'gd':'pa'),...structuredClone(source),...extra});
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
 document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.toggle('active',x.dataset.contentManager===collection));
 setPageContentActive({collection});
 const rows=arr.map((item,i)=>{
   const [title,sub]=meta.item(item,i),search=(title+' '+sub).toLowerCase();
   return '<button type="button" class="sidebar-content-row '+(i===selectedIndex?'active':'')+'" data-open-item="'+i+'" data-search="'+esc(search)+'">'+contentThumb(collection,item)+'<span class="sidebar-content-copy"><b>'+esc(title)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><i>›</i></button>';
 }).join('');
 const guidePresets=collection==='guide'?'<div class="preset-add"><span>常用预设</span><div>'+Object.entries(GUIDE_PRESETS).map(([key,x])=>'<button type="button" data-add-preset="'+key+'">'+esc(x.title)+'</button>').join('')+'</div></div>':'';
 const activityPresets=collection==='participation'?'<div class="preset-add"><span>常用活动</span><div>'+Object.entries(PARTICIPATION_PRESETS).map(([key,x])=>'<button type="button" data-add-preset="'+key+'">'+esc(x.title)+'</button>').join('')+'</div></div>':'';
 const addLabel=collection==='guide'?'＋ 添加自定义指南':collection==='participation'?'＋ 添加自定义活动':'＋ 添加'+meta.title;
 const addButton=collection==='featuredActivities'?'':'<button type="button" class="sidebar-content-add" data-sidebar-content-add>'+addLabel+'</button>';
 panel.innerHTML='<div class="sidebar-content-head"><div><b>'+esc(meta.title)+'</b><span>'+arr.length+' 项</span></div>'+(arr.length>6?'<label class="sidebar-content-search"><span>⌕</span><input type="search" placeholder="'+esc(collection==='booths'?'搜索社团，或制品名称 / Tag':'搜索'+meta.title)+'" data-sidebar-content-search></label>':'')+'</div>'+guidePresets+activityPresets+'<div class="sidebar-content-rows">'+(rows||'<div class="sidebar-content-empty">'+esc(meta.empty)+'</div>')+'</div>'+addButton;
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
 const title=document.querySelector('.canvas-title b');if(title)title.textContent=pageLabel(currentPage);
 if(openContent)renderPageContentNav(currentPage);
}
function setStudioPage(page,{openContent=true}={}){
 syncStudioPageUI(page,{openContent});
 if(currentPage==='animation'){
   send({type:'OE_SHOW_PAGE',page:'home'});
   send({type:'OE_PREVIEW_ENTRY',state,play:false});
 }else{
   send({type:'OE_HIDE_ENTRY_PREVIEW'});
   send({type:'OE_SHOW_PAGE',page:currentPage});
 }
}
function bindModuleControls(){
 document.querySelectorAll('[data-module]').forEach(input=>input.addEventListener('change',()=>{
   checkpoint();state.modules??={};state.modules[input.dataset.module]=input.checked;save();
   if(!input.checked&&currentPage===input.dataset.module)setStudioPage('home');
   syncModuleControls();send({type:'OE_REPLACE_STATE',state});
 }));
}

function mountFrame(){canvas.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/render.html?v=8.34.70" title="OnlyEvent live canvas"></iframe>';iframe=$('#liveFrame')}
window.addEventListener('message',e=>{
 if(e.origin!==ORIGIN||e.source!==iframe?.contentWindow)return;
 const m=e.data||{};
 if(m.type==='OE_READY'){frameReady=true;send({type:'OE_INIT_STATE',state,mode:preview?'preview':'edit',page:currentPage});return}
 if(m.type==='OE_RENDER_ERROR'){toast(m.stage==='fallback'?'预览加载失败':'模块加载异常，已自动切换安全渲染');return}
 if(m.type==='OE_PAGE_NAVIGATED'){
   const page=String(m.page||'home');
   if(currentPage==='animation')return;
   if(page===currentPage)return;
   setWorkspace('pages');syncStudioPageUI(page,{openContent:true});showInspectorEmpty();
   return
 }
 if(m.type==='OE_SELECT_FIELD'){document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.remove('active'));syncCanvasSelection(m.path);focusCheckpointTaken=false;openFieldInspector(m.path);return}
 if(m.type==='OE_FIELD_FOCUS'){if(!focusCheckpointTaken){checkpoint();focusCheckpointTaken=true}return}
 if(m.type==='OE_FIELD_CHANGE'){
 setDeep(m.path,m.value);
 send({type:'OE_PATCH_FIELD',path:m.path,value:m.value});
 const f=$('#fieldInput');if(f&&f.dataset.path===m.path)f.value=m.value;
 const linked=inspector.querySelector('[data-sync-path="'+CSS.escape(m.path)+'"]');if(linked)linked.value=m.value;
 return
}
 if(m.type==='OE_SELECT_IMAGE'){document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.remove('active'));syncCanvasSelection(m.path);openImageInspector(m.path);return}
 if(m.type==='OE_SELECT_CUSTOM_PAGE'){
   const key=customPageKey(m.pageId);setWorkspace('pages');syncStudioPageUI(key,{openContent:false});renderPageContentNav(key,{openDefault:false});openCustomPageSettings(m.pageId);return
 }
 if(m.type==='OE_SELECT_CUSTOM_ITEM'){
   const key=customPageKey(m.pageId);setWorkspace('pages');syncStudioPageUI(key,{openContent:false});renderPageContentNav(key,{openDefault:false});
   const nav=$('#pageContentNav');nav?.querySelector('[data-custom-page-nav="items"]')?.classList.add('active');
   openCustomPageItemsManager(m.pageId,m.index);openCustomPageItemInspector(m.pageId,m.index);return
 }
 if(m.type==='OE_SELECT_COLLECTION'){
   const page=COLLECTION_PAGE[m.collection]||currentPage||'home';
   setWorkspace('pages');syncStudioPageUI(page,{openContent:false});renderPageContentNav(page,{openDefault:false});
   openCollectionManager(m.collection);setPageContentActive({collection:m.collection});showInspectorEmpty();return
 }
 if(m.type==='OE_SELECT_ITEM'){
   const page=COLLECTION_PAGE[m.collection]||currentPage||'home';
   setWorkspace('pages');syncStudioPageUI(page,{openContent:false});renderPageContentNav(page,{openDefault:false});
   openCollectionManager(m.collection,m.index);setPageContentActive({collection:m.collection});openItemInspector(m.collection,m.index);return
 }
 if(m.type==='OE_SELECT_PRODUCT'){
   const boothIndex=Number(m.boothIndex),productIndex=Number(m.productIndex);
   if(!Number.isInteger(boothIndex)||!Number.isInteger(productIndex))return;
   setWorkspace('pages');syncStudioPageUI('booths',{openContent:false});renderPageContentNav('booths',{openDefault:false});
   openCollectionManager('booths',boothIndex);setPageContentActive({collection:'booths'});
   openProductInspector(boothIndex,productIndex,{focusImage:!!m.focusImage});
   return
 }

 if(m.type==='OE_EXPORT_HTML_RESULT'){if(publishIntent==='download'){publishIntent='site';downloadPublishedHtml(m.html)}else publishGeneratedHtml(m.html);return}
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
   openCollectionManager('ribbonItems',i);setPageContentActive({collection:'ribbonItems'});openItemInspector('ribbonItems',i);return
 }
 if(path==='ticketUrl'||path==='ticketLinkLabel'){openTicketSettingsInspector();return}
 if(path==='edition'||path==='navigationUrl'){openAddressInspector();return}
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
 featuredActivities:{title:'活动精选',fields:[]},
 participation:{title:'活动',fields:[['title','活动名称'],['text','一句话简介'],['detail','活动内容'],['participationMode','参与方式'],['requirements','参加要求'],['rules','通用规则与注意事项'],['url','报名 / 外部链接']]},
 schedule:{title:'活动日程',fields:[['day','日期 / DAY'],['time','开始时间'],['endTime','结束时间'],['title','活动名称'],['stage','地点区域'],['detail','活动简介'],['registrationUrl','报名 / 外部链接']]},
 guide:{title:'指南内容',fields:[['title','标题'],['label','英文小标题'],['text','说明']]},
 guests:{title:'嘉宾',fields:[['name','姓名 / 团体名称'],['role','身份 / 类型标签'],['members','成员（可选）'],['attendanceNote','出席说明（可选）'],['works','代表作 / 主要内容'],['intro','介绍']]},
 booths:{title:'摊位',fields:[['no','摊位号'],['name','社团名'],['type','分类'],['intro','简介']]},
 updates:{title:'重要更新',fields:[['date','日期'],['title','更新内容']]},socialLinks:{title:'社群入口',fields:[['label','名称'],['note','说明'],['url','链接']]},sponsors:{title:'赞助支持',fields:[['name','名称'],['level','级别'],['url','链接']]}
};
function uid(prefix){return prefix+Math.random().toString(36).slice(2,8)}
function fitTextarea(el){if(!el)return;el.style.height='auto';el.style.height=Math.max(36,el.scrollHeight)+'px'}
function cleanValue(v){return String(v??'').split('\n').map(x=>x.trimEnd()).join('\n').replace(/^\s*\n+/,'').replace(/\n+\s*$/,'').trim()}
function guestPlatformName(url){
 const raw=String(url||'').trim();if(!raw)return '未填写';
 let host='';
 try{host=new URL(/^https?:\/\//i.test(raw)?raw:'https://'+raw).hostname.toLowerCase().replace(/^www\./,'')}catch{}
 if(/(^|\.)bilibili\.com$/.test(host)||host==='b23.tv')return 'Bilibili';
 if(/(^|\.)xiaohongshu\.com$/.test(host)||host==='xhslink.com')return '小红书';
 if(/(^|\.)douyin\.com$/.test(host)||host==='v.douyin.com')return '抖音';
 if(/(^|\.)weibo\.com$/.test(host)||host==='weibo.cn')return '微博';
 if(host==='x.com'||host==='twitter.com'||host.endsWith('.twitter.com'))return 'X / Twitter';
 if(host==='youtube.com'||host.endsWith('.youtube.com')||host==='youtu.be')return 'YouTube';
 if(host==='instagram.com'||host.endsWith('.instagram.com'))return 'Instagram';
 if(host==='tiktok.com'||host.endsWith('.tiktok.com'))return 'TikTok';
 if(host==='pixiv.net'||host.endsWith('.pixiv.net'))return 'Pixiv';
 if(host==='lofter.com'||host.endsWith('.lofter.com'))return 'LOFTER';
 if(host==='facebook.com'||host.endsWith('.facebook.com'))return 'Facebook';
 if(host==='twitch.tv'||host.endsWith('.twitch.tv'))return 'Twitch';
 return host||'个人主页';
}

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
 if(page==='guests')out+=(state.guests||[]).map(x=>'<option value="guest:'+esc(x.id)+'"'+selected('guest',x.id)+'>'+esc(x.name||'嘉宾')+'</option>').join('');
 if(page==='guide')out+=(state.guide?.items||[]).map(x=>'<option value="guide:'+esc(x.id)+'"'+selected('guide',x.id)+'>'+esc(x.title||'指南')+'</option>').join('');
 const custom=customPageByKey(page);
 if(custom)out+=(custom.items||[]).map(x=>'<option value="customitem:'+esc(x.id)+'"'+selected('customitem',x.id)+'>'+esc(x.title||'展示内容')+'</option>').join('');
 return out;
}
function extraInspector(collection,index,item){
 if(collection==='featuredActivities'){
   const options=(state.participation||[]).map(a=>'<option value="'+esc(a.id)+'" '+(a.id===item.participationId?'selected':'')+'>'+esc(a.title||'活动')+'</option>').join('');
   const linkedIndex=(state.participation||[]).findIndex(a=>a.id===item.participationId);
   const image=item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
   return '<div class="reference-panel featured-slot-panel"><b>精选活动 '+String(index+1).padStart(2,'0')+'</b>'+
     '<div class="item-media featured-slot-media"><span>首页专用图片</span><div class="item-media-row">'+image+'<div><button type="button" data-media-path="featuredActivities.'+index+'.image">选择 / 裁剪</button>'+(item.image?'<button type="button" data-remove-media="featuredActivities.'+index+'.image" class="ghost">移除</button>':'')+'</div></div><small>只用于首页活动精选，不影响活动详情页。</small></div>'+
     '<label><span>选择已有活动</span><select data-featured-activity-select><option value="">未选择</option>'+options+'</select></label><p class="inspector-note">这里只决定首页展示哪一个活动，活动内容仍在「活动」里统一维护。</p>'+(linkedIndex>=0?'<button type="button" class="sidebar-content-row" data-edit-featured-source="'+linkedIndex+'"><span class="sidebar-content-copy"><b>编辑</b><small>'+esc((state.participation||[])[linkedIndex]?.title||'活动')+'</small></span><i>›</i></button>':'')+'</div>';
 }
 if(collection==='schedule'){
   const guests=state.guests||[],plans=state.participation||[];
   return '<div class="reference-panel"><b>关联活动企划</b><label><span>对应活动</span><select data-schedule-plan><option value="">不关联</option>'+plans.map(p=>'<option value="'+esc(p.id)+'" '+(item.participationId===p.id?'selected':'')+'>'+esc(p.title||'活动')+'</option>').join('')+'</select></label></div>'+ 
     '<div class="reference-panel"><b>关联嘉宾</b><div class="reference-list"><span>选择出席这条日程的嘉宾</span>'+guests.map(g=>'<label class="check-row"><input type="checkbox" data-guest-ref="'+esc(g.id)+'" '+((item.guestIds||[]).includes(g.id)?'checked':'')+'><span>'+esc(g.name)+'</span></label>').join('')+'</div></div>';
 }
 if(collection==='guests'){
   const guestTypes=[['person','个人'],['duo','双人 / 小组合'],['band','乐队'],['group','团体'],['official','官方团队']];
   const plans=state.participation||[];
   const schedule=state.schedule||[];
   const socialLinks=Array.isArray(item.socialLinks)?item.socialLinks:[];
   const image=item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
   const socialPanel='<div class="reference-panel guest-social-editor"><div class="guest-social-editor-head"><b>个人平台</b><button type="button" data-guest-social-add>＋ 添加平台</button></div>'+
     '<div class="guest-social-editor-list">'+(socialLinks.length?socialLinks.map((link,j)=>'<div class="guest-social-editor-row"><span class="guest-platform-detected">'+esc(guestPlatformName(link.url))+'</span><input data-guest-social-url="'+j+'" value="'+esc(link.url||'')+'" placeholder="粘贴个人主页地址"><button type="button" class="ghost" data-guest-social-remove="'+j+'">×</button></div>').join(''):'<p class="inspector-note">添加个人主页地址后会自动识别平台；一个平台一条地址。</p>')+'</div></div>';
   return '<div class="reference-panel guest-type-panel"><b>嘉宾类型</b><div class="guest-type-presets">'+guestTypes.map(([key,label])=>'<button type="button" data-guest-type="'+key+'" class="'+((item.guestType||'person')===key?'active':'')+'">'+label+'</button>').join('')+'</div><p class="inspector-note">类型只影响展示结构和图片比例；名称、成员、身份与文案仍可自由修改。</p></div>'+
     '<div class="item-media"><span>嘉宾宣传图</span><div class="item-media-row">'+image+'<div><button data-media-path="guests.'+index+'.image">选择 / 裁剪</button>'+(item.image?'<button data-remove-media="guests.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>'+
     socialPanel+
     '<div class="reference-panel guest-link-panel"><b>关联活动</b><div class="reference-list"><span>活动企划</span>'+(plans.length?plans.map(a=>'<label class="check-row"><input type="checkbox" data-guest-plan-ref="'+esc(a.id)+'" '+((a.guestIds||[]).includes(item.id)?'checked':'')+'><span>'+esc(a.title||'活动')+'</span></label>').join(''):'<span class="muted">暂无活动企划</span>')+'</div><div class="reference-list"><span>当天日程</span>'+(schedule.length?schedule.map(a=>'<label class="check-row"><input type="checkbox" data-guest-schedule-ref="'+esc(a.id)+'" '+((a.guestIds||[]).includes(item.id)?'checked':'')+'><span>'+esc((a.time?a.time+' ':'')+(a.title||'日程'))+'</span></label>').join(''):'<span class="muted">暂无当天日程</span>')+'</div></div>';
 }
 if(collection==='booths'){
   const products=item.products||[],logo=item.logo?'<img src="'+esc(item.logo)+'" alt="">':'<div class="item-media-empty">＋</div>';
   return '<div class="item-media"><span>社团 Logo（可选）</span><div class="item-media-row">'+logo+'<div><button data-media-path="booths.'+index+'.logo">选择 Logo</button>'+(item.logo?'<button data-remove-media="booths.'+index+'.logo" class="ghost">移除</button>':'')+'</div></div></div>'+
     '<div class="product-editor"><div class="product-editor-head"><b>制品管理</b></div>'+
     '<button type="button" class="sidebar-content-row product-manager-entry" data-booth-products-manage="'+index+'"><span class="sidebar-content-copy"><b>制品列表</b></span></button></div>';
 }
 if(collection==='explore'){
   const pages=[['booths','摊位'],['activities','活动'],['guests','嘉宾'],['guide','观展指南'],...(state.customPages||[]).map(p=>[customPageKey(p.id),p.title||'专题页面'])];
   return '<div class="reference-panel explore-link-settings"><b>跳转目标</b>'+
     '<label><span>一级页面</span><select data-explore-page>'+pages.map(x=>'<option value="'+x[0]+'" '+(item.target===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label></div>';
 }
 if(collection==='participation'){
   const guests=state.guests||[],linked=(state.schedule||[]).filter(x=>x.participationId===item.id),type=item.activityType||'general',preset=item.preset||'custom';
   const typeOptions=[['general','普通活动'],['interactive','互动活动'],['guest','嘉宾活动'],['live','乐队Live'],['signing','嘉宾签售'],['venue','场地活动']];
   const typePicker=preset==='custom'
     ?'<div class="reference-panel"><b>活动类型</b><select data-activity-type>'+typeOptions.map(([k,label])=>'<option value="'+k+'" '+(type===k?'selected':'')+'>'+label+'</option>').join('')+'</select></div>'
     :'';
   const specialized=preset==='live'
     ?'<div class="reference-panel activity-special-panel"><b>歌单</b><label><span>每行一首</span><textarea rows="5" data-activity-extra-key="setlist">'+esc(item.setlist||'')+'</textarea></label></div>'
     :preset==='signing'
     ?'<div class="reference-panel activity-special-panel"><b>签售规则</b><textarea rows="5" data-activity-extra-key="signingRules">'+esc(item.signingRules||'')+'</textarea></div>'
     :['stamp','cosplay','itasha','support'].includes(preset)
     ?'<div class="reference-panel activity-special-panel"><b>开放信息</b><label><span>地点</span><input data-activity-extra-key="activityLocation" value="'+esc(item.activityLocation||'')+'"></label><label><span>开放说明</span><input data-activity-extra-key="availabilityNote" value="'+esc(item.availabilityNote||'开展期间开放')+'"></label></div>'
     :'';
   const needsGuests=['stage','guest','signing','live','photo'].includes(preset)||preset==='custom';
   const guestPanel=needsGuests?'<div class="reference-panel"><b>关联嘉宾</b><div class="reference-list">'+guests.map(g=>'<label class="check-row"><input type="checkbox" data-guest-ref="'+esc(g.id)+'" '+((item.guestIds||[]).includes(g.id)?'checked':'')+'><span>'+esc(g.name)+'</span></label>').join('')+'</div></div>':'';
   const needsSchedule=!['stamp','cosplay','itasha','support'].includes(preset);
   const schedulePanel=needsSchedule?'<div class="reference-panel"><b>关联日程</b><div class="linked-summary">'+(linked.length?linked.map(x=>'<span>'+esc((x.time?x.time+' ':'')+(x.title||'日程'))+'</span>').join(''):'<span>暂未关联日程</span>')+'</div></div>':'';
   return typePicker+specialized+guestPanel+schedulePanel;
 }
 if(collection==='updates'){
   const targets=[['top','首页顶部'],['tickets','票务'],['activities','活动'],['map-home','场地图'],['schedule-home','当天日程'],['guests','嘉宾'],['guide','观展指南'],['community','社群']];
   return '<div class="reference-panel"><b>跳转位置</b><label><span>点击后前往</span><select data-ref="target">'+targets.map(x=>'<option value="'+x[0]+'" '+(item.target===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label></div>';
 }
 return '';
}
function openBoothProductManager(boothIndex){
 const booth=state.booths?.[boothIndex];if(!booth)return;
 const products=booth.products||[];
 setInspector('制品','制品管理 · '+(booth.no||booth.name||'摊位'),
   '<div class="product-direct-head"><button type="button" class="ghost" data-booth-product-back>← 返回摊位编辑</button><span>'+esc((booth.no?booth.no+' · ':'')+(booth.name||'摊位'))+'</span></div>'+
   '<div class="product-editor"><div class="product-editor-head"><b>共 '+products.length+' 件制品</b><button type="button" data-booth-product-add="'+boothIndex+'">＋ 添加制品</button></div>'+
   '<div class="sidebar-content-rows">'+(products.length?products.map((p,j)=>
      '<div class="product-manager-row"><button type="button" class="sidebar-content-row product-manager-name-row" data-booth-product-open="'+j+'"><span class="sidebar-content-copy"><b>'+esc(p.name||'未命名制品')+'</b></span></button><div class="product-manager-tools"><button type="button" data-booth-product-move="'+j+'" data-dir="-1" '+(j===0?'disabled':'')+' title="上移">↑</button><button type="button" data-booth-product-move="'+j+'" data-dir="1" '+(j===products.length-1?'disabled':'')+' title="下移">↓</button></div></div>'
   ).join(''):'<p class="inspector-note">还没有制品，点击“添加制品”开始。</p>')+'</div></div>');
 inspector.querySelector('[data-booth-product-back]')?.addEventListener('click',()=>openItemInspector('booths',boothIndex));
 inspector.querySelector('[data-booth-product-add]')?.addEventListener('click',()=>addBoothProduct(boothIndex));
 inspector.querySelectorAll('[data-booth-product-open]').forEach(btn=>btn.addEventListener('click',()=>openProductInspector(boothIndex,Number(btn.dataset.boothProductOpen))));
 inspector.querySelectorAll('[data-booth-product-move]').forEach(btn=>btn.addEventListener('click',()=>moveBoothProduct(boothIndex,Number(btn.dataset.boothProductMove),Number(btn.dataset.dir))));
}
function moveBoothProduct(boothIndex,productIndex,dir){
 const booth=state.booths?.[boothIndex],products=booth?.products||[],next=productIndex+Number(dir||0);
 if(!booth||productIndex<0||next<0||next>=products.length||productIndex===next)return;
 checkpoint();[products[productIndex],products[next]]=[products[next],products[productIndex]];
 save();send({type:'OE_REPLACE_STATE',state});openBoothProductManager(boothIndex);
}
function addBoothProduct(boothIndex){
 const booth=state.booths?.[boothIndex];if(!booth)return;
 checkpoint();booth.products??=[];
 booth.products.push({id:uid('p'),name:'新制品',tag:'',price:'',note:'',image:''});
 const productIndex=booth.products.length-1;
 save();send({type:'OE_REPLACE_STATE',state});
 openProductInspector(boothIndex,productIndex);
}
function openProductInspector(boothIndex,productIndex,{focusImage=false}={}){
 const booth=state.booths?.[boothIndex],product=booth?.products?.[productIndex];if(!booth||!product)return;
 const path='booths.'+boothIndex+'.products.'+productIndex;
 const image=product.image?'<img src="'+esc(product.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
 setInspector('制品','编辑制品',
   '<div class="product-direct-head"><button type="button" class="ghost" data-direct-product-back>← 返回制品列表</button><span>'+esc((booth.no?booth.no+' · ':'')+(booth.name||'所属摊位'))+'</span><b>'+esc(product.name||'未命名制品')+'</b></div>'+
   '<div class="item-media product-direct-media"><span>制品图片</span><div class="item-media-row">'+image+'<div><button type="button" data-direct-product-image>选择 / 裁剪</button>'+(product.image?'<button type="button" data-direct-product-crop class="ghost">重新裁剪</button><button type="button" data-direct-product-remove-image class="ghost">移除</button>':'')+'</div></div></div>'+
   '<div class="item-fields product-direct-fields">'+
     '<label><span>制品名称</span><input data-direct-product-key="name" value="'+esc(product.name||'')+'"></label>'+
     '<label><span>Tag（选填）</span><input data-direct-product-key="tag" value="'+esc(product.tag||'')+'" placeholder="如：亚克力 立牌"></label>'+
     '<label><span>价格</span><input data-direct-product-key="price" value="'+esc(product.price||'')+'"></label>'+
     '<label><span>说明</span><textarea data-direct-product-key="note" rows="2">'+esc(product.note||'')+'</textarea></label>'+
   '</div>'+
   '<p class="inspector-note">制品搜索只匹配“名称 + Tag”。</p>'+
   '<div class="item-actions"><button type="button" data-direct-product-delete class="danger">删除制品</button></div>'
 );
 inspector.querySelector('[data-direct-product-back]')?.addEventListener('click',()=>openBoothProductManager(boothIndex));
 inspector.querySelectorAll('textarea').forEach(fitTextarea);
 inspector.querySelectorAll('[data-direct-product-key]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{if(!started){checkpoint();started=true}const key=e.target.dataset.directProductKey;product[key]=e.target.value;save();send({type:'OE_REPLACE_STATE',state});if(e.target.tagName==='TEXTAREA')fitTextarea(e.target)});
   input.addEventListener('blur',e=>{const key=e.target.dataset.directProductKey,cleaned=cleanValue(e.target.value);if(cleaned!==e.target.value){e.target.value=cleaned;product[key]=cleaned;save();send({type:'OE_REPLACE_STATE',state});if(e.target.tagName==='TEXTAREA')fitTextarea(e.target)}});
 });
 const choose=()=>{const input=$('#imageInput');input.dataset.path=path+'.image';input.dataset.returnCollection='product:'+boothIndex;input.dataset.returnIndex=String(productIndex);input.click()};
 inspector.querySelector('[data-direct-product-image]')?.addEventListener('click',choose);
 inspector.querySelector('[data-direct-product-crop]')?.addEventListener('click',()=>openImageCropper(product.image,path+'.image','product:'+boothIndex,String(productIndex)));
 inspector.querySelector('[data-direct-product-remove-image]')?.addEventListener('click',()=>{checkpoint();product.image='';save();send({type:'OE_REPLACE_STATE',state});openProductInspector(boothIndex,productIndex)});
 inspector.querySelector('[data-direct-product-delete]')?.addEventListener('click',()=>{checkpoint();booth.products.splice(productIndex,1);save();send({type:'OE_REPLACE_STATE',state});openBoothProductManager(boothIndex)});
 if(focusImage)requestAnimationFrame(()=>inspector.querySelector('[data-direct-product-image]')?.focus());
}
function participationInspectorFields(item){
 const preset=item?.preset||'custom';
 const common={
  title:['title','活动名称'],text:['text','一句话简介'],detail:['detail','活动内容'],
  mode:['participationMode','参与方式'],requirements:['requirements','参加要求'],
  rules:['rules','活动规则'],url:['url','报名链接']
 };
 const map={
  stage:[common.title,common.text,common.detail,common.mode,common.rules,common.url],
  guest:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules,common.url],
  signing:[common.title,common.text,common.detail,common.mode,common.requirements,common.url],
  live:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules,common.url],
  randomDance:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  stamp:[common.title,common.text,common.detail,common.mode,common.rules],
  game:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  photo:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  cosplay:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  itasha:[common.title,common.text,common.detail,common.rules],
  support:[common.title,common.text,common.detail,common.mode,common.rules]
 };
 return map[preset]||[common.title,common.text,common.detail,common.mode,common.requirements,common.rules,common.url];
}
function openItemInspector(collection,index){
 const meta=collectionMeta[collection],arr=collectionArray(collection),item=arr?.[index];if(!meta||!item)return;
 const count=arr.length;
 const isLong=k=>['text','gift','note','detail','rules','requirements','intro','works','appearance'].includes(k);
 const inspectorFields=collection==='participation'?participationInspectorFields(item):meta.fields;
 const media=collection==='participation'
   ?'<div class="item-media"><span>活动宣传图</span><div class="item-media-row">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="participation.'+index+'.image">选择 / 裁剪</button>'+(item.image?'<button data-remove-media="participation.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>'
   :collection==='tickets'?'<div class="item-media"><span>赠品图片</span><div class="item-media-row">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="tickets.'+index+'.image">选择图片</button>'+(item.image?'<button data-remove-media="tickets.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>':collection==='socialLinks'?'<div class="item-media"><span>二维码 / 图片</span><div class="item-media-row">'+(item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="socialLinks.'+index+'.image">选择图片</button>'+(item.image?'<button data-remove-media="socialLinks.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>':collection==='sponsors'?'<div class="item-media"><span>Logo</span><div class="item-media-row">'+(item.logo?'<img src="'+esc(item.logo)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button data-media-path="sponsors.'+index+'.logo">选择 Logo</button>'+(item.logo?'<button data-remove-media="sponsors.'+index+'.logo" class="ghost">移除</button>':'')+'</div></div></div>':'';
 const guideMedia=collection==='guide'&&item.preset==='traffic'
   ?(item.image
     ?'<div class="item-media"><span>路线图 / 入口示意图</span><div class="item-media-row"><img src="'+esc(item.image)+'" alt=""><div><button data-media-path="guide.items.'+index+'.image">替换图片</button><button data-remove-media="guide.items.'+index+'.image" class="ghost">移除</button></div></div></div>'
     :'<div class="guide-media-add"><button type="button" data-media-path="guide.items.'+index+'.image">＋ 上传路线图 / 入口示意图</button></div>')
   :'';
 const itemTitle=contentManagerMeta[collection]?.item?.(item,index)?.[0]||meta.title;
 const itemActions=collection==='featuredActivities'?'':'<div class="item-actions"><button data-op="add">＋ 添加</button><button data-op="delete" class="danger">删除</button></div>';
 setInspector('内容',meta.title+' · '+itemTitle,'<div class="item-inspector-head"><div><span>'+esc(meta.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0')+'</b></div><div class="item-tools"><button data-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-op="down" '+(index===count-1?'disabled':'')+'>↓</button></div></div><div class="item-fields">'+inspectorFields.map(([key,label])=>'<label><span>'+label+'</span>'+(isLong(key)?'<textarea data-key="'+key+'" rows="1">'+esc(item[key]||'')+'</textarea>':'<input data-key="'+key+'" value="'+esc(item[key]??'')+'" '+(key==='tone'?'type="color"':'')+'>')+'</label>').join('')+'</div>'+media+guideMedia+extraInspector(collection,index,item)+itemActions);
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
 }
 inspector.querySelector('[data-schedule-plan]')?.addEventListener('change',e=>{checkpoint();item.participationId=e.target.value;save();send({type:'OE_REPLACE_STATE',state});openItemInspector('schedule',index)});
 inspector.querySelector('[data-featured-activity-select]')?.addEventListener('change',e=>{checkpoint();item.participationId=e.target.value;save();send({type:'OE_REPLACE_STATE',state});openCollectionManager('featuredActivities',index);openItemInspector('featuredActivities',index)});
 inspector.querySelector('[data-edit-featured-source]')?.addEventListener('click',e=>{const i=Number(e.currentTarget.dataset.editFeaturedSource);openCollectionManager('participation',i);setPageContentActive({collection:'participation'});openItemInspector('participation',i)});
 inspector.querySelectorAll('[data-guest-ref]').forEach(ch=>ch.addEventListener('change',e=>{checkpoint();item.guestIds??=[];item.guestIds=e.target.checked?[...new Set([...item.guestIds,e.target.dataset.guestRef])]:item.guestIds.filter(id=>id!==e.target.dataset.guestRef);save();send({type:'OE_REPLACE_STATE',state})}));
 inspector.querySelector('[data-activity-type]')?.addEventListener('change',e=>{checkpoint();item.activityType=e.target.value;save();send({type:'OE_REPLACE_STATE',state});openItemInspector('participation',index)});
 inspector.querySelectorAll('[data-activity-extra-key]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{if(!started){checkpoint();started=true}item[e.target.dataset.activityExtraKey]=e.target.value;save();send({type:'OE_REPLACE_STATE',state})});
 });
 if(collection==='guests')inspector.querySelectorAll('[data-guest-type]').forEach(btn=>btn.addEventListener('click',()=>{checkpoint();item.guestType=btn.dataset.guestType;save();send({type:'OE_REPLACE_STATE',state});openItemInspector('guests',index)}));
 if(collection==='guests'){
   inspector.querySelectorAll('[data-guest-plan-ref]').forEach(ch=>ch.addEventListener('change',e=>{
     checkpoint();
     const plan=(state.participation||[]).find(x=>x.id===e.target.dataset.guestPlanRef);if(!plan)return;
     plan.guestIds=Array.isArray(plan.guestIds)?plan.guestIds:[];
     plan.guestIds=e.target.checked?[...new Set([...plan.guestIds,item.id])]:plan.guestIds.filter(id=>id!==item.id);
     save();send({type:'OE_REPLACE_STATE',state});openItemInspector('guests',index);
   }));
   inspector.querySelectorAll('[data-guest-schedule-ref]').forEach(ch=>ch.addEventListener('change',e=>{
     checkpoint();
     const row=(state.schedule||[]).find(x=>x.id===e.target.dataset.guestScheduleRef);if(!row)return;
     row.guestIds=Array.isArray(row.guestIds)?row.guestIds:[];
     row.guestIds=e.target.checked?[...new Set([...row.guestIds,item.id])]:row.guestIds.filter(id=>id!==item.id);
     save();send({type:'OE_REPLACE_STATE',state});openItemInspector('guests',index);
   }));
   inspector.querySelector('[data-guest-social-add]')?.addEventListener('click',()=>{
     checkpoint();item.socialLinks=Array.isArray(item.socialLinks)?item.socialLinks:[];item.socialLinks.push({id:uid('gl'),url:''});
     save();send({type:'OE_REPLACE_STATE',state});openItemInspector('guests',index);
   });
   inspector.querySelectorAll('[data-guest-social-url]').forEach(input=>{
     let started=false;
     input.addEventListener('input',e=>{
       if(!started){checkpoint();started=true}
       const j=Number(e.target.dataset.guestSocialUrl);item.socialLinks??=[];if(!item.socialLinks[j])return;
       item.socialLinks[j].url=e.target.value;
       const detected=e.target.closest('.guest-social-editor-row')?.querySelector('.guest-platform-detected');if(detected)detected.textContent=guestPlatformName(e.target.value);
       save();send({type:'OE_REPLACE_STATE',state});
     });
     input.addEventListener('blur',e=>{
       const j=Number(e.target.dataset.guestSocialUrl),cleaned=cleanValue(e.target.value);if(!item.socialLinks?.[j])return;
       item.socialLinks[j].url=cleaned;e.target.value=cleaned;save();send({type:'OE_REPLACE_STATE',state});
       const detected=e.target.closest('.guest-social-editor-row')?.querySelector('.guest-platform-detected');if(detected)detected.textContent=guestPlatformName(cleaned);
     });
   });
   inspector.querySelectorAll('[data-guest-social-remove]').forEach(btn=>btn.addEventListener('click',()=>{
     checkpoint();const j=Number(btn.dataset.guestSocialRemove);item.socialLinks??=[];item.socialLinks.splice(j,1);
     save();send({type:'OE_REPLACE_STATE',state});openItemInspector('guests',index);
   }));
 }
 inspector.querySelectorAll('[data-op]').forEach(btn=>btn.addEventListener('click',()=>mutateItem(collection,index,btn.dataset.op)));
 inspector.querySelectorAll('[data-media-path]').forEach(btn=>btn.addEventListener('click',()=>{$('#imageInput').dataset.path=btn.dataset.mediaPath;$('#imageInput').dataset.returnCollection=collection;$('#imageInput').dataset.returnIndex=String(index);$('#imageInput').click()}));
 inspector.querySelectorAll('[data-remove-media]').forEach(btn=>btn.addEventListener('click',()=>{checkpoint();setDeep(btn.dataset.removeMedia,'');save();send({type:'OE_REPLACE_STATE',state});openItemInspector(collection,index)}));
 if(collection==='booths'){
   inspector.querySelector('[data-booth-product-add]')?.addEventListener('click',()=>addBoothProduct(index));
   inspector.querySelector('[data-booth-products-manage]')?.addEventListener('click',()=>openBoothProductManager(index));
 }
}
function clearExploreItemRef(itemType,itemId){
 (state.venueMap?.links||[]).forEach(link=>{
   if(link.itemType===itemType&&String(link.itemId||'')===String(itemId||'')){link.itemType='page';link.itemId=''}
 });
}
function cleanupDeletedReferences(collection,item){
 const id=item?.id;if(!id)return;
 if(collection==='participation'){
   (state.schedule||[]).forEach(row=>{if(row.participationId===id)row.participationId=''});
   (state.featuredActivities||[]).forEach(slot=>{if(slot.participationId===id)slot.participationId=''});
   clearExploreItemRef('participation',id);
 }
 if(collection==='schedule')clearExploreItemRef('schedule',id);
 if(collection==='guests'){
   (state.participation||[]).forEach(row=>{row.guestIds=(row.guestIds||[]).filter(x=>x!==id)});
   (state.schedule||[]).forEach(row=>{row.guestIds=(row.guestIds||[]).filter(x=>x!==id)});
   clearExploreItemRef('guest',id);
 }
 if(collection==='booths')clearExploreItemRef('booth',id);
 if(collection==='guide')clearExploreItemRef('guide',id);
}
function mutateItem(collection,index,op){
 const arr=collectionArray(collection);if(!Array.isArray(arr))return;checkpoint();
 if(op==='up'&&index>0){[arr[index-1],arr[index]]=[arr[index],arr[index-1]];index--}
 if(op==='down'&&index<arr.length-1){[arr[index+1],arr[index]]=[arr[index],arr[index+1]];index++}
 if(op==='delete'&&arr.length){
   const removed=arr[index];cleanupDeletedReferences(collection,removed);
   arr.splice(index,1);
   if(!arr.length){save();send({type:'OE_REPLACE_STATE',state});syncContentCounts();openCollectionManager(collection);showInspectorEmpty();return}
   index=Math.max(0,index-1);
 }
 if(op==='add'){
   const fresh=collection==='ribbonItems'?{id:uid('rb'),text:'新滚动公告'}:
     collection==='explore'?{id:uid('ml'),label:'新探索入口',target:'activities',itemType:'page',itemId:''}:
     collection==='tickets'?{id:uid('t'),name:'新票种',price:'¥0',gift:'',note:'',image:''}:
     collection==='guide'?{id:uid('gd'),preset:'custom',title:'新指南内容',label:'GUIDE',text:''}:
     collection==='guests'?{id:uid('g'),guestType:'person',name:'新嘉宾',role:'GUEST',members:'',attendanceNote:'',works:'',intro:'',image:'',socialLinks:[]}:
     collection==='booths'?{id:uid('b'),no:'',name:'新摊位',logo:'',type:'',intro:'',products:[{id:uid('p'),name:'新制品',tag:'',price:'',note:'',image:''}]}:
     collection==='updates'?{id:uid('u'),date:'',title:'新更新',target:'top'}:
     collection==='participation'?{id:uid('pa'),preset:'custom',activityType:'general',title:'新活动',text:'',detail:'',participationMode:'自由参加',requirements:'',rules:'',signingRules:'',activityLocation:'',availabilityNote:'',setlist:'',image:'',target:'activities',url:'',guestIds:[]}:
     collection==='socialLinks'?{id:uid('sl'),label:'新社群入口',note:'',url:'',image:''}:
     collection==='sponsors'?{id:uid('sp'),name:'新赞助商',level:'合作伙伴',url:'',logo:''}:
     {id:uid('s'),time:'12:00',title:'新活动',stage:'MAIN STAGE',detail:'',participationId:'',guestIds:[],registrationUrl:''};
   arr.splice(index+1,0,fresh);index++;
 }
 save();send({type:'OE_REPLACE_STATE',state});syncContentCounts();openCollectionManager(collection,index);openItemInspector(collection,index);
}
function imageSlotConfig(path){
 if(path==='heroImage')return {label:'主视觉 KV',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1400,height:1400,fixed:true};
 if(/^tickets\.\d+\.image$/.test(path))return {label:'票务赠品图',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:900,height:900,fixed:true};
 if(/^participation\.\d+\.image$/.test(path))return {label:'活动宣传图',ratio:16/9,ratioLabel:'裁剪框可移动 · 比例 16:9',width:1440,height:810,fixed:true};
 if(/^featuredActivities\.\d+\.image$/.test(path))return {label:'首页活动精选图片',ratio:16/9,ratioLabel:'裁剪框可移动 · 比例 16:9',width:1440,height:810,fixed:true};
 if(/^guests\.\d+\.image$/.test(path))return {label:'嘉宾宣传图',ratio:4/3,ratioLabel:'与嘉宾卡预览一致 · 裁剪框可移动 · 比例 4:3',width:1200,height:900,fixed:true};
 if(/^booths\.\d+\.products\.\d+\.image$/.test(path))return {label:'制品图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1000,height:1000,fixed:true};
 if(path==='venueMap.image')return {label:'场地图',ratio:null,ratioLabel:'裁剪框自由比例',maxSize:2000,free:true};
 if(/^guide\.items\.\d+\.image$/.test(path)){const i=Number(path.match(/^guide\.items\.(\d+)\.image$/)?.[1]||-1),item=state.guide?.items?.[i];return {label:item?.preset==='traffic'?'交通路线图 / 入口示意图':'指南图片',ratio:null,ratioLabel:'裁剪框自由比例',maxSize:1800,free:true}};
 if(/^(freewalk|itasha)\.image$/.test(path))return {label:'活动图片',ratio:.8,ratioLabel:'裁剪框可移动 · 比例 4:5',width:960,height:1200,fixed:true};
 if(/^booths\.\d+\.logo$/.test(path))return {label:'社团 Logo',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:700,height:700,fixed:true};
 if(/^socialLinks\.\d+\.image$/.test(path))return {label:'二维码 / 社群图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:900,height:900,fixed:true};
 if(/^sponsors\.\d+\.logo$/.test(path))return {label:'赞助商 Logo',ratio:1.8,ratioLabel:'裁剪框可移动 · 比例 9:5',width:1080,height:600,fixed:true};
 const cm=path.match(/^customPages\.(\d+)\.items\.\d+\.image$/);
 if(cm){
   const page=state.customPages?.[Number(cm[1])],preset=CUSTOM_PAGE_PRESETS[page?.preset]||CUSTOM_PAGE_PRESETS.custom,ratio=preset.ratio||1.333333;
   return {label:(preset.itemTitle||'展示内容')+'图片',ratio,ratioLabel:'裁剪框可移动 · 页面预设比例',width:ratio<1?960:1200,height:ratio<1?1200:Math.round(1200/ratio),fixed:true};
 }
 return {label:'图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1200,height:1200,fixed:true};
}
function openImageInspector(path){
 const current=getDeep(path);
 if(path==='venueMap.image'||/^guide\.items\.\d+\.image$/.test(path)){
   const guideMatch=path.match(/^guide\.items\.(\d+)\.image$/),guideItem=guideMatch?state.guide?.items?.[Number(guideMatch[1])]:null;
   const isGuideRoute=!!guideItem&&guideItem.preset==='traffic';
   const title=isGuideRoute?'入口示意图 / 交通路线图':'场地图';
   setInspector(title,title,
     '<div class="map-image-actions"><button id="replaceImage" type="button">'+(current?'替换'+title:'上传'+title)+'</button>'+(current?'<button id="removeImage" type="button" class="danger ghost">删除'+title+'</button>':'')+'</div>');
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
   const c=cropContext.returnCollection,i=Number(cropContext.returnIndex);closeImageCropper();
   if(c&&Number.isInteger(i)){if(c.startsWith('custom:'))openCustomPageItemInspector(c.slice(7),i);else if(c.startsWith('product:'))openProductInspector(Number(c.slice(8)),i);else openItemInspector(c,i)}
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
 send({type:'OE_SET_MODE',mode:preview?'preview':'edit'});
 if(preview&&state.entryAnimation?.enabled!==false)setTimeout(()=>send({type:'OE_PREVIEW_ENTRY',state,play:false}),80);
 else if(!preview)setTimeout(()=>send({type:'OE_HIDE_ENTRY_PREVIEW'}),30);
 toast(preview?'预览模式 · 页面交互已启用':'已返回编辑');
}
$('#previewBtn').onclick=()=>setPreview(!preview);
$('#createCustomPageBtn').onclick=openCustomPageCreator;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&preview)setPreview(false)});
$('.page-nav')?.addEventListener('click',e=>{
 const b=e.target.closest('[data-page]');if(!b)return;
 setWorkspace('pages');setStudioPage(b.dataset.page);
});
function reconcilePageAfterHistory(){
 if(String(currentPage).startsWith('custom-')&&!customPageByKey(currentPage)){setStudioPage('home');return}
 if(String(currentPage).startsWith('custom-'))renderPageContentNav(currentPage,{openDefault:false});
}
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(JSON.stringify(state));state=JSON.parse(history.pop());renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});save();syncHistory();syncContentCounts();reconcilePageAfterHistory()};
$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(JSON.stringify(state));state=JSON.parse(future.pop());renderCustomPageRows();send({type:'OE_REPLACE_STATE',state});save();syncHistory();syncContentCounts();reconcilePageAfterHistory()};
$('#backAdminBtn')?.addEventListener('click',()=>{location.href='/admin/'});
$('#publishBtn').onclick=openPublishDialog;
$('#publishClose').onclick=()=>publishDialog.close();
$('#publishCancel').onclick=()=>publishDialog.close();
publishPrimary.onclick=()=>{publishIntent='site';send({type:'OE_EXPORT_HTML'})};
$('#publishDownload').onclick=()=>{publishIntent='download';send({type:'OE_EXPORT_HTML'})};
$('#publishOpen').onclick=()=>{if(publishRecord?.url)window.open(publishRecord.url,'_blank','noopener')};
$('#publishCopy').onclick=async()=>{if(!publishRecord?.url)return;try{await navigator.clipboard.writeText(publishRecord.url);toast('链接已复制')}catch{toast('复制失败')}};
publishSlug.addEventListener('input',()=>{const clean=cleanSlug(publishSlug.value);if(clean!==publishSlug.value)publishSlug.value=clean});
if(projectId!=='default'&&!hasSavedProject){localStorage.setItem(STORAGE,JSON.stringify(state));syncAdminProject()}
syncStudioIdentity();syncPublishButton();renderCustomPageRows();syncModuleControls();syncContentCounts();setWorkspace('pages');bindModuleControls();mountFrame();syncHistory();setStudioPage('home');