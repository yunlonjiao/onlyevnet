import {makeIpOnlyTemplate} from '/v8/templates/ip-only-template-factory.js?v=8.41.4';
import {template03} from '/v8/templates/03-creator-market.js?v=8.42.0';
/* Template 04 runs on the shared IP ONLY core; its art and the page-flip web catalogue differ. */
export const template04=makeIpOnlyTemplate({
 id:'04-creator-catalogue',name:'04 · 创作者场刊',label:'创作者场刊',studioName:'创作者场刊',
 description:'把活动做成一本能翻页的电子场刊：插画封面，社团按摊位号排好，适合同人展。',
 structureProfile:'catalogue',artDirection:'illustrated-catalogue',motionProfile:'catalogue',
 theme:'#ff7eb6',heroTitleColor:'#ffffff',heroTitleAccentColor:'#ff7eb6',
 presentationProfile:{entryAnimation:true,quickAccess:false,ribbon:false,mobileDock:false,scrollProgress:false,floatingStickers:false,passportProgress:false,decorativeSectionOrbits:false,catalogueBook:true},
 studioPages:{hidden:[],hiddenContent:['ribbonItems'],customPages:false},
 design:{hero:'split-framed-art+title',motif:'rays-and-stars'}
});
// Same creator-fair starter content as 03; only the presentation differs.
const d=template04.defaults,base=structuredClone(template03.defaults);
for(const key of ['tagline','modules','tickets','booths','venueMap','updates','socialLinks','featuredActivities','guests','schedule','participation'])d[key]=base[key];
d.tagline='翻开电子场刊，找到你想去的每一个社团。';
