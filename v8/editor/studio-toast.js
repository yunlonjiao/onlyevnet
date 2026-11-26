export function createToast(el){
  return function toast(text){
    el.textContent=text;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t=setTimeout(()=>el.classList.remove('show'),1400);
  };
}
