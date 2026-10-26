import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const origin='http://127.0.0.1:4173';
await mkdir('../admin/covers',{recursive:true});
for(const [id,file] of [['01-ip-only','template-01.png'],['02-scrapbook','template-02.png'],['03-creator-market','template-03.png']]){
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 await page.goto(origin+'/v8/?template='+id+'&project=template-cover-'+id,{waitUntil:'domcontentloaded'});
 const frame=page.frameLocator('#liveFrame');
 await frame.locator('.hero').waitFor({state:'visible',timeout:30000});
 await page.locator('#previewBtn').click();
 const loader=frame.locator('#loader');
 // Explicitly skip the introduction: cover must depict the website, not its loading screen.
 await frame.locator('.gate').click();
 await loader.evaluate(el=>{el.classList.add('hide');});
 await frame.locator('.hero').waitFor({state:'visible',timeout:12000});
 await page.waitForTimeout(450);
 const hero=frame.locator('.hero').first();
 await hero.screenshot({path:'../admin/covers/'+file,animations:'disabled',timeout:20000});
 await page.close();
}
await browser.close();
