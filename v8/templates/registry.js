import {template01} from '/v8/templates/01-ip-only.js?v=8.34.60';

export const DEFAULT_TEMPLATE_ID='01-ip-only';

export const templateRegistry=Object.freeze({
  [template01.id]:Object.freeze({
    ...template01,
    version:'1.0.0',
    category:'单 IP / 同好活动',
    description:'适合几百到几千人的单 IP、ONLY、同好主题活动。包含票务、摊位与制品、活动日程、嘉宾、观展指南、社群、赞助、自定义页面与移动端游客站。',
    engine:'onlyevent-studio-v8',
    renderer:'01-ip-only'
  })
});

export function getTemplate(id=DEFAULT_TEMPLATE_ID){
  return templateRegistry[id]||templateRegistry[DEFAULT_TEMPLATE_ID];
}

export function listTemplates(){
  return Object.values(templateRegistry);
}
