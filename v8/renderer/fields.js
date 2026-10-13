export function createFields({qs:$,qsa:qa,getMode,setModeState,setDeep,renderTickets,getState}){
  const liveField=path=>document.querySelector('.trip-site [data-oe-field="'+path+'"]')||document.querySelector('[data-oe-field="'+path+'"]');
  const fieldMap={
    eventName:()=>liveField('eventName'),
    tagline:()=> $('[data-oe-field="tagline"]') || $('.hero-copy p'),
    date:()=>liveField('date'),
    location:()=>liveField('location'),
    edition:()=>liveField('edition'),
    heroTitle1:()=>$('.hero-title-1'),
    heroTitle2:()=>$('.hero-title-2'),
    heroTitle3:()=>$('.hero-title-3'),
    sticker1:()=>qa('.sticker .editable-copy')[0],
    sticker2:()=>qa('.sticker .editable-copy')[1],
    sticker3:()=>qa('.sticker .editable-copy')[2],
    heroImage:()=>$('.kv')
  };
  const extraStatePaths=['heroTitleSize','heroTitleColor','heroTitleAccentColor','heroImage','mobileHeroImage','heroFocalDesktop','heroFocalMobile','navigationUrl','ticketUrl','ticketLinkLabel'];

  function safeExternalUrl(value){
    const v=String(value||'').trim();
    return /^https?:\/\//i.test(v)?v:'#';
  }

  function applyHeroMedia(){
    const hero=$('.hero'),kv=$('.kv');if(!hero||!kv)return;
    const state=getState?.()||{};
    const desktop=String(state.heroImage||'').trim();
    const mobile=String(state.mobileHeroImage||'').trim()||desktop;
    const safeUrl=src=>src?'url("'+src.replace(/"/g,'%22')+'")':'none';
    hero.style.setProperty('--oe-hero-image-desktop',safeUrl(desktop));
    hero.style.setProperty('--oe-hero-image-mobile',safeUrl(mobile));
    hero.style.setProperty('--oe-hero-focal-desktop',String(state.heroFocalDesktop||'50% 50%'));
    hero.style.setProperty('--oe-hero-focal-mobile',String(state.heroFocalMobile||'50% 50%'));
    kv.classList.toggle('empty',!desktop&&!mobile);
    kv.classList.remove('image-failed');
    const active=(matchMedia('(max-width:560px)').matches?mobile:desktop)||mobile||desktop;
    if(active){
      kv.dataset.oeHeroCheck=active;
      const probe=new Image();
      probe.onload=()=>{if(kv.dataset.oeHeroCheck===active)kv.classList.remove('image-failed')};
      probe.onerror=()=>{if(kv.dataset.oeHeroCheck===active)kv.classList.add('image-failed')};
      probe.src=active;
    }else delete kv.dataset.oeHeroCheck;
  }

  function applyField(path,value){
    if(path.includes('.')){
      setDeep(path,value);
      const parts=path.split('.'),collection=parts[0],index=Number(parts[1]),key=parts[2];
      if(collection==='tickets'&&key==='image'){
        renderTickets();
        markEditable();
        return;
      }
      qa('[data-oe-field="'+CSS.escape(path)+'"]').forEach(el=>{el.textContent=value??''});
      return;
    }

    if(path==='heroTitleSize'){
      const n=Math.max(56,Math.min(160,Number(value)||126));
      $('.hero')?.style.setProperty('--oe-hero-title-size',n+'px');
      return;
    }
    if(path==='heroTitleColor'){
      $('.hero')?.style.setProperty('--oe-hero-title-color',String(value||'#17151b'));
      return;
    }
    if(path==='heroTitleAccentColor'){
      $('.hero')?.style.setProperty('--oe-hero-title-accent',String(value||'#ff5f91'));
      return;
    }
    if(['heroImage','mobileHeroImage','heroFocalDesktop','heroFocalMobile'].includes(path)){
      applyHeroMedia();
      return;
    }
    if(path==='navigationUrl'){
      const a=$('.venue-nav');
      if(a)a.href=safeExternalUrl(value);
      return;
    }
    if(path==='ticketUrl'||path==='ticketLinkLabel'){
      const stateValue=String(value||'').trim();
      if(path==='ticketUrl'){
        const valid=/^https?:\/\//i.test(stateValue);
        qa('.ticket-purchase-link').forEach(a=>{a.href=valid?stateValue:'#';a.hidden=!valid&&getMode()!=='edit'});
      }else{
        qa('.ticket-purchase-link').forEach(a=>{a.textContent=(stateValue||'前往官方售票平台')+' ↗'});
      }
      return;
    }

    const el=fieldMap[path]?.();
    if(!el)return;

    if(path==='eventName'){
      const footerTitle=$('.footer-brand h2');
      if(footerTitle)footerTitle.textContent=value??'';
    }
    if(path==='date'||path==='edition'||path==='location'){
      const footerMeta=$('.footer-brand p');
      if(footerMeta){
        const currentDate=path==='date'?String(value??''):String(getState?.()?.date??'');
        const currentEdition=path==='edition'?String(value??''):String(getState?.()?.edition??'');
        const currentLocation=path==='location'?String(value??''):String(getState?.()?.location??'');
        footerMeta.textContent=[currentDate,currentEdition||currentLocation].filter(Boolean).join(' · ');
      }
    }

    el.textContent=value??'';
    // Mirrored travel-template fields must remain in sync with the Shared Core.
    // The entry ticket is presentation-only: do not let its duplicates capture editing.
    if(document.documentElement.dataset.oeTemplate==='02-scrapbook'){
      qa('[data-oe-field="'+CSS.escape(path)+'"]').forEach(mirror=>{
        if(mirror!==el && mirror!==document.activeElement)mirror.textContent=value??'';
      });
    }

    if(path.startsWith('ribbon')){
      const i=Number(path.replace('ribbon',''))-1;
      qa('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=value??'');
    }
  }

  function markEditable(){
    Object.entries(fieldMap).forEach(([path,get])=>{
      const el=get();
      if(!el)return;
      if(path==='heroImage'||path==='mobileHeroImage'){
        el.dataset.oeImage=path;
        return;
      }
      el.dataset.oeField=path;
      el.contentEditable=getMode()==='edit'?'true':'false';
      el.spellcheck=false;
    });
    qa('[data-oe-field]').forEach(el=>el.contentEditable=(el.closest('#loader')?false:getMode()==='edit')?'true':'false');
  }

  function setMode(next){
    setModeState(next);
    document.documentElement.classList.toggle('oe-preview',next==='preview');
    qa('[data-oe-field]').forEach(el=>el.contentEditable=(next==='edit'&&!el.closest('#loader'))?'true':'false');
  }

  return {fieldMap,extraStatePaths,applyField,markEditable,setMode};
}
