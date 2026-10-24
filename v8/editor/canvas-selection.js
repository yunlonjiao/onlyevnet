/* Shared canvas selection controller. No template-specific styling or editor UI. */
export function bindCanvasSelection({frame,getPreview,onSelectRecord,onSelectRegion,onFocusField,onCommitField,regions,fields}){
  const attach=()=>{
    let doc;
    try{doc=frame.contentDocument;}catch{return;}
    if(!doc||doc.documentElement.dataset.oeSelectionBound==='1')return;
    doc.documentElement.dataset.oeSelectionBound='1';
    const clear=()=>{doc.querySelectorAll('.oe-selected-edit-target').forEach(el=>el.classList.remove('oe-selected-edit-target'));};
    const mark=el=>{clear();if(el){el.classList.add('oe-selected-edit-target');}};
    for(const [selector,path] of fields){
      for(const el of doc.querySelectorAll(selector)){
        el.contentEditable=getPreview()?'false':'true';
        el.dataset.marketEditPath=path;el.spellcheck=false;
        el.setAttribute('role','textbox');
        el.addEventListener('focus',()=>{if(getPreview())return;onFocusField(path);mark(el)});
        el.addEventListener('blur',()=>{if(getPreview())return;onCommitField(path,el.textContent.trim())});
        el.addEventListener('keydown',e=>{if(e.key==='Enter'&&path!=='description'){e.preventDefault();el.blur()}});
      }
    }
    doc.addEventListener('click',e=>{
      if(getPreview())return;
      const edit=e.target.closest('[data-market-edit-path]');
      if(edit){mark(edit);return;}
      const record=e.target.closest('[data-market-record]');
      if(record){e.preventDefault();onSelectRecord(record.dataset.marketRecord,record.dataset.marketRecordId);mark(record);return;}
      let node=e.target.closest('[id]');
      while(node&&!regions[node.id])node=node.parentElement;
      if(!node)return;
      onSelectRegion(regions[node.id]);mark(node);
    });
    const style=doc.createElement('style');style.dataset.oeSelectionStyle='1';
    style.textContent='.oe-selected-edit-target,[data-market-edit-path]:focus{outline:3px solid #e6bc22;outline-offset:4px}[data-market-edit-path]:hover{outline:2px dashed #e6bc22;outline-offset:3px}';
    doc.head.appendChild(style);
  };
  frame.addEventListener('load',attach);
  try{if(frame.contentDocument?.readyState==='complete')attach()}catch{}
  return {attach};
}
