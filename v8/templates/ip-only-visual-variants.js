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

export function createVariantPreview(id){
  return {id,style:baseStyle+(variants[id]||''),body:variantBodies[id]||''};
}
