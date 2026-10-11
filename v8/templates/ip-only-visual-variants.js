import {previewStyle as baseStyle} from '/v8/templates/01-ip-only-preview.js?v=8.36.2';
import {variantBodies} from '/v8/templates/ip-only-variant-bodies.js?v=8.36.2';

const variants={
'02-scrapbook':`
html[data-oe-template="02-scrapbook"]{--scrap-ink:#342d2f;--scrap-paper:#fffaf0;--scrap-pink:#ef6f80;--scrap-blue:#8fc9d9}
html[data-oe-template="02-scrapbook"] body{background:#efe7d8;color:var(--scrap-ink);font-family:"Trebuchet MS","Noto Sans SC",sans-serif;background-image:linear-gradient(rgba(100,75,55,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(100,75,55,.035) 1px,transparent 1px);background-size:22px 22px}
html[data-oe-template="02-scrapbook"] .nav{background:rgba(255,250,240,.92);border-bottom:1px dashed #b8a995;backdrop-filter:blur(10px)}
html[data-oe-template="02-scrapbook"] .brand{font-family:Georgia,serif;letter-spacing:.08em}
html[data-oe-template="02-scrapbook"] .hero{background:#efe7d8;min-height:820px}
html[data-oe-template="02-scrapbook"] .hero:before{background:radial-gradient(circle at 16% 12%,#ffd7df 0 11%,transparent 12%),radial-gradient(circle at 88% 24%,#cce7ec 0 12%,transparent 13%),linear-gradient(12deg,transparent 0 46%,rgba(255,255,255,.7) 47% 58%,transparent 59%),#efe7d8}
html[data-oe-template="02-scrapbook"] .hero-grid{grid-template-columns:.86fr 1.14fr;gap:56px}
html[data-oe-template="02-scrapbook"] .hero-copy{background:var(--scrap-paper);padding:46px 42px;box-shadow:0 18px 40px rgba(86,66,50,.12);transform:rotate(-1.1deg);border:1px solid #d8cab6;position:relative}
html[data-oe-template="02-scrapbook"] .hero-copy:before{content:"TRIP NOTE";position:absolute;right:22px;top:18px;font-size:10px;letter-spacing:.2em;color:#9d8c77}
html[data-oe-template="02-scrapbook"] .hero h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(58px,8vw,118px);line-height:.86;letter-spacing:-.045em}
html[data-oe-template="02-scrapbook"] .hero h1 em{color:var(--scrap-pink);text-shadow:none}
html[data-oe-template="02-scrapbook"] .hero-art{min-height:640px}
html[data-oe-template="02-scrapbook"] .kv{inset:42px 20px 46px 36px;border:12px solid #fff;border-bottom-width:62px;border-radius:2px;box-shadow:0 22px 34px rgba(61,46,37,.24);transform:rotate(2.2deg)}
html[data-oe-template="02-scrapbook"] .kv:before{content:"MEMORY 01";position:absolute;left:20px;bottom:-44px;color:#6f6459;font:700 12px/1 Georgia,serif;letter-spacing:.08em}
html[data-oe-template="02-scrapbook"] .sticker{border:0;border-radius:4px;box-shadow:0 7px 15px rgba(70,53,44,.16);font-family:"Trebuchet MS",sans-serif}
html[data-oe-template="02-scrapbook"] .s1{background:#ffdf84;transform:rotate(6deg)}
html[data-oe-template="02-scrapbook"] .s2{background:#b6dde6;transform:rotate(-7deg)}
html[data-oe-template="02-scrapbook"] .s3{background:#f5a5b2;color:#4a3034;transform:rotate(4deg)}
html[data-oe-template="02-scrapbook"] .ribbon{background:#df7d8d;border-block:0;transform:rotate(-.4deg)}
html[data-oe-template="02-scrapbook"] .quick{padding:72px 0}
html[data-oe-template="02-scrapbook"] .quick-grid{grid-template-columns:repeat(5,1fr);gap:28px}
html[data-oe-template="02-scrapbook"] .quick-card{border:1px solid #d8cab6;border-radius:3px;background:#fffaf0;box-shadow:0 12px 24px rgba(86,66,50,.09);transform:rotate(var(--r,0deg))}
html[data-oe-template="02-scrapbook"] .quick-card:nth-child(2n){--r:1.3deg}html[data-oe-template="02-scrapbook"] .quick-card:nth-child(3n){--r:-1.5deg}
html[data-oe-template="02-scrapbook"] .section{position:relative}html[data-oe-template="02-scrapbook"] .section.alt{background:#f7efe3}
html[data-oe-template="02-scrapbook"] .head h2{font-family:Georgia,serif;font-weight:500}
html[data-oe-template="02-scrapbook"] .ticket,html[data-oe-template="02-scrapbook"] .guest-card,html[data-oe-template="02-scrapbook"] .sponsor-card{border:1px solid #d4c7b5;border-radius:4px;box-shadow:0 12px 26px rgba(71,53,42,.08)}
html[data-oe-template="02-scrapbook"] .ticket{background:#fffaf0}
html[data-oe-template="02-scrapbook"] .footer{background:#342d2f;color:#fff7eb}
@media(max-width:560px){html[data-oe-template="02-scrapbook"] .hero-grid{gap:12px}html[data-oe-template="02-scrapbook"] .hero-copy{padding:30px 24px;transform:none}html[data-oe-template="02-scrapbook"] .kv{inset:18px 16px 34px 16px;transform:rotate(1deg)}}
`,
'03-school-festival':`
html[data-oe-template="03-school-festival"]{--school-blue:#2e8df5;--school-ink:#15304f;--school-yellow:#ffe46b}
html[data-oe-template="03-school-festival"] body{background:#f2f8ff;color:var(--school-ink);font-family:Inter,"Noto Sans SC",sans-serif;background-image:linear-gradient(#dcecff 1px,transparent 1px),linear-gradient(90deg,#dcecff 1px,transparent 1px);background-size:28px 28px}
html[data-oe-template="03-school-festival"] .nav{background:#fff;border-bottom:3px solid var(--school-ink)}
html[data-oe-template="03-school-festival"] .brand:before{content:"●";color:var(--school-blue);margin-right:8px}
html[data-oe-template="03-school-festival"] .hero{min-height:780px}
html[data-oe-template="03-school-festival"] .hero:before{background:linear-gradient(120deg,#eaf5ff 0 48%,#d9edff 48% 72%,#fff6b8 72%)}
html[data-oe-template="03-school-festival"] .hero-grid{grid-template-columns:1.05fr .95fr}
html[data-oe-template="03-school-festival"] .hero-copy{padding:72px 0}
html[data-oe-template="03-school-festival"] .hero h1{font-weight:950;letter-spacing:-.075em;color:var(--school-ink)}
html[data-oe-template="03-school-festival"] .hero h1 em{color:var(--school-blue);text-shadow:6px 6px 0 #fff,8px 8px 0 var(--school-ink)}
html[data-oe-template="03-school-festival"] .kv{inset:34px 6px 30px 38px;border:4px solid var(--school-ink);border-radius:26px;box-shadow:14px 14px 0 var(--school-blue)}
html[data-oe-template="03-school-festival"] .kv:before{content:"CAMPUS FESTIVAL";position:absolute;right:14px;top:14px;background:var(--school-yellow);border:2px solid var(--school-ink);padding:7px 10px;border-radius:999px;font-size:10px;font-weight:900}
html[data-oe-template="03-school-festival"] .sticker{border:2px solid var(--school-ink);box-shadow:5px 5px 0 var(--school-ink);border-radius:999px}
html[data-oe-template="03-school-festival"] .s1{background:#fff}html[data-oe-template="03-school-festival"] .s2{background:var(--school-yellow)}html[data-oe-template="03-school-festival"] .s3{background:var(--school-blue);color:#fff}
html[data-oe-template="03-school-festival"] .quick{background:#fff;border-block:3px solid var(--school-ink)}
html[data-oe-template="03-school-festival"] .quick-card{border:3px solid var(--school-ink);border-radius:18px;box-shadow:none;background:#fff;position:relative;overflow:hidden}
html[data-oe-template="03-school-festival"] .quick-card:before{content:counter(school);counter-increment:school;position:absolute;right:10px;top:4px;font-size:46px;font-weight:950;color:#dbeeff}
html[data-oe-template="03-school-festival"] .quick-grid{counter-reset:school}
html[data-oe-template="03-school-festival"] .section-no{background:var(--school-yellow);border-width:3px}
html[data-oe-template="03-school-festival"] .head h2{color:var(--school-ink)}
html[data-oe-template="03-school-festival"] .ticket,html[data-oe-template="03-school-festival"] .special,html[data-oe-template="03-school-festival"] .guest-card{border:3px solid var(--school-ink);box-shadow:7px 7px 0 #cfe7ff}
html[data-oe-template="03-school-festival"] .footer{background:var(--school-ink);color:#fff}
`,
'04-museum-editorial':`
html[data-oe-template="04-museum-editorial"]{--museum:#a28b6f;--museum-ink:#191816}
html[data-oe-template="04-museum-editorial"] body{background:#f7f5f0;color:var(--museum-ink);font-family:"Helvetica Neue","Noto Sans SC",sans-serif}
html[data-oe-template="04-museum-editorial"] .nav{background:rgba(247,245,240,.95);border-bottom:1px solid #c9c3b8}
html[data-oe-template="04-museum-editorial"] .brand{font-family:Georgia,serif;font-weight:400;letter-spacing:.14em}
html[data-oe-template="04-museum-editorial"] .links{font-weight:500;letter-spacing:.08em}
html[data-oe-template="04-museum-editorial"] .btn{border:1px solid var(--museum-ink);box-shadow:none;border-radius:0;background:transparent;font-weight:500}
html[data-oe-template="04-museum-editorial"] .hero{min-height:940px;background:#f7f5f0}
html[data-oe-template="04-museum-editorial"] .hero:before{display:none}
html[data-oe-template="04-museum-editorial"] .hero-grid{grid-template-columns:.72fr 1.28fr;gap:82px;align-items:start;padding-top:72px}
html[data-oe-template="04-museum-editorial"] .hero-copy{padding:118px 0 0}
html[data-oe-template="04-museum-editorial"] .hero h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(64px,8.2vw,120px);line-height:.9;letter-spacing:-.05em;font-weight:400}
html[data-oe-template="04-museum-editorial"] .hero h1 em{color:var(--museum);text-shadow:none;font-weight:400}
html[data-oe-template="04-museum-editorial"] .hero p{font-size:14px;line-height:2;max-width:430px}
html[data-oe-template="04-museum-editorial"] .meta{border-top:1px solid #bdb7aa;padding-top:18px}
html[data-oe-template="04-museum-editorial"] .pill{border:0;border-radius:0;background:transparent;padding:0 22px 0 0;font-weight:500}
html[data-oe-template="04-museum-editorial"] .hero-art{min-height:760px}
html[data-oe-template="04-museum-editorial"] .kv{inset:0;border:0;border-radius:0;box-shadow:none}
html[data-oe-template="04-museum-editorial"] .kv:before{content:"EXHIBITION";position:absolute;left:-46px;top:22px;writing-mode:vertical-rl;letter-spacing:.22em;font:500 10px/1 sans-serif}
html[data-oe-template="04-museum-editorial"] .sticker{display:none}
html[data-oe-template="04-museum-editorial"] .ribbon{background:transparent;color:var(--museum-ink);border-block:1px solid #bdb7aa}
html[data-oe-template="04-museum-editorial"] .quick{padding:90px 0}
html[data-oe-template="04-museum-editorial"] .quick-grid{grid-template-columns:repeat(5,1fr);gap:0;border-top:1px solid #bdb7aa}
html[data-oe-template="04-museum-editorial"] .quick-card{border:0;border-right:1px solid #bdb7aa;border-radius:0;box-shadow:none;background:transparent;padding:28px 22px;min-height:180px}
html[data-oe-template="04-museum-editorial"] .quick-card:last-child{border-right:0}
html[data-oe-template="04-museum-editorial"] .quick-card:hover{transform:none;background:#efebe2}
html[data-oe-template="04-museum-editorial"] .section{padding:120px 0}html[data-oe-template="04-museum-editorial"] .section.alt{background:#efede7}
html[data-oe-template="04-museum-editorial"] .head{align-items:flex-start;border-top:1px solid #a8a296;padding-top:16px}
html[data-oe-template="04-museum-editorial"] .head h2{font-family:Georgia,serif;font-weight:400;letter-spacing:-.03em}
html[data-oe-template="04-museum-editorial"] .section-no{border:0;background:transparent;padding:0;font-family:Georgia,serif;font-size:13px}
html[data-oe-template="04-museum-editorial"] .ticket,html[data-oe-template="04-museum-editorial"] .guest-card,html[data-oe-template="04-museum-editorial"] .sponsor-card{border:1px solid #c9c3b8;border-radius:0;box-shadow:none;background:#faf9f5}
html[data-oe-template="04-museum-editorial"] .footer{background:#191816;color:#f7f5f0}
@media(max-width:560px){html[data-oe-template="04-museum-editorial"] .hero{min-height:760px}html[data-oe-template="04-museum-editorial"] .hero-grid{padding-top:28px;gap:26px}html[data-oe-template="04-museum-editorial"] .hero-copy{padding:42px 0 0}html[data-oe-template="04-museum-editorial"] .hero-art{min-height:460px}}
`,
'05-live-poster':`
html[data-oe-template="05-live-poster"]{--live-bg:#0b0c11;--live-ink:#f6f6f2;--live-pink:#ff3b74;--live-mint:#72f5dc}
html[data-oe-template="05-live-poster"] body{background:var(--live-bg);color:var(--live-ink);font-family:Arial,"Noto Sans SC",sans-serif}
html[data-oe-template="05-live-poster"] .nav{background:rgba(8,9,14,.9);border-bottom:1px solid #343744;color:#fff;backdrop-filter:blur(14px)}
html[data-oe-template="05-live-poster"] .brand{font-weight:950;font-style:italic}
html[data-oe-template="05-live-poster"] .btn{background:var(--live-mint);color:#091112;border:0;box-shadow:none}
html[data-oe-template="05-live-poster"] .hero{min-height:860px;background:#0b0c11;color:#fff}
html[data-oe-template="05-live-poster"] .hero:before{background:radial-gradient(circle at 75% 22%,rgba(255,59,116,.46),transparent 28%),radial-gradient(circle at 70% 75%,rgba(114,245,220,.24),transparent 24%),linear-gradient(120deg,#0b0c11 0 54%,#151726 54%)}
html[data-oe-template="05-live-poster"] .hero-grid{grid-template-columns:1.12fr .88fr}
html[data-oe-template="05-live-poster"] .hero-copy{padding:86px 0;position:relative;z-index:4}
html[data-oe-template="05-live-poster"] .hero h1{font-size:clamp(82px,10vw,154px);line-height:.72;letter-spacing:-.09em;text-transform:uppercase;font-style:italic}
html[data-oe-template="05-live-poster"] .hero h1 em{color:var(--live-pink);text-shadow:8px 8px 0 #181a23}
html[data-oe-template="05-live-poster"] .hero p{color:#c3c5cf;max-width:500px}
html[data-oe-template="05-live-poster"] .pill{border:1px solid #4c4f5c;background:#171923;color:#fff}
html[data-oe-template="05-live-poster"] .hero-art{min-height:660px}
html[data-oe-template="05-live-poster"] .kv{inset:28px -54px 24px 32px;border:1px solid #3b3d49;border-radius:0;box-shadow:22px 22px 0 var(--live-pink);mix-blend-mode:screen}
html[data-oe-template="05-live-poster"] .sticker{border:0;border-radius:0;box-shadow:none;text-transform:uppercase;letter-spacing:.08em}
html[data-oe-template="05-live-poster"] .s1{background:var(--live-mint);color:#111;transform:rotate(0)}html[data-oe-template="05-live-poster"] .s2{background:#fff;color:#111;transform:rotate(-3deg)}html[data-oe-template="05-live-poster"] .s3{background:var(--live-pink);transform:rotate(3deg)}
html[data-oe-template="05-live-poster"] .ribbon{background:var(--live-pink);color:#fff;border:0}
html[data-oe-template="05-live-poster"] .quick{background:#0f1017}
html[data-oe-template="05-live-poster"] .quick-card{border:1px solid #353845;border-radius:0;background:#141620;color:#fff;box-shadow:none}
html[data-oe-template="05-live-poster"] .quick-card:hover{transform:translateY(-5px);border-color:var(--live-mint)}
html[data-oe-template="05-live-poster"] .section{background:#0b0c11;color:#fff}html[data-oe-template="05-live-poster"] .section.alt{background:#11131b}
html[data-oe-template="05-live-poster"] .head h2{font-style:italic;text-transform:uppercase}
html[data-oe-template="05-live-poster"] .section-no{background:var(--live-mint);color:#111;border:0}
html[data-oe-template="05-live-poster"] .ticket,html[data-oe-template="05-live-poster"] .special,html[data-oe-template="05-live-poster"] .guest-card{background:#151720;color:#fff;border:1px solid #373946;border-radius:0;box-shadow:none}
html[data-oe-template="05-live-poster"] .footer{background:#05060a;color:#fff}
html[data-oe-template="05-live-poster"] .event-status-badge{border-color:#fff;background:#11131b;color:#fff;box-shadow:none}
`,
'06-expo-catalogue':`
html[data-oe-template="06-expo-catalogue"]{--expo-orange:#ff5b35;--expo-ink:#101820}
html[data-oe-template="06-expo-catalogue"] body{background:#f3f2ee;color:var(--expo-ink);font-family:Arial,"Noto Sans SC",sans-serif}
html[data-oe-template="06-expo-catalogue"] .nav{background:#f3f2ee;border-bottom:2px solid var(--expo-ink)}
html[data-oe-template="06-expo-catalogue"] .brand{font-size:14px;font-weight:950;letter-spacing:.12em}
html[data-oe-template="06-expo-catalogue"] .links{justify-content:flex-end}
html[data-oe-template="06-expo-catalogue"] .btn{border-radius:2px;background:var(--expo-orange);box-shadow:none}
html[data-oe-template="06-expo-catalogue"] .hero{min-height:700px}
html[data-oe-template="06-expo-catalogue"] .hero:before{background:linear-gradient(90deg,#f3f2ee 0 62%,#deddd8 62% 100%)}
html[data-oe-template="06-expo-catalogue"] .hero-grid{grid-template-columns:1fr 1fr;gap:0}
html[data-oe-template="06-expo-catalogue"] .hero-copy{padding:68px 46px 68px 0;border-right:1px solid #b9b7af}
html[data-oe-template="06-expo-catalogue"] .hero h1{font-size:clamp(68px,8.5vw,128px);line-height:.78;letter-spacing:-.085em;text-transform:uppercase}
html[data-oe-template="06-expo-catalogue"] .hero h1 em{color:var(--expo-orange);text-shadow:none}
html[data-oe-template="06-expo-catalogue"] .hero-art{min-height:620px}
html[data-oe-template="06-expo-catalogue"] .kv{inset:44px 0 44px 46px;border:0;border-radius:0;box-shadow:none}
html[data-oe-template="06-expo-catalogue"] .kv:before{content:"VISUAL / 001";position:absolute;left:0;top:-26px;font-size:10px;letter-spacing:.16em;font-weight:900}
html[data-oe-template="06-expo-catalogue"] .sticker{border:1px solid var(--expo-ink);border-radius:2px;box-shadow:none;font-size:10px;letter-spacing:.1em}
html[data-oe-template="06-expo-catalogue"] .ribbon{background:var(--expo-ink);color:#fff;border:0}
html[data-oe-template="06-expo-catalogue"] .quick{padding:0;border-bottom:2px solid var(--expo-ink)}
html[data-oe-template="06-expo-catalogue"] .quick .wrap{width:100%}
html[data-oe-template="06-expo-catalogue"] .quick-grid{gap:0;grid-template-columns:repeat(5,1fr)}
html[data-oe-template="06-expo-catalogue"] .quick-card{min-height:170px;border:0;border-right:1px solid #a9a79f;border-radius:0;background:#f3f2ee;box-shadow:none;padding:22px}
html[data-oe-template="06-expo-catalogue"] .quick-card:last-child{border-right:0}
html[data-oe-template="06-expo-catalogue"] .quick-card:hover{transform:none;background:#ff5b35;color:#fff}
html[data-oe-template="06-expo-catalogue"] .section{padding:82px 0;border-bottom:1px solid #b9b7af}html[data-oe-template="06-expo-catalogue"] .section.alt{background:#ebeae5}
html[data-oe-template="06-expo-catalogue"] .head{border-bottom:2px solid var(--expo-ink);padding-bottom:14px}
html[data-oe-template="06-expo-catalogue"] .head h2{text-transform:uppercase;font-size:clamp(44px,5vw,66px)}
html[data-oe-template="06-expo-catalogue"] .section-no{border-radius:2px;background:var(--expo-orange);border:0}
html[data-oe-template="06-expo-catalogue"] .ticket,html[data-oe-template="06-expo-catalogue"] .guest-card,html[data-oe-template="06-expo-catalogue"] .sponsor-card{border:1px solid #a9a79f;border-radius:0;box-shadow:none}
html[data-oe-template="06-expo-catalogue"] .footer{background:var(--expo-ink);color:#fff}
`,
'07-immersive-character':`
html[data-oe-template="07-immersive-character"]{--imm-bg:#131225;--imm-violet:#7f6cff;--imm-lilac:#b7a7ff}
html[data-oe-template="07-immersive-character"] body{background:#131225;color:#f7f5ff;font-family:Inter,"Noto Sans SC",sans-serif}
html[data-oe-template="07-immersive-character"] .nav{background:rgba(19,18,37,.68);border-bottom:1px solid rgba(255,255,255,.15);color:#fff;backdrop-filter:blur(16px)}
html[data-oe-template="07-immersive-character"] .brand{letter-spacing:.14em}
html[data-oe-template="07-immersive-character"] .btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.45);color:#fff;box-shadow:none}
html[data-oe-template="07-immersive-character"] .hero{min-height:100vh;background:#131225;color:#fff}
html[data-oe-template="07-immersive-character"] .hero:before{background:radial-gradient(circle at 76% 24%,rgba(127,108,255,.48),transparent 30%),radial-gradient(circle at 24% 78%,rgba(73,211,223,.2),transparent 28%),linear-gradient(180deg,#17152d,#0d0c18)}
html[data-oe-template="07-immersive-character"] .hero-grid{grid-template-columns:.82fr 1.18fr;gap:42px}
html[data-oe-template="07-immersive-character"] .hero-copy{padding:110px 0;z-index:5}
html[data-oe-template="07-immersive-character"] .hero-copy:before{content:"CHAPTER 01 / EVENT";display:block;margin-bottom:24px;font-size:10px;letter-spacing:.28em;color:var(--imm-lilac)}
html[data-oe-template="07-immersive-character"] .hero h1{font-family:Georgia,serif;font-size:clamp(72px,9vw,138px);line-height:.8;letter-spacing:-.07em;font-weight:500}
html[data-oe-template="07-immersive-character"] .hero h1 em{color:var(--imm-lilac);text-shadow:0 0 28px rgba(183,167,255,.22)}
html[data-oe-template="07-immersive-character"] .hero p{color:#cfcae2;max-width:480px}
html[data-oe-template="07-immersive-character"] .pill{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.28)}
html[data-oe-template="07-immersive-character"] .hero-art{min-height:720px}
html[data-oe-template="07-immersive-character"] .kv{inset:30px -30px 30px 14px;border:1px solid rgba(255,255,255,.18);border-radius:40% 12px 40% 12px;box-shadow:0 0 80px rgba(127,108,255,.22)}
html[data-oe-template="07-immersive-character"] .sticker{border:1px solid rgba(255,255,255,.35);box-shadow:none;background:rgba(15,14,30,.66);color:#fff;backdrop-filter:blur(10px)}
html[data-oe-template="07-immersive-character"] .ribbon{background:linear-gradient(90deg,#6d5df1,#9f76ef);border:0}
html[data-oe-template="07-immersive-character"] .quick{background:#0f0e1d;padding:70px 0}
html[data-oe-template="07-immersive-character"] .quick-grid{grid-template-columns:repeat(5,1fr);gap:12px}
html[data-oe-template="07-immersive-character"] .quick-card{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.025));color:#fff;border:1px solid rgba(255,255,255,.14);box-shadow:none;border-radius:18px;min-height:180px}
html[data-oe-template="07-immersive-character"] .quick-card:hover{transform:translateY(-7px);border-color:var(--imm-lilac)}
html[data-oe-template="07-immersive-character"] .section{background:#131225;color:#fff;min-height:72vh}html[data-oe-template="07-immersive-character"] .section.alt{background:#0f0e1d}
html[data-oe-template="07-immersive-character"] .head h2{font-family:Georgia,serif;font-weight:500}
html[data-oe-template="07-immersive-character"] .section-no{background:transparent;color:var(--imm-lilac);border:1px solid var(--imm-lilac)}
html[data-oe-template="07-immersive-character"] .ticket,html[data-oe-template="07-immersive-character"] .guest-card,html[data-oe-template="07-immersive-character"] .sponsor-card,html[data-oe-template="07-immersive-character"] .special{background:rgba(255,255,255,.055);color:#fff;border:1px solid rgba(255,255,255,.14);box-shadow:none}
html[data-oe-template="07-immersive-character"] .footer{background:#090813;color:#fff}
html[data-oe-template="07-immersive-character"] .event-status-badge{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.25);color:#fff;box-shadow:none}
`
};


