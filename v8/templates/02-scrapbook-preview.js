/* Template 02 — Travel / cassette / tourism website shell.
   Built reference-first. Shared Core mounts are intentionally embedded into
   this independent shell instead of inheriting Template 01 page composition. */

export const previewBody=`
<div class="loader scrap-entry" id="loader">
  <div class="gate trip-opening-gate" role="button" tabindex="0" aria-label="点击进入活动网站">
    <div class="trip-opening-topbar"><span>ONLY EVENT 活动信息 / OE2026</span><span class="entry-ticket-date">2026.11.08</span><span class="entry-ticket-location">杭州</span></div>
    <div class="trip-opening-center">
      <div class="trip-opening-route"><span>开放时间</span><b class="entry-ticket-time">10:00</b><i>→</i><span>活动类型</span><b>ONLY EVENT</b></div>
      <div class="trip-opening-board">
        <header><span>ONLY EVENT</span><b>OE 2026</b></header>
        <div class="trip-opening-board-row"><small>活动</small><strong>STARDUST ONLY 2026</strong></div>
        <div class="trip-opening-board-row"><small>状态</small><strong>官方网站已开放</strong></div>
        <footer><span>活动信息 / 摊位 / 日程 / 嘉宾</span><b>ENTER</b></footer>
      </div>
      <div class="trip-opening-copy">
        <span class="entry-ticket-label">正在登场</span>
        <h1 class="entry-ticket-title">STARDUST ONLY 2026</h1>
        <p class="entry-ticket-subtitle">活动信息、参展内容与当天安排已准备就绪。</p>
      </div>
    </div>
    <div class="trip-opening-bottom"><span>入口 08</span><span class="stub-number entry-serial">NO. 048271</span><span>点击进入 ↗</span></div>
    <div class="entry-photo" aria-label="活动KV"></div>
    <div class="stub-barcode" aria-hidden="true"></div>
    <div class="stub-code"></div>
  </div>
  <button class="skip" id="skip">跳过 →</button>
</div>

<div class="trip-site">
  <aside class="trip-rail" aria-hidden="true">
    <span>ONLY EVENT GUIDE</span>
    <i></i>
    <b>OE / 2026</b>
    <em>向下 ↓</em>
  </aside>
  <header class="trip-header">
    <a class="trip-logo" href="#home" data-page-link="home">
      <small>ONLY EVENT / 活动指南</small>
      <b data-oe-field="eventName">STARDUST<br>ONLY</b>
    </a>
    <div class="trip-flight-info">
      <span>OE 2026</span><i></i><span>ONLY EVENT</span><i></i><span>OFFICIAL SITE</span>
    </div>
    <nav class="trip-nav" data-oe-mount="nav-links">
      <a href="#booths" data-target-mode="page" data-page-link="booths"><small>01</small>摊位</a>
      <a href="#activities" data-target-mode="page" data-page-link="activities"><small>02</small>活动</a>
      <a href="#guests" data-target-mode="page" data-page-link="guests"><small>03</small>嘉宾</a>
      <a href="#guide" data-target-mode="page" data-page-link="guide"><small>04</small>指南</a>
    </nav>
    <a class="trip-ticket ticket-purchase-link" data-ticket-settings href="#" target="_blank" rel="noopener">购票 ↗</a>
  </header>

  <nav class="trip-mobile-nav" data-oe-mount="mobile-nav">
    <a href="#home" data-page-link="home"><small>00</small>首页</a>
    <a href="#booths" data-target-mode="page" data-page-link="booths"><small>01</small>摊位</a>
    <a href="#activities" data-target-mode="page" data-page-link="activities"><small>02</small>活动</a>
    <a href="#guests" data-target-mode="page" data-page-link="guests"><small>03</small>嘉宾</a>
    <a href="#guide" data-target-mode="page" data-page-link="guide"><small>04</small>指南</a>
  </nav>

  <main id="top">
    <section class="trip-hero hero oe-home-only" id="home">
      <div class="trip-hero-visual">
        <div class="kv"></div>
        <div class="trip-photo-caption"><span>主视觉 / 001</span><b>ONLY EVENT 主视觉</b></div>
      </div>
      <div class="trip-hero-copy hero-copy">
        <div class="trip-route">OE / EVENT 01 / 2026</div>
        <h1><span class="hero-title-line hero-title-1">STAR</span><br><em class="hero-title-line hero-title-2">BEAT</em><br><span class="hero-title-line hero-title-3">ONLY</span></h1>
        <p data-oe-field="tagline">围绕单一作品 IP 的粉丝综合活动。这里集中展示活动信息、参展内容、嘉宾、日程与观展指南。</p>
        <div class="trip-hero-meta">
          <span data-oe-field="date">11.08 SUN</span>
          <span data-oe-field="location">杭州</span>
          <a class="venue-nav" href="#" target="_blank" rel="noopener" data-oe-field="edition">杭州国际博览中心</a>
        </div>
        <div class="trip-stamp">活动<br><b>信息</b></div>
      </div>
      <div class="trip-weather-strip">
        <span><b>日期</b>11.08 SUN</span>
        <span><b>时间</b>10:00 — 17:00</span>
        <span><b>场馆</b>杭州国际博览中心</span>
        <span><b>状态</b>开放购票</span>
      </div>
    </section>

    <div class="trip-route-ticker oe-home-only" aria-hidden="true">
      <div><span>✈ ONLY EVENT</span><span>#活动资讯</span><span>杭州 / 11.08</span><span>10:00 — 17:00</span><span>开放购票</span><span>✈ ONLY EVENT</span><span>#参展指南</span><span>杭州 / 11.08</span></div>
    </div>

    <section class="trip-news oe-home-only" id="updates" data-trip-section="02 / 资讯">
      <header><span>资讯 / 活动信息</span><b>最新<br>动态</b><small>各位来宾请注意。<br>这里会更新本次活动的重要通知、变更与参展信息。</small></header>
      <div class="trip-news-columns"><span>日期</span><span>去向</span><span>内容</span></div>
      <div data-oe-mount="updates" class="updates-list"></div>
    </section>

    <section class="trip-intro oe-home-only" data-trip-section="03 / 介绍">
      <aside><span>活动介绍</span><b>01</b></aside>
      <div class="trip-intro-copy">
        <h2>为同一份喜欢，<br>安排一整天的相聚。</h2>
        <p>这里汇总本次 ONLY EVENT 的活动定位、参展内容与现场重点。主办方可以直接替换成活动简介、主题说明或本届特色。</p>
        <div class="trip-intro-facts">
          <div><small>参展内容</small><b>社团 / 制品</b></div>
          <div><small>现场内容</small><b>活动 / 嘉宾</b></div>
          <div><small>观展信息</small><b>票务 / 场地图 / 指南</b></div>
        </div>
      </div>
      <div class="trip-collage" aria-hidden="true">
        <div class="trip-card c1"><span>活动日期</span></div>
        <div class="trip-card c2"><span>活动城市</span></div>
        <div class="trip-card c3"><span>活动主视觉</span></div>
        <div class="trip-event-badge"><span>OE</span><b>EVENT GUIDE</b><small>摊位 / 活动 / 嘉宾 / 指南</small></div>
      </div>
    </section>

    <section class="trip-index oe-home-only" data-trip-section="04 / 导航">
      <header><span>活动导航</span><b>快速找到你需要的信息</b></header>
      <div data-oe-mount="quick" class="quick-grid"></div>
    </section>

    <section class="trip-feature oe-home-only" id="participation" data-trip-section="05 / 精选">
      <header><span>重点推荐</span><h2>活动精选</h2><p>本届活动最值得关注的内容会集中展示在这里。</p></header>
      <div data-oe-mount="featured-activities" class="featured-activity-grid"></div>
    </section>

    <section class="trip-ticket-section oe-home-only" id="tickets" data-trip-section="06 / 票务">
      <div class="trip-ticket-cover"><small>入场</small><b>票务<br>信息</b><span>ONLY EVENT / 2026</span></div>
      <div class="trip-ticket-list">
        <div data-oe-mount="tickets" class="ticket-grid"></div>
        <div data-oe-mount="ticket-actions" class="ticket-actions"></div>
      </div>
    </section>

    <section class="trip-map oe-home-only" id="map-home" data-trip-section="07 / 场地图">
      <div class="trip-map-copy"><span>目的地</span><h2>场地图</h2><p>查看场地区域、摊位分布与活动位置。</p><div data-oe-mount="map-links" class="map-link-list"></div></div>
      <div class="trip-map-paper"><div data-oe-mount="map" id="venueMap" class="map-static"></div></div>
    </section>

    <section class="trip-page oe-page-view" id="booths">
      <header class="trip-page-head"><span>路线 01 / 摊位</span><h2>摊位目录</h2><a class="section-back" href="#home" data-page-link="home">返回首页</a></header>
      <div class="booth-directory-rich" data-oe-mount="booths"></div>
      <nav class="trip-page-pager"><span>← 首页</span><b>01 / 04</b><a href="#activities" data-target-mode="page" data-page-link="activities">下一站 →</a></nav>
    </section>

    <section class="trip-page oe-page-view" id="activities">
      <header class="trip-page-head"><span>路线 02 / 活动</span><h2>活动 / 日程</h2><a class="section-back" href="#home" data-page-link="home">返回首页</a></header>
      <div class="trip-activity-switch">
        <div class="activity-view-tabs"><button type="button" class="active" data-activity-view="timeline">当天日程</button><button type="button" data-activity-view="programs">活动详情</button></div>
        <div data-oe-mount="activity-days" class="activity-day-tabs"></div>
      </div>
      <div class="activity-page-block" data-activity-panel="timeline"><div data-oe-mount="schedule" class="activity-detail-list"></div></div>
      <div class="activity-page-block" data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="activity-project-list participation-list"></div></div>
      <nav class="trip-page-pager"><a href="#booths" data-target-mode="page" data-page-link="booths">← 上一站</a><b>02 / 04</b><a href="#guests" data-target-mode="page" data-page-link="guests">下一站 →</a></nav>
    </section>

    <section class="trip-page oe-page-view" id="guests">
      <header class="trip-page-head"><span>路线 03 / 嘉宾</span><h2>嘉宾阵容</h2><a class="section-back" href="#home" data-page-link="home">返回首页</a></header>
      <div class="guest-grid" data-oe-mount="guests"></div>
      <nav class="trip-page-pager"><a href="#activities" data-target-mode="page" data-page-link="activities">← 上一站</a><b>03 / 04</b><a href="#guide" data-target-mode="page" data-page-link="guide">下一站 →</a></nav>
    </section>

    <section class="trip-page oe-page-view" id="guide">
      <header class="trip-page-head"><span>路线 04 / 指南</span><h2>观展指南</h2><a class="section-back" href="#home" data-page-link="home">返回首页</a></header>
      <div class="guide-detail-grid" data-oe-mount="guide-detail"></div>
      <nav class="trip-page-pager"><a href="#guests" data-target-mode="page" data-page-link="guests">← 上一站</a><b>04 / 04</b><a href="#home" data-page-link="home">首页 →</a></nav>
    </section>

    <section class="trip-community" id="community"><header><span>官方渠道</span><h2>社群与联络</h2></header><div data-oe-mount="community" class="community"></div></section>
    <section class="trip-sponsors" id="sponsors"><header><span>合作伙伴</span><h2>赞助支持</h2></header><div data-oe-mount="sponsors" class="sponsors"></div></section>
  </main>

  <footer class="trip-footer footer">
    <div class="trip-footer-mark">ONLY<br>EVENT</div>
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

.trip-rail{position:fixed;left:0;top:78px;bottom:0;z-index:60;width:28px;display:flex;flex-direction:column;align-items:center;gap:16px;padding:18px 0 14px;background:#2f2926;color:#fff;border-right:1px solid #5b514a;pointer-events:none}.trip-rail span{writing-mode:vertical-rl;font:800 6px/1 monospace;letter-spacing:.17em}.trip-rail i{flex:1;width:1px;background:linear-gradient(#ef7d90,#9bd1e2,#dcff42)}.trip-rail b,.trip-rail em{writing-mode:vertical-rl;font:800 6px/1 monospace;letter-spacing:.12em;font-style:normal;color:#bdb4ae}
.trip-site>main,.trip-footer{margin-left:28px}.trip-header{margin-left:28px}
[data-trip-section]{position:relative}[data-trip-section]:before{content:attr(data-trip-section);position:absolute;left:12px;top:18px;z-index:3;font:800 6px/1 monospace;letter-spacing:.16em;color:#9b8c7e;writing-mode:vertical-rl}
.trip-header{position:sticky;top:0;z-index:90;display:grid;grid-template-columns:260px minmax(230px,1fr) auto auto;min-height:78px;background:rgba(255,250,240,.97);border-bottom:1px solid var(--trip-line);backdrop-filter:blur(14px)}
.trip-logo{display:grid;align-content:center;padding:12px 24px;border-right:1px solid var(--trip-line)}.trip-logo small{font:700 9px/1.3 monospace;letter-spacing:.16em;color:#887969}.trip-logo b{margin-top:5px;font:600 23px/.9 Georgia,serif;letter-spacing:-.04em}
.trip-flight-info{display:flex;align-items:center;gap:13px;padding:0 22px;font:700 10px/1.2 monospace;letter-spacing:.1em;color:#66584e}.trip-flight-info i{width:5px;height:5px;border-radius:50%;background:var(--trip-pink)}
.trip-nav{display:flex}.trip-nav a{min-width:82px;display:grid;place-items:center;padding:10px 14px;border-left:1px solid var(--trip-line);font:700 12px/1.1 Georgia,serif}.trip-nav small{display:block;margin-bottom:5px;font:700 9px/1 monospace;color:var(--trip-pink)}
.trip-ticket{display:grid;place-items:center;padding:0 26px;background:var(--trip-lime);border-left:1px solid var(--trip-ink);font:900 11px/1 monospace;letter-spacing:.09em}.trip-mobile-nav{display:none}

.trip-hero{min-height:calc(100vh - 78px);display:grid;grid-template-columns:minmax(0,1.15fr) minmax(370px,.85fr);grid-template-rows:1fr auto;border-bottom:1px solid var(--trip-line)}
.trip-hero-visual{position:relative;min-height:720px;padding:5vw 2.5vw 4vw 5vw;background:linear-gradient(145deg,#b7e0ea 0 52%,#eee7db 52%)}.trip-hero-visual:before{content:"KEY VISUAL / 活动主视觉";position:absolute;left:15px;top:50%;writing-mode:vertical-rl;transform:translateY(-50%);font:800 7px/1 monospace;letter-spacing:.2em;color:#fff}
.trip-hero-visual .kv{position:absolute;inset:5vw 8% 6vw 6%;background:#d8d1c7 center/cover no-repeat;border:14px solid #fff;border-bottom-width:72px;box-shadow:0 25px 50px #4a37252b;transform:rotate(-1.2deg)}
.trip-photo-caption{position:absolute;left:11%;bottom:7vw;display:flex;gap:18px;font:700 10px/1.2 monospace;letter-spacing:.08em}.trip-photo-caption span{color:var(--trip-pink)}
.trip-hero-copy{position:relative;display:flex;flex-direction:column;justify-content:center;padding:6vw 5vw 5vw 4vw;background:var(--trip-paper)}.trip-route{margin-bottom:26px;font:800 10px/1.2 monospace;letter-spacing:.17em;color:var(--trip-pink)}
.trip-hero-copy h1{margin:0;font:500 clamp(62px,7.5vw,120px)/.8 Georgia,serif;letter-spacing:-.07em}.trip-hero-copy h1 em{color:var(--trip-pink);font-style:italic}.trip-hero-copy>p{max-width:500px;margin:28px 0;font-size:16px;line-height:1.85;color:#665a50}
.trip-hero-meta{display:grid;gap:9px;padding-top:18px;border-top:1px dashed var(--trip-line);font:700 12px/1.45 monospace}.trip-hero-meta a{text-decoration:underline;text-underline-offset:3px}
.trip-stamp{position:absolute;right:30px;bottom:34px;width:94px;height:94px;display:grid;place-items:center;text-align:center;border:2px solid var(--trip-pink);border-radius:50%;transform:rotate(10deg);font:700 8px/1.2 monospace;color:var(--trip-pink)}.trip-stamp b{font-size:19px}
.trip-weather-strip{grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr);background:#2f2926;color:#fff}.trip-weather-strip span{display:grid;gap:6px;padding:16px 22px;border-right:1px solid #5c514b;font:700 12px/1.3 monospace}.trip-weather-strip b{font-size:8px;letter-spacing:.14em;color:var(--trip-blue)}


.trip-hero-visual .kv,.trip-collage,.trip-opening-cassette,.trip-ticket-stub,.scrap-polaroid{will-change:transform}
.trip-hero-visual .kv{transition:transform .7s cubic-bezier(.2,.7,.2,1),box-shadow .7s}.trip-hero:hover .trip-hero-visual .kv{transform:rotate(.2deg) scale(1.015);box-shadow:0 34px 70px #4a372536}
.trip-card{transition:transform .5s cubic-bezier(.2,.7,.2,1)}.trip-intro:hover .trip-card.c1{transform:rotate(-11deg) translate(-4px,-4px)}.trip-intro:hover .trip-card.c2{transform:rotate(12deg) translate(5px,-3px)}.trip-intro:hover .trip-card.c3{transform:rotate(0deg) translateY(4px)}
.trip-index .scrap-index-card,.trip-nav a,.trip-mobile-nav a,.trip-ticket,.trip-page-pager a{transition:background .25s,color .25s,transform .25s}.trip-index .scrap-index-card:hover{background:#3b3430!important;transform:translateY(-4px)!important}.trip-nav a:hover{background:#f1e9dd}.trip-ticket:hover{background:#c9ef28}.trip-page-pager a:hover{transform:translateX(3px)}.trip-page-pager a:first-child:hover{transform:translateX(-3px)}
.trip-sides article{transition:filter .35s,transform .35s}.trip-sides article:hover{filter:saturate(1.08);transform:translateY(-3px)}
.trip-route-ticker{overflow:hidden;background:var(--trip-lime);border-bottom:1px solid var(--trip-ink);white-space:nowrap}.trip-route-ticker>div{display:inline-flex;min-width:max-content;animation:tripTicker 28s linear infinite}.trip-route-ticker span{display:inline-block;padding:13px 28px;border-right:1px solid #8e9d31;font:900 10px/1 monospace;letter-spacing:.13em}@keyframes tripTicker{to{transform:translateX(-50%)}}


.trip-news,.trip-intro,.trip-index,.trip-feature,.trip-ticket-section,.trip-map{isolation:isolate}
.trip-news:after,.trip-intro:after,.trip-index:after,.trip-feature:after,.trip-ticket-section:after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:7px;z-index:5;background:linear-gradient(135deg,transparent 6px,currentColor 0) 0 0/12px 7px repeat-x;opacity:.08;pointer-events:none}
.trip-news{display:grid;grid-template-columns:240px 1fr;background:var(--trip-paper);border-bottom:1px solid var(--trip-line)}.trip-news>header{padding:44px 30px;border-right:1px solid var(--trip-line)}.trip-news>header span,.trip-index>header span,.trip-feature>header>span,.trip-ticket-cover small,.trip-map-copy>span,.trip-page-head>span,.trip-community header span,.trip-sponsors header span{font:800 9px/1.2 monospace;letter-spacing:.17em;color:var(--trip-pink)}
.trip-news>header b{display:block;margin-top:12px;font:500 34px/.92 Georgia,serif}.trip-news>header small{display:block;margin-top:22px;font:700 11px/1.7 monospace;letter-spacing:.06em;color:#8a7c70}.trip-news-columns{display:grid;grid-template-columns:120px 90px 1fr;align-content:end;padding:20px 32px 0;font:800 9px/1 monospace;letter-spacing:.12em;color:#8a7c70}
.trip-news .updates-list{grid-column:2;padding:0 32px 24px}.scrap-update{display:grid!important;grid-template-columns:110px 90px 1fr auto!important;align-items:center;gap:0!important;padding:16px 0!important;border:0!important;border-bottom:1px dashed var(--trip-line)!important;background:none!important;box-shadow:none!important;transform:none!important;border-radius:0!important}.scrap-update time{font:700 10px/1.2 monospace}.scrap-update small{font:800 9px/1 monospace;color:#9a8b7e;letter-spacing:.1em}.scrap-update b{font-size:15px;font-weight:700}.scrap-update>span{font:800 9px/1 monospace;color:var(--trip-pink)}

.trip-intro{display:grid;grid-template-columns:150px minmax(0,1fr) 430px;gap:56px;align-items:center;padding:135px max(5vw,42px);border-bottom:1px solid var(--trip-line)}.trip-intro>aside{align-self:start}.trip-intro>aside span{font:800 7px/1 monospace;letter-spacing:.18em}.trip-intro>aside b{display:block;margin-top:20px;font:500 92px/.8 Georgia,serif;color:#d1c3b3}
.trip-intro-copy h2{margin:0 0 36px;font:500 clamp(38px,4.8vw,68px)/1.05 Georgia,serif;letter-spacing:-.04em}.trip-intro-copy p{max-width:700px;font-size:16px;line-height:1.9;color:#6d6056}.trip-intro-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:44px;border-block:1px solid var(--trip-line)}.trip-intro-facts>div{display:grid;gap:9px;padding:16px 18px;border-right:1px solid var(--trip-line)}.trip-intro-facts>div:first-child{padding-left:0}.trip-intro-facts>div:last-child{border-right:0}.trip-intro-facts small{font:800 9px/1.2 monospace;letter-spacing:.12em;color:#9b8c7e}.trip-intro-facts b{font:600 14px/1.45 monospace}
.trip-collage{height:390px;position:relative}.trip-card{position:absolute;width:180px;height:230px;background:#d5cec3;border:10px solid #fff;box-shadow:0 12px 28px #4a382725}.trip-card.c1{left:10px;top:16px;transform:rotate(-8deg);background:#add5df}.trip-card.c2{right:8px;top:48px;transform:rotate(9deg);background:#efb8c2}.trip-card.c3{left:118px;bottom:0;transform:rotate(2deg);background:#e4d49e}.trip-card span{position:absolute;left:9px;bottom:-27px;font:800 7px/1 monospace;letter-spacing:.12em;color:#6d6056}
.trip-event-badge{position:absolute;left:74px;top:116px;z-index:3;width:270px;height:170px;display:grid;grid-template-columns:70px 1fr;grid-template-rows:1fr auto;padding:22px;background:#2f2926;color:#fff;border:1px solid #171411;box-shadow:12px 14px 0 #b9a58f;transform:rotate(-4deg)}.trip-event-badge>span{grid-row:1/-1;align-self:center;font:500 54px/.85 Georgia,serif;color:var(--trip-lime)}.trip-event-badge>b{align-self:center;font:500 24px/.95 Georgia,serif}.trip-event-badge>small{font:800 6px/1.5 monospace;letter-spacing:.1em;color:#bfb5ad}

.trip-index{display:grid;grid-template-columns:240px 1fr;background:#2f2926;color:#fff;border-bottom:1px solid #5c514b}.trip-index>header{padding:45px 30px;border-right:1px solid #5c514b}.trip-index>header b{display:block;margin-top:14px;font:500 27px/1.05 Georgia,serif}.trip-index .quick-grid{display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:0!important}.scrap-index-card{min-height:245px!important;display:flex!important;flex-direction:column!important;justify-content:space-between!important;padding:28px 22px 24px!important;border:0!important;border-right:1px solid #5c514b!important;border-radius:0!important;background:transparent!important;color:#fff!important;box-shadow:none!important;transform:none!important;position:relative;overflow:hidden}.scrap-index-card:after{content:"";position:absolute;right:-44px;bottom:-52px;width:130px;height:130px;border:1px solid #5c514b;border-radius:50%;transition:transform .35s}.scrap-index-card:hover:after{transform:scale(1.18)}.scrap-index-card>span{font:500 36px/1 Georgia,serif!important;color:#746961!important}.scrap-index-card small{font:700 9px/1.2 monospace!important;color:var(--trip-pink)!important}.scrap-index-card b{display:block;margin-top:8px;font:500 24px/1 Georgia,serif!important}.scrap-index-card em{margin-top:9px;font:700 11px/1.55 monospace!important;color:#aaa09a!important;font-style:normal!important}.scrap-index-card>i{align-self:flex-end;color:var(--trip-lime);font-style:normal}

.trip-feature{display:grid;grid-template-columns:310px 1fr;gap:58px;padding:120px max(5vw,44px);background:#e4f0f2;border-bottom:1px solid #a7c7cf}.trip-feature>header{position:sticky;top:110px;align-self:start}.trip-feature h2{margin:10px 0 20px;font:500 54px/.9 Georgia,serif}.trip-feature>header p{font-size:15px;line-height:1.8;color:#587078}.trip-feature .featured-activity-grid{display:grid!important;grid-template-columns:1fr!important;gap:30px!important}.trip-feature .scrap-activity{display:grid!important;grid-template-columns:minmax(250px,.75fr) 1fr!important;background:var(--trip-paper)!important;border:1px solid #b5cdd2!important;box-shadow:none!important;transform:none!important}

.trip-ticket-section{display:grid;grid-template-columns:34% 66%;min-height:650px;background:#f1d9cd;border-bottom:1px solid #c4a395}.trip-ticket-cover{display:flex;flex-direction:column;justify-content:space-between;padding:56px 46px;background:var(--trip-pink);color:#fff;border-right:1px solid #a25d69}.trip-ticket-cover small{color:#fff}.trip-ticket-cover b{font:500 clamp(62px,8vw,116px)/.8 Georgia,serif;letter-spacing:-.06em}.trip-ticket-cover span{font:700 8px/1 monospace;letter-spacing:.12em}.trip-ticket-list{padding:58px max(4vw,34px)}.trip-ticket-list .ticket-grid{display:grid!important;grid-template-columns:1fr!important;gap:14px!important}.scrap-pass{display:grid!important;grid-template-columns:90px 1fr 150px!important;background:var(--trip-paper)!important;border:1px solid #bc9f91!important;box-shadow:none!important;transform:none!important}.scrap-pass:nth-child(2n){transform:translateX(18px)!important}.scrap-pass-no{border-right:1px dashed #bc9f91!important}.ticket-actions{margin-top:24px}.btn,.ticket-purchase-link{border-radius:0!important}

.trip-map{display:grid;grid-template-columns:34% 66%;min-height:620px;background:var(--trip-paper);border-bottom:1px solid var(--trip-line)}.trip-map-copy{padding:72px 48px;border-right:1px dashed var(--trip-line)}.trip-map-copy h2{margin:12px 0 20px;font:500 60px/.9 Georgia,serif}.trip-map-copy p{font-size:15px;line-height:1.8;color:#6c6057}.trip-map-paper{padding:34px;background-image:linear-gradient(#c8bcae44 1px,transparent 1px),linear-gradient(90deg,#c8bcae44 1px,transparent 1px);background-size:32px 32px}.trip-map .map-static{height:100%;min-height:520px;border:0!important;border-radius:0!important;box-shadow:8px 10px 0 #d4c7b6!important}

.trip-page{padding:78px max(5vw,44px) 110px;min-height:calc(100vh - 78px);background:var(--trip-bg)}.trip-page-head{display:grid;grid-template-columns:1fr auto;gap:8px 30px;align-items:end;max-width:1220px;margin:0 auto 50px;padding-bottom:20px;border-bottom:1px solid var(--trip-line)}.trip-page-head>span{grid-column:1/-1}.trip-page-head h2{margin:0;font:500 clamp(45px,6vw,78px)/.9 Georgia,serif}.trip-page-head .section-back{font:800 8px/1 monospace;border-bottom:1px solid var(--trip-ink);padding-bottom:5px}

.trip-page#guests:before{content:"CHARACTER / 嘉宾阵容";font-size:7px}.trip-page#guests .trip-page-head:before{content:"COMPANIONS";position:absolute;left:0;bottom:-22px;font:500 clamp(70px,10vw,150px)/.7 Georgia,serif;letter-spacing:-.07em;color:#ded4c8;z-index:-1;white-space:nowrap}.trip-page#activities .trip-page-head:before{content:"PROGRAM";position:absolute;left:0;bottom:-22px;font:500 clamp(70px,10vw,150px)/.7 Georgia,serif;letter-spacing:-.07em;color:#ded4c8;z-index:-1;white-space:nowrap}
.trip-page:before{content:"ONLY EVENT / 活动资料";display:block;max-width:1220px;margin:0 auto 18px;font:800 7px/1 monospace;letter-spacing:.18em;color:#9c8d80}.trip-page:after{content:"";position:fixed;right:14px;bottom:18px;width:34px;height:34px;border:1px solid #b9aa97;border-radius:50%;pointer-events:none}
.trip-page-head{position:relative}.trip-page-head:after{content:"✈";position:absolute;right:0;top:4px;font-size:20px;color:#c7b8a8}.trip-page-head h2{letter-spacing:-.045em}.trip-page-head .section-back{justify-self:end}

.trip-page-pager{max-width:1220px;margin:72px auto 0;padding-top:18px;border-top:1px solid var(--trip-line);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;font:800 8px/1 monospace;letter-spacing:.12em}.trip-page-pager a:last-child,.trip-page-pager span:last-child{text-align:right}.trip-page-pager b{font:500 20px/1 Georgia,serif;color:#c2b3a3}
.trip-page>.booth-directory-rich,.trip-page>.guest-grid,.trip-page>.guide-detail-grid,.trip-page>.activity-page-block,.trip-page>.trip-activity-switch{position:relative}
.booth-directory-rich:before,.guest-grid:before,.guide-detail-grid:before,.activity-detail-list:before,.activity-project-list:before{display:block;margin-bottom:14px;font:800 7px/1 monospace;letter-spacing:.14em;color:#9a8b7f}
.booth-directory-rich:before{content:"BOOTH / 摊位目录"}.guest-grid:before{content:"嘉宾阵容 / PROFILE"}.guide-detail-grid:before{content:"观展笔记 / 信息"}.activity-detail-list:before{content:"TIMETABLE / 当天日程"}.activity-project-list:before{content:"PROGRAM / 活动详情"}
.trip-page>.booth-directory-rich,.trip-page>.guest-grid,.trip-page>.guide-detail-grid,.trip-page>.activity-page-block,.trip-page>.trip-activity-switch{max-width:1220px;margin-left:auto;margin-right:auto}.trip-activity-switch{display:flex;justify-content:space-between;gap:20px;margin-bottom:28px}
.activity-view-tabs,.activity-day-tabs{display:flex;gap:8px}.activity-view-tabs button,.activity-day-tabs button{padding:9px 13px;border:1px solid var(--trip-line);background:var(--trip-paper);font:800 8px/1 monospace}.activity-view-tabs button.active,.activity-day-tabs button.active{background:var(--trip-ink);color:#fff}
.scrap-itinerary,.scrap-guide{box-shadow:none!important;transform:none!important}

.trip-community,.trip-sponsors{padding:88px max(5vw,44px);background:#2f2926;color:#fff;border-top:1px solid #5c514b}.trip-community header,.trip-sponsors header{max-width:1220px;margin:0 auto 26px}.trip-community h2,.trip-sponsors h2{margin:8px 0 0;font:500 clamp(36px,5vw,60px)/1 Georgia,serif}.trip-community .community,.trip-sponsors .sponsors{max-width:1220px;margin:auto}.community{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#5c514b}.sponsors{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:#5c514b}
.trip-footer{display:grid;grid-template-columns:220px repeat(4,1fr);gap:0;background:#171411;color:#fff;border-top:1px solid #514740}.trip-footer>div{padding:34px 26px;border-right:1px solid #514740}.trip-footer-mark{font:500 30px/.9 Georgia,serif}

/* Shared Core components, restyled as Template 02 native travel records */
.booth-directory-tools{display:grid;grid-template-columns:auto minmax(260px,1fr) auto;gap:14px;align-items:center;margin-bottom:26px;padding-bottom:18px;border-bottom:1px solid var(--trip-line)}.directory-tabs{display:flex}.directory-tabs button,.booth-directory-tools>[data-directory-saved]{padding:11px 14px;border:1px solid var(--trip-line);border-radius:0;background:var(--trip-paper);font:800 10px/1 monospace}.directory-tabs button.active,.booth-directory-tools>[data-directory-saved].active{background:var(--trip-ink);color:#fff}.booth-search{display:grid;grid-template-columns:auto 1fr auto;align-items:center;border-bottom:1px solid var(--trip-ink);padding:4px 0}.booth-search input{width:100%;border:0;background:transparent;padding:10px 8px;font:700 14px/1.3 monospace;outline:0}.directory-search-clear{border:0;background:none;font-size:18px}
.booth-directory-grid,.product-directory-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.scrap-booth{position:relative;display:grid;grid-template-columns:92px 1fr;gap:20px;padding:22px 22px 22px 44px;background:var(--trip-paper);border:0;border-bottom:1px solid var(--trip-line)}.scrap-booth-pin{position:absolute;left:0;top:0;bottom:0;width:28px;display:grid;place-items:center;writing-mode:vertical-rl;background:#2f2926;color:#fff;font:700 7px/1 monospace;letter-spacing:.1em}.scrap-booth .booth-logo{width:92px;height:92px;object-fit:cover;background:#ddd;border:0}.scrap-booth h3{margin:8px 0 10px;font:500 28px/1 Georgia,serif}.scrap-booth p{font-size:14px;line-height:1.75;color:#6d6056}.scrap-booth footer{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.scrap-booth footer button,.scrap-product footer button{padding:9px 11px;border:1px solid var(--trip-line);border-radius:0;background:#f7f0e5;font:800 10px/1 monospace}.favorite-booth.active,.wishlist-product.active{background:var(--trip-lime)!important;color:var(--trip-ink)!important}
.scrap-product{display:grid;grid-template-columns:150px 1fr;gap:18px;padding:14px 14px 14px 26px;background:var(--trip-paper);border:0;border-bottom:1px solid var(--trip-line);position:relative}.scrap-product:before{content:"制品";position:absolute;left:4px;top:14px;writing-mode:vertical-rl;font:800 6px/1 monospace;letter-spacing:.14em;color:var(--trip-pink)}.directory-product-image{position:relative;width:150px;aspect-ratio:1;border:0;padding:0;background:#ddd;overflow:hidden}.directory-product-image img{width:100%;height:100%;object-fit:cover}.product-image-zoom{position:absolute;right:6px;bottom:6px;display:grid;place-items:center;width:28px;height:28px;background:#fff;border:1px solid var(--trip-ink)}.scrap-product .product-tag{display:block;font:800 9px/1 monospace;color:var(--trip-pink);font-style:normal}.scrap-product b{display:block;margin:8px 0;font:500 23px/1.1 Georgia,serif}.scrap-product small{font:700 10px/1.4 monospace;color:#7b6e63}.scrap-product footer{display:flex;justify-content:space-between;align-items:center;margin-top:18px}
.directory-pagination{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:26px}.directory-pagination button{border:1px solid var(--trip-line);background:var(--trip-paper);padding:8px 12px}.directory-filtered-out{display:none!important}.booth-no-result{padding:42px;text-align:center;border:1px dashed var(--trip-line)}

.scrap-itinerary{display:grid;grid-template-columns:54px 120px 1fr;gap:20px;padding:24px 0;border-bottom:1px solid var(--trip-line);position:relative}.scrap-itinerary:after{content:"出发";position:absolute;right:0;top:28px;font:800 6px/1 monospace;letter-spacing:.12em;color:#a99b8f}.scrap-itinerary-no{font:500 30px/1 Georgia,serif;color:#cdbfaf}.scrap-itinerary time strong{font:500 21px/1 Georgia,serif}.scrap-itinerary time small{display:block;margin-top:5px;font:700 7px/1 monospace}.scrap-itinerary>div>small{font:800 7px/1 monospace;color:var(--trip-pink)}.scrap-itinerary>div>b{display:block;margin:7px 0;font:500 27px/1.05 Georgia,serif}.scrap-itinerary p{font-size:14px;line-height:1.75;color:#6d6056}.scrap-itinerary footer{display:flex;gap:12px;margin-top:12px;font:800 7px/1 monospace}
.scrap-activity{position:relative;display:grid;grid-template-columns:minmax(320px,.9fr) minmax(360px,1.1fr);min-height:360px;background:var(--trip-paper);border:0;border-bottom:1px solid var(--trip-line);overflow:hidden}.scrap-activity:nth-child(2n){grid-template-columns:minmax(360px,1.1fr) minmax(320px,.9fr)}.scrap-activity:nth-child(2n) .scrap-activity-photo{grid-column:2}.scrap-activity:nth-child(2n) .scrap-activity-note{grid-column:1;grid-row:1}.scrap-activity:before{content:"DESTINATION";position:absolute;right:14px;top:12px;z-index:3;font:800 6px/1 monospace;letter-spacing:.14em;color:#a99a8e}.scrap-activity-photo{min-height:360px;background:#d8d1c7}.scrap-activity-photo img{width:100%;height:100%;object-fit:cover}.scrap-activity-note{display:flex;flex-direction:column;justify-content:center;padding:44px 48px}.scrap-activity-note>span{font:800 7px/1 monospace;color:var(--trip-pink)}.scrap-activity-note h3{margin:10px 0 18px;font:500 clamp(34px,4vw,56px)/.95 Georgia,serif;letter-spacing:-.035em}.scrap-activity-note>small{font:800 7px/1 monospace}.scrap-activity-note p{font-size:14px;line-height:1.8;color:#6d6056}

.guest-grid{display:flex!important;gap:0!important;overflow-x:auto;padding:0 0 28px;scroll-snap-type:x mandatory;scrollbar-width:none}.guest-grid::-webkit-scrollbar{display:none}.scrap-guest{position:relative;flex:0 0 min(1080px,88vw);min-height:610px;display:grid;grid-template-columns:minmax(320px,.8fr) minmax(380px,1.2fr);gap:58px;align-items:center;padding:56px 72px 62px;background:var(--trip-paper);border-right:1px solid var(--trip-line);scroll-snap-align:start;overflow:hidden}.scrap-guest:before{content:"CHARACTER / TRAVEL COMPANION";position:absolute;left:32px;top:22px;font:800 7px/1 monospace;letter-spacing:.16em;color:#a09285}.scrap-guest:after{content:"";position:absolute;right:-120px;top:-110px;width:360px;height:360px;border:1px solid #dacfc1;border-radius:50%;box-shadow:0 0 0 48px transparent,0 0 0 49px #e6ddd2;pointer-events:none}.scrap-polaroid{position:relative;z-index:2;padding:12px 12px 42px;background:#fff;box-shadow:0 18px 36px #4a382726;transform:rotate(-2deg)}.scrap-guest:nth-child(2n) .scrap-polaroid{transform:rotate(2deg)}.scrap-polaroid .guest-image{width:100%;aspect-ratio:4/5;border:0;background:#ddd}.scrap-polaroid .guest-image img{width:100%;height:100%;object-fit:cover}.scrap-polaroid>span{display:block;margin-top:12px;font:700 7px/1 monospace;letter-spacing:.12em}.scrap-guest-note{position:relative;z-index:2;padding-top:30px}.scrap-guest-note>small{font:800 8px/1 monospace;color:var(--trip-pink);letter-spacing:.12em}.scrap-guest-note>.guest-poster-name{display:block;margin:12px 0 24px;font:500 clamp(46px,5vw,74px)/.9 Georgia,serif;letter-spacing:-.045em}.scrap-tape-meta{display:grid;grid-template-columns:100px 1fr;gap:18px;padding:16px 0;border-block:1px dashed var(--trip-line);font-size:11px}.guest-info-block{margin-top:18px;max-width:620px}.guest-info-block b{display:block;margin-bottom:7px;font-size:10px}.guest-info-block p,.guest-info-block span{font-size:14px;line-height:1.85;color:#6d6056}.scrap-guest-route{position:absolute;left:72px;right:72px;bottom:20px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;font:800 7px/1 monospace;letter-spacing:.14em;color:#9a8c80}.scrap-guest-route span:last-child{text-align:right}.scrap-guest-route b{font:500 20px/1 Georgia,serif;color:#c4b5a4}

.guide-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.scrap-guide{display:grid;grid-template-columns:46px 1fr;gap:16px;padding:24px;background:var(--trip-paper);border:0;border-bottom:1px solid var(--trip-line);position:relative}.scrap-guide:after{content:"观展笔记";position:absolute;right:12px;top:12px;font:800 6px/1 monospace;letter-spacing:.12em;color:#b3a498}.scrap-guide>span{font:800 7px/1 monospace;color:var(--trip-pink)}.scrap-guide small{font:800 7px/1 monospace;color:#807266}.scrap-guide h3{margin:8px 0 12px;font:500 29px/1 Georgia,serif}.scrap-guide p{font-size:14px;line-height:1.8;color:#6d6056}.scrap-guide img{grid-column:1/-1;width:100%;margin-top:10px}
.map-link-list{display:grid;gap:8px;margin-top:24px}.scrap-map-tag{display:grid;grid-template-columns:32px 1fr auto;align-items:center;gap:10px;padding:10px 0;border-bottom:1px dashed var(--trip-line)}.scrap-map-tag b{font:500 18px/1 Georgia,serif;color:#c8b8a7}.scrap-map-tag span{font:800 8px/1 monospace}.scrap-map-tag i{font-style:normal;color:var(--trip-pink)}

.scrap-social{display:grid;grid-template-columns:100px 1fr;gap:18px;padding:18px;background:#201c19}.scrap-social .social-image{width:100px;height:100px;border:0;background:#fff}.scrap-social .social-image img{width:100%;height:100%;object-fit:cover}.scrap-social>div>span{font:800 7px/1 monospace;color:var(--trip-blue)}.scrap-social b{display:block;margin:8px 0;font:500 21px/1 Georgia,serif}.scrap-social p{font-size:13px;line-height:1.7;color:#c9c0ba}.variant-sponsor{padding:20px;background:#201c19;border:0}.variant-sponsor img{max-width:100%;max-height:70px;object-fit:contain}.variant-sponsor b{display:block;margin-top:12px;font:500 17px/1 Georgia,serif}.variant-sponsor small{font:700 7px/1 monospace;color:#aaa09a}
@media(max-width:760px){.booth-directory-tools{grid-template-columns:1fr}.booth-directory-grid,.product-directory-grid,.guide-detail-grid{grid-template-columns:1fr}.guest-grid{display:flex!important}.scrap-guest{flex:0 0 92vw;min-height:0;grid-template-columns:130px 1fr;gap:16px;padding:46px 18px 56px}.scrap-guest-route{left:18px;right:18px}.scrap-activity,.scrap-activity:nth-child(2n){grid-template-columns:1fr}.scrap-activity:nth-child(2n) .scrap-activity-photo,.scrap-activity:nth-child(2n) .scrap-activity-note{grid-column:1}.scrap-activity:nth-child(2n) .scrap-activity-photo{grid-row:1}.scrap-activity:nth-child(2n) .scrap-activity-note{grid-row:2}.scrap-booth{grid-template-columns:72px 1fr}.scrap-booth .booth-logo{width:72px;height:72px}.scrap-product{grid-template-columns:110px 1fr}.directory-product-image{width:110px}.scrap-itinerary{grid-template-columns:42px 86px 1fr;gap:12px}.scrap-activity{grid-template-columns:1fr}.scrap-guest{grid-template-columns:130px 1fr;gap:16px}.scrap-guest-note>.guest-poster-name{font-size:28px}}

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
.trip-opening-board{position:relative;justify-self:center;width:min(36vw,480px);background:#2f2926;color:#fff;border:1px solid #171411;box-shadow:18px 22px 0 rgba(47,41,38,.18);transform:rotate(-1.5deg)}.trip-opening-board>header,.trip-opening-board>footer{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #5b514a;font:800 9px/1.2 monospace;letter-spacing:.13em}.trip-opening-board>footer{border-top:1px solid #5b514a;border-bottom:0;background:var(--trip-lime);color:#2f2926}.trip-opening-board-row{display:grid;grid-template-columns:72px 1fr;gap:14px;align-items:center;padding:18px 16px;border-bottom:1px solid #5b514a}.trip-opening-board-row small{font:800 9px/1.2 monospace;color:var(--trip-blue)}.trip-opening-board-row strong{font:500 22px/1 Georgia,serif;letter-spacing:-.025em}
.trip-opening-copy{align-self:end;padding-bottom:20px}.trip-opening-copy>span{font:900 10px/1.2 monospace;letter-spacing:.18em}.trip-opening-copy h1{margin:10px 0 18px;font:500 clamp(58px,7vw,110px)/.8 Georgia,serif;letter-spacing:-.07em}.trip-opening-copy p{max-width:430px;margin:0;font:800 11px/1.6 monospace;letter-spacing:.13em}
.trip-opening-gate>.entry-photo{position:absolute;right:-4vw;top:9vh;width:28vw;height:34vw;opacity:.16;background:center/cover no-repeat;filter:grayscale(1);transform:rotate(8deg);mix-blend-mode:multiply;pointer-events:none}.trip-opening-gate>.stub-barcode{position:absolute;left:28px;bottom:76px;width:180px;height:30px;opacity:.4;background:repeating-linear-gradient(90deg,#2f2926 0 2px,transparent 2px 5px,#2f2926 5px 6px,transparent 6px 9px)}
.skip{position:fixed;right:24px;bottom:72px;z-index:6;border:1px solid var(--trip-ink);border-radius:0;background:var(--trip-lime);padding:11px 15px;font:800 8px/1 monospace;cursor:pointer}
@keyframes reelSpin{to{transform:rotate(360deg)}}@keyframes cassetteFloat{50%{transform:rotate(-2deg) translateY(-10px)}}

@media(max-width:980px){.trip-header{grid-template-columns:220px 1fr auto}.trip-flight-info{display:none}.trip-hero{grid-template-columns:1fr}.trip-hero-visual{min-height:620px}.trip-hero-copy{padding:54px 7vw}.trip-weather-strip{grid-row:3}.trip-intro{grid-template-columns:100px 1fr}.trip-collage{grid-column:2}.trip-feature{grid-template-columns:1fr}.trip-feature>header{position:static}.trip-ticket-section,.trip-map{grid-template-columns:1fr}.trip-ticket-cover{min-height:300px}}
@media(max-width:760px){.trip-rail{display:none}.trip-site>main,.trip-footer,.trip-header{margin-left:0}[data-trip-section]:before{display:none}.trip-opening-center{grid-template-columns:1fr;gap:26px;padding:74px 18px 70px}.trip-opening-route{display:none}.trip-opening-board{width:min(88vw,420px)}.trip-opening-copy{text-align:center;align-self:center}.trip-opening-copy h1{font-size:clamp(48px,15vw,78px)}.trip-opening-topbar{grid-template-columns:1fr auto;padding:0 14px}.trip-opening-topbar span:nth-child(2){display:none}.trip-opening-bottom{padding:0 14px;gap:10px;font-size:6px}.trip-opening-gate>.entry-photo{width:70vw;height:80vw;right:-22vw;top:10vh}.trip-header{grid-template-columns:1fr auto;min-height:60px}.trip-logo{padding:9px 14px;border-right:0}.trip-logo b{font-size:19px}.trip-nav{display:none}.trip-ticket{padding:0 14px}.trip-mobile-nav{position:sticky;top:60px;z-index:85;display:flex;overflow-x:auto;background:#2f2926;color:#fff}.trip-mobile-nav a{flex:0 0 auto;min-width:88px;padding:11px 13px;border-right:1px solid #5c514b;font:700 11px/1.1 Georgia,serif}.trip-mobile-nav small{display:block;margin-bottom:5px;font:700 8px/1 monospace;color:var(--trip-pink)}.trip-hero{min-height:0}.trip-hero-visual{min-height:430px;padding:24px 14px}.trip-hero-visual .kv{inset:26px 22px 55px;border-width:9px;border-bottom-width:44px;transform:rotate(-.6deg)}.trip-photo-caption{left:30px;bottom:30px}.trip-hero-copy{padding:44px 18px 50px}.trip-hero-copy h1{font-size:clamp(54px,18vw,82px)}.trip-stamp{width:70px;height:70px;right:18px;bottom:18px}.trip-weather-strip{grid-template-columns:1fr 1fr}.trip-news{grid-template-columns:1fr}.trip-news>header{border-right:0;border-bottom:1px solid var(--trip-line);padding:28px 18px}.trip-news-columns{display:none}.trip-news .updates-list{grid-column:1;padding:8px 18px 24px}.scrap-update{grid-template-columns:76px 1fr!important}.scrap-update>span{display:none}.trip-intro{grid-template-columns:1fr;gap:28px;padding:70px 18px}.trip-intro>aside b{font-size:62px}.trip-collage{grid-column:1;height:330px}.trip-event-badge{left:50%;top:100px;transform:translateX(-50%) rotate(-4deg);width:240px}.trip-ticket-stub{right:0;bottom:6px;width:150px}.trip-intro-facts{grid-template-columns:1fr}.trip-intro-facts>div{padding:12px 0;border-right:0;border-bottom:1px solid var(--trip-line)}.trip-intro-facts>div:last-child{border-bottom:0}.trip-index{grid-template-columns:1fr}.trip-index>header{border-right:0;border-bottom:1px solid #5c514b;padding:28px 18px}.trip-index .quick-grid{display:flex!important;overflow-x:auto!important}.scrap-index-card{flex:0 0 70%;min-height:170px!important}.trip-feature{padding:70px 18px;gap:34px}.trip-feature .scrap-activity{grid-template-columns:1fr!important}.trip-ticket-cover{min-height:240px;padding:38px 22px}.trip-ticket-cover b{font-size:64px}.trip-ticket-list{padding:28px 14px 48px}.scrap-pass{grid-template-columns:58px 1fr!important}.scrap-pass aside{grid-column:1/-1;border-left:0!important;border-top:1px dashed #bc9f91!important}.scrap-pass:nth-child(2n){transform:none!important}.trip-map-copy{padding:48px 18px}.trip-map-paper{padding:18px}.trip-map .map-static{min-height:360px}.trip-page{padding:52px 16px 74px}.trip-page-head{grid-template-columns:1fr;gap:12px;margin-bottom:34px}.trip-page-head .section-back{justify-self:start}.trip-activity-switch{display:grid}.community{grid-template-columns:1fr}.sponsors{grid-template-columns:repeat(2,minmax(0,1fr))}.trip-footer{grid-template-columns:1fr}.trip-footer>div{border-right:0;border-bottom:1px solid #514740}.scrap-entry-gate{grid-template-columns:1fr;width:min(92vw,520px);max-height:82vh;overflow:auto}.scrap-entry-photo{border-right:0;border-bottom:1px dashed #8d7f72}.entry-photo{min-height:250px}.scrap-entry-info{padding:22px}.entry-ticket-title{font-size:30px}}
`;
