
// Templates whose art is pure CSS over the Template 01 component markup.
const BASE_MARKUP_TEMPLATES=new Set(['01-ip-only']);
const CM='03-creator-market',CC='04-creator-catalogue',TP='07-tea-party',BL='06-band-live',BD='08-birthday';
// These templates write their own markup for five components and use Template 01's for the rest.
const OWN_MARKUP=new Set([TP,BL,BD]);
const OWN_COMPONENTS=new Set(['ticketMarkup','guestMarkup','scheduleMarkup','updateMarkup','activityMarkup']);
const usesBase=(id)=>id==='01-ip-only';
const tid=s=>{const id=String(s?.templateId||'01-ip-only');return BASE_MARKUP_TEMPLATES.has(id)?'01-ip-only':id};
const isVariant=s=>tid(s)!=='01-ip-only';
const OWN_NO_DIRECTORY=new Set([BL,TP,BD,'05-live-poster']);
const num=i=>String(i+1).padStart(2,'0');

export function ticketMarkup({state,x,i,field,esc,image}){
  const id=tid(state);
  if(usesBase(id,'ticketMarkup'))return '';
  const name=field('tickets.'+i+'.name',x.name,'h3');
  const price=field('tickets.'+i+'.price',x.price||'','div','oe-ticket-price');
  const gift=field('tickets.'+i+'.gift',x.gift||'','span','oe-ticket-gift');
  const note=field('tickets.'+i+'.note',x.note||'','small','oe-ticket-note');
  const common=' data-oe-item="tickets" data-oe-index="'+i+'"';
  if(id===CM)return '<article class="ticket cm-ticket"'+common+'><span class="cm-ticket-badge">入场</span><div class="cm-ticket-body">'+name+gift+note+'</div><div class="cm-ticket-price">'+price+'</div>'+(image||'')+'</article>';
  if(id===BL)return '<article class="ticket bl-ticket"'+common+'><div class="bl-ticket-tag">TICKET '+num(i)+'</div><div class="bl-ticket-main">'+name+gift+note+'</div><div class="bl-ticket-price">'+price+'</div>'+(image||'')+'</article>';
  if(id===BD)return '<article class="ticket bd-gift"'+common+'><div class="bd-gift-ribbon">GIFT '+num(i)+'</div><div class="bd-gift-main">'+name+gift+note+'</div><div class="bd-gift-price">'+price+'</div>'+(image||'')+'</article>';
  if(id===TP)return '<article class="ticket tp-ticket"'+common+'><div class="tp-ticket-main"><small>参加方式 '+num(i)+'</small>'+name+gift+note+'</div><div class="tp-ticket-price">'+price+'</div>'+(image||'')+'</article>';
  if(id==='02-scrapbook')return '<article class="ticket scrap-pass"'+common+'><div class="scrap-pass-watermark" aria-hidden="true"><svg class="stamp-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><path id="journey-seal-ring" d="M100 100 m-73 0 a73 73 0 1 1 146 0 a73 73 0 1 1 -146 0"/></defs><circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" stroke-width="1.5"/><text fill="currentColor" font-family="Georgia,serif" font-size="12" letter-spacing="1.1" font-weight="bold"><textPath href="#journey-seal-ring" startOffset="50%" text-anchor="middle">YOUR SPECIAL JOURNEY • LUCKY DAY • OE</textPath></text><g transform="translate(100 103) rotate(-8)" fill="currentColor"><defs><path id="oe-clover-heart" d="M0 0 C-7 -8 -29 -22 -29 -39 C-29 -56 -7 -57 0 -42 C7 -57 29 -56 29 -39 C29 -22 7 -8 0 0 Z"/></defs><use href="#oe-clover-heart" transform="translate(0 -2) scale(.78)"/><use href="#oe-clover-heart" transform="rotate(90) translate(0 -2) scale(.78)"/><use href="#oe-clover-heart" transform="rotate(180) translate(0 -2) scale(.78)"/><use href="#oe-clover-heart" transform="rotate(270) translate(0 -2) scale(.78)"/><path d="M10 16 Q22 37 32 47" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></g></svg></div><div class="scrap-pass-main"><span class="scrap-pass-label">入场凭证 / ADMISSION</span>'+name+gift+note+'</div><div class="scrap-pass-art">'+image+'</div><aside>'+price+'<span>入场票 / TICKET</span></aside></article>';
  if(id==='03-school-festival')return '<article class="ticket school-ticket-card"'+common+'><div class="school-ticket-no">'+num(i)+'</div><div class="school-ticket-copy"><span>ADMISSION PASS</span>'+name+gift+note+'</div><div class="school-ticket-price">'+price+'</div>'+image+'</article>';
  if(id==='04-museum-editorial')return '<article class="ticket museum-admission"'+common+'><header><span>ADMISSION '+num(i)+'</span>'+price+'</header><div class="museum-admission-body">'+name+gift+note+'</div>'+image+'</article>';
  if(id==='05-live-poster')return '<article class="ticket live-pass"'+common+'><div class="live-pass-band">PASS '+num(i)+'</div><div class="live-pass-copy">'+name+gift+note+'</div><div class="live-pass-price">'+price+'</div>'+image+'</article>';
  if(id==='06-expo-catalogue')return '<article class="ticket expo-ticket-row"'+common+'><span class="expo-ticket-index">T-'+num(i)+'</span><div>'+name+gift+note+'</div><div>'+price+'</div>'+image+'</article>';
  return '<article class="ticket kimetsu-admission"'+common+'><div class="kimetsu-ticket-mark">'+num(i)+'</div><div class="kimetsu-ticket-copy">'+name+gift+note+'</div><div class="kimetsu-ticket-price">'+price+'</div>'+image+'</article>';
}

