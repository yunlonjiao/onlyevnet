/* OnlyEvent creator fair data model; independent of IP ONLY visual layout. */
export const CREATOR_FAIR_TYPE='creator-market';
export const CREATOR_FAIR_MODULES=Object.freeze(['creators','booths','products','boothMap','visitorGuide','news','tickets','favorites','wishlist']);
export function createCreatorFairDefaults(){
  return {
    eventType:CREATOR_FAIR_TYPE,
    eventName:'同人创作展',
    description:'',
    date:'',location:'',venue:'',heroImage:'',mobileHeroImage:'',
    registrationUrl:'',ticketUrl:'',
    creators:[],booths:[],products:[],
    map:{image:'',sections:[]},
    news:[],guide:{access:'',rules:'',images:[]},
    modules:{creators:true,booths:true,products:true,boothMap:true,visitorGuide:true,news:true,tickets:true},
  };
}
export function validateCreatorFairState(state){
  const errors=[];
  if(!state||state.eventType!==CREATOR_FAIR_TYPE)return ['invalid eventType'];
  const creators=Array.isArray(state.creators)?state.creators:[];
  const booths=Array.isArray(state.booths)?state.booths:[];
  const products=Array.isArray(state.products)?state.products:[];
  const unique=(items,type)=>{
    const ids=new Set();
    items.forEach((item,index)=>{
      if(!item||typeof item.id!=='string'||!item.id.trim())errors.push(type+'['+index+']: missing id');
      else if(ids.has(item.id))errors.push(type+'['+index+']: duplicate id');
      else ids.add(item.id);
    });
    return ids;
  };
  const creatorIds=unique(creators,'creators');
  const boothIds=unique(booths,'booths');
  unique(products,'products');
  booths.forEach((item,index)=>{if(item.creatorId&&!creatorIds.has(item.creatorId))errors.push('booths['+index+']: unknown creatorId')});
  products.forEach((item,index)=>{
    if(item.creatorId&&!creatorIds.has(item.creatorId))errors.push('products['+index+']: unknown creatorId');
    if(item.boothId&&!boothIds.has(item.boothId))errors.push('products['+index+']: unknown boothId');
  });
  return errors;
}
export function findCreatorFairItems(state,{query='',kind='all',tags=[]}={}){
  const q=String(query).toLocaleLowerCase().trim();
  const needles=tags.map(x=>String(x).toLocaleLowerCase()).filter(Boolean);
  const rows=[
    ...(state.creators||[]).map(item=>({...item,kind:'creator'})),
    ...(state.booths||[]).map(item=>({...item,kind:'booth'})),
    ...(state.products||[]).map(item=>({...item,kind:'product'}))
  ];
  return rows.filter(item=>{
    if(kind!=='all'&&item.kind!==kind)return false;
    const searchable=[item.name,...(Array.isArray(item.tags)?item.tags:[])].join(' ').toLocaleLowerCase();
    const itemTags=(Array.isArray(item.tags)?item.tags:[]).map(x=>String(x).toLocaleLowerCase());
    return (!q||searchable.includes(q))&&needles.every(t=>itemTags.includes(t));
  });
}
