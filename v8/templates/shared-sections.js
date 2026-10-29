/* Building blocks for templates that keep Template 01's hooks (so the shared renderer, editor and
   exporter work unchanged) but compose their own page. Sections are taken from 01's markup and given
   a new heading, so a hook that 01 adds later reaches every template that uses them. */
import {previewStyle as coreStyle,previewBody as coreBody} from '/v8/templates/01-ip-only-preview.js?v=8.41.4';

export {coreStyle};

export function coreSection(id,{ey,title,back}={}){
  const match=coreBody.match(new RegExp('<section[^>]*id="'+id+'"[\\s\\S]*?</section>'));
  if(!match)throw new Error('Template 01 has no #'+id+' section');
  let html=match[0];
  if(ey||title)html=html.replace(/<span class="ey">[^<]*<\/span><h2>[^<]*<\/h2>/,'<span class="ey">'+(ey||'')+'</span><h2>'+(title||'')+'</h2>');
  if(back===false)html=html.replace(/<a class="section-back"[^>]*>[^<]*<\/a>/,'');
  return html.replace(/<span class="section-no">[^<]*<\/span>/g,'');
}

export function coreRibbon(){
  const match=coreBody.match(/<div class="ribbon"[\s\S]*?<\/div><\/div>(?=\s*<section)/);
  if(!match)throw new Error('Template 01 has no ribbon');
  return match[0];
}

export const head=(ey,title,extra='')=>'<div class="head"><div><span class="ey">'+ey+'</span><h2>'+title+'</h2></div>'+extra+'</div>';
