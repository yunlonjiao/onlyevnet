export function paintMapPop(pop,pin){
  if(!pop||!pin)return;
  pop.textContent='';
  const b=document.createElement('b');b.textContent=pin.dataset.name||'';
  const span=document.createElement('span');span.textContent=pin.dataset.info||'';
  pop.append(b,document.createElement('br'),span);
  const boothId=pin.dataset.boothId;
  if(boothId){const a=document.createElement('a');a.href='#booths';a.dataset.pageLink='booths';a.dataset.boothId=boothId;a.textContent='查看摊位与制品 →';pop.append(document.createElement('br'),a);}
}
export function createRuntime({qs:$,qsa:qa}){
  let revealObs=null,stampObs=null,progressObs=null;
  function initRuntime(){
    if(revealObs)revealObs.disconnect();if(stampObs)stampObs.disconnect();if(progressObs)progressObs.disconnect();
    revealObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.closest('.special')?.classList.add('seen');revealObs.unobserve(e.target)}}),{threshold:.12});qa('.reveal').forEach(x=>revealObs.observe(x));
    stampObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){$('.pass-stamp[data-stamp="'+e.target.dataset.hit+'"]')?.classList.add('hit');stampObs.unobserve(e.target)}}),{threshold:.65});qa('.zone[data-hit]').forEach(x=>stampObs.observe(x));
        qa('.pin').forEach(p=>p.addEventListener('click',()=>paintMapPop($('#mapPop'),p)));
  }
  return {initRuntime};
}