export function guestMarkup({state,g,i,field,esc,img,related,worksBlock,introBlock,social,metaLabel,members,attendance,metaValue,guestType}){
  const id=tid(state); if(usesBase(id,'guestMarkup'))return '';
  const meta=members?field('guests.'+i+'.members',members,'span','oe-secondary-copy'):attendance?field('guests.'+i+'.attendanceNote',attendance,'span','oe-secondary-copy'):'<span class="oe-secondary-copy">'+esc(metaValue)+'</span>';
  const name=field('guests.'+i+'.name',g.name||'','b','guest-poster-name');
  const role=field('guests.'+i+'.role',g.role||'GUEST','small');
  const common=' id="guest-'+esc(g.id)+'" data-oe-item="guests" data-oe-index="'+i+'"';
  if(id===BL)return '<article class="bl-band guest-type-'+guestType+'"'+common+'><div class="bl-band-no">'+num(i)+'</div><div class="bl-band-photo">'+img+'</div><div class="bl-band-copy">'+role+name+'<div class="bl-band-members">'+meta+'</div>'+worksBlock+introBlock+social+related+'</div></article>';
  if(id===BD)return '<article class="bd-guest guest-type-'+guestType+'"'+common+'><div class="bd-guest-photo">'+img+'</div><div class="bd-guest-copy">'+role+name+'<div class="bd-guest-meta">'+meta+'</div>'+worksBlock+introBlock+social+related+'</div></article>';
  if(id===TP)return '<article class="tp-guest guest-type-'+guestType+'"'+common+'><div class="tp-guest-photo">'+img+'</div><div class="tp-guest-copy">'+role+name+'<div class="tp-guest-meta">'+meta+'</div>'+worksBlock+introBlock+social+related+'</div></article>';
  if(id==='02-scrapbook')return '<article class="scrap-guest guest-type-'+guestType+'"'+common+'><div class="scrap-polaroid">'+img+'<span>MEMORY '+num(i)+'</span></div><div class="scrap-guest-note"><small>'+role+'</small>'+name+'<div class="scrap-tape-meta"><b>'+metaLabel+'</b>'+meta+'</div>'+worksBlock+introBlock+social+related+'</div></article>';
  if(id==='03-school-festival')return '<article class="school-profile guest-type-'+guestType+'"'+common+'><div class="school-profile-no">'+num(i)+'</div>'+img+'<div class="school-profile-copy"><span>GUEST PROFILE</span>'+name+role+'<div class="school-profile-meta">'+meta+'</div>'+worksBlock+introBlock+social+related+'</div></article>';
  if(id==='04-museum-editorial')return '<article class="museum-portrait guest-type-'+guestType+'"'+common+'><figure>'+img+'<figcaption>PORTRAIT '+num(i)+'</figcaption></figure><div class="museum-portrait-copy"><div><span>'+role+'</span>'+name+'</div><dl><dt>'+metaLabel+'</dt><dd>'+meta+'</dd></dl>'+worksBlock+introBlock+social+related+'</div></article>';
  if(id==='05-live-poster')return '<article class="live-performer guest-type-'+guestType+'"'+common+'><div class="live-performer-no">'+num(i)+'</div>'+img+'<div class="live-performer-copy">'+role+name+'<div class="live-performer-meta">'+meta+'</div>'+worksBlock+introBlock+social+related+'</div></article>';
  if(id==='06-expo-catalogue')return '<article class="expo-guest-row guest-type-'+guestType+'"'+common+'><span>G-'+num(i)+'</span>'+img+'<div>'+name+role+'</div><div>'+meta+'</div><div>'+worksBlock+introBlock+social+related+'</div></article>';
  return '<article class="kimetsu-person guest-type-'+guestType+'"'+common+'><div class="kimetsu-person-number">'+num(i)+'</div><div class="kimetsu-person-image">'+img+'</div><div class="kimetsu-person-copy"><span>'+role+'</span>'+name+'<div>'+meta+'</div>'+worksBlock+introBlock+social+related+'</div></article>';
}

