export function createParticipation({qs:$,escapeHtml:esc,getState,getMode,send}){
  const externalHref=value=>{const raw=String(value||'').trim();if(!raw)return '';if(/^https?:\/\//i.test(raw))return raw;if(/^www\./i.test(raw)||/^[\w.-]+\.[a-z]{2,}(?:[\/:?#]|$)/i.test(raw))return 'https://'+raw;return ''};

  const field=(path,value,tag='span',cls='')=>'<'+tag+' class="'+cls+'" data-oe-field="'+esc(path)+'" contenteditable="'+(getMode()==='edit'?'true':'false')+'">'+esc(value??'')+'</'+tag+'>';
  const shortMeta=x=>{
    const area=String(x?.area||'').trim(),meta=String(x?.meta||'').trim();
    if(area&&meta.startsWith(area+' · '))return meta.slice(area.length+3).trim();
    return meta;
  };
  function renderParticipation(){
    const state=getState(),items=state.participation||[],schedule=state.schedule||[];

    const home=$('#participation .featured-activity-grid');
    if(home){
      const slots=Array.isArray(state.featuredActivities)?state.featuredActivities.slice(0,3):[];
      const fallback=items.slice(0,3).map((x,i)=>({id:'fa'+(i+1),participationId:x.id}));
      const allPicks=(slots.length===3?slots:fallback).map((slot,slotIndex)=>({
        slot,slotIndex,x:items.find(a=>a.id===slot.participationId)
      }));
      const picks=getMode()==='edit'?allPicks:allPicks.filter(({x})=>!!x);
      const homeSection=home.closest('section');
      if(homeSection)homeSection.hidden=getMode()!=='edit'&&picks.length===0;
      home.innerHTML=picks.map(({slot,slotIndex,x},rank)=>{
        const activity=x||{};
        const cover=slot?.image||activity.image||'';
        const image=cover?'<div class="featured-activity-media"><img src="'+esc(cover)+'" alt="'+esc(activity.title||'活动')+'"></div>':'<div class="featured-activity-media is-empty"><span>FEATURED '+String(rank+1).padStart(2,'0')+'</span></div>';
        const meta=[activity.area,shortMeta(activity)].filter(Boolean).join(' · ');
        return '<a class="featured-activity-card reveal in" '+(!x?'data-featured-empty="1" ':'')+'href="#activities" data-target-mode="page" data-page-link="activities" data-activity-plan-id="'+esc(activity.id||'')+'" data-oe-item="featuredActivities" data-oe-index="'+slotIndex+'">'+
          image+'<div class="featured-activity-copy"><span class="featured-activity-kicker">'+(rank===0?'EDITOR\'S PICK':'FEATURED')+'</span>'+
          '<h3>'+esc(activity.title||'选择精选活动')+'</h3>'+(meta?'<small>'+esc(meta)+'</small>':'')+
          '<p>'+esc(activity.text||activity.detail||'')+'</p><span class="featured-activity-link">'+(activity.id?'查看活动详情 ↗':'点击设置活动')+'</span></div></a>';
      }).join('');
    }

    const page=$('#activities .activity-project-list');
    if(page)page.innerHTML=items.map((x,i)=>{
      const type=x.activityType||'general';
      const guests=(x.guestIds||[]).map(id=>(state.guests||[]).find(g=>g.id===id)).filter(Boolean);
      const linkedSchedule=schedule.map((row,index)=>({row,index})).filter(({row})=>row.participationId===x.id);
      const hasImage=!!String(x.image||'').trim();
      const image=hasImage
        ?'<button class="activity-feature-media" type="button" data-activity-select="'+i+'" data-oe-image="participation.'+i+'.image"><img src="'+esc(x.image)+'" alt="'+esc(x.title||'活动')+'"></button>'
        :(getMode()==='edit'?'<button class="activity-feature-media activity-feature-media-empty" type="button" data-activity-select="'+i+'" data-oe-image="participation.'+i+'.image"><span>ACTIVITY VISUAL</span><small>活动宣传图</small></button>':'');
      const scheduleInfo=linkedSchedule.length?'<div class="activity-feature-meta">'+linkedSchedule.map(({row})=>{
        const time=[row.time,row.endTime].filter(Boolean).join('–');
        return '<div class="activity-meta-item"><span>'+esc(row.day||'DAY 1')+'</span><b>'+esc(time||'时间待定')+'</b><small>'+esc(row.stage||'地点待定')+'</small></div>';
      }).join('')+'</div>':'';
      const venueInfo=type==='venue'?'<div class="activity-feature-meta"><div class="activity-meta-item"><span>VENUE</span><b>'+esc(x.activityLocation||'地点待定')+'</b><small>'+esc(x.availabilityNote||'全天开放')+'</small></div></div>':'';
      const typeLabel={guest:'GUEST EVENT',live:'LIVE / BAND',signing:'SIGNING',venue:'VENUE EVENT',interactive:'INTERACTIVE',general:'ACTIVITY'}[type]||'ACTIVITY';
      const guestLabel=type==='live'?'出演嘉宾':type==='guest'||type==='signing'?'出演嘉宾':'参与嘉宾';
      const guestHtml=guests.length?'<div class="activity-feature-guests"><span>'+guestLabel+'</span><div>'+guests.map(g=>'<a href="#guests" data-target-mode="page" data-page-link="guests" data-guest-id="'+esc(g.id)+'">'+esc(g.name)+'</a>').join('')+'</div></div>':'';
      const modules=[];
      if(String(x.detail||'').trim())modules.push('<section class="activity-module activity-module-wide"><span>ABOUT / 活动内容</span>'+field('participation.'+i+'.detail',x.detail,'p')+'</section>');
      if(String(x.participationMode||'').trim())modules.push('<section class="activity-module"><span>HOW TO JOIN / 参与方式</span>'+field('participation.'+i+'.participationMode',x.participationMode||'自由参加','b')+'</section>');
      if(String(x.requirements||'').trim())modules.push('<section class="activity-module activity-module-accent"><span>REQUIREMENTS / 参加要求</span>'+field('participation.'+i+'.requirements',x.requirements,'p')+'</section>');
      if(String(x.rules||'').trim())modules.push('<section class="activity-module"><span>RULES / 活动规则</span>'+field('participation.'+i+'.rules',x.rules,'p')+'</section>');
      const tracks=String(x.setlist||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
      if(type==='live'&&tracks.length)modules.push('<section class="activity-module activity-module-wide activity-setlist"><span>SETLIST / 歌单</span><ol>'+tracks.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol></section>');
      if(type==='signing'&&String(x.signingRules||'').trim())modules.push('<section class="activity-module activity-module-wide activity-module-accent"><span>SIGNING RULES / 签售规则</span>'+field('participation.'+i+'.signingRules',x.signingRules,'p')+'</section>');
      const actionHref=externalHref(x.url),action=actionHref?'<a class="activity-feature-action" href="'+esc(actionHref)+'" target="_blank" rel="noopener">报名 / 查看外部详情 ↗</a>':'';
      return '<article class="activity-feature activity-type-'+esc(type)+(hasImage||getMode()==='edit'?'':' no-media')+'" id="participation-'+esc(x.id||String(i))+'" data-oe-item="participation" data-oe-index="'+i+'>'+
        '<div class="activity-feature-copy">'+
          '<div class="activity-feature-head">'+
          '<div class="activity-access-title"><span class="activity-access-no">'+String(i+1).padStart(2,'0')+'</span>'+field('participation.'+i+'.title',x.title||'活动','h3')+'<span class="activity-access-type">'+typeLabel+'</span></div>'+
          '<div class="activity-access-rule"></div>'+
          (String(x.text||'').trim()?field('participation.'+i+'.text',x.text,'p','activity-feature-summary'):'')+
          (type==='venue'?venueInfo:scheduleInfo)+guestHtml+action+
          (modules.length?'<div class="activity-feature-body">'+modules.join('')+'</div>':'')+
          '</div>'+
        '</div>'+image+
      '</article>';
    }).join('');
    page.querySelectorAll('.activity-feature[data-oe-item="participation"]').forEach(card=>card.addEventListener('click',e=>{
      if(getMode()!=='edit'||e.target.closest?.('[data-oe-field],a[href],input,select,textarea,label'))return;
      e.preventDefault();e.stopPropagation();
      send?.({type:'OE_SELECT_ITEM',collection:'participation',index:Number(card.dataset.oeIndex)});
    }));
  }

  return {renderParticipation};
}
