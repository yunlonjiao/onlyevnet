// Editor chrome layout audit: catches overlaps/clipping in the editor UI itself
// (the template canvas has its own audit in visual-audit.mjs).
// Usage: node quality/editor-ui-audit.mjs [width,...]
import {chromium} from '@playwright/test';
import {mkdirSync, writeFileSync} from 'node:fs';

const widths = (process.argv[2] || '320,390,768').split(',').map(Number);
const outDir='oe-review/qa/editor-ui-audit';mkdirSync(outDir,{recursive:true});
const rows=[];
const browser=await chromium.launch({headless:true,executablePath:'C:\\Users\\32224\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe'});

function overlap(a,b){return Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));}
for(const width of widths){
  const ctx=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const page=await ctx.newPage();page.setDefaultTimeout(20000);
  try{
    await page.goto('https://onlyevent.cn/v8/?template=08-birthday&project=ui-'+width,{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(4200);
    await page.evaluate(()=>document.querySelector('#mobileEditorDock [data-dock="inspector"]')?.click());
    await page.waitForTimeout(700);
    const r=await page.evaluate(()=>{
      const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
      const pairs=[];
      const check=(name,container,children)=>{
        const c=document.querySelector(container);if(!c)return;
        const els=[...c.querySelectorAll(children)].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0});
        for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){
          const a=rect(els[i]),b=rect(els[j]);
          const ox=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left));
          const oy=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
          const area=ox*oy;
          if(area>8)pairs.push({where:name,a:els[i].textContent.trim().slice(0,14),b:els[j].textContent.trim().slice(0,14),area:Math.round(area)});
        }
      };
      check('inspector-header','.inspector-header',':scope > *');
      check('topbar','.studio-topbar',':scope > *');
      check('dock','#mobileEditorDock','button');
      const head=document.querySelector('.inspector-header');const title=head?.querySelector('b');const st=head?.querySelector('.inspector-status');
      const gap=title&&st?Math.round(st.getBoundingClientRect().left-title.getBoundingClientRect().right):null;
      const overflowEls=[...document.querySelectorAll('.studio-topbar,.inspector-header,.mobile-editor-dock,#publishBtn')].filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className||e.id);
      return {vw:innerWidth,gap,overlap:pairs,overflow:overflowEls,dock:getComputedStyle(document.querySelector('#mobileEditorDock')).display};
    });
    rows.push({width,...r});
  }catch(e){rows.push({width,error:e.message.slice(0,100)});}
  await ctx.close();
}
await browser.close();
writeFileSync(outDir+'/report.json',JSON.stringify(rows,null,1));
console.log(JSON.stringify(rows,null,1));
