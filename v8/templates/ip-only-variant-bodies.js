const loader=`<div class="loader" id="loader"><div class="gate" role="button" tabindex="0" aria-label="点击纪念票进入活动网站"><section class="ticket-half left"><div class="entry-photo" aria-label="活动KV"></div></section><aside class="ticket-half right"><div class="entry-ticket-label">MEMORIAL TICKET</div><div class="entry-ticket-title">STARDUST ONLY 2026</div><div class="entry-ticket-subtitle"></div><div class="entry-ticket-meta"><div class="entry-ticket-date-wrap"><span>DATE</span><b class="entry-ticket-date">2026.11.08</b></div><div class="entry-ticket-time-wrap"><span>TIME</span><b class="entry-ticket-time"></b></div><div class="entry-ticket-location-wrap"><span>PLACE</span><b class="entry-ticket-location">杭州</b></div></div><div class="stub-barcode" aria-hidden="true"></div><div class="stub-code"><span class="entry-serial stub-number">NO. 048271</span></div></aside></div><button class="skip" id="skip">跳过动画 →</button></div>`;

const pageViews=`
<section class="section oe-page-view" id="booths"><div class="wrap"><div class="head"><div><span class="ey">BOOTH DIRECTORY</span><h2>摊位详情</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div><div class="booth-directory-rich"></div></div></section>
<section class="section oe-page-view" id="activities"><div class="wrap"><div class="head activity-main-head"><div><span class="ey">PROGRAM</span><h2>活动</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div><div class="activity-switch-row"><div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">日程</button><button type="button" data-activity-view="programs">活动详情</button></div><div class="activity-day-tabs"></div></div><div class="activity-page-block" data-activity-panel="timeline"><div class="activity-page-subhead"><span>SCHEDULE</span><b>当天日程</b></div><div class="activity-detail-list"></div></div><div class="activity-page-block" data-activity-panel="programs" hidden><div class="activity-page-subhead"><span>PROGRAMS</span><b>活动详情</b></div><div class="activity-project-list participation-list"></div></div></div></section>
<section class="section oe-page-view" id="guests"><div class="wrap"><div class="head"><div><span class="ey">GUESTS</span><h2>嘉宾</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div><div class="guest-grid"></div></div></section>
<section class="section oe-page-view" id="guide"><div class="wrap"><div class="head"><div><span class="ey">GUIDE</span><h2>观展指南</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div><div class="guide-grid guide-detail-grid"></div></div></section>`;

const sharedTail=`
<section class="section alt" id="community"><div class="wrap"><div class="head"><div><span class="ey">COMMUNITY</span><h2>社群与活动公告</h2></div><span class="section-no">COMMUNITY</span></div><div class="community"></div></div></section>
<section class="section" id="sponsors"><div class="wrap"><div class="head"><div><span class="ey">SUPPORT</span><h2>赞助支持</h2></div><span class="section-no">SUPPORT</span></div><div class="sponsors"></div></div></section>
</main>
<nav class="mobile-dock"><a href="#home" data-page-link="home">首页</a><a href="#booths" data-target-mode="page" data-page-link="booths">摊位</a><a href="#activities" data-target-mode="page" data-page-link="activities">活动</a><a href="#guests" data-target-mode="page" data-page-link="guests">嘉宾</a><a href="#guide" data-target-mode="page" data-page-link="guide">指南</a></nav>
<footer class="footer"><div class="wrap footer-grid"><div class="footer-brand"></div><div class="footer-participate"></div><div class="footer-visit"></div><div class="footer-social"></div></div></footer>`;

const quick=`<section class="quick"><div class="wrap quick-grid"><a class="quick-card" href="#tickets"><span>01</span><b>票务与特典</b><small>查看票种 →</small></a><a class="quick-card" href="#booths" data-target-mode="page" data-page-link="booths"><span>02</span><b>摊位与制品</b><small>查看摊位 →</small></a><a class="quick-card" href="#activities" data-target-mode="page" data-page-link="activities"><span>03</span><b>活动</b><small>查看活动 →</small></a><a class="quick-card" href="#guide" data-target-mode="page" data-page-link="guide"><span>04</span><b>观展指南</b><small>查看指南 →</small></a><a class="quick-card" href="#map-home"><span>05</span><b>场地图</b><small>查看场地 →</small></a></div></section>`;

