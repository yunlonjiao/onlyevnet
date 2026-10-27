/* Template 04 · CREATOR CATALOGUE visitor art on the shared IP ONLY core: an illustrated
   doujin-event pamphlet. Layout hooks follow Template 01 so the shared renderer, editor and
   exporter work unchanged; everything visual is scoped to .cc-site. */
import {previewStyle as coreStyle} from '/v8/templates/01-ip-only-preview.js?v=8.41.4';

const catalogueStyle=`
.cc-site{--primary:#d9a8b7;--secondary:#a2cad0;--cc-night:#eee7e3;--cc-night-2:#e9e2dc;--cc-pink:#d9a8b7;--cc-lilac:#c8bedb;--cc-cyan:#a2cad0;--cc-cream:#fff8ef;--cc-ink:#514752;--cc-line:#ffffff26;
 position:relative;min-height:100vh;color:#fff;font-family:"M PLUS Rounded 1c","Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;
 background:radial-gradient(1.5px 1.5px at 12% 18%,#fff 98%,transparent),radial-gradient(1px 1px at 32% 62%,#fff 98%,transparent),radial-gradient(1.5px 1.5px at 72% 28%,#fff 98%,transparent),radial-gradient(1px 1px at 88% 78%,#fff 98%,transparent),radial-gradient(1px 1px at 52% 88%,#fffa 98%,transparent),radial-gradient(circle at 80% -10%,#e5dce9 0,transparent 45%),radial-gradient(circle at -10% 40%,#efdee4 0,transparent 40%),var(--cc-night);background-size:340px 340px,260px 260px,420px 420px,300px 300px,380px 380px,100% 100%,100% 100%,auto}
.cc-site .wrap{max-width:1240px;padding:0 24px;margin:0 auto}
/* Header: glassy night bar with a star-tipped brand */
.cc-site .nav{position:sticky;top:0;z-index:40;height:68px;background:#eee7e3d9;backdrop-filter:blur(10px);border:0;border-bottom:1px solid var(--cc-line);box-shadow:none}
.cc-site .nav .wrap{height:100%;display:flex;align-items:center;gap:20px}
.cc-site .brand{font-size:20px;font-weight:1000;color:#fff;border:0;background:none;padding:0;box-shadow:none;letter-spacing:.02em}
.cc-site .brand:before{content:"✦ ";color:var(--cc-pink)}
.cc-site .nav .links{display:flex;gap:22px;margin-left:auto}
.cc-site .nav .links a{color:#706773;font-size:13px;font-weight:800;border:0;background:none;padding:0}
.cc-site .nav .links a:hover{color:var(--cc-cyan)}
.cc-site .nav .wrap>.btn{background:var(--cc-pink);color:#514752;border:0;border-radius:999px;box-shadow:0 0 0 3px #d9a8b755;font-weight:900;font-size:12px;padding:8px 14px;white-space:nowrap}
.cc-site .nav .links a{white-space:nowrap}
/* Hero: poster card with key art, speed lines and stickers */
.cc-site .hero{min-height:0;padding:44px 0 30px;background:transparent;overflow:hidden;display:block}
.cc-site .hero:before{content:"";display:block;position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 70% 45%,#ffffff0d 0 2deg,transparent 2deg 9deg);pointer-events:none}
.cc-site .hero:after{display:none}
.cc-site .hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:36px;align-items:center}
.cc-site .hero-art{position:relative;order:0;aspect-ratio:3/4;max-height:640px;width:100%}
.cc-site .kv{position:absolute;inset:0;border:6px solid #fff;border-radius:22px;box-shadow:12px 12px 0 var(--cc-pink),0 30px 80px #534b4422;background-color:#e9dce0;background-image:var(--oe-hero-image-desktop),linear-gradient(160deg,#ded6e5,#f5dde0 60%,#f8ecd9);background-size:cover;background-position:var(--oe-hero-focal-desktop),center;transform:rotate(-2deg);display:flex;align-items:center;justify-content:center;overflow:hidden}
.cc-site .kv:before{display:none}.cc-site .kv:after{display:none}
.cc-site .kv.empty{background-image:radial-gradient(circle at 50% 38%,#ffffff55 0 18%,transparent 19%),repeating-radial-gradient(circle at 50% 38%,transparent 0 22px,#ffffff14 22px 24px),linear-gradient(160deg,#ded6e5,#f5dde0 60%,#f8ecd9)!important}
.cc-kv-fallback{display:none;max-width:86%;text-align:center;font-size:clamp(46px,6vw,96px);font-weight:1000;line-height:.95;color:#fff;-webkit-text-stroke:3px var(--cc-ink);paint-order:stroke fill;text-shadow:6px 6px 0 var(--cc-ink);transform:rotate(-6deg);overflow-wrap:anywhere}
.cc-site .kv.empty .cc-kv-fallback{display:block}
.cc-sticker{position:absolute;z-index:3;padding:8px 14px;border-radius:12px;font-weight:1000;font-size:13px;letter-spacing:.08em;border:3px solid var(--cc-ink);box-shadow:4px 4px 0 var(--cc-ink)}
.cc-sticker.one{top:22px;left:-14px;background:var(--cc-cyan);color:var(--cc-ink);transform:rotate(-9deg)}
.cc-sticker.two{bottom:34px;right:-12px;background:#eee1ba;color:var(--cc-ink);transform:rotate(7deg)}
.cc-site .hero-copy{order:1;position:relative;display:flex;flex-direction:column;gap:14px;background:none;border:0;padding:0;box-shadow:none}
.cc-site .hero-kicker{align-self:flex-start;padding:6px 12px;border-radius:999px;background:#ffffff1f;border:1px solid #ffffff40;font-size:11px;font-weight:900;letter-spacing:.2em;color:var(--cc-cyan)}
.cc-site .hero-copy h1{margin:0;font-size:clamp(40px,5.4vw,84px);line-height:1;font-weight:1000;color:#fff;-webkit-text-stroke:2px var(--cc-ink);paint-order:stroke fill;text-shadow:5px 5px 0 var(--cc-pink);overflow-wrap:anywhere}
.cc-site .hero-copy p{margin:0;color:#706773;font-size:15px;line-height:1.8;max-width:30em}
.cc-site .hero-copy .meta{display:flex;flex-wrap:wrap;gap:10px}
.cc-site .hero-copy .meta .pill{border:2px solid #ffffff55;background:#ffffff14;color:#fff;border-radius:999px;padding:8px 14px;font-weight:900;box-shadow:none}
.cc-site .hero-copy .meta .venue-nav{border-color:var(--cc-cyan);color:var(--cc-cyan)}
.cc-site .event-status-badge{align-self:flex-start;border:0;box-shadow:none;background:var(--cc-pink);color:#514752;border-radius:8px;padding:5px 10px;font-weight:900}
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
.cc-site .cb-page{background:var(--cc-cream);color:var(--cc-ink);background-image:radial-gradient(#51475212 1px,transparent 1.2px);background-size:14px 14px;box-shadow:0 18px 50px #534b4422}
.cc-site .cb-page.left{box-shadow:inset -26px 0 30px -20px #51475240,0 18px 50px #534b4422}
.cc-site .cb-page.right{box-shadow:inset 26px 0 30px -20px #51475240,0 18px 50px #534b4422}
.cc-site .cb-ribbon{position:absolute;top:-10px;right:18%;width:22px;height:90px;background:var(--cc-pink);clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%);z-index:6}
.cc-site .cb-page-head small{color:#977987}.cc-site .cb-page-head b{color:var(--cc-ink)}
.cc-site .cb-page-head{border-bottom:3px dotted #51475233;padding-bottom:8px}
.cc-site .cb-folio{color:#51475299}
.cc-site .cb-cover{background-color:#e9dce0;background-image:radial-gradient(circle at 50% 36%,#ffffff40 0 16%,transparent 17%),repeating-conic-gradient(from 0deg at 50% 36%,#ffffff12 0 3deg,transparent 3deg 12deg),linear-gradient(165deg,#ded6e5,#f5dde0 62%,#f8ecd9);color:#fff}
.cc-site .cb-cover.has-art{background-size:cover}
.cc-site .cb-cover.has-art:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 45%,#eee7e3cc);pointer-events:none}
.cc-site .cb-cover>*{position:relative;z-index:1}
.cc-site .cb-cover h3{-webkit-text-stroke:2px var(--cc-ink);paint-order:stroke fill;text-shadow:4px 4px 0 var(--cc-pink)}
.cc-site .cb-cover-badge{position:absolute;top:18px;left:18px;padding:6px 10px;background:#fff;color:var(--cc-ink);border-radius:8px;font-size:11px;font-weight:1000;letter-spacing:.15em;box-shadow:3px 3px 0 var(--cc-ink)}
.cc-site .cb-cover-vol{font-size:12px;font-weight:900;letter-spacing:.2em;color:#fff}
.cc-site .cb-cover-star{position:absolute;top:16px;right:22px;font-size:40px;color:#eee1ba;font-style:normal;text-shadow:3px 3px 0 var(--cc-ink)}
.cc-site .cb-contents button{border-bottom:2px dashed #51475226}
/* Keep catalogue TOC controls below the sticky 68px navigation when scrolled into view. */
.cc-site .cb-contents button{scroll-margin-top:110px;scroll-margin-bottom:28px}
.cc-site .cb-book{scroll-margin-top:96px}
.cc-site .cb-contents span{color:#977987}.cc-site .cb-contents i{font-style:normal;font-weight:900;color:#776778}
.cc-site .cb-bubble p{background:#fff;border:3px solid var(--cc-ink);box-shadow:4px 4px 0 var(--cc-pink)}
.cc-site .cb-avatar{background:var(--cc-pink);color:#fff;border:3px solid var(--cc-ink)}
.cc-site .cb-rules article{background:#fff;border-radius:12px;padding:10px 12px;border:2px solid #51475222}
.cc-site .cb-rules b{color:#776778;font-size:13px}
.cc-site .cb-cut{background:#fff;border:2px solid var(--cc-ink);border-radius:6px;color:var(--cc-ink)}
.cc-site .cb-space{background:var(--cc-ink);color:#fff;border-radius:4px 0 6px 0}
.cc-site .cb-cut-art{background:repeating-linear-gradient(45deg,#f7f2f7 0 8px,#fff 8px 16px);border:1px solid #51475222}
.cc-site .cb-cut-art em{font-style:normal;font-weight:1000;font-size:22px;color:#c8bedb}
.cc-site .cb-work{color:var(--cc-ink)}
.cc-site .cb-work-art{background:#ffe9f4;border-radius:10px;border:2px solid #51475218}
.cc-site .cb-work-art em{font-style:normal;font-weight:1000;color:#d9a8b7;transform:rotate(-8deg)}
.cc-site .cb-map{background:#fff;border-radius:10px;border:2px solid #51475222}
.cc-site .cb-stamps span{border:3px dashed #977987;color:#977987}
.cc-site .cb-controls button{border:2px solid #fff;background:#ffffff14;color:#fff}
.cc-site .cb-controls span{color:#706773}
/* Shared components on the night sky */
.cc-site .updates-strip{background:#ffffff0d;border:0;border-block:1px solid var(--cc-line);padding:14px 0}
.cc-site .ticket,.cc-site .community article,.cc-site .map-static,.cc-site .map-link-rail,.cc-site .booth-directory-card,.cc-site .directory-product-card,.cc-site .guide-grid article,.cc-site .sponsors>*,.cc-site .booth-directory-rich>*:first-child{border:2px solid var(--cc-ink)!important;border-radius:16px;background:var(--cc-cream);color:var(--cc-ink);box-shadow:6px 6px 0 var(--cc-pink)!important}
.cc-site .cut-ticket:before,.cc-site .cut-ticket:after{display:none}
.cc-site .ticket .price{color:#977987}
.cc-site .ticket-actions .btn,.cc-site .ticket-purchase-link{background:var(--cc-pink);color:#514752;border-radius:999px}
.cc-site .footer{background:#ebe5df;color:#706773;border-top:1px solid var(--cc-line);margin-top:60px}
.cc-site .footer h2{color:#fff}
@media(max-width:900px){.cc-site .hero-grid{grid-template-columns:1fr;gap:26px}.cc-site .hero-art{max-width:440px;margin:0 auto}.cc-site .nav .links{gap:10px}.cc-site .nav .links a{font-size:11px}.cc-site .brand{font-size:16px}}
@media(max-width:760px){.cc-site .nav .wrap{gap:10px}.cc-site .nav .links{gap:12px;overflow-x:auto;scrollbar-width:none;min-width:0}.cc-site .nav .wrap>.btn{display:none}.cc-site .wrap{padding:0 14px}.cc-sticker{font-size:11px}.cc-site .kv{background-image:var(--oe-hero-image-mobile),linear-gradient(160deg,#ded6e5,#f5dde0 60%,#f8ecd9);background-position:var(--oe-hero-focal-mobile),center}}

/* 04 entry: a closed pamphlet whose cover swings open */
.cc-site .loader.cc-entry{background:radial-gradient(circle at 50% 40%,#e9dfe8,#eee7e3 70%)!important;place-items:center}
.cc-entry .entry-ticket-label,.cc-entry .stub-barcode,.cc-entry .stub-code{display:none!important}
.cc-entry-gate{cursor:pointer;background:none;border:0;padding:0;box-shadow:none;transform:none;perspective:1800px}
.cc-entry-book{position:relative;width:min(360px,76vw);aspect-ratio:.72;transform-style:preserve-3d}
.cc-entry-page{position:absolute;inset:0;border-radius:6px 16px 16px 6px;background:var(--cc-cream);background-image:radial-gradient(#51475212 1px,transparent 1.2px);background-size:14px 14px;color:var(--cc-ink);display:flex;flex-direction:column;justify-content:center;gap:10px;padding:28px;text-align:left;box-shadow:0 30px 80px #534b4433}
.cc-entry-kicker{font-size:12px;font-weight:1000;letter-spacing:.22em;color:#977987}
.cc-entry-page .entry-ticket-title{font-size:30px;line-height:1.05;font-weight:1000}
.cc-entry-page .entry-ticket-subtitle{font-size:13px;color:#776778}
.cc-entry-meta{display:flex;flex-direction:column;gap:4px;font-size:14px;font-weight:800}
.cc-entry-hint{margin-top:8px;font-size:12px;font-weight:900;color:#977987}
.cc-entry-cover{position:absolute;inset:0;border-radius:6px 16px 16px 6px;transform-origin:left center;transition:transform 1s cubic-bezier(.4,.1,.2,1);backface-visibility:hidden;overflow:hidden;border:5px solid #fff;box-shadow:0 30px 80px #534b4433,inset 10px 0 18px -10px #534b4422;display:flex;flex-direction:column;justify-content:flex-end;padding:22px;color:#fff}
.cc-site .cc-entry-photo{position:absolute!important;inset:0!important;transform:none!important;border:0!important;border-radius:0!important;width:auto!important;height:auto!important;background-color:#e9dce0;background-image:radial-gradient(circle at 50% 36%,#ffffff40 0 16%,transparent 17%),repeating-conic-gradient(from 0deg at 50% 36%,#ffffff12 0 3deg,transparent 3deg 12deg),linear-gradient(165deg,#ded6e5,#f5dde0 62%,#f8ecd9);background-size:cover;background-position:center}
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
.cc-site .booth-directory-tools>button{border:2px solid var(--cc-ink);background:var(--cc-pink);border-radius:999px;padding:6px 12px;font-weight:900;color:#514752;box-shadow:none}
.cc-site .directory-context{color:#706773}
.cc-site .booth-directory-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px;margin-top:22px}
.cc-booth{position:relative;display:flex;flex-direction:column;background:#fff;color:var(--cc-ink);border:3px solid var(--cc-ink);border-radius:8px;padding:12px;box-shadow:6px 6px 0 var(--cc-lilac);transition:transform .2s}
.cc-booth:hover{transform:translate(-2px,-2px) rotate(-.6deg)}
.cc-booth-space{position:absolute;top:-3px;left:-3px;z-index:1;border-radius:8px 0 10px 0}
.cc-booth .booth-no{display:block;background:var(--cc-ink);color:#fff;font-size:12px;font-weight:1000;padding:4px 10px;border-radius:8px 0 10px 0}
.cc-booth-cut{aspect-ratio:1;border:2px solid #51475222;border-radius:4px;overflow:hidden;background:repeating-linear-gradient(45deg,#f7f2f7 0 8px,#fff 8px 16px);display:grid;place-items:center}
.cc-booth-cut img,.cc-booth-cut .booth-logo{width:100%!important;height:100%!important;object-fit:cover;border:0!important;border-radius:0!important;background:none!important;color:var(--cc-lilac)!important;font-size:30px;font-weight:1000;display:grid;place-items:center;box-shadow:none!important;margin:0!important}
.cc-booth-info{display:flex;flex-direction:column;gap:2px;margin-top:10px}
.cc-booth-info h3{margin:0;font-size:16px;font-weight:1000}
.cc-booth-info small{color:#776778;font-size:12px;font-weight:800}
.cc-booth-info p{margin:4px 0 0;font-size:12px;line-height:1.6;color:#706773}
.cc-booth footer{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.cc-booth .booth-products-link,.cc-booth .favorite-booth{border:2px solid var(--cc-ink);border-radius:999px;background:#fff;padding:4px 10px;font-size:11px;font-weight:900;color:var(--cc-ink);box-shadow:none}
.cc-booth .favorite-booth.active{background:var(--cc-pink);color:#514752}
.cc-site .product-directory-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:18px;margin-top:22px}
.cc-product{display:flex;flex-direction:column;background:var(--cc-cream);color:var(--cc-ink);border:3px solid var(--cc-ink);border-radius:14px;overflow:hidden;box-shadow:6px 6px 0 var(--cc-pink)}
.cc-product-art{position:relative;aspect-ratio:1;background:#ffe9f4;border-bottom:3px solid var(--cc-ink)}
.cc-product-art .directory-product-image{width:100%;height:100%;border:0!important;padding:0;background:none!important;display:grid;place-items:center;color:var(--cc-pink);font-weight:1000;box-shadow:none!important;border-radius:0!important}
.cc-product-art img{width:100%;height:100%;object-fit:cover}
.cc-new{position:absolute;top:10px;right:-4px;background:#eee1ba;color:var(--cc-ink);border:2px solid var(--cc-ink);font-size:11px;font-weight:1000;padding:3px 10px;transform:rotate(8deg);box-shadow:2px 2px 0 var(--cc-ink)}
.cc-product-info{display:flex;flex-direction:column;gap:3px;padding:10px 12px 0}
.cc-product-info b{font-size:15px;font-weight:1000}
.cc-product-info small{font-size:11px;color:#776778;font-weight:800}
.cc-product .product-tag{font-style:normal;align-self:flex-start;font-size:11px;font-weight:900;color:#977987}
.cc-product footer{display:flex;justify-content:space-between;align-items:center;padding:8px 12px 12px;font-weight:1000;color:#977987}
.cc-product .wishlist-product{border:2px solid var(--cc-ink);border-radius:999px;background:#fff;padding:3px 10px;font-size:11px;font-weight:900;color:var(--cc-ink);box-shadow:none}
.cc-product .wishlist-product.active{background:#eee1ba}
/* 04 guide: manga panels with speech-bubble tails */
.cc-site .guide-detail-content{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:22px}
.cc-guide{position:relative;display:flex;flex-direction:column;gap:8px;background:#fff;color:var(--cc-ink);border:3px solid var(--cc-ink);border-radius:18px;padding:22px 20px 18px;box-shadow:6px 6px 0 var(--cc-pink);grid-column:auto!important;min-height:0}
.cc-guide:after{content:"";position:absolute;left:34px;bottom:-15px;width:22px;height:22px;background:#fff;border-right:3px solid var(--cc-ink);border-bottom:3px solid var(--cc-ink);transform:rotate(45deg)}
.cc-guide-no{position:absolute;top:-14px;left:16px;background:var(--cc-cyan);color:var(--cc-ink);border:2px solid var(--cc-ink);border-radius:999px;padding:3px 12px;font-size:11px;font-weight:1000;letter-spacing:.08em}
.cc-guide-body small{color:#977987;font-size:11px;font-weight:1000;letter-spacing:.16em}
.cc-guide-body h3{margin:2px 0 6px;font-size:19px;font-weight:1000}
.cc-guide-body p{margin:0;font-size:13px;line-height:1.85;color:#645e62;white-space:pre-line}
.cc-guide .guide-venue-nav{display:inline-block;margin-top:10px;background:var(--cc-pink);color:#514752;border:2px solid var(--cc-ink);border-radius:999px;box-shadow:none;font-size:12px;font-weight:900;padding:6px 14px}
.cc-guide .guide-access-media-empty{display:none}
/* 04 tickets, announcements, community, sponsors, map */
.cc-site .ticket-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}
.cc-site .cc-ticket{display:grid;grid-template-columns:1fr 110px;background:var(--cc-cream)!important;color:var(--cc-ink);border:3px solid var(--cc-ink)!important;border-radius:14px;padding:0;overflow:hidden;box-shadow:6px 6px 0 var(--cc-cyan)!important;min-height:0}
.cc-ticket-main{display:flex;flex-direction:column;gap:6px;padding:18px 20px}
.cc-ticket-main small{font-size:10px;font-weight:1000;letter-spacing:.18em;color:#977987}
.cc-ticket-main h3{margin:0;font-size:20px;font-weight:1000}
.cc-ticket-main .oe-ticket-gift{font-size:13px;white-space:pre-line;color:#645e62}
.cc-ticket-main .oe-ticket-note{font-size:11px;color:#776778}
.cc-ticket-stub{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:var(--cc-pink);border-left:3px dashed var(--cc-ink);color:#514752;font-weight:1000}
.cc-ticket-stub span{font-size:11px;letter-spacing:.12em}.cc-ticket-stub i{font-style:normal;font-size:22px}
.cc-ticket-stub .oe-ticket-price{font-size:20px}
.cc-site .updates-list{display:flex;flex-direction:column;gap:10px}
.cc-update{display:flex;align-items:center;gap:12px;background:#ffffff12;border:1px solid #ffffff2e;border-radius:999px;padding:10px 18px;color:#fff}
.cc-update-star{color:#eee1ba}
.cc-update time{font-size:12px;font-weight:900;color:var(--cc-cyan)}
.cc-update b{flex:1;font-size:14px}.cc-update i{font-style:normal;color:var(--cc-pink);font-size:20px}
.cc-site .community{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}
.cc-site .cc-social{display:flex;flex-direction:column;background:#fff!important;color:var(--cc-ink);border:3px solid var(--cc-ink)!important;border-radius:16px;overflow:hidden;box-shadow:6px 6px 0 var(--cc-lilac)!important;min-height:0;padding:0}
.cc-social-art{aspect-ratio:16/9;background:linear-gradient(135deg,#c8bedb,#f5dde0);display:grid;place-items:center}
.cc-social-art img,.cc-social-art>*{width:100%;height:100%;object-fit:cover;border:0!important;border-radius:0!important;margin:0!important;min-height:0!important}
.cc-social-text{padding:12px 14px;display:flex;flex-direction:column;gap:4px}
.cc-social-text b{font-size:15px;font-weight:1000}.cc-social-text p{margin:0;font-size:12px;color:#706773}
.cc-social .social-action{font-size:12px;font-weight:900;color:#977987;border:0;background:none;padding:0}
.cc-site .sponsors{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px}
.cc-site .cc-sponsor{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;background:#fff!important;color:var(--cc-ink);border:3px solid var(--cc-ink)!important;border-radius:14px;padding:26px 14px 14px;box-shadow:5px 5px 0 var(--cc-pink)!important;text-align:center}
.cc-sponsor-ribbon{position:absolute;top:-12px;background:var(--cc-ink);color:#eee1ba;font-size:10px;font-weight:1000;letter-spacing:.14em;padding:4px 10px;border-radius:4px}
.cc-site .map-explorer{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:20px}
.cc-site .map-static{min-height:400px}
.cc-site .map-link-rail{padding:18px}
.cc-site .map-link-list{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.cc-map-tag{display:flex;align-items:center;gap:8px;background:#fff;border:2px solid var(--cc-ink);border-radius:999px;padding:7px 12px;font-size:13px;font-weight:900;color:var(--cc-ink)}
.cc-map-tag b{color:var(--cc-pink)}.cc-map-tag i{margin-left:auto;font-style:normal}
/* 04 footer: starry sign-off */
.cc-site .footer{padding:40px 0 34px;background:transparent!important;border-top:2px dashed #ffffff2e}
.cc-site .footer-grid{display:grid!important;grid-template-columns:1.4fr repeat(3,1fr);gap:24px}
.cc-site .footer-brand h2{margin:0 0 6px;font-size:22px;font-weight:1000;color:#fff;-webkit-text-stroke:1px var(--cc-ink);text-shadow:3px 3px 0 var(--cc-pink)}
.cc-site .footer-brand h2:before{content:"✦ ";color:#eee1ba}
.cc-site .footer-brand p{margin:0;color:#706773;font-size:13px}
.cc-site .footer-grid b{display:block;margin-bottom:8px;color:var(--cc-pink);font-size:12px;letter-spacing:.16em}
.cc-site .footer-grid nav{display:flex;flex-direction:column;gap:6px}.cc-site .footer-grid nav a{color:#706773;font-size:13px}
@media(max-width:800px){.cc-site .guide-detail-content{grid-template-columns:1fr!important}.cc-site .map-explorer{grid-template-columns:1fr}.cc-site .footer-grid{grid-template-columns:1fr 1fr}.cc-site .booth-directory-tools{flex-wrap:wrap;border-radius:18px}}

/* 04 overrides for shared runtime rules (gate filter, editorial guide styling) */
.cc-site .loader .cc-entry-gate{filter:none!important;display:block!important;width:auto!important;height:auto!important;min-height:0!important;animation:none!important}
.cc-site .cc-entry-gate:before,.cc-site .cc-entry-gate:after{display:none!important}
.cc-site #guide .guide-detail-grid{display:block!important}
.cc-site #guide .cc-guide{background:#fff!important;border:3px solid var(--cc-ink)!important;border-radius:18px!important;box-shadow:6px 6px 0 var(--cc-pink)!important;padding:24px 20px 18px!important;margin:12px 0 18px!important;color:var(--cc-ink)!important;overflow:visible!important}
.cc-site #guide .cc-guide:before{display:none!important}
.cc-site #guide .cc-guide:after{content:""!important;display:block!important;position:absolute!important;left:34px!important;top:auto!important;bottom:-14px!important;width:22px!important;height:22px!important;background:#fff!important;border:0!important;border-right:3px solid var(--cc-ink)!important;border-bottom:3px solid var(--cc-ink)!important;transform:rotate(45deg)!important}
.cc-site #guide .cc-guide-body h3{color:var(--cc-ink)!important}.cc-site #guide .cc-guide-body p{color:#645e62!important}

.cc-site #guide .guide-venue-nav{background:var(--cc-pink)!important;color:#514752!important;border:2px solid var(--cc-ink)!important;border-radius:999px!important;box-shadow:3px 3px 0 var(--cc-ink)!important;font-size:12px!important;font-weight:900!important;padding:6px 14px!important}


/* Sakura editorial refresh: quiet, paper-first publication aesthetic.
   Scoped to catalogue visitor UI; shared data, anchors and controls are unchanged. */
.cc-site{--primary:#bc9fb3;--secondary:#c8dce2;--cc-night:#f6f2eb;--cc-night-2:#e9e2dc;--cc-pink:#d9a8b7;--cc-lilac:#c8bedb;--cc-cyan:#a2cad0;--cc-cream:#fffdf8;--cc-ink:#3d3940;--cc-line:#ddd5d0;color:var(--cc-ink);background:#f6f2eb;background-image:linear-gradient(90deg,#e7ded5 1px,transparent 1px),linear-gradient(#e7ded5 1px,transparent 1px);background-size:76px 76px}
.cc-site .nav{background:#fffdf8ed;border-bottom:1px solid #e1d9d0;box-shadow:0 2px 12px #564d4310}
.cc-site .brand,.cc-site .nav .links a,.cc-site .head h2,.cc-site .hero-copy h1,.cc-site .footer h2{color:var(--cc-ink)}
.cc-site .brand:before{color:#c28b9e}
.cc-site .nav .links a:hover{color:#a4728a}
.cc-site .hero{background:transparent}
.cc-site .hero:before{display:none}
.cc-site .hero-copy{background:#fffdf8dd;padding:clamp(18px,3vw,38px);border:1px solid #e5dcd2;box-shadow:8px 9px 0 #e5ded5}
.cc-site .hero-kicker{background:#eee5e7;color:#806877;border:1px solid #e4d1d8;letter-spacing:.12em}
.cc-site .hero-copy h1{font-size:clamp(36px,4.5vw,70px);line-height:1.09;-webkit-text-stroke:0;text-shadow:none;letter-spacing:-.055em}
.cc-site .hero-copy p,.cc-site .hero-copy .meta,.cc-site .hero-copy .meta .pill{color:#645e62}
.cc-site .head .ey{color:#977987!important;letter-spacing:.14em}
.cc-site .section{background:transparent}
.cc-site .cb-page{background-color:#fffdf8;background-image:radial-gradient(#85766913 1px,transparent 1.2px);box-shadow:0 12px 32px #534b4422}
.cc-site .cb-page.left{box-shadow:inset -22px 0 28px -20px #76675830,0 12px 32px #534b4422}
.cc-site .cb-page.right{box-shadow:inset 22px 0 28px -20px #76675830,0 12px 32px #534b4422}
.cc-site .cb-cover{background-color:#e9dce0;background-image:radial-gradient(circle at 76% 25%,#fff9 0 12%,transparent 13%),linear-gradient(155deg,#ded6e5,#f5dde0 55%,#f8ecd9);color:#514752}
.cc-site .cb-cover.has-art:after{background:linear-gradient(transparent 55%,#3d394077)}
.cc-site .cb-cover h3{-webkit-text-stroke:0;text-shadow:none;color:#514752}
.cc-site .cb-ribbon{background:#c9a3ad}
.cc-site .footer{background:#ebe5df;border-top:1px solid #d9d1c8;color:#655e61}
.cc-site .footer a{color:inherit}
.cc-site .footer h2{color:#4c454a}
.cc-site .updates-strip,.cc-site .community,.cc-site .sponsors,.cc-site .map-static,.cc-site .map-link-rail{color:var(--cc-ink)}
.cc-site .loader{--entry-accent:#e9dfe2;background:#eee6df;color:#4b4348}
.cc-site .cc-entry-photo{background:#f3e9e2;color:#514752}
.cc-site .cc-entry-gate{filter:drop-shadow(12px 14px 0 #b6a9a042)}
.cc-site .btn{background:#e3cbd1;color:#463d43;border-color:#746870;box-shadow:3px 3px 0 #b6aab0}
@media(max-width:760px){.cc-site .hero-copy{padding:22px;box-shadow:5px 6px 0 #e5ded5}.cc-site .hero-copy h1{font-size:clamp(32px,9vw,48px)}}


/* Paper palette also covers entry, controls, empty artwork and secondary text. */
.cc-site .kv{box-shadow:7px 8px 0 #e4d6dc,0 16px 36px #534b441c;border-width:4px;transform:rotate(-1deg)}
.cc-site .cc-kv-fallback{color:#514752;-webkit-text-stroke:0;text-shadow:none;font-weight:800;transform:none;font-size:clamp(36px,5vw,72px);line-height:1.08;letter-spacing:-.04em}
.cc-site .cc-sticker{border:1px solid #c4b6be;box-shadow:3px 3px 0 #ddd1d7;font-weight:800}
.cc-site .loader .skip,.cc-site .cb-controls button{background:#fffdf8;color:#514752;border:1px solid #b9a9b4;box-shadow:none}
.cc-site .cb-controls button:disabled{opacity:.4;cursor:default}
.cc-site .cb-controls span,.cc-site .cb-cover-vol{color:#70616f}
.cc-site .cb-cover.has-art h3,.cc-site .cb-cover.has-art p,.cc-site .cb-cover.has-art .cb-cover-vol{color:#fff;text-shadow:0 2px 8px #302a35}
.cc-site .cc-entry-cover{color:#514752;box-shadow:0 20px 45px #534b4433,inset 10px 0 18px -10px #534b4433}
.cc-site .cc-entry-cover-title{-webkit-text-stroke:0;text-shadow:none}
.cc-site .cc-entry-page{box-shadow:0 20px 45px #534b4433}
.cc-site .cc-update{background:#fffdf8;border:1px solid #ddd5d0;color:#514752;border-radius:12px;flex-wrap:wrap}
.cc-site .cc-update time,.cc-site .cc-update-star{color:#896b7b}
.cc-site .footer-brand h2{-webkit-text-stroke:0;text-shadow:none}
.cc-site .footer-grid b,.cc-site .footer-grid nav a,.cc-site .footer-brand p,.cc-site .directory-context,.cc-site .booth-directory-rich{color:#706773}
.cc-site .section-back{color:#776778;border-color:#cfc2cb;background:#fffdf8}
.cc-site .cb-page-head,.cc-site .cb-contents button{border-color:#ddd5d0}
.cc-site .cb-bubble p,.cc-site .cb-cut,.cc-site .cb-rules article{border:1px solid #d6ccd4;box-shadow:none}
.cc-site .cb-avatar{border:1px solid #c4b2bd;background:#ead8df;color:#70616f}
.cc-site .cb-cover-badge{box-shadow:2px 2px 0 #d6c9d2}
.cc-site .nav .wrap{justify-content:space-between}
.cc-site .nav .links{margin-left:auto}
.cc-site .nav .links a:focus-visible,.cc-site button:focus-visible,.cc-site a:focus-visible{outline:2px solid #896b7b;outline-offset:4px}
@media(max-width:760px){
 .cc-site .nav{height:auto;min-height:68px}
 .cc-site .nav .wrap{flex-wrap:wrap;padding-top:10px;padding-bottom:10px;gap:8px}
 .cc-site .nav .links{width:100%!important;flex:0 0 100%;margin:0;justify-content:space-between;overflow:visible;gap:8px}
 .cc-site .nav .links a{font-size:12px;padding:6px 0}
 .cc-site .cc-sticker.one{left:2px}.cc-site .cc-sticker.two{right:2px}
 .cc-site .hero{padding-top:28px}
 .cc-site .ticket-grid{grid-template-columns:minmax(0,1fr)}
 .cc-site .footer-grid{grid-template-columns:1fr 1fr!important}
 .cc-site .cb-contents button{grid-template-columns:minmax(0,1fr) auto;gap:4px 8px}
 .cc-site .cb-contents span{grid-column:1/-1}
 .cc-site .cb-contents b{font-size:16px}
 .cc-site .cb-page{padding:20px 16px 34px}
 .cc-site .cb-kind-greeting{overflow-y:auto}
 .cc-site .cb-bubble{gap:8px}.cc-site .cb-avatar{flex-basis:30px;height:30px;font-size:18px}
 .cc-site .cb-bubble p{padding:10px;font-size:12px}
}

`;

