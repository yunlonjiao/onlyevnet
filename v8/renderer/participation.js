export function createParticipation({qs:$,escapeHtml:esc,getState}){
  const optionalTargetModule={highlights:'highlights',freewalk:'freewalk',itasha:'itasha',guests:'guests'};
  function renderParticipation(){
    const section=$('#participation');if(!section)return;
    const state=getState(),list=section.querySelector('.participation-list');if(!list)return;
    const items=(state.participation||[]).filter(x=>{const key=optionalTargetModule[x.target];return !key||state.modules?.[key]!==false});
    list.innerHTML=items.map((x,i)=>{
      const external=String(x.url||'').trim(),target=x.target||'participation',pageTarget=target==='booths'||target==='activities'||target==='guide';
      const attrs=external?' href="'+esc(external)+'" target="_blank" rel="noopener"':' href="#'+esc(target)+'" data-target-mode="'+(pageTarget?'page':'home')+'" data-page-link="'+esc(target)+'"';
      return '<a class="participation-card reveal in"'+attrs+' data-oe-item="participation" data-oe-index="'+i+'><span class="participation-no">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(x.title||'活动')+'</b><small>'+esc(x.meta||'')+'</small><p>'+esc(x.text||'')+'</p></div><span class="participation-arrow">→</span></a>';
    }).join('');
  }
  return {renderParticipation};
}
