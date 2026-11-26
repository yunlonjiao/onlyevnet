export function imageSlotConfigBaseFor(path,{templateId,state,viewportWidth,presets}){

 if(path==='heroImage'&&templateId==='01-ip-only')return {label:'首页主视觉',ratio:viewportWidth<=820?0.94:812/500,ratioLabel:'与首页主视觉框一致',width:viewportWidth<=820?940:1624,height:viewportWidth<=820?1000:1000,fixed:true};
 if(path==='heroImage'&&templateId==='05-live-poster')return {label:'舞台主视觉',ratio:3/5,ratioLabel:'舞台主视觉 · 3:5（与右侧竖版框体一致）',width:900,height:1500,fixed:true};
 if(path==='heroImage'&&templateId==='06-band-live')return {label:'首屏主视觉',ratio:4/5,ratioLabel:'首屏主视觉 · 4:5（竖版）',width:1000,height:1250,fixed:true};
 if(/^guests\.\d+\.image$/.test(path))return {label:'嘉宾形象图',ratio:3/4,ratioLabel:'嘉宾形象图 · 比例 3:4',width:900,height:1200,fixed:true};
 if(path==='heroImage'&&templateId==='02-scrapbook')return {label:'首页全屏 KV',ratio:16/9,ratioLabel:'桌面端全屏主视觉 · 1920 × 1080',width:1920,height:1080,fixed:true};
 if(path==='heroImage'&&templateId==='04-creator-catalogue')return {label:'封面图',ratio:5/7,ratioLabel:'封面 KV · 比例 5:7（贴合书页）',width:1000,height:1400,fixed:true};
 if(path==='heroImage'&&templateId==='03-creator-market')return {label:'首页横幅',ratio:5/2,ratioLabel:'首页横幅 · 比例 5:2（宽幅）',width:1800,height:720,fixed:true};
 if(path==='heroImage')return {label:'桌面主视觉 KV',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1400,height:1400,fixed:true};
 if(path==='mobileHeroImage'&&templateId==='03-creator-market')return {label:'手机横幅',ratio:3/2,ratioLabel:'手机横幅 · 比例 3:2',width:1200,height:800,fixed:true};
 if(path==='mobileHeroImage'&&templateId==='02-scrapbook')return {label:'手机主视觉（可选）',ratio:3/4,ratioLabel:'标准海报 · 比例 3:4',width:1080,height:1440,fixed:true};
 if(path==='mobileHeroImage')return {label:'手机主视觉 KV',ratio:4/5,ratioLabel:'手机端独立主视觉 · 比例 4:5',width:1080,height:1350,fixed:true};
 if(path==='entryAnimation.kvDesktop'&&templateId==='01-ip-only')return {label:'开屏桌面 KV',ratio:1,ratioLabel:'纪念票照片 · 1:1（与照片框一致）',width:1200,height:1200,fixed:true};
 if(path==='entryAnimation.kvDesktop')return {label:'开屏桌面 KV',ratio:16/9,ratioLabel:'桌面开屏 · 比例 16:9',width:1920,height:1080,fixed:true};
 if(path==='entryAnimation.kvMobile'&&templateId==='01-ip-only')return {label:'开屏手机 KV',ratio:1,ratioLabel:'纪念票照片 · 1:1（与照片框一致）',width:1200,height:1200,fixed:true};
 if(path==='entryAnimation.kvMobile')return {label:'开屏手机 KV',ratio:9/16,ratioLabel:'手机开屏 · 比例 9:16',width:1080,height:1920,fixed:true};
 if(path==='venueMap.image')return {label:'场地图',ratio:16/9,ratioLabel:'场地图 · 比例 16:9',width:1600,height:900,fixed:true};
 if(path==='venueMap.transitImage')return {label:'交通路线图',ratio:16/9,ratioLabel:'交通路线图 · 比例 16:9',width:1600,height:900,fixed:true};
 if(/^streets\.\d+\.image$/.test(path))return {label:'街道宣传图',ratio:1/1.414,ratioLabel:'街道海报 · A4 竖版（1:1.414）',width:1080,height:1527,fixed:true};
 if(path==='seo.ogImage')return {label:'分享封面',ratio:1.91,ratioLabel:'社交分享推荐比例 1.91:1',width:1200,height:628,fixed:true};
 if(/^recap\.photos\.\d+\.image$/.test(path))return {label:'现场照片',ratio:4/3,ratioLabel:'裁剪框可移动 · 比例 4:3',width:1200,height:900,fixed:true};
 if(/^tickets\.\d+\.image$/.test(path))return {label:'票务赠品图',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:900,height:900,fixed:true};
 if(/^participation\.\d+\.image$/.test(path))return {label:'活动宣传图',ratio:16/9,ratioLabel:'裁剪框可移动 · 比例 16:9',width:1440,height:810,fixed:true};
 if(/^featuredActivities\.\d+\.image$/.test(path))return {label:'首页活动精选图片',ratio:16/9,ratioLabel:'裁剪框可移动 · 比例 16:9',width:1440,height:810,fixed:true};
 if(/^guests\.\d+\.image$/.test(path))return {label:'嘉宾宣传图',ratio:4/3,ratioLabel:'与嘉宾卡预览一致 · 裁剪框可移动 · 比例 4:3',width:1200,height:900,fixed:true};
 if(/^booths\.\d+\.products\.\d+\.image$/.test(path))return {label:'制品图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1000,height:1000,fixed:true};
 if(path==='venueMap.image'||/^venueMap\.more\.\d+\.image$/.test(path))return {label:'场地图',ratio:16/9,ratioLabel:'场地图 · 与展示框比例一致',width:1600,height:900,fixed:true};
 if(/^guests\.\d+\.image$/.test(path))return {label:'嘉宾形象图',ratio:3/4,ratioLabel:'嘉宾形象图 · 比例 3:4',width:900,height:1200,fixed:true};
 if(/^guide\.items\.\d+\.image$/.test(path)){const i=Number(path.match(/^guide\.items\.(\d+)\.image$/)?.[1]||-1),item=state.guide?.items?.[i];return {label:item?.preset==='traffic'?'交通路线图 / 入口示意图':'指南图片',ratio:16/9,ratioLabel:'与展示框比例一致',width:1600,height:900,fixed:true}};
 if(/^(freewalk|itasha)\.image$/.test(path))return {label:'活动图片',ratio:.8,ratioLabel:'裁剪框可移动 · 比例 4:5',width:960,height:1200,fixed:true};
 if(/^booths\.\d+\.logo$/.test(path))return {label:'社团 Logo',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:700,height:700,fixed:true};
 if(/^socialLinks\.\d+\.image$/.test(path))return {label:'二维码 / 社群图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:900,height:900,fixed:true};
 if(/^sponsors\.\d+\.logo$/.test(path))return {label:'赞助商 Logo',ratio:1.8,ratioLabel:'裁剪框可移动 · 比例 9:5',width:1080,height:600,fixed:true};
 const cm=path.match(/^customPages\.(\d+)\.items\.\d+\.image$/);
 if(cm){
   const page=state.customPages?.[Number(cm[1])],preset=presets[page?.preset]||presets.custom,ratio=preset.ratio||1.333333;
   return {label:(preset.itemTitle||'展示内容')+'图片',ratio,ratioLabel:'裁剪框可移动 · 页面预设比例',width:ratio<1?960:1200,height:ratio<1?1200:Math.round(1200/ratio),fixed:true};
 }
 return {label:'图片',ratio:1,ratioLabel:'裁剪框可移动 · 比例 1:1',width:1200,height:1200,fixed:true};
}
