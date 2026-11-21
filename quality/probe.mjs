import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';
const exe='C:\\Users\\32224\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';
const b=await chromium.launch({headless:true,executablePath:exe});
const res={};
for(const tpl of ['05-live-poster','06-band-live']){
 const p=await b.newPage({viewport:{width:1400,height:1000}});
 await p.goto('http://127.0.0.1:4321/v8/?template='+tpl+'&project=probe',{waitUntil:'domcontentloaded'});
 await p.waitForTimeout(2600);
 const f=p.frames().find(x=>x.url().includes('render.html'));
 res[tpl]=await f.evaluate(()=>{
  const q=s=>document.querySelector(s);
  const r=e=>e?{w:Math.round(e.getBoundingClientRect().width),h:Math.round(e.getBoundingClientRect().height)}:null;
  const t=q('.bl-ticket, .ticket');
  const kids=t?[...t.children].map(c=>c.className.split(' ')[0]):[];
  const map=q('.bl-map, #map-home');
  return {hero:r(q('.hero-art')),ticketKids:kids,map:r(map),mapCols:map?getComputedStyle(map).gridTemplateColumns:null,
   related:q('.guest-related-note')?getComputedStyle(q('.guest-related-note')).display:null,
   acts:q('#activities')?getComputedStyle(q('#activities')).display:null,
   bill:q('.bl-bill')?getComputedStyle(q('.bl-bill')).position:null,
   kvFilter:q('.hero-art .kv')?getComputedStyle(q('.hero-art .kv')).filter:null,
   setlistSpans:document.querySelectorAll('.bl-setlist span').length,
   h2over:q('h2')?getComputedStyle(q('h2')).overflow:null,
   socials:document.querySelectorAll('[data-oe-item="socialLinks"]').length};
 });
 await p.close();
}
await b.close();
writeFileSync('C:\\Users\\32224\\Documents\\deepseek-harness\\default-workspace\\oe-review\\audit\\probe-before.json',JSON.stringify(res,null,1));
console.log(JSON.stringify(res).slice(0,800));
