/* Template 03 · CREATOR MARKET visitor art on the shared IP ONLY core.
   Layout hooks (ids, data-oe-field, collection containers) follow Template 01 so the shared
   renderer, editor and exporter work unchanged; everything visual is scoped to .cm-site. */
import {previewStyle as coreStyle} from '/v8/templates/01-ip-only-preview.js?v=8.41.4';

const marketStyle=`
.cm-site{--primary:#00aeec;--secondary:#a4d9f4;--cm-accent:#00aeec;--cm-accent-ink:#008ac0;--cm-ink:#18191c;--cm-muted:#61666d;--cm-soft:#9499a0;--cm-line:#e3e5e7;--cm-bg:#f7f8fa;--cm-card:#fff;background:var(--cm-bg);color:var(--cm-ink);font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;min-height:100vh}
.cm-site .wrap{max-width:1380px;padding:0 24px;margin:0 auto}
.cm-site .nav{position:sticky;top:0;z-index:40;height:70px;background:#fff;border:0;border-bottom:1px solid var(--cm-line);box-shadow:0 2px 10px #00000005;backdrop-filter:none}
.cm-site .nav .wrap{height:100%;display:flex;align-items:center;gap:20px}
.cm-site .brand{font-size:22px;font-weight:1000;letter-spacing:-.05em;color:var(--cm-ink);white-space:nowrap;border:0;background:none;padding:0;box-shadow:none}
.cm-site .nav .links{display:flex;gap:25px;margin-left:auto;align-items:center}
.cm-site .nav .links a{color:var(--cm-muted);font-size:14px;font-weight:700;border:0;background:none;padding:0}
.cm-site .nav .links a:hover{color:var(--cm-accent)}
.cm-site .nav .wrap>.btn{display:none}
.cm-site .btn{background:var(--cm-accent);color:#fff;border:0;border-radius:8px;box-shadow:none;font-weight:800}
.cm-site .hero{min-height:0;display:block;padding:24px 0;background:var(--cm-bg);overflow:visible}
.cm-site .hero:before,.cm-site .hero:after{display:none}
.cm-site .hero-grid{display:grid;grid-template-columns:62% minmax(0,1fr);gap:15px;align-items:stretch;min-height:0}
.cm-site .hero-art{position:relative;order:0;min-height:min(36vw,485px);height:auto}
.cm-site .kv{position:absolute;inset:0;border:0;border-radius:14px;box-shadow:none;background-color:#ded4f4;background-image:var(--oe-hero-image-desktop),linear-gradient(130deg,#a4d9f4 0%,#ded4f4 45%,#fbc6df 100%);background-size:cover;background-position:var(--oe-hero-focal-desktop),center;display:flex;align-items:center;justify-content:center;overflow:hidden}
.cm-site .kv:after{display:none}
.cm-site .kv:before{display:none}
.cm-site .kv.empty{background-image:linear-gradient(130deg,#a4d9f4 0%,#ded4f4 45%,#fbc6df 100%)!important}
.cm-site .event-status-badge{border:0;box-shadow:none;background:#e8f7ff;color:var(--cm-accent-ink);border-radius:6px;padding:5px 10px;font-size:12px;font-weight:800;align-self:flex-start}
.cm-kv-fallback{display:none;max-width:88%;text-align:center;overflow-wrap:anywhere;color:#fff;font-size:clamp(56px,7vw,132px);font-weight:1000;line-height:.92;letter-spacing:-.085em;text-shadow:5px 6px #806db0;transform:rotate(-8deg)}
.cm-site .kv.empty .cm-kv-fallback{display:block}
.cm-site .hero-copy{order:1;background:var(--cm-card);border:1px solid var(--cm-line);border-radius:14px;padding:clamp(20px,3vw,42px);display:flex;flex-direction:column;justify-content:center;box-shadow:none}
.cm-site .hero-kicker{font-size:11px;letter-spacing:.12em;color:#00a7de;font-weight:850}
.cm-site .hero-copy h1{font-size:clamp(28px,3vw,50px);letter-spacing:-.05em;line-height:1.16;color:var(--cm-ink);margin:10px 0 16px}
.cm-site .hero-copy p{font-size:14px;line-height:1.8;color:var(--cm-muted);max-width:none;margin:0 0 16px}
.cm-site .hero-copy .meta{display:flex;flex-direction:column;gap:7px;font-size:17px;font-weight:800;color:var(--cm-ink)}
.cm-site .hero-copy .meta .pill{border:0;background:none;padding:0;box-shadow:none;font:inherit;color:inherit}
.cm-site .hero-copy .meta .venue-nav{color:var(--cm-accent-ink);font-size:14px}
.cm-site .section{padding:58px 0 18px;background:transparent;border:0}
.cm-site .section.alt{background:transparent}
.cm-site .head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:21px;border:0}
.cm-site .head h2{font-weight:850;font-size:26px;letter-spacing:-.04em;margin:0;color:var(--cm-ink)}
.cm-site .head .ey{font-size:12px;color:var(--cm-soft);letter-spacing:.08em;font-weight:700;background:none;border:0;padding:0}
.cm-site .section-no,.cm-site .section-orbit,.cm-site .sticker,.cm-site .quick,.cm-site .ribbon,.cm-site .scroll-progress,.cm-site .mobile-dock{display:none!important}
.cm-site .oe-page-view .head{border-bottom:1px solid var(--cm-line);padding-bottom:16px;margin-bottom:24px}
/* Shared runtime CSS sizes page headings by #id; 03 keeps portal-sized headings. */
.cm-site .oe-page-view>.wrap>.head h2{font-size:clamp(26px,3vw,36px)!important;line-height:1.2!important;margin-top:4px!important}
.cm-site .head .ey{color:var(--cm-soft)!important}
.cm-site .section-back{color:var(--cm-accent-ink);font-weight:700;font-size:14px;border:0;background:none}
/* Shared product spotlight, 03 art: featured carousel beside a 2 x 3 product grid */
.cm-spotlight{padding:6px 0 14px}
.cm-site [data-oe-mount="product-spotlight"]{display:grid;grid-template-columns:minmax(0,2.08fr) minmax(0,3fr);gap:18px;align-items:stretch}
.cm-site .spotlight-feature{position:relative;border-radius:12px;overflow:hidden;background:#141414;min-height:420px;display:flex}
.cm-site .spotlight-feature-art{flex:1;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#b6d6ee,#ebb9d9);touch-action:pan-y;cursor:grab}
.cm-site .spotlight-feature-art img{width:100%;height:100%;object-fit:cover}
.cm-site .spotlight-feature-art .spotlight-placeholder{font-size:52px;font-weight:950;color:#fff;padding:24px;text-align:center}
.cm-site .spotlight-feature-info{position:absolute;left:0;right:0;bottom:0;padding:48px 25px 20px;background:linear-gradient(transparent,#15151cdb);color:#fff;pointer-events:none}
.cm-site .spotlight-feature-info h3{margin:5px 0;font-size:23px}
.cm-site .spotlight-feature-info p,.cm-site .spotlight-count{margin:0;font-size:13px;opacity:.8}
.cm-site .spotlight-controls{position:absolute;right:18px;bottom:18px;display:flex;gap:10px}
.cm-site .spotlight-controls button{border:0;border-radius:8px;padding:9px 16px;background:#ffffff30;color:#fff;cursor:pointer}
.cm-site .spotlight-six{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:14px}
.cm-site .spotlight-tile{display:flex;flex-direction:column;gap:6px;min-width:0;color:var(--cm-ink)}
.cm-site .spotlight-tile-art{aspect-ratio:16/9;border-radius:9px;overflow:hidden;background:#f0e8ff;display:flex;align-items:center;justify-content:center}
.cm-site .spotlight-tile-art img{width:100%;height:100%;object-fit:cover}
.cm-site .spotlight-tile-art .spotlight-placeholder{font-weight:900;color:#806db0;padding:10px;text-align:center}
.cm-site .spotlight-tile b{font-size:14px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cm-site .spotlight-tile small{font-size:12px;color:var(--cm-soft)}
.cm-site .spotlight-empty{grid-column:1/-1;color:var(--cm-soft);padding:30px 0}
/* Shared components, 03 portal finish: flat white cards instead of sticker outlines */
.cm-site .updates-strip{background:#fff;border:0;border-bottom:1px solid var(--cm-line);padding:14px 0}
.cm-site .ticket,.cm-site .community article,.cm-site .map-static,.cm-site .map-link-rail,.cm-site .booth-directory-card,.cm-site .directory-product-card,.cm-site .guide-grid article,.cm-site .sponsors>*{border:1px solid var(--cm-line)!important;border-radius:12px;box-shadow:none!important;background:var(--cm-card)}
.cm-site .cut-ticket:before,.cm-site .cut-ticket:after{display:none}
.cm-site .ticket .price{color:var(--cm-accent-ink)}
.cm-site .ticket-actions .btn,.cm-site .ticket-purchase-link{background:#55ace8;color:#fff;border-radius:9px;padding:15px 26px}
.cm-site .footer{background:#fff;color:#777;border-top:1px solid var(--cm-line);margin-top:50px}
.cm-site .footer h2{color:var(--cm-ink)}
@media(max-width:1100px){.cm-site .hero-grid{grid-template-columns:57% minmax(0,1fr)}}
@media(max-width:800px){
.cm-site .nav .links{gap:10px}.cm-site .nav .links a{font-size:11px}.cm-site .brand{font-size:17px}
.cm-site .hero{padding:12px 0}.cm-site .hero-grid{display:flex;flex-direction:column;gap:10px}.cm-site .hero-art{min-height:245px}.cm-site .hero-copy{padding:18px}.cm-site .hero-copy h1{font-size:28px}
.cm-site .wrap{padding:0 13px}.cm-site .head h2{font-size:23px}
.cm-site [data-oe-mount="product-spotlight"]{grid-template-columns:1fr}.cm-site .spotlight-feature{min-height:260px}
.cm-site .spotlight-six{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:auto}
}
@media(max-width:800px){.cm-site .kv{background-image:var(--oe-hero-image-mobile),linear-gradient(130deg,#a4d9f4 0%,#ded4f4 45%,#fbc6df 100%);background-position:var(--oe-hero-focal-mobile),center}}
`;

