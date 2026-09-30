export const qs=s=>document.querySelector(s);
export const qsa=s=>[...document.querySelectorAll(s)];
export const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function getByPath(root,path){return path.split('.').reduce((o,k)=>o?.[/^\d+$/.test(k)?Number(k):k],root)}
export function setByPath(root,path,value){const a=path.split('.');let o=root;for(let i=0;i<a.length-1;i++)o=o[/^\d+$/.test(a[i])?Number(a[i]):a[i]];o[/^\d+$/.test(a.at(-1))?Number(a.at(-1)):a.at(-1)]=value}
