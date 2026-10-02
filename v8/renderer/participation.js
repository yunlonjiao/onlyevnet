export function createParticipation({qs:$,escapeHtml:esc,getState}){
  function renderParticipation(){
    const state=getState(),items=state.participation||[];

    const home=$('#participation .participation-list');
    if(home)home.innerHTML=items.map((x,i)=>
      '<a class="participation-card reveal in" href="#activities" data-target-mode="page" data-page-link="activities" data-activity-plan-id="'+esc(x.id||String(i))+'" data-oe-item="participation" data-oe-index="'+i+'>'+
      '<span class="participation-no">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(x.title||'活动')+'</b><small>'+esc(x.meta||'')+'</small><p>'+esc(x.text||'')+'</p></div><span class="participation-arrow">→</span></a>'
    ).join('');

    const page=$('#activities .activity-project-list');
    if(page)page.innerHTML=items.map((x,i)=>{
      const guests=(x.guestIds||[]).map(id=>(state.guests||[]).find(g=>g.id===id)).filter(Boolean);
      const image=x.image?'<button class="activity-detail-image" type="button" data-product-lightbox="'+esc(x.image)+'"><img src="'+esc(x.image)+'" alt="'+esc(x.title||'活动')+'"></button>':'';
      const rules=String(x.rules||'').trim()?'<div class="activity-rules"><b>参与规则</b><p>'+esc(x.rules)+'</p></div>':'';
      const guestHtml=guests.length?'<div class="activity-related"><b>参与嘉宾</b><div class="chip-row">'+guests.map(g=>'<a href="#guests" data-target-mode="page" data-page-link="guests" data-guest-id="'+esc(g.id)+'">'+esc(g.name)+'</a>').join('')+'</div></div>':'';
      const action=String(x.url||'').trim()?'<a class="activity-register" href="'+esc(x.url)+'" target="_blank" rel="noopener">报名 / 查看详情 ↗</a>':'';
      return '<article class="activity-program-detail'+(image?' has-image':'')+'" id="participation-'+esc(x.id||String(i))+'" data-oe-item="participation" data-oe-index="'+i+'>'+
        image+'<div class="activity-program-copy"><span>'+esc(x.meta||'')+'</span><h3>'+esc(x.title||'活动')+'</h3><p class="activity-program-summary">'+esc(x.text||'')+'</p><p class="activity-program-body">'+esc(x.detail||x.text||'')+'</p>'+rules+guestHtml+action+'</div></article>';
    }).join('');
  }
  return {renderParticipation};
}
