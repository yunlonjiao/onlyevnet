/* Mobile-native editor shell.
   This does not restyle the desktop sidebar: it moves the page list, content list and
   property form into a dedicated three-screen mobile app with its own navigation. */
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
      <header class="mn-head">
        <button type="button" class="mn-back" data-mn-back aria-label="返回">←</button>
        <div class="mn-title"><b data-mn-title>编辑内容</b><span data-mn-sub>页面</span></div>
        <span class="mn-save">已保存</span>
      </header>
      <main class="mn-main">
        <section class="mn-screen" data-mn-screen="pages"></section>
        <section class="mn-screen" data-mn-screen="contents"></section>
        <section class="mn-screen" data-mn-screen="items"></section>
        <section class="mn-screen" data-mn-screen="fields"></section>
      </main>
      <footer class="mn-foot">
        <button type="button" data-mn-preview>预览</button>
        <button type="button" class="primary" data-mn-publish>发布</button>
      </footer>`;
    document.body.appendChild(app);

    const screens = {
      pages: app.querySelector('[data-mn-screen="pages"]'),
      contents: app.querySelector('[data-mn-screen="contents"]'),
      items: app.querySelector('[data-mn-screen="items"]'),
      fields: app.querySelector('[data-mn-screen="fields"]')
    };
    screens.pages.appendChild(pageNav);
    screens.contents.appendChild(contentBlock);
    screens.fields.appendChild(inspector);
    screens.items.appendChild(contentBlock.querySelector('#contentListPanel'));

    const titleEl = app.querySelector('[data-mn-title]');
    const subEl = app.querySelector('[data-mn-sub]');
    const backBtn = app.querySelector('[data-mn-back]');
    let screen = 'pages';
    let fromManager = false;

    function syncTitle() {
      if (screen === 'pages') { titleEl.textContent = '编辑内容'; subEl.textContent = '选择页面'; }
      else if (screen === 'contents') {
        localizeContentLabels();
        titleEl.textContent = (document.querySelector('#pageContentTitle')?.textContent || '页面内容').trim();
        subEl.textContent = '选择要改的内容';
      } else if (screen === 'items') {
        titleEl.textContent = '选择要改的条目';
        subEl.textContent = '内容';
      } else {
        titleEl.textContent = (inspector.querySelector('.inspector-header b')?.textContent || '编辑').trim();
        subEl.textContent = '属性';
        localizeFields();
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
    }
    function showAllFields() {
      screens.fields.querySelectorAll('.m-field-hidden').forEach((el) => el.classList.remove('m-field-hidden'));
    }
    function simplifyForPhone() {
      if (!isPhone()) return;
      const body = screens.fields.querySelector('.inspector-body');
      if (!body) return;
      body.querySelectorAll('label').forEach((el) => { if (/手机/.test(el.textContent || '')) el.remove(); });
      body.querySelectorAll('.item-media').forEach((el) => { if (/手机/.test(el.textContent || '')) el.remove(); });
      body.querySelectorAll('p,.inspector-note').forEach((el) => { if (/手机/.test(el.textContent || '')) el.remove(); });
      body.querySelectorAll('span,label').forEach((el) => {
        if (!el.children.length) el.textContent = el.textContent.replace(/桌面焦点/g, '焦点');
      });
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
      screen = next;
      app.hidden = false;
      document.body.classList.add('m-native-open');
      Object.entries(screens).forEach(([name, el]) => { el.hidden = name !== next; });
      app.querySelector('.mn-foot').hidden = next === 'fields' || next === 'items';
      syncTitle();
      if (next === 'contents') {
        decorateContentGrid();
        const block = screens.contents.querySelector('.page-content-block');
        block.querySelector('#pageContentNav')?.scrollIntoView({ block: 'start' });
      }
    }
    function hide() {
      app.hidden = true;
      document.body.classList.remove('m-native-open');
    }

    backBtn.addEventListener('click', () => {
      if (screen === 'fields') { show(fromManager ? 'items' : 'contents'); }
      else if (screen === 'items') { show('contents'); }
      else if (screen === 'contents') show('pages');
      else hide();
    });

    screens.pages.addEventListener('click', (event) => {
      if (event.target.closest('[data-mn-back]')) return;
      if (event.target.closest('[data-page]')) setTimeout(() => show('contents'), 0);
    });

    screens.contents.addEventListener('click', (event) => {
      const manager = event.target.closest('[data-page-content-manager]');
      if (event.target.closest('[data-page-tool]')) {
        fromManager = false;
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

    window.__mnDebug={screens,show,get screen(){return screen},get fromManager(){return fromManager}};
    app.querySelector('[data-mn-preview]').addEventListener('click', () => document.querySelector('#previewBtn')?.click());
    app.querySelector('[data-mn-publish]').addEventListener('click', () => document.querySelector('#publishBtn')?.click());

    // Opening the old mobile dock buttons now enters the native shell.
    document.addEventListener('click', (event) => {
      if (!isPhone()) return;
      if (event.target.closest('#mobilePagesBtn')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        show('pages');
      } else if (event.target.closest('#mobileInspectorBtn')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        show('fields');
      }
    }, true);

    // Desktop breakpoints must not be affected.
    addEventListener('resize', () => {
      if (!isPhone() && !app.hidden) hide();
    });
    return true;
  };

  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (ready() || tries > 60) clearInterval(timer);
  }, 100);
})();
