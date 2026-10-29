/* Template 08 · 生日应援: a birthday card for a character or an idol. Cream paper with confetti,
   bunting, balloons and a polaroid photo; the home page leads with what is set up, what can be
   taken home and when. The accent follows the template colour, so each character can have their
   own. Hooks follow Template 01; everything visual is scoped to .bd-site. */
import {coreStyle,coreSection,head} from '/v8/templates/shared-sections.js?v=8.51.0';

const style=`
.bd-site{overflow-x:clip;--primary:#ff8fb8;--secondary:#8fd3ff;--bd-cream:#fffaf0;--bd-paper:#fffefb;--bd-accent:var(--primary);--bd-sky:#8fd3ff;--bd-yellow:#ffd86b;--bd-mint:#b9efd8;--bd-ink:#4a3358;--bd-soft:#85708f;--bd-line:#f0dfe6;
 position:relative;min-height:100vh;color:var(--bd-ink);font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif;
 background-color:var(--bd-cream);
 background-image:radial-gradient(circle,#ff8fb855 2.4px,transparent 2.8px),radial-gradient(circle,#8fd3ff66 2px,transparent 2.4px),radial-gradient(circle,#ffd86b88 2.6px,transparent 3px);background-size:97px 97px,131px 131px,79px 79px;background-position:0 0,40px 55px,20px 30px}
.bd-site .wrap{max-width:1120px;margin:0 auto;padding:0 22px}
.bd-site a{color:inherit}
.bd-site h1,.bd-site .head h2,.bd-site .bd-gift h3{font-family:"Noto Serif SC","Songti SC",serif}
/* header with bunting */
.bd-site .nav{position:sticky;top:0;z-index:40;height:64px;background:#fffefbf0;border:0;box-shadow:0 2px 0 var(--bd-line);backdrop-filter:blur(8px)}
.bd-site .nav:after{content:"";position:absolute;left:0;right:0;top:100%;height:18px;pointer-events:none;background:linear-gradient(90deg,var(--bd-accent) 0 33%,var(--bd-yellow) 33% 66%,var(--bd-sky) 66%);background-size:66px 100%;-webkit-mask:conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/22px 100%;mask:conic-gradient(from -45deg at bottom,#0000,#000 1deg 89deg,#0000 90deg) 50%/22px 100%}
.bd-site .nav .wrap{height:100%;display:flex;align-items:center;gap:20px}
.bd-site .brand{font-family:"Noto Serif SC",serif;font-size:19px;font-weight:900;color:var(--bd-ink);border:0;background:none;padding:0;box-shadow:none}
.bd-site .brand:before{content:"★ ";color:var(--bd-yellow);text-shadow:0 0 0 #e0b23a}
.bd-site .nav .links{display:flex;gap:4px;margin-left:auto}
.bd-site .nav .links a{padding:8px 13px;border-radius:999px;color:var(--bd-ink);font-size:13px;font-weight:700;border:0;background:none;white-space:nowrap}
.bd-site .nav .links a:hover{background:#ffe9f1}
.bd-site .nav .wrap>.btn{background:var(--bd-accent);color:#fff;border:0;border-radius:999px;padding:10px 20px;font-size:13px;font-weight:800;box-shadow:0 4px 0 color-mix(in srgb,var(--bd-accent) 70%,#000);white-space:nowrap}
/* hero */
.bd-site .hero{min-height:0;padding:70px 0 40px;background:none;display:block;overflow:visible;position:relative}
.bd-site .hero:before,.bd-site .hero:after{display:none}
.bd-site .hero-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:48px;align-items:center}
.bd-site .hero-copy{position:relative;text-align:center}
.bd-site .event-status-badge{display:inline-block;margin:0 6px 12px 0;padding:4px 14px;border-radius:999px;background:var(--bd-mint);color:#2c6a53;font-size:12px;font-weight:800}
.bd-site .hero-kicker{display:inline-block;margin-bottom:14px;padding:6px 20px;background:var(--bd-accent);color:#fff;font-size:13px;font-weight:900;letter-spacing:.3em;position:relative;clip-path:polygon(0 0,100% 0,calc(100% - 12px) 50%,100% 100%,0 100%,12px 50%)}
.bd-site .hero h1{margin:6px 0 14px;font-size:clamp(36px,min(10vw,5vw + 12px),72px);line-height:1.1;font-weight:900;color:var(--bd-ink);overflow-wrap:anywhere;text-transform:none;text-shadow:3px 3px 0 #fff,6px 6px 0 color-mix(in srgb,var(--bd-accent) 55%,#fff)}
.bd-site .hero p{margin:0 auto 20px;max-width:480px;padding:14px 20px;background:#fff;border:2px solid var(--bd-line);border-radius:22px;color:var(--bd-soft);font-size:16px;line-height:1.8;position:relative;box-shadow:0 5px 0 #fde4ec}
.bd-site .hero p:before{content:"";position:absolute;left:50%;top:-9px;width:16px;height:16px;background:#fff;border-left:2px solid var(--bd-line);border-top:2px solid var(--bd-line);transform:translateX(-50%) rotate(45deg)}
.bd-site .meta{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:22px;justify-content:center}
.bd-site .pill{border:2px solid var(--bd-line);background:#fff;color:var(--bd-ink);border-radius:999px;padding:7px 16px;font-size:13px;font-weight:700;box-shadow:none}
.bd-site .bd-cta{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.bd-site .bd-btn{display:inline-block;padding:12px 26px;border-radius:999px;font-weight:800;font-size:15px;text-decoration:none;background:#fff;color:var(--bd-ink);border:2px solid var(--bd-line)}
.bd-site .bd-btn.accent{background:var(--bd-accent);border-color:var(--bd-accent);color:#fff;box-shadow:0 4px 0 color-mix(in srgb,var(--bd-accent) 70%,#000)}
.bd-site .hero-art{position:relative;width:100%;max-width:420px;margin:0 auto;aspect-ratio:4/5;min-height:0!important;height:auto!important;transform:rotate(3deg)}
.bd-site .kv{position:absolute;inset:0;border:0;border-radius:6px;background:#fff;padding:0;box-shadow:0 18px 40px #4a335830,0 0 0 14px #fff,0 0 0 16px var(--bd-line);background-image:var(--oe-hero-image-desktop),linear-gradient(160deg,color-mix(in srgb,var(--bd-accent) 50%,#fff),#cfe9ff 60%,#fff2c4);background-size:cover;background-position:center}
.bd-site .kv:before,.bd-site .kv:after{display:none}
.bd-site .kv.empty{background-image:radial-gradient(circle at 30% 25%,#ffffffbb 0 12%,transparent 13%),radial-gradient(circle at 72% 70%,#ffffff99 0 9%,transparent 10%),linear-gradient(160deg,color-mix(in srgb,var(--bd-accent) 50%,#fff),#cfe9ff 60%,#fff2c4)!important}
.bd-kv-fallback{display:none;position:absolute;inset:0;align-items:center;justify-content:center;padding:14%;text-align:center;font-family:"Noto Serif SC",serif;font-size:clamp(26px,5vw,46px);font-weight:900;line-height:1.2;color:var(--bd-ink);overflow-wrap:anywhere}
.bd-site .kv.empty .bd-kv-fallback{display:flex}
.bd-site .hero-art:before{content:"";position:absolute;left:50%;top:-26px;width:110px;height:34px;background:#ffd86bcc;transform:translateX(-50%) rotate(-3deg);z-index:2}
.bd-site .hero-art:after{content:"★";position:absolute;right:-28px;bottom:-14px;font-size:46px;color:var(--bd-yellow);text-shadow:2px 2px 0 #e0b23a;z-index:2}
.bd-balloon{position:absolute;width:64px;height:78px;border-radius:50% 50% 48% 48%;z-index:1;pointer-events:none}
.bd-balloon:after{content:"";position:absolute;left:50%;top:100%;width:2px;height:70px;background:#4a335855}
.bd-balloon.a{left:2%;top:30px;background:radial-gradient(circle at 32% 28%,#fff9,transparent 30%),var(--bd-accent);transform:rotate(-8deg)}
.bd-balloon.b{left:calc(2% + 52px);top:76px;background:radial-gradient(circle at 32% 28%,#fff9,transparent 30%),var(--bd-sky);transform:rotate(6deg)}
.bd-balloon.c{right:2%;top:40px;background:radial-gradient(circle at 32% 28%,#fff9,transparent 30%),var(--bd-yellow);transform:rotate(8deg)}
/* sections */
.bd-site .section{padding:58px 0 14px;background:none;border:0}
.bd-site .section.alt{background:none}
.bd-site .head{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;margin-bottom:28px;border:0!important;padding-bottom:0!important;position:relative}
.bd-site .head>div{width:100%}
.bd-site .head h2{margin:0;font-size:clamp(26px,3vw,36px);font-weight:900;color:var(--bd-ink);line-height:1.2}
.bd-site .head h2:after{content:"✦ ✦ ✦";display:block;margin-top:8px;font-size:12px;letter-spacing:.5em;color:var(--bd-accent)}
.bd-site .head .ey{display:block;margin:0;color:var(--bd-accent)!important;background:none;border:0;padding:0;font-size:12px;font-weight:800;letter-spacing:.3em}
.bd-site .head .section-back{position:absolute;right:0;top:0}
.bd-site .section-back,.bd-more{background:#fff!important;color:var(--bd-ink)!important;border:2px solid var(--bd-line)!important;border-radius:999px!important;padding:6px 16px;font-weight:800;font-size:13px;text-decoration:none;box-shadow:none!important}
.bd-more-row{display:flex;justify-content:center;margin-top:22px}
/* updates */
.bd-site .updates-strip{background:none;border:0;padding:46px 0 0}
.bd-site .updates-strip .wrap{width:100%}
.bd-site .updates-list{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
.bd-site .bd-update{display:inline-flex;align-items:center;gap:10px;padding:9px 18px;border-radius:999px;background:#fff;border:2px solid var(--bd-line);text-decoration:none;font-size:14px}
.bd-site .bd-update-star{color:var(--bd-yellow);text-shadow:1px 1px 0 #e0b23a}.bd-site .bd-update time{color:var(--bd-soft);font-size:12px}.bd-site .bd-update b{font-weight:800}
/* support content: gift-tag cards */
.bd-site .featured-activity-grid{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))!important;grid-template-rows:none!important;grid-auto-rows:auto!important;gap:22px;align-items:start}
.bd-site #participation .featured-activity-card,.bd-site #participation .featured-activity-card.reveal,.bd-site #participation .featured-activity-card:first-child{position:relative;display:flex!important;flex-direction:column!important;grid-row:auto!important;grid-column:auto!important;min-height:0!important;height:auto!important;background:var(--bd-paper)!important;color:var(--bd-ink)!important;border:2px solid var(--bd-line)!important;border-top:10px solid var(--bd-accent)!important;border-radius:20px!important;box-shadow:0 8px 0 #fde4ec!important;text-decoration:none;overflow:hidden}
.bd-site #participation .featured-activity-card:nth-child(3n+2){border-top-color:var(--bd-sky)!important}.bd-site #participation .featured-activity-card:nth-child(3n+3){border-top-color:var(--bd-yellow)!important}
.bd-site #participation .featured-activity-media,.bd-site #participation .featured-activity-media.is-empty{position:static!important;width:100%!important;height:auto!important;aspect-ratio:16/10!important;background:linear-gradient(150deg,#ffe3ee,#dff1ff)!important;color:var(--bd-soft)!important;display:grid;place-items:center;font-size:12px;font-weight:800;letter-spacing:.2em;border:0!important}
.bd-site #participation .featured-activity-media img{width:100%;height:100%;object-fit:cover;display:block}
.bd-site #participation .featured-activity-copy{position:static!important;transform:none!important;background:none!important;width:auto!important;padding:16px 20px 20px;display:flex;flex-direction:column;gap:6px}
.bd-site #participation .featured-activity-copy h3,.bd-site #participation .featured-activity-copy b{font-family:"Noto Serif SC",serif;color:var(--bd-ink)!important;font-size:20px;font-weight:900;margin:0}
.bd-site #participation .featured-activity-copy p{color:var(--bd-soft)!important;margin:0;line-height:1.75}
.bd-site #participation .featured-activity-kicker{color:var(--bd-accent)!important;font-weight:800;letter-spacing:.14em;font-size:12px}
.bd-site #participation .featured-activity-link{color:var(--bd-ink)!important;font-weight:800}
/* gifts */
.bd-site .ticket-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px}
.bd-site .bd-gift{position:relative;padding:34px 24px 22px;background:var(--bd-paper);border:2px dashed #f2b8cf;border-radius:20px;color:var(--bd-ink);box-shadow:0 6px 0 #fde4ec;display:flex;flex-direction:column;gap:8px}
.bd-site .bd-gift-ribbon{position:absolute;left:18px;top:-12px;padding:4px 16px;background:var(--bd-accent);color:#fff;font-size:12px;font-weight:900;letter-spacing:.16em;border-radius:6px;box-shadow:0 3px 0 color-mix(in srgb,var(--bd-accent) 65%,#000)}
.bd-site .bd-gift h3{margin:0;font-size:21px;font-weight:900;color:var(--bd-ink)}
.bd-site .bd-gift span,.bd-site .bd-gift .oe-ticket-gift{display:block;color:var(--bd-soft);font-size:14px;line-height:1.7}
.bd-site .bd-gift-price{align-self:flex-start;margin-top:4px;padding:4px 14px;border-radius:999px;background:#fff2c4;color:#8a6200;font-weight:900;font-size:15px}
.bd-site .ticket-actions{text-align:center;margin-top:24px}
.bd-site .ticket-actions .btn{background:var(--bd-accent);color:#fff;border:0;border-radius:999px;padding:13px 30px;font-weight:800;box-shadow:0 4px 0 color-mix(in srgb,var(--bd-accent) 70%,#000)}
/* schedule mirror (home) and steps (page) */
.bd-site .timeline{max-width:760px;margin:0 auto}
.bd-site .timeline-day h3{display:inline-block;margin:0 0 14px;padding:5px 18px;border-radius:999px;background:var(--bd-yellow);color:#6a4a00;font-size:14px;font-weight:800;letter-spacing:.1em}
.bd-site .timeline-row{position:relative;display:grid;grid-template-columns:90px minmax(0,1fr);gap:4px 20px;align-items:center;padding:12px 0;text-decoration:none;color:var(--bd-ink)}
.bd-site .timeline-row:before{content:"";position:absolute;left:98px;top:0;bottom:0;border-left:2px dotted #e8b9cc}
.bd-site .timeline-row time{justify-self:start;padding:6px 12px;border-radius:999px;background:#ffe3ee;color:#b0405e;font-weight:900;font-size:16px;position:relative;z-index:1}
.bd-site .timeline-row time small,.bd-site .timeline-stage{display:none}
.bd-site .timeline-row b{grid-column:2;font-size:17px;font-weight:800;padding-left:22px;position:relative}
.bd-site .timeline-row b:before{content:"";position:absolute;left:-7px;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;background:var(--bd-accent);box-shadow:0 0 0 4px var(--bd-cream)}
.bd-site .timeline-row:nth-child(3n+2) b:before{background:var(--bd-sky)}.bd-site .timeline-row:nth-child(3n+3) b:before{background:var(--bd-yellow)}
.bd-site .bd-step{display:grid;grid-template-columns:44px 120px minmax(0,1fr);gap:14px;align-items:start;padding:16px 20px;margin-bottom:14px;background:var(--bd-paper);border:2px solid var(--bd-line);border-radius:20px;box-shadow:0 5px 0 #fde4ec}
.bd-site .bd-step-no{width:40px;height:40px;border-radius:50%;background:var(--bd-accent);color:#fff;display:grid;place-items:center;font-weight:900}
.bd-site .bd-step-time strong{display:block;font-size:20px;font-weight:900;color:#b0405e}.bd-site .bd-step-time small{color:var(--bd-soft)}
.bd-site .bd-step-body>small{color:#2c6a53;font-weight:800;letter-spacing:.08em}
.bd-site .bd-step-body b{display:block;font-family:"Noto Serif SC",serif;font-size:19px;font-weight:900;margin:2px 0 4px}
.bd-site .bd-step-body p{margin:0;color:var(--bd-soft);line-height:1.75}
.bd-site .activity-switch-row{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center;margin-bottom:22px}
.bd-site .activity-view-tabs,.bd-site .activity-day-tabs{display:flex;gap:8px;flex-wrap:wrap}
.bd-site .activity-page-subhead{display:flex;align-items:baseline;justify-content:center;gap:12px;margin:0 0 18px}.bd-site .activity-page-subhead span{color:var(--bd-accent);font-weight:800;letter-spacing:.24em;font-size:12px}.bd-site .activity-page-subhead b{font-family:"Noto Serif SC",serif;font-size:20px}
.bd-site #activities .activity-view-tabs button,.bd-site #activities .activity-day-tabs button{background:#fff!important;color:var(--bd-ink)!important;border:2px solid var(--bd-line)!important;border-radius:999px!important;padding:8px 20px;font-weight:800;box-shadow:none!important}
.bd-site #activities .activity-view-tabs button.active,.bd-site #activities .activity-day-tabs button.active{background:var(--bd-accent)!important;border-color:var(--bd-accent)!important;color:#fff!important}
.bd-site #activities .activity-page-subhead{border-color:var(--bd-line)!important}
.bd-site .bd-activity{display:grid;grid-template-columns:240px minmax(0,1fr);gap:22px;padding:18px;margin-bottom:20px;background:var(--bd-paper);border:2px solid var(--bd-line);border-radius:22px;box-shadow:0 7px 0 #fde4ec}
.bd-site .bd-activity-visual:empty{display:none}.bd-site .bd-activity:has(.bd-activity-visual:empty){grid-template-columns:1fr}
.bd-site .bd-activity-visual img{width:100%;border-radius:14px;display:block}
.bd-site .bd-tag{display:inline-block;padding:3px 12px;border-radius:999px;background:var(--bd-mint);color:#2c6a53;font-size:12px;font-weight:800}
.bd-site .bd-activity h3{margin:8px 0;font-family:"Noto Serif SC",serif;font-size:22px;font-weight:900}.bd-site .bd-activity p{color:var(--bd-soft);line-height:1.8}
/* thanks (lineup mirror) and the guest page */
.bd-site .lineup-strip{display:flex;flex-wrap:wrap;justify-content:center;gap:26px}
.bd-site .lineup-card{display:flex;flex-direction:column;align-items:center;text-align:center;width:150px;text-decoration:none;color:var(--bd-ink)}
.bd-site .lineup-img{width:108px;height:108px;border-radius:50%;overflow:hidden;background:linear-gradient(150deg,#ffe3ee,#dff1ff);box-shadow:0 0 0 4px #fff,0 0 0 6px var(--bd-accent);display:grid;place-items:center}
.bd-site .lineup-card:nth-child(2n) .lineup-img{box-shadow:0 0 0 4px #fff,0 0 0 6px var(--bd-sky)}
.bd-site .lineup-img img{width:100%;height:100%;object-fit:cover}.bd-site .lineup-initial{font-family:"Noto Serif SC",serif;font-size:40px;font-weight:900;color:#ffffffdd}
.bd-site .lineup-card b{margin-top:14px;font-size:17px;font-weight:800}.bd-site .lineup-card small{margin-top:2px;color:#b0405e;font-weight:800;letter-spacing:.12em;font-size:11px}
.bd-site .guest-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:22px}
.bd-site .bd-guest{display:grid;grid-template-columns:104px minmax(0,1fr);gap:18px;padding:20px;background:var(--bd-paper);border:2px solid var(--bd-line);border-radius:22px;box-shadow:0 6px 0 #fde4ec;align-items:start}
.bd-site .bd-guest-photo{min-width:0}
.bd-site .bd-guest-photo .guest-image,.bd-site .bd-guest-photo .guest-image.empty,.bd-site .bd-guest-photo img{display:block;width:100%!important;max-width:100%!important;aspect-ratio:1/1;border-radius:50%!important;object-fit:cover;border:0!important;padding:0;background:linear-gradient(150deg,#ffe3ee,#dff1ff)!important;box-shadow:0 0 0 3px #fff,0 0 0 5px var(--bd-accent);min-height:0}
.bd-site .bd-guest-copy small{color:#b0405e;font-weight:800;letter-spacing:.14em;font-size:11px}
.bd-site .bd-guest-copy b.guest-poster-name,.bd-site #guests .bd-guest-copy b.guest-poster-name{display:block;font-family:"Noto Serif SC",serif;font-size:21px;font-weight:900;margin:2px 0 6px;color:var(--bd-ink)!important}
.bd-site .bd-guest-copy,.bd-site .bd-guest-copy p,.bd-site .bd-guest-copy .oe-secondary-copy{color:var(--bd-soft);font-size:14px;line-height:1.75}
.bd-site .bd-guest-copy .guest-note,.bd-site .bd-guest-copy .guest-related-note{background:#fff5f9!important;border:2px solid var(--bd-line)!important;border-radius:14px!important;box-shadow:none!important}
/* map, guide, community, footer */
.bd-site .map-explorer{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:18px}
.bd-site .map-static,.bd-site .map-link-rail{background:var(--bd-paper);border:2px solid var(--bd-line);border-radius:22px;box-shadow:none;color:var(--bd-ink)}
.bd-site .map-link-list a{display:flex;gap:10px;padding:10px 14px;margin-top:8px;border-radius:999px;background:#fff;border:2px solid var(--bd-line);text-decoration:none;color:var(--bd-ink)}
.bd-site .guide-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.bd-site .guide-grid article,.bd-site .community article{background:var(--bd-paper);border:2px solid var(--bd-line);border-radius:22px;box-shadow:0 6px 0 #fde4ec;color:var(--bd-ink);padding:20px}
.bd-site .community{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
.bd-site .footer{margin-top:60px;padding:42px 0 96px;background:#fde4ec;color:var(--bd-ink);border-top:2px dotted #e8b9cc}
.bd-site .footer h2,.bd-site .footer b{color:var(--bd-ink)}.bd-site .footer a{color:#b0405e}
.bd-site .mobile-dock{background:#fffefbf2;border-top:2px dotted var(--bd-line);backdrop-filter:blur(8px)}.bd-site .mobile-dock a{color:var(--bd-ink);font-weight:800}
.bd-site .bd-gift:before,.bd-site .bd-gift:after{display:none!important}
.bd-site .bd-gift .oe-ticket-gift,.bd-site .bd-gift .gift,.bd-site .bd-gift-main *{border:0!important;background:none!important;padding:0!important;box-shadow:none!important;text-decoration:none!important}
.bd-site .bd-site #activities .activity-page-subhead,.bd-site #activities .activity-page-block{border:0!important}
.bd-site{background-color:#fff;background-image:none}
.bd-site h1,.bd-site .head h2,.bd-site .bd-gift h3,.bd-site .bd-step-body b,.bd-site .bd-activity h3,.bd-site .bd-guest-copy b.guest-poster-name,.bd-site #participation .featured-activity-copy h3,.bd-site #participation .featured-activity-copy b,.bd-site .brand{font-family:"M PLUS Rounded 1c","Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif}
.bd-site .hero{background:var(--bd-accent);color:#fff;padding:78px 0 84px;position:relative;overflow:hidden}
.bd-site .hero:before{display:block;content:"";position:absolute;inset:0;background:radial-gradient(circle,#ffffff55 3px,transparent 3.4px) 0 0/46px 46px;pointer-events:none}
.bd-site .hero:after{display:block;content:"";position:absolute;left:0;right:0;bottom:-1px;height:30px;background:radial-gradient(circle at 20px 0,transparent 19px,#fff 20px) 0 0/40px 30px repeat-x}
.bd-site .hero-copy{text-align:left}
.bd-site .hero h1{color:#fff;font-weight:900;text-shadow:4px 4px 0 color-mix(in srgb,var(--bd-accent) 55%,#000)}
.bd-site .hero-kicker{background:#fff;color:var(--bd-accent);clip-path:none;border-radius:999px;letter-spacing:.2em}
.bd-site .hero p{background:#ffffff26;border:2px solid #ffffff88;color:#fff;box-shadow:none;margin-left:0}
.bd-site .hero p:before{display:none}
.bd-site .meta,.bd-site .bd-cta{justify-content:flex-start}
.bd-site .pill{background:#fff;border-color:#fff}
.bd-site .bd-btn{background:transparent;color:#fff;border-color:#fff}.bd-site .bd-btn.accent{background:#fff;color:var(--bd-accent);box-shadow:none}
.bd-balloon{display:none}
.bd-site .head{flex-direction:row;flex-wrap:wrap;align-items:flex-end;text-align:left}.bd-site .head>div{width:auto;flex:1}
.bd-site .head h2{background:linear-gradient(transparent 62%,#ffd86b 62%);padding:0 6px;display:inline-block;font-weight:700;letter-spacing:.02em}
.bd-site .head h2:after{display:none}
.bd-site .head .ey{display:inline-block;padding:3px 12px;border-radius:999px;background:color-mix(in srgb,var(--bd-accent) 14%,#fff);color:var(--bd-accent)!important;margin-bottom:6px}
.bd-site .head .section-back{position:static;margin-left:auto}
.bd-site #participation .featured-activity-card,.bd-site #participation .featured-activity-card.reveal,.bd-site #participation .featured-activity-card:first-child{border:0!important;border-radius:28px!important;box-shadow:none!important;background:color-mix(in srgb,var(--bd-accent) 12%,#fff)!important}
.bd-site #participation .featured-activity-card:nth-child(3n+2){background:#e8f5ff!important}.bd-site #participation .featured-activity-card:nth-child(3n+3){background:#fff5d6!important}
.bd-site #participation .featured-activity-media,.bd-site #participation .featured-activity-media.is-empty{background:#ffffffaa!important;margin:12px 12px 0;width:auto!important;border-radius:20px!important}
.bd-site .bd-gift{border:0;border-radius:28px;box-shadow:none;background:color-mix(in srgb,var(--bd-accent) 14%,#fff)}
.bd-site .bd-gift:nth-child(3n+2){background:#e8f5ff}.bd-site .bd-gift:nth-child(3n+3){background:#fff5d6}
.bd-site .bd-gift-price{background:#fff;color:var(--bd-ink)}
.bd-site .timeline{max-width:none}
.bd-site .timeline-row{grid-template-columns:96px minmax(0,1fr);padding:12px 18px;margin-bottom:10px;border-radius:999px;background:color-mix(in srgb,var(--bd-accent) 11%,#fff)}
.bd-site .timeline-row:nth-child(3n+2){background:#e8f5ff}.bd-site .timeline-row:nth-child(3n+3){background:#fff5d6}
.bd-site .timeline-row:before{display:none}.bd-site .timeline-row b:before{display:none}.bd-site .timeline-row b{padding-left:0}
.bd-site .timeline-row time{background:#fff;color:var(--bd-ink)}
.bd-site .bd-step,.bd-site .bd-activity,.bd-site .bd-guest,.bd-site .guide-grid article,.bd-site .community article{border:0;box-shadow:none;border-radius:28px;background:color-mix(in srgb,var(--bd-accent) 9%,#fff)}
.bd-site .bd-update{border:0;background:color-mix(in srgb,var(--bd-accent) 14%,#fff)}
.bd-site .footer{background:var(--bd-accent);color:#fff;border-top:0}.bd-site .footer h2,.bd-site .footer b,.bd-site .footer a{color:#fff}
.bd-site .ticket:before,.bd-site .ticket:after,.bd-site .ticket *:before,.bd-site .ticket *:after{pointer-events:none}
@media(max-width:820px){
 .bd-site .hero{padding-top:56px}.bd-site .hero-grid{grid-template-columns:minmax(0,1fr);gap:34px}.bd-site .hero-art{order:-1;max-width:250px}
 .bd-balloon{display:none}
 .bd-site .nav .links{display:none}.bd-site .nav .wrap>.btn{margin-left:auto;padding:9px 16px}
 .bd-site .bd-activity{grid-template-columns:1fr}.bd-site .map-explorer{grid-template-columns:1fr}
 .bd-site .bd-step{grid-template-columns:40px minmax(0,1fr);gap:4px 12px}.bd-site .bd-step-time{grid-column:2}.bd-site .bd-step-body{grid-column:2}
 .bd-site .timeline-row{grid-template-columns:72px minmax(0,1fr);gap:4px 12px}.bd-site .timeline-row:before{left:80px}.bd-site .timeline-row time{font-size:14px;padding:5px 9px}
 .bd-site .bd-guest{grid-template-columns:84px minmax(0,1fr)}.bd-site .head .section-back{position:static;margin-top:6px}
}`;

