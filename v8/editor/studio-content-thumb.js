import {esc} from './studio-format.js';

export function contentThumb(collection,item){
 let src='';
 if(collection==='booths')src=(item.products||[]).find(p=>p.image)?.image||'';
 if(collection==='guests')src=item.image||'';
 if(collection==='tickets')src=item.image||'';
 if(collection==='participation')src=item.image||'';
 if(collection==='featuredActivities')src=item.image||'';
 if(collection==='socialLinks')src=item.image||'';
 if(collection==='sponsors')src=item.logo||'';
 const fallback={ribbonItems:'告',tickets:'票',featuredActivities:'精',explore:'↗',participation:'参',booths:'摊',schedule:'时',guests:'嘉',guide:'指',updates:'更',socialLinks:'社',sponsors:'赞'}[collection]||'•';
 return '<span class="sidebar-content-thumb '+(src?'has-image':'')+'">'+(src?'<img src="'+esc(src)+'" alt="">':fallback)+'</span>';
}
