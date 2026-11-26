export const PAGE_CONTENT_CONFIG={
 animation:[{tool:'entryAnimation',label:'入场动画'}],
 home:[
   {tool:'basic',label:'基本信息'},
   {tool:'lifecycle',label:'活动状态'},
   {tool:'hero',label:'主视觉'},
   {collection:'ribbonItems',label:'滚动公告'},
   {collection:'tickets',label:'票务'},
   {tool:'map',label:'场地图'},
   {collection:'featuredActivities',label:'活动精选'},
   {collection:'explore',label:'继续探索'},
   {collection:'updates',label:'重要更新'},
   {collection:'socialLinks',label:'社群'},
   {collection:'sponsors',label:'赞助'}
 ],
 booths:[{collection:'booths',label:'摊位与制品'},{tool:'streets',label:'街道'}],
 activities:[{collection:'schedule',label:'日程'},{collection:'participation',label:'活动详情'}],
 guests:[{collection:'guests',label:'嘉宾'}],
 guide:[{collection:'guide',label:'指南内容'}]
};
export const COLLECTION_PAGE={
 ribbonItems:'home',tickets:'home',featuredActivities:'home',explore:'home',updates:'home',socialLinks:'home',sponsors:'home',
 booths:'booths',participation:'activities',schedule:'activities',guests:'guests',guide:'guide'
};

export const INLINE_HOME_COLLECTIONS=new Set(['activities','guests','guide']);
