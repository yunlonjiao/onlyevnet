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
.cm-site .ticket,.cm-site .community article,.cm-site .map-static,.cm-site .cm-hot,.cm-site .booth-directory-card,.cm-site .directory-product-card,.cm-site .guide-grid article,.cm-site .sponsors>*{border:1px solid var(--cm-line)!important;border-radius:12px;box-shadow:none!important;background:var(--cm-card)}
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

/* 03 entry: portal loading splash instead of a ticket */
.cm-site .loader.cm-entry{background:#f7f8fa!important;place-items:center}
.cm-entry .entry-ticket-label,.cm-entry .stub-barcode,.cm-entry .stub-code{display:none!important}
.cm-entry-gate{cursor:pointer;width:min(760px,92vw);background:none;border:0;padding:0;transform:none;box-shadow:none}
.cm-entry-card{display:grid;grid-template-columns:1.3fr 1fr;background:#fff;border:1px solid var(--cm-line);border-radius:16px;overflow:hidden;box-shadow:0 20px 60px #0000001a}
.cm-site .cm-entry-photo{position:relative!important;inset:auto!important;transform:none!important;border:0!important;border-radius:0!important;width:auto!important;height:auto!important;aspect-ratio:16/10;background-color:#ded4f4;background-image:linear-gradient(130deg,#a4d9f4,#ded4f4 45%,#fbc6df);background-size:cover;background-position:center}
.cm-entry-info{padding:28px;display:flex;flex-direction:column;gap:8px;justify-content:center;text-align:left}
.cm-entry-kicker{font-size:11px;letter-spacing:.14em;color:#00a7de;font-weight:850}
.cm-entry-info .entry-ticket-title{font-size:28px;line-height:1.15;color:var(--cm-ink);font-weight:900}
.cm-entry-info .entry-ticket-subtitle{font-size:13px;color:var(--cm-muted)}
.cm-entry-meta{display:flex;flex-direction:column;gap:2px;font-size:14px;color:var(--cm-ink)}
.cm-entry-meta b{font-weight:800}
.cm-entry-progress{height:4px;border-radius:4px;background:#e3e5e7;overflow:hidden;margin-top:10px}
.cm-entry-progress i{display:block;height:100%;width:18%;background:var(--cm-accent);border-radius:inherit;transition:width 1.5s ease}
.loader.entry-playing .cm-entry-progress i{width:100%}
.cm-entry-hint{font-size:12px;color:var(--cm-soft)}
.loader.entry-playing .cm-entry-card{animation:cmEntryOut .45s ease 1.55s forwards}
@keyframes cmEntryOut{to{transform:translateY(-12px) scale(.97);opacity:0}}
.cm-site .loader .skip{background:#fff;color:var(--cm-muted);border:1px solid var(--cm-line);border-radius:999px;box-shadow:none}
/* 03 booth directory: creator-portal toolbar, UP主-style circle cards and video-card works */
.cm-site .booth-directory-rich{background:none!important;border:0!important;box-shadow:none!important;padding:0!important}
.cm-site .booth-directory-tools{display:flex;gap:12px;align-items:center;background:#fff;border:1px solid var(--cm-line)!important;border-radius:12px;padding:10px 12px;box-shadow:none!important}
.cm-site .directory-tabs{display:flex;gap:4px;background:#f1f2f3;border:0;border-radius:8px;padding:3px}
.cm-site .directory-tabs button{border:0;background:none;border-radius:6px;padding:7px 14px;font-weight:700;color:var(--cm-muted);box-shadow:none}
.cm-site .directory-tabs button.active{background:#fff;color:var(--cm-accent);box-shadow:0 1px 3px #0000001a}
.cm-site .booth-search{flex:1;display:flex;align-items:center;gap:8px;background:#f1f2f3;border:0!important;border-radius:8px;padding:0 12px;box-shadow:none}
.cm-site .booth-search input{border:0;background:none;height:38px;flex:1;outline:none;box-shadow:none}
.cm-site .booth-directory-tools>button{border:1px solid var(--cm-line);background:#fff;border-radius:8px;padding:8px 12px;font-weight:700;box-shadow:none;color:var(--cm-muted)}
.cm-site .directory-context{color:var(--cm-soft)}
.cm-site .booth-directory-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;margin-top:16px}
.cm-booth{display:flex;gap:14px;align-items:flex-start;background:#fff;border:1px solid var(--cm-line);border-radius:12px;padding:16px;transition:box-shadow .2s}
.cm-booth:hover{box-shadow:0 6px 20px #00000012}
.cm-booth-face{flex:0 0 64px;height:64px;border-radius:50%;overflow:hidden;background:linear-gradient(135deg,#a4d9f4,#fbc6df);display:grid;place-items:center;box-shadow:0 0 0 1px var(--cm-line)}
.cm-booth-face img,.cm-booth-face .booth-logo{width:100%!important;height:100%!important;object-fit:cover;border:0!important;border-radius:50%!important;background:none!important;color:#fff!important;font-weight:900;display:grid;place-items:center;box-shadow:none!important;margin:0!important}
.cm-booth-body{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.cm-booth-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.cm-booth-top h3{margin:0;font-size:16px;font-weight:800;color:var(--cm-ink)}
.cm-booth .booth-no{font-size:11px;font-weight:800;color:var(--cm-accent-ink);background:#e8f7ff;border-radius:4px;padding:2px 6px}
.cm-booth small{color:var(--cm-soft);font-size:12px}
.cm-booth p{margin:2px 0 6px;color:var(--cm-muted);font-size:13px;line-height:1.6}
.cm-booth footer{display:flex;gap:8px;margin-top:auto;flex-wrap:wrap}
.cm-booth .favorite-booth{border:0;border-radius:6px;background:var(--cm-accent);color:#fff;padding:6px 14px;font-weight:700;font-size:12px;box-shadow:none}
.cm-booth .favorite-booth.active{background:#e3e5e7;color:var(--cm-muted)}
.cm-booth .booth-products-link{border:1px solid var(--cm-line);background:#fff;border-radius:6px;padding:6px 12px;font-size:12px;color:var(--cm-muted);box-shadow:none}
.cm-site .product-directory-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px;margin-top:16px}
.cm-product{display:flex;flex-direction:column;gap:8px;background:none;border:0}
.cm-product-thumb{position:relative;aspect-ratio:16/10;border-radius:9px;overflow:hidden;background:#f0e8ff}
.cm-product-thumb .directory-product-image{width:100%;height:100%;border:0!important;padding:0;background:none!important;display:grid;place-items:center;color:#806db0;font-weight:900;box-shadow:none!important;border-radius:0!important}
.cm-product-thumb img{width:100%;height:100%;object-fit:cover}
.cm-product-price{position:absolute;right:8px;bottom:8px;background:#000000a0;color:#fff;border-radius:4px;padding:2px 8px;font-size:12px;font-weight:700}
.cm-product-meta b{font-size:14px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:var(--cm-ink)}
.cm-product-meta small{display:block;color:var(--cm-soft);font-size:12px;margin-top:2px}
.cm-product-meta footer{display:flex;justify-content:space-between;align-items:center;margin-top:6px}
.cm-product .product-tag{font-style:normal;font-size:11px;color:var(--cm-accent-ink);background:#e8f7ff;border-radius:4px;padding:2px 6px}
.cm-product .wishlist-product{border:0;background:none;color:var(--cm-soft);font-size:12px;box-shadow:none;padding:0}
.cm-product .wishlist-product.active{color:#fb7299}
/* 03 guide: two-column help-centre list (no oversized first card) */
.cm-site .guide-detail-content{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px}
.cm-guide{display:flex;gap:14px;background:#fff;border:1px solid var(--cm-line);border-radius:12px;padding:18px;grid-column:auto!important;min-height:0}
.cm-guide-icon{flex:0 0 40px;height:40px;border-radius:10px;background:#e8f7ff;color:var(--cm-accent-ink);display:grid;place-items:center;font-weight:900}
.cm-guide-body{flex:1;min-width:0}
.cm-guide-body small{color:var(--cm-soft);font-size:11px;letter-spacing:.1em;font-weight:700}
.cm-guide-body h3{margin:2px 0 8px;font-size:17px;color:var(--cm-ink)}
.cm-guide-body p{margin:0;color:var(--cm-muted);font-size:13px;line-height:1.8;white-space:pre-line}
.cm-guide .guide-venue-nav{display:inline-block;margin-top:10px;background:var(--cm-accent);color:#fff;border:0;border-radius:6px;box-shadow:none;font-size:12px;padding:7px 14px}
.cm-guide .guide-access-media-empty{display:none}
/* 03 tickets, announcements, community, sponsors, map */
.cm-site .ticket-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.cm-site .cm-ticket{position:relative;display:flex;align-items:center;gap:16px;background:#fff!important;border:1px solid var(--cm-line)!important;border-left:4px solid var(--cm-accent)!important;border-radius:10px;padding:18px 20px;box-shadow:none!important;min-height:0}
.cm-ticket-badge{flex:0 0 auto;font-size:11px;font-weight:800;color:#fff;background:var(--cm-accent);border-radius:4px;padding:3px 8px}
.cm-ticket-body{flex:1;display:flex;flex-direction:column;gap:4px}
.cm-ticket-body h3{margin:0;font-size:16px}
.cm-ticket-body .oe-ticket-gift{font-size:13px;color:var(--cm-muted);white-space:pre-line}
.cm-ticket-body .oe-ticket-note{font-size:12px;color:var(--cm-soft)}
.cm-ticket-price .oe-ticket-price{font-size:22px;font-weight:900;color:#fb7299}
.cm-site .updates-list{display:flex;flex-direction:column;background:#fff;border:1px solid var(--cm-line);border-radius:12px;overflow:hidden}
.cm-update{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--cm-line);color:var(--cm-ink)}
.cm-update:last-child{border-bottom:0}
.cm-update-tag{font-size:11px;font-weight:800;color:#fb7299;border:1px solid #fb7299;border-radius:4px;padding:1px 6px}
.cm-update b{flex:1;font-size:14px;font-weight:600}
.cm-update time{font-size:12px;color:var(--cm-soft)}
.cm-site .community{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.cm-site .cm-social{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--cm-line)!important;border-radius:12px;padding:14px;box-shadow:none!important;min-height:0}
.cm-social-avatar{flex:0 0 44px;height:44px;border-radius:50%;overflow:hidden;background:#e8f7ff;display:grid;place-items:center}
.cm-social-avatar img,.cm-social-avatar>*{width:100%;height:100%;object-fit:cover;border:0!important;border-radius:50%;margin:0!important;min-height:0!important}
.cm-social-text{flex:1;min-width:0}.cm-social-text b{font-size:14px}.cm-social-text p{margin:2px 0 0;font-size:12px;color:var(--cm-soft)}
.cm-social .social-action{font-size:12px;color:var(--cm-accent-ink);white-space:nowrap;border:0;background:none;padding:0}
.cm-site .sponsors{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
.cm-site .cm-sponsor{display:flex;flex-direction:column;align-items:center;gap:8px;background:#fff;border:1px solid var(--cm-line)!important;border-radius:12px;padding:16px;box-shadow:none!important;text-align:center}
.cm-site .cm-map-wrap{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:14px}
.cm-site .map-static{min-height:380px}
.cm-site .cm-hot{padding:16px}
.cm-site .map-link-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.cm-map-tag{display:inline-flex;gap:4px;align-items:center;background:#f1f2f3;border-radius:999px;padding:6px 12px;font-size:13px;color:var(--cm-ink)}
.cm-map-tag b{color:var(--cm-accent)}
/* 03 footer: one compact row */
.cm-site .footer{padding:28px 0}
.cm-site .footer-grid{display:flex!important;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px}
.cm-site .footer-grid>div{display:flex;align-items:center;gap:10px}
.cm-site .footer-grid b{font-size:12px;color:var(--cm-soft);font-weight:700}
.cm-site .footer-grid nav{display:flex;gap:12px}.cm-site .footer-grid nav a{font-size:13px;color:var(--cm-muted)}
.cm-site .footer-brand h2{font-size:16px;margin:0}.cm-site .footer-brand p{margin:0;font-size:12px;color:var(--cm-soft)}
@media(max-width:800px){.cm-site .guide-detail-content{grid-template-columns:1fr!important}.cm-site .cm-map-wrap{grid-template-columns:1fr}.cm-entry-card{grid-template-columns:1fr}.cm-site .booth-directory-tools{flex-wrap:wrap}}

/* 03 overrides for shared runtime rules (gate filter, editorial guide styling) */
.cm-site .loader .cm-entry-gate{filter:none!important;display:block!important;width:min(780px,92vw)!important;height:auto!important;min-height:0!important;animation:none!important}
.cm-site .cm-entry-gate:before,.cm-site .cm-entry-gate:after{display:none!important}
.cm-site #guide .guide-detail-grid{display:block!important}
.cm-site #guide .cm-guide{background:#fff!important;border:1px solid var(--cm-line)!important;border-radius:12px!important;box-shadow:none!important;padding:18px!important;margin:0!important;color:var(--cm-ink)!important}
.cm-site #guide .cm-guide:before,.cm-site #guide .cm-guide:after{display:none!important}
.cm-site #guide .cm-guide-body h3{color:var(--cm-ink)!important}.cm-site #guide .cm-guide-body p{color:var(--cm-muted)!important}

.cm-site #guide .cm-guide{display:flex!important;flex-direction:row!important;align-items:flex-start!important}
.cm-site #guide .cm-guide-icon{flex:0 0 40px!important;width:40px!important;height:40px!important;margin:0!important}
.cm-site #guide .guide-venue-nav{background:var(--cm-accent)!important;color:#fff!important;border:0!important;border-radius:6px!important;box-shadow:none!important;font-size:12px!important;padding:7px 14px!important}

`;

/* bilibili home page: white header with a pink action button, a slim banner strip, channel chips, a carousel beside a grid of random works with a refresh button */
const referenceStyle=`
.cm-site .nav{height:64px}
.cm-site .brand{color:var(--cm-accent);font-size:21px}
.cm-site .nav .links{margin-left:28px;margin-right:auto;gap:6px}
.cm-site .nav .links a{padding:8px 14px;border-radius:8px;font-size:15px}
.cm-site .nav .links a:hover{background:#f1f2f3;color:var(--cm-ink)}
.cm-site .nav .wrap>.btn{display:inline-flex;background:#fb7299;border-radius:8px;padding:9px 20px;font-size:14px}
.cm-site .hero{padding:16px 0 0}
.cm-site .hero-grid{display:block;position:relative}
.cm-site .hero-art{width:100%;min-height:0;height:auto;aspect-ratio:7/1;max-height:190px}
.cm-site .kv{border-radius:12px;background-position:var(--oe-hero-focal-desktop),center}
.cm-kv-fallback{font-size:clamp(28px,4vw,56px);transform:none;text-shadow:3px 3px #806db0;letter-spacing:-.04em}
.cm-site .kv.empty .cm-kv-fallback{display:none}
.cm-site .hero-copy{position:absolute;inset:0 24px;border-radius:12px!important;background:linear-gradient(90deg,#0c1a2ecc,#0c1a2e40 60%,transparent);border:0;border-radius:0;padding:0 24px;color:#fff;flex-direction:row;align-items:center;justify-content:space-between;gap:10px 28px}
.cm-title{display:flex;align-items:center;gap:6px 14px;flex-wrap:wrap}
.cm-site .hero-copy h1{font-size:clamp(20px,2.4vw,32px);margin:0;letter-spacing:-.03em;color:#fff}
.cm-site .hero-copy p{margin:0;font-size:13px;color:#ffffffd0}
.cm-site .hero-copy .hero-kicker{background:#fb7299;color:#fff;border-radius:4px;padding:2px 7px;letter-spacing:.06em}
.cm-site .hero-copy .meta{flex-direction:row;flex-wrap:wrap;gap:6px 22px;font-size:14px;font-weight:700;color:#fff}
.cm-site .hero-copy .meta .venue-nav{font-size:14px;color:#fff;text-decoration:underline}
.cm-channels{margin-top:4px;border-top:1px solid var(--cm-line);border-bottom:1px solid var(--cm-line);background:#fff}
.cm-channels .wrap{display:flex;gap:8px;overflow:auto;padding-top:10px;padding-bottom:10px}
.cm-channels a{flex:0 0 auto;padding:6px 16px;border-radius:999px;background:#f1f2f3;color:var(--cm-ink);font-size:14px;font-weight:600;text-decoration:none}
.cm-channels a:hover{background:#e8f7ff;color:var(--cm-accent-ink)}
.cm-spotlight{padding:20px 0 6px}
.cm-feed-head{display:flex;align-items:baseline;gap:12px;margin-bottom:14px}
.cm-feed-head h2{margin:0;font-size:22px;font-weight:850;letter-spacing:-.03em}
.cm-feed-head span{color:var(--cm-soft);font-size:13px}
.cm-shuffle{margin-left:auto;border:1px solid var(--cm-line);background:#fff;color:var(--cm-ink);border-radius:8px;padding:7px 16px;font-size:13px;font-weight:700;cursor:pointer}
.cm-shuffle:hover{color:var(--cm-accent-ink);border-color:var(--cm-accent)}
@media(max-width:800px){.cm-site .nav .wrap>.btn{padding:7px 12px;font-size:12px}.cm-site .nav .links{display:none}.cm-site .hero-art{aspect-ratio:16/9;max-height:none}.cm-site .hero-copy{inset:0;flex-direction:column;align-items:flex-start;justify-content:flex-end;padding:0 14px 12px;background:linear-gradient(transparent,#0c1a2ecc)}.cm-site .hero-copy .meta{display:none}.cm-feed-head span{display:none}.cm-site .event-status-badge{white-space:nowrap;left:12px;top:10px;writing-mode:horizontal-tb}}

/* skeleton: a feed column with a side rail, like the home page of a video portal */
.cm-site main{display:block}
.cm-cols{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:24px;align-items:start;max-width:1380px;margin:0 auto;padding:0 24px}
.cm-cols .wrap{max-width:none;padding:0;margin:0}
.cm-cols .section,.cm-cols .updates-strip,.cm-cols .cm-spotlight{padding:0;margin:0 0 22px;background:transparent;border:0}
.cm-feed{min-width:0}
.cm-rail{position:sticky;top:78px;display:grid;gap:16px;min-width:0}
.cm-rail .section,.cm-rail .updates-strip{background:#fff;border:1px solid var(--cm-line);border-radius:12px;padding:16px;margin:0}
.cm-cols .head{margin-bottom:12px}
.cm-cols .head h2{font-size:17px;letter-spacing:0;display:flex;align-items:center;gap:8px}
.cm-cols .head h2:before{content:"";width:4px;height:16px;border-radius:2px;background:var(--cm-accent)}
.cm-cols .head .ey{display:none}
.cm-feed .section{background:#fff;border:1px solid var(--cm-line);border-radius:12px;padding:16px}
.cm-feed .cm-spotlight{background:none;border:0;padding:0}
.cm-rail .updates-list{border:0;border-radius:0;counter-reset:rank;background:none}
.cm-rail .cm-update{counter-increment:rank;padding:9px 0;gap:10px;align-items:flex-start;flex-wrap:wrap}
.cm-rail .cm-update:before{content:counter(rank);flex:0 0 20px;height:20px;border-radius:4px;background:#e3e5e7;color:#61666d;font-size:12px;font-weight:800;display:grid;place-items:center}
.cm-rail .cm-update:nth-child(-n+3):before{background:#fb7299;color:#fff}
.cm-rail .cm-update-tag{display:none}
.cm-rail .cm-update b{flex:1 1 0;min-width:0;font-size:14px;line-height:1.5}
.cm-rail .cm-update time{flex:1 0 100%;padding-left:30px;font-size:12px;margin-top:-4px}
.cm-rail .ticket-grid{grid-template-columns:1fr;gap:10px}
.cm-rail .cm-ticket{flex-wrap:wrap;gap:6px 12px;padding:12px 14px}
.cm-rail .cm-ticket-body{flex:1 1 60%}
.cm-rail .ticket-actions{margin-top:12px}
.cm-rail .ticket-actions .btn,.cm-rail .ticket-purchase-link{width:100%;text-align:center;padding:11px 16px}
.cm-rail .cm-map-wrap{grid-template-columns:1fr}
.cm-rail .map-static{min-height:190px}
.cm-rail .cm-hot{padding:12px}
.cm-feed .community{grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}
@media(max-width:1000px){.cm-cols{grid-template-columns:1fr;padding:0 13px}.cm-rail{position:static}}

.cm-site .wrap{width:min(1380px,calc(100% - 48px));max-width:none;padding:0;margin-left:auto;margin-right:auto}
.cm-cols{width:min(1380px,calc(100% - 48px));max-width:none;padding:0;margin:0 auto}
.cm-site .spotlight-six{grid-template-rows:none;grid-auto-rows:min-content;align-content:space-between}
.cm-ticket .oe-ticket-note:before,.cm-ticket .oe-ticket-note:after,.cm-ticket .oe-ticket-gift:before,.cm-ticket .oe-ticket-gift:after{display:none!important}
.cm-rail .cm-ticket{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:4px 12px}
.cm-rail .cm-ticket-badge{display:none}
.cm-rail .cm-ticket-price{grid-column:2;grid-row:1}
@media(max-width:1000px){.cm-cols,.cm-site .wrap{width:calc(100% - 26px)}}

.cm-cols .wrap{width:auto;margin:0}
.cm-site .hero-copy{inset:0}
.cm-site .cm-ticket:before,.cm-site .cm-ticket:after{display:none!important}

.cm-site .kv{box-shadow:0 3px 14px #0c1a2e40}
`;
const hotStyle=`.cm-hot h3{margin:0 0 10px;font-size:15px}.cm-hot .map-link-list{display:flex;flex-wrap:wrap;gap:8px}.cm-hot[hidden]{display:none}`;
const spaceStyle=`
/* spotlight: tiles no longer stretch to the height of the carousel */
.cm-site .spotlight-feature{min-height:330px}
.cm-site .spotlight-six{align-content:start;gap:16px 14px}
/* creator space: every circle is a profile card with a cover strip and an avatar that overlaps it */
.cm-site [data-directory-grid="booths"]{grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:22px;margin-top:24px}
.cm-site [data-directory-grid="products"]{grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:22px 16px;margin-top:24px}
.cm-booth{display:block;position:relative;padding:0;overflow:hidden;border-radius:14px}
.cm-booth:before{content:"";display:block;height:78px;background:linear-gradient(120deg,#a4d9f4,#fbc6df)}
.cm-booth-face{position:absolute;left:20px;top:40px;flex:none;width:76px;height:76px;border:4px solid #fff;box-shadow:0 2px 10px #0000002e}
.cm-booth-body{padding:50px 20px 20px;gap:6px}
.cm-booth-top{justify-content:space-between}
.cm-booth p{margin:4px 0 8px;min-height:42px}
.cm-booth footer{margin-top:8px;padding-top:12px;border-top:1px solid var(--cm-line);justify-content:space-between;align-items:center}
.cm-site .community{grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.cm-site .oe-page-view>.wrap{padding-top:10px;padding-bottom:70px}
@media(max-width:700px){.cm-site .spotlight-feature{min-height:260px}.cm-site [data-directory-grid="booths"]{grid-template-columns:1fr}}
`;
const phoneFix=`
.cm-site .spotlight-feature-art .spotlight-placeholder{padding:24px;margin-bottom:110px}
@media(max-width:700px){.cm-site .spotlight-feature-art .spotlight-placeholder{font-size:30px}}
`;
export const previewStyle=coreStyle+marketStyle+referenceStyle+hotStyle+spaceStyle+phoneFix;

const loader=`<div class="loader cm-entry" id="loader"><div class="gate cm-entry-gate" role="button" tabindex="0" aria-label="点击进入活动网站"><div class="cm-entry-card"><div class="entry-photo cm-entry-photo" aria-label="活动KV"></div><div class="cm-entry-info"><span class="cm-entry-kicker">同人创作展</span><b class="entry-ticket-title">STARDUST ONLY</b><span class="entry-ticket-subtitle"></span><div class="cm-entry-meta"><span class="entry-ticket-date-wrap"><b class="entry-ticket-date"></b></span><span class="entry-ticket-time-wrap"><b class="entry-ticket-time"></b></span><span class="entry-ticket-location-wrap"><b class="entry-ticket-location"></b></span></div><div class="cm-entry-progress"><i></i></div><span class="cm-entry-hint">点击进入 ›</span></div></div><span class="entry-ticket-label" hidden></span><span class="stub-barcode" hidden></span><span class="stub-code" hidden><span class="entry-serial"></span></span></div><button class="skip" id="skip">跳过 →</button></div>`;

const head=(ey,title)=>'<div class="head"><div><span class="ey">'+ey+'</span><h2>'+title+'</h2></div></div>';
const pageHead=(ey,title)=>'<div class="head"><div><span class="ey">'+ey+'</span><h2>'+title+'</h2></div><a class="section-back" href="#home" data-page-link="home">← 返回首页</a></div>';

export const previewBody=`<div class="cm-site">${loader}
<header class="nav"><div class="wrap"><a class="brand" href="#top" data-oe-field="eventName">STARDUST ONLY</a><nav class="links" data-oe-mount="nav-links"><a href="#home" data-page-link="home">首页</a><a href="#booths" data-target-mode="page" data-page-link="booths">社团</a><a href="#map-home">场地图</a><a href="#guide" data-target-mode="page" data-page-link="guide">指南</a></nav><a class="btn ticket-purchase-link" href="#" target="_blank" rel="noopener">购票 ↗</a></div></header>
<main id="top">
<section class="hero"><div class="wrap hero-grid"><div class="hero-art"><div class="kv"><strong class="cm-kv-fallback" data-oe-field="eventName">STARDUST ONLY</strong></div></div><div class="hero-copy"><div class="cm-title"><span class="hero-kicker">同人创作展</span><h1 data-oe-field="eventName">STARDUST ONLY</h1><p data-oe-field="tagline"></p></div><div class="meta"><span class="pill" data-oe-field="date"></span><span class="pill" data-oe-field="location"></span><a class="pill venue-nav" href="#map-home" data-oe-field="edition"></a></div></div></div></section>
<nav class="cm-channels oe-home-only" aria-label="频道"><div class="wrap"><a href="#spotlight">推荐</a><a href="#booths" data-target-mode="page" data-page-link="booths">社团作品</a><a href="#updates">公告</a><a href="#tickets">票务</a><a href="#map-home">场地图</a><a href="#guide" data-target-mode="page" data-page-link="guide">观展指南</a></div></nav>
<div class="cm-cols oe-home-only"><div class="cm-feed">
<section class="cm-spotlight oe-home-only" id="spotlight" aria-label="随机推荐制品"><div class="wrap"><div class="cm-feed-head"><h2>推荐制品</h2><span>每次打开顺序都不一样</span><button type="button" class="cm-shuffle" data-spotlight-shuffle>换一换 ↻</button></div><div data-oe-mount="product-spotlight"></div></div></section>
<section class="section" id="community"><div class="wrap">${head('COMMUNITY','社群')}<div class="community"></div></div></section>
<section class="section" id="sponsors"><div class="wrap">${head('SPONSORS','合作伙伴')}<div class="sponsors"></div></div></section>
</div><aside class="cm-rail" aria-label="公告与票务">
<section class="updates-strip oe-home-only" id="updates"><div class="wrap">${head('NEWS','最新公告')}<div class="updates-list"></div></div></section>
<section class="section" id="tickets"><div class="wrap">${head('ADMISSION','入场票')}<div class="ticket-grid"></div><div class="ticket-actions"></div></div></section>
<section class="section" id="map-home"><div class="wrap">${head('VENUE MAP','场地图')}<div class="cm-map-wrap"><div class="map-static-shell"><div class="map-static" id="venueMap" data-oe-image="venueMap.image"></div></div><aside class="cm-hot" data-oe-mount="map-rail" data-oe-collection="explore"><h3>热门入口</h3><div class="map-link-list"></div></aside></div></div></section>
</aside></div>
<section class="section oe-page-view" id="booths"><div class="wrap">${pageHead('CIRCLES & WORKS','参展社团与制品')}<div class="booth-directory-rich"></div></div></section>
<section class="section oe-page-view" id="guide"><div class="wrap">${pageHead('GUIDE','观展指南')}<div class="guide-grid guide-detail-grid"></div></div></section>
</main>
<footer class="footer"><div class="wrap footer-grid"><div class="footer-brand"></div><div class="footer-participate"></div><div class="footer-visit"></div><div class="footer-social"></div></div></footer>
</div>`;