export function scheduleMarkup({state,x,i,field,esc,day,area,endTime,guestHtml,planLink,reg}){
  const id=tid(state); if(usesBase(id,'scheduleMarkup'))return '';
  const range=[x.time,endTime].filter(Boolean),time=range[0]||'时间待定',end=range[1]||'';
  const common=' id="schedule-'+esc(x.id||String(i))+'" data-activity-index="'+i+'" data-activity-day="'+esc(day)+'" data-activity-area="'+esc(area)+'" data-oe-item="schedule" data-oe-index="'+i+'"';
  const title=field('schedule.'+i+'.title',x.title,'b'),detail=field('schedule.'+i+'.detail',x.detail||'','p','oe-secondary-copy'),stage=field('schedule.'+i+'.stage',area,'span');
  if(id===BL)return '<article class="bl-set"'+common+'><div class="bl-set-time">'+field('schedule.'+i+'.time',time,'strong')+(end?'<small>'+field('schedule.'+i+'.endTime',end,'span')+'</small>':'')+'</div><div class="bl-set-body"><span>'+esc(day)+(area?' / ':'')+stage+'</span>'+title+detail+guestHtml+planLink+reg+'</div></article>';
  if(id===BD)return '<article class="bd-step"'+common+'><span class="bd-step-no">'+num(i)+'</span><div class="bd-step-time">'+field('schedule.'+i+'.time',time,'strong')+(end?'<small>'+field('schedule.'+i+'.endTime',end,'span')+'</small>':'')+'</div><div class="bd-step-body"><small>'+esc(day)+(area?' · ':'')+stage+'</small>'+title+detail+guestHtml+planLink+reg+'</div></article>';
  if(id===TP)return '<article class="tp-agenda"'+common+'><time>'+field('schedule.'+i+'.time',time,'strong')+(end?'<small>'+field('schedule.'+i+'.endTime',end,'span')+'</small>':'')+'</time><div class="tp-agenda-body"><span>'+esc(day)+(area?' · ':'')+stage+'</span>'+title+detail+guestHtml+planLink+reg+'</div></article>';
  if(id==='02-scrapbook')return '<article class="scrap-itinerary"'+common+'><span class="scrap-itinerary-no">'+num(i)+'</span><time>'+field('schedule.'+i+'.time',time,'strong')+(end?' – '+field('schedule.'+i+'.endTime',end,'small'):'')+'</time><div><small>'+esc(day)+' / '+stage+'</small>'+title+detail+guestHtml+'<footer>'+planLink+reg+'</footer></div></article>';
  if(id==='03-school-festival')return '<article class="school-timetable"'+common+'><div class="school-time">'+field('schedule.'+i+'.time',time,'strong')+(end?'<small>'+field('schedule.'+i+'.endTime',end,'span')+'</small>':'')+'</div><div class="school-period">'+num(i)+'</div><div><span>'+esc(day)+' · '+stage+'</span>'+title+detail+guestHtml+planLink+reg+'</div></article>';
  if(id==='04-museum-editorial')return '<article class="museum-program-row"'+common+'><span>'+num(i)+'</span><time>'+field('schedule.'+i+'.time',time,'strong')+(end?' — '+field('schedule.'+i+'.endTime',end,'small'):'')+'</time><div>'+title+detail+'</div><aside>'+stage+guestHtml+planLink+reg+'</aside></article>';
  if(id==='05-live-poster')return '<article class="live-running-order"'+common+'><div class="live-running-no">'+num(i)+'</div><time>'+field('schedule.'+i+'.time',time,'strong')+(end?'<small>→ '+field('schedule.'+i+'.endTime',end,'span')+'</small>':'')+'</time><div><span>'+stage+'</span>'+title+detail+guestHtml+'</div><aside>'+planLink+reg+'</aside></article>';
  if(id==='06-expo-catalogue')return '<article class="expo-program-row"'+common+'><span>P-'+num(i)+'</span><time>'+field('schedule.'+i+'.time',time,'strong')+(end?' / '+field('schedule.'+i+'.endTime',end,'small'):'')+'</time><div>'+title+detail+'</div><div>'+stage+'</div><div>'+guestHtml+planLink+reg+'</div></article>';
  return '<article class="kimetsu-program"'+common+'><span class="kimetsu-program-mark">'+num(i)+'</span><time>'+field('schedule.'+i+'.time',time,'strong')+(end?'　'+field('schedule.'+i+'.endTime',end,'small'):'')+'</time><div><small>'+esc(day)+'　'+stage+'</small>'+title+detail+guestHtml+planLink+reg+'</div></article>';
}

