const entryLoader=`<div class="loader" id="loader"><div class="gate" role="button" tabindex="0" aria-label="点击纪念票进入活动网站"><section class="ticket-half left"><div class="entry-photo" aria-label="活动KV"></div></section><aside class="ticket-half right"><div class="entry-ticket-label">MEMORIAL TICKET</div><div class="entry-ticket-title">STARDUST ONLY 2026</div><div class="entry-ticket-subtitle"></div><div class="entry-ticket-meta"><div class="entry-ticket-date-wrap"><span>DATE</span><b class="entry-ticket-date">2026.11.08</b></div><div class="entry-ticket-time-wrap"><span>TIME</span><b class="entry-ticket-time"></b></div><div class="entry-ticket-location-wrap"><span>PLACE</span><b class="entry-ticket-location">杭州</b></div></div><div class="stub-barcode" aria-hidden="true"></div><div class="stub-code"><span class="entry-serial stub-number">NO. 048271</span></div></aside></div><button class="skip" id="skip">跳过动画 →</button></div>`;

function standardNav(cls=''){
 return `<header class="nav ${cls}"><div class="wrap"><a class="brand" href="#top">STARDUST ONLY 2026</a><nav class="links" data-oe-mount="nav-links"></nav><a class="btn" href="#" target="_blank" rel="noopener">TICKET ↗</a></div></header>`;
}
function mobileNav(){return `<nav class="mobile-dock" data-oe-mount="mobile-nav"></nav>`}

function detailPages(prefix){
 return `
 <section class="${prefix}-page oe-page-view" id="booths"><div class="${prefix}-page-head"><span>BOOTH DIRECTORY</span><h2>摊位与制品</h2><a href="#home" data-page-link="home">返回首页</a></div><div class="${prefix}-page-body" data-oe-mount="booths" class="booth-directory-rich"></div></section>
 <section class="${prefix}-page oe-page-view" id="activities"><div class="${prefix}-page-head"><span>PROGRAM</span><h2>活动与日程</h2><a href="#home" data-page-link="home">返回首页</a></div><div class="${prefix}-activity-switch"><div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">日程</button><button type="button" data-activity-view="programs">活动详情</button></div><div data-oe-mount="activity-days" class="activity-day-tabs"></div></div><div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div><div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div></section>
 <section class="${prefix}-page oe-page-view" id="guests"><div class="${prefix}-page-head"><span>GUESTS</span><h2>嘉宾</h2><a href="#home" data-page-link="home">返回首页</a></div><div class="${prefix}-guest-mount" data-oe-mount="guests" class="guest-grid"></div></section>
 <section class="${prefix}-page oe-page-view" id="guide"><div class="${prefix}-page-head"><span>GUIDE</span><h2>观展指南</h2><a href="#home" data-page-link="home">返回首页</a></div><div class="${prefix}-guide-mount" data-oe-mount="guide-detail" class="guide-detail-grid"></div></section>`;
}

function footer(prefix){
 return `<footer class="${prefix}-footer footer"><div data-oe-mount="footer-brand" class="footer-brand"></div><div data-oe-mount="footer-participate" class="footer-participate"></div><div data-oe-mount="footer-visit" class="footer-visit"></div><div data-oe-mount="footer-social" class="footer-social"></div></footer>`;
}

function commonUtility(prefix){
 return `
 <section class="${prefix}-community" id="community"><div class="${prefix}-section-heading"><span>COMMUNITY</span><h2>社群与活动公告</h2></div><div data-oe-mount="community" class="community"></div></section>
 <section class="${prefix}-sponsors" id="sponsors"><div class="${prefix}-section-heading"><span>SUPPORT</span><h2>赞助支持</h2></div><div data-oe-mount="sponsors" class="sponsors"></div></section>`;
}

