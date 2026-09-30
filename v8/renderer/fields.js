export function createFields({qs:$,qsa:qa,getMode,setModeState,setDeep,renderTickets}){
  const fieldMap={
    eventName:()=>$('.brand'),tagline:()=>$('.hero-copy p'),date:()=>qa('.meta .pill')[0],location:()=>qa('.meta .pill')[1],edition:()=>qa('.meta .pill')[2],
    sticker1:()=>qa('.sticker .editable-copy')[0],sticker2:()=>qa('.sticker .editable-copy')[1],sticker3:()=>qa('.sticker .editable-copy')[2],
    ribbon1:()=>qa('.ribbon-edit')[0],ribbon2:()=>qa('.ribbon-edit')[1],ribbon3:()=>qa('.ribbon-edit')[2],ribbon4:()=>qa('.ribbon-edit')[3],heroImage:()=>$('.kv')
  };
  function applyField(path,value){
    if(path.includes('.')){
      setDeep(path,value);
      const parts=path.split('.'),collection=parts[0],index=Number(parts[1]),key=parts[2];
      if(collection==='highlights'&&key==='tone'){const card=$('[data-oe-item="highlights"][data-oe-index="'+index+'"]');if(card)card.style.setProperty('--tone',value||'#ffe45c');return}
      if(collection==='tickets'&&key==='image'){renderTickets();markEditable();return}
      const el=$('[data-oe-field="'+CSS.escape(path)+'"]');if(el)el.textContent=value??'';return;
    }
    const el=fieldMap[path]?.();if(!el)return;
    if(path==='heroImage'){el.style.backgroundImage='linear-gradient(180deg,transparent,rgba(0,0,0,.26)),url("'+String(value).replace(/"/g,'%22')+'")';return}
    if(path==='ticketUrl'){const a=$('#tickets .ticket-actions a');if(a)a.href=value||'#';return}
    el.textContent=value??'';
    if(path.startsWith('ribbon')){const i=Number(path.replace('ribbon',''))-1;qa('[data-ribbon-mirror="'+i+'"]').forEach(x=>x.textContent=value??'')}
  }
  function markEditable(){
    Object.entries(fieldMap).forEach(([path,get])=>{const el=get();if(!el)return;if(path==='heroImage'){el.dataset.oeImage=path;return}el.dataset.oeField=path;el.contentEditable=getMode()==='edit'?'true':'false';el.spellcheck=false});
    qa('[data-oe-field]').forEach(el=>el.contentEditable=getMode()==='edit'?'true':'false');
  }
  function setMode(next){setModeState(next);document.documentElement.classList.toggle('oe-preview',next==='preview');qa('[data-oe-field]').forEach(el=>el.contentEditable=next==='edit'?'true':'false')}
  return {fieldMap,applyField,markEditable,setMode};
}