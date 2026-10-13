/* Template 04 — Design Festa-inspired creator-market editorial shell. */
export const previewBody=`
<header class="df-head">
  <a class="df-brand" href="#home" data-page-link="home"><b data-oe-field="eventName">STARDUST ONLY</b><small>CREATOR EVENT</small></a>
  <nav data-oe-mount="nav-links" class="df-nav">
    <a href="#booths" data-target-mode="page" data-page-link="booths">摊位</a>
    <a href="#activities" data-target-mode="page" data-page-link="activities">活动</a>
    <a href="#guests" data-target-mode="page" data-page-link="guests">嘉宾</a>
    <a href="#guide" data-target-mode="page" data-page-link="guide">指南</a>
  </nav>
  <a class="df-ticket ticket-purchase-link" data-ticket-settings href="#" target="_blank" rel="noopener">TICKET ↗</a>
</header>

<main>
  <section class="hero df-hero oe-home-only" id="home">
    <div class="df-hero-copy hero-copy">
      <small>OFFICIAL EVENT SITE</small>
      <h1><span class="hero-title-1" data-oe-field="heroTitle1">CREATE</span><br><span class="hero-title-2" data-oe-field="heroTitle2">TOGETHER</span></h1>
      <p data-oe-field="tagline">创作、社团、舞台和同好，在同一天汇聚。</p>
      <div class="df-facts">
        <div><b>DATE</b><span data-oe-field="date">11.08 SUN</span></div>
        <div><b>CITY</b><span data-oe-field="location">杭州</span></div>
        <div><b>VENUE</b><a class="venue-nav" data-oe-field="edition" href="#" target="_blank" rel="noopener">杭州国际博览中心</a></div>
      </div>
    </div>
    <div class="df-poster"><div class="kv" data-oe-image="heroImage"></div><span>KEY VISUAL</span><b data-oe-lifecycle-status>活动未开始</b></div>
  </section>

  <section class="df-news oe-home-only">
    <div class="df-section-label"><span>01</span><b>NEWS</b></div>
    <div data-oe-mount="updates" class="updates-list"></div>
  </section>

  <section class="df-statement oe-home-only">
    <div class="df-section-label"><span>02</span><b>ABOUT</b></div>
    <div><h2>把“喜欢”<br>变成现场。</h2><p>社团、制品、角色、舞台与企划共同构成一次完整活动体验。</p></div>
  </section>

  <section class="df-index oe-home-only">
    <div class="df-section-label"><span>03</span><b>INDEX</b></div>
    <div data-oe-mount="quick" class="quick-grid"></div>
  </section>

  <section class="df-feature oe-home-only" id="participation">
    <div class="df-section-label"><span>04</span><b>FEATURED</b></div>
    <div data-oe-mount="featured-activities" class="participation-list"></div>
  </section>

  <section class="df-tickets oe-home-only" id="tickets">
    <div class="df-section-label"><span>05</span><b>TICKETS</b></div>
    <div><div data-oe-mount="tickets" class="ticket-grid"></div><div data-oe-mount="ticket-actions" class="ticket-actions"></div></div>
  </section>

  <section class="df-map oe-home-only" id="map-home">
    <div class="df-section-label"><span>06</span><b>VENUE</b></div>
    <div class="df-map-grid"><div data-oe-mount="map" class="map-static"></div><aside data-oe-mount="map-links" class="map-link-list"></aside></div>
  </section>

  <section class="df-community oe-home-only" id="community">
    <div class="df-section-label"><span>07</span><b>COMMUNITY</b></div>
    <div data-oe-mount="community" class="community"></div>
  </section>
  <section class="df-sponsors oe-home-only" id="sponsors">
    <div class="df-section-label"><span>08</span><b>SUPPORT</b></div>
    <div data-oe-mount="sponsors" class="sponsors"></div>
  </section>

  <section class="df-page oe-page-view" id="booths"><div class="df-page-head"><span>CIRCLE / GOODS</span><h2>摊位与制品</h2><a class="section-back" href="#home" data-page-link="home">返回首页 →</a></div><div data-oe-mount="booths"></div></section>
  <section class="df-page oe-page-view" id="activities"><div class="df-page-head"><span>PROGRAM</span><h2>活动</h2><a class="section-back" href="#home" data-page-link="home">返回首页 →</a></div><div class="activity-switch-row"><div class="activity-view-tabs"><button class="active" data-activity-view="timeline">当天日程</button><button data-activity-view="programs">活动详情</button></div><div data-oe-mount="activity-days" class="activity-day-tabs"></div></div><div data-activity-panel="timeline"><div data-oe-mount="schedule"></div></div><div data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="participation-list"></div></div></section>
  <section class="df-page oe-page-view" id="guests"><div class="df-page-head"><span>GUEST</span><h2>嘉宾</h2><a class="section-back" href="#home" data-page-link="home">返回首页 →</a></div><div data-oe-mount="guests" class="guest-grid"></div></section>
  <section class="df-page oe-page-view" id="guide"><div class="df-page-head"><span>GUIDE</span><h2>观展指南</h2><a class="section-back" href="#home" data-page-link="home">返回首页 →</a></div><div data-oe-mount="guide-detail" class="guide-detail-grid"></div></section>
</main>

<nav data-oe-mount="mobile-nav" class="df-mobile-nav"><a href="#home" data-page-link="home">HOME</a><a href="#booths" data-target-mode="page" data-page-link="booths">BOOTH</a><a href="#activities" data-target-mode="page" data-page-link="activities">EVENT</a><a href="#guests" data-target-mode="page" data-page-link="guests">GUEST</a><a href="#guide" data-target-mode="page" data-page-link="guide">GUIDE</a></nav>
<footer class="footer df-footer"><div data-oe-mount="footer-brand"></div><div data-oe-mount="footer-participate"></div><div data-oe-mount="footer-visit"></div><div data-oe-mount="footer-social"></div></footer>
`;

