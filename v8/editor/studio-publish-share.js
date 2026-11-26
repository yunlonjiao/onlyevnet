export function renderPublishShare(state){
 const seo=state.seo||{},custom=!!(seo.ogTitle||seo.ogDescription||seo.ogImage);
 const title=seo.ogTitle||seo.pageTitle||state.eventName||'活动网站',desc=seo.ogDescription||seo.metaDescription||state.tagline||'',img=seo.ogImage||state.heroImage||'';
 document.querySelector('#publishShareTitle').textContent=title;document.querySelector('#publishShareDesc').textContent=desc;
 const box=document.querySelector('#publishShareImg');box.innerHTML='';if(img){const el=document.createElement('img');el.alt='';el.src=img;box.appendChild(el)}
 document.querySelector('#publishShareMode').textContent=custom?'已自定义转发时的标题、描述或封面。':'使用默认：活动名称、活动简介和主视觉。直接发布即可，也可以改。';
 document.querySelector('#publishShareReset').hidden=!custom;
}
