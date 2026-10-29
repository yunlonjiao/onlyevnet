import {test,expect} from '@playwright/test';

test.use({viewport:{width:1440,height:900}});

const ids=['01-ip-only','02-scrapbook','03-creator-market','04-creator-catalogue','05-live-poster','06-band-live','07-tea-party','08-birthday'];

// Every template must let the organizer do the same things on the page: type into visible copy,
// click a card to open it in the side panel, click an image to replace it. 01 and 02 set the bar.
async function openEditor(page,id){
  await page.goto('/v8/?template='+id+'&project=parity-'+id);
  const frame=page.frameLocator('#liveFrame');
  await expect(frame.locator('[data-oe-field="eventName"]').first()).toBeAttached();
  await page.waitForTimeout(1500);
  await page.evaluate(()=>{const d=document.querySelector('#liveFrame').contentDocument;d.querySelectorAll('#loader,.loader').forEach(e=>e.remove())});
  return frame;
}
async function showPage(page,name){
  return page.evaluate(n=>{
    const d=document.querySelector('#liveFrame').contentDocument;
    const el=[...d.querySelectorAll('[data-page-link="'+n+'"]')].find(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0});
    if(!el)return false;el.click();return true;
  },name);
}
const saved=(page,id)=>page.evaluate(id=>{const k=Object.keys(localStorage).find(x=>x.startsWith('onlyevent-studio-v8:'+id+':parity-'));return JSON.parse(localStorage.getItem(k)||'{}')},id);

async function typeInto(page,locator,text){
  await locator.evaluate(el=>el.scrollIntoView({block:'center'}));
  await locator.click({force:true});
  await page.keyboard.press('Control+A');
  await page.keyboard.type(text);
}

// Creator events (03, 04: Comiket and CP style) have circles and booths, not guests or a programme, so they have no such pages.
const withGuestsAndProgramme=id=>!['03-creator-market','04-creator-catalogue'].includes(id);

for(const id of ids){
  test(id+' can be edited the same way as 01 and 02',async({page})=>{
    const frame=await openEditor(page,id);

    // 1. visible copy is editable in place
    await typeInto(page,frame.locator('[data-oe-field="eventName"]').first(),'奇偶测试');
    await typeInto(page,frame.locator('[data-oe-field="tickets.0.name"]').first(),'票名已改');
    await typeInto(page,frame.locator('[data-oe-field="updates.0.title"]').first(),'公告已改');
    await expect.poll(async()=>{const s=await saved(page,id);return [s.eventName,s.tickets?.[0]?.name,s.updates?.[0]?.title].join('|')}).toBe('奇偶测试|票名已改|公告已改');

    // 2. clicking a card opens it in the side panel
    const ticket=frame.locator('[data-oe-item="tickets"]').first();
    await ticket.evaluate(el=>el.scrollIntoView({block:'center'}));
    await ticket.evaluate(el=>el.click());
    await expect(page.locator('#inspector [data-key="name"]').first()).toBeVisible();
    await expect(page.locator('#inspector [data-key="name"]').first()).toHaveValue('票名已改');

    // 3. clicking the hero image opens the image controls
    const hero=frame.locator('[data-oe-image="heroImage"]').first();
    await hero.evaluate(el=>el.scrollIntoView({block:'center'}));
    await hero.click({position:{x:14,y:14},force:true}); // a corner of the picture, away from the title and text
    await expect(page.locator('#inspector [data-hero-image],#inspector #replaceImage,#inspector [data-media-path]').first()).toBeVisible();

    if(!withGuestsAndProgramme(id)){
      // the booth page is their equivalent: a card opens in the side panel
      expect(await showPage(page,'booths')).toBe(true);
      await page.waitForTimeout(500);
      await frame.locator('[data-oe-item="booths"]:visible').first().evaluate(el=>el.click());
      await expect(page.locator('#inspector [data-key="name"]').first()).toBeVisible();
      return;
    }
    // 4. the guest page: edit a name in place, open a card
    expect(await showPage(page,'guests')).toBe(true);
    await page.waitForTimeout(500);
    await typeInto(page,frame.locator('[data-oe-field="guests.0.name"]').first(),'嘉宾已改');
    const guest=frame.locator('[data-oe-item="guests"]:visible').first();
    await guest.evaluate(el=>el.click());
    await expect(page.locator('#inspector [data-key="name"]').first()).toHaveValue('嘉宾已改');

    // 5. the activity page: a card opens in the side panel
    expect(await showPage(page,'activities')).toBe(true);
    await page.waitForTimeout(500);
    const row=frame.locator('[data-oe-item="schedule"]:visible,[data-oe-item="participation"]:visible').first();
    // 01 and 02 only open schedule rows through the timetable; every other template must offer the click.
    if(await row.count()||!['01-ip-only','02-scrapbook'].includes(id)){
      await row.evaluate(el=>el.click());
      await expect(page.locator('#inspector [data-key="title"]').first()).toBeVisible();
    }
  });
}
