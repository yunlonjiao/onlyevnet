/* Template 02 — Travel / cassette / tourism website shell.
   Built reference-first. Shared Core mounts are intentionally embedded into
   this independent shell instead of inheriting Template 01 page composition. */

export const previewBody=`
<div class="loader scrap-entry" id="loader">
  <div class="gate trip-opening-gate" role="button" tabindex="0" aria-label="点击进入活动网站">
    <div class="trip-opening-topbar"><span>ONLY EVENT AIR / OE2026</span><span class="entry-ticket-date">2026.11.08</span><span class="entry-ticket-location">HANGZHOU</span></div>
    <div class="trip-opening-center">
      <div class="trip-opening-route"><span>DEPARTURE</span><b class="entry-ticket-time">10:00</b><i>→</i><span>DESTINATION</span><b>ONLY EVENT</b></div>
      <div class="trip-opening-cassette">
        <div class="trip-opening-reel r1"><i></i></div>
        <div class="trip-opening-reel r2"><i></i></div>
        <div class="trip-opening-window"></div>
        <small>MEMORY TAPE / A+B SIDE</small>
      </div>
      <div class="trip-opening-copy">
        <span class="entry-ticket-label">NOW BOARDING</span>
        <h1 class="entry-ticket-title">STARDUST ONLY 2026</h1>
        <p class="entry-ticket-subtitle">A SPECIAL JOURNEY IS ABOUT TO BEGIN.</p>
      </div>
    </div>
    <div class="trip-opening-bottom"><span>GATE 08</span><span class="stub-number entry-serial">NO. 048271</span><span>CLICK TO BOARD ↗</span></div>
    <div class="entry-photo" aria-label="活动KV"></div>
    <div class="stub-barcode" aria-hidden="true"></div>
    <div class="stub-code"></div>
  </div>
  <button class="skip" id="skip">SKIP →</button>
</div>

<div class="trip-site">
  <header class="trip-header">
    <a class="trip-logo" href="#home" data-page-link="home">
      <small>ONLY EVENT / JOURNEY</small>
      <b data-oe-field="eventName">STARDUST<br>ONLY</b>
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
    <section class="trip-hero hero oe-home-only" id="home">
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
          <a class="venue-nav" href="#" target="_blank" rel="noopener" data-oe-field="edition">杭州国际博览中心</a>
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

    <div class="trip-route-ticker oe-home-only" aria-hidden="true">
      <div><span>✈ ONLY EVENT JOURNEY</span><span>#SPECIAL TRIP</span><span>HANGZHOU / 11.08</span><span>17.4℃ ☀</span><span>BOARDING NOW</span><span>✈ ONLY EVENT JOURNEY</span><span>#SPECIAL TRIP</span><span>HANGZHOU / 11.08</span></div>
    </div>

    <section class="trip-news oe-home-only" id="updates">
      <header><span>NEWS / FLIGHT INFORMATION</span><b>LATEST<br>UPDATE</b><small>Attention, all passengers. This is your captain speaking.<br>The information board will guide your trip.</small></header>
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
        <div class="trip-card c1"><span>11.08</span></div>
        <div class="trip-card c2"><span>HANGZHOU</span></div>
        <div class="trip-card c3"><span>ONLY EVENT</span></div>
        <div class="trip-ticket-stub">OE 2026<br><b>BOARDING PASS</b><small>GATE 08 / SEAT A01</small></div>
        <div class="trip-cassette"><i></i><i></i><b>SPECIAL JOURNEY</b><small>MEMORY TAPE / 001</small></div>
      </div>
    </section>

    <section class="trip-sides oe-home-only">
      <article class="trip-side-a">
        <header><span>A SIDE</span><small>GOOD MEMORIES</small></header>
        <h3>MEET / DISCOVER / ENJOY</h3>
        <p>喜欢的社团、期待的舞台、遇见的人和意外的惊喜，都属于旅程正面的声音。</p>
        <div class="trip-side-meter"><i></i><b>REC 01</b><i></i><i></i><i></i></div>
      </article>
      <article class="trip-side-b">
        <header><span>B SIDE</span><small>SMALL HAPPENINGS</small></header>
        <h3>WAIT / MISS / FIND AGAIN</h3>
        <p>排队、迷路、临时变更和没赶上的瞬间，也会一起留下来，成为完整的一天。</p>
        <div class="trip-side-meter"><i></i><i></i><b>REC 02</b><i></i><i></i></div>
      </article>
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
      <header class="trip-page-head"><span>ROUTE 01 / BOOTH</span><h2>BOOTH DIRECTORY</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="booth-directory-rich" data-oe-mount="booths"></div>
      <nav class="trip-page-pager"><span>← HOME</span><b>01 / 04</b><a href="#activities" data-target-mode="page" data-page-link="activities">NEXT →</a></nav>
    </section>

    <section class="trip-page oe-page-view" id="activities">
      <header class="trip-page-head"><span>ROUTE 02 / EVENT</span><h2>EVENT / SCHEDULE</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="trip-activity-switch">
        <div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">TIMELINE</button><button type="button" data-activity-view="programs">PROGRAM</button></div>
        <div data-oe-mount="activity-days" class="activity-day-tabs"></div>
      </div>
      <div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div>
      <div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div>
      <nav class="trip-page-pager"><a href="#booths" data-target-mode="page" data-page-link="booths">← BACK</a><b>02 / 04</b><a href="#guests" data-target-mode="page" data-page-link="guests">NEXT →</a></nav>
    </section>

    <section class="trip-page oe-page-view" id="guests">
      <header class="trip-page-head"><span>ROUTE 03 / GUEST</span><h2>TRAVEL COMPANIONS</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="guest-grid" data-oe-mount="guests"></div>
      <nav class="trip-page-pager"><a href="#activities" data-target-mode="page" data-page-link="activities">← BACK</a><b>03 / 04</b><a href="#guide" data-target-mode="page" data-page-link="guide">NEXT →</a></nav>
    </section>

    <section class="trip-page oe-page-view" id="guide">
      <header class="trip-page-head"><span>ROUTE 04 / GUIDE</span><h2>TRAVEL GUIDE</h2><a class="section-back" href="#home" data-page-link="home">BACK TO TOP</a></header>
      <div class="guide-detail-grid" data-oe-mount="guide-detail"></div>
      <nav class="trip-page-pager"><a href="#guests" data-target-mode="page" data-page-link="guests">← BACK</a><b>04 / 04</b><a href="#home" data-page-link="home">TOP →</a></nav>
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

.trip-route-ticker{overflow:hidden;background:var(--trip-lime);border-bottom:1px solid var(--trip-ink);white-space:nowrap}.trip-route-ticker>div{display:inline-flex;min-width:max-content;animation:tripTicker 28s linear infinite}.trip-route-ticker span{display:inline-block;padding:12px 28px;border-right:1px solid #8e9d31;font:900 8px/1 monospace;letter-spacing:.13em}@keyframes tripTicker{to{transform:translateX(-50%)}}

.trip-news{display:grid;grid-template-columns:240px 1fr;background:var(--trip-paper);border-bottom:1px solid var(--trip-line)}.trip-news>header{padding:44px 30px;border-right:1px solid var(--trip-line)}.trip-news>header span,.trip-index>header span,.trip-feature>header>span,.trip-ticket-cover small,.trip-map-copy>span,.trip-page-head>span,.trip-community header span,.trip-sponsors header span{font:800 7px/1 monospace;letter-spacing:.17em;color:var(--trip-pink)}
.trip-news>header b{display:block;margin-top:12px;font:500 34px/.92 Georgia,serif}.trip-news>header small{display:block;margin-top:22px;font:700 7px/1.7 monospace;letter-spacing:.06em;color:#8a7c70}.trip-news-columns{display:grid;grid-template-columns:120px 90px 1fr;align-content:end;padding:20px 32px 0;font:800 7px/1 monospace;letter-spacing:.12em;color:#8a7c70}
.trip-news .updates-list{grid-column:2;padding:0 32px 24px}.scrap-update{display:grid!important;grid-template-columns:120px 90px 1fr auto!important;align-items:center;gap:0!important;padding:16px 0!important;border:0!important;border-bottom:1px dashed var(--trip-line)!important;background:none!important;box-shadow:none!important;transform:none!important;border-radius:0!important}.scrap-update time{font:700 8px/1 monospace}.scrap-update b{font-size:12px;font-weight:700}.scrap-update>span{font:800 7px/1 monospace;color:var(--trip-pink)}

.trip-intro{display:grid;grid-template-columns:150px minmax(0,1fr) 430px;gap:56px;align-items:center;padding:135px max(5vw,42px);border-bottom:1px solid var(--trip-line)}.trip-intro>aside{align-self:start}.trip-intro>aside span{font:800 7px/1 monospace;letter-spacing:.18em}.trip-intro>aside b{display:block;margin-top:20px;font:500 92px/.8 Georgia,serif;color:#d1c3b3}
.trip-intro-copy h2{margin:0 0 36px;font:500 clamp(38px,4.8vw,68px)/1.05 Georgia,serif;letter-spacing:-.04em}.trip-intro-copy p{max-width:650px;font-size:14px;line-height:2;color:#6d6056}
.trip-collage{height:390px;position:relative}.trip-card{position:absolute;width:180px;height:230px;background:#d5cec3;border:10px solid #fff;box-shadow:0 12px 28px #4a382725}.trip-card.c1{left:10px;top:16px;transform:rotate(-8deg);background:#add5df}.trip-card.c2{right:8px;top:48px;transform:rotate(9deg);background:#efb8c2}.trip-card.c3{left:118px;bottom:0;transform:rotate(2deg);background:#e4d49e}.trip-card span{position:absolute;left:9px;bottom:-27px;font:800 7px/1 monospace;letter-spacing:.12em;color:#6d6056}.trip-ticket-stub{position:absolute;right:-8px;bottom:20px;z-index:2;width:180px;padding:18px 16px;background:var(--trip-lime);border:1px solid var(--trip-ink);transform:rotate(8deg);font:800 7px/1.35 monospace;letter-spacing:.1em}.trip-ticket-stub b{display:block;margin:8px 0;font-size:13px}.trip-ticket-stub small{font-size:6px}
.trip-cassette{position:absolute;left:68px;top:112px;z-index:3;width:280px;height:174px;padding:24px;border:2px solid #62564d;border-radius:21px;background:#f4e3cf;box-shadow:12px 14px 0 #b9a58f;transform:rotate(-5deg)}.trip-cassette i{position:absolute;top:60px;width:46px;height:46px;border:3px solid #6b6057;border-radius:50%;background:#fff}.trip-cassette i:first-child{left:44px}.trip-cassette i:nth-child(2){right:44px}.trip-cassette b{font:700 12px/1 Georgia,serif}.trip-cassette small{position:absolute;left:24px;bottom:18px;font:700 7px/1 monospace;letter-spacing:.12em}


.trip-sides{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--trip-line)}.trip-sides article{min-height:430px;padding:70px max(4vw,38px);position:relative;overflow:hidden}.trip-side-a{background:#b9dfe8}.trip-side-b{background:#efb2bd}.trip-sides article:before{content:"";position:absolute;right:-80px;bottom:-100px;width:280px;height:280px;border:1px solid rgba(47,41,38,.28);border-radius:50%}.trip-sides article:after{content:"";position:absolute;right:-20px;bottom:-40px;width:160px;height:160px;border:1px solid rgba(47,41,38,.2);border-radius:50%}.trip-sides header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(47,41,38,.35);padding-bottom:10px}.trip-sides header span{font:500 42px/.9 Georgia,serif}.trip-sides header small{font:800 7px/1 monospace;letter-spacing:.14em}.trip-sides h3{max-width:520px;margin:56px 0 18px;font:500 clamp(34px,4vw,58px)/.95 Georgia,serif;letter-spacing:-.04em}.trip-sides p{max-width:480px;font-size:12px;line-height:1.8;color:#5f554f}.trip-side-meter{display:flex;align-items:center;gap:8px;margin-top:42px}.trip-side-meter i{width:48px;height:6px;background:rgba(47,41,38,.22)}.trip-side-meter b{font:800 7px/1 monospace;letter-spacing:.12em}
.trip-transition{position:relative;display:grid;grid-template-columns:180px 1fr auto;align-items:end;gap:40px;padding:80px max(5vw,44px);background:var(--trip-paper);border-bottom:1px solid var(--trip-line)}.trip-transition span{font:800 7px/1.5 monospace;letter-spacing:.16em;color:var(--trip-pink)}.trip-transition b{font:500 clamp(36px,4.8vw,68px)/.96 Georgia,serif;letter-spacing:-.04em}.trip-transition i{font:400 62px/1 Georgia,serif;color:#c7b7a6;font-style:normal}

.trip-index{display:grid;grid-template-columns:240px 1fr;background:#2f2926;color:#fff;border-bottom:1px solid #5c514b}.trip-index>header{padding:45px 30px;border-right:1px solid #5c514b}.trip-index>header b{display:block;margin-top:14px;font:500 27px/1.05 Georgia,serif}.trip-index .quick-grid{display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:0!important}.scrap-index-card{min-height:210px!important;display:flex!important;flex-direction:column!important;justify-content:space-between!important;padding:26px 22px!important;border:0!important;border-right:1px solid #5c514b!important;border-radius:0!important;background:transparent!important;color:#fff!important;box-shadow:none!important;transform:none!important}.scrap-index-card>span{font:500 36px/1 Georgia,serif!important;color:#746961!important}.scrap-index-card small{font:700 7px/1 monospace!important;color:var(--trip-pink)!important}.scrap-index-card b{display:block;margin-top:8px;font:500 24px/1 Georgia,serif!important}.scrap-index-card em{margin-top:8px;font:700 8px/1.4 monospace!important;color:#aaa09a!important;font-style:normal!important}.scrap-index-card>i{align-self:flex-end;color:var(--trip-lime);font-style:normal}

.trip-feature{display:grid;grid-template-columns:310px 1fr;gap:58px;padding:120px max(5vw,44px);background:#e4f0f2;border-bottom:1px solid #a7c7cf}.trip-feature>header{position:sticky;top:110px;align-self:start}.trip-feature h2{margin:10px 0 20px;font:500 54px/.9 Georgia,serif}.trip-feature>header p{font-size:12px;line-height:1.8;color:#587078}.trip-feature .featured-activity-grid{display:grid!important;grid-template-columns:1fr!important;gap:30px!important}.trip-feature .scrap-activity{display:grid!important;grid-template-columns:minmax(250px,.75fr) 1fr!important;background:var(--trip-paper)!important;border:1px solid #b5cdd2!important;box-shadow:none!important;transform:none!important}

.trip-ticket-section{display:grid;grid-template-columns:34% 66%;min-height:650px;background:#f1d9cd;border-bottom:1px solid #c4a395}.trip-ticket-cover{display:flex;flex-direction:column;justify-content:space-between;padding:56px 46px;background:var(--trip-pink);color:#fff;border-right:1px solid #a25d69}.trip-ticket-cover small{color:#fff}.trip-ticket-cover b{font:500 clamp(62px,8vw,116px)/.8 Georgia,serif;letter-spacing:-.06em}.trip-ticket-cover span{font:700 8px/1 monospace;letter-spacing:.12em}.trip-ticket-list{padding:58px max(4vw,34px)}.trip-ticket-list .ticket-grid{display:grid!important;grid-template-columns:1fr!important;gap:14px!important}.scrap-pass{display:grid!important;grid-template-columns:90px 1fr 150px!important;background:var(--trip-paper)!important;border:1px solid #bc9f91!important;box-shadow:none!important;transform:none!important}.scrap-pass:nth-child(2n){transform:translateX(18px)!important}.scrap-pass-no{border-right:1px dashed #bc9f91!important}.ticket-actions{margin-top:24px}.btn,.ticket-purchase-link{border-radius:0!important}

.trip-map{display:grid;grid-template-columns:34% 66%;min-height:620px;background:var(--trip-paper);border-bottom:1px solid var(--trip-line)}.trip-map-copy{padding:72px 48px;border-right:1px dashed var(--trip-line)}.trip-map-copy h2{margin:12px 0 20px;font:500 60px/.9 Georgia,serif}.trip-map-copy p{font-size:12px;line-height:1.8;color:#6c6057}.trip-map-paper{padding:34px;background-image:linear-gradient(#c8bcae44 1px,transparent 1px),linear-gradient(90deg,#c8bcae44 1px,transparent 1px);background-size:32px 32px}.trip-map .map-static{height:100%;min-height:520px;border:0!important;border-radius:0!important;box-shadow:8px 10px 0 #d4c7b6!important}

.trip-page{padding:78px max(5vw,44px) 110px;min-height:calc(100vh - 78px);background:var(--trip-bg)}.trip-page-head{display:grid;grid-template-columns:1fr auto;gap:8px 30px;align-items:end;max-width:1220px;margin:0 auto 50px;padding-bottom:20px;border-bottom:1px solid var(--trip-line)}.trip-page-head>span{grid-column:1/-1}.trip-page-head h2{margin:0;font:500 clamp(45px,6vw,78px)/.9 Georgia,serif}.trip-page-head .section-back{font:800 8px/1 monospace;border-bottom:1px solid var(--trip-ink);padding-bottom:5px}

.trip-page:before{content:"ONLY EVENT / TRAVEL RECORD";display:block;max-width:1220px;margin:0 auto 18px;font:800 7px/1 monospace;letter-spacing:.18em;color:#9c8d80}.trip-page:after{content:"";position:fixed;right:14px;bottom:18px;width:34px;height:34px;border:1px solid #b9aa97;border-radius:50%;pointer-events:none}
.trip-page-head{position:relative}.trip-page-head:after{content:"✈";position:absolute;right:0;top:4px;font-size:20px;color:#c7b8a8}.trip-page-head h2{letter-spacing:-.045em}.trip-page-head .section-back{justify-self:end}

.trip-page-pager{max-width:1220px;margin:72px auto 0;padding-top:18px;border-top:1px solid var(--trip-line);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;font:800 8px/1 monospace;letter-spacing:.12em}.trip-page-pager a:last-child,.trip-page-pager span:last-child{text-align:right}.trip-page-pager b{font:500 20px/1 Georgia,serif;color:#c2b3a3}
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

.gift-lightbox{border:0;padding:0;background:transparent;max-width:min(92vw,1100px);max-height:92vh}.gift-lightbox::backdrop{background:rgba(12,12,16,.82)}.gift-lightbox img{display:block;max-width:92vw;max-height:88vh;object-fit:contain}.gift-lightbox button{position:fixed;right:22px;top:18px;width:40px;height:40px;border:0;border-radius:50%;background:#fff;color:#111;font-size:22px}
.oe-page-hidden{display:none!important}.oe-page-view{min-height:calc(100vh - 78px)}
[data-oe-field]{cursor:text}[data-oe-field]:hover{outline:2px solid #7b61ff77;outline-offset:2px}[data-oe-field]:focus{outline:2px solid #7b61ff;background:#fff7b3}.oe-preview [data-oe-field],.oe-preview [data-oe-item]{outline:none!important;cursor:inherit}

.loader{position:fixed;inset:0;z-index:999;display:grid;place-items:center;padding:0;background:#9bd1e2;transition:opacity .65s,visibility .65s}.loader.hide{opacity:0;visibility:hidden;pointer-events:none}
.trip-opening-gate{position:relative;width:100%;height:100%;min-height:100vh;display:grid;grid-template-rows:56px 1fr 56px;background:linear-gradient(180deg,#a9ddea 0 54%,#efb2bd 54% 100%);overflow:hidden;cursor:pointer}
.trip-opening-gate:before{content:"";position:absolute;inset:56px 0 56px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.09) 0 1px,transparent 1px 80px),repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0 1px,transparent 1px 80px);pointer-events:none}
.trip-opening-topbar,.trip-opening-bottom{position:relative;z-index:5;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:32px;padding:0 28px;background:#2f2926;color:#fff;font:800 8px/1 monospace;letter-spacing:.13em}.trip-opening-bottom{grid-template-columns:1fr 1fr 1fr}.trip-opening-bottom span:nth-child(2){text-align:center}.trip-opening-bottom span:last-child{text-align:right;color:var(--trip-lime)}
.trip-opening-center{position:relative;z-index:2;display:grid;grid-template-columns:minmax(220px,.65fr) minmax(330px,.85fr) minmax(300px,1fr);align-items:center;gap:7vw;padding:7vh 7vw}
.trip-opening-route{align-self:start;display:grid;grid-template-columns:auto 1fr;gap:8px 18px;padding-top:20px;border-top:1px solid rgba(47,41,38,.45);font:800 8px/1 monospace;letter-spacing:.12em}.trip-opening-route b{font:500 36px/.9 Georgia,serif;letter-spacing:-.04em}.trip-opening-route i{grid-column:1/-1;font:400 48px/1 Georgia,serif;font-style:normal;color:rgba(47,41,38,.35)}
.trip-opening-cassette{position:relative;justify-self:center;width:min(34vw,430px);aspect-ratio:1.55;background:#f4e3cf;border:3px solid #544940;border-radius:34px;box-shadow:18px 22px 0 rgba(47,41,38,.22);transform:rotate(-4deg);animation:cassetteFloat 4s ease-in-out infinite}.trip-opening-cassette:before{content:"";position:absolute;inset:18px;border:1px solid #a9907d;border-radius:24px}.trip-opening-reel{position:absolute;top:31%;width:28%;aspect-ratio:1;border:4px solid #5b5048;border-radius:50%;background:#fff}.trip-opening-reel.r1{left:13%}.trip-opening-reel.r2{right:13%}.trip-opening-reel i{position:absolute;inset:22%;border:3px dashed #5b5048;border-radius:50%;animation:reelSpin 3.5s linear infinite}.trip-opening-window{position:absolute;left:25%;right:25%;top:41%;height:18%;background:#b9dfe8;border:3px solid #5b5048;border-radius:8px}.trip-opening-cassette small{position:absolute;left:8%;bottom:10%;font:800 7px/1 monospace;letter-spacing:.14em}
.trip-opening-copy{align-self:end;padding-bottom:20px}.trip-opening-copy>span{font:900 8px/1 monospace;letter-spacing:.18em}.trip-opening-copy h1{margin:10px 0 18px;font:500 clamp(58px,7vw,110px)/.8 Georgia,serif;letter-spacing:-.07em}.trip-opening-copy p{max-width:390px;margin:0;font:800 8px/1.5 monospace;letter-spacing:.13em}
.trip-opening-gate>.entry-photo{position:absolute;right:-4vw;top:9vh;width:28vw;height:34vw;opacity:.16;background:center/cover no-repeat;filter:grayscale(1);transform:rotate(8deg);mix-blend-mode:multiply;pointer-events:none}.trip-opening-gate>.stub-barcode{position:absolute;left:28px;bottom:76px;width:180px;height:30px;opacity:.4;background:repeating-linear-gradient(90deg,#2f2926 0 2px,transparent 2px 5px,#2f2926 5px 6px,transparent 6px 9px)}
.skip{position:fixed;right:24px;bottom:72px;z-index:6;border:1px solid var(--trip-ink);border-radius:0;background:var(--trip-lime);padding:11px 15px;font:800 8px/1 monospace;cursor:pointer}
@keyframes reelSpin{to{transform:rotate(360deg)}}@keyframes cassetteFloat{50%{transform:rotate(-2deg) translateY(-10px)}}

@media(max-width:980px){.trip-header{grid-template-columns:220px 1fr auto}.trip-flight-info{display:none}.trip-hero{grid-template-columns:1fr}.trip-hero-visual{min-height:620px}.trip-hero-copy{padding:54px 7vw}.trip-weather-strip{grid-row:3}.trip-intro{grid-template-columns:100px 1fr}.trip-collage{grid-column:2}.trip-feature{grid-template-columns:1fr}.trip-feature>header{position:static}.trip-ticket-section,.trip-map{grid-template-columns:1fr}.trip-ticket-cover{min-height:300px}}
@media(max-width:760px){.trip-opening-center{grid-template-columns:1fr;gap:26px;padding:74px 18px 70px}.trip-opening-route{display:none}.trip-opening-cassette{width:min(78vw,330px)}.trip-opening-copy{text-align:center;align-self:center}.trip-opening-copy h1{font-size:clamp(48px,15vw,78px)}.trip-opening-topbar{grid-template-columns:1fr auto;padding:0 14px}.trip-opening-topbar span:nth-child(2){display:none}.trip-opening-bottom{padding:0 14px;gap:10px;font-size:6px}.trip-opening-gate>.entry-photo{width:70vw;height:80vw;right:-22vw;top:10vh}.trip-header{grid-template-columns:1fr auto;min-height:60px}.trip-logo{padding:9px 14px;border-right:0}.trip-logo b{font-size:19px}.trip-nav{display:none}.trip-ticket{padding:0 14px}.trip-mobile-nav{position:sticky;top:60px;z-index:85;display:flex;overflow-x:auto;background:#2f2926;color:#fff}.trip-mobile-nav a{flex:0 0 auto;min-width:84px;padding:9px 12px;border-right:1px solid #5c514b;font:700 8px/1 Georgia,serif}.trip-mobile-nav small{display:block;margin-bottom:4px;font:700 6px/1 monospace;color:var(--trip-pink)}.trip-hero{min-height:0}.trip-hero-visual{min-height:430px;padding:24px 14px}.trip-hero-visual .kv{inset:26px 22px 55px;border-width:9px;border-bottom-width:44px;transform:rotate(-.6deg)}.trip-photo-caption{left:30px;bottom:30px}.trip-hero-copy{padding:44px 18px 50px}.trip-hero-copy h1{font-size:clamp(54px,18vw,82px)}.trip-stamp{width:70px;height:70px;right:18px;bottom:18px}.trip-weather-strip{grid-template-columns:1fr 1fr}.trip-news{grid-template-columns:1fr}.trip-news>header{border-right:0;border-bottom:1px solid var(--trip-line);padding:28px 18px}.trip-news-columns{display:none}.trip-news .updates-list{grid-column:1;padding:8px 18px 24px}.scrap-update{grid-template-columns:76px 1fr!important}.scrap-update>span{display:none}.trip-intro{grid-template-columns:1fr;gap:28px;padding:70px 18px}.trip-intro>aside b{font-size:62px}.trip-collage{grid-column:1;height:330px}.trip-cassette{left:50%;top:96px;transform:translateX(-50%) rotate(-5deg);width:240px}.trip-ticket-stub{right:0;bottom:6px;width:150px}.trip-sides{grid-template-columns:1fr}.trip-sides article{min-height:340px;padding:48px 18px}.trip-sides h3{margin-top:36px}.trip-transition{grid-template-columns:1fr;padding:54px 18px;gap:22px}.trip-transition i{font-size:44px}.trip-index{grid-template-columns:1fr}.trip-index>header{border-right:0;border-bottom:1px solid #5c514b;padding:28px 18px}.trip-index .quick-grid{display:flex!important;overflow-x:auto!important}.scrap-index-card{flex:0 0 70%;min-height:170px!important}.trip-feature{padding:70px 18px;gap:34px}.trip-feature .scrap-activity{grid-template-columns:1fr!important}.trip-ticket-cover{min-height:240px;padding:38px 22px}.trip-ticket-cover b{font-size:64px}.trip-ticket-list{padding:28px 14px 48px}.scrap-pass{grid-template-columns:58px 1fr!important}.scrap-pass aside{grid-column:1/-1;border-left:0!important;border-top:1px dashed #bc9f91!important}.scrap-pass:nth-child(2n){transform:none!important}.trip-map-copy{padding:48px 18px}.trip-map-paper{padding:18px}.trip-map .map-static{min-height:360px}.trip-page{padding:52px 16px 74px}.trip-page-head{grid-template-columns:1fr;gap:12px;margin-bottom:34px}.trip-page-head .section-back{justify-self:start}.trip-activity-switch{display:grid}.community{grid-template-columns:1fr}.sponsors{grid-template-columns:repeat(2,minmax(0,1fr))}.trip-footer{grid-template-columns:1fr}.trip-footer>div{border-right:0;border-bottom:1px solid #514740}.scrap-entry-gate{grid-template-columns:1fr;width:min(92vw,520px);max-height:82vh;overflow:auto}.scrap-entry-photo{border-right:0;border-bottom:1px dashed #8d7f72}.entry-photo{min-height:250px}.scrap-entry-info{padding:22px}.entry-ticket-title{font-size:30px}}
`;
