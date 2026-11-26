export function optionalPageHtml(key,page,escapeHtml){
  const label=key==='freewalk'?'COS自由行':'痛车展示';
  return '<div class="item-fields">'+
   '<label><span>页面标题</span><input data-optional-field="title" value="'+escapeHtml(page.title||label)+'"></label>'+
   '<label><span>正文</span><textarea data-optional-field="text" rows="6">'+escapeHtml(page.text||'')+'</textarea></label>'+
   '</div>'+
   '<div class="item-media"><span>页面图片</span><div class="item-media-row">'+
   (page.image?'<img src="'+escapeHtml(page.image)+'" alt="">':'<div class="item-media-empty">＋</div>')+
   '<div><button type="button" data-optional-image>选择 / 裁剪</button>'+
   (page.image?'<button type="button" class="ghost" data-optional-image-remove>移除</button>':'')+
   '</div></div></div>';
}
