import {previewStyle as ipOnlyStyle,previewBody as ipOnlyBody} from '/v8/templates/01-ip-only-preview.js?v=8.39.2';
import {createVariantPreview} from '/v8/templates/ip-only-visual-variants.js?v=8.39.2';
import {previewStyle as scrapbookStyle,previewBody as scrapbookBody} from '/v8/templates/02-scrapbook-preview.js?v=8.39.2';
import {DEFAULT_TEMPLATE_ID} from '/v8/templates/registry.js?v=8.39.2';

const previews=Object.freeze({
  '01-ip-only':Object.freeze({id:'01-ip-only',style:ipOnlyStyle,body:ipOnlyBody}),
  '02-scrapbook':Object.freeze({id:'02-scrapbook',style:scrapbookStyle,body:scrapbookBody}),
  '03-school-festival':Object.freeze(createVariantPreview('03-school-festival')),
  '04-museum-editorial':Object.freeze(createVariantPreview('04-museum-editorial')),
  '05-live-poster':Object.freeze(createVariantPreview('05-live-poster')),
  '06-expo-catalogue':Object.freeze(createVariantPreview('06-expo-catalogue')),
  '07-immersive-character':Object.freeze(createVariantPreview('07-immersive-character'))
});

export function getTemplatePreview(id=DEFAULT_TEMPLATE_ID){
  return previews[id]||previews[DEFAULT_TEMPLATE_ID];
}
