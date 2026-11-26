export function ticketSettingsInspectorHtml(state,escapeHtml){
  return '<div class="item-fields">'+
   '<label><span>按钮文字</span><input id="ticketLinkLabelInput" value="'+escapeHtml(state.ticketLinkLabel||'前往官方售票平台')+'"></label>'+
   '<label><span>外部购票链接</span><input id="ticketUrlInput" type="url" value="'+escapeHtml(state.ticketUrl||'')+'" placeholder="https://"></label>'+
   '</div><div class="row"><button id="testTicketUrl" type="button">打开购票平台 ↗</button></div><p class="inspector-note">这是整场活动统一的购票入口，不需要在每个票种里重复填写。</p>';
}
