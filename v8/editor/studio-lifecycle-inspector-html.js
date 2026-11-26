export function lifecycleInspectorHtml(state,escapeHtml){
  const mode=String(state.eventStatusMode||'auto'),status=String(state.eventStatus||'upcoming');
  return '<div class="lifecycle-grid">'+
   '<button type="button" data-event-status-mode="auto" class="'+(mode==='auto'?'active':'')+'"><b>自动判断</b><small>根据活动开始 / 结束时间自动切换</small></button>'+
   '<button type="button" data-event-status="upcoming" class="'+(mode==='manual'&&status==='upcoming'?'active':'')+'"><b>手动 · 未开始</b><small>强制显示未开始状态</small></button>'+
   '<button type="button" data-event-status="live" class="'+(mode==='manual'&&status==='live'?'active':'')+'"><b>手动 · 进行中</b><small>强制显示进行中状态</small></button>'+
   '<button type="button" data-event-status="ended" class="'+(mode==='manual'&&status==='ended'?'active':'')+'"><b>手动 · 已结束</b><small>强制隐藏失效购票入口</small></button>'+
 '</div><p class="inspector-note">推荐使用自动判断。只在需要提前切换或特殊运营时使用手动状态。</p>';
}
