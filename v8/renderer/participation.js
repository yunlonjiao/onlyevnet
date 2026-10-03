export function createParticipation({qs:$,escapeHtml:esc,getState}){
  const shortMeta=x=>{
    const area=String(x?.area||'').trim(),meta=String(x?.meta||'').trim();
    if(area&&meta.startsWith(area+' · '))return meta.slice(area.length+3).trim();
    return meta;
  };
  function renderParticipation(){
    const state=getState(),items=state.participation||[],schedule=state.schedule||[];

    const home=$('#participation .participation-list');
    if(home)home.innerHTML=items.map((x,i)=>
      '<a class="participation-card reveal in" href="#activities" data-target-mode="page" data-page-link="activities" data-activity-plan-id="'+esc(x.id||String(i))+'" data-oe-item="participation" data-oe-index="'+i+'>'+
      '<span class="participation-no">'+String(i+1).padStart(2,'0')+'</span><div><b>'+esc(x.title||'活动')+'</b><small>'+esc([x.area,shortMeta(x)].filter(Boolean).join(' · '))+'</small><p>'+esc(x.text||'')+'</p></div><span class="participation-arrow">→</span></a>'
    ).join('');

    const categories=[...new Set(items.map(x=>String(x.category||'其他').trim()).filter(Boolean))];
    const areas=[...new Set(items.map(x=>String(x.area||'活动区域').trim()).filter(Boolean))];
    const filters=$('#activities .activity-filter-bar');
    if(filters)filters.innerHTML=
      '<div class="activity-filter-main"><span>分类</span><div class="activity-filter-chips">'+
      '<button type="button" class="active" data-activity-filter-value="">全部</button>'+
      categories.map(x=>'<button type="button" data-activity-filter-value="'+esc(x)+'">'+esc(x)+'</button>').join('')+
      '</div></div>'+
      '<label class="activity-area-filter"><span>区域</span><select data-activity-area-filter><option value="">全部区域</option>'+
      areas.map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('')+
      '</select></label><span class="activity-filter-count" data-activity-filter-count>共 '+items.length+' 个活动</span>';

    const page=$('#activities .activity-project-list');
    if(page)page.innerHTML=items.map((x,i)=>{
      const guests=(x.guestIds||[]).map(id=>(state.guests||[]).find(g=>g.id===id)).filter(Boolean);
      const linkedSchedule=schedule.map((row,index)=>({row,index})).filter(({row})=>row.participationId===x.id);
      const image=x.image?'<button class="activity-detail-image" type="button" data-product-lightbox="'+esc(x.image)+'"><img src="'+esc(x.image)+'" alt="'+esc(x.title||'活动')+'"></button>':'';
      const rules=String(x.rules||'').trim()?'<div class="activity-rules"><b>参与规则</b><p>'+esc(x.rules)+'</p></div>':'';
      const guestHtml=guests.length?'<div class="activity-related"><b>参与嘉宾</b><div class="chip-row">'+guests.map(g=>'<a href="#guests" data-target-mode="page" data-page-link="guests" data-guest-id="'+esc(g.id)+'">'+esc(g.name)+'</a>').join('')+'</div></div>':'';
      const scheduleHtml=linkedSchedule.length?'<div class="activity-related activity-schedule-links"><b>相关日程</b><div class="chip-row">'+linkedSchedule.map(({row,index})=>'<a href="#activities" data-activity-index="'+index+'">'+esc((row.time?row.time+' ':'')+(row.title||'日程'))+'</a>').join('')+'</div></div>':'';
      const action=String(x.url||'').trim()?'<a class="activity-register" href="'+esc(x.url)+'" target="_blank" rel="noopener">报名 / 查看详情 ↗</a>':'';
      const category=String(x.category||'其他').trim(),area=String(x.area||'活动区域').trim();
      const meta='<div class="activity-program-meta"><span class="activity-category">'+esc(category)+'</span><span class="activity-area">'+esc(area)+'</span>'+(shortMeta(x)?'<span>'+esc(shortMeta(x))+'</span>':'')+'</div>';
      return '<article class="activity-program-detail'+(image?' has-image':'')+'" id="participation-'+esc(x.id||String(i))+'" data-activity-category="'+esc(category)+'" data-activity-area="'+esc(area)+'" data-oe-item="participation" data-oe-index="'+i+'>'+
        image+'<div class="activity-program-copy">'+meta+'<h3>'+esc(x.title||'活动')+'</h3><p class="activity-program-summary">'+esc(x.text||'')+'</p><p class="activity-program-body">'+esc(x.detail||x.text||'')+'</p>'+rules+guestHtml+scheduleHtml+action+'</div></article>';
    }).join('');
  }
  return {renderParticipation};
}
