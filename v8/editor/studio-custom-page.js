import {CUSTOM_PAGE_PRESETS,CUSTOM_PAGE_STARTERS} from './studio-presets.js';

export function buildStarterItems(presetKey,uid){
  const rows=CUSTOM_PAGE_STARTERS[presetKey]||CUSTOM_PAGE_STARTERS.custom;
  return rows.map(([title,meta,text])=>({id:uid('ci'),title,meta,text,image:'',url:''}));
}

export function customPagePreset(page){
  return CUSTOM_PAGE_PRESETS[page?.preset]||CUSTOM_PAGE_PRESETS.custom;
}
