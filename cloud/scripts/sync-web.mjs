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