export const previewStyle=coreStyle+marketStyle;

const loader=`<div class="loader" id="loader"><div class="gate" role="button" tabindex="0" aria-label="点击纪念票进入活动网站"><section class="ticket-half left"><div class="entry-photo" aria-label="活动KV"></div></section><aside class="ticket-half right"><div class="entry-ticket-label">MEMORIAL TICKET</div><div class="entry-ticket-title">STARDUST ONLY</div><div class="entry-ticket-subtitle"></div><div class="entry-ticket-meta"><div class="entry-ticket-date-wrap"><span>DATE</span><b class="entry-ticket-date"></b></div><div class="entry-ticket-time-wrap"><span>TIME</span><b class="entry-ticket-time"></b></div><div class="entry-ticket-location-wrap"><span>PLACE</span><b class="entry-ticket-location"></b></div></div><div class="stub-barcode" aria-hidden="true"></div><div class="stub-code"><span class="entry-serial stub-number">NO. 000000</span></div></aside></div><button class="skip" id="skip">跳过动画 →</button></div>`;

const head=(ey,title)=>'<div class="head"><div><span class="ey">'+ey+'</span><h2>'+title+'</h2></div></div>';
const pageHead=(ey,title)=>'<div class="head"><div><span class="ey">'+ey+'</span><h2>'+title+'</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div>';

