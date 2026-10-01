export function createCollections({qs:$,escapeHtml:esc,getState,getMode}){
  function field(path,value,tag='span',cls=''){return '<'+tag+(cls?' class="'+cls+'"':'')+' data-oe-field="'+path+'" contenteditable="'+(getMode()==='edit')+'" spellcheck="false">'+esc(value)+'</'+tag+'>'}
  function ensureLightbox(){
    let dlg=$('#giftLightbox');if(dlg)return dlg;
    dlg=document.createElement('dialog');dlg.id='giftLightbox';dlg.className='gift-lightbox';dlg.innerHTML='<button type="button" aria-label="关闭">×</button><img alt="赠品图片">';
    document.body.appendChild(dlg);dlg.querySelector('button').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});return dlg;
  }
  function openGiftLightbox(src){if(!src)return;const dlg=ensureLightbox();dlg.querySelector('img').src=src;dlg.showModal()}
  function cleanupTicketShell(){$('#tickets .section-no')?.remove();$('#tickets .ticket-actions')?.remove();$('.nav .btn')?.remove()}
  function renderTickets(){
    cleanupTicketShell();const box=$('#tickets .ticket-grid');if(!box)return;const state=getState();
    box.innerHTML=(state.tickets||[]).map((x,i)=>{
      const image=x.image?'<button class="ticket-gift-image" type="button" data-ticket-image="'+i+'" aria-label="查看赠品图片"><img src="'+esc(x.image)+'" alt="'+esc(x.name||'')+' 赠品"></button>':'';
      return '<article class="ticket cut-ticket reveal in" data-oe-item="tickets" data-oe-index="'+i+'"><div class="ticket-top"><div class="ticket-copy">'+field('tickets.'+i+'.name',x.name,'h3')+'<div class="price" data-oe-field="tickets.'+i+'.price" contenteditable="'+(getMode()==='edit')+'" spellcheck="false">'+esc(x.price)+'</div></div>'+image+'</div><div class="gift"><b>包含 / 特典</b>\n'+field('tickets.'+i+'.gift',x.gift,'span')+'</div>'+field('tickets.'+i+'.note',x.note||'','small')+'</article>';
    }).join('');
  }
  function renderHighlights(){const box=$('#highlights .specials');if(!box)return;const state=getState();box.innerHTML=(state.highlights||[]).map((x,i)=>'<article class="special reveal in" data-oe-item="highlights" data-oe-index="'+i+'" style="--tone:'+esc(x.tone||'#ffe45c')+'">'+field('highlights.'+i+'.stamp',x.stamp||('STAMP '+String(i+1).padStart(2,'0')),'span','stamp')+field('highlights.'+i+'.title',x.title,'h3')+field('highlights.'+i+'.text',x.text,'p')+'</article>').join('')}
  function renderSchedule(){
    const state=getState(),items=state.schedule||[];
    const home=$('#schedule-home .timeline');
    if(home)home.innerHTML=items.map((x,i)=>'<a class="event reveal in" href="#activities" data-target-mode="page" data-page-link="activities" data-activity-index="'+i+'" data-oe-item="schedule" data-oe-index="'+i+'">'+field('schedule.'+i+'.time',x.time,'span')+field('schedule.'+i+'.title',x.title,'b')+field('schedule.'+i+'.stage',x.stage,'span')+'<span>→</span></a>').join('');
    const detail=$('#activities .activity-detail-list');
    if(detail)detail.innerHTML=items.map((x,i)=>'<article class="activity-detail" id="activity-detail-'+i+'" data-oe-item="schedule" data-oe-index="'+i+'"><span>'+esc(x.time||'')+' · '+esc(x.stage||'')+'</span>'+field('schedule.'+i+'.title',x.title,'h3')+field('schedule.'+i+'.detail',x.detail||'','p')+'</article>').join('');
  }
  function renderCollections(){renderTickets();renderHighlights();renderSchedule()}
  return {openGiftLightbox,renderTickets,renderHighlights,renderSchedule,renderCollections};
}