export function customPageKey(id){return 'custom-'+id}
export function customPageByKey(pages,key){return (pages||[]).find(p=>customPageKey(p.id)===key)}
export function customPageIndex(pages,id){return (pages||[]).findIndex(p=>String(p.id)===String(id))}
export function pageLabel(key,pages,labels={}){return labels[key]||customPageByKey(pages,key)?.title||(key==='home'?'首页':key==='animation'?'动画页面':'页面')}
