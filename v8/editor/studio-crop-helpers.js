export function cropSelectionInside(canvasRect,imageRect,detail){
  const left=imageRect.left-canvasRect.left,top=imageRect.top-canvasRect.top,right=left+imageRect.width,bottom=top+imageRect.height,eps=.5;
  return !(detail.x<left-eps||detail.y<top-eps||detail.x+detail.width>right+eps||detail.y+detail.height>bottom+eps);
}
