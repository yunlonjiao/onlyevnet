function entryLoader(kind){
  const photo='<div class="entry-photo" aria-label="活动KV"></div>';
  const info='<div class="entry-ticket-label">MEMORIAL TICKET</div><div class="entry-ticket-title">STARDUST ONLY 2026</div><div class="entry-ticket-subtitle"></div><div class="entry-ticket-meta"><div class="entry-ticket-date-wrap"><span>DATE</span><b class="entry-ticket-date">2026.11.08</b></div><div class="entry-ticket-time-wrap"><span>TIME</span><b class="entry-ticket-time"></b></div><div class="entry-ticket-location-wrap"><span>PLACE</span><b class="entry-ticket-location">杭州</b></div></div><div class="stub-barcode" aria-hidden="true"></div><div class="stub-code"><span class="entry-serial stub-number">NO. 048271</span></div>';
  let inner='';
  if(kind==='scrap')inner='<div class="gate scrap-entry-gate" role="button" tabindex="0" aria-label="点击纪念票进入活动网站"><div class="scrap-entry-tape"><i></i><i></i><b>MEMORY TAPE</b></div><section class="ticket-half left">'+photo+'</section><aside class="ticket-half right">'+info+'</aside></div>';
  else if(kind==='school')inner='<div class="gate school-entry-gate" role="button" tabindex="0" aria-label="点击入场证进入活动网站"><div class="school-entry-number">04</div><section class="ticket-half left">'+photo+'</section><aside class="ticket-half right"><span class="school-entry-kicker">CAMPUS FESTIVAL PASS</span>'+info+'</aside></div>';
  else if(kind==='museum')inner='<div class="gate museum-entry-gate" role="button" tabindex="0" aria-label="点击展览票进入活动网站"><div class="museum-entry-index">EXHIBITION / ADMISSION</div><section class="ticket-half left">'+photo+'</section><aside class="ticket-half right">'+info+'</aside></div>';
  else if(kind==='live')inner='<div class="gate live-entry-gate" role="button" tabindex="0" aria-label="点击舞台通行证进入活动网站"><div class="live-entry-five">5</div><section class="ticket-half left">'+photo+'</section><aside class="ticket-half right"><span class="live-entry-kicker">BACKSTAGE / EVENT PASS</span>'+info+'</aside></div>';
  else if(kind==='expo')inner='<div class="gate expo-entry-gate" role="button" tabindex="0" aria-label="点击EXPO通行证进入活动网站"><div class="expo-entry-code">ENTRY / 001</div><section class="ticket-half left">'+photo+'</section><aside class="ticket-half right">'+info+'</aside></div>';
  else inner='<div class="gate kimetsu-entry-gate" role="button" tabindex="0" aria-label="点击入场札进入活动网站"><div class="kimetsu-entry-seal">入</div><section class="ticket-half left">'+photo+'</section><aside class="ticket-half right">'+info+'</aside></div>';
  return '<div class="loader '+kind+'-entry" id="loader">'+inner+'<button class="skip" id="skip">跳过动画 →</button></div>';
}

function scrapDesktopNav(){
 return '<header class="scrap-flight-header">'+
  '<a class="scrap-flight-brand" href="#home" data-page-link="home"><small>ONLY EVENT / SPECIAL JOURNEY</small><b>STARDUST ONLY</b></a>'+
  '<div class="scrap-flight-status"><span>BOARDING</span><i></i><span>2026.11.08</span><i></i><span>HANGZHOU</span></div>'+
  '<nav class="scrap-flight-links" data-oe-mount="nav-links">'+
   '<a href="#booths" data-target-mode="page" data-page-link="booths"><small>01</small>BOOTH</a>'+
   '<a href="#activities" data-target-mode="page" data-page-link="activities"><small>02</small>PLAN</a>'+
   '<a href="#guests" data-target-mode="page" data-page-link="guests"><small>03</small>GUEST</a>'+
   '<a href="#guide" data-target-mode="page" data-page-link="guide"><small>04</small>GUIDE</a>'+
  '</nav>'+
  '<a class="scrap-flight-ticket ticket-purchase-link" data-ticket-settings href="#" target="_blank" rel="noopener">TICKET ↗</a>'+
 '</header>';
}

