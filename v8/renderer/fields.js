export function createFields({qs:$,qsa:qa,getMode,setModeState,setDeep,renderTickets}){
  const fieldMap={
    eventName:()=>$('.brand'),
    tagline:()=>$('.hero-copy p'),
    date:()=>qa('.meta .pill')[0],
    location:()=>qa('.meta .pill')[1],
    edition:()=>$('.venue-nav'),
    heroTitle1:()=>$('.hero-title-1'),
    heroTitle2:()=>$('.hero-title-2'),
    heroTitle3:()=>$('.hero-title-3'),
    sticker1:()=>qa('.sticker .editable-copy')[0],
    sticker2:()=>qa('.sticker .editable-copy')[1],
    sticker3:()=>qa('.sticker .editable-copy')[2],
    ribbon1:()=>qa('.ribbon-edit')[0],
    ribbon2:()=>qa('.ribbon-edit')[1],
    ribbon3:()=>qa('.ribbon-edit')[2],
    ribbon4:()=>qa('.ribbon-edit')[3],
    heroImage:()=>$('.kv')
  };
  const extraStatePaths=['heroTitleSize','heroTitleColor','heroTitleAccentColor','navigationUrl'];

  function safeExternalUrl(value){
    const v=String(value||'').trim();
    return /^https?:\/\//i.test(v)?v:'#';
  }

  function applyField(path,value){
    if(path.includes('.')){
      setDeep(path,value);
      const parts=path.split('.'),collection=parts[0],index=Number(parts[1]),key=parts[2];
      if(collection==='highlights'&&key==='tone'){
        const card=$('[data-oe-item="highlights"][data-oe-index="'+index+'"]');
        if(card)card.style.setProperty('--tone',value||'#ffe45c');
        return;
      }
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
    if(path==='navigationUrl'){
      const a=$('.venue-nav');
      if(a)a.href=safeExternalUrl(value);
      return;
    }

    const el=fieldMap[path]?.();
    if(!el)return;

    if(path==='heroImage'){
      el.style.backgroundImage='linear-gradient(180deg,transparent,rgba(0,0,0,.26)),url("'+String(value).replace(/"/g,'%22')+'")';
      return;
    }
    if(path==='ticketUrl'){
      const a=$('#tickets .ticket-actions a');
      if(a)a.href=value||'#';
      return;
    }

    el.textContent=value??'';

    if(path.startsWith('ribbon')){
      const i=Number(path.replace('ribbon',''))-1;
      qa('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=value??'');
    }
  }

  function markEditable(){
    Object.entries(fieldMap).forEach(([path,get])=>{
      const el=get();
      if(!el)return;
      if(path==='heroImage'){
        el.dataset.oeImage=path;
        return;
      }
      el.dataset.oeField=path;
      el.contentEditable=getMode()==='edit'?'true':'false';
      el.spellcheck=false;
    });
    qa('[data-oe-field]').forEach(el=>el.contentEditable=getMode()==='edit'?'true':'false');
  }

  function setMode(next){
    setModeState(next);
    document.documentElement.classList.toggle('oe-preview',next==='preview');
    qa('[data-oe-field]').forEach(el=>el.contentEditable=next==='edit'?'true':'false');
  }

  return {fieldMap,extraStatePaths,applyField,markEditable,setMode};
}
