export function createContentCounts({collectionArray}){
  return function syncContentCounts(){
    document.querySelectorAll('[data-content-count]').forEach(el=>{
      const arr=collectionArray(el.dataset.contentCount);
      el.textContent=Array.isArray(arr)?arr.length:0;
    });
  };
}
