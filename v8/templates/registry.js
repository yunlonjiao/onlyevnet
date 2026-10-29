export {listEventTypes,getEventType,getEventTypeForTemplate} from '/v8/templates/event-type-contract.js?v=8.40.94';
import {validateIpOnlyTemplateDefinition} from '/v8/templates/ip-only-core-contract.js?v=8.38.3';
import {template01} from '/v8/templates/01-ip-only.js?v=8.41.5';
import {template02} from '/v8/templates/02-scrapbook.js?v=8.41.4';

import {template03} from '/v8/templates/03-creator-market.js?v=8.42.0';
import {template04} from '/v8/templates/04-creator-catalogue.js?v=8.43.0';
import {template05} from '/v8/templates/05-live-poster.js?v=8.51.0';
import {template06} from '/v8/templates/06-band-live.js?v=8.51.0';
import {template07} from '/v8/templates/07-tea-party.js?v=8.51.0';
import {template08} from '/v8/templates/08-birthday.js?v=8.51.0';

export const DEFAULT_TEMPLATE_ID='01-ip-only';

const all=[template01,template02,template03,template04,template05,template06,template07,template08];
const contractErrors=all.filter(t=>t.eventType!=='creator-market').flatMap(template=>validateIpOnlyTemplateDefinition(template).map(message=>template.id+': '+message));
if(contractErrors.length)console.error('[OnlyEvent IP ONLY Core Contract]',contractErrors);

// Gallery sections, in display order. A template names its own group; the first four predate the field.
export const TEMPLATE_GROUPS=Object.freeze([
  Object.freeze({id:'ip-only',label:'IP ONLY 同好活动',text:'围绕一部作品或一个角色办的综合活动'}),
  Object.freeze({id:'creator',label:'创作者展',text:'同人创作展，社团和摊位很多的活动'}),
  Object.freeze({id:'stage',label:'舞台演出',text:'以出演和节目表为主的演出'}),
  Object.freeze({id:'small',label:'小型活动',text:'几十人的聚会，一个页面讲清楚'})
]);
const GROUP_BY_ID={'01-ip-only':'ip-only','02-scrapbook':'ip-only','03-creator-market':'creator','04-creator-catalogue':'creator'};

export const templateRegistry=Object.freeze(Object.fromEntries(
  all.map(template=>[template.id,Object.freeze({
    ...template,
    group:template.group||GROUP_BY_ID[template.id]||'ip-only',
    category:template.category||'单 IP / 同好活动',
    description:template.description||'单 IP / ONLY 活动模板。',
    engine:template.engine||'onlyevent-studio-v8',
    renderer:template.renderer||template.id
  })])
));

export function getTemplate(id=DEFAULT_TEMPLATE_ID){
  return templateRegistry[id]||templateRegistry[DEFAULT_TEMPLATE_ID];
}

export function listTemplates(){
  return all.map(x=>templateRegistry[x.id]);
}
