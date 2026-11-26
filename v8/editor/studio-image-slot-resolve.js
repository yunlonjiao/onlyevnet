export function resolveImageSlotConfig(cfg,measured){
  if(measured&&!cfg.free)return {...cfg,ratio:measured,ratioLabel:'与当前展示框比例一致',width:1600,height:Math.round(1600/measured),fixed:true};
  return cfg;
}