function standardNav(cls=''){
  const base='<nav class="links" data-oe-mount="nav-links"><a href="#home" data-page-link="home">首页</a><a href="#booths" data-target-mode="page" data-page-link="booths">摊位</a><a href="#activities" data-target-mode="page" data-page-link="activities">活动</a><a href="#guests" data-target-mode="page" data-page-link="guests">嘉宾</a><a href="#guide" data-target-mode="page" data-page-link="guide">观展指南</a></nav>';
  if(cls==='scrap-nav')return '<header class="nav scrap-nav"><div class="scrap-nav-mark"><small>ONLY EVENT JOURNEY</small><a class="brand" href="#top">STARDUST<br>ONLY</a></div>'+base+'<a class="btn" href="#" target="_blank" rel="noopener">TRAVEL PASS ↗</a></header>';
  if(cls==='school-nav')return '<header class="nav school-nav"><a class="brand" href="#top"><span>04</span>STARDUST FESTIVAL</a>'+base+'<a class="btn" href="#" target="_blank" rel="noopener">TICKET</a></header>';
  if(cls==='museum-nav')return '<header class="nav museum-nav"><a class="brand" href="#top">STARDUST<br><small>EXHIBITION</small></a><div class="museum-nav-rule"></div>'+base+'<a class="btn" href="#" target="_blank" rel="noopener">ADMISSION</a></header>';
  if(cls==='live-nav')return '<header class="nav live-nav"><a class="brand" href="#top"><b>5TH</b><span>STARDUST<br>THANKS FESTIVAL</span></a>'+base+'<a class="btn" href="#" target="_blank" rel="noopener">GET TICKET ↗</a></header>';
  if(cls==='expo-nav')return '<header class="nav expo-nav"><a class="brand" href="#top">STARDUST<br>EXPO</a>'+base+'<div class="expo-nav-code">2026 / HANGZHOU</div><a class="btn" href="#" target="_blank" rel="noopener">TICKET</a></header>';
  return '<header class="nav kimetsu-nav"><a class="brand" href="#top"><b>追憶回廊</b><small>STARDUST ONLY</small></a>'+base+'<a class="btn" href="#" target="_blank" rel="noopener">入場案内</a></header>';
}
function scrapMobileNav(){
 return '<nav class="scrap-pocket-nav" data-oe-mount="mobile-nav" aria-label="移动导航">'+
  '<a href="#home" data-page-link="home"><small>01</small>HOME</a>'+
  '<a href="#booths" data-target-mode="page" data-page-link="booths"><small>02</small>MEMORY</a>'+
  '<a href="#activities" data-target-mode="page" data-page-link="activities"><small>03</small>PLAN</a>'+
  '<a href="#guests" data-target-mode="page" data-page-link="guests"><small>04</small>GUEST</a>'+
  '<a href="#guide" data-target-mode="page" data-page-link="guide"><small>05</small>GUIDE</a></nav>';
}

function mobileNav(prefix){
 const labels={
  scrap:['HOME','MEMORY','PLAN','GUEST','GUIDE'],
  school:['首页','摊位','活动','嘉宾','指南'],
  museum:['HOME','BOOTH','EVENT','GUEST','GUIDE'],
  live:['HOME','BOOTH','STAGE','CAST','GUIDE'],
  expo:['HOME','BOOTH','PROGRAM','GUEST','GUIDE'],
  kimetsu:['首頁','攤位','催事','出演','案内']
 }[prefix]||['首页','摊位','活动','嘉宾','指南'];
 return '<nav class="mobile-dock '+prefix+'-mobile-dock" data-oe-mount="mobile-nav">'+
  '<a href="#home" data-page-link="home">'+labels[0]+'</a>'+
  '<a href="#booths" data-target-mode="page" data-page-link="booths">'+labels[1]+'</a>'+
  '<a href="#activities" data-target-mode="page" data-page-link="activities">'+labels[2]+'</a>'+
  '<a href="#guests" data-target-mode="page" data-page-link="guests">'+labels[3]+'</a>'+
  '<a href="#guide" data-target-mode="page" data-page-link="guide">'+labels[4]+'</a></nav>';
}

