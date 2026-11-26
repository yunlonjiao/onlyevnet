export function participationInspectorFields(item){
 const preset=item?.preset||'custom';
 const common={
  title:['title','活动名称'],text:['text','一句话简介'],detail:['detail','活动内容'],
  mode:['participationMode','参与方式'],requirements:['requirements','参加要求'],
  rules:['rules','活动规则'],url:['url','报名链接'],setlist:['setlist','节目']
 };
 const map={
  stage:[common.title,common.text,common.detail,common.mode,common.rules,common.url,common.setlist],
  guest:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules,common.url,common.setlist],
  signing:[common.title,common.text,common.detail,common.mode,common.requirements,common.url,common.setlist],
  live:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules,common.url,common.setlist],
  randomDance:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  stamp:[common.title,common.text,common.detail,common.mode,common.rules],
  game:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  photo:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  cosplay:[common.title,common.text,common.detail,common.mode,common.requirements,common.rules],
  itasha:[common.title,common.text,common.detail,common.rules],
  support:[common.title,common.text,common.detail,common.mode,common.rules]
 };
 return map[preset]||[common.title,common.text,common.detail,common.mode,common.requirements,common.rules,common.url,common.setlist];
}