const more=(page,text)=>'<div class="bd-more-row"><a class="bd-more" href="#'+page+'" data-target-mode="page" data-page-link="'+page+'">'+text+' →</a></div>';
const stepsSection=coreSection('activities',{ey:'SCHEDULE',title:'当天安排'})
  .replace('>日程<','>当天安排<').replace('<b>当天日程</b>','<b>当天安排</b>').replace('<span>SCHEDULE</span>','<span>TODAY</span>')
  .replace('>活动详情<','>应援内容<').replace('<b>活动详情</b>','<b>每一项怎么参加</b>');

export const previewStyle=coreStyle+style;
export const previewBody=`<div class="bd-site">
<header class="nav"><div class="wrap"><a class="brand" href="#top" data-oe-field="eventName">STARDUST ONLY</a><nav class="links" data-oe-mount="nav-links"><a href="#home" data-page-link="home">首页</a><a href="#participation">应援内容</a><a href="#tickets">赠品</a><a href="#activities" data-target-mode="page" data-page-link="activities">当天安排</a><a href="#guests" data-target-mode="page" data-page-link="guests">协力的人</a><a href="#guide" data-target-mode="page" data-page-link="guide">须知</a></nav><a class="btn ticket-purchase-link" href="#" target="_blank" rel="noopener">预约领取 ↗</a></div></header>
<main id="top">
<section class="hero"><span class="bd-balloon a"></span><span class="bd-balloon b"></span><span class="bd-balloon c"></span><div class="wrap hero-grid"><div class="hero-copy"><span class="hero-kicker">HAPPY BIRTHDAY</span><h1 data-oe-field="eventName">STARDUST ONLY</h1><p data-oe-field="tagline"></p><div class="meta"><span class="pill" data-oe-field="date"></span><span class="pill" data-oe-field="location"></span><a class="pill venue-nav" href="#map-home" data-oe-field="edition"></a></div><div class="bd-cta"><a class="bd-btn accent ticket-purchase-link" href="#tickets">预约领取</a><a class="bd-btn" href="#participation">看应援内容</a></div></div><div class="hero-art"><div class="kv"><strong class="bd-kv-fallback" data-oe-field="eventName">STARDUST ONLY</strong></div></div></div></section>
${coreSection('updates').replace('class="updates-strip"','class="updates-strip oe-home-only"').replace('<div class="wrap">','<div class="wrap">'+head('NEWS','最新消息'))}
${coreSection('participation',{ey:'SUPPORT',title:'应援内容'})}
${coreSection('tickets',{ey:'GIFTS',title:'赠品与领取'})}
<section class="section oe-home-only" id="timetable"><div class="wrap">${head('SCHEDULE','当天安排')}<div class="timeline" data-oe-mirror="timetable"></div>${more('activities','查看完整安排')}</div></section>
<section class="section oe-home-only" id="lineup"><div class="wrap">${head('THANKS','协力的人')}<div class="lineup-strip" data-oe-mirror="lineup"></div>${more('guests','全部介绍')}</div></section>
${coreSection('map-home',{ey:'PLACE',title:'场地'})}
${stepsSection}
${coreSection('guests',{ey:'MEMBERS',title:'协力的人'})}
${coreSection('guide',{ey:'NOTICE',title:'领取与参观须知'})}
${coreSection('community',{ey:'CONTACT',title:'联系与交流'})}
</main>
<nav class="mobile-dock"><a href="#home" data-page-link="home">首页</a><a href="#activities" data-target-mode="page" data-page-link="activities">安排</a><a href="#guests" data-target-mode="page" data-page-link="guests">协力</a><a href="#guide" data-target-mode="page" data-page-link="guide">须知</a></nav>
<footer class="footer"><div class="wrap footer-grid"><div class="footer-brand"></div><div class="footer-participate"></div><div class="footer-visit"></div><div class="footer-social"></div></div></footer>
</div>`;
