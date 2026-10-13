/* Template 03 — COMITIA-inspired independent catalogue shell. */
export const previewBody=`
<header class="catalog-head">
  <div class="catalog-head-inner">
    <a href="#home" data-page-link="home" class="catalog-brand">
      <b data-oe-field="eventName">STARDUST ONLY</b>
      <small>ORIGINAL FAN CREATION EVENT</small>
    </a>
    <div class="catalog-meta">
      <span data-oe-field="date">11.08 SUN</span>
      <span data-oe-field="location">杭州</span>
      <a class="venue-nav" data-oe-field="edition" href="#" target="_blank" rel="noopener">杭州国际博览中心</a>
    </div>
  </div>
</header>

<div class="catalog-layout">
  <aside class="catalog-sidebar">
    <div class="catalog-side-title">MENU / 目录</div>
    <nav data-oe-mount="nav-links" class="catalog-nav">
      <a href="#home" data-page-link="home">首页</a>
      <a href="#booths" data-target-mode="page" data-page-link="booths">社团与制品</a>
      <a href="#activities" data-target-mode="page" data-page-link="activities">活动与日程</a>
      <a href="#guests" data-target-mode="page" data-page-link="guests">嘉宾</a>
      <a href="#guide" data-target-mode="page" data-page-link="guide">观展指南</a>
    </nav>
    <div class="catalog-quick" data-oe-mount="quick"></div>
    <a class="catalog-ticket ticket-purchase-link" data-ticket-settings href="#" target="_blank" rel="noopener">票务信息 →</a>
  </aside>

  <main class="catalog-main">
    <section class="hero catalog-hero oe-home-only" id="home">
      <div class="catalog-hero-info hero-copy">
        <small>EVENT INFORMATION</small>
        <h1>
          <span class="hero-title-line hero-title-1" data-oe-field="heroTitle1">STARDUST</span>
          <span class="hero-title-line hero-title-2" data-oe-field="heroTitle2">ONLY</span>
          <span class="hero-title-line hero-title-3" data-oe-field="heroTitle3">2026</span>
        </h1>
        <p data-oe-field="tagline">围绕同一作品与角色展开的同人交流活动。</p>
        <div class="catalog-facts">
          <div><b>日期</b><span data-oe-field="date">11.08 SUN</span></div>
          <div><b>城市</b><span data-oe-field="location">杭州</span></div>
          <div><b>会场</b><span data-oe-field="edition">杭州国际博览中心</span></div>
          <div><b>状态</b><span data-oe-lifecycle-status>活动未开始</span></div>
        </div>
      </div>
      <div class="catalog-flier"><div class="kv" data-oe-image="heroImage"></div><small>EVENT FLIER / KV</small></div>
    </section>

    <section class="catalog-news oe-home-only">
      <header><span>NEWS</span><h2>活动公告</h2></header>
      <div data-oe-mount="updates" class="updates-list"></div>
    </section>

    <section class="catalog-feature oe-home-only" id="participation">
      <header><span>FEATURED</span><h2>重点活动</h2></header>
      <div data-oe-mount="featured-activities" class="participation-list"></div>
      <a href="#activities" data-target-mode="page" data-page-link="activities" class="catalog-more">查看全部活动 →</a>
    </section>

    <section class="catalog-ticket-section oe-home-only" id="tickets">
      <header><span>ADMISSION</span><h2>票务</h2></header>
      <div data-oe-mount="tickets" class="ticket-grid"></div>
      <div data-oe-mount="ticket-actions" class="ticket-actions"></div>
    </section>

    <section class="catalog-map oe-home-only" id="map-home">
      <header><span>VENUE MAP</span><h2>场地图</h2></header>
      <div class="catalog-map-grid">
        <div data-oe-mount="map" class="map-static"></div>
        <aside data-oe-mount="map-links" class="map-link-list"></aside>
      </div>
    </section>

    <section class="catalog-community oe-home-only" id="community">
      <header><span>CONTACT</span><h2>官方渠道</h2></header>
      <div data-oe-mount="community" class="community"></div>
    </section>
    <section class="catalog-sponsors oe-home-only" id="sponsors">
      <header><span>SUPPORT</span><h2>合作伙伴</h2></header>
      <div data-oe-mount="sponsors" class="sponsors"></div>
    </section>

    <section class="catalog-page oe-page-view" id="booths">
      <div class="catalog-page-head"><div><span>CIRCLE CATALOG</span><h2>社团与制品</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div>
      <div data-oe-mount="booths"></div>
    </section>

    <section class="catalog-page oe-page-view" id="activities">
      <div class="catalog-page-head"><div><span>PROGRAM</span><h2>活动与日程</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div>
      <div class="activity-switch-row"><div class="activity-view-tabs"><button class="active" data-activity-view="timeline">当天日程</button><button data-activity-view="programs">活动详情</button></div><div data-oe-mount="activity-days" class="activity-day-tabs"></div></div>
      <div data-activity-panel="timeline"><div data-oe-mount="schedule"></div></div>
      <div data-activity-panel="programs" hidden><div data-oe-mount="activity-projects" class="participation-list"></div></div>
    </section>

    <section class="catalog-page oe-page-view" id="guests">
      <div class="catalog-page-head"><div><span>GUEST</span><h2>嘉宾</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div>
      <div data-oe-mount="guests" class="guest-grid"></div>
    </section>

    <section class="catalog-page oe-page-view" id="guide">
      <div class="catalog-page-head"><div><span>VISITOR GUIDE</span><h2>观展指南</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div>
      <div data-oe-mount="guide-detail" class="guide-detail-grid"></div>
    </section>
  </main>
</div>

<nav data-oe-mount="mobile-nav" class="catalog-mobile-nav">
  <a href="#home" data-page-link="home">首页</a>
  <a href="#booths" data-target-mode="page" data-page-link="booths">摊位</a>
  <a href="#activities" data-target-mode="page" data-page-link="activities">活动</a>
  <a href="#guests" data-target-mode="page" data-page-link="guests">嘉宾</a>
  <a href="#guide" data-target-mode="page" data-page-link="guide">指南</a>
</nav>

<footer class="footer catalog-footer">
  <div data-oe-mount="footer-brand"></div>
  <div data-oe-mount="footer-participate"></div>
  <div data-oe-mount="footer-visit"></div>
  <div data-oe-mount="footer-social"></div>
</footer>

.custom-page-view{padding:26px 0 52px}.custom-page-view>.wrap{width:100%}.custom-page-view .head{display:flex;justify-content:space-between;align-items:end;padding-bottom:12px;margin-bottom:18px;border-bottom:2px solid var(--cat-ink)}.custom-page-view .ey{font-size:9px;color:var(--cat-green);letter-spacing:.12em}.custom-page-view h2{margin:4px 0 0;font-size:30px}.custom-page-intro{padding:14px 16px;background:#fff;border:1px solid var(--cat-line);font-size:13px;line-height:1.7}.custom-page-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}.custom-page-card{display:grid;grid-template-columns:130px minmax(0,1fr);gap:14px;padding:14px;background:#fff;border:1px solid var(--cat-line);min-width:0}.custom-page-image{width:130px;aspect-ratio:var(--custom-image-ratio,1.3333);border:1px solid var(--cat-line);padding:0;background:#ece9e1;overflow:hidden}.custom-page-image img{width:100%;height:100%;object-fit:cover}.custom-page-card-copy b{display:block;font-size:18px;margin-bottom:7px}.custom-page-meta{font-size:10px;color:#777}.custom-page-card-copy p{font-size:12px;line-height:1.65}.custom-page-action{font-size:11px;color:var(--cat-green);font-weight:800}.custom-page-grid-layout-reading .custom-page-card{grid-template-columns:100px 1fr}.custom-page-grid-layout-product .custom-page-image{aspect-ratio:1}
@media(max-width:620px){.custom-page-grid{grid-template-columns:1fr}.custom-page-card{grid-template-columns:96px 1fr}.custom-page-image{width:96px}}
`;

