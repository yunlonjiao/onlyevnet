import {test,expect} from '@playwright/test';
async function exported(page,id){
 await page.goto('/v8/?template='+id);
 await expect(page.frameLocator('#liveFrame').locator('.hero')).toBeVisible();
 return page.evaluate(()=>new Promise(resolve=>{
  const receive=e=>{if(e.data?.type==='OE_EXPORT_HTML_RESULT'){removeEventListener('message',receive);resolve(e.data.html)}};
  addEventListener('message',receive);
  document.querySelector('#liveFrame').contentWindow.postMessage({type:'OE_EXPORT_HTML'},location.origin);
 }));
}
test('04 catalogue boundaries and resize stay usable',async({page,browser})=>{
 const html=await exported(page,'04-creator-catalogue');
 const visitor=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 await visitor.setContent(html);await visitor.locator('#skip').click();
 const prev=visitor.getByRole('button',{name:'上一页',exact:true}),next=visitor.getByRole('button',{name:'下一页',exact:true});
 await expect(prev).toBeDisabled();await next.click();
 await visitor.getByRole('button',{name:/打卡页/}).click();
 await expect(visitor.locator('.cb-kind-rally')).toBeVisible();await expect(next).toBeDisabled();
 await visitor.setViewportSize({width:390,height:844});
 await expect(visitor.locator('.cb-book.is-single .cb-kind-rally')).toBeVisible();
 await expect(visitor.locator('.cb-blank')).toHaveCount(0);await expect(next).toBeDisabled();
 await prev.click();await expect(next).toBeEnabled();
 await visitor.close();
});
