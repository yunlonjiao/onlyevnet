/* Template 06 · 乐队演出: a live-house flyer. Black-and-white photocopy texture, one fluorescent
   yellow, big band names and set times. The visual language follows Japanese band-anime live pages
   (BanG Dream!, Bocchi the Rock!) and hand-made live-house flyers. Hooks follow Template 01;
   everything visual is scoped to .bl-site. */
import {coreStyle,coreSection,coreRibbon,head,ownMapSection,ownCommunitySection,ownSponsorsSection} from '/v8/templates/shared-sections.js?v=8.52.0';

const style=`
.bl-site{overflow-x:clip;--primary:#ffd500;--secondary:#ff3b3b;--bl-ink:#101010;--bl-paper:#f2efe6;--bl-yellow:#ffd500;--bl-red:#ff3b3b;--bl-gray:#6b6b66;--bl-line:#101010;
 position:relative;min-height:100vh;color:var(--bl-ink);font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif;
 background-color:var(--bl-paper);background-image:radial-gradient(circle,#1010100f 1px,transparent 1.2px),repeating-linear-gradient(0deg,#10101006 0 2px,transparent 2px 5px);background-size:7px 7px,auto}
.bl-site .wrap{max-width:1160px;margin:0 auto;padding:0 22px}
.bl-site a{color:inherit}
.bl-site h1,.bl-site .head h2,.bl-site .lineup-card b,.bl-site .bl-band-copy b,.bl-site .bl-ticket-price{font-family:Impact,"Arial Black","Noto Sans SC",sans-serif}
/* header */
.bl-site .nav{position:sticky;top:0;z-index:40;height:60px;background:var(--bl-ink);border:0;box-shadow:none}
.bl-site .nav .wrap{height:100%;display:flex;align-items:center;gap:20px}
.bl-site .brand{font-family:Impact,"Arial Black",sans-serif;font-size:22px;letter-spacing:.04em;color:var(--bl-yellow);border:0;background:none;padding:0;box-shadow:none;text-transform:uppercase}
.bl-site .nav .links{display:flex;gap:2px;margin-left:auto}
.bl-site .nav .links a{padding:8px 13px;color:#fff;font-size:13px;font-weight:800;border:0;background:none;border-radius:0;white-space:nowrap}
.bl-site .nav .links a:hover{background:var(--bl-yellow);color:var(--bl-ink)}
.bl-site .nav .wrap>.btn{background:var(--bl-yellow);color:var(--bl-ink);border:0;border-radius:0;padding:9px 20px;font-size:13px;font-weight:900;box-shadow:none;white-space:nowrap;transform:rotate(-2deg)}
/* hero: a photocopied flyer */
.bl-site .hero{min-height:0;padding:50px 0 54px;background:var(--bl-ink);color:#fff;display:block;overflow:hidden;position:relative}
.bl-site .hero:before{content:"";display:block;position:absolute;inset:0;background:radial-gradient(circle,#ffffff1c 1.4px,transparent 1.6px) 0 0/9px 9px;pointer-events:none}
.bl-site .hero:after{content:"";display:block;position:absolute;left:0;right:0;bottom:0;height:14px;background:repeating-linear-gradient(135deg,var(--bl-yellow) 0 14px,var(--bl-ink) 14px 28px)}
.bl-site .hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:44px;align-items:center}
.bl-site .event-status-badge{display:inline-block;margin:0 8px 14px 0;padding:4px 12px;background:var(--bl-red);color:#fff;font-size:12px;font-weight:900;letter-spacing:.1em;vertical-align:top;border-radius:0}
.bl-site .hero-kicker{display:inline-block;margin-bottom:14px;padding:4px 12px;background:var(--bl-yellow);color:var(--bl-ink);font-size:12px;font-weight:900;letter-spacing:.2em;transform:rotate(-2deg)}
.bl-site .hero h1{margin:0 0 14px;font-size:clamp(46px,min(11vw,6vw + 16px),104px);line-height:.92;font-weight:400;letter-spacing:.01em;text-transform:uppercase;color:#fff;overflow-wrap:anywhere;text-shadow:5px 5px 0 var(--bl-red)}
.bl-site .hero p{margin:0 0 20px;max-width:520px;color:#d9d6cc;font-size:16px;line-height:1.8}
.bl-site .meta{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px}
.bl-site .pill{border:2px solid #fff;background:none;color:#fff;border-radius:0;padding:6px 14px;font-size:13px;font-weight:800;box-shadow:none}
.bl-site .bl-cta{display:flex;flex-wrap:wrap;gap:12px}
.bl-site .bl-btn{display:inline-block;padding:13px 28px;font-weight:900;font-size:15px;text-decoration:none;background:none;color:#fff;border:2px solid #fff}
.bl-site .bl-btn.yellow{background:var(--bl-yellow);border-color:var(--bl-yellow);color:var(--bl-ink);transform:rotate(-1.5deg)}
.bl-site .hero-art{position:relative;aspect-ratio:4/5;max-height:560px;width:100%;min-height:0!important;transform:rotate(2deg)}
.bl-site .kv{position:absolute;inset:0;border:6px solid #fff;border-radius:0;box-shadow:0 16px 30px #0009;background-color:#2a2a2a;background-image:var(--oe-hero-image-desktop),linear-gradient(160deg,#3a3a3a,#111);background-size:cover;background-position:center;filter:grayscale(.9) contrast(1.15)}
.bl-site .kv:before,.bl-site .kv:after{display:none}
.bl-site .kv.empty{background-image:repeating-linear-gradient(-45deg,#ffffff14 0 12px,transparent 12px 24px),linear-gradient(160deg,#3a3a3a,#111)!important}
.bl-kv-fallback{display:none;position:absolute;inset:0;align-items:center;justify-content:center;padding:20px;text-align:center;font-family:Impact,"Arial Black",sans-serif;font-size:clamp(34px,6vw,70px);line-height:.95;text-transform:uppercase;color:#fff;overflow-wrap:anywhere}
.bl-site .kv.empty .bl-kv-fallback{display:flex}
.bl-site .hero-art:before{content:"";position:absolute;left:-18px;top:-12px;width:110px;height:30px;background:#ffd500d9;transform:rotate(-24deg);z-index:2}
.bl-site .hero-art:after{content:"";position:absolute;right:-16px;bottom:-10px;width:110px;height:30px;background:#ffd500d9;transform:rotate(-24deg);z-index:2}
.bl-site .ribbon{background:var(--bl-yellow);color:var(--bl-ink);border:0;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin:0;transform:none}
/* sections */
.bl-site .section{padding:58px 0 14px;background:none;border:0}
.bl-site .section.alt{background:none}
.bl-site .head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:24px;border:0!important;padding-bottom:0!important}
.bl-site .head h2{margin:0;font-size:clamp(34px,4.4vw,56px);font-weight:400;line-height:1;letter-spacing:.02em;color:var(--bl-ink);text-transform:uppercase;position:relative;display:inline-block;padding-bottom:6px}
.bl-site .head h2:after{content:"";position:absolute;left:0;right:-10px;bottom:0;height:10px;background:var(--bl-yellow);z-index:-1}
.bl-site .head .ey{display:block;margin:0 0 4px;color:var(--bl-red)!important;background:none;border:0;padding:0;font-size:12px;font-weight:900;letter-spacing:.26em}
.bl-site .section-back,.bl-more{background:var(--bl-ink)!important;color:#fff!important;border:0!important;border-radius:0!important;padding:8px 16px;font-weight:800;font-size:13px;text-decoration:none;box-shadow:none!important;white-space:nowrap}
.bl-more-row{display:flex;justify-content:flex-end;margin-top:20px}
/* BANDS mirror (home): big names in a column */
.bl-site .lineup-strip{display:flex;flex-direction:column;border-top:4px solid var(--bl-ink)}
.bl-site .lineup-card{display:grid;grid-template-columns:84px minmax(0,1fr) auto;gap:18px;align-items:center;padding:14px 6px;border-bottom:2px solid var(--bl-ink);text-decoration:none;color:var(--bl-ink);transition:background .15s,padding .15s}
.bl-site .lineup-card:hover{background:var(--bl-yellow);padding-left:16px}
.bl-site .lineup-img{width:84px;height:84px;background:#222;position:relative;overflow:hidden;display:grid;place-items:center;filter:grayscale(1) contrast(1.1)}
.bl-site .lineup-img img{width:100%;height:100%;object-fit:cover}
.bl-site .lineup-initial{font-family:Impact,sans-serif;font-size:44px;color:#ffffff88}
.bl-site .lineup-card b{font-size:clamp(26px,4vw,44px);font-weight:400;line-height:1;text-transform:uppercase;overflow-wrap:anywhere}
.bl-site .lineup-card small{font-size:12px;font-weight:900;letter-spacing:.18em;color:var(--bl-gray)}
/* SET TIMES mirror (home) and set page */
.bl-site .timeline-day h3{display:inline-block;margin:0 0 12px;padding:4px 16px;background:var(--bl-ink);color:var(--bl-yellow);font-family:Impact,sans-serif;font-size:20px;font-weight:400;letter-spacing:.12em}
.bl-site .timeline-row{display:grid;grid-template-columns:130px minmax(0,1fr);gap:4px 20px;align-items:center;padding:12px 0;border-bottom:2px dashed #10101055;text-decoration:none;color:var(--bl-ink)}
.bl-site .timeline-row time{display:inline-block;padding:4px 10px;background:var(--bl-ink);color:var(--bl-yellow);font-family:Impact,sans-serif;font-size:26px;letter-spacing:.04em;text-align:center}
.bl-site .timeline-row time small{display:inline;margin-left:6px;font-size:14px;color:#ffffffaa}.bl-site .timeline-row time small:before{content:"– "}
.bl-site .timeline-stage{display:none}
.bl-site .timeline-row b{grid-column:2;font-size:20px;font-weight:900;text-transform:uppercase}
.bl-site .timeline-row:hover b{background:var(--bl-yellow)}
.bl-site .bl-set{display:grid;grid-template-columns:170px minmax(0,1fr);border:2px solid var(--bl-ink);margin-bottom:14px;background:#fffdf5;box-shadow:none}
.bl-site .bl-set-time{background:var(--bl-ink);color:var(--bl-yellow);padding:16px;display:flex;flex-direction:column;justify-content:center}
.bl-site .bl-set-time strong{font-family:Impact,sans-serif;font-size:36px;font-weight:400;letter-spacing:.03em}
.bl-site .bl-set-time small{color:#ffffffaa;font-size:14px;margin-top:2px}.bl-site .bl-set-time small:before{content:"– "}
.bl-site .bl-set-body{padding:16px 20px}
.bl-site .bl-set-body>span{color:var(--bl-red);font-size:12px;font-weight:900;letter-spacing:.18em}
.bl-site .bl-set-body b{display:block;font-size:22px;font-weight:900;margin:2px 0 4px;text-transform:uppercase}
.bl-site .bl-set-body p{margin:0;color:#4a4a46;line-height:1.75}
.bl-site .activity-switch-row{display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin-bottom:22px}
.bl-site .activity-view-tabs,.bl-site .activity-day-tabs{display:flex;gap:6px;flex-wrap:wrap}
.bl-site .activity-page-subhead{display:flex;align-items:baseline;gap:12px;margin:0 0 16px}.bl-site .activity-page-subhead span{color:var(--bl-red);font-weight:900;letter-spacing:.24em;font-size:12px}.bl-site .activity-page-subhead b{font-size:20px}
.bl-site .bl-activity{border:2px solid var(--bl-ink);background:#fffdf5;margin-bottom:16px;box-shadow:none}
.bl-site .bl-activity>header{display:flex;gap:12px;align-items:center;padding:8px 16px;background:var(--bl-ink);color:#fff;font-weight:900;letter-spacing:.14em;font-size:12px}
.bl-site .bl-activity>header span{color:var(--bl-yellow);font-family:Impact,sans-serif;font-size:18px;letter-spacing:.06em}
.bl-site .bl-activity-body{display:grid;grid-template-columns:200px minmax(0,1fr);gap:18px;padding:18px}
.bl-site .bl-activity-visual:empty{display:none}.bl-site .bl-activity-body:has(.bl-activity-visual:empty){grid-template-columns:1fr}
.bl-site .bl-activity-visual img{width:100%;display:block;filter:grayscale(.6)}
.bl-site .bl-activity h3{margin:0 0 8px;font-size:22px;font-weight:900}
.bl-site .bl-activity p{color:#4a4a46;line-height:1.75}
/* updates / featured */
.bl-site .updates-strip{background:none;border:0;padding:44px 0 0}
.bl-site .updates-list{display:flex;flex-direction:column}
.bl-site .bl-update{display:grid;grid-template-columns:90px minmax(0,1fr) 24px;gap:14px;align-items:center;padding:12px 4px;border-bottom:2px solid var(--bl-ink);text-decoration:none;color:var(--bl-ink)}
.bl-site .bl-update:hover{background:var(--bl-yellow)}
.bl-site .bl-update time{font-family:Impact,sans-serif;font-size:18px;letter-spacing:.04em}.bl-site .bl-update b{font-weight:900}
.bl-site .featured-activity-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px}
.bl-site #participation .featured-activity-card,.bl-site #participation .featured-activity-card.reveal,.bl-site #participation .featured-activity-card:first-child{display:flex!important;flex-direction:column!important;grid-row:auto!important;grid-column:auto!important;min-height:0!important;height:auto!important;background:#fffdf5!important;color:var(--bl-ink)!important;border:2px solid var(--bl-ink)!important;border-radius:0!important;box-shadow:none!important;text-decoration:none;overflow:hidden}
.bl-site #participation .featured-activity-media,.bl-site #participation .featured-activity-media.is-empty{position:static!important;width:100%!important;height:auto!important;aspect-ratio:16/9!important;background:repeating-linear-gradient(-45deg,#10101012 0 10px,transparent 10px 20px),#e4e0d2!important;color:var(--bl-gray)!important;display:grid;place-items:center;font-size:12px;font-weight:900;letter-spacing:.2em;border:0!important}
.bl-site #participation .featured-activity-media img{width:100%;height:100%;object-fit:cover;display:block;filter:grayscale(.6)}
.bl-site #participation .featured-activity-copy{position:static!important;transform:none!important;background:none!important;width:auto!important;padding:14px 18px 18px;display:flex;flex-direction:column;gap:6px}
.bl-site #participation .featured-activity-copy h3,.bl-site #participation .featured-activity-copy b{color:var(--bl-ink)!important;font-size:20px;font-weight:900;margin:0}
.bl-site #participation .featured-activity-copy p{color:#4a4a46!important;margin:0}
.bl-site #participation .featured-activity-kicker{color:var(--bl-red)!important;font-weight:900;letter-spacing:.16em;font-size:12px}
.bl-site #participation .featured-activity-link{color:var(--bl-ink)!important;font-weight:900;text-decoration:underline}
/* tickets */
.bl-site .ticket-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px}
.bl-site .bl-ticket{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 16px;align-items:center;padding:20px 20px 20px 36px;background:#fffdf5;border:2px solid var(--bl-ink);box-shadow:none;color:var(--bl-ink)}
.bl-site .bl-ticket:before{content:"";position:absolute;left:14px;top:10px;bottom:10px;border-left:3px dotted var(--bl-ink)}
.bl-site .bl-ticket-tag{grid-column:1/-1;font-size:11px;font-weight:900;letter-spacing:.22em;color:var(--bl-red)}
.bl-site .bl-ticket h3{margin:0 0 4px;font-size:21px;font-weight:900;color:var(--bl-ink)}
.bl-site .bl-ticket span,.bl-site .bl-ticket .oe-ticket-gift{display:block;color:#4a4a46;font-size:14px;line-height:1.7}
.bl-site .bl-ticket-price{font-size:40px;line-height:1;color:var(--bl-ink);background:var(--bl-yellow);padding:6px 12px;transform:rotate(-2deg)}
.bl-site .ticket-actions{margin-top:20px}.bl-site .ticket-actions .btn{background:var(--bl-ink);color:var(--bl-yellow);border:0;border-radius:0;padding:13px 28px;font-weight:900;box-shadow:none}
/* map / guests page / guide / community / footer */
.bl-site .guest-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px}
.bl-site .bl-band{position:relative;display:grid;grid-template-columns:130px minmax(0,1fr);gap:16px;padding:16px;background:#fffdf5;border:2px solid var(--bl-ink);box-shadow:none}
.bl-site .bl-band-no{position:absolute;right:12px;top:6px;font-family:Impact,sans-serif;font-size:40px;color:#10101022}
.bl-site .bl-band-photo .guest-image,.bl-site .bl-band-photo img{display:block;width:100%;aspect-ratio:3/4;object-fit:cover;border:0;padding:0;background:#222;filter:grayscale(1) contrast(1.1)}
.bl-site .bl-band-copy small{color:var(--bl-red);font-weight:900;letter-spacing:.18em;font-size:11px}
.bl-site .bl-band-copy b.guest-poster-name{display:block;font-size:26px;font-weight:400;line-height:1.05;margin:2px 0 6px;text-transform:uppercase;color:var(--bl-ink)}
.bl-site .bl-band-copy,.bl-site .bl-band-copy p,.bl-site .bl-band-copy .oe-secondary-copy{color:#4a4a46;font-size:14px;line-height:1.7}
.bl-site #guests .bl-band-copy b.guest-poster-name{color:var(--bl-ink)!important}
.bl-site .guide-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px}
.bl-site .guide-grid article{background:#fffdf5;border:2px solid var(--bl-ink);border-radius:0;box-shadow:none;color:var(--bl-ink);padding:18px}
.bl-site .footer{margin-top:60px;padding:42px 0 96px;background:var(--bl-ink);color:#d9d6cc;border-top:14px solid var(--bl-yellow)}
.bl-site .footer h2,.bl-site .footer b{color:#fff}.bl-site .footer a{color:var(--bl-yellow)}
.bl-site .mobile-dock{background:var(--bl-ink);border-top:3px solid var(--bl-yellow)}.bl-site .mobile-dock a{color:#fff;font-weight:900}
.bl-site #activities .activity-view-tabs button,.bl-site #activities .activity-day-tabs button{background:#fff!important;color:var(--bl-ink)!important;border:2px solid var(--bl-ink)!important;border-radius:0!important;padding:8px 18px;font-weight:900;box-shadow:none!important}
.bl-site #activities .activity-view-tabs button.active,.bl-site #activities .activity-day-tabs button.active{background:var(--bl-yellow)!important}
.bl-site #activities .activity-page-subhead{border-color:var(--bl-ink)!important}
.bl-site .updates-strip .wrap{width:100%}
.bl-site .featured-activity-grid{grid-template-rows:none!important;grid-auto-rows:auto!important;align-items:start}
.bl-site .bl-band-photo{min-width:0}
.bl-site .bl-band-photo .guest-image,.bl-site .bl-band-photo .guest-image.empty{width:100%!important;max-width:100%!important;aspect-ratio:3/4;background:linear-gradient(160deg,#3a3a3a,#111)!important;border:0!important;border-radius:0!important;min-height:0;color:#ffffff66}
.bl-site .bl-band-copy .guest-note,.bl-site .bl-band-copy .guest-related-note{background:#f2efe6!important;border:2px solid var(--bl-ink)!important;border-radius:0!important;box-shadow:none!important;color:var(--bl-ink)}
.bl-site #guests .bl-band-copy .guest-note b{color:var(--bl-red)!important}
.bl-site .bl-site #activities .activity-page-subhead,.bl-site #activities .activity-page-block{border:0!important}
.bl-site .ribbon{background:var(--bl-ink);color:var(--bl-yellow);border-top:3px solid var(--bl-yellow);border-bottom:3px solid var(--bl-yellow);font-family:Impact,sans-serif;font-weight:400;letter-spacing:.2em}
.bl-site .bl-set,.bl-site .bl-activity,.bl-site .bl-band,.bl-site .bl-ticket,.bl-site #participation .featured-activity-card{position:relative}
.bl-site .bl-set:before,.bl-site .bl-band:before,.bl-site .bl-ticket:after,.bl-site #participation .featured-activity-card:before{content:"";position:absolute;top:-9px;right:22px;width:64px;height:18px;background:#ffd500cc;transform:rotate(3deg);z-index:2;border:0}
.bl-site .head h2:after{height:6px;bottom:2px}
.bl-site .ticket:before,.bl-site .ticket:after,.bl-site .ticket *:before,.bl-site .ticket *:after{pointer-events:none}
.bl-site .nav{height:72px}
.bl-site .nav .wrap>.btn{border-radius:8px}
.bl-site .kv{border-radius:4px}
.bl-site .hero h1{font-size:clamp(40px,min(10vw,5vw + 12px),76px)}
.bl-site .bl-ticket{border-width:3px}
@media(max-width:820px){
 .bl-site .hero-grid{grid-template-columns:minmax(0,1fr)}.bl-site .hero-art{order:-1;aspect-ratio:16/11;max-height:none}
 .bl-site .nav .links{display:none}.bl-site .nav .wrap>.btn{margin-left:auto}
 .bl-site .lineup-card{grid-template-columns:64px minmax(0,1fr);gap:14px}.bl-site .lineup-img{width:64px;height:64px}.bl-site .lineup-card small{display:none}
 .bl-site .timeline-row{grid-template-columns:104px minmax(0,1fr)}.bl-site .timeline-row time{font-size:20px}.bl-site .timeline-row b{font-size:16px}
 .bl-site .bl-set{grid-template-columns:1fr}.bl-site .bl-set-time{flex-direction:row;align-items:baseline;gap:10px}
 .bl-site .bl-activity-body{grid-template-columns:1fr}
 .bl-site .bl-band{grid-template-columns:100px minmax(0,1fr)}.bl-site .bl-update{grid-template-columns:64px minmax(0,1fr)}.bl-site .bl-update i{display:none}
}`;