export function updateMarkup({state,u,i,field,esc,target,mode}){
  const id=tid(state); if(usesBase(id,'updateMarkup'))return '';
  const common=' href="#'+esc(target)+'" data-target-mode="'+mode+'" data-page-link="'+esc(target)+'" data-oe-item="updates" data-oe-index="'+i+'"';
  if(id===CM)return '<a class="cm-update"'+common+'><span class="cm-update-tag">公告</span>'+field('updates.'+i+'.title',u.title||'','b')+'<time>'+esc(u.date||'')+'</time></a>';
  if(id===BL)return '<a class="bl-update"'+common+'><time>'+esc(u.date||'')+'</time>'+field('updates.'+i+'.title',u.title||'','b')+'<i aria-hidden="true">→</i></a>';
  if(id===BD)return '<a class="bd-update"'+common+'><span class="bd-update-star" aria-hidden="true">★</span><time>'+esc(u.date||'')+'</time>'+field('updates.'+i+'.title',u.title||'','b')+'</a>';
  if(id===TP)return '<a class="tp-update"'+common+'><span class="tp-update-heart" aria-hidden="true">♡</span><time>'+esc(u.date||'')+'</time>'+field('updates.'+i+'.title',u.title||'','b')+'</a>';
  if(id==='02-scrapbook')return '<a class="scrap-update"'+common+'><time class="scrap-update-date">'+esc(u.date||'')+'</time><span class="scrap-update-type">INFO</span>'+field('updates.'+i+'.title',u.title||'','b')+'<span class="scrap-update-arrow" aria-hidden="true">↗</span></a>';
  if(id==='03-school-festival')return '<a class="school-update"'+common+'><span>NEWS '+num(i)+'</span><time>'+esc(u.date||'')+'</time>'+field('updates.'+i+'.title',u.title||'','b')+'<i>→</i></a>';
  if(id==='04-museum-editorial')return '<a class="museum-update"'+common+'><time>'+esc(u.date||'')+'</time><span>NEWS</span>'+field('updates.'+i+'.title',u.title||'','b')+'<i>VIEW</i></a>';
  if(id==='05-live-poster')return '<a class="live-update"'+common+'><span>'+num(i)+'</span><time>'+esc(u.date||'')+'</time>'+field('updates.'+i+'.title',u.title||'','b')+'<i>↗</i></a>';
  if(id==='06-expo-catalogue')return '<a class="expo-update"'+common+'><span>N-'+num(i)+'</span><time>'+esc(u.date||'')+'</time>'+field('updates.'+i+'.title',u.title||'','b')+'<i>→</i></a>';
  return '<a class="kimetsu-update"'+common+'><span>'+num(i)+'</span><time>'+esc(u.date||'')+'</time>'+field('updates.'+i+'.title',u.title||'','b')+'<i>詳</i></a>';
}

export function sponsorMarkup({state,x,i,field,esc,logo,action}){
  const id=tid(state); if(usesBase(id,'sponsorMarkup'))return '';
  const name=field('sponsors.'+i+'.name',x.name||'','b'),level=field('sponsors.'+i+'.level',x.level||'','small');
  const common=' data-oe-item="sponsors" data-oe-index="'+i+'"';
  if(id==='05-live-poster')return '<article class="sponsor-card ls-sponsor"'+common+'>'+logo+name+action+'</article>';
  if(id===BL)return '<article class="sponsor-card bl-sponsor"'+common+'>'+name+level+logo+action+'</article>';
  if(id===TP)return '<article class="sponsor-card tp-sponsor"'+common+'><span class="tp-sponsor-mark">♡</span>'+logo+'<div>'+name+level+'</div>'+action+'</article>';
  if(id===BD)return '<article class="sponsor-card bd-sponsor"'+common+'><div class="bd-sponsor-tag">'+level+'</div>'+logo+name+action+'</article>';
  if(id===CM)return '<article class="sponsor-card cm-sponsor"'+common+'>'+logo+'<div>'+name+level+'</div>'+action+'</article>';
  if(id==='04-museum-editorial')return '<article class="sponsor-card museum-sponsor"'+common+'><span>'+level+'</span>'+logo+'<div>'+name+action+'</div></article>';
  if(id==='06-expo-catalogue')return '<article class="sponsor-card expo-sponsor"'+common+'><span>S-'+num(i)+'</span>'+logo+'<div>'+name+level+'</div>'+action+'</article>';
  if(id==='07-immersive-character')return '<article class="sponsor-card kimetsu-sponsor"'+common+'>'+logo+'<div>'+level+name+'</div>'+action+'</article>';
  return '<article class="sponsor-card variant-sponsor '+id+'"'+common+'>'+logo+'<div>'+name+level+'</div>'+action+'</article>';
}

