export function bannerInspectorHtml(state,escapeHtml){
  const slot=(key,label,note)=>{const v=String(state[key]||'').trim();return '<div class="item-media"><span>'+label+'</span><div class="item-media-row">'+(v?'<img src="'+escapeHtml(v)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button type="button" data-banner-image="'+key+'">'+(v?'更换':'选择 / 裁剪')+'</button>'+(v?'<button type="button" class="ghost" data-banner-remove="'+key+'">移除</button>':'')+'</div></div>'+(note?'<small>'+note+'</small>':'')+'</div>';};
  return '<div class="entry-animation-inspector">'+slot('heroImage','桌面横幅')+slot('mobileHeroImage','手机横幅（可选）','留空时用桌面横幅居中裁切')+
    '<p class="inspector-note">桌面 5:2 宽幅，手机 3:2；两张都可单独上传。</p></div>';
}

export function trafficInspectorHtml(state,escapeHtml){
  const img=String(state.venueMap?.transitImage||'');
  return '<div class="entry-animation-inspector"><div class="item-media"><span>交通路线图</span><div class="item-media-row">'+
    (img?'<img src="'+escapeHtml(img)+'" alt="">':'<div class="item-media-empty">＋</div>')+
    '<div><button type="button" data-traffic-image>选择 / 裁剪</button></div></div></div>'+
    '<div class="item-fields"><label><span>地图导航链接</span><input id="trafficNavInput" value="'+escapeHtml(state.navigationUrl||'')+'" placeholder="https://uri.amap.com/..."></label></div>'+
    '<div class="entry-animation-actions"><button type="button" id="saveTrafficNav">保存导航链接</button></div>'+
    '<p class="inspector-note">交通文字内容在「规则与须知」里维护（交通到达那一条）。</p></div>';
}
