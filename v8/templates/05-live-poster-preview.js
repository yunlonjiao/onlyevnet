/* Template 05 · 舞台现场: a live-event site in the style of anime concert special sites
   (Love Live!, BanG Dream!, THE IDOLM@STER): night stage, spotlight beams, a LINE UP of portrait
   cards in each performer's colour and a TIME TABLE with big start times. Hooks follow Template 01;
   everything visual is scoped to .ls-site. */
import {coreStyle,coreSection,coreRibbon,head,ownMapSection,ownCommunitySection,ownSponsorsSection} from '/v8/templates/shared-sections.js?v=8.52.0';

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
/* updates / featured */
.ls-site .updates-strip{background:none;border:0;padding:44px 0 0}
.ls-site .updates-list{display:flex;flex-direction:column;gap:8px}
.ls-site .live-update{display:grid;grid-template-columns:44px 90px minmax(0,1fr) 24px;gap:14px;align-items:center;padding:14px 18px;background:#ffffff0a;border-left:4px solid var(--ls-yellow);text-decoration:none;color:#fff}
.ls-site .live-update span{font-weight:1000;color:var(--ls-yellow);font-style:italic}.ls-site .live-update time{color:var(--ls-soft);font-size:13px}.ls-site .live-update b{font-size:15px}
.ls-site .featured-activity-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.ls-site .featured-activity-card{background:#ffffff0c;border:1px solid var(--ls-line);border-radius:0;color:#fff;box-shadow:none;overflow:hidden;text-decoration:none}
.ls-site .featured-activity-card h3,.ls-site .featured-activity-card b{color:#fff}.ls-site .featured-activity-card p{color:var(--ls-soft)}
.ls-site .featured-activity-kicker{color:var(--ls-pink);font-weight:1000;letter-spacing:.18em}
.ls-site .featured-activity-link{color:var(--ls-cyan);font-weight:900}
/* tickets */
.ls-site .ticket-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.ls-site .live-pass{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:16px;padding:0;background:#ffffff0d;border:1px solid var(--ls-line);color:#fff;border-radius:0;box-shadow:none;overflow:hidden;position:relative}
.ls-site .live-pass-band{align-self:stretch;writing-mode:vertical-rl;display:grid;place-items:center;padding:0 10px;background:var(--ls-pink);font-weight:1000;letter-spacing:.2em;font-size:12px}
.ls-site .live-pass-copy{padding:18px 0}.ls-site .live-pass-copy h3{margin:0 0 6px;font-size:20px;font-weight:1000;color:#fff}.ls-site .live-pass-copy span,.ls-site .live-pass-copy small{display:block;color:var(--ls-soft);font-size:13px;line-height:1.6}
.ls-site .live-pass-price{padding:0 20px;font-size:30px;font-weight:1000;font-style:italic;color:var(--ls-yellow)}
.ls-site .ticket-actions .btn{background:var(--ls-yellow);color:#171230;border:0;border-radius:0;font-weight:1000;clip-path:polygon(12px 0,100% 0,calc(100% - 12px) 100%,0 100%);padding:13px 30px;box-shadow:none}
/* map */
.ls-site .map-explorer{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:18px}
.ls-site .map-static,.ls-site .map-link-rail{background:#ffffff0c;border:1px solid var(--ls-line);border-radius:0;box-shadow:none;color:#fff}
.ls-site .map-link-rail .ey{color:var(--ls-cyan)}.ls-site .map-link-rail b{color:#fff}
.ls-site .live-venue-link,.ls-site .map-link-list a{color:#fff;border:1px solid var(--ls-line);background:#ffffff0a;border-radius:0;padding:10px 12px;text-decoration:none;display:flex;gap:10px}
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
.ls-site .live-activity{display:grid;grid-template-columns:54px 220px minmax(0,1fr);gap:18px;padding:18px;margin-bottom:14px;background:#ffffff0a;border:1px solid var(--ls-line);color:#fff;border-radius:0;box-shadow:none}
.ls-site .live-activity-no{font-size:22px;font-weight:1000;font-style:italic;color:#ffffff55}
.ls-site .live-activity h3{margin:4px 0 8px;font-size:22px;font-weight:1000;color:#fff}.ls-site .live-activity-copy>span{color:var(--ls-pink);font-weight:1000;letter-spacing:.16em;font-size:12px}.ls-site .live-activity p{color:var(--ls-soft);line-height:1.8}
.ls-site .live-activity-visual img{width:100%;display:block}
/* guests page */
.ls-site .guest-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}
.ls-site .live-performer{--c:var(--ls-pink);position:relative;display:grid;grid-template-columns:130px minmax(0,1fr);gap:16px;padding:16px;background:#ffffff0a;border:1px solid var(--ls-line);border-top:4px solid var(--c);color:#fff;border-radius:0;box-shadow:none}
.ls-site .live-performer:nth-child(4n+2){--c:var(--ls-cyan)}.ls-site .live-performer:nth-child(4n+3){--c:var(--ls-yellow)}.ls-site .live-performer:nth-child(4n+4){--c:var(--ls-violet)}
.ls-site .live-performer-no{position:absolute;right:14px;top:8px;font-size:34px;font-weight:1000;font-style:italic;color:#ffffff1c}
.ls-site .live-performer .guest-image{border:0;padding:0;background:none;display:block}.ls-site .live-performer img{width:100%;aspect-ratio:3/4;object-fit:cover;display:block}
.ls-site .live-performer .guest-image.empty{aspect-ratio:3/4;background:linear-gradient(160deg,color-mix(in srgb,var(--c) 60%,#000),#1c1648);color:#ffffff66}
.ls-site .live-performer-copy small{color:var(--c);font-weight:1000;letter-spacing:.16em;font-size:11px;text-transform:uppercase}.ls-site .live-performer-copy b{display:block;font-size:21px;font-weight:1000;margin:2px 0 6px;color:#fff}
.ls-site .live-performer-copy,.ls-site .live-performer-copy p,.ls-site .live-performer-copy .oe-secondary-copy{color:var(--ls-soft);font-size:13px;line-height:1.7}
.ls-site .live-performer a{color:var(--ls-cyan)}
/* guide / community / sponsors / footer */
.ls-site .guide-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.ls-site .live-guide,.ls-site .guide-grid article,.ls-site .community article,.ls-site .live-social{background:#ffffff0a;border:1px solid var(--ls-line);border-radius:0;color:#fff;box-shadow:none;padding:18px}
.ls-site .live-guide h3,.ls-site .community b{color:#fff}.ls-site .live-guide p,.ls-site .community p,.ls-site .guide-grid p{color:var(--ls-soft)}
.ls-site .live-guide>span{color:var(--ls-yellow);font-weight:1000;font-style:italic}
.ls-site .community{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.ls-site .sponsors{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}.ls-site .sponsors>*{background:#ffffff12;border:1px solid var(--ls-line);border-radius:0;min-height:70px;display:grid;place-items:center;color:#fff}
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
.ls-site .updates-strip .wrap{width:100%}
.ls-site .featured-activity-grid{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
.ls-site .featured-activity-card{display:flex;flex-direction:column;background:#ffffff0c!important;color:#fff!important}
.ls-site .featured-activity-media{aspect-ratio:16/9;background:linear-gradient(160deg,#2a1b6e,#ff3d8b66);display:grid;place-items:center;color:#ffffff66;font-weight:1000;letter-spacing:.2em;font-size:12px}
.ls-site .featured-activity-media img{width:100%;height:100%;object-fit:cover;display:block}
.ls-site .featured-activity-copy{padding:16px 18px 18px;display:flex;flex-direction:column;gap:6px}
.ls-site .featured-activity-copy h3,.ls-site .featured-activity-copy b{color:#fff!important}
.ls-site .featured-activity-copy p{color:var(--ls-soft)!important;margin:0}
.ls-site .live-performer,.ls-site .live-performer *,.ls-site .live-guide *,.ls-site .live-activity *{color:#fff}
.ls-site .live-performer .guest-image.empty,.ls-site .live-performer .guest-image{background:linear-gradient(160deg,color-mix(in srgb,var(--c) 60%,#000),#1c1648)!important;border:0!important;border-radius:0!important;min-height:0}
.ls-site .live-performer .guest-note,.ls-site .live-performer .guest-related-note,.ls-site .live-performer [class*="guest-"][class*="note"]{background:#ffffff0d!important;border:1px solid var(--ls-line)!important;border-radius:0!important;box-shadow:none!important}
.ls-site .live-performer .guest-note b,.ls-site .live-performer .guest-note strong{color:var(--ls-yellow)}
.ls-site .live-performer .guest-poster-name,.ls-site .live-performer-copy>b{color:#fff;font-size:21px}
.ls-site .live-performer-copy>small{color:var(--c)}
.ls-site .live-performer .oe-secondary-copy,.ls-site .live-performer p,.ls-site .live-performer .guest-note{color:var(--ls-soft)}
.ls-site .live-performer a,.ls-site .live-performer .guest-related-links a{color:var(--ls-cyan);background:none;border-color:#35e3ff66}
.ls-site .live-guide p,.ls-site .live-activity p,.ls-site .live-activity .oe-secondary-copy{color:var(--ls-soft)}
.ls-site .live-activity>*,.ls-site .live-guide{background:none}
.ls-site .live-performer-copy *{color:#fff!important}
.ls-site .live-performer-copy>small,.ls-site .live-performer-copy>small *{color:var(--c)!important}
.ls-site .live-performer-copy .oe-secondary-copy,.ls-site .live-performer-copy p,.ls-site .live-performer-copy .guest-note,.ls-site .live-performer-copy dd{color:var(--ls-soft)!important}
.ls-site .live-performer-copy a,.ls-site .live-performer-copy a *{color:var(--ls-cyan)!important}
.ls-site .live-performer-copy .guest-note b,.ls-site .live-performer-copy .guest-note strong{color:var(--ls-yellow)!important}
.ls-site .live-performer{grid-template-columns:140px minmax(0,1fr);align-items:start}
.ls-site .live-performer>.guest-image{width:100%;display:block;aspect-ratio:3/4}
.ls-site .live-performer-copy{min-width:0}
.ls-site #guests .live-performer-copy *{color:#fff!important}
.ls-site #guests .live-performer-copy>small,.ls-site #guests .live-performer-copy>small *{color:var(--c)!important}
.ls-site #guests .live-performer-copy .oe-secondary-copy,.ls-site #guests .live-performer-copy p,.ls-site #guests .live-performer-copy .guest-note,.ls-site #guests .live-performer-copy dd{color:var(--ls-soft)!important}
.ls-site #guests .live-performer-copy a,.ls-site #guests .live-performer-copy a *{color:var(--ls-cyan)!important}
.ls-site #guests .live-performer-copy .guest-note b,.ls-site #guests .live-performer-copy .guest-note strong{color:var(--ls-yellow)!important}
.ls-site #participation .featured-activity-card,.ls-site #participation .featured-activity-card.reveal{background:#ffffff0c!important;color:#fff!important;border:1px solid var(--ls-line)!important;border-radius:0!important;box-shadow:none!important}
.ls-site #participation .featured-activity-media,.ls-site #participation .featured-activity-media.is-empty{background:linear-gradient(160deg,#2a1b6e,#ff3d8b66)!important;color:#ffffff88!important;border:0!important}
.ls-site #participation .featured-activity-copy,.ls-site #participation .featured-activity-copy *{color:#fff!important}
.ls-site #participation .featured-activity-copy p{color:var(--ls-soft)!important}
.ls-site #participation .featured-activity-kicker{color:var(--ls-pink)!important}
.ls-site #participation .featured-activity-link{color:var(--ls-cyan)!important}
.ls-site #activities .activity-view-tabs button.active,.ls-site #activities .activity-day-tabs button.active{background:var(--ls-pink)!important;border-color:var(--ls-pink)!important;color:#fff!important}
.ls-site #activities .activity-view-tabs button:not(.active),.ls-site #activities .activity-day-tabs button:not(.active){background:transparent!important}
.ls-site #activities .activity-page-subhead{border-color:#ffffff22!important}
.ls-site .hero{min-height:620px}
.ls-site .hero-grid{grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr);gap:48px;padding:70px 0}
.ls-site .hero-art{order:-1;aspect-ratio:3/2;max-height:480px;width:100%}
.ls-site .kv{clip-path:polygon(0 0,100% 0,88% 100%,0 100%);border-radius:10px}
.ls-site .hero-art:after{right:auto;left:-14px}
.ls-site .hero h1{font-size:clamp(34px,4.6vw,76px);overflow-wrap:normal;word-break:keep-all}
.ls-site .ticket:before,.ls-site .ticket:after,.ls-site .ticket *:before,.ls-site .ticket *:after{pointer-events:none}
.ls-site .live-pass,.ls-site .guide-grid article,.ls-site .community article,.ls-site .live-performer,.ls-site .live-guide{border-radius:8px}
.ls-site .kv{border-radius:10px}
/* entry gate: a plain centred stack (the shared gate is a grid) */
.ls-entry .ls-gate{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;grid-template-columns:none;min-height:0;height:auto;aspect-ratio:auto;box-sizing:border-box}
.ls-entry .ls-entry-kicker{align-self:center;width:auto;height:auto;flex:none}
.ls-entry .entry-ticket-title{max-width:100%;overflow-wrap:anywhere;font-size:clamp(30px,7vw,56px)}
.ls-entry .ls-entry-meta,.ls-entry .ls-entry-hint{width:auto}
.ls-site .ls-info{display:block}
.ls-site .live-pass-copy *{border:0!important;background:none!important;text-decoration:none!important}
.ls-site .live-pass :before,.ls-site .live-pass :after{display:none}
.ls-site .featured-activity-grid{grid-template-rows:none!important;grid-auto-rows:auto!important;align-items:start}
.ls-site #participation .featured-activity-card,.ls-site #participation .featured-activity-card:first-child{grid-row:auto!important;grid-column:auto!important;height:auto!important;min-height:0!important}
@media(max-width:820px){
 .ls-site .hero-grid{grid-template-columns:minmax(0,1fr)}.ls-site .hero-art{aspect-ratio:16/11;order:-1}
 .ls-site .nav .links{display:none}.ls-site .nav .wrap>.btn{margin-left:auto;padding:9px 16px}
 .ls-site .timeline-row{grid-template-columns:96px minmax(0,1fr);gap:4px 14px}.ls-site .timeline-row time{font-size:24px;grid-row:span 2}.ls-site .timeline-row b{font-size:16px}
 .ls-site .live-running-order{grid-template-columns:44px minmax(0,1fr)}.ls-site .live-running-order>aside{grid-column:2}.ls-site .live-running-order time{grid-column:2}
 .ls-site .live-activity{grid-template-columns:1fr}.ls-site .featured-activity-grid{grid-template-columns:1fr}
 .ls-site .map-explorer{grid-template-columns:1fr}.ls-site .live-update{grid-template-columns:34px minmax(0,1fr);}.ls-site .live-update time{display:none}.ls-site .live-update i{display:none}
 .ls-site .live-performer{grid-template-columns:104px minmax(0,1fr)}
 .ls-site .lineup-strip{grid-template-columns:repeat(2,minmax(0,1fr))}
}`;

const loader=`<div class="loader ls-entry" id="loader"><div class="gate ls-gate" role="button" tabindex="0" aria-label="点击进入活动网站"><span class="ls-entry-kicker">LIVE</span><b class="entry-ticket-title">STARDUST ONLY</b><span class="entry-ticket-subtitle"></span><div class="ls-entry-meta"><span class="entry-ticket-date-wrap"><b class="entry-ticket-date"></b></span><span class="entry-ticket-time-wrap"><b class="entry-ticket-time"></b></span><span class="entry-ticket-location-wrap"><b class="entry-ticket-location"></b></span></div><span class="ls-entry-hint">TAP TO ENTER</span><div class="entry-photo" aria-label="活动KV"></div><span class="entry-ticket-label" hidden></span><span class="stub-barcode" hidden></span><span class="stub-code" hidden><span class="entry-serial"></span></span></div><button class="skip" id="skip">跳过 →</button></div>`;

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

/* skeleton: every section opens with a full-width title bar; the content sits on a narrower sheet beneath it */
.ls-site .section{padding:0 0 54px;background:transparent;border:0}
.ls-site .section>.wrap{width:100%;max-width:none;padding:0;margin:0}
.ls-site .section .head{position:relative;display:flex;flex-direction:column;justify-content:center;min-height:68px;line-height:1.4;overflow:visible;margin:0 0 28px;padding:12px 22px;text-align:center;border:0;background:linear-gradient(90deg,var(--ls-pink),var(--ls-violet))}
.ls-site .section .head>div{display:block;text-align:center}
.ls-site .section .head .ey{display:block;font-size:10px;letter-spacing:.34em;opacity:.85;color:#fff;transform:none;background:none;padding:0;border:0}
.ls-site .section .head h2{font-size:22px;letter-spacing:.22em;margin:2px 0 0;text-shadow:none;transform:none;color:#fff;-webkit-text-stroke:0}
.ls-site .section .head h2:before{content:"◆ ";opacity:.8}.ls-site .section .head h2:after{content:" ◆";opacity:.8}
.ls-site .section .head .section-back{position:absolute;left:22px;top:50%;transform:translateY(-50%);font-size:12px;color:#fff}
.ls-site .section>.wrap>:not(.head){width:min(1080px,calc(100% - 44px));margin-left:auto;margin-right:auto}
.ls-site .section-orbit,.ls-site .section-no{display:none}
.ls-site #tickets .ticket-grid{grid-template-columns:1fr;gap:12px}
.ls-site .guest-grid,.ls-site .lineup{grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}
.ls-site .section .head{align-items:center}
.ls-site .ticket:before{display:none}
.ls-site .section .head{align-items:center}
.ls-site .ticket:before{display:none}
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
.ls-route-stop span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--ls-pink),var(--ls-violet));font-size:12px}
.ls-people{display:flex;flex-wrap:wrap;justify-content:center;gap:16px}
.ls-people>*{width:min(300px,100%)}
.ls-thanks{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:14px 34px}
.ls-sponsor{display:flex;align-items:center;gap:10px;background:none;border:0;box-shadow:none;padding:0;color:#fff}
.ls-sponsor b{font-size:15px;letter-spacing:.12em}
.ls-sponsor img{max-height:40px;width:auto}
`;
export const previewStyle=coreStyle+style+referenceStyle+ownStyle;
export const previewBody=`<div class="ls-site">${loader}
<header class="nav"><div class="wrap"><a class="brand" href="#top" data-oe-field="eventName">STARDUST ONLY</a><a class="btn ticket-purchase-link" href="#" target="_blank" rel="noopener">购票 ↗</a></div></header>
<main id="top">
<div class="ls-titlebar"><div class="wrap"><span>LIVE</span></div></div>
<section class="hero"><div class="wrap hero-grid"><div class="hero-art"><div class="kv"><strong class="ls-kv-fallback" data-oe-field="eventName">STARDUST ONLY</strong></div></div><div class="hero-copy"><h1 data-oe-field="eventName">STARDUST ONLY</h1><p data-oe-field="tagline"></p><div class="meta ls-info"><span class="pill" data-oe-field="date"></span><span class="pill" data-oe-field="location"></span><a class="pill venue-nav" href="#map-home" data-oe-field="edition"></a></div><div class="ls-cta"><a class="ls-btn pink ticket-purchase-link" href="#tickets">购票</a><a class="ls-btn" href="#timetable">看节目表</a></div></div></div></section>
<nav class="ls-pills" data-oe-mount="nav-links" aria-label="站内导航"><a href="#home" data-page-link="home">特设首页</a><a href="#activities" data-target-mode="page" data-page-link="activities">节目表</a><a href="#guests" data-target-mode="page" data-page-link="guests">出演嘉宾</a><a href="#tickets">票务信息</a><a href="#map-home">场地</a><a href="#guide" data-target-mode="page" data-page-link="guide">注意事项</a></nav>
<section class="section oe-home-only" id="timetable"><div class="wrap">${head('SCHEDULE','公演日程')}<div class="timeline" data-oe-mirror="timetable"></div>${more('#activities','activities','完整节目表')}</div></section>
<section class="section oe-home-only" id="lineup"><div class="wrap">${head('LINE UP','出演嘉宾')}<div class="lineup-strip" data-oe-mirror="lineup"></div>${more('#guests','guests','全部嘉宾')}</div></section>
${coreSection('updates').replace('class="updates-strip"','class="updates-strip oe-home-only"').replace('<div class="wrap">','<div class="wrap">'+head('NEWS','最新公告'))}
${coreSection('participation',{ey:'SPECIAL',title:'特别企划'})}
${coreSection('tickets',{ey:'TICKET',title:'票务'})}
${ownMapSection('ls',{ey:'ACCESS',title:'场地图',routeTitle:'前往'})}
${timetableSection}
${coreSection('guests',{ey:'CAST',title:'出演嘉宾'})}
${coreSection('guide',{ey:'INFORMATION',title:'观演指南'})}
${ownCommunitySection('ls',{ey:'COMMUNITY',title:'社群'})}
${ownSponsorsSection('ls',{ey:'SUPPORT',title:'合作支持'})}
</main>
<nav class="mobile-dock"><a href="#home" data-page-link="home">首页</a><a href="#activities" data-target-mode="page" data-page-link="activities">节目表</a><a href="#guests" data-target-mode="page" data-page-link="guests">嘉宾</a><a href="#guide" data-target-mode="page" data-page-link="guide">指南</a></nav>
<footer class="footer"><div class="wrap footer-grid"><div class="footer-brand"></div><div class="footer-participate"></div><div class="footer-visit"></div><div class="footer-social"></div></div></footer>
</div>`;