function detailPages(prefix){
 const cfg={
  scrap:{
   booth:'<section class="scrap-page oe-page-view" id="booths"><div class="scrap-page-head"><span>MEMORY MAP / BOOTH</span><h2>摊位与制品</h2><a class="section-back" href="#home" data-page-link="home">BACK TO JOURNEY</a></div><div class="scrap-page-body"><aside class="scrap-label">COLLECTORS DIRECTORY</aside><div class="booth-directory-rich" data-oe-mount="booths"></div></div></section>',
   activity:'<section class="scrap-page oe-page-view" id="activities"><div class="scrap-page-head"><span>TRIP SCHEDULE</span><h2>活动与日程</h2><a class="section-back" href="#home" data-page-link="home">BACK TO JOURNEY</a></div><div class="scrap-activity-tabs"><div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">ITINERARY</button><button type="button" data-activity-view="programs">MEMORY PICKS</button></div><div data-oe-mount="activity-days" class="activity-day-tabs"></div></div><div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div><div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div></section>',
   guest:'<section class="scrap-page oe-page-view" id="guests"><div class="scrap-page-head"><span>TRAVEL COMPANIONS</span><h2>嘉宾</h2><a class="section-back" href="#home" data-page-link="home">BACK TO JOURNEY</a></div><div class="scrap-guest-mount guest-grid" data-oe-mount="guests"></div></section>',
   guide:'<section class="scrap-page oe-page-view" id="guide"><div class="scrap-page-head"><span>TRAVEL NOTE</span><h2>观展指南</h2><a class="section-back" href="#home" data-page-link="home">BACK TO JOURNEY</a></div><div class="scrap-guide-mount guide-detail-grid" data-oe-mount="guide-detail"></div></section>'
  },
  school:{
   booth:'<section class="school-page oe-page-view" id="booths"><div class="school-page-head"><span>BLOCK 05 / CLUB MAP</span><h2>摊位与制品</h2><a class="section-back" href="#home" data-page-link="home">返回校门</a></div><div class="school-directory-board"><div class="school-block-no">05</div><div class="booth-directory-rich" data-oe-mount="booths"></div></div></section>',
   activity:'<section class="school-page oe-page-view" id="activities"><div class="school-page-head"><span>BLOCK 06 / PROGRAM</span><h2>活动与日程</h2><a class="section-back" href="#home" data-page-link="home">返回校门</a></div><div class="school-program-board"><div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">当天日程</button><button type="button" data-activity-view="programs">活动详情</button></div><div data-oe-mount="activity-days" class="activity-day-tabs"></div><div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div><div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div></div></section>',
   guest:'<section class="school-page oe-page-view" id="guests"><div class="school-page-head"><span>BLOCK 07 / MEMBERS</span><h2>嘉宾</h2><a class="section-back" href="#home" data-page-link="home">返回校门</a></div><div class="school-guest-mount guest-grid" data-oe-mount="guests"></div></section>',
   guide:'<section class="school-page oe-page-view" id="guide"><div class="school-page-head"><span>BLOCK 08 / GUIDE</span><h2>观展指南</h2><a class="section-back" href="#home" data-page-link="home">返回校门</a></div><div class="school-guide-mount guide-detail-grid" data-oe-mount="guide-detail"></div></section>'
  },
  museum:{
   booth:'<section class="museum-page oe-page-view" id="booths"><div class="museum-page-head"><span>ARCHIVE / 02</span><h2>Booth Collection</h2><a class="section-back" href="#home" data-page-link="home">INDEX</a></div><div class="museum-archive-sheet"><aside>COLLECTION</aside><div class="booth-directory-rich" data-oe-mount="booths"></div></div></section>',
   activity:'<section class="museum-page oe-page-view" id="activities"><div class="museum-page-head"><span>ARCHIVE / 03</span><h2>Program</h2><a class="section-back" href="#home" data-page-link="home">INDEX</a></div><div class="museum-program-index"><div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">TIMELINE</button><button type="button" data-activity-view="programs">CATALOGUE</button></div><div data-oe-mount="activity-days" class="activity-day-tabs"></div></div><div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div><div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div></section>',
   guest:'<section class="museum-page oe-page-view" id="guests"><div class="museum-page-head"><span>ARCHIVE / 04</span><h2>Members</h2><a class="section-back" href="#home" data-page-link="home">INDEX</a></div><div class="museum-guest-mount guest-grid" data-oe-mount="guests"></div></section>',
   guide:'<section class="museum-page oe-page-view" id="guide"><div class="museum-page-head"><span>ARCHIVE / 05</span><h2>Visitor Information</h2><a class="section-back" href="#home" data-page-link="home">INDEX</a></div><div class="museum-guide-mount guide-detail-grid" data-oe-mount="guide-detail"></div></section>'
  },
  live:{
   booth:'<section class="live-page oe-page-view" id="booths"><div class="live-page-head"><span>AREA / BOOTH</span><h2>BOOTH LINEUP</h2><a class="section-back" href="#home" data-page-link="home">BACKSTAGE</a></div><div class="booth-directory-rich" data-oe-mount="booths"></div></section>',
   activity:'<section class="live-page oe-page-view" id="activities"><div class="live-page-head"><span>STAGE / PROGRAM</span><h2>LIVE SCHEDULE</h2><a class="section-back" href="#home" data-page-link="home">BACKSTAGE</a></div><div class="live-program-switch"><div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">TIME TABLE</button><button type="button" data-activity-view="programs">STAGE DETAIL</button></div><div data-oe-mount="activity-days" class="activity-day-tabs"></div></div><div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div><div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div></section>',
   guest:'<section class="live-page oe-page-view" id="guests"><div class="live-page-head"><span>CAST / MEMBERS</span><h2>CAST</h2><a class="section-back" href="#home" data-page-link="home">BACKSTAGE</a></div><div class="live-guest-mount guest-grid" data-oe-mount="guests"></div></section>',
   guide:'<section class="live-page oe-page-view" id="guide"><div class="live-page-head"><span>VENUE / INFO</span><h2>ACCESS GUIDE</h2><a class="section-back" href="#home" data-page-link="home">BACKSTAGE</a></div><div class="live-guide-mount guide-detail-grid" data-oe-mount="guide-detail"></div></section>'
  },
  expo:{
   booth:'<section class="expo-page oe-page-view" id="booths"><div class="expo-page-head"><span>06 / BOOTH</span><h2>BOOTH DIRECTORY</h2><a class="section-back" href="#home" data-page-link="home">INDEX</a></div><div class="expo-directory-grid booth-directory-rich" data-oe-mount="booths"></div></section>',
   activity:'<section class="expo-page oe-page-view" id="activities"><div class="expo-page-head"><span>07 / PROGRAM</span><h2>PROGRAM TABLE</h2><a class="section-back" href="#home" data-page-link="home">INDEX</a></div><div class="expo-program-switch"><div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">SCHEDULE</button><button type="button" data-activity-view="programs">DETAIL</button></div><div data-oe-mount="activity-days" class="activity-day-tabs"></div></div><div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div><div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div></section>',
   guest:'<section class="expo-page oe-page-view" id="guests"><div class="expo-page-head"><span>08 / GUEST</span><h2>GUEST INDEX</h2><a class="section-back" href="#home" data-page-link="home">INDEX</a></div><div class="expo-guest-mount guest-grid" data-oe-mount="guests"></div></section>',
   guide:'<section class="expo-page oe-page-view" id="guide"><div class="expo-page-head"><span>09 / GUIDE</span><h2>VISITOR GUIDE</h2><a class="section-back" href="#home" data-page-link="home">INDEX</a></div><div class="expo-guide-mount guide-detail-grid" data-oe-mount="guide-detail"></div></section>'
  },
  kimetsu:{
   booth:'<section class="kimetsu-page oe-page-view" id="booths"><div class="kimetsu-page-head"><span>第四章</span><h2>頒布処を巡る</h2><a class="section-back" href="#home" data-page-link="home">回廊へ戻る</a></div><div class="booth-directory-rich" data-oe-mount="booths"></div></section>',
   activity:'<section class="kimetsu-page oe-page-view" id="activities"><div class="kimetsu-page-head"><span>第五章</span><h2>催しの刻</h2><a class="section-back" href="#home" data-page-link="home">回廊へ戻る</a></div><div class="kimetsu-program-switch"><div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">時刻表</button><button type="button" data-activity-view="programs">催事録</button></div><div data-oe-mount="activity-days" class="activity-day-tabs"></div></div><div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div><div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div></section>',
   guest:'<section class="kimetsu-page oe-page-view" id="guests"><div class="kimetsu-page-head"><span>第六章</span><h2>出演者の間</h2><a class="section-back" href="#home" data-page-link="home">回廊へ戻る</a></div><div class="kimetsu-guest-mount guest-grid" data-oe-mount="guests"></div></section>',
   guide:'<section class="kimetsu-page oe-page-view" id="guide"><div class="kimetsu-page-head"><span>第七章</span><h2>入場の心得</h2><a class="section-back" href="#home" data-page-link="home">回廊へ戻る</a></div><div class="kimetsu-guide-mount guide-detail-grid" data-oe-mount="guide-detail"></div></section>'
  }
 }[prefix];
 return cfg?cfg.booth+cfg.activity+cfg.guest+cfg.guide:'';
}