const tickets=`<section class="section alt" id="tickets"><div class="wrap"><div class="head"><div><span class="ey">TICKETS</span><h2>票种与特典</h2></div><span class="section-no">01</span></div><div class="ticket-grid"></div><div class="ticket-actions"><a class="btn" href="https://www.bilibili.com/" target="_blank" rel="noopener">前往官方售票平台 ↗</a></div></div></section>`;
const map=`<section class="section alt" id="map-home"><div class="wrap"><div class="head"><div><span class="ey">VENUE MAP</span><h2>场地图</h2></div><span class="section-no">02</span></div><div class="map-explorer"><div class="map-static-shell"><div class="map-static" id="venueMap" data-oe-image="venueMap.image"></div></div><aside class="map-link-rail" data-oe-collection="explore"><span class="ey">EXPLORE</span><b>继续探索</b><div class="map-link-list"></div></aside></div></div></section>`;
const featured=`<section class="section" id="participation"><div class="wrap"><div class="head featured-home-head"><div><span class="ey">FEATURED ACTIVITIES</span><h2>活动精选</h2></div><span class="section-no">03</span></div><div class="featured-activity-grid"></div><a class="featured-all-link btn" href="#activities" data-target-mode="page" data-page-link="activities">查看全部活动 <span>→</span></a></div></section>`;

const nav=(mod='')=>`<header class="nav ${mod}"><div class="wrap"><a class="brand" href="#top">STARDUST ONLY 2026</a><nav class="links"><a href="#home" data-page-link="home">首页</a><a href="#booths" data-target-mode="page" data-page-link="booths">摊位</a><a href="#activities" data-target-mode="page" data-page-link="activities">活动</a><a href="#guests" data-target-mode="page" data-page-link="guests">嘉宾</a><a href="#guide" data-target-mode="page" data-page-link="guide">观展指南</a></nav><a class="btn" href="https://www.bilibili.com/" target="_blank" rel="noopener">TICKET ↗</a></div></header>`;

function heroShell(extra,inside){return `<section class="hero ${extra}"><div class="wrap hero-grid">${inside}</div></section>`}
const heroCopy=`<div class="hero-copy"><h1><span class="hero-title-line hero-title-1">STAR</span><br><em class="hero-title-line hero-title-2">BEAT</em><br><span class="hero-title-line hero-title-3">ONLY</span></h1><p>围绕单一作品 IP 的粉丝综合活动。摊位、嘉宾、舞台、地图与特别企划都使用同一套 OnlyEvent 内容数据。</p><div class="meta"><span class="pill">11.08 SUN</span><span class="pill">杭州</span><a class="pill venue-nav" href="#" target="_blank" rel="noopener">杭州国际博览中心</a></div></div>`;
const heroArt=`<div class="hero-art"><div class="kv"></div><div class="sticker s1" data-edit-id="sticker1"><span class="editable-copy">限定企划 ✦</span></div><div class="sticker s2" data-edit-id="sticker2"><span class="editable-copy">40+ 社团</span></div><div class="sticker s3" data-edit-id="sticker3"><span class="editable-copy">COS OK!</span></div></div>`;
const ribbon=`<div class="ribbon" data-edit-id="ribbon"><div class="ribbon-track"><div class="ribbon-sequence"><span class="ribbon-edit" data-oe-field="ribbonItems.0.text">摊位公开中</span><span class="ribbon-edit" data-oe-field="ribbonItems.1.text">特典票限量</span><span class="ribbon-edit" data-oe-field="ribbonItems.2.text">COS 自由行开放</span><span class="ribbon-edit" data-oe-field="ribbonItems.3.text">舞台企划更新</span></div><div class="ribbon-sequence" aria-hidden="true"><span class="ribbon-edit" data-oe-field="ribbonItems.0.text">摊位公开中</span><span class="ribbon-edit" data-oe-field="ribbonItems.1.text">特典票限量</span><span class="ribbon-edit" data-oe-field="ribbonItems.2.text">COS 自由行开放</span><span class="ribbon-edit" data-oe-field="ribbonItems.3.text">舞台企划更新</span></div></div></div>`;
const updates=`<section class="updates-strip" id="updates"><div class="wrap"><div class="updates-list"></div></div></section>`;

