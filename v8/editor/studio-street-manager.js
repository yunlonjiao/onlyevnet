import {streetManagerHtml} from './studio-street-manager-html.js';

export function createStreetManager({$, getState, setInspector, inspector, esc, checkpoint, save, send}) {
  function open() {
    const state = getState();
    setInspector('摊位', '街道', streetManagerHtml(state, esc));
    inspector.querySelectorAll('[data-street-rename]').forEach((input) => input.addEventListener('change', () => {
      const from = input.dataset.streetRename, to = String(input.value || '').trim();
      if (!to || to === from) return;
      checkpoint();
      state.booths = (state.booths || []).map((b) => String(b.street || '') === from ? {...b, street: to} : b);
      state.streets = (state.streets || []).map((s) => String(s.name || '') === from ? {...s, name: to} : s);
      save(); send({type: 'OE_REPLACE_STATE', state}); open();
    }));
    inspector.querySelectorAll('[data-street-delete]').forEach((btn) => btn.addEventListener('click', () => {
      const name = btn.dataset.streetDelete;
      checkpoint();
      state.booths = (state.booths || []).map((b) => String(b.street || '') === name ? {...b, street: ''} : b);
      state.streets = (state.streets || []).filter((s) => String(s.name || '') !== name);
      save(); send({type: 'OE_REPLACE_STATE', state}); open();
    }));
    inspector.querySelectorAll('[data-street-image]').forEach((btn) => btn.addEventListener('click', () => {
      const name = btn.dataset.streetImage;
      state.streets = Array.isArray(state.streets) ? state.streets : [];
      let idx = state.streets.findIndex((s) => String(s.name || '') === name);
      if (idx < 0) {
        state.streets.push({name, image: ''});
        idx = state.streets.length - 1;
        save(); send({type: 'OE_REPLACE_STATE', state});
      }
      const input = $('#imageInput');
      input.dataset.path = 'streets.' + idx + '.image';
      input.click();
    }));
    $('#addStreetBtn')?.addEventListener('click', () => {
      const name = String($('#newStreetName')?.value || '').trim();
      if (!name) return;
      checkpoint();
      state.streets = Array.isArray(state.streets) ? state.streets : [];
      if (!state.streets.some((s) => String(s.name || '') === name)) state.streets.push({name, image: ''});
      save(); send({type: 'OE_REPLACE_STATE', state}); open();
    });
  }
  return {open};
}
