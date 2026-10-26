/* Template 04 · CREATOR CATALOGUE visitor art on the shared IP ONLY core: an illustrated
   doujin-event pamphlet. Layout hooks follow Template 01 so the shared renderer, editor and
   exporter work unchanged; everything visual is scoped to .cc-site. */
import {previewStyle as coreStyle} from '/v8/templates/01-ip-only-preview.js?v=8.41.4';

const catalogueStyle=`
.cc-site{--primary:#ff7eb6;--secondary:#7fe3ff;--cc-night:#1b1240;--cc-night-2:#2a1b5e;--cc-pink:#ff7eb6;--cc-lilac:#b9a3ff;--cc-cyan:#7fe3ff;--cc-cream:#fff8ef;--cc-ink:#2b1f47;--cc-line:#ffffff26;
 position:relative;min-height:100vh;color:#fff;font-family:"M PLUS Rounded 1c","Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;
 background:radial-gradient(1.5px 1.5px at 12% 18%,#fff 98%,transparent),radial-gradient(1px 1px at 32% 62%,#fff 98%,transparent),radial-gradient(1.5px 1.5px at 72% 28%,#fff 98%,transparent),radial-gradient(1px 1px at 88% 78%,#fff 98%,transparent),radial-gradient(1px 1px at 52% 88%,#fffa 98%,transparent),radial-gradient(circle at 80% -10%,#5b3fb0 0,transparent 45%),radial-gradient(circle at -10% 40%,#8a2d7c 0,transparent 40%),var(--cc-night);background-size:340px 340px,260px 260px,420px 420px,300px 300px,380px 380px,100% 100%,100% 100%,auto}
.cc-site .wrap{max-width:1240px;padding:0 24px;margin:0 auto}
/* Header: glassy night bar with a star-tipped brand */
.cc-site .nav{position:sticky;top:0;z-index:40;height:68px;background:#1b1240d9;backdrop-filter:blur(10px);border:0;border-bottom:1px solid var(--cc-line);box-shadow:none}
.cc-site .nav .wrap{height:100%;display:flex;align-items:center;gap:20px}
.cc-site .brand{font-size:20px;font-weight:1000;color:#fff;border:0;background:none;padding:0;box-shadow:none;letter-spacing:.02em}
.cc-site .brand:before{content:"✦ ";color:var(--cc-pink)}
.cc-site .nav .links{display:flex;gap:22px;margin-left:auto}
.cc-site .nav .links a{color:#e6dcff;font-size:13px;font-weight:800;border:0;background:none;padding:0}
.cc-site .nav .links a:hover{color:var(--cc-cyan)}
.cc-site .nav .wrap>.btn{background:var(--cc-pink);color:#2b1036;border:0;border-radius:999px;box-shadow:0 0 0 3px #ff7eb655;font-weight:900;font-size:12px;padding:8px 14px;white-space:nowrap}
.cc-site .nav .links a{white-space:nowrap}
/* Hero: poster card with key art, speed lines and stickers */
.cc-site .hero{min-height:0;padding:44px 0 30px;background:transparent;overflow:hidden;display:block}
.cc-site .hero:before{content:"";display:block;position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 70% 45%,#ffffff0d 0 2deg,transparent 2deg 9deg);pointer-events:none}
.cc-site .hero:after{display:none}
.cc-site .hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:36px;align-items:center}
.cc-site .hero-art{position:relative;order:0;aspect-ratio:3/4;max-height:640px;width:100%}
.cc-site .kv{position:absolute;inset:0;border:6px solid #fff;border-radius:22px;box-shadow:12px 12px 0 var(--cc-pink),0 30px 80px #0008;background-color:#3a2b78;background-image:var(--oe-hero-image-desktop),linear-gradient(160deg,#9b7bff,#ff8fc4 60%,#ffd27f);background-size:cover;background-position:var(--oe-hero-focal-desktop),center;transform:rotate(-2deg);display:flex;align-items:center;justify-content:center;overflow:hidden}
.cc-site .kv:before{display:none}.cc-site .kv:after{display:none}
.cc-site .kv.empty{background-image:radial-gradient(circle at 50% 38%,#ffffff55 0 18%,transparent 19%),repeating-radial-gradient(circle at 50% 38%,transparent 0 22px,#ffffff14 22px 24px),linear-gradient(160deg,#9b7bff,#ff8fc4 60%,#ffd27f)!important}
.cc-kv-fallback{display:none;max-width:86%;text-align:center;font-size:clamp(46px,6vw,96px);font-weight:1000;line-height:.95;color:#fff;-webkit-text-stroke:3px var(--cc-ink);paint-order:stroke fill;text-shadow:6px 6px 0 var(--cc-ink);transform:rotate(-6deg);overflow-wrap:anywhere}
.cc-site .kv.empty .cc-kv-fallback{display:block}
.cc-sticker{position:absolute;z-index:3;padding:8px 14px;border-radius:12px;font-weight:1000;font-size:13px;letter-spacing:.08em;border:3px solid var(--cc-ink);box-shadow:4px 4px 0 var(--cc-ink)}
.cc-sticker.one{top:22px;left:-14px;background:var(--cc-cyan);color:var(--cc-ink);transform:rotate(-9deg)}
.cc-sticker.two{bottom:34px;right:-12px;background:#ffe45c;color:var(--cc-ink);transform:rotate(7deg)}
.cc-site .hero-copy{order:1;position:relative;display:flex;flex-direction:column;gap:14px;background:none;border:0;padding:0;box-shadow:none}
.cc-site .hero-kicker{align-self:flex-start;padding:6px 12px;border-radius:999px;background:#ffffff1f;border:1px solid #ffffff40;font-size:11px;font-weight:900;letter-spacing:.2em;color:var(--cc-cyan)}
.cc-site .hero-copy h1{margin:0;font-size:clamp(40px,5.4vw,84px);line-height:1;font-weight:1000;color:#fff;-webkit-text-stroke:2px var(--cc-ink);paint-order:stroke fill;text-shadow:5px 5px 0 var(--cc-pink);overflow-wrap:anywhere}
.cc-site .hero-copy p{margin:0;color:#e6dcff;font-size:15px;line-height:1.8;max-width:30em}
.cc-site .hero-copy .meta{display:flex;flex-wrap:wrap;gap:10px}
.cc-site .hero-copy .meta .pill{border:2px solid #ffffff55;background:#ffffff14;color:#fff;border-radius:999px;padding:8px 14px;font-weight:900;box-shadow:none}
.cc-site .hero-copy .meta .venue-nav{border-color:var(--cc-cyan);color:var(--cc-cyan)}
.cc-site .event-status-badge{align-self:flex-start;border:0;box-shadow:none;background:var(--cc-pink);color:#2b1036;border-radius:8px;padding:5px 10px;font-weight:900}
.cc-cta{align-self:flex-start;display:inline-flex;align-items:center;gap:8px;padding:14px 22px;border-radius:999px;background:#fff;color:var(--cc-ink);font-weight:1000;box-shadow:5px 5px 0 var(--cc-pink)}
/* Sections */
.cc-site .section{padding:64px 0 20px;background:transparent;border:0}
.cc-site .section.alt{background:transparent}
.cc-site .head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:22px;border:0}
.cc-site .head h2{margin:0;font-size:clamp(26px,3vw,38px);font-weight:1000;color:#fff;line-height:1.15}
.cc-site .head .ey{display:inline-block;margin-bottom:6px;color:var(--cc-pink)!important;font-size:12px;font-weight:900;letter-spacing:.22em;background:none;border:0;padding:0}
.cc-site .oe-page-view>.wrap>.head h2{font-size:clamp(26px,3vw,38px)!important;line-height:1.15!important;margin-top:4px!important}
.cc-site .section-no,.cc-site .section-orbit,.cc-site .sticker,.cc-site .quick,.cc-site .ribbon,.cc-site .scroll-progress,.cc-site .mobile-dock{display:none!important}
.cc-site .section-back{color:var(--cc-cyan);font-weight:900;border:1px solid #ffffff40;border-radius:999px;padding:8px 14px;background:none}
/* The web catalogue: cream paper pages on the night sky */
.cc-catalogue{padding:30px 0 40px}
.cc-site [data-oe-mount="catalogue-book"]{outline:none}
.cc-site .cb-page{background:var(--cc-cream);color:var(--cc-ink);background-image:radial-gradient(#2b1f4712 1px,transparent 1.2px);background-size:14px 14px;box-shadow:0 18px 50px #0007}
.cc-site .cb-page.left{box-shadow:inset -26px 0 30px -20px #2b1f4740,0 18px 50px #0007}
.cc-site .cb-page.right{box-shadow:inset 26px 0 30px -20px #2b1f4740,0 18px 50px #0007}
.cc-site .cb-ribbon{position:absolute;top:-10px;right:18%;width:22px;height:90px;background:var(--cc-pink);clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%);z-index:6}
.cc-site .cb-page-head small{color:#c04f8a}.cc-site .cb-page-head b{color:var(--cc-ink)}
.cc-site .cb-page-head{border-bottom:3px dotted #2b1f4733;padding-bottom:8px}
.cc-site .cb-folio{color:#2b1f4799}
.cc-site .cb-cover{background-color:#3a2b78;background-image:radial-gradient(circle at 50% 36%,#ffffff40 0 16%,transparent 17%),repeating-conic-gradient(from 0deg at 50% 36%,#ffffff12 0 3deg,transparent 3deg 12deg),linear-gradient(165deg,#8f6dff,#ff8fc4 62%,#ffd27f);color:#fff}
.cc-site .cb-cover.has-art{background-size:cover}
.cc-site .cb-cover.has-art:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 45%,#1b1240cc);pointer-events:none}
.cc-site .cb-cover>*{position:relative;z-index:1}
.cc-site .cb-cover h3{-webkit-text-stroke:2px var(--cc-ink);paint-order:stroke fill;text-shadow:4px 4px 0 var(--cc-pink)}
.cc-site .cb-cover-badge{position:absolute;top:18px;left:18px;padding:6px 10px;background:#fff;color:var(--cc-ink);border-radius:8px;font-size:11px;font-weight:1000;letter-spacing:.15em;box-shadow:3px 3px 0 var(--cc-ink)}
.cc-site .cb-cover-vol{font-size:12px;font-weight:900;letter-spacing:.2em;color:#fff}
.cc-site .cb-cover-star{position:absolute;top:16px;right:22px;font-size:40px;color:#ffe45c;font-style:normal;text-shadow:3px 3px 0 var(--cc-ink)}
.cc-site .cb-contents button{border-bottom:2px dashed #2b1f4726}
.cc-site .cb-contents span{color:#c04f8a}.cc-site .cb-contents i{font-style:normal;font-weight:900;color:#6a55c8}
.cc-site .cb-bubble p{background:#fff;border:3px solid var(--cc-ink);box-shadow:4px 4px 0 var(--cc-pink)}
.cc-site .cb-avatar{background:var(--cc-pink);color:#fff;border:3px solid var(--cc-ink)}
.cc-site .cb-rules article{background:#fff;border-radius:12px;padding:10px 12px;border:2px solid #2b1f4722}
.cc-site .cb-rules b{color:#6a55c8;font-size:13px}
.cc-site .cb-cut{background:#fff;border:2px solid var(--cc-ink);border-radius:6px;color:var(--cc-ink)}
.cc-site .cb-space{background:var(--cc-ink);color:#fff;border-radius:4px 0 6px 0}
.cc-site .cb-cut-art{background:repeating-linear-gradient(45deg,#f3ecff 0 8px,#fff 8px 16px);border:1px solid #2b1f4722}
.cc-site .cb-cut-art em{font-style:normal;font-weight:1000;font-size:22px;color:#b9a3ff}
.cc-site .cb-work{color:var(--cc-ink)}
.cc-site .cb-work-art{background:#ffe9f4;border-radius:10px;border:2px solid #2b1f4718}
.cc-site .cb-work-art em{font-style:normal;font-weight:1000;color:#ff7eb6;transform:rotate(-8deg)}
.cc-site .cb-map{background:#fff;border-radius:10px;border:2px solid #2b1f4722}
.cc-site .cb-stamps span{border:3px dashed #c04f8a;color:#c04f8a}
.cc-site .cb-controls button{border:2px solid #fff;background:#ffffff14;color:#fff}
.cc-site .cb-controls span{color:#e6dcff}
/* Shared components on the night sky */
.cc-site .updates-strip{background:#ffffff0d;border:0;border-block:1px solid var(--cc-line);padding:14px 0}
.cc-site .ticket,.cc-site .community article,.cc-site .map-static,.cc-site .map-link-rail,.cc-site .booth-directory-card,.cc-site .directory-product-card,.cc-site .guide-grid article,.cc-site .sponsors>*,.cc-site .booth-directory-rich>*:first-child{border:2px solid var(--cc-ink)!important;border-radius:16px;background:var(--cc-cream);color:var(--cc-ink);box-shadow:6px 6px 0 var(--cc-pink)!important}
.cc-site .cut-ticket:before,.cc-site .cut-ticket:after{display:none}
.cc-site .ticket .price{color:#c04f8a}
.cc-site .ticket-actions .btn,.cc-site .ticket-purchase-link{background:var(--cc-pink);color:#2b1036;border-radius:999px}
.cc-site .footer{background:#120b2e;color:#cbbdf5;border-top:1px solid var(--cc-line);margin-top:60px}
.cc-site .footer h2{color:#fff}
@media(max-width:900px){.cc-site .hero-grid{grid-template-columns:1fr;gap:26px}.cc-site .hero-art{max-width:440px;margin:0 auto}.cc-site .nav .links{gap:10px}.cc-site .nav .links a{font-size:11px}.cc-site .brand{font-size:16px}}
@media(max-width:760px){.cc-site .nav .wrap{gap:10px}.cc-site .nav .links{gap:12px;overflow-x:auto;scrollbar-width:none;min-width:0}.cc-site .nav .wrap>.btn{display:none}.cc-site .wrap{padding:0 14px}.cc-sticker{font-size:11px}.cc-site .kv{background-image:var(--oe-hero-image-mobile),linear-gradient(160deg,#9b7bff,#ff8fc4 60%,#ffd27f);background-position:var(--oe-hero-focal-mobile),center}}
`;

