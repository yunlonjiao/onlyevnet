import {test,expect} from '@playwright/test';

/* The first screen is only a fraction of a template. This guard looks at how the sections further down
   are laid out (where the heading sits, how wide the content is, how tickets and the guest list are
   arranged, whether sections share a row) and requires every pair of templates to differ in at least
   three of those layout traits. Colour and type are not part of it. */
test.use({viewport:{width:1280,height:900}});
const ids=['01-ip-only','02-scrapbook','03-creator-market','04-creator-catalogue','05-live-poster','06-band-live','07-tea-party','08-birthday'];

async function skeleton(page,id){
  await page.goto('/v8/?template='+id+'&embed=preview');
  await page.frameLocator('#liveFrame').locator('.hero').first().waitFor({state:'attached'});
  await page.evaluate(()=>document.querySelector('#liveFrame').contentDocument.querySelector('#loader')?.remove());
  await page.waitForTimeout(900);
  const frame=page.frames().find(f=>f.url().includes('render.html'));
  return frame.evaluate(()=>{
    const vis=el=>el&&el.offsetParent!==null&&el.getBoundingClientRect().width>0;
    const sec=(...sel)=>sel.map(s=>document.querySelector(s)).find(vis);
    const tickets=sec('#tickets');
    const head=tickets?.querySelector('.head,.oe-editorial-rail'),grid=tickets?.querySelector('.ticket-grid'),first=grid?.querySelector('.ticket');
    const tr=head?.getBoundingClientRect(),gr=grid?.getBoundingClientRect(),fr=first?.getBoundingClientRect();
    const W=innerWidth;
    let headPlace='above';
    if(tr&&gr){if(tr.width>W*0.9)headPlace='bar';else if(tr.right<=gr.left+4&&tr.bottom>gr.top)headPlace='side';else if(tr.width<W*0.45&&tr.left>W*0.35&&tr.left+tr.width/2>W*0.4&&tr.left+tr.width/2<W*0.6)headPlace='centred';else headPlace='above'}
    const bucket=w=>w<420?'rail':w<860?'narrow':w<1100?'mid':'wide';
    const gcs=grid?getComputedStyle(grid):null;
    const cols=gcs?(gcs.display==='grid'?gcs.gridTemplateColumns.split(' ').length:1):1;
    const lefts=['#updates','#tickets','#map-home','#community','#sponsors','#lineup','#timetable'].map(s=>document.querySelector(s)).filter(vis).map(e=>Math.round(e.getBoundingClientRect().left/40));
    const bodyColumns=Math.min(3,new Set(lefts).size);
    const rowish=fr&&gr?fr.width/gr.width>0.9:false;
    const bg=s=>{const e=document.querySelector(s);return e&&vis(e)?getComputedStyle(e).backgroundColor:null};
    const bands=new Set(['#updates','#tickets','#map-home','#community','#timetable','#lineup'].map(bg).filter(c=>c&&c!=='rgba(0, 0, 0, 0)')).size>=2;
    const h2=tickets?.querySelector('h2'),ey=head?.querySelector('.ey'),hcs=head?getComputedStyle(head):null,scs=tickets?getComputedStyle(tickets):null;
    const headAlign=hcs?(hcs.textAlign==='center'?'centre':'left'):null;
    const panel=scs&&parseFloat(scs.borderTopWidth)>=2&&parseFloat(scs.borderTopLeftRadius)>=16?'panel':'plain';
    let headStyle='plain';
    if(ey&&getComputedStyle(ey).position==='absolute')headStyle='tab';else if(hcs&&(hcs.backgroundImage!=='none'||(hcs.backgroundColor!=='rgba(0, 0, 0, 0)'&&hcs.backgroundColor!=='transparent')))headStyle='bar';else if(hcs&&parseFloat(hcs.borderBottomWidth)>=2)headStyle='rule';
    // how the whole page is put together, and how one section is divided from the next
    const wrapper=document.querySelector('main>div:not([class*="stash"])');
    const wr=wrapper?.getBoundingClientRect(),wcs=wrapper?getComputedStyle(wrapper):null;
    const shell=document.querySelector('.cb-book')?'book'
      :[...document.querySelectorAll('aside,div,section')].some(e=>vis(e)&&getComputedStyle(e).position==='sticky'&&e.offsetHeight>innerHeight*0.6&&e.offsetWidth<innerWidth*0.45)?'split'
      :[...document.querySelectorAll('main div,main section')].some(e=>vis(e)&&getComputedStyle(e).columnCount!=='auto')?'board'
      :(wcs&&wr.width<900&&parseFloat(wcs.borderTopWidth)>=2&&parseFloat(wcs.borderTopLeftRadius)>=16)?'card':'flow';
    const bw=scs?parseFloat(scs.borderTopWidth):0;
    const divider=scs?scs.borderTopStyle+'-'+(bw>=6?'thick':bw>=2?'mid':bw>0?'thin':'none'):null;
    const headSticky=head?getComputedStyle(head).position==='sticky':false;
    return {headAlign,panel,headStyle,headPlace,contentWidth:gr?bucket(gr.width):null,ticketCols:Math.min(cols,3),ticketRows:rowish?'rows':'cards',bodyColumns,colouredBands:bands,shell,divider,headSticky};
  });
}

test('sections below the first screen are laid out differently in every template',async({page})=>{
  test.setTimeout(240000);
  const s={};
  for(const id of ids)s[id]=await skeleton(page,id);
  if(process.env.SHOW_SKELETON)console.log('SKELETON '+JSON.stringify(s));
  const keys=['headAlign','panel','headStyle','headPlace','contentWidth','ticketCols','ticketRows','bodyColumns','colouredBands','shell','divider','headSticky'];
  const close=[];
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
    const diff=keys.filter(k=>s[ids[i]][k]!==s[ids[j]][k]);
    if(diff.length<3)close.push(ids[i].slice(0,2)+'-'+ids[j].slice(0,2)+' differ only in '+diff.join(','));
  }
  expect(close,JSON.stringify(s)).toEqual([]);
});

test('templates 03-08 do not use Template 01 markup for the map rail, community cards or sponsor cards',async({page})=>{
  test.setTimeout(120000);
  for(const id of ids.slice(2)){
    await page.goto('/v8/?template='+id+'&embed=preview');
    await page.frameLocator('#liveFrame').locator('.hero').first().waitFor({state:'attached'});
    await page.waitForTimeout(700);
    const frame=page.frames().find(f=>f.url().includes('render.html'));
    const left=await frame.evaluate(()=>['.map-link-rail','.map-explorer','.community>article:not([class])','.sponsors>.sponsor-card:not([class*="-sponsor"])','.map-jump-tag'].filter(s=>document.querySelector(s)));
    expect(left,id).toEqual([]);
  }
});
