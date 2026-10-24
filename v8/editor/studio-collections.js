/* Exactly the Studio collection-list row structure, shared by all templates. */
export function renderStudioCollectionRows(items,{escape,selected=-1,item=(value,i)=>[value?.name||value?.title||String(i+1),''],thumbnail=()=>'',attribute='data-open-item'}={}){
 return items.map((entry,index)=>{
  const [title,subtitle]=item(entry,index);
  return '<button type="button" class="sidebar-content-row '+(index===selected?'active':'')+'" '+attribute+'="'+index+'" data-search="'+escape((title+' '+subtitle).toLowerCase())+'">'+thumbnail(entry,index)+'<span class="sidebar-content-copy"><b>'+escape(title)+'</b>'+(subtitle?'<small>'+escape(subtitle)+'</small>':'')+'</span><i>›</i></button>';
 }).join('');
}
export function renderStudioCollectionPanel(panel,items,{escape,title,selected=-1,item,thumbnail,empty='暂无内容',addLabel='添加内容'}={}){
 const rows=renderStudioCollectionRows(items,{escape,selected,item,thumbnail});
 panel.innerHTML='<div class="sidebar-content-head"><div><b>'+escape(title)+'</b><span>'+items.length+' 项</span></div>'+(items.length>6?'<label class="sidebar-content-search"><span>⌕</span><input type="search" placeholder="搜索'+escape(title)+'" data-sidebar-content-search></label>':'')+'</div><div class="sidebar-content-rows">'+(rows||'<div class="sidebar-content-empty">'+escape(empty)+'</div>')+'</div><button type="button" class="sidebar-content-add" data-sidebar-content-add>＋ '+escape(addLabel)+'</button>';
}
export function filterStudioCollection(panel,query){
 const q=String(query||'').trim().toLowerCase();
 panel.querySelectorAll('[data-open-item]').forEach(el=>{el.hidden=!el.dataset.search.includes(q)});
}
