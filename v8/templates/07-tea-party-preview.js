/* Template 06 · 茶会小聚: an invitation-card site for small gatherings, in the soft pastel style of
   anime cafe and tea-party event pages (Animate Cafe collaborations, "お茶会" invitations).
   The home page answers what happens, and when, before anything else. Hooks follow Template 01;
   everything visual is scoped to .tp-site. */
import {coreStyle,coreSection,head} from '/v8/templates/shared-sections.js?v=8.51.0';

const style=`
.tp-site{overflow-x:clip;--primary:#f08fa8;--secondary:#8fd3bb;--tp-cream:#fff6ec;--tp-paper:#fffdf8;--tp-pink:#f08fa8;--tp-rose:#fadbe3;--tp-mint:#bfe6d6;--tp-lav:#dccffa;--tp-brown:#5a3d3a;--tp-soft:#8c6f6a;--tp-gold:#d9a441;--tp-line:#ecd5cc;
 position:relative;min-height:100vh;color:var(--tp-brown);font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif;
 background-color:var(--tp-cream);background-image:radial-gradient(circle,#f9d3dc99 1.6px,transparent 1.8px);background-size:30px 30px}
.tp-site .wrap{max-width:1120px;margin:0 auto;padding:0 22px}
.tp-site a{color:inherit}
.tp-site .tp-serif,.tp-site h1,.tp-site .head h2,.tp-site .tp-ticket h3{font-family:"Noto Serif SC","Songti SC",serif}
/* header */
.tp-site .nav{position:sticky;top:0;z-index:40;height:64px;background:#fff6ece6;border:0;border-bottom:2px dotted var(--tp-line);box-shadow:none;backdrop-filter:blur(8px)}
.tp-site .nav .wrap{height:100%;display:flex;align-items:center;gap:20px}
.tp-site .brand{font-family:"Noto Serif SC",serif;font-size:19px;font-weight:900;color:var(--tp-brown);border:0;background:none;padding:0;box-shadow:none}
.tp-site .brand:before{content:"✿ ";color:var(--tp-pink)}
.tp-site .nav .links{display:flex;gap:4px;margin-left:auto}
.tp-site .nav .links a{padding:8px 13px;border-radius:999px;color:var(--tp-brown);font-size:13px;font-weight:700;border:0;background:none;white-space:nowrap}
.tp-site .nav .links a:hover{background:var(--tp-rose)}
.tp-site .nav .wrap>.btn{background:var(--tp-pink);color:#fff;border:0;border-radius:999px;padding:10px 20px;font-size:13px;font-weight:800;box-shadow:0 4px 0 #d9728d;white-space:nowrap}
/* hero: an invitation card beside a round photo */
.tp-site .hero{min-height:0;padding:54px 0 36px;background:none;display:block;overflow:visible}
.tp-site .hero:before,.tp-site .hero:after{display:none}
.tp-site .hero-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:46px;align-items:center}
.tp-site .hero-copy{position:relative;background:var(--tp-paper);border:2px solid var(--tp-line);border-radius:26px;padding:38px 36px 34px;box-shadow:0 18px 40px #5a3d3a1c}
.tp-site .hero-copy:before{content:"";position:absolute;inset:9px;border:2px dashed #f0bfcb;border-radius:19px;pointer-events:none}
.tp-site .hero-copy>*{position:relative}
.tp-site .event-status-badge{display:inline-block;margin:0 8px 14px 0;padding:4px 14px;border-radius:999px;background:var(--tp-mint);color:#2f5f4d;font-size:12px;font-weight:800}
.tp-site .hero-kicker{display:inline-block;margin-bottom:14px;padding:4px 14px;border-radius:999px;background:var(--tp-rose);color:#b0405e;font-size:12px;font-weight:800;letter-spacing:.14em}
.tp-site .hero h1{margin:0 0 14px;font-size:clamp(34px,min(10vw,4.4vw + 12px),64px);line-height:1.12;font-weight:900;color:var(--tp-brown);overflow-wrap:anywhere;text-transform:none}
.tp-site .hero p{margin:0 0 20px;max-width:520px;color:var(--tp-soft);font-size:16px;line-height:1.85}
.tp-site .meta{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:22px}
.tp-site .pill{border:2px solid var(--tp-line);background:#fff;color:var(--tp-brown);border-radius:999px;padding:7px 16px;font-size:13px;font-weight:700;box-shadow:none}
.tp-site .tp-cta{display:flex;flex-wrap:wrap;gap:12px}
.tp-site .tp-btn{display:inline-block;padding:12px 26px;border-radius:999px;font-weight:800;font-size:15px;text-decoration:none;background:#fff;color:var(--tp-brown);border:2px solid var(--tp-line)}
.tp-site .tp-btn.pink{background:var(--tp-pink);border-color:var(--tp-pink);color:#fff;box-shadow:0 4px 0 #d9728d}
.tp-site .hero-art{position:relative;width:100%;max-width:440px;margin:0 auto;aspect-ratio:1/1}
.tp-site .kv{position:absolute;inset:0;border:0;border-radius:50%;background-color:#f6c7d3;background-image:var(--oe-hero-image-desktop),linear-gradient(150deg,#f9d3dc,#dccffa 60%,#bfe6d6);background-size:cover;background-position:center;box-shadow:0 0 0 10px var(--tp-paper),0 0 0 13px var(--tp-pink),0 0 0 24px #f9d3dc,0 20px 40px #5a3d3a22}
.tp-site .kv:before,.tp-site .kv:after{display:none}
.tp-site .kv.empty{background-image:radial-gradient(circle at 30% 30%,#ffffffaa 0 14%,transparent 15%),radial-gradient(circle at 70% 65%,#ffffff88 0 10%,transparent 11%),linear-gradient(150deg,#f9d3dc,#dccffa 60%,#bfe6d6)!important}
.tp-kv-fallback{display:none;position:absolute;inset:0;align-items:center;justify-content:center;padding:18%;text-align:center;font-family:"Noto Serif SC",serif;font-size:clamp(26px,5vw,48px);font-weight:900;line-height:1.2;color:var(--tp-brown);overflow-wrap:anywhere}
.tp-site .kv.empty .tp-kv-fallback{display:flex}
.tp-site .hero-art:before{content:"♡";position:absolute;right:-6px;top:6%;font-size:34px;color:var(--tp-pink);z-index:2}
.tp-site .hero-art:after{content:"✿";position:absolute;left:-4px;bottom:8%;font-size:30px;color:var(--tp-gold);z-index:2}
/* sections */
.tp-site .section{padding:58px 0 14px;background:none;border:0}
.tp-site .section.alt{background:none}
.tp-site .head{display:flex;align-items:flex-end;justify-content:center;text-align:center;flex-direction:column;gap:6px;margin-bottom:28px;border:0!important;padding-bottom:0!important;position:relative}
.tp-site .head h2{margin:0;font-size:clamp(26px,3vw,36px);font-weight:700;color:var(--tp-brown);line-height:1.2}
.tp-site .head .ey{display:block;margin:0;color:var(--tp-pink)!important;background:none;border:0;padding:0;font-size:12px;font-weight:800;letter-spacing:.3em}
.tp-site .head h2:after{content:"";display:block;width:64px;height:8px;margin:10px auto 0;background:radial-gradient(circle,var(--tp-pink) 3px,transparent 3.5px) 0 50%/16px 8px repeat-x}
.tp-site .head>div{width:100%}
.tp-site .head .section-back{position:absolute;right:0;top:0}
.tp-site .section-back{background:#fff!important;color:var(--tp-brown)!important;border:2px solid var(--tp-line)!important;border-radius:999px!important;padding:6px 16px;font-weight:800;font-size:13px;text-decoration:none;box-shadow:none!important}
/* updates */
.tp-site .updates-strip{background:none;border:0;padding:40px 0 0}
.tp-site .updates-list{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
.tp-site .tp-update{display:inline-flex;align-items:center;gap:10px;padding:9px 18px;border-radius:999px;background:#fff;border:2px solid var(--tp-line);text-decoration:none;color:var(--tp-brown);font-size:14px}
.tp-site .tp-update-heart{color:var(--tp-pink)}.tp-site .tp-update time{color:var(--tp-soft);font-size:12px}.tp-site .tp-update b{font-weight:800}
/* featured activities: the heart of the home page */
.tp-site .featured-activity-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px}
.tp-site #participation .featured-activity-card,.tp-site #participation .featured-activity-card.reveal{position:relative;display:flex;flex-direction:column;background:var(--tp-paper)!important;color:var(--tp-brown)!important;border:2px solid var(--tp-line)!important;border-radius:24px!important;box-shadow:0 12px 26px #5a3d3a14!important;overflow:hidden;text-decoration:none}
.tp-site #participation .featured-activity-media,.tp-site #participation .featured-activity-media.is-empty{aspect-ratio:16/10;background:linear-gradient(150deg,#f9d3dc,#dccffa)!important;color:#8c6f6a!important;display:grid;place-items:center;font-size:12px;font-weight:800;letter-spacing:.2em;border:0!important}
.tp-site #participation .featured-activity-media img{width:100%;height:100%;object-fit:cover;display:block}
.tp-site #participation .featured-activity-copy{padding:18px 22px 22px;display:flex;flex-direction:column;gap:6px}
.tp-site #participation .featured-activity-copy h3,.tp-site #participation .featured-activity-copy b{font-family:"Noto Serif SC",serif;color:var(--tp-brown)!important;font-size:20px;font-weight:900;margin:0}
.tp-site #participation .featured-activity-copy p{color:var(--tp-soft)!important;margin:0;line-height:1.75}
.tp-site #participation .featured-activity-kicker{color:var(--tp-pink)!important;font-weight:800;letter-spacing:.14em;font-size:12px}
.tp-site #participation .featured-activity-link{color:#b0405e!important;font-weight:800}
.tp-site #participation .section-more,.tp-site #participation .ticket-actions a{border-radius:999px}
/* agenda mirror (home) and agenda page */
.tp-site .timeline{max-width:760px;margin:0 auto}
.tp-site .timeline-day h3{display:inline-block;margin:0 0 14px;padding:5px 18px;border-radius:999px;background:var(--tp-mint);color:#2f5f4d;font-size:14px;font-weight:800;letter-spacing:.1em}
.tp-site .timeline-day{position:relative;margin-bottom:18px}
.tp-site .timeline-row{position:relative;display:grid;grid-template-columns:92px minmax(0,1fr);gap:4px 18px;align-items:center;padding:12px 20px 12px 0;text-decoration:none;color:var(--tp-brown)}
.tp-site .timeline-row:before{content:"";position:absolute;left:100px;top:0;bottom:0;border-left:2px dotted #e3b9c4}
.tp-site .timeline-row time{display:block;justify-self:start;padding:6px 12px;border-radius:999px;background:var(--tp-rose);color:#b0405e;font-weight:900;font-size:16px;text-align:center;position:relative;z-index:1}
.tp-site .timeline-row time small{display:none}
.tp-site .timeline-stage{display:none}
.tp-site .timeline-row b{grid-column:2;font-size:17px;font-weight:800;padding-left:22px;position:relative}
.tp-site .timeline-row b:before{content:"";position:absolute;left:-7px;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;background:var(--tp-pink);box-shadow:0 0 0 4px var(--tp-cream)}
.tp-site .timeline-row:hover b{color:#b0405e}
.tp-site .tp-agenda{display:grid;grid-template-columns:120px minmax(0,1fr);gap:20px;padding:6px 0 22px;position:relative}
.tp-site .tp-agenda:before{content:"";position:absolute;left:128px;top:34px;bottom:-6px;border-left:2px dotted #e3b9c4}
.tp-site .tp-agenda time{align-self:start;padding:8px 12px;border-radius:999px;background:var(--tp-rose);color:#b0405e;text-align:center;position:relative;z-index:1}
.tp-site .tp-agenda time strong{font-size:18px;font-weight:900}.tp-site .tp-agenda time small{display:block;font-size:12px}
.tp-site .tp-agenda-body{background:var(--tp-paper);border:2px solid var(--tp-line);border-radius:20px;padding:16px 20px;margin-left:12px}
.tp-site .tp-agenda-body>span{color:#2f8a6b;font-size:12px;font-weight:800;letter-spacing:.1em}
.tp-site .tp-agenda-body b{display:block;font-family:"Noto Serif SC",serif;font-size:19px;font-weight:900;margin:2px 0 4px}
.tp-site .tp-agenda-body p{margin:0;color:var(--tp-soft);line-height:1.75}
.tp-site .activity-switch-row{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center;margin-bottom:22px}
.tp-site .activity-view-tabs,.tp-site .activity-day-tabs{display:flex;gap:8px;flex-wrap:wrap}
.tp-site .activity-view-tabs button,.tp-site .activity-day-tabs button{border:2px solid var(--tp-line)!important;background:#fff!important;color:var(--tp-brown)!important;border-radius:999px!important;padding:8px 20px;font-weight:800;font-size:14px;cursor:pointer;box-shadow:none!important}
.tp-site .activity-view-tabs button.active,.tp-site .activity-day-tabs button.active{background:var(--tp-pink)!important;border-color:var(--tp-pink)!important;color:#fff!important}
.tp-site .activity-page-subhead{display:flex;align-items:baseline;justify-content:center;gap:12px;margin:0 0 18px}.tp-site .activity-page-subhead span{color:var(--tp-pink);font-weight:800;letter-spacing:.24em;font-size:12px}.tp-site .activity-page-subhead b{font-family:"Noto Serif SC",serif;font-size:20px}
.tp-site .tp-activity{display:grid;grid-template-columns:240px minmax(0,1fr);gap:22px;padding:18px;margin-bottom:20px;background:var(--tp-paper);border:2px solid var(--tp-line);border-radius:24px;box-shadow:0 12px 26px #5a3d3a14}
.tp-site .tp-activity-visual img{width:100%;border-radius:16px;display:block}
.tp-site .tp-activity-visual:empty{display:none}.tp-site .tp-activity:has(.tp-activity-visual:empty){grid-template-columns:1fr}
.tp-site .tp-activity-tag{display:inline-block;padding:3px 12px;border-radius:999px;background:var(--tp-mint);color:#2f5f4d;font-size:12px;font-weight:800}
.tp-site .tp-activity h3{margin:8px 0;font-family:"Noto Serif SC",serif;font-size:22px;font-weight:900}
.tp-site .tp-activity p{color:var(--tp-soft);line-height:1.8}
/* lineup mirror: who is there */
.tp-site .lineup-strip{display:flex;flex-wrap:wrap;justify-content:center;gap:26px}
.tp-site .lineup-card{display:flex;flex-direction:column;align-items:center;text-align:center;width:150px;text-decoration:none;color:var(--tp-brown)}
.tp-site .lineup-img{width:112px;height:112px;border-radius:50%;overflow:hidden;background:linear-gradient(150deg,#f9d3dc,#dccffa);box-shadow:0 0 0 4px var(--tp-paper),0 0 0 6px var(--tp-pink);display:grid;place-items:center;position:relative}
.tp-site .lineup-img img{width:100%;height:100%;object-fit:cover}
.tp-site .lineup-initial{font-family:"Noto Serif SC",serif;font-size:42px;font-weight:900;color:#ffffffcc}
.tp-site .lineup-card b{margin-top:14px;font-size:17px;font-weight:800}
.tp-site .lineup-card small{margin-top:2px;color:#b0405e;font-weight:800;letter-spacing:.12em;font-size:11px}
.mirror-empty{color:var(--tp-soft);font-size:13px;text-align:center}
.tp-site .ls-more-row,.tp-site .tp-more-row{display:flex;justify-content:center;margin-top:22px}
.tp-site .tp-more{padding:9px 22px;border-radius:999px;background:#fff;border:2px solid var(--tp-line);color:var(--tp-brown);font-weight:800;font-size:14px;text-decoration:none}
/* tickets */
.tp-site .ticket-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;max-width:860px;margin:0 auto}
.tp-site .tp-ticket{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:14px;padding:22px 26px;background:var(--tp-paper);border:2px solid var(--tp-line);border-radius:22px;box-shadow:0 10px 22px #5a3d3a12;color:var(--tp-brown)}
.tp-site .tp-ticket:before{content:"";position:absolute;right:112px;top:12px;bottom:12px;border-left:2px dashed var(--tp-line)}
.tp-site .tp-ticket-main small{display:block;color:var(--tp-pink);font-weight:800;letter-spacing:.14em;font-size:11px}
.tp-site .tp-ticket h3{margin:4px 0 6px;font-size:22px;font-weight:900;color:var(--tp-brown)}
.tp-site .tp-ticket span,.tp-site .tp-ticket .oe-ticket-gift{display:block;color:var(--tp-soft);font-size:14px;line-height:1.7}
.tp-site .tp-ticket-price{width:92px;text-align:center;font-family:"Noto Serif SC",serif;font-size:26px;font-weight:900;color:#b0405e}
.tp-site .ticket-actions{text-align:center;margin-top:22px}
.tp-site .ticket-actions .btn{background:var(--tp-pink);color:#fff;border:0;border-radius:999px;padding:12px 28px;font-weight:800;box-shadow:0 4px 0 #d9728d}
/* map / guests / guide / community / footer */
.tp-site .map-explorer{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:18px}
.tp-site .map-static,.tp-site .map-link-rail{background:var(--tp-paper);border:2px solid var(--tp-line);border-radius:22px;box-shadow:none;color:var(--tp-brown)}
.tp-site .map-link-list a{display:flex;gap:10px;padding:10px 14px;margin-top:8px;border-radius:999px;background:#fff;border:2px solid var(--tp-line);text-decoration:none;color:var(--tp-brown)}
.tp-site .guest-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:22px}
.tp-site .tp-guest{display:grid;grid-template-columns:110px minmax(0,1fr);gap:18px;padding:20px;background:var(--tp-paper);border:2px solid var(--tp-line);border-radius:24px;box-shadow:0 10px 22px #5a3d3a12;align-items:start}
.tp-site .tp-guest-photo .guest-image,.tp-site .tp-guest-photo img{display:block;width:100%;aspect-ratio:1/1;border-radius:50%;object-fit:cover;border:0;padding:0;background:linear-gradient(150deg,#f9d3dc,#dccffa);box-shadow:0 0 0 3px var(--tp-paper),0 0 0 5px var(--tp-pink)}
.tp-site .tp-guest-copy small{color:#b0405e;font-weight:800;letter-spacing:.14em;font-size:11px}
.tp-site .tp-guest-copy b.guest-poster-name{display:block;font-family:"Noto Serif SC",serif;font-size:21px;font-weight:900;margin:2px 0 6px;color:var(--tp-brown)}
.tp-site .tp-guest-copy,.tp-site .tp-guest-copy p,.tp-site .tp-guest-copy .oe-secondary-copy{color:var(--tp-soft);font-size:14px;line-height:1.75}
.tp-site .guide-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.tp-site .guide-grid article,.tp-site .community article{background:var(--tp-paper);border:2px solid var(--tp-line);border-radius:22px;box-shadow:0 10px 22px #5a3d3a12;color:var(--tp-brown);padding:20px}
.tp-site .community{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
.tp-site .footer{margin-top:60px;padding:42px 0 96px;background:#fbe4e9;color:var(--tp-brown);border-top:2px dotted #e3b9c4}
.tp-site .footer h2,.tp-site .footer b{color:var(--tp-brown)}.tp-site .footer a{color:#b0405e}
.tp-site .mobile-dock{background:#fff6ecf2;border-top:2px dotted var(--tp-line);backdrop-filter:blur(8px)}.tp-site .mobile-dock a{color:var(--tp-brown);font-weight:800}
.tp-site .hero-art{min-height:0!important;height:auto!important}
.tp-site #participation .featured-activity-card,.tp-site #participation .featured-activity-card.reveal,.tp-site #participation .featured-activity-card:first-child{display:flex!important;flex-direction:column!important;grid-row:auto!important;grid-column:auto!important;min-height:0!important;height:auto!important}
.tp-site #participation .featured-activity-copy{position:static!important;inset:auto!important;transform:none!important;background:none!important;width:auto!important}
.tp-site #participation .featured-activity-media{position:static!important;width:100%!important;height:auto!important;aspect-ratio:16/10!important}
.tp-site #activities .activity-view-tabs button.active,.tp-site #activities .activity-day-tabs button.active{background:var(--tp-pink)!important;border-color:var(--tp-pink)!important;color:#fff!important}
.tp-site #activities .activity-view-tabs button:not(.active),.tp-site #activities .activity-day-tabs button:not(.active){background:transparent!important}
.tp-site #activities .activity-page-subhead{border-color:var(--tp-line)!important}
.tp-site .tp-site #activities .activity-page-subhead,.tp-site #activities .activity-page-block{border:0!important}
.tp-site .tp-guest-photo{min-width:0}
.tp-site .tp-guest-photo .guest-image,.tp-site .tp-guest-photo .guest-image.empty,.tp-site .tp-guest-photo img{display:block;width:100%!important;max-width:100%!important;aspect-ratio:1/1;border-radius:50%!important;object-fit:cover;border:0!important;padding:0;background:linear-gradient(150deg,#f9d3dc,#dccffa)!important;box-shadow:0 0 0 3px var(--tp-paper),0 0 0 5px var(--tp-pink);min-height:0}
.tp-site #guests .tp-guest-copy b.guest-poster-name{color:var(--tp-brown)!important}
.tp-site .tp-guest-copy .guest-note,.tp-site .tp-guest-copy .guest-related-note{background:#fff5f2!important;border:2px solid var(--tp-line)!important;border-radius:14px!important;box-shadow:none!important}
.tp-site .ticket:before,.tp-site .ticket:after,.tp-site .ticket *:before,.tp-site .ticket *:after{pointer-events:none}
@media(max-width:820px){
 .tp-site .hero-grid{grid-template-columns:minmax(0,1fr);gap:30px}.tp-site .hero-art{order:-1;max-width:260px}
 .tp-site .hero-copy{padding:30px 22px 26px}
 .tp-site .nav .links{display:none}.tp-site .nav .wrap>.btn{margin-left:auto;padding:9px 16px}
 .tp-site .tp-activity{grid-template-columns:1fr}.tp-site .map-explorer{grid-template-columns:1fr}
 .tp-site .tp-agenda{grid-template-columns:78px minmax(0,1fr);gap:10px}.tp-site .tp-agenda:before{left:84px}.tp-site .tp-agenda time strong{font-size:15px}
 .tp-site .timeline-row{grid-template-columns:70px minmax(0,1fr);gap:4px 12px}.tp-site .timeline-row:before{left:76px}.tp-site .timeline-row time{font-size:14px;padding:5px 9px}
 .tp-site .tp-guest{grid-template-columns:88px minmax(0,1fr)}
 .tp-site .tp-ticket{grid-template-columns:minmax(0,1fr)}.tp-site .tp-ticket:before{display:none}.tp-site .tp-ticket-price{width:auto;text-align:left}
 .tp-site .head .section-back{position:static;margin-top:6px}
}`;