const structural={
'02-scrapbook':`
html[data-oe-template="02-scrapbook"] .scrap-opening{display:flex;justify-content:space-between;gap:20px;padding:10px 28px;background:linear-gradient(90deg,#9ed8ed 0 50%,#f5a9a0 50%);color:#fff;font-size:9px;font-weight:900;letter-spacing:.18em}
html[data-oe-template="02-scrapbook"] .scrap-cassette{position:absolute;left:-18px;bottom:28px;width:210px;height:126px;padding:18px;border:2px solid #5e534b;border-radius:18px;background:#f9ead8;box-shadow:8px 8px 0 #b9a58f;transform:rotate(-5deg);z-index:4}
html[data-oe-template="02-scrapbook"] .scrap-cassette:before,html[data-oe-template="02-scrapbook"] .scrap-cassette:after{content:"";position:absolute;bottom:18px;width:22px;height:22px;border:2px solid #75685e;border-radius:50%;background:#fff}
html[data-oe-template="02-scrapbook"] .scrap-cassette:before{left:42px}html[data-oe-template="02-scrapbook"] .scrap-cassette:after{right:42px}
html[data-oe-template="02-scrapbook"] .cassette-window{height:34px;border:2px solid #75685e;border-radius:8px;background:#d8eef1;margin-bottom:12px;display:flex;justify-content:space-around;align-items:center}
html[data-oe-template="02-scrapbook"] .cassette-window span{width:18px;height:18px;border-radius:50%;border:2px solid #75685e;background:#fff}
html[data-oe-template="02-scrapbook"] .scrap-cassette b{font-size:9px;letter-spacing:.14em}
html[data-oe-template="02-scrapbook"] .scrap-hashtags{padding:16px 20px;text-align:center;background:#d9ff46;color:#36352d;font-size:11px;font-weight:900;letter-spacing:.12em;white-space:nowrap;overflow:hidden}
html[data-oe-template="02-scrapbook"] .scrap-story{padding:110px 0 96px;background:#fffaf0}
html[data-oe-template="02-scrapbook"] .scrap-story .wrap{display:grid;grid-template-columns:.55fr 1.45fr;gap:70px;align-items:start}
html[data-oe-template="02-scrapbook"] .scrap-story span{font-size:10px;letter-spacing:.2em;font-weight:900}
html[data-oe-template="02-scrapbook"] .scrap-story p{margin:0;font:500 clamp(28px,4vw,52px)/1.3 Georgia,serif}
@media(max-width:700px){html[data-oe-template="02-scrapbook"] .scrap-opening{display:none}html[data-oe-template="02-scrapbook"] .scrap-cassette{width:150px;height:96px;left:4px;bottom:8px}html[data-oe-template="02-scrapbook"] .scrap-story .wrap{grid-template-columns:1fr;gap:22px}}
`,
'03-school-festival':`
html[data-oe-template="03-school-festival"] .school-rail{position:fixed;left:0;top:0;bottom:0;width:42px;z-index:70;background:#15304f;color:#fff;display:flex;flex-direction:column;align-items:center;gap:24px;padding:86px 0 20px}
html[data-oe-template="03-school-festival"] .school-rail b{writing-mode:vertical-rl;font-size:9px;letter-spacing:.18em}
html[data-oe-template="03-school-festival"] .school-rail span{writing-mode:vertical-rl;font-size:7px;opacity:.66}
html[data-oe-template="03-school-festival"] body{padding-left:42px}
html[data-oe-template="03-school-festival"] .school-info-board{position:absolute;right:-8px;top:70px;width:250px;padding:18px 18px 20px;border:3px solid #15304f;border-radius:20px;background:#fff;box-shadow:8px 8px 0 #ffe46b;z-index:5;transform:rotate(2deg)}
html[data-oe-template="03-school-festival"] .school-info-board>span{font-size:8px;letter-spacing:.14em;font-weight:900;color:#2e8df5}
html[data-oe-template="03-school-festival"] .school-info-board b{display:block;margin:7px 0 12px;font-size:28px;line-height:.9;letter-spacing:-.04em}
html[data-oe-template="03-school-festival"] .school-info-board div{padding-top:10px;border-top:2px solid #15304f;font-size:8px;font-weight:900}
html[data-oe-template="03-school-festival"] .school-wave{height:42px;background:repeating-linear-gradient(135deg,#2e8df5 0 24px,#fff 24px 48px,#ffe46b 48px 72px,#fff 72px 96px)}
html[data-oe-template="03-school-festival"] .school-about{padding:90px 0;background:#fff}
html[data-oe-template="03-school-festival"] .school-about .wrap{display:grid;grid-template-columns:180px 1fr;gap:40px;align-items:center}
html[data-oe-template="03-school-festival"] .school-big-no{font-size:144px;font-weight:950;line-height:.8;color:#d9ebff;letter-spacing:-.1em}
html[data-oe-template="03-school-festival"] .school-about span{font-size:9px;font-weight:900;letter-spacing:.15em;color:#2e8df5}
html[data-oe-template="03-school-festival"] .school-about h2{margin:8px 0 0;font-size:clamp(30px,4vw,58px);line-height:1.05;letter-spacing:-.04em}
@media(max-width:700px){html[data-oe-template="03-school-festival"] body{padding-left:0}html[data-oe-template="03-school-festival"] .school-rail{display:none}html[data-oe-template="03-school-festival"] .school-info-board{position:relative;right:auto;top:auto;width:auto;margin-top:18px}html[data-oe-template="03-school-festival"] .school-about .wrap{grid-template-columns:90px 1fr}html[data-oe-template="03-school-festival"] .school-big-no{font-size:80px}}
`,
'04-museum-editorial':`
html[data-oe-template="04-museum-editorial"] .museum-index{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid #aaa397;background:#f7f5f0}
html[data-oe-template="04-museum-editorial"] .museum-index span{padding:11px 22px;border-right:1px solid #aaa397;font-size:8px;letter-spacing:.2em}
html[data-oe-template="04-museum-editorial"] .museum-caption{position:absolute;left:0;top:50%;transform:translateY(-50%);z-index:5;width:100px}
html[data-oe-template="04-museum-editorial"] .museum-caption span{display:block;font-size:8px;letter-spacing:.16em}
html[data-oe-template="04-museum-editorial"] .museum-caption p{font:400 24px/1 Georgia,serif;writing-mode:vertical-rl;margin:18px 0 0}
html[data-oe-template="04-museum-editorial"] .museum-hero .hero-art{grid-column:2}
html[data-oe-template="04-museum-editorial"] .museum-hero .hero-copy{grid-column:1;grid-row:1}
html[data-oe-template="04-museum-editorial"] .museum-intro{padding:150px 0;background:#f7f5f0;border-top:1px solid #aaa397}
html[data-oe-template="04-museum-editorial"] .museum-intro .wrap{max-width:850px}
html[data-oe-template="04-museum-editorial"] .museum-intro>div>span{font-size:8px;letter-spacing:.22em;color:#7c746a}
html[data-oe-template="04-museum-editorial"] .museum-intro h2{margin:25px 0 36px;font:400 clamp(38px,5vw,70px)/1.18 Georgia,serif}
html[data-oe-template="04-museum-editorial"] .museum-intro p{max-width:620px;margin-left:auto;font-size:14px;line-height:2}
html[data-oe-template="04-museum-editorial"] .museum-rule{height:1px;background:#aaa397}
html[data-oe-template="04-museum-editorial"] .museum-index-grid .quick{padding-top:0}
@media(max-width:700px){html[data-oe-template="04-museum-editorial"] .museum-caption{display:none}html[data-oe-template="04-museum-editorial"] .museum-index{grid-template-columns:1fr}html[data-oe-template="04-museum-editorial"] .museum-index span{border-right:0;border-bottom:1px solid #aaa397}html[data-oe-template="04-museum-editorial"] .museum-intro{padding:88px 0}}
`,
'05-live-poster':`
html[data-oe-template="05-live-poster"] .live-top-strip{display:flex;justify-content:space-between;gap:20px;padding:10px 24px;background:linear-gradient(90deg,#ff3b74,#9d6bff,#72f5dc);color:#101116;font-size:8px;font-weight:950;letter-spacing:.16em}
html[data-oe-template="05-live-poster"] .live-five{position:absolute;left:-20px;top:30px;font-size:min(46vw,520px);font-weight:1000;line-height:.75;letter-spacing:-.15em;color:transparent;-webkit-text-stroke:3px rgba(255,255,255,.1);z-index:1}
html[data-oe-template="05-live-poster"] .live-hero .hero-copy{z-index:4}
html[data-oe-template="05-live-poster"] .live-date-banner{display:flex;align-items:baseline;justify-content:center;gap:20px;padding:28px 20px;background:#f5f6fb;color:#12131a;border-block:8px solid #101116}
html[data-oe-template="05-live-poster"] .live-date-banner small{font-size:18px;font-weight:900}
html[data-oe-template="05-live-poster"] .live-date-banner b{font-size:clamp(72px,10vw,140px);line-height:.75;letter-spacing:-.08em}
html[data-oe-template="05-live-poster"] .live-date-banner span{padding:7px 12px;background:linear-gradient(90deg,#ff3b74,#72f5dc);font-size:12px;font-weight:950}
html[data-oe-template="05-live-poster"] .live-cast-intro{padding:90px 0;background:linear-gradient(135deg,#131520,#0a0b10);border-bottom:1px solid #3c3f4d}
html[data-oe-template="05-live-poster"] .live-cast-intro span{font-size:10px;letter-spacing:.2em;color:#72f5dc}
html[data-oe-template="05-live-poster"] .live-cast-intro h2{max-width:900px;margin:12px 0 0;font-size:clamp(38px,6vw,84px);line-height:.95;letter-spacing:-.05em;font-style:italic}
html[data-oe-template="05-live-poster"] .live-stage-map{background:repeating-linear-gradient(135deg,#0f1017 0 32px,#12131d 32px 64px)}
@media(max-width:700px){html[data-oe-template="05-live-poster"] .live-top-strip span:nth-child(2){display:none}html[data-oe-template="05-live-poster"] .live-date-banner{gap:8px;flex-wrap:wrap}html[data-oe-template="05-live-poster"] .live-five{font-size:85vw}}
`,
'06-expo-catalogue':`
html[data-oe-template="06-expo-catalogue"] .expo-category-bar{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:2px solid #101820}
html[data-oe-template="06-expo-catalogue"] .expo-category-bar span{padding:12px 16px;border-right:2px solid #101820;font-size:9px;font-weight:950;letter-spacing:.08em}
html[data-oe-template="06-expo-catalogue"] .expo-category-bar span:nth-child(1){background:#5fe3ea}html[data-oe-template="06-expo-catalogue"] .expo-category-bar span:nth-child(2){background:#ff69ad}html[data-oe-template="06-expo-catalogue"] .expo-category-bar span:nth-child(3){background:#ffd94f}
html[data-oe-template="06-expo-catalogue"] .expo-index{position:absolute;right:0;bottom:34px;width:230px;border:2px solid #101820;background:#fff;z-index:4}
html[data-oe-template="06-expo-catalogue"] .expo-index>b{display:block;padding:10px 12px;border-bottom:2px solid #101820;font-size:9px;letter-spacing:.12em}
html[data-oe-template="06-expo-catalogue"] .expo-index ol{list-style:none;margin:0;padding:0;counter-reset:expo}
html[data-oe-template="06-expo-catalogue"] .expo-index li{display:flex;gap:10px;padding:7px 12px;border-bottom:1px solid #b4b3ad;font-size:9px;font-weight:900}
html[data-oe-template="06-expo-catalogue"] .expo-index li:before{counter-increment:expo;content:"0" counter(expo);color:#ff5b35}
html[data-oe-template="06-expo-catalogue"] .expo-board{padding:54px 0;background:#f3f2ee}
html[data-oe-template="06-expo-catalogue"] .expo-board .wrap{display:grid;grid-template-columns:1fr 1fr 1fr;border:2px solid #101820}
html[data-oe-template="06-expo-catalogue"] .expo-board-cell{padding:34px 28px;min-height:180px;border-right:2px solid #101820}
html[data-oe-template="06-expo-catalogue"] .expo-board-cell:last-child{border-right:0}
html[data-oe-template="06-expo-catalogue"] .expo-board-cell.cyan{background:#5fe3ea}html[data-oe-template="06-expo-catalogue"] .expo-board-cell.magenta{background:#ff69ad}html[data-oe-template="06-expo-catalogue"] .expo-board-cell.yellow{background:#ffd94f}
html[data-oe-template="06-expo-catalogue"] .expo-board-cell b{font-size:22px}html[data-oe-template="06-expo-catalogue"] .expo-board-cell p{font-size:10px}
@media(max-width:700px){html[data-oe-template="06-expo-catalogue"] .expo-category-bar{grid-template-columns:1fr}html[data-oe-template="06-expo-catalogue"] .expo-category-bar span{border-right:0;border-bottom:1px solid #101820}html[data-oe-template="06-expo-catalogue"] .expo-index{display:none}html[data-oe-template="06-expo-catalogue"] .expo-board .wrap{grid-template-columns:1fr}html[data-oe-template="06-expo-catalogue"] .expo-board-cell{border-right:0;border-bottom:2px solid #101820}}
`,
'07-immersive-character':`
html[data-oe-template="07-immersive-character"] .jp-cloud{position:absolute;z-index:2;pointer-events:none;width:190px;height:74px;border-radius:50%;border-top:2px solid rgba(255,255,255,.2)}
html[data-oe-template="07-immersive-character"] .cloud-a{top:150px;left:-40px}.cloud-b{top:470px;right:-50px}
html[data-oe-template="07-immersive-character"] .kimetsu-frame-label{position:absolute;right:18px;top:92px;z-index:5;display:grid;justify-items:end;gap:6px}
html[data-oe-template="07-immersive-character"] .kimetsu-frame-label span{font-family:serif;font-size:28px;letter-spacing:.16em}
html[data-oe-template="07-immersive-character"] .kimetsu-frame-label b{font-size:8px;letter-spacing:.22em;color:#b7a7ff}
html[data-oe-template="07-immersive-character"] .kimetsu-prologue{padding:140px 0;background:#0c1930;color:#f5efe3;position:relative;border-block:8px solid #6f4f34}
html[data-oe-template="07-immersive-character"] .kimetsu-prologue:before{content:"";position:absolute;inset:0;opacity:.16;background-image:linear-gradient(30deg,#fff 12%,transparent 12.5%,transparent 87%,#fff 87.5%,#fff),linear-gradient(150deg,#fff 12%,transparent 12.5%,transparent 87%,#fff 87.5%,#fff),linear-gradient(30deg,#fff 12%,transparent 12.5%,transparent 87%,#fff 87.5%,#fff),linear-gradient(150deg,#fff 12%,transparent 12.5%,transparent 87%,#fff 87.5%,#fff);background-size:36px 63px}
html[data-oe-template="07-immersive-character"] .kimetsu-prologue .wrap{position:relative;max-width:820px;text-align:center}
html[data-oe-template="07-immersive-character"] .kimetsu-prologue span{font:500 18px/1 serif;letter-spacing:.35em}
html[data-oe-template="07-immersive-character"] .kimetsu-prologue h2{margin:24px 0;font:500 clamp(40px,6vw,72px)/1.2 serif;letter-spacing:.08em}
html[data-oe-template="07-immersive-character"] .kimetsu-prologue p{font-size:13px;letter-spacing:.14em}
html[data-oe-template="07-immersive-character"] .kimetsu-frames{height:68px;background:linear-gradient(#6f4f34 0 8px,transparent 8px 60px,#6f4f34 60px),repeating-linear-gradient(90deg,#12233f 0 100px,#173254 100px 200px)}
html[data-oe-template="07-immersive-character"] .kimetsu-chapter{padding:58px 0;background:#101c31;color:#f5efe3;border-top:1px solid #71563f}
html[data-oe-template="07-immersive-character"] .kimetsu-chapter .wrap{display:flex;align-items:baseline;gap:28px}
html[data-oe-template="07-immersive-character"] .kimetsu-chapter span{font-family:serif;letter-spacing:.3em;color:#d9b67e}
html[data-oe-template="07-immersive-character"] .kimetsu-chapter h2{font:500 36px/1 serif;letter-spacing:.08em}
@media(max-width:700px){html[data-oe-template="07-immersive-character"] .kimetsu-frame-label{display:none}html[data-oe-template="07-immersive-character"] .kimetsu-prologue{padding:90px 0}}
`
};


