import {test,expect} from '@playwright/test';

test('creator fair has independent empty default model',async({page})=>{
 await page.goto('/v8/');
 const result=await page.evaluate(async()=>{
  const m=await import('/v8/templates/creator-fair-core.js');
  const state=m.createCreatorFairDefaults();
  return {type:state.eventType,modules:state.modules,errors:m.validateCreatorFairState(state)};
 });
 expect(result.type).toBe('creator-market');
 expect(result.modules.creators).toBe(true);
 expect(result.modules.products).toBe(true);
 expect(result.errors).toEqual([]);
});

test('creator fair validates links and filters creator/product names and tags',async({page})=>{
 await page.goto('/v8/');
 const value=await page.evaluate(async()=>{
  const m=await import('/v8/templates/creator-fair-core.js');
  const s=m.createCreatorFairDefaults();
  s.creators=[{id:'c1',name:'浮光工房',tags:['插画','原创']}];
  s.booths=[{id:'b1',creatorId:'c1',name:'A01',tags:['原创']}];
  s.products=[{id:'p1',creatorId:'c1',boothId:'b1',name:'星空画集',tags:['画集','原创']},{id:'p2',creatorId:'unknown',boothId:'b1',name:'测试'}];
  return {
   invalid:m.validateCreatorFairState(s),
   search:m.findCreatorFairItems(s,{query:'星空',kind:'product'}).map(x=>x.id),
   tagged:m.findCreatorFairItems(s,{tags:['原创']}).map(x=>x.id)
  };
 });
 expect(value.invalid.some(x=>x.includes('unknown creatorId'))).toBe(true);
 expect(value.search).toEqual(['p1']);
 expect(value.tagged).toEqual(['c1','b1','p1']);
});
