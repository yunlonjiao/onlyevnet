/* One Studio entrypoint; renderer/data adapters are selected by the template contract. */
import {getTemplate,DEFAULT_TEMPLATE_ID} from '/v8/templates/registry.js?v=8.41.5';
const params=new URLSearchParams(location.search);
const template=getTemplate(params.get('template')||DEFAULT_TEMPLATE_ID);
if(template.eventType==='creator-market'){
 await import('/v8/editor/creator-studio.js');
}else{
 await import('/v8/app.js?v=8.40.76');
}