const independent={
'02-scrapbook':`
html[data-oe-template="02-scrapbook"] .scrap-site{background:#efe7d8;min-height:100vh}
html[data-oe-template="02-scrapbook"] .scrap-side-a,html[data-oe-template="02-scrapbook"] .scrap-side-b{position:fixed;top:50%;z-index:75;font-size:7px;font-weight:900;letter-spacing:.18em;writing-mode:vertical-rl;transform:translateY(-50%);padding:16px 8px;color:#fff}
html[data-oe-template="02-scrapbook"] .scrap-side-a{left:0;background:#8fc9d9}html[data-oe-template="02-scrapbook"] .scrap-side-b{right:0;background:#ef6f80}
html[data-oe-template="02-scrapbook"] .scrap-hero{padding:74px 5vw 88px;background:#efe7d8}
html[data-oe-template="02-scrapbook"] .scrap-hero-grid{max-width:1240px;margin:auto;display:grid;grid-template-columns:.72fr 1.08fr .82fr;gap:30px;align-items:center;position:relative}
html[data-oe-template="02-scrapbook"] .scrap-tape-wrap{position:relative;min-height:520px;display:flex;align-items:center;justify-content:center}
html[data-oe-template="02-scrapbook"] .scrap-tape{width:270px;height:172px;padding:24px;border:2px solid #5f534b;border-radius:24px;background:#f7ead8;box-shadow:14px 16px 0 #c7b39c;transform:rotate(-8deg);position:relative}
html[data-oe-template="02-scrapbook"] .scrap-tape .reel{position:absolute;top:56px;width:48px;height:48px;border:3px solid #6e6258;border-radius:50%;background:#fff}html[data-oe-template="02-scrapbook"] .scrap-tape .r1{left:44px}html[data-oe-template="02-scrapbook"] .scrap-tape .r2{right:44px}
html[data-oe-template="02-scrapbook"] .scrap-tape b{display:block;font:700 13px/1.1 Georgia,serif;letter-spacing:.07em}html[data-oe-template="02-scrapbook"] .scrap-tape small{position:absolute;bottom:18px;left:24px;font-size:7px;letter-spacing:.16em}
html[data-oe-template="02-scrapbook"] .scrap-postcard{position:absolute;right:-18px;bottom:68px;padding:18px 20px;background:#d9ff46;border:1px solid #6f695a;box-shadow:6px 8px 0 #887c6e;font-size:8px;letter-spacing:.08em;transform:rotate(7deg)}
html[data-oe-template="02-scrapbook"] .scrap-photo{min-height:650px}.scrap-photo .kv{inset:0}
html[data-oe-template="02-scrapbook"] .scrap-copy{padding:38px 12px;background:transparent;box-shadow:none;border:0;transform:none}
html[data-oe-template="02-scrapbook"] .scrap-manifesto{padding:120px 7vw;background:#fffaf0}
html[data-oe-template="02-scrapbook"] .scrap-manifesto>div{max-width:980px;margin:auto;display:grid;grid-template-columns:.55fr 1.45fr;gap:70px}
html[data-oe-template="02-scrapbook"] .scrap-manifesto span{font-size:9px;font-weight:900;letter-spacing:.18em}.scrap-manifesto p{margin:0;font:500 clamp(28px,4vw,54px)/1.25 Georgia,serif}
html[data-oe-template="02-scrapbook"] .scrap-news,html[data-oe-template="02-scrapbook"] .scrap-memory-menu,html[data-oe-template="02-scrapbook"] .scrap-ticket-book,html[data-oe-template="02-scrapbook"] .scrap-featured,html[data-oe-template="02-scrapbook"] .scrap-map,html[data-oe-template="02-scrapbook"] .scrap-community,html[data-oe-template="02-scrapbook"] .scrap-sponsors{max-width:1180px;margin:0 auto;padding:92px 32px}
html[data-oe-template="02-scrapbook"] .scrap-news{display:grid;grid-template-columns:180px 1fr;gap:44px}.scrap-label,.scrap-section-title span{font-size:8px;font-weight:900;letter-spacing:.18em}
html[data-oe-template="02-scrapbook"] [data-oe-mount="updates"]{display:grid;gap:1px}.scrap-news .update-item{display:grid;grid-template-columns:80px 1fr auto;padding:18px 0;border-bottom:1px dashed #bcae9c}
html[data-oe-template="02-scrapbook"] [data-oe-mount="quick"]{display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
html[data-oe-template="02-scrapbook"] [data-oe-mount="tickets"]{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:32px}
html[data-oe-template="02-scrapbook"] [data-oe-mount="featured-activities"]{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:32px}
html[data-oe-template="02-scrapbook"] .scrap-map{display:grid;grid-template-columns:.7fr 1.3fr;gap:38px;background:#dcecf0;border:1px solid #9fb9bf;border-radius:4px}
html[data-oe-template="02-scrapbook"] [data-oe-mount="map-links"]{display:grid;gap:8px;margin-top:24px}
html[data-oe-template="02-scrapbook"] .scrap-page{padding:110px max(28px,7vw);background:#fffaf0;min-height:100vh}.scrap-page-head{display:grid;grid-template-columns:180px 1fr auto;gap:24px;align-items:end;border-bottom:1px dashed #bcae9c;padding-bottom:22px;margin-bottom:38px}.scrap-page-head span{font-size:8px;letter-spacing:.2em}.scrap-page-head h2{margin:0;font:500 48px/1 Georgia,serif}
html[data-oe-template="02-scrapbook"] .scrap-guest-mount{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
html[data-oe-template="02-scrapbook"] .scrap-footer{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:28px;padding:70px max(28px,7vw);background:#342d2f;color:#fff7eb}
@media(max-width:850px){html[data-oe-template="02-scrapbook"] .scrap-side-a,html[data-oe-template="02-scrapbook"] .scrap-side-b{display:none}html[data-oe-template="02-scrapbook"] .scrap-hero-grid{grid-template-columns:1fr}.scrap-tape-wrap{min-height:260px!important}.scrap-photo{min-height:480px!important}.scrap-manifesto>div,.scrap-news,.scrap-map{grid-template-columns:1fr!important}.scrap-memory-menu [data-oe-mount="quick"],.scrap-ticket-book [data-oe-mount="tickets"],.scrap-featured [data-oe-mount="featured-activities"],.scrap-guest-mount{grid-template-columns:1fr!important}}
`,
'03-school-festival':`
html[data-oe-template="03-school-festival"] .school-site{padding-left:46px;background:#f2f8ff}
html[data-oe-template="03-school-festival"] .school-fixed-rail{position:fixed;z-index:80;inset:0 auto 0 0;width:46px;background:#15304f;color:#fff;display:flex;flex-direction:column;align-items:center;padding:84px 0 20px;gap:24px}.school-fixed-rail b{writing-mode:vertical-rl;font-size:8px;letter-spacing:.2em}.school-fixed-rail span{font-size:8px;opacity:.6}
html[data-oe-template="03-school-festival"] .school-hero{display:grid;grid-template-columns:1fr 1.05fr;min-height:760px;padding:68px max(28px,6vw);gap:36px;background:linear-gradient(135deg,#eef8ff 0 62%,#fff7be 62%)}
html[data-oe-template="03-school-festival"] .school-hero-board{align-self:center;position:relative;padding:44px;border:3px solid #15304f;border-radius:28px;background:#fff;box-shadow:14px 14px 0 #5eb6ff}.school-kicker{font-size:9px;font-weight:900;letter-spacing:.17em;color:#2e8df5}.school-stamp{position:absolute;right:-18px;bottom:-22px;padding:14px 18px;border:3px solid #15304f;border-radius:999px;background:#ffe46b;font-size:10px;font-weight:950;transform:rotate(-8deg)}
html[data-oe-template="03-school-festival"] .school-kv-column{position:relative}.school-kv{min-height:620px}.school-kv .kv{inset:0;border-radius:36px}.school-dots{position:absolute;inset:auto 8% -28px 8%;height:16px;background:radial-gradient(circle,#15304f 2px,transparent 3px) 0 0/22px 16px}
html[data-oe-template="03-school-festival"] .school-status-grid{display:grid;grid-template-columns:repeat(3,1fr);border-block:3px solid #15304f;background:#fff}.school-status-grid>div{padding:18px 24px;border-right:3px solid #15304f;display:flex;justify-content:space-between}.school-status-grid b{font-size:8px;letter-spacing:.15em}.school-status-grid span{font-size:11px;font-weight:900}
html[data-oe-template="03-school-festival"] .school-updates,html[data-oe-template="03-school-festival"] .school-menu,html[data-oe-template="03-school-festival"] .school-stage,html[data-oe-template="03-school-festival"] .school-ticket,html[data-oe-template="03-school-festival"] .school-map{display:grid;grid-template-columns:130px 1fr;gap:34px;padding:86px max(28px,6vw);border-bottom:3px solid #15304f}
html[data-oe-template="03-school-festival"] .school-block-no{font-size:92px;font-weight:950;line-height:.8;color:#cfe7ff}
html[data-oe-template="03-school-festival"] [data-oe-mount="quick"]{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.school-menu .quick-card{min-height:180px}
html[data-oe-template="03-school-festival"] [data-oe-mount="featured-activities"],html[data-oe-template="03-school-festival"] [data-oe-mount="tickets"]{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}
html[data-oe-template="03-school-festival"] .school-map{grid-template-columns:.65fr 1.35fr}.school-map>div:last-child{min-height:450px}
html[data-oe-template="03-school-festival"] .school-page{padding:92px max(28px,6vw);background:#f2f8ff;min-height:100vh}.school-page-head{display:grid;grid-template-columns:120px 1fr auto;gap:20px;align-items:end;border-bottom:3px solid #15304f;padding-bottom:18px;margin-bottom:28px}.school-page-head span{font-size:8px;letter-spacing:.15em;color:#2e8df5}.school-page-head h2{margin:0;font-size:48px}.school-guest-mount{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
html[data-oe-template="03-school-festival"] .school-footer{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:22px;padding:60px max(28px,6vw);background:#15304f;color:#fff}
@media(max-width:850px){html[data-oe-template="03-school-festival"] .school-site{padding-left:0}.school-fixed-rail{display:none!important}.school-hero{grid-template-columns:1fr!important}.school-status-grid{grid-template-columns:1fr}.school-status-grid>div{border-right:0;border-bottom:2px solid #15304f}.school-updates,.school-menu,.school-stage,.school-ticket,.school-map{grid-template-columns:1fr!important}.school-block-no{font-size:54px!important}.school-menu [data-oe-mount="quick"],.school-stage [data-oe-mount="featured-activities"],.school-ticket [data-oe-mount="tickets"],.school-guest-mount{grid-template-columns:1fr!important}}
`,
'04-museum-editorial':`
html[data-oe-template="04-museum-editorial"] .museum-site{background:#f7f5f0;color:#191816}.museum-titleband{display:grid;grid-template-columns:1fr 2fr 1fr;border-bottom:1px solid #aaa397}.museum-titleband span{padding:12px 22px;border-right:1px solid #aaa397;font-size:8px;letter-spacing:.18em}.museum-titleband span:last-child{text-align:right;border-right:0}
html[data-oe-template="04-museum-editorial"] .museum-hero{display:grid;grid-template-columns:110px 1.3fr .8fr;gap:50px;min-height:900px;padding:72px max(32px,7vw);align-items:center}.museum-hero-index{align-self:stretch;border-right:1px solid #aaa397;padding-right:20px;display:flex;flex-direction:column;justify-content:space-between}.museum-hero-index span{font-size:8px;letter-spacing:.2em}.museum-hero-index b{font:400 26px/1.15 Georgia,serif;writing-mode:vertical-rl}.museum-kv{min-height:720px}.museum-kv .kv{inset:0}.museum-copy{padding:0!important}
html[data-oe-template="04-museum-editorial"] .museum-introduction,html[data-oe-template="04-museum-editorial"] .museum-about,html[data-oe-template="04-museum-editorial"] .museum-news,html[data-oe-template="04-museum-editorial"] .museum-ticket,html[data-oe-template="04-museum-editorial"] .museum-event,html[data-oe-template="04-museum-editorial"] .museum-access,html[data-oe-template="04-museum-editorial"] .museum-index-menu{display:grid;grid-template-columns:180px 1fr;gap:48px;padding:120px max(32px,7vw);border-top:1px solid #aaa397}.museum-site aside{font-size:8px;letter-spacing:.2em;color:#6f695f}.museum-introduction h2{max-width:900px;margin:0 0 36px;font:400 clamp(44px,6vw,78px)/1.15 Georgia,serif}.museum-introduction p{max-width:640px;margin-left:auto;line-height:2}
html[data-oe-template="04-museum-editorial"] .museum-about-grid{display:grid;grid-template-columns:repeat(3,1fr);border-block:1px solid #aaa397}.museum-about-grid>div{padding:28px;border-right:1px solid #aaa397}.museum-about-grid small{display:block;margin-bottom:18px;font-size:8px;letter-spacing:.18em}.museum-about-grid b{font:400 24px/1.2 Georgia,serif}
html[data-oe-template="04-museum-editorial"] [data-oe-mount="updates"]{display:grid}.museum-news .update-item{display:grid;grid-template-columns:100px 1fr auto;padding:18px 0;border-bottom:1px solid #c7c1b6}
html[data-oe-template="04-museum-editorial"] [data-oe-mount="tickets"]{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid #aaa397}.museum-ticket .ticket{border-right:0;border-left:1px solid #aaa397}.museum-event [data-oe-mount="featured-activities"]{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:#aaa397}.museum-access{grid-template-columns:180px 1.5fr .5fr!important}.museum-index-menu [data-oe-mount="quick"]{display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid #aaa397}
html[data-oe-template="04-museum-editorial"] .museum-page{padding:120px max(32px,7vw);background:#f7f5f0;min-height:100vh}.museum-page-head{display:grid;grid-template-columns:180px 1fr auto;gap:36px;align-items:end;border-bottom:1px solid #aaa397;padding-bottom:18px;margin-bottom:48px}.museum-page-head span{font-size:8px;letter-spacing:.2em}.museum-page-head h2{margin:0;font:400 56px/1 Georgia,serif}.museum-guest-mount{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#aaa397}
html[data-oe-template="04-museum-editorial"] .museum-footer{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:30px;padding:72px max(32px,7vw);background:#191816;color:#f7f5f0}
@media(max-width:850px){html[data-oe-template="04-museum-editorial"] .museum-hero{grid-template-columns:1fr;min-height:auto}.museum-hero-index{display:none}.museum-kv{min-height:520px}.museum-introduction,.museum-about,.museum-news,.museum-ticket,.museum-event,.museum-access,.museum-index-menu{grid-template-columns:1fr!important;padding:82px 24px!important}.museum-about-grid,.museum-ticket [data-oe-mount="tickets"],.museum-event [data-oe-mount="featured-activities"],.museum-index-menu [data-oe-mount="quick"],.museum-guest-mount{grid-template-columns:1fr!important}}
`,
'05-live-poster':`
html[data-oe-template="05-live-poster"] .live-site{background:#0b0c11;color:#fff}.live-marquee-top{display:flex;justify-content:space-between;padding:10px 24px;background:linear-gradient(90deg,#ff3b74,#9d6bff,#72f5dc);color:#101116;font-size:8px;font-weight:950;letter-spacing:.16em}
html[data-oe-template="05-live-poster"] .live-hero{min-height:880px;display:grid;grid-template-columns:1.05fr .95fr;position:relative;padding:60px max(26px,6vw);overflow:hidden}.live-giant-five{position:absolute;left:-2vw;top:20px;font-size:min(50vw,610px);font-weight:1000;line-height:.8;color:transparent;-webkit-text-stroke:3px rgba(255,255,255,.09);z-index:0}.live-title-layer{position:relative;z-index:4;align-self:center}.live-copy{padding:0!important}.live-copy h1{font-size:clamp(86px,11vw,170px)!important;line-height:.7!important}.live-kv{min-height:720px}.live-kv .kv{inset:20px -40px 20px 20px}.live-date-chip{display:flex;align-items:baseline;gap:12px;margin-top:34px}.live-date-chip b{font-size:72px;line-height:.75;letter-spacing:-.07em}.live-date-chip span{padding:6px 9px;background:#72f5dc;color:#111;font-size:10px;font-weight:950}
html[data-oe-template="05-live-poster"] .live-news,html[data-oe-template="05-live-poster"] .live-cast,html[data-oe-template="05-live-poster"] .live-schedule-link,html[data-oe-template="05-live-poster"] .live-ticket,html[data-oe-template="05-live-poster"] .live-venue{padding:90px max(28px,6vw);border-top:1px solid #343744}.live-section-label,.live-news>span,.live-schedule-link>span{display:block;margin-bottom:20px;font-size:9px;letter-spacing:.2em;color:#72f5dc}.live-cast h2{max-width:900px;font-size:clamp(44px,7vw,92px);line-height:.9;font-style:italic}
html[data-oe-template="05-live-poster"] [data-oe-mount="featured-activities"]{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:34px}.live-schedule-link [data-oe-mount="quick"]{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.live-ticket [data-oe-mount="tickets"]{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.live-venue-grid{display:grid;grid-template-columns:1.5fr .5fr;gap:20px;min-height:480px}
html[data-oe-template="05-live-poster"] .live-page{padding:92px max(28px,6vw);background:#0b0c11;color:#fff;min-height:100vh}.live-page-head{display:grid;grid-template-columns:160px 1fr auto;align-items:end;border-bottom:1px solid #343744;padding-bottom:16px;margin-bottom:30px}.live-page-head span{font-size:8px;letter-spacing:.2em;color:#72f5dc}.live-page-head h2{margin:0;font-size:58px;font-style:italic}.live-guest-mount{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
html[data-oe-template="05-live-poster"] .live-footer{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:26px;padding:64px max(28px,6vw);background:#05060a;color:#fff}
@media(max-width:850px){html[data-oe-template="05-live-poster"] .live-hero{grid-template-columns:1fr}.live-kv{min-height:520px}.live-news,.live-cast,.live-schedule-link,.live-ticket,.live-venue{padding:68px 22px!important}.live-cast [data-oe-mount="featured-activities"],.live-schedule-link [data-oe-mount="quick"],.live-ticket [data-oe-mount="tickets"],.live-guest-mount{grid-template-columns:1fr!important}.live-venue-grid{grid-template-columns:1fr}.live-marquee-top span:nth-child(2){display:none}}
`,
'06-expo-catalogue':`
html[data-oe-template="06-expo-catalogue"] .expo-site{background:#f3f2ee;color:#101820}.expo-area-tabs{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:2px solid #101820}.expo-area-tabs span{padding:12px 16px;border-right:2px solid #101820;font-size:8px;font-weight:950;letter-spacing:.08em}.expo-area-tabs span:nth-child(1){background:#5fe3ea}.expo-area-tabs span:nth-child(2){background:#ff69ad}.expo-area-tabs span:nth-child(3){background:#ffd94f}
html[data-oe-template="06-expo-catalogue"] .expo-hero{display:grid;grid-template-columns:.95fr 1.05fr 250px;min-height:690px;border-bottom:2px solid #101820}.expo-hero-title{padding:64px 38px max(30px,6vw);align-self:center}.expo-copy{padding:0!important}.expo-date{margin-top:36px;padding-top:18px;border-top:2px solid #101820;font-size:22px;font-weight:950}.expo-kv{min-height:690px;border-inline:2px solid #101820}.expo-kv .kv{inset:0}.expo-contents-index{padding:28px 20px}.expo-contents-index>b{display:block;padding-bottom:12px;border-bottom:2px solid #101820;font-size:9px;letter-spacing:.12em}.expo-contents-index ol{list-style:none;padding:0;margin:0;counter-reset:x}.expo-contents-index li{padding:13px 0;border-bottom:1px solid #aaa7a0;font-size:9px;font-weight:900}.expo-contents-index li:before{counter-increment:x;content:"0" counter(x);display:inline-block;width:36px;color:#ff5b35}
html[data-oe-template="06-expo-catalogue"] .expo-news,html[data-oe-template="06-expo-catalogue"] .expo-index-menu,html[data-oe-template="06-expo-catalogue"] .expo-ticket,html[data-oe-template="06-expo-catalogue"] .expo-program,html[data-oe-template="06-expo-catalogue"] .expo-map{display:grid;grid-template-columns:170px 1fr;gap:24px;padding:74px max(26px,5vw);border-bottom:2px solid #101820}.expo-code{font-size:9px;font-weight:950;letter-spacing:.12em}
html[data-oe-template="06-expo-catalogue"] .expo-area-board{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:2px solid #101820}.expo-area-board>div{padding:48px 34px;min-height:190px;border-right:2px solid #101820}.expo-area-board .cyan{background:#5fe3ea}.expo-area-board .magenta{background:#ff69ad}.expo-area-board .yellow{background:#ffd94f}.expo-area-board span{font-size:8px;letter-spacing:.12em}.expo-area-board b{display:block;margin-top:34px;font-size:26px}
html[data-oe-template="06-expo-catalogue"] [data-oe-mount="quick"]{display:grid;grid-template-columns:repeat(5,1fr);gap:0;border:2px solid #101820}.expo-index-menu .quick-card{border:0;border-right:1px solid #101820;border-radius:0}.expo-ticket [data-oe-mount="tickets"],.expo-program [data-oe-mount="featured-activities"]{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:2px solid #101820}.expo-map-grid{display:grid;grid-template-columns:1.4fr .6fr;gap:20px}
html[data-oe-template="06-expo-catalogue"] .expo-page{padding:78px max(26px,5vw);background:#f3f2ee;min-height:100vh}.expo-page-head{display:grid;grid-template-columns:170px 1fr auto;gap:20px;align-items:end;border-bottom:2px solid #101820;padding-bottom:12px;margin-bottom:30px}.expo-page-head span{font-size:8px;letter-spacing:.12em}.expo-page-head h2{margin:0;font-size:52px;text-transform:uppercase}.expo-guest-mount{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:2px solid #101820}
html[data-oe-template="06-expo-catalogue"] .expo-footer{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:20px;padding:52px max(26px,5vw);background:#101820;color:#fff}
@media(max-width:850px){html[data-oe-template="06-expo-catalogue"] .expo-hero{grid-template-columns:1fr}.expo-contents-index{display:none}.expo-kv{min-height:500px;border-inline:0;border-top:2px solid #101820}.expo-area-tabs,.expo-area-board{grid-template-columns:1fr}.expo-news,.expo-index-menu,.expo-ticket,.expo-program,.expo-map{grid-template-columns:1fr!important}.expo-index-menu [data-oe-mount="quick"],.expo-ticket [data-oe-mount="tickets"],.expo-program [data-oe-mount="featured-activities"],.expo-guest-mount{grid-template-columns:1fr!important}.expo-map-grid{grid-template-columns:1fr}}
`,
'07-immersive-character':`
html[data-oe-template="07-immersive-character"] .kimetsu-site{background:#10182a;color:#f5efe3}.kimetsu-hero{display:grid;grid-template-columns:1.15fr .85fr;min-height:920px;position:relative;padding:62px max(26px,7vw);background:radial-gradient(circle at 24% 20%,#24476a55,transparent 32%),#10182a}.kimetsu-title-seal{position:absolute;left:5vw;top:46px;z-index:5;display:grid;gap:6px}.kimetsu-title-seal span{font:500 32px/1 serif;letter-spacing:.18em}.kimetsu-title-seal small{font-size:8px;letter-spacing:.22em;color:#d7b177}.kimetsu-kv{min-height:780px}.kimetsu-kv .kv{inset:45px 24px 45px 0;border:8px solid #6f4f34;border-radius:0;clip-path:polygon(0 5%,95% 0,100% 95%,5% 100%)}.kimetsu-copy{align-self:end;padding:0 0 74px 38px!important}.kimetsu-copy h1{font-family:serif!important;font-weight:500!important;letter-spacing:-.03em!important}
html[data-oe-template="07-immersive-character"] .kimetsu-prologue,html[data-oe-template="07-immersive-character"] .kimetsu-news,html[data-oe-template="07-immersive-character"] .kimetsu-path{display:grid;grid-template-columns:120px 1fr;gap:40px;padding:112px max(26px,7vw);border-top:1px solid #6f4f34;background:#0c1930}.kimetsu-chapter-no{font:500 62px/1 serif;color:#d7b177;opacity:.8}.kimetsu-prologue h2{font:500 clamp(44px,6vw,78px)/1.15 serif;letter-spacing:.08em}
html[data-oe-template="07-immersive-character"] .kimetsu-ticket,html[data-oe-template="07-immersive-character"] .kimetsu-event,html[data-oe-template="07-immersive-character"] .kimetsu-map{padding:110px max(26px,7vw);border-top:8px solid #6f4f34;background:linear-gradient(180deg,#10182a,#0d1423)}.kimetsu-chapter-head{display:flex;align-items:baseline;gap:28px;margin-bottom:38px}.kimetsu-chapter-head span{font-family:serif;letter-spacing:.25em;color:#d7b177}.kimetsu-chapter-head h2{margin:0;font:500 46px/1 serif;letter-spacing:.08em}
html[data-oe-template="07-immersive-character"] [data-oe-mount="quick"]{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}.kimetsu-ticket [data-oe-mount="tickets"],.kimetsu-event [data-oe-mount="featured-activities"]{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.kimetsu-map-grid{display:grid;grid-template-columns:1.4fr .6fr;gap:24px}
html[data-oe-template="07-immersive-character"] .kimetsu-page{padding:100px max(26px,7vw);background:#10182a;color:#f5efe3;min-height:100vh}.kimetsu-page-head{display:grid;grid-template-columns:150px 1fr auto;align-items:end;border-bottom:1px solid #6f4f34;padding-bottom:16px;margin-bottom:34px}.kimetsu-page-head span{font-size:8px;letter-spacing:.2em;color:#d7b177}.kimetsu-page-head h2{margin:0;font:500 52px/1 serif}.kimetsu-guest-mount{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
html[data-oe-template="07-immersive-character"] .kimetsu-footer{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:28px;padding:72px max(26px,7vw);background:#080d17;color:#f5efe3;border-top:8px solid #6f4f34}
@media(max-width:850px){html[data-oe-template="07-immersive-character"] .kimetsu-hero{grid-template-columns:1fr;min-height:auto}.kimetsu-kv{min-height:520px}.kimetsu-copy{padding:30px 0!important}.kimetsu-prologue,.kimetsu-news,.kimetsu-path{grid-template-columns:1fr!important}.kimetsu-ticket [data-oe-mount="tickets"],.kimetsu-event [data-oe-mount="featured-activities"],.kimetsu-path [data-oe-mount="quick"],.kimetsu-guest-mount{grid-template-columns:1fr!important}.kimetsu-map-grid{grid-template-columns:1fr}}
`
};


