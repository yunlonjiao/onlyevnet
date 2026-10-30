/* Deadline reminders on the start page. Dates are read from what the organizer already filled in
   (event start, staged reveal dates) plus a few custom ones kept in this browser. */
const KEY='onlyevent-deadlines-v1';
const DAY=86400000;
const dayOf=v=>{const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})/);return m?m[1]+'-'+m[2]+'-'+m[3]:''};
const toNumber=day=>Date.UTC(+day.slice(0,4),+day.slice(5,7)-1,+day.slice(8,10))/DAY;

export function readCustom(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
export function writeCustom(list){try{localStorage.setItem(KEY,JSON.stringify(list))}catch{}}

// today is a YYYY-MM-DD string so tests do not depend on the clock
export function buildDeadlines({projects,readState,custom,today}){
  const out=[],now=toNumber(today),names=new Map(projects.map(p=>[p.id,p.name||'未命名活动']));
  for(const p of projects){
    const s=readState(p)||{},name=names.get(p.id);
    const start=dayOf(s.eventStartDateTime);
    if(start)out.push({projectId:p.id,projectName:name,label:'活动举办',date:start});
    for(const st of (s.reveal?.stages||[])){const d=dayOf(st.at);if(d)out.push({projectId:p.id,projectName:name,label:'公开：'+(st.label||'下一批内容'),date:d})}
  }
  custom.forEach((c,index)=>{const d=dayOf(c.date);if(d&&names.has(c.projectId))out.push({projectId:c.projectId,projectName:names.get(c.projectId),label:String(c.label||'截止日期'),date:d,custom:true,index})});
  return out.map(i=>({...i,days:toNumber(i.date)-now})).filter(i=>i.days>=-3&&i.days<=120).sort((a,b)=>a.days-b.days);
}

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const when=d=>d.days<0?'已过 '+(-d.days)+' 天':d.days===0?'今天':d.days===1?'明天':'还有 '+d.days+' 天';

export function mountDeadlines(root,{getProjects,readState,today=()=>new Date(Date.now()+8*3600000).toISOString().slice(0,10)}){
  const draw=()=>{
    const projects=getProjects();
    if(!projects.length){root.hidden=true;return}
    root.hidden=false;
    const list=buildDeadlines({projects,readState,custom:readCustom(),today:today()});
    root.innerHTML='<div class="deadline-head"><b>近期日期</b><button type="button" class="quiet" data-deadline-add>＋ 添加截止日期</button></div>'+
      '<form class="deadline-form" hidden><select name="project">'+projects.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name||'未命名活动')+'</option>').join('')+'</select><input name="label" placeholder="例如：社团招募截止" maxlength="30" required><input name="date" type="date" required><button class="primary" type="submit">保存</button></form>'+
      (list.length?'<ul class="deadline-list">'+list.map(d=>'<li class="'+(d.days<0?'past':d.days<=7?'soon':'')+'"><time>'+esc(d.date.slice(5).replace('-','/'))+'</time><span>'+esc(d.label)+'<small>'+esc(d.projectName)+'</small></span><em>'+when(d)+'</em>'+(d.custom?'<button type="button" class="quiet" data-deadline-del="'+d.index+'" aria-label="删除">×</button>':'')+'</li>').join('')+'</ul>':'<p class="deadline-empty">最近没有要到的日期。填了活动开始时间，或加一个截止日期，这里就会提醒你。</p>');
  };
  root.onclick=e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.hasAttribute('data-deadline-add')){const f=root.querySelector('.deadline-form');f.hidden=!f.hidden;f.querySelector('input')?.focus()}
    else if(b.dataset.deadlineDel!==undefined){const c=readCustom();c.splice(Number(b.dataset.deadlineDel),1);writeCustom(c);draw()}
  };
  root.onsubmit=e=>{
    e.preventDefault();const f=new FormData(e.target),c=readCustom();
    c.push({projectId:String(f.get('project')),label:String(f.get('label')).trim(),date:String(f.get('date'))});writeCustom(c);draw();
  };
  draw();
  return draw;
}