export const previewStyle=`
*{box-sizing:border-box}:root{--df-pink:#ff4f8d;--df-yellow:#ffe33f;--df-blue:#7180ff;--df-green:#8bd66f;--df-ink:#101010;--df-paper:#fff}body{margin:0;background:var(--df-paper);color:var(--df-ink);font-family:Arial,"Noto Sans SC","Microsoft YaHei",sans-serif}a{color:inherit;text-decoration:none}.df-head{position:sticky;top:0;z-index:80;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:24px;min-height:76px;padding:0 28px;background:#fff;border-bottom:2px solid var(--df-ink)}.df-brand b{display:block;font-size:26px;line-height:1}.df-brand small{display:block;margin-top:5px;font-size:8px;letter-spacing:.12em}.df-nav{display:flex;gap:22px;font-size:12px;font-weight:800}.df-ticket{padding:12px 16px;background:var(--df-ink);color:#fff;font-size:11px;font-weight:900}.df-hero{width:min(1240px,calc(100% - 40px));margin:0 auto;padding:44px 0 34px;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center}.df-hero-copy>small{font-size:10px;font-weight:800;letter-spacing:.16em}.df-hero h1{margin:14px 0 22px;font-size:clamp(60px,7.2vw,112px);line-height:.82;letter-spacing:-.07em;color:#d93537}.df-hero p{max-width:620px;font-size:17px;line-height:1.8}.df-facts{margin-top:28px;border-top:3px solid var(--df-ink)}.df-facts>div{display:grid;grid-template-columns:90px 1fr;padding:12px 0;border-bottom:1px solid var(--df-ink);font-size:13px}.df-poster{position:relative;min-height:560px}.df-poster .kv{position:absolute;inset:0;background:var(--oe-hero-image-desktop,linear-gradient(135deg,#ece6df,#cad7d8)) center/cover no-repeat}.df-poster>span{position:absolute;left:16px;top:16px;background:#d93537;color:#fff;padding:9px 11px;font-size:10px;font-weight:900}.df-poster>b{position:absolute;right:14px;bottom:12px;background:var(--df-yellow);padding:8px 10px;font-size:11px}.df-news,.df-statement,.df-index,.df-feature,.df-tickets,.df-map,.df-community,.df-sponsors{display:grid;grid-template-columns:170px minmax(0,1fr);border-top:2px solid var(--df-ink)}.df-section-label{padding:28px 24px;border-right:2px solid var(--df-ink)}.df-section-label span{display:block;font-size:54px;font-weight:900}.df-section-label b{font-size:11px;letter-spacing:.15em}.df-news .updates-list{padding:24px 34px}.museum-update{display:grid;grid-template-columns:120px 70px minmax(0,1fr) auto;gap:16px;padding:15px 0;border-bottom:1px solid #bbb;align-items:center}.museum-update time,.museum-update span,.museum-update i{font-size:10px}.museum-update i{font-style:normal}.df-statement{background:var(--df-yellow)}.df-statement>div:last-child{padding:64px 6vw}.df-statement h2{margin:0 0 22px;font-size:clamp(54px,8vw,118px);line-height:.86;letter-spacing:-.06em}.df-statement p{max-width:760px;font-size:18px;line-height:1.75}.df-index .quick-grid{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))}.museum-index-link{min-height:190px;display:flex;flex-direction:column;justify-content:space-between;padding:18px;border-right:1px solid #aaa}.museum-index-link span{font-size:11px}.museum-index-link b{display:block;font-size:24px}.museum-index-link small{font-size:10px}.museum-index-link i{font-style:normal;font-size:10px}.df-feature .participation-list,.df-tickets>div:last-child,.df-map-grid,.df-community .community,.df-sponsors .sponsors{padding:30px 34px}.museum-activity{display:grid;grid-template-columns:120px 1fr 38%;border-bottom:1px solid #aaa;min-height:280px}.museum-activity aside,.museum-activity-copy{padding:22px}.museum-activity h3{font-size:34px;margin:8px 0 14px}.museum-activity .activity-feature-media{min-height:280px}.ticket-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.museum-admission{border:2px solid var(--df-ink);background:#fff}.museum-admission header{display:flex;justify-content:space-between;padding:11px 14px;background:var(--df-pink);color:#fff}.museum-admission-body{padding:18px}.museum-admission h3{font-size:26px;margin:0 0 10px}.ticket-actions{margin-top:14px}.ticket-purchase-link{display:inline-block;background:var(--df-ink);color:#fff;padding:12px 16px;font-weight:900}.df-map-grid{display:grid;grid-template-columns:1fr 320px;gap:22px}.map-static{min-height:420px;background:#efefef}.museum-map-index{display:grid;grid-template-columns:38px 1fr auto;padding:11px 0;border-bottom:1px solid #aaa}.museum-map-index small{font-size:9px}.df-community .community,.df-sponsors .sponsors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.museum-social,.museum-sponsor{border:1px solid #aaa;padding:16px;background:#fff}.df-page{width:min(1180px,calc(100% - 36px));margin:auto;padding:52px 0 80px}.df-page-head{display:grid;grid-template-columns:1fr auto;align-items:end;border-bottom:3px solid var(--df-ink);padding-bottom:18px;margin-bottom:24px}.df-page-head span{font-size:10px;font-weight:900;letter-spacing:.14em}.df-page-head h2{font-size:54px;margin:5px 0 0}.section-back{grid-column:2;grid-row:1/3;align-self:center}.booth-directory-grid,.product-directory-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:18px!important}.museum-booth{display:grid;grid-template-columns:1fr 130px;grid-template-rows:auto 1fr auto;border-top:2px solid var(--df-ink);padding:14px 0}.museum-booth header{grid-column:1/-1;display:flex;gap:10px;font-size:10px}.museum-booth>div{grid-column:2;grid-row:2}.museum-booth .booth-logo{width:130px;height:130px;object-fit:cover}.museum-booth section{grid-column:1;grid-row:2;padding-right:18px}.museum-booth h3{font-size:34px;margin:8px 0}.museum-booth footer{grid-column:1/-1;display:flex;gap:8px;flex-wrap:wrap}.museum-product{display:grid;grid-template-columns:150px 1fr;gap:18px;border-top:2px solid var(--df-ink);padding:14px 0}.directory-product-image{width:150px;height:150px}.directory-product-image img{width:100%;height:100%;object-fit:cover}.museum-program-row{display:grid;grid-template-columns:48px 140px 1fr 220px;gap:14px;padding:18px 0;border-bottom:1px solid #aaa}.museum-portrait{display:grid;grid-template-columns:36% 1fr;gap:36px;padding:28px 0;border-top:2px solid var(--df-ink)}.museum-portrait figure{margin:0}.museum-portrait .guest-image{aspect-ratio:4/5}.museum-portrait .guest-image img{width:100%;height:100%;object-fit:cover}.museum-portrait-copy .guest-poster-name{display:block;font-size:48px;margin:10px 0}.guide-detail-grid{display:grid;gap:0}.museum-guide{display:grid;grid-template-columns:150px 1fr 40%;gap:24px;padding:24px 0;border-top:1px solid #aaa}.museum-guide h3{font-size:34px;margin:0 0 12px}.museum-guide img{width:100%}.activity-switch-row{display:flex;justify-content:space-between;gap:16px;margin-bottom:20px}.activity-view-tabs,.activity-day-tabs{display:flex;gap:6px;flex-wrap:wrap}.activity-view-tabs button,.activity-day-tabs button{padding:9px 12px;border:1px solid #111;background:#fff}.activity-view-tabs button.active,.activity-day-tabs button.active{background:var(--df-yellow)}.df-mobile-nav{display:none}.df-footer{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:2px solid var(--df-ink);margin-top:30px}.df-footer>div{padding:28px;border-right:1px solid #aaa}.oe-page-hidden{display:none!important}[data-oe-field]:focus{outline:2px solid var(--df-blue);background:#fff8a8}
@media(max-width:900px){.df-head{grid-template-columns:1fr auto}.df-nav{display:none}.df-mobile-nav{display:flex;position:sticky;bottom:0;z-index:80;background:#fff;border-top:2px solid #111}.df-mobile-nav a{flex:1;padding:12px 8px;text-align:center;font-size:10px}.df-hero{grid-template-columns:1fr}.df-news,.df-statement,.df-index,.df-feature,.df-tickets,.df-map,.df-community,.df-sponsors{grid-template-columns:1fr}.df-section-label{border-right:0;border-bottom:2px solid #111;padding:16px 20px;display:flex;align-items:center;gap:12px}.df-section-label span{font-size:30px}.df-index .quick-grid{grid-template-columns:repeat(2,1fr)}.df-map-grid{grid-template-columns:1fr}.museum-activity{grid-template-columns:100px 1fr}.museum-activity .activity-feature-media{grid-column:1/-1}.museum-program-row{grid-template-columns:40px 110px 1fr}.museum-program-row aside{grid-column:2/-1}.museum-guide{grid-template-columns:100px 1fr}.museum-guide img{grid-column:1/-1}.df-footer{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.df-head{padding:0 14px}.df-ticket{padding:10px}.df-hero{width:calc(100% - 24px);padding-top:24px}.df-hero h1{font-size:56px}.df-poster{min-height:420px}.museum-update{grid-template-columns:82px 1fr}.museum-update span,.museum-update i{display:none}.df-index .quick-grid,.ticket-grid,.booth-directory-grid,.product-directory-grid,.df-community .community,.df-sponsors .sponsors{grid-template-columns:1fr!important}.df-page-head h2{font-size:38px}.museum-booth{grid-template-columns:1fr 90px}.museum-booth .booth-logo{width:90px;height:90px}.museum-product{grid-template-columns:100px 1fr}.directory-product-image{width:100px;height:100px}.museum-portrait{grid-template-columns:1fr}.museum-program-row{grid-template-columns:1fr}.museum-guide{grid-template-columns:1fr}.df-footer{grid-template-columns:1fr}}
`
