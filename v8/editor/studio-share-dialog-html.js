export function shareDialogHtml(state,publishRecord,channels,escapeHtml){
  state.seo??={};
  const seo=state.seo,url=publishRecord?.url||'',host=url?url.replace(/^https?:\/\//,'').replace(/\/$/,''):'发布后显示网址';
  const title=seo.ogTitle||seo.pageTitle||state.eventName||'活动网站',desc=seo.ogDescription||seo.metaDescription||state.tagline||'',img=seo.ogImage||state.heroImage||'';
  return '<section class="share-block"><h3>网站地址</h3>'+(url?'<div class="share-url"><b>'+escapeHtml(url)+'</b><button type="button" data-share-copy-url>复制链接</button><button type="button" data-share-open>打开网站 ↗</button></div>':'<p class="inspector-note">还没有发布。发布后这里会显示游客网址。</p>')+'</section>'+
  (url?'<section class="share-block"><h3>二维码</h3><div class="share-qr"><div id="shareQr" aria-label="活动网站二维码"></div><div><p class="inspector-note">印在海报或写进群公告，扫一下就能打开活动网站。</p><button type="button" id="shareQrSave">下载二维码</button></div></div></section>':'')+
  (url?'<section class="share-block"><h3>各平台的宣传链接</h3><p class="inspector-note">不同平台发不同的链接，后台「数据统计」里就能看到哪个平台带来的访问多。</p>'+channels.map(c=>'<div class="share-channel"><b>'+c.label+'</b><code>'+escapeHtml(url.replace(/\/$/,'')+'/?from='+c.key)+'</code><button type="button" data-share-channel="'+c.key+'">复制</button></div>').join('')+'</section>':'')+
  '<section class="share-block"><h3>别人转发时的样子</h3><div class="share-card"><div class="share-card-img">'+(img?'<img src="'+escapeHtml(img)+'" alt="">':'<span>分享封面</span>')+'</div><div class="share-card-text"><b>'+escapeHtml(title)+'</b><small>'+escapeHtml(desc)+'</small><i>'+escapeHtml(host)+'</i></div></div>'+
  '<div class="item-fields"><label><span>分享标题</span><input data-seo-field="ogTitle" value="'+escapeHtml(seo.ogTitle||'')+'" placeholder="留空则使用活动名称"></label>'+
  '<label><span>分享描述</span><textarea data-seo-field="ogDescription" rows="3" placeholder="留空则使用活动简介">'+escapeHtml(seo.ogDescription||'')+'</textarea></label></div>'+
  '<div class="item-media"><span>分享封面</span><div class="item-media-row">'+(seo.ogImage?'<img src="'+escapeHtml(seo.ogImage)+'" alt="">':'<div class="item-media-empty">＋</div>')+'<div><button type="button" data-seo-image>选择 / 裁剪</button>'+(seo.ogImage?'<button type="button" class="ghost" data-seo-image-remove>移除</button>':'')+'</div></div></div>'+
  '<p class="inspector-note">封面留空时使用活动主视觉。</p></section>'+
  '<section class="share-block"><h3>发给朋友的话</h3><textarea id="shareMessage" rows="4"></textarea><div class="share-actions"><button type="button" data-share-copy-text>复制文案</button></div></section>'+
  '<details class="share-block"><summary>搜索引擎</summary><div class="item-fields"><label><span>页面标题</span><input data-seo-field="pageTitle" value="'+escapeHtml(seo.pageTitle||'')+'" placeholder="留空则使用活动名称"></label>'+
  '<label><span>页面描述</span><textarea data-seo-field="metaDescription" rows="3" placeholder="用于搜索结果摘要">'+escapeHtml(seo.metaDescription||'')+'</textarea></label>'+
  '<label><span>标准网址 Canonical</span><input type="url" data-seo-field="canonical" value="'+escapeHtml(seo.canonical||'')+'" placeholder="一般不用填"></label></div></details>';
}
