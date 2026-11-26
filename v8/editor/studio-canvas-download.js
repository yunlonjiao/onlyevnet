export function canvasToBlob(canvas,type='image/webp',quality=.9){
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('图片编码失败')),type,quality));
}

export function downloadSvg(svg,name){
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
}
