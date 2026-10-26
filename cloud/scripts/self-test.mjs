import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const worker=read('src/worker.js');
const schema=read('schema.sql');
const app=read('web/admin/app.js');
const publishing=read('web/admin/publishing.js');
const workspace=read('web/admin/workspace.js');
const editor=read('web/admin/editor.html');
const index=read('web/admin/index.html');
let failed=0;
function check(ok,msg){console.log(`${ok?'✓':'✗'} ${msg}`);if(!ok)failed++;}
check(worker.includes("const APP_VERSION='7.26.0'"),'Worker version 7.26.0');
check(schema.includes('CREATE TABLE IF NOT EXISTS project_sites'),'project_sites migration');
check(schema.includes('project_id TEXT PRIMARY KEY')&&schema.includes('site_id TEXT NOT NULL UNIQUE'),'one project ↔ one site constraints');
check(schema.includes('CREATE TABLE IF NOT EXISTS project_media'),'project media tracking');
check(worker.includes("!['jpg','jpeg','png','webp','gif'].includes(ext)"),'SVG upload is rejected');
check(worker.includes("这个网站不属于当前活动项目"),'site ownership/project binding checks');
check(worker.includes('deleteProjectMedia(env'),'permanent project deletion cleans media');
check(worker.includes('site_versions')&&worker.includes('rollbackSite'),'online version history/rollback');
check(worker.includes('site_aliases')&&worker.includes('301'),'old slug redirect support');
check(publishing.includes('线上网站已恢复到上一版；当前编辑草稿没有改变。'),'rollback wording distinguishes online version from draft');
const legacy=['/api/vendor','/api/reviews','/api/desktop','desktopHeartbeat','restoreSampleContent','MYGO','COMIC WAVE'];
check(!legacy.some(x=>app.includes(x)||publishing.includes(x)||workspace.includes(x)),'legacy/vendor/sample code removed');
check(editor.includes('publishing.js'),'publishing code split from editor core');
check(index.includes('workspace.js?v=7.25.0'),'workspace asset cache bust');
check(editor.includes('app.js?v=7.25.0')&&editor.includes('publishing.js?v=7.25.0'),'editor asset cache bust');
check(editor.includes('visualEditToggle')&&editor.includes('visualThemeColor'),'visual editor toolbar');
check(app.includes('cms-visual-edit')&&app.includes('data-ve-key'), 'visual editor inline bridge');
check(app.includes('cms-visual-image')&&app.includes('visualImageUpload'), 'visual editor image bridge');
check(worker.includes("path.startsWith('/admin/')")&&worker.includes('no-store, no-cache, must-revalidate'),'admin assets disable stale cache');
check(!app.includes('DEFAULT_HERO'),'removed undefined DEFAULT_HERO reference');
check(!app.includes('\nasync \n'),'no dangling async token in editor script');
for(const fn of ['buildGuests','guestPlatformLinks','guestWorksHtml','boothSearchText','boothFilterCategories']) check(app.includes(`function ${fn}`),`visitor renderer helper exists: ${fn}`);

for(const key of ['ip-only','doujin-creative','live-stage','theme-visual']) check(index.includes(`data-template="${key}"`),`template available: ${key}`);
check(index.includes('data-filter-group="scene"')&&index.includes('data-filter-group="layout"')&&index.includes('data-filter-group="style"')&&index.includes('data-filter-group="color"'),'template library multi-row filters exist');
check(workspace.includes('function applyTemplateFilters')&&workspace.includes('function resetTemplateFilters'),'template filter behavior exists');
check(index.includes('综合漫展')&&index.includes('同人展')&&index.includes('ONLY 展')&&index.includes('周年企划')&&index.includes('舞台活动'),'template scene filters include requested event categories');
check(workspace.includes("inactive')return '已休眠'"),'dormant publish state visible');

