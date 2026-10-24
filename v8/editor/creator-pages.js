/* Shared first-level canvas routing for creator templates 03/04.
   Only the Studio iframe receives hidden attributes: published visitor HTML stays intact. */
export function createCreatorStudioPages({frame,onNavigate=()=>{}}){
 const pages=new Set(['home','animation','booths','map','guide']);
 const anchorPages={
  '#top':['home','basic'],'#home':['home','basic'],
  '#ads':['home','products'],'#news':['home','news'],
  '#tickets':['home','tickets'],'#community':['home','community'],
  '#sponsors':['home','sponsors'],
  '#catalogue':['booths','creators'],'#creators':['booths','creators'],
  '#products':['booths','products'],'#map':['map','maps'],
  '#guide':['guide','guide']
 };
 let page='home',preview=false;
 const attr='data-oe-creator-hidden';
 function apply({scroll=false}={}){
  let doc;try{doc=frame.contentDocument}catch{return false}
  if(!doc?.body)return false;
  let sheet=doc.querySelector('#oe-creator-studio-pages');
  if(!sheet){
   sheet=doc.createElement('style');
   sheet.id='oe-creator-studio-pages';
   sheet.textContent='['+attr+']{display:none!important}';
   doc.head.appendChild(sheet);
  }
  const directory=doc.querySelector('#directory');
  if(directory&&!directory.hasAttribute('data-oe-original-open')){
   directory.setAttribute('data-oe-original-open',directory.open?'true':'false');
  }
  const editing=!preview;
  doc.documentElement.toggleAttribute('data-oe-creator-editing',editing);
  if(editing)doc.documentElement.setAttribute('data-oe-studio-page',page);
  else doc.documentElement.removeAttribute('data-oe-studio-page');
  const mark=(node,visible)=>{if(node)node.toggleAttribute(attr,editing&&!visible)};
  const hero=doc.querySelector('body > .hero');
  const catalogue=doc.querySelector('body > #catalogue');
  mark(hero,page==='home'||page==='animation');
  mark(catalogue,page==='home'||page==='booths');
  const main=doc.querySelector('main');
  main?.querySelectorAll(':scope > section,:scope > details').forEach(node=>{
   const id=node.id;
   const visible=page==='home'
    ? id!=='directory'&&!['creators','products','map','guide'].includes(id)
    :page==='booths'
    ? id==='directory'||id==='creators'||id==='products'
    :page==='map'?id==='directory'||id==='map'
    :page==='guide'?id==='directory'||id==='guide'
    :false;
   mark(node,visible);
  });
  mark(doc.querySelector('body > footer'),page==='home');
  if(directory){
   if(editing&&page!=='home'){
    directory.open=true;
    mark(directory.querySelector(':scope > summary'),false);
    directory.querySelectorAll(':scope > section').forEach(node=>mark(node,
     page==='booths'?node.id==='creators'||node.id==='products':node.id===page));
    // The directory summary is a visitor-only disclosure control; editor pages use direct navigation.
    directory.querySelector(':scope > summary')?.setAttribute(attr,'');
   }else{
    directory.querySelector(':scope > summary')?.removeAttribute(attr);
    directory.querySelectorAll(':scope > section').forEach(node=>node.removeAttribute(attr));
    if(!editing)directory.open=directory.getAttribute('data-oe-original-open')==='true';
   }
  }
  if(scroll){try{frame.contentWindow.scrollTo({top:0,left:0,behavior:'instant'})}catch{}}
  return true;
 }
 function show(next,{isPreview=preview,scroll=true}={}){
  if(next&&pages.has(next))page=next;
  preview=!!isPreview;
  return apply({scroll});
 }
 function connect(){
  let doc;try{doc=frame.contentDocument}catch{return}
  if(!doc||doc.documentElement.dataset.oeStudioNavBound==='true')return;
  doc.documentElement.dataset.oeStudioNavBound='true';
  doc.addEventListener('click',event=>{
   if(preview||event.defaultPrevented)return;
   const anchor=event.target.closest('a[href^="#"]');
   if(!anchor||anchor.closest('[data-market-record]'))return;
   const route=anchorPages[anchor.getAttribute('href')];
   if(!route)return;
   event.preventDefault();event.stopImmediatePropagation();
   onNavigate(route[0],route[1]);
  },true);
  apply();
 }
 frame.addEventListener('load',connect);
 try{if(frame.contentDocument?.readyState==='complete')connect()}catch{}
 return {show,getPage:()=>page,getPreview:()=>preview};
}
