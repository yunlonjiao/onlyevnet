const $ = s => document.querySelector(s);
document.documentElement.dataset.onlyeventJs='app';
const $$ = s => [...document.querySelectorAll(s)];
const clone = obj => JSON.parse(JSON.stringify(obj));
const clientId = prefix => `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;

async function api(url, options={}){
  const opts={credentials:'same-origin',...options};
  if(opts.json!==undefined){opts.method=opts.method||'POST';opts.headers={...(opts.headers||{}),'Content-Type':'application/json'};opts.body=JSON.stringify(opts.json);delete opts.json;}
  const res=await fetch(url,opts);
  let data={};try{data=await res.json()}catch{}
  if(!res.ok){const err=new Error(data.error||`请求失败 (${res.status})`);err.status=res.status;throw err;}
  return data;
}

const defaultConfig = {
  "version": "7.20.5",
  "eventName": "",
  "eventTagline": "",
  "eventDate": "",
  "eventLocation": "",
  "announcement": "",
  "ticketUrl": "",
  "heroImage": "",
  "themeColor": "#6d5dfc",
  "accentColor": "#ff6b9b",
  "backgroundColor": "#f7f7fb",
  "radius": 16,
  "textColor": "#151722",
  "mutedColor": "#697181",
  "lineColor": "#e5e7ee",
  "surfaceColor": "#ffffff",
  "headerBgColor": "#ffffff",
  "headerTextColor": "#151722",
  "contentWidth": 1120,
  "sectionSpacing": 76,
  "cardGap": 18,
  "shadowStrength": 5,
  "animationStrength": 100,
  "introAnimationEnabled": true,
  "introLeftTitle": "",
  "introLeftLabel": "ADMIT ONE",
  "introRightTitle": "ONLY\nEVENT",
  "introRightLabel": "",
  "introButtonLabel": "进入活动官网 →",
  "introBackgroundColor": "#ff5f91",
  "introTicketColor": "#ffffff",
  "introInkColor": "#17151b",
  "introHoldMs": 1500,
  "introExitMs": 620,
  "introAnimationStyle": "ticket",
  "introLogoImage": "",
  "decorationsEnabled": true,
  "mobileDockEnabled": true,
  "ipOnlyModuleOrder": ["tickets","projects","guests","passport","booths","schedule","community","sponsors"],
  "ipOnlyHiddenModules": [],
  "ipOnlyElementStyles": {},
  "ipOnlyLabels": {},
  "customCss": "",
  "eventTemplate": "blank",
  "seoTitle": "",
  "seoDescription": "",
  "shareImage": "",
  "faviconImage": "",
  "organizerName": "",
  "organizerContact": "",
  "privacyUrl": "",
  "externalLinks": [],
  "ticketTypes": [],
  "homeSections": [],
  "guests": [],
  "booths": [],
  "schedule": [],
  "venueText": "",
  "mapImage": "",
  "transportText": "",
  "entryText": "",
  "faq": [],
  "visitorSiteUrl": "",
  "features": {
    "guests": false,
    "booths": false,
    "schedule": false,
    "guide": false,
    "faq": false,
    "sponsors": false
  },
  "sponsors": [],
  "transportImage": "",
  "transportMapUrl": "",
  "pageBannerImage": "",
  "community": {
    "title": "",
    "text": "",
    "qqGroup": "",
    "wechatGroup": "",
    "qqQrImage": "",
    "wechatQrImage": "",
    "link": "",
    "linkLabel": ""
  },
  "heroMobileImage": "",
  "portalGlobalArt": {"newsImages":[],"exploreImages":[]}
};

let config = clone(defaultConfig);
let session = { role:'organizer', username:null };
let draggedSectionIndex = null;
let activePreviewPage = 'index.html';
let adminSelectedBooth = 0;
const openEditors = new Set();
let saveState = 'saved';
let previewTimer = null;
let autoSaveTimer = null;
let autoSaveBusy = false;
let autoSaveFailureCount = 0;
let autoSaveRetryTimer = null;
let lastAutoSaveToastAt = 0;
let changeVersion = 0;
let portalLinks = {visitor:''};
let visualEditMode = false;
let pendingVisualImageKey = '';
let visualUndoStack=[];
let visualRedoStack=[];
let visualHistorySnapshot='';
let visualHistoryLock=false;
let visualSelection={mode:'',key:'',extra:''};
let pendingPreviewAnchor=null;
const previewScrollByPage=new Map();
let introPreviewOnce=false;
let introEditorMode=false;

function updateVisualHistoryButtons(){
  const u=$('#visualUndoBtn'),r=$('#visualRedoBtn');
  if(u)u.disabled=!visualEditMode||!visualUndoStack.length;
  if(r)r.disabled=!visualEditMode||!visualRedoStack.length;
}
function resetVisualHistory(){visualUndoStack=[];visualRedoStack=[];visualHistorySnapshot=JSON.stringify(config);updateVisualHistoryButtons();}
function recordVisualHistory(){
  if(!visualEditMode||visualHistoryLock)return;
  const now=JSON.stringify(config);
  if(!visualHistorySnapshot){visualHistorySnapshot=now;return;}
  if(now===visualHistorySnapshot)return;
  visualUndoStack.push(visualHistorySnapshot);if(visualUndoStack.length>60)visualUndoStack.shift();
  visualRedoStack=[];visualHistorySnapshot=now;updateVisualHistoryButtons();
}
function restoreVisualHistory(direction){
  const source=direction==='undo'?visualUndoStack:visualRedoStack,target=direction==='undo'?visualRedoStack:visualUndoStack;
  if(!source.length)return;
  const current=JSON.stringify(config),snapshot=source.pop();target.push(current);
  visualHistoryLock=true;config=normalizeConfig(JSON.parse(snapshot));visualHistorySnapshot=JSON.stringify(config);markDirty();visualHistoryLock=false;
  renderAll(false);renderVisualThemeControls();
  if(visualSelection.mode)openVisualInspector(visualSelection.mode,visualSelection.key,visualSelection.extra);
  updateVisualHistoryButtons();toast(direction==='undo'?'已撤销':'已重做');
}

function restoreManagementDefaults(){
  if(!confirm(`重置网站基础设置？

嘉宾、摊位、制品、日程、指南、FAQ 与合作方数据不会删除。`))return;
  const keep={guests:config.guests,booths:config.booths,schedule:config.schedule,venueText:config.venueText,mapImage:config.mapImage,transportText:config.transportText,transportImage:config.transportImage,transportMapUrl:config.transportMapUrl,entryText:config.entryText,faq:config.faq,sponsors:config.sponsors,visitorSiteUrl:config.visitorSiteUrl};
  const keys=['eventName','eventTagline','eventDate','eventLocation','announcement','ticketUrl','features','heroImage','heroMobileImage','pageBannerImage','community','themeColor','accentColor','backgroundColor','radius','seoTitle','seoDescription','homeSections'];
  keys.forEach(k=>config[k]=clone(defaultConfig[k]));Object.assign(config,keep);markDirty();renderAll();toast('已重置');
}


function setSaveStatus(text,mode='dirty'){
  const el=$('#saveStatus');
  if(el){el.textContent=text; el.className=`save-status ${mode}`;}
  const vel=$('#visualSaveStatus');if(vel){vel.textContent=text;vel.className=`visual-save-status ${mode}`;}
}
function markDirty(){
  recordVisualHistory();
  saveState='dirty';changeVersion++;
  setSaveStatus(session.role==='organizer'?'正在编辑…':'有未保存修改','dirty');
  if(session.role==='organizer')scheduleOrganizerAutoSave();
}
function markSaved(text='已保存'){saveState='saved';setSaveStatus(text,'saved');}
function scheduleOrganizerAutoSave(delay=1200){
  if(session.role!=='organizer')return;
  clearTimeout(autoSaveTimer);clearTimeout(autoSaveRetryTimer);
  autoSaveTimer=setTimeout(saveOrganizerNow,delay);
}
async function putOrganizerConfig(payload){
  const save=()=>api('/api/config',{method:'PUT',json:{config:payload}});
  try{return await save();}
  catch(err){
    if(err?.status===401){location.href='/admin/';return;}
    throw err;
  }
}
async function saveOrganizerNow(){
  if(session.role!=='organizer'||saveState!=='dirty')return;
  if(autoSaveBusy){scheduleOrganizerAutoSave(900);return;}
  autoSaveBusy=true;const version=changeVersion;const payload=clone(config);
  setSaveStatus('正在自动保存…','dirty');
  try{
    await putOrganizerConfig(payload);
    autoSaveFailureCount=0;
    if(changeVersion===version)markSaved('已自动保存');
    else{setSaveStatus('有新修改，继续保存…','dirty');scheduleOrganizerAutoSave(700);}
  }catch(err){
    saveState='dirty';autoSaveFailureCount++;
    const delay=Math.min(15000,1500*Math.pow(2,Math.min(autoSaveFailureCount-1,3)));
    setSaveStatus(`自动保存失败 · ${Math.ceil(delay/1000)}秒后重试`,'dirty');
    const now=Date.now();
    if(now-lastAutoSaveToastAt>8000){toast(`自动保存失败：${err.message}，系统会自动重试`);lastAutoSaveToastAt=now;}
    console.error('auto save failed',err);
    autoSaveRetryTimer=setTimeout(saveOrganizerNow,delay);
  }finally{autoSaveBusy=false;}
}
function editorKey(kind,idx,scope=''){return `${kind}:${scope}:${idx}`;}
function bindDetailsState(el,key){
  el.open=openEditors.has(key);
  el.addEventListener('toggle',()=>{if(el.open)openEditors.add(key);else openEditors.delete(key)});
}
function imagePreviewHtml(src,alt='图片预览'){
  return src?`<img class="cover-preview image-preview" src="${escAttr(src)}" alt="${escAttr(alt)}">`:'';
}
function boothLogoPreviewHtml(src,alt='社团 Logo'){
  return `<div class="booth-logo-preview-frame">${src?`<img class="booth-logo-preview" src="${escAttr(src)}" alt="${escAttr(alt)}">`:'<div class="booth-logo-preview-empty">暂无 Logo</div>'}</div>`;
}
function appendImageUrl(images,url,max=6){
  const value=String(url||'').trim();
  if(!value)return false;
  if(images.length>=max){alert(`最多保留 ${max} 张图片。`);return false;}
  images.push(value); return true;
}

function esc(str=''){return String(str).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));}
function escAttr(str=''){return esc(str).replace(/`/g,'&#96;');}
function safeCustomCss(str=''){return String(str||'').replace(/<\/style/gi,'<\\/style');}
function safeUrl(url='#'){const s=String(url||'').trim();return /^(https?:|mailto:|tel:|#|[\w./-]+\.html(?:#.*)?$)/i.test(s)?s:'#';}
function textLines(text=''){return String(text).split(/\r?\n/).map(x=>x.trim()).filter(Boolean);}
function sectionHint(type){return ({text:'每行按一个段落显示。',cards:'每行：标题|说明',schedule:'每行：时间|节目名称',stats:'每行：数字|说明',image:'使用下方按钮上传并框选图片范围；文字框只填写图片说明。',cta:'每行：按钮文字|链接'})[type]||'';}
function slugColor(hex,alpha='18'){return /^#[0-9a-f]{6}$/i.test(hex)?hex+alpha:'rgba(109,84,255,.1)';}
function boothPageName(index){return `booth-${index+1}.html`;}
function publishedBooths(c=config){return c.booths.map((b,i)=>({b,i})).filter(x=>x.b.published!==false);}
function productBlank(){return {id:clientId('product'),name:'新制品',category:'同人制品',price:'',availability:'',description:'',images:[],published:true};}
function participantBlank(){return {id:clientId('participant'),name:'新成员',role:'出演成员',image:'',bio:''};}
function normalizeParticipant(p={}){return {id:p.id||clientId('participant'),name:p.name||'',role:p.role||'',image:p.image||'',bio:p.bio||''};}
function normalizeGuestWork(w={}){return {id:w.id||clientId('guest-work'),title:String(w.title||''),image:String(w.image||''),url:String(w.url||''),description:String(w.description||'')};}
function normalizeGuestLink(l={}){return {id:l.id||clientId('guest-link'),platform:String(l.platform||'Bilibili'),url:String(l.url||'')};}
function normalizeGuest(g={}){return {id:g.id||clientId('guest'),name:String(g.name||'未命名嘉宾'),role:String(g.role||''),image:String(g.image||''),bio:String(g.bio||''),works:Array.isArray(g.works)?g.works.map(normalizeGuestWork):[],links:Array.isArray(g.links)?g.links.map(normalizeGuestLink):[]};}
function normalizeHomeSection(sec={}){return {id:sec.id||clientId('home'),title:String(sec.title||'首页模块'),type:['text','cards','schedule','stats','image','cta'].includes(sec.type)?sec.type:'text',content:String(sec.content||'')};}
function normalizeScheduleItem(x={}){return {id:x.id||clientId('schedule'),day:String(x.day||''),time:x.time||'10:00',endTime:x.endTime||'',title:x.title||'未命名活动',stage:x.stage||'',type:x.type||'舞台',image:x.image||'',description:x.description||'',participants:Array.isArray(x.participants)?x.participants.map(normalizeParticipant):[]};}

function normalizeBooth(b,i){
  return {
    id:b.id||clientId('booth'),
    code:b.code||`A${String(i+1).padStart(2,'0')}`,
    name:b.name||'未命名摊位', category:b.category||'其他', tags:b.tags||'', note:b.note||'',
    description:b.description||b.note||'', contact:b.contact||'', social:b.social||'', coverImage:b.coverImage||'',
    mapX:(b.mapX!==null&&b.mapX!==''&&Number.isFinite(Number(b.mapX)))?Math.max(0,Math.min(100,Number(b.mapX))):null,
    mapY:(b.mapY!==null&&b.mapY!==''&&Number.isFinite(Number(b.mapY)))?Math.max(0,Math.min(100,Number(b.mapY))):null,
    published:b.published!==false,
    products:Array.isArray(b.products)?b.products.map(p=>({id:p.id||clientId('product'),name:p.name||'未命名制品',category:p.category||'',price:p.price||'',availability:p.availability||'',description:p.description||'',images:Array.isArray(p.images)?p.images.filter(Boolean):p.image?[p.image]:[],published:p.published!==false})) : []
  };
}
function normalizeCommunity(x={}){return {title:String(x.title||'加入官方群'),text:String(x.text||''),qqGroup:String(x.qqGroup||''),wechatGroup:String(x.wechatGroup||''),qqQrImage:String(x.qqQrImage||''),wechatQrImage:String(x.wechatQrImage||''),link:String(x.link||''),linkLabel:String(x.linkLabel||'打开报名 / 群公告')};}
function normalizeTicketType(x={}){return {id:x.id||clientId('ticket-type'),name:String(x.name||''),price:String(x.price||''),gift:String(x.gift||''),note:String(x.note||''),published:x.published!==false};}

function normalizeSponsor(s={}){
  return {
    id:s.id||clientId('sponsor'),
    name:String(s.name||''),
    type:String(s.type||'合作方'),
    logo:String(s.logo||''),
    url:String(s.url||''),
    note:String(s.note||''),
    published:s.published!==false
  };
}
function normalizeConfig(x){
  const merged={...clone(defaultConfig),...x};
  merged.version="7.20.5";
  merged.eventTemplate=["ip-only","event-portal","doujin-creative","game-immersive","live-stage","theme-visual","portal-global","immersive","doujin-directory","editorial","live-lineup","live-timetable","poster","split-story","cn-portal","exhibitor-search","game-release","acg-visual","blank","comprehensive","doujin","live","small"].includes(x.eventTemplate)?x.eventTemplate:'blank';
  const rawHome=(Array.isArray(x.homeSections)?x.homeSections:Array.isArray(x.sections)?x.sections:clone(defaultConfig.homeSections)).map(normalizeHomeSection);
  merged.homeSections=rawHome;
  merged.community=normalizeCommunity(x.community||defaultConfig.community);
  merged.pageBannerImage=String(x.pageBannerImage||'');
  merged.guests=(Array.isArray(x.guests)?x.guests:[]).map(normalizeGuest);
  merged.sponsors=Array.isArray(x.sponsors)?x.sponsors.map(normalizeSponsor):[];
  merged.booths=(Array.isArray(x.booths)?x.booths:[]).map(normalizeBooth);
  merged.schedule=Array.isArray(x.schedule)?x.schedule.map(normalizeScheduleItem):[];
  merged.faq=Array.isArray(x.faq)?x.faq:[];
  merged.visitorSiteUrl=String(x.visitorSiteUrl||'');
  merged.heroMobileImage=String(x.heroMobileImage||'');
  const pga=x.portalGlobalArt&&typeof x.portalGlobalArt==='object'?x.portalGlobalArt:{};
  merged.portalGlobalArt={
    newsImages:Array.isArray(pga.newsImages)?pga.newsImages.slice(0,6).map(v=>String(v||'')):[],
    exploreImages:Array.isArray(pga.exploreImages)?pga.exploreImages.slice(0,10).map(v=>String(v||'')):[]
  };
  const f=x.features&&typeof x.features==='object'?x.features:{};
  merged.features={guests:f.guests===true,booths:f.booths===true,schedule:f.schedule===true,guide:f.guide===true,faq:f.faq===true,sponsors:f.sponsors===true};
  merged.externalLinks=(Array.isArray(x.externalLinks)?x.externalLinks:[]).map(v=>({id:v.id||clientId('link'),label:String(v.label||''),url:String(v.url||''),kind:String(v.kind||'link')}));if(x.ticketUrl&&!merged.externalLinks.some(v=>v.kind==='ticket'))merged.externalLinks.unshift({id:clientId('link'),label:'前往购票平台',url:String(x.ticketUrl),kind:'ticket'});merged.ticketUrl='';merged.ticketTypes=(Array.isArray(x.ticketTypes)?x.ticketTypes:[]).map(normalizeTicketType);
  merged.shareImage=String(x.shareImage||'');merged.faviconImage=String(x.faviconImage||'');merged.organizerName=String(x.organizerName||'');merged.organizerContact=String(x.organizerContact||'');merged.privacyUrl=String(x.privacyUrl||'');
  merged.textColor=String(x.textColor||defaultConfig.textColor);merged.mutedColor=String(x.mutedColor||defaultConfig.mutedColor);merged.lineColor=String(x.lineColor||defaultConfig.lineColor);merged.surfaceColor=String(x.surfaceColor||defaultConfig.surfaceColor);merged.headerBgColor=String(x.headerBgColor||defaultConfig.headerBgColor);merged.headerTextColor=String(x.headerTextColor||defaultConfig.headerTextColor);
  merged.contentWidth=Math.max(760,Math.min(1440,Number(x.contentWidth)||defaultConfig.contentWidth));merged.sectionSpacing=Math.max(32,Math.min(120,Number(x.sectionSpacing)||defaultConfig.sectionSpacing));merged.cardGap=Math.max(0,Math.min(40,Number(x.cardGap)||defaultConfig.cardGap));merged.shadowStrength=Math.max(0,Math.min(30,Number(x.shadowStrength)||defaultConfig.shadowStrength));merged.animationStrength=Math.max(0,Math.min(100,Number(x.animationStrength)||defaultConfig.animationStrength));merged.introAnimationEnabled=x.introAnimationEnabled!==false;merged.introLeftTitle=String(x.introLeftTitle||'');merged.introLeftLabel=String(x.introLeftLabel||defaultConfig.introLeftLabel);merged.introRightTitle=String(x.introRightTitle||defaultConfig.introRightTitle);merged.introRightLabel=String(x.introRightLabel||'');merged.introButtonLabel=String(x.introButtonLabel||defaultConfig.introButtonLabel);merged.introBackgroundColor=/^#[0-9a-f]{6}$/i.test(x.introBackgroundColor||'')?x.introBackgroundColor:defaultConfig.introBackgroundColor;merged.introTicketColor=/^#[0-9a-f]{6}$/i.test(x.introTicketColor||'')?x.introTicketColor:defaultConfig.introTicketColor;merged.introInkColor=/^#[0-9a-f]{6}$/i.test(x.introInkColor||'')?x.introInkColor:defaultConfig.introInkColor;merged.introHoldMs=Math.max(300,Math.min(8000,Number(x.introHoldMs)||defaultConfig.introHoldMs));merged.introExitMs=Math.max(200,Math.min(2500,Number(x.introExitMs)||defaultConfig.introExitMs));merged.introAnimationStyle=['ticket','fade','slide'].includes(x.introAnimationStyle)?x.introAnimationStyle:'ticket';merged.introLogoImage=String(x.introLogoImage||'');merged.decorationsEnabled=x.decorationsEnabled!==false;merged.mobileDockEnabled=x.mobileDockEnabled!==false;merged.customCss=String(x.customCss||'');
  const ipKeys=['tickets','projects','guests','passport','booths','schedule','community','sponsors'];const rawOrder=Array.isArray(x.ipOnlyModuleOrder)?x.ipOnlyModuleOrder.filter(k=>ipKeys.includes(k)):[];merged.ipOnlyModuleOrder=[...new Set([...rawOrder,...ipKeys])];merged.ipOnlyHiddenModules=Array.isArray(x.ipOnlyHiddenModules)?[...new Set(x.ipOnlyHiddenModules.filter(k=>ipKeys.includes(k)))]:[];const rawLabels=x.ipOnlyLabels&&typeof x.ipOnlyLabels==='object'?x.ipOnlyLabels:{};merged.ipOnlyLabels={};for(const [lk,lv] of Object.entries(rawLabels))merged.ipOnlyLabels[String(lk).slice(0,100)]=String(lv??'').slice(0,240);const rawElementStyles=x.ipOnlyElementStyles&&typeof x.ipOnlyElementStyles==='object'?x.ipOnlyElementStyles:{};merged.ipOnlyElementStyles={};for(const [sk,sv] of Object.entries(rawElementStyles)){if(!sv||typeof sv!=='object')continue;merged.ipOnlyElementStyles[String(sk).slice(0,120)]={fontSize:Math.max(0,Math.min(160,Number(sv.fontSize)||0)),fontWeight:Math.max(0,Math.min(950,Number(sv.fontWeight)||0)),textAlign:['left','center','right'].includes(sv.textAlign)?sv.textAlign:'',paddingY:Math.max(0,Math.min(80,Number(sv.paddingY)||0)),paddingX:Math.max(0,Math.min(80,Number(sv.paddingX)||0)),marginTop:Math.max(0,Math.min(120,Number(sv.marginTop)||0)),marginBottom:Math.max(0,Math.min(120,Number(sv.marginBottom)||0)),width:Math.max(0,Math.min(100,Number(sv.width)||0)),radius:Math.max(0,Math.min(48,Number(sv.radius)||0)),letterSpacing:Math.max(-5,Math.min(20,Number(sv.letterSpacing)||0))};}
  return merged;
}

const baseFields = ['eventName','eventTagline','eventDate','eventLocation','announcement','ticketUrl','visitorSiteUrl','themeColor','accentColor','backgroundColor','radius','textColor','mutedColor','lineColor','surfaceColor','headerBgColor','headerTextColor','contentWidth','sectionSpacing','cardGap','shadowStrength','animationStrength','customCss','seoTitle','seoDescription','organizerName','organizerContact','privacyUrl','venueText','transportText','transportMapUrl','entryText'];
function syncBaseInputs(){
  baseFields.forEach(k=>{const el=$('#'+k);if(el)el.value=config[k]??''});
  $('#radiusValue').textContent=config.radius;[['contentWidth','contentWidthValue'],['sectionSpacing','sectionSpacingValue'],['cardGap','cardGapValue'],['shadowStrength','shadowStrengthValue'],['animationStrength','animationStrengthValue']].forEach(([k,id])=>{const el=$('#'+id);if(el)el.textContent=config[k]});['introAnimationEnabled','decorationsEnabled','mobileDockEnabled'].forEach(k=>{const el=$('#'+k);if(el)el.checked=config[k]!==false;});
  const mp=$('#mapPreview');if(mp){mp.src=config.mapImage||'';mp.classList.toggle('hidden',!config.mapImage)}
  const tp=$('#transportImagePreview');if(tp){tp.src=config.transportImage||'';tp.classList.toggle('hidden',!config.transportImage)}
  const dp=$('#heroDesktopVisualPreview');if(dp){const src=config.heroImage||'';dp.style.backgroundImage=src?`linear-gradient(180deg,rgba(10,12,18,.05),rgba(10,12,18,.52)),url("${String(src).replace(/"/g,'%22')}")`:'';dp.style.backgroundPosition='center';if($('#heroDesktopPreviewTitle'))$('#heroDesktopPreviewTitle').textContent=config.eventName||'活动名称';if($('#heroDesktopPreviewMeta'))$('#heroDesktopPreviewMeta').textContent=[config.eventDate,config.eventLocation].filter(Boolean).join(' · ');}
  const mh=$('#heroMobilePreview');if(mh){const src=config.heroMobileImage||config.heroImage||'';mh.style.backgroundImage=src?`linear-gradient(180deg,rgba(10,12,18,.04),rgba(10,12,18,.58)),url("${String(src).replace(/"/g,'%22')}")`:'';mh.style.backgroundPosition='center';if($('#heroMobilePreviewTitle'))$('#heroMobilePreviewTitle').textContent=config.eventName||'活动名称';if($('#heroMobilePreviewMeta'))$('#heroMobilePreviewMeta').textContent=[config.eventDate,config.eventLocation].filter(Boolean).join(' · ');}
  const bp=$('#pageBannerPreview');if(bp){const src=config.pageBannerImage||'',theme=/^#[0-9a-f]{6}$/i.test(config.themeColor||'')?config.themeColor:'#6d54ff',accent=/^#[0-9a-f]{6}$/i.test(config.accentColor||'')?config.accentColor:'#ff4f8b';bp.style.backgroundImage=src?`linear-gradient(90deg,rgba(12,14,20,.72),rgba(12,14,20,.24)),url("${String(src).replace(/"/g,'%22')}")`:`linear-gradient(135deg,${theme}26,${accent}22)`;const label=bp.querySelector('.page-banner-preview-copy small');if(label)label.textContent=src?'CUSTOM BANNER PREVIEW':'DEFAULT GRADIENT PREVIEW';}
  syncCommunityInputs();renderExternalLinks();renderTicketTypes();renderBrandAssets();renderPortalGlobalArt();
}
function normalizePortalInput(value){
  let s=String(value||'').trim();
  if(!s)return '';
  if(!/^https?:\/\//i.test(s))s='https://'+s;
  try{const u=new URL(s);if(!/^https?:$/.test(u.protocol))return '';return u.href;}catch{return s;}
}
function updatePortalLinksFromConfig(){const autoVisitor=location.origin+'/';const publicBase=portalLinks.publicUrl||'';portalLinks.visitor=config.visitorSiteUrl?normalizePortalInput(config.visitorSiteUrl):(publicBase||autoVisitor);if($('#visitorSiteLink'))$('#visitorSiteLink').value=portalLinks.visitor;}
function bindBaseInputs(){
  baseFields.forEach(k=>{const el=$('#'+k);if(!el)return;el.addEventListener('input',e=>{config[k]=['radius','contentWidth','sectionSpacing','cardGap','shadowStrength','animationStrength'].includes(k)?Number(e.target.value):e.target.value;if(k==='radius')$('#radiusValue').textContent=config.radius;if(k==='contentWidth'&&$('#contentWidthValue'))$('#contentWidthValue').textContent=config.contentWidth;if(k==='sectionSpacing'&&$('#sectionSpacingValue'))$('#sectionSpacingValue').textContent=config.sectionSpacing;if(k==='cardGap'&&$('#cardGapValue'))$('#cardGapValue').textContent=config.cardGap;if(k==='shadowStrength'&&$('#shadowStrengthValue'))$('#shadowStrengthValue').textContent=config.shadowStrength;if(k==='animationStrength'&&$('#animationStrengthValue'))$('#animationStrengthValue').textContent=config.animationStrength;if(k==='visitorSiteUrl')updatePortalLinksFromConfig();if(k==='mapImage'){const mp=$('#mapPreview');if(mp){mp.src=config.mapImage||'';mp.classList.toggle('hidden',!config.mapImage)}renderBoothMapEditor();}if(k==='transportImage'){const tp=$('#transportImagePreview');if(tp){tp.src=config.transportImage||'';tp.classList.toggle('hidden',!config.transportImage)}}markDirty();renderPreview();});if(k==='visitorSiteUrl'){el.addEventListener('blur',()=>{const v=normalizePortalInput(el.value);if(v!==el.value){el.value=v;config[k]=v;updatePortalLinksFromConfig();markDirty();}});}});
  ['introAnimationEnabled','decorationsEnabled','mobileDockEnabled'].forEach(k=>{const el=$('#'+k);if(!el)return;el.addEventListener('change',e=>{config[k]=e.target.checked;markDirty();renderPreview();});});
}

const featureKeys=['guests','booths','schedule','guide','faq','sponsors'];
function featureEnabled(key,c=config){return !c.features||c.features[key]!==false;}


function syncFeatureInputs(){const map={guests:'featureGuests',booths:'featureBooths',schedule:'featureSchedule',guide:'featureGuide',faq:'featureFaq',sponsors:'featureSponsors'};for(const [k,id] of Object.entries(map)){const el=$('#'+id);if(el)el.checked=featureEnabled(k);}}
function updateFeatureVisibility(){$$('[data-feature-nav]').forEach(el=>el.classList.toggle('feature-disabled',!featureEnabled(el.dataset.featureNav)));$('#boothContentSection')?.classList.toggle('hidden',!featureEnabled('booths'));$$('[data-feature-jump]').forEach(el=>el.classList.toggle('hidden',!featureEnabled(el.dataset.featureJump)));const active=$('.editor-tabs button.active');if(active?.dataset.featureNav&&!featureEnabled(active.dataset.featureNav))setTab('site');}
function bindFeatureInputs(){const map={featureGuests:'guests',featureBooths:'booths',featureSchedule:'schedule',featureGuide:'guide',featureFaq:'faq',featureSponsors:'sponsors'};for(const [id,k] of Object.entries(map)){$('#'+id)?.addEventListener('change',e=>{config.features={...(config.features||{}),[k]:!!e.target.checked};updateFeatureVisibility();rebuildPreviewOptions(true);markDirty();renderPreview(true);});}}


const TEMPLATE_PRESETS={
  'ip-only':{name:'IP ONLY / 作品主题展',description:'围绕单一作品 IP 的中小型综合活动：摊位、嘉宾、舞台、COS、地图与特别企划按需开启。',features:{guests:true,booths:true,schedule:true,guide:true,faq:true,sponsors:true},design:{themeColor:'#ff5f91',accentColor:'#ffe45c',backgroundColor:'#fffaf7',textColor:'#17151b',mutedColor:'#716871',lineColor:'#17151b',surfaceColor:'#ffffff',headerBgColor:'#fffaf7',headerTextColor:'#17151b',radius:18,contentWidth:1180,sectionSpacing:82,cardGap:18,shadowStrength:12,animationStrength:100,introAnimationEnabled:true,decorationsEnabled:true,mobileDockEnabled:true}},
  'doujin-creative':{name:'同人创作展 / 创作者市集',description:'以创作者、社团、摊位、作品与制品为核心，融合目录效率和杂志式作品展示。',features:{guests:false,booths:true,schedule:false,guide:true,faq:true,sponsors:true}},
  'live-stage':{name:'Live / 舞台演出',description:'以出演阵容、节目时间、票务和场馆为核心，适合二次元 Live、DJ、声优和舞台活动。',features:{guests:true,booths:false,schedule:true,guide:true,faq:true,sponsors:true}},
  'theme-visual':{name:'小型主题企划',description:'适合 CP ONLY、生日会、快闪、COS 聚会、痛车、放映等内容精简但重视 KV 的活动。',features:{guests:false,booths:false,schedule:true,guide:true,faq:true,sponsors:false}},
  'event-portal':{name:'综合漫展 / 大型活动门户（旧版兼容）',description:'旧项目兼容模板。',features:{guests:true,booths:true,schedule:true,guide:true,faq:true,sponsors:true}},
  'game-immersive':{name:'游戏 / 沉浸互动活动（旧版兼容）',description:'旧项目兼容模板。',features:{guests:true,booths:false,schedule:true,guide:true,faq:true,sponsors:true}},
  'portal-global':{name:"国际综合活动 · 门户型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":true,"booths":true,"schedule":true,"guide":true,"faq":true,"sponsors":true}},
  'immersive':{name:"主题企划 · 沉浸章节型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":false}},
  'doujin-directory':{name:"同人 / ONLY · 社团目录型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":false,"booths":true,"schedule":false,"guide":true,"faq":true,"sponsors":false}},
  'editorial':{name:"同人创作活动 · 杂志专题型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":true,"booths":true,"schedule":false,"guide":true,"faq":true,"sponsors":true}},
  'live-lineup':{name:"Live / 舞台 · 阵容视觉型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":true}},
  'live-timetable':{name:"多舞台活动 · 时间表型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":true}},
  'poster':{name:"小型主题活动 · 视觉海报型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":false,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":false}},
  'split-story':{name:"周年企划 · 分屏叙事型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":false}},
  'cn-portal':{name:"大型综合活动 · 中文门户型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":true,"booths":true,"schedule":true,"guide":true,"faq":true,"sponsors":true}},
  'exhibitor-search':{name:"商业展会 · 展商检索型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":false,"booths":true,"schedule":false,"guide":true,"faq":true,"sponsors":true}},
  'game-release':{name:"游戏发布会 · 内容发布型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":true,"booths":false,"schedule":true,"guide":true,"faq":true,"sponsors":true}},
  'acg-visual':{name:"二次元活动 · 青年视觉型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":true,"booths":true,"schedule":true,"guide":true,"faq":true,"sponsors":true}},
  'blank':{name:"空白模板 · 自由搭建型",description:"保留该模板的独立视觉结构、动效与内容优先级。",features:{"guests":false,"booths":false,"schedule":false,"guide":false,"faq":false,"sponsors":false}},
  'comprehensive':{name:'综合漫展（旧版兼容）',description:'旧项目兼容模板。',features:{guests:true,booths:true,schedule:true,guide:true,faq:true,sponsors:true}},
  'doujin':{name:'同人 / ONLY（旧版兼容）',description:'旧项目兼容模板。',features:{guests:false,booths:true,schedule:false,guide:true,faq:true,sponsors:false}},
  'live':{name:'Live / 舞台（旧版兼容）',description:'旧项目兼容模板。',features:{guests:true,booths:false,schedule:true,guide:true,faq:true,sponsors:false}},
  'small':{name:'小型主题活动（旧版兼容）',description:'旧项目兼容模板。',features:{guests:false,booths:false,schedule:true,guide:true,faq:true,sponsors:false}}
};
const TEMPLATE_FAMILY={"ip-only":"comprehensive","event-portal":"comprehensive","doujin-creative":"doujin","game-immersive":"comprehensive","live-stage":"live","theme-visual":"small","portal-global":"comprehensive","immersive":"small","doujin-directory":"doujin","editorial":"doujin","live-lineup":"live","live-timetable":"live","poster":"small","split-story":"small","cn-portal":"comprehensive","exhibitor-search":"comprehensive","game-release":"comprehensive","acg-visual":"comprehensive","blank":"blank","comprehensive":"comprehensive","doujin":"doujin","live":"live","small":"small"};
function templateFamily(id){return TEMPLATE_FAMILY[id]||'blank';}
function templatePreset(){return TEMPLATE_PRESETS[config.eventTemplate]||TEMPLATE_PRESETS.blank;}

// Template adapters sit on top of the shared CMS data layer. They own the visual component tree
// for a template without duplicating organizer data or publishing logic.
const TEMPLATE_ADAPTERS={
  'ip-only':{
    id:'ip-only-01-v1',
    editor:{directVisual:true,introOnCreate:true,introEditor:true,heroDesktopAspect:1,heroMobileAspect:3/4},
    apply(c){c.ipOnlyAdapter='ip-only-01-v1';if(!Array.isArray(c.ipOnlyModuleOrder))c.ipOnlyModuleOrder=['tickets','projects','guests','passport','booths','schedule','community','sponsors'];if(!Array.isArray(c.ipOnlyHiddenModules))c.ipOnlyHiddenModules=[];return c;},
    buildHome(c){return buildIpOnlyHome(c);},
    nav(c,current){return ipOnlyNavHtml(c,current);},
    footer(c){return ipOnlyFooterHtml(c);},
    mobileNav(c,current){return ipOnlyMobileNavHtml(c,current);}
  }
};
function templateAdapter(c=config){return TEMPLATE_ADAPTERS[c?.eventTemplate||'']||null;}

function syncTemplatePicker(){
  const p=templatePreset();
  if($('#currentTemplateName'))$('#currentTemplateName').textContent=p.name;
  if($('#currentTemplateDescription'))$('#currentTemplateDescription').textContent=p.description;
  const preview=$('#templatePresetPreview');if(preview){preview.className=`template-preset-preview ${config.eventTemplate||'blank'} ${templateFamily(config.eventTemplate||'blank')}`;preview.innerHTML='<i></i><i></i><i></i><i></i><i></i>';}
  const art=$('#heroArtHint');if(art){art.textContent=(config.eventTemplate==='ip-only')?'IP ONLY 图片建议：桌面与手机 KV 分别上传。KV 本身可以包含角色、Logo 与标题，网站负责承载日期、地点和活动入口；不自动识别角色、不自动重排原图。':(['portal-global','event-portal'].includes(config.eventTemplate))?'综合门户图片建议：桌面图优先用横向人群、展馆或活动现场；手机版建议单独上传 3:4 图。':'';art.classList.toggle('hidden',!art.textContent);}
}
function applyDefaultTemplatePreset(){
  const p=templatePreset();
  if(!confirm(`应用「${p.name}」默认结构与视觉？\n\n会应用该模板的栏目、排版、颜色、圆角、间距与动效默认值，但不会删除嘉宾、摊位、日程、图片、票种等已经填写的活动内容。`))return;
  config.features=clone(p.features);
  if(p.design)Object.assign(config,clone(p.design));
  if(config.eventTemplate==='ip-only'){config.ipOnlyModuleOrder=['tickets','projects','guests','passport','booths','schedule','community','sponsors'];config.ipOnlyHiddenModules=[];}
  templateAdapter(config)?.apply?.(config);
  updateFeatureVisibility();syncFeatureInputs();rebuildPreviewOptions(true);markDirty();renderAll();toast(`已应用「${p.name}」默认模板与专用适配`);
}
function bindTemplatePicker(){$('#applyDefaultTemplateBtn')?.addEventListener('click',applyDefaultTemplatePreset);}

function applyRole(){$$('[data-role="organizer"]').forEach(el=>el.classList.remove('hidden'));if($('#saveBtn'))$('#saveBtn').textContent='手动保存';const activeTab=$('.editor-tabs button.active')?.dataset.tab;const allowed=['site','publish','guests','booths','schedule','guide','faq','sponsors'];setTab(allowed.includes(activeTab)?activeTab:'site');rebuildPreviewOptions();renderAll(false);}
function setTab(name){
  $$('.editor-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
  $$('.tab-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===name));
  const labels={site:'高级管理',publish:'发布',guests:'嘉宾',booths:'摊位 / 社团',schedule:'日程',guide:'指南',faq:'FAQ',sponsors:'合作'};
  if($('#pageTitle'))$('#pageTitle').textContent=labels[name]||'漫展管理';
  if($('#breadcrumb'))$('#breadcrumb').textContent=`漫展管理 / ${labels[name]||'内容'}`;
  const pageByTab={site:'index.html',publish:'index.html',guests:'guests.html',booths:'booths.html',schedule:'schedule.html',guide:'guide.html',faq:'faq.html',sponsors:'sponsors.html'};
  if(pageByTab[name]){activePreviewPage=pageByTab[name];rebuildPreviewOptions(true);renderPreview(true);}
}
$('#editorTabs').addEventListener('click',e=>{const btn=e.target.closest('button[data-tab]');if(btn&&!btn.classList.contains('hidden'))setTab(btn.dataset.tab);});

document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-scroll-target]');
  if(!btn)return;
  const target=document.getElementById(btn.dataset.scrollTarget);
  if(target&&!target.classList.contains('hidden'))target.scrollIntoView({behavior:'smooth',block:'start'});
});
function renderContentJumpbar(){
  const root=$('#contentJumpbar');if(!root)return;
  const fixed=[['contentBasic','基础设置'],['contentFeatures','栏目开关'],['contentVisual','首页视觉'],['contentHome','首页模块']];
  const dynamic=(config.homeSections||[]).map((sec,i)=>[`home-section-${sec.id}`,sec.title||`模块 ${i+1}`]);
  const tail=[['contentCommunity','社群 / 报名'],['contentSeo','SEO / 分享']];
  root.innerHTML=[...fixed,...dynamic,...tail].map(([id,label],i)=>`<button type="button" data-scroll-target="${escAttr(id)}" class="${i>=fixed.length&&i<fixed.length+dynamic.length?'module-jump':''}">${esc(label)}</button>`).join('');
}

function renderSectionEditors(){
  const list=$('#sectionList'); list.innerHTML='';
  config.homeSections.forEach((sec,idx)=>{
    const el=$('#sectionEditorTemplate').content.firstElementChild.cloneNode(true); el.dataset.index=idx; el.id=`home-section-${sec.id}`;
    const title=el.querySelector('.section-title-input'), type=el.querySelector('.section-type'), content=el.querySelector('.section-content'), hint=el.querySelector('.hint'), orderInput=el.querySelector('.section-order-input');
    title.value=sec.title; type.value=sec.type; content.value=sec.content; hint.textContent=sectionHint(sec.type); if(orderInput)orderInput.value=idx+1;
    title.oninput=e=>{config.homeSections[idx].title=e.target.value;markDirty();renderContentJumpbar();renderPreview()};
    type.onchange=e=>{config.homeSections[idx].type=e.target.value;hint.textContent=sectionHint(e.target.value);markDirty();renderPreview();renderSectionEditors()};
    content.oninput=e=>{if(sec.type==='image'){const lines=String(sec.content||'').split(/\r?\n/),src=(lines[0]||'').trim();sec.content=[src,e.target.value].filter((x,i)=>i===0||x!=='').join('\n');}else config.homeSections[idx].content=e.target.value;markDirty();renderPreview()};
    if(orderInput)orderInput.onchange=e=>{let target=Math.max(1,Math.min(config.homeSections.length,Math.round(Number(e.target.value)||idx+1)))-1;if(target===idx){e.target.value=idx+1;return;}const[moved]=config.homeSections.splice(idx,1);config.homeSections.splice(target,0,moved);markDirty();renderAll();setTimeout(()=>document.getElementById(`home-section-${moved.id}`)?.scrollIntoView({block:'center'}),0);};
    el.querySelector('.delete-section').onclick=()=>{config.homeSections.splice(idx,1);markDirty();renderAll()};
    const existingMedia=el.querySelector('.section-media-tools'); if(existingMedia)existingMedia.remove();
    if(sec.type==='image'){
      const lines=String(sec.content||'').split(/\r?\n/),src=(lines[0]||'').trim(),caption=lines.slice(1).join('\n');
      content.value=caption;
      const contentLabel=content.closest('label');if(contentLabel){for(const n of contentLabel.childNodes){if(n.nodeType===Node.TEXT_NODE){n.textContent='图片说明';break;}}}
      const media=document.createElement('div'); media.className='upload-box section-media-tools';
      media.innerHTML=`<div class="image-tool-row"><label class="file-btn compact">上传 / 更换区块图片<input class="section-image-upload" type="file" accept="image/*" hidden></label><button type="button" class="secondary compact section-image-clear">清除图片</button><small class="upload-crop-hint">选择图片后可框选范围</small></div>${imagePreviewHtml(src,sec.title||'区块图片')}`;
      content.insertAdjacentElement('afterend',media);
      media.querySelector('.section-image-upload').onchange=async e=>{const imgs=await loadImageFiles(e.target.files,1,{label:'首页区块图片',aspect:16/9,width:1600});e.target.value='';if(!imgs[0])return;const now=String(sec.content||'').split(/\r?\n/);now[0]=imgs[0];sec.content=[now[0],...now.slice(1)].join('\n');markDirty();renderAll()};
      media.querySelector('.section-image-clear').onclick=()=>{const now=String(sec.content||'').split(/\r?\n/);sec.content=now.slice(1).join('\n');markDirty();renderAll()};
    }
    el.addEventListener('dragstart',()=>{draggedSectionIndex=idx;el.classList.add('dragging')});
    el.addEventListener('dragend',()=>{draggedSectionIndex=null;el.classList.remove('dragging');$$('.section-editor').forEach(x=>x.classList.remove('drag-over'))});
    el.addEventListener('dragover',e=>{e.preventDefault();if(draggedSectionIndex!==idx)el.classList.add('drag-over')});
    el.addEventListener('dragleave',()=>el.classList.remove('drag-over'));
    el.addEventListener('drop',e=>{e.preventDefault();if(draggedSectionIndex===null||draggedSectionIndex===idx)return;const[moved]=config.homeSections.splice(draggedSectionIndex,1);config.homeSections.splice(idx,0,moved);markDirty();renderAll()});
    list.appendChild(el);
  });
  renderContentJumpbar();
}

function inputField(label,value,key,type='text',wide=false,disabled=false){return `<label class="${wide?'wide':''}">${label}<input data-key="${key}" type="${type}" value="${escAttr(value)}" ${disabled?'disabled':''}></label>`;}
function textareaField(label,value,key,wide=true){return `<label class="${wide?'wide':''}">${label}<textarea data-key="${key}" rows="3">${esc(value)}</textarea></label>`;}
function renderSimpleList(listId,items,kind){
  const root=$(listId); root.innerHTML='';
  if(!items.length){root.innerHTML=`<div class="empty-state">暂无${kind==='guest'?'嘉宾':kind==='schedule'?'日程':kind==='faq'?'常见问题':'内容'}，可以点击右上角添加。</div>`;return;}
  items.forEach((item,idx)=>{
    const el=document.createElement('details');el.className='data-item editor-details';
    const key=editorKey(kind,idx); bindDetailsState(el,key);
    let fields='',extra='';
    if(kind==='guest'){
      item.works=Array.isArray(item.works)?item.works:[];item.links=Array.isArray(item.links)?item.links:[];
      fields=inputField('姓名',item.name,'name')+inputField('身份',item.role,'role')+textareaField('简介',item.bio,'bio');
      const worksHtml=item.works.map((w,wi)=>`<article class="guest-work-editor" data-work="${wi}"><div class="participant-head"><b>${esc(w.title||'未命名作品')}</b><button class="danger tiny remove-guest-work" type="button">删除</button></div><div class="mini-grid">${inputField('作品标题',w.title,'work-title')}${inputField('作品链接（可选）',w.url,'work-url','text',true)}${textareaField('作品说明',w.description,'work-description')}</div><div class="image-tool-row"><label class="file-btn compact">上传 / 更换作品图片<input class="guest-work-upload" type="file" accept="image/*" hidden></label><button class="secondary compact guest-work-clear" type="button">清除图片</button></div>${imagePreviewHtml(w.image,w.title||'作品图片')}</article>`).join('')||'<div class="empty-state compact-empty">还没有代表作品。</div>';
      const linksHtml=item.links.map((l,li)=>`<div class="guest-link-editor" data-link="${li}"><select class="guest-platform"><option>Bilibili</option><option>小红书</option><option>抖音</option><option>微博</option><option>YouTube</option><option>X / Twitter</option><option>其他</option></select><input class="guest-link-url" type="url" value="${escAttr(l.url||'')}" placeholder="平台主页链接"><button class="danger tiny remove-guest-link" type="button">删除</button></div>`).join('')||'<div class="empty-state compact-empty">还没有平台链接。</div>';
      extra=`<div class="upload-box"><div class="image-tool-row"><label class="file-btn compact">上传 / 更换嘉宾头像<input class="guest-upload" type="file" accept="image/*" hidden></label><button class="secondary compact guest-clear" type="button">清除图片</button></div>${imagePreviewHtml(item.image,item.name||'嘉宾')}</div><div class="guest-extra-editor"><div class="panel-title-row compact-row"><div><strong>代表作品</strong><small>游客可在嘉宾页直接查看作品图片与说明。</small></div><button class="small secondary add-guest-work" type="button">+ 作品</button></div><div class="guest-work-list">${worksHtml}</div></div><div class="guest-extra-editor"><div class="panel-title-row compact-row"><div><strong>平台主页</strong><small>Bilibili、小红书、抖音、微博等均可跳转。</small></div><button class="small secondary add-guest-link" type="button">+ 平台链接</button></div><div class="guest-link-list">${linksHtml}</div></div>`;
    }
    if(kind==='schedule'){
      fields=inputField('日期 / 分组（可留空）',item.day,'day')+inputField('开始时间',item.time,'time')+inputField('结束时间',item.endTime||'','endTime')+inputField('活动名称',item.title,'title','text',true)+inputField('区域 / 舞台',item.stage,'stage')+inputField('活动类型',item.type,'type')+textareaField('活动介绍',item.description||'','description');
      extra=`<div class="upload-box"><div class="image-tool-row"><label class="file-btn compact">上传 / 更换活动宣传图<input class="schedule-upload" type="file" accept="image/*" hidden></label><button class="secondary compact schedule-clear" type="button">清除图片</button></div>${imagePreviewHtml(item.image,item.title||'活动宣传图')}</div><div class="participant-editor"><div class="panel-title-row compact-row"><div><strong>参与成员 / 团体</strong><small>舞者、乐队、嘉宾、主持、评委等都可添加</small></div><button class="small secondary add-participant" type="button">+ 成员</button></div><div class="participant-list">${(item.participants||[]).map((m,mi)=>`<article class="participant-item" data-member="${mi}"><div class="participant-head"><b>${esc(m.name||'未命名成员')}</b><button class="danger tiny remove-participant" type="button">删除</button></div><div class="mini-grid">${inputField('姓名 / 艺名',m.name,'member-name')}${inputField('身份 / 分工',m.role,'member-role')}${textareaField('成员介绍',m.bio,'member-bio')}</div><div class="image-tool-row"><label class="file-btn compact">上传 / 更换头像<input class="member-upload" type="file" accept="image/*" hidden></label><button class="secondary compact member-clear" type="button">清除头像</button></div>${imagePreviewHtml(m.image,m.name||'成员头像')}</article>`).join('')||'<div class="empty-state compact-empty">还没有参与成员；如果只是普通活动，可以不添加。</div>'}</div></div>`;
    }
    if(kind==='faq') fields=inputField('问题',item.q,'q','text',true)+textareaField('回答',item.a,'a');
    const label=kind==='guest'?(item.name||'未命名嘉宾'):kind==='schedule'?`${item.time||'--:--'} · ${item.title||'未命名节目'}`:(item.q||'未命名问题');
    const meta=kind==='guest'?(item.role||'未填写身份'):kind==='schedule'?(item.day||'未填写日期'):'点击展开编辑';
    el.innerHTML=`<summary class="editor-summary"><span><strong>${esc(label)}</strong><small>${esc(meta)}</small></span><span class="summary-action">编辑</span></summary><div class="editor-detail-body"><div class="mini-grid">${fields}</div>${extra}<div class="inline-actions end-actions"><button class="delete-item danger small" type="button">删除</button></div></div>`;
    el.querySelectorAll('[data-key]').forEach(input=>input.addEventListener('input',e=>{if(e.target.dataset.key.startsWith('member-')||e.target.dataset.key.startsWith('work-'))return;items[idx][e.target.dataset.key]=e.target.value;markDirty();renderPreview()}));
    if(kind==='guest'){
      el.querySelector('.guest-upload').onchange=async e=>{const imgs=await loadImageFiles(e.target.files,1,{label:'嘉宾头像',aspect:1,width:900});e.target.value='';if(imgs[0]){item.image=imgs[0];openEditors.add(key);markDirty();renderAll()}};
      el.querySelector('.guest-clear').onclick=()=>{item.image='';openEditors.add(key);markDirty();renderAll()};
      el.querySelector('.add-guest-work').onclick=()=>{item.works.push(normalizeGuestWork({title:'新作品'}));openEditors.add(key);markDirty();renderAll()};
      el.querySelectorAll('.guest-work-editor').forEach(row=>{const wi=Number(row.dataset.work),w=item.works[wi];row.querySelectorAll('[data-key^="work-"]').forEach(inp=>inp.addEventListener('input',e=>{const map={'work-title':'title','work-url':'url','work-description':'description'};w[map[e.target.dataset.key]]=e.target.value;markDirty();renderPreview()}));row.querySelector('.remove-guest-work').onclick=()=>{item.works.splice(wi,1);openEditors.add(key);markDirty();renderAll()};row.querySelector('.guest-work-upload').onchange=async e=>{const imgs=await loadImageFiles(e.target.files,1,{label:'作品图片',aspect:4/3,width:1400});e.target.value='';if(imgs[0]){w.image=imgs[0];openEditors.add(key);markDirty();renderAll()}};row.querySelector('.guest-work-clear').onclick=()=>{w.image='';openEditors.add(key);markDirty();renderAll()};});
      el.querySelector('.add-guest-link').onclick=()=>{item.links.push(normalizeGuestLink({platform:'Bilibili',url:''}));openEditors.add(key);markDirty();renderAll()};
      el.querySelectorAll('.guest-link-editor').forEach(row=>{const li=Number(row.dataset.link),l=item.links[li];const sel=row.querySelector('.guest-platform');sel.value=l.platform||'Bilibili';sel.onchange=e=>{l.platform=e.target.value;markDirty();renderPreview()};row.querySelector('.guest-link-url').oninput=e=>{l.url=e.target.value;markDirty();renderPreview()};row.querySelector('.remove-guest-link').onclick=()=>{item.links.splice(li,1);openEditors.add(key);markDirty();renderAll()};});
    }
    if(kind==='schedule'){
      el.querySelector('.schedule-upload').onchange=async e=>{const imgs=await loadImageFiles(e.target.files,1,{label:'活动宣传图',aspect:16/9,width:1600});e.target.value='';if(imgs[0]){item.image=imgs[0];openEditors.add(key);markDirty();renderAll()}};
      el.querySelector('.schedule-clear').onclick=()=>{item.image='';openEditors.add(key);markDirty();renderAll()};
      el.querySelector('.add-participant').onclick=()=>{item.participants=item.participants||[];item.participants.push(participantBlank());openEditors.add(key);markDirty();renderAll()};
      el.querySelectorAll('.participant-item').forEach(row=>{const mi=Number(row.dataset.member),m=item.participants[mi];row.querySelectorAll('[data-key^="member-"]').forEach(inp=>inp.addEventListener('input',e=>{const map={'member-name':'name','member-role':'role','member-bio':'bio'};m[map[e.target.dataset.key]]=e.target.value;markDirty();renderPreview()}));row.querySelector('.remove-participant').onclick=()=>{item.participants.splice(mi,1);openEditors.add(key);markDirty();renderAll()};row.querySelector('.member-upload').onchange=async e=>{const imgs=await loadImageFiles(e.target.files,1,{label:'成员头像',aspect:1,width:800});e.target.value='';if(imgs[0]){m.image=imgs[0];openEditors.add(key);markDirty();renderAll()}};row.querySelector('.member-clear').onclick=()=>{m.image='';openEditors.add(key);markDirty();renderAll()};});
    }
    el.querySelector('.delete-item').onclick=()=>{items.splice(idx,1);markDirty();renderAll()}; root.appendChild(el);
  });
}

function rawFileToDataUrl(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});}
async function fileToDataUrl(file){
  if(file.type==='image/svg+xml'||file.type==='image/gif')return rawFileToDataUrl(file);
  try{
    const raw=await rawFileToDataUrl(file);
    const img=await new Promise((resolve,reject)=>{const el=new Image();el.onload=()=>resolve(el);el.onerror=reject;el.src=raw});
    const maxSide=2400,scale=Math.min(1,maxSide/Math.max(img.naturalWidth||img.width,img.naturalHeight||img.height));
    const w=Math.max(1,Math.round((img.naturalWidth||img.width)*scale)),h=Math.max(1,Math.round((img.naturalHeight||img.height)*scale));
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{alpha:true});ctx.drawImage(img,0,0,w,h);
    return canvas.toDataURL('image/webp',.86);
  }catch{return rawFileToDataUrl(file)}
}

let imageCropState=null;
function cropAspectNumber(value,state=imageCropState){
  if(value==='source')return state?.sourceAspect||1;
  if(value==='recommended')return Number(state?.recommendedAspect)||state?.sourceAspect||1;
  const n=Number(value);return Number.isFinite(n)&&n>0?n:1;
}
function cropCanvasSize(aspect){const maxW=900,maxH=620;let w=maxW,h=Math.round(w/aspect);if(h>maxH){h=maxH;w=Math.round(h*aspect)}return [Math.max(240,w),Math.max(180,h)];}
function constrainCropOffset(){
  const s=imageCropState;if(!s)return;const c=$('#imageCropCanvas'),iw=s.img.naturalWidth,ih=s.img.naturalHeight;
  const base=Math.max(c.width/iw,c.height/ih),scale=base*s.zoom,dw=iw*scale,dh=ih*scale;
  const maxX=Math.max(0,(dw-c.width)/2),maxY=Math.max(0,(dh-c.height)/2);
  s.offsetX=Math.max(-maxX,Math.min(maxX,s.offsetX));s.offsetY=Math.max(-maxY,Math.min(maxY,s.offsetY));
}
function renderImageCrop(){
  const s=imageCropState,c=$('#imageCropCanvas');if(!s||!c)return;const aspect=cropAspectNumber($('#imageCropAspect')?.value||'recommended',s),size=cropCanvasSize(aspect);
  if(c.width!==size[0]||c.height!==size[1]){c.width=size[0];c.height=size[1];s.offsetX=0;s.offsetY=0;}
  constrainCropOffset();const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#11151c';ctx.fillRect(0,0,c.width,c.height);
  const iw=s.img.naturalWidth,ih=s.img.naturalHeight,base=Math.max(c.width/iw,c.height/ih),scale=base*s.zoom,dw=iw*scale,dh=ih*scale;
  const x=(c.width-dw)/2+s.offsetX,y=(c.height-dh)/2+s.offsetY;ctx.drawImage(s.img,x,y,dw,dh);
  ctx.save();ctx.strokeStyle='rgba(255,255,255,.48)';ctx.lineWidth=1;for(const t of [1/3,2/3]){ctx.beginPath();ctx.moveTo(c.width*t,0);ctx.lineTo(c.width*t,c.height);ctx.stroke();ctx.beginPath();ctx.moveTo(0,c.height*t);ctx.lineTo(c.width,c.height*t);ctx.stroke();}ctx.restore();
  $('#imageCropZoomValue').textContent=`${Math.round(s.zoom*100)}%`;
}
function resetCropForAspect(){if(!imageCropState)return;imageCropState.zoom=1;imageCropState.offsetX=0;imageCropState.offsetY=0;$('#imageCropZoom').value='1';renderImageCrop();}
function closeImageCrop(result=null){const modal=$('#imageCropModal');if(modal){modal.classList.add('hidden');modal.setAttribute('aria-hidden','true')}if(imageCropState?.objectUrl)URL.revokeObjectURL(imageCropState.objectUrl);const resolve=imageCropState?.resolve;imageCropState=null;resolve?.(result);}
function applyImageCrop(){
  const s=imageCropState,c=$('#imageCropCanvas');if(!s||!c)return;constrainCropOffset();const iw=s.img.naturalWidth,ih=s.img.naturalHeight,base=Math.max(c.width/iw,c.height/ih),scale=base*s.zoom;
  const dw=iw*scale,dh=ih*scale,x=(c.width-dw)/2+s.offsetX,y=(c.height-dh)/2+s.offsetY;
  let sx=Math.max(0,-x/scale),sy=Math.max(0,-y/scale),sw=Math.min(iw-sx,c.width/scale),sh=Math.min(ih-sy,c.height/scale);
  const aspect=c.width/c.height;if(sw/sh>aspect)sw=sh*aspect;else sh=sw/aspect;
  const outW=Math.max(320,Math.round(s.outputWidth||Math.min(1800,iw))),outH=Math.max(240,Math.round(outW/aspect)),out=document.createElement('canvas');out.width=outW;out.height=outH;out.getContext('2d').drawImage(s.img,sx,sy,sw,sh,0,0,outW,outH);
  out.toBlob(blob=>{if(!blob)return closeImageCrop(null);const baseName=(s.file.name||'image').replace(/\.[^.]+$/,'');closeImageCrop(new File([blob],baseName+'-cropped.webp',{type:'image/webp'}));},'image/webp',.9);
}
async function cropImageFile(file,opts={}){
  if(!file?.type?.startsWith('image/'))return null;
  const objectUrl=URL.createObjectURL(file),img=await new Promise((resolve,reject)=>{const x=new Image();x.onload=()=>resolve(x);x.onerror=reject;x.src=objectUrl});
  return await new Promise(resolve=>{
    imageCropState={file,img,objectUrl,resolve,sourceAspect:(img.naturalWidth||1)/(img.naturalHeight||1),recommendedAspect:opts.aspect||((img.naturalWidth||1)/(img.naturalHeight||1)),outputWidth:opts.width||1600,zoom:1,offsetX:0,offsetY:0};
    $('#imageCropTitle').textContent=opts.label?`框选${opts.label}范围`:'框选图片范围';$('#imageCropSubtitle').textContent=`原图 ${img.naturalWidth} × ${img.naturalHeight} px · 拖动图片调整位置`;
    $('#imageCropAspect').value='recommended';$('#imageCropZoom').value='1';const modal=$('#imageCropModal');modal.classList.remove('hidden');modal.setAttribute('aria-hidden','false');renderImageCrop();
  });
}
function bindGlobalCropTool(){
  const c=$('#imageCropCanvas');if(!c)return;let dragging=false,lastX=0,lastY=0;
  c.addEventListener('pointerdown',e=>{if(!imageCropState)return;dragging=true;lastX=e.clientX;lastY=e.clientY;c.setPointerCapture?.(e.pointerId);e.preventDefault()});
  c.addEventListener('pointermove',e=>{if(!dragging||!imageCropState)return;const rect=c.getBoundingClientRect(),sx=c.width/Math.max(1,rect.width),sy=c.height/Math.max(1,rect.height);imageCropState.offsetX+=(e.clientX-lastX)*sx;imageCropState.offsetY+=(e.clientY-lastY)*sy;lastX=e.clientX;lastY=e.clientY;renderImageCrop()});
  c.addEventListener('pointerup',e=>{dragging=false;c.releasePointerCapture?.(e.pointerId)});c.addEventListener('pointercancel',()=>dragging=false);
  c.addEventListener('wheel',e=>{if(!imageCropState)return;e.preventDefault();imageCropState.zoom=Math.max(1,Math.min(3,imageCropState.zoom*(e.deltaY>0?.94:1.06)));$('#imageCropZoom').value=String(imageCropState.zoom);renderImageCrop()},{passive:false});
  $('#imageCropZoom')?.addEventListener('input',e=>{if(!imageCropState)return;imageCropState.zoom=Number(e.target.value)||1;renderImageCrop()});$('#imageCropAspect')?.addEventListener('change',resetCropForAspect);
  $('#imageCropApplyBtn')?.addEventListener('click',applyImageCrop);$('#imageCropCancelBtn')?.addEventListener('click',()=>closeImageCrop(null));$('#imageCropCloseBtn')?.addEventListener('click',()=>closeImageCrop(null));document.querySelector('[data-crop-cancel]')?.addEventListener('click',()=>closeImageCrop(null));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&imageCropState)closeImageCrop(null)});
}

async function autoResizeImageFile(file,maxWidth=1080,quality=.84){if(!file?.type?.startsWith('image/')||file.type==='image/gif')return file;const bitmap=await createImageBitmap(file),scale=Math.min(1,maxWidth/bitmap.width),w=Math.max(1,Math.round(bitmap.width*scale)),h=Math.max(1,Math.round(bitmap.height*scale)),canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(bitmap,0,0,w,h);bitmap.close?.();const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));return blob?new File([blob],(file.name||'image').replace(/\.[^.]+$/,'')+'-mobile.webp',{type:'image/webp'}):file}
async function uploadImageFile(file){
  if(!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type))throw new Error('仅支持 JPG、PNG、WebP、GIF 图片。');
  let blob=file, filename=file.name||'image';
  if(file.type!=='image/gif'){
    const dataUrl=await fileToDataUrl(file);blob=await (await fetch(dataUrl)).blob();filename=filename.replace(/\.[^.]+$/,'')+'.webp';
  }
  const form=new FormData();form.append('file',blob,filename);
  const res=await fetch('/api/upload',{method:'POST',body:form,credentials:'same-origin'});let data={};try{data=await res.json()}catch{}
  if(!res.ok)throw new Error(data.error||'图片上传失败');
  return data.url;
}
async function loadImageFiles(files,maxCount,cropOptions={}){
  const selected=[...files].slice(0,maxCount); const out=[];
  for(const f of selected){
    if(!f.type.startsWith('image/'))continue;
    if(f.size>15*1024*1024&&!confirm(`${f.name} 超过 15MB，仍然上传吗？`))continue;
    try{const cropped=await cropImageFile(f,cropOptions);if(!cropped)continue;out.push(await uploadImageFile(cropped));}catch(err){alert(`${f.name}：${err.message}`)}
  }
  return out;
}


function boothHasMapPoint(b){return b.mapX!==null&&b.mapX!==''&&b.mapY!==null&&b.mapY!==''&&Number.isFinite(Number(b.mapX))&&Number.isFinite(Number(b.mapY));}
function clampPct(v){return Math.max(0,Math.min(100,Number(v)||0));}
function renderBoothMapEditor(){
  const root=$('#boothMapEditor');if(!root)return;
  if(!featureEnabled('booths')){
    root.innerHTML='<div class="empty-state compact-empty">“摊位 / 社团”栏目当前已关闭，开启后可以设置摊位点位。</div>';return;
  }
  if(!config.mapImage){
    root.innerHTML='<div class="empty-state compact-empty">请先在上方上传场馆地图，再设置摊位点位。</div>';return;
  }
  if(!config.booths.length){
    root.innerHTML='<div class="empty-state compact-empty">还没有摊位。请先在“摊位 / 社团”中添加摊位。</div>';return;
  }
  const markers=config.booths.map((b,i)=>boothHasMapPoint(b)?`<button type="button" class="admin-map-marker" data-map-booth="${i}" style="left:${clampPct(b.mapX)}%;top:${clampPct(b.mapY)}%" title="拖动 ${escAttr(b.code)} ${escAttr(b.name)}">${esc(b.code||String(i+1))}</button>`:'').join('');
  root.innerHTML=`<div class="admin-map-stage" id="adminMapStage"><img src="${escAttr(config.mapImage)}" alt="场馆地图">${markers}</div>
    <div class="map-position-list">${config.booths.map((b,i)=>`<div class="map-position-row" data-map-row="${i}">
      <div><b>${esc(b.code||'未编号')} · ${esc(b.name||'未命名摊位')}</b><small>${boothHasMapPoint(b)?`X ${Math.round(b.mapX)}% · Y ${Math.round(b.mapY)}%`:'尚未放置'}</small></div>
      <label>X<input class="map-x" type="number" min="0" max="100" step="0.5" value="${boothHasMapPoint(b)?Number(b.mapX).toFixed(1):''}" placeholder="0–100"></label>
      <label>Y<input class="map-y" type="number" min="0" max="100" step="0.5" value="${boothHasMapPoint(b)?Number(b.mapY).toFixed(1):''}" placeholder="0–100"></label>
      <button type="button" class="secondary compact map-place">放到中央</button>
      <button type="button" class="secondary compact map-clear">清除</button>
    </div>`).join('')}</div>`;
  const stage=$('#adminMapStage');
  root.querySelectorAll('.admin-map-marker').forEach(marker=>{
    const idx=Number(marker.dataset.mapBooth);
    const b=config.booths[idx];
    let dragging=false;
    const move=e=>{
      if(!dragging)return;
      const r=stage.getBoundingClientRect();
      if(!r.width||!r.height)return;
      b.mapX=clampPct((e.clientX-r.left)/r.width*100);
      b.mapY=clampPct((e.clientY-r.top)/r.height*100);
      marker.style.left=b.mapX+'%';marker.style.top=b.mapY+'%';
    };
    marker.addEventListener('pointerdown',e=>{dragging=true;marker.setPointerCapture?.(e.pointerId);e.preventDefault()});
    marker.addEventListener('pointermove',move);
    marker.addEventListener('pointerup',e=>{if(!dragging)return;move(e);dragging=false;marker.releasePointerCapture?.(e.pointerId);markDirty();renderBoothMapEditor();renderPreview()});
    marker.addEventListener('pointercancel',()=>{dragging=false});
  });
  root.querySelectorAll('.map-position-row').forEach(row=>{
    const idx=Number(row.dataset.mapRow),b=config.booths[idx],x=row.querySelector('.map-x'),y=row.querySelector('.map-y');
    const apply=()=>{
      if(x.value===''||y.value==='')return;
      b.mapX=clampPct(x.value);b.mapY=clampPct(y.value);markDirty();renderBoothMapEditor();renderPreview();
    };
    x.addEventListener('change',apply);y.addEventListener('change',apply);
    row.querySelector('.map-place').onclick=()=>{b.mapX=50;b.mapY=50;markDirty();renderBoothMapEditor();renderPreview()};
    row.querySelector('.map-clear').onclick=()=>{b.mapX=null;b.mapY=null;markDirty();renderBoothMapEditor();renderPreview()};
  });
}
function autoPlaceUnpositionedBooths(){
  const pending=config.booths.filter(b=>!boothHasMapPoint(b));
  if(!pending.length){toast('所有摊位都已经有点位');return;}
  const cols=Math.ceil(Math.sqrt(pending.length)),rows=Math.ceil(pending.length/cols);
  pending.forEach((b,i)=>{const col=i%cols,row=Math.floor(i/cols);b.mapX=10+(col+.5)*(80/cols);b.mapY=10+(row+.5)*(80/rows);});
  markDirty();renderBoothMapEditor();renderPreview();toast(`已排列 ${pending.length} 个未定位摊位，可继续拖动微调`);
}
if($('#autoPlaceBoothsBtn'))$('#autoPlaceBoothsBtn').onclick=autoPlaceUnpositionedBooths;

function validExternalUrl(v){try{const u=new URL(String(v||''));return /^https?:$/.test(u.protocol)}catch{return false}}
function renderExternalLinks(){const root=$('#externalLinkList');if(!root)return;root.innerHTML='';if(!config.externalLinks.length){root.innerHTML='<div class="empty-state compact-empty">还没有外部链接。</div>';return}config.externalLinks.forEach((item,idx)=>{const row=document.createElement('div');row.className='external-link-row';row.innerHTML=`<select data-k="kind"><option value="ticket" ${item.kind==='ticket'?'selected':''}>购票</option><option value="register" ${item.kind==='register'?'selected':''}>报名</option><option value="social" ${item.kind==='social'?'selected':''}>社交平台</option><option value="map" ${item.kind==='map'?'selected':''}>地图</option><option value="link" ${item.kind==='link'?'selected':''}>其他</option></select><input data-k="label" value="${escAttr(item.label)}" placeholder="按钮文字"><input data-k="url" value="${escAttr(item.url)}" placeholder="https://"><button class="danger compact" type="button">删除</button><small class="link-check ${item.url&&!validExternalUrl(item.url)?'error':''}">${item.url&&!validExternalUrl(item.url)?'链接格式不正确':''}</small>`;row.querySelectorAll('[data-k]').forEach(el=>el.addEventListener('input',e=>{item[e.target.dataset.k]=e.target.value;markDirty();renderPreview()}));row.querySelector('button').onclick=()=>{config.externalLinks.splice(idx,1);markDirty();renderExternalLinks();renderPreview()};root.appendChild(row)})}
function renderTicketTypes(){const root=$('#ticketTypeList');if(!root)return;root.innerHTML='';if(!config.ticketTypes.length){root.innerHTML='<div class="empty-state compact-empty">还没有票种。票务实际购买仍由外部售票平台完成。</div>';return}config.ticketTypes.forEach((item,idx)=>{const row=document.createElement('div');row.className='data-item';row.innerHTML=`<div class="mini-grid"><label>票种名称<input data-k="name" value="${escAttr(item.name)}" placeholder="例如 普通票 / VIP / 特典票"></label><label>价格<input data-k="price" value="${escAttr(item.price)}" placeholder="例如 ¥68"></label><label class="wide">包含 / 赠品<textarea data-k="gift" rows="2" placeholder="例如 入场资格 + 限定徽章 + 纪念票根">${esc(item.gift)}</textarea></label><label class="wide">补充说明<textarea data-k="note" rows="2" placeholder="例如 限量 200 张；实际购买请前往第三方平台">${esc(item.note)}</textarea></label></div><div class="inline-actions"><label class="account-status"><input data-published type="checkbox" ${item.published!==false?'checked':''}> 在游客网站展示</label><button class="danger compact" type="button">删除</button></div>`;row.querySelectorAll('[data-k]').forEach(el=>el.addEventListener('input',e=>{item[e.target.dataset.k]=e.target.value;markDirty();renderPreview()}));row.querySelector('[data-published]').onchange=e=>{item.published=e.target.checked;markDirty();renderPreview()};row.querySelector('button').onclick=()=>{config.ticketTypes.splice(idx,1);markDirty();renderTicketTypes();renderPreview()};root.appendChild(row)});}
function renderBrandAssets(){const s=$('#shareImagePreview');if(s){s.src=config.shareImage||'';s.classList.toggle('hidden',!config.shareImage)}const f=$('#faviconImagePreview');if(f){f.src=config.faviconImage||'';f.classList.toggle('hidden',!config.faviconImage)}}
function renderSponsors(){
  const root=$('#sponsorList');if(!root)return;root.innerHTML='';
  if(!config.sponsors.length){
    root.innerHTML='<div class="empty-state">还没有赞助商或合作方。点击“+ 添加合作方”开始添加。</div>';
    return;
  }
  config.sponsors.forEach((s,idx)=>{
    const el=document.createElement('details');el.className='data-item editor-details';
    const key=editorKey('sponsor',idx);bindDetailsState(el,key);
    el.innerHTML=`<summary class="editor-summary"><span><strong>${esc(s.name||'未命名合作方')}</strong><small>${esc(s.type||'合作方')}${s.published===false?' · 游客站隐藏':''}</small></span><span class="summary-action">编辑</span></summary>
      <div class="editor-detail-body">
        <div class="mini-grid">
          ${inputField('名称',s.name,'name')}
          ${inputField('类型（如 主赞助 / 合作方 / 媒体合作）',s.type,'type')}
          ${inputField('官网 / 社交链接',s.url,'url','text',true)}
          ${textareaField('补充说明',s.note,'note')}
        </div>
        <div class="upload-box">
          <div class="image-tool-row">
            <label class="file-btn compact">上传 / 更换 Logo<input class="sponsor-upload" type="file" accept="image/*" hidden></label>
            <button class="secondary compact sponsor-clear" type="button">清除图片</button>
          </div>
          ${imagePreviewHtml(s.logo,s.name||'合作方 Logo')}
        </div>
        <div class="inline-actions">
          <label class="account-status"><input class="sponsor-published" type="checkbox" ${s.published!==false?'checked':''}> 在游客网站展示</label>
        </div>
        <div class="inline-actions end-actions"><button class="delete-item danger small" type="button">删除</button></div>
      </div>`;
    el.querySelectorAll('[data-key]').forEach(input=>input.addEventListener('input',e=>{s[e.target.dataset.key]=e.target.value;markDirty();renderPreview()}));
    el.querySelector('.sponsor-published').onchange=e=>{s.published=e.target.checked;markDirty();rebuildPreviewOptions(true);renderPreview(true)};
    el.querySelector('.sponsor-upload').onchange=async e=>{const imgs=await loadImageFiles(e.target.files,1,{label:'合作方 Logo',aspect:'source',width:1200});e.target.value='';if(imgs[0]){s.logo=imgs[0];openEditors.add(key);markDirty();renderAll()}};
    el.querySelector('.sponsor-clear').onclick=()=>{s.logo='';openEditors.add(key);markDirty();renderAll()};
    el.querySelector('.delete-item').onclick=()=>{if(confirm(`删除“${s.name||'这个合作方'}”？`)){config.sponsors.splice(idx,1);markDirty();renderAll()}};
    root.appendChild(el);
  });
}

function renderVendorManagement(){
  const root=$('#vendorManagementList');if(!root)return;root.innerHTML='';
  if(!config.booths.length){
    root.innerHTML='<div class="empty-state">还没有摊位内容。点击“+ 添加摊位”，由主办方直接填写社团资料、图片和制品。</div>';
    return;
  }
  config.booths.forEach((b,idx)=>{
    const el=document.createElement('details');el.className='data-item editor-details booth-content-editor';
    const key=editorKey('vendor',idx);bindDetailsState(el,key);
    const productCount=Array.isArray(b.products)?b.products.length:0;
    el.innerHTML=`<summary class="editor-summary"><span><strong>${esc(b.code||'未编号')} · ${esc(b.name||'未命名摊位')}</strong><small>${esc(b.category||'未分类')} · ${productCount} 件制品${b.published===false?' · 游客站隐藏':''}</small></span><span class="summary-action">编辑内容</span></summary>
      <div class="editor-detail-body">
        <div class="mini-grid">
          ${inputField('摊位号 / 区域编号',b.code,'code')}
          ${inputField('摊位 / 社团名称',b.name,'name')}
          ${inputField('分类',b.category,'category')}
          ${inputField('标签（逗号分隔）',b.tags,'tags')}
          ${inputField('联系方式 / 现场说明',b.contact,'contact','text',true)}
          ${inputField('社交账号 / 链接',b.social,'social','text',true)}
          ${textareaField('一句话亮点',b.note,'note')}
          ${textareaField('摊位详细介绍',b.description,'description')}
        </div>
        <div class="upload-box booth-logo-upload-box">
          <div class="booth-logo-control-grid">
            ${boothLogoPreviewHtml(b.coverImage,b.name||'社团 Logo')}
            <div class="booth-logo-control-fields">
              <small class="hint">建议上传正方形 Logo；游客端会按 1:1 展示。</small>
              <div class="image-tool-row booth-logo-actions">
                <label class="file-btn compact">上传 / 更换 Logo<input class="booth-cover-upload" type="file" accept="image/*" hidden></label>
                <button class="secondary compact booth-cover-clear" type="button">清除图片</button>
              </div>
            </div>
          </div>
        </div>
        <div class="inline-actions">
          <label class="account-status"><input class="published-toggle" type="checkbox" ${b.published!==false?'checked':''}> 在游客网站展示此摊位</label>
          <button class="preview-booth small secondary" type="button">预览摊位页</button>
        </div>
        <div class="booth-products-host">
          <div class="panel-title-row compact-row"><div><b>制品 / 商品</b><small class="hint">由主办方直接上传图片、价格和介绍。</small></div><button class="add-host-product small secondary" type="button">+ 添加制品</button></div>
          <div class="host-product-list"></div>
        </div>
        <div class="inline-actions end-actions"><button class="delete-item danger small" type="button">删除摊位</button></div>
      </div>`;

    el.querySelectorAll('[data-key]').forEach(input=>input.addEventListener('input',e=>{
      const k=e.target.dataset.key;b[k]=e.target.value;markDirty();
      if(k==='code'||k==='name')rebuildPreviewOptions(true);
      renderPreview();
    }));
    el.querySelector('.published-toggle').onchange=e=>{b.published=e.target.checked;markDirty();rebuildPreviewOptions(true);renderPreview()};
    el.querySelector('.booth-cover-upload').onchange=async e=>{
      const imgs=await loadImageFiles(e.target.files,1,{label:'社团 Logo',aspect:1,width:1000});e.target.value='';
      if(imgs[0]){b.coverImage=imgs[0];openEditors.add(key);markDirty();renderAll();}
    };
    el.querySelector('.booth-cover-clear').onclick=()=>{b.coverImage='';openEditors.add(key);markDirty();renderAll()};
    el.querySelector('.preview-booth').onclick=()=>{
      const i=config.booths.findIndex(x=>x.id===b.id);
      if(i>=0){activePreviewPage=boothPageName(i);rebuildPreviewOptions(true);enterPreview();}
    };
    el.querySelector('.add-host-product').onclick=()=>{
      b.products=b.products||[];b.products.push(productBlank());
      openEditors.add(key);openEditors.add(editorKey('product',b.products.length-1,b.code||'booth'));
      markDirty();renderAll();
    };
    el.querySelector('.delete-item').onclick=()=>{
      if(confirm(`确定删除 ${b.code||''} ${b.name||'这个摊位'}？其中的制品内容也会一并删除。`)){
        config.booths.splice(idx,1);markDirty();renderAll();
      }
    };
    renderProductList(el.querySelector('.host-product-list'),b);
    root.appendChild(el);
  });
}

function productEditorHtml(p,idx){
  return `<summary class="editor-summary"><span><strong>${idx+1}. ${esc(p.name||'未命名制品')}</strong><small>${esc(p.category||'未分类')} · ${p.images.length} 张图片${p.published===false?' · 未公开':''}</small></span><span class="summary-action">编辑</span></summary>
    <div class="editor-detail-body"><div class="mini-grid">${inputField('制品名称',p.name,'name')}${inputField('制品类型',p.category,'category')}${inputField('价格 / 交换条件',p.price,'price')}${inputField('库存 / 贩售说明',p.availability,'availability')}${textareaField('制品内容 / 详细介绍',p.description,'description')}</div>
    <div class="upload-box"><div class="image-tool-row"><label class="file-btn compact">+ 上传制品图片（可多选）<input class="product-upload" type="file" accept="image/*" multiple hidden></label></div><small class="hint">单件制品最多保留 6 张图；每次选择图片后都可以框选范围，第一张作为主图。</small><div class="image-strip">${p.images.map((img,i)=>`<div class="image-thumb"><img src="${escAttr(img)}" alt="制品图片 ${i+1}"><button data-remove-image="${i}" title="移除" type="button">×</button></div>`).join('')}</div></div>
    <div class="inline-actions"><label class="account-status"><input class="product-published" type="checkbox" ${p.published!==false?'checked':''}> 在游客站展示此制品</label><button class="delete-product danger small" type="button">删除制品</button></div></div>`;
}
function renderProductList(root,booth){
  root.innerHTML='';
  if(!booth){root.innerHTML='<div class="empty-state">暂无可编辑摊位。</div>';return;}
  if(!booth.products.length){root.innerHTML='<div class="empty-state">还没有制品。点击“+ 制品”添加第一件制品，并上传图片、填写内容。</div>';return;}
  booth.products.forEach((p,idx)=>{
    const el=document.createElement('details');el.className='product-editor editor-details';
    const scope=booth.code||'booth',key=editorKey('product',idx,scope);bindDetailsState(el,key);el.innerHTML=productEditorHtml(p,idx);
    el.querySelectorAll('[data-key]').forEach(input=>input.addEventListener('input',e=>{p[e.target.dataset.key]=e.target.value;markDirty();renderPreview()}));
    el.querySelector('.product-published').onchange=e=>{p.published=e.target.checked;markDirty();renderPreview()};
    el.querySelector('.delete-product').onclick=()=>{if(confirm(`删除制品“${p.name}”？`)){booth.products.splice(idx,1);markDirty();renderAll()}};
    el.querySelector('.product-upload').onchange=async e=>{const left=Math.max(0,6-p.images.length);if(!left)return alert('每件制品最多 6 张图片。');const imgs=await loadImageFiles(e.target.files,left,{label:'制品图片',aspect:4/3,width:1400});e.target.value='';p.images.push(...imgs);openEditors.add(key);markDirty();renderAll()};
    el.querySelectorAll('[data-remove-image]').forEach(btn=>btn.onclick=()=>{p.images.splice(Number(btn.dataset.removeImage),1);openEditors.add(key);markDirty();renderAll()});
    root.appendChild(el);
  });
}

function renderAdminProducts(){
  const select=$('#adminProductBoothSelect');
  select.innerHTML=config.booths.map((b,i)=>`<option value="${i}" ${i===adminSelectedBooth?'selected':''}>${esc(b.code)} · ${esc(b.name)}</option>`).join('');
  if(config.booths.length===0){select.innerHTML='<option>暂无摊位</option>';renderProductList($('#adminProductList'),null);return;}
  adminSelectedBooth=Math.max(0,Math.min(adminSelectedBooth,config.booths.length-1)); select.value=String(adminSelectedBooth);
  renderProductList($('#adminProductList'),config.booths[adminSelectedBooth]);
}

function syncCommunityInputs(){const c=config.community||normalizeCommunity({});const map={communityTitle:'title',communityText:'text',communityQqGroup:'qqGroup',communityWechatGroup:'wechatGroup',communityLink:'link',communityLinkLabel:'linkLabel'};for(const[id,k]of Object.entries(map)){const el=$('#'+id);if(el)el.value=c[k]||''}const q=$('#communityQqQrPreview');if(q){q.src=c.qqQrImage||'';q.classList.toggle('hidden',!c.qqQrImage)}const w=$('#communityWechatQrPreview');if(w){w.src=c.wechatQrImage||'';w.classList.toggle('hidden',!c.wechatQrImage)}}
function bindCommunityInputs(){const map={communityTitle:'title',communityText:'text',communityQqGroup:'qqGroup',communityWechatGroup:'wechatGroup',communityLink:'link',communityLinkLabel:'linkLabel'};for(const[id,k]of Object.entries(map))$('#'+id)?.addEventListener('input',e=>{config.community=normalizeCommunity(config.community);config.community[k]=e.target.value;markDirty();renderPreview()});$('#communityQqQrUpload')?.addEventListener('change',async e=>{const a=await loadImageFiles(e.target.files,1,{label:'QQ 群二维码',aspect:1,width:900});e.target.value='';if(a[0]){config.community.qqQrImage=a[0];markDirty();renderAll()}});$('#communityWechatQrUpload')?.addEventListener('change',async e=>{const a=await loadImageFiles(e.target.files,1,{label:'微信群二维码',aspect:1,width:900});e.target.value='';if(a[0]){config.community.wechatQrImage=a[0];markDirty();renderAll()}});$('#clearCommunityQqQr')?.addEventListener('click',()=>{config.community.qqQrImage='';markDirty();renderAll()});$('#clearCommunityWechatQr')?.addEventListener('click',()=>{config.community.wechatQrImage='';markDirty();renderAll()})}

function renderDataEditors(){renderSimpleList('#guestList',config.guests,'guest');renderVendorManagement();renderSponsors();renderExternalLinks();renderTicketTypes();renderBrandAssets();renderSimpleList('#scheduleList',config.schedule,'schedule');renderSimpleList('#faqList',config.faq,'faq');renderBoothMapEditor();}









function visitorCss(c){return `
:root{--theme:${c.themeColor};--accent:${c.accentColor};--bg:${c.backgroundColor};--radius:${Number(c.radius)||22}px;--ink:${c.textColor||'#151722'};--muted:${c.mutedColor||'#697181'};--line:${c.lineColor||'#e5e7ee'};--surface:${c.surfaceColor||'#ffffff'};--header-bg:${c.headerBgColor||'#ffffff'};--header-text:${c.headerTextColor||'#151722'};--content-width:${Number(c.contentWidth)||1120}px;--section-space:${Number(c.sectionSpacing)||76}px;--card-gap:${Number(c.cardGap)||18}px;--shadow-alpha:${(Math.max(0,Math.min(30,Number(c.shadowStrength)||5))/100).toFixed(2)};--motion-scale:${(Math.max(0,Math.min(100,Number(c.animationStrength)||100))/100).toFixed(2)};--decor-opacity:${c.decorationsEnabled===false?0:1}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;color:var(--ink);background:#fff}.wrap{width:min(var(--content-width),calc(100% - 40px));margin:auto}.announcement{background:var(--ink);color:#fff;text-align:center;padding:9px 16px;font-size:13px}.site-nav{height:68px;display:flex;align-items:center;position:sticky;top:0;background:var(--header-bg);backdrop-filter:blur(14px);border-bottom:1px solid rgba(225,228,236,.9);z-index:20}.nav-inner{display:flex;align-items:center;gap:22px}.logo{font-weight:900;letter-spacing:-.02em;text-decoration:none;color:var(--header-text);margin-right:auto}.nav-links{display:flex;align-items:center;gap:4px}.nav-links a{color:var(--header-text);text-decoration:none;font-size:13px;font-weight:700;padding:8px 9px;border-radius:8px}.nav-links a:hover,.nav-links a.active{color:var(--theme);background:${slugColor(c.themeColor)}}.ticket-btn{background:var(--theme)!important;color:#fff!important;padding:10px 15px!important;border-radius:999px!important}.hero{min-height:70vh;display:flex;align-items:end;position:relative;background-image:linear-gradient(115deg,rgba(10,12,18,.78),rgba(10,12,18,.18)),var(--hero-desktop);background-position:var(--hero-desktop-pos);background-size:cover;background-repeat:no-repeat;color:#fff}.hero .wrap{padding-top:110px;padding-bottom:76px}.eyebrow{display:inline-flex;padding:7px 11px;border:1px solid rgba(255,255,255,.4);border-radius:999px;background:rgba(255,255,255,.1);backdrop-filter:blur(8px);font-size:12px;font-weight:800;letter-spacing:.08em}.hero h1{font-size:clamp(44px,8vw,98px);line-height:.94;margin:18px 0 14px;letter-spacing:-.05em;max-width:900px}.tagline{font-size:clamp(18px,2.5vw,28px);opacity:.94}.meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.meta span{padding:10px 14px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.13);border-radius:12px;backdrop-filter:blur(8px);font-size:14px}.page-hero{padding:74px 0 48px;${c.pageBannerImage?`color:#fff;background:linear-gradient(90deg,rgba(12,14,20,.72),rgba(12,14,20,.26)),url('${escAttr(c.pageBannerImage)}') center/cover no-repeat`:`background:linear-gradient(135deg,${slugColor(c.themeColor,'12')},${slugColor(c.accentColor,'12')})`}}.page-kicker{font-size:12px;font-weight:900;letter-spacing:.12em;color:var(--theme);text-transform:uppercase}.page-hero h1,.section h2{font-size:clamp(32px,5vw,58px);letter-spacing:-.035em}.page-hero h1{margin:8px 0 10px}.page-hero p{color:${c.pageBannerImage?'rgba(255,255,255,.9)':'var(--muted)'};max-width:760px;line-height:1.7}.page-hero .page-kicker{${c.pageBannerImage?'color:#fff':''}}.section{padding:var(--section-space) 0}.section.alt{background:var(--bg)}.section h2{margin:0 0 28px}.copy{font-size:17px;line-height:1.9;color:#505867;max-width:820px}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--card-gap)}.card{padding:25px;border-radius:var(--radius);background:var(--surface);border:1px solid var(--line);box-shadow:0 12px 38px rgba(20,22,34,var(--shadow-alpha))}.card h3{margin:0 0 10px}.card p{color:var(--muted);line-height:1.65}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.stat{padding:26px;border-radius:var(--radius);background:var(--ink);color:#fff}.stat strong{display:block;font-size:clamp(30px,5vw,50px);letter-spacing:-.04em}.stat span{opacity:.7}.schedule{border-top:1px solid var(--line)}.schedule-row{display:grid;grid-template-columns:130px 1fr auto;gap:20px;padding:18px 0;border-bottom:1px solid var(--line);align-items:center}.schedule-row strong{color:var(--theme)}.schedule-row small{padding:5px 8px;border-radius:999px;background:var(--bg);color:#697181}.cta{text-align:center;background:linear-gradient(135deg,var(--theme),var(--accent));color:#fff}.cta-buttons{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}.cta a{display:inline-block;padding:14px 20px;border-radius:999px;background:#fff;color:var(--ink);text-decoration:none;font-weight:850}.image-block img,.map-img{width:100%;display:block;border-radius:var(--radius);max-height:620px;object-fit:cover}.image-caption{color:var(--muted);margin-top:10px}.guest-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.guest-card{border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:#fff}.guest-card img{width:100%;aspect-ratio:4/3;object-fit:cover;background:var(--bg)}.guest-body{padding:20px}.guest-role{color:var(--theme);font-size:12px;font-weight:850}.guest-body h3{font-size:22px;margin:5px 0 8px}.guest-body p{color:var(--muted);line-height:1.65}.toolbar{display:flex;gap:10px;margin:0 0 24px;flex-wrap:wrap}.search{flex:1;min-width:220px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;font:inherit}.filters{display:flex;gap:7px;flex-wrap:wrap}.filter-btn{border:1px solid var(--line);background:#fff;border-radius:999px;padding:9px 12px;font-weight:750;cursor:pointer}.filter-btn.active{background:var(--ink);color:#fff}.tag{display:inline-flex;padding:4px 7px;border-radius:999px;background:var(--bg);font-size:11px;margin:2px}.booth-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.booth-card{border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:#fff;display:flex;flex-direction:column}.booth-cover{aspect-ratio:16/10;background:linear-gradient(135deg,${slugColor(c.themeColor,'25')},${slugColor(c.accentColor,'25')});overflow:hidden}.booth-cover img{width:100%;height:100%;object-fit:cover}.booth-body{padding:20px;display:flex;flex-direction:column;flex:1}.booth-top{display:flex;gap:8px;align-items:center}.booth-code{font-size:12px;font-weight:900;color:#fff;background:var(--theme);padding:5px 8px;border-radius:999px}.booth-category{font-size:11px;color:var(--muted)}.booth-body h3{font-size:23px;margin:10px 0 8px}.booth-body p{color:var(--muted);line-height:1.65}.booth-link{margin-top:auto;padding-top:16px;color:var(--theme);text-decoration:none;font-weight:850}.product-mini{display:flex;gap:6px;margin-top:12px}.product-mini img{width:48px;height:48px;border-radius:8px;object-fit:cover;border:1px solid var(--line)}.booth-detail-hero{padding:54px 0;background:var(--bg)}.booth-detail-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:32px;align-items:center}.booth-detail-cover{width:100%;aspect-ratio:16/11;object-fit:cover;border-radius:var(--radius);background:#e9eaf0}.booth-detail-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.booth-detail h1{font-size:clamp(38px,6vw,72px);line-height:1;margin:14px 0}.booth-desc{font-size:17px;line-height:1.85;color:var(--muted)}.contact-box{padding:18px;border:1px solid var(--line);border-radius:14px;margin-top:18px;line-height:1.7}.product-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}.product-card{border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:#fff}.product-main-image{width:100%;aspect-ratio:4/3;object-fit:cover;background:var(--bg)}.product-placeholder{aspect-ratio:4/3;display:grid;place-items:center;background:var(--bg);color:#9aa1ad;font-weight:800}.product-content{padding:20px}.product-content h3{font-size:23px;margin:7px 0}.product-info{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.pill{padding:5px 8px;border-radius:999px;background:var(--bg);font-size:11px}.price{color:var(--theme);font-weight:900}.product-content p{white-space:pre-line;color:var(--muted);line-height:1.7}.product-gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:0 20px 20px}.product-gallery img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:9px}.day-block{margin-bottom:44px}.day-block h2{font-size:28px;margin-bottom:12px}.guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.guide-card{padding:26px;border:1px solid var(--line);border-radius:var(--radius)}.guide-card h2{font-size:25px;margin:0 0 14px}.guide-card p{white-space:pre-line;color:var(--muted);line-height:1.8}.faq-list{display:grid;gap:10px}.faq-item{border:1px solid var(--line);border-radius:14px;overflow:hidden}.faq-q{width:100%;border:0;background:#fff;text-align:left;padding:18px 20px;font-weight:850;font-size:16px;display:flex;justify-content:space-between;cursor:pointer}.faq-a{display:none;padding:0 20px 18px;color:var(--muted);line-height:1.75}.faq-item.open .faq-a{display:block}.faq-item.open .faq-q span{transform:rotate(45deg)}.back-link{display:inline-block;color:var(--theme);font-weight:800;text-decoration:none;margin-bottom:20px}footer{padding:42px 20px;background:#101218;color:#b6bdca}.footer-inner{display:flex;gap:20px;justify-content:space-between;align-items:center}.footer-links{display:flex;gap:12px;flex-wrap:wrap}.footer-links a{color:#b6bdca;text-decoration:none;font-size:12px}.guest-placeholder{width:100%;aspect-ratio:4/3;display:grid;place-items:center;background:linear-gradient(135deg,${slugColor(c.themeColor,'18')},${slugColor(c.accentColor,'18')});color:var(--theme);font-size:13px;font-weight:900;letter-spacing:.12em}.visitor-empty{grid-column:1/-1;padding:42px 24px;text-align:center;border:1px dashed var(--line);border-radius:var(--radius);background:var(--bg);color:var(--muted)}.guest-card,.booth-card,.product-card,.card{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.guest-card:hover,.booth-card:hover,.product-card:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(20,22,34,.07);border-color:#d9dce5}.mobile-nav{display:none}@media(max-width:820px){body{padding-bottom:66px;-webkit-text-size-adjust:100%}.site-nav{height:60px}.nav-inner{gap:10px}.logo{font-size:15px}.ticket-btn{min-height:44px;display:inline-flex;align-items:center}.hero{min-height:62svh}.hero .wrap{padding-top:88px}.meta span{min-height:40px;display:inline-flex;align-items:center}.filter-btn,.view-btn,.saved-filter-btn{min-height:42px}.search{min-height:46px;font-size:16px}.nav-links{display:none}.mobile-nav{position:fixed;left:10px;right:10px;bottom:10px;z-index:50;display:grid;grid-template-columns:repeat(5,1fr);gap:3px;padding:5px;border:1px solid rgba(225,228,236,.95);border-radius:16px;background:rgba(255,255,255,.94);backdrop-filter:blur(16px);box-shadow:0 10px 34px rgba(18,22,32,.16)}.mobile-nav a{text-align:center;text-decoration:none;color:#6c7481;font-size:11px;font-weight:800;padding:9px 4px;border-radius:11px}.mobile-nav a.active{background:var(--ink);color:#fff}.cards,.guest-grid,.booth-grid{grid-template-columns:1fr 1fr}.stats{grid-template-columns:1fr 1fr}.guide-grid,.booth-detail-grid{grid-template-columns:1fr}.hero{min-height:58vh}.section{padding:56px 0}.schedule-row{grid-template-columns:88px 1fr}.schedule-row small{display:none}.product-grid{grid-template-columns:1fr}}@media(max-width:560px){.wrap{width:min(100% - 28px,1120px)}.cards,.guest-grid,.booth-grid{grid-template-columns:1fr}.hero h1{font-size:46px}.hero .wrap{padding-bottom:54px}.page-hero{padding:44px 0 30px}.section h2{font-size:34px}.footer-inner{display:block}footer{padding-bottom:86px}.footer-links{margin-top:14px}.product-gallery{grid-template-columns:repeat(3,1fr)}}`;
}

function staticExtraCss(){return `.wish-btn{position:absolute;right:10px;top:10px;border:1px solid rgba(255,255,255,.75);background:rgba(255,255,255,.92);border-radius:999px;padding:7px 10px;font-size:11px;font-weight:850;color:#555f6d;cursor:pointer}.wish-btn.saved,.detail-wish.saved{background:var(--theme);border-color:var(--theme);color:#fff}.booth-cover{position:relative}.detail-wish{border:1px solid var(--line);background:#fff;border-radius:999px;padding:9px 13px;font-weight:850;color:#5f6673;cursor:pointer;margin:4px 0 12px}.booth-finder{padding:20px;border:1px solid var(--line);border-radius:var(--radius);background:var(--bg);margin-bottom:20px}.booth-finder h2{margin:0 0 5px;font-size:22px}.booth-finder p{margin:0 0 12px;color:var(--muted)}.map-search-results{display:grid;gap:6px;margin-top:9px}.map-search-results a{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:8px;align-items:center;padding:9px 10px;background:#fff;border:1px solid var(--line);border-radius:10px;text-decoration:none;color:var(--ink)}.finder-empty{padding:10px;color:var(--muted);text-align:center}.hidden{display:none!important}.booth-search-panel{margin-bottom:24px;padding:16px;border:1px solid var(--line);border-radius:var(--radius);background:var(--bg)}.booth-search-row{display:flex;gap:8px;margin-bottom:12px}.booth-search-row .search{min-width:0}.search-result-meta{margin-top:10px;color:var(--muted);font-size:12px}.visitor-map-wrap{margin-bottom:22px}.visitor-map-stage{position:relative;border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:var(--bg);line-height:0}.visitor-map-stage .map-img{margin:0!important;border-radius:0;max-height:none;object-fit:contain;background:#fff}.visitor-map-marker{position:absolute;transform:translate(-50%,-50%);z-index:2;display:flex;align-items:center;gap:6px;max-width:180px;padding:6px 9px;border:2px solid #fff;border-radius:999px;background:var(--theme);color:#fff;text-decoration:none;box-shadow:0 4px 14px rgba(20,25,40,.28);line-height:1.1}.visitor-map-marker span{font-size:11px;font-weight:900}.visitor-map-marker b{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.map-help{margin:8px 2px 0;color:var(--muted);font-size:12px}.sponsor-group{margin-bottom:44px}.sponsor-group>h2{font-size:28px;margin-bottom:14px}.sponsor-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.sponsor-card{display:flex;align-items:center;gap:16px;padding:18px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;text-decoration:none;color:var(--ink)}.sponsor-card img,.sponsor-logo-placeholder{width:92px;height:64px;object-fit:contain;border-radius:10px;background:var(--bg);flex:0 0 auto}.sponsor-logo-placeholder{display:grid;place-items:center;font-weight:900;color:var(--theme)}.sponsor-card h3{margin:0 0 5px;font-size:17px}.sponsor-card p{margin:0;color:var(--muted);font-size:12px;line-height:1.5}.home-sponsor-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:20px}.home-sponsor-head h2{margin:4px 0 0}.home-sponsor-head>a{color:var(--theme);text-decoration:none;font-weight:850}.home-sponsor-logos{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.home-sponsor-logos img,.home-sponsor-logos span{width:132px;height:76px;border:1px solid var(--line);border-radius:14px;background:#fff;object-fit:contain;padding:12px}.home-sponsor-logos span{display:grid;place-items:center;text-align:center;font-weight:800;padding:8px}@media(max-width:820px){.sponsor-grid{grid-template-columns:1fr 1fr}.visitor-map-marker b{display:none}.visitor-map-marker{padding:6px 8px}.booth-search-row{flex-direction:column}}@media(max-width:560px){.sponsor-grid{grid-template-columns:1fr}.home-sponsor-logos img,.home-sponsor-logos span{width:104px;height:62px}}@media(max-width:560px){.booth-search-panel .filters{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin}.booth-search-panel .filter-btn{flex:0 0 auto}.booth-search-panel{padding:12px}.search-result-meta{margin-top:7px}}.booth-view-switch{display:inline-flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:12px;background:#fff;margin-bottom:12px}.view-btn{border:0;background:transparent;color:var(--muted);padding:8px 13px;border-radius:9px;font-weight:850;cursor:pointer}.view-btn.active{background:var(--ink);color:#fff}.booth-product-preview{margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}.booth-product-preview-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:8px}.booth-product-preview-head span{font-size:12px;font-weight:900}.booth-product-preview-head small{font-size:11px;color:var(--muted)}.booth-product-preview-list{display:grid;gap:6px}.booth-product-chip{display:grid;grid-template-columns:34px minmax(0,1fr);gap:8px;align-items:center;min-width:0}.booth-product-chip img,.mini-no-image{width:34px;height:34px;border-radius:8px;object-fit:cover;background:var(--bg)}.mini-no-image{display:grid;place-items:center;font-size:8px;color:#9299a5;font-weight:900}.booth-product-chip b{font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.product-browse-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.browse-product-card{border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:#fff;display:flex;flex-direction:column}.browse-product-image{width:100%;aspect-ratio:4/3;object-fit:cover;background:var(--bg)}.browse-product-placeholder{display:grid;place-items:center;color:#9aa1ad;font-weight:850}.browse-product-body{padding:18px;display:flex;flex-direction:column;flex:1}.browse-product-body h3{font-size:21px;margin:8px 0}.browse-product-body p{color:var(--muted);line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.product-circle-link{display:flex;gap:8px;align-items:center;color:var(--ink);text-decoration:none;font-size:12px;margin:2px 0 6px;min-width:0}.product-circle-link b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.detail-section-label{font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--theme);margin-bottom:8px}.jump-products{display:inline-flex;margin-top:16px;color:var(--theme);text-decoration:none;font-weight:850}.product-section-head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:22px}.product-section-head h2{margin:3px 0 0!important}.product-section-head>span{color:var(--muted);font-size:13px}@media(max-width:820px){.product-browse-grid{grid-template-columns:1fr 1fr}}@media(max-width:560px){.product-browse-grid{grid-template-columns:1fr}.booth-view-switch{width:100%}.view-btn{flex:1}.booth-product-preview-list{grid-template-columns:1fr 1fr 1fr}.booth-product-chip{display:block}.booth-product-chip img,.booth-product-chip .mini-no-image{width:100%;height:auto;aspect-ratio:1}.booth-product-chip b{display:block;margin-top:4px}}

:root{--surface-soft:color-mix(in srgb,var(--bg) 72%,white);--shadow-soft:0 14px 40px rgba(20,24,36,.065);--shadow-hover:0 20px 54px rgba(20,24,36,.11)}
html{scroll-padding-top:86px}
body{overflow-x:hidden}
a,button,input{ -webkit-tap-highlight-color:transparent }
a:focus-visible,button:focus-visible,input:focus-visible,.faq-q:focus-visible{outline:3px solid color-mix(in srgb,var(--theme) 72%,white);outline-offset:3px}
.wrap{width:min(1180px,calc(100% - 48px))}
.announcement{font-size:12px;letter-spacing:.025em;padding:8px 16px;background:#161922}
.nav{height:70px;background:rgba(255,255,255,.88);border-bottom:1px solid rgba(226,229,237,.88);box-shadow:0 8px 30px rgba(23,27,39,.035)}
.logo{font-size:14px;letter-spacing:-.035em}.nav-links{gap:5px}.nav-links a{padding:9px 11px}.ticket{box-shadow:0 8px 20px color-mix(in srgb,var(--theme) 25%,transparent)}
.hero{min-height:clamp(590px,74vh,820px);isolation:isolate;overflow:hidden}.hero:before{z-index:-1;background:linear-gradient(112deg,rgba(10,12,19,.84) 0%,rgba(10,12,19,.56) 43%,rgba(10,12,19,.16) 76%,rgba(10,12,19,.28) 100%)}.hero:after{content:"";position:absolute;z-index:-1;width:46vw;height:46vw;max-width:620px;max-height:620px;right:-10vw;top:-18vw;border-radius:50%;background:color-mix(in srgb,var(--accent) 22%,transparent);filter:blur(2px)}
.hero-content{padding:120px 0 86px}.hero h1{font-size:clamp(52px,8.5vw,104px);text-wrap:balance}.hero-tag{max-width:720px;line-height:1.35}.meta span{background:rgba(255,255,255,.11);border-color:rgba(255,255,255,.2);box-shadow:inset 0 1px rgba(255,255,255,.08)}
.page-hero{position:relative;overflow:hidden;padding:76px 0 48px}.page-hero:after{content:"";position:absolute;right:-90px;top:-140px;width:360px;height:360px;border-radius:50%;background:color-mix(in srgb,var(--accent) 8%,transparent)}.page-hero .wrap{position:relative;z-index:1}.page-hero h1{max-width:900px;text-wrap:balance}.page-hero p{font-size:16px}
.section{padding:82px 0}.section.alt{background:linear-gradient(180deg,var(--surface-soft),var(--bg))}.section h2{line-height:1.02;text-wrap:balance}.section>.wrap>h2:after,.home-sponsor-head h2:after{content:"";display:block;width:34px;height:4px;border-radius:999px;margin-top:13px;background:linear-gradient(90deg,var(--theme),var(--accent))}
.card,.guest-card,.booth-card,.product-card,.guide-card,.browse-product-card,.sponsor-card{border-color:color-mix(in srgb,var(--line) 88%,transparent);box-shadow:var(--shadow-soft)}
.card,.guest-card,.booth-card,.product-card,.browse-product-card,.sponsor-card{transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}.card:hover,.guest-card:hover,.booth-card:hover,.product-card:hover,.browse-product-card:hover,.sponsor-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-hover);border-color:color-mix(in srgb,var(--theme) 18%,var(--line))}
.cards{gap:20px}.card{padding:26px}.card h3{font-size:18px}.copy{font-size:17px;max-width:880px}
.stats{gap:16px}.stat{position:relative;overflow:hidden;padding:28px;background:linear-gradient(150deg,#171a24,#242936)}.stat:after{content:"";position:absolute;width:90px;height:90px;border-radius:50%;right:-40px;top:-45px;background:rgba(255,255,255,.055)}.stat strong{font-variant-numeric:tabular-nums}
.schedule-row{padding:20px 2px;transition:background-color .18s ease,padding .18s ease}.schedule-row:hover{background:color-mix(in srgb,var(--theme) 4%,white);padding-left:10px;padding-right:10px}.schedule-row strong{font-variant-numeric:tabular-nums}
.cta{position:relative;overflow:hidden;background:linear-gradient(120deg,var(--theme),var(--accent))}.cta:before{content:"";position:absolute;width:300px;height:300px;border-radius:50%;left:-120px;top:-170px;background:rgba(255,255,255,.09)}.cta .wrap{position:relative}.cta a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 9px 24px rgba(32,18,70,.18)}
.guest-card img,.booth-cover img,.product-main,.browse-product-image{transition:transform .32s ease}.guest-card:hover img,.booth-card:hover .booth-cover img,.product-card:hover .product-main,.browse-product-card:hover .browse-product-image{transform:scale(1.025)}
.booth-search-panel{padding:18px;background:linear-gradient(145deg,color-mix(in srgb,var(--theme) 4%,white),color-mix(in srgb,var(--accent) 2%,white));border-color:color-mix(in srgb,var(--theme) 10%,var(--line));box-shadow:0 10px 34px rgba(22,25,36,.035)}
.booth-view-switch{margin-bottom:14px;border-color:color-mix(in srgb,var(--theme) 12%,var(--line));box-shadow:0 2px 8px rgba(20,24,36,.035)}.view-btn{min-height:40px}.view-btn.active{background:linear-gradient(135deg,#171a24,#2b3040)}
.search{min-height:46px;background:#fff;border-color:color-mix(in srgb,var(--line) 90%,transparent)}.filter,.filter-btn{min-height:40px;transition:background-color .16s ease,border-color .16s ease,transform .16s ease}.filter:hover,.filter-btn:hover{border-color:color-mix(in srgb,var(--theme) 30%,var(--line));transform:translateY(-1px)}
.booth-grid,.product-browse-grid{gap:20px}.booth-card{border-radius:calc(var(--radius) + 2px)}.booth-cover{overflow:hidden}.booth-body{padding:21px}.booth-code{padding:6px 9px;letter-spacing:.02em;box-shadow:0 5px 12px color-mix(in srgb,var(--theme) 18%,transparent)}.booth-category{font-weight:700}.booth-body h3{font-size:24px}.booth-body>p{min-height:2.8em}.tag,.pill{border:1px solid color-mix(in srgb,var(--line) 80%,transparent);background:color-mix(in srgb,var(--bg) 84%,white)}.booth-link{display:inline-flex;align-items:center;gap:5px;font-size:13px}.booth-product-preview{margin-top:16px;padding-top:14px}.booth-product-preview-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.booth-product-chip{grid-template-columns:42px minmax(0,1fr);gap:8px;padding:6px;border-radius:11px;background:color-mix(in srgb,var(--bg) 82%,white)}.booth-product-chip img,.mini-no-image{width:42px;height:42px}.booth-product-chip b{font-size:10px;line-height:1.3;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.wish-btn{min-height:36px;padding:8px 11px;border-color:rgba(255,255,255,.88);box-shadow:0 5px 16px rgba(16,20,30,.1)}
.browse-product-card{border-radius:calc(var(--radius) + 2px)}.browse-product-body{padding:20px}.browse-product-body h3{font-size:23px}.product-circle-link{padding:8px 9px;border-radius:11px;background:var(--bg)}
.booth-detail-hero{padding:64px 0;background:linear-gradient(180deg,var(--surface-soft),#fff)}.booth-detail-grid{gap:44px;align-items:center}.booth-detail-cover{box-shadow:0 22px 54px rgba(20,24,36,.12)}.booth-detail h1{max-width:720px}.contact{box-shadow:0 8px 28px rgba(20,24,36,.04)}.jump-products{min-height:44px;align-items:center;padding:10px 14px;border-radius:999px;background:color-mix(in srgb,var(--theme) 9%,white)}.product-section-head{padding-bottom:16px;border-bottom:1px solid var(--line)}.product-grid{gap:22px}
.visitor-map-stage{box-shadow:var(--shadow-soft);border-color:color-mix(in srgb,var(--theme) 10%,var(--line))}.visitor-map-marker{min-width:38px;min-height:38px;justify-content:center;padding:7px 10px;border-width:3px;box-shadow:0 7px 18px rgba(28,24,70,.28);transition:transform .16s ease,box-shadow .16s ease}.visitor-map-marker:hover,.visitor-map-marker:focus-visible{transform:translate(-50%,-50%) scale(1.08);box-shadow:0 10px 24px rgba(28,24,70,.34)}.map-help{padding:8px 2px 0}.booth-finder{background:linear-gradient(145deg,var(--surface-soft),#fff);box-shadow:0 8px 26px rgba(20,24,36,.035)}
.guide-card{padding:28px}.guide-card h2{font-size:25px}.faq-item{box-shadow:0 7px 24px rgba(22,25,36,.025)}.faq-q{min-height:58px}.faq-item.open{border-color:color-mix(in srgb,var(--theme) 18%,var(--line))}
.sponsor-group{display:grid;grid-template-columns:170px minmax(0,1fr);gap:30px;align-items:start;padding:28px;border:1px solid var(--line);border-radius:calc(var(--radius) + 4px);background:linear-gradient(145deg,var(--surface-soft),#fff);box-shadow:0 10px 34px rgba(22,25,36,.035)}.sponsor-group+.sponsor-group{margin-top:20px}.sponsor-group>h2{font-size:20px;margin:3px 0 0}.sponsor-grid{grid-template-columns:repeat(auto-fill,minmax(250px,330px));gap:14px}.sponsor-card{min-height:106px;padding:20px}.sponsor-card img,.sponsor-logo-placeholder{width:104px;height:70px;background:#fff;border:1px solid var(--line)}.sponsor-card h3{font-size:18px}.home-sponsor-logos{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,152px));gap:12px}.home-sponsor-logos img,.home-sponsor-logos span{width:100%;height:78px}.home-sponsor-head>a{min-height:40px;display:inline-flex;align-items:center}
.footer{padding-top:42px;background:#fbfbfd}.footer a{text-underline-offset:3px}.external-links-section{padding-top:20px}.external-links-public{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.external-links-public a{display:grid;grid-template-columns:1fr auto;gap:2px 12px;padding:18px;border:1px solid var(--line);border-radius:14px;text-decoration:none;color:var(--ink);background:#fff}.external-links-public small{grid-column:1/-1;color:var(--muted);font-size:10px}.external-links-public b{font-size:15px}.footer-owner{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;font-size:12px}.external-note{display:block;margin-top:7px;color:#828896;max-width:520px;line-height:1.5}
@supports(content-visibility:auto){.booth-card,.browse-product-card,.product-card,.guest-card{content-visibility:auto;contain-intrinsic-size:360px 460px}}
@media(any-pointer:coarse){.nav-links a,.ticket,.filter,.filter-btn,.view-btn,.wish-btn,.detail-wish,.cta a,.mobile-nav a{min-height:44px}}
@media(max-width:840px){html{scroll-padding-bottom:92px}.wrap{width:min(100% - 34px,1180px)}body{padding-bottom:calc(78px + env(safe-area-inset-bottom))}.mobile-nav{left:10px;right:10px;bottom:max(8px,env(safe-area-inset-bottom));padding:5px;gap:3px;border:1px solid rgba(255,255,255,.13);background:rgba(20,23,31,.91);box-shadow:0 14px 44px rgba(12,14,20,.25)}.mobile-nav a{min-height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.05}.mobile-nav span{font-size:16px;margin-bottom:4px}.footer{padding-bottom:42px}.sponsor-group{grid-template-columns:1fr;padding:22px;gap:16px}.sponsor-group>h2{font-size:18px}.sponsor-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.booth-detail-grid{gap:28px}.section{padding:62px 0}}
@media(max-width:560px){.wrap{width:min(100% - 28px,1180px)}.nav{height:62px}.hero{min-height:64vh}.hero-content{padding:88px 0 62px}.hero h1{font-size:clamp(44px,14vw,64px)}.hero-tag{font-size:18px}.page-hero{padding:52px 0 34px}.page-hero h1{font-size:clamp(38px,12vw,54px)}.section{padding:50px 0}.section h2{font-size:clamp(30px,10vw,42px)}.cards,.guest-grid,.booth-grid,.product-grid,.guide-grid{grid-template-columns:1fr}.booth-search-panel{padding:13px}.booth-product-preview-list{grid-template-columns:repeat(3,minmax(0,1fr))}.booth-product-chip{display:block;padding:5px}.booth-product-chip img,.booth-product-chip .mini-no-image{width:100%;height:auto;aspect-ratio:1}.booth-product-chip b{display:block;margin-top:5px;-webkit-line-clamp:2}.sponsor-grid{grid-template-columns:1fr}.sponsor-card{min-height:96px}.home-sponsor-logos{grid-template-columns:repeat(3,minmax(0,1fr))}.home-sponsor-logos img,.home-sponsor-logos span{height:66px;padding:9px}.visitor-map-marker{min-width:34px;min-height:34px;padding:5px 7px}.visitor-map-marker b{display:none}.product-section-head{align-items:center}.product-section-head>span{white-space:nowrap}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}*,*:before,*:after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}


.site-nav{height:70px;background:rgba(255,255,255,.88);box-shadow:0 8px 30px rgba(23,27,39,.035)}
.ticket-btn{box-shadow:0 8px 20px color-mix(in srgb,var(--theme) 25%,transparent)}
.product-main-image{transition:transform .32s ease}.product-card:hover .product-main-image{transform:scale(1.025)}
.contact-box{box-shadow:0 8px 28px rgba(20,24,36,.04)}
.back-link{display:inline-flex;align-items:center;min-height:36px}
.visitor-empty{background:color-mix(in srgb,var(--bg) 80%,white);border-color:color-mix(in srgb,var(--line) 90%,transparent)}
footer{background:#11141b}
@media(max-width:840px){.site-nav{height:62px}footer{padding-bottom:42px}}


.guest-profile-list{display:grid;gap:22px}.guest-profile-card{border:1px solid var(--line);border-radius:calc(var(--radius) + 2px);background:#fff;overflow:hidden;box-shadow:var(--shadow-soft,0 10px 34px rgba(22,25,36,.05))}.guest-profile-main{display:grid;grid-template-columns:240px minmax(0,1fr);gap:0}.guest-profile-image{width:100%;height:100%;min-height:260px;object-fit:cover;background:var(--bg)}.guest-profile-copy{padding:28px}.guest-profile-copy h2{font-size:clamp(30px,4vw,48px);margin:6px 0 12px}.guest-profile-copy>p{color:var(--muted);line-height:1.8;white-space:pre-line}.guest-platform-links{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.guest-platform-link{display:inline-flex;align-items:center;min-height:38px;padding:8px 11px;border:1px solid var(--line);border-radius:999px;color:var(--ink);text-decoration:none;font-size:12px;font-weight:750;background:#fff}.guest-platform-link:hover{border-color:color-mix(in srgb,var(--theme) 30%,var(--line));color:var(--theme)}.guest-works{padding:0 28px 28px}.guest-subhead{padding-top:18px;border-top:1px solid var(--line);font-size:12px;font-weight:850;color:var(--muted);margin-bottom:12px}.guest-work-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.guest-work-card{display:grid;grid-template-columns:78px minmax(0,1fr);gap:10px;align-items:center;padding:9px;border:1px solid var(--line);border-radius:12px;color:var(--ink);text-decoration:none;background:var(--bg)}.guest-work-card img,.guest-work-placeholder{width:78px;height:66px;object-fit:cover;border-radius:8px;background:#e9eaf0}.guest-work-placeholder{display:grid;place-items:center;font-size:9px;font-weight:900;color:#9298a4}.guest-work-card b{font-size:13px}.guest-work-card p{margin:4px 0 0;color:var(--muted);font-size:11px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.product-card-actions{display:flex;justify-content:flex-end;margin-bottom:8px}.product-wish-btn{border:1px solid var(--line);background:#fff;color:#5f6673;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:800;cursor:pointer}.product-wish-btn.saved{background:color-mix(in srgb,var(--accent) 12%,white);color:#c43d73;border-color:color-mix(in srgb,var(--accent) 35%,var(--line))}
.transport-image{width:100%;display:block;margin-top:16px;border-radius:12px;max-height:260px;object-fit:cover;border:1px solid var(--line)}.map-nav-link{display:inline-flex;align-items:center;justify-content:center;margin-top:14px;min-height:42px;padding:10px 14px;border-radius:999px;background:var(--ink);color:#fff;text-decoration:none;font-size:12px;font-weight:800}.map-nav-link:hover{transform:translateY(-1px)}
.activity-meta{font-weight:500}.activity-time{font-size:14px;color:var(--theme);font-weight:650;font-variant-numeric:tabular-nums}.activity-meta span:not(.activity-time),.activity-meta em{font-weight:550}.activity-content h3{font-weight:700;letter-spacing:-.02em}.schedule-row strong{font-weight:650}
@media(max-width:820px){.guest-profile-main{grid-template-columns:180px minmax(0,1fr)}.guest-work-grid{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.guest-profile-main{grid-template-columns:1fr}.guest-profile-image{min-height:0;aspect-ratio:4/3}.guest-profile-copy{padding:20px}.guest-works{padding:0 20px 20px}.guest-work-grid{grid-template-columns:1fr}.guest-work-card{grid-template-columns:68px minmax(0,1fr)}.guest-work-card img,.guest-work-placeholder{width:68px;height:58px}}
.booth-card{overflow:visible}.booth-card-head{display:grid;grid-template-columns:82px minmax(0,1fr) auto;gap:14px;align-items:center;padding:20px 20px 0}.booth-logo-link{display:block;text-decoration:none}.booth-logo-frame{width:82px;aspect-ratio:1;border-radius:18px;overflow:hidden;background:linear-gradient(135deg,color-mix(in srgb,var(--theme) 15%,white),color-mix(in srgb,var(--accent) 12%,white));border:1px solid var(--line)}.booth-logo-image{display:block;width:100%;height:100%;object-fit:cover}.booth-logo-placeholder{display:grid;place-items:center;font-size:19px;font-weight:950;color:var(--theme)}.booth-card-identity{min-width:0}.booth-card-identity h3{font-size:23px;margin:8px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.booth-card-head .wish-btn{position:static;align-self:start;white-space:nowrap}.booth-card .booth-body{padding-top:15px}.booth-card .booth-body>p{margin-top:0}.booth-detail-grid{grid-template-columns:minmax(220px,320px) minmax(0,1fr);align-items:center}.booth-detail-logo-panel{display:flex;justify-content:center}.booth-detail-logo-frame{width:min(100%,300px);aspect-ratio:1;border-radius:28px;overflow:hidden;border:1px solid var(--line);background:linear-gradient(135deg,color-mix(in srgb,var(--theme) 14%,white),color-mix(in srgb,var(--accent) 12%,white));box-shadow:0 18px 44px rgba(25,28,40,.08)}.booth-detail-logo{display:block;width:100%;height:100%;object-fit:cover}.booth-detail-logo.booth-logo-placeholder{display:grid;font-size:48px}@media(max-width:820px){.booth-detail-grid{grid-template-columns:180px minmax(0,1fr);gap:24px}}@media(max-width:620px){.booth-card-head{grid-template-columns:70px minmax(0,1fr);padding:16px 16px 0}.booth-logo-frame{width:70px;border-radius:15px}.booth-card-head .wish-btn{grid-column:1/-1;justify-self:start}.booth-detail-grid{grid-template-columns:1fr}.booth-detail-logo-panel{justify-content:flex-start}.booth-detail-logo-frame{width:150px;border-radius:22px}.community-section{background:linear-gradient(135deg,color-mix(in srgb,var(--theme) 7%,white),color-mix(in srgb,var(--accent) 6%,white))}.community-layout{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:30px;align-items:center}.community-layout h2{margin:5px 0 10px}.community-layout p{color:var(--muted);line-height:1.75}.community-lines{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.community-lines span{padding:9px 11px;background:#fff;border:1px solid var(--line);border-radius:10px;font-size:12px}.community-lines b{margin-right:7px}.community-link{display:inline-flex;padding:11px 15px;border-radius:999px;background:var(--theme);color:#fff;text-decoration:none;font-weight:850}.community-qr-grid{display:flex;gap:12px}.community-qr-card{width:132px;padding:10px;background:#fff;border:1px solid var(--line);border-radius:16px;text-align:center}.community-qr-card img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:9px}.community-qr-card b,.community-qr-card span{display:block;font-size:11px;margin-top:5px}.showcase-intro{max-width:850px;font-size:17px;line-height:1.85;color:var(--muted);margin-bottom:28px}.showcase-info-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:34px}.showcase-info-grid article{padding:22px;border:1px solid var(--line);border-radius:var(--radius);background:#fff}.showcase-info-grid h3{margin:0 0 9px}.showcase-info-grid p{margin:0;color:var(--muted);line-height:1.7}.showcase-signup{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:26px;align-items:center;padding:26px;border:1px solid var(--line);border-radius:var(--radius);background:var(--bg)}.showcase-signup h2{font-size:30px;margin:4px 0 8px}.showcase-signup p{color:var(--muted);line-height:1.7}.showcase-signup-qr{width:180px;aspect-ratio:1;object-fit:cover;border-radius:16px;background:#fff;border:1px solid var(--line);padding:8px}@media(max-width:820px){.community-layout,.showcase-signup{grid-template-columns:1fr}.community-qr-grid{justify-content:flex-start}.showcase-info-grid{grid-template-columns:1fr 1fr}}@media(max-width:560px){.showcase-info-grid{grid-template-columns:1fr}.community-qr-grid{display:grid;grid-template-columns:1fr 1fr}.community-qr-card{width:auto}.showcase-signup-qr{width:min(180px,60vw)}}@media(max-width:820px){.mobile-nav{display:flex!important;overflow-x:auto!important;justify-content:flex-start!important;grid-template-columns:none!important}.mobile-nav a{min-width:68px;flex:0 0 68px}}.booth-detail-logo.booth-logo-placeholder{font-size:30px}}.showcase-gallery-section{margin:8px 0 36px}.showcase-gallery-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin-bottom:16px}.showcase-gallery-head h2{margin:4px 0 0;font-size:clamp(28px,4vw,44px)}.showcase-gallery-head>span{color:var(--muted);font-size:12px}.showcase-gallery-grid{display:grid;gap:16px}.showcase-gallery-grid.portrait{grid-template-columns:repeat(4,minmax(0,1fr))}.showcase-gallery-grid.landscape{grid-template-columns:repeat(3,minmax(0,1fr))}.showcase-gallery-card{overflow:hidden;border:1px solid var(--line);border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(22,25,36,.045)}.showcase-gallery-grid.portrait .showcase-gallery-card>img{aspect-ratio:3/4}.showcase-gallery-grid.landscape .showcase-gallery-card>img{aspect-ratio:4/3}.showcase-gallery-card>img{display:block;width:100%;object-fit:cover;background:var(--bg)}.showcase-gallery-copy{padding:15px 16px 17px}.showcase-gallery-copy h3{font-size:17px;margin:0 0 6px}.showcase-gallery-copy p{margin:0;color:var(--muted);line-height:1.6;font-size:13px;white-space:pre-line}@media(max-width:820px){.showcase-gallery-grid.portrait{grid-template-columns:repeat(3,minmax(0,1fr))}.showcase-gallery-grid.landscape{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.showcase-gallery-grid.portrait{grid-template-columns:repeat(2,minmax(0,1fr))}.showcase-gallery-grid.landscape{grid-template-columns:1fr}.showcase-gallery-head{align-items:center}}@media(max-width:620px){.hero{background-image:linear-gradient(180deg,rgba(10,12,18,.25),rgba(10,12,18,.60)),var(--hero-mobile)!important;background-position:center!important;min-height:76vh}}.day-block{margin:0 0 46px}
.day-block>h2{display:flex;align-items:center;gap:12px;margin:0 0 16px;font-size:18px;font-weight:600;letter-spacing:.08em;color:var(--ink);text-transform:uppercase}
.day-block>h2:after{content:"";height:1px;flex:1;background:var(--line)}
.activity-list{display:grid;gap:14px}
.activity-card{display:grid;grid-template-columns:180px minmax(0,1fr);overflow:hidden;border:1px solid var(--line);border-radius:18px;background:#fff;box-shadow:0 8px 28px rgba(22,25,36,.035)}
.activity-card:not(:has(.activity-cover)){grid-template-columns:1fr}
.activity-cover{display:block;width:100%;height:100%;min-height:200px;object-fit:cover}
.activity-content{padding:20px 22px 22px;border-left:4px solid color-mix(in srgb,var(--theme) 68%,white)}
.activity-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:13px;font-size:12px;font-weight:500;color:#6f7785}
.activity-time{padding:0!important;background:transparent!important;color:var(--theme)!important;font-size:14px;font-weight:600!important;font-variant-numeric:tabular-nums;letter-spacing:.01em}
.activity-meta span:not(.activity-time),.activity-meta em{padding:5px 9px;border:1px solid var(--line);border-radius:999px;background:var(--bg);font-style:normal;font-weight:500}
.activity-content h3{margin:0 0 9px;font-size:22px;font-weight:600;line-height:1.3;letter-spacing:-.015em}
.activity-desc{margin:0;color:var(--muted);line-height:1.75;white-space:pre-line}
.activity-members{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:16px}
.activity-member{display:grid;grid-template-columns:50px minmax(0,1fr);gap:11px;align-items:start;padding:11px;border:1px solid #eef0f4;border-radius:13px;background:#fafbfc}
.activity-member img,.member-avatar{width:50px;height:50px;border-radius:11px;object-fit:cover}
.member-avatar{display:grid;place-items:center;background:color-mix(in srgb,var(--theme) 10%,white);color:var(--theme);font-size:15px}
.activity-member b{display:block;font-size:14px;font-weight:600;line-height:1.35}
.activity-member small{display:block;color:var(--theme);margin-top:2px;font-size:11px;font-weight:500}
.activity-member p{margin:6px 0 0;font-size:12px;color:var(--muted);line-height:1.55}
@media(max-width:840px){.activity-card{grid-template-columns:1fr}.activity-cover{height:220px;min-height:0}.activity-content{border-left:0;border-top:4px solid color-mix(in srgb,var(--theme) 68%,white)}.activity-members{grid-template-columns:1fr}}

.saved-toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:2px 0 14px;padding:10px 12px;border:1px solid var(--line);border-radius:14px;background:#fff}
.saved-toolbar-label{font-size:11px;color:var(--muted);font-weight:600;margin-right:2px}
.saved-filter-btn{min-height:36px;padding:8px 11px;border:1px solid var(--line);border-radius:999px;background:#fff;color:#555e6b;font-size:12px;font-weight:600;cursor:pointer}
.saved-filter-btn b{display:inline-grid;place-items:center;min-width:20px;height:20px;margin-left:4px;padding:0 5px;border-radius:999px;background:var(--bg);font-size:10px;font-weight:700}
.saved-filter-btn:hover{border-color:color-mix(in srgb,var(--theme) 36%,var(--line));color:var(--theme)}
.saved-filter-btn.active{background:color-mix(in srgb,var(--theme) 9%,white);color:var(--theme);border-color:color-mix(in srgb,var(--theme) 32%,var(--line))}
@media(max-width:560px){.saved-toolbar{align-items:stretch}.saved-toolbar-label{width:100%}.saved-filter-btn{flex:1}}


body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background-image:linear-gradient(rgba(117,87,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(117,87,255,.035) 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(to bottom,#000 0%,transparent 72%)}
.announcement{font-weight:800;letter-spacing:.04em;background:linear-gradient(90deg,var(--ink),#2b2144)}
.site-nav{height:72px;border-bottom:2px solid var(--ink);box-shadow:0 8px 0 color-mix(in srgb,var(--theme) 12%,transparent)}
.logo{font-size:18px;text-transform:uppercase}.logo:before{content:"EVENT / ";font-size:10px;letter-spacing:.14em;color:var(--theme);vertical-align:2px;margin-right:6px}
.nav-links a{border-radius:0;position:relative}.nav-links a.active:after{content:"";position:absolute;left:9px;right:9px;bottom:2px;height:3px;background:var(--accent);transform:skewX(-18deg)}
.hero{min-height:78vh;border-bottom:8px solid var(--ink);overflow:hidden}.hero:after{content:"ONLYEVENT / OFFICIAL";position:absolute;right:-28px;bottom:46px;font-size:12px;font-weight:900;letter-spacing:.22em;writing-mode:vertical-rl;padding:14px 8px;background:var(--accent);color:white}
.hero .wrap{position:relative}.eyebrow{border-radius:0;border:2px solid #fff;background:rgba(15,16,25,.3);font-weight:900;letter-spacing:.16em}.hero h1{font-weight:950;text-transform:none;text-shadow:0 5px 26px rgba(0,0,0,.3)}
.meta span{border-radius:0;border:1px solid rgba(255,255,255,.55);background:rgba(0,0,0,.22);font-weight:800}.section{position:relative}.section>.wrap>h2:before{content:"// ";color:var(--accent);font-size:.55em;vertical-align:.28em;letter-spacing:.08em}.section.alt{background:color-mix(in srgb,var(--bg) 82%,white)}
.card,.guest-card,.booth-card,.product-card,.guide-card,.faq-item,.showcase-gallery-card,.sponsor-card{border:2px solid var(--ink);box-shadow:7px 7px 0 color-mix(in srgb,var(--theme) 24%,transparent);border-radius:10px}.card{position:relative}.card:before{content:"";position:absolute;left:-2px;top:-2px;width:34px;height:5px;background:var(--accent)}
.stat{border-radius:8px;border:2px solid var(--ink);box-shadow:6px 6px 0 var(--accent)}
.page-hero{border-bottom:3px solid var(--ink)}.page-kicker{letter-spacing:.2em}.page-hero h1{font-weight:950}.booth-code,.tag,.pill,.filter-btn,.ticket-btn{border-radius:5px!important}
.schedule-row{border-bottom:2px solid var(--ink)}footer{border-top:3px solid var(--ink)}
@media(max-width:620px){.site-nav{height:62px}.hero:after{display:none}.hero{min-height:72vh}.hero h1{font-size:clamp(40px,14vw,68px)}.cards,.guest-grid,.booth-grid,.stats{gap:12px}.card,.guest-card,.booth-card,.product-card,.guide-card,.faq-item{box-shadow:4px 4px 0 color-mix(in srgb,var(--theme) 22%,transparent)}}

.ticket-types-section{padding:calc(var(--section-space)*.72) 0;background:color-mix(in srgb,var(--bg) 72%,white)}
.ticket-types-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:22px}.ticket-types-head h2{font-size:clamp(32px,5vw,58px);margin:0}.ticket-types-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--card-gap)}.ticket-type-card{border:2px solid var(--ink);border-radius:var(--radius);background:var(--surface);padding:22px;box-shadow:6px 6px 0 color-mix(in srgb,var(--theme) 18%,transparent)}.ticket-type-card h3{margin:0 0 8px;font-size:22px}.ticket-type-price{font-size:clamp(30px,4vw,46px);font-weight:950;color:var(--theme);letter-spacing:-.04em}.ticket-type-gift{margin-top:14px;padding-top:14px;border-top:1px dashed var(--line);white-space:pre-line;line-height:1.65}.ticket-type-note{color:var(--muted);font-size:13px;line-height:1.6;margin-top:10px}@media(max-width:760px){.ticket-types-grid{grid-template-columns:1fr}}
`;}
function staticWishJs(){return `const WK='conventionWishlistV5',PWK='conventionProductWishlistV6';const readSet=k=>{try{return new Set(JSON.parse(localStorage.getItem(k)||'[]'))}catch{return new Set()}};const saveSet=(k,s)=>{try{localStorage.setItem(k,JSON.stringify([...s]))}catch{}};const wl=()=>readSet(WK),pwl=()=>readSet(PWK);function syncW(){document.querySelectorAll('[data-wish]').forEach(b=>{const on=wl().has(b.dataset.wish);b.classList.toggle('saved',on);b.textContent=on?'★ 已收藏':'☆ 收藏'});document.querySelectorAll('[data-product-wish]').forEach(b=>{const on=pwl().has(b.dataset.productWish);b.classList.toggle('saved',on);b.textContent=on?'♥ 已加入心愿单':'♡ 心愿单'})}document.querySelectorAll('[data-wish]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();const w=wl();w.has(b.dataset.wish)?w.delete(b.dataset.wish):w.add(b.dataset.wish);saveSet(WK,w);syncW();window.dispatchEvent(new Event('wishlistchange'))});document.querySelectorAll('[data-product-wish]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();const w=pwl();w.has(b.dataset.productWish)?w.delete(b.dataset.productWish):w.add(b.dataset.productWish);saveSet(PWK,w);syncW();window.dispatchEvent(new Event('productwishlistchange'))});syncW();`; }
function previewLinks(c){const f=c.features||{};return [['index.html','首页',true],['guests.html','嘉宾',f.guests===true],['booths.html','摊位',f.booths===true],['schedule.html','日程',f.schedule===true],['guide.html','指南',f.guide===true],['faq.html','FAQ',f.faq===true],['sponsors.html','合作',f.sponsors===true]].filter(x=>x[2]);}
function ipOnlyLabel(c,key,fallback=''){const has=c?.ipOnlyLabels&&Object.prototype.hasOwnProperty.call(c.ipOnlyLabels,key);return String(has?c.ipOnlyLabels[key]:fallback??'');}
function ipOnlyNavHtml(c,current){
  const ticket=(c.externalLinks||[]).find(x=>x.kind==='ticket'&&validExternalUrl(x.url));
  const social=(c.community||{});
  const socialLink=social.link&&validExternalUrl(social.link)?social.link:'#community';
  const topDefault=[c.eventDate,c.eventLocation].filter(Boolean).join(' · ')||'IP ONLY EVENT';return `<div class="ip-topbar"><div class="wrap"><span data-ve-label="topbarMeta">${esc(ipOnlyLabel(c,'topbarMeta',topDefault))}</span><div class="ip-top-social">${social.qqGroup?`<a href="index.html#community"><span data-ve-label="topQQ">${esc(ipOnlyLabel(c,'topQQ','QQ群'))}</span></a>`:''}${social.wechatGroup?`<a href="index.html#community"><span data-ve-label="topWechat">${esc(ipOnlyLabel(c,'topWechat','微信群'))}</span></a>`:''}${social.link?`<a href="${escAttr(safeUrl(socialLink))}" target="_blank" rel="noopener"><span data-ve-label="topSocial">${esc(ipOnlyLabel(c,'topSocial',social.linkLabel||'活动主页'))}</span></a>`:''}</div></div></div><nav class="site-nav ip-site-nav"><div class="wrap nav-inner"><a class="logo ip-logo" href="index.html#top"><b data-ve-label="logoMark">${esc(ipOnlyLabel(c,'logoMark',(c.eventName||'OE').slice(0,2).toUpperCase()))}</b><span data-ve-key="eventName">${esc(c.eventName||'ONLY EVENT')}</span></a><div class="nav-links"><a href="index.html#projects"><span data-ve-label="navProjects">${esc(ipOnlyLabel(c,'navProjects','本届企划'))}</span></a>${featureEnabled('booths',c)?`<a href="index.html#booths-home"><span data-ve-label="navBooths">${esc(ipOnlyLabel(c,'navBooths','摊位'))}</span></a>`:''}${featureEnabled('schedule',c)?`<a href="index.html#schedule-home"><span data-ve-label="navSchedule">${esc(ipOnlyLabel(c,'navSchedule','日程'))}</span></a>`:''}${featureEnabled('guide',c)?`<a href="guide.html"><span data-ve-label="navGuide">${esc(ipOnlyLabel(c,'navGuide','指南'))}</span></a>`:''}${ticket?`<a class="ticket-btn" href="${escAttr(ticket.url)}" target="_blank" rel="noopener noreferrer"><span data-ve-label="navTicket">${esc(ipOnlyLabel(c,'navTicket','前往购票平台 ↗'))}</span></a>`:''}</div></div></nav>`;
}
function navHtml(c,current){
  const adapter=templateAdapter(c);if(adapter?.nav)return adapter.nav(c,current);
  const active=current.startsWith('booth-')?'booths.html':current;
  const links=previewLinks(c);
  if((c.eventTemplate||'')==='portal-global'){
    return `<div class="pg-utility"><div class="wrap"><div class="pg-utility-links"><a href="index.html#community">QQ群</a><a href="index.html#community">微信群</a><a href="index.html#community">B站</a><a href="sponsors.html">主办合作</a></div></div></div><nav class="site-nav"><div class="wrap nav-inner"><a class="logo" href="index.html">${esc(c.eventName||'OE')}</a><div class="nav-links"><a href="index.html">首页</a><a href="index.html#explore">活动内容</a>${featureEnabled('schedule',c)?'<a href="schedule.html">活动日程</a>':''}${featureEnabled('booths',c)?'<a href="booths.html">摊位与制品</a>':''}<a href="index.html#community">社群交流</a>${featureEnabled('faq',c)?'<a href="faq.html">帮助 / FAQ</a>':''}${c.ticketUrl?`<a class="ticket-btn" href="${escAttr(safeUrl(c.ticketUrl))}">查看票务</a>`:''}</div><div class="pg-top-meta">${c.eventDate?`<span>${esc(c.eventDate)}</span>`:''}${c.eventLocation?`<span>${esc(c.eventLocation)}</span>`:''}</div></div></nav>`;
  }
  return `${c.announcement?`<div class="announcement">${esc(c.announcement)}</div>`:''}<nav class="site-nav"><div class="wrap nav-inner"><a class="logo" href="index.html">${esc(c.eventName)}</a><div class="nav-links">${links.map(([h,l])=>`<a href="${h}" class="${active===h?'active':''}">${l}</a>`).join('')}${c.ticketUrl?`<a class="ticket-btn" href="${escAttr(safeUrl(c.ticketUrl))}">购票</a>`:''}</div></div></nav>`;
}
function ipOnlyFooterHtml(c){return `<footer class="ip-footer"><div class="wrap"><div class="ip-footer-credit" data-ve-label="footerCredit">${esc(ipOnlyLabel(c,'footerCredit','STAFF / CREDIT'))}</div><div class="ip-footer-grid"><div><h2 data-ve-key="eventName">${esc(c.eventName||'ONLY EVENT')}</h2><p data-ve-key="eventTagline">${esc(c.eventTagline||'作品主题 ONLY 活动官方网站')}</p><small data-ve-label="footerDisclaimer">${esc(ipOnlyLabel(c,'footerDisclaimer','购票、报名等交易与数据由对应第三方平台提供服务。'))}</small></div><div><b data-ve-label="footerJoinTitle">${esc(ipOnlyLabel(c,'footerJoinTitle','参与'))}</b><div class="footer-links">${featureEnabled('booths',c)?`<a href="booths.html"><span data-ve-label="footerBooths">${esc(ipOnlyLabel(c,'footerBooths','摊位与制品'))}</span></a>`:''}${featureEnabled('guests',c)?`<a href="guests.html"><span data-ve-label="footerGuests">${esc(ipOnlyLabel(c,'footerGuests','嘉宾 / 出演'))}</span></a>`:''}${featureEnabled('schedule',c)?`<a href="schedule.html"><span data-ve-label="footerSchedule">${esc(ipOnlyLabel(c,'footerSchedule','舞台日程'))}</span></a>`:''}</div></div><div><b data-ve-label="footerVisitTitle">${esc(ipOnlyLabel(c,'footerVisitTitle','观展'))}</b><div class="footer-links">${featureEnabled('guide',c)?`<a href="guide.html"><span data-ve-label="footerGuide">${esc(ipOnlyLabel(c,'footerGuide','地图 / 交通 / 入场'))}</span></a>`:''}${featureEnabled('faq',c)?`<a href="faq.html"><span data-ve-label="footerFaq">${esc(ipOnlyLabel(c,'footerFaq','FAQ'))}</span></a>`:''}</div></div><div><b data-ve-label="footerSocialTitle">${esc(ipOnlyLabel(c,'footerSocialTitle','社群'))}</b><div class="footer-links"><a href="index.html#community"><span data-ve-label="footerCommunity">${esc(ipOnlyLabel(c,'footerCommunity','QQ群 / 微信群'))}</span></a>${c.community?.link?`<a href="${escAttr(safeUrl(c.community.link))}" target="_blank" rel="noopener"><span data-ve-label="footerSocialLink">${esc(ipOnlyLabel(c,'footerSocialLink',c.community.linkLabel||'活动主页'))}</span></a>`:''}</div></div></div></div></footer>`;}
function footerHtml(c){
  const adapter=templateAdapter(c);if(adapter?.footer)return adapter.footer(c);
  if(['portal-global','event-portal'].includes(c.eventTemplate||''))return `<footer id="footer"><div class="wrap footer-inner"><div><b>OnlyEvent</b><p>大型综合漫展门户模板。活动内容、资讯、观展信息与社群入口集中展示。</p></div><div><b>参与</b><div class="footer-links"><a href="guests.html">嘉宾 / 舞台</a><a href="booths.html">摊位与制品</a></div></div><div><b>观展</b><div class="footer-links"><a href="schedule.html">活动日程</a><a href="guide.html">会场与交通</a><a href="faq.html">常见问题</a></div></div><div><b>社群</b><div class="footer-links"><a href="index.html#community">QQ群</a><a href="index.html#community">微信群</a><a href="index.html#community">B站</a><a href="index.html#community">小红书</a></div></div></div></footer>`;
  const links=previewLinks(c).filter(([h])=>h!=='index.html');const org=c.organizerName?`<b>${esc(c.organizerName)}</b>`:'';const contact=c.organizerContact?`<span>${esc(c.organizerContact)}</span>`:'';const privacy=c.privacyUrl&&safeUrl(c.privacyUrl)!=='#'?`<a href="${escAttr(safeUrl(c.privacyUrl))}" target="_blank" rel="noopener">隐私说明</a>`:'';return `<footer><div class="wrap footer-inner"><div><div>© ${new Date().getFullYear()} ${esc(c.eventName)}.</div><div class="footer-owner">${org}${contact}</div><small class="external-note">购票、报名等外部链接由对应第三方平台提供服务。</small></div><div class="footer-links">${links.map(([h,l])=>`<a href="${h}">${l}</a>`).join('')}${privacy}</div></div></footer>`;}
function ipOnlyMobileNavHtml(c,current){
  if(c.mobileDockEnabled===false)return '';
  const active=current.startsWith('booth-')?'booths.html':current;
  const links=[['index.html','mobileHome','首页','⌂'],featureEnabled('booths',c)?['booths.html','mobileBooths','摊位','▦']:null,featureEnabled('schedule',c)?['schedule.html','mobileSchedule','日程','◷']:null,featureEnabled('guide',c)?['guide.html','mobileGuide','指南','⌖']:null].filter(Boolean);
  return `<nav class="mobile-nav ip-mobile-nav" aria-label="移动端快捷导航" style="grid-template-columns:repeat(${links.length},1fr)">${links.map(([h,k,l,icon])=>`<a href="${h}" class="${active===h?'active':''}"><span>${icon}</span><b data-ve-label="${k}">${esc(ipOnlyLabel(c,k,l))}</b></a>`).join('')}</nav>`;
}
function mobileNavHtml(c,current){
  if(c.mobileDockEnabled===false)return '';
  const adapter=templateAdapter(c);if(adapter?.mobileNav)return adapter.mobileNav(c,current);
  const active=current.startsWith('booth-')?'booths.html':current;
  const links=previewLinks(c).filter(([h])=>h!=='faq.html');
  return `<nav class="mobile-nav" aria-label="移动端导航" style="grid-template-columns:repeat(${Math.max(1,links.length)},1fr)">${links.map(([h,l])=>{const icon=h==='index.html'?'⌂':h==='guests.html'?'☆':h==='booths.html'?'▦':h==='schedule.html'?'◷':h==='guide.html'?'⌖':h==='sponsors.html'?'◇':'•';return `<a href="${h}" class="${active===h?'active':''}"><span>${icon}</span>${l}</a>`}).join('')}</nav>`;
}
function templateCss(c){
  const t=templateFamily(c.eventTemplate||'blank');

  const id=c.eventTemplate||'blank';
  const hybrid=id==='ip-only'?`.template-ip-only{background:var(--bg);overflow-x:hidden}.template-ip-only .site-nav{border-bottom:2px solid var(--ink);box-shadow:0 8px 0 color-mix(in srgb,var(--theme) 16%,transparent)}.template-ip-only .ip-hero{position:relative;min-height:760px;display:flex;align-items:center;overflow:hidden;background:radial-gradient(circle at 82% 27%,color-mix(in srgb,var(--accent) 45%,transparent) 0 17%,transparent 18%),linear-gradient(135deg,var(--bg),#fff 62%)}.template-ip-only .ip-hero-grid{display:grid;grid-template-columns:1fr 1.05fr;gap:30px;align-items:center}.template-ip-only .ip-hero-copy{padding:76px 0}.template-ip-only .ip-hero-copy h1{font-size:clamp(60px,8.6vw,122px);line-height:.84;letter-spacing:-.065em;margin:14px 0 22px;max-width:650px}.template-ip-only .ip-hero-copy p{max-width:560px;font-size:17px;line-height:1.75;color:var(--muted)}.template-ip-only .ip-hero-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.template-ip-only .ip-hero-meta span{border:2px solid var(--ink);background:#fff;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:900}.template-ip-only .ip-primary-cta{display:inline-flex;margin-top:18px;border:2px solid var(--ink);border-radius:999px;padding:11px 16px;background:var(--accent);color:var(--ink);font-weight:950;text-decoration:none;box-shadow:4px 4px 0 var(--ink);transition:.2s}.template-ip-only .ip-primary-cta:hover{transform:translate(-2px,-2px)}.template-ip-only .ip-hero-art{position:relative;min-height:0;aspect-ratio:1/1}.template-ip-only .ip-kv{position:absolute;left:52px;right:0;top:24px;aspect-ratio:1/1;border:3px solid var(--ink);border-radius:32px;background-image:linear-gradient(180deg,transparent,rgba(0,0,0,.18)),var(--ip-kv);background-position:center;background-size:cover;box-shadow:20px 20px 0 var(--ink);overflow:hidden;animation:ipHeroKv calc(.9s * var(--motion-scale)) cubic-bezier(.16,.84,.2,1) both}.template-ip-only .ip-kv-empty{height:100%;display:grid;place-items:center;color:var(--muted);font-weight:900;background:linear-gradient(135deg,color-mix(in srgb,var(--theme) 12%,white),color-mix(in srgb,var(--accent) 14%,white))}.template-ip-only .ip-sticker{position:absolute;z-index:3;border:3px solid var(--ink);border-radius:18px;padding:12px 15px;font-weight:950;box-shadow:7px 7px 0 var(--ink);animation:ipStickerFloat calc(4.5s / max(var(--motion-scale),.25)) ease-in-out infinite}.template-ip-only .ip-sticker-a{right:-8px;top:48px;background:var(--accent);transform:rotate(7deg)}.template-ip-only .ip-sticker-b{left:7px;bottom:78px;background:#59d4ff;transform:rotate(-6deg);animation-delay:-1.8s}.template-ip-only .ip-sticker-c{right:14px;bottom:46px;background:var(--theme);color:#fff;transform:rotate(4deg);animation-delay:-2.7s}@keyframes ipHeroKv{from{opacity:0;transform:translateX(34px) rotate(1deg)}to{opacity:1;transform:none}}@keyframes ipStickerFloat{50%{translate:0 -9px}}.template-ip-only .hero{min-height:84vh;border-bottom:3px solid var(--ink);isolation:isolate;overflow:hidden}.template-ip-only .hero:after{content:"";position:absolute;inset:auto -8% -22% auto;width:36vw;aspect-ratio:1;border:2px solid currentColor;border-radius:50%;opacity:calc(.10 * var(--decor-opacity));pointer-events:none}.template-ip-only .hero .wrap{position:relative;z-index:2}.template-ip-only .hero h1{font-size:clamp(58px,9vw,118px);max-width:860px;text-shadow:0 5px 24px rgba(0,0,0,.28)}.template-ip-only .hero h1,.template-ip-only .tagline,.template-ip-only .meta{animation:ipHeroRise calc(.85s * var(--motion-scale)) cubic-bezier(.16,.84,.2,1) both}.template-ip-only .tagline{animation-delay:calc(.08s * var(--motion-scale))}.template-ip-only .meta{animation-delay:calc(.16s * var(--motion-scale))}@keyframes ipHeroRise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}.template-ip-only .comp-meta-strip{border:2px solid var(--ink);box-shadow:6px 6px 0 var(--accent);transform:translateY(-20px);position:relative;z-index:4}.template-ip-only .ip-module-stack{display:flex;flex-direction:column}.ip-module-shell{position:relative}.ip-module-shell.ve-selected:before{content:'';position:absolute;inset:4px;z-index:80;pointer-events:none;border:2px solid #7b61ff;border-radius:16px}.ip-ribbon{overflow:hidden;border-block:2px solid var(--ink);background:var(--accent)}.template-ip-only .ip-ribbon-track{display:flex;width:max-content;gap:32px;padding:10px 0;font-size:11px;font-weight:950;letter-spacing:.12em;animation:ipRibbon calc(22s / max(var(--motion-scale),.2)) linear infinite}.template-ip-only .ip-ribbon-track span:after{content:"✦";margin-left:32px}@keyframes ipRibbon{to{transform:translateX(-50%)}}.template-ip-only .event-gateway{counter-reset:ipgate}.template-ip-only .event-gateway .card{position:relative;border:2px solid var(--ink);box-shadow:6px 6px 0 color-mix(in srgb,var(--theme) 24%,transparent);overflow:hidden;transition:transform .22s ease,box-shadow .22s ease}.template-ip-only .event-gateway .card:before{counter-increment:ipgate;content:"0" counter(ipgate);position:absolute;right:14px;top:8px;font-size:38px;font-weight:950;opacity:.09}.template-ip-only .event-gateway .card:hover{transform:translate(-3px,-5px) rotate(-.35deg);box-shadow:9px 11px 0 color-mix(in srgb,var(--theme) 28%,transparent)}.template-ip-only .ip-passport{display:grid;grid-template-columns:.76fr 1.24fr;gap:26px;align-items:start}.template-ip-only .ip-passbook{position:sticky;top:96px;border:2px solid var(--ink);border-radius:calc(var(--radius) + 6px);background:linear-gradient(145deg,var(--theme),color-mix(in srgb,var(--theme) 48%,white));color:#fff;padding:24px;box-shadow:10px 10px 0 var(--ink);overflow:hidden}.template-ip-only .ip-passbook:after{content:"ONLY PASSPORT";position:absolute;right:-42px;bottom:36px;rotate:-90deg;font-size:42px;font-weight:950;opacity:calc(.15 * var(--decor-opacity));letter-spacing:-.04em}.template-ip-only .ip-passbook h3{font-size:34px;line-height:.92;margin:10px 0 20px}.template-ip-only .ip-pass-stamps{display:grid;grid-template-columns:repeat(2,88px);gap:12px}.template-ip-only .ip-pass-stamp{height:88px;border:2px dashed #fff;border-radius:50%;display:grid;place-items:center;text-align:center;font-size:10px;font-weight:950;opacity:.34;transform:rotate(-8deg);transition:.35s}.template-ip-only .ip-pass-stamp.hit{opacity:1;background:#fff;color:var(--ink);border-style:solid;animation:ipStamp .38s cubic-bezier(.1,.8,.2,1)}@keyframes ipStamp{0%{scale:1.8;opacity:0}100%{scale:1;opacity:1}}.template-ip-only .ip-zone-list{display:grid}.template-ip-only .ip-zone{display:grid;grid-template-columns:70px 1fr auto;gap:18px;align-items:center;padding:19px 0;border-top:2px solid var(--ink)}.template-ip-only .ip-zone:last-child{border-bottom:2px solid var(--ink)}.template-ip-only .ip-zone-no{font-size:38px;font-weight:950;color:var(--theme);letter-spacing:-.06em}.template-ip-only .ip-zone small{display:block;color:var(--muted);margin-top:3px}.template-ip-only .ticket-types-section{border-block:2px solid var(--ink);background:color-mix(in srgb,var(--bg) 70%,white)}.template-ip-only .ticket-type-card{position:relative;border:2px solid var(--ink);box-shadow:7px 7px 0 color-mix(in srgb,var(--theme) 22%,transparent);overflow:visible}.template-ip-only .ticket-type-card:before,.template-ip-only .ticket-type-card:after{content:"";position:absolute;top:62px;width:22px;height:22px;border:2px solid var(--ink);border-radius:50%;background:color-mix(in srgb,var(--bg) 70%,white)}.template-ip-only .ticket-type-card:before{left:-13px}.template-ip-only .ticket-type-card:after{right:-13px}.template-ip-only .schedule-row{position:relative;border-bottom:2px solid var(--ink);transition:transform .18s ease,background .18s ease}.template-ip-only .schedule-row:hover{transform:translateX(6px);background:color-mix(in srgb,var(--accent) 18%,transparent)}.template-ip-only .guest-card,.template-ip-only .booth-card{border:2px solid var(--ink);box-shadow:6px 6px 0 color-mix(in srgb,var(--accent) 24%,transparent)}.template-ip-only .guest-card:hover,.template-ip-only .booth-card:hover{transform:translate(-3px,-5px) rotate(-.3deg);box-shadow:9px 10px 0 color-mix(in srgb,var(--accent) 28%,transparent)}.template-ip-only .visitor-map-marker{border-color:var(--ink);box-shadow:4px 4px 0 var(--ink);transition:transform .18s ease}.template-ip-only .visitor-map-marker:hover{transform:translate(-50%,-56%) scale(1.06)}.template-ip-only .ip-scroll-dots{position:fixed;right:10px;top:50%;translate:0 -50%;z-index:45;display:grid;gap:7px}.template-ip-only .ip-scroll-dots a{width:9px;height:27px;border:2px solid var(--ink);border-radius:999px;background:#fff;transition:.2s}.template-ip-only .ip-scroll-dots a.active{height:44px;background:var(--theme)}.template-ip-only .mobile-nav{border:2px solid var(--ink);box-shadow:5px 5px 0 var(--ink)}.template-ip-only .mobile-nav a.active{background:var(--theme);color:#fff}.template-ip-only .ip-ticket-gate{position:fixed;inset:0;z-index:999;background:var(--intro-bg,var(--theme));color:var(--intro-ink,var(--ink));display:grid;place-items:center;transition:opacity var(--intro-exit,.62s),visibility var(--intro-exit,.62s)}.template-ip-only .ip-ticket-gate.done{opacity:0;visibility:hidden}.template-ip-only .ip-ticket{width:min(82vw,760px);min-height:320px;border:4px solid var(--intro-ink,var(--ink));border-radius:28px;background:var(--intro-ticket,var(--surface));box-shadow:16px 16px 0 var(--intro-ink,var(--ink));display:grid;grid-template-columns:1fr 1fr;overflow:hidden}.template-ip-only .ip-ticket>div{display:grid;place-items:center;padding:24px;text-align:center}.template-ip-only .ip-ticket>div+div{border-left:2px dashed var(--intro-ink,var(--ink))}.template-ip-only .ip-ticket strong{font-size:clamp(38px,7vw,78px);line-height:.82;letter-spacing:-.055em}.template-ip-only .ip-ticket small{display:block;margin-top:14px;font-weight:900;letter-spacing:.16em}.template-ip-only .ip-ticket-logo{display:block;max-width:150px;max-height:74px;object-fit:contain;margin:0 auto 18px}.template-ip-only .ip-ticket-skip{position:absolute;right:20px;bottom:18px;border:2px solid var(--intro-ink,var(--ink));border-radius:999px;background:var(--intro-ticket,#fff);color:var(--intro-ink,var(--ink));padding:9px 13px;font-weight:900}.template-ip-only.ip-gate-opening .intro-style-ticket .ip-ticket>div:first-child{animation:ipTearL var(--intro-exit,.62s) cubic-bezier(.2,.8,.2,1) both}.template-ip-only.ip-gate-opening .intro-style-ticket .ip-ticket>div:last-child{animation:ipTearR var(--intro-exit,.62s) cubic-bezier(.2,.8,.2,1) both}.template-ip-only.ip-gate-opening .intro-style-fade .ip-ticket{animation:ipGateFade var(--intro-exit,.62s) ease both}.template-ip-only.ip-gate-opening .intro-style-slide .ip-ticket{animation:ipGateSlide var(--intro-exit,.62s) cubic-bezier(.2,.8,.2,1) both}@keyframes ipTearL{to{transform:translateX(-8vw) rotate(-4deg);opacity:0}}@keyframes ipTearR{to{transform:translateX(8vw) rotate(4deg);opacity:0}}@keyframes ipGateFade{to{opacity:0;transform:scale(.94)}}@keyframes ipGateSlide{to{opacity:0;transform:translateY(-14vh) rotate(-1deg)}}.template-ip-only .ip-topbar{height:34px;background:var(--ink);color:#fff;font-size:11px}.template-ip-only .ip-topbar .wrap{height:100%;display:flex;align-items:center;justify-content:space-between}.template-ip-only .ip-top-social{display:flex;gap:14px}.template-ip-only .ip-top-social a{color:#fff;text-decoration:none}.template-ip-only .ip-site-nav{height:80px;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(16px)}.template-ip-only .ip-logo{display:flex;align-items:center;gap:10px;white-space:nowrap}.template-ip-only .ip-logo b{display:inline-grid;place-items:center;width:44px;height:44px;border:2px solid var(--ink);border-radius:14px;background:var(--theme);box-shadow:4px 4px 0 var(--ink);transform:rotate(-4deg);color:#fff}.template-ip-only .ip-logo span{font-weight:950}.template-ip-only .ip-quick{padding:42px 0}.template-ip-only .ip-quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--card-gap)}.template-ip-only .ip-quick-card{min-height:150px;border:2px solid var(--ink);border-radius:var(--radius);background:#fff;padding:18px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:6px 6px 0 color-mix(in srgb,var(--theme) 25%,transparent);text-decoration:none;color:var(--ink);transition:.2s}.template-ip-only .ip-quick-card:hover{transform:translateY(-5px) rotate(-.4deg)}.template-ip-only .ip-quick-card b{font-size:21px}.template-ip-only .ip-section-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:24px}.template-ip-only .ip-section-head h2{font-size:clamp(42px,6vw,76px);line-height:.9;letter-spacing:-.05em;margin:0}.template-ip-only .ip-section-head>a,.template-ip-only .ip-section-head>span{border:2px solid var(--ink);border-radius:999px;background:#fff;padding:8px 12px;font-size:11px;font-weight:950;text-decoration:none;color:var(--ink)}.template-ip-only .ip-specials{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--card-gap)}.template-ip-only .ip-special{position:relative;min-height:250px;border:2px solid var(--ink);border-radius:var(--radius);padding:20px;background:#fff;overflow:hidden}.template-ip-only .ip-special:after{content:"";position:absolute;width:150px;height:150px;border:2px solid var(--ink);border-radius:50%;right:-36px;bottom:-44px;background:color-mix(in srgb,var(--accent) 72%,white);opacity:.8}.template-ip-only .ip-special-stamp{display:inline-grid;place-items:center;min-width:72px;height:64px;padding:0 10px;border:3px solid var(--ink);border-radius:50%;font-size:10px;font-weight:950;transform:rotate(-10deg);background:var(--accent)}.template-ip-only .ip-special h3{font-size:28px;margin:18px 0 8px}.template-ip-only .ip-special p{max-width:75%;color:var(--muted);line-height:1.65}.template-ip-only .ip-project-copy{border:2px solid var(--ink);border-radius:var(--radius);background:#fff;padding:24px;box-shadow:7px 7px 0 color-mix(in srgb,var(--theme) 20%,transparent)}.template-ip-only .ip-booth-layout{display:grid;grid-template-columns:.95fr 1.05fr;gap:28px}.template-ip-only .ip-home-map{position:relative;min-height:440px;border:2px solid var(--ink);border-radius:var(--radius);overflow:hidden;background:linear-gradient(90deg,#e8edf2 1px,transparent 1px),linear-gradient(#e8edf2 1px,transparent 1px),#fff;background-size:38px 38px;line-height:1.2}.template-ip-only .ip-home-map-image{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#fff}.template-ip-only .ip-home-map-marker{position:absolute;transform:translate(-50%,-50%);z-index:2;border:2px solid var(--ink);border-radius:10px;padding:8px 10px;background:var(--theme);color:#fff;box-shadow:4px 4px 0 var(--ink);text-decoration:none;display:flex;gap:7px;align-items:center}.template-ip-only .ip-home-map-marker b{font-size:10px}.template-ip-only .ip-home-map-empty{position:absolute;left:18px;right:18px;bottom:18px;border:2px solid var(--ink);border-radius:14px;padding:14px;background:#fff;box-shadow:6px 6px 0 var(--ink);font-weight:850}.template-ip-only .ip-home-booth-list{display:grid;grid-template-columns:1fr 1fr;gap:12px}.template-ip-only .ip-home-booth{border:2px solid var(--ink);border-radius:14px;padding:16px;background:#fff;text-decoration:none;color:var(--ink);transition:.2s}.template-ip-only .ip-home-booth:hover{transform:translateY(-4px)}.template-ip-only .ip-home-booth b{display:block;font-size:18px;margin:5px 0}.template-ip-only .ip-home-booth span,.template-ip-only .ip-home-booth small{color:var(--muted)}.template-ip-only .ip-inline-cta{margin-top:18px}.template-ip-only .ip-footer{background:var(--ink);color:#fff;padding:52px 0 28px}.template-ip-only .ip-footer-credit{margin-bottom:24px;font-size:11px;font-weight:950;letter-spacing:.18em;color:#918a93}.template-ip-only .ip-footer-grid{display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:26px}.template-ip-only .ip-footer h2{margin-top:0}.template-ip-only .ip-footer p,.template-ip-only .ip-footer small{color:#bdb6bd;line-height:1.7}.template-ip-only .ip-footer .footer-links{display:grid;gap:7px;margin-top:10px}.template-ip-only .ip-footer a{color:#fff;text-decoration:none}@media(max-width:820px){.template-ip-only .ip-hero{min-height:auto;align-items:stretch;padding:0 0 96px;background:radial-gradient(circle at 98% 25%,color-mix(in srgb,var(--accent) 42%,transparent) 0 15%,transparent 16%),linear-gradient(135deg,var(--bg),#fff 66%)}.template-ip-only .ip-hero-grid{grid-template-columns:1fr;gap:26px}.template-ip-only .ip-hero-copy{padding:50px 0 0}.template-ip-only .ip-hero-copy h1{font-size:clamp(46px,13.5vw,68px);line-height:.9;letter-spacing:-.055em;margin:10px 0 16px;max-width:100%;overflow-wrap:anywhere}.template-ip-only .ip-hero-copy p{font-size:15px;line-height:1.65}.template-ip-only .ip-hero-meta{margin-top:18px;gap:8px}.template-ip-only .ip-hero-meta span{padding:8px 11px}.template-ip-only .ip-hero-art{min-height:0;aspect-ratio:3/4;width:calc(100% - 16px);margin:4px auto 0}.template-ip-only .ip-kv{left:0;right:auto;top:0;width:100%;height:100%;aspect-ratio:auto;border-radius:26px;box-shadow:12px 14px 0 var(--ink);background-image:linear-gradient(180deg,transparent,rgba(0,0,0,.16)),var(--ip-kv-mobile);background-position:center}.template-ip-only .ip-sticker{border-width:2px;box-shadow:5px 5px 0 var(--ink);font-size:11px;padding:10px 12px}.template-ip-only .ip-sticker-a{right:-5px;top:18px}.template-ip-only .ip-sticker-b{left:-8px;bottom:74px}.template-ip-only .ip-sticker-c{right:8px;bottom:24px}.template-ip-only .ip-scroll-dots{display:none}.template-ip-only .ip-passport{grid-template-columns:1fr}.template-ip-only .ip-passbook{position:relative;top:auto}.template-ip-only .ip-pass-stamps{grid-template-columns:repeat(4,1fr)}.template-ip-only .hero{min-height:70svh}.template-ip-only .hero h1{font-size:clamp(46px,15vw,72px)}.template-ip-only .event-gateway{grid-template-columns:1fr 1fr}.template-ip-only .ip-ticket{width:min(92vw,600px);min-height:260px}}@media(max-width:560px){.template-ip-only .ip-topbar{display:none}.template-ip-only .ip-site-nav{height:64px}.template-ip-only .ip-logo{gap:8px}.template-ip-only .ip-logo b{width:38px;height:38px;border-radius:12px;box-shadow:3px 3px 0 var(--ink)}.template-ip-only .ip-logo span{max-width:145px;overflow:hidden;text-overflow:ellipsis}.template-ip-only .ip-hero{padding-bottom:88px}.template-ip-only .ip-hero-copy{padding-top:34px}.template-ip-only .ip-hero-copy h1{font-size:clamp(44px,14vw,58px);margin-bottom:14px}.template-ip-only .ip-hero-art{width:calc(100% - 10px);margin-top:0}.template-ip-only .ip-kv{border-radius:22px;box-shadow:9px 11px 0 var(--ink)}.template-ip-only .ip-sticker{font-size:10px;padding:8px 10px;border-radius:14px}.template-ip-only .ip-sticker-a{right:-4px;top:14px}.template-ip-only .ip-sticker-b{left:-6px;bottom:62px}.template-ip-only .ip-sticker-c{right:6px;bottom:18px}.template-ip-only .ip-mobile-nav{left:12px;right:12px;bottom:10px}.template-ip-only .ip-quick-grid,.template-ip-only .ip-specials,.template-ip-only .ip-home-booth-list{grid-template-columns:1fr}.template-ip-only .ip-booth-layout{grid-template-columns:1fr}.template-ip-only .ip-footer-grid{grid-template-columns:1fr 1fr}.template-ip-only .event-gateway{grid-template-columns:1fr}.template-ip-only .ip-zone{grid-template-columns:56px 1fr auto}.template-ip-only .ip-zone-no{font-size:30px}.template-ip-only .ip-pass-stamps{gap:7px}.template-ip-only .ip-pass-stamp{height:auto;aspect-ratio:1}.template-ip-only .ip-ticket{grid-template-columns:1fr}.template-ip-only .ip-ticket>div+div{border-left:0;border-top:2px dashed var(--ink)}}`:id==='doujin-creative'?`.template-doujin-creative .hero{min-height:62vh}.template-doujin-creative .doujin-toolbelt>*,.template-doujin-creative .card{box-shadow:7px 7px 0 color-mix(in srgb,var(--theme) 72%,black)}.template-doujin-creative .section h2{font-family:Georgia,"Noto Serif SC",serif}`:id==='game-immersive'?`.template-game-immersive{background:var(--bg)}.template-game-immersive .hero{min-height:88vh;background-attachment:fixed}.template-game-immersive .hero h1{font-family:"Courier New",monospace;letter-spacing:-.06em}.template-game-immersive .card,.template-game-immersive .comp-side{border:2px solid var(--ink);box-shadow:6px 6px 0 var(--accent)}`:id==='live-stage'?`.template-live-stage .hero{min-height:92vh}.template-live-stage .live-lineup{scroll-snap-type:x proximity}.template-live-stage .guest-card{scroll-snap-align:start}.template-live-stage .live-timeline .schedule-row{font-size:1.02em}`:id==='theme-visual'?`.template-theme-visual .hero{min-height:70vh}.template-theme-visual .small-sheet{margin-top:-42px}.template-theme-visual .small-sheet:before{content:"THEME EVENT";display:block;font-size:10px;font-weight:900;letter-spacing:.18em;color:var(--theme);padding-top:8px}`:'';
  if(['portal-global','event-portal'].includes(c.eventTemplate||''))return `
.template-portal-global,.template-event-portal{--pg-red:#ed1c24;--pg-dark:#0d0d0d;--pg-utility:32px;--pg-nav:82px;background:#fff;color:#111;font-family:Arial,"Noto Sans SC","Microsoft YaHei",sans-serif}
.template-portal-global .announcement{display:none}
.template-portal-global .pg-utility{position:sticky;top:0;z-index:70;background:#161616;color:#bbb;border-bottom:1px solid #2a2a2a;font-size:11px}
.template-portal-global .pg-utility .wrap{height:var(--pg-utility);display:flex;align-items:center;justify-content:flex-end}.template-portal-global .pg-utility-links{display:flex;gap:18px}.template-portal-global .pg-utility a{color:#bbb;text-decoration:none}
.template-portal-global .site-nav{position:sticky;top:var(--pg-utility);z-index:60;height:var(--pg-nav);background:#0d0d0d;color:#fff;border-bottom:1px solid #333;box-shadow:none;backdrop-filter:none}
.template-portal-global .nav-inner{height:100%;gap:24px}.template-portal-global .logo{width:72px;height:50px;margin:0;background:var(--pg-red);color:#fff;display:grid;place-items:center;font-size:0}.template-portal-global .logo:before{content:"OE";font-size:24px;color:#fff;letter-spacing:.03em;margin:0}.template-portal-global .nav-links{flex:1;gap:20px}.template-portal-global .nav-links a{padding:0;background:none!important;color:#fff;font-size:12px;font-weight:900;border-radius:0}.template-portal-global .nav-links a:hover,.template-portal-global .nav-links a.active{color:#fff}.template-portal-global .nav-links a.active:after{display:none}.template-portal-global .ticket-btn{margin-left:auto!important;background:var(--pg-red)!important;border-radius:0!important;padding:13px 16px!important}
.template-portal-global .pg-top-meta{margin-left:auto;display:flex;gap:18px;color:#ddd;font-size:11px;white-space:nowrap}
.template-portal-global .pg-hero{position:relative;min-height:650px;overflow:hidden;background:#111;color:#fff}.template-portal-global .pg-hero-media{position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(0,0,0,.72) 0 34%,rgba(0,0,0,.28) 58%,rgba(0,0,0,.1)),var(--pg-hero);background-position:var(--pg-pos);background-size:cover;background-repeat:no-repeat;animation:pgHeroIn .82s cubic-bezier(.2,.8,.2,1) both}.template-portal-global .pg-hero .wrap{min-height:650px;position:relative;z-index:2;display:flex;align-items:end;padding-bottom:60px}.template-portal-global .pg-hero-copy{max-width:560px;padding:22px 24px 22px 0}.template-portal-global .pg-hero-copy:after{content:"";display:block;width:180px;height:4px;background:var(--pg-red);margin-top:22px}.template-portal-global .pg-hero h1{font-size:clamp(52px,7vw,104px);line-height:1.02;margin:10px 0 18px;font-weight:950;letter-spacing:-.025em}.template-portal-global .pg-hero p{font-size:18px;line-height:1.5;max-width:520px}.template-portal-global .pg-hero-meta{display:flex;gap:18px;margin-top:24px;font-size:13px;font-weight:800}
.template-portal-global .pg-brush{height:22px;background:repeating-linear-gradient(-8deg,#fff 0 12px,#efefef 12px 14px,#fff 14px 26px);transform:translateY(-8px);position:relative;z-index:3}
.template-portal-global .pg-section{padding:70px 0}.template-portal-global .pg-section.alt{background:#f4f4f4}.template-portal-global .pg-title{display:flex;align-items:end;justify-content:space-between;border-bottom:4px solid #111;padding-bottom:12px;margin-bottom:20px}.template-portal-global .pg-title h2{font-size:46px;line-height:1.02;margin:0;font-weight:950}
.template-portal-global .pg-news{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.template-portal-global .pg-news-card{position:relative;min-height:240px;padding:18px;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;color:#fff;background:#222;text-decoration:none;isolation:isolate}.template-portal-global .pg-news-card:before{content:"";position:absolute;inset:0;background:var(--img) center/cover;z-index:-2;transition:transform .35s ease}.template-portal-global .pg-news-card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 20%,rgba(0,0,0,.78));z-index:-1}.template-portal-global .pg-news-card:hover:before{transform:scale(1.05)}.template-portal-global .pg-news-card small{font-weight:900}.template-portal-global .pg-news-card h3{font-size:21px;line-height:1.25;margin:8px 0 0}
.template-portal-global .pg-explore{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.template-portal-global .pg-explore-card{min-height:360px;position:relative;overflow:hidden;background:#111;color:#fff;padding:22px;text-decoration:none;isolation:isolate}.template-portal-global .pg-explore-card:before{content:"";position:absolute;inset:0;background:var(--img) center/cover;z-index:-2;transition:transform .45s ease,filter .45s ease}.template-portal-global .pg-explore-card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 28%,rgba(0,0,0,.84));z-index:-1;transition:background .35s ease}.template-portal-global .pg-explore-card:hover:before{transform:scale(1.04);filter:saturate(1.15)}.template-portal-global .pg-explore-card:hover:after{background:radial-gradient(circle at 70% 30%,rgba(237,28,36,.34),transparent 28%),linear-gradient(180deg,transparent 25%,rgba(0,0,0,.88))}.template-portal-global .pg-explore-card h3{position:absolute;left:22px;bottom:58px;font-size:36px;line-height:1.02;margin:0}.template-portal-global .pg-explore-card span:last-child{position:absolute;left:22px;bottom:20px;font-weight:800}
.template-portal-global .pg-blog-row{display:grid;grid-template-columns:120px 1fr 120px;gap:18px;padding:18px 0;border-bottom:1px solid #aaa;text-decoration:none;color:#111}.template-portal-global .pg-blog-row b{font-size:20px}.template-portal-global .pg-social{background:#111;color:#fff;padding:80px 0}.template-portal-global .pg-social h2{font-size:clamp(54px,8vw,110px);line-height:1.02;margin:0 0 20px;font-weight:950;letter-spacing:-.025em}.template-portal-global .pg-social-links{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.template-portal-global .pg-social-links a{background:#fff;color:#111;padding:13px 18px;font-weight:900;text-decoration:none;border:1px solid #fff}.template-portal-global .pg-social-links a:hover{background:transparent;color:#fff}
.template-portal-global .pg-community{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.template-portal-global .pg-community article{border:1px solid #ccc;padding:20px;min-height:220px}.template-portal-global .pg-community b{font-size:24px}.template-portal-global .pg-community p{color:#555;line-height:1.6}.template-portal-global .pg-qr{margin-top:18px;width:104px;height:104px;border:2px dashed #bbb;display:grid;place-items:center;font-size:11px;color:#777;overflow:hidden}.template-portal-global .pg-qr img{width:100%;height:100%;object-fit:cover}.template-portal-global .pg-sponsors{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}.template-portal-global .pg-sponsor{min-height:86px;border:1px solid #ddd;display:grid;place-items:center;padding:10px}.template-portal-global .pg-sponsor img{max-width:88%;max-height:58px;object-fit:contain}.template-portal-global .pg-backtop{position:fixed;right:18px;bottom:18px;z-index:90;width:46px;height:46px;border:1px solid #222;background:#fff;color:#111;display:grid;place-items:center;font-weight:900;text-decoration:none;box-shadow:0 8px 20px #0002}
.template-portal-global footer{background:#0d0d0d;color:#fff;border:0;padding:58px 0 28px}.template-portal-global .footer-inner{display:grid;grid-template-columns:1.35fr repeat(3,1fr);gap:28px;align-items:start}.template-portal-global .footer-links{display:contents}.template-portal-global .footer-links a{display:block;color:#ddd;text-decoration:none;font-size:12px;margin:8px 0}.template-portal-global footer small{color:#999}
@keyframes pgHeroIn{from{opacity:.35;transform:scale(1.015)}to{opacity:1;transform:none}}
@media(max-width:900px){.template-portal-global{--pg-nav:68px}.template-portal-global .pg-top-meta{display:none}.template-portal-global .nav-links a:not(.ticket-btn){display:none}.template-portal-global .pg-news,.template-portal-global .pg-explore{grid-template-columns:1fr}.template-portal-global .pg-community{grid-template-columns:1fr 1fr}.template-portal-global .pg-sponsors{grid-template-columns:repeat(3,1fr)}.template-portal-global .footer-inner{grid-template-columns:1fr 1fr}.template-portal-global .pg-hero{min-height:620px}.template-portal-global .pg-hero .wrap{min-height:620px;padding-bottom:36px}}
@media(max-width:560px){.template-portal-global .wrap{width:min(100% - 24px,1220px)}.template-portal-global .pg-hero{min-height:560px}.template-portal-global .pg-hero .wrap{min-height:560px}.template-portal-global .pg-hero-media{background-image:linear-gradient(180deg,rgba(0,0,0,.75) 0 58%,rgba(0,0,0,.24) 100%),var(--pg-hero-mobile);background-position:center}.template-portal-global .pg-hero-copy{padding:16px 0}.template-portal-global .pg-hero h1{font-size:clamp(48px,16vw,68px)}.template-portal-global .pg-hero-meta{display:block}.template-portal-global .pg-hero-meta span{display:block;margin-top:6px}.template-portal-global .pg-title{align-items:flex-start;gap:12px}.template-portal-global .pg-title h2{font-size:38px}.template-portal-global .pg-explore-card h3{font-size:30px}.template-portal-global .pg-blog-row{grid-template-columns:1fr}.template-portal-global .pg-community{grid-template-columns:1fr}.template-portal-global .pg-sponsors{grid-template-columns:1fr 1fr}.template-portal-global .footer-inner{grid-template-columns:1fr 1fr}}
`;
  if(t==='comprehensive')return `
.template-comprehensive .hero{min-height:62vh}.template-comprehensive .hero .wrap{padding-bottom:58px}
.template-comprehensive .comp-meta-strip{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--line);border-radius:18px;overflow:hidden;background:#fff;margin-top:-28px;position:relative;z-index:3;box-shadow:0 18px 48px rgba(20,24,36,.08)}
.template-comprehensive .comp-meta-strip>div{padding:18px 20px;border-right:1px solid var(--line)}.template-comprehensive .comp-meta-strip>div:last-child{border-right:0}.template-comprehensive .comp-meta-strip small{display:block;color:var(--muted);font-size:10px;font-weight:900;letter-spacing:.12em}.template-comprehensive .comp-meta-strip b{display:block;margin-top:5px;font-size:16px}
.template-comprehensive .comp-dashboard{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(280px,.65fr);gap:24px;align-items:start}.template-comprehensive .event-gateway{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.template-comprehensive .event-gateway .card:first-child{grid-column:1/-1;min-height:180px}.template-comprehensive .event-gateway .card{min-height:136px;display:flex;flex-direction:column;justify-content:flex-end}.template-comprehensive .comp-side{position:sticky;top:92px;border:1px solid var(--line);border-radius:18px;padding:20px;background:var(--bg)}
${hybrid}
@media(max-width:800px){.template-comprehensive .comp-meta-strip{grid-template-columns:1fr}.template-comprehensive .comp-meta-strip>div{border-right:0;border-bottom:1px solid var(--line)}.template-comprehensive .comp-dashboard{grid-template-columns:1fr}.template-comprehensive .comp-side{position:static}.template-comprehensive .event-gateway{grid-template-columns:1fr}.template-comprehensive .event-gateway .card:first-child{grid-column:auto}}`;
  if(t==='doujin')return `
.template-doujin .hero{min-height:54vh}.template-doujin .hero h1{max-width:760px}.template-doujin .doujin-toolbelt{display:grid;grid-template-columns:1.5fr .75fr .75fr;gap:12px;margin-top:-24px;position:relative;z-index:3}.template-doujin .doujin-toolbelt>a,.template-doujin .doujin-toolbelt>div{border:2px solid var(--ink);border-radius:10px;background:#fff;padding:20px;color:var(--ink);text-decoration:none;box-shadow:6px 6px 0 var(--theme)}.template-doujin .doujin-toolbelt .primary-tool{min-height:170px;display:flex;flex-direction:column;justify-content:flex-end}.template-doujin .doujin-toolbelt small{font-weight:900;letter-spacing:.1em}.template-doujin .doujin-toolbelt strong{display:block;font-size:clamp(26px,4vw,44px);line-height:1;margin-top:8px}.template-doujin .doujin-board{border-top:3px solid var(--ink);padding-top:20px}.template-doujin .booth-grid{grid-template-columns:repeat(3,1fr)}
${hybrid}
@media(max-width:820px){.template-doujin .doujin-toolbelt{grid-template-columns:1fr 1fr}.template-doujin .doujin-toolbelt .primary-tool{grid-column:1/-1}.template-doujin .booth-grid{grid-template-columns:1fr 1fr}}@media(max-width:560px){.template-doujin .doujin-toolbelt,.template-doujin .booth-grid{grid-template-columns:1fr}.template-doujin .doujin-toolbelt .primary-tool{grid-column:auto}}`;
  if(t==='live')return `
.template-live{background:#0f1015;color:#f6f7fb}.template-live .site-nav{background:rgba(15,16,21,.92);border-color:#2c2f39}.template-live .logo,.template-live .nav-links a{color:#f6f7fb}.template-live .hero{min-height:88vh}.template-live .hero h1{font-size:clamp(58px,10vw,124px);max-width:1100px}.template-live .section{background:#0f1015}.template-live .section.alt{background:#171922}.template-live .section h2{color:#fff}.template-live .live-lineup{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(190px,260px);gap:14px;overflow-x:auto;padding-bottom:12px}.template-live .guest-card{background:#171922;border-color:#303440;color:#fff}.template-live .live-timeline{border-left:0;padding-left:0;counter-reset:live}.template-live .live-timeline .schedule-row{counter-increment:live;display:grid;grid-template-columns:64px 110px 1fr auto;gap:14px;align-items:center;border:0;border-top:1px solid #343844;border-radius:0;background:transparent;padding:18px 0;color:#fff}.template-live .live-timeline .schedule-row:before{content:counter(live,decimal-leading-zero);font-size:28px;font-weight:950;color:var(--accent)}.template-live .footer{background:#0b0c10;color:#d8dbe4}.template-live .external-links-section{background:#0f1015}.template-live .external-links-public a{background:#171922;border-color:#303440;color:#fff}
${hybrid}
@media(max-width:650px){.template-live .live-timeline .schedule-row{grid-template-columns:46px 76px 1fr}.template-live .live-timeline .schedule-row small{grid-column:3}}`;
  if(t==='small')return `
.template-small{background:#f4f1ea}.template-small .wrap{width:min(820px,calc(100% - 28px))}.template-small .site-nav{position:relative;background:transparent;border-bottom:0}.template-small .hero{min-height:46vh;border-radius:0 0 28px 28px;margin:0 14px}.template-small .hero .wrap{text-align:center;padding:90px 20px 54px}.template-small .hero h1{margin-left:auto;margin-right:auto}.template-small .meta{justify-content:center}.template-small .small-sheet{margin-top:-18px;position:relative;z-index:3;background:#fff;border:1px solid #ddd8ce;border-radius:22px;padding:10px 28px 28px;box-shadow:0 16px 40px rgba(53,48,39,.08)}.template-small .small-info{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #e7e2d9}.template-small .small-info>div{padding:22px 8px}.template-small .small-info small{display:block;color:var(--muted);font-size:10px;letter-spacing:.12em;font-weight:900}.template-small .small-info b{display:block;margin-top:5px;font-size:18px}.template-small .section{padding:34px 0}.template-small .section.alt{background:transparent}.template-small .schedule-row{border-radius:8px}
${hybrid}
@media(max-width:560px){.template-small .small-info{grid-template-columns:1fr}.template-small .small-info>div+div{border-top:1px solid #e7e2d9}.template-small .small-sheet{padding:8px 18px 22px}}`;
  return `.template-blank .hero{min-height:54vh}`;
}
function ticketTypesHtml(c){const items=(c.ticketTypes||[]).filter(x=>x.published!==false&&(x.name||x.price||x.gift||x.note));if(!items.length)return '';return `<section class="ticket-types-section" id="tickets"><div class="wrap"><div class="ticket-types-head"><div><small class="page-kicker" data-ve-label="ticketsKicker">${esc(ipOnlyLabel(c,'ticketsKicker','TICKETS'))}</small><h2 data-ve-label="ticketsHeading">${esc(ipOnlyLabel(c,'ticketsHeading','票种与特典'))}</h2></div><small data-ve-label="ticketsNote">${esc(ipOnlyLabel(c,'ticketsNote','实际购买跳转第三方售票平台'))}</small></div><div class="ticket-types-grid">${items.map(x=>`<article class="ticket-type-card" data-ve-ticket="${c.ticketTypes.indexOf(x)}" data-ve-object-kind="ticket" data-ve-object-index="${c.ticketTypes.indexOf(x)}"><h3 data-ve-ticket-field="name">${esc(x.name||'票种')}</h3>${x.price?`<div class="ticket-type-price" data-ve-ticket-field="price">${esc(x.price)}</div>`:`<div class="ticket-type-price ip-ve-empty" data-ve-ticket-field="price">点击填写价格</div>`}${x.gift?`<div class="ticket-type-gift" data-ve-ticket-field="gift"><b data-ve-label="ticketGiftLabel">${esc(ipOnlyLabel(c,'ticketGiftLabel','包含 / 特典'))}</b><br>${esc(x.gift)}</div>`:`<div class="ticket-type-gift ip-ve-empty" data-ve-ticket-field="gift">点击填写特典</div>`}${x.note?`<div class="ticket-type-note" data-ve-ticket-field="note">${esc(x.note)}</div>`:''}</article>`).join('')}</div></div></section>`;}
function externalLinksHtml(c){const items=(c.externalLinks||[]).filter(x=>x.label&&validExternalUrl(x.url));if(!items.length)return '';return `<section class="section external-links-section"><div class="wrap"><div class="external-links-public">${items.map(x=>`<a href="${escAttr(x.url)}" target="_blank" rel="noopener noreferrer"><small>${esc(({ticket:'购票',register:'报名',social:'社交平台',map:'地图',link:'外部链接'})[x.kind]||'外部链接')}</small><b>${esc(x.label)}</b><span>↗</span></a>`).join('')}</div></div></section>`;}

function templateMotionCss(c){return `
html{scroll-behavior:smooth}body{opacity:1}.oe-ready{animation:oePageIn .45s ease both}@keyframes oePageIn{from{opacity:.72}to{opacity:1}}
.oe-reveal{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1)}.oe-reveal.oe-in{opacity:1;transform:none}
.template-immersive .hero,.template-game-release .hero{background-attachment:fixed}
.template-live-lineup .guest-card,.template-acg-visual .guest-card,.template-portal-global .card,.template-cn-portal .card{transition:transform .25s ease,box-shadow .25s ease}.template-live-lineup .guest-card:hover,.template-acg-visual .guest-card:hover,.template-portal-global .card:hover,.template-cn-portal .card:hover{transform:translateY(-6px)}
.oe-reveal{transition-duration:calc(.68s * var(--motion-scale,1))!important}.hero,.hero-visual,.hero-media{animation-duration:calc(.82s * var(--motion-scale,1))!important}
@media(prefers-reduced-motion:reduce){body{opacity:1}.oe-reveal{opacity:1;transform:none;transition:none}.template-immersive .hero,.template-game-release .hero{background-attachment:scroll}.ip-ribbon-track{animation:none!important}.ip-ticket-gate{display:none!important}}
`; }
function templateMotionJs(c){
  const id=c.eventTemplate||'blank';
  const safe=['portal-global','event-portal','ip-only'].includes(id)?`document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})});`:'';
  const ip=id==='ip-only'?`
    const gate=document.getElementById('ipTicketGate');
    if(gate){let closed=false;const editor=gate.dataset.editor==='1',exitMs=Math.max(200,Number(gate.dataset.exitMs)||620),holdMs=Math.max(300,Number(gate.dataset.holdMs)||1500);const close=()=>{if(closed)return;closed=true;document.body.classList.add('ip-gate-opening');setTimeout(()=>gate.classList.add('done'),exitMs)};if(editor){gate.querySelector('.ip-ticket-skip')?.addEventListener('click',e=>e.preventDefault());}else{gate.querySelector('.ip-ticket-skip')?.addEventListener('click',close);setTimeout(close,holdMs);}}
    const stampObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const k=e.target.dataset.hit;document.querySelector('.ip-pass-stamp[data-stamp="'+k+'"]')?.classList.add('hit');stampObs.unobserve(e.target)}}),{threshold:.62});document.querySelectorAll('.ip-zone[data-hit]').forEach(x=>stampObs.observe(x));
    const dots=[...document.querySelectorAll('.ip-scroll-dots a')];const secObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)dots.forEach(a=>a.classList.toggle('active',a.dataset.sec===e.target.id))}),{threshold:.34});dots.forEach(a=>{const s=document.getElementById(a.dataset.sec);if(s)secObs.observe(s)});
  `:'';
  return `(function(){document.body.classList.add('oe-ready');${safe}${ip}if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const els=[...document.querySelectorAll('main section,body>section,.card,.guest-card,.booth-card,.activity-card,.sponsor-card,.ip-zone,.ticket-type-card')].filter((x,i)=>i<100);els.forEach(x=>x.classList.add('oe-reveal'));const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('oe-in');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -6% 0px'});els.forEach(x=>io.observe(x));})();`;
}

function ipOnlyElementStyleSelector(key){
  const k=String(key||'');let m;
  if((m=k.match(/^field:([A-Za-z0-9_-]+)$/)))return `[data-ve-key="${m[1]}"]`;
  if((m=k.match(/^module:([A-Za-z0-9_-]+)$/)))return `[data-ve-module="${m[1]}"]`;
  if((m=k.match(/^object:([A-Za-z0-9_-]+):([A-Za-z0-9_:-]+)$/)))return `[data-ve-object-kind="${m[1]}"][data-ve-object-index="${m[2]}"]`;
  return '';
}
function ipOnlyElementStyleCss(c){if((c.eventTemplate||'')!=='ip-only')return '';const map=c.ipOnlyElementStyles||{};let out='';for(const [key,v] of Object.entries(map)){const sel=ipOnlyElementStyleSelector(key);if(!sel||!v)continue;const d=[];if(v.fontSize)d.push(`font-size:${v.fontSize}px!important`);if(v.fontWeight)d.push(`font-weight:${v.fontWeight}!important`);if(v.textAlign)d.push(`text-align:${v.textAlign}!important`);if(v.paddingY)d.push(`padding-top:${v.paddingY}px!important`,`padding-bottom:${v.paddingY}px!important`);if(v.paddingX)d.push(`padding-left:${v.paddingX}px!important`,`padding-right:${v.paddingX}px!important`);if(v.marginTop)d.push(`margin-top:${v.marginTop}px!important`);if(v.marginBottom)d.push(`margin-bottom:${v.marginBottom}px!important`);if(v.width)d.push(`width:${v.width}%!important`);if(v.radius)d.push(`border-radius:${v.radius}px!important`);if(v.letterSpacing)d.push(`letter-spacing:${v.letterSpacing}px!important`);if(d.length)out+=`.template-ip-only ${sel}{${d.join(';')}}`; }return out;}
function htmlShell(c,title,current,body,extraScript=''){const optimized=String(body).replace(/<img(?![^>]*\bloading=)/g,'<img loading="lazy" decoding="async"');const shareTitle=c.seoTitle||title||c.eventName||'OnlyEvent',shareDesc=c.seoDescription||c.eventTagline||'',shareImg=c.shareImage||c.heroImage||'';return `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${esc(shareTitle)}</title><meta name="description" content="${escAttr(shareDesc)}"><meta property="og:title" content="${escAttr(shareTitle)}"><meta property="og:description" content="${escAttr(shareDesc)}">${shareImg?`<meta property="og:image" content="${escAttr(shareImg)}">`:''}<meta name="twitter:card" content="summary_large_image">${c.faviconImage?`<link rel="icon" href="${escAttr(c.faviconImage)}">`:''}<meta name="theme-color" content="${escAttr(c.themeColor)}"><style>${visitorCss(c)}${templateCss(c)}${staticExtraCss()}${templateMotionCss(c)}${ipOnlyElementStyleCss(c)}${safeCustomCss(c.customCss)}</style></head><body class="template-${escAttr(c.eventTemplate||'blank')} ${c.eventTemplate==='event-portal'?'template-portal-global':''} template-${escAttr(templateFamily(c.eventTemplate||'blank'))}">${navHtml(c,current)}${optimized}${(c.eventTemplate||'')==='ip-only'?'':ticketTypesHtml(c)}${externalLinksHtml(c)}${footerHtml(c)}${mobileNavHtml(c,current)}<script>${templateMotionJs(c)}<\/script>${extraScript?`<script>${extraScript}<\/script>`:''}</body></html>`;}
function homeSectionHtml(sec,c,idx){
  const lines=textLines(sec.content),alt=idx%2?' alt':'';
  if(sec.type==='text')return `<section class="section${alt}"><div class="wrap"><h2>${esc(sec.title)}</h2><div class="copy">${lines.map(x=>`<p>${esc(x)}</p>`).join('')}</div></div></section>`;
  if(sec.type==='cards')return `<section class="section${alt}"><div class="wrap"><h2>${esc(sec.title)}</h2><div class="cards">${lines.map(x=>{const[a,b]=x.split('|');return `<div class="card"><h3>${esc(a||'')}</h3><p>${esc(b||'')}</p></div>`}).join('')}</div></div></section>`;
  if(sec.type==='stats')return `<section class="section${alt}"><div class="wrap"><h2>${esc(sec.title)}</h2><div class="stats">${lines.map(x=>{const[a,b]=x.split('|');return `<div class="stat"><strong>${esc(a||'')}</strong><span>${esc(b||'')}</span></div>`}).join('')}</div></div></section>`;
  if(sec.type==='schedule')return `<section class="section${alt}"><div class="wrap"><h2>${esc(sec.title)}</h2><div class="schedule">${lines.map(x=>{const[a,b]=x.split('|');return `<div class="schedule-row"><strong>${esc(a||'')}</strong><span>${esc(b||'')}</span><small>EVENT</small></div>`}).join('')}</div></div></section>`;
  if(sec.type==='image'){const[src,caption]=lines;return `<section class="section image-block${alt}"><div class="wrap"><h2>${esc(sec.title)}</h2>${src?`<img src="${escAttr(src)}" alt="${escAttr(sec.title)}">`:''}${caption?`<div class="image-caption">${esc(caption)}</div>`:''}</div></section>`;}
  if(sec.type==='cta')return `<section class="section cta"><div class="wrap"><h2>${esc(sec.title)}</h2><div class="cta-buttons">${lines.map(x=>{const[a,b]=x.split('|');return `<a href="${escAttr(safeUrl(b))}">${esc(a||'按钮')}</a>`}).join('')}</div></div></section>`;
  return '';
}
function heroBlock(c){const desktop=String(c.heroImage||''),mobile=String(c.heroMobileImage||c.heroImage||'');const style=`--hero-desktop:url('${escAttr(desktop)}');--hero-mobile:url('${escAttr(mobile)}');--hero-desktop-pos:center;`;const meta=[c.eventDate?`<span>${esc(c.eventDate)}</span>`:'',c.eventLocation?`<span>${esc(c.eventLocation)}</span>`:''].join('');return `<header class="hero" style="${style}"><div class="wrap">${c.eventName?`<h1>${esc(c.eventName)}</h1>`:''}${c.eventTagline?`<div class="tagline">${esc(c.eventTagline)}</div>`:''}${meta?`<div class="meta">${meta}</div>`:''}</div></header>`;}
function enabledGateway(c){return [['guests.html','嘉宾','Guests','guests'],['booths.html','摊位 / 社团','Circle & Booths','booths'],['schedule.html','活动日程','Schedule','schedule'],['guide.html','场馆指南','Guide','guide'],['faq.html','常见问题','FAQ','faq'],['sponsors.html','赞助合作','Partners','sponsors']].filter(x=>featureEnabled(x[3],c));}
function guestPlatformLinks(g){return (g.links||[]).filter(l=>l.url).map(l=>`<a class="guest-platform-link" href="${escAttr(safeUrl(l.url))}" target="_blank" rel="noopener">${esc(l.platform||'平台主页')} ↗</a>`).join('');}
function guestWorksHtml(g){const works=(g.works||[]).filter(w=>w.title||w.image);if(!works.length)return'';return `<div class="guest-works"><div class="guest-subhead">代表作品</div><div class="guest-work-grid">${works.map(w=>{const inner=`${w.image?`<img src="${escAttr(w.image)}" alt="${escAttr(w.title||g.name)}">`:`<div class="guest-work-placeholder">WORK</div>`}<div><b>${esc(w.title||'未命名作品')}</b>${w.description?`<p>${esc(w.description)}</p>`:''}</div>`;return w.url?`<a class="guest-work-card" href="${escAttr(safeUrl(w.url))}" target="_blank" rel="noopener">${inner}</a>`:`<article class="guest-work-card">${inner}</article>`}).join('')}</div></div>`;}
function buildGuests(c){const cards=c.guests.length?c.guests.map((g,i)=>`<article class="guest-profile-card" data-ve-object-kind="guest" data-ve-object-index="${i}"><div class="guest-profile-main">${g.image?`<img class="guest-profile-image" data-ve-object-image="guest:${i}:image" src="${escAttr(g.image)}" alt="${escAttr(g.name)}">`:`<div class="guest-placeholder guest-profile-image">GUEST</div>`}<div class="guest-profile-copy"><div class="guest-role" data-ve-object-field="role">${esc(g.role)}</div><h2 data-ve-object-field="name">${esc(g.name)}</h2><p data-ve-object-field="bio">${esc(g.bio)}</p>${guestPlatformLinks(g)?`<div class="guest-platform-links">${guestPlatformLinks(g)}</div>`:''}</div></div>${guestWorksHtml(g)}</article>`).join(''):`<div class="visitor-empty">嘉宾信息准备中，请稍后关注官方更新。</div>`;const body=`<header class="page-hero"><div class="wrap"><div class="page-kicker" data-ve-label="guestsPageKicker">${esc(ipOnlyLabel(c,'guestsPageKicker','Guests'))}</div><h1 data-ve-label="guestsPageTitle">${esc(ipOnlyLabel(c,'guestsPageTitle','嘉宾阵容'))}</h1><p data-ve-label="guestsPageDesc">${esc(ipOnlyLabel(c,'guestsPageDesc','了解嘉宾介绍、代表作品与官方平台主页。'))}</p></div></header><main class="section"><div class="wrap"><div class="guest-profile-list">${cards}</div></div></main>`;return htmlShell(c,`嘉宾阵容 · ${c.eventName}`,'guests.html',body);}
function portalGlobalMedia(c){
  const xs=[c.heroImage,c.pageBannerImage,...(c.guests||[]).map(x=>x.image),...(c.schedule||[]).map(x=>x.image),...(c.booths||[]).flatMap(b=>[b.coverImage,...(b.products||[]).flatMap(p=>p.images||[])])].filter(Boolean);
  const fall=[
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200'
  ];
  return [...xs,...fall];
}
function buildPortalGlobalHome(c){
  const media=portalGlobalMedia(c), hero=c.heroImage||media[0], mobile=c.heroMobileImage||hero, pos='center';
  const art=c.portalGlobalArt||{}, newsImages=Array.isArray(art.newsImages)?art.newsImages:[], exploreImages=Array.isArray(art.exploreImages)?art.exploreImages:[];
  const news=[
    ['现场','舞台与嘉宾节目更新','schedule.html'],['社群','创作者与粉丝活动公开','guests.html'],['公告','票务、入场与现场指南','guide.html'],['展区','摊位与特别企划','booths.html'],['活动','主题舞台与互动内容','schedule.html'],['指南','会场交通与服务信息','guide.html']
  ];
  const explore=[
    ['01','嘉宾阵容','guests.html'],['02','摊位与制品','booths.html'],['03','活动日程','schedule.html'],['04','场馆指南','guide.html'],['05','现场演出','schedule.html'],['06','COSPLAY','guests.html'],['07','签名互动','guests.html'],['08','游戏体验','booths.html'],['09','社群活动','#community'],['10','常见问题','faq.html']
  ];
  const blog=(c.schedule||[]).slice(0,3).map((x,i)=>[x.day||c.eventDate||'',x.title||`活动资讯 ${i+1}`,'schedule.html']);
  while(blog.length<3)blog.push(['', ['活动公告与重要提醒','完整活动内容与多会场信息','官方周边与现场服务'][blog.length], 'guide.html']);
  const community=c.community||{};
  const sponsorItems=(c.sponsors||[]).filter(x=>x.published!==false).slice(0,12);
  const sponsorSlots=Array.from({length:12},(_,i)=>sponsorItems[i]||null);
  const qr=(img,label)=>img?`<div class="pg-qr"><img src="${escAttr(img)}" alt="${escAttr(label)}"></div>`:`<div class="pg-qr">${esc(label)}</div>`;
  const body=`
<section class="pg-hero" id="top" style="--pg-hero:url('${escAttr(hero)}');--pg-hero-mobile:url('${escAttr(mobile)}');--pg-pos:${pos}"><div class="pg-hero-media"></div><div class="wrap"><div class="pg-hero-copy"><small>动画 · 漫画 · 游戏 · 社群</small><h1>${esc(c.eventName||'动漫嘉年华')}</h1>${c.eventTagline?`<p>${esc(c.eventTagline)}</p>`:''}<div class="pg-hero-meta">${c.eventDate?`<span>${esc(c.eventDate)}</span>`:''}${c.eventLocation?`<span>${esc(c.eventLocation)}</span>`:''}</div></div></div></section><div class="pg-brush"></div>
<section class="pg-section" id="news"><div class="wrap"><div class="pg-title"><h2>最新资讯</h2><a href="schedule.html">查看全部 →</a></div><div class="pg-news">${news.map((n,i)=>`<a class="pg-news-card" href="${n[2]}" style="--img:url('${escAttr(newsImages[i]||media[(i+1)%media.length])}')"><small>${n[0]}</small><h3>${n[1]}</h3></a>`).join('')}</div></div></section>
<section class="pg-section alt" id="explore"><div class="wrap"><div class="pg-title"><h2>活动内容</h2><span>现场可以做什么</span></div><div class="pg-explore">${explore.map((x,i)=>`<a class="pg-explore-card" href="${x[2]}" style="--img:url('${escAttr(exploreImages[i]||media[(i+2)%media.length])}')"><small>${x[0]}</small><h3>${x[1]}</h3><span>查看详情 →</span></a>`).join('')}</div></div></section>
<section class="pg-section" id="plan"><div class="wrap"><div class="pg-title"><h2>资讯</h2><a href="schedule.html">全部内容 →</a></div>${blog.map(x=>`<a class="pg-blog-row" href="${x[2]}"><span>${esc(x[0])}</span><b>${esc(x[1])}</b><span>查看 →</span></a>`).join('')}</div></section>
<section class="pg-social"><div class="wrap"><h2>关注<br>活动动态</h2><p>通过 B站、QQ群、微信群获取嘉宾公开、摊位情报和现场通知。</p><div class="pg-social-links"><a href="#community">QQ群</a><a href="#community">微信群</a>${community.link?`<a href="${escAttr(safeUrl(community.link))}" target="_blank" rel="noopener">${esc(community.linkLabel||'活动公告')}</a>`:''}</div></div></section>
<section class="pg-section" id="community"><div class="wrap"><div class="pg-title"><h2>${esc(community.title||'社群交流')}</h2><span>COMMUNITY</span></div><div class="pg-community"><article><b>QQ群</b><p>${esc(community.qqGroup?`群号：${community.qqGroup}`:'加入漫展交流群，查看拼车、约拍、组队与现场情报。')}</p>${qr(community.qqQrImage,'QQ群二维码')}</article><article><b>微信群</b><p>${esc(community.wechatGroup?`群信息：${community.wechatGroup}`:'扫码加入官方活动群，获取临时公告与现场通知。')}</p>${qr(community.wechatQrImage,'微信群二维码')}</article><article><b>B站</b><p>直播、PV、舞台回放与嘉宾视频。</p></article><article><b>小红书</b><p>攻略、返图、摊位推荐与逛展路线。</p></article></div></div></section>
<section class="pg-section"><div class="wrap"><div class="pg-title"><h2>赞助支持</h2><span>SPONSORS</span></div><div class="pg-sponsors">${sponsorSlots.map(s=>`<div class="pg-sponsor">${s?.logo?`<img src="${escAttr(s.logo)}" alt="${escAttr(s.name||'赞助商')}">`:''}</div>`).join('')}</div></div></section>
<a class="pg-backtop" href="#top" aria-label="返回顶部">↑</a>`;
  return htmlShell(c,c.seoTitle||c.eventName||'OnlyEvent','index.html',body);
}
function ipOnlyHeroBlock(c){
  const desktop=String(c.heroImage||''),mobile=String(c.heroMobileImage||c.heroImage||'');
  const img=desktop?`style="--ip-kv:url('${escAttr(desktop)}');--ip-kv-mobile:url('${escAttr(mobile)}')"`:'';
  const ticket=(c.externalLinks||[]).find(x=>x.kind==='ticket'&&validExternalUrl(x.url));
  return `<header class="ip-hero" id="top" data-ve-module="hero" data-ve-module-label="首屏 / KV"><div class="wrap ip-hero-grid"><div class="ip-hero-copy"><small class="page-kicker" data-ve-label="heroKicker">${esc(ipOnlyLabel(c,'heroKicker','IP ONLY / FAN EVENT'))}</small><h1 data-ve-key="eventName">${esc(c.eventName||'ONLY EVENT')}</h1>${c.eventTagline?`<p data-ve-key="eventTagline">${esc(c.eventTagline)}</p>`:`<p data-ve-key="eventTagline" class="ip-ve-empty">点击添加活动简介</p>`}<div class="ip-hero-meta"><span data-ve-key="eventDate" class="${c.eventDate?'':'ip-ve-empty'}">${esc(c.eventDate||'点击填写日期')}</span><span data-ve-key="eventLocation" class="${c.eventLocation?'':'ip-ve-empty'}">${esc(c.eventLocation||'点击填写地点')}</span></div>${ticket?`<a class="ip-primary-cta" href="${escAttr(ticket.url)}" target="_blank" rel="noopener noreferrer"><span data-ve-label="heroTicketCta">${esc(ipOnlyLabel(c,'heroTicketCta','前往购票平台 ↗'))}</span></a>`:''}</div><div class="ip-hero-art" data-ve-image-responsive="hero" title="点击更换主视觉（桌面/手机分别保存）" ${img}><div class="ip-kv">${desktop?'':`<div class="ip-kv-empty">点击上传桌面主视觉 KV</div>`}</div><div class="ip-sticker ip-sticker-a" data-ve-label="stickerA">${esc(ipOnlyLabel(c,'stickerA','限定企划 ✦'))}</div>${featureEnabled('booths',c)?`<div class="ip-sticker ip-sticker-b" data-ve-label="stickerB">${esc(ipOnlyLabel(c,'stickerB',`${publishedBooths(c).length||'摊位'} 社团`))}</div>`:''}${featureEnabled('schedule',c)?`<div class="ip-sticker ip-sticker-c" data-ve-label="stickerC">${esc(ipOnlyLabel(c,'stickerC','TIME TABLE'))}</div>`:''}</div></div></header>`;
}
function ipOnlyProjectsHtml(c){
  const secs=(c.homeSections||[]).filter(x=>x&&x.title);
  if(!secs.length)return '';
  const rendered=secs.map((sec,si)=>{
    const lines=textLines(sec.content);
    if(sec.type==='cards'){
      const cards=lines.map((x,i)=>{const[a,b]=x.split('|');return `<article class="ip-special" data-ve-object-kind="project-card" data-ve-object-index="${si}:${i}"><span class="ip-special-stamp">PROJECT ${String(i+1).padStart(2,'0')}</span><h3 data-ve-object-field="title">${esc(a||sec.title)}</h3>${b?`<p data-ve-object-field="desc">${esc(b)}</p>`:`<p data-ve-object-field="desc" class="ip-ve-empty">点击添加说明</p>`}</article>`}).join('');
      return cards?`<section class="section ip-project-section" data-ve-home-section="${si}"><div class="wrap"><div class="ip-section-head"><div><small class="page-kicker" data-ve-label="projectsKicker">${esc(ipOnlyLabel(c,'projectsKicker','SPECIAL PROJECTS'))}</small><h2 data-ve-home-title="${si}">${esc(sec.title)}</h2></div><span>SECTION ${String(si+1).padStart(2,'0')}</span></div><div class="ip-specials">${cards}</div></div></section>`:'';
    }
    if(sec.type==='text'){
      return lines.length?`<section class="section ip-project-section" data-ve-home-section="${si}"><div class="wrap"><div class="ip-section-head"><div><small class="page-kicker" data-ve-label="projectKicker">${esc(ipOnlyLabel(c,'projectKicker','SPECIAL PROJECT'))}</small><h2 data-ve-home-title="${si}">${esc(sec.title)}</h2></div><span>SECTION ${String(si+1).padStart(2,'0')}</span></div><div class="ip-project-copy">${lines.map(x=>`<p>${esc(x)}</p>`).join('')}</div></div></section>`:'';
    }
    return homeSectionHtml(sec,c,si);
  }).join('');
  return `<div id="projects">${rendered}</div>`;
}
function ipOnlyBoothMapHtml(c){
  if(!featureEnabled('booths',c))return '';
  const pub=publishedBooths(c), mapped=pub.filter(({b})=>boothHasMapPoint(b));
  const mapMedia=c.mapImage?`<img class="ip-home-map-image" data-ve-image="mapImage" src="${escAttr(c.mapImage)}" alt="场馆地图">`:'';
  const markers=mapped.slice(0,18).map(({b,i})=>`<a class="ip-home-map-marker" data-ve-map-marker="1" data-ve-object-kind="booth" data-ve-object-index="${i}" href="${boothPageName(i)}" style="left:${clampPct(b.mapX)}%;top:${clampPct(b.mapY)}%"><span data-ve-object-field="code">${esc(b.code)}</span><b data-ve-object-field="name">${esc(b.name)}</b></a>`).join('');
  const list=pub.slice(0,4).map(({b,i})=>`<a class="ip-home-booth" data-ve-object-kind="booth" data-ve-object-index="${i}" href="${boothPageName(i)}"><small data-ve-object-field="code">${esc(b.code)}</small><b data-ve-object-field="name">${esc(b.name)}</b><span data-ve-object-field="category">${esc(b.category||'')}</span></a>`).join('');
  return `<section class="section alt" id="booths-home" data-ve-feature="booths"><div class="wrap"><div class="ip-section-head"><div><small class="page-kicker" data-ve-label="boothKicker">${esc(ipOnlyLabel(c,'boothKicker','BOOTH / MAP'))}</small><h2 data-ve-label="boothHeading">${esc(ipOnlyLabel(c,'boothHeading','摊位与场地图'))}</h2></div><a href="booths.html"><span data-ve-label="boothViewAll">${esc(ipOnlyLabel(c,'boothViewAll','查看全部 →'))}</span></a></div><div class="ip-booth-layout"><div class="ip-home-map ${c.mapImage?'has-image':''}">${mapMedia}${markers}${!c.mapImage?'<div class="ip-home-map-empty">上传场地图后可在这里显示可点击摊位点位</div>':''}</div><div><div class="ip-home-booth-list">${list||'<div class="visitor-empty">摊位信息准备中。</div>'}</div><a class="ip-primary-cta ip-inline-cta" href="booths.html"><span data-ve-label="boothQuickCta">${esc(ipOnlyLabel(c,'boothQuickCta','快速查摊位 →'))}</span></a></div></div></div></section>`;
}
function ipOnlyPreviewScaffold(c,kind){
  if(!c.__cmsPreview)return '';
  const add=(type,title,desc)=>`<button type="button" class="ip-ve-create-card" data-ve-create="${type}"><b>${esc(title)}</b><span>${esc(desc)}</span><em>＋ 点击添加</em></button>`;
  if(kind==='tickets')return `<section class="ticket-types-section ip-preview-scaffold" id="tickets"><div class="wrap"><div class="ticket-types-head"><div><small class="page-kicker" data-ve-label="ticketsKicker">${esc(ipOnlyLabel(c,'ticketsKicker','TICKETS'))}</small><h2 data-ve-label="ticketsHeading">${esc(ipOnlyLabel(c,'ticketsHeading','票种与特典'))}</h2></div><small data-ve-label="ticketsNote">${esc(ipOnlyLabel(c,'ticketsNote','实际购买跳转第三方售票平台'))}</small></div>${add('ticket','添加第一个票种','填写票名、价格和特典后，这里立即变成真实票种卡片。')}</div></section>`;
  if(kind==='projects')return `<div id="projects"><section class="section ip-project-section ip-preview-scaffold"><div class="wrap"><div class="ip-section-head"><div><small class="page-kicker" data-ve-label="projectsKicker">${esc(ipOnlyLabel(c,'projectsKicker','SPECIAL PROJECTS'))}</small><h2 data-ve-label="projectsHeading">${esc(ipOnlyLabel(c,'projectsHeading','本届特别企划'))}</h2></div><span data-ve-label="projectsSectionLabel">${esc(ipOnlyLabel(c,'projectsSectionLabel','SECTION 01'))}</span></div>${add('project','添加第一个特别企划','用真实标题与内容替代占位卡片。')}</div></section></div>`;
  if(kind==='guests')return `<section class="section alt ip-preview-scaffold" id="guests-home"><div class="wrap"><div class="ip-section-head"><div><small class="page-kicker" data-ve-label="guestKicker">${esc(ipOnlyLabel(c,'guestKicker','GUEST'))}</small><h2 data-ve-label="guestHeading">${esc(ipOnlyLabel(c,'guestHeading','嘉宾 / 出演'))}</h2></div></div>${add('guest','添加第一位嘉宾','姓名、身份和图片都可直接继续编辑。')}</div></section>`;
  if(kind==='booths')return `<section class="section alt ip-preview-scaffold" id="booths-home"><div class="wrap"><div class="ip-section-head"><div><small class="page-kicker" data-ve-label="boothKicker">${esc(ipOnlyLabel(c,'boothKicker','BOOTH / MAP'))}</small><h2 data-ve-label="boothHeading">${esc(ipOnlyLabel(c,'boothHeading','摊位与场地图'))}</h2></div></div>${add('booth','添加第一个摊位','添加社团后可继续编辑摊位号、分类、制品与地图点位。')}</div></section>`;
  if(kind==='schedule')return `<section class="section ip-preview-scaffold" id="schedule-home"><div class="wrap"><div class="ip-section-head"><div><small class="page-kicker" data-ve-label="scheduleKicker">${esc(ipOnlyLabel(c,'scheduleKicker','TIME TABLE'))}</small><h2 data-ve-label="scheduleHeading">${esc(ipOnlyLabel(c,'scheduleHeading','舞台 / 当天日程'))}</h2></div><span data-ve-label="schedulePreviewLabel">${esc(ipOnlyLabel(c,'schedulePreviewLabel','PREVIEW'))}</span></div>${add('schedule','添加第一条日程','填写时间、节目和舞台后立即展示真实日程。')}</div></section>`;
  if(kind==='community')return `<section class="section community-section ip-preview-scaffold"><div class="wrap">${add('community','添加社群信息','填写 QQ 群、微信群说明、二维码或报名链接。')}</div></section>`;
  if(kind==='sponsors')return `<section class="section alt home-sponsors ip-preview-scaffold"><div class="wrap">${add('sponsor','添加第一个合作方','上传 Logo、填写合作方名称后再发布。')}</div></section>`;
  return '';
}

const IP_ONLY_MODULE_LABELS={hero:'首屏 / KV',tickets:'票种与特典',projects:'特别企划',guests:'嘉宾 / 出演',passport:'活动护照',booths:'摊位与场地图',schedule:'舞台 / 当天日程',community:'社群',sponsors:'赞助支持'};
function ipOnlyModuleOrder(c,key){const a=Array.isArray(c.ipOnlyModuleOrder)?c.ipOnlyModuleOrder:[];const i=a.indexOf(key);return i<0?99:i;}
function ipOnlyModuleHidden(c,key){return Array.isArray(c.ipOnlyHiddenModules)&&c.ipOnlyHiddenModules.includes(key);}
function ipOnlyModuleWrap(c,key,html){if(!html||ipOnlyModuleHidden(c,key))return '';return `<div class="ip-module-shell" data-ve-module="${key}" data-ve-module-label="${escAttr(IP_ONLY_MODULE_LABELS[key]||key)}" style="order:${ipOnlyModuleOrder(c,key)}">${html}</div>`;}
function buildIpOnlyHome(c){
  const hero=ipOnlyHeroBlock(c);
  const quick=[
    featureEnabled('booths',c)?['booths.html','quickBoothsTitle','摊位与制品','quickBoothsSub','快速查摊位 →']:null,
    featureEnabled('schedule',c)?['schedule.html','quickScheduleTitle','舞台日程','quickScheduleSub','查看节目 →']:null,
    featureEnabled('guests',c)?['guests.html','quickGuestsTitle','嘉宾 / 出演','quickGuestsSub','查看嘉宾 →']:null,
    featureEnabled('guide',c)?['guide.html','quickGuideTitle','场地图 / 指南','quickGuideSub','交通与入场 →']:null,
    featureEnabled('faq',c)?['faq.html','quickFaqTitle','常见问题','quickFaqSub','查看 FAQ →']:null
  ].filter(Boolean).slice(0,4);
  const ribbon=[featureEnabled('booths',c)?['ribbonBooths','摊位 / 制品']:null,featureEnabled('schedule',c)?['ribbonSchedule','舞台 / 日程']:null,featureEnabled('guests',c)?['ribbonGuests','嘉宾 / 出演']:null,featureEnabled('guide',c)?['ribbonGuide','场地图 / 指南']:null,(c.ticketTypes||[]).some(x=>x.published!==false)?['ribbonTickets','票种 / 特典']:null].filter(Boolean);
  const zoneDefs=[
    featureEnabled('booths',c)?['01','同人摊位街区','社团 / 制品 / 收藏 / 快速查摊位','A']:null,
    featureEnabled('schedule',c)?['02','舞台与互动节目','时间表 / 出演 / TALK / 抽选','B']:null,
    featureEnabled('guide',c)?['03','场地图与观展指南','地图 / 交通 / 入场说明','C']:null,
    (c.homeSections||[]).length?['04','限定企划','集章 / 应援 / 合影 / 主题内容','D']:null
  ].filter(Boolean);
  const introTitle=String(c.introLeftTitle||c.eventName||'ONLY EVENT').slice(0,30),introRight=String(c.introRightTitle||'ONLY\nEVENT').slice(0,40),introStyle=['ticket','fade','slide'].includes(c.introAnimationStyle)?c.introAnimationStyle:'ticket';
  const gate=((c.__cmsPreview&&!c.__forceIntroPreview&&!c.__introEditor)||c.introAnimationEnabled===false)?'':`<div class="ip-ticket-gate intro-style-${introStyle}" id="ipTicketGate" data-editor="${c.__introEditor&&!c.__forceIntroPreview?'1':'0'}" data-hold-ms="${Math.max(300,Number(c.introHoldMs)||1500)}" data-exit-ms="${Math.max(200,Number(c.introExitMs)||620)}" style="--intro-bg:${escAttr(c.introBackgroundColor||c.themeColor||'#ff5f91')};--intro-ticket:${escAttr(c.introTicketColor||'#ffffff')};--intro-ink:${escAttr(c.introInkColor||'#17151b')};--intro-exit:${Math.max(200,Number(c.introExitMs)||620)}ms"><div class="ip-ticket"><div><div>${c.introLogoImage?`<img class="ip-ticket-logo" src="${escAttr(c.introLogoImage)}" alt="">`:''}<strong>${esc(introTitle)}</strong><small>${esc(c.introLeftLabel||'ADMIT ONE')}</small></div></div><div><div><strong>${introRight.split('\n').map(esc).join('<br>')}</strong><small>${esc(c.introRightLabel||c.eventDate||'WELCOME')}</small></div></div></div><button class="ip-ticket-skip" type="button">${esc(c.introButtonLabel||'进入活动官网 →')}</button></div>`;
  let body=gate+hero;
  if(ribbon.length)body+=`<div class="ip-ribbon"><div class="ip-ribbon-track">${[...ribbon,...ribbon].map(x=>`<span data-ve-label="${x[0]}">${esc(ipOnlyLabel(c,x[0],x[1]))}</span>`).join('')}</div></div>`;
  if(quick.length)body+=`<section class="ip-quick"><div class="wrap ip-quick-grid">${quick.map((x,i)=>`<a class="ip-quick-card" href="${x[0]}"><span>${String(i+1).padStart(2,'0')}</span><b data-ve-label="${x[1]}">${esc(ipOnlyLabel(c,x[1],x[2]))}</b><small data-ve-label="${x[3]}">${esc(ipOnlyLabel(c,x[3],x[4]))}</small></a>`).join('')}</div></section>`;
  body+='<main class="ip-module-stack">';
  if((c.ticketTypes||[]).some(x=>x.published!==false&&(x.name||x.price||x.gift||x.note)))body+=ipOnlyModuleWrap(c,'tickets',ticketTypesHtml(c));else body+=ipOnlyModuleWrap(c,'tickets',ipOnlyPreviewScaffold(c,'tickets'));
  body+=ipOnlyModuleWrap(c,'projects',ipOnlyProjectsHtml(c)||ipOnlyPreviewScaffold(c,'projects'));
  if(c.guests?.length&&featureEnabled('guests',c))body+=ipOnlyModuleWrap(c,'guests',`<section class="section alt" id="guests-home"><div class="wrap"><div class="ip-section-head"><div><small class="page-kicker" data-ve-label="guestKicker">${esc(ipOnlyLabel(c,'guestKicker','GUEST'))}</small><h2 data-ve-label="guestHeading">${esc(ipOnlyLabel(c,'guestHeading','嘉宾 / 出演'))}</h2></div><a href="guests.html"><span data-ve-label="guestViewAll">${esc(ipOnlyLabel(c,'guestViewAll','查看全部 →'))}</span></a></div><div class="guest-grid">${c.guests.slice(0,6).map((g,i)=>`<article class="guest-card" data-ve-object-kind="guest" data-ve-object-index="${i}">${g.image?`<img data-ve-object-image="guest:${i}:image" src="${escAttr(g.image)}" alt="${escAttr(g.name)}">`:`<div class="guest-placeholder">GUEST</div>`}<div class="guest-body"><div class="guest-role" data-ve-object-field="role">${esc(g.role||'')}</div><h3 data-ve-object-field="name">${esc(g.name)}</h3></div></article>`).join('')}</div></div></section>`);
  else if(featureEnabled('guests',c))body+=ipOnlyModuleWrap(c,'guests',ipOnlyPreviewScaffold(c,'guests'));
  if(zoneDefs.length)body+=ipOnlyModuleWrap(c,'passport',`<section class="section" id="passport"><div class="wrap"><div class="ip-section-head"><div><small class="page-kicker" data-ve-label="passportKicker">${esc(ipOnlyLabel(c,'passportKicker','ONLY PASSPORT'))}</small><h2 data-ve-label="passportHeading">${esc(ipOnlyLabel(c,'passportHeading','活动护照'))}</h2></div><span data-ve-label="passportGuideLabel">${esc(ipOnlyLabel(c,'passportGuideLabel','EVENT GUIDE'))}</span></div><div class="ip-passport"><aside class="ip-passbook"><small data-ve-label="passportBookLabel">${esc(ipOnlyLabel(c,'passportBookLabel','EVENT GUIDE'))}</small><h3><span data-ve-key="eventName">${esc(c.eventName||'ONLY EVENT')}</span><br><span data-ve-label="passportStampTitle">${esc(ipOnlyLabel(c,'passportStampTitle','STAMP RALLY'))}</span></h3><div class="ip-pass-stamps">${zoneDefs.map((z,i)=>`<div class="ip-pass-stamp" data-stamp="${z[3]}"><span data-ve-label="passportStamp${i}">${esc(ipOnlyLabel(c,`passportStamp${i}`,z[0]+' '+z[1].split('与')[0].slice(0,5)))}</span></div>`).join('')}</div></aside><div class="ip-zone-list">${zoneDefs.map((z,i)=>`<div class="ip-zone" data-hit="${z[3]}"><span class="ip-zone-no" data-ve-label="passportZone${i}No">${esc(ipOnlyLabel(c,`passportZone${i}No`,z[0]))}</span><div><b data-ve-label="passportZone${i}Title">${esc(ipOnlyLabel(c,`passportZone${i}Title`,z[1]))}</b><small data-ve-label="passportZone${i}Desc">${esc(ipOnlyLabel(c,`passportZone${i}Desc`,z[2]))}</small></div><span>→</span></div>`).join('')}</div></div></div></section>`);
  {const hasBooths=publishedBooths(c).length||c.mapImage;body+=ipOnlyModuleWrap(c,'booths',hasBooths?ipOnlyBoothMapHtml(c):ipOnlyPreviewScaffold(c,'booths'));}
  if(c.schedule?.length&&featureEnabled('schedule',c))body+=ipOnlyModuleWrap(c,'schedule',`<section class="section" id="schedule-home" data-ve-feature="schedule"><div class="wrap"><div class="ip-section-head"><div><small class="page-kicker" data-ve-label="scheduleKicker">${esc(ipOnlyLabel(c,'scheduleKicker','TIME TABLE'))}</small><h2 data-ve-label="scheduleHeading">${esc(ipOnlyLabel(c,'scheduleHeading','舞台 / 当天日程'))}</h2></div><a href="schedule.html"><span data-ve-label="scheduleViewAll">${esc(ipOnlyLabel(c,'scheduleViewAll','完整日程 →'))}</span></a></div><div class="schedule">${c.schedule.slice(0,8).map((x,i)=>`<div class="schedule-row" data-ve-schedule="${i}" data-ve-object-kind="schedule" data-ve-object-index="${i}"><strong data-ve-schedule-field="time">${esc(x.time||'')}</strong><span data-ve-schedule-field="title">${esc(x.title||'')}</span><small data-ve-schedule-field="stage">${esc(x.stage||x.type||'EVENT')}</small></div>`).join('')}</div></div></section>`);else if(featureEnabled('schedule',c))body+=ipOnlyModuleWrap(c,'schedule',ipOnlyPreviewScaffold(c,'schedule'));
  body+=ipOnlyModuleWrap(c,'community',homeCommunityHtml(c)||ipOnlyPreviewScaffold(c,'community'))+ipOnlyModuleWrap(c,'sponsors',homeSponsorsHtml(c)||ipOnlyPreviewScaffold(c,'sponsors'));body+='</main>';
  const dots=[['top','TOP'],(c.ticketTypes||[]).length?['tickets','TICKETS']:null,(c.homeSections||[]).length?['projects','PROJECTS']:null,zoneDefs.length?['passport','PASSPORT']:null,featureEnabled('booths',c)?['booths-home','BOOTHS']:null,c.schedule?.length&&featureEnabled('schedule',c)?['schedule-home','SCHEDULE']:null].filter(Boolean);
  if(c.decorationsEnabled!==false)body+=`<nav class="ip-scroll-dots" aria-label="章节进度">${dots.map((d,i)=>`<a href="#${d[0]}" data-sec="${d[0]}" class="${i===0?'active':''}" title="${d[1]}"></a>`).join('')}</nav>`;
  return htmlShell(c,c.seoTitle||c.eventName||'IP ONLY','index.html',body);
}
function buildHome(c){
  const adapter=templateAdapter(c);if(adapter?.buildHome)return adapter.buildHome(c);
  if(['portal-global','event-portal'].includes(c.eventTemplate||''))return buildPortalGlobalHome(c);
  const kind=templateFamily(c.eventTemplate||'blank'),hero=heroBlock(c),custom=c.homeSections.map((x,i)=>homeSectionHtml(x,c,i)).join('');
  let body=hero;
  if(kind==='comprehensive'){
    const meta=[['DATE',c.eventDate],['VENUE',c.eventLocation],['INFO',c.announcement]].filter(x=>x[1]);
    if(meta.length)body+=`<div class="wrap"><div class="comp-meta-strip">${meta.map(([k,v])=>`<div><small>${k}</small><b>${esc(v)}</b></div>`).join('')}</div></div>`;
    const gateways=enabledGateway(c);
    body+=`<section class="section"><div class="wrap comp-dashboard"><div>${gateways.length?`<div class="event-gateway">${gateways.map(([h,z,e])=>`<a class="card" href="${h}"><small>${e}</small><h3>${z}</h3><span>查看内容 →</span></a>`).join('')}</div>`:''}</div><aside class="comp-side"><small class="page-kicker">TODAY</small><h2>活动信息</h2>${featureEnabled('schedule',c)&&c.schedule.length?`<div class="schedule">${c.schedule.slice(0,4).map(x=>`<div class="schedule-row"><strong>${esc(x.time||'')}</strong><span>${esc(x.title||'')}</span><small>${esc(x.stage||'')}</small></div>`).join('')}</div><div class="cta-buttons"><a href="schedule.html">完整日程</a></div>`:`<p class="copy">${esc(c.eventTagline||c.eventLocation||c.eventDate||'')}</p>`}</aside></div></section>`;
  } else if(kind==='doujin'){
    const boothCount=publishedBooths(c).length,productCount=publishedBooths(c).reduce((n,{b})=>n+(b.products||[]).filter(p=>p.published!==false).length,0);
    body+=`<div class="wrap"><div class="doujin-toolbelt"><a class="primary-tool" href="booths.html"><small>CIRCLE / BOOTH</small><strong>查找摊位与制品</strong><span>按摊位号、社团或制品浏览 →</span></a><div><small>BOOTHS</small><strong>${boothCount}</strong><span>公开摊位</span></div><div><small>ITEMS</small><strong>${productCount}</strong><span>公开制品</span></div></div></div>`;
    const pub=publishedBooths(c).slice(0,6);if(pub.length)body+=`<section class="section"><div class="wrap doujin-board"><div class="product-section-head"><div><small class="page-kicker">CIRCLE LIST</small><h2>摊位一览</h2></div><a class="jump-products" href="booths.html">查看全部 →</a></div><div class="booth-grid">${pub.map(({b,i})=>boothCard(b,i)).join('')}</div></div></section>`;
    if(featureEnabled('guide',c))body+=`<section class="section alt"><div class="wrap"><a class="card" href="guide.html"><small>FLOOR MAP</small><h2>场地图与入场指南</h2><span>查看位置与会场信息 →</span></a></div></section>`;
  } else if(kind==='live'){
    if(featureEnabled('guests',c))body+=`<section class="section"><div class="wrap"><small class="page-kicker">LINE UP</small><h2>出演阵容</h2>${c.guests.length?`<div class="live-lineup">${c.guests.slice(0,12).map(g=>`<article class="guest-card">${g.image?`<img src="${escAttr(g.image)}" alt="${escAttr(g.name)}">`:''}<div class="guest-body"><h3>${esc(g.name)}</h3><p>${esc(g.role||'')}</p></div></article>`).join('')}</div>`:`<div class="visitor-empty">出演信息尚未填写。</div>`}</div></section>`;
    if(featureEnabled('schedule',c))body+=`<section class="section alt"><div class="wrap"><small class="page-kicker">TIME TABLE</small><h2>节目时间</h2>${c.schedule.length?`<div class="live-timeline schedule">${c.schedule.map(x=>`<div class="schedule-row"><strong>${esc(x.time||'')}</strong><span>${esc(x.title||'')}</span><small>${esc(x.stage||'')}</small></div>`).join('')}</div>`:`<div class="visitor-empty">日程尚未填写。</div>`}</div></section>`;
  } else if(kind==='small'){
    const info=`<div><small>DATE</small><b>${esc(c.eventDate||'—')}</b></div><div><small>VENUE</small><b>${esc(c.eventLocation||'—')}</b></div>`;
    body+=`<div class="wrap"><div class="small-sheet"><div class="small-info">${info}</div>${c.eventTagline?`<section class="section"><h2>活动介绍</h2><div class="copy"><p>${esc(c.eventTagline)}</p></div></section>`:''}${featureEnabled('schedule',c)?`<section class="section"><h2>活动日程</h2>${c.schedule.length?`<div class="schedule">${c.schedule.map(x=>`<div class="schedule-row"><strong>${esc(x.time||'')}</strong><span>${esc(x.title||'')}</span></div>`).join('')}</div>`:`<div class="visitor-empty">日程尚未填写。</div>`}</section>`:''}</div></div>`;
  }
  body+=custom+homeCommunityHtml(c)+homeSponsorsHtml(c);
  return htmlShell(c,c.seoTitle||c.eventName||'OnlyEvent','index.html',body);
}
function boothSearchText(b){return [b.code,b.name,b.category,b.tags,b.note,b.description,b.contact,b.social,...(b.products||[]).flatMap(p=>[p.name,p.category,p.description,p.availability,p.price])].join(' ').toLowerCase();}
function boothFilterCategories(b){
  return [...new Set([b.category,...(b.products||[]).filter(p=>p.published!==false).flatMap(p=>[p.category])].filter(Boolean))];
}
function boothProductPreview(b){
  const ps=(b.products||[]).filter(p=>p.published!==false).slice(0,3);
  if(!ps.length)return '';
  const total=(b.products||[]).filter(p=>p.published!==false).length;
  return `<div class="booth-product-preview"><div class="booth-product-preview-head"><span>本摊制品</span><small>${total} 件</small></div><div class="booth-product-preview-list">${ps.map(p=>`<div class="booth-product-chip">${p.images?.[0]?`<img src="${escAttr(p.images[0])}" alt="${escAttr(p.name)}">`:`<span class="mini-no-image">ITEM</span>`}<b>${esc(p.name)}</b></div>`).join('')}</div></div>`;
}
function boothLogoMarkup(b,cls='booth-logo-image'){
  return b.coverImage?`<img class="${cls}" src="${escAttr(b.coverImage)}" alt="${escAttr(b.name)} 社团 Logo">`:`<div class="${cls} booth-logo-placeholder">${esc((b.name||'?').slice(0,2))}</div>`;
}
function boothCard(b,i){
  const cats=boothFilterCategories(b).join('|');
  return `<article class="booth-card" data-id="${escAttr(b.id)}" data-text="${escAttr(boothSearchText(b))}" data-categories="${escAttr(cats)}"><div class="booth-card-head"><a class="booth-logo-link" href="${boothPageName(i)}" aria-label="查看 ${escAttr(b.name)}"><div class="booth-logo-frame">${boothLogoMarkup(b)}</div></a><div class="booth-card-identity"><div class="booth-top"><span class="booth-code">${esc(b.code)}</span><span class="booth-category">${esc(b.category)}</span></div><h3>${esc(b.name)}</h3></div><button class="wish-btn" data-wish="${escAttr(b.id)}">☆ 收藏</button></div><div class="booth-body"><p>${esc(b.note||b.description||'')}</p><div>${String(b.tags||'').split(',').filter(Boolean).map(t=>`<span class="tag">${esc(t.trim())}</span>`).join('')}</div>${boothProductPreview(b)}<a class="booth-link" href="${boothPageName(i)}">查看社团与全部制品 →</a></div></article>`;
}
function productBrowseCard(b,p,i){
  const cats=[b.category,p.category].filter(Boolean).join('|');
  const text=[b.code,b.name,b.category,b.tags,p.name,p.category,p.price,p.availability,p.description].join(' ').toLowerCase();
  return `<article class="browse-product-card" data-id="${escAttr(b.id)}" data-product-id="${escAttr(p.id)}" data-text="${escAttr(text)}" data-categories="${escAttr(cats)}">${p.images?.[0]?`<img class="browse-product-image" src="${escAttr(p.images[0])}" alt="${escAttr(p.name)}">`:`<div class="browse-product-image browse-product-placeholder">NO IMAGE</div>`}<div class="browse-product-body"><div class="product-card-actions"><button class="product-wish-btn" data-product-wish="${escAttr(p.id)}" type="button">♡ 心愿单</button></div><div class="product-info"><span class="pill">${esc(p.category||'制品')}</span>${p.price?`<span class="pill price">${esc(p.price)}</span>`:''}</div><h3>${esc(p.name)}</h3><a class="product-circle-link" href="${boothPageName(i)}"><span class="booth-code">${esc(b.code)}</span><b>${esc(b.name)}</b></a>${p.description?`<p>${esc(p.description)}</p>`:''}<a class="booth-link" href="${boothPageName(i)}#products">查看该摊全部制品 →</a></div></article>`;
}
function buildBooths(c){
  const pub=publishedBooths(c);
  const products=pub.flatMap(({b,i})=>(b.products||[]).filter(p=>p.published!==false).map(p=>({b,p,i})));
  const cats=[...new Set(pub.flatMap(x=>boothFilterCategories(x.b)))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
  const body=`<header class="page-hero"><div class="wrap"><div class="page-kicker">Circle & Booths</div><h1>摊位与制品</h1><p>先看社团，也可以直接逛制品；搜索和筛选会同时覆盖两种内容。</p></div></header><main class="section"><div class="wrap"><div class="booth-search-panel"><div class="booth-view-switch" role="group" aria-label="浏览方式"><button type="button" class="view-btn active" data-view="booths">社团 / 摊位</button><button type="button" class="view-btn" data-view="products">制品</button></div><div class="saved-toolbar"><span class="saved-toolbar-label">我的清单</span><button class="saved-filter-btn" id="favoriteOnly" type="button">★ 收藏摊位 <b id="favoriteCount">0</b></button><button class="saved-filter-btn" id="productWishOnly" type="button">♥ 制品心愿单 <b id="productWishCount">0</b></button></div><div class="booth-search-row"><input id="boothSearch" class="search" placeholder="搜索社团、摊位号、制品、标签…"><button id="clearBoothSearch" class="filter-btn" type="button">清除</button></div><div class="filters" id="boothFilters"><button class="filter-btn active" data-filter="">全部</button>${cats.map(x=>`<button class="filter-btn" data-filter="${escAttr(x)}">${esc(x)}</button>`).join('')}</div><div class="search-result-meta"><span id="boothResultCount">${pub.length}</span> <span id="boothResultUnit">个摊位</span></div></div><div class="booth-grid" id="boothGrid">${pub.length?pub.map(({b,i})=>boothCard(b,i)).join(''):`<div class="visitor-empty">摊位信息准备中，请稍后再来查看。</div>`}</div><div class="product-browse-grid hidden" id="productBrowseGrid">${products.length?products.map(({b,p,i})=>productBrowseCard(b,p,i)).join(''):`<div class="visitor-empty">制品信息准备中，请稍后再来查看。</div>`}</div><div id="boothNoResults" class="visitor-empty hidden">没有找到符合条件的内容。</div></div></main>`;
  const js=`${staticWishJs()}const q=document.getElementById('boothSearch'),boothCards=[...document.querySelectorAll('#boothGrid .booth-card')],productCards=[...document.querySelectorAll('#productBrowseGrid .browse-product-card')],btns=[...document.querySelectorAll('.filter-btn[data-filter]')],viewBtns=[...document.querySelectorAll('.view-btn[data-view]')],favBtn=document.getElementById('favoriteOnly'),productWishBtn=document.getElementById('productWishOnly'),clear=document.getElementById('clearBoothSearch'),count=document.getElementById('boothResultCount'),unit=document.getElementById('boothResultUnit'),none=document.getElementById('boothNoResults'),boothGrid=document.getElementById('boothGrid'),productGrid=document.getElementById('productBrowseGrid'),params=new URLSearchParams(location.search);let cat=params.get('cat')||'',saved=params.get('saved')||'',view=params.get('view')==='products'?'products':'booths';q.value=params.get('q')||'';function syncUrl(){const p=new URLSearchParams(),v=q.value.trim();if(v)p.set('q',v);if(cat)p.set('cat',cat);if(saved)p.set('saved',saved);if(view==='products')p.set('view','products');try{history.replaceState(null,'',location.pathname+(p.toString()?'?'+p.toString():''))}catch{}}function apply(){const s=q.value.trim().toLowerCase(),w=wl(),pws=pwl(),cards=view==='products'?productCards:boothCards;let visible=0;[...boothCards,...productCards].forEach(r=>r.style.display='none');cards.forEach(r=>{const categories=(r.dataset.categories||'').split('|');const savedOk=!saved||(saved==='booths'?w.has(r.dataset.id):saved==='products'?pws.has(r.dataset.productId):true);const show=(!s||r.dataset.text.includes(s))&&(!cat||categories.includes(cat))&&savedOk;r.style.display=show?'':'none';if(show)visible++});boothGrid.classList.toggle('hidden',view!=='booths');productGrid.classList.toggle('hidden',view!=='products');viewBtns.forEach(b=>b.classList.toggle('active',b.dataset.view===view));favBtn.classList.toggle('active',saved==='booths');productWishBtn.classList.toggle('active',saved==='products');document.getElementById('favoriteCount').textContent=w.size;document.getElementById('productWishCount').textContent=pws.size;count.textContent=visible;unit.textContent=view==='products'?'件制品':'个摊位';none.classList.toggle('hidden',visible!==0||cards.length===0);syncUrl()}q.oninput=apply;clear.onclick=()=>{q.value='';cat='';saved='';btns.forEach(x=>x.classList.toggle('active',x.dataset.filter===''));apply();q.focus()};btns.forEach(b=>b.onclick=()=>{btns.forEach(x=>x.classList.remove('active'));b.classList.add('active');cat=b.dataset.filter;apply()});favBtn.onclick=()=>{saved=saved==='booths'?'':'booths';view='booths';apply()};productWishBtn.onclick=()=>{saved=saved==='products'?'':'products';view='products';apply()};viewBtns.forEach(b=>b.onclick=()=>{view=b.dataset.view;if(saved==='booths'&&view==='products')saved='';if(saved==='products'&&view==='booths')saved='';apply()});btns.forEach(x=>x.classList.toggle('active',x.dataset.filter===cat));addEventListener('wishlistchange',apply);apply();`;

  return htmlShell(c,`摊位与制品 · ${c.eventName}`,'booths.html',body,js);
}
function buildBoothDetail(c,index){
  const b=c.booths[index];
  if(!b||b.published===false)return htmlShell(c,`摊位不存在 · ${c.eventName}`,'booths.html',`<main class="section"><div class="wrap"><a class="back-link" href="booths.html">← 返回摊位一览</a><h2>此摊位不存在或尚未公开。</h2></div></main>`);
  const products=(b.products||[]).filter(p=>p.published!==false);
  const productHtml=products.length?`<div class="product-grid">${products.map(p=>`<article class="product-card">${p.images&&p.images[0]?`<img class="product-main-image" src="${escAttr(p.images[0])}" alt="${escAttr(p.name)}">`:`<div class="product-placeholder">NO IMAGE</div>`}<div class="product-content"><div class="product-card-actions"><button class="product-wish-btn" data-product-wish="${escAttr(p.id)}" type="button">♡ 心愿单</button></div><div class="product-info"><span class="pill">${esc(p.category||'制品')}</span>${p.price?`<span class="pill price">${esc(p.price)}</span>`:''}${p.availability?`<span class="pill">${esc(p.availability)}</span>`:''}</div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p></div>${p.images&&p.images.length>1?`<div class="product-gallery">${p.images.slice(1).map(img=>`<img src="${escAttr(img)}" alt="${escAttr(p.name)}">`).join('')}</div>`:''}</article>`).join('')}</div>`:`<div class="card"><h3>制品信息准备中</h3><p>本摊位暂未公开制品。</p></div>`;
  const body=`<main class="booth-detail"><section class="booth-detail-hero"><div class="wrap"><a class="back-link" href="booths.html">← 返回摊位与制品</a><div class="booth-detail-grid"><div class="booth-detail-logo-panel"><div class="booth-detail-logo-frame">${boothLogoMarkup(b,'booth-detail-logo')}</div></div><div><div class="detail-section-label">社团 / 摊位</div><div class="booth-detail-meta"><span class="booth-code">${esc(b.code)}</span><span class="booth-category">${esc(b.category)}</span>${String(b.tags||'').split(',').filter(Boolean).map(t=>`<span class="tag">${esc(t.trim())}</span>`).join('')}</div><h1>${esc(b.name)}</h1><button class="detail-wish" data-wish="${escAttr(b.id)}">☆ 收藏</button><div class="booth-desc">${esc(b.description||b.note)}</div>${b.contact||b.social?`<div class="contact-box">${b.contact?`<div><b>现场 / 联系：</b>${esc(b.contact)}</div>`:''}${b.social?`<div><b>社交：</b>${esc(b.social)}</div>`:''}</div>`:''}${products.length?`<a class="jump-products" href="#products">查看本摊 ${products.length} 件制品 ↓</a>`:''}</div></div></div></section><section class="section" id="products"><div class="wrap"><div class="product-section-head"><div><div class="detail-section-label">Items</div><h2>本摊制品</h2></div><span>${products.length} 件</span></div>${productHtml}</div></section></main>`;
  return htmlShell(c,`${b.name} · ${c.eventName}`,boothPageName(index),body,staticWishJs()+`try{const r=new URL(document.referrer);if(r.origin===location.origin&&/\/booths\.html$/.test(r.pathname)){const a=document.querySelector('.back-link');if(a)a.href=r.href}}catch{}`);
}
function activityMembersHtml(x){const ms=x.participants||[];return ms.length?`<div class="activity-members">${ms.map(m=>`<div class="activity-member">${m.image?`<img src="${escAttr(m.image)}" alt="${escAttr(m.name)}">`:'<div class="member-avatar">♪</div>'}<div><b>${esc(m.name)}</b><small>${esc(m.role)}</small>${m.bio?`<p>${esc(m.bio)}</p>`:''}</div></div>`).join('')}</div>`:'';}
function buildSchedule(c){
  const items=c.schedule||[], labeled=items.filter(x=>String(x.day||'').trim()), unlabeled=items.filter(x=>!String(x.day||'').trim());
  const card=(x,i)=>`<article class="activity-card" data-ve-object-kind="schedule" data-ve-object-index="${i}">${x.image?`<img class="activity-cover" data-ve-object-image="schedule:${i}:image" src="${escAttr(x.image)}" alt="${escAttr(x.title)}">`:''}<div class="activity-content"><div class="activity-meta"><span class="activity-time" data-ve-object-field="time">${esc(x.time)}${x.endTime?`–${esc(x.endTime)}`:''}</span><span data-ve-object-field="stage">${esc(x.stage)}</span><em data-ve-object-field="type">${esc(x.type)}</em></div><h3 data-ve-object-field="title">${esc(x.title)}</h3>${x.description?`<p class="activity-desc" data-ve-object-field="description">${esc(x.description)}</p>`:''}${activityMembersHtml(x)}</div></article>`;
  const indexed=items.map((x,i)=>({x,i})), days=[...new Set(labeled.map(x=>x.day))];
  let scheduleHtml='';
  if(days.length)scheduleHtml+=days.map((day,di)=>`<section class="day-block"><h2 data-ve-label="scheduleDay${di}">${esc(ipOnlyLabel(c,`scheduleDay${di}`,day))}</h2><div class="activity-list">${indexed.filter(v=>v.x.day===day).map(v=>card(v.x,v.i)).join('')}</div></section>`).join('');
  const loose=indexed.filter(v=>!String(v.x.day||'').trim());if(loose.length)scheduleHtml+=`<section class="day-block"><div class="activity-list">${loose.map(v=>card(v.x,v.i)).join('')}</div></section>`;
  if(!scheduleHtml)scheduleHtml='<div class="visitor-empty">活动日程准备中，请稍后关注官方更新。</div>';
  const body=`<header class="page-hero"><div class="wrap"><div class="page-kicker" data-ve-label="schedulePageKicker">${esc(ipOnlyLabel(c,'schedulePageKicker','Schedule'))}</div><h1 data-ve-label="schedulePageTitle">${esc(ipOnlyLabel(c,'schedulePageTitle','活动日程'))}</h1><p data-ve-label="schedulePageDesc">${esc(ipOnlyLabel(c,'schedulePageDesc','单日、多日或不分日期的活动都可以在这里展示。'))}</p></div></header><main class="section"><div class="wrap">${scheduleHtml}</div></main>`;
  return htmlShell(c,`活动日程 · ${c.eventName}`,'schedule.html',body);
}
function buildGuide(c){
  const published=c.booths.map((b,i)=>({b,i})).filter(x=>x.b.published!==false), mapped=published.filter(({b})=>boothHasMapPoint(b));
  const mapBlock=c.mapImage?`<div class="visitor-map-wrap"><div class="visitor-map-stage"><img class="map-img" data-ve-image="mapImage" src="${escAttr(c.mapImage)}" alt="场馆地图">${featureEnabled('booths',c)?mapped.map(({b,i})=>`<a class="visitor-map-marker" data-ve-object-kind="booth" data-ve-object-index="${i}" href="${boothPageName(i)}" style="left:${clampPct(b.mapX)}%;top:${clampPct(b.mapY)}%" title="${escAttr(b.code+' '+b.name)}"><span data-ve-object-field="code">${esc(b.code)}</span><b data-ve-object-field="name">${esc(b.name)}</b></a>`).join(''):''}</div>${mapped.length?`<p class="map-help" data-ve-label="guideMapHelp">${esc(ipOnlyLabel(c,'guideMapHelp','点击地图上的摊位编号可直接查看社团与制品；完整搜索请前往“摊位”页面。'))}</p>`:''}</div>`:'';
  const transportMedia=`${c.transportImage?`<img class="transport-image" data-ve-image="transportImage" src="${escAttr(c.transportImage)}" alt="交通示意图">`:''}${c.transportMapUrl?`<a class="map-nav-link" href="${escAttr(safeUrl(c.transportMapUrl))}" target="_blank" rel="noopener"><span data-ve-label="guideMapLink">${esc(ipOnlyLabel(c,'guideMapLink','打开地图导航 ↗'))}</span></a>`:''}`;
  const body=`<header class="page-hero"><div class="wrap"><div class="page-kicker" data-ve-label="guidePageKicker">${esc(ipOnlyLabel(c,'guidePageKicker','Visitor Guide'))}</div><h1 data-ve-label="guidePageTitle">${esc(ipOnlyLabel(c,'guidePageTitle','场馆与入场指南'))}</h1><p><span data-ve-key="eventLocation">${esc(c.eventLocation)}</span> · <span data-ve-key="eventDate">${esc(c.eventDate)}</span></p></div></header><main class="section"><div class="wrap">${mapBlock}<div class="guide-grid"><section class="guide-card"><h2 data-ve-label="guideVenueTitle">${esc(ipOnlyLabel(c,'guideVenueTitle','场馆说明'))}</h2><p data-ve-key="venueText">${esc(c.venueText)}</p></section><section class="guide-card"><h2 data-ve-label="guideTransportTitle">${esc(ipOnlyLabel(c,'guideTransportTitle','交通指南'))}</h2><p data-ve-key="transportText">${esc(c.transportText)}</p>${transportMedia}</section><section class="guide-card" style="grid-column:1/-1"><h2 data-ve-label="guideEntryTitle">${esc(ipOnlyLabel(c,'guideEntryTitle','入场须知'))}</h2><p data-ve-key="entryText">${esc(c.entryText)}</p></section></div></div></main>`;
  return htmlShell(c,`参展指南 · ${c.eventName}`,'guide.html',body);
}
function buildSponsors(c){
  const items=(c.sponsors||[]).filter(s=>s.published!==false), groups=[...new Set(items.map(s=>s.type||'合作方'))];
  const content=items.length?groups.map((type,gi)=>`<section class="sponsor-group"><h2 data-ve-label="sponsorGroup${gi}">${esc(ipOnlyLabel(c,`sponsorGroup${gi}`,type))}</h2><div class="sponsor-grid">${items.filter(s=>(s.type||'合作方')===type).map(s=>{const i=c.sponsors.indexOf(s),inner=`${s.logo?`<img data-ve-object-image="sponsor:${i}:logo" src="${escAttr(s.logo)}" alt="${escAttr(s.name)} Logo">`:`<div class="sponsor-logo-placeholder">${esc((s.name||'?').slice(0,2))}</div>`}<div><h3 data-ve-object-field="name">${esc(s.name)}</h3>${s.note?`<p data-ve-object-field="note">${esc(s.note)}</p>`:''}</div>`;return s.url?`<a class="sponsor-card" data-ve-object-kind="sponsor" data-ve-object-index="${i}" href="${escAttr(safeUrl(s.url))}" target="_blank" rel="noopener">${inner}</a>`:`<article class="sponsor-card" data-ve-object-kind="sponsor" data-ve-object-index="${i}">${inner}</article>`}).join('')}</div></section>`).join(''):'<div class="visitor-empty">合作伙伴信息准备中。</div>';
  const body=`<header class="page-hero"><div class="wrap"><div class="page-kicker" data-ve-label="sponsorsPageKicker">${esc(ipOnlyLabel(c,'sponsorsPageKicker','Partners'))}</div><h1 data-ve-label="sponsorsPageTitle">${esc(ipOnlyLabel(c,'sponsorsPageTitle','赞助与合作'))}</h1><p data-ve-label="sponsorsPageDesc">${esc(ipOnlyLabel(c,'sponsorsPageDesc','感谢支持本届活动的赞助商、合作伙伴与媒体朋友。'))}</p></div></header><main class="section"><div class="wrap">${content}</div></main>`;
  return htmlShell(c,`赞助与合作 · ${c.eventName}`,'sponsors.html',body);
}
function homeSponsorsHtml(c){
  if(!featureEnabled('sponsors',c))return '';
  const items=(c.sponsors||[]).filter(s=>s.published!==false);
  if(!items.length)return '';
  return `<section class="section alt home-sponsors"><div class="wrap"><div class="home-sponsor-head"><div><div class="page-kicker" data-ve-label="sponsorsKicker">${esc(ipOnlyLabel(c,'sponsorsKicker','Partners'))}</div><h2 data-ve-label="sponsorsHeading">${esc(ipOnlyLabel(c,'sponsorsHeading','赞助与合作'))}</h2></div><a href="sponsors.html"><span data-ve-label="sponsorsViewAll">${esc(ipOnlyLabel(c,'sponsorsViewAll','查看全部 →'))}</span></a></div><div class="home-sponsor-logos">${items.slice(0,12).map(s=>{const i=c.sponsors.indexOf(s);return `<div class="ip-sponsor-edit" data-ve-object-kind="sponsor" data-ve-object-index="${i}">${s.logo?`<img data-ve-object-image="sponsor:${i}:logo" src="${escAttr(s.logo)}" alt="${escAttr(s.name)}">`:`<span data-ve-object-field="name">${esc(s.name)}</span>`}</div>`}).join('')}</div></div></section>`;
}
function homeCommunityHtml(c){const d=c.community||{};const has=d.title||d.text||d.qqGroup||d.wechatGroup||d.qqQrImage||d.wechatQrImage||d.link;if(!has)return'';const qrs=`${d.qqQrImage?`<div class="community-qr-card"><img data-ve-image="community.qqQrImage" src="${escAttr(d.qqQrImage)}" alt="QQ 群二维码"><b data-ve-label="communityQqLabel">${esc(ipOnlyLabel(c,'communityQqLabel','QQ 群'))}</b>${d.qqGroup?`<span data-ve-community-field="qqGroup">${esc(d.qqGroup)}</span>`:''}</div>`:''}${d.wechatQrImage?`<div class="community-qr-card"><img data-ve-image="community.wechatQrImage" src="${escAttr(d.wechatQrImage)}" alt="微信群二维码"><b data-ve-label="communityWechatLabel">${esc(ipOnlyLabel(c,'communityWechatLabel','微信群'))}</b>${d.wechatGroup?`<span data-ve-community-field="wechatGroup">${esc(d.wechatGroup)}</span>`:''}</div>`:''}`;return `<section class="section community-section"><div class="wrap"><div class="community-layout"><div><div class="page-kicker" data-ve-label="communityKicker">${esc(ipOnlyLabel(c,'communityKicker','Community'))}</div><h2 data-ve-community-field="title">${esc(d.title||'加入官方群')}</h2>${d.text?`<p data-ve-community-field="text">${esc(d.text)}</p>`:`<p data-ve-community-field="text" class="ip-ve-empty">点击添加社群说明</p>`}<div class="community-lines">${d.qqGroup?`<span><b data-ve-label="communityQqLabel">${esc(ipOnlyLabel(c,'communityQqLabel','QQ 群'))}</b><i data-ve-community-field="qqGroup">${esc(d.qqGroup)}</i></span>`:''}${d.wechatGroup?`<span><b data-ve-label="communityWechatLabel">${esc(ipOnlyLabel(c,'communityWechatLabel','微信群'))}</b><i data-ve-community-field="wechatGroup">${esc(d.wechatGroup)}</i></span>`:''}</div>${d.link?`<a class="community-link" href="${escAttr(safeUrl(d.link))}" target="_blank" rel="noopener"><span data-ve-community-field="linkLabel">${esc(d.linkLabel||'打开报名 / 群公告')}</span> ↗</a>`:''}</div>${qrs?`<div class="community-qr-grid">${qrs}</div>`:''}</div></div></section>`;}


function buildFaq(c){const body=`<header class="page-hero"><div class="wrap"><div class="page-kicker" data-ve-label="faqPageKicker">${esc(ipOnlyLabel(c,'faqPageKicker','FAQ'))}</div><h1 data-ve-label="faqPageTitle">${esc(ipOnlyLabel(c,'faqPageTitle','常见问题'))}</h1><p data-ve-label="faqPageDesc">${esc(ipOnlyLabel(c,'faqPageDesc','关于购票、入场、交通和现场规则的常见问题。'))}</p></div></header><main class="section"><div class="wrap"><div class="faq-list">${c.faq.map((x,i)=>`<div class="faq-item ${i===0?'open':''}" data-ve-faq="${i}"><button class="faq-q" data-ve-faq-field="q">${esc(x.q)}<span>＋</span></button><div class="faq-a" data-ve-faq-field="a">${esc(x.a)}</div></div>`).join('')}</div></div></main>`;const js=`document.querySelectorAll('.faq-q').forEach(b=>b.onclick=()=>b.parentElement.classList.toggle('open'));`;return htmlShell(c,`常见问题 · ${c.eventName}`,'faq.html',body,js);}
function buildPage(name,c=config){
  const boothMatch=/^booth-(\d+)\.html$/.exec(name);
  if(boothMatch)return buildBoothDetail(c,Number(boothMatch[1])-1);
  return ({'index.html':buildHome,'guests.html':buildGuests,'booths.html':buildBooths,'schedule.html':buildSchedule,'guide.html':buildGuide,'faq.html':buildFaq,'sponsors.html':buildSponsors}[name]||buildHome)(c);
}

function rebuildPreviewOptions(preserve=true){
  const select=$('#previewPage'), old=preserve?activePreviewPage:'index.html';
  const standard=[['index.html','首页',true],['guests.html','嘉宾',featureEnabled('guests')],['booths.html','摊位与制品',featureEnabled('booths')],['schedule.html','日程',featureEnabled('schedule')],['guide.html','指南',featureEnabled('guide')],['faq.html','FAQ',featureEnabled('faq')],['sponsors.html','合作',featureEnabled('sponsors')]].filter(x=>x[2]);
  select.innerHTML=standard.map(([v,l])=>`<option value="${v}">${l}</option>`).join('');
  if(featureEnabled('booths')&&config.booths.length){const group=document.createElement('optgroup');group.label='摊位详情';config.booths.forEach((b,i)=>{const o=document.createElement('option');o.value=boothPageName(i);o.textContent=`${b.code} · ${b.name}`;group.appendChild(o)});select.appendChild(group);}
  const exists=[...select.options].some(o=>o.value===old); activePreviewPage=exists?old:'index.html'; select.value=activePreviewPage;
}
function currentPreviewDevice(){return $('#previewStage')?.dataset.device||'desktop';}
function setPreviewDevice(device){
  const stage=$('#previewStage');if(!stage)return;
  device=device==='mobile'?'mobile':'desktop';stage.dataset.device=device;
  stage.classList.toggle('device-mobile',device==='mobile');stage.classList.toggle('device-desktop',device==='desktop');
  $$('#deviceSwitch button').forEach(x=>x.classList.toggle('active',x.dataset.device===device));
  renderPreview(true);
}
function fitPreview(){
  const stage=$('#previewStage'),viewport=$('#previewViewport'),canvas=$('#previewCanvas'),frame=$('#previewFrame');
  if(!stage||!viewport||!canvas||!frame)return;
  const mobile=currentPreviewDevice()==='mobile';
  canvas.style.transform='none';canvas.style.transformOrigin='';
  canvas.style.width='100%';canvas.style.height='100%';
  viewport.style.height='100%';
  viewport.style.width=mobile?'min(390px, 100%)':'100%';
  frame.removeAttribute('width');frame.removeAttribute('height');frame.style.transform='none';
  frame.style.width='100%';frame.style.height='100%';
  if($('#previewViewportLabel'))$('#previewViewportLabel').textContent=mobile?'手机 · 390 CSS px':'桌面 · 当前窗口宽度';
  try{frame.contentWindow?.dispatchEvent(new Event('resize'))}catch{}
}
function previewHtml(name){
  const visual=(visualEditMode&&config.eventTemplate==='ip-only'&&name==='index.html')?`<style>
  [data-ve-key],[data-ve-label],[data-ve-ticket-field],[data-ve-schedule-field],[data-ve-home-title],[data-ve-object-field],[data-ve-community-field],[data-ve-faq-field]{outline:1px dashed transparent;cursor:text;transition:.15s}[data-ve-key]:hover,[data-ve-label]:hover,[data-ve-ticket-field]:hover,[data-ve-schedule-field]:hover,[data-ve-home-title]:hover,[data-ve-object-field]:hover,[data-ve-community-field]:hover,[data-ve-faq-field]:hover{outline-color:#7b61ff;background:rgba(123,97,255,.07)}
  [data-ve-image],[data-ve-image-responsive],[data-ve-object-image]{cursor:pointer;outline:2px solid transparent;outline-offset:4px}[data-ve-image]:hover,[data-ve-image-responsive]:hover,[data-ve-object-image]:hover{outline-color:#7b61ff}.ip-ve-empty{opacity:.55;font-style:italic}.ip-ve-create-card{display:grid;gap:8px;width:100%;min-height:132px;place-content:center;text-align:center;border:2px dashed #8d79ef;background:rgba(123,97,255,.05);color:#30285a;border-radius:18px;padding:22px;cursor:pointer}.ip-ve-create-card b{font:900 18px system-ui}.ip-ve-create-card span{font:500 13px/1.6 system-ui;color:#6b6680}.ip-ve-create-card em{font:800 12px system-ui;color:#6b50e8;font-style:normal}.ip-ve-create-card:hover{background:rgba(123,97,255,.1)}.ve-object-edit{position:absolute;right:8px;top:8px;z-index:95;border:1px solid #7357ef!important;border-radius:999px!important;background:#fff!important;color:#5b43d6!important;padding:5px 9px!important;font:800 11px system-ui!important;box-shadow:0 5px 16px rgba(40,25,90,.15)!important;cursor:pointer!important;opacity:0;transform:translateY(-2px);transition:.15s}[data-ve-object-kind]:hover>.ve-object-edit,.ve-object-edit:focus{opacity:1;transform:none}[data-ve-object-kind].ve-object-selected{outline:2px solid #7b61ff!important;outline-offset:3px}
  [data-ve-home-section]{position:relative}.ve-section-tools{position:absolute;right:12px;top:12px;z-index:90;display:flex;gap:4px;padding:4px;border:1px solid #d7d0ee;border-radius:10px;background:rgba(255,255,255,.94);box-shadow:0 6px 20px rgba(30,20,60,.12)}.ve-section-tools button{border:0;border-radius:7px;background:#f3f0ff;padding:5px 8px;font:700 11px system-ui;cursor:pointer}.ve-section-tools button:hover{background:#e7e0ff}
  .ve-drag-handle{position:absolute;left:8px;top:8px;z-index:96;border:1px solid #7357ef!important;border-radius:999px!important;background:#fff!important;color:#5b43d6!important;padding:5px 8px!important;font:900 11px system-ui!important;line-height:1!important;cursor:grab!important;box-shadow:0 5px 16px rgba(40,25,90,.15)!important;opacity:.18;transition:.15s}.ve-drag-handle:active{cursor:grabbing!important}[data-ve-module]:hover>.ve-drag-handle,[data-ve-object-kind]:hover>.ve-drag-handle,.ve-drag-handle:focus{opacity:1}.ve-dragging{opacity:.32!important;filter:saturate(.65)}.ve-drop-target{outline:3px dashed #7b61ff!important;outline-offset:5px!important;box-shadow:inset 0 0 0 9999px rgba(123,97,255,.055)!important}.ve-drop-target:after{content:'放到这里';position:absolute;left:50%;top:50%;translate:-50% -50%;z-index:150;background:#6f52e8;color:#fff;border-radius:999px;padding:7px 11px;font:900 11px system-ui;pointer-events:none;box-shadow:0 6px 18px rgba(40,25,90,.2)}[contenteditable]:focus{outline:3px solid #7b61ff!important;outline-offset:3px!important;background:rgba(255,255,255,.94)!important}.ip-home-map-marker[data-ve-map-marker]{touch-action:none;cursor:grab!important}.ip-home-map-marker[data-ve-map-marker].ve-map-dragging{cursor:grabbing!important;z-index:120!important;transition:none!important}
  .ve-floating-tools{position:fixed;z-index:9999;display:flex;align-items:center;gap:4px;padding:5px;border:1px solid #d7d0ee;border-radius:11px;background:rgba(255,255,255,.97);box-shadow:0 12px 32px rgba(28,20,62,.2);font:800 11px system-ui;transform:translateY(-100%);margin-top:-8px}.ve-floating-tools.hidden{display:none}.ve-floating-tools button{border:0;border-radius:7px;background:#f5f2ff;color:#5b43d6;padding:6px 8px;font:800 11px system-ui;cursor:pointer;white-space:nowrap}.ve-floating-tools button:hover{background:#e9e2ff}.ve-floating-tools .danger{color:#b52d49;background:#fff1f4}.ve-more-menu{position:absolute;right:0;top:calc(100% + 6px);display:grid;min-width:118px;padding:5px;border:1px solid #ddd8e9;border-radius:10px;background:#fff;box-shadow:0 10px 30px rgba(28,20,62,.18)}.ve-more-menu.hidden{display:none}.ve-more-menu button{text-align:left;background:#fff}.ve-more-menu button:hover{background:#f5f2ff}[data-ve-module].ve-selected,[data-ve-object-kind].ve-object-selected{scroll-margin-top:96px}.ve-style-selected{outline:3px solid #24a0ed!important;outline-offset:3px!important}
  </style><script>(function(){
    function editAnchor(el){var q='';if(el.dataset.veKey)q='[data-ve-key=\"'+el.dataset.veKey+'\"]';else if(el.dataset.veLabel)q='[data-ve-label=\"'+el.dataset.veLabel+'\"]';else if(el.dataset.veTicketField){var h=el.closest('[data-ve-ticket]');q='[data-ve-ticket=\"'+(h?.dataset.veTicket||'')+'\"] [data-ve-ticket-field=\"'+el.dataset.veTicketField+'\"]'}else if(el.dataset.veScheduleField){var h=el.closest('[data-ve-schedule]');q='[data-ve-schedule=\"'+(h?.dataset.veSchedule||'')+'\"] [data-ve-schedule-field=\"'+el.dataset.veScheduleField+'\"]'}else if(el.dataset.veHomeTitle!==undefined)q='[data-ve-home-title=\"'+el.dataset.veHomeTitle+'\"]';else if(el.dataset.veCommunityField)q='[data-ve-community-field=\"'+el.dataset.veCommunityField+'\"]';else if(el.dataset.veFaqField){var h=el.closest('[data-ve-faq]');q='[data-ve-faq=\"'+(h?.dataset.veFaq||'')+'\"] [data-ve-faq-field=\"'+el.dataset.veFaqField+'\"]'}else if(el.dataset.veObjectField){var h=el.closest('[data-ve-object-kind]');q='[data-ve-object-kind=\"'+(h?.dataset.veObjectKind||'')+'\"][data-ve-object-index=\"'+(h?.dataset.veObjectIndex||'')+'\"] [data-ve-object-field=\"'+el.dataset.veObjectField+'\"]'}return {anchorSelector:q,anchorTop:el.getBoundingClientRect().top}}
    function editable(el,payload){el.setAttribute('contenteditable','plaintext-only');el.spellcheck=false;var last=(el.innerText||'').trim(),timer=0;el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();selectTarget(el)});el.addEventListener('input',function(){clearTimeout(timer);timer=setTimeout(function(){var value=(el.innerText||'').trim();if(value===last)return;last=value;parent.postMessage(Object.assign({type:'cms-visual-edit-live',value:value},editAnchor(el),payload(el)),'*')},180)});el.addEventListener('blur',function(){clearTimeout(timer);var value=(el.innerText||'').trim();last=value;parent.postMessage(Object.assign({type:'cms-visual-edit',value:value},editAnchor(el),payload(el)),'*')});el.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();el.blur()}})}
    document.querySelectorAll('[data-ve-key]').forEach(el=>editable(el,()=>({kind:'base',key:el.dataset.veKey})));
    document.querySelectorAll('[data-ve-label]').forEach(el=>editable(el,()=>({kind:'label',key:el.dataset.veLabel})));
    document.querySelectorAll('[data-ve-object-field]').forEach(el=>editable(el,()=>{var host=el.closest('[data-ve-object-kind]');return {kind:'objectField',objectKind:host?.dataset.veObjectKind||'',objectIndex:host?.dataset.veObjectIndex||'',field:el.dataset.veObjectField}}));
    document.querySelectorAll('[data-ve-community-field]').forEach(el=>editable(el,()=>({kind:'communityField',field:el.dataset.veCommunityField})));
    document.querySelectorAll('[data-ve-faq-field]').forEach(el=>editable(el,()=>({kind:'faq',index:Number(el.closest('[data-ve-faq]')?.dataset.veFaq),field:el.dataset.veFaqField}))); 
    document.querySelectorAll('[data-ve-ticket-field]').forEach(el=>editable(el,()=>({kind:'ticket',index:Number(el.closest('[data-ve-ticket]')?.dataset.veTicket),field:el.dataset.veTicketField})));
    document.querySelectorAll('[data-ve-schedule-field]').forEach(el=>editable(el,()=>({kind:'schedule',index:Number(el.closest('[data-ve-schedule]')?.dataset.veSchedule),field:el.dataset.veScheduleField})));
    document.querySelectorAll('[data-ve-home-title]').forEach(el=>editable(el,()=>({kind:'homeTitle',index:Number(el.dataset.veHomeTitle)})));
    document.querySelectorAll('[data-ve-image]').forEach(el=>el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();parent.postMessage({type:'cms-visual-image',key:el.dataset.veImage},'*')}));document.querySelectorAll('[data-ve-image-responsive]').forEach(el=>el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();parent.postMessage({type:'cms-visual-image',key:innerWidth<=600?'heroMobileImage':'heroImage'},'*')}));
    document.querySelectorAll('[data-ve-object-image]').forEach(el=>el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var p=(el.dataset.veObjectImage||'').split(':');parent.postMessage({type:'cms-visual-object-image',kind:p[0],index:p[1],field:p[2]},'*')}));
    document.querySelectorAll('[data-ve-create]').forEach(el=>el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();parent.postMessage({type:'cms-visual-create',kind:el.dataset.veCreate},'*')}));
    var veToolbar=document.createElement('div');veToolbar.className='ve-floating-tools hidden';veToolbar.innerHTML='<button data-t="edit">编辑</button><button data-t="style">样式</button><button data-t="duplicate">复制</button><button data-t="more">•••</button><div class="ve-more-menu hidden"><button data-t="up">上移</button><button data-t="down">下移</button><button data-t="hide">隐藏</button><button class="danger" data-t="delete">删除</button></div>';document.body.appendChild(veToolbar);var veSelected=null;
    function positionToolbar(){if(!veSelected||!veSelected.isConnected){veToolbar.classList.add('hidden');return}var r=veSelected.getBoundingClientRect(),w=veToolbar.offsetWidth||190;veToolbar.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left))+'px';veToolbar.style.top=Math.max(44,r.top)+'px';veToolbar.classList.remove('hidden')}
    function selectTarget(el){if(!el)return;document.querySelectorAll('.ve-selected,.ve-object-selected,.ve-style-selected').forEach(x=>x.classList.remove('ve-selected','ve-object-selected','ve-style-selected'));veSelected=el;if(el.dataset&&el.dataset.veObjectKind)el.classList.add('ve-object-selected');else if(el.dataset&&el.dataset.veModule)el.classList.add('ve-selected');else el.classList.add('ve-style-selected');positionToolbar();var dup=veToolbar.querySelector('[data-t="duplicate"]'),del=veToolbar.querySelector('[data-t="delete"]'),hide=veToolbar.querySelector('[data-t="hide"]');var isObj=!!el.dataset?.veObjectKind,isModule=!!el.dataset?.veModule,isHome=el.hasAttribute&&el.hasAttribute('data-ve-home-section');dup.style.display=(isObj||isHome)?'':'none';del.style.display=(isObj||isHome)?'':'none';hide.style.display=isModule?'':'none'}
    addEventListener('scroll',positionToolbar,{passive:true});addEventListener('resize',positionToolbar);function styleKeyFor(el){if(!el||!el.dataset)return '';if(el.dataset.veKey)return 'field:'+el.dataset.veKey;if(el.dataset.veObjectKind)return 'object:'+el.dataset.veObjectKind+':'+el.dataset.veObjectIndex;if(el.dataset.veModule)return 'module:'+el.dataset.veModule;var o=el.closest&&el.closest('[data-ve-object-kind]');if(o)return 'object:'+o.dataset.veObjectKind+':'+o.dataset.veObjectIndex;var m=el.closest&&el.closest('[data-ve-module]');if(m)return 'module:'+m.dataset.veModule;return '';}
    veToolbar.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var b=e.target.closest('button[data-t]');if(!b||!veSelected)return;var a=b.dataset.t,menu=veToolbar.querySelector('.ve-more-menu');if(a==='more'){menu.classList.toggle('hidden');return}menu.classList.add('hidden');if(a==='style'){var sk=styleKeyFor(veSelected);if(sk)parent.postMessage({type:'cms-visual-style-select',key:sk,label:(veSelected.innerText||veSelected.dataset.veModuleLabel||'选中元素').trim().slice(0,32)},'*');return}if(veSelected.dataset.veObjectKind){var kind=veSelected.dataset.veObjectKind,index=veSelected.dataset.veObjectIndex;if(a==='edit')parent.postMessage({type:'cms-visual-object-select',kind:kind,index:index},'*');else if(a==='duplicate')parent.postMessage({type:'cms-visual-object-duplicate',kind:kind,index:index},'*');else if(a==='delete')parent.postMessage({type:'cms-visual-object-delete',kind:kind,index:index},'*');else if(a==='up'||a==='down')parent.postMessage({type:'cms-visual-object-nudge',kind:kind,index:index,direction:a},'*');return}if(veSelected.dataset.veModule){var key=veSelected.dataset.veModule;if(a==='edit')parent.postMessage({type:'cms-visual-module-select',key:key,label:veSelected.dataset.veModuleLabel},'*');else if(a==='up'||a==='down')parent.postMessage({type:'cms-visual-module-nudge',key:key,direction:a},'*');else if(a==='hide')parent.postMessage({type:'cms-visual-module-hide',key:key},'*');return}if(veSelected.hasAttribute('data-ve-home-section')){var index=Number(veSelected.dataset.veHomeSection);if(a==='duplicate')parent.postMessage({type:'cms-visual-section',index:index,action:'duplicate'},'*');else if(a==='delete'||a==='hide')parent.postMessage({type:'cms-visual-section',index:index,action:'hide'},'*');else if(a==='up'||a==='down')parent.postMessage({type:'cms-visual-section',index:index,action:a},'*')}});
    function dragHandle(el,cls,payload){var h=document.createElement('button');h.type='button';h.className='ve-drag-handle '+cls;h.textContent='⋮⋮';h.title='拖动排序';h.draggable=true;h.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();selectTarget(el)});h.addEventListener('dragstart',function(e){e.stopPropagation();try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('application/x-onlyevent',JSON.stringify(payload))}catch(_){}el.classList.add('ve-dragging')});h.addEventListener('dragend',function(){el.classList.remove('ve-dragging');document.querySelectorAll('.ve-drop-target').forEach(x=>x.classList.remove('ve-drop-target'))});el.appendChild(h);}
    function readDrag(e){try{return JSON.parse(e.dataTransfer.getData('application/x-onlyevent')||'{}')}catch(_){return {}}}
    document.querySelectorAll('[data-ve-object-kind]').forEach(el=>{if(getComputedStyle(el).position==='static')el.style.position='relative';var b=document.createElement('button');b.type='button';b.className='ve-object-edit';b.textContent='编辑';b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();selectTarget(el);parent.postMessage({type:'cms-visual-object-select',kind:el.dataset.veObjectKind,index:el.dataset.veObjectIndex},'*')});el.appendChild(b);if(!el.hasAttribute('data-ve-map-marker')){dragHandle(el,'ve-object-drag',{scope:'object',kind:el.dataset.veObjectKind,index:el.dataset.veObjectIndex});el.addEventListener('dragover',function(e){var d=readDrag(e);if(d.scope==='object'&&d.kind===el.dataset.veObjectKind&&String(d.index)!==String(el.dataset.veObjectIndex)){e.preventDefault();el.classList.add('ve-drop-target')}});el.addEventListener('dragleave',function(){el.classList.remove('ve-drop-target')});el.addEventListener('drop',function(e){var d=readDrag(e);el.classList.remove('ve-drop-target');if(d.scope!=='object'||d.kind!==el.dataset.veObjectKind)return;e.preventDefault();e.stopPropagation();parent.postMessage({type:'cms-visual-object-move',kind:d.kind,from:d.index,to:el.dataset.veObjectIndex},'*')})}});
    document.querySelectorAll('[data-ve-map-marker]').forEach(marker=>{var active=false,map=marker.closest('.ip-home-map');marker.addEventListener('pointerdown',function(e){if(e.target.closest('button'))return;active=true;marker.classList.add('ve-map-dragging');marker.setPointerCapture&&marker.setPointerCapture(e.pointerId);e.preventDefault();e.stopPropagation()});marker.addEventListener('pointermove',function(e){if(!active||!map)return;var r=map.getBoundingClientRect(),x=Math.max(0,Math.min(100,(e.clientX-r.left)/Math.max(1,r.width)*100)),y=Math.max(0,Math.min(100,(e.clientY-r.top)/Math.max(1,r.height)*100));marker.style.left=x+'%';marker.style.top=y+'%';marker.dataset.veMapX=x.toFixed(2);marker.dataset.veMapY=y.toFixed(2);e.preventDefault()});function done(e){if(!active)return;active=false;marker.classList.remove('ve-map-dragging');try{marker.releasePointerCapture&&marker.releasePointerCapture(e.pointerId)}catch(_){}parent.postMessage({type:'cms-visual-map-move',index:marker.dataset.veObjectIndex,mapX:Number(marker.dataset.veMapX||parseFloat(marker.style.left)||0),mapY:Number(marker.dataset.veMapY||parseFloat(marker.style.top)||0)},'*');e.preventDefault();e.stopPropagation()}marker.addEventListener('pointerup',done);marker.addEventListener('pointercancel',function(){active=false;marker.classList.remove('ve-map-dragging')});marker.addEventListener('click',function(e){if(active||marker.dataset.veMapX){e.preventDefault();e.stopPropagation()}})});
    document.querySelectorAll('[data-ve-module]').forEach(sec=>{if(getComputedStyle(sec).position==='static')sec.style.position='relative';dragHandle(sec,'ve-module-drag',{scope:'module',key:sec.dataset.veModule});sec.addEventListener('dragover',function(e){var d=readDrag(e);if(d.scope==='module'&&d.key!==sec.dataset.veModule){e.preventDefault();sec.classList.add('ve-drop-target')}});sec.addEventListener('dragleave',function(){sec.classList.remove('ve-drop-target')});sec.addEventListener('drop',function(e){var d=readDrag(e);sec.classList.remove('ve-drop-target');if(d.scope!=='module'||d.key===sec.dataset.veModule)return;e.preventDefault();e.stopPropagation();parent.postMessage({type:'cms-visual-module-move',from:d.key,to:sec.dataset.veModule},'*')});sec.addEventListener('click',function(e){if(e.target.closest('[contenteditable],[data-ve-image],[data-ve-image-responsive],a,button'))return;selectTarget(sec);parent.postMessage({type:'cms-visual-module-select',key:sec.dataset.veModule,label:sec.dataset.veModuleLabel},'*')})});
    document.querySelectorAll('[data-ve-home-section]').forEach(sec=>{var idx=Number(sec.dataset.veHomeSection),bar=document.createElement('div');bar.className='ve-section-tools';bar.innerHTML='<button data-a="up">↑</button><button data-a="down">↓</button><button data-a="duplicate">复制</button><button data-a="hide">隐藏</button>';bar.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();selectTarget(sec);var b=e.target.closest('button');if(b)parent.postMessage({type:'cms-visual-section',index:idx,action:b.dataset.a},'*')});sec.addEventListener('click',function(e){if(e.target.closest('button,[contenteditable],a'))return;selectTarget(sec)});sec.appendChild(bar)});
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;e.preventDefault();e.stopPropagation()});
  })()<\/script>`:'';
  const bridge=`<script>(function(){document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href')||'';if(!h||h[0]==='#'||/^(https?:|mailto:|tel:)/i.test(h))return;if(/\.html(?:$|[?#])/i.test(h)){e.preventDefault();parent.postMessage({type:'cms-preview-nav',href:h},'*')}})})()<\/script>`;
  const forceIntro=introPreviewOnce&&name==='index.html'&&config.eventTemplate==='ip-only';introPreviewOnce=false;
  const introEditor=introEditorMode&&name==='index.html'&&config.eventTemplate==='ip-only';
  return buildPage(name,{...config,__cmsPreview:true,__forceIntroPreview:forceIntro,__introEditor:introEditor}).replace('</body>',visual+bridge+'</body>');
}
function setVisualEditMode(on){
  visualEditMode=!!on&&config.eventTemplate==='ip-only';
  $('#visualEditToggle')?.classList.toggle('active',visualEditMode);
  $('#visualThemeBtn')?.classList.toggle('hidden',!visualEditMode);$('#visualModulesBtn')?.classList.toggle('hidden',!visualEditMode);$('#visualIntroBtn')?.classList.toggle('hidden',!visualEditMode);$('#visualUndoBtn')?.classList.toggle('hidden',!visualEditMode);$('#visualRedoBtn')?.classList.toggle('hidden',!visualEditMode);$('#visualSaveStatus')?.classList.toggle('hidden',!visualEditMode);if(!visualEditMode)$('#visualInspector')?.classList.add('hidden');
  if(visualEditMode){if(!activePreviewPage)activePreviewPage='index.html';if($('#previewPage'))$('#previewPage').value=activePreviewPage;resetVisualHistory();toast('可视化编辑已开启：当前页面可直接编辑；可切换内页继续编辑');}
  else{visualSelection={mode:'',key:'',extra:''};resetVisualHistory();}
  renderVisualThemeControls();updateVisualHistoryButtons();setSaveStatus(saveState==='saved'?'已自动保存':'正在编辑…',saveState==='saved'?'saved':'dirty');renderPreview(true);
}
function renderVisualThemeControls(){
  const m={visualThemeColor:'themeColor',visualAccentColor:'accentColor',visualBackgroundColor:'backgroundColor',visualTextColor:'textColor',visualSurfaceColor:'surfaceColor',visualHeaderBgColor:'headerBgColor'};
  for(const [id,key] of Object.entries(m)){const el=$('#'+id);if(el)el.value=/^#[0-9a-f]{6}$/i.test(config[key]||'')?config[key]:'#ffffff';}for(const [id,key] of Object.entries({visualRadius:'radius',visualShadow:'shadowStrength',visualSectionSpacing:'sectionSpacing'})){const el=$('#'+id);if(el)el.value=config[key];const out=$('#'+id+'Value');if(out)out.textContent=config[key];}
}
function syncVisualIntroControls(){
  const vals={visualIntroLeftTitle:config.introLeftTitle||'',visualIntroLeftLabel:config.introLeftLabel||'ADMIT ONE',visualIntroRightTitle:config.introRightTitle||'ONLY\nEVENT',visualIntroRightLabel:config.introRightLabel||'',visualIntroButtonLabel:config.introButtonLabel||'进入活动官网 →',visualIntroBackgroundColor:config.introBackgroundColor||config.themeColor||'#ff5f91',visualIntroTicketColor:config.introTicketColor||'#ffffff',visualIntroInkColor:config.introInkColor||'#17151b',visualIntroHoldMs:config.introHoldMs||1500,visualIntroExitMs:config.introExitMs||620,visualIntroAnimationStyle:config.introAnimationStyle||'ticket'};for(const [id,v] of Object.entries(vals)){const el=$('#'+id);if(el)el.value=v;}const enabled=$('#visualIntroEnabled');if(enabled)enabled.checked=config.introAnimationEnabled!==false;const logo=$('#visualIntroLogoState');if(logo)logo.textContent=config.introLogoImage?'已上传 Logo':'未上传 Logo';}
function enterIntroEditor(){if(config.eventTemplate!=='ip-only')return;introEditorMode=true;activePreviewPage='index.html';const sel=$('#previewPage');if(sel)sel.value='index.html';previewScrollByPage.set('index.html',{y:0,ratio:0});openVisualInspector('intro');renderPreview(true);toast('01 模板开屏编辑：参数实时更新，只有点预览才播放动画');}
function leaveIntroEditor(){if(!introEditorMode)return;introEditorMode=false;renderPreview(true);}
function previewIntroAnimation(){if(config.eventTemplate!=='ip-only')return;introEditorMode=true;activePreviewPage='index.html';const sel=$('#previewPage');if(sel)sel.value='index.html';introPreviewOnce=true;previewScrollByPage.set('index.html',{y:0,ratio:0});renderPreview(true);toast('从头播放一次；下一次修改会回到静态开屏编辑');}
function applyVisualIntroChange(e){const el=e.target;if(!el?.id)return;if(el.id==='visualIntroEnabled')config.introAnimationEnabled=el.checked;else if(el.id==='visualIntroHoldMs'||el.id==='visualIntroExitMs')config[el.id==='visualIntroHoldMs'?'introHoldMs':'introExitMs']=Number(el.value);else{const map={visualIntroLeftTitle:'introLeftTitle',visualIntroLeftLabel:'introLeftLabel',visualIntroRightTitle:'introRightTitle',visualIntroRightLabel:'introRightLabel',visualIntroButtonLabel:'introButtonLabel',visualIntroBackgroundColor:'introBackgroundColor',visualIntroTicketColor:'introTicketColor',visualIntroInkColor:'introInkColor',visualIntroAnimationStyle:'introAnimationStyle'};if(!map[el.id])return;config[map[el.id]]=el.value;}markDirty();syncBaseInputs();renderPreview();}
function applyVisualEditMessage(d,rerender=true){
  if(!d||!visualEditMode)return;const value=String(d.value??'');
  if(d.kind==='base'&&['eventName','eventTagline','eventDate','eventLocation','venueText','transportText','entryText'].includes(d.key))config[d.key]=value;
  else if(d.kind==='label'&&d.key){config.ipOnlyLabels=config.ipOnlyLabels||{};config.ipOnlyLabels[d.key]=value;}
  else if(d.kind==='communityField'&&d.field){config.community=normalizeCommunity(config.community);if(['title','text','qqGroup','wechatGroup','linkLabel'].includes(d.field))config.community[d.field]=value;else return;}
  else if(d.kind==='objectField'&&d.objectKind&&d.field){const idx=Number(d.objectIndex);if(d.objectKind==='guest'&&config.guests?.[idx]&&['name','role','bio'].includes(d.field))config.guests[idx][d.field]=value;else if(d.objectKind==='booth'&&config.booths?.[idx]&&['code','name','category','note','description'].includes(d.field))config.booths[idx][d.field]=value;else if(d.objectKind==='schedule'&&config.schedule?.[idx]&&['time','title','stage','type','description'].includes(d.field))config.schedule[idx][d.field]=value;else if(d.objectKind==='ticket'&&config.ticketTypes?.[idx]&&['name','price','gift','note'].includes(d.field))config.ticketTypes[idx][d.field]=value;else if(d.objectKind==='sponsor'&&config.sponsors?.[idx]&&['name','type','note'].includes(d.field))config.sponsors[idx][d.field]=value;else if(d.objectKind==='project-card'&&['title','desc'].includes(d.field))setProjectCardPart(d.objectIndex,d.field,value);else return;}
  else if(d.kind==='ticket'&&config.ticketTypes?.[d.index]&&['name','price','gift','note'].includes(d.field))config.ticketTypes[d.index][d.field]=value;
  else if(d.kind==='schedule'&&config.schedule?.[d.index]&&['time','title','stage'].includes(d.field))config.schedule[d.index][d.field]=value;
  else if(d.kind==='homeTitle'&&config.homeSections?.[d.index])config.homeSections[d.index].title=value;
  else if(d.kind==='faq'&&config.faq?.[d.index]&&['q','a'].includes(d.field))config.faq[d.index][d.field]=value;
  else return;
  if(d.anchorSelector)pendingPreviewAnchor={selector:String(d.anchorSelector),top:Number(d.anchorTop)||0};
  markDirty();syncBaseInputs();renderSectionEditors();renderDataEditors();if(rerender)renderPreview();
}
function handleVisualCreate(kind){
  let openKind='',openIndex=0;
  if(kind==='ticket'){config.ticketTypes.push(normalizeTicketType({name:'普通票',price:'¥ 68',gift:'纪念票根 / 入场特典',note:'请按实际售票信息修改',published:true}));openKind='ticket';openIndex=config.ticketTypes.length-1;}
  else if(kind==='project'){config.homeSections.push(normalizeHomeSection({title:'限定企划',type:'cards',content:'主题打卡｜现场限定互动与纪念内容\n集章活动｜完成指定区域任务领取纪念特典\n特别展示｜活动当日限定展示内容'}));openKind='project-card';openIndex=`${config.homeSections.length-1}:0`;}
  else if(kind==='guest'){config.guests.push(normalizeGuest({name:'特邀嘉宾',role:'SPECIAL GUEST',bio:'点击继续完善嘉宾介绍'}));openKind='guest';openIndex=config.guests.length-1;}
  else if(kind==='booth'){config.booths.push(normalizeBooth({code:'A01',name:'新社团',category:'同人创作',description:'点击继续完善摊位与制品信息',published:true},config.booths.length));openKind='booth';openIndex=config.booths.length-1;}
  else if(kind==='schedule'){config.schedule.push(normalizeScheduleItem({time:'11:00',title:'开场舞台',stage:'MAIN STAGE',type:'舞台'}));openKind='schedule';openIndex=config.schedule.length-1;}
  else if(kind==='community'){config.community=normalizeCommunity({...config.community,title:'加入活动社群',text:'获取活动提醒、现场信息与临时公告。',qqGroup:'点击填写 QQ 群',wechatGroup:'点击填写微信群说明',linkLabel:'查看活动公告'});openVisualInspector('module','community');}
  else if(kind==='sponsor'){config.sponsors.push(normalizeSponsor({name:'合作方',type:'合作伙伴',note:'点击继续完善合作信息'}));openKind='sponsor';openIndex=config.sponsors.length-1;}
  else return;
  markDirty();renderSectionEditors();renderDataEditors();renderPreview(true);if(openKind)setTimeout(()=>openVisualInspector('object',openKind,openIndex),30);toast('已创建真实内容，可继续直接编辑');
}
async function handleVisualImage(key){
  if(!visualEditMode||!['heroImage','heroMobileImage','mapImage','transportImage','community.qqQrImage','community.wechatQrImage'].includes(key))return;
  pendingVisualImageKey=key;const input=$('#visualImageUpload');if(input){input.value='';input.click();}
}
function handleVisualSection(d){
  const i=Number(d.index);if(!Number.isInteger(i)||!config.homeSections?.[i])return;
  if(d.action==='hide'){config.homeSections.splice(i,1);toast('模块已从首页移除，可在“首页模块”中重新添加');}
  if(d.action==='up'&&i>0){const [x]=config.homeSections.splice(i,1);config.homeSections.splice(i-1,0,x);}
  if(d.action==='down'&&i<config.homeSections.length-1){const [x]=config.homeSections.splice(i,1);config.homeSections.splice(i+1,0,x);}
  if(d.action==='duplicate'){const x=normalizeHomeSection(clone(config.homeSections[i]));x.title=(x.title||'企划')+' · 副本';config.homeSections.splice(i+1,0,x);toast('已复制模块');}
  markDirty();renderAll();
}
function renderVisualModulePanel(selected=''){
  const list=$('#visualModuleList');if(!list)return;const order=Array.isArray(config.ipOnlyModuleOrder)?config.ipOnlyModuleOrder:[];const hidden=new Set(config.ipOnlyHiddenModules||[]);
  list.innerHTML=order.map((key,i)=>`<div class="visual-module-row ${selected===key?'selected':''}" data-key="${key}"><button class="visual-module-name" data-act="select">${esc(IP_ONLY_MODULE_LABELS[key]||key)}</button><button title="上移" data-act="up" ${i===0?'disabled':''}>↑</button><button title="下移" data-act="down" ${i===order.length-1?'disabled':''}>↓</button><button data-act="toggle">${hidden.has(key)?'显示':'隐藏'}</button></div>`).join('');
}
function visualInspectorInput(label,key,value='',type='text',wide=false){return `<label class="visual-field ${wide?'wide':''}"><span>${esc(label)}</span><input type="${type}" data-vmi-key="${escAttr(key)}" value="${escAttr(value??'')}"></label>`;}
function visualInspectorTextarea(label,key,value=''){return `<label class="visual-field wide"><span>${esc(label)}</span><textarea rows="3" data-vmi-key="${escAttr(key)}">${esc(value??'')}</textarea></label>`;}
function renderVisualModuleInspector(key){
  const root=$('#visualModuleInspectorControls');if(!root)return;const title=IP_ONLY_MODULE_LABELS[key]||key;let html=`<div class="visual-module-edit-head"><b>${esc(title)}</b><small>直接修改这里，预览会实时刷新。</small></div>`;
  if(key==='hero'){
    html+=`<div class="visual-field-grid">${visualInspectorInput('活动名称','eventName',config.eventName)}${visualInspectorInput('日期','eventDate',config.eventDate)}${visualInspectorInput('地点','eventLocation',config.eventLocation)}${visualInspectorTextarea('活动简介','eventTagline',config.eventTagline)}</div><div class="visual-inline-actions"><button data-vmi-action="image" data-image-key="heroImage">更换桌面 KV</button><button data-vmi-action="image" data-image-key="heroMobileImage">更换手机 KV</button></div>`;
  }else if(key==='tickets'){
    const items=config.ticketTypes||[];html+=`<div class="visual-repeat-list">${items.map((x,i)=>`<div class="visual-repeat-card" data-vmi-ticket="${i}"><div class="visual-field-grid">${visualInspectorInput('票种','ticket.name',x.name)}${visualInspectorInput('价格','ticket.price',x.price)}${visualInspectorTextarea('包含 / 特典','ticket.gift',x.gift)}${visualInspectorTextarea('说明','ticket.note',x.note)}</div><div class="visual-inline-actions"><label><input type="checkbox" data-vmi-ticket-published="${i}" ${x.published!==false?'checked':''}> 游客站展示</label><button data-vmi-action="delete-ticket" data-index="${i}" class="danger-lite">删除</button></div></div>`).join('')}</div><button class="visual-add-btn" data-vmi-action="add-ticket">＋ 添加票种</button>`;
  }else if(key==='projects'){
    const items=config.homeSections||[];html+=`<div class="visual-repeat-list">${items.map((x,i)=>`<div class="visual-repeat-card" data-vmi-project="${i}">${visualInspectorInput('企划标题','project.title',x.title)}${visualInspectorTextarea('内容','project.content',x.content)}<div class="visual-inline-actions"><select data-vmi-project-type="${i}"><option value="text" ${x.type==='text'?'selected':''}>文字</option><option value="cards" ${x.type==='cards'?'selected':''}>企划卡片</option><option value="image" ${x.type==='image'?'selected':''}>图片</option><option value="cta" ${x.type==='cta'?'selected':''}>行动按钮</option></select><button data-vmi-action="delete-project" data-index="${i}" class="danger-lite">删除</button></div></div>`).join('')}</div><button class="visual-add-btn" data-vmi-action="add-project">＋ 添加特别企划</button>`;
  }else if(key==='schedule'){
    const items=config.schedule||[];html+=`<div class="visual-repeat-list">${items.slice(0,12).map((x,i)=>`<div class="visual-repeat-card" data-vmi-schedule="${i}"><div class="visual-field-grid">${visualInspectorInput('时间','schedule.time',x.time)}${visualInspectorInput('节目','schedule.title',x.title)}${visualInspectorInput('舞台','schedule.stage',x.stage)}</div><button data-vmi-action="delete-schedule" data-index="${i}" class="danger-lite">删除</button></div>`).join('')}</div><button class="visual-add-btn" data-vmi-action="add-schedule">＋ 添加日程</button><button class="visual-secondary-btn" data-vmi-action="open-tab" data-tab="schedule">打开完整日程管理</button>`;
  }else if(key==='booths'){
    const pub=publishedBooths(config);html+=`<div class="visual-stat-row"><span>已发布摊位 <b>${pub.length}</b></span><span>已定位 <b>${pub.filter(({b})=>boothHasMapPoint(b)).length}</b></span></div><div class="visual-inline-actions"><button data-vmi-action="image" data-image-key="mapImage">更换场地图</button><button data-vmi-action="open-tab" data-tab="booths">管理摊位与点位</button></div>`;
  }else if(key==='community'){
    const d=config.community||{};html+=`<div class="visual-field-grid">${visualInspectorInput('区块标题','community.title',d.title)}${visualInspectorInput('QQ 群','community.qqGroup',d.qqGroup)}${visualInspectorInput('微信群说明','community.wechatGroup',d.wechatGroup)}${visualInspectorInput('按钮文字','community.linkLabel',d.linkLabel)}${visualInspectorInput('外部链接','community.link',d.link,'url',true)}${visualInspectorTextarea('说明','community.text',d.text)}</div><button class="visual-secondary-btn" data-vmi-action="open-tab" data-tab="site">打开二维码与完整社群设置</button>`;
  }else if(key==='guests'){
    html+=`<div class="visual-stat-row"><span>嘉宾 <b>${(config.guests||[]).length}</b></span></div><div class="visual-repeat-list">${(config.guests||[]).slice(0,8).map((g,i)=>`<div class="visual-repeat-card" data-vmi-guest="${i}"><div class="visual-field-grid">${visualInspectorInput('姓名','guest.name',g.name)}${visualInspectorInput('身份','guest.role',g.role)}</div></div>`).join('')}</div><button class="visual-add-btn" data-vmi-action="add-guest">＋ 添加嘉宾</button><button class="visual-secondary-btn" data-vmi-action="open-tab" data-tab="guests">打开完整嘉宾管理</button>`;
  }else if(key==='sponsors'){
    html+=`<div class="visual-stat-row"><span>合作方 <b>${(config.sponsors||[]).length}</b></span></div><button class="visual-secondary-btn" data-vmi-action="open-tab" data-tab="sponsors">打开赞助 / 合作管理</button>`;
  }else if(key==='passport'){
    html+=`<p class="visual-inspector-help">活动护照由当前开启的摊位、日程、指南和特别企划自动生成，不需要重复填写。</p><button class="visual-secondary-btn" data-vmi-action="open-modules">调整模块顺序 / 显示</button>`;
  }else{
    html+=`<p class="visual-inspector-help">这个模块暂时使用模块管理控制显示与排序。</p>`;
  }
  html+=key!=='hero'?`<div class="visual-module-footer-actions"><button data-vmi-action="module-up" data-key="${escAttr(key)}">↑ 上移模块</button><button data-vmi-action="module-down" data-key="${escAttr(key)}">↓ 下移模块</button><button data-vmi-action="module-toggle" data-key="${escAttr(key)}">${ipOnlyModuleHidden(config,key)?'显示模块':'隐藏模块'}</button></div>`:'';
  root.innerHTML=html;
}
function visualModuleMutationRefresh(key){markDirty();syncBaseInputs();renderSectionEditors();renderDataEditors();renderVisualModuleInspector(key);renderPreview();}
function handleVisualModuleInspectorInput(e){const el=e.target,key=el.dataset.vmiKey;if(!key)return;const value=el.value;const card=el.closest('[data-vmi-ticket],[data-vmi-project],[data-vmi-schedule],[data-vmi-guest]');if(key.startsWith('ticket.')&&card){const x=config.ticketTypes?.[Number(card.dataset.vmiTicket)];if(x)x[key.split('.')[1]]=value;}else if(key.startsWith('project.')&&card){const x=config.homeSections?.[Number(card.dataset.vmiProject)];if(x)x[key.split('.')[1]]=value;}else if(key.startsWith('schedule.')&&card){const x=config.schedule?.[Number(card.dataset.vmiSchedule)];if(x)x[key.split('.')[1]]=value;}else if(key.startsWith('guest.')&&card){const x=config.guests?.[Number(card.dataset.vmiGuest)];if(x)x[key.split('.')[1]]=value;}else if(key.startsWith('community.')){config.community=config.community||{};config.community[key.split('.')[1]]=value;}else if(['eventName','eventTagline','eventDate','eventLocation'].includes(key)){config[key]=value;}else return;markDirty();syncBaseInputs();renderSectionEditors();renderDataEditors();renderPreview();}
function handleVisualModuleInspectorClick(e){const b=e.target.closest('[data-vmi-action]');if(!b)return;const action=b.dataset.vmiAction;const current=$('#visualInspector')?.dataset.selectedModule||'';if(action==='image')return handleVisualImage(b.dataset.imageKey);if(action==='open-tab'){setVisualEditMode(false);exitPreview?.();setTab(b.dataset.tab||'site');return;}if(action==='open-modules')return openVisualInspector('modules');if(action==='add-ticket'){config.ticketTypes.push(normalizeTicketType({published:true}));return visualModuleMutationRefresh('tickets');}if(action==='delete-ticket'){config.ticketTypes.splice(Number(b.dataset.index),1);return visualModuleMutationRefresh('tickets');}if(action==='add-project'){config.homeSections.push(normalizeHomeSection({title:'新企划',type:'cards',content:'企划内容|说明'}));return visualModuleMutationRefresh('projects');}if(action==='delete-project'){config.homeSections.splice(Number(b.dataset.index),1);return visualModuleMutationRefresh('projects');}if(action==='add-schedule'){config.schedule.push(normalizeScheduleItem({time:'10:00',title:'新节目',stage:'MAIN STAGE'}));return visualModuleMutationRefresh('schedule');}if(action==='delete-schedule'){config.schedule.splice(Number(b.dataset.index),1);return visualModuleMutationRefresh('schedule');}if(action==='add-guest'){config.guests.push(normalizeGuest({name:'新嘉宾',role:''}));return visualModuleMutationRefresh('guests');}if(action==='module-up'||action==='module-down'||action==='module-toggle'){changeIpOnlyModule(b.dataset.key,action==='module-up'?'up':action==='module-down'?'down':'toggle');renderVisualModuleInspector(b.dataset.key);return;}}
function visualObjectTitle(kind,index){if(kind==='guest')return `嘉宾 · ${(config.guests?.[Number(index)]?.name||'未命名')}`;if(kind==='booth')return `摊位 · ${(config.booths?.[Number(index)]?.code||'')} ${(config.booths?.[Number(index)]?.name||'')}`.trim();if(kind==='schedule')return `日程 · ${(config.schedule?.[Number(index)]?.title||'未命名')}`;if(kind==='ticket')return `票种 · ${(config.ticketTypes?.[Number(index)]?.name||'未命名')}`;if(kind==='sponsor')return `合作方 · ${(config.sponsors?.[Number(index)]?.name||'未命名')}`;if(kind==='project-card'){const [si,ci]=String(index).split(':').map(Number),line=textLines(config.homeSections?.[si]?.content||'')[ci]||'';return `企划卡 · ${(line.split('|')[0]||'未命名')}`;}return '对象设置';}
function projectCardParts(index){const [si,ci]=String(index).split(':').map(Number),sec=config.homeSections?.[si],lines=textLines(sec?.content||''),raw=lines[ci]||'',parts=raw.split('|');return {si,ci,sec,lines,title:parts[0]||'',desc:parts.slice(1).join('|')||''};}
function setProjectCardPart(index,field,value){const p=projectCardParts(index);if(!p.sec)return;const title=field==='title'?value:p.title,desc=field==='desc'?value:p.desc;p.lines[p.ci]=desc?`${title}|${desc}`:title;p.sec.content=p.lines.join('\n');}
function renderVisualObjectInspector(kind,index){const root=$('#visualModuleInspectorControls');if(!root)return;let html=`<div class="visual-module-edit-head"><b>${esc(visualObjectTitle(kind,index))}</b><small>只修改你刚刚点中的这一项。</small></div>`;
  if(kind==='guest'){const x=config.guests?.[Number(index)];if(!x)return;html+=`<div class="visual-field-grid">${visualInspectorInput('姓名','name',x.name)}${visualInspectorInput('身份','role',x.role)}${visualInspectorTextarea('简介','bio',x.bio)}</div><div class="visual-inline-actions"><button data-voi-action="image" data-field="image">更换头像 / 图片</button><button data-voi-action="open-tab" data-tab="guests">完整嘉宾管理</button></div>`;}
  else if(kind==='booth'){const x=config.booths?.[Number(index)];if(!x)return;html+=`<div class="visual-field-grid">${visualInspectorInput('摊位号','code',x.code)}${visualInspectorInput('社团名','name',x.name)}${visualInspectorInput('分类','category',x.category)}${visualInspectorInput('标签','tags',x.tags)}${visualInspectorTextarea('一句话介绍','note',x.note)}${visualInspectorTextarea('详细介绍','description',x.description)}</div><div class="visual-inline-actions"><button data-voi-action="image" data-field="coverImage">更换社团图片</button><button data-voi-action="open-tab" data-tab="booths">制品 / 点位管理</button></div>`;}
  else if(kind==='schedule'){const x=config.schedule?.[Number(index)];if(!x)return;html+=`<div class="visual-field-grid">${visualInspectorInput('时间','time',x.time)}${visualInspectorInput('节目名','title',x.title)}${visualInspectorInput('舞台','stage',x.stage)}${visualInspectorInput('类型','type',x.type||'')}</div>`;}
  else if(kind==='ticket'){const x=config.ticketTypes?.[Number(index)];if(!x)return;html+=`<div class="visual-field-grid">${visualInspectorInput('票种','name',x.name)}${visualInspectorInput('价格','price',x.price)}${visualInspectorTextarea('包含 / 特典','gift',x.gift)}${visualInspectorTextarea('说明','note',x.note)}</div><label class="visual-check"><input type="checkbox" data-voi-published ${x.published!==false?'checked':''}> 游客站展示</label>`;}
  else if(kind==='sponsor'){const x=config.sponsors?.[Number(index)];if(!x)return;html+=`<div class="visual-field-grid">${visualInspectorInput('名称','name',x.name)}${visualInspectorInput('类型','type',x.type)}${visualInspectorTextarea('说明','note',x.note)}</div><div class="visual-inline-actions"><button data-voi-action="image" data-field="logo">更换 Logo</button><button data-voi-action="open-tab" data-tab="sponsors">完整合作管理</button></div>`;}
  else if(kind==='project-card'){const p=projectCardParts(index);if(!p.sec)return;html+=`<div class="visual-field-grid">${visualInspectorInput('卡片标题','title',p.title)}${visualInspectorTextarea('卡片说明','desc',p.desc)}</div><button data-voi-action="open-module" data-module="projects" class="visual-secondary-btn">编辑整个特别企划模块</button>`;}
  html+=`<div class="visual-object-footer-actions"><button class="danger-lite" data-voi-action="delete">删除这一项</button></div>`;root.innerHTML=html;root.dataset.objectKind=kind;root.dataset.objectIndex=String(index);}
function visualObjectRefresh(kind,index){markDirty();syncBaseInputs();renderSectionEditors();renderDataEditors();renderVisualObjectInspector(kind,index);renderPreview();}
function handleVisualObjectInspectorInput(e){const root=e.currentTarget,kind=root.dataset.objectKind,index=root.dataset.objectIndex,key=e.target.dataset.vmiKey;if(!kind||key===undefined)return;const value=e.target.value,idx=Number(index);if(kind==='guest'&&config.guests?.[idx])config.guests[idx][key]=value;else if(kind==='booth'&&config.booths?.[idx])config.booths[idx][key]=value;else if(kind==='schedule'&&config.schedule?.[idx])config.schedule[idx][key]=value;else if(kind==='ticket'&&config.ticketTypes?.[idx])config.ticketTypes[idx][key]=value;else if(kind==='sponsor'&&config.sponsors?.[idx])config.sponsors[idx][key]=value;else if(kind==='project-card')setProjectCardPart(index,key,value);else return;markDirty();renderPreview();}
function deleteVisualObject(kind,index){const idx=Number(index);if(kind==='guest')config.guests.splice(idx,1);else if(kind==='booth')config.booths.splice(idx,1);else if(kind==='schedule')config.schedule.splice(idx,1);else if(kind==='ticket')config.ticketTypes.splice(idx,1);else if(kind==='sponsor')config.sponsors.splice(idx,1);else if(kind==='project-card'){const p=projectCardParts(index);if(p.sec){p.lines.splice(p.ci,1);p.sec.content=p.lines.join('\n');}}else return;markDirty();renderAll();openVisualInspector('modules');toast('已删除');}
function handleVisualObjectInspectorClick(e){const b=e.target.closest('[data-voi-action]');if(!b)return;const root=e.currentTarget,kind=root.dataset.objectKind,index=root.dataset.objectIndex,action=b.dataset.voiAction;if(action==='image')return handleVisualObjectImage(kind,index,b.dataset.field);if(action==='open-tab'){setVisualEditMode(false);exitPreview?.();setTab(b.dataset.tab||'site');return;}if(action==='open-module')return openVisualInspector('module',b.dataset.module);if(action==='delete'){if(confirm('删除当前这一项？'))deleteVisualObject(kind,index);}}
let pendingVisualObjectImage=null;
async function handleVisualObjectImage(kind,index,field){if(!visualEditMode)return;pendingVisualObjectImage={kind,index,field};pendingVisualImageKey='';const input=$('#visualImageUpload');if(input){input.value='';input.click();}}
function elementStyleValue(key){const base={fontSize:0,fontWeight:0,textAlign:'',paddingY:0,paddingX:0,marginTop:0,marginBottom:0,width:0,radius:0,letterSpacing:0};return {...base,...(config.ipOnlyElementStyles?.[key]||{})};}
function renderVisualStyleInspector(key,label='选中元素'){const root=$('#visualStyleControls');if(!root)return;const v=elementStyleValue(key);root.dataset.styleKey=key;$('#visualStyleLabel').textContent=label||key;const values={visualElFontSize:v.fontSize,visualElFontWeight:v.fontWeight,visualElTextAlign:v.textAlign,visualElPaddingY:v.paddingY,visualElPaddingX:v.paddingX,visualElMarginTop:v.marginTop,visualElMarginBottom:v.marginBottom,visualElWidth:v.width,visualElRadius:v.radius,visualElLetterSpacing:v.letterSpacing};for(const [id,val] of Object.entries(values)){const el=$('#'+id);if(el)el.value=val??'';}updateVisualStyleOutputs();}
function updateVisualStyleOutputs(){for(const id of ['visualElFontSize','visualElPaddingY','visualElPaddingX','visualElMarginTop','visualElMarginBottom','visualElWidth','visualElRadius','visualElLetterSpacing']){const el=$('#'+id),out=$('#'+id+'Value');if(out)out.textContent=el?.value||'0';}}
function applyVisualElementStyle(){const root=$('#visualStyleControls'),key=root?.dataset.styleKey;if(!key)return;if(!config.ipOnlyElementStyles||typeof config.ipOnlyElementStyles!=='object')config.ipOnlyElementStyles={};config.ipOnlyElementStyles[key]={fontSize:Number($('#visualElFontSize')?.value)||0,fontWeight:Number($('#visualElFontWeight')?.value)||0,textAlign:$('#visualElTextAlign')?.value||'',paddingY:Number($('#visualElPaddingY')?.value)||0,paddingX:Number($('#visualElPaddingX')?.value)||0,marginTop:Number($('#visualElMarginTop')?.value)||0,marginBottom:Number($('#visualElMarginBottom')?.value)||0,width:Number($('#visualElWidth')?.value)||0,radius:Number($('#visualElRadius')?.value)||0,letterSpacing:Number($('#visualElLetterSpacing')?.value)||0};markDirty();updateVisualStyleOutputs();renderPreview();}
function resetVisualElementStyle(){const key=$('#visualStyleControls')?.dataset.styleKey;if(!key)return;delete config.ipOnlyElementStyles?.[key];markDirty();renderVisualStyleInspector(key,$('#visualStyleLabel')?.textContent||key);renderPreview(true);toast('已恢复模板默认样式');}
function openVisualInspector(mode='theme',selected='',extra=''){visualSelection={mode,key:selected||'',extra:extra??''};const p=$('#visualInspector');if(!p)return;p.classList.remove('hidden');p.dataset.mode=mode;p.dataset.selectedModule=selected||'';$('#visualInspectorTitle').textContent=mode==='intro'?'开屏动画':mode==='modules'?'页面模块':mode==='module'?(IP_ONLY_MODULE_LABELS[selected]||'模块设置'):mode==='object'?visualObjectTitle(selected,extra):mode==='style'?'元素样式':'主题样式';$('#visualThemeControls').classList.toggle('hidden',mode!=='theme');$('#visualIntroControls')?.classList.toggle('hidden',mode!=='intro');$('#visualModuleControls').classList.toggle('hidden',mode!=='modules');$('#visualModuleInspectorControls').classList.toggle('hidden',!['module','object'].includes(mode));$('#visualStyleControls')?.classList.toggle('hidden',mode!=='style');if(mode==='intro')syncVisualIntroControls();if(mode==='modules')renderVisualModulePanel(selected);if(mode==='module')renderVisualModuleInspector(selected);if(mode==='object')renderVisualObjectInspector(selected,extra);if(mode==='style')renderVisualStyleInspector(selected,extra);}
function changeIpOnlyModule(key,action){const order=config.ipOnlyModuleOrder||[];const i=order.indexOf(key);if(i<0)return;if(action==='up'&&i>0)[order[i-1],order[i]]=[order[i],order[i-1]];if(action==='down'&&i<order.length-1)[order[i+1],order[i]]=[order[i],order[i+1]];if(action==='toggle'){const h=new Set(config.ipOnlyHiddenModules||[]);h.has(key)?h.delete(key):h.add(key);config.ipOnlyHiddenModules=[...h];}markDirty();renderVisualModulePanel(key);renderPreview(true);}
function bindVisualEditor(){
  $('#visualUndoBtn')?.addEventListener('click',()=>restoreVisualHistory('undo'));$('#visualRedoBtn')?.addEventListener('click',()=>restoreVisualHistory('redo'));
  document.addEventListener('keydown',e=>{if(!visualEditMode)return;const tag=(e.target?.tagName||'').toLowerCase(),editing=e.target?.isContentEditable||['input','textarea','select'].includes(tag);if(editing)return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();restoreVisualHistory(e.shiftKey?'redo':'undo');}else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='y'){e.preventDefault();restoreVisualHistory('redo');}});
  $('#visualEditToggle')?.addEventListener('click',()=>setVisualEditMode(!visualEditMode));$('#visualThemeBtn')?.addEventListener('click',()=>{leaveIntroEditor();openVisualInspector('theme')});$('#visualModulesBtn')?.addEventListener('click',()=>{leaveIntroEditor();openVisualInspector('modules')});$('#visualIntroBtn')?.addEventListener('click',enterIntroEditor);$('#visualInspectorClose')?.addEventListener('click',()=>{leaveIntroEditor();$('#visualInspector')?.classList.add('hidden')});$('#visualModuleList')?.addEventListener('click',e=>{const b=e.target.closest('button[data-act]'),row=e.target.closest('[data-key]');if(!b||!row)return;const a=b.dataset.act;if(a==='select')return;changeIpOnlyModule(row.dataset.key,a);});
  $('#visualIntroControls')?.addEventListener('input',applyVisualIntroChange);$('#visualIntroControls')?.addEventListener('change',applyVisualIntroChange);$('#visualIntroPreviewBtn')?.addEventListener('click',previewIntroAnimation);$('#visualIntroLogoUpload')?.addEventListener('change',async e=>{const imgs=await loadImageFiles(e.target.files,1,{label:'开屏 Logo',aspect:'source',width:900});e.target.value='';if(!imgs[0])return;config.introLogoImage=imgs[0];markDirty();syncVisualIntroControls();renderPreview();toast('开屏 Logo 已更新；点击“预览动画”查看');});$('#visualIntroLogoClear')?.addEventListener('click',()=>{config.introLogoImage='';markDirty();syncVisualIntroControls();renderPreview();});
  $('#visualModuleInspectorControls')?.addEventListener('input',handleVisualModuleInspectorInput);$('#visualModuleInspectorControls')?.addEventListener('change',e=>{const p=e.target.dataset.vmiTicketPublished;if(p!==undefined){const x=config.ticketTypes?.[Number(p)];if(x){x.published=e.target.checked;visualModuleMutationRefresh('tickets')}}const t=e.target.dataset.vmiProjectType;if(t!==undefined){const x=config.homeSections?.[Number(t)];if(x){x.type=e.target.value;visualModuleMutationRefresh('projects')}}});$('#visualModuleInspectorControls')?.addEventListener('click',handleVisualModuleInspectorClick);
  $('#visualModuleInspectorControls')?.addEventListener('input',e=>{if($('#visualInspector')?.dataset.mode==='object')handleVisualObjectInspectorInput(e);});$('#visualModuleInspectorControls')?.addEventListener('change',e=>{if($('#visualInspector')?.dataset.mode!=='object')return;const root=e.currentTarget,kind=root.dataset.objectKind,index=Number(root.dataset.objectIndex);if(e.target.matches('[data-voi-published]')&&kind==='ticket'&&config.ticketTypes?.[index]){config.ticketTypes[index].published=e.target.checked;visualObjectRefresh(kind,index);}});$('#visualModuleInspectorControls')?.addEventListener('click',e=>{if($('#visualInspector')?.dataset.mode==='object')handleVisualObjectInspectorClick(e);});
  const map={visualThemeColor:'themeColor',visualAccentColor:'accentColor',visualBackgroundColor:'backgroundColor',visualTextColor:'textColor',visualSurfaceColor:'surfaceColor',visualHeaderBgColor:'headerBgColor'};
  for(const [id,key] of Object.entries(map))$('#'+id)?.addEventListener('input',e=>{config[key]=e.target.value;const base=$('#'+key);if(base)base.value=e.target.value;markDirty();renderPreview();});
  for(const [id,key] of Object.entries({visualRadius:'radius',visualShadow:'shadowStrength',visualSectionSpacing:'sectionSpacing'}))$('#'+id)?.addEventListener('input',e=>{config[key]=Number(e.target.value);const base=$('#'+key);if(base)base.value=config[key];const out=$('#'+id+'Value');if(out)out.textContent=config[key];markDirty();renderPreview();});for(const id of ['visualElFontSize','visualElFontWeight','visualElTextAlign','visualElPaddingY','visualElPaddingX','visualElMarginTop','visualElMarginBottom','visualElWidth','visualElRadius','visualElLetterSpacing'])$('#'+id)?.addEventListener('input',applyVisualElementStyle);$('#visualStyleReset')?.addEventListener('click',resetVisualElementStyle);
  $('#visualImageUpload')?.addEventListener('change',async e=>{const obj=pendingVisualObjectImage,key=pendingVisualImageKey;pendingVisualObjectImage=null;pendingVisualImageKey='';const ip01=config.eventTemplate==='ip-only';let aspect=key==='heroMobileImage'?3/4:key==='heroImage'&&ip01?1:key==='mapImage'?16/10:16/9,label=key==='mapImage'?'场地图':key==='heroImage'&&ip01?'01 模板桌面 KV':'主视觉',width=key==='heroMobileImage'?1000:key==='heroImage'&&ip01?1400:1800;if(obj){aspect=obj.kind==='guest'?4/3:obj.kind==='sponsor'?3/1:16/10;label=obj.kind==='guest'?'嘉宾图片':obj.kind==='sponsor'?'赞助商 Logo':'社团图片';width=1200;}const imgs=await loadImageFiles(e.target.files,1,{label,aspect,width});e.target.value='';if(!imgs[0])return;if(obj){const idx=Number(obj.index),x=obj.kind==='guest'?config.guests?.[idx]:obj.kind==='booth'?config.booths?.[idx]:obj.kind==='sponsor'?config.sponsors?.[idx]:null;if(!x)return;x[obj.field]=imgs[0];markDirty();renderDataEditors();renderVisualObjectInspector(obj.kind,obj.index);renderPreview(true);toast('图片已替换');return;}if(!key)return;if(key.startsWith('community.')){config.community=normalizeCommunity(config.community);config.community[key.split('.')[1]]=imgs[0];}else config[key]=imgs[0];markDirty();syncBaseInputs();renderPreview(true);toast('图片已替换');});
  window.addEventListener('message',e=>{const d=e.data||{};if(d.type==='cms-visual-edit')applyVisualEditMessage(d,true);else if(d.type==='cms-visual-edit-live')applyVisualEditMessage(d,false);else if(d.type==='cms-visual-image')handleVisualImage(d.key);else if(d.type==='cms-visual-create')handleVisualCreate(d.kind);else if(d.type==='cms-visual-object-image')handleVisualObjectImage(d.kind,d.index,d.field);else if(d.type==='cms-visual-object-select')openVisualInspector('object',d.kind,d.index);else if(d.type==='cms-visual-object-move')handleVisualObjectMove(d.kind,d.from,d.to);else if(d.type==='cms-visual-object-duplicate')duplicateVisualObject(d.kind,d.index);else if(d.type==='cms-visual-object-delete'){if(confirm('删除当前这一项？'))deleteVisualObject(d.kind,d.index);}else if(d.type==='cms-visual-object-nudge')nudgeVisualObject(d.kind,d.index,d.direction);else if(d.type==='cms-visual-map-move')handleVisualMapMove(d.index,d.mapX,d.mapY);else if(d.type==='cms-visual-section')handleVisualSection(d);else if(d.type==='cms-visual-module-select')openVisualInspector('module',d.key);else if(d.type==='cms-visual-module-move')handleVisualModuleMove(d.from,d.to);else if(d.type==='cms-visual-module-nudge')handleVisualModuleNudge(d.key,d.direction);else if(d.type==='cms-visual-module-hide')changeIpOnlyModule(d.key,'toggle');else if(d.type==='cms-visual-style-select')openVisualInspector('style',d.key,d.label);});
}
function moveArrayItemByIndex(arr,from,to){from=Number(from);to=Number(to);if(!Array.isArray(arr)||!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=arr.length||to>=arr.length||from===to)return false;const [x]=arr.splice(from,1);arr.splice(to,0,x);return true;}
function handleVisualModuleMove(from,to){const order=config.ipOnlyModuleOrder||[];const a=order.indexOf(String(from)),b=order.indexOf(String(to));if(a<0||b<0||a===b)return;if(moveArrayItemByIndex(order,a,b)){markDirty();renderVisualModulePanel(String(from));renderPreview(true);toast('模块顺序已更新');}}
function handleVisualObjectMove(kind,from,to){let changed=false;if(kind==='guest')changed=moveArrayItemByIndex(config.guests,from,to);else if(kind==='booth')changed=moveArrayItemByIndex(config.booths,from,to);else if(kind==='schedule')changed=moveArrayItemByIndex(config.schedule,from,to);else if(kind==='ticket')changed=moveArrayItemByIndex(config.ticketTypes,from,to);else if(kind==='sponsor')changed=moveArrayItemByIndex(config.sponsors,from,to);else if(kind==='project-card'){const [fsi,fci]=String(from).split(':').map(Number),[tsi,tci]=String(to).split(':').map(Number);if(fsi===tsi&&config.homeSections?.[fsi]){const lines=textLines(config.homeSections[fsi].content||'');if(moveArrayItemByIndex(lines,fci,tci)){config.homeSections[fsi].content=lines.join('\n');changed=true;}}}if(!changed)return;markDirty();renderSectionEditors();renderDataEditors();renderPreview(true);toast('卡片顺序已更新');}
function duplicateVisualObject(kind,index){const idx=Number(index);let inserted=-1;if(kind==='guest'&&config.guests?.[idx]){const x=normalizeGuest(clone(config.guests[idx]));x.id=clientId('guest');x.name=(x.name||'嘉宾')+' · 副本';config.guests.splice(idx+1,0,x);inserted=idx+1;}else if(kind==='booth'&&config.booths?.[idx]){const x=normalizeBooth(clone(config.booths[idx]),idx+1);x.id=clientId('booth');x.name=(x.name||'社团')+' · 副本';config.booths.splice(idx+1,0,x);inserted=idx+1;}else if(kind==='schedule'&&config.schedule?.[idx]){const x=normalizeScheduleItem(clone(config.schedule[idx]));x.id=clientId('schedule');x.title=(x.title||'节目')+' · 副本';config.schedule.splice(idx+1,0,x);inserted=idx+1;}else if(kind==='ticket'&&config.ticketTypes?.[idx]){const x=normalizeTicketType(clone(config.ticketTypes[idx]));x.name=(x.name||'票种')+' · 副本';config.ticketTypes.splice(idx+1,0,x);inserted=idx+1;}else if(kind==='sponsor'&&config.sponsors?.[idx]){const x=normalizeSponsor(clone(config.sponsors[idx]));x.id=clientId('sponsor');x.name=(x.name||'合作方')+' · 副本';config.sponsors.splice(idx+1,0,x);inserted=idx+1;}else if(kind==='project-card'){const p=projectCardParts(index);if(p.sec&&p.lines[p.ci]!==undefined){p.lines.splice(p.ci+1,0,p.lines[p.ci]);p.sec.content=p.lines.join('\n');inserted=`${p.si}:${p.ci+1}`;}}if(inserted===-1)return;markDirty();renderSectionEditors();renderDataEditors();renderPreview(true);toast('已复制');setTimeout(()=>openVisualInspector('object',kind,inserted),0);}
function nudgeVisualObject(kind,index,direction){let to;if(kind==='project-card'){const [si,ci]=String(index).split(':').map(Number),lines=textLines(config.homeSections?.[si]?.content||'');to=direction==='up'?ci-1:ci+1;if(to<0||to>=lines.length)return;handleVisualObjectMove(kind,index,`${si}:${to}`);return;}const arr=kind==='guest'?config.guests:kind==='booth'?config.booths:kind==='schedule'?config.schedule:kind==='ticket'?config.ticketTypes:kind==='sponsor'?config.sponsors:null;if(!arr)return;const idx=Number(index);to=direction==='up'?idx-1:idx+1;if(to<0||to>=arr.length)return;handleVisualObjectMove(kind,idx,to);}
function handleVisualModuleNudge(key,direction){const order=config.ipOnlyModuleOrder||[],idx=order.indexOf(String(key));if(idx<0)return;const to=direction==='up'?idx-1:idx+1;if(to<0||to>=order.length)return;handleVisualModuleMove(key,order[to]);}
function handleVisualMapMove(index,mapX,mapY){const i=Number(index),b=config.booths?.[i];if(!b)return;b.mapX=Math.max(0,Math.min(100,Number(mapX)||0));b.mapY=Math.max(0,Math.min(100,Number(mapY)||0));markDirty();renderDataEditors();renderBoothMapEditor();renderPreview(true);toast(`点位已更新 · ${b.mapX.toFixed(1)}%, ${b.mapY.toFixed(1)}%`);}
function previewAnchorSelector(el){
  if(!el)return '';
  if(el.id)return '#'+String(el.id).replace(/[^A-Za-z0-9_-]/g,'');
  if(el.dataset?.veModule)return `[data-ve-module="${String(el.dataset.veModule).replace(/"/g,'')}"]`;
  if(el.dataset?.veObjectKind&&el.dataset?.veObjectIndex!==undefined)return `[data-ve-object-kind="${String(el.dataset.veObjectKind).replace(/"/g,'')}"][data-ve-object-index="${String(el.dataset.veObjectIndex).replace(/"/g,'')}"]`;
  return '';
}
function readPreviewScroll(frame){
  try{
    const win=frame?.contentWindow,doc=frame?.contentDocument;
    const y=Math.max(0,win?.scrollY||doc?.documentElement?.scrollTop||doc?.body?.scrollTop||0);
    const h=Math.max(1,(doc?.documentElement?.scrollHeight||doc?.body?.scrollHeight||1)-(win?.innerHeight||0));
    let anchor=null,best=Infinity;
    doc?.querySelectorAll('[data-ve-module],section[id],header[id],footer[id],[data-ve-object-kind]').forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.bottom<0||r.top>(win?.innerHeight||0))return;
      const score=Math.abs(r.top-80);
      if(score<best){const selector=previewAnchorSelector(el);if(selector){best=score;anchor={selector,top:r.top};}}
    });
    return {y,ratio:h>0?Math.max(0,Math.min(1,y/h)):0,anchor};
  }catch{return {y:0,ratio:0,anchor:null};}
}
function restorePreviewScroll(frame,state){
  if(!frame||!state)return;
  const apply=()=>{try{
    const win=frame.contentWindow,doc=frame.contentDocument;
    if(!win||!doc)return;
    if(state.anchor?.selector){
      const el=doc.querySelector(state.anchor.selector);
      if(el){const delta=el.getBoundingClientRect().top-(Number(state.anchor.top)||0);if(Math.abs(delta)>.5)win.scrollBy(0,delta);return;}
    }
    const maxY=Math.max(0,(doc.documentElement?.scrollHeight||doc.body?.scrollHeight||0)-(win.innerHeight||0));
    const target=Math.max(0,Math.min(maxY,Number.isFinite(state.y)?state.y:maxY*(state.ratio||0)));
    win.scrollTo(0,target);
  }catch{}};
  apply();
  requestAnimationFrame(()=>{apply();requestAnimationFrame(apply)});
  [60,160,360,700,1200].forEach(ms=>setTimeout(apply,ms));
  try{frame.contentDocument?.fonts?.ready?.then(apply).catch(()=>{});frame.contentDocument?.querySelectorAll('img').forEach(img=>{if(!img.complete)img.addEventListener('load',apply,{once:true})});}catch{}
}
function renderPreview(immediate=false){
  clearTimeout(previewTimer);
  const run=()=>{
    const frame=$('#previewFrame');if(!frame)return;
    const page=activePreviewPage;
    try{if(frame.dataset.previewPage)previewScrollByPage.set(frame.dataset.previewPage,readPreviewScroll(frame))}catch{}
    const saved=previewScrollByPage.get(page);
    const restoreState=(saved&&typeof saved==='object')?saved:{y:Number(saved)||0,ratio:0};
    if(pendingPreviewAnchor){restoreState.anchor=pendingPreviewAnchor;pendingPreviewAnchor=null;}
    frame.dataset.previewPage=page;
    frame.addEventListener('load',()=>{restorePreviewScroll(frame,restoreState);requestAnimationFrame(fitPreview)},{once:true});
    frame.srcdoc=previewHtml(page);
    const select=$('#previewPage');const opt=select?[...select.options].find(o=>o.value===page):null;
    if($('#previewPageLabel'))$('#previewPageLabel').textContent=opt?opt.textContent:page;
  };
  if(immediate)run();else previewTimer=setTimeout(run,90);
}
function renderPortalGlobalArt(){
  const panel=$('#portalGlobalArtPanel');if(!panel)return;
  panel.classList.toggle('hidden',!['portal-global','event-portal'].includes(config.eventTemplate||''));
  if(!config.portalGlobalArt)config.portalGlobalArt={newsImages:[],exploreImages:[]};
  const groups=[['news',config.portalGlobalArt.newsImages||[],6],['explore',config.portalGlobalArt.exploreImages||[],10]];
  groups.forEach(([kind,arr,count])=>{for(let i=0;i<count;i++){const box=$(`#pg-${kind}-preview-${i}`);if(!box)continue;const src=arr[i]||'';box.style.backgroundImage=src?`url("${String(src).replace(/"/g,'%22')}")`:'';box.classList.toggle('empty',!src);}});
}
function bindPortalGlobalArt(){
  for(const [kind,count,label] of [['news',6,'资讯卡图片'],['explore',10,'活动内容卡图片']]){
    for(let i=0;i<count;i++){
      const input=$(`#pg-${kind}-upload-${i}`),clear=$(`#pg-${kind}-clear-${i}`);
      input?.addEventListener('change',async e=>{const a=await loadImageFiles(e.target.files,1,{label,aspect:16/9,width:1200});e.target.value='';if(!a[0])return;if(!config.portalGlobalArt)config.portalGlobalArt={newsImages:[],exploreImages:[]};const key=kind==='news'?'newsImages':'exploreImages';config.portalGlobalArt[key][i]=a[0];markDirty();renderPortalGlobalArt();renderPreview();});
      clear?.addEventListener('click',()=>{if(!config.portalGlobalArt)return;const key=kind==='news'?'newsImages':'exploreImages';config.portalGlobalArt[key][i]='';markDirty();renderPortalGlobalArt();renderPreview();});
    }
  }
}
function renderAll(rebuild=true){syncBaseInputs();syncTemplatePicker();renderVisualThemeControls();syncFeatureInputs();updateFeatureVisibility();updatePortalLinksFromConfig();renderSectionEditors();renderDataEditors();if(rebuild)rebuildPreviewOptions();renderPreview(true);}

function toast(message){let el=document.getElementById('uiToast');if(!el){el=document.createElement('div');el.id='uiToast';el.className='ui-toast';document.body.appendChild(el)}el.textContent=message;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1800);}
async function loadPortalLinks(){try{const d=await api('/api/system/links');portalLinks={visitor:d.visitor||location.origin+'/',scope:d.scope||'public',publicUrl:d.publicUrl||'',customVisitor:!!d.customVisitor};}catch{portalLinks={visitor:location.origin+'/',scope:'public'};}updatePortalLinksFromConfig();}
async function copyText(text,label='链接'){try{await navigator.clipboard.writeText(text);toast(`${label}已复制`)}catch{prompt(`复制${label}：`,text)}}






function renderPublicAccess(){}
$('#addSectionBtn').onclick=()=>{config.homeSections.push(normalizeHomeSection({title:'新区块',type:'text',content:'请输入内容'}));markDirty();renderAll()};
$('#addGuestBtn').onclick=()=>{config.guests.push(normalizeGuest({id:clientId('guest'),name:'',role:'',image:'',bio:'',works:[],links:[]}));openEditors.add(editorKey('guest',config.guests.length-1));markDirty();renderAll()};
$('#addBoothBtn').onclick=()=>{const i=config.booths.length;config.booths.push(normalizeBooth({id:clientId('booth'),code:`A${String(i+1).padStart(2,'0')}`,name:'',category:'',tags:'',note:'',description:'',contact:'',social:'',coverImage:'',published:true,products:[]},i));openEditors.add(editorKey('vendor',i));markDirty();renderAll();setTab('booths')};
$('#addScheduleBtn').onclick=()=>{config.schedule.push(normalizeScheduleItem({id:clientId('schedule'),day:'',time:'10:00',endTime:'',title:'',stage:'',type:'',description:'',participants:[]}));openEditors.add(editorKey('schedule',config.schedule.length-1));markDirty();renderAll()};
$('#addFaqBtn').onclick=()=>{config.faq.push({id:clientId('faq'),q:'',a:''});openEditors.add(editorKey('faq',config.faq.length-1));markDirty();renderAll()};
if($('#addSponsorBtn'))$('#addSponsorBtn').onclick=()=>{config.sponsors.push(normalizeSponsor({id:clientId('sponsor'),name:'',type:'',published:true}));openEditors.add(editorKey('sponsor',config.sponsors.length-1));markDirty();renderAll();setTab('sponsors')};
if($('#restoreManagementDefaultsBtn'))$('#restoreManagementDefaultsBtn').onclick=restoreManagementDefaults;
async function loadServerConfig(status='已从服务器同步'){const data=await api('/api/config');config=normalizeConfig(data.config||{});if(config.eventTemplate==='ip-only'&&!location.pathname.endsWith('/ip01.html')){location.replace('/admin/ip01.html');return;}visualHistorySnapshot=JSON.stringify(config);visualUndoStack=[];visualRedoStack=[];updateVisualHistoryButtons();session={role:'organizer',username:data.session.username};if($('#publishStateBadge')){const p=data.project||{},text=!p.publishedAt?'草稿':p.hasUnpublishedChanges?'有未发布修改':'已发布';$('#publishStateBadge').textContent=text;$('#publishStateBadge').className='badge '+(text==='已发布'?'published':'');}adminSelectedBooth=Math.max(0,Math.min(adminSelectedBooth,Math.max(0,config.booths.length-1)));applyRole();markSaved(status);await loadPortalLinks();}
function cleanBackupConfig(){
  const c=clone(config);for(const b of c.booths||[]){delete b._newPassword;}delete c.organizerPin;return c;
}
function portableConfigAndPaths(){
  const c=clone(config), paths=new Set();
  const walk=v=>{
    if(Array.isArray(v))return v.map(walk);
    if(v&&typeof v==='object'){for(const k of Object.keys(v))v[k]=walk(v[k]);return v;}
    if(typeof v==='string'&&v.startsWith('/uploads/')){paths.add(v);return v.slice(1);}
    return v;
  };
  return {config:walk(c),paths:[...paths]};
}
function staticPageNames(c=config){
  const names=['index.html'];
  if(featureEnabled('guests',c))names.push('guests.html');
  if(featureEnabled('booths',c))names.push('booths.html');
  if(featureEnabled('schedule',c))names.push('schedule.html');
  if(featureEnabled('guide',c))names.push('guide.html');
  if(featureEnabled('faq',c))names.push('faq.html');
  if(featureEnabled('sponsors',c))names.push('sponsors.html');
  if(featureEnabled('booths',c))c.booths.forEach((b,i)=>{if(b.published!==false)names.push(boothPageName(i))});
  return names;
}

function staticMimeFromPath(path,type=''){
  if(type)return type.split(';')[0]||'application/octet-stream';
  const ext=String(path||'').split('?')[0].split('.').pop().toLowerCase();
  return ({png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',webp:'image/webp',ico:'image/x-icon',woff:'font/woff',woff2:'font/woff2',ttf:'font/ttf',otf:'font/otf'})[ext]||'application/octet-stream';
}
async function blobToDataUrl(blob){
  return await new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(String(fr.result||''));fr.onerror=()=>reject(fr.error||new Error('读取资源失败'));fr.readAsDataURL(blob)});
}
function inlineJsonForHtml(value){
  return JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
}
function stripVisualEditorArtifacts(html=''){
  return String(html||'')
    .replace(/\sdata-ve-[\w-]+=(?:"[^"]*"|'[^']*')/g,'')
    .replace(/\sclass=("|')([^"']*)\1/g,(m,q,cls)=>{const clean=cls.split(/\s+/).filter(x=>x&&!/^ve-(?:object-selected|selected|dragging|drop-target)$/.test(x)).join(' ');return clean?` class=${q}${clean}${q}`:''});
}
async function buildStandaloneVisitorHtml(){
  const portable=portableConfigAndPaths();
  const pageNames=staticPageNames(portable.config);
  const pages={};
  for(const name of pageNames)pages[name]=stripVisualEditorArtifacts(buildPage(name,portable.config));

  const assets={};
  for(const url of portable.paths){
    try{
      const r=await fetch(url,{cache:'no-store'});if(!r.ok)continue;
      let blob=await r.blob();
      if(!blob.type)blob=new Blob([await blob.arrayBuffer()],{type:staticMimeFromPath(url,r.headers?.get?.('content-type')||'')});
      const data=await blobToDataUrl(blob),rel=url.replace(/^\/+/, '');
      assets[rel]=data;assets['/'+rel]=data;
    }catch{}
  }

  const title=portable.config.eventName||'漫展游客网站';
  const pagesJson=inlineJsonForHtml(pages),assetsJson=inlineJsonForHtml(assets);
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(portable.config.seoTitle||title)}</title>
<meta name="description" content="${escAttr(portable.config.seoDescription||portable.config.eventTagline||'')}">
<meta property="og:title" content="${escAttr(portable.config.seoTitle||title)}">
<meta property="og:description" content="${escAttr(portable.config.seoDescription||portable.config.eventTagline||'')}">
${(portable.config.shareImage||portable.config.heroImage)?`<meta property="og:image" content="${escAttr(portable.config.shareImage||portable.config.heroImage)}">`:''}
${portable.config.faviconImage?`<link rel="icon" href="${escAttr(portable.config.faviconImage)}">`:''}
<style>html,body{width:100%;height:100%;margin:0;background:#fff;overflow:hidden}#siteFrame{display:block;width:100%;height:100%;border:0;background:#fff}#standaloneError{display:none;font:14px/1.7 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;padding:32px;color:#333}</style>
</head>
<body>
<iframe id="siteFrame" title="${escAttr(title)}"></iframe>
<div id="standaloneError"></div>
<script>
const PAGES=${pagesJson};
const ASSETS=${assetsJson};
const frame=document.getElementById('siteFrame'),errorBox=document.getElementById('standaloneError');
let currentPage='index.html',pendingFragment='';
function withEmbeddedAssets(html){let out=String(html||'');const keys=Object.keys(ASSETS).sort((a,b)=>b.length-a.length);for(const key of keys)out=out.split(key).join(ASSETS[key]);return out}
function parseTarget(raw){let v=String(raw||'index.html');const h=v.indexOf('#');return {page:(h>=0?v.slice(0,h):v)||currentPage,fragment:h>=0?v.slice(h+1):''}}
function pageFromHash(){const h=location.hash.replace(/^#/,'');if(!h.startsWith('page='))return {page:'index.html',fragment:''};try{return parseTarget(decodeURIComponent(h.slice(5)))}catch{return {page:'index.html',fragment:''}}}
function showPage(target,pushHash=true){const t=parseTarget(target);if(!PAGES[t.page])t.page='index.html';currentPage=t.page;pendingFragment=t.fragment||'';if(pushHash){const wanted='#page='+encodeURIComponent(currentPage+(pendingFragment?'#'+pendingFragment:''));if(location.hash!==wanted)history.pushState(null,'',wanted)}frame.srcdoc=withEmbeddedAssets(PAGES[currentPage])}
function hookFrame(){try{const doc=frame.contentDocument;if(!doc)return;doc.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a)return;const raw=a.getAttribute('href')||'';if(!raw||raw.startsWith('#')||/^(https?:|mailto:|tel:|javascript:|data:)/i.test(raw))return;const clean=raw.split('?')[0],pagePart=clean.split('#')[0];if(PAGES[pagePart]){e.preventDefault();showPage(clean,true)}},true);if(pendingFragment){const id=decodeURIComponent(pendingFragment);requestAnimationFrame(()=>doc.getElementById(id)?.scrollIntoView())}}catch(err){errorBox.style.display='block';errorBox.textContent='页面已生成，但当前浏览器限制了预览：'+err.message}}
frame.addEventListener('load',hookFrame);
addEventListener('popstate',()=>{const t=pageFromHash();showPage(t.page+(t.fragment?'#'+t.fragment:''),false)});
addEventListener('hashchange',()=>{const t=pageFromHash();if(t.page!==currentPage||t.fragment!==pendingFragment)showPage(t.page+(t.fragment?'#'+t.fragment:''),false)});
const initial=pageFromHash();showPage(initial.page+(initial.fragment?'#'+initial.fragment:''),false);
</script>
</body>
</html>`;
}
function standaloneVisitorFilename(){
  const raw=String(config.eventName||'漫展游客网站').trim().replace(/[\\/:*?"<>|]/g,'-').replace(/\s+/g,' ').slice(0,60);
  return `${raw||'漫展游客网站'}-游客网站.html`;
}




if($('#saveBtn'))$('#saveBtn').onclick=async()=>{const button=$('#saveBtn'),old=button.textContent;button.disabled=true;button.textContent='保存中…';setSaveStatus('正在保存','dirty');try{clearTimeout(autoSaveTimer);clearTimeout(autoSaveRetryTimer);const data=await putOrganizerConfig(clone(config));config=normalizeConfig(data.config);autoSaveFailureCount=0;applyRole();markSaved('已保存到服务器');}catch(err){setSaveStatus('保存失败','dirty');alert(`保存失败：${err.message}`)}finally{button.disabled=false;button.textContent=old;}};
if($('#loadBtn'))$('#loadBtn').onclick=async()=>{try{await loadServerConfig('已刷新')}catch(err){alert(`读取失败：${err.message}`)}};
if($('#resetBtn'))$('#resetBtn').onclick=async()=>{if(!confirm('确定清空当前项目的页面设置？活动内容会被覆盖。'))return;try{const data=await api('/api/reset',{method:'POST'});config=normalizeConfig(data.config);adminSelectedBooth=0;activePreviewPage='index.html';applyRole();markSaved('已重置')}catch(err){alert(`重置失败：${err.message}`)}};
$$('[data-scroll-publish]').forEach(btn=>btn.addEventListener('click',()=>{const el=document.getElementById(btn.dataset.scrollPublish);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}));



// 发布逻辑位于 publishing.js
if($('#addExternalLinkBtn'))$('#addExternalLinkBtn').onclick=()=>{config.externalLinks.push({id:clientId('link'),kind:'link',label:'',url:''});markDirty();renderExternalLinks()};
if($('#addTicketTypeBtn'))$('#addTicketTypeBtn').onclick=()=>{config.ticketTypes.push(normalizeTicketType({name:'',price:'',gift:'',note:'',published:true}));markDirty();renderTicketTypes();renderPreview()};
if($('#shareImageUpload'))$('#shareImageUpload').onchange=async e=>{const a=await loadImageFiles(e.target.files,1,{label:'分享封面',aspect:1.91,width:1200});e.target.value='';if(a[0]){config.shareImage=a[0];markDirty();renderBrandAssets();renderPreview()}};
if($('#clearShareImageBtn'))$('#clearShareImageBtn').onclick=()=>{config.shareImage='';markDirty();renderBrandAssets();renderPreview()};
if($('#faviconUpload'))$('#faviconUpload').onchange=async e=>{const a=await loadImageFiles(e.target.files,1,{label:'网站图标',aspect:1,width:256});e.target.value='';if(a[0]){config.faviconImage=a[0];markDirty();renderBrandAssets();renderPreview()}};
if($('#clearFaviconBtn'))$('#clearFaviconBtn').onclick=()=>{config.faviconImage='';markDirty();renderBrandAssets();renderPreview()};
if($('#heroUpload'))$('#heroUpload').onchange=async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{const ip01=config.eventTemplate==='ip-only',cropped=await cropImageFile(file,{label:ip01?'01 模板桌面 KV':'首页主视觉',aspect:ip01?1:16/9,width:ip01?1400:1920});if(!cropped)return;config.heroImage=await uploadImageFile(cropped);markDirty();renderAll();toast(ip01?'01 模板桌面 KV 已按实际 1:1 展示范围保存；手机版请单独上传 3:4 KV':'桌面主视觉已更新；手机版请单独上传 3:4 主视觉')}catch(err){alert(err.message)}};
if($('#clearHeroBtn'))$('#clearHeroBtn').onclick=()=>{config.heroImage='';markDirty();renderAll()};
if($('#heroMobileUpload'))$('#heroMobileUpload').onchange=async e=>{const a=await loadImageFiles(e.target.files,1,{label:'手机版主视觉',aspect:3/4,width:1080});e.target.value='';if(a[0]){config.heroMobileImage=a[0];markDirty();renderAll();toast('手机版主视觉已更新')}};
if($('#clearHeroMobileBtn'))$('#clearHeroMobileBtn').onclick=()=>{config.heroMobileImage='';markDirty();renderAll();toast('手机版主视觉已清除；未上传时使用桌面图')};
if($('#pageBannerUpload'))$('#pageBannerUpload').onchange=async e=>{const a=await loadImageFiles(e.target.files,1,{label:'内页 Banner',aspect:4,width:1920});e.target.value='';if(a[0]){config.pageBannerImage=a[0];markDirty();renderAll();toast('内页 Banner 已更新，可在下方预览或切换到任意内页查看')}};
if($('#clearPageBannerBtn'))$('#clearPageBannerBtn').onclick=()=>{config.pageBannerImage='';markDirty();renderAll()};
$('#mapUpload').onchange=async e=>{const arr=await loadImageFiles(e.target.files,1,{label:'场馆地图',aspect:'source',width:1800});if(arr[0]){config.mapImage=arr[0];markDirty();renderAll()}e.target.value='';};
$('#clearMapBtn').onclick=()=>{config.mapImage='';markDirty();renderAll()};
if($('#transportUpload'))$('#transportUpload').onchange=async e=>{const arr=await loadImageFiles(e.target.files,1,{label:'交通示意图',aspect:16/9,width:1600});if(arr[0]){config.transportImage=arr[0];markDirty();renderAll()}e.target.value='';};
if($('#clearTransportImageBtn'))$('#clearTransportImageBtn').onclick=()=>{config.transportImage='';markDirty();renderAll()};
$('#previewPage').onchange=e=>{activePreviewPage=e.target.value;renderPreview(true)};
$('#deviceSwitch').onclick=e=>{const b=e.target.closest('button[data-device]');if(!b)return;setPreviewDevice(b.dataset.device)};
$('#openPreviewBtn').onclick=()=>{const w=window.open();if(!w)return alert('浏览器阻止了新窗口，请允许弹窗。');w.document.open();w.document.write(buildPage(activePreviewPage));w.document.close()};
function enterPreview(){
  const mode=$('#previewMode');if(!mode)return;
  rebuildPreviewOptions(true);renderPreview(true);
  mode.classList.remove('hidden');mode.setAttribute('aria-hidden','false');document.body.classList.add('preview-mode-open');
  setTimeout(fitPreview,0);
}
function exitPreview(){
  const mode=$('#previewMode');if(!mode)return;
  mode.classList.add('hidden');mode.setAttribute('aria-hidden','true');document.body.classList.remove('preview-mode-open');
}
if($('#globalPreviewToggle'))$('#globalPreviewToggle').onclick=enterPreview;
if($('#exitPreviewBtn'))$('#exitPreviewBtn').onclick=exitPreview;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#previewMode')?.classList.contains('hidden'))exitPreview()});
window.addEventListener('message',e=>{
  const d=e.data||{};if(d.type!=='cms-preview-nav'||typeof d.href!=='string')return;
  const target=d.href.split(/[?#]/)[0].replace(/^\.?\//,'');
  const select=$('#previewPage');if(select&&[...select.options].some(o=>o.value===target)){activePreviewPage=target;select.value=target;renderPreview(true)}
});
if($('#copyVisitorLink'))$('#copyVisitorLink').onclick=()=>copyText($('#visitorSiteLink').value,'游客网站链接');
if($('#openVisitorLink'))$('#openVisitorLink').onclick=()=>window.open($('#visitorSiteLink').value,'_blank','noopener');
addEventListener('resize',()=>requestAnimationFrame(fitPreview));
$('#collapseBtn').onclick=()=>document.body.classList.toggle('nav-collapsed');

if($('#topCopyVisitor'))$('#topCopyVisitor').onclick=()=>copyText(portalLinks.visitor||location.origin+'/','游客网站链接');
if($('#topOpenVisitor'))$('#topOpenVisitor').onclick=()=>window.open(portalLinks.visitor||location.origin+'/','_blank','noopener');

async function bootstrap(){
  bindBaseInputs();bindGlobalCropTool();bindFeatureInputs();bindPortalGlobalArt();bindTemplatePicker();bindVisualEditor();bindCommunityInputs();rebuildPreviewOptions();
  const directVisual=new URLSearchParams(location.search).get('visual')==='1';
  try{
    const me=await api('/api/session');if(!me.authenticated||me.role!=='organizer'){location.href='/admin/';return;}
    await loadServerConfig('已连接 · 修改会自动保存');
    if(config.eventTemplate==='ip-only'){
      const qs=new URLSearchParams(location.search),introOnCreate=qs.get('intro')==='once';
      setTab('site');
      setVisualEditMode(true);
      if(introOnCreate)introPreviewOnce=true;
      enterPreview();
      if(directVisual||introOnCreate)history.replaceState(null,'',location.pathname);
    }
  }catch(err){setSaveStatus('服务器连接失败','dirty');document.documentElement.classList.remove('visual-entry-pending');alert(`无法连接后端：${err.message}`)}
  finally{document.documentElement.classList.remove('visual-entry-pending');}
}
bootstrap();
