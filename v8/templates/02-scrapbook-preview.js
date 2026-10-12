/* Template 02 — Travel / cassette / tourism website shell.
   Built reference-first. Shared Core mounts are intentionally embedded into
   this independent shell instead of inheriting Template 01 page composition. */

export const previewBody=`
<div class="loader scrap-entry" id="loader">
  <div class="gate scrap-entry-gate" role="button" tabindex="0" aria-label="点击进入活动网站">
    <section class="scrap-entry-photo ticket-half left"><div class="entry-photo" aria-label="活动KV"></div></section>
    <aside class="scrap-entry-info ticket-half right">
      <div class="entry-ticket-label">SPECIAL JOURNEY</div>
      <div class="entry-ticket-title">STARDUST ONLY 2026</div>
      <div class="entry-ticket-subtitle"></div>
      <div class="entry-ticket-meta">
        <div class="entry-ticket-date-wrap"><span>DATE</span><b class="entry-ticket-date">2026.11.08</b></div>
        <div class="entry-ticket-time-wrap"><span>TIME</span><b class="entry-ticket-time"></b></div>
        <div class="entry-ticket-location-wrap"><span>DESTINATION</span><b class="entry-ticket-location">杭州</b></div>
      </div>
      <div class="stub-barcode" aria-hidden="true"></div>
      <div class="stub-code"><span class="entry-serial stub-number">NO. 048271</span></div>
    </aside>
  </div>
  <button class="skip" id="skip">SKIP →</button>
</div>

<div class="trip-site">
  <header class="trip-header">
    <a class="trip-logo" href="#home" data-page-link="home">
      <small>ONLY EVENT / JOURNEY</small>
      <b>STARDUST<br>ONLY</b>
    </a>
    <div class="trip-flight-info">
      <span>OE 2026</span><i></i><span>11.08 SUN</span><i></i><span>HANGZHOU</span>
    </div>
    <nav class="trip-nav" data-oe-mount="nav-links">
      <a href="#booths" data-target-mode="page" data-page-link="booths"><small>01</small>BOOTH</a>
      <a href="#activities" data-target-mode="page" data-page-link="activities"><small>02</small>EVENT</a>
      <a href="#guests" data-target-mode="page" data-page-link="guests"><small>03</small>GUEST</a>
      <a href="#guide" data-target-mode="page" data-page-link="guide"><small>04</small>GUIDE</a>
    </nav>
    <a class="trip-ticket ticket-purchase-link" data-ticket-settings href="#" target="_blank" rel="noopener">TICKET ↗</a>
  </header>

  <nav class="trip-mobile-nav" data-oe-mount="mobile-nav">
    <a href="#home" data-page-link="home"><small>00</small>HOME</a>
    <a href="#booths" data-target-mode="page" data-page-link="booths"><small>01</small>BOOTH</a>
    <a href="#activities" data-target-mode="page" data-page-link="activities"><small>02</small>EVENT</a>
    <a href="#guests" data-target-mode="page" data-page-link="guests"><small>03</small>GUEST</a>
    <a href="#guide" data-target-mode="page" data-page-link="guide"><small>04</small>GUIDE</a>
  </nav>

  <main id="top">
    <section class="trip-hero oe-home-only" id="home">
      <div class="trip-hero-visual">
        <div class="kv"></div>
        <div class="trip-photo-caption"><span>PHOTO / 001</span><b>A SIDE — THE GOOD MEMORIES</b></div>
      </div>
      <div class="trip-hero-copy hero-copy">
        <div class="trip-route">OE / JOURNEY 01 / 2026</div>
        <h1><span class="hero-title-line hero-title-1">STAR</span><br><em class="hero-title-line hero-title-2">BEAT</em><br><span class="hero-title-line hero-title-3">ONLY</span></h1>
        <p data-oe-field="tagline">围绕单一作品 IP 的粉丝综合活动。一起把这一天变成值得留下的旅行记忆。</p>
        <div class="trip-hero-meta">
          <span data-oe-field="date">11.08 SUN</span>
          <span data-oe-field="location">杭州</span>
          <a class="venue-nav" href="#" target="_blank" rel="noopener" data-oe-field="venueName">杭州国际博览中心</a>
        </div>
        <div class="trip-stamp">BOARDING<br><b>NOW</b></div>
      </div>
      <div class="trip-weather-strip">
        <span><b>DATE</b>11.08 SUN</span>
        <span><b>TIME</b>10:00 — 17:00</span>
        <span><b>WEATHER</b>17.4℃ ☀</span>
        <span><b>DESTINATION</b>HANGZHOU</span>
      </div>
    </section>

    <section class="trip-news oe-home-only" id="updates">
      <header><span>NEWS</span><b>LATEST UPDATE</b></header>
      <div class="trip-news-columns"><span>DATE</span><span>TO</span><span>REMARKS</span></div>
      <div data-oe-mount="updates" class="updates-list"></div>
    </section>

    <section class="trip-intro oe-home-only">
      <aside><span>INTRODUCTION</span><b>01</b></aside>
      <div class="trip-intro-copy">
        <h2>THE MEMORIES OF A DAY<br>ARE LIKE A SINGLE CASSETTE TAPE.</h2>
        <p>好的一面、忙乱的一面、遇到的人、突然发生的小事，都会一起留下来。活动不是一串卡片，而是一段完整的旅程。</p>
      </div>
      <div class="trip-collage" aria-hidden="true">
        <div class="trip-card c1"></div><div class="trip-card c2"></div><div class="trip-card c3"></div>
        <div class="trip-cassette"><i></i><i></i><b>SPECIAL JOURNEY</b><small>MEMORY TAPE / 001</small></div>
      </div>
    </section>

    <section class="trip-index oe-home-only">
      <header><span>TRIP INDEX</span><b>WHERE DO YOU WANT TO GO?</b></header>
      <div data-oe-mount="quick" class="quick-grid"></div>
    </section>

    <section class="trip-feature oe-home-only" id="participation">
      <header><span>PICK UP</span><h2>JOURNEY HIGHLIGHTS</h2><p>这次活动最值得停留的几个目的地。</p></header>
      <div data-oe-mount="featured-activities" class="featured-activity-grid"></div>
    </section>

    <section class="trip-ticket-section oe-home-only" id="tickets">
      <div class="trip-ticket-cover"><small>ADMISSION</small><b>TRAVEL<br>PASS</b><span>ONLY EVENT / 2026</span></div>
      <div class="trip-ticket-list">
        <div data-oe-mount="tickets" class="ticket-grid"></div>
        <div data-oe-mount="ticket-actions" class="ticket-actions"></div>
      </div>
    </section>

    <section class="trip-map oe-home-only" id="map-home">
      <div class="trip-map-copy"><span>DESTINATION</span><h2>VENUE MAP</h2><p>像查看旅行目的地一样查看场地与活动区域。</p><div data-oe-mount="map-links" class="map-link-list"></div></div>
      <div class="trip-map-paper"><div data-oe-mount="map" id="venueMap" class="map-static"></div></div>
    </section>

    <section class="trip-page oe-page-view" id="booths">
      <header class="trip-page-head"><span>DESTINATION 01</span><h2>BOOTH DIRECTORY</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="booth-directory-rich" data-oe-mount="booths"></div>
    </section>

    <section class="trip-page oe-page-view" id="activities">
      <header class="trip-page-head"><span>DESTINATION 02</span><h2>EVENT / SCHEDULE</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="trip-activity-switch">
        <div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">TIMELINE</button><button type="button" data-activity-view="programs">PROGRAM</button></div>
        <div data-oe-mount="activity-days" class="activity-day-tabs"></div>
      </div>
      <div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div>
      <div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div>
    </section>

    <section class="trip-page oe-page-view" id="guests">
      <header class="trip-page-head"><span>DESTINATION 03</span><h2>TRAVEL COMPANIONS</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="guest-grid" data-oe-mount="guests"></div>
    </section>

    <section class="trip-page oe-page-view" id="guide">
      <header class="trip-page-head"><span>DESTINATION 04</span><h2>TRAVEL GUIDE</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="guide-detail-grid" data-oe-mount="guide-detail"></div>
    </section>

    <section class="trip-community" id="community"><header><span>POSTCARD WALL</span><h2>COMMUNITY</h2></header><div data-oe-mount="community" class="community"></div></section>
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

.trip-news{display:grid;grid-template-columns:240px 1fr;background:var(--trip-paper);border-bottom:1px solid var(--trip-line)}.trip-news>header{padding:44px 30px;border-right:1px solid var(--trip-line)}.trip-news>header span,.trip-index>header span,.trip-feature>header>span,.trip-ticket-cover small,.trip-map-copy>span,.trip-page-head>span,.trip-community header span,.trip-sponsors header span{font:800 7px/1 monospace;letter-spacing:.17em;color:var(--trip-pink)}
.trip-news>header b{display:block;margin-top:12px;font:500 30px/1 Georgia,serif}.trip-news-columns{display:grid;grid-template-columns:120px 90px 1fr;align-content:end;padding:20px 32px 0;font:800 7px/1 monospace;letter-spacing:.12em;color:#8a7c70}
.trip-news .updates-list{grid-column:2;padding:0 32px 24px}.scrap-update{display:grid!important;grid-template-columns:120px 90px 1fr auto!important;align-items:center;gap:0!important;padding:16px 0!important;border:0!important;border-bottom:1px dashed var(--trip-line)!important;background:none!important;box-shadow:none!important;transform:none!important;border-radius:0!important}.scrap-update time{font:700 8px/1 monospace}.scrap-update b{font-size:12px;font-weight:700}.scrap-update>span{font:800 7px/1 monospace;color:var(--trip-pink)}

.trip-intro{display:grid;grid-template-columns:150px minmax(0,1fr) 430px;gap:56px;align-items:center;padding:135px max(5vw,42px);border-bottom:1px solid var(--trip-line)}.trip-intro>aside{align-self:start}.trip-intro>aside span{font:800 7px/1 monospace;letter-spacing:.18em}.trip-intro>aside b{display:block;margin-top:20px;font:500 92px/.8 Georgia,serif;color:#d1c3b3}
.trip-intro-copy h2{margin:0 0 36px;font:500 clamp(38px,4.8vw,68px)/1.05 Georgia,serif;letter-spacing:-.04em}.trip-intro-copy p{max-width:650px;font-size:14px;line-height:2;color:#6d6056}
.trip-collage{height:390px;position:relative}.trip-card{position:absolute;width:180px;height:230px;background:#d5cec3;border:10px solid #fff;box-shadow:0 12px 28px #4a382725}.trip-card.c1{left:10px;top:16px;transform:rotate(-8deg);background:#add5df}.trip-card.c2{right:8px;top:48px;transform:rotate(9deg);background:#efb8c2}.trip-card.c3{left:118px;bottom:0;transform:rotate(2deg);background:#e4d49e}
.trip-cassette{position:absolute;left:68px;top:112px;z-index:3;width:280px;height:174px;padding:24px;border:2px solid #62564d;border-radius:21px;background:#f4e3cf;box-shadow:12px 14px 0 #b9a58f;transform:rotate(-5deg)}.trip-cassette i{position:absolute;top:60px;width:46px;height:46px;border:3px solid #6b6057;border-radius:50%;background:#fff}.trip-cassette i:first-child{left:44px}.trip-cassette i:nth-child(2){right:44px}.trip-cassette b{font:700 12px/1 Georgia,serif}.trip-cassette small{position:absolute;left:24px;bottom:18px;font:700 7px/1 monospace;letter-spacing:.12em}

.trip-index{display:grid;grid-template-columns:240px 1fr;background:#2f2926;color:#fff;border-bottom:1px solid #5c514b}.trip-index>header{padding:45px 30px;border-right:1px solid #5c514b}.trip-index>header b{display:block;margin-top:14px;font:500 27px/1.05 Georgia,serif}.trip-index .quick-grid{display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:0!important}.scrap-index-card{min-height:210px!important;display:flex!important;flex-direction:column!important;justify-content:space-between!important;padding:26px 22px!important;border:0!important;border-right:1px solid #5c514b!important;border-radius:0!important;background:transparent!important;color:#fff!important;box-shadow:none!important;transform:none!important}.scrap-index-card>span{font:500 36px/1 Georgia,serif!important;color:#746961!important}.scrap-index-card small{font:700 7px/1 monospace!important;color:var(--trip-pink)!important}.scrap-index-card b{display:block;margin-top:8px;font:500 24px/1 Georgia,serif!important}.scrap-index-card em{margin-top:8px;font:700 8px/1.4 monospace!important;color:#aaa09a!important;font-style:normal!important}.scrap-index-card>i{align-self:flex-end;color:var(--trip-lime);font-style:normal}

.trip-feature{display:grid;grid-template-columns:310px 1fr;gap:58px;padding:120px max(5vw,44px);background:#e4f0f2;border-bottom:1px solid #a7c7cf}.trip-feature>header{position:sticky;top:110px;align-self:start}.trip-feature h2{margin:10px 0 20px;font:500 54px/.9 Georgia,serif}.trip-feature>header p{font-size:12px;line-height:1.8;color:#587078}.trip-feature .featured-activity-grid{display:grid!important;grid-template-columns:1fr!important;gap:30px!important}.trip-feature .scrap-activity{display:grid!important;grid-template-columns:minmax(250px,.75fr) 1fr!important;background:var(--trip-paper)!important;border:1px solid #b5cdd2!important;box-shadow:none!important;transform:none!important}

.trip-ticket-section{display:grid;grid-template-columns:34% 66%;min-height:650px;background:#f1d9cd;border-bottom:1px solid #c4a395}.trip-ticket-cover{display:flex;flex-direction:column;justify-content:space-between;padding:56px 46px;background:var(--trip-pink);color:#fff;border-right:1px solid #a25d69}.trip-ticket-cover small{color:#fff}.trip-ticket-cover b{font:500 clamp(62px,8vw,116px)/.8 Georgia,serif;letter-spacing:-.06em}.trip-ticket-cover span{font:700 8px/1 monospace;letter-spacing:.12em}.trip-ticket-list{padding:58px max(4vw,34px)}.trip-ticket-list .ticket-grid{display:grid!important;grid-template-columns:1fr!important;gap:14px!important}.scrap-pass{display:grid!important;grid-template-columns:90px 1fr 150px!important;background:var(--trip-paper)!important;border:1px solid #bc9f91!important;box-shadow:none!important;transform:none!important}.scrap-pass:nth-child(2n){transform:translateX(18px)!important}.scrap-pass-no{border-right:1px dashed #bc9f91!important}.ticket-actions{margin-top:24px}.btn,.ticket-purchase-link{border-radius:0!important}

.trip-map{display:grid;grid-template-columns:34% 66%;min-height:620px;background:var(--trip-paper);border-bottom:1px solid var(--trip-line)}.trip-map-copy{padding:72px 48px;border-right:1px dashed var(--trip-line)}.trip-map-copy h2{margin:12px 0 20px;font:500 60px/.9 Georgia,serif}.trip-map-copy p{font-size:12px;line-height:1.8;color:#6c6057}.trip-map-paper{padding:34px;background-image:linear-gradient(#c8bcae44 1px,transparent 1px),linear-gradient(90deg,#c8bcae44 1px,transparent 1px);background-size:32px 32px}.trip-map .map-static{height:100%;min-height:520px;border:0!important;border-radius:0!important;box-shadow:8px 10px 0 #d4c7b6!important}

.trip-page{padding:78px max(5vw,44px) 110px;min-height:calc(100vh - 78px);background:var(--trip-bg)}.trip-page-head{display:grid;grid-template-columns:1fr auto;gap:8px 30px;align-items:end;max-width:1220px;margin:0 auto 50px;padding-bottom:20px;border-bottom:1px solid var(--trip-line)}.trip-page-head>span{grid-column:1/-1}.trip-page-head h2{margin:0;font:500 clamp(45px,6vw,78px)/.9 Georgia,serif}.trip-page-head .section-back{font:800 8px/1 monospace;border-bottom:1px solid var(--trip-ink);padding-bottom:5px}
.trip-page>.booth-directory-rich,.trip-page>.guest-grid,.trip-page>.guide-detail-grid,.trip-page>.activity-page-block,.trip-page>.trip-activity-switch{max-width:1220px;margin-left:auto;margin-right:auto}.trip-activity-switch{display:flex;justify-content:space-between;gap:20px;margin-bottom:28px}
.activity-view-tabs,.activity-day-tabs{display:flex;gap:8px}.activity-view-tabs button,.activity-day-tabs button{padding:9px 13px;border:1px solid var(--trip-line);background:var(--trip-paper);font:800 8px/1 monospace}.activity-view-tabs button.active,.activity-day-tabs button.active{background:var(--trip-ink);color:#fff}
.scrap-itinerary,.scrap-guide{box-shadow:none!important;transform:none!important}

.trip-community,.trip-sponsors{padding:88px max(5vw,44px);background:#2f2926;color:#fff;border-top:1px solid #5c514b}.trip-community header,.trip-sponsors header{max-width:1220px;margin:0 auto 26px}.trip-community h2,.trip-sponsors h2{margin:8px 0 0;font:500 clamp(36px,5vw,60px)/1 Georgia,serif}.trip-community .community,.trip-sponsors .sponsors{max-width:1220px;margin:auto}.community{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#5c514b}.sponsors{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:#5c514b}
.trip-footer{display:grid;grid-template-columns:220px repeat(4,1fr);gap:0;background:#171411;color:#fff;border-top:1px solid #514740}.trip-footer>div{padding:34px 26px;border-right:1px solid #514740}.trip-footer-mark{font:500 30px/.9 Georgia,serif}

.gift-lightbox{border:0;padding:0;background:transparent;max-width:min(92vw,1100px);max-height:92vh}.gift-lightbox::backdrop{background:rgba(12,12,16,.82)}.gift-lightbox img{display:block;max-width:92vw;max-height:88vh;object-fit:contain}.gift-lightbox button{position:fixed;right:22px;top:18px;width:40px;height:40px;border:0;border-radius:50%;background:#fff;color:#111;font-size:22px}
.oe-page-hidden{display:none!important}.oe-page-view{min-height:calc(100vh - 78px)}
[data-oe-field]{cursor:text}[data-oe-field]:hover{outline:2px solid #7b61ff77;outline-offset:2px}[data-oe-field]:focus{outline:2px solid #7b61ff;background:#fff7b3}.oe-preview [data-oe-field],.oe-preview [data-oe-item]{outline:none!important;cursor:inherit}

.loader{position:fixed;inset:0;z-index:999;display:grid;place-items:center;padding:24px;background:var(--trip-bg);transition:opacity .5s,visibility .5s}.loader.hide{opacity:0;visibility:hidden;pointer-events:none}.scrap-entry-gate{width:min(900px,90vw);display:grid;grid-template-columns:1.25fr .75fr;background:var(--trip-paper);border:1px solid #675a50;box-shadow:18px 18px 0 #b7a491;transform:rotate(-1deg);cursor:pointer}.scrap-entry-photo{padding:18px;border-right:1px dashed #8d7f72}.entry-photo{min-height:390px;background:#d7d0c7 center/cover no-repeat}.scrap-entry-info{display:flex;flex-direction:column;gap:18px;padding:34px}.entry-ticket-label{font:800 8px/1 monospace;letter-spacing:.16em;color:var(--trip-pink)}.entry-ticket-title{font:500 42px/.9 Georgia,serif}.entry-ticket-meta{display:grid;gap:9px;padding-top:16px;border-top:1px dashed var(--trip-line)}.entry-ticket-meta>div{display:grid;grid-template-columns:80px 1fr;gap:12px}.entry-ticket-meta span{font:800 7px/1 monospace;color:#8b7d70}.entry-ticket-meta b{font:700 10px/1.3 monospace}.stub-barcode{height:44px;margin-top:auto;background:repeating-linear-gradient(90deg,#2f2926 0 2px,transparent 2px 5px,#2f2926 5px 6px,transparent 6px 9px)}.stub-code{text-align:right;font:800 8px/1 monospace}.skip{position:fixed;right:28px;bottom:24px;border:1px solid var(--trip-ink);border-radius:0;background:var(--trip-lime);padding:11px 15px;font:800 8px/1 monospace;cursor:pointer}

@media(max-width:980px){.trip-header{grid-template-columns:220px 1fr auto}.trip-flight-info{display:none}.trip-hero{grid-template-columns:1fr}.trip-hero-visual{min-height:620px}.trip-hero-copy{padding:54px 7vw}.trip-weather-strip{grid-row:3}.trip-intro{grid-template-columns:100px 1fr}.trip-collage{grid-column:2}.trip-feature{grid-template-columns:1fr}.trip-feature>header{position:static}.trip-ticket-section,.trip-map{grid-template-columns:1fr}.trip-ticket-cover{min-height:300px}}
@media(max-width:760px){.trip-header{grid-template-columns:1fr auto;min-height:60px}.trip-logo{padding:9px 14px;border-right:0}.trip-logo b{font-size:19px}.trip-nav{display:none}.trip-ticket{padding:0 14px}.trip-mobile-nav{position:sticky;top:60px;z-index:85;display:flex;overflow-x:auto;background:#2f2926;color:#fff}.trip-mobile-nav a{flex:0 0 auto;min-width:84px;padding:9px 12px;border-right:1px solid #5c514b;font:700 8px/1 Georgia,serif}.trip-mobile-nav small{display:block;margin-bottom:4px;font:700 6px/1 monospace;color:var(--trip-pink)}.trip-hero{min-height:0}.trip-hero-visual{min-height:430px;padding:24px 14px}.trip-hero-visual .kv{inset:26px 22px 55px;border-width:9px;border-bottom-width:44px;transform:rotate(-.6deg)}.trip-photo-caption{left:30px;bottom:30px}.trip-hero-copy{padding:44px 18px 50px}.trip-hero-copy h1{font-size:clamp(54px,18vw,82px)}.trip-stamp{width:70px;height:70px;right:18px;bottom:18px}.trip-weather-strip{grid-template-columns:1fr 1fr}.trip-news{grid-template-columns:1fr}.trip-news>header{border-right:0;border-bottom:1px solid var(--trip-line);padding:28px 18px}.trip-news-columns{display:none}.trip-news .updates-list{grid-column:1;padding:8px 18px 24px}.scrap-update{grid-template-columns:76px 1fr!important}.scrap-update>span{display:none}.trip-intro{grid-template-columns:1fr;gap:28px;padding:70px 18px}.trip-intro>aside b{font-size:62px}.trip-collage{grid-column:1;height:330px}.trip-cassette{left:50%;top:96px;transform:translateX(-50%) rotate(-5deg);width:240px}.trip-index{grid-template-columns:1fr}.trip-index>header{border-right:0;border-bottom:1px solid #5c514b;padding:28px 18px}.trip-index .quick-grid{display:flex!important;overflow-x:auto!important}.scrap-index-card{flex:0 0 70%;min-height:170px!important}.trip-feature{padding:70px 18px;gap:34px}.trip-feature .scrap-activity{grid-template-columns:1fr!important}.trip-ticket-cover{min-height:240px;padding:38px 22px}.trip-ticket-cover b{font-size:64px}.trip-ticket-list{padding:28px 14px 48px}.scrap-pass{grid-template-columns:58px 1fr!important}.scrap-pass aside{grid-column:1/-1;border-left:0!important;border-top:1px dashed #bc9f91!important}.scrap-pass:nth-child(2n){transform:none!important}.trip-map-copy{padding:48px 18px}.trip-map-paper{padding:18px}.trip-map .map-static{min-height:360px}.trip-page{padding:52px 16px 74px}.trip-page-head{grid-template-columns:1fr;gap:12px;margin-bottom:34px}.trip-page-head .section-back{justify-self:start}.trip-activity-switch{display:grid}.community{grid-template-columns:1fr}.sponsors{grid-template-columns:repeat(2,minmax(0,1fr))}.trip-footer{grid-template-columns:1fr}.trip-footer>div{border-right:0;border-bottom:1px solid #514740}.scrap-entry-gate{grid-template-columns:1fr;width:min(92vw,520px);max-height:82vh;overflow:auto}.scrap-entry-photo{border-right:0;border-bottom:1px dashed #8d7f72}.entry-photo{min-height:250px}.scrap-entry-info{padding:22px}.entry-ticket-title{font-size:30px}}
`;