export function boothMarkup({state,b,i,field,esc,logo,fav,search,productCount}){
  const id=tid(state);if(usesBase(id)||OWN_NO_DIRECTORY.has(id))return '';
  const common=' id="booth-'+esc(b.id)+'" data-directory-card data-kind="booth" data-booth-id="'+esc(b.id)+'" data-search="'+esc(search)+'" data-oe-item="booths" data-oe-index="'+i+'"';
  const name=field('booths.'+i+'.name',b.name||'','h3'),no=field('booths.'+i+'.no',b.no||'','span','booth-no'),type=field('booths.'+i+'.type',b.type||'','small'),intro=field('booths.'+i+'.intro',b.intro||'','p');
  const buttons='<button class="booth-products-link" type="button" data-view-booth-products="'+esc(b.id)+'" data-booth-label="'+esc((b.no?b.no+' · ':'')+(b.name||'摊位'))+'">'+(productCount?productCount+' 件制品 ↗':'暂无制品')+'</button><button class="favorite-booth'+(fav?' active':'')+'" type="button" data-favorite-booth="'+esc(b.id)+'" aria-pressed="'+fav+'">'+(fav?'♥ 已收藏':'♡ 收藏社团')+'</button>';
  if(id===CM)return '<article class="cm-booth"'+common+'><div class="cm-booth-face">'+logo+'</div><div class="cm-booth-body"><div class="cm-booth-top">'+name+no+'</div>'+type+intro+'<footer>'+buttons+'</footer></div></article>';
  if(id===CC)return '<article class="cc-booth"'+common+'><span class="cc-booth-space">'+no+'</span><div class="cc-booth-cut">'+logo+'</div><div class="cc-booth-info">'+name+type+intro+'</div><footer>'+buttons+'</footer></article>';
  if(id==='02-scrapbook')return '<article class="scrap-booth"'+common+'><div class="scrap-booth-pin">'+no+'</div>'+logo+'<div>'+type+name+intro+'<footer>'+buttons+'</footer></div></article>';
  if(id==='03-school-festival')return '<article class="school-booth"'+common+'><div class="school-booth-no">'+no+'</div>'+logo+'<div><span>CIRCLE FILE</span>'+name+type+intro+'</div><footer>'+buttons+'</footer></article>';
  if(id==='04-museum-editorial')return '<article class="museum-booth"'+common+'><header>'+no+type+'</header><div>'+logo+'</div><section>'+name+intro+'</section><footer>'+buttons+'</footer></article>';
  if(id==='06-expo-catalogue')return '<article class="expo-booth-row"'+common+'><span>'+no+'</span>'+logo+'<div>'+name+intro+'</div><div>'+type+'</div><footer>'+buttons+'</footer></article>';
  return '<article class="kimetsu-booth"'+common+'><span>'+no+'</span>'+logo+'<div>'+name+type+intro+'</div><footer>'+buttons+'</footer></article>';
}

export function productMarkup({state,b,p,i,j,field,esc,img,wished,search}){
  const id=tid(state);if(usesBase(id)||OWN_NO_DIRECTORY.has(id))return '';
  const common=' data-directory-card data-kind="product" data-product-id="'+esc(p.id)+'" data-booth-id="'+esc(b.id)+'" data-product-edit-booth="'+i+'" data-product-edit-index="'+j+'" data-search="'+esc(search)+'"';
  const name=field('booths.'+i+'.products.'+j+'.name',p.name||'','b'),tag=field('booths.'+i+'.products.'+j+'.tag',p.tag||'','em','product-tag'),price=field('booths.'+i+'.products.'+j+'.price',p.price||'','span');
  const wish='<button class="wishlist-product'+(wished?' active':'')+'" type="button" data-wishlist-product="'+esc(p.id)+'" data-booth-id="'+esc(b.id)+'" aria-pressed="'+wished+'">'+(wished?'★ 已加入':'☆ 心愿')+'</button>';
  if(id===CM)return '<article class="cm-product"'+common+'><div class="cm-product-thumb">'+img+'<span class="cm-product-price">'+price+'</span></div><div class="cm-product-meta">'+name+'<small>'+esc(b.no||'')+' · '+esc(b.name||'')+'</small><footer>'+tag+wish+'</footer></div></article>';
  if(id===CC)return '<article class="cc-product"'+common+'><div class="cc-product-art">'+img+'<span class="cc-new">NEW!</span></div><div class="cc-product-info">'+name+'<small>'+esc(b.no||'')+' / '+esc(b.name||'')+'</small>'+tag+'</div><footer>'+price+wish+'</footer></article>';
  if(id==='02-scrapbook')return '<article class="scrap-product"'+common+'>'+img+'<div>'+tag+name+'<small>'+esc(b.no||'')+' / '+esc(b.name||'')+'</small><footer>'+price+wish+'</footer></div></article>';
  if(id==='03-school-festival')return '<article class="school-product"'+common+'><span class="school-product-label">GOODS</span>'+img+'<div>'+name+tag+'<small>'+esc(b.no||'')+' · '+esc(b.name||'')+'</small></div><footer>'+price+wish+'</footer></article>';
  if(id==='04-museum-editorial')return '<article class="museum-product"'+common+'>'+img+'<div><span>'+esc(b.no||'')+'</span>'+name+tag+'<small>'+esc(b.name||'')+'</small></div><footer>'+price+wish+'</footer></article>';
  if(id==='06-expo-catalogue')return '<article class="expo-product-row"'+common+'><span>G-'+num(j)+'</span>'+img+'<div>'+name+'<small>'+esc(b.no||'')+' / '+esc(b.name||'')+'</small></div><div>'+tag+'</div><footer>'+price+wish+'</footer></article>';
  return '<article class="kimetsu-product"'+common+'>'+img+'<div>'+tag+name+'<small>'+esc(b.no||'')+' · '+esc(b.name||'')+'</small></div><footer>'+price+wish+'</footer></article>';
}


