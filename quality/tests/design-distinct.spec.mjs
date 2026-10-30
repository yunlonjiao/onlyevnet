import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

// Two templates must not look alike. Each template is measured on the page (type, card
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
  await page.goto('/v8/?template='+id+'&embed=preview');
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
      btnRadius:btn?cs(btn).borderRadius:'',navHeight:q('.nav')?q('.nav').getBoundingClientRect().height:0,
      h2size:h2?parseFloat(cs(h2).fontSize):0,h1size:h1?parseFloat(cs(h1).fontSize):0,
      cardPad:card?parseFloat(cs(card).paddingTop):0,ticketCols:q('.ticket-grid')?cs(q('.ticket-grid')).gridTemplateColumns.split(' ').length:0,
      artShape:q('.kv')?cs(q('.kv')).borderRadius:'',artRatio:q('.hero-art')?(()=>{const r=q('.hero-art').getBoundingClientRect();return r.width/Math.max(1,r.height)})():0,
      hero_design:t.design?.hero||'',motif:t.design?.motif||'',composition:(()=>{
        const hero=q('.hero'),artEl=q('.hero-art')||q('.kv'),copy=q('.hero-copy')||q('.hero h1');
        if(!hero||!artEl||!copy)return {kind:'scene'};
        const A=artEl.getBoundingClientRect(),C=copy.getBoundingClientRect(),H=hero.getBoundingClientRect(),cx=r=>r.x+r.width/2,cy=r=>r.y+r.height/2;
        let kind;
        if(A.width*A.height>=0.8*H.width*H.height)kind='full-bleed-overlay';
        else if(Math.abs(cx(A)-cx(C))<0.15*H.width)kind=cy(A)<cy(C)?'art-over-text':'text-over-art';
        else kind=cx(A)>cx(C)?'text-left-art-right':'art-left-text-right';
        const kvEl=q('.kv')||artEl,br=cs(kvEl).borderRadius,round=parseFloat(br)>=100||/%/.test(br);
        const share=x=>Math.min(3,Math.floor(x*4)),rot=e=>{const t=cs(e).transform;if(!t||t==='none')return 0;const m=new DOMMatrixReadOnly(t);return Math.abs(Math.atan2(m.b,m.a)*180/Math.PI)};
        const k=cs(kvEl),cxRel=(cx(C)-H.x)/H.width;
        return {kind,artWidth:share(A.width/H.width),artHeight:share(A.height/H.height),align:cs(copy).textAlign==='center'?'center':'left',
          copyX:cxRel<0.4?'L':cxRel>0.6?'R':'C',tilt:rot(artEl)>0.5||rot(kvEl)>0.5,round,framed:parseFloat(k.borderTopWidth)>=2||k.boxShadow!=='none'};
      })()};
  },id);
}
function dimensions(m){
  // Colour is deliberately left out: templates may share a palette; what must differ is layout, type and shape.
  return {headFont:m.h2font||null,headWeight:m.h2font?weight(m.h2weight):null,
    headItalic:m.h2italic||null,titleCase:m.h1transform||null,headAlign:m.headAlign||null,cardRadius:m.radius?radius(m.radius):null,cardBorder:m.border?border(m.border):null,
    cardShadow:m.shadow||null,heroCols:m.cols||null,bodyFont:m.body,heroDesign:m.hero_design,motif:m.motif,
    buttonShape:m.btnRadius?radius(m.btnRadius):null,navHeight:m.navHeight?(m.navHeight<56?'compact':m.navHeight<68?'regular':'tall'):null,
    headingSize:m.h2size?(m.h2size<30?'small':m.h2size<40?'medium':'large'):null,titleSize:m.h1size?(m.h1size<50?'small':m.h1size<80?'medium':'large'):null,
    cardPadding:m.cardPad?(m.cardPad<16?'tight':m.cardPad<22?'regular':'roomy'):null,ticketColumns:m.ticketCols||null,
    artShape:m.artShape?(parseFloat(m.artShape)>=200||/%/.test(m.artShape)?'round':radius(m.artShape)):null,artRatio:m.artRatio?(m.artRatio>1.15?'landscape':m.artRatio<0.9?'portrait':'square'):null};
}
function similarity(a,b){
  const keys=Object.keys(a).filter(k=>a[k]!=null&&b[k]!=null),same=keys.filter(k=>a[k]===b[k]);
  return {share:same.length/keys.length,same};
}

