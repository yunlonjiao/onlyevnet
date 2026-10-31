import {test,expect} from '@playwright/test';

/* Automatic layout review for the visitor sites of templates 03-08, on a desktop and a phone.
   It looks for what the eye catches first: content pushed past the screen edge, text drawn on top of
   other text, a big empty band between two blocks, and phone layouts that squeeze text into a sliver. */
const ids=['03-creator-market','04-creator-catalogue','05-live-poster','06-band-live','07-tea-party','08-birthday'];
const sizes=[{name:'desktop',width:1280,height:900},{name:'phone',width:390,height:844}];

const reviewInPage=()=>{
    const vw=document.documentElement.clientWidth,problems=[];
    const visible=el=>{const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&Number(cs.opacity)>0.05};
    const scrolls=el=>{for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){const o=getComputedStyle(p).overflowX;if(o==='auto'||o==='scroll')return true}return false};
    const decorative=el=>el.matches('.section-orbit,.ribbon,.ribbon *,[aria-hidden="true"]')||!!el.closest('.section-orbit')||(!el.matches('img,svg,canvas,video')&&!el.textContent.trim());
    const own=el=>el.tagName.toLowerCase()+(el.className&&typeof el.className==='string'?'.'+el.className.trim().split(/s+/).slice(0,2).join('.'):'');
    const name=el=>(el.parentElement&&el.parentElement.tagName!=='MAIN'?own(el.parentElement)+' > ':'')+own(el);
    // 1. nothing reaches past the right edge of the screen
    if(document.documentElement.scrollWidth>vw+1)problems.push('page scrolls sideways ('+document.documentElement.scrollWidth+' > '+vw+')');
    for(const el of document.querySelectorAll('main *')){
      if(!visible(el)||scrolls(el)||decorative(el)||getComputedStyle(el).position==='fixed')continue;
      const r=el.getBoundingClientRect();
      if(r.right>vw+2&&r.width<vw*3&&!el.closest('[hidden]')){problems.push('past the edge: '+name(el)+' right='+Math.round(r.right));if(problems.length>12)return problems}
    }
    // 2. text blocks that sit on top of each other
    const leaves=[...document.querySelectorAll('main h1,main h2,main h3,main b,main p,main small,main time,main strong,main a,main span,main em')]
      .filter(el=>visible(el)&&!scrolls(el)&&[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&!el.closest('.oe-page-view:not(.on),[hidden],.loader'));
    const boxes=leaves.map(el=>({el,r:el.getBoundingClientRect()})).sort((a,b)=>a.r.top-b.r.top);
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
      const a=boxes[i],b=boxes[j];
      if(b.r.top>=a.r.bottom)break;
      if(a.el.contains(b.el)||b.el.contains(a.el))continue;
      const w=Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left),h=Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top);
      if(w<=2||h<=2)continue;
      const small=Math.min(a.r.width*a.r.height,b.r.width*b.r.height);
      if(w*h>small*0.35){problems.push('text overlaps: '+name(a.el)+' / '+name(b.el)+' "'+a.el.textContent.trim().slice(0,12)+'" "'+b.el.textContent.trim().slice(0,12)+'"');if(problems.length>12)return problems}
    }
    // 3. empty bands: more than 240px of nothing between neighbouring blocks of one section
    for(const wrap of document.querySelectorAll('main .section>.wrap')){
      if(!visible(wrap))continue;
      const kids=[...wrap.children].filter(k=>visible(k)&&getComputedStyle(k).position!=='absolute');
      for(let i=1;i<kids.length;i++){
        const gap=kids[i].getBoundingClientRect().top-kids[i-1].getBoundingClientRect().bottom;
        if(gap>240)problems.push('empty band of '+Math.round(gap)+'px in '+name(wrap.parentElement)+' #'+(wrap.parentElement.id||''));
      }
    }
    // 4. text squeezed into a sliver: a line of text wrapped to more than 6 lines inside a box narrower than 70px
    for(const el of leaves){
      const r=el.getBoundingClientRect(),lh=parseFloat(getComputedStyle(el).lineHeight)||parseFloat(getComputedStyle(el).fontSize)*1.4;
      if(!getComputedStyle(el).writingMode.startsWith('vertical')&&r.width<110&&el.textContent.trim().length>6&&r.height/lh>=3)problems.push('squeezed text: '+name(el)+' '+Math.round(r.width)+'px wide, '+Math.round(r.height/lh)+' lines');
    }
    return problems;
};

async function review(page,id){
  await page.goto('/v8/?template='+id+'&embed=preview');
  await page.frameLocator('#liveFrame').locator('.hero').first().waitFor({state:'attached'});
  await page.evaluate(()=>document.querySelector('#liveFrame').contentDocument.querySelector('#loader')?.remove());
  await page.waitForTimeout(900);
  const frame=page.frames().find(f=>f.url().includes('render.html'));
  return frame.evaluate(reviewInPage);
}

for(const size of sizes){
  test('visitor site layout review — '+size.name,async({page})=>{
    test.setTimeout(240000);
    await page.setViewportSize({width:size.width,height:size.height});
    const report={};
    for(const id of ids){const p=await review(page,id);if(p.length)report[id]=p}
    expect(report,JSON.stringify(report,null,1)).toEqual({});
  });
}

test('stage and small-event templates (05-08) have no circle or booth pages',async({page})=>{
  test.setTimeout(120000);
  for(const id of ids.slice(2)){
    await page.goto('/v8/?template='+id+'&embed=preview');
    await page.frameLocator('#liveFrame').locator('.hero').first().waitFor({state:'attached'});
    await page.waitForTimeout(500);
    const frame=page.frames().find(f=>f.url().includes('render.html'));
    const found=await frame.evaluate(()=>['#booths','[data-page-link="booths"]','.booth-directory-rich'].filter(s=>document.querySelector(s)));
    expect(found,id).toEqual([]);
  }
});

test('04 catalogue book: every page spread passes the same review, on desktop and phone',async({page})=>{
  test.setTimeout(240000);
  const report={};
  await page.addInitScript(()=>{try{sessionStorage.clear()}catch{}});
  for(const size of sizes){
    await page.setViewportSize({width:size.width,height:size.height});
    await page.goto('/v8/?template=04-creator-catalogue&embed=preview');
    await page.frameLocator('#liveFrame').locator('.cb-book').waitFor({state:'attached'});
    await page.evaluate(()=>document.querySelector('#liveFrame').contentDocument.querySelector('#loader')?.remove());
    const frame=page.frames().find(f=>f.url().includes('render.html'));
    for(let i=0;i<14;i++){
      await page.waitForTimeout(750);
      const found=await frame.evaluate(reviewInPage);
      if(found.length)(report[size.name+' spread '+i]=found);
      const last=await frame.evaluate(()=>{const t=document.querySelector('[data-catalogue-count]').textContent;const m=t.match(/(\d+) \/ (\d+)$/);return t.includes('封底')||(!!m&&m[1]===m[2])});
      if(last)break;
      await frame.evaluate(()=>document.querySelector('[data-catalogue-step="1"]').click());
    }
  }
  expect(report,JSON.stringify(report,null,1)).toEqual({});
});