check(index.includes('IP ONLY / 作品主题展')&&index.includes('同人创作展 / 创作者市集')&&index.includes('Live / 舞台演出')&&index.includes('小型主题企划'),'four focused template previews exist');
check(index.includes('data-template="blank"')&&index.includes('空白 CMS'),'blank CMS template is explicit');
check(index.includes('https://preview.onlyevent.cn/preview-v711-ip-only')&&index.includes('templates/同人创作活动-杂志专题型.html')&&index.includes('templates/Live舞台活动-阵容视觉型.html')&&index.includes('templates/小型主题活动-视觉海报型.html'),'template preview links are wired');
check(!index.includes('Anime Expo')&&!index.includes('COMITIA')&&!index.includes('Upperground')&&!index.includes('ChinaJoy'),'reference site names hidden from organizer UI');


check(editor.includes('id="applyDefaultTemplateBtn"'),'one-click default template control exists');
check(app.includes('function applyDefaultTemplatePreset'),'one-click default template behavior exists');
for(const cls of ['comp-dashboard','doujin-toolbelt','live-lineup','small-sheet']) check(app.includes(cls),`distinct visitor layout exists: ${cls}`);
check(!app.includes("config.homeSections=[]"),'one-click template preserves custom home content');


check(app.includes("if(!activePreviewPage)activePreviewPage='index.html'")&&!app.includes("if(visualEditMode){activePreviewPage='index.html'"),'visual editor keeps current preview page');
check(app.includes('guestsPageTitle')&&app.includes('data-ve-object-image="guest:${i}:image"'),'01 guests page supports direct visual editing');
check(app.includes('schedulePageTitle')&&app.includes('data-ve-object-kind="schedule"'),'01 schedule page supports direct visual editing');
check(app.includes('guidePageTitle')&&app.includes('data-ve-key="venueText"')&&app.includes('data-ve-image="transportImage"'),'01 guide page supports direct visual editing');
check(app.includes('sponsorsPageTitle')&&app.includes('data-ve-object-kind="sponsor"'),'01 sponsors page supports direct visual editing');
check(app.includes('data-ve-faq-field')&&app.includes("kind:'faq'"),'01 FAQ page supports direct visual editing');

if(failed){console.error(`\n${failed} checks failed.`);process.exit(1)}
check(app.includes('ip-topbar')&&app.includes('ip-site-nav'),'IP ONLY dedicated navigation parity');
check(app.includes('ip-quick-grid')&&app.includes('ip-specials'),'IP ONLY quick/project component parity');
check(app.includes('ip-booth-layout')&&app.includes('ip-home-map-marker'),'IP ONLY booth-map combined component parity');
check(app.includes('ip-footer-grid')&&app.includes('STAFF / CREDIT'),'IP ONLY dedicated footer parity');

check(app.includes('ve-floating-tools'),'visual floating toolbar');
check(app.includes('cms-visual-object-duplicate'),'visual object duplication');
check(app.includes('cms-visual-edit-live'),'inline live text editing');
check(app.includes("action==='duplicate'"),'visual section duplication');

check(workspace.includes("selectedTemplate==='ip-only'?'/admin/ip01.html?intro=once':'/admin/editor.html'"),'01 creation enters dedicated visual editor');
check(workspace.includes("b.dataset.openTemplate==='ip-only'?'/admin/ip01.html':'/admin/editor.html'"),'01 continue-edit enters dedicated visual editor');
check(app.includes("c.__cmsPreview&&!c.__forceIntroPreview&&!c.__introEditor"),'CMS preview suppresses opening gate outside intro editor');
check(app.includes('previewScrollByPage')&&app.includes('restorePreviewScroll(frame,restoreState)'),'visual preview preserves scroll position across edits');
check(app.includes('setVisualEditMode(true);\n      if(introOnCreate)introPreviewOnce=true;\n      enterPreview();'),'01 bootstrap enables visual mode and optional opening preview');


check(app.includes("id:'ip-only-01-v1'")&&app.includes('heroDesktopAspect:1'),'01 template has dedicated adapter');
check(workspace.includes('/admin/ip01.html?intro=once'),'01 creation previews opening animation once');
check(app.includes('function enterIntroEditor()')&&app.includes('__introEditor'),'opening button enters dedicated opening editor');
check(app.includes("aspect:ip01?1:16/9")&&app.includes('aspect-ratio:1/1'),'01 desktop KV crop matches rendered aspect');
check(app.includes('var(--ip-kv-mobile)')&&app.includes('aspect-ratio:3/4'),'01 mobile KV uses separate 3:4 image');


