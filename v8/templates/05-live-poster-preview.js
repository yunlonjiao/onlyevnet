/* Template 05 · 舞台现场: a live-event site in the style of anime concert special sites
   (Love Live!, BanG Dream!, THE IDOLM@STER): night stage, spotlight beams, a LINE UP of portrait
   cards in each performer's colour and a TIME TABLE with big start times. Hooks follow Template 01;
   everything visual is scoped to .ls-site. */
import {coreStyle,coreSection,ownMapSection,ownCommunitySection,ownSponsorsSection} from '/v8/templates/shared-sections.js?v=8.307.0';

const style=`
.ls-site{overflow-x:clip;--primary:#ff3d8b;--secondary:#35e3ff;--ls-bg:#0b0a1c;--ls-bg2:#15123a;--ls-pink:#ff3d8b;--ls-cyan:#35e3ff;--ls-yellow:#ffe14d;--ls-violet:#8a5cff;--ls-line:#ffffff24;--ls-soft:#c9c4ee;
 position:relative;min-height:100vh;color:#fff;font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif;
 background:radial-gradient(ellipse 70% 40% at 50% 0,#3b1d7a55,transparent 70%),linear-gradient(180deg,var(--ls-bg),#100c2b 60%,var(--ls-bg))}
.ls-site .wrap{max-width:1200px;margin:0 auto;padding:0 22px}
.ls-site a{color:inherit}
/* header */
.ls-site .nav{position:sticky;top:0;z-index:40;height:64px;background:#0b0a1cef;border:0;border-bottom:1px solid var(--ls-line);box-shadow:none;backdrop-filter:blur(10px)}
.ls-site .nav .wrap{height:100%;display:flex;align-items:center;gap:22px}
.ls-site .brand{font-size:19px;font-weight:1000;font-style:italic;letter-spacing:.04em;color:#fff;border:0;background:none;padding:0;box-shadow:none}
.ls-site .brand:before{content:"";display:inline-block;width:10px;height:22px;margin-right:9px;background:var(--ls-pink);transform:skewX(-18deg);vertical-align:-4px}
.ls-site .nav .links{display:flex;gap:6px;margin-left:auto}
.ls-site .nav .links a{padding:8px 13px;color:#e8e4ff;font-size:13px;font-weight:800;border:0;background:none;border-radius:0;white-space:nowrap;position:relative}
.ls-site .nav .links a:hover{color:var(--ls-yellow)}
.ls-site .nav .wrap>.btn{background:var(--ls-pink);color:#fff;border:0;border-radius:0;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);padding:10px 22px;font-size:13px;font-weight:900;box-shadow:none;white-space:nowrap}
/* hero: poster with stage beams */
.ls-site .hero{min-height:0;padding:56px 0 44px;background:none;position:relative;overflow:hidden;display:block}
.ls-site .hero:before{content:"";display:block;position:absolute;inset:-20% -10% auto -10%;height:120%;pointer-events:none;background:conic-gradient(from 200deg at 28% -10%,transparent 0 8%,#ff3d8b30 9% 12%,transparent 13% 20%,#35e3ff26 21% 24%,transparent 25% 100%)}
.ls-site .hero:after{content:"";display:block;position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg,transparent,var(--ls-pink),var(--ls-cyan),transparent)}
.ls-site .hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:center}
.ls-site .hero-copy{position:relative;z-index:2}
.ls-site .hero-kicker{display:inline-block;background:var(--ls-yellow);color:#171230;font-weight:1000;font-size:12px;letter-spacing:.2em;padding:5px 14px;transform:skewX(-14deg);margin-bottom:18px}
.ls-site .hero h1{margin:0 0 14px;overflow-wrap:anywhere;font-size:clamp(34px,min(10.5vw,6.4vw + 10px),92px);line-height:.98;font-weight:1000;font-style:italic;letter-spacing:-.01em;color:#fff;text-shadow:5px 5px 0 var(--ls-pink),10px 10px 0 #8a5cff66;text-transform:uppercase}
.ls-site .hero p{margin:0 0 20px;max-width:520px;color:var(--ls-soft);font-size:16px;line-height:1.8}
.ls-site .meta{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px}
.ls-site .pill{border:1px solid #ffffff40;background:#ffffff10;color:#fff;border-radius:0;padding:7px 14px;font-size:13px;font-weight:800;box-shadow:none;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.ls-site .ls-cta{display:flex;flex-wrap:wrap;gap:12px}
.ls-site .ls-btn{display:inline-block;padding:13px 30px;font-weight:1000;font-size:15px;text-decoration:none;color:#fff;border:2px solid #fff;clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);transition:transform .15s}
.ls-site .ls-btn.pink{background:var(--ls-pink);border-color:var(--ls-pink)}
.ls-site .ls-btn:hover{transform:translateY(-2px)}
.ls-site .hero-art{position:relative;aspect-ratio:4/5;max-height:600px;width:100%}
.ls-site .kv{position:absolute;inset:0;border:0;border-radius:0;clip-path:polygon(14% 0,100% 0,100% 88%,86% 100%,0 100%,0 12%);box-shadow:none;background-color:#2a1b6e;background-image:var(--oe-hero-image-desktop),linear-gradient(160deg,#4b2bb8,#ff3d8b 70%,#ffb347);background-size:cover;background-position:center}
.ls-site .kv:before,.ls-site .kv:after{display:none}
.ls-site .kv.empty{background-image:repeating-linear-gradient(115deg,#ffffff12 0 14px,transparent 14px 28px),linear-gradient(160deg,#4b2bb8,#ff3d8b 70%,#ffb347)!important}
.ls-kv-fallback{display:none;position:absolute;inset:0;align-items:center;justify-content:center;padding:24px;text-align:center;font-size:clamp(30px,8vw,84px);font-weight:1000;font-style:italic;line-height:1;color:#fff;text-shadow:5px 5px 0 #0008;overflow-wrap:anywhere}
.ls-site .kv.empty .ls-kv-fallback{display:flex}
.ls-site .hero-art:after{content:"";position:absolute;right:-14px;bottom:-14px;width:46%;height:46%;border:3px solid var(--ls-cyan);z-index:-1}
/* ribbon */
.ls-site .ribbon{background:var(--ls-pink);color:#fff;border:0;font-weight:1000;letter-spacing:.14em;text-transform:uppercase;font-style:italic;transform:none;margin:0}
/* sections */
.ls-site .section{padding:64px 0 16px;background:none;border:0}
.ls-site .section.alt{background:none}
.ls-site .head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:26px;border:0}
.ls-site .head h2{margin:0;font-size:clamp(28px,3.4vw,42px);font-weight:1000;font-style:italic;line-height:1.1;color:#fff;text-shadow:3px 3px 0 #ff3d8b66}
.ls-site .head .ey{display:block;margin:0 0 6px;color:var(--ls-cyan)!important;background:none;border:0;padding:0;font-size:13px;font-weight:1000;letter-spacing:.3em;font-style:normal}
.ls-site .section-back,.ls-more{color:var(--ls-cyan);font-weight:900;font-size:13px;text-decoration:none;border:1px solid #35e3ff66;padding:8px 16px;background:none;border-radius:0;white-space:nowrap}
.ls-site .section-back:hover,.ls-more:hover{background:#35e3ff22}
.ls-more-row{display:flex;justify-content:flex-end;margin-top:20px}
/* LINE UP: portrait cards, one colour per performer */
.ls-site .lineup-strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:16px}
.ls-site .lineup-card{--c:var(--ls-pink);position:relative;display:flex;flex-direction:column;text-decoration:none;color:#fff;background:#ffffff0c;border:1px solid var(--ls-line);overflow:hidden;transition:transform .18s,border-color .18s}
.ls-site .lineup-card:nth-child(4n+2){--c:var(--ls-cyan)}.ls-site .lineup-card:nth-child(4n+3){--c:var(--ls-yellow)}.ls-site .lineup-card:nth-child(4n+4){--c:var(--ls-violet)}
.ls-site .lineup-card:hover{transform:translateY(-4px);border-color:var(--c)}
.ls-site .lineup-img{display:block;aspect-ratio:3/4;background:linear-gradient(160deg,color-mix(in srgb,var(--c) 70%,#000),#1c1648);position:relative;overflow:hidden}
.ls-site .lineup-img img{width:100%;height:100%;object-fit:cover;display:block}
.ls-site .lineup-initial{position:absolute;inset:0;display:grid;place-items:center;font-size:84px;font-weight:1000;font-style:italic;color:#ffffff40}
.ls-site .lineup-card b{display:block;padding:12px 12px 2px;font-size:17px;font-weight:1000;border-top:4px solid var(--c)}
.ls-site .lineup-card small{display:block;padding:0 12px 12px;font-size:11px;letter-spacing:.16em;color:var(--c);font-weight:900;text-transform:uppercase}
.mirror-empty{grid-column:1/-1;color:var(--ls-soft);font-size:13px}
/* TIME TABLE: big start times */
.ls-site .timeline-day{margin-bottom:22px}
.ls-site .timeline-day h3{display:inline-block;margin:0 0 12px;padding:5px 18px;background:var(--ls-yellow);color:#171230;font-size:15px;font-weight:1000;letter-spacing:.16em;transform:skewX(-14deg)}
.ls-site .timeline-row{display:grid;grid-template-columns:150px 150px minmax(0,1fr);gap:18px;align-items:center;padding:16px 20px;margin-bottom:8px;text-decoration:none;color:#fff;background:#ffffff0a;border-left:5px solid var(--ls-pink);transition:background .15s,transform .15s}
.ls-site .timeline-row:nth-child(even){border-left-color:var(--ls-cyan)}
.ls-site .timeline-row:hover{background:#ffffff18;transform:translateX(4px)}
.ls-site .timeline-row time{font-size:30px;font-weight:1000;font-style:italic;line-height:1;letter-spacing:.02em}
.ls-site .timeline-row time small{display:block;margin-top:4px;font-size:12px;font-weight:700;font-style:normal;color:var(--ls-soft)}
.ls-site .timeline-stage{font-size:12px;font-weight:900;letter-spacing:.16em;color:var(--ls-cyan);text-transform:uppercase}
.ls-site .timeline-row b{font-size:18px;font-weight:900}
/* NEWS: one left-aligned column — heading on top, then number / date / title / arrow rows.
   The renderer fills [data-oe-mount="updates"] with <a class="live-update">…</a>. */
.ls-site .section.ls-news{padding:56px 0}
.ls-site .section.ls-news>.wrap{display:block;width:min(1200px,calc(100% - 44px));max-width:none;margin:0 auto;padding:0}
.ls-site .ls-news-head{display:flex;align-items:baseline;gap:14px;margin:0 0 18px;text-align:left;position:static}
.ls-site .ls-news-head .ls-ey{font-size:12px;font-weight:1000;letter-spacing:.32em;color:var(--ls-cyan);line-height:1}
.ls-site .ls-news-head h2{margin:0;font-size:clamp(26px,3.2vw,38px);line-height:1.1;font-weight:1000;font-style:italic;color:var(--ls-pink);text-shadow:none}
.ls-site .ls-news-list{display:block;width:100%;margin:0;padding:0;text-align:left;overflow:visible}
.ls-site .ls-news-list .live-update{display:grid;grid-template-columns:52px 92px minmax(0,1fr) 22px;align-items:center;gap:16px;padding:15px 4px;border-bottom:1px solid var(--ls-line);background:none;color:var(--ls-soft);text-decoration:none;text-align:left}
.ls-site .ls-news-list .live-update:first-child{border-top:1px solid var(--ls-line)}
.ls-site .ls-news-list .live-update>span{font-size:20px;font-weight:1000;font-style:italic;line-height:1;color:var(--ls-pink)}
.ls-site .ls-news-list .live-update>time{font-size:13px;font-weight:800;letter-spacing:.06em;color:var(--ls-cyan)}
.ls-site .ls-news-list .live-update>b{font-size:17px;font-weight:800;line-height:1.5;color:var(--ls-soft);overflow-wrap:anywhere}
.ls-site .ls-news-list .live-update>i{font-style:normal;font-size:15px;line-height:1;color:var(--ls-pink);text-align:right}
.ls-site .ls-news-list .live-update:hover{background:color-mix(in srgb,var(--ls-pink) 7%,transparent)}
.ls-site .ls-news-list .live-update:hover>b{color:var(--ls-pink)}
/* TICKETS: PASS band | copy | gift illustration | price, name in dark ink on the cream card.
   The renderer fills [data-oe-mount="tickets"] with <article class="ticket live-pass">…</article>. */
.ls-site .ls-ticket-list{display:grid;grid-template-columns:1fr;gap:16px}
.ls-site .ticket-actions{display:flex;justify-content:flex-end;margin-top:22px}
.ls-site .ticket-actions .btn{background:var(--ls-pink);color:#fff;border:0;border-radius:0;font-weight:1000;clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);padding:13px 30px;box-shadow:none}
.ls-site .live-pass{position:relative;display:grid;grid-template-columns:84px minmax(0,1fr) auto auto;grid-template-areas:"band copy art price";align-items:stretch;min-width:0;padding:0;border:1px solid var(--ls-line);border-radius:16px;background:color-mix(in srgb,var(--ls-bg) 55%,#fff);color:var(--ls-soft);box-shadow:0 10px 26px color-mix(in srgb,var(--ls-pink) 10%,transparent);overflow:hidden}
.ls-site .live-pass:before,.ls-site .live-pass:after{display:none;content:none;border:0}
.ls-site .live-pass-band{grid-area:band;display:grid;place-items:center;padding:20px 6px;background:color-mix(in srgb,var(--ls-pink) 12%,#fff);border-right:1px dashed var(--ls-line);color:var(--ls-pink);font-size:11px;font-weight:1000;letter-spacing:.18em;line-height:1.5;text-align:center;writing-mode:horizontal-tb}
.ls-site .live-pass-copy{grid-area:copy;display:flex;flex-direction:column;gap:8px;min-width:0;padding:20px 22px;text-align:left}
.ls-site .live-pass-copy>h3{margin:0;font-size:22px;font-weight:1000;line-height:1.3;color:var(--ls-soft);-webkit-text-fill-color:currentColor}
.ls-site .live-pass-copy .oe-ticket-gift{display:block;white-space:pre-line;font-size:13.5px;line-height:1.75;color:var(--ls-soft)}
.ls-site .live-pass-copy .oe-ticket-note{display:block;margin:0;font-size:12px;line-height:1.6;color:var(--ls-soft);opacity:.7}
.ls-site .live-pass-price{grid-area:price;display:grid;place-items:center;padding:20px 26px;border-left:1px dashed var(--ls-line);font-size:30px;font-weight:1000;font-style:italic;line-height:1;color:var(--ls-pink);white-space:nowrap}
.ls-site .live-pass-price .oe-ticket-price{font:inherit;color:inherit;line-height:1}
.ls-site .live-pass .ticket-gift-image{grid-area:art;align-self:center;display:block;width:200px;height:auto;margin:0;padding:0 18px 0 0;border:0;border-radius:0;background:none;box-shadow:none;overflow:visible;cursor:zoom-in;box-sizing:border-box}
.ls-site .live-pass .ticket-gift-image img{display:block;width:100%;height:auto;max-height:160px;aspect-ratio:4/3;object-fit:cover;border-radius:10px}
/* map */
/* activities page (TIME TABLE detail) */
.ls-site .activity-switch-row{display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin-bottom:22px}
.ls-site .activity-view-tabs,.ls-site .activity-day-tabs{display:flex;gap:8px;flex-wrap:wrap}
.ls-site .activity-view-tabs button,.ls-site .activity-day-tabs button{border:1px solid #ffffff44;background:none;color:#fff;border-radius:0;padding:9px 20px;font-weight:900;font-size:14px;cursor:pointer;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);box-shadow:none}
.ls-site .activity-view-tabs button.active,.ls-site .activity-day-tabs button.active{background:var(--ls-pink);border-color:var(--ls-pink)}
.ls-site .activity-page-subhead{display:flex;align-items:baseline;gap:12px;margin:0 0 16px}.ls-site .activity-page-subhead span{color:var(--ls-cyan);font-weight:1000;letter-spacing:.26em;font-size:12px}.ls-site .activity-page-subhead b{font-size:20px}
.ls-site .live-running-order{display:grid;grid-template-columns:54px 150px minmax(0,1fr) auto;gap:18px;align-items:center;padding:18px 20px;margin-bottom:10px;background:#ffffff0a;border-left:5px solid var(--ls-pink);color:#fff;border-radius:0;box-shadow:none}
.ls-site .live-running-order:nth-child(even){border-left-color:var(--ls-cyan)}
.ls-site .live-running-no{font-size:22px;font-weight:1000;font-style:italic;color:#ffffff55}
.ls-site .live-running-order time{font-size:28px;font-weight:1000;font-style:italic;line-height:1.05}.ls-site .live-running-order time small{display:block;font-size:12px;font-style:normal;color:var(--ls-soft);margin-top:4px}
.ls-site .live-running-order span{display:block;font-size:12px;font-weight:900;letter-spacing:.16em;color:var(--ls-cyan);text-transform:uppercase;margin-bottom:4px}
.ls-site .live-running-order b{font-size:19px;font-weight:900}.ls-site .live-running-order p{margin:6px 0 0;color:var(--ls-soft);font-size:14px;line-height:1.7}
/* PROGRAMME: a time-ordered card list. The renderer fills [data-oe-mount="activity-projects"]
   with <article class="live-activity">…</article> (see ip-only-component-adapters.js). */
.ls-site .ls-programme-list{display:flex;flex-direction:column;gap:14px}
.ls-site .live-activity{display:grid;grid-template-columns:184px minmax(0,1fr);gap:18px;align-items:start;min-width:0;padding:16px;border:1px solid var(--ls-line);border-radius:14px;background:color-mix(in srgb,var(--ls-bg) 55%,#fff);color:var(--ls-soft)}
.ls-site .live-activity-visual{width:100%;min-width:0;aspect-ratio:16/10;border-radius:10px;overflow:hidden;background:color-mix(in srgb,var(--ls-pink) 14%,#fff);display:grid;place-items:center}
.ls-site .live-activity-visual img{width:100%;height:100%;object-fit:cover;display:block}
.ls-site .live-activity-visual .activity-feature-media{display:block;width:100%;height:100%;padding:0;border:0;background:none;cursor:zoom-in}
.ls-site .live-activity-visual .activity-feature-media-empty{display:grid;place-items:center;gap:2px;color:var(--ls-pink);background:color-mix(in srgb,var(--ls-pink) 12%,#fff);font-size:10px;font-weight:1000;letter-spacing:.2em}
.ls-site .live-activity-visual>span{font-size:10px;font-weight:1000;letter-spacing:.24em;color:var(--ls-pink);opacity:.75}
.ls-site .live-activity-visual:empty:after{content:"PROGRAMME";font-size:10px;font-weight:1000;letter-spacing:.24em;color:var(--ls-pink);opacity:.7}
.ls-site .live-activity-copy{display:flex;flex-direction:column;gap:6px;min-width:0;text-align:left}
.ls-site .live-activity-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px}
.ls-site .live-activity-head .live-activity-time{font-size:26px;font-weight:1000;font-style:italic;line-height:1;color:var(--ls-pink);letter-spacing:.01em}
.ls-site .live-activity-head .live-activity-type{font-size:10px;font-weight:1000;letter-spacing:.2em;color:var(--ls-cyan);border:1px solid color-mix(in srgb,var(--ls-cyan) 40%,transparent);border-radius:999px;padding:3px 10px}
.ls-site .live-activity-copy>h3{margin:0;font-size:20px;font-weight:1000;line-height:1.35;color:var(--ls-soft)}
.ls-site .live-activity-setlist{margin:2px 0 0;padding-left:12px;border-left:3px solid var(--ls-yellow);font-size:13px;line-height:1.7;color:var(--ls-soft);opacity:.9}
.ls-site .live-activity-copy .oe-secondary-copy{margin:0;font-size:12.5px;line-height:1.7;color:var(--ls-soft);opacity:.78}
/* CAST: portrait + name / type / intro. The renderer fills [data-oe-mount="guests"]. */
.ls-site .ls-cast-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:18px;align-items:stretch}
.ls-site .live-performer{--c:var(--ls-pink);position:relative;display:grid;grid-template-columns:128px minmax(0,1fr);gap:16px;align-items:start;min-width:0;padding:16px;border:1px solid var(--ls-line);border-top:4px solid var(--c);border-radius:14px;background:color-mix(in srgb,var(--ls-bg) 55%,#fff);color:var(--ls-soft);text-align:left}
.ls-site .live-performer:nth-child(4n+2){--c:var(--ls-cyan)}
.ls-site .live-performer:nth-child(4n+3){--c:var(--ls-yellow)}
.ls-site .live-performer:nth-child(4n+4){--c:var(--ls-violet)}
.ls-site .live-performer-no{position:absolute;right:12px;top:8px;z-index:0;font-size:26px;font-weight:1000;font-style:italic;line-height:1;color:color-mix(in srgb,var(--c) 42%,transparent);pointer-events:none}
.ls-site .live-performer>.guest-image{grid-column:1;grid-row:1 / span 2;display:block;width:100%;aspect-ratio:3/4;padding:0;border:2px solid var(--c);border-radius:10px;background:color-mix(in srgb,var(--c) 20%,#fff);overflow:hidden;cursor:zoom-in}
.ls-site .live-performer>.guest-image img{display:block;width:100%;height:100%;object-fit:cover}
.ls-site .live-performer>.guest-image.empty{display:grid;place-items:center;padding:8px;color:var(--c);font-size:11px;font-weight:800;letter-spacing:.08em;text-align:center}
.ls-site .live-performer-copy{grid-column:2;display:flex;flex-direction:column;gap:8px;min-width:0}
.ls-site .live-performer-copy>small{color:var(--c);font-size:10px;font-weight:1000;letter-spacing:.22em;line-height:1.4;text-transform:uppercase}
.ls-site .live-performer-copy>b{display:block;margin:0;font-size:19px;font-weight:1000;line-height:1.3;color:var(--ls-soft)}
.ls-site .live-performer-meta{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px;font-size:12px;line-height:1.6;color:var(--ls-soft)}
.ls-site .live-performer-meta>b{font-size:10px;font-weight:1000;letter-spacing:.14em;color:var(--c)}
.ls-site .live-performer-meta .oe-secondary-copy{opacity:.85}
.ls-site .live-performer .guest-info-block{font-size:12.5px;line-height:1.7;color:var(--ls-soft)}
.ls-site .live-performer .guest-info-block>b{display:block;margin:0 0 2px;font-size:10px;font-weight:1000;letter-spacing:.16em;color:var(--c)}
.ls-site .live-performer .guest-info-block p{margin:0;font-size:12.5px;line-height:1.7}
.ls-site .live-performer .guest-platforms{font-size:11px;color:var(--ls-soft)}
.ls-site .live-performer .guest-platforms>b{font-size:10px;font-weight:1000;letter-spacing:.14em;color:var(--c)}
.ls-site .live-performer .guest-platform-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.ls-site .live-performer .guest-platform-list a{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border:1px solid color-mix(in srgb,var(--ls-cyan) 35%,transparent);border-radius:999px;color:var(--ls-cyan);font-size:11px;text-decoration:none}
/* Single page: the linked "关联活动" note only points at the (hidden) activities page. */
.ls-site .live-performer .guest-related-note{display:none}
/* guide / community / sponsors / footer */
.ls-site .guide-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.ls-site .live-guide,.ls-site .guide-grid article,.ls-site .live-social{background:#ffffff0a;border:1px solid var(--ls-line);border-radius:0;color:#fff;box-shadow:none;padding:18px}
.ls-site .live-guide h3{color:#fff}.ls-site .live-guide p,.ls-site .guide-grid p{color:var(--ls-soft)}
.ls-site .live-guide>span{color:var(--ls-yellow);font-weight:1000;font-style:italic}
.ls-site .footer{margin-top:64px;padding:44px 0 90px;background:#07061a;color:var(--ls-soft);border-top:1px solid var(--ls-line)}
.ls-site .footer h2,.ls-site .footer b{color:#fff}.ls-site .footer a{color:var(--ls-cyan)}
.ls-site .mobile-dock{background:#0b0a1cf2;border-top:1px solid var(--ls-line);backdrop-filter:blur(10px)}.ls-site .mobile-dock a{color:#e8e4ff;font-weight:800}
/* entry curtain */
.ls-site .loader.ls-entry{background:#080718;color:#fff}
.ls-entry .ls-gate{position:relative;width:min(92vw,560px);padding:48px 30px;text-align:center;cursor:pointer;border:2px solid var(--ls-pink);background:linear-gradient(160deg,#1b1450,#0b0a1c);clip-path:polygon(0 0,calc(100% - 28px) 0,100% 28px,100% 100%,28px 100%,0 calc(100% - 28px))}
.ls-entry .ls-gate:before{content:"";position:absolute;inset:0;background:conic-gradient(from 180deg at 50% -20%,transparent 0 30%,#ff3d8b40 36% 40%,transparent 46% 54%,#35e3ff40 60% 64%,transparent 70%);pointer-events:none}
.ls-entry-kicker{position:relative;display:inline-block;background:var(--ls-yellow);color:#171230;font-weight:1000;letter-spacing:.22em;font-size:12px;padding:5px 14px;transform:skewX(-14deg)}
.ls-entry .entry-ticket-title{position:relative;display:block;margin:20px 0 8px;font-size:clamp(34px,8vw,60px);font-weight:1000;font-style:italic;line-height:1;text-shadow:4px 4px 0 var(--ls-pink)}
.ls-entry .entry-ticket-subtitle{position:relative;display:block;color:var(--ls-soft);font-size:14px}
.ls-entry-meta{position:relative;display:flex;flex-wrap:wrap;justify-content:center;gap:10px 18px;margin:20px 0;font-weight:800;color:#fff}
.ls-entry-hint{position:relative;display:block;color:var(--ls-cyan);font-weight:1000;letter-spacing:.3em;font-size:13px;animation:lsBlink 1.4s infinite}
.ls-entry .entry-photo{display:none}
@keyframes lsBlink{50%{opacity:.35}}
/* fixes found on the first render */
.ls-site .event-status-badge{display:inline-block;margin:0 10px 18px 0;padding:5px 14px;border:1px solid #ffffff55;background:#ffffff14;color:#fff;border-radius:0;font-size:12px;font-weight:900;letter-spacing:.1em;vertical-align:top}
.ls-site .head,.ls-site .head.activity-main-head{border:0!important;padding-bottom:0!important}
.ls-site .section-back{background:none!important;color:var(--ls-cyan)!important;border-radius:0!important;box-shadow:none!important}
.ls-site .activity-view-tabs button,.ls-site .activity-day-tabs button{background:none!important;color:#fff!important;border:1px solid #ffffff44!important}
.ls-site .activity-view-tabs button.active,.ls-site .activity-day-tabs button.active{background:var(--ls-pink)!important;border-color:var(--ls-pink)!important}
.ls-site .ls-btn:not(.pink){background:#ffffff14;border:0;color:#fff}
.ls-site #activities .activity-view-tabs button.active,.ls-site #activities .activity-day-tabs button.active{background:var(--ls-pink)!important;border-color:var(--ls-pink)!important;color:#fff!important}
.ls-site #activities .activity-view-tabs button:not(.active),.ls-site #activities .activity-day-tabs button:not(.active){background:transparent!important}
.ls-site #activities .activity-page-subhead{border-color:#ffffff22!important}
.ls-site .hero{min-height:620px}
.ls-site .hero-grid{grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr);gap:48px;padding:70px 0}
.ls-site .hero-art{order:-1;aspect-ratio:3/2;max-height:480px;width:100%}
.ls-site .kv{clip-path:polygon(0 0,100% 0,88% 100%,0 100%);border-radius:10px}
.ls-site .hero-art:after{right:auto;left:-14px}
.ls-site .hero h1{font-size:clamp(34px,4.6vw,76px);overflow-wrap:normal;word-break:keep-all}
/* entry gate: a plain centred stack (the shared gate is a grid) */
.ls-entry .ls-gate{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;grid-template-columns:none;min-height:0;height:auto;aspect-ratio:auto;box-sizing:border-box}
.ls-entry .ls-entry-kicker{align-self:center;width:auto;height:auto;flex:none}
.ls-entry .entry-ticket-title{max-width:100%;overflow-wrap:anywhere;font-size:clamp(30px,7vw,56px)}
.ls-entry .ls-entry-meta,.ls-entry .ls-entry-hint{width:auto}
.ls-site .ls-info{display:block}
@media(max-width:820px){
 .ls-site .hero-grid{grid-template-columns:minmax(0,1fr)}.ls-site .hero-art{aspect-ratio:16/11;order:-1}
 .ls-site .nav .links{display:none}.ls-site .nav .wrap>.btn{margin-left:auto;padding:9px 16px}
 .ls-site .timeline-row{grid-template-columns:96px minmax(0,1fr);gap:4px 14px}.ls-site .timeline-row time{font-size:24px;grid-row:span 2}.ls-site .timeline-row b{font-size:16px}
 .ls-site .live-running-order{grid-template-columns:44px minmax(0,1fr)}.ls-site .live-running-order>aside{grid-column:2}.ls-site .live-running-order time{grid-column:2}
 .ls-site .ls-cast-grid{grid-template-columns:1fr}
 .ls-site .ls-programme-list .live-activity{grid-template-columns:1fr}
 .ls-site .ls-programme-list .live-activity-visual{aspect-ratio:16/9}
 .ls-site .lineup-strip{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:620px){
 .ls-site .ls-news-list .live-update{grid-template-columns:38px minmax(0,62px) minmax(0,1fr) 18px;gap:10px}
 .ls-site .ls-news-list .live-update>span{font-size:17px}
 .ls-site .live-pass{grid-template-columns:64px minmax(0,1fr);grid-template-areas:"band copy" "art art" "price price"}
 .ls-site .live-pass-copy{padding:16px 18px}
 .ls-site .live-pass-price{justify-items:start;border-left:0;border-top:1px dashed var(--ls-line);padding:12px 18px;font-size:24px}
 .ls-site .live-pass .ticket-gift-image{width:100%;padding:0 18px 14px}
 .ls-site .live-pass .ticket-gift-image img{max-height:200px;aspect-ratio:16/9}
 .ls-site .live-performer{grid-template-columns:96px minmax(0,1fr);gap:12px}
}
`;

