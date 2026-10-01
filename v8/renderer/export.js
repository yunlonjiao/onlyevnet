export function createStandaloneExporter({getState,previewStyle,runtimeExtraStyle='',escapeHtml:esc}){
  return function buildStandaloneHtml(){
    const state=getState(),clone=document.body.cloneNode(true);
    clone.querySelector('.loader')?.remove();clone.querySelector('#giftLightbox')?.remove();
    clone.querySelectorAll('[data-oe-field]').forEach(el=>{el.removeAttribute('data-oe-field');el.removeAttribute('contenteditable');el.removeAttribute('spellcheck')});
    clone.querySelectorAll('[data-oe-item]').forEach(el=>{el.removeAttribute('data-oe-item');el.removeAttribute('data-oe-index')});
    clone.querySelectorAll('[data-oe-image]').forEach(el=>el.removeAttribute('data-oe-image'));

    const stateJson=JSON.stringify(state).replace(/</g,'\\u003c');
    const runtime=`(()=>{
      const $=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)],S=${stateJson};
      const mods=S.modules||{},standalone=["booths","activities"];
      const homeSections=[["tickets","tickets"],["highlights","highlights"],["passport","passport"],["map-home","booths"],["schedule-home","activities"],["guests","guests"],["guide","guide"],["freewalk","freewalk"],["itasha","itasha"],["community","community"],["sponsors","sponsors"]];
      const on=k=>mods[k]!==false;

      function show(page){
        if(page!=="home"&&!standalone.includes(page))page="home";
        if(page!=="home"&&!on(page))page="home";
        [$(".hero"),$(".quick")].filter(Boolean).forEach(el=>el.classList.toggle("oe-page-hidden",page!=="home"));
        $(".ribbon")?.classList.toggle("oe-page-hidden",page!=="home"||!on("ribbon"));
        homeSections.forEach(([id,key])=>$("#"+id)?.classList.toggle("oe-page-hidden",page!=="home"||!on(key)));
        standalone.forEach(id=>$("#"+id)?.classList.toggle("oe-page-hidden",page!==id||!on(id)));
        $(".footer")?.classList.remove("oe-page-hidden");
        scrollTo(0,0);
      }

      function goHomeSection(id){
        show("home");
        requestAnimationFrame(()=>$("#"+id)?.scrollIntoView({behavior:"smooth",block:"start"}));
      }

      function key(){return"oe-passport:"+String(S.eventName||"event").toLowerCase().replace(/\\s+/g,"-")}
      function hits(){try{return JSON.parse(localStorage.getItem(key())||"[]")}catch{return[]}}
      function paint(){const h=new Set(hits());qa("[data-pass-code]").forEach(el=>el.classList.toggle("hit",h.has(String(el.dataset.passCode).toUpperCase())))}

      const u=new URL(location.href),code=u.searchParams.get("stamp");
      if(code&&(S.passport?.tasks||[]).some(t=>String(t.code).toUpperCase()===String(code).toUpperCase())){
        const h=new Set(hits());h.add(String(code).toUpperCase());localStorage.setItem(key(),JSON.stringify([...h]));
        u.searchParams.delete("stamp");history.replaceState(null,"",u.pathname+u.search+u.hash);
      }
      paint();

      document.addEventListener("click",e=>{
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