export function pageNavHtml(items,escapeHtml){
  return items.map(x=>x.collection
    ?'<button type="button" data-page-content-manager="'+x.collection+'"><span>'+escapeHtml(x.label)+'</span><b data-content-count="'+x.collection+'">0</b></button>'
    :'<button type="button" data-page-tool="'+x.tool+'"><span>'+escapeHtml(x.label)+'</span></button>'
  ).join('');
}
