/*
 * OnlyEvent IP ONLY Shared Core Contract
 * v8.40.1
 *
 * This file defines the product capabilities every IP ONLY template must support.
 * It is intentionally visual-agnostic: templates decide markup, composition, density,
 * typography and motion; the core defines data, behavior and editing contracts.
 */

export const IP_ONLY_CORE_VERSION='8.40.1';

export const IP_ONLY_CORE_MODULES=Object.freeze([
  'ribbon',
  'tickets',
  'booths',
  'activities',
  'guests',
  'guide',
  'map',
  'community',
  'sponsors',
  'customPages',
  'freewalk',
  'itasha'
]);

export const IP_ONLY_CORE_PAGES=Object.freeze([
  'home',
  'booths',
  'activities',
  'guests',
  'guide'
]);


/* Mandatory capabilities are behavioral contracts already proven in Template 01.
   Every IP ONLY template must preserve these behaviors even if its visual structure differs. */
export const IP_ONLY_MANDATORY_CAPABILITIES=Object.freeze({
  editing:[
    'inline-editable-visible-copy',
    'card-or-surface-selection',
    'right-side-editor-selection',
    'image-field-editing',
    'edit-preview-interaction-isolation'
  ],
  relations:[
    'featured-activity-linking',
    'activity-schedule-linking',
    'activity-guest-linking',
    'schedule-guest-linking',
    'map-target-linking',
    'custom-page-navigation'
  ],
  visitor:[
    'booth-favorites',
    'product-wishlist',
    'search',
    'image-lightbox',
    'external-links',
    'module-visibility',
    'standalone-export'
  ],
  media:[
    'desktop-mobile-hero-media',
    'lazy-loading',
    'broken-image-guard'
  ]
});

/* Presentation capabilities exist in Shared Core but are opt-in per template.
   Their presence on the visitor site is decided by the reference-site design, not by Template 01. */
export const IP_ONLY_OPTIONAL_PRESENTATION_CAPABILITIES=Object.freeze([
  'entry-animation',
  'ribbon',
  'quick-access',
  'mobile-dock',
  'scroll-progress',
  'floating-stickers',
  'passport-progress',
  'decorative-section-orbits'
]);

export const DEFAULT_IP_ONLY_PRESENTATION_PROFILE=Object.freeze({
  entryAnimation:false,
  ribbon:false,
  quickAccess:false,
  mobileDock:false,
  scrollProgress:false,
  floatingStickers:false,
  passportProgress:false,
  decorativeSectionOrbits:false
});

