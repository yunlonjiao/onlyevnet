export function createItemInspector({ $, getState, setLast, collectionMeta, collectionArray, isItemLongField, participationInspectorFields, itemMediaPanels, contentManagerMeta, itemActionsHtml, setInspector, esc, itemInspectorHeadHtml, itemFieldsHtml, extraInspector, fitTextarea, inspector, send, checkpoint, save, collectionPath, cleanValue, setDeep, openCollectionManager, setPageContentActive, mutateItem, addBoothProduct, openBoothProductManager, uid, guestPlatformName }){
function open(collection,index){
 const state=getState();
  setLast(collection,index);
 const meta=collectionMeta[collection],arr=collectionArray(collection),item=arr?.[index];if(!meta||!item)return;
 const count=arr.length;
 const isLong=isItemLongField;
 const inspectorFields=collection==='participation'?participationInspectorFields(item):meta.fields;
 const {media,guideMedia}=itemMediaPanels(collection,index,item,esc);
 const itemTitle=contentManagerMeta[collection]?.item?.(item,index)?.[0]||meta.title;
 const itemActions=itemActionsHtml(collection);
 setInspector('内容',meta.title+' · '+itemTitle,itemInspectorHeadHtml(meta,index,count,esc)+'<div class="item-fields">'+itemFieldsHtml(inspectorFields,item,esc,isLong)+'</div>'+media+guideMedia+extraInspector(collection,index,item)+itemActions);
 inspector.querySelectorAll('textarea').forEach(fitTextarea);
 try{const h=inspector.querySelector('textarea[data-key="setlist"]');
  if(h&&!h.dataset.chips){h.dataset.chips='1';
   const wrap=document.createElement('div');wrap.className='chip-editor';
   const list=document.createElement('div');list.className='chip-list';
   const inp=document.createElement('input');inp.type='text';inp.className='chip-input';inp.placeholder='输入曲名后回车';
   wrap.append(list,inp);h.parentElement.insertBefore(wrap,h);h.classList.add('chip-source');
   const splitSongs=v=>String(v||'').split(/(?=《)|[\/、,，\n]+/).map(t=>t.trim()).filter(Boolean);
   const sync=()=>{h.value=[...list.querySelectorAll('.chip')].map(c=>c.dataset.v).join('\n');h.dispatchEvent(new Event('input',{bubbles:true}));h.dispatchEvent(new Event('change',{bubbles:true}));h.blur&&h.blur();try{send({type:'OE_PATCH_FIELD',path:collection+'.'+index+'.setlist',value:h.value})}catch(e){}};
   const add=v=>{if(!v)return;const c=document.createElement('span');c.className='chip';c.dataset.v=v;c.innerHTML=esc(v)+'<button type="button" aria-label="删除">×</button>';c.querySelector('button').onclick=()=>{c.remove();sync()};list.appendChild(c)};
   splitSongs(h.value).forEach(add);
   inp.addEventListener('keydown',e=>{if(e.key!=='Enter')return;e.preventDefault();add(inp.value.trim());inp.value='';sync()});
  }}catch(err){console.warn('[chips]',err)}
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
   inspector.querySelector('[data-explore-page]')?.addEventListener('change',e=>{checkpoint();item.target=e.target.value;item.itemType='page';item.itemId='';save();send({type:'OE_REPLACE_STATE',state});openCollectionManager('explore',index);open('explore',index)});
 }
 inspector.querySelector('[data-schedule-plan]')?.addEventListener('change',e=>{checkpoint();item.participationId=e.target.value;save();send({type:'OE_REPLACE_STATE',state});open('schedule',index)});
 inspector.querySelector('[data-featured-activity-select]')?.addEventListener('change',e=>{checkpoint();item.participationId=e.target.value;save();send({type:'OE_REPLACE_STATE',state});openCollectionManager('featuredActivities',index);open('featuredActivities',index)});
 inspector.querySelector('[data-edit-featured-source]')?.addEventListener('click',e=>{const i=Number(e.currentTarget.dataset.editFeaturedSource);openCollectionManager('participation',i);setPageContentActive({collection:'participation'});open('participation',i)});
 inspector.querySelectorAll('[data-guest-ref]').forEach(ch=>ch.addEventListener('change',e=>{checkpoint();item.guestIds??=[];item.guestIds=e.target.checked?[...new Set([...item.guestIds,e.target.dataset.guestRef])]:item.guestIds.filter(id=>id!==e.target.dataset.guestRef);save();send({type:'OE_REPLACE_STATE',state})}));
 inspector.querySelector('[data-activity-type]')?.addEventListener('change',e=>{checkpoint();item.activityType=e.target.value;save();send({type:'OE_REPLACE_STATE',state});open('participation',index)});
 inspector.querySelectorAll('[data-activity-extra-key]').forEach(input=>{
   let started=false;
   input.addEventListener('input',e=>{if(!started){checkpoint();started=true}item[e.target.dataset.activityExtraKey]=e.target.value;save();send({type:'OE_REPLACE_STATE',state})});
 });
 if(collection==='guests')inspector.querySelectorAll('[data-guest-type]').forEach(btn=>btn.addEventListener('click',()=>{checkpoint();item.guestType=btn.dataset.guestType;save();send({type:'OE_REPLACE_STATE',state});open('guests',index)}));
 if(collection==='guests'){
   inspector.querySelectorAll('[data-guest-plan-ref]').forEach(ch=>ch.addEventListener('change',e=>{
     checkpoint();
     const plan=(state.participation||[]).find(x=>x.id===e.target.dataset.guestPlanRef);if(!plan)return;
     plan.guestIds=Array.isArray(plan.guestIds)?plan.guestIds:[];
     plan.guestIds=e.target.checked?[...new Set([...plan.guestIds,item.id])]:plan.guestIds.filter(id=>id!==item.id);
     save();send({type:'OE_REPLACE_STATE',state});open('guests',index);
   }));
   inspector.querySelectorAll('[data-guest-schedule-ref]').forEach(ch=>ch.addEventListener('change',e=>{
     checkpoint();
     const row=(state.schedule||[]).find(x=>x.id===e.target.dataset.guestScheduleRef);if(!row)return;
     row.guestIds=Array.isArray(row.guestIds)?row.guestIds:[];
     row.guestIds=e.target.checked?[...new Set([...row.guestIds,item.id])]:row.guestIds.filter(id=>id!==item.id);
     save();send({type:'OE_REPLACE_STATE',state});open('guests',index);
   }));
   inspector.querySelector('[data-guest-social-add]')?.addEventListener('click',()=>{
     checkpoint();item.socialLinks=Array.isArray(item.socialLinks)?item.socialLinks:[];item.socialLinks.push({id:uid('gl'),url:''});
     save();send({type:'OE_REPLACE_STATE',state});open('guests',index);
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
     save();send({type:'OE_REPLACE_STATE',state});open('guests',index);
   }));
 }
 inspector.querySelectorAll('[data-op]').forEach(btn=>btn.addEventListener('click',()=>mutateItem(collection,index,btn.dataset.op)));
 inspector.querySelectorAll('[data-media-path]').forEach(btn=>btn.addEventListener('click',()=>{$('#imageInput').dataset.path=btn.dataset.mediaPath;$('#imageInput').dataset.returnCollection=collection;$('#imageInput').dataset.returnIndex=String(index);$('#imageInput').click()}));
 inspector.querySelectorAll('[data-remove-media]').forEach(btn=>btn.addEventListener('click',()=>{checkpoint();setDeep(btn.dataset.removeMedia,'');save();send({type:'OE_REPLACE_STATE',state});setTimeout(()=>open(collection,index),60)}));
 if(collection==='booths'){
   inspector.querySelector('[data-booth-product-add]')?.addEventListener('click',()=>addBoothProduct(index));
   inspector.querySelector('[data-booth-products-manage]')?.addEventListener('click',()=>openBoothProductManager(index));
 }
}
  return {open};
}
