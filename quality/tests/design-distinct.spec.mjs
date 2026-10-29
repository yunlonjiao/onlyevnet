import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

// Two templates must not look alike. Each template is measured on the page (colours, type, card
// shape, hero layout) and declares its hero composition and motif in its definition. The share of
// matching dimensions between any two templates must stay at or below half.
const ids=['01-ip-only','02-scrapbook','03-creator-market','04-creator-catalogue','05-live-poster','06-band-live','07-tea-party','08-birthday'];

const rgbOf=s=>{const m=String(s||'').match(/[\d.]+/g);if(!m||m.length<3)return null;const a=m.length>3?+m[3]:1;return a===0?null:m.slice(0,3).map(Number)};
function colourFamily(s){
  const c=rgbOf(s);if(!c)return null;
  const [r,g,b]=c.map(x=>x/255),mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,d=mx-mn;
  let h=0;if(d){h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360}
  const sat=d===0?0:d/(1-Math.abs(2*l-1));
  const tone=l<0.3?'dark':l>0.82?'light':'mid';
  if(sat<0.2||(tone==='dark'&&sat<0.5))return tone+'-neutral';
  return tone+'-hue'+Math.floor(h/45);
}
const weight=w=>{const n=parseInt(w,10)||0;return n<=600?'light':n<900?'bold':'heavy'};
const radius=r=>{const v=parseFloat(r)||0;return v<4?'sharp':v<10?'small':v<20?'medium':'large'};
const border=b=>{const v=parseFloat(b)||0;return v===0?'none':v<2.5?'thin':'thick'};

async function measure(page,id){
  await page.goto('/v8/?template='+id+'&project=distinct');
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('[data-oe-field="eventName"]').first()).toBeAttached();
  await page.waitForTimeout(1800);
  await page.evaluate(()=>{const d=document.querySelector('#liveFrame').contentDocument;d.querySelectorAll('#loader,.loader').forEach(e=>e.remove())});
  return page.evaluate(async id=>{
    const d=document.querySelector('#liveFrame').contentDocument,w=d.defaultView,cs=e=>e?w.getComputedStyle(e):null,q=s=>d.querySelector(s);
    const solid=e=>{for(;e&&e!==d.documentElement;e=e.parentElement){const s=cs(e),c=s.backgroundColor;if(c&&!/, 0\)$/.test(c)&&c!=='rgba(0, 0, 0, 0)')return c;
        const img=s.backgroundImage||'';const grads=[...img.matchAll(/(?:linear|radial)-gradient\((?:[^()]|\([^()]*\))*\)/g)].map(m=>m[0]);
        const last=grads[grads.length-1];if(last){const col=last.match(/rgba?\([^)]*\)/);if(col&&!/, 0\)$/.test(col[0]))return col[0]}}
      return cs(d.documentElement).backgroundColor};
    const card=q('.ticket')||q('.guest-card'),h2=q('.head h2')||q('h2'),h1=q('.hero h1')||q('h1'),btn=q('.nav .btn')||q('.ticket-purchase-link');
    const shadow=e=>{const s=cs(e)?.boxShadow||'none';if(s==='none')return 'none';const m=s.match(/(-?\d+)px (-?\d+)px (\d+)px/);return m&&+m[3]===0&&(+m[1]||+m[2])?'hard':'soft'};
    const head=q('.head'),hs=head?cs(head):null;
    const registry=await import('/v8/templates/registry.js');
    const t=registry.getTemplate(id);
    return {page:solid(q('.section')||d.body),hero:solid(q('.hero')||d.body),btn:btn?cs(btn).backgroundColor:'',
      h2font:h2?cs(h2).fontFamily.split(',')[0].replace(/"/g,'').toLowerCase():'',h2weight:h2?cs(h2).fontWeight:'',h2italic:h2?cs(h2).fontStyle:'',h1transform:h1?cs(h1).textTransform:'',
      headAlign:hs?(hs.textAlign==='center'||hs.alignItems==='center'?'center':'left'):'',
      radius:card?cs(card).borderRadius:'',border:card?cs(card).borderTopWidth:'',shadow:card?shadow(card):'',
      cols:q('.hero-grid')?cs(q('.hero-grid')).gridTemplateColumns.split(' ').length:0,
      body:cs(d.body).fontFamily.split(',')[0].replace(/"/g,'').toLowerCase(),
      hero_design:t.design?.hero||'',motif:t.design?.motif||''};
  },id);
}
function dimensions(m){
  return {pageBg:colourFamily(m.page),heroBg:colourFamily(m.hero),accent:colourFamily(m.btn),headFont:m.h2font||null,headWeight:m.h2font?weight(m.h2weight):null,
    headItalic:m.h2italic||null,titleCase:m.h1transform||null,headAlign:m.headAlign||null,cardRadius:m.radius?radius(m.radius):null,cardBorder:m.border?border(m.border):null,
    cardShadow:m.shadow||null,heroCols:m.cols||null,bodyFont:m.body,heroDesign:m.hero_design,motif:m.motif};
}
function similarity(a,b){
  const keys=Object.keys(a).filter(k=>a[k]!=null&&b[k]!=null),same=keys.filter(k=>a[k]===b[k]);
  return {share:same.length/keys.length,same};
}

test('no two templates look alike (at most half of the design dimensions match)',async({page})=>{
  test.setTimeout(240000);
  const dims={};
  for(const id of ids)dims[id]=dimensions(await measure(page,id));
  for(const id of ids)expect(dims[id].heroDesign,id+' must declare design.hero in its definition').not.toBe('');
  const rows=[];
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
    const {share,same}=similarity(dims[ids[i]],dims[ids[j]]);
    rows.push({pair:ids[i].slice(0,2)+'-'+ids[j].slice(0,2),share:Math.round(share*100)/100,same});
  }
  if(process.env.SHOW_SIMILARITY)console.log(JSON.stringify(rows.sort((a,b)=>b.share-a.share).slice(0,8)));
  const worst=rows.filter(r=>r.share>0.5);
  expect(worst,'pairs above 50%: '+JSON.stringify(worst)).toEqual([]);
});
