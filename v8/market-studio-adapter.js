import {getTemplate} from '/v8/templates/registry.js?v=8.41.1';
import {esc} from '/v8/market-shared.js';
import {createSite,updateSite,cleanSlug,suggestSlug,isValidSlug} from '/v8/publisher.js';
const $=s=>document.querySelector(s),q=new URLSearchParams(location.search),t=getTemplate(q.get('template')),project=q.get('project')||'default';
const storage='onlyevent-studio-v8:'+t.id+':'+project+':iframe';
let state=structuredClone(t.defaults),history=[],future=[],section='basic',selected=-1,delay=0,preview=false;
let hasSaved=false;try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved){state={...state,...saved};hasSaved=true}}catch{}
if(q.get('name')&&!hasSaved)state.eventName=q.get('name');
document.querySelector('#projectTemplateName').textContent=t.label;
document.querySelector('#workspaceTemplateName').textContent=t.label;
const defs=[['basic','活动信息'],['images','主视觉'],['tickets','入场票'],['creators','社团管理'],['products','制品管理'],['maps','场地图'],['news','公告'],['community','社群'],['sponsors','赞助'],['guide','观展指南']];
const pageDefs=[['home','首页','basic'],['animation','动画','images'],['booths','摊位','creators'],['map','场地图','maps'],['guide','观展指南','guide']];
const frame=$('#canvas');frame.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/market-'+(t.id==='03-creator-market'?'01':'02')+'-preview.html?project='+encodeURIComponent(project)+'&template='+encodeURIComponent(t.id)+'" title="同人创作展实时预览"></iframe>';
let iframe=$('#liveFrame');
function persist(){try{localStorage.setItem(storage,JSON.stringify(state));const key='onlyevent-market-preview:'+t.id+':'+project;localStorage.setItem(key,JSON.stringify(state));iframe.contentWindow.location.reload();$('#saveState').textContent='已保存';}catch(e){$('#saveState').textContent='保存失败：图片过大或浏览器存储不足';}}
function checkpoint(){history.push(structuredClone(state));if(history.length>60)history.shift();future=[];}
function schedule(){clearTimeout(delay);delay=setTimeout(persist,170);}
function change(path,value){const keys=path.split('.');let o=state;for(const k of keys.slice(0,-1))o=o[k];o[keys.at(-1)]=value;schedule();}
function input(label,path,multiline=false){const val=path.split('.').reduce((o,k)=>o?.[k],state)??'';return '<label class="market-field"><span>'+esc(label)+'</span>'+(multiline?'<textarea class="market-control" data-key="'+esc(path)+'">'+esc(val)+'</textarea>':'<input class="market-control" data-key="'+esc(path)+'" value="'+esc(val)+'">')+'</label>';}
function upload(label,path){const current=path.split('.').reduce((o,k)=>o?.[k],state)||'';return '<div class="item-media market-upload"><span>'+esc(label)+'</span><div class="item-media-row">'+(current?'<img src="'+esc(current)+'" alt="'+esc(label)+' 当前图片">':'<div class="item-media-empty">＋</div>')+'<div class="market-upload-actions"><button type="button" data-market-upload="'+esc(path)+'">选择图片</button>'+(current?'<button type="button" class="ghost" data-market-remove-image="'+esc(path)+'">移除</button>':'')+'</div></div><input class="market-hidden-upload" type="file" accept="image/*" data-file="'+esc(path)+'" tabindex="-1" aria-label="'+esc(label)+'" hidden><details><summary>使用图片链接</summary>'+input('图片地址',path)+'</details></div>';}
function collection(key){const records=state[key]||[];let html='<button data-add="'+key+'" type="button" style="margin:12px 0">＋ 新增</button>';html+=records.map((r,i)=>'<div style="display:flex;gap:6px;margin:7px 0"><button data-select="'+i+'" style="flex:1;text-align:left">'+esc(r.name||r.title||r.label||('记录 '+(i+1)))+'</button><button data-delete="'+i+'">删除</button></div>').join('');if(records[selected]){let prefix=key+'.'+selected+'.';let columns=key==='creators'?['name','booth','description','tags','image']:key==='products'?['name','creatorId','description','price','tags','image']:key==='maps'?['title','image']:key==='news'?['date','title']:key==='community'?['label','url']:['name','image'];html+='<hr>';for(let k of columns){if(k==='tags'){html+='<label class="market-field"><span>标签（逗号分隔）</span><input class="market-control" data-market-tags="'+prefix+k+'" value="'+esc((records[selected].tags||[]).join(', '))+'"></label>';continue}if(k==='creatorId'){html+='<label class="market-field"><span>所属社团</span><select class="market-control" data-key="'+prefix+k+'"><option value="">未关联</option>'+((state.creators||[]).map(c=>'<option value="'+esc(c.id)+'" '+(c.id===records[selected].creatorId?'selected':'')+'>'+esc(c.name||c.id)+'</option>').join(''))+'</select></label>';continue}html+=k==='image'?upload('图片',prefix+k):input(({name:'名称',booth:'摊位号',description:'简介',creatorId:'关联社团 ID',price:'价格',date:'日期',title:'标题',label:'显示名称',url:'外链'})[k]||k,prefix+k,k==='description');} }return html}
function render(){const nav=$('#pageContentNav'),panel=$('#inspector');
  const tree=document.querySelector('.page-nav');if(tree){tree.innerHTML=pageDefs.map(([page,label,sectionId])=>'<div class="page-tree-row is-fixed"><button type="button" data-market-page="'+page+'" class="'+(section===sectionId?'active':'')+'"><span class="nav-icon">'+({home:'⌂',animation:'✦',booths:'⌘',map:'▤',guide:'i'}[page])+'</span><span>'+label+'</span></button></div>').join('')}
  const leftName=document.querySelector('#marketOrganizerEventName');if(leftName)leftName.textContent=state.eventName||'未命名活动';const html=defs.map(([id,label])=>'<button data-section="'+id+'" type="button" class="'+(id===section?'active':'')+'">'+label+'</button>').join('');nav.innerHTML=html;const title=defs.find(x=>x[0]===section)?.[1]||'属性';let fields='';
if(section==='basic')fields=input('活动名称','eventName')+input('活动介绍','description',true)+input('时间','date')+input('地址','location');
else if(section==='images')fields=upload('桌面 KV','heroImage')+upload('手机 KV','mobileHeroImage');
else if(section==='tickets')fields=input('外部购票链接','ticketUrl');
else if(section==='guide')fields=input('观展指南','guide',true);
else fields=collection(section);
panel.innerHTML='<div class="inspector-header"><div><span class="inspector-kicker">属性</span><b>'+title+'</b></div><span class="inspector-status"><i></i>自动保存</span></div><div class="inspector-body">'+fields+'</div>';
$('#pageContentTitle').textContent=title;$('#projectEventName').textContent=state.eventName||'同人创作展';}
document.querySelector('.page-nav')?.addEventListener('click',e=>{const b=e.target.closest('[data-market-page]');if(!b)return;const page=pageDefs.find(x=>x[0]===b.dataset.marketPage);if(!page)return;section=page[2];selected=-1;render();const hash={home:'#top',animation:'#top',booths:'#creators',map:'#map',guide:'#guide'}[page[0]];try{const doc=iframe.contentDocument;const target=doc.querySelector(hash);if(target){doc.querySelector('#directory')?.setAttribute('open','');target.scrollIntoView({behavior:'smooth',block:'start'})}}catch{}});
$('#pageContentNav').addEventListener('click',e=>{let b=e.target.closest('[data-section]');if(!b)return;section=b.dataset.section;selected=-1;render();});
$('#inspector').addEventListener('focusin',e=>{if(e.target.matches('[data-key],[data-market-tags]')&&!e.target.dataset.snap){checkpoint();e.target.dataset.snap='1'}});
$('#inspector').addEventListener('input',e=>{const k=e.target.dataset.key;if(k)change(k,e.target.value);const tags=e.target.dataset.marketTags;if(tags)change(tags,e.target.value.split(/[,，]/).map(x=>x.trim()).filter(Boolean))});
$('#inspector').addEventListener('click',e=>{let upload=e.target.closest('[data-market-upload]');if(upload){$('#inspector [data-file="'+upload.dataset.marketUpload+'"]')?.click();return}let remove=e.target.closest('[data-market-remove-image]');if(remove){checkpoint();change(remove.dataset.marketRemoveImage,'');render();return}let b=e.target.closest('[data-add],[data-select],[data-delete]');if(!b)return;if(b.dataset.add){checkpoint();const key=b.dataset.add;state[key]??=[];state[key].push({id:'item-'+Date.now().toString(36),name:'新项目',title:'新项目'});selected=state[key].length-1;schedule();}else if(b.dataset.select!==undefined){selected=Number(b.dataset.select)}else if(b.dataset.delete!==undefined){checkpoint();state[section].splice(Number(b.dataset.delete),1);selected=-1;schedule()}render()});
// The Market templates use the original Studio crop dialog and Cropper.js interaction.
let marketCropper=null,marketCropUrl='',marketCropPath='',marketCropConfig=null;
const getCropConfig=path=>{
 if(path==='heroImage')return {label:'桌面宣传 KV',ratio:16/9,width:1920,height:1080};
 if(path==='mobileHeroImage')return {label:'手机开场 KV',ratio:3/4,width:1080,height:1440};
 if(/^maps\.\d+\.image$/.test(path))return {label:'场地图',ratio:null,maxSize:2000};
 if(/^creators\.\d+\.image$/.test(path))return {label:'社团摊宣',ratio:null,maxSize:1600};
 return {label:'制品图片',ratio:null,maxSize:1600};
};
function closeMarketCrop(){
 $('#imageCropDialog').close();marketCropper?.destroy?.();marketCropper=null;
 if(marketCropUrl)URL.revokeObjectURL(marketCropUrl);
 marketCropUrl='';marketCropPath='';$('#cropStage').classList.remove('loading');
}
$('#inspector').addEventListener('change',async e=>{
 const key=e.target.dataset.file;if(!key||!e.target.files?.length)return;
 const file=e.target.files[0];e.target.value='';
 if(!file.type.startsWith('image/'))return;
 marketCropPath=key;marketCropConfig=getCropConfig(key);
 if(marketCropUrl)URL.revokeObjectURL(marketCropUrl);
 marketCropUrl=URL.createObjectURL(file);
 $('#cropSlotLabel').textContent=marketCropConfig.label;
 $('#cropRatioLabel').textContent=marketCropConfig.ratio?'固定裁剪比例 '+marketCropConfig.ratio.toFixed(2):'自由裁剪比例';
 $('#cropImage').src=marketCropUrl;
 $('#imageCropDialog').showModal();
 $('#cropStage').classList.add('loading');
 try{
  const mod=await import('https://cdn.jsdelivr.net/npm/cropperjs@2.2.0/+esm');
  const Cropper=mod.default||mod.Cropper;
  marketCropper?.destroy?.();
  const ratio=marketCropConfig.ratio;
  marketCropper=new Cropper($('#cropImage'),{container:'#cropStage',template:'<cropper-canvas background><cropper-image initial-center-size="contain" rotatable></cropper-image><cropper-shade hidden></cropper-shade><cropper-selection initial-coverage="0.8" movable resizable outlined'+(ratio?' aspect-ratio="'+ratio+'"':'')+'><cropper-grid role="grid" bordered covered></cropper-grid><cropper-crosshair centered></cropper-crosshair><cropper-handle action="move"></cropper-handle><cropper-handle action="n-resize"></cropper-handle><cropper-handle action="e-resize"></cropper-handle><cropper-handle action="s-resize"></cropper-handle><cropper-handle action="w-resize"></cropper-handle><cropper-handle action="ne-resize"></cropper-handle><cropper-handle action="nw-resize"></cropper-handle><cropper-handle action="se-resize"></cropper-handle><cropper-handle action="sw-resize"></cropper-handle></cropper-selection></cropper-canvas>'});
 }catch(err){console.error('[Market cropper]',err);$('#saveState').textContent='图片裁剪加载失败';closeMarketCrop();return}
 $('#cropStage').classList.remove('loading');
});
$('#cropCancel').onclick=closeMarketCrop;$('#cropClose').onclick=closeMarketCrop;
$('#imageCropDialog').addEventListener('cancel',e=>{e.preventDefault();closeMarketCrop()});
$('#cropRotateLeft').onclick=()=>marketCropper?.getCropperImage?.()?.$rotate('-90deg');
$('#cropReset').onclick=()=>marketCropper?.getCropperImage?.()?.$resetTransform?.();
$('#cropApply').onclick=async()=>{
 const selection=marketCropper?.getCropperSelection?.();if(!selection||!marketCropPath)return;
 const button=$('#cropApply');button.disabled=true;
 try{
  const cfg=marketCropConfig;
  let width=cfg.width,height=cfg.height;
  if(!cfg.ratio){const ratio=Math.max(.1,Number(selection.width||1)/Math.max(1,Number(selection.height||1)));const max=cfg.maxSize||1600;width=ratio>=1?max:Math.max(1,Math.round(max*ratio));height=ratio>=1?Math.max(1,Math.round(max/ratio)):max}
  const canvas=await selection.$toCanvas({width,height});
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(x=>x?resolve(x):reject(new Error('图片编码失败')),'image/webp',.86));
  const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
  checkpoint();change(marketCropPath,data);closeMarketCrop();render();
 }catch(err){console.error('[Market image apply]',err);$('#saveState').textContent='图片裁剪失败'}finally{button.disabled=false}
};
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(structuredClone(state));state=history.pop();schedule();render()};$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(structuredClone(state));state=future.pop();schedule();render()};
$('#deviceDesktopBtn').onclick=()=>{frame.classList.remove('device-mobile');iframe.style.maxWidth='100%';};$('#deviceMobileBtn').onclick=()=>{iframe.style.maxWidth='390px';};
$('#previewBtn').onclick=()=>{preview=!preview;document.body.classList.toggle('oe-market-preview-mode',preview);$('#previewLabel').textContent=preview?'返回编辑':'预览';try{iframe.contentDocument.querySelectorAll('[data-market-edit-path]').forEach(el=>el.contentEditable=preview?'false':'true')}catch{}};
$('#backAdminBtn').onclick=()=>location.assign('/admin/');
const publishKey='onlyevent-studio-publish:'+t.id+':'+project+':iframe';
let publication={};try{publication=JSON.parse(localStorage.getItem(publishKey)||'{}')}catch{}
async function generateHtml(){
  const src=await (await fetch('/v8/market-'+(t.id==='03-creator-market'?'01':'02')+'-preview.html')).text();
  const common=await (await fetch('/v8/market-shared.js')).text();
  const standaloneData=JSON.stringify(state).replace(/</g,'\\u003c');
  const script=common.replace(/^export /gm,'')+'\nconst __oeSnapshot='+standaloneData+';\n';
  let html=src.replace(/import\s*\{[^}]+\}\s*from\s*['"]\/v8\/market-shared\.js['"];?/,'\n'+script);
  html=html.replace('const d=getData()','const d=__oeSnapshot');
  if(!html.includes('const d=__oeSnapshot'))throw new Error('单文件生成未成功替换活动数据');
  return html;
}
function publishDialog(){
  const dialog=$('#publishDialog');
  $('#publishSlug').value=publication.slug||suggestSlug(state.eventName,state.date);
  $('#publishSlug').readOnly=!!publication.siteId;
  $('#publishStatus').textContent=publication.siteId?'已发布，可更新当前网站':'输入网站地址后发布';
  $('#publishResult').hidden=!publication.url;
  $('#publishUrl').textContent=publication.url||'';
  dialog.showModal();
}
$('#publishBtn').onclick=publishDialog;
$('#publishClose').onclick=()=>$('#publishDialog').close();
$('#publishCancel').onclick=()=>$('#publishDialog').close();
$('#publishDownload').onclick=async()=>{
  try{persist();const html=await generateHtml();const blob=new Blob([html],{type:'text/html;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='onlyevent-market-'+project+'.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){$('#publishStatus').textContent='导出失败：'+e.message;}
};
$('#publishPrimary').onclick=async()=>{
  const slug=cleanSlug($('#publishSlug').value);if(!isValidSlug(slug)){$('#publishStatus').textContent='请输入3–63位字母、数字或连字符';return}
  $('#publishPrimary').disabled=true;$('#publishStatus').textContent='正在生成并发布网站…';
  try{
    persist();const html=await generateHtml(),payload={html,title:state.eventName,slug,templateId:t.id};
    const result=publication.siteId?await updateSite({...payload,siteId:publication.siteId,editToken:publication.editToken}):await createSite(payload);
    if(!result.siteId||!(result.editToken||publication.editToken))throw new Error('发布平台未返回有效站点凭证');
    publication={siteId:result.siteId,editToken:result.editToken||publication.editToken,slug:result.slug||slug,url:result.url||('https://'+slug+'.onlyevent.cn'),publishedAt:new Date().toISOString()};
    localStorage.setItem(publishKey,JSON.stringify(publication));
    $('#publishStatus').textContent='网站已发布';$('#publishResult').hidden=false;$('#publishUrl').textContent=publication.url;
    const projects=JSON.parse(localStorage.getItem('onlyevent-admin-projects-v1')||'[]');
    const item=projects.find(p=>p.id===project);if(item){item.siteUrl=publication.url;item.status='published';item.updatedAt=new Date().toISOString();localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify(projects));}
  }catch(e){$('#publishStatus').textContent='发布失败：'+(e?.message||e);}finally{$('#publishPrimary').disabled=false;}
};
$('#publishOpen').onclick=()=>{if(publication.url)window.open(publication.url,'_blank','noopener')};
$('#publishCopy').onclick=async()=>{if(publication.url)await navigator.clipboard.writeText(publication.url)};

$('#saveState').onclick=persist;
const css=document.createElement('style');css.textContent='.page-workspace #createCustomPageBtn{display:none!important}.page-workspace .page-nav{display:block!important}.page-workspace .page-tree-row button.active{background:#eee8ff;color:#5142a6}.market-organizer-name{padding:12px 15px;margin:8px 0 14px;border-radius:9px;background:#f5f4fa;font-size:14px;font-weight:800;overflow-wrap:anywhere}.page-workspace #customPageRows{display:none!important}.oe-market-preview-mode #studioSidebar,.oe-market-preview-mode #inspector{display:none!important}.oe-market-preview-mode .studio-shell{grid-template-columns:1fr!important}#pageContentNav [data-section]{display:block;padding:10px 13px;margin:4px 0;width:100%;text-align:left}#pageContentNav [data-section].active{background:#eee8ff;border-radius:8px}';document.head.appendChild(css);

// In-canvas editing follows the existing Studio convention: select a visible block,
// then edit its properties in the right inspector. No second editor UI.
const regionMap={top:'images',about:'basic',ads:'products',randomSix:'products',news:'news',tickets:'tickets',community:'community',sponsors:'sponsors',creators:'creators',products:'products',map:'maps',guide:'guide',catalogue:'creators'};
iframe.addEventListener('load',()=>{try{
  // Direct text editing matches the existing Studio's yellow-frame interaction.
  // Commit on blur; leaving the active node intact while typing avoids cursor jumps.
  const editableFields=[['[data-event-name]','eventName'],['[data-description]','description'],['[data-date]','date'],['[data-location]','location']];
  const doc=iframe.contentDocument;
  for(const [selector,path] of editableFields){
    doc.querySelectorAll(selector).forEach(el=>{
      el.contentEditable=preview?'false':'true';el.dataset.marketEditPath=path;el.spellcheck=false;
      el.setAttribute('role','textbox');el.setAttribute('aria-label','直接编辑'+({eventName:'活动名称',description:'活动介绍',date:'活动时间',location:'活动地址'}[path]));
      el.addEventListener('focus',()=>{if(preview)return;checkpoint();section='basic';selected=-1;render();el.classList.add('oe-market-editing')});
      el.addEventListener('blur',()=>{el.classList.remove('oe-market-editing');const value=el.textContent.trim();if(value!==String(state[path]??'')){change(path,value);render()}});
      el.addEventListener('keydown',e=>{if(e.key==='Enter'&&path!=='description'){e.preventDefault();el.blur()}});
    });
  }
  iframe.contentDocument.addEventListener('click',e=>{
    if(preview)return;
    if(e.target.closest('[data-market-edit-path]'))return;
    const target=e.target.closest('[id]');
    let node=target;
    while(node&&!regionMap[node.id])node=node.parentElement;
    if(!node)return;
    section=regionMap[node.id];selected=-1;render();
    iframe.contentDocument.querySelectorAll('.oe-selected-edit-target').forEach(el=>el.classList.remove('oe-selected-edit-target'));
    node.classList.add('oe-selected-edit-target');
  });
  const css=iframe.contentDocument.createElement('style');
  css.textContent='.oe-selected-edit-target,[data-market-edit-path]:focus{outline:3px solid #e6bc22;outline-offset:4px}[data-market-edit-path]:hover{outline:2px dashed #e6bc22;outline-offset:3px}';
  iframe.contentDocument.head.appendChild(css);
}catch(e){console.warn('market canvas selection unavailable',e)}});
const marketSkin=document.createElement('style');marketSkin.textContent='.market-field{display:grid;gap:8px;margin:0 0 18px;color:#656574;font-size:12px;font-weight:650}.market-control{width:100%;min-height:39px;border:1px solid #e3e3eb;border-radius:9px;background:#fff;color:#23232c;padding:10px 12px;outline:none;font:inherit;font-size:13px;transition:border-color .15s,box-shadow .15s}.market-control:focus{border-color:#8873d8;box-shadow:0 0 0 3px #8873d81a}.market-field textarea{min-height:105px;resize:vertical;line-height:1.6}.market-upload{margin:18px 0;padding:14px;border-radius:12px;border:1px solid #e7e6ed;background:#fafafd}.market-upload>span{font-size:12px;color:#626276;font-weight:750}.market-upload .item-media-row{display:flex;align-items:center;gap:14px;margin-top:12px}.market-upload .item-media-row>img,.market-upload .item-media-empty{width:100px;height:75px;flex-shrink:0;object-fit:contain;border-radius:8px;background:#f0eef6}.market-upload .item-media-empty{display:grid;place-items:center;font-size:28px;color:#aaa}.market-upload-actions{display:grid;gap:8px;flex:1;min-width:0}.market-upload-actions button{padding:9px 11px;font-size:12px}.market-hidden-upload{display:none!important}.market-upload details{margin-top:14px}.market-upload details summary{font-size:12px;color:#888;cursor:pointer}.market-upload details .market-field{margin-top:12px}';document.head.appendChild(marketSkin);
const nameSlot=document.createElement('div');nameSlot.className='market-organizer-name';nameSlot.id='marketOrganizerEventName';const header=document.querySelector('.sidebar-head');if(header)header.insertAdjacentElement('afterend',nameSlot);
persist();render();
