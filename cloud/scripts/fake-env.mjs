/* In-memory Worker bindings for tests: node:sqlite stands in for D1 (same schema.sql),
   a Map for the R2 bucket. Used by api-test.mjs and the quality/ browser tests. */
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';

export function createD1(){
  const db=new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../schema.sql',import.meta.url),'utf8'));
  const statement=(sql,args=[])=>({
    bind:(...next)=>statement(sql,next),
    first:async()=>db.prepare(sql).get(...args)??null,
    all:async()=>({results:db.prepare(sql).all(...args)}),
    run:async()=>{db.prepare(sql).run(...args);return {success:true}}
  });
  return {
    prepare:sql=>statement(sql),
    batch:async list=>{db.exec('BEGIN');try{for(const s of list)await s.run();db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}}
  };
}

export function createR2(){
  const objects=new Map();
  return {
    objects,
    put:async(key,value,opts={})=>{const bytes=typeof value==='string'?new TextEncoder().encode(value):new Uint8Array(value);objects.set(key,{bytes,opts})},
    get:async key=>{const o=objects.get(key);if(!o)return null;return {body:o.bytes,arrayBuffer:async()=>o.bytes.buffer.slice(0),writeHttpMetadata:h=>{if(o.opts.httpMetadata?.contentType)h.set('content-type',o.opts.httpMetadata.contentType)}}},
    delete:async key=>{objects.delete(key)}
  };
}

export function createEnv(){
  return {
    DB:createD1(),SITES:createR2(),
    ASSETS:{fetch:async()=>new Response('asset',{status:200})},
    BASE_DOMAIN:'onlyevent.cn',SESSION_DAYS:'30',INACTIVE_DAYS:'60',
    ALLOWED_ORIGINS:'https://onlyevent-preview.pages.dev,https://*.onlyevent-preview.pages.dev'
  };
}
