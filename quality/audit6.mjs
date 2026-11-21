import {chromium} from '@playwright/test';
import {mkdirSync, writeFileSync} from 'node:fs';
const out='C:\\Users\\32224\\Documents\\deepseek-harness\\default-workspace\\oe-review\\audit';
mkdirSync(out,{recursive:true});
const templates=['01-ip-only','02-scrapbook','03-creator-market','04-creator-catalogue','05-live-poster','06-band-live'];
const exe='C:\\Users\\32224\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';
const browser=await chromium.launch({headless:true,executablePath:exe});
const report=[];
for(const tpl of templates){
 for(const [w,h,label] of [[1440,900,'desk'],[390,844,'mob']]){
  const page=await browser.newPage({viewport:{width:w,height:h}});
  const errs=[],warns=[];
  page.on('pageerror',e=>errs.push(e.message.slice(0,140)));
  page.on('console',m=>{if(m.type()==='error')warns.push(m.text().slice(0,140))});
  await page.goto('http://127.0.0.1:4321/v8/?template='+tpl+'&project=audit'+tpl+label,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(3200);
  const f=page.frames().find(x=>x.url().includes('render.html'));
  const info=await f.evaluate(()=>{
   const docW=document.documentElement.scrollWidth, winW=window.innerWidth;
   const broken=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length;
   const ids=[...document.querySelectorAll('[id]')].map(x=>x.id);
   const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);
   const emptyLinks=[...document.querySelectorAll('a[href]')].filter(a=>!a.getAttribute('href')||a.getAttribute('href')==='#').length;
   const hiddenText=[...document.querySelectorAll('h1,h2,h3')].filter(h=>{const s=getComputedStyle(h);return s.display==='none'||s.visibility==='hidden'}).length;
   const lowContrast=0;
   return {overflow:docW-winW,imgCount:document.images.length,broken,dupIds:[...new Set(dup)].slice(0,5),emptyLinks,hiddenHeadings:hiddenText,bodyH:document.body.scrollHeight,sections:[...document.querySelectorAll('main section,main .section')].map(s=>s.id||s.className.split(' ')[0]).slice(0,14)};
  });
  await page.screenshot({path:out+'\\'+tpl+'-'+label+'.png',fullPage:false});
  report.push({tpl,label,errs:errs.slice(0,3),warns:warns.slice(0,3),...info});
  await page.close();
 }
}
await browser.close();
writeFileSync(out+'\\report.json',JSON.stringify(report,null,1));
for(const r of report){console.log(r.tpl,r.label,'ovf',r.overflow,'broken',r.broken,'dup',r.dupIds.length,'emptyA',r.emptyLinks,'err',r.errs.length,'warn',r.warns.length)}
