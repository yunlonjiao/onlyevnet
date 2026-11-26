export function coverKvHtml(state,escapeHtml){
  const v=String(state.heroImage||'').trim();
  return '<div class="entry-animation-inspector"><div class="item-media"><span>封面 KV（贴合书页 5:7）</span><div class="item-media-row">'+(v?'<img src="'+escapeHtml(v)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button type="button" data-cover-kv>选择 / 裁剪</button>'+(v?'<button type="button" class="ghost" data-cover-kv-remove>移除</button>':'')+'</div></div></div><p class="inspector-note">封面 KV 会铺在合上的书页上，比例贴合书本；不需要再区分桌面和手机。</p></div>';
}

export function entryAnimationHtml(state,escapeHtml){
  const heroMedia=(key,label)=>{const v=String(((state.entryAnimation||{})[key])||'').trim();return '<div class="item-media"><span>'+label+'</span><div class="item-media-row">'+(v?'<img src="'+escapeHtml(v)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button type="button" data-kv-image="'+key+'">选择 / 裁剪</button></div></div></div>';};
  return '<div class="entry-animation-inspector">'+heroMedia('kvDesktop','主图')+heroMedia('kvMobile','手机 KV（可选，留空用桌面 KV）')+
    '<p class="inspector-note">开屏动画单独使用这两张图，与首页横幅互不影响；手机 KV 留空时沿用桌面 KV。</p></div>';
}
