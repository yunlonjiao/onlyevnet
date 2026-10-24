import {IP_ONLY_CORE_MODULES,DEFAULT_IP_ONLY_PRESENTATION_PROFILE} from '/v8/templates/ip-only-core-contract.js?v=8.37.2';
import {createIpOnlyDefaults} from '/v8/templates/ip-only-defaults.js?v=8.37.0';
export const template01 = {
  id:'01-ip-only',
  name:'01 · STAR BEAT ONLY',
  label:'STAR BEAT ONLY',
  studioName:'STAR BEAT ONLY',
  category:'单 IP / 同好活动',
  version:'1.0.0',
  description:'以鲜明配色、趣味贴纸、粗描边和活力卡片构成的二次元活动网站。',
  structureProfile:'portal',
  artDirection:'international-festival',
  motionProfile:'energetic',
  supportedModules:[...IP_ONLY_CORE_MODULES],
  recommendedFor:['单 IP ONLY','角色主题活动','同好综合活动','几百至几千人活动'],
  notRecommendedFor:['大型综合商业展会','多 IP 综合漫展'],
  heroRenderer:'hero.portal',
  guestRenderer:'guest.grid',
  boothRenderer:'booth.cards',
  programRenderer:'program.timeline',
  newsRenderer:'news.cards',
  sponsorRenderer:'sponsor.logo-wall',
  engine:'onlyevent-studio-v8',
  renderer:'01-ip-only',
  presentationProfile:{...DEFAULT_IP_ONLY_PRESENTATION_PROFILE,entryAnimation:true,ribbon:true,quickAccess:true,mobileDock:true,scrollProgress:true,floatingStickers:true,passportProgress:true,decorativeSectionOrbits:true},
  defaults:createIpOnlyDefaults()
};