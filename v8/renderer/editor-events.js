export function bindEditorEvents({getMode,getState,setDeep,send,router,openGiftLightbox,qsa:qa}){
  document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||getMode()!=='edit')return;send({type:'OE_FIELD_FOCUS',path:el.dataset.oeField});send({type:'OE_SELECT_FIELD',path:el.dataset.oeField})},true);
  document.addEventListener('input',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||getMode()!=='edit')return;const path=el.dataset.oeField,value=el.textContent;setDeep(path,value);qa('[data-oe-field="'+CSS.escape(path)+'"]').forEach(x=>{if(x!==el)x.textContent=value});if(path.startsWith('ribbon')){const i=Number(path.replace('ribbon',''))-1;qa('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=value)}send({type:'OE_FIELD_CHANGE',path,value})});
  document.addEventListener('pointerdown',e=>{
    const pin=e.target.closest?.('.map-pin[data-oe-item="mapPoints"]');
    if(!pin||getMode()!=='edit')return;
    const map=pin.closest('#venueMap');if(!map)return;
    e.preventDefault();e.stopPropagation();
    const index=Number(pin.dataset.oeIndex),rect=map.getBoundingClientRect();
    pin.setPointerCapture?.(e.pointerId);pin.classList.add('dragging');
    const move=ev=>{
      const x=Math.max(0,Math.min(100,((ev.clientX-rect.left)/rect.width)*100));
      const y=Math.max(0,Math.min(100,((ev.clientY-rect.top)/rect.height)*100));
      pin.style.left=x+'%';pin.style.top=y+'%';pin._oePos={x,y};
    };
    const end=ev=>{
      pin.removeEventListener('pointermove',move);pin.removeEventListener('pointerup',end);pin.removeEventListener('pointercancel',end);pin.classList.remove('dragging');
      if(pin.hasPointerCapture?.(ev.pointerId))pin.releasePointerCapture(ev.pointerId);
      const pos=pin._oePos;if(pos)send({type:'OE_MAP_POINT_MOVE',index,x:Number(pos.x.toFixed(2)),y:Number(pos.y.toFixed(2))});
      delete pin._oePos;
    };
    pin.addEventListener('pointermove',move);pin.addEventListener('pointerup',end);pin.addEventListener('pointercancel',end);
  },true);

  function favoriteKey(){return 'oe-wishlist:'+String(getState().eventName||'event').toLowerCase().replace(/\s+/g,'-')}
  function readFavorites(){try{const x=JSON.parse(localStorage.getItem(favoriteKey())||'{}');return {booths:Array.isArray(x.booths)?x.booths:[],products:Array.isArray(x.products)?x.products:[]}}catch{return {booths:[],products:[]}}}
  function writeFavorites(x){localStorage.setItem(favoriteKey(),JSON.stringify(x))}
  function paintFavorites(){const x=readFavorites(),bs=new Set(x.booths),ps=new Set(x.products);qa('[data-favorite-booth]').forEach(b=>{const on=bs.has(b.dataset.favoriteBooth);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.textContent=on?'♥ 已收藏':'♡ 收藏社团'});qa('[data-wishlist-product]').forEach(b=>{const on=ps.has(b.dataset.wishlistProduct);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.textContent=on?'★ 已加入':'☆ 心愿'});qa('[data-wishlist-count]').forEach(el=>el.textContent=String(new Set([...x.booths,...x.products]).size))}
  function toggleFavorite(kind,id){const x=readFavorites(),key=kind==='booth'?'booths':'products',set=new Set(x[key]);set.has(id)?set.delete(id):set.add(id);x[key]=[...set];writeFavorites(x);paintFavorites();document.querySelector('.booth-directory-rich')?._applyDirectory?.()}
  function focusMapPoint(pointId){if(!pointId)return;const pin=document.querySelector('.map-pin[data-point-id="'+CSS.escape(pointId)+'"]');if(!pin)return;qa('.map-pin.focused').forEach(x=>x.classList.remove('focused'));pin.classList.add('focused');const pop=document.querySelector('#mapPop');if(pop)pop.innerHTML='<b>'+pin.dataset.name+'</b><br><span>'+pin.dataset.info+'</span>'+(pin.dataset.boothId?'<br><a href="#booths" data-page-link="booths" data-booth-id="'+pin.dataset.boothId+'">查看摊位与制品 →</a>':'');setTimeout(()=>pin.classList.remove('focused'),1800)}
  document.addEventListener('input',e=>{
    const boothSearch=e.target.closest?.('[data-booth-search]');if(boothSearch){const q=boothSearch.value.trim().toLowerCase(),savedOnly=document.querySelector('[data-booth-filter="saved"]')?.classList.contains('active'),fav=readFavorites(),bs=new Set(fav.booths),ps=new Set(fav.products);let shown=0;qa('.booth-rich').forEach(card=>{const matches=!q||String(card.dataset.search||'').includes(q),saved=bs.has(card.dataset.boothId)||[...card.querySelectorAll('[data-product-id]')].some(p=>ps.has(p.dataset.productId)),on=matches&&(!savedOnly||saved);card.hidden=!on;if(on)shown++});const empty=document.querySelector('.booth-no-result');if(empty)empty.hidden=shown>0}
    const mapSearch=e.target.closest?.('[data-map-search-input]');if(mapSearch){const q=mapSearch.value.trim().toLowerCase();qa('.map-search-result').forEach(b=>b.hidden=!!q&&!String(b.dataset.mapSearch||'').includes(q))}
  });
  document.addEventListener('click',e=>{
    const addMap=e.target.closest?.('[data-map-add-mode]');if(addMap&&getMode()==='edit'){e.preventDefault();const map=document.querySelector('#venueMap');if(map){map.classList.toggle('placing');addMap.classList.toggle('active',map.classList.contains('placing'));addMap.textContent=map.classList.contains('placing')?'在地图上点击位置…':'＋ 在地图上添加点位'}return}
    const map=document.querySelector('#venueMap');
    if(map?.classList.contains('placing')&&getMode()==='edit'&&e.target.closest?.('#venueMap')&&!e.target.closest?.('.map-pin,.map-pop,[data-map-add-mode]')){e.preventDefault();const rect=map.getBoundingClientRect(),x=Math.max(0,Math.min(100,((e.clientX-rect.left)/rect.width)*100)),y=Math.max(0,Math.min(100,((e.clientY-rect.top)/rect.height)*100));map.classList.remove('placing');const btn=document.querySelector('[data-map-add-mode]');if(btn){btn.classList.remove('active');btn.textContent='＋ 在地图上添加点位'}send({type:'OE_MAP_POINT_ADD',x:Number(x.toFixed(2)),y:Number(y.toFixed(2))});return}
    const mapLocate=e.target.closest?.('[data-map-locate]');if(mapLocate&&mapLocate.dataset.mapLocate){e.preventDefault();router.scrollHomeSection('map-home');requestAnimationFrame(()=>focusMapPoint(mapLocate.dataset.mapLocate));return}
    const boothFav=e.target.closest?.('[data-favorite-booth]');if(boothFav&&getMode()==='preview'){e.preventDefault();toggleFavorite('booth',boothFav.dataset.favoriteBooth);return}
    const productFav=e.target.closest?.('[data-wishlist-product]');if(productFav&&getMode()==='preview'){e.preventDefault();toggleFavorite('product',productFav.dataset.wishlistProduct);return}
    const filter=e.target.closest?.('[data-booth-filter]');if(filter&&getMode()==='preview'){e.preventDefault();qa('[data-booth-filter]').forEach(x=>x.classList.toggle('active',x===filter));document.querySelector('[data-booth-search]')?.dispatchEvent(new Event('input',{bubbles:true}));return}
    const boothJump=e.target.closest?.('a[data-booth-id]');if(boothJump){e.preventDefault();router.showPage('booths');requestAnimationFrame(()=>document.querySelector('#booth-'+CSS.escape(boothJump.dataset.boothId))?.scrollIntoView({behavior:'smooth',block:'start'}));return}
    if(e.target.closest?.('.brand')){e.preventDefault();router.showPage('home');return}
    const venueLink=e.target.closest?.('.venue-nav');
    if(venueLink&&getMode()==='edit'){e.preventDefault();send({type:'OE_SELECT_FIELD',path:'edition'});return}
    const ticketLink=e.target.closest?.('[data-ticket-settings]');
    if(ticketLink&&getMode()==='edit'){e.preventDefault();send({type:'OE_SELECT_FIELD',path:'ticketUrl'});return}
    const giftImage=e.target.closest?.('[data-ticket-image]');
    if(giftImage){const i=Number(giftImage.dataset.ticketImage);if(getMode()==='preview'){e.preventDefault();openGiftLightbox(getState().tickets?.[i]?.image);return}else{e.preventDefault();send({type:'OE_SELECT_ITEM',collection:'tickets',index:i});return}}
    const richImage=e.target.closest?.('[data-product-lightbox]');
    if(richImage&&getMode()==='preview'){e.preventDefault();openGiftLightbox(richImage.dataset.productLightbox);return}
    const item=e.target.closest?.('[data-oe-item]');if(item&&getMode()==='edit'){send({type:'OE_SELECT_ITEM',collection:item.dataset.oeItem,index:Number(item.dataset.oeIndex)});if(e.target.closest?.('a,button'))e.preventDefault();if(item.dataset.oeItem==='schedule'||item.dataset.oeItem==='mapPoints'){return}}
    const img=e.target.closest?.('[data-oe-image]');if(img&&getMode()==='edit'){e.preventDefault();send({type:'OE_SELECT_IMAGE',path:img.dataset.oeImage})}
    const a=e.target.closest?.('a[href^="#"]');if(a){
      const target=(a.dataset.pageLink||a.getAttribute('href').slice(1)||'home');
      if(target==='top')return;
      e.preventDefault();
      if(a.dataset.activityIndex!==undefined){router.showActivityDetail(a.dataset.activityIndex);return}
      if(a.dataset.targetMode==='home'||router.isHomeModule(target))router.scrollHomeSection(target);
      else if(router.isStandalonePage(target))router.showPage(target);
      else router.showPage('home');
    }
  });
}