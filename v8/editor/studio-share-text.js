export function shareTextFor(state,publishRecord){
  const url=publishRecord?.url||'',bits=[state.date,state.location].map(v=>String(v||'').trim()).filter(Boolean).join(' · ');
  return '我会去「'+(state.eventName||'活动')+'」！'+(bits?'\n'+bits:'')+(url?'\n活动网站：'+url:'');
}
