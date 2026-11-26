export function createCustomPages(ctx){
  const { $, inspector, getState, getCurrentPage, customPageKey, customPageIndex, customPageFieldLabels, CUSTOM_PAGE_PRESETS, CUSTOM_PAGE_LAYOUTS, buildCustomPageStarterItems, uid, checkpoint, save, send, setStudioPage, syncStudioPageUI, syncContentCounts, toast, showInspectorEmpty, bindInspectorStateInput, setInspector, esc, customPageRowsHtml, customPageSettingsHtml, customPageItemsPanelHtml, customPageItemInspectorHtml, escapeHtml } = ctx;
function renderCustomPageRows(){
 const box=$('#customPageRows');if(!box)return;
 const pages=getState().customPages||[];
 box.innerHTML=customPageRowsHtml(pages,{customPageKey,presets:CUSTOM_PAGE_PRESETS,escapeHtml:esc});

 box.querySelectorAll('[data-move-custom-page]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();moveCustomPage(btn.dataset.moveCustomPage,Number(btn.dataset.dir))}));
 box.querySelectorAll('[data-delete-custom-page-row]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();removeCustomPage(btn.dataset.deleteCustomPageRow)}));
}
function openCustomPageCreator(){
 setInspector('创建页面','选择页面预设',
   '<div class="custom-page-preset-grid">'+Object.entries(CUSTOM_PAGE_PRESETS).map(([key,p])=>
     '<button type="button" class="custom-page-preset" data-custom-page-preset="'+key+'"><b>'+escapeHtml(p.title)+'</b><small>'+escapeHtml(p.intro)+'</small></button>'
   ).join('')+'</div><p class="inspector-note">创建后会作为一级页面出现在游客导航，也可以被「继续探索」直接关联。</p>');
 inspector.querySelectorAll('[data-custom-page-preset]').forEach(btn=>btn.addEventListener('click',()=>createCustomPage(btn.dataset.customPagePreset)));
}
function moveCustomPage(pageId,dir){
 const pages=getState().customPages||[],index=customPageIndex(pageId),next=index+Number(dir||0);
 if(index<0||next<0||next>=pages.length||index===next)return;
 checkpoint();[pages[index],pages[next]]=[pages[next],pages[index]];
 save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state:getState()});
 syncStudioPageUI(getCurrentPage(),{openContent:false});
}
function createCustomPage(presetKey){
 const preset=CUSTOM_PAGE_PRESETS[presetKey]||CUSTOM_PAGE_PRESETS.custom;
 checkpoint();
 const page={id:uid('cp'),preset:presetKey,layout:CUSTOM_PAGE_LAYOUTS[presetKey]||'gallery',title:preset.title,eyebrow:preset.eyebrow,intro:preset.intro,ratio:preset.ratio||1.333333,items:buildCustomPageStarterItems(presetKey)};
 getState().customPages??=[];getState().customPages.push(page);save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state:getState()});
 setStudioPage(customPageKey(page.id));
}
function removeCustomPage(pageId){
 const i=customPageIndex(pageId),page=getState().customPages?.[i];if(i<0||!page)return;
 checkpoint();
 const key=customPageKey(page.id);
 getState().customPages.splice(i,1);
 (getState().venueMap?.links||[]).forEach(link=>{if(link.target===key){link.target='activities';link.itemType='page';link.itemId=''}});
 save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state:getState()});syncContentCounts();
 if(getCurrentPage()===key)setStudioPage('home');
 toast('页面已删除，可使用撤销恢复');
}
function openCustomPageSettings(pageId){
 const i=customPageIndex(pageId),page=getState().customPages?.[i];if(i<0||!page)return;
 setInspector('专题页面',page.title,customPageSettingsHtml(page,(CUSTOM_PAGE_PRESETS[page.preset]||CUSTOM_PAGE_PRESETS.custom),esc));
 inspector.querySelectorAll('[data-custom-page-field]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{
     if(!started){checkpoint();started=true}
     page[e.target.dataset.customPageField]=e.target.value;save();renderCustomPageRows();send({type:'OE_REPLACE_STATE',state:getState()});
     const title=document.querySelector('.canvas-title b');if(title&&getCurrentPage()===customPageKey(page.id))title.textContent=page.title||'专题页面';
   });
 });
 inspector.querySelector('[data-delete-custom-page]')?.addEventListener('click',()=>removeCustomPage(page.id));
}
function openCustomPageItemsManager(pageId,selectedIndex=-1){
 const page=getState().customPages?.[customPageIndex(pageId)],panel=$('#contentListPanel');if(!page||!panel)return;
 const preset=customPageFieldLabels(page),items=page.items||[];
 panel.innerHTML=customPageItemsPanelHtml(items,preset,selectedIndex,esc);
 panel.querySelectorAll('[data-custom-item-index]').forEach(btn=>btn.onclick=()=>openCustomPageItemInspector(pageId,Number(btn.dataset.customItemIndex)));
 panel.querySelector('[data-add-custom-item]')?.addEventListener('click',()=>mutateCustomPageItem(pageId,items.length-1,'add'));
}
function openCustomPageItemInspector(pageId,index){
 const pi=customPageIndex(pageId),page=getState().customPages?.[pi],item=page?.items?.[index];if(pi<0||!page||!item)return;
 const preset=customPageFieldLabels(page),path='customPages.'+pi+'.items.'+index;
 const image=item.image?'<img src="'+escapeHtml(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
 setInspector('专题内容',preset.itemTitle+' · '+(item.title||String(index+1)),customPageItemInspectorHtml(page,item,index,preset,esc));
 inspector.querySelectorAll('[data-custom-item-field]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{if(!started){checkpoint();started=true}item[e.target.dataset.customItemField]=e.target.value;save();send({type:'OE_REPLACE_STATE',state:getState()});openCustomPageItemsManager(pageId,index)});
 });
 inspector.querySelectorAll('[data-custom-item-op]').forEach(btn=>btn.addEventListener('click',()=>mutateCustomPageItem(pageId,index,btn.dataset.customItemOp)));
 inspector.querySelector('[data-custom-item-image]')?.addEventListener('click',()=>{
   const input=$('#imageInput');input.dataset.path=path+'.image';input.dataset.returnCollection='custom:'+pageId;input.dataset.returnIndex=String(index);input.click();
 });
 inspector.querySelector('[data-custom-item-image-remove]')?.addEventListener('click',()=>{checkpoint();item.image='';save();send({type:'OE_REPLACE_STATE',state:getState()});openCustomPageItemInspector(pageId,index)});
}
function mutateCustomPageItem(pageId,index,op){
 const page=getState().customPages?.[customPageIndex(pageId)];if(!page)return;page.items??=[];checkpoint();
 if(op==='up'&&index>0){[page.items[index-1],page.items[index]]=[page.items[index],page.items[index-1]];index--}
 if(op==='down'&&index<page.items.length-1){[page.items[index+1],page.items[index]]=[page.items[index],page.items[index+1]];index++}
 if(op==='delete'){
   const removed=page.items[index];
   if(removed?.id)(getState().venueMap?.links||[]).forEach(link=>{if(link.target===customPageKey(page.id)&&link.itemType==='customitem'&&link.itemId===removed.id){link.itemType='page';link.itemId=''}});
   page.items.splice(index,1);index=Math.min(index,page.items.length-1)
 }
 if(op==='add'){page.items.splice(index+1,0,{id:uid('ci'),title:'',meta:'',text:'',image:'',url:''});index++}
 save();send({type:'OE_REPLACE_STATE',state:getState()});openCustomPageItemsManager(pageId,index);
 if(index>=0&&page.items[index])openCustomPageItemInspector(pageId,index);else showInspectorEmpty();
}
  return {renderCustomPageRows,openCustomPageCreator,moveCustomPage,createCustomPage,removeCustomPage,openCustomPageSettings,openCustomPageItemsManager,openCustomPageItemInspector,mutateCustomPageItem};
}