export const previewBody=`<div class="cm-site">${loader}
<header class="nav"><div class="wrap"><a class="brand" href="#top" data-oe-field="eventName">STARDUST ONLY</a><nav class="links" data-oe-mount="nav-links"><a href="#home" data-page-link="home">首页</a><a href="#booths" data-target-mode="page" data-page-link="booths">社团</a><a href="#map-home">场地图</a><a href="#guide" data-target-mode="page" data-page-link="guide">指南</a></nav><a class="btn ticket-purchase-link" href="#" target="_blank" rel="noopener">前往官方售票平台 ↗</a></div></header>
<main id="top">
<section class="hero"><div class="wrap hero-grid"><div class="hero-art"><div class="kv"><strong class="cm-kv-fallback" data-oe-field="eventName">STARDUST ONLY</strong></div></div><div class="hero-copy"><span class="hero-kicker">CREATOR MARKET</span><h1 data-oe-field="eventName">STARDUST ONLY</h1><p data-oe-field="tagline"></p><div class="meta"><span class="pill" data-oe-field="date"></span><span class="pill" data-oe-field="location"></span><a class="pill venue-nav" href="#map-home" data-oe-field="edition"></a></div></div></div></section>
<section class="cm-spotlight oe-home-only" id="spotlight" aria-label="随机推荐制品"><div class="wrap" data-oe-mount="product-spotlight"></div></section>
<section class="updates-strip oe-home-only" id="updates"><div class="wrap">${head('NEWS','最新公告')}<div class="updates-list"></div></div></section>
<section class="section" id="tickets"><div class="wrap">${head('ADMISSION','入场票')}<div class="ticket-grid"></div><div class="ticket-actions"></div></div></section>
<section class="section" id="map-home"><div class="wrap">${head('VENUE MAP','场地图')}<div class="map-explorer"><div class="map-static-shell"><div class="map-static" id="venueMap" data-oe-image="venueMap.image"></div></div><aside class="map-link-rail" data-oe-collection="explore"><span class="ey">EXPLORE</span><b>继续探索</b><div class="map-link-list"></div></aside></div></div></section>
<section class="section oe-page-view" id="booths"><div class="wrap">${pageHead('CIRCLES & WORKS','参展社团与制品')}<div class="booth-directory-rich"></div></div></section>
<section class="section oe-page-view" id="guide"><div class="wrap">${pageHead('GUIDE','观展指南')}<div class="guide-grid guide-detail-grid"></div></div></section>
<section class="section" id="community"><div class="wrap">${head('COMMUNITY','社群')}<div class="community"></div></div></section>
<section class="section" id="sponsors"><div class="wrap">${head('SPONSORS','合作伙伴')}<div class="sponsors"></div></div></section>
</main>
<footer class="footer"><div class="wrap footer-grid"><div class="footer-brand"></div><div class="footer-participate"></div><div class="footer-visit"></div><div class="footer-social"></div></div></footer>
</div>`;