check(app.includes('.template-ip-only .ip-hero{min-height:auto;align-items:stretch;padding:0 0 96px'), '01 mobile hero uses compact dedicated layout');
check(app.includes('.template-ip-only .ip-hero-art{min-height:0;aspect-ratio:3/4;width:calc(100% - 16px)'), '01 mobile KV uses full-width 3:4 frame');
check(app.includes('.template-ip-only .ip-kv{left:0;right:auto;top:0;width:100%;height:100%'), '01 mobile KV no longer inherits desktop offset');
check(app.includes('.template-ip-only .ip-sticker-b{left:-8px;bottom:74px}')&&app.includes('.template-ip-only .ip-sticker-c{right:8px;bottom:24px}'), '01 mobile stickers stay inside hero composition');


check(app.includes('function readPreviewScroll(frame)'),'preview scroll state capture');
check(app.includes('function restorePreviewScroll(frame,state)'),'preview scroll restoration');
check(app.includes('[60,160,360,700,1200].forEach'),'preview scroll survives late image/layout reflow');

check(app.includes('data-ve-create=')&&app.includes("cms-visual-create"),'01 empty visible areas create real content');
check(app.includes("handleVisualCreate(kind)")&&app.includes("已创建真实内容"),'01 placeholder-to-real-content flow exists');
check(app.includes("homeCommunityHtml(c)||ipOnlyPreviewScaffold(c,'community')")&&app.includes("homeSponsorsHtml(c)||ipOnlyPreviewScaffold(c,'sponsors')"),'01 empty community/sponsor areas editable in CMS only');
check(app.includes("if(!c.__cmsPreview)return ''")&&app.includes("ipOnlyPreviewScaffold(c,'booths')"),'published site avoids fake CMS scaffold content');
check(app.includes('previewAnchorSelector')&&app.includes('state.anchor?.selector')&&app.includes('scrollBy(0,delta)'),'preview scroll restoration uses visible anchor, not only absolute Y');
check(app.includes('function editAnchor(el)')&&app.includes('pendingPreviewAnchor={selector:String(d.anchorSelector)'),'inline edit pins the exact edited element across rerenders');
console.log('\nOnlyEvent self-test passed.');

check(app.includes('introAnimationEnabled')&&app.includes('decorationsEnabled')&&app.includes('mobileDockEnabled'),'IP ONLY visual motion controls');
check(app.includes('ip-ticket-gate')&&app.includes('ip-passport')&&app.includes('ip-scroll-dots'),'IP ONLY deep motion treatment');

check(app.includes("if(p.design)Object.assign(config,clone(p.design))"),'IP ONLY one-click applies visual preset');
check(app.includes('function ipOnlyHeroBlock(c)'),'IP ONLY uses dedicated hero renderer');
check(app.includes('cms-visual-object-select')&&app.includes('data-ve-object-kind'),'IP ONLY object-level visual selection');
check(app.includes('cms-visual-object-image')&&app.includes('handleVisualObjectImage'),'IP ONLY object-level image replacement');
check(app.includes("kind==='project-card'")&&app.includes('setProjectCardPart'),'IP ONLY project-card direct editing');
check(app.includes('cms-visual-module-move')&&app.includes('handleVisualModuleMove'),'IP ONLY drag module ordering');
check(app.includes('cms-visual-object-move')&&app.includes('handleVisualObjectMove'),'IP ONLY drag object ordering');
check(app.includes('cms-visual-map-move')&&app.includes('handleVisualMapMove')&&app.includes('data-ve-map-marker'),'IP ONLY direct map marker dragging');

check(editor.includes('visualUndoBtn')&&editor.includes('visualRedoBtn')&&app.includes('restoreVisualHistory'),'visual editor undo/redo');
check(editor.includes('visualSaveStatus')&&app.includes('visual-save-status'),'visual editor save feedback');
check(app.includes('放到这里')&&app.includes('ve-drop-target'),'visual editor drag placeholder feedback');

