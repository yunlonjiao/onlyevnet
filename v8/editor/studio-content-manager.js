export function createContentManagerMeta({getState,pageLabel,guideLabelText}){
 return {
 ribbonItems:{title:'滚动公告',empty:'还没有滚动公告',item:(x,i)=>[x.text||('公告 '+(i+1)),'']},
 explore:{title:'继续探索',empty:'还没有探索入口',item:(x,i)=>[x.label||('入口 '+(i+1)),pageLabel(x.target)]},
 tickets:{title:'票务',empty:'还没有票种',item:(x,i)=>[x.name||('票种 '+(i+1)),x.price||'']},
 featuredActivities:{title:'活动精选',empty:'暂无精选活动',item:(x,i)=>{const a=(getState().participation||[]).find(v=>v.id===x.participationId);return ['精选 '+String(i+1).padStart(2,'0'),a?.title||'未选择活动']}},
 booths:{title:'摊位',empty:'还没有摊位',item:(x,i)=>[(x.no?x.no+' · ':'')+(x.name||('摊位 '+(i+1))),String((x.products||[]).length)+' 个制品']},
 participation:{title:'活动',empty:'还没有活动',item:(x,i)=>[x.title||('活动 '+(i+1)),x.area||x.meta||'']},
 schedule:{title:'活动日程',empty:'还没有日程',item:(x,i)=>[((x.day?x.day+' · ':'')+(x.time?x.time+' · ':'')+(x.title||('日程 '+(i+1)))),x.stage||'']},
 guests:{title:'嘉宾',empty:'还没有嘉宾',item:(x,i)=>[x.name||('嘉宾 '+(i+1)),x.role||'']},
 guide:{title:guideLabelText(),empty:'还没有指南内容',item:(x,i)=>[x.title||('指南 '+(i+1)),(x.text||'').slice(0,24)]},
 updates:{title:'重要更新',empty:'还没有重要更新',item:(x,i)=>[x.title||('更新 '+(i+1)),x.date||'']},
 socialLinks:{title:'社群入口',empty:'还没有社群入口',item:(x,i)=>[x.label||('入口 '+(i+1)),x.url?'已设置链接':'未设置链接']},
 sponsors:{title:'赞助支持',empty:'还没有赞助信息',item:(x,i)=>[x.name||('赞助 '+(i+1)),x.level||'']}
};
}