export const previewStyle=`
*{box-sizing:border-box}:root{--cat-green:#3f8754;--cat-deep:#2d663f;--cat-red:#b63d32;--cat-ink:#282725;--cat-paper:#f6f4ee;--cat-line:#cbc7bd;--cat-soft:#edf3ee}html{scroll-behavior:smooth}body{margin:0;background:var(--cat-paper);color:var(--cat-ink);font-family:Arial,"Noto Sans SC","Microsoft YaHei",sans-serif}a{color:inherit;text-decoration:none}.catalog-head{background:var(--cat-green);color:#fff;border-bottom:1px solid #285e39}.catalog-head-inner{width:min(1180px,calc(100% - 28px));min-height:108px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:24px}.catalog-brand b{display:block;font-size:clamp(28px,3vw,46px);line-height:.95;letter-spacing:-.045em}.catalog-brand small{display:block;margin-top:7px;font-size:9px;letter-spacing:.12em}.catalog-meta{display:flex;gap:18px;align-items:center;font-size:12px}.catalog-layout{width:min(1180px,calc(100% - 28px));margin:28px auto 72px;display:grid;grid-template-columns:230px minmax(0,1fr);gap:28px}.catalog-sidebar{align-self:start;position:sticky;top:18px}.catalog-side-title{padding:10px 12px;background:#e7ebe6;border:1px solid var(--cat-line);font-weight:800;font-size:12px}.catalog-nav{border:1px solid var(--cat-line);border-top:0;background:#fff}.catalog-nav a{display:block;padding:10px 13px;border-bottom:1px solid #e7e3dc;font-size:12px}.catalog-nav a:last-child{border-bottom:0}.catalog-nav a:hover{background:var(--cat-soft)}.catalog-quick{margin-top:14px;border:1px solid var(--cat-line);background:#fff}.school-wayfinding-card{display:grid;grid-template-columns:34px 1fr auto;gap:8px;padding:11px;border-bottom:1px solid #e5e1d9;align-items:center}.school-wayfinding-card:last-child{border-bottom:0}.school-wayfinding-card span{font:700 10px/1 monospace;color:var(--cat-green)}.school-wayfinding-card small{font-size:8px;color:#888}.school-wayfinding-card b{display:block;font-size:12px}.school-wayfinding-card em{display:none}.school-wayfinding-card i{font-style:normal}.catalog-ticket{display:block;margin-top:14px;background:var(--cat-red);color:#fff;padding:13px 14px;font-weight:800;font-size:12px}.catalog-main{min-width:0}.catalog-hero{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:22px;align-items:start}.catalog-hero-info{background:#deebf3;padding:24px;min-height:360px}.catalog-hero-info>small,.catalog-news header span,.catalog-feature header span,.catalog-ticket-section header span,.catalog-map header span,.catalog-community header span,.catalog-sponsors header span{font-size:9px;font-weight:800;letter-spacing:.13em;color:var(--cat-green)}.catalog-hero h1{margin:12px 0 18px;color:var(--cat-green);font-size:clamp(42px,5vw,72px);line-height:.88;letter-spacing:-.05em}.catalog-hero h1 span{display:block}.catalog-hero p{font-size:15px;line-height:1.75;max-width:600px}.catalog-facts{margin-top:24px;border-top:2px solid var(--cat-ink)}.catalog-facts div{display:grid;grid-template-columns:74px 1fr;padding:10px 0;border-bottom:1px solid #8a969e;font-size:12px}.catalog-flier{display:grid;gap:9px}.catalog-flier .kv{min-height:470px;background:var(--oe-hero-image-desktop,linear-gradient(135deg,#cfd9d2,#eef1ec)) center/cover no-repeat;border:1px solid var(--cat-line)}.catalog-flier small{text-align:right;font-size:9px;color:#777}.catalog-news,.catalog-feature,.catalog-ticket-section,.catalog-map,.catalog-community,.catalog-sponsors{padding:36px 0;border-bottom:1px solid var(--cat-line)}.catalog-news header,.catalog-feature header,.catalog-ticket-section header,.catalog-map header,.catalog-community header,.catalog-sponsors header{display:flex;align-items:baseline;justify-content:space-between;gap:18px;margin-bottom:14px}.catalog-news h2,.catalog-feature h2,.catalog-ticket-section h2,.catalog-map h2,.catalog-community h2,.catalog-sponsors h2{margin:0;font-size:24px}.school-update{display:grid;grid-template-columns:90px 110px minmax(0,1fr) auto;gap:12px;padding:13px 8px;border-top:1px solid var(--cat-line);align-items:center;font-size:13px}.school-update:last-child{border-bottom:1px solid var(--cat-line)}.school-update span{font-size:9px;color:var(--cat-green)}.school-update time{color:#777}.school-update i{font-style:normal}.catalog-feature .participation-list{display:grid;gap:12px}.school-activity{background:#fff;border:1px solid var(--cat-line)}.school-activity header{display:flex;justify-content:space-between;padding:8px 12px;background:#eceeea;border-bottom:1px solid var(--cat-line)}.school-activity-main{display:grid;grid-template-columns:180px 1fr;gap:18px;padding:16px}.school-activity-main .activity-feature-media{min-height:150px}.school-activity h3{margin:0 0 9px;font-size:22px}.catalog-more{display:inline-block;margin-top:14px;padding-bottom:3px;border-bottom:1px solid}.ticket-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.school-ticket-card{display:grid;grid-template-columns:44px 1fr auto;gap:12px;padding:16px;border:1px solid var(--cat-line);background:#fff}.school-ticket-no{font:700 22px/1 Georgia,serif;color:var(--cat-green)}.school-ticket-copy>span{font-size:8px;color:#777}.school-ticket-copy h3{margin:7px 0}.school-ticket-price{font-weight:800}.ticket-actions{margin-top:14px}.ticket-purchase-link{display:inline-block;background:var(--cat-red);color:#fff;padding:11px 15px;font-weight:800}.catalog-map-grid{display:grid;grid-template-columns:1fr 260px;gap:18px}.map-static{min-height:360px;background:#e9e6dd}.school-map-sign{display:grid;grid-template-columns:32px 1fr auto;padding:10px 0;border-bottom:1px solid var(--cat-line)}.booth-directory-grid,.product-directory-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important}.school-booth,.school-product,.school-profile,.school-guide,.school-timetable{background:#fff;border:1px solid var(--cat-line)}.school-booth{display:grid;grid-template-columns:58px 86px minmax(0,1fr);gap:14px;padding:16px}.school-booth-no{font:700 18px/1 monospace;color:var(--cat-green)}.school-booth .booth-logo{width:86px;height:86px;object-fit:cover}.school-booth h3{margin:5px 0;font-size:22px}.school-booth footer{grid-column:2/-1;display:flex;gap:8px;flex-wrap:wrap}.school-product{display:grid;grid-template-columns:90px 1fr auto;gap:14px;padding:14px}.directory-product-image{width:90px;height:90px}.directory-product-image img{width:100%;height:100%;object-fit:cover}.school-timetable{display:grid;grid-template-columns:120px 48px 1fr;gap:14px;padding:16px;border-bottom:0}.school-timetable:last-child{border-bottom:1px solid var(--cat-line)}.school-time strong{display:block;font-size:22px}.school-profile{display:grid;grid-template-columns:50px 200px 1fr;gap:18px;padding:18px}.school-profile .guest-image{width:200px;aspect-ratio:4/5}.school-profile .guest-image img{width:100%;height:100%;object-fit:cover}.school-profile-copy .guest-poster-name{display:block;font-size:32px;margin:8px 0}.guide-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.school-guide{display:grid;grid-template-columns:48px 1fr;gap:14px;padding:16px}.school-guide img{grid-column:1/-1;width:100%}.catalog-page{padding:20px 0 50px}.catalog-page-head{display:flex;justify-content:space-between;align-items:end;border-bottom:2px solid var(--cat-ink);padding-bottom:14px;margin-bottom:18px}.catalog-page-head span{font-size:9px;color:var(--cat-green)}.catalog-page-head h2{font-size:32px;margin:4px 0 0}.activity-switch-row{display:flex;justify-content:space-between;gap:16px;margin-bottom:14px}.activity-view-tabs,.activity-day-tabs{display:flex;gap:6px;flex-wrap:wrap}.activity-view-tabs button,.activity-day-tabs button{padding:8px 10px;border:1px solid var(--cat-line);background:#fff}.activity-view-tabs button.active,.activity-day-tabs button.active{background:var(--cat-green);color:#fff}.catalog-community .community,.catalog-sponsors .sponsors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.school-social,.variant-sponsor{background:#fff;border:1px solid var(--cat-line);padding:14px}.catalog-footer{width:min(1180px,calc(100% - 28px));margin:0 auto 32px;padding-top:24px;border-top:1px solid var(--cat-line);display:grid;grid-template-columns:repeat(4,1fr);gap:18px;font-size:12px}.catalog-mobile-nav{display:none}.oe-page-hidden{display:none!important}[data-oe-field]{cursor:text}[data-oe-field]:focus{outline:2px solid #6b63ff;background:#fff8bd}
@media(max-width:900px){.catalog-layout{grid-template-columns:1fr}.catalog-sidebar{position:static}.catalog-nav{display:none}.catalog-quick{display:none}.catalog-mobile-nav{display:flex;position:sticky;bottom:0;z-index:80;background:#fff;border-top:1px solid var(--cat-line);overflow-x:auto}.catalog-mobile-nav a{flex:1 0 76px;padding:12px 10px;text-align:center;font-size:11px}.catalog-hero{grid-template-columns:1fr}.catalog-flier{max-width:470px}.catalog-map-grid{grid-template-columns:1fr}.catalog-footer{grid-template-columns:repeat(2,1fr)}}@media(max-width:620px){.catalog-head-inner{align-items:flex-start;flex-direction:column;padding:18px 0}.catalog-meta{flex-wrap:wrap}.school-update{grid-template-columns:74px 1fr}.school-update span,.school-update i{display:none}.ticket-grid,.booth-directory-grid,.product-directory-grid,.guide-detail-grid{grid-template-columns:1fr!important}.school-booth{grid-template-columns:50px 72px 1fr}.school-booth .booth-logo{width:72px;height:72px}.school-profile{grid-template-columns:1fr}.school-profile .guest-image{width:100%;max-width:280px}.school-timetable{grid-template-columns:90px 1fr}.school-period{display:none}.catalog-footer{grid-template-columns:1fr}}
`
