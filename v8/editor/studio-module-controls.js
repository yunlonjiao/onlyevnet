export function createModuleControls({getState,getTemplate,guideLabelText,checkpoint,save,send}){
 return function syncModuleControls(){
 const guestPageRow=document.querySelector('[data-page-row="guests"]');
 if(guestPageRow)guestPageRow.style.display=getState().templateId==='02-scrapbook'?'none':'';
 // Templates without some first-level pages (03 has no 活动 / 嘉宾) or without custom pages.
 (getTemplate().studioPages?.hidden||[]).forEach(page=>{const row=document.querySelector('[data-page-row="'+page+'"]');if(row)row.style.display='none'});
 /* removeUnusedRows：单页模板不再保留这些页面入口 */
 if(/^0[56]/.test(getTemplate().id||'')){['activities','guests','guide'].forEach(k=>{document.querySelectorAll('[data-page-row="'+k+'"]').forEach(r=>r.remove())})}
 const guideRow=document.querySelector('[data-page-row="guide"]');if(guideRow){const span=guideRow.querySelector('span:last-child');if(span)span.textContent=guideLabelText()} /* 按活动类型命名指南页 */
 const bookStreetRow=(()=>{
   if(getState().templateId!=='04-creator-catalogue')return null;
   let row=document.querySelector('[data-page-row="bookStreets"]');
   const nav=document.querySelector('.page-nav');
   if(!row&&nav){
     row=document.createElement('div');row.className='page-tree-row';row.dataset.pageRow='bookStreets';
     row.innerHTML='<button type="button"><span class="nav-icon">◎</span><span>街道导览</span></button><label class="page-inline-switch" title="在书里显示街道导览页"><input type="checkbox" data-book-street aria-label="街道导览页面"><i></i></label>';
     const custom=nav.querySelector('#customPageRows');if(custom)nav.insertBefore(row,custom);else nav.appendChild(row);
     row.querySelector('[data-book-street]').addEventListener('change',e=>{checkpoint();getState().bookStreetPage=e.target.checked;save();send({type:'OE_REPLACE_STATE',state:getState()});});
   }
   if(row){row.style.display='';const cb=row.querySelector('[data-book-street]');if(cb)cb.checked=getState().bookStreetPage===true;}
   return row;
 })();
 const animRow=document.querySelector('.entry-animation-row');if(animRow)animRow.style.display=(getTemplate().studioPages?.hidden||[]).includes('animation')?'none':'';
 const customPageButton=document.querySelector('#createCustomPageBtn');
 if(customPageButton)customPageButton.hidden=getTemplate().studioPages?.customPages===false;
 document.querySelectorAll('[data-module]').forEach(input=>{input.checked=getState().modules?.[input.dataset.module]!==false});
 document.querySelectorAll('[data-page-row]').forEach(row=>row.classList.toggle('is-disabled',getState().modules?.[row.dataset.pageRow]===false));
};
}
