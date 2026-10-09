export function bindEditorEvents({getMode,getState,setDeep,send,router,openGiftLightbox,qsa:qa}){
  document.addEventListener('click',e=>{
    const productZoom=e.target.closest?.('[data-product-zoom]');
    if(productZoom){
      e.preventDefault();e.stopImmediatePropagation();
      openGiftLightbox(productZoom.dataset.productZoom);
      return;
    }
    if(getMode()!=='edit')return;
    const activitySelect=e.target.closest?.('[data-activity-select]');
    if(activitySelect){
      e.preventDefault();e.stopImmediatePropagation();
      send({type:'OE_SELECT_ITEM',collection:'participation',index:Number(activitySelect.dataset.activitySelect)});
      return;
    }
    const activityCard=e.target.closest?.('#activities .activity-feature[data-oe-item="participation"]');
    if(activityCard&&!e.target.closest?.('[data-oe-field],a[href],input,select,textarea,label')){
      e.preventDefault();e.stopPropagation();
      send({type:'OE_SELECT_ITEM',collection:'participation',index:Number(activityCard.dataset.oeIndex)});
      return;
    }
    const selectSurface=e.target.closest?.('[data-schedule-select]');
    if(selectSurface){
      e.preventDefault();e.stopPropagation();
      send({type:'OE_SELECT_ITEM',collection:'schedule',index:Number(selectSurface.dataset.scheduleSelect)});
      return;
    }
    const row=e.target.closest?.('#activities .timetable-row[data-oe-item="schedule"]');
    if(!row)return;
    if(e.target.closest?.('[data-oe-field],a,button,input,select,textarea,label'))return;
    e.preventDefault();e.stopPropagation();
    send({type:'OE_SELECT_ITEM',collection:'schedule',index:Number(row.dataset.oeIndex)});
  },true);
  document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||getMode()!=='edit')return;send({type:'OE_FIELD_FOCUS',path:el.dataset.oeField});send({type:'OE_SELECT_FIELD',path:el.dataset.oeField})},true);
  document.addEventListener('input',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||getMode()!=='edit')return;const path=el.dataset.oeField,value=el.textContent;setDeep(path,value);qa('[data-oe-field="'+CSS.escape(path)+'"]').forEach(x=>{if(x!==el)x.textContent=value});if(path.startsWith('ribbon')){const i=Number(path.replace('ribbon',''))-1;qa('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=value)}send({type:'OE_FIELD_CHANGE',path,value})});
  function favoriteKey(){return 'oe-wishlist:'+String(getState().eventName||'event').toLowerCase().replace(/\s+/g,'-')}
  function readFavorites(){try{const x=JSON.parse(localStorage.getItem(favoriteKey())||'{}'),state=getState(),validBooths=new Set((state.booths||[]).map(b=>b.id)),validProducts=new Set((state.booths||[]).flatMap(b=>(b.products||[]).map(p=>p.id))),clean={booths:(Array.isArray(x.booths)?x.booths:[]).filter(id=>validBooths.has(id)),products:(Array.isArray(x.products)?x.products:[]).filter(id=>validProducts.has(id))};if(JSON.stringify(clean)!==JSON.stringify({booths:Array.isArray(x.booths)?x.booths:[],products:Array.isArray(x.products)?x.products:[]}))localStorage.setItem(favoriteKey(),JSON.stringify(clean));return clean}catch{return {booths:[],products:[]}}}
  function writeFavorites(x){localStorage.setItem(favoriteKey(),JSON.stringify(x))}
  function paintFavorites(){const x=readFavorites(),bs=new Set(x.booths),ps=new Set(x.products);qa('[data-favorite-booth]').forEach(b=>{const on=bs.has(b.dataset.favoriteBooth);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.textContent=on?'♥ 已收藏':'♡ 收藏社团'});qa('[data-wishlist-product]').forEach(b=>{const on=ps.has(b.dataset.wishlistProduct);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.textContent=on?'★ 已加入':'☆ 心愿'});const dir=document.querySelector('#booths .booth-directory-rich'),view=dir?.dataset.directoryView==='products'?'products':'booths',count=view==='products'?x.products.length:x.booths.length;qa('[data-wishlist-count]').forEach(el=>el.textContent=String(count))}
  function toggleFavorite(kind,id){const x=readFavorites(),key=kind==='booth'?'booths':'products',set=new Set(x[key]);set.has(id)?set.delete(id):set.add(id);x[key]=[...set];writeFavorites(x);paintFavorites();document.querySelector('#booths .booth-directory-rich')?._applyDirectory?.()}
  function applyActivityFilters(){
    const root=document.querySelector('#activities');if(!root)return;
    const activeDay=root.querySelector('.activity-day-tabs [data-activity-day].active')?.dataset.activityDay||'';
    qa('#activities .timetable-row').forEach(row=>{
      row.hidden=!!activeDay&&row.dataset.activityDay!==activeDay;
    });
  }
  function setActivityView(view){
    const root=document.querySelector('#activities');if(!root)return;
    const next=view==='programs'?'programs':'timeline';
    qa('#activities [data-activity-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.activityView===next));
    qa('#activities [data-activity-panel]').forEach(panel=>panel.hidden=panel.dataset.activityPanel!==next);
  }
  function resetActivityFilters(){applyActivityFilters()}
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-directory-search],.booth-search'))return;
    const activityView=e.target.closest?.('[data-activity-view]');
    if(activityView){e.preventDefault();e.stopPropagation();setActivityView(activityView.dataset.activityView);return}
    const activityDay=e.target.closest?.('#activities .activity-day-tabs [data-activity-day]');
    if(activityDay){
      e.preventDefault();e.stopPropagation();qa('#activities .activity-day-tabs [data-activity-day]').forEach(x=>x.classList.toggle('active',x===activityDay));applyActivityFilters();return
    }
    const explore=e.target.closest?.('[data-explore-link]');
    if(explore&&getMode()==='preview'){
      e.preventDefault();
      const page=explore.dataset.pageLink||'home',kind=explore.dataset.exploreKind||'page',id=explore.dataset.exploreId||'';
      if(kind==='schedule'&&id){
        const index=(getState().schedule||[]).findIndex(x=>String(x.id)===String(id));
        if(index>=0){router.showActivityDetail(index);return}
      }
      router.showPage(page);
      if(page==='activities'&&kind==='participation')resetActivityFilters();
      if(kind!=='page'&&id)requestAnimationFrame(()=>{
        const selector=kind==='booth'?'#booth-'+CSS.escape(id):kind==='participation'?'#participation-'+CSS.escape(id):kind==='guest'?'#guest-'+CSS.escape(id):kind==='guide'?'#guide-'+CSS.escape(id):kind==='customitem'?'#customitem-'+CSS.escape(id):'';
        if(selector)document.querySelector(selector)?.scrollIntoView({behavior:'smooth',block:'start'});
      });
      return
    }
    const collectionPick=e.target.closest?.('[data-oe-collection]');
    if(collectionPick&&getMode()==='edit'&&!e.target.closest?.('[data-oe-item]')&&!e.target.closest?.('[data-oe-field]')){
      e.preventDefault();send({type:'OE_SELECT_COLLECTION',collection:collectionPick.dataset.oeCollection});return
    }
    const boothFav=e.target.closest?.('[data-favorite-booth]');if(boothFav&&getMode()==='preview'){e.preventDefault();e.stopPropagation();toggleFavorite('booth',boothFav.dataset.favoriteBooth);return}
    const productFav=e.target.closest?.('[data-wishlist-product]');if(productFav&&getMode()==='preview'){e.preventDefault();e.stopPropagation();toggleFavorite('product',productFav.dataset.wishlistProduct);return}
    const boothJump=e.target.closest?.('a[data-booth-id]');if(boothJump){e.preventDefault();router.showPage('booths');requestAnimationFrame(()=>document.querySelector('#booth-'+CSS.escape(boothJump.dataset.boothId))?.scrollIntoView({behavior:'smooth',block:'start'}));return}
    const guestJump=e.target.closest?.('a[data-guest-id]');if(guestJump){e.preventDefault();router.showPage('guests');requestAnimationFrame(()=>document.querySelector('#guest-'+CSS.escape(guestJump.dataset.guestId))?.scrollIntoView({behavior:'smooth',block:'start'}));return}
    const planJump=e.target.closest?.('a[data-activity-plan-id]');if(planJump&&getMode()==='preview'){e.preventDefault();router.showPage('activities');resetActivityFilters();setActivityView('programs');requestAnimationFrame(()=>document.querySelector('#participation-'+CSS.escape(planJump.dataset.activityPlanId))?.scrollIntoView({behavior:'smooth',block:'start'}));return}
    if(e.target.closest?.('.brand')){e.preventDefault();router.showPage('home');return}
    const venueLink=e.target.closest?.('.venue-nav');
    if(venueLink&&getMode()==='edit'){e.preventDefault();send({type:'OE_SELECT_FIELD',path:'edition'});return}
    const sharedVenueNav=e.target.closest?.('[data-navigation-settings]');
    if(sharedVenueNav&&getMode()==='edit'){e.preventDefault();send({type:'OE_SELECT_FIELD',path:'navigationUrl'});return}
    const ticketLink=e.target.closest?.('[data-ticket-settings]');
    if(ticketLink&&getMode()==='edit'){e.preventDefault();send({type:'OE_SELECT_FIELD',path:'ticketUrl'});return}
    const customItem=e.target.closest?.('[data-oe-custom-page]');
    if(customItem&&getMode()==='edit'){
      e.preventDefault();send({type:'OE_SELECT_CUSTOM_ITEM',pageId:customItem.dataset.oeCustomPage,index:Number(customItem.dataset.oeCustomIndex)});return
    }
    const customPageSettings=e.target.closest?.('[data-oe-custom-page-settings]');
    if(customPageSettings&&getMode()==='edit'){
      e.preventDefault();send({type:'OE_SELECT_CUSTOM_PAGE',pageId:customPageSettings.dataset.oeCustomPageSettings});return
    }
    const giftImage=e.target.closest?.('[data-ticket-image]');
    if(giftImage){const i=Number(giftImage.dataset.ticketImage);if(getMode()==='preview'){e.preventDefault();openGiftLightbox(getState().tickets?.[i]?.image);return}else{e.preventDefault();send({type:'OE_SELECT_ITEM',collection:'tickets',index:i});return}}
    const richImage=e.target.closest?.('[data-product-lightbox]');
    if(richImage&&getMode()!=='edit'){e.preventDefault();openGiftLightbox(richImage.dataset.productLightbox);return}
    const img=e.target.closest?.('[data-oe-image]');
    if(img&&getMode()==='edit'){e.preventDefault();send({type:'OE_SELECT_IMAGE',path:img.dataset.oeImage});return}
    const scheduleCard=e.target.closest?.('#activities .timetable-row[data-oe-item="schedule"]');
    if(scheduleCard&&getMode()==='edit'&&!e.target.closest?.('[data-oe-field]')){
      e.preventDefault();e.stopPropagation();send({type:'OE_SELECT_ITEM',collection:'schedule',index:Number(scheduleCard.dataset.oeIndex)});return
    }
    const item=e.target.closest?.('[data-oe-item]');if(item&&getMode()==='edit'&&!e.target.closest?.('[data-oe-field]')){send({type:'OE_SELECT_ITEM',collection:item.dataset.oeItem,index:Number(item.dataset.oeIndex)});if(e.target.closest?.('a,button'))e.preventDefault();return}
    if(e.target.closest?.('.booth-directory-rich')){e.preventDefault();return}
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