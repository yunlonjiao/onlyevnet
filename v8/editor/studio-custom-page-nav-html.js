export function customPageNavHtml(itemCount){
  return '<button type="button" data-custom-page-nav="settings"><span>页面设置</span></button><button type="button" data-custom-page-nav="items"><span>展示内容</span><b>'+String(itemCount)+'</b></button>';
}
