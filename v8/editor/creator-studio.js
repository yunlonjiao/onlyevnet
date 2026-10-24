import {setStudioDevice,setStudioPreviewChrome} from '/v8/editor/studio-controls.js';
import {renderStudioCollectionPanel,filterStudioCollection} from '/v8/editor/studio-collections.js';
import {createStudioHistory} from '/v8/editor/studio-history.js';
import {downloadStudioHtml,publishStudioSite} from '/v8/editor/studio-publish.js';
import {createStudioCropper,cropSelectionToDataUrl} from '/v8/editor/studio-crop.js';
import {bindStudioField} from '/v8/editor/studio-field.js';
import {renderInspector,renderPageTree} from '/v8/editor/studio-chrome.js';
import {bindCanvasSelection} from '/v8/editor/canvas-selection.js';
import {getTemplate} from '/v8/templates/registry.js?v=8.41.1';
import {esc} from '/v8/market-shared.js';
import {createSite,updateSite,cleanSlug,suggestSlug,isValidSlug} from '/v8/publisher.js';
const $=s=>document.querySelector(s),q=new URLSearchParams(location.search),t=getTemplate(q.get('template')),project=q.get('project')||'default';
const storage='onlyevent-studio-v8:'+t.id+':'+project+':iframe';
let state=structuredClone(t.defaults),section='basic',selected=-1,delay=0,preview=false;
let hasSaved=false;try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved){state={...state,...saved};hasSaved=true}}catch{}
if(q.get('name')&&!hasSaved)state.eventName=q.get('name');
document.querySelector('#projectTemplateName').textContent=t.label;
document.querySelector('#workspaceTemplateName').textContent=t.label;
const defs=[['basic','活动信息'],['images','主视觉'],['tickets','入场票'],['creators','社团管理'],['products','制品管理'],['maps','场地图'],['news','公告'],['community','社群'],['sponsors','赞助'],['guide','观展指南']];
const pageDefs=[['home','首页','basic'],['animation','动画','images'],['booths','摊位','creators'],['map','场地图','maps'],['guide','观展指南','guide']];
const frame=$('#canvas');frame.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/market-'+(t.id==='03-creator-market'?'01':'02')+'-preview.html?project='+encodeURIComponent(project)+'&template='+encodeURIComponent(t.id)+'" title="同人创作展实时预览"></iframe>';
let iframe=$('#liveFrame');
let pendingFrameRefresh=false;
let pendingScrollPosition=null;
function refreshMarketFrame(){
 try{const doc=iframe.contentDocument;pendingScrollPosition=doc?.scrollingElement?.scrollTop??null;}catch{pendingScrollPosition=null}
 iframe.contentWindow.location.reload();
}
iframe.addEventListener('load',()=>{
 try{const doc=iframe.contentDocument;doc?.documentElement.classList.toggle('oe-studio-preview',preview)}catch{}
 if(pendingScrollPosition===null)return;
 const position=pendingScrollPosition;pendingScrollPosition=null;
 try{iframe.contentWindow.scrollTo(0,position)}catch{}
});
const LIVE_FIELDS={eventName:'[data-event-name]',description:'[data-description]',date:'[data-date]',location:'[data-location]'};
function patchPreviewField(path,value){
 try{
  const doc=iframe.contentDocument;if(!doc)return false;
  if(path==='ticketUrl'){doc.querySelectorAll('[data-ticket]').forEach(n=>{n.href=value||'#guide';n.textContent=value?'立即购票 ↗':'入场指南 ↗'});return true;}
  const selector=LIVE_FIELDS[path];if(!selector)return false;
  doc.querySelectorAll(selector).forEach(n=>{if(n===doc.activeElement)return;n.textContent=value||''});
  return true;
 }catch{return false;}
}
function persist(){
 try{
  localStorage.setItem(storage,JSON.stringify(state));
  const key='onlyevent-market-preview:'+t.id+':'+project;
  localStorage.setItem(key,JSON.stringify(state));
  if(pendingFrameRefresh){pendingFrameRefresh=false;refreshMarketFrame();}
  $('#saveState').textContent='已保存';
 }catch(e){$('#saveState').textContent='保存失败：图片过大或浏览器存储不足';}
}
const studioHistory=createStudioHistory({limit:80,onChange:()=>syncHistory()});
function syncHistory(){const undo=$('#undoBtn'),redo=$('#redoBtn');if(undo)undo.disabled=!studioHistory.canUndo;if(redo)redo.disabled=!studioHistory.canRedo;}
function checkpoint(){studioHistory.checkpoint(state)}
function schedule(){clearTimeout(delay);delay=setTimeout(persist,170);}
function change(path,value){const keys=path.split('.');let o=state;for(const k of keys.slice(0,-1))o=o[k];o[keys.at(-1)]=value;if(path==='eventName'){const a=document.querySelector('#marketOrganizerEventName');if(a)a.textContent=value||'未命名活动';const b=document.querySelector('#projectEventName');if(b)b.textContent=value||'未命名活动';}if(!patchPreviewField(path,value))pendingFrameRefresh=true;schedule();}
function input(label,path,multiline=false){const val=path.split('.').reduce((o,k)=>o?.[k],state)??'';return '<label><span>'+esc(label)+'</span>'+(multiline?'<textarea data-key="'+esc(path)+'">'+esc(val)+'</textarea>':'<input data-key="'+esc(path)+'" value="'+esc(val)+'">')+'</label>';}
function upload(label,path){
 const current=path.split('.').reduce((o,k)=>o?.[k],state)||'';
 return '<div class="item-media hero-media-field"><span>'+esc(label)+'</span><div class="item-media-row">'+
 (current?'<img src="'+esc(current)+'" alt="'+esc(label)+' 当前图片">':'<div class="item-media-empty">＋</div>')+
 '<div><button type="button" data-market-upload="'+esc(path)+'">选择 / 裁剪</button>'+
 (current?'<button type="button" class="ghost" data-market-remove-image="'+esc(path)+'">移除</button>':'')+
 '</div></div><input type="file" accept="image/*" data-file="'+esc(path)+'" tabindex="-1" aria-label="'+esc(label)+'" hidden><details><summary>使用图片链接</summary>'+input('图片地址',path)+'</details></div>';
}
function collection(key){
 const records=state[key]||[],item=records[selected];if(!item)return '<div class="inspector-empty"><b>从左侧内容库或画布选择内容</b></div>';
 const prefix=key+'.'+selected+'.';
 const columns=key==='creators'?['name','booth','description','tags','image']:key==='products'?['name','creatorId','description','price','tags','image']:key==='maps'?['title','image']:key==='news'?['date','title']:key==='community'?['label','url']:['name','image'];
 let out='<div class="item-inspector-head"><div><span>内容编辑</span><b>'+esc(item.name||item.title||item.label||('记录 '+(selected+1)))+'</b></div><span>'+String(selected+1).padStart(2,'0')+' / '+String(records.length).padStart(2,'0')+'</span></div><div class="item-fields">';
 for(const k of columns){
  if(k==='tags'){out+='<label ><span>标签（逗号分隔）</span><input  data-market-tags="'+prefix+k+'" value="'+esc((item.tags||[]).join(', '))+'"></label>';continue}
  if(k==='creatorId'){out+='<label ><span>所属社团</span><select  data-key="'+prefix+k+'"><option value="">未关联</option>'+((state.creators||[]).map(c=>'<option value="'+esc(c.id)+'" '+(c.id===item.creatorId?'selected':'')+'>'+esc(c.name||c.id)+'</option>').join(''))+'</select></label>';continue}
  out+=k==='image'?upload('图片',prefix+k):input(({name:'名称',booth:'摊位号',description:'简介',price:'价格',date:'日期',title:'标题',label:'显示名称',url:'外链'})[k]||k,prefix+k,k==='description');
 }
 return out+'</div><div class="row"><button type="button" class="danger" data-delete-selected>删除当前内容</button></div>';
}

