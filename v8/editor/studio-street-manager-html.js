import {streetGroups} from '/v8/renderer/street-spotlight.js';

export function streetManagerHtml(state,escapeHtml){
  const groups=streetGroups(state);
  const images=new Map((state.streets||[]).map((s,i)=>[String(s.name||''),String(s.image||'')]));
  const rows=groups.map(g=>{
    const img=images.get(g.name)||'';
    const range=[g.from,g.to].filter(Boolean).join('–');
    return '<div class="item-fields"><label><span>'+escapeHtml(range||'未分配号段')+' · '+g.count+' 个社团</span><input data-street-rename="'+escapeHtml(g.name)+'" value="'+escapeHtml(g.name)+'"></label>'+
      '<div class="item-media-row"><button type="button" data-street-image="'+escapeHtml(g.name)+'">'+(img?'更换宣传图':'上传街道宣传图')+'</button>'+
      (img?'<img src="'+escapeHtml(img)+'" alt="" style="width:64px;height:36px;object-fit:cover;border-radius:6px">':'')+
      '<button type="button" class="ghost" data-street-delete="'+escapeHtml(g.name)+'">删除街道</button></div></div>';
  }).join('');
  return '<div class="entry-animation-inspector">'+
    (rows||'<div class="sidebar-content-empty">还没有街道，先在摊位的「街道」字段里填写。</div>')+
    '<div class="item-fields"><label><span>新增街道</span><input id="newStreetName" placeholder="例如 D 街道 · 新刊区"></label></div>'+
    '<div class="entry-animation-actions"><button type="button" id="addStreetBtn">新增街道</button></div>'+
    '<p class="inspector-note">街道来自每个摊位的「街道」字段；改名会同步更新该街道下的所有摊位，宣传图用于社团作品页的街道横幅和首页街道卡。</p></div>';
}
