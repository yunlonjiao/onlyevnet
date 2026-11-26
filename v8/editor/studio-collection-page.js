import {COLLECTION_PAGE,INLINE_HOME_COLLECTIONS} from './studio-page-content.js';

export function collectionStudioPageFor(collection,{currentPage,templateId}){
  const page=COLLECTION_PAGE[collection]||currentPage||'home';
  if(page!=='home'&&/^0[56]/.test(templateId||'')&&INLINE_HOME_COLLECTIONS.has(page))return 'home';
  return page;
}