export const previewStyle=coreStyle+catalogueStyle;

const loader=`<div class="loader" id="loader"><div class="gate" role="button" tabindex="0" aria-label="点击纪念票进入活动网站"><section class="ticket-half left"><div class="entry-photo" aria-label="活动KV"></div></section><aside class="ticket-half right"><div class="entry-ticket-label">MEMORIAL TICKET</div><div class="entry-ticket-title">STARDUST ONLY</div><div class="entry-ticket-subtitle"></div><div class="entry-ticket-meta"><div class="entry-ticket-date-wrap"><span>DATE</span><b class="entry-ticket-date"></b></div><div class="entry-ticket-time-wrap"><span>TIME</span><b class="entry-ticket-time"></b></div><div class="entry-ticket-location-wrap"><span>PLACE</span><b class="entry-ticket-location"></b></div></div><div class="stub-barcode" aria-hidden="true"></div><div class="stub-code"><span class="entry-serial stub-number">NO. 000000</span></div></aside></div><button class="skip" id="skip">跳过动画 →</button></div>`;

const head=(ey,title)=>'<div class="head"><div><span class="ey">'+ey+'</span><h2>'+title+'</h2></div></div>';
const pageHead=(ey,title)=>'<div class="head"><div><span class="ey">'+ey+'</span><h2>'+title+'</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div>';

