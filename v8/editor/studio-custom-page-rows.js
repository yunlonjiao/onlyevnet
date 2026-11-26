export function customPageRowsHtml(pages,{customPageKey,presets,escapeHtml}){
  return pages.map((page,index)=>{
   const key=customPageKey(page.id),preset=presets[page.preset]||presets.custom;
   return '<div class="page-tree-row custom-page-row" data-page-row="'+escapeHtml(key)+'"><button data-page="'+escapeHtml(key)+'" type="button"><span class="nav-icon">◇</span><span>'+escapeHtml(page.title||preset.title)+'</span><small class="custom-page-type">'+escapeHtml(preset.title)+'</small></button><div class="custom-page-row-tools"><button type="button" data-move-custom-page="'+escapeHtml(page.id)+'" data-dir="-1" '+(index===0?'disabled':'')+' title="上移" aria-label="上移 '+escapeHtml(page.title||preset.title)+'">↑</button><button type="button" data-move-custom-page="'+escapeHtml(page.id)+'" data-dir="1" '+(index===pages.length-1?'disabled':'')+' title="下移" aria-label="下移 '+escapeHtml(page.title||preset.title)+'">↓</button><button type="button" class="custom-page-row-delete" data-delete-custom-page-row="'+escapeHtml(page.id)+'" title="删除页面" aria-label="删除 '+escapeHtml(page.title||preset.title)+'">×</button></div></div>';
  }).join('');
}
