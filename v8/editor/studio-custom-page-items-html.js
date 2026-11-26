export function customPageItemsPanelHtml(items,preset,selectedIndex,escapeHtml){
  const rows=items.map((item,i)=>'<button type="button" class="sidebar-content-row '+(i===selectedIndex?'active':'')+'" data-custom-item-index="'+i+'">'+
    '<span class="sidebar-content-thumb '+(item.image?'has-image':'')+'">'+(item.image?'<img src="'+escapeHtml(item.image)+'" alt="">':'◇')+'</span>'+
    '<span class="sidebar-content-copy"><b>'+escapeHtml(item.title||preset.itemTitle+' '+(i+1))+'</b>'+(item.meta?'<small>'+escapeHtml(item.meta)+'</small>':'')+'</span><i>›</i></button>').join('');
  return '<div class="sidebar-content-head"><div><b>'+escapeHtml(preset.itemTitle+'展示')+'</b><span>'+items.length+' 项</span></div></div>'+
    '<div class="sidebar-content-rows">'+(rows||'<div class="sidebar-content-empty">还没有'+escapeHtml(preset.itemTitle)+'内容</div>')+'</div>'+
    '<button type="button" class="sidebar-content-add" data-add-custom-item>＋ 添加'+escapeHtml(preset.itemTitle)+'</button>';
}
