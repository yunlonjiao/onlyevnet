/* Template 02 — Travel / cassette / tourism website shell.
   Built reference-first. Shared Core mounts are intentionally embedded into
   this independent shell instead of inheriting Template 01 page composition. */

export const previewBody=`
<div class="loader scrap-entry" id="loader">
  <div class="gate scrap-entry-gate" role="button" tabindex="0" aria-label="点击进入活动网站">
    <section class="scrap-entry-photo ticket-half left"><div class="entry-photo" aria-label="活动KV"></div></section>
    <aside class="scrap-entry-info ticket-half right">
      <div class="entry-ticket-label">SPECIAL JOURNEY</div>
      <div class="entry-ticket-title" data-oe-field="eventName">ONLY EVENT</div>
      <div class="entry-ticket-subtitle"></div>
      <div class="entry-ticket-meta">
        <div class="entry-ticket-date-wrap"><span>DATE</span><b class="entry-ticket-date" data-oe-field="date">EVENT DATE</b></div>
        <div class="entry-ticket-time-wrap"><span>TIME</span><b class="entry-ticket-time"></b></div>
        <div class="entry-ticket-location-wrap"><span>DESTINATION</span><b class="entry-ticket-location" data-oe-field="location">EVENT CITY</b></div>
      </div>
      <div class="stub-barcode" aria-hidden="true"></div>
      <div class="stub-code"><span class="entry-serial stub-number">MEMORY / 001</span></div>
    </aside>
  </div>
  <button class="skip" id="skip">SKIP →</button>
</div>

<div class="trip-site">
  <header class="trip-header">
    <a class="trip-logo" href="#home" data-page-link="home">
      <small>活动导航 / EVENT SITE</small>
      <b data-oe-field="eventName">ONLY EVENT</b>
    </a>
    
    <nav class="trip-nav" data-oe-mount="nav-links">
      <a href="#booths" data-target-mode="page" data-page-link="booths"><small>01</small><strong>摊位</strong><em>BOOTH</em></a>
      <a href="#activities" data-target-mode="page" data-page-link="activities"><small>02</small><strong>活动</strong><em>EVENT</em></a>
      <a href="#guide" data-target-mode="page" data-page-link="guide"><small>04</small><strong>指南</strong><em>GUIDE</em></a>
    </nav>
    
  </header>

  <nav class="trip-mobile-nav" data-oe-mount="mobile-nav">
    <a href="#home" data-page-link="home"><small>00</small><strong>首页</strong><em>HOME</em></a>
    <a href="#booths" data-target-mode="page" data-page-link="booths"><small>01</small><strong>摊位</strong><em>BOOTH</em></a>
    <a href="#activities" data-target-mode="page" data-page-link="activities"><small>02</small><strong>活动</strong><em>EVENT</em></a>
    <a href="#guide" data-target-mode="page" data-page-link="guide"><small>04</small><strong>指南</strong><em>GUIDE</em></a>
  </nav>

  <main id="top">
    <section class="trip-hero hero oe-home-only" id="home">
      <div class="trip-hero-visual">
        <div class="kv"><span class="trip-kv-placeholder" aria-hidden="true">活动主视觉<small>KV · 1920 × 1080</small></span></div>
        
      </div>
      <div class="trip-hero-copy hero-copy" hidden aria-hidden="true"></div>
    </section>

    <div class="trip-route-ticker ribbon oe-home-only"><div class="trip-route-ticker-track ribbon-track"></div></div>

    <section class="trip-event-facts oe-home-only" aria-label="活动基本信息">
      <div class="trip-event-fact"><span>EVENT DATE</span><strong data-oe-field="date">活动日期</strong></div>
      <div class="trip-event-fact"><span>DESTINATION</span><strong data-oe-field="location">举办城市</strong></div>
      <div class="trip-event-fact"><span>VENUE</span><a class="venue-nav" href="#map-home" title="查看场馆位置"><strong data-oe-field="edition">活动场馆</strong></a></div>
      <div class="trip-event-fact"><span>EVENT STATUS</span><strong data-oe-status="event">活动未开始</strong></div>
    </section>

    <section class="trip-intro oe-home-only oe-editorial-section" id="event-introduction">
      <aside class="oe-editorial-rail"><span>活动简介</span><small>INTRODUCTION</small></aside>
      <div class="trip-intro-copy">
        <h2>关于本次活动<small>ABOUT THE EVENT</small></h2>
        <p data-oe-field="tagline">一次相遇，一段值得珍藏的旅程。</p>
      </div>
      <div class="trip-collage" aria-hidden="true">
        <div class="trip-card c1"><span>EVENT DAY</span></div>
        <div class="trip-card c2"><span>DESTINATION</span></div>
        <div class="trip-card c3"><span>ONLY EVENT</span></div>
        <div class="trip-ticket-stub">ONLY EVENT<br><b>BOARDING PASS</b><small>A DAY TO REMEMBER</small></div>
        <div class="trip-cassette"><i></i><i></i><b>SPECIAL JOURNEY</b><small>MEMORY TAPE / 001</small></div>
      </div>
    </section>

    <section class="trip-news oe-home-only oe-editorial-section" id="updates">
      <header class="oe-editorial-rail"><span>最新公告</span><b>最新公告</b><small>NEWS / UPDATES</small></header>
      <div class="trip-news-columns"><span>DATE</span><span>TYPE</span><span>REMARKS</span></div>
      <div data-oe-mount="updates" class="updates-list"></div>
    </section>

    <section class="trip-transition oe-home-only" hidden aria-hidden="true">
      <span>ONE EVENT / ONE COMMUNITY</span>
      <b>MEET HERE.<br>MAKE MEMORIES.</b>
      <i>→</i>
    </section>

    <section class="trip-index oe-home-only oe-editorial-section">
      <header class="oe-editorial-rail"><span>快速导航 / DIRECTORY</span><b>你想去哪里？</b></header>
      <div data-oe-mount="quick" class="quick-grid"></div>
    </section>

    <section class="trip-feature oe-home-only oe-editorial-section" id="participation">
      <header class="oe-editorial-rail"><span>活动精选 / PICK UP</span><h2>精彩活动<small>JOURNEY HIGHLIGHTS</small></h2></header>
      <div data-oe-mount="featured-activities" class="featured-activity-grid"></div>
    </section>

    <section class="trip-ticket-section oe-home-only oe-editorial-section" id="tickets">
      <div class="trip-ticket-cover oe-editorial-rail"><small>票务信息 / ADMISSION</small><b>入场票<br><i>TICKETS</i></b></div>
      <div class="trip-ticket-list">
        <div data-oe-mount="tickets" class="ticket-grid"></div>
        <div data-oe-mount="ticket-actions" class="ticket-actions"></div>
      </div>
    </section>

    <section class="trip-map oe-home-only oe-editorial-section" id="map-home">
      <div class="trip-map-copy oe-editorial-rail"><span>场地导览 / DESTINATION</span><h2>场地图<small>VENUE MAP</small></h2><div data-oe-mount="map-links" class="map-link-list"></div></div>
      <div class="trip-map-paper"><div data-oe-mount="map" id="venueMap" class="map-static"></div></div>
    </section>

    <section class="trip-home-guests oe-home-only oe-editorial-section" id="home-guests">
      <header class="oe-editorial-rail"><span>嘉宾阵容 / GUESTS</span><h2>嘉宾<small>GUEST / CHARACTER</small></h2></header>
      <div class="trip-guest-carousel"><div class="guest-grid" data-oe-mount="guests" tabindex="0" aria-label="嘉宾列表，左右滑动浏览"></div></div>
    </section>
    <section class="trip-page oe-page-view" id="booths">
      <header class="trip-page-head"><span>ROUTE 01 / BOOTH</span><h2>摊位与制品</h2><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></header>
      <div class="booth-directory-rich" data-oe-mount="booths"></div>
    </section>

    <section class="trip-page oe-page-view" id="activities">
      <header class="trip-page-head"><span>ROUTE 02 / EVENT</span><h2>活动与日程</h2><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></header>
      <div class="trip-activity-switch">
        <div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">当天日程</button><button type="button" data-activity-view="programs">活动详情</button></div>
        <div data-oe-mount="activity-days" class="activity-day-tabs"></div>
      </div>
      <div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div>
      <div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div>
    </section>



    <section class="trip-page oe-page-view" id="guide">
      <header class="trip-page-head"><span>ROUTE 04 / GUIDE</span><h2>观展指南</h2><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></header>
      <div class="guide-detail-grid" data-oe-mount="guide-detail"></div>
    </section>

    <section class="trip-community" id="community"><div class="trip-social-wallpaper" aria-hidden="true"><div class="trip-wallpaper-top trip-wallpaper-marquee"><b>COMMUNITY&nbsp; ✦ &nbsp;COMMUNITY&nbsp; ✦ &nbsp;COMMUNITY&nbsp; ✦ &nbsp;</b><b aria-hidden="true">COMMUNITY&nbsp; ✦ &nbsp;COMMUNITY&nbsp; ✦ &nbsp;COMMUNITY&nbsp; ✦ &nbsp;</b></div><div class="trip-wallpaper-bottom trip-wallpaper-marquee"><b>COMMUNITY&nbsp; ✦ &nbsp;COMMUNITY&nbsp; ✦ &nbsp;COMMUNITY&nbsp; ✦ &nbsp;</b><b aria-hidden="true">COMMUNITY&nbsp; ✦ &nbsp;COMMUNITY&nbsp; ✦ &nbsp;COMMUNITY&nbsp; ✦ &nbsp;</b></div></div><header><span>STAY CONNECTED</span></header><div data-oe-mount="community" class="community"></div></section>
    <section class="trip-sponsors" id="sponsors"><header><span>TRAVEL PARTNERS</span><h2>PARTNERS</h2></header><div data-oe-mount="sponsors" class="sponsors"></div></section>
  </main>

  <footer class="trip-footer footer">
    <div class="trip-footer-mark">END OF<br>JOURNEY</div>
    <div data-oe-mount="footer-brand" class="footer-brand"></div>
    <div data-oe-mount="footer-participate" class="footer-participate"></div>
    <div data-oe-mount="footer-visit" class="footer-visit"></div>
    <div data-oe-mount="footer-social" class="footer-social"></div>
  </footer>
</div>
`;

