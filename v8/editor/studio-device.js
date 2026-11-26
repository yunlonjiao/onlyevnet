export function initDeviceControls({$,canvas,setStudioDevice}){
  const setDevice=(mode)=>setStudioDevice(mode,{canvas});
  $('#deviceDesktopBtn').onclick=()=>setDevice('desktop');
  $('#deviceMobileBtn').onclick=()=>setDevice('mobile');
  const sync=()=>{const coarse=matchMedia('(pointer:coarse)').matches;const shortLandscape=coarse&&innerHeight<=560;try{setDevice(innerWidth<=820||shortLandscape?'mobile':'desktop')}catch(e){}};
  sync();
  let timer=null;
  window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(sync,150)});
}
