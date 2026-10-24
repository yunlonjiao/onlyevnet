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