function heroFields(extra=''){
 return `<div class="hero-copy ${extra}"><h1><span class="hero-title-line hero-title-1">STAR</span><br><em class="hero-title-line hero-title-2">BEAT</em><br><span class="hero-title-line hero-title-3">ONLY</span></h1><p>围绕单一作品 IP 的粉丝综合活动。所有内容由 OnlyEvent Studio 统一管理。</p><div class="meta"><span class="pill">11.08 SUN</span><span class="pill">杭州</span><a class="pill venue-nav" href="#" target="_blank" rel="noopener">杭州国际博览中心</a></div></div>`;
}
function heroKV(extra=''){return `<div class="hero-art ${extra}"><div class="kv"></div></div>`}

export const variantBodies={
'02-scrapbook':entryLoader+
`<div class="scrap-site"><div class="scrap-side-a">A SIDE / WONDERFUL MEMORIES</div><div class="scrap-side-b">B SIDE / TROUBLE & HAPPENINGS</div>`+
standardNav('scrap-nav')+
`<main id="top">
<section class="hero scrap-hero"><div class="oe-home-only scrap-hero-grid">
  <div class="scrap-tape-wrap"><div class="scrap-tape"><span class="reel r1"></span><span class="reel r2"></span><b>THE MEMORIES<br>OF A TRIP</b><small>01 / SPECIAL JOURNEY</small></div><div class="scrap-postcard">HAMA NICE TRIP<br><b>1ST ANNIVERSARY</b></div></div>
  ${heroKV('scrap-photo')}${heroFields('scrap-copy')}
</div></section>
<section class="oe-home-only scrap-manifesto"><div><span>THE MEMORIES OF A TRIP ARE LIKE A SINGLE CASSETTE TAPE.</span><p>旅行中留下的美好与意外，不是彼此分开的两面，而是同一次旅程的完整记忆。</p></div></section>
<div class="scrap-hashtags">#EIGHTEEN TRIP　#1ST ANNIVERSARY　#HAMA NICE TRIP</div>
<section class="oe-home-only scrap-news" id="updates"><div class="scrap-label">LATEST UPDATE</div><div data-oe-mount="updates" class="updates-list"></div></section>
<section class="oe-home-only scrap-memory-menu"><div class="scrap-label">CONTENTS / INDEX</div><div data-oe-mount="quick" class="quick-grid"></div></section>
<section class="oe-home-only scrap-ticket-book" id="tickets"><div class="scrap-section-title"><span>TRAVEL PASS</span><h2>票务与特典</h2></div><div data-oe-mount="tickets" class="ticket-grid"></div><div data-oe-mount="ticket-actions" class="ticket-actions"></div></section>
<section class="oe-home-only scrap-featured" id="participation"><div class="scrap-section-title"><span>MEMORY PICKS</span><h2>活动精选</h2></div><div data-oe-mount="featured-activities" class="featured-activity-grid"></div></section>
<section class="oe-home-only scrap-map" id="map-home"><div class="oe-home-only scrap-map-copy"><span>TRAVEL MAP</span><h2>场地图</h2><div data-oe-mount="map-links" class="map-link-list"></div></div><div data-oe-mount="map" id="venueMap" class="map-static"></div></section>
<div class="oe-home-only ribbon scrap-ribbon" data-oe-mount="ribbon"><div class="ribbon-track" data-oe-mount="ribbon-track"></div></div>
${detailPages('scrap')}${commonUtility('scrap')}
</main>${mobileNav()}${footer('scrap')}</div>`,

'03-school-festival':entryLoader+
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
</main>${mobileNav()}${footer('school')}</div>`,

'04-museum-editorial':entryLoader+
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
</main>${mobileNav()}${footer('museum')}</div>`,

'05-live-poster':entryLoader+
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
</main>${mobileNav()}${footer('live')}</div>`,

'06-expo-catalogue':entryLoader+
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
</main>${mobileNav()}${footer('expo')}</div>`,

'07-immersive-character':entryLoader+
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
</main>${mobileNav()}${footer('kimetsu')}</div>`
};
