import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const cloud=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),repo=path.resolve(cloud,'..');
const read=p=>fs.readFileSync(path.join(cloud,p),'utf8');
const worker=read('src/worker.js'),schema=read('schema.sql'),publisher=fs.readFileSync(path.join(repo,'v8/publisher.js'),'utf8');
let failed=0;
const check=(ok,msg)=>{console.log((ok?'✓ ':'✗ ')+msg);if(!ok)failed++};
check(/const APP_VERSION='7\.\d+\.\d+'/.test(worker),'Worker declares a version');
for(const t of ['users','sessions','account_recovery','projects','sites','project_state','site_versions','site_aliases','project_sites','project_media','rate_limits'])check(schema.includes('CREATE TABLE IF NOT EXISTS '+t),'schema table '+t);
check(schema.includes('project_id TEXT PRIMARY KEY')&&schema.includes('site_id TEXT NOT NULL UNIQUE'),'one project <-> one site constraints');
check(worker.includes("!['jpg','jpeg','png','webp','gif'].includes(ext)"),'SVG upload is rejected');
check(worker.includes('这个网站不属于当前活动项目'),'site ownership checks');
check(worker.includes('site_versions')&&worker.includes('rollbackSite'),'online version history / rollback');
check(worker.includes('site_aliases')&&worker.includes('301'),'old slug redirect support');
check(worker.includes('rateLimit(env,'),'auth and publish endpoints are rate limited');
check(worker.includes("path.startsWith('/admin/')")&&worker.includes('no-store'),'admin assets disable stale cache');
check(/location\.hostname/.test(publisher)&&publisher.includes('onlyevent.cn'),'editor uses the same origin on onlyevent.cn');
// The generated front end must be complete before anything is deployed.
const web=p=>fs.existsSync(path.join(cloud,'web',p));
for(const p of ['index.html','robots.txt','admin/index.html','admin/app.js','v8/index.html','v8/render.html','v8/publisher.js','v8/templates/registry.js','v8/renderer/main.js'])check(web(p),'cloud/web/'+p);
if(failed){console.error('\n'+failed+' checks failed.');process.exit(1)}
console.log('\nAll checks passed.');