export const previewStyle=`
:root{--trip-bg:#eee7db;--trip-paper:#fffaf0;--trip-ink:#2f2926;--trip-pink:#ef7d90;--trip-blue:#9bd1e2;--trip-lime:#dcff42;--trip-line:#b9aa97}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--trip-bg);color:var(--trip-ink);font-family:"Trebuchet MS","Noto Sans SC",sans-serif;overflow-x:hidden}a{color:inherit;text-decoration:none}button{font:inherit;color:inherit}
.trip-site{min-height:100vh;background:var(--trip-bg)}
.trip-header{position:sticky;top:0;z-index:90;display:grid;grid-template-columns:260px minmax(230px,1fr) auto auto;min-height:78px;background:rgba(255,250,240,.97);border-bottom:1px solid var(--trip-line);backdrop-filter:blur(14px)}
.trip-logo{display:grid;align-content:center;padding:12px 24px;border-right:1px solid var(--trip-line)}.trip-logo small{font:700 7px/1.2 monospace;letter-spacing:.16em;color:#887969}.trip-logo b{margin-top:5px;font:600 23px/.9 Georgia,serif;letter-spacing:-.04em}
.trip-flight-info{display:flex;align-items:center;gap:13px;padding:0 22px;font:700 8px/1 monospace;letter-spacing:.1em;color:#66584e}.trip-flight-info i{width:5px;height:5px;border-radius:50%;background:var(--trip-pink)}
.trip-nav{display:flex}.trip-nav a{min-width:76px;display:grid;place-items:center;padding:10px 12px;border-left:1px solid var(--trip-line);font:700 9px/1 Georgia,serif}.trip-nav small{display:block;margin-bottom:5px;font:700 7px/1 monospace;color:var(--trip-pink)}
.trip-ticket{display:grid;place-items:center;padding:0 24px;background:var(--trip-lime);border-left:1px solid var(--trip-ink);font:900 9px/1 monospace;letter-spacing:.09em}.trip-mobile-nav{display:none}

.trip-hero{min-height:calc(100vh - 78px);display:grid;grid-template-columns:minmax(0,1.15fr) minmax(370px,.85fr);grid-template-rows:1fr auto;border-bottom:1px solid var(--trip-line)}
.trip-hero-visual{position:relative;min-height:720px;padding:5vw 2.5vw 4vw 5vw;background:linear-gradient(145deg,#b7e0ea 0 52%,#eee7db 52%)}.trip-hero-visual:before{content:"A SIDE / GOOD MEMORIES";position:absolute;left:15px;top:50%;writing-mode:vertical-rl;transform:translateY(-50%);font:800 7px/1 monospace;letter-spacing:.2em;color:#fff}
.trip-hero-visual .kv{position:absolute;inset:5vw 8% 6vw 6%;background:#d8d1c7 center/cover no-repeat;border:14px solid #fff;border-bottom-width:72px;box-shadow:0 25px 50px #4a37252b;transform:rotate(-1.2deg)}
.trip-photo-caption{position:absolute;left:11%;bottom:7vw;display:flex;gap:18px;font:700 8px/1 monospace;letter-spacing:.08em}.trip-photo-caption span{color:var(--trip-pink)}
.trip-hero-copy{position:relative;display:flex;flex-direction:column;justify-content:center;padding:6vw 5vw 5vw 4vw;background:var(--trip-paper)}.trip-route{margin-bottom:26px;font:800 8px/1 monospace;letter-spacing:.17em;color:var(--trip-pink)}
.trip-hero-copy h1{margin:0;font:500 clamp(62px,7.5vw,120px)/.8 Georgia,serif;letter-spacing:-.07em}.trip-hero-copy h1 em{color:var(--trip-pink);font-style:italic}.trip-hero-copy>p{max-width:430px;margin:28px 0;font-size:13px;line-height:1.9;color:#665a50}
.trip-hero-meta{display:grid;gap:7px;padding-top:16px;border-top:1px dashed var(--trip-line);font:700 9px/1.35 monospace}.trip-hero-meta a{text-decoration:underline;text-underline-offset:3px}
.trip-stamp{position:absolute;right:30px;bottom:34px;width:94px;height:94px;display:grid;place-items:center;text-align:center;border:2px solid var(--trip-pink);border-radius:50%;transform:rotate(10deg);font:700 8px/1.2 monospace;color:var(--trip-pink)}.trip-stamp b{font-size:19px}
.trip-weather-strip{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);background:#2f2926;color:#fff}.trip-weather-strip span{display:grid;gap:4px;padding:14px 22px;border-right:1px solid #5c514b;font:700 9px/1.2 monospace}.trip-weather-strip b{font-size:6px;letter-spacing:.14em;color:var(--trip-blue)}

.trip-route-ticker{overflow:hidden;background:var(--trip-lime);border-bottom:1px solid var(--trip-ink);white-space:nowrap}.trip-route-ticker>div{display:inline-flex;min-width:max-content;animation:tripTicker 28s linear infinite}.trip-route-ticker span{display:inline-block;padding:12px 28px;border-right:1px solid #8e9d31;font:900 8px/1 monospace;letter-spacing:.13em}@keyframes tripTicker{to{transform:translateX(-50%)}}

.trip-news{display:grid;grid-template-columns:240px 1fr;background:var(--trip-paper);border-bottom:1px solid var(--trip-line)}.trip-news>header{padding:44px 30px;border-right:1px solid var(--trip-line)}.trip-news>header span,.trip-index>header span,.trip-feature>header>span,.trip-ticket-cover small,.trip-map-copy>span,.trip-page-head>span,.trip-community header span,.trip-sponsors header span{font:800 7px/1 monospace;letter-spacing:.17em;color:var(--trip-pink)}
.trip-news>header b{display:block;margin-top:12px;font:500 34px/.92 Georgia,serif}.trip-news>header small{display:block;margin-top:22px;font:700 7px/1.7 monospace;letter-spacing:.06em;color:#8a7c70}.trip-news-columns{display:grid;grid-template-columns:120px 90px 1fr;align-content:end;padding:20px 32px 0;font:800 7px/1 monospace;letter-spacing:.12em;color:#8a7c70}
.trip-news .updates-list{grid-column:2;padding:0 32px 24px}.scrap-update{display:grid!important;grid-template-columns:120px 90px 1fr auto!important;align-items:center;gap:0!important;padding:16px 0!important;border:0!important;border-bottom:1px dashed var(--trip-line)!important;background:none!important;box-shadow:none!important;transform:none!important;border-radius:0!important}.scrap-update time{font:700 8px/1 monospace}.scrap-update b{font-size:12px;font-weight:700}.scrap-update>span{font:800 7px/1 monospace;color:var(--trip-pink)}

.trip-intro{display:grid;grid-template-columns:150px minmax(0,1fr) 430px;gap:56px;align-items:center;padding:135px max(5vw,42px);border-bottom:1px solid var(--trip-line)}.trip-intro>aside{align-self:start}.trip-intro>aside span{font:800 7px/1 monospace;letter-spacing:.18em}.trip-intro>aside b{display:block;margin-top:20px;font:500 92px/.8 Georgia,serif;color:#d1c3b3}
.trip-intro-copy h2{margin:0 0 36px;font:500 clamp(38px,4.8vw,68px)/1.05 Georgia,serif;letter-spacing:-.04em}.trip-intro-copy p{max-width:650px;font-size:14px;line-height:2;color:#6d6056}
.trip-collage{height:390px;position:relative}.trip-card{position:absolute;width:180px;height:230px;background:#d5cec3;border:10px solid #fff;box-shadow:0 12px 28px #4a382725}.trip-card.c1{left:10px;top:16px;transform:rotate(-8deg);background:#add5df}.trip-card.c2{right:8px;top:48px;transform:rotate(9deg);background:#efb8c2}.trip-card.c3{left:118px;bottom:0;transform:rotate(2deg);background:#e4d49e}.trip-card span{position:absolute;left:9px;bottom:-27px;font:800 7px/1 monospace;letter-spacing:.12em;color:#6d6056}.trip-ticket-stub{position:absolute;right:-8px;bottom:20px;z-index:2;width:180px;padding:18px 16px;background:var(--trip-lime);border:1px solid var(--trip-ink);transform:rotate(8deg);font:800 7px/1.35 monospace;letter-spacing:.1em}.trip-ticket-stub b{display:block;margin:8px 0;font-size:13px}.trip-ticket-stub small{font-size:6px}
.trip-cassette{position:absolute;left:68px;top:112px;z-index:3;width:280px;height:174px;padding:24px;border:2px solid #62564d;border-radius:21px;background:#f4e3cf;box-shadow:12px 14px 0 #b9a58f;transform:rotate(-5deg)}.trip-cassette i{position:absolute;top:60px;width:46px;height:46px;border:3px solid #6b6057;border-radius:50%;background:#fff}.trip-cassette i:first-child{left:44px}.trip-cassette i:nth-child(2){right:44px}.trip-cassette b{font:700 12px/1 Georgia,serif}.trip-cassette small{position:absolute;left:24px;bottom:18px;font:700 7px/1 monospace;letter-spacing:.12em}

.trip-transition{position:relative;display:grid;grid-template-columns:180px 1fr auto;align-items:end;gap:40px;padding:80px max(5vw,44px);background:var(--trip-paper);border-bottom:1px solid var(--trip-line)}.trip-transition span{font:800 7px/1.5 monospace;letter-spacing:.16em;color:var(--trip-pink)}.trip-transition b{font:500 clamp(36px,4.8vw,68px)/.96 Georgia,serif;letter-spacing:-.04em}.trip-transition i{font:400 62px/1 Georgia,serif;color:#c7b7a6;font-style:normal}

.trip-index{display:grid;grid-template-columns:240px 1fr;background:#2f2926;color:#fff;border-bottom:1px solid #5c514b}.trip-index>header{padding:45px 30px;border-right:1px solid #5c514b}.trip-index>header b{display:block;margin-top:14px;font:500 27px/1.05 Georgia,serif}.trip-index .quick-grid{display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:0!important}.scrap-index-card{min-height:210px!important;display:flex!important;flex-direction:column!important;justify-content:space-between!important;padding:26px 22px!important;border:0!important;border-right:1px solid #5c514b!important;border-radius:0!important;background:transparent!important;color:#fff!important;box-shadow:none!important;transform:none!important}.scrap-index-card>span{font:500 36px/1 Georgia,serif!important;color:#746961!important}.scrap-index-card small{font:700 7px/1 monospace!important;color:var(--trip-pink)!important}.scrap-index-card b{display:block;margin-top:8px;font:500 24px/1 Georgia,serif!important}.scrap-index-card em{margin-top:8px;font:700 8px/1.4 monospace!important;color:#aaa09a!important;font-style:normal!important}.scrap-index-card>i{align-self:flex-end;color:var(--trip-lime);font-style:normal}

.trip-feature{display:grid;grid-template-columns:310px 1fr;gap:58px;padding:120px max(5vw,44px);background:#e4f0f2;border-bottom:1px solid #a7c7cf}.trip-feature>header{position:sticky;top:110px;align-self:start}.trip-feature h2{margin:10px 0 20px;font:500 54px/.9 Georgia,serif}.trip-feature>header p{font-size:12px;line-height:1.8;color:#587078}.trip-feature .featured-activity-grid{display:grid!important;grid-template-columns:1fr!important;gap:30px!important}.trip-feature .scrap-activity{display:grid!important;grid-template-columns:minmax(250px,.75fr) 1fr!important;background:var(--trip-paper)!important;border:1px solid #b5cdd2!important;box-shadow:none!important;transform:none!important}

.trip-ticket-section{display:grid;grid-template-columns:34% 66%;min-height:650px;background:#f1d9cd;border-bottom:1px solid #c4a395}.trip-ticket-cover{display:flex;flex-direction:column;justify-content:space-between;padding:56px 46px;background:var(--trip-pink);color:#fff;border-right:1px solid #a25d69}.trip-ticket-cover small{color:#fff}.trip-ticket-cover b{font:500 clamp(62px,8vw,116px)/.8 Georgia,serif;letter-spacing:-.06em}.trip-ticket-cover span{font:700 8px/1 monospace;letter-spacing:.12em}.trip-ticket-list{padding:58px max(4vw,34px)}.trip-ticket-list .ticket-grid{display:grid!important;grid-template-columns:1fr!important;gap:14px!important}.scrap-pass{display:grid!important;grid-template-columns:90px 1fr 150px!important;background:var(--trip-paper)!important;border:1px solid #bc9f91!important;box-shadow:none!important;transform:none!important}.scrap-pass:nth-child(2n){transform:translateX(18px)!important}.scrap-pass-no{border-right:1px dashed #bc9f91!important}.ticket-actions{margin-top:24px}.btn,.ticket-purchase-link{border-radius:0!important}

.trip-map{display:grid;grid-template-columns:34% 66%;min-height:620px;background:var(--trip-paper);border-bottom:1px solid var(--trip-line)}.trip-map-copy{padding:72px 48px;border-right:1px dashed var(--trip-line)}.trip-map-copy h2{margin:12px 0 20px;font:500 60px/.9 Georgia,serif}.trip-map-copy p{font-size:12px;line-height:1.8;color:#6c6057}.trip-map-paper{padding:34px;background-image:linear-gradient(#c8bcae44 1px,transparent 1px),linear-gradient(90deg,#c8bcae44 1px,transparent 1px);background-size:32px 32px}.trip-map .map-static{height:100%;min-height:520px;border:0!important;border-radius:0!important;box-shadow:8px 10px 0 #d4c7b6!important}

.trip-page{padding:78px max(5vw,44px) 110px;min-height:calc(100vh - 78px);background:var(--trip-bg)}.trip-page-head{display:grid;grid-template-columns:1fr auto;gap:8px 30px;align-items:end;max-width:1220px;margin:0 auto 50px;padding-bottom:20px;border-bottom:1px solid var(--trip-line)}.trip-page-head>span{grid-column:1/-1}.trip-page-head h2{margin:0;font:500 clamp(45px,6vw,78px)/.9 Georgia,serif}.trip-page-head .section-back{font:800 8px/1 monospace;border-bottom:1px solid var(--trip-ink);padding-bottom:5px}

.trip-page:before{content:"ONLY EVENT / TRAVEL RECORD";display:block;max-width:1220px;margin:0 auto 18px;font:800 7px/1 monospace;letter-spacing:.18em;color:#9c8d80}.trip-page:after{content:"";position:fixed;right:14px;bottom:18px;width:34px;height:34px;border:1px solid #b9aa97;border-radius:50%;pointer-events:none}
.trip-page-head{position:relative}.trip-page-head:after{content:"✈";position:absolute;right:0;top:4px;font-size:20px;color:#c7b8a8}.trip-page-head h2{letter-spacing:-.045em}.trip-page-head .section-back{justify-self:end}
.trip-page>.booth-directory-rich,.trip-page>.guest-grid,.trip-page>.guide-detail-grid,.trip-page>.activity-page-block,.trip-page>.trip-activity-switch{position:relative}
.booth-directory-rich:before,.guest-grid:before,.guide-detail-grid:before,.activity-detail-list:before,.activity-project-list:before{display:block;margin-bottom:14px;font:800 7px/1 monospace;letter-spacing:.14em;color:#9a8b7f}
.booth-directory-rich:before{content:"PASSENGER / BOOTH DIRECTORY"}.guest-grid:before{content:"TRAVEL COMPANIONS / PROFILE"}.guide-detail-grid:before{content:"TRAVEL NOTES / INFORMATION"}.activity-detail-list:before{content:"TIMETABLE / DEPARTURE"}.activity-project-list:before{content:"PROGRAM / DESTINATIONS"}
.trip-page>.booth-directory-rich,.trip-page>.guest-grid,.trip-page>.guide-detail-grid,.trip-page>.activity-page-block,.trip-page>.trip-activity-switch{max-width:1220px;margin-left:auto;margin-right:auto}.trip-activity-switch{display:flex;justify-content:space-between;gap:20px;margin-bottom:28px}
.activity-view-tabs,.activity-day-tabs{display:flex;gap:8px}.activity-view-tabs button,.activity-day-tabs button{padding:9px 13px;border:1px solid var(--trip-line);background:var(--trip-paper);font:800 8px/1 monospace}.activity-view-tabs button.active,.activity-day-tabs button.active{background:var(--trip-ink);color:#fff}
.scrap-itinerary,.scrap-guide{box-shadow:none!important;transform:none!important}

.trip-community,.trip-sponsors{padding:88px max(5vw,44px);background:#2f2926;color:#fff;border-top:1px solid #5c514b}.trip-community header,.trip-sponsors header{max-width:1220px;margin:0 auto 26px}.trip-community h2,.trip-sponsors h2{margin:8px 0 0;font:500 clamp(36px,5vw,60px)/1 Georgia,serif}.trip-community .community,.trip-sponsors .sponsors{max-width:1220px;margin:auto}.community{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#5c514b}.sponsors{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:#5c514b}
.trip-footer{display:grid;grid-template-columns:220px repeat(4,1fr);gap:0;background:#171411;color:#fff;border-top:1px solid #514740}.trip-footer>div{padding:34px 26px;border-right:1px solid #514740}.trip-footer-mark{font:500 30px/.9 Georgia,serif}

/* Shared Core components, restyled as Template 02 native travel records */
.booth-directory-tools{display:grid;grid-template-columns:auto minmax(260px,1fr) auto;gap:14px;align-items:center;margin-bottom:26px;padding-bottom:18px;border-bottom:1px solid var(--trip-line)}.directory-tabs{display:flex}.directory-tabs button,.booth-directory-tools>[data-directory-saved]{padding:10px 13px;border:1px solid var(--trip-line);border-radius:0;background:var(--trip-paper);font:800 8px/1 monospace}.directory-tabs button.active,.booth-directory-tools>[data-directory-saved].active{background:var(--trip-ink);color:#fff}.booth-search{display:grid;grid-template-columns:auto 1fr auto;align-items:center;border-bottom:1px solid var(--trip-ink);padding:4px 0}.booth-search input{width:100%;border:0;background:transparent;padding:8px;font:700 11px/1.2 monospace;outline:0}.directory-search-clear{border:0;background:none;font-size:18px}
.booth-directory-grid,.product-directory-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.scrap-booth{position:relative;display:grid;grid-template-columns:92px 1fr;gap:20px;padding:22px 22px 22px 44px;background:var(--trip-paper);border:0;border-bottom:1px solid var(--trip-line)}.scrap-booth-pin{position:absolute;left:0;top:0;bottom:0;width:28px;display:grid;place-items:center;writing-mode:vertical-rl;background:#2f2926;color:#fff;font:700 7px/1 monospace;letter-spacing:.1em}.scrap-booth .booth-logo{width:92px;height:92px;object-fit:cover;background:#ddd;border:0}.scrap-booth h3{margin:8px 0 10px;font:500 28px/1 Georgia,serif}.scrap-booth p{font-size:11px;line-height:1.7;color:#6d6056}.scrap-booth footer{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.scrap-booth footer button,.scrap-product footer button{padding:8px 10px;border:1px solid var(--trip-line);border-radius:0;background:#f7f0e5;font:800 7px/1 monospace}.favorite-booth.active,.wishlist-product.active{background:var(--trip-lime)!important;color:var(--trip-ink)!important}
.scrap-product{display:grid;grid-template-columns:150px 1fr;gap:18px;padding:14px 14px 14px 26px;background:var(--trip-paper);border:0;border-bottom:1px solid var(--trip-line);position:relative}.scrap-product:before{content:"GOODS";position:absolute;left:4px;top:14px;writing-mode:vertical-rl;font:800 6px/1 monospace;letter-spacing:.14em;color:var(--trip-pink)}.directory-product-image{position:relative;width:150px;aspect-ratio:1;border:0;padding:0;background:#ddd;overflow:hidden}.directory-product-image img{width:100%;height:100%;object-fit:cover}.product-image-zoom{position:absolute;right:6px;bottom:6px;display:grid;place-items:center;width:28px;height:28px;background:#fff;border:1px solid var(--trip-ink)}.scrap-product .product-tag{display:block;font:800 7px/1 monospace;color:var(--trip-pink);font-style:normal}.scrap-product b{display:block;margin:8px 0;font:500 23px/1.1 Georgia,serif}.scrap-product small{font:700 7px/1.3 monospace;color:#7b6e63}.scrap-product footer{display:flex;justify-content:space-between;align-items:center;margin-top:18px}
.directory-pagination{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:26px}.directory-pagination button{border:1px solid var(--trip-line);background:var(--trip-paper);padding:8px 12px}.directory-filtered-out{display:none!important}.booth-no-result{padding:42px;text-align:center;border:1px dashed var(--trip-line)}

.scrap-itinerary{display:grid;grid-template-columns:54px 120px 1fr;gap:20px;padding:24px 0;border-bottom:1px solid var(--trip-line);position:relative}.scrap-itinerary:after{content:"DEPARTURE";position:absolute;right:0;top:28px;font:800 6px/1 monospace;letter-spacing:.12em;color:#a99b8f}.scrap-itinerary-no{font:500 30px/1 Georgia,serif;color:#cdbfaf}.scrap-itinerary time strong{font:500 21px/1 Georgia,serif}.scrap-itinerary time small{display:block;margin-top:5px;font:700 7px/1 monospace}.scrap-itinerary>div>small{font:800 7px/1 monospace;color:var(--trip-pink)}.scrap-itinerary>div>b{display:block;margin:7px 0;font:500 27px/1.05 Georgia,serif}.scrap-itinerary p{font-size:11px;line-height:1.7;color:#6d6056}.scrap-itinerary footer{display:flex;gap:12px;margin-top:12px;font:800 7px/1 monospace}
.scrap-activity{display:grid;grid-template-columns:280px 1fr;background:var(--trip-paper);border:0;border-bottom:1px solid var(--trip-line)}.scrap-activity-photo{min-height:240px;background:#d8d1c7}.scrap-activity-photo img{width:100%;height:100%;object-fit:cover}.scrap-activity-note{padding:26px}.scrap-activity-note>span{font:800 7px/1 monospace;color:var(--trip-pink)}.scrap-activity-note h3{margin:8px 0 10px;font:500 31px/1 Georgia,serif}.scrap-activity-note>small{font:800 7px/1 monospace}.scrap-activity-note p{font-size:11px;line-height:1.7;color:#6d6056}

.guest-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px}.scrap-guest{display:grid;grid-template-columns:220px 1fr;gap:28px;align-items:start}.scrap-polaroid{padding:10px 10px 32px;background:#fff;box-shadow:0 12px 25px #4a38271c;transform:rotate(-1.5deg)}.scrap-guest:nth-child(2n) .scrap-polaroid{transform:rotate(1.5deg)}.scrap-polaroid .guest-image{width:100%;aspect-ratio:4/5;border:0;background:#ddd}.scrap-polaroid .guest-image img{width:100%;height:100%;object-fit:cover}.scrap-polaroid>span{display:block;margin-top:10px;font:700 7px/1 monospace}.scrap-guest-note{padding-top:14px}.scrap-guest-note>small{font:800 7px/1 monospace;color:var(--trip-pink)}.scrap-guest-note>.guest-poster-name{display:block;margin:8px 0 16px;font:500 38px/1 Georgia,serif}.scrap-tape-meta{display:grid;grid-template-columns:88px 1fr;gap:12px;padding:12px 0;border-block:1px dashed var(--trip-line);font-size:10px}.guest-info-block{margin-top:14px}.guest-info-block b{display:block;margin-bottom:5px;font-size:10px}.guest-info-block p,.guest-info-block span{font-size:10px;line-height:1.65;color:#6d6056}

.guide-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.scrap-guide{display:grid;grid-template-columns:46px 1fr;gap:16px;padding:24px;background:var(--trip-paper);border:0;border-bottom:1px solid var(--trip-line);position:relative}.scrap-guide:after{content:"TRAVEL NOTE";position:absolute;right:12px;top:12px;font:800 6px/1 monospace;letter-spacing:.12em;color:#b3a498}.scrap-guide>span{font:800 7px/1 monospace;color:var(--trip-pink)}.scrap-guide small{font:800 7px/1 monospace;color:#807266}.scrap-guide h3{margin:8px 0 12px;font:500 29px/1 Georgia,serif}.scrap-guide p{font-size:11px;line-height:1.75;color:#6d6056}.scrap-guide img{grid-column:1/-1;width:100%;margin-top:10px}
.map-link-list{display:grid;gap:8px;margin-top:24px}.scrap-map-tag{display:grid;grid-template-columns:32px 1fr auto;align-items:center;gap:10px;padding:10px 0;border-bottom:1px dashed var(--trip-line)}.scrap-map-tag b{font:500 18px/1 Georgia,serif;color:#c8b8a7}.scrap-map-tag span{font:800 8px/1 monospace}.scrap-map-tag i{font-style:normal;color:var(--trip-pink)}

.scrap-social{display:grid;grid-template-columns:100px 1fr;gap:18px;padding:18px;background:#201c19}.scrap-social .social-image{width:100px;height:100px;border:0;background:#fff}.scrap-social .social-image img{width:100%;height:100%;object-fit:cover}.scrap-social>div>span{font:800 7px/1 monospace;color:var(--trip-blue)}.scrap-social b{display:block;margin:8px 0;font:500 21px/1 Georgia,serif}.scrap-social p{font-size:10px;line-height:1.6;color:#c9c0ba}.variant-sponsor{padding:20px;background:#201c19;border:0}.variant-sponsor img{max-width:100%;max-height:70px;object-fit:contain}.variant-sponsor b{display:block;margin-top:12px;font:500 17px/1 Georgia,serif}.variant-sponsor small{font:700 7px/1 monospace;color:#aaa09a}
@media(max-width:760px){.booth-directory-tools{grid-template-columns:1fr}.booth-directory-grid,.product-directory-grid,.guest-grid,.guide-detail-grid{grid-template-columns:1fr}.scrap-booth{grid-template-columns:72px 1fr}.scrap-booth .booth-logo{width:72px;height:72px}.scrap-product{grid-template-columns:110px 1fr}.directory-product-image{width:110px}.scrap-itinerary{grid-template-columns:42px 86px 1fr;gap:12px}.scrap-activity{grid-template-columns:1fr}.scrap-guest{grid-template-columns:130px 1fr;gap:16px}.scrap-guest-note>.guest-poster-name{font-size:28px}}

.gift-lightbox{border:0;padding:0;background:transparent;max-width:min(92vw,1100px);max-height:92vh}.gift-lightbox::backdrop{background:rgba(12,12,16,.82)}.gift-lightbox img{display:block;max-width:92vw;max-height:88vh;object-fit:contain}.gift-lightbox button{position:fixed;right:22px;top:18px;width:40px;height:40px;border:0;border-radius:50%;background:#fff;color:#111;font-size:22px}
.oe-page-hidden{display:none!important}.oe-page-view{min-height:calc(100vh - 78px)}
[data-oe-field]{cursor:text}[data-oe-field]:hover{outline:2px solid #7b61ff77;outline-offset:2px}[data-oe-field]:focus{outline:2px solid #7b61ff;background:#fff7b3}.oe-preview [data-oe-field],.oe-preview [data-oe-item]{outline:none!important;cursor:inherit}

.loader{position:fixed;inset:0;z-index:999;display:grid;place-items:center;padding:24px;background:var(--trip-bg);transition:opacity .5s,visibility .5s}.loader.hide{opacity:0;visibility:hidden;pointer-events:none}.scrap-entry-gate{width:min(900px,90vw);display:grid;grid-template-columns:1.25fr .75fr;background:var(--trip-paper);border:1px solid #675a50;box-shadow:18px 18px 0 #b7a491;transform:rotate(-1deg);cursor:pointer}.scrap-entry-photo{padding:18px;border-right:1px dashed #8d7f72}.entry-photo{min-height:390px;background:#d7d0c7 center/cover no-repeat}.scrap-entry-info{display:flex;flex-direction:column;gap:18px;padding:34px}.entry-ticket-label{font:800 8px/1 monospace;letter-spacing:.16em;color:var(--trip-pink)}.entry-ticket-title{font:500 42px/.9 Georgia,serif}.entry-ticket-meta{display:grid;gap:9px;padding-top:16px;border-top:1px dashed var(--trip-line)}.entry-ticket-meta>div{display:grid;grid-template-columns:80px 1fr;gap:12px}.entry-ticket-meta span{font:800 7px/1 monospace;color:#8b7d70}.entry-ticket-meta b{font:700 10px/1.3 monospace}.stub-barcode{height:44px;margin-top:auto;background:repeating-linear-gradient(90deg,#2f2926 0 2px,transparent 2px 5px,#2f2926 5px 6px,transparent 6px 9px)}.stub-code{text-align:right;font:800 8px/1 monospace}.skip{position:fixed;right:28px;bottom:24px;border:1px solid var(--trip-ink);border-radius:0;background:var(--trip-lime);padding:11px 15px;font:800 8px/1 monospace;cursor:pointer}

@media(max-width:980px){.trip-header{grid-template-columns:220px 1fr auto}.trip-flight-info{display:none}.trip-hero{grid-template-columns:1fr}.trip-hero-visual{min-height:620px}.trip-hero-copy{padding:54px 7vw}.trip-weather-strip{grid-row:3}.trip-intro{grid-template-columns:100px 1fr}.trip-collage{grid-column:2}.trip-feature{grid-template-columns:1fr}.trip-feature>header{position:static}.trip-ticket-section,.trip-map{grid-template-columns:1fr}.trip-ticket-cover{min-height:300px}}
@media(max-width:760px){.trip-header{grid-template-columns:1fr auto;min-height:60px}.trip-logo{padding:9px 14px;border-right:0}.trip-logo b{font-size:19px}.trip-nav{display:none}.trip-ticket{padding:0 14px}.trip-mobile-nav{position:sticky;top:60px;z-index:85;display:flex;overflow-x:auto;background:#2f2926;color:#fff}.trip-mobile-nav a{flex:0 0 auto;min-width:84px;padding:9px 12px;border-right:1px solid #5c514b;font:700 8px/1 Georgia,serif}.trip-mobile-nav small{display:block;margin-bottom:4px;font:700 6px/1 monospace;color:var(--trip-pink)}.trip-hero{min-height:0}.trip-hero-visual{min-height:430px;padding:24px 14px}.trip-hero-visual .kv{inset:26px 22px 55px;border-width:9px;border-bottom-width:44px;transform:rotate(-.6deg)}.trip-photo-caption{left:30px;bottom:30px}.trip-hero-copy{padding:44px 18px 50px}.trip-hero-copy h1{font-size:clamp(54px,18vw,82px)}.trip-stamp{width:70px;height:70px;right:18px;bottom:18px}.trip-weather-strip{grid-template-columns:1fr 1fr}.trip-news{grid-template-columns:1fr}.trip-news>header{border-right:0;border-bottom:1px solid var(--trip-line);padding:28px 18px}.trip-news-columns{display:none}.trip-news .updates-list{grid-column:1;padding:8px 18px 24px}.scrap-update{grid-template-columns:76px 1fr!important}.scrap-update>span{display:none}.trip-intro{grid-template-columns:1fr;gap:28px;padding:70px 18px}.trip-intro>aside b{font-size:62px}.trip-collage{grid-column:1;height:330px}.trip-cassette{left:50%;top:96px;transform:translateX(-50%) rotate(-5deg);width:240px}.trip-ticket-stub{right:0;bottom:6px;width:150px}.trip-transition{grid-template-columns:1fr;padding:54px 18px;gap:22px}.trip-transition i{font-size:44px}.trip-index{grid-template-columns:1fr}.trip-index>header{border-right:0;border-bottom:1px solid #5c514b;padding:28px 18px}.trip-index .quick-grid{display:flex!important;overflow-x:auto!important}.scrap-index-card{flex:0 0 70%;min-height:170px!important}.trip-feature{padding:70px 18px;gap:34px}.trip-feature .scrap-activity{grid-template-columns:1fr!important}.trip-ticket-cover{min-height:240px;padding:38px 22px}.trip-ticket-cover b{font-size:64px}.trip-ticket-list{padding:28px 14px 48px}.scrap-pass{grid-template-columns:58px 1fr!important}.scrap-pass aside{grid-column:1/-1;border-left:0!important;border-top:1px dashed #bc9f91!important}.scrap-pass:nth-child(2n){transform:none!important}.trip-map-copy{padding:48px 18px}.trip-map-paper{padding:18px}.trip-map .map-static{min-height:360px}.trip-page{padding:52px 16px 74px}.trip-page-head{grid-template-columns:1fr;gap:12px;margin-bottom:34px}.trip-page-head .section-back{justify-self:start}.trip-activity-switch{display:grid}.community{grid-template-columns:1fr}.sponsors{grid-template-columns:repeat(2,minmax(0,1fr))}.trip-footer{grid-template-columns:1fr}.trip-footer>div{border-right:0;border-bottom:1px solid #514740}.scrap-entry-gate{grid-template-columns:1fr;width:min(92vw,520px);max-height:82vh;overflow:auto}.scrap-entry-photo{border-right:0;border-bottom:1px dashed #8d7f72}.entry-photo{min-height:250px}.scrap-entry-info{padding:22px}.entry-ticket-title{font-size:30px}}

/* v8.40.1 — purpose-built travel editorial art direction.
   Keep Shared Core mount anchors unchanged; presentation does not own data. */
:root{--trip-bg:#eaf1ef;--trip-paper:#fffcf5;--trip-ink:#263e4b;--trip-pink:#e77a72;--trip-blue:#a7dce5;--trip-lime:#e4e9b4;--trip-line:#a5b7b4}
.trip-site{background:var(--trip-bg)}
.trip-header{background:rgba(250,252,246,.92);border-bottom:1px solid #a1b7b4}
.trip-logo{background:#dbe9e8}.trip-logo b{font-family:Arial,"Noto Sans SC",sans-serif;font-size:21px;letter-spacing:-.04em;font-weight:850}
.trip-nav a{font-family:Arial,"Noto Sans SC",sans-serif;letter-spacing:.045em;transition:background .25s,color .25s}
.trip-nav a:hover{background:#dcebec;color:#173b51}
.trip-ticket{background:#f2ddbc}
.trip-hero{grid-template-columns:minmax(0,1.35fr) minmax(360px,.65fr);background:#e5f2f2;min-height:760px}
.trip-hero-visual{overflow:hidden;background:radial-gradient(circle at 22% 14%,#fff9d5 0 8%,transparent 9%),linear-gradient(145deg,#b9dce7 0%,#d9eceb 43%,#f6ebe0 100%);min-height:700px}
.trip-hero-visual:after{content:"TRAVEL DIARY / 02";position:absolute;right:25px;top:22px;font:800 10px/1.3 monospace;letter-spacing:.18em;color:#37596a;writing-mode:vertical-rl}
.trip-hero-visual .kv{inset:5vw 9% 4.5vw 7%;border:10px solid white;border-bottom-width:44px;transform:rotate(-1deg);box-shadow:16px 22px 40px rgba(37,61,65,.19);transition:transform .8s cubic-bezier(.2,.8,.2,1)}
.trip-hero-visual:hover .kv{transform:rotate(0) scale(1.018)}
.trip-hero-copy{background:#f7f4e9;padding:6vw 4vw 5vw 4vw}
.trip-hero-copy h1{font-family:Arial,"Noto Sans SC",sans-serif;font-weight:900;font-size:clamp(62px,8vw,132px);letter-spacing:-.095em;line-height:.82;text-transform:uppercase}
.trip-hero-copy h1 em{font-style:normal;color:#d76970}
.trip-route{color:#49788a;font-size:10px;letter-spacing:.19em}
.trip-hero-copy>p{font-size:14px;line-height:2;color:#3c5862}
.trip-stamp{border-color:#4e99a5;color:#397e8d}
.trip-weather-strip{background:#294854;grid-template-columns:repeat(4,minmax(0,1fr))}
.trip-weather-strip span{min-width:0;overflow-wrap:anywhere}
.trip-weather-strip strong{font:750 clamp(11px,1.1vw,16px)/1.4 "Noto Sans SC",sans-serif}
.trip-weather-strip b{font-size:9px;color:#b4dce0}
.trip-route-ticker{background:#e4e9b4}
.trip-news{background:#fffdfa}
.trip-intro{background:#e7eee8}
.trip-intro-copy h2{font-family:Arial,"Noto Sans SC",sans-serif;font-weight:850;letter-spacing:-.055em}
.trip-transition{background:#dcebea}
.trip-transition b{font-family:Arial,"Noto Sans SC",sans-serif;font-weight:800}
.trip-index{background:#294854}.trip-index>header{border-color:#57727b}.trip-index .scrap-index-card{border-color:#57727b!important}
.trip-feature{background:#eaf3f3}
.trip-ticket-cover{background:#d16b72}
.trip-map-copy{background:#f5f4e9}
.trip-page{background:#f7f8f2}
@media(min-width:1100px){.trip-hero-copy h1{max-width:9ch}}
@media(max-width:900px){.trip-hero{grid-template-columns:1fr}.trip-hero-visual{min-height:60vh;padding:0}.trip-hero-visual .kv{inset:6% 8% 8%;border-width:8px;border-bottom-width:38px}.trip-hero-copy{padding:55px 6vw 74px}.trip-weather-strip{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.trip-hero{min-height:0}.trip-hero-visual{min-height:50vh}.trip-hero-copy h1{font-size:clamp(52px,17vw,88px)}.trip-hero-copy{padding:44px 24px 72px}.trip-weather-strip strong{font-size:12px}.trip-photo-caption{bottom:11%;left:12%}.trip-ticket-cover b{font-size:58px}}
@media(prefers-reduced-motion:reduce){.trip-route-ticker>div{animation:none}.trip-hero-visual .kv{transition:none}.trip-hero-visual:hover .kv{transform:rotate(-1deg)}}

/* v8.40.1 — safe entry usability and responsive travel composition */
.scrap-entry-gate{cursor:pointer;outline-offset:6px}
.scrap-entry-gate:focus-visible{outline:3px solid #286e86}
.trip-hero-copy h1{overflow-wrap:anywhere}
.trip-header [data-oe-field],.trip-weather-strip [data-oe-field]{overflow-wrap:anywhere}
.trip-weather-strip span{align-content:center}
.trip-site :focus-visible{outline:3px solid #3d93a5;outline-offset:3px}
@media(max-width:720px){.trip-header{grid-template-columns:minmax(0,1fr) auto}.trip-logo{min-width:0}.trip-flight-info{display:none}.trip-ticket{padding:0 16px}.trip-hero-copy{min-width:0}.trip-hero-visual{min-width:0}.trip-weather-strip{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(prefers-reduced-motion:reduce){.trip-site *, .scrap-entry *{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}

/* Template 02 / independent guest editorial and route-list composition */
.trip-page#guests{background:linear-gradient(180deg,#e9f1ef 0,#f8f4ed 38%,#f8f4ed 100%)}
.trip-page#guests .trip-page-head{border-bottom:1px solid #b5c9c5;padding-bottom:36px}
.trip-page#guests .trip-page-head h2{font-family:Arial,"Noto Sans SC",sans-serif;font-size:clamp(56px,8.6vw,128px);font-weight:900;letter-spacing:-.09em;line-height:.9}
.trip-page#guests .guest-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:0;border-top:1px solid #b5c9c5;border-left:1px solid #b5c9c5}
.trip-page#guests .scrap-guest{min-width:0;grid-template-columns:minmax(120px,.9fr) minmax(0,1fr);gap:clamp(12px,2vw,30px);padding:clamp(18px,2.5vw,40px);border-right:1px solid #b5c9c5;border-bottom:1px solid #b5c9c5;background:#f8f4ed;box-shadow:none!important;transform:none!important;transition:background .28s ease}
.trip-page#guests .scrap-guest:hover{background:#e3f1ef}
.trip-page#guests .scrap-polaroid{transform:rotate(-2deg);transition:transform .3s ease}
.trip-page#guests .scrap-guest:hover .scrap-polaroid{transform:rotate(0deg)}
.trip-page#guests .scrap-guest :is(h3,h4){font-family:Arial,"Noto Sans SC",sans-serif;font-weight:850;letter-spacing:-.04em}
.trip-page#activities{background:#f3f7f4}
.trip-page#activities .trip-page-head h2{font-family:Arial,"Noto Sans SC",sans-serif;font-weight:850;letter-spacing:-.065em}
.trip-page#activities .trip-activity-switch{padding:14px 0;border:0}
.trip-page#activities .activity-view-tabs button{border-radius:0;font-weight:800;letter-spacing:.06em}
@media(max-width:780px){.trip-page#guests .guest-grid{grid-template-columns:1fr}.trip-page#guests .scrap-guest{padding:22px 16px}.trip-page#guests .trip-page-head h2{font-size:clamp(52px,14vw,85px)}}
@media(max-width:430px){.trip-page#guests .scrap-guest{grid-template-columns:120px minmax(0,1fr);gap:14px}.trip-page#guests .scrap-polaroid{max-width:100%}}

/* Honor lifecycle and module visibility over theme-specific display rules. */
.trip-site [hidden],.scrap-entry [hidden]{display:none!important}

/* 8.40.1 / reference correction: 18TRIP-style information board */
.trip-news{display:grid!important;grid-template-columns:minmax(200px,24%) minmax(0,1fr)!important;background:#292f3d!important;color:#f8f9fc!important;border:0!important;min-height:450px}
.trip-news>header{grid-row:1/3;grid-column:1!important;background:#fff14b!important;border:0!important;padding:70px clamp(20px,3vw,66px)!important;color:#242b3a!important;align-self:stretch}
.trip-news>header>span{display:none!important}
.trip-news>header>b{font:900 clamp(52px,5vw,95px)/.9 Arial,"Noto Sans SC",sans-serif!important;letter-spacing:-.09em;margin:0!important}
.trip-news>header>small{display:block!important;margin-top:22px!important;color:#242b3a!important;letter-spacing:.14em}
.trip-news-columns{grid-column:2!important;grid-row:1;display:grid!important;grid-template-columns:clamp(140px,18%,260px) clamp(105px,13%,170px) minmax(0,1fr);padding:33px 4vw!important;background:#292f3d!important;color:#fff14b!important;font-size:11px!important;letter-spacing:.24em!important;border-bottom:1px solid #a9a440}
.trip-news .updates-list{grid-column:2!important;grid-row:2;padding:0!important;display:block!important;background:#292f3d!important;align-self:start;min-width:0}
.trip-news .scrap-update{position:relative;display:grid!important;grid-template-columns:clamp(140px,18%,260px) clamp(105px,13%,170px) minmax(0,1fr) 28px!important;gap:0!important;align-items:center!important;min-height:118px;padding:18px 3.3vw 18px 4vw!important;border:0!important;border-bottom:1px solid #a9a440!important;color:#f6f7fc!important;background:transparent!important;text-decoration:none;transform:none!important;border-radius:0!important;box-shadow:none!important}
.trip-news .scrap-update:hover{background:#363c4c!important}
.trip-news .scrap-update-date{font:500 clamp(24px,3.3vw,50px)/1 "Courier New",monospace!important;letter-spacing:-.08em;color:#fff!important}
.trip-news .scrap-update-type{display:inline-block!important;width:max-content;padding:7px 17px!important;background:#fff14b!important;color:#252c3c!important;font:850 10px/1.2 monospace!important;letter-spacing:.13em;border-radius:0!important}
.trip-news .scrap-update>b{font-size:clamp(12px,1.3vw,19px)!important;font-weight:700!important;line-height:1.65!important;color:#fff!important;min-width:0;overflow-wrap:anywhere}
.trip-news .scrap-update-arrow{display:block!important;text-align:right;font-size:21px!important;color:#fff14b!important}
.trip-news .scrap-update:focus-visible{outline:2px solid #fff14b;outline-offset:-3px}
/* Large typographic link wall; social link records remain editable in the CMS. */
.trip-community{position:relative!important;isolation:isolate;overflow:hidden;background:#fbfaf7!important;color:#292f3d!important;padding:95px 2.5vw 130px!important;min-height:630px}
.trip-social-wallpaper{position:absolute;z-index:-1;top:-22px;left:-5%;width:140%;font:900 clamp(130px,19vw,350px)/1.12 Arial,sans-serif;letter-spacing:-.09em;color:#c8ff5a;word-break:break-all;pointer-events:none;opacity:.96}
.trip-community>header{position:relative;max-width:none!important;margin:0 0 24px!important;display:flex;align-items:center;justify-content:space-between}
.trip-community>header span{color:#292f3d!important;font-size:10px!important}
.trip-community>header h2{margin:0!important;font:900 clamp(32px,4vw,58px)/1 Arial,sans-serif!important;letter-spacing:-.07em}
.trip-community>header h2 i{font-style:normal;color:#82ac32}
.trip-community .community{position:relative;z-index:2;max-width:none!important;display:flex!important;gap:0!important;overflow-x:auto;scroll-snap-type:x mandatory;padding:35px 3vw 45px!important;background:transparent!important;align-items:start}
.trip-community .scrap-social{position:relative;flex:0 0 clamp(220px,22vw,340px);scroll-snap-align:center;display:flex!important;flex-direction:column!important;gap:12px!important;min-width:0;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;margin-right:-8px;transform:rotate(-5deg);transition:transform .25s ease;min-height:0!important}
.trip-community .scrap-social:nth-child(3n+2){transform:rotate(5deg) translateY(20px)}.trip-community .scrap-social:nth-child(3n){transform:rotate(-2deg) translateY(-12px)}
.trip-community .scrap-social:hover{transform:translateY(-10px) rotate(0deg)!important;z-index:4}
.trip-community .scrap-social-face{position:relative;min-height:245px;aspect-ratio:1.25;background:#ee696b;border:2px solid #292f3d;border-radius:9px;overflow:hidden;display:grid;place-items:center}
.trip-community .scrap-social:nth-child(4n+2) .scrap-social-face{background:#8d61bc}
.trip-community .scrap-social:nth-child(4n+3) .scrap-social-face{background:#6d8fea}
.trip-community .scrap-social:nth-child(4n+4) .scrap-social-face{background:#f0bb62}
.trip-community .scrap-social-face .social-image{display:grid;place-items:center;width:100%!important;height:100%!important;max-height:100%!important;background:transparent!important;border:0!important;box-shadow:none!important;transform:none!important;padding:0!important}
.trip-community .scrap-social-face img{width:100%;height:100%;object-fit:contain;padding:18px}
.trip-community .scrap-social-stamp{position:absolute;right:13px;top:10px;color:white;font-size:27px}
.trip-community .scrap-social-caption{padding:7px 6px;display:grid;gap:6px}
.trip-community .scrap-social-caption>b{font-size:20px!important;letter-spacing:-.04em;color:#292f3d}
.trip-community .scrap-social-caption p{margin:0;font-size:12px;color:#4f5561}
.trip-community .scrap-social-caption .social-action{justify-self:start;margin-top:4px;color:#292f3d;font-weight:800;text-decoration:underline}
.trip-route-ticker{background:#c9fb62!important;color:#233c36!important}
.trip-route-ticker span{font:900 clamp(17px,2.2vw,35px)/1 Arial,sans-serif!important;letter-spacing:-.05em!important;padding:13px 27px!important;border:0!important}
@media(max-width:760px){.trip-news{grid-template-columns:1fr!important}.trip-news>header{grid-column:1!important;grid-row:1;padding:32px 22px!important}.trip-news>header>b{font-size:58px!important}.trip-news-columns{grid-column:1!important;grid-row:2;grid-template-columns:84px 88px minmax(0,1fr);padding:14px 16px!important}.trip-news .updates-list{grid-column:1!important;grid-row:3}.trip-news .scrap-update{grid-template-columns:84px 88px minmax(0,1fr) 20px!important;min-height:96px;padding:12px 12px 12px 16px!important}.trip-news .scrap-update-date{font-size:24px!important}.trip-news .scrap-update-type{padding:5px 6px!important;font-size:9px!important}.trip-news .scrap-update>b{font-size:12px!important}.trip-news .scrap-update-arrow{font-size:15px!important}.trip-community{padding:55px 12px 70px!important;min-height:480px}.trip-social-wallpaper{font-size:160px}.trip-community .scrap-social{flex-basis:230px}.trip-community .scrap-social-face{min-height:190px}}
@media(prefers-reduced-motion:reduce){.trip-community .scrap-social{transition:none!important}}

/* Reference-first hero composition: edge-to-edge KV, overlapping navigation,
   logo and event information. No polaroid, scrapbook or split-hero frame. */
@media(min-width:901px){
.trip-site{position:relative}
.trip-header{position:absolute!important;top:0;left:0;right:0;z-index:90;display:grid!important;grid-template-columns:minmax(190px,18vw) 1fr auto!important;height:auto;min-height:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;border:0!important;pointer-events:none}
.trip-header>*{pointer-events:auto}
.trip-logo{grid-column:1;grid-row:1;padding:32px 26px 12px;background:transparent!important;border:0!important;align-content:start;color:#fff;text-shadow:0 1px 12px #1029389e}
.trip-logo small{color:#fff!important;font-size:10px;letter-spacing:.09em}
.trip-logo b{font-size:clamp(30px,3.4vw,58px)!important;line-height:.87;font-weight:950!important;letter-spacing:-.075em}
.trip-flight-info{grid-column:2;grid-row:1;display:flex;justify-content:center;align-items:start;padding:30px 12px;color:#fff!important;text-shadow:0 1px 10px #102938a8;font-size:10px!important}
.trip-flight-info i{background:#d7fe6b!important}
.trip-nav{grid-column:1;grid-row:2;display:flex!important;flex-direction:column;align-items:stretch;margin:42px 0 0;padding:0 0 0 26px;max-width:250px}
.trip-nav a{display:block!important;min-width:0!important;padding:13px 10px 13px 0!important;background:transparent!important;border:0!important;text-align:left!important;color:#fff!important;text-shadow:0 2px 9px #102938c9;font:800 clamp(15px,1.45vw,23px)/1.05 "Courier New",monospace!important;letter-spacing:-.055em!important;transition:transform .22s ease!important}
.trip-nav a:hover{background:transparent!important;transform:translateX(10px);color:#dbff79!important}
.trip-nav small{display:none!important}
.trip-ticket{grid-column:3;grid-row:1;align-self:start;margin:30px 34px 0 0;padding:11px 14px!important;border:1px solid #fff!important;background:rgba(17,45,58,.32)!important;color:#fff;font-size:11px!important;backdrop-filter:blur(8px)}
.trip-hero{position:relative!important;display:block!important;min-height:100svh!important;overflow:hidden;border:0!important;background:#b5d9de!important}
.trip-hero-visual{position:absolute!important;inset:0!important;min-height:0!important;padding:0!important;overflow:hidden;background:linear-gradient(135deg,#b7dbe7,#d8f3e3)!important}
.trip-hero-visual:before,.trip-hero-visual:after{display:none!important}
.trip-hero-visual .kv{position:absolute!important;inset:0!important;width:100%;height:100%;border:0!important;border-radius:0!important;box-shadow:none!important;transform:none!important;background-position:var(--oe-hero-focal-desktop,center)!important;background-size:cover!important;transition:transform .8s ease!important}
.trip-hero-visual:hover .kv{transform:scale(1.012)!important}
.trip-photo-caption{position:absolute;left:auto!important;right:28px;bottom:29px;z-index:2;color:#fff;text-shadow:0 2px 12px #173a54b8}
.trip-hero-copy{position:absolute!important;z-index:3;left:clamp(290px,26vw,500px);bottom:70px;width:min(670px,55vw);max-width:calc(100% - 320px);padding:0!important;background:transparent!important;color:white!important;justify-content:end;pointer-events:none;text-shadow:0 2px 19px #173a54bb}
.trip-hero-copy .event-status-badge{pointer-events:auto;text-shadow:none}
.trip-route{color:#edffba!important;font-size:11px!important;margin-bottom:13px!important}
.trip-hero-copy h1{font-family:Arial,"Noto Sans SC",sans-serif!important;font-size:clamp(44px,6.6vw,110px)!important;line-height:.85!important;color:#fff!important;letter-spacing:-.075em!important}
.trip-hero-copy h1 em{color:#d2ff73!important}
.trip-hero-copy>p{max-width:440px!important;color:#fff!important;font-size:clamp(12px,1vw,16px)!important;line-height:1.6!important;margin:19px 0!important}
.trip-hero-meta{display:flex!important;flex-wrap:wrap;gap:10px 20px;border-top:1px solid #ffffff90!important;color:#fff!important;font-size:12px!important;line-height:1.4!important}
.trip-hero-meta a{pointer-events:auto;color:white!important}
.trip-weather-strip{position:absolute!important;left:0;right:0;bottom:0;z-index:5;grid-column:auto!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;background:rgba(19,49,62,.78)!important;backdrop-filter:blur(10px);border-top:1px solid #ffffff5e}
.trip-weather-strip span{padding:10px 25px!important}
.trip-weather-strip strong{font-size:clamp(11px,1vw,15px)!important;color:white!important}
}
@media(max-width:900px){
.trip-header{position:absolute!important;inset:0 0 auto;z-index:90;display:flex!important;align-items:start;justify-content:space-between;background:transparent!important;border:0!important;backdrop-filter:none!important;pointer-events:none}
.trip-header>*{pointer-events:auto}
.trip-logo{background:transparent!important;color:white!important;border:0!important;padding:18px!important;text-shadow:0 2px 8px #173a54a8}
.trip-logo small{color:#fff!important}
.trip-logo b{font-size:clamp(23px,5vw,40px)!important}
.trip-ticket{margin:18px 18px 0 0;border:1px solid white!important;background:#183a50bb!important;color:white!important;padding:12px!important}
.trip-header .trip-nav,.trip-flight-info{display:none!important}
.trip-hero{position:relative;display:block!important;min-height:100svh!important;background:#aecfd5!important;overflow:hidden}
.trip-hero-visual{position:absolute!important;inset:0!important;min-height:0!important}
.trip-hero-visual .kv{inset:0!important;width:100%;height:100%;border:0!important;border-radius:0!important;transform:none!important;box-shadow:none!important;background-position:var(--oe-hero-focal-mobile,center)!important;background-size:cover!important}
.trip-photo-caption{display:none}
.trip-hero-copy{position:absolute!important;z-index:4;left:0;right:0;bottom:110px;padding:18px 20px!important;background:linear-gradient(0deg,#122d3dbb,transparent)!important;color:white!important;min-height:220px;justify-content:flex-end!important;text-shadow:0 2px 12px #182a3b91}
.trip-hero-copy h1{color:white!important;font-size:clamp(44px,12vw,88px)!important;line-height:.9!important}
.trip-hero-copy h1 em{color:#d2ff73!important}
.trip-hero-copy>p{color:white!important;margin:12px 0!important}
.trip-route{color:#deffac!important;margin-bottom:9px!important}
.trip-hero-meta{display:flex!important;flex-wrap:wrap;gap:8px 14px;border-color:#ffffffa8!important}
.trip-hero-meta a{color:white!important}
.trip-weather-strip{position:absolute!important;z-index:5;bottom:0;left:0;right:0;background:#254956e8!important;grid-template-columns:repeat(2,minmax(0,1fr))!important}
.trip-weather-strip span{padding:8px 14px!important}
}

/* Default event-poster adaptation: retain the reference navigation and typography,
   but display a common 3:4 organizer artwork without cropping. Widescreen is opt-in. */
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero{background:#cfdfdd!important}
@media(min-width:901px){
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-visual{background:linear-gradient(120deg,#d6e6e0 0%,#bad9dd 48%,#dae8e2 100%)!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-visual .kv{inset:5.5% 40% 10% 25%!important;width:auto;height:auto;max-height:85%;border:0!important;box-shadow:15px 22px 50px #20373e38!important;background-size:contain!important;background-repeat:no-repeat!important;background-color:#eff4ee;transform:none!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-visual:hover .kv{transform:none!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-copy{left:62%!important;right:3%!important;bottom:18%!important;width:35%!important;max-width:35%!important;text-shadow:none!important;color:#264552!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-copy h1{font-size:clamp(44px,4.4vw,78px)!important;color:#254753!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-copy>p,body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-meta,body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-meta a{color:#294653!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-copy .trip-route{color:#247181!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-logo,body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-nav a,body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-flight-info{color:#294653!important;text-shadow:none!important}
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero{min-height:900px!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-visual{background:#d7e7e4!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-visual .kv{inset:85px 12% 255px!important;width:auto;height:auto;max-height:620px;background-size:contain!important;background-repeat:no-repeat!important;background-color:#f4f4ef;box-shadow:0 10px 30px #17384428!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-copy{bottom:100px!important;min-height:0!important;padding:23px!important;background:#d7e7e4!important;color:#284a54!important;text-shadow:none!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-copy h1{font-size:clamp(35px,9vw,65px)!important;color:#284a54!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-copy>p,body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-meta,body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-meta a{color:#284a54!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-logo{color:#284a54!important;text-shadow:none!important}
}

/* Template 02 homepage final composition pass — 18TRIP reference structure,
   with organizer poster support. No reused scrapbook/polaroid styling. */
.trip-site .trip-intro{position:relative;display:grid;grid-template-columns:minmax(130px,18%) minmax(0,1fr);gap:clamp(20px,4vw,70px);align-items:start;background:#f7f8f2!important;padding:clamp(80px,10vw,170px) max(6vw,24px)!important;overflow:hidden;min-height:460px}
.trip-intro>aside{display:flex;flex-direction:column;gap:16px;align-items:start}
.trip-intro>aside span{color:#353c4a;font:850 11px/1.5 "Courier New",monospace;letter-spacing:.22em}
.trip-intro>aside b{font:900 clamp(45px,7vw,120px)/1 Arial,sans-serif;color:#d7ff60;margin:0}
.trip-intro-copy{max-width:850px}
.trip-intro-copy h2{font:900 clamp(42px,7vw,110px)/.95 Arial,"Noto Sans SC",sans-serif!important;letter-spacing:-.085em!important;text-transform:uppercase;color:#303845}
.trip-intro-copy p{margin:28px 0 0;font-size:clamp(14px,1.45vw,20px);line-height:1.8;max-width:520px;color:#444e59}
.trip-intro .trip-collage{display:none!important}
.trip-transition{display:grid;grid-template-columns:22% 1fr auto!important;background:#cafd60!important;border:0!important;padding:clamp(36px,5vw,78px) max(6vw,24px)!important;color:#303845!important;min-height:220px}
.trip-transition>span{font:850 11px/1.5 monospace!important;letter-spacing:.12em!important;color:#303845!important}
.trip-transition>b{font:900 clamp(32px,4.8vw,76px)/.96 Arial,sans-serif!important;letter-spacing:-.075em!important}
.trip-transition>i{color:#303845!important}
.trip-index{background:#2d3543!important;grid-template-columns:minmax(190px,22%) 1fr!important}
.trip-index>header{border-color:#606777!important;padding:50px clamp(18px,3vw,48px)!important}
.trip-index>header span{color:#d9ff61!important}
.trip-index>header b{font:900 clamp(26px,3vw,48px)/.95 Arial,"Noto Sans SC",sans-serif!important;letter-spacing:-.055em}
.trip-index .quick-grid{grid-template-columns:repeat(5,minmax(0,1fr))!important}
.trip-index .scrap-index-card{border-color:#636e7c!important;transition:background .2s,transform .2s!important}
.trip-index .scrap-index-card:hover{background:#3d4658!important;transform:none!important}
.trip-index .scrap-index-card small{color:#c9fa60!important}
.trip-index .scrap-index-card b{font:800 clamp(17px,1.8vw,28px)/1.15 Arial,"Noto Sans SC",sans-serif!important}
.trip-feature{position:relative;background:#e5f1f1!important;grid-template-columns:minmax(190px,25%) minmax(0,1fr)!important;gap:clamp(30px,5vw,100px);padding:clamp(85px,10vw,155px) max(6vw,24px)!important}
.trip-feature>header{top:40px}
.trip-feature>header h2{font:900 clamp(38px,5.4vw,86px)/.92 Arial,"Noto Sans SC",sans-serif!important;letter-spacing:-.075em}
.trip-feature>header>span{color:#34636e!important;font-size:11px!important}
.trip-feature .featured-activity-grid{min-width:0}
.trip-feature .scrap-activity{border:0!important;box-shadow:0 18px 34px #2748511c!important;transform:none!important}
.trip-ticket-section{background:#f9f7f0!important}
.trip-ticket-cover{background:#ef687d!important}
.trip-ticket-cover b{font:900 clamp(55px,6.4vw,110px)/.85 Arial,sans-serif!important;letter-spacing:-.075em!important}
.trip-ticket-list{background:#f9f7f0}
.trip-map{background:#d8eaf0!important}
.trip-map-copy{background:#d8eaf0!important;border:0!important}
.trip-map-copy h2{font:900 clamp(43px,5vw,84px)/.95 Arial,sans-serif!important;letter-spacing:-.075em}
.trip-map-paper{background:#eaf1f2}
.trip-news .scrap-update b{white-space:normal}
.trip-community{border-top:0!important}
@media(max-width:900px){
.trip-site .trip-intro{grid-template-columns:1fr;gap:20px;min-height:0}
.trip-intro>aside{flex-direction:row;justify-content:space-between;align-items:center}
.trip-intro>aside b{font-size:58px}
.trip-intro-copy h2{font-size:clamp(42px,11vw,90px)!important}
.trip-transition{grid-template-columns:1fr!important;gap:22px!important}
.trip-transition>b{font-size:clamp(33px,8vw,65px)!important}
.trip-index{grid-template-columns:1fr!important}
.trip-index>header{border-right:0!important;border-bottom:1px solid #606777}
.trip-index .quick-grid{display:flex!important;overflow-x:auto!important}
.trip-index .scrap-index-card{flex:0 0 65%;min-width:210px}
.trip-feature{grid-template-columns:1fr!important;gap:25px!important}
.trip-feature>header{position:static!important}
.trip-ticket-section,.trip-map{grid-template-columns:1fr!important}
.trip-map-copy{padding:46px 22px!important}
.trip-map-paper{padding:20px!important}
}
@media(max-width:520px){
.trip-intro-copy h2{font-size:41px!important}
.trip-transition>b{font-size:38px!important}
.trip-feature>header h2{font-size:47px!important}
.trip-feature .scrap-activity{grid-template-columns:1fr!important}
.trip-index .scrap-index-card{flex-basis:79%}
}

/* Poster-mode layout audit: exact 3:4 artwork, readable empty state,
   and nonoverlapping vertical mobile arrangement. */
.trip-hero-visual .kv .trip-kv-placeholder{display:none}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-visual .kv.empty .trip-kv-placeholder{display:flex;position:absolute;inset:0;justify-content:center;align-items:center;flex-direction:column;text-align:center;font:900 clamp(26px,3.8vw,65px)/.92 Arial,sans-serif;letter-spacing:-.07em;color:#395963;background:repeating-linear-gradient(135deg,#e8f0eb,#e8f0eb 20px,#dce9e6 20px,#dce9e6 40px)}
.trip-hero-visual .kv .trip-kv-placeholder small{margin-top:15px;font:700 11px/1.4 "Courier New",monospace;letter-spacing:.16em}
@media(min-width:901px){
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-visual .kv{inset:auto!important;left:25%!important;top:50%!important;width:min(34vw,calc(75vh * .75))!important;height:auto!important;max-height:75vh!important;aspect-ratio:3/4!important;transform:translateY(-50%)!important;background-position:center!important;box-shadow:15px 22px 50px #20373e38!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-visual:hover .kv{transform:translateY(-50%)!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-copy{left:min(69%,calc(25% + min(34vw,56.25vh) + 4%))!important;right:3%!important;width:auto!important;max-width:none!important}
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero{min-height:0!important;padding-top:85px!important;display:flex!important;flex-direction:column!important;background:#d7e7e4!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-visual{position:relative!important;inset:auto!important;display:flex!important;justify-content:center;align-items:center;min-height:0!important;height:auto!important;padding:12px 16px 22px!important;background:#d7e7e4!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-visual .kv{position:relative!important;inset:auto!important;width:min(80vw,380px)!important;height:auto!important;aspect-ratio:3/4!important;max-height:none!important;transform:none!important;background-size:contain!important;box-shadow:0 10px 30px #17384428!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-copy{position:relative!important;inset:auto!important;display:flex!important;min-height:0!important;width:100%!important;max-width:none!important;padding:24px 7vw 30px!important;background:#d7e7e4!important;text-shadow:none!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-weather-strip{position:relative!important;inset:auto!important;width:100%!important}
body[data-oe-template="02-scrapbook"]:not([data-oe-hero-mode="wide"]) .trip-hero-copy h1{font-size:clamp(38px,9vw,70px)!important}
}

/* Template 02 visual QA — layout typography and editable ticker. */
.trip-route-ticker.ribbon{display:block!important;overflow:hidden;background:#c9fb62!important;color:#26333c!important;min-height:65px;padding:0!important;border:0!important}
.trip-route-ticker .ribbon-track{display:flex!important;align-items:center;min-width:max-content;width:max-content;gap:0;animation:tripTicker 26s linear infinite}
.trip-route-ticker .ribbon-sequence{display:flex!important;align-items:center;gap:0;flex-shrink:0}
.trip-route-ticker .ribbon-edit{display:inline-block!important;font:900 clamp(17px,2.2vw,34px)/1 Arial,sans-serif!important;letter-spacing:-.06em!important;padding:17px 38px!important;min-width:0;background:none!important;color:#25333c!important;white-space:nowrap}
.trip-route-ticker .ribbon-edit::after{content:" ↗";font-weight:900;padding-left:25px}
.trip-route-ticker .ribbon-sequence[aria-hidden="true"]{pointer-events:none}
.trip-route-ticker .ribbon-sequence[aria-hidden="true"] [data-oe-field]{user-select:none;pointer-events:none}
.trip-route-ticker:hover .ribbon-track,.trip-route-ticker:focus-within .ribbon-track{animation-play-state:paused}
.trip-route-ticker [contenteditable="true"]{outline-offset:2px}
.trip-site .trip-page{background:#f8f8f1!important;padding:clamp(70px,7vw,120px) clamp(24px,5vw,88px) 130px!important;min-height:calc(100vh - 78px);max-width:none!important}
.trip-site .trip-page-head{display:grid!important;grid-template-columns:minmax(150px,21%) 1fr auto!important;align-items:end!important;gap:25px!important;max-width:none!important;margin:0 0 clamp(40px,5vw,90px)!important;padding:0 0 34px!important;border-bottom:2px solid #293342!important}
.trip-site .trip-page-head>span{grid-column:1!important;font:800 clamp(10px,.8vw,13px)/1.4 "Courier New",monospace!important;letter-spacing:.15em!important;color:#e46b73!important}
.trip-site .trip-page-head h2{grid-column:2!important;font:900 clamp(45px,6vw,110px)/.88 Arial,"Noto Sans SC",sans-serif!important;letter-spacing:-.075em!important;color:#293342!important;text-transform:uppercase;overflow-wrap:anywhere}
.trip-site .trip-page-head .section-back{grid-column:3!important;align-self:end;font-size:12px!important;color:#293342!important}
.trip-page-head:after{display:none!important}
#guests .trip-guest-carousel{width:100%;overflow:hidden}
#guests .guest-grid{display:flex!important;flex-wrap:nowrap!important;gap:clamp(15px,2.7vw,42px)!important;align-items:stretch;overflow-x:auto!important;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-padding-inline:2px;overscroll-behavior-inline:contain;scrollbar-width:thin;padding:8px 6px 42px!important}
#guests .scrap-guest{display:flex!important;flex:0 0 min(70vw,560px)!important;min-width:0!important;scroll-snap-align:start;align-items:stretch!important;gap:0!important;background:#eaf0ed!important;border:1px solid #8da6a9!important}
#guests .scrap-polaroid{width:47%;flex-shrink:0;transform:none!important;box-shadow:none!important;background:#d7e5e3!important;padding:12px!important}
#guests .scrap-polaroid .guest-image{width:100%;aspect-ratio:3/4!important;overflow:hidden}
#guests .scrap-polaroid>span{letter-spacing:.17em!important}
#guests .scrap-guest-note{flex:1;padding:clamp(18px,2vw,34px)!important;min-width:0}
#guests .scrap-guest-note>.guest-poster-name{font-family:Arial,"Noto Sans SC",sans-serif!important;font-size:clamp(26px,2.8vw,50px)!important;font-weight:900!important;letter-spacing:-.06em!important;overflow-wrap:anywhere}
#guests .scrap-tape-meta{border-block:1px solid #b9c9c7!important}
#guests .guest-grid:focus-visible{outline:2px solid #263847;outline-offset:3px}
@media(max-width:760px){
.trip-site .trip-page{padding:72px 16px 85px!important}
.trip-site .trip-page-head{grid-template-columns:1fr auto!important;gap:14px!important;padding-bottom:22px!important}
.trip-site .trip-page-head>span{grid-column:1/-1!important}
.trip-site .trip-page-head h2{grid-column:1!important;font-size:clamp(35px,10vw,64px)!important}
.trip-site .trip-page-head .section-back{grid-column:2!important;font-size:10px!important}
#guests .scrap-guest{flex:0 0 min(88vw,370px)!important;flex-direction:column!important}
#guests .scrap-polaroid{width:100%!important}
#guests .scrap-polaroid .guest-image{aspect-ratio:4/3!important}
#guests .scrap-guest-note{padding:21px!important}
.trip-route-ticker .ribbon-edit{padding:13px 22px!important;font-size:20px!important}
}
@media(prefers-reduced-motion:reduce){.trip-route-ticker .ribbon-track{animation:none!important}}

/* Chinese typography and collision regression fixes — desktop/mobile. */
.trip-site{font-family:Arial,"Microsoft YaHei","PingFang SC","Noto Sans CJK SC",sans-serif!important}
.trip-site [data-oe-field],.trip-site [data-oe-item]{overflow-wrap:anywhere;word-break:normal;min-width:0}
.trip-site h1,.trip-site h2,.trip-site h3{line-height:1.12!important;overflow-wrap:anywhere;word-break:normal}
.trip-route-ticker .ribbon-track{position:relative;z-index:1;min-height:72px}
.trip-route-ticker .ribbon-sequence{gap:0}
.trip-route-ticker .ribbon-edit{line-height:1.2!important;white-space:nowrap;letter-spacing:.005em!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-header{position:relative!important;inset:auto!important;background:#27323e!important;min-height:88px!important;display:flex!important;flex-wrap:wrap;align-items:center;gap:22px;justify-content:space-between;pointer-events:auto}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-logo{padding:12px 22px!important;color:#fff!important;text-shadow:none!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-logo b{font-size:clamp(20px,2.1vw,33px)!important;letter-spacing:-.035em!important;line-height:1.12!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-logo small{font-size:9px!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-flight-info{display:none!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-nav{position:static!important;display:flex!important;flex-direction:row!important;align-items:center!important;flex-wrap:wrap;margin:0!important;padding:0!important;max-width:none!important;gap:8px}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-nav a{color:#fff!important;text-shadow:none!important;font:700 13px/1.5 Arial,"Microsoft YaHei",sans-serif!important;padding:8px 12px!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-ticket{position:static!important;margin:0 22px 0 0!important;align-self:center!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-mobile-nav{position:relative!important;top:auto!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-page{min-height:calc(100vh - 88px)!important}
.trip-page-head{grid-template-columns:minmax(130px,19%) minmax(0,1fr) auto!important;gap:clamp(14px,3vw,45px)!important}
.trip-page-head h2{font-size:clamp(36px,5vw,82px)!important;line-height:1.07!important;letter-spacing:-.055em!important;min-width:0}
#guide .guide-detail-grid{grid-template-columns:minmax(0,1fr)!important;gap:28px!important;width:100%!important;max-width:none!important}
#guide .scrap-guide{display:grid!important;grid-template-columns:minmax(62px,12%) minmax(0,1fr)!important;column-gap:clamp(20px,3vw,50px)!important;row-gap:25px!important;padding:clamp(24px,4vw,62px)!important;background:#f9f9f5!important;min-width:0!important;border:1px solid #d0d2cb!important}
#guide .scrap-guide>span{font:800 12px/1.5 monospace!important;letter-spacing:.12em!important}
#guide .scrap-guide>div{min-width:0!important;width:100%!important}
#guide .scrap-guide h3{font:600 clamp(28px,3.1vw,48px)/1.3 "Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important}
#guide .scrap-guide p{font:400 clamp(13px,1.1vw,17px)/1.95 "Microsoft YaHei","PingFang SC",sans-serif!important;color:#48515a;white-space:normal!important;overflow-wrap:anywhere}
#guide .scrap-guide img,#guide .scrap-guide .guide-access-media,#guide .scrap-guide .guide-image,#guide .scrap-guide [data-oe-image]{grid-column:2!important;width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:200px;aspect-ratio:16/9!important;object-fit:contain!important}
#activities .activity-detail-list{display:block!important;width:100%!important;min-width:0}
#activities .scrap-itinerary{display:grid!important;grid-template-columns:clamp(45px,8%,105px) clamp(105px,18%,230px) minmax(0,1fr)!important;gap:clamp(12px,2vw,38px)!important;align-items:start!important;min-width:0!important;border-bottom:1px solid #9098a3!important;padding:clamp(22px,3vw,44px) 0!important;background:transparent!important}
#activities .scrap-itinerary-no{font:900 clamp(28px,4vw,66px)/1 Arial,sans-serif!important;color:#d3ff69!important}
#activities .scrap-itinerary time{font:700 clamp(20px,2.2vw,34px)/1.3 monospace!important;min-width:0;overflow-wrap:anywhere}
#activities .scrap-itinerary>div{min-width:0}
#activities .scrap-itinerary>div>b{font:800 clamp(20px,2.3vw,36px)/1.35 "Microsoft YaHei",sans-serif!important;letter-spacing:0!important}
#activities .scrap-itinerary p{font:400 clamp(13px,1vw,16px)/1.85 "Microsoft YaHei",sans-serif!important;max-width:85ch!important}
@media(max-width:900px){
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-header{min-height:70px!important;padding:8px!important;gap:8px}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-logo{padding:6px 12px!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-nav{display:none!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-ticket{margin:0 8px 0 0!important}
.trip-site .trip-page-head{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important}
.trip-site .trip-page-head h2{font-size:clamp(31px,8vw,59px)!important;letter-spacing:-.04em!important}
#guide .scrap-guide{grid-template-columns:1fr!important;padding:23px 17px!important;gap:12px!important}
#guide .scrap-guide>span{grid-column:1}
#guide .scrap-guide>div{grid-column:1}
#guide .scrap-guide img,#guide .scrap-guide .guide-access-media,#guide .scrap-guide .guide-image,#guide .scrap-guide [data-oe-image]{grid-column:1!important;min-height:150px}
#activities .scrap-itinerary{grid-template-columns:62px minmax(0,1fr)!important}
#activities .scrap-itinerary>div{grid-column:1/-1}
}

/* Navigation visibility always wins against theme display declarations. */
.trip-site .oe-page-hidden,.trip-site [hidden]{display:none!important}

/* 8.40.1: content comfort & 18TRIP MUSIC-style activity posters */
#booths .booth-directory-grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,410px),1fr))!important;gap:22px!important}
#booths .scrap-booth{grid-template-columns:76px minmax(0,1fr)!important;gap:18px!important;padding:24px 24px 25px 48px!important;min-height:250px!important;background:#fbfaf6!important}
#booths .scrap-booth-pin{width:31px!important;font-size:11px!important;letter-spacing:.08em!important}
#booths .scrap-booth .booth-logo{width:76px!important;height:76px!important;flex-shrink:0!important}
#booths .scrap-booth>div:last-child{min-width:0!important}
#booths .scrap-booth h3{margin:9px 0 12px!important;font:650 clamp(22px,2vw,33px)/1.35 "Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important;overflow-wrap:anywhere!important}
#booths .scrap-booth small{font:400 13px/1.55 "Microsoft YaHei","PingFang SC",sans-serif!important;overflow-wrap:anywhere}
#booths .scrap-booth p{font:400 13px/1.7 "Microsoft YaHei","PingFang SC",sans-serif!important;margin:0!important;overflow-wrap:anywhere}
#booths .scrap-booth footer{margin-top:20px!important;gap:10px!important}
#booths .scrap-booth footer button{font:700 12px/1.35 "Microsoft YaHei",sans-serif!important;padding:8px 12px!important;white-space:normal!important}
.trip-site .trip-guest-carousel,.trip-site #guests .guest-grid,.trip-site .trip-index .quick-grid,.trip-site .trip-community .community{scrollbar-width:none!important;-ms-overflow-style:none!important}
.trip-site .trip-guest-carousel::-webkit-scrollbar,.trip-site #guests .guest-grid::-webkit-scrollbar,.trip-site .trip-index .quick-grid::-webkit-scrollbar,.trip-site .trip-community .community::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
#guests .guest-grid{padding-bottom:20px!important}
.trip-feature .featured-activity-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0!important;background:#fff!important;border:1px solid #b6bcc2!important}
.trip-feature .scrap-activity{display:flex!important;flex-direction:column!important;align-items:stretch!important;min-width:0!important;border:0!important;border-right:1px solid #b6bcc2!important;border-bottom:1px solid #b6bcc2!important;box-shadow:none!important;background:#fff!important;padding:clamp(20px,3vw,44px)!important;gap:0!important}
.trip-feature .scrap-activity-photo{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:1!important;background:#f6f6f1!important;overflow:hidden!important;border:1px solid #d0d4d1!important}
.trip-feature .scrap-activity-photo img{display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:center!important}
.trip-feature .scrap-activity-photo [data-oe-image],.trip-feature .scrap-activity-photo .activity-feature-media,.trip-feature .scrap-activity-photo button{width:100%!important;height:100%!important;min-width:0!important;max-width:100%!important;min-height:0!important;max-height:100%!important;overflow:hidden!important;border-radius:0!important;display:flex;align-items:center;justify-content:center}
.trip-feature .scrap-activity-photo .activity-feature-media img{width:100%!important;height:100%!important;object-fit:cover!important}
.trip-feature .scrap-activity-note{padding:22px 0 0!important;display:flex;flex-direction:column;align-items:flex-start;gap:9px}
.trip-feature .scrap-activity-note>span{font:800 12px/1.45 monospace!important;letter-spacing:.12em!important;color:#303948!important}
.trip-feature .scrap-activity-note h3{font:600 clamp(24px,2.5vw,41px)/1.25 "Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important;margin:8px 0!important;overflow-wrap:anywhere}
.trip-feature .scrap-activity-note small{font:700 12px/1.5 "Microsoft YaHei",sans-serif!important}
.trip-feature .scrap-activity-note p{font:400 14px/1.8 "Microsoft YaHei",sans-serif!important;color:#414950!important}
@media(max-width:950px){.trip-feature .featured-activity-grid{grid-template-columns:1fr!important}.trip-feature .scrap-activity{padding:22px!important}}
@media(max-width:600px){#booths .booth-directory-grid{grid-template-columns:1fr!important}#booths .scrap-booth{grid-template-columns:70px minmax(0,1fr)!important;padding:18px 14px 20px 42px!important;gap:12px!important}#booths .scrap-booth .booth-logo{width:70px!important;height:70px!important}#booths .scrap-booth h3{font-size:24px!important}}

/* Real CMS mounts: 18TRIP MUSIC-inspired two-column artwork sheets */
.trip-feature .featured-activity-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0!important;align-items:stretch!important;max-width:none!important}
.trip-feature .featured-activity-card{display:flex!important;flex-direction:column!important;min-width:0!important;width:100%!important;padding:clamp(16px,2.5vw,38px)!important;border:1px solid #bec6c8!important;border-radius:0!important;box-shadow:none!important;transform:none!important;background:#fff!important;gap:22px!important}
.trip-feature .featured-activity-card:nth-child(even){border-left:0!important}
.trip-feature .featured-activity-media{display:block!important;position:relative!important;width:100%!important;aspect-ratio:1!important;min-height:0!important;height:auto!important;overflow:hidden!important;border-radius:0!important;background:#d2ff68!important}
.trip-feature .featured-activity-media img{display:block!important;width:100%!important;height:100%!important;position:absolute!important;inset:0!important;object-fit:cover!important;object-position:center!important;border-radius:0!important}
.trip-feature .featured-activity-copy{display:flex!important;flex-direction:column!important;gap:10px!important;padding:0!important;min-width:0!important}
.trip-feature .featured-activity-copy h3{margin:0!important;font:700 clamp(21px,2.4vw,39px)/1.35 "Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important;overflow-wrap:anywhere!important}
.trip-feature .featured-activity-copy small,.trip-feature .featured-activity-copy p{font:400 13px/1.8 "Microsoft YaHei",sans-serif!important;margin:0!important}
#activities .activity-project-list{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0!important;border-top:1px solid #c2c8c8;border-left:1px solid #c2c8c8;min-width:0}
#activities .activity-project-list .scrap-activity{display:flex!important;flex-direction:column!important;min-width:0!important;gap:0!important;padding:clamp(18px,2.7vw,45px)!important;border:0!important;border-right:1px solid #c2c8c8!important;border-bottom:1px solid #c2c8c8!important;background:#fff!important}
#activities .activity-project-list .scrap-activity-photo{display:flex!important;align-items:center!important;justify-content:center!important;aspect-ratio:1!important;width:100%!important;min-height:0!important;height:auto!important;background:#f3f4ee!important;overflow:hidden!important;position:relative}
#activities .activity-project-list .activity-feature-media{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;border:0!important;border-radius:0!important;display:flex!important;align-items:center;justify-content:center;background:#f0f0ed!important;padding:0!important}
#activities .activity-project-list .activity-feature-media img{width:100%!important;height:100%!important;display:block!important;object-fit:cover!important;object-position:center!important;border-radius:0!important}
#activities .activity-project-list .scrap-activity-note{width:100%;min-width:0;padding:26px 0 0!important}
#activities .activity-project-list .scrap-activity-note h3{font:700 clamp(23px,2.6vw,40px)/1.3 "Microsoft YaHei",sans-serif!important;letter-spacing:0!important;margin:12px 0!important}
#activities .activity-project-list .scrap-activity-note p{font:400 14px/1.85 "Microsoft YaHei",sans-serif!important}
@media(max-width:1100px){.trip-feature .featured-activity-grid,#activities .activity-project-list{grid-template-columns:1fr!important}.trip-feature .featured-activity-card:nth-child(even){border-left:1px solid #bec6c8!important}}

/* 8.40.11 — remove repetitive design-copy, bilingual nav and spacious ticket geometry */
.trip-site .trip-intro[hidden],.trip-site .trip-transition[hidden]{display:none!important}
.trip-logo small{display:none!important}
.trip-flight-info>span:first-child,.trip-flight-info>i:first-of-type{display:none!important}
.trip-site .trip-nav a,.trip-site .trip-mobile-nav a{display:flex!important;flex-direction:column;align-items:flex-start;gap:3px;white-space:nowrap;min-width:0}
.trip-site .trip-nav a small,.trip-site .trip-mobile-nav a small{display:none!important}
.trip-site .trip-nav a strong,.trip-site .trip-mobile-nav a strong{font:750 clamp(15px,1.3vw,21px)/1.2 "Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important}
.trip-site .trip-nav a em,.trip-site .trip-mobile-nav a em{font:650 10px/1.25 "Courier New",monospace!important;letter-spacing:.12em!important;opacity:.72;font-style:normal}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-nav a{padding:8px 13px!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-logo small{display:none!important}
.trip-feature .featured-activity-grid{align-items:start!important}
.trip-feature .featured-activity-card{height:auto!important;min-height:0!important;align-self:start!important}
.trip-feature .featured-activity-media{max-height:300px!important;aspect-ratio:4/3!important;flex:0 0 auto!important}
.trip-feature .featured-activity-media img{object-fit:contain!important;background:#f3f5f1!important}
.trip-feature .featured-activity-copy{gap:8px!important}
.trip-ticket-section{grid-template-columns:minmax(190px,31%) minmax(0,1fr)!important;min-width:0!important}
.trip-ticket-cover{padding:clamp(35px,4vw,70px)!important;display:flex!important;flex-direction:column;justify-content:space-between!important;min-height:500px!important}
.trip-ticket-cover b{font:850 clamp(44px,5vw,85px)/1.06 "Microsoft YaHei",sans-serif!important;letter-spacing:0!important;overflow-wrap:anywhere}
.trip-ticket-cover b i{font:900 .58em/1.2 Arial,sans-serif!important;font-style:normal;letter-spacing:-.055em}
.trip-ticket-cover>span{font-size:58px!important}
.trip-ticket-list{min-width:0!important;padding:clamp(20px,3vw,50px)!important}
.trip-ticket-list .ticket-grid{display:grid!important;gap:16px!important;min-width:0}
.trip-ticket-list .scrap-pass{position:relative;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(95px,23%) minmax(110px,22%)!important;gap:0!important;min-width:0!important;min-height:166px!important;border:1px solid #b7acaa!important;background:#fffdf8!important;overflow:hidden!important;box-shadow:none!important}
.trip-ticket-list .scrap-pass-watermark{position:absolute;right:18%;top:0;font:900 180px/1 sans-serif;color:#e8f7df;opacity:.7;pointer-events:none}
.trip-ticket-list .scrap-pass-main{position:relative;z-index:1;display:flex!important;flex-direction:column;justify-content:center;gap:9px;padding:24px!important;min-width:0!important}
.trip-ticket-list .scrap-pass-label{font:750 10px/1.5 "Microsoft YaHei",sans-serif;letter-spacing:.08em;color:#8d6974}
.trip-ticket-list .scrap-pass-main h3{margin:0!important;font:750 clamp(19px,1.8vw,29px)/1.3 "Microsoft YaHei",sans-serif!important}
.trip-ticket-list .scrap-pass-main .scrap-pass-line{display:none!important}
.trip-ticket-list .scrap-pass-main .oe-ticket-gift,.trip-ticket-list .scrap-pass-main .oe-ticket-note{font:400 12px/1.65 "Microsoft YaHei",sans-serif!important;overflow-wrap:anywhere}
.trip-ticket-list .scrap-pass-art{position:relative;display:flex;align-items:center;justify-content:center;min-width:0;max-height:170px;overflow:hidden;z-index:1}
.trip-ticket-list .scrap-pass-art img{display:block!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:150px!important;object-fit:contain!important}
.trip-ticket-list .scrap-pass aside{position:relative;z-index:1;display:flex!important;flex-direction:column!important;align-items:flex-end!important;justify-content:center!important;gap:9px;padding:18px 24px!important;border-left:1px dashed #b7acaa!important;min-width:0!important;max-width:none!important}
.trip-ticket-list .scrap-pass aside .oe-ticket-price{font:850 clamp(25px,2.2vw,38px)/1.15 Arial,"Microsoft YaHei",sans-serif!important;white-space:nowrap}
.trip-ticket-list .scrap-pass aside>span{font:600 11px/1.5 "Microsoft YaHei",sans-serif!important;letter-spacing:0}
.trip-ticket-list .ticket-actions{padding-top:16px!important}
@media(max-width:900px){.trip-ticket-section{grid-template-columns:1fr!important}.trip-ticket-cover{min-height:180px!important;padding:28px!important}.trip-ticket-cover b{font-size:45px!important}.trip-ticket-list .scrap-pass{grid-template-columns:minmax(0,1fr) 110px!important}.trip-ticket-list .scrap-pass-art{display:none!important}.trip-ticket-list .scrap-pass aside{padding:15px!important}.trip-feature .featured-activity-media{max-height:260px!important}}
@media(max-width:560px){.trip-ticket-list{padding:14px!important}.trip-ticket-list .scrap-pass{grid-template-columns:1fr!important}.trip-ticket-list .scrap-pass aside{border-left:0!important;border-top:1px dashed #b7acaa!important;align-items:flex-start!important;padding:12px 19px!important}.trip-ticket-list .scrap-pass-main{padding:18px!important}.trip-site .trip-mobile-nav a{padding:10px 13px!important}.trip-site .trip-mobile-nav a strong{font-size:14px!important}}

/* Localized homepage: one event introduction, no repeated metadata rail. */
.trip-site .trip-hero .trip-weather-strip{display:none!important}
.trip-site .trip-intro{display:grid!important}
.trip-site .trip-intro[hidden]{display:none!important}
.trip-site .trip-intro-copy h2{font-size:clamp(36px,4.6vw,78px)!important;letter-spacing:0!important;line-height:1.22!important}
.trip-site .trip-intro-copy h2 small,.trip-site .trip-index>header b small,.trip-site .trip-feature>header h2 small,.trip-site .trip-map-copy h2 small{display:block!important;font:700 clamp(11px,1vw,15px)/1.65 "Courier New",monospace!important;letter-spacing:.08em!important;margin-top:15px!important;white-space:normal!important}
.trip-site .trip-hero-copy>p[data-oe-field="tagline"]{display:none!important}
.trip-site .trip-index>header b{font:750 clamp(27px,2.8vw,53px)/1.24 "Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important;word-break:normal!important;overflow-wrap:anywhere}
.trip-site .trip-feature>header h2,.trip-site .trip-map-copy h2{font-family:"Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important;line-height:1.18!important}
.trip-site .trip-intro>aside b{opacity:.42!important}
@media(max-width:900px){.trip-site .trip-intro{grid-template-columns:1fr!important}.trip-site .trip-index>header b{font-size:34px!important}}

/* Homepage composition refinements: eliminate leftover English ornament. */
.trip-site .trip-photo-caption,.trip-site .trip-route,.trip-site .trip-weather-strip{display:none!important}
.trip-site .trip-intro{grid-template-columns:minmax(185px,25%) minmax(0,1fr)!important;min-height:360px!important;gap:0!important}
.trip-site .trip-intro>aside{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;gap:8px!important;border-right:1px solid #c9d0cb!important;padding-right:28px!important}
.trip-site .trip-intro>aside span{font:800 clamp(23px,2.6vw,42px)/1.35 "Microsoft YaHei",sans-serif!important;letter-spacing:0!important;color:#2c3744!important}
.trip-site .trip-intro>aside small{font:750 12px/1.4 monospace!important;letter-spacing:.12em;color:#7c8385!important}
.trip-site .trip-intro-copy{padding-left:clamp(20px,4vw,70px)!important}
.trip-site .trip-intro-copy h2{display:none!important}
.trip-site .trip-intro-copy p{margin:0!important;max-width:800px!important;font:400 clamp(16px,1.4vw,22px)/1.95 "Microsoft YaHei",sans-serif!important}
.trip-site .trip-index>header b small{display:none!important}
.trip-site .trip-ticket-cover{justify-content:center!important;align-items:flex-start!important;min-height:380px!important}
.trip-site .trip-ticket-cover>b{margin:0!important}
.trip-site .trip-ticket-cover>span{display:none!important}
.trip-site .trip-ticket-list .scrap-pass-watermark{right:16%!important;top:50%!important;transform:translateY(-50%);font:300 110px/1 Arial,sans-serif!important;opacity:.15!important;color:#587a81!important}
.trip-site .trip-ticket-list .scrap-pass-watermark:before{content:"✦";position:absolute;font:400 38px/1 Arial,sans-serif;left:-22px;bottom:-4px}
.trip-site .trip-map{display:grid!important;grid-template-columns:minmax(250px,35%) minmax(0,1fr)!important;align-items:start!important;background:#edf3f2!important}
.trip-site .trip-map-copy{align-self:start!important;min-height:0!important;padding:clamp(35px,5vw,75px)!important}
.trip-site .trip-map-paper{padding:clamp(20px,3vw,44px)!important;background:#edf3f2!important;align-self:start!important;min-height:0!important}
.trip-site .trip-map-paper .map-static{min-height:0!important;height:clamp(290px,34vw,520px)!important;max-height:520px!important;overflow:hidden!important;background:#fff!important}
.trip-site .trip-map-paper .map-static img{width:100%!important;height:100%!important;object-fit:contain!important}
.trip-site .trip-map-copy>span{display:block!important;margin-bottom:12px!important;line-height:1.4!important}
.trip-site .trip-map-copy h2{margin:0 0 22px!important;line-height:1.2!important}
@media(max-width:900px){.trip-site .trip-intro{grid-template-columns:1fr!important;gap:18px!important;padding:42px 22px!important}.trip-site .trip-intro>aside{border-right:0!important;border-bottom:1px solid #c9d0cb!important;padding:0 0 16px!important}.trip-site .trip-intro-copy{padding-left:0!important}.trip-site .trip-map{grid-template-columns:1fr!important}.trip-site .trip-map-copy{padding:35px 25px 18px!important}.trip-site .trip-map-paper{padding:15px 25px 35px!important}.trip-site .trip-map-paper .map-static{height:300px!important}}

.trip-site .trip-hero-meta[hidden],.trip-site .trip-weather-strip[hidden]{display:none!important}

/* The introduction is a real block immediately after the hero ticker, before NEWS. */
.trip-site #event-introduction{display:grid!important;visibility:visible!important;opacity:1!important}
.trip-site #event-introduction .trip-intro-copy p{display:block!important;visibility:visible!important}

/* Standalone event facts: placed above introduction, not overlaying the KV. */
.trip-site .trip-event-facts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));background:#455761;color:#fff;min-width:0;border-top:3px solid #c5d3d4}
.trip-site .trip-event-fact{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:7px;padding:20px clamp(16px,2.6vw,44px);min-width:0;min-height:87px;border-right:1px solid #58666e}
.trip-site .trip-event-fact:last-child{border-right:0}
.trip-site .trip-event-fact span{font:800 12px/1.25 "Courier New",monospace;letter-spacing:.12em;color:#e5eeef}
.trip-site .trip-event-fact strong{font:750 clamp(14px,1.12vw,18px)/1.4 "Microsoft YaHei","PingFang SC",sans-serif;overflow-wrap:anywhere;max-width:100%}
@media(max-width:800px){.trip-site .trip-event-facts{grid-template-columns:repeat(2,minmax(0,1fr))}.trip-site .trip-event-fact{min-height:83px;border-bottom:1px solid #58666e;padding:15px 20px}}
@media(max-width:450px){.trip-site .trip-event-facts{grid-template-columns:1fr}.trip-site .trip-event-fact{min-height:65px;gap:4px;padding:11px 18px}}

.trip-site .trip-hero-copy[hidden]{display:none!important}

/* Home hero reference: full-bleed key art, centered single-line identity, no header metadata. */
body[data-oe-current-page="home"] .trip-site .trip-header,
body:not([data-oe-current-page]) .trip-site .trip-header{position:absolute!important;top:0!important;left:0!important;right:0!important;display:block!important;min-height:0!important;height:0!important;padding:0!important;background:transparent!important;z-index:90!important;pointer-events:none}
body[data-oe-current-page="home"] .trip-site .trip-logo,
body:not([data-oe-current-page]) .trip-site .trip-logo{position:absolute!important;left:50%!important;top:clamp(18px,2vw,36px)!important;transform:translateX(-50%)!important;display:block!important;width:max-content!important;max-width:calc(100vw - 240px)!important;padding:0!important;margin:0!important;text-align:center!important;background:none!important;border:0!important;color:#fff!important;text-shadow:0 1px 9px #1119!important;white-space:nowrap!important;pointer-events:auto}
body[data-oe-current-page="home"] .trip-logo b,
body:not([data-oe-current-page]) .trip-logo b{display:block!important;font:800 clamp(15px,1.7vw,27px)/1.15 Arial,"Microsoft YaHei",sans-serif!important;white-space:nowrap!important;word-break:keep-all!important;letter-spacing:-.035em!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}
body[data-oe-current-page="home"] .trip-site .trip-nav,
body:not([data-oe-current-page]) .trip-site .trip-nav{position:absolute!important;top:clamp(95px,14vh,175px)!important;left:clamp(22px,3.4vw,68px)!important;display:flex!important;flex-direction:column!important;gap:6px!important;padding:0!important;margin:0!important;max-width:220px!important;pointer-events:auto}
body[data-oe-current-page="home"] .trip-site .trip-nav a,
body:not([data-oe-current-page]) .trip-site .trip-nav a{color:#fff!important;text-shadow:0 2px 12px #10171bbd!important}
body[data-oe-current-page="home"] .trip-site .trip-hero,
body:not([data-oe-current-page]) .trip-site .trip-hero{display:block!important;position:relative!important;height:100svh!important;min-height:580px!important;padding:0!important;overflow:hidden!important;background:#aecbd0!important}
body[data-oe-current-page="home"] .trip-site .trip-hero-visual,
body:not([data-oe-current-page]) .trip-site .trip-hero-visual{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-height:0!important;padding:0!important;display:block!important;background:#b9d6d8!important}
body[data-oe-current-page="home"] .trip-site .trip-hero-visual .kv,
body:not([data-oe-current-page]) .trip-site .trip-hero-visual .kv{position:absolute!important;inset:0!important;top:0!important;left:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;aspect-ratio:auto!important;background-size:cover!important;background-position:var(--oe-hero-focal-desktop,center)!important;background-repeat:no-repeat!important;background-color:#aabfc2!important;transform:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;transition:none!important}
body[data-oe-current-page="home"] .trip-site .trip-hero-visual .kv:hover,
body:not([data-oe-current-page]) .trip-site .trip-hero-visual .kv:hover{transform:none!important}
.trip-site .trip-hero-visual .kv.empty .trip-kv-placeholder{background:linear-gradient(135deg,#afc9ca,#d5e6e0)!important}
.trip-site .trip-news{min-height:0!important;grid-template-rows:auto auto!important;align-content:stretch!important}
.trip-site .trip-news>header{min-height:0!important;grid-row:1 / 3!important;padding-block:clamp(35px,4vw,60px)!important}
.trip-site .trip-news-columns{grid-row:1!important;padding-block:18px!important}
.trip-site .trip-news .updates-list{grid-row:2!important;min-height:0!important}
.trip-site .trip-news .scrap-update{min-height:112px!important;padding-block:16px!important}
.trip-site .trip-news .updates-list:empty{min-height:224px!important}
.trip-site #event-introduction{min-height:265px!important;height:auto!important;padding-top:65px!important;padding-bottom:65px!important;align-items:center!important}
.trip-site #event-introduction .trip-intro-copy p{line-height:1.75!important}
@media(max-width:900px){
body[data-oe-current-page="home"] .trip-site .trip-hero,
body:not([data-oe-current-page]) .trip-site .trip-hero{height:100svh!important;min-height:580px!important;padding:0!important;display:block!important}
body[data-oe-current-page="home"] .trip-site .trip-hero-visual,
body:not([data-oe-current-page]) .trip-site .trip-hero-visual{position:absolute!important;inset:0!important;height:100%!important;padding:0!important}
body[data-oe-current-page="home"] .trip-site .trip-hero-visual .kv,
body:not([data-oe-current-page]) .trip-site .trip-hero-visual .kv{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;aspect-ratio:auto!important;box-shadow:none!important;background-size:cover!important;background-position:var(--oe-hero-focal-mobile,center)!important}
body[data-oe-current-page="home"] .trip-site .trip-logo,
body:not([data-oe-current-page]) .trip-site .trip-logo{max-width:calc(100vw - 120px)!important;top:25px!important}
body[data-oe-current-page="home"] .trip-logo b,
body:not([data-oe-current-page]) .trip-logo b{font-size:clamp(14px,3.3vw,23px)!important}
body[data-oe-current-page="home"] .trip-site .trip-nav,
body:not([data-oe-current-page]) .trip-site .trip-nav{display:none!important}
.trip-site .trip-news{grid-template-rows:auto auto auto!important}
.trip-site .trip-news>header{grid-row:1!important;min-height:135px!important}
.trip-site .trip-news-columns{grid-row:2!important}
.trip-site .trip-news .updates-list{grid-row:3!important}
.trip-site #event-introduction{min-height:235px!important;padding-top:38px!important;padding-bottom:38px!important}
}

/* Bind uploaded KV media: renderer writes these variables to .trip-hero. */
.trip-site .trip-hero-visual .kv{background-image:linear-gradient(90deg,rgba(15,26,38,.33),transparent 38%),linear-gradient(180deg,rgba(12,25,30,.28),transparent 28%),var(--oe-hero-image-desktop,none)!important}
@media(max-width:900px){.trip-site .trip-hero-visual .kv{background-image:linear-gradient(180deg,rgba(12,25,30,.33),transparent 34%),var(--oe-hero-image-mobile,var(--oe-hero-image-desktop,none))!important}}

/* Chinese home readability and unified desktop left navigation */
.trip-site #event-introduction{min-height:0!important;padding-block:clamp(30px,3.2vw,50px)!important}
.trip-site .trip-intro-copy p{font-size:clamp(15px,1.2vw,19px)!important;line-height:1.7!important}
.trip-site .trip-news>header>b{font-family:"Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important;font-size:clamp(27px,2.6vw,48px)!important;line-height:1.2!important;overflow-wrap:anywhere}
.trip-site .trip-event-facts .trip-event-fact{min-width:0}
.trip-site .trip-event-facts [data-oe-field]{word-break:normal;overflow-wrap:anywhere}
@media(min-width:901px){
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-header{position:relative!important;display:block!important;min-height:78px!important;height:78px!important;background:#293341!important;padding:0!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-logo{display:block!important;position:absolute!important;top:17px!important;left:270px!important;margin:0!important;padding:0!important;color:#fff!important;text-align:left}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-logo b{font:750 24px/1.3 "Microsoft YaHei",sans-serif!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-nav{position:fixed!important;z-index:80!important;top:0!important;left:0!important;bottom:0!important;width:228px!important;max-width:228px!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;gap:5px!important;margin:0!important;padding:100px 23px 30px!important;background:#293341!important;overflow-y:auto!important;box-sizing:border-box!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-nav a{display:flex!important;flex-direction:column!important;align-items:flex-start!important;color:#fff!important;padding:11px 5px!important;white-space:normal!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-page,
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .custom-page-view{margin-left:228px!important;max-width:calc(100% - 228px)!important;box-sizing:border-box!important}
}
@media(max-width:900px){.trip-site .trip-news>header>b{font-size:38px!important}.trip-site #event-introduction{padding-block:26px!important}}

/* Disabled navigation items must stay hidden despite custom flex layouts. */
.trip-site .trip-nav a[hidden],.trip-site .trip-mobile-nav a[hidden]{display:none!important}
body[data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-nav a[hidden]{display:none!important}

/* Four-field strip: date, city, venue and live event status */
.trip-site .trip-event-facts .trip-event-fact:last-child strong[data-oe-status]{font-size:clamp(15px,1.35vw,21px)!important}
.trip-site .trip-hero-visual .trip-kv-placeholder{font:800 clamp(22px,3vw,42px)/1.3 "Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important}
.trip-site .trip-hero-visual .trip-kv-placeholder small{font:700 clamp(11px,1vw,14px)/1.5 monospace!important;letter-spacing:.12em!important}
.trip-site .trip-ticket-section{grid-template-columns:minmax(170px,23%) minmax(0,1fr)!important;align-items:stretch;min-height:0!important}
.trip-site .trip-ticket-list{padding:clamp(20px,2.2vw,36px)!important}
.trip-site .trip-ticket-list .ticket-grid{gap:14px!important;align-items:start!important}
.trip-site .trip-ticket-list .scrap-pass{width:100%!important;min-width:0!important;max-width:none!important;min-height:172px!important;height:auto!important;grid-template-columns:minmax(0,1fr) minmax(90px,19%) minmax(120px,19%)!important;align-self:start!important;margin:0!important;transform:none!important;border-radius:0!important}
.trip-site .trip-ticket-list .scrap-pass:nth-child(2n){transform:none!important}
.trip-site .trip-ticket-list .scrap-pass-main{padding:21px 26px!important;gap:7px!important}
.trip-site .trip-ticket-list .scrap-pass-art{max-height:175px!important;min-height:0!important}
.trip-site .trip-ticket-list .scrap-pass aside{padding:17px 20px!important}
.trip-site .trip-ticket-list .scrap-pass-watermark{position:absolute!important;left:auto!important;right:15%!important;top:50%!important;width:128px!important;height:128px!important;border:2px solid #839e9280!important;border-radius:50%!important;transform:translate(50%,-50%) rotate(-13deg)!important;opacity:.28!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;color:#5b8175!important;background:none!important;pointer-events:none!important;z-index:0!important}
.trip-site .trip-ticket-list .scrap-pass-watermark::before,.trip-site .trip-ticket-list .scrap-pass-watermark::after{content:none!important}
.trip-site .scrap-pass-watermark .stamp-journey{font:900 16px/1.2 Georgia,serif!important;letter-spacing:.05em!important}
.trip-site .scrap-pass-watermark .stamp-caption{font:800 8px/1.2 monospace!important;letter-spacing:.1em!important}
.trip-site .scrap-pass-watermark .stamp-clover{display:block!important;width:55px!important;height:55px!important;color:inherit}
@media(max-width:900px){.trip-site .trip-ticket-section{grid-template-columns:1fr!important}.trip-site .trip-ticket-list .scrap-pass{grid-template-columns:minmax(0,1fr) 95px 125px!important}}
@media(max-width:560px){.trip-site .trip-ticket-list .scrap-pass{grid-template-columns:minmax(0,1fr) 100px!important}.trip-site .trip-ticket-list .scrap-pass-art{display:none!important}.trip-site .trip-ticket-list .scrap-pass-watermark{right:90px!important;width:96px!important;height:96px!important}.trip-site .scrap-pass-watermark .stamp-clover{width:38px!important;height:38px!important}.trip-site .trip-ticket-list .scrap-pass aside{border-top:0!important;border-left:1px dashed #b7acaa!important;justify-content:center!important}}

.trip-site .trip-ticket-list .scrap-pass-watermark .stamp-svg{display:block;width:100%;height:100%;overflow:visible;color:#648678}
.trip-site .trip-ticket-list .scrap-pass-watermark{background:none!important}

/* Matched editorial rail across PICK UP / ADMISSION / DESTINATION */
.trip-site .trip-feature,.trip-site .trip-ticket-section,.trip-site .trip-map{display:grid!important;grid-template-columns:minmax(215px,27%) minmax(0,1fr)!important;align-items:stretch!important;gap:0!important}
.trip-site .trip-feature>header,.trip-site .trip-ticket-cover,.trip-site .trip-map-copy{min-width:0!important;padding:clamp(34px,4vw,66px) clamp(24px,3vw,48px)!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;gap:0!important;box-sizing:border-box!important}
.trip-site .trip-feature>header>span,.trip-site .trip-ticket-cover>small,.trip-site .trip-map-copy>span{display:block!important;font:800 clamp(11px,.85vw,14px)/1.5 "Courier New",monospace!important;letter-spacing:.08em!important;margin:0 0 clamp(21px,2.8vw,44px)!important;color:inherit!important}
.trip-site .trip-feature>header>h2,.trip-site .trip-ticket-cover>b,.trip-site .trip-map-copy>h2{font:850 clamp(37px,3.3vw,58px)/1.13 "Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important;overflow-wrap:anywhere!important;margin:0!important;color:inherit!important}
.trip-site .trip-feature>header>h2 small,.trip-site .trip-ticket-cover>b i,.trip-site .trip-map-copy>h2 small{display:block!important;margin-top:13px!important;font:850 clamp(17px,1.4vw,24px)/1.25 Arial,sans-serif!important;letter-spacing:.015em!important;font-style:normal!important;color:inherit!important}
.trip-site .trip-feature>header{position:static!important;align-self:stretch!important}
.trip-site .trip-ticket-cover{min-height:0!important;justify-content:flex-start!important}
.trip-site .trip-map-copy{min-height:0!important}
.trip-site .trip-feature>.featured-activity-grid,.trip-site .trip-ticket-list,.trip-site .trip-map-paper{min-width:0!important;align-self:start!important}
.trip-site .trip-event-fact [data-oe-field],.trip-site .trip-event-fact [data-oe-status]{cursor:pointer!important}
.trip-site .trip-event-fact [data-oe-status]:hover{outline:2px solid #f3e45d;outline-offset:4px}
@media(max-width:900px){.trip-site .trip-feature,.trip-site .trip-ticket-section,.trip-site .trip-map{grid-template-columns:1fr!important}.trip-site .trip-feature>header,.trip-site .trip-ticket-cover,.trip-site .trip-map-copy{padding:32px 23px!important}.trip-site .trip-feature>header>span,.trip-site .trip-ticket-cover>small,.trip-site .trip-map-copy>span{margin-bottom:16px!important}}

/* Match feature title's visual baseline and English line behavior to TICKETS/VENUE MAP */
.trip-site .trip-feature>header>h2{font:850 clamp(37px,3.3vw,58px)/1.13 "Microsoft YaHei","PingFang SC",sans-serif!important;letter-spacing:0!important;margin:0!important}
.trip-site .trip-feature>header>h2 small{font:850 clamp(14px,1.2vw,21px)/1.25 Arial,sans-serif!important;letter-spacing:-.035em!important;margin-top:13px!important;white-space:nowrap!important;overflow-wrap:normal!important;word-break:keep-all!important}
/* All three section rails use exactly the same column and inset. */
@media(min-width:901px){
.trip-site .trip-feature,.trip-site .trip-ticket-section,.trip-site .trip-map{grid-template-columns:minmax(250px,27%) minmax(0,1fr)!important}
.trip-site .trip-feature>header,.trip-site .trip-ticket-cover,.trip-site .trip-map-copy{padding:clamp(34px,4vw,66px) clamp(24px,3vw,48px)!important;min-height:0!important;height:auto!important}
}
.trip-site .trip-feature>header{min-height:0!important;height:auto!important;max-height:none!important}
.trip-site .trip-feature>header>span,.trip-site .trip-ticket-cover>small,.trip-site .trip-map-copy>span{margin:0 0 clamp(21px,2.8vw,44px)!important}
.trip-site .trip-feature>header>h2 small{font-size:clamp(14px,1.08vw,18px)!important;white-space:nowrap!important;letter-spacing:-.045em!important}

@media(max-width:900px){.trip-site .trip-feature>header>h2 small{font-size:clamp(14px,3.2vw,20px)!important}}

/* One shared grid size for the three editorial rails, including nested map links */
.trip-site .trip-feature,.trip-site .trip-ticket-section,.trip-site .trip-map{grid-template-columns:minmax(250px,27%) minmax(0,1fr)!important}
.trip-site .trip-feature>header,.trip-site .trip-ticket-cover,.trip-site .trip-map-copy{width:100%!important;min-width:0!important;max-width:none!important;box-sizing:border-box!important;padding:clamp(34px,4vw,66px) clamp(24px,3vw,48px)!important}
.trip-site .trip-map-copy .map-link-list{width:100%!important;max-width:100%!important;min-width:0!important}



@media(max-width:900px){.trip-site .trip-feature,.trip-site .trip-ticket-section,.trip-site .trip-map{grid-template-columns:minmax(0,1fr)!important}}

/* Hero-local navigation: anchored beside KV, scrolls away with the home hero. */
@media(min-width:901px){
body[data-oe-current-page="home"] .trip-site .trip-nav,
body:not([data-oe-current-page]) .trip-site .trip-nav{
position:absolute!important;left:clamp(22px,3.4vw,68px)!important;top:clamp(95px,14vh,175px)!important;
bottom:auto!important;right:auto!important;z-index:95!important;
height:auto!important;max-height:none!important;overflow:visible!important;
}
}

/* Clean pinned navigation and masthead, without residual dividers or lettering shadows. */
.trip-site .trip-nav,.trip-site .trip-nav a,.trip-site .trip-nav a::before,.trip-site .trip-nav a::after{border:0!important;border-left:0!important;box-shadow:none!important;background-image:none!important}
.trip-site .trip-nav a{background:transparent!important;text-shadow:none!important;padding-left:0!important}
.trip-site .trip-nav a strong,.trip-site .trip-nav a em,.trip-site .trip-nav a small{background:transparent!important;text-shadow:none!important;box-shadow:none!important;border:0!important}
body[data-oe-current-page="home"] .trip-site .trip-nav a,
body:not([data-oe-current-page]) .trip-site .trip-nav a{color:#fff!important;text-shadow:none!important;border:0!important;box-shadow:none!important}
body[data-oe-current-page="home"] .trip-site .trip-logo,
body:not([data-oe-current-page]) .trip-site .trip-logo,
body[data-oe-current-page="home"] .trip-site .trip-logo b,
body:not([data-oe-current-page]) .trip-site .trip-logo b{text-shadow:none!important;filter:none!important;box-shadow:none!important}

/* Unified 27% editorial title rail for every standard homepage content block.
   Full-screen Hero, moving ribbon and four-column event facts retain their own layouts. */
@media(min-width:761px){
.trip-site{--oe-home-rail:minmax(250px,27%) minmax(0,1fr);--oe-home-rail-pad:clamp(34px,4vw,66px) clamp(24px,3vw,48px)}
.trip-site #event-introduction,
.trip-site .trip-news,
.trip-site .trip-index,
.trip-site .trip-feature,
.trip-site .trip-ticket-section,
.trip-site .trip-map{display:grid!important;grid-template-columns:var(--oe-home-rail)!important;column-gap:0!important;box-sizing:border-box!important}
.trip-site #event-introduction{grid-template-rows:auto!important;gap:0!important;padding:0!important;min-height:0!important}
.trip-site #event-introduction>aside{grid-column:1!important;grid-row:1!important;align-self:stretch!important;padding:var(--oe-home-rail-pad)!important;box-sizing:border-box!important;border-right:1px solid #c9d0cb!important;border-bottom:0!important}
.trip-site #event-introduction .trip-intro-copy{grid-column:2!important;grid-row:1!important;align-self:center!important;padding:var(--oe-home-rail-pad)!important;box-sizing:border-box!important}
.trip-site .trip-news{grid-template-rows:auto 1fr!important;min-height:0!important}
.trip-site .trip-news>header{grid-column:1!important;grid-row:1 / span 2!important;align-self:stretch!important;box-sizing:border-box!important;padding:var(--oe-home-rail-pad)!important;min-width:0!important}
.trip-site .trip-news-columns{grid-column:2!important;grid-row:1!important;min-width:0!important}
.trip-site .trip-news .updates-list{grid-column:2!important;grid-row:2!important;min-width:0!important}
.trip-site .trip-index{grid-template-rows:auto!important}
.trip-site .trip-index>header{grid-column:1!important;grid-row:1!important;align-self:stretch!important;box-sizing:border-box!important;padding:var(--oe-home-rail-pad)!important;min-width:0!important}
.trip-site .trip-index>.quick-grid{grid-column:2!important;grid-row:1!important;min-width:0!important}
.trip-site .trip-feature>header,.trip-site .trip-ticket-cover,.trip-site .trip-map-copy{padding:var(--oe-home-rail-pad)!important}
}
/* Mobile retains vertical stacking across all sections. */
@media(max-width:760px){
.trip-site #event-introduction,.trip-site .trip-news,.trip-site .trip-index,.trip-site .trip-feature,.trip-site .trip-ticket-section,.trip-site .trip-map{grid-template-columns:minmax(0,1fr)!important}
.trip-site #event-introduction>aside,.trip-site #event-introduction .trip-intro-copy{grid-column:1!important;padding:25px 23px!important}
.trip-site #event-introduction>aside{border-right:0!important}
}

/* Studio frame often lies between 761–900 CSS px: override old mobile single-column rules there. */
@media(min-width:761px) and (max-width:900px){
.trip-site #event-introduction,.trip-site .trip-news,.trip-site .trip-index,.trip-site .trip-feature,.trip-site .trip-ticket-section,.trip-site .trip-map{display:grid!important;grid-template-columns:minmax(200px,27%) minmax(0,1fr)!important;gap:0!important}
.trip-site #event-introduction{padding:0!important}
.trip-site #event-introduction>aside,.trip-site #event-introduction .trip-intro-copy{padding:34px 20px!important;border-bottom:0!important}
.trip-site #event-introduction>aside{border-right:1px solid #c9d0cb!important}
.trip-site .trip-news>header{grid-column:1!important;grid-row:1 / span 2!important;min-height:0!important}
.trip-site .trip-news-columns{display:grid!important;grid-column:2!important;grid-row:1!important}
.trip-site .trip-news .updates-list{grid-column:2!important;grid-row:2!important}
.trip-site .trip-index>header{grid-column:1!important;grid-row:1!important;border-bottom:0!important}
.trip-site .trip-index .quick-grid{grid-column:2!important;grid-row:1!important}
.trip-site .trip-feature>header,.trip-site .trip-ticket-cover,.trip-site .trip-map-copy{padding:34px 20px!important;width:100%!important}
.trip-site .trip-feature>.featured-activity-grid,.trip-site .trip-ticket-list,.trip-site .trip-map-paper{grid-column:2!important;min-width:0!important}
}

/* Shared structural rail: every homepage editorial section uses the exact feature
   layout instead of separate widths inherited from legacy section CSS. */
@media(min-width:761px){
.trip-site .oe-editorial-section{display:grid!important;grid-template-columns:minmax(0,27%) minmax(0,73%)!important;column-gap:0!important;row-gap:0!important;width:100%!important;min-width:0!important;margin-inline:0!important;box-sizing:border-box!important}
.trip-site .oe-editorial-section>.oe-editorial-rail{grid-column:1!important;grid-row:1!important;width:100%!important;min-width:0!important;max-width:none!important;box-sizing:border-box!important;margin:0!important;align-self:stretch!important;padding:clamp(34px,4vw,66px) clamp(24px,3vw,48px)!important}
.trip-site .trip-news.oe-editorial-section>.oe-editorial-rail{grid-row:1 / span 2!important}
.trip-site .trip-news.oe-editorial-section>.trip-news-columns{grid-column:2!important;grid-row:1!important}
.trip-site .trip-news.oe-editorial-section>.updates-list{grid-column:2!important;grid-row:2!important}
.trip-site .trip-intro.oe-editorial-section>.trip-intro-copy{grid-column:2!important;grid-row:1!important;margin:0!important;min-width:0!important}
.trip-site .trip-index.oe-editorial-section>.quick-grid,
.trip-site .trip-feature.oe-editorial-section>.featured-activity-grid,
.trip-site .trip-ticket-section.oe-editorial-section>.trip-ticket-list,
.trip-site .trip-map.oe-editorial-section>.trip-map-paper{grid-column:2!important;grid-row:1!important;min-width:0!important;margin:0!important}
}
@media(max-width:760px){.trip-site .oe-editorial-section{display:grid!important;grid-template-columns:minmax(0,1fr)!important}.trip-site .oe-editorial-section>.oe-editorial-rail{grid-column:1!important;grid-row:auto!important;min-width:0!important}}

/* Browser-measured regression fix: legacy .trip-feature has 6vw horizontal
   padding, shifting its entire 27% rail by 87px at 1450px viewport. */
@media(min-width:761px){
.trip-site .oe-editorial-section{padding:0!important;gap:0!important;margin-left:0!important;margin-right:0!important}
.trip-site .trip-feature.oe-editorial-section{padding:0!important;gap:0!important}
}

/* Venue map: content-sized section with symmetrical image top/bottom inset. */
.trip-site .trip-map.oe-editorial-section{
  min-height:0!important;
  height:auto!important;
  align-items:stretch!important;
  grid-auto-rows:auto!important;
  padding-block:0!important;
}
.trip-site .trip-map.oe-editorial-section>.trip-map-paper{
  align-self:stretch!important;
  height:auto!important;
  min-height:0!important;
  padding:clamp(20px,3vw,44px)!important;
  box-sizing:border-box!important;
}
.trip-site .trip-map.oe-editorial-section>.trip-map-copy{
  align-self:stretch!important;
  min-height:0!important;
}
@media(max-width:760px){
  .trip-site .trip-map.oe-editorial-section>.trip-map-paper{
    padding:20px 23px!important;
  }
}

/* Community typography: one cropped word at each edge, no repeated LINK wallpaper. */
.trip-site .trip-community{
  padding:clamp(34px,4vw,56px) 2.5vw clamp(34px,4vw,56px)!important;
  min-height:0!important;
  overflow:hidden!important;
}
.trip-site .trip-social-wallpaper{
  position:absolute!important;inset:0!important;
  z-index:0!important;width:100%!important;height:100%!important;
  overflow:hidden!important;pointer-events:none!important;
  opacity:.72!important;font-size:inherit!important;line-height:normal!important;
  letter-spacing:normal!important;word-break:normal!important;
}
.trip-site .trip-social-wallpaper span{
  position:absolute;left:-.04em;display:block;white-space:nowrap;
  font:900 clamp(160px,24vw,385px)/1 Arial,Helvetica,sans-serif;
  letter-spacing:-.075em;color:#c8ff5a;
  user-select:none;
}
.trip-site .trip-social-wallpaper .trip-wallpaper-top{top:-.51em}
.trip-site .trip-social-wallpaper .trip-wallpaper-bottom{bottom:-.52em}
.trip-site .trip-community>header{z-index:2!important;margin:0 0 clamp(8px,1.5vw,22px)!important}
.trip-site .trip-community .community{padding:clamp(18px,2.5vw,35px) 3vw clamp(18px,2.5vw,35px)!important}
/* Small interaction polish without moving cards until visitors engage. */
@media(prefers-reduced-motion:no-preference){
.trip-site .trip-community .scrap-social{transition:transform .45s cubic-bezier(.2,.8,.2,1),filter .35s ease!important}
.trip-site .trip-community .scrap-social:hover{filter:brightness(1.035);z-index:5}
.trip-site .trip-community .scrap-social-stamp{transition:transform .3s ease!important}
.trip-site .trip-community .scrap-social:hover .scrap-social-stamp{transform:translate(3px,-4px) rotate(12deg)}
.trip-site .trip-community>header h2 i{display:inline-block;animation:oe-community-arrow 2.8s ease-in-out infinite}
@keyframes oe-community-arrow{0%,100%{transform:translate(0,0)}50%{transform:translate(5px,-5px)}}
}
@media(max-width:760px){
.trip-site .trip-community{padding:34px 12px 38px!important}
.trip-site .trip-social-wallpaper span{font-size:clamp(110px,33vw,195px)}
.trip-site .trip-community .community{padding:16px 2vw 22px!important}
}
@media(prefers-reduced-motion:reduce){
.trip-site .trip-community>header h2 i{animation:none!important}
.trip-site .trip-community .scrap-social,.trip-site .trip-community .scrap-social-stamp{transition:none!important}
}

/* Low-cost homepage motion: compositor-only transforms/opacity; no libraries,
   media requests, looping hero animations or loading gates. */
@media (hover:hover) and (prefers-reduced-motion:no-preference){
.trip-site .trip-feature .featured-activity-card,
.trip-site .trip-feature .scrap-activity{
  transition:transform .28s ease,box-shadow .28s ease!important;
  will-change:auto;
}
.trip-site .trip-feature .featured-activity-card:hover,
.trip-site .trip-feature .scrap-activity:hover{
  transform:translateY(-5px)!important;
}
.trip-site .trip-feature .featured-activity-card img,
.trip-site .trip-feature .scrap-activity img{
  transition:transform .4s ease!important;
}
.trip-site .trip-feature .featured-activity-card:hover img,
.trip-site .trip-feature .scrap-activity:hover img{
  transform:scale(1.025)!important;
}
.trip-site .trip-ticket-section .scrap-pass{
  transition:transform .28s ease!important;
}
.trip-site .trip-ticket-section .scrap-pass:hover{
  transform:translateY(-4px)!important;
}
.trip-site .trip-map-copy .map-link-list a,
.trip-site .trip-news .scrap-update{
  transition:transform .22s ease!important;
}
.trip-site .trip-map-copy .map-link-list a:hover,
.trip-site .trip-news .scrap-update:hover{
  transform:translateX(4px)!important;
}
}
@media(prefers-reduced-motion:reduce){
.trip-site .trip-feature .featured-activity-card,
.trip-site .trip-feature .scrap-activity,
.trip-site .trip-feature img,
.trip-site .trip-ticket-section .scrap-pass,
.trip-site .trip-map-copy .map-link-list a,
.trip-site .trip-news .scrap-update{
  transition:none!important;
}
}

/* Seamless typography: lower half of COMMUNITY at top, upper half at bottom.
   Matching font, size, letterspacing, and x coordinate forms one cyclic word. */
.trip-site .trip-social-wallpaper .trip-wallpaper-top,
.trip-site .trip-social-wallpaper .trip-wallpaper-bottom{
  left:0!important;width:max-content!important;
  font:900 clamp(160px,24vw,385px)/1 Arial,Helvetica,sans-serif!important;
  letter-spacing:-.075em!important;white-space:nowrap!important;
}
.trip-site .trip-social-wallpaper .trip-wallpaper-top{top:-.50em!important}
.trip-site .trip-social-wallpaper .trip-wallpaper-bottom{bottom:-.50em!important}
@media(max-width:760px){
.trip-site .trip-social-wallpaper .trip-wallpaper-top,
.trip-site .trip-social-wallpaper .trip-wallpaper-bottom{font-size:clamp(110px,33vw,195px)!important}
}
@media(hover:hover) and (prefers-reduced-motion:no-preference){
.trip-site .trip-index .quick-grid>*{transition:translate .26s ease,filter .26s ease!important}
.trip-site .trip-index .quick-grid>*:hover{translate:0 -5px;filter:brightness(1.04)}
.trip-site .trip-ticket-section .scrap-pass:hover{filter:brightness(1.035)}
.trip-site .trip-map .map-static img{transition:scale .45s ease!important}
.trip-site .trip-map .map-static:hover img{scale:1.012}
}
@media(prefers-reduced-motion:reduce){
.trip-site .trip-index .quick-grid>*,.trip-site .trip-map .map-static img{transition:none!important}
}


/* Single deterministic entry motion; renderer marks elements when visible.
   Unlike CSS view-timelines, works in the editable iframe and preview mode. */
@media(prefers-reduced-motion:no-preference){
.trip-site .oe-motion-target{animation:none!important;transition:opacity .72s cubic-bezier(.2,.7,.2,1),translate .72s cubic-bezier(.2,.7,.2,1)!important;opacity:0!important;translate:0 48px!important}
.trip-site .oe-motion-target.oe-motion-visible{opacity:1!important;translate:0 0!important}
}
@media(prefers-reduced-motion:reduce){
.trip-site .oe-motion-target{animation:none!important;transition:none!important;opacity:1!important;translate:none!important}
}

/* Complete the original no-extra-assets animation plan. All use GPU-friendly
   transform/opacity; editing / reduced-motion remain unaffected. */
@media(prefers-reduced-motion:no-preference){
/* Hero: once-only gentle settle, no loading gate or hidden content. */
body[data-oe-current-page="home"] .trip-site .trip-hero-visual .kv,
body:not([data-oe-current-page]) .trip-site .trip-hero-visual .kv{
 animation:oe-kv-settle .95s cubic-bezier(.18,.7,.3,1) both!important;
}
@keyframes oe-kv-settle{from{opacity:.82;scale:1.035}to{opacity:1;scale:1}}
/* Event facts: readable, staggered entrance without making them invisible. */
.trip-site .trip-event-fact{animation:oe-fact-arrive .55s ease-out both!important}
.trip-site .trip-event-fact:nth-child(2){animation-delay:.08s!important}
.trip-site .trip-event-fact:nth-child(3){animation-delay:.16s!important}
.trip-site .trip-event-fact:nth-child(4){animation-delay:.24s!important}
@keyframes oe-fact-arrive{from{opacity:.5;translate:0 16px}to{opacity:1;translate:0 0}}
/* Real card image zoom lives on the media container to avoid overwritten image transforms. */
.trip-site .trip-feature .featured-activity-media{overflow:hidden!important}
.trip-site .trip-feature .featured-activity-media img{transition:scale .4s ease!important}
.trip-site .trip-feature .featured-activity-card:hover .featured-activity-media img,
.trip-site .trip-feature .scrap-activity:hover .featured-activity-media img{scale:1.045}
/* Ticket watermark seal gently reacts to ticket interaction. */
.trip-site .trip-ticket-list .scrap-pass-watermark{transition:rotate .5s cubic-bezier(.2,.7,.2,1)!important}
.trip-site .trip-ticket-list .scrap-pass:hover .scrap-pass-watermark{rotate:12deg}
/* Link arrow / content response without layout reflow. */
.trip-site .trip-map .map-link-list a{transition:translate .23s ease!important}
.trip-site .trip-map .map-link-list a:hover{translate:6px 0}
.trip-site .trip-news .scrap-update{transition:translate .2s ease!important}
.trip-site .trip-news .scrap-update:hover{translate:4px 0}
}
@media(prefers-reduced-motion:reduce){
.trip-site .trip-hero-visual .kv,.trip-site .trip-event-fact{animation:none!important}
.trip-site .trip-feature .featured-activity-media img,
.trip-site .trip-ticket-list .scrap-pass-watermark,
.trip-site .trip-map .map-link-list a,.trip-site .trip-news .scrap-update{transition:none!important}
}

/* Two identically phased seamless marquees; top shows glyph lower half,
   bottom glyph upper half. No JS, media requests, or extra libraries. */
.trip-site .trip-social-wallpaper .trip-wallpaper-marquee{
 position:absolute!important;left:0!important;right:auto!important;
 display:flex!important;width:max-content!important;max-width:none!important;
 white-space:nowrap!important;gap:0!important;
 font:900 clamp(160px,24vw,385px)/1 Arial,Helvetica,sans-serif!important;
 letter-spacing:-.075em!important;color:#c8ff5a!important;
 animation:oe-community-marquee 36s linear infinite!important;
 will-change:transform;
}
.trip-site .trip-social-wallpaper .trip-wallpaper-marquee b{
 display:block!important;flex:0 0 auto!important;font:inherit!important;
 letter-spacing:inherit!important;white-space:nowrap!important;
}
.trip-site .trip-social-wallpaper .trip-wallpaper-top{top:-.50em!important;bottom:auto!important}
.trip-site .trip-social-wallpaper .trip-wallpaper-bottom{bottom:-.50em!important;top:auto!important}
@keyframes oe-community-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media(max-width:760px){
.trip-site .trip-social-wallpaper .trip-wallpaper-marquee{font-size:clamp(110px,33vw,195px)!important}
}
@media(prefers-reduced-motion:reduce){
.trip-site .trip-social-wallpaper .trip-wallpaper-marquee{animation:none!important;will-change:auto!important}
}

/* Distinct homepage animation language — native CSS only, no download delay. */
@media(prefers-reduced-motion:no-preference){
/* KV opens like two translucent travel shutters, without blocking interaction. */
.trip-site .trip-hero:before,.trip-site .trip-hero:after{
 content:"";position:absolute;top:0;bottom:0;width:51%;z-index:8;
 background:#c5e0dd;pointer-events:none;transform:scaleX(0);
}
.trip-site .trip-hero:before{left:0;transform-origin:left;animation:oe-hero-curtain-left .85s cubic-bezier(.7,0,.2,1) both}
.trip-site .trip-hero:after{right:0;transform-origin:right;animation:oe-hero-curtain-right .85s cubic-bezier(.7,0,.2,1) both}
@keyframes oe-hero-curtain-left{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes oe-hero-curtain-right{0%{transform:scaleX(1)}100%{transform:scaleX(0)}}
/* Clear, content-safe editorial animations. The containers remain readable even
   if the observer never activates; only decorative elements animate. */
.trip-site .trip-intro-copy.oe-motion-target,
.trip-site .trip-intro-copy.oe-motion-visible,
.trip-site .trip-news>header.oe-motion-target,
.trip-site .trip-news>header.oe-motion-visible,
.trip-site .trip-news .updates-list.oe-motion-target,
.trip-site .trip-news .updates-list.oe-motion-visible,
.trip-site .trip-map-copy.oe-motion-target,
.trip-site .trip-map-copy.oe-motion-visible,
.trip-site .trip-map-paper.oe-motion-target,
.trip-site .trip-map-paper.oe-motion-visible{
 opacity:1!important;translate:none!important;clip-path:none!important;
}
.trip-site .trip-news>header:after,.trip-site .trip-map-copy:after{content:none!important}
@media(prefers-reduced-motion:no-preference){
/* Intro: a bold editorial headline slides upward, followed by the copy. */
.trip-site .trip-intro-copy.oe-motion-visible h2{
 animation:oe-editorial-rise 1.15s cubic-bezier(.18,.85,.22,1) both!important;
}
.trip-site .trip-intro-copy.oe-motion-visible p{
 animation:oe-editorial-rise 1s cubic-bezier(.18,.85,.22,1) .18s both!important;
}
@keyframes oe-editorial-rise{
 from{opacity:.15;transform:translateY(58px) skewY(3deg)}
 to{opacity:1;transform:translateY(0) skewY(0)}
}
/* News: each entry snaps into place like a magazine card. */
.trip-site .trip-news .updates-list.oe-motion-visible .scrap-update{
 animation:oe-news-arrive .9s cubic-bezier(.16,.8,.2,1) both!important;
}
.trip-site .trip-news .updates-list.oe-motion-visible .scrap-update:nth-child(2){animation-delay:.16s!important}
.trip-site .trip-news .updates-list.oe-motion-visible .scrap-update:nth-child(3){animation-delay:.32s!important}
.trip-site .trip-news .updates-list.oe-motion-visible .scrap-update:nth-child(4){animation-delay:.48s!important}
@keyframes oe-news-arrive{
 from{opacity:.18;transform:translateX(72px) rotate(1deg)}
 to{opacity:1;transform:translateX(0) rotate(0)}
}
/* Map: the media opens like a horizontal travel poster. */
.trip-site .trip-map-paper.oe-motion-visible .map-static{
 animation:oe-map-unfold 1.25s cubic-bezier(.2,.82,.22,1) both!important;
 transform-origin:left center;
}
@keyframes oe-map-unfold{
 from{opacity:.35;clip-path:inset(0 85% 0 0);filter:saturate(.65)}
 to{opacity:1;clip-path:inset(0 0 0 0);filter:saturate(1)}
}
}
/* Posters: paper-mask reveal, no alteration of event images themselves. */
/* Activity content must never depend on scroll-observer success to display.
   Animate cards, not the entire interactive/mount container. */
.trip-site .trip-feature .featured-activity-grid.oe-motion-target,
.trip-site .trip-feature .featured-activity-grid.oe-motion-visible{
  opacity:1!important;translate:none!important;clip-path:none!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-card,
.trip-site .trip-feature .featured-activity-grid .scrap-activity{
  transition:transform .35s ease,box-shadow .35s ease,filter .35s ease!important;
}
@media(prefers-reduced-motion:no-preference){
.trip-site .trip-feature .featured-activity-grid.oe-motion-visible .featured-activity-card,
.trip-site .trip-feature .featured-activity-grid.oe-motion-visible .scrap-activity{
  animation:oe-feature-card-reveal .8s cubic-bezier(.16,.8,.24,1) both;
}
.trip-site .trip-feature .featured-activity-grid.oe-motion-visible > :nth-child(2){animation-delay:.12s}
.trip-site .trip-feature .featured-activity-grid.oe-motion-visible > :nth-child(3){animation-delay:.24s}
@keyframes oe-feature-card-reveal{
from{opacity:.65;translate:0 20px;scale:.975}
to{opacity:1;translate:0 0;scale:1}
}
}
/* Ticket: stamp presses down then rebounds after ticket enters viewport. */
.trip-site .trip-ticket-list.oe-motion-target .scrap-pass-watermark{animation:none!important}
.trip-site .trip-ticket-list.oe-motion-visible .scrap-pass-watermark{animation:oe-stamp-impact .7s cubic-bezier(.2,.8,.2,1) both!important}
@keyframes oe-stamp-impact{0%{opacity:.2;transform:translateY(-24px) scale(1.4) rotate(-12deg)}55%{opacity:1;transform:translateY(2px) scale(.93) rotate(3deg)}77%{transform:translateY(-2px) scale(1.035) rotate(-2deg)}100%{transform:translateY(0) scale(1) rotate(0)}}
/* Collage: cards arrive with their existing quirky angle preserved. */
.trip-site .trip-community .scrap-social{animation:oe-collage-drop .72s backwards;animation-play-state:paused}
.trip-site .trip-community .community.oe-motion-visible .scrap-social{animation-play-state:running}
.trip-site .trip-community .scrap-social:nth-child(2){animation-delay:.10s}
.trip-site .trip-community .scrap-social:nth-child(3){animation-delay:.20s}
.trip-site .trip-community .scrap-social:nth-child(4){animation-delay:.30s}
@keyframes oe-collage-drop{from{opacity:0;translate:0 -28px}to{opacity:1;translate:0 0}}
/* Quick directory responds with a slight tilt, without pointer tracking or CPU loops. */
@media(hover:hover){.trip-site .trip-index .quick-grid>*:hover{rotate:-1.5deg}}
}
@media(prefers-reduced-motion:reduce){
.trip-site .trip-hero:before,.trip-site .trip-hero:after,.trip-site .trip-news>header:after,.trip-site .trip-map-copy:after{display:none!important}
.trip-site .trip-intro-copy,.trip-site .trip-feature .featured-activity-grid{clip-path:none!important}
.trip-site .trip-community .scrap-social,.trip-site .trip-ticket-list .scrap-pass-watermark{animation:none!important}
}

/* Hero paint-order repair: keep the entry curtain below all labels/nav.
   The former z-index:8 overlay obscured the opening typography. */
.trip-site .trip-hero{isolation:isolate!important}
.trip-site .trip-hero-visual{z-index:0!important}
.trip-site .trip-hero:before,.trip-site .trip-hero:after{z-index:1!important}
.trip-site .trip-hero-copy{z-index:3!important}
body[data-oe-current-page="home"] .trip-site .trip-header,
body:not([data-oe-current-page]) .trip-site .trip-header{z-index:90!important}
.trip-site .trip-logo,.trip-site .trip-logo b{position:relative;isolation:isolate}
@media(prefers-reduced-motion:reduce){
.trip-site .trip-hero:before,.trip-site .trip-hero:after{animation:none!important;display:none!important}
}

/* Feature v8.40.51: consistent full-width editorial rail + three overlapping
   activity posters. Keep all cards in document flow so variable copy is safe. */
@media(min-width:901px){
.trip-site .trip-feature.oe-editorial-section{
  display:grid!important;grid-template-columns:minmax(0,27%) minmax(0,73%)!important;
  padding:0!important;gap:0!important;align-items:stretch!important;
  background:#e6f0eb!important;
}
.trip-site .trip-feature.oe-editorial-section>header{
  grid-column:1!important;grid-row:1!important;position:relative!important;
  background:#c9fb62!important;color:#293946!important;
  border-right:1px solid #bdc9bd!important;
  padding:clamp(34px,4vw,66px) clamp(24px,3vw,48px)!important;
}
.trip-site .trip-feature.oe-editorial-section>.featured-activity-grid{
  grid-column:2!important;grid-row:1!important;display:grid!important;
  grid-template-columns:repeat(12,minmax(0,1fr))!important;
  grid-template-rows:none!important;grid-auto-rows:auto!important;
  gap:0!important;align-items:start!important;align-content:start!important;
  min-height:0!important;padding:clamp(30px,4vw,64px)!important;
  background:#e9f0ed!important;border:0!important;overflow:visible!important;
}
.trip-site .trip-feature .featured-activity-grid > :nth-child(1){grid-column:1 / 10!important;grid-row:1!important;z-index:1}
.trip-site .trip-feature .featured-activity-grid > :nth-child(2){grid-column:6 / 13!important;grid-row:2!important;margin-top:-42px!important;z-index:2}
.trip-site .trip-feature .featured-activity-grid > :nth-child(3){grid-column:2 / 11!important;grid-row:3!important;margin-top:-42px!important;z-index:3}
}
.trip-site .trip-feature .featured-activity-grid>.featured-activity-card,
.trip-site .trip-feature .featured-activity-grid>.scrap-activity{
  display:flex!important;flex-direction:column!important;width:100%!important;
  min-width:0!important;max-width:none!important;height:auto!important;
  padding:0!important;gap:0!important;overflow:hidden!important;
  background:#fff!important;border:1px solid #cad4cf!important;
  box-shadow:0 14px 34px rgba(34,55,51,.12)!important;
}
.trip-site .trip-feature .featured-activity-media,
.trip-site .trip-feature .scrap-activity-photo{
  display:block!important;position:relative!important;aspect-ratio:16/9!important;
  width:100%!important;height:auto!important;max-height:none!important;
  min-height:0!important;padding:0!important;margin:0!important;
  border:0!important;background:#dbe7e2!important;overflow:hidden!important;
}
.trip-site .trip-feature .featured-activity-media img,
.trip-site .trip-feature .scrap-activity-photo img{
  display:block!important;position:absolute!important;inset:0!important;
  width:100%!important;height:100%!important;max-width:none!important;
  object-fit:cover!important;object-position:center!important;
  background:transparent!important;padding:0!important;
}
.trip-site .trip-feature .featured-activity-copy,
.trip-site .trip-feature .scrap-activity-copy{
  background:#fff!important;color:#293946!important;padding:clamp(17px,2.2vw,30px)!important;
}
@media(max-width:900px){
.trip-site .trip-feature.oe-editorial-section{display:grid!important;grid-template-columns:1fr!important;padding:0!important;gap:0!important}
.trip-site .trip-feature.oe-editorial-section>header{grid-column:1!important;grid-row:1!important;background:#c9fb62!important}
.trip-site .trip-feature.oe-editorial-section>.featured-activity-grid{
  grid-column:1!important;grid-row:2!important;display:grid!important;
  grid-template-columns:minmax(0,1fr)!important;gap:18px!important;
  padding:clamp(18px,4vw,32px)!important;min-height:0!important;
  background:#e9f0ed!important;border:0!important;
}
.trip-site .trip-feature .featured-activity-grid>*{
  position:relative!important;grid-column:auto!important;grid-row:auto!important;
  margin:0!important;width:100%!important;transform:none!important;
}
}

/* v8.40.52: no overlapping copy — alternating poster cards with balanced text.
   Earlier negative margins collided with variable-length CMS activity descriptions. */
@media(min-width:901px){
.trip-site .trip-feature.oe-editorial-section>.featured-activity-grid{
 row-gap:clamp(22px,3vw,42px)!important;
 padding:clamp(24px,3vw,48px)!important;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(1){
 grid-column:1 / 11!important;grid-row:1!important;margin:0!important;z-index:1;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(2){
 grid-column:3 / 13!important;grid-row:2!important;margin:0!important;z-index:1;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(3){
 grid-column:2 / 12!important;grid-row:3!important;margin:0!important;z-index:1;
}
}
.trip-site .trip-feature .featured-activity-grid>.featured-activity-card,
.trip-site .trip-feature .featured-activity-grid>.scrap-activity{
 overflow:visible!important;box-sizing:border-box!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy{
 position:relative!important;inset:auto!important;transform:none!important;
 width:100%!important;max-width:100%!important;min-width:0!important;
 height:auto!important;max-height:none!important;overflow:visible!important;
 box-sizing:border-box!important;background:#fff!important;
 color:#293946!important;text-shadow:none!important;
 padding:clamp(20px,2.4vw,32px)!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy *,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy *{
 position:relative;max-width:100%;overflow-wrap:break-word;
 color:#293946!important;text-shadow:none!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy h2,
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy h3,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy h2,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy h3{
 font-size:clamp(24px,2.5vw,38px)!important;line-height:1.25!important;
 letter-spacing:-.025em!important;margin:8px 0 12px!important;
}
@media(max-width:900px){
.trip-site .trip-feature .featured-activity-grid>*{margin:0!important}
}

/* v8.40.53: compact overlapping editorial activities and shorter staggered tickets.
   Preserve content height and editing hooks; only visual surfaces overlap. */
@media(min-width:901px){
.trip-site .trip-feature.oe-editorial-section>.featured-activity-grid{
 padding:clamp(16px,2vw,28px)!important;
 row-gap:0!important;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(1){
 grid-column:1 / 11!important;grid-row:1!important;margin:0!important;z-index:1;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(2){
 grid-column:4 / 13!important;grid-row:2!important;margin-top:-58px!important;z-index:2;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(3){
 grid-column:1 / 11!important;grid-row:3!important;margin-top:-58px!important;z-index:3;
}
.trip-site .trip-feature .featured-activity-grid>.featured-activity-card,
.trip-site .trip-feature .featured-activity-grid>.scrap-activity{
 display:grid!important;grid-template-columns:minmax(0,45%) minmax(0,55%)!important;
 align-items:stretch!important;min-height:0!important;
 overflow:hidden!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-media,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-photo{
 grid-column:1!important;grid-row:1!important;aspect-ratio:auto!important;
 height:100%!important;min-height:190px!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy{
 grid-column:2!important;grid-row:1!important;align-self:center!important;
 padding:clamp(15px,1.6vw,25px)!important;
}
.trip-site .trip-feature .featured-activity-grid h2,
.trip-site .trip-feature .featured-activity-grid h3{
 font-size:clamp(21px,2vw,31px)!important;line-height:1.22!important;
 margin:5px 0 9px!important;
}
.trip-site .trip-feature .featured-activity-grid p{
 font-size:clamp(12px,.95vw,15px)!important;
 line-height:1.5!important;margin:5px 0 10px!important;
}
/* Ticket display: stacked offset passes with a compact horizontal silhouette. */
.trip-site .trip-ticket-list{padding:clamp(20px,2.6vw,36px)!important}
.trip-site .trip-ticket-list .ticket-grid{
 display:flex!important;flex-direction:column!important;align-items:stretch!important;
 gap:12px!important;padding:0 5%!important;
}
.trip-site .trip-ticket-list .ticket-grid>.scrap-pass{
 width:90%!important;min-height:112px!important;max-height:none!important;
 margin:0!important;grid-template-columns:minmax(0,1fr) 16% 22%!important;
 box-shadow:0 8px 22px #23382e14!important;
}
.trip-site .trip-ticket-list .ticket-grid>.scrap-pass:nth-child(odd){align-self:flex-start!important}
.trip-site .trip-ticket-list .ticket-grid>.scrap-pass:nth-child(even){align-self:flex-end!important}
.trip-site .trip-ticket-list .scrap-pass-main{padding:12px 18px!important;gap:4px!important}
.trip-site .trip-ticket-list .scrap-pass aside{padding:10px 13px!important}
.trip-site .trip-ticket-list .scrap-pass-art{max-height:140px!important}
.trip-site .trip-ticket-list .scrap-pass-watermark{width:86px!important;height:86px!important}
.trip-site .trip-ticket-list .ticket-grid h3{font-size:clamp(17px,1.5vw,23px)!important;line-height:1.25!important}
}
@media(max-width:900px){
.trip-site .trip-feature .featured-activity-grid>*{margin:0!important}
.trip-site .trip-ticket-list .ticket-grid{gap:12px!important}
.trip-site .trip-ticket-list .scrap-pass{min-height:112px!important}
.trip-site .trip-ticket-list .scrap-pass-main{padding:12px 15px!important}
}

/* v8.40.54: moderate size correction after compact v8.40.53.
   Keep stagger and content flow, restore readable card and ticket proportions. */
@media(min-width:901px){
.trip-site .trip-feature.oe-editorial-section>.featured-activity-grid{
 padding:clamp(23px,2.9vw,43px)!important;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(2),
.trip-site .trip-feature .featured-activity-grid>:nth-child(3){
 margin-top:-44px!important;
}
.trip-site .trip-feature .featured-activity-grid>.featured-activity-card,
.trip-site .trip-feature .featured-activity-grid>.scrap-activity{
 grid-template-columns:minmax(0,65%) minmax(0,35%)!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-media,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-photo{
 min-height:265px!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy{
 padding:clamp(21px,2vw,31px)!important;
}
.trip-site .trip-feature .featured-activity-grid h2,
.trip-site .trip-feature .featured-activity-grid h3{
 font-size:clamp(25px,2.45vw,37px)!important;line-height:1.25!important;
 margin:8px 0 13px!important;
}
.trip-site .trip-feature .featured-activity-grid p{
 font-size:clamp(13px,1.12vw,17px)!important;line-height:1.65!important;
 margin:7px 0 12px!important;
}
.trip-site .trip-ticket-list{padding:clamp(24px,3vw,43px)!important}
.trip-site .trip-ticket-list .ticket-grid{gap:18px!important;padding:0 3%!important}
.trip-site .trip-ticket-list .ticket-grid>.scrap-pass{
 width:94%!important;min-height:155px!important;
 grid-template-columns:minmax(0,1fr) 19% 22%!important;
}
.trip-site .trip-ticket-list .scrap-pass-main{padding:19px 23px!important;gap:6px!important}
.trip-site .trip-ticket-list .scrap-pass aside{padding:16px 18px!important}
.trip-site .trip-ticket-list .scrap-pass-art{max-height:180px!important}
.trip-site .trip-ticket-list .scrap-pass-watermark{width:108px!important;height:108px!important}
.trip-site .trip-ticket-list .ticket-grid h3{font-size:clamp(19px,1.7vw,27px)!important}
}
/* Enlarge the venue map's actual display area without cropping uploaded plans. */
.trip-site .trip-map.oe-editorial-section>.trip-map-paper{
 padding:clamp(12px,1.6vw,24px)!important;
}
.trip-site .trip-map-paper .map-static{
 height:clamp(370px,42vw,640px)!important;
 max-height:640px!important;
}
.trip-site .trip-map-paper .map-static img{
 width:100%!important;height:100%!important;object-fit:contain!important;
}
@media(max-width:900px){
.trip-site .trip-feature .featured-activity-grid{gap:20px!important}
.trip-site .trip-ticket-list .scrap-pass{min-height:145px!important}
.trip-site .trip-ticket-list .scrap-pass-main{padding:17px 19px!important}
.trip-site .trip-map.oe-editorial-section>.trip-map-paper{padding:14px!important}
.trip-site .trip-map-paper .map-static{height:clamp(330px,60vw,540px)!important}
}

/* v8.40.55: taller feature cards with safe 3-line copy and top-right action.
   Direct-child anchors stay within each card's right-hand content column. */
@media(min-width:901px){
.trip-site .trip-feature .featured-activity-grid .featured-activity-media,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-photo{
 min-height:330px!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy{
 position:relative!important;align-self:stretch!important;
 display:flex!important;flex-direction:column!important;
 justify-content:center!important;min-height:330px!important;
 padding:65px clamp(24px,2.5vw,38px) 26px!important;
 box-sizing:border-box!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy p,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy p{
 min-height:calc(1.65em * 3)!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy > a,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy > a,
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy .featured-activity-link,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy .featured-activity-link{
 position:absolute!important;top:22px!important;right:clamp(20px,2.4vw,36px)!important;
 bottom:auto!important;left:auto!important;z-index:5!important;
 margin:0!important;width:auto!important;max-width:55%!important;
 font-size:12px!important;white-space:nowrap!important;
 text-decoration:none!important;
}
}

/* v8.40.56: wider feature cards at the SAME height, souvenir-ticket ratio,
   and image-first venue map cover without the extra white letterbox. */
@media(min-width:901px){
.trip-site .trip-feature.oe-editorial-section>.featured-activity-grid{
 padding:clamp(12px,1.8vw,25px)!important;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(1){
 grid-column:1 / 13!important;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(2){
 grid-column:2 / 13!important;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(3){
 grid-column:1 / 13!important;
}
/* Preserve the present visual length and three-line copy area. */
.trip-site .trip-feature .featured-activity-grid .featured-activity-media,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-photo,
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy{
 min-height:330px!important;
}
/* Souvenir pass: less extreme width-to-height aspect, retaining editorial stagger. */
.trip-site .trip-ticket-list .ticket-grid>.scrap-pass{
 min-height:222px!important;width:94%!important;
 grid-template-columns:minmax(0,1fr) 23% 22%!important;
}
.trip-site .trip-ticket-list .scrap-pass-main{
 padding:24px 29px!important;gap:10px!important;
}
.trip-site .trip-ticket-list .scrap-pass aside{padding:20px!important}
.trip-site .trip-ticket-list .scrap-pass-art{max-height:none!important;min-height:0!important}
.trip-site .trip-ticket-list .scrap-pass-watermark{
 width:130px!important;height:130px!important;
}
.trip-site .trip-ticket-list .ticket-grid h3{font-size:clamp(23px,2.05vw,32px)!important}
}
/* Map poster uses the whole white stage. Cover is intentional: slight edge
   crop is preferable to empty horizontal/vertical bars. */
.trip-site .trip-map.oe-editorial-section>.trip-map-paper{
 padding:0!important;
}
.trip-site .trip-map-paper .map-static{
 width:100%!important;height:clamp(370px,42vw,640px)!important;
 max-height:640px!important;background:#e8eeec!important;
 overflow:hidden!important;
}
.trip-site .trip-map-paper .map-static img{
 display:block!important;width:100%!important;height:100%!important;
 object-fit:cover!important;object-position:center!important;
 padding:0!important;margin:0!important;max-width:none!important;
}
@media(max-width:900px){
.trip-site .trip-map.oe-editorial-section>.trip-map-paper{padding:0!important}
.trip-site .trip-map-paper .map-static{height:clamp(330px,60vw,540px)!important}
.trip-site .trip-ticket-list .scrap-pass{min-height:175px!important}
}

/* v8.40.57 — undo mistaken full-width feature cards.
   Restore three staggered magazine widths and increase only their height. */
@media(min-width:901px){
.trip-site .trip-feature .featured-activity-grid>:nth-child(1){
 grid-column:1 / 11!important;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(2){
 grid-column:4 / 13!important;
}
.trip-site .trip-feature .featured-activity-grid>:nth-child(3){
 grid-column:1 / 11!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-media,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-photo,
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy{
 min-height:395px!important;
}
.trip-site .trip-feature .featured-activity-grid .featured-activity-copy,
.trip-site .trip-feature .featured-activity-grid .scrap-activity-copy{
 padding-top:72px!important;
}
/* Keep the admission layout in both editor and preview, including iframe. */
.trip-site .trip-ticket-section .trip-ticket-list .ticket-grid{
 display:flex!important;flex-direction:column!important;
 align-items:stretch!important;gap:20px!important;
}
.trip-site .trip-ticket-section .trip-ticket-list .ticket-grid>.ticket,
.trip-site .trip-ticket-section .trip-ticket-list .ticket-grid>.scrap-pass{
 display:grid!important;box-sizing:border-box!important;
 width:94%!important;min-height:222px!important;height:auto!important;
 grid-template-columns:minmax(0,1fr) 23% 22%!important;
 grid-auto-rows:minmax(222px,auto)!important;
 flex:none!important;align-self:flex-start!important;
}
.trip-site .trip-ticket-section .trip-ticket-list .ticket-grid>:nth-child(even){
 align-self:flex-end!important;
}
.trip-site .trip-ticket-list .scrap-pass-main,
.trip-site .trip-ticket-list .ticket-top{min-height:0!important;align-self:stretch!important}
}
/* Ticket height is independent of edit / preview mode and visible card state. */
.trip-site .trip-ticket-list .ticket-grid>.ticket{
 box-sizing:border-box!important;
 min-height:175px!important;
}
@media(max-width:900px){
.trip-site .trip-ticket-list .ticket-grid>.ticket{
 min-height:175px!important;height:auto!important;
}
}

/* v8.40.60: fully opaque, seam-free KV; do not tint artwork.
   02 uses full-bleed hero exclusively, regardless of stale mode attributes. */
body[data-oe-template="02-scrapbook"] .trip-site .trip-hero{
 border:0!important;outline:0!important;margin:0!important;
 background:transparent!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-hero-visual{
 inset:-1px!important;width:calc(100% + 2px)!important;
 height:calc(100% + 2px)!important;background:transparent!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-hero-visual .kv{
 inset:0!important;width:100%!important;height:100%!important;
 background-image:var(--oe-hero-image-desktop,none)!important;
 background-size:cover!important;background-repeat:no-repeat!important;
 background-position:var(--oe-hero-focal-desktop,center)!important;
 filter:none!important;opacity:1!important;
 border:0!important;outline:0!important;box-shadow:none!important;
 transform:none!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-hero-visual .kv.empty{
 background-image:none!important;background-color:#c7dedc!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-hero-visual .kv.empty .trip-kv-placeholder{
 display:flex!important;position:absolute;inset:0;
 align-items:center;justify-content:center;flex-direction:column;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-hero:before,
body[data-oe-template="02-scrapbook"] .trip-site .trip-hero:after{display:none!important}
.trip-site .trip-event-fact .venue-nav{
 display:inline-flex!important;align-items:center;gap:5px;
 color:inherit!important;text-decoration:none!important;
 cursor:pointer!important;min-width:0;
}
.trip-site .trip-event-fact .venue-nav:hover{text-decoration:underline!important;text-underline-offset:3px}
.trip-site .trip-event-fact .venue-nav strong{color:inherit;font:inherit;overflow-wrap:anywhere}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"] .trip-site .trip-hero-visual .kv{
 background-image:var(--oe-hero-image-mobile,var(--oe-hero-image-desktop,none))!important;
 background-position:var(--oe-hero-focal-mobile,center)!important;
}
}

/* v8.40.61: Router visibility must win over legacy full-screen home styling.
   Without this, the 100svh hero survives page switches and covers inner pages. */
body[data-oe-template="02-scrapbook"] .trip-site .oe-page-hidden,
body[data-oe-template="02-scrapbook"] .trip-site .oe-module-off,
body[data-oe-template="02-scrapbook"] .trip-site .trip-hero.oe-page-hidden,
body[data-oe-template="02-scrapbook"] .trip-site .trip-page.oe-page-hidden,
body[data-oe-template="02-scrapbook"] .trip-site .oe-home-only.oe-page-hidden{
 display:none!important;visibility:hidden!important;
}
body[data-oe-template="02-scrapbook"][data-oe-current-page="booths"] .trip-site #booths,
body[data-oe-template="02-scrapbook"][data-oe-current-page="activities"] .trip-site #activities,
body[data-oe-template="02-scrapbook"][data-oe-current-page="guests"] .trip-site #guests,
body[data-oe-template="02-scrapbook"][data-oe-current-page="guide"] .trip-site #guide{
 display:block!important;visibility:visible!important;
}

/* v8.40.62: ID selectors on editorial homepage sections previously beat
   .oe-page-hidden even with !important. Enforce router state at ID specificity. */
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site #event-introduction,
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site #updates,
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site #participation,
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site #tickets,
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site #map-home,
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-index,
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-event-facts,
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-route-ticker,
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-hero{
 display:none!important;visibility:hidden!important;
}
/* Never let dormant page descendants bleed into the active route. */
body[data-oe-template="02-scrapbook"] .trip-site #booths.oe-page-hidden,
body[data-oe-template="02-scrapbook"] .trip-site #activities.oe-page-hidden,
body[data-oe-template="02-scrapbook"] .trip-site #guests.oe-page-hidden,
body[data-oe-template="02-scrapbook"] .trip-site #guide.oe-page-hidden{
 display:none!important;
}

/* v8.40.63: horizontal inner-page navigation and readable product cards.
   Scoped to Template 02 inner pages; homepage hero/navigation remain unchanged. */
@media(min-width:901px){
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-header{
 position:relative!important;inset:auto!important;width:100%!important;
 height:auto!important;min-height:84px!important;
 display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;
 align-items:center!important;justify-content:space-between!important;
 padding:12px clamp(22px,3vw,52px)!important;gap:20px!important;
 background:#293341!important;box-sizing:border-box!important;
}
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-logo{
 position:static!important;inset:auto!important;display:flex!important;
 flex-direction:column!important;align-items:flex-start!important;
 margin:0!important;padding:0!important;max-width:42%!important;
 color:#fff!important;white-space:normal!important;
}
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-nav{
 position:static!important;inset:auto!important;z-index:auto!important;
 display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;
 width:auto!important;max-width:none!important;height:auto!important;
 align-items:center!important;justify-content:flex-end!important;
 gap:clamp(15px,2vw,35px)!important;margin:0!important;padding:0!important;
 overflow:visible!important;background:transparent!important;
}
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-nav a{
 display:flex!important;flex-direction:column!important;align-items:flex-start!important;
 min-width:0!important;width:auto!important;padding:6px 0!important;
 margin:0!important;color:#fff!important;white-space:nowrap!important;
}
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-page,
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .custom-page-view{
 margin-left:0!important;max-width:100%!important;width:100%!important;
 box-sizing:border-box!important;
}
}
/* Cards need real room for information, not four squeezed columns. */
body[data-oe-template="02-scrapbook"] #booths .product-directory-grid{
 display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr))!important;
 gap:20px!important;align-items:stretch!important;
}
body[data-oe-template="02-scrapbook"] #booths .scrap-product{
 display:grid!important;grid-template-columns:clamp(115px,12vw,160px) minmax(0,1fr)!important;
 column-gap:20px!important;align-items:start!important;
 width:100%!important;min-width:0!important;height:auto!important;
 box-sizing:border-box!important;padding:20px 22px 20px 28px!important;
 background:#fffdf8!important;
}
body[data-oe-template="02-scrapbook"] #booths .scrap-product .directory-product-image{
 width:100%!important;max-width:160px!important;min-width:0!important;
 aspect-ratio:1!important;
}
body[data-oe-template="02-scrapbook"] #booths .scrap-product>div,
body[data-oe-template="02-scrapbook"] #booths .scrap-product>section{
 min-width:0!important;max-width:100%!important;
}
body[data-oe-template="02-scrapbook"] #booths .scrap-product b,
body[data-oe-template="02-scrapbook"] #booths .scrap-product h3{
 overflow-wrap:break-word!important;word-break:normal!important;
 line-height:1.3!important;
}
body[data-oe-template="02-scrapbook"] #booths .scrap-product footer{
 display:flex!important;flex-wrap:wrap!important;justify-content:flex-start!important;
 align-items:center!important;gap:12px!important;
}
body[data-oe-template="02-scrapbook"] #booths .scrap-product footer button{
 flex-shrink:0!important;white-space:nowrap!important;
}
@media(max-width:700px){
body[data-oe-template="02-scrapbook"] #booths .product-directory-grid{grid-template-columns:1fr!important}
body[data-oe-template="02-scrapbook"] #booths .scrap-product{
 grid-template-columns:minmax(92px,32%) minmax(0,1fr)!important;
 padding:14px 14px 14px 21px!important;gap:12px!important;
}
}

/* v8.40.64: guest carousel immediately after homepage venue map. */
.trip-site #home-guests{display:grid!important;grid-template-columns:minmax(250px,27%) minmax(0,1fr)!important;gap:0!important;background:#e9f1ef!important;min-height:0!important}
.trip-site #home-guests>.oe-editorial-rail{padding:clamp(34px,4vw,66px) clamp(24px,3vw,48px)!important;background:#c9fb62!important;min-width:0!important}
.trip-site #home-guests>.oe-editorial-rail h2{font:850 clamp(36px,3.3vw,58px)/1.12 "Microsoft YaHei",sans-serif!important;margin:14px 0!important}
.trip-site #home-guests>.oe-editorial-rail h2 small{display:block;font:800 17px/1.5 Arial,sans-serif!important;margin-top:12px}
.trip-site #home-guests>.trip-guest-carousel{min-width:0!important;padding:clamp(20px,3vw,42px)!important;box-sizing:border-box!important}
.trip-site #home-guests .guest-grid{display:flex!important;gap:24px!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important;padding-bottom:15px!important}
.trip-site #home-guests .scrap-guest{flex:0 0 min(75vw,470px)!important;scroll-snap-align:start!important;display:flex!important;gap:0!important;background:#fff!important;min-width:0!important}
.trip-site #home-guests .scrap-polaroid{width:44%!important;flex-shrink:0!important;transform:none!important;padding:12px!important}
.trip-site #home-guests .scrap-guest-note{flex:1!important;min-width:0!important;padding:22px!important}
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site #home-guests{display:none!important}
body[data-oe-template="02-scrapbook"] .trip-site #home-guests.oe-page-hidden{display:none!important}
body[data-oe-template="02-scrapbook"] #booths [data-directory-grid][hidden],
body[data-oe-template="02-scrapbook"] #booths [data-directory-context][hidden],
body[data-oe-template="02-scrapbook"] #booths .booth-no-result[hidden]{display:none!important}
@media(max-width:900px){.trip-site #home-guests{grid-template-columns:1fr!important}.trip-site #home-guests .scrap-guest{flex-basis:min(86vw,380px)!important;flex-direction:column!important}.trip-site #home-guests .scrap-polaroid{width:100%!important}}

/* v8.40.65: close editorial rail top gap, hide guest track scrollbar. */
@media(min-width:901px){
.trip-site .trip-feature.oe-editorial-section{align-items:stretch!important}
.trip-site .trip-feature.oe-editorial-section>header{
 align-self:stretch!important;min-height:100%!important;
 margin:0!important;top:0!important;bottom:0!important;
 box-sizing:border-box!important;background:#c9fb62!important;
}
}
.trip-site #home-guests .trip-guest-carousel,
.trip-site #home-guests .guest-grid{
 scrollbar-width:none!important;-ms-overflow-style:none!important;
}
.trip-site #home-guests .trip-guest-carousel::-webkit-scrollbar,
.trip-site #home-guests .guest-grid::-webkit-scrollbar{
 display:none!important;width:0!important;height:0!important;
}
.trip-site #home-guests .guest-grid{padding-bottom:0!important}

/* v8.40.66: consistent inner-page return, no duplicated masthead or giant route banners. */
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-header,
body[data-oe-template="02-scrapbook"][data-oe-current-page]:not([data-oe-current-page="home"]) .trip-site .trip-mobile-nav{display:none!important}
body[data-oe-template="02-scrapbook"] .trip-site .trip-page:not(.oe-page-hidden),
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view:not(.oe-page-hidden){
 margin:0!important;max-width:100%!important;width:100%!important;
 min-height:70vh!important;padding:clamp(20px,2.6vw,38px) clamp(20px,3.8vw,60px) 80px!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-page:not(.oe-page-hidden)>.trip-page-head{
 display:flex!important;justify-content:flex-end!important;align-items:center!important;
 margin:0 0 24px!important;padding:0!important;min-height:38px!important;
 border:0!important;max-width:none!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-page-head>span,
body[data-oe-template="02-scrapbook"] .trip-site .trip-page-head>h2,
body[data-oe-template="02-scrapbook"] .trip-site .trip-page:before{display:none!important;content:none!important}
body[data-oe-template="02-scrapbook"] .trip-site .trip-page-head .section-back{
 display:inline-flex!important;align-items:center!important;justify-content:center!important;
 position:static!important;margin:0!important;padding:10px 16px!important;
 border:1px solid #9aa9a9!important;border-radius:0!important;
 background:#fff!important;color:#293946!important;
 font:750 13px/1.4 "Microsoft YaHei",sans-serif!important;text-decoration:none!important;
}
/* No large unused space below sparse booth details. */
body[data-oe-template="02-scrapbook"] #booths .scrap-booth{
 min-height:0!important;height:auto!important;
 padding-top:clamp(14px,2vw,22px)!important;
 padding-bottom:clamp(14px,2vw,22px)!important;
 align-content:start!important;
}
body[data-oe-template="02-scrapbook"] #booths .scrap-booth footer{margin-top:12px!important}
body[data-oe-template="02-scrapbook"] #booths .booth-directory-grid{align-items:start!important}
/* Guests inherit venue-map title rail typography and placement. */
body[data-oe-template="02-scrapbook"] .trip-site #home-guests>.oe-editorial-rail{
 background:#dcebf1!important;padding:clamp(34px,4vw,66px) clamp(24px,3vw,48px)!important;
 display:flex!important;flex-direction:column!important;align-items:flex-start!important;
 justify-content:flex-start!important;box-sizing:border-box!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #home-guests>.oe-editorial-rail>span{
 font:800 clamp(11px,.85vw,14px)/1.5 "Courier New",monospace!important;
 letter-spacing:.08em!important;margin:0 0 clamp(21px,2.8vw,44px)!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #home-guests>.oe-editorial-rail h2{
 font:850 clamp(37px,3.3vw,58px)/1.13 "Microsoft YaHei","PingFang SC",sans-serif!important;
 margin:0!important;letter-spacing:0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #home-guests>.oe-editorial-rail h2 small{
 display:block!important;font:850 clamp(17px,1.4vw,24px)/1.25 Arial,sans-serif!important;
 letter-spacing:0!important;margin-top:13px!important;
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"] .trip-site #home-guests>.oe-editorial-rail{padding:32px 22px!important}
}

/* v8.40.67: keep full-size inner page headings, only remove dark masthead. */
body[data-oe-template="02-scrapbook"] .trip-site .trip-page:not(.oe-page-hidden)>.trip-page-head{
 display:grid!important;
 grid-template-columns:minmax(0,1fr) auto!important;
 align-items:end!important;justify-content:stretch!important;
 gap:12px 24px!important;
 padding:0 0 24px!important;margin:0 0 30px!important;
 min-height:0!important;border-bottom:1px solid #aebfc0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-page-head>span{
 display:block!important;content:normal!important;
 grid-column:1 / -1!important;
 font:800 12px/1.5 "Courier New",monospace!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-page-head>h2{
 display:block!important;content:normal!important;
 grid-column:1!important;
 font:900 clamp(45px,6vw,100px)/.95 Arial,"Microsoft YaHei",sans-serif!important;
 margin:0!important;letter-spacing:-.065em!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-page-head .section-back{
 grid-column:2!important;align-self:end!important;
}
/* Media/cards must size to actual poster, not preserve stale stretched tracks. */
body[data-oe-template="02-scrapbook"] #activities .activity-project-list{
 align-items:start!important;grid-auto-rows:auto!important;
}
body[data-oe-template="02-scrapbook"] #activities .activity-project-list .scrap-activity,
body[data-oe-template="02-scrapbook"] #activities .activity-project-list .activity-feature{
 min-height:0!important;height:auto!important;
 align-self:start!important;align-content:start!important;
}
body[data-oe-template="02-scrapbook"] #activities .activity-project-list .scrap-activity-photo,
body[data-oe-template="02-scrapbook"] #activities .activity-project-list .activity-feature-media{
 max-height:440px!important;
}
body[data-oe-template="02-scrapbook"] #activities .activity-project-list .scrap-activity-note,
body[data-oe-template="02-scrapbook"] #activities .activity-project-list .activity-feature-copy{
 min-height:0!important;height:auto!important;flex:0 1 auto!important;
 padding-bottom:0!important;
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"] .trip-site .trip-page-head>h2{font-size:clamp(34px,9vw,62px)!important}
}

/* v8.40.68: separate guest event links, center guest portraits, 2-column activity details. */
body[data-oe-template="02-scrapbook"] #home-guests .guest-related-note{
 display:block!important;margin-top:18px!important;
 padding-top:15px!important;border-top:1px solid #c6d4d1!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .guest-related-links{
 display:grid!important;grid-template-columns:minmax(0,1fr)!important;
 gap:12px!important;margin-top:12px!important;min-width:0!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .guest-related-links>a{
 display:block!important;width:100%!important;min-width:0!important;
 box-sizing:border-box!important;padding:14px 16px!important;
 margin:0!important;border:1px solid #ccd6d5!important;border-radius:12px!important;
 background:#f7f9f7!important;color:#293946!important;
 text-decoration:none!important;line-height:1.5!important;
 overflow-wrap:anywhere!important;white-space:normal!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .guest-related-links>a:hover{
 background:#ebf5f1!important;border-color:#869f9b!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid{
 display:flex!important;flex-direction:column!important;justify-content:center!important;
 align-items:center!important;position:relative!important;
 padding:22px 16px!important;box-sizing:border-box!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid .guest-image{
 width:100%!important;min-width:0!important;max-width:100%!important;
 margin:auto!important;aspect-ratio:4/5!important;
 flex:0 0 auto!important;overflow:hidden!important;border-radius:18px!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid>span{
 position:absolute!important;bottom:5px!important;left:16px!important;
 margin:0!important;font-size:9px!important;
}
@media(min-width:901px){
body[data-oe-template="02-scrapbook"] #activities .activity-project-list{
 display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
 gap:22px!important;align-items:start!important;
 border:0!important;
}
body[data-oe-template="02-scrapbook"] #activities .activity-project-list>.activity-feature,
body[data-oe-template="02-scrapbook"] #activities .activity-project-list>.scrap-activity{
 min-width:0!important;width:100%!important;height:auto!important;
 box-sizing:border-box!important;border:1px solid #c2c8c8!important;
 align-self:start!important;
}
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"] #activities .activity-project-list{
 grid-template-columns:minmax(0,1fr)!important;gap:16px!important;
}
}

/* v8.40.69: the legacy ::before label was a real CSS grid item and
   shifted the first two activity cards into staggered positions. */
body[data-oe-template="02-scrapbook"] #activities .activity-project-list::before{
 content:none!important;display:none!important;
}
@media(min-width:901px){
body[data-oe-template="02-scrapbook"] #activities .activity-project-list{
 grid-template-columns:repeat(2,minmax(0,1fr))!important;
 grid-auto-flow:row!important;align-items:start!important;
}
body[data-oe-template="02-scrapbook"] #activities .activity-project-list>.activity-feature{
 grid-column:auto!important;grid-row:auto!important;
 margin-top:0!important;transform:none!important;
}
}

/* v8.40.70: compact related-event pills and restrained guest KV proportions. */
body[data-oe-template="02-scrapbook"] #home-guests .guest-related-note{
 margin-top:15px!important;padding-top:12px!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .guest-related-links{
 display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;
 align-items:center!important;justify-content:flex-start!important;
 gap:9px!important;margin-top:10px!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .guest-related-links>a{
 display:inline-flex!important;align-items:center!important;justify-content:center!important;
 width:auto!important;max-width:100%!important;min-width:0!important;
 padding:8px 14px!important;margin:0!important;
 border:1px solid #d3d7d6!important;border-radius:999px!important;
 background:#fff!important;box-shadow:none!important;
 color:#293946!important;font:750 12px/1.4 "Microsoft YaHei",sans-serif!important;
 text-decoration:none!important;white-space:normal!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid{
 justify-content:center!important;align-items:center!important;
 padding:16px!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid .guest-image{
 width:100%!important;max-width:100%!important;max-height:310px!important;
 aspect-ratio:3/4!important;margin:auto!important;
 border-radius:12px!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid .guest-image img{
 width:100%!important;height:100%!important;object-fit:cover!important;
}

/* v8.40.71: restore pre-move guest polaroid proportions and frame.
   Widen the whole editorial card rather than shrinking the portrait. */
@media(min-width:901px){
body[data-oe-template="02-scrapbook"] #home-guests .scrap-guest{
 flex:0 0 min(94%,840px)!important;min-height:0!important;
 align-items:stretch!important;background:#eaf0ed!important;
 border:1px solid #90aaa9!important;box-sizing:border-box!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid{
 width:43%!important;flex:0 0 43%!important;
}
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid{
 background:#dbe8e5!important;box-shadow:none!important;
 padding:24px 18px 42px!important;position:relative!important;
 display:flex!important;flex-direction:column!important;
 justify-content:center!important;align-items:center!important;
 box-sizing:border-box!important;transform:none!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid .guest-image{
 width:100%!important;max-width:none!important;max-height:none!important;
 height:auto!important;aspect-ratio:3/4!important;
 flex:none!important;margin:0!important;border-radius:18px!important;
 background:#f4f1f3!important;overflow:hidden!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid>span{
 position:absolute!important;left:18px!important;bottom:13px!important;
 margin:0!important;font:800 10px/1.4 Georgia,serif!important;
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"] #home-guests .scrap-guest{
 flex-basis:min(88vw,560px)!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid{
 width:100%!important;flex-basis:auto!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid .guest-image{
 max-width:360px!important;
}
}

/* v8.40.74: constrain guest personal-platform logos and remove leftover floating ornament. */
body[data-oe-template="02-scrapbook"] #home-guests .guest-platform-list{
 display:flex!important;flex-wrap:wrap!important;gap:8px 12px!important;
 align-items:center!important;min-width:0!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .guest-platform-list>a{
 display:inline-flex!important;align-items:center!important;gap:7px!important;
 width:auto!important;max-width:100%!important;min-width:0!important;
 padding:7px 10px!important;text-decoration:none!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .guest-platform-logo{
 display:block!important;width:22px!important;height:22px!important;
 min-width:22px!important;max-width:22px!important;
 min-height:22px!important;max-height:22px!important;
 object-fit:contain!important;flex:0 0 22px!important;
 border-radius:0!important;position:static!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .guest-platform-list>a span{
 font-size:13px!important;line-height:1.4!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .trip-page::after{
 content:none!important;display:none!important;
}

/* v8.40.76: sponsor identity wall, not oversized product cards. */
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsors{
 display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;
 gap:14px!important;background:transparent!important;
}
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsor-card{
 display:flex!important;flex-direction:column!important;align-items:center!important;
 justify-content:center!important;gap:10px!important;
 box-sizing:border-box!important;min-width:0!important;min-height:145px!important;
 height:auto!important;padding:20px 14px!important;
 border:1px solid #ffffff26!important;border-radius:14px!important;
 background:#fff!important;box-shadow:none!important;
}
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsor-logo{
 display:flex!important;align-items:center!important;justify-content:center!important;
 width:100%!important;max-width:190px!important;height:82px!important;
 max-height:82px!important;padding:0!important;margin:0!important;
 border:0!important;background:transparent!important;flex:none!important;
}
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsor-logo img,
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsor-card img{
 display:block!important;width:auto!important;max-width:100%!important;
 height:auto!important;max-height:82px!important;object-fit:contain!important;
 padding:0!important;margin:auto!important;
}
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsor-card b{
 color:#293946!important;font:650 13px/1.35 "Microsoft YaHei",sans-serif!important;
 margin:0!important;text-align:center!important;
}
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsor-card small{
 color:#69777e!important;font-size:11px!important;text-align:center!important;
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsors{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
@media(max-width:430px){
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsor-card{min-height:122px!important;padding:14px 8px!important}
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsor-logo{height:65px!important}
body[data-oe-template="02-scrapbook"] .trip-sponsors .sponsor-logo img{max-height:65px!important}
}

/* v8.40.77: guests section uses a warm editorial palette, visibly distinct
   from the cool blue venue map. Guest cards keep their own framing. */
body[data-oe-template="02-scrapbook"] .trip-site #home-guests{
 background:#f2f0ff!important;
 border-top:1px solid #d4cdec!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #home-guests>.oe-editorial-rail{
 background:#ddd5ff!important;color:#293946!important;
 border-right:1px solid #c5b9f2!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #home-guests>.trip-guest-carousel{
 background:#f2f0ff!important;
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"] .trip-site #home-guests>.oe-editorial-rail{
 border-right:0!important;border-bottom:1px solid #c5b9f2!important;
}
}

/* v8.40.79: lavender admission-ticket inspired two-tone guest card.
   Keep the established geometry and portrait crop unchanged. */
body[data-oe-template="02-scrapbook"] #home-guests .scrap-guest{
 background:#f9f7ff!important;border:1px solid #bcb1df!important;
 box-shadow:0 8px 22px rgba(94,79,146,.075)!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid{
 background:#e3dcf8!important;
 border-right:1px solid #c8bde5!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-guest-note{
 background:#f9f7ff!important;color:#293946!important;
}
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid>span{
 color:#514973!important;
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"] #home-guests .scrap-polaroid{
 border-right:0!important;border-bottom:1px solid #c8bde5!important;
}
}

/* v8.40.80: custom first-level pages share the regular BOOTH/EVENT/GUIDE masthead.
   Scope strictly to Template 02; preserve custom content layout choices. */
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view:not(.oe-page-hidden){
 background:var(--trip-bg,#f7f7f2)!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view:not(.oe-page-hidden)>.wrap{
 width:100%!important;max-width:none!important;
 margin:0!important;padding:0!important;box-sizing:border-box!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .head{
 display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;
 align-items:end!important;gap:12px 24px!important;
 padding:0 0 24px!important;margin:0 0 30px!important;
 min-height:0!important;max-width:none!important;
 border:0!important;border-bottom:1px solid #aebfc0!important;
 background:transparent!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .head>div{
 min-width:0!important;display:contents!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .head .ey{
 display:block!important;grid-column:1 / -1!important;
 font:800 12px/1.5 "Courier New",monospace!important;
 color:#e46b73!important;letter-spacing:.15em!important;
 margin:0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .head h2{
 display:block!important;grid-column:1!important;
 font:900 clamp(45px,6vw,100px)/.95 Arial,"Microsoft YaHei",sans-serif!important;
 color:#293342!important;letter-spacing:-.065em!important;
 margin:0!important;padding:0!important;text-transform:uppercase!important;
 overflow-wrap:anywhere!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .head .section-back{
 display:inline-flex!important;grid-column:2!important;
 align-self:end!important;align-items:center!important;justify-content:center!important;
 position:static!important;margin:0!important;padding:10px 16px!important;
 border:1px solid #9aa9a9!important;border-radius:0!important;
 background:#fff!important;color:#293946!important;
 text-decoration:none!important;
 font:750 13px/1.4 "Microsoft YaHei",sans-serif!important;
 white-space:nowrap!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-intro{
 margin:0 0 30px!important;max-width:1100px!important;
 color:#4b5960!important;line-height:1.8!important;
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .head h2{
 font-size:clamp(34px,9vw,62px)!important;
}
}

/* v8.40.81: one visual system for all Template 02 first-level pages.
   Override older page-specific and generic custom-page backgrounds. */
body[data-oe-template="02-scrapbook"] .trip-site :is(#booths,#activities,#guide,.custom-page-view).oe-page-view:not(.oe-page-hidden){
 --oe-page-surface:#f8f8f1;
 --oe-page-ink:#293342;
 --oe-page-divider:#aebfc0;
 background:var(--oe-page-surface)!important;color:var(--oe-page-ink)!important;
 box-shadow:none!important;border:0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site :is(#booths,#activities,#guide,.custom-page-view).oe-page-view:not(.oe-page-hidden) :is(.trip-page-head,.head){
 border-bottom:1px solid #aebfc0!important;background:transparent!important;
}
body[data-oe-template="02-scrapbook"] .trip-site :is(#booths,#activities,#guide,.custom-page-view).oe-page-view:not(.oe-page-hidden) :is(.trip-page-head h2,.head h2){
 color:#293342!important;text-transform:none!important;
 font-family:Arial,"Microsoft YaHei","PingFang SC",sans-serif!important;
 font-weight:900!important;line-height:1.1!important;
 letter-spacing:-.04em!important;
}
body[data-oe-template="02-scrapbook"] .trip-site :is(#booths,#activities,#guide,.custom-page-view).oe-page-view:not(.oe-page-hidden) :is(.trip-page-head>span,.head .ey){
 color:#e46b73!important;
}
body[data-oe-template="02-scrapbook"] .trip-site :is(#booths,#activities,#guide,.custom-page-view).oe-page-view:not(.oe-page-hidden) .section-back{
 border:1px solid #9aa9a9!important;background:#fff!important;
 color:#293946!important;border-radius:0!important;
}

/* v8.40.83: activity tabs are controls, not a second framed page header.
   Remove both redundant separator lines; preserve the single title divider. */
body[data-oe-template="02-scrapbook"] .trip-site #activities .trip-activity-switch{
 border:0!important;border-top:0!important;border-bottom:0!important;
 box-shadow:none!important;
 padding:0!important;margin:0 0 28px!important;min-height:0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #activities .activity-view-tabs{
 border:0!important;box-shadow:none!important;
}
/* Custom templates keep their individual content layouts, but share precisely
   the same section canvas, title-divider spacing and return control as inner pages. */
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view.oe-page-view:not(.oe-page-hidden){
 background:#f8f8f1!important;color:#293342!important;
 padding:clamp(20px,2.6vw,38px) clamp(20px,3.8vw,60px) 80px!important;
 width:100%!important;max-width:100%!important;margin:0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .head{
 margin-bottom:30px!important;padding-bottom:24px!important;
 border-bottom:1px solid #aebfc0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-grid,
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-intro{
 max-width:none!important;width:100%!important;box-sizing:border-box!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .head .section-back{
 border:1px solid #9aa9a9!important;border-radius:0!important;
 background:#fff!important;color:#293946!important;
}

/* v8.40.84 — single Template 02 first-level page visual language.
   Hide duplicate prose and legacy pseudo-headings without deleting editable data. */
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-intro,
body[data-oe-template="02-scrapbook"] .trip-site #guide .guide-detail-grid::before,
body[data-oe-template="02-scrapbook"] .trip-site #booths .booth-directory-rich::before,
body[data-oe-template="02-scrapbook"] .trip-site #activities .activity-detail-list::before,
body[data-oe-template="02-scrapbook"] .trip-site #activities .activity-project-list::before{
 content:none!important;display:none!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .head::before,
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .head::after,
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-grid::before,
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-grid::after{
 content:none!important;display:none!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view.oe-page-view:not(.oe-page-hidden)>.wrap{
 background:transparent!important;border:0!important;box-shadow:none!important;
}
/* All custom content presets share the neutral page's card surfaces.
   Grid layout variants (gallery/product/reading/activity/etc.) stay intact. */
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-grid{
 background:transparent!important;color:#293342!important;
 border:0!important;box-shadow:none!important;
 gap:clamp(16px,2vw,26px)!important;
 padding:0!important;margin:0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-card{
 background:#fffefa!important;color:#293342!important;
 border:1px solid #c9d2cf!important;border-radius:0!important;
 box-shadow:none!important;transform:none!important;
 min-width:0!important;box-sizing:border-box!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-card::before,
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-card::after{
 content:none!important;display:none!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-card-copy{
 background:transparent!important;color:#293342!important;
 padding:clamp(16px,2vw,26px)!important;min-width:0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-card-copy>b{
 color:#293342!important;font-family:Arial,"Microsoft YaHei","PingFang SC",sans-serif!important;
 font-weight:800!important;line-height:1.25!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-card-copy p,
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-meta{
 color:#56636a!important;line-height:1.65!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-image{
 background:#e6eeeb!important;border:0!important;border-radius:0!important;
 overflow:hidden!important;box-shadow:none!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-image img{
 width:100%!important;height:100%!important;object-fit:cover!important;
}
body[data-oe-template="02-scrapbook"] .trip-site .custom-page-view .custom-page-action{
 color:#293342!important;background:transparent!important;
 border:0!important;border-bottom:1px solid currentColor!important;border-radius:0!important;
 box-shadow:none!important;
}

/* v8.40.85: guide page follows the same clean inner-page visual system.
   Detail mount has an extra .guide-detail-content wrapper; constrain that
   wrapper, not only its parent. Remove old decorative pseudo-labels. */
body[data-oe-template="02-scrapbook"] .trip-site #guide .guide-detail-grid,
body[data-oe-template="02-scrapbook"] .trip-site #guide .guide-detail-content{
 display:grid!important;grid-template-columns:minmax(0,1fr)!important;
 gap:22px!important;width:100%!important;max-width:none!important;
 margin:0!important;padding:0!important;min-width:0!important;
 border:0!important;background:transparent!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #guide .guide-detail-content::before,
body[data-oe-template="02-scrapbook"] .trip-site #guide .guide-detail-grid::before,
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide::before,
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide::after{
 display:none!important;content:none!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide{
 display:grid!important;grid-template-columns:84px minmax(0,1fr)!important;
 column-gap:clamp(18px,2.5vw,40px)!important;row-gap:20px!important;
 align-items:start!important;min-width:0!important;
 padding:clamp(20px,3vw,42px)!important;
 background:#fffefa!important;border:1px solid #c9d2cf!important;
 border-radius:0!important;box-shadow:none!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide>span{
 grid-column:1!important;color:#73868b!important;
 font:800 12px/1.5 monospace!important;letter-spacing:.09em!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide>div{
 grid-column:2!important;min-width:0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide h3{
 margin:8px 0 18px!important;color:#293342!important;
 font:800 clamp(26px,2.6vw,42px)/1.3 "Microsoft YaHei","PingFang SC",sans-serif!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide p{
 margin:0 0 16px!important;color:#48515a!important;
 font:400 clamp(14px,1.05vw,17px)/1.85 "Microsoft YaHei","PingFang SC",sans-serif!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide>.guide-access-media{
 grid-column:2!important;display:block!important;box-sizing:border-box!important;
 width:100%!important;min-width:0!important;max-width:100%!important;
 height:auto!important;min-height:220px!important;
 padding:0!important;margin:0!important;overflow:hidden!important;
 aspect-ratio:16/9!important;background:#e6eeeb!important;
 border:0!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide>.guide-access-media img{
 display:block!important;width:100%!important;height:100%!important;
 max-width:none!important;min-height:0!important;aspect-ratio:auto!important;
 object-fit:contain!important;
}
@media(max-width:900px){
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide{
 grid-template-columns:minmax(0,1fr)!important;padding:20px 17px!important;gap:12px!important;
}
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide>span,
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide>div,
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide>.guide-access-media{
 grid-column:1!important;
}
}

/* v8.40.86: preserve organizer-authored line breaks in visitor guide text. */
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide p[data-oe-field],
body[data-oe-template="02-scrapbook"] .trip-site #guide .scrap-guide p{
 white-space:pre-wrap!important;
 overflow-wrap:anywhere!important;
 word-break:normal!important;
}
/* QA: remove legacy header spacing reserved for the eliminated LINK headline. */
.trip-site .trip-community>header{justify-content:flex-start!important}
.trip-site .trip-community>header h2{display:none!important}
/* Existing scroll observer owns enter animations. Never cover a card's
   specialized animation with a parent-level blanket keyframe. */
@media(prefers-reduced-motion:no-preference){
.trip-site .trip-community .scrap-social{animation-fill-mode:both!important}
}
`;
