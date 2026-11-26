import {taglineEditorHtml, fieldEditorHtml} from './studio-field-inspector-html.js';

export function createFieldInspector({
  $, getState, setInspector, inspector, esc, setWorkspace, syncStudioPageUI,
  renderPageContentNav, openCollectionManager, setPageContentActive, openItemInspector,
  openTicketSettingsInspector, openAddressInspector, openLifecycleInspector, openSeoInspector,
  openHeroTitleInspector, setDeep, send, getDeep, fitTextarea, cleanValue, save, checkpoint
}) {
  return {
    open(path) {
      const state = getState();
      if (path.startsWith('ribbonItems.')) {
        const i = Number(path.split('.')[1]) || 0;
        setWorkspace('pages');
        syncStudioPageUI('home', {openContent: false});
        renderPageContentNav('home', {openDefault: false});
        openCollectionManager('ribbonItems', i);
        setPageContentActive({collection: 'ribbonItems'});
        openItemInspector('ribbonItems', i);
        return;
      }
      if (path === 'ticketUrl' || path === 'ticketLinkLabel') { openTicketSettingsInspector(); return; }
      if (['date', 'location', 'edition', 'navigationUrl'].includes(path)) { openAddressInspector(); return; }
      if (path === 'eventStatus') { openLifecycleInspector(); return; }
      if (path.startsWith('seo.')) { openSeoInspector(); return; }
      if (path === 'tagline' && state.templateId === '02-scrapbook') {
        setInspector('活动简介', '简介正文', taglineEditorHtml(state.tagline, esc));
        const input = $('#fieldInput');
        fitTextarea(input);
        let started = false;
        input.addEventListener('input', (e) => {
          if (!started) { checkpoint(); started = true; }
          setDeep('tagline', e.target.value);
          send({type: 'OE_PATCH_FIELD', path: 'tagline', value: e.target.value});
          fitTextarea(e.target);
        });
        input.addEventListener('blur', () => save());
        return;
      }
      if (path.startsWith('heroTitle') || ['heroImage', 'mobileHeroImage'].includes(path)) { openHeroTitleInspector(); return; }
      const value = getDeep(path);
      setInspector('内容', '编辑文字', fieldEditorHtml(path, value, esc));
      const input = $('#fieldInput');
      let started = false;
      fitTextarea(input);
      input.addEventListener('input', (e) => {
        if (!started) { checkpoint(); started = true; }
        setDeep(path, e.target.value);
        send({type: 'OE_PATCH_FIELD', path, value: e.target.value});
        fitTextarea(e.target);
      });
      input.addEventListener('blur', (e) => {
        const cleaned = cleanValue(e.target.value);
        if (cleaned !== e.target.value) {
          e.target.value = cleaned;
          setDeep(path, cleaned);
          send({type: 'OE_PATCH_FIELD', path, value: cleaned});
          fitTextarea(e.target);
        }
      });
    }
  };
}
