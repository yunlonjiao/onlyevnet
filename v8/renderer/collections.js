export function createCollections({qs:$,qsa:qa,escapeHtml:esc,getState,getMode}){
  function field(path,value,tag='span',cls=''){
    return '<'+tag+(cls?' class="'+cls+'"':'')+' data-oe-field="'+path+'" contenteditable="'+(getMode()==='edit')+'" spellcheck="false">'+esc(value??'')+'</'+tag+'>';
  }
  function ensureLightbox(){
    let dlg=$('#giftLightbox');if(dlg)return dlg;
    dlg=document.createElement('dialog');dlg.id='giftLightbox';dlg.className='gift-lightbox';dlg.innerHTML='<button type="button" aria-label="关闭">×</button><img alt="图片预览">';
    document.body.appendChild(dlg);dlg.querySelector('button').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});return dlg;
  }
  function openGiftLightbox(src){if(!src)return;const dlg=ensureLightbox();dlg.querySelector('img').src=src;dlg.showModal()}
  function cleanupTicketShell(){$('#tickets .section-no')?.remove();$('#tickets .ticket-actions')?.remove();$('.nav .btn')?.remove()}

  function renderTickets(){
    cleanupTicketShell();const box=$('#tickets .ticket-grid');if(!box)return;const state=getState();
    box.innerHTML=(state.tickets||[]).map((x,i)=>{
      const image=x.image?'<button class="ticket-gift-image" type="button" data-ticket-image="'+i+'" aria-label="查看赠品图片"><img src="'+esc(x.image)+'" alt="'+esc(x.name||'')+' 赠品"></button>':'';
      return '<article class="ticket cut-ticket reveal in" data-oe-item="tickets" data-oe-index="'+i+'"><div class="ticket-top"><div class="ticket-copy">'+field('tickets.'+i+'.name',x.name,'h3')+'<div class="price" data-oe-field="tickets.'+i+'.price" contenteditable="'+(getMode()==='edit')+'" spellcheck="false">'+esc(x.price)+'</div></div>'+image+'</div><div class="gift"><b>包含 / 特典</b>\n'+field('tickets.'+i+'.gift',x.gift,'span')+'</div>'+field('tickets.'+i+'.note',x.note||'','small')+'</article>';
    }).join('');
  }

  function renderHighlights(){
    const box=$('#highlights .specials');if(!box)return;const state=getState();
    box.innerHTML=(state.highlights||[]).map((x,i)=>'<article class="special reveal in" data-oe-item="highlights" data-oe-index="'+i+'" style="--tone:'+esc(x.tone||'#ffe45c')+'">'+field('highlights.'+i+'.stamp',x.stamp||('STAMP '+String(i+1).padStart(2,'0')),'span','stamp')+field('highlights.'+i+'.title',x.title,'h3')+field('highlights.'+i+'.text',x.text,'p')+'</article>').join('');
  }

  function getPoint(id){return (getState().venueMap?.points||[]).find(x=>x.id===id)}
  function getGuest(id){return (getState().guests||[]).find(x=>x.id===id)}
  function getBooth(id){return (getState().booths||[]).find(x=>x.id===id)}

  function renderSchedule(){
    const state=getState(),items=state.schedule||[];
    const home=$('#schedule-home .timeline');
    if(home)home.innerHTML=items.map((x,i)=>{
      const point=getPoint(x.locationId),where=point?.label||x.stage||'';
      return '<a class="event reveal in" href="#activities" data-target-mode="page" data-page-link="activities" data-activity-index="'+i+'" data-oe-item="schedule" data-oe-index="'+i+'">'+field('schedule.'+i+'.time',x.time,'span')+field('schedule.'+i+'.title',x.title,'b')+'<span>'+esc(where)+'</span><span>→</span></a>';
    }).join('');
    const detail=$('#activities .activity-detail-list');
    if(detail)detail.innerHTML=items.map((x,i)=>{
      const point=getPoint(x.locationId),guests=(x.guestIds||[]).map(getGuest).filter(Boolean);
      const guestHtml=guests.length?'<div class="activity-related"><b>出席嘉宾</b><div class="chip-row">'+guests.map(g=>'<a href="#guests" data-target-mode="home" data-page-link="guests">'+esc(g.name)+'</a>').join('')+'</div></div>':'';
      const locationHtml=point?'<a class="activity-location" href="#map-home" data-target-mode="home" data-page-link="map-home">⌖ '+esc(point.label)+' · 在地图查看</a>':'';
      const reg=x.registrationUrl?'<a class="activity-register" href="'+esc(x.registrationUrl)+'" target="_blank" rel="noopener">报名 / 查看外部页面 ↗</a>':'';
      return '<article class="activity-detail" id="activity-detail-'+i+'" data-oe-item="schedule" data-oe-index="'+i+'"><span>'+esc(x.time||'')+' · '+esc(x.stage||'')+'</span>'+field('schedule.'+i+'.title',x.title,'h3')+field('schedule.'+i+'.detail',x.detail||'','p')+locationHtml+guestHtml+reg+'</article>';
    }).join('');
  }

  function renderGuide(){
    const state=getState(),items=state.guide?.items||[],homeCount=Math.max(0,Math.min(items.length,Number(state.guide?.homeCount??2)));
    const card=(x,i)=>'<article data-oe-item="guide" data-oe-index="'+i+'"><b>'+field('guide.items.'+i+'.title',x.title||'','span')+'</b>'+field('guide.items.'+i+'.text',x.text||'','p')+'</article>';
    const home=$('#guide-home .guide-home-grid');if(home)home.innerHTML=items.slice(0,homeCount).map(card).join('');
    const detail=$('#guide .guide-detail-grid');if(detail)detail.innerHTML=items.map(card).join('');
  }

  function renderMap(){
    const state=getState(),map=state.venueMap||{},box=$('#venueMap'),pointsBox=$('#venueMap .map-points');if(!box||!pointsBox)return;
    if(map.image)box.style.backgroundImage='linear-gradient(rgba(255,255,255,.08),rgba(255,255,255,.08)),url("'+String(map.image).replace(/"/g,'%22')+'")';
    else box.style.backgroundImage='';
    const side=$('.map-home-side');if(side){
      const editTools=getMode()==='edit'?'<button type="button" data-map-add-mode>＋ 在地图上添加点位</button>':'';
      const boothButtons=(state.booths||[]).filter(b=>b.pointId).map(b=>'<button type="button" class="map-search-result" data-map-locate="'+esc(b.pointId)+'" data-map-search="'+esc([b.no,b.name,b.type,...(b.products||[]).map(p=>p.name)].filter(Boolean).join(' ').toLowerCase())+'"><b>'+esc(b.no||'')+'</b><span>'+esc(b.name||'')+'</span></button>').join('');
      side.innerHTML='<span class="ey">FIND A BOOTH</span><b>查摊位与制品</b><label class="map-search"><span>⌕</span><input type="search" data-map-search-input placeholder="搜索摊位号、社团或制品"></label><div class="map-search-results">'+boothButtons+'</div><div class="map-actions">'+editTools+'<button type="button" data-oe-image="venueMap.image">'+(map.image?'替换场地图':'上传场地图')+'</button><a class="btn" href="#booths" data-target-mode="page" data-page-link="booths">查看摊位详情 →</a></div>';
    }
    pointsBox.innerHTML=(map.points||[]).map((p,i)=>{
      let title=p.label||'点位',info=p.kind||'point';
      const b=(state.booths||[]).find(x=>x.pointId===p.id);if(b){title=(b.no||p.label)+' · '+b.name;info=(b.products||[]).slice(0,2).map(x=>x.name).join(' · ')||b.type||''}
      const linkedActivities=(state.schedule||[]).filter(a=>a.locationId===p.id);
      if(linkedActivities.length)info=linkedActivities.map(a=>a.time+' '+a.title).join(' / ');
      const booth=(state.booths||[]).find(x=>x.pointId===p.id),boothAttrs=booth?' data-booth-id="'+esc(booth.id)+'" data-booth-index="'+Math.max(0,(state.booths||[]).indexOf(booth))+'"':'';
      return '<button class="pin map-pin kind-'+esc(p.kind||'other')+'" style="left:'+Number(p.x||0)+'%;top:'+Number(p.y||0)+'%" data-point-id="'+esc(p.id)+'" data-name="'+esc(title)+'" data-info="'+esc(info)+'"'+boothAttrs+' data-oe-item="mapPoints" data-oe-index="'+i+'">'+esc(p.label||String(i+1))+'</button>';
    }).join('');
  }

  function wishlistKey(){
    return 'oe-wishlist:'+String(getState().eventName||'event').toLowerCase().replace(/\s+/g,'-');
  }
  function readWishlist(){
    try{const raw=JSON.parse(localStorage.getItem(wishlistKey())||'{}');return {booths:Array.isArray(raw.booths)?raw.booths:[],products:Array.isArray(raw.products)?raw.products:[]}}catch{return {booths:[],products:[]}}
  }
  function renderBooths(){
    const state=getState(),box=$('#booths .booth-directory-rich');if(!box)return;
    const saved=readWishlist(),savedBooths=new Set(saved.booths),savedProducts=new Set(saved.products);
    const cards=(state.booths||[]).map((b,i)=>{
      const products=(b.products||[]).map((p,j)=>{
        const img=p.image?'<button class="product-image" data-product-lightbox="'+esc(p.image)+'" data-oe-image="booths.'+i+'.products.'+j+'.image" type="button"><img src="'+esc(p.image)+'" alt="'+esc(p.name||'制品')+'"></button>':'<button class="product-image empty" type="button" data-oe-image="booths.'+i+'.products.'+j+'.image">＋ 图片</button>';
        const wished=savedProducts.has(p.id);
        return '<article class="product-card" data-product-index="'+j+'" data-product-id="'+esc(p.id)+'"><div class="product-media-wrap">'+img+'<button class="wishlist-product'+(wished?' active':'')+'" type="button" data-wishlist-product="'+esc(p.id)+'" data-booth-id="'+esc(b.id)+'" aria-pressed="'+wished+'">'+(wished?'★ 已加入':'☆ 心愿')+'</button></div><div>'+field('booths.'+i+'.products.'+j+'.name',p.name,'b')+field('booths.'+i+'.products.'+j+'.price',p.price||'','span','product-price')+field('booths.'+i+'.products.'+j+'.note',p.note||'','small')+'</div></article>';
      }).join('');
      const fav=savedBooths.has(b.id),search=[b.no,b.name,b.type,b.intro,...(b.products||[]).flatMap(p=>[p.name,p.note,p.price])].filter(Boolean).join(' ').toLowerCase();
      return '<article class="booth-rich" id="booth-'+esc(b.id)+'" data-booth-id="'+esc(b.id)+'" data-booth-point="'+esc(b.pointId||'')+'" data-search="'+esc(search)+'" data-oe-item="booths" data-oe-index="'+i+'"><div class="booth-rich-head"><span>'+esc(b.no||'')+'</span><div>'+field('booths.'+i+'.name',b.name,'h3')+'<small>'+esc(b.type||'')+'</small></div><button class="favorite-booth'+(fav?' active':'')+'" type="button" data-favorite-booth="'+esc(b.id)+'" aria-pressed="'+fav+'">'+(fav?'♥ 已收藏':'♡ 收藏社团')+'</button></div>'+field('booths.'+i+'.intro',b.intro||'','p')+'<div class="product-grid">'+products+'</div><a class="booth-map-link" href="#map-home" data-target-mode="home" data-page-link="map-home" data-map-locate="'+esc(b.pointId||'')+'">⌖ '+esc(getPoint(b.pointId)?.label||b.no||'查看地图')+'</a></article>';
    }).join('');
    const totalSaved=new Set([...saved.booths,...saved.products]).size;
    box.innerHTML='<div class="booth-directory-tools"><label class="booth-search"><span>⌕</span><input type="search" data-booth-search placeholder="搜索社团、摊位号或制品"></label><button type="button" data-booth-filter="saved">我的收藏 <b data-wishlist-count>'+totalSaved+'</b></button><button type="button" data-booth-filter="all" class="active">全部摊位</button></div><div class="booth-directory-grid">'+cards+'</div><div class="booth-no-result" hidden>没有找到匹配的摊位或制品。</div>';
  }

  function renderGuests(){
    const state=getState(),box=$('#guests .guest-grid');if(!box)return;
    box.innerHTML=(state.guests||[]).map((g,i)=>{
      const activities=(state.schedule||[]).filter(a=>(a.guestIds||[]).includes(g.id));
      const img=g.image?'<button class="guest-image" data-product-lightbox="'+esc(g.image)+'" data-oe-image="guests.'+i+'.image" type="button"><img src="'+esc(g.image)+'" alt="'+esc(g.name||'嘉宾')+'"></button>':'<button class="guest-image empty" type="button" data-oe-image="guests.'+i+'.image">＋ 嘉宾图</button>';
      const schedule=activities.length?'<div class="guest-appearances">'+activities.map(a=>'<a href="#activities" data-target-mode="page" data-page-link="activities" data-activity-index="'+Math.max(0,(state.schedule||[]).indexOf(a))+'">'+esc(a.time)+' '+esc(a.title)+'</a>').join('')+'</div>':'';
      const appearance=g.appearance?'<div class="guest-note"><b>签售 / 舞台</b>'+field('guests.'+i+'.appearance',g.appearance,'span')+'</div>':'';
      const social=g.socialUrl?'<a class="guest-social" href="'+esc(g.socialUrl)+'" target="_blank" rel="noopener">'+esc(g.socialLabel||'社交平台')+' ↗</a>':'';
      return '<article class="guest-card guest-rich" id="guest-'+esc(g.id)+'" data-oe-item="guests" data-oe-index="'+i+'">'+img+'<div class="guest-copy">'+field('guests.'+i+'.name',g.name,'b')+field('guests.'+i+'.role',g.role||'','small')+field('guests.'+i+'.works',g.works||'','span','guest-works')+field('guests.'+i+'.intro',g.intro||'','p')+appearance+schedule+social+'</div></article>';
    }).join('');
  }

  function renderUpdates(){
    const state=getState(),box=$('#updates .updates-list');if(!box)return;
    const items=(state.updates||[]).slice(0,3);
    box.innerHTML=items.map((u,i)=>'<a class="update-item" href="#'+esc(u.target||'top')+'" data-target-mode="home" data-page-link="'+esc(u.target||'top')+'" data-oe-item="updates" data-oe-index="'+i+'"><time>'+esc(u.date||'')+'</time>'+field('updates.'+i+'.title',u.title||'','b')+'<span>→</span></a>').join('');
    $('#updates')?.classList.toggle('oe-page-hidden',items.length===0);
  }

  function renderCommunity(){
    const state=getState(),box=$('#community .community');if(!box)return;
    box.innerHTML=(state.socialLinks||[]).map((x,i)=>{
      const img=x.image?'<button class="social-image" data-product-lightbox="'+esc(x.image)+'" data-oe-image="socialLinks.'+i+'.image" type="button"><img src="'+esc(x.image)+'" alt="'+esc(x.label||'社群')+'"></button>':'<button class="social-image empty" data-oe-image="socialLinks.'+i+'.image" type="button">＋ 图片 / 二维码</button>';
      const action=x.url?'<a class="social-action" href="'+esc(x.url)+'" target="_blank" rel="noopener">进入 ↗</a>':'<span class="social-action muted">未设置链接</span>';
      return '<article data-oe-item="socialLinks" data-oe-index="'+i+'">'+field('socialLinks.'+i+'.label',x.label,'b')+field('socialLinks.'+i+'.note',x.note||'','p')+img+action+'</article>';
    }).join('');
  }

  function renderSponsors(){
    const state=getState(),box=$('.sponsors');if(!box)return;
    box.innerHTML=(state.sponsors||[]).map((x,i)=>{
      const logo=x.logo?'<button class="sponsor-logo" data-product-lightbox="'+esc(x.logo)+'" data-oe-image="sponsors.'+i+'.logo" type="button"><img src="'+esc(x.logo)+'" alt="'+esc(x.name||'赞助商')+'"></button>':'<button class="sponsor-logo empty" data-oe-image="sponsors.'+i+'.logo" type="button">＋ Logo</button>';
      const name=field('sponsors.'+i+'.name',x.name||'','b');
      const level=field('sponsors.'+i+'.level',x.level||'','small');
      const action=x.url?'<a class="sponsor-link" href="'+esc(x.url)+'" target="_blank" rel="noopener">访问 ↗</a>':'';
      return '<article class="sponsor-card" data-oe-item="sponsors" data-oe-index="'+i+'">'+logo+'<div class="sponsor-copy">'+name+level+'</div>'+action+'</article>';
    }).join('');
  }

  function renderFooter(){
    const state=getState(),mods=state.modules||{};
    const on=k=>mods[k]!==false;
    const link=(href,label,mode='home')=>'<a href="#'+href+'" data-target-mode="'+mode+'" data-page-link="'+href+'">'+esc(label)+'</a>';
    const brand=$('.footer-brand');if(brand)brand.innerHTML='<h2>'+esc(state.eventName||'OnlyEvent')+'</h2><p>'+esc(state.date||'')+' · '+esc(state.edition||state.location||'')+'</p>';
    const participate=$('.footer-participate');if(participate){
      const links=[link('booths','摊位详情','page'),link('passport','活动参与'),link('activities','活动详情','page')];
      if(on('guests'))links.push(link('guests','嘉宾'));
      if(on('freewalk'))links.push(link('passport','自由行'));
      if(on('itasha'))links.push(link('passport','痛车'));
      participate.innerHTML='<b>参与</b><nav>'+links.join('')+'</nav>';
    }
    const visit=$('.footer-visit');if(visit)visit.innerHTML='<b>观展</b><nav>'+[link('tickets','票务'),link('map-home','场地图'),link('schedule-home','当天日程'),link('guide','观展指南','page')].join('')+'</nav>';
    const social=$('.footer-social');if(social){
      const links=(state.socialLinks||[]).map(x=>x.url?'<a href="'+esc(x.url)+'" target="_blank" rel="noopener">'+esc(x.label||'社群')+' ↗</a>':'<span>'+esc(x.label||'社群')+'</span>');
      social.innerHTML='<b>社群</b><nav>'+(links.length?links.join(''):'<span>社群入口由主办方配置</span>')+'</nav>';
    }
  }

  function renderCollections(){
    renderTickets();renderHighlights();renderSchedule();renderGuide();renderMap();renderBooths();renderGuests();renderUpdates();renderCommunity();renderSponsors();renderFooter();
  }
  return {openGiftLightbox,renderTickets,renderHighlights,renderSchedule,renderGuide,renderMap,renderBooths,renderGuests,renderUpdates,renderCommunity,renderSponsors,renderFooter,renderCollections};
}