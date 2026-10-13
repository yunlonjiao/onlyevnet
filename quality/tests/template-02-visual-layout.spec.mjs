import {test,expect} from '@playwright/test';

const url='/v8/?template=02-scrapbook&project=template02-visual-layout';

test.describe('Template 02 — visual layout regression',()=>{
  test('news information starts near the top instead of collapsing to the bottom',async({page})=>{
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(url);
    const frame=page.frameLocator('#liveFrame');
    const section=frame.locator('.trip-news');
    const columns=frame.locator('.trip-news-columns');
    const firstUpdate=frame.locator('.scrap-update').first();

    await expect(section).toBeVisible();
    await expect(firstUpdate).toBeVisible();

    const boxes=await Promise.all([section.boundingBox(),columns.boundingBox(),firstUpdate.boundingBox()]);
    const [s,c,u]=boxes;
    expect(s&&c&&u).toBeTruthy();
    expect(c.y-s.y).toBeLessThan(120);
    expect(u.y-s.y).toBeLessThan(190);
    expect(s.height).toBeLessThan(430);
  });

  test('booth cards never squeeze text outside their own width',async({page})=>{
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(url);
    const frame=page.frameLocator('#liveFrame');

    await page.locator('.page-nav [data-page="booths"]').click();
    const cards=frame.locator('.scrap-booth');
    await expect(cards.first()).toBeVisible();

    const count=Math.min(await cards.count(),6);
    for(let i=0;i<count;i++){
      const card=cards.nth(i);
      const overflow=await card.evaluate(el=>({
        own:el.scrollWidth>el.clientWidth+1,
        title:(()=>{
          const h=el.querySelector('h3');
          return h?h.scrollWidth>h.clientWidth+1:false;
        })(),
        body:(()=>{
          const p=el.querySelector('p');
          return p?p.scrollWidth>p.clientWidth+1:false;
        })()
      }));
      expect(overflow).toEqual({own:false,title:false,body:false});
    }
  });

  test('medium-width booth directory falls back before cards become cramped',async({page})=>{
    await page.setViewportSize({width:1024,height:900});
    await page.goto(url);
    const frame=page.frameLocator('#liveFrame');

    await page.locator('.page-nav [data-page="booths"]').click();
    const cards=frame.locator('.scrap-booth');
    await expect(cards.first()).toBeVisible();

    if(await cards.count()>1){
      const a=await cards.nth(0).boundingBox();
      const b=await cards.nth(1).boundingBox();
      expect(a&&b).toBeTruthy();
      expect(Math.abs(a.x-b.x)).toBeLessThan(4);
      expect(b.y).toBeGreaterThan(a.y+a.height-4);
    }
  });
});
