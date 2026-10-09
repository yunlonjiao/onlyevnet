export function createCollections({qs:$,qsa:qa,escapeHtml:esc,getState,getMode,send}){
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
    const raw=String(state.ticketUrl||'').trim(),href=externalHref(raw),valid=!!href,label=String(state.ticketLinkLabel||'前往官方售票平台').trim()||'前往官方售票平台';
    const ticketWrap=$('#tickets .ticket-actions');
    if(ticketWrap){
      ticketWrap.innerHTML='<a class="btn ticket-purchase-link" data-ticket-settings href="'+(valid?esc(href):'#')+'" target="_blank" rel="noopener">'+esc(valid?label+' ↗':'设置购票平台链接')+'</a>';
      ticketWrap.hidden=!valid&&getMode()!=='edit';
    }
    const navLink=$('.nav .btn');
    if(navLink){
      navLink.classList.add('ticket-purchase-link');navLink.dataset.ticketSettings='1';
      navLink.href=valid?href:'#';navLink.textContent=valid?label+' ↗':'设置购票链接';
      navLink.hidden=!valid&&getMode()!=='edit';
    }
  }

  function renderHighlights(){
    const box=$('#highlights .specials');if(!box)return;const state=getState();
    box.innerHTML=(state.highlights||[]).map((x,i)=>'<article class="special reveal in" data-oe-item="highlights" data-oe-index="'+i+'" style="--tone:'+esc(x.tone||'#ffe45c')+'">'+field('highlights.'+i+'.stamp',x.stamp||('STAMP '+String(i+1).padStart(2,'0')),'span','stamp')+field('highlights.'+i+'.title',x.title,'h3')+field('highlights.'+i+'.text',x.text,'p')+'</article>').join('');
  }

  function getGuest(id){return (getState().guests||[]).find(x=>x.id===id)}
  function getBooth(id){return (getState().booths||[]).find(x=>x.id===id)}
  function externalHref(value){
    const raw=String(value||'').trim();if(!raw)return '';
    if(/^https?:\/\//i.test(raw))return raw;
    if(/^www\./i.test(raw)||/^[\w.-]+\.[a-z]{2,}(?:[\/:?#]|$)/i.test(raw))return 'https://'+raw;
    return '';
  }

  function renderSchedule(){
    const state=getState(),items=state.schedule||[];
    const normalized=items.map((x,i)=>{
      const plan=(state.participation||[]).find(p=>p.id===x.participationId);
      return {
        x,i,plan,
        day:String(x.day||'DAY 1').trim()||'DAY 1',
        area:String(x.stage||plan?.area||'活动区域').trim()||'活动区域',
        endTime:String(x.endTime||'').trim()
      };
    });
    const detail=$('#activities .activity-detail-list');
    if(detail){
      const days=[...new Set(normalized.map(r=>r.day))];
      detail.innerHTML=normalized.map(({x,i,plan,day,area,endTime})=>{
        const guestIds=[...new Set([...(x.guestIds||[]),...(plan?.guestIds||[])])];
        const guests=guestIds.map(getGuest).filter(Boolean);
        const guestHtml=guests.length?'<div class="timetable-guests"><span class="timetable-guests-label">嘉宾：</span>'+guests.map(g=>'<a href="#guests" data-target-mode="page" data-page-link="guests" data-guest-id="'+esc(g.id)+'">'+esc(g.name)+'</a>').join('')+'</div>':'';
        const planLink=plan?'<a class="timetable-plan-link" href="#activities" data-activity-plan-id="'+esc(plan.id)+'">活动详情 →</a>':'';
        const regHref=externalHref(x.registrationUrl),reg=regHref?'<a class="timetable-action" href="'+esc(regHref)+'" target="_blank" rel="noopener">报名 / 外部详情 ↗</a>':'';
        const range=[x.time,endTime].filter(Boolean);
        return '<article class="timetable-row" id="schedule-'+esc(x.id||String(i))+'" data-activity-index="'+i+'" data-activity-day="'+esc(day)+'" data-activity-area="'+esc(area)+'" data-oe-item="schedule" data-oe-index="'+i+'>'+
          '<button type="button" class="schedule-card-select" data-schedule-select="'+i+'" aria-label="编辑本条日程"></button>'+
          '<div class="timetable-no">'+String(i+1).padStart(2,'0')+'</div>'+
          '<div class="timetable-time">'+field('schedule.'+i+'.time',range[0]||'时间待定','strong')+(range[1]?'<span>—</span>'+field('schedule.'+i+'.endTime',range[1],'small'):'')+'<em>'+esc(day)+'</em></div>'+
          '<div class="timetable-main"><div class="timetable-kicker"><span>VENUE</span>'+field('schedule.'+i+'.stage',area,'span')+'</div>'+field('schedule.'+i+'.title',x.title,'b')+field('schedule.'+i+'.detail',x.detail||'','p')+guestHtml+
          ((planLink||reg)?'<div class="timetable-links">'+planLink+reg+'</div>':'')+'</div></article>';
      }).join('');
      detail.querySelectorAll('.timetable-row[data-oe-item="schedule"]').forEach(row=>row.addEventListener('click',e=>{
        if(getMode()!=='edit'||e.target.closest?.('[data-oe-field],a,button,input,select,textarea,label'))return;
        e.preventDefault();e.stopPropagation();
        send?.({type:'OE_SELECT_ITEM',collection:'schedule',index:Number(row.dataset.oeIndex)});
      }));
      const dayBar=$('#activities .activity-day-tabs');
      if(dayBar){
        dayBar.hidden=days.length<=1;
        dayBar.innerHTML=days.map((day,i)=>'<button type="button" data-activity-day="'+esc(day)+'" class="'+(i===0?'active':'')+'">'+esc(day)+'</button>').join('');
      }
    }
  }

  function renderGuide(){
    const state=getState(),items=state.guide?.items||[],homeCount=Math.max(0,Math.min(items.length,Number(state.guide?.homeCount??2)));
    const kindLabel={traffic:'ACCESS',admission:'ENTRY',facilities:'FACILITY',cosplay:'COSPLAY',safety:'SAFETY'};
    const card=(x,i,scope)=>{
      const preset=x.preset||'custom',traffic=preset==='traffic';
      if(scope==='detail'&&traffic){
        const image=x.image
          ?'<button class="guide-access-media" type="button" data-product-lightbox="'+esc(x.image)+'" data-oe-image="guide.items.'+i+'.image"><img src="'+esc(x.image)+'" alt="'+esc(x.title||'交通路线图')+'"></button>'
          :(getMode()==='edit'?'<button class="guide-access-media guide-access-media-empty" type="button" data-oe-image="guide.items.'+i+'.image"><span>ROUTE / MAP</span><small>上传交通路线图或入口示意图</small></button>':'');
        const navigationHref=externalHref(state.navigationUrl),navigation=navigationHref?'<a class="btn guide-venue-nav" data-navigation-settings href="'+esc(navigationHref)+'" target="_blank" rel="noopener">导航到场馆 <span>↗</span></a>':'<button class="btn guide-venue-nav guide-venue-nav-empty" type="button" data-navigation-settings>设置场馆导航 <span>↗</span></button>';
        return '<article class="guide-access'+(x.image?' has-media':'')+'" id="guide-'+esc(x.id||String(i))+'" data-oe-item="guide" data-oe-index="'+i+'"><div class="guide-access-copy"><div class="guide-access-head"><span class="guide-chapter-no guide-access-no">'+String(i+1).padStart(2,'0')+'</span><b class="guide-access-heading">'+field('guide.items.'+i+'.title',x.title||'','span')+'</b><small class="guide-access-label">'+esc(x.label||kindLabel[preset]||'GUIDE')+'</small></div><div class="guide-access-rule"></div><div class="guide-body">'+field('guide.items.'+i+'.text',x.text||'','p')+'</div>'+navigation+'</div>'+image+'</article>';
      }
      return '<article class="guide-chapter guide-kind-'+esc(preset)+'" id="guide-'+esc(x.id||String(i))+'" data-oe-item="guide" data-oe-index="'+i+'"><span class="guide-chapter-no">'+String(i+1).padStart(2,'0')+'</span><div class="guide-chapter-main"><div class="guide-chapter-head"><b>'+field('guide.items.'+i+'.title',x.title||'','span')+'</b><small>'+esc(x.label||kindLabel[preset]||'GUIDE')+'</small></div><div class="guide-body">'+field('guide.items.'+i+'.text',x.text||'','p')+'</div></div></article>';
    };
    const home=$('#guide-home .guide-home-grid');if(home)home.innerHTML=items.slice(0,homeCount).map((x,i)=>card(x,i,'home')).join('');
    const detail=$('#guide .guide-detail-grid');if(detail)detail.innerHTML='<div class="guide-detail-content">'+items.map((x,i)=>card(x,i,'detail')).join('')+'</div>';
  }

  function renderMap(){
    const state=getState(),map=state.venueMap||{},box=$('#venueMap'),rail=$('.map-link-rail'),list=$('.map-link-list');if(!box)return;
    box.dataset.oeImage='venueMap.image';box.classList.toggle('has-map',!!map.image);
    box.innerHTML=map.image?'<button class="map-image-view" type="button" data-product-lightbox="'+esc(map.image)+'" aria-label="查看场地图大图"><img src="'+esc(map.image)+'" alt="活动场地图"><span>查看大图 ↗</span></button>':'<div class="map-static-placeholder"><b>场地图</b><span>主办方暂未上传场地图</span></div>';
    const firstLevelPages=new Set(['booths','activities','guests','guide',...(state.customPages||[]).map(p=>'custom-'+p.id)]);
    const links=(map.links||[]).map((item,index)=>({item,index})).filter(({item})=>{
      if(!String(item?.label||'').trim()||!firstLevelPages.has(item.target))return false;
      if(state.modules?.[item.target]===false&&getMode()!=='edit')return false;
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
    try{
      const raw=JSON.parse(localStorage.getItem(wishlistKey())||'{}'),state=getState();
      const validBooths=new Set((state.booths||[]).map(x=>x.id));
      const validProducts=new Set((state.booths||[]).flatMap(b=>(b.products||[]).map(p=>p.id)));
      const clean={booths:(Array.isArray(raw.booths)?raw.booths:[]).filter(id=>validBooths.has(id)),products:(Array.isArray(raw.products)?raw.products:[]).filter(id=>validProducts.has(id))};
      if(JSON.stringify(clean)!==JSON.stringify({booths:Array.isArray(raw.booths)?raw.booths:[],products:Array.isArray(raw.products)?raw.products:[]}))localStorage.setItem(wishlistKey(),JSON.stringify(clean));
      return clean;
    }catch{return {booths:[],products:[]}}
  }
  function normalizeDirectorySearch(value){
    return String(value??'').normalize('NFKC').toLocaleLowerCase().replace(/\s+/g,' ').trim();
  }
  function renderBooths(){
    const state=getState(),box=$('#booths .booth-directory-rich');if(!box)return;
    const previousView=box.dataset.directoryView==='products'?'products':'booths';
    const previousPage=box.dataset.directoryPage||'1';
    const previousSaved=box.dataset.directorySaved||'0';
    const previousBoothFilter=box.dataset.directoryBoothFilter||'';
    const previousBoothLabel=box.dataset.directoryBoothLabel||'';
    const liveQuery=box.querySelector('[data-directory-search]')?.value;
    if(liveQuery!==undefined){
      if(previousView==='products')box.dataset.productQuery=liveQuery;
      else box.dataset.boothQuery=liveQuery;
    }
    const previousBoothQuery=box.dataset.boothQuery||'';
    const previousProductQuery=box.dataset.productQuery||'';
    const previousQuery=previousView==='products'?previousProductQuery:previousBoothQuery;
    const saved=readWishlist(),savedBooths=new Set(saved.booths),savedProducts=new Set(saved.products);
    const boothCards=(state.booths||[]).map((b,i)=>{
      const logo=b.logo?'<img class="booth-logo" src="'+esc(b.logo)+'" alt="'+esc(b.name||'摊位')+' logo">':'<div class="booth-logo booth-logo-empty" aria-hidden="true">'+esc((b.no||'摊').slice(0,2))+'</div>';
      const fav=savedBooths.has(b.id),search=normalizeDirectorySearch([b.no,b.name,b.type,b.intro,...(b.products||[]).flatMap(p=>[p.name,p.tag])].filter(Boolean).join(' '));
      const productCount=(b.products||[]).length;
      return '<article class="booth-directory-card" id="booth-'+esc(b.id)+'" data-directory-card data-kind="booth" data-booth-id="'+esc(b.id)+'" data-search="'+esc(search)+'" data-oe-item="booths" data-oe-index="'+i+'"><div class="booth-card-head">'+logo+'<div>'+field('booths.'+i+'.no',b.no||'','span','booth-no')+field('booths.'+i+'.name',b.name||'','h3')+field('booths.'+i+'.type',b.type||'','small')+'</div></div>'+field('booths.'+i+'.intro',b.intro||'','p')+'<div class="booth-card-foot"><button class="booth-products-link" type="button" data-view-booth-products="'+esc(b.id)+'" data-booth-label="'+esc((b.no?b.no+' · ':'')+(b.name||'摊位'))+'">'+(productCount?productCount+' 件制品 ↗':'暂无制品')+'</button><button class="favorite-booth'+(fav?' active':'')+'" type="button" data-favorite-booth="'+esc(b.id)+'" aria-pressed="'+fav+'">'+(fav?'♥ 已收藏':'♡ 收藏社团')+'</button></div></article>';
    }).join('');
    const productCards=(state.booths||[]).flatMap((b,i)=>(b.products||[]).map((p,j)=>{
      const wished=savedProducts.has(p.id),search=normalizeDirectorySearch([p.name,p.tag].filter(Boolean).join(' '));
      const img=p.image?'<button class="directory-product-image" data-product-lightbox="'+esc(p.image)+'" data-oe-image="booths.'+i+'.products.'+j+'.image" type="button" aria-label="查看制品大图"><img src="'+esc(p.image)+'" alt="'+esc(p.name||'制品')+'"><span class="product-image-zoom" data-product-zoom="'+esc(p.image)+'" role="button" tabindex="0" aria-label="放大查看制品图片">↗</span></button>':(getMode()==='edit'?'<button class="directory-product-image empty" data-oe-image="booths.'+i+'.products.'+j+'.image" type="button">＋ 制品图片</button>':'<div class="directory-product-image empty" aria-hidden="true"></div>');
      return '<article class="directory-product-card" data-directory-card data-kind="product" data-product-id="'+esc(p.id)+'" data-booth-id="'+esc(b.id)+'" data-product-edit-booth="'+i+'" data-product-edit-index="'+j+'" data-search="'+esc(search)+'">'+img+'<div class="directory-product-copy">'+field('booths.'+i+'.products.'+j+'.name',p.name||'','b')+field('booths.'+i+'.products.'+j+'.tag',p.tag||'','em','product-tag')+field('booths.'+i+'.products.'+j+'.price',p.price||'','span')+'<small>'+esc((b.no?b.no+' · ':'')+(b.name||''))+'</small></div><button class="wishlist-product'+(wished?' active':'')+'" type="button" data-wishlist-product="'+esc(p.id)+'" data-booth-id="'+esc(b.id)+'" aria-pressed="'+wished+'">'+(wished?'★ 已加入':'☆ 心愿')+'</button></article>';
    })).join('');
    box.dataset.directoryView=previousView;box.dataset.directoryPage=previousPage;box.dataset.directorySaved=previousSaved;box.dataset.directoryBoothFilter=previousBoothFilter;box.dataset.directoryBoothLabel=previousBoothLabel;box.dataset.boothQuery=previousBoothQuery;box.dataset.productQuery=previousProductQuery;
    box.innerHTML='<div class="booth-directory-tools"><div class="directory-tabs" role="tablist" aria-label="摊位与制品"><button type="button" role="tab" aria-selected="'+(previousView==='booths'?'true':'false')+'" class="'+(previousView==='booths'?'active':'')+'" data-directory-view-btn="booths">摊位</button><button type="button" role="tab" aria-selected="'+(previousView==='products'?'true':'false')+'" class="'+(previousView==='products'?'active':'')+'" data-directory-view-btn="products">制品</button></div><div class="booth-search"><span>⌕</span><input type="search" data-directory-search value="'+esc(previousQuery)+'" placeholder="搜索社团，或制品名称 / Tag" aria-label="搜索摊位与制品"><button type="button" class="directory-search-clear" data-directory-search-clear aria-label="清除搜索" title="清除搜索"'+(previousQuery?'':' hidden')+'>×</button></div><button type="button" data-directory-saved class="'+(previousSaved==='1'?'active':'')+'">收藏社团 <b data-wishlist-count>'+saved.booths.length+'</b></button></div><div class="directory-context" data-directory-context hidden><span></span><button type="button" data-clear-booth-filter>查看全部制品 ×</button></div><div class="booth-directory-grid" role="tabpanel" data-directory-grid="booths">'+boothCards+'</div><div class="product-directory-grid" role="tabpanel" data-directory-grid="products" hidden>'+productCards+'</div><div class="booth-no-result" hidden><b>没有找到匹配内容</b><span>当前搜索或筛选条件下没有结果。</span><button type="button" data-directory-reset>清除搜索与筛选</button></div><nav class="directory-pagination" aria-label="分页"></nav>';
    const apply=()=>{
      const searchInput=box.querySelector('[data-directory-search]');
      const view=box.dataset.directoryView==='products'?'products':'booths';
      box.dataset.directoryView=view;
      const q=normalizeDirectorySearch(searchInput?.value||'');
      const savedOnly=box.dataset.directorySaved==='1';
      const wish=readWishlist(),bs=new Set(wish.booths),ps=new Set(wish.products);
      const perPage=view==='booths'?16:20;
      const boothFilter=view==='products'?(box.dataset.directoryBoothFilter||''):'';
      if(view==='products')box.dataset.productQuery=searchInput?.value||'';else box.dataset.boothQuery=searchInput?.value||'';
      box.querySelectorAll('[data-directory-grid]').forEach(g=>g.hidden=g.dataset.directoryGrid!==view);
      box.querySelectorAll('[data-directory-view-btn]').forEach(btn=>btn.setAttribute('aria-selected',btn.dataset.directoryViewBtn===view?'true':'false'));
      const cards=[...box.querySelectorAll('[data-directory-grid="'+view+'"] [data-directory-card]')];
      const matches=cards.filter(card=>{
        if(boothFilter&&card.dataset.boothId!==boothFilter)return false;
        if(q&&!String(card.dataset.search||'').includes(q))return false;
        if(!savedOnly)return true;
        return view==='booths'?bs.has(card.dataset.boothId):ps.has(card.dataset.productId);
      });
      const hasActiveFilter=!!q||savedOnly||!!boothFilter;
      const pages=Math.max(1,Math.ceil(matches.length/perPage));
      let page=Math.max(1,Math.min(pages,Number(box.dataset.directoryPage)||1));
      box.dataset.directoryPage=String(page);
      const visible=new Set(matches.slice((page-1)*perPage,page*perPage));
      cards.forEach(card=>card.classList.toggle('directory-filtered-out',!visible.has(card)));
      const pager=box.querySelector('.directory-pagination');if(pager)pager.innerHTML=matches.length>perPage?'<button type="button" data-directory-page="'+Math.max(1,page-1)+'" '+(page===1?'disabled':'')+'>←</button><span>'+page+' / '+pages+'</span><button type="button" data-directory-page="'+Math.min(pages,page+1)+'" '+(page===pages?'disabled':'')+'>→</button>':'';
      const empty=box.querySelector('.booth-no-result');if(empty)empty.hidden=matches.length>0||!hasActiveFilter;
      const input=box.querySelector('[data-directory-search]');if(input)input.placeholder='搜索社团，或制品名称 / Tag';
      const clearSearch=box.querySelector('[data-directory-search-clear]');if(clearSearch)clearSearch.hidden=!(input?.value||'');
      const savedBtn=box.querySelector('[data-directory-saved]'),count=box.querySelector('[data-wishlist-count]');if(savedBtn)savedBtn.firstChild.nodeValue=view==='booths'?'收藏社团 ':'心愿制品 ';if(count)count.textContent=String(view==='booths'?wish.booths.length:wish.products.length);
      const context=box.querySelector('[data-directory-context]');if(context){context.hidden=!boothFilter;const label=context.querySelector('span');if(label)label.textContent=boothFilter?(box.dataset.directoryBoothLabel||'当前摊位')+' · 制品':''}
    };
    box._applyDirectory=apply;
    const toggleDirectorySaved=(kind,id)=>{
      const wish=readWishlist(),key=kind==='booth'?'booths':'products',set=new Set(wish[key]);
      set.has(id)?set.delete(id):set.add(id);wish[key]=[...set];
      try{localStorage.setItem(wishlistKey(),JSON.stringify(wish))}catch{}
      const boothSet=new Set(wish.booths),productSet=new Set(wish.products);
      box.querySelectorAll('[data-favorite-booth]').forEach(btn=>{const on=boothSet.has(btn.dataset.favoriteBooth);btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));btn.textContent=on?'♥ 已收藏':'♡ 收藏社团'});
      box.querySelectorAll('[data-wishlist-product]').forEach(btn=>{const on=productSet.has(btn.dataset.wishlistProduct);btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));btn.textContent=on?'★ 已加入':'☆ 心愿'});
      apply();
    };
    const searchInput=box.querySelector('[data-directory-search]');
    box.querySelectorAll('[data-favorite-booth]').forEach(btn=>btn.addEventListener('click',e=>{
      if(getMode()!=='preview')return;
      e.preventDefault();e.stopPropagation();
      toggleDirectorySaved('booth',btn.dataset.favoriteBooth);
    }));
    box.querySelectorAll('[data-wishlist-product]').forEach(btn=>btn.addEventListener('click',e=>{
      if(getMode()!=='preview')return;
      e.preventDefault();e.stopPropagation();
      toggleDirectorySaved('product',btn.dataset.wishlistProduct);
    }));
    box.querySelectorAll('[data-directory-view-btn]').forEach(btn=>btn.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const next=btn.dataset.directoryViewBtn==='products'?'products':'booths';
      box.dataset.directoryView=next;box.dataset.directoryPage='1';box.dataset.directorySaved='0';box.dataset.directoryBoothFilter='';box.dataset.directoryBoothLabel='';
      if(searchInput)searchInput.value=next==='products'?(box.dataset.productQuery||''):(box.dataset.boothQuery||'');
      box.querySelectorAll('[data-directory-view-btn]').forEach(x=>x.classList.toggle('active',x===btn));
      box.querySelector('[data-directory-saved]')?.classList.remove('active');apply();
    }));
    box.querySelectorAll('[data-view-booth-products]').forEach(btn=>btn.addEventListener('click',e=>{
      if(btn.disabled)return;e.preventDefault();e.stopPropagation();
      box.dataset.directoryView='products';box.dataset.directoryPage='1';box.dataset.directorySaved='0';box.dataset.directoryBoothFilter=btn.dataset.viewBoothProducts;box.dataset.directoryBoothLabel=btn.dataset.boothLabel||'';box.dataset.productQuery='';
      if(searchInput)searchInput.value='';
      box.querySelectorAll('[data-directory-view-btn]').forEach(x=>x.classList.toggle('active',x.dataset.directoryViewBtn==='products'));
      box.querySelector('[data-directory-saved]')?.classList.remove('active');apply();
    }));
    box.querySelector('[data-clear-booth-filter]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();box.dataset.directoryBoothFilter='';box.dataset.directoryBoothLabel='';box.dataset.directoryPage='1';apply()});
    box.querySelector('[data-directory-reset]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();box.dataset.directorySaved='0';box.dataset.directoryBoothFilter='';box.dataset.directoryBoothLabel='';box.dataset.directoryPage='1';if(box.dataset.directoryView==='products')box.dataset.productQuery='';else box.dataset.boothQuery='';if(searchInput)searchInput.value='';box.querySelector('[data-directory-saved]')?.classList.remove('active');apply()});
    box.querySelector('[data-directory-saved]')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();box.dataset.directorySaved=box.dataset.directorySaved==='1'?'0':'1';box.dataset.directoryPage='1';e.currentTarget.classList.toggle('active',box.dataset.directorySaved==='1');apply()});
    box.addEventListener('click',e=>{
      const pageBtn=e.target.closest?.('[data-directory-page]');
      if(pageBtn&&!pageBtn.disabled){e.preventDefault();e.stopPropagation();box.dataset.directoryPage=pageBtn.dataset.directoryPage;apply();return}
    });
    const onDirectorySearch=e=>{if(!e.target.matches('[data-directory-search]'))return;const view=box.dataset.directoryView==='products'?'products':'booths';if(view==='products')box.dataset.productQuery=e.target.value;else box.dataset.boothQuery=e.target.value;box.dataset.directoryPage='1';apply()};
    if(searchInput){searchInput.addEventListener('input',onDirectorySearch);searchInput.addEventListener('search',onDirectorySearch)}
    box.querySelector('[data-directory-search-clear]')?.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      if(!searchInput)return;
      searchInput.value='';
      onDirectorySearch({target:searchInput});
      searchInput.focus({preventScroll:true});
    });
    // Treat the booth card itself as the editor selection target. Do not rely on
    // document-level delegation, which can be suppressed by directory guards.
    box.querySelectorAll('[data-oe-item="booths"]').forEach(card=>card.addEventListener('click',e=>{
      if(getMode()!=='edit'||e.target.closest?.('[data-oe-field],[data-view-booth-products],[data-favorite-booth]'))return;
      e.preventDefault();e.stopPropagation();
      send?.({type:'OE_SELECT_ITEM',collection:'booths',index:Number(card.dataset.oeIndex)});
    }));
    box.querySelectorAll('[data-product-edit-booth]').forEach(card=>card.addEventListener('click',e=>{
      if(getMode()!=='edit'||e.target.closest?.('[data-oe-field],[data-wishlist-product]'))return;
      e.preventDefault();e.stopPropagation();
      send?.({type:'OE_SELECT_PRODUCT',boothIndex:Number(card.dataset.productEditBooth),productIndex:Number(card.dataset.productEditIndex),focusImage:!!e.target.closest?.('[data-oe-image]')});
    }));
    box.addEventListener('click',e=>{
      const interactive=e.target.closest?.('[data-directory-view-btn],[data-directory-search],[data-directory-search-clear],[data-directory-saved],[data-view-booth-products],[data-clear-booth-filter],[data-directory-reset],[data-directory-page],[data-product-lightbox],[data-oe-image],[data-wishlist-product],[data-favorite-booth],[data-oe-item],[data-product-edit-booth],[data-directory-card] [data-oe-field]');
      if(!interactive){e.preventDefault();e.stopImmediatePropagation()}
    },true);
    apply();
  }

  function guestPlatformName(url){
    const raw=String(url||'').trim();if(!raw)return '';
    let host='';
    try{host=new URL(/^https?:\/\//i.test(raw)?raw:'https://'+raw).hostname.toLowerCase().replace(/^www\./,'')}catch{}
    if(/(^|\.)bilibili\.com$/.test(host)||host==='b23.tv')return 'Bilibili';
    if(/(^|\.)xiaohongshu\.com$/.test(host)||host==='xhslink.com')return '小红书';
    if(/(^|\.)douyin\.com$/.test(host)||host==='v.douyin.com')return '抖音';
    if(/(^|\.)weibo\.com$/.test(host)||host==='weibo.cn')return '微博';
    if(host==='x.com'||host==='twitter.com'||host.endsWith('.twitter.com'))return 'X / Twitter';
    if(host==='youtube.com'||host.endsWith('.youtube.com')||host==='youtu.be')return 'YouTube';
    if(host==='instagram.com'||host.endsWith('.instagram.com'))return 'Instagram';
    if(host==='tiktok.com'||host.endsWith('.tiktok.com'))return 'TikTok';
    if(host==='pixiv.net'||host.endsWith('.pixiv.net'))return 'Pixiv';
    if(host==='lofter.com'||host.endsWith('.lofter.com'))return 'LOFTER';
    if(host==='facebook.com'||host.endsWith('.facebook.com'))return 'Facebook';
    if(host==='twitch.tv'||host.endsWith('.twitch.tv'))return 'Twitch';
    return host||'个人主页';
  }
  function guestPlatformHost(url){
    const raw=String(url||'').trim();if(!raw)return '';
    let host='';
    try{host=new URL(/^https?:\/\//i.test(raw)?raw:'https://'+raw).hostname.toLowerCase().replace(/^www\./,'')}catch{}
    return host;
  }
  function guestPlatformMeta(url){
    const host=guestPlatformHost(url);
    if(/(^|\.)bilibili\.com$/.test(host)||host==='b23.tv')return {name:'Bilibili',slug:'bilibili'};
    if(/(^|\.)xiaohongshu\.com$/.test(host)||host==='xhslink.com')return {name:'小红书',slug:'xiaohongshu'};
    if(/(^|\.)douyin\.com$/.test(host)||host==='v.douyin.com')return {name:'抖音',slug:'douyin'};
    if(/(^|\.)weibo\.com$/.test(host)||host==='weibo.cn')return {name:'微博',slug:'sinaweibo'};
    if(host==='x.com'||host==='twitter.com'||host.endsWith('.twitter.com'))return {name:'X / Twitter',slug:'x'};
    if(host==='youtube.com'||host.endsWith('.youtube.com')||host==='youtu.be')return {name:'YouTube',slug:'youtube'};
    if(host==='instagram.com'||host.endsWith('.instagram.com'))return {name:'Instagram',slug:'instagram'};
    if(host==='tiktok.com'||host.endsWith('.tiktok.com'))return {name:'TikTok',slug:'tiktok'};
    if(host==='pixiv.net'||host.endsWith('.pixiv.net'))return {name:'Pixiv',slug:'pixiv'};
    if(host==='lofter.com'||host.endsWith('.lofter.com'))return {name:'LOFTER',slug:'lofter'};
    if(host==='facebook.com'||host.endsWith('.facebook.com'))return {name:'Facebook',slug:'facebook'};
    if(host==='twitch.tv'||host.endsWith('.twitch.tv'))return {name:'Twitch',slug:'twitch'};
    return {name:host||'个人主页',slug:''};
  }
  function guestPlatformName(url){return guestPlatformMeta(url).name}
  function guestPlatformIcon(url){
    const meta=guestPlatformMeta(url),host=guestPlatformHost(url);
    if(meta.slug)return 'https://cdn.simpleicons.org/'+encodeURIComponent(meta.slug);
    return host?'https://www.google.com/s2/favicons?domain='+encodeURIComponent(host)+'&sz=64':'';
  }
  function guestPlatformFallbackIcon(url){
    const host=guestPlatformHost(url);
    return host?'https://www.google.com/s2/favicons?domain='+encodeURIComponent(host)+'&sz=64':'';
  }
  function renderGuests(){
    const state=getState(),box=$('#guests .guest-grid');if(!box)return;
    box.innerHTML=(state.guests||[]).map((g,i)=>{
      const plans=(state.participation||[]).filter(a=>(a.guestIds||[]).includes(g.id));
      const schedules=(state.schedule||[]).filter(a=>(a.guestIds||[]).includes(g.id));
      const img=g.image?'<button class="guest-image" data-product-lightbox="'+esc(g.image)+'" data-oe-image="guests.'+i+'.image" type="button"><img src="'+esc(g.image)+'" alt="'+esc(g.name||'嘉宾')+'"></button>':(getMode()==='edit'?'<button class="guest-image empty" type="button" data-oe-image="guests.'+i+'.image">＋ 嘉宾图</button>':'<div class="guest-image empty" aria-hidden="true"></div>');
      const planLinks=plans.map(a=>'<a href="#activities" data-target-mode="page" data-page-link="activities" data-activity-plan-id="'+esc(a.id)+'">'+esc(a.title)+'</a>');
      const scheduleLinks=schedules.map(a=>'<a href="#activities" data-target-mode="page" data-page-link="activities" data-activity-index="'+Math.max(0,(state.schedule||[]).indexOf(a))+'">'+esc((a.time?a.time+' ':'')+a.title)+'</a>');
      const related=(planLinks.length||scheduleLinks.length)?'<div class="guest-note guest-related-note"><b>关联活动</b><div class="guest-related-links">'+[...planLinks,...scheduleLinks].join('')+'</div></div>':'';
      const guestType=['person','duo','band','group','official'].includes(g.guestType)?g.guestType:'person';
      const members=String(g.members||'').trim();
      const attendance=String(g.attendanceNote||'').trim();
      const works=String(g.works||'').trim();
      const intro=String(g.intro||'').trim();
      const socialLinks=(Array.isArray(g.socialLinks)?g.socialLinks:[]).map(x=>({url:String(x?.url||'').trim()})).filter(x=>x.url);
      const metaLabel=members?'MEMBERS':attendance?'ATTENDANCE':'PROFILE';
      const metaValue=members||attendance||'嘉宾信息';
      const worksBlock=works?'<div class="guest-info-block guest-works-block"><b>代表作 / 主要内容</b>'+field('guests.'+i+'.works',works,'span')+'</div>':'';
      const introBlock=intro?'<div class="guest-info-block guest-intro-block"><b>介绍</b>'+field('guests.'+i+'.intro',intro,'p')+'</div>':'';
      const social=socialLinks.length?'<div class="guest-platforms"><b>个人平台：</b><div class="guest-platform-list">'+socialLinks.map(x=>{const name=guestPlatformName(x.url),icon=guestPlatformIcon(x.url),fallback=guestPlatformFallbackIcon(x.url),href=/^https?:\/\//i.test(x.url)?x.url:'https://'+x.url;return '<a href="'+esc(href)+'" target="_blank" rel="noopener">'+(icon?'<img class="guest-platform-logo" src="'+esc(icon)+'" data-fallback-src="'+esc(fallback)+'" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="if(this.dataset.fallbackSrc&&this.src!==this.dataset.fallbackSrc){this.src=this.dataset.fallbackSrc}else{this.style.display=\'none\'}">':'')+'<span>'+esc(name)+'</span></a>'}).join('')+'</div></div>':'';
      return '<article class="guest-card guest-poster guest-type-'+guestType+'" id="guest-'+esc(g.id)+'" data-oe-item="guests" data-oe-index="'+i+'"><div class="guest-poster-media">'+img+'</div><div class="guest-copy"><div class="guest-poster-kicker"><span>GUEST '+String(i+1).padStart(2,'0')+'</span>'+field('guests.'+i+'.role',g.role||'GUEST','small')+'</div>'+field('guests.'+i+'.name',g.name||'','b','guest-poster-name')+'<div class="guest-unified-meta"><b>'+metaLabel+'</b>'+(members?field('guests.'+i+'.members',members,'span'):attendance?field('guests.'+i+'.attendanceNote',attendance,'span'):'<span>'+esc(metaValue)+'</span>')+'</div>'+worksBlock+introBlock+social+related+'</div></article>';
    }).join('');
    // Guest cards open the complete guest inspector. Keep independent link
    // controls navigable; image clicks select the guest rather than the generic
    // image field inspector, because photo editing is already in that panel.
    box.querySelectorAll('[data-oe-item="guests"]').forEach(card=>card.addEventListener('click',e=>{
      if(getMode()!=='edit'||e.target.closest?.('[data-oe-field],.guest-appearances a,.guest-related-links a,.guest-platforms a'))return;
      e.preventDefault();e.stopPropagation();
      send?.({type:'OE_SELECT_ITEM',collection:'guests',index:Number(card.dataset.oeIndex)});
    }));
  }

  function renderUpdates(){
    const state=getState(),box=$('#updates .updates-list');if(!box)return;
    const items=(state.updates||[]).slice(0,3);
    box.innerHTML=items.map((u,i)=>{const target=({passport:'activities','guide-home':'guide'}[u.target]||u.target||'top'),mode=['booths','activities','guests','guide'].includes(target)||String(target).startsWith('custom-')?'page':'home';return '<a class="update-item" href="#'+esc(target)+'" data-target-mode="'+mode+'" data-page-link="'+esc(target)+'" data-oe-item="updates" data-oe-index="'+i+'"><time>'+esc(u.date||'')+'</time>'+field('updates.'+i+'.title',u.title||'','b')+'<span>→</span></a>'}).join('');
    $('#updates')?.classList.toggle('oe-page-hidden',items.length===0);
  }

  function renderCommunity(){
    const state=getState(),box=$('#community .community');if(!box)return;
    box.innerHTML=(state.socialLinks||[]).map((x,i)=>{
      const img=x.image?'<button class="social-image" data-product-lightbox="'+esc(x.image)+'" data-oe-image="socialLinks.'+i+'.image" type="button"><img src="'+esc(x.image)+'" alt="'+esc(x.label||'社群')+'"></button>':(getMode()==='edit'?'<button class="social-image empty" data-oe-image="socialLinks.'+i+'.image" type="button">＋ 图片 / 二维码</button>':'');
      const href=externalHref(x.url),action=href?'<a class="social-action" href="'+esc(href)+'" target="_blank" rel="noopener">进入 ↗</a>':'<span class="social-action muted">未设置链接</span>';
      return '<article data-oe-item="socialLinks" data-oe-index="'+i+'">'+field('socialLinks.'+i+'.label',x.label,'b')+field('socialLinks.'+i+'.note',x.note||'','p')+img+action+'</article>';
    }).join('');
  }

  function renderSponsors(){
    const state=getState(),box=$('.sponsors');if(!box)return;
    const items=(state.sponsors||[]).map((item,index)=>({item,index})).filter(({item})=>String(item?.name||'').trim()||String(item?.logo||'').trim()||String(item?.url||'').trim());
    box.innerHTML=items.map(({item:x,index:i})=>{
      const logo=x.logo?'<button class="sponsor-logo" data-product-lightbox="'+esc(x.logo)+'" data-oe-image="sponsors.'+i+'.logo" type="button"><img src="'+esc(x.logo)+'" alt="'+esc(x.name||'赞助商')+'"></button>':(getMode()==='edit'?'<button class="sponsor-logo empty" data-oe-image="sponsors.'+i+'.logo" type="button">＋ Logo</button>':'');
      const name=field('sponsors.'+i+'.name',x.name||'','b');
      const level=field('sponsors.'+i+'.level',x.level||'','small');
      const href=externalHref(x.url),action=href?'<a class="sponsor-link" href="'+esc(href)+'" target="_blank" rel="noopener">访问 ↗</a>':'';
      return '<article class="sponsor-card" data-oe-item="sponsors" data-oe-index="'+i+'">'+logo+'<div class="sponsor-copy">'+name+level+'</div>'+action+'</article>';
    }).join('');
    $('#sponsors')?.classList.toggle('oe-page-hidden',items.length===0);
  }

  const CUSTOM_PAGE_LAYOUTS={
    custom:'gallery',
    cosplay:'people',photographer:'people',
    officialShop:'product',freebie:'product',
    food:'place',
    itasha:'showcase',model:'showcase',prop:'showcase',brand:'showcase',
    oc:'gallery',illustration:'gallery',craft:'gallery',exhibition:'gallery',
    comic:'reading',novel:'reading',
    gameDemo:'activity',tabletop:'activity',cardGame:'activity',support:'activity'
  };
  function customPageLayout(page){
    return page?.layout||CUSTOM_PAGE_LAYOUTS[page?.preset]||'gallery';
  }
  function customPageMeta(meta,layout){
    const parts=String(meta||'').split(/\s*·\s*/).map(x=>x.trim()).filter(Boolean);
    if(!parts.length)return '';
    return '<div class="custom-page-meta custom-page-meta-'+esc(layout)+'">'+parts.map((part,index)=>{
      const price=layout==='product'&&index===0&&/(?:¥|￥|元|免费|交换|领取)/.test(part);
      return '<span'+(price?' class="is-price"':'')+'>'+esc(part)+'</span>';
    }).join('')+'</div>';
  }
  function renderCustomPages(){
    const state=getState(),footer=$('.footer'),host=footer?.parentNode||document.body;if(!host)return;
    qa('[data-custom-page-root]').forEach(x=>x.remove());
    (state.customPages||[]).forEach((page,pi)=>{
      const key='custom-'+page.id,preset=page.preset||'custom',layout=customPageLayout(page);
      const section=document.createElement('section');
      section.className='section oe-page-view custom-page-view custom-page-'+preset+' custom-page-layout-'+layout;
      section.id=key;section.dataset.customPageRoot=page.id;section.dataset.customPageLayout=layout;
      const items=(page.items||[]).map((item,ii)=>{
        const image=item.image?'<button class="custom-page-image" type="button" data-product-lightbox="'+esc(item.image)+'"><img src="'+esc(item.image)+'" alt="'+esc(item.title||page.title||'展示内容')+'"></button>':'<div class="custom-page-image empty">＋ 图片</div>';
        const href=externalHref(item.url),action=href?'<a class="custom-page-action" href="'+esc(href)+'" target="_blank" rel="noopener">查看详情 ↗</a>':'';
        const meta=customPageMeta(item.meta,layout);
        return '<article class="custom-page-card custom-page-card-'+esc(layout)+'" id="customitem-'+esc(item.id||String(ii))+'" data-oe-custom-page="'+esc(page.id)+'" data-oe-custom-index="'+ii+'">'+image+'<div class="custom-page-card-copy"><b>'+esc(item.title||'未命名内容')+'</b>'+meta+(item.text?'<p>'+esc(item.text)+'</p>':'')+action+'</div></article>';
      }).join('');
      section.innerHTML='<div class="wrap"><div class="head" data-oe-custom-page-settings="'+esc(page.id)+'"><div><span class="ey">'+esc(page.eyebrow||'SPECIAL')+'</span><h2>'+esc(page.title||'专题页面')+'</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div>'+
        (page.intro?'<p class="custom-page-intro" data-oe-custom-page-settings="'+esc(page.id)+'">'+esc(page.intro)+'</p>':'')+
        '<div class="custom-page-grid custom-page-grid-'+esc(preset)+' custom-page-grid-layout-'+esc(layout)+'" style="--custom-image-ratio:'+esc(Number(page.ratio)||1.333333)+'">'+(items||(getMode()==='edit'?'<div class="custom-page-empty" data-oe-custom-page-settings="'+esc(page.id)+'">还没有展示内容，点击这里开始编辑。</div>':''))+'</div></div>';
      if(footer?.parentNode===host)host.insertBefore(section,footer);else host.appendChild(section);
    });
  }

  function renderOptionalPages(){
    const state=getState();
    [['freewalk','COS自由行'],['itasha','痛车展示']].forEach(([key,fallback])=>{
      const root=$('[data-optional-page="'+key+'"]');if(!root)return;
      const item=state[key]||{},image=item.image?'<button class="optional-page-image" type="button" data-product-lightbox="'+esc(item.image)+'" data-oe-image="'+key+'.image"><img src="'+esc(item.image)+'" alt="'+esc(item.title||fallback)+'"></button>':(getMode()==='edit'?'<button class="optional-page-image empty" type="button" data-oe-image="'+key+'.image">＋ 上传活动图片</button>':'');
      root.innerHTML='<div class="optional-page-copy">'+field(key+'.title',item.title||fallback,'h3')+field(key+'.text',item.text||'','p')+'</div>'+image;
    });
  }

  function renderFooter(){
    const state=getState(),mods=state.modules||{},editing=getMode()==='edit';
    const has=k=>{
      if(k==='booths')return (state.booths||[]).length>0;
      if(k==='activities')return (state.participation||[]).length>0||(state.schedule||[]).length>0;
      if(k==='guests')return (state.guests||[]).length>0;
      if(k==='guide')return (state.guide?.items||[]).length>0;
      if(k==='community')return (state.socialLinks||[]).some(x=>String(x?.label||'').trim()||String(x?.note||'').trim()||String(x?.url||'').trim()||String(x?.image||'').trim());
      return true;
    };
    const on=k=>mods[k]!==false&&(editing||has(k));
    const link=(href,label,mode='home')=>'<a href="#'+href+'" data-target-mode="'+mode+'" data-page-link="'+href+'">'+esc(label)+'</a>';
    const brand=$('.footer-brand');if(brand)brand.innerHTML='<h2>'+esc(state.eventName||'OnlyEvent')+'</h2><p>'+esc(state.date||'')+' · '+esc(state.edition||state.location||'')+'</p>';
    const participate=$('.footer-participate');if(participate){
      const links=[
        ...(on('booths')?[link('booths','摊位','page')]:[]),
        ...(on('activities')?[link('activities','活动','page')]:[]),
        ...(on('guests')?[link('guests','嘉宾','page')]:[]),
        ...(state.customPages||[]).map(page=>link('custom-'+page.id,page.title||'专题页面','page'))
      ];
      participate.innerHTML='<b>参与</b><nav>'+links.join('')+'</nav>';
      participate.hidden=!links.length;
    }
    const visit=$('.footer-visit');if(visit){
      const links=[link('tickets','票务'),link('map-home','场地图'),...(on('guide')?[link('guide','观展指南','page')]:[])];
      visit.innerHTML='<b>观展</b><nav>'+links.join('')+'</nav>';
    }
    const social=$('.footer-social');if(social){
      const links=on('community')?(state.socialLinks||[]).map(x=>{const href=externalHref(x.url);return href?'<a href="'+esc(href)+'" target="_blank" rel="noopener">'+esc(x.label||'社群')+' ↗</a>':'<span>'+esc(x.label||'社群')+'</span>'}):[];
      social.innerHTML='<b>社群</b><nav>'+links.join('')+'</nav>';
      social.hidden=!links.length;
    }
  }
  function renderCollections(){
    renderRibbon();renderTickets();renderSchedule();renderGuide();renderMap();renderBooths();renderGuests();renderUpdates();renderCommunity();renderSponsors();renderCustomPages();renderOptionalPages();renderFooter();
  }
  return {openGiftLightbox,renderRibbon,renderTickets,renderHighlights,renderSchedule,renderGuide,renderMap,renderBooths,renderGuests,renderUpdates,renderCommunity,renderSponsors,renderCustomPages,renderOptionalPages,renderFooter,renderCollections};
}