export function boothProductsHtml(booth,boothIndex,escapeHtml){
  const products=booth.products||[];
  return '<div class="product-direct-head"><button type="button" class="ghost" data-booth-product-back>← 返回摊位编辑</button><span>'+escapeHtml((booth.no?booth.no+' · ':'')+(booth.name||'摊位'))+'</span></div>'+
   '<div class="product-editor"><div class="product-editor-head"><b>共 '+products.length+' 件制品</b><button type="button" data-booth-product-add="'+boothIndex+'">＋ 添加制品</button></div>'+
   '<div class="sidebar-content-rows">'+(products.length?products.map((p,j)=>
      '<div class="product-manager-row"><button type="button" class="sidebar-content-row product-manager-name-row" data-booth-product-open="'+j+'"><span class="sidebar-content-copy"><b>'+escapeHtml(p.name||'未命名制品')+'</b></span></button><div class="product-manager-tools"><button type="button" data-booth-product-move="'+j+'" data-dir="-1" '+(j===0?'disabled':'')+' title="上移">↑</button><button type="button" data-booth-product-move="'+j+'" data-dir="1" '+(j===products.length-1?'disabled':'')+' title="下移">↓</button></div></div>'
   ).join(''):'<p class="inspector-note">还没有制品，点击“添加制品”开始。</p>')+'</div></div>';
}