export const previewBody=`<div class="cc-site">${loader}
<header class="nav"><div class="wrap"><a class="brand" href="#top" data-oe-field="eventName">STARDUST ONLY</a><nav class="links" data-oe-mount="nav-links"><a href="#home" data-page-link="home">首页</a><a href="#catalogue">电子场刊</a><a href="#booths" data-target-mode="page" data-page-link="booths">社团</a><a href="#map-home">场地图</a><a href="#guide" data-target-mode="page" data-page-link="guide">指南</a></nav><a class="btn ticket-purchase-link" href="#" target="_blank" rel="noopener">前往官方售票平台 ↗</a></div></header>
<main id="top">
<section class="hero"><div class="wrap hero-grid"><div class="hero-art"><span class="cc-sticker one">WEB CATALOGUE</span><div class="kv"><strong class="cc-kv-fallback" data-oe-field="eventName">STARDUST ONLY</strong></div><span class="cc-sticker two">電子場刊 公開中!</span></div><div class="hero-copy"><span class="hero-kicker">CREATOR CATALOGUE</span><h1 data-oe-field="eventName">STARDUST ONLY</h1><p data-oe-field="tagline"></p><div class="meta"><span class="pill" data-oe-field="date"></span><span class="pill" data-oe-field="location"></span><a class="pill venue-nav" href="#map-home" data-oe-field="edition"></a></div><a class="cc-cta" href="#catalogue">翻开电子场刊 ✦</a></div></div></section>
<section class="cc-catalogue oe-home-only" id="catalogue" aria-label="电子场刊"><div class="wrap">${head('WEB CATALOGUE · 電子場刊','翻阅电子场刊')}<div data-oe-mount="catalogue-book"></div></div></section>
<section class="updates-strip oe-home-only" id="updates"><div class="wrap">${head('NEWS','最新公告')}<div class="updates-list"></div></div></section>
<section class="section" id="tickets"><div class="wrap">${head('ADMISSION','入场票')}<div class="ticket-grid"></div><div class="ticket-actions"></div></div></section>
<section class="section" id="map-home"><div class="wrap">${head('VENUE MAP','场地图')}<div class="map-explorer"><div class="map-static-shell"><div class="map-static" id="venueMap" data-oe-image="venueMap.image"></div></div><aside class="map-link-rail" data-oe-collection="explore"><span class="ey">EXPLORE</span><b>继续探索</b><div class="map-link-list"></div></aside></div></div></section>
<section class="section oe-page-view" id="booths"><div class="wrap">${pageHead('CIRCLE LIST','参展社团与制品')}<div class="booth-directory-rich"></div></div></section>
<section class="section oe-page-view" id="guide"><div class="wrap">${pageHead('GUIDE','观展指南')}<div class="guide-grid guide-detail-grid"></div></div></section>
<section class="section" id="community"><div class="wrap">${head('COMMUNITY','社群')}<div class="community"></div></div></section>
<section class="section" id="sponsors"><div class="wrap">${head('SPONSORS','合作伙伴')}<div class="sponsors"></div></div></section>
</main>
<footer class="footer"><div class="wrap footer-grid"><div class="footer-brand"></div><div class="footer-participate"></div><div class="footer-visit"></div><div class="footer-social"></div></div></footer>
</div>`;