export function activityMarkup({state,x,i,field,esc,image,scheduleInfo,venueInfo,guestHtml,action,modules,type,typeLabel}){
  const id=tid(state);if(usesBase(id,'activityMarkup'))return '';
  const common=' id="participation-'+esc(x.id||String(i))+'" data-oe-item="participation" data-oe-index="'+i+'"';
  const title=field('participation.'+i+'.title',x.title||'活动','h3');
  const summary=String(x.text||'').trim()?field('participation.'+i+'.text',x.text,'p','oe-secondary-copy'):'';
  const body=modules.length?'<div class="oe-activity-modules">'+modules.join('')+'</div>':'';
  const meta=type==='venue'?venueInfo:scheduleInfo;
  if(id===BL)return '<article class="bl-activity"'+common+'><header><span>'+num(i)+'</span>'+typeLabel+'</header><div class="bl-activity-body"><div class="bl-activity-visual">'+image+'</div><div class="bl-activity-copy">'+title+summary+meta+guestHtml+body+action+'</div></div></article>';
  if(id===BD)return '<article class="bd-activity"'+common+'><div class="bd-activity-visual">'+image+'</div><div class="bd-activity-copy"><span class="bd-tag">'+typeLabel+'</span>'+title+summary+meta+guestHtml+body+action+'</div></article>';
  if(id===TP)return '<article class="tp-activity"'+common+'><div class="tp-activity-visual">'+image+'</div><div class="tp-activity-copy"><span class="tp-activity-tag">'+typeLabel+'</span>'+title+summary+meta+guestHtml+body+action+'</div></article>';
  if(id==='02-scrapbook')return '<article class="scrap-activity"'+common+'><div class="scrap-activity-photo">'+image+'</div><div class="scrap-activity-note"><span>MEMORY PLAN '+num(i)+'</span>'+title+'<small>'+typeLabel+'</small>'+summary+meta+guestHtml+action+body+'</div></article>';
  if(id==='03-school-festival')return '<article class="school-activity"'+common+'><header><span>'+num(i)+'</span><b>'+typeLabel+'</b></header><div class="school-activity-main">'+image+'<div>'+title+summary+meta+guestHtml+action+body+'</div></div></article>';
  if(id==='04-museum-editorial')return '<article class="museum-activity"'+common+'><aside><span>PROGRAM '+num(i)+'</span><small>'+typeLabel+'</small></aside><div class="museum-activity-copy">'+title+summary+meta+guestHtml+body+action+'</div>'+image+'</article>';
  if(id==='05-live-poster')return '<article class="live-activity"'+common+'><div class="live-activity-no">'+num(i)+'</div><div class="live-activity-visual">'+image+'</div><div class="live-activity-copy"><span>'+typeLabel+'</span>'+title+summary+meta+guestHtml+body+action+'</div></article>';
  if(id==='06-expo-catalogue')return '<article class="expo-activity-row"'+common+'><span>A-'+num(i)+'</span><div>'+typeLabel+'</div><div>'+title+summary+'</div><div>'+meta+guestHtml+'</div><div>'+action+body+'</div>'+image+'</article>';
  return '<article class="kimetsu-activity"'+common+'><div class="kimetsu-activity-mark">'+num(i)+'</div>'+image+'<div class="kimetsu-activity-copy"><span>'+typeLabel+'</span>'+title+summary+meta+guestHtml+body+action+'</div></article>';
}

