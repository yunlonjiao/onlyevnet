export function createParticipation({qs:$,escapeHtml:esc,getState}){
  function renderParticipation(){
    const state=getState(),items=state.participation||[];
    const cards=scope=>items.map((x,i)=>{
      const external=String(x.url||'').trim(),target='activities';
      const attrs=external?' href="'+esc(external)+'" target="_blank" rel="noopener"':' href="#activities" data-target-mode="page" data-page-link="activities"';
      const id=scope==='page'?' id="participation-'+esc(x.id||String(i))+'"':'';
      const guests=(x.guestIds||[]).map(id=>(state.guests||[]).find(g=>g.id===id)).filter(Boolean);
      const guestHtml=guests.length?'<div class="activity-guest-line">'+guests.map(g=>'<span>'+esc(g.name)+'</span>').join('')+'</div>':'';
      return '<a class="participation-card reveal in"'+id+attrs+' data-oe-item="participation" data-oe-index="'+i+'><span class="participation-no">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(x.title||'活动')+'</b><small>'+esc(x.meta||'')+'</small><p>'+esc(x.text||'')+'</p>'+guestHtml+'</div><span class="participation-arrow">→</span></a>';
    }).join('');
    const home=$('#participation .participation-list');if(home)home.innerHTML=cards('home');
    const page=$('#activities .activity-project-list');if(page)page.innerHTML=cards('page');
  }
  return {renderParticipation};
}
