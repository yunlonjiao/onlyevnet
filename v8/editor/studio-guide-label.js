export function guideLabelFor(templateId){
  const id=String(templateId||'');
  if(id.startsWith('03')||id.startsWith('04'))return '创作展指南';
  if(id.startsWith('05')||id.startsWith('06'))return '观演秩序';
  if(id.startsWith('07')||id.startsWith('08'))return '活动须知';
  return '观展指南';
}
