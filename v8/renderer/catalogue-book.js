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
    works:booths.flatMap(b=>(b.products||[]).map((p,productIndex)=>({name:String(p.name||''),price:String(p.price||''),image:String(p.image||''),no:String(b.no||''),circle:String(b.name||''),boothIndex:b.boothIndex,productIndex}))).filter(w=>w.name)
  };
}

export function mountCatalogueBook(root,data,{storageKey='oe-catalogue-page'}={}){
  if(!root)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const chunk=(list,n)=>{const out=[];for(let i=0;i<list.length;i+=n)out.push(list.slice(i,i+n));return out};
  const head=(jp,zh)=>'<header class="cb-page-head"><small>'+jp+'</small><b>'+zh+'</b></header>';
  const pages=[];
  pages.push({kind:'cover',html:'<div class="cb-cover'+(data.cover?' has-art':'')+'"'+(data.cover?' style="background-image:url(&quot;'+esc(data.cover)+'&quot;)"':'')+'><span class="cb-cover-badge">WEB CATALOGUE</span><span class="cb-cover-vol">電子場刊 VOL.01</span><h3>'+esc(data.eventName||'STARDUST ONLY')+'</h3><p>'+esc([data.date,data.location].filter(Boolean).join(' · '))+'</p><i class="cb-cover-star">✦</i></div>'});
  const sections=[['greeting','ごあいさつ','主办致辞'],...(data.maps.length?[['maps','会場マップ','会场配置图']]:[]),...(data.circles.length?[['circles','サークル一覧','参展社团']]:[]),...(data.works.length?[['works','新刊・グッズ','新刊与制品']]:[]),['rally','スタンプラリー','打卡页']];
  const contentsAt=pages.length;pages.push({kind:'contents',html:''});
  const starts={};
  starts.greeting=pages.length;
  pages.push({kind:'greeting',html:head('GREETING','主办致辞')+'<div class="cb-bubble"><span class="cb-avatar">✿</span><p>'+esc(data.tagline||'欢迎来到本次活动！请在场刊里找到想去的社团。')+'</p></div>'+(data.rules.length?'<div class="cb-rules">'+data.rules.map((r,i)=>'<article><b>'+String(i+1).padStart(2,'0')+' '+esc(r.title)+'</b><p>'+esc(r.text)+'</p></article>').join('')+'</div>':'')});
  if(data.maps.length){starts.maps=pages.length;data.maps.forEach((m,i)=>pages.push({kind:'map',html:head('VENUE MAP','会场配置图'+(data.maps.length>1?' '+(i+1)+' / '+data.maps.length:''))+'<button type="button" class="cb-map" data-product-lightbox="'+esc(m.image)+'"><img src="'+esc(m.image)+'" alt="'+esc(m.title||'会场配置图')+'"></button>'+(m.title?'<p class="cb-map-title">'+esc(m.title)+'</p>':'')}))}
  if(data.circles.length){starts.circles=pages.length;chunk(data.circles,6).forEach(group=>pages.push({kind:'circles',html:head('CIRCLE LIST','参展社团')+'<div class="cb-cuts">'+group.map(c=>'<a class="cb-cut" href="#booths" data-target-mode="page" data-page-link="booths" data-catalogue-booth="'+c.boothIndex+'"><span class="cb-space">'+esc(c.no||'—')+'</span><span class="cb-cut-art">'+(c.cut?'<img src="'+esc(c.cut)+'" alt="'+esc(c.name)+'" loading="lazy">':'<em>'+esc((c.name||'?').slice(0,2))+'</em>')+'</span><b>'+esc(c.name)+'</b><small>'+esc(c.type)+'</small></a>').join('')+'</div>'}))}
  if(data.works.length){starts.works=pages.length;chunk(data.works,8).forEach(group=>pages.push({kind:'works',html:head('NEW WORKS','新刊与制品')+'<div class="cb-works">'+group.map(w=>'<a class="cb-work" href="#booths" data-target-mode="page" data-page-link="booths" data-catalogue-product="'+w.boothIndex+':'+w.productIndex+'"><span class="cb-work-art">'+(w.image?'<img src="'+esc(w.image)+'" alt="'+esc(w.name)+'" loading="lazy">':'<em>NEW</em>')+'</span><b>'+esc(w.name)+'</b><small>'+esc([w.no,w.price].filter(Boolean).join(' · '))+'</small></a>').join('')+'</div>'}))}
  starts.rally=pages.length;
  pages.push({kind:'rally',html:head('STAMP RALLY','打卡页')+'<p class="cb-rally-copy">逛社团、收集印章，在会场留下属于你的回忆。</p><div class="cb-stamps">'+['入场','社团','新刊','合影','场贩','再见'].map(s=>'<span>'+s+'</span>').join('')+'</div><p class="cb-rally-end">SEE YOU AT THE VENUE ✦</p>'});
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
.cb-book.is-single{grid-template-columns:1fr;aspect-ratio:.71;max-width:520px;margin:0 auto}
.cb-page{position:relative;overflow:hidden;padding:clamp(16px,3vw,34px);display:flex;flex-direction:column;gap:14px;min-width:0}
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
@media(max-width:760px){.cb-cuts{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr))}.cb-works{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr))}}
@media(prefers-reduced-motion:reduce){.cb-leaf{transition:none}}
`;
