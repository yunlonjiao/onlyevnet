# Reference Site Code Audit

用于 OnlyEvent 模板还原。以后参考网站不能只看截图，必须同时检查 DOM / CSS / JS / 首次加载状态。

## 01 Anime Expo
- WordPress
- `slider-main`, `slider-intro`
- skrollr: `skrollr`, `skrollable`
- sticky header / navigation
- Restore: hero slider + scroll reveal

## 02 A MAZE. Berlin 2026
- `#splashOverlay`, `#splashTitle`
- `#silverCanvas`
- `marquee`, `poster-scale`, `scroll-container`
- custom cursor / splash ticket links
- Restore: splash + canvas + marquee

## 03 COMITIA
- intentionally mostly static
- sticky `header`, fixed `#main_menu`
- no carousel / loader / scroll animation
- CSS-only accordion via `:has(input:checked)`
- `#top_button`
- Restore: static information architecture + fixed side menu + announcements

## 04 DESIGN FESTA
- WordPress / Emanon Premium Blocks
- `#js-header-menu-fixed`
- `epb-animation-fadeInUp`, `is-epb-scroll`
- floating `cta-floating`
- Restore: sticky header + fade-up + floating CTA, while keeping OnlyEvent magazine renderer

## 05 Sónar
- Next.js
- carousel / image navigation
- Radix UI IDs
- no explicit GSAP / Lenis / Swiper detected
- Restore: rotating hero media + lineup

## 06 MUTEK
- Swiper: `swiper-container`, `swiper-wrapper`, `swiper-slide`
- `home-hero__slider-*`
- sticky menu `header-sticky__menu-toggle`
- slider cursor / lazyloaded
- Restore: sticky header + Swiper hero + timetable

## 07 Wonder Festival
- `#global-loader`
- sticky `.js-header`
- drawer `.js-drawer-hamburger`
- `p-index-gallery`
- `c-bg-wave`
- Restore: loader + drawer + gallery + background-wave language

## 08 OFFF Barcelona
- Wix native motion
- `SITE_PAGES_TRANSITION_GROUP`
- pinned layer `*-pinned-layer`
- repeater / video-box
- Restore: pinned storytelling + creative collage

## 09 ChinaJoy
- Swiper
- Ant Design: `ant-layout`, `ant-row`, `ant-col`
- sticky `main-nav-affix`
- `banner-float-btns`
- `nav-station`, `nav-tabs`
- Restore: sticky portal + banner carousel + quick actions

## 10 gamescom Exhibitors
- `theme-dark`
- `multi-search-filter`
- `autocompletekm`
- `slidetoggle`
- Slick pagination
- Restore: advanced exhibitor search + autocomplete-style input

## 11 18TRIP
- `#loader-bg.visible`, `#loader`
- loader GIF in original
- `is--effect`, `eff--vertical`, `eff--horizon`
- jQuery + common.js + top.js
- Restore: preload layer + section reveal states

## 12 hololive SUPER EXPO
- fixed `#fixed_ticket_link`, `#fixed_lang_change`
- Swiper
- `scroll_on`
- `cmn_rich_link_btn_box`
- Restore: fixed ticket/lang + Swiper + scroll states

## Rule
Reference restoration is based on behavior and structure, not copying copyrighted assets, logos, text, or source code verbatim.