const more=(page,text)=>'<div class="tp-more-row"><a class="tp-more" href="#'+page+'" data-target-mode="page" data-page-link="'+page+'">'+text+' →</a></div>';
const agendaSection=coreSection('activities',{ey:'AGENDA',title:'当天流程'})
  .replace('>日程<','>流程<').replace('<b>当天日程</b>','<b>当天流程</b>').replace('<span>SCHEDULE</span>','<span>PROGRAM</span>')
  .replace('>活动详情<','>活动介绍<').replace('<b>活动详情</b>','<b>每个活动怎么玩</b>');

/* hero composition: what the first screen is built from differs from every other template */
const heroStyle=`
.tp-site .hero-grid{grid-template-columns:minmax(0,1fr);max-width:780px;gap:0;justify-items:center}
.tp-site .hero-art{order:0;width:230px;max-width:230px;margin:0 auto -120px;position:relative;z-index:3}
.tp-site .hero-copy{order:1;width:100%;padding:150px 40px 36px;text-align:center}
.tp-site .meta,.tp-site .tp-cta{justify-content:center}.tp-site .hero p{margin-left:auto;margin-right:auto}
@media(max-width:820px){.tp-site .hero-art{max-width:190px;width:190px;margin-bottom:-96px}.tp-site .hero-copy{padding:120px 22px 28px}}
`;
/* animate cafe event pages: ruled tab row, centred key-visual card with a dates table, status circle, arched card panel, floating reserve badge */
const referenceStyle=`
.tp-site .nav{height:auto;padding:14px 0 0;background:#fffdf8;border-bottom:3px solid var(--tp-brown)}
.tp-site .nav .wrap{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 18px}
.tp-site .nav .links{order:3;flex:1 1 100%;display:flex;justify-content:center;gap:0;margin:0;border-top:1px solid var(--tp-line)}
.tp-site .nav .links a{padding:12px 22px;font-weight:900;letter-spacing:.12em;font-size:12px;text-transform:uppercase;border-radius:0}
.tp-site .nav .links a:hover{background:none;box-shadow:inset 0 -3px 0 var(--tp-pink)}
.tp-site .hero{padding:34px 0 20px}
.tp-site .hero-grid{max-width:900px;gap:0;justify-items:center}
.tp-title{background:none!important;border:0!important;box-shadow:none!important;padding:0!important;text-align:center;width:100%}
.tp-title:before{display:none!important}
.tp-site .hero h1{font-size:clamp(34px,6.4vw,80px);letter-spacing:.02em;margin:6px 0 20px}
.tp-site .hero-art{order:0;width:min(640px,100%);max-width:640px;margin:0 auto 22px;aspect-ratio:16/10;position:relative;z-index:1}
.tp-site .hero-art:before,.tp-site .hero-art:after{display:none}
.tp-site .kv{border-radius:10px;box-shadow:0 0 0 8px #fff,0 0 0 11px var(--tp-brown)}
.tp-kv-fallback{padding:8%;font-size:clamp(30px,5vw,60px)}
.tp-detail{order:1;background:none!important;border:0!important;box-shadow:none!important;padding:0!important;text-align:center;width:100%;max-width:640px}
.tp-detail:before{display:none!important}
.tp-rows{display:block!important;margin:0 0 20px;border:2px solid var(--tp-brown);border-radius:10px;overflow:hidden;background:#fff}
.tp-row{display:grid;grid-template-columns:92px minmax(0,1fr);text-align:left;border-top:1px solid var(--tp-line)}.tp-row:first-child{border-top:0}
.tp-row b{background:var(--tp-rose);padding:10px 14px;font-size:13px}
.tp-row .pill{border:0;background:none;border-radius:0;padding:10px 14px;font-weight:700}
.tp-site .tp-cta{justify-content:center}
.tp-site #participation{background:var(--tp-rose);border-radius:90px 90px 0 0 / 40px 40px 0 0;margin-top:46px;padding:46px 0 60px}
.tp-site #participation .head:before{content:"今日";display:grid;place-items:center;width:64px;height:64px;border-radius:50%;background:#ffe27a;color:#6b4a00;font-weight:900;font-size:20px;margin:0 auto 12px}
.tp-reserve{position:fixed;right:18px;bottom:84px;z-index:60;width:104px;height:104px;border-radius:50%;background:var(--tp-brown);color:#fff;display:grid;place-content:center;text-align:center;text-decoration:none;box-shadow:0 0 0 4px var(--tp-brown),0 0 0 6px #fff inset,0 10px 22px #0003}
.tp-reserve:before{content:"";position:absolute;inset:6px;border-radius:50%;border:2px dotted #ffffffaa}
.tp-reserve b{font-size:13px;letter-spacing:.08em;color:#ffe27a;position:relative}.tp-reserve small{font-size:11px;position:relative}
.tp-site .tp-title{order:-1}
.tp-site .featured-activity-grid{grid-template-rows:none!important;grid-auto-rows:auto!important;align-items:start}
.tp-site #participation .featured-activity-card,.tp-site #participation .featured-activity-card:first-child{grid-row:auto!important;grid-column:auto!important;height:auto!important;min-height:0!important}
@media(max-width:820px){.tp-site .nav .links{overflow:auto;justify-content:flex-start}.tp-site .nav .links a{padding:10px 14px}.tp-reserve{width:84px;height:84px;right:10px;bottom:76px}.tp-reserve b{font-size:11px}}
`;
export const previewStyle=coreStyle+style+heroStyle+referenceStyle;
export const previewBody=`<div class="tp-site">
<header class="nav"><div class="wrap"><a class="brand" href="#top" data-oe-field="eventName">STARDUST ONLY</a><nav class="links" data-oe-mount="nav-links"><a href="#home" data-page-link="home">首页</a><a href="#activities" data-target-mode="page" data-page-link="activities">当天流程</a><a href="#guests" data-target-mode="page" data-page-link="guests">同席的人</a><a href="#tickets">报名</a><a href="#guide" data-target-mode="page" data-page-link="guide">须知</a></nav><a class="btn ticket-purchase-link" href="#" target="_blank" rel="noopener">去报名 ↗</a></div></header>
<main id="top">
<section class="hero"><div class="wrap hero-grid"><div class="hero-copy tp-title"><span class="hero-kicker">TEA PARTY · 茶会邀请</span><h1 data-oe-field="eventName">STARDUST ONLY</h1></div><div class="hero-art"><div class="kv"><strong class="tp-kv-fallback" data-oe-field="eventName">STARDUST ONLY</strong></div></div><div class="hero-copy tp-detail"><p data-oe-field="tagline"></p><div class="meta tp-rows"><div class="tp-row"><b>日期</b><span class="pill" data-oe-field="date"></span></div><div class="tp-row"><b>地点</b><span class="pill" data-oe-field="location"></span></div><div class="tp-row"><b>详情</b><a class="pill venue-nav" href="#map-home" data-oe-field="edition"></a></div></div><div class="tp-cta"><a class="tp-btn pink ticket-purchase-link" href="#tickets">去报名</a><a class="tp-btn" href="#today">看今天玩什么</a></div></div></div></section>
${coreSection('updates').replace('class="updates-strip"','class="updates-strip oe-home-only"').replace('<div class="wrap">','<div class="wrap">'+head('NOTICE','茶会通知'))}
<div id="today">${coreSection('participation',{ey:"TODAY'S MENU",title:'今天玩什么'})}</div>
<section class="section oe-home-only" id="timetable"><div class="wrap">${head('TIMETABLE','当天流程')}<div class="timeline" data-oe-mirror="timetable"></div>${more('activities','查看完整流程')}</div></section>
<section class="section oe-home-only" id="lineup"><div class="wrap">${head("WHO'S THERE",'今天同席的人')}<div class="lineup-strip" data-oe-mirror="lineup"></div>${more('guests','全部介绍')}</div></section>
${coreSection('tickets',{ey:'ENTRY',title:'参加方式'})}
${coreSection('map-home',{ey:'PLACE',title:'场地'})}
${agendaSection}
${coreSection('guests',{ey:'MEMBERS',title:'同席的人'})}
${coreSection('guide',{ey:'NOTICE',title:'参加须知'})}
${coreSection('community',{ey:'CONTACT',title:'联系与交流'})}
</main>
<a class="tp-reserve ticket-purchase-link" href="#tickets"><b>RESERVE</b><small>点这里报名</small></a>
<nav class="mobile-dock"><a href="#home" data-page-link="home">首页</a><a href="#activities" data-target-mode="page" data-page-link="activities">流程</a><a href="#guests" data-target-mode="page" data-page-link="guests">同席</a><a href="#guide" data-target-mode="page" data-page-link="guide">须知</a></nav>
<footer class="footer"><div class="wrap footer-grid"><div class="footer-brand"></div><div class="footer-participate"></div><div class="footer-visit"></div><div class="footer-social"></div></div></footer>
</div>`;
