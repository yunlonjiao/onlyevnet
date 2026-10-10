import {previewStyle as ipOnlyStyle,previewBody as ipOnlyBody} from '/v8/templates/01-ip-only-preview.js?v=8.34.52';
import {DEFAULT_TEMPLATE_ID} from '/v8/templates/registry.js?v=8.34.52';

const previews=Object.freeze({
  '01-ip-only':Object.freeze({id:'01-ip-only',style:ipOnlyStyle,body:ipOnlyBody})
});

export function getTemplatePreview(id=DEFAULT_TEMPLATE_ID){
  return previews[id]||previews[DEFAULT_TEMPLATE_ID];
}
