import {previewStyle as ipOnlyStyle,previewBody as ipOnlyBody} from '/v8/templates/01-ip-only-preview.js?v=8.40.1';
import {previewStyle as scrapbookStyle,previewBody as scrapbookBody} from '/v8/templates/02-scrapbook-preview.js?v=8.40.1';
import {previewStyle as catalogStyle,previewBody as catalogBody} from '/v8/templates/03-school-festival-preview.js?v=8.40.1';
import {previewStyle as creatorStyle,previewBody as creatorBody} from '/v8/templates/04-museum-editorial-preview.js?v=8.40.1';
import {previewStyle as liveStyle,previewBody as liveBody} from '/v8/templates/05-live-poster-preview.js?v=8.40.1';
import {createVariantPreview} from '/v8/templates/ip-only-visual-variants.js?v=8.40.1';
import {DEFAULT_TEMPLATE_ID} from '/v8/templates/registry.js?v=8.40.1';

const previews=Object.freeze({
  '01-ip-only':Object.freeze({id:'01-ip-only',style:ipOnlyStyle,body:ipOnlyBody}),
  '02-scrapbook':Object.freeze({id:'02-scrapbook',style:scrapbookStyle,body:scrapbookBody}),
  '03-school-festival':Object.freeze({id:'03-school-festival',style:catalogStyle,body:catalogBody}),
  '04-museum-editorial':Object.freeze({id:'04-museum-editorial',style:creatorStyle,body:creatorBody}),
  '05-live-poster':Object.freeze({id:'05-live-poster',style:liveStyle,body:liveBody}),
  '06-expo-catalogue':Object.freeze(createVariantPreview('06-expo-catalogue')),
  '07-immersive-character':Object.freeze(createVariantPreview('07-immersive-character'))
});

export function getTemplatePreview(id=DEFAULT_TEMPLATE_ID){
  return previews[id]||previews[DEFAULT_TEMPLATE_ID];
}
