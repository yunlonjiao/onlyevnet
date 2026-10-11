import {previewStyle as baseStyle} from '/v8/templates/01-ip-only-preview.js?v=8.36.1';
import {variantBodies} from '/v8/templates/ip-only-variant-bodies.js?v=8.36.1';

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

export function createVariantPreview(id){
  return {id,style:baseStyle+(variants[id]||'')+(structural[id]||''),body:variantBodies[id]||''};
}
