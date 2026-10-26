/* Shared "product spotlight": a featured carousel plus six random products, reshuffled on
   every visit. Enabled per template with presentationProfile.productSpotlight.
   mountProductSpotlight must stay self-contained: the exporter inlines it via toString(). */
export function spotlightItems(state){
  return (state?.booths||[]).flatMap(b=>(b.products||[]).map(p=>({
    id:String(p.id||''),name:String(p.name||''),price:String(p.price||''),image:String(p.image||''),
    boothId:String(b.id||''),boothName:String(b.name||''),boothNo:String(b.no||'')
  }))).filter(p=>p.name||p.image);
}

export function mountProductSpotlight(root,items,{autoplay=true,storageKey='oe-spotlight-last'}={}){
  if(!root)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const art=p=>p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.name)+'" loading="lazy" decoding="async">':'<span class="spotlight-placeholder">'+esc(p.name)+'</span>';
  const meta=p=>[p.boothNo,p.boothName,p.price].filter(Boolean).map(esc).join(' · ');
  const shuffle=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  let order=shuffle(items);
  // Avoid repeating the previous visit's order when another order is possible.
  try{
    const previous=sessionStorage.getItem(storageKey)||'',sig=()=>order.map(p=>p.id).join('|');
    for(let n=0;n<8&&order.length>1&&sig()===previous;n++)order=shuffle(items);
    if(order.length>1&&sig()===previous)order.push(order.shift());
    sessionStorage.setItem(storageKey,sig());
  }catch{}
  clearInterval(root._oeSpotlightTimer);
  if(!order.length){root.innerHTML='<p class="spotlight-empty">暂无可推荐制品。</p>';return}
  const link=p=>' href="#booths" data-target-mode="page" data-page-link="booths" data-spotlight-booth="'+esc(p.boothId)+'"';
  root.innerHTML='<div class="spotlight-feature"><a class="spotlight-feature-art"'+link(order[0])+'></a><div class="spotlight-feature-info"><small class="spotlight-count"></small><h3 class="spotlight-title"></h3><p class="spotlight-meta"></p></div><div class="spotlight-controls"><button type="button" data-spotlight-step="-1" aria-label="上一件制品">←</button><button type="button" data-spotlight-step="1" aria-label="下一件制品">→</button></div></div>'+
   '<div class="spotlight-six">'+order.slice(0,6).map(p=>'<a class="spotlight-tile"'+link(p)+'><span class="spotlight-tile-art">'+art(p)+'</span><b>'+esc(p.name)+'</b><small>'+meta(p)+'</small></a>').join('')+'</div>';
  let index=0;
  const feature=root.querySelector('.spotlight-feature-art');
  const draw=()=>{const p=order[index];feature.innerHTML=art(p);feature.dataset.spotlightBooth=p.boothId;root.querySelector('.spotlight-title').textContent=p.name;root.querySelector('.spotlight-meta').textContent=[p.boothNo,p.boothName,p.price].filter(Boolean).join(' · ');root.querySelector('.spotlight-count').textContent=(index+1)+' / '+order.length};
  const step=d=>{index=(index+d+order.length)%order.length;draw()};
  root.querySelectorAll('[data-spotlight-step]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();step(Number(b.dataset.spotlightStep))}));
  let startX=null;
  feature.addEventListener('pointerdown',e=>{startX=e.clientX});
  feature.addEventListener('pointerup',e=>{if(startX===null)return;const dx=e.clientX-startX;startX=null;if(Math.abs(dx)>45&&order.length>1){feature._oeSwiped=true;step(dx<0?1:-1)}});
  // A swipe on the featured link changes the slide; it must not also open the booth page.
  feature.addEventListener('click',e=>{if(feature._oeSwiped){e.preventDefault();e.stopPropagation();feature._oeSwiped=false}},true);
  draw();
  const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(autoplay&&!reduce&&order.length>1)root._oeSpotlightTimer=setInterval(()=>{if(!document.hidden&&root.isConnected)step(1)},5500);
}