export function guideMarkup({state,x,i,field,esc,image,navigation,preset,kindLabel,scope}){
  const id=tid(state);if(usesBase(id,'guideMarkup'))return '';
  const common=' id="guide-'+esc(x.id||String(i))+'" data-oe-item="guide" data-oe-index="'+i+'"';
  const title=field('guide.items.'+i+'.title',x.title||'','span'),text=field('guide.items.'+i+'.text',x.text||'','p');
  const label=esc(x.label||kindLabel[preset]||'GUIDE');
  if(id===CM)return '<article class="cm-guide"'+common+'><div class="cm-guide-icon">'+num(i)+'</div><div class="cm-guide-body"><small>'+label+'</small><h3>'+title+'</h3>'+text+navigation+'</div>'+image+'</article>';
  if(id===CC)return '<article class="cc-guide"'+common+'><span class="cc-guide-no">注意事項 '+num(i)+'</span><div class="cc-guide-body"><small>'+label+'</small><h3>'+title+'</h3>'+text+navigation+'</div>'+image+'</article>';
  if(id===BL)return '<article class="bl-note"'+common+'><div class="bl-note-no">'+num(i)+'</div><div class="bl-note-body"><small>'+label+'</small><h3>'+title+'</h3>'+text+navigation+'</div>'+image+'</article>';
  if(id===TP)return '<article class="tp-rule"'+common+'><div class="tp-rule-card"><small>'+label+'</small><h3>'+title+'</h3>'+text+navigation+'</div>'+image+'</article>';
  if(id===BD)return '<article class="bd-tip"'+common+'><span class="bd-tip-pin">'+num(i)+'</span><div><small>'+label+'</small><h3>'+title+'</h3>'+text+navigation+'</div>'+image+'</article>';
  if(id==='02-scrapbook')return '<article class="scrap-guide"'+common+'><span>NOTE '+num(i)+'</span><div><small>'+label+'</small><h3>'+title+'</h3>'+text+navigation+'</div>'+image+'</article>';
  if(id==='03-school-festival')return '<article class="school-guide"'+common+'><div class="school-guide-no">'+num(i)+'</div><div><span>'+label+'</span><h3>'+title+'</h3>'+text+navigation+'</div>'+image+'</article>';
  if(id==='04-museum-editorial')return '<article class="museum-guide"'+common+'><aside>'+num(i)+' / '+label+'</aside><div><h3>'+title+'</h3>'+text+navigation+'</div>'+image+'</article>';
  if(id==='05-live-poster')return '<article class="live-guide"'+common+'><span>'+num(i)+'</span><div><small>'+label+'</small><h3>'+title+'</h3>'+text+navigation+'</div>'+image+'</article>';
  if(id==='06-expo-catalogue')return '<article class="expo-guide-row"'+common+'><span>G-'+num(i)+'</span><div>'+label+'</div><div><h3>'+title+'</h3>'+text+'</div><div>'+navigation+'</div>'+image+'</article>';
  return '<article class="kimetsu-guide"'+common+'><span>'+num(i)+'</span><div><small>'+label+'</small><h3>'+title+'</h3>'+text+navigation+'</div>'+image+'</article>';
}

export function communityMarkup({state,x,i,field,esc,img,action}){
  const id=tid(state);if(usesBase(id,'communityMarkup'))return '';
  const common=' data-oe-item="socialLinks" data-oe-index="'+i+'"';
  const label=field('socialLinks.'+i+'.label',x.label,'b'),note=field('socialLinks.'+i+'.note',x.note||'','p');
  if(id===CM)return '<article class="cm-social"'+common+'><div class="cm-social-avatar">'+img+'</div><div class="cm-social-text">'+label+note+'</div>'+action+'</article>';
  if(id===BL)return '<article class="bl-follow"'+common+'><span class="bl-follow-no">'+num(i)+'</span><div class="bl-follow-text">'+label+note+'</div><div class="bl-follow-qr">'+img+'</div>'+action+'</article>';
  if(id===TP)return '<article class="tp-seat"'+common+'><div class="tp-seat-face">'+img+'</div>'+label+note+action+'</article>';
  if(id===BD)return '<article class="bd-bubble"'+common+'><div class="bd-bubble-text">'+label+note+'</div><div class="bd-bubble-face">'+img+'</div>'+action+'</article>';
  if(id==='02-scrapbook')return '<article class="scrap-social"'+common+'><div class="scrap-social-face">'+img+'<span class="scrap-social-stamp">↗</span></div><div class="scrap-social-caption">'+label+note+action+'</div></article>';
  if(id==='03-school-festival')return '<article class="school-social"'+common+'><span>'+num(i)+'</span>'+img+'<div>'+label+note+action+'</div></article>';
  if(id==='04-museum-editorial')return '<article class="museum-social"'+common+'><span>COMMUNITY '+num(i)+'</span><div>'+label+note+action+'</div>'+img+'</article>';
  if(id==='05-live-poster')return '<article class="live-social"'+common+'>'+img+'<div><span>FOLLOW / JOIN</span>'+label+note+action+'</div></article>';
  if(id==='06-expo-catalogue')return '<article class="expo-social"'+common+'><span>C-'+num(i)+'</span>'+img+'<div>'+label+note+'</div>'+action+'</article>';
  return '<article class="kimetsu-social"'+common+'>'+img+'<div>'+label+note+action+'</div></article>';
}