const loader=`<div class="loader ls-entry" id="loader"><div class="gate ls-gate" role="button" tabindex="0" aria-label="点击进入活动网站"><span class="ls-entry-kicker">LIVE</span><b class="entry-ticket-title">BILIBILI ONLY</b><span class="entry-ticket-subtitle"></span><div class="ls-entry-meta"><span class="entry-ticket-date-wrap"><b class="entry-ticket-date"></b></span><span class="entry-ticket-time-wrap"><b class="entry-ticket-time"></b></span><span class="entry-ticket-location-wrap"><b class="entry-ticket-location"></b></span></div><span class="ls-entry-hint">TAP TO ENTER</span><div class="entry-photo" aria-label="活动KV"></div><span class="entry-ticket-label" hidden></span><span class="stub-barcode" hidden></span><span class="stub-code" hidden><span class="entry-serial"></span></span></div><button class="skip" id="skip">跳过 →</button></div>`;

const more=(href,page,text)=>'<div class="ls-more-row"><a class="ls-more" href="'+href+'" data-target-mode="page" data-page-link="'+page+'">'+text+' →</a></div>';
const timetableSection=coreSection('activities',{ey:'TIME TABLE',title:'节目表'})
  .replace('>日程<','>节目表<').replace('<b>当天日程</b>','<b>当天节目</b>').replace('<span>SCHEDULE</span>','<span>RUNNING ORDER</span>')
  .replace('>活动详情<','>企划详情<').replace('<b>活动详情</b>','<b>特别企划</b>');