function footer(prefix){
 if(prefix==='scrap')return '<footer class="scrap-footer footer"><div class="scrap-footer-label">END OF SIDE A</div><div data-oe-mount="footer-brand" class="footer-brand"></div><div class="scrap-footer-links"><div data-oe-mount="footer-participate" class="footer-participate"></div><div data-oe-mount="footer-visit" class="footer-visit"></div></div><div data-oe-mount="footer-social" class="footer-social"></div></footer>';
 if(prefix==='school')return '<footer class="school-footer footer"><div class="school-footer-no">05</div><div data-oe-mount="footer-brand" class="footer-brand"></div><div data-oe-mount="footer-participate" class="footer-participate"></div><div data-oe-mount="footer-visit" class="footer-visit"></div><div data-oe-mount="footer-social" class="footer-social"></div></footer>';
 if(prefix==='museum')return '<footer class="museum-footer footer"><div class="museum-footer-index">END / ARCHIVE</div><div data-oe-mount="footer-brand" class="footer-brand"></div><div data-oe-mount="footer-participate" class="footer-participate"></div><div data-oe-mount="footer-visit" class="footer-visit"></div><div data-oe-mount="footer-social" class="footer-social"></div></footer>';
 if(prefix==='live')return '<footer class="live-footer footer"><div class="live-footer-mark">THANK YOU<br>FOR COMING</div><div data-oe-mount="footer-brand" class="footer-brand"></div><div data-oe-mount="footer-participate" class="footer-participate"></div><div data-oe-mount="footer-visit" class="footer-visit"></div><div data-oe-mount="footer-social" class="footer-social"></div></footer>';
 if(prefix==='expo')return '<footer class="expo-footer footer"><div class="expo-footer-code">EOF / 2026</div><div data-oe-mount="footer-brand" class="footer-brand"></div><div data-oe-mount="footer-participate" class="footer-participate"></div><div data-oe-mount="footer-visit" class="footer-visit"></div><div data-oe-mount="footer-social" class="footer-social"></div></footer>';
 return '<footer class="kimetsu-footer footer"><div class="kimetsu-footer-seal">終</div><div data-oe-mount="footer-brand" class="footer-brand"></div><div data-oe-mount="footer-participate" class="footer-participate"></div><div data-oe-mount="footer-visit" class="footer-visit"></div><div data-oe-mount="footer-social" class="footer-social"></div></footer>';
}

