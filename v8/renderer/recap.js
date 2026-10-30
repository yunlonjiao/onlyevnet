/* 实况与回顾: a section any template can show on its home page, driven by state.recap.
   mode 'live' = on the day (short posts, photos), mode 'recap' = after the event. 'off' or empty removes it.
   The section carries its own style so the exporter, which clones the page, needs nothing extra. */
const STYLE=`
.oe-recap{padding:56px 0;font-family:inherit;color:inherit}
.oe-recap .oe-recap-wrap{max-width:1100px;margin:0 auto;padding:0 22px}
.oe-recap-kicker{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.12em;opacity:.7;margin-bottom:6px}
.oe-recap h2{margin:0 0 10px;font-size:clamp(24px,3.4vw,38px);line-height:1.2}
.oe-recap-summary{margin:0 0 22px;max-width:46em;line-height:1.8;opacity:.85;white-space:pre-line}
.oe-recap-posts{list-style:none;margin:0 0 26px;padding:0;display:grid;gap:10px;max-width:46em}
.oe-recap-posts li{display:grid;grid-template-columns:64px minmax(0,1fr);gap:12px;padding:12px 14px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:12px}
.oe-recap-posts time{font-weight:800;font-size:13px;opacity:.7}
.oe-recap-posts p{margin:0;line-height:1.7;white-space:pre-line}
.oe-recap-photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;margin:0 0 26px}
.oe-recap-photos figure{margin:0}
.oe-recap-photos img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:12px}
.oe-recap-photos figcaption{font-size:13px;margin-top:6px;opacity:.8}
.oe-recap-videos{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin:0 0 26px}
.oe-recap-videos iframe{width:100%;aspect-ratio:16/9;border:0;border-radius:12px;background:#000}
.oe-recap-links{display:flex;flex-wrap:wrap;gap:10px}
.oe-recap-links a{padding:9px 18px;border-radius:999px;border:1px solid color-mix(in srgb,currentColor 30%,transparent);color:inherit;text-decoration:none;font-weight:700;font-size:14px}
.oe-recap-links a:hover{background:color-mix(in srgb,currentColor 10%,transparent)}
@media(max-width:600px){.oe-recap{padding:40px 0}.oe-recap-posts li{grid-template-columns:52px minmax(0,1fr)}}
`;

const safeUrl=v=>{try{const u=new URL(String(v||'').trim());return u.protocol==='http:'||u.protocol==='https:'?u.href:''}catch{return ''}};
export const bilibiliId=v=>{const m=String(v||'').match(/(BV[0-9A-Za-z]{10})/);return m?m[1]:''};
const el=(doc,tag,props={},text)=>{const n=doc.createElement(tag);for(const [k,v] of Object.entries(props))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n};

export function hasRecapContent(r){
  return !!r&&['live','recap'].includes(r.mode)&&!!(String(r.summary||'').trim()||(r.posts||[]).some(p=>String(p.text||'').trim())||(r.photos||[]).some(p=>safeUrl(p.image)||String(p.image||'').startsWith('/media/'))||(r.videos||[]).some(v=>safeUrl(v.url))||(r.links||[]).some(l=>safeUrl(l.url)));
}

export function renderRecap(state,doc=document){
  doc.getElementById('recap')?.remove();
  const r=state?.recap;
  if(!hasRecapContent(r))return;
  const host=doc.querySelector('main')||doc.body;
  const sec=el(doc,'section',{id:'recap',class:'oe-recap oe-home-only','aria-label':r.mode==='live'?'现场直击':'活动回顾'}),wrap=el(doc,'div',{class:'oe-recap-wrap'});
  sec.appendChild(el(doc,'style',{},STYLE));
  wrap.appendChild(el(doc,'span',{class:'oe-recap-kicker'},r.mode==='live'?'LIVE · 现场直击':'RECAP · 活动回顾'));
  wrap.appendChild(el(doc,'h2',{},String(r.title||'').trim()||(r.mode==='live'?'现场直击':'活动回顾')));
  if(String(r.summary||'').trim())wrap.appendChild(el(doc,'p',{class:'oe-recap-summary'},String(r.summary).trim()));
  const posts=(r.posts||[]).filter(p=>String(p.text||'').trim());
  if(posts.length){
    const ul=el(doc,'ul',{class:'oe-recap-posts'});
    posts.forEach(p=>{const li=el(doc,'li');li.appendChild(el(doc,'time',{},String(p.time||'').trim()));li.appendChild(el(doc,'p',{},String(p.text).trim()));ul.appendChild(li)});
    wrap.appendChild(ul);
  }
  const photos=(r.photos||[]).filter(p=>String(p.image||'').trim());
  if(photos.length){
    const grid=el(doc,'div',{class:'oe-recap-photos'});
    photos.forEach(p=>{const fig=el(doc,'figure'),img=el(doc,'img',{src:String(p.image),alt:String(p.caption||'活动现场照片'),loading:'lazy'});fig.appendChild(img);if(String(p.caption||'').trim())fig.appendChild(el(doc,'figcaption',{},String(p.caption).trim()));grid.appendChild(fig)});
    wrap.appendChild(grid);
  }
  const videos=(r.videos||[]).filter(v=>safeUrl(v.url));
  const embeds=videos.filter(v=>bilibiliId(v.url)),plain=videos.filter(v=>!bilibiliId(v.url));
  if(embeds.length){
    const box=el(doc,'div',{class:'oe-recap-videos'});
    embeds.forEach(v=>box.appendChild(el(doc,'iframe',{src:'https://player.bilibili.com/player.html?bvid='+bilibiliId(v.url)+'&page=1&autoplay=0&danmaku=0',title:String(v.title||'B站视频'),allowfullscreen:'true',loading:'lazy',referrerpolicy:'no-referrer'})));
    wrap.appendChild(box);
  }
  const links=[...plain.map(v=>({label:v.title||'观看视频',url:v.url})),...(r.links||[]).filter(l=>safeUrl(l.url))];
  if(links.length){
    const box=el(doc,'div',{class:'oe-recap-links'});
    links.forEach(l=>box.appendChild(el(doc,'a',{href:safeUrl(l.url),target:'_blank',rel:'noopener noreferrer'},String(l.label||'').trim()||'查看')));
    wrap.appendChild(box);
  }
  sec.appendChild(wrap);
  const footer=host.querySelector('footer');
  if(footer&&footer.parentElement===host)host.insertBefore(sec,footer);else host.appendChild(sec);
}
