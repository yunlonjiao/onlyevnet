export function createParticipation({qs:$,escapeHtml:esc,getState}){
  const optionalTargetModule={freewalk:'freewalk',itasha:'itasha',guests:'guests'};
  function renderParticipation(){
    const state=getState();
    const items=(state.participation||[]).filter(x=>{const key=optionalTargetModule[x.target];return !key||state.modules?.[key]!==false});
    const cards=scope=>items.map((x,i)=>{
      const external=String(x.url||'').trim(),target=x.target||'activities',pageTarget=['booths','activities','guide','freewalk','itasha'].includes(target);
      const attrs=external?' href="'+esc(external)+'" target="_blank" rel="noopener"':' href="#'+esc(target)+'" data-target-mode="'+(pageTarget?'page':'home')+'" data-page-link="'+esc(target)+'"';
      const id=scope==='page'?' id="participation-'+esc(x.id||String(i))+'"':'';
      return '<a class="participation-card reveal in"'+id+attrs+' data-oe-item="participation" data-oe-index="'+i+'><span class="participation-no">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(x.title||'活动')+'</b><small>'+esc(x.meta||'')+'</small><p>'+esc(x.text||'')+'</p></div><span class="participation-arrow">→</span></a>';
    }).join('');
    const home=$('#participation .participation-list');if(home)home.innerHTML=cards('home');
    const page=$('#activities .activity-project-list');if(page)page.innerHTML=cards('page');
  }
  return {renderParticipation};
}