const componentSystems={
'02-scrapbook':`
html[data-oe-template="02-scrapbook"] .scrap-pass{position:relative!important;display:grid!important;grid-template-columns:1fr 150px!important;gap:0!important;padding:0!important;background:#fffaf0!important;border:1px solid #bcae9c!important;border-radius:4px!important;box-shadow:0 14px 28px #5f4d3e18!important;overflow:hidden!important}
html[data-oe-template="02-scrapbook"] .scrap-pass-no{position:absolute;left:18px;top:14px;font-size:7px;font-weight:900;letter-spacing:.18em;color:#8e7e6e}
html[data-oe-template="02-scrapbook"] .scrap-pass-main{padding:44px 24px 24px!important;border-right:1px dashed #bcae9c}.scrap-pass .ticket-copy h3{font:500 28px/1.1 Georgia,serif}.scrap-pass .price{font:700 34px/1 Georgia,serif;color:#ef6f80}
html[data-oe-template="02-scrapbook"] .scrap-pass-stub{margin:0!important;padding:44px 18px 18px!important;background:#dcecf0!important;border:0!important;display:flex!important;flex-direction:column;justify-content:flex-end}.scrap-pass-stub b{font-size:7px;letter-spacing:.15em}.scrap-pass>small{position:absolute;left:24px;bottom:14px;color:#7f7165}
html[data-oe-template="02-scrapbook"] .scrap-directory-tabs{background:#fffaf0;border:1px solid #bcae9c!important;border-radius:3px!important;box-shadow:6px 6px 0 #c8b9a4!important}
html[data-oe-template="02-scrapbook"] .scrap-directory .booth-directory-grid,html[data-oe-template="02-scrapbook"] .scrap-directory .product-directory-grid{grid-template-columns:repeat(2,1fr)!important;gap:22px!important}
html[data-oe-template="02-scrapbook"] .scrap-index-card{position:relative!important;background:#fffdf7!important;border:1px solid #c9baa7!important;border-radius:3px!important;padding:34px 24px 22px!important;box-shadow:0 10px 22px #5f4d3e15!important;transform:rotate(var(--scrap-card-rot,-.6deg))}
html[data-oe-template="02-scrapbook"] .scrap-index-card:nth-child(even){--scrap-card-rot:.7deg}.scrap-index-no,.scrap-product-no,.scrap-photo-no,.scrap-diary-mark,.scrap-guide-tab,.scrap-contact-no{font-size:7px;font-weight:900;letter-spacing:.16em;color:#8e7e6e}
html[data-oe-template="02-scrapbook"] .scrap-index-no{position:absolute;right:18px;top:14px}.scrap-index-card .booth-card-head{grid-template-columns:72px 1fr!important}.scrap-index-card .booth-logo{border-radius:50%!important;border:6px solid #fff!important;box-shadow:0 4px 10px #0002}
html[data-oe-template="02-scrapbook"] .scrap-product-tag{position:relative!important;background:#fff8ea!important;border:1px solid #cabda9!important;border-radius:2px!important;box-shadow:5px 6px 0 #d6c5ad!important}.scrap-product-no{position:absolute;right:10px;top:8px;z-index:2}
html[data-oe-template="02-scrapbook"] .scrap-polaroid-wall{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:34px!important;align-items:start}
html[data-oe-template="02-scrapbook"] .scrap-polaroid{position:relative!important;display:block!important;background:#fff!important;border:1px solid #c7b9a7!important;border-radius:2px!important;padding:14px 14px 48px!important;box-shadow:0 16px 28px #4b3c301d!important;transform:rotate(var(--polaroid-rot,-1deg))}
html[data-oe-template="02-scrapbook"] .scrap-polaroid:nth-child(2n){--polaroid-rot:1.4deg}.scrap-polaroid:nth-child(3n){--polaroid-rot:-2deg}.scrap-polaroid .guest-poster-media{aspect-ratio:1/1!important}.scrap-polaroid .guest-copy{padding:18px 6px 0!important}.scrap-photo-no{position:absolute;left:18px;bottom:16px}
html[data-oe-template="02-scrapbook"] .scrap-diary{border-left:1px dashed #bcae9c;padding-left:28px!important}.scrap-diary-entry{position:relative!important;display:grid!important;grid-template-columns:100px 1fr!important;gap:22px!important;border:0!important;border-bottom:1px dashed #c6b8a5!important;background:transparent!important;padding:24px 0!important}.scrap-diary-mark{position:absolute;left:-72px;top:28px;background:#d9ff46;padding:5px 8px;transform:rotate(-5deg)}
html[data-oe-template="02-scrapbook"] .scrap-diary-entry .timetable-no{display:none}.scrap-diary-entry .timetable-time{background:#dcecf0!important;border:0!important;border-radius:2px!important;padding:12px!important}.scrap-diary-entry .timetable-main{padding:0!important}
html[data-oe-template="02-scrapbook"] .scrap-foldout-guide .guide-detail-content{display:grid!important;grid-template-columns:1fr 1fr!important;gap:22px!important}.scrap-guide-note{position:relative;background:#fffaf0!important;border:1px solid #c9baa7!important;border-radius:3px!important;box-shadow:5px 6px 0 #d6c5ad!important}.scrap-guide-tab{position:absolute;right:16px;top:-10px;background:#f5a5b2;padding:5px 8px;color:#4e3a3d}
html[data-oe-template="02-scrapbook"] .scrap-contact-sheet{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:18px!important}.scrap-contact-card{position:relative!important;background:#fffaf0!important;border:1px solid #c9baa7!important;border-radius:3px!important;padding-top:34px!important}.scrap-contact-no{position:absolute;top:12px;right:12px}
html[data-oe-template="02-scrapbook"] .scrap-featured-film{display:flex!important;gap:26px!important;overflow-x:auto!important;padding:18px 6px 30px!important;scroll-snap-type:x mandatory}.scrap-film-frame{min-width:320px!important;scroll-snap-align:start!important;position:relative!important;border:10px solid #fff!important;border-bottom-width:44px!important;border-radius:2px!important;background:#fff!important;box-shadow:0 14px 26px #4f40341c!important;transform:rotate(var(--film-rot,-1deg))}.scrap-film-frame:nth-child(even){--film-rot:1.2deg}.scrap-film-no{position:absolute;left:16px;bottom:14px;font-size:7px;font-weight:900;letter-spacing:.16em;color:#786b60}
html[data-oe-template="02-scrapbook"] .scrap-activity-album{display:block!important}.scrap-activity-page{position:relative!important;display:grid!important;grid-template-columns:1.1fr .9fr!important;gap:28px!important;margin-bottom:32px!important;padding:44px!important;background:#fffaf0!important;border:1px solid #c9baa7!important;box-shadow:8px 10px 0 #d6c5ad!important;border-radius:3px!important}.scrap-album-no{position:absolute;right:18px;top:16px;font-size:7px;font-weight:900;letter-spacing:.18em;color:#8e7e6e}.scrap-activity-page:nth-child(even) .activity-feature-media{order:-1}
html[data-oe-template="02-scrapbook"] .scrap-post-log .update-item{grid-template-columns:80px 1fr auto!important;border-bottom:1px dashed #bcae9c!important}
@media(max-width:760px){html[data-oe-template="02-scrapbook"] .scrap-pass{grid-template-columns:1fr!important}.scrap-pass-main{border-right:0!important;border-bottom:1px dashed #bcae9c}.scrap-directory .booth-directory-grid,.scrap-directory .product-directory-grid,.scrap-polaroid-wall,.scrap-foldout-guide .guide-detail-content,.scrap-contact-sheet{grid-template-columns:1fr!important}.scrap-diary-entry{grid-template-columns:1fr!important}}
`,
'03-school-festival':`
html[data-oe-template="03-school-festival"] .school-admission{position:relative!important;border:3px solid #15304f!important;border-radius:18px!important;background:#fff!important;box-shadow:8px 8px 0 #ffe46b!important;padding-top:42px!important}.school-card-no{position:absolute;top:14px;left:18px;font-size:8px;font-weight:950;letter-spacing:.14em;color:#2e8df5}.school-admission .price{font-size:36px!important;color:#2e8df5}
html[data-oe-template="03-school-festival"] .school-directory .booth-directory-tools{border:3px solid #15304f!important;border-radius:18px!important;background:#fff!important;box-shadow:7px 7px 0 #cfe7ff!important}.school-directory .booth-directory-grid{grid-template-columns:repeat(3,1fr)!important;gap:14px!important}.school-club-card{position:relative!important;border:3px solid #15304f!important;border-radius:18px!important;background:#fff!important;box-shadow:none!important;padding-top:44px!important}.school-club-index,.school-profile-id,.school-rule-index{position:absolute;top:12px;right:14px;font-size:8px;font-weight:950;letter-spacing:.1em;color:#2e8df5}.school-goods-card{border:3px solid #15304f!important;border-radius:18px!important;background:#fff!important}
html[data-oe-template="03-school-festival"] .school-profile-grid{grid-template-columns:repeat(4,1fr)!important;gap:14px!important}.school-profile{position:relative!important;border:3px solid #15304f!important;border-radius:18px!important;background:#fff!important;box-shadow:6px 6px 0 #cfe7ff!important;padding-top:36px!important}.school-profile .guest-poster-media{border-radius:12px!important;overflow:hidden}
html[data-oe-template="03-school-festival"] .school-timetable-board{border:3px solid #15304f;background:#fff!important;padding:0!important}.school-period{grid-template-columns:68px 120px 1fr!important;border-bottom:2px solid #15304f!important;background:#fff!important}.school-period:nth-child(odd){background:#f3f9ff!important}.school-period .timetable-no{background:#ffe46b!important;color:#15304f!important}
html[data-oe-template="03-school-festival"] .school-rulebook .guide-detail-content{display:grid!important;grid-template-columns:repeat(2,1fr)!important;gap:16px!important}.school-rule{position:relative!important;border:3px solid #15304f!important;border-radius:18px!important;background:#fff!important;box-shadow:6px 6px 0 #cfe7ff!important;padding-top:38px!important}
html[data-oe-template="03-school-festival"] .school-stage-cards{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:14px!important}.school-stage-card{position:relative!important;border:3px solid #15304f!important;border-radius:18px!important;background:#fff!important;box-shadow:7px 7px 0 #ffe46b!important;padding-top:36px!important}.school-stage-card>.school-card-no{position:absolute;top:10px;left:14px}
html[data-oe-template="03-school-festival"] .school-program-board{display:grid!important;grid-template-columns:repeat(2,1fr)!important;gap:16px!important}.school-program-card{position:relative!important;border:3px solid #15304f!important;border-radius:18px!important;background:#fff!important;box-shadow:6px 6px 0 #cfe7ff!important;padding-top:42px!important}.school-program-card>.school-card-no{position:absolute;top:12px;right:14px}
`,
'04-museum-editorial':`
html[data-oe-template="04-museum-editorial"] .museum-admission{position:relative!important;display:grid!important;grid-template-columns:1fr 110px!important;border:0!important;border-top:1px solid #aaa397!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;padding:38px 0 28px!important}.museum-object-no{font-size:8px;letter-spacing:.18em;color:#776f64}.museum-admission>.museum-object-no{position:absolute;top:12px;left:0}.museum-admission .ticket-top{display:block!important}.museum-admission .price{font:400 34px/1 Georgia,serif!important;color:#191816!important}.museum-admission .gift{border:0!important;border-left:1px solid #aaa397!important;border-radius:0!important;background:transparent!important}
html[data-oe-template="04-museum-editorial"] .museum-catalogue .booth-directory-tools{position:relative!important;top:auto!important;z-index:1!important;border:0!important;border-block:1px solid #aaa397!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}.museum-catalogue .booth-directory-grid{display:block!important}.museum-catalogue-row{position:relative!important;display:grid!important;grid-template-columns:120px minmax(0,1fr) 190px!important;align-items:center;border:0!important;border-bottom:1px solid #c7c1b6!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;padding:34px 0!important;min-height:138px!important;scroll-margin-top:32px;isolation:isolate;overflow:hidden!important}.museum-catalogue-row .booth-card-foot{position:relative;z-index:8;justify-self:end}.museum-catalogue-row .favorite-booth,.museum-catalogue-row .booth-products-link{position:relative;z-index:9}.museum-catalogue-row .booth-logo{position:relative;z-index:1}.museum-catalogue-row>.museum-object-no{position:absolute;top:10px;left:0}.museum-catalogue-row .booth-card-head{grid-template-columns:72px 1fr!important}.museum-catalogue-row>p{margin:0!important}
html[data-oe-template="04-museum-editorial"] .museum-portrait-index{display:block!important}.museum-portrait{position:relative!important;display:grid!important;grid-template-columns:minmax(260px,.8fr) 1.2fr!important;gap:48px!important;border:0!important;border-bottom:1px solid #aaa397!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;padding:52px 0!important}.museum-portrait:nth-child(even) .guest-poster-media{order:2}.museum-portrait>.museum-object-no{position:absolute;top:18px;left:0}.museum-portrait .guest-poster-media{min-height:430px!important}.museum-portrait .guest-copy{align-self:center!important;padding:0!important}.museum-portrait .guest-poster-name{font:400 42px/1.1 Georgia,serif!important}
html[data-oe-template="04-museum-editorial"] .museum-programme{border-top:1px solid #aaa397}.museum-programme-row{position:relative!important;display:grid!important;grid-template-columns:120px 160px 1fr!important;gap:28px!important;border:0!important;border-bottom:1px solid #aaa397!important;border-radius:0!important;background:transparent!important;padding:30px 0!important}.museum-programme-row>.museum-object-no{position:absolute;top:8px;left:0}.museum-programme-row .timetable-no{display:none!important}.museum-programme-row .timetable-time{background:transparent!important;border:0!important;padding:0!important}
html[data-oe-template="04-museum-editorial"] .museum-notes .guide-detail-content{display:block!important}.museum-note{position:relative!important;border:0!important;border-top:1px solid #aaa397!important;border-radius:0!important;background:transparent!important;padding:42px 0!important}.museum-note>.museum-object-no{display:block;margin-bottom:16px}
html[data-oe-template="04-museum-editorial"] .museum-feature-index{display:grid!important;grid-template-columns:1fr 1fr!important;gap:1px!important;background:#aaa397!important}.museum-feature-object{position:relative!important;border:0!important;border-radius:0!important;background:#f7f5f0!important;box-shadow:none!important;padding-top:36px!important}.museum-feature-object>.museum-object-no{position:absolute;top:12px;left:16px}
html[data-oe-template="04-museum-editorial"] .museum-exhibition-program{display:block!important}.museum-program-object{position:relative!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:42px!important;border:0!important;border-top:1px solid #aaa397!important;border-radius:0!important;background:transparent!important;padding:52px 0!important}.museum-program-object>.museum-object-no{position:absolute;top:16px;left:0}
`,
'05-live-poster':`
html[data-oe-template="05-live-poster"] .live-pass{position:relative!important;display:grid!important;grid-template-columns:1fr 130px!important;border:1px solid #3f4250!important;border-radius:0!important;background:linear-gradient(135deg,#161822,#0e0f15)!important;box-shadow:none!important;padding-top:38px!important;overflow:hidden!important}.live-pass:after{content:"";position:absolute;left:0;right:0;top:0;height:6px;background:linear-gradient(90deg,#ff3b74,#9d6bff,#72f5dc)}.live-pass-type,.live-card-index{font-size:8px;font-weight:950;letter-spacing:.15em;color:#72f5dc}.live-pass>.live-pass-type{position:absolute;top:16px;left:18px}.live-pass .price{font-size:38px!important;color:#fff!important}.live-pass .gift{border:0!important;border-left:1px solid #3f4250!important;background:#0b0c11!important}
html[data-oe-template="05-live-poster"] .live-merch-directory .booth-directory-tools{border:1px solid #3f4250!important;border-radius:0!important;background:#11131b!important}.live-merch-directory .booth-directory-grid{grid-template-columns:repeat(2,1fr)!important;gap:1px!important;background:#3f4250!important}.live-merch-booth{position:relative!important;border:0!important;border-radius:0!important;background:#11131b!important;box-shadow:none!important;padding-top:42px!important}.live-merch-booth>.live-card-index{position:absolute;right:14px;top:14px}.live-merch-item{border-radius:0!important;border-color:#3f4250!important;background:#11131b!important}
html[data-oe-template="05-live-poster"] .live-lineup{display:grid!important;grid-template-columns:repeat(2,1fr)!important;gap:1px!important;background:#3f4250!important}.live-performer{position:relative!important;display:grid!important;grid-template-columns:1fr 1fr!important;border:0!important;border-radius:0!important;background:#11131b!important;box-shadow:none!important;padding-top:38px!important}.live-performer>.live-card-index{position:absolute;top:14px;left:16px}.live-performer .guest-poster-media{min-height:320px!important}.live-performer .guest-copy{align-self:end!important}.live-performer .guest-poster-name{font-size:34px!important;font-style:italic}
html[data-oe-template="05-live-poster"] .live-stage-board{border-top:1px solid #3f4250}.live-slot{position:relative!important;grid-template-columns:90px 130px 1fr!important;border:0!important;border-bottom:1px solid #3f4250!important;border-radius:0!important;background:#0b0c11!important;padding-top:38px!important}.live-slot>.live-card-index{position:absolute;left:14px;top:12px}.live-slot .timetable-no{display:none!important}.live-slot .timetable-time{background:#ff3b74!important;color:#fff!important;border-radius:0!important;border:0!important}.live-slot .timetable-main>b{font-size:26px!important;font-style:italic}
html[data-oe-template="05-live-poster"] .live-featured-lineup{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:1px!important;background:#3f4250!important}.live-featured-card{position:relative!important;border:0!important;border-radius:0!important;background:#11131b!important;box-shadow:none!important;padding-top:36px!important}.live-featured-card>.live-card-index{position:absolute;top:12px;left:14px}
html[data-oe-template="05-live-poster"] .live-program-lineup{display:block!important}.live-program-card{position:relative!important;display:grid!important;grid-template-columns:1.1fr .9fr!important;gap:30px!important;border:0!important;border-bottom:1px solid #3f4250!important;border-radius:0!important;background:#0b0c11!important;padding:48px 0 28px!important}.live-program-card>.live-card-index{position:absolute;top:14px;left:0}.live-program-card .activity-feature-head h3{font-size:42px!important;font-style:italic}
`,
'06-expo-catalogue':`
html[data-oe-template="06-expo-catalogue"] .expo-ticket-row,html[data-oe-template="06-expo-catalogue"] .expo-directory-row,html[data-oe-template="06-expo-catalogue"] .expo-product-row,html[data-oe-template="06-expo-catalogue"] .expo-guest-row,html[data-oe-template="06-expo-catalogue"] .expo-schedule-row{position:relative!important;border:0!important;border-bottom:1px solid #101820!important;border-radius:0!important;background:#f3f2ee!important;box-shadow:none!important}.expo-cell-code{font:900 8px/1 Arial,sans-serif;letter-spacing:.08em;color:#ff5b35}
html[data-oe-template="06-expo-catalogue"] .expo-ticket-row{display:grid!important;grid-template-columns:100px 1fr 180px!important;padding:30px 0!important}.expo-ticket-row>.expo-cell-code{align-self:start;padding-top:6px}.expo-ticket-row .ticket-top{grid-column:2}.expo-ticket-row .gift{grid-column:3;border:0!important;border-left:1px solid #101820!important;background:transparent!important}
html[data-oe-template="06-expo-catalogue"] .expo-directory-table .booth-directory-tools{border:2px solid #101820!important;border-radius:0!important;background:#f3f2ee!important}.expo-directory-table .booth-directory-grid,.expo-directory-table .product-directory-grid{display:block!important}.expo-directory-row{display:grid!important;grid-template-columns:90px 1fr 260px!important;align-items:center;padding:26px 0!important}.expo-directory-row>.expo-cell-code{padding-left:12px}.expo-directory-row .booth-card-head{grid-template-columns:56px 1fr!important}.expo-directory-row .booth-card-foot{justify-self:end!important}
html[data-oe-template="06-expo-catalogue"] .expo-product-row{display:grid!important;grid-template-columns:90px 120px 1fr 120px!important;align-items:center;padding:18px 0!important}.expo-product-row>.expo-cell-code{padding-left:12px}.expo-product-row .directory-product-image{grid-column:2}.expo-product-row .directory-product-copy{grid-column:3}.expo-product-row .wishlist-product{grid-column:4}
html[data-oe-template="06-expo-catalogue"] .expo-guest-table{display:block!important}.expo-guest-row{display:grid!important;grid-template-columns:90px 180px 1fr!important;gap:24px!important;padding:30px 0!important}.expo-guest-row>.expo-cell-code{padding-left:12px}.expo-guest-row .guest-poster-media{grid-column:2;min-height:180px!important}.expo-guest-row .guest-copy{grid-column:3;padding:0!important}.expo-guest-row .guest-poster-name{font-size:30px!important}
html[data-oe-template="06-expo-catalogue"] .expo-schedule-table{border-top:2px solid #101820}.expo-schedule-row{display:grid!important;grid-template-columns:90px 140px 1fr!important;padding:22px 0!important}.expo-schedule-row>.expo-cell-code{padding-left:12px}.expo-schedule-row .timetable-no{display:none!important}.expo-schedule-row .timetable-time{background:transparent!important;border:0!important;border-right:1px solid #101820!important}
html[data-oe-template="06-expo-catalogue"] .expo-feature-table{display:block!important;border-top:2px solid #101820!important}.expo-feature-row{position:relative!important;display:grid!important;grid-template-columns:90px 220px 1fr!important;gap:0!important;border:0!important;border-bottom:1px solid #101820!important;border-radius:0!important;background:#f3f2ee!important;box-shadow:none!important;padding:0!important}.expo-feature-row>.expo-cell-code{padding:22px 12px}.expo-feature-row .featured-activity-media{grid-column:2;min-height:160px!important}.expo-feature-row .featured-activity-copy{grid-column:3;padding:24px!important}
html[data-oe-template="06-expo-catalogue"] .expo-program-table{display:block!important;border-top:2px solid #101820!important}.expo-program-row{position:relative!important;display:grid!important;grid-template-columns:90px 1fr!important;border:0!important;border-bottom:1px solid #101820!important;border-radius:0!important;background:#f3f2ee!important;padding:0!important}.expo-program-row>.expo-cell-code{padding:24px 12px}.expo-program-row .activity-feature-copy{grid-column:2;padding:24px!important}.expo-program-row .activity-feature-media{grid-column:2}
`,
'07-immersive-character':`
html[data-oe-template="07-immersive-character"] .imm-admission-slip,html[data-oe-template="07-immersive-character"] .imm-stall,html[data-oe-template="07-immersive-character"] .imm-character,html[data-oe-template="07-immersive-character"] .imm-chronicle-row,html[data-oe-template="07-immersive-character"] .imm-rule{position:relative!important;background:linear-gradient(180deg,#efe2c8,#e6d1aa)!important;color:#2d211a!important;border:1px solid #795e43!important;border-radius:0!important;box-shadow:inset 0 0 28px #735a3e18!important}.imm-seal{font:600 11px/1 serif;letter-spacing:.18em;color:#8f2f2f}
html[data-oe-template="07-immersive-character"] .imm-admission-slip{padding:46px 28px 28px!important}.imm-admission-slip>.imm-seal{position:absolute;right:20px;top:18px;border:1px solid #8f2f2f;padding:6px;writing-mode:vertical-rl}.imm-admission-slip .price{font-family:serif!important;color:#2d211a!important}.imm-admission-slip .gift{background:transparent!important;border:0!important;border-top:1px solid #96795e!important}
html[data-oe-template="07-immersive-character"] .imm-stall-scroll .booth-directory-tools{background:#0c1930!important;border:1px solid #6f4f34!important;border-radius:0!important}.imm-stall-scroll .booth-directory-grid{grid-template-columns:repeat(2,1fr)!important;gap:18px!important}.imm-stall{padding:44px 24px 22px!important}.imm-stall>.imm-seal{position:absolute;top:12px;right:14px}
html[data-oe-template="07-immersive-character"] .imm-character-scroll{display:block!important}.imm-character{display:grid!important;grid-template-columns:280px 1fr!important;gap:40px!important;margin-bottom:18px!important;padding:34px!important}.imm-character:nth-child(even) .guest-poster-media{order:2}.imm-character>.imm-seal{position:absolute;right:18px;top:18px}.imm-character .guest-copy{padding:0!important;align-self:center!important}.imm-character .guest-poster-name{font-family:serif!important;font-size:38px!important}
html[data-oe-template="07-immersive-character"] .imm-chronicle{border-left:4px double #795e43;padding-left:28px!important}.imm-chronicle-row{display:grid!important;grid-template-columns:100px 1fr!important;gap:24px!important;margin-bottom:18px!important;padding:34px!important}.imm-chronicle-row>.imm-seal{position:absolute;left:-64px;top:24px;background:#10182a;color:#d7b177;padding:7px}.imm-chronicle-row .timetable-no{display:none!important}.imm-chronicle-row .timetable-time{background:transparent!important;border:0!important;border-right:1px solid #96795e!important}
html[data-oe-template="07-immersive-character"] .imm-rule-scroll .guide-detail-content{display:block!important}.imm-rule{margin-bottom:18px!important;padding-top:42px!important}.imm-rule>.imm-seal{position:absolute;top:14px;right:16px}
html[data-oe-template="07-immersive-character"] .imm-feature-scroll{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:18px!important}.imm-feature{position:relative!important;background:linear-gradient(180deg,#efe2c8,#e6d1aa)!important;color:#2d211a!important;border:1px solid #795e43!important;border-radius:0!important;box-shadow:inset 0 0 28px #735a3e18!important;padding-top:42px!important}.imm-feature>.imm-seal{position:absolute;top:14px;right:16px}
html[data-oe-template="07-immersive-character"] .imm-event-scroll{display:block!important}.imm-event{position:relative!important;display:grid!important;grid-template-columns:1fr 320px!important;gap:30px!important;margin-bottom:22px!important;padding:48px 34px 30px!important;background:linear-gradient(180deg,#efe2c8,#e6d1aa)!important;color:#2d211a!important;border:1px solid #795e43!important;border-radius:0!important}.imm-event>.imm-seal{position:absolute;top:14px;right:16px}
`
};


