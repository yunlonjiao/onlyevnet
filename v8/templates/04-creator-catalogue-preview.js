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
.cc-site .nav{position:sticky;top:0;z-index:40;height:68px;background:#1b1240f2;border:0;border-bottom:1px solid var(--cc-line);box-shadow:none}
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
/* Keep catalogue TOC controls below the sticky 68px navigation when scrolled into view. */
.cc-site .cb-contents button{scroll-margin-top:110px;scroll-margin-bottom:28px}
.cc-site .cb-book{scroll-margin-top:96px}
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
.cc-site .ticket,.cc-site .community article,.cc-site .map-static,.cc-site .cc-routes,.cc-site .booth-directory-card,.cc-site .directory-product-card,.cc-site .guide-grid article,.cc-site .sponsors>*,.cc-site .booth-directory-rich>*:first-child{border:2px solid var(--cc-ink)!important;border-radius:16px;background:var(--cc-cream);color:var(--cc-ink);box-shadow:6px 6px 0 var(--cc-pink)!important}
.cc-site .cut-ticket:before,.cc-site .cut-ticket:after{display:none}
.cc-site .ticket .price{color:#c04f8a}
.cc-site .ticket-actions .btn,.cc-site .ticket-purchase-link{background:var(--cc-pink);color:#2b1036;border-radius:999px}
.cc-site .footer{background:#120b2e;color:#cbbdf5;border-top:1px solid var(--cc-line);margin-top:60px}
.cc-site .footer h2{color:#fff}
@media(max-width:900px){.cc-site .hero-grid{grid-template-columns:1fr;gap:26px}.cc-site .hero-art{max-width:440px;margin:0 auto}.cc-site .nav .links{gap:10px}.cc-site .nav .links a{font-size:11px}.cc-site .brand{font-size:16px}}
@media(max-width:760px){.cc-site .nav .wrap{gap:10px}.cc-site .nav .links{gap:12px;overflow-x:auto;scrollbar-width:none;min-width:0}.cc-site .nav .wrap>.btn{display:none}.cc-site .wrap{padding:0 14px}.cc-sticker{font-size:11px}.cc-site .kv{background-image:var(--oe-hero-image-mobile),linear-gradient(160deg,#9b7bff,#ff8fc4 60%,#ffd27f);background-position:var(--oe-hero-focal-mobile),center}}

/* 04 entry: a closed pamphlet whose cover swings open */
.cc-site .loader.cc-entry{background:radial-gradient(circle at 50% 40%,#3a2580,#1b1240 70%)!important;place-items:center}
.cc-entry .entry-ticket-label,.cc-entry .stub-barcode,.cc-entry .stub-code{display:none!important}
.cc-entry-gate{cursor:pointer;background:none;border:0;padding:0;box-shadow:none;transform:none;perspective:1800px}
.cc-entry-book{position:relative;width:min(360px,76vw);aspect-ratio:.72;transform-style:preserve-3d}
.cc-entry-page{position:absolute;inset:0;border-radius:6px 16px 16px 6px;background:var(--cc-cream);background-image:radial-gradient(#2b1f4712 1px,transparent 1.2px);background-size:14px 14px;color:var(--cc-ink);display:flex;flex-direction:column;justify-content:center;gap:10px;padding:28px;text-align:left;box-shadow:0 30px 80px #000a}
.cc-entry-kicker{font-size:12px;font-weight:1000;letter-spacing:.22em;color:#c04f8a}
.cc-entry-page .entry-ticket-title{font-size:30px;line-height:1.05;font-weight:1000}
.cc-entry-page .entry-ticket-subtitle{font-size:13px;color:#6a55c8}
.cc-entry-meta{display:flex;flex-direction:column;gap:4px;font-size:14px;font-weight:800}
.cc-entry-hint{margin-top:8px;font-size:12px;font-weight:900;color:#c04f8a}
.cc-entry-cover{position:absolute;inset:0;border-radius:6px 16px 16px 6px;transform-origin:left center;transition:transform 1s cubic-bezier(.4,.1,.2,1);backface-visibility:hidden;overflow:hidden;border:5px solid #fff;box-shadow:0 30px 80px #000a,inset 10px 0 18px -10px #0006;display:flex;flex-direction:column;justify-content:flex-end;padding:22px;color:#fff}
.cc-site .cc-entry-photo{position:absolute!important;inset:0!important;transform:none!important;border:0!important;border-radius:0!important;width:auto!important;height:auto!important;background-color:#3a2b78;background-image:radial-gradient(circle at 50% 36%,#ffffff40 0 16%,transparent 17%),repeating-conic-gradient(from 0deg at 50% 36%,#ffffff12 0 3deg,transparent 3deg 12deg),linear-gradient(165deg,#8f6dff,#ff8fc4 62%,#ffd27f);background-size:cover;background-position:center}
.cc-entry-cover-title,.cc-entry-tap{position:relative;z-index:1}
.cc-entry-cover-title{font-size:24px;font-weight:1000;-webkit-text-stroke:2px var(--cc-ink);paint-order:stroke fill;text-shadow:3px 3px 0 var(--cc-pink)}
.cc-entry-tap{margin-top:6px;font-size:11px;font-weight:900;letter-spacing:.2em}
.loader.entry-playing .cc-entry-cover{transform:rotateY(-165deg)}
.loader.entry-playing .cc-entry-book{animation:ccEntryOut .5s ease 1.4s forwards}
@keyframes ccEntryOut{to{transform:scale(1.08);opacity:0}}
.cc-site .loader .skip{background:#ffffff1f;color:#fff;border:1px solid #ffffff55;border-radius:999px;box-shadow:none}
/* 04 booth directory: circle cuts with space-number tabs */
.cc-site .booth-directory-rich{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;color:#fff}
.cc-site .booth-directory-tools{display:flex;gap:12px;align-items:center;background:var(--cc-cream);color:var(--cc-ink);border:3px solid var(--cc-ink)!important;border-radius:999px;padding:8px 10px;box-shadow:5px 5px 0 var(--cc-pink)!important}
.cc-site .directory-tabs{display:flex;gap:4px;background:none;border:0;padding:0}
.cc-site .directory-tabs button{border:2px solid var(--cc-ink);background:#fff;border-radius:999px;padding:6px 14px;font-weight:900;color:var(--cc-ink);box-shadow:none}
.cc-site .directory-tabs button.active{background:var(--cc-ink);color:#fff}
.cc-site .booth-search{flex:1;display:flex;align-items:center;gap:8px;background:none;border:0!important;box-shadow:none;color:var(--cc-ink)}
.cc-site .booth-search input{border:0;background:none;height:36px;flex:1;outline:none;color:var(--cc-ink);box-shadow:none}
.cc-site .booth-directory-tools>button{border:2px solid var(--cc-ink);background:var(--cc-pink);border-radius:999px;padding:6px 12px;font-weight:900;color:#2b1036;box-shadow:none}
.cc-site .directory-context{color:#e6dcff}
.cc-site .booth-directory-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px;margin-top:22px}
.cc-booth{position:relative;display:flex;flex-direction:column;background:#fff;color:var(--cc-ink);border:3px solid var(--cc-ink);border-radius:8px;padding:12px;box-shadow:6px 6px 0 var(--cc-lilac);transition:transform .2s}
.cc-booth:hover{transform:translate(-2px,-2px) rotate(-.6deg)}
.cc-booth-space{position:absolute;top:-3px;left:-3px;z-index:1;border-radius:8px 0 10px 0}
.cc-booth .booth-no{display:block;background:var(--cc-ink);color:#fff;font-size:12px;font-weight:1000;padding:4px 10px;border-radius:8px 0 10px 0}
.cc-booth-cut{aspect-ratio:1;border:2px solid #2b1f4722;border-radius:4px;overflow:hidden;background:repeating-linear-gradient(45deg,#f3ecff 0 8px,#fff 8px 16px);display:grid;place-items:center}
.cc-booth-cut img,.cc-booth-cut .booth-logo{width:100%!important;height:100%!important;object-fit:cover;border:0!important;border-radius:0!important;background:none!important;color:var(--cc-lilac)!important;font-size:30px;font-weight:1000;display:grid;place-items:center;box-shadow:none!important;margin:0!important}
.cc-booth-info{display:flex;flex-direction:column;gap:2px;margin-top:10px}
.cc-booth-info h3{margin:0;font-size:16px;font-weight:1000}
.cc-booth-info small{color:#6a55c8;font-size:12px;font-weight:800}
.cc-booth-info p{margin:4px 0 0;font-size:12px;line-height:1.6;color:#5b4f75}
.cc-booth footer{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.cc-booth .booth-products-link,.cc-booth .favorite-booth{border:2px solid var(--cc-ink);border-radius:999px;background:#fff;padding:4px 10px;font-size:11px;font-weight:900;color:var(--cc-ink);box-shadow:none}
.cc-booth .favorite-booth.active{background:var(--cc-pink);color:#2b1036}
.cc-site .product-directory-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:18px;margin-top:22px}
.cc-product{display:flex;flex-direction:column;background:var(--cc-cream);color:var(--cc-ink);border:3px solid var(--cc-ink);border-radius:14px;overflow:hidden;box-shadow:6px 6px 0 var(--cc-pink)}
.cc-product-art{position:relative;aspect-ratio:1;background:#ffe9f4;border-bottom:3px solid var(--cc-ink)}
.cc-product-art .directory-product-image{width:100%;height:100%;border:0!important;padding:0;background:none!important;display:grid;place-items:center;color:var(--cc-pink);font-weight:1000;box-shadow:none!important;border-radius:0!important}
.cc-product-art img{width:100%;height:100%;object-fit:cover}
.cc-new{position:absolute;top:10px;right:-4px;background:#ffe45c;color:var(--cc-ink);border:2px solid var(--cc-ink);font-size:11px;font-weight:1000;padding:3px 10px;transform:rotate(8deg);box-shadow:2px 2px 0 var(--cc-ink)}
.cc-product-info{display:flex;flex-direction:column;gap:3px;padding:10px 12px 0}
.cc-product-info b{font-size:15px;font-weight:1000}
.cc-product-info small{font-size:11px;color:#6a55c8;font-weight:800}
.cc-product .product-tag{font-style:normal;align-self:flex-start;font-size:11px;font-weight:900;color:#c04f8a}
.cc-product footer{display:flex;justify-content:space-between;align-items:center;padding:8px 12px 12px;font-weight:1000;color:#c04f8a}
.cc-product .wishlist-product{border:2px solid var(--cc-ink);border-radius:999px;background:#fff;padding:3px 10px;font-size:11px;font-weight:900;color:var(--cc-ink);box-shadow:none}
.cc-product .wishlist-product.active{background:#ffe45c}
/* 04 guide: manga panels with speech-bubble tails */
.cc-site .guide-detail-content{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:22px}
.cc-guide{position:relative;display:flex;flex-direction:column;gap:8px;background:#fff;color:var(--cc-ink);border:3px solid var(--cc-ink);border-radius:18px;padding:22px 20px 18px;box-shadow:6px 6px 0 var(--cc-pink);grid-column:auto!important;min-height:0}
.cc-guide:after{content:"";position:absolute;left:34px;bottom:-15px;width:22px;height:22px;background:#fff;border-right:3px solid var(--cc-ink);border-bottom:3px solid var(--cc-ink);transform:rotate(45deg)}
.cc-guide-no{position:absolute;top:-14px;left:16px;background:var(--cc-cyan);color:var(--cc-ink);border:2px solid var(--cc-ink);border-radius:999px;padding:3px 12px;font-size:11px;font-weight:1000;letter-spacing:.08em}
.cc-guide-body small{color:#c04f8a;font-size:11px;font-weight:1000;letter-spacing:.16em}
.cc-guide-body h3{margin:2px 0 6px;font-size:19px;font-weight:1000}
.cc-guide-body p{margin:0;font-size:13px;line-height:1.85;color:#4a3d66;white-space:pre-line}
.cc-guide .guide-venue-nav{display:inline-block;margin-top:10px;background:var(--cc-pink);color:#2b1036;border:2px solid var(--cc-ink);border-radius:999px;box-shadow:none;font-size:12px;font-weight:900;padding:6px 14px}
.cc-guide .guide-access-media-empty{display:none}
/* 04 tickets, announcements, community, sponsors, map */
.cc-site .ticket-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}
.cc-site .cc-ticket{display:grid;grid-template-columns:1fr 110px;background:var(--cc-cream)!important;color:var(--cc-ink);border:3px solid var(--cc-ink)!important;border-radius:14px;padding:0;overflow:hidden;box-shadow:6px 6px 0 var(--cc-cyan)!important;min-height:0}
.cc-ticket-main{display:flex;flex-direction:column;gap:6px;padding:18px 20px}
.cc-ticket-main small{font-size:10px;font-weight:1000;letter-spacing:.18em;color:#c04f8a}
.cc-ticket-main h3{margin:0;font-size:20px;font-weight:1000}
.cc-ticket-main .oe-ticket-gift{font-size:13px;white-space:pre-line;color:#4a3d66}
.cc-ticket-main .oe-ticket-note{font-size:11px;color:#6a55c8}
.cc-ticket-stub{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:var(--cc-pink);border-left:3px dashed var(--cc-ink);color:#2b1036;font-weight:1000}
.cc-ticket-stub span{font-size:11px;letter-spacing:.12em}.cc-ticket-stub i{font-style:normal;font-size:22px}
.cc-ticket-stub .oe-ticket-price{font-size:20px}
.cc-site .updates-list{display:flex;flex-direction:column;gap:10px}
.cc-update{display:flex;align-items:center;gap:12px;background:#ffffff12;border:1px solid #ffffff2e;border-radius:999px;padding:10px 18px;color:#fff}
.cc-update-star{color:#ffe45c}
.cc-update time{font-size:12px;font-weight:900;color:var(--cc-cyan)}
.cc-update b{flex:1;font-size:14px}.cc-update i{font-style:normal;color:var(--cc-pink);font-size:20px}
.cc-site .community{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}
.cc-site .cc-social{display:flex;flex-direction:column;background:#fff!important;color:var(--cc-ink);border:3px solid var(--cc-ink)!important;border-radius:16px;overflow:hidden;box-shadow:6px 6px 0 var(--cc-lilac)!important;min-height:0;padding:0}
.cc-social-art{aspect-ratio:16/9;background:linear-gradient(135deg,#b9a3ff,#ff8fc4);display:grid;place-items:center}
.cc-social-art img,.cc-social-art>*{width:100%;height:100%;object-fit:cover;border:0!important;border-radius:0!important;margin:0!important;min-height:0!important}
.cc-social-text{padding:12px 14px;display:flex;flex-direction:column;gap:4px}
.cc-social-text b{font-size:15px;font-weight:1000}.cc-social-text p{margin:0;font-size:12px;color:#5b4f75}
.cc-social .social-action{font-size:12px;font-weight:900;color:#c04f8a;border:0;background:none;padding:0}
.cc-site .sponsors{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}
.cc-site .cc-sponsor{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;background:#fff!important;color:var(--cc-ink);border:3px solid var(--cc-ink)!important;border-radius:14px;padding:26px 14px 14px;box-shadow:5px 5px 0 var(--cc-pink)!important;text-align:center}
.cc-sponsor-ribbon{position:absolute;top:-12px;background:var(--cc-ink);color:#ffe45c;font-size:10px;font-weight:1000;letter-spacing:.14em;padding:4px 10px;border-radius:4px}
.cc-site .map-explorer{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:20px}
.cc-site .map-static{min-height:400px}
.cc-site .cc-routes{padding:18px}
.cc-site .map-link-list{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.cc-map-tag{display:flex;align-items:center;gap:8px;background:#fff;border:2px solid var(--cc-ink);border-radius:999px;padding:7px 12px;font-size:13px;font-weight:900;color:var(--cc-ink)}
.cc-map-tag b{color:var(--cc-pink)}.cc-map-tag i{margin-left:auto;font-style:normal}
/* 04 footer: starry sign-off */
.cc-site .footer{padding:40px 0 34px;background:transparent!important;border-top:2px dashed #ffffff2e}
.cc-site .footer-grid{display:grid!important;grid-template-columns:1.4fr repeat(3,1fr);gap:24px}
.cc-site .footer-brand h2{margin:0 0 6px;font-size:22px;font-weight:1000;color:#fff;-webkit-text-stroke:1px var(--cc-ink);text-shadow:3px 3px 0 var(--cc-pink)}
.cc-site .footer-brand h2:before{content:"✦ ";color:#ffe45c}
.cc-site .footer-brand p{margin:0;color:#cbbdf5;font-size:13px}
.cc-site .footer-grid b{display:block;margin-bottom:8px;color:var(--cc-pink);font-size:12px;letter-spacing:.16em}
.cc-site .footer-grid nav{display:flex;flex-direction:column;gap:6px}.cc-site .footer-grid nav a{color:#e6dcff;font-size:13px}
@media(max-width:800px){.cc-site .guide-detail-content{grid-template-columns:1fr!important}.cc-site .map-explorer{grid-template-columns:1fr}.cc-site .footer-grid{grid-template-columns:1fr 1fr}.cc-site .booth-directory-tools{flex-wrap:wrap;border-radius:18px}}

/* 04 overrides for shared runtime rules (gate filter, editorial guide styling) */
.cc-site .loader .cc-entry-gate{filter:none!important;display:block!important;width:auto!important;height:auto!important;min-height:0!important;animation:none!important}
.cc-site .cc-entry-gate:before,.cc-site .cc-entry-gate:after{display:none!important}
.cc-site #guide .guide-detail-grid{display:block!important}
.cc-site #guide .cc-guide{background:#fff!important;border:3px solid var(--cc-ink)!important;border-radius:18px!important;box-shadow:6px 6px 0 var(--cc-pink)!important;padding:24px 20px 18px!important;margin:12px 0 18px!important;color:var(--cc-ink)!important;overflow:visible!important}
.cc-site #guide .cc-guide:before{display:none!important}
.cc-site #guide .cc-guide:after{content:""!important;display:block!important;position:absolute!important;left:34px!important;top:auto!important;bottom:-14px!important;width:22px!important;height:22px!important;background:#fff!important;border:0!important;border-right:3px solid var(--cc-ink)!important;border-bottom:3px solid var(--cc-ink)!important;transform:rotate(45deg)!important}
.cc-site #guide .cc-guide-body h3{color:var(--cc-ink)!important}.cc-site #guide .cc-guide-body p{color:#4a3d66!important}

.cc-site #guide .guide-venue-nav{background:var(--cc-pink)!important;color:#2b1036!important;border:2px solid var(--cc-ink)!important;border-radius:999px!important;box-shadow:3px 3px 0 var(--cc-ink)!important;font-size:12px!important;font-weight:900!important;padding:6px 14px!important}

`;

/* softer, rounder panels and centred section headings keep 04 apart from 01's left-aligned sticker layout */
const shapeStyle=`
.cc-site .head{position:relative;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:4px}
.cc-site .head>div{width:100%}
.cc-site .head .section-back{position:absolute;right:0;top:0}
.cc-site .ticket,.cc-site .cc-ticket,.cc-site .cc-booth,.cc-site .cc-product,.cc-site .cc-guide,.cc-site .cc-social,.cc-site .cc-sponsor,.cc-site .community article,.cc-site .guide-grid article,.cc-site .map-static,.cc-site .cc-routes,.cc-site .booth-directory-card,.cc-site .directory-product-card{border-radius:22px!important}
@media(max-width:820px){.cc-site .head .section-back{position:static;margin-top:6px}}
`;
/* hero composition: what the first screen is built from differs from every other template */
const heroStyle=`
.cc-site .hero-grid{grid-template-columns:minmax(0,1fr);justify-items:center;text-align:center;gap:30px}
.cc-site .hero-art{order:0;width:min(380px,84%);max-height:520px}
.cc-site .hero-copy{order:1;display:flex;flex-direction:column;align-items:center}
.cc-site .meta{justify-content:center}.cc-site .cc-cta{align-self:center}
.cc-site .cc-kv-fallback{font-size:clamp(30px,3.6vw,56px);word-break:keep-all;overflow-wrap:normal}
`;
/* ComiCup / allcpp event pages: dark bar, wide banner, breadcrumb and underlined tabs */
const referenceStyle=`
.cc-site .nav{position:sticky;top:0;height:54px;background:#17122e;border:0;border-bottom:3px solid var(--cc-pink)}
.cc-site .nav .wrap{max-width:1180px}
.cc-site .brand{font-size:18px}
.cc-site .hero{padding:18px 0 0;background:transparent}
.cc-site .hero:before,.cc-site .hero:after{display:none}
.cc-site .hero-grid{max-width:1180px;display:grid;grid-template-columns:minmax(0,1fr);justify-items:stretch;text-align:left;gap:0}
.cc-site .hero-art{order:0;width:100%;max-height:none;aspect-ratio:21/6;min-height:0!important;height:auto!important;border-radius:14px;overflow:hidden}
.cc-site .kv{border-radius:14px;border:0;box-shadow:none;background-size:cover;background-position:center 30%}
.cc-site .hero-art .cc-sticker{display:none}
.cc-kv-fallback{font-size:clamp(34px,5vw,84px);transform:none}
.cc-site .hero-copy{order:1;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 24px;align-items:center;padding:16px 4px 6px;text-align:left}
.cc-site .hero-copy .hero-kicker,.cc-site .hero-copy .event-status-badge{grid-column:1;justify-self:start}
.cc-site .hero-copy h1{grid-column:1;font-size:clamp(24px,3.2vw,40px);margin:0;-webkit-text-stroke:0;text-shadow:none}
.cc-site .hero-copy p{grid-column:1;margin:0;max-width:none}
.cc-site .hero-copy .meta{grid-column:1;justify-content:flex-start;margin:4px 0 0}
.cc-site .hero-copy .cc-cta{grid-column:2;grid-row:1 / span 4;align-self:center}
.cc-tabbar{border-bottom:1px solid #ffffff2e;margin-top:10px}
.cc-tabbar .wrap{max-width:1180px}
.cc-crumb{display:flex;gap:10px;align-items:center;padding:10px 0 4px;font-size:13px;color:#cfc4f0}
.cc-crumb a{color:var(--cc-cyan);text-decoration:none}.cc-crumb b{color:#fff;font-weight:800}.cc-crumb i{font-style:normal;opacity:.6}
.cc-tabs{display:flex;gap:6px;overflow:auto}
.cc-tabs a{padding:12px 16px 10px;color:#d9cff7;font-weight:800;font-size:14px;text-decoration:none;border-bottom:3px solid transparent;white-space:nowrap}
.cc-tabs a:hover{color:#fff}.cc-tabs a.active{color:#fff;border-bottom-color:var(--cc-pink)}
.cc-site .cc-catalogue{padding-top:22px}
@media(max-width:820px){.cc-site .hero-art{aspect-ratio:16/9}.cc-site .hero-copy{grid-template-columns:1fr}.cc-site .hero-copy .cc-cta{grid-column:1;grid-row:auto;justify-self:start}}

/* skeleton: a dashboard of titled panels in rows of three and two, like an event information board */
.cc-site .cc-deck{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;width:min(1180px,calc(100% - 48px));margin:22px auto 0;align-items:start}
.cc-site .cc-deck2{grid-template-columns:repeat(2,minmax(0,1fr))}
.cc-site .cc-deck>section{padding:0;margin:0;background:#ffffff0f;border:1px solid #ffffff2e;border-radius:10px;overflow:hidden;box-shadow:none}
.cc-site .cc-deck>section .wrap{width:auto;max-width:none;padding:0;margin:0}
.cc-site .cc-deck .head{margin:0;padding:11px 16px;background:#24194d;border-left:4px solid var(--cc-pink);border-bottom:1px solid #ffffff22;display:block;text-align:left}
.cc-site .cc-deck .head>div{text-align:left;display:block}
.cc-site .cc-deck .head h2{font-size:15px;letter-spacing:.06em;margin:0;text-align:left;transform:none;text-shadow:none;-webkit-text-stroke:0}
.cc-site .cc-deck .head .ey{display:none}
.cc-site .cc-deck .updates-list,.cc-site .cc-deck .ticket-grid,.cc-site .cc-deck .map-explorer,.cc-site .cc-deck .community,.cc-site .cc-deck .sponsors,.cc-site .cc-deck .ticket-actions{padding:14px 16px}
.cc-site .cc-deck .ticket-actions{padding-top:0}
.cc-site .cc-deck .ticket-grid{grid-template-columns:1fr;gap:10px}
.cc-site .cc-deck .map-explorer{grid-template-columns:1fr}
.cc-site .cc-deck .map-static{min-height:170px}
.cc-site .cc-deck .community,.cc-site .cc-deck .sponsors{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
@media(max-width:1000px){.cc-site .cc-deck,.cc-site .cc-deck2{grid-template-columns:1fr;width:calc(100% - 26px)}}

@media(min-width:1001px){.cc-site .cc-deck{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}.cc-site .cc-deck2{grid-template-columns:repeat(auto-fit,minmax(380px,1fr))}}
.cc-site .cc-ticket:before,.cc-site .cc-ticket:after{display:none!important}
`;
const routesStyle=`.cc-routes h3{margin:0 0 12px;text-align:center;font-size:16px;letter-spacing:.08em}.cc-routes .map-link-list{display:grid;gap:10px}.cc-routes[hidden]{display:none}`;
export const previewStyle=coreStyle+catalogueStyle+shapeStyle+heroStyle+referenceStyle+routesStyle;

const loader=`<div class="loader cc-entry" id="loader"><div class="gate cc-entry-gate" role="button" tabindex="0" aria-label="点击翻开电子场刊"><div class="cc-entry-book"><div class="cc-entry-page"><span class="cc-entry-kicker">WELCOME!</span><b class="entry-ticket-title">STARDUST ONLY</b><span class="entry-ticket-subtitle"></span><div class="cc-entry-meta"><span class="entry-ticket-date-wrap"><b class="entry-ticket-date"></b></span><span class="entry-ticket-time-wrap"><b class="entry-ticket-time"></b></span><span class="entry-ticket-location-wrap"><b class="entry-ticket-location"></b></span></div><span class="cc-entry-hint">ようこそ · 欢迎光临 ✦</span></div><div class="cc-entry-cover"><div class="entry-photo cc-entry-photo" aria-label="活动KV"></div><span class="cc-entry-cover-title">WEB CATALOGUE</span><span class="cc-entry-tap">TAP TO OPEN ✦</span></div></div><span class="entry-ticket-label" hidden></span><span class="stub-barcode" hidden></span><span class="stub-code" hidden><span class="entry-serial"></span></span></div><button class="skip" id="skip">跳过 →</button></div>`;

const head=(ey,title)=>'<div class="head"><div><span class="ey">'+ey+'</span><h2>'+title+'</h2></div></div>';
const pageHead=(ey,title)=>'<div class="head"><div><span class="ey">'+ey+'</span><h2>'+title+'</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div>';

export const previewBody=`<div class="cc-site">${loader}
<header class="nav"><div class="wrap"><a class="brand" href="#top" data-oe-field="eventName">STARDUST ONLY</a><nav class="links" data-oe-mount="nav-links"><a href="#home" data-page-link="home">首页</a><a href="#booths" data-target-mode="page" data-page-link="booths">社团</a><a href="#catalogue">场刊</a><a href="#map-home">场地图</a><a href="#guide" data-target-mode="page" data-page-link="guide">指南</a></nav><a class="btn ticket-purchase-link" href="#" target="_blank" rel="noopener">购票 ↗</a></div></header>
<main id="top">
<section class="hero"><div class="wrap hero-grid"><div class="hero-art"><span class="cc-sticker one">WEB CATALOGUE</span><div class="kv"><strong class="cc-kv-fallback" data-oe-field="eventName">STARDUST ONLY</strong></div><span class="cc-sticker two">電子場刊 公開中!</span></div><div class="hero-copy"><span class="hero-kicker">电子场刊</span><h1 data-oe-field="eventName">STARDUST ONLY</h1><p data-oe-field="tagline"></p><div class="meta"><span class="pill" data-oe-field="date"></span><span class="pill" data-oe-field="location"></span><a class="pill venue-nav" href="#map-home" data-oe-field="edition"></a></div><a class="cc-cta ticket-purchase-link" href="#tickets">购票 / 预约</a></div></div></section>
<div class="cc-tabbar oe-home-only"><div class="wrap"><nav class="cc-crumb" aria-label="位置"><a href="#home" data-page-link="home">综合同人展</a><i>›</i><b data-oe-field="eventName">STARDUST ONLY</b></nav><div class="cc-tabs"><a class="active" href="#catalogue">电子场刊</a><a href="#booths" data-target-mode="page" data-page-link="booths">社团 / 作品</a><a href="#map-home">场地图</a><a href="#tickets">票务</a><a href="#guide" data-target-mode="page" data-page-link="guide">观展指南</a></div></div></div>
<section class="cc-catalogue oe-home-only" id="catalogue" aria-label="电子场刊"><div class="wrap">${head('WEB CATALOGUE · 電子場刊','翻阅电子场刊')}<div data-oe-mount="catalogue-book"></div></div></section>
<div class="cc-deck oe-home-only">
<section class="updates-strip oe-home-only" id="updates"><div class="wrap">${head('NEWS','最新公告')}<div class="updates-list"></div></div></section>
<section class="section" id="tickets"><div class="wrap">${head('ADMISSION','入场票')}<div class="ticket-grid"></div><div class="ticket-actions"></div></div></section>
<section class="section" id="map-home"><div class="wrap">${head('VENUE MAP','场地图')}<div class="map-explorer"><div class="map-static-shell"><div class="map-static" id="venueMap" data-oe-image="venueMap.image"></div></div><aside class="cc-routes" data-oe-mount="map-rail" data-oe-collection="explore"><h3>✦ 逛展导览 ✦</h3><div class="map-link-list"></div></aside></div></div></section>
</div>
<div class="cc-deck cc-deck2 oe-home-only">
<section class="section" id="community"><div class="wrap">${head('COMMUNITY','社群')}<div class="community"></div></div></section>
<section class="section" id="sponsors"><div class="wrap">${head('SPONSORS','合作伙伴')}<div class="sponsors"></div></div></section>
</div>
<section class="section oe-page-view" id="booths"><div class="wrap">${pageHead('CIRCLE LIST','参展社团与制品')}<div class="booth-directory-rich"></div></div></section>
<section class="section oe-page-view" id="guide"><div class="wrap">${pageHead('GUIDE','观展指南')}<div class="guide-grid guide-detail-grid"></div></div></section>
</main>
<footer class="footer"><div class="wrap footer-grid"><div class="footer-brand"></div><div class="footer-participate"></div><div class="footer-visit"></div><div class="footer-social"></div></div></footer>
</div>`;