export const previewStyle=coreStyle+catalogueStyle;

const loader=`<div class="loader cc-entry" id="loader"><div class="gate cc-entry-gate" role="button" tabindex="0" aria-label="点击翻开电子场刊"><div class="cc-entry-book"><div class="cc-entry-page"><span class="cc-entry-kicker">WELCOME!</span><b class="entry-ticket-title">STARDUST ONLY</b><span class="entry-ticket-subtitle"></span><div class="cc-entry-meta"><span class="entry-ticket-date-wrap"><b class="entry-ticket-date"></b></span><span class="entry-ticket-time-wrap"><b class="entry-ticket-time"></b></span><span class="entry-ticket-location-wrap"><b class="entry-ticket-location"></b></span></div><span class="cc-entry-hint">ようこそ · 欢迎光临 ✦</span></div><div class="cc-entry-cover"><div class="entry-photo cc-entry-photo" aria-label="活动KV"></div><span class="cc-entry-cover-title">WEB CATALOGUE</span><span class="cc-entry-tap">TAP TO OPEN ✦</span></div></div><span class="entry-ticket-label" hidden></span><span class="stub-barcode" hidden></span><span class="stub-code" hidden><span class="entry-serial"></span></span></div><button class="skip" id="skip">跳过 →</button></div>`;

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
