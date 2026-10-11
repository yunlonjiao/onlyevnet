import {template01} from '/v8/templates/01-ip-only.js?v=8.36.0';
import {template02} from '/v8/templates/02-scrapbook.js?v=8.36.0';
import {template03} from '/v8/templates/03-school-festival.js?v=8.36.0';
import {template04} from '/v8/templates/04-museum-editorial.js?v=8.36.0';
import {template05} from '/v8/templates/05-live-poster.js?v=8.36.0';
import {template06} from '/v8/templates/06-expo-catalogue.js?v=8.36.0';
import {template07} from '/v8/templates/07-immersive-character.js?v=8.36.0';

export const DEFAULT_TEMPLATE_ID='01-ip-only';

const all=[template01,template02,template03,template04,template05,template06,template07];

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