test('no two templates look alike (at most half of the design dimensions match)',async({page})=>{
  test.setTimeout(240000);
  const dims={},compositions={},masks={};
  for(const id of ids){
    const m=await measure(page,id);
    dims[id]=dimensions(m);compositions[id]=m.composition;
    // layout fingerprint: where the strong edges of the first screen sit (card borders, picture and text blocks), independent of colour
    const shot=await page.screenshot();
    masks[id]=await page.evaluate(async b64=>{
      const bmp=await createImageBitmap(await (await fetch('data:image/png;base64,'+b64)).blob());
      const W=128,H=80,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.drawImage(bmp,0,0,W,H);
      const d=g.getImageData(0,0,W,H).data,L=(x,y)=>.299*d[(y*W+x)*4]+.587*d[(y*W+x)*4+1]+.114*d[(y*W+x)*4+2];
      const cells=[];
      for(let cy=0;cy<20;cy++)for(let cx=0;cx<32;cx++){let sum=0;for(let y=cy*4;y<cy*4+4;y++)for(let x=cx*4;x<cx*4+4;x++){if(x+1<W&&y+1<H)sum+=Math.abs(L(x+1,y)-L(x,y))+Math.abs(L(x,y+1)-L(x,y))}cells.push(sum)}
      const sorted=[...cells].sort((a,b)=>a-b),cut=sorted[Math.floor(sorted.length*0.75)];
      return cells.map(v=>v>cut&&v>0?1:0);
    },shot.toString('base64'));
  }
  for(const id of ids)expect(dims[id].heroDesign,id+' must declare design.hero in its definition').not.toBe('');
    // A value that three quarters of the templates share (the same body font, no italic) does not tell templates apart either, so it is left out.
  const informative=Object.keys(dims[ids[0]]).filter(k=>{
    const values=ids.map(id=>dims[id][k]).filter(v=>v!=null),counts={};
    values.forEach(v=>{counts[v]=(counts[v]||0)+1});
    return Math.max(...Object.values(counts))<values.length*0.75;
  });
  const only=(d)=>Object.fromEntries(informative.map(k=>[k,d[k]]));
  if(process.env.SHOW_DIMENSIONS)console.log('DIMS '+JSON.stringify(Object.fromEntries(ids.map(id=>[id.slice(0,2),only(dims[id])]))));
  const rows=[];
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
    const {share,same}=similarity(only(dims[ids[i]]),only(dims[ids[j]]));
    rows.push({pair:ids[i].slice(0,2)+'-'+ids[j].slice(0,2),share:Math.round(share*100)/100,same});
  }
  if(process.env.SHOW_SIMILARITY)console.log(JSON.stringify(rows.sort((a,b)=>b.share-a.share).slice(0,8)));
  const worst=rows.filter(r=>r.share>0.5);
  expect(worst,'pairs above 50%: '+JSON.stringify(worst)).toEqual([]);

  // The first screen is built differently in every template: no two share the same composition...
  if(process.env.SHOW_SIMILARITY)console.log('COMPOSITIONS '+JSON.stringify(compositions));
  // Two compositions count as the same unless they differ in at least two of: arrangement, picture width, picture height, text alignment and position, tilt, picture shape, frame.
  const compositionGap=(a,b)=>['kind','artWidth','artHeight','align','copyX','tilt','round','framed'].filter(k=>a[k]!==b[k]).length;
  const sameComposition=[];
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)if(compositionGap(compositions[ids[i]],compositions[ids[j]])<2)sameComposition.push(ids[i].slice(0,2)+'-'+ids[j].slice(0,2));
  expect(sameComposition,'templates whose first screen is built the same way: '+JSON.stringify(compositions)).toEqual([]);
  // ...and the strong edges of the first screen (where blocks, cards and pictures sit) do not line up. 0 is unrelated, 1 is identical.
  const layout=[];
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
    const a=masks[ids[i]],b=masks[ids[j]];let both=0,either=0;
    a.forEach((v,k)=>{if(v&&b[k])both++;if(v||b[k])either++});
    layout.push({pair:ids[i].slice(0,2)+'-'+ids[j].slice(0,2),similarity:Math.round(both/Math.max(1,either)*100)/100});
  }
  if(process.env.SHOW_SIMILARITY)console.log('LAYOUT '+JSON.stringify([...layout].sort((x,y)=>y.similarity-x.similarity).slice(0,8)));
  const alike=layout.filter(r=>r.similarity>0.5);
  expect(alike,'first screens that look alike: '+JSON.stringify(alike)).toEqual([]);
});
