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
      <small>ONLY EVENT / JOURNEY</small>
      <b data-oe-field="eventName">ONLY<br>EVENT</b>
    </a>
    <div class="trip-flight-info">
      <span>ONLY EVENT</span><i></i><span data-oe-field="date">EVENT DATE</span><i></i><span data-oe-field="location">DESTINATION</span>
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
    <section class="trip-hero hero oe-home-only" id="home">
      <div class="trip-hero-visual">
        <div class="kv"></div>
        <div class="trip-photo-caption"><span>PHOTO / 001</span><b>A SIDE — THE GOOD MEMORIES</b></div>
      </div>
      <div class="trip-hero-copy hero-copy">
        <div class="trip-route">ONLY EVENT / YOUR SPECIAL JOURNEY</div>
        <h1><span class="hero-title-line hero-title-1">YOUR</span><br><em class="hero-title-line hero-title-2">SPECIAL</em><br><span class="hero-title-line hero-title-3">DAY</span></h1>
        <p data-oe-field="tagline">围绕单一作品 IP 的粉丝综合活动。一起把这一天变成值得留下的旅行记忆。</p>
        <div class="trip-hero-meta">
          <span data-oe-field="date">EVENT DATE</span>
          <span data-oe-field="location">EVENT CITY</span>
          <a class="venue-nav" href="#" target="_blank" rel="noopener" data-oe-field="edition">EVENT VENUE</a>
        </div>
        <div class="trip-stamp" aria-hidden="true">SPECIAL<br><b>DAY</b></div>
      </div>
      <div class="trip-weather-strip">
        <span><b>EVENT DATE</b><strong data-oe-field="date">DATE</strong></span>
        <span><b>DESTINATION</b><strong data-oe-field="location">LOCATION</strong></span>
        <span><b>VENUE</b><strong data-oe-field="edition">VENUE</strong></span>
        <span><b>THEME</b><strong data-oe-field="eventName">ONLY EVENT</strong></span>
      </div>
    </section>

    <div class="trip-route-ticker oe-home-only" aria-hidden="true">
      <div><span>✈ ONLY EVENT JOURNEY</span><span>ENJOY YOUR SPECIAL DAY</span><span>DISCOVER YOUR COMMUNITY</span><span>CREATE NEW MEMORIES</span><span>✈ ONLY EVENT JOURNEY</span><span>ENJOY YOUR SPECIAL DAY</span><span>DISCOVER YOUR COMMUNITY</span><span>CREATE NEW MEMORIES</span></div>
    </div>

    <section class="trip-news oe-home-only" id="updates">
      <header><span>NEWS</span><b>NEWS</b><small>EVENT UPDATES</small></header>
      <div class="trip-news-columns"><span>DATE</span><span>TYPE</span><span>REMARKS</span></div>
      <div data-oe-mount="updates" class="updates-list"></div>
    </section>

    <section class="trip-intro oe-home-only">
      <aside><span>INTRODUCTION</span><b>01</b></aside>
      <div class="trip-intro-copy">
        <h2>THE MEMORIES OF A DAY<br>ARE LIKE A SINGLE CASSETTE TAPE.</h2>
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

    <section class="trip-transition oe-home-only">
      <span>ONE DAY / TWO SIDES / MANY MEMORIES</span>
      <b>GOOD THINGS, SMALL TROUBLES,<br>AND EVERYTHING IN BETWEEN.</b>
      <i>→</i>
    </section>

    <section class="trip-index oe-home-only">
      <header><span>TRIP INDEX</span><b>WHERE DO YOU WANT TO GO?</b></header>
      <div data-oe-mount="quick" class="quick-grid"></div>
    </section>

    <section class="trip-feature oe-home-only" id="participation">
      <header><span>PICK UP</span><h2>JOURNEY HIGHLIGHTS</h2><p>DISCOVER EVENT HIGHLIGHTS</p></header>
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
      <div class="trip-map-copy"><span>DESTINATION</span><h2>VENUE MAP</h2><p>EXPLORE THE VENUE</p><div data-oe-mount="map-links" class="map-link-list"></div></div>
      <div class="trip-map-paper"><div data-oe-mount="map" id="venueMap" class="map-static"></div></div>
    </section>

    <section class="trip-page oe-page-view" id="booths">
      <header class="trip-page-head"><span>ROUTE 01 / BOOTH</span><h2>BOOTH DIRECTORY</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="booth-directory-rich" data-oe-mount="booths"></div>
    </section>

    <section class="trip-page oe-page-view" id="activities">
      <header class="trip-page-head"><span>ROUTE 02 / EVENT</span><h2>EVENT / SCHEDULE</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="trip-activity-switch">
        <div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">TIMELINE</button><button type="button" data-activity-view="programs">PROGRAM</button></div>
        <div data-oe-mount="activity-days" class="activity-day-tabs"></div>
      </div>
      <div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div>
      <div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div>
    </section>

    <section class="trip-page oe-page-view" id="guests">
      <header class="trip-page-head"><span>ROUTE 03 / GUEST</span><h2>TRAVEL COMPANIONS</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="guest-grid" data-oe-mount="guests"></div>
    </section>

    <section class="trip-page oe-page-view" id="guide">
      <header class="trip-page-head"><span>ROUTE 04 / GUIDE</span><h2>TRAVEL GUIDE</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="guide-detail-grid" data-oe-mount="guide-detail"></div>
    </section>

    <section class="trip-community" id="community"><div class="trip-social-wallpaper" aria-hidden="true">LINK → LINK → LINK → LINK → LINK → LINK →</div><header><span>STAY CONNECTED</span><h2>LINK <i>↗</i></h2></header><div data-oe-mount="community" class="community"></div></section>
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
.trip-page#activities .trip-activity-switch{padding:14px 0;border-block:1px solid #b7ccc7}
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
`;
