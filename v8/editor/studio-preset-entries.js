export function presetEntriesForState(collection,templateId,GUIDE_PRESETS,PARTICIPATION_PRESETS){
 const tpl=String(templateId||'');
 if(collection==='guide'){
  const band={traffic:'场地与交通',admission:'入场与寄存',facilities:'周边物贩',safety:'拍摄与散场规则'};
  let e=Object.entries(GUIDE_PRESETS);
  if(/^0[56]/.test(tpl))e=e.filter(([k])=>k!=='cosplay');
  if(/^06/.test(tpl))e=e.map(([k,x])=>[k,Object.assign({},x,{title:band[k]||x.title})]);
  return e;
 }
 if(collection==='participation'){
  if(/^06/.test(tpl)){const band={stage:'乐队演出',live:'暖场乐队',signing:'签售 / 合影',merch:'周边物贩',exchange:'演后交流'};return Object.entries(PARTICIPATION_PRESETS).filter(([k])=>band[k]).map(([k,x])=>[k,Object.assign({},x,{title:band[k]})]);}
  let e=Object.entries(PARTICIPATION_PRESETS);
  if(/^0[56]/.test(tpl))e=e.filter(([k,x])=>!/COS|痛车|摄影/i.test(String(x.title||'')));
  return e;
 }
 return [];
}
