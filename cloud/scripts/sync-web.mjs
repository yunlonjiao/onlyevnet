/* Builds cloud/web (the Worker's static assets) from the repo's front end:
   /admin/ (organizer platform) and /v8/ (Studio editor + renderer). cloud/web is generated
   and git-ignored; run through npm run check / dev / deploy. */
import {cpSync,rmSync,mkdirSync,writeFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const here=path.dirname(fileURLToPath(import.meta.url)),cloud=path.resolve(here,'..'),repo=path.resolve(cloud,'..'),out=path.join(cloud,'web');
rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
for(const dir of ['admin','v8']){
  if(!existsSync(path.join(repo,dir)))throw new Error('missing '+dir+'/ in the repository root');
  cpSync(path.join(repo,dir),path.join(out,dir),{recursive:true,filter:src=>!/[\/](node_modules|\.git)([\/]|$)/.test(src)});
}
writeFileSync(path.join(out,'index.html'),'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/admin/"><title>OnlyEvent Studio</title></head><body><p>正在进入 OnlyEvent Studio… <a href="/admin/">点击进入</a></p></body></html>\n');
// The organizer platform and editor are tools, not content to be indexed. Visitor sites get their own robots.txt from the Worker.
writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /admin/\nDisallow: /v8/\nDisallow: /api/\nDisallow: /media/\n');
const count=d=>readdirSync(d).reduce((n,f)=>{const p=path.join(d,f);return n+(statSync(p).isDirectory()?count(p):1)},0);
console.log('cloud/web ready: '+count(out)+' files');

/* Module preload hints. The editor is plain ES modules: each file is only discovered after its
   importer has loaded, so a cold visit pays one network round trip per level of the import tree
   (about 6 for the editor, then about 5 more for the preview frame it creates). Hints listing the whole
   tree let the browser fetch every module in one parallel round. Source files stay untouched. */
import {readFileSync} from 'node:fs';
const IMPORT_RE=/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)['"](\/[^'"\s]+\.js(?:\?[^'"\s]*)?)['"]/g;
function moduleGraph(entries){
  const seen=new Set(),queue=[...entries];
  while(queue.length){
    const url=queue.shift();if(seen.has(url))continue;seen.add(url);
    const file=path.join(out,url.split('?')[0]);if(!existsSync(file))continue;
    const text=readFileSync(file,'utf8');IMPORT_RE.lastIndex=0;let m;
    while((m=IMPORT_RE.exec(text)))queue.push(m[1]);
  }
  return [...seen].filter(u=>existsSync(path.join(out,u.split('?')[0])));
}
function addPreloadHints(htmlPath){
  const file=path.join(out,htmlPath);let html=readFileSync(file,'utf8');
  const entries=[...html.matchAll(/<script[^>]*type="module"[^>]*src="(\/[^"]+)"/g)].map(m=>m[1]);
  for(const m of html.matchAll(/import\('(\/[^']+)'\)/g))entries.push(m[1]);
  const urls=moduleGraph(entries);
  if(!urls.length||!html.includes('</head>'))return 0;
  html=html.replace('</head>',urls.map(u=>'<link rel="modulepreload" href="'+u+'">').join('')+'</head>');
  writeFileSync(file,html);return urls.length;
}
const hinted={};
for(const page of ['v8/index.html','v8/render.html','admin/index.html'])hinted[page]=addPreloadHints(page);
console.log('modulepreload hints: '+Object.entries(hinted).map(([p,n])=>p+' '+n).join(', '));
