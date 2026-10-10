export function createStandaloneExporter({getState,previewStyle,runtimeExtraStyle='',escapeHtml:esc}){
  return function buildStandaloneHtml(){
    const state=getState(),clone=document.body.cloneNode(true);
    clone.querySelector('#giftLightbox')?.remove();
    clone.querySelectorAll('.custom-page-empty,.guide-access-media-empty,.optional-page-image.empty,.social-image.empty,.sponsor-logo.empty').forEach(el=>el.remove());
    clone.querySelectorAll('.guest-image.empty,.directory-product-image.empty').forEach(el=>{el.textContent='';el.removeAttribute('data-oe-image');el.setAttribute('aria-hidden','true')});
    clone.querySelectorAll('.activity-feature-media-empty').forEach(el=>{el.closest('.activity-feature')?.classList.add('no-media');el.remove()});
    clone.querySelectorAll('[data-featured-empty="1"]').forEach(el=>el.remove());
    const featuredGrid=clone.querySelector('#participation .featured-activity-grid');
    if(featuredGrid&&!featuredGrid.children.length)featuredGrid.closest('section')?.setAttribute('hidden','');
    clone.querySelectorAll('.ticket-purchase-link[href="#"],.guide-venue-nav-empty').forEach(el=>el.remove());
    clone.querySelectorAll('[data-oe-field]').forEach(el=>{el.removeAttribute('data-oe-field');el.removeAttribute('contenteditable');el.removeAttribute('spellcheck')});
    clone.querySelectorAll('[data-oe-item]').forEach(el=>{el.removeAttribute('data-oe-item');el.removeAttribute('data-oe-index')});
    clone.querySelectorAll('[data-oe-image]').forEach(el=>el.removeAttribute('data-oe-image'));
    clone.querySelectorAll('[data-oe-custom-page],[data-oe-custom-index],[data-oe-custom-page-settings],[data-custom-page-root]').forEach(el=>{el.removeAttribute('data-oe-custom-page');el.removeAttribute('data-oe-custom-index');el.removeAttribute('data-oe-custom-page-settings');el.removeAttribute('data-custom-page-root')});
    clone.querySelectorAll('[data-favorite-booth]').forEach(el=>{el.classList.remove('active');el.setAttribute('aria-pressed','false');el.textContent='♡ 收藏社团'});
    clone.querySelectorAll('[data-wishlist-product]').forEach(el=>{el.classList.remove('active');el.setAttribute('aria-pressed','false');el.textContent='☆ 心愿'});
    clone.querySelectorAll('[data-wishlist-count]').forEach(el=>el.textContent='0');
    const directory=clone.querySelector('#booths .booth-directory-rich');if(directory){directory.dataset.directoryView='booths';directory.dataset.directoryPage='1';directory.dataset.directorySaved='0';directory.querySelectorAll('[data-directory-view-btn]').forEach(x=>x.classList.toggle('active',x.dataset.directoryViewBtn==='booths'));directory.querySelector('[data-directory-saved]')?.classList.remove('active');directory.querySelectorAll('[data-directory-card]').forEach(x=>x.hidden=false);}

    const stateJson=JSON.stringify(state).replace(/</g,'\\u003c');
    const runtime=`(()=>{
      const $=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)],S=${stateJson};
      const mods=S.modules||{},standalone=["booths","activities","guests","guide",...(S.customPages||[]).map(p=>"custom-"+p.id)],fixed=new Set(["tickets","map"]);
      const homeSections=[["tickets","tickets"],["map-home","map"],["participation","activities"],["schedule-home","activities"],["community","community"],["sponsors","sponsors"]];
      const hasContent=k=>k==="booths"?(S.booths||[]).length>0:k==="activities"?(S.participation||[]).length>0||(S.schedule||[]).length>0:k==="guests"?(S.guests||[]).length>0:k==="guide"?(S.guide?.items||[]).length>0:k==="community"?(S.socialLinks||[]).some(x=>String(x?.label||"").trim()||String(x?.note||"").trim()||String(x?.url||"").trim()||String(x?.image||"").trim()):k==="ribbon"?(S.ribbonItems||[]).some(x=>String(x?.text||"").trim()):k==="sponsors"?(S.sponsors||[]).some(x=>String(x?.name||"").trim()||String(x?.logo||"").trim()||String(x?.url||"").trim()):true;
      const on=k=>String(k).startsWith("custom-")?standalone.includes(k):fixed.has(k)?true:mods[k]!==false&&hasContent(k);
      const wishKey=()=>("oe-wishlist:"+String(S.eventName||"event").toLowerCase().replace(/\s+/g,"-"));
      const readWish=()=>{try{const x=JSON.parse(localStorage.getItem(wishKey())||"{}"),validBooths=new Set((S.booths||[]).map(b=>b.id)),validProducts=new Set((S.booths||[]).flatMap(b=>(b.products||[]).map(p=>p.id))),clean={booths:(Array.isArray(x.booths)?x.booths:[]).filter(id=>validBooths.has(id)),products:(Array.isArray(x.products)?x.products:[]).filter(id=>validProducts.has(id))};if(JSON.stringify(clean)!==JSON.stringify({booths:Array.isArray(x.booths)?x.booths:[],products:Array.isArray(x.products)?x.products:[]}))localStorage.setItem(wishKey(),JSON.stringify(clean));return clean}catch{return{booths:[],products:[]}}};
      const writeWish=x=>localStorage.setItem(wishKey(),JSON.stringify(x));
      function paintWish(){const x=readWish(),bs=new Set(x.booths),ps=new Set(x.products);qa("[data-favorite-booth]").forEach(b=>{const on=bs.has(b.dataset.favoriteBooth);b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));b.textContent=on?"♥ 已收藏":"♡ 收藏社团"});qa("[data-wishlist-product]").forEach(b=>{const on=ps.has(b.dataset.wishlistProduct);b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));b.textContent=on?"★ 已加入":"☆ 心愿"});qa("[data-wishlist-count]").forEach(el=>el.textContent=String(new Set([...x.booths,...x.products]).size))}
      function toggleWish(kind,id){const x=readWish(),key=kind==="booth"?"booths":"products",set=new Set(x[key]);set.has(id)?set.delete(id):set.add(id);x[key]=[...set];writeWish(x);paintWish();applyDirectory()}
      function applyActivityFilters(){
        const root=$("#activities");if(!root)return;
        const activeDay=root.querySelector(".activity-day-tabs [data-activity-day].active")?.dataset.activityDay||"";
        qa("#activities .timetable-row").forEach(row=>{row.hidden=!!activeDay&&row.dataset.activityDay!==activeDay});
      }
      function setActivityView(view){
        const root=$("#activities");if(!root)return;
        const next=view==="programs"?"programs":"timeline";
        qa("#activities [data-activity-view]").forEach(btn=>btn.classList.toggle("active",btn.dataset.activityView===next));
        qa("#activities [data-activity-panel]").forEach(panel=>panel.hidden=panel.dataset.activityPanel!==next);
      }
      function resetActivityFilters(){
        qa("#activities .activity-day-tabs [data-activity-day]").forEach((x,i)=>x.classList.toggle("active",i===0));
        applyActivityFilters();
      }
      function normalizeDirectorySearch(value){return String(value??"").normalize("NFKC").toLocaleLowerCase().replace(/\s+/g," ").trim()}
      function applyDirectory(){
        const box=$("#booths .booth-directory-rich");if(!box)return;
        const view=box.dataset.directoryView==="products"?"products":"booths";
        const input=box.querySelector("[data-directory-search]");
        const q=normalizeDirectorySearch(input?.value||"");
        const savedOnly=box.dataset.directorySaved==="1",wish=readWish(),bs=new Set(wish.booths),ps=new Set(wish.products),perPage=view==="booths"?16:20;
        const boothFilter=view==="products"?(box.dataset.directoryBoothFilter||""):"";
        if(view==="products")box.dataset.productQuery=input?.value||"";else box.dataset.boothQuery=input?.value||"";
        box.querySelectorAll("[data-directory-grid]").forEach(g=>g.hidden=g.dataset.directoryGrid!==view);
        box.querySelectorAll("[data-directory-view-btn]").forEach(x=>{const on=x.dataset.directoryViewBtn===view;x.classList.toggle("active",on);x.setAttribute("aria-selected",String(on))});
        const cards=[...box.querySelectorAll('[data-directory-grid="'+view+'"] [data-directory-card]')];
        const matches=cards.filter(card=>{
          if(boothFilter&&card.dataset.boothId!==boothFilter)return false;
          if(q&&!String(card.dataset.search||"").includes(q))return false;
          if(!savedOnly)return true;
          return view==="booths"?bs.has(card.dataset.boothId):ps.has(card.dataset.productId);
        });
        const pages=Math.max(1,Math.ceil(matches.length/perPage));
        const page=Math.max(1,Math.min(pages,Number(box.dataset.directoryPage)||1));
        box.dataset.directoryPage=String(page);
        cards.forEach(c=>c.hidden=true);
        matches.slice((page-1)*perPage,page*perPage).forEach(c=>c.hidden=false);
        const pager=box.querySelector(".directory-pagination");
        if(pager)pager.innerHTML=matches.length>perPage?'<button type="button" data-directory-page="'+Math.max(1,page-1)+'" '+(page===1?"disabled":"")+'>←</button><span>'+page+' / '+pages+'</span><button type="button" data-directory-page="'+Math.min(pages,page+1)+'" '+(page===pages?"disabled":"")+'>→</button>':"";
        const empty=box.querySelector(".booth-no-result");if(empty)empty.hidden=matches.length>0||(!q&&!savedOnly&&!boothFilter);
        const context=box.querySelector("[data-directory-context]");if(context){context.hidden=!boothFilter;const label=context.querySelector("span");if(label)label.textContent=boothFilter?(box.dataset.directoryBoothLabel||"当前摊位")+" · 制品":""}
        const clear=box.querySelector("[data-directory-search-clear]");if(clear)clear.hidden=!(input?.value||"");
        const savedBtn=box.querySelector("[data-directory-saved]"),count=box.querySelector("[data-wishlist-count]");
        if(savedBtn)savedBtn.firstChild.nodeValue=view==="booths"?"收藏社团 ":"心愿制品 ";
        if(count)count.textContent=String(view==="booths"?wish.booths.length:wish.products.length);
      }
      function focusPoint(id){const pin=document.querySelector('.map-pin[data-point-id="'+CSS.escape(id)+'"]');if(!pin)return;qa(".map-pin.focused").forEach(x=>x.classList.remove("focused"));pin.classList.add("focused");const pop=$("#mapPop");if(pop)pop.innerHTML="<b>"+pin.dataset.name+"</b><br><span>"+pin.dataset.info+"</span>"+(pin.dataset.boothId?'<br><a href="#booths" data-page-link="booths" data-booth-id="'+pin.dataset.boothId+'">查看摊位与制品 →</a>':"");setTimeout(()=>pin.classList.remove("focused"),1800)}


      function show(page){
        if(page!=="home"&&!standalone.includes(page))page="home";
        if(page!=="home"&&!on(page))page="home";
        [$(".hero"),$(".quick")].filter(Boolean).forEach(el=>el.classList.toggle("oe-page-hidden",page!=="home"));
        $(".ribbon")?.classList.toggle("oe-page-hidden",page!=="home"||!on("ribbon"));
        homeSections.forEach(([id,key])=>$("#"+id)?.classList.toggle("oe-page-hidden",page!=="home"||!on(key)));
        standalone.forEach(id=>$("#"+id)?.classList.toggle("oe-page-hidden",page!==id||!on(id)));
        $(".footer")?.classList.remove("oe-page-hidden");
      }

      function goHomeSection(id){
        show("home");
        requestAnimationFrame(()=>$("#"+id)?.scrollIntoView({behavior:"smooth",block:"start"}));
      }

      document.addEventListener("change",e=>{if(e.target.closest("[data-activity-area-filter]"))applyActivityFilters()});
      document.addEventListener("input",e=>{const d=e.target.closest("[data-directory-search]");if(d){const box=$("#booths .booth-directory-rich");if(box){box.dataset.directoryPage="1";applyDirectory()}return}const booth=e.target.closest("[data-booth-search]");if(booth){const q=booth.value.trim().toLowerCase(),savedOnly=$('[data-booth-filter="saved"]')?.classList.contains("active"),fav=readWish(),bs=new Set(fav.booths),ps=new Set(fav.products);let shown=0;qa(".booth-rich").forEach(card=>{const matches=!q||String(card.dataset.search||"").includes(q),saved=bs.has(card.dataset.boothId)||[...card.querySelectorAll("[data-product-id]")].some(p=>ps.has(p.dataset.productId)),on=matches&&(!savedOnly||saved);card.hidden=!on;if(on)shown++});const empty=$(".booth-no-result");if(empty)empty.hidden=shown>0}const map=e.target.closest("[data-map-search-input]");if(map){const q=map.value.trim().toLowerCase();qa(".map-search-result").forEach(b=>b.hidden=!!q&&!String(b.dataset.mapSearch||"").includes(q))}});
      paintWish();applyDirectory();setActivityView("timeline");resetActivityFilters();
      document.addEventListener("click",e=>{
        const activityView=e.target.closest("[data-activity-view]");if(activityView){e.preventDefault();setActivityView(activityView.dataset.activityView);return}
        const activityDay=e.target.closest("#activities .activity-day-tabs [data-activity-day]");if(activityDay){e.preventDefault();qa("#activities .activity-day-tabs [data-activity-day]").forEach(x=>x.classList.toggle("active",x===activityDay));applyActivityFilters();return}
        const v=e.target.closest("[data-directory-view-btn]");if(v){e.preventDefault();const box=$("#booths .booth-directory-rich");if(box){const next=v.dataset.directoryViewBtn==="products"?"products":"booths";box.dataset.directoryView=next;box.dataset.directoryPage="1";box.dataset.directorySaved="0";box.dataset.directoryBoothFilter="";box.dataset.directoryBoothLabel="";const input=box.querySelector("[data-directory-search]");if(input)input.value=next==="products"?(box.dataset.productQuery||""):(box.dataset.boothQuery||"");box.querySelector("[data-directory-saved]")?.classList.remove("active");applyDirectory()}return}
        const viewProducts=e.target.closest("[data-view-booth-products]");if(viewProducts){e.preventDefault();const box=$("#booths .booth-directory-rich");if(box){box.dataset.directoryView="products";box.dataset.directoryPage="1";box.dataset.directorySaved="0";box.dataset.directoryBoothFilter=viewProducts.dataset.viewBoothProducts||"";box.dataset.directoryBoothLabel=viewProducts.dataset.boothLabel||"";box.dataset.productQuery="";const input=box.querySelector("[data-directory-search]");if(input)input.value="";box.querySelector("[data-directory-saved]")?.classList.remove("active");applyDirectory()}return}
        const clearBooth=e.target.closest("[data-clear-booth-filter]");if(clearBooth){e.preventDefault();const box=$("#booths .booth-directory-rich");if(box){box.dataset.directoryBoothFilter="";box.dataset.directoryBoothLabel="";box.dataset.directoryPage="1";applyDirectory()}return}
        const resetDir=e.target.closest("[data-directory-reset]");if(resetDir){e.preventDefault();const box=$("#booths .booth-directory-rich");if(box){box.dataset.directorySaved="0";box.dataset.directoryBoothFilter="";box.dataset.directoryBoothLabel="";box.dataset.directoryPage="1";if(box.dataset.directoryView==="products")box.dataset.productQuery="";else box.dataset.boothQuery="";const input=box.querySelector("[data-directory-search]");if(input)input.value="";box.querySelector("[data-directory-saved]")?.classList.remove("active");applyDirectory()}return}
        const clearSearch=e.target.closest("[data-directory-search-clear]");if(clearSearch){e.preventDefault();const box=$("#booths .booth-directory-rich"),input=box?.querySelector("[data-directory-search]");if(input){input.value="";box.dataset.directoryPage="1";applyDirectory();input.focus({preventScroll:true})}return}
        const s=e.target.closest("[data-directory-saved]");if(s){e.preventDefault();const box=$("#booths .booth-directory-rich");if(box){box.dataset.directorySaved=box.dataset.directorySaved==="1"?"0":"1";box.dataset.directoryPage="1";s.classList.toggle("active",box.dataset.directorySaved==="1");applyDirectory()}return}
        const p=e.target.closest("[data-directory-page]");if(p&&!p.disabled){e.preventDefault();const box=$("#booths .booth-directory-rich");if(box){box.dataset.directoryPage=p.dataset.directoryPage;applyDirectory();box.scrollIntoView({behavior:"smooth",block:"start"})}return}
        const mapLocate=e.target.closest("[data-map-locate]");if(mapLocate&&mapLocate.dataset.mapLocate){e.preventDefault();goHomeSection("map-home");requestAnimationFrame(()=>focusPoint(mapLocate.dataset.mapLocate));return}
        const boothFav=e.target.closest("[data-favorite-booth]");if(boothFav){e.preventDefault();toggleWish("booth",boothFav.dataset.favoriteBooth);return}
        const productFav=e.target.closest("[data-wishlist-product]");if(productFav){e.preventDefault();toggleWish("product",productFav.dataset.wishlistProduct);return}
        const filter=e.target.closest("[data-booth-filter]");if(filter){e.preventDefault();qa("[data-booth-filter]").forEach(x=>x.classList.toggle("active",x===filter));$("[data-booth-search]")?.dispatchEvent(new Event("input",{bubbles:true}));return}
        const boothJump=e.target.closest('a[data-booth-id]');if(boothJump){e.preventDefault();show("booths");requestAnimationFrame(()=>$("#booth-"+CSS.escape(boothJump.dataset.boothId))?.scrollIntoView({behavior:"smooth",block:"start"}));return}
        const explore=e.target.closest("[data-explore-link]");
        if(explore){
          e.preventDefault();
          const page=explore.dataset.pageLink||"home",kind=explore.dataset.exploreKind||"page",id=explore.dataset.exploreId||"";
          show(page);
          if(page==="activities"&&kind==="participation")resetActivityFilters();
          if(kind!=="page"&&id)requestAnimationFrame(()=>{
            const selector=kind==="booth"?"#booth-"+CSS.escape(id):kind==="participation"?"#participation-"+CSS.escape(id):kind==="schedule"?"#schedule-"+CSS.escape(id):kind==="guest"?"#guest-"+CSS.escape(id):kind==="guide"?"#guide-"+CSS.escape(id):kind==="customitem"?"#customitem-"+CSS.escape(id):"";
            if(selector)document.querySelector(selector)?.scrollIntoView({behavior:"smooth",block:"start"});
          });
          return;
        }
        const guestJump=e.target.closest('a[data-guest-id]');
        if(guestJump){e.preventDefault();show("guests");requestAnimationFrame(()=>$("#guest-"+CSS.escape(guestJump.dataset.guestId))?.scrollIntoView({behavior:"smooth",block:"start"}));return}
        const rich=e.target.closest("[data-product-lightbox]");
        if(rich){
          e.preventDefault();
          let dlg=$("#oeImagePreview");
          if(!dlg){dlg=document.createElement("dialog");dlg.id="oeImagePreview";dlg.className="gift-lightbox";dlg.innerHTML='<button type="button" aria-label="关闭">×</button><img alt="图片预览">';document.body.appendChild(dlg);dlg.querySelector("button").onclick=()=>dlg.close();dlg.addEventListener("click",ev=>{if(ev.target===dlg)dlg.close()})}
          dlg.querySelector("img").src=rich.dataset.productLightbox;dlg.showModal();return;
        }
        const pin=e.target.closest(".pin");
        if(pin){const pop=$("#mapPop");if(pop)pop.innerHTML="<b>"+pin.dataset.name+"</b><br><span>"+pin.dataset.info+"</span>";return}

        const a=e.target.closest('a[href^="#"]');
        if(!a)return;
        e.preventDefault();

        if(a.dataset.activityIndex!==undefined){
          show("activities");
          requestAnimationFrame(()=>document.querySelector('#activities [data-activity-index="'+Number(a.dataset.activityIndex)+'"]')?.scrollIntoView({behavior:"smooth",block:"start"}));
          return;
        }
        if(a.dataset.activityPlanId){
          show("activities");resetActivityFilters();
          requestAnimationFrame(()=>$("#participation-"+CSS.escape(a.dataset.activityPlanId))?.scrollIntoView({behavior:"smooth",block:"start"}));
          return;
        }

        const target=a.dataset.pageLink||a.getAttribute("href").slice(1)||"home";
        if(homeSections.some(([id])=>id===target))goHomeSection(target);
        else if(standalone.includes(target))show(target);
        else show("home");
      });

      const entry=S.entryAnimation||{},loader=$("#loader");
      if(loader){
        if(entry.enabled===false){loader.remove()}
        else{
          const key="oe-memorial-ticket:"+String(S.projectId||S.eventName||"default");
          let no="";
          try{no=localStorage.getItem(key)||""}catch{}
          if(no.length!==6){
            no=String(Math.floor(Math.random()*1000000)).padStart(6,"0");
            try{localStorage.setItem(key,no)}catch{}
          }
          const serial=$(".entry-serial");if(serial)serial.textContent=String(entry.ticketPrefix||"NO.")+" "+no;
          loader.classList.remove("hide","entry-playing");
          const play=()=>{
            if(loader.classList.contains("entry-playing"))return;
            void loader.offsetWidth;loader.classList.add("entry-playing");
            setTimeout(()=>{loader.classList.remove("entry-playing");loader.classList.add("hide")},Math.max(1100,Number(entry.duration)||1800)+500);
          };
          $(".gate")?.addEventListener("click",play);
          $(".gate")?.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();play()}});
          const skip=$("#skip");if(skip){skip.hidden=entry.showSkip===false;skip.addEventListener("click",e=>{e.stopPropagation();loader.classList.add("hide")})}
        }
      }

      $(".brand")?.addEventListener("click",e=>{e.preventDefault();show("home")});
      const initial=(location.hash||"#home").slice(1);
      if(homeSections.some(([id])=>id===initial))goHomeSection(initial);
      else show(standalone.includes(initial)?initial:"home");
    })();`;

    const entryEnabled=state.entryAnimation?.enabled!==false;
    const extra=runtimeExtraStyle+'.oe-page-hidden{display:none!important}'+(entryEnabled?'.loader{display:grid!important}':'.loader{display:none!important}')+'.special:after{display:none!important}.kv:after{display:none!important}.ticket-top{display:grid;grid-template-columns:minmax(0,1fr) 104px;gap:14px;align-items:start}.ticket-gift-image{width:104px;height:104px;padding:0;border:2px solid var(--ink);border-radius:14px;background:#fff;overflow:hidden;cursor:zoom-in;box-shadow:4px 4px 0 var(--ink)}.ticket-gift-image img{width:100%;height:100%;object-fit:cover;display:block}';
    return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(state.eventName||'OnlyEvent')+'</title><style>'+previewStyle+extra+'</style></head><body>'+clone.innerHTML+'<script>'+runtime+'<\\/script></body></html>';
  }
}