function commonUtility(prefix){
 const map={
  scrap:'<section class="scrap-community" id="community"><div class="scrap-section-heading"><span>POSTCARD WALL</span><h2>社群与活动公告</h2></div><div data-oe-mount="community" class="community"></div></section><section class="scrap-sponsors" id="sponsors"><div class="scrap-section-heading"><span>TRAVEL PARTNERS</span><h2>赞助支持</h2></div><div data-oe-mount="sponsors" class="sponsors"></div></section>',
  school:'<section class="school-community" id="community"><div class="school-block-no">09</div><div><span>NOTICE BOARD</span><h2>社群与活动公告</h2><div data-oe-mount="community" class="community"></div></div></section><section class="school-sponsors" id="sponsors"><div class="school-block-no">10</div><div><span>SUPPORT CLUB</span><h2>赞助支持</h2><div data-oe-mount="sponsors" class="sponsors"></div></div></section>',
  museum:'<section class="museum-community" id="community"><aside>COMMUNITY</aside><div><h2>Notice Archive</h2><div data-oe-mount="community" class="community"></div></div></section><section class="museum-sponsors" id="sponsors"><aside>SUPPORT</aside><div><h2>Partners</h2><div data-oe-mount="sponsors" class="sponsors"></div></div></section>',
  live:'<section class="live-community" id="community"><div class="live-section-label">COMMUNITY / NEWS</div><h2>FAN NOTICE</h2><div data-oe-mount="community" class="community"></div></section><section class="live-sponsors" id="sponsors"><div class="live-section-label">SUPPORTED BY</div><div data-oe-mount="sponsors" class="sponsors"></div></section>',
  expo:'<section class="expo-community" id="community"><div class="expo-code">10 / COMMUNITY</div><div><h2>COMMUNITY BOARD</h2><div data-oe-mount="community" class="community"></div></div></section><section class="expo-sponsors" id="sponsors"><div class="expo-code">11 / PARTNERS</div><div data-oe-mount="sponsors" class="sponsors"></div></section>',
  kimetsu:'<section class="kimetsu-community" id="community"><div class="kimetsu-chapter-no">掲</div><div><span>掲示</span><h2>社群与活动公告</h2><div data-oe-mount="community" class="community"></div></div></section><section class="kimetsu-sponsors" id="sponsors"><div class="kimetsu-chapter-head"><span>終章</span><h2>支援</h2></div><div data-oe-mount="sponsors" class="sponsors"></div></section>'
 };
 return map[prefix]||'';
}

function heroFields(extra=''){
 return `<div class="hero-copy ${extra}"><h1><span class="hero-title-line hero-title-1">STAR</span><br><em class="hero-title-line hero-title-2">BEAT</em><br><span class="hero-title-line hero-title-3">ONLY</span></h1><p>一场为喜欢这部作品的人办的小聚会：逛摊位、看舞台、见同好。</p><div class="meta"><span class="pill">11.08 SUN</span><span class="pill">杭州</span><a class="pill venue-nav" href="#" target="_blank" rel="noopener">杭州国际博览中心</a></div></div>`;
}
function heroKV(extra=''){return `<div class="hero-art ${extra}"><div class="kv"></div></div>`}