/* Love Live! live special sites: centred logo header, title bar, portrait KV with info table, tab pills, day cards */
const referenceStyle=`
.ls-site .nav{position:relative;height:auto;padding:22px 0 18px;background:linear-gradient(180deg,#0b0a1c,#15103a)}
.ls-site .nav .wrap{justify-content:center;position:relative;display:flex}
.ls-site .brand{font-size:clamp(28px,4vw,52px);text-align:center;line-height:1}
.ls-site .brand:before{display:none}
.ls-site .nav .wrap>.btn{position:absolute;right:22px;top:50%;transform:translateY(-50%)}
.ls-titlebar{background:linear-gradient(90deg,var(--ls-pink),var(--ls-violet));color:#fff;font-weight:900;letter-spacing:.3em;font-size:13px}
.ls-titlebar .wrap{padding-top:7px;padding-bottom:7px}
.ls-site .hero{min-height:0;padding:30px 0 10px}
.ls-site .hero-grid{grid-template-columns:minmax(0,.78fr) minmax(0,1.22fr);gap:44px;padding:20px 0;align-items:start}
.ls-site .hero-art{order:0;aspect-ratio:3/4;max-height:540px;width:100%}
.ls-site .kv{clip-path:none;border-radius:4px}
.ls-site .hero-art:after{display:none}
.ls-site .hero-copy{align-self:center}
.ls-site .hero h1{font-size:clamp(34px,4.6vw,76px);margin:0 0 12px}
.ls-info{display:block;margin:0 0 22px;border-top:1px dotted #ffffff44}
.ls-info .pill{display:block;clip-path:none;border:0;border-bottom:1px dotted #ffffff44;background:none;padding:9px 0;font-size:15px;font-weight:700}
.ls-info .pill:nth-child(1):before{content:"日程　";color:var(--ls-soft);font-weight:400}.ls-info .pill:nth-child(2):before{content:"会场　";color:var(--ls-soft);font-weight:400}.ls-info .pill:nth-child(3):before{content:"详情　";color:var(--ls-soft);font-weight:400}
.ls-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;padding:6px 22px 22px;max-width:1100px;margin:0 auto}
.ls-pills a{padding:9px 20px;background:linear-gradient(180deg,var(--ls-violet),#6a46d8);color:#fff;font-weight:800;font-size:14px;text-decoration:none;border-radius:4px;border:1px solid #ffffff33}
.ls-pills a:hover{background:var(--ls-pink)}
.ls-site .timeline-day{background:#ffffff10;border:1px solid #ffffff26;border-radius:4px;padding:18px 22px 10px;margin-bottom:18px}
.ls-site .timeline-day h3{display:block;background:none;color:#fff;transform:none;padding:0;margin:0 0 8px;font-size:20px;letter-spacing:.1em}
.ls-site .timeline-day h3:before{content:"＜ "}.ls-site .timeline-day h3:after{content:" ＞"}
.ls-site .timeline-row{grid-template-columns:130px 150px minmax(0,1fr);background:none;border:0;border-bottom:1px dotted #ffffff33;border-left:0;padding:10px 0;margin:0}
.ls-site .timeline-row:hover{background:#ffffff0d;transform:none}
.ls-site .timeline-row time{font-size:17px;font-style:normal;font-weight:800}
.ls-site .timeline-stage{font-size:12px}
@media(max-width:820px){.ls-site .nav .wrap>.btn{position:static;transform:none;margin-left:10px}.ls-site .nav .wrap{flex-wrap:wrap;gap:10px}.ls-site .hero-grid{grid-template-columns:1fr}.ls-site .hero-art{max-height:380px;aspect-ratio:4/3}.ls-site .timeline-row{grid-template-columns:90px minmax(0,1fr)}.ls-site .timeline-row time{grid-row:auto}}

/* skeleton: every section is a numbered scene. The title column stays pinned on the left while the content scrolls on the right, with a thin rule between scenes */
.ls-site main{counter-reset:scene}
.ls-site .section{margin:0;padding:56px 0;background:transparent;border:0;border-top:1px solid #ffffff24}
.ls-site .section>.wrap{width:min(1240px,calc(100% - 48px));max-width:none;margin:0 auto;padding:0;display:grid;grid-template-columns:230px minmax(0,1fr);column-gap:48px;align-items:start}
.ls-site .section .head{grid-column:1;grid-row:1 / span 8;position:sticky;top:84px;display:block;margin:0;padding:0;min-height:0;text-align:left;background:none;border:0}
.ls-site .section .head>div{display:block;text-align:left}
.ls-site .section:not(.oe-page-view) .head:before{counter-increment:scene;content:counter(scene,decimal-leading-zero);display:block;margin-bottom:8px;font:italic 1000 84px/1 "Noto Sans SC",system-ui,sans-serif;color:transparent;-webkit-text-stroke:2px var(--ls-pink)}
.ls-site .section .head .ey{display:block;font-size:11px;letter-spacing:.3em;color:var(--ls-cyan)!important;opacity:1}
.ls-site .section .head h2{font-size:30px;letter-spacing:0;margin:6px 0 0;text-shadow:3px 3px 0 #ff3d8b66;transform:none;-webkit-text-stroke:0}
.ls-site .section .head h2:before,.ls-site .section .head h2:after{content:none}
.ls-site .section .head .section-back{position:static;display:inline-block;margin-top:16px;transform:none;font-size:12px}
.ls-site .section>.wrap>:not(.head){grid-column:2;width:auto;margin:0}
.ls-site .section-orbit,.ls-site .section-no{display:none}
@media(max-width:900px){.ls-site .section{padding:36px 0}.ls-site .section>.wrap{display:block;width:calc(100% - 32px)}.ls-site .section .head{position:static;margin-bottom:20px}.ls-site .section:not(.oe-page-view) .head:before{font-size:52px}.ls-site .section .head h2{font-size:26px}}
.ls-site .lineup{grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}
`;
const ownStyle=`

.ls-map-box{position:relative;min-height:220px;display:flex;align-items:center;justify-content:center}
.ls-map-box .map-image-view{display:block;width:100%;padding:0;border:0;background:none;cursor:zoom-in;position:relative}
.ls-map-box img{display:block;width:100%;height:auto}
.ls-map-box .map-image-view span{position:absolute;right:10px;bottom:10px;font-size:12px;padding:4px 10px;background:#000a;color:#fff;border-radius:999px}
.ls-map-box .map-static-placeholder{display:grid;gap:4px;text-align:center;padding:40px 16px;opacity:.7}
.ls-routes[hidden]{display:none}
.ls-routes h3{margin:0}
.ls-people .social-image,.ls-thanks .sponsor-logo{border:0;background:none;padding:0;cursor:pointer}
.ls-people img,.ls-thanks img{display:block;max-width:100%}
.ls-people .social-image.empty,.ls-thanks .sponsor-logo.empty{font-size:12px;opacity:.6;padding:10px}
.ls-people .social-action,.ls-thanks .sponsor-link{font-weight:800;font-size:13px;text-decoration:none;color:inherit}
.ls-people .social-action.muted{opacity:.5}

/* map: one wide screen with a row of numbered stops under it */
.ls-map{display:block}
.ls-map-frame{margin:0;border:1px solid var(--ls-line);background:#ffffff0c}
.ls-routes{margin-top:18px;text-align:center}
.ls-routes h3{font-size:12px;letter-spacing:.4em;opacity:.8;margin-bottom:12px}
.ls-route-list{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
.ls-route-stop{display:inline-flex;align-items:center;gap:10px;padding:6px 18px 6px 6px;border-radius:999px;background:#ffffff14;color:#fff;text-decoration:none;font-weight:800}
.ls-route-stop>span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--ls-pink),var(--ls-violet));font-size:12px}
.ls-people{display:flex;flex-wrap:wrap;justify-content:center;gap:16px}
.ls-people>*{width:min(300px,100%)}
.ls-site .lineup-strip,.ls-site .lineup{justify-content:center}
.ls-route-stop b{white-space:nowrap}
.ls-thanks{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:14px 34px}
.ls-sponsor{display:flex;align-items:center;gap:10px;background:none;border:0;box-shadow:none;padding:0;color:#fff}
.ls-sponsor b{font-size:15px;letter-spacing:.12em}
.ls-sponsor img{max-height:40px;width:auto}
`;
const phoneFix=`
@media(max-width:620px){.ls-site .timeline-row{grid-template-columns:78px minmax(0,1fr);gap:2px 12px;padding:10px 0}.ls-site .timeline-row time{grid-row:span 2}.ls-site .timeline-row b{font-size:15px}}
@media(max-width:820px){.ls-site .hero-grid{grid-template-columns:minmax(0,1fr);gap:22px;padding:14px 0}.ls-site .hero-art{order:-1;aspect-ratio:16/11;max-height:340px}.ls-site .hero-copy{min-width:0}}
`;
const warmStage=String.raw`
html[data-oe-template="05-live-poster"] #home-guide .guide-detail-grid,html[data-oe-template="06-band-live"] #home-guide .guide-detail-grid{grid-template-columns:1fr!important;display:grid!important;gap:14px!important}
html[data-oe-template="05-live-poster"] #home-guide .guide-card,html[data-oe-template="06-band-live"] #home-guide .guide-card{color:var(--ls-soft,#33251c)!important;background:#fffdf7!important;border:1px solid var(--ls-line,#e3d1b8)!important;border-radius:14px!important;padding:16px 18px!important}
html[data-oe-template="05-live-poster"] #home-guide .guide-card *,html[data-oe-template="06-band-live"] #home-guide .guide-card *{color:inherit!important}
html[data-oe-template="05-live-poster"] #home-guide .guide-card h3,html[data-oe-template="06-band-live"] #home-guide .guide-card h3{color:#b23a22!important}
html[data-oe-template="05-live-poster"] .guest-related-links a,html[data-oe-template="06-band-live"] .guest-related-links a{pointer-events:none!important;color:#8a6a52!important;text-decoration:none!important;border-color:#e3d1b8!important}
html[data-oe-template="05-live-poster"] .guest-related-note,html[data-oe-template="06-band-live"] .guest-related-note{background:#f7eddc!important;color:#3a2b22!important}
html[data-oe-template="05-live-poster"] #home-guide .section-back{display:none!important}
/* The inline 观演秩序 section mounts its cards in .guide-detail-content; the shared renderer keeps
   a 112px index rail column for Template 01's guide page, which this template does not use. */
html[data-oe-template="05-live-poster"] #home-guide .guide-detail-grid{display:block!important}
html[data-oe-template="05-live-poster"] #home-guide .guide-detail-content{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))!important;gap:16px!important}
.ls-site #updates{padding-top:72px!important}.ls-site .ls-news-head{margin-bottom:20px!important}
.ls-site .live-pass-band{background:var(--ls-pink)!important;color:#fff!important}
.ls-site .live-pass-price{color:var(--ls-cyan)!important}
.ls-site .live-pass{border-color:var(--ls-line)!important;background:#fffdf7!important}
.ls-site .ls-news-list .live-update{display:grid!important;grid-template-columns:44px 64px minmax(0,1fr) 20px!important;align-items:center!important;gap:12px!important;background:#fffdf7!important;border:1px solid var(--ls-line)!important;border-radius:14px!important;padding:14px 16px!important;margin-bottom:10px!important}
.ls-site .ls-news-list .live-update span{font-style:italic!important;font-weight:900!important;color:var(--ls-pink)!important}
.ls-site .ls-news-list .live-update time{color:#8a6a52!important}
.ls-site .ls-news-list .live-update b{color:var(--ls-soft)!important;font-size:15px!important}
html[data-oe-template="05-live-poster"] .footer{display:none!important}

html[data-oe-template="05-live-poster"] #home-guests .section-back{display:none!important}
/* 暖色浅背景舞台：嘉宾活动 / 舞台演出 / 乐队都能用，不做夜店霓虹 */
.ls-site{--ls-bg:#fbf3e6;--ls-bg2:#f6e9d6;--ls-pink:#c8402a;--ls-cyan:#b97a25;--ls-yellow:#e0a13c;--ls-violet:#8a4a33;--ls-line:#d9c6ae;--ls-soft:#3a2b22;background:#fbf3e6;color:#33251c}
.ls-site .ls-titlebar{background:linear-gradient(90deg,#b23a22,#d8452b 55%,#e8a33d)!important;color:#fff}
.ls-site .hero{background:radial-gradient(ellipse 70% 40% at 50% 0,#e8a33d33,transparent 72%),#fbf3e6!important}
.ls-site .hero-art .kv{background-image:var(--oe-hero-image-desktop,none),linear-gradient(150deg,#f3c68f,#e8a33d 55%,#d8452b)!important;background-size:cover!important;background-position:var(--oe-hero-focal-desktop,50% 50%)!important;background-repeat:no-repeat!important;box-shadow:0 22px 50px #b23a2233!important}
.ls-site .hero h1{color:#2b1d15!important;text-shadow:none!important}
.ls-site .hero-copy p{color:#5a4433!important}
.ls-site .nav{background:#fdf7ec!important;border-color:#e3d1b8!important}
.ls-site .nav .brand{color:#b23a22!important}
.ls-site .ls-btn{background:#fffaf0!important;color:#3a2b22!important;border-color:#d9c6ae!important;box-shadow:0 4px 0 #0001!important}
.ls-site .ls-btn.pink,.ls-site .ls-btn.yellow{background:#d8452b!important;color:#fff!important;box-shadow:0 4px 0 #0001!important}
.ls-site .pill{background:#fffaf0!important;color:#8a4a33!important;border-color:#d9c6ae!important}.ls-site .pill,.ls-site .pill *{color:#8a4a33!important}.ls-site .event-status-badge{background:#fffaf0!important;color:#8a4a33!important;border:1px solid #d9c6ae!important}
.ls-site .section{background:#fffdf7!important;border-color:#e3d1b8!important;box-shadow:0 10px 30px #b23a2210!important}
.ls-site .section h2,.ls-site .section .eyebrow{color:#b23a22!important}
.ls-site .timeline .row,.ls-site .timeline>*{border-color:#e3d1b8!important}
.ls-site .ls-routes{display:none!important}
html[data-oe-template="05-live-poster"] .mobile-dock{display:none!important}
/* 05 配色方案：暖阳（默认）/ 雾蓝 / 森绿 / 沙紫 */
html[data-oe-palette05="ice"] .ls-site{--ls-bg:#eef4f9;--ls-bg2:#e3eef7;--ls-pink:#2f6f9f;--ls-cyan:#5f9fc4;--ls-yellow:#e8b64c;--ls-violet:#3f6f8a;--ls-line:#c6d8e6;--ls-soft:#22323d;background:#eef4f9;color:#22323d}
html[data-oe-palette05="ice"] .ls-site .ls-titlebar{background:linear-gradient(90deg,#1f4f73,#2f6f9f 55%,#5f9fc4)!important}
html[data-oe-palette05="ice"] .ls-site .hero{background:radial-gradient(ellipse 70% 40% at 50% 0,#5f9fc433,transparent 72%),#eef4f9!important}
html[data-oe-palette05="ice"] .ls-site .hero-art .kv{background-image:var(--oe-hero-image-desktop,none),linear-gradient(150deg,#bcd8ea,#5f9fc4 55%,#2f6f9f)!important}
html[data-oe-palette05="ice"] .ls-site .nav{background:#f8fbfe!important;border-color:#d5e3ee!important}
html[data-oe-palette05="ice"] .ls-site .nav .brand,html[data-oe-palette05="ice"] .ls-site .section h2,html[data-oe-palette05="ice"] .ls-site .section .eyebrow{color:#1f4f73!important}
html[data-oe-palette05="ice"] .ls-site .section{background:#fdfeff!important;border-color:#d5e3ee!important}
html[data-oe-palette05="ice"] .ls-site .ls-btn.pink,html[data-oe-palette05="ice"] .ls-site .ls-btn.yellow{background:#2f6f9f!important;color:#fff!important}
html[data-oe-palette05="ice"] .ls-site .hero h1{color:#16242e!important}
html[data-oe-palette05="forest"] .ls-site{--ls-bg:#eef5ec;--ls-bg2:#e3efe1;--ls-pink:#3f7a45;--ls-cyan:#6aa36f;--ls-yellow:#d9b25a;--ls-violet:#446b4a;--ls-line:#c9dcc6;--ls-soft:#1f2f22;background:#eef5ec;color:#1f2f22}
html[data-oe-palette05="forest"] .ls-site .ls-titlebar{background:linear-gradient(90deg,#2c5a33,#3f7a45 55%,#6aa36f)!important}
html[data-oe-palette05="forest"] .ls-site .hero{background:radial-gradient(ellipse 70% 40% at 50% 0,#6aa36f33,transparent 72%),#eef5ec!important}
html[data-oe-palette05="forest"] .ls-site .hero-art .kv{background-image:var(--oe-hero-image-desktop,none),linear-gradient(150deg,#cde3c6,#6aa36f 55%,#3f7a45)!important}
html[data-oe-palette05="forest"] .ls-site .nav{background:#f8fcf7!important;border-color:#d7e6d3!important}
html[data-oe-palette05="forest"] .ls-site .nav .brand,html[data-oe-palette05="forest"] .ls-site .section h2,html[data-oe-palette05="forest"] .ls-site .section .eyebrow{color:#2c5a33!important}
html[data-oe-palette05="forest"] .ls-site .section{background:#fdfefb!important;border-color:#d7e6d3!important}
html[data-oe-palette05="forest"] .ls-site .ls-btn.pink,html[data-oe-palette05="forest"] .ls-site .ls-btn.yellow{background:#3f7a45!important;color:#fff!important}
html[data-oe-palette05="forest"] .ls-site .hero h1{color:#1a2a1d!important}
html[data-oe-palette05="mauve"] .ls-site{--ls-bg:#f6eef3;--ls-bg2:#efe2ea;--ls-pink:#8a4b6b;--ls-cyan:#a9748f;--ls-yellow:#d9a65a;--ls-violet:#6f4560;--ls-line:#e2cdd9;--ls-soft:#2f2130;background:#f6eef3;color:#2f2130}
html[data-oe-palette05="mauve"] .ls-site .ls-titlebar{background:linear-gradient(90deg,#6b3a55,#8a4b6b 55%,#a9748f)!important}
html[data-oe-palette05="mauve"] .ls-site .hero{background:radial-gradient(ellipse 70% 40% at 50% 0,#a9748f33,transparent 72%),#f6eef3!important}
html[data-oe-palette05="mauve"] .ls-site .hero-art .kv{background-image:var(--oe-hero-image-desktop,none),linear-gradient(150deg,#e4c8d6,#a9748f 55%,#8a4b6b)!important}
html[data-oe-palette05="mauve"] .ls-site .nav{background:#fdf8fb!important;border-color:#e6d3de!important}
html[data-oe-palette05="mauve"] .ls-site .nav .brand,html[data-oe-palette05="mauve"] .ls-site .section h2,html[data-oe-palette05="mauve"] .ls-site .section .eyebrow{color:#6b3a55!important}
html[data-oe-palette05="mauve"] .ls-site .section{background:#fffafd!important;border-color:#e6d3de!important}
html[data-oe-palette05="mauve"] .ls-site .ls-btn.pink,html[data-oe-palette05="mauve"] .ls-site .ls-btn.yellow{background:#8a4b6b!important;color:#fff!important}
html[data-oe-palette05="mauve"] .ls-site .hero h1{color:#2a1c28!important}
`;
export const previewStyle=coreStyle+style+referenceStyle+ownStyle+phoneFix+warmStage;
/* The four content blocks below are written fresh for 05 and only rely on the shared renderer's mount
   points (data-oe-mount), so no Template 01 card rules reach them:
   · #updates   → [data-oe-mount="updates"]          (renderUpdates)
   · #tickets   → [data-oe-mount="tickets"]          (renderTickets)
   · #home-guests → [data-oe-mount="guests"]         (renderGuests)
   · #participation → [data-oe-mount="activity-projects"] (renderParticipation) */