export const IP_ONLY_CORE_CAPABILITIES=Object.freeze({
  event:{
    lifecycle:['auto-status','manual-status','start-end-datetime'],
    identity:['eventName','date','location','edition','tagline'],
    hero:['desktop-image','mobile-image','focal-position','editable-title','template-defined-title-layout'],
    seo:['pageTitle','metaDescription','canonical','ogTitle','ogDescription','ogImage'],
    entry:['enabled','skip','style','title','subtitle','label','accent','duration'],
    entryPresentation:'optional-per-template'
  },
  navigation:{
    pages:['home','booths','activities','guests','guide','custom-pages'],
    moduleVisibility:true,
    quickAccess:'optional-per-template',
    desktopAndMobile:'template-defined-navigation-surface',
    lifecycleAware:true
  },
  tickets:{
    collection:true,
    fields:['name','price','gift','note','image'],
    externalPurchaseLink:true,
    imageLightbox:true
  },
  booths:{
    collection:true,
    fields:['no','name','logo','type','intro'],
    products:['name','tag','price','note','image'],
    search:['name','tag'],
    views:['booths','products'],
    favorites:true,
    productWishlist:true,
    imageLightbox:true,
    directSelection:true
  },
  activities:{
    collection:true,
    fields:['preset','activityType','title','meta','text','detail','participationMode','requirements','rules','url','image'],
    featuredSlots:'unbounded-linked-activity-list',
    scheduleLinking:true,
    guestLinking:true,
    externalRegistration:true,
    views:['timeline','programs'],
    dayFiltering:true,
    directSelection:true
  },
  schedule:{
    collection:true,
    fields:['day','time','endTime','title','stage','category','detail','guestIds','registrationUrl','participationId'],
    dayFiltering:true,
    guestLinking:true,
    activityLinking:true,
    externalRegistration:true
  },
  guests:{
    collection:true,
    types:['person','duo','band','official'],
    fields:['name','role','members','attendanceNote','works','intro','image','socialLabel','socialUrl','appearance'],
    imageLightbox:true,
    activityLinking:true
  },
  guide:{
    collection:true,
    presets:['traffic','admission','facilities','cosplay','safety'],
    fields:['title','label','text','image'],
    navigationLink:true,
    imageLightbox:true
  },
  venueMap:{
    image:true,
    linkedTargets:true,
    targetMode:'internal-page-or-item',
    linksTo:['activities','booths','pages','items']
  },
  community:{
    collection:true,
    fields:['label','note','url','image'],
    qrOrImage:true,
    externalLinks:true
  },
  sponsors:{
    collection:true,
    fields:['name','logo','url'],
    externalLinks:true
  },
  customPages:{
    collection:true,
    firstClassNavigation:true,
    editable:true,
    exportable:true
  },
  optionalPages:{
    freewalk:true,
    itasha:true
  },
  editing:{
    inlineFields:'data-oe-field',
    selectableItems:['data-oe-item','data-oe-index'],
    imageFields:'data-oe-image',
    directEdit:true,
    sidePanelSelection:true,
    mirroredFields:true
  },
  visitorState:{
    favoritesStorage:'localStorage',
    boothFavorites:true,
    productWishlist:true,
    resetInvalidIds:true
  },
  media:{
    lazyLoading:true,
    asyncDecoding:true,
    brokenImageGuard:true,
    lightbox:true
  },
  export:{
    standaloneHtml:true,
    stripEditorMetadata:true,
    preserveVisitorInteractions:true,
    lifecycleAware:true,
    removeEmptyEditorPlaceholders:true
  }
});

export const IP_ONLY_CORE_RELATIONS=Object.freeze({
  featuredActivities:'featuredActivities[].participationId -> participation[].id',
  scheduleActivity:'schedule[].participationId -> participation[].id',
  activityGuests:'participation[].guestIds[] -> guests[].id',
  scheduleGuests:'schedule[].guestIds[] -> guests[].id',
  mapTargets:'venueMap.links[] -> page/item target',
  boothProducts:'booths[].products[] nested under booth',
  customNav:'customPages[] -> standalone route'
});

export const IP_ONLY_CORE_EDIT_PROTOCOL=Object.freeze({
  field:'data-oe-field',
  item:'data-oe-item',
  index:'data-oe-index',
  image:'data-oe-image',
  pageLink:'data-page-link',
  targetMode:'data-target-mode',
  activityId:'data-activity-plan-id',
  boothFavorite:'data-favorite-booth',
  productWishlist:'data-wishlist-product'
});

export function getIpOnlyCoreManifest(){
  return {
    version:IP_ONLY_CORE_VERSION,
    modules:[...IP_ONLY_CORE_MODULES],
    pages:[...IP_ONLY_CORE_PAGES],
    mandatoryCapabilities:IP_ONLY_MANDATORY_CAPABILITIES,
    optionalPresentationCapabilities:[...IP_ONLY_OPTIONAL_PRESENTATION_CAPABILITIES],
    defaultPresentationProfile:{...DEFAULT_IP_ONLY_PRESENTATION_PROFILE},
    capabilities:IP_ONLY_CORE_CAPABILITIES,
    relations:IP_ONLY_CORE_RELATIONS,
    editProtocol:IP_ONLY_CORE_EDIT_PROTOCOL
  };
}

export function validateIpOnlyTemplateDefinition(template){
  const errors=[];
  if(!template||typeof template!=='object')return ['template definition is missing'];
  if(!template.id)errors.push('template.id is required');
  if(!template.renderer)errors.push('template.renderer is required');
  const supported=new Set(template.supportedModules||[]);
  IP_ONLY_CORE_MODULES.forEach(key=>{if(!supported.has(key))errors.push('missing supported module: '+key)});
  if(!template.defaults||typeof template.defaults!=='object')errors.push('template.defaults is required');
  if(!template.presentationProfile||typeof template.presentationProfile!=='object')errors.push('template.presentationProfile is required');
  return errors;
}