check(app.includes('ipOnlyElementStyles'),'element style persistence');
check(app.includes('cms-visual-style-select'),'element style selection bridge');
check(editor.includes('visualStyleControls')&&editor.includes('visualElFontSize'),'element style inspector');
check(app.includes('ipOnlyElementStyleCss'),'published element style css');

check(app.includes('stripVisualEditorArtifacts'),'published output strips visual editor artifacts');
check(worker.includes('\"ip-only\",\"event-portal\",\"doujin-creative\",\"game-immersive\",\"live-stage\",\"theme-visual\"'),'createProject accepts focused templates instead of falling back to blank');
check(worker.includes('\"ip-only\":{\"guests\":true,\"booths\":true'),'IP ONLY seed preset exists in worker');
check(workspace.includes('/admin/ip01.html')&&workspace.includes('/admin/editor.html'),'create flow selects dedicated or blank editor');
check(app.includes("if(config.eventTemplate==='ip-only')")&&app.includes('setVisualEditMode(true);\n      if(introOnCreate)introPreviewOnce=true;\n      enterPreview();'),'01 editor opens visual mode immediately');
check(editor.includes('visualIntroBtn')&&editor.includes('visualIntroControls'),'dedicated opening animation editor exists');
check(editor.includes('visualIntroPreviewBtn')&&app.includes('previewIntroAnimation'),'opening animation has manual replay control');
check(app.includes('__forceIntroPreview')&&app.includes('introPreviewOnce'),'opening preview only replays on explicit request');
check(app.includes('introAnimationStyle')&&app.includes('introHoldMs')&&app.includes('introExitMs'),'opening animation timing and style persist');
check(app.includes('introLogoImage')&&editor.includes('visualIntroLogoUpload'),'opening animation logo is editable');
check(app.includes('ipOnlyLabels')&&app.includes('data-ve-label')&&app.includes("kind:'label'"),'01 visible static labels are directly editable');
check(app.includes('data-ve-object-field')&&app.includes("kind:'objectField'"),'01 visible object text is directly editable');
check(app.includes('data-ve-community-field')&&app.includes("kind:'communityField'"),'01 community visible text is directly editable');
check(app.includes('community.qqQrImage')&&app.includes('community.wechatQrImage'),'01 community QR images are directly replaceable');
check(app.includes("data-ve-object-kind=\"sponsor\"")&&app.includes("kind==='sponsor'"),'01 sponsor logos and objects are directly editable');
check(app.includes('passportZone${i}Title')&&app.includes('ribbonBooths'),'01 passport and ribbon visible labels are editable');


check(app.includes("if(!activePreviewPage)activePreviewPage='index.html'")&&!app.includes("if(visualEditMode){activePreviewPage='index.html'"),'visual editor keeps current preview page');
check(app.includes('guestsPageTitle')&&app.includes('data-ve-object-image="guest:${i}:image"'),'01 guests page supports direct visual editing');
check(app.includes('schedulePageTitle')&&app.includes('data-ve-object-kind="schedule"'),'01 schedule page supports direct visual editing');
check(app.includes('guidePageTitle')&&app.includes('data-ve-key="venueText"')&&app.includes('data-ve-image="transportImage"'),'01 guide page supports direct visual editing');
check(app.includes('sponsorsPageTitle')&&app.includes('data-ve-object-kind="sponsor"'),'01 sponsors page supports direct visual editing');
check(app.includes('data-ve-faq-field')&&app.includes("kind:'faq'"),'01 FAQ page supports direct visual editing');

const ip01html=read('web/admin/ip01.html');
const ip01js=read('web/admin/ip01.js');
check(workspace.includes("'/admin/ip01.html?intro=once'")&&workspace.includes("'/admin/ip01.html'"),'01 creation/open routes to dedicated editor');
check(!ip01html.includes('app.js')&&!ip01html.includes('publishing.js'),'01 editor does not load generic CMS scripts');
check(ip01html.includes('ip01.js?v=7.25.0')&&ip01html.includes('ip01.css?v=7.25.0'),'01 dedicated assets wired');
check(ip01js.includes("config.eventTemplate!=='ip-only'")&&ip01js.includes("location.replace('/admin/editor.html')"),'01 editor rejects non-01 projects');
check(app.includes("location.replace('/admin/ip01.html')"),'blank CMS redirects 01 away from generic editor');
check(ip01js.includes('contenteditable="true"')&&ip01js.includes('data-image'),'01 dedicated WYSIWYG editing exists');
check(ip01js.includes("/api/sites")&&ip01js.includes('renderSite({editing:false'),'01 dedicated editor publishes its own visitor HTML');
check(editor.includes('Blank CMS')&&editor.includes('空白 CMS'),'generic CMS is explicitly blank CMS');

