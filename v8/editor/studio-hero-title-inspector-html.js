export function heroTitleInspectorHtml(state,escapeHtml){
 const desktop=String(state.heroImage||'').trim(),mobile=String(state.mobileHeroImage||'').trim();
 const media=(path,label,src,emptyLabel)=>'<div class="item-media hero-media-field"><span>'+label+'</span><div class="item-media-row"><button type="button" class="item-media-thumb '+(src?'':'empty')+'" data-hero-image="'+path+'" aria-label="上传'+label+'">'+(src?'<img src="'+escapeHtml(src)+'" alt="">':'<b>'+emptyLabel+'</b>')+'</button>'+(src?'<button type="button" class="item-media-remove" data-hero-image-remove="'+path+'">移除</button>':'')+'</div></div>';
 const isTravel=state.templateId==='02-scrapbook';
  const title=isTravel?'主图与裁切':'标题、图片与裁切';
  const html = '<div class="item-fields">'+
  '<label><span>第一行</span><input data-sync-path="heroTitle1" value="'+escapeHtml(state.heroTitle1||'')+'"></label>'+
  '<label><span>第二行</span><input data-sync-path="heroTitle2" value="'+escapeHtml(state.heroTitle2||'')+'"></label>'+
  '<label><span>第三行</span><input data-sync-path="heroTitle3" value="'+escapeHtml(state.heroTitle3||'')+'"></label>'+
  '</div>'+
  media('heroImage','主图',desktop,'＋')+media('mobileHeroImage','手机主图（可选）',mobile,'＋')+
  '<p class="inspector-note">手机主图留空时自动使用主图。</p>';
  return {title,html};
}
