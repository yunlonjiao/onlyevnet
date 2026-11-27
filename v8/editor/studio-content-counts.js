export function createContentCounts({collectionArray}){
  return function syncContentCounts(){
    /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('[data-content-count]')).forEach(el=>{
      const arr=collectionArray(el.dataset.contentCount);
      el.textContent=String(Array.isArray(arr)?arr.length:0);
    });
  };
}
