export function createModuleControls({getState,getTemplate,guideLabelText,checkpoint,save,send}){
 /** @param {string} selector @returns {HTMLElement|null} */
 const el=(selector)=>/** @type {HTMLElement|null} */ (document.querySelector(selector));
 /** @param {string} selector @returns {NodeListOf<HTMLElement>} */
 const all=(selector)=>/** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(selector));
 return function syncModuleControls(){
 const guestPageRow=el('[data-page-row="guests"]');
 if(guestPageRow)guestPageRow.style.display=getState().templateId==='02-scrapbook'?'none':'';
 // Templates without some first-level pages (03 has no 活动 / 嘉宾) or without custom pages.
 (getTemplate().studioPages?.hidden||[]).forEach(page=>{const row=el('[data-page-row="'+page+'"]');if(row)row.style.display='none'});
 /* removeUnusedRows：单页模板不再保留这些页面入口 */
 if(/^0[56]/.test(getTemplate().id||'')){['activities','guests','guide'].forEach(k=>{all('[data-page-row="'+k+'"]').forEach(r=>r.remove())})}
 const guideRow=el('[data-page-row="guide"]');if(guideRow){const span=guideRow.querySelector('span:last-child');if(span)span.textContent=guideLabelText()} /* 按活动类型命名指南页 */
 const bookStreetRow=(()=>{
   if(getState().templateId!=='04-creator-catalogue')return null;
   let row=el('[data-page-row="bookStreets"]');
   const nav=el('.page-nav');
   if(!row&&nav){
     row=document.createElement('div');row.className='page-tree-row';row.dataset.pageRow='bookStreets';
     row.innerHTML='<button type="button"><span class="nav-icon">◎</span><span>街道导览</span></button><label class="page-inline-switch" title="在书里显示街道导览页"><input type="checkbox" data-book-street aria-label="街道导览页面"><i></i></label>';
     const custom=nav.querySelector('#customPageRows');if(custom)nav.insertBefore(row,custom);else nav.appendChild(row);
     const bookStreetInput=/** @type {HTMLInputElement|null} */ (row.querySelector('[data-book-street]'));bookStreetInput?.addEventListener('change',e=>{checkpoint();getState().bookStreetPage=/** @type {HTMLInputElement} */ (e.target).checked;save();send({type:'OE_REPLACE_STATE',state:getState()});});
   }
   if(row){row.style.display='';const cb=/** @type {HTMLInputElement|null} */ (row.querySelector('[data-book-street]'));if(cb)cb.checked=getState().bookStreetPage===true;}
   return row;
 })();
 const animRow=el('.entry-animation-row');if(animRow)animRow.style.display=(getTemplate().studioPages?.hidden||[]).includes('animation')?'none':'';
 const customPageButton=el('#createCustomPageBtn');
 if(customPageButton)customPageButton.hidden=getTemplate().studioPages?.customPages===false;
 all('[data-module]').forEach(input=>{input.checked=getState().modules?.[input.dataset.module]!==false});
 all('[data-page-row]').forEach(row=>row.classList.toggle('is-disabled',getState().modules?.[row.dataset.pageRow]===false));
};
}
