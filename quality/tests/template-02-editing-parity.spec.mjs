import {test,expect} from '@playwright/test';

const url='/v8/?template=02-scrapbook&project=template02-editing-parity';

async function open(page){
  await page.goto(url);
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('.trip-header')).toBeVisible();
  return frame;
}

async function patch(page,path,value){
  await page.evaluate(({path,value})=>{
    const iframe=document.querySelector('#liveFrame');
    iframe?.contentWindow?.postMessage({type:'OE_PATCH_FIELD',path,value},location.origin);
  },{path,value});
}

test.describe('Template 02 — Template 01 editing capability parity',()=>{
  test('core identity and hero fields remain directly editable',async({page})=>{
    const frame=await open(page);
    const fields=['eventName','tagline','date','location','edition','heroTitle1','heroTitle2','heroTitle3'];
    for(const field of fields){
      const el=frame.locator('[data-oe-field="'+field+'"]').first();
      await expect(el,'missing editable field '+field).toBeAttached();
      await expect(el).toHaveAttribute('contenteditable','true');
    }
    await expect(frame.locator('.kv')).toHaveAttribute('data-oe-image','heroImage');
  });

  test('mirrored date, location and venue stay synchronized from one source of truth',async({page})=>{
    const frame=await open(page);
    await expect(frame.locator('[data-oe-field="date"]')).toHaveCount(2);
    await expect(frame.locator('[data-oe-field="location"]')).toHaveCount(2);
    await expect(frame.locator('[data-oe-field="edition"]')).toHaveCount(2);

    await patch(page,'date','12.24 WED');
    await patch(page,'location','上海');
    await patch(page,'edition','上海新国际博览中心');

    for(const el of await frame.locator('[data-oe-field="date"]').all())await expect(el).toHaveText('12.24 WED');
    for(const el of await frame.locator('[data-oe-field="location"]').all())await expect(el).toHaveText('上海');
    for(const el of await frame.locator('[data-oe-field="edition"]').all())await expect(el).toHaveText('上海新国际博览中心');
  });

  test('lifecycle status mirrors react to organizer status edits',async({page})=>{
    const frame=await open(page);
    const status=frame.locator('[data-oe-lifecycle-status]');
    await expect(status).toBeVisible();

    await patch(page,'eventStatusMode','manual');
    await patch(page,'eventStatus','live');
    await expect(status).toHaveText('活动进行中');
    await expect(status).toHaveAttribute('data-status','live');

    await patch(page,'eventStatus','ended');
    await expect(status).toHaveText('活动已结束');
    await expect(status).toHaveAttribute('data-status','ended');
  });

  test('shared business collections expose editable item semantics',async({page})=>{
    const frame=await open(page);
    const expectations=[
      ['updates','[data-oe-mount="updates"] [data-oe-item="updates"]'],
      ['tickets','[data-oe-mount="tickets"] [data-oe-item="tickets"]'],
      ['activities','[data-oe-mount="featured-activities"] [data-oe-item="participation"]'],
      ['booths','[data-oe-mount="booths"] [data-oe-item="booths"]'],
      ['schedule','[data-oe-mount="schedule"] [data-oe-item="schedule"]'],
      ['guests','[data-oe-mount="guests"] [data-oe-item="guests"]'],
      ['guide','[data-oe-mount="guide-detail"] [data-oe-item="guide"]'],
      ['community','[data-oe-mount="community"] [data-oe-item="socialLinks"]']
    ];

    for(const [name,selector] of expectations){
      const item=frame.locator(selector).first();
      await expect(item,'missing editable collection semantics for '+name).toBeAttached();
      await expect(item).toHaveAttribute('data-oe-index',/\d+/);
    }
  });
});
