/* Identical Studio toolbar controls for every rendering template. */
/** @param {'desktop'|'mobile'} mode @param {{canvas:HTMLElement, documentRoot?:Document}} [options] */
export function setStudioDevice(mode,{canvas,documentRoot=document}=/** @type {{canvas:HTMLElement,documentRoot?:Document}} */ ({})){
 const mobile=mode==='mobile';
 canvas.classList.toggle('mobile',mobile);
 /** @type {NodeListOf<HTMLElement>} */ (documentRoot.querySelectorAll('[data-device]')).forEach(b=>b.classList.toggle('active',b.dataset.device===mode));
 const label=documentRoot.querySelector('#canvasDeviceLabel');
 if(label)label.textContent=mobile?'手机画布':'桌面画布';
}
export function setStudioPreviewChrome(enabled,{documentRoot=document}={}){
 const root=documentRoot.body;
 root.classList.toggle('previewing-safe',!!enabled);
 const label=documentRoot.querySelector('#previewLabel');
 if(label)label.textContent=enabled?'退出预览':'预览';
 documentRoot.querySelector('#previewBtn')?.classList.toggle('active',!!enabled);
}