const entrySystems={
'02-scrapbook':`
html[data-oe-template="02-scrapbook"] .loader{background:#efe7d8;background-image:linear-gradient(#d9cdbc55 1px,transparent 1px),linear-gradient(90deg,#d9cdbc55 1px,transparent 1px);background-size:22px 22px}
html[data-oe-template="02-scrapbook"] .gate{width:min(850px,88vw);grid-template-columns:1.2fr .8fr;transform:rotate(-1.2deg);box-shadow:18px 20px 0 #b9a58f;border-color:#5f534b;border-radius:3px;background:#fffaf0}
html[data-oe-template="02-scrapbook"] .entry-photo{border:12px solid #fff;border-bottom-width:48px;box-shadow:0 8px 18px #0002;transform:rotate(-2deg)}
html[data-oe-template="02-scrapbook"] .ticket-half.right{background:#dcecf0;border-left:1px dashed #8c7c6d}
html[data-oe-template="02-scrapbook"] .entry-ticket-label{font-family:Georgia,serif;letter-spacing:.16em}.entry-ticket-title{font-family:Georgia,serif}
html[data-oe-template="02-scrapbook"] .stub-barcode{opacity:.45}.skip{background:#d9ff46;color:#342d2f;border-color:#5f534b}
`,
'03-school-festival':`
html[data-oe-template="03-school-festival"] .loader{background:#eaf5ff;background-image:radial-gradient(circle,#badcff 2px,transparent 2px);background-size:22px 22px}
html[data-oe-template="03-school-festival"] .gate{border:4px solid #15304f;border-radius:24px;box-shadow:14px 14px 0 #ffe46b;background:#fff;overflow:hidden}
html[data-oe-template="03-school-festival"] .ticket-half.right{background:#fff;border-left:4px solid #15304f}.entry-ticket-label{color:#2e8df5;font-weight:950}.entry-ticket-title{color:#15304f}.entry-ticket-meta>div{border:2px solid #15304f;border-radius:10px;background:#f3f9ff}.stub-barcode{background-color:#15304f}.skip{background:#2e8df5;color:#fff;border:3px solid #15304f;box-shadow:5px 5px 0 #15304f}
`,
'04-museum-editorial':`
html[data-oe-template="04-museum-editorial"] .loader{background:#f7f5f0}
html[data-oe-template="04-museum-editorial"] .gate{width:min(980px,88vw);border:1px solid #aaa397;border-radius:0;box-shadow:none;background:#f7f5f0;grid-template-columns:1.35fr .65fr}
html[data-oe-template="04-museum-editorial"] .entry-photo{filter:saturate(.72);border-radius:0}.ticket-half.right{background:#f7f5f0;border-left:1px solid #aaa397}
html[data-oe-template="04-museum-editorial"] .entry-ticket-label{font-family:Georgia,serif;font-weight:400;color:#7a7268;letter-spacing:.22em}.entry-ticket-title{font-family:Georgia,serif;font-weight:400;font-size:clamp(24px,4vw,44px)}
html[data-oe-template="04-museum-editorial"] .entry-ticket-meta{border-top:1px solid #aaa397;border-bottom:1px solid #aaa397}.entry-ticket-meta>div{border:0;border-right:1px solid #aaa397;border-radius:0;background:transparent}.stub-barcode{opacity:.35}.skip{border:1px solid #191816;border-radius:0;background:transparent;color:#191816;box-shadow:none}
`,
'05-live-poster':`
html[data-oe-template="05-live-poster"] .loader{background:radial-gradient(circle at 50% 30%,#31182a,#08090d 56%);color:#fff}
html[data-oe-template="05-live-poster"] .gate{border:1px solid #555867;border-radius:0;background:#11131b;box-shadow:18px 18px 0 #ff3b74;transform:skewX(-2deg);color:#fff}
html[data-oe-template="05-live-poster"] .entry-photo{border-radius:0;filter:saturate(1.25) contrast(1.08)}.ticket-half.right{background:#0e0f15;border-left:1px solid #555867}
html[data-oe-template="05-live-poster"] .entry-ticket-label{color:#72f5dc;font-style:italic;font-weight:950}.entry-ticket-title{color:#fff;font-style:italic;text-transform:uppercase}.entry-ticket-meta>div{background:#171923;border-color:#444755;color:#fff;border-radius:0}.stub-barcode{filter:invert(1)}.skip{background:#72f5dc;color:#08090d;border:0;border-radius:0;box-shadow:6px 6px 0 #ff3b74}
`,
'06-expo-catalogue':`
html[data-oe-template="06-expo-catalogue"] .loader{background:#deddd8}
html[data-oe-template="06-expo-catalogue"] .gate{width:min(1040px,92vw);grid-template-columns:1.4fr .6fr;border:2px solid #101820;border-radius:0;box-shadow:none;background:#f3f2ee}
html[data-oe-template="06-expo-catalogue"] .entry-photo{border-radius:0}.ticket-half.right{background:#f3f2ee;border-left:2px solid #101820}
html[data-oe-template="06-expo-catalogue"] .entry-ticket-label{display:block;padding:8px;background:#ff5b35;color:#101820;font-weight:950}.entry-ticket-title{font-size:36px;text-transform:uppercase}.entry-ticket-meta{display:block;border-top:2px solid #101820}.entry-ticket-meta>div{display:grid;grid-template-columns:80px 1fr;padding:10px 0;border:0;border-bottom:1px solid #101820;border-radius:0;background:transparent}.stub-barcode{background-color:#101820}.skip{border:2px solid #101820;border-radius:0;background:#ffd94f;color:#101820;box-shadow:none}
`,
'07-immersive-character':`
html[data-oe-template="07-immersive-character"] .loader{background:radial-gradient(circle at center,#1a3150,#080e18 70%);color:#f5efe3}
html[data-oe-template="07-immersive-character"] .gate{width:min(860px,88vw);border:8px solid #6f4f34;border-radius:0;background:#e6d1aa;box-shadow:0 0 0 1px #d7b177,0 24px 80px #0008;color:#2d211a}
html[data-oe-template="07-immersive-character"] .entry-photo{border-radius:0;clip-path:polygon(0 4%,96% 0,100% 96%,4% 100%)}.ticket-half.right{background:linear-gradient(180deg,#efe2c8,#e6d1aa);border-left:4px double #795e43}
html[data-oe-template="07-immersive-character"] .entry-ticket-label{font-family:serif;color:#8f2f2f;letter-spacing:.3em}.entry-ticket-title{font-family:serif;letter-spacing:.08em}.entry-ticket-meta>div{background:transparent;border:1px solid #96795e;border-radius:0}.stub-barcode{opacity:.45}.skip{border:1px solid #d7b177;border-radius:0;background:#10182a;color:#f5efe3;box-shadow:none;font-family:serif;letter-spacing:.15em}
`
};

export function createVariantPreview(id){
  return {id,style:baseStyle+(variants[id]||'')+(structural[id]||'')+(independent[id]||'')+(componentSystems[id]||'')+(entrySystems[id]||''),body:variantBodies[id]||''};
}
