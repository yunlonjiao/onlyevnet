export function createPassport({qs:$,qsa:qa,escapeHtml:esc,getState}){
  function renderPassport(){
    const section=$('#passport');if(!section)return;
    const state=getState(),allTasks=state.passport?.tasks||[];
    const moduleForTarget={booths:'booths',activities:'activities',freewalk:'freewalk',itasha:'itasha',highlights:'highlights'};
    const legacyTargets={A:'booths',B:'activities',C:'freewalk',D:'highlights',E:'itasha'};
    const resolveTarget=t=>t.target||legacyTargets[String(t.code||'').toUpperCase()]||'highlights';
    const tasks=allTasks.filter(t=>state.modules?.[moduleForTarget[resolveTarget(t)]]!==false);
    const required=Math.min(Number(state.passport?.required||tasks.length),tasks.length);
    const passStamps=section.querySelector('.pass-stamps'),zones=section.querySelector('.zone-list');
    if(passStamps)passStamps.innerHTML=tasks.map(t=>'<div class="pass-stamp" data-pass-code="'+esc(t.code)+'">'+esc(t.name)+'</div>').join('');
    if(zones)zones.innerHTML=tasks.map((t,i)=>{
      const target=resolveTarget(t),pageTarget=target==='booths'||target==='activities',mode=pageTarget?'page':'home';
      const linkTarget=(target==='freewalk'||target==='itasha')?'passport':target,linkMode=(target==='freewalk'||target==='itasha')?'home':mode;
      return '<a class="zone" href="#'+esc(linkTarget)+'" data-target-mode="'+linkMode+'" data-page-link="'+esc(linkTarget)+'"><span class="zone-no">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(t.name)+'</b><small>'+esc(t.location||'')+'</small></div><span>→</span></a>';
    }).join('');
    const p=section.querySelector('.passbook p');if(p)p.textContent=(state.passport?.reward||'')+' · '+required+' / '+tasks.length;
    updatePassportStamps();
  }
  function passportStorageKey(){return 'oe-passport:'+String(getState().eventName||'event').toLowerCase().replace(/\s+/g,'-')}
  function getPassportHits(){try{return JSON.parse(localStorage.getItem(passportStorageKey())||'[]')}catch{return []}}
  function addPassportHit(code){const hits=new Set(getPassportHits());hits.add(String(code).toUpperCase());localStorage.setItem(passportStorageKey(),JSON.stringify([...hits]));updatePassportStamps()}
  function updatePassportStamps(){const hits=new Set(getPassportHits());qa('[data-pass-code]').forEach(el=>el.classList.toggle('hit',hits.has(String(el.dataset.passCode).toUpperCase())))}
  function consumeStampParam(){
    const u=new URL(location.href),code=u.searchParams.get('stamp');if(!code)return;
    const valid=(getState().passport?.tasks||[]).some(t=>String(t.code).toUpperCase()===String(code).toUpperCase());
    if(valid)addPassportHit(code);
    u.searchParams.delete('stamp');history.replaceState(null,'',u.pathname+u.search+u.hash);
  }
  return {renderPassport,consumeStampParam};
}