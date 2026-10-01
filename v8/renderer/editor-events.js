export function bindEditorEvents({getMode,getState,setDeep,send,router,openGiftLightbox,qsa:qa}){
  document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||getMode()!=='edit')return;send({type:'OE_FIELD_FOCUS',path:el.dataset.oeField});send({type:'OE_SELECT_FIELD',path:el.dataset.oeField})},true);
  document.addEventListener('input',e=>{const el=e.target.closest?.('[data-oe-field]');if(!el||getMode()!=='edit')return;const path=el.dataset.oeField;setDeep(path,el.textContent);if(path.startsWith('ribbon')){const i=Number(path.replace('ribbon',''))-1;qa('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=el.textContent)}send({type:'OE_FIELD_CHANGE',path,value:el.textContent})});
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

  document.addEventListener('click',e=>{
    if(e.target.closest?.('.brand')){e.preventDefault();router.showPage('home');return}
    const venueLink=e.target.closest?.('.venue-nav');
    if(venueLink&&getMode()==='edit'){e.preventDefault();send({type:'OE_SELECT_FIELD',path:'edition'});return}
    const giftImage=e.target.closest?.('[data-ticket-image]');
    if(giftImage){const i=Number(giftImage.dataset.ticketImage);if(getMode()==='preview'){e.preventDefault();openGiftLightbox(getState().tickets?.[i]?.image);return}else{e.preventDefault();send({type:'OE_SELECT_ITEM',collection:'tickets',index:i});return}}
    const richImage=e.target.closest?.('[data-product-lightbox]');
    if(richImage&&getMode()==='preview'){e.preventDefault();openGiftLightbox(richImage.dataset.productLightbox);return}
    const item=e.target.closest?.('[data-oe-item]');if(item&&getMode()==='edit'){send({type:'OE_SELECT_ITEM',collection:item.dataset.oeItem,index:Number(item.dataset.oeIndex)});if(item.dataset.oeItem==='schedule'||item.dataset.oeItem==='mapPoints'){e.preventDefault();return}}
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