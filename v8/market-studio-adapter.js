import {getTemplate} from '/v8/templates/registry.js?v=8.41.1';
import {esc} from '/v8/market-shared.js';
import {createSite,updateSite,cleanSlug,suggestSlug,isValidSlug} from '/v8/publisher.js';
const $=s=>document.querySelector(s),q=new URLSearchParams(location.search),t=getTemplate(q.get('template')),project=q.get('project')||'default';
const storage='onlyevent-studio-v8:'+t.id+':'+project+':iframe';
let state=structuredClone(t.defaults),history=[],future=[],section='basic',selected=-1,delay=0,preview=false;
try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved)state={...state,...saved};}catch{}
if(q.get('name')&&!state.eventName)state.eventName=q.get('name');
document.querySelector('#projectTemplateName').textContent=t.label;
document.querySelector('#workspaceTemplateName').textContent=t.label;
const defs=[['basic','活动信息'],['images','主视觉'],['tickets','入场票'],['creators','社团管理'],['products','制品管理'],['maps','场地图'],['news','公告'],['community','社群'],['sponsors','赞助'],['guide','观展指南']];
const frame=$('#canvas');frame.innerHTML='<iframe id="liveFrame" class="live-frame" src="/v8/market-'+(t.id==='03-creator-market'?'01':'02')+'-preview.html?project='+encodeURIComponent(project)+'&template='+encodeURIComponent(t.id)+'" title="同人创作展实时预览"></iframe>';
let iframe=$('#liveFrame');
function persist(){try{localStorage.setItem(storage,JSON.stringify(state));const key='onlyevent-market-preview:'+t.id+':'+project;localStorage.setItem(key,JSON.stringify(state));iframe.contentWindow.location.reload();$('#saveState').textContent='已保存';}catch(e){$('#saveState').textContent='保存失败：图片过大或浏览器存储不足';}}
function checkpoint(){history.push(structuredClone(state));if(history.length>60)history.shift();future=[];}
function schedule(){clearTimeout(delay);delay=setTimeout(persist,170);}
function change(path,value){const keys=path.split('.');let o=state;for(const k of keys.slice(0,-1))o=o[k];o[keys.at(-1)]=value;schedule();}
function input(label,path,multiline=false){const val=path.split('.').reduce((o,k)=>o?.[k],state)??'';return '<label style="display:block;margin:15px 0;font-size:13px">'+esc(label)+(multiline?'<textarea data-key="'+esc(path)+'" style="display:block;width:100%;min-height:90px;margin-top:6px">'+esc(val)+'</textarea>':'<input data-key="'+esc(path)+'" value="'+esc(val)+'" style="display:block;width:100%;padding:10px;margin-top:6px">')+'</label>';}
function upload(label,path){return '<div style="margin:18px 0"><b>'+esc(label)+'</b>'+input('图片链接',path)+'<input type="file" accept="image/*" data-file="'+esc(path)+'" style="width:100%"></div>'}
function collection(key){const records=state[key]||[];let html='<button data-add="'+key+'" type="button" style="margin:12px 0">＋ 新增</button>';html+=records.map((r,i)=>'<div style="display:flex;gap:6px;margin:7px 0"><button data-select="'+i+'" style="flex:1;text-align:left">'+esc(r.name||r.title||r.label||('记录 '+(i+1)))+'</button><button data-delete="'+i+'">删除</button></div>').join('');if(records[selected]){let prefix=key+'.'+selected+'.';let columns=key==='creators'?['name','booth','description','image']:key==='products'?['name','creatorId','description','price','image']:key==='maps'?['title','image']:key==='news'?['date','title']:key==='community'?['label','url']:['name','image'];html+='<hr>';for(let k of columns)html+=k==='image'?upload('图片',prefix+k):input(({name:'名称',booth:'摊位号',description:'简介',creatorId:'关联社团 ID',price:'价格',date:'日期',title:'标题',label:'显示名称',url:'外链'})[k]||k,prefix+k,k==='description');}return html}
function render(){const nav=$('#pageContentNav'),panel=$('#inspector');const html=defs.map(([id,label])=>'<button data-section="'+id+'" type="button" class="'+(id===section?'active':'')+'">'+label+'</button>').join('');nav.innerHTML=html;const title=defs.find(x=>x[0]===section)?.[1]||'属性';let fields='';
if(section==='basic')fields=input('活动名称','eventName')+input('活动介绍','description',true)+input('时间','date')+input('地址','location');
else if(section==='images')fields=upload('桌面 KV','heroImage')+upload('手机 KV','mobileHeroImage');
else if(section==='tickets')fields=input('外部购票链接','ticketUrl');
else if(section==='guide')fields=input('观展指南','guide',true);
else fields=collection(section);
panel.innerHTML='<div class="inspector-header"><b>'+title+'</b></div><div class="inspector-body">'+fields+'</div>';
$('#pageContentTitle').textContent=title;$('#projectEventName').textContent=state.eventName||'同人创作展';}
$('#pageContentNav').addEventListener('click',e=>{let b=e.target.closest('[data-section]');if(!b)return;section=b.dataset.section;selected=-1;render();});
$('#inspector').addEventListener('focusin',e=>{if(e.target.matches('[data-key]')&&!e.target.dataset.snap){checkpoint();e.target.dataset.snap='1'}});
$('#inspector').addEventListener('input',e=>{const k=e.target.dataset.key;if(k)change(k,e.target.value)});
$('#inspector').addEventListener('click',e=>{let b=e.target.closest('[data-add],[data-select],[data-delete]');if(!b)return;if(b.dataset.add){checkpoint();const key=b.dataset.add;state[key]??=[];state[key].push({id:'item-'+Date.now().toString(36),name:'新项目',title:'新项目'});selected=state[key].length-1;schedule();}else if(b.dataset.select!==undefined){selected=Number(b.dataset.select)}else if(b.dataset.delete!==undefined){checkpoint();state[section].splice(Number(b.dataset.delete),1);selected=-1;schedule()}render()});
$('#inspector').addEventListener('change',e=>{const key=e.target.dataset.file;if(!key||!e.target.files?.length)return;const file=e.target.files[0];if(file.size>900000){alert('请先压缩图片到 900KB 以下，后续将接入云端存储');return}const reader=new FileReader();reader.onload=()=>{checkpoint();change(key,reader.result);render()};reader.readAsDataURL(file);});
$('#undoBtn').onclick=()=>{if(!history.length)return;future.push(structuredClone(state));state=history.pop();schedule();render()};$('#redoBtn').onclick=()=>{if(!future.length)return;history.push(structuredClone(state));state=future.pop();schedule();render()};
$('#deviceDesktopBtn').onclick=()=>{frame.classList.remove('device-mobile');iframe.style.maxWidth='100%';};$('#deviceMobileBtn').onclick=()=>{iframe.style.maxWidth='390px';};
$('#previewBtn').onclick=()=>{preview=!preview;document.body.classList.toggle('oe-market-preview-mode',preview);$('#previewLabel').textContent=preview?'返回编辑':'预览'};
$('#backAdminBtn').onclick=()=>location.assign('/admin/');
const publishKey='onlyevent-studio-publish:'+t.id+':'+project+':iframe';
let publication={};try{publication=JSON.parse(localStorage.getItem(publishKey)||'{}')}catch{}
async function generateHtml(){
  const src=await (await fetch('/v8/market-'+(t.id==='03-creator-market'?'01':'02')+'-preview.html')).text();
  const common=await (await fetch('/v8/market-shared.js')).text();
  const standaloneData=JSON.stringify(state).replace(/</g,'\\u003c');
  const script=common.replace(/^export /gm,'')+'\\nconst __oeSnapshot='+standaloneData+';\\n';
  let html=src.replace(/import\\s*\\{[^}]+\\}\\s*from\\s*['"]\\/v8\\/market-shared\\.js['"];?/,'\\n'+script);
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
const css=document.createElement('style');css.textContent='.oe-market-preview-mode #studioSidebar,.oe-market-preview-mode #inspector{display:none!important}.oe-market-preview-mode .studio-shell{grid-template-columns:1fr!important}#pageContentNav [data-section]{display:block;padding:10px 13px;margin:4px 0;width:100%;text-align:left}#pageContentNav [data-section].active{background:#eee8ff;border-radius:8px}';document.head.appendChild(css);
persist();render();
