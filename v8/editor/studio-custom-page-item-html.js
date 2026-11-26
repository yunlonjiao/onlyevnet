export function customPageItemInspectorHtml(page,item,index,preset,escapeHtml){
  const image=item.image?'<img src="'+escapeHtml(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
  return '<div class="item-inspector-head"><div><span>'+escapeHtml(page.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(page.items.length).padStart(2,'0')+'</b></div><div class="item-tools"><button data-custom-item-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-custom-item-op="down" '+(index===page.items.length-1?'disabled':'')+'>↓</button></div></div>'+
   '<div class="item-fields">'+
   '<label><span>'+escapeHtml(preset.titleLabel)+'</span><input data-custom-item-field="title" value="'+escapeHtml(item.title||'')+'"></label>'+
   '<label><span>'+escapeHtml(preset.metaLabel)+'</span><input data-custom-item-field="meta" value="'+escapeHtml(item.meta||'')+'"></label>'+
   '<label><span>'+escapeHtml(preset.textLabel)+'</span><textarea data-custom-item-field="text" rows="4">'+escapeHtml(item.text||'')+'</textarea></label>'+
   '<label><span>外部链接（可选）</span><input data-custom-item-field="url" value="'+escapeHtml(item.url||'')+'"></label>'+
   '</div><div class="item-media"><span>展示图片</span><div class="item-media-row">'+image+'<div><button type="button" data-custom-item-image>选择 / 裁剪</button>'+(item.image?'<button type="button" class="ghost" data-custom-item-image-remove>移除</button>':'')+'</div></div></div>'+
   '<div class="item-actions"><button data-custom-item-op="add">＋ 添加</button><button data-custom-item-op="delete" class="danger">删除</button></div>';
}
