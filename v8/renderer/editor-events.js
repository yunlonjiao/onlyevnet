export function bindEditorEvents({getMode,getState,setDeep,send,router,openGiftLightbox,qsa:qa}){
  document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||getMode()!=='edit')return;send({type:'OE_FIELD_FOCUS',path:el.dataset.oeField});send({type:'OE_SELECT_FIELD',path:el.dataset.oeField})},true);
  document.addEventListener('input',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||getMode()!=='edit')return;const path=el.dataset.oeField,value=el.textContent;setDeep(path,value);qa('[data-oe-field="'+CSS.escape(path)+'"]').forEach(x=>{if(x!==el)x.textContent=value});if(path.startsWith('ribbon')){const i=Number(path.replace('ribbon',''))-1;qa('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=value)}send({type:'OE_FIELD_CHANGE',path,value})});
  function favoriteKey(){return 'oe-wishlist:'+String(getState().eventName||'event').toLowerCase().replace(/\s+/g,'-')}
  function readFavorites(){try{const x=JSON.parse(localStorage.getItem(favoriteKey())||'{}');return {booths:Array.isArray(x.booths)?x.booths:[],products:Array.isArray(x.products)?x.products:[]}}catch{return {booths:[],products:[]}}}
  function writeFavorites(x){localStorage.setItem(favoriteKey(),JSON.stringify(x))}
  function paintFavorites(){const x=readFavorites(),bs=new Set(x.booths),ps=new Set(x.products);qa('[data-favorite-booth]').forEach(b=>{const on=bs.has(b.dataset.favoriteBooth);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.textContent=on?'♥ 已收藏':'♡ 收藏社团'});qa('[data-wishlist-product]').forEach(b=>{const on=ps.has(b.dataset.wishlistProduct);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.textContent=on?'★ 已加入':'☆ 心愿'});qa('[data-wishlist-count]').forEach(el=>el.textContent=String(new Set([...x.booths,...x.products]).size))}
  function toggleFavorite(kind,id){const x=readFavorites(),key=kind==='booth'?'booths':'products',set=new Set(x[key]);set.has(id)?set.delete(id):set.add(id);x[key]=[...set];writeFavorites(x);paintFavorites()}
  document.addEventListener('input',e=>{
    const boothSearch=e.target.closest?.('[data-booth-search]');if(boothSearch){const q=boothSearch.value.trim().toLowerCase(),savedOnly=document.querySelector('[data-booth-filter="saved"]')?.classList.contains('active'),fav=readFavorites(),bs=new Set(fav.booths),ps=new Set(fav.products);let shown=0;qa('.booth-rich').forEach(card=>{const matches=!q||String(card.dataset.search||'').includes(q),saved=bs.has(card.dataset.boothId)||[...card.querySelectorAll('[data-product-id]')].some(p=>ps.has(p.dataset.productId)),on=matches&&(!savedOnly||saved);card.hidden=!on;if(on)shown++});const empty=document.querySelector('.booth-no-result');if(empty)empty.hidden=shown>0}
  });
  document.addEventListener('click',e=>{
    const explore=e.target.closest?.('[data-explore-link]');
    if(explore&&getMode()==='preview'){
      e.preventDefault();
      const page=explore.dataset.pageLink||'home',kind=explore.dataset.exploreKind||'page',id=explore.dataset.exploreId||'';
      if(kind==='schedule'&&id){
        const index=(getState().schedule||[]).findIndex(x=>String(x.id)===String(id));
        if(index>=0){router.showActivityDetail(index);return}
      }
      router.showPage(page);
      if(kind!=='page'&&id)requestAnimationFrame(()=>{
        const selector=kind==='booth'?'#booth-'+CSS.escape(id):kind==='participation'?'#participation-'+CSS.escape(id):kind==='guest'?'#guest-'+CSS.escape(id):kind==='guide'?'#guide-'+CSS.escape(id):'';
        if(selector)document.querySelector(selector)?.scrollIntoView({behavior:'smooth',block:'start'});
      });
      return
    }
    const boothFav=e.target.closest?.('[data-favorite-booth]');if(boothFav&&getMode()==='preview'){e.preventDefault();toggleFavorite('booth',boothFav.dataset.favoriteBooth);return}
    const productFav=e.target.closest?.('[data-wishlist-product]');if(productFav&&getMode()==='preview'){e.preventDefault();toggleFavorite('product',productFav.dataset.wishlistProduct);return}
    const filter=e.target.closest?.('[data-booth-filter]');if(filter&&getMode()==='preview'){e.preventDefault();qa('[data-booth-filter]').forEach(x=>x.classList.toggle('active',x===filter));document.querySelector('[data-booth-search]')?.dispatchEvent(new Event('input',{bubbles:true}));return}
    const boothJump=e.target.closest?.('a[data-booth-id]');if(boothJump){e.preventDefault();router.showPage('booths');requestAnimationFrame(()=>document.querySelector('#booth-'+CSS.escape(boothJump.dataset.boothId))?.scrollIntoView({behavior:'smooth',block:'start'}));return}
    const guestJump=e.target.closest?.('a[data-guest-id]');if(guestJump){e.preventDefault();router.showPage('guests');requestAnimationFrame(()=>document.querySelector('#guest-'+CSS.escape(guestJump.dataset.guestId))?.scrollIntoView({behavior:'smooth',block:'start'}));return}
    const planJump=e.target.closest?.('a[data-activity-plan-id]');if(planJump&&getMode()==='preview'){e.preventDefault();router.showPage('activities');requestAnimationFrame(()=>document.querySelector('#participation-'+CSS.escape(planJump.dataset.activityPlanId))?.scrollIntoView({behavior:'smooth',block:'start'}));return}
    if(e.target.closest?.('.brand')){e.preventDefault();router.showPage('home');return}
    const venueLink=e.target.closest?.('.venue-nav');
    if(venueLink&&getMode()==='edit'){e.preventDefault();send({type:'OE_SELECT_FIELD',path:'edition'});return}
    const ticketLink=e.target.closest?.('[data-ticket-settings]');
    if(ticketLink&&getMode()==='edit'){e.preventDefault();send({type:'OE_SELECT_FIELD',path:'ticketUrl'});return}
    const giftImage=e.target.closest?.('[data-ticket-image]');
    if(giftImage){const i=Number(giftImage.dataset.ticketImage);if(getMode()==='preview'){e.preventDefault();openGiftLightbox(getState().tickets?.[i]?.image);return}else{e.preventDefault();send({type:'OE_SELECT_ITEM',collection:'tickets',index:i});return}}
    const richImage=e.target.closest?.('[data-product-lightbox]');
    if(richImage&&getMode()==='preview'){e.preventDefault();openGiftLightbox(richImage.dataset.productLightbox);return}
    const item=e.target.closest?.('[data-oe-item]');if(item&&getMode()==='edit'){send({type:'OE_SELECT_ITEM',collection:item.dataset.oeItem,index:Number(item.dataset.oeIndex)});if(e.target.closest?.('a,button'))e.preventDefault();return}
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