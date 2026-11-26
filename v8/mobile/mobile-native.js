/* Mobile-native editor shell: live site + swipeable editor drawer. */
(function () {
  const isPhone = () => innerWidth <= 820 || (matchMedia('(pointer:coarse)').matches && innerHeight <= 560);
  if (!isPhone()) return;

  const ready = () => {
    const pageNav = document.querySelector('.sidebar .page-nav');
    const contentBlock = document.querySelector('.sidebar .page-content-block');
    const inspector = document.querySelector('.inspector');
    if (!pageNav || !contentBlock || !inspector) return false;

    const app = document.createElement('div');
    app.id = 'mNativeApp';
    app.hidden = true;
    app.innerHTML = `
      <div class="mn-grab" aria-hidden="true"></div>
      <header class="mn-head">
        <button type="button" class="mn-back" data-mn-back aria-label="返回">←</button>
        <div class="mn-title"><b data-mn-title>编辑内容</b></div>
        <div class="mn-actions">
          <button type="button" data-mn-preview>预览</button>
          <button type="button" class="primary" data-mn-publish>发布</button>
        </div>
      </header>
      <main class="mn-main">
        <div class="mn-track">
          <section class="mn-screen" data-mn-screen="pages"></section>
          <section class="mn-screen" data-mn-screen="contents"></section>
          <section class="mn-screen" data-mn-screen="items"></section>
          <section class="mn-screen" data-mn-screen="fields"></section>
        </div>
      </main>`;
    document.body.appendChild(app);

    const screens = {
      pages: app.querySelector('[data-mn-screen="pages"]'),
      contents: app.querySelector('[data-mn-screen="contents"]'),
      items: app.querySelector('[data-mn-screen="items"]'),
      fields: app.querySelector('[data-mn-screen="fields"]')
    };
    screens.pages.appendChild(pageNav);
    const createPageBtn=pageNav.querySelector('#createCustomPageBtn');
    if(createPageBtn){const sp=createPageBtn.querySelectorAll('span');if(sp[1])sp[1].textContent='新建页面'}
    screens.contents.appendChild(contentBlock);
    screens.fields.appendChild(inspector);
    screens.items.appendChild(contentBlock.querySelector('#contentListPanel'));

    const titleEl = app.querySelector('[data-mn-title]');
    const track = app.querySelector('.mn-track');
    let mnViewBar = null;
    let sidebarEl = null, sidebarHost = null, sidebarNext = null;
    function detachSidebar() {
      const sb = document.querySelector('.sidebar');
      if (!sb || !sb.parentElement) return;
      sidebarEl = sb; sidebarHost = sb.parentElement; sidebarNext = sb.nextSibling;
      sb.remove();
    }
    function restoreSidebar() {
      if (!sidebarEl || !sidebarHost) return;
      if (sidebarNext && sidebarNext.parentNode === sidebarHost) sidebarHost.insertBefore(sidebarEl, sidebarNext);
      else sidebarHost.appendChild(sidebarEl);
      sidebarEl = null; sidebarHost = null; sidebarNext = null;
    }
    let screen = 'pages';
    let fromManager = false;
    let fromCreatePreset = false;
    let lastEditPath = '';
    let lastSection = '';
    let scrollToken = 0;
    let viewReturnScreen = 'pages';
    document.addEventListener('input', (event) => {
      const el = event.target.closest && event.target.closest('[data-sync-path]');
      if (el) lastEditPath = el.dataset.syncPath || '';
    }, true);
    document.addEventListener('change', (event) => {
      const el = event.target.closest && event.target.closest('[data-sync-path]');
      if (el) lastEditPath = el.dataset.syncPath || '';
    }, true);
    const order = ['pages', 'contents', 'items', 'fields'];
    function syncTitle() {
      if (screen === 'pages') titleEl.textContent = '页面';
      else if (screen === 'contents') {
        localizeContentLabels();
        titleEl.textContent = (document.querySelector('#pageContentTitle')?.textContent || '页面内容').trim();
      } else if (screen === 'items') {
        const t = document.querySelector('#contentListPanel .sidebar-content-head b')?.textContent || '条目';
        titleEl.textContent = t;
      }
      else {
        titleEl.textContent = (inspector.querySelector('.inspector-header b')?.textContent || '编辑').trim();
        localizeFields();
      setTimeout(autoGrowTextareas, 80);
      }
    }
    function localizeContentLabels() {
      screens.contents.querySelectorAll('#pageContentNav button').forEach((btn) => {
        const old = btn.textContent;
        const next = old.replace(/桌面 KV/g, '主图').replace(/手机 KV/g, '主图').replace(/封面 KV/g, '封面图').replace(/\bKV\b/g, '主图');
        if (next !== old) btn.textContent = next;
      });
    }
    function decorateContentGrid() {
      const icons = {basic:'✎',lifecycle:'◷',hero:'▣',cover:'▣',banner:'▤',memo:'✎',intro:'¶',seo:'⌕',recap:'◉',entryAnimation:'▶',updates:'✉',tickets:'◫',map:'⌖',streets:'⌁',traffic:'➜',guide:'ℹ',booths:'☷',socialLinks:'◎',sponsors:'◆',community:'◎'};
      screens.contents.querySelectorAll('#pageContentNav button').forEach((btn) => {
        const key = btn.dataset.pageTool || btn.dataset.pageContentManager || '';
        let icon = icons[key];
        if (!icon) { const t = btn.textContent || ''; icon = /公告|更新/.test(t) ? '✉' : /精选|探索/.test(t) ? '✦' : /票/.test(t) ? '◫' : /地图/.test(t) ? '⌖' : /社群/.test(t) ? '◎' : /赞助/.test(t) ? '◆' : '▢'; }
        btn.dataset.mnIcon = icon;
        btn.dataset.mnKey = key;
      });
      const tpl = document.documentElement.dataset.oeTemplate || new URLSearchParams(location.search).get('template') || '';
      if(tpl.startsWith('01')) screens.contents.querySelectorAll('[data-page-tool="streets"],[data-page-tool="traffic"]').forEach(b=>b.remove());
    }
    function autoGrowTextareas() {
      screens.fields.querySelectorAll('textarea').forEach((ta) => {
        ta.style.height = 'auto';
        ta.style.height = Math.max(40, ta.scrollHeight) + 'px';
      });
    }
    screens.fields.addEventListener('input', (event) => {
      if (event.target.tagName === 'TEXTAREA') autoGrowTextareas();
    });

    function showAllFields() {
      screens.fields.querySelectorAll('.m-field-hidden').forEach((el) => el.classList.remove('m-field-hidden'));
    }
    function simplifyForPhone() {
      if (!isPhone()) return;
      const body = screens.fields.querySelector('.inspector-body');
      if (!body) return;
      const mobileOnly = /手机主图|手机 KV|手机焦点|手机端主图/;
      body.querySelectorAll('label,.item-media,p,.inspector-note').forEach((el) => { if (mobileOnly.test(el.textContent || '')) el.remove(); });
    }
    function localizeFields() {
      showAllFields();
      simplifyForPhone();
      if (isPhone()) {
        screens.fields.querySelectorAll('.inspector-body label').forEach((label) => {
          if (/手机主图|手机 KV/.test(label.textContent || '')) label.remove();
        });
      }
      screens.fields.querySelectorAll('.inspector-body span,.inspector-body label,.inspector-body p').forEach((el) => {
        if (!el.textContent || el.children.length) return;
        el.textContent = el.textContent.replace(/手机主图（可选）/g, '主图').replace(/桌面 KV/g, '主图').replace(/手机 KV/g, '主图').replace(/封面 KV/g, '封面图').replace(/\bKV\b/g, '主图');
      });
    }
    function show(next) {
      restoreSidebar();
      screen = next;
      scrollToken += 1;
      app.hidden = false;
      document.body.classList.remove('m-native-view');
      if (mnViewBar) mnViewBar.hidden = true;
      document.documentElement.classList.remove('m-phone-pending');
      document.body.classList.add('m-native-open', 'm-native-split');
      const idx = Math.max(0, order.indexOf(next));
      const main = app.querySelector('.mn-main');
      if (main) main.scrollLeft = 0;
      if (next === 'pages') { screens.pages.scrollTop = 0; screens.pages.scrollLeft = 0; }
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      document.body.classList.toggle('m-native-fields', next === 'fields');
      syncTitle();
      if (next === 'contents') decorateContentGrid();
      if (next === 'items') setTimeout(pinItemsAddButton, 60);
      app.classList.toggle('is-fields', next === 'fields');
    }
    document.addEventListener('oe-mobile-open-fields', () => show('fields'));
    function schedulePreviewScroll(path) {
      const token = scrollToken;
      [80, 350, 800, 1500].forEach((delay) => setTimeout(() => scrollPreviewToPath(path, token), delay));
    }
    function scrollPreviewToPath(path, token = scrollToken) {
      if (token !== scrollToken) return;
      try {
        const frame = document.querySelector('#liveFrame');
        const doc = frame && frame.contentDocument;
        if (!doc) return;
        let el = null;
        if (path) el = doc.querySelector('[data-oe-field="' + path + '"]') || doc.querySelector('[data-oe-image="' + path + '"]');
        if (!el && path) {
          const p = String(path);
          if (/^hero|^sticker|^tagline$|^date$|^location$|^edition$/.test(p)) el = doc.querySelector('.hero');
          else if (/^ribbon/.test(p)) el = doc.querySelector('.ribbon,#ribbon,.ribbon-track');
          else if (/^ticket/.test(p)) el = doc.querySelector('#tickets,#ticket');
          else if (/^venueMap|^map/.test(p)) el = doc.querySelector('#map-home,#map');
          else if (/^booths|^streets/.test(p)) el = doc.querySelector('#booths');
          else if (/^guests/.test(p)) el = doc.querySelector('#guests,#home-guests');
          else if (/^guide/.test(p)) el = doc.querySelector('#guide,#home-guide');
          else if (/^socialLinks|^community/.test(p)) el = doc.querySelector('#community');
          else if (/^sponsors/.test(p)) el = doc.querySelector('#sponsors');
          else if (/^updates/.test(p)) el = doc.querySelector('#updates');
        }
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const prev = el.style.outline, prevOffset = el.style.outlineOffset;
        el.style.outline = '3px solid #07c160';
        el.style.outlineOffset = '3px';
        setTimeout(() => { if (token === scrollToken) { el.style.outline = prev; el.style.outlineOffset = prevOffset; } }, 1400);
      } catch (error) {}
    }
    function pinItemsAddButton() {
      const add = screens.items.querySelector('.sidebar-content-add, [data-add-custom-item]');
      const rows = screens.items.querySelector('.sidebar-content-rows');
      if (add && rows && add.parentElement === rows.parentElement && rows.previousElementSibling !== add) {
        add.parentElement.insertBefore(add, rows);
      }
    }

    function ensureViewBar() {
      if (mnViewBar) return mnViewBar;
      mnViewBar = document.createElement('header');
      mnViewBar.id = 'mnViewBar';
      mnViewBar.setAttribute('role','navigation');
      mnViewBar.setAttribute('aria-label','预览操作');
      mnViewBar.innerHTML = '<button type="button" data-view-back aria-label="返回">←</button><button type="button" data-view-edit aria-label="编辑页面">编辑</button>';
      mnViewBar.querySelector('[data-view-back]').addEventListener('click', () => { location.assign('/admin/'); });
      mnViewBar.querySelector('[data-view-edit]').addEventListener('click', () => show(viewReturnScreen || 'pages'));
      document.body.appendChild(mnViewBar);
      return mnViewBar;
    }
    function hide() {
      viewReturnScreen = screen;
      detachSidebar();
      app.hidden = true;
      document.body.classList.add('m-native-view');
      ensureViewBar().hidden = false;
      document.body.classList.remove('m-native-open', 'm-native-split', 'm-native-fields');
    }

    app.querySelector('[data-mn-back]').addEventListener('click', () => {
      if (screen === 'fields' && fromCreatePreset) { fromCreatePreset = false; show('pages'); return; }
      if (screen === 'fields') { const p = lastEditPath || lastSection; show(fromManager ? 'items' : 'contents'); schedulePreviewScroll(p); return; }
      else if (screen === 'items') { show('contents'); schedulePreviewScroll(lastSection); }
      else if (screen === 'contents') show('pages');
      else hide();
    });

    screens.pages.addEventListener('click', (event) => {
      if (event.target.closest('[data-page]')) setTimeout(() => show('contents'), 0);
    });
    screens.contents.addEventListener('click', (event) => {
      const customNav = event.target.closest('[data-custom-page-nav]');
      if (customNav) { setTimeout(() => show(customNav.dataset.customPageNav === 'settings' ? 'fields' : 'items'), 80); }
      const hit = event.target.closest('[data-page-tool],[data-page-content-manager]');
      if (hit) lastSection = hit.dataset.pageTool || hit.dataset.pageContentManager || '';
      const manager = event.target.closest('[data-page-content-manager]');
      if (event.target.closest('[data-page-tool]')) {
        fromManager = false;
        fromCreatePreset = false;
        setTimeout(() => show('fields'), 80);
      } else if (manager) {
        fromManager = true;
        setTimeout(() => show('items'), 80);
      }
    });
    screens.items.addEventListener('click', (event) => {
      if (event.target.closest('[data-open-item]')) { fromManager = true; setTimeout(() => show('fields'), 100); }
      if (event.target.closest('[data-sidebar-content-add]')) { fromManager = true; setTimeout(() => show('fields'), 160); }
    });

    function openMobilePreview() {
      const q = new URLSearchParams(location.search);
      const tpl = q.get('template') || '';
      const project = q.get('project') || 'default';
      try {
        const raw = localStorage.getItem('onlyevent-studio-v8:' + tpl + ':' + project + ':iframe') || localStorage.getItem('onlyevent-studio-v8:' + tpl + ':default:iframe') || '{}';
        localStorage.setItem('oe-preview-state:' + tpl + ':' + project, raw);
      } catch (error) {}
      window.open('/v8/preview.html?template=' + encodeURIComponent(tpl) + '&project=' + encodeURIComponent(project), '_blank', 'noopener');
    }
    app.querySelector('[data-mn-preview]').addEventListener('click', openMobilePreview);
    app.querySelector('[data-mn-publish]').addEventListener('click', () => document.querySelector('#publishBtn')?.click());

    // Swipe the editor drawer left/right between page → content → field.
    let sx = 0, sy = 0, swiping = false;
    app.querySelector('.mn-main').addEventListener('touchstart', (event) => {
      if (event.target.closest('input,textarea,select,a,button,[contenteditable="true"]')) return;
      const t = event.touches[0]; sx = t.clientX; sy = t.clientY; swiping = true;
    }, { passive: true });
    app.querySelector('.mn-main').addEventListener('touchend', (event) => {
      if (!swiping) return;
      swiping = false;
      const t = event.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      const idx = Math.max(0, order.indexOf(screen));
      const next = dx < 0 ? Math.min(order.length - 1, idx + 1) : Math.max(0, idx - 1);
      if (next !== idx) show(order[next]);
    }, { passive: true });
    function startSplitEditor(){ if (!app.hidden) return; show('pages'); }
    const waitForCanvas=()=>{
      const frame=document.querySelector('.canvas iframe,.canvas-stage iframe,#canvas iframe');
      if(frame){ setTimeout(startSplitEditor, 400); return; }
      if ((waitForCanvas.tries = (waitForCanvas.tries || 0) + 1) < 40) setTimeout(waitForCanvas, 250);
      else startSplitEditor();
    };
    setTimeout(waitForCanvas, 600);

    document.addEventListener('click', (event) => {
      if (!isPhone()) return;
      if (event.target.closest('[data-custom-page-preset]')) { setTimeout(() => show('pages'), 350); return; }
      if (event.target.closest('#createCustomPageBtn')) { fromCreatePreset = true; setTimeout(() => show('fields'), 80); return; }
    }, true);

    addEventListener('resize', () => {
      if (!isPhone()) {
        restoreSidebar();
        hide();
        document.body.classList.remove('m-native-view');
        if (mnViewBar) mnViewBar.hidden = true;
        document.body.classList.remove('m-native-open', 'm-native-split', 'm-native-fields');
      }
    });
    return true;
  };

  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (ready() || tries > 60) clearInterval(timer);
  }, 100);
})();
