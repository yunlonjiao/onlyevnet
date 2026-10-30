import {DEFAULT_TEMPLATE_ID} from '/v8/templates/registry.js?v=8.41.5';

/* Each template's preview (markup + style) is loaded on demand: the editor only needs the one that is open.
   The build script (cloud/scripts/sync-web.mjs) reads this table to add preload hints for the open template. */
const PREVIEW_FILES={
  '01-ip-only':'/v8/templates/01-ip-only-preview.js?v=8.41.4',
  '02-scrapbook':'/v8/templates/02-scrapbook-preview.js?v=8.40.93',
  '03-creator-market':'/v8/templates/03-creator-market-preview.js?v=8.42.0',
  '04-creator-catalogue':'/v8/templates/04-creator-catalogue-preview.js?v=8.43.0',
  '05-live-poster':'/v8/templates/05-live-poster-preview.js?v=8.51.0',
  '06-band-live':'/v8/templates/06-band-live-preview.js?v=8.51.0',
  '07-tea-party':'/v8/templates/07-tea-party-preview.js?v=8.51.0',
  '08-birthday':'/v8/templates/08-birthday-preview.js?v=8.51.0'
};
// Older saved projects may still name these layouts; they come from the shared variant builder.
const VARIANT_IDS=new Set(['03-school-festival','04-museum-editorial','06-expo-catalogue','07-immersive-character']);

const loaded=new Map();
export async function loadTemplatePreview(id=DEFAULT_TEMPLATE_ID){
  const key=PREVIEW_FILES[id]||VARIANT_IDS.has(id)?id:DEFAULT_TEMPLATE_ID;
  if(loaded.has(key))return loaded.get(key);
  let preview;
  if(VARIANT_IDS.has(key)){
    const {createVariantPreview}=await import('/v8/templates/ip-only-visual-variants.js?v=8.38.3');
    preview=Object.freeze(createVariantPreview(key));
  }else{
    const mod=await import(PREVIEW_FILES[key]);
    preview=Object.freeze({id:key,style:mod.previewStyle,body:mod.previewBody});
  }
  loaded.set(key,preview);
  return preview;
}

// Synchronous lookup for a template whose preview was loaded with loadTemplatePreview.
export function getTemplatePreview(id=DEFAULT_TEMPLATE_ID){
  return loaded.get(id)||loaded.get(DEFAULT_TEMPLATE_ID)||{id:'',style:'',body:''};
}