function render(){const nav=$('#pageContentNav'),panel=$('#inspector');
  renderPageTree(document.querySelector('.page-nav'),pageDefs,pageDefs.find(x=>x[2]===section)?.[0]||'home',esc);
  const leftName=document.querySelector('#marketOrganizerEventName');if(leftName)leftName.textContent=state.eventName||'未命名活动';const html=defs.map(([id,label])=>'<button data-section="'+id+'" type="button" class="'+(id===section?'active':'')+'">'+label+'</button>').join('');nav.innerHTML=html;const title=defs.find(x=>x[0]===section)?.[1]||'属性';let fields='';
if(section==='basic')fields=input('活动名称','eventName')+input('活动介绍','description',true)+input('时间','date')+input('地址','location');
else if(section==='images')fields=upload('桌面 KV','heroImage')+upload('手机 KV','mobileHeroImage');
else if(section==='tickets')fields=input('外部购票链接','ticketUrl');
else if(section==='guide')fields=input('观展指南','guide',true);
else fields=collection(section);
 const list=$('#contentListPanel');
 if(list){
  const items=Array.isArray(state[section])?state[section]:null;
  if(items){
   renderStudioCollectionPanel(list,items,{
    escape:esc,title,selected,
    item:entry=>[entry.name||entry.title||entry.label||'未命名',entry.booth||entry.price||entry.date||''],
    thumbnail:(entry,i)=>'<span class="sidebar-content-thumb">'+(entry.image?'<img src="'+esc(entry.image)+'" alt="">':String(i+1).padStart(2,'0'))+'</span>',
    empty:'尚无'+title,addLabel:'添加'+title
   });
  }else list.innerHTML='';
 }
renderInspector(panel,esc,'属性',title,fields);
 panel.querySelectorAll('[data-key],[data-market-tags]').forEach(input=>{
  const path=input.dataset.key||input.dataset.marketTags;
  bindStudioField(input,{
   path,checkpoint,update:change,
   parseValue:input.dataset.marketTags!==undefined?(value=>value.split(/[,，]/).map(x=>x.trim()).filter(Boolean)):undefined
  });
 });
$('#pageContentTitle').textContent=title;$('#projectEventName').textContent=state.eventName||'同人创作展';}
document.querySelector('.page-nav')?.addEventListener('click',e=>{const b=e.target.closest('[data-market-page]');if(!b)return;const page=pageDefs.find(x=>x[0]===b.dataset.marketPage);if(!page)return;section=page[2];selected=-1;render();const hash={home:'#top',animation:'#top',booths:'#creators',map:'#map',guide:'#guide'}[page[0]];try{const doc=iframe.contentDocument;const target=doc.querySelector(hash);if(target){doc.querySelector('#directory')?.setAttribute('open','');target.scrollIntoView({behavior:'smooth',block:'start'})}}catch{}});
$('#pageContentNav').addEventListener('click',e=>{let b=e.target.closest('[data-section]');if(!b)return;section=b.dataset.section;selected=-1;render();});
$('#inspector').addEventListener('click',e=>{
 const upload=e.target.closest('[data-market-upload]');if(upload){$('#inspector [data-file="'+upload.dataset.marketUpload+'"]')?.click();return}
 const remove=e.target.closest('[data-market-remove-image]');if(remove){checkpoint();change(remove.dataset.marketRemoveImage,'');render();return}
 if(e.target.closest('[data-delete-selected]')&&Array.isArray(state[section])&&selected>=0){
  checkpoint();state[section].splice(selected,1);selected=-1;pendingFrameRefresh=true;schedule();render();
 }
});
$('#contentListPanel').addEventListener('click',e=>{
 const add=e.target.closest('[data-sidebar-content-add]');
 if(add&&Array.isArray(state[section])){
  checkpoint();state[section].push({id:'item-'+Date.now().toString(36),name:'',title:''});
  selected=state[section].length-1;pendingFrameRefresh=true;schedule();render();return
 }
 const row=e.target.closest('[data-open-item]');
 if(row){selected=Number(row.dataset.openItem);render()}
});
$('#contentListPanel').addEventListener('input',e=>{
 if(e.target.matches('[data-sidebar-content-search]'))filterStudioCollection($('#contentListPanel'),e.target.value);
});
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
  marketCropper?.destroy?.();
  marketCropper=await createStudioCropper({image:$('#cropImage'),stage:$('#cropStage'),ratio:marketCropConfig.ratio,coverage:.72});
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
  const data=await cropSelectionToDataUrl(selection,marketCropConfig);
  checkpoint();change(marketCropPath,data);closeMarketCrop();render();
 }catch(err){console.error('[Market image apply]',err);$('#saveState').textContent='图片裁剪失败'}finally{button.disabled=false}
};
$('#undoBtn').onclick=()=>{const next=studioHistory.undo(state);if(!next)return;state=next;pendingFrameRefresh=true;schedule();render();syncHistory()};$('#redoBtn').onclick=()=>{const next=studioHistory.redo(state);if(!next)return;state=next;pendingFrameRefresh=true;schedule();render();syncHistory()};
$('#deviceDesktopBtn').onclick=()=>setStudioDevice('desktop',{canvas:frame});$('#deviceMobileBtn').onclick=()=>setStudioDevice('mobile',{canvas:frame});
$('#previewBtn').onclick=()=>{preview=!preview;setStudioPreviewChrome(preview);try{iframe.contentDocument?.documentElement.classList.toggle('oe-studio-preview',preview)}catch{};try{const doc=iframe.contentDocument;doc.querySelectorAll('[data-market-edit-path]').forEach(el=>{el.contentEditable=preview?'false':'true';el.setAttribute('aria-readonly',preview?'true':'false')});if(preview)doc.querySelectorAll('.oe-selected-edit-target').forEach(el=>el.classList.remove('oe-selected-edit-target'))}catch{}};
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
  try{persist();const html=await generateHtml();downloadStudioHtml(html,state.eventName||'onlyevent-market-'+project);}catch(e){$('#publishStatus').textContent='导出失败：'+e.message;}
};
$('#publishPrimary').onclick=async()=>{
  const slug=cleanSlug($('#publishSlug').value);if(!isValidSlug(slug)){$('#publishStatus').textContent='请输入3–63位字母、数字或连字符';return}
  $('#publishPrimary').disabled=true;$('#publishStatus').textContent='正在生成并发布网站…';
  try{
    persist();const html=await generateHtml();
    publication=await publishStudioSite({html,title:state.eventName,slug,templateId:t.id,publication,createSite,updateSite});
    localStorage.setItem(publishKey,JSON.stringify(publication));
    $('#publishStatus').textContent='网站已发布';$('#publishResult').hidden=false;$('#publishUrl').textContent=publication.url;
    const projects=JSON.parse(localStorage.getItem('onlyevent-admin-projects-v1')||'[]');
    const item=projects.find(p=>p.id===project);if(item){item.siteUrl=publication.url;item.status='published';item.updatedAt=new Date().toISOString();localStorage.setItem('onlyevent-admin-projects-v1',JSON.stringify(projects));}
  }catch(e){$('#publishStatus').textContent='发布失败：'+(e?.message||e);}finally{$('#publishPrimary').disabled=false;}
};
$('#publishOpen').onclick=()=>{if(publication.url)window.open(publication.url,'_blank','noopener')};
$('#publishCopy').onclick=async()=>{if(publication.url)await navigator.clipboard.writeText(publication.url)};

