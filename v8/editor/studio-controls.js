/* Identical Studio toolbar controls for every rendering template. */
export function setStudioDevice(mode,{canvas,documentRoot=document}={}){
 const mobile=mode==='mobile';
 canvas.classList.toggle('mobile',mobile);
 documentRoot.querySelectorAll('[data-device]').forEach(b=>b.classList.toggle('active',b.dataset.device===mode));
 const label=documentRoot.querySelector('#canvasDeviceLabel');
 if(label)label.textContent=mobile?'手机画布':'桌面画布';
}
export function setStudioPreviewChrome(enabled,{documentRoot=document}={}){
 const root=documentRoot.body;
 root.classList.toggle('previewing',!!enabled);
 const label=documentRoot.querySelector('#previewLabel');
 if(label)label.textContent=enabled?'退出预览':'预览';
 documentRoot.querySelector('#previewBtn')?.classList.toggle('active',!!enabled);
}

/* Shared responsive drawers. Installed once per Studio entrypoint. */
export function bindStudioMobilePanels({root=document,onSidebarSelect}={}){
 const body=root.body;
 const sidebarButton=root.querySelector('#mobilePagesBtn');
 const inspectorButton=root.querySelector('#mobileInspectorBtn');
 const backdrop=root.querySelector('#mobilePanelBackdrop');
 const close=()=>{
  body.classList.remove('mobile-sidebar-open','mobile-inspector-open');
  if(backdrop)backdrop.hidden=true;
  sidebarButton?.classList.remove('active');
  inspectorButton?.classList.remove('active');
 };
 const open=kind=>{
  const sidebar=kind==='sidebar';
  body.classList.toggle('mobile-sidebar-open',sidebar);
  body.classList.toggle('mobile-inspector-open',!sidebar);
  if(backdrop)backdrop.hidden=false;
  sidebarButton?.classList.toggle('active',sidebar);
  inspectorButton?.classList.toggle('active',!sidebar);
 };
 sidebarButton?.addEventListener('click',()=>body.classList.contains('mobile-sidebar-open')?close():open('sidebar'));
 inspectorButton?.addEventListener('click',()=>body.classList.contains('mobile-inspector-open')?close():open('inspector'));
 backdrop?.addEventListener('click',close);
 window.addEventListener('resize',()=>{if(innerWidth>820)close()});
 root.querySelector('.page-nav')?.addEventListener('click',event=>{
  if(innerWidth<=820&&event.target.closest('[data-page]')){close();onSidebarSelect?.()}
 });
 return {open,close};
}
