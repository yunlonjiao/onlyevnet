/* Shared image-crop operations used by Studio's IP ONLY and creator editors. */
let cropperPromise;
export function loadStudioCropper(){
 if(!cropperPromise)cropperPromise=import('https://cdn.jsdelivr.net/npm/cropperjs@2.2.0/+esm').catch(error=>{cropperPromise=null;throw error});
 return cropperPromise;
}
export async function cropSelectionToDataUrl(selection,{width,height,ratio,maxSize=1600,quality=.86}={}){
 if(!selection?.$toCanvas)throw new Error('未找到裁剪区域');
 if(!ratio){
  const r=Math.max(.1,Number(selection.width||1)/Math.max(1,Number(selection.height||1)));
  width=r>=1?maxSize:Math.max(1,Math.round(maxSize*r));
  height=r>=1?Math.max(1,Math.round(maxSize/r)):maxSize;
 }
 const canvas=await selection.$toCanvas({width,height});
 const blob=await new Promise((resolve,reject)=>canvas.toBlob(x=>x?resolve(x):reject(new Error('图片编码失败')),'image/webp',quality));
 return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
}

/* Visual cropper template and controls proven by Template 01/02. */
export async function createStudioCropper({image,stage,ratio,coverage=.72}={}){
 const mod=await loadStudioCropper(),Cropper=mod.default||mod.Cropper;
 stage.querySelectorAll('cropper-canvas').forEach(node=>node.remove());
 try{await image.decode()}catch{}
 const ratioAttr=Number.isFinite(ratio)&&ratio>0?' aspect-ratio="'+ratio+'" initial-aspect-ratio="'+ratio+'"':'';
 const handles='<cropper-handle action="n-resize"></cropper-handle><cropper-handle action="e-resize"></cropper-handle><cropper-handle action="s-resize"></cropper-handle><cropper-handle action="w-resize"></cropper-handle><cropper-handle action="ne-resize"></cropper-handle><cropper-handle action="nw-resize"></cropper-handle><cropper-handle action="se-resize"></cropper-handle><cropper-handle action="sw-resize"></cropper-handle>';
 const template='<cropper-canvas background><cropper-image initial-center-size="contain" rotatable></cropper-image><cropper-shade hidden></cropper-shade><cropper-selection initial-coverage="'+coverage+'"'+ratioAttr+' movable resizable outlined><cropper-grid role="grid" bordered covered></cropper-grid><cropper-crosshair centered></cropper-crosshair><cropper-handle action="move" theme-color="rgba(255,255,255,.32)"></cropper-handle>'+handles+'</cropper-selection></cropper-canvas>';
 return new Cropper(image,{container:stage,template});
}
