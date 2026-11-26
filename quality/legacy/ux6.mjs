import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';
const templates=['01-ip-only','02-scrapbook','03-creator-market','04-creator-catalogue','05-live-poster','06-band-live'];
const exe='C:\\Users\\32224\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';
const browser=await chromium.launch({headless:true,executablePath:exe});
const rows=[];
for(const tpl of templates){
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto('http://127.0.0.1:4321/v8/?template='+tpl+'&project=ux'+tpl,{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(3000);
 const f=page.frames().find(x=>x.url().includes('render.html'));
 const r=await f.evaluate(()=>{
  const lum=c=>{const [r,g,b]=c.match(/\d+(\.\d+)?/g).slice(0,3).map(Number);const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)};
  const bgOf=el=>{let n=el;while(n){const b=getComputedStyle(n).backgroundColor;if(b&&b!=='rgba(0, 0, 0, 0)')return b;n=n.parentElement}return 'rgb(255,255,255)'};
  let low=0,checked=0;
  document.querySelectorAll('p,span,small,li,a,h1,h2,h3,strong').forEach(el=>{
   if(!el.textContent.trim())return;const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden')return;
   const fs=parseFloat(s.fontSize);if(fs<10)return;checked++;
   try{const l1=lum(s.color),l2=lum(bgOf(el));const ratio=(Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);if(ratio<3.0&&fs<24)low++}catch{}
  });
  const smallTargets=[...document.querySelectorAll('a,button')].filter(a=>{const r=a.getBoundingClientRect();return r.width>0&&(r.height<32||r.width<32)}).length;
  const h1=document.querySelectorAll('h1').length;
  const noAlt=[...document.images].filter(i=>!i.getAttribute('alt')).length;
  const clip=[...document.querySelectorAll('h1,h2,h3,p')].filter(e=>e.scrollWidth>e.clientWidth+2).length;
  const emptySections=[...document.querySelectorAll('main section,main .section')].filter(s=>!s.textContent.trim()&&!s.querySelector('img,svg,canvas')).map(s=>s.id||s.className.split(' ')[0]);
  return {checked,lowContrast:low,smallTargets,h1,noAlt,clip,emptySections};
 });
 rows.push({tpl,...r});
 await page.close();
}
await browser.close();
writeFileSync('C:\\Users\\32224\\Documents\\deepseek-harness\\default-workspace\\oe-review\\audit\\ux.json',JSON.stringify(rows,null,1));
rows.forEach(r=>console.log(r.tpl,'texts',r.checked,'lowContrast',r.lowContrast,'smallTaps',r.smallTargets,'h1',r.h1,'noAlt',r.noAlt,'clipped',r.clip,'empty',JSON.stringify(r.emptySections)))
