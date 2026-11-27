export function extraInspectorHtml(collection,index,item,state,{esc,guideLabelText,customPageKey,guestPlatformName}){
 if(collection==='featuredActivities'){
   const options=(state.participation||[]).map(a=>'<option value="'+esc(a.id)+'" '+(a.id===item.participationId?'selected':'')+'>'+esc(a.title||'活动')+'</option>').join('');
   const linkedIndex=(state.participation||[]).findIndex(a=>a.id===item.participationId);
   const image=item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
   return '<div class="reference-panel featured-slot-panel"><b>精选活动 '+String(index+1).padStart(2,'0')+'</b>'+
     '<div class="item-media featured-slot-media"><span>首页专用图片</span><div class="item-media-row">'+image+'<div><button type="button" data-media-path="featuredActivities.'+index+'.image">选择 / 裁剪</button>'+(item.image?'<button type="button" data-remove-media="featuredActivities.'+index+'.image" class="ghost">移除</button>':'')+'</div></div><small>只用于首页活动精选，不影响活动详情页。</small></div>'+
     '<label><span>选择已有活动</span><select data-featured-activity-select><option value="">未选择</option>'+options+'</select></label><p class="inspector-note">这里只决定首页展示哪一个活动，活动内容仍在「活动」里统一维护。</p>'+(linkedIndex>=0?'<button type="button" class="sidebar-content-row" data-edit-featured-source="'+linkedIndex+'"><span class="sidebar-content-copy"><b>编辑</b><small>'+esc((state.participation||[])[linkedIndex]?.title||'活动')+'</small></span><i>›</i></button>':'')+'</div>';
 }
 if(collection==='schedule'){
   const guests=state.guests||[],plans=state.participation||[];
   return '<div class="reference-panel"><b>关联活动企划</b><label><span>对应活动</span><select data-schedule-plan><option value="">不关联</option>'+plans.map(p=>'<option value="'+esc(p.id)+'" '+(item.participationId===p.id?'selected':'')+'>'+esc(p.title||'活动')+'</option>').join('')+'</select></label></div>'+ 
     '<div class="reference-panel"><b>关联嘉宾</b><div class="reference-list"><span>选择出席这条日程的嘉宾</span>'+guests.map(g=>'<label class="check-row"><input type="checkbox" data-guest-ref="'+esc(g.id)+'" '+((item.guestIds||[]).includes(g.id)?'checked':'')+'><span>'+esc(g.name)+'</span></label>').join('')+'</div></div>';
 }
 if(collection==='guests'){
   const guestTypes=[['person','个人'],['duo','双人 / 小组合'],['band','乐队'],['group','团体'],['official','官方团队']];
   const plans=state.participation||[];
   const schedule=state.schedule||[];
   const socialLinks=Array.isArray(item.socialLinks)?item.socialLinks:[];
   const image=item.image?'<img src="'+esc(item.image)+'" alt="">':'<div class="item-media-empty">＋</div>';
   const socialPanel='<div class="reference-panel guest-social-editor"><div class="guest-social-editor-head"><b>个人平台</b><button type="button" data-guest-social-add>＋ 添加平台</button></div>'+
     '<div class="guest-social-editor-list">'+(socialLinks.length?socialLinks.map((link,j)=>'<div class="guest-social-editor-row"><span class="guest-platform-detected">'+esc(guestPlatformName(link.url))+'</span><input data-guest-social-url="'+j+'" value="'+esc(link.url||'')+'" placeholder="粘贴个人主页地址"><button type="button" class="ghost" data-guest-social-remove="'+j+'">×</button></div>').join(''):'<p class="inspector-note">添加个人主页地址后会自动识别平台；一个平台一条地址。</p>')+'</div></div>';
   return '<div class="item-media"><span>嘉宾宣传图</span><div class="item-media-row">'+image+'<div><button data-media-path="guests.'+index+'.image">选择 / 裁剪</button>'+(item.image?'<button data-remove-media="guests.'+index+'.image" class="ghost">移除</button>':'')+'</div></div></div>'+
     socialPanel+
     '<div class="reference-panel guest-link-panel"><b>关联活动</b><div class="reference-list"><span>活动企划</span>'+(plans.length?plans.map(a=>'<label class="check-row"><input type="checkbox" data-guest-plan-ref="'+esc(a.id)+'" '+((a.guestIds||[]).includes(item.id)?'checked':'')+'><span>'+esc(a.title||'活动')+'</span></label>').join(''):'<span class="muted">暂无活动企划</span>')+'</div><div class="reference-list"><span>当天日程</span>'+(schedule.length?schedule.map(a=>'<label class="check-row"><input type="checkbox" data-guest-schedule-ref="'+esc(a.id)+'" '+((a.guestIds||[]).includes(item.id)?'checked':'')+'><span>'+esc((a.time?a.time+' ':'')+(a.title||'日程'))+'</span></label>').join(''):'<span class="muted">暂无当天日程</span>')+'</div></div>';
 }
 if(collection==='booths'){
   const products=item.products||[],logo=item.logo?'<img src="'+esc(item.logo)+'" alt="">':'<div class="item-media-empty">＋</div>';
   return '<div class="item-media"><span>社团 Logo（可选）</span><div class="item-media-row">'+logo+'<div><button data-media-path="booths.'+index+'.logo">选择 Logo</button>'+(item.logo?'<button data-remove-media="booths.'+index+'.logo" class="ghost">移除</button>':'')+'</div></div></div>'+
     '<div class="product-editor"><div class="product-editor-head"><b>制品管理</b></div>'+
     '<button type="button" class="sidebar-content-row product-manager-entry" data-booth-products-manage="'+index+'"><span class="sidebar-content-copy"><b>制品列表</b></span></button></div>';
 }
 if(collection==='explore'){
   const pages=[['booths','摊位'],['activities','活动'],['guests','嘉宾'],['guide',guideLabelText()],...(state.customPages||[]).map(p=>[customPageKey(p.id),p.title||'专题页面'])];
   return '<div class="reference-panel explore-link-settings"><b>跳转目标</b>'+
     '<label><span>一级页面</span><select data-explore-page>'+pages.map(x=>'<option value="'+x[0]+'" '+(item.target===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label></div>';
 }
 if(collection==='participation'){
   const guests=state.guests||[],linked=(state.schedule||[]).filter(x=>x.participationId===item.id),type=item.activityType||'general',preset=item.preset||'custom';
   const typeOptions=[['general','普通活动'],['interactive','互动活动'],['guest','嘉宾活动'],['live','乐队Live'],['signing','嘉宾签售'],['venue','场地活动']];
   const typePicker=preset==='custom'
     ?'<div class="reference-panel"><b>活动类型</b><select data-activity-type>'+typeOptions.map(([k,label])=>'<option value="'+k+'" '+(type===k?'selected':'')+'>'+label+'</option>').join('')+'</select></div>'
     :'';
   const specialized=preset==='live'
     ?'<div class="reference-panel activity-special-panel"><b>歌单</b><label><span>每行一首</span><textarea rows="5" data-activity-extra-key="setlist">'+esc(item.setlist||'')+'</textarea></label></div>'
     :preset==='signing'
     ?'<div class="reference-panel activity-special-panel"><b>签售规则</b><textarea rows="5" data-activity-extra-key="signingRules">'+esc(item.signingRules||'')+'</textarea></div>'
     :['stamp','cosplay','itasha','support'].includes(preset)
     ?'<div class="reference-panel activity-special-panel"><b>开放信息</b><label><span>地点</span><input data-activity-extra-key="activityLocation" value="'+esc(item.activityLocation||'')+'"></label><label><span>开放说明</span><input data-activity-extra-key="availabilityNote" value="'+esc(item.availabilityNote||'开展期间开放')+'"></label></div>'
     :'';
   const needsGuests=['stage','guest','signing','live','photo'].includes(preset)||preset==='custom';
   const guestPanel=needsGuests?'<div class="reference-panel"><b>关联嘉宾</b><div class="reference-list">'+guests.map(g=>'<label class="check-row"><input type="checkbox" data-guest-ref="'+esc(g.id)+'" '+((item.guestIds||[]).includes(g.id)?'checked':'')+'><span>'+esc(g.name)+'</span></label>').join('')+'</div></div>':'';
   const needsSchedule=!['stamp','cosplay','itasha','support'].includes(preset);
   const schedulePanel=needsSchedule?'<div class="reference-panel"><b>关联日程</b><div class="linked-summary">'+(linked.length?linked.map(x=>'<span>'+esc((x.time?x.time+' ':'')+(x.title||'日程'))+'</span>').join(''):'<span>暂未关联日程</span>')+'</div></div>':'';
   return typePicker+specialized+guestPanel+schedulePanel;
 }
 if(collection==='updates'){
   const targets=[['top','首页顶部'],['tickets','票务'],['activities','活动'],['map-home','场地图'],['schedule-home','当天日程'],['guests','嘉宾'],['guide',guideLabelText()],['community','社群']];
   return '<div class="reference-panel"><b>跳转位置</b><label><span>点击后前往</span><select data-ref="target">'+targets.map(x=>'<option value="'+x[0]+'" '+(item.target===x[0]?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label></div>';
 }
 return '';
}
