/* Shared "web catalogue" (電子場刊): a page-flip pamphlet built from the shared core data —
   cover, contents, greeting & rules, venue maps, circle cuts, works and a stamp-rally back cover.
   Enabled per template with presentationProfile.catalogueBook. mountCatalogueBook is
   self-contained because the exporter inlines it via toString(). */
export function catalogueBookData(state){
  const booths=(state?.booths||[]).map((b,boothIndex)=>({...b,boothIndex})).filter(b=>b.name||b.no);
  booths.sort((a,b)=>String(a.no||'').localeCompare(String(b.no||''),'zh-CN',{numeric:true}));
  const first=String(state?.venueMap?.image||'').trim();
  const maps=[...(first?[{image:first,title:String(state?.venueMap?.imageTitle||'')}]:[]),...(Array.isArray(state?.venueMap?.more)?state.venueMap.more:[]).filter(m=>String(m?.image||'').trim()).map(m=>({image:String(m.image),title:String(m.title||'')}))];
  return {
    eventName:String(state?.eventName||''),date:String(state?.date||''),location:String(state?.location||''),venue:String(state?.edition||''),
    tagline:String(state?.tagline||''),cover:String(state?.heroImage||''),
    rules:(state?.guide?.items||[]).slice(0,3).map(g=>({title:String(g.title||''),text:String(g.text||'').split('\n').filter(Boolean).slice(0,3).join('\n')})),
    maps,
    circles:booths.map(b=>({no:String(b.no||''),name:String(b.name||''),type:String(b.type||''),cut:String(b.logo||b.products?.find(p=>p.image)?.image||''),boothIndex:b.boothIndex})),
    news:(state?.updates||[]).map((u,i)=>({i,title:String(u?.title||''),date:String(u?.date||''),target:String(u?.target||'')})).filter(u=>u.title.trim()),
    tickets:(state?.tickets||[]).map((t,i)=>({i,name:String(t?.name||''),price:String(t?.price||''),gift:String(t?.gift||''),note:String(t?.note||'')})).filter(t=>t.name.trim()),
    ticketHref:/^https?:\/\//i.test(String(state?.ticketUrl||'').trim())?String(state.ticketUrl).trim():'',
    ticketLabel:String(state?.ticketLinkLabel||'').trim()||'前往官方售票平台',
    routes:(state?.venueMap?.links||[]).map((l,i)=>({i,label:String(l?.label||''),target:String(l?.target||'')})).filter(l=>l.label.trim()&&(l.target==='booths'||l.target==='guide'||l.target.startsWith('custom-'))&&state?.modules?.[l.target]!==false),
    social:(state?.socialLinks||[]).map((x,i)=>({i,label:String(x?.label||''),note:String(x?.note||''),image:String(x?.image||''),url:/^https?:\/\//i.test(String(x?.url||'').trim())?String(x.url).trim():''})).filter(x=>x.label.trim()||x.note.trim()||x.image||x.url),
    sponsors:(state?.sponsors||[]).map((x,i)=>({i,name:String(x?.name||''),level:String(x?.level||''),logo:String(x?.logo||''),url:/^https?:\/\//i.test(String(x?.url||'').trim())?String(x.url).trim():''})).filter(x=>x.name.trim()||x.logo||x.url),
    works:booths.flatMap(b=>(b.products||[]).map((p,productIndex)=>({name:String(p.name||''),price:String(p.price||''),image:String(p.image||''),no:String(b.no||''),circle:String(b.name||''),boothIndex:b.boothIndex,productIndex}))).filter(w=>w.name)
  };
}

export function mountCatalogueBook(root,data,{storageKey='oe-catalogue-page'}={}){
  if(!root)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // Only the editor gets editable fields; the exported page carries plain text (the attribute name is split so the exported script itself never contains it)
  const fld=(path,v,tag)=>'<'+(tag||'span')+(data.editable?' data-oe-field="'+path+'" content'+'editable="true" spellcheck="false"':'')+'>'+esc(v)+'</'+(tag||'span')+'>';
  const chunk=(list,n)=>{const out=[];for(let i=0;i<list.length;i+=n)out.push(list.slice(i,i+n));return out};
  const head=(jp,zh)=>'<header class="cb-page-head"><small>'+jp+'</small><b>'+zh+'</b></header>';
  const pages=[];
  pages.push({kind:'cover',html:'<div class="cb-cover'+(data.cover?' has-art':'')+'"'+(data.cover?' style="background-image:url(&quot;'+esc(data.cover)+'&quot;)"':'')+'><span class="cb-cover-badge">WEB CATALOGUE</span><span class="cb-cover-vol">電子場刊 VOL.01</span><h3>'+esc(data.eventName||'STARDUST ONLY')+'</h3><p>'+esc([data.date,data.location].filter(Boolean).join(' · '))+'</p><i class="cb-cover-star">✦</i></div>'});
  const sections=[['greeting','ごあいさつ','主办致辞'],...(data.news.length?[['news','お知らせ','最新公告']]:[]),...(data.tickets.length?[['tickets','入場券','入场票']]:[]),['venue','会場マップ','场地图'],...(data.circles.length?[['circles','サークル一覧','参展社团']]:[]),...(data.works.length?[['works','新刊・グッズ','新刊与制品']]:[]),...(data.social.length?[['community','コミュニティ','社群']]:[]),...(data.sponsors.length?[['sponsors','協賛','合作伙伴']]:[]),['rally','スタンプラリー','打卡页']];
  const contentsAt=pages.length;pages.push({kind:'contents',html:''});
  const starts={};
  starts.greeting=pages.length;
  pages.push({kind:'greeting',html:head('GREETING','主办致辞')+'<div class="cb-bubble"><span class="cb-avatar">✿</span><p>'+esc(data.tagline||'欢迎来到本次活动！请在场刊里找到想去的社团。')+'</p></div>'+(data.rules.length?'<div class="cb-rules">'+data.rules.map((r,i)=>'<article><b>'+String(i+1).padStart(2,'0')+' '+esc(r.title)+'</b><p>'+esc(r.text)+'</p></article>').join('')+'</div>':'')});
  const attr=(kind,i)=>' data-oe-item="'+kind+'" data-oe-index="'+i+'"';
  const pageTargets=t=>t==='booths'||t==='guide'||t.startsWith('custom-');
  if(data.news.length){starts.news=pages.length;chunk(data.news,5).forEach((group,gi)=>pages.push({kind:'news',html:head('NEWS','最新公告')+'<ol class="cb-news">'+group.map((u,k)=>{
    const t=({passport:'activities','guide-home':'guide','schedule-home':'activities'}[u.target]||u.target||'');
    const inner='<span class="cb-news-no">'+String(gi*5+k+1).padStart(2,'0')+'</span><time>'+esc(u.date)+'</time>'+fld('updates.'+u.i+'.title',u.title,'b')+'<i aria-hidden="true">›</i>';
    const link=t==='tickets'?'<a class="cb-news-item" href="#tickets" data-catalogue-open="tickets"'+attr('updates',u.i)+'>':pageTargets(t)?'<a class="cb-news-item" href="#'+esc(t)+'" data-target-mode="page" data-page-link="'+esc(t)+'"'+attr('updates',u.i)+'>':'<div class="cb-news-item"'+attr('updates',u.i)+'>';
    return '<li>'+link+inner+(link.startsWith('<a')?'</a>':'</div>')+'</li>';
  }).join('')+'</ol>'}))}
  if(data.tickets.length){starts.tickets=pages.length;const groups=chunk(data.tickets,4);groups.forEach((group,gi)=>pages.push({kind:'tickets',html:head('ADMISSION','入场票')+'<div class="cb-tickets">'+group.map((t,k)=>'<article class="cb-ticket"'+attr('tickets',t.i)+'><div class="cb-ticket-main"><small>ADMISSION TICKET · 入場券</small>'+fld('tickets.'+t.i+'.name',t.name,'b')+(t.gift||data.editable?fld('tickets.'+t.i+'.gift',t.gift,'p'):'')+(t.note||data.editable?fld('tickets.'+t.i+'.note',t.note,'em'):'')+'</div><div class="cb-ticket-stub"><span>No.'+String(gi*4+k+1).padStart(2,'0')+'</span>'+fld('tickets.'+t.i+'.price',t.price,'strong')+'</div></article>').join('')+'</div>'+(gi===groups.length-1&&data.ticketHref?'<a class="cb-buy ticket-purchase-link" href="'+esc(data.ticketHref)+'" target="_blank" rel="noopener">'+esc(data.ticketLabel)+' ↗</a>':'')}))}
  starts.venue=pages.length;
  const routes=data.routes.length?'<nav class="cb-routes" aria-label="逛展导览"><b>✦ 逛展导览 ✦</b>'+data.routes.map(r=>'<a class="cb-route" href="#'+esc(r.target)+'" data-target-mode="page" data-page-link="'+esc(r.target)+'"'+attr('explore',r.i)+'><span>✦</span>'+fld('venueMap.links.'+r.i+'.label',r.label)+'<i>›</i></a>').join('')+'</nav>':'';
  if(data.maps.length)data.maps.forEach((m,i)=>pages.push({kind:'map',html:head('VENUE MAP','会场配置图'+(data.maps.length>1?' '+(i+1)+' / '+data.maps.length:''))+'<button type="button" class="cb-map" data-product-lightbox="'+esc(m.image)+'"><img src="'+esc(m.image)+'" alt="'+esc(m.title||'会场配置图')+'"></button>'+(m.title?'<p class="cb-map-title">'+esc(m.title)+'</p>':'')+(i===0?routes:'')}));
  else pages.push({kind:'map',html:head('VENUE MAP','会场配置图')+'<div class="cb-map cb-map-empty"><b>场地图</b><span>主办方暂未上传场地图</span></div>'+routes});
  if(data.circles.length){starts.circles=pages.length;chunk(data.circles,6).forEach(group=>pages.push({kind:'circles',html:head('CIRCLE LIST','参展社团')+'<div class="cb-cuts">'+group.map(c=>'<a class="cb-cut" href="#booths" data-target-mode="page" data-page-link="booths" data-catalogue-booth="'+c.boothIndex+'"><span class="cb-space">'+esc(c.no||'—')+'</span><span class="cb-cut-art">'+(c.cut?'<img src="'+esc(c.cut)+'" alt="'+esc(c.name)+'" loading="lazy">':'<em>'+esc((c.name||'?').slice(0,2))+'</em>')+'</span><b>'+esc(c.name)+'</b><small>'+esc(c.type)+'</small></a>').join('')+'</div>'}))}
  if(data.works.length){starts.works=pages.length;chunk(data.works,8).forEach(group=>pages.push({kind:'works',html:head('NEW WORKS','新刊与制品')+'<div class="cb-works">'+group.map(w=>'<a class="cb-work" href="#booths" data-target-mode="page" data-page-link="booths" data-catalogue-product="'+w.boothIndex+':'+w.productIndex+'"><span class="cb-work-art">'+(w.image?'<img src="'+esc(w.image)+'" alt="'+esc(w.name)+'" loading="lazy">':'<em>NEW</em>')+'</span><b>'+esc(w.name)+'</b><small>'+esc([w.no,w.price].filter(Boolean).join(' · '))+'</small></a>').join('')+'</div>'}))}
  if(data.social.length){starts.community=pages.length;chunk(data.social,4).forEach(group=>pages.push({kind:'community',html:head('COMMUNITY','社群')+'<div class="cb-socials">'+group.map(x=>'<article class="cb-social"'+attr('socialLinks',x.i)+'><span class="cb-social-art">'+(x.image?'<img src="'+esc(x.image)+'" alt="'+esc(x.label)+'" loading="lazy">':'<em>'+esc((x.label||'群').slice(0,2))+'</em>')+'</span>'+fld('socialLinks.'+x.i+'.label',x.label,'b')+(x.note||data.editable?fld('socialLinks.'+x.i+'.note',x.note,'p'):'')+(x.url?'<a href="'+esc(x.url)+'" target="_blank" rel="noopener">进入 ↗</a>':'')+'</article>').join('')+'</div>'}))}
  if(data.sponsors.length){starts.sponsors=pages.length;chunk(data.sponsors,8).forEach(group=>pages.push({kind:'sponsors',html:head('SPECIAL THANKS','合作伙伴')+'<div class="cb-thanks">'+group.map(x=>{const inner=(x.logo?'<img src="'+esc(x.logo)+'" alt="'+esc(x.name)+'" loading="lazy">':'')+fld('sponsors.'+x.i+'.name',x.name,'b')+(x.level||data.editable?fld('sponsors.'+x.i+'.level',x.level,'small'):'');return (x.url?'<a class="cb-sponsor" href="'+esc(x.url)+'" target="_blank" rel="noopener"'+attr('sponsors',x.i)+'>':'<div class="cb-sponsor"'+attr('sponsors',x.i)+'>')+inner+(x.url?'</a>':'</div>')}).join('')+'</div>'}))}
  starts.rally=pages.length;
  pages.push({kind:'rally',html:head('STAMP RALLY','打卡页')+'<p class="cb-rally-copy">逛社团、收集印章，在会场留下属于你的回忆。</p><div class="cb-stamps">'+['入场','社团','新刊','合影','场贩','再见'].map(s=>'<span>'+s+'</span>').join('')+'</div><p class="cb-rally-end">SEE YOU AT THE VENUE ✦</p>'});
  // Short sections share a page, so one announcement or two tickets do not leave a page mostly empty.
  const tally=(pg,re)=>(pg.html.match(re)||[]).length;
  const est=pg=>pg.kind==='news'?70+tally(pg,/class="cb-news-item/g)*66:pg.kind==='tickets'?70+tally(pg,/class="cb-ticket"/g)*139+(pg.html.includes('cb-buy')?50:0):pg.kind==='community'?70+Math.ceil(tally(pg,/class="cb-social"/g)/2)*282:pg.kind==='sponsors'?70+Math.ceil(tally(pg,/class="cb-sponsor"/g)/3)*52:0;
  const joinable=['news','tickets','community','sponsors'];
  const packed=[];
  pages.forEach(pg=>{
    const prev=packed[packed.length-1];pg.kinds=[pg.kind];
    const h=est(pg);
    if(prev&&joinable.includes(pg.kind)&&prev.kinds.every(k=>joinable.includes(k))&&prev.h+h<=600){prev.html+=pg.html;prev.kinds.push(pg.kind);prev.h+=h;prev.kind='multi'}
    else{pg.h=h;packed.push(pg)}
  });
  pages.length=0;packed.forEach(pg=>pages.push(pg));
  const secOf={greeting:'greeting',news:'news',tickets:'tickets',map:'venue',circles:'circles',works:'works',community:'community',sponsors:'sponsors',rally:'rally'};
  Object.keys(starts).forEach(k=>delete starts[k]);
  pages.forEach((pg,i)=>pg.kinds.forEach(k=>{if(secOf[k]&&starts[secOf[k]]===undefined)starts[secOf[k]]=i}));
  if(pages.length%2)pages.splice(pages.length-1,0,{kind:'memo',html:head('MEMO','备忘')+'<div class="cb-memo"></div>'});
  pages[contentsAt].html=head('CONTENTS','目次')+'<ol class="cb-contents">'+sections.filter(([k])=>starts[k]!==undefined).map(([k,jp,zh])=>'<li><button type="button" data-catalogue-goto="'+starts[k]+'"><span>'+jp+'</span><b>'+zh+'</b><i>P.'+String(starts[k]+1).padStart(2,'0')+'</i></button></li>').join('')+'</ol>';
  const total=pages.length;
  const page=(i,side)=>i<0||i>=total?'<div class="cb-page cb-blank '+side+'"></div>':'<div class="cb-page cb-kind-'+pages[i].kind+' '+side+'" data-catalogue-page="'+i+'">'+pages[i].html+(i>0?'<span class="cb-folio">'+String(i+1).padStart(2,'0')+'</span>':'')+'</div>';
  root.innerHTML='<div class="cb-stage"><div class="cb-book" data-catalogue-book></div><span class="cb-ribbon" aria-hidden="true"></span></div><div class="cb-controls"><button type="button" data-catalogue-step="-1" aria-label="上一页">‹</button><span data-catalogue-count></span><button type="button" data-catalogue-step="1" aria-label="下一页">›</button></div>';
  const book=root.querySelector('[data-catalogue-book]'),count=root.querySelector('[data-catalogue-count]');
  const single=()=>root.clientWidth<760;
  // Desktop shows spreads [i-1,i] where i is even (the cover sits alone on the right).
  let at=0;try{at=Math.max(0,Math.min(total-1,Number(sessionStorage.getItem(storageKey))||0))}catch{}
  const spreadOf=i=>single()?i:(i%2?i+1:i);
  const render=()=>{
    at=spreadOf(at);
    book.classList.toggle('is-single',single());
    book.innerHTML=single()?page(at,'solo'):page(at-1,'left')+page(at,'right');
    count.textContent=single()?(at+1)+' / '+total:(at===0?'封面':at>=total?'封底':at+'-'+(at+1))+' / '+total;
    try{sessionStorage.setItem(storageKey,String(at))}catch{}
  };
  let busy=false;
  const go=next=>{
    next=Math.max(0,Math.min(single()?total-1:total-(total%2?1:0),next));
    if(busy||next===at||next<0||next>=total+1)return;
    const forward=next>at,reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){at=next;render();return}
    busy=true;
    const leaf=document.createElement('div');
    leaf.className='cb-leaf '+(single()?'solo':forward?'right':'left')+(forward?' forward':' back');
    const frontIndex=single()?at:(forward?at:at-1),backIndex=single()?next:(forward?at+1:at-2);
    leaf.innerHTML='<div class="cb-leaf-face front">'+page(frontIndex,'face')+'</div><div class="cb-leaf-face back">'+page(backIndex,'face')+'</div>';
    // Underneath, the pages that the turning leaf reveals.
    if(!single()){const keep=forward?page(at-1,'left'):page(at,'right'),reveal=forward?page(next,'right'):page(next-1,'left');book.innerHTML=forward?keep+reveal:reveal+keep}
    else book.innerHTML=page(next,'solo');
    book.appendChild(leaf);
    requestAnimationFrame(()=>requestAnimationFrame(()=>leaf.classList.add('turning')));
    setTimeout(()=>{at=next;busy=false;render()},620);
  };
  root.querySelectorAll('[data-catalogue-step]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();go(at+Number(b.dataset.catalogueStep)*(single()?1:2))}));
  if(document.__oeBookOpen)document.removeEventListener('click',document.__oeBookOpen,true);
  document.__oeBookOpen=e=>{
    const o=e.target.closest&&e.target.closest('[data-catalogue-open]');if(!o)return;
    const at2=starts[o.dataset.catalogueOpen];if(at2===undefined)return;
    e.preventDefault();go(at2);root.scrollIntoView({behavior:'smooth',block:'start'});
  };
  document.addEventListener('click',document.__oeBookOpen,true);
  root.addEventListener('click',e=>{const g=e.target.closest('[data-catalogue-goto]');if(g){e.preventDefault();e.stopPropagation();go(Number(g.dataset.catalogueGoto))}});
  let startX=null;
  book.addEventListener('pointerdown',e=>{startX=e.clientX});
  book.addEventListener('pointerup',e=>{if(startX===null)return;const dx=e.clientX-startX;startX=null;if(Math.abs(dx)>50){book._oeSwiped=true;go(at+(dx<0?1:-1)*(single()?1:2))}});
  book.addEventListener('click',e=>{if(book._oeSwiped){e.preventDefault();e.stopPropagation();book._oeSwiped=false}},true);
  root.tabIndex=0;
  root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(at+(single()?1:2))}if(e.key==='ArrowLeft'){e.preventDefault();go(at-(single()?1:2))}});
  if(typeof ResizeObserver==='function'){let wasSingle=single();new ResizeObserver(()=>{if(single()!==wasSingle&&!busy){wasSingle=single();render()}}).observe(root)}
  render();
}

export const catalogueBookStyle=`
.cb-stage{position:relative;perspective:2200px;max-width:1100px;margin:0 auto}
.cb-book{position:relative;display:grid;grid-template-columns:1fr 1fr;aspect-ratio:1.42;min-height:420px;touch-action:pan-y;user-select:none}
.cb-book.is-single{grid-template-columns:1fr;aspect-ratio:auto;min-height:560px;max-width:520px;margin:0 auto}
.cb-page{position:relative;overflow:hidden;padding:clamp(16px,3vw,34px) clamp(16px,3vw,34px) clamp(40px,5vw,54px);display:flex;flex-direction:column;gap:14px;min-width:0}
.cb-page.left{border-radius:14px 0 0 14px}.cb-page.right{border-radius:0 14px 14px 0}.cb-page.solo{border-radius:14px}
.cb-blank{background:transparent!important;box-shadow:none!important}
.cb-folio{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-size:11px;font-weight:900;letter-spacing:.1em}
.cb-leaf{position:absolute;top:0;bottom:0;width:50%;transform-style:preserve-3d;transition:transform .6s cubic-bezier(.3,.7,.2,1);z-index:5;pointer-events:none}
.cb-leaf.right{left:50%;transform-origin:left center}.cb-leaf.left{left:0;transform-origin:right center}
.cb-leaf.solo{left:0;width:100%;transform-origin:left center}
.cb-leaf.right.turning{transform:rotateY(-180deg)}.cb-leaf.left.turning{transform:rotateY(180deg)}
.cb-leaf.solo.forward.turning{transform:rotateY(-180deg)}.cb-leaf.solo.back.turning{transform:rotateY(180deg)}
.cb-leaf-face{position:absolute;inset:0;backface-visibility:hidden;display:grid}
.cb-leaf-face.back{transform:rotateY(180deg)}
.cb-leaf-face>.cb-page{border-radius:inherit;height:100%}
.cb-controls{display:flex;align-items:center;justify-content:center;gap:14px;margin-top:18px}
.cb-controls button{width:42px;height:42px;border-radius:50%;cursor:pointer;font-size:24px;line-height:1}
.cb-controls span{min-width:110px;text-align:center;font-weight:900;font-size:13px;letter-spacing:.08em}
.cb-page-head{display:flex;flex-direction:column;gap:2px}
.cb-page-head small{font-size:10px;font-weight:900;letter-spacing:.2em}
.cb-page-head b{font-size:clamp(18px,2.2vw,26px);font-weight:1000}
.cb-cover{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(18px,3vw,36px);background-size:cover;background-position:center}
.cb-cover h3{margin:6px 0;font-size:clamp(30px,4.6vw,62px);line-height:1;font-weight:1000}
.cb-cover p{margin:0;font-weight:800}
.cb-cuts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:10px;flex:1;min-height:0}
.cb-cut{position:relative;display:flex;flex-direction:column;gap:4px;min-width:0;min-height:0;padding:8px}
.cb-cut-art{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
.cb-cut-art img,.cb-work-art img{width:100%;height:100%;object-fit:cover}
.cb-cut b,.cb-work b{font-size:13px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cb-cut small,.cb-work small{font-size:11px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cb-space{position:absolute;top:0;left:0;padding:3px 8px;font-size:11px;font-weight:1000;z-index:1}
.cb-works{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:10px;flex:1;min-height:0}
.cb-work{display:flex;flex-direction:column;gap:3px;min-width:0;min-height:0}
.cb-work-art{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
.cb-map{flex:1;min-height:0;border:0;padding:0;background:none;cursor:zoom-in;display:flex}
.cb-map img{width:100%;height:100%;object-fit:contain}
.cb-news{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.cb-news-item{display:grid;grid-template-columns:auto auto minmax(0,1fr) auto;align-items:center;gap:10px;padding:12px 14px;text-decoration:none;color:inherit;font-size:14px}
.cb-news-item b{min-width:0;overflow-wrap:anywhere}.cb-news-item time{font-size:12px;opacity:.7}
.cb-tickets{display:grid;gap:14px}
.cb-ticket{display:grid;grid-template-columns:minmax(0,1fr) auto;min-width:0}
.cb-ticket-main{display:flex;flex-direction:column;gap:3px;padding:12px 16px;min-width:0}
.cb-ticket-main small{font-size:10px;font-weight:900;letter-spacing:.12em}.cb-ticket-main b{font-size:20px}.cb-ticket-main p,.cb-ticket-main em{margin:0;font-size:12px;font-style:normal;line-height:1.5}
.cb-ticket-stub{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px;padding:10px 16px;min-width:88px}
.cb-ticket-stub span{font-size:11px;font-weight:900}.cb-ticket-stub strong{font-size:22px}
.cb-buy{align-self:flex-start;padding:10px 18px;font-weight:900;text-decoration:none;margin-top:auto}
.cb-routes{display:flex;flex-direction:column;gap:8px}.cb-routes>b{text-align:center;font-size:13px;letter-spacing:.14em}
.cb-route{display:flex;align-items:center;gap:8px;padding:9px 14px;text-decoration:none;color:inherit;font-weight:800;font-size:14px}.cb-route i{margin-left:auto;font-style:normal}
.cb-map-empty{flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:160px;opacity:.7;cursor:default}
.cb-socials{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.cb-social{display:flex;flex-direction:column;gap:6px;padding:10px;min-width:0}
.cb-social-art{aspect-ratio:1;display:flex;align-items:center;justify-content:center;overflow:hidden}.cb-social-art img{width:100%;height:100%;object-fit:cover}.cb-social-art em{font-style:normal;font-weight:1000;font-size:22px}
.cb-social b{font-size:14px}.cb-social p{margin:0;font-size:12px;line-height:1.5}.cb-social a{font-size:12px;font-weight:900}
.cb-thanks{display:flex;flex-wrap:wrap;gap:12px}
.cb-sponsor{display:flex;align-items:center;gap:8px;padding:8px 14px;text-decoration:none;color:inherit}.cb-sponsor img{max-height:30px;width:auto}.cb-sponsor small{opacity:.7;font-size:11px}
.cb-contents{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.cb-contents button{width:100%;display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:12px;border:0;background:none;padding:10px 0;cursor:pointer;font:inherit;color:inherit;text-align:left}
.cb-contents span{font-size:11px;font-weight:900;letter-spacing:.1em}.cb-contents b{font-size:18px}
.cb-bubble{display:flex;gap:12px;align-items:flex-start}
.cb-bubble p{margin:0;padding:14px 16px;border-radius:18px;position:relative;line-height:1.7;font-size:14px}
.cb-avatar{flex:0 0 46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:22px}
.cb-rules{display:grid;gap:10px}.cb-rules p{margin:4px 0 0;font-size:12px;line-height:1.6;white-space:pre-line}
.cb-stamps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:6px 0}
.cb-stamps span{aspect-ratio:1;border-radius:50%;display:grid;place-items:center;font-weight:900;font-size:13px;transform:rotate(-8deg)}
.cb-rally-copy,.cb-rally-end{margin:0;font-size:13px;line-height:1.7}.cb-rally-end{font-weight:1000;letter-spacing:.12em;text-align:center;margin-top:auto}
.cb-memo{flex:1;background-image:repeating-linear-gradient(transparent 0 27px,currentColor 27px 28px);opacity:.15}
@media(max-width:760px){.cb-socials{grid-template-columns:1fr 1fr}.cb-cuts{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr))}.cb-works{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr))}}
@media(prefers-reduced-motion:reduce){.cb-leaf{transition:none}}
`;