const more=(page,text)=>'<div class="bl-more-row"><a class="bl-more" href="#'+page+'" data-target-mode="page" data-page-link="'+page+'">'+text+' →</a></div>';
const setSection=coreSection('activities',{ey:'SET TIMES',title:'出场顺序'})
  .replace('>日程<','>出场顺序<').replace('<b>当天日程</b>','<b>当晚出场顺序</b>').replace('<span>SCHEDULE</span>','<span>RUNNING ORDER</span>')
  .replace('>活动详情<','>物贩与交流<').replace('<b>活动详情</b>','<b>物贩与交流</b>');

/* hero composition: what the first screen is built from differs from every other template */
const heroStyle=`
.bl-site .hero{padding:44px 0 58px}
.bl-site .hero-grid{grid-template-columns:minmax(0,1fr);gap:26px;align-items:start}
.bl-site .hero h1{font-size:clamp(52px,12.4vw,176px);line-height:.86;margin:0}
.bl-site .hero-art{order:0;aspect-ratio:21/8;max-height:none;width:100%;transform:rotate(-1.2deg)}
.bl-site .hero-info{display:grid;grid-template-columns:minmax(0,1.2fr) auto;gap:16px 40px;align-items:center}
.bl-site .hero-info p{margin:0;grid-column:1}.bl-site .hero-info .meta{margin:0;grid-column:1}.bl-site .hero-info .bl-cta{grid-column:2;grid-row:1 / span 2;justify-content:flex-end}
@media(max-width:820px){.bl-site .hero-art{order:0;aspect-ratio:16/10}.bl-site .hero-info{grid-template-columns:minmax(0,1fr)}.bl-site .hero-info .bl-cta{grid-column:1;grid-row:auto;justify-content:flex-start}}
`;
/* Shinjuku LOFT schedule pages: black bar, ink-spattered paper, vertical date rail, flyer as the picture */
const referenceStyle=`
.bl-site{background-color:#fff;background-image:radial-gradient(circle at 12% 18%,#111 0 1.2px,transparent 1.6px),radial-gradient(circle at 78% 33%,#111 0 .9px,transparent 1.3px),radial-gradient(circle at 44% 71%,#111 0 1.6px,transparent 2px),radial-gradient(circle at 90% 88%,#111 0 1px,transparent 1.4px),radial-gradient(circle at 25% 52%,#111 0 .7px,transparent 1.1px);background-size:310px 270px,270px 330px,420px 380px,360px 300px,190px 220px}
.bl-site .nav{height:62px;background:#000;border:0}
.bl-site .nav .links a{text-transform:uppercase;letter-spacing:.14em;font-size:11px;font-weight:700}
.bl-site .brand{font-style:italic;letter-spacing:.02em}
.bl-site .hero{background:transparent;color:#111;padding:34px 0 40px}
.bl-site .hero:before,.bl-site .hero:after{display:none}
.bl-site .hero-grid{grid-template-columns:96px minmax(0,1fr) minmax(0,.72fr);gap:34px;align-items:stretch}
.bl-rail{display:flex;flex-direction:column;align-items:center;gap:14px;border-right:2px solid #111;padding-right:20px}
.bl-rail-label{writing-mode:vertical-rl;font-size:11px;font-weight:900;letter-spacing:.34em}
.bl-rail b{writing-mode:vertical-rl;font-family:Impact,"Arial Black",sans-serif;font-size:30px;font-weight:400;letter-spacing:.06em;line-height:1.1}
.bl-rail small{writing-mode:vertical-rl;font-size:10px;letter-spacing:.3em;color:#555;margin-top:auto}
.bl-site .hero-copy{align-self:center}
.bl-site .hero h1{color:#111;text-shadow:none;font-size:clamp(40px,6.4vw,100px);margin:0 0 14px}
.bl-site .hero p{color:#333;margin:0 0 16px}
.bl-site .hero-kicker{background:#111;color:#fff;transform:none}
.bl-site .event-status-badge{background:#111;color:#fff}
.bl-site .pill{border-color:#111;color:#111;background:none}
.bl-site .bl-btn{color:#111;border-color:#111}.bl-site .bl-btn.yellow{background:#111;color:#fff;transform:none}
.bl-site .hero-art{order:0;aspect-ratio:3/4;max-height:560px;width:100%;transform:rotate(1.6deg);align-self:center}
.bl-site .kv{border:0;box-shadow:none;background-size:cover}
.bl-site .hero-art{filter:drop-shadow(0 14px 22px #0006)}
.bl-kv-fallback{font-size:clamp(30px,4.4vw,64px)}
.bl-site .ribbon{margin:0}
@media(max-width:820px){.bl-site .hero-grid{grid-template-columns:64px minmax(0,1fr);gap:18px}.bl-site .hero-art{grid-column:1 / -1;order:3;aspect-ratio:4/5;max-height:none;transform:none}.bl-rail{padding-right:12px}.bl-rail b{font-size:22px}}

/* skeleton: a printed schedule. Thick rules between sections, a poster-size heading, and list rows with big index numbers instead of cards */
.bl-site .section{padding:0 0 44px;margin:0;border:0;border-top:10px solid #111;background:transparent}
.bl-site .section>.wrap{width:min(1180px,calc(100% - 48px));max-width:none;padding:0;margin:0 auto}
.bl-site .section .head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin:0 0 6px;padding:26px 0 10px;border:0;border-bottom:4px solid #111}
.bl-site .section .head>div{display:flex;align-items:flex-end;gap:16px;flex-wrap:wrap}
.bl-site .section .head h2{font-family:Impact,"Arial Black","PingFang SC","Microsoft YaHei",sans-serif;font-weight:400;font-size:clamp(36px,5.4vw,72px);line-height:.95;letter-spacing:.02em;text-transform:uppercase;margin:0;color:#111;text-shadow:none;transform:none}
.bl-site .section .head .ey{order:2;background:#111;color:#fff;padding:3px 10px;font-size:11px;letter-spacing:.2em;transform:rotate(-2deg);margin-bottom:8px}
.bl-site .section-orbit,.bl-site .section-no{display:none}
.bl-site .lineup,.bl-site .guest-grid{display:block;counter-reset:band}
.bl-site .lineup-card,.bl-site .guest-card{counter-increment:band;display:grid;grid-template-columns:72px minmax(0,1fr) auto;align-items:center;gap:18px;padding:16px 0;border:0;border-bottom:2px solid #111;border-radius:0;background:none;box-shadow:none;transform:none}
.bl-site .lineup-card:before,.bl-site .guest-card:before{content:counter(band,decimal-leading-zero);font:400 38px Impact,"Arial Black",sans-serif;color:#111;opacity:.28}
.bl-site .lineup-card .lineup-img{display:none}
.bl-site .lineup-card b{font-size:clamp(22px,3vw,38px);line-height:1.1}
.bl-site .lineup-card small{font-size:12px;letter-spacing:.14em;text-transform:uppercase}
.bl-site #tickets .ticket-grid{display:block}
.bl-site #tickets .ticket{margin:0;border-radius:0;border:0;border-bottom:2px solid #111;background:none;box-shadow:none;transform:none}
.bl-site #tickets .ticket:before,.bl-site #tickets .ticket:after{display:none}
`;
const splitStyle=`
/* skeleton: a split sheet. The bill (poster, date, buy button) stays pinned on the left while the running order, bands, tickets and info scroll past on the right */
.bl-split{display:grid;grid-template-columns:minmax(320px,35%) minmax(0,1fr);align-items:start}
.bl-bill{position:sticky;top:60px;height:calc(100vh - 60px);overflow:auto;border-right:8px solid #111;background:#fff}
.bl-bill .hero{padding:26px 26px 30px;background:transparent;min-height:100%;display:flex}
.bl-bill .hero-grid{width:100%;display:flex;flex-direction:column;gap:16px;align-items:stretch;padding:0}
.bl-bill .hero-art{order:-1;aspect-ratio:4/3;max-height:36vh;width:100%;transform:rotate(-1.4deg)}
.bl-bill .bl-rail{flex-direction:row;align-items:baseline;flex-wrap:wrap;gap:4px 14px;border-right:0;border-bottom:2px solid #111;padding:0 0 10px}
.bl-bill .bl-rail-label,.bl-bill .bl-rail b,.bl-bill .bl-rail small{writing-mode:horizontal-tb;margin:0}
.bl-bill .bl-rail b{font-size:26px}
.bl-bill .hero h1{font-size:clamp(36px,4.2vw,70px);margin:0 0 10px}
.bl-bill .hero p{max-width:none}
.bl-sheet{min-width:0}
.bl-sheet .ribbon{margin:0}
.bl-sheet .section>.wrap{width:auto;max-width:none;padding:0 34px;margin:0}
.bl-sheet .section:first-of-type{border-top:0}
@media(max-width:1000px){.bl-split{display:block}.bl-bill{position:static;height:auto;border-right:0;border-bottom:8px solid #111}.bl-bill .hero-art{max-height:none;aspect-ratio:16/10}.bl-sheet .section>.wrap{padding:0 18px}}
`;
const ownStyle=`

.bl-map-box{position:relative;min-height:220px;display:flex;align-items:center;justify-content:center}
.bl-map-box .map-image-view{display:block;width:100%;padding:0;border:0;background:none;cursor:zoom-in;position:relative}
.bl-map-box img{display:block;width:100%;height:auto}
.bl-map-box .map-image-view span{position:absolute;right:10px;bottom:10px;font-size:12px;padding:4px 10px;background:#000a;color:#fff;border-radius:999px}
.bl-map-box .map-static-placeholder{display:grid;gap:4px;text-align:center;padding:40px 16px;opacity:.7}
.bl-routes[hidden]{display:none}
.bl-routes h3{margin:0}
.bl-people .social-image,.bl-thanks .sponsor-logo{border:0;background:none;padding:0;cursor:pointer}
.bl-people img,.bl-thanks img{display:block;max-width:100%}
.bl-people .social-image.empty,.bl-thanks .sponsor-logo.empty{font-size:12px;opacity:.6;padding:10px}
.bl-people .social-action,.bl-thanks .sponsor-link{font-weight:800;font-size:13px;text-decoration:none;color:inherit}
.bl-people .social-action.muted{opacity:.5}

/* map: a printed plate with the stop list as a numbered index in the right column */
.bl-map{display:grid;grid-template-columns:minmax(0,1fr) 290px;border:4px solid #111;background:#fffdf5}
.bl-map-frame{margin:0;border-right:4px solid #111}
.bl-routes{display:flex;flex-direction:column}
.bl-routes h3{background:#111;color:#fff;font:400 20px Impact,"Arial Black",sans-serif;letter-spacing:.18em;padding:10px 14px;text-transform:uppercase}
.bl-route{display:grid;grid-template-columns:44px minmax(0,1fr) auto;align-items:center;gap:8px;padding:12px 14px;border-bottom:2px solid #111;color:#111;text-decoration:none}
.bl-route>span{font:400 28px Impact,"Arial Black",sans-serif;opacity:.3}
.bl-route b{font-size:17px;color:#111;opacity:1}
.bl-route i{font-style:normal;font-size:11px;font-weight:900;letter-spacing:.14em;border:2px solid #111;padding:1px 6px}
.bl-people{display:block}
.bl-site #updates .updates-list{max-width:none;width:100%}
.bl-follow{display:grid;grid-template-columns:48px minmax(0,1fr) 84px auto;align-items:center;gap:16px;padding:14px 0;border-bottom:2px solid #111}
.bl-follow-no{font:400 30px Impact,"Arial Black",sans-serif;opacity:.3}
.bl-follow-qr img,.bl-follow-qr .social-image{width:76px;height:76px;object-fit:cover}
.bl-thanks{display:flex;flex-wrap:wrap;gap:0}
.bl-sponsor{display:flex;align-items:center;gap:10px;padding:8px 18px;border:0;border-right:2px solid #111;border-radius:0;background:none;box-shadow:none}
.bl-sponsor small{font-size:10px;letter-spacing:.16em;text-transform:uppercase;opacity:.6}
.bl-sponsor img{max-height:34px;width:auto}
.bl-note{display:grid;gap:14px;align-items:center;padding:14px 0;border:0;border-bottom:2px solid #111;border-radius:0;background:none;box-shadow:none;grid-template-columns:56px minmax(0,1fr)}
.bl-note-no{font:400 34px Impact,"Arial Black",sans-serif;opacity:.3}
.bl-index{display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:10px;padding:10px 0;border-bottom:2px solid #111;color:#111;text-decoration:none}
@media(max-width:760px){.bl-map{grid-template-columns:1fr}.bl-map-frame{border-right:0;border-bottom:4px solid #111}.bl-follow{grid-template-columns:36px minmax(0,1fr) 60px}.bl-follow .social-action{grid-column:2/4}}
`;
const featuredFix=`
/* featured plans: image on top, text below, same height; an empty cover is a thin strip, not a placeholder laid over the text */
.bl-site .featured-activity-card{display:flex;flex-direction:column;align-items:stretch;height:100%}
.bl-site .featured-activity-media{position:relative;flex:none;width:100%;aspect-ratio:16/9}
.bl-site #participation .featured-activity-media.is-empty{aspect-ratio:auto!important;height:46px!important;min-height:0!important}
.bl-site .featured-activity-media.is-empty span{position:static;font-size:11px;letter-spacing:.22em}
.bl-site .featured-activity-copy{position:static;display:flex;flex-direction:column;gap:6px;padding:16px 18px 18px;text-align:left;align-self:stretch!important;width:100%!important;margin:0!important;grid-column:auto!important}
.bl-site .featured-all-link{display:flex!important;width:max-content!important;margin:24px auto 0!important;align-self:center!important;justify-self:center!important}
.bl-site .featured-activity-grid{align-items:stretch}
`;
const phoneFix=`
@media(max-width:820px){.bl-site .hero-grid{grid-template-columns:minmax(0,1fr)}.bl-rail{flex-direction:row;align-items:baseline;flex-wrap:wrap;gap:4px 14px;border-right:0;border-bottom:2px solid #111;padding:0 0 10px}.bl-rail-label,.bl-rail b,.bl-rail small{writing-mode:horizontal-tb;margin:0}.bl-rail b{font-size:26px}}
`;
const featuredShape=`
.bl-site .featured-all-link{border-radius:0!important;background:#111!important;color:#fff!important;border:0!important;box-shadow:none!important}

/* featured plans: numbered text rows like a printed list; no pictures */
.bl-site #participation .featured-activity-grid{grid-template-columns:1fr!important;counter-reset:fa;gap:0}
.bl-site #participation .featured-activity-grid>.featured-activity-card.featured-activity-card{display:grid!important;grid-template-columns:72px minmax(0,1fr)!important;align-items:center;counter-increment:fa;border:0!important;border-bottom:2px solid #111!important;border-radius:0!important;background:none!important;box-shadow:none!important;padding:12px 0!important;height:auto!important}
.bl-site #participation .featured-activity-grid>.featured-activity-card.featured-activity-card:before{content:counter(fa,decimal-leading-zero);font:400 40px Impact,"Arial Black",sans-serif;opacity:.28;position:static;transform:none;width:auto;height:auto;background:none}
.bl-site #participation .featured-activity-card:after{display:none}
.bl-site #participation .featured-activity-card .featured-activity-media{display:none!important}
.bl-site #participation .featured-activity-copy h3,.bl-site #participation .featured-activity-copy b{font-size:clamp(22px,2.6vw,34px)}
.bl-site #updates .updates-list{display:block}
.bl-site #updates .updates-list>a{display:grid!important;grid-template-columns:96px minmax(0,1fr) auto;align-items:center;gap:14px;width:100%;padding:10px 0;border:0;border-bottom:2px solid #111;text-align:left}
`;
export const previewStyle=coreStyle+style+heroStyle+referenceStyle+ownStyle+featuredFix+phoneFix+splitStyle+featuredShape;
export const previewBody=`<div class="bl-site">
<header class="nav"><div class="wrap"><a class="brand" href="#top" data-oe-field="eventName">STARDUST ONLY</a><nav class="links" data-oe-mount="nav-links"><a href="#home" data-page-link="home">首页</a><a href="#guests" data-target-mode="page" data-page-link="guests">乐队</a><a href="#activities" data-target-mode="page" data-page-link="activities">出场顺序</a><a href="#tickets">门票</a><a href="#guide" data-target-mode="page" data-page-link="guide">须知</a></nav><a class="btn ticket-purchase-link" href="#" target="_blank" rel="noopener">买票 ↗</a></div></header>
<main id="top"><div class="bl-split"><aside class="bl-bill">
<section class="hero"><div class="wrap hero-grid"><aside class="bl-rail"><span class="bl-rail-label">TODAY'S EVENT</span><b data-oe-field="date"></b><small>LIVE HOUSE</small></aside><div class="hero-copy"><span class="hero-kicker">LIVE HOUSE</span><h1 data-oe-field="eventName">STARDUST ONLY</h1><p data-oe-field="tagline"></p><div class="meta"><span class="pill" data-oe-field="location"></span><a class="pill venue-nav" href="#map-home" data-oe-field="edition"></a></div><div class="bl-cta"><a class="bl-btn yellow ticket-purchase-link" href="#tickets">买票</a><a class="bl-btn" href="#timetable">出场顺序</a></div></div><div class="hero-art"><div class="kv"><strong class="bl-kv-fallback" data-oe-field="eventName">STARDUST ONLY</strong></div></div></div></section></aside><div class="bl-sheet">
${coreRibbon()}
<section class="section oe-home-only" id="lineup"><div class="wrap">${head('LINE UP','出演乐队')}<div class="lineup-strip" data-oe-mirror="lineup"></div>${more('guests','乐队介绍')}</div></section>
<section class="section oe-home-only" id="timetable"><div class="wrap">${head('SET TIMES','出场顺序')}<div class="timeline" data-oe-mirror="timetable"></div>${more('activities','完整出场顺序')}</div></section>
${coreSection('updates').replace('class="updates-strip"','class="updates-strip section oe-home-only"').replace('<div class="wrap">','<div class="wrap">'+head('NEWS','最新消息'))}
${coreSection('participation',{ey:'MERCH & MORE',title:'物贩与交流'})}
${coreSection('tickets',{ey:'TICKET',title:'门票'})}
${ownMapSection('bl',{ey:'ACCESS',title:'场地',routeTitle:'INDEX'})}
${setSection}
${coreSection('guests',{ey:'BANDS',title:'出演乐队'})}
${coreSection('guide',{ey:'INFO',title:'入场须知'})}
${ownCommunitySection('bl',{ey:'COMMUNITY',title:'社群'})}
${ownSponsorsSection('bl',{ey:'THANKS',title:'合作支持'})}
</div></div></main>
<nav class="mobile-dock"><a href="#home" data-page-link="home">首页</a><a href="#guests" data-target-mode="page" data-page-link="guests">乐队</a><a href="#activities" data-target-mode="page" data-page-link="activities">顺序</a><a href="#guide" data-target-mode="page" data-page-link="guide">须知</a></nav>
<footer class="footer"><div class="wrap footer-grid"><div class="footer-brand"></div><div class="footer-participate"></div><div class="footer-visit"></div><div class="footer-social"></div></div></footer>
</div>`;
