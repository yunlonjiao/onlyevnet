import {readFileSync} from 'node:fs';
import {chromium} from '@playwright/test';
const exe='C:\\Users\\32224\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe';
const b=await chromium.launch({headless:true,executablePath:exe});
const p=await b.newPage({viewport:{width:1500,height:1000}});
await p.goto('http://127.0.0.1:4321/v8/?template=06-band-live&project=insrich3',{waitUntil:'domcontentloaded'});
await p.waitForTimeout(2400);
const grab=()=>p.evaluate(()=>{
 const pick=['fontSize','fontWeight','lineHeight','color','backgroundColor','padding','margin','borderRadius','borderWidth','display','gap','minHeight','letterSpacing','alignItems','justifyContent','boxSizing','overflow'];
 const snap=sel=>{const e=document.querySelector(sel);if(!e)return null;const cs=getComputedStyle(e);const o={};for(const k of pick)o[k]=cs[k];o._h=Math.round(e.getBoundingClientRect().height);return o};
 return {inspector:snap('.inspector'),header:snap('.inspector-header'),kicker:snap('.inspector-kicker'),title:snap('.inspector-header b'),status:snap('.inspector-status'),label:snap('.inspector .item-fields label'),labelSpan:snap('.inspector .item-fields label span'),input:snap('.inspector input[data-key]'),media:snap('.inspector .item-media'),refPanel:snap('.inspector .reference-panel'),checkRow:snap('.inspector .check-row'),checkBox:snap('.inspector .check-row input')};
});
await p.getByText('活动日程',{exact:false}).first().click({timeout:6000}).catch(()=>{});
await p.waitForTimeout(500);
await p.getByText('18:00',{exact:false}).first().click({timeout:6000}).catch(()=>{});
await p.waitForTimeout(700);
const cur=await grab();
const base=JSON.parse(readFileSync('C:\\Users\\32224\\Documents\\deepseek-harness\\default-workspace\\oe-review\\audit\\inspector-baseline.json','utf8')).schedule;
const diffs=[];
for(const el of Object.keys(base)){const a=base[el],c=cur[el];if(!a||!c){diffs.push([el,'missing']);continue}for(const k of Object.keys(a)){if(k==='width'||k==='height'||k==='_w'||k==='_h')continue;if(a[k]!==c[k])diffs.push([el,k,a[k],c[k]])}}
console.log('diffs',diffs.length,JSON.stringify(diffs));
await b.close();
