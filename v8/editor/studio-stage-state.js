export function revealStages(state,modules){return (state.reveal?.stages||[]).map(s=>({...s,modules:(s.modules||[]).filter(k=>modules.includes(k))})).filter(s=>s.modules.length&&s.at&&!Number.isNaN(new Date(s.at).getTime())).sort((a,b)=>a.at.localeCompare(b.at));}

export function stateAtStage(state,stages,k){
  const copy=structuredClone(state);copy.modules={...(copy.modules||{})};
  const strip={booths:c=>{c.booths=[]},activities:c=>{c.participation=[];c.schedule=[]},guests:c=>{c.guests=[]},guide:c=>{c.guide={...(c.guide||{}),items:[]}}};
  const revealed=new Set(stages.slice(0,k).flatMap(s=>s.modules));
  stages.forEach(s=>s.modules.forEach(m=>{if(revealed.has(m))return;copy.modules[m]=false;strip[m]?.(copy)}));
  return copy;
}
