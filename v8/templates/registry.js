export {listEventTypes,getEventType,getEventTypeForTemplate} from '/v8/templates/event-type-contract.js?v=8.40.94';
import {validateIpOnlyTemplateDefinition} from '/v8/templates/ip-only-core-contract.js?v=8.38.3';
import {template01} from '/v8/templates/01-ip-only.js?v=8.41.5';
import {template02} from '/v8/templates/02-scrapbook.js?v=8.41.4';

import {template03} from '/v8/templates/03-creator-market.js?v=8.42.0';
import {template04} from '/v8/templates/04-creator-catalogue.js?v=8.43.0';
import {template05} from '/v8/templates/05-live-poster.js?v=8.51.0';
import {template06} from '/v8/templates/06-tea-party.js?v=8.51.0';

export const DEFAULT_TEMPLATE_ID='01-ip-only';

const all=[template01,template02,template03,template04,template05,template06];
const contractErrors=all.filter(t=>t.eventType!=='creator-market').flatMap(template=>validateIpOnlyTemplateDefinition(template).map(message=>template.id+': '+message));
if(contractErrors.length)console.error('[OnlyEvent IP ONLY Core Contract]',contractErrors);

export const templateRegistry=Object.freeze(Object.fromEntries(
  all.map(template=>[template.id,Object.freeze({
    ...template,
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
