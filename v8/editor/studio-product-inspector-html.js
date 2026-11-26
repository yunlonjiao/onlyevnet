export function productInspectorHtml(booth,product,escapeHtml){
  const image=product.image?'<img src="'+escapeHtml(product.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
  return '<div class="product-direct-head"><button type="button" class="ghost" data-direct-product-back>← 返回制品列表</button><span>'+escapeHtml((booth.no?booth.no+' · ':'')+(booth.name||'所属摊位'))+'</span><b>'+escapeHtml(product.name||'未命名制品')+'</b></div>'+
   '<div class="item-media product-direct-media"><span>制品图片</span><div class="item-media-row">'+image+'<div><button type="button" data-direct-product-image>选择 / 裁剪</button>'+(product.image?'<button type="button" data-direct-product-crop class="ghost">重新裁剪</button><button type="button" data-direct-product-remove-image class="ghost">移除</button>':'')+'</div></div></div>'+
   '<div class="item-fields product-direct-fields">'+
     '<label><span>制品名称</span><input data-direct-product-key="name" value="'+escapeHtml(product.name||'')+'"></label>'+
     '<label><span>Tag（选填）</span><input data-direct-product-key="tag" value="'+escapeHtml(product.tag||'')+'" placeholder="如：亚克力 立牌"></label>'+
     '<label><span>价格</span><input data-direct-product-key="price" value="'+escapeHtml(product.price||'')+'"></label>'+
     '<label><span>说明</span><textarea data-direct-product-key="note" rows="2">'+escapeHtml(product.note||'')+'</textarea></label>'+
   '</div>'+
   '<p class="inspector-note">制品搜索只匹配“名称 + Tag”。</p>'+
   '<div class="item-actions"><button type="button" data-direct-product-delete class="danger">删除制品</button></div>'
 ;
}
