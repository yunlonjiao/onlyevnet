import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

// The registry is the list of templates organizers can pick; read its imports so a new template is covered automatically.
const registry=readFileSync(new URL('../../v8/templates/registry.js',import.meta.url),'utf8');
const templates=[...registry.matchAll(/import \{template\d+\} from '\/v8\/templates\/(\d\d-[a-z0-9-]+)\.js/g)].map(m=>({id:m[1]}));

test.use({viewport:{width:1440,height:900}});

// Approved circle-collection entries are plain booths in the shared state. Every registered template
// must show them, so a new template cannot ship without supporting circle collection.
for(const template of templates){
  test(template.id+' shows a booth that came from circle collection',async({page})=>{
    const key='onlyevent-studio-v8:'+template.id+':collected:iframe';
    await page.goto('/v8/render.html');
    await page.evaluate(([k,id])=>localStorage.setItem(k,JSON.stringify({booths:[{id:'cb1',no:'Z99',name:'征集测试社团',logo:'',type:'原创',intro:'来自收集表单',products:[{id:'cp1',name:'征集测试制品',tag:'',price:'¥10',note:'',image:''}]}]})),[key,template.id]);
    await page.goto('/v8/?template='+template.id+'&project=collected');
    const frame=page.frameLocator('#liveFrame');
    await expect(frame.locator('[data-oe-field="eventName"]').first()).toBeAttached();
    await expect(frame.getByText('征集测试社团').first()).toBeAttached();
    await expect(frame.getByText('Z99').first()).toBeAttached();
  });
}
