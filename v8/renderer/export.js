export function createStandaloneExporter({getState,previewStyle,runtimeExtraStyle='',escapeHtml:esc}){
  return function buildStandaloneHtml(){
    const state=getState(),clone=document.body.cloneNode(true);
    clone.querySelector('.loader')?.remove();clone.querySelector('#giftLightbox')?.remove();
    clone.querySelectorAll('[data-oe-field]').forEach(el=>{el.removeAttribute('data-oe-field');el.removeAttribute('contenteditable');el.removeAttribute('spellcheck')});
    clone.querySelectorAll('[data-oe-item]').forEach(el=>{el.removeAttribute('data-oe-item');el.removeAttribute('data-oe-index')});
    clone.querySelectorAll('[data-oe-image]').forEach(el=>el.removeAttribute('data-oe-image'));
    clone.querySelectorAll('[data-favorite-booth]').forEach(el=>{el.classList.remove('active');el.setAttribute('aria-pressed','false');el.textContent='♡ 收藏社团'});
    clone.querySelectorAll('[data-wishlist-product]').forEach(el=>{el.classList.remove('active');el.setAttribute('aria-pressed','false');el.textContent='☆ 心愿'});
    clone.querySelectorAll('[data-wishlist-count]').forEach(el=>el.textContent='0');
    const directory=clone.querySelector('#booths .booth-directory-rich');if(directory){directory.dataset.directoryView='booths';directory.dataset.directoryPage='1';directory.dataset.directorySaved='0';directory.querySelectorAll('[data-directory-view-btn]').forEach(x=>x.classList.toggle('active',x.dataset.directoryViewBtn==='booths'));directory.querySelector('[data-directory-saved]')?.classList.remove('active');directory.querySelectorAll('[data-directory-card]').forEach(x=>x.hidden=false);}

    const stateJson=JSON.stringify(state).replace(/</g,'\\u003c');
    const runtime=`(()=>{
      const $=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)],S=${stateJson};
      const mods=S.modules||{},standalone=["booths","activities","guide","freewalk","itasha"],fixed=new Set(["tickets","participation","booths","activities","guide"]);
      const homeSections=[["tickets","tickets"],["participation","participation"],["map-home","booths"],["schedule-home","activities"],["guests","guests"],["guide-home","guide"],["community","community"],["sponsors","sponsors"]];
      const on=k=>fixed.has(k)||mods[k]!==false;
      const wishKey=()=>("oe-wishlist:"+String(S.eventName||"event").toLowerCase().replace(/\s+/g,"-"));
      const readWish=()=>{try{const x=JSON.parse(localStorage.getItem(wishKey())||"{}");return{booths:Array.isArray(x.booths)?x.booths:[],products:Array.isArray(x.products)?x.products:[]}}catch{return{booths:[],products:[]}}};
      const writeWish=x=>localStorage.setItem(wishKey(),JSON.stringify(x));
      function paintWish(){const x=readWish(),bs=new Set(x.booths),ps=new Set(x.products);qa("[data-favorite-booth]").forEach(b=>{const on=bs.has(b.dataset.favoriteBooth);b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));b.textContent=on?"♥ 已收藏":"♡ 收藏社团"});qa("[data-wishlist-product]").forEach(b=>{const on=ps.has(b.dataset.wishlistProduct);b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));b.textContent=on?"★ 已加入":"☆ 心愿"});qa("[data-wishlist-count]").forEach(el=>el.textContent=String(new Set([...x.booths,...x.products]).size))}
      function toggleWish(kind,id){const x=readWish(),key=kind==="booth"?"booths":"products",set=new Set(x[key]);set.has(id)?set.delete(id):set.add(id);x[key]=[...set];writeWish(x);paintWish()}
      function applyDirectory(){const box=$("#booths .booth-directory-rich");if(!box)return;const view=box.dataset.directoryView||"booths",q=box.querySelector("[data-directory-search]")?.value.trim().toLowerCase()||"",savedOnly=box.dataset.directorySaved==="1",wish=readWish(),bs=new Set(wish.booths),ps=new Set(wish.products),perPage=view==="booths"?16:20;box.querySelectorAll("[data-directory-grid]").forEach(g=>g.hidden=g.dataset.directoryGrid!==view);const cards=[...box.querySelectorAll('[data-directory-grid="'+view+'"] [data-directory-card]')],matches=cards.filter(card=>{const base=!q||String(card.dataset.search||"").includes(q);if(!base)return false;if(!savedOnly)return true;return view==="booths"?bs.has(card.dataset.boothId):ps.has(card.dataset.productId)||bs.has(card.dataset.boothId)});const pages=Math.max(1,Math.ceil(matches.length/perPage));let page=Math.max(1,Math.min(pages,Number(box.dataset.directoryPage)||1));box.dataset.directoryPage=String(page);cards.forEach(c=>c.hidden=true);matches.slice((page-1)*perPage,page*perPage).forEach(c=>c.hidden=false);const pager=box.querySelector(".directory-pagination");if(pager)pager.innerHTML=matches.length>perPage?'<button type="button" data-directory-page="'+Math.max(1,page-1)+'" '+(page===1?"disabled":"")+'>←</button><span>'+page+' / '+pages+'</span><button type="button" data-directory-page="'+Math.min(pages,page+1)+'" '+(page===pages?"disabled":"")+'>→</button>':"";const empty=box.querySelector(".booth-no-result");if(empty)empty.hidden=matches.length>0}
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

      document.addEventListener("input",e=>{const d=e.target.closest("[data-directory-search]");if(d){const box=$("#booths .booth-directory-rich");if(box){box.dataset.directoryPage="1";applyDirectory()}return}const booth=e.target.closest("[data-booth-search]");if(booth){const q=booth.value.trim().toLowerCase(),savedOnly=$('[data-booth-filter="saved"]')?.classList.contains("active"),fav=readWish(),bs=new Set(fav.booths),ps=new Set(fav.products);let shown=0;qa(".booth-rich").forEach(card=>{const matches=!q||String(card.dataset.search||"").includes(q),saved=bs.has(card.dataset.boothId)||[...card.querySelectorAll("[data-product-id]")].some(p=>ps.has(p.dataset.productId)),on=matches&&(!savedOnly||saved);card.hidden=!on;if(on)shown++});const empty=$(".booth-no-result");if(empty)empty.hidden=shown>0}const map=e.target.closest("[data-map-search-input]");if(map){const q=map.value.trim().toLowerCase();qa(".map-search-result").forEach(b=>b.hidden=!!q&&!String(b.dataset.mapSearch||"").includes(q))}});
      paintWish();applyDirectory();
      document.addEventListener("click",e=>{const v=e.target.closest("[data-directory-view-btn]");if(v){const box=$("#booths .booth-directory-rich");if(box){box.dataset.directoryView=v.dataset.directoryViewBtn;box.dataset.directoryPage="1";box.querySelectorAll("[data-directory-view-btn]").forEach(x=>x.classList.toggle("active",x===v));applyDirectory()}return}const s=e.target.closest("[data-directory-saved]");if(s){const box=$("#booths .booth-directory-rich");if(box){box.dataset.directorySaved=box.dataset.directorySaved==="1"?"0":"1";box.dataset.directoryPage="1";s.classList.toggle("active",box.dataset.directorySaved==="1");applyDirectory()}return}const p=e.target.closest("[data-directory-page]");if(p&&!p.disabled){const box=$("#booths .booth-directory-rich");if(box){box.dataset.directoryPage=p.dataset.directoryPage;applyDirectory();box.scrollIntoView({behavior:"smooth",block:"start"})}return}
        const mapLocate=e.target.closest("[data-map-locate]");if(mapLocate&&mapLocate.dataset.mapLocate){e.preventDefault();goHomeSection("map-home");requestAnimationFrame(()=>focusPoint(mapLocate.dataset.mapLocate));return}
        const boothFav=e.target.closest("[data-favorite-booth]");if(boothFav){e.preventDefault();toggleWish("booth",boothFav.dataset.favoriteBooth);return}
        const productFav=e.target.closest("[data-wishlist-product]");if(productFav){e.preventDefault();toggleWish("product",productFav.dataset.wishlistProduct);return}
        const filter=e.target.closest("[data-booth-filter]");if(filter){e.preventDefault();qa("[data-booth-filter]").forEach(x=>x.classList.toggle("active",x===filter));$("[data-booth-search]")?.dispatchEvent(new Event("input",{bubbles:true}));return}
        const boothJump=e.target.closest('a[data-booth-id]');if(boothJump){e.preventDefault();show("booths");requestAnimationFrame(()=>$("#booth-"+CSS.escape(boothJump.dataset.boothId))?.scrollIntoView({behavior:"smooth",block:"start"}));return}
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
          requestAnimationFrame(()=>$("#activity-detail-"+Number(a.dataset.activityIndex))?.scrollIntoView({behavior:"smooth",block:"start"}));
          return;
        }

        const target=a.dataset.pageLink||a.getAttribute("href").slice(1)||"home";
        if(homeSections.some(([id])=>id===target))goHomeSection(target);
        else if(standalone.includes(target))show(target);
        else show("home");
      });

      $(".brand")?.addEventListener("click",e=>{e.preventDefault();show("home")});
      const initial=(location.hash||"#home").slice(1);
      if(homeSections.some(([id])=>id===initial))goHomeSection(initial);
      else show(standalone.includes(initial)?initial:"home");
    })();`;

    const extra=runtimeExtraStyle+'.oe-page-hidden{display:none!important}.loader{display:none!important}.special:after{display:none!important}.kv:after{display:none!important}.ticket-top{display:grid;grid-template-columns:minmax(0,1fr) 104px;gap:14px;align-items:start}.ticket-gift-image{width:104px;height:104px;padding:0;border:2px solid var(--ink);border-radius:14px;background:#fff;overflow:hidden;cursor:zoom-in;box-shadow:4px 4px 0 var(--ink)}.ticket-gift-image img{width:100%;height:100%;object-fit:cover;display:block}';
    return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(state.eventName||'OnlyEvent')+'</title><style>'+previewStyle+extra+'</style></head><body>'+clone.innerHTML+'<script>'+runtime+'<\\/script></body></html>';
  }
}