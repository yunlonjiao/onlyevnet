export function addressInspectorHtml(state,escapeHtml){
  return '<div class="item-fields">'+
  '<label><span>活动开始时间</span><input type="datetime-local" data-sync-path="eventStartDateTime" value="'+escapeHtml(state.eventStartDateTime||'')+'"></label>'+
  '<label><span>活动结束时间</span><input type="datetime-local" data-sync-path="eventEndDateTime" value="'+escapeHtml(state.eventEndDateTime||'')+'"></label>'+
  '<label><span>活动日期</span><input data-sync-path="date" value="'+escapeHtml(state.date||'')+'"></label>'+ 
  '<label><span>举办城市</span><input data-sync-path="location" value="'+escapeHtml(state.location||'')+'"></label>'+ 
  '<label><span>场馆地址</span><input data-sync-path="edition" value="'+escapeHtml(state.edition||'')+'"></label>'+
  '<label><span>导航链接</span><input type="url" data-sync-path="navigationUrl" value="'+escapeHtml(state.navigationUrl||'')+'" placeholder="https://"></label>'+
 '</div><div class="row"><button id="testNavigation" type="button">打开导航 ↗</button></div><p class="inspector-note">活动状态默认自动判断：开始前为未开始，活动时间内为进行中，超过结束时间后自动变为已结束。</p>';
}
