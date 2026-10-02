export function createCollections({qs:$,qsa:qa,escapeHtml:esc,getState,getMode}){
  function field(path,value,tag='span',cls=''){
    return '<'+tag+(cls?' class="'+cls+'"':'')+' data-oe-field="'+path+'" contenteditable="'+(getMode()==='edit')+'" spellcheck="false">'+esc(value??'')+'</'+tag+'>';
  }
  function renderRibbon(){
    const state=getState(),ribbon=$('.ribbon'),track=$('.ribbon-track');if(!ribbon||!track)return;
    const items=(state.ribbonItems||[]).map((item,index)=>({item,index})).filter(x=>String(x.item?.text||'').trim());
    if(!items.length){track.innerHTML='';ribbon.hidden=getMode()!=='edit';return}
    ribbon.hidden=false;
    const sequence=items.map(({item,index})=>field('ribbonItems.'+index+'.text',item.text,'span','ribbon-edit')).join('');
    track.innerHTML='<div class="ribbon-sequence">'+sequence+'</div><div class="ribbon-sequence" aria-hidden="true">'+sequence+'</div>';
    ribbon.setAttribute('role','marquee');
    ribbon.setAttribute('aria-label',items.map(x=>x.item.text).join(' · '));
    requestAnimationFrame(()=>{const seq=track.querySelector('.ribbon-sequence');if(!seq)return;const seconds=Math.max(16,Math.min(42,seq.scrollWidth/72));track.style.setProperty('--ribbon-duration',seconds.toFixed(2)+'s')});
  }

  function ensureLightbox(){
    let dlg=$('#giftLightbox');if(dlg)return dlg;
    dlg=document.createElement('dialog');dlg.id='giftLightbox';dlg.className='gift-lightbox';dlg.innerHTML='<button type="button" aria-label="关闭">×</button><img alt="图片预览">';
    document.body.appendChild(dlg);dlg.querySelector('button').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});return dlg;
  }
  function openGiftLightbox(src){if(!src)return;const dlg=ensureLightbox();dlg.querySelector('img').src=src;dlg.showModal()}
  function renderTickets(){
    const box=$('#tickets .ticket-grid');if(!box)return;const state=getState();
    box.innerHTML=(state.tickets||[]).map((x,i)=>{
      const image=x.image?'<button class="ticket-gift-image" type="button" data-ticket-image="'+i+'" aria-label="查看赠品图片"><img src="'+esc(x.image)+'" alt="'+esc(x.name||'')+' 赠品"></button>':'';
      return '<article class="ticket cut-ticket reveal in" data-oe-item="tickets" data-oe-index="'+i+'"><div class="ticket-top"><div class="ticket-copy">'+field('tickets.'+i+'.name',x.name,'h3')+'<div class="price" data-oe-field="tickets.'+i+'.price" contenteditable="'+(getMode()==='edit')+'" spellcheck="false">'+esc(x.price)+'</div></div>'+image+'</div><div class="gift"><b>包含 / 特典</b>\n'+field('tickets.'+i+'.gift',x.gift,'span')+'</div>'+field('tickets.'+i+'.note',x.note||'','small')+'</article>';
    }).join('');
    const raw=String(state.ticketUrl||'').trim(),valid=/^https?:\/\//i.test(raw),label=String(state.ticketLinkLabel||'前往官方售票平台').trim()||'前往官方售票平台';
    const ticketWrap=$('#tickets .ticket-actions');
    if(ticketWrap){
      ticketWrap.innerHTML='<a class="btn ticket-purchase-link" data-ticket-settings href="'+(valid?esc(raw):'#')+'" target="_blank" rel="noopener">'+esc(valid?label+' ↗':'设置购票平台链接')+'</a>';
      ticketWrap.hidden=!valid&&getMode()!=='edit';
    }
    const navLink=$('.nav .btn');
    if(navLink){
      navLink.classList.add('ticket-purchase-link');navLink.dataset.ticketSettings='1';
      navLink.href=valid?raw:'#';navLink.textContent=valid?label+' ↗':'设置购票链接';
      navLink.hidden=!valid&&getMode()!=='edit';
    }
  }

  function renderHighlights(){
    const box=$('#highlights .specials');if(!box)return;const state=getState();
    box.innerHTML=(state.highlights||[]).map((x,i)=>'<article class="special reveal in" data-oe-item="highlights" data-oe-index="'+i+'" style="--tone:'+esc(x.tone||'#ffe45c')+'">'+field('highlights.'+i+'.stamp',x.stamp||('STAMP '+String(i+1).padStart(2,'0')),'span','stamp')+field('highlights.'+i+'.title',x.title,'h3')+field('highlights.'+i+'.text',x.text,'p')+'</article>').join('');
  }

  function getGuest(id){return (getState().guests||[]).find(x=>x.id===id)}
  function getBooth(id){return (getState().booths||[]).find(x=>x.id===id)}

  function renderSchedule(){
    const state=getState(),items=state.schedule||[];
    const home=$('#schedule-home .timeline');
    if(home)home.innerHTML=items.map((x,i)=>{
      return '<a class="event reveal in" href="#activities" data-target-mode="page" data-page-link="activities" data-activity-index="'+i+'" data-oe-item="schedule" data-oe-index="'+i+'">'+field('schedule.'+i+'.time',x.time,'span')+field('schedule.'+i+'.title',x.title,'b')+'<span>'+esc(x.stage||'')+'</span><span>→</span></a>';
    }).join('');
    const detail=$('#activities .activity-detail-list');
    if(detail)detail.innerHTML=items.map((x,i)=>{
      const guests=(x.guestIds||[]).map(getGuest).filter(Boolean);
      const guestHtml=guests.length?'<div class="activity-related"><b>出席嘉宾</b><div class="chip-row">'+guests.map(g=>'<a href="#guests" data-target-mode="home" data-page-link="guests">'+esc(g.name)+'</a>').join('')+'</div></div>':'';
      const reg=x.registrationUrl?'<a class="activity-register" href="'+esc(x.registrationUrl)+'" target="_blank" rel="noopener">报名 / 查看外部页面 ↗</a>':'';
      return '<article class="activity-detail" id="schedule-'+esc(x.id||String(i))+'" data-activity-index="'+i+'" data-oe-item="schedule" data-oe-index="'+i+'"><span>'+esc(x.time||'')+' · '+esc(x.stage||'')+'</span>'+field('schedule.'+i+'.title',x.title,'h3')+field('schedule.'+i+'.detail',x.detail||'','p')+guestHtml+reg+'</article>';
    }).join('');
  }

  function renderGuide(){
    const state=getState(),items=state.guide?.items||[],homeCount=Math.max(0,Math.min(items.length,Number(state.guide?.homeCount??2)));
    const card=(x,i)=>{
      const image=x.image?'<button class="guide-image" type="button" data-product-lightbox="'+esc(x.image)+'" data-oe-image="guide.items.'+i+'.image"><img src="'+esc(x.image)+'" alt="'+esc(x.title||'观展指南')+'"></button>':'';
      return '<article id="guide-'+esc(x.id||String(i))+'" data-oe-item="guide" data-oe-index="'+i+'"><div class="guide-copy"><b>'+field('guide.items.'+i+'.title',x.title||'','span')+'</b>'+field('guide.items.'+i+'.text',x.text||'','p')+'</div>'+image+'</article>';
    };
    const home=$('#guide-home .guide-home-grid');if(home)home.innerHTML=items.slice(0,homeCount).map(card).join('');
    const detail=$('#guide .guide-detail-grid');if(detail)detail.innerHTML=items.map(card).join('');
  }

  function renderMap(){
    const state=getState(),map=state.venueMap||{},box=$('#venueMap'),rail=$('.map-link-rail'),list=$('.map-link-list');if(!box)return;
    box.dataset.oeImage='venueMap.image';box.classList.toggle('has-map',!!map.image);
    box.innerHTML=map.image?'<button class="map-image-view" type="button" data-product-lightbox="'+esc(map.image)+'" aria-label="查看场地图大图"><img src="'+esc(map.image)+'" alt="活动场地图"><span>查看大图 ↗</span></button>':'<div class="map-static-placeholder"><b>场地图</b><span>主办方暂未上传场地图</span></div>';
    const firstLevelPages=new Set(['booths','activities','guide','freewalk','itasha']);
    const links=(map.links||[]).map((item,index)=>({item,index})).filter(({item})=>{
      if(!String(item?.label||'').trim()||!firstLevelPages.has(item.target))return false;
      if(state.modules?.[item.target]===false)return false;
      return true;
    });
    if(list){
      list.innerHTML=links.map(({item:x,index})=>{
        const target=x.target||'activities',kind=x.itemType||'page',itemId=x.itemId||'';
        return '<a class="map-jump-tag" href="#'+esc(target)+'" data-target-mode="page" data-page-link="'+esc(target)+'" data-explore-link data-explore-kind="'+esc(kind)+'" data-explore-id="'+esc(itemId)+'" data-oe-item="explore" data-oe-index="'+index+'"><span>'+field('venueMap.links.'+index+'.label',x.label,'span')+'</span><i>↗</i></a>';
      }).join('');
    }
    if(rail)rail.hidden=!links.length;
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
    const boothCards=(state.booths||[]).map((b,i)=>{
      const logo=b.logo?'<img class="booth-logo" src="'+esc(b.logo)+'" alt="'+esc(b.name||'社团')+' logo">':'';
      const previews=(b.products||[]).filter(p=>p.image).slice(0,4).map(p=>'<button class="booth-preview-image" type="button" data-product-lightbox="'+esc(p.image)+'"><img src="'+esc(p.image)+'" alt="'+esc(p.name||'制品')+'"></button>').join('');
      const fav=savedBooths.has(b.id),search=[b.no,b.name,b.type,b.intro,...(b.products||[]).flatMap(p=>[p.name,p.note,p.price])].filter(Boolean).join(' ').toLowerCase();
      return '<article class="booth-directory-card" id="booth-'+esc(b.id)+'" data-directory-card data-kind="booth" data-booth-id="'+esc(b.id)+'" data-search="'+esc(search)+'" data-oe-item="booths" data-oe-index="'+i+'"><div class="booth-card-head">'+logo+'<div><span class="booth-no">'+esc(b.no||'')+'</span>'+field('booths.'+i+'.name',b.name,'h3')+'<small>'+esc(b.type||'')+'</small></div></div>'+field('booths.'+i+'.intro',b.intro||'','p')+(previews?'<div class="booth-preview-grid">'+previews+'</div>':'')+'<div class="booth-card-foot"><span>'+String((b.products||[]).length)+' 件制品</span><button class="favorite-booth'+(fav?' active':'')+'" type="button" data-favorite-booth="'+esc(b.id)+'" aria-pressed="'+fav+'">'+(fav?'♥ 已收藏':'♡ 收藏社团')+'</button></div></article>';
    }).join('');
    const productCards=(state.booths||[]).flatMap((b,i)=>(b.products||[]).map((p,j)=>{
      const wished=savedProducts.has(p.id),search=[p.name,p.note,p.price,b.no,b.name,b.type].filter(Boolean).join(' ').toLowerCase();
      const img=p.image?'<button class="directory-product-image" data-product-lightbox="'+esc(p.image)+'" data-oe-image="booths.'+i+'.products.'+j+'.image" type="button"><img src="'+esc(p.image)+'" alt="'+esc(p.name||'制品')+'"></button>':'<button class="directory-product-image empty" data-oe-image="booths.'+i+'.products.'+j+'.image" type="button">＋ 制品图片</button>';
      return '<article class="directory-product-card" data-directory-card data-kind="product" data-product-id="'+esc(p.id)+'" data-booth-id="'+esc(b.id)+'" data-search="'+esc(search)+'">'+img+'<div class="directory-product-copy"><b>'+esc(p.name||'未命名制品')+'</b><span>'+esc(p.price||'')+'</span><small>'+esc((b.no?b.no+' · ':'')+(b.name||''))+'</small></div><button class="wishlist-product'+(wished?' active':'')+'" type="button" data-wishlist-product="'+esc(p.id)+'" data-booth-id="'+esc(b.id)+'" aria-pressed="'+wished+'">'+(wished?'★ 已加入':'☆ 心愿')+'</button></article>';
    })).join('');
    const totalSaved=new Set([...saved.booths,...saved.products]).size;
    box.dataset.directoryView='booths';box.dataset.directoryPage='1';box.dataset.directorySaved='0';
    box.innerHTML='<div class="booth-directory-tools"><div class="directory-tabs"><button type="button" class="active" data-directory-view-btn="booths">社团</button><button type="button" data-directory-view-btn="products">制品</button></div><label class="booth-search"><span>⌕</span><input type="search" data-directory-search placeholder="搜索社团、摊位号或制品"></label><button type="button" data-directory-saved>我的收藏 <b data-wishlist-count>'+totalSaved+'</b></button></div><div class="booth-directory-grid" data-directory-grid="booths">'+boothCards+'</div><div class="product-directory-grid" data-directory-grid="products" hidden>'+productCards+'</div><div class="booth-no-result" hidden>没有找到匹配内容。</div><nav class="directory-pagination" aria-label="分页"></nav>';
    const apply=()=>{
      const view=box.dataset.directoryView||'booths',q=box.querySelector('[data-directory-search]')?.value.trim().toLowerCase()||'',savedOnly=box.dataset.directorySaved==='1',wish=readWishlist(),bs=new Set(wish.booths),ps=new Set(wish.products),perPage=view==='booths'?16:20;
      box.querySelectorAll('[data-directory-grid]').forEach(g=>g.hidden=g.dataset.directoryGrid!==view);
      const cards=[...box.querySelectorAll('[data-directory-grid="'+view+'"] [data-directory-card]')],matches=cards.filter(card=>{const base=!q||String(card.dataset.search||'').includes(q);if(!base)return false;if(!savedOnly)return true;return view==='booths'?bs.has(card.dataset.boothId):ps.has(card.dataset.productId)||bs.has(card.dataset.boothId)});
      const pages=Math.max(1,Math.ceil(matches.length/perPage));let page=Math.max(1,Math.min(pages,Number(box.dataset.directoryPage)||1));box.dataset.directoryPage=String(page);
      cards.forEach(c=>c.hidden=true);matches.slice((page-1)*perPage,page*perPage).forEach(c=>c.hidden=false);
      const pager=box.querySelector('.directory-pagination');if(pager)pager.innerHTML=matches.length>perPage?'<button type="button" data-directory-page="'+Math.max(1,page-1)+'" '+(page===1?'disabled':'')+'>←</button><span>'+page+' / '+pages+'</span><button type="button" data-directory-page="'+Math.min(pages,page+1)+'" '+(page===pages?'disabled':'')+'>→</button>':'';
      const empty=box.querySelector('.booth-no-result');if(empty)empty.hidden=matches.length>0;
    };
    box._applyDirectory=apply;
    box.onclick=e=>{const v=e.target.closest('[data-directory-view-btn]');if(v){box.dataset.directoryView=v.dataset.directoryViewBtn;box.dataset.directoryPage='1';box.querySelectorAll('[data-directory-view-btn]').forEach(x=>x.classList.toggle('active',x===v));apply();return}const s=e.target.closest('[data-directory-saved]');if(s){box.dataset.directorySaved=box.dataset.directorySaved==='1'?'0':'1';box.dataset.directoryPage='1';s.classList.toggle('active',box.dataset.directorySaved==='1');apply();return}const p=e.target.closest('[data-directory-page]');if(p&&!p.disabled){box.dataset.directoryPage=p.dataset.directoryPage;apply();box.scrollIntoView({behavior:'smooth',block:'start'})}};
    box.oninput=e=>{if(e.target.matches('[data-directory-search]')){box.dataset.directoryPage='1';apply()}};
    apply();
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

  function renderOptionalPages(){
    const state=getState();
    [['freewalk','COS / 自由行'],['itasha','痛车展示']].forEach(([key,fallback])=>{
      const root=$('[data-optional-page="'+key+'"]');if(!root)return;
      const item=state[key]||{},image=item.image?'<button class="optional-page-image" type="button" data-product-lightbox="'+esc(item.image)+'" data-oe-image="'+key+'.image"><img src="'+esc(item.image)+'" alt="'+esc(item.title||fallback)+'"></button>':(getMode()==='edit'?'<button class="optional-page-image empty" type="button" data-oe-image="'+key+'.image">＋ 上传活动图片</button>':'');
      root.innerHTML='<div class="optional-page-copy">'+field(key+'.title',item.title||fallback,'h3')+field(key+'.text',item.text||'','p')+'</div>'+image;
    });
  }

  function renderFooter(){
    const state=getState(),mods=state.modules||{};
    const on=k=>mods[k]!==false;
    const link=(href,label,mode='home')=>'<a href="#'+href+'" data-target-mode="'+mode+'" data-page-link="'+href+'">'+esc(label)+'</a>';
    const brand=$('.footer-brand');if(brand)brand.innerHTML='<h2>'+esc(state.eventName||'OnlyEvent')+'</h2><p>'+esc(state.date||'')+' · '+esc(state.edition||state.location||'')+'</p>';
    const participate=$('.footer-participate');if(participate){
      const links=[link('booths','摊位','page'),link('activities','活动','page')];
      if(on('guests'))links.push(link('guests','嘉宾'));
      if(on('freewalk'))links.push(link('freewalk','COS / 自由行','page'));
      if(on('itasha'))links.push(link('itasha','痛车','page'));
      participate.innerHTML='<b>参与</b><nav>'+links.join('')+'</nav>';
    }
    const visit=$('.footer-visit');if(visit)visit.innerHTML='<b>观展</b><nav>'+[link('tickets','票务'),link('map-home','场地图'),link('guide','观展指南','page')].join('')+'</nav>';
    const social=$('.footer-social');if(social){
      const links=(state.socialLinks||[]).map(x=>x.url?'<a href="'+esc(x.url)+'" target="_blank" rel="noopener">'+esc(x.label||'社群')+' ↗</a>':'<span>'+esc(x.label||'社群')+'</span>');
      social.innerHTML='<b>社群</b><nav>'+(links.length?links.join(''):'<span>社群入口由主办方配置</span>')+'</nav>';
    }
  }

  function renderCollections(){
    renderRibbon();renderTickets();renderSchedule();renderGuide();renderMap();renderBooths();renderGuests();renderUpdates();renderCommunity();renderSponsors();renderOptionalPages();renderFooter();
  }
  return {openGiftLightbox,renderRibbon,renderTickets,renderHighlights,renderSchedule,renderGuide,renderMap,renderBooths,renderGuests,renderUpdates,renderCommunity,renderSponsors,renderOptionalPages,renderFooter,renderCollections};
}