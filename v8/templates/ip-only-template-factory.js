import {IP_ONLY_CORE_MODULES,DEFAULT_IP_ONLY_PRESENTATION_PROFILE} from '/v8/templates/ip-only-core-contract.js?v=8.37.4';
import {createIpOnlyDefaults} from '/v8/templates/ip-only-defaults.js?v=8.37.4';
export function makeIpOnlyTemplate({
  id,name,label,description,structureProfile,artDirection,motionProfile,
  theme,heroTitleColor,heroTitleAccentColor,presentationProfile={},
  heroTitleSegments=3,heroStyleControls=false
}){
  const defaults=createIpOnlyDefaults();
  const resolvedPresentation={...DEFAULT_IP_ONLY_PRESENTATION_PROFILE,...presentationProfile};
  defaults.templateId=id;
  defaults.presentationProfile=resolvedPresentation;
  if(defaults.entryAnimation)defaults.entryAnimation.enabled=!!resolvedPresentation.entryAnimation;
  defaults.modules={...(defaults.modules||{}),ribbon:!!resolvedPresentation.ribbon};
  if(theme)defaults.theme=theme;
  if(heroTitleColor)defaults.heroTitleColor=heroTitleColor;
  if(heroTitleAccentColor)defaults.heroTitleAccentColor=heroTitleAccentColor;
  return {
    id,name,label,category:'单 IP / 同好活动',version:'1.0.0',
    description,
    structureProfile,
    artDirection,
    motionProfile,
    supportedModules:[...IP_ONLY_CORE_MODULES],
    recommendedFor:['单 IP ONLY','角色主题活动','作品周年活动','几百至几千人同好活动'],
    notRecommendedFor:['大型综合商业展会','多 IP 综合漫展'],
    heroRenderer:'hero.'+structureProfile,
    guestRenderer:'guest.'+(structureProfile==='editorial'?'editorial-index':structureProfile==='lineup'?'horizontal':structureProfile==='immersive'?'fullscreen':'grid'),
    boothRenderer:'booth.'+(structureProfile==='catalogue'?'directory':structureProfile==='immersive'?'cards':'cards'),
    programRenderer:'program.'+(structureProfile==='lineup'?'stage-board':structureProfile==='catalogue'?'compact-list':'timeline'),
    newsRenderer:'news.'+(structureProfile==='editorial'?'editorial':structureProfile==='catalogue'?'list':'cards'),
    sponsorRenderer:'sponsor.'+(structureProfile==='catalogue'?'tiered':'logo-wall'),
    engine:'onlyevent-studio-v8',
    renderer:id,
    presentationProfile:resolvedPresentation,
    heroTitleSegments:Math.max(1,Math.min(3,Number(heroTitleSegments)||1)),
    heroStyleControls:!!heroStyleControls,
    defaults
  };
}
