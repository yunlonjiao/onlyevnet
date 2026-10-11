// Template-specific component composition adapters.
// They preserve OnlyEvent semantic/data hooks while giving each IP ONLY template
// its own card grammar, section rhythm and information hierarchy.

const q=(root,sel)=>root?.querySelector(sel);
const qa=(root,sel)=>[...(root?.querySelectorAll(sel)||[])];

function mark(root,cls){
  if(root&&!root.classList.contains(cls))root.classList.add(cls);
}
function prependLabel(node,cls,text){
  if(!node||q(node,'.'+cls))return;
  const el=document.createElement('span');
  el.className=cls;el.textContent=text;node.prepend(el);
}
function wrapChildren(node,cls,filter=()=>true){
  if(!node||q(node,':scope > .'+cls))return;
  const kids=[...node.children].filter(filter);
  if(!kids.length)return;
  const wrap=document.createElement('div');wrap.className=cls;
  node.insertBefore(wrap,kids[0]);kids.forEach(k=>wrap.appendChild(k));
}

function scrapbook(){
  const tickets=document.querySelector('[data-oe-mount="tickets"]');
  qa(tickets,'.ticket').forEach((card,i)=>{
    mark(card,'scrap-pass');
    prependLabel(card,'scrap-pass-no','PASS '+String(i+1).padStart(2,'0'));
    const top=q(card,'.ticket-top'),gift=q(card,'.gift');
    if(top)mark(top,'scrap-pass-main');
    if(gift)mark(gift,'scrap-pass-stub');
  });

  const booths=document.querySelector('[data-oe-mount="booths"]');
  mark(booths,'scrap-directory');
  const tools=q(booths,'.booth-directory-tools');if(tools)mark(tools,'scrap-directory-tabs');
  qa(booths,'.booth-directory-card').forEach((card,i)=>{
    mark(card,'scrap-index-card');prependLabel(card,'scrap-index-no','CARD '+String(i+1).padStart(2,'0'));
  });
  qa(booths,'.directory-product-card').forEach((card,i)=>{
    mark(card,'scrap-product-tag');prependLabel(card,'scrap-product-no','ITEM '+String(i+1).padStart(2,'0'));
  });

  const guests=document.querySelector('[data-oe-mount="guests"]');
  mark(guests,'scrap-polaroid-wall');
  qa(guests,'.guest-card').forEach((card,i)=>{
    mark(card,'scrap-polaroid');prependLabel(card,'scrap-photo-no','PHOTO '+String(i+1).padStart(2,'0'));
  });

  const schedule=document.querySelector('[data-oe-mount="schedule"]');
  mark(schedule,'scrap-diary');
  qa(schedule,'.timetable-row').forEach((row,i)=>{
    mark(row,'scrap-diary-entry');prependLabel(row,'scrap-diary-mark','LOG '+String(i+1).padStart(2,'0'));
  });

  const guide=document.querySelector('[data-oe-mount="guide-detail"]');
  mark(guide,'scrap-foldout-guide');
  qa(guide,'article').forEach((item,i)=>{mark(item,'scrap-guide-note');prependLabel(item,'scrap-guide-tab','NOTE '+String(i+1).padStart(2,'0'))});

  const community=document.querySelector('[data-oe-mount="community"]');
  mark(community,'scrap-contact-sheet');
  qa(community,'article').forEach((item,i)=>{mark(item,'scrap-contact-card');prependLabel(item,'scrap-contact-no','#'+String(i+1).padStart(2,'0'))});
}

function school(){
  qa(document,'[data-oe-mount="tickets"] .ticket').forEach((x,i)=>{mark(x,'school-admission');prependLabel(x,'school-card-no','TICKET / '+String(i+1).padStart(2,'0'))});
  const booths=document.querySelector('[data-oe-mount="booths"]');mark(booths,'school-directory');
  qa(booths,'.booth-directory-card').forEach((x,i)=>{mark(x,'school-club-card');prependLabel(x,'school-club-index','CLUB '+String(i+1).padStart(2,'0'))});
  qa(booths,'.directory-product-card').forEach(x=>mark(x,'school-goods-card'));
  const guests=document.querySelector('[data-oe-mount="guests"]');mark(guests,'school-profile-grid');
  qa(guests,'.guest-card').forEach((x,i)=>{mark(x,'school-profile');prependLabel(x,'school-profile-id','PROFILE '+String(i+1).padStart(2,'0'))});
  const schedule=document.querySelector('[data-oe-mount="schedule"]');mark(schedule,'school-timetable-board');
  qa(schedule,'.timetable-row').forEach(x=>mark(x,'school-period'));
  const guide=document.querySelector('[data-oe-mount="guide-detail"]');mark(guide,'school-rulebook');
  qa(guide,'article').forEach((x,i)=>{mark(x,'school-rule');prependLabel(x,'school-rule-index','RULE '+String(i+1).padStart(2,'0'))});
}