$('#saveState').onclick=persist;

// In-canvas editing follows the existing Studio convention: select a visible block,
// then edit its properties in the right inspector. No second editor UI.
const regionMap={top:'images',about:'basic',ads:'products',randomSix:'products',news:'news',tickets:'tickets',community:'community',sponsors:'sponsors',creators:'creators',products:'products',map:'maps',guide:'guide',catalogue:'creators'};
bindCanvasSelection({
 frame:iframe,getPreview:()=>preview,regions:regionMap,
 fields:[['[data-event-name]','eventName'],['[data-description]','description'],['[data-date]','date'],['[data-location]','location']],
 onFocusField:()=>{checkpoint();section='basic';selected=-1;render()},
 onCommitField:(path,value)=>{if(value!==String(state[path]??'')){change(path,value);render()}},
 onSelectRecord:(key,id,position)=>{const records=Array.isArray(state[key])?state[key]:[];let index=id?records.findIndex(item=>String(item.id)===String(id)):-1;if(index<0&&position!==undefined)index=Number(position);if(index>=0&&index<records.length){section=key;selected=index;render()}},
 onSelectRegion:key=>{section=key;selected=-1;render()}
});

const nameSlot=document.createElement('div');nameSlot.className='market-organizer-name';nameSlot.id='marketOrganizerEventName';const header=document.querySelector('.sidebar-head');if(header)header.insertAdjacentElement('afterend',nameSlot);
persist();render();syncHistory();
