export function createPassport({qs,qsa,escapeHtml,getState}){
  function renderPassport(){
   const section=qs('#passport');if(!section)return;
   const tasks=getState().passport?.tasks||[],required=Math.min(Number(getState().passport?.required||tasks.length),tasks.length);
   const passStamps=section.querySelector('.pass-stamps'),zones=section.querySelector('.zone-list');
   if(passStamps)passStamps.innerHTML=tasks.map(t=>'<div class="pass-stamp" data-pass-code="'+escapeHtml(t.code)+'">'+escapeHtml(t.name)+'</div>').join('');
   if(zones)zones.innerHTML=tasks.map((t,i)=>'<article class="zone"><span class="zone-no">'+String(i+1).padStart(2,'0')+'</span><div><b>'+escapeHtml(t.name)+'</b><small>'+escapeHtml(t.location||'')+'</small></div><span>QR</span></article>').join('');
   const p=section.querySelector('.passbook p');if(p)p.textContent=(getState().passport?.reward||'')+' · '+required+' / '+tasks.length;
   updatePassportStamps();
  }
  function passportStorageKey(){return 'oe-passport:'+String(getState().eventName||'event').toLowerCase().replace(/\s+/g,'-')}
  function getPassportHits(){try{return JSON.parse(localStorage.getItem(passportStorageKey())||'[]')}catch{return []}}
  function addPassportHit(code){const hits=new Set(getPassportHits());hits.add(String(code).toUpperCase());localStorage.setItem(passportStorageKey(),JSON.stringify([...hits]));updatePassportStamps()}
  function updatePassportStamps(){const hits=new Set(getPassportHits());qsa('[data-pass-code]').forEach(el=>el.classList.toggle('hit',hits.has(String(el.dataset.passCode).toUpperCase())))}
  function consumeStampParam(){
   const u=new URL(location.href),code=u.searchParams.get('stamp');if(!code)return;
   const valid=(getState().passport?.tasks||[]).some(t=>String(t.code).toUpperCase()===String(code).toUpperCase());
   if(valid)addPassportHit(code);
   u.searchParams.delete('stamp');history.replaceState(null,'',u.pathname+u.search+u.hash);
  }
  
  return {renderPassport,consumeStampParam,addPassportHit,updatePassportStamps};
}
