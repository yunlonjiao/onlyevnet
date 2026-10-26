import {makeIpOnlyTemplate} from '/v8/templates/ip-only-template-factory.js?v=8.41.4';
import {template03} from '/v8/templates/03-creator-market.js?v=8.42.0';
/* Template 04 runs on the shared IP ONLY core; its art and the page-flip web catalogue differ. */
export const template04=makeIpOnlyTemplate({
 id:'04-creator-catalogue',name:'04 · CREATOR CATALOGUE',label:'CREATOR CATALOGUE',studioName:'CREATOR CATALOGUE',
 description:'二次元插画主视觉与可翻阅的创作者电子场刊。',
 structureProfile:'catalogue',artDirection:'illustrated-catalogue',motionProfile:'catalogue',
 theme:'#ff7eb6',heroTitleColor:'#ffffff',heroTitleAccentColor:'#ff7eb6',
 presentationProfile:{entryAnimation:true,quickAccess:false,ribbon:false,mobileDock:false,scrollProgress:false,floatingStickers:false,passportProgress:false,decorativeSectionOrbits:false,catalogueBook:true},
 studioPages:{hidden:['activities','guests'],hiddenContent:['ribbonItems','featuredActivities'],customPages:false}
});
// Same creator-fair starter content as 03; only the presentation differs.
const d=template04.defaults,base=structuredClone(template03.defaults);
for(const key of ['tagline','modules','tickets','booths','venueMap','updates','socialLinks','featuredActivities'])d[key]=base[key];
d.tagline='翻开电子场刊，找到你想去的每一个社团。';
