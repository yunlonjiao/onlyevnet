import {previewStyle as ipOnlyStyle,previewBody as ipOnlyBody} from '/v8/templates/01-ip-only-preview.js?v=8.41.4';
import {createVariantPreview} from '/v8/templates/ip-only-visual-variants.js?v=8.38.3';
import {previewStyle as scrapbookStyle,previewBody as scrapbookBody} from '/v8/templates/02-scrapbook-preview.js?v=8.40.93';
import {previewStyle as creatorMarketStyle,previewBody as creatorMarketBody} from '/v8/templates/03-creator-market-preview.js?v=8.42.0';
import {previewStyle as creatorCatalogueStyle,previewBody as creatorCatalogueBody} from '/v8/templates/04-creator-catalogue-preview.js?v=8.43.0';
import {previewStyle as livePosterStyle,previewBody as livePosterBody} from '/v8/templates/05-live-poster-preview.js?v=8.51.0';
import {previewStyle as teaPartyStyle,previewBody as teaPartyBody} from '/v8/templates/07-tea-party-preview.js?v=8.51.0';
import {previewStyle as bandLiveStyle,previewBody as bandLiveBody} from '/v8/templates/06-band-live-preview.js?v=8.51.0';
import {previewStyle as birthdayStyle,previewBody as birthdayBody} from '/v8/templates/08-birthday-preview.js?v=8.51.0';
import {DEFAULT_TEMPLATE_ID} from '/v8/templates/registry.js?v=8.41.5';

const previews=Object.freeze({
  '01-ip-only':Object.freeze({id:'01-ip-only',style:ipOnlyStyle,body:ipOnlyBody}),
  '02-scrapbook':Object.freeze({id:'02-scrapbook',style:scrapbookStyle,body:scrapbookBody}),
  '03-creator-market':Object.freeze({id:'03-creator-market',style:creatorMarketStyle,body:creatorMarketBody}),
  '04-creator-catalogue':Object.freeze({id:'04-creator-catalogue',style:creatorCatalogueStyle,body:creatorCatalogueBody}),
  '03-school-festival':Object.freeze(createVariantPreview('03-school-festival')),
  '04-museum-editorial':Object.freeze(createVariantPreview('04-museum-editorial')),
  '05-live-poster':Object.freeze({id:'05-live-poster',style:livePosterStyle,body:livePosterBody}),
  '06-band-live':Object.freeze({id:'06-band-live',style:bandLiveStyle,body:bandLiveBody}),
  '08-birthday':Object.freeze({id:'08-birthday',style:birthdayStyle,body:birthdayBody}),
  '07-tea-party':Object.freeze({id:'07-tea-party',style:teaPartyStyle,body:teaPartyBody}),
  '06-expo-catalogue':Object.freeze(createVariantPreview('06-expo-catalogue')),
  '07-immersive-character':Object.freeze(createVariantPreview('07-immersive-character'))
});

export function getTemplatePreview(id=DEFAULT_TEMPLATE_ID){
  return previews[id]||previews[DEFAULT_TEMPLATE_ID];
}
