export function customPageSettingsHtml(page,preset,escapeHtml){
  return '<div class="item-fields">'+
   '<label><span>页面标题</span><input data-custom-page-field="title" value="'+escapeHtml(page.title||'')+'"></label>'+
   '<label><span>英文小标题</span><input data-custom-page-field="eyebrow" value="'+escapeHtml(page.eyebrow||'SPECIAL')+'"></label>'+
   '<label><span>页面介绍</span><textarea data-custom-page-field="intro" rows="4">'+escapeHtml(page.intro||'')+'</textarea></label>'+
   '</div><div class="reference-panel"><b>页面预设</b><p class="inspector-note">'+escapeHtml(preset.title)+' · 页面已按该内容类型配置展示结构。</p></div>'+
   '<div class="custom-page-settings-actions"><button type="button" class="danger ghost" data-delete-custom-page>删除此页面</button></div>';
}
