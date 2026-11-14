/* Street spotlight for booth-only events (template 03).
   Booths carry a free-text `street`; the street list, its booth range and its count are derived
   from the booths themselves, so organizers keep one source of truth.
   Everything here must stay self-contained: the standalone exporter inlines these functions
   with Function.prototype.toString(). */

export function streetGroups(state){
  const booths=Array.isArray(state?.booths)?state.booths:[];
  const order=Array.isArray(state?.streetOrder)?state.streetOrder:[];
  const map=new Map();
  for(const b of booths){
    if(!b)continue;
    const name=String(b.street||'').trim()||'未分街道';
    if(!map.has(name))map.set(name,{name,booths:[]});
    map.get(name).booths.push(b);
  }
  const list=[...map.values()].map(g=>{
    const nos=g.booths.map(b=>String(b.no||'').trim()).filter(Boolean)
      .sort((a,b)=>a.localeCompare(b,'zh-Hans-CN',{numeric:true}));
    return {name:g.name,booths:g.booths,count:g.booths.length,from:nos[0]||'',to:nos[nos.length-1]||''};
  });
  const rank=n=>{const i=order.indexOf(n);return i<0?999:i};
  list.sort((a,b)=>rank(a.name)-rank(b.name)||String(a.from).localeCompare(String(b.from),'zh-Hans-CN',{numeric:true}));
  return list;
}

export function mountStreetCard(root,state,{esc=v=>String(v??''),storageKey='oe-street-last'}={}){
  if(!root)return;
  const groups=streetGroups(state);
  if(!groups.length){root.innerHTML='';root.hidden=true;return}
  root.hidden=false;
  let pick=groups[Math.floor(Math.random()*groups.length)];
  if(groups.length>1){
    try{
      const prev=sessionStorage.getItem(storageKey)||'';
      for(let i=0;i<6&&pick.name===prev;i++)pick=groups[Math.floor(Math.random()*groups.length)];
      sessionStorage.setItem(storageKey,pick.name);
    }catch{}
  }
  const range=[pick.from,pick.to].filter(Boolean).join('–');
  const streetImg=(Array.isArray(state.streets)?state.streets:[]).find(s=>String(s.name||'')===pick.name)?.image||'';
  const chips=pick.booths.slice(0,3).map(b=>'<span class="cm-street-chip">'+esc(b.name||b.no||'社团')+'</span>').join('');
  root.innerHTML='<a class="cm-street-card'+(streetImg?' has-image':'')+'" href="#booths" data-street-jump="'+esc(pick.name)+'"'+(streetImg?' style="background-image:linear-gradient(180deg,#00000010,#00000080),url(&quot;'+esc(streetImg)+'&quot;)"':'')+'>'
    +'<span class="cm-street-ey">随便逛逛 · 随机街道</span>'
    +'<b class="cm-street-name">'+esc(pick.name)+'</b>'
    +'<span class="cm-street-meta">'+esc(range?range+' · ':'')+pick.count+' 个社团</span>'
    +'<div class="cm-street-chips">'+chips+'</div>'
    +'<span class="cm-street-go">去逛这条街 →</span></a>';
}

export function mountStreetLegend(root,state,{esc=v=>String(v??'')}={}){
  if(!root)return;
  const groups=streetGroups(state);
  if(!groups.length){root.innerHTML='';root.hidden=true;return}
  root.hidden=false;
  root.innerHTML=groups.map(g=>{
    const range=[g.from,g.to].filter(Boolean).join('–');
    return '<a class="cm-street-row" href="#booths" data-street-jump="'+esc(g.name)+'">'
      +'<b>'+esc(g.name)+'</b><span>'+esc(range)+'</span><em>'+g.count+' 个社团</em>'
      +'<i aria-hidden="true">→</i></a>';
  }).join('');
}

export function mountProductTiles(root,items,{count=6,esc=v=>String(v??''),storageKey='oe-tiles-last'}={}){
  if(!root)return;
  const pool=Array.isArray(items)?items.filter(p=>p&&(p.name||p.image)):[];
  if(!pool.length){root.innerHTML='';root.hidden=true;return}
  root.hidden=false;
  const shuffle=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  let order=shuffle(pool);
  if(pool.length>count){
    try{
      const prev=sessionStorage.getItem(storageKey)||'',sig=()=>order.slice(0,count).map(p=>p.id).join('|');
      for(let n=0;n<8&&sig()===prev;n++)order=shuffle(pool);
      sessionStorage.setItem(storageKey,sig());
    }catch{}
  }
  const art=p=>p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.name)+'" loading="lazy" decoding="async">':'<span class="cm-tile-ph" aria-hidden="true">'+(p.tag?esc(p.tag):'')+'</span>';
  root.innerHTML=order.slice(0,count).map(p=>'<a class="cm-tile" href="#booths" data-spotlight-booth="'+esc(p.boothId)+'">'
    +'<span class="cm-tile-art">'+art(p)+'</span>'
    +'<b>'+esc(p.name||'')+'</b>'
    +'<small>'+esc([p.boothNo,p.boothName,p.price].filter(Boolean).join(' · '))+'</small></a>').join('');
}

export function mountStreetBanners(root,state,{esc=v=>String(v??'')}={}){
  if(!root)return;
  const groups=streetGroups(state);
  if(!groups.length){root.innerHTML='';root.hidden=true;return}
  root.hidden=false;
  const imgs=new Map((Array.isArray(state.streets)?state.streets:[]).map(s=>[String(s.name||''),String(s.image||'')]));
  root.innerHTML=groups.map(g=>{
    const img=imgs.get(g.name)||'',range=[g.from,g.to].filter(Boolean).join('–');
    return '<a class="cm-street-banner" href="#booths" data-street-jump="'+esc(g.name)+'">'
      +'<span class="cm-street-banner-art'+(img?'':' empty')+'"'+(img?' style="background-image:url(&quot;'+esc(img)+'&quot;)"':'')+'></span>'
      +'<b>'+esc(g.name)+'</b><small>'+esc(range)+' · '+g.count+' 个社团</small></a>';
  }).join('');
}