const newsSection=`<section class="section ls-news" id="updates"><div class="wrap"><div class="ls-news-head"><span class="ls-ey">NEWS</span><h2>最新公告</h2></div><div class="ls-news-list" data-oe-mount="updates"></div></div></section>`;
const ticketsSection=`<section class="section" id="tickets"><div class="wrap"><div class="head"><div><span class="ey">TICKET</span><h2>票务</h2></div></div><div class="ls-ticket-list" data-oe-mount="tickets"></div><div class="ticket-actions" data-oe-mount="ticket-actions"></div></div></section>`;
const guestsSection=`<section class="section" id="home-guests"><div class="wrap"><div class="head"><div><span class="ey">CAST</span><h2>出演阵容</h2></div></div><div class="ls-cast-grid" data-oe-mount="guests"></div></div></section>`;
const programmeSection=`<section class="section" id="participation"><div class="wrap"><div class="head"><div><span class="ey">PROGRAMME</span><h2>现场活动</h2></div></div><div class="ls-programme-list" data-oe-mount="activity-projects"></div></div></section>`;
export const previewBody=`<div class="ls-site">
<main id="top">
<section class="hero"><div class="wrap hero-grid"><div class="hero-art"><div class="kv"><strong class="ls-kv-fallback" data-oe-field="eventName">BILIBILI ONLY</strong></div></div><div class="hero-copy"><h1 data-oe-field="eventName">BILIBILI ONLY</h1><p data-oe-field="tagline"></p><div class="meta ls-info"><span class="pill" data-oe-field="date"></span><span class="pill" data-oe-field="location"></span><a class="pill venue-nav" href="#map-home" data-oe-field="edition"></a></div><div class="ls-cta"></div></div></div></section>
${newsSection}
${ticketsSection}
${ownMapSection('ls',{ey:'ACCESS',title:'场地图'})}
${guestsSection}
${programmeSection}
${coreSection('guide',{ey:'RULES',title:'观演秩序'}).replace('class="section oe-page-view" id="guide"','class="section" id="home-guide"').replace('<div class="guide-grid guide-detail-grid"></div>','<div class="guide-grid guide-detail-grid" data-oe-mount="guide-detail"></div>')}
${ownCommunitySection('ls',{ey:'COMMUNITY',title:'社群'})}
${ownSponsorsSection('ls',{ey:'SUPPORT',title:'合作支持'})}
</main>
<footer class="footer" hidden aria-hidden="true"></footer>
</div>`;
