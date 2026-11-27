export function migrateProjectState({state,template,storageKey,writeJson,uid,customPageLayouts,guideOldPlaceholderText}){
if(state.edition===undefined||state.edition==='首届')state.edition=template.defaults.edition;
if(state.navigationUrl===undefined)state.navigationUrl=template.defaults.navigationUrl;
if(state.modules?.activities===undefined&&state.modules?.stage!==undefined){state.modules.activities=state.modules.stage;delete state.modules.stage}
if(!state.guide||!Array.isArray(state.guide.items))state.guide=structuredClone(template.defaults.guide);
const shouldSeedGuide=!state.guideSeedVersion;
state.guide.items=(state.guide.items||[]).map((x,i)=>{
 const preset=x.preset||template.defaults.guide.items[i]?.preset||'custom';
 const defaultLabel={traffic:'ACCESS',admission:'ENTRY',facilities:'FACILITY',cosplay:'COSPLAY',safety:'SAFETY'}[preset]||'GUIDE';
 const item={image:'',label:defaultLabel,preset,...x};
 const oldText=guideOldPlaceholderText[preset],currentText=String(item.text||'').trim();
 if(shouldSeedGuide&&(oldText&&currentText===oldText||!currentText)){
   const example=template.defaults.guide.items.find(row=>row.preset===preset)?.text||'';
   if(example)item.text=example;
 }
 return item;
});
if(shouldSeedGuide)state.guideSeedVersion=1;
if(!Array.isArray(state.tickets))state.tickets=structuredClone(template.defaults.tickets);
if(state.ticketUrl===undefined)state.ticketUrl=template.defaults.ticketUrl;
if(state.ticketLinkLabel===undefined)state.ticketLinkLabel=template.defaults.ticketLinkLabel;
if(!Array.isArray(state.ribbonItems)){
 const legacy=[state.ribbon1,state.ribbon2,state.ribbon3,state.ribbon4].map(x=>String(x||'').trim()).filter(Boolean);
 state.ribbonItems=(legacy.length?legacy:template.defaults.ribbonItems.map(x=>x.text)).map((text,i)=>({id:'rb'+(i+1),text}));
}
delete state.ribbon1;delete state.ribbon2;delete state.ribbon3;delete state.ribbon4;
if(state.modules&&'passport' in state.modules)delete state.modules.passport;
if(!Array.isArray(state.participation))state.participation=structuredClone(template.defaults.participation);
if(!Array.isArray(state.guests))state.guests=[];
if(!state.guestSeedVersion){
 // New projects already inherit template defaults before saved state is merged.
 // If an older saved project explicitly has guests: [], preserve that user choice.
 state.guestSeedVersion=1;
}
if(!state.guestTypeVersion){
 const oldNames=['星野 澪','林 夏','KUROHA','Aoi'];
 const isOldSample=(state.guests||[]).length===4&&(state.guests||[]).every((g,i)=>g?.name===oldNames[i]&&!g?.guestType);
 if(isOldSample)state.guests=structuredClone(template.defaults.guests||[]);
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
if(!Array.isArray(state.customPages))state.customPages=structuredClone(template.defaults.customPages||[]);
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
   title:p.title||'自定义页面',
   eyebrow:p.eyebrow||'SPECIAL',
   intro:p.intro||'',
   items:Array.isArray(p.items)?p.items:[],
   ...p,
   preset:legacyPreset,
   layout:p.layout||customPageLayouts[legacyPreset]||'gallery'
 };
});
if(!state.venueMap)state.venueMap=structuredClone(template.defaults.venueMap);
if(!Array.isArray(state.venueMap.links))state.venueMap.links=structuredClone(template.defaults.venueMap.links);
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
 writeJson(storageKey,state)
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
if(state.templateId==='04-creator-catalogue')state.modules.explore=false;
for(const k of ['booths','activities','guide','freewalk','itasha','ribbon','guests','community','sponsors']){
 if(state.modules[k]===undefined)state.modules[k]=template.defaults.modules?.[k]!==false;
}
if(!state.venueMap)state.venueMap=structuredClone(template.defaults.venueMap);
if(!Array.isArray(state.updates))state.updates=structuredClone(template.defaults.updates);
state.updates=(state.updates||[]).map(item=>({...item,target:({passport:'activities','guide-home':'guide'}[item.target]||item.target||'top')}));
if(!Array.isArray(state.socialLinks))state.socialLinks=structuredClone(template.defaults.socialLinks);
if(!Array.isArray(state.sponsors))state.sponsors=structuredClone(template.defaults.sponsors);
if(state.sponsors.length===1){
 const x=state.sponsors[0]||{};
 if(String(x.name||'').trim()==='合作伙伴'&&String(x.level||'').trim()==='合作伙伴'&&!String(x.url||'').trim()&&!String(x.logo||'').trim())state.sponsors=[];
}
state.booths=(state.booths||[]).map(b=>{const next={id:b.id||uid('b'),no:b.no||'',name:b.name||'',logo:b.logo||'',type:b.type||'',intro:b.intro||'',...b,products:Array.isArray(b.products)?b.products:[]};next.products=(next.products||[]).map(p=>({id:p.id||uid('p'),name:p.name||'',tag:'',price:p.price||'',note:p.note||'',image:p.image||'',...p}));delete next.pointId;return next});
state.guests=(state.guests||[]).map(g=>({id:g.id||uid('g'),guestType:g.guestType||'person',name:g.name||'',role:g.role||'',members:g.members||'',attendanceNote:g.attendanceNote||'',works:g.works||'',intro:g.intro||'',image:g.image||'',socialLinks:Array.isArray(g.socialLinks)?g.socialLinks:[],...g}));
state.schedule=(state.schedule||[]).map(a=>{const next={id:a.id||uid('s'),day:a.day||'DAY 1',time:a.time||'',endTime:a.endTime||'',title:a.title||'',stage:a.stage||'',detail:a.detail||'',category:a.category||'',guestIds:Array.isArray(a.guestIds)?a.guestIds:[],participationId:a.participationId||'',registrationUrl:a.registrationUrl||'',...a};next.guestIds=Array.isArray(a.guestIds)?a.guestIds:[];next.participationId=a.participationId||'';delete next.locationId;return next});
  return state;
}
