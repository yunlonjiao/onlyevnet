/*
 * OnlyEvent IP ONLY Shared Core Contract
 * v8.37.1
 *
 * This file defines the product capabilities every IP ONLY template must support.
 * It is intentionally visual-agnostic: templates decide markup, composition, density,
 * typography and motion; the core defines data, behavior and editing contracts.
 */

export const IP_ONLY_CORE_VERSION='8.37.1';

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

export const IP_ONLY_CORE_CAPABILITIES=Object.freeze({
  event:{
    lifecycle:['auto-status','manual-status','start-end-datetime'],
    identity:['eventName','date','location','edition','tagline'],
    hero:['desktop-image','mobile-image','focal-position','title-lines','title-size','title-colors'],
    seo:['pageTitle','metaDescription','canonical','ogTitle','ogDescription','ogImage'],
    entry:['enabled','skip','style','title','subtitle','label','accent','duration']
  },
  navigation:{
    pages:['home','booths','activities','guests','guide','custom-pages'],
    moduleVisibility:true,
    quickAccess:true,
    desktopAndMobile:true,
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
    featuredSlots:3,
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
  return errors;
}
