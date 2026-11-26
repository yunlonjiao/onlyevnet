export function itemInspectorHeadHtml(meta,index,count,escapeHtml){
  return '<div class="item-inspector-head"><div><span>'+escapeHtml(meta.title)+'</span><b>'+String(index+1).padStart(2,'0')+' / '+String(count).padStart(2,'0')+'</b></div><div class="item-tools"><button data-op="up" '+(index===0?'disabled':'')+'>↑</button><button data-op="down" '+(index===count-1?'disabled':'')+'>↓</button></div></div>';
}

export function itemFieldsHtml(fields,item,escapeHtml,isLong){
  return fields.map(([key,label])=>'<label><span>'+label+'</span>'+(isLong(key)?'<textarea data-key="'+key+'" rows="1">'+escapeHtml(item[key]||'')+'</textarea>':'<input data-key="'+key+'" value="'+escapeHtml(item[key]??'')+'" '+(key==='tone'?'type="color"':'')+'>')+'</label>').join('');
}