check(ip01html.includes('id="contextPanel"')&&ip01html.includes('id="contextBody"'),'01 contextual inspector shell exists');
check(ip01js.includes('function openTextContext')&&ip01js.includes('function openImageContext'),'01 contextual text/image editing exists');
check(ip01js.includes('function openItemContext')&&ip01js.includes('ITEM_FIELDS'),'01 ticket/booth/schedule context forms exist');
check(ip01js.includes('function openSectionContext')&&ip01js.includes('SECTION_CREATE'),'01 section-specific add/hide controls exist');
check(ip01js.includes("type:'ip01-image-select'")&&!ip01js.includes("else if(d.type==='ip01-image'){selectedImageKey"),'01 image click opens context instead of immediate file dialog');
if(failed){console.error(`\n${failed} checks failed.`);process.exit(1)}


check(ip01js.includes("document.addEventListener('input'") && ip01js.includes("scheduleSave()") && !ip01js.includes("scheduleSave();refresh()});$('#replayIntro"),'01 inline text editing does not rebuild iframe on every keystroke');
check(ip01js.includes('.hero-art{position:relative;min-height:610px}') && ip01js.includes('.quick-grid{display:grid;grid-template-columns:repeat(4,1fr)'),'01 editor uses preview-matched visual system');
check(ip01js.includes('applyIntroLive(key,ev.target.value);scheduleSave()'),'01 opening controls update live without iframe rebuild');

check(ip01html.includes('id="elementPanel"')&&ip01html.includes('id="styleFontSize"'),'01 visual element inspector exists');
check(ip01js.includes('ipOnlyStyles')&&ip01js.includes('updateSelectedStyle')&&ip01js.includes("type:'ip01-select'"),'01 element styles persist as visual code state');
check(ip01js.includes("el.style.fontSize=value||''")&&ip01js.includes("el.style.color=value||''")&&!ip01js.includes("updateSelectedStyle('fontSize'"+');refresh()'),'01 style editing updates live without full preview rebuild');
check(ip01html.includes('id="structurePanel"')&&ip01html.includes('id="hiddenSections"'),'01 visual structure panel exists');
check(ip01js.includes('ipOnlySectionOrder')&&ip01js.includes('ipOnlyHiddenSections'),'01 section order and visibility persist');
check(ip01js.includes("type:'ip01-section-reorder'")&&ip01js.includes('reorderSection'),'01 sections support drag reorder');
check(ip01js.includes("type:'ip01-item-reorder'")&&ip01js.includes('reorderItem'),'01 repeated items support drag reorder');
check(ip01js.includes("itemAction(selectedStructure.path,'duplicate')")&&ip01js.includes("itemAction(selectedStructure.path,'delete')"),'01 repeated content supports duplicate and delete');
check(ip01js.includes('hideSection(selectedStructure.key)')&&ip01js.includes('restoreSection'),'01 sections can hide and restore');


check(index.includes('ONLYEVENT STUDIO')&&index.includes('我的漫展'),'Studio home is simplified around projects');
check(index.includes('dev-only')&&workspace.includes("get('dev')==='1'"),'blank CMS is hidden from ordinary organizers');
check(ip01html.includes('id="previewModeBtn"')&&ip01html.includes('data-jump="tickets"'),'01 Studio has preview mode and simple page navigation');
check(ip01js.includes('renderSite({editing:!previewMode')&&ip01js.includes("renderSite({editing:false"),'editor preview and publish share the same renderer');
check(ip01js.includes("if(previewMode)return")&&ip01js.includes("现在看到的就是游客发布效果"),'preview mode disables editor interactions');