export const variantBodies={
'02-scrapbook':loader+nav('scrap-nav')+`<main id="top"><div class="scrap-opening"><span>A SIDE / WONDERFUL MEMORIES</span><span>B SIDE / TROUBLE & HAPPENINGS</span></div>`+
 heroShell('scrap-hero',`<div class="scrap-cassette"><div class="cassette-window"><span></span><span></span></div><b>MEMORIES OF A TRIP</b></div>`+heroArt+heroCopy)+
 `<div class="scrap-hashtags">#ONLYEVENT　#SPECIALTRIP　#MEMORYTAPE</div>`+ribbon+updates+
 `<section class="scrap-story"><div class="wrap"><span>THE MEMORIES OF A TRIP</span><p>一次活动像一盘双面的磁带。舞台、摊位、相遇、突发的小插曲都会成为当天的记忆。</p></div></section>`+
 quick+tickets+featured+map+pageViews+sharedTail,

'03-school-festival':loader+`<div class="school-rail"><b>ONLY EVENT</b><span>01 HOME</span><span>02 BOOTH</span><span>03 STAGE</span><span>04 GUIDE</span></div>`+nav('school-nav')+
 `<main id="top">`+heroShell('school-hero',heroCopy+`<div class="school-info-board"><span>4th ANNIVERSARY FESTIVAL</span><b>3 DAYS<br>CHALLENGE!</b><div>EVENT / STAGE / GOODS / GUIDE</div></div>`+heroArt)+
 `<div class="school-wave"><i></i><i></i><i></i></div>`+updates+quick+
 `<section class="school-about"><div class="wrap"><div class="school-big-no">04</div><div><span>ABOUT THE FESTIVAL</span><h2>一起庆祝属于这个作品的特别一天。</h2></div></div></section>`+
 tickets+`<div class="school-block-pair">`+featured+map+`</div>`+pageViews+sharedTail,

'04-museum-editorial':loader+nav('museum-nav')+`<main id="top"><div class="museum-index"><span>10TH ANNIV.</span><span>EXHIBITION</span><span>2026</span></div>`+
 heroShell('museum-hero',`<div class="museum-caption"><span>EXHIBITION 01</span><p>INTRODUCTION</p></div>`+heroArt+heroCopy)+
 `<section class="museum-intro"><div class="wrap"><span>INTRODUCTION</span><h2>把十年的记忆，作为一场展览重新观看。</h2><p>图片、声音、人物与共同创造的时刻，以展签与章节的方式重新组织。</p></div></section>`+
 updates+`<div class="museum-rule"></div>`+tickets+featured+map+`<div class="museum-index-grid">`+quick+`</div>`+pageViews+sharedTail,

'05-live-poster':loader+nav('live-nav')+`<main id="top"><div class="live-top-strip"><span>5TH ANNIVERSARY</span><span>THANKS FESTIVAL</span><span>LIVE / STAGE / CONTENTS</span></div>`+
 heroShell('live-hero',`<div class="live-five">5</div>`+heroCopy+heroArt)+
 `<div class="live-date-banner"><small>2026</small><b>11.08</b><span>SAT ▶ SUN</span></div>`+ribbon+
 `<section class="live-cast-intro"><div class="wrap"><span>CAST & STAGE</span><h2>出演者和节目，是首页最重要的信息。</h2></div></section>`+
 featured+quick+tickets+`<div class="live-stage-map">`+map+`</div>`+pageViews+sharedTail,

'06-expo-catalogue':loader+nav('expo-nav')+`<main id="top"><div class="expo-category-bar"><span>LIVE SHOWCASE AREA</span><span>EXPO AREA</span><span>OUTDOOR AREA</span></div>`+
 heroShell('expo-hero',heroCopy+heroArt+`<aside class="expo-index"><b>CONTENTS INDEX</b><ol><li>NEWS</li><li>AREA</li><li>TICKET</li><li>BOOTH</li><li>STAGE</li></ol></aside>`)+
 updates+`<section class="expo-board"><div class="wrap"><div class="expo-board-cell cyan"><b>LIVE SHOWCASE</b><p>舞台与表演区域</p></div><div class="expo-board-cell magenta"><b>EXPO AREA</b><p>社团、展示、特别企划</p></div><div class="expo-board-cell yellow"><b>OUTDOOR</b><p>场外活动与交通</p></div></div></section>`+
 quick+tickets+map+featured+pageViews+sharedTail,

'07-immersive-character':loader+nav('kimetsu-nav')+`<main id="top"><div class="jp-cloud cloud-a"></div><div class="jp-cloud cloud-b"></div>`+
 heroShell('kimetsu-hero',`<div class="kimetsu-frame-label"><span>追憶回廊</span><b>MEMORY CORRIDOR</b></div>`+heroArt+heroCopy)+
 `<section class="kimetsu-prologue"><div class="wrap"><span>序　章</span><h2>記憶を辿る、ひとつの回廊。</h2><p>作品世界を歩くように、活動情報を章立てで巡る。</p></div></section>`+
 ribbon+`<div class="kimetsu-frames"><i></i><i></i><i></i></div>`+quick+
 `<section class="kimetsu-chapter"><div class="wrap"><span>第一章</span><h2>入場と特典</h2></div></section>`+tickets+
 `<section class="kimetsu-chapter"><div class="wrap"><span>第二章</span><h2>催しと会場</h2></div></section>`+featured+map+pageViews+sharedTail
};
