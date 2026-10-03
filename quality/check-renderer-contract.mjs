import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const main=fs.readFileSync(path.join(root,'v8/renderer/main.js'),'utf8');
const context=fs.readFileSync(path.join(root,'v8/renderer/context.js'),'utf8');

const failures=[];
for(const token of ['qs:$','qsa:qa','escapeHtml:esc','getState:()=>state','getMode:()=>mode']){
  if(!main.includes(token))failures.push('rendererContext missing '+token);
}
if(!main.includes('createCollections(rendererContext)'))failures.push('collections must use rendererContext');
if(!main.includes('validateRendererContext'))failures.push('main must validate rendererContext');
for(const key of ["'qs'","'qsa'","'escapeHtml'","'getState'","'getMode'"]){
  if(!context.includes(key))failures.push('context contract missing '+key);
}
if(failures.length){
  console.error('Renderer contract check failed:\n- '+failures.join('\n- '));
  process.exit(1);
}
console.log('Renderer contract check passed.');
