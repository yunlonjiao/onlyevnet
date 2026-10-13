import {makeIpOnlyTemplate} from '/v8/templates/ip-only-template-factory.js?v=8.40.1';
export const template05=makeIpOnlyTemplate({
 id:'05-live-poster',name:'05 · LIVE LINEUP',label:'舞台阵容',
 description:'参考 MUTEK/现场演出官网：巨型阵容排版、黑白现场影像、Running Order 与 Venue 信息。',
 structureProfile:'lineup',artDirection:'mutek-live',motionProfile:'energetic',
 theme:'#ff6037',heroTitleColor:'#f1eee8',heroTitleAccentColor:'#ff6037',
 presentationProfile:{entryAnimation:false,quickAccess:true,ribbon:false,mobileDock:false,scrollProgress:false,floatingStickers:false,passportProgress:false,decorativeSectionOrbits:false},
 heroTitleSegments:3,heroStyleControls:false,
 imageRatios:{hero:.8,mobileHero:.8,activity:1.777778,featured:1.777778,guest:.8}
});