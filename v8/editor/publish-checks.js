/* Things an organizer usually forgets before publishing. Nothing here blocks a publish; the
   publish dialog only lists them. Each check looks at the editor state, so it works the same way
   for every template and only mentions a module that the site actually shows. */
const on=(state,key)=>(state.modules||{})[key]!==false;
const filled=v=>String(v??'').trim().length>0;

export function publishChecks(state,{hasBoothPage=true}={}){
  const out=[];
  const add=text=>out.push(text);
  if(!filled(state.eventName)||String(state.eventName).trim()==='STARDUST ONLY')add('活动名称还是默认的「STARDUST ONLY」。');
  if(!filled(state.date)&&!filled(state.startAt))add('还没有填活动日期。');
  if(!filled(state.location)&&!filled(state.edition))add('还没有填活动地点。');
  if(!filled(state.heroImage)&&!filled(state.mobileHeroImage))add('还没有上传主视觉图。');
  if(Array.isArray(state.tickets)&&state.tickets.length&&!filled(state.ticketUrl))add('已经有票务信息，但没有填购票链接。');
  if(!filled(state.venueMap?.image))add('还没有上传场地图。');
  if(on(state,'activities')&&!(state.schedule||[]).length&&!(state.participation||[]).length)add('活动页是空的，没有节目或活动。');
  if(on(state,'guests')&&(state.guests||[]).length&&(state.guests||[]).some(g=>!filled(g.image)))add('有嘉宾还没有放照片。');
  if(hasBoothPage&&on(state,'booths')&&(state.booths||[]).some(b=>!filled(b.no)))add('有摊位还没有填摊位号。');
  const items=state.guide?.items||[];
  const blanks=items.reduce((n,x)=>n+((String(x.text||'').match(/【[^】]*】/g)||[]).length),0);
  if(on(state,'guide')&&blanks)add('观展指南里还有 '+blanks+' 处【】没有填写。');
  const heavy=(JSON.stringify(state).match(/data:image\//g)||[]).length;
  if(heavy)add('有 '+heavy+' 张图片还没上传到云端，网站会比较大。登录后重新选一次图片即可。');
  return out;
}
