import {canvasToBlob} from './studio-canvas-download.js';
import {cropSelectionInside} from './studio-crop-helpers.js';

export function createImageCropper({ $, getState, send, setDeep, checkpoint, toast, storeCroppedImage, imageSlotConfig, createStudioCropper, loadStudioCropper, openImageInspector, renderRecapDialog, openCustomPageItemInspector, openProductInspector, openItemInspector }){
let activeCropper=null,cropContext=null;
const getCropperModule=loadStudioCropper;
async function prepareCropFile(file,cfg){
 // Old-CMS fast path: most files enter the cropper immediately without re-encoding.
 const directLimit=10*1024*1024;
 if(file.size<=directLimit)return {url:URL.createObjectURL(file),optimized:false};
 try{
   const bitmap=await createImageBitmap(file);
   const long=Math.max(bitmap.width,bitmap.height),max=cfg.free?3600:3200;
   if(!long||long<=max){
     bitmap.close?.();
     return {url:URL.createObjectURL(file),optimized:false};
   }
   const scale=max/long,w=Math.max(1,Math.round(bitmap.width*scale)),h=Math.max(1,Math.round(bitmap.height*scale));
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   canvas.getContext('2d',{alpha:false}).drawImage(bitmap,0,0,w,h);
   bitmap.close?.();
   const blob=await canvasToBlob(canvas,'image/webp',.92);
   return {url:URL.createObjectURL(blob),optimized:true};
 }catch(err){
   console.warn('[OnlyEvent large crop preview]',err);
   return {url:URL.createObjectURL(file),optimized:false};
 }
}
if('requestIdleCallback' in window)requestIdleCallback(()=>getCropperModule(),{timeout:1800});
else setTimeout(()=>getCropperModule(),900);
function fitCropSelectionToImage(){
 const selection=activeCropper?.getCropperSelection?.(),cropperImage=activeCropper?.getCropperImage?.(),cropperCanvas=activeCropper?.getCropperCanvas?.();
 if(!selection||!cropperImage||!cropperCanvas||!cropContext)return;
 const canvasRect=cropperCanvas.getBoundingClientRect(),imageRect=cropperImage.getBoundingClientRect();
 const left=imageRect.left-canvasRect.left,top=imageRect.top-canvasRect.top,imgW=imageRect.width,imgH=imageRect.height;
 if(!imgW||!imgH)return;
 const pad=.88,ratio=cropContext.cfg.ratio;
 let width=imgW*pad,height=imgH*pad;
 if(cropContext.cfg.fixed&&Number.isFinite(ratio)&&ratio>0){
   if(width/height>ratio)width=height*ratio;else height=width/ratio;
   if(width>imgW*pad){width=imgW*pad;height=width/ratio}
   if(height>imgH*pad){height=imgH*pad;width=height*ratio}
 }
 const x=left+(imgW-width)/2,y=top+(imgH-height)/2;
 selection.$change?.(x,y,width,height,cropContext.cfg.fixed?ratio:NaN);
}
function keepCropSelectionInsideImage(event){
 const cropperCanvas=activeCropper?.getCropperCanvas?.(),cropperImage=activeCropper?.getCropperImage?.();
 if(!cropperCanvas||!cropperImage)return;
 if(!cropSelectionInside(cropperCanvas.getBoundingClientRect(),cropperImage.getBoundingClientRect(),event.detail||{}))event.preventDefault();
}
let cropPreviewFrame=0,cropPreviewSeq=0;
function scheduleCropPreview(){
 cancelAnimationFrame(cropPreviewFrame);
 cropPreviewFrame=requestAnimationFrame(()=>renderCropPreview());
}
async function renderCropPreview(){
 const selection=activeCropper?.getCropperSelection?.(),canvas=$('#cropPreviewCanvas'),shell=$('#cropPreviewShell');
 if(!selection||!canvas||!shell||!cropContext)return;
 const seq=++cropPreviewSeq,ratio=Math.max(.1,Number(selection.width||1)/Math.max(1,Number(selection.height||1)));
 const maxW=Math.max(220,Math.min(420,shell.clientWidth||360));
 const width=Math.round(maxW),height=Math.max(120,Math.round(width/ratio));
 try{
   const cropped=await selection.$toCanvas({width,height});
   if(seq!==cropPreviewSeq||!cropContext)return;
   canvas.width=cropped.width;canvas.height=cropped.height;
   canvas.style.aspectRatio=cropped.width+' / '+cropped.height;
   const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(cropped,0,0);
 }catch(err){console.warn('[OnlyEvent crop preview]',err)}
}

async function open(src,path,returnCollection='',returnIndex='',ownedUrl=''){
 const dlg=$('#imageCropDialog'),stage=$('#cropStage'),img=$('#cropImage'),cfg=imageSlotConfig(path);
 cropContext={path,returnCollection,returnIndex,cfg,src,ownedUrl};
 $('#cropSlotLabel').textContent=cfg.label;
 $('#cropRatioLabel').textContent=cfg.ratioLabel;
 img.src=src;
 dlg.showModal();
 send({type:'OE_CROP_ACTIVE',active:true});
 stage.classList.add('loading');
 try{
   if(activeCropper?.destroy)activeCropper.destroy();
   await new Promise(res=>{if(img.complete&&img.naturalWidth)return res();img.addEventListener('load',res,{once:true});img.addEventListener('error',res,{once:true});});
   activeCropper=await createStudioCropper({image:img,stage,ratio:cfg.ratio,coverage:.9});
   const selection=activeCropper.getCropperSelection?.();
   if(selection){
     if(cfg.fixed&&Number.isFinite(cfg.ratio)){selection.aspectRatio=cfg.ratio;selection.initialAspectRatio=cfg.ratio}
     selection.addEventListener('change',e=>{keepCropSelectionInsideImage(e);if(cfg.fixed&&Number.isFinite(cfg.ratio)){const w=Number(selection.width||0),h=Number(selection.height||0);if(w>1&&h>1){const fit=w/cfg.ratio;if(Math.abs(h-fit)>0.6)selection.height=fit}}if(!e.defaultPrevented)scheduleCropPreview()});
   }
   requestAnimationFrame(()=>{activeCropper?.reset?.();fitCropSelectionToImage();scheduleCropPreview();setTimeout(()=>{fitCropSelectionToImage();scheduleCropPreview()},120)});
 }catch(err){
   console.error('[OnlyEvent cropper]',err);toast('裁剪器加载失败，可稍后重试');close();
 }finally{stage.classList.remove('loading')}
}
function close(){
 cancelAnimationFrame(cropPreviewFrame);cropPreviewSeq++;
 if(activeCropper?.destroy)activeCropper.destroy();
 activeCropper=null;
 const ownedUrl=cropContext?.ownedUrl||'';
 cropContext=null;
 if(ownedUrl)URL.revokeObjectURL(ownedUrl);
 send({type:'OE_CROP_ACTIVE',active:false});
 const dlg=$('#imageCropDialog');if(dlg.open)dlg.close();
}
async function apply(){
 if(!activeCropper||!cropContext)return;
 const selection=activeCropper.getCropperSelection?.();if(!selection){toast('未找到裁剪区域');return}
 const applyBtn=$('#cropApply');if(applyBtn){applyBtn.dataset.label=applyBtn.textContent;applyBtn.textContent='上传中…';applyBtn.classList.add('is-busy')}
 $('#cropApply').disabled=true;
 try{
   let width=cropContext.cfg.width,height=cropContext.cfg.height;
   if(cropContext.cfg.free){
     const ratio=Math.max(.1,Number(selection.width||1)/Math.max(1,Number(selection.height||1))),max=cropContext.cfg.maxSize||2000;
     if(ratio>=1){width=max;height=Math.max(1,Math.round(max/ratio))}else{height=max;width=Math.max(1,Math.round(max*ratio))}
   }
   const cropped=await selection.$toCanvas({width,height});
   const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const cx=canvas.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,width,height);cx.drawImage(cropped,0,0,width,height);
   const blob=await canvasToBlob(canvas,'image/webp',.9);
   const data=await storeCroppedImage(blob);
   checkpoint();setDeep(cropContext.path,data);
   if(/^(?:heroImage|mobileHeroImage)$/.test(cropContext.path)||/^tickets\.\d+\.image$/.test(cropContext.path))send({type:'OE_PATCH_FIELD',path:cropContext.path,value:data});else send({type:'OE_REPLACE_STATE',state:getState()});
   toast('图片已应用');
   const c=cropContext.returnCollection,i=Number(cropContext.returnIndex),croppedPath=cropContext.path;close();
   if(/^venueMap\.(?:image|more\.\d+\.image)$/.test(croppedPath))openImageInspector('venueMap.image');
   if(/^recap\./.test(croppedPath))renderRecapDialog();
   if(c&&Number.isInteger(i)){if(c.startsWith('custom:'))openCustomPageItemInspector(c.slice(7),i);else if(c.startsWith('product:'))openProductInspector(Number(c.slice(8)),i);else openItemInspector(c,i)}
 }catch(err){console.error('[OnlyEvent crop apply]',err);toast('裁剪失败，请重试')}
 finally{const b=$('#cropApply');if(b){b.disabled=false;if(b.dataset.label){b.textContent=b.dataset.label;delete b.dataset.label}b.classList.remove('is-busy')}}
}
function bind(){
$('#cropApply').onclick=apply;
$('#cropCancel').onclick=close;
$('#cropClose').onclick=close;
$('#imageCropDialog').addEventListener('cancel',e=>{e.preventDefault();close()});
$('#cropReset').onclick=()=>{fitCropSelectionToImage();scheduleCropPreview()};
$('#cropZoomOut').onclick=()=>{const im=activeCropper?.getCropperImage?.();if(im?.$zoom){im.$zoom(-.18);scheduleCropPreview()}else toast('裁剪器不支持缩小')};
$('#cropZoomIn').onclick=()=>{const im=activeCropper?.getCropperImage?.();if(im?.$zoom){im.$zoom(.18);scheduleCropPreview()}else toast('裁剪器不支持放大')};
$('#cropRotateLeft').onclick=()=>{activeCropper?.getCropperImage?.()?.$rotate?.('-90deg');requestAnimationFrame(()=>{fitCropSelectionToImage();scheduleCropPreview()})};

$('#imageInput').addEventListener('change',async e=>{
 const file=e.target.files?.[0],path=e.target.dataset.path;
 const returnCollection=e.target.dataset.returnCollection||'',returnIndex=e.target.dataset.returnIndex||'';
 e.target.value='';delete e.target.dataset.returnCollection;delete e.target.dataset.returnIndex;
 if(!file||!path)return;
 const cfg=imageSlotConfig(path);
 try{
   if(file.size>10*1024*1024)toast('正在准备超大图片…');
   const prepared=await prepareCropFile(file,cfg);
   open(prepared.url,path,returnCollection,returnIndex,prepared.url);
 }catch(err){console.error('[OnlyEvent image input]',err);toast('图片读取失败')}
});
}
  return {open,close,apply,bind};
}
