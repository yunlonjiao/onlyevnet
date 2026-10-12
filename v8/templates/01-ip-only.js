import {IP_ONLY_CORE_MODULES} from '/v8/templates/ip-only-core-contract.js?v=8.37.1';
import {createIpOnlyDefaults} from '/v8/templates/ip-only-defaults.js?v=8.37.0';
export const template01 = {
  id:'01-ip-only',
  name:'01 · IP ONLY',
  label:'IP ONLY',
  category:'单 IP / 同好活动',
  version:'1.0.0',
  description:'高饱和 Festival、贴纸、粗描边与活泼卡片语言。适合通用型单 IP / ONLY 活动。',
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
  defaults:createIpOnlyDefaults()
};