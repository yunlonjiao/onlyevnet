/* Projects saved by the retired standalone Template 03 editor kept creators and products in
   separate lists. Template 03 now runs on the shared IP ONLY core, where each booth (社团)
   carries its products. The original fields are kept under legacyCreatorMarket. */
const LEGACY_KEYS=['creators','products','maps','news','community','description','venue','eventType','registrationUrl','map'];

export function isLegacyCreatorMarketState(saved){
  if(!saved||typeof saved!=='object'||saved.creatorMarketMigrated)return false;
  return saved.eventType==='creator-market'||Array.isArray(saved.creators)||Array.isArray(saved.products)||(typeof saved.description==='string'&&saved.tagline===undefined);
}

const text=v=>typeof v==='string'?v:'';
const tagText=tags=>Array.isArray(tags)?tags.map(text).filter(Boolean):[];

export function migrateCreatorMarketState(saved,defaults){
  if(!isLegacyCreatorMarketState(saved))return saved;
  const creators=Array.isArray(saved.creators)?saved.creators:[];
  const products=Array.isArray(saved.products)?saved.products:[];
  const product=p=>({id:text(p.id)||'p-'+Math.random().toString(36).slice(2,9),name:text(p.name),tag:tagText(p.tags).join(' '),price:text(p.price),note:text(p.description),image:text(p.image)});
  const booths=creators.map((c,i)=>({
    id:text(c.id)||'c'+(i+1),no:text(c.booth),name:text(c.name),logo:text(c.image),
    type:tagText(c.tags).join(' · '),intro:text(c.description),
    products:products.filter(p=>p&&p.creatorId&&p.creatorId===c.id).map(product)
  }));
  const known=new Set(creators.map(c=>c.id));
  const orphans=products.filter(p=>p&&!(p.creatorId&&known.has(p.creatorId)));
  if(orphans.length)booths.push({id:'unassigned-products',no:'',name:'其他制品',logo:'',type:'',intro:'',products:orphans.map(product)});
  const maps=Array.isArray(saved.maps)?saved.maps:[];
  const guideText=text(saved.guide).trim();
  const next={
    ...saved,
    tagline:text(saved.description)||saved.tagline||defaults.tagline,
    booths,
    venueMap:{...structuredClone(defaults.venueMap),image:text(maps[0]?.image),imageTitle:text(maps[0]?.title),more:maps.slice(1).filter(m=>text(m?.image)).map((m,i)=>({id:'map'+(i+2),title:text(m.title),image:text(m.image)}))},
    updates:(Array.isArray(saved.news)?saved.news:[]).map((n,i)=>({id:'u'+(i+1),date:text(n.date),title:text(n.title),target:'top'})),
    socialLinks:(Array.isArray(saved.community)?saved.community:[]).map((c,i)=>({id:'sl'+(i+1),label:text(c.label)||text(c.name),note:'',url:text(c.url),image:''})),
    sponsors:(Array.isArray(saved.sponsors)?saved.sponsors:[]).map((s,i)=>typeof s==='string'?{id:'sp'+(i+1),name:s,logo:'',url:''}:{id:text(s.id)||'sp'+(i+1),name:text(s.name),logo:text(s.image||s.logo),url:text(s.url)}),
    guide:guideText?{homeCount:1,items:[{id:'gd-legacy',preset:'custom',title:'观展指南',label:'GUIDE',text:guideText}]}:structuredClone(defaults.guide),
    legacyCreatorMarket:Object.fromEntries(LEGACY_KEYS.concat(['guide','sponsors']).filter(k=>k in saved).map(k=>[k,saved[k]])),
    creatorMarketMigrated:true
  };
  LEGACY_KEYS.forEach(k=>delete next[k]);
  return next;
}
