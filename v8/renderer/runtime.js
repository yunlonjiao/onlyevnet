export function createRuntime({qs:$,qsa:qa}){
  let revealObs=null,stampObs=null,progressObs=null;
  function initRuntime(){
    if(revealObs)revealObs.disconnect();if(stampObs)stampObs.disconnect();if(progressObs)progressObs.disconnect();
    revealObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');e.target.closest('.special')?.classList.add('seen');revealObs.unobserve(e.target)}}),{threshold:.12});qa('.reveal').forEach(x=>revealObs.observe(x));
    stampObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){$('.pass-stamp[data-stamp="'+e.target.dataset.hit+'"]')?.classList.add('hit');stampObs.unobserve(e.target)}}),{threshold:.65});qa('.zone[data-hit]').forEach(x=>stampObs.observe(x));
    const prog=qa('.scroll-progress a');progressObs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)prog.forEach(a=>a.classList.toggle('active',a.dataset.sec===e.target.id))}),{threshold:.35});['top','tickets','highlights','passport','booths','stage'].map(id=>$('#'+id)).filter(Boolean).forEach(x=>progressObs.observe(x));
    qa('.pin').forEach(p=>p.addEventListener('click',()=>{const pop=$('#mapPop');if(pop)pop.innerHTML='<b>'+p.dataset.name+'</b><br><span>'+p.dataset.info+'</span>'}));
  }
  return {initRuntime};
}