export function createCollectionPanel({ $, state, contentManagerMeta, collectionArray, setInspector, setPageContentActive, renderStudioCollectionRows, esc, presetEntriesFor, contentThumb, openItemInspector, checkpoint, uid, save, send, GUIDE_PRESETS, PARTICIPATION_PRESETS, setLast, syncContentCounts, syncModuleControls }){
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

function openCollectionManager(collection,selectedIndex=-1){
  setLast(collection,selectedIndex);
  if(selectedIndex<0){const m=contentManagerMeta[collection];if(m)try{setInspector('内容',m.title,'<div class="inspector-note">选择左侧条目开始编辑</div>')}catch(e){}}
 if(collection==='explore'&&state.templateId==='04-creator-catalogue')return;
 const meta=contentManagerMeta[collection],arr=collectionArray(collection),panel=$('#contentListPanel');if(!meta||!Array.isArray(arr)||!panel)return;
 document.querySelectorAll('[data-content-manager]').forEach(x=>x.classList.toggle('active',x.dataset.contentManager===collection));
 setPageContentActive({collection});
 const rows=renderStudioCollectionRows(arr,{escape:esc,selected:selectedIndex,item:meta.item,thumbnail:item=>contentThumb(collection,item)});
 const guidePresets=collection==='guide'?'<div class="preset-add"><span>常用预设</span><div>'+presetEntriesFor('guide').map(([key,x])=>'<button type="button" data-add-preset="'+key+'">'+esc(x.title)+'</button>').join('')+'</div></div>':'';
 const activityPresets=collection==='participation'?'<div class="preset-add"><span>常用活动</span><div>'+presetEntriesFor('participation').map(([key,x])=>'<button type="button" data-add-preset="'+key+'">'+esc(x.title)+'</button>').join('')+'</div></div>':'';
 const addLabel=collection==='guide'?'＋ 添加自定义指南':collection==='participation'?'＋ 添加自定义活动':'＋ 添加'+meta.title;
 const addButton=(collection==='featuredActivities'&&String(state.templateId)!=='08-birthday')?'':'<button type="button" class="sidebar-content-add" data-sidebar-content-add>'+addLabel+'</button>';
 panel.innerHTML='<div class="sidebar-content-head"><div><b>'+esc(meta.title)+'</b><span>'+arr.length+' 项</span></div>'+(arr.length>6?'<label class="sidebar-content-search"><span>⌕</span><input type="search" placeholder="'+esc(collection==='booths'?'搜索社团，或制品名称 / Tag':'搜索'+meta.title)+'" data-sidebar-content-search></label>':'')+'</div>'+guidePresets+activityPresets+'<div class="sidebar-content-rows">'+(rows||'<div class="sidebar-content-empty">'+esc(meta.empty)+'</div>')+'</div>'+addButton;
 panel.querySelectorAll('[data-open-item]').forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.openItem);panel.querySelectorAll('[data-open-item]').forEach(x=>x.classList.toggle('active',x===btn));openItemInspector(collection,i)});
 panel.querySelectorAll('[data-add-preset]').forEach(btn=>btn.onclick=()=>addPresetItem(collection,btn.dataset.addPreset));
 panel.querySelector('[data-sidebar-content-add]')?.addEventListener('click',()=>mutateItem(collection,arr.length-1,'add'));
 panel.querySelector('[data-sidebar-content-search]')?.addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();panel.querySelectorAll('[data-open-item]').forEach(row=>row.hidden=!!q&&!String(row.dataset.search||'').includes(q))});
}

  return {openCollectionManager, addPresetItem};
}