export const variantBodies={
'02-scrapbook':entryLoader('scrap')+
`<div class="scrap-site">`+
scrapDesktopNav()+scrapMobileNav()+
`<main id="top">
<section class="scrap-landing oe-home-only" id="home">
  <div class="scrap-landing-media">${heroKV('scrap-photo')}</div>
  <div class="scrap-landing-copy">
    <div class="scrap-route-code">OE / 2026 / JOURNEY 01</div>
    ${heroFields('scrap-copy')}
    <div class="scrap-boarding-stamp">BOARDING<br><b>NOW</b></div>
  </div>
  <div class="scrap-flight-board">
    <span><b>DATE</b>11.08 SUN</span>
    <span><b>DESTINATION</b>HANGZHOU</span>
    <span><b>VENUE</b>ONLY EVENT</span>
    <span><b>STATUS</b>OPEN</span>
  </div>
</section>

<section class="oe-home-only scrap-news-board" id="updates">
  <div class="scrap-news-head"><span>NEWS / LATEST UPDATE</span><b>旅程更新</b></div>
  <div data-oe-mount="updates" class="updates-list"></div>
</section>

<section class="oe-home-only scrap-introduction">
  <div class="scrap-intro-index"><span>INTRODUCTION</span><b>01</b></div>
  <div class="scrap-intro-copy">
    <p class="scrap-intro-lead">EVERY EVENT LEAVES A MEMORY WORTH KEEPING.</p>
    <p>一次 ONLY 活动，不只是几个信息模块。票根、见面、舞台、摊位与意外，最后都会成为同一段旅程里的记忆。</p>
  </div>
  <div class="scrap-intro-object"><div class="scrap-tape"><span class="reel r1"></span><span class="reel r2"></span><b>SPECIAL EVENT<br>MEMORIES</b><small>MEMORY ARCHIVE / 01</small></div></div>
</section>

<section class="oe-home-only scrap-journey-index">
  <div class="scrap-index-caption"><span>TRIP INDEX</span><b>CHOOSE YOUR STOP</b></div>
  <div data-oe-mount="quick" class="quick-grid"></div>
</section>

<section class="oe-home-only scrap-feature-journey" id="participation">
  <div class="scrap-feature-copy"><span>JOURNEY HIGHLIGHTS</span><h2>活动精选</h2><p>把最值得去的企划当作这次旅程的几个停靠点。</p></div>
  <div data-oe-mount="featured-activities" class="featured-activity-grid"></div>
</section>

<section class="oe-home-only scrap-passport" id="tickets">
  <div class="scrap-passport-cover"><small>ADMISSION</small><b>TRAVEL<br>PASS</b><span>ONLY EVENT 2026</span></div>
  <div class="scrap-passport-content"><div data-oe-mount="tickets" class="ticket-grid"></div><div data-oe-mount="ticket-actions" class="ticket-actions"></div></div>
</section>

<section class="oe-home-only scrap-fold-map" id="map-home">
  <div class="scrap-fold-map-copy"><span>DESTINATION MAP</span><h2>场地图</h2><p>把场地当成一次旅行目的地来浏览。</p><div data-oe-mount="map-links" class="map-link-list"></div></div>
  <div class="scrap-fold-map-media"><div data-oe-mount="map" id="venueMap" class="map-static"></div></div>
</section>

${detailPages('scrap')}${commonUtility('scrap')}
</main>${footer('scrap')}</div>`,

'03-school-festival':entryLoader('school')+
`<div class="school-site"><aside class="school-fixed-rail"><b>ONLY EVENT</b><span>01</span><span>02</span><span>03</span><span>04</span></aside>`+
standardNav('school-nav')+
`<main id="top">
<section class="hero school-hero"><div class="oe-home-only school-hero-board"><div class="school-kicker">4TH ANNIVERSARY FESTIVAL</div>${heroFields('school-copy')}<div class="school-stamp">WELCOME<br>TO CAMPUS!</div></div><div class="school-kv-column">${heroKV('school-kv')}<div class="school-dots"></div></div></section>
<section class="school-status-grid"><div><b>DATE</b><span>11.08 SUN</span></div><div><b>PLACE</b><span>杭州</span></div><div><b>AREA</b><span>STAGE / BOOTH / GUIDE</span></div></section>
<section class="oe-home-only school-updates" id="updates"><div class="school-block-no">01</div><div><span>NEWS</span><div data-oe-mount="updates" class="updates-list"></div></div></section>
<section class="oe-home-only school-menu"><div class="school-block-no">02</div><div><span>FESTIVAL MAP</span><div data-oe-mount="quick" class="quick-grid"></div></div></section>
<section class="oe-home-only school-stage" id="participation"><div class="school-block-no">03</div><div><span>STAGE & EVENT</span><h2>活动精选</h2><div data-oe-mount="featured-activities" class="featured-activity-grid"></div></div></section>
<section class="oe-home-only school-ticket" id="tickets"><div class="school-block-no">04</div><div><span>TICKETS</span><h2>票务与特典</h2><div data-oe-mount="tickets" class="ticket-grid"></div><div data-oe-mount="ticket-actions" class="ticket-actions"></div></div></section>
<section class="oe-home-only school-map" id="map-home"><div><span>ACCESS / VENUE</span><h2>场地图</h2><div data-oe-mount="map-links" class="map-link-list"></div></div><div data-oe-mount="map" id="venueMap" class="map-static"></div></section>
<div class="oe-home-only ribbon school-ribbon" data-oe-mount="ribbon"><div class="ribbon-track" data-oe-mount="ribbon-track"></div></div>
${detailPages('school')}${commonUtility('school')}
</main>${mobileNav('school')}${footer('school')}</div>`,

'04-museum-editorial':entryLoader('museum')+
`<div class="museum-site">`+standardNav('museum-nav')+
`<main id="top">
<section class="oe-home-only museum-titleband"><span>ENSEMBLE ARCHIVE</span><span>10TH ANNIVERSARY EXHIBITION</span><span>2026</span></section>
<section class="hero museum-hero"><div class="oe-home-only museum-hero-index"><span>EXHIBITION 01</span><b>BRIGHT<br>ME UP!!</b></div>${heroKV('museum-kv')}${heroFields('museum-copy')}</section>
<section class="oe-home-only museum-introduction"><aside>INTRODUCTION</aside><div><h2>記憶の中にある輝きを、展示空間としてもう一度。</h2><p>イラスト、音楽、映像、出会い。活動当天的内容以展览章节的方式安静展开。</p></div></section>
<section class="oe-home-only museum-about"><aside>ABOUT</aside><div class="oe-home-only museum-about-grid"><div><small>DATE</small><b>2026.11.08</b></div><div><small>PLACE</small><b>杭州</b></div><div><small>VENUE</small><b>杭州国际博览中心</b></div></div></section>
<section class="oe-home-only museum-news" id="updates"><aside>NEWS</aside><div data-oe-mount="updates" class="updates-list"></div></section>
<section class="oe-home-only museum-ticket" id="tickets"><aside>TICKET</aside><div><div data-oe-mount="tickets" class="ticket-grid"></div><div data-oe-mount="ticket-actions" class="ticket-actions"></div></div></section>
<section class="oe-home-only museum-event" id="participation"><aside>EVENT</aside><div><div data-oe-mount="featured-activities" class="featured-activity-grid"></div></div></section>
<section class="oe-home-only museum-access" id="map-home"><aside>ACCESS</aside><div data-oe-mount="map" id="venueMap" class="map-static"></div><div data-oe-mount="map-links" class="map-link-list"></div></section>
<section class="oe-home-only museum-index-menu"><aside>INDEX</aside><div data-oe-mount="quick" class="quick-grid"></div></section>
<div class="oe-home-only ribbon museum-ribbon" data-oe-mount="ribbon"><div class="ribbon-track" data-oe-mount="ribbon-track"></div></div>
${detailPages('museum')}${commonUtility('museum')}
</main>${mobileNav('museum')}${footer('museum')}</div>`,

'05-live-poster':entryLoader('live')+
`<div class="live-site">`+standardNav('live-nav')+
`<main id="top">
<div class="live-marquee-top"><span>5TH ANNIVERSARY</span><span>THANKS FESTIVAL</span><span>LIVE / STAGE / CONTENTS</span></div>
<section class="hero live-hero"><div class="live-giant-five">5</div><div class="live-title-layer">${heroFields('live-copy')}<div class="live-date-chip"><small>2026</small><b>11.08</b><span>SUN</span></div></div>${heroKV('live-kv')}</section>
<section class="oe-home-only live-news" id="updates"><span>LATEST NEWS</span><div data-oe-mount="updates" class="updates-list"></div></section>
<section class="oe-home-only live-cast" id="participation"><div class="live-section-label">CAST / STAGE</div><h2>出演者とステージプログラム</h2><div data-oe-mount="featured-activities" class="featured-activity-grid"></div></section>
<section class="oe-home-only live-schedule-link"><span>CONTENTS</span><div data-oe-mount="quick" class="quick-grid"></div></section>
<section class="oe-home-only live-ticket" id="tickets"><div class="live-section-label">TICKET</div><div data-oe-mount="tickets" class="ticket-grid"></div><div data-oe-mount="ticket-actions" class="ticket-actions"></div></section>
<section class="oe-home-only live-venue" id="map-home"><div class="live-section-label">VENUE / ACCESS</div><div class="oe-home-only live-venue-grid"><div data-oe-mount="map" id="venueMap" class="map-static"></div><div data-oe-mount="map-links" class="map-link-list"></div></div></section>
<div class="oe-home-only ribbon live-ribbon" data-oe-mount="ribbon"><div class="ribbon-track" data-oe-mount="ribbon-track"></div></div>
${detailPages('live')}${commonUtility('live')}
</main>${mobileNav('live')}${footer('live')}</div>`,

'06-expo-catalogue':entryLoader('expo')+
`<div class="expo-site">`+standardNav('expo-nav')+
`<main id="top">
<div class="expo-area-tabs"><span>LIVE SHOWCASE AREA</span><span>EXPO AREA</span><span>OUTDOOR AREA</span></div>
<section class="hero expo-hero"><div class="oe-home-only expo-hero-title">${heroFields('expo-copy')}<div class="expo-date">2026.11.08 SUN</div></div>${heroKV('expo-kv')}<aside class="expo-contents-index"><b>CONTENTS</b><ol><li>NEWS</li><li>AREA</li><li>TICKET</li><li>BOOTH</li><li>STAGE</li><li>GUIDE</li></ol></aside></section>
<section class="oe-home-only expo-news" id="updates"><div class="expo-code">01 / NEWS</div><div data-oe-mount="updates" class="updates-list"></div></section>
<section class="oe-home-only expo-area-board"><div class="cyan"><span>LIVE SHOWCASE</span><b>舞台与节目</b></div><div class="magenta"><span>EXPO AREA</span><b>摊位与企划</b></div><div class="yellow"><span>OUTDOOR</span><b>交通与场外</b></div></section>
<section class="oe-home-only expo-index-menu"><div class="expo-code">02 / INDEX</div><div data-oe-mount="quick" class="quick-grid"></div></section>
<section class="oe-home-only expo-ticket" id="tickets"><div class="expo-code">03 / TICKET</div><div data-oe-mount="tickets" class="ticket-grid"></div><div data-oe-mount="ticket-actions" class="ticket-actions"></div></section>
<section class="oe-home-only expo-program" id="participation"><div class="expo-code">04 / PROGRAM</div><div data-oe-mount="featured-activities" class="featured-activity-grid"></div></section>
<section class="oe-home-only expo-map" id="map-home"><div class="expo-code">05 / AREA MAP</div><div class="oe-home-only expo-map-grid"><div data-oe-mount="map" id="venueMap" class="map-static"></div><div data-oe-mount="map-links" class="map-link-list"></div></div></section>
<div class="oe-home-only ribbon expo-ribbon" data-oe-mount="ribbon"><div class="ribbon-track" data-oe-mount="ribbon-track"></div></div>
${detailPages('expo')}${commonUtility('expo')}
</main>${mobileNav('expo')}${footer('expo')}</div>`,

'07-immersive-character':entryLoader('kimetsu')+
`<div class="kimetsu-site">`+standardNav('kimetsu-nav')+
`<main id="top">
<section class="hero kimetsu-hero"><div class="kimetsu-title-seal"><span>追憶回廊</span><small>MEMORY CORRIDOR</small></div>${heroKV('kimetsu-kv')}${heroFields('kimetsu-copy')}</section>
<section class="oe-home-only kimetsu-prologue"><div class="kimetsu-chapter-no">序</div><div><span>PROLOGUE</span><h2>記憶を辿る、ひとつの回廊。</h2><p>活动信息不是卡片集合，而像沿着作品世界一章一章前进。</p></div></section>
<section class="oe-home-only kimetsu-news" id="updates"><div class="kimetsu-chapter-no">報</div><div data-oe-mount="updates" class="updates-list"></div></section>
<section class="oe-home-only kimetsu-path"><div class="kimetsu-chapter-no">巡</div><div data-oe-mount="quick" class="quick-grid"></div></section>
<section class="oe-home-only kimetsu-ticket" id="tickets"><div class="kimetsu-chapter-head"><span>第一章</span><h2>入場と特典</h2></div><div data-oe-mount="tickets" class="ticket-grid"></div><div data-oe-mount="ticket-actions" class="ticket-actions"></div></section>
<section class="oe-home-only kimetsu-event" id="participation"><div class="kimetsu-chapter-head"><span>第二章</span><h2>催しと出演</h2></div><div data-oe-mount="featured-activities" class="featured-activity-grid"></div></section>
<section class="oe-home-only kimetsu-map" id="map-home"><div class="kimetsu-chapter-head"><span>第三章</span><h2>会場を巡る</h2></div><div class="oe-home-only kimetsu-map-grid"><div data-oe-mount="map" id="venueMap" class="map-static"></div><div data-oe-mount="map-links" class="map-link-list"></div></div></section>
<div class="oe-home-only ribbon kimetsu-ribbon" data-oe-mount="ribbon"><div class="ribbon-track" data-oe-mount="ribbon-track"></div></div>
${detailPages('kimetsu')}${commonUtility('kimetsu')}
</main>${mobileNav('kimetsu')}${footer('kimetsu')}</div>`
};