function museum(){
  qa(document,'[data-oe-mount="tickets"] .ticket').forEach((x,i)=>{mark(x,'museum-admission');prependLabel(x,'museum-object-no','ADMISSION '+String(i+1).padStart(2,'0'))});
  const booths=document.querySelector('[data-oe-mount="booths"]');mark(booths,'museum-catalogue');
  qa(booths,'.booth-directory-card').forEach((x,i)=>{mark(x,'museum-catalogue-row');prependLabel(x,'museum-object-no','CAT. '+String(i+1).padStart(3,'0'))});
  qa(booths,'.directory-product-card').forEach((x,i)=>{mark(x,'museum-object');prependLabel(x,'museum-object-no','OBJ. '+String(i+1).padStart(3,'0'))});
  const guests=document.querySelector('[data-oe-mount="guests"]');mark(guests,'museum-portrait-index');
  qa(guests,'.guest-card').forEach((x,i)=>{mark(x,'museum-portrait');prependLabel(x,'museum-object-no','PORTRAIT '+String(i+1).padStart(2,'0'))});
  const schedule=document.querySelector('[data-oe-mount="schedule"]');mark(schedule,'museum-programme');
  qa(schedule,'.timetable-row').forEach((x,i)=>{mark(x,'museum-programme-row');prependLabel(x,'museum-object-no','PROGRAM '+String(i+1).padStart(2,'0'))});
  const guide=document.querySelector('[data-oe-mount="guide-detail"]');mark(guide,'museum-notes');
  qa(guide,'article').forEach((x,i)=>{mark(x,'museum-note');prependLabel(x,'museum-object-no','NOTE '+String(i+1).padStart(2,'0'))});
}

function live(){
  qa(document,'[data-oe-mount="tickets"] .ticket').forEach((x,i)=>{mark(x,'live-pass');prependLabel(x,'live-pass-type','PASS '+String(i+1).padStart(2,'0'))});
  const booths=document.querySelector('[data-oe-mount="booths"]');mark(booths,'live-merch-directory');
  qa(booths,'.booth-directory-card').forEach((x,i)=>{mark(x,'live-merch-booth');prependLabel(x,'live-card-index','BOOTH '+String(i+1).padStart(2,'0'))});
  qa(booths,'.directory-product-card').forEach(x=>mark(x,'live-merch-item'));
  const guests=document.querySelector('[data-oe-mount="guests"]');mark(guests,'live-lineup');
  qa(guests,'.guest-card').forEach((x,i)=>{mark(x,'live-performer');prependLabel(x,'live-card-index','ACT '+String(i+1).padStart(2,'0'))});
  const schedule=document.querySelector('[data-oe-mount="schedule"]');mark(schedule,'live-stage-board');
  qa(schedule,'.timetable-row').forEach((x,i)=>{mark(x,'live-slot');prependLabel(x,'live-card-index','STAGE '+String(i+1).padStart(2,'0'))});
  const guide=document.querySelector('[data-oe-mount="guide-detail"]');mark(guide,'live-venue-guide');
}

function expo(){
  qa(document,'[data-oe-mount="tickets"] .ticket').forEach((x,i)=>{mark(x,'expo-ticket-row');prependLabel(x,'expo-cell-code','TK-'+String(i+1).padStart(2,'0'))});
  const booths=document.querySelector('[data-oe-mount="booths"]');mark(booths,'expo-directory-table');
  qa(booths,'.booth-directory-card').forEach((x,i)=>{mark(x,'expo-directory-row');prependLabel(x,'expo-cell-code','B-'+String(i+1).padStart(3,'0'))});
  qa(booths,'.directory-product-card').forEach((x,i)=>{mark(x,'expo-product-row');prependLabel(x,'expo-cell-code','P-'+String(i+1).padStart(3,'0'))});
  const guests=document.querySelector('[data-oe-mount="guests"]');mark(guests,'expo-guest-table');
  qa(guests,'.guest-card').forEach((x,i)=>{mark(x,'expo-guest-row');prependLabel(x,'expo-cell-code','G-'+String(i+1).padStart(3,'0'))});
  const schedule=document.querySelector('[data-oe-mount="schedule"]');mark(schedule,'expo-schedule-table');
  qa(schedule,'.timetable-row').forEach((x,i)=>{mark(x,'expo-schedule-row');prependLabel(x,'expo-cell-code','SC-'+String(i+1).padStart(2,'0'))});
  const guide=document.querySelector('[data-oe-mount="guide-detail"]');mark(guide,'expo-guide-table');
}

function immersive(){
  qa(document,'[data-oe-mount="tickets"] .ticket').forEach((x,i)=>{mark(x,'imm-admission-slip');prependLabel(x,'imm-seal','入場 '+['壱','弐','参','四'][i]||String(i+1))});
  const booths=document.querySelector('[data-oe-mount="booths"]');mark(booths,'imm-stall-scroll');
  qa(booths,'.booth-directory-card').forEach((x,i)=>{mark(x,'imm-stall');prependLabel(x,'imm-seal','店 '+String(i+1).padStart(2,'0'))});
  qa(booths,'.directory-product-card').forEach(x=>mark(x,'imm-item'));
  const guests=document.querySelector('[data-oe-mount="guests"]');mark(guests,'imm-character-scroll');
  qa(guests,'.guest-card').forEach((x,i)=>{mark(x,'imm-character');prependLabel(x,'imm-seal','人物 '+String(i+1).padStart(2,'0'))});
  const schedule=document.querySelector('[data-oe-mount="schedule"]');mark(schedule,'imm-chronicle');
  qa(schedule,'.timetable-row').forEach((x,i)=>{mark(x,'imm-chronicle-row');prependLabel(x,'imm-seal','刻 '+String(i+1).padStart(2,'0'))});
  const guide=document.querySelector('[data-oe-mount="guide-detail"]');mark(guide,'imm-rule-scroll');
  qa(guide,'article').forEach((x,i)=>{mark(x,'imm-rule');prependLabel(x,'imm-seal','案内 '+String(i+1).padStart(2,'0'))});
}

export function applyTemplateComponentAdapters(templateId){
  if(templateId==='02-scrapbook')scrapbook();
  else if(templateId==='03-school-festival')school();
  else if(templateId==='04-museum-editorial')museum();
  else if(templateId==='05-live-poster')live();
  else if(templateId==='06-expo-catalogue')expo();
  else if(templateId==='07-immersive-character')immersive();
}