export function quickMarkup({state,x,i,esc}){
  const id=tid(state);if(usesBase(id,'quickMarkup'))return '';
  const href='#'+x[1],mode=x[4],label=x[2],hint=x[3],n=num(i);
  const common=' href="'+href+'" data-target-mode="'+mode+'" data-page-link="'+esc(x[1])+'"';
  if(id===BL)return '<a class="bl-index"'+common+'><span>'+n+'</span><b>'+esc(label)+'</b><i>'+esc(hint)+'</i></a>';
  if(id===TP)return '<a class="tp-menu-link"'+common+'><b>'+esc(label)+'</b><em>'+esc(hint)+'</em></a>';
  if(id===BD)return '<a class="bd-page-link"'+common+'><span>'+n+'</span><b>'+esc(label)+'</b><em>'+esc(hint)+'</em></a>';
  if(id==='02-scrapbook')return '<a class="scrap-index-card"'+common+'><span>'+n+'</span><div><small>MEMORY FILE</small><b>'+esc(label)+'</b><em>'+esc(hint)+'</em></div><i>↗</i></a>';
  if(id==='03-school-festival')return '<a class="school-wayfinding-card"'+common+'><span>'+n+'</span><div><small>FESTIVAL GUIDE</small><b>'+esc(label)+'</b><em>'+esc(hint)+'</em></div><i>→</i></a>';
  if(id==='04-museum-editorial')return '<a class="museum-index-link"'+common+'><span>'+n+'</span><div><b>'+esc(label)+'</b><small>'+esc(hint)+'</small></div><i>VIEW</i></a>';
  if(id==='05-live-poster')return '<a class="live-menu-tile"'+common+'><span>'+n+'</span><div><small>CONTENTS</small><b>'+esc(label)+'</b></div><i>'+esc(hint)+'</i></a>';
  if(id==='06-expo-catalogue')return '<a class="expo-index-row"'+common+'><span>I-'+n+'</span><b>'+esc(label)+'</b><small>'+esc(hint)+'</small><i>→</i></a>';
  return '<a class="kimetsu-path-link"'+common+'><span>'+n+'</span><div><small>章</small><b>'+esc(label)+'</b><em>'+esc(hint)+'</em></div><i>›</i></a>';
}

export function mapLinkMarkup({state,item,index,field,esc,target,kind,itemId}){
  const id=tid(state);if(usesBase(id,'mapLinkMarkup'))return '';
  const common=' href="#'+esc(target)+'" data-target-mode="page" data-page-link="'+esc(target)+'" data-explore-link data-explore-kind="'+esc(kind)+'" data-explore-id="'+esc(itemId)+'" data-oe-item="explore" data-oe-index="'+index+'"';
  const label=field('venueMap.links.'+index+'.label',item.label,'span');
  if(id===CM)return '<a class="cm-map-tag"'+common+'><b>#</b>'+label+'</a>';
  if(id===BL)return '<a class="bl-route"'+common+'><span>'+num(index)+'</span><b>'+label+'</b><i>GO</i></a>';
  if(id===TP)return '<a class="tp-route"'+common+'><b>'+label+'</b><i></i><small>'+num(index)+'</small></a>';
  if(id===BD)return '<a class="bd-route"'+common+'><b>'+label+'</b></a>';
  if(id==='05-live-poster')return '<a class="ls-route-stop"'+common+'><span>'+num(index)+'</span><b>'+label+'</b></a>';
  if(id==='02-scrapbook')return '<a class="scrap-map-tag"'+common+'><b>'+num(index)+'</b>'+label+'<i>↗</i></a>';
  if(id==='03-school-festival')return '<a class="school-map-sign"'+common+'><span>'+num(index)+'</span><b>'+label+'</b><i>→</i></a>';
  if(id==='04-museum-editorial')return '<a class="museum-map-index"'+common+'><span>'+num(index)+'</span><b>'+label+'</b><small>VIEW</small></a>';
  if(id==='05-live-poster')return '<a class="live-venue-link"'+common+'><span>'+num(index)+'</span><b>'+label+'</b><i>↗</i></a>';
  if(id==='06-expo-catalogue')return '<a class="expo-area-link"'+common+'><span>A-'+num(index)+'</span><b>'+label+'</b><i>→</i></a>';
  return '<a class="kimetsu-map-link"'+common+'><span>'+num(index)+'</span><b>'+label+'</b><i>巡</i></a>';
}
