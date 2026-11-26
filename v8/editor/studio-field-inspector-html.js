export function taglineEditorHtml(value,escapeHtml){
  return '<label>活动介绍<textarea id="fieldInput" data-path="tagline">'+escapeHtml(value||'')+'</textarea></label>';
}

export function fieldEditorHtml(path,value,escapeHtml){
  return '<label>内容<textarea id="fieldInput" data-path="'+escapeHtml(path)+'">'+escapeHtml(value)+'</textarea></label>';
}
