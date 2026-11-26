// Visual audit harness: finds layout/content problems across templates and widths.
// Usage: node quality/visual-audit.mjs [width,...]
// Requires a local Playwright Chromium; targets the live editor preview.
import {chromium} from '@playwright/test';
import {mkdirSync, writeFileSync} from 'node:fs';

const widths = (process.argv[2] || '320,390,768').split(',').map(Number);
const templates = ['01-museum-guide','02-scrapbook','03-creator-market','04-creator-catalogue','05-live-poster','06-band-live','07-tea-party','08-birthday'];
const outDir = 'oe-review/qa/visual-audit';
mkdirSync(outDir, {recursive:true});
const staticDate = /\b\d{1,2}\.\d{2}\b|\b(19|20)\d{2}\b|\b(SUN|MON|TUE|WED|THU|FRI|SAT)\b/;
const sampleTokens = ['11.08','STARDUST','NO. 048271','BILIBILI ONLY 2026'];
const intentional = /ribbon|marquee|ticker|orbit|sticker|scroll-progress|update-item|section-no|reveal|entry|kv|hero-art|lightbox/i;

const browser = await chromium.launch({headless:true, executablePath:'C:\\Users\\32224\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe'});
const rows=[];
for (const width of widths) {
  for (const tpl of templates) {
    const ctx = await browser.newContext({viewport:{width,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2});
    const page = await ctx.newPage();
    page.setDefaultTimeout(20000);
    try {
      await page.goto(`https://onlyevent.cn/v8/?template=${tpl}&project=visaudit-${width}-${tpl}`, {waitUntil:'domcontentloaded'});
      await page.waitForTimeout(4200);
      const frame = page.frames().find(f=>f.url().includes('/v8/render'));
      if (!frame) { rows.push({width,tpl,error:'no frame'}); await ctx.close(); continue; }
      const r = await frame.evaluate(({intentionalSrc, staticDateSrc, sampleTokens}) => {
        const vw = innerWidth;
        const intentional = new RegExp(intentionalSrc,'i');
        const dateRe = new RegExp(staticDateSrc);
        const vis = e => {
          const s=getComputedStyle(e), r=e.getBoundingClientRect();
          return s.display!=='none' && s.visibility!=='hidden' && r.width>0 && r.height>0;
        };
        const textOf = e => (e.textContent||'').trim().slice(0,24);
        const all = [...document.querySelectorAll('h1,h2,h3,p,span,b,small,li,a,button,div')].filter(vis);
        const clipped = all.filter(e=>{
          const s=getComputedStyle(e);
          if(parseFloat(s.fontSize)===0)return false;
          return e.scrollWidth > e.clientWidth + 4 && /(hidden|clip)/.test(s.overflowX) && !intentional.test(String(e.className));
        }).map(e=>({text:textOf(e),cls:String(e.className).slice(0,30),sw:e.scrollWidth,cw:e.clientWidth})).slice(0,8);
        const outside = all.filter(e=>{
          const r=e.getBoundingClientRect();
          return (r.right>vw+4 || r.left<-4) && !intentional.test(String(e.className)) && !/index-card|carousel|slider|swiper/.test(String(e.className));
        }).map(e=>({text:textOf(e),cls:String(e.className).slice(0,30),left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right)})).slice(0,8);
        const interactive = [...document.querySelectorAll('a,button,input,[role=button]')].filter(vis);
        const smallTargets = interactive.filter(e=>{
          const r=e.getBoundingClientRect();
          const inline = (e.closest('p,li,span') && !e.closest('nav,.nav,.mobile-dock,.footer')) || e.tagName==='A' && (getComputedStyle(e).display==='inline' || e.closest('.timetable,.schedule,.lineup,.guest-list'));
          return (r.width<44 || r.height<44) && !inline;
        }).map(e=>({text:textOf(e),w:Math.round(e.getBoundingClientRect().width),h:Math.round(e.getBoundingClientRect().height)})).slice(0,8);
        const tinyText = all.filter(e=>parseFloat(getComputedStyle(e).fontSize)<11 && textOf(e).length>2).length;
        const leafText = all.filter(e=>e.children.length===0 && e.textContent.trim()).map(e=>e.textContent.trim());
        const dates = [...new Set(leafText.filter(t=>dateRe.test(t)))].slice(0,10);
        const samples = sampleTokens.filter(tok=>leafText.some(t=>t.includes(tok)));
        const nav = document.querySelector('.mobile-dock, footer, .footer');
        const navRect = nav && vis(nav) ? nav.getBoundingClientRect() : null;
        const navPad = getComputedStyle(document.body).paddingBottom;
        // Same-looking components in the same row should share one box model (e.g. span.pill vs a.pill).
        const groups = {};
        all.forEach(e=>{
          const key = String(e.className||'').trim();
          if (!key || key.length>40) return;
          const p = e.parentElement;
          const parentKey = p ? (p.tagName + '.' + String(p.className||'').slice(0,24)) : 'root';
          const row = Math.round(e.getBoundingClientRect().top/8);
          (groups[parentKey+'|'+key+'|'+row] ??= []).push(e);
        });
        const inconsistent = Object.entries(groups).filter(([,els])=>els.length>=2).map(([cls,els])=>{
          const hs = els.map(e=>e.getBoundingClientRect().height);
          const hMin = Math.min(...hs), hMax = Math.max(...hs);
          const aligns = els.map(e=>getComputedStyle(e).alignItems);
          const pads = els.map(e=>getComputedStyle(e).padding);
          const mismatch = hMax-hMin>4 || new Set(aligns).size>1 || new Set(pads).size>1;
          return mismatch ? {cls:cls.slice(0,40), count:els.length, hMin:Math.round(hMin), hMax:Math.round(hMax), aligns:[...new Set(aligns)], pads:[...new Set(pads)].slice(0,2)} : null;
        }).filter(Boolean).slice(0,10);
        const navEl=document.querySelector('.nav');let navOverlap=null;if(navEl){const a=navEl.querySelector('.brand'),b=navEl.querySelector('.links');if(a&&b){const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();if(ra.width&&rb.width){const ox=Math.min(ra.right,rb.right)-Math.max(ra.left,rb.left),oy=Math.min(ra.bottom,rb.bottom)-Math.max(ra.top,rb.top);if(ox>2&&oy>2)navOverlap={brand:[Math.round(ra.left),Math.round(ra.top),Math.round(ra.width),Math.round(ra.height)],links:[Math.round(rb.left),Math.round(rb.top),Math.round(rb.width),Math.round(rb.height)],ox:Math.round(ox),oy:Math.round(oy)}}}}
        return {
          vw,navOverlap, scrollW:document.documentElement.scrollWidth, overflow:document.documentElement.scrollWidth>vw+4,
          clipped, outside, smallTargets, tinyText, dates, samples, inconsistent,
          nav: navRect ? {height:Math.round(navRect.height), padBottom:navPad} : null
        };
      }, {intentionalSrc:intentional.source, staticDateSrc:staticDate.source, sampleTokens});
      rows.push({width,tpl,...r});
    } catch(e) {
      rows.push({width,tpl,error:e.message.slice(0,80)});
    }
    await ctx.close();
  }
}
await browser.close();
writeFileSync(outDir+'/report.json', JSON.stringify(rows,null,1));
const bad = rows.filter(r=>r.error||r.overflow||r.clipped?.length||r.outside?.length||r.smallTargets?.length||r.samples?.length||r.inconsistent?.length);
console.log(JSON.stringify({checked:rows.length, flagged:bad.length, details:bad.map(r=>({w:r.width,tpl:r.tpl,overflow:r.overflow,clipped:r.clipped?.length,outside:r.outside?.length,small:r.smallTargets?.length,samples:r.samples,inconsistent:r.inconsistent}))},null,1));
